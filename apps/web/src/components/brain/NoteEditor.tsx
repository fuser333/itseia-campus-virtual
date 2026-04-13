"use client";

// ============================================================
// ITSEIA Academy — NoteEditor (Segundo Cerebro)
// Feature: segundo-cerebro-mvp
//
// Editor markdown de notas con preview.
// Permite crear y editar notas en la base de conocimiento.
// ============================================================

import { useState } from "react";
import { Save, Eye, Edit3, X, Tag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  noteId?: string;
  sessionId?: string;
  onSave: (note: {
    id?: string;
    title: string;
    content: string;
    tags: string[];
  }) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export default function NoteEditor({
  initialTitle = "",
  initialContent = "",
  initialTags = [],
  noteId,
  sessionId,
  onSave,
  onCancel,
  className,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!title.trim()) {
      setError("El titulo es requerido");
      return;
    }
    if (!content.trim()) {
      setError("El contenido es requerido");
      return;
    }

    setError("");
    setSaving(true);
    try {
      await onSave({
        id: noteId,
        title: title.trim(),
        content: content.trim(),
        tags,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error guardando la nota"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleAddTag() {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  }

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  // Simple markdown to HTML for preview (basic)
  function renderMarkdown(text: string): string {
    return text
      .replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold text-[#FBBC0C] mt-3 mb-1">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold text-[#FBBC0C] mt-4 mb-1">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold text-[#FBBC0C] mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, '<code class="bg-[#1F2F58]/60 px-1 rounded text-[#73B8E7] text-xs">$1</code>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-300">$1</li>')
      .replace(/\n/g, "<br>");
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Titulo */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titulo de la nota..."
        className="bg-[#0A1628]/60 border border-[#1F2F58]/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FBBC0C]/50"
      />

      {/* Toggle preview */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPreview(false)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all",
            !preview
              ? "bg-[#FBBC0C]/15 text-[#FBBC0C] border border-[#FBBC0C]/30"
              : "text-gray-500 hover:text-gray-300"
          )}
        >
          <Edit3 className="w-3 h-3" />
          Editar
        </button>
        <button
          onClick={() => setPreview(true)}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all",
            preview
              ? "bg-[#73B8E7]/15 text-[#73B8E7] border border-[#73B8E7]/30"
              : "text-gray-500 hover:text-gray-300"
          )}
        >
          <Eye className="w-3 h-3" />
          Vista previa
        </button>
        {sessionId && (
          <span className="text-[9px] text-gray-600 ml-auto">
            Vinculada a sesion
          </span>
        )}
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div
          className="bg-[#0A1628]/40 border border-[#1F2F58]/30 rounded-lg p-4 min-h-[200px] text-sm text-gray-300 prose-sm"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu nota en markdown...

# Titulo
## Subtitulo
- Punto 1
- Punto 2
**texto en negrita**
`codigo`"
          className="bg-[#0A1628]/60 border border-[#1F2F58]/50 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#FBBC0C]/50 min-h-[200px] resize-y font-mono"
        />
      )}

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Tag className="w-3 h-3 text-gray-600" />
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 bg-[#1F2F58]/40 text-[#73B8E7] text-[10px] rounded-full"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-[#F0846D] transition-colors"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          placeholder="Agregar tag..."
          className="bg-transparent border-none text-[10px] text-gray-400 placeholder-gray-600 focus:outline-none w-20"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-[11px] text-[#F0846D]">{error}</p>
      )}

      {/* Acciones */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FBBC0C] text-[#0A1628] rounded-lg text-xs font-semibold hover:bg-[#FBBC0C]/90 disabled:opacity-50 transition-all"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {saving ? "Guardando..." : noteId ? "Actualizar" : "Guardar nota"}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
