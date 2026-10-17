import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import CertificacionesSidebar from "@/components/layout/CertificacionesSidebar";

export default async function CertificacionesLayout({
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

  // Fetch profile server-side for sidebar user display (bypasses RLS)
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CertificacionesSidebar
        userName={profile?.full_name ?? undefined}
        userEmail={user.email ?? undefined}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
