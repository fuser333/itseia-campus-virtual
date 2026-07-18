-- ============================================
-- ITSEIA Academy Online - Schema V3 (V2 + Academic Structure)
-- INCLUDES: V2 tables (badges, xp, portfolio, paypal) + V3 academic tables
-- Safe to run multiple times (IF NOT EXISTS + ON CONFLICT DO NOTHING)
-- Ejecutar en Supabase SQL Editor DESPUES de schema V1
-- Fecha: 21 marzo 2026
-- ============================================

-- ############################################
-- PART A: V2 MIGRATION (badges, gamification, portfolio, paypal)
-- ############################################

-- ============================================
-- A.0. ALTERACIONES A TABLAS EXISTENTES (V2)
-- ============================================

ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS paypal_order_id TEXT;

-- ============================================
-- A.1. BADGES (definiciones de insignias)
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
-- A.2. USER_BADGES (insignias ganadas por usuario)
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
-- A.3. XP_EVENTS (registro de puntos de experiencia)
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
    'badge_earned',
    'quiz_passed',
    'assignment_submitted',
    'session_complete'
  )),
  xp_amount INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.xp_events IS 'Historial de eventos XP por usuario';

-- ============================================
-- A.4. PORTFOLIO_ITEMS (portafolio profesional)
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
-- A.5. PAYPAL_TRANSACTIONS (transacciones PayPal)
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
-- A.6. RLS - V2 Tables
-- ============================================

-- BADGES
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'badges' AND policyname = 'Anyone can view active badges') THEN
    CREATE POLICY "Anyone can view active badges"
      ON public.badges FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'badges' AND policyname = 'Admins can manage badges') THEN
    CREATE POLICY "Admins can manage badges"
      ON public.badges FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
      );
  END IF;
END $$;

-- USER_BADGES
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_badges' AND policyname = 'Users can view own badges') THEN
    CREATE POLICY "Users can view own badges"
      ON public.user_badges FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_badges' AND policyname = 'Admins can view all user badges') THEN
    CREATE POLICY "Admins can view all user badges"
      ON public.user_badges FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion', 'docente')
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_badges' AND policyname = 'Admins can manage user badges') THEN
    CREATE POLICY "Admins can manage user badges"
      ON public.user_badges FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
      );
  END IF;
END $$;

-- XP_EVENTS
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'xp_events' AND policyname = 'Users can view own xp events') THEN
    CREATE POLICY "Users can view own xp events"
      ON public.xp_events FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'xp_events' AND policyname = 'Admins can view all xp events') THEN
    CREATE POLICY "Admins can view all xp events"
      ON public.xp_events FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion')
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'xp_events' AND policyname = 'Admins can manage xp events') THEN
    CREATE POLICY "Admins can manage xp events"
      ON public.xp_events FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
      );
  END IF;
END $$;

-- PORTFOLIO_ITEMS
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_items' AND policyname = 'Users can manage own portfolio') THEN
    CREATE POLICY "Users can manage own portfolio"
      ON public.portfolio_items FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_items' AND policyname = 'Anyone can view public portfolio items') THEN
    CREATE POLICY "Anyone can view public portfolio items"
      ON public.portfolio_items FOR SELECT
      USING (is_public = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_items' AND policyname = 'Admins can view all portfolio items') THEN
    CREATE POLICY "Admins can view all portfolio items"
      ON public.portfolio_items FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion')
        )
      );
  END IF;
END $$;

-- PAYPAL_TRANSACTIONS
ALTER TABLE public.paypal_transactions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'paypal_transactions' AND policyname = 'Users can view own paypal transactions') THEN
    CREATE POLICY "Users can view own paypal transactions"
      ON public.paypal_transactions FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'paypal_transactions' AND policyname = 'Admins can manage paypal transactions') THEN
    CREATE POLICY "Admins can manage paypal transactions"
      ON public.paypal_transactions FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'finanzas')
        )
      );
  END IF;
END $$;

-- ============================================
-- A.7. INDICES V2
-- ============================================

CREATE INDEX IF NOT EXISTS idx_badges_category ON public.badges(category);
CREATE INDEX IF NOT EXISTS idx_badges_is_active ON public.badges(is_active);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON public.user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_earned_at ON public.user_badges(earned_at);
CREATE INDEX IF NOT EXISTS idx_xp_events_user ON public.xp_events(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_type ON public.xp_events(event_type);
CREATE INDEX IF NOT EXISTS idx_xp_events_created_at ON public.xp_events(created_at);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_user ON public.portfolio_items(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_created_at ON public.portfolio_items(created_at);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_is_public ON public.portfolio_items(is_public);
CREATE INDEX IF NOT EXISTS idx_paypal_transactions_user ON public.paypal_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_paypal_transactions_enrollment ON public.paypal_transactions(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_paypal_transactions_order ON public.paypal_transactions(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_paypal_transactions_status ON public.paypal_transactions(status);
CREATE INDEX IF NOT EXISTS idx_paypal_transactions_created_at ON public.paypal_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_paypal_order ON public.payments(paypal_order_id);

-- ============================================
-- A.8. FUNCION: add_xp (atomica)
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
  IF p_event_type NOT IN (
    'lesson_complete', 'module_complete', 'course_complete',
    'peer_review_given', 'peer_review_received',
    'daily_streak', 'first_ai_chat', 'badge_earned',
    'quiz_passed', 'assignment_submitted', 'session_complete'
  ) THEN
    RAISE EXCEPTION 'Tipo de evento invalido: %', p_event_type;
  END IF;

  IF p_xp <= 0 THEN
    RAISE EXCEPTION 'XP debe ser mayor a 0, recibido: %', p_xp;
  END IF;

  INSERT INTO public.xp_events (user_id, event_type, xp_amount, metadata)
  VALUES (p_user_id, p_event_type, p_xp, p_metadata)
  RETURNING id INTO v_event_id;

  UPDATE public.profiles
  SET nivel_xp = nivel_xp + p_xp
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado: %', p_user_id;
  END IF;

  RETURN v_event_id;
END;
$$;

COMMENT ON FUNCTION public.add_xp IS 'Agrega XP a un usuario atomicamente: inserta evento + actualiza perfil';

-- ============================================
-- A.9. DATOS INICIALES V2: 8 Badges
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


-- ############################################
-- PART B: V3 MIGRATION (Academic Structure)
-- ############################################

-- ============================================
-- B.0. ALTERACIONES A TABLAS EXISTENTES (V3)
-- ============================================

-- programs: add career_code and total_semesters
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS career_code TEXT;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS total_semesters INTEGER DEFAULT 5;

-- profiles: add current_semester
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_semester INTEGER DEFAULT 1;

-- ============================================
-- B.1. SEMESTERS (periodos academicos por carrera)
-- ============================================

CREATE TABLE IF NOT EXISTS public.semesters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  number INTEGER NOT NULL CHECK (number BETWEEN 1 AND 5),
  name TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'basic' CHECK (level IN ('basic', 'professional', 'integration')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(program_id, number)
);

COMMENT ON TABLE public.semesters IS 'Periodos academicos (semestres) por carrera - datos CES oficiales';

-- ============================================
-- B.2. SUBJECTS (asignaturas dentro de semestres)
-- ============================================

CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  credit_hours INTEGER NOT NULL DEFAULT 3,
  hours_docencia INTEGER NOT NULL DEFAULT 0,
  hours_practica INTEGER NOT NULL DEFAULT 0,
  hours_autonomo INTEGER NOT NULL DEFAULT 0,
  hours_total INTEGER NOT NULL DEFAULT 0,
  tools TEXT[],
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(semester_id, slug)
);

COMMENT ON TABLE public.subjects IS 'Asignaturas con horas CES exactas - datos inamovibles del PDF oficial';

-- ============================================
-- B.3. SESSIONS (sesiones de clase dentro de asignaturas)
-- ============================================

CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  video_duration_minutes INTEGER,
  slides_url TEXT,
  slides_type TEXT CHECK (slides_type IN ('pdf', 'google_slides', 'canva')),
  theory_markdown TEXT,
  ai_lab_context TEXT,
  ai_lab_suggested_prompt TEXT,
  estimated_duration_minutes INTEGER NOT NULL DEFAULT 45,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.sessions IS 'Sesiones de clase con 7 tipos de contenido obligatorios (Principio IV)';

-- ============================================
-- B.4. QUIZZES (evaluaciones por sesion)
-- ============================================

CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  pass_percentage INTEGER NOT NULL DEFAULT 70,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  time_limit_minutes INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.quizzes IS 'Quizzes con auto-grading por sesion de clase';

-- ============================================
-- B.5. QUIZ_QUESTIONS (preguntas de quiz)
-- ============================================

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'multiple_select')),
  options JSONB NOT NULL,
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0
);

COMMENT ON TABLE public.quiz_questions IS 'Preguntas con opciones, respuesta correcta y explicacion';

-- ============================================
-- B.6. QUIZ_ATTEMPTS (intentos de quiz por alumno)
-- ============================================

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB,
  score INTEGER,
  max_score INTEGER,
  percentage DECIMAL(5,2),
  passed BOOLEAN,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

COMMENT ON TABLE public.quiz_attempts IS 'Intentos de quiz con respuestas, puntaje y resultado';

-- ============================================
-- B.7. ASSIGNMENTS (tareas/ejercicios por sesion)
-- ============================================

CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  instructions_markdown TEXT,
  due_date TIMESTAMPTZ,
  max_file_size_mb INTEGER NOT NULL DEFAULT 10,
  allowed_file_types TEXT[] NOT NULL DEFAULT ARRAY['pdf','zip','py','ipynb','docx'],
  max_grade DECIMAL(5,2) NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.assignments IS 'Tareas y ejercicios practicos con rubrica y entrega de archivos';

-- ============================================
-- B.8. SUBMISSIONS (entregas de tareas por alumno)
-- ============================================

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT,
  file_name TEXT,
  file_size_bytes BIGINT,
  notes TEXT,
  grade DECIMAL(5,2),
  feedback TEXT,
  graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  graded_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned', 'late')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, user_id)
);

COMMENT ON TABLE public.submissions IS 'Entregas de tareas con archivo, calificacion y retroalimentacion';

-- ============================================
-- B.9. SESSION_PROGRESS (progreso granular por sesion)
-- ============================================

CREATE TABLE IF NOT EXISTS public.session_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  video_watched BOOLEAN NOT NULL DEFAULT false,
  video_watch_seconds INTEGER NOT NULL DEFAULT 0,
  slides_viewed BOOLEAN NOT NULL DEFAULT false,
  theory_read BOOLEAN NOT NULL DEFAULT false,
  quiz_passed BOOLEAN NOT NULL DEFAULT false,
  assignment_submitted BOOLEAN NOT NULL DEFAULT false,
  ai_lab_used BOOLEAN NOT NULL DEFAULT false,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, session_id)
);

COMMENT ON TABLE public.session_progress IS 'Progreso granular de 7 tipos de contenido por sesion (Principio IV)';

-- ============================================
-- B.10. SESSION_RESOURCES (recursos adicionales por sesion)
-- ============================================

CREATE TABLE IF NOT EXISTS public.session_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'link' CHECK (type IN ('pdf', 'link', 'video', 'github', 'dataset', 'tool')),
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.session_resources IS 'Recursos y bibliografia complementaria por sesion';

-- ############################################
-- PART C: RLS POLICIES FOR V3 TABLES
-- ############################################

-- ============================================
-- C.1. SEMESTERS RLS
-- ============================================

ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'semesters' AND policyname = 'Anyone can view active semesters') THEN
    CREATE POLICY "Anyone can view active semesters"
      ON public.semesters FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'semesters' AND policyname = 'Admins can manage semesters') THEN
    CREATE POLICY "Admins can manage semesters"
      ON public.semesters FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion')
        )
      );
  END IF;
END $$;

-- ============================================
-- C.2. SUBJECTS RLS
-- ============================================

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subjects' AND policyname = 'Anyone can view active subjects') THEN
    CREATE POLICY "Anyone can view active subjects"
      ON public.subjects FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subjects' AND policyname = 'Teachers can view assigned subjects') THEN
    CREATE POLICY "Teachers can view assigned subjects"
      ON public.subjects FOR SELECT
      USING (
        teacher_id = auth.uid()
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subjects' AND policyname = 'Admins can manage subjects') THEN
    CREATE POLICY "Admins can manage subjects"
      ON public.subjects FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion')
        )
      );
  END IF;
END $$;

-- ============================================
-- C.3. SESSIONS RLS
-- ============================================

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Anyone can view active sessions') THEN
    CREATE POLICY "Anyone can view active sessions"
      ON public.sessions FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Teachers can manage sessions for their subjects') THEN
    CREATE POLICY "Teachers can manage sessions for their subjects"
      ON public.sessions FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.subjects s
          WHERE s.id = subject_id AND s.teacher_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions' AND policyname = 'Admins can manage sessions') THEN
    CREATE POLICY "Admins can manage sessions"
      ON public.sessions FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion')
        )
      );
  END IF;
END $$;

-- ============================================
-- C.4. QUIZZES RLS
-- ============================================

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quizzes' AND policyname = 'Anyone can view active quizzes') THEN
    CREATE POLICY "Anyone can view active quizzes"
      ON public.quizzes FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quizzes' AND policyname = 'Teachers can manage quizzes for their subjects') THEN
    CREATE POLICY "Teachers can manage quizzes for their subjects"
      ON public.quizzes FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.sessions ses
          JOIN public.subjects sub ON sub.id = ses.subject_id
          WHERE ses.id = session_id AND sub.teacher_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quizzes' AND policyname = 'Admins can manage quizzes') THEN
    CREATE POLICY "Admins can manage quizzes"
      ON public.quizzes FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion')
        )
      );
  END IF;
END $$;

-- ============================================
-- C.5. QUIZ_QUESTIONS RLS
-- ============================================

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_questions' AND policyname = 'Authenticated users can view quiz questions') THEN
    CREATE POLICY "Authenticated users can view quiz questions"
      ON public.quiz_questions FOR SELECT
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_questions' AND policyname = 'Teachers can manage quiz questions for their subjects') THEN
    CREATE POLICY "Teachers can manage quiz questions for their subjects"
      ON public.quiz_questions FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.quizzes q
          JOIN public.sessions ses ON ses.id = q.session_id
          JOIN public.subjects sub ON sub.id = ses.subject_id
          WHERE q.id = quiz_id AND sub.teacher_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_questions' AND policyname = 'Admins can manage quiz questions') THEN
    CREATE POLICY "Admins can manage quiz questions"
      ON public.quiz_questions FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion')
        )
      );
  END IF;
END $$;

-- ============================================
-- C.6. QUIZ_ATTEMPTS RLS
-- ============================================

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Users can view own quiz attempts') THEN
    CREATE POLICY "Users can view own quiz attempts"
      ON public.quiz_attempts FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Users can insert own quiz attempts') THEN
    CREATE POLICY "Users can insert own quiz attempts"
      ON public.quiz_attempts FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Users can update own quiz attempts') THEN
    CREATE POLICY "Users can update own quiz attempts"
      ON public.quiz_attempts FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Teachers can view quiz attempts for their subjects') THEN
    CREATE POLICY "Teachers can view quiz attempts for their subjects"
      ON public.quiz_attempts FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.quizzes q
          JOIN public.sessions ses ON ses.id = q.session_id
          JOIN public.subjects sub ON sub.id = ses.subject_id
          WHERE q.id = quiz_id AND sub.teacher_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Admins can view all quiz attempts') THEN
    CREATE POLICY "Admins can view all quiz attempts"
      ON public.quiz_attempts FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion', 'docente')
        )
      );
  END IF;
END $$;

-- ============================================
-- C.7. ASSIGNMENTS RLS
-- ============================================

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assignments' AND policyname = 'Anyone can view active assignments') THEN
    CREATE POLICY "Anyone can view active assignments"
      ON public.assignments FOR SELECT
      USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assignments' AND policyname = 'Teachers can manage assignments for their subjects') THEN
    CREATE POLICY "Teachers can manage assignments for their subjects"
      ON public.assignments FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.sessions ses
          JOIN public.subjects sub ON sub.id = ses.subject_id
          WHERE ses.id = session_id AND sub.teacher_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assignments' AND policyname = 'Admins can manage assignments') THEN
    CREATE POLICY "Admins can manage assignments"
      ON public.assignments FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion')
        )
      );
  END IF;
END $$;

-- ============================================
-- C.8. SUBMISSIONS RLS
-- ============================================

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Users can view own submissions') THEN
    CREATE POLICY "Users can view own submissions"
      ON public.submissions FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Users can insert own submissions') THEN
    CREATE POLICY "Users can insert own submissions"
      ON public.submissions FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Users can update own submissions') THEN
    CREATE POLICY "Users can update own submissions"
      ON public.submissions FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Teachers can view submissions for their subjects') THEN
    CREATE POLICY "Teachers can view submissions for their subjects"
      ON public.submissions FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.assignments a
          JOIN public.sessions ses ON ses.id = a.session_id
          JOIN public.subjects sub ON sub.id = ses.subject_id
          WHERE a.id = assignment_id AND sub.teacher_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Teachers can update submissions for their subjects') THEN
    CREATE POLICY "Teachers can update submissions for their subjects"
      ON public.submissions FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM public.assignments a
          JOIN public.sessions ses ON ses.id = a.session_id
          JOIN public.subjects sub ON sub.id = ses.subject_id
          WHERE a.id = assignment_id AND sub.teacher_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Admins can manage all submissions') THEN
    CREATE POLICY "Admins can manage all submissions"
      ON public.submissions FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion')
        )
      );
  END IF;
END $$;

-- ============================================
-- C.9. SESSION_PROGRESS RLS
-- ============================================

ALTER TABLE public.session_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'session_progress' AND policyname = 'Users can manage own session progress') THEN
    CREATE POLICY "Users can manage own session progress"
      ON public.session_progress FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'session_progress' AND policyname = 'Teachers can view progress for their subjects') THEN
    CREATE POLICY "Teachers can view progress for their subjects"
      ON public.session_progress FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.sessions ses
          JOIN public.subjects sub ON sub.id = ses.subject_id
          WHERE ses.id = session_id AND sub.teacher_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'session_progress' AND policyname = 'Admins can view all session progress') THEN
    CREATE POLICY "Admins can view all session progress"
      ON public.session_progress FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion', 'docente')
        )
      );
  END IF;
END $$;

-- ============================================
-- C.10. SESSION_RESOURCES RLS
-- ============================================

ALTER TABLE public.session_resources ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'session_resources' AND policyname = 'Authenticated users can view session resources') THEN
    CREATE POLICY "Authenticated users can view session resources"
      ON public.session_resources FOR SELECT
      USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'session_resources' AND policyname = 'Teachers can manage resources for their subjects') THEN
    CREATE POLICY "Teachers can manage resources for their subjects"
      ON public.session_resources FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.sessions ses
          JOIN public.subjects sub ON sub.id = ses.subject_id
          WHERE ses.id = session_id AND sub.teacher_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'session_resources' AND policyname = 'Admins can manage session resources') THEN
    CREATE POLICY "Admins can manage session resources"
      ON public.session_resources FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion')
        )
      );
  END IF;
END $$;


-- ############################################
-- PART D: INDEXES FOR V3 TABLES
-- ############################################

-- semesters
CREATE INDEX IF NOT EXISTS idx_semesters_program ON public.semesters(program_id);
CREATE INDEX IF NOT EXISTS idx_semesters_number ON public.semesters(number);
CREATE INDEX IF NOT EXISTS idx_semesters_created_at ON public.semesters(created_at);

-- subjects
CREATE INDEX IF NOT EXISTS idx_subjects_semester ON public.subjects(semester_id);
CREATE INDEX IF NOT EXISTS idx_subjects_teacher ON public.subjects(teacher_id);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON public.subjects(code);
CREATE INDEX IF NOT EXISTS idx_subjects_slug ON public.subjects(slug);
CREATE INDEX IF NOT EXISTS idx_subjects_created_at ON public.subjects(created_at);

-- sessions
CREATE INDEX IF NOT EXISTS idx_sessions_subject ON public.sessions(subject_id);
CREATE INDEX IF NOT EXISTS idx_sessions_number ON public.sessions(number);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.sessions(created_at);

-- quizzes
CREATE INDEX IF NOT EXISTS idx_quizzes_session ON public.quizzes(session_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_created_at ON public.quizzes(created_at);

-- quiz_questions
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON public.quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order ON public.quiz_questions(order_index);

-- quiz_attempts
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_started ON public.quiz_attempts(started_at);

-- assignments
CREATE INDEX IF NOT EXISTS idx_assignments_session ON public.assignments(session_id);
CREATE INDEX IF NOT EXISTS idx_assignments_created_at ON public.assignments(created_at);

-- submissions
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON public.submissions(submitted_at);

-- session_progress
CREATE INDEX IF NOT EXISTS idx_session_progress_user ON public.session_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_session_progress_session ON public.session_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_session_progress_completed ON public.session_progress(completed);
CREATE INDEX IF NOT EXISTS idx_session_progress_created_at ON public.session_progress(created_at);

-- session_resources
CREATE INDEX IF NOT EXISTS idx_session_resources_session ON public.session_resources(session_id);
CREATE INDEX IF NOT EXISTS idx_session_resources_type ON public.session_resources(type);
CREATE INDEX IF NOT EXISTS idx_session_resources_created_at ON public.session_resources(created_at);


-- ############################################
-- PART E: SEED DATA - 3 CARRERAS CES OFICIALES
-- ############################################
-- Fuente: PROYECTO_CARRERAS_ITSEIA_CORREGIDO.pdf (CES, Febrero 2026)
-- Principio II: Datos CES son inamovibles
-- 3 carreras x 5 periodos x ~6 asignaturas = 87 asignaturas totales

-- ============================================
-- E.1. PROGRAMS (3 carreras tipo 'carrera')
-- ============================================

INSERT INTO public.programs (name, slug, description, type, price, duration_months, is_active, career_code, total_semesters) VALUES
(
  'Inteligencia Artificial',
  'inteligencia-artificial',
  'Tecnologo/a Superior en Inteligencia Artificial. Campo RANT 06-1-1 Ciencias Computacionales. 75 creditos, 3600 horas, 5 periodos academicos.',
  'carrera',
  220.00,
  30,
  true,
  'IA',
  5
),
(
  'Ciencia de Datos',
  'ciencia-de-datos',
  'Tecnologo/a Superior en Ciencia de Datos. Campo RANT 06-1-2 Diseno y administracion de redes y BD. 75 creditos, 3600 horas, 5 periodos academicos.',
  'carrera',
  220.00,
  30,
  true,
  'CD',
  5
),
(
  'Big Data e Inteligencia de Negocio',
  'big-data-inteligencia-negocio',
  'Tecnologo/a Superior en Big Data e Inteligencia de Negocio. Campo RANT 06-1-2 Diseno y administracion de redes y BD. 75 creditos, 3600 horas, 5 periodos academicos.',
  'carrera',
  220.00,
  30,
  true,
  'BD',
  5
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- E.2. SEMESTERS (15 periodos: 5 por carrera)
-- ============================================

-- IA Semesters
INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 1, 'Periodo 1 - Fundamentos', 'basic'
FROM public.programs p WHERE p.slug = 'inteligencia-artificial'
ON CONFLICT (program_id, number) DO NOTHING;

INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 2, 'Periodo 2 - Programacion y Matematicas', 'basic'
FROM public.programs p WHERE p.slug = 'inteligencia-artificial'
ON CONFLICT (program_id, number) DO NOTHING;

INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 3, 'Periodo 3 - Machine Learning y Datos', 'professional'
FROM public.programs p WHERE p.slug = 'inteligencia-artificial'
ON CONFLICT (program_id, number) DO NOTHING;

INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 4, 'Periodo 4 - Deep Learning y Especializacion', 'professional'
FROM public.programs p WHERE p.slug = 'inteligencia-artificial'
ON CONFLICT (program_id, number) DO NOTHING;

INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 5, 'Periodo 5 - IA Avanzada y Proyecto', 'integration'
FROM public.programs p WHERE p.slug = 'inteligencia-artificial'
ON CONFLICT (program_id, number) DO NOTHING;

-- CD Semesters
INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 1, 'Periodo 1 - Fundamentos', 'basic'
FROM public.programs p WHERE p.slug = 'ciencia-de-datos'
ON CONFLICT (program_id, number) DO NOTHING;

INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 2, 'Periodo 2 - Programacion y Estadistica', 'basic'
FROM public.programs p WHERE p.slug = 'ciencia-de-datos'
ON CONFLICT (program_id, number) DO NOTHING;

INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 3, 'Periodo 3 - Analisis y Machine Learning', 'professional'
FROM public.programs p WHERE p.slug = 'ciencia-de-datos'
ON CONFLICT (program_id, number) DO NOTHING;

INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 4, 'Periodo 4 - Deep Learning y Data Engineering', 'professional'
FROM public.programs p WHERE p.slug = 'ciencia-de-datos'
ON CONFLICT (program_id, number) DO NOTHING;

INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 5, 'Periodo 5 - Analisis Avanzado y Proyecto', 'integration'
FROM public.programs p WHERE p.slug = 'ciencia-de-datos'
ON CONFLICT (program_id, number) DO NOTHING;

-- BD Semesters
INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 1, 'Periodo 1 - Fundamentos', 'basic'
FROM public.programs p WHERE p.slug = 'big-data-inteligencia-negocio'
ON CONFLICT (program_id, number) DO NOTHING;

INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 2, 'Periodo 2 - Programacion y Estadistica', 'basic'
FROM public.programs p WHERE p.slug = 'big-data-inteligencia-negocio'
ON CONFLICT (program_id, number) DO NOTHING;

INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 3, 'Periodo 3 - Ecosistema Big Data', 'professional'
FROM public.programs p WHERE p.slug = 'big-data-inteligencia-negocio'
ON CONFLICT (program_id, number) DO NOTHING;

INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 4, 'Periodo 4 - Analitica y Cloud', 'professional'
FROM public.programs p WHERE p.slug = 'big-data-inteligencia-negocio'
ON CONFLICT (program_id, number) DO NOTHING;

INSERT INTO public.semesters (program_id, number, name, level)
SELECT p.id, 5, 'Periodo 5 - IA de Negocios y Proyecto', 'integration'
FROM public.programs p WHERE p.slug = 'big-data-inteligencia-negocio'
ON CONFLICT (program_id, number) DO NOTHING;

-- ============================================
-- E.3. SUBJECTS - CARRERA 1: INTELIGENCIA ARTIFICIAL (29 asignaturas)
-- Fuente: PROYECTO_CARRERAS_ITSEIA_CORREGIDO.pdf pp. 6-7
-- ============================================

-- IA Periodo 1 (6 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA101', 'Fundamentos de Programacion', 'fundamentos-programacion', 48, 48, 24, 120, 3, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA102', 'Matematicas para IA I', 'matematicas-ia-1', 48, 32, 20, 100, 2, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA103', 'Introduccion a la Inteligencia Artificial', 'introduccion-ia', 48, 48, 24, 120, 3, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA104', 'Logica Computacional', 'logica-computacional', 32, 32, 16, 80, 2, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA105', 'Comunicacion Academica y Tecnica', 'comunicacion-academica-tecnica', 32, 32, 16, 80, 2, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA106', 'Etica Digital y Responsabilidad Profesional', 'etica-digital-responsabilidad', 32, 48, 20, 100, 2, 6
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

-- IA Periodo 2 (6 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA201', 'Programacion Orientada a Objetos', 'poo', 48, 48, 24, 120, 3, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA202', 'Matematicas para IA II (Algebra Lineal)', 'matematicas-ia-2-algebra-lineal', 48, 32, 20, 100, 2, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA203', 'Estadistica y Probabilidad', 'estadistica-probabilidad', 48, 32, 20, 100, 2, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA204', 'Bases de Datos', 'bases-datos', 48, 48, 24, 120, 3, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA205', 'Estructuras de Datos y Algoritmos', 'estructuras-datos-algoritmos', 32, 32, 16, 80, 2, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA206', 'Ingles Tecnico I', 'ingles-tecnico-1', 32, 32, 16, 80, 2, 6
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

-- IA Periodo 3 (6 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA301', 'Machine Learning I', 'machine-learning-1', 48, 64, 28, 140, 3, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA302', 'Python para Ciencia de Datos', 'python-ciencia-datos', 48, 48, 24, 120, 3, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA303', 'Procesamiento de Datos', 'procesamiento-datos', 32, 48, 20, 100, 2, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA304', 'Cloud Computing para IA', 'cloud-computing-ia', 32, 48, 20, 100, 2, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA305', 'Visualizacion de Datos', 'visualizacion-datos', 32, 32, 16, 80, 2, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA306', 'Metodologias Agiles', 'metodologias-agiles', 24, 24, 12, 60, 1, 6
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

-- IA Periodo 4 (6 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA401', 'Machine Learning II (Avanzado)', 'machine-learning-2-avanzado', 48, 48, 24, 120, 3, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA402', 'Deep Learning y Redes Neuronales', 'deep-learning-redes-neuronales', 48, 48, 24, 120, 3, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA403', 'Procesamiento de Lenguaje Natural', 'procesamiento-lenguaje-natural', 32, 48, 20, 100, 2, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA404', 'Vision Artificial', 'vision-artificial', 32, 48, 20, 100, 2, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA405', 'MLOps y Despliegue de Modelos', 'mlops-despliegue-modelos', 32, 48, 20, 100, 2, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA406', 'Ingles Tecnico II', 'ingles-tecnico-2', 24, 24, 12, 60, 1, 6
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

-- IA Periodo 5 (5 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA501', 'IA Generativa y LLMs', 'ia-generativa-llms', 32, 48, 20, 100, 2, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA502', 'Sistemas de Recomendacion', 'sistemas-recomendacion', 24, 32, 24, 80, 2, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA503', 'Robotica e IA Embebida', 'robotica-ia-embebida', 24, 32, 24, 80, 2, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA504', 'Emprendimiento Tecnologico', 'emprendimiento-tecnologico', 24, 32, 24, 80, 2, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'IA505', 'Proyecto Integrador (Titulacion)', 'proyecto-integrador', 32, 128, 100, 260, 5, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'inteligencia-artificial' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

-- ============================================
-- E.4. SUBJECTS - CARRERA 2: CIENCIA DE DATOS (29 asignaturas)
-- Fuente: PROYECTO_CARRERAS_ITSEIA_CORREGIDO.pdf pp. 10-11
-- ============================================

-- CD Periodo 1 (6 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD101', 'Fundamentos de Programacion', 'fundamentos-programacion', 48, 48, 24, 120, 3, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD102', 'Matematicas I (Calculo)', 'matematicas-1-calculo', 48, 32, 20, 100, 2, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD103', 'Introduccion a la Ciencia de Datos', 'introduccion-ciencia-datos', 48, 48, 24, 120, 3, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD104', 'Logica y Pensamiento Analitico', 'logica-pensamiento-analitico', 32, 32, 16, 80, 2, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD105', 'Comunicacion Academica y Tecnica', 'comunicacion-academica-tecnica', 32, 32, 16, 80, 2, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD106', 'Etica Digital y Gobernanza de Datos', 'etica-digital-gobernanza-datos', 32, 48, 20, 100, 2, 6
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

-- CD Periodo 2 (6 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD201', 'Programacion Orientada a Objetos', 'poo', 48, 48, 24, 120, 3, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD202', 'Matematicas II (Algebra Lineal)', 'matematicas-2-algebra-lineal', 48, 32, 20, 100, 2, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD203', 'Estadistica Descriptiva e Inferencial', 'estadistica-descriptiva-inferencial', 48, 32, 20, 100, 2, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD204', 'Bases de Datos Relacionales', 'bases-datos-relacionales', 48, 48, 24, 120, 3, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD205', 'Estructuras de Datos', 'estructuras-datos', 32, 32, 16, 80, 2, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD206', 'Ingles Tecnico I', 'ingles-tecnico-1', 32, 32, 16, 80, 2, 6
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

-- CD Periodo 3 (6 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD301', 'Python para Ciencia de Datos', 'python-ciencia-datos', 48, 64, 28, 140, 3, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD302', 'Analisis Exploratorio de Datos', 'analisis-exploratorio-datos', 48, 48, 24, 120, 3, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD303', 'Machine Learning I', 'machine-learning-1', 32, 48, 20, 100, 2, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD304', 'Bases de Datos NoSQL', 'bases-datos-nosql', 32, 48, 20, 100, 2, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD305', 'Visualizacion de Datos', 'visualizacion-datos', 32, 32, 16, 80, 2, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD306', 'Metodologias Agiles', 'metodologias-agiles', 24, 24, 12, 60, 1, 6
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

-- CD Periodo 4 (6 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD401', 'Machine Learning II', 'machine-learning-2', 48, 48, 24, 120, 3, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD402', 'Deep Learning Aplicado', 'deep-learning-aplicado', 48, 48, 24, 120, 3, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD403', 'Procesamiento de Lenguaje Natural', 'procesamiento-lenguaje-natural', 32, 48, 20, 100, 2, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD404', 'Data Engineering y Pipelines', 'data-engineering-pipelines', 32, 48, 20, 100, 2, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD405', 'Cloud Computing para Datos', 'cloud-computing-datos', 32, 48, 20, 100, 2, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD406', 'Ingles Tecnico II', 'ingles-tecnico-2', 24, 24, 12, 60, 1, 6
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

-- CD Periodo 5 (5 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD501', 'Analisis Avanzado y Modelado Predictivo', 'analisis-avanzado-modelado-predictivo', 32, 48, 20, 100, 2, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD502', 'Big Data y Procesamiento Distribuido', 'big-data-procesamiento-distribuido', 24, 32, 24, 80, 2, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD503', 'Storytelling con Datos', 'storytelling-datos', 24, 32, 24, 80, 2, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD504', 'Emprendimiento Tecnologico', 'emprendimiento-tecnologico', 24, 32, 24, 80, 2, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'CD505', 'Proyecto Integrador (Titulacion)', 'proyecto-integrador', 32, 128, 100, 260, 5, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'ciencia-de-datos' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

-- ============================================
-- E.5. SUBJECTS - CARRERA 3: BIG DATA E INTELIGENCIA DE NEGOCIO (29 asignaturas)
-- Fuente: PROYECTO_CARRERAS_ITSEIA_CORREGIDO.pdf pp. 13-14
-- ============================================

-- BD Periodo 1 (6 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD101', 'Fundamentos de Programacion', 'fundamentos-programacion', 48, 48, 24, 120, 3, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD102', 'Matematicas I (Estadistica)', 'matematicas-1-estadistica', 48, 32, 20, 100, 2, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD103', 'Introduccion a Big Data', 'introduccion-big-data', 48, 48, 24, 120, 3, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD104', 'Logica y Pensamiento Analitico', 'logica-pensamiento-analitico', 32, 32, 16, 80, 2, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD105', 'Comunicacion Academica y Tecnica', 'comunicacion-academica-tecnica', 32, 32, 16, 80, 2, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD106', 'Etica Digital y Responsabilidad Profesional', 'etica-digital-responsabilidad', 32, 48, 20, 100, 2, 6
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 1
ON CONFLICT (semester_id, slug) DO NOTHING;

-- BD Periodo 2 (6 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD201', 'Programacion Orientada a Objetos', 'poo', 48, 48, 24, 120, 3, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD202', 'Matematicas II (Algebra y Calculo)', 'matematicas-2-algebra-calculo', 48, 32, 20, 100, 2, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD203', 'Estadistica Inferencial', 'estadistica-inferencial', 48, 32, 20, 100, 2, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD204', 'Bases de Datos Relacionales y NoSQL', 'bases-datos-relacionales-nosql', 48, 48, 24, 120, 3, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD205', 'Estructuras de Datos', 'estructuras-datos', 32, 32, 16, 80, 2, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD206', 'Ingles Tecnico I', 'ingles-tecnico-1', 32, 32, 16, 80, 2, 6
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 2
ON CONFLICT (semester_id, slug) DO NOTHING;

-- BD Periodo 3 (6 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD301', 'Ecosistema Big Data (Hadoop/Spark)', 'ecosistema-big-data-hadoop-spark', 48, 64, 28, 140, 3, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD302', 'Python para Analisis de Datos', 'python-analisis-datos', 48, 48, 24, 120, 3, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD303', 'Inteligencia de Negocio y Reporting', 'inteligencia-negocio-reporting', 32, 48, 20, 100, 2, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD304', 'Data Warehousing y ETL', 'data-warehousing-etl', 32, 48, 20, 100, 2, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD305', 'Visualizacion y Dashboards', 'visualizacion-dashboards', 32, 32, 16, 80, 2, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD306', 'Metodologias Agiles', 'metodologias-agiles', 24, 24, 12, 60, 1, 6
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 3
ON CONFLICT (semester_id, slug) DO NOTHING;

-- BD Periodo 4 (6 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD401', 'Machine Learning para Negocios', 'machine-learning-negocios', 48, 48, 24, 120, 3, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD402', 'Analitica Predictiva', 'analitica-predictiva', 48, 48, 24, 120, 3, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD403', 'Procesamiento en Tiempo Real (Streaming)', 'procesamiento-tiempo-real-streaming', 32, 48, 20, 100, 2, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD404', 'Cloud Computing y Data Lakes', 'cloud-computing-data-lakes', 32, 48, 20, 100, 2, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD405', 'Gestion de Proyectos de Datos', 'gestion-proyectos-datos', 32, 32, 16, 80, 2, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD406', 'Ingles Tecnico II', 'ingles-tecnico-2', 32, 32, 16, 80, 2, 6
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 4
ON CONFLICT (semester_id, slug) DO NOTHING;

-- BD Periodo 5 (5 asignaturas, 600h total)
INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD501', 'IA Aplicada a Negocios', 'ia-aplicada-negocios', 32, 48, 20, 100, 2, 1
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD502', 'Gobierno de Datos y Compliance', 'gobierno-datos-compliance', 24, 32, 24, 80, 2, 2
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD503', 'Estrategia Digital y Transformacion', 'estrategia-digital-transformacion', 24, 32, 24, 80, 2, 3
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD504', 'Emprendimiento Tecnologico', 'emprendimiento-tecnologico', 24, 32, 24, 80, 2, 4
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;

INSERT INTO public.subjects (semester_id, code, name, slug, hours_docencia, hours_practica, hours_autonomo, hours_total, credit_hours, order_index)
SELECT s.id, 'BD505', 'Proyecto Integrador (Titulacion)', 'proyecto-integrador', 32, 128, 100, 260, 5, 5
FROM public.semesters s
JOIN public.programs p ON p.id = s.program_id
WHERE p.slug = 'big-data-inteligencia-negocio' AND s.number = 5
ON CONFLICT (semester_id, slug) DO NOTHING;


-- ############################################
-- PART F: STORAGE BUCKETS
-- ############################################

-- Note: Storage buckets must be created via Supabase Dashboard or API
-- These are the buckets needed:
-- 1. submissions - Student assignment file uploads (max 10MB)
-- 2. slides - PDF/presentation files for sessions
-- 3. resources - Additional resource files

-- To create via SQL (if using supabase_admin role):
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('submissions', 'submissions', false),
--   ('slides', 'slides', true),
--   ('resources', 'resources', true)
-- ON CONFLICT (id) DO NOTHING;


-- ############################################
-- PART G: VIEWS FOR ACADEMIC PROGRESS
-- ############################################

-- Subject progress view (helper for dashboard)
CREATE OR REPLACE VIEW public.subject_progress AS
SELECT
  sp.user_id,
  sub.id as subject_id,
  sub.name as subject_name,
  sub.code as subject_code,
  sem.id as semester_id,
  sem.number as semester_number,
  sem.program_id,
  COUNT(DISTINCT ses.id) as total_sessions,
  COUNT(DISTINCT CASE WHEN sp.completed THEN sp.session_id END) as completed_sessions,
  CASE
    WHEN COUNT(DISTINCT ses.id) > 0
    THEN ROUND((COUNT(DISTINCT CASE WHEN sp.completed THEN sp.session_id END)::DECIMAL / COUNT(DISTINCT ses.id)) * 100)
    ELSE 0
  END as progress_percent
FROM public.session_progress sp
JOIN public.sessions ses ON ses.id = sp.session_id
JOIN public.subjects sub ON sub.id = ses.subject_id
JOIN public.semesters sem ON sem.id = sub.semester_id
GROUP BY sp.user_id, sub.id, sub.name, sub.code, sem.id, sem.number, sem.program_id;


-- ============================================
-- FIN DE MIGRACION V3
-- Total: 10 nuevas tablas + 3 alteraciones + 87 asignaturas seed
-- ============================================
