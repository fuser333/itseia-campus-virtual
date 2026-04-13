-- ============================================================
-- ITSEIA Academy — Segundo Cerebro (Migration 014)
-- Feature: segundo-cerebro-mvp
--
-- Habilita pgvector y crea tablas para base de conocimiento
-- personal del alumno con busqueda semantica.
-- ============================================================

-- Habilitar pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- ── Notas del alumno (su base de conocimiento) ──
CREATE TABLE IF NOT EXISTS brain_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  session_id UUID,
  subject_id UUID,
  embedding VECTOR(1536),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Fuentes externas ingestadas ──
CREATE TABLE IF NOT EXISTS brain_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('pdf', 'url', 'youtube', 'text')),
  title TEXT NOT NULL,
  url TEXT,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Resumenes delta generados ──
CREATE TABLE IF NOT EXISTS brain_deltas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source_id UUID REFERENCES brain_sources(id) ON DELETE SET NULL,
  delta_content TEXT NOT NULL,
  known_content TEXT,
  flashcards JSONB DEFAULT '[]',
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Indices para busqueda vectorial ──
-- Nota: ivfflat requiere al menos 100 filas para lists=100.
-- Usamos lists=10 para MVP (escala hasta ~10K notas por usuario).
CREATE INDEX IF NOT EXISTS brain_notes_embedding_idx ON brain_notes
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

CREATE INDEX IF NOT EXISTS brain_sources_embedding_idx ON brain_sources
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- Indices regulares
CREATE INDEX IF NOT EXISTS brain_notes_user_idx ON brain_notes(user_id);
CREATE INDEX IF NOT EXISTS brain_notes_session_idx ON brain_notes(session_id);
CREATE INDEX IF NOT EXISTS brain_sources_user_idx ON brain_sources(user_id);
CREATE INDEX IF NOT EXISTS brain_deltas_user_idx ON brain_deltas(user_id);

-- ── RLS ──
ALTER TABLE brain_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_deltas ENABLE ROW LEVEL SECURITY;

-- Politicas: cada usuario solo ve/edita sus propios datos
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own brain_notes') THEN
    CREATE POLICY "Users own brain_notes" ON brain_notes
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own brain_sources') THEN
    CREATE POLICY "Users own brain_sources" ON brain_sources
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users own brain_deltas') THEN
    CREATE POLICY "Users own brain_deltas" ON brain_deltas
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Politica para service_role (bypass RLS para API routes)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role brain_notes') THEN
    CREATE POLICY "Service role brain_notes" ON brain_notes
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role brain_sources') THEN
    CREATE POLICY "Service role brain_sources" ON brain_sources
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role brain_deltas') THEN
    CREATE POLICY "Service role brain_deltas" ON brain_deltas
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ── Funcion de busqueda semantica ──
CREATE OR REPLACE FUNCTION match_brain_notes(
  query_embedding VECTOR(1536),
  match_user_id UUID,
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bn.id,
    bn.title,
    bn.content,
    (1 - (bn.embedding <=> query_embedding))::FLOAT AS similarity
  FROM brain_notes bn
  WHERE bn.user_id = match_user_id
    AND bn.embedding IS NOT NULL
    AND (1 - (bn.embedding <=> query_embedding)) > match_threshold
  ORDER BY bn.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Funcion similar para buscar en fuentes
CREATE OR REPLACE FUNCTION match_brain_sources(
  query_embedding VECTOR(1536),
  match_user_id UUID,
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  source_type TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bs.id,
    bs.title,
    bs.content,
    bs.source_type,
    (1 - (bs.embedding <=> query_embedding))::FLOAT AS similarity
  FROM brain_sources bs
  WHERE bs.user_id = match_user_id
    AND bs.embedding IS NOT NULL
    AND (1 - (bs.embedding <=> query_embedding)) > match_threshold
  ORDER BY bs.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
