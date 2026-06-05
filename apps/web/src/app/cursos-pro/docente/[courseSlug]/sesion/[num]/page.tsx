/**
 * URL legacy docente: /cursos-pro/docente/[courseSlug]/sesion/[num] (num global)
 *
 * Redirige server-side a la URL NUEVA con 13 pestañas:
 *   /cursos-pro/docente/[courseSlug]/m/[moduleSlug]/sesion/[numInModule]
 */

import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import {
  getCourseBySlug,
  getSessionByNum,
  getSessionsForCourse,
  getModulesForCourse,
  getUserRole,
} from "../../../../_lib/queries";

interface PageProps {
  params: Promise<{ courseSlug: string; num: string }>;
}

const ADMIN_ROLES = new Set([
  "super_admin",
  "admin",
  "coordinacion",
  "docente",
  "finanzas",
]);

const MODULE_NUM_TO_SLUG: Record<number, string> = {
  1: "m1-fundamentos-ia-lopdp",
  2: "m2-stack-profesional-ia",
  3: "m3-gestion-operativa-ia",
  4: "m4-facturacion-power-bi-cierre",
  5: "m5-proyecto-final",
};

export default async function DocenteCursoSesionLegacyRedirect({
  params,
}: PageProps) {
  const { courseSlug, num } = await params;
  const sessionNum = parseInt(num, 10);
  if (Number.isNaN(sessionNum)) notFound();

  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) {
    redirect(
      `/login?module=cursos-pro&next=/cursos-pro/docente/${courseSlug}/sesion/${num}`
    );
  }

  const role = await getUserRole(user.id);
  if (!ADMIN_ROLES.has(role ?? "")) {
    redirect("/cursos-pro");
  }

  const course = await getCourseBySlug(courseSlug);
  if (!course) notFound();

  const [session, allSessions, modules] = await Promise.all([
    getSessionByNum(course.id, sessionNum),
    getSessionsForCourse(course.id),
    getModulesForCourse(course.id),
  ]);
  if (!session) notFound();

  // Resolver moduleSlug + numInModule
  let moduleSlug: string | null = null;
  let moduleNum: number | null = null;
  if (session.module_id) {
    const mod = modules.find((m) => m.id === session.module_id);
    if (mod) {
      moduleNum = mod.num;
      const modWithSlug = mod as unknown as { slug?: string | null };
      if (modWithSlug.slug) moduleSlug = modWithSlug.slug;
    }
  }
  if (!moduleNum) moduleNum = Math.ceil(sessionNum / 5);
  if (!moduleSlug) {
    moduleSlug = MODULE_NUM_TO_SLUG[moduleNum] ?? null;
  }
  // Si BD aún no tiene slug Y no está en el mapa de cursos conocidos,
  // notFound() limpio en vez de generar slug genérico falso (REGLA 6).
  if (!moduleSlug) notFound();

  const sessionsSameModule = allSessions
    .filter((s) => {
      if (session.module_id && s.module_id) {
        return s.module_id === session.module_id;
      }
      return Math.ceil(s.num / 5) === moduleNum;
    })
    .sort((a, b) => a.num - b.num);
  const idx = sessionsSameModule.findIndex((s) => s.id === session.id);
  const numInModule = idx >= 0 ? idx + 1 : ((sessionNum - 1) % 5) + 1;

  redirect(
    `/cursos-pro/docente/${courseSlug}/m/${moduleSlug}/sesion/${numInModule}`
  );
}
