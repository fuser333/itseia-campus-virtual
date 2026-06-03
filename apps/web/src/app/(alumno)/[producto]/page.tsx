/**
 * Dashboard del producto · Vista Alumno · Campus v2 (Opción B).
 *
 * Server Component. Lee la config YAML del producto (`getProducto`), verifica
 * que el alumno tenga enrollment activo en este producto, y muestra:
 *  · Hero con saludo personalizado.
 *  · Card grande de la cohorte activa (nombre, fecha, próxima sesión, CTA).
 *  · Stats: sesiones totales / completadas / pendientes.
 *  · Bloque rápido AI Lab (3 accesos directos).
 */

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Sparkles,
  Zap,
  Brain,
  ArrowRight,
  Play,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getProductoSafe } from '@/lib/productos/loader';
import { getEnrollmentDelProducto } from '@/lib/alumno/enrollments';
import { getCohorte, getSesionesCohorte } from '@/lib/alumno/sesiones';
import type { ProductoId } from '@/lib/productos/types';

interface PageProps {
  params: Promise<{ producto: string }>;
}

export default async function AlumnoProductoDashboardPage({ params }: PageProps) {
  const { producto: productoParam } = await params;

  // ── Validar producto desde YAML ─────────────────────────────────────────
  const cfg = getProductoSafe(productoParam);
  if (!cfg) notFound();
  const productoId = cfg.producto.id as ProductoId;

  // ── Validar sesión + enrollment ─────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/${productoId}`);

  const enrollment = await getEnrollmentDelProducto(user.id, productoId);
  if (!enrollment) {
    // No tiene enrollment en este producto → mandarlo a su dashboard real
    redirect('/dashboard');
  }

  // ── Cargar datos de la cohorte ──────────────────────────────────────────
  const cohorte = await getCohorte(productoId, enrollment.cohorte_slug);
  const sesiones = await getSesionesCohorte(productoId, enrollment.cohorte_slug);

  const total = sesiones.length || cfg.cohorte.sesiones_totales;
  const completadas = sesiones.filter((s) => s.status === 'done').length;
  const pendientes = Math.max(0, total - completadas);

  // Próxima sesión (la primera scheduled/live por fecha)
  const proxima =
    sesiones.find((s) => s.status === 'live') ??
    sesiones
      .filter((s) => s.status === 'scheduled' && s.fecha_programada)
      .sort((a, b) =>
        (a.fecha_programada ?? '').localeCompare(b.fecha_programada ?? '')
      )[0] ??
    null;

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single();

  const primerNombre =
    ((profile?.full_name as string | undefined) ?? '').split(' ')[0] ||
    (profile?.email as string | undefined)?.split('@')[0] ||
    'Alumno';

  const accentVar = `var(--producto-${productoId})`;

  return (
    <div className="space-y-8">
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-1 text-sm uppercase tracking-wider opacity-60">
          {cfg.producto.icono} {cfg.producto.nombre}
        </div>
        <h1
          className="font-heading text-3xl font-bold sm:text-4xl"
          style={{ color: accentVar }}
        >
          Hola, {primerNombre}
        </h1>
        <p className="mt-2 max-w-2xl text-base opacity-80">
          {cfg.producto.descripcion ?? cfg.producto.nombre}
        </p>
      </section>

      {/* ── Card grande de cohorte ─────────────────────────────────── */}
      <section
        className="rounded-2xl border p-6 lg:p-8"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
          borderLeft: `4px solid ${accentVar}`,
        }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider opacity-60">
              Tu cohorte
            </div>
            <h2 className="font-heading text-2xl font-bold">
              {cohorte?.nombre_publico ?? enrollment.nombre_cohorte}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm opacity-80">
              {cohorte?.fecha_inicio && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Inicio:{' '}
                  {new Date(cohorte.fecha_inicio).toLocaleDateString('es-EC', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              )}
              {proxima && (
                <span className="flex items-center gap-1.5">
                  <Play className="h-4 w-4" />
                  Próxima sesión: #{proxima.numero} — {proxima.titulo}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/${productoId}/c/${enrollment.cohorte_slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: accentVar,
              color: 'var(--itseia-navy-dark)',
            }}
          >
            Ir a mis sesiones
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Sesiones totales" value={total} />
        <StatCard label="Completadas" value={completadas} accentVar={accentVar} />
        <StatCard label="Pendientes" value={pendientes} />
      </section>

      {/* ── AI Lab acceso rápido ───────────────────────────────────── */}
      {cfg.alumno.ai_lab && (
        <section>
          <div className="mb-3 text-xs uppercase tracking-wider opacity-60">
            AI Lab — siempre disponible
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <AILabCard
              icon={Sparkles}
              title="Tutor IA"
              desc="Pregúntale lo que necesites"
              href="/ai-lab"
            />
            <AILabCard
              icon={Zap}
              title="Flash Cards"
              desc="Repaso rápido inteligente"
              href="/flashcards"
            />
            <AILabCard
              icon={Brain}
              title="Segundo Cerebro"
              desc="Tu biblioteca con IA"
              href="/biblioteca"
            />
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accentVar,
}: {
  label: string;
  value: number;
  accentVar?: string;
}) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        backgroundColor: 'var(--itseia-navy)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      <div className="text-xs uppercase tracking-wider opacity-60">{label}</div>
      <div
        className="mt-1 font-heading text-3xl font-bold"
        style={accentVar ? { color: accentVar } : undefined}
      >
        {value}
      </div>
    </div>
  );
}

function AILabCard({
  icon: Icon,
  title,
  desc,
  href,
}: {
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border p-4 transition hover:border-white/20 hover:bg-white/[0.02]"
      style={{
        backgroundColor: 'var(--itseia-navy)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      <div className="flex items-center gap-2">
        <Icon
          className="h-5 w-5 transition group-hover:scale-110"
          style={{ color: 'var(--itseia-gold)' }}
        />
        <div className="font-semibold">{title}</div>
      </div>
      <div className="mt-1 text-sm opacity-70">{desc}</div>
    </Link>
  );
}
