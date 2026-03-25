-- ============================================
-- ITSEIA Academy Online - Schema V2 (Migracion)
-- SOLO tablas nuevas. NO recrea tablas existentes.
-- Ejecutar en Supabase SQL Editor DESPUES de schema V1
-- Fecha: 21 marzo 2026
-- ============================================

-- ============================================
-- 0. ALTERACIONES A TABLAS EXISTENTES
-- ============================================

-- Agregar paypal_order_id a payments si no existe
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS paypal_order_id TEXT;

-- ============================================
-- 1. BADGES (definiciones de insignias)
-- ============================================

CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT NOT NULL DEFAULT 'achievement' CHECK (category IN ('achievement', 'streak', 'social', 'special')),
  xp_reward INTEGER NOT NULL DEFAULT 0,
  criteria JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.badges IS 'Catalogo de insignias/badges disponibles en la plataforma';

-- ============================================
-- 2. USER_BADGES (insignias ganadas por usuario)
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

COMMENT ON TABLE public.user_badges IS 'Insignias ganadas por cada usuario';

-- ============================================
-- 3. XP_EVENTS (registro de puntos de experiencia)
-- ============================================

CREATE TABLE IF NOT EXISTS public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'lesson_complete',
    'module_complete',
    'course_complete',
    'peer_review_given',
    'peer_review_received',
    'daily_streak',
    'first_ai_chat',
    'badge_earned'
  )),
  xp_amount INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.xp_events IS 'Historial de eventos XP por usuario';

-- ============================================
-- 4. PORTFOLIO_ITEMS (portafolio profesional)
-- ============================================

CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL DEFAULT 'custom' CHECK (project_type IN ('ai_lab', 'peer_review', 'final_project', 'custom')),
  url TEXT,
  thumbnail_url TEXT,
  technologies TEXT[],
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.portfolio_items IS 'Proyectos del portafolio profesional del alumno';

-- ============================================
-- 5. PAYPAL_TRANSACTIONS (transacciones PayPal)
-- ============================================

CREATE TABLE IF NOT EXISTS public.paypal_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE SET NULL,
  paypal_order_id TEXT UNIQUE,
  paypal_capture_id TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'approved', 'captured', 'failed', 'refunded')),
  payer_email TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.paypal_transactions IS 'Registro detallado de transacciones PayPal';

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Nuevas tablas
-- ============================================

-- BADGES: todos pueden ver badges activos, admin gestiona
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active badges"
  ON public.badges FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage badges"
  ON public.badges FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- USER_BADGES: alumno ve sus badges, admin ve todos
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON public.user_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user badges"
  ON public.user_badges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion', 'docente')
    )
  );

CREATE POLICY "Admins can manage user badges"
  ON public.user_badges FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- XP_EVENTS: alumno ve sus eventos, admin ve todos
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own xp events"
  ON public.xp_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all xp events"
  ON public.xp_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

CREATE POLICY "Admins can manage xp events"
  ON public.xp_events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- PORTFOLIO_ITEMS: alumno gestiona los suyos, publicos visibles para todos, admin ve todos
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own portfolio"
  ON public.portfolio_items FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public portfolio items"
  ON public.portfolio_items FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins can view all portfolio items"
  ON public.portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion')
    )
  );

-- PAYPAL_TRANSACTIONS: alumno ve sus transacciones, admin/finanzas gestionan
ALTER TABLE public.paypal_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own paypal transactions"
  ON public.paypal_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage paypal transactions"
  ON public.paypal_transactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'finanzas')
    )
  );

-- ============================================
-- INDICES para performance
-- ============================================

-- badges
CREATE INDEX IF NOT EXISTS idx_badges_category ON public.badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_is_active ON public.badges(is_active);

-- user_badges
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON public.user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_earned_at ON public.user_badges(earned_at);

-- xp_events
CREATE INDEX IF NOT EXISTS idx_xp_events_user ON public.xp_events(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_type ON public.xp_events(event_type);
CREATE INDEX IF NOT EXISTS idx_xp_events_created_at ON public.xp_events(created_at);

-- portfolio_items
CREATE INDEX IF NOT EXISTS idx_portfolio_items_user ON public.portfolio_items(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_created_at ON public.portfolio_items(created_at);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_is_public ON public.portfolio_items(is_public);

-- paypal_transactions
CREATE INDEX IF NOT EXISTS idx_paypal_transactions_user ON public.paypal_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_paypal_transactions_enrollment ON public.paypal_transactions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_paypal_transactions_order ON public.paypal_transactions(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_paypal_transactions_status ON public.paypal_transactions(status);
CREATE INDEX IF NOT EXISTS idx_paypal_transactions_created_at ON public.paypal_transactions(created_at);

-- payments (nuevo indice para paypal_order_id)
CREATE INDEX IF NOT EXISTS idx_payments_paypal_order ON public.payments(paypal_order_id);

-- ============================================
-- FUNCION: add_xp (atomica)
-- Inserta evento XP + actualiza profiles.nivel_xp
-- ============================================

CREATE OR REPLACE FUNCTION public.add_xp(
  p_user_id UUID,
  p_event_type TEXT,
  p_xp INTEGER,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id UUID;
BEGIN
  -- Validar event_type
  IF p_event_type NOT IN (
    'lesson_complete', 'module_complete', 'course_complete',
    'peer_review_given', 'peer_review_received',
    'daily_streak', 'first_ai_chat', 'badge_earned'
  ) THEN
    RAISE EXCEPTION 'Tipo de evento invalido: %', p_event_type;
  END IF;

  -- Validar xp positivo
  IF p_xp <= 0 THEN
    RAISE EXCEPTION 'XP debe ser mayor a 0, recibido: %', p_xp;
  END IF;

  -- Insertar evento XP
  INSERT INTO public.xp_events (user_id, event_type, xp_amount, metadata)
  VALUES (p_user_id, p_event_type, p_xp, p_metadata)
  RETURNING id INTO v_event_id;

  -- Actualizar XP total del perfil atomicamente
  UPDATE public.profiles
  SET nivel_xp = nivel_xp + p_xp
  WHERE id = p_user_id;

  -- Verificar que el usuario existe
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado: %', p_user_id;
  END IF;

  RETURN v_event_id;
END;
$$;

COMMENT ON FUNCTION public.add_xp IS 'Agrega XP a un usuario atomicamente: inserta evento + actualiza perfil';

-- ============================================
-- DATOS INICIALES: 8 Badges
-- ============================================

INSERT INTO public.badges (name, description, icon, category, xp_reward, criteria) VALUES
(
  'Primera Leccion',
  'Completaste tu primera leccion. El viaje de mil millas comienza con un paso.',
  'book-open',
  'achievement',
  10,
  '{"type": "lesson_complete", "count": 1}'::jsonb
),
(
  'Primer Chat IA',
  'Tuviste tu primera conversacion con el tutor IA. Bienvenido al futuro.',
  'message-circle',
  'achievement',
  15,
  '{"type": "first_ai_chat", "count": 1}'::jsonb
),
(
  'Racha 7 Dias',
  'Estudiaste 7 dias consecutivos. La consistencia es la clave del exito.',
  'flame',
  'streak',
  50,
  '{"type": "daily_streak", "days": 7}'::jsonb
),
(
  'Multi-Modelo',
  'Usaste ChatGPT, Claude y Gemini en el AI Lab. Dominas el ecosistema completo.',
  'layers',
  'achievement',
  30,
  '{"type": "multi_model", "models": ["chatgpt", "claude", "gemini"]}'::jsonb
),
(
  'Pionero',
  'Fuiste de los primeros 100 estudiantes de ITSEIA Academy. Eres parte de la historia.',
  'rocket',
  'special',
  100,
  '{"type": "early_adopter", "max_users": 100}'::jsonb
),
(
  'Reviewer Estrella',
  'Diste 10 peer reviews a tus companeros. Tu retroalimentacion hace mejor a todos.',
  'star',
  'social',
  40,
  '{"type": "peer_review_given", "count": 10}'::jsonb
),
(
  'Completador',
  'Terminaste un curso completo al 100%. Nada te detiene.',
  'check-circle',
  'achievement',
  75,
  '{"type": "course_complete", "count": 1}'::jsonb
),
(
  'Maestro IA',
  'Completaste 50 conversaciones con el tutor IA. Eres un experto en comunicarte con la IA.',
  'brain',
  'achievement',
  60,
  '{"type": "ai_conversations", "count": 50}'::jsonb
)
ON CONFLICT DO NOTHING;

-- ============================================
-- FIN DE MIGRACION V2
-- ============================================
