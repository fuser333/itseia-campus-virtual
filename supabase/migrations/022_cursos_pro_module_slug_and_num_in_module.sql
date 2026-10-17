-- ============================================================
-- ITSEIA Academy — Migration 022: Module slug + num_in_module
-- Fecha: 2026-06-05
-- Propósito: Agregar slug a cursos_pro_modules y num_in_module
--   a cursos_pro_sessions para soportar URL canónica:
--   /cursos-pro/[courseSlug]/modulo/[moduleSlug]/sesion/[num]
-- ============================================================
--
-- IDEMPOTENTE: segura de correr aunque la 021 haya sido aplicada
-- parcialmente. Usa IF NOT EXISTS y WHERE IS NULL en todos los pasos.
--
-- ABORT si cursos_pro_modules no existe.
-- NO sobreescribe slugs ya poblados.
-- NO modifica ninguna otra tabla.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 0. Precheck: cursos_pro_modules debe existir
-- ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public'
      AND c.relname = 'cursos_pro_modules'
      AND c.relkind = 'r'
  ) THEN
    RAISE EXCEPTION
      'La tabla cursos_pro_modules NO existe. Aplicar primero migration 017_cursos_pro_courses.sql antes de esta.';
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- 1. Agregar columna slug a cursos_pro_modules
--    (nullable primero → backfill → índice único)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.cursos_pro_modules
  ADD COLUMN IF NOT EXISTS slug TEXT;

COMMENT ON COLUMN public.cursos_pro_modules.slug IS
  'URL slug del módulo. Ej: m1-fundamentos-ia-lopdp. Requerido para ruta /modulo/[slug]/.';

-- ─────────────────────────────────────────────────────────────
-- 2. Agregar columna num_in_module a cursos_pro_sessions
--    (posición relativa dentro del módulo, 1-N)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.cursos_pro_sessions
  ADD COLUMN IF NOT EXISTS num_in_module INT;

COMMENT ON COLUMN public.cursos_pro_sessions.num_in_module IS
  'Número de la sesión dentro del módulo (1-N). Para URL /sesion/[num_in_module].';

-- ─────────────────────────────────────────────────────────────
-- 3. Backfill slug para módulos del curso admin-salud
--    Mapeo por num (coincide con la estructura real en producción):
--      1 → m1-fundamentos-ia-lopdp
--      2 → m2-stack-profesional-ia
--      3 → m3-gestion-operativa-ia
--      4 → m4-facturacion-power-bi-cierre
--      5 → m5-proyecto-final  (sin sesiones en cohorte 1)
--    Para cualquier num > 5: slug genérico m{N}-modulo.
--    CONDICIÓN: WHERE slug IS NULL — no sobreescribe slugs ya poblados.
-- ─────────────────────────────────────────────────────────────
UPDATE public.cursos_pro_modules m
SET slug = CASE m.num
  WHEN 1 THEN 'm1-fundamentos-ia-lopdp'
  WHEN 2 THEN 'm2-stack-profesional-ia'
  WHEN 3 THEN 'm3-gestion-operativa-ia'
  WHEN 4 THEN 'm4-facturacion-power-bi-cierre'
  WHEN 5 THEN 'm5-proyecto-final'
  ELSE 'm' || m.num || '-modulo'
END
WHERE m.slug IS NULL
  AND m.course_id = (
    SELECT id FROM public.cursos_pro_courses
    WHERE slug = 'admin-salud'
    LIMIT 1
  );

-- Backfill genérico para módulos de otros cursos que no tengan slug
-- (por si existen o se crean antes de que tengan slug propio):
UPDATE public.cursos_pro_modules m
SET slug = 'm' || m.num || '-modulo'
WHERE m.slug IS NULL;

-- ─────────────────────────────────────────────────────────────
-- 4. Backfill num_in_module para sesiones de admin-salud
--    ROW_NUMBER() particionado por (course_id, module_id) ORDER BY num ASC.
--    Resultado esperado: 5 sesiones × 4 módulos = 1..5 por módulo.
--    CONDICIÓN: WHERE num_in_module IS NULL — idempotente.
-- ─────────────────────────────────────────────────────────────
UPDATE public.cursos_pro_sessions s
SET num_in_module = ranked.rn
FROM (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY course_id, module_id
      ORDER BY num ASC
    ) AS rn
  FROM public.cursos_pro_sessions
  WHERE num_in_module IS NULL
) AS ranked
WHERE s.id = ranked.id;

-- ─────────────────────────────────────────────────────────────
-- 5. Índices
-- ─────────────────────────────────────────────────────────────

-- Índice para búsqueda por módulo + posición intra-módulo
CREATE INDEX IF NOT EXISTS idx_psessions_module_num_in
  ON public.cursos_pro_sessions(module_id, num_in_module);

-- Índice único (course_id, slug) sobre módulos con slug poblado
-- Garantiza que no haya dos módulos del mismo curso con el mismo slug.
CREATE UNIQUE INDEX IF NOT EXISTS idx_pmodules_course_slug
  ON public.cursos_pro_modules(course_id, slug)
  WHERE slug IS NOT NULL;

-- ─────────────────────────────────────────────────────────────
-- 6. Verificación integrada (ejecutar para confirmar post-apply)
-- ─────────────────────────────────────────────────────────────
-- Módulos de admin-salud con slug:
--   SELECT num, name, slug
--   FROM public.cursos_pro_modules
--   WHERE course_id = (SELECT id FROM cursos_pro_courses WHERE slug = 'admin-salud')
--   ORDER BY num;
--   -- Esperado: 5 filas, ningún slug NULL.
--
-- Sesiones de admin-salud con num_in_module:
--   SELECT s.num, s.num_in_module, s.title, m.slug AS module_slug
--   FROM public.cursos_pro_sessions s
--   JOIN public.cursos_pro_modules m ON m.id = s.module_id
--   WHERE s.course_id = (SELECT id FROM cursos_pro_courses WHERE slug = 'admin-salud')
--   ORDER BY s.num;
--   -- Esperado: 20 filas, num_in_module 1..5 por cada módulo M1-M4,
--   --           ningún num_in_module NULL.
--
-- Conteo de NULLs (debe ser 0 en admin-salud):
--   SELECT
--     COUNT(*) FILTER (WHERE m.slug IS NULL) AS modulos_sin_slug,
--     COUNT(*) FILTER (WHERE s.num_in_module IS NULL) AS sesiones_sin_num
--   FROM public.cursos_pro_sessions s
--   JOIN public.cursos_pro_modules m ON m.id = s.module_id
--   WHERE s.course_id = (SELECT id FROM cursos_pro_courses WHERE slug = 'admin-salud');
-- ============================================================
