"use client";

/**
 * TeacherQuizStatsPanel — Estadísticas del quiz inline de la sesión.
 * MVP: calcula difficulty estimada por opción + lista preguntas con
 * respuesta correcta visible.
 *
 * No requiere tabla aparte. El día que tengamos cursos_pro_quiz_attempts
 * podemos sumar: % de aprobación, intentos promedio, tiempo promedio.
 */

import { BarChart3, CheckCircle2, HelpCircle } from "lucide-react";

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain?: string;
}

interface Props {
  questions: QuizQuestion[] | null;
}

export default function TeacherQuizStatsPanel({ questions }: Props) {
  if (!questions || questions.length === 0) {
    return (
      <div className="p-6 text-center">
        <HelpCircle className="mx-auto size-10 text-white/30" />
        <p className="mt-3 text-sm text-white/60">
          Esta sesión no tiene quiz cargado en BD.
        </p>
      </div>
    );
  }

  const avgOptions = Math.round(
    questions.reduce((acc, q) => acc + q.options.length, 0) / questions.length
  );

  return (
    <div className="p-6 space-y-5">
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BarChart3 className="size-5 text-[#FBBC0C]" />
          Estadísticas del Quiz
        </h3>
        <p className="text-xs text-white/60 mt-1">
          Vista docente del banco de preguntas y respuestas correctas.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Preguntas" value={questions.length} />
        <Stat label="Opciones promedio" value={avgOptions} />
        <Stat label="Aprobación mínima" value="70%" />
      </div>

      <div className="rounded-xl bg-[#73B8E7]/10 border border-[#73B8E7]/30 p-4">
        <p className="text-xs text-white/80">
          📊 Métricas de uso (intentos, aprobados, tiempo promedio)
          estarán disponibles cuando se active el tracking de
          <span className="font-mono"> cursos_pro_quiz_attempts</span>.
        </p>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-[#FBBC0C]">
          Banco de preguntas
        </h4>
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2"
          >
            <p className="text-sm font-semibold text-white">
              {idx + 1}. {q.q}
            </p>
            <ul className="space-y-1 ml-4">
              {q.options.map((opt, oIdx) => {
                const isCorrect = oIdx === q.answer;
                return (
                  <li
                    key={oIdx}
                    className={`flex items-start gap-2 text-xs ${
                      isCorrect ? "text-white" : "text-white/55"
                    }`}
                  >
                    <span className="font-mono shrink-0">
                      {String.fromCharCode(65 + oIdx)}.
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isCorrect && (
                      <CheckCircle2 className="size-3.5 text-[#FBBC0C] shrink-0 mt-0.5" />
                    )}
                  </li>
                );
              })}
            </ul>
            {q.explain && (
              <p className="text-[11px] text-white/65 mt-2 pl-4 border-l-2 border-[#73B8E7]/40">
                💡 {q.explain}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
      <p className="text-2xl font-bold text-[#FBBC0C]">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-white/55 mt-1">
        {label}
      </p>
    </div>
  );
}
