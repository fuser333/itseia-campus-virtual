-- ============================================================================
-- Migration 018 · Permitir UPDATE de cursos_pro_sessions al rol docente
-- ============================================================================
-- Contexto: la migration 017 dejó la policy `psessions_update_admin` solo para
-- super_admin / admin / coordinacion. Esto impedía que un usuario con
-- role='docente' use el botón "INICIAR CLASE CON GRABACIÓN" (que hace UPDATE
-- a status='live' y luego status='done'). El CEO confirmó que docente debe
-- poder iniciar/finalizar la clase.
--
-- Patrón seguro (migración 016): DROP idempotente + CREATE con get_user_role()
-- SECURITY DEFINER. NO usar EXISTS SELECT FROM profiles inline.
-- ============================================================================

DROP POLICY IF EXISTS psessions_update_admin ON cursos_pro_sessions;

CREATE POLICY psessions_update_admin
  ON cursos_pro_sessions
  FOR UPDATE
  TO authenticated
  USING      (get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'))
  WITH CHECK (get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'));

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
-- Debe devolver una fila con los 4 roles permitidos en USING.
SELECT
  pol.policyname,
  pol.cmd      AS verbo,
  pol.qual     AS using_expr,
  pol.with_check AS check_expr
FROM pg_policies pol
WHERE pol.tablename = 'cursos_pro_sessions'
  AND pol.policyname = 'psessions_update_admin';

-- ============================================================================
-- NO SE APLICA EN REMOTO EN ESTE COMMIT.
-- Héctor revisa, aprueba y aplica manualmente vía Supabase SQL Editor
-- (proyecto wqlselfapnggxxeziruo).
-- ============================================================================
