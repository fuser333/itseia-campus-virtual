#!/usr/bin/env node
/**
 * generate_gamma_bootcamp_mes1.js
 *
 * Genera las 16 presentaciones Gamma del Mes 1 del Bootcamp Intensivo de IA.
 * Endpoint: POST /generations -> poll GET /generations/{id} hasta completed.
 * Guarda resultados en content/bootcamp_mes1_gamma_urls.json (idempotente).
 *
 * Run: node content/generate_gamma_bootcamp_mes1.js
 */

const fs = require('fs');
const path = require('path');

const GAMMA_KEY  = 'sk-gamma-i1QpwB075C7XJzrB37YkUOCybMnM6FswKcmxbpH8g';
const GAMMA_BASE = 'https://public-api.gamma.app/v1.0';

const GAMMA_HEADERS = {
  'X-API-KEY':    GAMMA_KEY,
  'Content-Type': 'application/json',
};

// ── Las 16 sesiones del Mes 1 del Bootcamp ─────────────────────────────────

const PRESENTATIONS = [
  // ── MÓDULO 1: Fundamentos de IA ──────────────────────────────────────────
  {
    temaId: 1,
    title: 'Bootcamp Mes 1 Sesion 1 — Bienvenida y Que es la IA',
    inputText: `# Bienvenida + Que es realmente la Inteligencia Artificial
## Bootcamp Intensivo de IA — Mes 1, Sesion 1
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Que aprenderas hoy
- Definicion operativa de IA
- Las tres olas historicas
- Diferencia entre IA, ML, Deep Learning e IA generativa
- El modelo iceberg de ChatGPT
- 5 mitos sobre IA en Ecuador

## Slide 2 — Definicion operativa
IA: todo software que ejecuta tareas que antes requerian inteligencia humana.

No es debate filosofico. Es capacidad de ejecutar trabajo cognitivo.

## Slide 3 — Las tres olas
- 1980: Sistemas expertos (reglas SI-ENTONCES)
- 2000: Machine Learning estadistico
- 2017+: Deep Learning + Transformers
- Noviembre 2022: ChatGPT explota al publico

## Slide 4 — Mapa conceptual
IA contiene Machine Learning, que contiene Deep Learning, que contiene IA Generativa.

ChatGPT esta en el centro: es IA generativa.

## Slide 5 — El iceberg de ChatGPT
- Visible: la caja de chat
- Debajo: modelo, datos, GPUs, energia, anotadores humanos, guardrails

## Slide 6 — IA en Ecuador 2026
- 41% de empresas usan IA
- Solo 8% la implementa con criterio

Ahi esta la oportunidad profesional.

## Slide 7 — 5 mitos a desmontar
1. Reemplaza todos los trabajos
2. Solo para programadores
3. Es infalible
4. Es gratis
5. Es algo nuevo

## Slide 8 — Resumen
Sabes que es la IA, su historia, donde se ubica ChatGPT y los mitos a evitar.

## Slide 9 — Proxima sesion
Sesion 1.2 — Anatomia de un LLM: como funcionan ChatGPT, Claude y Gemini.

itseia.ai — Instituto Ecuatoriano de Inteligencia Artificial
`,
  },
  {
    temaId: 2,
    title: 'Bootcamp Mes 1 Sesion 2 — Anatomia de un LLM',
    inputText: `# Anatomia de un LLM: como funcionan ChatGPT, Claude y Gemini
## Bootcamp Intensivo de IA — Mes 1, Sesion 2
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Tres conceptos clave
- Token: unidad minima de procesamiento
- Parametro: numero interno aprendido
- Ventana de contexto: cuanto texto ve el modelo

## Slide 2 — Tokens en espanol
- ingenieria es aproximadamente 3 tokens
- casa es aproximadamente 1 token
- 100 palabras son 120 a 160 tokens

Importa para costos y limites.

## Slide 3 — Parametros
- GPT-4 alrededor de 1 billon de parametros
- Llama 3.1 viene en 8B, 70B y 405B

Mas parametros: mas capacidad, mas costo, mas latencia.

## Slide 4 — Ventana de contexto 2026
- GPT-4 Turbo: 128k tokens
- Claude Opus 4.5: 200k (1M empresarial)
- Gemini 1.5 Pro: 2M

200k es aproximadamente 300 paginas de libro.

## Slide 5 — Arquitectura Transformer
Paper: Attention is All You Need (Google 2017).

Tokens, embeddings, atencion, prediccion.

Base de todos los LLMs comerciales.

## Slide 6 — Abiertos vs cerrados
- Cerrados (GPT, Claude, Gemini): calidad, facilidad, datos al proveedor
- Abiertos (Llama, Mistral): control, privacidad, requiere infraestructura

## Slide 7 — Costos 2026
- GPT-4o: 2.50 / 10 USD por millon de tokens
- Claude Sonnet 4.5: 3 / 15 USD
- Gemini Flash: 0.30 / 0.60 USD

1.000 correos al dia: aproximadamente 30 a 100 USD al mes.

## Slide 8 — Elegir modelo
Tarea + Presupuesto + Privacidad

- Correo simple: Gemini Flash
- Legal complejo: Claude Opus
- Datos confidenciales: Llama autohospedado

## Slide 9 — Proxima sesion
Sesion 1.3 — Mapa de herramientas IA 2026.

itseia.ai
`,
  },
  {
    temaId: 3,
    title: 'Bootcamp Mes 1 Sesion 3 — Mapa de herramientas IA 2026',
    inputText: `# Mapa de herramientas IA 2026: el ecosistema en una pagina
## Bootcamp Intensivo de IA — Mes 1, Sesion 3
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — El problema del FOMO
Mas de 5.000 herramientas en directorios.

Estrategia ganadora: 5 a 8 herramientas dominadas a fondo, no 20 a medias.

## Slide 2 — 6 categorias funcionales
1. Conversacion: GPT, Claude, Gemini
2. Busqueda: Perplexity, You.com
3. Imagen: Midjourney, DALL-E, Leonardo
4. Video y voz: Sora, HeyGen, ElevenLabs
5. Agentes: Lindy, Manus, Strata
6. Productividad: Notion AI, Copilot, Duet

## Slide 3 — Stack minimo viable
- ChatGPT Plus: 20 USD
- Claude Pro: 20 USD
- Perplexity Pro: 20 USD

Total: USD 60 al mes.
Techo recomendado: USD 80 al mes.

## Slide 4 — Pagar desde Ecuador
- Tarjeta internacional Visa o Mastercard (Pichincha, Pacifico, Produbanco)
- Tarjetas virtuales prepagadas (Bee, Pacifico)
- Wise o PayPal con balance recargado

Wise: tipo de cambio mas barato y resiliente.

## Slide 5 — Herramientas regionales
- Strata (strata.h3l.ai): 9.000 documentos, 19 paises, desde USD 19.99
- ImagemIA: imagenologia medica predictiva ecuatoriana
- Botmaker, BotFlow: WhatsApp con IA, datos en LATAM (LOPDP)

## Slide 6 — Evaluar en 90 segundos
Checklist de 5 criterios:
1. Documentacion clara
2. Pricing transparente
3. Politica de datos
4. Soporte hispanohablante
5. Comunidad activa

Falla 3 de 5: descartar.

## Slide 7 — Anti-FOMO
Pregunta clave: que tarea concreta resuelve esto que mi stack actual no resuelve?

Si vago: ignorar.
Si especifico y medible: evaluar.

## Slide 8 — Resumen
- 6 categorias cubren el 95% de los casos
- Stack minimo: USD 60 a 80 al mes
- Pagar con Wise resulta resiliente
- Evaluar con 5 criterios en 90 segundos

## Slide 9 — Proxima sesion
Sesion 1.4 — Riesgos, etica y marco legal de la IA en Ecuador.

itseia.ai
`,
  },
  {
    temaId: 4,
    title: 'Bootcamp Mes 1 Sesion 4 — Riesgos etica y LOPDP Ecuador',
    inputText: `# Riesgos, etica y marco legal de la IA en Ecuador
## Bootcamp Intensivo de IA — Mes 1, Sesion 4 (cierre Modulo 1)
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Los 5 riesgos
1. Alucinacion
2. Sesgo algoritmico
3. Fuga de datos
4. Dependencia
5. Propiedad intelectual

## Slide 2 — Alucinacion
El LLM siempre responde, incluso cuando no sabe.

Caso EE.UU. 2023: abogado sancionado por sentencias inventadas por ChatGPT.

Regla: si importa, verifica en la fuente primaria.

## Slide 3 — Sesgo algoritmico
Los modelos heredan sesgos de los datos.

Caso Amazon: reclutamiento penalizaba mujeres por datos historicos sesgados.

Mitigacion: auditoria manual y supervision humana en decisiones criticas.

## Slide 4 — Fuga de datos y LOPDP
ChatGPT gratuito puede usar tus datos para entrenar.

LOPDP Ecuador: hasta 1 por ciento de facturacion anual de multa.

Caso Samsung: prohibio ChatGPT internamente tras filtracion de codigo.

## Slide 5 — LOPDP que exige
- Consentimiento del titular
- Jurisdicciones aprobadas
- Clausulas de procesador
- Notificacion de brechas

Aplica a nombres, cedulas, correos, salud.

## Slide 6 — Propiedad intelectual
- OpenAI: tu eres dueno segun terminos
- SENADI Ecuador: sin autoria humana, sin proteccion automatica

Practica: mezclar con trabajo humano sustantivo y registrar.

## Slide 7 — Politica de uso responsable
10 puntos minimos en una pagina:
- Que datos si o no
- Herramientas aprobadas
- Aprobador de excepciones
- Hasta 10. Responsable interno de IA

## Slide 8 — Cierre del Modulo 1
Sabes que es la IA, como funciona un LLM, que herramientas usar y que riesgos cuidar.

## Slide 9 — Proximo modulo
Modulo 2 — Prompt Engineering profesional.

itseia.ai
`,
  },
  // ── MÓDULO 2: Prompt Engineering ─────────────────────────────────────────
  {
    temaId: 5,
    title: 'Bootcamp Mes 1 Sesion 5 — Las 6 capas del prompt profesional',
    inputText: `# Anatomia del prompt: las 6 capas profesionales
## Bootcamp Intensivo de IA — Mes 1, Sesion 5
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Las 6 capas
1. Rol
2. Contexto
3. Tarea
4. Formato
5. Restricciones
6. Ejemplos (opcional)

## Slide 2 — 1. Rol
Quien es la IA.
- Mal: experto en negocios
- Bien: consultor financiero PYME en Ecuador

Activa patrones, calibra registro, establece autoridad.

## Slide 3 — 2. Contexto
Lo que el modelo necesita saber.

Ejemplo: empresa exportadora de banano en Machala, 40 empleados, USD 2.5M de facturacion, sin auditar SRI 3 anos.

Sin contexto el modelo improvisa.

## Slide 4 — 3. Tarea
Verbo de accion especifico.

- Mal: ayudame con el contrato
- Bien: identifica las 5 clausulas mas riesgosas para el empleador

Especificidad del verbo es 60% de la calidad.

## Slide 5 — 4. Formato
Como entregar la respuesta.

Tabla de 3 columnas, JSON con campos x, y, z, correo de maximo 200 palabras.

Reduce iteraciones drasticamente.

## Slide 6 — 5. Restricciones
Que NO debe hacer.

- No inventes citas legales
- No excedas 300 palabras
- No menciones competencia

Previenen los errores mas caros.

## Slide 7 — 6. Ejemplos (few-shot)
Demostrar que se considera bien hecho.

Un solo ejemplo bien escogido: 20 a 40 por ciento de mejora.

Ideal en tareas de formato especifico.

## Slide 8 — Metrica de calidad
Ejecuta el prompt 3 veces identicas.
- Respuestas similares: calibrado
- Respuestas dispares: subespecificado

Plantilla ITSEIA: secciones marcadas con encabezados.

## Slide 9 — Proxima sesion
Sesion 2.2 — Tecnicas avanzadas: Chain of Thought, Self-Consistency, Tree of Thoughts.

itseia.ai
`,
  },
  {
    temaId: 6,
    title: 'Bootcamp Mes 1 Sesion 6 — Tecnicas avanzadas CoT Self-Consistency ToT',
    inputText: `# Tecnicas avanzadas: Chain of Thought, Self-Consistency, Tree of Thoughts
## Bootcamp Intensivo de IA — Mes 1, Sesion 6
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Tres tecnicas clave
1. Chain of Thought (CoT)
2. Self-Consistency
3. Tree of Thoughts (ToT)

## Slide 2 — Chain of Thought
Pedirle al modelo que razone paso a paso.

Frases magicas: piensa paso a paso, explica tu razonamiento.

Wei et al. 2022: hasta 40 por ciento mas precision en problemas logicos.

## Slide 3 — CoT en Ecuador
Calculo de liquidacion laboral:
1. Decimo tercero
2. Decimo cuarto
3. Vacaciones
4. Bonificacion desahucio
5. Suma final

CoT evita confundir calculos.

## Slide 4 — Self-Consistency
Ejecuta el prompt 3 a 5 veces.

Elige la respuesta mas frecuente.

Critico para: calculos legales, dosis medicas, formulas financieras.

## Slide 5 — Tree of Thoughts
Genera 3 a 5 opciones, evalua, descarta, profundiza en la mejor.

Ideal: planificacion estrategica, decisiones de inversion, diseno de campana.

## Slide 6 — ReAct
Reason + Act.

Razona, llama herramienta, recibe resultado, sigue razonando, respuesta final.

Base de agentes modernos (Claude tools, GPTs, Lindy).

## Slide 7 — Cuando NO usar CoT
- Tareas creativas
- Poesia, brainstorming
- Redaccion literaria

CoT mejora precision, no creatividad.

## Slide 8 — Tabla de eleccion
- Analitico: CoT
- Critico: Self-Consistency
- Estrategico: Tree of Thoughts
- Creativo: sin CoT, temperatura alta

## Slide 9 — Proxima sesion
Sesion 2.3 — Prompts para tareas profesionales reales.

itseia.ai
`,
  },
  {
    temaId: 7,
    title: 'Bootcamp Mes 1 Sesion 7 — Prompts profesionales en cadena',
    inputText: `# Prompts para tareas profesionales reales
## Bootcamp Intensivo de IA — Mes 1, Sesion 7
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — 10 tareas de alto valor
- Comunicacion: correos, resumen reuniones, traduccion
- Analisis: contratos, reportes, evaluacion de CVs
- Creatividad: propuestas, contenido redes, slides, politicas

## Slide 2 — 3 registros ecuatorianos
- B2B corporativo: formal, uso de usted, sin emojis
- B2C cercano: tu, emojis moderados, frases cortas
- Interno: semiformal, vocabulario comun

## Slide 3 — Prompts en cadena
Patron estandar:
- Extraccion (Perplexity)
- Analisis (Claude)
- Recomendacion (GPT-4)
- Presentacion (Gamma)

## Slide 4 — Prompts espejo
Despues de generar, pide al modelo evaluarse:
1. Responde la pregunta?
2. Sin informacion inventada?
3. Cumple formato?
4. Registro adecuado?

Reduce errores hasta 50 por ciento.

## Slide 5 — Regla 80/20 de iteracion
4 intentos sin mejorar = el problema no es el prompt.

Cambia: modelo, estrategia o alcance.

Iterar mas alla es desperdicio.

## Slide 6 — Voz de marca
- 5 a 10 muestras del estilo
- Reglas de voz extraidas con Claude
- Validar con equipo
- Anexar a todos los prompts

Documento de 3 paginas resuelve 80% de los casos.

## Slide 7 — Caso 25 minutos
Propuesta para banco ecuatoriano:
- 0-5 min: Perplexity (investigacion)
- 5-10 min: Claude (estructura)
- 10-20 min: GPT-4 (redaccion)
- 20-25 min: Espejo y ajuste

Equivalente a 4 horas de trabajo manual.

## Slide 8 — Tu biblioteca empieza hoy
Cada buen output: extrae prompt, anota en Notion con metadata.

3 meses: 20 a 30 prompts versionados.

Productividad x2 o x3.

## Slide 9 — Proxima sesion
Sesion 2.4 — Bibliotecas de prompts y versionado.

itseia.ai
`,
  },
  {
    temaId: 8,
    title: 'Bootcamp Mes 1 Sesion 8 — Bibliotecas y versionado de prompts',
    inputText: `# Bibliotecas de prompts, versionado y trabajo en equipo
## Bootcamp Intensivo de IA — Mes 1, Sesion 8 (cierre Modulo 2)
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Prompts are code
Un prompt es codigo.

Debe versionarse, testearse, revisarse, compartirse.

Sin disciplina: pierdes conocimiento, repites errores, no escalas.

## Slide 2 — Estructura de carpetas
3 dimensiones:
- Dominio: comunicacion, analisis, generacion, automatizacion
- Nivel: basico, intermedio, avanzado
- Idioma: es-EC, es-neutro, en

Ejemplo: /prompts/comunicacion/correos-b2b-es-ec.md

## Slide 3 — Versionado con Git
No opcional cuando el prompt impacta dinero.

- Commits que explican cambio
- Pull requests con review
- Herramientas: PromptLayer, Helicone, LangSmith

## Slide 4 — Pruebas de regresion
Cada prompt critico: minimo 20 casos de prueba.

GPT-4 a GPT-5 puede romper sin avisar.

Sin set de pruebas: descubris fallas con reclamos de usuarios.

## Slide 5 — Naming y tagging
Ejemplo: correos_recordatorio_morosos_es_v3.md

Tags utiles: b2b, b2c, claude, gpt4, produccion, experimental, deprecated.

## Slide 6 — Herramientas por escala
- Personal: Notion u Obsidian (gratis)
- Equipo de 3 a 10: PromptLayer (free)
- Produccion: LangSmith o Helicone (desde 50 USD al mes)

## Slide 7 — Cultura de equipo
- Prompt review tipo code review
- Metricas de adopcion
- Retros mensuales
- Ownership por prompt

ITSEIA aplica esto al bot de leads.

## Slide 8 — Cierre Modulo 2
Entregable: biblioteca personal con 20+ prompts versionados.

Activo profesional subestimado.

6 meses = cientos de horas ahorradas.

## Slide 9 — Proximo modulo
Modulo 3 — Automatizacion con IA.

itseia.ai
`,
  },
  // ── MÓDULO 3: Automatización con IA ──────────────────────────────────────
  {
    temaId: 9,
    title: 'Bootcamp Mes 1 Sesion 9 — Conceptos de automatizacion',
    inputText: `# Conceptos de automatizacion: triggers, acciones, flujos
## Bootcamp Intensivo de IA — Mes 1, Sesion 9
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — 3 conceptos clave
- Trigger: el evento que dispara
- Accion: la operacion que ejecuta
- Flujo: secuencia trigger + acciones

## Slide 2 — Tipos de trigger
- Temporal: cada lunes 8 AM
- Cambio: nuevo correo etiquetado
- Usuario: formulario llenado
- Webhook: POST a URL

Elegir el trigger correcto es eficiencia.

## Slide 3 — Tipos de accion
- Lectura
- Escritura
- Computo (IA analiza)
- Comunicacion (WhatsApp, correo)
- Control (decision condicional)

## Slide 4 — Notacion BPMN simplificada
- Rectangulo: accion
- Rombo: decision
- Circulo: inicio o fin
- Flecha: continuidad

Dibuja cualquier flujo en 5 minutos.

## Slide 5 — 5 oportunidades top en PYME
1. Gestion de leads
2. Gestion de correos
3. Reporte de ventas
4. Atencion al cliente repetitiva
5. Generacion de contenido

## Slide 6 — Calculo de ROI
Horas semanales x valor hora x 52 semanas, menos costo anual de la herramienta.

Punto de equilibrio tipico: 3 a 6 semanas.

Si supera 3 meses, replanteate el caso.

## Slide 7 — Riesgos al automatizar mal
1. Efecto cascada
2. Falsos positivos
3. Perdida de control humano

Mitigacion: limites, revision muestral, alertas.

## Slide 8 — Caso ITSEIA leads
Lead WhatsApp a IA clasifica a enriquece datos a responde plantilla a Sheets a notifica equipo.

100 leads/dia, 20h ahorradas semanales, equilibrio en 1 semana.

## Slide 9 — Proxima sesion
Sesion 3.2 — Make: tu primer flujo end-to-end con IA.

itseia.ai
`,
  },
  {
    temaId: 10,
    title: 'Bootcamp Mes 1 Sesion 10 — Make tu primer flujo con IA',
    inputText: `# Make: el primer flujo end-to-end con IA
## Bootcamp Intensivo de IA — Mes 1, Sesion 10
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Por que Make
- Plan gratis: 1.000 operaciones al mes
- Interfaz visual intuitiva
- Conectores con Gmail, WhatsApp, Sheets, Drive, Notion

Mejor balance potencia / curva de aprendizaje.

## Slide 2 — Make vs competencia
- vs Zapier: mas conectores pero caro
- vs n8n: open-source pero requiere infraestructura
- vs Power Automate: mejor M365 pero menos creativo

## Slide 3 — Anatomia de escenario
- Modulos: cada paso
- Routers: bifurcacion condicional
- Iteradores: procesar listas
- Agregadores: juntar resultados

## Slide 4 — Conectar OpenAI o Claude
1. API key (platform.openai.com)
2. Modulo OpenAI o Anthropic en Make
3. Prompt con datos del modulo anterior

Usa el modelo mas barato que cumpla la tarea.

## Slide 5 — Manejo de errores
- Bifurcacion condicional al fallar
- Reintentos con espera exponencial
- Alertas a Slack o WhatsApp tras 3 fallos

Sin esto, el flujo se rompe silenciosamente.

## Slide 6 — 3 modos de programacion
- Cron-style: lunes 8 AM
- On-demand: clic o webhook
- Tiempo real: nuevo evento

Combinables en un mismo escenario.

## Slide 7 — Asistente de correo (40 min)
Gmail nuevo correo etiqueta responder a filtrar remitente a OpenAI genera borrador a guardar draft Gmail a WhatsApp al usuario.

Resultado: borradores listos al llegar.

## Slide 8 — Testing antes de produccion
- Ejecuta manual con datos de prueba
- Revisa logs durante la primera semana
- Ajusta prompt segun los borradores

3 semanas: correcto a excelente.

## Slide 9 — Proxima sesion
Sesion 3.3 — Conectores avanzados: WhatsApp, Notion, Calendar, Drive.

itseia.ai
`,
  },
  {
    temaId: 11,
    title: 'Bootcamp Mes 1 Sesion 11 — Conectores avanzados',
    inputText: `# Conectores avanzados: WhatsApp, Notion, Calendar, Drive
## Bootcamp Intensivo de IA — Mes 1, Sesion 11
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — 4 conectores clave
1. WhatsApp Cloud API (Meta oficial)
2. Notion (base de datos liviana)
3. Google Calendar (eventos)
4. Google Drive (documentos)

## Slide 2 — WhatsApp Cloud API
Oficial de Meta, unica via legal para empresas.

- App: soporte manual ligero
- Cloud API: programatico, miles simultaneos

PYME con 100 clientes: aproximadamente 5 a 30 USD al mes.

## Slide 3 — Configurar WhatsApp
1. Cuenta Facebook Business
2. Numero dedicado
3. Verificacion del negocio (1 a 3 dias)
4. Templates aprobados

Integra con Make, Zapier, n8n y CRMs.

## Slide 4 — Notion como base de datos
Alternativa a Airtable, Excel, SQL.

CRM ligero, seguimiento, FAQ para chatbot, logs.

Limite comodo: 5.000 filas por base.

## Slide 5 — Calendar triggers
- Confirmaciones automaticas al agendar
- Recordatorios el dia antes
- Minutas con IA al terminar
- Sincronizacion con CRM
- Bloqueo de tiempo de preparacion

## Slide 6 — Drive triggers
PDF subido a IA resume a extrae datos a ficha Notion a notifica equipo.

Aplica en estudios juridicos, contadores, salud, RRHH.

## Slide 7 — Seguridad obligatoria
- Scopes minimos
- OAuth (nunca password en campos)
- Rotacion de API keys cada 3 a 6 meses
- Audit log mensual

## Slide 8 — Reunion inteligente
Calendar etiqueta auto-minuta a Read.ai/Otter a IA resume a Drive minuta a pagina Notion a WhatsApp equipo.

5 minutos manuales se convierten en 30 segundos automaticos.

## Slide 9 — Proxima sesion
Sesion 3.4 — Agentes de IA: cuando la automatizacion piensa.

itseia.ai
`,
  },
  {
    temaId: 12,
    title: 'Bootcamp Mes 1 Sesion 12 — Agentes de IA Lindy y Strata',
    inputText: `# Agentes de IA: cuando la automatizacion piensa
## Bootcamp Intensivo de IA — Mes 1, Sesion 12 (cierre Modulo 3)
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Automatizacion vs Agente
- Automatizacion: determinista, mismo input igual output, pasos fijos
- Agente: no determinista, percibe, razona, decide, actua con autonomia limitada

## Slide 2 — 4 componentes del agente
1. LLM como cerebro
2. Memoria de corto y largo plazo
3. Herramientas (tools)
4. Bucle de razonamiento

## Slide 3 — Frameworks no-code
- Lindy: visual, amigable, gratis empezar
- Manus: tareas profesionales complejas
- Strata (H3L Ecuador): 9.000 docs, 19 paises, desde USD 19.99
- Relevance AI: enterprise desde USD 19

## Slide 4 — Costo y riesgo
Agente mal disenado en bucle: USD 200 en una noche.

Guardrails:
- Maximo 10 iteraciones por sesion
- Limite de USD por dia
- Alerta al 50% de presupuesto
- Kill switch en menos de 30 segundos

## Slide 5 — Caso Strata (H3L)
- 9.000 documentos profesionales
- 19 paises
- Memoria por usuario

Responde consultas legales, contables y de salud con cita exacta y ejemplos.

Desde USD 19.99 al mes.

## Slide 6 — Cuando automatizacion vs agente
- Automatizacion gana: lineal, determinista, pasos fijos
- Agente gana: decisiones contextuales, pasos variables, incertidumbre

## Slide 7 — Demo agente personal Lindy
Cada hora revisa correo a prioriza a responde trivial a agenda importante a reporta al final del dia.

Gmail + Calendar + Notion + mensajeria.

## Slide 8 — 5 preguntas de diseno
1. Objetivo en 1 frase
2. Herramientas necesarias
3. Memoria (corto o largo plazo)
4. Limite de costo diario
5. Criterio de exito medible

## Slide 9 — Proximo modulo
Modulo 4 — Proyecto integrador del Mes 1.

itseia.ai
`,
  },
  // ── MÓDULO 4: Proyecto Integrador del Mes ────────────────────────────────
  {
    temaId: 13,
    title: 'Bootcamp Mes 1 Sesion 13 — PRD del proyecto integrador',
    inputText: `# Definicion del proyecto: del problema al PRD de 1 pagina
## Bootcamp Intensivo de IA — Mes 1, Sesion 13
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Por que un PRD
La definicion predice el exito.

Alumno con portafolio: PRD de calidad.
Alumno con notas: se salto esta sesion.

## Slide 2 — Problema real
Tu o tu organizacion lo viven con dolor recurrente.

No teorico, no copiado de Twitter.

30 segundos para explicar a quien le duele y cuantas veces a la semana.

## Slide 3 — Job to be done
Cuando [situacion],
yo quiero [motivacion],
para que [resultado deseado].

Fuerza claridad. Evita asistente que ayuda con cosas.

## Slide 4 — 8 componentes del PRD
1. Contexto
2. Problema (con numeros)
3. Usuario
4. Solucion (1 frase)
5. Alcance (3 a 5 capacidades)
6. Fuera de alcance
7. Metricas de exito
8. Riesgos

## Slide 5 — Producto vs Prototipo vs Demo
- Producto: meses, valor sostenido a usuarios reales
- Prototipo: semanas, viabilidad tecnica
- Demo: horas, idea sin funcion real

MVP funcional: entre prototipo y producto.

## Slide 6 — Metricas SMART
- Mal: debe ser excelente
- Bien: responde correctamente al menos 75% en menos de 15 segundos en demo, con 0 alucinaciones legales

Medible es saber cuando terminar.

## Slide 7 — Anti-patron
Asistente que hace de todo: 15 capacidades, ninguna funciona.

Ganadora: 1 cosa excepcional vs 10 a medias.

Strata empezo solo con consultas legales.

## Slide 8 — Revision por pares
Otro alumno revisa con 5 preguntas:
1. Problema real?
2. Usuario claro?
3. Alcance manejable?
4. Metricas medibles?
5. Riesgos identificados?

Falla 3 de 5: reescribir.

## Slide 9 — Proxima sesion
Sesion 4.2 — Construccion guiada del MVP, parte 1.

itseia.ai
`,
  },
  {
    temaId: 14,
    title: 'Bootcamp Mes 1 Sesion 14 — Construccion del MVP parte 1',
    inputText: `# Construccion guiada del MVP, parte 1: ingesta y razonamiento
## Bootcamp Intensivo de IA — Mes 1, Sesion 14
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — 3 componentes clave
1. Fuente de datos
2. System prompt maestro
3. Bateria de pruebas

## Slide 2 — 4 opciones de fuente
1. Archivo plano (hasta 15.000 tokens)
2. Notion u otra base liviana (100 a 5.000 filas)
3. Base de datos relacional
4. RAG con base vectorial (mas de 15.000 tokens)

## Slide 3 — Para Mes 1: opcion 1 o 2
Empezar simple, validar, complejizar despues.

Caso legal LOPDP: archivo de contexto base + Notion para FAQs y plantillas.

## Slide 4 — 5 secciones del system prompt
1. Identidad
2. Conocimiento base
3. Reglas duras
4. Tono
5. Que hacer ante incertidumbre

500 a 1.000 palabras.

## Slide 5 — Guard rails
Restricciones explicitas inquebrantables.

Ejemplo: nunca cites jurisprudencia que no este en tu base.

Un guard rail vale mas que 10 mejoras de prompt.

## Slide 6 — 3 categorias de prueba
- 10 preguntas tipo (frecuentes)
- 10 preguntas trampa (sacar fuera de alcance)
- 10 preguntas fuera de alcance (debe derivar)

## Slide 7 — Metricas de calidad
- Primer pase: 50 a 70%
- Iteracion semanal: 85 a 95%

Hoja: pregunta, esperada, obtenida, acepta o rechaza.

## Slide 8 — Demo asistente legal
- Prompt 600 palabras + 5 documentos base
- 30 preguntas de prueba
- Primer pase: 72%
- Tras 3 iteraciones con guard rails: 93%

## Slide 9 — Proxima sesion
Sesion 4.3 — Construccion del MVP parte 2: integracion y publicacion.

itseia.ai
`,
  },
  {
    temaId: 15,
    title: 'Bootcamp Mes 1 Sesion 15 — Integracion y publicacion del asistente',
    inputText: `# Construccion guiada del MVP, parte 2: integracion y publicacion
## Bootcamp Intensivo de IA — Mes 1, Sesion 15
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — 3 tareas clave
1. Elegir canal correcto
2. Embeber en el canal
3. Logging para monitorear y mejorar

## Slide 2 — Decision de canal
- WhatsApp: B2C en Ecuador (mas del 90% de adopcion)
- Web embebido: ya tienes trafico
- Slack: corporativo interno
- Telegram: alternativa simple a WhatsApp

## Slide 3 — Web embed (50 lineas JS)
Plataformas: Chatbase, Voiceflow, Botpress.

1. Cuenta
2. Subir base de conocimiento
3. Copiar script
4. Pegar en HTML antes del cierre del body

Gratis hasta 50 mensajes mensuales.

## Slide 4 — WhatsApp Cloud API
Facebook Business + numero + verificacion + webhook + codigo del LLM.

Servicios intermedios: Vonage, Twilio, Sirena (comision por mensaje).

## Slide 5 — Slack interno
api.slack.com a app a scopes a instalar a codigo que escucha menciones.

Ideal RRHH: politicas, vacaciones, beneficios.

## Slide 6 — Logging minimo
5 campos por conversacion:
- timestamp
- usuario
- pregunta
- respuesta
- evaluacion

Google Sheets via Make o Supabase para produccion.

## Slide 7 — Iteracion semanal
- Lunes: revisar logs
- 3 a 5 errores mas frecuentes
- Ajustar prompt o base
- Re-ejecutar bateria

3 semanas: 75% a 95%.

## Slide 8 — Pricing operacional
100 conversaciones diarias x 500 tokens en GPT-4o: aproximadamente USD 75 + plataforma USD 19 = USD 94 al mes.

Si ahorra 20 horas semanales del equipo: ROI sobrado.

## Slide 9 — Proxima sesion
Sesion 4.4 — Demo Day del Mes 1.

itseia.ai
`,
  },
  {
    temaId: 16,
    title: 'Bootcamp Mes 1 Sesion 16 — Demo Day cierre del Mes 1',
    inputText: `# Demo Day del Mes 1: presentacion y evaluacion cruzada
## Bootcamp Intensivo de IA — Mes 1, Sesion 16 (cierre Mes 1)
ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

## Slide 1 — Pitch de 5 minutos
1. Problema (45 segundos)
2. Solucion (60 segundos)
3. Demo en vivo (120 segundos)
4. Metricas (45 segundos)
5. Proximos pasos (30 segundos)

## Slide 2 — Storytelling profesional
Empieza por la persona afectada, no la tecnologia.

- Mal: construi asistente con GPT-4
- Bien: Maria, contadora de 5 PYMEs en Quito, pierde 15 horas mensuales por preguntas repetidas

## Slide 3 — Preparacion de demo
1. Probar 5 veces antes del Demo Day
2. Backup grabado en video por si falla
3. 3 casos: facil, dificil, fuera de alcance

Mostrar bordes demuestra pensamiento profesional.

## Slide 4 — Rubrica de evaluacion
5 dimensiones, peso igual, 1 a 5 cada una:
- Claridad del problema
- Calidad tecnica
- Experiencia de usuario
- Metricas reales
- Presentacion

Maximo 25, aprobado 18 o mas.

## Slide 5 — Recibir critica
1. Tomar notas, no responder defensivamente
2. Agradecer aunque sea duro
3. Separar feedback util del ruido

Los que se molestan reciben menos feedback futuro.

## Slide 6 — Video LinkedIn de 3 minutos
- 30 s problema
- 60 s demo
- 60 s metricas y aprendizajes
- 30 s cierre con CTA

Subtitulos quemados, vertical o cuadrado, miniatura llamativa.

Etiquetar a ITSEIA.

## Slide 7 — Tu portafolio Mes 1 (los 7 entregables)
1. Documento Mi sector y la IA
2. Stack personal IA
3. Politica de uso responsable
4. Biblioteca con 20+ prompts
5. 3 automatizaciones funcionando
6. Asistente IA publicado
7. Video LinkedIn de 3 minutos

## Slide 8 — Felicitaciones
Cerraste el Mes 1.

Has entregado 7 piezas que ningun otro programa de 4 semanas en Ecuador entrega con esta profundidad.

## Slide 9 — Proximo: Mes 2
Mes 2 — Python aplicado a IA + Fundamentos de Machine Learning.

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
      additionalInstructions: 'Use ITSEIA brand colors Navy #1F2F58 as primary, Yellow #FBBC0C for accents, Sky #73B8E7 for tech elements. Modern professional educational style. Spanish language.',
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
  console.log('=== Generando 16 presentaciones Gamma para Bootcamp Mes 1 ===');
  console.log(`Inicio: ${new Date().toISOString()}\n`);

  const results = [];
  const outputPath = path.join(__dirname, 'bootcamp_mes1_gamma_urls.json');

  // Cargar progreso previo si existe (idempotente).
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
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

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
