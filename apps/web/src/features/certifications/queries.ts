// ============================================================
// ITSEIA Academy — Certifications: Queries
// Feature: 009-industry-certifications
// ============================================================

import { createClient } from "@supabase/supabase-js";
import type {
  CertificationProgram,
  CertificationDomain,
  CertificationEnrollment,
  CertificationBadge,
  ExamAttempt,
  ExamQuestionForClient,
  CertificationProgramWithDomains,
  CertificationBadgeWithProgram,
} from "@/types/database";

// Server-side admin client (bypasses RLS)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

// ── Catalog ──────────────────────────────────────────────

/**
 * Returns all active certification programs ordered by provider + name.
 * Used for the catalog page (no auth required — RLS allows public read).
 */
export async function getCatalog(): Promise<CertificationProgram[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("certification_programs")
    .select("*")
    .neq("estado", "archivada")
    .order("proveedor", { ascending: true })
    .order("nombre", { ascending: true });

  if (error) {
    console.error("[getCatalog]", error);
    return [];
  }
  return (data || []) as CertificationProgram[];
}

/**
 * Returns a single certification with its domains (and sessions per domain count).
 * Also fetches enrollment and badge for the given userId if provided.
 */
export async function getCertification(
  slug: string,
  userId?: string
): Promise<CertificationProgramWithDomains | null> {
  const supabase = getAdminClient();

  const { data: cert, error } = await supabase
    .from("certification_programs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !cert) {
    return null;
  }

  const { data: domains } = await supabase
    .from("certification_domains")
    .select("*")
    .eq("certification_id", cert.id)
    .order("orden", { ascending: true });

  const { data: certSessions } = await supabase
    .from("certification_sessions")
    .select("*")
    .in(
      "domain_id",
      (domains || []).map((d: CertificationDomain) => d.id)
    )
    .order("orden", { ascending: true });

  const domainsWithSessions = (domains || []).map((domain: CertificationDomain) => {
    const domainSessions = (certSessions || []).filter(
      (cs: { domain_id: string }) => cs.domain_id === domain.id
    );
    return {
      ...domain,
      certification_sessions: domainSessions,
      sessions_count: domainSessions.length,
    };
  });

  let enrollment: CertificationEnrollment | null = null;
  let badge: CertificationBadge | null = null;

  if (userId) {
    const { data: enrollData } = await supabase
      .from("certification_enrollments")
      .select("*")
      .eq("user_id", userId)
      .eq("certification_id", cert.id)
      .single();
    enrollment = enrollData || null;

    const { data: badgeData } = await supabase
      .from("certification_badges")
      .select("*")
      .eq("user_id", userId)
      .eq("certification_id", cert.id)
      .single();
    badge = badgeData || null;
  }

  return {
    ...(cert as CertificationProgram),
    certification_domains: domainsWithSessions,
    enrollment,
    badge,
  };
}

// ── Student Progress ──────────────────────────────────────

/**
 * Returns the list of certifications a student is enrolled in,
 * including their badge status and last attempt score.
 */
export async function getStudentCertifications(userId: string): Promise<
  Array<{
    enrollment: CertificationEnrollment;
    program: CertificationProgram;
    badge: CertificationBadge | null;
    lastAttempt: Pick<ExamAttempt, "percentage" | "aprobado" | "created_at"> | null;
  }>
> {
  const supabase = getAdminClient();

  const { data: enrollments } = await supabase
    .from("certification_enrollments")
    .select("*, certification_programs(*)")
    .eq("user_id", userId)
    .order("last_accessed_at", { ascending: false });

  if (!enrollments || enrollments.length === 0) return [];

  const certIds = enrollments.map(
    (e: { certification_id: string }) => e.certification_id
  );

  const { data: badges } = await supabase
    .from("certification_badges")
    .select("*")
    .eq("user_id", userId)
    .in("certification_id", certIds);

  const { data: attempts } = await supabase
    .from("exam_attempts")
    .select("certification_id, percentage, aprobado, created_at")
    .eq("user_id", userId)
    .in("certification_id", certIds)
    .not("finished_at", "is", null)
    .order("created_at", { ascending: false });

  return enrollments.map((e: {
    certification_id: string;
    certification_programs: CertificationProgram;
    id: string;
    user_id: string;
    started_at: string;
    last_accessed_at: string;
  }) => {
    const badge =
      (badges || []).find(
        (b: CertificationBadge) => b.certification_id === e.certification_id
      ) || null;
    const lastAttempt =
      (attempts || []).find(
        (a: { certification_id: string }) =>
          a.certification_id === e.certification_id
      ) || null;
    return {
      enrollment: {
        id: e.id,
        user_id: e.user_id,
        certification_id: e.certification_id,
        started_at: e.started_at,
        last_accessed_at: e.last_accessed_at,
      },
      program: e.certification_programs as CertificationProgram,
      badge,
      lastAttempt: lastAttempt
        ? {
            percentage: lastAttempt.percentage,
            aprobado: lastAttempt.aprobado,
            created_at: lastAttempt.created_at,
          }
        : null,
    };
  });
}

/**
 * Returns exam attempt history for a student for a specific certification.
 */
export async function getExamHistory(
  userId: string,
  certificationId: string
): Promise<ExamAttempt[]> {
  const supabase = getAdminClient();
  const { data } = await supabase
    .from("exam_attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("certification_id", certificationId)
    .not("finished_at", "is", null)
    .order("created_at", { ascending: true });

  return (data || []) as ExamAttempt[];
}

/**
 * Returns a completed exam attempt with questions for results page.
 * Includes respuesta_correcta for display after submission.
 * Only returns the attempt if it belongs to the given userId.
 */
export async function getExamAttemptWithQuestions(
  attemptId: string,
  userId: string
): Promise<{
  attempt: ExamAttempt;
  questions: (ExamQuestionForClient & { respuesta_correcta: number })[];
  certification: CertificationProgram;
} | null> {
  const supabase = getAdminClient();

  const { data: attempt } = await supabase
    .from("exam_attempts")
    .select("*")
    .eq("id", attemptId)
    .eq("user_id", userId)
    .single();

  if (!attempt) return null;

  const { data: cert } = await supabase
    .from("certification_programs")
    .select("*")
    .eq("id", attempt.certification_id)
    .single();

  if (!cert) return null;

  // Get question IDs from respuestas
  const respuestas = (attempt.respuestas || []) as Array<{
    question_id: string;
    selected_index: number;
    is_correct: boolean;
  }>;
  const questionIds = respuestas.map((r) => r.question_id);

  const { data: questions } = await supabase
    .from("exam_questions")
    .select("*")
    .in("id", questionIds);

  return {
    attempt: attempt as ExamAttempt,
    questions: (questions || []) as (ExamQuestionForClient & {
      respuesta_correcta: number;
    })[],
    certification: cert as CertificationProgram,
  };
}

// ── Exam Questions (for start endpoint) ───────────────────

/**
 * Returns N random exam questions for a certification WITHOUT respuesta_correcta.
 * The caller (API route) uses Fisher-Yates after fetching all active questions.
 * respuesta_correcta is stripped here for safety when domainId filter not used.
 */
export async function getExamQuestionsForClient(
  certificationId: string,
  limit: number = 65,
  domainId?: string
): Promise<ExamQuestionForClient[]> {
  const supabase = getAdminClient();

  let query = supabase
    .from("exam_questions")
    .select("id, certification_id, domain_id, enunciado, opciones, explicacion, idioma, activa, created_at")
    .eq("certification_id", certificationId)
    .eq("activa", true);

  if (domainId) {
    query = query.eq("domain_id", domainId);
  }

  const { data } = await query;

  const all = (data || []) as ExamQuestionForClient[];

  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  return all.slice(0, limit);
}

/**
 * Returns the full questions (with respuesta_correcta) for scoring.
 * Used ONLY in server-side API route submit handler.
 */
export async function getExamQuestionsForScoring(
  questionIds: string[]
): Promise<
  Array<{
    id: string;
    respuesta_correcta: number;
    domain_id: string | null;
  }>
> {
  if (questionIds.length === 0) return [];
  const supabase = getAdminClient();
  const { data } = await supabase
    .from("exam_questions")
    .select("id, respuesta_correcta, domain_id")
    .in("id", questionIds);
  return (data || []) as Array<{
    id: string;
    respuesta_correcta: number;
    domain_id: string | null;
  }>;
}

// ── Admin queries ──────────────────────────────────────────

export interface AdminCertificationReport {
  certification: CertificationProgram;
  active_students: number;
  approved_simulacros: number;
  official_certificates: number;
}

export async function getAdminCertificationsReport(): Promise<
  AdminCertificationReport[]
> {
  const supabase = getAdminClient();

  const { data: programs } = await supabase
    .from("certification_programs")
    .select("*")
    .order("nombre");

  if (!programs) return [];

  const reports: AdminCertificationReport[] = await Promise.all(
    (programs as CertificationProgram[]).map(async (program) => {
      const { count: active } = await supabase
        .from("certification_enrollments")
        .select("*", { count: "exact", head: true })
        .eq("certification_id", program.id);

      const { count: approved } = await supabase
        .from("certification_badges")
        .select("*", { count: "exact", head: true })
        .eq("certification_id", program.id)
        .eq("badge_type", "simulacro_aprobado");

      const { count: official } = await supabase
        .from("certification_badges")
        .select("*", { count: "exact", head: true })
        .eq("certification_id", program.id)
        .eq("badge_type", "certificado_oficial");

      return {
        certification: program,
        active_students: active || 0,
        approved_simulacros: approved || 0,
        official_certificates: official || 0,
      };
    })
  );

  return reports;
}

export interface AdminStudentProgress {
  user_id: string;
  full_name: string;
  email: string;
  started_at: string;
  last_accessed_at: string;
  badge_type: string | null;
  badge_score: number | null;
  last_attempt_date: string | null;
  last_attempt_percentage: number | null;
}

export async function getAdminCertificationStudents(
  certificationId: string
): Promise<AdminStudentProgress[]> {
  const supabase = getAdminClient();

  const { data: enrollments } = await supabase
    .from("certification_enrollments")
    .select("*, profiles(id, full_name, email)")
    .eq("certification_id", certificationId)
    .order("started_at", { ascending: false });

  if (!enrollments) return [];

  const userIds = (
    enrollments as Array<{ user_id: string }>
  ).map((e) => e.user_id);

  const { data: badges } = await supabase
    .from("certification_badges")
    .select("user_id, badge_type, score")
    .eq("certification_id", certificationId)
    .in("user_id", userIds);

  const { data: lastAttempts } = await supabase
    .from("exam_attempts")
    .select("user_id, percentage, created_at")
    .eq("certification_id", certificationId)
    .in("user_id", userIds)
    .not("finished_at", "is", null)
    .order("created_at", { ascending: false });

  return (
    enrollments as Array<{
      user_id: string;
      started_at: string;
      last_accessed_at: string;
      profiles: { id: string; full_name: string; email: string } | null;
    }>
  ).map((e) => {
    const badge = (
      badges as Array<{
        user_id: string;
        badge_type: string;
        score: number | null;
      }>
    )?.find((b) => b.user_id === e.user_id);

    const lastAttempt = (
      lastAttempts as Array<{
        user_id: string;
        percentage: number | null;
        created_at: string;
      }>
    )?.find((a) => a.user_id === e.user_id);

    return {
      user_id: e.user_id,
      full_name: e.profiles?.full_name || "Sin nombre",
      email: e.profiles?.email || "",
      started_at: e.started_at,
      last_accessed_at: e.last_accessed_at,
      badge_type: badge?.badge_type || null,
      badge_score: badge?.score || null,
      last_attempt_date: lastAttempt?.created_at || null,
      last_attempt_percentage: lastAttempt?.percentage || null,
    };
  });
}

// ── Portfolio badges ───────────────────────────────────────

/**
 * Returns all badges for a user's public portfolio.
 * Only returns simulacro_aprobado and certificado_oficial.
 */
export async function getPortfolioBadges(
  userId: string
): Promise<CertificationBadgeWithProgram[]> {
  const supabase = getAdminClient();

  const { data } = await supabase
    .from("certification_badges")
    .select(
      "*, certification_programs(id, slug, nombre, proveedor, logo_url, nivel_dificultad)"
    )
    .eq("user_id", userId)
    .order("issued_at", { ascending: false });

  return (data || []) as CertificationBadgeWithProgram[];
}
