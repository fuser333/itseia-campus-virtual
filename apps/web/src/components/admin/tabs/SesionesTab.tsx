'use client';

/**
 * SesionesTab · Vista admin de las sesiones de la cohorte (FASE 4 stub).
 *
 * Implementación real (FASE 5+):
 *  · Tabla de sesiones (número, título, fecha programada, status, docente)
 *  · CRUD: crear/editar/cancelar sesión
 *  · Reasignar docente
 *  · Cambiar Meet URL (legacy o crear Meet nuevo)
 *  · Reordenar sesiones (drag)
 */

import StubCard from './_StubCard';
import type { AdminTabProps } from './types';

export default function SesionesTab({ producto, cohorteSlug }: AdminTabProps) {
  return (
    <StubCard
      title="Sesiones programadas"
      description={`Aquí verás las sesiones planificadas para ${producto}/${cohorteSlug}: número, título, fecha, estado, docente asignado. Permite crear, editar, cancelar y reordenar.`}
    />
  );
}
