// ─────────────────────────────────────────────────────────────────────────────
// Google AI Essentials — datos estáticos
// ----------------------------------------------------------------------------
// Fuente de verdad: contenido textual del programa para la página
//   /certificaciones/google-ai-essentials
// Compatible con la página existente apps/web/src/app/certificaciones/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type {
  CertificationLevel,
  CertificationStatus,
  ExamQuestionOption,
} from "@/types/database";

export interface LeccionTeorica {
  id: string;
  orden: number;
  titulo: string;
  contenidoMarkdown: string;
  duracionLecturaMin: number;
}

export interface VideoCurado {
  url: string | null;
  titulo: string;
  duracionMin: number;
  canal: string | null;
  pendiente: boolean;
  notas: string | null;
}

export interface PreguntaSimulacro {
  id: string;
  enunciado: string;
  opciones: ExamQuestionOption[];
  respuestaCorrecta: number;
  explicacion: string;
}

export interface DominioData {
  orden: number;
  nombre: string;
  descripcion: string;
  porcentajeEnExamen: number;
  lecciones: LeccionTeorica[];
  video: VideoCurado;
  slidesUrl?: string;
  preguntasPractica: PreguntaSimulacro[];
  preguntasSimulacro: PreguntaSimulacro[];
}

export interface CertificacionData {
  slug: string;
  nombre: string;
  proveedor: string;
  logoUrl: string;
  nivelDificultad: CertificationLevel;
  costoExamenUsd: number;
  duracionHorasEstimada: number;
  umbralAprobacionPorcentaje: number;
  idiomaExamen: string;
  descripcion: string;
  estado: CertificationStatus;
  examOficialCodigo: string;
  totalPreguntasSimulacro: number;
  duracionSimulacroMin: number;
  dominios: DominioData[];
}

function q(
  id: string,
  enunciado: string,
  opciones: [string, string, string, string],
  respuestaCorrecta: number,
  explicacion: string
): PreguntaSimulacro {
  return {
    id,
    enunciado,
    opciones: opciones.map((text, idx) => ({
      text,
      is_correct: idx === respuestaCorrecta,
    })),
    respuestaCorrecta,
    explicacion,
  };
}

export const googleAiEssentialsData: CertificacionData = {
  slug: "google-ai-essentials",
  nombre: "Google AI Essentials",
  proveedor: "Google",
  logoUrl: "/logos/google-ai-essentials.svg",
  nivelDificultad: "basico",
  costoExamenUsd: 49,
  duracionHorasEstimada: 10,
  umbralAprobacionPorcentaje: 80,
  idiomaExamen: "español",
  descripcion:
    "Certifícate con Google en fundamentos de IA generativa, prompt engineering profesional, uso responsable de la IA y aplicaciones prácticas en Google Workspace. 100 % online, sin prerrequisitos, avalado por Google y Coursera.",
  estado: "activa",
  examOficialCodigo: "Google-AI-Essentials",
  totalPreguntasSimulacro: 40,
  duracionSimulacroMin: 60,
  dominios: [
    // ── MÓDULO 1 ───────────────────────────────────────────────────────────
    {
      orden: 1,
      nombre: "Fundamentos de IA Generativa",
      descripcion:
        "Conceptos base de la IA generativa, grandes modelos de lenguaje y cómo funcionan las herramientas de IA de Google.",
      porcentajeEnExamen: 25,
      video: {
        url: "https://www.youtube.com/embed/PLACEHOLDER",
        titulo: "Google AI Essentials — Módulo 1: Fundamentos de IA Generativa",
        duracionMin: 30,
        canal: "Google for Education",
        pendiente: true,
        notas: "GRABACIÓN PROPIA NECESARIA. Usar contenido oficial del curso en Coursera como base.",
      },
      slidesUrl: undefined,
      lecciones: [
        {
          id: "M1.1",
          orden: 1,
          titulo: "¿Qué es la IA generativa?",
          duracionLecturaMin: 5,
          contenidoMarkdown: `La **IA generativa** es una categoría de inteligencia artificial capaz de producir contenido nuevo: texto, imágenes, audio, video y código. A diferencia de la IA discriminativa (que clasifica o predice a partir de datos existentes), la IA generativa crea salidas originales a partir de patrones aprendidos durante el entrenamiento.

Los **Modelos de Lenguaje Grande (LLMs)** como Gemini de Google son el motor detrás de herramientas como Google Bard, Workspace AI y NotebookLM. Estos modelos se entrenan sobre billones de tokens de texto e internalizan patrones estadísticos de lenguaje, razonamiento y conocimiento factual.

El ciclo de funcionamiento es: (1) entrada del usuario (prompt), (2) tokenización (el texto se convierte en números), (3) predicción de la siguiente secuencia más probable, (4) decodificación a texto legible. Este proceso ocurre en milisegundos gracias a chips especializados como las TPUs de Google.

En el contexto ecuatoriano, las herramientas generativas más adoptadas por empresas en 2026 son: Google Workspace AI (integrado en Gmail y Docs), ChatGPT vía API y Gemini Advanced. La adopción crece en sectores como educación, banca y servicios profesionales.`,
        },
        {
          id: "M1.2",
          orden: 2,
          titulo: "Cómo funcionan los modelos de lenguaje de Google",
          duracionLecturaMin: 6,
          contenidoMarkdown: `**Gemini** es la familia de modelos multimodales de Google, capaces de procesar texto, imágenes, audio y video en una sola arquitectura. Las variantes principales son: Gemini Ultra (máxima capacidad), Gemini Pro (balance rendimiento/costo) y Gemini Nano (dispositivos móviles).

La arquitectura **Transformer** (introducida por Google en el paper "Attention is All You Need", 2017) es la base de todos los LLMs modernos. El mecanismo de **atención** permite al modelo ponderar la relevancia de cada parte del contexto al generar cada token. Esto resuelve el problema de "memoria a largo plazo" que tenían las redes recurrentes anteriores.

**Fine-tuning vs. prompting:** los modelos base se especializan de dos formas. El fine-tuning ajusta los pesos del modelo con datos específicos del dominio (costoso, requiere infraestructura). El prompting guía al modelo en tiempo de inferencia sin modificar sus pesos (económico, accesible para cualquier profesional). El curso Google AI Essentials se enfoca en el segundo enfoque.

**Limitaciones importantes:** los LLMs tienen una fecha de corte de conocimiento, pueden generar información incorrecta ("alucinaciones"), y reflejan sesgos presentes en sus datos de entrenamiento. El profesional responsable siempre verifica la salida antes de usarla.`,
        },
        {
          id: "M1.3",
          orden: 3,
          titulo: "Ecosistema de herramientas de IA de Google",
          duracionLecturaMin: 5,
          contenidoMarkdown: `Google ofrece un ecosistema integrado de herramientas de IA accesibles sin conocimientos técnicos avanzados:

**Google Gemini** (gemini.google.com): asistente conversacional multimodal. Disponible en versión gratuita y Advanced ($20/mes). Se integra con Google Workspace vía Gemini for Workspace.

**NotebookLM**: permite cargar documentos propios (PDFs, Google Docs, páginas web) y hacer preguntas sobre ellos. Ideal para análisis de contratos, síntesis de informes y preparación de presentaciones.

**Google AI Studio** (aistudio.google.com): interfaz de desarrollador para experimentar con la API de Gemini. Permite ajustar temperatura, longitud de respuesta y probar system prompts.

**Vertex AI**: plataforma cloud de ML para equipos técnicos. Permite entrenar, desplegar y monitorear modelos a escala empresarial.

**Duet AI en Workspace**: nombre anterior de Gemini for Workspace. Integrado en Gmail (redacción y resumen), Docs (escritura asistida), Sheets (fórmulas en lenguaje natural), Slides (generación de presentaciones) y Meet (transcripción y resúmenes).`,
        },
        {
          id: "M1.4",
          orden: 4,
          titulo: "Casos de uso reales y limitaciones",
          duracionLecturaMin: 5,
          contenidoMarkdown: `Los **casos de uso con mayor ROI** documentados en empresas latinoamericanas para 2026 son: (1) redacción y edición de documentos (ahorro promedio 3h/semana por empleado), (2) síntesis de reuniones y correos, (3) generación de primer borrador de propuestas comerciales, (4) análisis de datos con lenguaje natural en Sheets, y (5) automatización de respuestas de soporte al cliente.

**Limitaciones que todo profesional debe conocer:**
- **Alucinaciones:** el modelo puede inventar hechos, citas o datos con total confianza. Nunca publicar salida de IA sin verificar fuentes críticas.
- **Fecha de corte:** el modelo desconoce eventos recientes. Para información actualizada, usar búsqueda con Grounding (función de Gemini que conecta con Google Search).
- **Contexto limitado:** aunque los modelos modernos manejan ventanas largas (hasta 1 millón de tokens en Gemini 1.5 Pro), documentos muy extensos pueden degradar la calidad de respuesta.
- **Confidencialidad:** nunca ingresar datos personales sensibles, secretos comerciales o información regulada en modelos públicos sin revisar las políticas de privacidad.`,
        },
        {
          id: "M1.5",
          orden: 5,
          titulo: "Diferencias entre IA generativa, ML tradicional y automatización",
          duracionLecturaMin: 4,
          contenidoMarkdown: `Tres categorías que se confunden frecuentemente en el entorno laboral:

**Automatización tradicional (RPA):** ejecuta reglas predefinidas de forma determinista. Ejemplo: mover archivos según nombre, enviar correo cuando una celda cambia. No aprende, no generaliza, no genera.

**Machine Learning tradicional:** aprende patrones estadísticos de datos etiquetados para hacer predicciones. Ejemplo: predecir la probabilidad de impago de un cliente, clasificar correos como spam. Requiere datos estructurados y entrenamiento explícito.

**IA generativa:** produce contenido nuevo basado en instrucciones en lenguaje natural. Ejemplo: redactar un informe, generar código, crear una imagen. No requiere datos propios para funcionar; basta con un buen prompt.

Para el profesional no técnico, la regla práctica es: si la tarea produce una salida de contenido nuevo a partir de instrucciones, usa IA generativa. Si la tarea predice un valor numérico o una categoría a partir de datos históricos, considera ML tradicional.`,
        },
      ],
      preguntasPractica: [
        q("M1.P1", "¿Cuál es la principal diferencia entre IA generativa e IA discriminativa?",
          ["La generativa usa más datos de entrenamiento.", "La generativa produce contenido nuevo; la discriminativa clasifica o predice.", "La discriminativa es más moderna.", "No existe diferencia significativa."], 1,
          "La IA generativa crea salidas originales (texto, imágenes, código). La discriminativa clasifica o predice a partir de entradas existentes."),
        q("M1.P2", "¿Qué arquitectura es la base de los LLMs modernos como Gemini?",
          ["Redes recurrentes (LSTM)", "Transformers con mecanismo de atención", "Redes convolucionales (CNN)", "Árboles de decisión"], 1,
          "El paper 'Attention is All You Need' (Google, 2017) introdujo los Transformers, base de todos los LLMs actuales."),
        q("M1.P3", "¿Cuál es la herramienta de Google que permite hacer preguntas sobre tus propios documentos?",
          ["Google AI Studio", "Vertex AI", "NotebookLM", "Gemini Advanced"], 2,
          "NotebookLM permite cargar documentos propios y hacer preguntas sobre ellos de forma privada."),
        q("M1.P4", "¿Qué se entiende por 'alucinación' en el contexto de los LLMs?",
          ["El modelo genera respuestas muy creativas.", "El modelo produce información incorrecta con aparente confianza.", "El modelo se niega a responder preguntas sensibles.", "El modelo tarda demasiado en responder."], 1,
          "Las alucinaciones son el fenómeno por el cual un LLM genera información factualmente incorrecta presentada con total confianza."),
        q("M1.P5", "¿Cuál de los siguientes es el caso de uso con mayor ROI documentado para IA generativa en empresas?",
          ["Entrenamiento de nuevos modelos", "Redacción y edición de documentos (ahorro ~3h/semana)", "Reemplazo total del departamento de TI", "Generación automática de código sin revisión humana"], 1,
          "La redacción asistida es el caso de uso más adoptado con ROI inmediato, documentado en empresas latinoamericanas."),
      ],
      preguntasSimulacro: [],
    },

    // ── MÓDULO 2 ───────────────────────────────────────────────────────────
    {
      orden: 2,
      nombre: "Prompt Engineering Profesional",
      descripcion:
        "Técnicas avanzadas de diseño de prompts para obtener resultados de calidad profesional con herramientas de IA de Google.",
      porcentajeEnExamen: 25,
      video: {
        url: "https://www.youtube.com/embed/PLACEHOLDER",
        titulo: "Google AI Essentials — Módulo 2: Prompt Engineering",
        duracionMin: 35,
        canal: "Google for Education",
        pendiente: true,
        notas: "GRABACIÓN PROPIA NECESARIA.",
      },
      slidesUrl: undefined,
      lecciones: [
        {
          id: "M2.1",
          orden: 1,
          titulo: "Anatomía de un prompt efectivo",
          duracionLecturaMin: 6,
          contenidoMarkdown: `Un prompt profesional tiene cuatro componentes que Google llama el **framework TASK**:

**T — Task (Tarea):** qué debe hacer el modelo. Debe ser un verbo de acción específico: "redacta", "resume", "analiza", "clasifica", "traduce". Evitar verbos vagos como "ayúdame con" o "dime algo sobre".

**A — Audience (Audiencia):** para quién es la salida. "Para un gerente de ventas sin conocimientos técnicos" produce resultados radicalmente distintos a "para un equipo de ingenieros senior".

**S — Style (Estilo):** tono, formato y extensión esperados. "En formato de tabla comparativa", "en tres párrafos sin tecnicismos", "con bullet points accionables".

**K — Knowledge (Conocimiento de contexto):** información de fondo que el modelo necesita para personalizar la respuesta. Datos de la empresa, restricciones del proyecto, terminología específica del sector.

**Ejemplo completo aplicado:**
*Sin framework:* "Escríbeme un correo sobre la reunión."
*Con framework:* "Redacta (T) un correo profesional para el gerente general de una empresa exportadora ecuatoriana (A) en tono formal y conciso, máximo 150 palabras (S), informando que la reunión del lunes se pospone al miércoles a las 10:00 AM por viaje del director de operaciones (K)."

La diferencia en calidad de salida es consistentemente superior con el segundo formato.`,
        },
        {
          id: "M2.2",
          orden: 2,
          titulo: "Técnicas avanzadas: Chain of Thought y Few-Shot",
          duracionLecturaMin: 6,
          contenidoMarkdown: `**Zero-Shot prompting:** dar la instrucción sin ejemplos. Funciona bien para tareas generales donde el modelo tiene buen entrenamiento. Ejemplo: "Clasifica este correo como urgente, normal o informativo."

**Few-Shot prompting:** proporcionar 2-5 ejemplos del formato de entrada-salida esperado antes de la consulta real. Dramáticamente superior para formatos específicos, terminología del sector o estilos editoriales propios. Ejemplo: dar 3 ejemplos de cómo tu empresa redacta propuestas antes de pedir que genere la cuarta.

**Chain of Thought (CoT):** instruir al modelo a razonar paso a paso antes de dar la respuesta final. Usar frases como "Piensa paso a paso", "Razona en voz alta antes de concluir" o "Muestra tu proceso de análisis". Aumenta la precisión en tareas de razonamiento, matemáticas y análisis de problemas complejos.

**Prompts de sistema vs. de usuario:** el system prompt define el rol, restricciones y personalidad del modelo de forma persistente. Los prompts de usuario son las instrucciones por sesión. En Gemini Advanced y Google AI Studio puedes configurar ambos.

**Iteración:** el prompting profesional es un proceso iterativo. La primera versión raramente es la final. El patrón es: prompt inicial → evaluar salida → identificar gap → refinar prompt → repetir.`,
        },
        {
          id: "M2.3",
          orden: 3,
          titulo: "Prompting para tareas de negocio en Ecuador",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Redacción comercial:** los prompts más efectivos para contexto ecuatoriano incluyen instrucción explícita de registro formal (tuteo es informal; usted es el estándar en comunicaciones B2B), referencia a normativa local cuando aplica (SRI, IESS, Superintendencia de Compañías) y uso de terminología sectorial específica.

**Análisis financiero con Gemini en Sheets:** la función \`=GEMINI()\` disponible en Google Workspace permite hacer preguntas sobre los datos de la celda en lenguaje natural. Ejemplo: \`=GEMINI("Analiza la tendencia de ventas en este rango: "&A1:A12&" y sugiere dos acciones concretas")\`.

**Resumen de reuniones:** los mejores prompts para transcripciones de Google Meet especifican: (1) listar decisiones tomadas, (2) listar pendientes con responsable y fecha, (3) listar temas no resueltos que requieren seguimiento.

**Generación de código:** para profesionales no técnicos, los prompts más útiles son los que piden código con explicación línea a línea y con instrucciones de cómo ejecutarlo. Añadir "Soy usuario no técnico; explica cada paso como si fuera mi primera vez" mejora dramáticamente la usabilidad.`,
        },
        {
          id: "M2.4",
          orden: 4,
          titulo: "Evaluación y mejora de salidas de IA",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Marco de evaluación CRAAP adaptado para IA:**
- **C — Completitud:** ¿la respuesta cubre todos los aspectos solicitados?
- **R — Relevancia:** ¿la información es pertinente al contexto específico?
- **A — Actualidad:** ¿los datos son recientes? ¿El modelo tiene fecha de corte?
- **A — Autoridad:** ¿las fuentes citadas son verificables y reconocidas?
- **P — Propósito:** ¿la salida cumple el objetivo original del prompt?

**Señales de alerta de baja calidad:**
- Respuestas genéricas que no usan el contexto específico proporcionado
- Estadísticas precisas sin fuente citada
- Contradicciones internas en la misma respuesta
- Lenguaje excesivamente positivo o "agradador" sin sustancia

**Técnica de mejora continua:** llevar un "prompt diary" — un documento donde guardas los prompts que produjeron excelentes resultados para reutilizarlos. Las empresas más avanzadas tienen "prompt libraries" compartidas entre equipos.

**Verificación de hechos:** para datos críticos (financieros, legales, médicos), siempre contrastar la salida con al menos una fuente primaria. Gemini con Grounding conecta automáticamente con Google Search para reducir alucinaciones en temas de actualidad.`,
        },
        {
          id: "M2.5",
          orden: 5,
          titulo: "Construcción de flujos de trabajo con múltiples prompts",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Prompt chaining:** dividir tareas complejas en una secuencia de prompts más simples donde la salida de uno alimenta al siguiente. Ejemplo para análisis competitivo: (1) "Lista los 5 principales competidores de [empresa] en Ecuador" → (2) "Para cada competidor, identifica su propuesta de valor principal" → (3) "Compara sus precios con los nuestros y sugiere un posicionamiento" → (4) "Redacta un resumen ejecutivo de 200 palabras para el directorio."

**Templates de prompt reutilizables:** crear plantillas con variables en corchetes que el equipo puede llenar. Ejemplo: "Redacta un correo de seguimiento para [NOMBRE_CLIENTE] de [EMPRESA] después de nuestra reunión del [FECHA] donde discutimos [TEMAS]. El tono debe ser [TONO] y el objetivo es [OBJETIVO]."

**Integración con Google Apps Script:** permite automatizar prompts recurrentes. Un script puede tomar datos de un Google Sheet, construir un prompt dinámicamente, enviarlo a la API de Gemini y escribir la respuesta en otra columna. No requiere experiencia en programación avanzada; Gemini mismo puede escribir el script.

**Workflows en Workspace:**
1. Reunión en Meet → transcripción automática → prompt de resumen → correo enviado automáticamente
2. Formulario de leads → Sheets → prompt de calificación → asignación al vendedor correcto
3. PDF de contrato → NotebookLM → preguntas de revisión → checklist de cumplimiento`,
        },
      ],
      preguntasPractica: [
        q("M2.P1", "¿Qué significa la 'A' en el framework TASK de Google para prompt engineering?",
          ["Acción (lo que debe hacer el modelo)", "Audiencia (para quién es la salida)", "Análisis (revisar la respuesta)", "API (cómo conectar con el modelo)"], 1,
          "En el framework TASK: T=Task, A=Audience (audiencia), S=Style, K=Knowledge."),
        q("M2.P2", "¿Qué técnica consiste en proporcionar 2-5 ejemplos de entrada-salida antes de la consulta real?",
          ["Zero-Shot prompting", "Chain of Thought", "Few-Shot prompting", "System prompting"], 2,
          "Few-Shot prompting da ejemplos concretos al modelo para que replique el formato y estilo esperado."),
        q("M2.P3", "¿Cuál es el propósito principal de la técnica Chain of Thought?",
          ["Hacer prompts más cortos", "Instruir al modelo a razonar paso a paso para mejorar precisión", "Conectar múltiples APIs de IA", "Acelerar el tiempo de respuesta"], 1,
          "Chain of Thought pide al modelo mostrar su razonamiento, lo que mejora la precisión en tareas complejas."),
        q("M2.P4", "Al evaluar una salida de IA, ¿cuál es una señal de alerta de baja calidad?",
          ["La respuesta es más larga de lo esperado.", "La respuesta incluye estadísticas precisas sin citar fuente.", "La respuesta usa lenguaje técnico.", "La respuesta sugiere alternativas al enfoque solicitado."], 1,
          "Estadísticas precisas sin fuente son una señal de posible alucinación; siempre verificar con fuentes primarias."),
        q("M2.P5", "¿Qué es el 'prompt chaining'?",
          ["Usar el mismo prompt en varios modelos simultáneamente.", "Dividir tareas complejas en secuencia de prompts donde la salida de uno alimenta al siguiente.", "Conectar prompts de distintos usuarios en una misma sesión.", "Guardar prompts en una base de datos."], 1,
          "El prompt chaining descompone tareas complejas en pasos manejables, mejorando la calidad total del resultado."),
      ],
      preguntasSimulacro: [],
    },

    // ── MÓDULO 3 ───────────────────────────────────────────────────────────
    {
      orden: 3,
      nombre: "IA Responsable",
      descripcion:
        "Principios de uso ético de la IA, sesgos algorítmicos, privacidad y las políticas de IA responsable de Google.",
      porcentajeEnExamen: 25,
      video: {
        url: "https://www.youtube.com/embed/PLACEHOLDER",
        titulo: "Google AI Essentials — Módulo 3: IA Responsable",
        duracionMin: 30,
        canal: "Google for Education",
        pendiente: true,
        notas: "GRABACIÓN PROPIA NECESARIA.",
      },
      slidesUrl: undefined,
      lecciones: [
        {
          id: "M3.1",
          orden: 1,
          titulo: "Los 7 principios de IA de Google",
          duracionLecturaMin: 5,
          contenidoMarkdown: `Google publicó en 2018 sus **7 principios de IA** que guían el desarrollo de todos sus productos. Estos son: (1) ser socialmente beneficiosa, (2) evitar crear o reforzar sesgos injustos, (3) construirse y probarse para la seguridad, (4) ser responsable ante las personas, (5) incorporar principios de privacidad, (6) mantener estándares científicos de excelencia, y (7) ponerse a disposición para usos que estén de acuerdo con estos principios.

Adicionalmente, Google definió **aplicaciones que no desarrollará con IA:** tecnologías que causen daño general, armas o tecnología de vigilancia masiva contraria a normas internacionales, sistemas de IA que violen el derecho internacional, entre otras.

Para el profesional certificado, la implicación práctica es: al desplegar IA en una organización, verificar que el uso sea consistente con al menos estos 7 criterios antes de producción.`,
        },
        {
          id: "M3.2",
          orden: 2,
          titulo: "Sesgos en IA y cómo mitigarlos",
          duracionLecturaMin: 6,
          contenidoMarkdown: `Los **sesgos algorítmicos** emergen de tres fuentes principales: (1) datos de entrenamiento que sobrerrepresentan ciertos grupos, (2) decisiones de diseño del equipo de desarrollo, y (3) retroalimentación de usuarios que refuerza patrones existentes.

**Tipos de sesgo más comunes:**
- **Sesgo de representación:** el modelo rinde peor para grupos subrepresentados en datos. Ej: sistemas de reconocimiento facial con menor precisión en personas de piel oscura.
- **Sesgo de confirmación automatizado:** el modelo refuerza creencias previas del usuario porque aprendió de datos donde esos patrones dominaban.
- **Sesgo de automatización:** tendencia humana a confiar excesivamente en la salida de la IA sin revisión crítica.

**Estrategias de mitigación:**
- Auditar datasets por representación demográfica antes de entrenar
- Usar métricas de equidad (fairness metrics) en la evaluación del modelo
- Implementar revisión humana en decisiones de alto impacto (crédito, empleo, salud)
- Documentar limitaciones conocidas del modelo en producción`,
        },
        {
          id: "M3.3",
          orden: 3,
          titulo: "Privacidad, datos y confidencialidad",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Regla de oro:** nunca ingresar en un modelo público información que no pondrías en un correo no cifrado. Esto incluye: datos personales de clientes (nombres, cédulas, historial médico), secretos comerciales, contratos en negociación, datos financieros no públicos, credenciales de acceso.

**Google Workspace y privacidad:** los datos ingresados en Gemini for Workspace con licencia empresarial (Google Workspace Business/Enterprise) NO se usan para entrenar modelos según los términos de servicio vigentes. Verificar siempre la versión de la licencia antes de procesar datos sensibles.

**Marco legal Ecuador:** la Ley Orgánica de Protección de Datos Personales (LOPDP) vigente desde 2021 establece obligaciones para quienes traten datos de ciudadanos ecuatorianos. El uso de herramientas de IA que procesan datos personales requiere: base legal (consentimiento u otra), medidas técnicas adecuadas, y registro en el Catálogo Nacional de Datos.

**Privacidad diferencial:** técnica avanzada usada por Google donde se añade ruido matemático calculado a los datos de entrenamiento para imposibilitar la reconstrucción de información individual. Transparente para el usuario pero fundamental para auditorías de cumplimiento.`,
        },
        {
          id: "M3.4",
          orden: 4,
          titulo: "Transparencia y explicabilidad",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Explicabilidad (XAI):** capacidad de entender por qué un modelo tomó una decisión específica. Crítico en sectores regulados (banca, salud, justicia) donde la decisión automatizada debe ser auditable.

**Niveles de transparencia:**
- **Transparencia de datos:** publicar qué datos se usaron para entrenar el modelo
- **Transparencia de modelo:** documentar la arquitectura, hiperparámetros y métricas de evaluación
- **Transparencia de decisión:** explicar, para cada decisión individual, qué factores la determinaron

**Google Model Cards:** formato estándar de documentación que Google propone para cualquier modelo en producción. Incluye: propósito, métricas de rendimiento por subgrupo, limitaciones conocidas y consideraciones éticas.

**Para el profesional no técnico:** la transparencia se implementa principalmente a través de políticas claras de comunicación a los usuarios afectados por sistemas de IA. Cuando un sistema toma una decisión que afecta a una persona (aprobación de crédito, puntuación de riesgo), esa persona debe ser informada y tener mecanismo de apelación humana.`,
        },
        {
          id: "M3.5",
          orden: 5,
          titulo: "Gobernanza de IA en organizaciones",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Marco de gobernanza de IA** para organizaciones medianas en Ecuador:

1. **Política de uso aceptable:** definir qué herramientas de IA están autorizadas, para qué casos de uso, con qué datos
2. **Clasificación de decisiones:** categorizar decisiones automatizadas por nivel de riesgo (bajo/medio/alto) y definir nivel de supervisión humana requerido
3. **Registro de sistemas de IA:** inventario actualizado de todos los modelos y herramientas de IA en uso, con responsable asignado
4. **Proceso de revisión:** auditoría semestral de salidas y sesgos para sistemas en producción
5. **Capacitación continua:** todos los empleados que usan herramientas de IA deben completar formación básica en uso responsable

**Roles clave:**
- **AI Champion:** promotor interno de adopción responsable (no requiere perfil técnico)
- **AI Risk Officer:** responsable de evaluar riesgos antes de despliegue
- **Data Steward:** custodio de calidad y gobernanza de datos de entrenamiento

**Regulación emergente:** la Unión Europea aprobó el AI Act en 2024, primer marco regulatorio integral de IA a nivel mundial. Aunque Ecuador no tiene regulación equivalente, las empresas exportadoras a mercados europeos deben considerar sus implicaciones.`,
        },
      ],
      preguntasPractica: [
        q("M3.P1", "¿Cuántos principios de IA publicó Google en 2018?",
          ["5", "7", "10", "3"], 1,
          "Google publicó 7 principios de IA en 2018 que guían el desarrollo de todos sus productos."),
        q("M3.P2", "¿Cuál es el tipo de sesgo que surge cuando el modelo rinde peor para grupos subrepresentados en datos de entrenamiento?",
          ["Sesgo de confirmación", "Sesgo de representación", "Sesgo de automatización", "Sesgo de selección"], 1,
          "El sesgo de representación ocurre cuando ciertos grupos están subrepresentados en los datos de entrenamiento."),
        q("M3.P3", "Según la Ley Orgánica de Protección de Datos Personales de Ecuador (LOPDP), ¿qué se requiere para tratar datos personales con IA?",
          ["Solo autorización del CEO de la empresa.", "Base legal (consentimiento u otra), medidas técnicas y registro en el Catálogo Nacional.", "Ningún requisito si la IA es de un proveedor internacional.", "Solo un aviso de privacidad en la web."], 1,
          "La LOPDP requiere base legal, medidas técnicas adecuadas y registro en el Catálogo Nacional de Datos."),
        q("M3.P4", "¿Qué son los Google Model Cards?",
          ["Tarjetas físicas de certificación de Google.", "Formato estándar de documentación de modelos que incluye propósito, métricas y limitaciones.", "Planes de precios para la API de Gemini.", "Reportes de auditoría de seguridad de Google Cloud."], 1,
          "Los Model Cards son documentación estandarizada que Google propone para transparencia de modelos en producción."),
        q("M3.P5", "¿Cuál es la 'regla de oro' de privacidad al usar herramientas de IA generativa?",
          ["Usar solo herramientas de código abierto.", "Nunca ingresar información que no pondrías en un correo no cifrado.", "Siempre revisar la salida antes de publicar.", "Usar VPN al acceder a herramientas de IA."], 1,
          "La regla de oro: si no lo pondrías en un correo no cifrado (datos de clientes, secretos comerciales, credenciales), no lo ingreses en un modelo público."),
      ],
      preguntasSimulacro: [],
    },

    // ── MÓDULO 4 ───────────────────────────────────────────────────────────
    {
      orden: 4,
      nombre: "Aplicaciones Prácticas en Google Workspace",
      descripcion:
        "Uso de Gemini integrado en Gmail, Google Docs, Sheets y Slides para aumentar la productividad profesional.",
      porcentajeEnExamen: 25,
      video: {
        url: "https://www.youtube.com/embed/PLACEHOLDER",
        titulo: "Google AI Essentials — Módulo 4: Gemini en Workspace",
        duracionMin: 35,
        canal: "Google for Education",
        pendiente: true,
        notas: "GRABACIÓN PROPIA NECESARIA. Incluir demo en vivo de cada aplicación.",
      },
      slidesUrl: undefined,
      lecciones: [
        {
          id: "M4.1",
          orden: 1,
          titulo: "Gemini en Gmail: redacción y síntesis de correos",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Gemini en Gmail** ofrece tres funciones principales accesibles desde el botón "Ayúdame a escribir":

**1. Redactar desde cero:** describe en lenguaje natural lo que quieres comunicar y Gemini genera un borrador completo. Para mejores resultados: especificar tono (formal/informal), longitud deseada y objetivo del correo (informar, solicitar, agradecer, negociar).

**2. Refinar borrador existente:** selecciona texto ya escrito y usa las opciones "Formalizar", "Acortar", "Elaborar más" o escribe una instrucción personalizada.

**3. Resumir hilo de conversación:** en hilos largos, el botón "Resumir este correo" genera un resumen ejecutivo de los puntos clave y las acciones pendientes.

**Flujo recomendado para profesionales ecuatorianos:**
1. Abrir Gmail → redactar → clic en estrella/bolígrafo (Gemini)
2. Escribir: "Redacta un correo formal para [CLIENTE] de [EMPRESA] informando que el pedido #[NÚMERO] llegará con 2 días de retraso. Ofrecer descuento del 5% como compensación. Tono: profesional y empático."
3. Revisar borrador → ajustar datos específicos → enviar

**Limitaciones prácticas:** Gemini no tiene acceso a conversaciones anteriores con ese contacto a menos que estés usando el hilo activo. Para personalización profunda, incluir contexto relevante en el prompt.`,
        },
        {
          id: "M4.2",
          orden: 2,
          titulo: "Gemini en Google Docs: escritura asistida",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Gemini en Google Docs** permite generar, transformar y mejorar documentos completos desde el panel lateral o el menú "Ayúdame a escribir".

**Casos de uso más productivos:**
- **Propuestas comerciales:** "Genera una propuesta comercial de 3 páginas para vender servicios de consultoría de IA a una empresa manufacturera mediana en Guayaquil. Incluir: diagnóstico, solución propuesta, metodología y precio referencial."
- **Políticas internas:** "Redacta una política de uso de IA generativa para empleados de una empresa de 50 personas en Ecuador. Incluir qué está permitido, qué está prohibido y el proceso de aprobación."
- **Informes de análisis:** alimentar con datos brutos y pedir resumen ejecutivo estructurado.

**Función "Ayúdame a mejorar":** selecciona cualquier párrafo y elige entre: mejorar redacción, cambiar tono, acortar, expandir o traducir.

**Integración con Drive:** Gemini puede referenciar otros documentos de tu Drive (con tu autorización) para generar contenido coherente con documentos existentes de la empresa. Activar en: Configuración de Workspace → Gemini → Acceso a Drive.`,
        },
        {
          id: "M4.3",
          orden: 3,
          titulo: "Gemini en Google Sheets: análisis con lenguaje natural",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Gemini en Google Sheets** transforma la forma de analizar datos eliminando la barrera de las fórmulas complejas.

**Función principal — panel lateral Gemini:**
Describe qué análisis quieres en lenguaje natural y Gemini genera las fórmulas o tablas necesarias. Ejemplo: "Crea una tabla dinámica que muestre las ventas mensuales por región y calcule el crecimiento mes a mes."

**Fórmulas en lenguaje natural:** en lugar de recordar la sintaxis de BUSCARV, escribe "encuentra el nombre del vendedor cuyo ID está en A2 usando la tabla de la hoja 'Equipo'" y Gemini genera la fórmula correcta.

**Análisis exploratorio automatizado:** selecciona un rango de datos y pide "Identifica los 3 patrones más importantes en estos datos de ventas y sugiere acciones concretas para el próximo trimestre."

**Generación de gráficos:** "Crea un gráfico de barras comparando el rendimiento de los 5 mejores productos por margen de utilidad."

**Caso práctico Ecuador:** análisis de cartera de cobros, comparación de proveedores por precio y tiempo de entrega, seguimiento de KPIs de ventas por canal (presencial, e-commerce, WhatsApp).`,
        },
        {
          id: "M4.4",
          orden: 4,
          titulo: "Gemini en Google Slides: presentaciones inteligentes",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Gemini en Google Slides** permite generar presentaciones completas desde un outline o documento existente.

**Flujo de creación completo:**
1. En Google Docs, redactar el outline o contenido de la presentación
2. En Slides: "Archivo → Importar desde Docs" o usar Gemini panel lateral
3. Prompt: "Crea una presentación de 10 diapositivas sobre [TEMA] para [AUDIENCIA]. La primera diapositiva es el título, la última es un llamado a la acción."

**Herramientas de mejora slide por slide:**
- "Mejora el texto de esta diapositiva para que sea más impactante"
- "Genera una imagen ilustrativa para esta diapositiva sobre [TEMA]" (Imagen por IA integrada)
- "Sugiere datos estadísticos para respaldar este punto" (con Grounding activado)

**Speaker notes automatizadas:** selecciona una diapositiva → Gemini → "Genera notas del presentador con los puntos clave a ampliar verbalmente."

**Integración con datos de Sheets:** vincular un gráfico de Sheets a la presentación y activar "Actualizar automáticamente" para que la presentación siempre refleje los últimos datos.

**Limitaciones:** la generación de imágenes por IA requiere licencia Workspace Business o superior. La calidad de diseño depende de la plantilla base elegida.`,
        },
        {
          id: "M4.5",
          orden: 5,
          titulo: "Flujos de trabajo integrados y automatización en Workspace",
          duracionLecturaMin: 6,
          contenidoMarkdown: `**Los tres flujos de trabajo más productivos con Gemini en Workspace:**

**Flujo 1 — Ciclo de reunión inteligente:**
Meet (grabación + transcripción automática) → Gemini resume en Docs (decisiones + pendientes + próximos pasos) → correo automático de seguimiento a participantes vía Gmail → tarea en Google Tasks o Calendar.

**Flujo 2 — Pipeline de propuestas comerciales:**
Formulario de lead (Google Forms) → datos en Sheets → Gemini califica lead según criterios predefinidos → genera borrador de propuesta personalizada en Docs → envía por Gmail con seguimiento programado.

**Flujo 3 — Análisis competitivo periódico:**
Script programado en Apps Script → llama API Gemini con búsqueda web (Grounding) → genera informe de novedades del sector en Docs → envía por correo al equipo directivo.

**Google Apps Script + Gemini API:**
\`\`\`javascript
function generarResumenDiario() {
  const datos = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  const prompt = "Analiza estas ventas del día y genera un resumen ejecutivo: " + JSON.stringify(datos);
  const respuesta = llamarGeminiAPI(prompt);
  GmailApp.sendEmail("gerencia@empresa.com", "Resumen diario de ventas", respuesta);
}
\`\`\`

**ROI documentado de Workspace AI:** según Google, las organizaciones que implementan Gemini for Workspace reportan en promedio: 26% de reducción en tiempo de redacción de correos, 41% de reducción en tiempo de preparación de reuniones, y 35% de reducción en tiempo de análisis de datos.`,
        },
      ],
      preguntasPractica: [
        q("M4.P1", "¿Qué función de Gemini en Gmail permite obtener los puntos clave y acciones pendientes de un hilo largo de correos?",
          ["Ayúdame a escribir", "Resumir este correo", "Formalizar", "Traducir hilo"], 1,
          "'Resumir este correo' genera un resumen ejecutivo de hilos largos con puntos clave y acciones pendientes."),
        q("M4.P2", "En Google Sheets, ¿cómo permite Gemini crear fórmulas sin recordar su sintaxis exacta?",
          ["Copiando fórmulas de otros documentos automáticamente.", "Describiendo en lenguaje natural lo que se quiere calcular.", "Usando plantillas prediseñadas de fórmulas.", "Conectando con Excel automáticamente."], 1,
          "Gemini en Sheets permite describir el análisis deseado en lenguaje natural y genera la fórmula correspondiente."),
        q("M4.P3", "¿Qué licencia de Google Workspace se requiere para usar la generación de imágenes por IA en Slides?",
          ["Cualquier cuenta de Gmail gratuita", "Google Workspace Starter", "Google Workspace Business o superior", "Solo disponible para cuentas educativas"], 2,
          "La generación de imágenes por IA en Slides requiere licencia Google Workspace Business o superior."),
        q("M4.P4", "¿Qué herramienta de Google Workspace permite automatizar flujos completos conectando Gmail, Sheets y Gemini API?",
          ["Google Forms", "Google Apps Script", "Google Sites", "Google Classroom"], 1,
          "Google Apps Script es el entorno de scripting que conecta todas las aplicaciones de Workspace con APIs externas."),
        q("M4.P5", "Según datos de Google, ¿cuánto se reduce en promedio el tiempo de preparación de reuniones con Gemini for Workspace?",
          ["10%", "26%", "41%", "35%"], 2,
          "Google reporta 41% de reducción en tiempo de preparación de reuniones con Gemini for Workspace."),
      ],
      preguntasSimulacro: [],
    },
  ],
};

// ── Construcción del banco de simulacro ────────────────────────────────────
googleAiEssentialsData.dominios.forEach((dominio) => {
  dominio.preguntasSimulacro = [...dominio.preguntasPractica];
});

// ── Lookup por slug ─────────────────────────────────────────────────────────

export const certificacionesData: Record<string, CertificacionData> = {
  "google-ai-essentials": googleAiEssentialsData,
};

export function getCertificacionData(slug: string): CertificacionData | null {
  return certificacionesData[slug] ?? null;
}
