"use client";

// ============================================================
// /teacher/analytics — Analytics de estudiantes
//
// Tarjetas con métricas agregadas calculadas en cliente a
// partir de tablas existentes: subjects, sessions, quizzes,
// quiz_attempts, submissions, enrollments.
// ============================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart3,
  Users,
  CheckCircle2,
  Activity,
  AlertTriangle,
  Loader2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Metrics {
  activeStudents: number;
  passRate: number | null; // 0-100
  participationRate: number | null; // 0-100
  lowPerformers: { id: string; name: string; pct: number | null }[];
  totalAttempts: number;
  totalSubmissions: number;
}

const EMPTY: Metrics = {
  activeStudents: 0,
  passRate: null,
  participationRate: null,
  lowPerformers: [],
  totalAttempts: 0,
  totalSubmissions: 0,
};

export default function AnalyticsClient() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>(EMPTY);
  const [hasSubjects, setHasSubjects] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, semester_id")
        .eq("teacher_id", user.id)
        .eq("is_active", true);

      const subjects = subjectsData ?? [];
      setHasSubjects(subjects.length > 0);
      const subjectIds = subjects.map((s) => s.id);

      if (subjectIds.length === 0) {
        setMetrics(EMPTY);
        setLoading(false);
        return;
      }

      // Estudiantes activos = enrollments en programas que contienen las
      // semestres de las materias del docente.
      const semesterIds = [
        ...new Set(subjects.map((s) => s.semester_id).filter(Boolean)),
      ];

      let activeStudents = 0;
      if (semesterIds.length > 0) {
        const { data: semData } = await supabase
          .from("semesters")
          .select("program_id")
          .in("id", semesterIds);
        const programIds = [
          ...new Set((semData ?? []).map((s) => s.program_id)),
        ];
        if (programIds.length > 0) {
          const { count } = await supabase
            .from("enrollments")
            .select("*", { count: "exact", head: true })
            .in("program_id", programIds)
            .eq("status", "active");
          activeStudents = count ?? 0;
        }
      }

      // Sesiones -> Quizzes y Assignments
      const { data: sessionsData } = await supabase
        .from("sessions")
        .select("id")
        .in("subject_id", subjectIds);
      const sessionIds = (sessionsData ?? []).map((s) => s.id);

      let passRate: number | null = null;
      let totalAttempts = 0;
      const studentScores = new Map<
        string,
        { sum: number; count: number }
      >();

      if (sessionIds.length > 0) {
        const { data: quizzesData } = await supabase
          .from("quizzes")
          .select("id")
          .in("session_id", sessionIds);
        const quizIds = (quizzesData ?? []).map((q) => q.id);

        if (quizIds.length > 0) {
          const { data: attemptsData } = await supabase
            .from("quiz_attempts")
            .select("id, user_id, percentage, passed, completed_at")
            .in("quiz_id", quizIds)
            .not("completed_at", "is", null);

          const attempts = attemptsData ?? [];
          totalAttempts = attempts.length;
          if (attempts.length > 0) {
            const passed = attempts.filter((a) => a.passed === true).length;
            passRate = Math.round((passed / attempts.length) * 100);

            for (const a of attempts) {
              if (a.percentage == null) continue;
              const cur = studentScores.get(a.user_id) ?? {
                sum: 0,
                count: 0,
              };
              cur.sum += Number(a.percentage);
              cur.count += 1;
              studentScores.set(a.user_id, cur);
            }
          }
        }
      }

      // Submissions -> participación
      let totalSubmissions = 0;
      let participationRate: number | null = null;
      if (sessionIds.length > 0) {
        const { data: assignmentsData } = await supabase
          .from("assignments")
          .select("id")
          .in("session_id", sessionIds)
          .eq("is_active", true);
        const assignmentIds = (assignmentsData ?? []).map((a) => a.id);

        if (assignmentIds.length > 0) {
          const { count: subCount } = await supabase
            .from("submissions")
            .select("*", { count: "exact", head: true })
            .in("assignment_id", assignmentIds);
          totalSubmissions = subCount ?? 0;

          if (activeStudents > 0) {
            const expected = activeStudents * assignmentIds.length;
            participationRate = Math.min(
              100,
              Math.round((totalSubmissions / expected) * 100)
            );
          }
        }
      }

      // Bajo desempeño = promedio < 60% en quizzes (top 5)
      const lowPerformersIds: { id: string; pct: number }[] = [];
      for (const [uid, s] of studentScores.entries()) {
        const avg = s.sum / s.count;
        if (avg < 60) lowPerformersIds.push({ id: uid, pct: Math.round(avg) });
      }
      lowPerformersIds.sort((a, b) => a.pct - b.pct);
      const top = lowPerformersIds.slice(0, 5);

      let lowPerformers: Metrics["lowPerformers"] = [];
      if (top.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in(
            "id",
            top.map((t) => t.id)
          );
        const nameById = new Map(
          (profilesData ?? []).map((p) => [p.id, p.full_name as string])
        );
        lowPerformers = top.map((t) => ({
          id: t.id,
          name: nameById.get(t.id) ?? "Estudiante",
          pct: t.pct,
        }));
      }

      setMetrics({
        activeStudents,
        passRate,
        participationRate,
        lowPerformers,
        totalAttempts,
        totalSubmissions,
      });
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Analytics de Estudiantes
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Indicadores agregados de desempeño y participación de tus materias.
        </p>
      </div>

      {!hasSubjects && (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="mx-auto size-8 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-500">
              No tienes materias asignadas todavía.
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Una vez se te asigne una materia, verás aquí las métricas.
            </p>
          </CardContent>
        </Card>
      )}

      {hasSubjects && (
        <>
          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#1F2F58]/10">
                  <Users className="size-5 text-[#1F2F58]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.activeStudents}
                  </p>
                  <p className="text-xs text-gray-500">Estudiantes activos</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.passRate == null ? "—" : `${metrics.passRate}%`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Aprobación en quizzes
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#73B8E7]/20">
                  <Activity className="size-5 text-[#73B8E7]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.participationRate == null
                      ? "—"
                      : `${metrics.participationRate}%`}
                  </p>
                  <p className="text-xs text-gray-500">Participación</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#F0846D]/20">
                  <AlertTriangle className="size-5 text-[#F0846D]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.lowPerformers.length}
                  </p>
                  <p className="text-xs text-gray-500">
                    Estudiantes en alerta
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalle alertas */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="size-5 text-[#F0846D]" />
              Estudiantes con desempeño bajo
            </h2>
            {metrics.lowPerformers.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <CheckCircle2 className="mx-auto size-8 text-emerald-300" />
                  <p className="mt-2 text-sm font-medium text-emerald-700">
                    Sin alertas críticas
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {metrics.totalAttempts === 0
                      ? "Aún no hay intentos de quiz registrados."
                      : "Ningún estudiante tiene un promedio menor al 60%."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="divide-y divide-gray-100">
                  {metrics.lowPerformers.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {s.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Promedio en quizzes
                        </p>
                      </div>
                      <Badge className="bg-[#F0846D]/15 text-[#F0846D]">
                        {s.pct == null ? "—" : `${s.pct}%`}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resumen actividad */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="size-5 text-[#1F2F58]" />
              Actividad acumulada
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <CardContent className="py-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Intentos de quiz completados
                  </p>
                  <p className="mt-1 text-3xl font-bold text-[#1F2F58]">
                    {metrics.totalAttempts}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Entregas registradas
                  </p>
                  <p className="mt-1 text-3xl font-bold text-[#1F2F58]">
                    {metrics.totalSubmissions}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-3 flex justify-end">
              <Link href="/teacher/entregas">
                <Button variant="outline" size="sm" className="gap-1.5">
                  Ver entregas
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
