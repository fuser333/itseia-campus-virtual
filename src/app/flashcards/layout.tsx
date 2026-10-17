import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SidebarWrapper from "@/components/layout/SidebarWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Mazo de Flashcards",
  description:
    "Repasa tus flashcards generadas por IA desde las sesiones de tus cursos.",
};

export default async function FlashcardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/flashcards");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarWrapper />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
