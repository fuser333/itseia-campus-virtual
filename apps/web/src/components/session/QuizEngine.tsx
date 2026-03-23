"use client";

// ============================================================
// ITSEIA Academy — QuizEngine
// v2 (005-exam-integrity): aleatorizacion servidor, timer,
// deteccion de cambio de pestaña, registro de integridad
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Loader2,
  Trophy,
  AlertCircle,
  HelpCircle,
  Clock,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Quiz, QuizQuestion, QuizQuestionOption } from "@/types/database";
import { useQuizTimer } from "@/features/exam-integrity/timer";
import { useTabVisibility } from "@/features/exam-integrity/visibility";

interface QuizEngineProps {
  quizId: string;
  sessionId: string;
  onPassed?: () => void;
  className?: string;
}

interface AttemptResult {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  attemptNumber: number;
  // Mapa: question_id -> { selectedIndex (original), correctIndex (original), isCorrect }
  answers: Record<string, { selectedIndex: number; correctIndex: number; isCorrect: boolean }>;
}

// ── Orden del servidor ──
interface QuizStartData {
  seed: number;
  shuffledQuestionIds: string[];
  optionOrders: Record<string, number[]>; // question_id -> [original indices en orden a mostrar]
  signedToken: string;
  timeLimitSeconds: number | null;
  showOneAtATime: boolean;
}

export default function QuizEngine({
  quizId,
  sessionId,
  onPassed,
  className,
}: QuizEngineProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  // questions en su orden de BD original
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  // IDs en orden shuffleado
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  // optionOrders del servidor
  const [optionOrders, setOptionOrders] = useState<Record<string, number[]>>({});
  const [signedToken, setSignedToken] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [startLoading, setStartLoading] = useState(false); // esperando /start
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mapa question_id -> ORIGINAL option index (no el shuffleado)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  // Timestamps: cuando se mostro cada pregunta (para calcular time_per_question)
  const questionShownAtRef = useRef<Record<string, number>>({});
  // Tiempo acumulado por pregunta (segundos)
  const timePerQuestionRef = useRef<Record<string, number>>({});

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [previousAttempts, setPreviousAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // ── Integridad ──
  const { tabSwitchCount, justSwitched } = useTabVisibility();
  const submitTriggeredRef = useRef(false);

  // Timer: se activa solo cuando hay tiempo limite
  const timeLimitSeconds = quiz?.time_limit_seconds ?? null;
  const timerKey = `quiz_timer_${quizId}`;

  // Auto-submit cuando el timer expira
  const handleTimerExpire = useCallback(() => {
    if (!submitTriggeredRef.current) {
      submitTriggeredRef.current = true;
      // Llamamos submitQuiz de forma diferida para que el estado sea consistente
      setTimeout(() => {
        submitQuizInternal();
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timer = useQuizTimer(
    result ? null : timeLimitSeconds,
    timerKey,
    handleTimerExpire
  );

  // ── Cargar quiz y preguntas ──
  const loadQuiz = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: quizData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .single();

    if (!quizData) {
      setError("No se encontro el quiz.");
      setLoading(false);
      return;
    }
    setQuiz(quizData);

    const { data: questionsData } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("order_index", { ascending: true });

    setQuestions(questionsData || []);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { count } = await supabase
        .from("quiz_attempts")
        .select("*", { count: "exact", head: true })
        .eq("quiz_id", quizId)
        .eq("user_id", user.id);
      setPreviousAttempts(count || 0);
    }

    setLoading(false);
  }, [quizId]);

  // ── Obtener orden del servidor ──
  const fetchStartData = useCallback(async () => {
    setStartLoading(true);
    try {
      const res = await fetch(`/api/quiz/${quizId}/start`, {
        method: "POST",
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Error al iniciar el quiz.");
        return;
      }
      const data: QuizStartData = await res.json();
      setOrderedIds(data.shuffledQuestionIds);
      setOptionOrders(data.optionOrders);
      setSignedToken(data.signedToken);
    } catch {
      setError("Error de conexion al iniciar el quiz.");
    } finally {
      setStartLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  useEffect(() => {
    if (!loading && questions.length > 0) {
      fetchStartData();
    }
  }, [loading, questions.length, fetchStartData]);

  // ── Registrar timestamp al cambiar de pregunta ──
  useEffect(() => {
    if (orderedIds.length === 0) return;
    const currentId = orderedIds[currentIndex];
    if (!currentId) return;
    questionShownAtRef.current[currentId] = Date.now();
  }, [currentIndex, orderedIds]);

  // ── Obtener opciones en orden shuffleado de un question ──
  function getOptions(question: QuizQuestion): QuizQuestionOption[] {
    let opts = question.options;
    if (typeof opts === "string") {
      try { opts = JSON.parse(opts as string); } catch { return []; }
    }
    if (opts && typeof opts === "object" && !Array.isArray(opts) && Array.isArray((opts as { options?: unknown[] }).options)) {
      return (opts as { options: QuizQuestionOption[] }).options;
    }
    if (Array.isArray(opts)) {
      return (opts as { text: string; is_correct?: boolean }[]).map((o) => ({
        text: o.text,
        is_correct: o.is_correct ?? false,
      }));
    }
    return [];
  }

  /**
   * Retorna las opciones en el orden shuffleado del servidor.
   * Tambien retorna el mapeo shuffledIndex -> originalIndex
   * para que al seleccionar una opcion usemos el originalIndex.
   */
  function getShuffledOptions(question: QuizQuestion): {
    options: QuizQuestionOption[];
    originalIndices: number[]; // originalIndices[i] = indice original de la opcion en posicion i
  } {
    const originalOptions = getOptions(question);
    const serverOrder = optionOrders[question.id];

    if (!serverOrder || serverOrder.length !== originalOptions.length) {
      // Sin orden del servidor, mostrar en orden original
      return {
        options: originalOptions,
        originalIndices: originalOptions.map((_, i) => i),
      };
    }

    return {
      options: serverOrder.map((origIdx) => originalOptions[origIdx]),
      originalIndices: serverOrder,
    };
  }

  function getCorrectIndex(question: QuizQuestion): number {
    let opts = question.options;
    if (typeof opts === "string") {
      try { opts = JSON.parse(opts as string); } catch { return -1; }
    }
    if (opts && typeof opts === "object" && !Array.isArray(opts) && (opts as { correct_index?: number }).correct_index !== undefined) {
      return (opts as { correct_index: number }).correct_index;
    }
    const arr = Array.isArray(opts)
      ? opts
      : (opts && typeof opts === "object" && !Array.isArray(opts) && Array.isArray((opts as { options?: unknown[] }).options))
      ? (opts as { options: { is_correct?: boolean }[] }).options
      : [];
    const idx = (arr as { is_correct?: boolean }[]).findIndex((o) => o.is_correct === true);
    return idx >= 0 ? idx : -1;
  }

  // Registrar tiempo en la pregunta actual antes de cambiar
  function recordTimeForCurrentQuestion() {
    const currentId = orderedIds[currentIndex];
    if (!currentId) return;
    const shownAt = questionShownAtRef.current[currentId];
    if (shownAt) {
      const elapsed = (Date.now() - shownAt) / 1000;
      timePerQuestionRef.current[currentId] =
        (timePerQuestionRef.current[currentId] ?? 0) + elapsed;
      // Reiniciar timestamp
      questionShownAtRef.current[currentId] = Date.now();
    }
  }

  function selectAnswer(questionId: string, originalIndex: number) {
    if (result) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: originalIndex }));
  }

  function goNext() {
    recordTimeForCurrentQuestion();
    if (currentIndex < orderedIds.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function goPrev() {
    recordTimeForCurrentQuestion();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  // Core submit logic
  async function submitQuizInternal() {
    if (!quiz || submitting) return;
    setSubmitting(true);
    setError(null);

    // Registrar tiempo de la pregunta actual
    recordTimeForCurrentQuestion();

    try {
      // Limpiar timer del localStorage
      try { localStorage.removeItem(timerKey); } catch { /* noop */ }

      const answersArray = Object.entries(selectedAnswers).map(([qId, origIdx]) => ({
        question_id: qId,
        selected_index: origIdx,
      }));

      const response = await fetch(`/api/quiz/${quizId}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: answersArray,
          sessionId,
          tab_switches: tabSwitchCount,
          time_per_question: timePerQuestionRef.current,
          browser_info: typeof navigator !== "undefined"
            ? `${navigator.userAgent} | ${navigator.language}`
            : null,
          question_order: orderedIds,
          option_orders: optionOrders,
          signed_token: signedToken,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Error al enviar el quiz.");
        setSubmitting(false);
        submitTriggeredRef.current = false;
        return;
      }

      const data = await response.json();

      // Construir resultados por pregunta (usando preguntas en orden shuffleado)
      const answerResults: AttemptResult["answers"] = {};
      questions.forEach((q) => {
        const correctIdx = getCorrectIndex(q);
        const selectedIdx = selectedAnswers[q.id] ?? -1;
        answerResults[q.id] = {
          selectedIndex: selectedIdx,
          correctIndex: correctIdx,
          isCorrect: selectedIdx === correctIdx,
        };
      });

      const attemptResult: AttemptResult = {
        score: data.score ?? 0,
        maxScore: data.max_score ?? questions.length,
        percentage: data.percentage ?? 0,
        passed: data.passed ?? false,
        attemptNumber: data.attempts_used ?? previousAttempts + 1,
        answers: answerResults,
      };

      setResult(attemptResult);
      setPreviousAttempts(attemptResult.attemptNumber);

      if (attemptResult.passed) {
        onPassed?.();
      }
    } catch {
      setError("Error de conexion. Intenta de nuevo.");
      submitTriggeredRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }

  async function submitQuiz() {
    submitTriggeredRef.current = true;
    await submitQuizInternal();
  }

  function retryQuiz() {
    setResult(null);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setError(null);
    setOrderedIds([]);
    setOptionOrders({});
    setSignedToken("");
    submitTriggeredRef.current = false;
    timePerQuestionRef.current = {};
    questionShownAtRef.current = {};
    fetchStartData();
  }

  // ── Loading states ──
  if (loading || startLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#FBBC0C]" />
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="size-8 text-[#F0846D]" />
        <p className="text-sm text-[#1F2F58]/50">{error}</p>
      </div>
    );
  }

  if (!quiz || questions.length === 0 || orderedIds.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <HelpCircle className="size-8 text-[#1F2F58]/20" />
        <p className="text-sm text-[#1F2F58]/50">Quiz no disponible aun.</p>
      </div>
    );
  }

  const canRetry = quiz.max_attempts === 0 || previousAttempts < quiz.max_attempts;
  // Para show_one_at_a_time: solo contar las preguntas mostradas
  const showOneAtATime = quiz.show_one_at_a_time ?? false;
  // Todos respondidos = todas las preguntas en orderedIds tienen respuesta
  const allAnswered = orderedIds.every((id) => selectedAnswers[id] !== undefined);

  // ── Results View ──
  if (result) {
    return (
      <div className={cn("space-y-6", className)}>
        <div
          className={cn(
            "rounded-2xl p-6 text-center",
            result.passed
              ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200"
              : "bg-gradient-to-br from-[#F0846D]/5 to-[#F0846D]/10 border border-[#F0846D]/20"
          )}
        >
          {result.passed ? (
            <Trophy className="mx-auto size-12 text-[#FBBC0C] mb-3" />
          ) : (
            <XCircle className="mx-auto size-12 text-[#F0846D] mb-3" />
          )}
          <h3 className="text-xl font-bold text-[#0A1628]">
            {result.passed ? "Aprobado!" : "No aprobado"}
          </h3>
          <p
            className={cn(
              "mt-1 text-3xl font-bold font-[family-name:var(--font-space-grotesk)]",
              result.passed ? "text-emerald-600" : "text-[#F0846D]"
            )}
          >
            {Math.round(result.percentage)}%
          </p>
          <p className="mt-1 text-sm text-[#1F2F58]/50">
            {result.score} de {result.maxScore} puntos
            {quiz.pass_percentage > 0 && ` (minimo ${quiz.pass_percentage}%)`}
          </p>
          <p className="mt-1 text-xs text-[#1F2F58]/30">
            Intento {result.attemptNumber}
            {quiz.max_attempts > 0 && ` de ${quiz.max_attempts}`}
          </p>
        </div>

        {/* Resultados por pregunta — usando orderedIds para mostrar en el orden que el estudiante los vio */}
        <div className="space-y-4">
          {orderedIds.map((qId, i) => {
            const q = questions.find((q) => q.id === qId);
            if (!q) return null;
            const qResult = result.answers[q.id];
            const originalOptions = getOptions(q);
            const serverOrder = optionOrders[q.id];
            // Mostrar opciones en el orden shuffleado que el estudiante vio
            const displayOptions = serverOrder
              ? serverOrder.map((origIdx) => originalOptions[origIdx])
              : originalOptions;
            // Mapear indice seleccionado (original) al indice de display
            const selectedOriginal = qResult?.selectedIndex ?? -1;
            const correctOriginal = qResult?.correctIndex ?? -1;
            const selectedDisplayIdx = serverOrder
              ? serverOrder.indexOf(selectedOriginal)
              : selectedOriginal;
            const correctDisplayIdx = serverOrder
              ? serverOrder.indexOf(correctOriginal)
              : correctOriginal;

            return (
              <div
                key={q.id}
                className={cn(
                  "rounded-xl border p-4",
                  qResult?.isCorrect
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-[#F0846D]/20 bg-[#F0846D]/5"
                )}
              >
                <div className="flex items-start gap-2 mb-3">
                  {qResult?.isCorrect ? (
                    <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="size-4 mt-0.5 shrink-0 text-[#F0846D]" />
                  )}
                  <p className="text-sm font-medium text-[#0A1628]">
                    {i + 1}. {q.question_text}
                  </p>
                </div>
                <div className="ml-6 space-y-1.5">
                  {displayOptions.map((opt, displayIdx) => {
                    const isCorrectDisplay = displayIdx === correctDisplayIdx;
                    const isSelectedDisplay = displayIdx === selectedDisplayIdx;
                    const isWrongSelection = isSelectedDisplay && !isCorrectDisplay;

                    return (
                      <div
                        key={displayIdx}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm",
                          isCorrectDisplay
                            ? "bg-emerald-100 text-emerald-700 font-medium"
                            : isWrongSelection
                            ? "bg-[#F0846D]/10 text-[#F0846D] line-through"
                            : "text-[#1F2F58]/50"
                        )}
                      >
                        <span className="font-mono text-xs">
                          {String.fromCharCode(65 + displayIdx)})
                        </span>
                        {opt?.text}
                        {isCorrectDisplay && (
                          <CheckCircle2 className="ml-auto size-3.5 text-emerald-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <div className="ml-6 mt-3 rounded-lg bg-[#FBBC0C]/5 border border-[#FBBC0C]/15 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#FBBC0C] mb-1">
                      Explicacion
                    </p>
                    <p className="text-sm text-[#1F2F58]/60">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!result.passed && canRetry && (
          <div className="flex justify-center">
            <Button
              onClick={retryQuiz}
              className="gap-2 bg-[#FBBC0C] font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90"
            >
              <RotateCcw className="size-4" />
              Intentar de nuevo
            </Button>
          </div>
        )}

        {!result.passed && !canRetry && (
          <p className="text-center text-sm text-[#F0846D]">
            Has agotado el numero maximo de intentos ({quiz.max_attempts}).
          </p>
        )}

        {error && (
          <p className="text-center text-sm text-[#F0846D]">{error}</p>
        )}
      </div>
    );
  }

  // ── Quiz View ──
  const currentQuestionId = orderedIds[currentIndex];
  const currentQuestion = questions.find((q) => q.id === currentQuestionId);
  if (!currentQuestion) return null;

  const { options: shuffledOptions, originalIndices } = getShuffledOptions(currentQuestion);
  const selectedOriginalIndex = selectedAnswers[currentQuestion.id];
  // Indice de display de la opcion seleccionada
  const selectedDisplayIndex =
    selectedOriginalIndex !== undefined
      ? originalIndices.indexOf(selectedOriginalIndex)
      : -1;

  return (
    <div className={cn("space-y-6", className)}>
      {/* ── Tab-switch warning banner ── */}
      {justSwitched && (
        <div className="flex items-center gap-2 rounded-xl border border-[#F0846D]/30 bg-[#F0846D]/5 px-4 py-3">
          <Eye className="size-4 shrink-0 text-[#F0846D]" />
          <p className="text-sm text-[#F0846D]">
            Se detecto que saliste de la ventana. Esto queda registrado.
          </p>
        </div>
      )}

      {/* ── Quiz header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#0A1628]">{quiz.title}</h3>
          {quiz.description && (
            <p className="mt-0.5 text-xs text-[#1F2F58]/50">{quiz.description}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-[#1F2F58]/40">
            {quiz.pass_percentage}% para aprobar
          </span>
          {/* Timer */}
          {timeLimitSeconds && !timer.isExpired && (
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                timer.isWarning
                  ? "bg-[#F0846D]/10 text-[#F0846D]"
                  : "bg-[#FBBC0C]/10 text-[#1F2F58]"
              )}
            >
              <Clock className="size-3" />
              {timer.formattedTime}
            </div>
          )}
          {/* Tab switch counter — solo si hay mas de 0 */}
          {tabSwitchCount > 0 && (
            <span className="text-xs text-[#F0846D]/70">
              {tabSwitchCount} salida{tabSwitchCount !== 1 ? "s" : ""} registrada{tabSwitchCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Timer bar */}
      {timeLimitSeconds && timeLimitSeconds > 0 && !timer.isExpired && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1F2F58]/10">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              timer.isWarning ? "bg-[#F0846D]" : "bg-[#FBBC0C]"
            )}
            style={{
              width: `${Math.max(0, (timer.secondsLeft / timeLimitSeconds) * 100)}%`,
            }}
          />
        </div>
      )}

      {/* Progress dots — solo si no es one-at-a-time mode con muchas preguntas */}
      {(!showOneAtATime || orderedIds.length <= 20) && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {orderedIds.map((qId, i) => (
            <button
              key={qId}
              onClick={() => {
                if (!showOneAtATime) {
                  recordTimeForCurrentQuestion();
                  setCurrentIndex(i);
                }
              }}
              disabled={showOneAtATime}
              className={cn(
                "h-2 rounded-full transition-all",
                i === currentIndex
                  ? "w-6 bg-[#FBBC0C]"
                  : selectedAnswers[qId] !== undefined
                  ? "w-2 bg-[#73B8E7]"
                  : "w-2 bg-[#1F2F58]/10"
              )}
            />
          ))}
        </div>
      )}

      {/* Question */}
      <div className="rounded-xl border border-[#1F2F58]/8 bg-white p-5">
        <p className="text-xs font-medium text-[#73B8E7] mb-2">
          Pregunta {currentIndex + 1} de {orderedIds.length}
        </p>
        <p className="text-base font-medium text-[#0A1628] leading-relaxed">
          {currentQuestion.question_text}
        </p>
      </div>

      {/* Options (en orden shuffleado del servidor) */}
      <div className="space-y-2.5">
        {shuffledOptions.map((opt, displayIdx) => {
          const letter = String.fromCharCode(65 + displayIdx);
          const isSelected = selectedDisplayIndex === displayIdx;

          return (
            <button
              key={displayIdx}
              onClick={() => {
                // Guardar el ORIGINAL index, no el display index
                const originalIdx = originalIndices[displayIdx];
                selectAnswer(currentQuestion.id, originalIdx);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all",
                isSelected
                  ? "border-[#FBBC0C] bg-[#FBBC0C]/5 text-[#0A1628] font-medium shadow-sm"
                  : "border-[#1F2F58]/8 bg-white text-[#1F2F58]/70 hover:border-[#73B8E7]/30 hover:bg-[#73B8E7]/5"
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                  isSelected
                    ? "bg-[#FBBC0C] text-[#0A1628]"
                    : "bg-[#1F2F58]/5 text-[#1F2F58]/40"
                )}
              >
                {letter}
              </span>
              {opt?.text}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={goPrev}
          disabled={currentIndex === 0 || showOneAtATime}
          className="text-[#1F2F58]/50"
        >
          Anterior
        </Button>

        {currentIndex < orderedIds.length - 1 ? (
          <Button
            onClick={goNext}
            disabled={showOneAtATime && selectedAnswers[currentQuestion.id] === undefined}
            className="gap-2 bg-[#1F2F58] text-white hover:bg-[#0A1628]"
          >
            Siguiente
            <ArrowRight className="size-3.5" />
          </Button>
        ) : (
          <Button
            onClick={submitQuiz}
            disabled={!allAnswered || submitting}
            className="gap-2 bg-[#FBBC0C] font-semibold text-[#0A1628] hover:bg-[#FBBC0C]/90 shadow-md shadow-[#FBBC0C]/20"
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Enviar respuestas"
            )}
          </Button>
        )}
      </div>

      {error && (
        <p className="text-center text-sm text-[#F0846D]">{error}</p>
      )}
    </div>
  );
}
