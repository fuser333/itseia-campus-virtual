import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Search } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";

export const metadata: Metadata = {
  title: "Mis Cursos | ITSEIA Academy",
  description: "Tus cursos de inteligencia artificial en ITSEIA Academy",
};

export default async function CoursesPage() {
  const authClient = await createClient();
  const supabase = supabaseAdmin;

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch enrollments with programs
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, programs(*)")
    .eq("user_id", user.id)
    .eq("status", "active");

  const programIds = enrollments?.map((e) => e.program_id) || [];

  if (programIds.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0A1628]">
            Mis Cursos
          </h1>
          <p className="mt-1 text-base text-[#1F2F58]/60">
            Todos tus cursos en un solo lugar
          </p>
        </div>

        <Card className="border-dashed border-[#1F2F58]/20 bg-white/50">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex size-20 items-center justify-center rounded-2xl bg-[#FBBC0C]/10">
              <BookOpen className="size-10 text-[#FBBC0C]" />
            </div>
            <h2 className="text-xl font-bold text-[#0A1628]">
              Aun no estas inscrito en ninguna carrera
            </h2>
            <p className="mt-2 max-w-md text-sm text-[#1F2F58]/50">
              Comienza tu camino en inteligencia artificial. Explora nuestros
              carreras, cursos profesionales y bootcamps disenados
              para el mercado ecuatoriano.
            </p>
            <Link href="/dashboard" className="mt-8">
              <Button className="bg-[#FBBC0C] font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90">
                Explorar Carreras
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch all courses for enrolled programs
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .in("program_id", programIds)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  // Build a map of program_id -> program
  const programMap = new Map(
    enrollments?.map((e) => [e.program_id, e.programs]) || []
  );

  // For each course, calculate progress
  const coursesWithProgress = await Promise.all(
    (courses || []).map(async (course) => {
      // Get modules
      const { data: modules } = await supabase
        .from("modules")
        .select("id")
        .eq("course_id", course.id)
        .eq("is_active", true);

      const moduleIds = modules?.map((m) => m.id) || [];

      if (moduleIds.length === 0) {
        return {
          ...course,
          program: programMap.get(course.program_id),
          totalLessons: 0,
          completedLessons: 0,
          lastLessonId: null,
        };
      }

      // Get total lessons
      const { data: allLessons } = await supabase
        .from("lessons")
        .select("id")
        .in("module_id", moduleIds)
        .eq("is_active", true);

      const lessonIds = allLessons?.map((l) => l.id) || [];
      const totalLessons = lessonIds.length;

      let completedLessons = 0;
      let lastLessonId: string | null = null;

      if (lessonIds.length > 0) {
        // Get completed count
        const { count } = await supabase
          .from("progress")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("completed", true)
          .in("lesson_id", lessonIds);
        completedLessons = count || 0;

        // Get last studied lesson in this course
        const { data: lastProg } = await supabase
          .from("progress")
          .select("lesson_id")
          .eq("user_id", user.id)
          .in("lesson_id", lessonIds)
          .order("completed_at", { ascending: false })
          .limit(1)
          .single();

        if (lastProg) {
          lastLessonId = lastProg.lesson_id;
        } else {
          // No progress yet, point to first lesson
          const { data: firstLesson } = await supabase
            .from("lessons")
            .select("id")
            .in("module_id", moduleIds)
            .eq("is_active", true)
            .order("order_index", { ascending: true })
            .limit(1)
            .single();
          lastLessonId = firstLesson?.id || null;
        }
      }

      return {
        ...course,
        program: programMap.get(course.program_id),
        totalLessons,
        completedLessons,
        lastLessonId,
      };
    })
  );

  // Group by program
  const groupedByProgram = new Map<string, typeof coursesWithProgress>();
  for (const course of coursesWithProgress) {
    const programId = course.program_id;
    if (!groupedByProgram.has(programId)) {
      groupedByProgram.set(programId, []);
    }
    groupedByProgram.get(programId)!.push(course);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0A1628]">
            Mis Cursos
          </h1>
          <p className="mt-1 text-base text-[#1F2F58]/60">
            {coursesWithProgress.length} curso{coursesWithProgress.length !== 1 ? "s" : ""} en{" "}
            {groupedByProgram.size} carrera{groupedByProgram.size !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Courses grouped by program */}
      <div className="space-y-10">
        {Array.from(groupedByProgram.entries()).map(
          ([programId, programCourses]) => {
            const program = programMap.get(programId);
            return (
              <section key={programId}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#1F2F58]/8" />
                  <h2 className="shrink-0 text-sm font-semibold uppercase tracking-wider text-[#1F2F58]/40">
                    {program?.name || "Carrera"}
                  </h2>
                  <div className="h-px flex-1 bg-[#1F2F58]/8" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {programCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      name={course.name}
                      description={course.description}
                      programName={course.program?.name || "Carrera"}
                      programType={course.program?.type || "curso"}
                      totalLessons={course.totalLessons}
                      completedLessons={course.completedLessons}
                      lastLessonId={course.lastLessonId}
                    />
                  ))}
                </div>
              </section>
            );
          }
        )}
      </div>
    </div>
  );
}
