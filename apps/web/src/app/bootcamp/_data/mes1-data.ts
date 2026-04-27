// ─── BOOTCAMP INTENSIVO DE IA — Mes 1 (16 sesiones) ─────────────────────────
// Programa: Bootcamp Intensivo de IA — ITSEIA
// Mes 1: Fundamentos de IA + Prompt Engineering + Automatización + Proyecto Integrador
// Patrón replicado de cursos-mdt/c1-data.ts (validado).
// Pendiente: videoEmbed YouTube (skill /buscar-videos) y slidesUrl Gamma (script en content/).

export interface QuizQuestion {
  pregunta: string;
  opciones: string[];
  respuesta: number; // index 0-3
  explicacion: string;
}

export interface Recurso {
  titulo: string;
  url: string;
  tipo: "documentacion" | "herramienta" | "lectura";
  descripcion?: string;
}

export interface PresentacionSlide {
  titulo: string;
  contenido: string;
}

/** URL de presentación generada en Gamma (https://gamma.app/docs/...) */
export type GammaUrl = string;

export interface EjercicioCriterio {
  criterio: string;
  puntos: number;
}

export interface SesionBootcamp {
  id: number;
  titulo: string;
  modulo: string;
  moduloNum: number;
  videoEmbed: string;
  videoTitulo: string;
  videoDuracion?: string;
  teoria: string;
  /** URL de la presentación Gamma (preferido sobre presentacionSlides) */
  slidesUrl?: GammaUrl;
  /** Fallback inline cuando no hay Gamma URL */
  presentacionSlides: PresentacionSlide[];
  quiz: QuizQuestion[];
  ejercicio: {
    titulo?: string;
    objetivo: string;
    herramientas: string;
    datosEjemplo?: string;
    pasos: string[];
    resultado: string;
    criterios?: EjercicioCriterio[];
  };
  recursos: Recurso[];
}

export const BOOTCAMP_MES1_MODULOS = [
  { num: 1, nombre: "Fundamentos de IA", horas: 8, sesiones: 4 },
  { num: 2, nombre: "Prompt Engineering", horas: 8, sesiones: 4 },
  { num: 3, nombre: "Automatización con IA", horas: 8, sesiones: 4 },
  { num: 4, nombre: "Proyecto Integrador del Mes", horas: 8, sesiones: 4 },
];

const MOD1 = "Fundamentos de IA";
const MOD2 = "Prompt Engineering";
const MOD3 = "Automatización con IA";
const MOD4 = "Proyecto Integrador del Mes";

// ─── MÓDULO 1: Fundamentos de IA (Sesiones 1-4) ─────────────────────────────

const sesion1: SesionBootcamp = {
  id: 1,
  titulo: "Bienvenida + ¿Qué es realmente la Inteligencia Artificial?",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "",
  videoTitulo: "Qué es la Inteligencia Artificial — Bienvenida al Bootcamp ITSEIA",
  slidesUrl: "https://gamma.app/docs/ah21inbb2w2fn3p",
  teoria: `La Inteligencia Artificial es, en su definición operativa más útil, todo software que ejecuta tareas que antes requerían inteligencia humana. Esta definición evita el debate filosófico sobre conciencia y se enfoca en lo único que importa al profesional: capacidad de ejecutar trabajo cognitivo. Cuando un sistema lee un correo, lo entiende y responde con criterio, está haciendo IA. Cuando una hoja de cálculo aplica una fórmula, no.

La historia reciente ha visto tres olas de IA. La primera, en los años ochenta, fueron los sistemas expertos: programas que codificaban reglas escritas por humanos en formato SI-ENTONCES. Funcionaban bien en dominios cerrados como diagnóstico médico, pero eran frágiles fuera de su área. La segunda ola, en los años dos mil, fue el Machine Learning estadístico: en lugar de programar reglas, los sistemas aprendían patrones a partir de grandes volúmenes de datos. Esto permitió detección de fraude, recomendaciones de Netflix y traducción automática decente. La tercera ola, que arranca con los Transformers en 2017 y explota públicamente con ChatGPT en noviembre de 2022, es la era del Deep Learning a gran escala y los Modelos de Lenguaje Grande (LLMs).

Lo que hace distinta a esta ola actual es la generalidad. Los modelos de la primera y segunda ola eran especialistas: uno para fraude, otro para traducción, otro para imágenes. Los LLMs actuales (GPT-4, Claude Opus, Gemini Pro) son generalistas: el mismo modelo redacta un correo legal, resume una reunión, escribe código en Python y traduce del quechua al inglés. Esta generalidad cambia la economía del trabajo intelectual.

Es vital distinguir cuatro conceptos que se confunden a diario. La IA tradicional incluye sistemas de reglas y búsqueda. El Machine Learning es un subcampo de la IA donde el sistema aprende de datos. El Deep Learning es un subcampo del ML que usa redes neuronales con muchas capas. La IA generativa es una aplicación del Deep Learning que produce contenido nuevo (texto, imagen, audio, video). Todo ChatGPT es IA generativa, todo lo generativo es Deep Learning, todo Deep Learning es Machine Learning, todo ML es IA — pero no al revés.

El modelo iceberg ayuda a entender lo que hay detrás de una herramienta como ChatGPT. En la superficie, una caja de chat. Debajo: el modelo (GPT-4, con cientos de miles de millones de parámetros), los datos de entrenamiento (gran parte de internet hasta una fecha de corte), la infraestructura (decenas de miles de GPUs Nvidia H100), el costo energético (entrenar GPT-4 consumió electricidad equivalente a una ciudad de cien mil habitantes durante meses), los humanos en el loop (miles de anotadores haciendo RLHF en países como Filipinas y Kenia), y las salvaguardas (filtros de contenido, guardrails legales).

En Ecuador la adopción avanza pero con criterio mixto. Según ANDIPYME en 2026, alrededor del 41 por ciento de las empresas ecuatorianas usa alguna forma de IA — desde un asistente virtual de WhatsApp hasta scoring crediticio. Sin embargo, solo el 8 por ciento la implementa con criterio: con políticas claras, métricas de retorno y revisión humana de salidas. Esa brecha entre "usar IA" e "implementarla bien" es exactamente la oportunidad profesional que este bootcamp prepara a explotar.

Los mitos más frecuentes en el contexto laboral ecuatoriano son cinco: que la IA va a reemplazar todos los trabajos (la realidad es que transforma roles, no los elimina en bloque), que es solo para programadores (cualquier profesional puede usarla productivamente), que es infalible (alucina, sesga y falla con regularidad), que es gratis (los modelos serios cuestan), y que es algo nuevo (lleva más de setenta años de evolución). Desmontar estos cinco mitos es el primer entregable mental de este módulo.

Al final de esta sesión deberías poder explicar qué es la IA en treinta segundos a un familiar que pregunte, distinguir entre las tres olas históricas, ubicar a los LLMs dentro del mapa conceptual de IA, y reconocer un mito cuando lo escuches en una reunión de trabajo. Estas son las bases sobre las que se construyen las quince sesiones siguientes del Mes 1.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Bienvenida al Bootcamp Intensivo de IA\nMes 1 — Sesión 1\nITSEIA — Instituto Ecuatoriano de Inteligencia Artificial" },
    { titulo: "Qué aprenderás hoy", contenido: "• Definición operativa de IA\n• Las tres olas históricas\n• Diferencia entre IA, ML, Deep Learning e IA generativa\n• El modelo iceberg de ChatGPT\n• 5 mitos sobre IA en Ecuador" },
    { titulo: "Definición operativa", contenido: "IA: todo software que ejecuta tareas que antes requerían inteligencia humana.\n\nNo es debate filosófico. Es capacidad de ejecutar trabajo cognitivo." },
    { titulo: "Las tres olas de la IA", contenido: "1980: Sistemas expertos (reglas SI-ENTONCES)\n2000: Machine Learning estadístico\n2017+: Deep Learning + Transformers\n2022: ChatGPT explota al público" },
    { titulo: "Mapa conceptual", contenido: "IA ⊃ Machine Learning ⊃ Deep Learning ⊃ IA Generativa\n\nChatGPT está en el centro: es IA generativa." },
    { titulo: "El iceberg de ChatGPT", contenido: "Visible: la caja de chat\nDebajo: modelo, datos, GPUs, energía, anotadores humanos, guardrails" },
    { titulo: "IA en Ecuador 2026", contenido: "41% de empresas usan IA\nSolo 8% la implementa con criterio\n\nAhí está la oportunidad profesional." },
    { titulo: "5 mitos a desmontar", contenido: "1. Reemplaza todos los trabajos\n2. Solo para programadores\n3. Es infalible\n4. Es gratis\n5. Es algo nuevo" },
    { titulo: "Próxima sesión", contenido: "1.2 — Anatomía de un LLM: cómo funcionan ChatGPT, Claude y Gemini\n\nitseia.ai" },
  ],
  quiz: [
    { pregunta: "¿Cuál es la definición operativa de IA usada en este bootcamp?", opciones: ["Software que tiene conciencia", "Software que ejecuta tareas que antes requerían inteligencia humana", "Cualquier programa de computadora", "Solo redes neuronales profundas"], respuesta: 1, explicacion: "La definición operativa evita debates filosóficos y se enfoca en capacidad de ejecutar trabajo cognitivo." },
    { pregunta: "¿En qué año explotó ChatGPT al público masivo?", opciones: ["2017", "2020", "Noviembre de 2022", "2024"], respuesta: 2, explicacion: "ChatGPT se lanzó al público en noviembre de 2022 y alcanzó cien millones de usuarios en dos meses." },
    { pregunta: "¿Cuál es la relación correcta entre conceptos?", opciones: ["IA generativa ⊃ Deep Learning ⊃ ML ⊃ IA", "IA ⊃ ML ⊃ Deep Learning ⊃ IA generativa", "ML ⊃ IA ⊃ Deep Learning ⊃ IA generativa", "Son conceptos independientes"], respuesta: 1, explicacion: "La IA contiene al ML, que contiene al Deep Learning, que contiene a la IA generativa." },
    { pregunta: "Según ANDIPYME 2026, ¿qué porcentaje de empresas ecuatorianas implementa IA con criterio?", opciones: ["41%", "25%", "8%", "60%"], respuesta: 2, explicacion: "Aunque el 41% usa IA, solo el 8% la implementa con criterio: políticas, métricas y revisión humana." },
    { pregunta: "¿Cuál de estos NO es un mito sobre la IA según la sesión?", opciones: ["La IA va a reemplazar todos los trabajos", "La IA es solo para programadores", "La IA puede alucinar y fallar", "La IA es algo nuevo"], respuesta: 2, explicacion: "Que la IA puede alucinar y fallar es un hecho real, no un mito. Los otros cuatro sí son mitos comunes." },
  ],
  ejercicio: {
    titulo: "Mi sector y la IA",
    objetivo: "Documentar en una página cómo la IA podría transformar tu trabajo diario, identificando 5 tareas repetitivas y eligiendo la primera a automatizar con criterio.",
    herramientas: "Google Docs o Notion + ChatGPT (plan gratuito) para investigación complementaria",
    datosEjemplo: "Sectores ecuatorianos sugeridos: banca, agro (banano, flores), salud privada, educación, retail, logística, construcción, gobierno municipal, exportación, turismo.",
    pasos: [
      "Define en 3 frases qué hace tu empresa o área dentro de tu organización",
      "Lista las 5 tareas más repetitivas que haces en una semana laboral típica",
      "Para cada tarea documenta: tiempo semanal invertido, valor agregado real, frecuencia",
      "Investiga en internet si existe ya un caso de uso de IA en tu sector en Ecuador o LATAM",
      "Elige UNA tarea candidata a automatizar o asistir con IA y justifica por qué",
      "Calcula el ROI mensual estimado: horas ahorradas × tu costo hora × 4 semanas",
      "Entrega el documento de máximo 1 página en formato PDF",
    ],
    resultado: "Documento de 1 página con: descripción del sector, 5 tareas mapeadas, 1 tarea candidata elegida, ROI estimado y referencia a un caso real de IA en tu industria.",
    criterios: [
      { criterio: "Claridad de la descripción del sector y rol", puntos: 20 },
      { criterio: "Calidad del mapeo de las 5 tareas (tiempo, valor, frecuencia)", puntos: 25 },
      { criterio: "Criterio en la elección de la tarea candidata", puntos: 20 },
      { criterio: "Cálculo de ROI fundamentado", puntos: 20 },
      { criterio: "Referencia a caso real verificable de IA en el sector", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "Stanford AI Index 2024", url: "https://aiindex.stanford.edu/report/", tipo: "documentacion", descripcion: "Reporte anual oficial del Stanford HAI con datos globales sobre adopción y avances de IA." },
    { titulo: "Anthropic — Introduction to AI", url: "https://docs.anthropic.com/en/docs/intro", tipo: "documentacion", descripcion: "Documentación oficial de Anthropic sobre conceptos fundamentales de IA y LLMs." },
    { titulo: "ChatGPT (OpenAI)", url: "https://chat.openai.com/", tipo: "herramienta", descripcion: "Plataforma gratuita para empezar a interactuar con un LLM en español." },
    { titulo: "Claude.ai (Anthropic)", url: "https://claude.ai/", tipo: "herramienta", descripcion: "LLM de Anthropic con plan gratuito. Excelente para tareas largas y razonamiento." },
    { titulo: "Co-Intelligence — Ethan Mollick", url: "https://www.oneusefulthing.org/", tipo: "lectura", descripcion: "Blog de Ethan Mollick (Wharton) con casos prácticos de IA en el trabajo profesional." },
  ],
};

const sesion2: SesionBootcamp = {
  id: 2,
  titulo: "Anatomía de un LLM: cómo funcionan ChatGPT, Claude y Gemini",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "",
  videoTitulo: "Anatomía de un LLM — Tokens, parámetros y ventana de contexto",
  slidesUrl: "https://gamma.app/docs/9tlnuzz9ko6dbk7",
  teoria: `Para usar un LLM con criterio profesional necesitas entender tres conceptos técnicos clave: token, parámetro y ventana de contexto. Sin estos tres conceptos cualquier conversación sobre costos, límites o calidad será superficial. Con ellos podrás tomar decisiones de arquitectura que ahorren miles de dólares al año.

Un token es la unidad mínima que procesa un LLM. No es una palabra, no es una letra, es algo intermedio. La palabra "ingeniería" se descompone aproximadamente en tres tokens. La palabra "casa" suele ser un solo token. Un párrafo de texto en español de cien palabras consume entre ciento veinte y ciento sesenta tokens. Esto importa por dos razones: los modelos cobran por token (entrada y salida) y tienen un límite máximo de tokens por conversación. Si trabajas a diario con LLMs, deberías saber estimar tokens al ojo igual que estimas tiempo o costo.

Un parámetro es un número interno del modelo que se ajusta durante el entrenamiento. GPT-4 tiene del orden de un billón de parámetros (cifra estimada, OpenAI no lo confirma públicamente). Llama 3.1 viene en versiones de 8B, 70B y 405B parámetros. Más parámetros usualmente significa mayor capacidad, pero también mayor costo de operación y latencia más alta. Para un asistente de correos, un modelo de 8B parámetros bien afinado puede superar a GPT-4 en velocidad y costo. Para razonamiento complejo, los modelos grandes siguen siendo superiores.

La ventana de contexto es cuánto texto puede "ver" el modelo en una sola interacción. Es la suma de tu pregunta, las instrucciones del sistema, el historial de la conversación y la respuesta esperada. GPT-3.5 tenía 4.000 tokens de contexto. GPT-4 Turbo subió a 128.000. Claude Opus 4.5 maneja 200.000 tokens (y un modo extendido de un millón en su API empresarial). Gemini 1.5 Pro presume hasta dos millones de tokens. Doscientos mil tokens son aproximadamente ciento cincuenta mil palabras o trescientas páginas de un libro. Esto cambia los flujos profesionales: ahora puedes resumir un libro completo, leer un expediente legal de doscientas páginas, o cargar todo el código de un microservicio para que la IA lo analice.

La arquitectura Transformer, propuesta en el paper "Attention is All You Need" (Google, 2017), es la base de todos los LLMs comerciales actuales. Sin matemática: el modelo divide el texto en tokens, los convierte en vectores numéricos (embeddings), y mediante un mecanismo llamado atención determina qué tokens son más relevantes para predecir el siguiente. La palabra "atención" tiene un significado técnico aquí: es el peso que cada token le da a otros tokens al calcular su representación. La pila de capas Transformer puede ser de doce, veinticuatro, cuarenta y ocho o más, y dentro de cada capa hay múltiples "cabezas de atención" que aprenden patrones distintos.

La elección entre modelos abiertos y cerrados es estratégica. Cerrados (GPT, Claude, Gemini): mejores en calidad bruta, fácil de empezar, pero tu data viaja al proveedor. Abiertos (Llama, Mistral, Qwen): puedes ejecutarlos en tu servidor, control total de privacidad, pero requieren infraestructura. Para tareas con datos sensibles (legal, salud, banca), un modelo abierto autohospedado puede ser obligatorio por la LOPDP ecuatoriana. Para tareas generales, los cerrados ganan en simplicidad.

El costo por millón de tokens es el dato que cierra cualquier propuesta. En 2026, GPT-4o cuesta alrededor de USD 2.50 por millón de tokens de entrada y USD 10 por millón de tokens de salida. Claude Sonnet 4.5 está en USD 3 entrada y USD 15 salida. Gemini Flash es el más barato, alrededor de USD 0.30 entrada. Un asistente que procese mil correos al día con respuesta promedio de quinientos tokens cuesta entre USD 30 y USD 100 mensuales. Sabiendo estos números puedes vender, presupuestar y optimizar.

Elegir el modelo correcto sigue tres criterios: tarea, presupuesto y privacidad. Para redactar un correo simple: Gemini Flash o GPT-4o-mini. Para un análisis legal complejo: Claude Opus o GPT-4. Para datos confidenciales: Llama autohospedado. Esta decisión, multiplicada por las decenas de tareas que automatizarás, define el costo total de propiedad de tu stack de IA.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Anatomía de un LLM\nMes 1 — Sesión 2\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "Tres conceptos clave", contenido: "1. Token: unidad mínima de procesamiento\n2. Parámetro: número interno aprendido\n3. Ventana de contexto: cuánto texto ve el modelo" },
    { titulo: "Tokens en español", contenido: "ingeniería ≈ 3 tokens\ncasa ≈ 1 token\n100 palabras ≈ 120-160 tokens\n\nImporta para costos y límites." },
    { titulo: "Parámetros", contenido: "GPT-4 ≈ 1 billón\nLlama 3.1: 8B / 70B / 405B\n\nMás parámetros: más capacidad, más costo, más latencia." },
    { titulo: "Ventana de contexto 2026", contenido: "GPT-4 Turbo: 128k\nClaude Opus 4.5: 200k (1M empresarial)\nGemini 1.5 Pro: 2M\n\n200k ≈ 300 páginas de libro" },
    { titulo: "Arquitectura Transformer", contenido: "Paper: Attention is All You Need (Google 2017)\n\nTokens → embeddings → atención → predicción\n\nBase de todos los LLMs comerciales." },
    { titulo: "Abiertos vs cerrados", contenido: "Cerrados (GPT, Claude, Gemini): calidad, facilidad, datos al proveedor.\nAbiertos (Llama, Mistral): control, privacidad, requiere infraestructura." },
    { titulo: "Costos 2026", contenido: "GPT-4o: $2.50 / $10 por M tokens\nClaude Sonnet 4.5: $3 / $15\nGemini Flash: $0.30 / $0.60\n\n1k correos/día ≈ $30-100/mes" },
    { titulo: "Elegir modelo", contenido: "Tarea + Presupuesto + Privacidad\n\nCorreo simple: Gemini Flash\nLegal complejo: Claude Opus\nDatos confidenciales: Llama autohospedado" },
  ],
  quiz: [
    { pregunta: "¿Aproximadamente cuántos tokens tiene la palabra 'ingeniería'?", opciones: ["1", "3", "10", "100"], respuesta: 1, explicacion: "Las palabras largas en español suelen descomponerse en 3 a 4 tokens." },
    { pregunta: "¿Qué define la ventana de contexto de un LLM?", opciones: ["La velocidad de respuesta", "Cuánto texto puede ver el modelo en una sola interacción", "El precio del modelo", "El número de idiomas que soporta"], respuesta: 1, explicacion: "La ventana de contexto incluye prompt, historial, instrucciones y respuesta esperada." },
    { pregunta: "¿Qué arquitectura es la base de los LLMs modernos?", opciones: ["Redes recurrentes (RNN)", "Máquinas de soporte vectorial", "Transformers", "Árboles de decisión"], respuesta: 2, explicacion: "Los Transformers, introducidos por Google en 2017, son la base de GPT, Claude y Gemini." },
    { pregunta: "¿Cuál es la principal ventaja de un modelo abierto autohospedado para una empresa de salud en Ecuador?", opciones: ["Es gratis", "Cumple con la LOPDP al no enviar datos a terceros", "Es siempre más rápido", "No alucina nunca"], respuesta: 1, explicacion: "Los datos médicos no pueden salir del país sin consentimiento explícito según la LOPDP." },
    { pregunta: "Si un asistente procesa 1.000 correos al día con 500 tokens de salida promedio en GPT-4o, ¿cuál es el orden de magnitud del costo mensual?", opciones: ["USD 1 a 5", "USD 30 a 100", "USD 1.000 a 5.000", "USD 10.000+"], respuesta: 1, explicacion: "30 días × 1.000 correos × 500 tokens × $10/M tokens ≈ USD 150, en el rango de $30-100 si considerás cache y prompts cortos." },
  ],
  ejercicio: {
    titulo: "Comparativa práctica de tres LLMs",
    objetivo: "Tomar la misma consulta profesional ecuatoriana y ejecutarla en ChatGPT, Claude y Gemini, entregando una tabla comparativa con criterios de calidad, velocidad y elección final.",
    herramientas: "ChatGPT (chat.openai.com) + Claude.ai + Google AI Studio (aistudio.google.com) + Google Sheets",
    datosEjemplo: "Consulta sugerida: 'Redacta un acta de finiquito laboral para un trabajador con 5 años de antigüedad, salario USD 800 y desahucio según el Código del Trabajo del Ecuador. Incluye liquidación de décimo tercero, décimo cuarto, vacaciones no gozadas y bonificación por desahucio.'",
    pasos: [
      "Crea cuenta gratuita en ChatGPT, Claude.ai y Google AI Studio",
      "Define una consulta profesional real de tu sector con suficiente complejidad",
      "Ejecuta la misma consulta en los tres modelos sin modificarla",
      "Documenta tiempo de respuesta, longitud, calidad percibida (1-10) y errores detectados",
      "Identifica si alguno alucinó datos (cifras inventadas, leyes inexistentes)",
      "Elige el modelo ganador para esa tarea con justificación de tres frases",
      "Repite el ejercicio con una consulta de tipo distinto (creativa vs analítica)",
    ],
    resultado: "Tabla comparativa en Google Sheets con dos consultas, tres modelos, cinco columnas (tiempo, longitud, calidad, errores, ganador) y un párrafo de conclusiones sobre cuándo usar cada uno.",
    criterios: [
      { criterio: "Calidad y relevancia de las consultas elegidas", puntos: 20 },
      { criterio: "Rigor en la documentación (tiempo, errores, alucinaciones)", puntos: 25 },
      { criterio: "Detección de alucinaciones específicas", puntos: 20 },
      { criterio: "Justificación del modelo ganador", puntos: 20 },
      { criterio: "Conclusión accionable sobre cuándo usar cada uno", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "Anthropic — Models Overview", url: "https://docs.anthropic.com/en/docs/about-claude/models", tipo: "documentacion", descripcion: "Documentación oficial sobre los modelos Claude, ventanas de contexto y precios." },
    { titulo: "OpenAI — Pricing", url: "https://openai.com/api/pricing/", tipo: "documentacion", descripcion: "Precios oficiales por millón de tokens de los modelos GPT actualizados." },
    { titulo: "Google AI Studio", url: "https://aistudio.google.com/", tipo: "herramienta", descripcion: "Playground gratuito para probar Gemini Pro y Flash con tu propia API key." },
    { titulo: "Artificial Analysis", url: "https://artificialanalysis.ai/", tipo: "herramienta", descripcion: "Comparador independiente de modelos LLM por velocidad, calidad y precio." },
    { titulo: "The Illustrated Transformer — Jay Alammar", url: "https://jalammar.github.io/illustrated-transformer/", tipo: "lectura", descripcion: "Explicación visual paso a paso de cómo funciona la arquitectura Transformer." },
  ],
};

const sesion3: SesionBootcamp = {
  id: 3,
  titulo: "Mapa de herramientas IA 2026: el ecosistema en una página",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "",
  videoTitulo: "Stack personal IA 2026 — Las 50 herramientas que importan",
  slidesUrl: "https://gamma.app/docs/nczbvnybilbaj4z",
  teoria: `El ecosistema de IA en 2026 supera las cinco mil herramientas listadas en directorios como futurepedia.io. Intentar conocer todas es imposible y contraproducente: el llamado FOMO de herramientas (fear of missing out) lleva a profesionales a saltar de plataforma en plataforma sin profundizar en ninguna. La estrategia ganadora es construir un stack mínimo viable de cinco a ocho herramientas dominadas a fondo, no veinte usadas a medias.

Las herramientas se agrupan en seis categorías funcionales que cubren el noventa y cinco por ciento de los casos de uso profesionales. La primera es conversación general: ChatGPT, Claude y Gemini son los tres pilares; cualquiera funciona como asistente diario, con preferencias personales por estilo de respuesta. La segunda es búsqueda con IA: Perplexity y You.com responden con citas verificables, ideales para investigación que necesita fuentes. La tercera es generación de imagen: Midjourney lidera en estética artística, DALL-E 3 (incluido en ChatGPT Plus) es el más fácil de usar, y Leonardo.ai destaca en imágenes comerciales con plan freemium generoso.

La cuarta categoría es video y voz. Sora de OpenAI y Runway dominan video corto generativo. HeyGen permite crear videos con avatares hablando en español neutro o ecuatoriano, ideal para capacitaciones internas. ElevenLabs lidera clonación de voz: con tres minutos de audio puedes generar tu voz hablando cualquier texto en cualquier idioma. La quinta categoría son los agentes autónomos: Lindy, Manus y Strata (esta última desarrollada por H3L, partner ecuatoriano de ITSEIA) ejecutan tareas multistep con autonomía limitada. La sexta son las herramientas de productividad con IA integrada: Notion AI, Microsoft Copilot, Google Duet — IA dentro de tus aplicaciones existentes sin saltar a otra ventana.

El stack mínimo viable para un profesional ecuatoriano cabe en USD 60 mensuales. La receta probada: ChatGPT Plus (USD 20), Claude Pro (USD 20), Perplexity Pro (USD 20). Con ese trío resuelves redacción, análisis, investigación y creatividad de texto. Si tu trabajo requiere imagen, suma Leonardo o Midjourney (USD 10-30 más). Si requiere video, suma HeyGen o Runway (USD 30-50). El techo recomendado para la mayoría: USD 80 al mes. Más allá de ahí, el retorno marginal cae rápidamente y conviene invertir tiempo en dominar lo que ya tienes.

Pagar suscripciones internacionales desde Ecuador tiene tres caminos prácticos. Primero: tarjeta de crédito internacional Visa o Mastercard de cualquier banco grande (Pichincha, Pacífico, Produbanco). Segundo: tarjeta virtual prepagada como las de Banco del Pacífico o Bee. Tercero: cuenta Wise o PayPal con balance recargado vía transferencia desde tu cuenta nacional. La opción Wise es la más barata por tipo de cambio y la más resiliente cuando los emisores ecuatorianos rechazan transacciones internacionales por validación antifraude.

Las herramientas regionales merecen mención especial. Strata (strata.h3l.ai) opera con nueve mil documentos profesionales y servicio en diecinueve países, con planes desde USD 19.99 al mes — ideal como cerebro digital cuando el contenido es jurídico, contable o de salud en español. ImagemIA, otra empresa ecuatoriana del grupo, aplica IA predictiva en imagenología médica. Existen también asistentes de WhatsApp con IA hechos en Ecuador (Botmaker, BotFlow) que cumplen con la LOPDP por hospedar datos en LATAM.

Evaluar una herramienta nueva en menos de noventa segundos es una habilidad clave para no perder horas en evaluaciones interminables. El checklist mental: documentación (¿hay docs claras o solo videos de marketing?), pricing transparente (¿el plan gratuito permite uso real o es solo demo?), política de datos (¿qué dicen sobre entrenar con tus datos?), soporte hispanohablante (¿hay equipo en LATAM o solo inglés?), y comunidad activa (¿hay reseñas honestas en Reddit, ProductHunt o YouTube?). Si la herramienta falla en tres de cinco, descartar.

El criterio más importante para no caer en el FOMO de herramientas es preguntarte cada vez que veas una tool nueva: ¿qué tarea concreta de mi semana laboral resuelve esto que mi stack actual no resuelve? Si la respuesta es nada o es vago, ignora. Si la respuesta es específica y medible (por ejemplo: reduce mi tiempo de transcripción de reuniones de dos horas a quince minutos), evalúa con seriedad. La disciplina de stack lean te hace más productivo que cualquier nueva herramienta de moda.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Mapa de herramientas IA 2026\nMes 1 — Sesión 3\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "El problema del FOMO", contenido: "5.000+ herramientas en directorios\n\nGanadora: 5-8 dominadas a fondo, no 20 a medias." },
    { titulo: "6 categorías funcionales", contenido: "1. Conversación: GPT, Claude, Gemini\n2. Búsqueda: Perplexity, You.com\n3. Imagen: Midjourney, DALL-E, Leonardo\n4. Video/voz: Sora, HeyGen, ElevenLabs\n5. Agentes: Lindy, Manus, Strata\n6. Productividad: Notion AI, Copilot, Duet" },
    { titulo: "Stack mínimo viable", contenido: "ChatGPT Plus $20\nClaude Pro $20\nPerplexity Pro $20\n\nTotal: USD 60/mes\nTecho recomendado: USD 80/mes" },
    { titulo: "Pagar desde Ecuador", contenido: "1. Tarjeta internacional (Pichincha, Pacífico, Produbanco)\n2. Tarjetas virtuales prepagadas (Bee, Pacífico)\n3. Wise o PayPal con balance recargado\n\nWise: tipo de cambio más barato y resiliente." },
    { titulo: "Herramientas regionales", contenido: "Strata (strata.h3l.ai): 9k docs, 19 países, desde $19.99\nImagemIA: imagenología médica predictiva\nBotmaker, BotFlow: WhatsApp con IA, datos en LATAM (LOPDP)" },
    { titulo: "Evaluar en 90 segundos", contenido: "1. Docs claras\n2. Pricing transparente\n3. Política de datos\n4. Soporte hispanohablante\n5. Comunidad activa\n\nFalla 3/5 → descartar." },
    { titulo: "Anti-FOMO", contenido: "Pregunta clave: ¿qué tarea concreta resuelve esto que mi stack actual no?\n\nSi vago: ignora.\nSi específico y medible: evalúa." },
    { titulo: "Próxima sesión", contenido: "1.4 — Riesgos, ética y marco legal de la IA en Ecuador\n\nitseia.ai" },
  ],
  quiz: [
    { pregunta: "¿Cuál es el techo recomendado de gasto mensual para un stack personal de IA?", opciones: ["USD 20", "USD 80", "USD 200", "USD 500"], respuesta: 1, explicacion: "Más allá de USD 80 mensuales el retorno marginal cae rápidamente; conviene dominar lo que ya tienes." },
    { pregunta: "¿Cuál de estas NO es una de las 6 categorías funcionales?", opciones: ["Conversación general", "Búsqueda con IA", "Antivirus con IA", "Generación de imagen"], respuesta: 2, explicacion: "Antivirus con IA no es una de las 6 categorías base del stack profesional discutidas." },
    { pregunta: "¿Qué herramienta lidera en clonación de voz en español?", opciones: ["Midjourney", "ElevenLabs", "Perplexity", "Notion AI"], respuesta: 1, explicacion: "ElevenLabs permite clonar tu voz con solo tres minutos de audio en cualquier idioma." },
    { pregunta: "¿Cuál es el método más barato y resiliente para pagar suscripciones desde Ecuador?", opciones: ["Tarjeta de crédito directa", "Wise con balance recargado", "Western Union", "Transferencia SWIFT"], respuesta: 1, explicacion: "Wise ofrece el mejor tipo de cambio y resiste mejor los rechazos antifraude de bancos ecuatorianos." },
    { pregunta: "Al evaluar una herramienta nueva, si falla en 3 de 5 criterios del checklist, ¿qué debes hacer?", opciones: ["Probarla un mes", "Descartar", "Comprar el plan empresarial", "Pedir descuento"], respuesta: 1, explicacion: "La disciplina de stack lean dicta descartar herramientas que no cumplan al menos 3 de los 5 criterios mínimos." },
  ],
  ejercicio: {
    titulo: "Mi stack personal IA 2026",
    objetivo: "Diseñar y documentar tu stack personal de IA con presupuesto máximo de USD 80 mensuales, cubriendo las categorías relevantes a tu rol profesional.",
    herramientas: "Notion o Google Docs + acceso a planes gratuitos de las herramientas a evaluar",
    datosEjemplo: "Roles tipo en Ecuador: vendedor B2B, abogado independiente, contador de PYME, médico privado, profesor universitario, gerente de marketing, ingeniero civil, agricultor exportador.",
    pasos: [
      "Define tu rol profesional y las 3 tareas más demandantes de tu semana",
      "Identifica qué categorías del stack necesitas (mínimo conversación, máximo las 6)",
      "Investiga 2-3 opciones por categoría leyendo docs, no solo videos de marketing",
      "Aplica el checklist de 5 criterios a cada candidata y descarta las que fallan en 3+",
      "Construye tabla con: categoría, herramienta elegida, costo mensual, justificación (1-2 frases), tarea que resuelve",
      "Verifica que el total mensual no supere USD 80",
      "Agrega una sección de 'no incluyo' con 3 herramientas populares que descartaste y por qué",
    ],
    resultado: "Documento de 1 página con tabla del stack final, costo total mensual, método de pago elegido para Ecuador, y sección de descartes justificados.",
    criterios: [
      { criterio: "Coherencia entre rol, tareas y herramientas elegidas", puntos: 25 },
      { criterio: "Aplicación rigurosa del checklist de 5 criterios", puntos: 20 },
      { criterio: "Cumplimiento del techo de USD 80 mensuales", puntos: 15 },
      { criterio: "Calidad de las justificaciones (no genéricas)", puntos: 20 },
      { criterio: "Sección de descartes con razonamiento accionable", puntos: 20 },
    ],
  },
  recursos: [
    { titulo: "Futurepedia — AI Tools Directory", url: "https://www.futurepedia.io/", tipo: "documentacion", descripcion: "Directorio actualizado de más de 5.000 herramientas IA categorizadas." },
    { titulo: "There's An AI For That", url: "https://theresanaiforthat.com/", tipo: "documentacion", descripcion: "Buscador de herramientas IA por caso de uso específico." },
    { titulo: "Perplexity AI", url: "https://www.perplexity.ai/", tipo: "herramienta", descripcion: "Buscador con IA que responde con citas verificables. Plan gratuito generoso." },
    { titulo: "Wise — Cuenta multimoneda", url: "https://wise.com/", tipo: "herramienta", descripcion: "Cuenta digital para pagar suscripciones internacionales con tipo de cambio favorable desde Ecuador." },
    { titulo: "a16z — AI Apps Top 100", url: "https://a16z.com/100-gen-ai-apps/", tipo: "lectura", descripcion: "Reporte trimestral de Andreessen Horowitz con las 100 apps de IA más usadas." },
  ],
};

const sesion4: SesionBootcamp = {
  id: 4,
  titulo: "Riesgos, ética y marco legal de la IA en Ecuador",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "",
  videoTitulo: "Riesgos legales y éticos de la IA — LOPDP Ecuador y casos reales",
  slidesUrl: "https://gamma.app/docs/1bmweatl92et5pj",
  teoria: `Cinco riesgos definen el uso profesional de la IA generativa: alucinación, sesgo, fuga de datos, dependencia y propiedad intelectual. Conocerlos no es paranoia: es competencia profesional. Un abogado que pegó una sentencia inventada por ChatGPT en una corte de Estados Unidos en 2023 fue sancionado y perdió el caso. Casos similares ya ocurren en Latinoamérica.

La alucinación es el riesgo más visible y subestimado. Un LLM siempre produce una respuesta, incluso cuando no sabe. La respuesta suena autoritativa porque el modelo está entrenado para sonar autoritativo, no para reconocer ignorancia. Una alucinación típica: pedirle a ChatGPT jurisprudencia ecuatoriana sobre un caso específico, y recibir cuatro sentencias inventadas con números de gaceta judicial falsos pero verosímiles. Cómo detectarla: nunca confiar en cifras, fechas, nombres propios o citas legales sin verificación independiente. La regla práctica: si vas a usar el dato en algo que importa, verifícalo en la fuente primaria.

El sesgo algorítmico es el riesgo invisible. Los modelos heredan los sesgos de los datos con que se entrenaron. Caso documentado: el sistema de reclutamiento de Amazon penalizaba currículums de mujeres porque históricamente la mayoría de contratados eran hombres. En Ecuador este riesgo es real en scoring crediticio (sesgos contra zonas rurales o ciertos apellidos), atención al cliente (chatbots que entienden mejor cierto registro lingüístico) y selección de personal. Mitigación: auditoría manual de muestras de salidas, supervisión humana de decisiones de alto impacto, datos de entrenamiento balanceados.

La fuga de datos es el riesgo más caro legalmente. Cuando pegas un contrato confidencial en ChatGPT plan gratuito, esos datos pueden ser usados por OpenAI para entrenar futuros modelos según los términos de servicio (las cuentas Plus y Team tienen política distinta). En el contexto de la LOPDP ecuatoriana, esto puede constituir transferencia internacional no autorizada de datos personales — sancionable hasta con uno por ciento de la facturación anual de la empresa. Casos reales: Samsung prohibió ChatGPT internamente tras filtrarse código propietario por uso descuidado de empleados.

La LOPDP, Ley Orgánica de Protección de Datos Personales del Ecuador (Registro Oficial Suplemento 459, 2021), define qué constituye dato personal, cómo debe pedirse consentimiento, qué hacer en transferencia internacional y cuáles son las multas por incumplimiento. Aplicada al uso de IA: si tu asistente procesa nombres, cédulas, correos, direcciones o datos sensibles (salud, biométricos, financieros), debes garantizar consentimiento del titular, hospedaje en jurisdicciones aprobadas y cláusulas de procesador en contratos con proveedores. Strata, ImagemIA y otros proveedores ecuatorianos diseñan sus servicios cumpliendo LOPDP por defecto.

La propiedad intelectual es el riesgo más confuso. ¿Quién es dueño del texto generado por ChatGPT? Posición de OpenAI: tú eres dueño según términos de servicio. Posición de la SENADI Ecuador (Servicio Nacional de Derechos Intelectuales): no hay autoría humana suficiente, no hay protección de derecho de autor automática. Posición de la OMPI a nivel global: sigue debate abierto. Posición práctica: si la IA produjo una pieza creativa importante (logo, jingle, guion), conviene mezclarla con trabajo humano sustantivo y registrarla a tu nombre, asumiendo que la protección puede ser parcial.

La dependencia es el riesgo subestimado. Profesionales que usan IA a diario reportan pérdida de habilidades cognitivas: peor memoria, menor capacidad de redacción sin asistencia, dependencia emocional del feedback inmediato del modelo. La mitigación es disciplina: ejercicios semanales sin IA, revisar cada salida con sentido crítico antes de aceptarla, alternar tareas asistidas con tareas manuales para mantener musculatura mental.

Una política mínima de uso responsable de IA en una empresa pequeña cabe en una página y debe cubrir diez puntos: 1) qué datos sí se pueden cargar (públicos, de la empresa con permiso) y cuáles no (clientes, médicos, financieros sensibles); 2) qué herramientas están aprobadas; 3) quién aprueba excepciones; 4) qué hacer ante una alucinación detectada; 5) cómo verificar antes de publicar/enviar; 6) cómo registrar prompts críticos; 7) política de propiedad intelectual de salidas; 8) límites de gasto mensual por persona; 9) capacitación obligatoria; 10) responsable interno de IA. Sin política escrita y firmada, la empresa carga toda la responsabilidad legal cuando algo sale mal.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Riesgos, ética y marco legal\nMes 1 — Sesión 4 (cierre Módulo 1)\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "Los 5 riesgos", contenido: "1. Alucinación\n2. Sesgo\n3. Fuga de datos\n4. Dependencia\n5. Propiedad intelectual" },
    { titulo: "Alucinación", contenido: "El LLM siempre responde, incluso cuando no sabe.\n\nCaso EE.UU. 2023: abogado sancionado por sentencias inventadas por ChatGPT.\n\nRegla: si importa, verifica en la fuente." },
    { titulo: "Sesgo algorítmico", contenido: "Modelos heredan sesgos de los datos.\n\nAmazon: reclutamiento penalizaba mujeres.\n\nMitigación: auditoría manual + supervisión humana en decisiones críticas." },
    { titulo: "Fuga de datos y LOPDP", contenido: "ChatGPT gratuito puede usar tus datos para entrenar.\n\nLOPDP Ecuador: hasta 1% facturación anual de multa.\n\nSamsung prohibió ChatGPT internamente." },
    { titulo: "LOPDP — qué exige", contenido: "• Consentimiento del titular\n• Jurisdicciones aprobadas\n• Cláusulas de procesador\n• Notificación de brechas\n\nAplica a nombres, cédulas, correos, salud." },
    { titulo: "Propiedad intelectual", contenido: "OpenAI: tú eres dueño.\nSENADI: sin autoría humana, sin protección automática.\n\nMezclar con trabajo humano + registrar." },
    { titulo: "Política de uso responsable", contenido: "10 puntos mínimos en 1 página:\n1. Qué datos sí/no\n2. Herramientas aprobadas\n3. Aprobador de excepciones\n... hasta 10) Responsable interno de IA" },
    { titulo: "Cierre Módulo 1", contenido: "Sabes qué es la IA, cómo funciona un LLM, qué herramientas usar y qué riesgos cuidar.\n\nPróximo: Módulo 2 — Prompt Engineering profesional." },
  ],
  quiz: [
    { pregunta: "¿Cuál es la regla práctica frente a una alucinación de LLM?", opciones: ["Confiar siempre", "Si el dato importa, verificar en fuente primaria", "Solo confiar en GPT-4", "Pedir disculpas al modelo"], respuesta: 1, explicacion: "Las alucinaciones suenan autoritativas. La única defensa es verificación independiente cuando el dato impacta una decisión." },
    { pregunta: "Según la LOPDP del Ecuador, ¿hasta cuánto puede ser la multa por incumplimiento?", opciones: ["USD 100", "USD 10.000 fijo", "1% de la facturación anual de la empresa", "5 salarios básicos"], respuesta: 2, explicacion: "La LOPDP (Registro Oficial Suplemento 459, 2021) establece multas hasta del 1% de la facturación anual." },
    { pregunta: "¿Qué hizo Samsung tras una fuga de código propietario por ChatGPT?", opciones: ["Demandó a OpenAI", "Prohibió ChatGPT internamente", "Cambió su modelo de negocio", "Compró Anthropic"], respuesta: 1, explicacion: "Samsung prohibió el uso interno de ChatGPT y desarrolló alternativas internas tras la filtración de código." },
    { pregunta: "¿Cuál es la posición práctica sobre propiedad intelectual de salidas de IA en Ecuador?", opciones: ["La IA es dueña", "OpenAI es dueña automáticamente", "Mezclar con trabajo humano sustantivo y registrar a tu nombre", "No existe protección posible"], respuesta: 2, explicacion: "La SENADI no reconoce autoría sin contribución humana suficiente; la mezcla con trabajo humano genera protección parcial." },
    { pregunta: "¿Cuántos puntos mínimos debe cubrir una política de uso responsable de IA según la sesión?", opciones: ["3", "5", "10", "20"], respuesta: 2, explicacion: "La política mínima cabe en una página y debe cubrir 10 puntos: datos permitidos, herramientas, aprobador, alucinaciones, verificación, registro, IP, gastos, capacitación, responsable." },
  ],
  ejercicio: {
    titulo: "Política de uso responsable de IA para mi empresa",
    objetivo: "Redactar la política de uso responsable de IA de tu empresa o área en máximo 1 página, cubriendo los 10 puntos mínimos y aplicable bajo LOPDP.",
    herramientas: "Google Docs + Skill juridico-ecuador de ITSEIA + texto LOPDP",
    datosEjemplo: "Sectores con datos sensibles bajo LOPDP: salud (datos médicos), banca (datos financieros), educación (datos de menores), RRHH (datos laborales), legal (secreto profesional).",
    pasos: [
      "Identifica el tipo de datos que tu empresa maneja diariamente",
      "Lista qué tipos califican como sensibles bajo LOPDP",
      "Define qué herramientas IA aprobarías y cuáles prohibirías y por qué",
      "Redacta los 10 puntos: datos sí/no, herramientas, aprobador de excepciones, qué hacer ante alucinación, cómo verificar, registro de prompts críticos, IP, gastos, capacitación, responsable interno",
      "Incluye un anexo con ejemplos concretos: 'NO se puede pegar la cédula del cliente en ChatGPT', 'SÍ se puede usar Claude.ai para resumir un artículo público'",
      "Pídele a un compañero de equipo que la lea y dé feedback de claridad",
      "Versiona como v1.0 con fecha y deja registro de cambios",
    ],
    resultado: "Política de uso responsable de IA en 1 página, lista para circular y firmar internamente, aplicable bajo LOPDP del Ecuador.",
    criterios: [
      { criterio: "Cobertura completa de los 10 puntos mínimos", puntos: 25 },
      { criterio: "Específicos verificables (no genéricos)", puntos: 20 },
      { criterio: "Cumplimiento con LOPDP (consentimiento, transferencia, sensibles)", puntos: 25 },
      { criterio: "Anexo con ejemplos concretos del sector", puntos: 15 },
      { criterio: "Claridad y aplicabilidad inmediata", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "LOPDP Ecuador — Texto oficial", url: "https://www.telecomunicaciones.gob.ec/wp-content/uploads/2021/06/Ley-Organica-de-Datos-Personales.pdf", tipo: "documentacion", descripcion: "Ley Orgánica de Protección de Datos Personales del Ecuador, Registro Oficial Suplemento 459, 2021." },
    { titulo: "Anthropic — Usage Policies", url: "https://www.anthropic.com/legal/aup", tipo: "documentacion", descripcion: "Políticas de uso aceptable de Anthropic para Claude, referencia para diseñar políticas internas." },
    { titulo: "OpenAI — Data Privacy", url: "https://openai.com/enterprise-privacy/", tipo: "herramienta", descripcion: "Documento de OpenAI sobre privacidad de datos en planes empresariales y diferencias con plan gratuito." },
    { titulo: "Strata (H3L) — Cumplimiento LOPDP", url: "https://strata.h3l.ai/", tipo: "herramienta", descripcion: "Plataforma de cerebro digital profesional ecuatoriana diseñada con cumplimiento LOPDP por defecto." },
    { titulo: "EU AI Act — Resumen ejecutivo", url: "https://artificialintelligenceact.eu/", tipo: "lectura", descripcion: "Marco regulatorio europeo de IA usado como referencia global para clasificación por nivel de riesgo." },
  ],
};

// ─── MÓDULO 2: Prompt Engineering (Sesiones 5-8) ────────────────────────────

const sesion5: SesionBootcamp = {
  id: 5,
  titulo: "Anatomía del prompt: las 6 capas de un prompt profesional",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "",
  videoTitulo: "Las 6 capas del prompt profesional — Anatomía y plantilla maestra",
  slidesUrl: "https://gamma.app/docs/d8pq76gjx0v546e",
  teoria: `Un prompt profesional no es una pregunta lanzada al chat. Es una pieza de comunicación estructurada que combina seis capas independientes y verificables: rol, contexto, tarea, formato, restricciones y ejemplos. Esta estructura, replicada por equipos avanzados en Anthropic, OpenAI y empresas como Stripe o Klarna, distingue resultados profesionales reproducibles de respuestas mediocres tipo demo.

La primera capa es el rol. Define quién es la IA: "Eres un abogado laboralista ecuatoriano con quince años de experiencia". El rol activa patrones específicos en el modelo, calibra registro y vocabulario, y establece autoridad. Sin rol explícito, el modelo asume un rol genérico que produce respuestas genéricas. La regla práctica: el rol debe ser específico (no "experto en negocios" sino "consultor financiero PYME en Ecuador") y reflejar la realidad del problema.

La segunda capa es el contexto. Es lo que el modelo necesita saber sobre el problema antes de actuar. Incluye datos del caso, restricciones del entorno, antecedentes relevantes, vocabulario propio de la organización. Por ejemplo: "El cliente es una empresa de exportación de banano en Machala con cuarenta empleados, factura USD 2.5M anuales, no ha sido auditada por el SRI en los últimos tres años". Sin contexto, el modelo improvisa con suposiciones que pueden ser falsas.

La tercera capa es la tarea: el verbo de acción que define qué debe hacer la IA. "Analiza", "redacta", "compara", "resume", "traduce", "evalúa". Debe ser un solo verbo principal y debe ser específico. Mal: "ayúdame con el contrato". Bien: "Identifica las cinco cláusulas más riesgosas para el empleador en este contrato de prestación de servicios". La especificidad del verbo predice el sesenta por ciento de la calidad del output.

La cuarta capa es el formato: cómo entregar la respuesta. "En una tabla de tres columnas", "en JSON con los campos nombre, riesgo, mitigación", "en un correo de máximo doscientas palabras", "en bullets de no más de quince palabras cada uno". Especificar formato reduce drásticamente las iteraciones. Si no lo haces, el modelo elige formato por su cuenta y rara vez es el que necesitas.

La quinta capa son las restricciones: qué NO debe hacer. "No uses jerga técnica", "no incluyas información que no esté en el contexto", "no menciones competencia", "no excedas trescientas palabras", "no inventes citas legales". Las restricciones explícitas previenen los errores más caros: alucinaciones, salidas off-brand y violaciones de política. Una sola restricción bien escrita puede ahorrar horas de revisión humana.

La sexta capa son los ejemplos (few-shot): demostrar con uno o más ejemplos qué se considera bien hecho. Esta capa es opcional pero potente. Un solo ejemplo bien escogido puede mejorar la calidad veinte a cuarenta por ciento, especialmente en tareas de formato específico (extracción de datos, clasificación, redacción con voz de marca). El zero-shot (sin ejemplos) funciona bien en tareas conocidas; el few-shot brilla en tareas nuevas o muy específicas.

La métrica de calidad de un prompt es objetiva, no intuitiva. La prueba estándar: ejecuta el prompt tres veces idénticas y mide la consistencia. Si las respuestas varían radicalmente en tono, longitud o conclusión, el prompt está subespecificado y necesita más capas. Si las tres respuestas son similares y útiles, el prompt está calibrado. Esta prueba simple distingue prompts de producción de prompts experimentales.

Los errores frecuentes son cinco: prompts demasiado largos sin estructura (todo apretado en un bloque), instrucciones contradictorias ("sé conciso pero detalla cada paso"), falta de verbo de acción claro ("dime sobre el contrato"), expectativas implícitas no comunicadas (el modelo no adivina qué quieres), y mezclar contexto con tarea sin separación visual. La plantilla maestra ITSEIA usa secciones marcadas con encabezados ## ROL, ## CONTEXTO, ## TAREA, ## FORMATO, ## RESTRICCIONES, ## EJEMPLO — esto le da al modelo señales estructurales claras y a ti facilidad para iterar capa por capa cuando algo no funciona.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Anatomía del prompt profesional\nMes 1 — Sesión 5\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "Las 6 capas", contenido: "1. Rol\n2. Contexto\n3. Tarea\n4. Formato\n5. Restricciones\n6. Ejemplos (opcional)" },
    { titulo: "1. Rol", contenido: "Quién es la IA.\n\nMal: 'experto en negocios'\nBien: 'consultor financiero PYME en Ecuador'\n\nActiva patrones, calibra registro, establece autoridad." },
    { titulo: "2. Contexto", contenido: "Lo que el modelo necesita saber.\n\n'Empresa exportadora banano en Machala, 40 empleados, USD 2.5M facturación, sin auditar SRI 3 años.'\n\nSin contexto: el modelo improvisa." },
    { titulo: "3. Tarea", contenido: "Verbo de acción específico.\n\nMal: 'ayúdame con el contrato'\nBien: 'Identifica las 5 cláusulas más riesgosas para el empleador'\n\nSpecificidad del verbo = 60% de la calidad." },
    { titulo: "4. Formato", contenido: "Cómo entregar la respuesta.\n\n'Tabla de 3 columnas', 'JSON con campos x, y, z', 'correo máx 200 palabras'\n\nReduce iteraciones drásticamente." },
    { titulo: "5. Restricciones", contenido: "Qué NO debe hacer.\n\n'No inventes citas legales'\n'No excedas 300 palabras'\n'No menciones competencia'\n\nPrevienen los errores más caros." },
    { titulo: "6. Ejemplos (few-shot)", contenido: "Demostrar qué se considera bien hecho.\n\nUn solo ejemplo bien escogido: +20-40% calidad.\n\nIdeal en tareas de formato específico." },
    { titulo: "Métrica de calidad", contenido: "Ejecuta el prompt 3 veces idénticas.\n\nRespuestas similares = calibrado.\nRespuestas dispares = subespecificado.\n\nPlantilla ITSEIA: ## ROL, ## CONTEXTO, ## TAREA, ##  FORMATO, ## RESTRICCIONES, ## EJEMPLO" },
  ],
  quiz: [
    { pregunta: "¿Cuál es la primera capa de un prompt profesional?", opciones: ["Tarea", "Rol", "Formato", "Restricciones"], respuesta: 1, explicacion: "El rol define quién es la IA y debe ser específico (no genérico)." },
    { pregunta: "¿Qué porcentaje de la calidad del output predice la especificidad del verbo de tarea?", opciones: ["10%", "30%", "60%", "90%"], respuesta: 2, explicacion: "La especificidad del verbo de acción predice aproximadamente el 60% de la calidad final." },
    { pregunta: "¿Cuál es la métrica objetiva para evaluar un prompt?", opciones: ["Que sea corto", "Que use palabras técnicas", "Ejecutarlo 3 veces y medir consistencia", "Que la primera respuesta sea perfecta"], respuesta: 2, explicacion: "Si tres ejecuciones idénticas dan respuestas radicalmente distintas, el prompt está subespecificado." },
    { pregunta: "¿Qué efecto tiene un solo ejemplo bien escogido (one-shot) en la calidad?", opciones: ["Ningún efecto", "Mejora 5%", "Mejora 20-40%", "Empeora la respuesta"], respuesta: 2, explicacion: "Un ejemplo bien elegido puede mejorar la calidad entre 20% y 40%, especialmente en tareas de formato específico." },
    { pregunta: "Dado un prompt de un abogado laboralista ecuatoriano que pide redactar un acta de finiquito y dice 'no inventes jurisprudencia', ¿qué capa representa la restricción?", opciones: ["Rol", "Contexto", "Tarea", "Restricciones"], respuesta: 3, explicacion: "Es la quinta capa, las restricciones — define qué NO debe hacer el modelo." },
  ],
  ejercicio: {
    titulo: "Refactor de 5 prompts reales con las 6 capas",
    objetivo: "Tomar 5 tareas reales de tu trabajo, escribir el prompt malo intuitivo y refactorizarlo aplicando las 6 capas. Medir la mejora con la prueba de 3 ejecuciones.",
    herramientas: "ChatGPT o Claude.ai + Google Docs + plantilla maestra ITSEIA",
    datosEjemplo: "Tareas tipo: redactar correo a cliente moroso, resumir reunión grabada, traducir contrato del inglés al español, generar idea de campaña, analizar cláusula contractual.",
    pasos: [
      "Lista 5 tareas reales de tu trabajo donde uses o quieras usar IA",
      "Para cada una escribe primero el 'prompt intuitivo' (lo que naturalmente escribirías)",
      "Refactoriza usando las 6 capas: ## ROL, ## CONTEXTO, ## TAREA, ## FORMATO, ## RESTRICCIONES, ## EJEMPLO",
      "Ejecuta el prompt intuitivo 3 veces y documenta consistencia y calidad (1-10)",
      "Ejecuta el prompt refactorizado 3 veces y documenta consistencia y calidad",
      "Calcula la mejora porcentual de calidad y consistencia",
      "Documenta una conclusión sobre qué capa generó mayor mejora en cada caso",
    ],
    resultado: "Documento con 5 prompts antes/después, 30 ejecuciones documentadas (5 prompts × 2 versiones × 3 corridas), métricas de mejora y conclusión sobre qué capa pesa más.",
    criterios: [
      { criterio: "Aplicación rigurosa de las 6 capas en los 5 prompts", puntos: 25 },
      { criterio: "Documentación honesta de las 30 ejecuciones", puntos: 25 },
      { criterio: "Cálculo correcto de mejora porcentual", puntos: 15 },
      { criterio: "Análisis sobre qué capa generó más mejora", puntos: 20 },
      { criterio: "Aplicabilidad inmediata de los 5 prompts a tu trabajo", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "Anthropic Prompt Library", url: "https://docs.anthropic.com/en/prompt-library/library", tipo: "documentacion", descripcion: "Biblioteca oficial de Anthropic con prompts probados por categoría profesional." },
    { titulo: "OpenAI — Prompt Engineering Guide", url: "https://platform.openai.com/docs/guides/prompt-engineering", tipo: "documentacion", descripcion: "Guía oficial de OpenAI con técnicas y patrones validados de prompt engineering." },
    { titulo: "Anthropic Workbench", url: "https://console.anthropic.com/workbench", tipo: "herramienta", descripcion: "Playground de Anthropic con generador automático de prompts y pruebas batch." },
    { titulo: "Promptfoo", url: "https://www.promptfoo.dev/", tipo: "herramienta", descripcion: "Herramienta open-source para testear prompts contra múltiples modelos y casos." },
    { titulo: "The Prompt Report — Schulhoff et al.", url: "https://arxiv.org/abs/2406.06608", tipo: "lectura", descripcion: "Paper académico que cataloga 58 técnicas de prompting con evidencia empírica." },
  ],
};

const sesion6: SesionBootcamp = {
  id: 6,
  titulo: "Técnicas avanzadas: Chain of Thought, Self-Consistency, Tree of Thoughts",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "",
  videoTitulo: "Chain of Thought y técnicas avanzadas de razonamiento con LLMs",
  slidesUrl: "https://gamma.app/docs/r1v75ka3rxliudk",
  teoria: `Las técnicas avanzadas de prompting transforman a un LLM de "asistente de respuestas" en "compañero de razonamiento". Tres técnicas dominan la práctica profesional: Chain of Thought (CoT), Self-Consistency y Tree of Thoughts (ToT). Cada una resuelve una clase distinta de problemas y conocer cuándo aplicar cada una es lo que diferencia al usuario casual del profesional.

Chain of Thought es la técnica más simple y poderosa. Consiste en pedirle al modelo que explique su razonamiento paso a paso antes de dar la respuesta final. La frase mágica es "piensa paso a paso" o "explica tu razonamiento". El paper original (Wei et al., Google, 2022) demostró que CoT mejora la precisión hasta cuarenta por ciento en problemas matemáticos, lógicos y de planificación. La intuición: forzar al modelo a verbalizar pasos intermedios reduce la probabilidad de errores que ocurren cuando intenta saltar directamente al resultado.

Aplicación práctica de CoT: cálculo de liquidación laboral en Ecuador. Sin CoT, el modelo puede confundir el cálculo del décimo tercero con el del décimo cuarto. Con CoT explícito ("calcula primero el décimo tercero, luego el décimo cuarto, luego las vacaciones, luego la bonificación por desahucio, y al final suma"), la precisión sube significativamente. La regla: para cualquier problema con múltiples pasos numéricos o lógicos, usar CoT.

Self-Consistency lleva el CoT un paso más allá. En lugar de ejecutar el prompt una sola vez, lo ejecutas tres a cinco veces y eliges la respuesta que aparece con más frecuencia. La lógica: si el modelo razona correctamente, la mayoría de ejecuciones convergerá a la misma respuesta; si está alucinando, las respuestas variarán. Self-Consistency es ideal para tareas críticas donde un error es caro: cálculos legales, dosis médicas, fórmulas financieras. Costo adicional: tres a cinco veces más tokens, justificable cuando el costo del error es mucho mayor.

Tree of Thoughts es la técnica más sofisticada. Aplicable a problemas con múltiples caminos de solución posibles, donde la mejor solución requiere explorar opciones, evaluar cada una, y elegir. Ejemplos: planificación estratégica, decisiones de inversión, diseño de campaña de marketing. La estructura: el modelo genera tres a cinco opciones (rama 1, rama 2, rama 3), evalúa cada una con criterios explícitos, descarta las débiles, y profundiza en la mejor. Existe en versión simple (un solo prompt con instrucciones) y compleja (múltiples llamadas al modelo orquestadas con código).

ReAct (Reason + Act) es la antesala de los agentes autónomos. Combina razonamiento con uso de herramientas externas. El modelo razona ("necesito saber el tipo de cambio actual"), llama una herramienta ("búsqueda web"), recibe el resultado, sigue razonando, y produce la respuesta final. ReAct es la base de Claude con tools, GPTs personalizados con acciones, y agentes de Lindy o Manus. Conocer la lógica te permite entender qué está pasando dentro de cualquier asistente moderno.

Cuándo NO conviene usar CoT: tareas creativas (poesía, brainstorming, generación de ideas) donde la fluidez importa más que la precisión, redacción literaria donde el razonamiento explícito rompe el flujo, y consultas donde el usuario espera respuesta inmediata sin justificación. La regla: CoT mejora precisión, no creatividad. Para creatividad, prompts sin CoT con temperatura más alta funcionan mejor.

Combinar técnicas multiplica capacidad. Patrón profesional típico: prompt con las 6 capas + CoT + restricción explícita de no inventar + autoevaluación final ("antes de entregar, revisa si tu respuesta cumple las restricciones y corrige si encuentras inconsistencias"). Este patrón reduce alucinaciones, mejora consistencia y produce salidas auditables. Es lo que separa un asistente de demo de uno de producción que toma decisiones que afectan dinero o personas.

La elección práctica: CoT como default para todo lo analítico, Self-Consistency para lo crítico, Tree of Thoughts para lo estratégico, sin CoT para lo creativo. Aprender a clasificar tu tarea en una de estas cuatro categorías toma una semana de práctica deliberada. A partir de ahí, cada nuevo problema profesional tiene una técnica asignada.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Técnicas avanzadas de prompting\nMes 1 — Sesión 6\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "Tres técnicas clave", contenido: "1. Chain of Thought (CoT)\n2. Self-Consistency\n3. Tree of Thoughts (ToT)" },
    { titulo: "Chain of Thought", contenido: "Pedir al modelo que razone paso a paso.\n\n'Piensa paso a paso'\n'Explica tu razonamiento'\n\nWei et al. 2022: hasta +40% precisión en problemas lógicos." },
    { titulo: "CoT en Ecuador", contenido: "Cálculo de liquidación laboral:\n1. Décimo tercero\n2. Décimo cuarto\n3. Vacaciones\n4. Bonificación desahucio\n5. Suma final\n\nCoT evita confundir cálculos." },
    { titulo: "Self-Consistency", contenido: "Ejecuta el prompt 3-5 veces.\n\nElige la respuesta más frecuente.\n\nCrítico para: cálculos legales, dosis médicas, fórmulas financieras." },
    { titulo: "Tree of Thoughts", contenido: "Genera 3-5 opciones, evalúa, descarta, profundiza en la mejor.\n\nIdeal: planificación estratégica, decisiones de inversión, diseño de campaña." },
    { titulo: "ReAct", contenido: "Reason + Act\n\nRazona → llama herramienta → recibe resultado → sigue razonando → respuesta final\n\nBase de agentes modernos (Claude tools, GPTs, Lindy)." },
    { titulo: "Cuándo NO usar CoT", contenido: "Tareas creativas, poesía, brainstorming.\n\nRedacción literaria.\n\nCoT mejora precisión, no creatividad." },
    { titulo: "Tabla de elección", contenido: "Analítico → CoT\nCrítico → Self-Consistency\nEstratégico → Tree of Thoughts\nCreativo → sin CoT, temperatura alta" },
  ],
  quiz: [
    { pregunta: "¿Cuál es la frase mágica de Chain of Thought?", opciones: ["Por favor sé claro", "Piensa paso a paso", "Sé creativo", "Habla en español"], respuesta: 1, explicacion: "'Piensa paso a paso' es la instrucción que activa razonamiento explícito en LLMs." },
    { pregunta: "¿Cuándo usarías Self-Consistency?", opciones: ["Para tareas creativas", "Para cálculos críticos donde un error es caro", "Para ahorrar tokens", "Para responder rápido"], respuesta: 1, explicacion: "Self-Consistency es ideal para tareas críticas: cálculos legales, dosis médicas, fórmulas financieras." },
    { pregunta: "¿Para qué tipo de problemas es ideal Tree of Thoughts?", opciones: ["Cálculos simples", "Problemas con múltiples caminos de solución y necesidad de evaluar opciones", "Tareas creativas", "Traducción"], respuesta: 1, explicacion: "Tree of Thoughts brilla en planificación estratégica y decisiones donde se exploran y evalúan opciones." },
    { pregunta: "¿Cuándo NO conviene usar CoT?", opciones: ["En cálculos legales", "En tareas creativas como poesía o brainstorming", "En análisis de contratos", "En traducciones técnicas"], respuesta: 1, explicacion: "CoT mejora precisión pero rompe el flujo creativo; en poesía, brainstorming o redacción literaria se prefiere sin CoT." },
    { pregunta: "¿Qué combina ReAct?", opciones: ["Dos modelos en paralelo", "Razonamiento con uso de herramientas externas", "Texto y voz", "Tres usuarios chateando"], respuesta: 1, explicacion: "ReAct (Reason + Act) combina razonamiento del LLM con llamadas a herramientas externas — base de los agentes modernos." },
  ],
  ejercicio: {
    titulo: "Aplicación de las 3 técnicas avanzadas a un problema crítico",
    objetivo: "Tomar un problema profesional donde la IA habitualmente falla, aplicarle CoT, Self-Consistency y Tree of Thoughts, y documentar cuál resolvió mejor el problema.",
    herramientas: "Claude.ai o ChatGPT + hoja de cálculo para registrar resultados",
    datosEjemplo: "Problemas tipo: cálculo de liquidación laboral con 7 años antigüedad y desahucio, planificación de campaña de marketing trimestral con USD 5.000 de presupuesto, análisis de oferta laboral con 3 candidatos a evaluar.",
    pasos: [
      "Define un problema profesional real con respuesta verificable",
      "Ejecuta prompt simple sin técnica avanzada y guarda la respuesta",
      "Ejecuta el prompt con CoT explícito (piensa paso a paso) y compara",
      "Ejecuta Self-Consistency: el mismo prompt 5 veces y elige la respuesta modal",
      "Aplica Tree of Thoughts: genera 3 opciones, evalúa con criterios, profundiza en la mejor",
      "Verifica las 4 respuestas contra la realidad (fuente primaria, cálculo manual, experto)",
      "Documenta cuál técnica resolvió mejor y por qué",
    ],
    resultado: "Reporte con problema definido, 4 ejecuciones documentadas (simple, CoT, Self-Consistency, ToT), verificación contra realidad y conclusión sobre cuál técnica usar para problemas similares.",
    criterios: [
      { criterio: "Problema definido con respuesta verificable", puntos: 20 },
      { criterio: "Aplicación correcta de las 3 técnicas avanzadas", puntos: 30 },
      { criterio: "Verificación honesta contra la realidad", puntos: 20 },
      { criterio: "Análisis de cuál técnica funcionó mejor y por qué", puntos: 20 },
      { criterio: "Lección extrapolable a otros problemas similares", puntos: 10 },
    ],
  },
  recursos: [
    { titulo: "Chain-of-Thought Prompting (Wei et al. 2022)", url: "https://arxiv.org/abs/2201.11903", tipo: "documentacion", descripcion: "Paper original de Google que introdujo Chain of Thought y demostró su efecto en modelos grandes." },
    { titulo: "Tree of Thoughts (Yao et al. 2023)", url: "https://arxiv.org/abs/2305.10601", tipo: "documentacion", descripcion: "Paper que formalizó Tree of Thoughts como técnica para problemas con múltiples caminos." },
    { titulo: "Learn Prompting — Advanced Techniques", url: "https://learnprompting.org/docs/intermediate/chain_of_thought", tipo: "herramienta", descripcion: "Tutorial visual interactivo de las técnicas avanzadas de prompting." },
    { titulo: "DAIR.AI Prompt Engineering Guide", url: "https://www.promptingguide.ai/", tipo: "herramienta", descripcion: "Guía completa de prompt engineering con ejemplos por técnica y modelo." },
    { titulo: "ReAct: Synergizing Reasoning and Acting", url: "https://arxiv.org/abs/2210.03629", tipo: "lectura", descripcion: "Paper original de Princeton y Google que introdujo el patrón ReAct base de los agentes modernos." },
  ],
};

const sesion7: SesionBootcamp = {
  id: 7,
  titulo: "Prompts para tareas profesionales reales: comunicación, análisis, creatividad",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "",
  videoTitulo: "Prompts profesionales en cadena — De Perplexity a entrega final",
  slidesUrl: "https://gamma.app/docs/y1c4lw5bjktobfi",
  teoria: `La diferencia entre un usuario que tiene ChatGPT abierto todo el día y un profesional que produce el doble de output es la posesión de prompts probados para diez tareas de alto valor. No prompts nuevos cada vez, no improvisación: prompts versionados, mejorados con uso, listos para copy-paste. Construir esa biblioteca personal es lo que entrega esta sesión.

Las diez tareas profesionales de alto valor se distribuyen en tres familias. Comunicación: redactar correos profesionales, resumir reuniones grabadas, traducir documentos manteniendo tono. Análisis: analizar contratos identificando riesgos, generar reportes a partir de datos brutos, evaluar candidatos a partir de currículums. Creatividad y producción: generar propuestas comerciales, crear contenido para redes sociales, preparar presentaciones, redactar políticas internas. Cada una tiene un patrón de prompt estable que, una vez calibrado, sirve durante meses.

Calibrar tono y registro para audiencias ecuatorianas requiere intencionalidad. ChatGPT por defecto escribe en un español neutro de manual de instrucciones, demasiado formal para WhatsApp y demasiado informal para una propuesta corporativa. Los tres registros más usados en Ecuador profesional: B2B corporativo (formal con vocabulario técnico, "Estimado señor", uso de usted, sin emojis), B2C cercano ("Hola, qué tal", uso de tú, emojis con moderación, frases cortas), y público interno (semiformal, vocabulario común, ejemplos del día a día). Especificar el registro en el prompt como capa de contexto es obligatorio.

Los prompts en cadena son el patrón más rentable. Un solo prompt difícilmente produce un entregable de calidad final. La cadena estándar: extracción → análisis → recomendación → presentación. Ejemplo: investigar competencia con Perplexity (extracción de datos públicos), estructurar análisis competitivo con Claude (análisis), generar recomendaciones estratégicas con GPT-4 (recomendación), preparar slides en formato Markdown para Gamma (presentación). Cada paso usa el modelo más fuerte para esa tarea específica.

Los prompts "espejo" o de autoevaluación son una técnica subestimada. Después de generar la respuesta, le pides al modelo: "Ahora evalúa críticamente tu respuesta anterior según estos cuatro criterios: (1) responde la pregunta original, (2) está libre de información inventada, (3) cumple el formato solicitado, (4) usa el registro adecuado. Si encuentras incumplimientos, regenera la respuesta corregida". Esta técnica reduce errores en tareas profesionales hasta cincuenta por ciento sin costo adicional significativo.

La regla del 80/20 en iteración es crítica. Si después del cuarto intento de mejorar un prompt o una salida no estás obteniendo resultados, el problema no es el prompt: es el enfoque. Cambia el modelo (de GPT a Claude o viceversa), cambia la estrategia (de un solo prompt a cadena), o cambia el alcance (lo que pedías era irrealista). Iterar más allá del cuarto intento sin cambio de enfoque es desperdicio de tiempo. Esta regla viene de práctica empírica documentada por equipos avanzados.

Voz de marca en LLMs es la habilidad más vendible. Las empresas pagan por consultores que enseñan a su LLM a escribir como su marca, no como un genérico. La técnica: extraer cinco a diez muestras del estilo deseado (correos antiguos, posts publicados, documentos internos), pedirle al LLM que extraiga reglas de voz (lo hace bien con Claude), validar las reglas con el equipo, y agregar esas reglas como capa de contexto en cada prompt. ITSEIA mantiene un documento de voz de marca de tres páginas que se anexa a todos los prompts de comunicación externa.

Producir un entregable real en veinticinco minutos usando cadena de prompts es factible y demostrable. Caso ejemplo: propuesta comercial completa de una empresa de capacitación corporativa para un cliente bancario ecuatoriano. Minuto cero a cinco: investigación con Perplexity (necesidades del banco, regulación, casos previos). Cinco a diez: estructura con Claude (índice, secciones, lógica argumentativa). Diez a veinte: redacción con GPT-4 sección por sección. Veinte a veinticinco: revisión con prompt espejo y ajuste final. El resultado es una propuesta de quince páginas equivalente a cuatro horas de trabajo manual.

El cierre de esta sesión es el inicio de tu biblioteca personal de prompts. La consigna: cada vez que produces un buen output, extrae el prompt, anótalo en Notion u Obsidian con metadata (fecha, modelo usado, ejemplo de salida, versión), y reutilízalo. En tres meses tendrás veinte a treinta prompts versionados que multiplican tu productividad por dos o tres.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Prompts para tareas profesionales reales\nMes 1 — Sesión 7\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "10 tareas de alto valor", contenido: "Comunicación: correos, resumen reuniones, traducción\nAnálisis: contratos, reportes, evaluación de CVs\nCreatividad: propuestas, contenido redes, slides, políticas" },
    { titulo: "3 registros ecuatorianos", contenido: "B2B corporativo: formal, usted, sin emojis\nB2C cercano: tú, emojis moderados, frases cortas\nInterno: semiformal, vocabulario común" },
    { titulo: "Prompts en cadena", contenido: "Patrón estándar:\n\nExtracción (Perplexity) → Análisis (Claude) → Recomendación (GPT-4) → Presentación (Gamma)" },
    { titulo: "Prompts espejo", contenido: "Después de generar, pide al modelo evaluarse:\n\n1. ¿Responde la pregunta?\n2. ¿Sin info inventada?\n3. ¿Cumple formato?\n4. ¿Registro adecuado?\n\n-50% errores sin costo significativo." },
    { titulo: "Regla 80/20 de iteración", contenido: "4 intentos sin mejorar = el problema no es el prompt.\n\nCambia: modelo, estrategia o alcance.\n\nIterar más es desperdicio." },
    { titulo: "Voz de marca", contenido: "5-10 muestras del estilo → reglas de voz (Claude) → validar con equipo → anexar a todos los prompts.\n\nDoc de 3 páginas resuelve 80% de los casos." },
    { titulo: "Caso 25 minutos", contenido: "Propuesta para banco ecuatoriano:\n0-5: Perplexity (investigación)\n5-10: Claude (estructura)\n10-20: GPT-4 (redacción)\n20-25: Espejo y ajuste\n\n= 4 horas de trabajo manual." },
    { titulo: "Tu biblioteca empieza hoy", contenido: "Cada buen output → extrae prompt → Notion con metadata.\n\n3 meses = 20-30 prompts versionados.\n\nProductividad x2 o x3." },
  ],
  quiz: [
    { pregunta: "¿Cuál es la cadena estándar de prompts para un entregable profesional?", opciones: ["Pregunta - respuesta", "Extracción - análisis - recomendación - presentación", "Solo Claude todo el rato", "GPT-4 cinco veces"], respuesta: 1, explicacion: "El patrón estándar es Extracción (Perplexity) → Análisis (Claude) → Recomendación (GPT-4) → Presentación (Gamma o similar)." },
    { pregunta: "¿Qué hace un prompt 'espejo' o de autoevaluación?", opciones: ["Genera otra respuesta distinta", "Pide al modelo evaluar críticamente su propia respuesta anterior", "Traduce la respuesta", "Resume la conversación"], respuesta: 1, explicacion: "El prompt espejo pide al modelo evaluarse contra criterios explícitos y regenerar si encuentra incumplimientos." },
    { pregunta: "Según la regla 80/20, después de cuántos intentos sin mejora deberías cambiar de enfoque?", opciones: ["1", "4", "10", "20"], respuesta: 1, explicacion: "Después del cuarto intento sin mejora, el problema no es el prompt: cambia modelo, estrategia o alcance." },
    { pregunta: "¿Cuál es el registro adecuado para una propuesta B2B a un banco ecuatoriano?", opciones: ["Informal con emojis", "Formal corporativo con vocabulario técnico, uso de usted", "Coloquial con jerga", "Slang juvenil"], respuesta: 1, explicacion: "B2B corporativo en Ecuador usa registro formal, vocabulario técnico, 'Estimado señor', uso de usted, sin emojis." },
    { pregunta: "¿Cómo se construye una voz de marca para un LLM?", opciones: ["Repetir 'sé tú mismo' en cada prompt", "Extraer 5-10 muestras del estilo, derivar reglas con Claude, validar con equipo y anexar como contexto", "Pagarle a OpenAI", "No se puede"], respuesta: 1, explicacion: "El método estándar: muestras → reglas extraídas con Claude → validación → anexar a prompts de comunicación externa." },
  ],
  ejercicio: {
    titulo: "Entregable real con cadena de 3 prompts",
    objetivo: "Producir un entregable real de tu trabajo (correo, propuesta, informe) usando una cadena de mínimo 3 prompts y medir el tiempo ahorrado vs hacerlo manualmente.",
    herramientas: "Perplexity + Claude.ai + ChatGPT + Google Docs + cronómetro",
    datosEjemplo: "Entregables tipo: propuesta comercial para cliente real, informe ejecutivo de avance trimestral, contrato de servicios profesionales, plan de capacitación interno, análisis competitivo de un sector ecuatoriano.",
    pasos: [
      "Define el entregable real que necesitas producir esta semana",
      "Estima honestamente cuánto tardarías sin IA (mínimo 2 horas)",
      "Diseña la cadena de mínimo 3 prompts: extracción + análisis + producción",
      "Ejecuta la cadena y cronometra el tiempo total",
      "Aplica al menos un prompt espejo de autoevaluación al final",
      "Compara la calidad del resultado con tu estándar manual habitual",
      "Documenta los 3 prompts exactos, el tiempo ahorrado y la nota de calidad (1-10)",
    ],
    resultado: "Entregable real producido + documento con los 3 prompts exactos versionados, tiempo manual estimado vs tiempo con IA, nota de calidad y reflexión sobre qué mejorar en la cadena.",
    criterios: [
      { criterio: "Entregable real con valor para el trabajo del alumno", puntos: 25 },
      { criterio: "Cadena clara de 3+ prompts con propósito específico cada uno", puntos: 25 },
      { criterio: "Aplicación de prompt espejo de autoevaluación", puntos: 15 },
      { criterio: "Documentación honesta de tiempo ahorrado", puntos: 15 },
      { criterio: "Reflexión accionable para iterar la cadena", puntos: 20 },
    ],
  },
  recursos: [
    { titulo: "Awesome ChatGPT Prompts", url: "https://github.com/f/awesome-chatgpt-prompts", tipo: "documentacion", descripcion: "Repositorio GitHub con miles de prompts probados por la comunidad, organizados por rol profesional." },
    { titulo: "Anthropic — Cookbook", url: "https://github.com/anthropics/anthropic-cookbook", tipo: "documentacion", descripcion: "Recetario oficial de Anthropic con patrones de prompting validados por casos de uso." },
    { titulo: "Perplexity AI", url: "https://www.perplexity.ai/", tipo: "herramienta", descripcion: "Buscador con IA ideal para la fase de extracción en cadenas de prompts." },
    { titulo: "Notion — Plantilla biblioteca de prompts", url: "https://www.notion.so/templates/category/ai", tipo: "herramienta", descripcion: "Plantillas Notion gratuitas para versionar y organizar tu biblioteca personal de prompts." },
    { titulo: "Ethan Mollick — One Useful Thing", url: "https://www.oneusefulthing.org/", tipo: "lectura", descripcion: "Newsletter del profesor de Wharton con casos prácticos semanales de uso profesional de IA." },
  ],
};

const sesion8: SesionBootcamp = {
  id: 8,
  titulo: "Bibliotecas de prompts, versionado y trabajo en equipo",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "",
  videoTitulo: "Versionado de prompts con Git — Prompts are code",
  slidesUrl: "https://gamma.app/docs/puchyo85b97cgya",
  teoria: `Un prompt es código. Esta afirmación, popularizada por el equipo de ingeniería de Anthropic, cambia cómo gestionas tu trabajo con LLMs. Si es código, debe versionarse, testearse, revisarse y compartirse con disciplina. Sin esa disciplina, perdés conocimiento valioso, repetís errores y no podés escalar tu uso de IA al equipo.

La estructura de carpetas para una biblioteca personal de prompts sigue tres dimensiones: dominio, nivel y idioma. Por dominio: comunicación, análisis, generación, automatización. Por nivel: básico (single prompt), intermedio (con CoT o few-shot), avanzado (cadenas o agentes). Por idioma: español Ecuador, español neutro, inglés. Una estructura típica en Notion u Obsidian: /prompts/comunicacion/correos-b2b-es-ec.md, /prompts/analisis/contratos-laborales-es-ec.md. Cada archivo Markdown contiene metadata, prompt, ejemplo de input, ejemplo de salida y notas de versión.

El versionado con Git de prompts críticos no es opcional cuando el prompt impacta dinero. Cambiar una palabra en un prompt de scoring crediticio puede cambiar quién recibe préstamo. Los equipos serios mantienen sus prompts en repositorios Git separados o dentro del repo del producto, con commits que explican el cambio y pull requests que requieren review. Las herramientas especializadas son PromptLayer, Helicone y LangSmith, que añaden tracking de costos, latencia y calidad por versión de prompt en producción.

Las pruebas de regresión de prompts son la trampa más cara que descubren los equipos al escalar. Un prompt que funciona perfecto con GPT-4 puede romperse cuando el proveedor lo actualiza silenciosamente o cuando migras a GPT-5. Sin un set de casos de prueba que ejecutas antes de cualquier cambio (de modelo, de prompt o de contexto), no sabés si rompiste algo hasta que un usuario reclama. La práctica madura: cada prompt crítico tiene mínimo veinte casos de prueba con respuesta esperada, y cada cambio se valida contra ese set.

Naming y tagging de prompts hacen la diferencia entre encontrar el prompt que necesitas en treinta segundos o no encontrarlo nunca. Las convenciones que funcionan: nombre del archivo con dominio_caso_idioma_version (correos_recordatorio_morosos_es_v3.md), tags por audiencia (#b2b, #b2c, #interno), tags por modelo donde fue probado (#claude, #gpt4, #gemini), tag de status (#produccion, #experimental, #deprecated). Sin convenciones, la biblioteca colapsa después de cincuenta prompts.

Las herramientas especializadas merecen evaluación según escala. Para uso personal solo: Notion u Obsidian son suficientes y gratuitos. Para equipo pequeño (3-10 personas): PromptLayer en plan gratuito permite versionar y compartir. Para producto en producción: LangSmith de LangChain o Helicone son referencia, con planes desde USD 50 mensuales. La regla: empezá simple, migrá cuando la herramienta actual te limite, no antes.

La cultura de equipo alrededor de prompts replica la cultura de código. Prompt review tipo code review: cuando alguien crea un prompt para producción, otra persona del equipo lo revisa antes de mergear. Métricas de adopción: cuántos prompts del repositorio compartido se usan semanalmente. Retros mensuales: qué prompts fallaron en producción y por qué. Ownership: cada prompt tiene un dueño responsable de mantenerlo. ITSEIA aplica esta práctica internamente para los prompts del bot de leads y los asistentes de cursos.

El tour por el repositorio interno de ITSEIA muestra estructura, naming, ejemplos y permite a los alumnos hacer un prompt review en vivo de un compañero, mejorándolo en grupo. La técnica del review: leer el prompt asumiendo que sos un colaborador hostil, identificar capa débil (¿falta rol? ¿restricciones vagas? ¿formato implícito?), proponer mejora específica, ejecutar antes y después y comparar resultados. Veinte minutos de review reducen errores futuros en horas de iteración.

El cierre del módulo 2 es la entrega de tu biblioteca personal con mínimo veinte prompts probados, organizados por categoría, con campos: nombre, propósito, prompt, ejemplo de salida, modelo usado, fecha, versión. Esta biblioteca es tu activo profesional más subestimado. En seis meses te ahorrará cientos de horas. En dos años podrá ser la base de un producto, un consultorio o una capacitación que vendés a empresas. Empieza hoy.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Bibliotecas de prompts y versionado\nMes 1 — Sesión 8 (cierre Módulo 2)\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "Prompts are code", contenido: "Un prompt es código.\n\nDebe versionarse, testearse, revisarse, compartirse.\n\nSin disciplina: pierdes conocimiento, repites errores, no escalas." },
    { titulo: "Estructura de carpetas", contenido: "3 dimensiones:\n• Dominio: comunicación, análisis, generación, automatización\n• Nivel: básico, intermedio, avanzado\n• Idioma: es-EC, es-neutro, en\n\n/prompts/comunicacion/correos-b2b-es-ec.md" },
    { titulo: "Versionado con Git", contenido: "No opcional cuando el prompt impacta dinero.\n\nCommits que explican cambio.\nPull requests con review.\nHerramientas: PromptLayer, Helicone, LangSmith." },
    { titulo: "Pruebas de regresión", contenido: "Cada prompt crítico: mínimo 20 casos de prueba.\n\nGPT-4 → GPT-5 puede romper sin avisar.\n\nSin set de pruebas: descubrís fallas con reclamos de usuarios." },
    { titulo: "Naming y tagging", contenido: "correos_recordatorio_morosos_es_v3.md\n\nTags: #b2b #b2c #claude #gpt4 #produccion #experimental #deprecated" },
    { titulo: "Herramientas por escala", contenido: "Personal: Notion u Obsidian (gratis)\nEquipo 3-10: PromptLayer (free)\nProducción: LangSmith o Helicone ($50+/mes)" },
    { titulo: "Cultura de equipo", contenido: "Prompt review tipo code review.\nMétricas de adopción.\nRetros mensuales.\nOwnership por prompt.\n\nITSEIA aplica esto al bot de leads." },
    { titulo: "Cierre Módulo 2", contenido: "Entregable: biblioteca personal con 20+ prompts versionados.\n\nActivo profesional subestimado.\n6 meses = cientos de horas ahorradas.\n\nPróximo: Módulo 3 — Automatización con IA." },
  ],
  quiz: [
    { pregunta: "Según el principio 'prompts are code', ¿qué prácticas deben aplicarse?", opciones: ["Solo escribirlos rápido", "Versionarse, testearse, revisarse y compartirse", "Memorizarlos", "Mantenerlos secretos"], respuesta: 1, explicacion: "Si es código, aplica versionado, testing, code review y compartir con disciplina." },
    { pregunta: "¿Cuál es el mínimo de casos de prueba recomendado para un prompt crítico?", opciones: ["1", "5", "20", "1.000"], respuesta: 2, explicacion: "Mínimo 20 casos de prueba con respuesta esperada permiten validar antes de cambios de modelo o prompt." },
    { pregunta: "Para uso personal solo, ¿qué herramienta de prompts es suficiente?", opciones: ["LangSmith empresarial", "Notion u Obsidian gratuitos", "PromptLayer Enterprise", "Una base de datos custom"], respuesta: 1, explicacion: "Para uso personal Notion u Obsidian gratuitos cubren las necesidades; migrar cuando la herramienta limite, no antes." },
    { pregunta: "¿Qué es el 'prompt review tipo code review'?", opciones: ["Revisar código mientras se promptea", "Otra persona del equipo revisa el prompt antes de mergearlo a producción", "El modelo se revisa solo", "Una conferencia anual"], respuesta: 1, explicacion: "Replica la práctica de code review: otra persona valida el prompt antes de mergearlo a producción." },
    { pregunta: "¿Cuál es el entregable de cierre del Módulo 2?", opciones: ["Un solo prompt mágico", "Biblioteca personal con 20+ prompts versionados con metadata", "Una conferencia", "Una API custom"], respuesta: 1, explicacion: "El entregable son 20+ prompts probados, organizados por categoría, con metadata completa (nombre, propósito, prompt, ejemplo, modelo, fecha, versión)." },
  ],
  ejercicio: {
    titulo: "Mi biblioteca personal de prompts versionada",
    objetivo: "Construir tu biblioteca personal en Notion u Obsidian con mínimo 20 prompts probados, organizados por categoría y con metadata completa.",
    herramientas: "Notion u Obsidian + ChatGPT/Claude para probar + plantilla ITSEIA",
    datosEjemplo: "Categorías sugeridas: comunicación (correos, mensajes), análisis (contratos, datos), creatividad (contenido, ideas), administración (resúmenes, traducciones).",
    pasos: [
      "Crea una página o vault dedicada a tu biblioteca de prompts",
      "Define la estructura de carpetas: dominio / nivel / idioma",
      "Diseña la plantilla de cada prompt con campos: nombre, propósito, prompt completo, ejemplo input, ejemplo output, modelo usado, fecha, versión, tags",
      "Migra y prueba 20 prompts (de las sesiones 5-7 y de tu trabajo real)",
      "Aplica naming convention consistente",
      "Agrega tags útiles (#b2b, #b2c, #claude, #gpt4, #produccion)",
      "Comparte la URL del repositorio (Notion público o GitHub) con un compañero del bootcamp y pídele un prompt review de los 3 más críticos",
    ],
    resultado: "Biblioteca personal en Notion u Obsidian con 20+ prompts probados, estructura clara, metadata completa, naming consistente y al menos 3 prompts revisados por un compañero.",
    criterios: [
      { criterio: "20+ prompts probados (no copiados sin probar)", puntos: 25 },
      { criterio: "Estructura clara de carpetas y naming", puntos: 20 },
      { criterio: "Metadata completa por prompt", puntos: 20 },
      { criterio: "Tags consistentes y útiles", puntos: 15 },
      { criterio: "3 prompts revisados por un compañero con feedback documentado", puntos: 20 },
    ],
  },
  recursos: [
    { titulo: "PromptLayer", url: "https://promptlayer.com/", tipo: "documentacion", descripcion: "Plataforma de versionado y observabilidad de prompts con plan gratuito generoso." },
    { titulo: "LangSmith — LangChain", url: "https://www.langchain.com/langsmith", tipo: "documentacion", descripcion: "Plataforma profesional de tracking, testing y debugging de prompts en producción." },
    { titulo: "Notion — Templates", url: "https://www.notion.so/templates", tipo: "herramienta", descripcion: "Plantillas Notion gratuitas para crear tu biblioteca personal de prompts." },
    { titulo: "Obsidian", url: "https://obsidian.md/", tipo: "herramienta", descripcion: "Editor Markdown local con grafo de conocimiento, gratuito, ideal para prompts versionados con Git." },
    { titulo: "Anthropic Engineering — Prompts as Code", url: "https://www.anthropic.com/engineering", tipo: "lectura", descripcion: "Blog de ingeniería de Anthropic con artículos sobre versionado y testing de prompts en producción." },
  ],
};

// ─── MÓDULO 3: Automatización con IA (Sesiones 9-12) ────────────────────────

const sesion9: SesionBootcamp = {
  id: 9,
  titulo: "Conceptos de automatización: triggers, acciones, flujos",
  modulo: MOD3,
  moduloNum: 3,
  videoEmbed: "",
  videoTitulo: "Automatización con IA — Triggers, acciones y cálculo de ROI",
  slidesUrl: "https://gamma.app/docs/5jzsb15afljqkq5",
  teoria: `Una automatización es la ejecución automática de un proceso que antes requería intervención humana. En el mundo moderno, esa ejecución casi siempre incluye un componente de IA que toma decisiones que las macros y reglas tradicionales no podían tomar. Antes de construir nada, necesitas dominar tres conceptos: trigger, acción y flujo. Sin ese vocabulario claro, hablar con desarrolladores, vendedores de software o tu equipo es ineficiente.

Un trigger es el evento que dispara la automatización. Puede ser temporal ("cada lunes a las 8 AM"), ser un cambio en otra herramienta ("nuevo correo en Gmail con etiqueta x"), ser una acción del usuario ("se llenó este formulario") o ser un webhook ("alguien hizo un POST a esta URL"). El trigger correcto evita ejecuciones innecesarias y consume menos recursos. El trigger equivocado ejecuta de más, falla o pierde eventos. Identificar el trigger más eficiente es el primer paso de cualquier diseño.

Una acción es la operación que ejecuta el flujo. Puede ser de lectura (obtener datos de una hoja de cálculo), de escritura (crear un evento en calendario), de cómputo (la IA analiza un texto), de comunicación (enviar mensaje WhatsApp), o de control (decidir cuál es la siguiente acción según condición). Un flujo serio combina varias acciones en secuencia con lógica condicional, manejo de errores y reintentos. Un flujo simple puede tener tres acciones; uno complejo puede tener veinte o más.

Un flujo es la secuencia completa de trigger más acciones que cumple un objetivo. La notación BPMN simplificada (Business Process Model and Notation) permite dibujar cualquier flujo en una hoja de papel: rectángulo para acción, rombo para decisión, círculo para inicio o fin, flecha para continuidad. Esta notación, una vez aprendida, te permite documentar procesos complejos en cinco minutos y comunicarlos sin ambigüedad. Es el equivalente a saber leer planos para un arquitecto.

Las cinco oportunidades de automatización más rentables en una PYME ecuatoriana son: gestión de leads entrantes (clasificar, responder con plantilla, registrar en CRM), gestión de correos (filtrar, etiquetar, generar borradores de respuesta), reporte de ventas (agregar datos de varias fuentes, generar dashboard semanal), atención al cliente repetitiva (responder preguntas frecuentes, derivar casos complejos), y generación de contenido (post diario en redes, transcribir reuniones a minutas). Estas cinco cubren el ochenta por ciento de los casos de uso B2B y B2C.

Mapear un proceso manual antes de automatizarlo es obligatorio. La técnica: en una hoja de papel, dibujá los pasos actuales con notación BPMN, identificá cuál paso consume más tiempo, cuál falla con frecuencia, cuál depende de criterio humano. Solo entonces decidís qué automatizar y qué dejar manual. Automatizar sin mapear lleva a flujos sobre-ingenierizados que automatizan lo equivocado o flujos frágiles que se rompen con el primer caso edge.

El cálculo de ROI antes de construir es la habilidad que separa al profesional del entusiasta. La fórmula simple: horas ahorradas semanalmente × valor hora del trabajador × cincuenta y dos semanas, menos costo anual de la herramienta. El punto de equilibrio típico para una automatización bien diseñada es de tres a seis semanas. Si tu cálculo da un punto de equilibrio mayor a tres meses, probablemente la automatización no vale la pena o el caso de uso elegido no es el correcto. Hacé este cálculo antes de empezar a construir, no después.

Los riesgos de automatizar mal son tres: efecto cascada (un error genera una cadena de errores que afecta a clientes), falsos positivos (la IA categoriza mal y toma acciones equivocadas en producción), y pérdida de control humano (nadie revisa lo que el flujo hace y descubrís el problema cuando ya es tarde). Los tres se mitigan con: límites en el flujo (máximo X ejecuciones por hora), revisión humana de muestras semanales, alertas a Slack o WhatsApp cuando algo se sale de rango. La automatización profesional incluye estos guardrails desde el día uno.

El caso real de ITSEIA que cierra esta sesión es el flujo de gestión de leads entrantes: lead llega por WhatsApp Business, IA clasifica intención (carrera vs ignite vs B2B), enriquece datos públicos del prospecto, responde con plantilla personalizada, escribe en Google Sheets el registro y notifica al equipo de admisiones. Este flujo procesa cien leads diarios, ahorra veinte horas semanales al equipo, costó tres horas diseñarlo y dos horas configurarlo en Make. ROI: equilibrio en una semana.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Conceptos de automatización con IA\nMes 1 — Sesión 9\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "3 conceptos clave", contenido: "1. Trigger: el evento que dispara\n2. Acción: la operación que ejecuta\n3. Flujo: secuencia trigger + acciones" },
    { titulo: "Tipos de trigger", contenido: "• Temporal: cada lunes 8 AM\n• Cambio: nuevo correo etiquetado\n• Usuario: formulario llenado\n• Webhook: POST a URL\n\nElegir el trigger correcto = eficiencia." },
    { titulo: "Tipos de acción", contenido: "• Lectura\n• Escritura\n• Cómputo (IA analiza)\n• Comunicación (WhatsApp, correo)\n• Control (decisión condicional)" },
    { titulo: "Notación BPMN simplificada", contenido: "Rectángulo: acción\nRombo: decisión\nCírculo: inicio/fin\nFlecha: continuidad\n\nDibujá cualquier flujo en 5 minutos." },
    { titulo: "5 oportunidades top en PYME", contenido: "1. Gestión de leads\n2. Gestión de correos\n3. Reporte de ventas\n4. Atención al cliente repetitiva\n5. Generación de contenido" },
    { titulo: "Cálculo de ROI", contenido: "Horas semanales × valor hora × 52\n— costo anual de la herramienta\n\nPunto de equilibrio típico: 3-6 semanas\n\nSi >3 meses: replantéate el caso." },
    { titulo: "Riesgos al automatizar mal", contenido: "1. Efecto cascada\n2. Falsos positivos\n3. Pérdida de control humano\n\nMitigación: límites, revisión muestral, alertas." },
    { titulo: "Caso ITSEIA — leads", contenido: "Lead WhatsApp → IA clasifica → enriquece datos → responde plantilla → Sheets → notifica equipo\n\n100 leads/día, 20h ahorradas/semana, equilibrio: 1 semana." },
  ],
  quiz: [
    { pregunta: "¿Qué es un trigger en una automatización?", opciones: ["La acción final", "El evento que dispara la automatización", "El usuario", "El reporte"], respuesta: 1, explicacion: "El trigger es el evento (temporal, cambio, usuario o webhook) que inicia la ejecución del flujo." },
    { pregunta: "Si una automatización ahorra 5 horas/semana de un trabajador con valor hora USD 10 y la herramienta cuesta USD 30/mes, ¿cuál es el ROI anual aproximado?", opciones: ["Negativo", "USD 2.240 positivo", "USD 100", "USD 50.000"], respuesta: 1, explicacion: "5h × $10 × 52 sem = $2.600 ahorrados; menos $360/año de herramienta = $2.240 positivos." },
    { pregunta: "¿Cuál de estas NO es una de las 5 oportunidades top en PYME?", opciones: ["Gestión de leads", "Reporte de ventas", "Diseño de logo corporativo", "Atención al cliente repetitiva"], respuesta: 2, explicacion: "Diseño de logo corporativo es una tarea creativa puntual, no un proceso repetitivo automatizable." },
    { pregunta: "¿Cuál es el punto de equilibrio típico aceptable para una automatización bien diseñada?", opciones: ["10 minutos", "3-6 semanas", "5 años", "Inmediato"], respuesta: 1, explicacion: "El punto de equilibrio típico aceptable es de 3 a 6 semanas; si supera 3 meses, replantear el caso de uso." },
    { pregunta: "¿Cuál es el primer riesgo al automatizar mal?", opciones: ["Efecto cascada de errores", "Que sea muy rápido", "Que use poca IA", "Que sea gratis"], respuesta: 0, explicacion: "El efecto cascada (un error genera una cadena que afecta clientes) es el primero de los tres riesgos clave; se mitiga con límites y alertas." },
  ],
  ejercicio: {
    titulo: "Mapeo y ROI de 3 procesos manuales propios",
    objetivo: "Mapear con notación BPMN simplificada 3 procesos manuales de tu trabajo, calcular el ROI estimado de automatizar cada uno y elegir el primero a construir.",
    herramientas: "Hoja de papel + Lucidchart o draw.io (gratuitos) + Google Sheets para cálculo de ROI",
    datosEjemplo: "Procesos tipo en Ecuador: facturación electrónica al SRI, conciliación bancaria, atención de quejas en redes, seguimiento de pedidos, generación de minutas de reunión, scoring de cotizaciones recibidas.",
    pasos: [
      "Lista 3 procesos manuales recurrentes que consumen tiempo en tu trabajo",
      "Para cada uno, dibuja el flujo actual con notación BPMN simplificada",
      "Identifica los pasos automatizables vs los que requieren criterio humano",
      "Calcula horas semanales que el proceso consume hoy",
      "Estima horas semanales tras automatización (no asumas 0)",
      "Calcula ROI anual: (horas ahorradas × valor hora × 52) − costo herramienta",
      "Elige el proceso con mejor ROI y punto de equilibrio menor a 6 semanas",
    ],
    resultado: "Documento con 3 procesos mapeados visualmente (BPMN), tabla de ROI comparativa, justificación del proceso elegido para automatizar primero y los 3 riesgos a mitigar en el diseño.",
    criterios: [
      { criterio: "Mapeo BPMN claro y correcto de los 3 procesos", puntos: 25 },
      { criterio: "Identificación honesta de pasos no automatizables", puntos: 20 },
      { criterio: "Cálculo de ROI realista (no inflado)", puntos: 20 },
      { criterio: "Justificación del proceso elegido", puntos: 20 },
      { criterio: "Identificación de los 3 riesgos a mitigar", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "BPMN.io", url: "https://bpmn.io/", tipo: "documentacion", descripcion: "Notación oficial BPMN con editor gratuito en navegador para diagramar procesos." },
    { titulo: "Make Academy", url: "https://academy.make.com/", tipo: "documentacion", descripcion: "Academia oficial gratuita de Make con cursos sobre triggers, acciones y flujos." },
    { titulo: "Lucidchart", url: "https://www.lucidchart.com/", tipo: "herramienta", descripcion: "Editor visual de diagramas con plantillas BPMN. Plan gratuito permite 3 documentos." },
    { titulo: "draw.io", url: "https://app.diagrams.net/", tipo: "herramienta", descripcion: "Editor open-source de diagramas, gratuito sin cuenta, exporta a PNG y SVG." },
    { titulo: "Zapier — Workflow Automation Guide", url: "https://zapier.com/learn/", tipo: "lectura", descripcion: "Guía completa de Zapier sobre automatización de procesos, aplicable a Make y n8n." },
  ],
};

const sesion10: SesionBootcamp = {
  id: 10,
  titulo: "Make (ex-Integromat): el primer flujo end-to-end con IA",
  modulo: MOD3,
  moduloNum: 3,
  videoEmbed: "",
  videoTitulo: "Make + OpenAI — Tu primer flujo de IA en producción",
  slidesUrl: "https://gamma.app/docs/sqg9n6w0aoltwlp",
  teoria: `Make, antes conocida como Integromat, es la plataforma de automatización visual que mejor balance ofrece entre potencia y curva de aprendizaje. Es la opción recomendada para profesionales no programadores en Ecuador por tres razones: plan gratuito de mil operaciones mensuales, interfaz visual intuitiva, y conectores con todas las herramientas que usás (Gmail, WhatsApp, Sheets, Drive, Notion). Esta sesión construye en vivo tu primer flujo profesional con IA.

Comparado con sus competidores, Make tiene ventajas y limitaciones claras. Make vs Zapier: Zapier tiene más conectores (más de seis mil) pero es más caro y menos visual. Make vs n8n: n8n es open-source y self-hosted (privacidad total) pero requiere mantener infraestructura. Make vs Power Automate: Power Automate se integra mejor con Microsoft 365 pero es menos amigable para flujos creativos. Para empezar y para el ochenta por ciento de los casos en PYME, Make gana. Para producto en producción con datos sensibles, n8n vale el esfuerzo extra.

La anatomía de un escenario Make tiene cuatro elementos: módulos (cada paso del flujo, representado como un círculo con icono de la herramienta), routers (bifurcación condicional, "si la condición A va por aquí, si la B por allá"), iteradores (procesar lista de elementos uno por uno), y agregadores (juntar resultados de varios módulos en uno solo). Aprender estos cuatro elementos te permite construir cualquier flujo, por complejo que sea. La interfaz de Make es drag-and-drop y muestra los datos pasando entre módulos en tiempo real durante el debugging.

Conectar OpenAI o Claude a Make requiere tres pasos: obtener API key del proveedor (platform.openai.com o console.anthropic.com), agregar el módulo de OpenAI/Anthropic en Make e ingresar la key, configurar el prompt usando los datos del módulo anterior. El costo se calcula por tokens consumidos, igual que en uso directo. Una práctica clave: usar el modelo más barato que cumpla la tarea (GPT-4o-mini o Claude Haiku para clasificación, GPT-4 o Claude Opus solo cuando se necesita razonamiento profundo).

El manejo de errores es lo que diferencia un flujo de demo de uno de producción. Make permite agregar manejadores de error en cada módulo: bifurcación condicional cuando algo falla (ir a un módulo de notificación), reintentos automáticos con espera exponencial (intenta una vez, espera dos minutos, intenta de nuevo), y alertas a Slack o WhatsApp cuando el flujo falla más de tres veces seguidas. Sin manejo de errores tu flujo se rompe silenciosamente y descubrís el problema cuando los clientes reclaman.

La programación de horarios cubre tres modalidades. Cron-style: ejecutar a horas específicas ("todos los lunes a las 8 AM"). On-demand: cuando alguien hace clic en un botón o llama un webhook. En tiempo real: cuando ocurre un evento (nuevo correo, fila agregada en Sheets). La elección depende del caso: reportes son cron-style, atención al cliente es tiempo real, generación de contenido bajo pedido es on-demand. Combinar las tres en un solo escenario es posible y común en flujos profesionales.

La construcción en vivo de "Asistente de correo profesional" toma cuarenta minutos. Trigger: nuevo correo en Gmail con etiqueta "responder". Módulo 2: filtrar por remitente (si es del dominio cliente o si es interno). Módulo 3: enviar el cuerpo del correo a OpenAI con prompt que genera borrador de respuesta en español Ecuador. Módulo 4: guardar el borrador como draft en Gmail (no enviar automáticamente). Módulo 5: notificación por WhatsApp al usuario con link al draft. Resultado: cuando llegás a tu computadora, los correos importantes ya tienen borrador esperando tu revisión y aprobación.

El testing antes de poner el flujo en producción es no negociable. La práctica: ejecutar el flujo manualmente con datos de prueba antes de activar el trigger automático, revisar los logs de cada ejecución durante la primera semana, ajustar el prompt según los borradores que el modelo produce. Tres semanas de iteración convierten un flujo correcto en un flujo excelente. Saltarse el testing genera ruido para ti, errores caros para tu negocio y desconfianza en la automatización.

El cierre de la sesión incluye el ejercicio: cada alumno construye su propia versión del asistente de correo profesional. Variantes válidas: WhatsApp en lugar de Gmail, Telegram en lugar de WhatsApp para notificación, Notion en lugar de Sheets para registro. La consigna: el flujo debe estar funcionando al final de la sesión, demostrable con un video corto donde se ve la ejecución end-to-end. Sin demo funcional, no hay aprendizaje real.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Make: tu primer flujo con IA\nMes 1 — Sesión 10\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "Por qué Make", contenido: "• Plan gratis: 1.000 operaciones/mes\n• Interfaz visual intuitiva\n• Conectores con Gmail, WhatsApp, Sheets, Drive, Notion\n\nMejor balance potencia/curva." },
    { titulo: "Make vs competencia", contenido: "vs Zapier: más conectores pero caro\nvs n8n: open-source pero requiere infra\nvs Power Automate: mejor M365 pero menos creativo" },
    { titulo: "Anatomía de escenario", contenido: "• Módulos: cada paso\n• Routers: bifurcación condicional\n• Iteradores: procesar listas\n• Agregadores: juntar resultados" },
    { titulo: "Conectar OpenAI/Claude", contenido: "1. API key (platform.openai.com)\n2. Módulo OpenAI/Anthropic en Make\n3. Prompt con datos del módulo anterior\n\nUsa el modelo más barato que cumpla." },
    { titulo: "Manejo de errores", contenido: "• Bifurcación condicional al fallar\n• Reintentos con espera exponencial\n• Alertas a Slack o WhatsApp tras 3 fallos\n\nSin esto: el flujo se rompe silenciosamente." },
    { titulo: "3 modos de programación", contenido: "Cron-style: lunes 8 AM\nOn-demand: clic o webhook\nTiempo real: nuevo evento\n\nCombinables en un mismo escenario." },
    { titulo: "Asistente de correo (40 min)", contenido: "Gmail nuevo correo etiqueta 'responder' → filtrar remitente → OpenAI genera borrador → guardar draft Gmail → WhatsApp al usuario\n\nResultado: borradores listos al llegar." },
    { titulo: "Testing antes de producción", contenido: "Ejecuta manual con data de prueba.\nRevisa logs primera semana.\nAjusta prompt según borradores.\n\n3 semanas: correcto → excelente." },
  ],
  quiz: [
    { pregunta: "¿Cuál es la principal ventaja de Make sobre Zapier para empezar?", opciones: ["Más conectores", "Plan gratuito más generoso (1.000 ops/mes) e interfaz más visual", "Es de Microsoft", "Soporta más idiomas"], respuesta: 1, explicacion: "Make ofrece plan gratuito generoso e interfaz visual más amigable para no programadores." },
    { pregunta: "¿Qué es un router en Make?", opciones: ["Un trigger temporal", "Bifurcación condicional dentro del flujo", "Un conector externo", "Una API"], respuesta: 1, explicacion: "El router permite ejecutar diferentes ramas del flujo según condiciones evaluadas en tiempo real." },
    { pregunta: "¿Cuál es la práctica recomendada para elegir modelo en un flujo de Make con IA?", opciones: ["Siempre el más caro", "Siempre el más nuevo", "Usar el modelo más barato que cumpla la tarea", "Sortear cada vez"], respuesta: 2, explicacion: "Modelos como GPT-4o-mini o Claude Haiku resuelven tareas simples a una fracción del costo de modelos premium." },
    { pregunta: "¿Cómo deberías manejar un error en un módulo de Make en producción?", opciones: ["Ignorarlo", "Bifurcación condicional, reintentos automáticos y alertas tras 3 fallos seguidos", "Apagar el flujo", "Reiniciar el servidor"], respuesta: 1, explicacion: "Manejo profesional de errores requiere bifurcación, reintentos con espera exponencial y alertas de monitoreo." },
    { pregunta: "Antes de activar un flujo en producción, ¿qué debes hacer?", opciones: ["Activarlo y rezar", "Ejecutar manual con data de prueba, revisar logs primera semana, ajustar prompt", "Pagarle a Make", "Cambiar de modelo"], respuesta: 1, explicacion: "Testing manual + monitoreo de logs + iteración del prompt durante 3 semanas convierten un flujo correcto en excelente." },
  ],
  ejercicio: {
    titulo: "Asistente de correo profesional con Make + OpenAI",
    objetivo: "Construir tu propio asistente de correo: cuando llega un correo etiquetado, IA genera borrador en español Ecuador, se guarda como draft y te notifica por WhatsApp o Telegram.",
    herramientas: "Make.com (gratis) + cuenta OpenAI con USD 5 en créditos + Gmail + WhatsApp Cloud API o Telegram Bot",
    datosEjemplo: "Etiquetas Gmail sugeridas para trigger: 'responder', 'borrador-IA', 'cliente-prioridad'. Las etiquetas se crean fácilmente con la barra lateral de Gmail.",
    pasos: [
      "Crea cuenta gratuita en Make.com y verifica el email",
      "Genera API key en platform.openai.com (carga USD 5 mínimo)",
      "Configura un bot de Telegram (BotFather) o WhatsApp Cloud API",
      "Crea etiqueta 'responder' en Gmail y aplícala manualmente a 3 correos de prueba",
      "Construye el escenario Make: Gmail trigger → OpenAI con prompt de borrador → Gmail crear draft → notificación Telegram/WhatsApp",
      "Prueba con los 3 correos etiquetados y verifica los borradores generados",
      "Graba video de 2 minutos mostrando el flujo end-to-end funcionando",
    ],
    resultado: "Flujo funcional en Make conectando Gmail + OpenAI + Telegram/WhatsApp, demostrable en un video de 2 minutos donde se ve el proceso completo de etiquetado a borrador notificado.",
    criterios: [
      { criterio: "Flujo configurado correctamente con los 4-5 módulos", puntos: 25 },
      { criterio: "Prompt OpenAI bien diseñado (con las 6 capas)", puntos: 20 },
      { criterio: "Borradores generados de calidad profesional", puntos: 20 },
      { criterio: "Manejo de error básico configurado", puntos: 15 },
      { criterio: "Video demostrando el flujo end-to-end", puntos: 20 },
    ],
  },
  recursos: [
    { titulo: "Make — Documentación oficial", url: "https://www.make.com/en/help", tipo: "documentacion", descripcion: "Documentación completa de Make con guías, módulos y ejemplos." },
    { titulo: "OpenAI Platform", url: "https://platform.openai.com/", tipo: "documentacion", descripcion: "Panel oficial de OpenAI para generar API keys y monitorear consumo." },
    { titulo: "Make.com (registro)", url: "https://www.make.com/", tipo: "herramienta", descripcion: "Plataforma principal de automatización visual con plan gratuito de 1.000 operaciones/mes." },
    { titulo: "Telegram BotFather", url: "https://t.me/BotFather", tipo: "herramienta", descripcion: "Bot oficial de Telegram para crear y configurar tu propio bot personal en 5 minutos." },
    { titulo: "Make Academy — Free Course", url: "https://academy.make.com/courses/foundation", tipo: "lectura", descripcion: "Curso gratuito oficial 'Make Foundation' con ejercicios paso a paso para no programadores." },
  ],
};

const sesion11: SesionBootcamp = {
  id: 11,
  titulo: "Conectores avanzados: WhatsApp, Notion, Calendar, Drive",
  modulo: MOD3,
  moduloNum: 3,
  videoEmbed: "",
  videoTitulo: "WhatsApp Cloud API + Notion + Calendar — Flujos avanzados",
  slidesUrl: "https://gamma.app/docs/kfh8vuowmvyuotq",
  teoria: `Los conectores avanzados son lo que distingue una automatización de escritorio (correo, hoja de cálculo) de una automatización que toca el corazón de tu operación (mensajería con clientes, calendario, repositorio de documentos). Cuatro conectores merecen dominio profesional en Ecuador: WhatsApp Cloud API, Notion, Google Calendar y Google Drive. Esta sesión los integra en un flujo único.

WhatsApp Cloud API es la API oficial de Meta y es la única que cumple términos de servicio para uso empresarial profesional. Diferencia clave con WhatsApp Business app: la app es para soporte ligero con interfaz manual; la Cloud API permite enviar y recibir mensajes programáticamente, integrar con CRM, atender mil clientes simultáneos. El costo en 2026 es por conversación: las primeras mil conversaciones de servicio mensuales son gratuitas, después cuesta entre 0.005 y 0.05 dólares por conversación según tipo (utilidad, marketing, autenticación). Para una PYME ecuatoriana con cien clientes activos, el costo mensual es típicamente USD 5-30.

Configurar WhatsApp Cloud API requiere cuenta de desarrollador en Facebook Business, número de teléfono dedicado (no puede ser un número de WhatsApp personal), verificación del negocio (puede tomar uno a tres días), y registrar templates aprobados de mensajes para enviar a usuarios fuera de la ventana de atención de veinticuatro horas. Esta complejidad inicial paga dividendos: una vez configurado, integra con Make, Zapier, n8n y todos los CRMs serios sin fricciones.

Notion como base de datos liviana es una alternativa subestimada a Airtable, Excel y bases SQL. La Notion API permite leer, escribir, actualizar y consultar bases de datos desde cualquier flujo. Casos de uso B2B típicos: CRM ligero (cien a mil contactos), seguimiento de proyectos con tareas y plazos, base de conocimiento que alimenta a un chatbot, registro de logs de flujos automatizados. Ventajas sobre Excel: estructura de datos clara con tipos de campo, multiusuario en tiempo real, vistas filtradas. Limitaciones: hasta cinco mil filas por base sin perder velocidad.

Google Calendar como trigger es una de las automatizaciones más rentables. Cuando se crea o modifica un evento, podés disparar acciones útiles. Casos de uso: confirmaciones automáticas al cliente cuando agenda una reunión, recordatorios día antes con link de Zoom, generación de minutas con IA al terminar la reunión, sincronización con CRM, bloqueo de tiempo de preparación antes de reuniones importantes. La integración requiere autenticación OAuth con scopes mínimos (solo lectura del calendario relevante, no de toda tu cuenta).

Google Drive como trigger habilita flujos de procesamiento de documentos a escala. Cuando se sube un PDF a una carpeta, IA lo resume, extrae datos clave, crea ficha en Notion y notifica al equipo. Aplicaciones reales en Ecuador: estudios jurídicos que procesan contratos entrantes, contadores que ingestan facturas de proveedores, salud privada que organiza historias clínicas escaneadas, recursos humanos que clasifica currículums recibidos. El componente IA hace el trabajo pesado de extraer información estructurada de documentos no estructurados.

Las buenas prácticas de seguridad son obligatorias cuando manejas estos conectores. Scopes mínimos: si tu flujo solo necesita leer un calendario específico, no le des acceso a "todos los calendarios"; si solo escribe en una hoja, no le des acceso a todo Drive. OAuth en lugar de password: nunca pegar contraseña en un campo de Make o Zapier; siempre usar autenticación OAuth que el usuario puede revocar desde su cuenta de Google. Rotación periódica de API keys: cada tres a seis meses generar nuevas y eliminar las viejas. Audit log: revisar qué acciones ha hecho el flujo en las últimas dos semanas como rutina mensual.

La construcción del flujo "Reunión inteligente" combina los cuatro conectores. Trigger: evento Google Calendar marcado con etiqueta "auto-minuta". Acción 1: enviar link de grabación a Read.ai u Otter al iniciar. Acción 2: cuando termina la reunión, recibir transcripción. Acción 3: IA resume y extrae acuerdos en formato estandarizado. Acción 4: subir minuta a Drive en carpeta del proyecto. Acción 5: crear página en Notion con los acuerdos. Acción 6: enviar mensaje WhatsApp al equipo con resumen y próximos pasos. Cinco minutos manuales de cada reunión se convierten en treinta segundos automáticos.

El cierre incluye el ejercicio: construir una segunda automatización personal que use al menos tres conectores distintos. Una opción potente: bot de WhatsApp que responde preguntas frecuentes consultando una base Notion (FAQ). Esto crea valor inmediato para PYMEs con muchos clientes preguntando lo mismo: precios, horarios, ubicación, métodos de pago. La base Notion se actualiza por cualquier persona del equipo sin tocar código y el bot responde 24/7 con la información más reciente.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Conectores avanzados\nMes 1 — Sesión 11\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "4 conectores clave", contenido: "1. WhatsApp Cloud API (Meta oficial)\n2. Notion (base de datos liviana)\n3. Google Calendar (eventos)\n4. Google Drive (documentos)" },
    { titulo: "WhatsApp Cloud API", contenido: "Oficial de Meta, único legal para empresas.\n\nApp: soporte manual ligero\nCloud API: programático, miles simultáneos\n\nPYME 100 clientes ≈ $5-30/mes" },
    { titulo: "Configurar WhatsApp", contenido: "1. Cuenta Facebook Business\n2. Número dedicado\n3. Verificación negocio (1-3 días)\n4. Templates aprobados\n\nIntegra con Make, Zapier, n8n y CRMs." },
    { titulo: "Notion como BD", contenido: "Alternativa a Airtable, Excel, SQL.\n\nCRM ligero, seguimiento, FAQ para chatbot, logs.\n\nLímite cómodo: 5.000 filas/base." },
    { titulo: "Calendar triggers", contenido: "• Confirmaciones automáticas al agendar\n• Recordatorios día antes\n• Minutas con IA al terminar\n• Sincronización con CRM\n• Bloqueo de preparación" },
    { titulo: "Drive triggers", contenido: "PDF subido → IA resume → extrae datos → ficha Notion → notifica equipo\n\nLegal, contable, salud, RRHH." },
    { titulo: "Seguridad obligatoria", contenido: "• Scopes mínimos\n• OAuth (nunca password en campos)\n• Rotación API keys cada 3-6 meses\n• Audit log mensual" },
    { titulo: "Reunión inteligente", contenido: "Calendar etiqueta 'auto-minuta' → Read.ai/Otter → IA resume → Drive minuta → página Notion → WhatsApp equipo\n\n5 min manuales → 30 s automáticos" },
  ],
  quiz: [
    { pregunta: "¿Cuál es la diferencia clave entre WhatsApp Business app y WhatsApp Cloud API?", opciones: ["Ninguna, son lo mismo", "La app es para soporte manual ligero; la Cloud API permite envío programático y atender miles simultáneos", "La app es paga", "La Cloud API es ilegal"], respuesta: 1, explicacion: "La Cloud API es la única vía oficial y legal para uso empresarial profesional con integración programática." },
    { pregunta: "¿Cuál es el límite cómodo de filas en una base Notion antes de perder velocidad?", opciones: ["100", "1.000", "5.000", "1.000.000"], respuesta: 2, explicacion: "Notion mantiene buen rendimiento hasta 5.000 filas por base; más allá conviene migrar a Airtable o BD relacional." },
    { pregunta: "¿Qué es un 'scope mínimo' en seguridad de API?", opciones: ["Dar acceso completo", "Dar solo el permiso estrictamente necesario para la tarea", "Usar password en lugar de OAuth", "No dar permisos"], respuesta: 1, explicacion: "Scope mínimo significa otorgar al flujo solo el permiso necesario (ej: leer un calendario, no todos)." },
    { pregunta: "¿Cuál NO es una aplicación típica de Drive como trigger en PYME ecuatoriana?", opciones: ["Procesar contratos en estudio jurídico", "Ingestar facturas en contabilidad", "Diseñar el logo de la empresa", "Clasificar CVs en RRHH"], respuesta: 2, explicacion: "Diseñar logo no es proceso recurrente automatizable con triggers; los otros tres son casos típicos." },
    { pregunta: "Según la sesión, ¿con qué frecuencia se recomienda rotar las API keys?", opciones: ["Cada día", "Cada 3 a 6 meses", "Cada 5 años", "Nunca"], respuesta: 1, explicacion: "Rotación cada 3-6 meses balancea seguridad con esfuerzo operativo en flujos profesionales." },
  ],
  ejercicio: {
    titulo: "Bot de WhatsApp con FAQ desde Notion",
    objetivo: "Construir una segunda automatización personal que use al menos 3 conectores: WhatsApp + Notion + un tercero (Drive o Calendar). Caso recomendado: bot que responde FAQs leyendo de Notion.",
    herramientas: "Make.com + WhatsApp Cloud API (o Telegram como alternativa simple) + Notion (gratis) + Claude o OpenAI",
    datosEjemplo: "FAQs típicas de PYME en Ecuador: precios y planes, horarios de atención, métodos de pago, ubicación física, política de devolución, cómo agendar reunión, datos de facturación electrónica.",
    pasos: [
      "Crea base Notion con tabla FAQ: campos pregunta, respuesta, categoría, última actualización",
      "Llena la base con mínimo 15 preguntas frecuentes reales de tu negocio",
      "Configura bot WhatsApp Cloud API o de Telegram (más simple para empezar)",
      "Construye flujo Make: mensaje WhatsApp/Telegram entrante → buscar en Notion FAQ similar → IA decide la mejor respuesta → responder al usuario",
      "Si no hay match suficiente, derivar al humano con notificación",
      "Prueba con 10 preguntas reales de tu negocio",
      "Documenta tasa de aciertos y casos donde el bot derivó",
    ],
    resultado: "Bot funcional respondiendo FAQs desde Notion via WhatsApp o Telegram, base con 15+ preguntas, métricas de aciertos vs derivaciones después de 10 pruebas reales.",
    criterios: [
      { criterio: "Base Notion bien estructurada con 15+ FAQs", puntos: 20 },
      { criterio: "Bot funcional con los 3 conectores integrados", puntos: 25 },
      { criterio: "IA decide bien cuándo responder y cuándo derivar", puntos: 25 },
      { criterio: "Pruebas reales documentadas con tasa de aciertos", puntos: 15 },
      { criterio: "Manejo seguro de credenciales (scopes mínimos, OAuth)", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "WhatsApp Cloud API — Meta", url: "https://developers.facebook.com/docs/whatsapp/cloud-api", tipo: "documentacion", descripcion: "Documentación oficial de Meta para WhatsApp Cloud API, incluye guías de templates y costos." },
    { titulo: "Notion API", url: "https://developers.notion.com/", tipo: "documentacion", descripcion: "Documentación oficial de Notion API con ejemplos de lectura, escritura y queries." },
    { titulo: "Notion (free)", url: "https://www.notion.so/", tipo: "herramienta", descripcion: "Plataforma Notion con plan gratuito ilimitado para uso personal y bases pequeñas." },
    { titulo: "Read.ai", url: "https://www.read.ai/", tipo: "herramienta", descripcion: "Herramienta de IA que transcribe y resume reuniones de Zoom, Meet y Teams automáticamente." },
    { titulo: "Google Calendar API — Quickstart", url: "https://developers.google.com/calendar/api/quickstart", tipo: "lectura", descripcion: "Guía oficial de Google para integrar Calendar API en flujos automatizados con OAuth." },
  ],
};

const sesion12: SesionBootcamp = {
  id: 12,
  titulo: "Agentes de IA: cuando la automatización piensa",
  modulo: MOD3,
  moduloNum: 3,
  videoEmbed: "",
  videoTitulo: "Agentes autónomos con Lindy y Strata — Cuándo automatizar y cuándo agentizar",
  slidesUrl: "https://gamma.app/docs/tdm54zhtddq3jgn",
  teoria: `Un agente de IA no es lo mismo que una automatización. La diferencia es radical y entenderla evita gastar dinero en ingeniería innecesaria. Una automatización es determinista: dado el mismo input, produce el mismo output, siguiendo pasos predefinidos. Un agente es no determinista: percibe el entorno, razona sobre las opciones, decide la mejor acción y la ejecuta, todo con autonomía limitada. Cuándo conviene cada uno define la arquitectura de tu solución.

La definición operativa de agente: software que percibe, razona, decide y actúa con autonomía limitada para cumplir un objetivo. Tiene cuatro componentes esenciales. Un LLM como cerebro, encargado del razonamiento. Memoria de corto plazo (contexto de la conversación actual) y de largo plazo (base vectorial con conocimiento histórico, como Pinecone o Weaviate). Herramientas (tools): funciones que el agente puede invocar (buscar en internet, leer correo, escribir en Sheets, ejecutar código). Bucle de razonamiento que permite al agente iterar: pensar, actuar, observar resultado, replantear, hasta cumplir el objetivo.

Los frameworks no-code y low-code permiten construir agentes sin programar. Lindy es la opción más visual y amigable, ideal para automatizar correos, agendas, transcripciones; plan gratuito permite empezar. Manus es similar con foco en tareas profesionales más complejas. Strata, desarrollada por H3L (partner ecuatoriano de ITSEIA), opera con nueve mil documentos profesionales y servicio en diecinueve países; ideal cuando el agente necesita conocimiento jurídico, contable o de salud en español. Relevance AI es la opción más poderosa para casos enterprise, con plan desde USD 19 mensuales.

El costo y el riesgo de un agente mal diseñado es alto. Un agente que entra en bucle infinito puede gastar USD 200 en API en una noche. Caso real: un agente conectado a una API de búsqueda hizo cuatrocientas búsquedas en una hora porque la condición de salida estaba mal especificada. Mitigaciones obligatorias: límite de iteraciones por sesión (máximo diez), límite de gasto diario en USD por agente, alerta cuando se supera el cincuenta por ciento del presupuesto, kill switch manual accesible en menos de treinta segundos. Sin estos guardrails, un agente puede convertirse en un agujero de dinero.

El caso Strata, partner de ITSEIA, ilustra qué hace un agente bien diseñado. Procesa nueve mil documentos profesionales (jurídicos, contables, de salud), sirve a clientes en diecinueve países, toma decisiones diarias sobre cómo responder consultas profesionales con respaldo documental, y tiene memoria persistente por usuario. La experiencia: el cliente hace una pregunta en español ("qué dice el Código del Trabajo del Ecuador sobre el desahucio para un trabajador con cinco años de antigüedad"), el agente busca en su base, razona, responde con la cita exacta y agrega ejemplos de aplicación. Esto se vende desde USD 19.99 mensuales como cerebro digital profesional.

Distinguir cuándo un caso amerita agente vs automatización determinista es la decisión arquitectónica clave. Casos donde la automatización gana: el flujo es lineal y determinista, los pasos son los mismos cada vez, no hay decisiones complejas en el medio. Ejemplos: notificar nuevo lead, mover archivo de carpeta, crear evento en calendario. Casos donde el agente gana: el flujo requiere decisiones contextuales, los pasos varían según la situación, hay incertidumbre sobre qué acción tomar. Ejemplos: priorizar bandeja de entrada, responder consultas profesionales con criterio, planificar agenda óptima.

La construcción en vivo del agente personal con Lindy demuestra los principios. El agente: cada hora revisa el correo del usuario, prioriza por urgencia (cliente prioridad alta vs newsletter), responde lo trivial automáticamente con borradores, agenda lo importante creando recordatorios, y al final del día reporta al usuario qué hizo. Cuatro herramientas conectadas: Gmail, Calendar, base de prioridades en Notion, mensajería para reportar. El agente itera durante el día, aprende patrones del usuario y mejora con la semana.

El criterio para diseñar un agente sigue cinco preguntas. Primero: ¿qué objetivo persigue el agente, en una frase? Segundo: ¿qué herramientas necesita acceso (correo, calendario, web, código)? Tercero: ¿qué memoria requiere (corto plazo solo o también largo plazo)? Cuarto: ¿cuál es el límite de costo aceptable por día? Quinto: ¿cuál es el criterio de éxito medible (tareas completadas, tiempo ahorrado, errores evitados)? Responder estas cinco antes de construir evita arquitecturas sobre-ingenierizadas.

El cierre del módulo 3 es el ejercicio de diseño (no construcción) de un agente para un proceso real del trabajo del alumno. La consigna: especificar objetivo, herramientas, memoria, límites de costo y criterio de éxito en un documento de una página tipo PRD (Product Requirements Document). Este ejercicio sirve dos propósitos: practica la arquitectura de agentes y prepara para el módulo 4, donde se construye un proyecto integrador real.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Agentes de IA\nMes 1 — Sesión 12 (cierre Módulo 3)\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "Automatización vs Agente", contenido: "Automatización: determinista, mismo input → mismo output, pasos fijos\n\nAgente: no determinista, percibe, razona, decide, actúa con autonomía limitada" },
    { titulo: "4 componentes del agente", contenido: "1. LLM como cerebro\n2. Memoria corto + largo plazo\n3. Herramientas (tools)\n4. Bucle de razonamiento" },
    { titulo: "Frameworks no-code", contenido: "• Lindy: visual, amigable, gratis empezar\n• Manus: tareas profesionales complejas\n• Strata (H3L Ecuador): 9k docs, 19 países, $19.99\n• Relevance AI: enterprise desde $19" },
    { titulo: "Costo y riesgo", contenido: "Agente mal diseñado en bucle = USD 200 en una noche.\n\nGuardrails:\n• Máx 10 iteraciones/sesión\n• Límite USD/día\n• Alerta al 50% presupuesto\n• Kill switch en <30s" },
    { titulo: "Caso Strata (H3L)", contenido: "9.000 docs profesionales\n19 países\nMemoria por usuario\n\nResponde consultas legales/contables/salud con cita exacta y ejemplo.\n\nDesde USD 19.99/mes." },
    { titulo: "Cuándo automatización vs agente", contenido: "Automatización gana: lineal, determinista, pasos fijos\n\nAgente gana: decisiones contextuales, pasos variables, incertidumbre" },
    { titulo: "Demo agente personal Lindy", contenido: "Cada hora revisa correo → prioriza → responde trivial → agenda importante → reporta al final del día\n\nGmail + Calendar + Notion + mensajería" },
    { titulo: "5 preguntas de diseño", contenido: "1. Objetivo en 1 frase\n2. Herramientas necesarias\n3. Memoria (corto/largo plazo)\n4. Límite de costo diario\n5. Criterio de éxito medible" },
  ],
  quiz: [
    { pregunta: "¿Cuál es la diferencia esencial entre automatización y agente?", opciones: ["El precio", "Determinista vs no determinista (con autonomía)", "El idioma", "El proveedor"], respuesta: 1, explicacion: "La automatización sigue pasos fijos; el agente percibe, razona y decide con autonomía limitada." },
    { pregunta: "¿Cuál es el riesgo principal de un agente mal diseñado?", opciones: ["Que sea lento", "Que entre en bucle infinito y consuma cientos de USD en API en una noche", "Que use mucho disco", "Que no use IA"], respuesta: 1, explicacion: "Un agente sin guardrails de iteración y costo puede gastar USD 200+ en una noche por loops mal cerrados." },
    { pregunta: "¿Qué framework de agentes está desarrollado por una empresa ecuatoriana partner de ITSEIA?", opciones: ["Lindy", "Manus", "Strata (H3L)", "Relevance AI"], respuesta: 2, explicacion: "Strata, desarrollada por H3L, opera con 9.000 documentos en 19 países como cerebro digital profesional." },
    { pregunta: "¿Cuándo conviene una automatización en lugar de un agente?", opciones: ["Cuando hay decisiones complejas", "Cuando el flujo es lineal, determinista, con pasos fijos", "Siempre", "Nunca"], respuesta: 1, explicacion: "Para flujos lineales y deterministas (notificar lead, mover archivo) la automatización es más simple, barata y predecible." },
    { pregunta: "¿Cuál NO es una de las 5 preguntas de diseño antes de construir un agente?", opciones: ["¿Qué objetivo persigue?", "¿Qué herramientas necesita?", "¿Qué color tendrá la interfaz?", "¿Cuál es el criterio de éxito medible?"], respuesta: 2, explicacion: "El color de la interfaz no es relevante en arquitectura; las 5 son objetivo, herramientas, memoria, costo, éxito." },
  ],
  ejercicio: {
    titulo: "PRD de 1 página para un agente real",
    objetivo: "Diseñar (no construir aún) un agente para un proceso real de tu trabajo, especificando los 5 componentes en un documento de máximo 1 página tipo PRD.",
    herramientas: "Google Docs + plantilla PRD + investigación previa de Lindy o Strata",
    datosEjemplo: "Casos típicos para agente: asistente legal que responde consultas LOPDP, asistente comercial que prioriza leads y agenda demos, asistente médico que prepara historias clínicas, asistente contable que clasifica facturas.",
    pasos: [
      "Elige un proceso real de tu trabajo donde haya decisiones contextuales",
      "Define en 1 frase clara el objetivo del agente (ejemplo: 'priorizar la bandeja de leads y agendar demos con los más calientes')",
      "Lista las herramientas que necesita acceso (correo, calendario, CRM, base interna)",
      "Define memoria: corto plazo solo o también largo plazo con base vectorial",
      "Establece límite de costo diario (típico USD 1-5 para empezar)",
      "Define criterio de éxito medible (ej: % de demos agendadas vs leads procesados)",
      "Documenta riesgos y guardrails (kill switch, alertas, máx iteraciones)",
    ],
    resultado: "Documento de máximo 1 página tipo PRD con: objetivo, herramientas, memoria, límite de costo, criterio de éxito, riesgos y guardrails. Listo para entregar a un desarrollador o tú mismo construir en el módulo 4.",
    criterios: [
      { criterio: "Objetivo claro y específico en 1 frase", puntos: 20 },
      { criterio: "Herramientas listadas con scope mínimo justificado", puntos: 20 },
      { criterio: "Decisión memoria corto/largo plazo argumentada", puntos: 15 },
      { criterio: "Límite de costo diario realista", puntos: 15 },
      { criterio: "Criterio de éxito medible (no vago)", puntos: 15 },
      { criterio: "Riesgos identificados con guardrails específicos", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", tipo: "documentacion", descripcion: "Artículo de ingeniería de Anthropic con patrones validados para construir agentes efectivos." },
    { titulo: "Lindy.ai", url: "https://www.lindy.ai/", tipo: "documentacion", descripcion: "Plataforma de agentes no-code con plan gratuito y conectores con Gmail, Calendar y otros." },
    { titulo: "Strata by H3L", url: "https://strata.h3l.ai/", tipo: "herramienta", descripcion: "Cerebro digital profesional ecuatoriano con 9.000 docs y servicio en 19 países desde USD 19.99/mes." },
    { titulo: "Relevance AI", url: "https://relevanceai.com/", tipo: "herramienta", descripcion: "Plataforma de agentes para casos enterprise con planes desde USD 19/mes." },
    { titulo: "DeepLearning.ai — AI Agents", url: "https://www.deeplearning.ai/short-courses/", tipo: "lectura", descripcion: "Cursos cortos gratuitos de DeepLearning.ai sobre fundamentos de agentes autónomos." },
  ],
};

// ─── MÓDULO 4: Proyecto Integrador del Mes (Sesiones 13-16) ─────────────────

const sesion13: SesionBootcamp = {
  id: 13,
  titulo: "Definición del proyecto: del problema al PRD de 1 página",
  modulo: MOD4,
  moduloNum: 4,
  videoEmbed: "",
  videoTitulo: "Cómo escribir un PRD ganador para tu proyecto integrador",
  slidesUrl: "https://gamma.app/docs/en2unhwcbmrbw1t",
  teoria: `El módulo 4 es donde todo lo aprendido en las tres semanas anteriores se aplica en un proyecto único, real, defendible y publicable. La diferencia entre un alumno que termina con portafolio y uno que termina con notas es la calidad de la definición del proyecto. Esta sesión enseña la disciplina de escribir un PRD (Product Requirements Document) de una página antes de tocar una sola herramienta.

El primer paso es elegir un problema real propio. La consigna: el problema debe ser algo que tú o tu organización viven con dolor recurrente. No imaginar un problema teórico, no copiar un caso de Twitter. Si no podés explicar en treinta segundos a quién le duele este problema y cuántas veces a la semana, no es un problema real para el bootcamp. Tipos de problema válidos: una tarea repetitiva propia, una pregunta frecuente que recibís, un proceso de tu equipo que falla, una oportunidad de servicio que no podés escalar manualmente.

El marco "Job to be done" (Christensen) ayuda a articular el problema. Pregunta clave: cuando alguien usaría tu asistente, ¿qué trabajo está intentando hacer? El framework: "Cuando [situación], yo quiero [motivación], para que [resultado deseado]". Ejemplo concreto: "Cuando recibo una consulta legal sobre LOPDP en WhatsApp, yo quiero respuesta inmediata con la cita legal correcta, para que el cliente perciba mi expertise y avance hacia contratar mis servicios". Este formato fuerza claridad sobre situación, motivación y resultado, evitando definiciones vagas tipo "asistente que ayuda con cosas legales".

La estructura del PRD de una página tiene ocho componentes obligatorios. Contexto: dónde y por qué surge este problema. Problema: qué duele exactamente, idealmente con números (horas, dinero, frecuencia). Usuario: quién es la persona que usa el asistente, no la empresa abstracta. Solución: qué hace tu asistente en una frase clara. Alcance: las tres a cinco capacidades específicas. Fuera de alcance: qué intencionalmente no hace para que no se infle el proyecto. Métricas de éxito: cómo sabrás si funciona. Riesgos: qué podría salir mal y cómo lo mitigás.

La diferencia entre producto, prototipo y demo es crítica para no sobre-prometer. Producto: software listo para entregar valor a usuarios reales sostenidamente, requiere meses. Prototipo: versión funcional limitada que prueba la viabilidad técnica, requiere semanas. Demo: simulación que muestra la idea pero no funciona realmente, requiere horas. Para este proyecto integrador del Mes 1 se busca un MVP funcional (Minimum Viable Product) entre prototipo y producto: hace una cosa bien, con usuarios reales, pero sin todas las features del producto final.

Los criterios de éxito SMART (Específico, Medible, Alcanzable, Relevante, con plazo) son lo que separa un PRD serio de un texto motivacional. Mal: "el asistente debe ser excelente". Bien: "el asistente responde correctamente al menos al setenta y cinco por ciento de las consultas en menos de quince segundos durante el día de demo, con cero alucinaciones de datos legales". Si no podés medir el éxito, no podés saber cuándo terminar de iterar y entrar en bucle infinito de mejoras.

El anti-patrón más común es el "asistente que hace de todo". Profesionales con poca experiencia en producto definen asistentes con quince capacidades. El resultado: ninguna funciona bien, el alcance es imposible de cubrir en cuatro sesiones, la demo final decepciona. La regla profesional: mejor un asistente que haga una sola cosa excepcionalmente bien que diez cosas a medias. Inspirate en Strata: empezó haciendo solo una tarea (responder consultas legales con cita exacta) y se expandió después de dominar esa.

La revisión por pares es el mecanismo de control de calidad. La consigna del ejercicio: cada alumno entrega su PRD revisado por al menos un compañero del bootcamp. El revisor pregunta cinco cosas: ¿el problema es real y específico? ¿el usuario está bien definido? ¿la solución cabe en cuatro sesiones? ¿las métricas son medibles? ¿identificó los riesgos clave? Si el PRD falla en tres de cinco preguntas, el alumno reescribe antes de avanzar. Sin PRD aprobado, no se pasa a la sesión 14. Esta disciplina temprana evita pérdida de semanas en proyectos mal definidos.

El instructor demuestra escribiendo en vivo el PRD de un caso real ecuatoriano: asistente legal que responde consultas LOPDP a clientes pequeños vía WhatsApp. Treinta minutos de redacción frente a la clase, mostrando cada decisión: por qué este problema, por qué este usuario, por qué este alcance, cómo se redactan las métricas. La clase observa el proceso y aprende patrones de pensamiento que aplica luego a sus propios PRDs.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Definición de proyecto: el PRD\nMes 1 — Sesión 13\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "Por qué un PRD", contenido: "La definición predice el éxito.\n\nAlumno con portafolio = PRD de calidad.\nAlumno con notas = se saltó esta sesión." },
    { titulo: "Problema real", contenido: "Tú o tu organización lo viven con dolor recurrente.\n\nNo teórico, no copiado de Twitter.\n\n30 segundos para explicar a quién le duele y cuántas veces/semana." },
    { titulo: "Job to be done", contenido: "Cuando [situación],\nyo quiero [motivación],\npara que [resultado deseado]\n\nFuerza claridad. Evita 'asistente que ayuda'." },
    { titulo: "8 componentes del PRD", contenido: "1. Contexto\n2. Problema (con números)\n3. Usuario\n4. Solución (1 frase)\n5. Alcance (3-5 capacidades)\n6. Fuera de alcance\n7. Métricas de éxito\n8. Riesgos" },
    { titulo: "Producto vs Prototipo vs Demo", contenido: "Producto: meses, valor sostenido a usuarios reales\nPrototipo: semanas, viabilidad técnica\nDemo: horas, idea sin función\n\nMVP funcional = entre prototipo y producto." },
    { titulo: "Métricas SMART", contenido: "Mal: 'debe ser excelente'\n\nBien: 'responde correctamente ≥75% en <15 s en demo, 0 alucinaciones legales'\n\nMedible = sabes cuándo terminar." },
    { titulo: "Anti-patrón", contenido: "Asistente que hace de todo: 15 capacidades, ninguna funciona.\n\nGanadora: 1 cosa excepcional > 10 a medias.\n\nStrata empezó solo con consultas legales." },
    { titulo: "Revisión por pares", contenido: "Otro alumno revisa con 5 preguntas.\n\nFalla 3/5 → reescribir.\n\nSin PRD aprobado, no se avanza." },
  ],
  quiz: [
    { pregunta: "¿Cuál es el formato del marco 'Job to be done'?", opciones: ["Quien-cómo-cuándo", "Cuando [situación], yo quiero [motivación], para que [resultado]", "Inicio-medio-fin", "Problema-solución-precio"], respuesta: 1, explicacion: "El framework de Christensen estructura el problema con situación, motivación y resultado deseado." },
    { pregunta: "¿Cuántos componentes obligatorios tiene el PRD de 1 página enseñado?", opciones: ["3", "5", "8", "20"], respuesta: 2, explicacion: "Los 8 componentes son: contexto, problema, usuario, solución, alcance, fuera de alcance, métricas, riesgos." },
    { pregunta: "¿Qué busca el proyecto integrador del Mes 1?", opciones: ["Un producto comercial completo", "Una demo simulada", "Un MVP funcional entre prototipo y producto", "Un paper académico"], respuesta: 2, explicacion: "El MVP funcional hace una cosa bien con usuarios reales pero sin todas las features del producto final." },
    { pregunta: "¿Cuál es el anti-patrón más común al definir un asistente?", opciones: ["Que sea muy específico", "El asistente que hace de todo (15 capacidades)", "Que tenga métricas SMART", "Tener un usuario claro"], respuesta: 1, explicacion: "Un asistente con muchas capacidades termina haciendo todo a medias; mejor uno que haga una cosa excepcionalmente bien." },
    { pregunta: "¿Qué hace el revisor par para aprobar un PRD?", opciones: ["Da feedback estilístico", "Pregunta 5 cosas; si falla en 3 el alumno reescribe", "Lo aprueba siempre", "Lo califica con nota"], respuesta: 1, explicacion: "El revisor verifica problema real, usuario claro, alcance manejable, métricas medibles y riesgos identificados." },
  ],
  ejercicio: {
    titulo: "Mi PRD de 1 página revisado por par",
    objetivo: "Escribir el PRD de tu proyecto integrador del Mes 1 con los 8 componentes obligatorios y obtener aprobación de un compañero del bootcamp.",
    herramientas: "Google Docs + plantilla PRD ITSEIA + compañero revisor del bootcamp",
    datosEjemplo: "Casos sugeridos en Ecuador: asistente legal LOPDP B2C, asistente comercial para PYME, asistente contable para emprendedores, asistente educativo para colegios privados, asistente de soporte para retail.",
    pasos: [
      "Elige el problema real que vivís en tu trabajo o emprendimiento",
      "Aplica el framework Job to be done para articular situación, motivación y resultado",
      "Redacta los 8 componentes del PRD en máximo 1 página",
      "Define al menos 3 métricas SMART de éxito",
      "Lista 3 cosas que tu asistente NO hará (fuera de alcance)",
      "Identifica los 3 riesgos principales con su mitigación",
      "Pídele a un compañero del bootcamp que revise con las 5 preguntas y reescribí si falla en 3+",
    ],
    resultado: "PRD de 1 página firmado por ti y un compañero revisor, con los 8 componentes claros, métricas SMART, alcance acotado y riesgos identificados.",
    criterios: [
      { criterio: "Problema real, específico y con números", puntos: 20 },
      { criterio: "Usuario bien definido (persona, no empresa)", puntos: 15 },
      { criterio: "Alcance realista para 4 sesiones (no inflado)", puntos: 20 },
      { criterio: "Métricas de éxito SMART", puntos: 20 },
      { criterio: "Riesgos identificados con mitigación", puntos: 15 },
      { criterio: "Aprobación documentada de un compañero", puntos: 10 },
    ],
  },
  recursos: [
    { titulo: "Marty Cagan — Inspired (extracto PRD)", url: "https://www.svpg.com/articles/", tipo: "documentacion", descripcion: "Artículos de Silicon Valley Product Group con plantillas y patrones de PRDs profesionales." },
    { titulo: "Christensen — Jobs to be Done", url: "https://hbr.org/2016/09/know-your-customers-jobs-to-be-done", tipo: "documentacion", descripcion: "Artículo HBR de Clayton Christensen sobre el marco Jobs to be Done aplicado a producto." },
    { titulo: "Notion — Plantillas de PRD", url: "https://www.notion.so/templates/category/product-management", tipo: "herramienta", descripcion: "Plantillas Notion gratuitas de PRDs usadas por equipos de producto en startups." },
    { titulo: "Lenny's Newsletter — Templates", url: "https://www.lennysnewsletter.com/p/templates", tipo: "herramienta", descripcion: "Plantillas de PRDs y product specs de Lenny Rachitsky con ejemplos de empresas reales." },
    { titulo: "First Round Review — Product", url: "https://review.firstround.com/the-power-of-the-prfaq-the-amazon-leadership-tool-revealed-and-explained/", tipo: "lectura", descripcion: "Caso del PR/FAQ de Amazon como variante poderosa del PRD para forzar claridad antes de construir." },
  ],
};

const sesion14: SesionBootcamp = {
  id: 14,
  titulo: "Construcción guiada del MVP, parte 1: ingesta y razonamiento",
  modulo: MOD4,
  moduloNum: 4,
  videoEmbed: "",
  videoTitulo: "Construyendo el cerebro del asistente — System prompt y RAG simple",
  slidesUrl: "https://gamma.app/docs/wehw2ahshtl1esm",
  teoria: `Con el PRD aprobado en la sesión anterior, esta sesión construye el cerebro del asistente: la fuente de datos, el system prompt maestro y la batería de pruebas de razonamiento. Tres componentes que, una vez calibrados, definen la calidad del asistente más que cualquier otra decisión técnica posterior.

La decisión sobre fuente de datos depende del volumen y la naturaleza del conocimiento. Cuatro opciones por orden de complejidad creciente. Primero: archivo plano (Markdown o texto), ideal cuando todo el conocimiento cabe en cinco a quince mil tokens y se incluye directamente en el system prompt. Segundo: base Notion u otra base de datos liviana, cuando el conocimiento es estructurado y cabe en cien a cinco mil filas. Tercero: base de datos relacional (PostgreSQL, MySQL), cuando el conocimiento es transaccional. Cuarto: RAG simple (Retrieval Augmented Generation) con base vectorial como Pinecone, Weaviate o Chroma, cuando el conocimiento supera quince mil tokens y necesita búsqueda semántica.

Para el proyecto integrador del Mes 1, la mayoría de alumnos elige opción uno o dos: archivo plano o base Notion. Esta es la elección correcta: empezar simple, validar, complejizar después. Caso típico: asistente legal LOPDP. Conocimiento: el texto de la LOPDP (treinta páginas), preguntas frecuentes con respuestas (veinte items), plantillas de respuestas (cinco tipos). Total: alrededor de veinte mil tokens. Solución: dividir en archivo de contexto base (LOPDP completa) más Notion para FAQs y plantillas que el equipo puede actualizar sin tocar código.

La anatomía del system prompt maestro tiene cinco secciones obligatorias. Identidad: quién es la IA, su rol, su voz. Conocimiento base: el contenido o referencia al contenido autorizado. Reglas duras: qué jamás debe hacer (no inventar leyes, no dar consejos médicos, no responder fuera del alcance). Tono: formal/cercano, español Ecuador, uso de tú o usted. Qué hacer ante incertidumbre: cómo reconocer cuando no sabe y derivar al humano. Un system prompt profesional cabe en quinientas a mil palabras y se itera durante el ciclo completo del proyecto.

La técnica del guard rail es lo que protege al asistente de errores caros. Un guard rail es una restricción explícita que el modelo debe respetar siempre. Ejemplos para el asistente legal: "Nunca cites jurisprudencia que no esté explícitamente en tu base de conocimiento. Si la pregunta requiere jurisprudencia que no tenés, respondé que necesitas consultar al abogado". Sin guard rails, el modelo alucina con confianza y eso es lo que hace caer a profesionales en sanciones. Un guard rail vale más que diez mejoras de prompt.

Las pruebas de razonamiento son el momento de la verdad. La técnica: tres categorías de diez preguntas cada una. Primera categoría: preguntas tipo, lo que un usuario real preguntaría con frecuencia (ejemplo legal: ¿qué dice la LOPDP sobre datos sensibles?). Segunda categoría: preguntas trampa, intentos del usuario por sacar al asistente fuera de su alcance o hacerlo alucinar (ejemplo: ¿qué dice el artículo 250 de la LOPDP? — cuando ese artículo no existe). Tercera categoría: preguntas fuera de alcance, donde el asistente debe reconocer y derivar (ejemplo: ¿me podés ayudar con un divorcio?).

La métrica de calidad inicial es la tasa de respuestas aceptables sobre el total. Con un buen system prompt, el primer pase suele estar entre cincuenta y setenta por ciento. Con iteración (ajuste del prompt según los errores observados), se llega a ochenta y cinco a noventa y cinco por ciento en una semana de trabajo. Sin pruebas estructuradas no podés saber si tu asistente mejora o empeora con cada cambio. La hoja de cálculo simple con pregunta, respuesta esperada, respuesta obtenida, evaluación binaria (acepta/rechaza) es suficiente para empezar.

La construcción en vivo del cerebro del asistente legal toma cuarenta minutos. System prompt de seiscientas palabras (identidad de abogado LOPDP en Ecuador, conocimiento base referenciado, cinco reglas duras, tono formal pero cercano, guía ante incertidumbre). Base de conocimiento de cinco documentos cargados al contexto. Treinta preguntas de prueba ejecutadas. Tasa de aciertos del primer pase: setenta y dos por ciento. Tres iteraciones del system prompt agregando guard rails específicos. Tasa final: noventa y tres por ciento. Documentación de los tres errores restantes para la próxima iteración.

El cierre incluye el ejercicio: cada alumno construye su system prompt y base de conocimiento, ejecuta su batería de pruebas de mínimo veinte preguntas, y entrega un reporte con tasa de aciertos por categoría. La consigna mide si el asistente está listo para la sesión siguiente, donde se conecta con el canal de usuarios y se publica. Sin tasa de aciertos por encima del setenta y cinco por ciento, el alumno no avanza: itera el prompt antes de publicar.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Construyendo el MVP — parte 1\nMes 1 — Sesión 14\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "3 componentes clave", contenido: "1. Fuente de datos\n2. System prompt maestro\n3. Batería de pruebas" },
    { titulo: "4 opciones de fuente", contenido: "1. Archivo plano (≤15k tokens)\n2. Notion u otra BD liviana (100-5k filas)\n3. BD relacional\n4. RAG con base vectorial (>15k tokens)" },
    { titulo: "Para Mes 1: opción 1 o 2", contenido: "Empezar simple, validar, complejizar después.\n\nCaso legal LOPDP: archivo de contexto + Notion para FAQs y plantillas." },
    { titulo: "5 secciones del system prompt", contenido: "1. Identidad\n2. Conocimiento base\n3. Reglas duras\n4. Tono\n5. Qué hacer ante incertidumbre\n\n500-1.000 palabras." },
    { titulo: "Guard rails", contenido: "Restricciones explícitas inquebrantables.\n\n'Nunca cites jurisprudencia que no esté en tu base.'\n\nUn guard rail vale más que 10 mejoras de prompt." },
    { titulo: "3 categorías de prueba", contenido: "10 preguntas tipo (frecuentes)\n10 preguntas trampa (sacar fuera de alcance)\n10 preguntas fuera de alcance (debe derivar)" },
    { titulo: "Métricas de calidad", contenido: "Primer pase: 50-70%\nIteración semanal: 85-95%\n\nHoja: pregunta, esperada, obtenida, acepta/rechaza." },
    { titulo: "Demo asistente legal", contenido: "Prompt 600 palabras + 5 docs base.\n30 preguntas de prueba.\n1er pase: 72%.\n3 iteraciones con guard rails: 93%." },
  ],
  quiz: [
    { pregunta: "¿Cuál es la fuente de datos recomendada para empezar el proyecto del Mes 1?", opciones: ["Base vectorial con RAG", "Archivo plano o base Notion según volumen", "Base de datos PostgreSQL", "API empresarial"], respuesta: 1, explicacion: "Empezar simple con archivo plano o Notion permite validar antes de complejizar la arquitectura." },
    { pregunta: "¿Cuántas secciones tiene un system prompt maestro profesional?", opciones: ["1", "3", "5", "10"], respuesta: 2, explicacion: "Las 5 secciones son: identidad, conocimiento base, reglas duras, tono, y qué hacer ante incertidumbre." },
    { pregunta: "¿Qué es un guard rail en un system prompt?", opciones: ["Una mejora cosmética", "Una restricción explícita inquebrantable que protege de errores caros", "Un conector con base de datos", "Un tipo de modelo"], respuesta: 1, explicacion: "Los guard rails previenen alucinaciones y errores con consecuencias graves (legales, médicas, financieras)." },
    { pregunta: "¿Cuántas categorías de preguntas tiene la batería de pruebas?", opciones: ["1", "2", "3", "10"], respuesta: 2, explicacion: "Las 3 categorías son: preguntas tipo (10), preguntas trampa (10) y preguntas fuera de alcance (10)." },
    { pregunta: "¿Cuál es la tasa mínima de aciertos para avanzar a la sesión 15?", opciones: ["25%", "50%", "75%", "100%"], respuesta: 2, explicacion: "Sin tasa por encima del 75%, el alumno itera el prompt antes de publicar el asistente." },
  ],
  ejercicio: {
    titulo: "Cerebro del asistente con tasa de aciertos ≥75%",
    objetivo: "Construir el system prompt maestro de tu asistente, cargar la base de conocimiento, ejecutar 20-30 preguntas de prueba y alcanzar tasa de aciertos ≥75% antes de avanzar.",
    herramientas: "Claude.ai (Projects) o ChatGPT (Custom GPTs) + Google Sheets para la batería + tu base de conocimiento",
    datosEjemplo: "Estructura recomendada del system prompt: identidad (rol, voz) + conocimiento (referencia o pegado) + reglas duras (5-7 mínimo) + tono (Ecuador, usted/tú) + incertidumbre (cómo derivar).",
    pasos: [
      "Redacta el system prompt maestro de 500-1.000 palabras con las 5 secciones",
      "Define al menos 5 reglas duras (guard rails) específicas para tu dominio",
      "Carga la base de conocimiento (archivo plano o referencia a Notion)",
      "Diseña la batería de 30 preguntas: 10 tipo + 10 trampa + 10 fuera de alcance",
      "Define la respuesta esperada para cada pregunta antes de probar",
      "Ejecuta las 30 preguntas y registra acepta/rechaza con justificación",
      "Itera el system prompt hasta alcanzar ≥75% global de aciertos",
    ],
    resultado: "System prompt v2+ con tasa de aciertos ≥75%, base de conocimiento documentada, 30 pruebas ejecutadas con resultados, y reporte de los 3-5 errores restantes para próxima iteración.",
    criterios: [
      { criterio: "System prompt completo con las 5 secciones", puntos: 20 },
      { criterio: "5+ guard rails específicos del dominio", puntos: 20 },
      { criterio: "Batería de 30 preguntas con respuesta esperada", puntos: 20 },
      { criterio: "Tasa de aciertos ≥75%", puntos: 25 },
      { criterio: "Análisis de errores restantes con plan de iteración", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "Anthropic — Crafting effective prompts", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", tipo: "documentacion", descripcion: "Guía oficial de Anthropic para crear system prompts efectivos con ejemplos por caso." },
    { titulo: "OpenAI — Custom GPTs", url: "https://help.openai.com/en/articles/8554407-gpts-faq", tipo: "documentacion", descripcion: "Documentación oficial sobre Custom GPTs, ideal para construir tu asistente sin código." },
    { titulo: "Claude Projects", url: "https://claude.ai/", tipo: "herramienta", descripcion: "Funcionalidad de Claude que permite crear asistentes con system prompt y base de conocimiento persistente." },
    { titulo: "Anthropic Workbench", url: "https://console.anthropic.com/workbench", tipo: "herramienta", descripcion: "Playground para probar system prompts con ejecución batch sobre múltiples casos." },
    { titulo: "Promptfoo — Testing prompts", url: "https://www.promptfoo.dev/docs/getting-started", tipo: "lectura", descripcion: "Documentación de Promptfoo para automatizar baterías de pruebas sobre system prompts." },
  ],
};

const sesion15: SesionBootcamp = {
  id: 15,
  titulo: "Construcción guiada del MVP, parte 2: integración y publicación",
  modulo: MOD4,
  moduloNum: 4,
  videoEmbed: "",
  videoTitulo: "Publicando tu asistente IA en WhatsApp, web o Slack",
  slidesUrl: "https://gamma.app/docs/7r7ffenh1ceaa37",
  teoria: `El asistente con tasa de aciertos del setenta y cinco por ciento o más está listo para conectarse con usuarios reales. Esta sesión cubre tres tareas clave: elegir el canal correcto, embeber el asistente en ese canal, y agregar logging para monitorear y mejorar continuamente. Sin estas tres tareas, el asistente queda como demo personal sin valor profesional.

La decisión de canal sigue tres criterios prácticos. Primer criterio: dónde está tu audiencia. En Ecuador, WhatsApp domina el contacto cliente-empresa con más del noventa por ciento de adopción; ningún otro canal se acerca para B2C masivo. Web embebido es ideal cuando ya tenés tráfico en tu landing y querés capturar interés sin pedir el número. Slack interno es la opción para asistentes corporativos que sirven a empleados. Telegram funciona como alternativa técnica simple cuando WhatsApp Cloud API es muy complejo de configurar.

El embed simple en una landing existente requiere menos de cincuenta líneas de código JavaScript. Plataformas como Chatbase, Voiceflow y Botpress generan el script automáticamente con los siguientes pasos: crear cuenta, subir tu base de conocimiento o conectar tu API, copiar el código de embed, pegarlo en el HTML de tu landing antes del cierre del body. En cinco minutos tenés un widget de chat funcional. Costos: planes gratuitos hasta cincuenta mensajes mensuales, planes pagos desde USD 19 con miles de mensajes. Para tu MVP del Mes 1, el plan gratuito es suficiente.

Para el canal WhatsApp Cloud API, la integración es más compleja pero el ROI es mayor. Pasos: cuenta Facebook Business, número dedicado, verificación, configuración del webhook que recibe mensajes entrantes, código que procesa el mensaje y llama tu LLM con el system prompt, código que envía la respuesta de vuelta. Hay servicios intermedios (Vonage, Twilio, Sirena) que simplifican esto pagando una comisión por mensaje. Para empezar y validar, conviene usar uno de esos servicios; para escala, integrar directo.

Para Slack interno, la complejidad técnica es media y la utilidad inmediata. Pasos: crear app en api.slack.com, configurar bot scopes (leer mensajes, escribir, reaccionar), instalar la app en tu workspace, código que escucha menciones (cuando alguien escribe "@asistente pregunta") y responde usando tu system prompt. Caso típico: asistente RRHH que responde preguntas sobre políticas internas, vacaciones, beneficios. Reduce significativamente la carga del equipo de RRHH para preguntas repetitivas.

El logging mínimo es no negociable. Cada conversación debe registrarse con cinco campos: timestamp, identificador de usuario (anonimizable), pregunta enviada, respuesta del asistente, evaluación post-hoc (acepta/rechaza). Storage simple: una hoja de cálculo Google con append automático desde Make o Zapier. Storage profesional: una base de datos en Supabase, Firebase o similar. El logging no es para auditoría legal solo: es la materia prima para mejorar el asistente. Sin logs no podés iterar con datos reales.

La iteración semanal es el ritual que distingue un asistente que mejora de uno que se estanca. Cada lunes (o el día que elijas), revisás los logs de la semana, identificás los tres a cinco errores más frecuentes o más caros, ajustás el system prompt o la base de conocimiento para evitarlos, y volvés a ejecutar la batería de pruebas para confirmar que las correcciones no rompen otras cosas. Tres semanas de iteración disciplinada llevan al asistente del setenta y cinco al noventa y cinco por ciento de aciertos.

El cálculo de pricing operacional es lo que te permite vender el asistente o justificar su mantenimiento internamente. La fórmula: costo de tokens por conversación promedio × número de conversaciones esperadas mensualmente, más costos fijos (Chatbase, plataforma de mensajería). Caso ejemplo: asistente que procesa cien conversaciones diarias con quinientos tokens promedio cada una en GPT-4o cuesta aproximadamente USD 75 mensuales en API más USD 19 de Chatbase = USD 94 totales. Si el asistente ahorra veinte horas semanales del equipo, el ROI es sobrado.

La publicación del asistente legal en tres canales paralelos cierra la sesión: web (chatbot embebido en una landing simple creada con Notion o Carrd), WhatsApp Business y Slack interno. Cinco pruebas reales en cada canal frente a la clase, mostrando consistencia de respuestas, latencia y calidad. El ejercicio para casa: publicar tu propio asistente, abrirlo a cinco personas reales (compañeros del bootcamp, colegas o familia), y recolectar feedback estructurado en cuarenta y ocho horas. Sin usuarios reales evaluando, no se considera publicado.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Integración y publicación\nMes 1 — Sesión 15\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "3 tareas clave", contenido: "1. Elegir canal correcto\n2. Embeber en el canal\n3. Logging para monitorear y mejorar" },
    { titulo: "Decisión de canal", contenido: "WhatsApp: B2C Ecuador (>90% adopción)\nWeb embed: ya tenés tráfico\nSlack: corporativo interno\nTelegram: alternativa simple a WhatsApp" },
    { titulo: "Web embed (50 líneas JS)", contenido: "Chatbase, Voiceflow, Botpress\n\n1. Cuenta\n2. Subir base de conocimiento\n3. Copiar script\n4. Pegar en HTML antes de </body>\n\nGratis hasta 50 msg/mes." },
    { titulo: "WhatsApp Cloud API", contenido: "Facebook Business + número + verificación + webhook + código del LLM\n\nServicios intermedios: Vonage, Twilio, Sirena (comisión por mensaje)" },
    { titulo: "Slack interno", contenido: "api.slack.com → app → scopes → instalar → código que escucha @asistente\n\nIdeal RRHH: políticas, vacaciones, beneficios." },
    { titulo: "Logging mínimo", contenido: "5 campos por conversación:\ntimestamp · usuario · pregunta · respuesta · evaluación\n\nGoogle Sheets via Make o Supabase para producción." },
    { titulo: "Iteración semanal", contenido: "Lunes: revisar logs.\n3-5 errores más frecuentes.\nAjustar prompt o base.\nRe-ejecutar batería.\n\n3 semanas: 75% → 95%." },
    { titulo: "Pricing operacional", contenido: "100 conv/día × 500 tokens × GPT-4o ≈ USD 75 + plataforma ≈ USD 94/mes\n\nSi ahorra 20h/semana del equipo: ROI sobrado." },
  ],
  quiz: [
    { pregunta: "¿Cuál es el canal dominante de contacto cliente-empresa en Ecuador?", opciones: ["Email", "WhatsApp (>90% adopción)", "SMS", "Llamada telefónica"], respuesta: 1, explicacion: "WhatsApp tiene más del 90% de adopción y domina B2C masivo en Ecuador." },
    { pregunta: "¿Cuál NO es una plataforma típica para web embed simple?", opciones: ["Chatbase", "Voiceflow", "Photoshop", "Botpress"], respuesta: 2, explicacion: "Photoshop es editor de imágenes, no plataforma de chatbot embebido." },
    { pregunta: "¿Cuántos campos mínimos debe registrar el logging por conversación?", opciones: ["2", "5", "20", "100"], respuesta: 1, explicacion: "Los 5 campos mínimos son timestamp, usuario, pregunta, respuesta y evaluación post-hoc." },
    { pregunta: "¿Cuál es la utilidad principal del logging según la sesión?", opciones: ["Solo auditoría legal", "Materia prima para iterar y mejorar el asistente con datos reales", "Vender datos", "Ocupar disco duro"], respuesta: 1, explicacion: "El logging permite identificar errores frecuentes y mejorar system prompt o base con cada iteración semanal." },
    { pregunta: "¿Qué se considera 'publicado' para efectos del bootcamp?", opciones: ["Tener un link funcionando", "Tener al menos 5 personas reales evaluando con feedback estructurado", "Tener la idea escrita", "Solo un demo grabado"], respuesta: 1, explicacion: "Sin usuarios reales evaluando, el asistente no se considera publicado en sentido profesional." },
  ],
  ejercicio: {
    titulo: "Asistente publicado con 5 usuarios reales evaluando",
    objetivo: "Publicar tu asistente en al menos 1 canal real (web, WhatsApp, Slack o Telegram), abrirlo a 5 usuarios de prueba y recolectar feedback estructurado en 48 horas.",
    herramientas: "Chatbase o Voiceflow (web) o Make + WhatsApp Cloud API o Telegram + Google Forms para feedback",
    datosEjemplo: "Plantilla de feedback: ¿qué preguntaste?, ¿la respuesta fue útil (1-5)?, ¿detectaste algún error o alucinación?, ¿usarías esto en tu trabajo?, ¿qué mejorarías?.",
    pasos: [
      "Elige el canal según tu audiencia: web embed (más simple) o WhatsApp/Telegram (más impacto)",
      "Configura la plataforma elegida y conecta tu system prompt v2+",
      "Implementa logging mínimo a Google Sheets con los 5 campos",
      "Identifica 5 personas reales (compañeros bootcamp, colegas, familia)",
      "Envíales el link o número con instrucciones claras y un Google Forms de feedback",
      "Recolecta feedback durante 48 horas sin intervenir",
      "Documenta los logs y el feedback en un reporte de 1 página",
    ],
    resultado: "Asistente publicado y accesible públicamente, 5 usuarios reales evaluándolo en 48 horas, logs estructurados de las conversaciones y reporte de feedback para iteración.",
    criterios: [
      { criterio: "Asistente publicado y accesible (link funcional)", puntos: 25 },
      { criterio: "Logging estructurado funcionando (5 campos)", puntos: 20 },
      { criterio: "5 usuarios reales habiendo probado en 48 horas", puntos: 20 },
      { criterio: "Feedback estructurado recolectado vía Forms", puntos: 15 },
      { criterio: "Reporte de 1 página con plan de iteración", puntos: 20 },
    ],
  },
  recursos: [
    { titulo: "Chatbase — Build AI chatbots", url: "https://www.chatbase.co/", tipo: "documentacion", descripcion: "Plataforma para crear chatbots embedibles desde tu base de conocimiento con plan gratuito." },
    { titulo: "Voiceflow", url: "https://www.voiceflow.com/", tipo: "documentacion", descripcion: "Plataforma visual para diseñar y publicar chatbots conversacionales en múltiples canales." },
    { titulo: "Slack API", url: "https://api.slack.com/start", tipo: "herramienta", descripcion: "Documentación oficial de Slack API para crear apps y bots internos." },
    { titulo: "Supabase", url: "https://supabase.com/", tipo: "herramienta", descripcion: "Backend open-source con base de datos Postgres y plan gratuito generoso, ideal para logs profesionales." },
    { titulo: "Google Forms — Feedback templates", url: "https://docs.google.com/forms/", tipo: "lectura", descripcion: "Editor de formularios de Google con plantillas listas para feedback estructurado de usuarios." },
  ],
};

const sesion16: SesionBootcamp = {
  id: 16,
  titulo: "Demo Day del Mes 1: presentación y evaluación cruzada",
  modulo: MOD4,
  moduloNum: 4,
  videoEmbed: "",
  videoTitulo: "Demo Day — Pitch de 5 minutos para tu proyecto IA",
  slidesUrl: "https://gamma.app/docs/qynggtzmhz9zea9",
  teoria: `El Demo Day cierra el Mes 1 y es el evento más importante del bootcamp para tu portafolio. Cinco minutos de presentación frente a un jurado simulado (instructor más compañeros) deciden si tu proyecto se mueve a la siguiente fase con confianza o regresás a iterar. Esta sesión enseña la estructura del pitch, las técnicas de storytelling, la preparación de demo y la rúbrica de evaluación cruzada.

La estructura del pitch de cinco minutos es rígida y probada. Primer bloque, problema (cuarenta y cinco segundos): describí a la persona afectada y el dolor concreto, con números si los tenés (cuántas horas pierde, cuánto dinero deja de ganar). Segundo bloque, solución (sesenta segundos): qué hace tu asistente en una sola frase, seguida de cómo lo hace en tres puntos. Tercer bloque, demo en vivo (ciento veinte segundos): mostrás el asistente funcionando con tres consultas reales, no scripted, eligiendo casos representativos. Cuarto bloque, métricas (cuarenta y cinco segundos): tasa de aciertos, tiempo ahorrado, retroalimentación de los cinco usuarios. Quinto bloque, próximos pasos (treinta segundos): qué iterás, cómo escalás, qué necesitás para llevarlo a producción.

El storytelling profesional empieza por la persona afectada, no por la tecnología. Mal: "Construí un asistente con GPT-4 y RAG". Bien: "María es contadora de cinco PYMEs en Quito. Cada mes pasa quince horas respondiendo preguntas idénticas de sus clientes sobre cuándo presentar declaraciones, qué documentos necesitan, cómo facturar. Quince horas por las que cobra cero. Mi asistente le devuelve esas quince horas". La diferencia: la primera versión te pinta como técnico, la segunda como emprendedor que entiende un problema real. Los inversores y empleadores prefieren la segunda.

La preparación de la demo en vivo es donde más fracasan los pitches. Tres reglas. Primera: probá la demo cinco veces antes del Demo Day, no asumas que funciona porque funcionó ayer. Segunda: tené un backup grabado en video por si la demo en vivo falla (internet caído, API saturada, error inesperado). Tercera: elegí tres casos que muestren rangos: una pregunta fácil donde el asistente brilla, una pregunta difícil donde aún brilla, una pregunta fuera de alcance donde demuestra criterio derivando al humano. Estas tres demuestran que pensaste en bordes, no solo en lo fácil.

La rúbrica de evaluación cruzada tiene cinco dimensiones con peso igual. Claridad del problema: ¿el problema está bien definido y es real? Calidad técnica: ¿el asistente funciona, está bien diseñado, tiene guard rails? Experiencia de usuario: ¿es fácil usarlo, las respuestas son útiles, el tono es apropiado? Métricas: ¿hay datos reales que validan el éxito o son afirmaciones vagas? Presentación: ¿la presentación es clara, profesional, dentro del tiempo? Cada dimensión se califica de uno a cinco. Total máximo: veinticinco puntos. Aprobado: dieciocho o más.

Cómo recibir crítica es una habilidad profesional subestimada. Tres principios. Primero: tomá notas, no respondás defensivamente; el feedback es información, procesalo después. Segundo: agradecé al final aunque la crítica sea dura; los que se molestan reciben menos feedback futuro. Tercero: separá el feedback útil del ruido; no todo comentario merece cambio en tu asistente. Esta disciplina diferencia a profesionales que mejoran rápido de los que se estancan defendiendo cada decisión.

El video de tres minutos resumen del proyecto, publicado en LinkedIn etiquetando a ITSEIA, pasa a ser parte de tu portafolio público y es uno de los siete entregables del Mes 1. Estructura del video: treinta segundos del problema, sesenta segundos del asistente funcionando con un caso real, sesenta segundos de métricas y aprendizajes, treinta segundos de cierre con call to action (próximos pasos, búsqueda de feedback, oferta de ayuda a otros). Subtítulos quemados (porque mucha gente lo verá sin audio), formato vertical o cuadrado para que funcione en mobile, miniatura llamativa.

La demo de un proyecto modelo (alumno destacado o caso preparado por el instructor) sirve como referencia. Lo que se nota: cómo el storytelling te involucra emocionalmente, cómo la demo se ejecuta sin tropiezos, cómo las métricas son específicas y verificables, cómo las preguntas del jurado se responden con humildad y claridad, cómo el alumno usa "no sé, lo investigaré" en lugar de inventar respuestas. Estas conductas son aprendidas, no innatas, y son lo que se práctica deliberadamente en esta sesión.

El cierre del Mes 1 es la satisfacción de tener tu portafolio mínimo: documento del sector y la IA, stack personal, política de uso responsable, biblioteca de prompts, tres automatizaciones funcionando, asistente publicado, video en LinkedIn. Siete entregables que ningún otro programa de cuatro semanas en Ecuador entrega con este nivel de profundidad. Estos siete entregables son tu credencial profesional para entrar al Mes 2 (Python aplicado e ML) con base sólida y para vender consultorías mientras seguís estudiando.`,
  presentacionSlides: [
    { titulo: "Portada", contenido: "Demo Day del Mes 1\nMes 1 — Sesión 16 (cierre)\nITSEIA — Bootcamp Intensivo de IA" },
    { titulo: "Pitch de 5 minutos", contenido: "1. Problema (45 s)\n2. Solución (60 s)\n3. Demo en vivo (120 s)\n4. Métricas (45 s)\n5. Próximos pasos (30 s)" },
    { titulo: "Storytelling profesional", contenido: "Empieza por la persona afectada, no la tecnología.\n\nMal: 'Construí asistente con GPT-4'\nBien: 'María, contadora de 5 PYMEs en Quito, pierde 15h/mes...'" },
    { titulo: "Preparación de demo", contenido: "1. Probá 5 veces antes del Demo Day\n2. Backup grabado en video\n3. 3 casos: fácil, difícil, fuera de alcance\n\nMostrar bordes = pensaste como profesional." },
    { titulo: "Rúbrica de evaluación", contenido: "5 dimensiones, peso igual, 1-5 cada una:\n• Claridad del problema\n• Calidad técnica\n• Experiencia de usuario\n• Métricas reales\n• Presentación\n\nMáx 25, aprobado ≥18." },
    { titulo: "Recibir crítica", contenido: "1. Tomá notas, no respondás defensivamente\n2. Agradecé aunque sea duro\n3. Separá útil del ruido\n\nLos que se molestan reciben menos feedback futuro." },
    { titulo: "Video LinkedIn 3 min", contenido: "30 s problema · 60 s demo · 60 s métricas · 30 s cierre\n\nSubtítulos quemados, vertical o cuadrado, miniatura llamativa.\n\nEtiquetá a ITSEIA." },
    { titulo: "Tu portafolio Mes 1 (7)", contenido: "1. Doc Mi sector y la IA\n2. Stack personal\n3. Política uso responsable\n4. Biblioteca 20+ prompts\n5. 3 automatizaciones\n6. Asistente publicado\n7. Video LinkedIn" },
    { titulo: "Próximo: Mes 2", contenido: "Python aplicado a IA + Fundamentos de Machine Learning\n\nFelicitaciones por cerrar el Mes 1.\n\nitseia.ai" },
  ],
  quiz: [
    { pregunta: "¿Cuántos segundos dura el bloque de demo en vivo en el pitch de 5 minutos?", opciones: ["30", "60", "120", "300"], respuesta: 2, explicacion: "120 segundos (2 minutos) de demo en vivo permiten mostrar 3 casos representativos." },
    { pregunta: "Según el principio de storytelling profesional, ¿con qué se debe empezar el pitch?", opciones: ["Con la tecnología usada", "Con la persona afectada y su dolor concreto", "Con el precio", "Con el equipo"], respuesta: 1, explicacion: "Empezar con la persona afectada genera conexión emocional; la tecnología viene después." },
    { pregunta: "¿Cuántos casos se recomienda mostrar en la demo en vivo?", opciones: ["1", "3 (fácil, difícil, fuera de alcance)", "10", "50"], respuesta: 1, explicacion: "3 casos cubren los rangos: facilidad, dificultad y bordes (cuando deriva al humano)." },
    { pregunta: "¿Cuántas dimensiones tiene la rúbrica de evaluación cruzada?", opciones: ["3", "5", "10", "20"], respuesta: 1, explicacion: "Las 5 dimensiones son: problema, calidad técnica, experiencia de usuario, métricas y presentación." },
    { pregunta: "¿Cuántos entregables conforman el portafolio mínimo del Mes 1?", opciones: ["3", "5", "7", "12"], respuesta: 2, explicacion: "Los 7 entregables son: doc sector, stack, política, biblioteca prompts, 3 automatizaciones, asistente, video LinkedIn." },
  ],
  ejercicio: {
    titulo: "Pitch de 5 minutos + Video LinkedIn de 3 minutos",
    objetivo: "Presentar tu proyecto integrador del Mes 1 en un pitch en vivo de 5 minutos con la estructura aprendida y publicar un video resumen de 3 minutos en LinkedIn etiquetando a ITSEIA.",
    herramientas: "Diapositivas (Gamma o Canva) + cámara/celular para grabar + LinkedIn + plantilla de rúbrica",
    datosEjemplo: "Estructura recomendada del video LinkedIn: 30 s problema con persona real, 60 s demo en pantalla del asistente respondiendo, 60 s métricas y aprendizajes con números, 30 s cierre con CTA y agradecimiento.",
    pasos: [
      "Prepara las diapositivas siguiendo la estructura de los 5 bloques del pitch",
      "Practica el pitch al menos 5 veces cronometrando cada bloque",
      "Graba un backup de la demo en video por si falla en vivo",
      "Presenta el pitch en vivo ante 2-3 compañeros y recibí su evaluación con la rúbrica",
      "Itera puntos débiles según el feedback recibido",
      "Graba video resumen de 3 minutos para LinkedIn con la estructura recomendada",
      "Publicá el video en LinkedIn etiquetando a ITSEIA y compartiendo el link a tu asistente",
    ],
    resultado: "Pitch de 5 minutos presentado con calificación ≥18/25 en la rúbrica + video LinkedIn de 3 minutos publicado etiquetando a ITSEIA con link al asistente público.",
    criterios: [
      { criterio: "Pitch dentro del tiempo (5 minutos exactos)", puntos: 15 },
      { criterio: "Storytelling iniciado por la persona afectada", puntos: 20 },
      { criterio: "Demo en vivo con 3 casos (fácil, difícil, fuera de alcance)", puntos: 25 },
      { criterio: "Métricas específicas y verificables presentadas", puntos: 15 },
      { criterio: "Video LinkedIn publicado con estructura correcta y etiqueta a ITSEIA", puntos: 25 },
    ],
  },
  recursos: [
    { titulo: "Y Combinator — How to Pitch", url: "https://www.ycombinator.com/library/6q-how-to-pitch-your-startup", tipo: "documentacion", descripcion: "Guía oficial de Y Combinator sobre cómo presentar un proyecto en formato pitch." },
    { titulo: "Carmine Gallo — Talk Like TED", url: "https://www.carminegallo.com/books/talk-like-ted/", tipo: "documentacion", descripcion: "Libro de referencia sobre técnicas de storytelling de las TED Talks más vistas." },
    { titulo: "Gamma.app", url: "https://gamma.app/", tipo: "herramienta", descripcion: "Plataforma de presentaciones generadas con IA, ideal para preparar tus slides en minutos." },
    { titulo: "Canva — Plantillas de pitch", url: "https://www.canva.com/presentations/templates/pitch-deck/", tipo: "herramienta", descripcion: "Plantillas gratuitas de pitch deck con estética profesional para presentar tu proyecto." },
    { titulo: "LinkedIn — Best practices for native video", url: "https://www.linkedin.com/business/marketing/blog/linkedin-pages/best-practices-for-creating-native-video-on-linkedin", tipo: "lectura", descripcion: "Mejores prácticas oficiales de LinkedIn para publicar videos nativos con alta retención." },
  ],
};

// ─── EXPORT ─────────────────────────────────────────────────────────────────

export const BOOTCAMP_MES1_SESIONES: SesionBootcamp[] = [
  sesion1, sesion2, sesion3, sesion4,
  sesion5, sesion6, sesion7, sesion8,
  sesion9, sesion10, sesion11, sesion12,
  sesion13, sesion14, sesion15, sesion16,
];
