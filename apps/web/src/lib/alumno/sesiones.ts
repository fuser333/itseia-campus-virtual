/**
 * Helpers para sesiones de cohorte · Campus v2 (Opción B).
 *
 * Capa de compatibilidad:
 *  · Para `cursos-pro` → lee de `cursos_pro_sessions` (legacy que ya funciona).
 *  · Para todos los demás → lee de `cohorte_sesiones` (tabla nueva).
 *
 * Server-only.
 */

import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { ProductoId } from '@/lib/productos/types';

export type SesionStatus = 'scheduled' | 'live' | 'done' | 'cancelled';

export interface SesionAlumno {
  id: string;
  numero: number;
  titulo: string;
  fecha_programada: string | null;
  duracion_minutos: number;
  meet_url: string | null;
  recording_url: string | null;
  status: SesionStatus;
  /** Path al contenido en disco (`content/cohortes/.../sesiones/sNN/`). */
  contenido_path: string | null;
}

export interface CohorteAlumno {
  id: string;
  producto: ProductoId;
  cohorte_slug: string;
  nombre_publico: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  meet_url: string | null;
  estado: string;
}

/**
 * Devuelve el metadata de una cohorte específica.
 * Para productos legacy (`cursos-pro`) intenta primero `cohorte_metadata`,
 * y si no existe usa la fuente legacy `cursos_pro_courses`.
 */
export async function getCohorte(
  producto: ProductoId,
  cohorte_slug: string
): Promise<CohorteAlumno | null> {
  // 1. Intentar cohorte_metadata (fuente Campus v2)
  const { data: meta } = await supabaseAdmin
    .from('cohorte_metadata')
    .select('id, producto, cohorte_slug, nombre_publico, fecha_inicio, fecha_fin, meet_url, estado')
    .eq('producto', producto)
    .eq('cohorte_slug', cohorte_slug)
    .maybeSingle();

  if (meta) {
    return {
      id: meta.id as string,
      producto: meta.producto as ProductoId,
      cohorte_slug: meta.cohorte_slug as string,
      nombre_publico: meta.nombre_publico as string,
      fecha_inicio: meta.fecha_inicio as string,
      fecha_fin: (meta.fecha_fin as string | null) ?? null,
      meet_url: (meta.meet_url as string | null) ?? null,
      estado: (meta.estado as string) ?? 'planificada',
    };
  }

  // 2. Fallback legacy: cursos_pro_courses (donde slug es el cohorte_slug)
  if (producto === 'cursos-pro') {
    const { data: course } = await supabaseAdmin
      .from('cursos_pro_courses')
      .select('id, slug, name, start_date, end_date, is_active')
      .eq('slug', cohorte_slug)
      .maybeSingle();

    if (course) {
      return {
        id: course.id as string,
        producto: 'cursos-pro',
        cohorte_slug: course.slug as string,
        nombre_publico: course.name as string,
        fecha_inicio: course.start_date as string,
        fecha_fin: (course.end_date as string | null) ?? null,
        meet_url: null,
        estado: (course.is_active as boolean) ? 'activa' : 'finalizada',
      };
    }
  }

  return null;
}

/**
 * Lista las sesiones de una cohorte ordenadas por número.
 * Usa la fuente apropiada según el producto.
 */
export async function getSesionesCohorte(
  producto: ProductoId,
  cohorte_slug: string
): Promise<SesionAlumno[]> {
  // Para cursos-pro mantenemos compatibilidad con cursos_pro_sessions
  if (producto === 'cursos-pro') {
    const { data: course } = await supabaseAdmin
      .from('cursos_pro_courses')
      .select('id')
      .eq('slug', cohorte_slug)
      .maybeSingle();

    if (!course) return [];

    const { data: rows } = await supabaseAdmin
      .from('cursos_pro_sessions')
      .select(
        'id, num, title, scheduled_at, duration_minutes, meet_url, recording_url, status'
      )
      .eq('course_id', course.id as string)
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

  // Para todos los demás productos: cohorte_sesiones (tabla nueva)
  const cohorte = await getCohorte(producto, cohorte_slug);
  if (!cohorte) return [];

  const { data: rows } = await supabaseAdmin
    .from('cohorte_sesiones')
    .select(
      'id, numero, titulo, fecha_programada, duracion_minutos, meet_url, recording_url, status, contenido_path'
    )
    .eq('cohorte_id', cohorte.id)
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
 * Devuelve una sesión específica por número.
 */
export async function getSesion(
  producto: ProductoId,
  cohorte_slug: string,
  numero: number
): Promise<SesionAlumno | null> {
  const sesiones = await getSesionesCohorte(producto, cohorte_slug);
  return sesiones.find((s) => s.numero === numero) ?? null;
}
