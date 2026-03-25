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

    // ── 3. Verificar que la sesion existe ──
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("id")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return Response.json(
        { error: "Sesion no encontrada." },
        { status: 404 }
      );
    }

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

      // Check if all completion criteria are met
      const completed =
        (merged.video_watched || false) &&
        (merged.slides_viewed || false) &&
        (merged.theory_read || false) &&
        (merged.quiz_passed || false) &&
        (merged.assignment_submitted || false) &&
        (merged.ai_lab_used || false);

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
      // Insert new record
      const insertPayload: Record<string, unknown> = {
        session_id: sessionId,
        user_id: user.id,
        video_watched: false,
        video_watch_seconds: 0,
        slides_viewed: false,
        theory_read: false,
        quiz_passed: false,
        assignment_submitted: false,
        ai_lab_used: false,
        completed: false,
        ...updateFields,
      };

      // Check completion
      const completed =
        (insertPayload.video_watched as boolean) &&
        (insertPayload.slides_viewed as boolean) &&
        (insertPayload.theory_read as boolean) &&
        (insertPayload.quiz_passed as boolean) &&
        (insertPayload.assignment_submitted as boolean) &&
        (insertPayload.ai_lab_used as boolean);

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
