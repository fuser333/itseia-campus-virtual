'use client';

/**
 * Tab "Ejercicios" · Alumno · Campus v2 (Opción B).
 *
 * Stub FASE 2: muestra placeholder.
 */

import { ListChecks } from 'lucide-react';
import type { SesionDataMinima } from '../SessionTabs';

interface Props {
  sesionData: SesionDataMinima;
}

export default function EjerciciosTab({ sesionData: _sesionData }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-70">
        <ListChecks className="h-4 w-4" />
        Ejercicios prácticos
      </div>

      <div
        className="rounded-xl border p-8 text-center"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <ListChecks className="mx-auto h-10 w-10 opacity-30" />
        <div className="mt-3 font-heading text-lg font-semibold">
          Ejercicios próximamente
        </div>
        <p className="mx-auto mt-1 max-w-md text-sm opacity-70">
          Las tareas prácticas y su submission se habilitan después de la sesión.
        </p>
      </div>
    </div>
  );
}
