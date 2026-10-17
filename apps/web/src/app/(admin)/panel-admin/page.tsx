/**
 * Panel Admin · Campus v2 (Opción B · FASE 4).
 *
 * Server Component. Renderiza las 8 cards de productos del catálogo (desde el
 * loader YAML) con sus stats reales agregadas:
 *  · Cohortes activas (en `cohorte_metadata.estado = activa` + legacy cursos-pro).
 *  · Alumnos enrollados (sum por producto, best-effort).
 *  · Próxima sesión global del producto.
 *
 * El admin entra acá como dashboard inicial y desde cada card navega a
 * `/(admin)/[producto]/page.tsx` (lista de cohortes).
 *
 * URL: /panel-admin   (no colisiona con /admin legacy)
 *
 * NOTAS:
 *  · Las queries de stats son best-effort: si la columna `enrollments.cohorte_id`
 *    no existe aún (FASE 6 la agrega), el contador cae a 0 silenciosamente.
 *  · `cursos-pro` tiene rama legacy (`cursos_pro_courses` + `cursos_pro_enrollments`).
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Flame,
  Briefcase,
  Rocket,
  Award,
  Building2,
  BookOpen,
  GraduationCap,
  Eye,
  Users,
  Layers,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { listProductos } from '@/lib/productos/loader';
import type { ProductoConfig, ProductoId } from '@/lib/productos/types';

export const metadata: Metadata = {
  title: 'Panel Admin · Campus v2 | ITSEIA',
  description: 'Vista maestra de los 8 productos del campus con stats en vivo.',
};

const ADMIN_ROLES = new Set(['admin', 'super_admin', 'coordinacion']);

type IconComponent = React.ComponentType<{ className?: string }>;

const PRODUCTO_ICON: Record<ProductoId, IconComponent> = {
  preuni: Flame,
  'cursos-pro': Briefcase,
  bootcamp: Rocket,
  mdt: Award,
  b2b: Building2,
  certificaciones: BookOpen,
  carreras: GraduationCap,
  demo: Eye,
};

interface ProductoStats {
  cohortes_activas: number;
  cohortes_totales: number;
  alumnos_total: number;
  proxima_sesion: {
    titulo: string;
    fecha_programada: string | null;
    cohorte_nombre: string;
  } | null;
}

export default async function PanelAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/panel-admin');

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';
  if (!ADMIN_ROLES.has(role)) redirect('/dashboard');

  const fullName =
    (profile?.full_name as string | undefined) ??
    user.email?.split('@')[0] ??
    'Admin';

  // Carga todos los productos en paralelo con sus stats.
  const productos = listProductos();
  const conStats = await Promise.all(
    productos.map(async (cfg) => ({
      cfg,
      stats: await getProductoStats(cfg.producto.id as ProductoId),
    }))
  );

  // Totales globales (para el strip superior).
  const totalCohortesActivas = conStats.reduce(
    (sum, p) => sum + p.stats.cohortes_activas,
    0
  );
  const totalAlumnos = conStats.reduce(
    (sum, p) => sum + p.stats.alumnos_total,
    0
  );
  const totalProductos = productos.length;

  return (
    <div className="space-y-8">
      {/* ── Encabezado ───────────────────────────────────────── */}
      <header>
        <div className="text-xs font-bold uppercase tracking-widest opacity-60">
          Panel Admin · Campus v2
        </div>
        <h1 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">
          Hola {fullName}
        </h1>
        <p className="mt-1 text-sm opacity-70">
          Vista maestra de los productos. Haz clic en una card para gestionar
          sus cohortes.
        </p>
      </header>

      {/* ── Resumen global ──────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-3">
        <GlobalKpi
          icon={<Layers className="h-5 w-5" />}
          value={totalProductos}
          label="Productos"
        />
        <GlobalKpi
          icon={<Calendar className="h-5 w-5" />}
          value={totalCohortesActivas}
          label="Cohortes activas"
        />
        <GlobalKpi
          icon={<Users className="h-5 w-5" />}
          value={totalAlumnos}
          label="Alumnos enrollados"
        />
      </section>

      {/* ── 8 Cards de productos ────────────────────────────── */}
      <section>
        <h2 className="mb-3 font-heading text-lg font-bold uppercase tracking-wider opacity-80">
          Productos
        </h2>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {conStats.map(({ cfg, stats }) => (
            <li key={cfg.producto.id}>
              <ProductoCard cfg={cfg} stats={stats} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats helper
// ─────────────────────────────────────────────────────────────────────────────

async function getProductoStats(producto: ProductoId): Promise<ProductoStats> {
  const stats: ProductoStats = {
    cohortes_activas: 0,
    cohortes_totales: 0,
    alumnos_total: 0,
    proxima_sesion: null,
  };

  // ─── Rama legacy cursos-pro ──────────────────────────────────────────────
  if (producto === 'cursos-pro') {
    const { data: courses } = await supabaseAdmin
      .from('cursos_pro_courses')
      .select('id, name, slug, is_active')
      .order('start_date', { ascending: false });

    const list = (courses ?? []) as Array<{
      id: string;
      name: string;
      slug: string;
      is_active: boolean | null;
    }>;
    stats.cohortes_totales = list.length;
    stats.cohortes_activas = list.filter((c) => c.is_active !== false).length;

    if (list.length > 0) {
      const ids = list.map((c) => c.id);
      const { count: enrolledCount } = await supabaseAdmin
        .from('cursos_pro_enrollments')
        .select('*', { count: 'exact', head: true })
        .in('course_id', ids)
        .eq('status', 'active');
      stats.alumnos_total = enrolledCount ?? 0;

      const { data: nextSesion } = await supabaseAdmin
        .from('cursos_pro_sessions')
        .select('title, scheduled_at, course_id')
        .in('course_id', ids)
        .in('status', ['scheduled', 'live'])
        .order('scheduled_at', { ascending: true })
        .limit(1);

      const next = (nextSesion ?? [])[0] as
        | { title: string; scheduled_at: string | null; course_id: string }
        | undefined;
      if (next) {
        const course = list.find((c) => c.id === next.course_id);
        stats.proxima_sesion = {
          titulo: next.title,
          fecha_programada: next.scheduled_at,
          cohorte_nombre: course?.name ?? course?.slug ?? '',
        };
      }
    }
    return stats;
  }

  // ─── Rama Campus v2 ──────────────────────────────────────────────────────
  const { data: cohortes } = await supabaseAdmin
    .from('cohorte_metadata')
    .select('id, cohorte_slug, nombre_publico, estado')
    .eq('producto', producto);

  const list = (cohortes ?? []) as Array<{
    id: string;
    cohorte_slug: string;
    nombre_publico: string | null;
    estado: string | null;
  }>;
  stats.cohortes_totales = list.length;
  stats.cohortes_activas = list.filter((c) => c.estado === 'activa').length;

  if (list.length > 0) {
    const cohorteIds = list.map((c) => c.id);

    // Alumnos: best-effort. La columna enrollments.cohorte_id la agrega FASE 6.
    const { count: enrolledCount, error: enrolledErr } = await supabaseAdmin
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .in('cohorte_id', cohorteIds)
      .eq('status', 'active');
    stats.alumnos_total = enrolledErr ? 0 : enrolledCount ?? 0;

    const { data: nextSesion } = await supabaseAdmin
      .from('cohorte_sesiones')
      .select('titulo, fecha_programada, cohorte_id')
      .in('cohorte_id', cohorteIds)
      .in('status', ['scheduled', 'live'])
      .order('fecha_programada', { ascending: true })
      .limit(1);

    const next = (nextSesion ?? [])[0] as
      | { titulo: string; fecha_programada: string | null; cohorte_id: string }
      | undefined;
    if (next) {
      const cohorte = list.find((c) => c.id === next.cohorte_id);
      stats.proxima_sesion = {
        titulo: next.titulo,
        fecha_programada: next.fecha_programada,
        cohorte_nombre:
          cohorte?.nombre_publico ?? cohorte?.cohorte_slug ?? '',
      };
    }
  }

  return stats;
}

// ─────────────────────────────────────────────────────────────────────────────
// UI helpers
// ─────────────────────────────────────────────────────────────────────────────

function ProductoCard({
  cfg,
  stats,
}: {
  cfg: ProductoConfig;
  stats: ProductoStats;
}) {
  const productoId = cfg.producto.id as ProductoId;
  const Icon = PRODUCTO_ICON[productoId];
  const accent = `var(--producto-${productoId})`;

  return (
    <Link
      href={`/panel-admin/${productoId}`}
      className="group flex h-full flex-col gap-3 rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:bg-white/5"
      style={{
        backgroundColor: 'var(--itseia-navy)',
        borderColor: 'var(--sidebar-border)',
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: accent }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xl">{cfg.producto.icono}</span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-heading text-base font-bold leading-tight">
          {cfg.producto.nombre}
        </h3>
        {cfg.producto.descripcion && (
          <p className="mt-1 line-clamp-2 text-xs opacity-65">
            {cfg.producto.descripcion}
          </p>
        )}
      </div>

      <ul className="space-y-1.5 border-t pt-3 text-xs"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <StatRow
          icon={<Calendar className="h-3.5 w-3.5" />}
          label="Cohortes"
          value={`${stats.cohortes_activas} activas · ${stats.cohortes_totales} totales`}
        />
        <StatRow
          icon={<Users className="h-3.5 w-3.5" />}
          label="Alumnos"
          value={stats.alumnos_total === 0 ? '—' : String(stats.alumnos_total)}
        />
        {stats.proxima_sesion ? (
          <StatRow
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            label="Próxima"
            value={stats.proxima_sesion.titulo}
          />
        ) : (
          <StatRow
            icon={<CheckCircle2 className="h-3.5 w-3.5 opacity-40" />}
            label="Próxima"
            value="Sin sesiones"
          />
        )}
      </ul>

      <div className="mt-1 flex items-center justify-between text-[11px]">
        <span className="opacity-50">Gestionar →</span>
        <ArrowRight
          className="h-4 w-4 transition group-hover:translate-x-1"
          style={{ color: accent }}
        />
      </div>
    </Link>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-2">
      <span className="opacity-60">{icon}</span>
      <span className="opacity-60">{label}:</span>
      <span className="truncate font-semibold">{value}</span>
    </li>
  );
}

function GlobalKpi({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(255,255,255,0.10)',
      }}
    >
      <div
        className="flex items-center gap-2"
        style={{ color: 'var(--itseia-gold)' }}
      >
        {icon}
      </div>
      <div className="mt-2 font-heading text-3xl font-extrabold">{value}</div>
      <div className="text-xs uppercase tracking-wider opacity-60">{label}</div>
    </div>
  );
}
