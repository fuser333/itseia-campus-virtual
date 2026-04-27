#!/usr/bin/env node
/**
 * generate_gamma_c1_m2.js
 *
 * Genera las 6 presentaciones de Gamma para el Modulo 2 de C1 (Cursos MDT).
 * Modulo 2: IA Generativa y Prompt Engineering (temas 6 a 11).
 * Endpoint: POST /generations -> poll GET /generations/{id} hasta completed.
 * Guarda resultados en content/c1_m2_gamma_urls.json
 *
 * Run: node content/generate_gamma_c1_m2.js
 */

const fs = require('fs');
const path = require('path');

const GAMMA_KEY  = 'sk-gamma-i1QpwB075C7XJzrB37YkUOCybMnM6FswKcmxbpH8g';
const GAMMA_BASE = 'https://public-api.gamma.app/v1.0';

const GAMMA_HEADERS = {
  'X-API-KEY':    GAMMA_KEY,
  'Content-Type': 'application/json',
};

// -- Las 6 presentaciones del Modulo 2 de C1 --------------------------------

const PRESENTATIONS = [
  {
    temaId: 6,
    title: 'C1 Tema 6 — Que es la IA Generativa de GANs a GPT',
    inputText: `# Que es la IA Generativa: De GANs a GPT
## C1. Introduccion a IA Aplicada — Tema 6
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Definir que es la IA Generativa y diferenciarla de la IA tradicional
- Identificar las arquitecturas clave: VAE, GAN, Diffusion y Transformers
- Comprender como predice texto un modelo tipo GPT
- Aplicar la IA generativa a casos reales en Ecuador

## Slide 2 — IA Generativa vs IA Tradicional
IA Tradicional: Clasifica o predice. Es spam? Que nota sacara este alumno?
IA Generativa: Crea contenido nuevo. Texto, imagenes, audio, video, codigo.

De ambas necesitas. Pero la GENERATIVA es lo que esta cambiando el mercado laboral en 2026.

## Slide 3 — Las 4 arquitecturas clave
- VAE (2013): comprime y reconstruye datos en un espacio latente
- GAN (Goodfellow, 2014): generador vs discriminador compitiendo
- Diffusion (2020-2022): aprende a quitar ruido paso a paso
- Transformers (Google, 2017): mecanismo de atencion — base de GPT, Claude, Gemini

"Attention is All You Need" — el paper que lo cambio todo.

## Slide 4 — GAN vs Diffusion en imagenes
- GANs: thispersondoesnotexist.com — rostros 100 por ciento sinteticos
- Diffusion: DALL-E, Midjourney, Stable Diffusion

GAN: rapido pero menos controlable.
Diffusion: mas nitido, controlado por texto, mejor diversidad.

La industria migro a Diffusion entre 2022 y 2024.

## Slide 5 — Como predice texto GPT
1. Recibe tu prompt y lo convierte en tokens (media palabra cada uno)
2. Predice probabilidades del SIGUIENTE token
3. Elige uno (temperatura controla aleatoriedad)
4. Repite hasta terminar

No consulta una base de datos. PREDICE patrones aprendidos en miles de millones de textos.
Por eso a veces "alucina" — inventa con seguridad.

## Slide 6 — Casos de uso en Ecuador
- Marketing: anuncios y posts 10x mas rapido
- Legal: resumen de contratos y leyes
- Educacion: tutorias personalizadas 24/7
- Salud: ImagemIA usa generativa para reportes medicos
- Atencion al cliente: chatbots para Banco Pichincha, Produbanco
- Diseno: ilustraciones sin contratar disenador
- Desarrollo: prototipos en horas, no semanas

## Slide 7 — Limitaciones que debes conocer
1. Alucina: inventa datos con seguridad
2. Sesgos: hereda prejuicios de los datos de entrenamiento
3. Sin memoria persistente entre sesiones
4. No entiende causalidad — solo patrones
5. Puede infringir derechos de autor si no verificas

Tu valor profesional: usar IA con criterio, no a ciegas.

## Slide 8 — Resumen del Tema 6
1. La IA Generativa crea contenido — texto, imagen, audio, video, codigo
2. Pasamos de VAE a GAN a Diffusion a Transformers en 10 anos
3. GPT predice token a token con probabilidades aprendidas
4. Los modelos modernos son multimodales (GPT-4o, Claude 3.5)
5. En Ecuador ya se usa en banca, salud, marketing y educacion

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 7 — Prompt Engineering: principios y tecnicas.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 7,
    title: 'C1 Tema 7 — Prompt Engineering principios y tecnicas',
    inputText: `# Prompt Engineering: Principios y Tecnicas
## C1. Introduccion a IA Aplicada — Tema 7
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Aplicar los 6 principios del prompt efectivo
- Usar las formulas RTF y CRISPE en tareas reales
- Evitar los 6 errores tipicos de principiantes
- Iterar prompts hasta lograr el resultado deseado

## Slide 2 — Por que importa el prompting
Mismo modelo, prompts distintos = resultados radicalmente distintos.

MAL: "Escribe sobre marketing"
BIEN: "Eres especialista en marketing digital LATAM con 10 anos de experiencia. Escribe un plan de contenido de 30 dias para panaderia sin gluten en Quito, mujeres 25-45."

Diferencia: 30 minutos de re-trabajo vs entregable usable.

## Slide 3 — Los 6 principios del prompt efectivo
1. Claridad — Se especifico, no vago
2. Contexto — Da la informacion que necesitaria un humano
3. Rol — "Actua como abogado laboral ecuatoriano..."
4. Formato — Tabla, lista, JSON, parrafos
5. Restricciones — Maximo X palabras, sin emojis
6. Iteracion — Refina hasta perfeccion

## Slide 4 — Formula RTF — Rol + Tarea + Formato
- ROL: "Eres consultor de ventas B2B en Ecuador."
- TAREA: "Redacta email frio para CEO de logistica."
- FORMATO: "Asunto (60 chars), saludo, 3 parrafos, CTA, firma. Maximo 180 palabras."

Resultado: email listo para enviar al primer intento.
Formula simple, rapida, efectiva.

## Slide 5 — Formula CRISPE — Profesional
- C — Capacity and Role: Quien eres
- R — Insight: contexto de fondo
- I — Insight (continuacion)
- S — Statement: tarea exacta
- P — Personality: tono y estilo
- E — Experiment: variantes posibles

Ideal para tareas complejas que requieren maxima calidad.
Usa CRISPE en propuestas, contratos, contenido estrategico.

## Slide 6 — 6 errores tipicos de principiantes
1. Prompts demasiado cortos
2. Pedir todo a la vez
3. No dar ejemplos del estilo deseado
4. No iterar — aceptar primera respuesta
5. No verificar datos (alucinaciones)
6. No especificar formato

"El prompt es como instrucciones a un becario brillante: cuanto mas claro, mejor el resultado."

## Slide 7 — Casos de uso profesional en Ecuador
- Abogados: contratos personalizados en minutos
- Marketing: 30 publicaciones de redes sociales en una sesion
- Educadores: cuestionarios y planes de clase
- Medicos: resumenes de historias clinicas
- Empresarios: propuestas comerciales
- Periodistas: investigacion y estructura de articulos

Productividad: 3 a 5x quien NO domina prompts.

## Slide 8 — Resumen del Tema 7
1. El prompting es habilidad profesional clave en 2026
2. 6 principios: claridad, contexto, rol, formato, restricciones, iteracion
3. Formula RTF para empezar; CRISPE para tareas complejas
4. Prompts positivos mejor que negativos
5. Iterar siempre — el primer prompt rara vez es el mejor

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 8 — Prompts avanzados: cadena de pensamiento y few-shot.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 8,
    title: 'C1 Tema 8 — Prompts avanzados Chain of Thought y Few-Shot',
    inputText: `# Prompts Avanzados: Chain-of-Thought y Few-Shot
## C1. Introduccion a IA Aplicada — Tema 8
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Distinguir Zero-shot, One-shot y Few-shot prompting
- Aplicar Chain-of-Thought (CoT) en problemas de razonamiento
- Usar Self-Consistency, Tree of Thoughts y ReAct
- Encadenar prompts para tareas complejas

## Slide 2 — Zero/One/Few-Shot — La gradacion
- Zero-shot: Sin ejemplos. "Clasifica: 'El servicio fue lento.'"
- One-shot: Un ejemplo + tarea
- Few-shot: 3-10 ejemplos + tarea (mas poderoso)

Cuando Few-shot?
- Formato consistente (JSON)
- Estilo de marca
- Categorias custom
- Razonamiento especializado

## Slide 3 — Few-Shot en accion: extraccion de datos
Ejemplo 1: "Juan tiene 30 anos y vive en Quito." -> {"nombre":"Juan","edad":30,"ciudad":"Quito"}
Ejemplo 2: "Maria, de Guayaquil, cumple 25." -> {"nombre":"Maria","edad":25,"ciudad":"Guayaquil"}
Ejemplo 3: "Soy Pedro, 42, Cuenca." -> {"nombre":"Pedro","edad":42,"ciudad":"Cuenca"}

Ahora: "La doctora Ana Lopez, 38, atiende en Ambato." -> ?

El modelo aprende el patron y lo aplica con precision casi perfecta.

## Slide 4 — Chain-of-Thought (CoT) — La revolucion
Google 2022: pedir al modelo "pensar paso a paso" sube precision del 18 al 57 por ciento en matematicas.

2 formas:
- CoT explicito: ejemplos con razonamiento detallado
- Zero-shot CoT: solo anade "Pensemos paso a paso"

Funciona porque genera tokens intermedios que dan al modelo mas "espacio de computo" para razonar.

## Slide 5 — Cuando usar cada tecnica
- Resumir, traducir, extraer simples -> Zero-shot
- Formato especifico o estilo de marca -> Few-shot
- Matematicas, logica, razonamiento -> CoT
- Analisis legal, medico, financiero -> Few-shot CoT
- Creatividad -> Zero-shot con buena descripcion

Dominar estas tecnicas es la diferencia entre $800 y $3,000/mes en LATAM.

## Slide 6 — Tecnicas de nivel experto
- Self-Consistency: pides la misma respuesta varias veces y eliges la moda
- Tree of Thoughts (ToT): explora multiples ramas de razonamiento
- ReAct: razonamiento + acciones (busquedas, calculos) — base de los "agents"
- Role-Prompting Avanzado: "abogado laboral ecuatoriano, 15 anos, conoce Codigo de Trabajo y fallos recientes"

## Slide 7 — Prompt Chaining: encadenar tareas
Tarea grande -> divide en pasos. Cada salida alimenta el siguiente prompt.

Ejemplo:
1. Genera 10 ideas de productos digitales
2. Selecciona las 3 mas viables, justifica
3. Plan de negocio para la mejor (1 pagina)
4. Convierte en propuesta visual para inversionistas

Reduce errores. Permite revisar entre pasos.

## Slide 8 — Resumen del Tema 8
1. Few-shot transmite formato y estilo con ejemplos
2. CoT obliga al modelo a razonar paso a paso
3. Zero-shot CoT: la frase magica "Pensemos paso a paso"
4. Self-Consistency, ToT y ReAct para problemas duros
5. Prompt Chaining: divide tareas grandes en pasos pequenos

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 9 — ChatGPT y Claude: comparativa practica.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 9,
    title: 'C1 Tema 9 — ChatGPT y Claude comparativa practica',
    inputText: `# ChatGPT y Claude: Comparativa Practica
## C1. Introduccion a IA Aplicada — Tema 9
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Comparar arquitecturas, filosofias y modelos de OpenAI y Anthropic
- Identificar cuando usar ChatGPT vs Claude
- Interpretar benchmarks 2026 (SWE-bench, MMLU, HumanEval)
- Disenar tu propio stack de IA para trabajo profesional

## Slide 2 — Las 2 empresas detras
OpenAI (ChatGPT) — fundada 2015 por Altman, Musk, Sutskever
- Inversor principal: Microsoft (mas de 13 mil millones)
- Filosofia: AGI segura para toda la humanidad

Anthropic (Claude) — fundada 2021 por hermanos Amodei (ex-OpenAI)
- Inversores: Amazon (mas de 4 mil millones), Google (2 mil millones)
- Filosofia: Constitutional AI (principios eticos explicitos)

## Slide 3 — Modelos en 2026
OpenAI:
- GPT-5 — multimodal nativo (texto, imagen, audio, video)
- GPT-5.4 — mejor razonamiento
- GPT-4o mini — gratuito

Anthropic:
- Claude Opus 4.6 — el mas potente (80.8 por ciento SWE-bench)
- Claude Sonnet 4.5 — balance velocidad y calidad
- Claude Haiku 4.5 — rapido y barato

Ambos: contexto de hasta 1 millon de tokens.

## Slide 4 — Fortalezas de ChatGPT
1. Generacion de imagenes integrada (DALL-E 4)
2. Voice Mode — conversacion natural
3. Custom GPTs — versiones especializadas
4. Busqueda web en tiempo real
5. Computer Use — controla tu pantalla
6. Comunidad gigante de prompts
7. Tono "viral" (redes sociales, memes)

## Slide 5 — Fortalezas de Claude
1. Razonamiento profundo (supera a GPT-5 en logica)
2. Escritura larga y matizada
3. Mas honesto — alucina menos
4. Analisis de documentos largos (1 millon de tokens)
5. Programacion: 80.8 por ciento SWE-bench (lider en 2026)
6. Artifacts — ventana interactiva paralela
7. Tono respetuoso para temas delicados

## Slide 6 — Cuando usar cada uno
ChatGPT para:
- Imagenes en chat
- Voz e idiomas
- Busqueda web
- Creatividad viral
- Custom GPTs
- Computer Use

Claude para:
- Programacion seria
- Analisis de docs largos
- Escritura profesional
- Razonamiento matematico/logico
- Tareas con minima alucinacion
- Artifacts

## Slide 7 — Precios y benchmarks 2026
Precios:
- ChatGPT Plus / Claude Pro: 20 dolares/mes cada uno
- Pro/Max: 100 a 200 dolares/mes

Benchmarks clave:
- SWE-bench (codigo): Claude (80.8%) > GPT (70%)
- HumanEval: Claude (94%) > GPT (88%)
- MMLU (general): GPT igual a Claude
- GSM8K (matematicas): GPT (96%) igual a Claude (95%)
- Hallucinations: Claude menos que GPT

## Slide 8 — Resumen del Tema 9
1. ChatGPT (OpenAI) y Claude (Anthropic) son los lideres 2026
2. ChatGPT brilla en multimodal, voz, imagenes, comunidad
3. Claude lidera en codigo, razonamiento, escritura larga, honestidad
4. La estrategia inteligente: usar ambos (40 dolares/mes)
5. El profesional que NO los usa en 2026 esta en desventaja

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 10 — Generacion de imagenes con DALL-E, Midjourney y Stable Diffusion.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 10,
    title: 'C1 Tema 10 — Generacion de imagenes DALL-E Midjourney Stable Diffusion',
    inputText: `# Generacion de Imagenes con IA: DALL-E, Midjourney, Stable Diffusion
## C1. Introduccion a IA Aplicada — Tema 10
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Explicar como funcionan los modelos de difusion
- Comparar DALL-E 3, Midjourney y Stable Diffusion
- Escribir prompts visuales efectivos con la formula SECCD
- Aplicar IA visual a casos profesionales en Ecuador

## Slide 2 — Como funciona la generacion con IA
Modelos de difusion:
1. Aprende viendo miles de millones de imagenes con descripciones
2. Parte de ruido visual puro
3. Paso a paso, va "des-ruidizando" guiado por tu prompt
4. Cada paso reduce ruido y aumenta detalle

Resultado: imagen original que coincide con tu descripcion en segundos.

## Slide 3 — Las 3 herramientas principales
DALL-E 3 (OpenAI)
- En ChatGPT Plus, 20 dolares/mes
- Realista, facil de usar

Midjourney (V7)
- 10 a 60 dolares/mes via Discord o web
- Calidad estetica lider

Stable Diffusion (Stability AI)
- Gratis, open source
- Control total
- Curva tecnica

## Slide 4 — Otras herramientas notables 2026
- Imagen 3 (Google) — excelente con texto en imagenes
- FLUX (Black Forest Labs) — competidor superior en SD
- Adobe Firefly — mas seguro legalmente (datos licenciados)
- Leonardo AI — SD con interfaz amigable
- Krea AI — generacion en tiempo real

Elige segun presupuesto, control deseado y caso de uso.

## Slide 5 — Formula SECCD para prompts visuales
- S — SUJETO: "taza de cafe latte humeante"
- E — ESTILO: "fotografia profesional, editorial Bon Appetit"
- C — CONTEXTO: "mesa rustica, cafeteria en Quito"
- C — COMPOSICION: "luz natural calida, regla de tercios"
- D — DETALLES: "8k, hyperrealistic, --ar 16:9"

Ejemplo: del MAL "un cafe" al BIEN un editorial profesional.

## Slide 6 — Terminos magicos para mejorar calidad
- cinematic lighting
- 8k / hyperrealistic
- shallow depth of field
- golden hour / blue hour
- studio photography
- bokeh
- art deco / minimalist
- photorealistic

Prompts negativos: --no text (Midjourney), "negative prompt" en SD para evitar manos deformes, texto distorsionado.

## Slide 7 — Derechos de autor — atencion
- DALL-E 3: tuyas con uso comercial libre
- Midjourney: comercial solo con plan pago
- Stable Diffusion: depende del modelo base
- Adobe Firefly: la opcion mas segura legalmente

Ecuador: revisa LOPI. Generar "al estilo de" un artista vivo puede tener implicaciones legales. Documenta en contratos con clientes que herramienta usaste.

## Slide 8 — Resumen del Tema 10
1. Modelos de difusion generan imagenes desde ruido guiados por prompt
2. DALL-E 3 rapido y comercial; Midjourney calidad estetica; SD control total
3. Formula SECCD: Sujeto + Estilo + Contexto + Composicion + Detalles
4. Limitaciones: manos, texto, coherencia, sesgos
5. Reduce costos 80 por ciento y multiplica creatividad

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 11 — Generacion de codigo con IA: Copilot y Cursor.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 11,
    title: 'C1 Tema 11 — Generacion de codigo con IA Copilot y Cursor',
    inputText: `# Generacion de Codigo con IA: Copilot y Cursor
## C1. Introduccion a IA Aplicada — Tema 11
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Comparar GitHub Copilot vs Cursor en flujos profesionales
- Identificar 10 tareas que se aceleran con IA + codigo
- Aplicar mejores practicas de prompting tecnico
- Estimar oportunidades laborales en Ecuador con esta habilidad

## Slide 2 — Las 2 herramientas dominantes
GitHub Copilot (Microsoft + OpenAI/Anthropic)
- Extension en VS Code, JetBrains, etc.
- 10 a 19 dolares/mes individual
- 1.5 millones de suscriptores en 2026

Cursor (Anysphere)
- Editor completo, fork de VS Code
- Composer (genera multi-archivo)
- Gratis con limites; Pro 20 dolares/mes
- Valuacion 9.5 mil millones en 2025

## Slide 3 — Diferencias clave
Copilot:
- Vive DENTRO de tu editor existente
- Excelente autocompletado en linea
- Menos potente para tareas complejas multi-archivo

Cursor:
- ES tu editor (reemplaza VS Code)
- Composer modifica 8-12 archivos en 1 operacion
- Chat con contexto de TODO tu codigo
- Preferido por developers profesionales en 2026

## Slide 4 — 10 cosas que puedes hacer
1. Autocompletado inteligente
2. Generar codigo desde texto
3. Refactorizacion automatica
4. Deteccion de bugs
5. Tests automaticos (Jest, Pytest)
6. Documentacion (JSDoc, docstrings)
7. Migracion de codigo (clase a hooks)
8. Explicacion en lenguaje no tecnico
9. Code review
10. Pair programming conversacional

## Slide 5 — Mejores practicas
1. Da contexto: usa @archivo.ts en Cursor
2. Se especifico con stack: "React 18, hooks, TypeScript estricto, Tailwind"
3. Pide explicaciones antes de aceptar cambios
4. Verifica TODO — la IA inventa APIs inexistentes
5. Modelo correcto: Claude Opus 4.6 = rey del codigo
6. Itera en pasos pequenos
7. TDD asistido: tests primero, luego implementacion

## Slide 6 — Niveles de involucramiento
- Asistente: IA sugiere, tu revisas cada linea (bajo riesgo, alta calidad)
- Co-piloto: IA escribe bloques, tu validas y conectas (productividad alta — modo profesional 2026)
- Agente: IA ejecuta tareas completas (alto riesgo, supervision obligatoria)

Ejemplo agente: "Resuelve issue #42 del repositorio".

## Slide 7 — Limitaciones y riesgos
1. Alucinaciones: inventa funciones que no existen
2. Codigo inseguro: SQL injection, credenciales hardcoded
3. Dependencia: si no entiendes, no puedes depurar
4. Privacidad: codigo va a servidores externos
5. Licencias: riesgo de copyright (entrenamiento con GPL)

Verifica siempre. Corre tests. Lee lo que aceptas.

## Slide 8 — Oportunidades en Ecuador
- Developer Junior 2026 con IA = productividad de Senior 2022
- Empresas como Kushki, Banco Pichincha, ImagemIA buscan developers que dominen Cursor
- Salarios: junior con IA 1,200 a 2,000/mes; semi-senior 2,500 a 4,500/mes; senior 5,000 a 10,000/mes (remoto LATAM)
- Freelance: 25 a 80 dolares/hora segun nicho
- Habilidad transversal: contadores, marketers tambien se benefician

## Slide 9 — Cierre del Modulo 2 y CTA
Con esto completamos el Modulo 2: IA Generativa y Prompt Engineering.

Proximo Modulo: Herramientas No-Code y Aplicaciones (Make, Zapier, Botpress, Notion AI).

itseia.ai — La primera academia de IA del Ecuador
`,
  },
];

// -- Helpers ----------------------------------------------------------------

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

// -- Main -------------------------------------------------------------------

async function main() {
  console.log('=== Generando 6 presentaciones Gamma para C1 Modulo 2 ===');
  console.log(`Inicio: ${new Date().toISOString()}\n`);

  const results = [];
  const outputPath = path.join(__dirname, 'c1_m2_gamma_urls.json');

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

  // -- Reporte final ---------------------------------------------------
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
