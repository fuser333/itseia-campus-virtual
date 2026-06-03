/**
 * Endpoint API · Post-login redirect resolver · Campus v2.
 *
 * El cliente llama a este endpoint DESPUÉS de autenticarse correctamente.
 * Devuelve la URL a la que debe ir el usuario según su `profiles.role` y
 * (para estudiantes) su enrollment activo más reciente.
 *
 * Flujo:
 *   1. Verifica sesión activa (sino → /login).
 *   2. Lee profiles.role.
 *   3. Si role ∈ {super_admin, admin, coordinacion} → /admin
 *   4. Si role = docente                            → /docente
 *   5. Si role = estudiante:
 *      - Si tiene enrollment activo en producto v2 → /<producto> (v2 shell)
 *      - Sino → /dashboard (legacy fallback)
 *
 * NOTA: Las rutas /<producto> del campus v2 viven bajo (alumno)/[producto] y
 * coexisten con las rutas legacy del mismo nombre (/preuni, /cursos-pro, etc.).
 * En Next.js 15, las rutas estáticas legacy ganan sobre el [producto] dinámico,
 * por lo que enviar a `/preuni` seguirá renderizando el preuni legacy hasta
 * que FASE 6 migre los directorios. El producto `mdt` no tiene legacy → ya
 * renderiza la v2.
 *
 * GET /api/auth/post-login-redirect → { url: string }
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getEnrollmentPrincipal } from '@/lib/alumno/enrollments';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ url: '/login' }, { status: 200 });
  }

  // ── Role (única fuente de verdad: profiles.role) ────────────────────────
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';

  if (['super_admin', 'admin', 'coordinacion'].includes(role)) {
    return NextResponse.json({ url: '/admin' });
  }
  if (role === 'docente') {
    return NextResponse.json({ url: '/docente' });
  }

  // ── Estudiante: derivar producto del enrollment principal ───────────────
  const enrollment = await getEnrollmentPrincipal(user.id);
  if (enrollment) {
    return NextResponse.json({ url: `/${enrollment.producto}` });
  }

  // Fallback: dashboard legacy
  return NextResponse.json({ url: '/dashboard' });
}
