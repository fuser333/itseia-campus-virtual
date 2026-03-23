-- ============================================================
-- ITSEIA Academy Online — Migration 012: AI Lab Avanzado
-- Feature: 010-ai-lab-advanced
-- Fecha: 2026-03-23
-- Tablas: ai_conversations, ai_favorites, code_snippets,
--         flashcards, flashcard_decks
-- RLS: user_id = auth.uid() en todas las tablas
-- ============================================================

-- ============================================================
-- ai_conversations
-- Guarda cada conversacion del AI Lab por usuario y sesion
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id    UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  model         TEXT NOT NULL DEFAULT 'gemini-2.0-flash',
  title         TEXT,
  messages      JSONB NOT NULL DEFAULT '[]'::jsonb,
  es_comparacion BOOLEAN NOT NULL DEFAULT false,
  favorito      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.ai_conversations IS
  'Historial de conversaciones del AI Lab por estudiante';

-- ============================================================
-- ai_favorites
-- Respuestas individuales marcadas como favoritas
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ai_favorites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  mensaje_index   INTEGER NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, conversation_id, mensaje_index)
);

COMMENT ON TABLE public.ai_favorites IS
  'Respuestas del AI Lab marcadas como favoritas por el estudiante';

-- ============================================================
-- code_snippets
-- Codigo guardado desde el Playground
-- ============================================================

CREATE TABLE IF NOT EXISTS public.code_snippets (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  language   TEXT NOT NULL DEFAULT 'python',
  code       TEXT NOT NULL,
  output     TEXT,
  title      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.code_snippets IS
  'Snippets de codigo guardados desde el Playground por el estudiante';

-- ============================================================
-- flashcards
-- Tarjetas de memoria generadas por IA desde la teoria
-- ============================================================

CREATE TABLE IF NOT EXISTS public.flashcards (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  deck_name  TEXT,
  frente     TEXT NOT NULL,
  dorso      TEXT NOT NULL,
  editada    BOOLEAN NOT NULL DEFAULT false,
  next_review TIMESTAMPTZ,
  ease_factor DECIMAL(4,2) DEFAULT 2.5,
  interval_days INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.flashcards IS
  'Flashcards de estudio generadas por IA y guardadas por el estudiante';

-- ============================================================
-- flashcard_decks
-- Sesiones de repaso de flashcards
-- ============================================================

CREATE TABLE IF NOT EXISTS public.flashcard_decks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  flashcard_ids   JSONB NOT NULL DEFAULT '[]'::jsonb,
  session_id      UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  deck_name       TEXT,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  cards_revisadas INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.flashcard_decks IS
  'Mazos de flashcards y sesiones de repaso del estudiante';

-- ============================================================
-- INDICES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_session
  ON public.ai_conversations (user_id, session_id);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_created
  ON public.ai_conversations (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_favorites_user
  ON public.ai_favorites (user_id);

CREATE INDEX IF NOT EXISTS idx_flashcards_user_session
  ON public.flashcards (user_id, session_id);

CREATE INDEX IF NOT EXISTS idx_code_snippets_user_session
  ON public.code_snippets (user_id, session_id);

CREATE INDEX IF NOT EXISTS idx_flashcard_decks_user
  ON public.flashcard_decks (user_id, created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- ai_conversations
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_conversations_select_own" ON public.ai_conversations;
DROP POLICY IF EXISTS "ai_conversations_insert_own" ON public.ai_conversations;
DROP POLICY IF EXISTS "ai_conversations_update_own" ON public.ai_conversations;
DROP POLICY IF EXISTS "ai_conversations_delete_own" ON public.ai_conversations;

CREATE POLICY "ai_conversations_select_own"
  ON public.ai_conversations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "ai_conversations_insert_own"
  ON public.ai_conversations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "ai_conversations_update_own"
  ON public.ai_conversations FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "ai_conversations_delete_own"
  ON public.ai_conversations FOR DELETE
  USING (user_id = auth.uid());

-- ai_favorites
ALTER TABLE public.ai_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_favorites_select_own" ON public.ai_favorites;
DROP POLICY IF EXISTS "ai_favorites_insert_own" ON public.ai_favorites;
DROP POLICY IF EXISTS "ai_favorites_delete_own" ON public.ai_favorites;

CREATE POLICY "ai_favorites_select_own"
  ON public.ai_favorites FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "ai_favorites_insert_own"
  ON public.ai_favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "ai_favorites_delete_own"
  ON public.ai_favorites FOR DELETE
  USING (user_id = auth.uid());

-- code_snippets
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "code_snippets_select_own" ON public.code_snippets;
DROP POLICY IF EXISTS "code_snippets_insert_own" ON public.code_snippets;
DROP POLICY IF EXISTS "code_snippets_update_own" ON public.code_snippets;
DROP POLICY IF EXISTS "code_snippets_delete_own" ON public.code_snippets;

CREATE POLICY "code_snippets_select_own"
  ON public.code_snippets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "code_snippets_insert_own"
  ON public.code_snippets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "code_snippets_update_own"
  ON public.code_snippets FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "code_snippets_delete_own"
  ON public.code_snippets FOR DELETE
  USING (user_id = auth.uid());

-- flashcards
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "flashcards_select_own" ON public.flashcards;
DROP POLICY IF EXISTS "flashcards_insert_own" ON public.flashcards;
DROP POLICY IF EXISTS "flashcards_update_own" ON public.flashcards;
DROP POLICY IF EXISTS "flashcards_delete_own" ON public.flashcards;

CREATE POLICY "flashcards_select_own"
  ON public.flashcards FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "flashcards_insert_own"
  ON public.flashcards FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "flashcards_update_own"
  ON public.flashcards FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "flashcards_delete_own"
  ON public.flashcards FOR DELETE
  USING (user_id = auth.uid());

-- flashcard_decks
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "flashcard_decks_select_own" ON public.flashcard_decks;
DROP POLICY IF EXISTS "flashcard_decks_insert_own" ON public.flashcard_decks;
DROP POLICY IF EXISTS "flashcard_decks_update_own" ON public.flashcard_decks;
DROP POLICY IF EXISTS "flashcard_decks_delete_own" ON public.flashcard_decks;

CREATE POLICY "flashcard_decks_select_own"
  ON public.flashcard_decks FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "flashcard_decks_insert_own"
  ON public.flashcard_decks FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "flashcard_decks_update_own"
  ON public.flashcard_decks FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "flashcard_decks_delete_own"
  ON public.flashcard_decks FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- Trigger: updated_at automatico en ai_conversations
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ai_conversations_updated_at ON public.ai_conversations;
CREATE TRIGGER trg_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_code_snippets_updated_at ON public.code_snippets;
CREATE TRIGGER trg_code_snippets_updated_at
  BEFORE UPDATE ON public.code_snippets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
