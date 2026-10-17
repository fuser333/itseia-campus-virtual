// ============================================================
// ITSEIA Academy — GET /api/attendance/report
// Feature: 007-attendance-tracking
//
// Retorna el reporte de asistencia consolidado por materia y periodo.
// Control de acceso:
//   - Admin / coordinacion / super_admin: puede ver cualquier materia
//   - Docente: solo puede ver materias donde es teacher_id
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { buildAttendanceReport } from "@/features/attendance/report";

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

  if (!subjectId) {
    return Response.json({ error: "subject_id es requerido." }, { status: 400 });
  }

  // Validar que docente solo accede a sus materias
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

  // Periodo: default = inicio del ano actual hasta hoy
  const now = new Date();
  const defaultFrom = `${now.getFullYear()}-01-01T00:00:00Z`;
  const defaultTo   = now.toISOString();

  const periodFrom = searchParams.get("from") || defaultFrom;
  const periodTo   = searchParams.get("to")   || defaultTo;

  try {
    const report = await buildAttendanceReport(subjectId, periodFrom, periodTo);
    if (!report) {
      return Response.json({ error: "Materia no encontrada." }, { status: 404 });
    }
    return Response.json(report);
  } catch (error) {
    console.error("[API] Error generando reporte:", error);
    return Response.json({ error: "Error interno generando reporte." }, { status: 500 });
  }
}
