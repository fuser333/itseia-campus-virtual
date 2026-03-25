"use client";

// ============================================================
// ITSEIA Academy — ExamResultsSummary
// Feature: 009-industry-certifications
// ============================================================

import Link from "next/link";
import { CheckCircle2, XCircle, Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExamAttempt, DomainScore } from "@/types/database";

interface ReviewQuestion {
  id: string;
  enunciado: string;
  opciones: Array<{ text: string; is_correct: boolean }>;
  respuesta_correcta: number;
  explicacion: string | null;
  student_answer: number;
  is_correct: boolean;
  domain_id: string | null;
}

interface DomainInfo {
  id: string;
  nombre: string;
  porcentaje_en_examen: number;
}

interface Props {
  attempt: ExamAttempt;
  questions: ReviewQuestion[];
  certificationNombre: string;
  certificationSlug: string;
  umbralPorcentaje: number;
  domains: DomainInfo[];
}

export default function ExamResultsSummary({
  attempt,
  questions,
  certificationNombre,
  certificationSlug,
  umbralPorcentaje,
  domains,
}: Props) {
  const percentage = attempt.percentage ?? 0;
  const passed = attempt.aprobado ?? false;
  const scoreTotal = attempt.score_total ?? 0;
  const totalQuestions = attempt.total_questions ?? questions.length;
  const scorePorDominio = attempt.score_por_dominio || {};

  const domainMap = new Map(domains.map((d) => [d.id, d]));

  function getOptions(q: ReviewQuestion): Array<{ text: string }> {
    const opts = q.opciones;
    if (Array.isArray(opts)) return opts;
    if (opts && typeof opts === "object" && Array.isArray((opts as { options?: unknown[] }).options)) {
      return (opts as { options: Array<{ text: string }> }).options;
    }
    return [];
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* Overall score card */}
        <div
          className={cn(
            "rounded-2xl border p-8 text-center",
            passed
              ? "border-emerald-500/25 bg-emerald-500/5"
              : "border-[#F0846D]/25 bg-[#F0846D]/5"
          )}
        >
          {passed ? (
            <Trophy className="w-16 h-16 text-[#FBBC0C] mx-auto mb-3" />
          ) : (
            <XCircle className="w-16 h-16 text-[#F0846D] mx-auto mb-3" />
          )}

          <h1
            className={cn(
              "text-5xl font-black mb-2 font-[family-name:var(--font-space-grotesk)]",
              passed ? "text-emerald-400" : "text-[#F0846D]"
            )}
          >
            {percentage.toFixed(1)}%
          </h1>

          <p className="text-lg font-semibold text-white mb-1">
            {passed ? "Simulacro Aprobado" : "No Aprobado"}
          </p>
          <p className="text-white/40 text-sm mb-4">
            {scoreTotal} de {totalQuestions} respuestas correctas &middot; Minimo {umbralPorcentaje}%
          </p>

          {passed && (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/25 px-4 py-2 text-sm text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Badge de Simulacro Aprobado en tu portafolio
            </div>
          )}

          {!passed && (
            <p className="text-white/40 text-sm">
              Necesitas {umbralPorcentaje - percentage > 0 ? (umbralPorcentaje - percentage).toFixed(1) : 0}% mas para aprobar. Revisa los dominios debiles y vuelve a intentarlo.
            </p>
          )}
        </div>

        {/* Score by domain */}
        {Object.keys(scorePorDominio).length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              Resultado por Dominio
            </h2>
            <div className="space-y-3">
              {Object.entries(scorePorDominio).map(([domainId, score]) => {
                const domain = domainMap.get(domainId);
                const ds = score as DomainScore;
                const pct = ds.total > 0 ? (ds.correct / ds.total) * 100 : 0;
                const domainPassed = pct >= umbralPorcentaje;
                return (
                  <div key={domainId}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-white/70">
                        {domain?.nombre || "Dominio desconocido"}
                      </p>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          domainPassed ? "text-emerald-400" : "text-[#F0846D]"
                        )}
                      >
                        {ds.correct}/{ds.total} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          domainPassed ? "bg-emerald-500" : "bg-[#F0846D]"
                        )}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/certificaciones/${certificationSlug}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-white/10 text-white/60 hover:bg-white/5 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a la certificacion
            </Button>
          </Link>
          <Link href={`/certificaciones/${certificationSlug}/examen`} className="flex-1">
            <Button className="w-full bg-[#FBBC0C] text-[#0A1628] font-bold hover:bg-[#FBBC0C]/90 gap-2">
              <RotateCcw className="w-4 h-4" />
              Intentar de nuevo
            </Button>
          </Link>
        </div>

        {/* Question review */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
            Revision de Preguntas ({questions.length})
          </h2>
          <div className="space-y-4">
            {questions.map((q, i) => {
              const opts = getOptions(q);
              const domain = domainMap.get(q.domain_id || "");
              return (
                <div
                  key={q.id}
                  className={cn(
                    "rounded-xl border p-4",
                    q.is_correct
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-[#F0846D]/20 bg-[#F0846D]/5"
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start gap-2.5 mb-3">
                    {q.is_correct ? (
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#F0846D]" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-white/30 mb-1">
                        Pregunta {i + 1}
                        {domain && ` · ${domain.nombre}`}
                      </p>
                      <p className="text-sm font-medium text-white leading-relaxed">
                        {q.enunciado}
                      </p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="ml-6 space-y-1.5">
                    {opts.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.respuesta_correcta;
                      const isStudentAnswer = optIdx === q.student_answer;
                      const isWrongSelection = isStudentAnswer && !isCorrect;

                      return (
                        <div
                          key={optIdx}
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm",
                            isCorrect
                              ? "bg-emerald-500/15 text-emerald-300 font-medium"
                              : isWrongSelection
                              ? "bg-[#F0846D]/10 text-[#F0846D] line-through"
                              : "text-white/30"
                          )}
                        >
                          <span className="font-mono text-xs text-white/30">
                            {String.fromCharCode(65 + optIdx)})
                          </span>
                          {opt.text}
                          {isCorrect && (
                            <CheckCircle2 className="ml-auto w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {q.explicacion && (
                    <div className="ml-6 mt-3 rounded-lg bg-[#1F2F58]/50 border border-[#FBBC0C]/15 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#FBBC0C] mb-1">
                        Explicacion
                      </p>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {q.explicacion}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
