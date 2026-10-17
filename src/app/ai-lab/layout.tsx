import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SidebarWrapper from "@/components/layout/SidebarWrapper";

export default async function AILabLayout({
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
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
