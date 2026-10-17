// ============================================================
// ITSEIA Academy — Exportacion CSV de asistencia
// Feature: 007-attendance-tracking
//
// Genera CSV compatible con Excel (UTF-8 BOM) con columnas:
// Nombre, Cedula, Materia, Sesiones Presentes, Parciales,
// Ausentes, Total, % Asistencia — formato para SENESCYT.
// ============================================================

import type { AttendanceReport } from "@/types/database";

/** BOM UTF-8 para compatibilidad con Excel en Windows */
const UTF8_BOM = "\uFEFF";

/** Escapa un valor para CSV: envuelve en comillas si contiene comas, comillas o saltos */
function csvEscape(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Genera el contenido CSV del reporte de asistencia.
 * El string retornado incluye BOM UTF-8 para compatibilidad con Excel en Windows.
 */
export function generateAttendanceCSV(report: AttendanceReport): string {
  const lines: string[] = [];

  // Encabezado institucional
  lines.push(csvEscape("ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial"));
  lines.push(csvEscape("Reporte de Asistencia — Evidencia para SENESCYT"));
  lines.push("");

  // Metadata del reporte
  lines.push([
    csvEscape("Materia:"),
    csvEscape(`${report.subject_code} - ${report.subject_name}`),
  ].join(","));

  lines.push([
    csvEscape("Periodo:"),
    csvEscape(`${report.period_from.slice(0, 10)} al ${report.period_to.slice(0, 10)}`),
  ].join(","));

  lines.push([
    csvEscape("Generado:"),
    csvEscape(new Date(report.generated_at).toLocaleString("es-EC")),
  ].join(","));

  lines.push([
    csvEscape("Total sesiones sincronicas:"),
    csvEscape(report.sessions.length),
  ].join(","));

  lines.push("");

  // Cabecera de la tabla
  lines.push([
    csvEscape("Nombre Estudiante"),
    csvEscape("Correo"),
    csvEscape("Materia"),
    csvEscape("Codigo Materia"),
    csvEscape("Sesiones Presentes"),
    csvEscape("Sesiones Parciales"),
    csvEscape("Sesiones Ausentes"),
    csvEscape("Total Sesiones"),
    csvEscape("% Asistencia"),
    csvEscape("Estado"),
  ].join(","));

  // Filas de estudiantes
  for (const student of report.students) {
    const estado =
      student.attendance_percentage >= 80
        ? "REGULAR"
        : student.attendance_percentage >= 60
        ? "RIESGO"
        : "CRITICO";

    lines.push([
      csvEscape(student.student_name),
      csvEscape(student.student_email),
      csvEscape(student.subject_name),
      csvEscape(student.subject_code),
      csvEscape(student.sessions_present),
      csvEscape(student.sessions_partial),
      csvEscape(student.sessions_absent),
      csvEscape(student.total_sessions),
      csvEscape(`${student.attendance_percentage.toFixed(2)}%`),
      csvEscape(estado),
    ].join(","));
  }

  lines.push("");
  lines.push(csvEscape("* Presente: >= 60% de la duracion de la clase"));
  lines.push(csvEscape("* Parcial: >= 10% y < 60% de la duracion de la clase"));
  lines.push(csvEscape("* Ausente: < 10% de la duracion o sin registro"));
  lines.push(csvEscape("* % Asistencia = (Presentes + 0.5*Parciales) / Total * 100"));

  return UTF8_BOM + lines.join("\n");
}

/**
 * Genera el nombre de archivo para la descarga.
 */
export function getCSVFilename(report: AttendanceReport): string {
  const date = new Date(report.generated_at).toISOString().slice(0, 10);
  const code = report.subject_code.replace(/[^a-zA-Z0-9]/g, "-");
  return `asistencia-${code}-${date}.csv`;
}
