// ============================================================
// ITSEIA Academy — Foros: Queries del servidor
// Funciones para obtener posts, metricas y notificaciones
// Usadas en API routes y en RSC (React Server Components)
// ============================================================

import { supabaseAdmin } from "@/lib/supabase/admin";
import type {
  ForumPostWithAuthor,
  ForumMetricsWithSubject,
} from "@/types/database";

/**
 * Obtiene los posts de un foro con sus respuestas.
 * Ordenados: fijados primero, luego por fecha descendente.
 */
export async function getPostsForSubject(
  subjectId: string,
  { page = 1, pageSize = 20, search = "" } = {}
): Promise<{ posts: ForumPostWithAuthor[]; total: number }> {
  const offset = (page - 1) * pageSize;

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

  const { data: posts, error } = await query;

  if (error || !posts?.length) {
    return { posts: [], total: 0 };
  }

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

  const replyMap: Record<string, ForumPostWithAuthor[]> = {};
  for (const reply of replies ?? []) {
    const pid = reply.parent_id!;
    if (!replyMap[pid]) replyMap[pid] = [];
    replyMap[pid].push(reply as unknown as ForumPostWithAuthor);
  }

  const postsWithReplies = posts.map((post) => ({
    ...(post as unknown as ForumPostWithAuthor),
    replies: replyMap[post.id] ?? [],
  }));

  const { count: totalCount } = await supabaseAdmin
    .from("forum_posts")
    .select("*", { count: "exact", head: true })
    .eq("subject_id", subjectId)
    .is("parent_id", null)
    .eq("is_deleted", false);

  return { posts: postsWithReplies, total: totalCount ?? 0 };
}

/**
 * Metricas de participacion de foros para el panel admin.
 * Incluye datos de la materia y tasa de participacion.
 *
 * PERFORMANCE FIX (30 may 2026):
 * - Antes: loop secuencial de N subjects × 3 queries = ~134s con 191 subjects.
 * - Ahora: queries paralelas en chunks de 30 subjects = ~3s con 191 subjects.
 *   Cada subject hace sus 3 queries en paralelo (Promise.all interno).
 *   El chunk de 30 evita saturar Supabase con cientos de conexiones simultáneas.
 */
export async function getForumMetricsAll(): Promise<ForumMetricsWithSubject[]> {
  // Obtener todas las materias activas
  const { data: subjects } = await supabaseAdmin
    .from("subjects")
    .select("id, name, code, semester_id")
    .eq("is_active", true);

  if (!subjects?.length) return [];

  // Para cada subject: 3 queries en paralelo
  async function buildMetric(subject: { id: string; name: string; code: string; semester_id: string }): Promise<ForumMetricsWithSubject> {
    const [metricsRes, semesterRes] = await Promise.all([
      supabaseAdmin.rpc("get_forum_metrics", { p_subject_id: subject.id }).single(),
      supabaseAdmin.from("semesters").select("program_id").eq("id", subject.semester_id).single(),
    ]);

    const metrics = metricsRes.data;
    const semester = semesterRes.data as { program_id?: string } | null;

    let totalEnrolled = 0;
    if (semester?.program_id) {
      const { count } = await supabaseAdmin
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("program_id", semester.program_id)
        .eq("status", "active");
      totalEnrolled = count ?? 0;
    }

    const uniqueAuthors = (metrics as { unique_authors?: number } | null)?.unique_authors ?? 0;
    const participationRate =
      totalEnrolled > 0 ? Math.round((uniqueAuthors / totalEnrolled) * 100) : 0;

    return {
      subject_id: subject.id,
      subject_name: subject.name,
      subject_code: subject.code,
      total_posts: (metrics as { total_posts?: number } | null)?.total_posts ?? 0,
      total_replies: (metrics as { total_replies?: number } | null)?.total_replies ?? 0,
      unique_authors: uniqueAuthors,
      last_post_at: (metrics as { last_post_at?: string } | null)?.last_post_at ?? null,
      is_inactive: (metrics as { is_inactive?: boolean } | null)?.is_inactive ?? true,
      total_enrolled: totalEnrolled,
      participation_rate: participationRate,
    };
  }

  // Procesar en chunks de 30 subjects a la vez (≤90 queries simultáneas)
  const CHUNK_SIZE = 30;
  const results: ForumMetricsWithSubject[] = [];
  for (let i = 0; i < subjects.length; i += CHUNK_SIZE) {
    const chunk = subjects.slice(i, i + CHUNK_SIZE);
    const chunkResults = await Promise.all(chunk.map(buildMetric));
    results.push(...chunkResults);
  }

  // Ordenar por mas activos primero
  return results.sort((a, b) => b.total_posts - a.total_posts);
}

/**
 * Cuenta notificaciones no leidas del foro para un usuario (docente).
 */
export async function getUnreadForumNotificationsCount(userId: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from("forum_notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  return count ?? 0;
}
