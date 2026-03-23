"use client";

// ============================================================
// ITSEIA Academy — Tabla de reporte de asistencia
// Feature: 007-attendance-tracking
//
// Muestra la matriz estudiante x sesion con:
//   - Colores: verde (present), amarillo (partial), rojo (absent), gris (sin registro)
//   - Barra de porcentaje por estudiante
//   - Override manual por celda con dialog de razon
//   - Boton exportar CSV y PDF
// ============================================================

import { useState, useCallback } from "react";
import {
  Loader2,
  Download,
  CheckCircle2,
  AlertCircle,
  MinusCircle,
  HelpCircle,
  Pencil,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type {
  AttendanceReport as AttendanceReportData,
  AttendanceCell,
  AttendanceStatus,
} from "@/types/database";

interface AttendanceReportProps {
  report: AttendanceReportData;
  subjectId: string;
  periodFrom: string;
  periodTo: string;
  canExport?: boolean;
  onReload?: () => void;
}

function StatusIcon({ status }: { status: AttendanceCell["status"] }) {
  if (status === "present")
    return <CheckCircle2 className="mx-auto size-4 text-emerald-600" />;
  if (status === "partial")
    return <MinusCircle className="mx-auto size-4 text-amber-500" />;
  if (status === "absent")
    return <AlertCircle className="mx-auto size-4 text-red-500" />;
  return <HelpCircle className="mx-auto size-4 text-gray-300" />;
}

function StatusLabel({ status }: { status: AttendanceCell["status"] }) {
  const map: Record<string, string> = {
    present: "Presente",
    partial: "Parcial",
    absent: "Ausente",
    no_record: "Sin dato",
  };
  return <>{map[status] ?? status}</>;
}

function PercentageBar({ value }: { value: number }) {
  const color =
    value >= 80
      ? "bg-emerald-500"
      : value >= 60
      ? "bg-amber-400"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span
        className={`w-12 text-right text-xs font-semibold tabular-nums ${
          value >= 80
            ? "text-emerald-700"
            : value >= 60
            ? "text-amber-600"
            : "text-red-600"
        }`}
      >
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

interface OverrideDialogProps {
  cell: AttendanceCell;
  studentName: string;
  sessionTitle: string;
  onClose: () => void;
  onSave: (status: AttendanceStatus, reason: string) => Promise<void>;
}

function OverrideDialog({
  cell,
  studentName,
  sessionTitle,
  onClose,
  onSave,
}: OverrideDialogProps) {
  const [status, setStatus] = useState<AttendanceStatus>(
    cell.status === "no_record" ? "present" : (cell.status as AttendanceStatus)
  );
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!reason.trim()) return;
    setSaving(true);
    await onSave(status, reason.trim());
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Ajuste manual de asistencia
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              {studentName} &middot; {sessionTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:text-gray-700"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold text-gray-600">
            Estado corregido
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["present", "partial", "absent"] as AttendanceStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  status === s
                    ? s === "present"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : s === "partial"
                      ? "border-amber-400 bg-amber-50 text-amber-700"
                      : "border-red-400 bg-red-50 text-red-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {s === "present" ? "Presente" : s === "partial" ? "Parcial" : "Ausente"}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-1.5 block text-xs font-semibold text-gray-600">
            Razon del ajuste <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej: Estudiante presento certificado medico..."
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#1F2F58] focus:ring-2 focus:ring-[#1F2F58]/10"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            size="sm"
            disabled={!reason.trim() || saving}
            onClick={handleSave}
            className="bg-[#1F2F58] text-white hover:bg-[#2A3F6E]"
          >
            {saving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5" />
            )}
            Guardar ajuste
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AttendanceReport({
  report,
  subjectId,
  periodFrom,
  periodTo,
  canExport = true,
  onReload,
}: AttendanceReportProps) {
  const [overrideTarget, setOverrideTarget] = useState<{
    studentId: string;
    studentName: string;
    liveSessionId: string;
    sessionTitle: string;
    cell: AttendanceCell;
  } | null>(null);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const buildExportUrl = useCallback(
    (format: "csv" | "pdf") => {
      const params = new URLSearchParams({
        subject_id: subjectId,
        from: periodFrom,
        to: periodTo,
        format,
      });
      return `/api/attendance/export?${params.toString()}`;
    },
    [subjectId, periodFrom, periodTo]
  );

  async function handleExport(format: "csv" | "pdf") {
    const setter = format === "csv" ? setExportingCSV : setExportingPDF;
    setter(true);
    try {
      const url = buildExportUrl(format);
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error en la descarga");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="([^"]+)"/);
      link.download = match?.[1] || `asistencia.${format}`;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Error exportando:", err);
    } finally {
      setter(false);
    }
  }

  async function handleOverrideSave(status: AttendanceStatus, reason: string) {
    if (!overrideTarget) return;

    const { attendanceId } = {
      attendanceId: overrideTarget.cell.attendance_id,
    };

    if (!attendanceId) {
      // No hay registro previo — crear uno via upsert simplificado
      await fetch("/api/attendance/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          live_session_id: overrideTarget.liveSessionId,
          user_id: overrideTarget.studentId,
          status,
          override_reason: reason,
          is_manual_override: true,
        }),
      });
    } else {
      await fetch("/api/attendance/override", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendance_id: attendanceId,
          status,
          override_reason: reason,
          is_manual_override: true,
        }),
      });
    }

    setOverrideTarget(null);
    onReload?.();
  }

  const { sessions, students, matrix } = report;

  if (students.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
        No hay estudiantes matriculados para mostrar en este periodo.
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      {canExport && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-emerald-500" /> Presente (&gt;=60%)
            </span>
            <span className="flex items-center gap-1">
              <MinusCircle className="size-3.5 text-amber-400" /> Parcial (10-60%)
            </span>
            <span className="flex items-center gap-1">
              <AlertCircle className="size-3.5 text-red-500" /> Ausente (&lt;10%)
            </span>
            <span className="flex items-center gap-1">
              <HelpCircle className="size-3.5 text-gray-300" /> Sin dato
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={exportingCSV}
              onClick={() => handleExport("csv")}
              className="gap-1.5"
            >
              {exportingCSV ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              CSV
            </Button>
            <Button
              size="sm"
              disabled={exportingPDF}
              onClick={() => handleExport("pdf")}
              className="gap-1.5 bg-[#1F2F58] text-white hover:bg-[#2A3F6E]"
            >
              {exportingPDF ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              PDF SENESCYT
            </Button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="min-w-[200px] whitespace-nowrap">
                Estudiante
              </TableHead>
              {sessions.map((s) => (
                <TableHead
                  key={s.live_session_id}
                  className="text-center text-xs"
                  title={s.session_title}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-bold">#{s.session_number}</span>
                    <span className="font-normal text-gray-400 max-w-[60px] truncate">
                      {new Date(s.started_at).toLocaleDateString("es-EC", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                </TableHead>
              ))}
              <TableHead className="min-w-[140px] whitespace-nowrap">
                Asistencia
              </TableHead>
              <TableHead className="text-center whitespace-nowrap text-xs">
                Resumen
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, idx) => (
              <TableRow
                key={student.student_id}
                className={idx % 2 === 0 ? "" : "bg-gray-50/50"}
              >
                <TableCell>
                  <div className="font-medium text-gray-900 text-sm">
                    {student.student_name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {student.student_email}
                  </div>
                </TableCell>

                {sessions.map((session) => {
                  const cell = matrix[student.student_id]?.[session.live_session_id];
                  const cellData = cell ?? {
                    status: "no_record" as const,
                    duration_seconds: null,
                    is_manual_override: false,
                    attendance_id: null,
                  };

                  return (
                    <TableCell
                      key={session.live_session_id}
                      className="text-center"
                    >
                      <button
                        type="button"
                        title={`${student.student_name} — Sesion #${session.session_number}: ${
                          cellData.status === "present"
                            ? "Presente"
                            : cellData.status === "partial"
                            ? "Parcial"
                            : cellData.status === "absent"
                            ? "Ausente"
                            : "Sin dato"
                        }${cellData.is_manual_override ? " (ajuste manual)" : ""}. Click para editar.`}
                        onClick={() =>
                          setOverrideTarget({
                            studentId: student.student_id,
                            studentName: student.student_name,
                            liveSessionId: session.live_session_id,
                            sessionTitle: `Sesion #${session.session_number} — ${session.session_title}`,
                            cell: cellData,
                          })
                        }
                        className={`group relative inline-flex size-7 items-center justify-center rounded-md transition-all hover:scale-110 hover:ring-2 hover:ring-[#1F2F58]/30 ${
                          cellData.is_manual_override
                            ? "ring-1 ring-[#FBBC0C]/60"
                            : ""
                        }`}
                      >
                        <StatusIcon status={cellData.status} />
                        {cellData.is_manual_override && (
                          <Pencil className="absolute -right-0.5 -top-0.5 size-2.5 text-[#FBBC0C]" />
                        )}
                      </button>
                    </TableCell>
                  );
                })}

                {/* Barra de porcentaje */}
                <TableCell className="min-w-[140px]">
                  <PercentageBar value={student.attendance_percentage} />
                </TableCell>

                {/* Resumen conteos */}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 px-1.5 py-0.5 text-emerald-700"
                    >
                      {student.sessions_present}P
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-amber-50 px-1.5 py-0.5 text-amber-700"
                    >
                      {student.sessions_partial}Pa
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-red-50 px-1.5 py-0.5 text-red-700"
                    >
                      {student.sessions_absent}A
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de override */}
      {overrideTarget && (
        <OverrideDialog
          cell={overrideTarget.cell}
          studentName={overrideTarget.studentName}
          sessionTitle={overrideTarget.sessionTitle}
          onClose={() => setOverrideTarget(null)}
          onSave={handleOverrideSave}
        />
      )}
    </>
  );
}
