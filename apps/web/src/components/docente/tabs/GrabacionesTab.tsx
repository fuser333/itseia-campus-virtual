'use client';

/**
 * Tab "Grabaciones" · Docente · Campus v2 (FASE 3 · stub).
 *
 * Histórico de grabaciones de la sesión + estado actual.
 * En FASE 5: integración con `recordings` (tabla legacy) + listado por trigger
 *           (manual / Drive→YouTube / Restream / Daily.co).
 */

import { Video, ExternalLink, AlertCircle } from 'lucide-react';
import StubCard from './_StubCard';
import type { TabDocenteProps } from './types';

export default function GrabacionesTab({ sesionData }: TabDocenteProps) {
  const hasRecording = Boolean(sesionData.recording_url);

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl border p-4"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
          <Video className="h-3 w-3" />
          Grabación de esta sesión
        </div>

        {hasRecording ? (
          <div className="mt-3">
            <a
              href={sesionData.recording_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-white/5"
              style={{
                borderColor: 'var(--itseia-gold)',
                color: 'var(--itseia-gold)',
              }}
            >
              <ExternalLink className="h-4 w-4" />
              Abrir grabación
            </a>
          </div>
        ) : (
          <div
            className="mt-3 flex items-start gap-2 rounded-lg border p-3 text-xs"
            style={{
              borderColor: 'rgba(255,255,255,0.10)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              color: 'rgba(255,255,255,0.65)',
            }}
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <div>
              Sin grabación asociada. Inicia la clase con el botón GRABAR
              y el cron Drive→YouTube la asociará automáticamente cuando
              termines.
            </div>
          </div>
        )}
      </div>

      <StubCard
        title="Histórico de grabaciones"
        description="Listado de todas las grabaciones de la sesión (re-grabaciones, copias respaldadas), provider, duración, fecha. Integra con recordings + cron Drive→YouTube."
      />
    </div>
  );
}
