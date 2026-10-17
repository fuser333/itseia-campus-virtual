"use client";

// ============================================================
// ITSEIA Academy — QuizBuilder
// v2 (005-exam-integrity): configuracion de integridad,
// tiempo limite, banco rotativo, reporte de integridad
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  Eye,
  X,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Download,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type {
  Quiz,
  QuizQuestion,
  QuizQuestionOptions,
  IntegrityReport,
} from "@/types/database";

interface QuizBuilderProps {
  sessionId: string;
}

interface QuestionFormData {
  question_text: string;
  options: string[];
  correct_index: number;
  explanation: string;
  points: number;
}

const EMPTY_QUESTION: QuestionFormData = {
  question_text: "",
  options: ["", "", "", ""],
  correct_index: 0,
  explanation: "",
  points: 1,
};

function getIntegrityColor(score: number): string {
  if (score >= 0.8) return "text-emerald-600 bg-emerald-50";
  if (score >= 0.5) return "text-[#FBBC0C] bg-[#FBBC0C]/10";
  return "text-[#F0846D] bg-[#F0846D]/10";
}

function getIntegrityLabel(score: number): string {
  if (score >= 0.8) return "Alta";
  if (score >= 0.5) return "Media";
  return "Baja";
}

export default function QuizBuilder({ sessionId }: QuizBuilderProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Quiz settings
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [passPercentage, setPassPercentage] = useState("70");
  const [maxAttempts, setMaxAttempts] = useState("3");

  // Integrity settings (005-exam-integrity)
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<string>("");
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [showOneAtATime, setShowOneAtATime] = useState(false);
  const [bankRotativo, setBankRotativo] = useState(false);
  const [showNQuestions, setShowNQuestions] = useState<string>("");

  // Question form
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [integrityOpen, setIntegrityOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [form, setForm] = useState<QuestionFormData>(EMPTY_QUESTION);

  // Integrity report
  const [integrityReport, setIntegrityReport] = useState<IntegrityReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const fetchData = useCallback(async () => {
    const { data: quizData } = await supabase
      .from("quizzes")
      .select("*")
      .eq("session_id", sessionId)
      .limit(1)
      .maybeSingle();

    if (quizData) {
      setQuiz(quizData);
      setQuizTitle(quizData.title);
      setQuizDescription(quizData.description || "");
      setPassPercentage(quizData.pass_percentage?.toString() || "70");
      setMaxAttempts(quizData.max_attempts?.toString() || "3");

      // Integridad
      const limitSecs = quizData.time_limit_seconds;
      setTimeLimitMinutes(limitSecs ? String(Math.round(limitSecs / 60)) : "");
      setShuffleQuestions(quizData.shuffle_questions ?? true);
      setShuffleOptions(quizData.shuffle_options ?? true);
      setShowOneAtATime(quizData.show_one_at_a_time ?? false);
      const hasBank = quizData.show_n_questions != null;
      setBankRotativo(hasBank);
      setShowNQuestions(hasBank ? String(quizData.show_n_questions) : "");

      const { data: questionsData } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizData.id)
        .order("order_index");

      setQuestions(questionsData || []);
    }

    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function saveQuizSettings() {
    setSaving(true);

    const timeLimitSecs = timeLimitMinutes
      ? parseInt(timeLimitMinutes, 10) * 60
      : null;

    const payload = {
      session_id: sessionId,
      title: quizTitle.trim() || "Quiz",
      description: quizDescription.trim() || null,
      pass_percentage: parseInt(passPercentage, 10) || 70,
      max_attempts: parseInt(maxAttempts, 10) || 3,
      is_active: true,
      // Integridad
      shuffle_questions: shuffleQuestions,
      shuffle_options: shuffleOptions,
      time_limit_seconds: timeLimitSecs,
      show_one_at_a_time: showOneAtATime,
      show_n_questions: bankRotativo && showNQuestions ? parseInt(showNQuestions, 10) : null,
    };

    if (quiz) {
      await supabase.from("quizzes").update(payload).eq("id", quiz.id);
    } else {
      const { data } = await supabase
        .from("quizzes")
        .insert(payload)
        .select()
        .single();
      if (data) setQuiz(data);
    }

    setSaving(false);
    fetchData();
  }

  function openCreateQuestion() {
    if (!quiz) return;
    setEditingQuestionId(null);
    setForm(EMPTY_QUESTION);
    setDialogOpen(true);
  }

  function openEditQuestion(q: QuizQuestion) {
    setEditingQuestionId(q.id);
    const opts = q.options as QuizQuestionOptions;
    const optionTexts = (opts.options || []).map((o) => o.text);
    while (optionTexts.length < 4) optionTexts.push("");
    setForm({
      question_text: q.question_text,
      options: optionTexts,
      correct_index: opts.correct_index ?? 0,
      explanation: q.explanation || "",
      points: q.points || 1,
    });
    setDialogOpen(true);
  }

  async function handleSaveQuestion() {
    if (!quiz) return;
    if (!form.question_text.trim()) return;
    setSaving(true);

    const nonEmptyOptions = form.options.filter((o) => o.trim());
    if (nonEmptyOptions.length < 2) {
      setSaving(false);
      return;
    }

    const optionsPayload: QuizQuestionOptions = {
      options: nonEmptyOptions.map((text, i) => ({
        text: text.trim(),
        is_correct: i === form.correct_index,
      })),
      correct_index: form.correct_index,
    };

    const payload = {
      quiz_id: quiz.id,
      question_text: form.question_text.trim(),
      question_type: "multiple_choice" as const,
      options: optionsPayload,
      explanation: form.explanation.trim() || null,
      points: form.points || 1,
      order_index: editingQuestionId
        ? questions.find((q) => q.id === editingQuestionId)?.order_index || 0
        : questions.length,
    };

    if (editingQuestionId) {
      await supabase.from("quiz_questions").update(payload).eq("id", editingQuestionId);
    } else {
      await supabase.from("quiz_questions").insert(payload);
    }

    setSaving(false);
    setDialogOpen(false);
    fetchData();
  }

  async function handleDeleteQuestion(questionId: string) {
    if (!window.confirm("Eliminar esta pregunta?")) return;
    await supabase.from("quiz_questions").delete().eq("id", questionId);
    fetchData();
  }

  async function moveQuestion(questionId: string, direction: "up" | "down") {
    const idx = questions.findIndex((q) => q.id === questionId);
    if (idx < 0) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const current = questions[idx];
    const target = questions[targetIdx];
    await Promise.all([
      supabase.from("quiz_questions").update({ order_index: target.order_index }).eq("id", current.id),
      supabase.from("quiz_questions").update({ order_index: current.order_index }).eq("id", target.id),
    ]);
    fetchData();
  }

  async function loadIntegrityReport() {
    if (!quiz) return;
    setLoadingReport(true);
    setIntegrityOpen(true);
    try {
      const res = await fetch(`/api/quiz/${quiz.id}/integrity-report`);
      if (!res.ok) {
        const d = await res.json();
        console.error("Error reporte integridad:", d.error);
        setLoadingReport(false);
        return;
      }
      const data: IntegrityReport = await res.json();
      setIntegrityReport(data);
    } catch (e) {
      console.error("Error cargando reporte:", e);
    } finally {
      setLoadingReport(false);
    }
  }

  function exportCSV() {
    if (!integrityReport) return;
    const headers = [
      "Estudiante",
      "Email",
      "Puntaje %",
      "Aprobado",
      "Integridad",
      "Cambios pestaña",
      "Marcado",
      "Alertas",
      "Fecha",
    ];
    const rows = integrityReport.attempts_summary.map((a) => [
      a.user_name,
      a.user_email,
      a.percentage ?? 0,
      a.passed ? "Si" : "No",
      Math.round(a.integrity_score * 100) + "%",
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
    a.download = `reporte-integridad-${quiz?.id ?? "quiz"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Quiz Settings ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Configuracion del Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Titulo y descripcion */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="quiz-title">Titulo</Label>
              <Input
                id="quiz-title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Quiz de la sesion"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="quiz-desc">Descripcion</Label>
              <Input
                id="quiz-desc"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Descripcion opcional..."
              />
            </div>
          </div>

          {/* Aprobacion e intentos */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="pass-pct">Porcentaje para aprobar (%)</Label>
              <Input
                id="pass-pct"
                type="number"
                min={1}
                max={100}
                value={passPercentage}
                onChange={(e) => setPassPercentage(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="max-att">Intentos maximos</Label>
              <Input
                id="max-att"
                type="number"
                min={1}
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(e.target.value)}
              />
            </div>
          </div>

          {/* ── Configuracion de Integridad Academica ── */}
          <div className="rounded-xl border border-[#73B8E7]/20 bg-[#73B8E7]/5 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#73B8E7]" />
              <span className="text-xs font-semibold text-[#1F2F58] uppercase tracking-wide">
                Integridad Academica (Art. 62 RRA 2022)
              </span>
            </div>

            {/* Tiempo limite */}
            <div className="grid gap-1.5">
              <Label htmlFor="time-limit">Tiempo limite (minutos) — dejar vacio = sin limite</Label>
              <Input
                id="time-limit"
                type="number"
                min={5}
                max={180}
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value)}
                placeholder="Ej: 30"
                className="w-32"
              />
            </div>

            {/* Toggles */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FBBC0C] focus:ring-[#FBBC0C]"
                />
                <span className="text-sm text-[#1F2F58]">Aleatorizar orden de preguntas</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FBBC0C] focus:ring-[#FBBC0C]"
                />
                <span className="text-sm text-[#1F2F58]">Aleatorizar opciones de respuesta</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOneAtATime}
                  onChange={(e) => setShowOneAtATime(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FBBC0C] focus:ring-[#FBBC0C]"
                />
                <span className="text-sm text-[#1F2F58]">Mostrar una pregunta a la vez</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bankRotativo}
                  onChange={(e) => setBankRotativo(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FBBC0C] focus:ring-[#FBBC0C]"
                />
                <span className="text-sm text-[#1F2F58]">Banco rotativo de preguntas</span>
              </label>

              {bankRotativo && (
                <div className="ml-7 grid gap-1.5">
                  <Label htmlFor="show-n">Mostrar N preguntas del banco (total: {questions.length})</Label>
                  <Input
                    id="show-n"
                    type="number"
                    min={1}
                    max={questions.length || 100}
                    value={showNQuestions}
                    onChange={(e) => setShowNQuestions(e.target.value)}
                    placeholder={`Ej: ${Math.ceil(questions.length / 2) || 10}`}
                    className="w-32"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={saveQuizSettings} disabled={saving}>
              {saving && (
                <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
              )}
              {quiz ? "Actualizar Quiz" : "Crear Quiz"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Questions List ── */}
      {quiz && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">Preguntas ({questions.length})</CardTitle>
            <div className="flex gap-2">
              {questions.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadIntegrityReport}
                    className="gap-1.5 border-[#73B8E7]/30 text-[#73B8E7] hover:bg-[#73B8E7]/5"
                  >
                    <ShieldCheck className="size-3.5" />
                    Reporte integridad
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewOpen(true)}
                  >
                    <Eye className="size-3.5" data-icon="inline-start" />
                    Vista previa
                  </Button>
                </>
              )}
              <Button size="sm" onClick={openCreateQuestion}>
                <Plus className="size-3.5" data-icon="inline-start" />
                Agregar pregunta
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <HelpCircle className="size-8 text-gray-300" />
                <p className="text-sm text-gray-400">No hay preguntas. Agrega la primera.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {questions.map((q, idx) => {
                  const opts = q.options as QuizQuestionOptions;
                  const correctIdx = opts.correct_index ?? 0;
                  return (
                    <div key={q.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="flex flex-col items-center gap-0.5 pt-0.5">
                        <button
                          onClick={() => moveQuestion(q.id, "up")}
                          disabled={idx === 0}
                          className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronUp className="size-3.5" />
                        </button>
                        <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
                        <button
                          onClick={() => moveQuestion(q.id, "down")}
                          disabled={idx === questions.length - 1}
                          className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronDown className="size-3.5" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{q.question_text}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {(opts.options || []).map((opt, oi) => (
                            <span
                              key={oi}
                              className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs ${
                                oi === correctIdx
                                  ? "bg-emerald-100 font-medium text-emerald-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {getOptionLabel(oi)}) {opt.text}
                              {oi === correctIdx && <CheckCircle2 className="size-3" />}
                            </span>
                          ))}
                        </div>
                        {q.explanation && (
                          <p className="mt-1 text-xs text-gray-400 italic">{q.explanation}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEditQuestion(q)} title="Editar">
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Create/Edit Question Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingQuestionId ? "Editar Pregunta" : "Nueva Pregunta"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="q-text">Pregunta *</Label>
              <Textarea
                id="q-text"
                value={form.question_text}
                onChange={(e) => setForm((p) => ({ ...p, question_text: e.target.value }))}
                placeholder="Cual es la principal funcion de...?"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Opciones (marca la correcta)</Label>
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, correct_index: i }))}
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                      form.correct_index === i
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-gray-300 text-gray-400 hover:border-gray-400"
                    }`}
                  >
                    {getOptionLabel(i)}
                  </button>
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...form.options];
                      newOpts[i] = e.target.value;
                      setForm((p) => ({ ...p, options: newOpts }));
                    }}
                    placeholder={`Opcion ${getOptionLabel(i)}`}
                  />
                </div>
              ))}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="q-expl">Explicacion (opcional)</Label>
              <Textarea
                id="q-expl"
                value={form.explanation}
                onChange={(e) => setForm((p) => ({ ...p, explanation: e.target.value }))}
                placeholder="Explica por que la respuesta correcta es..."
                rows={2}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="q-points">Puntos</Label>
              <Input
                id="q-points"
                type="number"
                min={1}
                value={form.points}
                onChange={(e) => setForm((p) => ({ ...p, points: parseInt(e.target.value, 10) || 1 }))}
                className="w-24"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              onClick={handleSaveQuestion}
              disabled={saving || !form.question_text.trim() || form.options.filter((o) => o.trim()).length < 2}
            >
              {saving && <Loader2 className="size-4 animate-spin" data-icon="inline-start" />}
              {editingQuestionId ? "Guardar Cambios" : "Crear Pregunta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Preview Dialog ── */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vista previa del Quiz</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-2">
            {quiz && (
              <div className="rounded-lg bg-[#1F2F58]/5 p-4">
                <h3 className="font-semibold text-[#1F2F58]">{quiz.title}</h3>
                {quiz.description && (
                  <p className="mt-1 text-sm text-gray-500">{quiz.description}</p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  Aprobar: {quiz.pass_percentage}% &middot; {quiz.max_attempts} intentos
                  {quiz.time_limit_seconds && ` &middot; ${Math.round(quiz.time_limit_seconds / 60)} min`}
                </p>
              </div>
            )}
            {questions.map((q, idx) => {
              const opts = q.options as QuizQuestionOptions;
              return (
                <div key={q.id} className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="mr-1 text-[#73B8E7]">{idx + 1}.</span>
                    {q.question_text}
                  </p>
                  <div className="grid gap-1.5 pl-5">
                    {(opts.options || []).map((opt, oi) => (
                      <label
                        key={oi}
                        className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <span className="flex size-5 items-center justify-center rounded-full border border-gray-300 text-[10px] font-medium">
                          {getOptionLabel(oi)}
                        </span>
                        {opt.text}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Integrity Report Dialog ── */}
      <Dialog open={integrityOpen} onOpenChange={setIntegrityOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#73B8E7]" />
              Reporte de Integridad Academica
            </DialogTitle>
          </DialogHeader>

          {loadingReport ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-[#FBBC0C]" />
            </div>
          ) : integrityReport ? (
            <div className="space-y-6 py-2">
              {/* Estadisticas generales */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Intentos", value: integrityReport.total_attempts },
                  { label: "Marcados", value: integrityReport.total_flagged },
                  { label: "Integridad prom.", value: `${integrityReport.avg_integrity_score}%` },
                  { label: "Puntaje prom.", value: `${integrityReport.avg_score_percentage}%` },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-[#1F2F58]/5 p-3 text-center">
                    <p className="text-xl font-bold text-[#1F2F58] font-[family-name:var(--font-space-grotesk)]">
                      {stat.value}
                    </p>
                    <p className="text-xs text-[#1F2F58]/50">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Narrativa Gemini */}
              {integrityReport.gemini_narrative && (
                <div className="rounded-xl border border-[#73B8E7]/20 bg-[#73B8E7]/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#73B8E7] mb-2">
                    Analisis IA
                  </p>
                  <p className="text-sm text-[#1F2F58]/70 leading-relaxed">
                    {integrityReport.gemini_narrative}
                  </p>
                </div>
              )}

              {/* Pares sospechosos */}
              {integrityReport.suspicious_pairs.length > 0 && (
                <div className="rounded-xl border border-[#F0846D]/20 bg-[#F0846D]/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="size-4 text-[#F0846D]" />
                    <p className="text-sm font-semibold text-[#F0846D]">
                      Pares sospechosos detectados ({integrityReport.suspicious_pairs.length})
                    </p>
                  </div>
                  <div className="space-y-2">
                    {integrityReport.suspicious_pairs.map((pair, i) => (
                      <div key={i} className="text-xs text-[#1F2F58]/70">
                        <span className="font-medium">{pair.user_a}</span>
                        {" "}y{" "}
                        <span className="font-medium">{pair.user_b}</span>
                        {" — "}
                        {pair.similarity}% similitud de respuestas
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabla de intentos */}
              <div>
                <p className="text-sm font-semibold text-[#1F2F58] mb-3">
                  Detalle por estudiante
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["Estudiante", "Puntaje", "Integridad", "Cambios pestaña", "Estado"].map((h) => (
                          <th key={h} className="py-2 px-3 text-left font-semibold text-[#1F2F58]/50">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {integrityReport.attempts_summary.map((attempt) => (
                        <tr key={attempt.attempt_id} className={attempt.flagged ? "bg-[#F0846D]/3" : ""}>
                          <td className="py-2 px-3">
                            <p className="font-medium text-[#0A1628]">{attempt.user_name}</p>
                            <p className="text-[#1F2F58]/40">{attempt.user_email}</p>
                          </td>
                          <td className="py-2 px-3">
                            <span className={`font-semibold ${attempt.passed ? "text-emerald-600" : "text-[#F0846D]"}`}>
                              {attempt.percentage ?? 0}%
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getIntegrityColor(attempt.integrity_score)}`}>
                              {getIntegrityLabel(attempt.integrity_score)} ({Math.round(attempt.integrity_score * 100)}%)
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className={attempt.tab_switches > 0 ? "text-[#F0846D] font-semibold" : "text-[#1F2F58]/40"}>
                              {attempt.tab_switches}
                            </span>
                          </td>
                          <td className="py-2 px-3">
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

              <p className="text-xs text-[#1F2F58]/30 text-right">
                Generado: {new Date(integrityReport.generated_at).toLocaleString("es-EC")}
              </p>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-[#1F2F58]/40">
              No se pudo cargar el reporte.
            </p>
          )}

          <DialogFooter className="gap-2">
            {integrityReport && integrityReport.total_attempts > 0 && (
              <Button variant="outline" onClick={exportCSV} className="gap-2">
                <Download className="size-4" />
                Exportar CSV
              </Button>
            )}
            <DialogClose>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
