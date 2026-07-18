"use client";

// ============================================================
// ITSEIA Academy — Foros: Hook Realtime
// useForumRealtime(subjectId) — suscripcion Supabase Realtime
// Canal: forum:{subjectId} — escucha INSERT en forum_posts
// Entrega mensajes en < 2 segundos (FR-002)
// ============================================================

import { useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ForumPostWithAuthor } from "@/types/database";

interface UseForumRealtimeOptions {
  subjectId: string;
  onNewPost: (post: ForumPostWithAuthor) => void;
  onNewReply: (reply: ForumPostWithAuthor) => void;
  onPostUpdated: (update: { id: string; is_pinned?: boolean; is_deleted?: boolean }) => void;
}

export function useForumRealtime({
  subjectId,
  onNewPost,
  onNewReply,
  onPostUpdated,
}: UseForumRealtimeOptions) {
  // Necesitamos hidratar los autores cuando llega un evento Realtime
  // ya que Realtime solo entrega la fila, no los joins
  const fetchAuthor = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role")
      .eq("id", userId)
      .single();
    return data;
  }, []);

  useEffect(() => {
    if (!subjectId) return;

    const supabase = createClient();
    const channelName = `forum:${subjectId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "forum_posts",
          filter: `subject_id=eq.${subjectId}`,
        },
        async (payload) => {
          const row = payload.new as {
            id: string;
            subject_id: string;
            user_id: string;
            content: string;
            parent_id: string | null;
            is_pinned: boolean;
            is_deleted: boolean;
            created_at: string;
            updated_at: string;
          };

          if (row.is_deleted) return;

          // Hidratar el perfil del autor
          const author = await fetchAuthor(row.user_id);

          const postWithAuthor: ForumPostWithAuthor = {
            ...row,
            profiles: author ?? {
              id: row.user_id,
              full_name: "Usuario",
              avatar_url: null,
              role: "estudiante",
            },
            replies: [],
          };

          if (row.parent_id === null) {
            onNewPost(postWithAuthor);
          } else {
            onNewReply(postWithAuthor);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "forum_posts",
          filter: `subject_id=eq.${subjectId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            is_pinned: boolean;
            is_deleted: boolean;
          };
          onPostUpdated({
            id: row.id,
            is_pinned: row.is_pinned,
            is_deleted: row.is_deleted,
          });
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          // Canal activo — mensajes llegaran en tiempo real
        }
      });

    // Reconexion automatica: Supabase SDK maneja reconexion internamente.
    // El evento 'CLOSED' se puede detectar para logs o UI feedback.

    return () => {
      supabase.removeChannel(channel);
    };
  }, [subjectId, onNewPost, onNewReply, onPostUpdated, fetchAuthor]);
}
