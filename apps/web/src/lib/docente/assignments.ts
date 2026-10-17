/**
 * Helpers para `docente_cohorte_assignments` · Campus v2 (Opción B).
 *
 * - getMyAssignments(userId)            → cohortes del docente actual
 * - getAllAssignments()                 → solo super_admin (no se chequea acá; RLS lo enforza)
 * - getAssignmentsByProducto(uid, prod) → para sidebar árbol docente
 *
 * Server-only (usa createClient SSR). NO importar desde Client Components.
 */

import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type { ProductoId } from '@/lib/productos/types';

export interface DocenteCohorteAssignment {
  id: string;
  docente_id: string;
  producto: string;        // ProductoId stringified; lo casteamos en el caller si hace falta
  cohorte_slug: string;
  rol_en_cohorte: 'titular' | 'asistente';
  fecha_asignacion: string;
  activo: boolean;
  created_at: string;
}

const TABLE = 'docente_cohorte_assignments';
const COLS =
  'id, docente_id, producto, cohorte_slug, rol_en_cohorte, fecha_asignacion, activo, created_at';

/**
 * Cohortes activas del docente logueado (o el userId que pases).
 * RLS asegura que solo se ven las propias filas (salvo admin/coordinacion).
 */
export async function getMyAssignments(
  userId: string
): Promise<DocenteCohorteAssignment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLS)
    .eq('docente_id', userId)
    .eq('activo', true)
    .order('fecha_asignacion', { ascending: false });

  if (error) {
    console.error('[docente/assignments] getMyAssignments error:', error.message);
    return [];
  }
  return (data ?? []) as DocenteCohorteAssignment[];
}

/**
 * TODOS los assignments del sistema. Solo super_admin lo verá (RLS).
 * Útil para vista admin/coordinacion de gestión de docentes.
 */
export async function getAllAssignments(): Promise<DocenteCohorteAssignment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLS)
    .order('fecha_asignacion', { ascending: false });

  if (error) {
    console.error('[docente/assignments] getAllAssignments error:', error.message);
    return [];
  }
  return (data ?? []) as DocenteCohorteAssignment[];
}

/**
 * Assignments del docente para un producto específico.
 * Lo usa el sidebar árbol para listar cohortes bajo cada nodo de producto.
 */
export async function getAssignmentsByProducto(
  userId: string,
  producto: ProductoId
): Promise<DocenteCohorteAssignment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLS)
    .eq('docente_id', userId)
    .eq('producto', producto)
    .eq('activo', true)
    .order('fecha_asignacion', { ascending: false });

  if (error) {
    console.error(
      `[docente/assignments] getAssignmentsByProducto(${producto}) error:`,
      error.message
    );
    return [];
  }
  return (data ?? []) as DocenteCohorteAssignment[];
}

/**
 * Devuelve solo los IDs de producto distintos donde el docente tiene cohorte
 * activa. Útil para renderizar el árbol del sidebar sin queries extra.
 */
export async function getDocenteProductos(userId: string): Promise<string[]> {
  const all = await getMyAssignments(userId);
  return Array.from(new Set(all.map((a) => a.producto)));
}
