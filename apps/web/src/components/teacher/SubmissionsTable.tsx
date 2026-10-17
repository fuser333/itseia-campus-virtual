"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Submission, Subject } from "@/types/database";

interface SubmissionRow {
  id: string;
  assignment_id: string;
  user_id: string;
  file_url: string | null;
  file_name: string | null;
  grade: number | null;
  feedback: string | null;
  status: string;
  submitted_at: string;
  // joined
  student_name: string;
  session_title: string;
  session_number: number;
  subject_id: string;
  subject_name: string;
  max_grade: number;
}

interface SubmissionsTableProps {
  subjects: Subject[];
}

export default function SubmissionsTable({ subjects }: SubmissionsTableProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters
  const [filterSubject, setFilterSubject] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Grading form
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [grading, setGrading] = useState(false);
  const [gradeSaved, setGradeSaved] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);

    const subjectIds = filterSubject
      ? [filterSubject]
      : subjects.map((s) => s.id);

    if (subjectIds.length === 0) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    // Get sessions for these subjects
    const { data: sessions } = await supabase
      .from("sessions")
      .select("id, title, number, subject_id")
      .in("subject_id", subjectIds);

    const sessionIds = (sessions || []).map((s) => s.id);

    if (sessionIds.length === 0) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    // Get assignments
    const { data: assignments } = await supabase
      .from("assignments")
      .select("id, session_id, max_grade")
      .in("session_id", sessionIds);

    const assignmentIds = (assignments || []).map((a) => a.id);

    if (assignmentIds.length === 0) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    // Get submissions
    let subQuery = supabase
      .from("submissions")
      .select("*")
      .in("assignment_id", assignmentIds)
      .order("submitted_at", { ascending: false });

    if (filterStatus) {
      subQuery = subQuery.eq("status", filterStatus);
    }

    const { data: subs } = await subQuery.limit(100);

    if (!subs || subs.length === 0) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    // Get student profiles
    const userIds = [...new Set(subs.map((s) => s.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    const profileMap: Record<string, string> = {};
    for (const p of profiles || []) {
      profileMap[p.id] = p.full_name;
    }

    // Build lookup maps
    const assignmentMap: Record<
      string,
      { session_id: string; max_grade: number }
    > = {};
    for (const a of assignments || []) {
      assignmentMap[a.id] = {
        session_id: a.session_id,
        max_grade: a.max_grade,
      };
    }

    const sessionMap: Record<
      string,
      { title: string; number: number; subject_id: string }
    > = {};
    for (const s of sessions || []) {
      sessionMap[s.id] = {
        title: s.title,
        number: s.number,
        subject_id: s.subject_id,
      };
    }

    const subjectMap: Record<string, string> = {};
    for (const s of subjects) {
      subjectMap[s.id] = s.name;
    }

    const rows: SubmissionRow[] = subs.map((sub) => {
      const asg = assignmentMap[sub.assignment_id] || {
        session_id: "",
        max_grade: 100,
      };
      const ses = sessionMap[asg.session_id] || {
        title: "",
        number: 0,
        subject_id: "",
      };

      return {
        id: sub.id,
        assignment_id: sub.assignment_id,
        user_id: sub.user_id,
        file_url: sub.file_url,
        file_name: sub.file_name,
        grade: sub.grade,
        feedback: sub.feedback,
        status: sub.status,
        submitted_at: sub.submitted_at,
        student_name: profileMap[sub.user_id] || "Estudiante",
        session_title: ses.title,
        session_number: ses.number,
        subject_id: ses.subject_id,
        subject_name: subjectMap[ses.subject_id] || "Materia",
        max_grade: asg.max_grade,
      };
    });

    setSubmissions(rows);
    setLoading(false);
  }, [filterSubject, filterStatus, subjects]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      const sub = submissions.find((s) => s.id === id);
      if (sub) {
        setGradeInput(sub.grade?.toString() || "");
        setFeedbackInput(sub.feedback || "");
      }
      setGradeSaved(false);
    }
  }

  async function handleGrade(submissionId: string) {
    setGrading(true);

    const grade = parseFloat(gradeInput);
    if (isNaN(grade) || grade < 0) {
      setGrading(false);
      return;
    }

    try {
      const response = await fetch(`/api/assignments/${submissionId}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grade,
          feedback: feedbackInput.trim() || null,
        }),
      });

      if (response.ok) {
        setGradeSaved(true);
        setTimeout(() => setGradeSaved(false), 2000);
        // Update locally
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === submissionId
              ? { ...s, grade, feedback: feedbackInput.trim(), status: "graded" }
              : s
          )
        );
      }
    } catch {
      // error handling silently
    }

    setGrading(false);
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex rounded-full bg-[#FBBC0C]/20 px-2 py-0.5 text-[10px] font-medium text-[#73B8E7]">
            Pendiente
          </span>
        );
      case "graded":
        return (
          <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
            Calificado
          </span>
        );
      case "returned":
        return (
          <span className="inline-flex rounded-full bg-[#73B8E7]/20 px-2 py-0.5 text-[10px] font-medium text-[#73B8E7]">
            Devuelto
          </span>
        );
      case "late":
        return (
          <span className="inline-flex rounded-full bg-[#F0846D]/20 px-2 py-0.5 text-[10px] font-medium text-[#F0846D]">
            Tarde
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/65">
            {status}
          </span>
        );
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="size-4 text-white/55" />

        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="h-8 rounded-lg border border-white/20 bg-[#0A1628]/80 px-3 text-sm text-white/85 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Todas las materias</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-8 rounded-lg border border-white/20 bg-[#0A1628]/80 px-3 text-sm text-white/85 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Todos los estados</option>
          <option value="submitted">Pendiente</option>
          <option value="graded">Calificado</option>
          <option value="returned">Devuelto</option>
          <option value="late">Tarde</option>
        </select>

        {(filterSubject || filterStatus) && (
          <button
            onClick={() => {
              setFilterSubject("");
              setFilterStatus("");
            }}
            className="text-xs text-white/55 hover:text-white/75"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-white/20 bg-[#0A1628]/80">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0A1628]/60">
              <TableHead>Estudiante</TableHead>
              <TableHead>Materia</TableHead>
              <TableHead>Sesion</TableHead>
              <TableHead>Archivo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-white/55" />
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-white/55"
                >
                  No hay entregas registradas
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((sub) => (
                <>
                  <TableRow
                    key={sub.id}
                    className="cursor-pointer"
                    onClick={() => toggleExpand(sub.id)}
                  >
                    <TableCell>
                      <span className="font-medium text-white">
                        {sub.student_name}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-white/65">
                      {sub.subject_name}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-white/65">
                        S{sub.session_number}
                      </span>
                    </TableCell>
                    <TableCell>
                      {sub.file_url ? (
                        <a
                          href={sub.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-[#73B8E7] hover:underline"
                        >
                          <Download className="size-3" />
                          {sub.file_name || "Descargar"}
                        </a>
                      ) : (
                        <span className="text-xs text-white/50">--</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-white/65">
                      {new Date(sub.submitted_at).toLocaleDateString("es-EC", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{getStatusBadge(sub.status)}</TableCell>
                    <TableCell>
                      {sub.grade !== null ? (
                        <span className="text-sm font-medium text-white">
                          {sub.grade}/{sub.max_grade}
                        </span>
                      ) : (
                        <span className="text-xs text-white/50">--</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {expandedId === sub.id ? (
                        <ChevronUp className="size-4 text-white/55" />
                      ) : (
                        <ChevronDown className="size-4 text-white/55" />
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Expanded grading row */}
                  {expandedId === sub.id && (
                    <TableRow key={`${sub.id}-grade`}>
                      <TableCell
                        colSpan={8}
                        className="bg-[#0A1628]/60/50 px-6 py-4"
                      >
                        <div className="grid gap-4 sm:grid-cols-[200px_1fr_auto]">
                          <div className="grid gap-1.5">
                            <Label htmlFor={`grade-${sub.id}`}>
                              Nota (max: {sub.max_grade})
                            </Label>
                            <Input
                              id={`grade-${sub.id}`}
                              type="number"
                              min={0}
                              max={sub.max_grade}
                              value={gradeInput}
                              onChange={(e) => setGradeInput(e.target.value)}
                              placeholder="0"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>

                          <div className="grid gap-1.5">
                            <Label htmlFor={`feedback-${sub.id}`}>
                              Retroalimentacion
                            </Label>
                            <Textarea
                              id={`feedback-${sub.id}`}
                              value={feedbackInput}
                              onChange={(e) =>
                                setFeedbackInput(e.target.value)
                              }
                              placeholder="Comentarios sobre el trabajo del estudiante..."
                              rows={2}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>

                          <div className="flex items-end">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGrade(sub.id);
                              }}
                              disabled={grading || !gradeInput}
                              size="lg"
                            >
                              {grading ? (
                                <Loader2
                                  className="size-4 animate-spin"
                                  data-icon="inline-start"
                                />
                              ) : gradeSaved ? (
                                <CheckCircle2
                                  className="size-4 text-emerald-400"
                                  data-icon="inline-start"
                                />
                              ) : (
                                <Save
                                  className="size-4"
                                  data-icon="inline-start"
                                />
                              )}
                              {gradeSaved ? "Guardado" : "Calificar"}
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
