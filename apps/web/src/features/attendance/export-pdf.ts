// ============================================================
// ITSEIA Academy — Exportacion PDF de asistencia
// Feature: 007-attendance-tracking
//
// Genera PDF usando jsPDF (misma libreria de pdf-certificate.ts).
// Layout: header institucional, tabla de asistencia por estudiante,
// pie de pagina con evidencia SENESCYT.
// ============================================================

import { jsPDF } from "jspdf";
import type { AttendanceReport } from "@/types/database";

// Colores ITSEIA
const NAVY      = [31, 47, 88] as [number, number, number];    // #1F2F58
const NAVY_DARK = [10, 22, 40] as [number, number, number];    // #0A1628
const YELLOW    = [251, 188, 12] as [number, number, number];  // #FBBC0C
const LIGHT_BLUE = [115, 184, 231] as [number, number, number]; // #73B8E7
const WHITE     = [255, 255, 255] as [number, number, number];
const GRAY_LIGHT = [248, 248, 248] as [number, number, number];
const GRAY_MED  = [200, 200, 200] as [number, number, number];
const GRAY_TEXT = [80, 80, 80] as [number, number, number];

const GREEN     = [34, 197, 94] as [number, number, number];   // estado present
const AMBER     = [245, 158, 11] as [number, number, number];  // estado partial
const RED       = [239, 68, 68] as [number, number, number];   // estado absent / critico

/**
 * Genera el PDF del reporte de asistencia.
 * @returns ArrayBuffer con el contenido del PDF listo para descargar.
 */
export function generateAttendancePDF(report: AttendanceReport): ArrayBuffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth  = doc.internal.pageSize.getWidth();   // 210mm
  const pageHeight = doc.internal.pageSize.getHeight();  // 297mm
  const marginL = 14;
  const marginR = 14;
  const contentWidth = pageWidth - marginL - marginR;

  let y = 0;

  // ── HEADER ──────────────────────────────────────────────────
  // Fondo header navy
  doc.setFillColor(...NAVY_DARK);
  doc.rect(0, 0, pageWidth, 32, "F");

  // Acento amarillo lateral
  doc.setFillColor(...YELLOW);
  doc.rect(0, 0, 3, 32, "F");

  // Nombre institucional
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...YELLOW);
  doc.text("ITSEIA", marginL + 4, 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...LIGHT_BLUE);
  doc.text("Instituto Ecuatoriano de Inteligencia Artificial", marginL + 4, 17);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...WHITE);
  doc.text("REPORTE DE ASISTENCIA", marginL + 4, 25);

  // Fecha generacion (derecha)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...GRAY_MED);
  doc.text(
    `Generado: ${new Date(report.generated_at).toLocaleString("es-EC")}`,
    pageWidth - marginR,
    25,
    { align: "right" }
  );

  y = 40;

  // ── INFO DE MATERIA ──────────────────────────────────────────
  doc.setFillColor(...GRAY_LIGHT);
  doc.rect(marginL, y - 4, contentWidth, 22, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text(`${report.subject_code} — ${report.subject_name}`, marginL + 3, y + 3);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...GRAY_TEXT);
  doc.text(
    `Periodo: ${report.period_from.slice(0, 10)} al ${report.period_to.slice(0, 10)}   |   Sesiones realizadas: ${report.sessions.length}   |   Estudiantes: ${report.students.length}`,
    marginL + 3,
    y + 10
  );

  y += 28;

  // ── TABLA DE ESTUDIANTES ─────────────────────────────────────
  const colWidths = {
    nombre:    68,
    presente:  18,
    parcial:   18,
    ausente:   18,
    total:     18,
    pct:       22,
    estado:    20,
  };
  const rowH = 8;

  // Cabecera de tabla
  doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.rect(marginL, y - 5, contentWidth, rowH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);

  let cx = marginL + 2;
  doc.text("Estudiante", cx, y);                         cx += colWidths.nombre;
  doc.text("Pres.", cx, y, { align: "center" });         cx += colWidths.presente;
  doc.text("Parc.", cx, y, { align: "center" });         cx += colWidths.parcial;
  doc.text("Aus.", cx, y, { align: "center" });          cx += colWidths.ausente;
  doc.text("Total", cx, y, { align: "center" });         cx += colWidths.total;
  doc.text("% Asist.", cx, y, { align: "center" });      cx += colWidths.pct;
  doc.text("Estado", cx, y, { align: "center" });

  y += rowH;

  // Filas de estudiantes
  doc.setFont("helvetica", "normal");
  let rowIndex = 0;

  for (const student of report.students) {
    // Paginar si necesario
    if (y > pageHeight - 25) {
      doc.addPage();
      y = 20;

      // Repetir cabecera en nueva pagina
      doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
      doc.rect(marginL, y - 5, contentWidth, rowH, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      let rcx = marginL + 2;
      doc.text("Estudiante", rcx, y);                         rcx += colWidths.nombre;
      doc.text("Pres.", rcx, y, { align: "center" });         rcx += colWidths.presente;
      doc.text("Parc.", rcx, y, { align: "center" });         rcx += colWidths.parcial;
      doc.text("Aus.", rcx, y, { align: "center" });          rcx += colWidths.ausente;
      doc.text("Total", rcx, y, { align: "center" });         rcx += colWidths.total;
      doc.text("% Asist.", rcx, y, { align: "center" });      rcx += colWidths.pct;
      doc.text("Estado", rcx, y, { align: "center" });
      y += rowH;
      doc.setFont("helvetica", "normal");
    }

    // Fondo alternado
    if (rowIndex % 2 === 0) {
      doc.setFillColor(250, 250, 252);
      doc.rect(marginL, y - 5, contentWidth, rowH, "F");
    }

    // Determinar color de estado
    const pct = student.attendance_percentage;
    const [stateColor, stateLabel] =
      pct >= 80 ? [GREEN,  "REGULAR"]
      : pct >= 60 ? [AMBER, "RIESGO"]
      : [RED,   "CRITICO"];

    doc.setFontSize(7.5);
    doc.setTextColor(40, 40, 40);

    cx = marginL + 2;
    // Nombre (truncar si muy largo)
    const maxNameWidth = colWidths.nombre - 3;
    const nameStr = doc.splitTextToSize(student.student_name, maxNameWidth)[0] as string;
    doc.text(nameStr, cx, y);
    cx += colWidths.nombre;

    doc.setTextColor(GREEN[0], GREEN[1], GREEN[2]);
    doc.text(String(student.sessions_present), cx, y, { align: "center" });
    cx += colWidths.presente;

    doc.setTextColor(AMBER[0], AMBER[1], AMBER[2]);
    doc.text(String(student.sessions_partial), cx, y, { align: "center" });
    cx += colWidths.parcial;

    doc.setTextColor(RED[0], RED[1], RED[2]);
    doc.text(String(student.sessions_absent), cx, y, { align: "center" });
    cx += colWidths.ausente;

    doc.setTextColor(60, 60, 60);
    doc.text(String(student.total_sessions), cx, y, { align: "center" });
    cx += colWidths.total;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(stateColor[0], stateColor[1], stateColor[2]);
    doc.text(`${pct.toFixed(1)}%`, cx, y, { align: "center" });
    cx += colWidths.pct;

    // Badge de estado
    doc.setFillColor(stateColor[0], stateColor[1], stateColor[2]);
    doc.roundedRect(cx - 1, y - 4.5, colWidths.estado - 1, 5.5, 1, 1, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.text(stateLabel, cx + (colWidths.estado - 2) / 2 - 1, y - 0.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    y += rowH;
    rowIndex++;
  }

  // ── RESUMEN ESTADISTICO ──────────────────────────────────────
  y += 5;
  if (y > pageHeight - 40) {
    doc.addPage();
    y = 20;
  }

  const totalStudents   = report.students.length;
  const regularCount    = report.students.filter((s) => s.attendance_percentage >= 80).length;
  const riesgoCount     = report.students.filter((s) => s.attendance_percentage >= 60 && s.attendance_percentage < 80).length;
  const criticoCount    = report.students.filter((s) => s.attendance_percentage < 60).length;

  doc.setFillColor(GRAY_LIGHT[0], GRAY_LIGHT[1], GRAY_LIGHT[2]);
  doc.rect(marginL, y - 4, contentWidth, 28, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]);
  doc.text("Resumen del periodo", marginL + 3, y + 2);

  const col = contentWidth / 4;
  const stats = [
    { label: "Total estudiantes", value: totalStudents, color: [60, 60, 60] as [number, number, number] },
    { label: "Regular (>= 80%)",  value: regularCount,  color: GREEN  },
    { label: "En riesgo (60-80%)", value: riesgoCount,  color: AMBER  },
    { label: "Critico (< 60%)",   value: criticoCount,  color: RED    },
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  stats.forEach((stat, i) => {
    const sx = marginL + 3 + i * col;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(stat.color[0], stat.color[1], stat.color[2]);
    doc.text(String(stat.value), sx, y + 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(GRAY_TEXT[0], GRAY_TEXT[1], GRAY_TEXT[2]);
    doc.text(stat.label, sx, y + 20);
  });

  // ── PIE DE PAGINA ────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerY = pageHeight - 8;

    doc.setDrawColor(LIGHT_BLUE[0], LIGHT_BLUE[1], LIGHT_BLUE[2]);
    doc.setLineWidth(0.3);
    doc.line(marginL, footerY - 4, pageWidth - marginR, footerY - 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "Generado por ITSEIA Platform — Evidencia de cumplimiento para SENESCYT (Art. 61 RRA 2022 y Reglamento IST RPC-SE-04-No.012-2023)",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );
    doc.text(`Pagina ${i} de ${totalPages}`, pageWidth - marginR, footerY, { align: "right" });
  }

  return doc.output("arraybuffer") as ArrayBuffer;
}

/**
 * Genera el nombre de archivo para la descarga del PDF.
 */
export function getPDFFilename(report: AttendanceReport): string {
  const date = new Date(report.generated_at).toISOString().slice(0, 10);
  const code = report.subject_code.replace(/[^a-zA-Z0-9]/g, "-");
  return `asistencia-${code}-${date}.pdf`;
}
