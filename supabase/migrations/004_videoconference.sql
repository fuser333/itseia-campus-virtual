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
