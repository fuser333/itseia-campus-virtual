// ============================================================
// ITSEIA Academy — POST /api/daily/create-room
// Crea sala Daily.co y registra en live_sessions
// Requiere rol docente, coordinacion, admin o super_admin
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const DAILY_API_BASE = "https://api.daily.co/v1";

export async function POST(request: Request) {
  try {
    // ── 1. Autenticar usuario ──
    const authClient = await createClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    // ── 2. Verificar rol (docente o superior) ──
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const allowedRoles = ["super_admin", "admin", "coordinacion", "docente"];
    if (!profile || !allowedRoles.includes(profile.role)) {
      return Response.json(
        { error: "No tienes permisos para iniciar clases." },
        { status: 403 }
      );
    }

    // ── 3. Parsear body ──
    const body = await request.json();
    const { sessionId, plannedDurationMinutes = 90 } = body as {
      sessionId: string;
      plannedDurationMinutes?: number;
    };

    if (!sessionId) {
      return Response.json(
        { error: "sessionId es requerido." },
        { status: 400 }
      );
    }

    // ── 4. Verificar que la sesion academica existe ──
    const { data: academicSession, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("id, subject_id")
      .eq("id", sessionId)
      .single();

    if (sessionError || !academicSession) {
      return Response.json(
        { error: "Sesion academica no encontrada." },
        { status: 404 }
      );
    }

    // ── 5. Verificar que no hay sala activa para esa sesion ──
    const { data: existingRoom } = await supabaseAdmin
      .from("live_sessions")
      .select("id, daily_room_url")
      .eq("session_id", sessionId)
      .eq("is_active", true)
      .maybeSingle();

    if (existingRoom) {
      return Response.json(
        { error: "Ya existe una sala activa para esta sesion.", liveSession: existingRoom },
        { status: 409 }
      );
    }

    // ── 6. Crear sala en Daily.co ──
    const roomName = `itseia-${sessionId.substring(0, 8)}-${Date.now()}`;
    const expTimestamp = Math.floor(Date.now() / 1000) + plannedDurationMinutes * 60 + 1800; // +30min buffer

    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    let dailyRoomUrl: string;
    let dailyRoomName: string;

    if (!DAILY_API_KEY || DAILY_API_KEY === "placeholder") {
      // Modo mock cuando no hay API key configurada
      dailyRoomName = roomName;
      dailyRoomUrl = `https://itseia.daily.co/${roomName}`;
      console.warn("[Daily.co] DAILY_API_KEY no configurada — usando modo mock");
    } else {
      const dailyResponse = await fetch(`${DAILY_API_BASE}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          name: roomName,
          privacy: "private",
          properties: {
            exp: expTimestamp,
            enable_recording: "cloud",
            enable_chat: true,
            enable_knocking: false,
            start_video_off: false,
            start_audio_off: false,
            max_participants: 50,
          },
        }),
      });

      if (!dailyResponse.ok) {
        const errorText = await dailyResponse.text();
        console.error("[Daily.co] Error creando sala:", errorText);
        return Response.json(
          { error: "Error al crear la sala de videoconferencia." },
          { status: 502 }
        );
      }

      const dailyRoom = await dailyResponse.json() as { name: string; url: string };
      dailyRoomName = dailyRoom.name;
      dailyRoomUrl = dailyRoom.url;
    }

    // ── 7. Persistir en live_sessions ──
    const { data: liveSession, error: insertError } = await supabaseAdmin
      .from("live_sessions")
      .insert({
        session_id: sessionId,
        daily_room_name: dailyRoomName,
        daily_room_url: dailyRoomUrl,
        created_by: user.id,
        is_active: true,
        planned_duration_minutes: plannedDurationMinutes,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[DB] Error insertando live_session:", insertError);
      return Response.json(
        { error: "Error al registrar la sala en la base de datos." },
        { status: 500 }
      );
    }

    return Response.json({ liveSession }, { status: 201 });
  } catch (error) {
    console.error("Error en POST /api/daily/create-room:", error);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
