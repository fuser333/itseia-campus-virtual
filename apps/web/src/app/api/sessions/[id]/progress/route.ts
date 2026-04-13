// ============================================================
// ITSEIA Academy — Session Progress API Route (POST)
// Auth check, upsert session_progress, return updated progress
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

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
    const allowedFields = [
      "video_watched",
      "video_watch_seconds",
      "slides_viewed",
      "theory_read",
      "quiz_passed",
      "assignment_submitted",
      "ai_lab_used",
    ];

    const updateFields: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateFields[field] = body[field];
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return Response.json(
        { error: "No se proporcionaron campos validos para actualizar." },
        { status: 400 }
      );
    }

    // ── 3. Verificar que la sesion existe + contenido disponible ──
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("id, video_url, slides_url, theory_markdown")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return Response.json(
        { error: "Sesion no encontrada." },
        { status: 404 }
      );
    }

    // Check what content actually exists for this session
    const [quizExists, assignmentExists] = await Promise.all([
      supabaseAdmin
        .from("quizzes")
        .select("id", { count: "exact", head: true })
        .eq("session_id", sessionId)
        .eq("is_active", true),
      supabaseAdmin
        .from("assignments")
        .select("id", { count: "exact", head: true })
        .eq("session_id", sessionId)
        .eq("is_active", true),
    ]);

    const hasVideo = !!session.video_url;
    const hasSlides = !!session.slides_url;
    const hasTheory = !!session.theory_markdown;
    const hasQuiz = (quizExists.count ?? 0) > 0;
    const hasAssignment = (assignmentExists.count ?? 0) > 0;

    // Helper: check if all APPLICABLE completion criteria are met.
    // If a session has no quiz/slides/assignment, those fields auto-pass.
    const isCompleted = (state: Record<string, unknown>): boolean => {
      if (hasVideo && !(state.video_watched)) return false;
      if (hasSlides && !(state.slides_viewed)) return false;
      if (hasTheory && !(state.theory_read)) return false;
      if (hasQuiz && !(state.quiz_passed)) return false;
      if (hasAssignment && !(state.assignment_submitted)) return false;
      if (!(state.ai_lab_used)) return false;
      // At least ONE content type must exist and be completed
      return (hasVideo || hasSlides || hasTheory);
    };

    // ── 4. Check existing progress ──
    const { data: existingProgress } = await supabaseAdmin
      .from("session_progress")
      .select("*")
      .eq("session_id", sessionId)
      .eq("user_id", user.id)
      .limit(1);

    const existing = existingProgress?.[0] ?? null;

    let result;

    if (existing) {
      // Update existing record
      const merged = { ...existing, ...updateFields, updated_at: new Date().toISOString() };

      // Check if all APPLICABLE completion criteria are met
      const completed = isCompleted(merged);

      const updatePayload: Record<string, unknown> = {
        ...updateFields,
        updated_at: new Date().toISOString(),
      };

      if (completed && !existing.completed) {
        updatePayload.completed = true;
        updatePayload.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabaseAdmin
        .from("session_progress")
        .update(updatePayload)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error actualizando progreso:", error);
        return Response.json(
          { error: "Error al actualizar progreso." },
          { status: 500 }
        );
      }
      result = data;
    } else {
      // Insert new record — auto-mark N/A fields as true
      const insertPayload: Record<string, unknown> = {
        session_id: sessionId,
        user_id: user.id,
        video_watched: !hasVideo,       // auto-true if no video
        video_watch_seconds: 0,
        slides_viewed: !hasSlides,       // auto-true if no slides
        theory_read: !hasTheory,         // auto-true if no theory
        quiz_passed: !hasQuiz,           // auto-true if no quiz
        assignment_submitted: !hasAssignment, // auto-true if no assignment
        ai_lab_used: false,
        completed: false,
        ...updateFields,
      };

      // Check completion
      const completed = isCompleted(insertPayload);

      if (completed) {
        insertPayload.completed = true;
        insertPayload.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabaseAdmin
        .from("session_progress")
        .insert(insertPayload)
        .select()
        .single();

      if (error) {
        console.error("Error insertando progreso:", error);
        return Response.json(
          { error: "Error al crear progreso." },
          { status: 500 }
        );
      }
      result = data;
    }

    return Response.json({ progress: result });
  } catch (error) {
    console.error("Error en /api/sessions/[id]/progress:", error);
    return Response.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
