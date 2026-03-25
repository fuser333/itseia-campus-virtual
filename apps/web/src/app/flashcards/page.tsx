"use client";

// ============================================================
// ITSEIA Academy — Pagina: Mi Mazo de Flashcards
// URL: /flashcards
// Feature: 010-ai-lab-advanced
// ============================================================

import { useState, useEffect } from "react";
import {
  BookOpen,
  Play,
  ArrowLeft,
  Loader2,
  BookMarked,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FlashcardDeckSession from "@/components/ai-lab/FlashcardDeckSession";
import type { Flashcard, FlashcardDeck } from "@/types/database";

interface SessionGroup {
  sessionId: string | null;
  sessionTitle: string;
  cards: Flashcard[];
  decks: FlashcardDeck[];
}

export default function FlashcardsPage() {
  const [groups, setGroups] = useState<SessionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<SessionGroup | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/ai-lab/flashcards");
        const data = await res.json() as {
          flashcards: (Flashcard & { sessions?: { id: string; number: number; title: string } | null })[];
          decks: (FlashcardDeck & { sessions?: { id: string; number: number; title: string } | null })[];
        };

        if (!res.ok) return;

        // Agrupar por session_id
        const map = new Map<string, SessionGroup>();

        for (const card of data.flashcards ?? []) {
          const key = card.session_id ?? "sin-sesion";
          if (!map.has(key)) {
            map.set(key, {
              sessionId: card.session_id,
              sessionTitle: card.sessions
                ? `Sesion ${card.sessions.number}: ${card.sessions.title}`
                : "Sin sesion",
              cards: [],
              decks: [],
            });
          }
          map.get(key)!.cards.push(card);
        }

        for (const deck of data.decks ?? []) {
          const key = deck.session_id ?? "sin-sesion";
          if (map.has(key)) {
            map.get(key)!.decks.push(deck);
          }
        }

        setGroups(Array.from(map.values()));
      } catch (err) {
        console.error("FlashcardsPage error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#73B8E7] animate-spin" />
      </div>
    );
  }

  // Vista de sesion activa (repaso)
  if (activeSession) {
    const lastDeck = activeSession.decks[0];

    return (
      <div className="max-w-2xl mx-auto py-8">
        <FlashcardDeckSession
          deckId={lastDeck?.id}
          cards={activeSession.cards}
          deckName={activeSession.sessionTitle}
          onBack={() => setActiveSession(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/ai-lab" className="text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FBBC0C]/20 to-[#73B8E7]/20 flex items-center justify-center border border-[#1F2F58]/40">
            <BookMarked className="w-5 h-5 text-[#FBBC0C]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Mi Mazo de Flashcards</h1>
            <p className="text-sm text-white/70">
              {groups.reduce((acc, g) => acc + g.cards.length, 0)} flashcards
              guardadas
            </p>
          </div>
        </div>
      </div>

      {/* Sin flashcards */}
      {groups.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl bg-[#0A1628] border border-[#1F2F58]/50">
          <div className="w-16 h-16 rounded-3xl bg-[#1F2F58]/30 flex items-center justify-center mb-4 border border-[#1F2F58]/40">
            <BookOpen className="w-8 h-8 text-white/40" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Aun no tienes flashcards
          </h2>
          <p className="text-sm text-white/60 max-w-md leading-relaxed mb-6">
            Ve a cualquier sesion de tu carrera, abre el tab AI Lab y genera
            flashcards desde la teoria de la sesion con un clic.
          </p>
          <Link href="/carreras">
            <Button className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold gap-2">
              <BookOpen className="w-4 h-4" />
              Ir a mis cursos
            </Button>
          </Link>
        </div>
      )}

      {/* Grupos por sesion */}
      {groups.length > 0 && (
        <div className="grid gap-4">
          {groups.map((group) => {
            const lastDeck = group.decks[0];
            const isCompleted = !!lastDeck?.completed_at;

            return (
              <div
                key={group.sessionId ?? "sin-sesion"}
                className="rounded-2xl bg-[#0A1628] border border-[#1F2F58]/50 p-5"
              >
                <div className="flex items-center gap-4">
                  {/* Icono */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F2F58]/60 to-[#0A1628] flex items-center justify-center border border-[#1F2F58]/40 shrink-0">
                    <BookOpen className="w-6 h-6 text-[#73B8E7]" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white truncate">
                      {group.sessionTitle}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-white/70">
                        {group.cards.length} flashcards
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium">
                          Repasado
                        </span>
                      )}
                      {lastDeck?.cards_revisadas && (
                        <span className="text-[10px] text-white/50">
                          {lastDeck.cards_revisadas} revisadas
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Preview de tarjetas */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    {group.cards.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-8 h-10 rounded-lg border border-[#1F2F58]/50 bg-[#1F2F58]/30",
                          i === 0 && "opacity-100",
                          i === 1 && "opacity-70 -ml-3",
                          i === 2 && "opacity-40 -ml-3"
                        )}
                      />
                    ))}
                    {group.cards.length > 3 && (
                      <span className="text-[10px] text-white/50 ml-1">
                        +{group.cards.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Boton repasar */}
                  <Button
                    onClick={() => setActiveSession(group)}
                    className="shrink-0 gap-2 bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 font-semibold h-9 px-4 rounded-xl"
                  >
                    <Play className="w-4 h-4" />
                    Repasar
                  </Button>
                </div>

                {/* Preview de primera flashcard */}
                {group.cards[0] && (
                  <div className="mt-4 p-3 rounded-xl bg-[#1F2F58]/20 border border-[#1F2F58]/30">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#73B8E7]/70 mb-1">
                      Primera flashcard
                    </p>
                    <p className="text-sm text-white/80">
                      {group.cards[0].frente}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer con link al AI Lab */}
      <div className="text-center pt-4 border-t border-[#1F2F58]/20">
        <p className="text-sm text-white/60">
          Genera nuevas flashcards desde el{" "}
          <Link href="/ai-lab" className="text-[#73B8E7] hover:underline">
            AI Lab
          </Link>{" "}
          en cualquier sesion de tu carrera
        </p>
      </div>
    </div>
  );
}
