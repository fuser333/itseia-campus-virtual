#!/usr/bin/env node
/**
 * generate_gamma_c1.js
 *
 * Genera las 5 presentaciones de Gamma para el Módulo 1 de C1 (Cursos MDT).
 * Endpoint: POST /generations → poll GET /generations/{id} hasta completed.
 * Guarda resultados en content/c1_gamma_urls.json
 *
 * Run: node content/generate_gamma_c1.js
 */

const fs = require('fs');
const path = require('path');

const GAMMA_KEY  = 'sk-gamma-i1QpwB075C7XJzrB37YkUOCybMnM6FswKcmxbpH8g';
const GAMMA_BASE = 'https://public-api.gamma.app/v1.0';

const GAMMA_HEADERS = {
  'X-API-KEY':    GAMMA_KEY,
  'Content-Type': 'application/json',
};

// ── Las 5 presentaciones del Mes 1 de C1 ────────────────────────────────────

const PRESENTATIONS = [
  {
    temaId: 1,
    title: 'C1 Tema 1 — Definicion y Evolucion Historica de la IA',
    inputText: `# Definicion y Evolucion Historica de la IA
## C1. Introduccion a IA Aplicada — Tema 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
Al finalizar esta sesion seras capaz de:
- Definir que es la Inteligencia Artificial con precision tecnica
- Identificar los hitos historicos clave que dieron forma a la IA moderna
- Diferenciar entre IA, automatizacion y robotica
- Relacionar la evolucion de la IA con su impacto actual en Ecuador y LATAM

## Slide 2 — Que es la Inteligencia Artificial
La IA es la disciplina de la informatica que busca crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana: aprender, razonar, percibir, tomar decisiones y generar lenguaje.

5 capacidades clave: Percepcion, Razonamiento, Aprendizaje, Comunicacion, Toma de decisiones.

John McCarthy (1956): "La ciencia e ingenieria de hacer maquinas inteligentes."

## Slide 3 — IA, Automatizacion y Robotica no son lo mismo
- Automatizacion: Reglas fijas, repetitiva. Ejemplo: macro de Excel.
- Robotica: Maquinas fisicas, movimiento. Ejemplo: brazo industrial.
- Inteligencia Artificial: Aprende y se adapta, toma decisiones. Ejemplo: ChatGPT.

La IA es el cerebro que puede hacer inteligentes tanto a la automatizacion como a la robotica.

## Slide 4 — IA que ya usas sin darte cuenta en Ecuador
- Waze y Google Maps sugiriendote rutas en Quito evitando trafico
- Netflix recomendandote series basandose en lo que viste
- Banco Pichincha detectando fraudes en tu tarjeta en tiempo real
- Autocorrector de WhatsApp aprendiendo tus palabras
- Spotify creando tu playlist Descubrimiento Semanal

La IA no es del futuro. Ya esta aqui.

## Slide 5 — Los inviernos de la IA
- 1956: Conferencia de Dartmouth, nace la IA
- 1966 a 1973: Primer invierno, las maquinas no podian traducir bien
- 1980s: Sistemas expertos, nuevo auge
- 1987 a 1993: Segundo invierno, demasiado caros y poco flexibles
- 2012: Deep Learning revoluciona todo (ImageNet)
- 2022 a 2026: Era de la IA generativa, ChatGPT, Claude, Gemini

Cada invierno termino porque alguien siguio investigando.

## Slide 6 — La IA en Ecuador y LATAM
- SENESCYT incorpora analitica de datos para becas
- Bancos ecuatorianos implementan chatbots con IA
- Startups LATAM: NotCo (Chile), Rappi (Colombia), Betterfly (Chile)
- ITSEIA funda la primera academia de IA del Ecuador (2025)
- Ecuador adopta Estrategia Nacional de IA (MINTEL)

Ecuador ocupa el puesto 82 en el Global AI Index. Enorme oportunidad de crecimiento.

## Slide 7 — 5 errores comunes sobre la IA
- "La IA piensa como un humano" — No, procesa patrones estadisticos
- "La IA va a reemplazar todos los trabajos" — Transforma roles, no los elimina
- "La IA es infalible" — Comete errores, alucina datos y tiene sesgos
- "Solo los programadores pueden usar IA" — Cualquier profesional puede
- "La IA es algo nuevo" — Tiene mas de 70 anos de historia

## Slide 8 — Resumen del Tema 1
1. La IA es la capacidad de las maquinas de aprender, razonar y tomar decisiones
2. No es lo mismo que automatizacion ni robotica
3. Tiene mas de 70 anos de evolucion, con inviernos y revoluciones
4. Ya esta presente en nuestra vida diaria en Ecuador
5. Estamos en la era dorada de la IA generativa

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 2 — Tipos de IA: estrecha, general y superinteligente.
Descubriras por que la IA que usas hoy es solo la punta del iceberg.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 2,
    title: 'C1 Tema 2 — Tipos de IA Estrecha General Superinteligente',
    inputText: `# Tipos de IA: Estrecha, General y Superinteligente
## C1. Introduccion a IA Aplicada — Tema 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Clasificar los tres niveles de Inteligencia Artificial segun su capacidad
- Identificar ejemplos reales de IA estrecha que usas a diario
- Comprender por que la IA general (AGI) aun no existe
- Evaluar criticamente las predicciones sobre superinteligencia

## Slide 2 — Los tres niveles de Inteligencia Artificial
- ANI (IA Estrecha): Disenada para UNA tarea especifica. Es toda la IA que existe hoy. Ejemplos: Siri, GPT, AlphaGo, detectores de fraude.
- AGI (IA General): Capacidad cognitiva equivalente a un humano en CUALQUIER tarea. No existe aun. Objetivo de OpenAI, DeepMind, Anthropic.
- ASI (Superinteligencia): Supera la capacidad humana en todos los dominios. Es teorica. Referencia: Nick Bostrom.

## Slide 3 — IA Estrecha, lo que realmente tenemos hoy
- IA Reactiva: Responde sin memoria. Ejemplo: Deep Blue (ajedrez)
- IA con Memoria Limitada: Aprende de datos recientes. Ejemplo: Tesla Autopilot, ChatGPT
- Sistemas de recomendacion: Netflix, Spotify, TikTok
- Procesamiento de lenguaje: Traductores, asistentes de voz
- Vision por computadora: Reconocimiento facial

Dato: El 100 por ciento de la IA comercial en 2026 es IA estrecha.

## Slide 4 — IA Estrecha que ya funciona en Ecuador
- Chatbots bancarios: Banco Pichincha y Produbanco con atencion 24/7
- Deteccion de fraude: Todas las tarjetas de credito en Ecuador
- Agricultura: Drones con vision artificial en la Sierra ecuatoriana
- Diagnostico medico: Hospitales usando IA para radiografias (ImagemIA)
- Logistica: Rappi Ecuador y Uber optimizan rutas en Quito y Guayaquil

## Slide 5 — Cuan cerca estamos de la AGI
Posturas de expertos:
- Sam Altman (OpenAI): "Podriamos tener AGI en esta decada"
- Dario Amodei (Anthropic): "Necesitamos avances fundamentales en razonamiento"
- Yann LeCun (Meta): "Estamos lejos, los LLMs no entienden el mundo"
- Geoffrey Hinton: "El peligro es real y debemos prepararnos"

Brechas: Razonamiento causal, aprendizaje continuo, sentido comun, conciencia situacional.

## Slide 6 — Ejercicio Clasificando IA
Lee cada ejemplo y clasificalo como ANI, AGI o ASI:
- a) Un chatbot que reserva citas medicas
- b) Un sistema que escribe codigo, diagnostica enfermedades Y compone musica igual que un humano
- c) Una IA que descubre la cura del cancer y resuelve el cambio climatico
- d) ChatGPT respondiendo preguntas
- e) Alexa encendiendo las luces

Respuestas: a=ANI, b=AGI, c=ASI, d=ANI, e=ANI

## Slide 7 — 5 errores comunes sobre tipos de IA
- "ChatGPT es IA General" — No, es IA estrecha muy avanzada
- "La Superinteligencia llegara manana" — No hay consenso cientifico
- "Toda IA aprende sola" — La mayoria necesita datos curados por humanos
- "Si es estrecha, no es peligrosa" — IA estrecha mal disenada causa sesgos
- "La IA General sera como un humano" — Seria radicalmente diferente

## Slide 8 — Resumen del Tema 2
1. Existen 3 niveles: ANI (estrecha), AGI (general) y ASI (superinteligente)
2. Toda la IA que usamos hoy es estrecha
3. La AGI no existe aun, es el objetivo de los grandes laboratorios
4. La superinteligencia es teorica y genera debates eticos profundos
5. Ecuador ya aprovecha la IA estrecha en banca, salud y agricultura

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 3 — Machine Learning, Deep Learning e IA Simbolica.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 3,
    title: 'C1 Tema 3 — Machine Learning Deep Learning e IA Simbolica',
    inputText: `# Machine Learning, Deep Learning e IA Simbolica
## C1. Introduccion a IA Aplicada — Tema 3
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Explicar la diferencia entre ML, DL e IA simbolica
- Identificar los tres tipos de aprendizaje automatico
- Reconocer cuando usar cada enfoque en problemas reales
- Evaluar las ventajas y limitaciones de cada paradigma

## Slide 2 — Machine Learning: Aprender de datos
- Programacion tradicional: Datos + Reglas → Resultado
- Machine Learning: Datos + Resultados → Reglas

El ML descubre patrones que los humanos no pueden programar manualmente.

80 por ciento de las aplicaciones comerciales de ML son supervisadas.

## Slide 3 — Tres tipos de Machine Learning
- Supervisado: Datos etiquetados → predice nuevos datos. Ejemplo: spam o no spam
- No Supervisado: Sin etiquetas → descubre patrones ocultos. Ejemplo: segmentacion de clientes
- Por Refuerzo: Prueba y error con recompensas. Ejemplo: AlphaGo, robotica

El supervisado domina la industria. El no supervisado descubre lo inesperado. El refuerzo optimiza decisiones secuenciales.

## Slide 4 — Deep Learning: Redes neuronales profundas
Multiples capas que extraen caracteristicas cada vez mas abstractas:
- Capa 1: Bordes
- Capa 2: Formas
- Capa 3: Objetos
- Capa 4: Escenas

Requiere: Datos masivos, GPUs potentes, tiempo de entrenamiento.

Es la tecnologia detras de: GPT-4, Claude, DALL-E, Face ID, Tesla Autopilot, DeepL.

## Slide 5 — IA Simbolica: Reglas logicas humanas
SI fiebre Y tos Y dificultad respiratoria → posible neumonia

No aprende de datos. Sigue reglas de expertos humanos.

Ventajas: Explicable, auditable, predecible.
Limitaciones: No se adapta, no escala, requiere experto humano.

Uso actual: Sistemas legales, protocolos clinicos, reglas bancarias.

## Slide 6 — Sistemas neuro-simbolicos (el futuro)
La tendencia combina ambos enfoques:
- Deep Learning para percepcion (ver, escuchar, leer)
- Reglas simbolicas para razonamiento (decidir, verificar, explicar)

Lo mejor de ambos mundos: flexibilidad del aprendizaje + precision de las reglas.

Crucial en banca, salud y legalidad. Sectores clave en Ecuador.

## Slide 7 — Ejemplos de aplicaciones reales en Ecuador
- Banco Pichincha: ML supervisado para deteccion de fraude
- Hospitales: Deep Learning para analisis de radiografias
- IESS: IA simbolica con reglas para triaje de emergencias
- Agricultura: ML no supervisado para detectar patrones en cultivos

## Slide 8 — Resumen del Tema 3
1. ML: las maquinas aprenden patrones de datos
2. DL: redes neuronales profundas que extraen caracteristicas abstractas
3. IA Simbolica: reglas logicas explicitas, explicables y auditables
4. El futuro combina ambos: sistemas neuro-simbolicos
5. En tu carrera: ML supervisado y DL son los mas demandados

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 4 — Aplicaciones reales de IA en Ecuador y LATAM.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 4,
    title: 'C1 Tema 4 — Aplicaciones reales de IA en Ecuador y LATAM',
    inputText: `# Aplicaciones reales de IA en Ecuador y LATAM
## C1. Introduccion a IA Aplicada — Tema 4
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Identificar sectores ecuatorianos que ya usan IA
- Describir casos reales de implementacion en banca, salud y agricultura
- Mapear oportunidades profesionales en IA en tu region
- Evaluar el estado de Ecuador en el indice global de IA

## Slide 2 — Sector financiero: el mas avanzado en Ecuador
- Banco Pichincha y Pacifico: Deteccion de fraude con ML en tiempo real
- Produbanco: Chatbots con NLP para atencion 24/7
- Scoring crediticio alternativo: ML evalua capacidad de pago sin historial bancario

Resultados: 40 por ciento menos fraudes, 60 por ciento mas satisfaccion del cliente.

Oportunidad: Ecuador necesita especialistas en ML para fintech.

## Slide 3 — Sector salud: Diagnostico y prediccion
- Imagenologia medica: DL analiza rayos X y tomografias en segundos
- ImagemIA (empresa ecuatoriana): IA predictiva que reduce inasistencias 30 por ciento
- IESS: Explora triaje automatizado con IA en emergencias

La IA no reemplaza al medico. Le da superpoderes de velocidad y precision.

## Slide 4 — Sector agricola: Pilar de la economia
Ecuador es el mayor exportador mundial de banano.
- Drones con vision artificial detectan enfermedades semanas antes
- Sensores IoT con ML optimizan riego: 30 por ciento menos agua, 25 por ciento mas rendimiento
- Floricultura: IA predice demanda de San Valentin con meses de anticipacion

8 por ciento del PIB, 25 por ciento del empleo. Impacto masivo de la IA aqui.

## Slide 5 — Sector logistica y comercio
- Mercado Libre: IA para logistica predictiva en LATAM
- Rappi: Optimizacion de rutas con algoritmos
- LATAM Airlines: Pricing dinamico con ML
- Supermaxi y otros retailers: Gestion de inventario predictivo

## Slide 6 — Ecuador en el mapa global de IA
Puesto 82 en el Global AI Index. Enorme oportunidad de crecimiento.

- Estrategia Nacional de IA (MINTEL) en desarrollo
- LOPDP vigente desde 2023 (marco legal para IA)
- SENESCYT usa analitica de datos para becas

LATAM: Brasil lidera, Chile y Colombia crecen rapido.

Empleabilidad IA en Ecuador: 85 a 92 por ciento.

## Slide 7 — Ejercicio: Mapea 5 empresas ecuatorianas con IA
Investiga 5 empresas de diferentes sectores:
- Banca y fintech
- Salud y farmaceutica
- Agricultura y exportacion
- Retail y e-commerce
- Gobierno y servicios publicos

Para cada empresa documenta: nombre, sector, tipo de IA, problema que resuelve, resultado.

## Slide 8 — Resumen del Tema 4
1. Banca ecuatoriana lidera en adopcion de IA
2. Salud avanza con imagenologia y prediccion
3. Agricultura se beneficia de drones y sensores inteligentes
4. Ecuador puesto 82 en Global AI Index. Mucho espacio para crecer
5. Empleabilidad 85 a 92 por ciento para especialistas en IA

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 5 — Etica, privacidad, sesgos y marco regulatorio.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 5,
    title: 'C1 Tema 5 — Etica Privacidad Sesgos y Marco Regulatorio',
    inputText: `# Etica, Privacidad, Sesgos y Marco Regulatorio
## C1. Introduccion a IA Aplicada — Tema 5
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Identificar casos reales de sesgo algoritmico y sus consecuencias
- Conocer tus derechos bajo la LOPDP de Ecuador
- Evaluar el nivel de riesgo de un sistema de IA segun el AI Act europeo
- Aplicar principios eticos en tu trabajo como profesional de IA

## Slide 2 — Sesgos algoritmicos: La IA hereda nuestros prejuicios
- Caso Amazon: Sistema de reclutamiento penalizaba mujeres (datos historicos sesgados)
- Caso COMPAS: Predecia mayor reincidencia para afroamericanos
- Caso reconocimiento facial: 34.7 por ciento error en mujeres de piel oscura, menos de 1 por ciento en hombres blancos

La IA no inventa discriminacion. La amplifica y automatiza.

## Slide 3 — LOPDP: Tus derechos en Ecuador
Ley Organica de Proteccion de Datos Personales (vigente 2023):
- Acceso: Saber que datos tuyos se procesan
- Rectificacion: Corregir datos incorrectos
- Eliminacion: Solicitar que borren tus datos
- Oposicion: Oponerte a decisiones automatizadas
- Portabilidad: Llevarte tus datos a otra empresa

Multas: Hasta 1 por ciento de facturacion anual.

## Slide 4 — AI Act: Regulacion europea como referencia
Clasificacion por nivel de riesgo:
- Prohibido: Scoring social, reconocimiento facial masivo
- Alto riesgo: IA en salud, educacion, empleo, credito, justicia
- Riesgo limitado: Chatbots (deben identificarse como IA)
- Riesgo minimo: Filtros de spam, recomendaciones

Ecuador aun no tiene regulacion especifica para IA. La LOPDP cubre muchos aspectos.

## Slide 5 — Deepfakes y desinformacion
La IA genera videos, audio e imagenes falsos extremadamente realistas.
- Politica: Deepfakes de candidatos diciendo cosas falsas
- Fraude: Voces clonadas para estafas telefonicas
- Extorsion: Imagenes manipuladas para chantaje

Casos documentados en Brasil, Argentina y Mexico. Ecuador no es inmune.

## Slide 6 — Tu responsabilidad como profesional de IA
1. Auditar datos: Verificar sesgos antes de entrenar modelos
2. Cumplir LOPDP: Consentimiento, minimizacion, seguridad
3. Disenar para transparencia: Sistemas que expliquen sus decisiones

La etica no frena la innovacion. La hace sostenible.

## Slide 7 — Ejercicio: Analisis de caso real
Casos sugeridos:
- Amazon Recruiting (sesgo de genero)
- COMPAS (sesgo racial)
- Reconocimiento facial MIT Media Lab
- Apple Card (sesgo de genero en limites de credito)

Aplica el marco LOPDP y propon medidas de mitigacion.

## Slide 8 — Resumen del Tema 5
1. Los sesgos algoritmicos amplifican discriminacion historica
2. La LOPDP protege tus datos personales en Ecuador
3. El AI Act europeo clasifica IA por nivel de riesgo
4. Los deepfakes son una amenaza creciente en LATAM
5. Tu responsabilidad: auditar, cumplir ley, disenar con transparencia

## Slide 9 — Cierre del Modulo 1
Con esto completamos el Modulo 1: Fundamentos de IA.

Proximo Modulo: IA Generativa y Prompt Engineering.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function createGeneration(title, inputText) {
  const res = await fetch(`${GAMMA_BASE}/generations`, {
    method: 'POST',
    headers: GAMMA_HEADERS,
    body: JSON.stringify({
      inputText,
      textMode: 'preserve',
      format: 'presentation',
      numCards: 9,
      additionalInstructions: 'Use ITSEIA brand: Navy #1F2F58 as primary, Yellow #FBBC0C for accents, Sky #73B8E7 for tech elements. Modern professional educational style. Spanish language.',
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

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Generando 5 presentaciones Gamma para C1 Mes 1 ===');
  console.log(`Inicio: ${new Date().toISOString()}\n`);

  const results = [];
  const outputPath = path.join(__dirname, 'c1_gamma_urls.json');

  // Cargar progreso previo si existe (para reanudar sin re-pagar generaciones)
  let prevResults = [];
  if (fs.existsSync(outputPath)) {
    try {
      prevResults = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      console.log(`Cargados ${prevResults.length} resultados previos.\n`);
    } catch (_) { /* ignore */ }
  }

  for (let i = 0; i < PRESENTATIONS.length; i++) {
    const pres = PRESENTATIONS[i];
    console.log(`[${i + 1}/${PRESENTATIONS.length}] Tema ${pres.temaId}: ${pres.title}`);

    // Skip if already generated (idempotente)
    const prev = prevResults.find(r => r.temaId === pres.temaId && r.gammaUrl);
    if (prev) {
      console.log(`    YA GENERADO. Skip. URL: ${prev.gammaUrl}\n`);
      results.push(prev);
      continue;
    }

    try {
      console.log('    POST /generations...');
      const generationId = await createGeneration(pres.title, pres.inputText);
      console.log(`    generationId: ${generationId}`);

      console.log('    Esperando completacion (max 5 min)...');
      const { gammaUrl, exportUrl } = await pollGeneration(generationId);

      console.log(`    gammaUrl:  ${gammaUrl}`);
      console.log(`    exportUrl: ${exportUrl || '(no PDF)'}\n`);

      const result = {
        temaId: pres.temaId,
        title: pres.title,
        gammaUrl,
        exportUrl: exportUrl || null,
        generationId,
        generatedAt: new Date().toISOString(),
      };

      results.push(result);

      // Guardar resultado parcial (evita re-generar si algo falla despues)
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

      // Pausa de 3s entre llamadas para respetar rate limit
      if (i < PRESENTATIONS.length - 1) {
        console.log('    (Pausa 3s...)\n');
        await sleep(3000);
      }
    } catch (err) {
      console.error(`    ERROR: ${err.message}\n`);
      results.push({
        temaId: pres.temaId,
        title: pres.title,
        error: err.message,
      });
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    }
  }

  // ── Reporte final ────────────────────────────────────────────────────
  console.log('\n=== REPORTE FINAL ===');
  console.log(`Fin: ${new Date().toISOString()}\n`);

  let ok = 0, errors = 0;
  for (const r of results) {
    const mark = r.gammaUrl ? 'OK   ' : 'ERROR';
    console.log(`[${mark}] Tema ${r.temaId}: ${r.title}`);
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

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
