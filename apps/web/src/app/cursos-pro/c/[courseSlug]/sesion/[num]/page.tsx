/**
 * URL legacy: /cursos-pro/c/[courseSlug]/sesion/[num] (num = global del curso 1..20)
 *
 * Mantiene compatibilidad con links viejos del sidebar y matriculas previas
 * REDIRIGIENDO al esquema modular nuevo de 9 pestanas:
 * /cursos-pro/[courseSlug]/modulo/[moduleSlug]/sesion/[numInModule]
 */

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

interface PageProps {
  params: Promise<{ courseSlug: string; num: string }>;
}

const ADMIN_ROLES = new Set(["super_admin", "admin", "coordinacion", "docente"]);

// Mapa fallback module num -> slug (cuando BD no tiene slug aun)
const MODULE_NUM_TO_SLUG: Record<number, string> = {
  1: "m1-fundamentos-ia-lopdp",
  2: "m2-stack-profesional-ia",
  3: "m3-gestion-operativa-ia",
  4: "m4-facturacion-power-bi-cierre",
};

export default async function CursoProSesionLegacyRedirect({ params }: PageProps) {
  const { courseSlug, num } = await params;
  const sessionNum = parseInt(num, 10);
  if (Number.isNaN(sessionNum)) notFound();

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) {
    redirect(`/login?module=cursos-pro&next=/cursos-pro/c/${courseSlug}/sesion/${num}`);
  }

  const course = await getCourseBySlug(courseSlug);
  if (!course || !course.is_active) notFound();

  const role = await getUserRole(user.id);
  const isStaff = ADMIN_ROLES.has(role ?? "");
  const enrollment = await getUserEnrollment(course.id, user.id);

  if (!enrollment && !isStaff) {
    redirect(`/cursos-pro?nf=${courseSlug}`);
  }

  const [session, allSessions, modules] = await Promise.all([
    getSessionByNum(course.id, sessionNum),
    getSessionsForCourse(course.id),
    getModulesForCourse(course.id),
  ]);
  if (!session) notFound();

  // Resolver module slug
  let moduleSlug: string | null = null;
  let moduleNum: number | null = null;
  if (session.module_id) {
    const mod = modules.find((m) => m.id === session.module_id);
    if (mod) {
      moduleNum = mod.num;
      // Si llegamos a tener slug en BD lo preferimos; por ahora fallback al map
      moduleSlug = MODULE_NUM_TO_SLUG[mod.num] ?? null;
    }
  }
  // Fallback: 5 sesiones por modulo (1-5=M1, 6-10=M2, etc.)
  if (!moduleNum) {
    moduleNum = Math.ceil(sessionNum / 5);
  }
  if (!moduleSlug) {
    moduleSlug = MODULE_NUM_TO_SLUG[moduleNum] ?? `m${moduleNum}`;
  }

  // num_in_module: posicion de la sesion dentro de su modulo (1..N)
  const sessionsSameModule = allSessions
    .filter((s) => {
      if (session.module_id && s.module_id) return s.module_id === session.module_id;
      return Math.ceil(s.num / 5) === moduleNum;
    })
    .sort((a, b) => a.num - b.num);
  const idx = sessionsSameModule.findIndex((s) => s.id === session.id);
  const numInModule = idx >= 0 ? idx + 1 : ((sessionNum - 1) % 5) + 1;

  redirect(
    `/cursos-pro/${courseSlug}/modulo/${moduleSlug}/sesion/${numInModule}`
  );
}
