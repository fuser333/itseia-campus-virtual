-- ============================================================
-- ITSEIA Academy — Migration 014: Tabla recordings (YouTube)
-- Grabaciones de clases para todos los módulos del campus
-- Aplica a: carrera, bootcamp, curso_mdt, curso_pro, demo, cert
-- ============================================================

CREATE TABLE IF NOT EXISTS recordings (
  id                uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  module_type       text         NOT NULL CHECK (
    module_type IN ('carrera', 'bootcamp', 'curso_mdt', 'curso_pro', 'certificacion', 'preuni', 'demo')
  ),
  module_slug       text         NOT NULL,          -- e.g. "c1", "steveen-pinchao", "aws-cloud-practitioner"
  session_id        text         NOT NULL,          -- número de sesión como texto, o ID de dominio
  youtube_url       text         NOT NULL,
  youtube_id        text         NOT NULL,          -- ID del video en YouTube (11 caracteres)
  title             text         NOT NULL,
  description       text         NOT NULL DEFAULT '',
  duration_seconds  integer      NOT NULL DEFAULT 0,
  recorded_at       timestamptz  NOT NULL,
  created_at        timestamptz  NOT NULL DEFAULT now()
);

-- Índice principal: buscar grabaciones de un módulo + sesión
CREATE INDEX IF NOT EXISTS recordings_lookup_idx
  ON recordings (module_type, module_slug, session_id);

-- Índice para la vista de historial (ordenado por fecha)
CREATE INDEX IF NOT EXISTS recordings_recorded_at_idx
  ON recordings (recorded_at DESC);

-- ── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;

-- Lectura: cualquier usuario autenticado puede ver grabaciones
-- (el control de acceso al módulo ya lo hace la app)
CREATE POLICY "recordings_read_authenticated"
  ON recordings
  FOR SELECT
  TO authenticated
  USING (true);

-- Escritura: solo service_role (admins via supabaseAdmin)
-- No creamos política de INSERT/UPDATE/DELETE para anon/authenticated
-- → se gestiona desde el panel de admin o via supabaseAdmin

-- ── Comentarios de documentación ─────────────────────────────────────────────

COMMENT ON TABLE recordings IS
  'Grabaciones de clases en YouTube para todos los módulos del campus ITSEIA. '
  'module_type identifica el tipo de módulo; module_slug el curso específico; '
  'session_id el número/ID de la sesión o dominio.';

COMMENT ON COLUMN recordings.youtube_id IS
  'ID de 11 caracteres del video en YouTube. Se deriva de youtube_url pero '
  'se almacena separado para construir embeds sin parsear la URL cada vez.';

COMMENT ON COLUMN recordings.duration_seconds IS
  'Duración del video en segundos. 0 = desconocida.';
