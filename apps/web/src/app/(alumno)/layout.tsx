/**
 * Shell del Alumno · Campus v2 (Opción B).
 *
 * Server Component. Hace tres cosas:
 *  1. Verifica sesión activa (sino → /login).
 *  2. Lee `profiles.role` (única fuente de verdad — FIX 30 may 2026).
 *     Si NO es estudiante → redirect a la landing de su rol.
 *  3. Carga sus enrollments activos (al menos uno) y renderiza el sidebar.
 *
 * Las rutas hijas (`[producto]/...`) hacen sus propias verificaciones
 * de enrollment por producto.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getEnrollmentsAlumno } from '@/lib/alumno/enrollments';
import AlumnoSidebar from '@/components/alumno/AlumnoSidebar';

const ESTUDIANTE_ROLES = new Set(['estudiante', 'alumno', 'student']);

export default async function AlumnoShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/preuni');
  }

  // ── Fuente única: profiles.role ──────────────────────────────────────────
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';

  // Si es admin/super_admin/coordinacion → redirect a /admin
  if (['super_admin', 'admin', 'coordinacion'].includes(role)) {
    redirect('/admin');
  }
  // Si es docente puro → redirect a /docente
  if (role === 'docente') {
    redirect('/docente');
  }
  // Solo estudiantes (o role sin setear, tratado como estudiante) llegan acá
  if (!ESTUDIANTE_ROLES.has(role)) {
    // Role desconocido: por seguridad, mandar al dashboard genérico
    redirect('/dashboard');
  }

  // ── Cargar enrollments activos ───────────────────────────────────────────
  const enrollments = await getEnrollmentsAlumno(user.id);

  const fullName =
    (profile?.full_name as string | undefined) ??
    (profile?.email as string | undefined)?.split('@')[0] ??
    'Alumno';

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: 'var(--itseia-navy-dark)',
        color: 'var(--itseia-text)',
      }}
    >
      <AlumnoSidebar
        userName={fullName}
        userEmail={user.email ?? undefined}
        enrollments={enrollments.map((e) => ({
          producto: e.producto,
          cohorte_slug: e.cohorte_slug,
          nombre_cohorte: e.nombre_cohorte,
        }))}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
