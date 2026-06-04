/**
 * Shell del Docente · Campus v2 (Opción B · FASE 3).
 *
 * Server Component. Hace tres cosas:
 *  1. Verifica sesión activa (sino → /login).
 *  2. Lee `profiles.role` (única fuente de verdad — FIX 30 may 2026).
 *     Solo `docente`, `admin`, `super_admin`, `coordinacion` ven este shell.
 *  3. Carga las cohortes asignadas del docente y renderiza el sidebar árbol.
 *
 * IMPORTANTE: Este shell vive en route group `(docente)` y aún NO está
 * cableado en producción. FASE 5 movió las rutas dinámicas a
 * `(docente)/docente-shell/[producto]/...` para evitar conflicto con
 * `(alumno)/[producto]/...` (Next 15 no admite dos route groups paralelos
 * con la misma raíz dinámica). Las URLs reales sandbox son:
 *   /dashboard-docente
 *   /docente-shell/mdt
 *   /docente-shell/mdt/<cohorte>
 *   /docente-shell/mdt/<cohorte>/sesion/<num>
 * Los URLs legacy `/teacher` y `/docente/preuni/...` siguen vivos en FASE 6.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getCohortesAsignadas } from '@/lib/docente/cohortes';
import DocenteSidebar, {
  type CohorteAsignadaSidebar,
} from '@/components/docente/DocenteSidebar';

const DOCENTE_ROLES = new Set([
  'docente',
  'admin',
  'super_admin',
  'coordinacion',
]);

export default async function DocenteShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?module=docentes&redirect=/dashboard-docente');
  }

  // ── Fuente única: profiles.role ──────────────────────────────────────────
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? 'estudiante';

  if (!DOCENTE_ROLES.has(role)) {
    // Alumnos NO entran al shell docente.
    redirect('/dashboard');
  }

  // ── Cargar cohortes asignadas ─────────────────────────────────────────────
  // Para admin/super_admin/coordinacion sin assignments propios igual ven el
  // sidebar (vacío); su entrada principal sigue siendo /admin.
  const cohortesFull = await getCohortesAsignadas(user.id);
  const cohortesForSidebar: CohorteAsignadaSidebar[] = cohortesFull.map((c) => ({
    producto: c.producto,
    cohorte_slug: c.cohorte_slug,
    nombre_publico: c.nombre_publico,
    estado: c.estado,
    rol_en_cohorte: c.rol_en_cohorte,
  }));

  const fullName =
    (profile?.full_name as string | undefined) ??
    (profile?.email as string | undefined)?.split('@')[0] ??
    'Docente';

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundColor: 'var(--itseia-navy-dark)',
        color: 'var(--itseia-text)',
      }}
    >
      <DocenteSidebar
        userName={fullName}
        userEmail={user.email ?? undefined}
        role={role}
        cohortes={cohortesForSidebar}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
