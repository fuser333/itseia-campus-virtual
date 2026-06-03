'use client';

/**
 * RecordButton · Botón GRABAR sticky reutilizable · Campus v2 (FASE 3).
 *
 * Función:
 *   1. Llama a /api/docente/grabaciones/iniciar (stub FASE 3).
 *   2. Marca la sesión como "live" y abre el link de Meet en nueva pestaña.
 *   3. Muestra estado en vivo (rojo pulsante) hasta que el docente "termina".
 *
 * El cron Drive→YouTube (existente) asocia automáticamente la grabación
 * resultante con la sesión gracias al timestamp + cohorte_slug enviados.
 *
 * FASE 3: el endpoint es un stub que valida payload + responde 200/501.
 *   - 200 OK · sesión marcada en vivo
 *   - 501 · provider de grabación aún no configurado para el producto
 *
 * Se monta como sticky en la parte superior de la página de cohorte y de
 * sesión docente. Visible solo si `producto.docente.boton_grabar = true`
 * en el YAML.
 */

import { useState, useTransition } from 'react';
import { Radio, PlayCircle, AlertCircle, ExternalLink, Square } from 'lucide-react';

interface Props {
  producto: string;
  cohorteSlug: string;
  /** Número de sesión actual (la próxima programada por default). */
  sesionNumero: number;
  /** URL de Google Meet para abrir tras iniciar grabación. */
  meetUrl?: string;
  /** Opcional: si ya está grabando (futuras visitas a la página). */
  initialLive?: boolean;
}

type EstadoBoton = 'idle' | 'starting' | 'live' | 'stopping' | 'error';

export default function RecordButton({
  producto,
  cohorteSlug,
  sesionNumero,
  meetUrl,
  initialLive = false,
}: Props) {
  const [estado, setEstado] = useState<EstadoBoton>(initialLive ? 'live' : 'idle');
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleStart() {
    setEstado('starting');
    setError(null);
    try {
      const res = await fetch('/api/docente/grabaciones/iniciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto,
          cohorte_slug: cohorteSlug,
          sesion_numero: sesionNumero,
          started_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data?.message as string) ?? `HTTP ${res.status} al iniciar grabación`
        );
      }

      setEstado('live');

      // Abrir Meet en nueva pestaña (si está disponible).
      if (meetUrl) {
        startTransition(() => {
          window.open(meetUrl, '_blank', 'noopener,noreferrer');
        });
      }
    } catch (err) {
      setEstado('error');
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }

  async function handleStop() {
    setEstado('stopping');
    setError(null);
    try {
      const res = await fetch('/api/docente/grabaciones/detener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto,
          cohorte_slug: cohorteSlug,
          sesion_numero: sesionNumero,
          stopped_at: new Date().toISOString(),
        }),
      });

      // El endpoint stub puede devolver 501; lo tratamos como "OK best-effort"
      // para FASE 3 (la lógica real vive en FASE 5+).
      if (!res.ok && res.status !== 501) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data?.message as string) ?? `HTTP ${res.status} al detener grabación`
        );
      }
      setEstado('idle');
    } catch (err) {
      setEstado('error');
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }

  if (estado === 'live') {
    return (
      <div
        className="flex items-center justify-between gap-4 rounded-2xl border-2 p-4 shadow-lg"
        style={{
          backgroundColor: 'rgba(240,132,109,0.10)',
          borderColor: 'var(--itseia-coral)',
        }}
      >
        <div className="flex items-center gap-3">
          <Radio
            className="h-5 w-5 animate-pulse"
            style={{ color: 'var(--itseia-coral)' }}
          />
          <div>
            <div className="text-sm font-bold uppercase tracking-wider"
                 style={{ color: 'var(--itseia-coral)' }}>
              GRABANDO EN VIVO
            </div>
            <div className="text-xs opacity-70">
              Sesión #{sesionNumero} · La grabación se asociará automáticamente.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {meetUrl && (
            <a
              href={meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-white/5"
              style={{
                borderColor: 'var(--itseia-coral)',
                color: 'var(--itseia-coral)',
              }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Reabrir Meet
            </a>
          )}
          <button
            onClick={handleStop}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition hover:opacity-90"
            style={{
              backgroundColor: 'var(--itseia-navy-light)',
              color: 'var(--itseia-text)',
            }}
          >
            <Square className="h-3.5 w-3.5" />
            Detener
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleStart}
        disabled={estado === 'starting'}
        className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 px-6 py-4 text-base font-bold uppercase tracking-wider shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          backgroundColor: 'var(--itseia-coral)',
          color: 'var(--itseia-navy-dark)',
          borderColor: 'var(--itseia-coral)',
        }}
      >
        {estado === 'starting' ? (
          <>
            <Radio className="h-5 w-5 animate-pulse" />
            Iniciando grabación…
          </>
        ) : (
          <>
            <PlayCircle className="h-5 w-5" />
            INICIAR CLASE CON GRABACIÓN
          </>
        )}
      </button>

      {error && (
        <div
          className="flex items-start gap-2 rounded-lg border p-3 text-xs"
          style={{
            borderColor: 'var(--itseia-coral)',
            backgroundColor: 'rgba(240,132,109,0.08)',
            color: 'var(--itseia-coral)',
          }}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <div>
            <div className="font-semibold">No se pudo iniciar la grabación</div>
            <div className="opacity-80">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
}
