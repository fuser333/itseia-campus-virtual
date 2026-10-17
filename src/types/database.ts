// ============================================
// ITSEIA Academy Online - Database Types
// V1 + V2 + V3 (Academic Structure)
// Matches supabase_schema_v3.sql exactly
// ============================================

// ============================================
// V1 Types (Original 10 tables)
// ============================================

export type UserRole = "super_admin" | "admin" | "coordinacion" | "docente" | "estudiante" | "finanzas";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  nivel_xp: number;
  current_semester: number; // V3: semester actual del estudiante (default 1)
  created_at: string;
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: "carrera" | "curso" | "preuni" | "bootcamp" | "teacher_training";
  price: number;
  duration_months: number | null;
  image_url: string | null;
  is_active: boolean;
  career_code: string | null; // V3: codigo de carrera (IA, CD, BD)
  total_semesters: number; // V3: numero de semestres (default 5)
  created_at: string;
}

export interface Course {
  id: string;
  program_id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
  is_active: boolean;
}

export interface Module {
  id: string;
  course_id: string;
  name: string;
  order_index: number;
  is_active: boolean;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content_markdown: string | null;
  video_url: string | null;
  pdf_url: string | null;
  ai_prompt_suggested: string | null;
  order_index: number;
  duration_minutes: number | null;
  is_active: boolean;
}

export interface Enrollment {
  id: string;
  user_id: string;
  program_id: string;
  status: "active" | "completed" | "suspended" | "cancelled";
  enrolled_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
}

export interface Payment {
  id: string;
  user_id: string;
  enrollment_id: string | null;
  amount: number;
  method: "transfer" | "stripe" | "cash" | "paypal";
  status: "pending" | "confirmed" | "rejected";
  reference: string | null;
  confirmed_by: string | null;
  paypal_order_id: string | null; // V2: added column
  created_at: string;
}

export interface AIUsageLog {
  id: string;
  user_id: string;
  model: string;
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  program_id: string;
  code: string;
  issued_at: string;
  pdf_url: string | null;
}

// ============================================
// V2 Types (Gamification + PayPal)
// ============================================

export type BadgeCategory = "achievement" | "streak" | "social" | "special";

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: BadgeCategory;
  xp_reward: number;
  criteria: Record<string, unknown> | null;
  is_active: boolean;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export type XpEventType =
  | "lesson_complete"
  | "module_complete"
  | "course_complete"
  | "peer_review_given"
  | "peer_review_received"
  | "daily_streak"
  | "first_ai_chat"
  | "badge_earned"
  | "quiz_passed"
  | "assignment_submitted"
  | "session_complete";

export interface XpEvent {
  id: string;
  user_id: string;
  event_type: XpEventType;
  xp_amount: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export type ProjectType = "ai_lab" | "peer_review" | "final_project" | "custom";

export interface PortfolioItem {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  project_type: ProjectType;
  url: string | null;
  thumbnail_url: string | null;
  technologies: string[] | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export type PaypalTransactionStatus = "created" | "approved" | "captured" | "failed" | "refunded";

export interface PaypalTransaction {
  id: string;
  user_id: string;
  enrollment_id: string | null;
  paypal_order_id: string | null;
  paypal_capture_id: string | null;
  amount: number;
  currency: string;
  status: PaypalTransactionStatus;
  payer_email: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// V3 Types (Academic Structure - CES Official)
// Matches supabase_schema_v3.sql Part B tables
// ============================================

export type SemesterLevel = "basic" | "professional" | "integration";

export interface Semester {
  id: string;
  program_id: string;
  number: number; // 1-5, CHECK constraint
  name: string;
  level: SemesterLevel;
  is_active: boolean;
  created_at: string;
}

export interface Subject {
  id: string;
  semester_id: string;
  code: string; // e.g. "IA101", "CD302", "BD405"
  name: string;
  slug: string;
  description: string | null;
  credit_hours: number; // default 3
  hours_docencia: number;
  hours_practica: number;
  hours_autonomo: number;
  hours_total: number;
  tools: string[] | null;
  teacher_id: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export type SlidesType = "pdf" | "google_slides" | "canva";

export interface Session {
  id: string;
  subject_id: string;
  number: number;
  title: string;
  description: string | null;
  video_url: string | null;
  video_duration_minutes: number | null;
  slides_url: string | null;
  slides_type: SlidesType | null;
  theory_markdown: string | null;
  ai_lab_context: string | null;
  ai_lab_suggested_prompt: string | null;
  estimated_duration_minutes: number; // default 45
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  session_id: string;
  title: string;
  description: string | null;
  pass_percentage: number; // default 70
  max_attempts: number; // default 3
  time_limit_minutes: number | null;
  // 005-exam-integrity columns
  shuffle_questions: boolean; // default true
  shuffle_options: boolean; // default true
  time_limit_seconds: number | null; // null = sin limite
  show_one_at_a_time: boolean; // default false
  bank_size: number | null; // total preguntas en banco rotativo
  show_n_questions: number | null; // cuantas mostrar del banco
  is_active: boolean;
  created_at: string;
}

// ============================================
// 005-exam-integrity Types
// ============================================

export interface QuizAttemptIntegrity {
  id: string;
  attempt_id: string; // FK quiz_attempts.id
  question_order: string[] | null; // array de question_ids en el orden presentado
  option_orders: Record<string, number[]> | null; // {question_id: [original_index, ...]}
  time_per_question: Record<string, number>; // {question_id: segundos}
  tab_switches: number;
  copy_paste_attempts: number;
  browser_info: string | null;
  integrity_score: number; // 0.00 - 1.00
  flagged: boolean;
  suspicious_flags: string[] | null;
  created_at: string;
}

export interface IntegrityReportAttempt {
  attempt_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  score: number | null;
  max_score: number | null;
  percentage: number | null;
  passed: boolean | null;
  completed_at: string | null;
  tab_switches: number;
  time_per_question: Record<string, number>;
  integrity_score: number;
  flagged: boolean;
  suspicious_flags: string[] | null;
  question_order: string[] | null;
  answers: Record<string, unknown> | null;
}

export interface IntegrityReport {
  quiz_id: string;
  quiz_title: string;
  total_attempts: number;
  total_flagged: number;
  avg_integrity_score: number;
  avg_score_percentage: number;
  suspicious_pairs_count: number;
  attempts_summary: IntegrityReportAttempt[];
  suspicious_pairs: {
    attempt_a: string;
    user_a: string;
    attempt_b: string;
    user_b: string;
    similarity: number;
    flag: string;
  }[];
  gemini_narrative: string;
  generated_at: string;
}

export type QuestionType = "multiple_choice" | "true_false" | "multiple_select";

export interface QuizQuestionOption {
  text: string;
  is_correct: boolean;
}

/**
 * JSONB options format stored in quiz_questions.options:
 * - multiple_choice: { options: QuizQuestionOption[], correct_index: number }
 * - true_false: { options: QuizQuestionOption[], correct_answer: boolean }
 * - multiple_select: { options: QuizQuestionOption[], correct_indices: number[] }
 */
export interface QuizQuestionOptions {
  options?: QuizQuestionOption[];
  correct_index?: number;
  correct_indices?: number[];
  correct_answer?: boolean;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: QuestionType;
  options: QuizQuestionOptions; // JSONB NOT NULL
  explanation: string | null;
  points: number; // default 1
  order_index: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  answers: Record<string, unknown> | null; // JSONB: { question_id: selected_index | boolean }
  score: number | null;
  max_score: number | null;
  percentage: number | null; // decimal(5,2)
  passed: boolean | null;
  started_at: string;
  completed_at: string | null;
}

export interface Assignment {
  id: string;
  session_id: string;
  title: string;
  instructions_markdown: string | null;
  due_date: string | null;
  max_file_size_mb: number; // default 10
  allowed_file_types: string[]; // default ['pdf','zip','py','ipynb','docx']
  max_grade: number; // default 100, decimal(5,2)
  is_active: boolean;
  created_at: string;
}

export type SubmissionStatus = "submitted" | "graded" | "returned" | "late";

export interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  file_url: string | null;
  file_name: string | null;
  file_size_bytes: number | null;
  notes: string | null;
  grade: number | null; // decimal(5,2)
  feedback: string | null;
  graded_by: string | null; // FK profiles
  graded_at: string | null;
  status: SubmissionStatus;
  submitted_at: string;
}

export interface SessionProgress {
  id: string;
  user_id: string;
  session_id: string;
  video_watched: boolean;
  video_watch_seconds: number; // default 0
  slides_viewed: boolean;
  theory_read: boolean;
  quiz_passed: boolean;
  assignment_submitted: boolean;
  ai_lab_used: boolean;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ResourceType = "pdf" | "link" | "video" | "github" | "dataset" | "tool";

export interface SessionResource {
  id: string;
  session_id: string;
  title: string;
  url: string;
  type: ResourceType;
  description: string | null;
  order_index: number;
  created_at: string;
}

// ============================================
// Joined / Composite Types for UI
// ============================================

// V1 joined types
export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export interface EnrollmentWithProgram extends Enrollment {
  programs: Program;
}

export interface CourseWithProgress extends Course {
  total_lessons: number;
  completed_lessons: number;
}

// V2 joined types
export interface UserBadgeWithDetails extends UserBadge {
  badges: Badge;
}

// V3 joined types
export interface SemesterWithSubjects extends Semester {
  subjects: Subject[];
}

export interface SubjectWithSessions extends Subject {
  sessions: SessionWithContent[];
}

export interface SessionWithContent extends Session {
  quizzes?: Quiz[];
  assignments?: Assignment[];
  session_resources?: SessionResource[];
  session_progress?: SessionProgress;
}

export interface SubjectWithProgress extends Subject {
  total_sessions: number;
  completed_sessions: number;
  progress_percent: number;
}

export interface ProgramWithSemesters extends Program {
  semesters: SemesterWithSubjects[];
}

export interface SessionWithProgress extends Session {
  session_progress?: SessionProgress;
}

export interface QuizWithQuestions extends Quiz {
  quiz_questions: QuizQuestion[];
}

export interface AssignmentWithSubmission extends Assignment {
  submissions?: Submission[];
}

// ============================================
// V4 Types (Videoconferencia Sincronica CES)
// Feature: 002-sync-videoconference
// ============================================

export type AttendanceStatus = "present" | "partial" | "absent";

export interface LiveSession {
  id: string;
  session_id: string;
  daily_room_name: string;
  daily_room_url: string;
  started_at: string;
  ended_at: string | null;
  recording_url: string | null;
  created_by: string;
  is_active: boolean;
  planned_duration_minutes: number;
  created_at: string;
}

export interface Attendance {
  id: string;
  live_session_id: string;
  user_id: string;
  joined_at: string;
  left_at: string | null;
  duration_seconds: number | null;
  was_present: boolean;
  status: AttendanceStatus;
  is_manual_override: boolean;
  override_reason: string | null;
  created_at: string;
}

export interface ScheduledClass {
  id: string;
  subject_id: string;
  session_id: string | null;
  teacher_id: string;
  scheduled_at: string;
  duration_minutes: number;
  title: string | null;
  description: string | null;
  is_cancelled: boolean;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
}

// Joined types for videoconference
export interface LiveSessionWithAttendance extends LiveSession {
  attendance: Attendance[];
}

export interface ScheduledClassWithDetails extends ScheduledClass {
  subjects?: Pick<Subject, "id" | "name" | "code">;
  sessions?: Pick<Session, "id" | "number" | "title">;
  teacher?: Pick<Profile, "id" | "full_name">;
}

// ============================================
// Feature: 008-lopdp-compliance
// Cumplimiento Ley Organica de Proteccion de Datos Personales (Ecuador)
// ============================================

export type DataRequestType = "export" | "delete" | "rectify" | "oppose";
export type DataRequestStatus = "pending" | "processing" | "completed" | "rejected" | "held";

/**
 * Evidencia legal de consentimiento dado por un usuario (LOPDP Art. 9).
 * Un registro por usuario por version de politica.
 */
export interface ConsentRecord {
  id: string;
  user_id: string;
  policy_version: string;
  accepted_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

/**
 * Solicitud de ejercicio de derechos ARCO (LOPDP Arts. 19-22).
 * Plazo legal de respuesta: 15 dias habiles.
 */
export interface DataRequest {
  id: string;
  user_id: string;
  type: DataRequestType;
  status: DataRequestStatus;
  notes: string | null;
  admin_notes: string | null;
  legal_hold_reason: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

/** DataRequest con datos del usuario solicitante (para panel admin) */
export interface DataRequestWithUser extends DataRequest {
  profiles?: Pick<Profile, "id" | "full_name" | "email">;
  /** Dias habiles restantes hasta el plazo legal (negativo = vencido) */
  days_until_deadline?: number;
}

export interface AttendanceWithProfile extends Attendance {
  profiles?: Pick<Profile, "id" | "full_name" | "email">;
}

// ============================================
// Feature: 007-attendance-tracking
// Reportes, alertas y exportacion SENESCYT
// ============================================

/** Resumen de asistencia de un estudiante en una materia */
export interface AttendanceSummary {
  student_id: string;
  student_name: string;
  student_email: string;
  subject_id: string;
  subject_code: string;
  subject_name: string;
  total_sessions: number;
  sessions_present: number;
  sessions_partial: number;
  sessions_absent: number;
  /** Porcentaje: present + (0.5 * partial) / total * 100 */
  attendance_percentage: number;
}

/** Celda de la matriz de asistencia [studentId][liveSessionId] */
export interface AttendanceCell {
  status: AttendanceStatus | "no_record";
  duration_seconds: number | null;
  is_manual_override: boolean;
  attendance_id: string | null;
}

/** Datos de una sesion en el reporte */
export interface AttendanceReportSession {
  live_session_id: string;
  session_id: string;
  session_number: number;
  session_title: string;
  started_at: string;
  planned_duration_minutes: number;
}

/** Datos completos del reporte de asistencia por materia */
export interface AttendanceReport {
  subject_id: string;
  subject_code: string;
  subject_name: string;
  period_from: string;
  period_to: string;
  generated_at: string;
  sessions: AttendanceReportSession[];
  students: AttendanceSummary[];
  /** Matriz: student_id -> live_session_id -> celda */
  matrix: Record<string, Record<string, AttendanceCell>>;
}

/** Alerta de inasistencia acumulada > 30% */
export interface AlertItem {
  id: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  student_id: string;
  student_name: string;
  student_email: string;
  alert_threshold: number;
  sessions_absent: number;
  total_sessions: number;
  absence_percentage: number;
  acknowledged_at: string | null;
  created_at: string;
}

// ============================================
// V5 Types (Foros de Discusion — Feature 003)
// ============================================

/**
 * Mensaje del foro de una materia.
 * parent_id = null -> post raiz (hilo)
 * parent_id != null -> respuesta directa al post padre
 */
export interface ForumPost {
  id: string;
  subject_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  is_pinned: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

/** Notificacion in-app para docente cuando un estudiante publica en su foro */
export interface ForumNotification {
  id: string;
  user_id: string;
  post_id: string;
  subject_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

/** ForumPost con datos del autor (perfil) anidados */
export interface ForumPostWithAuthor extends ForumPost {
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url" | "role">;
  replies?: ForumPostWithAuthor[];
}

/** Resultado de la funcion get_forum_metrics */
export interface ForumMetrics {
  subject_id: string;
  total_posts: number;
  total_replies: number;
  unique_authors: number;
  last_post_at: string | null;
  is_inactive: boolean;
}

/** ForumMetrics enriquecido con datos de la materia para el panel admin */
export interface ForumMetricsWithSubject extends ForumMetrics {
  subject_name: string;
  subject_code: string;
  total_enrolled: number;
  participation_rate: number; // unique_authors / total_enrolled * 100
}

// ============================================
// View types (from SQL views)
// ============================================

export interface SubjectProgressView {
  user_id: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  semester_id: string;
  semester_number: number;
  program_id: string;
  total_sessions: number;
  completed_sessions: number;
  progress_percent: number;
}

// ============================================
// Feature: 006-academic-calendar
// Calendario Academico Integrado CES
// ============================================

export type CalendarEventType = "class" | "deadline" | "tutoring" | "exam";

export interface CalendarEvent {
  id: string;
  type: CalendarEventType;
  subject_id: string | null;
  session_id: string | null;
  teacher_id: string | null;
  title: string;
  description: string | null;
  scheduled_at: string; // ISO 8601 timestamptz
  duration_minutes: number;
  location: string | null;
  videoconference_link: string | null;
  live_session_id: string | null;
  is_cancelled: boolean;
  cancelled_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

/** CalendarEvent con datos de subject y teacher para la UI */
export interface CalendarEventWithDetails extends CalendarEvent {
  subjects?: Pick<Subject, "id" | "name" | "code"> | null;
  teacher?: Pick<Profile, "id" | "full_name"> | null;
}

/** Colores ITSEIA por tipo de evento */
export const CALENDAR_EVENT_COLORS: Record<CalendarEventType, string> = {
  class: "#1F2F58",
  deadline: "#FBBC0C",
  tutoring: "#73B8E7",
  exam: "#F0846D",
};

/** Labels en espanol por tipo de evento */
export const CALENDAR_EVENT_LABELS: Record<CalendarEventType, string> = {
  class: "Clase Sincronica",
  deadline: "Entrega / Deadline",
  tutoring: "Tutoria",
  exam: "Evaluacion",
};

// ============================================
// Feature: 004-virtual-library
// Biblioteca Virtual con APIs Open Access
// Cumple Art. 61 RRA 2022
// ============================================

/** Fuentes de papers soportadas */
export type LibrarySource = "openalex" | "arxiv" | "scielo";

/**
 * Resultado normalizado de cualquier fuente (OpenAlex, arXiv, Scielo).
 * Interfaz unificada para la UI — independiente de la fuente.
 */
export interface PaperResult {
  /** ID unico dentro de la fuente (DOI, arXiv ID, Scielo PID, etc.) */
  id: string;
  source: LibrarySource;
  title: string;
  authors: string[];
  year: number | null;
  abstract: string | null;
  /** URL al texto completo o pagina del paper */
  url: string;
  doi: string | null;
  language: string | null;
  /** Nombre de la revista o venue de publicacion */
  journal: string | null;
}

/** Paper guardado en favoritos por un usuario */
export interface SavedPaper {
  id: string;
  user_id: string;
  source: LibrarySource;
  external_id: string;
  title: string;
  authors: string;    // JSON array serializado
  url: string;
  abstract: string | null;
  year: number | null;
  apa_citation: string | null;
  saved_at: string;
}

/** Registro de busqueda en la biblioteca (auditoria SENESCYT) */
export interface LibrarySearch {
  id: string;
  user_id: string | null;
  query: string;
  sources_used: string[];
  result_count: number;
  subject_id: string | null;
  created_at: string;
}

// ============================================================
// Feature: 010-ai-lab-advanced
// Historial, Flashcards, Code Snippets
// ============================================================

/** Un mensaje dentro de una conversacion del AI Lab */
export interface AIConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  model?: string;
  favorito?: boolean;
}

/** Conversacion completa del AI Lab */
export interface AIConversation {
  id: string;
  user_id: string;
  session_id: string | null;
  model: string;
  title: string | null;
  messages: AIConversationMessage[];
  es_comparacion: boolean;
  favorito: boolean;
  created_at: string;
  updated_at: string;
}

/** Respuesta marcada como favorita dentro de una conversacion */
export interface AIFavorite {
  id: string;
  user_id: string;
  conversation_id: string;
  mensaje_index: number;
  created_at: string;
}

/** Snippet de codigo guardado desde el Playground */
export interface CodeSnippet {
  id: string;
  user_id: string;
  session_id: string | null;
  language: "python" | "javascript";
  code: string;
  output: string | null;
  title: string | null;
  created_at: string;
  updated_at: string;
}

/** Flashcard de estudio (frente/dorso) */
export interface Flashcard {
  id: string;
  user_id: string;
  session_id: string | null;
  deck_name: string | null;
  frente: string;
  dorso: string;
  editada: boolean;
  next_review: string | null;
  ease_factor: number;
  interval_days: number;
  created_at: string;
}

/** Mazo de flashcards — sesion de repaso */
export interface FlashcardDeck {
  id: string;
  user_id: string;
  flashcard_ids: string[];
  session_id: string | null;
  deck_name: string | null;
  started_at: string;
  completed_at: string | null;
  cards_revisadas: number;
  created_at: string;
}

/** Flashcard local (antes de guardar en BD) */
export interface FlashcardLocal {
  frente: string;
  dorso: string;
  editada?: boolean;
}

/** AIConversation con datos de sesion para el historial */
export interface AIConversationWithSession extends AIConversation {
  sessions?: Pick<Session, "id" | "number" | "title"> | null;
}

/** Flashcard con datos de sesion para la pagina de mazos */
export interface FlashcardWithSession extends Flashcard {
  sessions?: Pick<Session, "id" | "number" | "title"> | null;
}

// ============================================
// Feature: 009-industry-certifications
// Modulo de Certificaciones de Industria
// ============================================

export type CertificationLevel = "basico" | "intermedio" | "avanzado";
export type CertificationStatus = "activa" | "actualizacion_pendiente" | "archivada";
export type CertificationBadgeType = "simulacro_aprobado" | "certificado_oficial";

/** Programa de certificacion internacional (AWS, Google, Microsoft, GitHub) */
export interface CertificationProgram {
  id: string;
  slug: string;
  nombre: string;
  proveedor: string;                              // 'AWS' | 'Google' | 'Microsoft' | 'GitHub'
  logo_url: string | null;
  nivel_dificultad: CertificationLevel;
  costo_examen_usd: number;
  duracion_horas_estimada: number;
  umbral_aprobacion_porcentaje: number;           // 0-100
  idioma_examen: string;
  descripcion: string | null;
  estado: CertificationStatus;
  dominios_count: number;
  created_at: string;
}

/** Dominio dentro de una certificacion (equivalente a materia en el curriculum) */
export interface CertificationDomain {
  id: string;
  certification_id: string;
  nombre: string;
  descripcion: string | null;
  porcentaje_en_examen: number;                  // 0-100
  orden: number;
  created_at: string;
}

/** Vinculo entre una session existente y un dominio de certificacion */
export interface CertificationSession {
  id: string;
  domain_id: string;
  session_id: string;
  orden: number;
  created_at: string;
}

/** Registro de que estudiante inicio que certificacion */
export interface CertificationEnrollment {
  id: string;
  user_id: string;
  certification_id: string;
  started_at: string;
  last_accessed_at: string;
}

/** Opcion de respuesta en una pregunta del banco de examen */
export interface ExamQuestionOption {
  text: string;
  is_correct: boolean;
}

/** Pregunta del banco del simulacro */
export interface ExamQuestion {
  id: string;
  certification_id: string;
  domain_id: string | null;
  enunciado: string;
  opciones: ExamQuestionOption[];                // JSONB array
  respuesta_correcta: number;                    // 0-based index — NUNCA enviar al cliente
  explicacion: string | null;
  idioma: string;
  activa: boolean;
  created_at: string;
}

/** Pregunta tal como se entrega al cliente (sin respuesta correcta) */
export type ExamQuestionForClient = Omit<ExamQuestion, "respuesta_correcta">;

/** Resultado por dominio dentro de un intento */
export interface DomainScore {
  correct: number;
  total: number;
}

/** Respuesta individual del estudiante en un intento */
export interface ExamAnswerRecord {
  question_id: string;
  selected_index: number;    // -1 si no respondio
  is_correct: boolean;
}

/** Intento de simulacro de examen */
export interface ExamAttempt {
  id: string;
  user_id: string;
  certification_id: string;
  started_at: string;
  finished_at: string | null;
  score_total: number | null;                    // preguntas correctas
  total_questions: number | null;
  percentage: number | null;                     // 0.00-100.00
  aprobado: boolean | null;
  score_por_dominio: Record<string, DomainScore> | null;
  respuestas: ExamAnswerRecord[] | null;
  duration_seconds: number | null;
  created_at: string;
}

/** Badge de certificacion en el portfolio del estudiante */
export interface CertificationBadge {
  id: string;
  user_id: string;
  certification_id: string;
  badge_type: CertificationBadgeType;
  score: number | null;
  issued_at: string;
  evidencia_url: string | null;
  validated_by: string | null;
  validation_date: string | null;
}

// ── Joined types ──────────────────────────────────────────

export interface CertificationDomainWithSessions extends CertificationDomain {
  certification_sessions?: CertificationSession[];
  sessions_count?: number;
  completed_sessions?: number;
}

export interface CertificationProgramWithDomains extends CertificationProgram {
  certification_domains: CertificationDomainWithSessions[];
  enrollment?: CertificationEnrollment | null;
  badge?: CertificationBadge | null;
}

export interface CertificationBadgeWithProgram extends CertificationBadge {
  certification_programs: Pick<
    CertificationProgram,
    "id" | "slug" | "nombre" | "proveedor" | "logo_url" | "nivel_dificultad"
  >;
}

/** Resultado completo de un intento incluyendo datos de las preguntas con explicaciones */
export interface ExamAttemptResult extends ExamAttempt {
  questions: (ExamQuestionForClient & { respuesta_correcta: number })[];
  certification: Pick<CertificationProgram, "id" | "nombre" | "umbral_aprobacion_porcentaje">;
}

// ============================================================
// Feature: 011-teacher-module
// Capacitacion 120h CES, Rubricas, Intervenciones, Anuncios
// ============================================================

/** Progreso de un docente en una sesion del curso de capacitacion */
export interface TeacherTrainingProgress {
  id: string;
  teacher_id: string;
  session_id: string;
  completed_at: string;
  hours_credited: number;
  created_at: string;
}

/** Certificado de 120h generado para un docente */
export interface TeacherCertificate {
  id: string;
  teacher_id: string;
  total_hours: number;
  certificate_url: string | null;
  certified_at: string;
  is_valid: boolean;
  created_at: string;
}

/** Horas de capacitacion externas validadas manualmente por coordinacion */
export interface TeacherExternalHours {
  id: string;
  teacher_id: string;
  hours: number;
  description: string;
  validated_by: string | null;
  validated_at: string | null;
  created_at: string;
}

/** Criterio de evaluacion en una rubrica */
export interface AssignmentRubric {
  id: string;
  assignment_id: string;
  criterion_name: string;
  description: string | null;
  weight_percent: number;
  order_index: number;
  created_at: string;
}

/** Nota de intervencion docente sobre un estudiante en riesgo */
export interface TeacherIntervention {
  id: string;
  teacher_id: string;
  student_id: string;
  subject_id: string;
  note_text: string;
  created_at: string;
}

/** Anuncio de docente para estudiantes de una materia */
export interface Announcement {
  id: string;
  teacher_id: string;
  subject_id: string;
  title: string;
  body_markdown: string;
  published_at: string;
  is_archived: boolean;
  created_at: string;
}

/** Registro de lectura de un anuncio */
export interface AnnouncementRead {
  id: string;
  announcement_id: string;
  user_id: string;
  read_at: string;
}

/** Mensaje directo entre docente y estudiante */
export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject_id: string | null;
  body: string;
  sent_at: string;
  read_at: string | null;
}

// ── Composite types for 011 ───────────────────────────────

/** Resumen de progreso de capacitacion de un docente */
export interface TrainingProgressSummary {
  hoursCompleted: number;
  hoursTotal: 120;
  modulesCompleted: number;
  modulesTotal: 8;
  hasCertificate: boolean;
  certificateUrl: string | null;
  completedSessionIds: string[];
}

/** Datos de un modulo del curso de capacitacion para la UI */
export interface TrainingModuleUI {
  subjectId: string;
  order: number;
  code: string;
  name: string;
  description: string | null;
  hours: number;
  sessions: TrainingSessionUI[];
  completedSessions: number;
  isCompleted: boolean;
}

/** Datos de una sesion del curso para la UI */
export interface TrainingSessionUI {
  id: string;
  number: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  completedAt: string | null;
}

/** Estudiante en riesgo detectado por analytics */
export interface StudentAtRisk {
  studentId: string;
  studentName: string;
  studentEmail: string;
  criteria: string[];
  lastAccess: string | null;
  sessionCompletion: number; // porcentaje 0-100
  quizAverage: number | null;
  consecutiveAbsences: number;
  hasIntervention: boolean;
}

/** Tasa de error por pregunta de quiz */
export interface QuizErrorRate {
  questionId: string;
  questionText: string;
  totalAttempts: number;
  incorrectCount: number;
  errorRate: number; // 0-1
}

/** Engagement de una sesion (completitud y tiempo) */
export interface SessionEngagementData {
  sessionId: string;
  sessionNumber: number;
  sessionTitle: string;
  avgDurationMinutes: number | null;
  completionRate: number; // 0-100
  totalStudents: number;
  completedCount: number;
}

/** Anuncio con estado de lectura para el estudiante */
export interface AnnouncementWithReadStatus extends Announcement {
  is_read: boolean;
  read_count?: number;
}

/** Mensaje directo con datos del sender */
export interface DirectMessageWithSender extends DirectMessage {
  sender?: Pick<Profile, "id" | "full_name" | "avatar_url">;
}

/** Resumen de docente para el reporte de coordinacion */
export interface TeacherCapacitacionRow {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  subjects: string[];
  hoursCompleted: number;
  hasCertificate: boolean;
  certifiedAt: string | null;
  status: "certificado" | "en_progreso";
}
