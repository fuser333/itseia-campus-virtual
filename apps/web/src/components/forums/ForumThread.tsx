"use client";

// ============================================================
// ITSEIA Academy — ForumThread
// Lista paginada de posts del foro de una materia
// - Posts fijados al tope
// - Buscador por palabra clave (ilike via API)
// - Realtime: mensajes nuevos sin recargar pagina (< 2s)
// - Acciones contextuales por rol (estudiante / docente-admin)
// ============================================================

import { useState, useCallback, useEffect, useRef } from "react";
import { Search, MessageSquarePlus, Loader2, MessagesSquare } from "lucide-react";
import { ForumPost } from "./ForumPost";
import { ForumComposer } from "./ForumComposer";
import { useForumRealtime } from "@/features/forums/realtime";
import type { ForumPostWithAuthor } from "@/types/database";

interface ForumThreadProps {
  subjectId: string;
  currentUserId: string;
  canModerate: boolean;
  initialPosts?: ForumPostWithAuthor[];
  initialTotal?: number;
}

const PAGE_SIZE = 20;

export function ForumThread({
  subjectId,
  currentUserId,
  canModerate,
  initialPosts = [],
  initialTotal = 0,
}: ForumThreadProps) {
  const [posts, setPosts] = useState<ForumPostWithAuthor[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce del buscador
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  // Fetch posts cuando cambia la busqueda o pagina
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(page),
          ...(debouncedSearch ? { q: debouncedSearch } : {}),
        });
        const res = await fetch(`/api/forums/${subjectId}/posts?${params}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Error al cargar el foro.");
          return;
        }
        const data = await res.json();
        setPosts(data.posts ?? []);
        setTotal(data.total ?? 0);
      } catch {
        setError("Error de conexion.");
      } finally {
        setLoading(false);
      }
    }

    // Solo si ya paso la carga inicial y el usuario interactua
    if (page > 1 || debouncedSearch !== "") {
      fetchPosts();
    }
  }, [subjectId, page, debouncedSearch]);

  // Realtime: nuevo post raiz
  const handleNewPost = useCallback((newPost: ForumPostWithAuthor) => {
    // Solo agregar si no existe ya (evitar duplicados del propio publisher)
    setPosts((prev) => {
      if (prev.find((p) => p.id === newPost.id)) return prev;
      // Posts fijados van al frente, el resto en orden cronologico descendente
      const updated = [{ ...newPost, replies: [] }, ...prev];
      return updated.sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) return b.is_pinned ? 1 : -1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    });
    setTotal((t) => t + 1);
  }, []);

  // Realtime: nueva respuesta
  const handleNewReply = useCallback((reply: ForumPostWithAuthor) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== reply.parent_id) return post;
        const alreadyExists = (post.replies ?? []).find((r) => r.id === reply.id);
        if (alreadyExists) return post;
        return {
          ...post,
          replies: [...(post.replies ?? []), reply],
        };
      })
    );
  }, []);

  // Realtime: post actualizado (pin, delete)
  const handlePostUpdated = useCallback(
    (update: { id: string; is_pinned?: boolean; is_deleted?: boolean }) => {
      if (update.is_deleted) {
        // Puede ser un post raiz o una respuesta
        setPosts((prev) => {
          const filtered = prev.filter((p) => p.id !== update.id);
          return filtered.map((post) => ({
            ...post,
            replies: (post.replies ?? []).filter((r) => r.id !== update.id),
          }));
        });
        return;
      }
      setPosts((prev) =>
        prev
          .map((post) => {
            if (post.id !== update.id) return post;
            return { ...post, ...update };
          })
          .sort((a, b) => {
            if (a.is_pinned !== b.is_pinned) return b.is_pinned ? 1 : -1;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          })
      );
    },
    []
  );

  useForumRealtime({
    subjectId,
    onNewPost: handleNewPost,
    onNewReply: handleNewReply,
    onPostUpdated: handlePostUpdated,
  });

  // Handler: nuevo post publicado por el usuario actual
  function handleOwnPostPosted(post: Record<string, unknown>) {
    setShowComposer(false);
    handleNewPost(post as unknown as ForumPostWithAuthor);
  }

  // Handler: nueva respuesta del usuario actual
  function handleOwnReplyPosted(reply: Record<string, unknown>, parentId: string) {
    const replyWithParent = { ...(reply as unknown as ForumPostWithAuthor), parent_id: parentId };
    handleNewReply(replyWithParent);
  }

  // Handler: pin toggle
  function handlePinToggle(postId: string, newState: boolean) {
    handlePostUpdated({ id: postId, is_pinned: newState });
  }

  // Handler: eliminar post o respuesta
  function handleDelete(id: string) {
    handlePostUpdated({ id, is_deleted: true });
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasMore = page < totalPages;

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#1F2F58]/25 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar en el foro..."
            className="w-full rounded-lg border border-[#1F2F58]/10 bg-white py-2 pl-9 pr-3 text-sm text-[#1F2F58] placeholder:text-[#1F2F58]/30 focus:border-[#73B8E7] focus:outline-none focus:ring-1 focus:ring-[#73B8E7] transition-colors"
          />
        </div>

        {/* New post button */}
        <button
          type="button"
          onClick={() => setShowComposer((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-[#1F2F58] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A3F6E] shrink-0"
        >
          <MessageSquarePlus className="size-4" />
          Nueva pregunta
        </button>
      </div>

      {/* Composer for new post */}
      {showComposer && (
        <div className="rounded-xl border border-[#73B8E7]/30 bg-[#73B8E7]/5 p-4">
          <h3 className="mb-3 text-sm font-semibold text-[#0A1628]">Nueva publicacion</h3>
          <ForumComposer
            subjectId={subjectId}
            onPosted={handleOwnPostPosted}
            onCancel={() => setShowComposer(false)}
            placeholder="Escribe tu pregunta o comentario para el grupo..."
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
        </div>
      )}

      {/* Posts list */}
      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <MessagesSquare className="size-12 text-[#1F2F58]/10 mb-4" />
          <h3 className="text-base font-semibold text-[#0A1628]">
            {debouncedSearch ? "Sin resultados" : "El foro esta esperando tu primera pregunta"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-[#1F2F58]/40">
            {debouncedSearch
              ? `No hay mensajes que contengan "${debouncedSearch}".`
              : "Sé el primero en publicar una pregunta o comentario."}
          </p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => (
            <ForumPost
              key={post.id}
              post={post}
              subjectId={subjectId}
              currentUserId={currentUserId}
              canModerate={canModerate}
              onReplyPosted={handleOwnReplyPosted}
              onPinToggle={handlePinToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-[#1F2F58]/10 bg-white px-3 py-1.5 text-xs font-medium text-[#1F2F58]/60 hover:bg-[#1F2F58]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <span className="text-xs text-[#1F2F58]/40">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={!hasMore}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-[#1F2F58]/10 bg-white px-3 py-1.5 text-xs font-medium text-[#1F2F58]/60 hover:bg-[#1F2F58]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Total count */}
      {total > 0 && !debouncedSearch && (
        <p className="text-center text-[11px] text-[#1F2F58]/25">
          {total} {total === 1 ? "publicacion" : "publicaciones"} en el foro
        </p>
      )}
    </div>
  );
}
