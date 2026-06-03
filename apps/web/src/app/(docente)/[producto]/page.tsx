/**
 * Lista de cohortes asignadas al docente para un producto · Campus v2 (FASE 3).
 *
 * URL: /[producto]   (ej: /mdt)
 * Server Component. Verifica acceso y lista cohortes (con stats) del docente
 * en el producto solicitado.
 *
 * Coexistencia: para `preuni`, `cursos-pro`, etc. las rutas estáticas legacy
 * ganan. Solo `/mdt` (sin static) cae acá durante FASE 3.
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
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getProductoSafe } from '@/lib/productos/loader';
import {
  getCohortesAsignadasByProducto,
  getCohorteStats,
  type CohorteDocente,
  type CohorteStats,
} from '@/lib/docente/cohortes';
import type { ProductoId } from '@/lib/productos/types';

interface PageProps {
  params: Promise<{ producto: string }>;
}

const ADMIN_ROLES = new Set(['super_admin', 'admin', 'coordinacion']);

export default async function DocenteProductoPage({ params }: PageProps) {
  const { producto: productoParam } = await params;
  const cfg = getProductoSafe(productoParam);
  if (!cfg) notFound();
  const productoId = cfg.producto.id as ProductoId;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/${productoId}`);

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';
  const isAdminLevel = ADMIN_ROLES.has(role);

  let cohortes = await getCohortesAsignadasByProducto(user.id, productoId);

  // Si es admin/super_admin/coordinacion sin assignments propios, mostramos
  // TODAS las cohortes del producto desde cohorte_metadata para que pueda
  // navegar (modo gestión).
  if (cohortes.length === 0 && isAdminLevel) {
    cohortes = await loadAllCohortesForAdmin(productoId);
  }

  // Cargar stats en paralelo.
  const conStats = await Promise.all(
    cohortes.map(async (c) => ({
      ...c,
      stats: await getCohorteStats(c.producto, c.cohorte_slug),
    }))
  );

  const accent = `var(--producto-${productoId})`;

  return (
    <div className="space-y-8">
      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <Link
        href="/dashboard-docente"
        className="inline-flex items-center gap-1 text-sm opacity-60 transition hover:opacity-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al dashboard
      </Link>

      {/* ── Header ────────────────────────────────────────────── */}
      <header
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
          borderLeft: `4px solid ${accent}`,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{cfg.producto.icono}</span>
          <div>
            <h1 className="font-heading text-2xl font-bold sm:text-3xl">
              {cfg.producto.nombre}
            </h1>
            {cfg.producto.descripcion && (
              <p className="mt-1 text-sm opacity-70">
                {cfg.producto.descripcion}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ── Cohortes ──────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold uppercase tracking-wider opacity-80">
          {isAdminLevel && cohortes.length > 0 && conStats.length > 0
            ? 'Todas las cohortes'
            : 'Mis cohortes'}
        </h2>

        {conStats.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-8 text-center"
            style={{ borderColor: 'rgba(255,255,255,0.20)' }}
          >
            <p className="text-sm opacity-75">
              No tienes cohortes de {cfg.producto.nombre} asignadas.
            </p>
            <p className="mt-2 text-xs opacity-50">
              Pídele a Coordinación Académica que te asigne una.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {conStats.map((c) => (
              <CohorteRow key={`${c.producto}::${c.cohorte_slug}`} cohorte={c} accent={accent} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function loadAllCohortesForAdmin(
  producto: ProductoId
): Promise<CohorteDocente[]> {
  const { data: rows } = await supabaseAdmin
    .from('cohorte_metadata')
    .select(
      'producto, cohorte_slug, nombre_publico, fecha_inicio, fecha_fin, meet_url, estado, cliente_referencia'
    )
    .eq('producto', producto)
    .order('fecha_inicio', { ascending: false });

  return ((rows ?? []) as Array<Record<string, unknown>>).map((r) => ({
    assignment_id: '',
    producto,
    cohorte_slug: r.cohorte_slug as string,
    nombre_publico:
      (r.nombre_publico as string | null) ?? (r.cohorte_slug as string),
    rol_en_cohorte: 'titular' as const,
    fecha_inicio: (r.fecha_inicio as string | null) ?? null,
    fecha_fin: (r.fecha_fin as string | null) ?? null,
    meet_url: (r.meet_url as string | null) ?? null,
    estado: (r.estado as string | null) ?? 'planificada',
    cliente_referencia: (r.cliente_referencia as string | null) ?? null,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────────────────────────────────────

interface CohorteConStatsRow extends CohorteDocente {
  stats: CohorteStats;
}

function CohorteRow({
  cohorte,
  accent,
}: {
  cohorte: CohorteConStatsRow;
  accent: string;
}) {
  const href = `/${cohorte.producto}/${cohorte.cohorte_slug}`;
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
          <Stat icon={<Users className="h-3.5 w-3.5" />} value={cohorte.stats.alumnos_total} />
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
    activa: {
      label: 'Activa',
      bg: 'rgba(76,175,80,0.20)',
      fg: '#4CAF50',
    },
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
