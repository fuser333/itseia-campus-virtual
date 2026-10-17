// ============================================================
// ITSEIA Academy — PATCH|DELETE /api/forums/[subjectId]/posts/[postId]
// PATCH: soft-delete (is_deleted=true) por autor, docente o admin
// DELETE: hard delete solo admin
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

    // Obtener perfil y post actual
    const [profileRes, postRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("role").eq("id", user.id).single(),
      supabaseAdmin
        .from("forum_posts")
        .select("id, user_id, subject_id, is_pinned, is_deleted")
        .eq("id", postId)
        .eq("subject_id", subjectId)
        .single(),
    ]);

    const profile = profileRes.data;
    const post = postRes.data;

    if (!post) {
      return Response.json({ error: "Post no encontrado." }, { status: 404 });
    }

    const role = profile?.role ?? "";
    const isAdmin = ["super_admin", "admin", "coordinacion"].includes(role);

    // Verificar si es docente de esta materia
    const { data: subject } = await supabaseAdmin
      .from("subjects")
      .select("teacher_id")
      .eq("id", subjectId)
      .single();
    const isTeacher = subject?.teacher_id === user.id;

    const isOwner = post.user_id === user.id;
    const canModerate = isAdmin || isTeacher;

    const body = await request.json();

    // Construir el patch permitido por rol
    const updatePayload: Record<string, unknown> = {};

    // Solo docente/admin puede cambiar is_pinned
    if ("is_pinned" in body) {
      if (!canModerate) {
        return Response.json({ error: "No tienes permiso para fijar mensajes." }, { status: 403 });
      }
      updatePayload.is_pinned = Boolean(body.is_pinned);
    }

    // Soft delete: autor puede eliminar el propio; docente/admin cualquiera
    if ("is_deleted" in body && body.is_deleted === true) {
      if (!isOwner && !canModerate) {
        return Response.json({ error: "No tienes permiso para eliminar este mensaje." }, { status: 403 });
      }
      updatePayload.is_deleted = true;
    }

    if (Object.keys(updatePayload).length === 0) {
      return Response.json({ error: "Sin cambios validos." }, { status: 400 });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("forum_posts")
      .update(updatePayload)
      .eq("id", postId)
      .select("id, is_pinned, is_deleted, updated_at")
      .single();

    if (updateError) {
      console.error("Error updating forum post:", updateError);
      return Response.json({ error: "Error al actualizar el mensaje." }, { status: 500 });
    }

    return Response.json({ post: updated });
  } catch (err) {
    console.error("Error en PATCH /api/forums/[subjectId]/posts/[postId]:", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
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

    if (!["super_admin", "admin"].includes(profile?.role ?? "")) {
      return Response.json({ error: "Solo los administradores pueden hacer esta operacion." }, { status: 403 });
    }

    const { error: deleteError } = await supabaseAdmin
      .from("forum_posts")
      .delete()
      .eq("id", postId)
      .eq("subject_id", subjectId);

    if (deleteError) {
      console.error("Error deleting forum post:", deleteError);
      return Response.json({ error: "Error al eliminar el mensaje." }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error en DELETE /api/forums/[subjectId]/posts/[postId]:", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
