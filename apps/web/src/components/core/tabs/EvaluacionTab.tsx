'use client';

/**
 * Tab "Evaluación" · Alumno · Campus v2 (Opción B).
 *
 * Stub FASE 2: muestra placeholder. En FASE 4 cargará el quiz desde
 * `contenido_path/evaluacion.json` y permitirá marcar la sesión como completada.
 */

import { ClipboardCheck } from 'lucide-react';
import type { SesionDataMinima } from '../SessionTabs';

interface Props {
  sesionData: SesionDataMinima;
}

export default function EvaluacionTab({ sesionData: _sesionData }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-70">
        <ClipboardCheck className="h-4 w-4" />
        Evaluación de la sesión
      </div>

      <div
        className="rounded-xl border p-8 text-center"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <ClipboardCheck className="mx-auto h-10 w-10 opacity-30" />
        <div className="mt-3 font-heading text-lg font-semibold">
          Quiz próximamente
        </div>
        <p className="mx-auto mt-1 max-w-md text-sm opacity-70">
          Cuando la sesión termine, podrás responder el quiz y marcarla como
          completada para sumar a tu progreso.
        </p>
      </div>
    </div>
  );
}
