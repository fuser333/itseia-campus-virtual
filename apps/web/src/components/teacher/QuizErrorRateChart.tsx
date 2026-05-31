"use client";

// ============================================================
// QuizErrorRateChart — Lista de preguntas por tasa de error
// ============================================================

import { HelpCircle } from "lucide-react";
import type { QuizErrorRate } from "@/types/database";

interface QuizErrorRateChartProps {
  data: QuizErrorRate[];
}

export function QuizErrorRateChart({ data }: QuizErrorRateChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 py-12 text-center">
        <HelpCircle className="mx-auto size-10 text-white/80 mb-3" />
        <p className="text-sm font-medium text-white/85">Sin datos de quizzes</p>
        <p className="text-xs text-white/55 mt-1">
          Cuando los estudiantes respondan quizzes, aqui veras las preguntas con mayor tasa de error.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-white/65">
        Preguntas ordenadas por tasa de error (mayor a menor)
      </p>

      {data.map((item, index) => {
        const errorPercent = Math.round(item.errorRate * 100);
        const barColor =
          errorPercent >= 70
            ? "bg-red-500"
            : errorPercent >= 50
            ? "bg-orange-400"
            : errorPercent >= 30
            ? "bg-[#FBBC0C]"
            : "bg-emerald-500";

        return (
          <div
            key={item.questionId}
            className="rounded-xl border border-white/20 bg-[#0A1628]/80 p-4"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/65">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium text-white"
                  title={item.questionText}
                >
                  {item.questionText.length > 100
                    ? item.questionText.slice(0, 100) + "…"
                    : item.questionText}
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-2.5 rounded-full bg-white/10">
                    <div
                      className={`h-2.5 rounded-full transition-all ${barColor}`}
                      style={{ width: `${errorPercent}%` }}
                    />
                  </div>
                  <span
                    className={`shrink-0 text-sm font-bold ${
                      errorPercent >= 70
                        ? "text-red-600"
                        : errorPercent >= 50
                        ? "text-orange-500"
                        : errorPercent >= 30
                        ? "text-[#FBBC0C]"
                        : "text-emerald-600"
                    }`}
                  >
                    {errorPercent}% error
                  </span>
                </div>

                <p className="mt-1 text-xs text-white/55">
                  {item.incorrectCount} de {item.totalAttempts} respuestas incorrectas
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
