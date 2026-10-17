/**
 * Shell del Admin · Campus v2 (Opción B · FASE 4).
 *
 * Server Component. Hace tres cosas:
 *  1. Verifica sesión activa (sino → /login).
 *  2. Lee `profiles.role` (única fuente de verdad — FIX 30 may 2026).
 *     Solo `admin`, `super_admin` y `coordinacion` pasan; el resto cae a su
 *     shell correspondiente.
 *  3. Renderiza el AdminSidebar + un botón flotante "Cambiar a Docente" para
 *     super_admin/admin.
 *
 * IMPORTANTE: Este shell vive en route group `(admin)` y NO sirve `/admin`
 * todavía. Esa URL la sigue sirviendo `app/admin/` (legacy). Las URLs nuevas
 * que viven acá durante FASE 4 son:
 *   · /panel-admin          (dashboard nuevo · sandbox)
 *   · /mdt                  (sandbox sin colisión)
 *   · /mdt/<cohorte>        (vista cohorte admin)
 *
 * Para `preuni`, `cursos-pro`, etc. las rutas estáticas legacy ganan. FASE 5
 * cablea el routing completo.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import AdminSidebar from '@/components/admin/AdminSidebar';
import SwitchToDocente from '@/components/admin/SwitchToDocente';

const ADMIN_ROLES = new Set(['admin', 'super_admin', 'coordinacion']);

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?module=admin&redirect=/panel-admin');
  }

  // ── Fuente única: profiles.role ──────────────────────────────────────────
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';

  if (!ADMIN_ROLES.has(role)) {
    // Docentes puros → /dashboard-docente · alumnos → /dashboard
    if (role === 'docente') redirect('/dashboard-docente');
    redirect('/dashboard');
  }

  const fullName =
    (profile?.full_name as string | undefined) ??
    (profile?.email as string | undefined)?.split('@')[0] ??
    'Admin';

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: 'var(--itseia-navy-dark)',
        color: 'var(--itseia-text)',
      }}
    >
      <AdminSidebar
        userName={fullName}
        userEmail={user.email ?? undefined}
        role={role}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>
      <SwitchToDocente role={role} />
    </div>
  );
}
