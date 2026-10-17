'use client';

/**
 * MaterialesTab · Vista admin de materiales (FASE 4 stub).
 *
 * Implementación real (FASE 5+):
 *  · Lista de materiales subidos por sesión (PDF, slides, datasets)
 *  · Storage path en Supabase Storage
 *  · Acciones: reemplazar, eliminar, ocultar a alumnos
 *  · Bulk upload desde carpeta
 */

import StubCard from './_StubCard';
import type { AdminTabProps } from './types';

export default function MaterialesTab({
  producto,
  cohorteSlug,
}: AdminTabProps) {
  return (
    <StubCard
      title="Materiales de la cohorte"
      description={`Aquí verás todos los materiales subidos para ${producto}/${cohorteSlug}: PDF, slides, datasets. Permite reemplazar, ocultar, eliminar y subir en bulk.`}
    />
  );
}
