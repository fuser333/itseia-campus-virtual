"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  Program,
  Subject,
  SubmissionStatus,
} from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Filter,
  FileDown,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

interface SubmissionRow {
  id: string;
  student_name: string;
  student_email: string;
  subject_name: string;
  subject_code: string;
  session_title: string;
  session_number: number;
  assignment_title: string;
  file_url: string | null;
  file_name: string | null;
  grade: number | null;
  max_grade: number;
  feedback: string | null;
  status: SubmissionStatus;
  submitted_at: string;
}

const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  submitted: {
    label: "Enviada",
    color: "bg-blue-100 text-blue-700",
    icon: Clock,
  },
  graded: {
    label: "Calificada",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  returned: {
    label: "Devuelta",
    color: "bg-amber-100 text-amber-700",
    icon: RotateCcw,
  },
  late: {
    label: "Tardia",
    color: "bg-red-100 text-red-700",
    icon: AlertTriangle,
  },
};

export default function EntregasPage() {
  const supabase = createClient();
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [careers, setCareers] = useState<Program[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [careerFilter, setCareerFilter] = useState<string>("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");

  // Load careers for filter
  const loadCareers = useCallback(async () => {
    const { data } = await supabase
      .from("programs")
      .select("*")
      .eq("type", "carrera")
      .order("name");
    setCareers(data || []);
  }, []);

  // Load subjects for filter (based on career)
  const loadSubjects = useCallback(
    async (careerId: string) => {
      if (!careerId) {
        setSubjects([]);
        return;
      }
      const { data: semesters } = await supabase
        .from("semesters")
        .select("id")
        .eq("program_id", careerId);

      if (!semesters || semesters.length === 0) {
        setSubjects([]);
        return;
      }

      const { data } = await supabase
        .from("subjects")
        .select("*")
        .in(
          "semester_id",
          semesters.map((s) => s.id)
        )
        .order("code");
      setSubjects(data || []);
    },
    []
  );

  // Fetch all submissions
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);

    // Build query
    let query = supabase
      .from("submissions")
      .select(
        `
        id,
        file_url,
        file_name,
        grade,
        feedback,
        status,
        submitted_at,
        user_id,
        assignment_id,
        assignments!inner (
          id,
          title,
          max_grade,
          session_id,
          sessions!inner (
            id,
            title,
            number,
            subject_id,
            subjects!inner (
              id,
              name,
              code,
              semester_id,
              semesters!inner (
                id,
                program_id
              )
            )
          )
        )
      `
      )
      .order("submitted_at", { ascending: false })
      .limit(100);

    // Apply status filter
    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    const { data: submissionsData, error } = await query;

    if (error || !submissionsData) {
      // If the join query fails (tables might not exist yet), show empty
      setSubmissions([]);
      setLoading(false);
      return;
    }

    // Get all user IDs to fetch profiles
    const userIds = [
      ...new Set(submissionsData.map((s: Record<string, unknown>) => s.user_id as string)),
    ];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);

    const profileMap = new Map(
      (profiles || []).map((p) => [p.id, p])
    );

    // Build rows
    const rows: SubmissionRow[] = submissionsData
      .map((sub: Record<string, unknown>) => {
        const assignment = sub.assignments as Record<string, unknown> | null;
        const session = assignment?.sessions as Record<string, unknown> | null;
        const subject = session?.subjects as Record<string, unknown> | null;
        const semester = subject?.semesters as Record<string, unknown> | null;
        const profile = profileMap.get(sub.user_id as string);

        // Apply career filter
        if (careerFilter && semester?.program_id !== careerFilter) {
          return null;
        }

        // Apply subject filter
        if (subjectFilter && (subject?.id as string) !== subjectFilter) {
          return null;
        }

        return {
          id: sub.id as string,
          student_name: profile?.full_name || "—",
          student_email: profile?.email || "—",
          subject_name: (subject?.name as string) || "—",
          subject_code: (subject?.code as string) || "—",
          session_title: (session?.title as string) || "—",
          session_number: (session?.number as number) || 0,
          assignment_title: (assignment?.title as string) || "—",
          file_url: sub.file_url as string | null,
          file_name: sub.file_name as string | null,
          grade: sub.grade as number | null,
          max_grade: (assignment?.max_grade as number) || 100,
          feedback: sub.feedback as string | null,
          status: sub.status as SubmissionStatus,
          submitted_at: sub.submitted_at as string,
        };
      })
      .filter((row): row is SubmissionRow => row !== null);

    setSubmissions(rows);
    setLoading(false);
  }, [statusFilter, careerFilter, subjectFilter]);

  useEffect(() => {
    loadCareers();
  }, [loadCareers]);

  useEffect(() => {
    loadSubjects(careerFilter);
    setSubjectFilter("");
  }, [careerFilter, loadSubjects]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Entregas</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vista global de todas las entregas de estudiantes. Filtra por estado,
          carrera o materia.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <Filter className="size-4" />
          Filtros
        </div>

        {/* Status filter */}
        <div className="grid gap-1">
          <label className="text-xs font-medium text-gray-500">Estado</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 min-w-[150px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Todos los estados</option>
            <option value="submitted">Enviada</option>
            <option value="graded">Calificada</option>
            <option value="returned">Devuelta</option>
            <option value="late">Tardia</option>
          </select>
        </div>

        {/* Career filter */}
        <div className="grid gap-1">
          <label className="text-xs font-medium text-gray-500">Carrera</label>
          <select
            value={careerFilter}
            onChange={(e) => setCareerFilter(e.target.value)}
            className="h-8 min-w-[180px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Todas las carreras</option>
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.career_code ? `[${c.career_code}] ` : ""}
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject filter */}
        <div className="grid gap-1">
          <label className="text-xs font-medium text-gray-500">Materia</label>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            disabled={!careerFilter}
            className="h-8 min-w-[200px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            <option value="">Todas las materias</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                [{s.code}] {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Estudiante</TableHead>
              <TableHead>Materia</TableHead>
              <TableHead>Sesion</TableHead>
              <TableHead>Archivo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-center">Nota</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-gray-400" />
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-gray-400"
                >
                  No hay entregas
                  {statusFilter || careerFilter || subjectFilter
                    ? " para los filtros seleccionados"
                    : " registradas"}
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((sub) => {
                const statusCfg = STATUS_CONFIG[sub.status];
                const StatusIcon = statusCfg.icon;
                return (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {sub.student_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {sub.student_email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{sub.subject_code}</Badge>
                      <div className="mt-0.5 max-w-[130px] truncate text-xs text-gray-400">
                        {sub.subject_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-700">
                        S{sub.session_number}: {sub.session_title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {sub.assignment_title}
                      </div>
                    </TableCell>
                    <TableCell>
                      {sub.file_url ? (
                        <a
                          href={sub.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#73B8E7] hover:underline"
                        >
                          <FileDown className="size-3" />
                          {sub.file_name || "Descargar"}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {new Date(sub.submitted_at).toLocaleDateString(
                        "es-EC",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {sub.grade !== null ? (
                        <span className="font-semibold text-gray-900">
                          {sub.grade}
                          <span className="text-xs font-normal text-gray-400">
                            /{sub.max_grade}
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusCfg.color}`}
                      >
                        <StatusIcon className="size-3" />
                        {statusCfg.label}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Count */}
      {!loading && submissions.length > 0 && (
        <div className="text-right text-xs text-gray-400">
          {submissions.length} entrega{submissions.length !== 1 ? "s" : ""}{" "}
          encontrada{submissions.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
