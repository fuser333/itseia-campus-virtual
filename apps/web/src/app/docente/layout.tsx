import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

const ALLOWED_ROLES = new Set([
  "super_admin",
  "admin",
  "coordinacion",
  "docente",
]);

/**
 * Layout maestro del panel docente unificado /docente.
 *
 * - Bloquea acceso a no autenticados → /login?module=docentes&redirect=/docente
 * - Bloquea acceso a roles no docentes → /dashboard
 * - profiles.role es la única fuente de verdad (regla blindada 30 may 2026).
 */
export default async function DocenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/login?module=docentes&redirect=/docente");
  }

  // Usamos supabaseAdmin para evitar el riesgo de RLS recursion en profiles
  // detectado el 30 may 2026 (migration 016).
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || !ALLOWED_ROLES.has(profile.role as string)) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#070E1A] via-[#0A1628] to-[#1F2F58] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-12">
        {children}
      </div>
    </main>
  );
}
