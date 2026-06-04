'use client';

/**
 * AsistenciaTab · Vista admin de asistencia (FASE 4 stub).
 *
 * Implementación real (FASE 5+):
 *  · Matriz alumno × sesión (presente/ausente/justificado)
 *  · Captura desde Meet attendance API
 *  · Edición manual por sesión
 *  · KPIs: % asistencia promedio, alumnos en riesgo (<70%)
 *  · Export por alumno (para certificados)
 */

import StubCard from './_StubCard';
import type { AdminTabProps } from './types';

export default function AsistenciaTab({
  producto,
  cohorteSlug,
}: AdminTabProps) {
  return (
    <StubCard
      title="Asistencia"
      description={`Matriz de asistencia para ${producto}/${cohorteSlug}: alumno × sesión, captura desde Meet API, edición manual, alertas de alumnos en riesgo (<70% asistencia).`}
    />
  );
}
