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
