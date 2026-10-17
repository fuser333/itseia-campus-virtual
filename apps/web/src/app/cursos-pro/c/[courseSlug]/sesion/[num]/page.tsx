/**
 * URL legacy del alumno: /cursos-pro/c/[courseSlug]/sesion/[num]
 *
 * Redirige server-side a la URL nueva con 9 pestañas:
 *   /cursos-pro/c/[courseSlug]/m/[moduleSlug]/sesion/[numInModule]
 *
 * Lógica: dado session.num global, busca el módulo (via session.module_id),
 * mapea module.num a moduleSlug usando MODULE_NUM_TO_SLUG fallback, y calcula
 * numInModule por orden de num dentro del módulo.
 *
 * Cuando la migration 022 esté aplicada y la columna `cursos_pro_modules.slug`
 * tenga valor, ese slug toma prioridad sobre el mapa fallback.
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

const ADMIN_ROLES = new Set([
  "super_admin",
  "admin",
  "coordinacion",
  "docente",
]);

// Fallback de slugs de módulo cuando BD aún no tiene la columna.
// Sólo cubre admin-salud (curso activo). Migration 022 lo deja inútil.
const MODULE_NUM_TO_SLUG: Record<number, string> = {
  1: "m1-fundamentos-ia-lopdp",
  2: "m2-stack-profesional-ia",
  3: "m3-gestion-operativa-ia",
  4: "m4-facturacion-power-bi-cierre",
  5: "m5-proyecto-final",
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
    redirect(
      `/login?module=cursos-pro&next=/cursos-pro/c/${courseSlug}/sesion/${num}`
    );
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

  // ─── Resolver moduleSlug + numInModule ────────────────────────────
  // Preferimos lo que esté en BD si existe; si no, mapeo fallback por num.
  let moduleSlug: string | null = null;
  let moduleNum: number | null = null;

  if (session.module_id) {
    const mod = modules.find((m) => m.id === session.module_id);
    if (mod) {
      moduleNum = mod.num;
      // Si en el futuro getModulesForCourse trae `slug`, preferirlo
      const modWithSlug = mod as unknown as { slug?: string | null };
      if (modWithSlug.slug) moduleSlug = modWithSlug.slug;
    }
  }

  // Fallback por número del módulo
  if (!moduleNum) {
    // 5 sesiones por módulo asumido para admin-salud
    moduleNum = Math.ceil(sessionNum / 5);
  }
  if (!moduleSlug) {
    moduleSlug = MODULE_NUM_TO_SLUG[moduleNum] ?? `m${moduleNum}-modulo`;
  }

  // numInModule = posición de la sesión dentro de su módulo (1..N)
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
    `/cursos-pro/c/${courseSlug}/m/${moduleSlug}/sesion/${numInModule}`
  );
}
