"use client";

// ============================================================
// /admin/docentes/capacitacion — Reporte de capacitacion docente
// Para coordinacion / CES evidence export
// ============================================================

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Download,
  CheckCircle2,
  Clock,
  Users,
  Award,
  Plus,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveExternalHours } from "@/features/teacher/actions";
import type { TeacherCapacitacionRow } from "@/types/database";
import { jsPDF } from "jspdf";

export default function AdminDocentesCapacitacionPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [rows, setRows] = useState<TeacherCapacitacionRow[]>([]);

  // External hours form
  const [showExternalForm, setShowExternalForm] = useState<string | null>(null);
  const [externalHours, setExternalHours] = useState("");
  const [externalDesc, setExternalDesc] = useState("");
  const [savingExternal, setSavingExternal] = useState(false);
  const [externalMessage, setExternalMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["super_admin", "admin", "coordinacion"].includes(profile.role)) {
      setLoading(false);
      return;
    }
    setAuthorized(true);

    const res = await fetch("/api/teacher/capacitacion-report");
    if (res.ok) {
      setRows(await res.json());
    }
    setLoading(false);
  }

  async function handleSaveExternal(teacherId: string) {
    const hours = parseFloat(externalHours);
    if (!hours || hours <= 0 || !externalDesc.trim()) return;

    setSavingExternal(true);
    setExternalMessage("");
    const result = await saveExternalHours(teacherId, hours, externalDesc);
    if (result.success) {
      setExternalMessage("Horas registradas correctamente.");
      setExternalHours("");
      setExternalDesc("");
      setShowExternalForm(null);
      await loadData();
    } else {
      setExternalMessage(result.error || "Error registrando horas");
    }
    setSavingExternal(false);
  }

  function exportCSV() {
    const header = ["Nombre", "Email", "Materias", "Horas completadas", "Estado", "Fecha certificado"];
    const csvRows = rows.map((r) => [
      r.teacherName,
      r.teacherEmail,
      r.subjects.join(" | "),
      r.hoursCompleted.toFixed(1),
      r.status === "certificado" ? "Certificado" : "En progreso",
      r.certifiedAt
        ? new Date(r.certifiedAt).toLocaleDateString("es-EC")
        : "",
    ]);

    const csv =
      [header, ...csvRows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-capacitacion-docentes-itseia-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = 297;
    const H = 210;

    // Header background
    doc.setFillColor(31, 47, 88);
    doc.rect(0, 0, W, 22, "F");

    // Yellow accent
    doc.setFillColor(251, 188, 12);
    doc.rect(0, 0, W, 3, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE DE CAPACITACION DOCENTE — ITSEIA", W / 2, 13, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 200, 230);
    doc.text(
      `Generado: ${new Date().toLocaleDateString("es-EC", { day: "numeric", month: "long", year: "numeric" })}  |  Requisito: Art. 61 RRA 2022 — 120h formacion docente virtual`,
      W / 2,
      19,
      { align: "center" }
    );

    // Table header
    const cols = [60, 65, 55, 35, 35, 35];
    const colX = [12];
    for (let i = 1; i < cols.length; i++) {
      colX.push(colX[i - 1] + cols[i - 1]);
    }
    const headers = ["Nombre del Docente", "Email", "Materias Asignadas", "Horas / 120", "Estado", "Cert. Fecha"];

    let y = 32;
    doc.setFillColor(240, 243, 250);
    doc.rect(10, y - 4, W - 20, 8, "F");
    doc.setTextColor(31, 47, 88);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    headers.forEach((h, i) => {
      doc.text(h, colX[i] + 2, y, { maxWidth: cols[i] - 4 });
    });

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);

    for (const row of rows) {
      if (y > H - 20) {
        doc.addPage();
        y = 20;
      }

      const certified = row.status === "certificado";
      if (!certified) {
        doc.setFillColor(255, 250, 235);
        doc.rect(10, y - 3.5, W - 20, 7, "F");
      }

      doc.setTextColor(certified ? 30 : 120, certified ? 30 : 80, 30);
      doc.text(row.teacherName, colX[0] + 2, y, { maxWidth: cols[0] - 4 });
      doc.setTextColor(80, 80, 80);
      doc.text(row.teacherEmail, colX[1] + 2, y, { maxWidth: cols[1] - 4 });
      doc.text(row.subjects.join(", ") || "—", colX[2] + 2, y, { maxWidth: cols[2] - 4 });
      doc.text(`${row.hoursCompleted.toFixed(1)} / 120`, colX[3] + 2, y);

      // Status badge color
      if (certified) {
        doc.setTextColor(0, 120, 60);
        doc.setFont("helvetica", "bold");
        doc.text("Certificado", colX[4] + 2, y);
      } else {
        doc.setTextColor(180, 100, 0);
        doc.setFont("helvetica", "normal");
        doc.text("En progreso", colX[4] + 2, y);
      }

      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(
        row.certifiedAt
          ? new Date(row.certifiedAt).toLocaleDateString("es-EC", { day: "2-digit", month: "2-digit", year: "numeric" })
          : "—",
        colX[5] + 2,
        y
      );

      y += 8;

      // Row divider
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.2);
      doc.line(10, y - 2, W - 10, y - 2);
    }

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(6.5);
    doc.text(
      "Este reporte es evidencia para el expediente CES conforme al Art. 61 RRA 2022. ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial.",
      W / 2,
      H - 6,
      { align: "center" }
    );

    doc.save(`reporte-capacitacion-docentes-itseia-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        No tienes permiso para ver esta pagina.
      </div>
    );
  }

  const certified = rows.filter((r) => r.status === "certificado").length;
  const inProgress = rows.length - certified;

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="size-4" data-icon="inline-start" />
              Volver al admin
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Capacitacion Docente — Reporte CES
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Estado de capacitacion de todos los docentes activos. Art. 61 RRA 2022.
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Exportar CSV
          </Button>
          <Button
            onClick={exportPDF}
            size="sm"
            className="gap-2 bg-[#1F2F58] hover:bg-[#2A3F6E] text-white"
          >
            <Download className="size-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#1F2F58]/10">
              <Users className="size-5 text-[#1F2F58]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{rows.length}</p>
              <p className="text-xs text-gray-500">Docentes activos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100">
              <CheckCircle2 className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{certified}</p>
              <p className="text-xs text-gray-500">Con certificado 120h</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#FBBC0C]/20">
              <Clock className="size-5 text-[#FBBC0C]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#FBBC0C]">{inProgress}</p>
              <p className="text-xs text-gray-500">En progreso</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {externalMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {externalMessage}
        </div>
      )}

      {/* Teachers table */}
      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Users className="mx-auto size-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">
              No hay docentes registrados con rol "docente" en el sistema.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Docente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Materias
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Horas / 120
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Certificado
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row) => {
                    const percentage = Math.min(
                      Math.round((row.hoursCompleted / 120) * 100),
                      100
                    );
                    const isExpanded = showExternalForm === row.teacherId;

                    return (
                      <>
                        <tr
                          key={row.teacherId}
                          className={`hover:bg-gray-50 ${
                            !row.hasCertificate ? "bg-yellow-50/30" : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">
                              {row.teacherName}
                            </p>
                            <p className="text-xs text-gray-400">{row.teacherEmail}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px]">
                            {row.subjects.length === 0 ? (
                              <span className="text-gray-300">Sin materias</span>
                            ) : (
                              row.subjects.join(", ")
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-sm font-semibold text-gray-900">
                                {row.hoursCompleted.toFixed(1)} / 120h
                              </span>
                              <div className="w-24 h-1.5 rounded-full bg-gray-200">
                                <div
                                  className={`h-1.5 rounded-full ${
                                    row.hasCertificate ? "bg-emerald-500" : "bg-[#1F2F58]"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-gray-400">
                                {percentage}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {row.hasCertificate ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                <CheckCircle2 className="size-3" />
                                Certificado
                              </span>
                            ) : (
                              <span className="inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                                En progreso
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-gray-400">
                            {row.certifiedAt
                              ? new Date(row.certifiedAt).toLocaleDateString("es-EC", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setShowExternalForm(isExpanded ? null : row.teacherId)
                              }
                              className="gap-1.5 text-xs text-[#1F2F58]"
                            >
                              {isExpanded ? (
                                <X className="size-3.5" />
                              ) : (
                                <Plus className="size-3.5" />
                              )}
                              Horas externas
                            </Button>
                          </td>
                        </tr>

                        {/* External hours form row */}
                        {isExpanded && (
                          <tr key={`${row.teacherId}-ext`} className="bg-blue-50/30">
                            <td colSpan={6} className="px-4 py-3">
                              <div className="flex items-end gap-3 flex-wrap">
                                <div className="grid gap-1">
                                  <Label className="text-xs">Horas externas</Label>
                                  <Input
                                    type="number"
                                    value={externalHours}
                                    onChange={(e) => setExternalHours(e.target.value)}
                                    placeholder="Ej: 20"
                                    min={1}
                                    className="h-8 w-24 text-sm"
                                  />
                                </div>
                                <div className="grid gap-1 flex-1 min-w-[200px]">
                                  <Label className="text-xs">
                                    Descripcion de la capacitacion externa
                                  </Label>
                                  <Input
                                    value={externalDesc}
                                    onChange={(e) => setExternalDesc(e.target.value)}
                                    placeholder="Ej: Curso Moodle certificado SENESCYT"
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <Button
                                  size="sm"
                                  disabled={
                                    savingExternal ||
                                    !externalHours ||
                                    !externalDesc.trim()
                                  }
                                  onClick={() => handleSaveExternal(row.teacherId)}
                                  className="gap-2 bg-[#1F2F58] hover:bg-[#2A3F6E] text-white h-8"
                                >
                                  {savingExternal ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="size-3.5" />
                                  )}
                                  Registrar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CES note */}
      <Card className="border-[#73B8E7]/20 bg-[#73B8E7]/5">
        <CardContent className="py-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold text-[#1F2F58]">Evidencia para CES:</span> Este reporte
            puede exportarse en PDF para adjuntarlo al expediente institucional. El Art. 61 RRA 2022
            exige que los docentes de modalidad en linea acrediten 120 horas de formacion en docencia
            virtual antes de iniciar actividades de ensenanza.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
