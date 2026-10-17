import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SidebarWrapper from "@/components/layout/SidebarWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Biblioteca Virtual",
  description:
    "Acceso a mas de 250 millones de papers academicos de acceso abierto. Cumple Art. 61 RRA 2022.",
};

export default async function BibliotecaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/biblioteca");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarWrapper />
      <main className="flex-1 overflow-y-auto bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}
