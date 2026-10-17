"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { use } from "react";
import {
  Loader2,
  ArrowLeft,
  Pencil,
  Video,
  FileText,
  BookOpenText,
  HelpCircle,
  ClipboardList,
  Link2,
  MessagesSquare,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  AlertTriangle,
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
import type { Subject, Session, Quiz, Assignment, SessionResource, AttendanceReport as AttendanceReportData, StudentAtRisk, QuizErrorRate, SessionEngagementData } from "@/types/database";
import { SubjectForumTab } from "@/components/forums/SubjectForumTab";
import { AttendanceReport } from "@/components/attendance/AttendanceReport";
import { AttendanceAlert } from "@/components/attendance/AttendanceAlert";
import { StudentRiskTable } from "@/components/teacher/StudentRiskTable";
import { QuizErrorRateChart } from "@/components/teacher/QuizErrorRateChart";
import { SessionEngagement } from "@/components/teacher/SessionEngagement";
import type { AlertItem } from "@/types/database";

interface SessionWithContentStatus extends Session {
  hasVideo: boolean;
  hasSlides: boolean;
  hasTheory: boolean;
  hasQuiz: boolean;
  hasAssignment: boolean;
  hasResources: boolean;
}

interface SubjectDetail extends Subject {
  semesters?: { number: number; programs?: { name: string } | null } | null;
}

export default function TeacherSubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [sessions, setSessions] = useState<SessionWithContentStatus[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"sesiones" | "foro" | "asistencia" | "analytics">("sesiones");

  // Analytics tab state
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [studentsAtRisk, setStudentsAtRisk] = useState<StudentAtRisk[]>([]);
  const [quizErrorRates, setQuizErrorRates] = useState<QuizErrorRate[]>([]);
  const [sessionEngagement, setSessionEngagement] = useState<SessionEngagementData[]>([]);
  const [analyticsSubView, setAnalyticsSubView] = useState<"risk" | "quiz" | "engagement">("risk");

  // Asistencia tab state
  const [attendanceReport, setAttendanceReport] = useState<AttendanceReportData | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const now = new Date();
  const [attendanceFrom] = useState(`${now.getFullYear()}-01-01T00:00:00Z`);
  const [attendanceTo]   = useState(now.toISOString());

  useEffect(() => {
    async function fetchData() {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      // Fetch subject
      const { data: subjectData } = await supabase
        .from("subjects")
        .select("*, semesters ( number, programs ( name ) )")
        .eq("id", id)
        .single();

      if (!subjectData) {
        setLoading(false);
        return;
      }

      setSubject(subjectData as SubjectDetail);

      // Fetch sessions
      const { data: sessionsData } = await supabase
        .from("sessions")
        .select("*")
        .eq("subject_id", id)
        .order("number", { ascending: true });

      const sessionsArr = sessionsData || [];
      const sessionIds = sessionsArr.map((s) => s.id);

      // Fetch quizzes, assignments, and resources for all sessions
      let quizMap: Record<string, boolean> = {};
      let assignmentMap: Record<string, boolean> = {};
      let resourceMap: Record<string, boolean> = {};

      if (sessionIds.length > 0) {
        const [quizzesRes, assignmentsRes, resourcesRes] = await Promise.all([
          supabase
            .from("quizzes")
            .select("id, session_id")
            .in("session_id", sessionIds),
          supabase
            .from("assignments")
            .select("id, session_id")
            .in("session_id", sessionIds),
          supabase
            .from("session_resources")
            .select("id, session_id")
            .in("session_id", sessionIds),
        ]);

        for (const q of quizzesRes.data || []) {
          quizMap[q.session_id] = true;
        }
        for (const a of assignmentsRes.data || []) {
          assignmentMap[a.session_id] = true;
        }
        for (const r of resourcesRes.data || []) {
          resourceMap[r.session_id] = true;
        }
      }

      const enriched: SessionWithContentStatus[] = sessionsArr.map((s) => ({
        ...s,
        hasVideo: !!s.video_url,
        hasSlides: !!s.slides_url,
        hasTheory: !!s.theory_markdown,
        hasQuiz: !!quizMap[s.id],
        hasAssignment: !!assignmentMap[s.id],
        hasResources: !!resourceMap[s.id],
      }));

      setSessions(enriched);
      setLoading(false);
    }

    fetchData();
  }, [id]);

  async function loadAnalytics() {
    if (analyticsLoaded || analyticsLoading) return;
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/teacher/analytics/${id}`);
      if (res.ok) {
        const data = await res.json();
        setStudentsAtRisk(data.studentsAtRisk || []);
        setQuizErrorRates(data.quizErrorRates || []);
        setSessionEngagement(data.sessionEngagement || []);
        setAnalyticsLoaded(true);
      }
    } finally {
      setAnalyticsLoading(false);
    }
  }

  async function loadAttendance() {
    if (!id) return;
    setAttendanceLoading(true);
    try {
      const params = new URLSearchParams({
        subject_id: id,
        from: attendanceFrom,
        to: attendanceTo,
      });
      const [reportRes, alertsRes] = await Promise.all([
        fetch(`/api/attendance/report?${params.toString()}`),
        fetch(`/api/attendance/alerts?subject_id=${id}&check=false`),
      ]);
      if (reportRes.ok) {
        setAttendanceReport(await reportRes.json() as AttendanceReportData);
      }
      if (alertsRes.ok) {
        const data = await alertsRes.json() as { alerts: AlertItem[] };
        setAlerts(data.alerts || []);
      }
    } finally {
      setAttendanceLoading(false);
    }
  }

  function ContentDot({ has }: { has: boolean }) {
    return (
      <span
        className={`inline-block size-2.5 rounded-full ${
          has ? "bg-emerald-500" : "bg-white/15"
        }`}
        title={has ? "Tiene contenido" : "Sin contenido"}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="space-y-4">
        <Link href="/teacher/materias">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" data-icon="inline-start" />
            Volver a materias
          </Button>
        </Link>
        <p className="text-sm text-white/55">Materia no encontrada.</p>
      </div>
    );
  }

  const completedCount = sessions.filter(
    (s) =>
      s.hasVideo &&
      s.hasSlides &&
      s.hasTheory &&
      s.hasQuiz &&
      s.hasAssignment
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/teacher/materias">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="size-4" data-icon="inline-start" />
              Volver a materias
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">{subject.name}</h1>
          <p className="mt-1 text-sm text-white/50">
            <span className="font-medium text-white/80">{subject.code}</span>
            {subject.semesters && (
              <span> &middot; Periodo {subject.semesters.number}</span>
            )}
            {subject.semesters?.programs && (
              <span> &middot; {subject.semesters.programs.name}</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-white/50">
          <div className="text-center">
            <p className="text-lg font-bold text-[#73B8E7]">{sessions.length}</p>
            <p className="text-xs">Sesiones</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-emerald-600">
              {completedCount}
            </p>
            <p className="text-xs">Completas</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#FBBC0C]">
              {sessions.length - completedCount}
            </p>
            <p className="text-xs">Pendientes</p>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 rounded-xl border border-white/20 bg-[#0A1628]/80 p-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("sesiones")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "sesiones"
              ? "bg-[#1F2F58] text-white shadow-sm"
              : "text-white/50 hover:text-white hover:bg-white/10"
          }`}
        >
          <BookOpen className="size-3.5" />
          Sesiones
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("foro")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "foro"
              ? "bg-[#1F2F58] text-white shadow-sm"
              : "text-white/50 hover:text-white hover:bg-white/10"
          }`}
        >
          <MessagesSquare className="size-3.5" />
          Foro de la materia
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("asistencia");
            if (!attendanceReport && !attendanceLoading) {
              loadAttendance();
            }
          }}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "asistencia"
              ? "bg-[#1F2F58] text-white shadow-sm"
              : "text-white/50 hover:text-white hover:bg-white/10"
          }`}
        >
          <ClipboardCheck className="size-3.5" />
          Asistencia
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("analytics");
            loadAnalytics();
          }}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "analytics"
              ? "bg-[#1F2F58] text-white shadow-sm"
              : "text-white/50 hover:text-white hover:bg-white/10"
          }`}
        >
          <BarChart3 className="size-3.5" />
          Analytics
        </button>
      </div>

      {/* Foro tab */}
      {activeTab === "foro" && subject && (
        <div className="rounded-xl border border-white/20 bg-[#0A1628]/80 p-5">
          <SubjectForumTab
            subjectId={subject.id}
            currentUserId={currentUserId}
            canModerate={true}
          />
        </div>
      )}

      {/* Asistencia tab */}
      {activeTab === "asistencia" && (
        <div className="space-y-5">
          {/* Alertas activas */}
          {alerts.length > 0 && (
            <AttendanceAlert
              alerts={alerts}
              onAcknowledge={(alertId) =>
                setAlerts((prev) => prev.filter((a) => a.id !== alertId))
              }
            />
          )}

          {attendanceLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
              <span className="ml-2 text-sm text-white/55">
                Cargando asistencia...
              </span>
            </div>
          )}

          {attendanceReport && !attendanceLoading && (
            <AttendanceReport
              report={attendanceReport}
              subjectId={id}
              periodFrom={attendanceFrom}
              periodTo={attendanceTo}
              canExport={true}
              onReload={loadAttendance}
            />
          )}

          {!attendanceReport && !attendanceLoading && (
            <div className="rounded-lg border border-dashed border-white/20 py-12 text-center text-sm text-white/55">
              No hay sesiones sincronicas registradas para esta materia en el periodo actual.
            </div>
          )}
        </div>
      )}

      {/* Analytics tab */}
      {activeTab === "analytics" && (
        <div className="space-y-5">
          {analyticsLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
              <span className="ml-2 text-sm text-white/55">Calculando analytics...</span>
            </div>
          )}

          {!analyticsLoading && analyticsLoaded && (
            <>
              {/* Sub-view selector */}
              <div className="flex items-center gap-1 rounded-xl border border-white/20 bg-[#0A1628]/80 p-1 w-fit">
                <button
                  type="button"
                  onClick={() => setAnalyticsSubView("risk")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    analyticsSubView === "risk"
                      ? "bg-[#1F2F58] text-white shadow-sm"
                      : "text-white/50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <AlertTriangle className="size-3.5" />
                  Estudiantes en riesgo
                  {studentsAtRisk.length > 0 && (
                    <span className="ml-1 inline-flex size-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
                      {studentsAtRisk.length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setAnalyticsSubView("quiz")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    analyticsSubView === "quiz"
                      ? "bg-[#1F2F58] text-white shadow-sm"
                      : "text-white/50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <HelpCircle className="size-3.5" />
                  Preguntas de quiz
                </button>
                <button
                  type="button"
                  onClick={() => setAnalyticsSubView("engagement")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    analyticsSubView === "engagement"
                      ? "bg-[#1F2F58] text-white shadow-sm"
                      : "text-white/50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <BarChart3 className="size-3.5" />
                  Engagement
                </button>
              </div>

              {analyticsSubView === "risk" && (
                <StudentRiskTable students={studentsAtRisk} subjectId={id} />
              )}
              {analyticsSubView === "quiz" && (
                <QuizErrorRateChart data={quizErrorRates} />
              )}
              {analyticsSubView === "engagement" && (
                <SessionEngagement data={sessionEngagement} />
              )}
            </>
          )}
        </div>
      )}

      {/* Sessions content (hidden when foro active) */}
      {activeTab === "sesiones" && (
        <>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-white/20 bg-[#0A1628]/80 p-3 text-xs text-white/50">
        <span className="font-medium text-white/80">Indicadores:</span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2.5 rounded-full bg-emerald-500" />
          Tiene contenido
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-2.5 rounded-full bg-white/15" />
          Sin contenido
        </span>
      </div>

      {/* Sessions Table */}
      <div className="rounded-lg border border-white/20 bg-[#0A1628]/80">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0A1628]/60">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Titulo</TableHead>
              <TableHead className="text-center">
                <Video className="mx-auto size-4 text-white/55" />
              </TableHead>
              <TableHead className="text-center">
                <FileText className="mx-auto size-4 text-white/55" />
              </TableHead>
              <TableHead className="text-center">
                <BookOpenText className="mx-auto size-4 text-white/55" />
              </TableHead>
              <TableHead className="text-center">
                <HelpCircle className="mx-auto size-4 text-white/55" />
              </TableHead>
              <TableHead className="text-center">
                <ClipboardList className="mx-auto size-4 text-white/55" />
              </TableHead>
              <TableHead className="text-center">
                <Link2 className="mx-auto size-4 text-white/55" />
              </TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-10 text-center text-white/55"
                >
                  No hay sesiones creadas para esta materia.
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <span className="inline-flex size-7 items-center justify-center rounded bg-white/10 text-xs font-bold text-white/75">
                      {session.number}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">
                      <div className="truncate font-medium text-white">
                        {session.title}
                      </div>
                      {session.description && (
                        <div className="truncate text-xs text-white/55">
                          {session.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <ContentDot has={session.hasVideo} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ContentDot has={session.hasSlides} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ContentDot has={session.hasTheory} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ContentDot has={session.hasQuiz} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ContentDot has={session.hasAssignment} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ContentDot has={session.hasResources} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/teacher/materias/${id}/sesion/${session.number}/edit`}
                    >
                      <Button variant="ghost" size="icon-sm" title="Editar sesion">
                        <Pencil className="size-3.5 text-[#73B8E7]" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
        </>
      )}
    </div>
  );
}
