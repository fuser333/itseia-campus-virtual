"use client";

// ============================================================
// ITSEIA Academy — Docente: Asistencia por materia
// Feature: 007-attendance-tracking
//
// Vista del docente para consultar la asistencia de sus materias.
// Tabs:
//   1. Reporte — matriz estudiante x sesion con exportacion
//   2. Alertas — estudiantes con > 30% de inasistencias
// ============================================================

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  ClipboardList,
  BellRing,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  AttendanceReport as AttendanceReportData,
  AlertItem,
} from "@/types/database";
import { AttendanceReport } from "@/components/attendance/AttendanceReport";
import { AttendanceAlert } from "@/components/attendance/AttendanceAlert";
import { AttendanceExport } from "@/components/attendance/AttendanceExport";

interface SubjectOption {
  id: string;
  code: string;
  name: string;
}

type TabId = "reporte" | "alertas";

export default function TeacherAsistenciaPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  // Materias asignadas al docente
  const [subjects, setSubjects]       = useState<SubjectOption[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabId>("reporte");

  // Tab reporte
  const [selectedSubject, setSelectedSubject]   = useState("");
  const [reportFrom, setReportFrom]             = useState(`${new Date().getFullYear()}-01-01`);
  const [reportTo,   setReportTo]               = useState(new Date().toISOString().slice(0, 10));
  const [reportLoading, setReportLoading]       = useState(false);
  const [report, setReport]                     = useState<AttendanceReportData | null>(null);

  // Tab alertas
  const [alertSubject, setAlertSubject]         = useState("");
  const [alerts, setAlerts]                     = useState<AlertItem[]>([]);
  const [alertsLoading, setAlertsLoading]       = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      setSubjectsLoading(true);
      const { data } = await supabase
        .from("subjects")
        .select("id, code, name")
        .eq("teacher_id", user.id)
        .eq("is_active", true)
        .order("name");

      setSubjects(data || []);
      setSubjectsLoading(false);
    }
    init();
  }, []);

  async function loadReport() {
    if (!selectedSubject) return;
    setReportLoading(true);
    setReport(null);
    try {
      const params = new URLSearchParams({
        subject_id: selectedSubject,
        from: `${reportFrom}T00:00:00Z`,
        to:   `${reportTo}T23:59:59Z`,
      });
      const res = await fetch(`/api/attendance/report?${params.toString()}`);
      if (res.ok) {
        const data = await res.json() as AttendanceReportData;
        setReport(data);
      }
    } finally {
      setReportLoading(false);
    }
  }

  async function loadAlerts() {
    if (!alertSubject) return;
    setAlertsLoading(true);
    setAlerts([]);
    try {
      const res = await fetch(
        `/api/attendance/alerts?subject_id=${alertSubject}&check=true`
      );
      if (res.ok) {
        const data = await res.json() as { alerts: AlertItem[] };
        setAlerts(data.alerts || []);
      }
    } finally {
      setAlertsLoading(false);
    }
  }

  const TABS = [
    { id: "reporte" as TabId, label: "Reporte de Asistencia", icon: ClipboardList },
    { id: "alertas" as TabId, label: "Alertas de Inasistencia", icon: BellRing    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Asistencia</h1>
        <p className="mt-1 text-sm text-gray-500">
          Consulta y exporta la asistencia de tus materias. Recibe alertas de estudiantes
          con inasistencia acumulada mayor al 30%.
        </p>
      </div>

      {subjectsLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
        </div>
      ) : subjects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 py-16 text-center">
          <Users className="mx-auto size-8 text-gray-300" />
          <p className="mt-2 text-sm text-gray-400">
            No tienes materias asignadas como docente.
          </p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#1F2F58] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="size-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── TAB: Reporte ── */}
          {activeTab === "reporte" && (
            <div className="space-y-5">
              {/* Filtros */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">
                      Materia
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="h-8 min-w-[260px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                    >
                      <option value="">Seleccionar materia...</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          [{s.code}] {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Desde</label>
                    <input
                      type="date"
                      value={reportFrom}
                      max={reportTo}
                      onChange={(e) => setReportFrom(e.target.value)}
                      className="h-8 rounded-lg border border-gray-200 px-2.5 text-sm outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">Hasta</label>
                    <input
                      type="date"
                      value={reportTo}
                      min={reportFrom}
                      onChange={(e) => setReportTo(e.target.value)}
                      className="h-8 rounded-lg border border-gray-200 px-2.5 text-sm outline-none"
                    />
                  </div>
                  <Button
                    disabled={!selectedSubject || reportLoading}
                    onClick={loadReport}
                    className="bg-[#1F2F58] text-white hover:bg-[#2A3F6E]"
                  >
                    {reportLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ClipboardList className="size-4" />
                    )}
                    Ver reporte
                  </Button>
                </div>
              </div>

              {/* Widget exportacion */}
              {selectedSubject && (
                <AttendanceExport
                  subjectId={selectedSubject}
                  subjectName={subjects.find((s) => s.id === selectedSubject)?.name}
                />
              )}

              {/* Reporte */}
              {reportLoading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
                  <span className="ml-2 text-sm text-gray-400">Cargando asistencia...</span>
                </div>
              )}

              {report && !reportLoading && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      {report.subject_code} — {report.subject_name}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {report.sessions.length} sesiones &middot;{" "}
                      {report.students.length} estudiantes
                    </p>
                  </div>
                  <AttendanceReport
                    report={report}
                    subjectId={selectedSubject}
                    periodFrom={`${reportFrom}T00:00:00Z`}
                    periodTo={`${reportTo}T23:59:59Z`}
                    canExport={true}
                    onReload={loadReport}
                  />
                </div>
              )}

              {!report && !reportLoading && selectedSubject && (
                <div className="rounded-lg border border-dashed border-gray-200 py-12 text-center text-sm text-gray-400">
                  Selecciona el periodo y haz click en "Ver reporte".
                </div>
              )}
            </div>
          )}

          {/* ── TAB: Alertas ── */}
          {activeTab === "alertas" && (
            <div className="space-y-5">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500">
                      Materia
                    </label>
                    <select
                      value={alertSubject}
                      onChange={(e) => setAlertSubject(e.target.value)}
                      className="h-8 min-w-[260px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
                    >
                      <option value="">Seleccionar materia...</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          [{s.code}] {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    disabled={!alertSubject || alertsLoading}
                    onClick={loadAlerts}
                    className="gap-2 bg-[#1F2F58] text-white hover:bg-[#2A3F6E]"
                  >
                    {alertsLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <BellRing className="size-4" />
                    )}
                    Verificar alertas
                  </Button>
                </div>
              </div>

              {alertsLoading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
                  <span className="ml-2 text-sm text-gray-400">Verificando alertas...</span>
                </div>
              )}

              {!alertsLoading && alertSubject && (
                <>
                  {alerts.length > 0 ? (
                    <AttendanceAlert
                      alerts={alerts}
                      onAcknowledge={(id) =>
                        setAlerts((prev) => prev.filter((a) => a.id !== id))
                      }
                    />
                  ) : (
                    <div className="rounded-lg border border-dashed border-emerald-200 bg-emerald-50 py-12 text-center">
                      <CheckCircle2 className="mx-auto size-8 text-emerald-400" />
                      <p className="mt-2 text-sm font-medium text-emerald-700">
                        Sin alertas activas
                      </p>
                      <p className="mt-1 text-xs text-emerald-600">
                        Ningun estudiante supera el 30% de inasistencias en esta materia.
                      </p>
                    </div>
                  )}
                </>
              )}

              {!alertsLoading && !alertSubject && (
                <div className="rounded-lg border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
                  Selecciona una materia para verificar alertas.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
