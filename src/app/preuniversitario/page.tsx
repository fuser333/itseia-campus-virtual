import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preuniversitario IA | ITSEIA Academy",
  description:
    "Programa preuniversitario de Inteligencia Artificial en ITSEIA Academy.",
};

export default async function PreuniversitarioPage() {
  // Find the preuni program and redirect to its content page
  const { data: program } = await supabaseAdmin
    .from("programs")
    .select("slug")
    .eq("type", "preuni")
    .eq("is_active", true)
    .limit(1)
    .single();

  if (program) {
    redirect(`/carreras/${program.slug}`);
  }

  // If no preuni program found, redirect to programs page with anchor
  redirect("/carreras#preuni");
}
