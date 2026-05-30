"use client";

// ============================================================
// /teacher/banco-preguntas — Banco de Preguntas reutilizables
//
// Vista del docente para consultar las preguntas que ha creado
// en sus quizzes. La fuente de verdad es la tabla `quiz_questions`
// unida a `quizzes` -> `sessions` -> `subjects` para filtrar por
// las materias asignadas al docente.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  HelpCircle,
  Loader2,
  Plus,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type {
  QuizQuestion,
  QuestionType,
  Subject,
} from "@/types/database";

interface SubjectLite {
  id: string;
  code: string;
  name: string;
}

interface QuestionRow {
  id: string;
  question_text: string;
  question_type: QuestionType;
  points: number;
  quiz_title: string;
  session_title: string;
  subject_id: string;
  subject_code: string;
  subject_name: string;
}

const TYPE_LABEL: Record<QuestionType, string> = {
  multiple_choice: "Opción múltiple",
  true_false: "Verdadero / Falso",
  multiple_select: "Selección múltiple",
};

export default function BancoPreguntasClient() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectLite[]>([]);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);

  // Filtros
  const [filterSubject, setFilterSubject] = useState<string>("");
  const [filterType, setFilterType] = useState<"" | QuestionType>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Materias del docente
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, code, name")
        .eq("teacher_id", user.id)
        .eq("is_active", true)
        .order("name");

      const mySubjects = (subjectsData ?? []) as SubjectLite[];
      setSubjects(mySubjects);

      const subjectIds = mySubjects.map((s) => s.id);
      if (subjectIds.length === 0) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      // 2. Sesiones de esas materias
      const { data: sessionsData } = await supabase
        .from("sessions")
        .select("id, title, subject_id")
        .in("subject_id", subjectIds);

      const sessions = sessionsData ?? [];
      const sessionIds = sessions.map((s) => s.id);
      if (sessionIds.length === 0) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      // 3. Quizzes de esas sesiones
      const { data: quizzesData } = await supabase
        .from("quizzes")
        .select("id, title, session_id")
        .in("session_id", sessionIds);

      const quizzes = quizzesData ?? [];
      const quizIds = quizzes.map((q) => q.id);
      if (quizIds.length === 0) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      // 4. Preguntas
      const { data: questionsData } = await supabase
        .from("quiz_questions")
        .select("id, quiz_id, question_text, question_type, points, order_index")
        .in("quiz_id", quizIds)
        .order("order_index");

      const subjectById = new Map(mySubjects.map((s) => [s.id, s]));
      const sessionById = new Map(
        sessions.map((s) => [s.id, s as { id: string; title: string; subject_id: string }])
      );
      const quizById = new Map(
        quizzes.map((q) => [q.id, q as { id: string; title: string; session_id: string }])
      );

      const rows: QuestionRow[] = [];
      for (const q of questionsData ?? []) {
        const quiz = quizById.get(q.quiz_id);
        if (!quiz) continue;
        const session = sessionById.get(quiz.session_id);
        if (!session) continue;
        const subject = subjectById.get(session.subject_id);
        if (!subject) continue;

        rows.push({
          id: q.id,
          question_text: q.question_text,
          question_type: q.question_type as QuestionType,
          points: q.points,
          quiz_title: quiz.title,
          session_title: session.title,
          subject_id: subject.id,
          subject_code: subject.code,
          subject_name: subject.name,
        });
      }

      setQuestions(rows);
      setLoading(false);
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return questions.filter((q) => {
      if (filterSubject && q.subject_id !== filterSubject) return false;
      if (filterType && q.question_type !== filterType) return false;
      if (term && !q.question_text.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [questions, filterSubject, filterType, search]);

  const stats = useMemo(() => {
    const bySubject = new Map<string, number>();
    for (const q of questions) {
      bySubject.set(q.subject_id, (bySubject.get(q.subject_id) ?? 0) + 1);
    }
    return {
      total: questions.length,
      mc: questions.filter((q) => q.question_type === "multiple_choice").length,
      tf: questions.filter((q) => q.question_type === "true_false").length,
      ms: questions.filter((q) => q.question_type === "multiple_select").length,
      subjectsWithQuestions: bySubject.size,
    };
  }, [questions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Banco de Preguntas</h1>
          <p className="mt-1 text-sm text-gray-300">
            Repositorio de todas tus preguntas creadas. Reutilízalas en futuros
            quizzes y exámenes.
          </p>
        </div>
        <Link href="/teacher/quiz">
          <Button className="gap-2 bg-[#1F2F58] text-white hover:bg-[#2A3F6E]">
            <Plus className="size-4" />
            Nueva pregunta
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#1F2F58]/10">
              <HelpCircle className="size-5 text-[#1F2F58]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-gray-300">Preguntas totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#FBBC0C]/20">
              <CheckCircle2 className="size-5 text-[#FBBC0C]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.mc}</p>
              <p className="text-xs text-gray-300">Opción múltiple</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#73B8E7]/20">
              <CheckCircle2 className="size-5 text-[#73B8E7]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.tf}</p>
              <p className="text-xs text-gray-300">Verdadero / Falso</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#F0846D]/20">
              <BookOpen className="size-5 text-[#F0846D]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stats.subjectsWithQuestions}
              </p>
              <p className="text-xs text-gray-300">Materias con preguntas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-300">
              <Filter className="inline size-3 mr-1" />
              Materia
            </label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="h-8 min-w-[220px] rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none"
            >
              <option value="">Todas</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.code}] {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-300">Tipo</label>
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "" | QuestionType)
              }
              className="h-8 min-w-[180px] rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none"
            >
              <option value="">Todos</option>
              <option value="multiple_choice">Opción múltiple</option>
              <option value="true_false">Verdadero / Falso</option>
              <option value="multiple_select">Selección múltiple</option>
            </select>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 min-w-[220px]">
            <label className="text-xs font-medium text-gray-300">
              <Search className="inline size-3 mr-1" />
              Buscar
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Texto de la pregunta..."
              className="h-8 rounded-lg border border-gray-200 bg-white px-2.5 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <HelpCircle className="mx-auto size-8 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-300">
              {questions.length === 0
                ? "Aún no tienes preguntas creadas."
                : "No hay preguntas que coincidan con los filtros."}
            </p>
            {questions.length === 0 && (
              <p className="mt-1 text-xs text-gray-400">
                Crea tu primer quiz para empezar a construir tu banco.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">
                  Pregunta
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">
                  Tipo
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">
                  Materia
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">
                  Quiz
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-600">
                  Pts.
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 max-w-md">
                    <p className="text-sm text-white line-clamp-2">
                      {q.question_text}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{TYPE_LABEL[q.question_type]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <span className="font-medium text-gray-200">
                      {q.subject_code}
                    </span>{" "}
                    {q.subject_name}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px] truncate">
                    {q.quiz_title}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-white">
                    {q.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
