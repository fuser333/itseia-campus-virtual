/**
 * Layout `/docente/preuni/*` — monta el sidebar lateral docente con
 * basePath="/docente/preuni". Reusa el mismo `DocentesSidebar` que /teacher
 * para que toda la navegación sea idéntica visualmente.
 *
 * El guard de role ya lo hace el layout padre `src/app/docente/layout.tsx`.
 * Aquí solo necesitamos pasar nombre/role al sidebar.
 */

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import DocentesSidebar from "@/components/layout/DocentesSidebar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function DocentePreuniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  let userName = "Docente";
  let userRole = "docente";
  if (user) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();
    if (profile?.full_name) userName = profile.full_name as string;
    if (profile?.role) userRole = profile.role as string;
  }

  return (
    <div className="flex min-h-screen bg-[#0A1628] text-white">
      <DocentesSidebar
        userName={userName}
        userRole={userRole}
        basePath="/docente/preuni"
      />
      <div className="flex-1 flex flex-col">
        {/* Top bar con botón volver al hub */}
        <header className="h-14 flex items-center justify-between border-b border-white/10 bg-[#0D1B30] px-6 flex-shrink-0">
          <Link
            href="/docente"
            className="inline-flex items-center gap-2 rounded-full bg-[#FBBC0C]/15 border border-[#FBBC0C]/30 px-3 py-1.5 text-xs font-semibold text-[#FBBC0C] hover:bg-[#FBBC0C]/25 transition"
          >
            <ArrowLeft className="size-3.5" />
            Volver al Panel Docente
          </Link>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
              Preuniversitario IGNITE
            </span>
            <Link
              href="/cursos-pro/docente"
              className="px-2 py-1 rounded-full bg-white/5 border border-white/10 hover:border-white/30"
            >
              Cursos Profesionales →
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#070E1A] via-[#0A1628] to-[#1F2F58]">
          <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
