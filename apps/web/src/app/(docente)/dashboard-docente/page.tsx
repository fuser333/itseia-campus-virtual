/**
 * Dashboard Docente · Campus v2 (Opción B · FASE 3).
 *
 * Server Component. Renderiza N cards (una por cohorte asignada al docente),
 * agrupadas visualmente por producto, con stats reales:
 *   · alumnos enrollados
 *   · sesiones programadas vs completadas
 *   · próxima sesión
 *
 * Si el docente tiene 0 cohortes, muestra un empty state honesto.
 *
 * URL: /dashboard-docente
 * Nota: por colisión con `app/dashboard/page.tsx` legacy, este shell usa
 * `/dashboard-docente` mientras se cablea la migración (FASE 5/6).
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  Users,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  Flame,
  Briefcase,
  Rocket,
  Award,
  Building2,
  GraduationCap,
  BookOpen,
  Eye,
} from 'lucide-react';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  getCohortesAsignadas,
  getCohorteStats,
  type CohorteDocente,
  type CohorteStats,
} from '@/lib/docente/cohortes';
import type { ProductoId } from '@/lib/productos/types';

export const metadata: Metadata = {
  title: 'Dashboard Docente · Campus v2 | ITSEIA',
  description: 'Tus cohortes asignadas con stats en vivo.',
};

const PRODUCTO_ICONS: Record<
  ProductoId,
  { Icon: React.ComponentType<{ className?: string }>; label: string; cssVar: string }
> = {
  preuni: { Icon: Flame, label: 'Preuniversitario IGNITE', cssVar: '--producto-preuni' },
  'cursos-pro': { Icon: Briefcase, label: 'Cursos Profesionales', cssVar: '--producto-cursos-pro' },
  bootcamp: { Icon: Rocket, label: 'Bootcamp Intensivo', cssVar: '--producto-bootcamp' },
  mdt: { Icon: Award, label: 'Cursos MDT', cssVar: '--producto-mdt' },
  b2b: { Icon: Building2, label: 'Cursos B2B', cssVar: '--producto-b2b' },
  certificaciones: { Icon: BookOpen, label: 'Certificaciones', cssVar: '--producto-certificaciones' },
  carreras: { Icon: GraduationCap, label: 'Carreras 3er Nivel', cssVar: '--producto-carreras' },
  demo: { Icon: Eye, label: 'Demo', cssVar: '--producto-demo' },
};

interface CohorteConStats extends CohorteDocente {
  stats: CohorteStats;
}

export default async function DashboardDocentePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/dashboard-docente');

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name, email, role')
    .eq('id', user.id)
    .single();

  const fullName =
    (profile?.full_name as string | undefined) ??
    (profile?.email as string | undefined)?.split('@')[0] ??
    'Docente';

  const role = (profile?.role as string | undefined) ?? 'docente';

  const cohortes = await getCohortesAsignadas(user.id);

  // Cargar stats en paralelo para todas las cohortes.
  const conStats: CohorteConStats[] = await Promise.all(
    cohortes.map(async (c) => ({
      ...c,
      stats: await getCohorteStats(c.producto, c.cohorte_slug),
    }))
  );

  // Filtrar las "activas" (estado activa | planificada · NO finalizada).
  const activas = conStats.filter(
    (c) => c.estado !== 'finalizada' && c.estado !== 'cancelada'
  );

  return (
    <div className="space-y-10">
      <Header fullName={fullName} role={role} totalCohortes={activas.length} />

      {activas.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider opacity-80">
              Cohortes activas
            </h2>
            <span className="text-xs opacity-50">
              {activas.length} cohorte{activas.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {activas.map((c) => (
              <CohorteCard
                key={`${c.producto}::${c.cohorte_slug}`}
                cohorte={c}
              />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────────────────────

function Header({
  fullName,
  role,
  totalCohortes,
}: {
  fullName: string;
  role: string;
  totalCohortes: number;
}) {
  const roleLabel: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Administrador',
    coordinacion: 'Coordinación Académica',
    docente: 'Docente',
  };

  return (
    <header className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
           style={{ color: 'var(--itseia-gold)' }}>
        <Sparkles className="h-4 w-4" />
        Panel Docente · Campus v2
      </div>
      <h1 className="font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
        Hola, {fullName.split(' ')[0] ?? 'Docente'}
      </h1>
      <p className="max-w-2xl text-sm opacity-65">
        {roleLabel[role] ?? role} · {totalCohortes} cohorte
        {totalCohortes === 1 ? '' : 's'} activa{totalCohortes === 1 ? '' : 's'}.
        Selecciona una cohorte para entrar a tu vista de clase con grabación.
      </p>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Cohorte Card
// ─────────────────────────────────────────────────────────────────────────────

function CohorteCard({ cohorte }: { cohorte: CohorteConStats }) {
  const meta = PRODUCTO_ICONS[cohorte.producto];
  const Icon = meta.Icon;
  const accent = `var(${meta.cssVar})`;
  const href = `/${cohorte.producto}/${cohorte.cohorte_slug}`;

  const proxima = cohorte.stats.proxima_sesion;
  const proximaFecha = proxima?.fecha_programada
    ? new Date(proxima.fecha_programada).toLocaleDateString('es-EC', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border-2 p-6 transition-all hover:shadow-xl"
      style={{
        borderColor: 'rgba(255,255,255,0.10)',
        backgroundColor: 'rgba(255,255,255,0.02)',
      }}
    >
      {/* Glow accent */}
      <div
        className="absolute -right-6 -top-6 h-32 w-32 rounded-full blur-2xl transition-all group-hover:scale-110"
        style={{ backgroundColor: accent, opacity: 0.18 }}
      />

      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: accent,
            }}
          >
            <Icon className="h-3 w-3" />
            {meta.label}
          </span>
          <ArrowRight
            className="h-4 w-4 transition-all group-hover:translate-x-1"
            style={{ color: 'rgba(255,255,255,0.40)' }}
          />
        </div>

        <div>
          <h3 className="text-xl font-bold leading-tight">
            {cohorte.nombre_publico}
          </h3>
          {cohorte.cliente_referencia && (
            <p className="mt-1 text-xs opacity-60">
              Cliente: {cohorte.cliente_referencia}
            </p>
          )}
          {cohorte.fecha_inicio && (
            <p className="mt-2 flex items-center gap-1.5 text-sm opacity-70">
              <Calendar className="h-3.5 w-3.5" />
              Arranca{' '}
              {new Date(cohorte.fecha_inicio).toLocaleDateString('es-EC', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 border-t pt-4"
             style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Stat
            icon={<Users className="h-3.5 w-3.5" />}
            value={cohorte.stats.alumnos_total}
            label="alumnos"
          />
          <Stat
            icon={<PlayCircle className="h-3.5 w-3.5" />}
            value={cohorte.stats.sesiones_programadas}
            label="próximas"
          />
          <Stat
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            value={cohorte.stats.sesiones_completadas}
            label="completadas"
          />
        </div>

        {proxima && (
          <div
            className="rounded-lg border px-3 py-2 text-xs"
            style={{
              borderColor: 'rgba(255,255,255,0.10)',
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            <div className="text-[10px] uppercase tracking-wider opacity-50">
              Próxima sesión
            </div>
            <div className="mt-0.5 font-semibold">
              #{proxima.numero} · {proxima.titulo}
            </div>
            {proximaFecha && (
              <div className="opacity-70">{proximaFecha} EC</div>
            )}
          </div>
        )}

        <div className="pt-1">
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:underline"
            style={{ color: 'var(--itseia-gold)' }}
          >
            Ir a la cohorte
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <div
      className="rounded-lg border px-2 py-2"
      style={{
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.03)',
      }}
    >
      <div className="flex items-center gap-1 opacity-60">{icon}</div>
      <div className="mt-0.5 font-heading text-lg font-extrabold">{value}</div>
      <div className="text-[9px] uppercase tracking-wider opacity-50">
        {label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty / Footer
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="rounded-2xl border border-dashed p-10 text-center"
      style={{
        borderColor: 'rgba(255,255,255,0.20)',
        backgroundColor: 'rgba(255,255,255,0.02)',
      }}
    >
      <Sparkles className="mx-auto h-10 w-10 opacity-30" />
      <p className="mt-4 text-sm font-semibold opacity-80">
        Aún no tienes cohortes asignadas.
      </p>
      <p className="mx-auto mt-2 max-w-md text-xs opacity-50">
        Pídele a Coordinación Académica que te asigne una cohorte de
        Preuniversitario, un curso profesional o una materia de carrera.
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t pt-8" style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
      <p className="text-center text-[11px] opacity-40">
        ITSEIA Academy · Campus v2 · Shell Docente unificado (Opción B)
      </p>
    </footer>
  );
}
