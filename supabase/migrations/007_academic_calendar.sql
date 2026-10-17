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
