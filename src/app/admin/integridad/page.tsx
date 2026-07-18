"use client";

// ============================================================
// ITSEIA Academy — Admin: Integridad de Evaluaciones
// Buscar quiz por ID, ver reporte de integridad, exportar CSV
// Art. 62 RRA 2022 — evidencia para SENESCYT
// ============================================================

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  Loader2,
  Search,
  AlertTriangle,
  CheckCircle2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IntegrityReport } from "@/types/database";

function getIntegrityColor(score: number) {
  if (score >= 0.8) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 0.5) return "text-[#FBBC0C] bg-[#FBBC0C]/10 border-[#FBBC0C]/30";
  return "text-[#F0846D] bg-[#F0846D]/10 border-[#F0846D]/20";
}

function getIntegrityLabel(score: number) {
  if (score >= 0.8) return "Alta";
  if (score >= 0.5) return "Media";
  return "Baja";
}

export default function AdminIntegridadPage() {
  const supabase = createClient();

  // Buscar quizzes
  const [searchTerm, setSearchTerm] = useState("");
  const [quizzes, setQuizzes] = useState<{ id: string; title: string; session_id: string }[]>([]);
  const [searching, setSearching] = useState(false);

  // Reporte seleccionado
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [selectedQuizTitle, setSelectedQuizTitle] = useState<string>("");
  const [report, setReport] = useState<IntegrityReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const searchQuizzes = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    const { data } = await supabase
      .from("quizzes")
      .select("id, title, session_id")
      .ilike("title", `%${searchTerm.trim()}%`)
      .limit(20);
    setQuizzes(data || []);
    setSearching(false);
  }, [searchTerm, supabase]);

  async function loadReport(quizId: string, quizTitle: string) {
    setSelectedQuizId(quizId);
    setSelectedQuizTitle(quizTitle);
    setLoadingReport(true);
    setReportError(null);
    setReport(null);

    try {
      const res = await fetch(`/api/quiz/${quizId}/integrity-report`);
      if (!res.ok) {
        const d = await res.json();
        setReportError(d.error || "Error al cargar el reporte.");
        return;
      }
      const data: IntegrityReport = await res.json();
      setReport(data);
    } catch {
      setReportError("Error de conexion.");
    } finally {
      setLoadingReport(false);
    }
  }

  function exportCSV() {
    if (!report) return;
    const headers = [
      "Estudiante",
      "Email",
      "Puntaje %",
      "Aprobado",
      "Integridad %",
      "Cambios pestaña",
      "Marcado",
      "Alertas",
      "Fecha completado",
    ];
    const rows = report.attempts_summary.map((a) => [
      a.user_name,
      a.user_email,
      a.percentage ?? 0,
      a.passed ? "Si" : "No",
      Math.round(a.integrity_score * 100),
      a.tab_switches,
      a.flagged ? "Si" : "No",
      (a.suspicious_flags ?? []).join("; "),
      a.completed_at ? new Date(a.completed_at).toLocaleString("es-EC") : "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `integridad-${selectedQuizId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#73B8E7]/10">
          <ShieldCheck className="size-5 text-[#73B8E7]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#0A1628] font-[family-name:var(--font-space-grotesk)]">
            Integridad de Evaluaciones
          </h1>
          <p className="text-sm text-[#1F2F58]/50">
            Reportes de integridad academica — Art. 62 RRA 2022
          </p>
        </div>
      </div>

      {/* Buscar quiz */}
      <div className="rounded-2xl border border-[#1F2F58]/8 bg-white p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[#1F2F58]">Buscar quiz</h2>
        <div className="flex gap-2">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") searchQuizzes(); }}
            placeholder="Buscar por nombre del quiz..."
            className="flex-1"
          />
          <Button onClick={searchQuizzes} disabled={searching}>
            {searching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
          </Button>
        </div>

        {quizzes.length > 0 && (
          <div className="divide-y divide-gray-50 rounded-xl border border-gray-100 overflow-hidden">
            {quizzes.map((q) => (
              <button
                key={q.id}
                onClick={() => loadReport(q.id, q.title)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-[#73B8E7]/5",
                  selectedQuizId === q.id && "bg-[#73B8E7]/10"
                )}
              >
                <span className="font-medium text-[#0A1628]">{q.title}</span>
                <span className="text-xs text-[#1F2F58]/30">{q.id.slice(0, 8)}...</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reporte */}
      {(loadingReport || report || reportError) && (
        <div className="rounded-2xl border border-[#1F2F58]/8 bg-white p-5 space-y-6">
          {loadingReport && (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-[#FBBC0C]" />
            </div>
          )}

          {reportError && (
            <div className="flex items-center gap-2 text-[#F0846D] text-sm">
              <AlertTriangle className="size-4" />
              {reportError}
            </div>
          )}

          {report && (
            <>
              {/* Titulo */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#0A1628]">{selectedQuizTitle}</h2>
                  <p className="text-xs text-[#1F2F58]/40">
                    Generado: {new Date(report.generated_at).toLocaleString("es-EC")}
                  </p>
                </div>
                {report.total_attempts > 0 && (
                  <Button variant="outline" onClick={exportCSV} className="gap-2 text-sm">
                    <Download className="size-4" />
                    Exportar CSV
                  </Button>
                )}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Total intentos", value: report.total_attempts, color: "text-[#1F2F58]" },
                  { label: "Marcados", value: report.total_flagged, color: report.total_flagged > 0 ? "text-[#F0846D]" : "text-emerald-600" },
                  { label: "Integridad prom.", value: `${report.avg_integrity_score}%`, color: "text-[#1F2F58]" },
                  { label: "Puntaje prom.", value: `${report.avg_score_percentage}%`, color: "text-[#1F2F58]" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-[#1F2F58]/5 p-3 text-center">
                    <p className={`text-2xl font-bold font-[family-name:var(--font-space-grotesk)] ${stat.color}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-[#1F2F58]/50 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Narrativa Gemini */}
              {report.gemini_narrative && (
                <div className="rounded-xl border border-[#73B8E7]/20 bg-[#73B8E7]/5 p-4">
                  <Label className="text-[#73B8E7] text-xs uppercase tracking-wider mb-2 block">
                    Analisis IA (Gemini)
                  </Label>
                  <p className="text-sm text-[#1F2F58]/70 leading-relaxed">
                    {report.gemini_narrative}
                  </p>
                </div>
              )}

              {/* Pares sospechosos */}
              {report.suspicious_pairs.length > 0 && (
                <div className="rounded-xl border border-[#F0846D]/20 bg-[#F0846D]/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="size-4 text-[#F0846D]" />
                    <p className="text-sm font-semibold text-[#F0846D]">
                      {report.suspicious_pairs.length} par(es) con respuestas sospechosamente similares
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {report.suspicious_pairs.map((pair, i) => (
                      <div key={i} className="text-xs text-[#1F2F58]/70 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[#F0846D] shrink-0" />
                        <span className="font-medium">{pair.user_a}</span>
                        <span className="text-[#1F2F58]/40">y</span>
                        <span className="font-medium">{pair.user_b}</span>
                        <span className="ml-auto text-[#F0846D] font-medium">{pair.similarity}% similitud</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabla de intentos */}
              {report.total_attempts === 0 ? (
                <p className="text-center text-sm text-[#1F2F58]/40 py-8">
                  Aun no hay intentos registrados para este quiz.
                </p>
              ) : (
                <div>
                  <h3 className="text-sm font-semibold text-[#1F2F58] mb-3">
                    Detalle por estudiante ({report.total_attempts})
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-xs">
                      <thead className="bg-[#1F2F58]/3">
                        <tr>
                          {["Estudiante", "Puntaje", "Integridad", "Cambios pestaña", "Alertas", "Estado"].map((h) => (
                            <th key={h} className="py-2.5 px-3 text-left font-semibold text-[#1F2F58]/50">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {report.attempts_summary.map((attempt) => (
                          <tr
                            key={attempt.attempt_id}
                            className={attempt.flagged ? "bg-[#F0846D]/3" : "bg-white"}
                          >
                            <td className="py-2.5 px-3">
                              <p className="font-medium text-[#0A1628]">{attempt.user_name}</p>
                              <p className="text-[#1F2F58]/40 text-[10px]">{attempt.user_email}</p>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`font-semibold ${attempt.passed ? "text-emerald-600" : "text-[#F0846D]"}`}>
                                {attempt.percentage ?? 0}%
                              </span>
                              <br />
                              <span className={`text-[10px] ${attempt.passed ? "text-emerald-500" : "text-[#F0846D]/60"}`}>
                                {attempt.passed ? "Aprobado" : "No aprobado"}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`rounded-full border px-2 py-0.5 font-medium ${getIntegrityColor(attempt.integrity_score)}`}>
                                {getIntegrityLabel(attempt.integrity_score)} — {Math.round(attempt.integrity_score * 100)}%
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={cn(
                                "font-semibold",
                                attempt.tab_switches > 2 ? "text-[#F0846D]" :
                                attempt.tab_switches > 0 ? "text-[#FBBC0C]" :
                                "text-[#1F2F58]/30"
                              )}>
                                {attempt.tab_switches}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 max-w-[200px]">
                              {(attempt.suspicious_flags ?? []).length > 0 ? (
                                <ul className="space-y-0.5">
                                  {(attempt.suspicious_flags ?? []).map((flag, fi) => (
                                    <li key={fi} className="text-[#F0846D]/80">{flag}</li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-[#1F2F58]/30">Sin alertas</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              {attempt.flagged ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#F0846D]/10 px-2 py-0.5 text-[#F0846D]">
                                  <AlertTriangle className="size-3" />
                                  Alerta
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600">
                                  <CheckCircle2 className="size-3" />
                                  OK
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
