"use client";

// ============================================================
// ITSEIA Academy — Admin: Asistencia y Cumplimiento Sincronico
// Feature: 007-attendance-tracking (extiende spec 002)
//
// Tabs:
//   1. Cumplimiento CES — tabla del 51% por materia (spec 002)
//   2. Reporte Detallado — matriz estudiante x sesion por materia
//   3. Alertas           — estudiantes con > 30% de inasistencias
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  Download,
  AlertTriangle,
  CheckCircle2,
  BarChart2,
  Filter,
  Video,
  Users,
  ClipboardList,
  BellRing,
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
import type { Program, AttendanceReport as AttendanceReportData, AlertItem } from "@/types/database";
import { AttendanceReport } from "@/components/attendance/AttendanceReport";
import { AttendanceAlert } from "@/components/attendance/AttendanceAlert";
import { AttendanceExport } from "@/components/attendance/AttendanceExport";

// ── Tipos para tab CES ──────────────────────────────────────
interface ComplianceRow {
  program_id: string;
  program_name: string;
  career_code: string | null;
  subject_id: string;
  subject_code: string;
  subject_name: string;
  semester_number: number;
  total_sessions: number;
  sessions_with_live: number;
  compliance_pct: number;
  total_attendances: number;
}

// ── Tipos para tab reporte ──────────────────────────────────
interface SubjectOption {
  id: string;
  code: string;
  name: string;
}

type TabId = "ces" | "reporte" | "alertas";

export default function AsistenciaPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<TabId>("ces");

  // ── Estado tab CES ──
  const [rows, setRows]         = useState<ComplianceRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [careers, setCareers]   = useState<Program[]>([]);
  const [selectedCareer, setSelectedCareer] = useState("");

  // ── Estado tab Reporte ──
  const [subjects, setSubjects]     = useState<SubjectOption[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport]         = useState<AttendanceReportData | null>(null);
  const [reportFrom, setReportFrom] = useState(`${new Date().getFullYear()}-01-01`);
  const [reportTo, setReportTo]     = useState(new Date().toISOString().slice(0, 10));

  // ── Estado tab Alertas ──
  const [alertSubject, setAlertSubject]   = useState("");
  const [alerts, setAlerts]               = useState<AlertItem[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);

  // ── Cargar carreras ──
  useEffect(() => {
    supabase
      .from("programs")
      .select("*")
      .eq("type", "carrera")
      .order("name")
      .then(({ data }) => setCareers(data || []));

    supabase
      .from("subjects")
      .select("id, code, name")
      .eq("is_active", true)
      .order("name")
      .then(({ data }) => setSubjects(data || []));
  }, []);

  // ── Cargar datos de cumplimiento CES ──
  const fetchCompliance = useCallback(async () => {
    setLoading(true);
    try {
      let subjectsQuery = supabase
        .from("subjects")
        .select(`
          id, code, name,
          semesters:semester_id ( number, program_id, programs:program_id ( id, name, career_code ) )
        `)
        .eq("is_active", true);

      if (selectedCareer) {
        const { data: sems } = await supabase
          .from("semesters")
          .select("id")
          .eq("program_id", selectedCareer);
        const semIds = sems?.map((s) => s.id) || [];
        if (semIds.length === 0) {
          setRows([]);
          setLoading(false);
          return;
        }
        subjectsQuery = subjectsQuery.in("semester_id", semIds);
      }

      const { data: subjectsList } = await subjectsQuery.order("name");

      if (!subjectsList || subjectsList.length === 0) {
        setRows([]);
        setLoading(false);
        return;
      }

      const complianceRows: ComplianceRow[] = [];

      for (const subject of subjectsList) {
        const semester = subject.semesters as unknown as {
          number: number;
          program_id: string;
          programs: { id: string; name: string; career_code: string | null };
        } | null;

        if (!semester) continue;

        const { count: totalSessions } = await supabase
          .from("sessions")
          .select("id", { count: "exact" })
          .eq("subject_id", subject.id)
          .eq("is_active", true);

        const { data: sessionIds } = await supabase
          .from("sessions")
          .select("id")
          .eq("subject_id", subject.id)
          .eq("is_active", true);

        const sessIds = sessionIds?.map((s) => s.id) || [];
        let sessionsWithLive = 0;
        let totalAttendances = 0;

        if (sessIds.length > 0) {
          const { data: liveSessions } = await supabase
            .from("live_sessions")
            .select("id, session_id")
            .in("session_id", sessIds)
            .not("ended_at", "is", null);

          const uniqueSessionsWithLive = new Set(
            (liveSessions || []).map((ls) => ls.session_id)
          );
          sessionsWithLive = uniqueSessionsWithLive.size;

          const liveSessionIds = (liveSessions || []).map((ls) => ls.id);
          if (liveSessionIds.length > 0) {
            const { count } = await supabase
              .from("attendance")
              .select("id", { count: "exact" })
              .in("live_session_id", liveSessionIds)
              .eq("was_present", true);
            totalAttendances = count || 0;
          }
        }

        const total = totalSessions || 0;
        const compliancePct = total > 0 ? Math.round((sessionsWithLive / total) * 100) : 0;

        complianceRows.push({
          program_id: semester.programs.id,
          program_name: semester.programs.name,
          career_code: semester.programs.career_code,
          subject_id: subject.id,
          subject_code: subject.code,
          subject_name: subject.name,
          semester_number: semester.number,
          total_sessions: total,
          sessions_with_live: sessionsWithLive,
          compliance_pct: compliancePct,
          total_attendances: totalAttendances,
        });
      }

      complianceRows.sort((a, b) => {
        if (a.compliance_pct < 51 && b.compliance_pct >= 51) return -1;
        if (a.compliance_pct >= 51 && b.compliance_pct < 51) return 1;
        if (a.program_name !== b.program_name) return a.program_name.localeCompare(b.program_name);
        if (a.semester_number !== b.semester_number) return a.semester_number - b.semester_number;
        return a.subject_name.localeCompare(b.subject_name);
      });

      setRows(complianceRows);
    } catch (e) {
      console.error("Error cargando cumplimiento:", e);
    } finally {
      setLoading(false);
    }
  }, [selectedCareer]);

  useEffect(() => {
    fetchCompliance();
  }, [fetchCompliance]);

  function exportCSV() {
    const header = [
      "Carrera", "Codigo Carrera", "Semestre", "Codigo Materia", "Materia",
      "Total Sesiones", "Sesiones con Clase Sincronica", "% Cumplimiento",
      "Total Asistencias", "Estado CES",
    ].join(",");

    const csvRows = rows.map((r) =>
      [
        `"${r.program_name}"`, r.career_code || "", r.semester_number,
        r.subject_code, `"${r.subject_name}"`, r.total_sessions,
        r.sessions_with_live, `${r.compliance_pct}%`, r.total_attendances,
        r.compliance_pct >= 51 ? "CUMPLE" : "REQUIERE ATENCION",
      ].join(",")
    );

    const csvContent = "\uFEFF" + [header, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cumplimiento-sincronica-ces-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // ── Cargar reporte detallado ──
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

  // ── Cargar alertas ──
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

  // ── Resumen CES ──
  const totalSubjects    = rows.length;
  const compliantSubjects = rows.filter((r) => r.compliance_pct >= 51).length;
  const overallPct = totalSubjects > 0
    ? Math.round((compliantSubjects / totalSubjects) * 100)
    : 0;

  const TABS = [
    { id: "ces" as TabId,     label: "Cumplimiento CES",   icon: BarChart2    },
    { id: "reporte" as TabId, label: "Reporte Detallado",  icon: ClipboardList },
    { id: "alertas" as TabId, label: "Alertas",            icon: BellRing     },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Asistencia y Cumplimiento Sincronico
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Evidencia auditable para CES Art. 57 y 61 RRA 2022 + exportacion SENESCYT.
          </p>
        </div>
        {activeTab === "ces" && (
          <Button
            onClick={exportCSV}
            disabled={loading || rows.length === 0}
            className="gap-2 bg-[#1F2F58] text-white hover:bg-[#2A3F6E]"
          >
            <Download className="size-4" />
            Exportar CSV para CES
          </Button>
        )}
      </div>

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

      {/* ── TAB: Cumplimiento CES ── */}
      {activeTab === "ces" && (
        <>
          {!loading && rows.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#1F2F58]/8">
                    <BarChart2 className="size-5 text-[#1F2F58]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1F2F58]">{overallPct}%</p>
                    <p className="text-xs text-gray-500">Cumplimiento global</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50">
                    <CheckCircle2 className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-700">{compliantSubjects}</p>
                    <p className="text-xs text-gray-500">Materias con cumplimiento &gt;= 51%</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-red-50">
                    <AlertTriangle className="size-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {totalSubjects - compliantSubjects}
                    </p>
                    <p className="text-xs text-gray-500">Materias que requieren atencion</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <Filter className="size-4" />
              Filtrar por carrera
            </div>
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="h-8 min-w-[220px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Todas las carreras</option>
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.career_code ? `[${c.career_code}] ` : ""}{c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Materia</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead className="text-center">Sesiones Total</TableHead>
                  <TableHead className="text-center">Con Clase Sincronica</TableHead>
                  <TableHead className="text-center">Asistencias</TableHead>
                  <TableHead className="text-center">Cumplimiento</TableHead>
                  <TableHead className="text-center">Estado CES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center">
                      <Loader2 className="mx-auto size-5 animate-spin text-gray-400" />
                      <p className="mt-2 text-xs text-gray-400">Calculando cumplimiento...</p>
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-gray-400">
                      No hay datos de cumplimiento para los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => {
                    const isCritical = row.compliance_pct < 51;
                    const isWarning  = row.compliance_pct >= 51 && row.compliance_pct < 75;
                    return (
                      <TableRow
                        key={row.subject_id}
                        className={isCritical ? "bg-red-50/50" : ""}
                      >
                        <TableCell>
                          <div className="font-medium text-gray-900">{row.subject_name}</div>
                          <Badge variant="secondary" className="mt-0.5 text-[10px]">
                            {row.subject_code}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          Semestre {row.semester_number}
                        </TableCell>
                        <TableCell className="max-w-[130px] truncate text-xs text-gray-500">
                          {row.career_code ? (
                            <span className="font-medium text-[#1F2F58]">[{row.career_code}]</span>
                          ) : null}{" "}
                          {row.program_name}
                        </TableCell>
                        <TableCell className="text-center font-mono text-sm text-gray-700">
                          {row.total_sessions}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Video className="size-3.5 text-[#73B8E7]" />
                            <span className="font-mono text-sm text-gray-700">
                              {row.sessions_with_live}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Users className="size-3.5 text-gray-400" />
                            <span className="font-mono text-sm text-gray-700">
                              {row.total_attendances}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="mx-auto flex max-w-[120px] flex-col items-center gap-1">
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(row.compliance_pct, 100)}%` }}
                              />
                            </div>
                            <span
                              className={`font-mono text-sm font-semibold ${
                                isCritical ? "text-red-600" : isWarning ? "text-amber-600" : "text-emerald-600"
                              }`}
                            >
                              {row.compliance_pct}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {isCritical ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                              <AlertTriangle className="size-3" />
                              Requiere atencion
                            </span>
                          ) : isWarning ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              En progreso
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              <CheckCircle2 className="size-3" />
                              Cumple CES
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && rows.length > 0 && (
            <div className="rounded-lg border border-[#73B8E7]/20 bg-[#73B8E7]/5 p-4">
              <p className="text-xs text-[#1F2F58]/70">
                <span className="font-semibold">Requisito CES:</span> Segun el Art. 57 y 61 del
                Reglamento de Regimen Academico RRA 2022 (RPC-SE-04-No.012-2023), al menos el 51%
                de los creditos deben ser sincronicos verificables.
              </p>
            </div>
          )}
        </>
      )}

      {/* ── TAB: Reporte Detallado ── */}
      {activeTab === "reporte" && (
        <div className="space-y-5">
          {/* Filtros */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Materia</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="h-8 min-w-[280px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
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
                Generar reporte
              </Button>
            </div>
          </div>

          {/* Exportar */}
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
              <span className="ml-2 text-sm text-gray-400">Generando reporte...</span>
            </div>
          )}

          {report && !reportLoading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    {report.subject_code} — {report.subject_name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {report.sessions.length} sesiones &middot;{" "}
                    {report.students.length} estudiantes &middot;{" "}
                    Periodo {report.period_from.slice(0, 10)} — {report.period_to.slice(0, 10)}
                  </p>
                </div>
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
            <div className="rounded-lg border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
              Selecciona un periodo y haz click en "Generar reporte".
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
                <label className="text-xs font-medium text-gray-500">Materia</label>
                <select
                  value={alertSubject}
                  onChange={(e) => setAlertSubject(e.target.value)}
                  className="h-8 min-w-[280px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none"
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
              Selecciona una materia para verificar alertas de inasistencia.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
