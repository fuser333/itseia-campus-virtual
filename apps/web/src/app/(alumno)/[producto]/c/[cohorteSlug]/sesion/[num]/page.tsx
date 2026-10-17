/**
 * Vista de sesión · Alumno · Campus v2 (Opción B).
 *
 * Server Component. Verifica enrollment, carga la sesión y renderiza:
 *  · Header (tema · fecha · duración · estado)
 *  · Botón "Unirse a Google Meet" (si está live)
 *  · `<SessionTabs>` con las 4 pestañas del YAML alumno
 */

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Video, ArrowLeft, Radio } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getProductoSafe } from '@/lib/productos/loader';
import { isEnrolledIn } from '@/lib/alumno/enrollments';
import { getCohorte, getSesion } from '@/lib/alumno/sesiones';
import SessionTabs from '@/components/core/SessionTabs';
import type { ProductoId } from '@/lib/productos/types';

interface PageProps {
  params: Promise<{
    producto: string;
    cohorteSlug: string;
    num: string;
  }>;
}

export default async function SesionAlumnoPage({ params }: PageProps) {
  const { producto: productoParam, cohorteSlug, num: numParam } = await params;
  const numero = parseInt(numParam, 10);
  if (Number.isNaN(numero)) notFound();

  const cfg = getProductoSafe(productoParam);
  if (!cfg) notFound();
  const productoId = cfg.producto.id as ProductoId;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    redirect(
      `/login?redirect=/${productoId}/c/${cohorteSlug}/sesion/${numero}`
    );

  const enrolled = await isEnrolledIn(user.id, productoId, cohorteSlug);
  if (!enrolled) redirect(`/${productoId}`);

  const cohorte = await getCohorte(productoId, cohorteSlug);
  const sesion = await getSesion(productoId, cohorteSlug, numero);
  if (!sesion || !cohorte) notFound();

  const accentVar = `var(--producto-${productoId})`;
  const isLive = sesion.status === 'live';
  const isDone = sesion.status === 'done';

  // Meet URL: preferir el de la sesión, fallback al de la cohorte
  const meetUrl = sesion.meet_url ?? cohorte.meet_url ?? null;

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <Link
        href={`/${productoId}/c/${cohorteSlug}`}
        className="inline-flex items-center gap-1 text-sm opacity-60 hover:opacity-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a sesiones
      </Link>

      {/* ── Header de sesión ───────────────────────────────────── */}
      <header
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
          borderLeft: `4px solid ${accentVar}`,
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-60">
              Sesión #{sesion.numero}
              <StatusBadge status={sesion.status} accentVar={accentVar} />
            </div>
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
              {sesion.titulo}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm opacity-70">
              {sesion.fecha_programada && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(sesion.fecha_programada).toLocaleDateString(
                    'es-EC',
                    {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {sesion.duracion_minutos} min
              </span>
            </div>
          </div>

          {isLive && meetUrl && (
            <a
              href={meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold transition hover:opacity-90"
              style={{
                backgroundColor: 'var(--itseia-coral)',
                color: 'var(--itseia-navy-dark)',
              }}
            >
              <Radio className="h-4 w-4 animate-pulse" />
              Unirse a Google Meet
            </a>
          )}
          {!isLive && !isDone && meetUrl && (
            <a
              href={meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 font-semibold transition hover:bg-white/5"
              style={{
                borderColor: accentVar,
                color: accentVar,
              }}
            >
              <Video className="h-4 w-4" />
              Link de Meet
            </a>
          )}
        </div>
      </header>

      {/* ── SessionTabs (4 pestañas alumno) ────────────────────── */}
      <SessionTabs
        producto={productoId}
        rol="alumno"
        pestañas={cfg.alumno.pestañas_sesion}
        sesionData={{
          numero: sesion.numero,
          titulo: sesion.titulo,
          fecha_programada: sesion.fecha_programada,
          duracion_minutos: sesion.duracion_minutos,
          meet_url: sesion.meet_url,
          recording_url: sesion.recording_url,
          status: sesion.status,
          contenido_path: sesion.contenido_path,
        }}
      />
    </div>
  );
}

function StatusBadge({
  status,
  accentVar,
}: {
  status: string;
  accentVar: string;
}) {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    scheduled: {
      label: 'Programada',
      bg: 'var(--itseia-navy-light)',
      fg: 'var(--itseia-text)',
    },
    live: {
      label: 'En vivo',
      bg: 'var(--itseia-coral)',
      fg: 'var(--itseia-navy-dark)',
    },
    done: {
      label: 'Completada',
      bg: 'var(--itseia-gold)',
      fg: 'var(--itseia-navy-dark)',
    },
    cancelled: {
      label: 'Cancelada',
      bg: 'rgba(255,255,255,0.1)',
      fg: 'var(--itseia-text)',
    },
  };
  const v = map[status] ?? {
    label: status,
    bg: accentVar,
    fg: 'var(--itseia-navy-dark)',
  };
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: v.bg, color: v.fg }}
    >
      {v.label}
    </span>
  );
}
