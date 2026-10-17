// ============================================================
// ITSEIA Academy — Quiz Start API Route (POST)
// Genera orden aleatorio de preguntas y opciones en el servidor.
// Retorna seed + orden firmado via HMAC para que el cliente
// no pueda manipular el orden sin invalidar la firma.
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createHmac } from "crypto";
import { shuffleWithSeed, stringToSeed } from "@/features/exam-integrity/shuffle";

// El secret debe tener al menos 32 caracteres.
// Si no esta configurado, se genera uno temporal (desarrollo).
function getIntegritySecret(): string {
  const secret = process.env.QUIZ_INTEGRITY_SECRET;
  if (!secret || secret.length < 32) {
    // En produccion esto debe estar configurado como variable de entorno
    return "itseia-dev-integrity-secret-2026-quiz";
  }
  return secret;
}

function signPayload(payload: string): string {
  return createHmac("sha256", getIntegritySecret())
    .update(payload)
    .digest("hex");
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

    // ── 2. Fetch quiz con nuevas columnas ──
    const { data: quiz, error: quizError } = await supabaseAdmin
      .from("quizzes")
      .select("id, shuffle_questions, shuffle_options, time_limit_seconds, show_one_at_a_time, bank_size, show_n_questions, is_active")
      .eq("id", quizId)
      .eq("is_active", true)
      .single();

    if (quizError || !quiz) {
      return Response.json(
        { error: "Quiz no encontrado." },
        { status: 404 }
      );
    }

    // ── 3. Fetch preguntas ──
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from("quiz_questions")
      .select("id, options, order_index")
      .eq("quiz_id", quizId)
      .order("order_index", { ascending: true });

    if (questionsError || !questions || questions.length === 0) {
      return Response.json(
        { error: "El quiz no tiene preguntas." },
        { status: 400 }
      );
    }

    // ── 4. Generar seed determinista (userId + quizId) ──
    // Incluir timestamp dia (YYYY-MM-DD) para que la semilla cambie diariamente
    // pero sea estable dentro del mismo dia (reproducible en recarga)
    const today = new Date().toISOString().slice(0, 10);
    const seedString = `${user.id}:${quizId}:${today}`;
    const seed = stringToSeed(seedString);

    // ── 5. Banco rotativo (si esta configurado) ──
    let questionPool = questions.map((q) => q.id);

    if (quiz.show_n_questions && quiz.show_n_questions > 0 && questionPool.length > quiz.show_n_questions) {
      // Seleccionar N preguntas aleatoriamente del banco usando seed ligeramente diferente
      const bankSeed = stringToSeed(`${seedString}:bank`);
      const shuffledPool = shuffleWithSeed(questionPool, bankSeed);
      questionPool = shuffledPool.slice(0, quiz.show_n_questions);
    }

    // ── 6. Shuffle de preguntas (si esta habilitado) ──
    let shuffledQuestionIds: string[];
    if (quiz.shuffle_questions !== false) {
      shuffledQuestionIds = shuffleWithSeed(questionPool, seed);
    } else {
      shuffledQuestionIds = questionPool;
    }

    // ── 7. Shuffle de opciones por pregunta ──
    // Para cada pregunta, calcular el orden de sus opciones
    const optionOrders: Record<string, number[]> = {};

    for (const q of questions) {
      if (!shuffledQuestionIds.includes(q.id)) continue;

      // Parsear opciones para saber cuantas hay
      let opts = q.options;
      if (typeof opts === "string") {
        try { opts = JSON.parse(opts as string); } catch { opts = {}; }
      }

      let optionCount = 0;
      if (Array.isArray(opts)) {
        optionCount = opts.length;
      } else if (opts && typeof opts === "object" && Array.isArray((opts as { options?: unknown[] }).options)) {
        optionCount = (opts as { options: unknown[] }).options.length;
      }

      if (optionCount > 0) {
        const originalIndices = Array.from({ length: optionCount }, (_, i) => i);
        if (quiz.shuffle_options !== false) {
          const optSeed = stringToSeed(`${seedString}:opt:${q.id}`);
          optionOrders[q.id] = shuffleWithSeed(originalIndices, optSeed);
        } else {
          optionOrders[q.id] = originalIndices;
        }
      }
    }

    // ── 8. Firmar el payload con HMAC ──
    const payload = JSON.stringify({
      quizId,
      userId: user.id,
      seed,
      shuffledQuestionIds,
      optionOrders,
      today,
    });
    const signature = signPayload(payload);

    return Response.json({
      seed,
      shuffledQuestionIds,
      optionOrders,
      signedToken: signature,
      timeLimitSeconds: quiz.time_limit_seconds ?? null,
      showOneAtATime: quiz.show_one_at_a_time ?? false,
    });
  } catch (error) {
    console.error("Error en /api/quiz/[quizId]/start:", error);
    return Response.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
