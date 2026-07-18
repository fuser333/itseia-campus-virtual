// ============================================================
// ITSEIA Academy — Alertas de inasistencia acumulada
// Feature: 007-attendance-tracking
//
// checkAbsenceAlerts: calcula porcentaje de ausencia por
// estudiante en una materia; si > 30% y no hay alerta activa,
// inserta en absence_alerts.
// ============================================================

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AlertItem } from "@/types/database";

const ABSENCE_THRESHOLD = 0.30; // 30%

/**
 * Verifica si algun estudiante de la materia supera el umbral de inasistencia
 * y crea alertas en la tabla absence_alerts si no existe una activa.
 * Retorna la lista de alertas activas (sin acknowledged_at) para la materia.
 */
export async function checkAbsenceAlerts(subjectId: string): Promise<AlertItem[]> {
  // 1. Cargar semestre de la materia para obtener el programa
  const { data: subject } = await supabaseAdmin
    .from("subjects")
    .select("id, code, name, semester_id")
    .eq("id", subjectId)
    .single();

  if (!subject) return [];

  const { data: semester } = await supabaseAdmin
    .from("semesters")
    .select("program_id")
    .eq("id", subject.semester_id)
    .single();

  if (!semester) return [];

  // 2. Cargar sesiones de la materia
  const { data: sessions } = await supabaseAdmin
    .from("sessions")
    .select("id")
    .eq("subject_id", subjectId)
    .eq("is_active", true);

  const sessionIds = (sessions || []).map((s) => s.id);
  if (sessionIds.length === 0) return [];

  // 3. Cargar live_sessions realizadas (no de prueba)
  const { data: liveSessions } = await supabaseAdmin
    .from("live_sessions")
    .select("id")
    .in("session_id", sessionIds)
    .eq("is_test_session", false)
    .not("ended_at", "is", null);

  const totalSessions = (liveSessions || []).length;
  if (totalSessions === 0) return [];

  const liveSessionIds = (liveSessions || []).map((ls) => ls.id);

  // 4. Cargar estudiantes matriculados
  const { data: enrollments } = await supabaseAdmin
    .from("enrollments")
    .select("user_id, profiles:user_id ( id, full_name, email )")
    .eq("program_id", semester.program_id)
    .eq("status", "active");

  const students = (enrollments || [])
    .map((e) => {
      const profile = e.profiles as unknown as { id: string; full_name: string; email: string } | null;
      return profile ?? null;
    })
    .filter(Boolean) as { id: string; full_name: string; email: string }[];

  if (students.length === 0) return [];

  // 5. Cargar asistencias
  const { data: attendanceRecords } = await supabaseAdmin
    .from("attendance")
    .select("user_id, live_session_id, status")
    .in("live_session_id", liveSessionIds)
    .in("user_id", students.map((s) => s.id));

  // Contabilizar asistencias por estudiante (de presencia, no de ausencia)
  const presentByStudent: Record<string, Set<string>> = {};
  for (const rec of attendanceRecords || []) {
    if (rec.status === "present" || rec.status === "partial") {
      if (!presentByStudent[rec.user_id]) presentByStudent[rec.user_id] = new Set();
      presentByStudent[rec.user_id].add(rec.live_session_id);
    }
  }

  // 6. Cargar alertas activas existentes (sin acknowledged_at) para evitar duplicados
  const { data: existingAlerts } = await supabaseAdmin
    .from("absence_alerts")
    .select("student_id")
    .eq("subject_id", subjectId)
    .is("acknowledged_at", null);

  const studentsWithActiveAlert = new Set(
    (existingAlerts || []).map((a) => a.student_id)
  );

  // 7. Calcular y crear alertas para estudiantes que superan el umbral
  const alertsToInsert: {
    subject_id: string;
    student_id: string;
    alert_threshold: number;
    sessions_absent: number;
    total_sessions: number;
    absence_percentage: number;
  }[] = [];

  for (const student of students) {
    const sessionsPresent = presentByStudent[student.id]?.size ?? 0;
    const sessionsAbsent = totalSessions - sessionsPresent;
    const absenceRatio = sessionsAbsent / totalSessions;

    if (absenceRatio > ABSENCE_THRESHOLD && !studentsWithActiveAlert.has(student.id)) {
      alertsToInsert.push({
        subject_id: subjectId,
        student_id: student.id,
        alert_threshold: ABSENCE_THRESHOLD * 100,
        sessions_absent: sessionsAbsent,
        total_sessions: totalSessions,
        absence_percentage: Math.round(absenceRatio * 10000) / 100,
      });
    }
  }

  if (alertsToInsert.length > 0) {
    await supabaseAdmin.from("absence_alerts").insert(alertsToInsert);
  }

  // 8. Retornar todas las alertas activas de la materia enriquecidas
  return getActiveAlerts(subjectId, subject.code, subject.name, students);
}

/**
 * Obtiene las alertas activas de una materia (sin acknowledged_at).
 * No crea alertas nuevas — solo consulta las existentes.
 */
export async function getActiveAlerts(
  subjectId: string,
  subjectCode?: string,
  subjectName?: string,
  studentsCache?: { id: string; full_name: string; email: string }[]
): Promise<AlertItem[]> {
  const { data: alerts } = await supabaseAdmin
    .from("absence_alerts")
    .select("id, subject_id, student_id, alert_threshold, sessions_absent, total_sessions, absence_percentage, acknowledged_at, created_at")
    .eq("subject_id", subjectId)
    .is("acknowledged_at", null)
    .order("absence_percentage", { ascending: false });

  if (!alerts || alerts.length === 0) return [];

  // Resolver nombres si no tenemos cache
  let studentMap: Record<string, { full_name: string; email: string }> = {};

  if (studentsCache) {
    for (const s of studentsCache) {
      studentMap[s.id] = { full_name: s.full_name, email: s.email };
    }
  } else {
    const studentIds = alerts.map((a) => a.student_id);
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email")
      .in("id", studentIds);
    for (const p of profiles || []) {
      studentMap[p.id] = { full_name: p.full_name, email: p.email };
    }
  }

  // Resolver nombre de materia si no tenemos
  let subCode = subjectCode;
  let subName = subjectName;
  if (!subCode || !subName) {
    const { data: sub } = await supabaseAdmin
      .from("subjects")
      .select("code, name")
      .eq("id", subjectId)
      .single();
    subCode = sub?.code ?? "";
    subName = sub?.name ?? "";
  }

  return alerts.map((a) => ({
    id: a.id,
    subject_id: a.subject_id,
    subject_code: subCode!,
    subject_name: subName!,
    student_id: a.student_id,
    student_name: studentMap[a.student_id]?.full_name ?? "Estudiante",
    student_email: studentMap[a.student_id]?.email ?? "",
    alert_threshold: a.alert_threshold,
    sessions_absent: a.sessions_absent,
    total_sessions: a.total_sessions,
    absence_percentage: a.absence_percentage,
    acknowledged_at: a.acknowledged_at,
    created_at: a.created_at,
  }));
}
