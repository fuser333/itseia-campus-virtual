"use client";

// ============================================================
// ITSEIA Academy — Boton de exportacion de asistencia
// Feature: 007-attendance-tracking
//
// Selector de rango de fechas + botones CSV y PDF.
// Se puede usar standalone en cualquier vista admin/docente.
// ============================================================

import { useState } from "react";
import { Download, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttendanceExportProps {
  subjectId: string;
  subjectName?: string;
}

export function AttendanceExport({ subjectId, subjectName }: AttendanceExportProps) {
  const now = new Date();
  const defaultFrom = `${now.getFullYear()}-01-01`;
  const defaultTo   = now.toISOString().slice(0, 10);

  const [from, setFrom] = useState(defaultFrom);
  const [to,   setTo]   = useState(defaultTo);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport(format: "csv" | "pdf") {
    const setter = format === "csv" ? setExportingCSV : setExportingPDF;
    setter(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        subject_id: subjectId,
        from: `${from}T00:00:00Z`,
        to:   `${to}T23:59:59Z`,
        format,
      });
      const res = await fetch(`/api/attendance/export?${params.toString()}`);

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${await res.text()}`);
      }

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] || `asistencia-${subjectId}.${format}`;

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Error al generar el archivo. Intente nuevamente.");
      console.error(err);
    } finally {
      setter(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Calendar className="size-4 text-[#73B8E7]" />
        <span className="text-sm font-semibold text-gray-800">
          Exportar asistencia{subjectName ? ` — ${subjectName}` : ""}
        </span>
      </div>

      {/* Rango de fechas */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Desde</label>
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
            className="h-8 rounded-lg border border-gray-200 px-2.5 text-sm outline-none focus:border-[#1F2F58] focus:ring-2 focus:ring-[#1F2F58]/10"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Hasta</label>
          <input
            type="date"
            value={to}
            min={from}
            max={defaultTo}
            onChange={(e) => setTo(e.target.value)}
            className="h-8 rounded-lg border border-gray-200 px-2.5 text-sm outline-none focus:border-[#1F2F58] focus:ring-2 focus:ring-[#1F2F58]/10"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-wrap gap-2">
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
          Exportar CSV
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
          Exportar PDF (SENESCYT)
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      <p className="mt-3 text-xs text-gray-400">
        El PDF incluye encabezado institucional y pie de evidencia para SENESCYT
        (Art. 61 RRA 2022).
      </p>
    </div>
  );
}
