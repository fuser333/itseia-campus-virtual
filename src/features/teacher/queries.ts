// ============================================================
// ITSEIA Academy — Feature 011: Teacher Module Queries
// Server-side queries para capacitacion, analytics, anuncios
// ============================================================

import { createClient } from "@/lib/supabase/server";
import type {
  TrainingProgressSummary,
  TrainingModuleUI,
  TeacherCapacitacionRow,
} from "@/types/database";

const HOURS_REQUIRED = 120;
const MODULES_TOTAL = 8;

/**
 * Obtiene el progreso de capacitacion de un docente.
 * Suma horas de teacher_training_progress + teacher_external_hours.
 */
export async function getTrainingProgress(
  teacherId: string
): Promise<TrainingProgressSummary> {
  const supabase = await createClient();

  // Internal hours from completed training sessions
  const { data: progressRows } = await supabase
    .from("teacher_training_progress")
    .select("session_id, hours_credited, completed_at")
    .eq("teacher_id", teacherId);

  const completedSessionIds = (progressRows || []).map((r) => r.session_id);
  const internalHours = (progressRows || []).reduce(
    (sum, r) => sum + Number(r.hours_credited),
    0
  );

  // External validated hours
  const { data: externalRows } = await supabase
    .from("teacher_external_hours")
    .select("hours")
    .eq("teacher_id", teacherId);

  const externalHours = (externalRows || []).reduce(
    (sum, r) => sum + Number(r.hours),
    0
  );

  const hoursCompleted = Math.min(internalHours + externalHours, 999);

  // Check certificate
  const { data: cert } = await supabase
    .from("teacher_certificates")
    .select("certificate_url")
    .eq("teacher_id", teacherId)
    .eq("is_valid", true)
    .maybeSingle();

  return {
    hoursCompleted,
    hoursTotal: HOURS_REQUIRED,
    modulesCompleted: Math.floor(hoursCompleted / (HOURS_REQUIRED / MODULES_TOTAL)),
    modulesTotal: MODULES_TOTAL,
    hasCertificate: !!cert,
    certificateUrl: cert?.certificate_url ?? null,
    completedSessionIds,
  };
}

/**
 * Obtiene los modulos del programa de capacitacion con estado de completitud
 * del docente especificado.
 */
export async function getTrainingModules(
  teacherId: string
): Promise<TrainingModuleUI[]> {
  const supabase = await createClient();

  // Find teacher_training program
  const { data: program } = await supabase
    .from("programs")
    .select("id")
    .eq("slug", "docencia-virtual-efectiva")
    .eq("type", "teacher_training")
    .maybeSingle();

  if (!program) return [];

  // Get semester
  const { data: semester } = await supabase
    .from("semesters")
    .select("id")
    .eq("program_id", program.id)
    .maybeSingle();

  if (!semester) return [];

  // Get subjects (modules) with sessions
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, code, name, description, hours_total, order_index")
    .eq("semester_id", semester.id)
    .eq("is_active", true)
    .order("order_index");

  if (!subjects || subjects.length === 0) return [];

  const subjectIds = subjects.map((s) => s.id);

  // Get all sessions for these subjects
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, subject_id, number, title, description")
    .in("subject_id", subjectIds)
    .eq("is_active", true)
    .order("number");

  // Get teacher's completed sessions
  const { data: progressRows } = await supabase
    .from("teacher_training_progress")
    .select("session_id, completed_at")
    .eq("teacher_id", teacherId);

  const completedMap = new Map(
    (progressRows || []).map((r) => [r.session_id, r.completed_at])
  );

  const sessionsBySubject = new Map<string, typeof sessions>();
  for (const sess of sessions || []) {
    const arr = sessionsBySubject.get(sess.subject_id) || [];
    arr.push(sess);
    sessionsBySubject.set(sess.subject_id, arr);
  }

  return subjects.map((subj) => {
    const subjectSessions = sessionsBySubject.get(subj.id) || [];
    const uiSessions = subjectSessions.map((s) => ({
      id: s.id,
      number: s.number,
      title: s.title,
      description: s.description,
      isCompleted: completedMap.has(s.id),
      completedAt: completedMap.get(s.id) ?? null,
    }));
    const completedSessions = uiSessions.filter((s) => s.isCompleted).length;
    return {
      subjectId: subj.id,
      order: subj.order_index,
      code: subj.code,
      name: subj.name,
      description: subj.description,
      hours: subj.hours_total,
      sessions: uiSessions,
      completedSessions,
      isCompleted: completedSessions === uiSessions.length && uiSessions.length > 0,
    };
  });
}

/**
 * Obtiene todos los docentes activos con su estado de capacitacion.
 * Solo para coordinacion/admin.
 */
export async function getAllTeachersCapacitacion(): Promise<TeacherCapacitacionRow[]> {
  const supabase = await createClient();

  // Get all teachers
  const { data: teachers } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "docente");

  if (!teachers || teachers.length === 0) return [];

  const rows: TeacherCapacitacionRow[] = [];

  for (const teacher of teachers) {
    // Internal hours
    const { data: progress } = await supabase
      .from("teacher_training_progress")
      .select("hours_credited")
      .eq("teacher_id", teacher.id);

    const internalHours = (progress || []).reduce(
      (sum, r) => sum + Number(r.hours_credited),
      0
    );

    // External hours
    const { data: external } = await supabase
      .from("teacher_external_hours")
      .select("hours")
      .eq("teacher_id", teacher.id);

    const externalHours = (external || []).reduce(
      (sum, r) => sum + Number(r.hours),
      0
    );

    const hoursCompleted = internalHours + externalHours;

    // Certificate
    const { data: cert } = await supabase
      .from("teacher_certificates")
      .select("certified_at")
      .eq("teacher_id", teacher.id)
      .eq("is_valid", true)
      .maybeSingle();

    // Subjects
    const { data: subjects } = await supabase
      .from("subjects")
      .select("name")
      .eq("teacher_id", teacher.id)
      .eq("is_active", true);

    rows.push({
      teacherId: teacher.id,
      teacherName: teacher.full_name,
      teacherEmail: teacher.email,
      subjects: (subjects || []).map((s) => s.name),
      hoursCompleted,
      hasCertificate: !!cert,
      certifiedAt: cert?.certified_at ?? null,
      status: cert ? "certificado" : "en_progreso",
    });
  }

  return rows;
}
