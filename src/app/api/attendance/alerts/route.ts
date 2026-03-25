// ============================================================
// ITSEIA Academy — GET /api/attendance/alerts
// Feature: 007-attendance-tracking
//
// Retorna estudiantes con > 30% de inasistencias en una materia.
// Tambien soporta POST para reconocer una alerta (acknowledged_at).
//
// Query params GET:
//   subject_id  — ID de la materia (requerido)
//   check       — "true" para recalcular alertas antes de retornar
//
// Body PATCH: { alert_id: string } — marca acknowledged_at = now()
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { checkAbsenceAlerts, getActiveAlerts } from "@/features/attendance/alerts";

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const allowedRoles = ["super_admin", "admin", "coordinacion", "docente"];
  if (!profile || !allowedRoles.includes(profile.role)) {
    return Response.json({ error: "Sin permiso." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subject_id");
  const shouldCheck = searchParams.get("check") === "true";

  if (!subjectId) {
    return Response.json({ error: "subject_id es requerido." }, { status: 400 });
  }

  // Docentes solo acceden a sus materias
  if (profile.role === "docente") {
    const { data: subject } = await supabase
      .from("subjects")
      .select("teacher_id")
      .eq("id", subjectId)
      .single();

    if (!subject || subject.teacher_id !== user.id) {
      return Response.json({ error: "Sin permiso para esta materia." }, { status: 403 });
    }
  }

  try {
    const alerts = shouldCheck
      ? await checkAbsenceAlerts(subjectId)
      : await getActiveAlerts(subjectId);

    return Response.json({ alerts, count: alerts.length });
  } catch (error) {
    console.error("[API] Error consultando alertas:", error);
    return Response.json({ error: "Error interno." }, { status: 500 });
  }
}

/**
 * PATCH /api/attendance/alerts
 * Reconoce una alerta: marca acknowledged_at = now()
 * Body: { alert_id: string }
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const allowedRoles = ["super_admin", "admin", "coordinacion", "docente"];
  if (!profile || !allowedRoles.includes(profile.role)) {
    return Response.json({ error: "Sin permiso." }, { status: 403 });
  }

  const body = await request.json() as { alert_id?: string };
  if (!body.alert_id) {
    return Response.json({ error: "alert_id es requerido." }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("absence_alerts")
    .update({
      acknowledged_at: new Date().toISOString(),
      acknowledged_by: user.id,
    })
    .eq("id", body.alert_id);

  if (error) {
    console.error("[API] Error reconociendo alerta:", error);
    return Response.json({ error: "Error actualizando alerta." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
