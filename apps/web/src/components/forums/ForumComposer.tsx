"use client";

// ============================================================
// ITSEIA Academy — ForumComposer
// Textarea + boton Publicar para posts y respuestas
// Reutilizable: modo post raiz y modo respuesta (con contexto)
// ============================================================

import { useState } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ForumComposerProps {
  subjectId: string;
  parentId?: string | null;
  parentPreview?: string | null; // Texto truncado del post al que se responde
  onPosted: (post: Record<string, unknown>) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const MAX_CHARS = 5000;

export function ForumComposer({
  subjectId,
  parentId = null,
  parentPreview = null,
  onPosted,
  onCancel,
  placeholder = "Escribe tu mensaje o pregunta...",
  autoFocus = false,
}: ForumComposerProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_CHARS - content.length;
  const isEmpty = content.trim().length === 0;
  const isOverLimit = content.length > MAX_CHARS;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEmpty || isOverLimit || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/forums/${subjectId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), parent_id: parentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al publicar el mensaje.");
        return;
      }

      setContent("");
      onPosted(data.post);
    } catch {
      setError("Error de conexion. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Contexto de respuesta */}
      {parentPreview && (
        <div className="flex items-start gap-2 rounded-lg border border-[#73B8E7]/30 bg-[#73B8E7]/5 px-3 py-2 text-xs text-[#1F2F58]/60">
          <span className="shrink-0 font-medium text-[#73B8E7]">Respondiendo a:</span>
          <span className="line-clamp-2 flex-1">{parentPreview}</span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="shrink-0 text-[#1F2F58]/30 hover:text-[#1F2F58]/60 transition-colors"
              aria-label="Cancelar respuesta"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      )}

      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={loading}
          rows={parentId ? 3 : 4}
          className={`resize-none pr-16 text-sm transition-colors placeholder:text-[#1F2F58]/30 focus-visible:ring-[#73B8E7] ${
            isOverLimit
              ? "border-red-400 focus-visible:ring-red-400"
              : "border-[#1F2F58]/10"
          }`}
        />

        {/* Contador de caracteres */}
        <span
          className={`absolute bottom-3 right-3 text-[10px] font-medium transition-colors ${
            isOverLimit
              ? "text-red-500"
              : remaining <= 200
              ? "text-amber-500"
              : "text-[#1F2F58]/25"
          }`}
        >
          {remaining}
        </span>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-end gap-2">
        {onCancel && !parentPreview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={loading}
            className="text-[#1F2F58]/40 hover:text-[#1F2F58]/70"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={isEmpty || isOverLimit || loading}
          className="bg-[#1F2F58] text-white hover:bg-[#2A3F6E] disabled:opacity-50 gap-1.5"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Publicando...
            </span>
          ) : (
            <>
              <Send className="size-3.5" />
              Publicar
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
