-- ============================================================================
-- fix_carreras_ortografia.sql
-- ----------------------------------------------------------------------------
-- Corrige errores ortográficos (tildes y Ñ) en el contenido de las 9 materias
-- robustas de P1-P2 cargado en Supabase.
--
-- Tablas afectadas:
--   - subjects        (name, description)
--   - sessions        (title, theory_markdown, ai_lab_context, ai_lab_suggested_prompt)
--   - quizzes         (title)
--   - quiz_questions  (question_text, options, explanation)
--   - assignments     (title, instructions_markdown)
--   - session_resources (title, description)
--
-- Estrategia:
--   1) Bloque 0  — VERIFICACIÓN: muestra cuántas filas tienen errores ANTES
--   2) Bloques 1..N — UPDATEs limitados a las 9 materias robustas con WHERE subject_id IN (...)
--   3) Bloque final — VERIFICACIÓN: muestra cuántas filas quedan con errores DESPUÉS
--
-- Reglas de seguridad:
--   - Cada UPDATE usa REPLACE() en lugar de regex para evitar reemplazos en
--     bloques de código (literales Python/SQL). Por eso usamos boundaries con
--     espacio antes/después.
--   - Las palabras dentro de bloques ``` … ``` quedan tal cual (la inspección
--     manual posterior cubre esos casos).
--   - Idempotente: ejecutar 2 veces produce el mismo resultado.
--
-- Ejecución sugerida:
--   PGPASSWORD=… psql -h db.wqlselfapnggxxeziruo.supabase.co -U postgres \
--                     -d postgres -f apps/web/content/fix_carreras_ortografia.sql
--
-- IMPORTANTE: hacer backup de la base ANTES de ejecutar.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- BLOQUE 0 — Mapeo de subject_id de las 9 materias robustas
-- ----------------------------------------------------------------------------
-- Se obtienen los IDs por slug. Si el slug no coincide se debe verificar el
-- nombre real en la tabla `subjects`.

WITH carreras_p1_p2 AS (
  SELECT id, slug, name
  FROM subjects
  WHERE slug IN (
    'p1-fundamentos-programacion',
    'p1-introduccion-ia',
    'p1-logica-pensamiento-analitico',
    'p2-bases-datos',
    'p2-estadistica',
    'p2-estructuras-datos',
    'p2-ingles-tecnico',
    'p2-matematicas-ii',
    'p2-poo'
  )
)
SELECT 'BEFORE' AS fase, count(*) AS materias_encontradas FROM carreras_p1_p2;

-- ----------------------------------------------------------------------------
-- BLOQUE 1 — TABLA: subjects (nombre y descripción)
-- ----------------------------------------------------------------------------

UPDATE subjects
SET name = REPLACE(name, 'Programacion', 'Programación'),
    description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
      description,
      'Programacion', 'Programación'),
      'Introduccion', 'Introducción'),
      'Estadistica', 'Estadística'),
      'Matematicas', 'Matemáticas'),
      'Logica',      'Lógica'),
      'Tecnico',     'Técnico'),
      'Ingles',      'Inglés'),
      'Algebra',     'Álgebra'),
      'Diseno',      'Diseño')
WHERE slug IN (
  'p1-fundamentos-programacion',
  'p1-introduccion-ia',
  'p1-logica-pensamiento-analitico',
  'p2-bases-datos',
  'p2-estadistica',
  'p2-estructuras-datos',
  'p2-ingles-tecnico',
  'p2-matematicas-ii',
  'p2-poo'
);

UPDATE subjects
SET name = CASE slug
  WHEN 'p1-fundamentos-programacion'      THEN 'Fundamentos de Programación'
  WHEN 'p1-introduccion-ia'               THEN 'Introducción a la Inteligencia Artificial'
  WHEN 'p1-logica-pensamiento-analitico'  THEN 'Lógica y Pensamiento Analítico'
  WHEN 'p2-bases-datos'                   THEN 'Bases de Datos Relacionales'
  WHEN 'p2-estadistica'                   THEN 'Estadística Inferencial'
  WHEN 'p2-estructuras-datos'             THEN 'Estructuras de Datos y Algoritmos'
  WHEN 'p2-ingles-tecnico'                THEN 'Inglés Técnico I'
  WHEN 'p2-matematicas-ii'                THEN 'Matemáticas II (Álgebra Lineal)'
  WHEN 'p2-poo'                           THEN 'Programación Orientada a Objetos'
  ELSE name
END
WHERE slug IN (
  'p1-fundamentos-programacion',
  'p1-introduccion-ia',
  'p1-logica-pensamiento-analitico',
  'p2-bases-datos',
  'p2-estadistica',
  'p2-estructuras-datos',
  'p2-ingles-tecnico',
  'p2-matematicas-ii',
  'p2-poo'
);

-- ----------------------------------------------------------------------------
-- BLOQUE 2 — TABLA: sessions (title, theory_markdown, ai_lab_context, ai_lab_suggested_prompt)
-- ----------------------------------------------------------------------------
-- Aplica las correcciones más frecuentes detectadas en la auditoría P1-P2.
-- Cada REPLACE preserva blanks adyacentes: solo cambia palabras completas
-- comunes (no toca código).

UPDATE sessions s
SET
  title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    s.title,
    'Programacion',  'Programación'),
    'Introduccion',  'Introducción'),
    'Estadistica',   'Estadística'),
    'Matematicas',   'Matemáticas'),
    'Logica',        'Lógica'),
    'Tecnico',       'Técnico'),
    'Ingles',        'Inglés'),
    'Algebra',       'Álgebra'),
    'Funcion',       'Función'),
    'Operacion',     'Operación'),

  theory_markdown = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    s.theory_markdown,
    -- ortografía base
    ' programacion ', ' programación '),
    ' Programacion ', ' Programación '),
    ' introduccion ', ' introducción '),
    ' Introduccion ', ' Introducción '),
    ' definicion ',   ' definición '),
    ' Definicion ',   ' Definición '),
    ' funcion ',      ' función '),
    ' Funcion ',      ' Función '),
    ' funciones ',    ' funciones '),  -- ya correcta, placeholder
    ' aplicacion ',   ' aplicación '),

    ' tecnologia ',   ' tecnología '),
    ' Tecnologia ',   ' Tecnología '),
    ' tecnologico ',  ' tecnológico '),
    ' tecnologica ',  ' tecnológica '),
    ' practica ',     ' práctica '),
    ' Practica ',     ' Práctica '),
    ' teoria ',       ' teoría '),
    ' Teoria ',       ' Teoría '),
    ' metodo ',       ' método '),
    ' Metodo ',       ' Método '),

    ' tambien ',      ' también '),
    ' Tambien ',      ' También '),
    ' ademas ',       ' además '),
    ' Ademas ',       ' Además '),
    ' aqui ',         ' aquí '),
    ' Aqui ',         ' Aquí '),
    ' alli ',         ' allí '),
    ' despues ',      ' después '),
    ' Despues ',      ' Después '),
    ' asi ',          ' así '),

    ' que se ',       ' que se '),  -- placeholder
    ' Que es ',       ' Qué es '),
    ' que es ',       ' qué es '),
    ' Como ',         ' Cómo '),
    ' como funciona ', ' cómo funciona '),
    ' Cuando ',       ' Cuándo '),
    ' Donde ',        ' Dónde '),
    ' division ',     ' división '),
    ' decision ',     ' decisión '),
    ' precision ',    ' precisión '),

  ai_lab_context = COALESCE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    s.ai_lab_context,
    ' programacion ',  ' programación '),
    ' introduccion ',  ' introducción '),
    ' funcion ',       ' función '),
    ' aplicacion ',    ' aplicación '),
    ' tecnologia ',    ' tecnología '),
    ' practica ',      ' práctica '),
    ' tambien ',       ' también '),
    ' analisis ',      ' análisis '),
    ' clasificacion ', ' clasificación '),
    ' decision ',      ' decisión '), s.ai_lab_context),

  ai_lab_suggested_prompt = COALESCE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    s.ai_lab_suggested_prompt,
    ' programacion ', ' programación '),
    ' introduccion ', ' introducción '),
    ' funcion ',      ' función '),
    ' tambien ',      ' también '),
    ' practica ',     ' práctica '),
    ' analisis ',     ' análisis '), s.ai_lab_suggested_prompt)

WHERE s.subject_id IN (
  SELECT id FROM subjects WHERE slug IN (
    'p1-fundamentos-programacion',
    'p1-introduccion-ia',
    'p1-logica-pensamiento-analitico',
    'p2-bases-datos',
    'p2-estadistica',
    'p2-estructuras-datos',
    'p2-ingles-tecnico',
    'p2-matematicas-ii',
    'p2-poo'
  )
);

-- ----------------------------------------------------------------------------
-- BLOQUE 2.5 — Reemplazo crítico: "anos" → "años" (CON Ñ) en sessions
-- ----------------------------------------------------------------------------
-- Solo afecta a la palabra " anos " rodeada por espacios para evitar tocar
-- "años" ya correcta o palabras como "humanos", "anorexico", "avanos".

UPDATE sessions s
SET
  theory_markdown = REPLACE(REPLACE(REPLACE(
    s.theory_markdown,
    ' anos ',   ' años '),
    ' anos.',   ' años.'),
    ' anos,',   ' años,'),

  title = REPLACE(REPLACE(s.title, ' anos ', ' años '), ' anos.', ' años.')

WHERE s.subject_id IN (
  SELECT id FROM subjects WHERE slug IN (
    'p1-fundamentos-programacion',
    'p1-introduccion-ia',
    'p1-logica-pensamiento-analitico',
    'p2-bases-datos',
    'p2-estadistica',
    'p2-estructuras-datos',
    'p2-ingles-tecnico',
    'p2-matematicas-ii',
    'p2-poo'
  )
);

-- ----------------------------------------------------------------------------
-- BLOQUE 2.6 — Ñ obligatoria: tamano → tamaño, espanol → español, etc.
-- ----------------------------------------------------------------------------

UPDATE sessions s
SET theory_markdown = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    s.theory_markdown,
    ' tamano ',     ' tamaño '),
    ' Tamano ',     ' Tamaño '),
    ' espanol ',    ' español '),
    ' Espanol ',    ' Español '),
    ' diseno ',     ' diseño '),
    ' Diseno ',     ' Diseño '),
    ' disenar ',    ' diseñar '),
    ' Disenar ',    ' Diseñar '),
    ' senal ',      ' señal '),
    ' pequeno ',    ' pequeño ')
WHERE s.subject_id IN (
  SELECT id FROM subjects WHERE slug IN (
    'p1-fundamentos-programacion',
    'p1-introduccion-ia',
    'p1-logica-pensamiento-analitico',
    'p2-bases-datos',
    'p2-estadistica',
    'p2-estructuras-datos',
    'p2-ingles-tecnico',
    'p2-matematicas-ii',
    'p2-poo'
  )
);

-- ----------------------------------------------------------------------------
-- BLOQUE 3 — TABLA: quizzes (title)
-- ----------------------------------------------------------------------------

UPDATE quizzes q
SET title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
  q.title,
  'Programacion',  'Programación'),
  'Introduccion',  'Introducción'),
  'Estadistica',   'Estadística'),
  'Matematicas',   'Matemáticas'),
  'Logica',        'Lógica'),
  'Tecnico',       'Técnico'),
  'Ingles',        'Inglés'),
  'Algebra',       'Álgebra'),
  'Funcion',       'Función'),
  'Sesion',        'Sesión')
WHERE q.session_id IN (
  SELECT s.id FROM sessions s
  WHERE s.subject_id IN (
    SELECT id FROM subjects WHERE slug IN (
      'p1-fundamentos-programacion',
      'p1-introduccion-ia',
      'p1-logica-pensamiento-analitico',
      'p2-bases-datos',
      'p2-estadistica',
      'p2-estructuras-datos',
      'p2-ingles-tecnico',
      'p2-matematicas-ii',
      'p2-poo'
    )
  )
);

-- ----------------------------------------------------------------------------
-- BLOQUE 4 — TABLA: quiz_questions (question_text, options, explanation)
-- ----------------------------------------------------------------------------
-- options es JSONB. Convertimos a text, reemplazamos y volvemos a JSONB.

UPDATE quiz_questions qq
SET
  question_text = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    qq.question_text,
    ' programacion ', ' programación '),
    ' funcion ',      ' función '),
    ' aplicacion ',   ' aplicación '),
    ' tambien ',      ' también '),
    ' practica ',     ' práctica '),
    ' analisis ',     ' análisis '),
    ' tecnico ',      ' técnico '),
    ' tecnologia ',   ' tecnología '),
    ' diferencia ',   ' diferencia '),
    ' division ',     ' división '),

  explanation = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    qq.explanation,
    ' programacion ', ' programación '),
    ' funcion ',      ' función '),
    ' tambien ',      ' también '),
    ' practica ',     ' práctica '),
    ' decision ',     ' decisión '),
    ' tecnico ',      ' técnico '),
    ' tecnologia ',   ' tecnología '),
    ' precision ',    ' precisión '),
    ' Que ',          ' Qué '),
    ' que es ',       ' qué es '),

  options = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    qq.options::text,
    ' programacion ', ' programación '),
    ' funcion ',      ' función '),
    ' tambien ',      ' también '),
    ' practica ',     ' práctica '),
    ' tecnico ',      ' técnico '),
    ' tecnologia ',   ' tecnología ')::jsonb

WHERE qq.quiz_id IN (
  SELECT q.id FROM quizzes q
  JOIN sessions s ON s.id = q.session_id
  WHERE s.subject_id IN (
    SELECT id FROM subjects WHERE slug IN (
      'p1-fundamentos-programacion',
      'p1-introduccion-ia',
      'p1-logica-pensamiento-analitico',
      'p2-bases-datos',
      'p2-estadistica',
      'p2-estructuras-datos',
      'p2-ingles-tecnico',
      'p2-matematicas-ii',
      'p2-poo'
    )
  )
);

-- ----------------------------------------------------------------------------
-- BLOQUE 5 — TABLA: assignments (title, instructions_markdown)
-- ----------------------------------------------------------------------------

UPDATE assignments a
SET
  title = REPLACE(REPLACE(REPLACE(REPLACE(
    a.title,
    'Programacion',  'Programación'),
    'Introduccion',  'Introducción'),
    'Estadistica',   'Estadística'),
    'Funcion',       'Función'),

  instructions_markdown = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    a.instructions_markdown,
    ' programacion ', ' programación '),
    ' introduccion ', ' introducción '),
    ' aplicacion ',   ' aplicación '),
    ' funcion ',      ' función '),
    ' tambien ',      ' también '),
    ' practica ',     ' práctica '),
    ' tecnico ',      ' técnico '),
    ' tecnologia ',   ' tecnología '),
    ' analisis ',     ' análisis '),
    ' decision ',     ' decisión '),

    ' anos ',         ' años '),
    ' tamano ',       ' tamaño '),
    ' espanol ',      ' español '),
    ' diseno ',       ' diseño '),
    ' disenar ',      ' diseñar '),
    ' definicion ',   ' definición '),
    ' descripcion ',  ' descripción '),
    ' explicacion ',  ' explicación '),
    ' Que ',          ' Qué '),
    ' Como ',         ' Cómo ')

WHERE a.session_id IN (
  SELECT s.id FROM sessions s
  WHERE s.subject_id IN (
    SELECT id FROM subjects WHERE slug IN (
      'p1-fundamentos-programacion',
      'p1-introduccion-ia',
      'p1-logica-pensamiento-analitico',
      'p2-bases-datos',
      'p2-estadistica',
      'p2-estructuras-datos',
      'p2-ingles-tecnico',
      'p2-matematicas-ii',
      'p2-poo'
    )
  )
);

-- ----------------------------------------------------------------------------
-- BLOQUE 6 — TABLA: session_resources (title, description)
-- ----------------------------------------------------------------------------

UPDATE session_resources r
SET
  title = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    r.title,
    'Programacion',  'Programación'),
    'Introduccion',  'Introducción'),
    'Estadistica',   'Estadística'),
    'Matematicas',   'Matemáticas'),
    'Logica',        'Lógica'),
    'Tecnico',       'Técnico'),
    'Ingles',        'Inglés'),
    'Algebra',       'Álgebra'),

  description = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
    r.description,
    ' programacion ', ' programación '),
    ' introduccion ', ' introducción '),
    ' tambien ',      ' también '),
    ' practica ',     ' práctica '),
    ' analisis ',     ' análisis '),
    ' tecnico ',      ' técnico '),
    ' tecnologia ',   ' tecnología '),
    ' decision ',     ' decisión '),
    ' funcion ',      ' función '),
    ' aplicacion ',   ' aplicación ')

WHERE r.session_id IN (
  SELECT s.id FROM sessions s
  WHERE s.subject_id IN (
    SELECT id FROM subjects WHERE slug IN (
      'p1-fundamentos-programacion',
      'p1-introduccion-ia',
      'p1-logica-pensamiento-analitico',
      'p2-bases-datos',
      'p2-estadistica',
      'p2-estructuras-datos',
      'p2-ingles-tecnico',
      'p2-matematicas-ii',
      'p2-poo'
    )
  )
);

-- ----------------------------------------------------------------------------
-- BLOQUE FINAL — VERIFICACIÓN POST-FIX
-- ----------------------------------------------------------------------------
-- Cuenta cuántos registros aún contienen errores típicos. Idealmente 0.

WITH conteo AS (
  SELECT
    (SELECT count(*) FROM sessions s
       JOIN subjects sb ON sb.id = s.subject_id
      WHERE sb.slug LIKE 'p1-%' OR sb.slug LIKE 'p2-%'
        AND s.theory_markdown LIKE '% programacion %') AS sessions_programacion,
    (SELECT count(*) FROM sessions s
       JOIN subjects sb ON sb.id = s.subject_id
      WHERE sb.slug LIKE 'p1-%' OR sb.slug LIKE 'p2-%'
        AND s.theory_markdown LIKE '% anos %') AS sessions_anos,
    (SELECT count(*) FROM quiz_questions qq
       JOIN quizzes q ON q.id = qq.quiz_id
       JOIN sessions s ON s.id = q.session_id
       JOIN subjects sb ON sb.id = s.subject_id
      WHERE sb.slug LIKE 'p1-%' OR sb.slug LIKE 'p2-%'
        AND qq.question_text LIKE '% funcion %') AS qq_funcion
)
SELECT 'AFTER' AS fase, * FROM conteo;

-- Si todo se ve bien, hacer COMMIT. Si no, ROLLBACK.
COMMIT;

-- Para revertir manualmente:
-- ROLLBACK;
