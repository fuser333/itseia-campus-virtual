/**
 * Dashboard de cohorte (vista docente) · Campus v2 (FASE 3).
 *
 * URL: /[producto]/[cohorteSlug]   (sandbox: /mdt/<slug>)
 *
 * Server Component. Verifica que el docente esté asignado a esta cohorte
 * (o sea admin-level) y muestra:
 *  · Header con nombre, fecha de inicio, estado.
 *  · Botón GRABAR sticky (RecordButton).
 *  · Cards de KPIs: alumnos, sesiones programadas/completadas, próxima sesión.
 *  · Listado breve de sesiones (clic → /sesion/[num]).
 *  · Placeholders para Alumnos, Asistencia, Materiales, Grabaciones
 *    (que se desarrollan en FASE 4).
 */

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Users,
  PlayCircle,
  CheckCircle2,
  Video,
  Radio,
  ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getProductoSafe } from '@/lib/productos/loader';
import {
  getCohorteAsignada,
  getCohorteStats,
  getSesionesCohorte,
  type CohorteDocente,
} from '@/lib/docente/cohortes';
import type { ProductoId } from '@/lib/productos/types';
import RecordButton from '@/components/docente/RecordButton';

const ADMIN_ROLES = new Set(['super_admin', 'admin', 'coordinacion']);

interface PageProps {
  params: Promise<{ producto: string; cohorteSlug: string }>;
}

export default async function CohorteDocentePage({ params }: PageProps) {
  const { producto: productoParam, cohorteSlug } = await params;

  const cfg = getProductoSafe(productoParam);
  if (!cfg) notFound();
  const productoId = cfg.producto.id as ProductoId;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    redirect(`/login?redirect=/${productoId}/${cohorteSlug}`);

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';
  const isAdminLevel = ADMIN_ROLES.has(role);

  // Validar acceso a la cohorte
  let cohorte: CohorteDocente | null = await getCohorteAsignada(
    user.id,
    productoId,
    cohorteSlug
  );

  if (!cohorte && isAdminLevel) {
    cohorte = await loadCohorteAsAdmin(productoId, cohorteSlug);
  }

  if (!cohorte) {
    // Sin assignment ni admin-level: kick out al dashboard.
    redirect(`/${productoId}`);
  }

  const stats = await getCohorteStats(productoId, cohorteSlug);
  const sesiones = await getSesionesCohorte(productoId, cohorteSlug);

  const accent = `var(--producto-${productoId})`;

  return (
    <div className="space-y-8">
      {/* ── Breadcrumb ────────────────────────────────────── */}
      <Link
        href={`/${productoId}`}
        className="inline-flex items-center gap-1 text-sm opacity-60 transition hover:opacity-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a {cfg.producto.nombre}
      </Link>

      {/* ── Sticky Record Button ──────────────────────────── */}
      {cfg.docente.boton_grabar && (
        <div className="sticky top-2 z-30">
          <RecordButton
            producto={productoId}
            cohorteSlug={cohorteSlug}
            sesionNumero={stats.proxima_sesion?.numero ?? 1}
            meetUrl={cohorte.meet_url ?? undefined}
          />
        </div>
      )}

      {/* ── Header de cohorte ─────────────────────────────── */}
      <header
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
          borderLeft: `4px solid ${accent}`,
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-60">
              {cfg.producto.nombre}
              <EstadoPill estado={cohorte.estado} />
            </div>
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
              {cohorte.nombre_publico}
            </h1>
            {cohorte.cliente_referencia && (
              <p className="text-sm opacity-70">
                Cliente: {cohorte.cliente_referencia}
              </p>
            )}
            {cohorte.fecha_inicio && (
              <div className="flex items-center gap-1.5 text-sm opacity-70">
                <Calendar className="h-4 w-4" />
                Inicio:{' '}
                {new Date(cohorte.fecha_inicio).toLocaleDateString('es-EC', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── KPIs ──────────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Users className="h-5 w-5" />}
          value={stats.alumnos_total}
          label="Alumnos"
          accent={accent}
        />
        <KpiCard
          icon={<PlayCircle className="h-5 w-5" />}
          value={stats.sesiones_programadas}
          label="Sesiones próximas"
          accent={accent}
        />
        <KpiCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          value={stats.sesiones_completadas}
          label="Completadas"
          accent={accent}
        />
        <KpiCard
          icon={<Video className="h-5 w-5" />}
          value={stats.sesiones_total}
          label="Total sesiones"
          accent={accent}
        />
      </section>

      {/* ── Próxima sesión ────────────────────────────────── */}
      {stats.proxima_sesion && (
        <section
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(255,255,255,0.10)',
          }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider opacity-60">
            Próxima sesión
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg font-bold">
                #{stats.proxima_sesion.numero} ·{' '}
                {stats.proxima_sesion.titulo}
              </h3>
              {stats.proxima_sesion.fecha_programada && (
                <p className="text-sm opacity-70">
                  {new Date(
                    stats.proxima_sesion.fecha_programada
                  ).toLocaleDateString('es-EC', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  EC
                </p>
              )}
            </div>
            <Link
              href={`/${productoId}/${cohorteSlug}/sesion/${stats.proxima_sesion.numero}`}
              className="rounded-lg px-4 py-2 text-sm font-semibold transition hover:opacity-90"
              style={{
                backgroundColor: 'var(--itseia-gold)',
                color: 'var(--itseia-navy-dark)',
              }}
            >
              Abrir vista de clase
            </Link>
          </div>
        </section>
      )}

      {/* ── Listado de sesiones ───────────────────────────── */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider opacity-80">
            Sesiones
          </h2>
          <span className="text-xs opacity-50">{sesiones.length} sesiones</span>
        </div>

        {sesiones.length === 0 ? (
          <div
            className="rounded-xl border border-dashed p-6 text-center"
            style={{ borderColor: 'rgba(255,255,255,0.20)' }}
          >
            <p className="text-sm opacity-75">
              Aún no hay sesiones cargadas para esta cohorte.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {sesiones.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/${productoId}/${cohorteSlug}/sesion/${s.numero}`}
                  className="group flex items-center gap-3 rounded-xl border p-4 transition hover:bg-white/5"
                  style={{
                    borderColor: 'rgba(255,255,255,0.10)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      color: accent,
                    }}
                  >
                    {s.numero}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate text-sm font-semibold">
                        {s.titulo}
                      </h4>
                      <StatusBadge status={s.status} />
                    </div>
                    {s.fecha_programada && (
                      <p className="text-xs opacity-60">
                        {new Date(s.fecha_programada).toLocaleDateString(
                          'es-EC',
                          {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}{' '}
                        EC
                      </p>
                    )}
                  </div>
                  {s.status === 'live' && (
                    <Radio
                      className="h-4 w-4 animate-pulse shrink-0"
                      style={{ color: 'var(--itseia-coral)' }}
                    />
                  )}
                  <ChevronRight
                    className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5"
                    style={{ color: 'rgba(255,255,255,0.40)' }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Anclas para sidebar (Alumnos, Grabaciones) ───── */}
      <section id="alumnos">
        <h2 className="mb-3 font-heading text-lg font-bold uppercase tracking-wider opacity-80">
          Alumnos
        </h2>
        <PlaceholderCard
          title="Listado de alumnos"
          description="La tabla de alumnos enrollados con asistencia y notas se habilita en FASE 4."
        />
      </section>

      <section id="grabaciones">
        <h2 className="mb-3 font-heading text-lg font-bold uppercase tracking-wider opacity-80">
          Grabaciones
        </h2>
        <PlaceholderCard
          title="Histórico de grabaciones"
          description="Se asocian automáticamente vía cron Drive → YouTube tras iniciar la grabación con el botón superior."
        />
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function loadCohorteAsAdmin(
  producto: ProductoId,
  slug: string
): Promise<CohorteDocente | null> {
  const { data } = await supabaseAdmin
    .from('cohorte_metadata')
    .select(
      'producto, cohorte_slug, nombre_publico, fecha_inicio, fecha_fin, meet_url, estado, cliente_referencia'
    )
    .eq('producto', producto)
    .eq('cohorte_slug', slug)
    .maybeSingle();

  if (!data) return null;
  return {
    assignment_id: '',
    producto,
    cohorte_slug: data.cohorte_slug as string,
    nombre_publico:
      (data.nombre_publico as string | null) ?? (data.cohorte_slug as string),
    rol_en_cohorte: 'titular',
    fecha_inicio: (data.fecha_inicio as string | null) ?? null,
    fecha_fin: (data.fecha_fin as string | null) ?? null,
    meet_url: (data.meet_url as string | null) ?? null,
    estado: (data.estado as string | null) ?? 'planificada',
    cliente_referencia: (data.cliente_referencia as string | null) ?? null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// UI helpers
// ─────────────────────────────────────────────────────────────────────────────

function KpiCard({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: 'rgba(255,255,255,0.10)',
        backgroundColor: 'rgba(255,255,255,0.03)',
      }}
    >
      <div className="flex items-center gap-2" style={{ color: accent }}>
        {icon}
      </div>
      <div className="mt-2 font-heading text-3xl font-extrabold">{value}</div>
      <div className="text-xs uppercase tracking-wider opacity-60">{label}</div>
    </div>
  );
}

function EstadoPill({ estado }: { estado: string }) {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    activa: { label: 'Activa', bg: 'rgba(76,175,80,0.20)', fg: '#4CAF50' },
    planificada: {
      label: 'Planificada',
      bg: 'rgba(115,184,231,0.18)',
      fg: 'var(--itseia-sky)',
    },
    finalizada: {
      label: 'Finalizada',
      bg: 'rgba(255,255,255,0.10)',
      fg: 'rgba(255,255,255,0.65)',
    },
    cancelada: {
      label: 'Cancelada',
      bg: 'rgba(240,132,109,0.20)',
      fg: 'var(--itseia-coral)',
    },
  };
  const v = map[estado] ?? map.planificada;
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: v.bg, color: v.fg }}
    >
      {v.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
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
      bg: 'rgba(255,255,255,0.10)',
      fg: 'var(--itseia-text)',
    },
  };
  const v = map[status] ?? map.scheduled;
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: v.bg, color: v.fg }}
    >
      {v.label}
    </span>
  );
}

function PlaceholderCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="rounded-xl border border-dashed p-6 text-center"
      style={{
        borderColor: 'rgba(255,255,255,0.18)',
        backgroundColor: 'rgba(255,255,255,0.02)',
      }}
    >
      <div className="font-semibold opacity-80">{title}</div>
      <p className="mx-auto mt-1 max-w-md text-xs opacity-55">{description}</p>
    </div>
  );
}
