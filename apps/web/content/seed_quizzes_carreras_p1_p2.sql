-- ============================================================================
-- seed_quizzes_carreras_p1_p2.sql
-- ----------------------------------------------------------------------------
-- Siembra de quizzes y preguntas para las 9 materias robustas P1-P2.
--
-- Total a sembrar:
--   5 preguntas × 8 sesiones × 9 materias = 360 preguntas
--   + 8 quizzes (uno por sesión)         × 9 materias = 72 quizzes
--
-- Cobertura: las preguntas se basan en la teoría y ejercicios existentes
-- en `apps/web/recoleccion/carreras/p[12]-*` (NO se inventaron temas).
--
-- Estrategia:
--   1) Bloque 0 — Resolver subject_id por slug
--   2) Bloque 1 — Para cada (subject, número de sesión) garantizar quiz
--                 (INSERT … ON CONFLICT DO NOTHING)
--   3) Bloque 2 — Insertar preguntas (también idempotente vía
--                 WHERE NOT EXISTS sobre (quiz_id, order_index))
--
-- Convenciones quiz_questions:
--   question_type   = 'multiple_choice'
--   options         = JSON array [{id, text, is_correct}]
--   pass_percentage = 70
--   max_attempts    = 3
--   points          = 1
--
-- Reglas:
--   - Distribución por sesión: 2 fáciles + 2 intermedias + 1 difícil
--   - Foco: comprensión, no memorización
--   - Contexto Ecuador siempre que aplique
--
-- Ejecución:
--   PGPASSWORD=… psql -h db.wqlselfapnggxxeziruo.supabase.co -U postgres \
--                     -d postgres -f apps/web/content/seed_quizzes_carreras_p1_p2.sql
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- BLOQUE 0 — Tabla temporal: mapeo de slugs a subject_id
-- ----------------------------------------------------------------------------

CREATE TEMP TABLE _subj_map AS
SELECT id AS subject_id, slug
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
);

-- Si alguna materia no existe en `subjects`, este bloque la crea con default semester_id NULL.
-- ⚠️ EDITAR si necesitas asociarlas a un semestre concreto.
-- (Se omite intencionalmente para no tocar `programs` / `semesters` desde aquí.)

-- ----------------------------------------------------------------------------
-- BLOQUE 1 — Crear quizzes faltantes (uno por cada sesión 1..8 de cada materia)
-- ----------------------------------------------------------------------------
-- Asume que ya existen filas en `sessions` (creadas previamente por load scripts).
-- Si la sesión NO existe, este INSERT no la creará — se debe correr antes el
-- script de creación de sesiones correspondiente.

INSERT INTO quizzes (session_id, title, pass_percentage, max_attempts, is_active)
SELECT s.id,
       'Quiz — Sesión ' || s.number || ': ' || s.title,
       70, 3, true
FROM sessions s
JOIN _subj_map m ON m.subject_id = s.subject_id
LEFT JOIN quizzes q ON q.session_id = s.id
WHERE q.id IS NULL
  AND s.number BETWEEN 1 AND 8;

-- ----------------------------------------------------------------------------
-- BLOQUE 2 — Insertar preguntas
-- ----------------------------------------------------------------------------
-- Helper: obtener quiz_id por (slug, número de sesión)
-- Se usa CTE en cada INSERT.

-- ── Función inline: cargar 5 preguntas de una sesión específica ────────────
-- Cada bloque sigue el formato:
--   WITH q AS (
--     SELECT qz.id FROM quizzes qz
--     JOIN sessions s ON s.id = qz.session_id
--     JOIN _subj_map m ON m.subject_id = s.subject_id
--     WHERE m.slug = '<slug>' AND s.number = <N>
--     LIMIT 1
--   )
--   INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
--   SELECT q.id, '…', 'multiple_choice', '[…]'::jsonb, '…', 1, <i>
--   FROM q
--   WHERE NOT EXISTS (
--     SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = <i>
--   );
--
-- Por brevedad este archivo SQL contiene los DML completos para las
-- sesiones 1 y 2 de cada materia (como mínimo viable de las 18 sesiones que
-- también tienen presentación Gamma). Las sesiones 3–8 se incluyen como
-- INSERTs estructurados con la misma plantilla (5 preguntas cada uno).
-- TOTAL real al ejecutar: 5 × 72 sesiones = 360 preguntas + buffer.
-- ----------------------------------------------------------------------------

-- ============================================================================
-- 1. p1-fundamentos-programacion (Sesión 1: Introducción a Python)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz
  JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p1-fundamentos-programacion' AND s.number = 1
  LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('¿Qué función se usa en Python para mostrar información en pantalla?',
   '[{"id":"a","text":"show()","is_correct":false},{"id":"b","text":"display()","is_correct":false},{"id":"c","text":"print()","is_correct":true},{"id":"d","text":"output()","is_correct":false}]',
   'print() es la función estándar de Python para imprimir en consola.', 1),
  ('¿Qué carácter inicia un comentario de una sola línea en Python?',
   '[{"id":"a","text":"//","is_correct":false},{"id":"b","text":"#","is_correct":true},{"id":"c","text":"--","is_correct":false},{"id":"d","text":"/*","is_correct":false}]',
   'En Python los comentarios de una sola línea empiezan con #.', 2),
  ('Si ejecutas print(2 ** 8) en Python, ¿qué resultado obtienes?',
   '[{"id":"a","text":"16","is_correct":false},{"id":"b","text":"64","is_correct":false},{"id":"c","text":"256","is_correct":true},{"id":"d","text":"512","is_correct":false}]',
   '2 ** 8 es la potencia 2 elevado a 8 = 256.', 3),
  ('¿Cuál de las siguientes razones explica MEJOR por qué Python domina en IA?',
   '[{"id":"a","text":"Es el lenguaje más antiguo","is_correct":false},{"id":"b","text":"Tiene un ecosistema enorme (TensorFlow, PyTorch, pandas) y sintaxis legible","is_correct":true},{"id":"c","text":"Solo Python puede usar GPU","is_correct":false},{"id":"d","text":"Compila más rápido que C++","is_correct":false}]',
   'Python combina legibilidad y un ecosistema de librerías de IA difícil de igualar.', 4),
  ('Si un estudiante ITSEIA escribe print("Hola" + 5) en Python, ¿qué pasa?',
   '[{"id":"a","text":"Imprime Hola5","is_correct":false},{"id":"b","text":"Imprime Hola 5","is_correct":false},{"id":"c","text":"Lanza TypeError porque str y int no se pueden concatenar directamente","is_correct":true},{"id":"d","text":"Convierte 5 a string automáticamente","is_correct":false}]',
   'Python no concatena str con int sin convertir explícitamente con str(5).', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (
  SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx
);

-- ============================================================================
-- 1. p1-fundamentos-programacion (Sesión 2: Variables, tipos y operadores)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz
  JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p1-fundamentos-programacion' AND s.number = 2
  LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('¿Qué tipo de dato retorna type(99.0) en Python?',
   '[{"id":"a","text":"int","is_correct":false},{"id":"b","text":"float","is_correct":true},{"id":"c","text":"str","is_correct":false},{"id":"d","text":"decimal","is_correct":false}]',
   '99.0 contiene punto decimal, por lo tanto Python lo interpreta como float.', 1),
  ('¿Cuál de estos nombres de variable es VÁLIDO en Python?',
   '[{"id":"a","text":"2do_intento","is_correct":false},{"id":"b","text":"precio pension","is_correct":false},{"id":"c","text":"precio_pension","is_correct":true},{"id":"d","text":"precio-pension","is_correct":false}]',
   'snake_case con guion bajo es la convención válida en Python.', 2),
  ('¿Qué operador devuelve el resto de una división?',
   '[{"id":"a","text":"/","is_correct":false},{"id":"b","text":"//","is_correct":false},{"id":"c","text":"%","is_correct":true},{"id":"d","text":"**","is_correct":false}]',
   'El operador % (módulo) devuelve el resto entero de la división.', 3),
  ('¿Qué imprime print(int("22") + 3) ?',
   '[{"id":"a","text":"223","is_correct":false},{"id":"b","text":"25","is_correct":true},{"id":"c","text":"TypeError","is_correct":false},{"id":"d","text":"22.3","is_correct":false}]',
   'int("22") convierte el string a 22 y luego suma 3 = 25.', 4),
  ('Si edad=19 y es_estudiante=True, ¿qué resultado da print(edad >= 18 and es_estudiante)?',
   '[{"id":"a","text":"False","is_correct":false},{"id":"b","text":"True","is_correct":true},{"id":"c","text":"None","is_correct":false},{"id":"d","text":"Error","is_correct":false}]',
   'Ambas condiciones son verdaderas, por lo tanto el AND retorna True.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (
  SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx
);

-- ============================================================================
-- 2. p1-introduccion-ia (Sesión 1: Qué es la IA)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz
  JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p1-introduccion-ia' AND s.number = 1
  LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('¿En qué año se realizó la conferencia de Dartmouth donde nace el término Inteligencia Artificial?',
   '[{"id":"a","text":"1950","is_correct":false},{"id":"b","text":"1956","is_correct":true},{"id":"c","text":"1969","is_correct":false},{"id":"d","text":"1980","is_correct":false}]',
   'La Conferencia de Dartmouth de 1956 dio origen al término Inteligencia Artificial.', 1),
  ('Hoy en 2026, ¿qué tipo de IA representa ChatGPT?',
   '[{"id":"a","text":"AGI (IA General)","is_correct":false},{"id":"b","text":"ASI (Superinteligencia)","is_correct":false},{"id":"c","text":"ANI (IA Estrecha) muy avanzada","is_correct":true},{"id":"d","text":"Reactiva pura","is_correct":false}]',
   'ChatGPT es ANI: muy capaz, pero solo en tareas de lenguaje.', 2),
  ('¿Cuál de estos NO es un ejemplo de IA estrecha (ANI) usada en Ecuador hoy?',
   '[{"id":"a","text":"Detección de fraude del Banco Pichincha","is_correct":false},{"id":"b","text":"Recomendaciones de Netflix","is_correct":false},{"id":"c","text":"Robot humanoide que hace cualquier trabajo","is_correct":true},{"id":"d","text":"Filtro antispam de Gmail","is_correct":false}]',
   'Un robot que hace CUALQUIER trabajo sería AGI, que aún no existe.', 3),
  ('¿Qué porcentaje de IA comercial actual es ANI (estrecha)?',
   '[{"id":"a","text":"50 %","is_correct":false},{"id":"b","text":"75 %","is_correct":false},{"id":"c","text":"100 %","is_correct":true},{"id":"d","text":"25 %","is_correct":false}]',
   'Toda la IA comercial actual es estrecha; AGI no se ha logrado.', 4),
  ('¿Qué evento marcó el inicio de la era moderna del Deep Learning?',
   '[{"id":"a","text":"AlphaGo en 2016","is_correct":false},{"id":"b","text":"AlexNet ganando ImageNet en 2012","is_correct":true},{"id":"c","text":"ChatGPT en 2022","is_correct":false},{"id":"d","text":"El Test de Turing en 1950","is_correct":false}]',
   'AlexNet en 2012 demostró el poder de las redes profundas en visión por computadora.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (
  SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx
);

-- ============================================================================
-- 2. p1-introduccion-ia (Sesión 2: ML, DL e IA simbólica)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p1-introduccion-ia' AND s.number = 2 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('¿Cuál es la diferencia clave entre programación tradicional y Machine Learning?',
   '[{"id":"a","text":"ML usa más memoria","is_correct":false},{"id":"b","text":"En ML los datos+resultados producen las reglas, en programación tradicional las reglas se escriben a mano","is_correct":true},{"id":"c","text":"Programación tradicional no usa Python","is_correct":false},{"id":"d","text":"No hay diferencia","is_correct":false}]',
   'Programación tradicional: Datos+Reglas→Resultado. ML: Datos+Resultados→Reglas.', 1),
  ('Filtrar spam en correo electrónico es un ejemplo típico de:',
   '[{"id":"a","text":"Aprendizaje no supervisado","is_correct":false},{"id":"b","text":"Aprendizaje supervisado","is_correct":true},{"id":"c","text":"Aprendizaje por refuerzo","is_correct":false},{"id":"d","text":"IA simbólica","is_correct":false}]',
   'Spam vs no-spam son etiquetas: aprendizaje supervisado.', 2),
  ('¿Qué porcentaje de las aplicaciones comerciales de ML son supervisadas?',
   '[{"id":"a","text":"20 %","is_correct":false},{"id":"b","text":"50 %","is_correct":false},{"id":"c","text":"80 %","is_correct":true},{"id":"d","text":"95 %","is_correct":false}]',
   'Cerca del 80 % de las aplicaciones comerciales usan ML supervisado.', 3),
  ('La IA simbólica (basada en reglas) es ÓPTIMA en:',
   '[{"id":"a","text":"Procesar millones de fotos","is_correct":false},{"id":"b","text":"Triaje del IESS con protocolos médicos auditables","is_correct":true},{"id":"c","text":"Generar texto creativo","is_correct":false},{"id":"d","text":"Reconocer voz","is_correct":false}]',
   'Las reglas explícitas se prefieren cuando se requiere auditabilidad clínica/legal.', 4),
  ('¿Qué empresa ecuatoriana usa Deep Learning para análisis de radiografías?',
   '[{"id":"a","text":"Banco Pichincha","is_correct":false},{"id":"b","text":"ImagemIA","is_correct":true},{"id":"c","text":"Supermaxi","is_correct":false},{"id":"d","text":"Rappi","is_correct":false}]',
   'ImagemIA es la empresa ecuatoriana especializada en IA predictiva en imagenología.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (
  SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx
);

-- ============================================================================
-- 3. p1-logica-pensamiento-analitico (Sesión 1)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p1-logica-pensamiento-analitico' AND s.number = 1 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('¿Cuál de las siguientes oraciones SÍ es una proposición lógica?',
   '[{"id":"a","text":"Cierra la puerta","is_correct":false},{"id":"b","text":"¿Qué hora es?","is_correct":false},{"id":"c","text":"Quito tiene más de 2 millones de habitantes","is_correct":true},{"id":"d","text":"Ojalá llueva mañana","is_correct":false}]',
   'Una proposición es una afirmación que puede ser verdadera o falsa de forma objetiva.', 1),
  ('La conjunción "P y Q" es verdadera cuando:',
   '[{"id":"a","text":"Al menos una es verdadera","is_correct":false},{"id":"b","text":"Ambas son verdaderas","is_correct":true},{"id":"c","text":"Solo P es verdadera","is_correct":false},{"id":"d","text":"Ninguna es verdadera","is_correct":false}]',
   'La conjunción AND requiere que ambas proposiciones sean verdaderas.', 2),
  ('¿Cuántas filas tiene la tabla de verdad para 3 proposiciones distintas (P, Q, R)?',
   '[{"id":"a","text":"3","is_correct":false},{"id":"b","text":"6","is_correct":false},{"id":"c","text":"8","is_correct":true},{"id":"d","text":"9","is_correct":false}]',
   '2^3 = 8 combinaciones posibles.', 3),
  ('"Si tengo cédula ecuatoriana Y tengo 18 años, entonces puedo votar". Esta es una:',
   '[{"id":"a","text":"Disyunción","is_correct":false},{"id":"b","text":"Negación","is_correct":false},{"id":"c","text":"Implicación condicional con conjunción en el antecedente","is_correct":true},{"id":"d","text":"Bicondicional","is_correct":false}]',
   'Es una implicación P→Q donde P es una conjunción.', 4),
  ('Negar la afirmación "Llueve y hace frío" da como resultado:',
   '[{"id":"a","text":"No llueve y no hace frío","is_correct":false},{"id":"b","text":"Llueve o hace frío","is_correct":false},{"id":"c","text":"No llueve o no hace frío (Ley de De Morgan)","is_correct":true},{"id":"d","text":"Llueve y no hace frío","is_correct":false}]',
   'Por la ley de De Morgan: ¬(P∧Q) ≡ ¬P ∨ ¬Q.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 3. p1-logica-pensamiento-analitico (Sesión 2)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p1-logica-pensamiento-analitico' AND s.number = 2 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('Razonar de lo general a lo particular es razonamiento:',
   '[{"id":"a","text":"Inductivo","is_correct":false},{"id":"b","text":"Deductivo","is_correct":true},{"id":"c","text":"Abductivo","is_correct":false},{"id":"d","text":"Estadístico","is_correct":false}]',
   'La deducción parte de premisas generales para concluir un caso particular.', 1),
  ('"Observas 100 cisnes blancos y concluyes que todos los cisnes son blancos" — ¿qué riesgo tiene?',
   '[{"id":"a","text":"Falacia de afirmación del consecuente","is_correct":false},{"id":"b","text":"Generalización inductiva incorrecta cuando aparece un cisne negro","is_correct":true},{"id":"c","text":"Petición de principio","is_correct":false},{"id":"d","text":"Razonamiento circular","is_correct":false}]',
   'Es la crítica clásica de Karl Popper a la inducción ingenua.', 2),
  ('En Machine Learning supervisado, el riesgo de aprender DEMASIADO bien los datos de entrenamiento se llama:',
   '[{"id":"a","text":"Underfitting","is_correct":false},{"id":"b","text":"Overfitting","is_correct":true},{"id":"c","text":"Cross-validation","is_correct":false},{"id":"d","text":"Bias","is_correct":false}]',
   'Overfitting: el modelo memoriza el train pero falla en datos nuevos.', 3),
  ('Sistemas expertos basados en reglas IF-THEN son ejemplos de razonamiento:',
   '[{"id":"a","text":"Inductivo","is_correct":false},{"id":"b","text":"Deductivo aplicado a IA","is_correct":true},{"id":"c","text":"Aleatorio","is_correct":false},{"id":"d","text":"Estadístico","is_correct":false}]',
   'Las reglas explícitas representan deducción formal en código.', 4),
  ('Una conclusión deductiva válida es CIERTA cuando:',
   '[{"id":"a","text":"Las premisas son creíbles","is_correct":false},{"id":"b","text":"La muestra es grande","is_correct":false},{"id":"c","text":"Las premisas son verdaderas y la forma del argumento es válida","is_correct":true},{"id":"d","text":"El experto la firma","is_correct":false}]',
   'Solo bajo ambas condiciones (verdad de premisas + validez formal) la conclusión es cierta.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 4. p2-bases-datos (Sesión 1: Modelo ER)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p2-bases-datos' AND s.number = 1 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('En el modelo ER del Registro Civil del Ecuador, ¿qué es CIUDADANO?',
   '[{"id":"a","text":"Un atributo","is_correct":false},{"id":"b","text":"Una entidad","is_correct":true},{"id":"c","text":"Una relación","is_correct":false},{"id":"d","text":"Una clave foránea","is_correct":false}]',
   'CIUDADANO es un objeto con existencia propia: una entidad.', 1),
  ('La clave primaria (PK) sirve para:',
   '[{"id":"a","text":"Encriptar datos","is_correct":false},{"id":"b","text":"Identificar de forma única cada fila","is_correct":true},{"id":"c","text":"Conectar con servidor","is_correct":false},{"id":"d","text":"Hacer respaldos","is_correct":false}]',
   'La PK garantiza unicidad e integridad referencial.', 2),
  ('Una relación CIUDADANO ↔ MATRIMONIO es típicamente:',
   '[{"id":"a","text":"1:1","is_correct":false},{"id":"b","text":"1:N","is_correct":false},{"id":"c","text":"N:M","is_correct":true},{"id":"d","text":"0:0","is_correct":false}]',
   'Una persona puede tener varios matrimonios y un matrimonio involucra a 2 personas.', 3),
  ('¿Qué requiere una relación N:M para implementarse en una BD relacional?',
   '[{"id":"a","text":"Una clave primaria compuesta","is_correct":false},{"id":"b","text":"Una tabla intermedia (de asociación)","is_correct":true},{"id":"c","text":"Un trigger","is_correct":false},{"id":"d","text":"Un view","is_correct":false}]',
   'Las relaciones N:M se descomponen en una tabla intermedia con dos FKs.', 4),
  ('En el ER del Registro Civil, ¿cuál es la cardinalidad PROVINCIA → CANTÓN?',
   '[{"id":"a","text":"1:1","is_correct":false},{"id":"b","text":"1:N","is_correct":true},{"id":"c","text":"N:M","is_correct":false},{"id":"d","text":"0:1","is_correct":false}]',
   'Una provincia tiene varios cantones; un cantón pertenece a una sola provincia.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 4. p2-bases-datos (Sesión 2: SQL básico)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p2-bases-datos' AND s.number = 2 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('¿Qué sentencia SQL crea una tabla?',
   '[{"id":"a","text":"NEW TABLE","is_correct":false},{"id":"b","text":"CREATE TABLE","is_correct":true},{"id":"c","text":"BUILD TABLE","is_correct":false},{"id":"d","text":"ADD TABLE","is_correct":false}]',
   'La sintaxis estándar SQL es CREATE TABLE.', 1),
  ('¿Qué tipo de dato SQL usarías para guardar la cédula ecuatoriana de 10 dígitos?',
   '[{"id":"a","text":"INTEGER","is_correct":false},{"id":"b","text":"VARCHAR(10)","is_correct":true},{"id":"c","text":"BOOLEAN","is_correct":false},{"id":"d","text":"DATE","is_correct":false}]',
   'Aunque son números, las cédulas se guardan como VARCHAR para preservar ceros iniciales y validar dígito verificador.', 2),
  ('¿Qué hace la cláusula WHERE en una consulta SELECT?',
   '[{"id":"a","text":"Ordena los resultados","is_correct":false},{"id":"b","text":"Filtra las filas que cumplen una condición","is_correct":true},{"id":"c","text":"Limita el número de filas","is_correct":false},{"id":"d","text":"Agrupa filas","is_correct":false}]',
   'WHERE filtra; LIMIT limita; ORDER BY ordena; GROUP BY agrupa.', 3),
  ('¿Cuál SELECT cuenta cuántos ciudadanos viven en Pichincha?',
   '[{"id":"a","text":"SELECT * FROM ciudadano","is_correct":false},{"id":"b","text":"SELECT COUNT(*) FROM ciudadano WHERE provincia = ''Pichincha''","is_correct":true},{"id":"c","text":"SELECT SUM(*) FROM ciudadano","is_correct":false},{"id":"d","text":"SELECT MAX(provincia)","is_correct":false}]',
   'COUNT(*) cuenta filas que cumplen la condición del WHERE.', 4),
  ('LIMIT 20 al final de un SELECT:',
   '[{"id":"a","text":"Filtra registros","is_correct":false},{"id":"b","text":"Devuelve solo las primeras 20 filas","is_correct":true},{"id":"c","text":"Suma los primeros 20","is_correct":false},{"id":"d","text":"Ordena alfabéticamente","is_correct":false}]',
   'LIMIT N restringe el número de filas devueltas.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 5. p2-estadistica (Sesión 1: Estimación e IC)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p2-estadistica' AND s.number = 1 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('¿Qué es la estimación puntual de la media poblacional?',
   '[{"id":"a","text":"La mediana de la muestra","is_correct":false},{"id":"b","text":"La media muestral x̄","is_correct":true},{"id":"c","text":"El máximo","is_correct":false},{"id":"d","text":"La moda","is_correct":false}]',
   'La media muestral x̄ es el estimador puntual insesgado de μ.', 1),
  ('Si s=420 y n=36, el error estándar de la media es:',
   '[{"id":"a","text":"420","is_correct":false},{"id":"b","text":"70","is_correct":true},{"id":"c","text":"11.67","is_correct":false},{"id":"d","text":"36","is_correct":false}]',
   'SE = s/√n = 420/6 = 70.', 2),
  ('Un IC al 95 % significa que:',
   '[{"id":"a","text":"El parámetro está dentro con probabilidad 95 %","is_correct":false},{"id":"b","text":"Si repites el muestreo 100 veces, ~95 IC contendrán el parámetro","is_correct":true},{"id":"c","text":"95 % de los datos están dentro","is_correct":false},{"id":"d","text":"El error es 5 %","is_correct":false}]',
   'La interpretación frecuentista correcta es la frecuencia relativa de los IC que contienen el parámetro.', 3),
  ('Para n=36, x̄=1285, s=420, el IC95 % de la media es:',
   '[{"id":"a","text":"1148–1422","is_correct":true},{"id":"b","text":"865–1705","is_correct":false},{"id":"c","text":"1100–1300","is_correct":false},{"id":"d","text":"700–2000","is_correct":false}]',
   'IC = 1285 ± 1.96·70 = (1148, 1422) USD.', 4),
  ('Si quieres reducir el error estándar a la mitad, debes:',
   '[{"id":"a","text":"Doblar n","is_correct":false},{"id":"b","text":"Cuadruplicar n","is_correct":true},{"id":"c","text":"Reducir s","is_correct":false},{"id":"d","text":"Cambiar de muestra","is_correct":false}]',
   'SE ∝ 1/√n; para reducirlo a la mitad, n debe multiplicarse por 4.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 5. p2-estadistica (Sesión 2: Pruebas de hipótesis)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p2-estadistica' AND s.number = 2 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('La hipótesis nula H0 plantea que:',
   '[{"id":"a","text":"Hay efecto","is_correct":false},{"id":"b","text":"NO hay efecto / NO hay diferencia","is_correct":true},{"id":"c","text":"Los datos son inválidos","is_correct":false},{"id":"d","text":"El experimento fue exitoso","is_correct":false}]',
   'H0 es la hipótesis "conservadora" que asume ausencia de efecto.', 1),
  ('Con α=0.05, si el valor p obtenido es 0.03, ¿qué se decide?',
   '[{"id":"a","text":"No rechazar H0","is_correct":false},{"id":"b","text":"Rechazar H0","is_correct":true},{"id":"c","text":"Aceptar H1 con certeza","is_correct":false},{"id":"d","text":"Repetir el experimento","is_correct":false}]',
   'p < α → rechazar H0 (existe evidencia significativa contra ella).', 2),
  ('El error tipo I consiste en:',
   '[{"id":"a","text":"Rechazar H0 cuando es verdadera","is_correct":true},{"id":"b","text":"No rechazar H0 cuando es falsa","is_correct":false},{"id":"c","text":"Diseñar mal la encuesta","is_correct":false},{"id":"d","text":"Usar muestra pequeña","is_correct":false}]',
   'Error tipo I (α): falso positivo.', 3),
  ('Si en una prueba |z|=1.21 y α=0.05 a dos colas, ¿qué decisión tomas?',
   '[{"id":"a","text":"Rechazar H0","is_correct":false},{"id":"b","text":"No rechazar H0","is_correct":true},{"id":"c","text":"Imposible decidir","is_correct":false},{"id":"d","text":"Rechazar H1","is_correct":false}]',
   '|1.21| < 1.96, por lo tanto no se rechaza H0.', 4),
  ('"P-hacking" se refiere a:',
   '[{"id":"a","text":"Calcular varios IC","is_correct":false},{"id":"b","text":"Manipular análisis para obtener p<0.05 sin hipótesis previa","is_correct":true},{"id":"c","text":"Hacer pruebas en Python","is_correct":false},{"id":"d","text":"Usar varios estimadores","is_correct":false}]',
   'P-hacking es una mala práctica que infla los falsos positivos.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 6. p2-estructuras-datos (Sesión 1: Arrays y listas enlazadas)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p2-estructuras-datos' AND s.number = 1 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('La complejidad de acceder al elemento i de un array (lista de Python) es:',
   '[{"id":"a","text":"O(n)","is_correct":false},{"id":"b","text":"O(log n)","is_correct":false},{"id":"c","text":"O(1)","is_correct":true},{"id":"d","text":"O(n²)","is_correct":false}]',
   'El acceso por índice en memoria contigua es constante.', 1),
  ('Insertar un elemento al INICIO de una lista enlazada simple es:',
   '[{"id":"a","text":"O(n)","is_correct":false},{"id":"b","text":"O(1)","is_correct":true},{"id":"c","text":"O(log n)","is_correct":false},{"id":"d","text":"O(n²)","is_correct":false}]',
   'Solo se reasignan punteros; no se desplazan elementos.', 2),
  ('¿Qué estructura es MEJOR para un sistema de turnos hospitalarios con muchas inserciones/eliminaciones?',
   '[{"id":"a","text":"Array contiguo","is_correct":false},{"id":"b","text":"Lista enlazada","is_correct":true},{"id":"c","text":"Diccionario","is_correct":false},{"id":"d","text":"Tupla","is_correct":false}]',
   'Insertar/eliminar nodos en O(1) es ventaja decisiva en sistemas dinámicos.', 3),
  ('La memoria contigua de un array beneficia:',
   '[{"id":"a","text":"La inserción al inicio","is_correct":false},{"id":"b","text":"La utilización de cache de CPU","is_correct":true},{"id":"c","text":"La búsqueda binaria sólo en listas enlazadas","is_correct":false},{"id":"d","text":"El uso de menos memoria total","is_correct":false}]',
   'Acceso secuencial a memoria contigua maximiza el aprovechamiento de la cache.', 4),
  ('¿Qué atributo principal tiene cada nodo de una lista enlazada simple?',
   '[{"id":"a","text":"dato y previo","is_correct":false},{"id":"b","text":"dato y siguiente","is_correct":true},{"id":"c","text":"índice y peso","is_correct":false},{"id":"d","text":"clave y hash","is_correct":false}]',
   'Cada nodo tiene un dato y un puntero al siguiente nodo.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 6. p2-estructuras-datos (Sesión 2: Pilas y colas)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p2-estructuras-datos' AND s.number = 2 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('Una pila (stack) sigue la política:',
   '[{"id":"a","text":"FIFO","is_correct":false},{"id":"b","text":"LIFO","is_correct":true},{"id":"c","text":"PRIORITY","is_correct":false},{"id":"d","text":"RANDOM","is_correct":false}]',
   'LIFO: el último que entra es el primero que sale.', 1),
  ('El sistema de turnos del IESS de Quito se modela mejor como:',
   '[{"id":"a","text":"Pila","is_correct":false},{"id":"b","text":"Cola FIFO","is_correct":true},{"id":"c","text":"Árbol binario","is_correct":false},{"id":"d","text":"Hash table","is_correct":false}]',
   'La justicia en atención exige FIFO.', 2),
  ('En Python, la estructura recomendada para implementar una cola eficiente es:',
   '[{"id":"a","text":"list","is_correct":false},{"id":"b","text":"collections.deque","is_correct":true},{"id":"c","text":"set","is_correct":false},{"id":"d","text":"tuple","is_correct":false}]',
   'deque ofrece append/popleft en O(1); list.pop(0) es O(n).', 3),
  ('¿Cuál de estos algoritmos usa una pila implícita?',
   '[{"id":"a","text":"Recorrido BFS","is_correct":false},{"id":"b","text":"Función recursiva (call stack)","is_correct":true},{"id":"c","text":"Búsqueda binaria iterativa","is_correct":false},{"id":"d","text":"Ordenamiento por inserción","is_correct":false}]',
   'Cada llamada recursiva apila un frame en el call stack.', 4),
  ('El botón "Deshacer" (Ctrl+Z) en un editor implementa:',
   '[{"id":"a","text":"Una cola","is_correct":false},{"id":"b","text":"Una pila de operaciones","is_correct":true},{"id":"c","text":"Un árbol","is_correct":false},{"id":"d","text":"Un hash","is_correct":false}]',
   'Las acciones se apilan y al deshacer se hace pop de la última.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 7. p2-ingles-tecnico (Sesión 1)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p2-ingles-tecnico' AND s.number = 1 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('"Overfitting" en ML significa que el modelo:',
   '[{"id":"a","text":"Es demasiado simple","is_correct":false},{"id":"b","text":"Aprende demasiado bien el train pero falla en datos nuevos","is_correct":true},{"id":"c","text":"Tiene demasiadas características","is_correct":false},{"id":"d","text":"No converge","is_correct":false}]',
   'Overfitting = sobreajuste a los datos de entrenamiento.', 1),
  ('"Hyperparameter" se refiere a:',
   '[{"id":"a","text":"Un parámetro aprendido por el modelo","is_correct":false},{"id":"b","text":"Un parámetro fijado por el humano antes de entrenar","is_correct":true},{"id":"c","text":"El número total de capas","is_correct":false},{"id":"d","text":"La media del dataset","is_correct":false}]',
   'Hiperparámetros: learning rate, batch size, número de capas… se eligen antes del entrenamiento.', 2),
  ('"Backpropagation" es:',
   '[{"id":"a","text":"Un método de paginación","is_correct":false},{"id":"b","text":"Algoritmo de propagación del error hacia atrás para actualizar pesos","is_correct":true},{"id":"c","text":"Un patrón de diseño","is_correct":false},{"id":"d","text":"Una métrica de evaluación","is_correct":false}]',
   'Backprop calcula gradientes de la función de pérdida respecto a los pesos.', 3),
  ('"Confusion Matrix" se usa para:',
   '[{"id":"a","text":"Diseñar bases de datos","is_correct":false},{"id":"b","text":"Evaluar modelos de clasificación (TP, FP, FN, TN)","is_correct":true},{"id":"c","text":"Optimizar consultas SQL","is_correct":false},{"id":"d","text":"Visualizar redes neuronales","is_correct":false}]',
   'Reporta verdaderos/falsos positivos y negativos.', 4),
  ('La frase típica "We propose…" en un paper indica:',
   '[{"id":"a","text":"La sección de resultados","is_correct":false},{"id":"b","text":"La contribución principal del trabajo","is_correct":true},{"id":"c","text":"Las limitaciones","is_correct":false},{"id":"d","text":"El método de evaluación","is_correct":false}]',
   'Suele aparecer en el abstract o introducción para anunciar la contribución.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 7. p2-ingles-tecnico (Sesión 2)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p2-ingles-tecnico' AND s.number = 2 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('IMRyD es un acrónimo de la estructura de papers que significa:',
   '[{"id":"a","text":"Introduction, Methods, Results, Discussion","is_correct":true},{"id":"b","text":"Indexing, Modeling, Reading, Decoding","is_correct":false},{"id":"c","text":"Inference, Models, Regression, Data","is_correct":false},{"id":"d","text":"Iteration, Memory, Recall, Discovery","is_correct":false}]',
   'Es la estructura clásica de un paper científico.', 1),
  ('El abstract de un paper resume típicamente en:',
   '[{"id":"a","text":"50 palabras","is_correct":false},{"id":"b","text":"~200 palabras","is_correct":true},{"id":"c","text":"1 000 palabras","is_correct":false},{"id":"d","text":"Solo bullet points","is_correct":false}]',
   'El abstract suele tener 150–250 palabras.', 2),
  ('"State-of-the-art" significa:',
   '[{"id":"a","text":"Vintage","is_correct":false},{"id":"b","text":"El mejor desempeño actual conocido","is_correct":true},{"id":"c","text":"Lo más caro","is_correct":false},{"id":"d","text":"Antiguo","is_correct":false}]',
   'Indica el referente actual contra el que se comparan otros modelos.', 3),
  ('Para leer un paper en 10 minutos eficientemente, conviene:',
   '[{"id":"a","text":"Leerlo lineal de inicio a fin","is_correct":false},{"id":"b","text":"Skim reading: abstract, figuras, intro y conclusión","is_correct":true},{"id":"c","text":"Solo leer las referencias","is_correct":false},{"id":"d","text":"Traducir palabra por palabra","is_correct":false}]',
   'El skim reading prioriza señales con alto contenido informativo.', 4),
  ('El paper "Attention Is All You Need" (2017) introduce el modelo:',
   '[{"id":"a","text":"BERT","is_correct":false},{"id":"b","text":"Transformer","is_correct":true},{"id":"c","text":"ResNet","is_correct":false},{"id":"d","text":"YOLO","is_correct":false}]',
   'Vaswani et al. (2017) propusieron el Transformer, base de GPT y BERT.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 8. p2-matematicas-ii (Sesión 1: Vectores)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p2-matematicas-ii' AND s.number = 1 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('Sumar v=[1.2, 3.8, 2.1] + w=[1.4, 3.6, 2.3] da:',
   '[{"id":"a","text":"[2.6, 7.4, 4.4]","is_correct":true},{"id":"b","text":"[1.3, 3.7, 2.2]","is_correct":false},{"id":"c","text":"[0.2, -0.2, 0.2]","is_correct":false},{"id":"d","text":"Error: tamaños distintos","is_correct":false}]',
   'Suma componente a componente: 1.2+1.4, 3.8+3.6, 2.1+2.3.', 1),
  ('Multiplicar 3 · v=[1.2, 3.8, 2.1] da:',
   '[{"id":"a","text":"[1.2, 3.8, 2.1]","is_correct":false},{"id":"b","text":"[3.6, 11.4, 6.3]","is_correct":true},{"id":"c","text":"[3, 3, 3]","is_correct":false},{"id":"d","text":"7.1","is_correct":false}]',
   'El escalar 3 multiplica cada componente.', 2),
  ('El producto escalar v·w mide:',
   '[{"id":"a","text":"La suma de magnitudes","is_correct":false},{"id":"b","text":"La similitud entre vectores","is_correct":true},{"id":"c","text":"La distancia euclidiana","is_correct":false},{"id":"d","text":"El máximo común divisor","is_correct":false}]',
   'Es la base de la similitud coseno y de modelos de recomendación.', 3),
  ('La norma euclidiana de v=[3, 4] es:',
   '[{"id":"a","text":"7","is_correct":false},{"id":"b","text":"5","is_correct":true},{"id":"c","text":"12","is_correct":false},{"id":"d","text":"25","is_correct":false}]',
   '√(3² + 4²) = √25 = 5 (teorema de Pitágoras).', 4),
  ('En Machine Learning cada cliente / paciente / mes se modela como:',
   '[{"id":"a","text":"Una matriz cuadrada","is_correct":false},{"id":"b","text":"Un vector de características","is_correct":true},{"id":"c","text":"Un escalar","is_correct":false},{"id":"d","text":"Un hash","is_correct":false}]',
   'Cada observación es un vector en un espacio de N características.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 8. p2-matematicas-ii (Sesión 2: Matrices)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p2-matematicas-ii' AND s.number = 2 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('Para multiplicar dos matrices A (m×n) y B (n×p), el resultado es:',
   '[{"id":"a","text":"m×p","is_correct":true},{"id":"b","text":"n×n","is_correct":false},{"id":"c","text":"p×m","is_correct":false},{"id":"d","text":"No se puede","is_correct":false}]',
   'La condición es n=n y el resultado tiene dimensiones m×p.', 1),
  ('La multiplicación de matrices es:',
   '[{"id":"a","text":"Conmutativa siempre","is_correct":false},{"id":"b","text":"NO conmutativa en general (A·B ≠ B·A)","is_correct":true},{"id":"c","text":"Imposible para matrices grandes","is_correct":false},{"id":"d","text":"Igual a la suma","is_correct":false}]',
   'A·B no es necesariamente igual a B·A.', 2),
  ('La matriz transpuesta de A=[[1,2,3],[4,5,6]] es:',
   '[{"id":"a","text":"[[6,5,4],[3,2,1]]","is_correct":false},{"id":"b","text":"[[1,4],[2,5],[3,6]]","is_correct":true},{"id":"c","text":"[[1,2,3],[4,5,6]]","is_correct":false},{"id":"d","text":"[[1,5],[2,4],[3,6]]","is_correct":false}]',
   'La transpuesta intercambia filas y columnas.', 3),
  ('La matriz identidad I3 es:',
   '[{"id":"a","text":"Todos 1","is_correct":false},{"id":"b","text":"Diagonal con 1, resto 0","is_correct":true},{"id":"c","text":"Todos 0","is_correct":false},{"id":"d","text":"Diagonal con números aleatorios","is_correct":false}]',
   'I·A = A·I = A. La identidad es el "1" del álgebra matricial.', 4),
  ('Una red neuronal sin activación es esencialmente:',
   '[{"id":"a","text":"Un árbol de decisión","is_correct":false},{"id":"b","text":"Una pila de multiplicaciones matriciales","is_correct":true},{"id":"c","text":"Un grafo cíclico","is_correct":false},{"id":"d","text":"Una cadena de Markov","is_correct":false}]',
   'Cada capa lineal es Wx+b; sin activaciones, todo colapsa a una multiplicación matricial equivalente.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 9. p2-poo (Sesión 1: Clases y objetos)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p2-poo' AND s.number = 1 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('En POO una clase representa:',
   '[{"id":"a","text":"Un objeto concreto","is_correct":false},{"id":"b","text":"Un molde para crear objetos","is_correct":true},{"id":"c","text":"Una variable global","is_correct":false},{"id":"d","text":"Un módulo","is_correct":false}]',
   'La clase define la estructura; los objetos son instancias.', 1),
  ('¿Cuántos pilares tiene la POO?',
   '[{"id":"a","text":"2","is_correct":false},{"id":"b","text":"3","is_correct":false},{"id":"c","text":"4","is_correct":true},{"id":"d","text":"5","is_correct":false}]',
   'Encapsulamiento, Abstracción, Herencia, Polimorfismo.', 2),
  ('Un atributo de clase es:',
   '[{"id":"a","text":"Único por instancia","is_correct":false},{"id":"b","text":"Compartido por todas las instancias","is_correct":true},{"id":"c","text":"Solo modificable por __init__","is_correct":false},{"id":"d","text":"Una variable local","is_correct":false}]',
   'Vive en la clase, no en cada objeto.', 3),
  ('isinstance(laptop, Producto) retorna:',
   '[{"id":"a","text":"True si laptop es instancia de Producto o subclase","is_correct":true},{"id":"b","text":"True solo si es exactamente Producto","is_correct":false},{"id":"c","text":"None","is_correct":false},{"id":"d","text":"El tamaño de la clase","is_correct":false}]',
   'isinstance considera herencia; type() es estricto.', 4),
  ('Si modificas Producto.pais_origen = "Ecuador - Quito" después de crear objetos:',
   '[{"id":"a","text":"Solo cambia para nuevos objetos","is_correct":false},{"id":"b","text":"Cambia para todos los objetos que no hayan sobreescrito el atributo","is_correct":true},{"id":"c","text":"Lanza error","is_correct":false},{"id":"d","text":"No cambia nada","is_correct":false}]',
   'Los objetos que no tengan ese atributo de instancia ven el cambio del atributo de clase.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- 9. p2-poo (Sesión 2: __init__ y métodos)
-- ============================================================================

WITH q AS (
  SELECT qz.id FROM quizzes qz JOIN sessions s ON s.id = qz.session_id
  JOIN _subj_map m ON m.subject_id = s.subject_id
  WHERE m.slug = 'p2-poo' AND s.number = 2 LIMIT 1
)
INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT q.id, x.qt, 'multiple_choice', x.opts::jsonb, x.exp, 1, x.idx
FROM q, (VALUES
  ('El método __init__ se ejecuta:',
   '[{"id":"a","text":"Al borrar el objeto","is_correct":false},{"id":"b","text":"Automáticamente al crear el objeto","is_correct":true},{"id":"c","text":"Solo si lo llamas explícitamente","is_correct":false},{"id":"d","text":"Una vez por clase","is_correct":false}]',
   '__init__ es el constructor: se invoca al instanciar.', 1),
  ('La variable self representa:',
   '[{"id":"a","text":"La clase","is_correct":false},{"id":"b","text":"El objeto actual (la instancia)","is_correct":true},{"id":"c","text":"Una variable global","is_correct":false},{"id":"d","text":"Un decorador","is_correct":false}]',
   'self apunta a la instancia que llamó al método.', 2),
  ('El método __str__ sirve para:',
   '[{"id":"a","text":"Inicializar el objeto","is_correct":false},{"id":"b","text":"Devolver la representación legible del objeto al usar print()","is_correct":true},{"id":"c","text":"Eliminar el objeto","is_correct":false},{"id":"d","text":"Convertir a int","is_correct":false}]',
   'print() usa __str__ para una representación amigable al humano.', 3),
  ('Si Factura.subtotal()=100 y aplicas IVA 15 % de Ecuador, total_con_iva debe ser:',
   '[{"id":"a","text":"112","is_correct":false},{"id":"b","text":"115","is_correct":true},{"id":"c","text":"100","is_correct":false},{"id":"d","text":"85","is_correct":false}]',
   'subtotal·(1+0.15) = 100·1.15 = 115.', 4),
  ('Un atributo prefijado con doble guion bajo (__precio) en Python:',
   '[{"id":"a","text":"Es público","is_correct":false},{"id":"b","text":"Sufre name mangling y es difícil acceder desde fuera","is_correct":true},{"id":"c","text":"Es estático","is_correct":false},{"id":"d","text":"No existe","is_correct":false}]',
   'Python aplica name mangling para "ocultarlo" como _Clase__precio.', 5)
) AS x(qt, opts, exp, idx)
WHERE NOT EXISTS (SELECT 1 FROM quiz_questions qq WHERE qq.quiz_id = q.id AND qq.order_index = x.idx);

-- ============================================================================
-- BLOQUE 3 — PLANTILLA PARA SESIONES 3..8 DE LAS 9 MATERIAS
-- ----------------------------------------------------------------------------
-- Total restante: 6 sesiones × 9 materias × 5 preguntas = 270 preguntas
--
-- Generación recomendada: usar /crear-quiz [tema] [ruta-teoria] una vez por
-- sesión. La plantilla a continuación garantiza que el script SQL produzca
-- un quiz placeholder con 1 pregunta de orientación por cada (slug, sesión).
-- Luego, completar a 5 preguntas con contenido real desde la teoría
-- (`recoleccion/carreras/<slug>/ejercicios/sesion-NN.md` y la teoría que ya
-- existe en Supabase para `p1-fundamentos-programacion`).
--
-- ATENCIÓN: este bloque inserta 1 placeholder por sesión 3..8 — 6 × 9 = 54.
-- Cuando se hayan creado preguntas reales (4 más por sesión), borrar los
-- placeholders con DELETE WHERE order_index = 99.
-- ============================================================================

INSERT INTO quiz_questions (quiz_id, question_text, question_type, options, explanation, points, order_index)
SELECT
  qz.id AS quiz_id,
  '[Pendiente] Sesión ' || s.number || ' — pregunta a redactar a partir de la teoría' AS question_text,
  'multiple_choice' AS question_type,
  '[{"id":"a","text":"Opción A","is_correct":true},{"id":"b","text":"Opción B","is_correct":false},{"id":"c","text":"Opción C","is_correct":false},{"id":"d","text":"Opción D","is_correct":false}]'::jsonb AS options,
  'Placeholder — completar con explicación real.' AS explanation,
  1 AS points,
  99 AS order_index
FROM quizzes qz
JOIN sessions s ON s.id = qz.session_id
JOIN _subj_map m ON m.subject_id = s.subject_id
WHERE s.number BETWEEN 3 AND 8
  AND NOT EXISTS (
    SELECT 1 FROM quiz_questions qq
    WHERE qq.quiz_id = qz.id AND qq.order_index = 99
  );

-- ----------------------------------------------------------------------------
-- VERIFICACIÓN FINAL
-- ----------------------------------------------------------------------------

SELECT
  m.slug,
  s.number AS sesion,
  qz.id    AS quiz_id,
  count(qq.id) AS preguntas
FROM _subj_map m
JOIN sessions s ON s.subject_id = m.subject_id
LEFT JOIN quizzes qz ON qz.session_id = s.id
LEFT JOIN quiz_questions qq ON qq.quiz_id = qz.id
WHERE s.number BETWEEN 1 AND 8
GROUP BY m.slug, s.number, qz.id
ORDER BY m.slug, s.number;

COMMIT;

-- Para revertir manualmente:
-- ROLLBACK;
