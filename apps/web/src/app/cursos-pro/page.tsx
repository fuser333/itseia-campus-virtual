/**
 * Dashboard de Cursos Profesionales · Campus v2 (unificado).
 *
 * Estructura IDÉNTICA al dashboard del route group (alumno)/[producto]/page.tsx:
 *   · Hero con saludo personalizado
 *   · Card grande del curso activo (nombre, fecha inicio, CTA "Ir a mis sesiones")
 *   · Stats: sesiones totales / completadas / pendientes
 *   · AI Lab acceso rápido (3 cards)
 *
 * Lee data de cursos_pro_enrollments + cursos_pro_courses + cursos_pro_sessions
 * (BD legacy) sin tocar la BD — solo UI.
 *
 * FIX 04-jun-2026: reemplazo total de dashboard legacy (crema + hardcoded Steveen)
 * por dashboard Campus v2 con fondo navy-dark y accent gold (#FBBC0C).
 */

import { redirect } from 'next/navigation';
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
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cursos Profesionales | ITSEIA Campus',
  description: 'Dashboard de tu curso profesional ITSEIA.',
};

// ─── Tipos internos ──────────────────────────────────────────────────────────

interface CursoActivo {
  slug: string;
  name: string;
  subtitle: string | null;
  start_date: string | null;
  end_date: string | null;
  total_sessions: number;
  total_hours: number;
  price_usd: number;
  cohorte_slug: string;
  nombre_cohorte: string;
}

interface SesionResumen {
  id: string;
  num: number;
  status: string;
  scheduled_at: string | null;
  title: string;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CursosProDashboardPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect('/login?module=cursos-pro');
  }

  // Perfil para nombre de bienvenida
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single();

  const fullName =
    (profile?.full_name as string | undefined) ??
    (profile?.email as string | undefined)?.split('@')[0] ??
    'Estudiante';
  const primerNombre = fullName.split(' ')[0] || fullName;

  // ── Curso activo del alumno (el más reciente) ──────────────────────────────
  let cursoActivo: CursoActivo | null = null;
  let sesiones: SesionResumen[] = [];

  try {
    type EnrollRow = {
      id: string;
      enrolled_at: string | null;
      cursos_pro_courses:
        | {
            id: string;
            slug: string;
            name: string;
            subtitle: string | null;
            start_date: string | null;
            end_date: string | null;
            total_sessions: number;
            total_hours: number;
            price_usd: number;
          }
        | null;
    };

    const { data: enrollRows } = await supabaseAdmin
      .from('cursos_pro_enrollments')
      .select(
        'id, enrolled_at, cursos_pro_courses!inner(id, slug, name, subtitle, start_date, end_date, total_sessions, total_hours, price_usd, is_active)'
      )
      .eq('profile_id', user.id)
      .eq('status', 'active')
      .order('enrolled_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const row = enrollRows as unknown as EnrollRow | null;
    if (row?.cursos_pro_courses) {
      const c = row.cursos_pro_courses;

      // Intentar leer nombre de cohorte de cohorte_metadata
      const { data: cohorteRow } = await supabaseAdmin
        .from('cohorte_metadata')
        .select('nombre_publico, cohorte_slug')
        .eq('producto', 'cursos-pro')
        .eq('cohorte_slug', c.slug)
        .maybeSingle();

      cursoActivo = {
        slug: c.slug,
        name: c.name,
        subtitle: c.subtitle,
        start_date: c.start_date,
        end_date: c.end_date,
        total_sessions: c.total_sessions,
        total_hours: c.total_hours,
        price_usd: c.price_usd,
        cohorte_slug: c.slug,
        nombre_cohorte:
          (cohorteRow?.nombre_publico as string | null) ?? c.name,
      };

      // Sesiones del curso para calcular progreso
      const { data: sesionesRows } = await supabaseAdmin
        .from('cursos_pro_sessions')
        .select('id, num, status, scheduled_at, title')
        .eq('course_id', c.id)
        .order('num', { ascending: true });

      sesiones = (sesionesRows ?? []).map((s) => ({
        id: s.id as string,
        num: s.num as number,
        status: (s.status as string) ?? 'scheduled',
        scheduled_at: s.scheduled_at as string | null,
        title: s.title as string,
      }));
    }
  } catch {
    // Si la tabla aún no tiene datos para este usuario, mostramos estado vacío
    cursoActivo = null;
    sesiones = [];
  }

  // ── Calcular stats ─────────────────────────────────────────────────────────
  const total = cursoActivo?.total_sessions ?? sesiones.length;
  const completadas = sesiones.filter((s) => s.status === 'done').length;
  const pendientes = Math.max(0, total - completadas);

  // Próxima sesión
  const proxima =
    sesiones.find((s) => s.status === 'live') ??
    sesiones
      .filter((s) => s.status === 'scheduled' && s.scheduled_at)
      .sort((a, b) =>
        (a.scheduled_at ?? '').localeCompare(b.scheduled_at ?? '')
      )[0] ??
    null;

  const accentVar = 'var(--producto-cursos-pro)';

  return (
    <div className="space-y-8">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section>
        <div className="mb-1 text-sm uppercase tracking-wider opacity-60">
          🎓 Cursos Profesionales
        </div>
        <h1
          className="font-heading text-3xl font-bold sm:text-4xl"
          style={{ color: accentVar }}
        >
          Hola, {primerNombre}
        </h1>
        <p className="mt-2 max-w-2xl text-base opacity-80">
          40 a 80 horas de formación intensiva · 3 niveles según profundidad.
        </p>
      </section>

      {/* ── Card grande del curso activo ──────────────────────────────────── */}
      {cursoActivo ? (
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
                Tu curso activo
              </div>
              <h2 className="font-heading text-2xl font-bold">
                {cursoActivo.nombre_cohorte}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm opacity-80">
                {cursoActivo.start_date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Inicio:{' '}
                    {new Date(cursoActivo.start_date).toLocaleDateString(
                      'es-EC',
                      {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </span>
                )}
                {proxima && (
                  <span className="flex items-center gap-1.5">
                    <Play className="h-4 w-4" />
                    Próxima: #{proxima.num} — {proxima.title}
                  </span>
                )}
              </div>
            </div>

            <Link
              href={`/cursos-pro/c/${cursoActivo.cohorte_slug}`}
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
      ) : (
        /* Estado vacío: no tiene ningún curso activo */
        <section
          className="rounded-2xl border p-6 lg:p-8 text-center opacity-70"
          style={{
            backgroundColor: 'var(--itseia-navy)',
            borderColor: 'var(--sidebar-border)',
          }}
        >
          <p className="text-base font-semibold">
            Aún no tienes un curso activo.
          </p>
          <p className="mt-1 text-sm opacity-70">
            Contacta a soporte por WhatsApp para inscribirte.
          </p>
          <a
            href="https://wa.me/593959892034?text=Hola%2C%20quiero%20inscribirme%20a%20un%20Curso%20Profesional%20ITSEIA"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: accentVar,
              color: 'var(--itseia-navy-dark)',
            }}
          >
            Contactar por WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
        </section>
      )}

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Sesiones totales" value={total} />
        <StatCard
          label="Completadas"
          value={completadas}
          accentVar={accentVar}
        />
        <StatCard label="Pendientes" value={pendientes} />
      </section>

      {/* ── AI Lab acceso rápido ──────────────────────────────────────────── */}
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
    </div>
  );
}

// ─── Subcomponentes (mismos que (alumno)/[producto]/page.tsx) ─────────────────

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
      <div className="text-xs uppercase tracking-wider opacity-60">
        {label}
      </div>
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
