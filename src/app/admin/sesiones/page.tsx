"use client";

import { useEffect, useState, useCallback } from "react";
import { use } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Program, Semester, Subject, Session } from "@/types/database";
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
  Video,
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
  Presentation,
  Filter,
  Eye,
} from "lucide-react";

interface SessionRow extends Session {
  subject_name: string;
  subject_code: string;
  semester_number: number;
  career_name: string;
  has_video: boolean;
  has_slides: boolean;
  has_theory: boolean;
  has_quiz: boolean;
  has_assignment: boolean;
}

interface FilterState {
  career_id: string;
  semester_id: string;
  subject_id: string;
}

export default function SesionesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = use(searchParams);
  const initialCareerId =
    typeof resolvedParams.career === "string" ? resolvedParams.career : "";

  const supabase = createClient();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [careers, setCareers] = useState<Program[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    career_id: initialCareerId,
    semester_id: "",
    subject_id: "",
  });

  // Load careers for filter dropdown
  const loadCareers = useCallback(async () => {
    const { data } = await supabase
      .from("programs")
      .select("*")
      .eq("type", "carrera")
      .order("name");
    setCareers(data || []);
  }, []);

  // Load semesters when career changes
  const loadSemesters = useCallback(
    async (careerId: string) => {
      if (!careerId) {
        setSemesters([]);
        return;
      }
      const { data } = await supabase
        .from("semesters")
        .select("*")
        .eq("program_id", careerId)
        .order("number");
      setSemesters(data || []);
    },
    []
  );

  // Load subjects when semester changes
  const loadSubjects = useCallback(
    async (semesterId: string) => {
      if (!semesterId) {
        setSubjects([]);
        return;
      }
      const { data } = await supabase
        .from("subjects")
        .select("*")
        .eq("semester_id", semesterId)
        .order("order_index");
      setSubjects(data || []);
    },
    []
  );

  // Fetch sessions with all related data
  const fetchSessions = useCallback(async () => {
    setLoading(true);

    // Build subject IDs based on filters
    let targetSubjectIds: string[] | null = null;

    if (filters.subject_id) {
      targetSubjectIds = [filters.subject_id];
    } else if (filters.semester_id) {
      const { data: subs } = await supabase
        .from("subjects")
        .select("id")
        .eq("semester_id", filters.semester_id);
      targetSubjectIds = subs?.map((s) => s.id) || [];
    } else if (filters.career_id) {
      const { data: sems } = await supabase
        .from("semesters")
        .select("id")
        .eq("program_id", filters.career_id);
      if (sems && sems.length > 0) {
        const { data: subs } = await supabase
          .from("subjects")
          .select("id")
          .in(
            "semester_id",
            sems.map((s) => s.id)
          );
        targetSubjectIds = subs?.map((s) => s.id) || [];
      } else {
        targetSubjectIds = [];
      }
    }

    // If filter results in empty set, show empty
    if (targetSubjectIds !== null && targetSubjectIds.length === 0) {
      setSessions([]);
      setLoading(false);
      return;
    }

    // Fetch sessions
    let query = supabase
      .from("sessions")
      .select("*")
      .order("number", { ascending: true });

    if (targetSubjectIds !== null) {
      query = query.in("subject_id", targetSubjectIds);
    }

    const { data: sessionsData } = await query.limit(200);

    if (!sessionsData || sessionsData.length === 0) {
      setSessions([]);
      setLoading(false);
      return;
    }

    // Get unique subject IDs
    const subjectIds = [
      ...new Set(sessionsData.map((s) => s.subject_id)),
    ];
    const { data: subjectsData } = await supabase
      .from("subjects")
      .select("id, name, code, semester_id")
      .in("id", subjectIds);

    const subjectMap = new Map(
      (subjectsData || []).map((s) => [s.id, s])
    );

    // Get unique semester IDs
    const semesterIds = [
      ...new Set((subjectsData || []).map((s) => s.semester_id)),
    ];
    const { data: semestersData } = await supabase
      .from("semesters")
      .select("id, number, program_id")
      .in("id", semesterIds);

    const semesterMap = new Map(
      (semestersData || []).map((s) => [s.id, s])
    );

    // Get unique program IDs
    const programIds = [
      ...new Set((semestersData || []).map((s) => s.program_id)),
    ];
    const { data: programsData } = await supabase
      .from("programs")
      .select("id, name")
      .in("id", programIds);

    const programMap = new Map(
      (programsData || []).map((p) => [p.id, p])
    );

    // Check for quizzes and assignments
    const sessionIds = sessionsData.map((s) => s.id);

    const { data: quizzes } = await supabase
      .from("quizzes")
      .select("session_id")
      .in("session_id", sessionIds);

    const quizSessionIds = new Set(
      (quizzes || []).map((q) => q.session_id)
    );

    const { data: assignments } = await supabase
      .from("assignments")
      .select("session_id")
      .in("session_id", sessionIds);

    const assignmentSessionIds = new Set(
      (assignments || []).map((a) => a.session_id)
    );

    // Build rows
    const rows: SessionRow[] = sessionsData.map((session) => {
      const subject = subjectMap.get(session.subject_id);
      const semester = subject
        ? semesterMap.get(subject.semester_id)
        : null;
      const program = semester
        ? programMap.get(semester.program_id)
        : null;

      return {
        ...session,
        subject_name: subject?.name || "—",
        subject_code: subject?.code || "—",
        semester_number: semester?.number || 0,
        career_name: program?.name || "—",
        has_video: !!session.video_url,
        has_slides: !!session.slides_url,
        has_theory: !!session.theory_markdown,
        has_quiz: quizSessionIds.has(session.id),
        has_assignment: assignmentSessionIds.has(session.id),
      };
    });

    setSessions(rows);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    loadCareers();
  }, [loadCareers]);

  useEffect(() => {
    loadSemesters(filters.career_id);
    setFilters((prev) => ({ ...prev, semester_id: "", subject_id: "" }));
  }, [filters.career_id, loadSemesters]);

  useEffect(() => {
    loadSubjects(filters.semester_id);
    setFilters((prev) => ({ ...prev, subject_id: "" }));
  }, [filters.semester_id, loadSubjects]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  async function toggleActive(sessionId: string, currentValue: boolean) {
    await supabase
      .from("sessions")
      .update({ is_active: !currentValue })
      .eq("id", sessionId);
    fetchSessions();
  }

  function ContentIcon({
    active,
    icon: Icon,
    label,
  }: {
    active: boolean;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }) {
    return (
      <span title={label}>
        <Icon
          className={`size-4 ${
            active ? "text-emerald-500" : "text-gray-300"
          }`}
        />
      </span>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sesiones</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona las sesiones de todas las materias. Filtra por carrera,
          semestre o materia.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <Filter className="size-4" />
          Filtros
        </div>

        {/* Career filter */}
        <div className="grid gap-1">
          <label className="text-xs font-medium text-gray-500">Carrera</label>
          <select
            value={filters.career_id}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, career_id: e.target.value }))
            }
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

        {/* Semester filter */}
        <div className="grid gap-1">
          <label className="text-xs font-medium text-gray-500">
            Semestre
          </label>
          <select
            value={filters.semester_id}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                semester_id: e.target.value,
              }))
            }
            disabled={!filters.career_id}
            className="h-8 min-w-[160px] rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
          >
            <option value="">Todos los semestres</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>
                Semestre {s.number} — {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject filter */}
        <div className="grid gap-1">
          <label className="text-xs font-medium text-gray-500">
            Materia
          </label>
          <select
            value={filters.subject_id}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                subject_id: e.target.value,
              }))
            }
            disabled={!filters.semester_id}
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
              <TableHead className="w-12">#</TableHead>
              <TableHead>Titulo</TableHead>
              <TableHead>Materia</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead>Carrera</TableHead>
              <TableHead className="text-center">Contenido</TableHead>
              <TableHead className="text-center">Activa</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center">
                  <Loader2 className="mx-auto size-5 animate-spin text-gray-400" />
                </TableCell>
              </TableRow>
            ) : sessions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-gray-400"
                >
                  No hay sesiones{" "}
                  {filters.career_id ? "para los filtros seleccionados" : "registradas"}
                </TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-mono text-xs text-gray-400">
                    {session.number}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {session.title}
                    </div>
                    {session.description && (
                      <div className="max-w-xs truncate text-xs text-gray-400">
                        {session.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {session.subject_code}
                    </Badge>
                    <div className="mt-0.5 max-w-[150px] truncate text-xs text-gray-400">
                      {session.subject_name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    S{session.semester_number}
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate text-xs text-gray-500">
                    {session.career_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5">
                      <ContentIcon
                        active={session.has_video}
                        icon={Video}
                        label="Video"
                      />
                      <ContentIcon
                        active={session.has_slides}
                        icon={Presentation}
                        label="Slides"
                      />
                      <ContentIcon
                        active={session.has_theory}
                        icon={BookOpen}
                        label="Teoria"
                      />
                      <ContentIcon
                        active={session.has_quiz}
                        icon={BrainCircuit}
                        label="Quiz"
                      />
                      <ContentIcon
                        active={session.has_assignment}
                        icon={ClipboardCheck}
                        label="Entrega"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() =>
                        toggleActive(session.id, session.is_active)
                      }
                      className={`inline-flex size-5 items-center justify-center rounded-full transition-colors ${
                        session.is_active
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      title={
                        session.is_active ? "Desactivar" : "Activar"
                      }
                    >
                      <span
                        className={`size-2 rounded-full ${
                          session.is_active ? "bg-white" : "bg-white/60"
                        }`}
                      />
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Ver sesion"
                      onClick={() => {
                        // Detail page not yet implemented
                      }}
                    >
                      <Eye className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Count */}
      {!loading && sessions.length > 0 && (
        <div className="text-right text-xs text-gray-400">
          {sessions.length} sesion{sessions.length !== 1 ? "es" : ""} encontrada
          {sessions.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
