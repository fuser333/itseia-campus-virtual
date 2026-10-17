import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import PreuniSidebar from "@/components/layout/PreuniSidebar";

export default async function PreuniLayout({
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
    <div
      className="flex h-screen overflow-hidden bg-[#F9F6E7] text-[#1F2F58]"
      style={{ color: "#1F2F58" }}
    >
      <PreuniSidebar
        userName={profile?.full_name ?? undefined}
        userEmail={user.email ?? undefined}
      />
      <main
        className="flex-1 overflow-y-auto"
        style={{ color: "#1F2F58" }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
