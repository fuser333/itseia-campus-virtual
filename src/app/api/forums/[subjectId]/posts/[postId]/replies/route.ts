// ============================================================
// ITSEIA Academy — GET|POST /api/forums/[subjectId]/posts/[postId]/replies
// GET: Respuestas de un post especifico
// POST: Nueva respuesta (delegado al POST de posts con parent_id)
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
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

    // Verificar que el post padre existe y pertenece a la materia
    const { data: parentPost } = await supabaseAdmin
      .from("forum_posts")
      .select("id, subject_id")
      .eq("id", postId)
      .eq("subject_id", subjectId)
      .single();

    if (!parentPost) {
      return Response.json({ error: "Post no encontrado." }, { status: 404 });
    }

    const { data: replies, error: repliesError } = await supabaseAdmin
      .from("forum_posts")
      .select(`
        id, subject_id, user_id, content, parent_id, is_pinned, is_deleted, created_at, updated_at,
        profiles!forum_posts_user_id_fkey ( id, full_name, avatar_url, role )
      `)
      .eq("parent_id", postId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true });

    if (repliesError) {
      console.error("Error fetching replies:", repliesError);
      return Response.json({ error: "Error al cargar las respuestas." }, { status: 500 });
    }

    return Response.json({ replies: replies ?? [] });
  } catch (err) {
    console.error("Error en GET .../replies:", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

// POST de replies se maneja via /api/forums/[subjectId]/posts con body.parent_id
// Este endpoint POST es un alias conveniente
export async function POST(
  request: Request,
  { params }: { params: Promise<{ subjectId: string; postId: string }> }
) {
  const { subjectId, postId } = await params;
  const body = await request.json();

  // Reenviar al endpoint de posts con el parent_id inyectado
  const forwardUrl = new URL(request.url);
  forwardUrl.pathname = `/api/forums/${subjectId}/posts`;

  return fetch(forwardUrl.toString(), {
    method: "POST",
    headers: request.headers,
    body: JSON.stringify({ ...body, parent_id: postId }),
  });
}
