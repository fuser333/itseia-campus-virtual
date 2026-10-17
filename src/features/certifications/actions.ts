"use server";

// ============================================================
// ITSEIA Academy — Certifications: Server Actions
// Feature: 009-industry-certifications
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getExamQuestionsForScoring } from "./queries";
import type { DomainScore, ExamAnswerRecord } from "@/types/database";

// ── Enroll ────────────────────────────────────────────────

/**
 * Enrolls the current user in a certification (UPSERT — idempotent).
 * Returns the enrollment id.
 */
export async function enrollCertification(
  certificationId: string
): Promise<{ success: boolean; enrollmentId?: string; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "No autenticado" };

  const { data, error } = await supabaseAdmin
    .from("certification_enrollments")
    .upsert(
      {
        user_id: user.id,
        certification_id: certificationId,
        last_accessed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,certification_id" }
    )
    .select("id")
    .single();

  if (error) {
    console.error("[enrollCertification]", error);
    return { success: false, error: "Error al inscribirse" };
  }

  return { success: true, enrollmentId: data.id };
}

/**
 * Updates last_accessed_at for an enrollment (called when student re-enters a cert).
 */
export async function touchEnrollment(
  certificationId: string
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabaseAdmin
    .from("certification_enrollments")
    .update({ last_accessed_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("certification_id", certificationId);
}

// ── Exam ──────────────────────────────────────────────────

/**
 * Creates an exam attempt and returns the question IDs.
 * Questions are selected server-side (no respuesta_correcta sent to client).
 */
export async function startExam(certificationId: string): Promise<{
  success: boolean;
  attemptId?: string;
  questionIds?: string[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  // Verify enrollment
  const { data: enrollment } = await supabaseAdmin
    .from("certification_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("certification_id", certificationId)
    .single();

  if (!enrollment) {
    // Auto-enroll silently
    await enrollCertification(certificationId);
  }

  // Get certification config
  const { data: cert } = await supabaseAdmin
    .from("certification_programs")
    .select("id")
    .eq("id", certificationId)
    .single();

  if (!cert) return { success: false, error: "Certificacion no encontrada" };

  // Get active questions
  const { data: allQuestions } = await supabaseAdmin
    .from("exam_questions")
    .select("id, domain_id")
    .eq("certification_id", certificationId)
    .eq("activa", true);

  if (!allQuestions || allQuestions.length < 10) {
    return {
      success: false,
      error: "Simulacro no disponible aun — banco de preguntas insuficiente",
    };
  }

  // Fisher-Yates shuffle + limit to 65 (AWS CCP standard)
  const shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const selected = shuffled.slice(0, Math.min(65, shuffled.length));
  const questionIds = selected.map((q: { id: string }) => q.id);

  // Create attempt
  const { data: attempt, error } = await supabaseAdmin
    .from("exam_attempts")
    .insert({
      user_id: user.id,
      certification_id: certificationId,
      total_questions: questionIds.length,
      // Store question order in respuestas as skeleton (answers filled on submit)
      respuestas: questionIds.map((qId: string) => ({
        question_id: qId,
        selected_index: -1,
        is_correct: false,
      })),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[startExam]", error);
    return { success: false, error: "Error al iniciar el examen" };
  }

  return { success: true, attemptId: attempt.id, questionIds };
}

// ── Submit ────────────────────────────────────────────────

export interface SubmitAnswer {
  question_id: string;
  selected_index: number; // -1 if not answered
}

/**
 * Receives student answers, calculates score SERVER-SIDE, updates attempt,
 * and upserts badge if passed threshold.
 */
export async function submitExam(
  attemptId: string,
  answers: SubmitAnswer[],
  durationSeconds: number
): Promise<{
  success: boolean;
  score_total?: number;
  total_questions?: number;
  percentage?: number;
  aprobado?: boolean;
  score_por_dominio?: Record<string, DomainScore>;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  // Verify attempt belongs to user
  const { data: attempt } = await supabaseAdmin
    .from("exam_attempts")
    .select("*, certification_programs(umbral_aprobacion_porcentaje)")
    .eq("id", attemptId)
    .eq("user_id", user.id)
    .single();

  if (!attempt) return { success: false, error: "Intento no encontrado" };
  if (attempt.finished_at) return { success: false, error: "Intento ya finalizado" };

  // Fetch correct answers from DB (never exposed to client before submit)
  const questionIds = answers.map((a) => a.question_id);
  const correctAnswers = await getExamQuestionsForScoring(questionIds);

  const correctMap = new Map(
    correctAnswers.map((q) => [q.id, { correct: q.respuesta_correcta, domainId: q.domain_id }])
  );

  // Calculate scores
  let scoreTotal = 0;
  const scorePorDominio: Record<string, DomainScore> = {};
  const respuestasResult: ExamAnswerRecord[] = [];

  for (const answer of answers) {
    const correctData = correctMap.get(answer.question_id);
    if (!correctData) continue;

    const isCorrect = answer.selected_index === correctData.correct;
    if (isCorrect) scoreTotal++;

    const domainId = correctData.domainId || "unknown";
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

  const totalQuestions = answers.length;
  const percentage =
    totalQuestions > 0
      ? Math.round((scoreTotal / totalQuestions) * 10000) / 100
      : 0;

  const umbral =
    (attempt.certification_programs as { umbral_aprobacion_porcentaje?: number })
      ?.umbral_aprobacion_porcentaje ?? 70;
  const aprobado = percentage >= umbral;

  // Update attempt
  const { error: updateError } = await supabaseAdmin
    .from("exam_attempts")
    .update({
      finished_at: new Date().toISOString(),
      score_total: scoreTotal,
      total_questions: totalQuestions,
      percentage,
      aprobado,
      score_por_dominio: scorePorDominio,
      respuestas: respuestasResult,
      duration_seconds: durationSeconds,
    })
    .eq("id", attemptId);

  if (updateError) {
    console.error("[submitExam update]", updateError);
    return { success: false, error: "Error al guardar resultados" };
  }

  // Upsert badge if approved
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

  return {
    success: true,
    score_total: scoreTotal,
    total_questions: totalQuestions,
    percentage,
    aprobado,
    score_por_dominio: scorePorDominio,
  };
}

// ── Badge Validation (Admin only) ─────────────────────────

/**
 * Admin validates a physical certificate uploaded by a student.
 * Changes badge_type from simulacro_aprobado to certificado_oficial.
 */
export async function validateBadge(
  badgeId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  // Verify admin role
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const adminRoles = ["admin", "super_admin", "coordinacion"];
  if (!profile || !adminRoles.includes(profile.role)) {
    return { success: false, error: "Sin permisos de administrador" };
  }

  const { error } = await supabaseAdmin
    .from("certification_badges")
    .update({
      badge_type: "certificado_oficial",
      validated_by: user.id,
      validation_date: new Date().toISOString(),
    })
    .eq("id", badgeId);

  if (error) {
    console.error("[validateBadge]", error);
    return { success: false, error: "Error al validar el badge" };
  }

  return { success: true };
}

/**
 * Admin updates the status of a certification (active, update pending, archived).
 */
export async function updateCertificationStatus(
  certificationId: string,
  status: "activa" | "actualizacion_pendiente" | "archivada"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const adminRoles = ["admin", "super_admin", "coordinacion"];
  if (!profile || !adminRoles.includes(profile.role)) {
    return { success: false, error: "Sin permisos de administrador" };
  }

  const { error } = await supabaseAdmin
    .from("certification_programs")
    .update({ estado: status })
    .eq("id", certificationId);

  if (error) return { success: false, error: "Error al actualizar estado" };
  return { success: true };
}
