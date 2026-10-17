/**
 * Vista de sesión · Alumno · Cursos Profesionales · Campus v2 (unificado).
 *
 * FIX 04-jun-2026: Reemplaza las 4 tabs hardcoded legacy por SessionTabs del
 * Campus v2 (@/components/core/SessionTabs). El header ahora tiene el mismo
 * look que la sesión del preuni (borderLeft accent, breadcrumb "Volver a
 * sesiones", botón "Unirse a Meet" si live).
 *
 * Los datos legacy (theory_md, exercise_md, quiz_json, resources_json)
 * se mapean a sesionData.contenido_path usando la convención de Campus v2
 * (los tab components internos leen sesionData.contenido_path; las tabs
 * de la legacy usan los campos directamente, pero SessionTabs también
 * recibirá estos campos en sesionData para que los tabs los usen).
 *
 * NOTA: el componente sigue siendo 'use client' porque SessionTabs es client
 * y necesita useState para la tab activa. El Server Component page.tsx resuelve
 * los datos y los pasa como props.
 */

'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Radio,
  Video,
} from 'lucide-react';
import SessionTabs from '@/components/core/SessionTabs';
import type { SesionDataMinima } from '@/components/core/SessionTabs';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface StudentSession {
  id: string;
  num: number;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  meet_url: string | null;
  recording_url: string | null;
  theory_md: string | null;
  exercise_md: string | null;
  quiz_json: unknown;
  resources_json: unknown;
  status: 'scheduled' | 'live' | 'done' | 'cancelled';
}

interface Props {
  session: StudentSession;
  courseSlug: string;
  enrollmentId: string | null;
  prevHref: string | null;
  nextHref: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudentSessionView({
  session,
  courseSlug,
  prevHref: _prevHref,
  nextHref: _nextHref,
}: Props) {
  const accentVar = 'var(--producto-cursos-pro)';
  const isLive = session.status === 'live';
  const isDone = session.status === 'done';

  // Mapear los campos legacy a SesionDataMinima que espera SessionTabs.
  // Los tabs internos (VideoResumenTab, MaterialesTab, etc.) leen
  // sesionData.contenido_path para buscar en el filesystem del campus v2.
  // Para cursos-pro (legacy), el contenido viene en los campos directos
  // de la sesión; pasamos todo en sesionData para que los tabs puedan usarlo.
  const sesionData: SesionDataMinima & {
    theory_md?: string | null;
    exercise_md?: string | null;
    quiz_json?: unknown;
    resources_json?: unknown;
    description?: string | null;
  } = {
    numero: session.num,
    titulo: session.title,
    fecha_programada: session.scheduled_at,
    duracion_minutos: session.duration_minutes,
    meet_url: session.meet_url,
    recording_url: session.recording_url,
    status: session.status,
    // Los campos de contenido legacy se pasan extendidos para que los tabs
    // del Campus v2 los detecten y rendericen correctamente.
    contenido_path: null,
    theory_md: session.theory_md,
    exercise_md: session.exercise_md,
    quiz_json: session.quiz_json,
    resources_json: session.resources_json,
    description: session.description,
  };

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <Link
        href={`/cursos-pro/${courseSlug}`}
        className="inline-flex items-center gap-1 text-sm opacity-60 hover:opacity-100"
        style={{ color: 'var(--itseia-text)' }}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a sesiones
      </Link>

      {/* ── Header de sesión (mismo look que preuni) ─────────────────────── */}
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
            <div
              className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-60"
              style={{ color: 'var(--itseia-text)' }}
            >
              Sesión #{session.num}
              <StatusBadge status={session.status} accentVar={accentVar} />
            </div>
            <h1
              className="font-heading text-2xl font-bold sm:text-3xl"
              style={{ color: 'var(--itseia-text)' }}
            >
              {session.title}
            </h1>
            <div
              className="flex flex-wrap gap-3 text-sm opacity-70"
              style={{ color: 'var(--itseia-text)' }}
            >
              {session.scheduled_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(session.scheduled_at).toLocaleDateString('es-EC', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {session.duration_minutes} min
              </span>
            </div>
          </div>

          {/* Botón Meet: mismo patrón que preuni */}
          {isLive && session.meet_url && (
            <a
              href={session.meet_url}
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
          {!isLive && !isDone && session.meet_url && (
            <a
              href={session.meet_url}
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

      {/* ── SessionTabs (4 pestañas Campus v2) ─────────────────────────── */}
      <SessionTabs
        producto="cursos-pro"
        rol="alumno"
        pestañas={['video_resumen', 'materiales', 'ejercicios', 'evaluacion']}
        sesionData={sesionData}
      />
    </div>
  );
}

// ─── StatusBadge (mismo que SesionAlumnoPage del preuni) ─────────────────────

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
