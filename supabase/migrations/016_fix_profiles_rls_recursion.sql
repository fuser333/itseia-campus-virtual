-- ============================================================
-- ITSEIA — Migration 016: Fix infinite recursion en RLS de profiles
-- 30 may 2026
-- ============================================================
-- Problema: cualquier SELECT a profiles desde usuario autenticado falla con:
--   "infinite recursion detected in policy for relation profiles"
--
-- Causa: existe (al menos) una policy adicional en profiles que se evalúa
-- recursivamente. La función helper get_user_role() está bien (SECURITY
-- DEFINER bypassa RLS), pero hay otras policies que probablemente leen
-- de profiles sin SECURITY DEFINER.
--
-- Fix: drop TODAS las policies conocidas + cualquier otra que pudiera existir,
-- y recrear con set mínimo, seguro y NO recursivo.
-- ============================================================

-- Paso 1: drop TODAS las policies posibles (las que conozco + nombres comunes)
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
  END LOOP;
END $$;

-- Paso 2: asegurar que get_user_role() existe y es SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Paso 3: recrear las 4 policies necesarias, NO recursivas
-- ─────────────────────────────────────────────────────────

-- 3.1 Ver tu propio profile (sin recursión: comparación directa de IDs)
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 3.2 Actualizar tu propio profile
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 3.3 Insertar tu propio profile (post sign-up trigger)
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 3.4 Admins (super_admin, admin, coordinacion) pueden ver TODOS los profiles
--     Usa get_user_role() que es SECURITY DEFINER → NO recursivo
CREATE POLICY "profiles_select_admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion'));

-- 3.5 Admins pueden hacer UPDATE/DELETE de cualquier profile
CREATE POLICY "profiles_update_admin"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.get_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "profiles_delete_admin"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (public.get_user_role() = 'super_admin');

-- ─────────────────────────────────────────────────────────
-- Verificación: listar policies recreadas
-- (Esta query se puede correr en el SQL Editor de Supabase para verificar)
-- ─────────────────────────────────────────────────────────
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename='profiles' AND schemaname='public';
