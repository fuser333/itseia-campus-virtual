#!/usr/bin/env node
/**
 * generate_gamma_carreras_p1_p2.js
 *
 * Genera 18 presentaciones Gamma para las primeras 2 sesiones de cada una
 * de las 9 materias robustas de P1-P2 (Carreras ITSEIA Academy):
 *
 *   1. p1-fundamentos-programacion
 *   2. p1-introduccion-ia
 *   3. p1-logica-pensamiento-analitico
 *   4. p2-bases-datos
 *   5. p2-estadistica
 *   6. p2-estructuras-datos
 *   7. p2-ingles-tecnico
 *   8. p2-matematicas-ii
 *   9. p2-poo
 *
 * Endpoint: POST https://public-api.gamma.app/v1.0/generations
 *           GET  https://public-api.gamma.app/v1.0/generations/{id}
 *
 * Resultado: content/carreras_p1_p2_gamma_urls.json (idempotente)
 *
 * Run: node apps/web/content/generate_gamma_carreras_p1_p2.js
 */

const fs   = require('fs');
const path = require('path');

const GAMMA_KEY  = 'sk-gamma-i1QpwB075C7XJzrB37YkUOCybMnM6FswKcmxbpH8g';
const GAMMA_BASE = 'https://public-api.gamma.app/v1.0';

const GAMMA_HEADERS = {
  'X-API-KEY':    GAMMA_KEY,
  'Content-Type': 'application/json',
};

// ─────────────────────────────────────────────────────────────────────────────
// 18 PRESENTACIONES — Sesiones 1 y 2 × 9 materias
// Cada bloque de inputText sigue el patrón ITSEIA (ver content/generate_gamma_c1.js).
// Nota crítica: el contenido va con ortografía española correcta (tildes y Ñ).
// ─────────────────────────────────────────────────────────────────────────────

const PRESENTATIONS = [
  // ════════════════════════════════════════════════════════════════════════
  // 1. p1-fundamentos-programacion (Fundamentos de Programación — Python)
  // ════════════════════════════════════════════════════════════════════════
  {
    materiaSlug: 'p1-fundamentos-programacion',
    sesion: 1,
    title: 'P1 Fundamentos de Programación — Sesión 1: Introducción a Python',
    inputText: `# Introducción a la Programación y Python
## P1. Fundamentos de Programación — Sesión 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Comprender qué significa programar y por qué Python es el lenguaje #1 para IA
- Ejecutar tu primer programa con print() en Google Colab
- Distinguir comentarios, instrucciones y errores de sintaxis
- Conectar lo aprendido con el mercado laboral tech en Ecuador

## Slide 2 — ¿Qué es programar?
Programar es traducir un problema real a instrucciones precisas que la computadora ejecuta en orden. Como una receta de cocina: pasos, decisiones y repeticiones.

La computadora no piensa: hace exactamente lo que tú le dices.

## Slide 3 — ¿Por qué Python?
- Legibilidad casi en inglés: ideal para principiantes
- Ecosistema de IA: TensorFlow, PyTorch, scikit-learn, pandas
- Comunidad #1 del mundo (índice TIOBE 2026)
- 75 % de las ofertas de trabajo en IA exigen Python (LinkedIn 2026)

Python lo creó Guido van Rossum en 1991 con el lema: "simple es mejor que complejo".

## Slide 4 — Tu primer programa en Python
\`\`\`python
# Mi primer programa
print("Hola, mundo")
print("Bienvenido a ITSEIA")
\`\`\`
Ejecuta en Google Colab (gratuito, sin instalar nada) o en VS Code con la extensión Python.

## Slide 5 — Comentarios y errores
- Los comentarios comienzan con \`#\` y Python los ignora
- Los errores no son fracaso: son tu profesor más honesto
- Practica leer tracebacks: línea, archivo, tipo de error

## Slide 6 — Python como calculadora
\`\`\`python
print(2 + 3)        # 5
print(15 / 4)       # 3.75
print(15 // 4)      # 3 (división entera)
print(15 % 4)       # 3 (módulo)
print(2 ** 8)       # 256
\`\`\`

## Slide 7 — Aplicación en Ecuador
- Banco Pichincha, Banco Pacífico y Produbanco contratan profesionales Python para detectar fraude
- 30 000 plazas tech disponibles vs 3 000 profesionales graduados al año (INEC)
- Tu primer print() ya cierra la brecha: estás dentro del 1 % que sabe programar

## Slide 8 — Resumen
1. Programar = traducir problemas a instrucciones precisas
2. Python = el lenguaje más usado en IA y ciencia de datos
3. print() muestra información; # crea comentarios
4. Los errores son tu mejor maestro
5. En Ecuador hay enorme demanda de programadores Python

## Slide 9 — Próximo y CTA
Próxima sesión: Variables, tipos de datos y operadores en Python.
Practica: escribe 3 programas que muestren datos reales del mercado laboral en Ecuador.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    materiaSlug: 'p1-fundamentos-programacion',
    sesion: 2,
    title: 'P1 Fundamentos de Programación — Sesión 2: Variables, tipos y operadores',
    inputText: `# Variables, Tipos de Datos y Operadores
## P1. Fundamentos de Programación — Sesión 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Declarar variables en Python con nombres claros
- Distinguir int, float, str y bool
- Aplicar operadores aritméticos, de comparación y lógicos
- Convertir entre tipos con int(), float(), str()

## Slide 2 — Variables: cajas con nombre
\`\`\`python
nombre = "María"
edad = 22
precio_pension = 99.0
es_estudiante = True
\`\`\`
Reglas: empieza con letra o _, sin espacios, en snake_case.

## Slide 3 — Los 4 tipos básicos
- int — números enteros (edad = 22)
- float — números decimales (precio = 99.0)
- str — texto entre comillas ("María")
- bool — True o False (es_estudiante = True)

Inspecciona con type(variable).

## Slide 4 — Operadores aritméticos
\`\`\`python
print(10 + 3)   # 13
print(10 - 3)   # 7
print(10 * 3)   # 30
print(10 / 3)   # 3.333…
print(10 // 3)  # 3
print(10 % 3)   # 1
print(10 ** 3)  # 1000
\`\`\`

## Slide 5 — Operadores de comparación y lógicos
- Comparación: ==, !=, <, >, <=, >=
- Lógicos: and, or, not
- Devuelven bool: True o False

\`\`\`python
print(edad >= 18 and es_estudiante)  # True
\`\`\`

## Slide 6 — Conversión de tipos (casting)
\`\`\`python
edad_str = "22"
edad_int = int(edad_str)        # 22
precio = float("99.99")          # 99.99
mensaje = "Tu edad es " + str(edad_int)
\`\`\`
Sumar str + int sin convertir lanza TypeError.

## Slide 7 — Aplicación en Ecuador
- Calcula el costo total de la pensión ITSEIA: 99 USD × 36 meses = 3 564 USD
- Calcula el ahorro frente a una universidad privada: 3 564 vs 18 000 = 80 % menos
- Guarda nombre y cédula en variables y formatea con f-strings

## Slide 8 — Resumen
1. Variables = cajas con nombre que guardan datos
2. 4 tipos básicos: int, float, str, bool
3. Operadores aritméticos, de comparación y lógicos
4. Convierte tipos con int(), float(), str()
5. Aplica todo a problemas reales de tu vida en Ecuador

## Slide 9 — Próximo y CTA
Próxima sesión: Condicionales y bucles. Toma decisiones en código.
Practica: programa una calculadora del costo total de tu carrera.

itseia.ai — La primera academia de IA del Ecuador
`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // 2. p1-introduccion-ia (Introducción a la IA)
  // ════════════════════════════════════════════════════════════════════════
  {
    materiaSlug: 'p1-introduccion-ia',
    sesion: 1,
    title: 'P1 Introducción a la IA — Sesión 1: Qué es la IA y línea de tiempo',
    inputText: `# Qué es la IA — Línea de Tiempo y Tipos
## P1. Introducción a la Inteligencia Artificial — Sesión 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Definir IA con precisión técnica
- Trazar la línea de tiempo desde Turing 1950 hasta GPT-4o 2024
- Distinguir ANI, AGI y ASI con ejemplos reales
- Reconocer la IA que ya usas a diario en Ecuador

## Slide 2 — Definición de IA
La Inteligencia Artificial es la disciplina que crea sistemas capaces de tareas que normalmente exigen inteligencia humana: aprender, razonar, percibir, decidir y comunicarse.

5 capacidades clave: Percepción, Razonamiento, Aprendizaje, Comunicación, Toma de decisiones.

## Slide 3 — Línea de tiempo de la IA
- 1950 — Alan Turing publica el Test de Turing
- 1956 — Dartmouth: nace el término "Inteligencia Artificial"
- 1997 — Deep Blue vence a Kasparov en ajedrez
- 2012 — AlexNet revoluciona el Deep Learning
- 2016 — AlphaGo derrota al campeón mundial de Go
- 2022 — ChatGPT: 1 millón de usuarios en 5 días
- 2024 — IA multimodal: GPT-4o, Gemini 1.5, Claude 3

## Slide 4 — Los 3 tipos de IA
- ANI (IA Estrecha): una sola tarea, mejor que humanos. Es toda la IA actual
- AGI (IA General): cualquier tarea cognitiva como un humano. No existe aún
- ASI (Superinteligencia): supera a humanos en todo. Solo teórica

## Slide 5 — Ejemplos de ANI en Ecuador
- Filtro antispam de Gmail
- Banco Pichincha: detección de fraude en tiempo real
- Recomendaciones de Netflix y Spotify
- Reconocimiento facial del pasaporte ecuatoriano
- Chatbots bancarios de Produbanco y CNT

Toda la IA comercial en 2026 es ANI.

## Slide 6 — ¿Por qué importa hoy?
- En 2024 Ecuador procesó más de 12 millones de transacciones digitales con IA detrás
- Empleabilidad IA en Ecuador: 85 % a 92 %
- ITSEIA es la primera academia formal de IA en el país

## Slide 7 — Errores comunes
- "ChatGPT es AGI" — falso, es ANI muy avanzada
- "La IA piensa como un humano" — procesa patrones estadísticos
- "La IA reemplazará todos los empleos" — transforma roles, no los elimina
- "Solo programadores usan IA" — cualquier profesional puede hacerlo

## Slide 8 — Resumen
1. La IA es la disciplina que crea máquinas que aprenden y deciden
2. Tiene más de 70 años de historia con inviernos y revoluciones
3. Hay 3 tipos: ANI (existe), AGI (en desarrollo) y ASI (teórica)
4. Toda la IA actual es ANI, incluido ChatGPT
5. Ecuador ya usa IA en banca, salud, agricultura y comercio

## Slide 9 — Próximo y CTA
Próxima sesión: Machine Learning, Deep Learning e IA simbólica.
Investiga 3 empresas ecuatorianas con IA y trae casos a clase.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    materiaSlug: 'p1-introduccion-ia',
    sesion: 2,
    title: 'P1 Introducción a la IA — Sesión 2: ML, DL e IA simbólica',
    inputText: `# Machine Learning, Deep Learning e IA Simbólica
## P1. Introducción a la Inteligencia Artificial — Sesión 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Explicar la diferencia entre ML, DL e IA simbólica
- Identificar los 3 tipos de aprendizaje automático
- Reconocer cuándo usar cada enfoque
- Aplicar lo aprendido a casos reales de Ecuador

## Slide 2 — Programación tradicional vs ML
- Tradicional: Datos + Reglas → Resultado
- Machine Learning: Datos + Resultados → Reglas

ML descubre patrones que un humano no podría escribir manualmente.

## Slide 3 — Los 3 tipos de aprendizaje
- Supervisado: datos etiquetados (spam vs no spam, fraude vs no fraude)
- No supervisado: descubre patrones ocultos (segmentación de clientes)
- Por refuerzo: prueba y error con recompensas (AlphaGo, robótica)

80 % de las aplicaciones comerciales son supervisadas.

## Slide 4 — Deep Learning: redes profundas
Múltiples capas que extraen características cada vez más abstractas:
- Capa 1: bordes
- Capa 2: formas
- Capa 3: objetos
- Capa N: escenas completas

Requiere datos masivos, GPU y horas de entrenamiento.

## Slide 5 — IA simbólica: reglas humanas
SI fiebre Y tos Y dificultad respiratoria → posible neumonía

- Ventajas: explicable, auditable, predecible
- Limitaciones: no se adapta, no escala, requiere experto humano
- Uso actual: triaje IESS, protocolos legales, reglas bancarias

## Slide 6 — Sistemas neuro-simbólicos (futuro)
- Deep Learning para percepción
- Reglas simbólicas para razonamiento

Lo mejor de ambos mundos. Crítico en banca y salud.

## Slide 7 — Aplicaciones en Ecuador
- Banco Pichincha: ML supervisado para fraude
- ImagemIA: DL para radiografías médicas
- IESS: IA simbólica para triaje de emergencias
- Floricultura: ML no supervisado para detectar enfermedades

## Slide 8 — Resumen
1. ML: máquinas que aprenden patrones de datos
2. DL: redes neuronales profundas para problemas complejos
3. IA simbólica: reglas explícitas auditables
4. El futuro combina ambos: sistemas neuro-simbólicos
5. ML supervisado y DL son los más demandados en el mercado laboral

## Slide 9 — Próximo y CTA
Próxima sesión: Aplicaciones reales de IA en Ecuador y LATAM.
Practica: clasifica 5 productos del Banco Pichincha como ML supervisado, no supervisado o reglas simbólicas.

itseia.ai — La primera academia de IA del Ecuador
`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // 3. p1-logica-pensamiento-analitico
  // ════════════════════════════════════════════════════════════════════════
  {
    materiaSlug: 'p1-logica-pensamiento-analitico',
    sesion: 1,
    title: 'P1 Lógica y Pensamiento Analítico — Sesión 1: Proposiciones y conectores',
    inputText: `# Proposiciones y Conectores Lógicos
## P1. Lógica y Pensamiento Analítico — Sesión 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Identificar proposiciones lógicas en situaciones cotidianas en Ecuador
- Aplicar los 5 conectores lógicos: Y, O, NO, SI…ENTONCES, SI Y SOLO SI
- Distinguir afirmaciones verificables de opiniones
- Construir razonamientos válidos paso a paso

## Slide 2 — ¿Qué es una proposición?
Una proposición es una afirmación que puede ser VERDADERA o FALSA, sin ambigüedad.
- "Quito tiene más de 2 millones de habitantes" — proposición
- "Cierra la puerta" — NO es proposición (es orden)
- "El SRI cobra impuesto a la renta" — proposición

## Slide 3 — Los 5 conectores lógicos
- CONJUNCIÓN (Y): "P y Q" — ambas verdaderas
- DISYUNCIÓN (O): "P o Q" — al menos una verdadera
- NEGACIÓN (NO): "no P" — invierte
- CONDICIONAL (SI…ENTONCES): "si P, entonces Q"
- BICONDICIONAL (SI Y SOLO SI): "P si y solo si Q"

## Slide 4 — Tablas de verdad
| P | Q | P y Q | P o Q | no P | P → Q |
|---|---|-------|-------|------|-------|
| V | V | V     | V     | F    | V     |
| V | F | F     | V     | F    | F     |
| F | V | F     | V     | V    | V     |
| F | F | F     | F     | V    | V     |

## Slide 5 — Aplicación en Ecuador
- "Si tengo cédula ecuatoriana Y tengo 18 años, entonces puedo votar"
- "Llueve O hay paro, entonces el tráfico en Quito será terrible"
- "No es feriado, entonces hay clases en ITSEIA"

## Slide 6 — Falacias comunes
- Afirmar el consecuente: P → Q, Q, ∴ P (FALSO)
- Negar el antecedente: P → Q, no P, ∴ no Q (FALSO)
- Generalización apresurada: 1 caso, ∴ todos

## Slide 7 — Lógica y programación
\`\`\`python
edad = 19
es_ciudadano = True
puede_votar = (edad >= 18) and es_ciudadano
\`\`\`
Cada \`if\`, \`while\` y \`and\` que escribirás es lógica formal aplicada.

## Slide 8 — Resumen
1. Proposiciones = afirmaciones verdaderas o falsas
2. 5 conectores: Y, O, NO, SI…ENTONCES, SI Y SOLO SI
3. Tablas de verdad evalúan combinaciones
4. Detecta falacias para evitar razonar mal
5. La lógica es la base del pensamiento computacional

## Slide 9 — Próximo y CTA
Próxima sesión: Razonamiento deductivo e inductivo.
Practica: escribe 5 proposiciones compuestas sobre tu vida en Ecuador.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    materiaSlug: 'p1-logica-pensamiento-analitico',
    sesion: 2,
    title: 'P1 Lógica y Pensamiento Analítico — Sesión 2: Razonamiento deductivo e inductivo',
    inputText: `# Razonamiento Deductivo e Inductivo
## P1. Lógica y Pensamiento Analítico — Sesión 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Distinguir razonamiento deductivo de inductivo
- Construir un silogismo válido
- Reconocer el método científico como inducción rigurosa
- Aplicar ambos a problemas de IA y a tu vida en Ecuador

## Slide 2 — Deducción: de lo general a lo particular
Premisa 1: Todos los humanos son mortales.
Premisa 2: Sócrates es humano.
Conclusión: Sócrates es mortal.

Si las premisas son verdaderas, la conclusión es CIERTA.

## Slide 3 — Inducción: de lo particular a lo general
- Observas 100 cisnes blancos en Ecuador
- Concluyes: "todos los cisnes son blancos"
- Riesgo: 1 cisne negro derrumba la teoría (Karl Popper)

La inducción es probable, no cierta.

## Slide 4 — Deducción vs Inducción
| Aspecto | Deducción | Inducción |
|---------|-----------|-----------|
| Dirección | General → Particular | Particular → General |
| Certeza | Total si premisas son verdaderas | Probable |
| Ejemplos | Matemáticas, lógica formal | Ciencia, ML, big data |
| En IA | Sistemas expertos | Machine Learning |

## Slide 5 — Silogismos en programación
\`\`\`python
# Premisa 1: Todo número par es divisible por 2
# Premisa 2: 8 es par
# Conclusión: 8 es divisible por 2
print(8 % 2 == 0)  # True
\`\`\`

## Slide 6 — Inducción y Machine Learning
- ML supervisado es inducción a escala industrial
- Aprende de ejemplos (entrenamiento)
- Generaliza a datos nuevos (predicción)
- Riesgo: overfitting = inducción demasiado específica

## Slide 7 — Aplicación en Ecuador
- Banco Pichincha (deducción): "Si transacción > 10 000 USD desde IP extranjera, requiere verificación"
- Predicción de demanda en Supermaxi (inducción): aprende de millones de tickets pasados
- INEC (inducción): de 4 000 hogares encuestados infiere indicadores de 17 millones

## Slide 8 — Resumen
1. Deducción: de regla general a caso particular, certeza total
2. Inducción: de casos a regla general, probabilidad
3. Silogismo: estructura clásica de la deducción
4. ML supervisado es inducción rigurosa
5. Combina ambas para razonar mejor en cualquier carrera

## Slide 9 — Próximo y CTA
Próxima sesión: Pensamiento crítico y detección de sesgos.
Practica: identifica 3 inducciones que tu cerebro hace al estimar tráfico en Quito.

itseia.ai — La primera academia de IA del Ecuador
`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // 4. p2-bases-datos
  // ════════════════════════════════════════════════════════════════════════
  {
    materiaSlug: 'p2-bases-datos',
    sesion: 1,
    title: 'P2 Bases de Datos — Sesión 1: Modelo Entidad-Relación',
    inputText: `# Modelo Entidad-Relación (ER)
## P2. Bases de Datos Relacionales — Sesión 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Definir entidades, atributos y relaciones
- Distinguir clave primaria (PK) y clave foránea (FK)
- Determinar cardinalidades 1:1, 1:N y N:M
- Diseñar un diagrama ER del Registro Civil del Ecuador

## Slide 2 — ¿Qué es el modelo ER?
Un plano arquitectónico que se dibuja ANTES de crear tablas. Permite:
- Detectar redundancias
- Garantizar integridad referencial
- Comunicar el diseño a equipos no técnicos

Inventado por Peter Chen en 1976.

## Slide 3 — Entidades y atributos
- Entidad: objeto del mundo real con existencia propia (CIUDADANO, PROVINCIA)
- Atributo: propiedad de una entidad (cédula, nombre, fecha de nacimiento)
- Clave primaria: atributo que identifica únicamente cada fila

## Slide 4 — Caso real: Registro Civil del Ecuador
- 17 millones de ciudadanos
- Cada ciudadano tiene cédula única (PK)
- Puede casarse, tener hijos, cambiar estado civil
- Necesita una base de datos íntegra y sin duplicados

## Slide 5 — Relaciones y cardinalidad
| Relación | Cardinalidad | Ejemplo |
|----------|--------------|---------|
| 1:1 | Uno a uno | Ciudadano ↔ Acta de nacimiento |
| 1:N | Uno a muchos | Provincia → Cantones |
| N:M | Muchos a muchos | Ciudadano ↔ Matrimonio |

N:M siempre requiere tabla intermedia.

## Slide 6 — Notación crow's foot
\`\`\`
PROVINCIA (1) ──────< (N) CANTÓN
CANTÓN    (1) ──────< (N) PARROQUIA
CIUDADANO (N) >─────< (M) MATRIMONIO  [tabla PARTICIPA_EN]
CIUDADANO (1) ──────< (1) ACTA_NACIMIENTO
\`\`\`

## Slide 7 — Errores comunes al diseñar ER
- Confundir entidad con atributo
- Olvidar la clave primaria
- No identificar relaciones N:M y duplicar datos
- Saltarse la fase de modelado y "ir directo a tablas"

## Slide 8 — Resumen
1. ER = plano de la base de datos antes de codificar
2. Entidad = objeto, atributo = propiedad, relación = vínculo
3. PK identifica única, FK conecta entidades
4. Cardinalidades: 1:1, 1:N, N:M
5. Diseñar bien ER ahorra horas de re-trabajo después

## Slide 9 — Próximo y CTA
Próxima sesión: SQL básico — CREATE, INSERT, SELECT.
Practica: dibuja el ER de una tienda online ecuatoriana (clientes, productos, pedidos).

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    materiaSlug: 'p2-bases-datos',
    sesion: 2,
    title: 'P2 Bases de Datos — Sesión 2: SQL básico (CREATE, INSERT, SELECT)',
    inputText: `# SQL Básico — CREATE, INSERT, SELECT
## P2. Bases de Datos Relacionales — Sesión 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Crear tablas con CREATE TABLE
- Insertar filas con INSERT INTO
- Consultar con SELECT … FROM … WHERE
- Aplicar SQL al SRI y al Banco Pichincha

## Slide 2 — Tipos de datos SQL
- INTEGER, BIGINT — números enteros
- DECIMAL(p,s) — decimales con precisión
- VARCHAR(n) — texto de hasta n caracteres
- DATE, TIMESTAMP — fechas y horas
- BOOLEAN — verdadero/falso

## Slide 3 — CREATE TABLE
\`\`\`sql
CREATE TABLE ciudadano (
  cedula VARCHAR(10) PRIMARY KEY,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE,
  provincia VARCHAR(50)
);
\`\`\`

## Slide 4 — INSERT INTO
\`\`\`sql
INSERT INTO ciudadano (cedula, nombres, apellidos, fecha_nacimiento, provincia)
VALUES ('1712345678', 'María', 'Vásquez', '2003-05-12', 'Pichincha');
\`\`\`
Cada fila es un ciudadano real.

## Slide 5 — SELECT básico
\`\`\`sql
SELECT cedula, nombres FROM ciudadano;
SELECT * FROM ciudadano WHERE provincia = 'Pichincha';
SELECT COUNT(*) FROM ciudadano WHERE fecha_nacimiento > '2000-01-01';
\`\`\`

## Slide 6 — Filtros y ordenamiento
\`\`\`sql
SELECT nombres, apellidos
FROM ciudadano
WHERE provincia IN ('Pichincha','Guayas','Azuay')
  AND fecha_nacimiento BETWEEN '2000-01-01' AND '2010-12-31'
ORDER BY apellidos ASC
LIMIT 20;
\`\`\`

## Slide 7 — Aplicación real
- SRI: identifica contribuyentes con declaraciones pendientes
- Banco Pichincha: clientes con saldo mayor a 10 000 USD por sucursal
- INEC: cuenta habitantes por cantón con un solo SELECT

## Slide 8 — Resumen
1. CREATE TABLE define la estructura
2. INSERT INTO agrega filas
3. SELECT consulta datos
4. WHERE, ORDER BY y LIMIT refinan la consulta
5. SQL es el lenguaje universal de los datos

## Slide 9 — Próximo y CTA
Próxima sesión: JOIN, GROUP BY y agregaciones.
Practica: crea una BD de 3 tablas (clientes, productos, pedidos) y haz 5 SELECT.

itseia.ai — La primera academia de IA del Ecuador
`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // 5. p2-estadistica
  // ════════════════════════════════════════════════════════════════════════
  {
    materiaSlug: 'p2-estadistica',
    sesion: 1,
    title: 'P2 Estadística — Sesión 1: Estimación puntual e intervalos de confianza',
    inputText: `# Estimación Puntual e Intervalos de Confianza
## P2. Estadística Inferencial — Sesión 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Calcular estimaciones puntuales (media, proporción)
- Construir intervalos de confianza al 95 %
- Interpretar el error estándar
- Aplicar a sueldos del sector tech en Ecuador

## Slide 2 — Inferencia estadística
- Población: TODOS los profesionales tech del Ecuador (~50 000)
- Muestra: 36 encuestados por la Cámara de Comercio de Quito
- Objetivo: inferir parámetros poblacionales desde la muestra

## Slide 3 — Estimación puntual
La estimación puntual de la media poblacional μ es la media muestral x̄.
- x̄ = $1 285 (sueldo mensual promedio)
- Es nuestra "mejor apuesta" pero sin precisión

Para proporciones: p̂ = (éxitos / n).

## Slide 4 — Error estándar
\`\`\`
SE = s / √n = 420 / √36 = 420 / 6 = 70
\`\`\`
A menor SE, más precisa la estimación. Crece con desviación, decrece con tamaño de muestra.

## Slide 5 — Intervalo de confianza al 95 %
IC95 % = x̄ ± 1.96 · SE = 1 285 ± 1.96 · 70 = (1 148, 1 422)

Interpretación: si repites el muestreo 100 veces, 95 IC contendrán la media real.

## Slide 6 — Tamaño de muestra
- n pequeño (< 30): usa distribución t de Student
- n grande (≥ 30): usa distribución normal
- Doblar precisión exige cuadruplicar n

## Slide 7 — Aplicación en Ecuador
- INEC: encuesta a 4 000 hogares para inferir indicadores nacionales
- Banco Central: estima inflación con muestreo de precios
- ITSEIA usa IC para reportar empleabilidad 85 % a 92 %

## Slide 8 — Resumen
1. Estimación puntual = mejor apuesta puntual (x̄, p̂)
2. Error estándar mide precisión
3. IC al 95 % entrega un rango con confianza
4. n grande mejora precisión
5. Toda inferencia tiene incertidumbre cuantificable

## Slide 9 — Próximo y CTA
Próxima sesión: Pruebas de hipótesis y valor p.
Practica: calcula IC95 % para los sueldos de tu cohorte ITSEIA (n=20).

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    materiaSlug: 'p2-estadistica',
    sesion: 2,
    title: 'P2 Estadística — Sesión 2: Pruebas de hipótesis y valor p',
    inputText: `# Pruebas de Hipótesis y Valor p
## P2. Estadística Inferencial — Sesión 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Plantear hipótesis nula H0 y alternativa H1
- Calcular el valor p
- Interpretar el nivel de significancia α
- Decidir rechazo o no rechazo de H0

## Slide 2 — Hipótesis estadística
- H0 (nula): no hay efecto / no hay diferencia
- H1 (alternativa): existe efecto

Ejemplo: H0 = "el sueldo promedio tech en Ecuador es 1 200 USD"; H1 = "es distinto".

## Slide 3 — Valor p
El valor p es la probabilidad de obtener los datos observados (o más extremos) si H0 fuera verdadera.
- p < 0.05 → rechazar H0
- p ≥ 0.05 → no rechazar H0

Atención: no rechazar ≠ aceptar.

## Slide 4 — Errores tipo I y II
| Decisión | H0 verdadera | H0 falsa |
|----------|--------------|----------|
| Rechazar H0 | Error tipo I (α) | Acierto |
| No rechazar | Acierto | Error tipo II (β) |

α = 0.05 es la convención.

## Slide 5 — Prueba z para una media
\`\`\`
z = (x̄ - μ0) / (s / √n)
\`\`\`
Si |z| > 1.96 (con α = 0.05 a dos colas), se rechaza H0.

## Slide 6 — Caso real: ITSEIA
Hipótesis: el sueldo promedio de egresados ITSEIA es mayor al promedio nacional tech (1 200 USD).
- x̄ = 1 285, n = 36, s = 420
- z = (1 285 - 1 200) / (420 / 6) = 85 / 70 = 1.21
- p ≈ 0.11 → no rechazamos H0 con la muestra actual

Necesitamos más datos para concluir.

## Slide 7 — Buenas prácticas
- Define hipótesis ANTES de mirar los datos (p-hacking)
- Reporta tamaño de muestra y desviación
- Usa intervalos de confianza junto al valor p
- Replica antes de publicar

## Slide 8 — Resumen
1. H0 vs H1: estructura toda prueba
2. Valor p mide compatibilidad con H0
3. α = 0.05 es la convención
4. Errores tipo I y II son inevitables
5. Los datos no "prueban" nada: solo apoyan o no la hipótesis

## Slide 9 — Próximo y CTA
Próxima sesión: ANOVA y comparación de múltiples grupos.
Practica: plantea una hipótesis sobre tu cohorte ITSEIA y calcula su valor p.

itseia.ai — La primera academia de IA del Ecuador
`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // 6. p2-estructuras-datos
  // ════════════════════════════════════════════════════════════════════════
  {
    materiaSlug: 'p2-estructuras-datos',
    sesion: 1,
    title: 'P2 Estructuras de Datos — Sesión 1: Arrays y listas enlazadas',
    inputText: `# Arrays y Listas Enlazadas
## P2. Estructuras de Datos y Algoritmos — Sesión 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Distinguir array (lista de Python) de lista enlazada
- Comparar costos O(1) vs O(n) por operación
- Implementar una lista enlazada simple en Python
- Elegir la estructura óptima para un caso real (turnos hospitalarios)

## Slide 2 — Array vs lista enlazada
| Operación | Array | Lista enlazada |
|-----------|-------|----------------|
| Acceso por índice | O(1) | O(n) |
| Inserción al inicio | O(n) | O(1) |
| Inserción al final | O(1) amortizado | O(1) si hay puntero al final |
| Búsqueda | O(n) | O(n) |

## Slide 3 — Array (list de Python)
\`\`\`python
turnos = []
turnos.append("Juan")  # O(1)
turnos.insert(0, "Ana") # O(n)
print(turnos[0])        # O(1)
\`\`\`
Python guarda los elementos en memoria contigua.

## Slide 4 — Lista enlazada simple
\`\`\`python
class Nodo:
    def __init__(self, dato):
        self.dato = dato
        self.siguiente = None

class ListaEnlazada:
    def __init__(self):
        self.cabeza = None

    def insertar_inicio(self, dato):
        nuevo = Nodo(dato)
        nuevo.siguiente = self.cabeza
        self.cabeza = nuevo
\`\`\`

## Slide 5 — Caso real: Hospital Eugenio Espejo
- 2 000 pacientes diarios
- Llegan y salen constantemente del sistema de turnos
- ¿Array o lista enlazada?
- Lista enlazada gana: inserciones/eliminaciones frecuentes en O(1)

## Slide 6 — Memoria y cache
- Array: bueno para CPU cache (memoria contigua)
- Lista enlazada: peor para cache (saltos en memoria)
- Trade-off real: medir antes de optimizar

## Slide 7 — Cuándo usar cada una
- Array: lectura por índice, búsqueda binaria, datos estáticos
- Lista enlazada: cola FIFO, pila, inserciones constantes en cualquier punto

## Slide 8 — Resumen
1. Array = memoria contigua, acceso O(1) por índice
2. Lista enlazada = nodos con punteros, inserción O(1)
3. Notación Big-O describe el peor caso
4. Hospital Espejo se beneficia de listas enlazadas
5. Mide antes de optimizar: la cache importa

## Slide 9 — Próximo y CTA
Próxima sesión: Pilas y colas (LIFO y FIFO).
Practica: implementa una cola con lista enlazada y mide tiempos.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    materiaSlug: 'p2-estructuras-datos',
    sesion: 2,
    title: 'P2 Estructuras de Datos — Sesión 2: Pilas y colas (LIFO / FIFO)',
    inputText: `# Pilas y Colas — LIFO y FIFO
## P2. Estructuras de Datos y Algoritmos — Sesión 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Definir pila (LIFO) y cola (FIFO)
- Implementar ambas en Python
- Aplicar pilas a la pila de llamadas (call stack)
- Aplicar colas a sistemas de turnos del IESS

## Slide 2 — Pila (Stack) — LIFO
Last In, First Out: el último que entra es el primero que sale.

\`\`\`python
pila = []
pila.append('A')   # push
pila.append('B')
ultimo = pila.pop() # pop → 'B'
\`\`\`
Operaciones push y pop en O(1).

## Slide 3 — Cola (Queue) — FIFO
First In, First Out: el primero en entrar es el primero en salir.

\`\`\`python
from collections import deque
cola = deque()
cola.append('Ana')      # enqueue
cola.append('Luis')
primero = cola.popleft() # dequeue → 'Ana'
\`\`\`

## Slide 4 — Aplicaciones de pilas
- Pila de llamadas a funciones (call stack)
- Botón "deshacer" en editores
- Evaluación de expresiones matemáticas
- Recorrido DFS de grafos

## Slide 5 — Aplicaciones de colas
- Sistema de turnos del IESS
- Cola de impresión
- Mensajería asincrónica (RabbitMQ, SQS)
- Recorrido BFS de grafos

## Slide 6 — Implementación con clases
\`\`\`python
class Cola:
    def __init__(self):
        self.items = deque()
    def encolar(self, item):
        self.items.append(item)
    def desencolar(self):
        return self.items.popleft() if self.items else None
\`\`\`

## Slide 7 — Caso real: IESS Quito
- 3 000 turnos diarios por punto de atención
- Cola FIFO garantiza justicia
- Métrica clave: tiempo medio de espera
- Análisis: si el promedio sube, agregar otra ventanilla

## Slide 8 — Resumen
1. Pila = LIFO, push y pop en O(1)
2. Cola = FIFO, enqueue y dequeue en O(1)
3. Pila resuelve recursión y "deshacer"
4. Cola resuelve atención justa por orden de llegada
5. Ambas son la base de algoritmos avanzados (BFS, DFS, schedulers)

## Slide 9 — Próximo y CTA
Próxima sesión: Recursión y árboles binarios.
Practica: simula 1 000 turnos del IESS con una cola y reporta tiempo medio.

itseia.ai — La primera academia de IA del Ecuador
`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // 7. p2-ingles-tecnico
  // ════════════════════════════════════════════════════════════════════════
  {
    materiaSlug: 'p2-ingles-tecnico',
    sesion: 1,
    title: 'P2 Inglés Técnico — Sesión 1: 50 términos esenciales de IA',
    inputText: `# 50 Términos Esenciales de IA en Inglés
## P2. Inglés Técnico I — Sesión 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Reconocer y pronunciar 50 términos clave en inglés
- Leer documentación de TensorFlow, PyTorch y Hugging Face
- Construir oraciones técnicas correctas
- Eliminar la dependencia de traductores automáticos

## Slide 2 — Por qué importa
- 95 % de la documentación de IA está en inglés
- Papers de arXiv, Stack Overflow y certificaciones (AWS, Google) en inglés
- Mejor pago laboral: profesional bilingüe gana 30 % a 50 % más
- Ecuador exporta talento tech: el inglés es la llave

## Slide 3 — Fundamentos de ML (10 términos)
- Machine Learning, Training, Feature, Label, Dataset
- Overfitting, Underfitting, Bias, Variance, Hyperparameter

Practica: pronuncia "overfitting" como /ˈoʊ.vɚˌfɪt.ɪŋ/.

## Slide 4 — Redes neuronales (10 términos)
- Neural Network, Layer, Neuron, Weight, Activation
- Forward Pass, Backpropagation, Loss Function, Gradient, Optimizer

## Slide 5 — Procesamiento de lenguaje (10 términos)
- Token, Embedding, Transformer, Attention, Prompt
- Fine-tuning, Inference, Hallucination, Context Window, Temperature

## Slide 6 — Datos y evaluación (10 términos)
- Train/Test Split, Cross-Validation, Confusion Matrix, Precision, Recall
- F1-score, ROC Curve, AUC, Accuracy, Class Imbalance

## Slide 7 — Despliegue (10 términos)
- Model, Serving, Endpoint, Latency, Throughput
- Container, GPU, MLOps, Monitoring, Drift

## Slide 8 — Resumen
1. 50 términos cubren el 80 % de cualquier paper o doc
2. Practica pronunciación con voz alta
3. Lee documentación oficial todos los días 15 minutos
4. Usa ChatGPT como tutor bilingüe
5. Tu inglés técnico = tu pasaporte profesional global

## Slide 9 — Próximo y CTA
Próxima sesión: Reading comprehension de un paper de arXiv.
Practica: escribe 10 oraciones técnicas usando los términos aprendidos.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    materiaSlug: 'p2-ingles-tecnico',
    sesion: 2,
    title: 'P2 Inglés Técnico — Sesión 2: Reading comprehension de papers',
    inputText: `# Reading Comprehension — Papers de IA
## P2. Inglés Técnico I — Sesión 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Identificar la estructura IMRyD de un paper
- Leer en diagonal para encontrar lo importante
- Extraer la contribución principal en 30 segundos
- Aplicar a un paper real de arXiv

## Slide 2 — Estructura IMRyD
- Introduction — contexto y problema
- Methods — qué hicieron
- Results — qué encontraron
- Discussion — qué significa

Bonus: Abstract resume todo en 200 palabras.

## Slide 3 — Lectura en diagonal (skim reading)
1. Lee abstract completo (1 min)
2. Mira figuras y tablas (2 min)
3. Lee introducción y conclusión (3 min)
4. Profundiza en methods solo si te interesa replicar
5. Total: 10 minutos para entender la idea principal

## Slide 4 — Vocabulario crítico
- "We propose…" — la contribución
- "State-of-the-art" — lo mejor actual
- "Outperforms" — supera a
- "Limitations" — donde no funciona
- "Future work" — qué falta hacer

## Slide 5 — Caso real: paper de Transformer
- Título: "Attention Is All You Need" (Vaswani et al., 2017)
- Abstract en una frase: introduce un modelo basado solo en atención
- Resultado: 28.4 BLEU en traducción inglés→alemán
- Impacto: base de GPT, BERT, Claude

## Slide 6 — Cómo usar ChatGPT como traductor inteligente
- Pega el abstract y pide: "explica este paper a un estudiante de pregrado"
- Pregunta el significado de cada término
- Pide ejemplos en código
- Nunca copies sin entender

## Slide 7 — Errores comunes al leer en inglés
- Traducir palabra por palabra (pierdes contexto)
- Saltarse el abstract
- Ignorar las figuras (a veces son la mejor explicación)
- Asustarse por términos: muchos son simples con buena explicación

## Slide 8 — Resumen
1. Estructura IMRyD aplica a cualquier paper
2. Skim reading te ahorra horas
3. 10 frases marcadoras te dan el 70 % del paper
4. ChatGPT es tu profesor de inglés técnico 24/7
5. Lee 1 paper por semana para crecer profesionalmente

## Slide 9 — Próximo y CTA
Próxima sesión: Writing — cómo redactar emails técnicos en inglés.
Practica: lee el abstract de "Attention Is All You Need" y resúmelo en 3 frases.

itseia.ai — La primera academia de IA del Ecuador
`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // 8. p2-matematicas-ii
  // ════════════════════════════════════════════════════════════════════════
  {
    materiaSlug: 'p2-matematicas-ii',
    sesion: 1,
    title: 'P2 Matemáticas II — Sesión 1: Vectores y operaciones básicas',
    inputText: `# Vectores y Operaciones Básicas
## P2. Matemáticas II (Álgebra Lineal) — Sesión 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Representar datos reales como vectores
- Sumar, restar y escalar vectores
- Calcular producto escalar (dot product)
- Aplicar a indicadores macroeconómicos del Banco Central del Ecuador

## Slide 2 — ¿Qué es un vector?
Un vector es una lista ordenada de números. En ML, cada observación (cliente, paciente, mes) es un vector de características.

\`\`\`
v_enero = [1.2, 3.8, 2.1]   # [inflación, desempleo, ΔPIB]
\`\`\`

## Slide 3 — Suma y resta de vectores
\`\`\`
v_enero  = [1.2, 3.8, 2.1]
v_febrero = [1.4, 3.6, 2.3]
v_enero + v_febrero = [2.6, 7.4, 4.4]
\`\`\`
Componente a componente. Mismo tamaño obligatorio.

## Slide 4 — Multiplicación por escalar
\`\`\`
3 · v_enero = [3.6, 11.4, 6.3]
\`\`\`
Estira o encoge el vector sin cambiar dirección.

## Slide 5 — Producto escalar (dot product)
\`\`\`
v_enero · v_febrero = 1.2·1.4 + 3.8·3.6 + 2.1·2.3 = 1.68 + 13.68 + 4.83 = 20.19
\`\`\`
Mide similitud entre vectores. Base de modelos como cosine similarity en NLP.

## Slide 6 — Norma euclidiana
\`\`\`
||v|| = √(v1² + v2² + … + vn²)
||v_enero|| = √(1.44 + 14.44 + 4.41) = √20.29 ≈ 4.5
\`\`\`
Magnitud o "longitud" del vector.

## Slide 7 — Aplicación con NumPy
\`\`\`python
import numpy as np
v = np.array([1.2, 3.8, 2.1])
w = np.array([1.4, 3.6, 2.3])
print(v + w)        # suma
print(np.dot(v, w)) # producto escalar
print(np.linalg.norm(v)) # norma
\`\`\`

## Slide 8 — Resumen
1. Vector = lista ordenada de números
2. Suma/resta = componente a componente
3. Escalar estira sin rotar
4. Producto escalar mide similitud
5. NumPy hace todo esto en milisegundos sobre millones de vectores

## Slide 9 — Próximo y CTA
Próxima sesión: Matrices y multiplicación matricial.
Practica: representa 3 productos del SRI como vectores y calcula sus productos escalares.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    materiaSlug: 'p2-matematicas-ii',
    sesion: 2,
    title: 'P2 Matemáticas II — Sesión 2: Matrices y multiplicación',
    inputText: `# Matrices y Multiplicación Matricial
## P2. Matemáticas II (Álgebra Lineal) — Sesión 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Definir matriz y sus dimensiones
- Sumar y multiplicar matrices
- Calcular la transpuesta y la matriz identidad
- Aplicar a un dataset real de Ecuador

## Slide 2 — ¿Qué es una matriz?
Una matriz es una tabla rectangular de números con m filas y n columnas (m × n).

\`\`\`
A = [[1.2, 3.8, 2.1],
     [1.4, 3.6, 2.3],
     [1.1, 4.0, 1.9]]   # 3 meses × 3 indicadores
\`\`\`

## Slide 3 — Suma de matrices
- Mismo tamaño obligatorio
- Componente a componente
\`\`\`
A + B = [[a11+b11, a12+b12], …]
\`\`\`

## Slide 4 — Multiplicación matricial
- (m×n) · (n×p) = (m×p)
- La columna de la primera debe igualar la fila de la segunda
\`\`\`
A·B[i][j] = Σ A[i][k] · B[k][j]
\`\`\`
NO conmutativa: A·B ≠ B·A en general.

## Slide 5 — Transpuesta
\`\`\`
A^T → filas pasan a columnas
A = [[1,2,3],[4,5,6]]
A^T = [[1,4],[2,5],[3,6]]
\`\`\`

## Slide 6 — Matriz identidad
- Cuadrada con 1 en diagonal y 0 fuera
- I · A = A · I = A
\`\`\`
I3 = [[1,0,0],[0,1,0],[0,0,1]]
\`\`\`

## Slide 7 — Aplicación con NumPy y datos del INEC
\`\`\`python
import numpy as np
# 3 meses × 3 indicadores
X = np.array([[1.2,3.8,2.1],[1.4,3.6,2.3],[1.1,4.0,1.9]])
W = np.array([[0.5],[0.3],[0.2]]) # pesos del modelo
Y = X @ W   # predicción lineal: 3×1
print(Y)
\`\`\`
Toda red neuronal es una pila de multiplicaciones matriciales.

## Slide 8 — Resumen
1. Matriz = tabla m × n de números
2. Suma componente a componente
3. Multiplicación: (m×n)·(n×p)=(m×p)
4. Transpuesta intercambia filas y columnas
5. Matriz identidad es el "1" del álgebra matricial

## Slide 9 — Próximo y CTA
Próxima sesión: Determinantes e inversa.
Practica: representa 12 meses de inflación del Ecuador como matriz 12×3 y calcula su transpuesta.

itseia.ai — La primera academia de IA del Ecuador
`,
  },

  // ════════════════════════════════════════════════════════════════════════
  // 9. p2-poo
  // ════════════════════════════════════════════════════════════════════════
  {
    materiaSlug: 'p2-poo',
    sesion: 1,
    title: 'P2 POO — Sesión 1: Clases y objetos',
    inputText: `# Clases y Objetos en Python
## P2. Programación Orientada a Objetos — Sesión 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Definir una clase con \`class\`
- Instanciar objetos
- Distinguir atributos de clase y de instancia
- Aplicar a un catálogo de productos en Ecuador

## Slide 2 — ¿Qué es POO?
Programación Orientada a Objetos organiza el código alrededor de OBJETOS que combinan datos (atributos) y comportamiento (métodos).
4 pilares: Encapsulamiento, Abstracción, Herencia, Polimorfismo.

## Slide 3 — Clase: el molde
\`\`\`python
class Producto:
    pais_origen = "Ecuador"  # atributo de clase
    pass
\`\`\`
Una clase describe la estructura. No ocupa memoria de datos hasta que crees objetos.

## Slide 4 — Objeto: la instancia
\`\`\`python
laptop = Producto()
laptop.nombre = "Laptop HP 14"
laptop.precio = 650.00
laptop.stock = 12
\`\`\`
Cada objeto tiene su propia copia de atributos de instancia.

## Slide 5 — Atributos de clase vs instancia
- Atributo de clase: compartido por todos los objetos (\`pais_origen\`)
- Atributo de instancia: único por objeto (\`nombre\`, \`precio\`)
- Si cambias el de clase, afecta a todos

## Slide 6 — type() e isinstance()
\`\`\`python
print(type(laptop))             # <class '__main__.Producto'>
print(isinstance(laptop, Producto)) # True
\`\`\`
Útiles para validar en tiempo de ejecución.

## Slide 7 — Caso real: tienda Tech Quito
\`\`\`python
productos = [laptop, celular, tablet]
for p in productos:
    print(f"{p.nombre} — ${p.precio:.2f} ({p.stock} unidades)")
\`\`\`
La POO modela el inventario como una lista de objetos.

## Slide 8 — Resumen
1. Clase = molde, objeto = instancia
2. Atributos de clase son compartidos; de instancia, propios
3. \`type()\` e \`isinstance()\` validan el tipo
4. Aún sin métodos, ya organizas datos del mundo real
5. POO = base para mantener código de miles de líneas

## Slide 9 — Próximo y CTA
Próxima sesión: Constructor \`__init__\` y métodos.
Practica: modela 5 cursos de ITSEIA como objetos con nombre, precio y duración.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    materiaSlug: 'p2-poo',
    sesion: 2,
    title: 'P2 POO — Sesión 2: Constructor __init__ y métodos',
    inputText: `# Constructor __init__ y Métodos
## P2. Programación Orientada a Objetos — Sesión 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Qué aprenderás hoy
- Usar \`__init__\` para inicializar atributos
- Definir métodos con \`self\`
- Implementar \`__str__\` para representación legible
- Modelar una factura con IVA del 15 % en Ecuador

## Slide 2 — El constructor __init__
\`\`\`python
class Producto:
    def __init__(self, nombre, precio, stock):
        self.nombre = nombre
        self.precio = precio
        self.stock = stock
\`\`\`
Se ejecuta automáticamente al crear el objeto: \`Producto("Laptop", 650, 12)\`.

## Slide 3 — self: el objeto actual
- \`self\` es la primera variable de cada método
- Apunta a la instancia que llamó al método
- Permite acceder y modificar sus atributos

## Slide 4 — Definir métodos
\`\`\`python
class Producto:
    def calcular_total(self, cantidad):
        return self.precio * cantidad

    def aplicar_iva(self, iva=0.15):
        return self.precio * (1 + iva)
\`\`\`
Los métodos son funciones que viven dentro del objeto.

## Slide 5 — __str__ y __repr__
\`\`\`python
def __str__(self):
    return f"{self.nombre} — ${self.precio:.2f}"

print(laptop)  # Llama a __str__
\`\`\`
Hace tus objetos imprimibles y legibles.

## Slide 6 — Encapsulamiento
- Atributos públicos: \`self.precio\`
- Atributos protegidos: \`self._precio\` (convención)
- Atributos privados: \`self.__precio\` (name mangling)

## Slide 7 — Caso real: factura ITSEIA con IVA 15 %
\`\`\`python
class Factura:
    def __init__(self, items):
        self.items = items
    def subtotal(self):
        return sum(p.precio for p in self.items)
    def total_con_iva(self):
        return self.subtotal() * 1.15
\`\`\`
Refleja la realidad legal del SRI.

## Slide 8 — Resumen
1. \`__init__\` inicializa el objeto al crearlo
2. \`self\` es el puente al objeto actual
3. Métodos = funciones del objeto
4. \`__str__\` da representación legible
5. Encapsulamiento protege la integridad de los datos

## Slide 9 — Próximo y CTA
Próxima sesión: Herencia y polimorfismo.
Practica: agrega \`__init__\` y \`total_con_iva\` a la clase Producto y prueba con 3 objetos.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function createGeneration(inputText) {
  const res = await fetch(`${GAMMA_BASE}/generations`, {
    method: 'POST',
    headers: GAMMA_HEADERS,
    body: JSON.stringify({
      inputText,
      textMode: 'preserve',
      format: 'presentation',
      numCards: 9,
      additionalInstructions:
        'Use ITSEIA brand colors Navy #1F2F58, Yellow #FBBC0C, Sky #73B8E7. ' +
        'Modern professional educational style. Spanish (Latin America) language. ' +
        'Headers with Space Grotesk feel; body with Inter feel. ' +
        'Each slide self-contained, with clear visual hierarchy.',
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gamma POST failed: ${res.status} ${txt}`);
  }

  const data = await res.json();
  return data.generationId;
}

async function pollGeneration(generationId, maxWaitMs = 5 * 60 * 1000) {
  const start = Date.now();
  let lastStatus = '';

  while (Date.now() - start < maxWaitMs) {
    const res = await fetch(`${GAMMA_BASE}/generations/${generationId}`, {
      headers: { 'X-API-KEY': GAMMA_KEY },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Gamma poll failed: ${res.status} ${txt}`);
    }

    const data = await res.json();
    if (data.status !== lastStatus) {
      console.log(`    status: ${data.status}`);
      lastStatus = data.status;
    }

    if (data.status === 'completed') {
      return { gammaUrl: data.gammaUrl, exportUrl: data.exportUrl };
    }
    if (data.status === 'failed') {
      throw new Error(`Gamma generation failed: ${JSON.stringify(data)}`);
    }

    await sleep(5000);
  }

  throw new Error(`Gamma generation timed out after ${maxWaitMs}ms`);
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Generando 18 presentaciones Gamma — Carreras P1-P2 ===');
  console.log(`Inicio: ${new Date().toISOString()}\n`);

  const outputPath = path.join(__dirname, 'carreras_p1_p2_gamma_urls.json');

  // Cargar progreso previo si existe (idempotente — no re-paga generaciones)
  let prevResults = [];
  if (fs.existsSync(outputPath)) {
    try {
      prevResults = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log(`Cargados ${prevResults.length} resultados previos.\n`);
    } catch (_) { /* ignore */ }
  }

  const results = [];

  for (let i = 0; i < PRESENTATIONS.length; i++) {
    const p = PRESENTATIONS[i];
    const tag = `${p.materiaSlug} S${p.sesion}`;
    console.log(`[${i + 1}/${PRESENTATIONS.length}] ${tag} — ${p.title}`);

    const prev = prevResults.find(
      (r) => r.materiaSlug === p.materiaSlug && r.sesion === p.sesion && r.gammaUrl
    );
    if (prev) {
      console.log(`    YA GENERADO. Skip. URL: ${prev.gammaUrl}\n`);
      results.push(prev);
      continue;
    }

    try {
      console.log('    POST /generations…');
      const generationId = await createGeneration(p.inputText);
      console.log(`    generationId: ${generationId}`);

      console.log('    Esperando completación (max 5 min)…');
      const { gammaUrl, exportUrl } = await pollGeneration(generationId);

      console.log(`    gammaUrl:  ${gammaUrl}`);
      console.log(`    exportUrl: ${exportUrl || '(no PDF)'}\n`);

      const result = {
        materiaSlug:   p.materiaSlug,
        sesion:        p.sesion,
        title:         p.title,
        gammaUrl,
        exportUrl:     exportUrl || null,
        generationId,
        generatedAt:   new Date().toISOString(),
      };

      results.push(result);
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

      // Pausa de 3 s entre llamadas (rate limit)
      if (i < PRESENTATIONS.length - 1) {
        console.log('    (pausa 3 s)\n');
        await sleep(3000);
      }
    } catch (err) {
      console.error(`    ERROR: ${err.message}\n`);
      results.push({
        materiaSlug: p.materiaSlug,
        sesion:      p.sesion,
        title:       p.title,
        error:       err.message,
      });
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    }
  }

  // ─── Reporte final ────────────────────────────────────────────────────────
  console.log('\n=== REPORTE FINAL ===');
  console.log(`Fin: ${new Date().toISOString()}\n`);

  let ok = 0, errors = 0;
  for (const r of results) {
    const mark = r.gammaUrl ? 'OK   ' : 'ERROR';
    console.log(`[${mark}] ${r.materiaSlug} S${r.sesion}: ${r.title}`);
    if (r.gammaUrl) {
      console.log(`        URL: ${r.gammaUrl}`);
      ok++;
    } else {
      console.log(`        Error: ${r.error}`);
      errors++;
    }
  }

  console.log(`\nResumen: ${ok} OK, ${errors} errores`);
  console.log(`Guardado en: ${outputPath}`);

  if (errors > 0) process.exit(1);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
