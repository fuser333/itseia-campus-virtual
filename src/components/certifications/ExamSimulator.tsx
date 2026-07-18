"use client";

// ============================================================
// ITSEIA Academy — ExamSimulator
// Feature: 009-industry-certifications
// Strict exam mode: no backtrack, countdown timer, no feedback
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  PlayCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExamQuestionForClient, ExamQuestionOption } from "@/types/database";

interface Props {
  certificationSlug: string;
  certificationId: string;
  certificationNombre: string;
  umbralPorcentaje: number;
}

type ExamPhase = "intro" | "loading" | "exam" | "submitting";

interface Answer {
  question_id: string;
  selected_index: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getOptions(q: ExamQuestionForClient): ExamQuestionOption[] {
  const opts = q.opciones;
  if (Array.isArray(opts)) return opts as ExamQuestionOption[];
  if (opts && typeof opts === "object" && Array.isArray((opts as { options?: unknown[] }).options)) {
    return (opts as { options: ExamQuestionOption[] }).options;
  }
  return [];
}

export default function ExamSimulator({
  certificationSlug,
  certificationId,
  certificationNombre,
  umbralPorcentaje,
}: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<ExamPhase>("intro");
  const [questions, setQuestions] = useState<ExamQuestionForClient[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 min default
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(90 * 60);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const autoSubmitRef = useRef(false);

  // ── Start Exam ────────────────────────────────────────────
  const startExam = useCallback(async () => {
    setPhase("loading");
    setError(null);

    try {
      const res = await fetch("/api/certifications/exam/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certification_id: certificationId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al iniciar el examen");
        setPhase("intro");
        return;
      }

      const data = await res.json();
      setQuestions(data.questions || []);
      setAttemptId(data.attempt_id);
      const tl = data.time_limit_seconds || 90 * 60;
      setTimeLimitSeconds(tl);
      setTimeLeft(tl);
      setAnswers(
        (data.questions || []).map((q: ExamQuestionForClient) => ({
          question_id: q.id,
          selected_index: -1,
        }))
      );
      startTimeRef.current = Date.now();
      setCurrentIndex(0);
      setPhase("exam");
    } catch {
      setError("Error de conexion. Verifica tu internet e intenta de nuevo.");
      setPhase("intro");
    }
  }, [certificationId]);

  // ── Countdown timer ───────────────────────────────────────
  useEffect(() => {
    if (phase !== "exam") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!autoSubmitRef.current) {
            autoSubmitRef.current = true;
            // Trigger auto-submit after state update
            setTimeout(() => submitExam(), 100);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Submit exam ───────────────────────────────────────────
  const submitExam = useCallback(async () => {
    if (!attemptId || phase === "submitting") return;
    setPhase("submitting");

    const durationSeconds = Math.round(
      (Date.now() - startTimeRef.current) / 1000
    );

    try {
      const res = await fetch(
        `/api/certifications/exam/${attemptId}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, duration_seconds: durationSeconds }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al enviar el examen");
        setPhase("exam");
        return;
      }

      // Redirect to results page
      router.push(
        `/certificaciones/${certificationSlug}/resultados/${attemptId}`
      );
    } catch {
      setError("Error de conexion al enviar el examen.");
      setPhase("exam");
      autoSubmitRef.current = false;
    }
  }, [attemptId, answers, certificationSlug, phase, router]);

  function selectAnswer(questionId: string, optionIndex: number) {
    setAnswers((prev) =>
      prev.map((a) =>
        a.question_id === questionId
          ? { ...a, selected_index: optionIndex }
          : a
      )
    );
  }

  function goNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  // ── Phase: Intro ──────────────────────────────────────────
  if (phase === "intro" || phase === "loading") {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
        <div className="max-w-lg w-full rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#FBBC0C]/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#FBBC0C]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#73B8E7]/70">
                Modo Examen
              </p>
              <h1 className="text-lg font-bold text-white">{certificationNombre}</h1>
            </div>
          </div>

          {/* Rules */}
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wide mb-4">
            Reglas del simulacro
          </h2>
          <ul className="space-y-3 mb-8">
            {[
              { icon: "65", text: "65 preguntas de opcion multiple" },
              { icon: "90", text: "90 minutos de tiempo limite" },
              { icon: "X", text: "No puedes regresar a preguntas anteriores" },
              { icon: "?", text: "Sin retroalimentacion durante el examen" },
              { icon: `${umbralPorcentaje}%`, text: `Aprobacion con ${umbralPorcentaje}% o mas` },
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1F2F58] flex items-center justify-center text-xs font-bold text-[#73B8E7]">
                  {rule.icon}
                </span>
                <p className="text-sm text-white/70 pt-1">{rule.text}</p>
              </li>
            ))}
          </ul>

          {/* Warning */}
          <div className="flex items-start gap-3 rounded-xl bg-[#FBBC0C]/5 border border-[#FBBC0C]/15 p-4 mb-6">
            <AlertTriangle className="w-4 h-4 text-[#FBBC0C] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#FBBC0C]/80">
              Una vez iniciado el examen, el temporizador no se puede pausar. Asegurate de tener tiempo disponible antes de comenzar.
            </p>
          </div>

          {error && (
            <p className="text-sm text-[#F0846D] text-center mb-4">{error}</p>
          )}

          <Button
            onClick={startExam}
            disabled={phase === "loading"}
            className="w-full bg-[#FBBC0C] text-[#0A1628] font-bold hover:bg-[#FBBC0C]/90 gap-2 h-12 text-base"
          >
            {phase === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                Comenzar examen
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // ── Phase: Exam ───────────────────────────────────────────
  if (phase === "exam" || phase === "submitting") {
    const current = questions[currentIndex];
    if (!current) return null;

    const currentAnswer = answers.find((a) => a.question_id === current.id);
    const selectedIndex = currentAnswer?.selected_index ?? -1;
    const isLastQuestion = currentIndex === questions.length - 1;
    const allAnswered = answers.every((a) => a.selected_index >= 0);
    const opts = getOptions(current);
    const timePercent = (timeLeft / timeLimitSeconds) * 100;
    const isTimerWarning = timeLeft < 600; // last 10 minutes

    return (
      <div className="min-h-screen bg-[#0A1628] flex flex-col">
        {/* Top bar */}
        <header className="border-b border-white/[0.06] bg-[#0D1B30] px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wide hidden sm:block">
              {certificationNombre}
            </p>
            <span className="text-xs font-medium text-white/40">
              Pregunta <span className="font-bold text-white">{currentIndex + 1}</span> de {questions.length}
            </span>
          </div>

          {/* Timer */}
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-sm font-bold transition-colors",
              isTimerWarning
                ? "bg-[#F0846D]/10 text-[#F0846D] border border-[#F0846D]/30"
                : "bg-white/5 text-white border border-white/10"
            )}
          >
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>

          <div className="text-xs text-white/30 hidden sm:block">
            {answers.filter((a) => a.selected_index >= 0).length}/{questions.length} respondidas
          </div>
        </header>

        {/* Timer progress bar */}
        <div className="h-1 w-full bg-white/[0.04]">
          <div
            className={cn(
              "h-full transition-all duration-1000",
              isTimerWarning ? "bg-[#F0846D]" : "bg-[#FBBC0C]"
            )}
            style={{ width: `${Math.max(0, timePercent)}%` }}
          />
        </div>

        {/* Question dots (for orientation, not clickable in strict mode) */}
        <div className="px-4 pt-3 pb-1 flex items-center gap-1 flex-wrap">
          {questions.map((q, i) => {
            const ans = answers.find((a) => a.question_id === q.id);
            return (
              <div
                key={q.id}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === currentIndex
                    ? "w-5 bg-[#FBBC0C]"
                    : (ans?.selected_index ?? -1) >= 0
                    ? "w-2 bg-[#73B8E7]"
                    : "w-2 bg-white/10"
                )}
              />
            );
          })}
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-4 py-5 max-w-3xl mx-auto w-full">
          {/* Question */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#73B8E7] mb-2.5">
              Pregunta {currentIndex + 1}
            </p>
            <p className="text-base font-medium text-white leading-relaxed">
              {current.enunciado}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5 mb-6">
            {opts.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSelected = selectedIndex === i;
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(current.id, i)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all",
                    isSelected
                      ? "border-[#FBBC0C] bg-[#FBBC0C]/5 text-white font-medium shadow-sm"
                      : "border-white/8 bg-white/[0.02] text-white/60 hover:border-[#73B8E7]/30 hover:bg-[#73B8E7]/5"
                  )}
                >
                  <span
                    className={cn(
                      "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5",
                      isSelected
                        ? "bg-[#FBBC0C] text-[#0A1628]"
                        : "bg-white/5 text-white/40"
                    )}
                  >
                    {letter}
                  </span>
                  <span className="leading-relaxed pt-0.5">{opt.text}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#FBBC0C] ml-auto flex-shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {/* Anterior disabled (strict mode) */}
            <span className="text-xs text-white/20">Sin retroceso</span>

            {isLastQuestion ? (
              <Button
                onClick={() => submitExam()}
                disabled={!allAnswered || phase === "submitting"}
                className="bg-[#FBBC0C] text-[#0A1628] font-bold hover:bg-[#FBBC0C]/90 gap-2 px-6"
              >
                {phase === "submitting" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Enviar examen"
                )}
              </Button>
            ) : (
              <Button
                onClick={goNext}
                className="bg-[#1F2F58] text-white hover:bg-[#2A3F6E] gap-2"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {error && (
            <p className="text-center text-sm text-[#F0846D] mt-4">{error}</p>
          )}
        </main>
      </div>
    );
  }

  return null;
}
