import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CheckCircle2,
  Zap,
  Flame,
  ArrowRight,
  Clock,
  Play,
  GraduationCap,
  School,
  CalendarDays,
  Video,
} from "lucide-react";
import type { EnrollmentWithProgram, Program } from "@/types/database";
import { getUpcomingEventsForUser } from "@/features/calendar/queries";
import { CALENDAR_EVENT_COLORS, CALENDAR_EVENT_LABELS } from "@/types/database";
import type { CalendarEventWithDetails } from "@/types/database";

export const metadata: Metadata = {
  title: "Dashboard | ITSEIA Academy",
  description: "Tu centro de aprendizaje en inteligencia artificial",
};

export default async function DashboardPage() {
  const authClient = await createClient();
  const supabase = supabaseAdmin;

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch enrollments with programs
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, programs(*)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false });

  // Fetch all completed lessons count
  const { count: completedLessonsCount } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("completed", true);

  // Calculate streak: count consecutive days with completed lessons ending today
  const { data: recentProgress } = await supabase
    .from("progress")
    .select("completed_at")
    .eq("user_id", user.id)
    .eq("completed", true)
    .order("completed_at", { ascending: false })
    .limit(100);

  const streak = calculateStreak(recentProgress || []);

  // Fetch career enrollment data (for "Mi Carrera" section)
  const careerEnrollments = (enrollments || []).filter(
    (e: EnrollmentWithProgram) => e.programs?.type === "carrera"
  ) as EnrollmentWithProgram[];

  interface CareerProgress {
    programId: string;
    programName: string;
    programSlug: string;
    currentSemester: number;
    totalSemesters: number;
    completedSessions: number;
    totalSessions: number;
    percent: number;
  }

  const careerProgressData: CareerProgress[] = [];

  for (const enrollment of careerEnrollments) {
    const program = enrollment.programs as Program;
    if (!program) continue;

    // Get semesters for this career
    const { data: semesters } = await supabase
      .from("semesters")
      .select("id")
      .eq("program_id", program.id);

    let totalSessions = 0;
    let completedSessions = 0;

    if (semesters && semesters.length > 0) {
      const semesterIds = semesters.map((s) => s.id);

      const { data: subjects } = await supabase
        .from("subjects")
        .select("id")
        .in("semester_id", semesterIds);

      if (subjects && subjects.length > 0) {
        const subjectIds = subjects.map((s) => s.id);

        const { data: sessions } = await supabase
          .from("sessions")
          .select("id")
          .in("subject_id", subjectIds)
          .eq("is_active", true);

        totalSessions = sessions?.length || 0;

        if (sessions && sessions.length > 0) {
          const sessionIds = sessions.map((s) => s.id);
          const { count: compCount } = await supabase
            .from("session_progress")
            .select("*", { count: "exact", head: true })
            .in("session_id", sessionIds)
            .eq("user_id", user.id)
            .eq("completed", true);

          completedSessions = compCount || 0;
        }
      }
    }

    careerProgressData.push({
      programId: program.id,
      programName: program.name,
      programSlug: program.slug,
      currentSemester: profile?.current_semester || 1,
      totalSemesters: program.total_semesters || 5,
      completedSessions,
      totalSessions,
      percent:
        totalSessions > 0
          ? Math.round((completedSessions / totalSessions) * 100)
          : 0,
    });
  }

  // For each enrollment, calculate progress
  const enrollmentsWithProgress = await Promise.all(
    (enrollments || []).map(async (enrollment: EnrollmentWithProgram) => {
      // Get courses for this program
      const { data: courses } = await supabase
        .from("courses")
        .select("id")
        .eq("program_id", enrollment.program_id)
        .eq("is_active", true);

      const courseIds = courses?.map((c) => c.id) || [];

      if (courseIds.length === 0) {
        return { ...enrollment, totalLessons: 0, completedLessons: 0, percentage: 0 };
      }

      // Get modules for these courses
      const { data: modules } = await supabase
        .from("modules")
        .select("id")
        .in("course_id", courseIds)
        .eq("is_active", true);

      const moduleIds = modules?.map((m) => m.id) || [];

      if (moduleIds.length === 0) {
        return { ...enrollment, totalLessons: 0, completedLessons: 0, percentage: 0 };
      }

      // Count total lessons
      const { count: totalLessons } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true })
        .in("module_id", moduleIds)
        .eq("is_active", true);

      // Count completed lessons
      const { data: allLessons } = await supabase
        .from("lessons")
        .select("id")
        .in("module_id", moduleIds)
        .eq("is_active", true);

      const lessonIds = allLessons?.map((l) => l.id) || [];

      let completedLessons = 0;
      if (lessonIds.length > 0) {
        const { count } = await supabase
          .from("progress")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("completed", true)
          .in("lesson_id", lessonIds);
        completedLessons = count || 0;
      }

      const total = totalLessons || 0;
      const percentage = total > 0 ? Math.round((completedLessons / total) * 100) : 0;

      return { ...enrollment, totalLessons: total, completedLessons, percentage };
    })
  );

  // Find last studied lesson
  const { data: lastProgress } = await supabase
    .from("progress")
    .select("lesson_id, completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single();

  let lastLesson: {
    id: string;
    title: string;
    courseId: string;
    courseName: string;
  } | null = null;

  if (lastProgress) {
    const { data: lesson } = await supabase
      .from("lessons")
      .select("id, title, module_id")
      .eq("id", lastProgress.lesson_id)
      .single();

    if (lesson) {
      const { data: lessonModule } = await supabase
        .from("modules")
        .select("course_id")
        .eq("id", lesson.module_id)
        .single();

      if (lessonModule) {
        const { data: course } = await supabase
          .from("courses")
          .select("id, name")
          .eq("id", lessonModule.course_id)
          .single();

        if (course) {
          lastLesson = {
            id: lesson.id,
            title: lesson.title,
            courseId: course.id,
            courseName: course.name,
          };
        }
      }
    }
  }

  const firstName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Estudiante";
  const activeCoursesCount = enrollmentsWithProgress.length;
  const xp = profile?.nivel_xp || 0;
  const role = profile?.role || "estudiante";

  // Determine if user is EXTERNO (enrolled in curso/bootcamp/preuni vs carrera)
  const activeEnrollment = (enrollments || [])[0];
  const enrolledProgramType = (activeEnrollment?.programs as { type?: string } | null)?.type ?? null;
  const isExterno =
    role === "estudiante" &&
    (enrolledProgramType === "curso" ||
      enrolledProgramType === "bootcamp" ||
      enrolledProgramType === "preuni");

  // Proximas clases para widget de calendario
  const upcomingEvents = await getUpcomingEventsForUser(user.id, role, 3);

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Bienvenido, {firstName}
        </h1>
        <p className="mt-1 text-base text-muted-foreground">
          Continua tu camino en inteligencia artificial. Aqui tienes un resumen de tu progreso.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<BookOpen className="size-5 text-[#73B8E7]" />}
          label="Cursos Activos"
          value={activeCoursesCount}
          accent="bg-[#73B8E7]/10"
        />
        <StatCard
          icon={<CheckCircle2 className="size-5 text-emerald-500" />}
          label="Lecciones Completadas"
          value={completedLessonsCount || 0}
          accent="bg-emerald-500/10"
        />
        <StatCard
          icon={<Zap className="size-5 text-[#FBBC0C]" />}
          label="Nivel XP"
          value={xp.toLocaleString()}
          accent="bg-[#FBBC0C]/10"
        />
        <StatCard
          icon={<Flame className="size-5 text-[#F0846D]" />}
          label="Racha de Dias"
          value={streak}
          suffix={streak === 1 ? "dia" : "dias"}
          accent="bg-[#F0846D]/10"
        />
      </div>

      {/* Mi Carrera section */}
      {careerProgressData.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
            <School className="size-5 text-[#73B8E7]" />
            Mi Carrera
          </h2>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {careerProgressData.map((career) => (
              <Card
                key={career.programId}
                className="border-none bg-gradient-to-br from-[#1F2F58] to-[#0A1628] text-white shadow-lg"
              >
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                        Carrera Activa
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {career.programName}
                      </p>
                    </div>
                    <Badge className="border-none bg-[#FBBC0C]/15 text-[#FBBC0C] text-xs">
                      Semestre {career.currentSemester} de {career.totalSemesters}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/80">Progreso total</span>
                      <span className="text-sm font-semibold text-white">
                        {career.percent}%
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all duration-700"
                        style={{ width: `${career.percent}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-white/60">
                      {career.completedSessions} / {career.totalSessions} sesiones completadas
                    </p>
                  </div>
                  <Link href={`/carreras/${career.programSlug}`}>
                    <Button
                      size="sm"
                      className="w-full bg-[#FBBC0C] font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 sm:w-auto"
                    >
                      Ver Carrera
                      <ArrowRight className="ml-2 size-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick access to last lesson */}
      {lastLesson && (
        <Card className="border-none bg-gradient-to-r from-[#1F2F58] to-[#0A1628] text-white shadow-lg">
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#FBBC0C]/20">
                <Play className="size-5 text-[#FBBC0C]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                  Continuar donde lo dejaste
                </p>
                <p className="mt-0.5 text-lg font-semibold text-white">
                  {lastLesson.title}
                </p>
                <p className="text-sm text-[#73B8E7]">
                  {lastLesson.courseName}
                </p>
              </div>
            </div>
            <Link href={`/courses/${lastLesson.courseId}/lesson/${lastLesson.id}`}>
              <Button
                size="lg"
                className="w-full bg-[#FBBC0C] font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 sm:w-auto"
              >
                Continuar
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Enrolled programs — hidden for EXTERNO (they use /mi-curso) */}
      {!isExterno && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Mis Programas</h2>
            <Link href="/carreras">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Ver carreras
                <ArrowRight className="ml-1 size-3.5" />
              </Button>
            </Link>
          </div>

          {enrollmentsWithProgress.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enrollmentsWithProgress.map((enrollment) => (
                <Card
                  key={enrollment.id}
                  className="group border border-border bg-card transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <GraduationCap className="size-5 text-primary" />
                      </div>
                      <ProgramTypeBadge type={enrollment.programs?.type} />
                    </div>
                    <CardTitle className="mt-3 text-card-foreground">
                      {enrollment.programs?.name || "Carrera"}
                    </CardTitle>
                    {enrollment.programs?.description && (
                      <CardDescription className="line-clamp-2">
                        {enrollment.programs.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-semibold text-card-foreground">
                          {enrollment.percentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all duration-500"
                          style={{ width: `${enrollment.percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {enrollment.completedLessons} / {enrollment.totalLessons} lecciones
                        </span>
                        <Link href="/carreras">
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-[#73B8E7] hover:text-foreground"
                          >
                            Ver carrera
                            <ArrowRight className="ml-1 size-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                  <BookOpen className="size-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  Aun no tienes carreras activas
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Explora nuestras carreras de inteligencia artificial y comienza tu transformacion profesional.
                </p>
                <Link href="/carreras" className="mt-6">
                  <Button className="bg-primary font-semibold text-primary-foreground hover:opacity-90">
                    Explorar Carreras
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* EXTERNO: shortcut to their course */}
      {isExterno && enrollmentsWithProgress.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Mi Curso</h2>
            <Link href="/mi-curso">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Ver curso completo
                <ArrowRight className="ml-1 size-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollmentsWithProgress.map((enrollment) => (
              <Card
                key={enrollment.id}
                className="group border border-border bg-card transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <GraduationCap className="size-5 text-primary" />
                    </div>
                    <ProgramTypeBadge type={enrollment.programs?.type} />
                  </div>
                  <CardTitle className="mt-3 text-card-foreground">
                    {enrollment.programs?.name || "Curso"}
                  </CardTitle>
                  {enrollment.programs?.description && (
                    <CardDescription className="line-clamp-2">
                      {enrollment.programs.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-semibold text-card-foreground">
                        {enrollment.percentage}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all duration-500"
                        style={{ width: `${enrollment.percentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {enrollment.completedLessons} / {enrollment.totalLessons} lecciones
                      </span>
                      <Link href="/mi-curso">
                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-[#73B8E7] hover:text-foreground"
                        >
                          Ver curso
                          <ArrowRight className="ml-1 size-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Proximas clases — widget calendario */}
      {upcomingEvents.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarDays className="size-5 text-[#73B8E7]" />
              Proximas Clases
            </h2>
            <Link href="/calendario">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                Ver calendario
                <ArrowRight className="ml-1 size-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {upcomingEvents.map((event: CalendarEventWithDetails) => {
              const color = CALENDAR_EVENT_COLORS[event.type];
              const label = CALENDAR_EVENT_LABELS[event.type];
              const startTime = new Date(event.scheduled_at);
              const dateStr = startTime.toLocaleDateString("es-EC", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              const timeStr = startTime.toLocaleTimeString("es-EC", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              return (
                <Link key={event.id} href="/calendario">
                  <Card className="group cursor-pointer border-none bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-1 self-stretch rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex-1 min-w-0">
                          <span
                            className="text-[10px] font-semibold uppercase tracking-wider"
                            style={{ color }}
                          >
                            {label}
                          </span>
                          <p className="text-sm font-semibold text-[#0A1628] truncate mt-0.5">
                            {event.title}
                          </p>
                          {event.subjects && (
                            <p className="text-xs text-[#1F2F58]/50 truncate">
                              {event.subjects.name}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            <CalendarDays className="size-3 text-[#1F2F58]/30" />
                            <span className="text-xs text-[#1F2F58]/50 capitalize">
                              {dateStr}
                            </span>
                            <Clock className="size-3 text-[#1F2F58]/30 ml-1" />
                            <span className="text-xs text-[#1F2F58]/50">{timeStr}</span>
                          </div>
                          {event.type === "class" && event.videoconference_link && (
                            <a
                              href={event.videoconference_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 mt-2 text-xs font-medium text-[#1F2F58] hover:text-[#73B8E7] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Video className="size-3" />
                              Unirse a clase
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickAction
          href="/ai-lab"
          icon={<Zap className="size-5" />}
          title="AI Lab"
          description="Practica con inteligencia artificial"
          color="text-[#FBBC0C]"
          bg="bg-[#FBBC0C]/10"
        />
        {isExterno ? (
          <QuickAction
            href="/biblioteca"
            icon={<BookOpen className="size-5" />}
            title="Biblioteca"
            description="Recursos y materiales"
            color="text-[#73B8E7]"
            bg="bg-[#73B8E7]/10"
          />
        ) : (
          <QuickAction
            href="/calendario"
            icon={<CalendarDays className="size-5" />}
            title="Calendario"
            description="Tus clases y evaluaciones"
            color="text-[#73B8E7]"
            bg="bg-[#73B8E7]/10"
          />
        )}
        <QuickAction
          href="/profile"
          icon={<Clock className="size-5" />}
          title="Mi Perfil"
          description="Actualiza tu informacion"
          color="text-[#F0846D]"
          bg="bg-[#F0846D]/10"
        />
      </div>
    </div>
  );
}

/* ─── Helper Components ─── */

function StatCard({
  icon,
  label,
  value,
  suffix,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
  accent: string;
}) {
  return (
    <Card className="border-none bg-white shadow-sm">
      <CardContent className="flex items-center gap-4">
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-[#1F2F58]/50">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-[#0A1628]">
            {value}
            {suffix && (
              <span className="ml-1 text-sm font-normal text-[#1F2F58]/40">
                {suffix}
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgramTypeBadge({ type }: { type?: string }) {
  const config: Record<string, { label: string; className: string }> = {
    carrera: {
      label: "Carrera",
      className: "bg-white/15 text-white",
    },
    curso: {
      label: "Curso",
      className: "bg-[#73B8E7]/20 text-[#73B8E7]",
    },
    preuni: {
      label: "Preuniversitario",
      className: "bg-[#FBBC0C]/20 text-[#FBBC0C]",
    },
    bootcamp: {
      label: "Bootcamp",
      className: "bg-[#F0846D]/20 text-[#F0846D]",
    },
  };

  const c = config[type || "curso"] || config.curso;

  return (
    <Badge className={`border-none text-[10px] font-semibold uppercase tracking-wider ${c.className}`}>
      {c.label}
    </Badge>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
  color,
  bg,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  bg: string;
}) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer border-none bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="flex items-center gap-4">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${bg} ${color} transition-transform group-hover:scale-110`}
          >
            {icon}
          </div>
          <div>
            <p className="font-semibold text-[#0A1628]">{title}</p>
            <p className="text-xs text-[#1F2F58]/50">{description}</p>
          </div>
          <ArrowRight className="ml-auto size-4 text-[#1F2F58]/20 transition-all group-hover:translate-x-1 group-hover:text-[#1F2F58]/50" />
        </CardContent>
      </Card>
    </Link>
  );
}

/* ─── Utilities ─── */

function calculateStreak(
  progressItems: { completed_at: string | null }[]
): number {
  if (!progressItems.length) return 0;

  // Get unique dates (YYYY-MM-DD) sorted desc
  const uniqueDates = [
    ...new Set(
      progressItems
        .filter((p) => p.completed_at)
        .map((p) => p.completed_at!.substring(0, 10))
    ),
  ].sort((a, b) => b.localeCompare(a));

  if (uniqueDates.length === 0) return 0;

  const today = new Date().toISOString().substring(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().substring(0, 10);

  // Streak must start from today or yesterday
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = (prev.getTime() - curr.getTime()) / 86400000;

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
