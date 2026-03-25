"use client";

// ============================================================
// ITSEIA Academy — FlashcardDeckSession
// Sesion de repaso con flashcards en orden aleatorio
// Feature: 010-ai-lab-advanced
// ============================================================

import { useState, useEffect } from "react";
import { RotateCcw, ArrowLeft, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FlashcardViewer from "./FlashcardViewer";
import type { Flashcard, FlashcardLocal } from "@/types/database";

interface FlashcardDeckSessionProps {
  deckId?: string;
  cards: Flashcard[];
  deckName?: string;
  onBack?: () => void;
  className?: string;
}

/** Algoritmo Fisher-Yates para mezclar un array */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function FlashcardDeckSession({
  deckId,
  cards,
  deckName,
  onBack,
  className,
}: FlashcardDeckSessionProps) {
  const [shuffledCards, setShuffledCards] = useState<FlashcardLocal[]>([]);
  const [completed, setCompleted] = useState(false);
  const [revisadas, setRevisadas] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    const mapped: FlashcardLocal[] = cards.map((c) => ({
      frente: c.frente,
      dorso: c.dorso,
    }));
    setShuffledCards(shuffle(mapped));
    setCompleted(false);
    setRevisadas(0);
  }, [cards, sessionKey]);

  async function handleComplete(rev: number) {
    setRevisadas(rev);
    setCompleted(true);

    // Actualizar estado del deck en BD (fire-and-forget)
    if (deckId) {
      try {
        await fetch("/api/ai-lab/flashcards", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deckId, cardsRevisadas: rev }),
        });
      } catch (err) {
        console.error("updateDeckCompletion error:", err);
      }
    }
  }

  function handleRepeat() {
    setSessionKey((k) => k + 1);
  }

  if (shuffledCards.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <p className="text-sm text-gray-500">Cargando mazo...</p>
      </div>
    );
  }

  // Pantalla de completado
  if (completed) {
    const percentage = Math.round((revisadas / shuffledCards.length) * 100);

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 px-6 text-center gap-6",
          className
        )}
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FBBC0C]/20 to-[#F0846D]/20 flex items-center justify-center border border-[#FBBC0C]/20">
          <Trophy className="w-10 h-10 text-[#FBBC0C]" />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Sesion completada
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Repasaste{" "}
            <span className="text-[#FBBC0C] font-semibold">{revisadas}</span> de{" "}
            <span className="font-semibold text-white">
              {shuffledCards.length}
            </span>{" "}
            flashcards
          </p>
        </div>

        {/* Stats */}
        <div className="w-full max-w-sm grid grid-cols-3 gap-3">
          {[
            { label: "Revisadas", value: revisadas, color: "text-green-400" },
            {
              label: "Total",
              value: shuffledCards.length,
              color: "text-white",
            },
            {
              label: "Progreso",
              value: `${percentage}%`,
              color: "text-[#FBBC0C]",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-[#1F2F58]/20 border border-[#1F2F58]/30 p-3 text-center"
            >
              <p className={cn("text-2xl font-bold", stat.color)}>
                {stat.value}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="gap-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          )}
          <Button
            onClick={handleRepeat}
            className="gap-2 bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Repetir mazo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header del mazo */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onBack}
            className="text-gray-400 hover:text-white hover:bg-[#1F2F58]/40"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h3 className="text-sm font-semibold text-white">
            {deckName ?? "Repaso de flashcards"}
          </h3>
          <p className="text-[10px] text-gray-500">
            {shuffledCards.length} tarjetas en orden aleatorio
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleRepeat}
          title="Mezclar de nuevo"
          className="ml-auto text-gray-500 hover:text-white hover:bg-[#1F2F58]/40"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <FlashcardViewer
        key={sessionKey}
        cards={shuffledCards}
        showProgress={true}
        onComplete={handleComplete}
      />
    </div>
  );
}
