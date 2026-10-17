/**
 * Tipos compartidos para las pestañas admin · Campus v2 (FASE 4).
 *
 * Cada tab recibe el mismo conjunto de identificadores para que pueda hacer
 * sus queries (cuando se implemente en FASE 5+).
 */

import type { ProductoId } from '@/lib/productos/types';

export interface AdminTabProps {
  producto: ProductoId;
  cohorteSlug: string;
  /** UUID de la cohorte (null si la cohorte no tiene metadata Campus v2). */
  cohorteId: string | null;
}
