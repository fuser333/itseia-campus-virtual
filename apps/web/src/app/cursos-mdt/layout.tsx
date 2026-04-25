import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import CursosMdtSidebar from "./CursosMdtSidebar";

export default async function CursosMdtLayout({
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

  const fullName = profile?.full_name ?? user.email?.split("@")[0] ?? "Estudiante";
  const email    = profile?.email ?? user.email ?? "";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CursosMdtSidebar
        userName={fullName}
        userEmail={email}
        userInitials={initials}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
