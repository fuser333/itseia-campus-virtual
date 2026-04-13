"use client";

// ============================================================
// ITSEIA Academy — DeltaViewer (Segundo Cerebro)
// Feature: segundo-cerebro-mvp
//
// Muestra el resumen delta: lo nuevo vs lo conocido.
// Incluye flashcards generadas y resumen ejecutivo.
// ============================================================

import { useState } from "react";
import {
  Zap,
  BookCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Flashcard } from "@/types/brain";

interface DeltaViewerProps {
  sourceId?: string;
  content?: string;
  onDeltaGenerated?: (delta: {
    delta_content: string;
    flashcards: Flashcard[];
  }) => void;
  className?: string;
}

export default function DeltaViewer({
  sourceId,
  content,
  onDeltaGenerated,
  className,
}: DeltaViewerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [delta, setDelta] = useState<{
    delta_content: string;
    known_content: string;
    flashcards: Flashcard[];
    summary: string;
  } | null>(null);
  const [showKnown, setShowKnown] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  async function handleGenerate() {
    setLoading(true);
    setError("");

    try {
      const body: Record<string, string> = {};
      if (sourceId) body.source_id = sourceId;
      else if (content) body.content = content;
      else {
        setError("Se necesita una fuente o contenido para comparar");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/brain/delta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error generando comparacion");
        return;
      }

      const d = data.delta;
      setDelta({
        delta_content: d.delta_content,
        known_content: d.known_content || "",
        flashcards: d.flashcards || [],
        summary: d.summary || "",
      });
      onDeltaGenerated?.({
        delta_content: d.delta_content,
        flashcards: d.flashcards || [],
      });
    } catch {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  }

  function toggleCard(idx: number) {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  // Simple markdown rendering
  function renderMd(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)$/gm, '<li class="ml-3">$1</li>')
      .replace(/`(.+?)`/g, '<code class="bg-[#1F2F58]/50 px-1 rounded text-[#73B8E7] text-[10px]">$1</code>')
      .replace(/\n/g, "<br>");
  }

  // Estado inicial: boton para generar
  if (!delta && !loading) {
    return (
      <div className={cn("flex flex-col items-center gap-3 py-6", className)}>
        <Zap className="w-8 h-8 text-[#FBBC0C]" />
        <div className="text-center">
          <p className="text-sm text-gray-300 font-medium">
            Comparacion Delta
          </p>
          <p className="text-[11px] text-gray-500 mt-1">
            Descubre que es NUEVO vs lo que ya sabes
          </p>
        </div>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#FBBC0C] text-[#0A1628] rounded-lg text-xs font-semibold hover:bg-[#FBBC0C]/90 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generar comparacion
        </button>
        {error && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#F0846D]">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}
      </div>
    );
  }

  // Cargando
  if (loading) {
    return (
      <div className={cn("flex flex-col items-center gap-3 py-8", className)}>
        <Loader2 className="w-6 h-6 text-[#FBBC0C] animate-spin" />
        <p className="text-xs text-gray-400">
          Analizando con IA... Comparando contra tu base de conocimiento
        </p>
      </div>
    );
  }

  // Delta generado
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Lo que NO sabias */}
      <div className="bg-[#FBBC0C]/5 border border-[#FBBC0C]/20 rounded-lg p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="w-3.5 h-3.5 text-[#FBBC0C]" />
          <span className="text-[11px] font-semibold text-[#FBBC0C] uppercase tracking-wider">
            Lo que NO sabias
          </span>
        </div>
        <div
          className="text-xs text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: renderMd(delta?.delta_content || ""),
          }}
        />
      </div>

      {/* Lo que ya sabias (colapsable) */}
      {delta?.known_content && (
        <div className="border border-[#1F2F58]/30 rounded-lg">
          <button
            onClick={() => setShowKnown(!showKnown)}
            className="flex items-center justify-between w-full px-3 py-2 text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <BookCheck className="w-3 h-3" />
              Lo que YA sabias
            </span>
            {showKnown ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
          {showKnown && (
            <div
              className="px-3 pb-3 text-[11px] text-gray-500 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: renderMd(delta.known_content),
              }}
            />
          )}
        </div>
      )}

      {/* Resumen */}
      {delta?.summary && (
        <div className="bg-[#0A1628]/40 border border-[#1F2F58]/30 rounded-lg p-3">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Resumen
          </p>
          <div
            className="text-xs text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMd(delta.summary) }}
          />
        </div>
      )}

      {/* Flashcards */}
      {delta?.flashcards && delta.flashcards.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Flashcards ({delta.flashcards.length})
          </p>
          <div className="grid gap-2">
            {delta.flashcards.map((card, idx) => (
              <button
                key={idx}
                onClick={() => toggleCard(idx)}
                className={cn(
                  "text-left p-3 rounded-lg border transition-all",
                  flippedCards.has(idx)
                    ? "bg-[#73B8E7]/5 border-[#73B8E7]/30"
                    : "bg-[#0A1628]/40 border-[#1F2F58]/30 hover:border-[#1F2F58]/60"
                )}
              >
                <p className="text-xs text-gray-300 font-medium">
                  {flippedCards.has(idx) ? card.a : card.q}
                </p>
                <p className="text-[9px] text-gray-600 mt-1">
                  {flippedCards.has(idx)
                    ? "Click para ver pregunta"
                    : "Click para ver respuesta"}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Boton regenerar */}
      <button
        onClick={handleGenerate}
        className="flex items-center gap-1 px-3 py-1.5 text-[10px] text-gray-500 hover:text-[#FBBC0C] transition-colors self-start"
      >
        <Sparkles className="w-3 h-3" />
        Regenerar comparacion
      </button>
    </div>
  );
}
