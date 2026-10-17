#!/usr/bin/env node
/**
 * generate_gamma_steveen.js
 *
 * Genera las 5 presentaciones de Gamma para el Modulo 1 del curso
 * IA Aplicada para Ingenieria Industrial (cliente piloto: Steveen Pinchao).
 *
 * Endpoint: POST /generations -> poll GET /generations/{id} hasta completed.
 * Guarda resultados en content/steveen_gamma_urls.json
 *
 * Run: node content/generate_gamma_steveen.js
 */

const fs = require('fs');
const path = require('path');

const GAMMA_KEY  = 'sk-gamma-i1QpwB075C7XJzrB37YkUOCybMnM6FswKcmxbpH8g';
const GAMMA_BASE = 'https://public-api.gamma.app/v1.0';

const GAMMA_HEADERS = {
  'X-API-KEY':    GAMMA_KEY,
  'Content-Type': 'application/json',
};

// -- Las 5 presentaciones del Modulo 1 (Steveen) ----------------------------

const PRESENTATIONS = [
  {
    temaId: 1,
    title: 'Steveen M1 Tema 1 — Que es IA, ML y Deep Learning para ingenieros',
    inputText: `# Que es IA, ML y Deep Learning para ingenieros industriales
## IA Aplicada para Ingenieria Industrial — Modulo 1, Tema 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
Al finalizar esta sesion podras:
- Distinguir IA, Machine Learning y Deep Learning con analogias industriales
- Identificar los tres tipos de Machine Learning
- Reconocer cuando cada enfoque aplica a tu planta
- Diferenciar IA real de promesas exageradas

## Slide 2 — La analogia del inspector de 20 anos
Un inspector con 20 anos en la linea sabe cuando una pieza esta mal solo con verla.

La IA aprende ese conocimiento tacito a partir de miles de ejemplos.

La automatizacion tradicional ejecuta reglas. La IA descubre reglas a partir de datos.

## Slide 3 — Machine Learning: Tres tipos
- Supervisado: aprende de ejemplos etiquetados (bueno/defectuoso). 80 por ciento de la industria.
- No supervisado: descubre patrones ocultos sin etiquetas. Segmenta proveedores y clientes.
- Por refuerzo: aprende por prueba y error con recompensas. Optimiza rutas y parametros.

## Slide 4 — Deep Learning: Cuando usarlo
Redes neuronales con muchas capas para datos complejos:
- Imagenes: detectar defectos en vision por computadora
- Audio: escuchar fallas en maquinas por su sonido
- Texto: analizar reportes tecnicos largos

Requiere mas datos, mas computo y mas costo.

## Slide 5 — La piramide IA, ML, DL
- IA (campo amplio)
- Machine Learning (aprende de datos)
- Deep Learning (redes neuronales profundas)

No son tres tecnologias independientes. Son capas de una misma disciplina.

## Slide 6 — Lo que la IA NO es
- No es robot con consciencia (eso es ciencia ficcion)
- No reemplaza al ingeniero, lo potencia
- No funciona sin datos digitales historicos
- No toma decisiones eticas por si sola

En Ecuador (banca, salud, alimentos): la IA propone, el profesional decide.

## Slide 7 — Ejercicio rapido
Clasifica cada proceso como ML Supervisado, No Supervisado, Deep Learning o No requiere IA:
- a) Predecir ventas del proximo mes con 3 anos de historia
- b) Detectar grietas en soldaduras con camaras
- c) Calcular el costo total de materia prima
- d) Agrupar proveedores por comportamiento

Respuestas: a=ML Supervisado, b=Deep Learning, c=No requiere IA, d=ML No Supervisado

## Slide 8 — Resumen del Tema 1.1
1. IA, ML y DL son capas, no tecnologias independientes
2. ML aprende de datos: supervisado, no supervisado, por refuerzo
3. DL es ML con redes profundas para datos complejos
4. La IA potencia al ingeniero, no lo reemplaza
5. Empleabilidad +85 por ciento para ingenieros industriales con IA en Ecuador

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 1.2 — Tipos de IA y casos de uso en manufactura.
10 casos reales: Siemens, Tesla, BMW, P&G, Amazon.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 2,
    title: 'Steveen M1 Tema 2 — Tipos de IA y casos de uso en manufactura',
    inputText: `# Tipos de IA y casos reales en manufactura
## IA Aplicada para Ingenieria Industrial — Modulo 1, Tema 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Clasificar la IA por capacidad (ANI, AGI, ASI)
- Distinguir 5 tipos de IA por funcion
- Reconocer 10 casos reales de IA en manufactura global
- Identificar empresas ecuatorianas que ya usan IA

## Slide 2 — Tipos de IA por capacidad
- ANI (IA Estrecha): UNA tarea muy bien. Es lo que existe HOY.
- AGI (IA General): cualquier tarea como un humano. NO existe aun.
- ASI (Superinteligencia): supera al humano. Ciencia ficcion.

Tu carrera trabajara con ANI, y eso basta para transformar plantas.

## Slide 3 — 5 tipos de IA por funcion
- Generativa: crea texto, imagenes, codigo (ChatGPT, Claude)
- Predictiva: anticipa fallas, demanda (Power BI IA, Minitab)
- Conversacional: responde preguntas (ChatGPT como asistente)
- Visual: analiza imagenes (deteccion de defectos)
- Optimizacion: mejor combinacion de variables (programacion de produccion)

## Slide 4 — 10 casos reales (Parte 1)
1. Siemens: mantenimiento predictivo, 20 por ciento menos paradas
2. Tesla: vision en cada estacion de ensamblaje
3. Foxconn: programacion de 4h a 10 min
4. BMW: Deep Learning detecta defectos invisibles
5. P&G: predice defectos antes de que ocurran, 30 por ciento menos desperdicio

## Slide 5 — 10 casos reales (Parte 2)
6. Amazon: robots reducen picking 50 por ciento
7. DHL: rutas optimas, 15 por ciento menos combustible
8. Walmart: prediccion de demanda, 30 por ciento menos rupturas
9. Caterpillar: previene accidentes con sensores y IA
10. Unilever: programa turnos optimizando costos

## Slide 6 — IA en manufactura ecuatoriana
- Holcim, UNACEM: mantenimiento predictivo en cementeras
- Cerveceria Nacional: analitica para optimizar produccion
- Pronaca: explora vision por computadora
- Exportadoras de banano: drones con IA en plantaciones

Las herramientas no son experimentos. Estan en produccion real.

## Slide 7 — Ejercicio: Mapa de cadena de valor
Para tu empresa, identifica donde aplica cada tipo de IA:
- Proveedores y abastecimiento
- Recepcion y almacen de materia prima
- Produccion y planta
- Control de calidad
- Almacen de producto terminado
- Logistica y distribucion

Para cada etapa: tipo de IA, herramienta accesible, ejemplo concreto.

## Slide 8 — Resumen del Tema 1.2
1. Toda la IA comercial es ANI (IA Estrecha) y eso basta
2. 5 tipos por funcion: Generativa, Predictiva, Conversacional, Visual, Optimizacion
3. Casos globales: Siemens, Tesla, BMW, P&G, Amazon, Walmart
4. Ecuador ya tiene casos reales en cemento, alimentos, banano
5. La pregunta no es 'si', es 'cuando empezaras'

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 1.3 — El ecosistema de herramientas IA en 2026.
ChatGPT, Claude, Copilot, Power BI, Minitab y mas, con precios y casos de uso.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 3,
    title: 'Steveen M1 Tema 3 — Ecosistema de herramientas IA en 2026',
    inputText: `# El ecosistema de herramientas IA en 2026
## IA Aplicada para Ingenieria Industrial — Modulo 1, Tema 3
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Mapear las 8 herramientas IA esenciales para ingenieria industrial
- Comparar ChatGPT Plus vs Claude Pro segun tarea
- Disenar tu plan de adopcion por fases (mes 1 a mes 4+)
- Evitar el error de comprar la herramienta 'mas completa'

## Slide 2 — Las 8 herramientas esenciales
1. ChatGPT Plus (20 USD/mes) — caballo de batalla
2. Claude Pro (20 USD/mes) — documentos largos
3. Copilot Excel (incluido M365) — analisis en Excel
4. Power BI IA (desde 10 USD/mes) — dashboards
5. Minitab IA (1.800 USD/ano) — SPC y DOE
6. Tableau (15+ USD/mes) — visualizacion ejecutiva
7. NotebookLM (gratis) — base de conocimiento
8. n8n (gratis) — automatizacion de flujos

## Slide 3 — ChatGPT Plus vs Claude Pro
ChatGPT Plus gana en:
- Analisis de Excel con miles de filas
- Generacion de imagenes
- Calculos y codigo

Claude Pro gana en:
- Manuales tecnicos largos (+60 paginas)
- Comparativas tecnicas detalladas
- Procedimientos ISO
- Analisis cuidadoso de contratos

## Slide 4 — Plan de adopcion: Fase 1
Mes 1 — 20 USD/mes
- ChatGPT Plus + NotebookLM gratis
- Aprende prompt engineering basico
- Genera reportes simples
- Consulta procedimientos con NotebookLM

ROI esperado: 5 a 10 horas ahorradas por semana

## Slide 5 — Plan de adopcion: Fase 2 y 3
Mes 2-3 — 40 USD/mes
- Agrega Claude Pro
- Documentos largos, ISO, evaluacion de proveedores
- ROI: 10 a 15 horas/semana

Mes 4+ — 50-70 USD/mes
- Agrega Power BI IA
- Dashboards predictivos para gerencia
- ROI: 15 a 25 horas/semana + mejor toma de decisiones

## Slide 6 — Cuando agregar herramientas avanzadas
Minitab IA: solo si haces SPC formal y DOE de manera sistematica.
n8n: cuando quieras automatizar flujos completos entre 3+ herramientas.

Regla: nunca compres la siguiente herramienta sin haber dominado la actual.

## Slide 7 — El error mas comun en Ecuador
Comprar la herramienta 'mas completa' sin dominar las basicas.

ChatGPT Plus bien usado supera a Minitab mal configurado.

Regla practica:
1. Empieza simple
2. Mide resultados con datos
3. Escala solo cuando el ROI lo justifique

## Slide 8 — Resumen del Tema 1.3
1. 8 herramientas esenciales con precios y limitaciones claras
2. ChatGPT y Claude se complementan, no compiten
3. Plan por fases: 20 -> 40 -> 70 USD/mes con ROI medible
4. NotebookLM gratis es subutilizado y muy potente
5. Empieza simple. Escala con ROI demostrado.

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 1.4 — Como evaluar si una herramienta IA sirve para tu caso.
Framework PIED y checklist de 5 preguntas antes de comprar.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 4,
    title: 'Steveen M1 Tema 4 — Framework PIED para evaluar herramientas IA',
    inputText: `# Como evaluar si una herramienta IA sirve para tu caso
## IA Aplicada para Ingenieria Industrial — Modulo 1, Tema 4
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Aplicar el framework PIED para evaluar cualquier herramienta IA
- Usar el checklist de 5 preguntas antes de comprar
- Reconocer 5 errores frecuentes en adopcion de IA
- Cumplir con la LOPDP de Ecuador en tus decisiones

## Slide 2 — Framework PIED
- P — Problema: claro y medible (con numero)
- I — Inputs: tengo los datos digitales que necesita?
- E — Evaluacion: puedo probar antes de comprar?
- D — Despliegue: puedo implementarlo sin consultor externo permanente?

## Slide 3 — P: Problema bien formulado
MAL: 'Quiero usar IA en mi empresa'
BIEN: 'Quiero reducir el tiempo de generacion de reportes mensuales de 2h a 15 min'

Si no puedes formular el problema con un numero, no estas listo para comprar IA. Estas listo para definir el problema.

## Slide 4 — I: Inputs disponibles
Tres preguntas concretas:
1. Los datos estan en formato digital o en papel?
2. Tengo al menos 6 meses de historia?
3. Los datos estan limpios y estructurados?

Si fallaste en alguna, primero digitalizar y limpiar. Sin datos, no hay IA.

## Slide 5 — Checklist de 5 preguntas
1. Tenemos datos historicos digitales (+6 meses)?
2. El proceso es repetitivo con patrones?
3. Hoy alguien decide por experiencia/intuicion?
4. Un error tiene impacto economico significativo?
5. El volumen es demasiado grande para analisis manual?

3+ SI = buen candidato para IA

## Slide 6 — 5 errores frecuentes
1. Comprar por moda sin problema medible
2. Subestimar la curva de aprendizaje
3. Depender de un consultor para siempre
4. Ignorar la LOPDP — datos en servidores extranjeros
5. No medir resultados con cifras concretas

El framework PIED te protege de los 5.

## Slide 7 — LOPDP Ecuador: Lo que debes saber
Ley Organica de Proteccion de Datos Personales (vigente 2023):
- Derecho de acceso, rectificacion y eliminacion
- Datos personales no salen del pais sin acuerdo
- Multas hasta 1 por ciento de facturacion anual
- Aplica a herramientas IA que procesan datos de empleados o clientes

Verifica donde se guardan los datos antes de subirlos a una herramienta.

## Slide 8 — Resumen del Tema 1.4
1. PIED: Problema, Inputs, Evaluacion, Despliegue
2. Checklist de 5 preguntas: necesitas 3+ SI
3. La IA sin datos es motor sin gasolina
4. Verifica LOPDP antes de subir datos sensibles
5. Mide resultados con cifras o no estas haciendo nada

## Slide 9 — Proximo Tema y CTA
Proximo: Tema 1.5 — Mapa de oportunidades IA en tu empresa.
Construiremos tu roadmap personalizado con matriz impacto/esfuerzo.

itseia.ai — La primera academia de IA del Ecuador
`,
  },
  {
    temaId: 5,
    title: 'Steveen M1 Tema 5 — Mapa de oportunidades IA en tu empresa',
    inputText: `# Mapa de oportunidades IA en tu empresa
## IA Aplicada para Ingenieria Industrial — Modulo 1, Tema 5
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Construir tu mapa personalizado de oportunidades IA
- Aplicar la matriz impacto/esfuerzo para priorizar
- Identificar tus quick wins en 30 dias
- Disenar tu plan de adopcion de 90 dias

## Slide 2 — Metodologia de mapeo: 5 pasos
1. Inventario de procesos repetitivos (15-25 tipicamente)
2. Evaluacion con checklist de 5 preguntas (filtra a 8-12)
3. Priorizacion con matriz impacto/esfuerzo
4. Quick wins primero (Cuadrante 1)
5. Escalar a proyectos estrategicos (Cuadrante 2)

## Slide 3 — Matriz impacto / esfuerzo
- ALTO IMPACTO + BAJO ESFUERZO = QUICK WINS (empieza aqui)
- ALTO IMPACTO + ALTO ESFUERZO = ESTRATEGICOS (3-6 meses)
- BAJO IMPACTO + BAJO ESFUERZO = QUICK FILL (si sobra tiempo)
- BAJO IMPACTO + ALTO ESFUERZO = NO PRIORIZAR

La regla: empieza siempre por el Cuadrante 1.

## Slide 4 — 5 quick wins mas comunes
1. Reportes de produccion con ChatGPT — 2h/dia ahorradas
2. Analisis causa raiz con Claude — 4h/incidente
3. SOPs e ISO con Claude — 1 dia/procedimiento
4. Analisis de datos de calidad con ChatGPT — 4h/semana
5. Dashboard KPIs con Power BI IA — 3h/semana

## Slide 5 — Plan de 90 dias: Mes 1
Fase de fundamentos
- Capacitacion equipo en ChatGPT y Claude
- Prompt engineering basico
- 2 quick wins implementados

KPI esperado: 8 a 12 horas ahorradas semanales

## Slide 6 — Plan de 90 dias: Mes 2 y 3
Mes 2 — Expansion
- Power BI IA o Copilot Excel
- 1-2 quick wins mas
- KPI: 15 a 20 horas ahorradas semanales

Mes 3 — Proyecto estrategico
- Mantenimiento predictivo o pronostico de demanda
- Reporte ejecutivo a gerencia
- KPI: 20 a 25 horas ahorradas semanales

## Slide 7 — El error mas grande
Paralisis por analisis: 6 meses planificando vs 2 semanas implementando 2 quick wins.

La transformacion digital es iterativa, no perfecta.

Empieza pequeno. Mide. Escala con resultados demostrados.

## Slide 8 — Resumen del Tema 1.5
1. Inventario, filtro, priorizacion, quick wins, escalar
2. Matriz 2x2: empieza siempre por alto impacto + bajo esfuerzo
3. Quick wins en 30 dias generan confianza y ROI visible
4. Plan de 90 dias por fases con KPI medibles
5. Mejor 2 quick wins implementados que 6 meses de planificacion perfecta

## Slide 9 — Cierre del Modulo 1
Hoy completamos los 5 temas del Modulo 1: Fundamentos.

Proximo Modulo: ChatGPT — Dominio profesional para ingenieros industriales.

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
      additionalInstructions: 'Use ITSEIA brand: Navy #1F2F58 as primary, Yellow #FBBC0C for accents, Sky #73B8E7 for tech elements. Modern professional educational style. Spanish language. Industrial engineering audience.',
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
  console.log('=== Generando 5 presentaciones Gamma para Steveen Modulo 1 ===');
  console.log(`Inicio: ${new Date().toISOString()}\n`);

  const results = [];
  const outputPath = path.join(__dirname, 'steveen_gamma_urls.json');

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

  // -- Reporte final --------------------------------------------------------
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
