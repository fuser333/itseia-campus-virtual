import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import PublicHeader from "@/components/layout/PublicHeader";
import CarrerasSidebar from "@/components/layout/CarrerasSidebar";

export default async function CarrerasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authClient = await createClient();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  // Authenticated users see the sidebar layout (campus mode)
  if (user) {
    // Fetch profile server-side for sidebar user display (bypasses RLS)
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <CarrerasSidebar
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

  // Unauthenticated visitors see the public layout
  return (
    <div className="min-h-screen bg-[#F9F6E7]">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {children}
      </main>
    </div>
  );
}
