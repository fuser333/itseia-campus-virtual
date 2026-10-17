'use client';

/**
 * PagosTab · Vista admin de pagos de la cohorte (FASE 4 stub).
 *
 * Implementación real (FASE 5+):
 *  · Tabla de pagos (alumno, monto, método, fecha, estado)
 *  · Filtros: confirmados, pendientes, rechazados
 *  · Acción "Confirmar pago" (cambia status a confirmed + activa enrollment)
 *  · Acción "Reverso" (registra refund)
 *  · KPIs: ingresos totales, pendiente, ticket promedio
 */

import StubCard from './_StubCard';
import type { AdminTabProps } from './types';

export default function PagosTab({ producto, cohorteSlug }: AdminTabProps) {
  return (
    <StubCard
      title="Pagos de la cohorte"
      description={`Aquí verás los pagos asociados a alumnos de ${producto}/${cohorteSlug}: ingresos confirmados, pagos pendientes de validación, reversos, KPIs financieros. Acciones de confirmación manual.`}
    />
  );
}
