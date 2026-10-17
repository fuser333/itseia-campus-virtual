"use client";

// ============================================================
// /teacher/quiz — Lista de Quizzes / Exámenes
//
// Muestra todos los quizzes creados por el docente en sus
// materias asignadas. El editor real (QuizBuilder) vive dentro
// del detalle de cada sesión: /teacher/materias/[id] -> sesión.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ClipboardCheck,
  Loader2,
  Plus,
  Clock,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface QuizRow {
  id: string;
  title: string;
  description: string | null;
  pass_percentage: number;
  max_attempts: number;
  time_limit_minutes: number | null;
  is_active: boolean;
  created_at: string;
  session_id: string;
  session_title: string;
  subject_id: string;
  subject_code: string;
  subject_name: string;
  question_count: number;
}

export default function QuizListClient() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<QuizRow[]>([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [stateFilter, setStateFilter] = useState<"" | "active" | "inactive">("");

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

      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, code, name")
        .eq("teacher_id", user.id)
        .eq("is_active", true);

      const subjects = subjectsData ?? [];
      const subjectIds = subjects.map((s) => s.id);
      if (subjectIds.length === 0) {
        setQuizzes([]);
        setLoading(false);
        return;
      }

      const { data: sessionsData } = await supabase
        .from("sessions")
        .select("id, title, subject_id")
        .in("subject_id", subjectIds);

      const sessions = sessionsData ?? [];
      const sessionIds = sessions.map((s) => s.id);
      if (sessionIds.length === 0) {
        setQuizzes([]);
        setLoading(false);
        return;
      }

      const { data: quizzesData } = await supabase
        .from("quizzes")
        .select(
          "id, title, description, pass_percentage, max_attempts, time_limit_minutes, is_active, created_at, session_id"
        )
        .in("session_id", sessionIds)
        .order("created_at", { ascending: false });

      const list = quizzesData ?? [];
      const quizIds = list.map((q) => q.id);

      // Conteo de preguntas por quiz
      const counts = new Map<string, number>();
      if (quizIds.length > 0) {
        const { data: questionRows } = await supabase
          .from("quiz_questions")
          .select("quiz_id")
          .in("quiz_id", quizIds);
        for (const row of questionRows ?? []) {
          counts.set(row.quiz_id, (counts.get(row.quiz_id) ?? 0) + 1);
        }
      }

      const subjectById = new Map(
        subjects.map((s) => [s.id, s as { id: string; code: string; name: string }])
      );
      const sessionById = new Map(
        sessions.map((s) => [s.id, s as { id: string; title: string; subject_id: string }])
      );

      const rows: QuizRow[] = [];
      for (const q of list) {
        const session = sessionById.get(q.session_id);
        if (!session) continue;
        const subject = subjectById.get(session.subject_id);
        if (!subject) continue;
        rows.push({
          id: q.id,
          title: q.title,
          description: q.description,
          pass_percentage: q.pass_percentage,
          max_attempts: q.max_attempts,
          time_limit_minutes: q.time_limit_minutes,
          is_active: q.is_active,
          created_at: q.created_at,
          session_id: session.id,
          session_title: session.title,
          subject_id: subject.id,
          subject_code: subject.code,
          subject_name: subject.name,
          question_count: counts.get(q.id) ?? 0,
        });
      }

      setQuizzes(rows);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      if (subjectFilter && q.subject_id !== subjectFilter) return false;
      if (stateFilter === "active" && !q.is_active) return false;
      if (stateFilter === "inactive" && q.is_active) return false;
      return true;
    });
  }, [quizzes, subjectFilter, stateFilter]);

  const subjectOptions = useMemo(() => {
    const map = new Map<string, { code: string; name: string }>();
    for (const q of quizzes) {
      map.set(q.subject_id, { code: q.subject_code, name: q.subject_name });
    }
    return Array.from(map.entries()).map(([id, v]) => ({ id, ...v }));
  }, [quizzes]);

  const stats = {
    total: quizzes.length,
    active: quizzes.filter((q) => q.is_active).length,
    questions: quizzes.reduce((acc, q) => acc + q.question_count, 0),
    timed: quizzes.filter((q) => q.time_limit_minutes != null).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Quizzes y Exámenes
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Construye evaluaciones por sesión. Cada quiz pertenece a una sesión
            de tus materias.
          </p>
        </div>
        <Link href="/teacher/materias">
          <Button className="gap-2 bg-[#1F2F58] text-white hover:bg-[#2A3F6E]">
            <Plus className="size-4" />
            Nuevo quiz
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#1F2F58]/10">
              <ClipboardCheck className="size-5 text-[#73B8E7]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-white/50">Quizzes totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100">
              <Sparkles className="size-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
              <p className="text-xs text-white/50">Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#FBBC0C]/20">
              <HelpCircle className="size-5 text-[#FBBC0C]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stats.questions}
              </p>
              <p className="text-xs text-white/50">Preguntas en bancos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#F0846D]/20">
              <Clock className="size-5 text-[#F0846D]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.timed}</p>
              <p className="text-xs text-white/50">Con límite de tiempo</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="rounded-lg border border-white/20 bg-[#0A1628]/80 p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/50">Materia</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="h-8 min-w-[220px] rounded-lg border border-white/20 bg-[#0A1628]/80 px-2.5 text-sm outline-none"
            >
              <option value="">Todas</option>
              {subjectOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  [{s.code}] {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/50">Estado</label>
            <select
              value={stateFilter}
              onChange={(e) =>
                setStateFilter(e.target.value as "" | "active" | "inactive")
              }
              className="h-8 min-w-[160px] rounded-lg border border-white/20 bg-[#0A1628]/80 px-2.5 text-sm outline-none"
            >
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardCheck className="mx-auto size-8 text-white/50" />
            <p className="mt-2 text-sm font-medium text-white/50">
              {quizzes.length === 0
                ? "Aún no tienes quizzes creados."
                : "Ningún quiz coincide con los filtros."}
            </p>
            {quizzes.length === 0 && (
              <p className="mt-1 text-xs text-white/55">
                Abre una sesión de tu materia y agrega un quiz desde el editor.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((q) => (
            <Link
              key={q.id}
              href={`/teacher/materias/${q.subject_id}`}
              className="block"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[#73B8E7] line-clamp-2">
                      {q.title}
                    </h3>
                    <Badge
                      variant={q.is_active ? "default" : "secondary"}
                      className={
                        q.is_active
                          ? "bg-emerald-100 text-emerald-700"
                          : ""
                      }
                    >
                      {q.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>

                  <div className="text-xs text-white/50 space-y-0.5">
                    <p className="flex items-center gap-1">
                      <BookOpen className="size-3" />
                      <span className="font-medium text-white/80">
                        {q.subject_code}
                      </span>{" "}
                      {q.subject_name}
                    </p>
                    <p className="line-clamp-1">Sesión: {q.session_title}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/75">
                      {q.question_count} preguntas
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/75">
                      Aprobar {q.pass_percentage}%
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/75">
                      {q.max_attempts} intentos
                    </span>
                    {q.time_limit_minutes != null && (
                      <span className="rounded-full bg-[#F0846D]/15 px-2 py-0.5 text-[#F0846D]">
                        {q.time_limit_minutes} min
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-end pt-1 text-xs text-[#73B8E7]">
                    Editar
                    <ArrowRight className="ml-1 size-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
