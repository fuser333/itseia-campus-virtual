"use client";

// ============================================================
// ITSEIA Academy — ForumReply
// Card compacto para una respuesta a un post del foro
// Version simplificada de ForumPost, sin replies anidadas
// ============================================================

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ForumPostWithAuthor } from "@/types/database";

interface ForumReplyProps {
  reply: ForumPostWithAuthor;
  subjectId: string;
  currentUserId: string;
  canModerate: boolean;
  onDelete: (replyId: string) => void;
}

function formatEcuadorTime(isoString: string): string {
  return new Date(isoString).toLocaleString("es-EC", {
    timeZone: "America/Guayaquil",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getAvatarColor(id: string): string {
  const colors = [
    "bg-[#1F2F58] text-white",
    "bg-[#73B8E7] text-[#1F2F58]",
    "bg-[#FBBC0C] text-[#1F2F58]",
    "bg-[#F0846D] text-white",
    "bg-emerald-600 text-white",
    "bg-purple-600 text-white",
  ];
  const index = id.charCodeAt(0) % colors.length;
  return colors[index];
}

const EXPAND_THRESHOLD = 500;

export function ForumReply({
  reply,
  subjectId,
  currentUserId,
  canModerate,
  onDelete,
}: ForumReplyProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isOwner = reply.user_id === currentUserId;
  const isLong = reply.content.length > EXPAND_THRESHOLD;
  const displayContent =
    isLong && !expanded ? reply.content.slice(0, EXPAND_THRESHOLD) : reply.content;

  const authorName = reply.profiles?.full_name ?? "Usuario";
  const authorRole = reply.profiles?.role ?? "estudiante";
  const isTeacherOrAdmin = ["docente", "admin", "super_admin", "coordinacion"].includes(authorRole);

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/forums/${subjectId}/posts/${reply.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_deleted: true }),
      });
      if (res.ok) {
        onDelete(reply.id);
      }
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="flex items-start gap-2.5 py-1">
      {/* Mini avatar */}
      <div
        className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${getAvatarColor(reply.user_id)}`}
      >
        {reply.profiles?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reply.profiles.avatar_url}
            alt={authorName}
            className="size-7 rounded-full object-cover"
          />
        ) : (
          getInitials(authorName)
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Author row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <span className="text-xs font-semibold text-[#0A1628]">{authorName}</span>

          {isTeacherOrAdmin && (
            <Badge className="border-none bg-[#1F2F58]/10 text-[#1F2F58] text-[9px] font-medium px-1 py-0">
              {authorRole === "docente" ? "Docente" : "Admin"}
            </Badge>
          )}

          <span className="ml-auto text-[10px] text-[#1F2F58]/30 shrink-0">
            {formatEcuadorTime(reply.created_at)}
          </span>
        </div>

        {/* Content */}
        <p className="text-xs text-[#1F2F58]/70 leading-relaxed whitespace-pre-wrap break-words">
          {displayContent}
          {isLong && !expanded && "..."}
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-0.5 text-[10px] text-[#73B8E7] hover:underline font-medium"
          >
            {expanded ? "Ver menos" : "Ver mas"}
          </button>
        )}

        {/* Delete action */}
        {(isOwner || canModerate) && (
          <div className="mt-1 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className={`h-6 gap-1 px-1.5 text-[10px] hover:bg-red-50 ${
                confirmDelete
                  ? "text-red-600 font-semibold"
                  : "text-[#1F2F58]/20 hover:text-red-500"
              }`}
            >
              <Trash2 className="size-2.5" />
              {confirmDelete ? "Confirmar" : "Eliminar"}
            </Button>
            {confirmDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(false)}
                className="h-6 px-1.5 text-[10px] text-[#1F2F58]/30 hover:text-[#1F2F58]/60"
              >
                Cancelar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
