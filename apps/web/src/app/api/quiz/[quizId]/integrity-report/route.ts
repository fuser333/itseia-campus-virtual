// ============================================================
// ITSEIA Academy — Integrity Report API Route (GET)
// Solo accesible por docentes, admin y super_admin.
// Retorna todos los intentos con datos de integridad,
// detecta patrones sospechosos y genera narrativa con Gemini.
// Art. 62 RRA 2022 — evidencia exportable.
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { jaccardSimilarity } from "@/features/exam-integrity/integrity";

const ADMIN_ROLES = ["super_admin", "admin", "coordinacion", "docente"];

interface AttemptWithIntegrity {
  attempt_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  score: number | null;
  max_score: number | null;
  percentage: number | null;
  passed: boolean | null;
  completed_at: string | null;
  tab_switches: number;
  time_per_question: Record<string, number>;
  integrity_score: number;
  flagged: boolean;
  suspicious_flags: string[] | null;
  question_order: string[] | null;
  answers: Record<string, unknown> | null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;

    // ── 1. Verificar autenticacion y rol ──
    const authClient = await createClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !ADMIN_ROLES.includes(profile.role)) {
      return Response.json(
        { error: "No tienes permiso para ver este reporte." },
        { status: 403 }
      );
    }

    // ── 2. Verificar que el quiz existe ──
    const { data: quiz } = await supabaseAdmin
      .from("quizzes")
      .select("id, title, session_id")
      .eq("id", quizId)
      .single();

    if (!quiz) {
      return Response.json({ error: "Quiz no encontrado." }, { status: 404 });
    }

    // ── 3. Fetch todos los intentos del quiz ──
    const { data: attempts, error: attemptsError } = await supabaseAdmin
      .from("quiz_attempts")
      .select("id, user_id, score, max_score, percentage, passed, completed_at, answers")
      .eq("quiz_id", quizId)
      .order("completed_at", { ascending: false });

    if (attemptsError || !attempts) {
      return Response.json(
        { error: "Error al obtener los intentos." },
        { status: 500 }
      );
    }

    if (attempts.length === 0) {
      return Response.json({
        quiz_id: quizId,
        quiz_title: quiz.title,
        total_attempts: 0,
        attempts_summary: [],
        suspicious_pairs: [],
        gemini_narrative: "No hay intentos registrados para este quiz.",
        generated_at: new Date().toISOString(),
      });
    }

    // ── 4. Fetch registros de integridad ──
    const attemptIds = attempts.map((a) => a.id);
    const { data: integrityRecords } = await supabaseAdmin
      .from("quiz_attempt_integrity")
      .select("*")
      .in("attempt_id", attemptIds);

    const integrityMap = new Map(
      (integrityRecords || []).map((r) => [r.attempt_id, r])
    );

    // ── 5. Fetch perfiles de usuarios ──
    const userIds = [...new Set(attempts.map((a) => a.user_id))];
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);

    const profileMap = new Map(
      (profiles || []).map((p) => [p.id, p])
    );

    // ── 6. Ensamblar resumen de intentos ──
    const attemptsSummary: AttemptWithIntegrity[] = attempts.map((attempt) => {
      const integrity = integrityMap.get(attempt.id);
      const userProfile = profileMap.get(attempt.user_id);

      return {
        attempt_id: attempt.id,
        user_id: attempt.user_id,
        user_name: userProfile?.full_name ?? "Estudiante",
        user_email: userProfile?.email ?? "",
        score: attempt.score,
        max_score: attempt.max_score,
        percentage: attempt.percentage,
        passed: attempt.passed,
        completed_at: attempt.completed_at,
        tab_switches: integrity?.tab_switches ?? 0,
        time_per_question: integrity?.time_per_question ?? {},
        integrity_score: integrity?.integrity_score ?? 1.0,
        flagged: integrity?.flagged ?? false,
        suspicious_flags: integrity?.suspicious_flags ?? null,
        question_order: integrity?.question_order ?? null,
        answers: attempt.answers,
      };
    });

    // ── 7. Detectar pares sospechosos (Jaccard similarity) ──
    const suspiciousPairs: {
      attempt_a: string;
      user_a: string;
      attempt_b: string;
      user_b: string;
      similarity: number;
      flag: string;
    }[] = [];

    for (let i = 0; i < attemptsSummary.length; i++) {
      for (let j = i + 1; j < attemptsSummary.length; j++) {
        const a = attemptsSummary[i];
        const b = attemptsSummary[j];

        if (!a.answers || !b.answers) continue;

        // Convertir answers a Record<string, number> para Jaccard
        const answersA: Record<string, number> = {};
        const answersB: Record<string, number> = {};

        for (const [qId, val] of Object.entries(a.answers)) {
          if (typeof val === "number") answersA[qId] = val;
        }
        for (const [qId, val] of Object.entries(b.answers)) {
          if (typeof val === "number") answersB[qId] = val;
        }

        const similarity = jaccardSimilarity(answersA, answersB);

        if (similarity >= 0.85) {
          suspiciousPairs.push({
            attempt_a: a.attempt_id,
            user_a: a.user_name,
            attempt_b: b.attempt_id,
            user_b: b.user_name,
            similarity: Math.round(similarity * 100),
            flag: "Patron sospechoso — respuestas identicas o muy similares",
          });

          // Marcar ambos intentos como flagged
          attemptsSummary[i].flagged = true;
          attemptsSummary[j].flagged = true;
        }
      }
    }

    // ── 8. Generar narrativa con Gemini ──
    let geminiNarrative = "";
    try {
      const apiKey = process.env.KIMI_API_KEY; // migrado de Gemini (caído) a Kimi
      if (apiKey) {
        const statsForGemini = attemptsSummary.map((a) => ({
          usuario: a.user_name,
          puntaje: `${a.percentage ?? 0}%`,
          integridad: `${Math.round(a.integrity_score * 100)}%`,
          cambios_pestaña: a.tab_switches,
          alertas: a.suspicious_flags ?? [],
          sospechoso: a.flagged,
        }));

        const prompt = `Eres un asistente educativo del Instituto Ecuatoriano de Inteligencia Artificial (ITSEIA).
Analiza los siguientes datos de integridad academica del quiz "${quiz.title}" con ${attempts.length} intento(s).

Datos:
${JSON.stringify(statsForGemini, null, 2)}

Pares sospechosos detectados: ${suspiciousPairs.length}
${suspiciousPairs.map((p) => `- ${p.user_a} y ${p.user_b}: ${p.similarity}% similitud`).join("\n")}

Genera un parrafo breve (maximo 4 oraciones) de observacion en español. Se objetivo, profesional y sin juzgar definitivamente a los estudiantes. Si no hay irregularidades, indicalo positivamente.`;

        const geminiRes = await fetch(
          "https://api.moonshot.ai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "moonshot-v1-32k",
              temperature: 0.4,
              max_tokens: 512,
              messages: [{ role: "user", content: prompt }],
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          geminiNarrative =
            geminiData?.choices?.[0]?.message?.content ?? "";
        }
      }
    } catch (geminiError) {
      console.error("Error al generar narrativa Gemini:", geminiError);
      geminiNarrative = "No se pudo generar el analisis automatico en este momento.";
    }

    // ── 9. Estadisticas generales ──
    const totalFlagged = attemptsSummary.filter((a) => a.flagged).length;
    const avgIntegrity =
      attemptsSummary.length > 0
        ? Math.round(
            (attemptsSummary.reduce((sum, a) => sum + a.integrity_score, 0) /
              attemptsSummary.length) *
              100
          )
        : 100;
    const avgScore =
      attemptsSummary.length > 0
        ? Math.round(
            attemptsSummary.reduce((sum, a) => sum + (a.percentage ?? 0), 0) /
              attemptsSummary.length
          )
        : 0;

    return Response.json({
      quiz_id: quizId,
      quiz_title: quiz.title,
      total_attempts: attempts.length,
      total_flagged: totalFlagged,
      avg_integrity_score: avgIntegrity,
      avg_score_percentage: avgScore,
      suspicious_pairs_count: suspiciousPairs.length,
      attempts_summary: attemptsSummary,
      suspicious_pairs: suspiciousPairs,
      gemini_narrative: geminiNarrative,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error en /api/quiz/[quizId]/integrity-report:", error);
    return Response.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
