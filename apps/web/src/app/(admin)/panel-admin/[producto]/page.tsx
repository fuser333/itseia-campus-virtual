/**
 * Lista de cohortes del producto (vista admin) · Campus v2 (FASE 4).
 *
 * URL: /panel-admin/[producto]   (ej: /panel-admin/mdt)
 *
 * Nota técnica: vive bajo `/panel-admin/...` (no en raíz) para evitar la
 * restricción de Next.js de rutas paralelas idénticas entre route groups
 * — `(alumno)` y `(docente)` ya ocupan `/[producto]`. FASE 5 cablea el
 * routing final desde middleware según role.
 *
 * Server Component. El admin (super_admin/admin/coordinacion) ve TODAS las
 * cohortes del producto (no solo las asignadas a él). Cada fila muestra:
 *  · Nombre + estado + cliente_referencia
 *  · Stats: alumnos · sesiones programadas · completadas
 *  · CTA → `/panel-admin/[producto]/[cohorteSlug]` (dashboard con 7 tabs)
 *
 * Header trae el botón "Nueva cohorte" (stub · FASE 5/6 implementa el wizard).
 */

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Users,
  PlayCircle,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getProductoSafe } from '@/lib/productos/loader';
import { getCohorteStats, type CohorteStats } from '@/lib/docente/cohortes';
import type { ProductoId } from '@/lib/productos/types';

const ADMIN_ROLES = new Set(['admin', 'super_admin', 'coordinacion']);

interface PageProps {
  params: Promise<{ producto: string }>;
}

interface CohorteAdmin {
  cohorte_slug: string;
  nombre_publico: string;
  estado: string;
  cliente_referencia: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
}

interface CohorteAdminConStats extends CohorteAdmin {
  stats: CohorteStats;
}

export default async function AdminProductoPage({ params }: PageProps) {
  const { producto: productoParam } = await params;
  const cfg = getProductoSafe(productoParam);
  if (!cfg) notFound();
  const productoId = cfg.producto.id as ProductoId;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/panel-admin/${productoId}`);

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';
  if (!ADMIN_ROLES.has(role)) redirect('/dashboard');

  const cohortes = await loadAllCohortes(productoId);

  // Stats en paralelo.
  const conStats: CohorteAdminConStats[] = await Promise.all(
    cohortes.map(async (c) => ({
      ...c,
      stats: await getCohorteStats(productoId, c.cohorte_slug),
    }))
  );

  const accent = `var(--producto-${productoId})`;

  return (
    <div className="space-y-8">
      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <Link
        href="/panel-admin"
        className="inline-flex items-center gap-1 text-sm opacity-60 transition hover:opacity-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al panel
      </Link>

      {/* ── Header ────────────────────────────────────────── */}
      <header
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
          borderLeft: `4px solid ${accent}`,
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{cfg.producto.icono}</span>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-60">
                Producto
              </div>
              <h1 className="mt-0.5 font-heading text-2xl font-bold sm:text-3xl">
                {cfg.producto.nombre}
              </h1>
              {cfg.producto.descripcion && (
                <p className="mt-1 max-w-xl text-sm opacity-70">
                  {cfg.producto.descripcion}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs opacity-65">
                <span>
                  Estructura: <strong>{cfg.cohorte.estructura}</strong>
                </span>
                <span>·</span>
                <span>
                  Sesiones: <strong>{cfg.cohorte.sesiones_totales}</strong>
                </span>
                <span>·</span>
                <span>
                  Pricing: <strong>{cfg.pricing.modelo}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* CTA · Nueva cohorte (stub FASE 5/6) */}
          <NuevaCohorteCTA accent={accent} />
        </div>
      </header>

      {/* ── Lista de cohortes ─────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold uppercase tracking-wider opacity-80">
            Cohortes
          </h2>
          <span className="text-xs opacity-50">
            {conStats.length} cohortes
          </span>
        </div>

        {conStats.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-8 text-center"
            style={{ borderColor: 'rgba(255,255,255,0.20)' }}
          >
            <p className="text-sm opacity-75">
              Aún no hay cohortes registradas para {cfg.producto.nombre}.
            </p>
            <p className="mt-2 text-xs opacity-50">
              Crea la primera con el botón &ldquo;Nueva cohorte&rdquo;.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {conStats.map((c) => (
              <CohorteRow
                key={c.cohorte_slug}
                productoId={productoId}
                cohorte={c}
                accent={accent}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loaders
// ─────────────────────────────────────────────────────────────────────────────

async function loadAllCohortes(producto: ProductoId): Promise<CohorteAdmin[]> {
  // Rama legacy cursos-pro
  if (producto === 'cursos-pro') {
    const { data: rows } = await supabaseAdmin
      .from('cursos_pro_courses')
      .select('slug, name, start_date, end_date, is_active')
      .order('start_date', { ascending: false });

    return ((rows ?? []) as Array<Record<string, unknown>>).map((r) => ({
      cohorte_slug: r.slug as string,
      nombre_publico: (r.name as string | null) ?? (r.slug as string),
      estado: r.is_active === false ? 'finalizada' : 'activa',
      cliente_referencia: null,
      fecha_inicio: (r.start_date as string | null) ?? null,
      fecha_fin: (r.end_date as string | null) ?? null,
    }));
  }

  // Rama Campus v2
  const { data: rows } = await supabaseAdmin
    .from('cohorte_metadata')
    .select(
      'cohorte_slug, nombre_publico, estado, cliente_referencia, fecha_inicio, fecha_fin'
    )
    .eq('producto', producto)
    .order('fecha_inicio', { ascending: false });

  return ((rows ?? []) as Array<Record<string, unknown>>).map((r) => ({
    cohorte_slug: r.cohorte_slug as string,
    nombre_publico:
      (r.nombre_publico as string | null) ?? (r.cohorte_slug as string),
    estado: (r.estado as string | null) ?? 'planificada',
    cliente_referencia: (r.cliente_referencia as string | null) ?? null,
    fecha_inicio: (r.fecha_inicio as string | null) ?? null,
    fecha_fin: (r.fecha_fin as string | null) ?? null,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────────────────────────────────────

function NuevaCohorteCTA({ accent }: { accent: string }) {
  return (
    <button
      type="button"
      disabled
      title="Wizard de creación · FASE 5/6"
      className="inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold opacity-60 cursor-not-allowed"
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderColor: accent,
        color: accent,
      }}
    >
      <Plus className="h-4 w-4" />
      Nueva cohorte
    </button>
  );
}

function CohorteRow({
  productoId,
  cohorte,
  accent,
}: {
  productoId: ProductoId;
  cohorte: CohorteAdminConStats;
  accent: string;
}) {
  const href = `/panel-admin/${productoId}/${cohorte.cohorte_slug}`;
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-4 rounded-xl border p-4 transition hover:bg-white/5"
        style={{
          borderColor: 'rgba(255,255,255,0.10)',
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: accent }}
        >
          <Calendar className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{cohorte.nombre_publico}</h3>
            <EstadoBadge estado={cohorte.estado} />
          </div>
          {cohorte.cliente_referencia && (
            <p className="text-xs opacity-60">
              Cliente: {cohorte.cliente_referencia}
            </p>
          )}
          {cohorte.fecha_inicio && (
            <p className="text-xs opacity-50">
              Inicio:{' '}
              {new Date(cohorte.fecha_inicio).toLocaleDateString('es-EC', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        <div className="hidden gap-4 text-xs opacity-70 sm:flex">
          <Stat
            icon={<Users className="h-3.5 w-3.5" />}
            value={cohorte.stats.alumnos_total}
          />
          <Stat
            icon={<PlayCircle className="h-3.5 w-3.5" />}
            value={cohorte.stats.sesiones_programadas}
          />
          <Stat
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            value={cohorte.stats.sesiones_completadas}
          />
        </div>

        <ArrowRight
          className="h-4 w-4 shrink-0 transition group-hover:translate-x-1"
          style={{ color: 'rgba(255,255,255,0.40)' }}
        />
      </Link>
    </li>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
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
