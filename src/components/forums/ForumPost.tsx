"use client";

// ============================================================
// ITSEIA Academy — ForumPost
// Card de un post principal con acciones contextuales por rol
// Incluye: avatar, autor, timestamp UTC-5, badge Fijado,
// boton Responder, opciones Fijar/Eliminar para docente/admin
// ============================================================

import { useState } from "react";
import { Pin, Trash2, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ForumComposer } from "./ForumComposer";
import { ForumReply } from "./ForumReply";
import type { ForumPostWithAuthor } from "@/types/database";

interface ForumPostProps {
  post: ForumPostWithAuthor;
  subjectId: string;
  currentUserId: string;
  canModerate: boolean; // docente o admin
  onReplyPosted: (reply: Record<string, unknown>, parentId: string) => void;
  onPinToggle: (postId: string, newState: boolean) => void;
  onDelete: (postId: string) => void;
}

// Formatea la fecha en UTC-5 (Ecuador)
function formatEcuadorTime(isoString: string): string {
  return new Date(isoString).toLocaleString("es-EC", {
    timeZone: "America/Guayaquil",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Genera initiales de avatar a partir del nombre
function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Paleta de colores para avatares (basada en hash del id)
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

// Trunca el contenido para preview de respuesta
function truncate(text: string, max = 120): string {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

const EXPAND_THRESHOLD = 500;

export function ForumPost({
  post,
  subjectId,
  currentUserId,
  canModerate,
  onReplyPosted,
  onPinToggle,
  onDelete,
}: ForumPostProps) {
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [pinning, setPinning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isOwner = post.user_id === currentUserId;
  const isLong = post.content.length > EXPAND_THRESHOLD;
  const displayContent =
    isLong && !expanded ? post.content.slice(0, EXPAND_THRESHOLD) : post.content;

  const replyCount = post.replies?.length ?? 0;
  const authorName = post.profiles?.full_name ?? "Usuario";
  const authorRole = post.profiles?.role ?? "estudiante";
  const isTeacherOrAdmin = ["docente", "admin", "super_admin", "coordinacion"].includes(authorRole);

  async function handlePin() {
    setPinning(true);
    try {
      const res = await fetch(
        `/api/forums/${subjectId}/posts/${post.id}/pin`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_pinned: !post.is_pinned }),
        }
      );
      if (res.ok) {
        onPinToggle(post.id, !post.is_pinned);
      }
    } finally {
      setPinning(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/forums/${subjectId}/posts/${post.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_deleted: true }),
        }
      );
      if (res.ok) {
        onDelete(post.id);
      }
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <article
      className={`rounded-xl border transition-all ${
        post.is_pinned
          ? "border-[#FBBC0C]/40 bg-[#FBBC0C]/5 shadow-sm"
          : "border-[#1F2F58]/8 bg-white hover:border-[#73B8E7]/20"
      }`}
    >
      {/* Post header */}
      <div className="flex items-start gap-3 p-4">
        {/* Avatar */}
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${getAvatarColor(post.user_id)}`}
          title={authorName}
        >
          {post.profiles?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.profiles.avatar_url}
              alt={authorName}
              className="size-9 rounded-full object-cover"
            />
          ) : (
            getInitials(authorName)
          )}
        </div>

        {/* Author + metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-[#0A1628]">{authorName}</span>

            {isTeacherOrAdmin && (
              <Badge className="border-none bg-[#1F2F58]/10 text-[#1F2F58] text-[10px] font-medium px-1.5 py-0">
                {authorRole === "docente" ? "Docente" : "Admin"}
              </Badge>
            )}

            {post.is_pinned && (
              <Badge className="border-none bg-[#FBBC0C]/20 text-[#92650a] text-[10px] font-semibold px-1.5 py-0 flex items-center gap-0.5">
                <Pin className="size-2.5" />
                Fijado
              </Badge>
            )}

            <span className="ml-auto text-[11px] text-[#1F2F58]/35 shrink-0">
              {formatEcuadorTime(post.created_at)}
            </span>
          </div>

          {/* Content */}
          <div className="mt-2 text-sm text-[#1F2F58]/80 leading-relaxed whitespace-pre-wrap break-words">
            {displayContent}
            {isLong && !expanded && "..."}
          </div>

          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs text-[#73B8E7] hover:underline font-medium"
            >
              {expanded ? "Ver menos" : "Ver mas"}
            </button>
          )}
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-1 border-t border-[#1F2F58]/5 px-4 py-2">
        {/* Reply button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowReplyComposer((v) => !v)}
          className="h-7 gap-1 px-2 text-xs text-[#1F2F58]/50 hover:text-[#1F2F58]/80 hover:bg-[#1F2F58]/5"
        >
          <MessageSquare className="size-3.5" />
          Responder
        </Button>

        {/* Toggle replies */}
        {replyCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowReplies((v) => !v)}
            className="h-7 gap-1 px-2 text-xs text-[#1F2F58]/40 hover:text-[#1F2F58]/70 hover:bg-[#1F2F58]/5"
          >
            {showReplies ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
            {replyCount} {replyCount === 1 ? "respuesta" : "respuestas"}
          </Button>
        )}

        {/* Moderate actions (docente/admin) */}
        {canModerate && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePin}
            disabled={pinning}
            className={`ml-auto h-7 gap-1 px-2 text-xs hover:bg-[#FBBC0C]/10 ${
              post.is_pinned
                ? "text-[#FBBC0C] hover:text-amber-600"
                : "text-[#1F2F58]/30 hover:text-[#FBBC0C]"
            }`}
            title={post.is_pinned ? "Desfijar" : "Fijar mensaje"}
          >
            <Pin className="size-3.5" />
            {post.is_pinned ? "Desfijar" : "Fijar"}
          </Button>
        )}

        {/* Delete: autor o moderador */}
        {(isOwner || canModerate) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className={`h-7 gap-1 px-2 text-xs hover:bg-red-50 ${
              confirmDelete
                ? "text-red-600 font-semibold"
                : "text-[#1F2F58]/25 hover:text-red-500"
            } ${canModerate ? "" : "ml-auto"}`}
            title="Eliminar mensaje"
          >
            <Trash2 className="size-3.5" />
            {confirmDelete ? "Confirmar" : "Eliminar"}
          </Button>
        )}

        {confirmDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setConfirmDelete(false)}
            className="h-7 px-2 text-xs text-[#1F2F58]/40 hover:text-[#1F2F58]/70"
          >
            Cancelar
          </Button>
        )}
      </div>

      {/* Reply composer */}
      {showReplyComposer && (
        <div className="border-t border-[#1F2F58]/5 px-4 pb-4 pt-3">
          <ForumComposer
            subjectId={subjectId}
            parentId={post.id}
            parentPreview={truncate(post.content)}
            onPosted={(reply) => {
              onReplyPosted(reply, post.id);
              setShowReplyComposer(false);
            }}
            onCancel={() => setShowReplyComposer(false)}
            placeholder={`Responde a ${authorName}...`}
            autoFocus
          />
        </div>
      )}

      {/* Replies */}
      {showReplies && replyCount > 0 && (
        <div className="border-t border-[#1F2F58]/5 px-4 pb-3">
          <div className="ml-4 mt-3 space-y-2 border-l-2 border-[#73B8E7]/20 pl-4">
            {(post.replies ?? []).map((reply) => (
              <ForumReply
                key={reply.id}
                reply={reply}
                currentUserId={currentUserId}
                canModerate={canModerate}
                subjectId={subjectId}
                onDelete={(replyId) => onDelete(replyId)}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
