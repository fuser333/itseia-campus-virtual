// LEGACY · pendiente de remover post FASE 8
// Reemplazado por shell unificado en src/app/(docente)/* (FASE 3 Campus v2).
// Se mantiene vivo porque Héctor lo usa para dar clase del preuni en producción
// (/teacher/materias/[subject_id]/sesion/[n]). NO BORRAR hasta migrar las clases
// en vivo de la cohorte preuni-jun-2026 al shell nuevo.
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DocentesSidebar from "@/components/layout/DocentesSidebar";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const allowedRoles = ["super_admin", "admin", "coordinacion", "docente"];
  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#070E1A]">
      <DocentesSidebar
        userName={profile.full_name ?? undefined}
        userRole={profile.role}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#070E1A] via-[#0A1628] to-[#1F2F58] text-white">
        {/* Barra superior sticky · botón Volver al Panel Docente unificado */}
        <div className="sticky top-0 z-30 border-b border-[#FBBC0C]/25 bg-[#0A1628]/95 backdrop-blur-sm px-6 py-3 lg:px-8">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
            <Link
              href="/docente"
              className="inline-flex items-center gap-2 rounded-lg border border-[#FBBC0C]/40 bg-[#FBBC0C]/10 px-4 py-2 text-sm font-bold text-[#FBBC0C] hover:bg-[#FBBC0C]/20 hover:border-[#FBBC0C] transition-all"
            >
              <ArrowLeft className="size-4" />
              Volver al Panel Docente
            </Link>
            <div className="hidden sm:flex items-center gap-3 text-xs text-white/50">
              <Link
                href="/docente/preuni"
                className="hover:text-[#FBBC0C] transition-colors"
              >
                Preuni IGNITE
              </Link>
              <span className="text-white/20">·</span>
              <Link
                href="/cursos-pro/docente"
                className="hover:text-[#FBBC0C] transition-colors"
              >
                Cursos Pro
              </Link>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
