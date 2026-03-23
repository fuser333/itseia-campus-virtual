// ============================================================
// ITSEIA Academy — PATCH /api/forums/[subjectId]/posts/[postId]/pin
// Fijar / desfijar un post del foro (solo docente o admin)
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ subjectId: string; postId: string }> }
) {
  try {
    const { subjectId, postId } = await params;

    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = ["super_admin", "admin", "coordinacion"].includes(profile?.role ?? "");

    // Verificar docente de la materia
    const { data: subject } = await supabaseAdmin
      .from("subjects")
      .select("teacher_id")
      .eq("id", subjectId)
      .single();
    const isTeacher = subject?.teacher_id === user.id;

    if (!isAdmin && !isTeacher) {
      return Response.json({ error: "Solo el docente o admin puede fijar mensajes." }, { status: 403 });
    }

    // Verificar que el post existe en la materia
    const { data: post } = await supabaseAdmin
      .from("forum_posts")
      .select("id, is_pinned")
      .eq("id", postId)
      .eq("subject_id", subjectId)
      .is("parent_id", null) // Solo se fijan posts raiz
      .single();

    if (!post) {
      return Response.json({ error: "Post no encontrado." }, { status: 404 });
    }

    const body = await request.json();
    const newPinnedState: boolean =
      typeof body.is_pinned === "boolean" ? body.is_pinned : !post.is_pinned;

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("forum_posts")
      .update({ is_pinned: newPinnedState })
      .eq("id", postId)
      .select("id, is_pinned, updated_at")
      .single();

    if (updateError) {
      console.error("Error pinning forum post:", updateError);
      return Response.json({ error: "Error al actualizar el estado del mensaje." }, { status: 500 });
    }

    return Response.json({ post: updated });
  } catch (err) {
    console.error("Error en PATCH .../pin:", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
