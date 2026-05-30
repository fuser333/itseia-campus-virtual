-- ============================================================
-- ITSEIA Academy — Migration 015: Teacher Platform (Vista Espejo)
-- Feature: vista del docente como espejo del alumno + 4 capas extras
-- (proposito + metodologia, respuestas modelo, notas privadas, resumen video IA)
-- Aislamiento blindado: si /teacher se rompe, /preuni y /carreras NO se afectan.
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. session_teaching_meta
--    Una fila por sesion: metadatos pedagogicos (Bloom + Kolb + Sweller).
--    Fuente: METODOLOGIA_POR_SESION.json del proyecto Docentes (FASE 2).
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS session_teaching_meta (
  session_id            uuid PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
  proposito             text NOT NULL,
  objetivos_bloom       jsonb NOT NULL DEFAULT '[]'::jsonb,
  habilidades           text[] NOT NULL DEFAULT '{}',
  metodologia           jsonb NOT NULL DEFAULT '{}'::jsonb,
  ejercicio_modelo      jsonb,
  errores_tipicos       jsonb,
  intervencion_docente  text,
  transferencia_real    text,
  fuentes               text[] NOT NULL DEFAULT '{}',
  updated_at            timestamptz NOT NULL DEFAULT now(),
  updated_by            uuid REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_session_teaching_meta_updated_by
  ON session_teaching_meta(updated_by);

ALTER TABLE session_teaching_meta ENABLE ROW LEVEL SECURITY;

-- Docente / coordinacion / admin / super_admin LEEN
CREATE POLICY "stm_select_staff"
  ON session_teaching_meta FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion','docente')
    )
  );

-- Solo coordinacion / admin / super_admin ESCRIBEN (docente no edita metodologia)
CREATE POLICY "stm_write_admin"
  ON session_teaching_meta FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "stm_update_admin"
  ON session_teaching_meta FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "stm_delete_admin"
  ON session_teaching_meta FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin')
    )
  );

-- ──────────────────────────────────────────────────────────
-- 2. video_summaries
--    Resumen IA del video de cada sesion (YouTube Transcript + Kimi).
--    Cacheado: una sola generacion por (session_id, video_url).
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS video_summaries (
  session_id    uuid PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
  video_url     text NOT NULL,
  resumen_md    text NOT NULL,
  timestamps    jsonb DEFAULT '[]'::jsonb,
  generado_at   timestamptz NOT NULL DEFAULT now(),
  modelo        text NOT NULL DEFAULT 'kimi-moonshot-v1-32k'
);

ALTER TABLE video_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "video_summaries_select_staff"
  ON video_summaries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion','docente')
    )
  );

CREATE POLICY "video_summaries_write_admin"
  ON video_summaries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "video_summaries_update_admin"
  ON video_summaries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

-- ──────────────────────────────────────────────────────────
-- 3. teacher_notes
--    Notas privadas del docente sobre una sesion.
--    Una nota por (teacher_id, session_id). Cada docente ve solo las suyas.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_notes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id    uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  nota_md       text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_notes_teacher ON teacher_notes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_notes_session ON teacher_notes(session_id);

ALTER TABLE teacher_notes ENABLE ROW LEVEL SECURITY;

-- Solo el dueño de la nota la ve/escribe (admins tambien pueden leer para auditoria)
CREATE POLICY "teacher_notes_select_own_or_admin"
  ON teacher_notes FOR SELECT
  USING (
    teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin')
    )
  );

CREATE POLICY "teacher_notes_insert_own"
  ON teacher_notes FOR INSERT
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "teacher_notes_update_own"
  ON teacher_notes FOR UPDATE
  USING (teacher_id = auth.uid());

CREATE POLICY "teacher_notes_delete_own"
  ON teacher_notes FOR DELETE
  USING (teacher_id = auth.uid());

-- ──────────────────────────────────────────────────────────
-- 4. teacher_assignments
--    Asignacion de docentes a materias (permite multi-docente por materia,
--    util para carreras futuras donde una materia tiene titular + asistente).
--    subjects ya tiene teacher_id (titular unico) — esta tabla lo extiende.
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teacher_assignments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id    uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  rol           text NOT NULL DEFAULT 'titular'
                  CHECK (rol IN ('titular','asistente','invitado')),
  asignado_at   timestamptz NOT NULL DEFAULT now(),
  asignado_por  uuid REFERENCES auth.users(id),
  UNIQUE (teacher_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_assignments_teacher
  ON teacher_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_assignments_subject
  ON teacher_assignments(subject_id);

ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_assignments_select_staff"
  ON teacher_assignments FOR SELECT
  USING (
    teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_assignments_write_admin"
  ON teacher_assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_assignments_update_admin"
  ON teacher_assignments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin','coordinacion')
    )
  );

CREATE POLICY "teacher_assignments_delete_admin"
  ON teacher_assignments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('super_admin','admin')
    )
  );

-- ──────────────────────────────────────────────────────────
-- 5. Trigger: updated_at automatico
-- ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_stm_updated_at ON session_teaching_meta;
CREATE TRIGGER trg_stm_updated_at
  BEFORE UPDATE ON session_teaching_meta
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS trg_tn_updated_at ON teacher_notes;
CREATE TRIGGER trg_tn_updated_at
  BEFORE UPDATE ON teacher_notes
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
