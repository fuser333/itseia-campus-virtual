"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Loader2,
  Filter,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Subject, Session, Profile } from "@/types/database";

interface StudentRow {
  id: string;
  name: string;
  completedSessions: Set<string>;
}

export default function TeacherProgresoPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filterSubject, setFilterSubject] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);

  // Fetch subjects
  useEffect(() => {
    async function fetchSubjects() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const adminRoles = ["super_admin", "admin", "coordinacion"];
      const userIsAdmin = profile ? adminRoles.includes(profile.role) : false;

      let query = supabase
        .from("subjects")
        .select("*")
        .eq("is_active", true)
        .order("order_index");

      if (!userIsAdmin) {
        query = query.eq("teacher_id", user.id);
      }

      const { data } = await query;
      setSubjects(data || []);

      // Auto-select first subject
      if (data && data.length > 0 && !filterSubject) {
        setFilterSubject(data[0].id);
      }

      setLoading(false);
    }

    fetchSubjects();
  }, []);

  // Fetch sessions + progress when subject changes
  useEffect(() => {
    if (!filterSubject) {
      setSessions([]);
      setStudents([]);
      return;
    }

    async function fetchProgress() {
      setLoading(true);

      // Get sessions for subject
      const { data: sessionsData } = await supabase
        .from("sessions")
        .select("*")
        .eq("subject_id", filterSubject)
        .order("number");

      const sessionsList = sessionsData || [];
      setSessions(sessionsList);

      const sessionIds = sessionsList.map((s) => s.id);
      if (sessionIds.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // Get subject's semester -> program -> enrollments
      const subject = subjects.find((s) => s.id === filterSubject);
      if (!subject) {
        setStudents([]);
        setLoading(false);
        return;
      }

      const { data: semesterData } = await supabase
        .from("semesters")
        .select("program_id")
        .eq("id", subject.semester_id)
        .single();

      if (!semesterData) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // Get enrolled students
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("user_id")
        .eq("program_id", semesterData.program_id)
        .eq("status", "active");

      const userIds = [...new Set((enrollments || []).map((e) => e.user_id))];

      if (userIds.length === 0) {
        setStudents([]);
        setLoading(false);
        return;
      }

      // Get profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds)
        .order("full_name");

      // Get session progress
      const { data: progressData } = await supabase
        .from("session_progress")
        .select("user_id, session_id, completed")
        .in("session_id", sessionIds)
        .in("user_id", userIds)
        .eq("completed", true);

      // Build student rows
      const progressMap: Record<string, Set<string>> = {};
      for (const p of progressData || []) {
        if (!progressMap[p.user_id]) {
          progressMap[p.user_id] = new Set();
        }
        progressMap[p.user_id].add(p.session_id);
      }

      const studentRows: StudentRow[] = (profiles || []).map((p) => ({
        id: p.id,
        name: p.full_name,
        completedSessions: progressMap[p.id] || new Set(),
      }));

      setStudents(studentRows);
      setLoading(false);
    }

    fetchProgress();
  }, [filterSubject, subjects]);

  if (loading && subjects.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#73B8E7]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Progreso de Estudiantes
        </h1>
        <p className="mt-1 text-sm text-gray-300">
          Visualiza el avance de cada estudiante por sesion
        </p>
      </div>

      {subjects.length === 0 ? (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <BarChart3 className="size-10 text-gray-300" />
              <p className="text-sm text-gray-400">
                No tienes materias asignadas.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filter */}
          <div className="flex items-center gap-3">
            <Filter className="size-4 text-gray-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-200 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Seleccionar materia</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Progress Grid */}
          {loading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Loader2 className="size-6 animate-spin text-[#73B8E7]" />
            </div>
          ) : !filterSubject ? (
            <Card>
              <CardContent>
                <p className="py-6 text-center text-sm text-gray-400">
                  Selecciona una materia para ver el progreso.
                </p>
              </CardContent>
            </Card>
          ) : students.length === 0 ? (
            <Card>
              <CardContent>
                <p className="py-6 text-center text-sm text-gray-400">
                  No hay estudiantes inscritos en esta materia.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="sticky left-0 z-10 bg-gray-50 min-w-[180px]">
                      Estudiante
                    </TableHead>
                    {sessions.map((s) => (
                      <TableHead
                        key={s.id}
                        className="text-center min-w-[50px]"
                      >
                        <span
                          className="text-xs font-medium text-gray-300"
                          title={s.title}
                        >
                          S{s.number}
                        </span>
                      </TableHead>
                    ))}
                    <TableHead className="text-center min-w-[70px]">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const completedCount = sessions.filter((s) =>
                      student.completedSessions.has(s.id)
                    ).length;
                    const pct =
                      sessions.length > 0
                        ? Math.round(
                            (completedCount / sessions.length) * 100
                          )
                        : 0;

                    return (
                      <TableRow key={student.id}>
                        <TableCell className="sticky left-0 z-10 bg-white font-medium text-white">
                          {student.name}
                        </TableCell>
                        {sessions.map((s) => (
                          <TableCell key={s.id} className="text-center">
                            {student.completedSessions.has(s.id) ? (
                              <CheckCircle2 className="mx-auto size-4 text-emerald-500" />
                            ) : (
                              <span className="mx-auto inline-block size-4 rounded-full border-2 border-gray-200" />
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              pct >= 80
                                ? "bg-emerald-100 text-emerald-700"
                                : pct >= 50
                                  ? "bg-[#FBBC0C]/20 text-[#1F2F58]"
                                  : "bg-gray-100 text-gray-300"
                            }`}
                          >
                            {pct}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Summary stats */}
          {!loading && filterSubject && students.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-3">
              <Card size="sm">
                <CardContent>
                  <p className="text-xs text-gray-300">Estudiantes</p>
                  <p className="text-lg font-bold text-[#1F2F58]">
                    {students.length}
                  </p>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent>
                  <p className="text-xs text-gray-300">Sesiones</p>
                  <p className="text-lg font-bold text-[#1F2F58]">
                    {sessions.length}
                  </p>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent>
                  <p className="text-xs text-gray-300">Promedio completado</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {sessions.length > 0
                      ? Math.round(
                          (students.reduce((acc, st) => {
                            const c = sessions.filter((s) =>
                              st.completedSessions.has(s.id)
                            ).length;
                            return acc + c / sessions.length;
                          }, 0) /
                            students.length) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
