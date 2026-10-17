"use server";

// ============================================================
// ITSEIA Academy — Feature 011: Teacher Module Server Actions
// completeModule, generateCertificate, saveIntervention,
// publishAnnouncement, saveExternalHours, saveRubric
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const HOURS_REQUIRED = 120;

// ──────────────────────────────────────────────────────────
// completeModule
// Marks a training session as completed for the current teacher.
// Calculates hours from the session's subject hours_total / sessions_count.
// If total reaches 120h, triggers certificate generation.
// ──────────────────────────────────────────────────────────
export async function completeModule(sessionId: string): Promise<{
  success: boolean;
  hoursCompleted?: number;
  certificateGenerated?: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["docente", "super_admin", "admin", "coordinacion"].includes(profile.role)) {
    return { success: false, error: "Rol no autorizado" };
  }

  // Get hours for this session from its parent subject
  const { data: session } = await supabase
    .from("sessions")
    .select("id, subject_id")
    .eq("id", sessionId)
    .single();

  if (!session) return { success: false, error: "Sesion no encontrada" };

  // Count sessions in same subject to distribute hours
  const { count: sessionCount } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("subject_id", session.subject_id)
    .eq("is_active", true);

  const { data: subject } = await supabase
    .from("subjects")
    .select("hours_total")
    .eq("id", session.subject_id)
    .single();

  const hoursPerSession =
    subject && sessionCount
      ? Number(subject.hours_total) / sessionCount
      : 0;

  // Upsert progress (idempotent)
  const { error: insertError } = await supabase
    .from("teacher_training_progress")
    .upsert(
      {
        teacher_id: user.id,
        session_id: sessionId,
        hours_credited: hoursPerSession,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "teacher_id,session_id" }
    );

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  // Recalculate total hours
  const { data: allProgress } = await supabase
    .from("teacher_training_progress")
    .select("hours_credited")
    .eq("teacher_id", user.id);

  const { data: externalRows } = await supabase
    .from("teacher_external_hours")
    .select("hours")
    .eq("teacher_id", user.id);

  const totalHours =
    (allProgress || []).reduce((sum, r) => sum + Number(r.hours_credited), 0) +
    (externalRows || []).reduce((sum, r) => sum + Number(r.hours), 0);

  // Check if certificate needs to be generated
  let certificateGenerated = false;
  if (totalHours >= HOURS_REQUIRED) {
    const { data: existingCert } = await supabase
      .from("teacher_certificates")
      .select("id")
      .eq("teacher_id", user.id)
      .maybeSingle();

    if (!existingCert) {
      // Create certificate record (URL will be filled when user clicks download)
      await supabase.from("teacher_certificates").insert({
        teacher_id: user.id,
        total_hours: totalHours,
        is_valid: true,
      });
      certificateGenerated = true;
    }
  }

  revalidatePath("/teacher/capacitacion");
  revalidatePath("/teacher");

  return {
    success: true,
    hoursCompleted: totalHours,
    certificateGenerated,
  };
}

// ──────────────────────────────────────────────────────────
// saveIntervention
// Registers a private note for a student at risk.
// ──────────────────────────────────────────────────────────
export async function saveIntervention(
  studentId: string,
  subjectId: string,
  noteText: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  const { error } = await supabase.from("teacher_interventions").insert({
    teacher_id: user.id,
    student_id: studentId,
    subject_id: subjectId,
    note_text: noteText.trim(),
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/teacher/materias/${subjectId}`);
  return { success: true };
}

// ──────────────────────────────────────────────────────────
// saveExternalHours
// Admin/coordinacion registers external training hours for a teacher.
// ──────────────────────────────────────────────────────────
export async function saveExternalHours(
  teacherId: string,
  hours: number,
  description: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    !profile ||
    !["super_admin", "admin", "coordinacion"].includes(profile.role)
  ) {
    return { success: false, error: "Solo coordinacion puede registrar horas externas" };
  }

  const { error } = await supabase.from("teacher_external_hours").insert({
    teacher_id: teacherId,
    hours,
    description: description.trim(),
    validated_by: user.id,
    validated_at: new Date().toISOString(),
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/docentes/capacitacion");
  return { success: true };
}

// ──────────────────────────────────────────────────────────
// saveRubric
// Upserts rubric criteria for an assignment.
// ──────────────────────────────────────────────────────────
export async function saveRubric(
  assignmentId: string,
  criteria: { id?: string; criterion_name: string; description: string; weight_percent: number }[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  // Delete existing rubric rows for this assignment
  await supabase
    .from("assignment_rubrics")
    .delete()
    .eq("assignment_id", assignmentId);

  // Insert new rows
  const rows = criteria.map((c, i) => ({
    assignment_id: assignmentId,
    criterion_name: c.criterion_name.trim(),
    description: c.description.trim() || null,
    weight_percent: c.weight_percent,
    order_index: i,
  }));

  const { error } = await supabase.from("assignment_rubrics").insert(rows);
  if (error) return { success: false, error: error.message };

  return { success: true };
}

// ──────────────────────────────────────────────────────────
// publishAnnouncement
// Creates an announcement for a subject.
// ──────────────────────────────────────────────────────────
export async function publishAnnouncement(
  subjectId: string,
  title: string,
  bodyMarkdown: string
): Promise<{ success: boolean; announcementId?: string; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      teacher_id: user.id,
      subject_id: subjectId,
      title: title.trim(),
      body_markdown: bodyMarkdown.trim(),
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath(`/teacher/comunicacion`);
  return { success: true, announcementId: data.id };
}

// ──────────────────────────────────────────────────────────
// archiveAnnouncement
// Archives an announcement (soft delete).
// ──────────────────────────────────────────────────────────
export async function archiveAnnouncement(
  announcementId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autenticado" };

  const { error } = await supabase
    .from("announcements")
    .update({ is_archived: true })
    .eq("id", announcementId)
    .eq("teacher_id", user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/teacher/comunicacion");
  return { success: true };
}
