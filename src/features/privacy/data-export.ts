// ============================================
// ITSEIA Academy - Data Export (LOPDP Art. 20)
// Derecho de portabilidad: todos los datos personales
// ============================================

import { supabaseAdmin } from "@/lib/supabase/admin";

export interface UserDataExport {
  metadata: {
    exported_at: string;
    policy_version: string;
    responsable: string;
    contacto: string;
  };
  perfil: Record<string, unknown> | null;
  consentimientos: Record<string, unknown>[];
  matriculas: Record<string, unknown>[];
  progreso_sesiones: Record<string, unknown>[];
  intentos_quiz: Record<string, unknown>[];
  entregas: Record<string, unknown>[];
  uso_ai_lab: Record<string, unknown>[];
  certificados: Record<string, unknown>[];
  solicitudes_datos: Record<string, unknown>[];
}

export async function exportUserData(userId: string): Promise<UserDataExport> {
  const supabase = supabaseAdmin;

  // Consultas paralelas para todos los datos del usuario
  const [
    perfilResult,
    consentimientosResult,
    matriculasResult,
    progresoResult,
    quizResult,
    entregasResult,
    aiUsageResult,
    certificadosResult,
    solicitudesResult,
  ] = await Promise.all([
    // Perfil (excluye campos internos sensibles)
    supabase
      .from("profiles")
      .select("id, email, full_name, role, nivel_xp, current_semester, created_at")
      .eq("id", userId)
      .single(),

    // Historial de consentimientos
    supabase
      .from("consent_records")
      .select("policy_version, accepted_at, ip_address")
      .eq("user_id", userId)
      .order("accepted_at", { ascending: false }),

    // Matriculas con nombre del programa
    supabase
      .from("enrollments")
      .select("id, status, enrolled_at, programs(name, type)")
      .eq("user_id", userId)
      .order("enrolled_at", { ascending: false }),

    // Progreso por sesion
    supabase
      .from("session_progress")
      .select("session_id, video_watched, slides_viewed, theory_read, quiz_passed, assignment_submitted, ai_lab_used, completed, completed_at, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),

    // Intentos de quiz
    supabase
      .from("quiz_attempts")
      .select("quiz_id, score, max_score, percentage, passed, started_at, completed_at")
      .eq("user_id", userId)
      .order("started_at", { ascending: false }),

    // Entregas de tareas
    supabase
      .from("submissions")
      .select("assignment_id, file_name, grade, status, submitted_at, graded_at")
      .eq("user_id", userId)
      .order("submitted_at", { ascending: false }),

    // Uso AI Lab (sin tokens exactos por privacidad, solo conteo y fechas)
    supabase
      .from("ai_usage_logs")
      .select("model, tokens_in, tokens_out, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(500),

    // Certificados emitidos
    supabase
      .from("certificates")
      .select("id, code, issued_at, programs(name)")
      .eq("user_id", userId)
      .order("issued_at", { ascending: false }),

    // Solicitudes de datos previas
    supabase
      .from("data_requests")
      .select("id, type, status, notes, created_at, resolved_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  return {
    metadata: {
      exported_at: new Date().toISOString(),
      policy_version: "1.0",
      responsable: "Instituto Ecuatoriano de Inteligencia Artificial (ITSEIA)",
      contacto: "administracion@itseia.ai",
    },
    perfil: perfilResult.data ?? null,
    consentimientos: (consentimientosResult.data ?? []) as Record<string, unknown>[],
    matriculas: (matriculasResult.data ?? []) as Record<string, unknown>[],
    progreso_sesiones: (progresoResult.data ?? []) as Record<string, unknown>[],
    intentos_quiz: (quizResult.data ?? []) as Record<string, unknown>[],
    entregas: (entregasResult.data ?? []) as Record<string, unknown>[],
    uso_ai_lab: (aiUsageResult.data ?? []) as Record<string, unknown>[],
    certificados: (certificadosResult.data ?? []) as Record<string, unknown>[],
    solicitudes_datos: (solicitudesResult.data ?? []) as Record<string, unknown>[],
  };
}
