-- ============================================================
-- ITSEIA Academy — Migration 014: Tabla recordings (YouTube)
-- Grabaciones de clases para todos los módulos del campus
-- Aplica a: carrera, bootcamp, curso_mdt, curso_pro, demo, cert
-- ============================================================

CREATE TABLE IF NOT EXISTS recordings (
  id                uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Para módulos non-carrera: tipo y slug del módulo
  module_type       text         DEFAULT NULL CHECK (
    module_type IS NULL OR module_type IN ('carrera', 'bootcamp', 'curso_mdt', 'curso_pro', 'certificacion', 'preuni', 'demo')
  ),
  module_slug       text         DEFAULT NULL,
  -- session_id: UUID de sesión (para carreras) o número de sesión como texto
  session_id        text         NOT NULL,
  youtube_url       text         NOT NULL,
  youtube_id        text         NOT NULL,
  title             text         NOT NULL,
  description       text         NOT NULL DEFAULT '',
  duration_seconds  integer      NOT NULL DEFAULT 0,
  recorded_at       timestamptz  DEFAULT now(),
  created_at        timestamptz  NOT NULL DEFAULT now()
);

-- Índice principal: buscar grabaciones por sesión (UUID o texto)
CREATE INDEX IF NOT EXISTS recordings_session_idx
  ON recordings (session_id);

-- Índice para búsqueda por módulo + sesión (cursos no-carrera)
CREATE INDEX IF NOT EXISTS recordings_lookup_idx
  ON recordings (module_type, module_slug, session_id);

-- Índice para la vista de historial (ordenado por fecha)
CREATE INDEX IF NOT EXISTS recordings_recorded_at_idx
  ON recordings (recorded_at DESC);

-- ── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;

-- Lectura: cualquier usuario autenticado puede ver grabaciones
CREATE POLICY "recordings_read_authenticated"
  ON recordings
  FOR SELECT
  TO authenticated
  USING (true);

-- ── Comentarios de documentación ─────────────────────────────────────────────

COMMENT ON TABLE recordings IS
  'Grabaciones de clases en YouTube para todos los módulos del campus ITSEIA. '
  'Para carreras: session_id = UUID de sessions. '
  'Para otros módulos: module_type + module_slug + session_id (texto).';

COMMENT ON COLUMN recordings.youtube_id IS
  'ID de 11 caracteres del video en YouTube.';

COMMENT ON COLUMN recordings.duration_seconds IS
  'Duración del video en segundos. 0 = desconocida.';
