-- ============================================
-- ITSEIA Academy — Migrations 004-010 (CES Compliance)
-- Ejecutar en Supabase SQL Editor de una sola vez
-- Proyecto: wqlselfapnggxxeziruo
-- Fecha: 22 marzo 2026 (CORREGIDO)
-- ============================================

-- ============================================
-- Migration: 004_videoconference.sql
-- ============================================

-- ============================================================
-- ITSEIA Academy — Videoconferencia Sincronica CES
-- Feature: 002-sync-videoconference
-- Fecha: 2026-03-22
-- Requisito CES: Art. 57 y 61 RRA 2022 (51% creditos sincronicos)
-- ============================================================

-- ============================================================
-- 1. LIVE_SESSIONS — Salas activas de videoconferencia
-- ============================================================

CREATE TABLE IF NOT EXISTS public.live_sessions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id              UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  daily_room_name         TEXT NOT NULL,
  daily_room_url          TEXT NOT NULL,
  started_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at                TIMESTAMPTZ,
  recording_url           TEXT,
  created_by              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  is_active               BOOLEAN NOT NULL DEFAULT true,
  planned_duration_minutes INTEGER NOT NULL DEFAULT 90,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.live_sessions IS 'Salas de videoconferencia Daily.co vinculadas a sesiones academicas. Evidencia CES Art. 57 RRA 2022.';

CREATE INDEX IF NOT EXISTS idx_live_sessions_session_id  ON public.live_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_created_by  ON public.live_sessions(created_by);
CREATE INDEX IF NOT EXISTS idx_live_sessions_is_active   ON public.live_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_live_sessions_started_at  ON public.live_sessions(started_at DESC);

ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

-- Docentes y admins pueden ver las salas de sus materias
CREATE POLICY "Docentes y admins pueden ver live_sessions" ON public.live_sessions
  FOR SELECT USING (
    -- Admin / coordinacion / super_admin ven todo
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion')
    )
    OR
    -- El docente que creo la sala la puede ver
    created_by = auth.uid()
    OR
    -- Estudiantes matriculados en el programa que contiene esa sesion pueden ver la sala
    EXISTS (
      SELECT 1
      FROM public.sessions s
      JOIN public.subjects sub ON sub.id = s.subject_id
      JOIN public.semesters sem ON sem.id = sub.semester_id
      JOIN public.enrollments e ON e.program_id = sem.program_id
      WHERE s.id = live_sessions.session_id
        AND e.user_id = auth.uid()
        AND e.status = 'active'
    )
  );

-- Solo docentes asignados y admins pueden insertar
CREATE POLICY "Docentes y admins pueden crear live_sessions" ON public.live_sessions
  FOR INSERT WITH CHECK (
    auth.uid() = created_by
    AND (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('super_admin', 'admin', 'coordinacion', 'docente')
      )
    )
  );

-- Solo el creador y admins pueden actualizar (ej. ended_at, recording_url)
CREATE POLICY "Docentes y admins pueden actualizar live_sessions" ON public.live_sessions
  FOR UPDATE USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- ============================================================
-- 2. ATTENDANCE — Registro de asistencia a clases sincronicas
-- ============================================================

CREATE TABLE IF NOT EXISTS public.attendance (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  live_session_id     UUID NOT NULL REFERENCES public.live_sessions(id) ON DELETE CASCADE,
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at             TIMESTAMPTZ,
  duration_seconds    INTEGER,
  was_present         BOOLEAN NOT NULL DEFAULT true,
  status              TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'partial', 'absent')),
  is_manual_override  BOOLEAN NOT NULL DEFAULT false,
  override_reason     TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.attendance IS 'Registro automatico de asistencia por participante. Alimentado por webhooks Daily.co. Evidencia CES.';

-- Idempotencia: un usuario no puede tener dos filas para la misma entrada en la misma sesion
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_unique_join
  ON public.attendance(live_session_id, user_id, joined_at);

CREATE INDEX IF NOT EXISTS idx_attendance_live_session ON public.attendance(live_session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user         ON public.attendance(user_id);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Cada usuario ve su propia asistencia
CREATE POLICY "Usuarios ven su propia asistencia" ON public.attendance
  FOR SELECT USING (user_id = auth.uid());

-- Admins, coordinacion y docentes ven toda la asistencia
CREATE POLICY "Admins y docentes ven toda la asistencia" ON public.attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion', 'docente')
    )
  );

-- Solo el service role (via webhook) puede insertar/actualizar asistencia
-- Las inserciones via API admin son permitidas (service role bypasses RLS)
CREATE POLICY "Inserciones de asistencia solo via service role" ON public.attendance
  FOR INSERT WITH CHECK (
    -- Solo admins pueden insertar manualmente (el webhook usa service role que bypassa RLS)
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

CREATE POLICY "Actualizaciones de asistencia solo via service role" ON public.attendance
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- ============================================================
-- 3. SCHEDULED_CLASSES — Calendario de clases sincronicas
-- ============================================================

CREATE TABLE IF NOT EXISTS public.scheduled_classes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id          UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  session_id          UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  teacher_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  scheduled_at        TIMESTAMPTZ NOT NULL,
  duration_minutes    INTEGER NOT NULL DEFAULT 90,
  title               TEXT,
  description         TEXT,
  is_cancelled        BOOLEAN NOT NULL DEFAULT false,
  cancel_reason       TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.scheduled_classes IS 'Calendario de sesiones sincronicas programadas. Visible para estudiantes y docentes. Requisito CES de planificacion visible.';

CREATE INDEX IF NOT EXISTS idx_scheduled_subject    ON public.scheduled_classes(subject_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_session    ON public.scheduled_classes(session_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_teacher    ON public.scheduled_classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_at         ON public.scheduled_classes(scheduled_at);

ALTER TABLE public.scheduled_classes ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado puede ver clases programadas (visibilidad CES)
CREATE POLICY "Usuarios autenticados ven clases programadas" ON public.scheduled_classes
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Solo docentes y admins pueden crear clases programadas
CREATE POLICY "Docentes y admins crean clases programadas" ON public.scheduled_classes
  FOR INSERT WITH CHECK (
    auth.uid() = teacher_id
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion', 'docente')
    )
  );

-- Solo el docente creador y admins pueden modificar
CREATE POLICY "Docentes y admins modifican clases programadas" ON public.scheduled_classes
  FOR UPDATE USING (
    teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- Solo admins pueden eliminar
CREATE POLICY "Admins eliminan clases programadas" ON public.scheduled_classes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );


-- ============================================
-- Migration: 005_lopdp.sql
-- ============================================

-- ============================================
-- ITSEIA Academy - Migration 005: LOPDP Compliance
-- Ley Organica de Proteccion de Datos Personales (Ecuador)
-- Fecha: 22 marzo 2026
-- ============================================

-- ============================================
-- 1. CONSENT_RECORDS
-- Registro de consentimiento explicito (Art. 9 LOPDP)
-- ============================================

CREATE TABLE IF NOT EXISTS public.consent_records (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  policy_version  TEXT        NOT NULL,
  accepted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address      TEXT,
  user_agent      TEXT,
  UNIQUE(user_id, policy_version)
);

COMMENT ON TABLE public.consent_records IS
  'Evidencia legal de consentimiento LOPDP Art.9 — un registro por usuario por version de politica';

CREATE INDEX IF NOT EXISTS idx_consent_records_user_version
  ON public.consent_records(user_id, policy_version);

CREATE INDEX IF NOT EXISTS idx_consent_records_user_id
  ON public.consent_records(user_id);

-- ============================================
-- 2. DATA_REQUESTS
-- Solicitudes de derechos ARCO (Arts. 19-22 LOPDP)
-- ============================================

CREATE TABLE IF NOT EXISTS public.data_requests (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type            TEXT        NOT NULL CHECK (type IN ('export', 'delete', 'rectify', 'oppose')),
  status          TEXT        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'processing', 'completed', 'rejected', 'held')),
  notes           TEXT,
  admin_notes     TEXT,
  legal_hold_reason TEXT,
  resolved_by     UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.data_requests IS
  'Solicitudes ARCO de usuarios — plazo legal de respuesta: 15 dias habiles (LOPDP)';

CREATE INDEX IF NOT EXISTS idx_data_requests_status_created
  ON public.data_requests(status, created_at);

CREATE INDEX IF NOT EXISTS idx_data_requests_user_id
  ON public.data_requests(user_id);

-- ============================================
-- 3. ROW LEVEL SECURITY — consent_records
-- ============================================

ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- Usuario ve solo sus propios registros de consentimiento
DROP POLICY IF EXISTS "consent_records_select_own" ON public.consent_records;
CREATE POLICY "consent_records_select_own"
  ON public.consent_records
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuario inserta solo su propio consentimiento
DROP POLICY IF EXISTS "consent_records_insert_own" ON public.consent_records;
CREATE POLICY "consent_records_insert_own"
  ON public.consent_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin (service role) puede leer todos — sin policy adicional porque
-- service_role bypasses RLS por defecto en Supabase

-- ============================================
-- 4. ROW LEVEL SECURITY — data_requests
-- ============================================

ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;

-- Usuario ve solo sus propias solicitudes
DROP POLICY IF EXISTS "data_requests_select_own" ON public.data_requests;
CREATE POLICY "data_requests_select_own"
  ON public.data_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuario crea solo solicitudes propias
DROP POLICY IF EXISTS "data_requests_insert_own" ON public.data_requests;
CREATE POLICY "data_requests_insert_own"
  ON public.data_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin actualiza cualquier solicitud (via profiles role check)
DROP POLICY IF EXISTS "data_requests_update_admin" ON public.data_requests;
CREATE POLICY "data_requests_update_admin"
  ON public.data_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- Admin lee todas las solicitudes
DROP POLICY IF EXISTS "data_requests_select_admin" ON public.data_requests;
CREATE POLICY "data_requests_select_admin"
  ON public.data_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion')
    )
  );


-- ============================================
-- Migration: 006_exam_integrity.sql
-- ============================================

-- ============================================================
-- ITSEIA Academy — Migracion 006: Integridad de Evaluaciones
-- Spec: 005-exam-integrity
-- Fecha: 2026-03-22
-- Art. 62 RRA 2022: mecanismos de deteccion de deshonestidad academica
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. Columnas adicionales en tabla quizzes
-- ──────────────────────────────────────────────────────────────

ALTER TABLE public.quizzes
  ADD COLUMN IF NOT EXISTS shuffle_questions    BOOLEAN      NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS shuffle_options      BOOLEAN      NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS time_limit_seconds   INTEGER      NULL,
  ADD COLUMN IF NOT EXISTS show_one_at_a_time   BOOLEAN      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS bank_size            INTEGER      NULL,
  ADD COLUMN IF NOT EXISTS show_n_questions     INTEGER      NULL;

COMMENT ON COLUMN public.quizzes.shuffle_questions   IS 'Aleatoriza el orden de preguntas por intento';
COMMENT ON COLUMN public.quizzes.shuffle_options     IS 'Aleatoriza el orden de opciones por pregunta';
COMMENT ON COLUMN public.quizzes.time_limit_seconds  IS 'Tiempo limite en segundos. NULL = sin limite';
COMMENT ON COLUMN public.quizzes.show_one_at_a_time  IS 'Mostrar una pregunta a la vez';
COMMENT ON COLUMN public.quizzes.bank_size           IS 'Total de preguntas en el banco (banco rotativo)';
COMMENT ON COLUMN public.quizzes.show_n_questions    IS 'Cuantas preguntas mostrar del banco. NULL = todas';

-- ──────────────────────────────────────────────────────────────
-- 2. Tabla quiz_attempt_integrity
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.quiz_attempt_integrity (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id           UUID         NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_order       JSONB        NULL,         -- array de question_ids en el orden presentado
  option_orders        JSONB        NULL,         -- {question_id: [original_index, ...]} orden de opciones
  time_per_question    JSONB        NOT NULL DEFAULT '{}', -- {question_id: segundos_float}
  tab_switches         INTEGER      NOT NULL DEFAULT 0,
  copy_paste_attempts  INTEGER      NOT NULL DEFAULT 0,
  browser_info         TEXT         NULL,
  integrity_score      DECIMAL(3,2) NOT NULL DEFAULT 1.00, -- 0.00 a 1.00
  flagged              BOOLEAN      NOT NULL DEFAULT false,
  suspicious_flags     JSONB        NULL,         -- array de strings descripcion flags
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.quiz_attempt_integrity IS
  'Registro de metricas de integridad academica por intento. Art. 62 RRA 2022.';

CREATE UNIQUE INDEX IF NOT EXISTS quiz_attempt_integrity_attempt_id_idx
  ON public.quiz_attempt_integrity(attempt_id);

-- ──────────────────────────────────────────────────────────────
-- 3. RLS (Row Level Security)
--    - Estudiantes NO pueden ver su propio registro (previene gaming)
--    - Solo docentes, admin y super_admin pueden leer
-- ──────────────────────────────────────────────────────────────

ALTER TABLE public.quiz_attempt_integrity ENABLE ROW LEVEL SECURITY;

-- Docentes y admins pueden leer todos los registros de integridad
CREATE POLICY "integrity_admin_read" ON public.quiz_attempt_integrity
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion', 'docente')
    )
  );

-- Solo el servidor (service role) puede insertar/actualizar
-- No se crean politicas INSERT/UPDATE para roles de usuario,
-- las escrituras se hacen exclusivamente via supabaseAdmin (service role bypass RLS)

-- ──────────────────────────────────────────────────────────────
-- 4. Indice adicional para consultas de reporte por quiz
-- ──────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS quiz_attempt_integrity_flagged_idx
  ON public.quiz_attempt_integrity(flagged)
  WHERE flagged = true;


-- ============================================
-- Migration: 007_academic_calendar.sql
-- ============================================

-- ============================================================
-- ITSEIA Academy — Calendario Academico Integrado
-- Feature: 006-academic-calendar
-- Fecha: 2026-03-22
-- Requisito CES: Planificacion documentada y visible de sesiones
--   sincronicas (Reglamento IST RPC-SE-04-No.012-2023)
-- ============================================================

-- ============================================================
-- 1. CALENDAR_EVENTS — Eventos academicos programados
-- ============================================================

CREATE TABLE IF NOT EXISTS public.calendar_events (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type                  TEXT NOT NULL CHECK (type IN ('class', 'deadline', 'tutoring', 'exam')),
  subject_id            UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  session_id            UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  teacher_id            UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title                 TEXT NOT NULL,
  description           TEXT,
  scheduled_at          TIMESTAMPTZ NOT NULL,
  duration_minutes      INTEGER NOT NULL DEFAULT 60,
  location              TEXT,
  videoconference_link  TEXT,
  live_session_id       UUID REFERENCES public.live_sessions(id) ON DELETE SET NULL,
  is_cancelled          BOOLEAN NOT NULL DEFAULT false,
  cancelled_at          TIMESTAMPTZ,
  created_by            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT duration_range CHECK (duration_minutes BETWEEN 15 AND 300)
);

COMMENT ON TABLE public.calendar_events IS
  'Eventos del calendario academico ITSEIA: clases sincronicas, deadlines, tutorias y examenes. '
  'Evidencia de planificacion sistematica exigida por CES (RPC-SE-04-No.012-2023). '
  'Historial minimo: 1 periodo academico.';

-- ---- Indexes ----
CREATE INDEX IF NOT EXISTS idx_calendar_events_scheduled_at
  ON public.calendar_events(scheduled_at);

CREATE INDEX IF NOT EXISTS idx_calendar_events_subject_scheduled
  ON public.calendar_events(subject_id, scheduled_at);

CREATE INDEX IF NOT EXISTS idx_calendar_events_teacher
  ON public.calendar_events(teacher_id);

CREATE INDEX IF NOT EXISTS idx_calendar_events_created_by
  ON public.calendar_events(created_by);

CREATE INDEX IF NOT EXISTS idx_calendar_events_type
  ON public.calendar_events(type);

-- ---- updated_at trigger ----
CREATE OR REPLACE FUNCTION public.set_calendar_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_calendar_events_updated_at ON public.calendar_events;
CREATE TRIGGER trg_calendar_events_updated_at
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW EXECUTE FUNCTION public.set_calendar_updated_at();

-- ============================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- SELECT: estudiantes ven eventos de materias en que estan matriculados
--         + eventos sin subject_id (institucionales/publicos)
--         docentes ven eventos de sus materias
--         admin/coordinacion ven todo
CREATE POLICY "Estudiantes ven eventos de sus materias" ON public.calendar_events
  FOR SELECT USING (
    -- Admin / coordinacion / super_admin ven todos los eventos
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion')
    )
    OR
    -- Docente ve eventos de las materias que le pertenecen
    (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'docente'
      )
      AND (
        teacher_id = auth.uid()
        OR subject_id IN (
          SELECT id FROM public.subjects WHERE teacher_id = auth.uid()
        )
        OR subject_id IS NULL
      )
    )
    OR
    -- Estudiante: eventos de materias en sus carreras activas, o eventos sin materia
    (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'estudiante'
      )
      AND (
        subject_id IS NULL
        OR subject_id IN (
          SELECT sub.id
          FROM public.subjects sub
          JOIN public.semesters sem ON sem.id = sub.semester_id
          JOIN public.enrollments e ON e.program_id = sem.program_id
          WHERE e.user_id = auth.uid()
            AND e.status = 'active'
        )
      )
    )
  );

-- INSERT: docentes y admins pueden crear eventos
--         docentes solo en materias asignadas a ellos
CREATE POLICY "Docentes y admins crean eventos" ON public.calendar_events
  FOR INSERT WITH CHECK (
    auth.uid() = created_by
    AND (
      -- Admin / coordinacion sin restriccion de materia
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('super_admin', 'admin', 'coordinacion')
      )
      OR
      -- Docente: solo en materias que le son asignadas (o sin materia)
      (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role = 'docente'
        )
        AND (
          subject_id IS NULL
          OR subject_id IN (
            SELECT id FROM public.subjects WHERE teacher_id = auth.uid()
          )
        )
        AND (teacher_id = auth.uid() OR teacher_id IS NULL)
      )
    )
  );

-- UPDATE: creador original y admins pueden modificar
CREATE POLICY "Creador y admins actualizan eventos" ON public.calendar_events
  FOR UPDATE USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- DELETE: solo admins pueden eliminar (docentes usan is_cancelled)
CREATE POLICY "Admins eliminan eventos" ON public.calendar_events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
  );


-- ============================================
-- Migration: 008_library.sql
-- ============================================

-- ============================================================
-- ITSEIA Academy — Migration 008: Biblioteca Virtual
-- Feature: 004-virtual-library
-- Cumple Art. 61 RRA 2022 (acceso a biblioteca virtual)
-- ============================================================

-- ─────────────────────────────────────────
-- TABLE: saved_papers
-- Papers guardados en favoritos por usuario
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_papers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source      text NOT NULL,              -- 'openalex' | 'arxiv' | 'scielo'
  external_id text NOT NULL,             -- ID del paper en la fuente externa
  title       text NOT NULL,
  authors     text NOT NULL,             -- JSON array serializado como texto
  url         text NOT NULL,
  abstract    text,
  year        integer,
  apa_citation text,                     -- Cita APA pre-calculada
  saved_at    timestamptz NOT NULL DEFAULT now()
);

-- Evitar duplicados: mismo usuario no puede guardar el mismo paper dos veces
ALTER TABLE saved_papers
  ADD CONSTRAINT saved_papers_user_source_id_unique
  UNIQUE (user_id, source, external_id);

-- Indice para busquedas rapidas por usuario
CREATE INDEX IF NOT EXISTS idx_saved_papers_user_id
  ON saved_papers (user_id);

-- ─────────────────────────────────────────
-- TABLE: library_searches
-- Registro de busquedas para auditoria SENESCYT
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS library_searches (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  query        text NOT NULL,
  sources_used text[] DEFAULT '{}',      -- fuentes que respondieron
  result_count integer DEFAULT 0,
  subject_id   uuid REFERENCES subjects(id) ON DELETE SET NULL, -- nullable, si viene de sesion
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Indice para reportes por usuario y fecha
CREATE INDEX IF NOT EXISTS idx_library_searches_user_id
  ON library_searches (user_id);

CREATE INDEX IF NOT EXISTS idx_library_searches_created_at
  ON library_searches (created_at DESC);

-- ─────────────────────────────────────────
-- RLS: saved_papers
-- Usuario ve y gestiona solo sus propios papers guardados
-- ─────────────────────────────────────────
ALTER TABLE saved_papers ENABLE ROW LEVEL SECURITY;

-- Lectura: solo los propios
CREATE POLICY "saved_papers_select_own"
  ON saved_papers FOR SELECT
  USING (auth.uid() = user_id);

-- Insercion: solo el propio usuario
CREATE POLICY "saved_papers_insert_own"
  ON saved_papers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Eliminacion: solo el propio usuario
CREATE POLICY "saved_papers_delete_own"
  ON saved_papers FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- RLS: library_searches
-- Cada usuario ve sus propias busquedas
-- Admin ve todas (para reportes SENESCYT)
-- ─────────────────────────────────────────
ALTER TABLE library_searches ENABLE ROW LEVEL SECURITY;

-- Insercion: cualquier usuario autenticado puede registrar su busqueda
CREATE POLICY "library_searches_insert_own"
  ON library_searches FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Lectura: usuario ve las suyas; admin/super_admin ven todas
CREATE POLICY "library_searches_select_own"
  ON library_searches FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'coordinacion')
    )
  );


-- ============================================
-- Migration: 009_forums.sql
-- ============================================

-- ============================================================
-- ITSEIA Academy — Foros de Discusion por Materia
-- Feature: 003-discussion-forums
-- Fecha: 2026-03-22
-- Requisito CES: Art. 61 RRA 2022 (comunicacion asincronica)
-- ============================================================

-- ============================================================
-- 1. FORUM_POSTS — Mensajes principales del foro
-- ============================================================

CREATE TABLE IF NOT EXISTS public.forum_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id  UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 5000),
  parent_id   UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  is_pinned   BOOLEAN NOT NULL DEFAULT false,
  is_deleted  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.forum_posts IS
  'Foros de discusion asincronica por materia. parent_id nulo = post raiz; no nulo = respuesta directa. Evidencia CES Art. 61 RRA 2022.';

COMMENT ON COLUMN public.forum_posts.parent_id IS
  'Referencia al post padre. NULL = post principal. Un nivel de anidacion (A2).';
COMMENT ON COLUMN public.forum_posts.is_deleted IS
  'Soft delete: el registro existe pero se oculta en la UI. Preserva historial para auditorias SENESCYT.';

CREATE INDEX IF NOT EXISTS idx_forum_posts_subject_id   ON public.forum_posts(subject_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_parent_id    ON public.forum_posts(parent_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id      ON public.forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at   ON public.forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_subject_pin  ON public.forum_posts(subject_id, is_pinned DESC, created_at DESC);

-- Trigger: actualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_forum_posts_updated_at ON public.forum_posts;
CREATE TRIGGER trg_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 2. FORUM_NOTIFICATIONS — Notificaciones in-app para docentes
-- ============================================================

CREATE TABLE IF NOT EXISTS public.forum_notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id     UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  subject_id  UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.forum_notifications IS
  'Notificaciones in-app cuando un estudiante publica en el foro. Destinatario: docente asignado.';

CREATE INDEX IF NOT EXISTS idx_forum_notif_user_id   ON public.forum_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_notif_is_read   ON public.forum_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_forum_notif_post_id   ON public.forum_notifications(post_id);

-- ============================================================
-- 3. RLS — forum_posts
-- ============================================================

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- SELECT: matriculado en el programa que contiene la materia, o docente asignado, o admin
CREATE POLICY "foro_select_participantes" ON public.forum_posts
  FOR SELECT USING (
    -- Admin / coordinacion / super_admin ven todo
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin', 'coordinacion', 'finanzas')
    )
    OR
    -- Docente asignado a esta materia
    EXISTS (
      SELECT 1 FROM public.subjects s
      WHERE s.id = forum_posts.subject_id
        AND s.teacher_id = auth.uid()
    )
    OR
    -- Estudiante matriculado activo en el programa que contiene esta materia
    EXISTS (
      SELECT 1
      FROM public.subjects s
      JOIN public.semesters sem ON sem.id = s.semester_id
      JOIN public.enrollments e  ON e.program_id = sem.program_id
      WHERE s.id = forum_posts.subject_id
        AND e.user_id = auth.uid()
        AND e.status = 'active'
    )
  );

-- INSERT: solo estudiantes matriculados o docente asignado (no admins directamente)
CREATE POLICY "foro_insert_participantes" ON public.forum_posts
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND (
      -- Docente asignado
      EXISTS (
        SELECT 1 FROM public.subjects s
        WHERE s.id = forum_posts.subject_id
          AND s.teacher_id = auth.uid()
      )
      OR
      -- Estudiante matriculado activo
      EXISTS (
        SELECT 1
        FROM public.subjects s
        JOIN public.semesters sem ON sem.id = s.semester_id
        JOIN public.enrollments e  ON e.program_id = sem.program_id
        WHERE s.id = forum_posts.subject_id
          AND e.user_id = auth.uid()
          AND e.status = 'active'
      )
      OR
      -- Admin puede publicar tambien
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
          AND p.role IN ('super_admin', 'admin', 'coordinacion')
      )
    )
  );

-- UPDATE: autor puede actualizar su propio contenido; docente/admin pueden cambiar is_pinned e is_deleted
CREATE POLICY "foro_update_owner_o_docente" ON public.forum_posts
  FOR UPDATE USING (
    -- Autor propio (puede editar contenido)
    user_id = auth.uid()
    OR
    -- Docente asignado a la materia (puede fijar / soft-delete)
    EXISTS (
      SELECT 1 FROM public.subjects s
      WHERE s.id = forum_posts.subject_id
        AND s.teacher_id = auth.uid()
    )
    OR
    -- Admin siempre
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- DELETE: solo admins pueden hacer hard delete (normalmente usamos is_deleted)
CREATE POLICY "foro_delete_admin" ON public.forum_posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin')
    )
  );

-- ============================================================
-- 4. RLS — forum_notifications
-- ============================================================

ALTER TABLE public.forum_notifications ENABLE ROW LEVEL SECURITY;

-- Cada usuario ve solo sus propias notificaciones
CREATE POLICY "notif_select_propio" ON public.forum_notifications
  FOR SELECT USING (user_id = auth.uid());

-- Admin ve todas
CREATE POLICY "notif_select_admin" ON public.forum_notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- INSERT via service role (API routes con supabaseAdmin bypasan RLS)
-- Solo admins o el propio sistema pueden insertar
CREATE POLICY "notif_insert_admin" ON public.forum_notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- Cada usuario puede marcar sus propias notificaciones como leidas
CREATE POLICY "notif_update_propio" ON public.forum_notifications
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- 5. REALTIME — habilitar para forum_posts
-- ============================================================

-- Habilitar Realtime publication en forum_posts para suscripciones por canal
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;

-- ============================================================
-- 6. FUNCION AUXILIAR: get_forum_metrics
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_forum_metrics(p_subject_id UUID)
RETURNS TABLE (
  subject_id          UUID,
  total_posts         BIGINT,
  total_replies       BIGINT,
  unique_authors      BIGINT,
  last_post_at        TIMESTAMPTZ,
  is_inactive         BOOLEAN
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT
    p_subject_id                                                AS subject_id,
    COUNT(*) FILTER (WHERE parent_id IS NULL AND NOT is_deleted) AS total_posts,
    COUNT(*) FILTER (WHERE parent_id IS NOT NULL AND NOT is_deleted) AS total_replies,
    COUNT(DISTINCT user_id) FILTER (WHERE NOT is_deleted)       AS unique_authors,
    MAX(created_at)                                             AS last_post_at,
    (MAX(created_at) < now() - INTERVAL '7 days'
      OR MAX(created_at) IS NULL)                              AS is_inactive
  FROM public.forum_posts
  WHERE subject_id = p_subject_id;
$$;

COMMENT ON FUNCTION public.get_forum_metrics IS
  'Metricas de participacion de foro por materia. Usado en panel admin para evidencia SENESCYT.';


-- ============================================
-- Migration: 010_attendance_extended.sql
-- ============================================

-- ============================================================
-- ITSEIA Academy — Asistencia Extendida (Spec 007)
-- Feature: 007-attendance-tracking
-- Fecha: 2026-03-22
-- Extiende spec 002-sync-videoconference con:
--   - is_test_session en live_sessions
--   - tabla absence_alerts
--   - vistas v_attendance_summary y v_subject_sync_compliance
--   - indices adicionales para performance
-- ============================================================

-- ============================================================
-- 1. Extender live_sessions con flag de sesion de prueba
-- ============================================================

ALTER TABLE public.live_sessions
  ADD COLUMN IF NOT EXISTS is_test_session BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.live_sessions.is_test_session IS
  'Si es true, esta sesion no se computa en los reportes de cumplimiento SENESCYT.';

-- ============================================================
-- 2. Indices adicionales en attendance para performance de reportes
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_attendance_user_session
  ON public.attendance(user_id, live_session_id);

CREATE INDEX IF NOT EXISTS idx_attendance_status
  ON public.attendance(status);

-- ============================================================
-- 3. ABSENCE_ALERTS — Alertas de inasistencia acumulada > 30%
-- ============================================================

CREATE TABLE IF NOT EXISTS public.absence_alerts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id          UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  student_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  alert_threshold     DECIMAL(5,2) NOT NULL DEFAULT 30.00,
  sessions_absent     INTEGER NOT NULL DEFAULT 0,
  total_sessions      INTEGER NOT NULL DEFAULT 0,
  absence_percentage  DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  acknowledged_at     TIMESTAMPTZ,
  acknowledged_by     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Una alerta activa por estudiante por materia (sin acknowledged_at)
  -- Se puede insertar nueva alerta cuando se reconoce la anterior
  CONSTRAINT absence_alerts_subject_student_unique
    UNIQUE (subject_id, student_id, created_at)
);

COMMENT ON TABLE public.absence_alerts IS
  'Alertas automaticas de inasistencia acumulada > 30% por estudiante y materia. Evidencia para docente y coordinacion.';

CREATE INDEX IF NOT EXISTS idx_absence_alerts_subject
  ON public.absence_alerts(subject_id);

CREATE INDEX IF NOT EXISTS idx_absence_alerts_student
  ON public.absence_alerts(student_id);

CREATE INDEX IF NOT EXISTS idx_absence_alerts_unacknowledged
  ON public.absence_alerts(subject_id, acknowledged_at)
  WHERE acknowledged_at IS NULL;

ALTER TABLE public.absence_alerts ENABLE ROW LEVEL SECURITY;

-- Docentes y admins pueden ver alertas
CREATE POLICY "Docentes y admins ven alertas de inasistencia" ON public.absence_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion', 'docente')
    )
  );

-- Solo el service role (backend) inserta alertas automaticamente
-- Admins pueden insertar manualmente
CREATE POLICY "Admins insertan alertas de inasistencia" ON public.absence_alerts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- Docentes y admins pueden actualizar (para marcar acknowledged_at)
CREATE POLICY "Docentes y admins actualizan alertas" ON public.absence_alerts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin', 'admin', 'coordinacion', 'docente')
    )
  );

-- ============================================================
-- 4. VISTA: v_attendance_summary
-- Resume asistencia por estudiante y materia para el periodo activo
-- Uso: reportes docente/admin, alertas, exportacion SENESCYT
-- ============================================================

CREATE OR REPLACE VIEW public.v_attendance_summary AS
SELECT
  p.id                                        AS student_id,
  p.full_name                                 AS student_name,
  p.email                                     AS student_email,
  sub.id                                      AS subject_id,
  sub.code                                    AS subject_code,
  sub.name                                    AS subject_name,
  COUNT(DISTINCT ls.id)                       AS total_sessions,
  COUNT(DISTINCT CASE
    WHEN a.status = 'present'
      THEN ls.id
    END)                                      AS sessions_present,
  COUNT(DISTINCT CASE
    WHEN a.status = 'partial'
      THEN ls.id
    END)                                      AS sessions_partial,
  COUNT(DISTINCT CASE
    WHEN a.status = 'absent' OR a.id IS NULL
      THEN ls.id
    END)                                      AS sessions_absent,
  CASE
    WHEN COUNT(DISTINCT ls.id) = 0 THEN 0
    ELSE ROUND(
      (
        COUNT(DISTINCT CASE WHEN a.status = 'present' THEN ls.id END)::DECIMAL
        + (COUNT(DISTINCT CASE WHEN a.status = 'partial' THEN ls.id END)::DECIMAL * 0.5)
      ) / COUNT(DISTINCT ls.id)::DECIMAL * 100,
      2
    )
  END                                         AS attendance_percentage
FROM public.profiles p
JOIN public.enrollments e
  ON e.user_id = p.id AND e.status = 'active'
JOIN public.semesters sem
  ON sem.program_id = e.program_id
JOIN public.subjects sub
  ON sub.semester_id = sem.id AND sub.is_active = true
JOIN public.sessions sess
  ON sess.subject_id = sub.id AND sess.is_active = true
JOIN public.live_sessions ls
  ON ls.session_id = sess.id
  AND ls.is_test_session = false
  AND ls.ended_at IS NOT NULL
LEFT JOIN public.attendance a
  ON a.live_session_id = ls.id
  AND a.user_id = p.id
WHERE p.role = 'estudiante'
GROUP BY
  p.id,
  p.full_name,
  p.email,
  sub.id,
  sub.code,
  sub.name;

COMMENT ON VIEW public.v_attendance_summary IS
  'Resumen de asistencia por estudiante y materia. Excluye sesiones de prueba. Base para reportes SENESCYT.';

-- ============================================================
-- 5. VISTA: v_subject_sync_compliance
-- Cumplimiento del 51% sincronico por materia (Art. 61 RRA 2022)
-- Uso: dashboard admin, exportacion CES
-- ============================================================

CREATE OR REPLACE VIEW public.v_subject_sync_compliance AS
SELECT
  sub.id                                        AS subject_id,
  sub.code                                      AS subject_code,
  sub.name                                      AS subject_name,
  sem.number                                    AS semester_number,
  prog.id                                       AS program_id,
  prog.name                                     AS program_name,
  prog.career_code                              AS career_code,
  COUNT(DISTINCT sess.id)                       AS total_sessions_planned,
  COUNT(DISTINCT CASE
    WHEN ls.ended_at IS NOT NULL
      AND ls.is_test_session = false
      THEN sess.id
    END)                                        AS total_sessions_with_live,
  CASE
    WHEN COUNT(DISTINCT sess.id) = 0 THEN 0
    ELSE ROUND(
      COUNT(DISTINCT CASE
        WHEN ls.ended_at IS NOT NULL
          AND ls.is_test_session = false
          THEN sess.id
        END)::DECIMAL
      / COUNT(DISTINCT sess.id)::DECIMAL * 100,
      2
    )
  END                                           AS sync_compliance_pct,
  CASE
    WHEN COUNT(DISTINCT sess.id) = 0 THEN false
    ELSE (
      COUNT(DISTINCT CASE
        WHEN ls.ended_at IS NOT NULL
          AND ls.is_test_session = false
          THEN sess.id
        END)::DECIMAL
      / COUNT(DISTINCT sess.id)::DECIMAL
    ) >= 0.51
  END                                           AS meets_ces_requirement
FROM public.subjects sub
JOIN public.semesters sem ON sem.id = sub.semester_id
JOIN public.programs prog ON prog.id = sem.program_id
LEFT JOIN public.sessions sess
  ON sess.subject_id = sub.id AND sess.is_active = true
LEFT JOIN public.live_sessions ls
  ON ls.session_id = sess.id
WHERE sub.is_active = true
GROUP BY
  sub.id,
  sub.code,
  sub.name,
  sem.number,
  prog.id,
  prog.name,
  prog.career_code;

COMMENT ON VIEW public.v_subject_sync_compliance IS
  'Cumplimiento del 51% de creditos sincronicos por materia. Evidencia directa para Art. 61 RRA 2022 y Reglamento IST 2023.';

-- ============================================================
-- ITSEIA Academy — Feature 011: Modulo Docente Completo
-- Migration 013: teacher_training, announcements, analytics
-- CES Compliance: Art. 61 RRA 2022 (120h formacion docente)
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. EXTEND programs table to support teacher_training type
-- ──────────────────────────────────────────────────────────

-- Drop and recreate the type check constraint to add 'teacher_training'
DO $$
BEGIN
  -- Drop existing check constraint on programs.type if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'programs_type_check'
      AND table_name = 'programs'
  ) THEN
    ALTER TABLE programs DROP CONSTRAINT programs_type_check;
  END IF;

  -- Add updated constraint with teacher_training
  ALTER TABLE programs
    ADD CONSTRAINT programs_type_check
    CHECK (type IN ('carrera', 'curso', 'preuni', 'bootcamp', 'teacher_training'));
END;
$$;

-- ──────────────────────────────────────────────────────────
-- 2. TEACHER TRAINING PROGRESS
--    One row per (teacher, session) in the training program.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_training_progress (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id    uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  completed_at  timestamptz NOT NULL DEFAULT now(),
  hours_credited decimal(5,2) NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_training_progress_teacher
  ON teacher_training_progress(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_training_progress_session
  ON teacher_training_progress(session_id);

ALTER TABLE teacher_training_progress ENABLE ROW LEVEL SECURITY;

-- Docente solo puede ver/insertar sus propios registros
CREATE POLICY "teacher_training_progress_select_own"
  ON teacher_training_progress FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_training_progress_insert_own"
  ON teacher_training_progress FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "teacher_training_progress_admin_all"
  ON teacher_training_progress FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- ──────────────────────────────────────────────────────────
-- 3. TEACHER CERTIFICATES
--    One row per teacher when they reach 120h.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_certificates (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_hours     decimal(6,2) NOT NULL,
  certificate_url text,
  certified_at    timestamptz NOT NULL DEFAULT now(),
  is_valid        boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (teacher_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_certificates_teacher
  ON teacher_certificates(teacher_id);

ALTER TABLE teacher_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_certificates_select"
  ON teacher_certificates FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_certificates_admin_all"
  ON teacher_certificates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- ──────────────────────────────────────────────────────────
-- 4. TEACHER EXTERNAL HOURS
--    Horas de capacitacion externas validadas manualmente.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_external_hours (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hours        decimal(5,2) NOT NULL CHECK (hours > 0),
  description  text NOT NULL,
  validated_by uuid REFERENCES profiles(id),
  validated_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_external_hours_teacher
  ON teacher_external_hours(teacher_id);

ALTER TABLE teacher_external_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_external_hours_select"
  ON teacher_external_hours FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_external_hours_admin_write"
  ON teacher_external_hours FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_external_hours_admin_update"
  ON teacher_external_hours FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- ──────────────────────────────────────────────────────────
-- 5. ASSIGNMENT RUBRICS
--    Criterios de evaluacion con pesos (sum = 100%).
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assignment_rubrics (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id  uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  criterion_name text NOT NULL,
  description    text,
  weight_percent decimal(5,2) NOT NULL CHECK (weight_percent > 0 AND weight_percent <= 100),
  order_index    int NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assignment_rubrics_assignment
  ON assignment_rubrics(assignment_id);

ALTER TABLE assignment_rubrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assignment_rubrics_select"
  ON assignment_rubrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN sessions s ON s.id = a.session_id
      JOIN subjects sub ON sub.id = s.subject_id
      WHERE a.id = assignment_rubrics.assignment_id
        AND (
          sub.teacher_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
              AND role IN ('super_admin','admin','coordinacion')
          )
          OR EXISTS (
            SELECT 1 FROM enrollments e
            JOIN semesters sem ON sem.id = sub.semester_id
            WHERE e.user_id = auth.uid()
              AND e.program_id = sem.program_id
              AND e.status = 'active'
          )
        )
    )
  );

CREATE POLICY "assignment_rubrics_teacher_write"
  ON assignment_rubrics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN sessions s ON s.id = a.session_id
      JOIN subjects sub ON sub.id = s.subject_id
      WHERE a.id = assignment_rubrics.assignment_id
        AND (
          sub.teacher_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
              AND role IN ('super_admin','admin','coordinacion')
          )
        )
    )
  );

-- ──────────────────────────────────────────────────────────
-- 6. TEACHER INTERVENTIONS
--    Notas de seguimiento privadas (docente -> estudiante).
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_interventions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id  uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  note_text   text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teacher_interventions_student
  ON teacher_interventions(student_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_teacher_interventions_teacher
  ON teacher_interventions(teacher_id);

ALTER TABLE teacher_interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_interventions_select"
  ON teacher_interventions FOR SELECT
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_interventions_insert"
  ON teacher_interventions FOR INSERT
  WITH CHECK (
    auth.uid() = teacher_id
    AND EXISTS (
      SELECT 1 FROM subjects
      WHERE id = subject_id
        AND teacher_id = auth.uid()
    )
  );

-- ──────────────────────────────────────────────────────────
-- 7. ANNOUNCEMENTS
--    Anuncios de docente para estudiantes de una materia.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id    uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title         text NOT NULL,
  body_markdown text NOT NULL,
  published_at  timestamptz NOT NULL DEFAULT now(),
  is_archived   boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_subject
  ON announcements(subject_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_teacher
  ON announcements(teacher_id);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Docente de la materia puede ver y escribir sus anuncios
CREATE POLICY "announcements_teacher_all"
  ON announcements FOR ALL
  USING (
    auth.uid() = teacher_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- Estudiantes matriculados pueden leer los no archivados
CREATE POLICY "announcements_student_select"
  ON announcements FOR SELECT
  USING (
    NOT is_archived
    AND EXISTS (
      SELECT 1 FROM enrollments e
      JOIN semesters sem ON sem.id = (
        SELECT semester_id FROM subjects WHERE id = announcements.subject_id
      )
      WHERE e.user_id = auth.uid()
        AND e.program_id = sem.program_id
        AND e.status = 'active'
    )
  );

-- ──────────────────────────────────────────────────────────
-- 8. ANNOUNCEMENT READS
--    Tracking de qué estudiante leyó cada anuncio.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS announcement_reads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  read_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (announcement_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_announcement_reads_user
  ON announcement_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_announcement_reads_announcement
  ON announcement_reads(announcement_id);

ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "announcement_reads_own"
  ON announcement_reads FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "announcement_reads_teacher_select"
  ON announcement_reads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM announcements a
      WHERE a.id = announcement_reads.announcement_id
        AND (
          a.teacher_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
              AND role IN ('super_admin','admin','coordinacion')
          )
        )
    )
  );

-- ──────────────────────────────────────────────────────────
-- 9. DIRECT MESSAGES
--    Mensajes privados docente <-> estudiante.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS direct_messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id   uuid REFERENCES subjects(id) ON DELETE SET NULL,
  body         text NOT NULL,
  sent_at      timestamptz NOT NULL DEFAULT now(),
  read_at      timestamptz
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient
  ON direct_messages(recipient_id, read_at);
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender
  ON direct_messages(sender_id);

ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "direct_messages_select"
  ON direct_messages FOR SELECT
  USING (
    auth.uid() = sender_id
    OR auth.uid() = recipient_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "direct_messages_insert"
  ON direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "direct_messages_update_read"
  ON direct_messages FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- ──────────────────────────────────────────────────────────
-- 10. SEED: Programa de Capacitacion Docente 120h
--     "Docencia Virtual Efectiva" — program_type = teacher_training
-- ──────────────────────────────────────────────────────────

DO $$
DECLARE
  v_program_id  uuid;
  v_semester_id uuid;
  subj_ids      uuid[] := ARRAY[]::uuid[];
  subj_id       uuid;
  sess_id       uuid;

  -- Module definitions: (order, code, name, hours, description)
  modules text[][] := ARRAY[
    ARRAY['1','CAP101','Fundamentos de la Educacion Virtual y el Marco CES','12',
          'Principios de la educacion en linea, marco normativo CES Ecuador, Art. 61 RRA 2022, modalidades de aprendizaje virtual y roles del docente en entornos digitales.'],
    ARRAY['2','CAP102','Uso Efectivo del LMS ITSEIA (Navegacion y Contenido)','16',
          'Navegacion completa del campus ITSEIA: crear sesiones, subir video y teoria, gestionar quizzes, revisar entregas y usar el AI Lab como docente.'],
    ARRAY['3','CAP103','Diseno de Contenido Interactivo y Evaluaciones Online','20',
          'Estrategias de diseno instruccional para entornos virtuales: microlearning, contenido multimedia, rubricas de evaluacion, quizzes adaptativos y feedback efectivo.'],
    ARRAY['4','CAP104','Facilitacion de Clases Sincronicas con Videoconferencia','14',
          'Tecnicas de facilitacion en videoconferencia: dinámicas de participacion, control del aula virtual, gestion del tiempo, grabacion de clases y seguimiento post-sesion.'],
    ARRAY['5','CAP105','Evaluacion Formativa y Retroalimentacion Efectiva','16',
          'Diseno de evaluaciones continuas, retroalimentacion constructiva por escrito, criterios de calificacion transparentes, prevencion del plagio y etica academica online.'],
    ARRAY['6','CAP106','Seguimiento del Progreso Estudiantil y Tutoria Virtual','14',
          'Uso de analytics del LMS para identificar estudiantes en riesgo, estrategias de intervencion temprana, comunicacion proactiva y documentacion de tutoria virtual.'],
    ARRAY['7','CAP107','Inteligencia Artificial como Herramienta Pedagogica','16',
          'Aplicaciones practicas de IA generativa (ChatGPT, Claude, Gemini) para preparar clases, crear ejercicios, personalizar contenido y dar retroalimentacion automatizada.'],
    ARRAY['8','CAP108','Etica, Privacidad y Normativa en la Educacion Online','12',
          'Proteccion de datos personales (LOPDP Ecuador), derechos de autor en contenido digital, accesibilidad e inclusion, etica en el uso de IA y politicas institucionales ITSEIA.']
  ];

  -- Sessions per module (3 sessions each): (order, title, description)
  sess_defs text[][][] := ARRAY[
    -- Module 1
    ARRAY[
      ARRAY['1','Paradigmas de la Educacion Virtual','Historia, modelos y evidencia de efectividad de la educacion en linea. Diferencias con modalidad presencial.'],
      ARRAY['2','Marco Normativo CES para Modalidad en Linea','Art. 57, 61, 62 RRA 2022. Requisitos de horas sincronicas, contenido y capacitacion docente.'],
      ARRAY['3','El Rol del Docente Virtual Efectivo','Competencias digitales, gestion del tiempo, comunicacion asincronica y presencia docente online.']
    ],
    -- Module 2
    ARRAY[
      ARRAY['1','Navegacion y Configuracion del Campus','Tour completo del LMS ITSEIA: dashboard, materias, sesiones, herramientas del docente.'],
      ARRAY['2','Creacion y Edicion de Sesiones Academicas','Subir video, presentacion, teoria markdown, configurar quiz y ejercicio. Indicadores de calidad CES.'],
      ARRAY['3','Gestion de Entregas y Retroalimentacion','Panel de entregas, calificacion, feedback escrito, seguimiento del progreso estudiantil en el LMS.']
    ],
    -- Module 3
    ARRAY[
      ARRAY['1','Principios de Diseno Instruccional para e-Learning','Modelo ADDIE adaptado a entornos virtuales. Objetivos de aprendizaje verificables y alineacion curricular.'],
      ARRAY['2','Creacion de Contenido Multimedia Efectivo','Video educativo de calidad, presentaciones interactivas, teoria estructurada en markdown. Estandar 1500 palabras.'],
      ARRAY['3','Evaluaciones Online y Rubricas de Calificacion','Tipos de evaluacion, diseno de quizzes anti-trampa, rubricas con criterios y pesos, feedback automatizado.']
    ],
    -- Module 4
    ARRAY[
      ARRAY['1','Configuracion Tecnica de Videoconferencia','Setup de camara, microfono, fondo virtual. Herramientas de participacion: sondeos, salas de trabajo, pizarra.'],
      ARRAY['2','Facilitacion Activa en Clase Sincronica','Tecnicas para mantener atencion, dinamicas de participacion, manejo de imprevistos tecnicos, cierre efectivo.'],
      ARRAY['3','Grabacion, Edicion y Publicacion de Clases','Flujo de trabajo: grabar, editar lo esencial, subir a YouTube privado, vincular en el LMS para clase asincronica.']
    ],
    -- Module 5
    ARRAY[
      ARRAY['1','Evaluacion Continua y Aprendizaje Formativo','Diferencia evaluacion formativa vs sumativa. Estrategias de check-in rapido: exit tickets, kahoot, quizzes cortos.'],
      ARRAY['2','Retroalimentacion Escrita de Alto Impacto','Modelo SBI (Situacion-Comportamiento-Impacto). Feedback especifico, accionable y oportuno por plataforma.'],
      ARRAY['3','Integridad Academica en Entornos Digitales','Prevencion del plagio, configuracion de deteccion en quizzes, politica de integridad ITSEIA, consecuencias.']
    ],
    -- Module 6
    ARRAY[
      ARRAY['1','Lectura de Analytics del LMS','Interpretar reportes de progreso, tasas de completitud, tiempo en sesion y patrones de acceso de los estudiantes.'],
      ARRAY['2','Identificacion Temprana de Estudiantes en Riesgo','Criterios de riesgo: 30% sesiones incompletas, quiz promedio menor 60%, 2+ inasistencias consecutivas. Protocolo de intervencion.'],
      ARRAY['3','Comunicacion y Tutoria Virtual Proactiva','Mensajes de seguimiento efectivos, frecuencia recomendada, registro de intervenciones, escalacion a coordinacion.']
    ],
    -- Module 7
    ARRAY[
      ARRAY['1','Fundamentos de IA Generativa para Docentes','Como funcionan LLMs (ChatGPT, Claude, Gemini). Prompt engineering basico aplicado a preparacion de clases.'],
      ARRAY['2','IA para Creacion de Contenido Educativo','Prompts para generar quizzes, ejercicios, resumenes, casos de estudio y retroalimentacion personalizada.'],
      ARRAY['3','IA para Personalizacion y Seguimiento','Usar IA para analizar respuestas de estudiantes, identificar patrones de error, sugerir recursos adicionales.']
    ],
    -- Module 8
    ARRAY[
      ARRAY['1','Proteccion de Datos en la Educacion Online','LOPDP Ecuador: datos que se recopilan en el LMS, derechos de los estudiantes, politica de privacidad ITSEIA.'],
      ARRAY['2','Derechos de Autor y Contenido Digital','Creative Commons, uso justo, citar correctamente, crear contenido original vs curado, politica de copyright.'],
      ARRAY['3','Accesibilidad, Inclusion y Etica Docente','Diseno universal para el aprendizaje, subtitulos en videos, texto alternativo, conducta etica en entornos digitales.']
    ]
  ];

BEGIN
  -- Check if already seeded
  IF EXISTS (
    SELECT 1 FROM programs WHERE slug = 'docencia-virtual-efectiva'
  ) THEN
    RAISE NOTICE 'Teacher training program already seeded, skipping.';
    RETURN;
  END IF;

  -- Create the training program
  INSERT INTO programs (
    id, name, slug, description, type, price, duration_months,
    is_active, total_semesters
  ) VALUES (
    gen_random_uuid(),
    'Docencia Virtual Efectiva',
    'docencia-virtual-efectiva',
    'Programa de capacitacion de 120 horas para docentes de modalidad en linea. Requisito Art. 61 RRA 2022 (CES Ecuador). Cubre fundamentos pedagogicos, uso del LMS ITSEIA, diseno de contenido, facilitacion sincronica, evaluacion, tutoria virtual e inteligencia artificial aplicada a la docencia.',
    'teacher_training',
    0,
    3,
    true,
    1
  ) RETURNING id INTO v_program_id;

  -- Create 1 semester
  INSERT INTO semesters (
    id, program_id, number, name, level, is_active
  ) VALUES (
    gen_random_uuid(),
    v_program_id,
    1,
    'Capacitacion Completa 120h',
    'professional',
    true
  ) RETURNING id INTO v_semester_id;

  -- Create 8 subjects (one per module)
  FOR i IN 1..8 LOOP
    INSERT INTO subjects (
      id, semester_id, code, name, slug,
      description, credit_hours,
      hours_docencia, hours_practica, hours_autonomo, hours_total,
      order_index, is_active
    ) VALUES (
      gen_random_uuid(),
      v_semester_id,
      modules[i][2],
      modules[i][3],
      lower(replace(replace(modules[i][3], ' ', '-'), '/', '-')),
      modules[i][5],
      0,
      modules[i][4]::int / 2,
      modules[i][4]::int / 4,
      modules[i][4]::int / 4,
      modules[i][4]::int,
      i,
      true
    ) RETURNING id INTO subj_id;

    subj_ids := array_append(subj_ids, subj_id);

    -- Create 3 sessions per module
    FOR j IN 1..3 LOOP
      INSERT INTO sessions (
        id, subject_id, number, title, description,
        theory_markdown, estimated_duration_minutes,
        order_index, is_active
      ) VALUES (
        gen_random_uuid(),
        subj_id,
        j,
        sess_defs[i][j][2],
        sess_defs[i][j][3],
        '# ' || sess_defs[i][j][2] || E'\n\n' ||
        sess_defs[i][j][3] || E'\n\n' ||
        '## Contenido en Desarrollo' || E'\n\n' ||
        'El equipo de coordinacion academica de ITSEIA esta completando el contenido de este modulo. ' ||
        'Podras acceder al material completo proximamente.' || E'\n\n' ||
        '## Objetivo de Aprendizaje' || E'\n\n' ||
        'Al completar esta sesion podras aplicar los conceptos de **' || sess_defs[i][j][2] ||
        '** en tu practica docente dentro del campus ITSEIA.' || E'\n\n' ||
        '## Actividades Sugeridas Mientras Tanto' || E'\n\n' ||
        '- Revisa la documentacion oficial del campus en la seccion de ayuda.' || E'\n' ||
        '- Explora las materias de ejemplo disponibles en tu panel docente.' || E'\n' ||
        '- Comparte dudas con el coordinador academico por WhatsApp: +593 95 989 2034',
        modules[i][4]::int * 20 / 3,
        j,
        true
      ) RETURNING id INTO sess_id;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Teacher training program seeded successfully. Program ID: %', v_program_id;
END;
$$;
