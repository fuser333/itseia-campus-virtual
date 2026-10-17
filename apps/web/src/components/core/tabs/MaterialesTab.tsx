'use client';

/**
 * Tab "Materiales" · Alumno · Campus v2 (Opción B).
 *
 * Stub FASE 2: muestra placeholder. En FASE 4 cargará la lista desde
 * `content/cohortes/<producto>/<cohorte>/sesiones/sNN/materiales/`.
 */

import { Download } from 'lucide-react';
import type { SesionDataMinima } from '../SessionTabs';

interface Props {
  sesionData: SesionDataMinima;
}

export default function MaterialesTab({ sesionData: _sesionData }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-70">
        <Download className="h-4 w-4" />
        Materiales descargables
      </div>

      <div
        className="rounded-xl border p-8 text-center"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <Download className="mx-auto h-10 w-10 opacity-30" />
        <div className="mt-3 font-heading text-lg font-semibold">
          Materiales próximamente
        </div>
        <p className="mx-auto mt-1 max-w-md text-sm opacity-70">
          PDFs, slides, lecturas y enlaces de esta sesión se publican aquí en
          cuanto el docente los suba.
        </p>
      </div>
    </div>
  );
}
