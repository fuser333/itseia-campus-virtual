import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import {
  getCourseBySlug,
  getUserEnrollment,
  getSessionByNum,
  getSessionsForCourse,
  getModulesForCourse,
  getUserRole,
} from "../../../../_lib/queries";
import StudentSessionView from "./StudentSessionView";

interface PageProps {
  params: Promise<{ courseSlug: string; num: string }>;
}

const ADMIN_ROLES = new Set(["super_admin", "admin", "coordinacion", "docente"]);

export default async function CursoProSesionPage({ params }: PageProps) {
  const { courseSlug, num } = await params;
  const sessionNum = parseInt(num, 10);
  if (Number.isNaN(sessionNum)) notFound();

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user)
    redirect(`/login?module=cursos-pro&next=/cursos-pro/c/${courseSlug}/sesion/${num}`);

  const course = await getCourseBySlug(courseSlug);
  if (!course || !course.is_active) notFound();

  const role = await getUserRole(user.id);
  const isStaff = ADMIN_ROLES.has(role ?? "");
  const enrollment = await getUserEnrollment(course.id, user.id);

  if (!enrollment && !isStaff) {
    redirect(`/cursos-pro?nf=${courseSlug}`);
  }

  const [session, sessions, modules] = await Promise.all([
    getSessionByNum(course.id, sessionNum),
    getSessionsForCourse(course.id),
    getModulesForCourse(course.id),
  ]);
  if (!session) notFound();

  // modules se mantiene para posible uso futuro (módulo de la sesión)
  void modules;

  const prev = sessions.find((s) => s.num === sessionNum - 1) ?? null;
  const next = sessions.find((s) => s.num === sessionNum + 1) ?? null;

  // StudentSessionView ahora incluye su propio header + breadcrumb
  // con el look del Campus v2 (borderLeft accent, fondo navy).
  return (
    <StudentSessionView
      session={{
        id: session.id,
        num: session.num,
        title: session.title,
        description: session.description,
        scheduled_at: session.scheduled_at,
        duration_minutes: session.duration_minutes,
        meet_url: session.meet_url,
        recording_url: session.recording_url,
        theory_md: session.theory_md,
        exercise_md: session.exercise_md,
        quiz_json: session.quiz_json,
        resources_json: session.resources_json,
        status: session.status,
      }}
      courseSlug={courseSlug}
      enrollmentId={enrollment?.id ?? null}
      prevHref={prev ? `/cursos-pro/c/${courseSlug}/sesion/${prev.num}` : null}
      nextHref={next ? `/cursos-pro/c/${courseSlug}/sesion/${next.num}` : null}
    />
  );
}
