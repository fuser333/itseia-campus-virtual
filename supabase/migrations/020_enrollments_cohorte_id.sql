-- ============================================================================
-- Migration 020 · Enrollments → cohortes (Campus v2 FASE 6)
-- ----------------------------------------------------------------------------
-- 8 jun 2026 · FASE 6 del rediseño Campus v2.
--
-- Vincula cada matrícula a una cohorte específica.
--
-- 100% ADITIVA — agrega 2 columnas nuevas a `enrollments` y nada más.
-- No modifica columnas existentes, no toca RLS existente, no rompe queries
-- legacy (52 archivos del front siguen funcionando: `program_id`, `user_id`,
-- `status` permanecen intactos).
--
-- ⚠️ Requiere migración 019 aplicada (existe `cohorte_metadata`).
--
-- Patrón seguro (heredado de migraciones 016/019):
--   · ALTER TABLE ... ADD COLUMN IF NOT EXISTS  (idempotente)
--   · No DROP, no RENAME, no CHECK destructivo
--   · FK suave a `cohorte_metadata(producto, cohorte_slug)` via composite
--     UNIQUE — porque cada cohorte ya es única por (producto, cohorte_slug)
-- ============================================================================


-- ============================================================================
-- 1) Pre-condición: índice UNIQUE en cohorte_metadata(producto, cohorte_slug)
-- ----------------------------------------------------------------------------
-- La migración 019 ya declara UNIQUE(producto, cohorte_slug). Lo verificamos
-- vía `DO $$` (no falla si ya existe).
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.cohorte_metadata'::regclass
      AND contype = 'u'
      AND conname IN ('cohorte_metadata_producto_cohorte_slug_key')
  ) THEN
    -- Por si la 019 fue editada manualmente y se perdió el UNIQUE
    ALTER TABLE public.cohorte_metadata
      ADD CONSTRAINT cohorte_metadata_producto_cohorte_slug_key
      UNIQUE (producto, cohorte_slug);
  END IF;
END $$;


-- ============================================================================
-- 2) Columnas nuevas en `enrollments`
-- ----------------------------------------------------------------------------
-- · producto      → 'preuni' | 'cursos-pro' | 'bootcamp' | 'carrera' | etc.
-- · cohorte_slug  → 'cohorte-jun-2026' | 'inca-gisela' | etc.
--
-- Ambas NULL por defecto para no romper inserts legacy del checkout / admin.
-- La aplicación llena estos campos cuando crea matrículas nuevas.
-- ============================================================================

ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS producto TEXT;

ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS cohorte_slug TEXT;


-- ============================================================================
-- 3) Foreign key compuesta enrollments → cohorte_metadata
-- ----------------------------------------------------------------------------
-- Usa el UNIQUE (producto, cohorte_slug) de cohorte_metadata como destino.
-- ON DELETE SET NULL para que borrar una cohorte no rompa enrollments
-- históricos (auditoría/contabilidad).
--
-- DEFERRABLE INITIALLY DEFERRED → permite hacer la migración de datos en una
-- transacción donde primero se inserta la cohorte y después se vincula.
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.enrollments'::regclass
      AND conname = 'enrollments_cohorte_fk'
  ) THEN
    ALTER TABLE public.enrollments
      ADD CONSTRAINT enrollments_cohorte_fk
      FOREIGN KEY (producto, cohorte_slug)
      REFERENCES public.cohorte_metadata(producto, cohorte_slug)
      ON UPDATE CASCADE
      ON DELETE SET NULL
      DEFERRABLE INITIALLY DEFERRED;
  END IF;
END $$;


-- ============================================================================
-- 4) Índices para queries comunes
-- ----------------------------------------------------------------------------
-- Buscar enrollments por (producto, cohorte) — caso típico del panel admin.
-- Buscar enrollments por (user_id, producto) — caso típico del shell alumno.
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_enrollments_cohorte
  ON public.enrollments(producto, cohorte_slug);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_producto
  ON public.enrollments(user_id, producto)
  WHERE producto IS NOT NULL;


-- ============================================================================
-- 5) Comentarios documentales
-- ============================================================================

COMMENT ON COLUMN public.enrollments.producto IS
  'Producto al que pertenece esta matricula. preuni | cursos-pro | bootcamp | carrera | b2b | certificacion. NULL = matricula legacy pre Campus v2.';

COMMENT ON COLUMN public.enrollments.cohorte_slug IS
  'Slug de la cohorte en cohorte_metadata. Composite FK con producto. NULL = matricula legacy o programa sin cohortes activas.';


-- ============================================================================
-- VERIFICACIÓN (correr en SQL Editor después de aplicar)
-- ============================================================================
-- 1) Verifica columnas:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'enrollments'
--   AND column_name IN ('producto', 'cohorte_slug');
--
-- Esperado: 2 filas, ambas text, ambas YES nullable.
--
-- 2) Verifica FK:
-- SELECT conname FROM pg_constraint
-- WHERE conrelid = 'public.enrollments'::regclass AND conname = 'enrollments_cohorte_fk';
--
-- 3) Verifica índices:
-- SELECT indexname FROM pg_indexes
-- WHERE schemaname = 'public' AND tablename = 'enrollments'
--   AND indexname IN ('idx_enrollments_cohorte', 'idx_enrollments_user_producto');
-- ============================================================================
