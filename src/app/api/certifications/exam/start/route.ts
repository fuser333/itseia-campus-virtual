// ── POST /api/certifications/exam/start ────────────────────
// Selects N random questions SERVER-SIDE (no respuesta_correcta sent).
// Creates an exam_attempts row and returns question IDs + attempt ID.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ExamQuestionForClient } from "@/types/database";

const MAX_QUESTIONS = 65; // AWS CCP standard

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let certificationId: string;
  try {
    const body = await req.json();
    certificationId = body.certification_id;
    if (!certificationId) throw new Error();
  } catch {
    return NextResponse.json(
      { error: "certification_id requerido" },
      { status: 400 }
    );
  }

  // Check certification exists
  const { data: cert } = await supabaseAdmin
    .from("certification_programs")
    .select("id, nombre, umbral_aprobacion_porcentaje")
    .eq("id", certificationId)
    .single();

  if (!cert) {
    return NextResponse.json(
      { error: "Certificacion no encontrada" },
      { status: 404 }
    );
  }

  // Auto-enroll if not already enrolled
  await supabaseAdmin
    .from("certification_enrollments")
    .upsert(
      {
        user_id: user.id,
        certification_id: certificationId,
        last_accessed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,certification_id" }
    );

  // Fetch all active questions WITHOUT respuesta_correcta
  const { data: allQuestions, error: qError } = await supabaseAdmin
    .from("exam_questions")
    .select(
      "id, certification_id, domain_id, enunciado, opciones, explicacion, idioma, activa, created_at"
    )
    .eq("certification_id", certificationId)
    .eq("activa", true);

  if (qError || !allQuestions || allQuestions.length < 10) {
    return NextResponse.json(
      {
        error:
          "Simulacro no disponible aun. El banco de preguntas esta siendo preparado.",
      },
      { status: 503 }
    );
  }

  // Fisher-Yates shuffle server-side
  const shuffled = [...allQuestions] as ExamQuestionForClient[];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const selected = shuffled.slice(0, Math.min(MAX_QUESTIONS, shuffled.length));
  const questionIds = selected.map((q) => q.id);

  // Create attempt row with skeleton respuestas (filled on submit)
  const { data: attempt, error: aError } = await supabaseAdmin
    .from("exam_attempts")
    .insert({
      user_id: user.id,
      certification_id: certificationId,
      total_questions: questionIds.length,
      respuestas: questionIds.map((qId: string) => ({
        question_id: qId,
        selected_index: -1,
        is_correct: false,
      })),
    })
    .select("id")
    .single();

  if (aError || !attempt) {
    console.error("[exam/start]", aError);
    return NextResponse.json(
      { error: "Error al crear intento de examen" },
      { status: 500 }
    );
  }

  // Return questions WITHOUT respuesta_correcta (already excluded in select)
  return NextResponse.json({
    attempt_id: attempt.id,
    questions: selected,
    time_limit_seconds: 90 * 60, // 90 minutes for AWS CCP
    certification: {
      id: cert.id,
      nombre: cert.nombre,
      umbral_aprobacion_porcentaje: cert.umbral_aprobacion_porcentaje,
    },
  });
}
