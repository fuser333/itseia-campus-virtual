-- ============================================================
-- ITSEIA Academy — Migration 017: Módulo Cursos Pro
-- Fecha: 2 jun 2026
-- Branch: feat/modulo-cursos-pro
-- ============================================================
-- Objetivo: schema aislado para cursos profesionales por cohorte
-- (primer curso: "IA aplicada a Admin de Salud" para Gisela Inca +
-- Josselin Montero · viernes 6 jun 2026 8 PM · 8 sesiones · 5 módulos · $99).
--
-- Reglas de oro respetadas:
--  • NO se modifica ninguna tabla existente (profiles, programs, sessions,
--    enrollments, recordings, etc.). Solo se AGREGAN tablas nuevas con
--    prefijo cursos_pro_*.
--  • RLS sigue el patrón de la migration 016: usar la función
--    public.get_user_role() (SECURITY DEFINER) que ya existe y es no recursiva.
--    NO replicamos el patrón de la migration 015 (EXISTS SELECT FROM profiles
--    inline), que es frágil.
--  • Aislamiento de fallos: si una query de profesional rompe, ningún
--    módulo existente (preuni, teacher, admin, carreras) se ve afectado.
--
-- Tablas creadas:
--   1. cursos_pro_courses          — un curso por cohorte
--   2. cursos_pro_modules          — agrupación pedagógica (5 módulos)
--   3. cursos_pro_sessions         — sesiones en vivo (8 por curso)
--   4. cursos_pro_enrollments      — quiénes están inscritos
--   5. cursos_pro_session_progress — qué sesiones marcó completas el alumno
--
-- Ruta definitiva: /cursos-pro (URL existente en producción).
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- Precheck: verificar que get_user_role() existe.
-- Si NO existe, abortamos con error claro (no reinventamos la rueda).
-- ──────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'get_user_role'
  ) THEN
    RAISE EXCEPTION
      'public.get_user_role() no existe. Aplicar primero la migration 016_fix_profiles_rls_recursion.sql antes de esta.';
  END IF;
END $$;

-- ============================================================
-- 1. cursos_pro_courses
-- ============================================================
-- Una fila = una cohorte de un curso profesional.
-- Si el mismo curso se vuelve a dar en otra cohorte, se crea otra fila
-- con un slug distinto (ej. ia-admin-salud-2026-06, ia-admin-salud-2026-08).
-- Esto se reevalúa después del MVP (puede separarse en course_templates
-- + course_cohorts si crece el catálogo).

CREATE TABLE IF NOT EXISTS public.cursos_pro_courses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  subtitle        TEXT,
  description     TEXT,
  category        TEXT,
  price_usd       NUMERIC(10,2) NOT NULL DEFAULT 99.00,
  total_hours     NUMERIC(5,1) NOT NULL DEFAULT 16.0,
  total_sessions  INT NOT NULL DEFAULT 8,
  total_modules   INT NOT NULL DEFAULT 5,
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  cover_image_url TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pc_dates_ok CHECK (end_date >= start_date),
  CONSTRAINT pc_price_ok CHECK (price_usd >= 0)
);

CREATE INDEX IF NOT EXISTS idx_pcourses_active_start
  ON public.cursos_pro_courses(is_active, start_date);

COMMENT ON TABLE public.cursos_pro_courses IS
  'Cohortes de Cursos Profesionales ITSEIA. Una fila por cohorte. Aislado de programs/courses.';

-- ============================================================
-- 2. cursos_pro_modules
-- ============================================================
-- Agrupación pedagógica dentro de un curso (5 módulos para el curso piloto).
-- Una sesión puede pertenecer a un módulo via cursos_pro_sessions.module_id.

CREATE TABLE IF NOT EXISTS public.cursos_pro_modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES public.cursos_pro_courses(id) ON DELETE CASCADE,
  num         INT NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  hours       NUMERIC(5,1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, num)
);

CREATE INDEX IF NOT EXISTS idx_pmodules_course
  ON public.cursos_pro_modules(course_id, num);

COMMENT ON TABLE public.cursos_pro_modules IS
  'Módulos pedagógicos dentro de un curso profesional. course_id → cursos_pro_courses.';

-- ============================================================
-- 3. cursos_pro_sessions
-- ============================================================
-- Sesiones en vivo del curso. Cada una tiene fecha programada,
-- meet_url para la clase live, y recording_url después de la clase.
-- Las 8 pestañas (video/presentación/teoría/quiz/ejercicio/ailab/recursos/grabaciones)
-- pueden colgar de columnas JSONB o de tablas auxiliares — MVP usa JSONB.

CREATE TABLE IF NOT EXISTS public.cursos_pro_sessions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id          UUID NOT NULL REFERENCES public.cursos_pro_courses(id) ON DELETE CASCADE,
  module_id          UUID REFERENCES public.cursos_pro_modules(id) ON DELETE SET NULL,
  num                INT NOT NULL,
  title              TEXT NOT NULL,
  description        TEXT,
  scheduled_at       TIMESTAMPTZ NOT NULL,
  duration_minutes   INT NOT NULL DEFAULT 60,
  meet_url           TEXT,
  recording_url      TEXT,
  recording_provider TEXT CHECK (recording_provider IS NULL OR recording_provider IN ('drive','youtube','vimeo','other')),
  video_url          TEXT,
  slides_url         TEXT,
  theory_md          TEXT,
  exercise_md        TEXT,
  quiz_json          JSONB NOT NULL DEFAULT '[]'::jsonb,
  resources_json     JSONB NOT NULL DEFAULT '[]'::jsonb,
  ailab_config_json  JSONB NOT NULL DEFAULT '{}'::jsonb,
  status             TEXT NOT NULL DEFAULT 'scheduled'
                     CHECK (status IN ('scheduled','live','done','cancelled')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, num)
);

CREATE INDEX IF NOT EXISTS idx_psessions_course_num
  ON public.cursos_pro_sessions(course_id, num);
CREATE INDEX IF NOT EXISTS idx_psessions_scheduled
  ON public.cursos_pro_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_psessions_module
  ON public.cursos_pro_sessions(module_id);

COMMENT ON TABLE public.cursos_pro_sessions IS
  'Sesiones del curso profesional. Una por clase en vivo. 8 pestañas en columnas JSONB.';

-- ============================================================
-- 4. cursos_pro_enrollments
-- ============================================================
-- Inscripción de un alumno a una cohorte. Solo se crea cuando hay
-- pago confirmado (Cohorte 1: transferencia Produbanco, alta manual por admin).

CREATE TABLE IF NOT EXISTS public.cursos_pro_enrollments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     UUID NOT NULL REFERENCES public.cursos_pro_courses(id) ON DELETE CASCADE,
  profile_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  paid_at       TIMESTAMPTZ,
  amount_paid   NUMERIC(10,2),
  payment_ref   TEXT,
  access_until  DATE,
  status        TEXT NOT NULL DEFAULT 'active'
                CHECK (status IN ('active','suspended','completed','refunded','cancelled')),
  enrolled_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes         TEXT,
  UNIQUE(course_id, profile_id)
);

CREATE INDEX IF NOT EXISTS idx_penrollments_profile_status
  ON public.cursos_pro_enrollments(profile_id, status);
CREATE INDEX IF NOT EXISTS idx_penrollments_course_status
  ON public.cursos_pro_enrollments(course_id, status);

COMMENT ON TABLE public.cursos_pro_enrollments IS
  'Inscripciones a cursos profesionales. UNIQUE(course_id, profile_id).';

-- ============================================================
-- 5. cursos_pro_session_progress
-- ============================================================
-- Tracking de qué sesiones vio/completó el alumno.

CREATE TABLE IF NOT EXISTS public.cursos_pro_session_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id   UUID NOT NULL REFERENCES public.cursos_pro_enrollments(id) ON DELETE CASCADE,
  session_id      UUID NOT NULL REFERENCES public.cursos_pro_sessions(id) ON DELETE CASCADE,
  watched         BOOLEAN NOT NULL DEFAULT false,
  watched_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  quiz_score      NUMERIC(5,2),
  notes           TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(enrollment_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_psprogress_enrollment
  ON public.cursos_pro_session_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_psprogress_session
  ON public.cursos_pro_session_progress(session_id);

COMMENT ON TABLE public.cursos_pro_session_progress IS
  'Progreso por sesión y por enrollment. UNIQUE(enrollment_id, session_id).';

-- ============================================================
-- updated_at triggers
-- ============================================================
-- Reusable function (idempotente)
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pcourses_updated_at ON public.cursos_pro_courses;
CREATE TRIGGER trg_pcourses_updated_at
  BEFORE UPDATE ON public.cursos_pro_courses
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

DROP TRIGGER IF EXISTS trg_psessions_updated_at ON public.cursos_pro_sessions;
CREATE TRIGGER trg_psessions_updated_at
  BEFORE UPDATE ON public.cursos_pro_sessions
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

DROP TRIGGER IF EXISTS trg_psprogress_updated_at ON public.cursos_pro_session_progress;
CREATE TRIGGER trg_psprogress_updated_at
  BEFORE UPDATE ON public.cursos_pro_session_progress
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- RLS — ENABLE
-- ============================================================

ALTER TABLE public.cursos_pro_courses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos_pro_modules          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos_pro_sessions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos_pro_enrollments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos_pro_session_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS — POLICIES
-- ============================================================
-- Patrón: get_user_role() (SECURITY DEFINER) en lugar de EXISTS SELECT FROM profiles.
-- Drop iterativo de cualquier policy preexistente con el mismo nombre — idempotente.

-- ─── cursos_pro_courses ────────────────────────────────────
-- Lectura:
--   • Cualquier autenticado puede VER cursos activos (catálogo público para alumnos
--     ya logueados). Cursos inactivos solo admin.
--   • Admin/coordinacion ven todos.
-- Escritura: solo admin/super_admin.

DROP POLICY IF EXISTS "pcourses_select_active" ON public.cursos_pro_courses;
CREATE POLICY "pcourses_select_active"
  ON public.cursos_pro_courses FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "pcourses_select_admin" ON public.cursos_pro_courses;
CREATE POLICY "pcourses_select_admin"
  ON public.cursos_pro_courses FOR SELECT
  TO authenticated
  USING (public.get_user_role() IN ('super_admin','admin','coordinacion'));

DROP POLICY IF EXISTS "pcourses_insert_admin" ON public.cursos_pro_courses;
CREATE POLICY "pcourses_insert_admin"
  ON public.cursos_pro_courses FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() IN ('super_admin','admin'));

DROP POLICY IF EXISTS "pcourses_update_admin" ON public.cursos_pro_courses;
CREATE POLICY "pcourses_update_admin"
  ON public.cursos_pro_courses FOR UPDATE
  TO authenticated
  USING (public.get_user_role() IN ('super_admin','admin'));

DROP POLICY IF EXISTS "pcourses_delete_admin" ON public.cursos_pro_courses;
CREATE POLICY "pcourses_delete_admin"
  ON public.cursos_pro_courses FOR DELETE
  TO authenticated
  USING (public.get_user_role() = 'super_admin');

-- ─── cursos_pro_modules ────────────────────────────────────
-- Lectura: cualquier autenticado puede leer módulos de cursos activos.
--          (No filtramos por enrollment porque el catálogo se muestra
--          en la landing /profesional-info pre-pago.)
-- Escritura: admin.

DROP POLICY IF EXISTS "pmodules_select_all" ON public.cursos_pro_modules;
CREATE POLICY "pmodules_select_all"
  ON public.cursos_pro_modules FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "pmodules_write_admin" ON public.cursos_pro_modules;
CREATE POLICY "pmodules_write_admin"
  ON public.cursos_pro_modules FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() IN ('super_admin','admin'));

DROP POLICY IF EXISTS "pmodules_update_admin" ON public.cursos_pro_modules;
CREATE POLICY "pmodules_update_admin"
  ON public.cursos_pro_modules FOR UPDATE
  TO authenticated
  USING (public.get_user_role() IN ('super_admin','admin'));

DROP POLICY IF EXISTS "pmodules_delete_admin" ON public.cursos_pro_modules;
CREATE POLICY "pmodules_delete_admin"
  ON public.cursos_pro_modules FOR DELETE
  TO authenticated
  USING (public.get_user_role() IN ('super_admin','admin'));

-- ─── cursos_pro_sessions ───────────────────────────────────
-- Lectura:
--   • Alumno: solo sesiones de cursos donde tiene enrollment activo.
--   • Admin/coordinacion/docente: todas.
-- Escritura: admin.

DROP POLICY IF EXISTS "psessions_select_enrolled" ON public.cursos_pro_sessions;
CREATE POLICY "psessions_select_enrolled"
  ON public.cursos_pro_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cursos_pro_enrollments e
      WHERE e.course_id = cursos_pro_sessions.course_id
        AND e.profile_id = auth.uid()
        AND e.status = 'active'
    )
  );

DROP POLICY IF EXISTS "psessions_select_staff" ON public.cursos_pro_sessions;
CREATE POLICY "psessions_select_staff"
  ON public.cursos_pro_sessions FOR SELECT
  TO authenticated
  USING (public.get_user_role() IN ('super_admin','admin','coordinacion','docente'));

DROP POLICY IF EXISTS "psessions_insert_admin" ON public.cursos_pro_sessions;
CREATE POLICY "psessions_insert_admin"
  ON public.cursos_pro_sessions FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() IN ('super_admin','admin'));

DROP POLICY IF EXISTS "psessions_update_admin" ON public.cursos_pro_sessions;
CREATE POLICY "psessions_update_admin"
  ON public.cursos_pro_sessions FOR UPDATE
  TO authenticated
  USING (public.get_user_role() IN ('super_admin','admin','coordinacion'));

DROP POLICY IF EXISTS "psessions_delete_admin" ON public.cursos_pro_sessions;
CREATE POLICY "psessions_delete_admin"
  ON public.cursos_pro_sessions FOR DELETE
  TO authenticated
  USING (public.get_user_role() IN ('super_admin','admin'));

-- ─── cursos_pro_enrollments ───────────────────────────────
-- Lectura:
--   • Alumno: solo sus propias inscripciones.
--   • Staff (admin/coordinacion/docente): todas.
-- Escritura: solo admin (alta manual hasta que PayPal esté listo).
--   Excepción: alumno puede crear su propia fila SOLO si paga via PayPal
--   (esto se habilita en una migration futura cuando integremos la pasarela).

DROP POLICY IF EXISTS "penrollments_select_own" ON public.cursos_pro_enrollments;
CREATE POLICY "penrollments_select_own"
  ON public.cursos_pro_enrollments FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "penrollments_select_staff" ON public.cursos_pro_enrollments;
CREATE POLICY "penrollments_select_staff"
  ON public.cursos_pro_enrollments FOR SELECT
  TO authenticated
  USING (public.get_user_role() IN ('super_admin','admin','coordinacion','docente'));

DROP POLICY IF EXISTS "penrollments_insert_admin" ON public.cursos_pro_enrollments;
CREATE POLICY "penrollments_insert_admin"
  ON public.cursos_pro_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() IN ('super_admin','admin'));

DROP POLICY IF EXISTS "penrollments_update_admin" ON public.cursos_pro_enrollments;
CREATE POLICY "penrollments_update_admin"
  ON public.cursos_pro_enrollments FOR UPDATE
  TO authenticated
  USING (public.get_user_role() IN ('super_admin','admin','coordinacion'));

DROP POLICY IF EXISTS "penrollments_delete_admin" ON public.cursos_pro_enrollments;
CREATE POLICY "penrollments_delete_admin"
  ON public.cursos_pro_enrollments FOR DELETE
  TO authenticated
  USING (public.get_user_role() = 'super_admin');

-- ─── cursos_pro_session_progress ──────────────────────────
-- Lectura:
--   • Alumno: solo su propio progreso (via enrollment).
--   • Staff: todo.
-- Escritura:
--   • Alumno: insert/update SOLO si el enrollment_id es suyo.
--   • Staff: todo.

DROP POLICY IF EXISTS "psprogress_select_own" ON public.cursos_pro_session_progress;
CREATE POLICY "psprogress_select_own"
  ON public.cursos_pro_session_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cursos_pro_enrollments e
      WHERE e.id = cursos_pro_session_progress.enrollment_id
        AND e.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "psprogress_select_staff" ON public.cursos_pro_session_progress;
CREATE POLICY "psprogress_select_staff"
  ON public.cursos_pro_session_progress FOR SELECT
  TO authenticated
  USING (public.get_user_role() IN ('super_admin','admin','coordinacion','docente'));

DROP POLICY IF EXISTS "psprogress_insert_own" ON public.cursos_pro_session_progress;
CREATE POLICY "psprogress_insert_own"
  ON public.cursos_pro_session_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cursos_pro_enrollments e
      WHERE e.id = cursos_pro_session_progress.enrollment_id
        AND e.profile_id = auth.uid()
        AND e.status = 'active'
    )
  );

DROP POLICY IF EXISTS "psprogress_update_own" ON public.cursos_pro_session_progress;
CREATE POLICY "psprogress_update_own"
  ON public.cursos_pro_session_progress FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cursos_pro_enrollments e
      WHERE e.id = cursos_pro_session_progress.enrollment_id
        AND e.profile_id = auth.uid()
        AND e.status = 'active'
    )
  );

DROP POLICY IF EXISTS "psprogress_admin_all" ON public.cursos_pro_session_progress;
CREATE POLICY "psprogress_admin_all"
  ON public.cursos_pro_session_progress FOR ALL
  TO authenticated
  USING (public.get_user_role() IN ('super_admin','admin','coordinacion'))
  WITH CHECK (public.get_user_role() IN ('super_admin','admin','coordinacion'));

-- ============================================================
-- Verificación post-aplicación (correr manualmente en Supabase SQL Editor)
-- ============================================================
-- 1. Tablas creadas:
--    SELECT tablename FROM pg_tables
--    WHERE schemaname='public' AND tablename LIKE 'cursos_pro_%'
--    ORDER BY tablename;
--    -- Esperado: 5 filas.
--
-- 2. RLS habilitado:
--    SELECT tablename, rowsecurity FROM pg_tables
--    WHERE schemaname='public' AND tablename LIKE 'cursos_pro_%';
--    -- Esperado: rowsecurity = true en las 5.
--
-- 3. Policies:
--    SELECT tablename, policyname, cmd
--    FROM pg_policies
--    WHERE schemaname='public' AND tablename LIKE 'cursos_pro_%'
--    ORDER BY tablename, policyname;
--    -- Esperado: ~23 policies.
--
-- 4. Test recursivo (regla blindada #4): correr desde Supabase como anon key
--    con auth.signInWithPassword de un alumno cualquiera (NO service role):
--    SELECT count(*) FROM public.cursos_pro_courses WHERE is_active = true;
--    -- Debe responder sin "infinite recursion".
--
-- 5. Test enrollment: como alumno autenticado SIN enrollment:
--    SELECT count(*) FROM public.cursos_pro_sessions;
--    -- Debe devolver 0.
-- ============================================================

-- ============================================================
-- NO SE APLICA EN REMOTO EN ESTE COMMIT.
-- Héctor revisa, aprueba, y aplica manualmente vía Supabase SQL Editor
-- (proyecto wqlselfapnggxxeziruo).
-- ============================================================
