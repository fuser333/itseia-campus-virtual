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
