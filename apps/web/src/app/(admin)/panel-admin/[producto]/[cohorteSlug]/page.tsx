/**
 * Dashboard de cohorte (vista admin) · Campus v2 (FASE 4).
 *
 * URL: /panel-admin/[producto]/[cohorteSlug]   (ej: /panel-admin/mdt/<slug>)
 *
 * Nota técnica: vive bajo `/panel-admin/...` para evitar colisión con
 * `(docente)/[producto]/[cohorteSlug]`. FASE 5 cablea el routing por role
 * desde middleware (cada role cae al shell correcto).
 *
 * Server Component. Verifica role admin/super_admin/coordinacion y muestra:
 *  · Breadcrumb a /panel-admin/[producto] y panel-admin
 *  · Header: nombre, cliente, fechas, estado
 *  · KPIs rápidos: alumnos · sesiones programadas · completadas · totales
 *  · 7 pestañas: Alumnos · Sesiones · Pagos · Asistencia · Materiales ·
 *    Grabaciones · Configuración (todas stubs FASE 4)
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
  ExternalLink,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getProductoSafe } from '@/lib/productos/loader';
import { getCohorteStats } from '@/lib/docente/cohortes';
import type { ProductoId } from '@/lib/productos/types';
import AdminCohorteTabs from '@/components/admin/AdminCohorteTabs';

const ADMIN_ROLES = new Set(['admin', 'super_admin', 'coordinacion']);

interface PageProps {
  params: Promise<{ producto: string; cohorteSlug: string }>;
}

interface CohorteHeader {
  cohorte_id: string | null;
  nombre_publico: string;
  estado: string;
  cliente_referencia: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  meet_url: string | null;
}

export default async function AdminCohortePage({ params }: PageProps) {
  const { producto: productoParam, cohorteSlug } = await params;

  const cfg = getProductoSafe(productoParam);
  if (!cfg) notFound();
  const productoId = cfg.producto.id as ProductoId;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    redirect(
      `/login?redirect=/panel-admin/${productoId}/${cohorteSlug}`
    );

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';
  if (!ADMIN_ROLES.has(role)) redirect('/dashboard');

  const cohorte = await loadCohorteHeader(productoId, cohorteSlug);
  if (!cohorte) notFound();

  const stats = await getCohorteStats(productoId, cohorteSlug);

  const accent = `var(--producto-${productoId})`;

  return (
    <div className="space-y-8">
      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs opacity-60">
        <Link href="/panel-admin" className="hover:opacity-100">
          Panel
        </Link>
        <span>/</span>
        <Link href={`/panel-admin/${productoId}`} className="hover:opacity-100">
          {cfg.producto.nombre}
        </Link>
        <span>/</span>
        <span className="opacity-80">{cohorte.nombre_publico}</span>
      </div>

      <Link
        href={`/panel-admin/${productoId}`}
        className="inline-flex items-center gap-1 text-sm opacity-60 transition hover:opacity-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a {cfg.producto.nombre}
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
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-60">
            {cfg.producto.nombre}
            <EstadoPill estado={cohorte.estado} />
          </div>
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">
            {cohorte.nombre_publico}
          </h1>
          {cohorte.cliente_referencia && (
            <p className="text-sm opacity-70">
              Cliente: <strong>{cohorte.cliente_referencia}</strong>
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm opacity-70">
            {cohorte.fecha_inicio && (
              <div className="flex items-center gap-1.5">
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
            {cohorte.meet_url && (
              <a
                href={cohorte.meet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition hover:opacity-100"
                style={{ color: 'var(--itseia-sky)' }}
              >
                <Video className="h-4 w-4" />
                Abrir Meet
                <ExternalLink className="h-3 w-3" />
              </a>
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

      {/* ── 7 Tabs ────────────────────────────────────────── */}
      <AdminCohorteTabs
        producto={productoId}
        cohorteSlug={cohorteSlug}
        cohorteId={cohorte.cohorte_id}
        accent={accent}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loaders
// ─────────────────────────────────────────────────────────────────────────────

async function loadCohorteHeader(
  producto: ProductoId,
  slug: string
): Promise<CohorteHeader | null> {
  // Rama legacy cursos-pro: usa cursos_pro_courses
  if (producto === 'cursos-pro') {
    const { data } = await supabaseAdmin
      .from('cursos_pro_courses')
      .select('id, name, slug, start_date, end_date, is_active')
      .eq('slug', slug)
      .maybeSingle();
    if (!data) return null;
    return {
      cohorte_id: null, // No vive en cohorte_metadata
      nombre_publico: (data.name as string | null) ?? slug,
      estado: data.is_active === false ? 'finalizada' : 'activa',
      cliente_referencia: null,
      fecha_inicio: (data.start_date as string | null) ?? null,
      fecha_fin: (data.end_date as string | null) ?? null,
      meet_url: null,
    };
  }

  // Rama Campus v2
  const { data } = await supabaseAdmin
    .from('cohorte_metadata')
    .select(
      'id, cohorte_slug, nombre_publico, estado, cliente_referencia, fecha_inicio, fecha_fin, meet_url'
    )
    .eq('producto', producto)
    .eq('cohorte_slug', slug)
    .maybeSingle();

  if (!data) return null;

  return {
    cohorte_id: data.id as string,
    nombre_publico:
      (data.nombre_publico as string | null) ?? (data.cohorte_slug as string),
    estado: (data.estado as string | null) ?? 'planificada',
    cliente_referencia: (data.cliente_referencia as string | null) ?? null,
    fecha_inicio: (data.fecha_inicio as string | null) ?? null,
    fecha_fin: (data.fecha_fin as string | null) ?? null,
    meet_url: (data.meet_url as string | null) ?? null,
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
