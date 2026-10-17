import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SidebarWrapper from "@/components/layout/SidebarWrapper";

export default async function PreuniLayout({
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
    <div
      className="flex h-screen overflow-hidden bg-[#F9F6E7] text-[#1F2F58]"
      style={{ color: "#1F2F58" }}
    >
      <SidebarWrapper />
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
