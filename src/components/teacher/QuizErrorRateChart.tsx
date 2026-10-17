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
      <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
        <HelpCircle className="mx-auto size-10 text-gray-200 mb-3" />
        <p className="text-sm font-medium text-gray-700">Sin datos de quizzes</p>
        <p className="text-xs text-gray-400 mt-1">
          Cuando los estudiantes respondan quizzes, aqui veras las preguntas con mayor tasa de error.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
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
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium text-gray-900"
                  title={item.questionText}
                >
                  {item.questionText.length > 100
                    ? item.questionText.slice(0, 100) + "…"
                    : item.questionText}
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-2.5 rounded-full bg-gray-100">
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

                <p className="mt-1 text-xs text-gray-400">
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
