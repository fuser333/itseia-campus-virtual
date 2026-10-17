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
