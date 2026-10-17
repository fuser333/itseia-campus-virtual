'use client';

/**
 * Tab "Video + Resumen" · Alumno · Campus v2 (Opción B).
 *
 * Stub FASE 2: muestra el embed del recording_url si existe, sino un placeholder.
 * El resumen ejecutivo se cargará desde `contenido_path` en FASE 4.
 */

import { Play, FileText } from 'lucide-react';
import type { SesionDataMinima } from '../SessionTabs';

interface Props {
  sesionData: SesionDataMinima;
}

export default function VideoResumenTab({ sesionData }: Props) {
  const { recording_url, titulo } = sesionData;

  return (
    <div className="space-y-6">
      {/* ── Video / Recording ─────────────────────────────────────── */}
      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-70">
          <Play className="h-4 w-4" />
          Grabación de la sesión
        </div>
        {recording_url ? (
          <div className="aspect-video w-full overflow-hidden rounded-xl border bg-black/40">
            <iframe
              src={recording_url}
              title={`Grabación · ${titulo}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : (
          <Placeholder
            title="Sin grabación aún"
            description="La grabación se publicará cuando termine la sesión. Si la clase fue hoy, vuelve mañana."
          />
        )}
      </section>

      {/* ── Resumen ejecutivo ─────────────────────────────────────── */}
      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-70">
          <FileText className="h-4 w-4" />
          Resumen ejecutivo
        </div>
        <Placeholder
          title="Resumen próximamente"
          description="El docente publicará un resumen ejecutivo de los temas más importantes de esta sesión."
        />
      </section>
    </div>
  );
}

function Placeholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="rounded-xl border p-6"
      style={{
        backgroundColor: 'var(--itseia-navy)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      <div className="font-semibold">{title}</div>
      <p className="mt-1 text-sm opacity-70">{description}</p>
    </div>
  );
}
