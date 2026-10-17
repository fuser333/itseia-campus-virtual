// ============================================================
// ITSEIA Academy — GET /api/sessions/[id]/live
// Retorna la sala activa (o historial) de una sesion academica
// Valida que el usuario autenticado tiene acceso a esa materia
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    // ── 1. Autenticar usuario ──
    const authClient = await createClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    // ── 2. Verificar que la sesion academica existe ──
    const { data: academicSession } = await supabaseAdmin
      .from("sessions")
      .select("id, subject_id")
      .eq("id", sessionId)
      .single();

    if (!academicSession) {
      return Response.json({ error: "Sesion no encontrada." }, { status: 404 });
    }

    // ── 3. Verificar que el usuario tiene acceso (matriculado, docente, admin) ──
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin =
      profile && ["super_admin", "admin", "coordinacion"].includes(profile.role);

    if (!isAdmin) {
      // Verificar si es docente asignado a esta materia
      const { data: subject } = await supabaseAdmin
        .from("subjects")
        .select("teacher_id, semester_id")
        .eq("id", academicSession.subject_id)
        .single();

      const isTeacher = subject?.teacher_id === user.id;

      if (!isTeacher) {
        // Verificar si esta matriculado en el programa
        const { data: semester } = await supabaseAdmin
          .from("semesters")
          .select("program_id")
          .eq("id", subject?.semester_id || "")
          .single();

        const { count } = await supabaseAdmin
          .from("enrollments")
          .select("id", { count: "exact" })
          .eq("user_id", user.id)
          .eq("program_id", semester?.program_id || "")
          .eq("status", "active");

        if ((count || 0) === 0) {
          return Response.json(
            { error: "No tienes acceso a esta sesion." },
            { status: 403 }
          );
        }
      }
    }

    // ── 4. Obtener sala activa ──
    const { data: activeLiveSession } = await supabaseAdmin
      .from("live_sessions")
      .select("*")
      .eq("session_id", sessionId)
      .eq("is_active", true)
      .maybeSingle();

    // ── 5. Obtener historial de salas pasadas (con grabacion) ──
    const { data: pastSessions } = await supabaseAdmin
      .from("live_sessions")
      .select("id, started_at, ended_at, recording_url, planned_duration_minutes")
      .eq("session_id", sessionId)
      .eq("is_active", false)
      .not("ended_at", "is", null)
      .order("started_at", { ascending: false })
      .limit(10);

    return Response.json({
      active: activeLiveSession || null,
      history: pastSessions || [],
    });
  } catch (error) {
    console.error("Error en GET /api/sessions/[id]/live:", error);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
