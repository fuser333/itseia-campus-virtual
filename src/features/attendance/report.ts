// ============================================================
// ITSEIA Academy — Generacion de reporte de asistencia
// Feature: 007-attendance-tracking
//
// buildAttendanceReport: carga live_sessions del periodo con
// sus attendance asociadas y la lista de matriculados, genera
// la estructura AttendanceReport con matriz student x sesion.
// ============================================================

import { supabaseAdmin } from "@/lib/supabase/admin";
import type {
  AttendanceReport,
  AttendanceSummary,
  AttendanceReportSession,
  AttendanceCell,
} from "@/types/database";

// Tipos internos para los datos crudos de Supabase
interface RawSession {
  id: string;
  number: number;
  title: string;
}

interface RawLiveSession {
  id: string;
  session_id: string;
  started_at: string;
  planned_duration_minutes: number;
}

interface RawAttendance {
  id: string;
  live_session_id: string;
  user_id: string;
  status: string;
  duration_seconds: number | null;
  is_manual_override: boolean;
}

interface RawProfile {
  id: string;
  full_name: string;
  email: string;
}

/**
 * Genera el reporte completo de asistencia para una materia y periodo.
 * Usa supabaseAdmin (service role) para leer datos sin restricciones RLS.
 * El control de acceso debe hacerse en la capa API antes de llamar esta funcion.
 */
export async function buildAttendanceReport(
  subjectId: string,
  periodFrom: string,
  periodTo: string
): Promise<AttendanceReport | null> {
  // 1. Cargar datos de la materia
  const { data: subject } = await supabaseAdmin
    .from("subjects")
    .select("id, code, name, semester_id")
    .eq("id", subjectId)
    .single();

  if (!subject) return null;

  // 2. Cargar sesiones academicas de la materia
  const { data: rawSessions } = await supabaseAdmin
    .from("sessions")
    .select("id, number, title")
    .eq("subject_id", subjectId)
    .eq("is_active", true)
    .order("number", { ascending: true });

  const sessions: RawSession[] = (rawSessions as RawSession[] | null) || [];
  const sessionIds = sessions.map((s) => s.id);

  // 3. Cargar live_sessions del periodo (sin sesiones de prueba)
  let liveSessions: RawLiveSession[] = [];

  if (sessionIds.length > 0) {
    const { data: rawLive } = await supabaseAdmin
      .from("live_sessions")
      .select("id, session_id, started_at, planned_duration_minutes")
      .in("session_id", sessionIds)
      .eq("is_test_session", false)
      .not("ended_at", "is", null)
      .gte("started_at", periodFrom)
      .lte("started_at", periodTo)
      .order("started_at", { ascending: true });

    liveSessions = (rawLive as RawLiveSession[] | null) || [];
  }

  const liveSessionIds = liveSessions.map((ls) => ls.id);

  // Construir mapa id -> sesion
  const sessionMap: Record<string, RawSession> = {};
  for (const s of sessions) {
    sessionMap[s.id] = s;
  }

  const reportSessions: AttendanceReportSession[] = liveSessions.map((ls) => ({
    live_session_id: ls.id,
    session_id: ls.session_id,
    session_number: sessionMap[ls.session_id]?.number ?? 0,
    session_title: sessionMap[ls.session_id]?.title ?? "",
    started_at: ls.started_at,
    planned_duration_minutes: ls.planned_duration_minutes,
  }));

  // 4. Cargar estudiantes matriculados en la carrera que contiene esta materia
  const { data: semesterData } = await supabaseAdmin
    .from("semesters")
    .select("program_id")
    .eq("id", subject.semester_id)
    .single();

  let enrolledStudents: RawProfile[] = [];

  if (semesterData) {
    const { data: enrollments } = await supabaseAdmin
      .from("enrollments")
      .select("user_id, profiles:user_id ( id, full_name, email )")
      .eq("program_id", semesterData.program_id)
      .eq("status", "active");

    enrolledStudents = ((enrollments || []) as unknown as Array<{
      user_id: string;
      profiles: RawProfile | null;
    }>)
      .map((e) => e.profiles)
      .filter((p): p is RawProfile => p !== null);
  }

  const studentIds = enrolledStudents.map((s) => s.id);

  // 5. Cargar registros de asistencia
  let attendanceRecords: RawAttendance[] = [];

  if (liveSessionIds.length > 0 && studentIds.length > 0) {
    const { data: rawAtt } = await supabaseAdmin
      .from("attendance")
      .select("id, live_session_id, user_id, status, duration_seconds, is_manual_override")
      .in("live_session_id", liveSessionIds)
      .in("user_id", studentIds);

    attendanceRecords = (rawAtt as RawAttendance[] | null) || [];
  }

  // 6. Construir la matriz [student_id][live_session_id] -> AttendanceCell
  // Si un estudiante tiene multiples registros en la misma sesion (entradas multiples),
  // tomamos el de mayor duration_seconds (ya acumulado por el webhook).
  const matrixRaw: Record<string, Record<string, RawAttendance>> = {};

  for (const rec of attendanceRecords) {
    if (!matrixRaw[rec.user_id]) matrixRaw[rec.user_id] = {};
    const existing = matrixRaw[rec.user_id][rec.live_session_id];
    if (!existing || (rec.duration_seconds ?? 0) > (existing.duration_seconds ?? 0)) {
      matrixRaw[rec.user_id][rec.live_session_id] = rec;
    }
  }

  const matrix: Record<string, Record<string, AttendanceCell>> = {};
  for (const student of enrolledStudents) {
    matrix[student.id] = {};
    for (const ls of liveSessions) {
      const rec = matrixRaw[student.id]?.[ls.id];
      if (rec) {
        matrix[student.id][ls.id] = {
          status: rec.status as AttendanceCell["status"],
          duration_seconds: rec.duration_seconds,
          is_manual_override: rec.is_manual_override,
          attendance_id: rec.id,
        };
      } else {
        matrix[student.id][ls.id] = {
          status: "no_record",
          duration_seconds: null,
          is_manual_override: false,
          attendance_id: null,
        };
      }
    }
  }

  // 7. Calcular resumen por estudiante
  const totalSessions = liveSessions.length;

  const students: AttendanceSummary[] = enrolledStudents.map((student) => {
    let present = 0;
    let partial = 0;
    let absent = 0;

    for (const ls of liveSessions) {
      const cell = matrix[student.id]?.[ls.id];
      if (!cell || cell.status === "no_record" || cell.status === "absent") {
        absent++;
      } else if (cell.status === "present") {
        present++;
      } else if (cell.status === "partial") {
        partial++;
      }
    }

    const percentage =
      totalSessions > 0
        ? Math.round(((present + partial * 0.5) / totalSessions) * 10000) / 100
        : 0;

    return {
      student_id: student.id,
      student_name: student.full_name,
      student_email: student.email,
      subject_id: subject.id,
      subject_code: subject.code,
      subject_name: subject.name,
      total_sessions: totalSessions,
      sessions_present: present,
      sessions_partial: partial,
      sessions_absent: absent,
      attendance_percentage: percentage,
    };
  });

  // Ordenar por nombre
  students.sort((a, b) => a.student_name.localeCompare(b.student_name));

  return {
    subject_id: subject.id,
    subject_code: subject.code,
    subject_name: subject.name,
    period_from: periodFrom,
    period_to: periodTo,
    generated_at: new Date().toISOString(),
    sessions: reportSessions,
    students,
    matrix,
  };
}
