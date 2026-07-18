// ============================================================
// ITSEIA Academy — Grade Submission API Route (POST)
// Docente califica una entrega de estudiante
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se ignora en Server Components
          }
        },
      },
    }
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: submissionId } = await params;

    // ── 1. Autenticar usuario ──
    const supabase = await getSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        { error: "Debes iniciar sesion." },
        { status: 401 }
      );
    }

    // ── 2. Verificar rol ──
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const allowedRoles = ["super_admin", "admin", "coordinacion", "docente"];
    if (!profile || !allowedRoles.includes(profile.role)) {
      return Response.json(
        { error: "No tienes permisos para calificar entregas." },
        { status: 403 }
      );
    }

    // ── 3. Parsear body ──
    const body = await request.json();
    const { grade, feedback } = body as {
      grade: number;
      feedback?: string | null;
    };

    if (grade === undefined || grade === null || isNaN(grade) || grade < 0) {
      return Response.json(
        { error: "La nota es requerida y debe ser un numero positivo." },
        { status: 400 }
      );
    }

    // ── 4. Verificar que la submission existe ──
    const { data: submission, error: subError } = await supabase
      .from("submissions")
      .select("id, assignment_id")
      .eq("id", submissionId)
      .single();

    if (subError || !submission) {
      return Response.json(
        { error: "Entrega no encontrada." },
        { status: 404 }
      );
    }

    // ── 5. Si es docente (no admin), verificar que la materia le pertenece ──
    if (profile.role === "docente") {
      // submission -> assignment -> session -> subject -> teacher_id
      const { data: assignment } = await supabase
        .from("assignments")
        .select("session_id")
        .eq("id", submission.assignment_id)
        .single();

      if (assignment) {
        const { data: session } = await supabase
          .from("sessions")
          .select("subject_id")
          .eq("id", assignment.session_id)
          .single();

        if (session) {
          const { data: subject } = await supabase
            .from("subjects")
            .select("teacher_id")
            .eq("id", session.subject_id)
            .single();

          if (subject && subject.teacher_id !== user.id) {
            return Response.json(
              { error: "No tienes permisos para calificar esta entrega." },
              { status: 403 }
            );
          }
        }
      }
    }

    // ── 6. Actualizar submission ──
    const { error: updateError } = await supabase
      .from("submissions")
      .update({
        grade,
        feedback: feedback || null,
        status: "graded",
        graded_by: user.id,
        graded_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    if (updateError) {
      console.error("Error actualizando submission:", updateError);
      return Response.json(
        { error: "Error al calificar la entrega." },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      grade,
      feedback: feedback || null,
      graded_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error en /api/assignments/[id]/grade:", error);
    return Response.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
