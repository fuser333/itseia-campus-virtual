import { supabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bootcamp IA | ITSEIA Academy",
  description:
    "Bootcamp intensivo de Inteligencia Artificial en ITSEIA Academy.",
};

export default async function BootcampPage() {
  // Find the bootcamp program and redirect to its content page
  const { data: program } = await supabaseAdmin
    .from("programs")
    .select("slug")
    .eq("type", "bootcamp")
    .eq("is_active", true)
    .limit(1)
    .single();

  if (program) {
    redirect(`/carreras/${program.slug}`);
  }

  // If no bootcamp program found, redirect to programs page with anchor
  redirect("/carreras#bootcamp");
}
