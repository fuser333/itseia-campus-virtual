"use client";

// ============================================================
// ITSEIA Academy — ConversationHistory
// Lista paginada de conversaciones pasadas del AI Lab
// Feature: 010-ai-lab-advanced
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, ChevronDown, Loader2, Brain, Star, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AIConversationWithSession } from "@/types/database";

interface ConversationHistoryProps {
  sessionId?: string | null;
  onSelectConversation?: (conv: AIConversationWithSession) => void;
  className?: string;
}

export default function ConversationHistory({
  sessionId,
  onSelectConversation,
  className,
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<AIConversationWithSession[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchConversations = useCallback(
    async (pageNum: number, replace = false) => {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);

      try {
        const params = new URLSearchParams({ page: String(pageNum) });
        if (sessionId) params.set("session_id", sessionId);

        const res = await fetch(`/api/ai-lab/conversations?${params}`);
        if (!res.ok) throw new Error("Error cargando historial");

        const json = await res.json() as {
          data: AIConversationWithSession[];
          has_more: boolean;
        };

        setConversations((prev) =>
          replace ? json.data : [...prev, ...json.data]
        );
        setHasMore(json.has_more);
      } catch (err) {
        console.error("ConversationHistory fetch error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sessionId]
  );

  useEffect(() => {
    setPage(0);
    fetchConversations(0, true);
  }, [fetchConversations]);

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchConversations(nextPage, false);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} dias`;
    return d.toLocaleDateString("es-EC", { day: "numeric", month: "short" });
  }

  function getFirstUserMessage(conv: AIConversationWithSession): string {
    const userMsg = conv.messages.find((m) => m.role === "user");
    if (!userMsg) return "Sin mensajes";
    return userMsg.content.slice(0, 80) + (userMsg.content.length > 80 ? "..." : "");
  }

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Loader2 className="w-6 h-6 text-[#73B8E7] animate-spin" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4 text-center",
          className
        )}
      >
        <div className="w-12 h-12 rounded-2xl bg-[#1F2F58]/40 flex items-center justify-center mb-4">
          <History className="w-6 h-6 text-[#73B8E7]/50" />
        </div>
        <p className="text-sm text-gray-400">No hay conversaciones guardadas aun</p>
        <p className="text-xs text-gray-600 mt-1">
          Comienza una conversacion en el chat para ver el historial aqui
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelectConversation?.(conv)}
          className="w-full text-left px-4 py-3 rounded-xl bg-[#1F2F58]/20 border border-[#1F2F58]/30 hover:bg-[#1F2F58]/40 hover:border-[#73B8E7]/30 transition-all group"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0A1628]/60 flex items-center justify-center shrink-0 mt-0.5">
              <Brain className="w-4 h-4 text-[#73B8E7]/70" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
                  {conv.title ?? "Conversacion"}
                </p>
                {conv.favorito && (
                  <Star className="w-3 h-3 text-[#FBBC0C] shrink-0 fill-[#FBBC0C]" />
                )}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {getFirstUserMessage(conv)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-[#73B8E7]/60 font-medium">
                  {conv.model}
                </span>
                <span className="text-[10px] text-gray-600">·</span>
                <span className="text-[10px] text-gray-600">
                  {conv.messages.length} msgs
                </span>
                {conv.sessions && (
                  <>
                    <span className="text-[10px] text-gray-600">·</span>
                    <span className="text-[10px] text-[#FBBC0C]/70 truncate">
                      Sesion {(conv.sessions as { number?: number; title?: string }).number}: {(conv.sessions as { title?: string }).title}
                    </span>
                  </>
                )}
                <span className="text-[10px] text-gray-600 ml-auto shrink-0">
                  {formatDate(conv.created_at)}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}

      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="text-gray-400 hover:text-white hover:bg-[#1F2F58]/40 gap-2 mt-2"
        >
          {loadingMore ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          Cargar mas conversaciones
        </Button>
      )}

      {/* Nota sobre retencion */}
      <p className="text-[10px] text-gray-700 text-center pt-2 border-t border-[#1F2F58]/20 mt-2">
        El historial se conserva por 90 dias
      </p>
    </div>
  );
}

// Componente para usar en la pagina /ai-lab cuando se selecciona una conversacion
export function ConversationBubblePreview({
  conv,
}: {
  conv: AIConversationWithSession;
}) {
  const msgCount = conv.messages.length;
  const lastMsg = conv.messages[conv.messages.length - 1];

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1F2F58]/30 border border-[#1F2F58]/40">
      <MessageSquare className="w-4 h-4 text-[#73B8E7]/60 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-300 truncate">
          {conv.title ?? "Conversacion anterior"}
        </p>
        {lastMsg && (
          <p className="text-[10px] text-gray-600 truncate">
            {lastMsg.content.slice(0, 50)}...
          </p>
        )}
      </div>
      <span className="text-[10px] text-gray-600 shrink-0">{msgCount} msgs</span>
    </div>
  );
}
