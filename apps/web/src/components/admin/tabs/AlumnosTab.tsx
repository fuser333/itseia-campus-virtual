'use client';

/**
 * AlumnosTab · Vista admin de la cohorte (FASE 4 stub).
 *
 * Implementación real (FASE 5+):
 *  · Tabla de alumnos enrollados (full_name, email, fecha_enrollment, status)
 *  · Acción "Inscribir alumno" (modal con búsqueda por email)
 *  · Acción "Dar de baja" (status = inactive)
 *  · Filtros: por status, por fecha, por pago confirmado/pendiente
 *  · Export CSV
 */

import StubCard from './_StubCard';
import type { AdminTabProps } from './types';

export default function AlumnosTab({ producto, cohorteSlug }: AdminTabProps) {
  return (
    <StubCard
      title="Listado de alumnos"
      description={`Aquí verás la tabla de alumnos enrollados en ${producto}/${cohorteSlug}: nombre, email, fecha de matrícula, estado, último pago. Incluye acciones de inscribir, dar de baja, exportar CSV.`}
    />
  );
}
