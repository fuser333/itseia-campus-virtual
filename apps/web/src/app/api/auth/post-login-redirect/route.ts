/**
 * Endpoint API · Post-login redirect resolver · Campus v2 · FASE 5.
 *
 * El cliente llama a este endpoint DESPUÉS de autenticarse correctamente.
 * Devuelve la URL a la que debe ir el usuario según su `profiles.role` y
 * (para estudiantes) sus enrollments activos.
 *
 * Flujo:
 *   1. Verifica sesión activa (sino → /login).
 *   2. Lee profiles.role como ÚNICA fuente de verdad (FIX 30 may 2026).
 *   3. Si role ∈ {super_admin, admin, coordinacion} → /admin (legacy compat)
 *   4. Si role = docente                            → /docente
 *   5. Si role = estudiante:
 *      - 1 enrollment activo en preuni       → /preuni
 *      - 1 enrollment activo en cursos-pro   → /cursos-pro/c/<slug>
 *      - 1 enrollment activo en otro v2      → /<producto>
 *      - 2+ enrollments activos              → /dashboard (legacy hub)
 *      - 0 enrollments activos               → /dashboard (legacy hub)
 *
 * NOTA: Las rutas /<producto> del campus v2 viven bajo (alumno)/[producto] y
 * coexisten con las rutas legacy del mismo nombre (/preuni, /cursos-pro, etc.).
 * En Next.js 15, las rutas estáticas legacy ganan sobre el [producto] dinámico,
 * por lo que enviar a `/preuni` seguirá renderizando el preuni legacy hasta
 * que FASE 6 migre los directorios. El producto `mdt` no tiene legacy → ya
 * renderiza la v2.
 *
 * GET /api/auth/post-login-redirect → { url: string, reason: string }
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getEnrollmentsAlumno } from '@/lib/alumno/enrollments';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ url: '/login', reason: 'no-session' }, { status: 200 });
  }

  // ── Role (única fuente de verdad: profiles.role) ────────────────────────
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';

  if (['super_admin', 'admin', 'coordinacion'].includes(role)) {
    return NextResponse.json({ url: '/admin', reason: `role:${role}` });
  }
  if (role === 'docente') {
    return NextResponse.json({ url: '/docente', reason: 'role:docente' });
  }

  // ── Estudiante: derivar destino del/los enrollment(s) ────────────────────
  const enrollments = await getEnrollmentsAlumno(user.id);

  if (enrollments.length === 0) {
    return NextResponse.json({ url: '/dashboard', reason: 'student-no-enrollment' });
  }

  if (enrollments.length > 1) {
    return NextResponse.json({ url: '/dashboard', reason: 'student-multi-enrollment' });
  }

  // Único enrollment: rutear al producto correspondiente.
  const e = enrollments[0];
  // Para cursos-pro la ruta natural del alumno es el detalle del curso.
  if (e.producto === 'cursos-pro') {
    return NextResponse.json({
      url: `/cursos-pro/c/${e.cohorte_slug}`,
      reason: 'student-single-cursos-pro',
    });
  }

  return NextResponse.json({
    url: `/${e.producto}`,
    reason: `student-single-${e.producto}`,
  });
}
