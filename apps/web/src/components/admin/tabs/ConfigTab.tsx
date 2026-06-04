'use client';

/**
 * ConfigTab · Configuración de la cohorte (FASE 4 stub).
 *
 * Implementación real (FASE 5+):
 *  · Edit nombre_publico, fecha_inicio/fin, meet_url, cliente_referencia
 *  · Cambiar estado (planificada → activa → finalizada → cancelada)
 *  · Asignar/desasignar docentes (docente_cohorte_assignments)
 *  · Branding override (color de portada, banner)
 *  · Acciones destructivas: archivar, duplicar, eliminar
 */

import StubCard from './_StubCard';
import type { AdminTabProps } from './types';

export default function ConfigTab({ producto, cohorteSlug }: AdminTabProps) {
  return (
    <StubCard
      title="Configuración de la cohorte"
      description={`Edita los metadatos de ${producto}/${cohorteSlug}: nombre, fechas, URL del Meet, cliente referencia, estado. Asigna o quita docentes. Acciones de archivar/duplicar/eliminar cohorte.`}
    />
  );
}
