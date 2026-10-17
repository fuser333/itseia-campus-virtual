import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SidebarWrapper from "@/components/layout/SidebarWrapper";

export default async function CohortLayout({
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarWrapper />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
