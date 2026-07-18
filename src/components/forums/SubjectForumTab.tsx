"use client";

// ============================================================
// ITSEIA Academy — SubjectForumTab
// Wrapper cliente para el tab de Foro en la pagina de materia
// Carga los posts iniciales y renderiza ForumThread
// ============================================================

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ForumThread } from "./ForumThread";
import type { ForumPostWithAuthor } from "@/types/database";

interface SubjectForumTabProps {
  subjectId: string;
  currentUserId: string;
  canModerate: boolean;
}

export function SubjectForumTab({
  subjectId,
  currentUserId,
  canModerate,
}: SubjectForumTabProps) {
  const [posts, setPosts] = useState<ForumPostWithAuthor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInitial() {
      try {
        const res = await fetch(`/api/forums/${subjectId}/posts`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Error al cargar el foro.");
          return;
        }
        const data = await res.json();
        setPosts(data.posts ?? []);
        setTotal(data.total ?? 0);
      } catch {
        setError("Error de conexion al cargar el foro.");
      } finally {
        setLoading(false);
      }
    }

    fetchInitial();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <ForumThread
      subjectId={subjectId}
      currentUserId={currentUserId}
      canModerate={canModerate}
      initialPosts={posts}
      initialTotal={total}
    />
  );
}
