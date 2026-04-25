import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
