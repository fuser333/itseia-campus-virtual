/**
 * Helpers para cohortes del docente · Campus v2 (Opción B · FASE 3).
 *
 * Resuelve los datos completos de las cohortes asignadas a un docente:
 *  · Metadata pública (nombre, fecha inicio, meet)
 *  · Stats (alumnos enrollados, sesiones programadas/completadas)
 *
 * Capa de compatibilidad:
 *  · `cursos-pro` → usa `cursos_pro_courses` + `cursos_pro_enrollments` (legacy).
 *  · resto → usa `cohorte_metadata` + `cohorte_sesiones` + `enrollments`.
 *
 * Server-only. Usa supabaseAdmin para evitar problemas de RLS (mismo patrón
 * que `app/docente/page.tsx` legacy).
 */

import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { ProductoId } from '@/lib/productos/types';
import {
  getMyAssignments,
  type DocenteCohorteAssignment,
} from '@/lib/docente/assignments';

export interface CohorteDocente {
  /** assignment row id (no la cohorte) */
  assignment_id: string;
  producto: ProductoId;
  cohorte_slug: string;
  /** Nombre público amigable. Si no hay metadata, devuelve el slug. */
  nombre_publico: string;
  rol_en_cohorte: 'titular' | 'asistente';
  fecha_inicio: string | null;
  fecha_fin: string | null;
  meet_url: string | null;
  estado: string;
  cliente_referencia: string | null;
}

export interface CohorteStats {
  alumnos_total: number;
  sesiones_total: number;
  sesiones_completadas: number;
  sesiones_programadas: number;
  proxima_sesion?: {
    numero: number;
    titulo: string;
    fecha_programada: string | null;
  };
}

export type SesionStatus = 'scheduled' | 'live' | 'done' | 'cancelled';

export interface SesionCohorte {
  id: string;
  numero: number;
  titulo: string;
  fecha_programada: string | null;
  duracion_minutos: number;
  meet_url: string | null;
  recording_url: string | null;
  status: SesionStatus;
  contenido_path: string | null;
}

const PRODUCTOS_VALIDOS: readonly ProductoId[] = [
  'preuni',
  'cursos-pro',
  'bootcamp',
  'mdt',
  'b2b',
  'certificaciones',
  'carreras',
  'demo',
];

function isProductoId(v: string): v is ProductoId {
  return (PRODUCTOS_VALIDOS as readonly string[]).includes(v);
}

/**
 * Lista las cohortes asignadas al docente (con metadata mergeada).
 * Hace 1 query a assignments + 1 query a cohorte_metadata + 1 query (si aplica)
 * a cursos_pro_courses como fallback de nombres.
 */
export async function getCohortesAsignadas(
  userId: string
): Promise<CohorteDocente[]> {
  const assignments = await getMyAssignments(userId);
  if (assignments.length === 0) return [];

  // Cargar metadata de TODAS las cohortes (Campus v2)
  const slugs = assignments.map((a) => a.cohorte_slug);
  const productos = Array.from(new Set(assignments.map((a) => a.producto)));

  const { data: metaRows } = await supabaseAdmin
    .from('cohorte_metadata')
    .select(
      'producto, cohorte_slug, nombre_publico, fecha_inicio, fecha_fin, meet_url, estado, cliente_referencia'
    )
    .in('producto', productos)
    .in('cohorte_slug', slugs);

  const metaMap = new Map<
    string,
    {
      nombre_publico: string;
      fecha_inicio: string | null;
      fecha_fin: string | null;
      meet_url: string | null;
      estado: string;
      cliente_referencia: string | null;
    }
  >();
  for (const row of (metaRows ?? []) as Array<Record<string, unknown>>) {
    const key = `${row.producto as string}::${row.cohorte_slug as string}`;
    metaMap.set(key, {
      nombre_publico: (row.nombre_publico as string) ?? '',
      fecha_inicio: (row.fecha_inicio as string | null) ?? null,
      fecha_fin: (row.fecha_fin as string | null) ?? null,
      meet_url: (row.meet_url as string | null) ?? null,
      estado: (row.estado as string) ?? 'planificada',
      cliente_referencia: (row.cliente_referencia as string | null) ?? null,
    });
  }

  // Fallback legacy: cursos_pro_courses (busca por slug)
  const cursosProSlugs = assignments
    .filter((a) => a.producto === 'cursos-pro')
    .map((a) => a.cohorte_slug);
  const cursosProMap = new Map<
    string,
    { nombre: string; fecha_inicio: string | null; fecha_fin: string | null }
  >();

  if (cursosProSlugs.length > 0) {
    const { data: courseRows } = await supabaseAdmin
      .from('cursos_pro_courses')
      .select('slug, name, start_date, end_date, is_active')
      .in('slug', cursosProSlugs);

    for (const row of (courseRows ?? []) as Array<Record<string, unknown>>) {
      cursosProMap.set(row.slug as string, {
        nombre: (row.name as string) ?? '',
        fecha_inicio: (row.start_date as string | null) ?? null,
        fecha_fin: (row.end_date as string | null) ?? null,
      });
    }
  }

  return assignments
    .map((a: DocenteCohorteAssignment): CohorteDocente | null => {
      if (!isProductoId(a.producto)) return null;
      const productoId = a.producto;
      const key = `${productoId}::${a.cohorte_slug}`;
      const meta = metaMap.get(key);

      if (meta) {
        return {
          assignment_id: a.id,
          producto: productoId,
          cohorte_slug: a.cohorte_slug,
          nombre_publico: meta.nombre_publico || a.cohorte_slug,
          rol_en_cohorte: a.rol_en_cohorte,
          fecha_inicio: meta.fecha_inicio,
          fecha_fin: meta.fecha_fin,
          meet_url: meta.meet_url,
          estado: meta.estado,
          cliente_referencia: meta.cliente_referencia,
        };
      }

      // Fallback legacy cursos-pro
      if (productoId === 'cursos-pro') {
        const legacy = cursosProMap.get(a.cohorte_slug);
        if (legacy) {
          return {
            assignment_id: a.id,
            producto: productoId,
            cohorte_slug: a.cohorte_slug,
            nombre_publico: legacy.nombre || a.cohorte_slug,
            rol_en_cohorte: a.rol_en_cohorte,
            fecha_inicio: legacy.fecha_inicio,
            fecha_fin: legacy.fecha_fin,
            meet_url: null,
            estado: 'activa',
            cliente_referencia: null,
          };
        }
      }

      // Sin metadata: devolver el slug como nombre.
      return {
        assignment_id: a.id,
        producto: productoId,
        cohorte_slug: a.cohorte_slug,
        nombre_publico: a.cohorte_slug,
        rol_en_cohorte: a.rol_en_cohorte,
        fecha_inicio: null,
        fecha_fin: null,
        meet_url: null,
        estado: 'planificada',
        cliente_referencia: null,
      };
    })
    .filter((c): c is CohorteDocente => c !== null);
}

/**
 * Devuelve solo las cohortes del docente para UN producto específico.
 * Útil para `/(docente)/[producto]/page.tsx`.
 */
export async function getCohortesAsignadasByProducto(
  userId: string,
  producto: ProductoId
): Promise<CohorteDocente[]> {
  const all = await getCohortesAsignadas(userId);
  return all.filter((c) => c.producto === producto);
}

/**
 * Devuelve una cohorte específica del docente (si tiene assignment activo).
 * null si no está asignado.
 */
export async function getCohorteAsignada(
  userId: string,
  producto: ProductoId,
  cohorteSlug: string
): Promise<CohorteDocente | null> {
  const all = await getCohortesAsignadas(userId);
  return (
    all.find(
      (c) => c.producto === producto && c.cohorte_slug === cohorteSlug
    ) ?? null
  );
}

/**
 * Verifica si el docente tiene assignment activo en la cohorte.
 * Admins/super_admin/coordinacion saltan este check (lo hace el caller).
 */
export async function hasAssignment(
  userId: string,
  producto: ProductoId,
  cohorteSlug: string
): Promise<boolean> {
  const cohorte = await getCohorteAsignada(userId, producto, cohorteSlug);
  return cohorte !== null;
}

/**
 * Devuelve agregados rápidos por cohorte para mostrar en cards.
 * Hace queries separadas (puede ser lento si hay 50+ cohortes; en FASE 7
 * se optimiza con una vista materializada).
 */
export async function getCohorteStats(
  producto: ProductoId,
  cohorteSlug: string
): Promise<CohorteStats> {
  const stats: CohorteStats = {
    alumnos_total: 0,
    sesiones_total: 0,
    sesiones_completadas: 0,
    sesiones_programadas: 0,
  };

  // Rama legacy cursos-pro
  if (producto === 'cursos-pro') {
    const { data: course } = await supabaseAdmin
      .from('cursos_pro_courses')
      .select('id')
      .eq('slug', cohorteSlug)
      .maybeSingle();

    if (!course) return stats;
    const courseId = course.id as string;

    const { count: alumnosCount } = await supabaseAdmin
      .from('cursos_pro_enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId)
      .eq('status', 'active');
    stats.alumnos_total = alumnosCount ?? 0;

    const { data: sesiones } = await supabaseAdmin
      .from('cursos_pro_sessions')
      .select('num, title, scheduled_at, status')
      .eq('course_id', courseId)
      .order('num', { ascending: true });

    const list = (sesiones ?? []) as Array<{
      num: number;
      title: string;
      scheduled_at: string | null;
      status: string;
    }>;
    stats.sesiones_total = list.length;
    stats.sesiones_completadas = list.filter((s) => s.status === 'done').length;
    stats.sesiones_programadas = list.filter(
      (s) => s.status === 'scheduled' || s.status === 'live'
    ).length;

    const next = list.find((s) => s.status !== 'done');
    if (next) {
      stats.proxima_sesion = {
        numero: next.num,
        titulo: next.title,
        fecha_programada: next.scheduled_at,
      };
    }
    return stats;
  }

  // Rama Campus v2
  const { data: cohorte } = await supabaseAdmin
    .from('cohorte_metadata')
    .select('id')
    .eq('producto', producto)
    .eq('cohorte_slug', cohorteSlug)
    .maybeSingle();

  if (!cohorte) return stats;
  const cohorteId = cohorte.id as string;

  // Alumnos: la columna `enrollments.cohorte_id` la agrega FASE 6.
  // Hasta entonces hacemos query best-effort y fallback a 0 si la columna
  // no existe (la query devuelve error → ignoramos y mostramos 0 → UI OK).
  const { count: alumnosCount, error: alumnosErr } = await supabaseAdmin
    .from('enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('cohorte_id', cohorteId)
    .eq('status', 'active');
  stats.alumnos_total = alumnosErr ? 0 : alumnosCount ?? 0;

  const { data: sesiones } = await supabaseAdmin
    .from('cohorte_sesiones')
    .select('numero, titulo, fecha_programada, status')
    .eq('cohorte_id', cohorteId)
    .order('numero', { ascending: true });

  const list = (sesiones ?? []) as Array<{
    numero: number;
    titulo: string;
    fecha_programada: string | null;
    status: string;
  }>;
  stats.sesiones_total = list.length;
  stats.sesiones_completadas = list.filter((s) => s.status === 'done').length;
  stats.sesiones_programadas = list.filter(
    (s) => s.status === 'scheduled' || s.status === 'live'
  ).length;

  const next = list.find((s) => s.status !== 'done');
  if (next) {
    stats.proxima_sesion = {
      numero: next.numero,
      titulo: next.titulo,
      fecha_programada: next.fecha_programada,
    };
  }
  return stats;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sesiones de cohorte (vista docente)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lista las sesiones de una cohorte para vista docente.
 * Rama legacy cursos-pro → `cursos_pro_sessions`; resto → `cohorte_sesiones`.
 *
 * NOTA: este helper se duplica con `lib/alumno/sesiones.ts` (FASE 2). Cuando
 * FASE 2 mergee, podemos consolidar en un único módulo `lib/sesiones/`.
 */
export async function getSesionesCohorte(
  producto: ProductoId,
  cohorte_slug: string
): Promise<SesionCohorte[]> {
  if (producto === 'cursos-pro') {
    const { data: course } = await supabaseAdmin
      .from('cursos_pro_courses')
      .select('id')
      .eq('slug', cohorte_slug)
      .maybeSingle();

    if (!course) return [];
    const courseId = course.id as string;

    const { data: rows } = await supabaseAdmin
      .from('cursos_pro_sessions')
      .select(
        'id, num, title, scheduled_at, duration_minutes, meet_url, recording_url, status'
      )
      .eq('course_id', courseId)
      .order('num', { ascending: true });

    return ((rows ?? []) as Array<{
      id: string;
      num: number;
      title: string;
      scheduled_at: string | null;
      duration_minutes: number;
      meet_url: string | null;
      recording_url: string | null;
      status: SesionStatus;
    }>).map((r) => ({
      id: r.id,
      numero: r.num,
      titulo: r.title,
      fecha_programada: r.scheduled_at,
      duracion_minutos: r.duration_minutes,
      meet_url: r.meet_url,
      recording_url: r.recording_url,
      status: r.status,
      contenido_path: null,
    }));
  }

  // Rama Campus v2 (cohorte_sesiones)
  const { data: cohorte } = await supabaseAdmin
    .from('cohorte_metadata')
    .select('id')
    .eq('producto', producto)
    .eq('cohorte_slug', cohorte_slug)
    .maybeSingle();

  if (!cohorte) return [];

  const { data: rows } = await supabaseAdmin
    .from('cohorte_sesiones')
    .select(
      'id, numero, titulo, fecha_programada, duracion_minutos, meet_url, recording_url, status, contenido_path'
    )
    .eq('cohorte_id', cohorte.id as string)
    .order('numero', { ascending: true });

  return ((rows ?? []) as Array<{
    id: string;
    numero: number;
    titulo: string;
    fecha_programada: string | null;
    duracion_minutos: number;
    meet_url: string | null;
    recording_url: string | null;
    status: SesionStatus;
    contenido_path: string | null;
  }>).map((r) => ({
    id: r.id,
    numero: r.numero,
    titulo: r.titulo,
    fecha_programada: r.fecha_programada,
    duracion_minutos: r.duracion_minutos,
    meet_url: r.meet_url,
    recording_url: r.recording_url,
    status: r.status,
    contenido_path: r.contenido_path,
  }));
}

/**
 * Devuelve UNA sesión específica por número (vista docente).
 */
export async function getSesionCohorte(
  producto: ProductoId,
  cohorte_slug: string,
  numero: number
): Promise<SesionCohorte | null> {
  const sesiones = await getSesionesCohorte(producto, cohorte_slug);
  return sesiones.find((s) => s.numero === numero) ?? null;
}

