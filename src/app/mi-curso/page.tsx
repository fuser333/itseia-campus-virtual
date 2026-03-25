import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Play,
  CheckCircle2,
  Layers,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Mi Curso | ITSEIA Academy",
  description: "Tu curso profesional de IA en ITSEIA",
};

export default async function MiCursoPage() {
  const authClient = await createClient();
  const supabase = supabaseAdmin;

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch active enrollment for curso/bootcamp/preuni type programs
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, programs(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // If no enrollment found, show empty state
  const program = enrollment?.programs as {
    id: string;
    name: string;
    slug: string;
    type: string;
    description: string | null;
    duration_months: number | null;
    price: number;
  } | null;

  // Fetch courses for this program
  let courses =
    program
      ? (
          await supabase
            .from("courses")
            .select("*")
            .eq("program_id", program.id)
            .eq("is_active", true)
            .order("order_index", { ascending: true })
        ).data || []
      : [];

  // For programs without courses (preuni, bootcamp), convert semesters→subjects to courses
  if (program && courses.length === 0) {
    const { data: semesters } = await supabase
      .from("semesters")
      .select("*")
      .eq("program_id", program.id)
      .order("number", { ascending: true });

    if (semesters && semesters.length > 0) {
      const { data: subjects } = await supabase
        .from("subjects")
        .select("*")
        .in("semester_id", semesters.map(s => s.id))
        .order("order_index", { ascending: true });

      // Transform subjects to course-like structure
      courses = (subjects || []).map((subject) => ({
        id: subject.id,
        program_id: program.id,
        name: subject.name,
        slug: subject.slug,
        description: subject.description,
        order_index: subject.order_index,
        is_active: subject.is_active,
        // Mark as semester-based
        _isSemesterBased: true,
        _semesterId: subject.semester_id,
      }));
    }
  }

  // For each course, get modules and progress (or sessions if semester-based)
  const coursesWithProgress = await Promise.all(
    courses.map(async (course: any) => {
      let totalLessons = 0;
      let completedLessons = 0;
      let firstIncompleteLessonId: string | null = null;
      let moduleCount = 0;

      // Check if this is semester-based (preuni)
      if (course._isSemesterBased) {
        // Get sessions for this subject
        const { data: sessions } = await supabase
          .from("sessions")
          .select("id, number, title")
          .eq("subject_id", course.id)
          .eq("is_active", true)
          .order("number", { ascending: true });

        totalLessons = sessions?.length || 0;
        moduleCount = 1; // One "module" (the week itself)
        const sessionIds = (sessions || []).map((s) => s.id);

        if (sessionIds.length > 0) {
          // Get session progress
          const { data: progress } = await supabase
            .from("session_progress")
            .select("session_id, completed")
            .eq("user_id", user.id)
            .in("session_id", sessionIds)
            .eq("completed", true);

          const completedSet = new Set(
            (progress || []).map((p) => p.session_id)
          );
          completedLessons = completedSet.size;

          // Find first incomplete session
          for (const session of sessions || []) {
            if (!completedSet.has(session.id)) {
              firstIncompleteLessonId = session.id;
              break;
            }
          }
        }
      } else {
        // Traditional course → modules → lessons
        const { data: modules } = await supabase
          .from("modules")
          .select("id, name, order_index")
          .eq("course_id", course.id)
          .eq("is_active", true)
          .order("order_index", { ascending: true });

        moduleCount = (modules || []).length;
        const moduleIds = (modules || []).map((m) => m.id);

        if (moduleIds.length > 0) {
          const { data: lessons } = await supabase
            .from("lessons")
            .select("id, module_id, order_index")
            .in("module_id", moduleIds)
            .eq("is_active", true)
            .order("order_index", { ascending: true });

          totalLessons = lessons?.length || 0;
          const lessonIds = (lessons || []).map((l) => l.id);

          if (lessonIds.length > 0) {
            const { data: progress } = await supabase
              .from("progress")
              .select("lesson_id, completed")
              .eq("user_id", user.id)
              .in("lesson_id", lessonIds)
              .eq("completed", true);

            const completedSet = new Set(
              (progress || []).map((p) => p.lesson_id)
            );
            completedLessons = completedSet.size;

            // Find first incomplete lesson
            for (const lesson of lessons || []) {
              if (!completedSet.has(lesson.id)) {
                firstIncompleteLessonId = lesson.id;
                break;
              }
            }
          }
        }
      }

      const percentage =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      return {
        ...course,
        moduleCount,
        totalLessons,
        completedLessons,
        percentage,
        firstIncompleteLessonId,
      };
    })
  );

  // Overall program progress
  const totalLessonsAll = coursesWithProgress.reduce(
    (s, c) => s + c.totalLessons,
    0
  );
  const completedLessonsAll = coursesWithProgress.reduce(
    (s, c) => s + c.completedLessons,
    0
  );
  const overallPercent =
    totalLessonsAll > 0
      ? Math.round((completedLessonsAll / totalLessonsAll) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Mi Curso
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          Accede a tu contenido, modulos y progreso del curso.
        </p>
      </div>

      {!program ? (
        /* ── Empty state ── */
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <GraduationCap className="size-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No tienes un curso activo
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Inscríbete en un curso profesional de IA para comenzar tu
              aprendizaje personalizado.
            </p>
            <a
              href="https://itseia.ai/cursos/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Ver Cursos Disponibles
              <ExternalLink className="size-3.5" />
            </a>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* ── Program hero card ── */}
          <div className="rounded-2xl bg-gradient-to-br from-[#1F2F58] to-[#0A1628] p-8 text-white shadow-lg">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <Badge className="mb-3 border-none bg-[#FBBC0C]/20 text-xs font-semibold uppercase tracking-wider text-[#FBBC0C]">
                  {program.type === "curso"
                    ? "Curso Profesional"
                    : program.type === "bootcamp"
                    ? "Bootcamp"
                    : "Preuniversitario"}
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {program.name}
                </h2>
                {program.description && (
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {program.description}
                  </p>
                )}
                <div className="mt-5 flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-[#73B8E7]" />
                    <span className="text-sm text-white/70">
                      {courses.length}{" "}
                      {courses.length === 1 ? "módulo" : "módulos"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-[#73B8E7]" />
                    <span className="text-sm text-white/70">
                      {totalLessonsAll} lecciones
                    </span>
                  </div>
                  {program.duration_months && (
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-[#73B8E7]" />
                      <span className="text-sm text-white/70">
                        {program.duration_months}{" "}
                        {program.duration_months === 1 ? "mes" : "meses"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span className="text-sm text-white/70">
                      {completedLessonsAll}/{totalLessonsAll} completadas
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress ring */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex size-24 items-center justify-center">
                  <svg className="size-24 -rotate-90" viewBox="0 0 96 96">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="#FBBC0C"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${overallPercent * 2.51} ${
                        251 - overallPercent * 2.51
                      }`}
                    />
                  </svg>
                  <span className="absolute text-xl font-bold text-white">
                    {overallPercent}%
                  </span>
                </div>
                <span className="text-xs text-white/40">Progreso total</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all duration-700"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Courses / modules list ── */}
          <div>
            <h2 className="mb-4 text-xl font-bold text-foreground">
              Contenido del Curso
            </h2>

            {coursesWithProgress.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {coursesWithProgress.map((course, idx) => (
                  <Card
                    key={course.id}
                    className="group border border-border bg-card transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <CardContent className="space-y-4">
                      {/* Module index badge */}
                      <div className="flex items-start justify-between">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                          <span className="text-sm font-bold text-primary">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <Badge className="border-none bg-[#73B8E7]/15 text-[10px] font-semibold uppercase tracking-wider text-[#73B8E7]">
                          {course.percentage}% completo
                        </Badge>
                      </div>

                      <div>
                        <h3 className="font-semibold text-foreground leading-snug">
                          {course.name}
                        </h3>
                        {course.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {course.description}
                          </p>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Layers className="size-3" />
                          {course.moduleCount} modulos
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="size-3" />
                          {course.totalLessons} lecciones
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all duration-500"
                          style={{ width: `${course.percentage}%` }}
                        />
                      </div>

                      {/* CTA */}
                      <div className="flex gap-2">
                        {course._isSemesterBased ? (
                          // For semester-based (preuni), link to carrera page
                          <>
                            <Link
                              href={`/carreras/${program?.slug}/materia/${course.slug}`}
                              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/10 transition-colors"
                            >
                              Ver contenido
                            </Link>
                            {course.firstIncompleteLessonId && (
                              <Link
                                href={`/carreras/${program?.slug}/materia/${course.slug}/sesion/1`}
                                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                              >
                                <Play className="size-3" />
                                Continuar
                              </Link>
                            )}
                            {!course.firstIncompleteLessonId &&
                              course.totalLessons > 0 && (
                                <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-400">
                                  <CheckCircle2 className="size-3" />
                                  Completado
                                </span>
                              )}
                          </>
                        ) : (
                          // Traditional course navigation
                          <>
                            <Link
                              href={`/courses/${course.id}`}
                              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/10 transition-colors"
                            >
                              Ver contenido
                            </Link>
                            {course.firstIncompleteLessonId && (
                              <Link
                                href={`/courses/${course.id}/lesson/${course.firstIncompleteLessonId}`}
                                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                              >
                                <Play className="size-3" />
                                Continuar
                              </Link>
                            )}
                            {!course.firstIncompleteLessonId &&
                              course.totalLessons > 0 && (
                                <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-400">
                                  <CheckCircle2 className="size-3" />
                                  Completado
                                </span>
                              )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <BookOpen className="size-10 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    El contenido de este curso se está preparando. Vuelve
                    pronto.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ── Quick actions ── */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/ai-lab"
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-all hover:-translate-y-0.5"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">AI Lab</p>
                <p className="text-xs text-muted-foreground">
                  Practica con IA
                </p>
              </div>
              <ArrowRight className="ml-auto size-4 text-muted-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-muted-foreground/60" />
            </Link>

            <Link
              href="/biblioteca"
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-all hover:-translate-y-0.5"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#73B8E7]/10 text-[#73B8E7] transition-transform group-hover:scale-110">
                <span className="text-lg">📖</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Biblioteca
                </p>
                <p className="text-xs text-muted-foreground">
                  Recursos y lecturas
                </p>
              </div>
              <ArrowRight className="ml-auto size-4 text-muted-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-muted-foreground/60" />
            </Link>

            <a
              href="https://itseia.ai/demos/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-all hover:-translate-y-0.5"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#F0846D]/10 text-[#F0846D] transition-transform group-hover:scale-110">
                <span className="text-lg">🧪</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Demos Interactivos
                </p>
                <p className="text-xs text-muted-foreground">
                  Explora demos de IA
                </p>
              </div>
              <ExternalLink className="ml-auto size-4 text-muted-foreground/30 group-hover:text-muted-foreground/60" />
            </a>
          </div>
        </>
      )}
    </div>
  );
}
