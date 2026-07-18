/**
 * Mi Progreso · Cursos Profesionales · Campus v2 (unificado).
 *
 * Mismo look que src/app/(alumno)/[producto]/progreso/page.tsx.
 * Lee sesiones de cursos_pro_sessions + cursos_pro_session_progress
 * para calcular el porcentaje de avance.
 *
 * FIX 04-jun-2026: página nueva — antes no existía en la ruta legacy.
 */

import { redirect } from 'next/navigation';
import { TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Progreso | Cursos Profesionales ITSEIA',
  description: 'Avance en tu curso profesional ITSEIA.',
};

export default async function CursosProProgresoPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect('/login?module=cursos-pro&next=/cursos-pro/progreso');
  }

  const accentVar = 'var(--producto-cursos-pro)';

  // ── Obtener el enrollment activo más reciente ──────────────────────────────
  let total = 0;
  let done = 0;
  let courseName = 'Cursos Profesionales';

  try {
    type EnrollRow = {
      id: string;
      cursos_pro_courses: {
        id: string;
        name: string;
        total_sessions: number;
      } | null;
    };

    const { data: enrollRow } = await supabaseAdmin
      .from('cursos_pro_enrollments')
      .select(
        'id, cursos_pro_courses!inner(id, name, total_sessions, is_active)'
      )
      .eq('profile_id', user.id)
      .eq('status', 'active')
      .order('enrolled_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const row = enrollRow as unknown as EnrollRow | null;
    if (row?.cursos_pro_courses) {
      const c = row.cursos_pro_courses;
      courseName = c.name;
      total = c.total_sessions;

      // Sesiones completadas (cursos_pro_session_progress con completed_at != null)
      const { data: progressRows } = await supabaseAdmin
        .from('cursos_pro_session_progress')
        .select('session_id, completed_at')
        .eq('enrollment_id', row.id)
        .not('completed_at', 'is', null);

      done = (progressRows ?? []).length;

      // Si total_sessions no está seteado en BD, contar desde sesiones reales
      if (total === 0) {
        const { count } = await supabaseAdmin
          .from('cursos_pro_sessions')
          .select('id', { count: 'exact', head: true })
          .eq('course_id', c.id);
        total = count ?? 0;
      }
    }
  } catch {
    total = 0;
    done = 0;
  }

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs uppercase tracking-wider opacity-60">
          Cursos Profesionales
        </div>
        <h1 className="font-heading text-3xl font-bold">Mi progreso</h1>
      </header>

      <section
        className="rounded-2xl border p-6"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" style={{ color: accentVar }} />
            <div className="font-semibold">{courseName}</div>
          </div>
          <div
            className="font-heading text-2xl font-bold"
            style={{ color: accentVar }}
          >
            {pct}%
          </div>
        </div>

        <div
          className="mt-4 h-3 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="h-full transition-all"
            style={{
              width: `${pct}%`,
              backgroundColor: accentVar,
            }}
          />
        </div>

        <div className="mt-3 text-sm opacity-70">
          {done} de {total} sesiones completadas
        </div>
      </section>

      <section
        className="rounded-xl border p-6 text-sm opacity-70"
        style={{
          backgroundColor: 'var(--itseia-navy)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        Métricas detalladas (asistencia, calificación promedio, badges) se
        habilitarán en una próxima fase del Campus v2.
      </section>
    </div>
  );
}
