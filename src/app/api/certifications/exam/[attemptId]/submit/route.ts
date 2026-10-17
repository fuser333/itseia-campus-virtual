// ── POST /api/certifications/exam/[attemptId]/submit ────────
// Receives student answers, calculates score SERVER-SIDE.
// Returns scored results with respuesta_correcta for review.
// NEVER exposes respuesta_correcta before submit.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DomainScore, ExamAnswerRecord } from "@/types/database";

interface SubmitBody {
  answers: Array<{
    question_id: string;
    selected_index: number;
  }>;
  duration_seconds: number;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const { attemptId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let body: SubmitBody;
  try {
    body = await req.json();
    if (!Array.isArray(body.answers)) throw new Error();
  } catch {
    return NextResponse.json({ error: "Payload invalido" }, { status: 400 });
  }

  // Verify attempt ownership and not already finished
  const { data: attempt } = await supabaseAdmin
    .from("exam_attempts")
    .select("*, certification_programs(umbral_aprobacion_porcentaje)")
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .single();

  if (!attempt) {
    return NextResponse.json({ error: "Intento no encontrado" }, { status: 404 });
  }
  if (attempt.finished_at) {
    return NextResponse.json(
      { error: "Este intento ya fue finalizado" },
      { status: 409 }
    );
  }

  // Fetch correct answers from DB (never sent to client before this point)
  const questionIds = body.answers.map((a) => a.question_id);
  const { data: correctData } = await supabaseAdmin
    .from("exam_questions")
    .select("id, respuesta_correcta, domain_id, enunciado, opciones, explicacion")
    .in("id", questionIds);

  const correctMap = new Map(
    (correctData || []).map((q: {
      id: string;
      respuesta_correcta: number;
      domain_id: string | null;
      enunciado: string;
      opciones: unknown;
      explicacion: string | null;
    }) => [q.id, q])
  );

  // Score calculation
  let scoreTotal = 0;
  const scorePorDominio: Record<string, DomainScore> = {};
  const respuestasResult: ExamAnswerRecord[] = [];

  for (const answer of body.answers) {
    const qData = correctMap.get(answer.question_id);
    if (!qData) continue;

    const isCorrect = answer.selected_index === qData.respuesta_correcta;
    if (isCorrect) scoreTotal++;

    const domainId = qData.domain_id || "unknown";
    if (!scorePorDominio[domainId]) {
      scorePorDominio[domainId] = { correct: 0, total: 0 };
    }
    scorePorDominio[domainId].total++;
    if (isCorrect) scorePorDominio[domainId].correct++;

    respuestasResult.push({
      question_id: answer.question_id,
      selected_index: answer.selected_index,
      is_correct: isCorrect,
    });
  }

  const totalQuestions = body.answers.length;
  const percentage =
    totalQuestions > 0
      ? Math.round((scoreTotal / totalQuestions) * 10000) / 100
      : 0;

  const umbral =
    (attempt.certification_programs as { umbral_aprobacion_porcentaje?: number })
      ?.umbral_aprobacion_porcentaje ?? 70;
  const aprobado = percentage >= umbral;

  // Update attempt
  await supabaseAdmin
    .from("exam_attempts")
    .update({
      finished_at: new Date().toISOString(),
      score_total: scoreTotal,
      total_questions: totalQuestions,
      percentage,
      aprobado,
      score_por_dominio: scorePorDominio,
      respuestas: respuestasResult,
      duration_seconds: body.duration_seconds || 0,
    })
    .eq("id", attemptId);

  // Upsert badge if passed
  if (aprobado) {
    await supabaseAdmin
      .from("certification_badges")
      .upsert(
        {
          user_id: user.id,
          certification_id: attempt.certification_id,
          badge_type: "simulacro_aprobado",
          score: percentage,
          issued_at: new Date().toISOString(),
        },
        { onConflict: "user_id,certification_id" }
      );
  }

  // Return full results WITH respuesta_correcta for review display
  const questionsWithAnswers = (correctData || []).map((q: {
    id: string;
    respuesta_correcta: number;
    domain_id: string | null;
    enunciado: string;
    opciones: unknown;
    explicacion: string | null;
  }) => ({
    ...q,
    student_answer: body.answers.find((a) => a.question_id === q.id)
      ?.selected_index ?? -1,
    is_correct:
      (body.answers.find((a) => a.question_id === q.id)?.selected_index ?? -1) ===
      q.respuesta_correcta,
  }));

  return NextResponse.json({
    attempt_id: attemptId,
    score_total: scoreTotal,
    total_questions: totalQuestions,
    percentage,
    aprobado,
    umbral,
    score_por_dominio: scorePorDominio,
    questions_reviewed: questionsWithAnswers,
    badge_earned: aprobado ? "simulacro_aprobado" : null,
  });
}
