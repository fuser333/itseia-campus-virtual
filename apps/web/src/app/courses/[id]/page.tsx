import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Play,
} from "lucide-react";
import ModuleAccordion from "@/components/courses/ModuleAccordion";
import type { Lesson } from "@/types/database";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const authClient = await createClient();
  const supabase = supabaseAdmin;

  const { data: course } = await supabase
    .from("courses")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: `${course?.name || "Curso"} | ITSEIA Academy`,
    description: `Contenido del curso ${course?.name || ""}`,
  };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;
  const authClient = await createClient();
  const supabase = supabaseAdmin;

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch course with program info
  const { data: course } = await supabase
    .from("courses")
    .select("*, programs:program_id(*)")
    .eq("id", id)
    .single();

  if (!course) {
    notFound();
  }

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("program_id", course.program_id)
    .eq("status", "active")
    .single();

  if (!enrollment) {
    redirect("/courses");
  }

  // Fetch modules with lessons
  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", id)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  // Fetch all lessons for all modules
  const moduleIds = modules?.map((m) => m.id) || [];

  let allLessons: Lesson[] = [];
  if (moduleIds.length > 0) {
    const { data: lessons } = await supabase
      .from("lessons")
      .select("*")
      .in("module_id", moduleIds)
      .eq("is_active", true)
      .order("order_index", { ascending: true });
    allLessons = lessons || [];
  }

  // Fetch user progress for all lessons in this course
  const lessonIds = allLessons.map((l) => l.id);
  let progressMap = new Map<string, boolean>();

  if (lessonIds.length > 0) {
    const { data: progress } = await supabase
      .from("progress")
      .select("lesson_id, completed")
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds);

    if (progress) {
      for (const p of progress) {
        if (p.completed) {
          progressMap.set(p.lesson_id, true);
        }
      }
    }
  }

  // Build modules with lessons and completion status
  const modulesWithLessons = (modules || []).map((mod) => {
    const modLessons = allLessons
      .filter((l) => l.module_id === mod.id)
      .map((l) => ({
        ...l,
        completed: progressMap.get(l.id) || false,
      }));

    return {
      ...mod,
      lessons: modLessons,
    };
  });

  // Calculate overall stats
  const totalLessons = allLessons.length;
  const completedLessons = Array.from(progressMap.values()).filter(Boolean).length;
  const percentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const totalDuration = allLessons.reduce(
    (acc, l) => acc + (l.duration_minutes || 0),
    0
  );

  const program = course.programs as {
    name: string;
    type: string;
  } | null;

  // Find first incomplete lesson for "Continuar" button
  let firstIncompleteLessonId: string | null = null;
  for (const mod of modulesWithLessons) {
    for (const lesson of mod.lessons) {
      if (!lesson.completed) {
        firstIncompleteLessonId = lesson.id;
        break;
      }
    }
    if (firstIncompleteLessonId) break;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
      {/* Breadcrumb / Back */}
      <Link
        href="/courses"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#1F2F58]/50 transition-colors hover:text-[#1F2F58]"
      >
        <ArrowLeft className="size-4" />
        Volver a Mis Cursos
      </Link>

      {/* Course header */}
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#1F2F58] to-[#0A1628] p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            {program && (
              <Badge className="mb-3 border-none bg-[#FBBC0C]/20 text-xs font-semibold uppercase tracking-wider text-[#FBBC0C]">
                {program.name}
              </Badge>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {course.name}
            </h1>
            {course.description && (
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {course.description}
              </p>
            )}

            {/* Stats row */}
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-[#73B8E7]" />
                <span className="text-sm text-white/70">
                  {modules?.length || 0} modulos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-[#73B8E7]" />
                <span className="text-sm text-white/70">
                  {totalLessons} lecciones
                </span>
              </div>
              {totalDuration > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-[#73B8E7]" />
                  <span className="text-sm text-white/70">
                    {totalDuration > 60
                      ? `${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`
                      : `${totalDuration} min`}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span className="text-sm text-white/70">
                  {completedLessons}/{totalLessons} completadas
                </span>
              </div>
            </div>
          </div>

          {/* Progress circle + CTA */}
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
                  strokeDasharray={`${percentage * 2.51} ${251 - percentage * 2.51}`}
                />
              </svg>
              <span className="absolute text-xl font-bold text-white">
                {percentage}%
              </span>
            </div>

            {firstIncompleteLessonId && (
              <Link href={`/courses/${id}/lesson/${firstIncompleteLessonId}`}>
                <Button
                  size="lg"
                  className="bg-[#FBBC0C] font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90"
                >
                  <Play className="mr-2 size-4" />
                  Continuar
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FBBC0C] to-[#F0846D] transition-all duration-700"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-3">
        <h2 className="mb-4 text-lg font-bold text-[#0A1628]">
          Contenido del Curso
        </h2>

        {modulesWithLessons.length > 0 ? (
          modulesWithLessons.map((mod, index) => (
            <ModuleAccordion
              key={mod.id}
              moduleId={mod.id}
              moduleName={mod.name}
              moduleIndex={index}
              courseId={id}
              lessons={mod.lessons}
              defaultOpen={index === 0}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-[#1F2F58]/15 bg-white/50 py-12 text-center">
            <BookOpen className="mx-auto size-10 text-[#1F2F58]/20" />
            <p className="mt-3 text-sm text-[#1F2F58]/40">
              El contenido de este curso se esta preparando. Vuelve pronto.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
