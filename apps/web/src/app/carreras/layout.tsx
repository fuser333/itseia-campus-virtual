import { createClient } from "@/lib/supabase/server";
import SidebarWrapper from "@/components/layout/SidebarWrapper";
import PublicHeader from "@/components/layout/PublicHeader";

export default async function CarrerasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Authenticated users see the sidebar layout (campus mode)
  if (user) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#F9F6E7]">
        <SidebarWrapper />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
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
