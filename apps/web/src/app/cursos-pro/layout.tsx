/**
 * Layout de Cursos Profesionales · Campus v2 (unificado).
 *
 * Reemplaza CursosProSidebar legacy por AlumnoSidebar del Campus v2,
 * mapeando el enrollment de cursos_pro_enrollments al formato que espera
 * el sidebar ({producto, cohorte_slug, nombre_cohorte}).
 *
 * FIX 04-jun-2026: fondo main = var(--itseia-navy-dark), texto = var(--itseia-text).
 * Antes era #F9F6E7 (crema) que difería visualmente del preuni.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getEnrollmentsAlumno } from '@/lib/alumno/enrollments';
import AlumnoSidebar from '@/components/alumno/AlumnoSidebar';

export default async function CursosProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect('/login?module=cursos-pro');
  }

  // Leer perfil para nombre y email (mismo patrón que AlumnoShellLayout).
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';

  // Redirects de rol no-estudiante (consistencia con (alumno)/layout.tsx).
  if (['super_admin', 'admin', 'coordinacion'].includes(role)) {
    redirect('/admin');
  }
  if (role === 'docente') {
    redirect('/docente');
  }

  const fullName =
    (profile?.full_name as string | undefined) ??
    (profile?.email as string | undefined)?.split('@')[0] ??
    'Estudiante';

  // Cargar TODOS los enrollments activos del alumno (incluye cursos-pro).
  // getEnrollmentsAlumno ya hace el join con cursos_pro_enrollments
  // y mapea cohorte_slug = course.slug, nombre_cohorte = course.name.
  const enrollments = await getEnrollmentsAlumno(user.id);

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
