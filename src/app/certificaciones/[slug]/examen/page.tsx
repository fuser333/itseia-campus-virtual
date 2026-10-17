// ── /certificaciones/[slug]/examen ───────────────────────
// Exam mode page — renders ExamSimulator after verifying auth.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import ExamSimulator from "@/components/certifications/ExamSimulator";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ExamenPage({ params }: Props) {
  const { slug } = await params;

  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/certificaciones/${slug}/examen`);
  }

  // Fetch certification
  const { data: cert } = await supabaseAdmin
    .from("certification_programs")
    .select("id, nombre, slug, umbral_aprobacion_porcentaje, estado")
    .eq("slug", slug)
    .single();

  if (!cert || cert.estado === "archivada") {
    redirect(`/certificaciones/${slug}`);
  }

  return (
    <ExamSimulator
      certificationSlug={slug}
      certificationId={cert.id}
      certificationNombre={cert.nombre}
      umbralPorcentaje={cert.umbral_aprobacion_porcentaje}
    />
  );
}
