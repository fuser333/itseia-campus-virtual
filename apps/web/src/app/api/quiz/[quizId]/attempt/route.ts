// ============================================================
// ITSEIA Academy — Quiz Attempt API Route (POST)
// Auth check, receive answers, grade, insert quiz_attempts,
// award XP if passed. Return results with explanations.
// Integrity tracking: tab_switches, time_per_question, browser_info
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  calculateIntegrityScore,
  generateSuspiciousFlags,
} from "@/features/exam-integrity/integrity";

interface AnswerInput {
  question_id: string;
  selected_index?: number;
  selected_indices?: number[];
  selected_answer?: boolean;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;

    // ── 1. Autenticar usuario ──
    const authClient = await createClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "Debes iniciar sesion." },
        { status: 401 }
      );
    }

    // ── 2. Parsear body ──
    const body = await request.json();
    const {
      answers,
      tab_switches,
      time_per_question,
      browser_info,
      question_order,
      option_orders,
    } = body as {
      answers: AnswerInput[];
      tab_switches?: number;
      time_per_question?: Record<string, number>;
      browser_info?: string;
      question_order?: string[];
      option_orders?: Record<string, number[]>;
    };

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return Response.json(
        { error: "Debes enviar un array de respuestas." },
        { status: 400 }
      );
    }

    // ── 3. Fetch quiz ──
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .eq("is_active", true)
      .single();

    if (quizError || !quiz) {
      return Response.json(
        { error: "Quiz no encontrado." },
        { status: 404 }
      );
    }

    // ── 4. Check max attempts ──
    const { data: previousAttempts } = await supabaseAdmin
      .from("quiz_attempts")
      .select("id")
      .eq("quiz_id", quizId)
      .eq("user_id", user.id);

    const attemptCount = previousAttempts?.length ?? 0;
    if (attemptCount >= quiz.max_attempts) {
      return Response.json(
        { error: `Has alcanzado el maximo de ${quiz.max_attempts} intentos.` },
        { status: 400 }
      );
    }

    // ── 5. Fetch quiz questions ──
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("order_index", { ascending: true });

    if (questionsError || !questions || questions.length === 0) {
      return Response.json(
        { error: "El quiz no tiene preguntas." },
        { status: 400 }
      );
    }

    // ── 6. Grade answers ──
    let score = 0;
    let maxScore = 0;
    const results: {
      question_id: string;
      question_text: string;
      correct: boolean;
      points: number;
      explanation: string | null;
      correct_answer: string;
      your_answer: string;
    }[] = [];

    for (const question of questions) {
      maxScore += question.points;
      const answer = answers.find((a) => a.question_id === question.id);
      // Handle string-encoded JSON from Supabase
      let rawOpts = question.options;
      if (typeof rawOpts === "string") {
        try { rawOpts = JSON.parse(rawOpts); } catch { rawOpts = {}; }
      }
      const opts = rawOpts as {
        options?: { text: string; is_correct: boolean }[];
        correct_index?: number;
        correct_indices?: number[];
        correct_answer?: boolean;
      };
      // Support flat array format [{id, text, is_correct}]
      const optionsList = Array.isArray(rawOpts)
        ? (rawOpts as { text: string; is_correct: boolean }[])
        : (opts.options || []);

      let isCorrect = false;
      let yourAnswer = "Sin respuesta";
      let correctAnswer = "";

      if (question.question_type === "multiple_choice") {
        const correctIdx = opts.correct_index ?? optionsList.findIndex((o) => o.is_correct);
        correctAnswer = optionsList[correctIdx]?.text || "N/A";

        if (answer && answer.selected_index !== undefined) {
          yourAnswer = optionsList[answer.selected_index]?.text || "N/A";
          isCorrect = answer.selected_index === correctIdx;
        }
      } else if (question.question_type === "true_false") {
        const correctBool = opts.correct_answer ?? optionsList.findIndex((o) => o.is_correct) === 0;
        correctAnswer = correctBool ? "Verdadero" : "Falso";

        if (answer && answer.selected_answer !== undefined) {
          yourAnswer = answer.selected_answer ? "Verdadero" : "Falso";
          isCorrect = answer.selected_answer === correctBool;
        }
      } else if (question.question_type === "multiple_select") {
        const correctIndices = opts.correct_indices ?? optionsList
          .map((o, i) => (o.is_correct ? i : -1))
          .filter((i) => i >= 0);
        correctAnswer = correctIndices.map((i) => optionsList[i]?.text || "N/A").join(", ");

        if (answer && answer.selected_indices) {
          yourAnswer = answer.selected_indices.map((i) => optionsList[i]?.text || "N/A").join(", ");
          const sortedCorrect = [...correctIndices].sort();
          const sortedSelected = [...answer.selected_indices].sort();
          isCorrect =
            sortedCorrect.length === sortedSelected.length &&
            sortedCorrect.every((val, idx) => val === sortedSelected[idx]);
        }
      }

      if (isCorrect) {
        score += question.points;
      }

      results.push({
        question_id: question.id,
        question_text: question.question_text,
        correct: isCorrect,
        points: isCorrect ? question.points : 0,
        explanation: question.explanation,
        correct_answer: correctAnswer,
        your_answer: yourAnswer,
      });
    }

    // ── 7. Calculate percentage and pass status ──
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100 * 100) / 100 : 0;
    const passed = percentage >= quiz.pass_percentage;

    // ── 8. Insert quiz attempt ──
    const answersRecord: Record<string, unknown> = {};
    for (const answer of answers) {
      if (answer.selected_index !== undefined) {
        answersRecord[answer.question_id] = answer.selected_index;
      } else if (answer.selected_indices !== undefined) {
        answersRecord[answer.question_id] = answer.selected_indices;
      } else if (answer.selected_answer !== undefined) {
        answersRecord[answer.question_id] = answer.selected_answer;
      }
    }

    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from("quiz_attempts")
      .insert({
        quiz_id: quizId,
        user_id: user.id,
        answers: answersRecord,
        score,
        max_score: maxScore,
        percentage,
        passed,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (attemptError) {
      console.error("Error insertando quiz_attempt:", attemptError);
      return Response.json(
        { error: "Error al registrar el intento." },
        { status: 500 }
      );
    }

    // ── 9. Registrar integridad del intento ──
    const tabSwitchesCount = tab_switches ?? 0;
    const timePerQ = time_per_question ?? {};

    const integrityScore = calculateIntegrityScore({
      tabSwitches: tabSwitchesCount,
      timePerQuestion: timePerQ,
      totalQuestions: questions.length,
    });

    const suspiciousFlags = generateSuspiciousFlags({
      tabSwitches: tabSwitchesCount,
      timePerQuestion: timePerQ,
      totalQuestions: questions.length,
    });

    const isFlagged = integrityScore < 0.7 || suspiciousFlags.length > 0;

    // Insertar registro de integridad (no bloquear el flujo si falla)
    supabaseAdmin
      .from("quiz_attempt_integrity")
      .insert({
        attempt_id: attempt.id,
        question_order: question_order ?? null,
        option_orders: option_orders ?? null,
        time_per_question: timePerQ,
        tab_switches: tabSwitchesCount,
        browser_info: browser_info ?? null,
        integrity_score: integrityScore,
        flagged: isFlagged,
        suspicious_flags: suspiciousFlags.length > 0 ? suspiciousFlags : null,
      })
      .then(({ error }) => {
        if (error) {
          console.error("Error insertando quiz_attempt_integrity:", error);
        }
      });

    // ── 10. Award XP if passed (first time passing) ──
    let xpAwarded = 0;
    if (passed) {
      // Check if user already passed this quiz before
      const alreadyPassed = (previousAttempts?.length ?? 0) > 0
        ? await supabaseAdmin
            .from("quiz_attempts")
            .select("id")
            .eq("quiz_id", quizId)
            .eq("user_id", user.id)
            .eq("passed", true)
            .neq("id", attempt.id)
            .limit(1)
        : { data: [] };

      if (!alreadyPassed.data || alreadyPassed.data.length === 0) {
        // First time passing - award XP
        xpAwarded = 25;
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("nivel_xp")
          .eq("id", user.id)
          .single();

        if (profile) {
          await supabaseAdmin
            .from("profiles")
            .update({ nivel_xp: (profile.nivel_xp || 0) + xpAwarded })
            .eq("id", user.id);
        }
      }
    }

    return Response.json({
      attempt_id: attempt.id,
      score,
      max_score: maxScore,
      percentage,
      passed,
      pass_percentage: quiz.pass_percentage,
      attempts_used: attemptCount + 1,
      max_attempts: quiz.max_attempts,
      xp_awarded: xpAwarded,
      integrity_score: integrityScore,
      results,
    });
  } catch (error) {
    console.error("Error en /api/quiz/[quizId]/attempt:", error);
    return Response.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
