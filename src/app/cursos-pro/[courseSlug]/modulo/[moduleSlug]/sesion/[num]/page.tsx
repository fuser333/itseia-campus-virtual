/**
 * Página de sesión · Cursos Profesionales · Ruta nueva (con módulo en URL)
 * URL: /cursos-pro/[courseSlug]/modulo/[moduleSlug]/sesion/[num]
 *
 * Equivalente al preuni:
 * /carreras/preuniversitario-ia/materia/preuni-semana-1-fundamentos-ia/sesion/1
 *
 * Renderiza StudentSessionView con las 9 pestañas idénticas al preuni.
 */

import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import {
  getCourseBySlug,
  getUserEnrollment,
  getModuleBySlug,
  getSessionByModuleAndNum,
  getSessionsForModule,
  getUserRole,
} from "@/app/cursos-pro/_lib/queries";
import StudentSessionView from "./StudentSessionView";

interface PageProps {
  params: Promise<{
    courseSlug: string;
    moduleSlug: string;
    num: string;
  }>;
}

const ADMIN_ROLES = new Set(["super_admin", "admin", "coordinacion", "docente"]);

export default async function CursoProModuloSesionPage({ params }: PageProps) {
  const { courseSlug, moduleSlug, num } = await params;
  const numInModule = parseInt(num, 10);
  if (Number.isNaN(numInModule)) notFound();

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user)
    redirect(
      `/login?module=cursos-pro&next=/cursos-pro/${courseSlug}/modulo/${moduleSlug}/sesion/${num}`
    );

  const course = await getCourseBySlug(courseSlug);
  if (!course || !course.is_active) notFound();

  const role = await getUserRole(user.id);
  const isStaff = ADMIN_ROLES.has(role ?? "");
  const enrollment = await getUserEnrollment(course.id, user.id);

  if (!enrollment && !isStaff) {
    redirect(`/cursos-pro?nf=${courseSlug}`);
  }

  const modulo = await getModuleBySlug(course.id, moduleSlug);
  if (!modulo) notFound();

  const [session, allModuleSessions] = await Promise.all([
    getSessionByModuleAndNum(modulo.id, numInModule),
    getSessionsForModule(modulo.id),
  ]);

  if (!session) notFound();

  const prev = allModuleSessions.find(
    (s) => (s.num_in_module ?? s.num) === numInModule - 1
  ) ?? null;
  const next = allModuleSessions.find(
    (s) => (s.num_in_module ?? s.num) === numInModule + 1
  ) ?? null;

  const prevHref = prev
    ? `/cursos-pro/${courseSlug}/modulo/${moduleSlug}/sesion/${prev.num_in_module ?? prev.num}`
    : null;
  const nextHref = next
    ? `/cursos-pro/${courseSlug}/modulo/${moduleSlug}/sesion/${next.num_in_module ?? next.num}`
    : null;

  return (
    <StudentSessionView
      session={{
        id: session.id,
        num: session.num,
        num_in_module: session.num_in_module,
        title: session.title,
        description: session.description,
        scheduled_at: session.scheduled_at,
        duration_minutes: session.duration_minutes,
        meet_url: session.meet_url,
        recording_url: session.recording_url,
        video_url: session.video_url,
        slides_url: session.slides_url,
        theory_md: session.theory_md,
        exercise_md: session.exercise_md,
        quiz_json: session.quiz_json,
        resources_json: session.resources_json,
        ailab_config_json: session.ailab_config_json,
        status: session.status,
      }}
      courseSlug={courseSlug}
      courseName={course.name}
      moduleSlug={moduleSlug}
      moduleName={modulo.name}
      totalSessionsInModule={allModuleSessions.length}
      prevHref={prevHref}
      nextHref={nextHref}
    />
  );
}
