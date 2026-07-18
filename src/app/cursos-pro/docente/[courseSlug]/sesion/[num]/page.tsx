import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getCourseBySlug,
  getSessionByNum,
  getSessionsForCourse,
  getModulesForCourse,
  getUserRole,
} from "../../../../_lib/queries";
import TeacherSessionView from "./TeacherSessionView";

interface PageProps {
  params: Promise<{ courseSlug: string; num: string }>;
}

const ADMIN_ROLES = new Set(["super_admin", "admin", "coordinacion", "docente"]);

export default async function DocenteCursoSesionPage({ params }: PageProps) {
  const { courseSlug, num } = await params;
  const sessionNum = parseInt(num, 10);
  if (Number.isNaN(sessionNum)) notFound();

  const authClient = await createClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user)
    redirect(`/login?module=cursos-pro&next=/cursos-pro/docente/${courseSlug}/sesion/${num}`);

  const role = await getUserRole(user.id);
  if (!ADMIN_ROLES.has(role ?? "")) {
    redirect("/cursos-pro");
  }

  const course = await getCourseBySlug(courseSlug);
  if (!course) notFound();

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
          href={`/cursos-pro/docente/${courseSlug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1F2F58]/60 hover:text-[#1F2F58]"
        >
          <ArrowLeft className="size-3.5" />
          Vista docente · {course.name}
        </Link>
      </div>

      <TeacherSessionView
        session={session}
        courseSlug={courseSlug}
        courseName={course.name}
        moduleLabel={
          moduleOfSession ? `M${moduleOfSession.num} ${moduleOfSession.name}` : null
        }
        prevHref={
          prev ? `/cursos-pro/docente/${courseSlug}/sesion/${prev.num}` : null
        }
        nextHref={
          next ? `/cursos-pro/docente/${courseSlug}/sesion/${next.num}` : null
        }
      />
    </div>
  );
}
