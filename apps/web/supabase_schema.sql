-- ============================================
-- ITSEIA Academy Online - Schema de Base de Datos
-- Ejecutar en Supabase SQL Editor
-- Fecha: 21 marzo 2026
-- ============================================

-- 1. PROFILES (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'estudiante' CHECK (role IN ('super_admin', 'admin', 'coordinacion', 'docente', 'estudiante', 'finanzas')),
  avatar_url TEXT,
  nivel_xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: crear perfil automaticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'estudiante'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. PROGRAMS
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('carrera', 'curso', 'preuni', 'bootcamp')),
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_months INTEGER,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. COURSES (materias dentro de programas)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(program_id, slug)
);

-- 4. MODULES (modulos dentro de cursos)
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5. LESSONS (lecciones dentro de modulos)
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_markdown TEXT,
  video_url TEXT,
  pdf_url TEXT,
  ai_prompt_suggested TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 6. ENROLLMENTS (inscripciones)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'suspended', 'cancelled')),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, program_id)
);

-- 7. PROGRESS (progreso por leccion)
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- 8. PAYMENTS (pagos)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL DEFAULT 'transfer' CHECK (method IN ('transfer', 'stripe', 'cash')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  reference TEXT,
  confirmed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. AI USAGE LOGS
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model TEXT NOT NULL DEFAULT 'gemini-2.0-flash',
  tokens_in INTEGER NOT NULL DEFAULT 0,
  tokens_out INTEGER NOT NULL DEFAULT 0,
  cost_usd DECIMAL(8,6) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. CERTIFICATES
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pdf_url TEXT
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- PROFILES: usuario ve su propio perfil, admin ve todos
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion'))
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- PROGRAMS: todos pueden ver programas activos, admin CRUD
CREATE POLICY "Anyone can view active programs" ON public.programs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage programs" ON public.programs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion'))
  );

-- COURSES: todos ven cursos activos, admin CRUD
CREATE POLICY "Anyone can view active courses" ON public.courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion'))
  );

-- MODULES: todos ven modulos activos, admin CRUD
CREATE POLICY "Anyone can view active modules" ON public.modules
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage modules" ON public.modules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion'))
  );

-- LESSONS: todos ven lecciones activas, admin CRUD
CREATE POLICY "Anyone can view active lessons" ON public.lessons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage lessons" ON public.lessons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion'))
  );

-- ENROLLMENTS: alumno ve sus inscripciones, admin ve/gestiona todas
CREATE POLICY "Users can view own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage enrollments" ON public.enrollments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion', 'finanzas'))
  );

-- PROGRESS: alumno ve/gestiona su propio progreso
CREATE POLICY "Users can manage own progress" ON public.progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" ON public.progress
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'coordinacion', 'docente'))
  );

-- PAYMENTS: alumno ve sus pagos, admin/finanzas gestionan
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage payments" ON public.payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'finanzas'))
  );

-- AI USAGE: alumno ve su uso, admin ve todo
CREATE POLICY "Users can view own ai usage" ON public.ai_usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai usage" ON public.ai_usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all ai usage" ON public.ai_usage_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- CERTIFICATES: alumno ve sus certificados, todos pueden verificar por codigo
CREATE POLICY "Users can view own certificates" ON public.certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can verify certificates" ON public.certificates
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage certificates" ON public.certificates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- ============================================
-- INDICES para performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_courses_program ON public.courses(program_id);
CREATE INDEX IF NOT EXISTS idx_modules_course ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_program ON public.enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON public.progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON public.ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON public.ai_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON public.certificates(code);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Hacer admin al usuario existente de Hector
UPDATE public.profiles
SET role = 'super_admin', full_name = 'Hector Velasco'
WHERE email = 'administracion@itseia.ai';

-- Programa: Preuniversitario
INSERT INTO public.programs (name, slug, description, type, price, duration_months, is_active) VALUES
('Preuniversitario IA', 'preuniversitario-ia', 'Preparate para tu carrera en Inteligencia Artificial. Nivelacion en matematicas, logica, programacion basica y fundamentos de IA.', 'preuni', 180.00, 3, true),
('Curso Express: IA para Profesionales', 'ia-profesionales-express', 'Domina las herramientas de IA mas potentes del mercado en semanas. ChatGPT, Claude, Gemini aplicados a tu profesion.', 'curso', 97.00, 1, true),
('Curso Estandar: IA Aplicada', 'ia-aplicada-estandar', 'Programa completo de IA aplicada con proyectos reales, mentoria y certificacion institucional ITSEIA.', 'curso', 197.00, 2, true),
('Curso Completo: Especialista IA', 'especialista-ia-completo', 'Conviertete en especialista certificado en IA. Incluye AI Lab multi-modelo, proyectos con empresas reales y portafolio profesional.', 'curso', 297.00, 3, true)
ON CONFLICT (slug) DO NOTHING;

-- Curso demo dentro de "IA para Profesionales Express"
INSERT INTO public.courses (program_id, name, slug, description, order_index, is_active)
SELECT p.id, 'Fundamentos de IA Generativa', 'fundamentos-ia-generativa', 'Aprende como funcionan ChatGPT, Claude y Gemini desde cero. Prompt engineering, casos de uso y aplicaciones profesionales.', 1, true
FROM public.programs p WHERE p.slug = 'ia-profesionales-express'
ON CONFLICT (program_id, slug) DO NOTHING;

-- Modulos del curso demo
INSERT INTO public.modules (course_id, name, order_index, is_active)
SELECT c.id, unnest(ARRAY[
  'Que es la IA Generativa',
  'Prompt Engineering Basico',
  'ChatGPT: Dominio Completo',
  'Claude: El Asistente Inteligente',
  'Gemini: La IA de Google',
  'IA en tu Profesion',
  'Proyecto Final'
]), unnest(ARRAY[1, 2, 3, 4, 5, 6, 7]), true
FROM public.courses c WHERE c.slug = 'fundamentos-ia-generativa';

-- Lecciones del primer modulo
INSERT INTO public.lessons (module_id, title, content_markdown, ai_prompt_suggested, order_index, duration_minutes, is_active)
SELECT m.id,
  unnest(ARRAY[
    'Bienvenida al Curso',
    'Historia de la IA: De Turing a ChatGPT',
    'Como funciona un modelo de lenguaje',
    'Tipos de IA: Narrow vs General vs Super',
    'El ecosistema actual: OpenAI, Anthropic, Google'
  ]),
  unnest(ARRAY[
    E'# Bienvenida al Curso de IA Generativa\n\nBienvenido al curso mas practico de Inteligencia Artificial en Ecuador.\n\n## Que vas a aprender\n\n- Como funcionan ChatGPT, Claude y Gemini por dentro\n- Prompt engineering: el arte de comunicarte con la IA\n- Aplicaciones reales en tu profesion\n- Construir tu primer proyecto con IA\n\n## Metodologia\n\nCada leccion tiene:\n1. **Teoria** (lo que estas leyendo ahora)\n2. **AI Lab** (el chat a tu derecha para practicar)\n3. **Ejercicio** (un reto para aplicar lo aprendido)\n\n## Tu primer ejercicio\n\nUsa el AI Lab a la derecha. Escribe: "Hola, soy nuevo. Explicame que es la IA en una oracion simple."\n\nObserva como responde. Eso es IA generativa en accion.',
    E'# Historia de la IA\n\n## 1950: Alan Turing\nTuring propuso la pregunta: "Pueden las maquinas pensar?"\n\nCreo el **Test de Turing**: si una maquina puede engañar a un humano haciendole creer que es otro humano, entonces "piensa".\n\n## 1956: Nace la IA\nEn la conferencia de Dartmouth, se acuño oficialmente el termino "Inteligencia Artificial".\n\n## 1997: Deep Blue\nIBM Deep Blue derroto al campeon mundial de ajedrez Garry Kasparov.\n\n## 2012: Deep Learning\nRedes neuronales profundas empiezan a superar metodos tradicionales en vision por computadora.\n\n## 2017: Transformers\nGoogle publica "Attention is All You Need". El paper que cambio todo.\n\n## 2022: ChatGPT\nOpenAI lanza ChatGPT y el mundo cambia para siempre. 100 millones de usuarios en 2 meses.\n\n## 2024-2026: La era multi-modelo\nClaude, Gemini, DeepSeek, Llama. La IA se democratiza.',
    E'# Como funciona un modelo de lenguaje\n\n## La idea central\nUn modelo de lenguaje (LLM) es un programa que **predice la siguiente palabra** basandose en todo lo que vino antes.\n\n## Ejemplo simple\nSi escribes: "El cielo es de color..."\nEl modelo calcula probabilidades:\n- azul: 85%\n- celeste: 8%\n- gris: 5%\n- otros: 2%\n\nY elige "azul" porque tiene la mayor probabilidad.\n\n## Tokens\nLos LLMs no leen palabras, leen **tokens** (pedazos de palabras).\n- "inteligencia" = ["int", "elig", "encia"] (3 tokens)\n- "AI" = ["AI"] (1 token)\n\n## Parametros\n- GPT-4: ~1.7 trillones de parametros\n- Claude 3: no revelado (~500B estimado)\n- Gemini Ultra: ~1.5 trillones\n\nMas parametros = mas "conocimiento" almacenado.',
    E'# Tipos de Inteligencia Artificial\n\n## IA Estrecha (Narrow AI) - LO QUE TENEMOS HOY\nIA que hace UNA cosa muy bien:\n- ChatGPT: genera texto\n- DALL-E: genera imagenes\n- AlphaFold: predice proteinas\n- Tesla Autopilot: conduce\n\n**Todos los productos de IA actuales son IA Estrecha.**\n\n## IA General (AGI) - EL OBJETIVO\nIA que puede hacer CUALQUIER tarea intelectual que un humano puede hacer.\n- Aprender nuevas tareas sin re-entrenamiento\n- Razonar, planificar, crear\n- Estimacion: 2027-2035\n\n## Super IA (ASI) - CIENCIA FICCION (por ahora)\nIA que supera a TODOS los humanos en TODAS las tareas.\n- Aun no existe\n- Tema de debate etico intenso\n\n## Para tu profesion\nNo necesitas AGI. La IA Estrecha actual ya puede:\n- Automatizar el 40% de tareas repetitivas\n- Analizar datos 1000x mas rapido\n- Generar reportes en segundos',
    E'# El Ecosistema de IA 2026\n\n## Los 4 Grandes\n\n### OpenAI (ChatGPT)\n- Modelo: GPT-4o, o1\n- Fortaleza: versatilidad, vision, razonamiento\n- Debilidad: precio alto para uso intensivo\n\n### Anthropic (Claude)\n- Modelo: Claude 3.5 Sonnet, Claude 3 Opus\n- Fortaleza: seguridad, textos largos (200K tokens), codigo\n- Debilidad: menos integraciones que OpenAI\n\n### Google (Gemini)\n- Modelo: Gemini 2.0 Flash, Ultra\n- Fortaleza: multimodal nativo, integracion Google\n- Debilidad: a veces menos preciso\n\n### Meta (Llama)\n- Modelo: Llama 3.1, 3.2\n- Fortaleza: open source, gratis, personalizable\n- Debilidad: requiere infraestructura propia\n\n## En ITSEIA\nTienes acceso a **Gemini** a traves del AI Lab.\nEn Fase 2 tendras: ChatGPT + Claude + Gemini + comparador.\n\n**Tu ventaja:** mientras otros pagan $20/mes por ChatGPT, tu lo tienes incluido en tu matricula.'
  ]),
  unnest(ARRAY[
    'Presentate al tutor IA. Dile tu nombre, tu profesion, y que esperas aprender en este curso. El tutor te dara consejos personalizados.',
    'Preguntale al tutor: "Cual fue el evento mas importante en la historia de la IA y por que?" Luego pregunta: "Como afecta eso a mi profesion hoy?"',
    'Pide al tutor que te explique como funciona un LLM usando una analogia con algo de tu vida cotidiana. Por ejemplo: "Explicame como funciona un LLM como si fuera un chef de cocina."',
    'Pregunta: "Dame 3 ejemplos concretos de como la IA estrecha puede ayudarme en mi trabajo diario como [tu profesion]."',
    'Pide al tutor: "Compara ChatGPT, Claude y Gemini. Cual me recomiendas para [tu profesion] y por que?"'
  ]),
  unnest(ARRAY[1, 2, 3, 4, 5]),
  unnest(ARRAY[10, 15, 20, 15, 15]),
  true
FROM public.modules m
JOIN public.courses c ON m.course_id = c.id
WHERE c.slug = 'fundamentos-ia-generativa' AND m.name = 'Que es la IA Generativa';

-- ============================================
-- VISTA para progreso de cursos (helper)
-- ============================================

CREATE OR REPLACE VIEW public.course_progress AS
SELECT
  e.user_id,
  c.id as course_id,
  c.name as course_name,
  c.program_id,
  COUNT(DISTINCT l.id) as total_lessons,
  COUNT(DISTINCT CASE WHEN p.completed THEN p.lesson_id END) as completed_lessons,
  CASE
    WHEN COUNT(DISTINCT l.id) > 0
    THEN ROUND((COUNT(DISTINCT CASE WHEN p.completed THEN p.lesson_id END)::DECIMAL / COUNT(DISTINCT l.id)) * 100)
    ELSE 0
  END as progress_percent
FROM public.enrollments e
JOIN public.courses c ON c.program_id = e.program_id
JOIN public.modules m ON m.course_id = c.id
JOIN public.lessons l ON l.module_id = m.id
LEFT JOIN public.progress p ON p.lesson_id = l.id AND p.user_id = e.user_id
WHERE e.status = 'active'
GROUP BY e.user_id, c.id, c.name, c.program_id;

COMMENT ON TABLE public.profiles IS 'Perfiles de usuarios ITSEIA Academy';
COMMENT ON TABLE public.programs IS 'Programas educativos (carreras, cursos, preuni)';
COMMENT ON TABLE public.courses IS 'Cursos/materias dentro de programas';
COMMENT ON TABLE public.modules IS 'Modulos dentro de cursos';
COMMENT ON TABLE public.lessons IS 'Lecciones con contenido y prompts IA';
COMMENT ON TABLE public.enrollments IS 'Inscripciones alumno-programa';
COMMENT ON TABLE public.progress IS 'Progreso por leccion por alumno';
COMMENT ON TABLE public.payments IS 'Registro de pagos';
COMMENT ON TABLE public.ai_usage_logs IS 'Registro de uso de API de IA';
COMMENT ON TABLE public.certificates IS 'Certificados emitidos';
