"use client";

// ============================================================
// ITSEIA Academy — FlashcardViewer
// Visualizacion de flashcards con animacion flip 3D
// Feature: 010-ai-lab-advanced
// ============================================================

import { useState, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { FlashcardLocal } from "@/types/database";

interface FlashcardViewerProps {
  cards: FlashcardLocal[];
  onCardsChange?: (cards: FlashcardLocal[]) => void;
  editable?: boolean;
  className?: string;
  onComplete?: (revisadas: number) => void;
  showProgress?: boolean;
}

export default function FlashcardViewer({
  cards,
  onCardsChange,
  editable = false,
  className,
  onComplete,
  showProgress = true,
}: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [editingFront, setEditingFront] = useState(false);
  const [editingBack, setEditingBack] = useState(false);
  const [editFrontValue, setEditFrontValue] = useState("");
  const [editBackValue, setEditBackValue] = useState("");
  const [revisadas, setRevisadas] = useState(new Set<number>());

  const total = cards.length;
  const current = cards[currentIndex];

  useEffect(() => {
    setIsFlipped(false);
    setEditingFront(false);
    setEditingBack(false);
  }, [currentIndex]);

  // Teclado: flecha izquierda/derecha para navegar, espacio para voltear
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (editingFront || editingBack) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === " ") {
        e.preventDefault();
        handleFlip();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, editingFront, editingBack, total]);

  const handleFlip = useCallback(() => {
    setIsFlipped((v) => !v);
    // Marcar como revisada cuando se da la vuelta
    setRevisadas((prev) => new Set(prev).add(currentIndex));
  }, [currentIndex]);

  function goNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else if (onComplete) {
      onComplete(revisadas.size);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  function startEditFront() {
    if (!editable) return;
    setEditFrontValue(current.frente);
    setEditingFront(true);
  }

  function saveEditFront() {
    if (!onCardsChange) return;
    const updated = cards.map((c, i) =>
      i === currentIndex
        ? { ...c, frente: editFrontValue, editada: true }
        : c
    );
    onCardsChange(updated);
    setEditingFront(false);
  }

  function startEditBack() {
    if (!editable) return;
    setEditBackValue(current.dorso);
    setEditingBack(true);
  }

  function saveEditBack() {
    if (!onCardsChange) return;
    const updated = cards.map((c, i) =>
      i === currentIndex
        ? { ...c, dorso: editBackValue, editada: true }
        : c
    );
    onCardsChange(updated);
    setEditingBack(false);
  }

  if (!current) return null;

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Progreso */}
      {showProgress && (
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-[#1F2F58]/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#73B8E7] to-[#FBBC0C] transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-400 shrink-0">
            {currentIndex + 1} / {total}
          </span>
          <span className="text-[10px] text-green-400/80 shrink-0">
            {revisadas.size} revisadas
          </span>
        </div>
      )}

      {/* Card 3D flip */}
      <div
        className="w-full max-w-lg"
        style={{ perspective: "1200px" }}
        onClick={handleFlip}
      >
        <div
          className="relative w-full cursor-pointer"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            height: "220px",
          }}
        >
          {/* Frente */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1F2F58] to-[#0A1628] border border-[#1F2F58]/60 flex flex-col items-center justify-center p-6 shadow-xl shadow-[#0A1628]/50"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#73B8E7]/70 mb-4">
              Pregunta
            </span>

            {editingFront ? (
              <div className="w-full flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                <textarea
                  value={editFrontValue}
                  onChange={(e) => setEditFrontValue(e.target.value)}
                  rows={3}
                  className="w-full resize-none bg-[#0A1628]/60 border border-[#1F2F58]/40 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#73B8E7]/50"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    onClick={() => setEditingFront(false)}
                    variant="ghost"
                    className="h-7 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveEditFront}
                    className="h-7 bg-[#73B8E7] text-[#0A1628] hover:bg-[#73B8E7]/90"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-base font-semibold text-white text-center leading-relaxed">
                  {current.frente}
                </p>
                {editable && (
                  <button
                    onClick={(e) => { e.stopPropagation(); startEditFront(); }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-600 hover:text-[#73B8E7] hover:bg-[#1F2F58]/60 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}

            {!editingFront && (
              <p className="absolute bottom-4 text-[10px] text-gray-700">
                Haz clic para ver la respuesta
              </p>
            )}
          </div>

          {/* Dorso */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2A3F6E] to-[#1F2F58] border border-[#73B8E7]/20 flex flex-col items-center justify-center p-6 shadow-xl shadow-[#0A1628]/50"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#FBBC0C]/70 mb-4">
              Respuesta
            </span>

            {editingBack ? (
              <div className="w-full flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                <textarea
                  value={editBackValue}
                  onChange={(e) => setEditBackValue(e.target.value)}
                  rows={3}
                  className="w-full resize-none bg-[#0A1628]/60 border border-[#1F2F58]/40 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FBBC0C]/50"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    onClick={() => setEditingBack(false)}
                    variant="ghost"
                    className="h-7 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveEditBack}
                    className="h-7 bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-100 text-center leading-relaxed">
                  {current.dorso}
                </p>
                {editable && (
                  <button
                    onClick={(e) => { e.stopPropagation(); startEditBack(); }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-600 hover:text-[#FBBC0C] hover:bg-[#1F2F58]/60 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navegacion */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-xl text-gray-400 hover:text-white hover:bg-[#1F2F58]/40 disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleFlip}
          className="w-10 h-10 rounded-xl text-[#73B8E7] hover:text-white hover:bg-[#1F2F58]/40"
          title="Voltear (Espacio)"
        >
          <RotateCw className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={goNext}
          className={cn(
            "w-10 h-10 rounded-xl hover:bg-[#1F2F58]/40",
            currentIndex === total - 1
              ? "text-[#FBBC0C] hover:text-[#FBBC0C]"
              : "text-gray-400 hover:text-white"
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Indicadores de puntos */}
      <div className="flex items-center gap-1.5">
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "rounded-full transition-all",
              i === currentIndex
                ? "w-4 h-2 bg-[#FBBC0C]"
                : revisadas.has(i)
                  ? "w-2 h-2 bg-[#73B8E7]/60"
                  : "w-2 h-2 bg-[#1F2F58]/60 hover:bg-[#1F2F58]"
            )}
          />
        ))}
      </div>

      {/* Hint teclado */}
      <p className="text-[10px] text-gray-700">
        Espacio para voltear | Flechas para navegar
      </p>
    </div>
  );
}
