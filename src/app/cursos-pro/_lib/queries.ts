/**
 * Queries server-side para el módulo /cursos-pro.
 *
 * IMPORTANTE: usan supabaseAdmin (service role) — bypasea RLS pero
 * filtramos manualmente por profile_id para que un alumno nunca vea cursos
 * o sesiones de otro. Esto es equivalente a confiar en RLS pero con tipos
 * más estables y sin el riesgo de "infinite recursion" de RLS.
 *
 * Las RLS de la migration 017 quedan como red de seguridad para queries
 * client-side (vista alumno desde cliente, AILabPanel, QuizEngine, etc.).
 */

import { supabaseAdmin } from "@/lib/supabase/admin";

export interface CursosProCourse {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  category: string | null;
  price_usd: number;
  total_hours: number;
  total_sessions: number;
  total_modules: number;
  start_date: string;
  end_date: string;
  cover_image_url: string | null;
  is_active: boolean;
}

export interface CursosProModule {
  id: string;
  course_id: string;
  num: number;
  name: string;
  description: string | null;
  hours: number;
  /** URL slug — migration 021. Ej: m1-fundamentos-ia-lopdp */
  slug: string | null;
}

export type SessionStatus = "scheduled" | "live" | "done" | "cancelled";

export interface CursosProSession {
  id: string;
  course_id: string;
  module_id: string | null;
  num: number;
  /** Posición 1-N dentro del módulo — migration 021 */
  num_in_module: number | null;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  meet_url: string | null;
  recording_url: string | null;
  recording_provider: string | null;
  video_url: string | null;
  slides_url: string | null;
  theory_md: string | null;
  exercise_md: string | null;
  quiz_json: unknown;
  resources_json: unknown;
  ailab_config_json: unknown;
  status: SessionStatus;
}

export interface CursosProEnrollment {
  id: string;
  course_id: string;
  profile_id: string;
  paid_at: string | null;
  amount_paid: number | null;
  payment_ref: string | null;
  access_until: string | null;
  status: "active" | "suspended" | "completed" | "refunded" | "cancelled";
  enrolled_at: string;
  notes: string | null;
}

/** Devuelve un curso por slug, o null si no existe. */
export async function getCourseBySlug(
  slug: string
): Promise<CursosProCourse | null> {
  const { data, error } = await supabaseAdmin
    .from("cursos_pro_courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) return null;
  return (data as CursosProCourse | null) ?? null;
}

/** Devuelve el enrollment activo del usuario para ese curso, o null. */
export async function getUserEnrollment(
  courseId: string,
  profileId: string
): Promise<CursosProEnrollment | null> {
  const { data, error } = await supabaseAdmin
    .from("cursos_pro_enrollments")
    .select("*")
    .eq("course_id", courseId)
    .eq("profile_id", profileId)
    .eq("status", "active")
    .maybeSingle();
  if (error) return null;
  return (data as CursosProEnrollment | null) ?? null;
}

/** Devuelve los módulos de un curso ordenados por num (incluye slug). */
export async function getModulesForCourse(
  courseId: string
): Promise<CursosProModule[]> {
  const { data } = await supabaseAdmin
    .from("cursos_pro_modules")
    .select("*")
    .eq("course_id", courseId)
    .order("num", { ascending: true });
  return (data as CursosProModule[] | null) ?? [];
}

/** Devuelve un módulo por course_id + slug. */
export async function getModuleBySlug(
  courseId: string,
  moduleSlug: string
): Promise<CursosProModule | null> {
  const { data, error } = await supabaseAdmin
    .from("cursos_pro_modules")
    .select("*")
    .eq("course_id", courseId)
    .eq("slug", moduleSlug)
    .maybeSingle();
  if (error) return null;
  return (data as CursosProModule | null) ?? null;
}

/** Devuelve las sesiones de un curso ordenadas por num. */
export async function getSessionsForCourse(
  courseId: string
): Promise<CursosProSession[]> {
  const { data } = await supabaseAdmin
    .from("cursos_pro_sessions")
    .select("*")
    .eq("course_id", courseId)
    .order("num", { ascending: true });
  return (data as CursosProSession[] | null) ?? [];
}

/** Devuelve las sesiones de un módulo específico, ordenadas por num_in_module. */
export async function getSessionsForModule(
  moduleId: string
): Promise<CursosProSession[]> {
  const { data } = await supabaseAdmin
    .from("cursos_pro_sessions")
    .select("*")
    .eq("module_id", moduleId)
    .order("num_in_module", { ascending: true });
  return (data as CursosProSession[] | null) ?? [];
}

/** Devuelve una sesión por módulo + num_in_module. */
export async function getSessionByModuleAndNum(
  moduleId: string,
  numInModule: number
): Promise<CursosProSession | null> {
  const { data, error } = await supabaseAdmin
    .from("cursos_pro_sessions")
    .select("*")
    .eq("module_id", moduleId)
    .eq("num_in_module", numInModule)
    .maybeSingle();
  if (error) return null;
  return (data as CursosProSession | null) ?? null;
}

/** Devuelve una sesión específica por número global dentro de un curso. */
export async function getSessionByNum(
  courseId: string,
  num: number
): Promise<CursosProSession | null> {
  const { data, error } = await supabaseAdmin
    .from("cursos_pro_sessions")
    .select("*")
    .eq("course_id", courseId)
    .eq("num", num)
    .maybeSingle();
  if (error) return null;
  return (data as CursosProSession | null) ?? null;
}

/** Devuelve las sesiones que el alumno marcó completadas (Set de session_id). */
export async function getCompletedSessionIds(
  enrollmentId: string
): Promise<Set<string>> {
  const { data } = await supabaseAdmin
    .from("cursos_pro_session_progress")
    .select("session_id")
    .eq("enrollment_id", enrollmentId)
    .not("completed_at", "is", null);
  type Row = { session_id: string };
  const ids = ((data as Row[] | null) ?? []).map((r) => r.session_id);
  return new Set(ids);
}

/** Cohorte: número total de alumnos activos en un curso. */
export async function getCohortSize(courseId: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from("cursos_pro_enrollments")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId)
    .eq("status", "active");
  return count ?? 0;
}

/** Devuelve role del profile (única fuente de verdad — regla blindada #1). */
export async function getUserRole(userId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return (data?.role as string | null) ?? null;
}
