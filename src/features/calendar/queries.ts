// ============================================================
// features/calendar/queries.ts
// Queries para el calendario academico ITSEIA
// Timezone: Ecuador UTC-5 — fechas almacenadas en UTC
// ============================================================

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { CalendarEventWithDetails } from "@/types/database";

/**
 * Retorna eventos del calendario para un usuario en un rango de fechas.
 * - admin/coordinacion/super_admin: ve todos los eventos
 * - docente: ve eventos de sus materias + eventos sin materia
 * - estudiante: ve eventos de materias en sus carreras activas + eventos sin materia
 */
export async function getEventsForUser(
  userId: string,
  role: string,
  from: Date,
  to: Date,
  subjectId?: string
): Promise<CalendarEventWithDetails[]> {
  let query = supabaseAdmin
    .from("calendar_events")
    .select(
      `
      *,
      subjects:subject_id ( id, name, code ),
      teacher:teacher_id ( id, full_name )
    `
    )
    .eq("is_cancelled", false)
    .gte("scheduled_at", from.toISOString())
    .lte("scheduled_at", to.toISOString())
    .order("scheduled_at", { ascending: true });

  if (subjectId) {
    query = query.eq("subject_id", subjectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getEventsForUser error:", error);
    return [];
  }

  const events = (data || []) as CalendarEventWithDetails[];

  // Filtrar segun rol
  if (["super_admin", "admin", "coordinacion"].includes(role)) {
    return events;
  }

  if (role === "docente") {
    // Obtener materias del docente
    const { data: teacherSubjects } = await supabaseAdmin
      .from("subjects")
      .select("id")
      .eq("teacher_id", userId);

    const teacherSubjectIds = new Set(
      (teacherSubjects || []).map((s: { id: string }) => s.id)
    );

    return events.filter(
      (e) =>
        e.subject_id === null ||
        e.teacher_id === userId ||
        teacherSubjectIds.has(e.subject_id || "")
    );
  }

  // Estudiante: filtrar por materias de carreras activas
  const { data: enrollments } = await supabaseAdmin
    .from("enrollments")
    .select("program_id")
    .eq("user_id", userId)
    .eq("status", "active");

  const programIds = (enrollments || []).map(
    (e: { program_id: string }) => e.program_id
  );

  if (programIds.length === 0) {
    return events.filter((e) => e.subject_id === null);
  }

  const { data: semesters } = await supabaseAdmin
    .from("semesters")
    .select("id")
    .in("program_id", programIds);

  const semesterIds = (semesters || []).map((s: { id: string }) => s.id);

  if (semesterIds.length === 0) {
    return events.filter((e) => e.subject_id === null);
  }

  const { data: subjects } = await supabaseAdmin
    .from("subjects")
    .select("id")
    .in("semester_id", semesterIds);

  const enrolledSubjectIds = new Set(
    (subjects || []).map((s: { id: string }) => s.id)
  );

  return events.filter(
    (e) =>
      e.subject_id === null ||
      enrolledSubjectIds.has(e.subject_id || "")
  );
}

/**
 * Retorna todos los eventos del sistema (para admin global).
 * Solo usar con supabaseAdmin (service role).
 */
export async function getGlobalEvents(
  from: Date,
  to: Date,
  subjectId?: string,
  eventType?: string
): Promise<CalendarEventWithDetails[]> {
  let query = supabaseAdmin
    .from("calendar_events")
    .select(
      `
      *,
      subjects:subject_id ( id, name, code ),
      teacher:teacher_id ( id, full_name )
    `
    )
    .gte("scheduled_at", from.toISOString())
    .lte("scheduled_at", to.toISOString())
    .order("scheduled_at", { ascending: true });

  if (subjectId) {
    query = query.eq("subject_id", subjectId);
  }

  if (eventType && ["class", "deadline", "tutoring", "exam"].includes(eventType)) {
    query = query.eq("type", eventType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getGlobalEvents error:", error);
    return [];
  }

  return (data || []) as CalendarEventWithDetails[];
}

/**
 * Retorna los proximos N eventos para un usuario (widget dashboard).
 */
export async function getUpcomingEventsForUser(
  userId: string,
  role: string,
  limit = 3
): Promise<CalendarEventWithDetails[]> {
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const events = await getEventsForUser(userId, role, now, thirtyDaysLater);
  return events.slice(0, limit);
}
