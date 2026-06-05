/**
 * Redirect 301 · Ruta legacy → Nueva ruta con módulo.
 *
 * /cursos-pro/c/[courseSlug]/sesion/[num] (global)
 *   →
 * /cursos-pro/[courseSlug]/modulo/[moduleSlug]/sesion/[numInModule]
 *
 * Si la sesión no tiene módulo o no tiene num_in_module,
 * redirigimos al dashboard del curso.
 */

import { redirect, notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface PageProps {
  params: Promise<{ courseSlug: string; num: string }>;
}

export default async function LegacySesionRedirectPage({ params }: PageProps) {
  const { courseSlug, num } = await params;
  const globalNum = parseInt(num, 10);
  if (Number.isNaN(globalNum)) notFound();

  // Buscar el curso por slug
  const { data: course } = await supabaseAdmin
    .from("cursos_pro_courses")
    .select("id")
    .eq("slug", courseSlug)
    .maybeSingle();

  if (!course) {
    redirect(`/cursos-pro`);
  }

  // Buscar la sesión por num global + course_id
  const { data: session } = await supabaseAdmin
    .from("cursos_pro_sessions")
    .select("id, num_in_module, module_id")
    .eq("course_id", course.id)
    .eq("num", globalNum)
    .maybeSingle();

  if (!session || !session.module_id) {
    // Fallback: ir al dashboard del curso
    redirect(`/cursos-pro/${courseSlug}`);
  }

  // Buscar el slug del módulo
  const { data: modulo } = await supabaseAdmin
    .from("cursos_pro_modules")
    .select("slug")
    .eq("id", session.module_id)
    .maybeSingle();

  if (!modulo?.slug) {
    redirect(`/cursos-pro/${courseSlug}`);
  }

  const numInModule = session.num_in_module ?? globalNum;

  // Redirect 301 permanente hacia la nueva URL
  redirect(
    `/cursos-pro/${courseSlug}/modulo/${modulo.slug}/sesion/${numInModule}`
  );
}
