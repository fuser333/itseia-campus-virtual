"use client";

// ============================================================
// ITSEIA Academy — FlashcardGenerator
// Genera flashcards desde la teoria de la sesion via Gemini
// Feature: 010-ai-lab-advanced
// ============================================================

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Save,
  BookOpen,
  RefreshCw,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FlashcardViewer from "./FlashcardViewer";
import type { FlashcardLocal } from "@/types/database";

interface FlashcardGeneratorProps {
  sessionId: string;
  sessionTitle?: string;
  className?: string;
  onSaved?: (deckId: string) => void;
}

export default function FlashcardGenerator({
  sessionId,
  sessionTitle,
  className,
  onSaved,
}: FlashcardGeneratorProps) {
  const [cards, setCards] = useState<FlashcardLocal[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/ai-lab/flashcards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json() as {
        flashcards?: FlashcardLocal[];
        error?: string;
        count?: number;
      };

      if (!res.ok) {
        if (data.error === "NO_THEORY") {
          setError(
            "La teoria de esta sesion aun no esta disponible. El instructor debe agregar el contenido primero."
          );
        } else {
          setError(
            data.error ?? "Error generando las flashcards. Intenta de nuevo."
          );
        }
        return;
      }

      setCards(data.flashcards ?? []);
      setGenerated(true);
    } catch (err) {
      console.error("FlashcardGenerator error:", err);
      setError("Error de conexion. Verifica tu internet e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (cards.length === 0) return;
    setSaving(true);

    try {
      const res = await fetch("/api/ai-lab/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          cards,
          deckName: sessionTitle ? `Sesion: ${sessionTitle}` : undefined,
        }),
      });

      const data = await res.json() as { deckId?: string; error?: string };

      if (res.ok && data.deckId) {
        setSaved(true);
        onSaved?.(data.deckId);
      } else {
        setError(data.error ?? "Error guardando las flashcards.");
      }
    } catch (err) {
      console.error("FlashcardGenerator save error:", err);
      setError("Error guardando las flashcards.");
    } finally {
      setSaving(false);
    }
  }

  // Vista cuando no se ha generado todavia
  if (!generated) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 px-6 text-center gap-6",
          className
        )}
      >
        {/* Icono */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FBBC0C]/15 to-[#73B8E7]/15 flex items-center justify-center border border-[#1F2F58]/40">
            <BookOpen className="w-10 h-10 text-[#FBBC0C]" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#0A1628] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#73B8E7]" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Flashcards generadas por IA
          </h3>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Genera flashcards de estudio automaticamente desde el contenido
            teorico de esta sesion. La IA extraera los conceptos clave y
            creara preguntas con respuestas para tu repaso.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full max-w-sm px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="gap-2 bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold h-12 px-8 rounded-xl shadow-lg shadow-[#FBBC0C]/10"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generando flashcards...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generar Flashcards
            </>
          )}
        </Button>

        <p className="text-[10px] text-gray-600">
          Usando Gemini 2.0 Flash Lite · Menos de $0.001 por generacion
        </p>
      </div>
    );
  }

  // Vista con flashcards generadas
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            {cards.length} flashcards generadas
          </h3>
          {sessionTitle && (
            <p className="text-xs text-gray-500 mt-0.5">{sessionTitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => { setGenerated(false); setCards([]); setSaved(false); setError(null); }}
            className="gap-1.5 text-gray-400 hover:text-white text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerar
          </Button>
          {!saved ? (
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || cards.length === 0}
              className="gap-1.5 bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold text-xs h-8 px-3 rounded-lg"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Guardar en mi mazo
            </Button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 text-xs font-medium border border-green-500/20">
              <Check className="w-3.5 h-3.5" />
              Guardado
            </div>
          )}
        </div>
      </div>

      {/* Error de guardado */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Hint edicion */}
      <div className="px-3 py-2 rounded-xl bg-[#1F2F58]/15 border border-[#1F2F58]/20">
        <p className="text-[10px] text-gray-500">
          <span className="text-[#73B8E7] font-medium">Consejo:</span> Haz clic
          en el icono de lapiz para editar cualquier flashcard antes de guardarla.
          Luego haz clic en &quot;Guardar en mi mazo&quot; para conservarlas en tu perfil.
        </p>
      </div>

      {/* Visor de flashcards */}
      <FlashcardViewer
        cards={cards}
        onCardsChange={setCards}
        editable={!saved}
        showProgress={true}
      />
    </div>
  );
}
