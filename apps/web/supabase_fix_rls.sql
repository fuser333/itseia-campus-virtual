-- ============================================
-- ITSEIA Academy — Fix RLS Recursion (V3.1)
-- Problema: "infinite recursion detected in policy for relation profiles"
-- Causa: Las policies de V3 consultan profiles.role para verificar admin,
--        pero profiles tiene su propia policy que crea un ciclo.
-- Solucion: Usar auth.uid() directamente y SECURITY DEFINER functions
-- ============================================

-- 1. Crear funcion helper que obtiene el role sin pasar por RLS
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Fix PROFILES policies (la causa raiz)
-- Primero eliminar las policies problematicas
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;

-- Recrear sin recursion
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion'));

-- 3. Fix PROGRAMS policies
DROP POLICY IF EXISTS "Anyone can view active programs" ON public.programs;
DROP POLICY IF EXISTS "Admins can manage programs" ON public.programs;

CREATE POLICY "Anyone can view active programs" ON public.programs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage programs" ON public.programs
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin'));

-- 4. Fix ENROLLMENTS policies
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can manage enrollments" ON public.enrollments;

CREATE POLICY "Users can view own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage enrollments" ON public.enrollments
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'finanzas'));

-- 5. Fix PROGRESS policies
DROP POLICY IF EXISTS "Users can manage own progress" ON public.progress;
DROP POLICY IF EXISTS "Admins can view all progress" ON public.progress;

CREATE POLICY "Users can manage own progress" ON public.progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress" ON public.progress
  FOR SELECT USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'));

-- 6. Fix AI USAGE policies
DROP POLICY IF EXISTS "Users can view own ai usage" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Users can insert own ai usage" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Admins can view all ai usage" ON public.ai_usage_logs;

CREATE POLICY "Users can view own ai usage" ON public.ai_usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai usage" ON public.ai_usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all ai usage" ON public.ai_usage_logs
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin'));

-- 7. Fix PAYMENTS policies
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;

CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage payments" ON public.payments
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'finanzas'));

-- 8. Fix CERTIFICATES policies
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Anyone can verify certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admins can manage certificates" ON public.certificates;

CREATE POLICY "Users can view own certificates" ON public.certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can verify certificates" ON public.certificates
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage certificates" ON public.certificates
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin'));

-- 9. Fix V2 tables (badges, xp_events, etc.) - use get_user_role()
DROP POLICY IF EXISTS "Admins can manage badges" ON public.badges;
CREATE POLICY "Admins can manage badges" ON public.badges
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin'));

DROP POLICY IF EXISTS "Admins can view all user badges" ON public.user_badges;
DROP POLICY IF EXISTS "Admins can manage user badges" ON public.user_badges;
CREATE POLICY "Admins can view all user badges" ON public.user_badges
  FOR SELECT USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'));
CREATE POLICY "Admins can manage user badges" ON public.user_badges
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin'));

DROP POLICY IF EXISTS "Admins can view all xp events" ON public.xp_events;
DROP POLICY IF EXISTS "Admins can manage xp events" ON public.xp_events;
CREATE POLICY "Admins can view all xp events" ON public.xp_events
  FOR SELECT USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion'));
CREATE POLICY "Admins can manage xp events" ON public.xp_events
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin'));

DROP POLICY IF EXISTS "Admins can view all portfolio items" ON public.portfolio_items;
CREATE POLICY "Admins can view all portfolio items" ON public.portfolio_items
  FOR SELECT USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion'));

DROP POLICY IF EXISTS "Admins can manage paypal transactions" ON public.paypal_transactions;
CREATE POLICY "Admins can manage paypal transactions" ON public.paypal_transactions
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'finanzas'));

-- 10. Fix V3 tables - use get_user_role() for all admin policies
-- Semesters
DROP POLICY IF EXISTS "Admins can manage semesters" ON public.semesters;
CREATE POLICY "Admins can manage semesters" ON public.semesters
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin'));

-- Subjects
DROP POLICY IF EXISTS "Admins can manage subjects" ON public.subjects;
CREATE POLICY "Admins can manage subjects" ON public.subjects
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion'));

-- Sessions
DROP POLICY IF EXISTS "Admins can manage sessions" ON public.sessions;
CREATE POLICY "Admins can manage sessions" ON public.sessions
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'));

-- Quizzes
DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
CREATE POLICY "Admins can manage quizzes" ON public.quizzes
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'));

-- Quiz Questions
DROP POLICY IF EXISTS "Admins can manage quiz questions" ON public.quiz_questions;
CREATE POLICY "Admins can manage quiz questions" ON public.quiz_questions
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'));

-- Quiz Attempts
DROP POLICY IF EXISTS "Admins can view all quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Admins can view all quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'));

-- Assignments
DROP POLICY IF EXISTS "Admins can manage assignments" ON public.assignments;
CREATE POLICY "Admins can manage assignments" ON public.assignments
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'));

-- Submissions
DROP POLICY IF EXISTS "Teachers can view subject submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can manage submissions" ON public.submissions;
CREATE POLICY "Admins can manage submissions" ON public.submissions
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'));

-- Session Progress
DROP POLICY IF EXISTS "Admins can view all session progress" ON public.session_progress;
CREATE POLICY "Admins can view all session progress" ON public.session_progress
  FOR SELECT USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'));

-- Session Resources (already public read, just fix admin)
DROP POLICY IF EXISTS "Admins can manage session resources" ON public.session_resources;
CREATE POLICY "Admins can manage session resources" ON public.session_resources
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'));

-- 11. Fix COURSES/MODULES/LESSONS (V1 tables that also had the recursion issue)
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion'));

DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;
CREATE POLICY "Admins can manage modules" ON public.modules
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion'));

DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;
CREATE POLICY "Admins can manage lessons" ON public.lessons
  FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion'));

-- 12. Enroll admin in IA carrera
INSERT INTO public.enrollments (user_id, program_id, status)
SELECT '91975086-999d-4f8f-9509-747726f6ee41', p.id, 'active'
FROM public.programs p WHERE p.slug = 'inteligencia-artificial'
ON CONFLICT (user_id, program_id) DO NOTHING;

-- ============================================
-- FIN — V3.1 RLS Fix
-- Esto resuelve: carreras vacias, perfil infinito, dashboard vacio
-- ============================================
