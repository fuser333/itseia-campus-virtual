"use client";

/**
 * InlineQuizPanel — Quiz funcional para sesiones cursos-pro.
 *
 * El quiz vive inline en cursos_pro_sessions.quiz_json (array de:
 *   { q: string, options: string[], answer: number, explain: string }
 * ). No requiere tabla `quizzes` ni endpoints `/api/quiz/*`.
 *
 * Mantiene el mismo lenguaje visual del QuizEngine de preuni:
 * fondos navy, accents gold, marcadores correct/incorrect con iconos
 * Lucide. Mostrado dentro de fondo oscuro del shell v2 del alumno.
 */

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface InlineQuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain?: string;
}

interface InlineQuizPanelProps {
  questions: InlineQuizQuestion[];
  sessionTitle?: string;
  onPassed?: () => void;
  passingPct?: number;
}

export default function InlineQuizPanel({
  questions,
  sessionTitle,
  onPassed,
  passingPct = 70,
}: InlineQuizPanelProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedByIdx, setSelectedByIdx] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [seed, setSeed] = useState(0); // reset trigger

  // Calculo de resultado al final
  const result = useMemo(() => {
    if (!submitted) return null;
    let correct = 0;
    const detail = questions.map((q, idx) => {
      const selected = selectedByIdx[idx];
      const isCorrect = selected === q.answer;
      if (isCorrect) correct++;
      return { selected, correctAnswer: q.answer, isCorrect, question: q };
    });
    const pct = Math.round((correct / questions.length) * 100);
    const passed = pct >= passingPct;
    return { correct, total: questions.length, pct, passed, detail };
  }, [submitted, selectedByIdx, questions, passingPct]);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-6">
        <p className="text-sm text-white/70">No hay quiz para esta sesión.</p>
      </div>
    );
  }

  const allAnswered = questions.every((_, idx) => selectedByIdx[idx] !== undefined);
  const current = questions[currentIdx];

  function selectOption(qIdx: number, optIdx: number) {
    if (submitted) return;
    setSelectedByIdx((prev) => ({ ...prev, [qIdx]: optIdx }));
  }

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
    if (onPassed) {
      // disparar si pasa el % mínimo
      const correct = questions.reduce(
        (acc, q, idx) => acc + (selectedByIdx[idx] === q.answer ? 1 : 0),
        0
      );
      const pct = Math.round((correct / questions.length) * 100);
      if (pct >= passingPct) onPassed();
    }
  }

  function handleReset() {
    setSelectedByIdx({});
    setSubmitted(false);
    setCurrentIdx(0);
    setSeed((s) => s + 1);
  }

  // ─── Resultados ──────────────────────────────────────────────────
  if (submitted && result) {
    return (
      <div key={seed} className="space-y-6 p-6">
        {/* Resumen final */}
        <div
          className={`rounded-2xl p-6 border ${
            result.passed
              ? "bg-[#FBBC0C]/10 border-[#FBBC0C]/30"
              : "bg-[#F0846D]/10 border-[#F0846D]/30"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            {result.passed ? (
              <Trophy className="size-8 text-[#FBBC0C]" />
            ) : (
              <HelpCircle className="size-8 text-[#F0846D]" />
            )}
            <div>
              <h3 className="text-xl font-bold text-white">
                {result.passed ? "Quiz aprobado" : "Sigue practicando"}
              </h3>
              <p className="text-sm text-white/70">
                {result.correct} de {result.total} correctas · {result.pct}%
              </p>
            </div>
          </div>
          {sessionTitle && (
            <p className="text-xs text-white/50">{sessionTitle}</p>
          )}
        </div>

        {/* Revisión pregunta por pregunta */}
        <div className="space-y-4">
          {result.detail.map((d, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-start gap-2 mb-3">
                {d.isCorrect ? (
                  <CheckCircle2 className="size-5 text-[#FBBC0C] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="size-5 text-[#F0846D] shrink-0 mt-0.5" />
                )}
                <p className="font-semibold text-white">
                  {idx + 1}. {d.question.q}
                </p>
              </div>
              <div className="space-y-1.5 ml-7">
                {d.question.options.map((opt, oIdx) => {
                  const isCorrectOption = oIdx === d.correctAnswer;
                  const isSelectedOption = oIdx === d.selected;
                  return (
                    <div
                      key={oIdx}
                      className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
                        isCorrectOption
                          ? "bg-[#FBBC0C]/15 text-white border border-[#FBBC0C]/40"
                          : isSelectedOption && !isCorrectOption
                          ? "bg-[#F0846D]/15 text-white border border-[#F0846D]/40"
                          : "text-white/60"
                      }`}
                    >
                      <span className="font-mono text-xs shrink-0 mt-0.5">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      <span className="flex-1">{opt}</span>
                      {isCorrectOption && (
                        <CheckCircle2 className="size-4 text-[#FBBC0C] shrink-0" />
                      )}
                      {isSelectedOption && !isCorrectOption && (
                        <XCircle className="size-4 text-[#F0846D] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
              {d.question.explain && (
                <div className="mt-3 ml-7 rounded-lg bg-[#73B8E7]/10 border border-[#73B8E7]/20 p-3">
                  <p className="text-xs font-semibold text-[#73B8E7] mb-1">
                    Explicación
                  </p>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {d.question.explain}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="size-4 mr-2" />
            Volver a intentar
          </Button>
        </div>
      </div>
    );
  }

  // ─── Quiz activo (una pregunta a la vez) ─────────────────────────
  return (
    <div key={seed} className="space-y-5 p-6">
      {/* Header progreso */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FBBC0C]">
          Pregunta {currentIdx + 1} de {questions.length}
        </p>
        <div className="flex gap-1.5">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`size-2 rounded-full transition ${
                idx === currentIdx
                  ? "bg-[#FBBC0C]"
                  : selectedByIdx[idx] !== undefined
                  ? "bg-[#73B8E7]"
                  : "bg-white/20"
              }`}
              aria-label={`Pregunta ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Pregunta */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white leading-relaxed mb-5">
          {current.q}
        </h3>

        <div className="space-y-2">
          {current.options.map((opt, oIdx) => {
            const isSelected = selectedByIdx[currentIdx] === oIdx;
            return (
              <button
                key={oIdx}
                onClick={() => selectOption(currentIdx, oIdx)}
                className={`w-full text-left flex items-start gap-3 rounded-xl border px-4 py-3.5 transition ${
                  isSelected
                    ? "bg-[#FBBC0C]/15 border-[#FBBC0C]/50 text-white"
                    : "bg-white/[0.02] border-white/10 text-white/85 hover:border-white/30 hover:bg-white/[0.06]"
                }`}
              >
                <span className="font-mono text-xs shrink-0 mt-1 text-[#FBBC0C]">
                  {String.fromCharCode(65 + oIdx)}.
                </span>
                <span className="flex-1 text-sm leading-relaxed">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
        >
          Anterior
        </Button>

        {currentIdx < questions.length - 1 ? (
          <Button
            onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
            className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90"
          >
            Siguiente
            <ArrowRight className="size-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="bg-[#FBBC0C] text-[#0A1628] hover:bg-[#FBBC0C]/90 disabled:opacity-40"
          >
            {allAnswered
              ? "Ver resultado"
              : `Faltan ${questions.length - Object.keys(selectedByIdx).length}`}
            <Trophy className="size-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
