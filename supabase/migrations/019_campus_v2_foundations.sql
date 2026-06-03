-- ============================================================================
-- Migration 019 · Campus v2 Foundations · Opción B (config YAML por producto)
-- ----------------------------------------------------------------------------
-- 3 jun 2026 · FASE 1 del rediseño Campus v2.
--
-- Crea 3 tablas nuevas que sostienen el modelo unificado alumno/docente:
--   1) docente_cohorte_assignments  → N:N entre docentes y cohortes (multi-producto)
--   2) cohorte_metadata             → metadata estructurada de cada cohorte
--   3) cohorte_sesiones             → sesiones de la cohorte (recording, status)
--
-- Patrón seguro (heredado de migración 016):
--   · DROP idempotente de policies con bloque DO $$
--   · CREATE TABLE IF NOT EXISTS
--   · RLS habilitado SIEMPRE
--   · Policies usan get_user_role() (SECURITY DEFINER, NO recursiva)
--   · Indexes para queries comunes
--
-- ⚠️ NO SE APLICA EN REMOTO EN ESTE COMMIT.
--    Héctor la revisa y la aplica vía Supabase SQL Editor del proyecto
--    wqlselfapnggxxeziruo.
-- ============================================================================


-- ============================================================================
-- 1) docente_cohorte_assignments
-- ----------------------------------------------------------------------------
-- Asocia un docente a una cohorte específica de un producto.
-- Un docente puede tener N cohortes en M productos (multi-producto real).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.docente_cohorte_assignments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  docente_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  producto         TEXT NOT NULL,                        -- 'preuni', 'cursos-pro', 'bootcamp', etc.
  cohorte_slug     TEXT NOT NULL,                        -- 'cohorte-jun-2026', 'inca-gisela'
  rol_en_cohorte   TEXT NOT NULL DEFAULT 'titular',      -- 'titular' | 'asistente'
  fecha_asignacion DATE NOT NULL DEFAULT CURRENT_DATE,
  activo           BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (docente_id, producto, cohorte_slug)
);

CREATE INDEX IF NOT EXISTS idx_dca_docente
  ON public.docente_cohorte_assignments(docente_id, activo);

CREATE INDEX IF NOT EXISTS idx_dca_cohorte
  ON public.docente_cohorte_assignments(producto, cohorte_slug);

ALTER TABLE public.docente_cohorte_assignments ENABLE ROW LEVEL SECURITY;

-- Drop idempotente de TODAS las policies de esta tabla antes de recrearlas
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'docente_cohorte_assignments'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.docente_cohorte_assignments', pol.policyname);
  END LOOP;
END $$;

-- Lectura: el docente ve sus propias filas
CREATE POLICY "dca_select_own"
  ON public.docente_cohorte_assignments
  FOR SELECT
  TO authenticated
  USING (docente_id = auth.uid());

-- Lectura admin/coordinacion: ven todas las filas
CREATE POLICY "dca_select_admin"
  ON public.docente_cohorte_assignments
  FOR SELECT
  TO authenticated
  USING (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion'));

-- Escritura: solo super_admin crea/edita assignments (admin puede ser muy peligroso)
CREATE POLICY "dca_insert_super_admin"
  ON public.docente_cohorte_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() = 'super_admin');

CREATE POLICY "dca_update_super_admin"
  ON public.docente_cohorte_assignments
  FOR UPDATE
  TO authenticated
  USING      (public.get_user_role() = 'super_admin')
  WITH CHECK (public.get_user_role() = 'super_admin');

CREATE POLICY "dca_delete_super_admin"
  ON public.docente_cohorte_assignments
  FOR DELETE
  TO authenticated
  USING (public.get_user_role() = 'super_admin');


-- ============================================================================
-- 2) cohorte_metadata
-- ----------------------------------------------------------------------------
-- Info estructurada de cada cohorte (visible en UI + usada por sidebar docente).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.cohorte_metadata (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto           TEXT NOT NULL,
  cohorte_slug       TEXT NOT NULL,
  nombre_publico     TEXT NOT NULL,                          -- "Cohorte Junio 2026" o "Gisela Inca - Admin Salud"
  fecha_inicio       DATE NOT NULL,
  fecha_fin          DATE,
  meet_url           TEXT,
  meet_calendar_url  TEXT,
  estado             TEXT NOT NULL DEFAULT 'planificada',    -- planificada | activa | finalizada | cancelada
  cliente_referencia TEXT,                                   -- nombre del cliente real (B2B, cursos pro 1:1)
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (producto, cohorte_slug)
);

CREATE INDEX IF NOT EXISTS idx_cohorte_meta_estado
  ON public.cohorte_metadata(producto, estado);

CREATE INDEX IF NOT EXISTS idx_cohorte_meta_producto
  ON public.cohorte_metadata(producto);

ALTER TABLE public.cohorte_metadata ENABLE ROW LEVEL SECURITY;

-- Drop idempotente de TODAS las policies de esta tabla
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'cohorte_metadata'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.cohorte_metadata', pol.policyname);
  END LOOP;
END $$;

-- Lectura: cualquier autenticado puede leer la metadata de cohortes
-- (la información del nombre publico y horarios no es sensible; quién accede
-- al contenido se controla a nivel de enrollments + assignments).
CREATE POLICY "cohorte_meta_select_authenticated"
  ON public.cohorte_metadata
  FOR SELECT
  TO authenticated
  USING (true);

-- Escritura: solo super_admin y admin gestionan cohortes
CREATE POLICY "cohorte_meta_insert_admin"
  ON public.cohorte_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "cohorte_meta_update_admin"
  ON public.cohorte_metadata
  FOR UPDATE
  TO authenticated
  USING      (public.get_user_role() IN ('super_admin', 'admin'))
  WITH CHECK (public.get_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "cohorte_meta_delete_super_admin"
  ON public.cohorte_metadata
  FOR DELETE
  TO authenticated
  USING (public.get_user_role() = 'super_admin');


-- ============================================================================
-- 3) cohorte_sesiones
-- ----------------------------------------------------------------------------
-- Sesiones individuales de cada cohorte. cursos_pro_sessions sigue intacto para
-- cursos profesionales actuales; esta tabla es la genérica del nuevo sistema
-- unificado.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.cohorte_sesiones (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohorte_id         UUID NOT NULL REFERENCES public.cohorte_metadata(id) ON DELETE CASCADE,
  numero             INT  NOT NULL,
  titulo             TEXT NOT NULL,
  fecha_programada   TIMESTAMPTZ,
  duracion_minutos   INT NOT NULL DEFAULT 120,
  meet_url           TEXT,
  recording_url      TEXT,
  recording_provider TEXT,                            -- 'google_meet' | 'youtube' | etc.
  status             TEXT NOT NULL DEFAULT 'scheduled',  -- scheduled | live | done | cancelled
  contenido_path     TEXT,                            -- ruta a /content/cohortes/<producto>/<cohorte>/sesiones/sNN/
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cohorte_id, numero)
);

CREATE INDEX IF NOT EXISTS idx_cohorte_ses_cohorte
  ON public.cohorte_sesiones(cohorte_id, numero);

CREATE INDEX IF NOT EXISTS idx_cohorte_ses_status
  ON public.cohorte_sesiones(status);

CREATE INDEX IF NOT EXISTS idx_cohorte_ses_fecha
  ON public.cohorte_sesiones(fecha_programada);

ALTER TABLE public.cohorte_sesiones ENABLE ROW LEVEL SECURITY;

-- Drop idempotente de TODAS las policies de esta tabla
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'cohorte_sesiones'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.cohorte_sesiones', pol.policyname);
  END LOOP;
END $$;

-- Lectura: cualquier autenticado puede leer (el filtrado por cohorte se hace
-- en la app via enrollments / assignments; la info de sesión NO es sensible).
CREATE POLICY "cohorte_ses_select_authenticated"
  ON public.cohorte_sesiones
  FOR SELECT
  TO authenticated
  USING (true);

-- Escritura: admins gestionan + docentes pueden updatear status (iniciar/finalizar grabación)
CREATE POLICY "cohorte_ses_insert_admin"
  ON public.cohorte_sesiones
  FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion'));

CREATE POLICY "cohorte_ses_update_docente_admin"
  ON public.cohorte_sesiones
  FOR UPDATE
  TO authenticated
  USING      (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'))
  WITH CHECK (public.get_user_role() IN ('super_admin', 'admin', 'coordinacion', 'docente'));

CREATE POLICY "cohorte_ses_delete_admin"
  ON public.cohorte_sesiones
  FOR DELETE
  TO authenticated
  USING (public.get_user_role() IN ('super_admin', 'admin'));


-- ============================================================================
-- VERIFICACIÓN (correr en SQL Editor después de aplicar)
-- ============================================================================
-- SELECT tablename, COUNT(*) AS num_policies
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND tablename IN ('docente_cohorte_assignments', 'cohorte_metadata', 'cohorte_sesiones')
-- GROUP BY tablename
-- ORDER BY tablename;
--
-- Esperado:
--   cohorte_metadata             | 4
--   cohorte_sesiones             | 4
--   docente_cohorte_assignments  | 5
-- ============================================================================
--
-- ⚠️ NO SE APLICA EN REMOTO EN ESTE COMMIT.
-- ============================================================================
