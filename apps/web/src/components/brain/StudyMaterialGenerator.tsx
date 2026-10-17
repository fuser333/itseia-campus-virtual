"use client";

// ============================================================
// ITSEIA Academy — StudyMaterialGenerator (Segundo Cerebro)
// Feature: segundo-cerebro-mvp
//
// Genera material de estudio: flashcards, resumenes, quizzes,
// tablas comparativas a partir de contenido del alumno.
// ============================================================

import { useState } from "react";
import {
  BookOpen,
  FileText,
  HelpCircle,
  GitCompare,
  Loader2,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Flashcard, QuizQuestion } from "@/types/brain";

type MaterialType = "flashcards" | "summary" | "quiz" | "comparison";

interface StudyMaterialGeneratorProps {
  content?: string;
  topic?: string;
  className?: string;
}

export default function StudyMaterialGenerator({
  content,
  topic,
  className,
}: StudyMaterialGeneratorProps) {
  const [selectedType, setSelectedType] = useState<MaterialType>("flashcards");
  const [customContent, setCustomContent] = useState(content || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Results
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [comparison, setComparison] = useState("");
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number>>(
    new Map()
  );

  const types: { id: MaterialType; label: string; icon: React.ReactNode }[] = [
    {
      id: "flashcards",
      label: "Flashcards",
      icon: <BookOpen className="w-3 h-3" />,
    },
    {
      id: "summary",
      label: "Resumen",
      icon: <FileText className="w-3 h-3" />,
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: <HelpCircle className="w-3 h-3" />,
    },
    {
      id: "comparison",
      label: "Comparativa",
      icon: <GitCompare className="w-3 h-3" />,
    },
  ];

  async function handleGenerate() {
    if (!customContent.trim()) {
      setError("Ingresa contenido para generar material");
      return;
    }
    if (customContent.trim().length < 50) {
      setError("El contenido es demasiado corto (minimo 50 caracteres)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/brain/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: customContent,
          type: selectedType,
          topic,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error generando material");
        return;
      }

      const material = data.material;

      switch (selectedType) {
        case "flashcards":
          setFlashcards(material.flashcards || []);
          setFlippedCards(new Set());
          break;
        case "summary":
          setSummary(material.summary || "");
          break;
        case "quiz":
          setQuiz(material.quiz || []);
          setSelectedAnswers(new Map());
          break;
        case "comparison":
          setComparison(material.comparison || "");
          break;
      }
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

  function selectAnswer(questionIdx: number, optionIdx: number) {
    setSelectedAnswers((prev) => {
      const next = new Map(prev);
      next.set(questionIdx, optionIdx);
      return next;
    });
  }

  function renderMd(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)$/gm, '<li class="ml-3">$1</li>')
      .replace(/`(.+?)`/g, '<code class="bg-[#1F2F58]/50 px-1 rounded text-[#73B8E7] text-[10px]">$1</code>')
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match
          .split("|")
          .filter(Boolean)
          .map((c) => c.trim());
        return `<tr>${cells.map((c) => `<td class="border border-[#1F2F58]/30 px-2 py-1 text-[11px]">${c}</td>`).join("")}</tr>`;
      })
      .replace(/\n/g, "<br>");
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Generar material de estudio
      </h3>

      {/* Selector de tipo */}
      <div className="flex flex-wrap items-center gap-1">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all",
              selectedType === t.id
                ? "bg-[#FBBC0C]/15 text-[#FBBC0C] border border-[#FBBC0C]/30"
                : "text-gray-500 hover:text-gray-300 hover:bg-[#1F2F58]/20"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido input (si no viene pre-cargado) */}
      {!content && (
        <textarea
          value={customContent}
          onChange={(e) => setCustomContent(e.target.value)}
          placeholder="Pega aqui el contenido a partir del cual generar material de estudio..."
          className="bg-[#0A1628]/60 border border-[#1F2F58]/50 rounded-lg px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#FBBC0C]/50 min-h-[100px] resize-y"
        />
      )}

      {/* Boton generar */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-1.5 px-4 py-2 bg-[#FBBC0C] text-[#0A1628] rounded-lg text-xs font-semibold hover:bg-[#FBBC0C]/90 disabled:opacity-50 transition-all self-start"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5" />
        )}
        {loading ? "Generando..." : `Generar ${types.find((t) => t.id === selectedType)?.label}`}
      </button>

      {error && (
        <p className="text-[11px] text-[#F0846D]">{error}</p>
      )}

      {/* Resultados: Flashcards */}
      {selectedType === "flashcards" && flashcards.length > 0 && (
        <div className="grid gap-2">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            {flashcards.length} flashcards generadas
          </p>
          {flashcards.map((card, idx) => (
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
                {flippedCards.has(idx) ? "Pregunta" : "Click para ver respuesta"}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Resultados: Resumen */}
      {selectedType === "summary" && summary && (
        <div className="bg-[#0A1628]/40 border border-[#1F2F58]/30 rounded-lg p-4">
          <div
            className="text-xs text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMd(summary) }}
          />
        </div>
      )}

      {/* Resultados: Quiz */}
      {selectedType === "quiz" && quiz.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            {quiz.length} preguntas
          </p>
          {quiz.map((q, qIdx) => (
            <div
              key={qIdx}
              className="bg-[#0A1628]/40 border border-[#1F2F58]/30 rounded-lg p-3"
            >
              <p className="text-xs text-gray-200 font-medium mb-2">
                {qIdx + 1}. {q.question}
              </p>
              <div className="flex flex-col gap-1">
                {q.options.map((opt, oIdx) => {
                  const selected = selectedAnswers.get(qIdx);
                  const isSelected = selected === oIdx;
                  const isCorrect = q.correct === oIdx;
                  const showResult = selected !== undefined;

                  return (
                    <button
                      key={oIdx}
                      onClick={() => selectAnswer(qIdx, oIdx)}
                      disabled={showResult}
                      className={cn(
                        "flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] text-left transition-all",
                        showResult && isCorrect
                          ? "bg-green-500/10 text-green-400 border border-green-500/30"
                          : showResult && isSelected && !isCorrect
                            ? "bg-[#F0846D]/10 text-[#F0846D] border border-[#F0846D]/30"
                            : isSelected
                              ? "bg-[#1F2F58]/50 text-white border border-[#1F2F58]/60"
                              : "text-gray-400 hover:bg-[#1F2F58]/20 border border-transparent"
                      )}
                    >
                      {showResult && isCorrect && (
                        <Check className="w-3 h-3 shrink-0" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <X className="w-3 h-3 shrink-0" />
                      )}
                      {!showResult && (
                        <span className="w-3 h-3 rounded-full border border-gray-600 shrink-0" />
                      )}
                      {opt}
                    </button>
                  );
                })}
              </div>
              {selectedAnswers.has(qIdx) && q.explanation && (
                <p className="text-[10px] text-gray-500 mt-2 pl-2 border-l-2 border-[#73B8E7]/30">
                  {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resultados: Comparativa */}
      {selectedType === "comparison" && comparison && (
        <div className="bg-[#0A1628]/40 border border-[#1F2F58]/30 rounded-lg p-4 overflow-x-auto">
          <div
            className="text-xs text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMd(comparison) }}
          />
        </div>
      )}
    </div>
  );
}
