// ============================================================
// ITSEIA Academy — GET /api/attendance/export
// Feature: 007-attendance-tracking
//
// Genera y retorna el archivo de exportacion en CSV o PDF.
// Query params:
//   subject_id  — ID de la materia (requerido)
//   from        — Fecha inicio ISO (opcional, default: inicio del anio)
//   to          — Fecha fin ISO (opcional, default: hoy)
//   format      — "csv" | "pdf" (opcional, default: "csv")
//
// Control de acceso: admin/coordinacion/super_admin para ambos formatos.
// Docente puede exportar solo sus propias materias en CSV.
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { buildAttendanceReport } from "@/features/attendance/report";
import { generateAttendanceCSV, getCSVFilename } from "@/features/attendance/export-csv";
import { generateAttendancePDF, getPDFFilename } from "@/features/attendance/export-pdf";

export async function GET(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("No autenticado.", { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const allowedRoles = ["super_admin", "admin", "coordinacion", "docente"];
  if (!profile || !allowedRoles.includes(profile.role)) {
    return new Response("Sin permiso.", { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subject_id");
  const format    = (searchParams.get("format") || "csv").toLowerCase();

  if (!subjectId) {
    return new Response("subject_id es requerido.", { status: 400 });
  }

  if (format !== "csv" && format !== "pdf") {
    return new Response("format debe ser csv o pdf.", { status: 400 });
  }

  // Docentes solo acceden a sus materias
  if (profile.role === "docente") {
    const { data: subject } = await supabase
      .from("subjects")
      .select("teacher_id")
      .eq("id", subjectId)
      .single();

    if (!subject || subject.teacher_id !== user.id) {
      return new Response("Sin permiso para esta materia.", { status: 403 });
    }
  }

  const now = new Date();
  const periodFrom = searchParams.get("from") || `${now.getFullYear()}-01-01T00:00:00Z`;
  const periodTo   = searchParams.get("to")   || now.toISOString();

  try {
    const report = await buildAttendanceReport(subjectId, periodFrom, periodTo);
    if (!report) {
      return new Response("Materia no encontrada.", { status: 404 });
    }

    if (format === "csv") {
      const csv = generateAttendanceCSV(report);
      const filename = getCSVFilename(report);
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // PDF
    const pdfBytes = generateAttendancePDF(report);
    const filename = getPDFFilename(report);
    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[API] Error generando exportacion:", error);
    return new Response("Error interno generando exportacion.", { status: 500 });
  }
}
