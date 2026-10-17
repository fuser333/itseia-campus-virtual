// ============================================================
// ITSEIA Academy — GET|POST /api/forums/[subjectId]/posts
// GET: Lista posts del foro (raices + respuestas anidadas)
// POST: Publica un nuevo post o respuesta
// Requisito CES: Art. 61 RRA 2022 (comunicacion asincronica)
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ForumPostWithAuthor } from "@/types/database";

// ── Helper: verifica si el usuario tiene acceso a la materia ──
async function checkSubjectAccess(
  userId: string,
  subjectId: string
): Promise<{ hasAccess: boolean; role: string; isTeacher: boolean; isAdmin: boolean }> {
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const role = profile?.role ?? "";
  const isAdmin = ["super_admin", "admin", "coordinacion"].includes(role);

  if (isAdmin) {
    return { hasAccess: true, role, isTeacher: false, isAdmin: true };
  }

  // Verifica si es docente asignado a la materia
  const { data: subject } = await supabaseAdmin
    .from("subjects")
    .select("teacher_id, semester_id")
    .eq("id", subjectId)
    .single();

  const isTeacher = subject?.teacher_id === userId;
  if (isTeacher) {
    return { hasAccess: true, role, isTeacher: true, isAdmin: false };
  }

  // Verifica matricula activa
  const { data: semester } = await supabaseAdmin
    .from("semesters")
    .select("program_id")
    .eq("id", subject?.semester_id ?? "")
    .single();

  const { count } = await supabaseAdmin
    .from("enrollments")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .eq("program_id", semester?.program_id ?? "")
    .eq("status", "active");

  return {
    hasAccess: (count ?? 0) > 0,
    role,
    isTeacher: false,
    isAdmin: false,
  };
}

// ── GET /api/forums/[subjectId]/posts ──
export async function GET(
  request: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    const { subjectId } = await params;
    const url = new URL(request.url);
    const search = url.searchParams.get("q") ?? "";
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    // Autenticar
    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    const { hasAccess } = await checkSubjectAccess(user.id, subjectId);
    if (!hasAccess) {
      return Response.json({ error: "No tienes acceso a este foro." }, { status: 403 });
    }

    // Query posts raices (parent_id IS NULL), no eliminados, ordenados por pin y fecha
    let query = supabaseAdmin
      .from("forum_posts")
      .select(`
        id, subject_id, user_id, content, parent_id, is_pinned, is_deleted, created_at, updated_at,
        profiles!forum_posts_user_id_fkey ( id, full_name, avatar_url, role )
      `)
      .eq("subject_id", subjectId)
      .is("parent_id", null)
      .eq("is_deleted", false)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (search.trim()) {
      query = query.ilike("content", `%${search.trim()}%`);
    }

    const { data: posts, error: postsError } = await query;

    if (postsError) {
      console.error("Error fetching forum posts:", postsError);
      return Response.json({ error: "Error al cargar el foro." }, { status: 500 });
    }

    if (!posts || posts.length === 0) {
      return Response.json({ posts: [], total: 0, page, pageSize });
    }

    // Cargar respuestas para los posts de esta pagina
    const postIds = posts.map((p) => p.id);

    const { data: replies } = await supabaseAdmin
      .from("forum_posts")
      .select(`
        id, subject_id, user_id, content, parent_id, is_pinned, is_deleted, created_at, updated_at,
        profiles!forum_posts_user_id_fkey ( id, full_name, avatar_url, role )
      `)
      .in("parent_id", postIds)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true });

    // Agregar respuestas a cada post raiz
    const replyMap: Record<string, ForumPostWithAuthor[]> = {};
    for (const reply of replies ?? []) {
      const parentId = reply.parent_id!;
      if (!replyMap[parentId]) replyMap[parentId] = [];
      replyMap[parentId].push(reply as unknown as ForumPostWithAuthor);
    }

    const postsWithReplies = posts.map((post) => ({
      ...(post as unknown as ForumPostWithAuthor),
      replies: replyMap[post.id] ?? [],
    }));

    // Conteo total para paginacion
    const { count: totalCount } = await supabaseAdmin
      .from("forum_posts")
      .select("*", { count: "exact", head: true })
      .eq("subject_id", subjectId)
      .is("parent_id", null)
      .eq("is_deleted", false);

    return Response.json({
      posts: postsWithReplies,
      total: totalCount ?? 0,
      page,
      pageSize,
    });
  } catch (err) {
    console.error("Error en GET /api/forums/[subjectId]/posts:", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

// ── POST /api/forums/[subjectId]/posts ──
export async function POST(
  request: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    const { subjectId } = await params;

    // Autenticar
    const authClient = await createClient();
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: "Debes iniciar sesion." }, { status: 401 });
    }

    const { hasAccess, isTeacher, isAdmin } = await checkSubjectAccess(user.id, subjectId);
    if (!hasAccess) {
      return Response.json({ error: "No tienes acceso a este foro." }, { status: 403 });
    }

    const body = await request.json();
    const content: string = (body.content ?? "").trim();
    const parentId: string | null = body.parent_id ?? null;

    // Validacion
    if (!content) {
      return Response.json({ error: "El mensaje no puede estar vacio." }, { status: 400 });
    }
    if (content.length > 5000) {
      return Response.json({ error: "El mensaje no puede superar los 5,000 caracteres." }, { status: 400 });
    }

    // Si es una respuesta, verificar que el post padre pertenece a esta materia
    if (parentId) {
      const { data: parentPost } = await supabaseAdmin
        .from("forum_posts")
        .select("id, subject_id, parent_id")
        .eq("id", parentId)
        .single();

      if (!parentPost || parentPost.subject_id !== subjectId) {
        return Response.json({ error: "Post padre no encontrado en esta materia." }, { status: 400 });
      }
      // No permitir anidar respuestas de respuestas (maximo 1 nivel)
      if (parentPost.parent_id !== null) {
        return Response.json({ error: "No se pueden anidar respuestas de mas de un nivel." }, { status: 400 });
      }
    }

    // Insertar el post
    const { data: newPost, error: insertError } = await supabaseAdmin
      .from("forum_posts")
      .insert({
        subject_id: subjectId,
        user_id: user.id,
        content,
        parent_id: parentId,
        is_pinned: false,
        is_deleted: false,
      })
      .select(`
        id, subject_id, user_id, content, parent_id, is_pinned, is_deleted, created_at, updated_at,
        profiles!forum_posts_user_id_fkey ( id, full_name, avatar_url, role )
      `)
      .single();

    if (insertError) {
      console.error("Error inserting forum post:", insertError);
      return Response.json({ error: "Error al publicar el mensaje." }, { status: 500 });
    }

    // Crear notificacion para el docente (si el publicador no es el docente o admin)
    if (!isTeacher && !isAdmin) {
      const { data: subject } = await supabaseAdmin
        .from("subjects")
        .select("teacher_id, name")
        .eq("id", subjectId)
        .single();

      if (subject?.teacher_id) {
        const { data: authorProfile } = await supabaseAdmin
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        const authorName = authorProfile?.full_name ?? "Un estudiante";
        const actionText = parentId ? "respondio en" : "publico en";

        await supabaseAdmin.from("forum_notifications").insert({
          user_id: subject.teacher_id,
          post_id: newPost!.id,
          subject_id: subjectId,
          message: `${authorName} ${actionText} el foro de ${subject.name}.`,
          is_read: false,
        });
      }
    }

    return Response.json({ post: newPost }, { status: 201 });
  } catch (err) {
    console.error("Error en POST /api/forums/[subjectId]/posts:", err);
    return Response.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
