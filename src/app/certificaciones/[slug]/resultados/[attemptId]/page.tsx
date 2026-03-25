// ── /certificaciones/[slug]/resultados/[attemptId] ────────
// Results page after submitting a simulation exam.

import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getExamAttemptWithQuestions } from "@/features/certifications/queries";
import ExamResultsSummary from "@/components/certifications/ExamResultsSummary";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; attemptId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Resultados Simulacro ${slug} | ITSEIA Academy`,
  };
}

export default async function ResultadosPage({ params }: Props) {
  const { slug, attemptId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/certificaciones/${slug}/resultados/${attemptId}`);
  }

  const result = await getExamAttemptWithQuestions(attemptId, user.id);
  if (!result) {
    notFound();
  }

  // Fetch domains for domain name mapping
  const { data: domains } = await supabaseAdmin
    .from("certification_domains")
    .select("id, nombre, porcentaje_en_examen")
    .eq("certification_id", result.certification.id)
    .order("orden");

  // Build ReviewQuestion shape expected by ExamResultsSummary
  const reviewQuestions = result.questions.map((q) => {
    const respuestas = result.attempt.respuestas || [];
    const studentAnswer = Array.isArray(respuestas)
      ? (respuestas as Array<{ question_id: string; selected_index: number; is_correct: boolean }>).find(
          (r) => r.question_id === q.id
        )
      : null;

    return {
      id: q.id,
      enunciado: q.enunciado,
      opciones: Array.isArray(q.opciones)
        ? (q.opciones as Array<{ text: string; is_correct: boolean }>)
        : [],
      respuesta_correcta: q.respuesta_correcta,
      explicacion: q.explicacion,
      student_answer: studentAnswer?.selected_index ?? -1,
      is_correct: studentAnswer?.is_correct ?? false,
      domain_id: q.domain_id,
    };
  });

  return (
    <ExamResultsSummary
      attempt={result.attempt}
      questions={reviewQuestions}
      certificationNombre={result.certification.nombre}
      certificationSlug={slug}
      umbralPorcentaje={result.certification.umbral_aprobacion_porcentaje}
      domains={
        (domains || []) as Array<{
          id: string;
          nombre: string;
          porcentaje_en_examen: number;
        }>
      }
    />
  );
}
