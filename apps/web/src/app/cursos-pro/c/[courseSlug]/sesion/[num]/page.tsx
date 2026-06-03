import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

  const moduleOfSession = modules.find((m) => m.id === session.module_id) ?? null;
  const prev = sessions.find((s) => s.num === sessionNum - 1) ?? null;
  const next = sessions.find((s) => s.num === sessionNum + 1) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/cursos-pro/c/${courseSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1F2F58]/60 hover:text-[#1F2F58]"
        >
          <ArrowLeft className="size-3.5" />
          Volver al curso
        </Link>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-[#73B8E7]">
          {course.name}
          {moduleOfSession ? ` · M${moduleOfSession.num} ${moduleOfSession.name}` : ""}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1628] leading-tight">
          Sesión {session.num} · {session.title}
        </h1>
      </div>

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
        enrollmentId={enrollment?.id ?? null}
        prevHref={prev ? `/cursos-pro/c/${courseSlug}/sesion/${prev.num}` : null}
        nextHref={next ? `/cursos-pro/c/${courseSlug}/sesion/${next.num}` : null}
      />
    </div>
  );
}
