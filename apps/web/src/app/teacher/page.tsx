"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  BookOpen,
  FileCheck,
  Users,
  Clock,
  Loader2,
  ArrowRight,
  CalendarDays,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrainingProgress } from "@/components/teacher/TrainingProgress";
import type { Subject, TrainingProgressSummary } from "@/types/database";

interface DashboardStats {
  subjectCount: number;
  pendingSubmissions: number;
  studentCount: number;
  recentActivity: {
    id: string;
    type: string;
    student_name: string;
    subject_name: string;
    created_at: string;
  }[];
}

interface SubjectRow extends Subject {
  semesters?: { number: number; programs?: { name: string } | null } | null;
}

export default function TeacherDashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    subjectCount: 0,
    pendingSubmissions: 0,
    studentCount: 0,
    recentActivity: [],
  });
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgressSummary | null>(null);

  useEffect(() => {
    // Safety net: si por cualquier razón fetchDashboard NO termina en 10s,
    // forzamos loading=false para que el dashboard salga del skeleton.
    // Esto previene "pantalla infinita pulsando" si una query falla o cuelga.
    // NO toca la lógica de separación de logins (alumnos / docentes / admin).
    const safetyTimeout = setTimeout(() => {
      console.warn("[TeacherDashboard] Safety timeout 10s — forzando salida del skeleton");
      setLoading(false);
    }, 10000);

    async function fetchDashboard() {
      // Get current user and role
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        clearTimeout(safetyTimeout);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const adminRoles = ["super_admin", "admin", "coordinacion"];
      const userIsAdmin = profile ? adminRoles.includes(profile.role) : false;
      setIsAdmin(userIsAdmin);

      // Load training progress in parallel
      fetch(`/api/teacher/training-progress?teacher_id=${user.id}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data) setTrainingProgress(data); })
        .catch(() => {});

      // Fetch subjects
      let subjectQuery = supabase
        .from("subjects")
        .select("*, semesters ( number, programs ( name ) )")
        .eq("is_active", true)
        .order("order_index");

      if (!userIsAdmin) {
        subjectQuery = subjectQuery.eq("teacher_id", user.id);
      }

      const { data: subjectsData } = await subjectQuery;
      const mySubjects = (subjectsData || []) as SubjectRow[];
      setSubjects(mySubjects);

      // Get subject IDs
      const subjectIds = mySubjects.map((s) => s.id);

      // Count pending submissions
      let pendingCount = 0;
      if (subjectIds.length > 0) {
        // Get sessions for subjects
        const { data: sessions } = await supabase
          .from("sessions")
          .select("id")
          .in("subject_id", subjectIds);

        const sessionIds = (sessions || []).map((s) => s.id);

        if (sessionIds.length > 0) {
          // Get assignments for sessions
          const { data: assignments } = await supabase
            .from("assignments")
            .select("id")
            .in("session_id", sessionIds);

          const assignmentIds = (assignments || []).map((a) => a.id);

          if (assignmentIds.length > 0) {
            const { count } = await supabase
              .from("submissions")
              .select("*", { count: "exact", head: true })
              .in("assignment_id", assignmentIds)
              .eq("status", "submitted");

            pendingCount = count || 0;
          }
        }
      }

      // Count unique students enrolled in programs that contain teacher's subjects
      let studentCount = 0;
      if (subjectIds.length > 0) {
        // Get program IDs from subjects -> semesters -> programs
        const { data: semesterData } = await supabase
          .from("subjects")
          .select("semester_id")
          .in("id", subjectIds);

        const semesterIds = [...new Set((semesterData || []).map((s) => s.semester_id))];

        if (semesterIds.length > 0) {
          const { data: semData } = await supabase
            .from("semesters")
            .select("program_id")
            .in("id", semesterIds);

          const programIds = [...new Set((semData || []).map((s) => s.program_id))];

          if (programIds.length > 0) {
            const { count } = await supabase
              .from("enrollments")
              .select("*", { count: "exact", head: true })
              .in("program_id", programIds)
              .eq("status", "active");

            studentCount = count || 0;
          }
        }
      }

      // Recent submissions as activity
      const recentActivity: DashboardStats["recentActivity"] = [];
      if (subjectIds.length > 0) {
        const { data: sessions } = await supabase
          .from("sessions")
          .select("id, title, subject_id")
          .in("subject_id", subjectIds);

        const sessionIds = (sessions || []).map((s) => s.id);

        if (sessionIds.length > 0) {
          const { data: assignments } = await supabase
            .from("assignments")
            .select("id, session_id")
            .in("session_id", sessionIds);

          const assignmentIds = (assignments || []).map((a) => a.id);

          if (assignmentIds.length > 0) {
            const { data: recentSubs } = await supabase
              .from("submissions")
              .select("id, status, submitted_at, assignment_id, user_id")
              .in("assignment_id", assignmentIds)
              .order("submitted_at", { ascending: false })
              .limit(5);

            for (const sub of recentSubs || []) {
              const { data: studentProfile } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("id", sub.user_id)
                .single();

              const assignment = (assignments || []).find(
                (a) => a.id === sub.assignment_id
              );
              const session = (sessions || []).find(
                (s) => s.id === assignment?.session_id
              );
              const subject = mySubjects.find(
                (su) => su.id === session?.subject_id
              );

              recentActivity.push({
                id: sub.id,
                type: sub.status === "graded" ? "Calificado" : "Entregado",
                student_name: studentProfile?.full_name || "Estudiante",
                subject_name: subject?.name || "Materia",
                created_at: sub.submitted_at,
              });
            }
          }
        }
      }

      setStats({
        subjectCount: mySubjects.length,
        pendingSubmissions: pendingCount,
        studentCount,
        recentActivity,
      });

      clearTimeout(safetyTimeout);
      setLoading(false);
    }

    // Envoltorio con try/catch: si CUALQUIER query falla, salimos del loading.
    // Esto evita el skeleton infinito si una query no responde o lanza error.
    fetchDashboard().catch((err) => {
      console.error("[TeacherDashboard] Error cargando dashboard:", err);
      clearTimeout(safetyTimeout);
      setLoading(false);
    });

    return () => clearTimeout(safetyTimeout);
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Panel Docente
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Bienvenido al panel de gestión de materias y estudiantes
        </p>
      </div>

      {/* Training Progress Widget */}
      {trainingProgress && (
        <TrainingProgress progress={trainingProgress} />
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#1F2F58]/10">
              <BookOpen className="size-5 text-[#1F2F58]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.subjectCount}
              </p>
              <p className="text-xs text-gray-500">Materias asignadas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#FBBC0C]/20">
              <FileCheck className="size-5 text-[#FBBC0C]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingSubmissions}
              </p>
              <p className="text-xs text-gray-500">Entregas pendientes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#73B8E7]/20">
              <Users className="size-5 text-[#73B8E7]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.studentCount}
              </p>
              <p className="text-xs text-gray-500">Estudiantes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#F0846D]/20">
              <Clock className="size-5 text-[#F0846D]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.recentActivity.length}
              </p>
              <p className="text-xs text-gray-500">Actividad reciente</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links: Subjects */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Mis Materias
        </h2>
        {subjects.length === 0 ? (
          <Card>
            <CardContent>
              <p className="py-6 text-center text-sm text-gray-400">
                {isAdmin
                  ? "No hay materias registradas en el sistema."
                  : "No tienes materias asignadas. Contacta al coordinador."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Link key={subject.id} href={`/teacher/materias/${subject.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-[#1F2F58]">
                      {subject.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        <span className="font-medium text-gray-700">
                          {subject.code}
                        </span>
                        {subject.semesters && (
                          <span>
                            {" "}
                            &middot; Periodo{" "}
                            {subject.semesters.number}
                          </span>
                        )}
                        {subject.semesters?.programs && (
                          <span>
                            {" "}
                            &middot;{" "}
                            {subject.semesters.programs.name}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="size-4 text-gray-400" />
                    </div>
                    <div className="mt-2 flex gap-2 text-[10px] text-gray-400">
                      <span>{subject.hours_docencia}h docencia</span>
                      <span>&middot;</span>
                      <span>{subject.hours_practica}h practica</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Actividad Reciente
          </h2>
          <Card>
            <CardContent className="divide-y divide-gray-100">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.student_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.subject_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        activity.type === "Calificado"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-[#FBBC0C]/20 text-[#1F2F58]"
                      }`}
                    >
                      {activity.type}
                    </span>
                    <p className="mt-0.5 text-[10px] text-gray-400">
                      {new Date(activity.created_at).toLocaleDateString("es-EC", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-3 flex justify-end">
            <Link href="/teacher/entregas">
              <Button variant="outline" size="sm">
                Ver todas las entregas
                <ArrowRight className="size-3.5" data-icon="inline-end" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Mi Agenda — acceso rapido al calendario */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CalendarDays className="size-5 text-[#1F2F58]" />
          Mi Agenda
        </h2>
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:text-left sm:items-start sm:gap-6">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#1F2F58]/10">
                <CalendarDays className="size-6 text-[#1F2F58]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">
                  Planifica tus clases sincronicas
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Crea y gestiona sesiones en el calendario. Tus estudiantes las veran
                  automaticamente en su agenda.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link href="/calendario">
                    <Button size="sm" className="bg-[#1F2F58] hover:bg-[#2A3F6E] text-white gap-1.5">
                      <CalendarDays className="size-3.5" />
                      Ver mi calendario
                    </Button>
                  </Link>
                  <Link href="/calendario">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Plus className="size-3.5" />
                      Nueva clase
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
