import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import CursosProSidebar from "./CursosProSidebar";

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
    redirect("/login");
  }

  // Fetch profile server-side (bypasses RLS) to hydrate sidebar
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const fullName  = profile?.full_name ?? user.email?.split("@")[0] ?? "Estudiante";
  const email     = profile?.email ?? user.email ?? "";
  const initials  = fullName
    .split(" ")
    .map((n: string) => n[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Fetch curso activo del usuario (primer enrollment activo más reciente)
  // para hidratar dinámicamente la sección "MI PROGRAMA" del sidebar.
  // Si no hay enrollment activo, el sidebar oculta esa sección.
  const { data: activeEnroll } = await supabaseAdmin
    .from("cursos_pro_enrollments")
    .select(`
      cursos_pro_courses!inner (
        slug,
        name,
        cursos_pro_modules ( num, name )
      )
    `)
    .eq("profile_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const course: any = (activeEnroll as any)?.cursos_pro_courses ?? null;
  const activeCourse = course
    ? {
        slug: course.slug as string,
        name: course.name as string,
        modules: ((course.cursos_pro_modules ?? []) as Array<{ num: number; name: string }>)
          .sort((a, b) => a.num - b.num)
          .map((m) => ({ num: m.num, name: m.name })),
      }
    : null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#0D1B30]">
      <CursosProSidebar
        userName={fullName}
        userEmail={email}
        userInitials={initials}
        activeCourse={activeCourse}
      />
      <main className="flex-1 overflow-y-auto bg-[#F9F6E7] text-[#1F2F58]">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
