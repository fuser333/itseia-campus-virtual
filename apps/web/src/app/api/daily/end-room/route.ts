// ============================================================
// ITSEIA Academy — POST /api/daily/end-room
// Finaliza una sala Daily.co activa y actualiza live_sessions
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

    // ── 2. Parsear body ──
    const body = await request.json();
    const { liveSessionId } = body as { liveSessionId: string };

    if (!liveSessionId) {
      return Response.json(
        { error: "liveSessionId es requerido." },
        { status: 400 }
      );
    }

    // ── 3. Obtener live_session y verificar permisos ──
    const { data: liveSession, error: fetchError } = await supabaseAdmin
      .from("live_sessions")
      .select("id, daily_room_name, created_by, is_active")
      .eq("id", liveSessionId)
      .single();

    if (fetchError || !liveSession) {
      return Response.json(
        { error: "Sala no encontrada." },
        { status: 404 }
      );
    }

    if (!liveSession.is_active) {
      return Response.json(
        { error: "La sala ya fue finalizada." },
        { status: 409 }
      );
    }

    // Verificar que el usuario es el creador o tiene rol admin
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = profile && ["super_admin", "admin", "coordinacion"].includes(profile.role);
    const isCreator = liveSession.created_by === user.id;

    if (!isAdmin && !isCreator) {
      return Response.json(
        { error: "No tienes permisos para finalizar esta sala." },
        { status: 403 }
      );
    }

    // ── 4. Eliminar sala en Daily.co (si hay API key configurada) ──
    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    if (DAILY_API_KEY && DAILY_API_KEY !== "placeholder") {
      try {
        const deleteResponse = await fetch(
          `${DAILY_API_BASE}/rooms/${liveSession.daily_room_name}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${DAILY_API_KEY}` },
          }
        );
        if (!deleteResponse.ok) {
          console.warn(
            "[Daily.co] No se pudo eliminar la sala (puede que ya no exista):",
            liveSession.daily_room_name
          );
        }
      } catch (e) {
        // No bloquear si Daily falla — igual actualizamos la DB
        console.warn("[Daily.co] Error al eliminar sala:", e);
      }
    }

    // ── 5. Marcar sala como inactiva en DB ──
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("live_sessions")
      .update({
        is_active: false,
        ended_at: new Date().toISOString(),
      })
      .eq("id", liveSessionId)
      .select()
      .single();

    if (updateError) {
      console.error("[DB] Error actualizando live_session:", updateError);
      return Response.json(
        { error: "Error al finalizar la sala en la base de datos." },
        { status: 500 }
      );
    }

    return Response.json({ liveSession: updated });
  } catch (error) {
    console.error("Error en POST /api/daily/end-room:", error);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
