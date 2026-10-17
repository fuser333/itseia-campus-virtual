/**
 * Helpers para enrollments del alumno · Campus v2 (Opción B).
 *
 * Detecta qué producto + cohorte tiene activo un estudiante para enrutarlo al
 * shell `/[producto]` correcto.
 *
 * Capa de compatibilidad:
 *  · `enrollments` (genérica, programs.type)        → preuni, bootcamp, certificacion
 *  · `cursos_pro_enrollments` (cursos profesionales) → cursos-pro
 *  · `cohorte_metadata` + cohorte_slug              → fuente nueva (Campus v2)
 *
 * Server-only.
 */

import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { ProductoId } from '@/lib/productos/types';

export interface AlumnoEnrollmentActivo {
  producto: ProductoId;
  cohorte_slug: string;
  nombre_cohorte: string;
  fecha_inicio?: string | null;
  meet_url?: string | null;
  enrolled_at?: string | null;
}

/**
 * Mapea un `programs.type` legacy al ProductoId del Campus v2.
 * Si el `type` no mapea a un producto v2, devuelve undefined.
 */
function mapProgramTypeToProducto(type: string | null | undefined): ProductoId | undefined {
  switch (type) {
    case 'preuni':
    case 'preuniversitario':
      return 'preuni';
    case 'bootcamp':
      return 'bootcamp';
    case 'certificacion':
    case 'certificaciones':
      return 'certificaciones';
    case 'carrera':
    case 'carreras':
      return 'carreras';
    case 'mdt':
    case 'curso_mdt':
      return 'mdt';
    case 'b2b':
      return 'b2b';
    case 'demo':
      return 'demo';
    default:
      return undefined;
  }
}

/**
 * Lista TODOS los enrollments activos de un alumno mapeados a productos v2.
 * Combina `enrollments` + `cursos_pro_enrollments` ordenados por fecha más reciente.
 *
 * Para roles no-estudiante (admin/docente) devuelve [] · esto fuerza un redirect
 * al landing del rol correcto en el caller.
 */
export async function getEnrollmentsAlumno(userId: string): Promise<AlumnoEnrollmentActivo[]> {
  const results: AlumnoEnrollmentActivo[] = [];

  // ── 1. enrollments genéricos (preuni/bootcamp/certificacion/carrera) ────────
  const { data: enrollRows } = await supabaseAdmin
    .from('enrollments')
    .select('id, enrolled_at, status, programs!inner(id, name, type, slug)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false });

  interface EnrollRow {
    id: string;
    enrolled_at: string | null;
    status: string;
    // Supabase puede devolver el join como array (cuando la relación es 1:N
    // detectada implícitamente) o como objeto (1:1). Aceptamos ambos formatos.
    programs:
      | { id: string; name: string; type: string | null; slug: string | null }
      | { id: string; name: string; type: string | null; slug: string | null }[]
      | null;
  }

  for (const row of (enrollRows ?? []) as unknown as EnrollRow[]) {
    const program = Array.isArray(row.programs) ? row.programs[0] : row.programs;
    if (!program) continue;
    const producto = mapProgramTypeToProducto(program.type);
    if (!producto) continue;

    // Para Campus v2, la cohorte activa de preuni es 'cohorte-jun-2026'.
    // Si en el futuro tenemos múltiples cohortes simultáneas, este mapeo
    // debe leer de `cohorte_metadata` la cohorte activa para el alumno
    // (vía una tabla `cohorte_enrollments` aún no creada).
    let cohorte_slug = 'cohorte-jun-2026';
    let nombre_cohorte = program.name ?? 'Mi cohorte';
    let fecha_inicio: string | null = null;
    let meet_url: string | null = null;

    // Buscar la cohorte activa para este producto
    const { data: cohorte } = await supabaseAdmin
      .from('cohorte_metadata')
      .select('cohorte_slug, nombre_publico, fecha_inicio, meet_url')
      .eq('producto', producto)
      .eq('estado', 'activa')
      .order('fecha_inicio', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cohorte) {
      cohorte_slug = cohorte.cohorte_slug as string;
      nombre_cohorte = (cohorte.nombre_publico as string) ?? nombre_cohorte;
      fecha_inicio = cohorte.fecha_inicio as string | null;
      meet_url = cohorte.meet_url as string | null;
    }

    results.push({
      producto,
      cohorte_slug,
      nombre_cohorte,
      fecha_inicio,
      meet_url,
      enrolled_at: row.enrolled_at,
    });
  }

  // ── 2. cursos_pro_enrollments (cursos profesionales) ────────────────────────
  // FIX FASE 5: el schema 017 usa `profile_id` (NO `user_id`). Sin este fix,
  // el helper nunca devolvía enrollments de cursos-pro y el endpoint
  // post-login-redirect mandaba a Gisela/Josselin a /dashboard en vez de a
  // /cursos-pro/c/inca-gisela.
  const { data: cpRows } = await supabaseAdmin
    .from('cursos_pro_enrollments')
    .select('id, enrolled_at, status, cursos_pro_courses!inner(id, slug, name, start_date)')
    .eq('profile_id', userId)
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false });

  interface CursosProEnrollRow {
    id: string;
    enrolled_at: string | null;
    status: string;
    cursos_pro_courses:
      | { id: string; slug: string; name: string; start_date: string | null }
      | { id: string; slug: string; name: string; start_date: string | null }[]
      | null;
  }

  for (const row of (cpRows ?? []) as unknown as CursosProEnrollRow[]) {
    const course = Array.isArray(row.cursos_pro_courses)
      ? row.cursos_pro_courses[0]
      : row.cursos_pro_courses;
    if (!course) continue;

    // Para cursos-pro, el `cohorte_slug` es el `slug` del curso.
    const cohorte_slug = course.slug;

    // Intentar leer meta de cohorte_metadata para datos enriquecidos
    const { data: cohorte } = await supabaseAdmin
      .from('cohorte_metadata')
      .select('nombre_publico, fecha_inicio, meet_url')
      .eq('producto', 'cursos-pro')
      .eq('cohorte_slug', cohorte_slug)
      .maybeSingle();

    results.push({
      producto: 'cursos-pro',
      cohorte_slug,
      nombre_cohorte: (cohorte?.nombre_publico as string | undefined) ?? course.name,
      fecha_inicio: (cohorte?.fecha_inicio as string | null) ?? course.start_date,
      meet_url: (cohorte?.meet_url as string | null) ?? null,
      enrolled_at: row.enrolled_at,
    });
  }

  // Orden: enrollment más reciente primero
  results.sort((a, b) => {
    const da = a.enrolled_at ? new Date(a.enrolled_at).getTime() : 0;
    const db = b.enrolled_at ? new Date(b.enrolled_at).getTime() : 0;
    return db - da;
  });

  return results;
}

/**
 * Enrollment activo principal del alumno (el más reciente).
 * Útil para decidir a qué `/[producto]` redirigir post-login.
 */
export async function getEnrollmentPrincipal(
  userId: string
): Promise<AlumnoEnrollmentActivo | null> {
  const all = await getEnrollmentsAlumno(userId);
  return all[0] ?? null;
}

/**
 * Verifica si un alumno está enrollado en un producto+cohorte específicos.
 * Usado por los layouts/pages para gate-keeping `/[producto]` y `/[producto]/c/[slug]`.
 */
export async function isEnrolledIn(
  userId: string,
  producto: ProductoId,
  cohorte_slug?: string
): Promise<boolean> {
  const all = await getEnrollmentsAlumno(userId);
  return all.some(
    (e) => e.producto === producto && (cohorte_slug ? e.cohorte_slug === cohorte_slug : true)
  );
}

/**
 * Devuelve el enrollment del alumno para un producto específico (si tiene).
 */
export async function getEnrollmentDelProducto(
  userId: string,
  producto: ProductoId
): Promise<AlumnoEnrollmentActivo | null> {
  const all = await getEnrollmentsAlumno(userId);
  return all.find((e) => e.producto === producto) ?? null;
}
