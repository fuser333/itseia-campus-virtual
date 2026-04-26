// ─── C1: Introducción a IA Aplicada — Datos de 20 temas ──────────────────────
// Curso C1 del programa MDT. 5 temas completos + 15 placeholders.
// ACTUALIZADO: Videos en español 30+ min, teoría expandida, presentaciones
// inline, ejercicios con criterios, recursos ampliados.

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

export interface TemaC1 {
  id: number;
  titulo: string;
  modulo: string;
  moduloNum: number;
  videoEmbed: string;
  videoTitulo: string;
  videoDuracion?: string;
  teoria: string;
  /** URL de la presentación generada en Gamma (preferido sobre presentacionSlides) */
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

export const C1_MODULOS = [
  { num: 1, nombre: "Fundamentos de Inteligencia Artificial", horas: 10, temas: 5 },
  { num: 2, nombre: "IA Generativa y Prompt Engineering", horas: 12, temas: 6 },
  { num: 3, nombre: "Herramientas No-Code y Aplicaciones", horas: 10, temas: 5 },
  { num: 4, nombre: "Proyecto Final Aplicado", horas: 8, temas: 4 },
];

// ─── Helper para temas placeholder ──────────────────────────────────────────
const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC1 => ({
  id,
  titulo,
  modulo,
  moduloNum,
  videoEmbed: "",
  videoTitulo: titulo,
  teoria: "Contenido en desarrollo — disponible próximamente.",
  presentacionSlides: [],
  quiz: [],
  ejercicio: {
    objetivo: "Próximamente",
    herramientas: "",
    pasos: [],
    resultado: "",
  },
  recursos: [],
});

// ─── MÓDULO 1: Fundamentos de Inteligencia Artificial ────────────────────────

const MOD1 = "Fundamentos de Inteligencia Artificial";

const tema1: TemaC1 = {
  id: 1,
  titulo: "Definición y evolución histórica de la IA",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/WCM0h9TX7cY",
  videoTitulo: "La historia completa de la Inteligencia Artificial — EDteam",
  videoDuracion: "~45 min · Español · EDteam",
  slidesUrl: "https://gamma.app/docs/iwmny6bbdi94d5l",
  teoria: `La Inteligencia Artificial (IA) es la rama de la informática que busca crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana: comprender lenguaje natural, reconocer patrones visuales, tomar decisiones complejas y aprender de la experiencia sin ser programados explícitamente para cada caso.

Es importante distinguir la IA de otros conceptos relacionados. La automatización ejecuta tareas repetitivas siguiendo reglas fijas (como una macro de Excel). La robótica construye máquinas físicas que interactúan con el entorno. La IA, en cambio, dota a los sistemas de la capacidad de adaptarse, aprender y mejorar con el tiempo. Una lavadora automática no es IA; un asistente de voz que aprende tus preferencias sí lo es.

La historia de la IA comienza formalmente en 1950 cuando Alan Turing publicó "Computing Machinery and Intelligence" y propuso el famoso Test de Turing: si una máquina puede mantener una conversación indistinguible de la de un humano, puede considerarse "inteligente". En 1956, John McCarthy acuñó el término "Inteligencia Artificial" en la histórica conferencia de Dartmouth, donde un grupo de investigadores se reunió con la ambiciosa meta de crear máquinas pensantes. Este evento se considera el nacimiento oficial del campo.

Durante las décadas de 1960 y 1970 surgieron avances prometedores: ELIZA (1966), el primer chatbot que simulaba una conversación terapéutica; SHRDLU (1971), que podía entender instrucciones en inglés sobre bloques virtuales; y los primeros sistemas expertos que codificaban conocimiento de especialistas en reglas lógicas. Sin embargo, las limitaciones del hardware y las expectativas desmedidas provocaron el primer "invierno de la IA" (1974-1980), un período de recortes de financiamiento y escepticismo generalizado.

Los años 80 trajeron un resurgimiento con los sistemas expertos comerciales como MYCIN (diagnóstico médico) y R1/XCON (configuración de computadoras). Empresas japonesas lanzaron el ambicioso "Proyecto de Quinta Generación". Pero nuevamente, las limitaciones técnicas y los costos excesivos provocaron un segundo invierno (1987-1993).

El verdadero renacimiento llegó gradualmente. En 1997, Deep Blue de IBM venció al campeón mundial de ajedrez Garry Kasparov, un momento icónico que demostró el poder computacional aplicado a problemas complejos. En 2011, IBM Watson ganó el concurso Jeopardy! contra los mejores jugadores humanos, procesando lenguaje natural a velocidades impresionantes.

El punto de inflexión definitivo fue 2012, cuando AlexNet (una red neuronal profunda) revolucionó la visión por computadora al ganar la competencia ImageNet con una ventaja aplastante. Esto demostró que el deep learning, combinado con GPUs potentes y grandes datasets, podía superar todos los métodos anteriores. En 2016, AlphaGo de DeepMind derrotó al campeón mundial de Go, un juego considerado demasiado complejo para las máquinas.

La era moderna se aceleró con la arquitectura Transformer (2017, paper "Attention is All You Need" de Google), que es la base de toda la IA generativa actual. Luego vinieron GPT-2 (2019), GPT-3 (2020), DALL-E (2021), ChatGPT (noviembre 2022) que alcanzó 100 millones de usuarios en dos meses, GPT-4 (2023), Claude 3 de Anthropic (2024), y los modelos multimodales que procesan texto, imagen, audio y video simultáneamente.

En Ecuador y Latinoamérica, la adopción de IA está en plena expansión. Bancos ecuatorianos como Pichincha y Produbanco implementan detección de fraude con ML. Empresas agrícolas usan drones con visión artificial para monitorear cultivos de banano y flores. ImagemIA, empresa ecuatoriana fundada por el mismo equipo detrás de ITSEIA, desarrolla IA predictiva para imagenología médica. El gobierno trabaja en una Estrategia Nacional de IA a través del MINTEL.

Comprender esta evolución no es solo cultura general — es una competencia profesional. Saber de dónde viene la IA te permite entender sus limitaciones actuales, anticipar hacia dónde va, y tomar mejores decisiones sobre qué herramientas adoptar en tu carrera. Los profesionales que dominan IA tienen una empleabilidad del 85-92% en el mercado ecuatoriano actual.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Definición y Evolución Histórica de la IA\nC1. Introducción a IA Aplicada — Tema 1\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido: "Al finalizar esta sesión serás capaz de:\n• Definir qué es la Inteligencia Artificial con precisión técnica y práctica\n• Identificar los hitos históricos clave que dieron forma a la IA moderna\n• Diferenciar entre IA, automatización y robótica\n• Relacionar la evolución de la IA con su impacto actual en Ecuador y LATAM",
    },
    {
      titulo: "¿Qué es la Inteligencia Artificial?",
      contenido: "La IA es la disciplina de la informática que busca crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana: aprender, razonar, percibir, tomar decisiones y generar lenguaje.\n\n5 capacidades clave: Percepción · Razonamiento · Aprendizaje · Comunicación · Toma de decisiones\n\nJohn McCarthy (1956): \"La ciencia e ingeniería de hacer máquinas inteligentes.\"",
    },
    {
      titulo: "IA, Automatización y Robótica — No son lo mismo",
      contenido: "Automatización: Reglas fijas, repetitiva. Ejemplo: macro de Excel.\nRobótica: Máquinas físicas, movimiento. Ejemplo: brazo industrial.\nInteligencia Artificial: Aprende y se adapta, toma decisiones. Ejemplo: ChatGPT.\n\n\"La IA es el cerebro que puede hacer inteligentes tanto a la automatización como a la robótica.\"",
    },
    {
      titulo: "IA que ya usas sin darte cuenta (Ecuador)",
      contenido: "• Waze/Google Maps sugiriéndote rutas en Quito evitando tráfico\n• Netflix recomendándote series basándose en lo que viste\n• Banco Pichincha detectando fraudes en tu tarjeta en tiempo real\n• Autocorrector de WhatsApp aprendiendo tus palabras\n• Spotify creando tu playlist \"Descubrimiento Semanal\"\n\nLa IA no es del futuro. Ya está aquí.",
    },
    {
      titulo: "Los 'Inviernos de la IA'",
      contenido: "1956 — Conferencia de Dartmouth: nace la IA (entusiasmo máximo)\n1966-1973 — Primer invierno: las máquinas no podían traducir bien\n1980s — Sistemas expertos: nuevo auge\n1987-1993 — Segundo invierno: demasiado caros, poco flexibles\n2012 — Deep Learning revoluciona todo (ImageNet)\n2022-2026 — Era de la IA generativa: ChatGPT, Claude, Gemini\n\n\"Cada invierno terminó porque alguien siguió investigando.\"",
    },
    {
      titulo: "La IA en Ecuador y LATAM",
      contenido: "• SENESCYT incorpora analítica de datos para becas\n• Bancos ecuatorianos implementan chatbots con IA\n• Startups LATAM: NotCo (Chile), Rappi (Colombia), Betterfly (Chile)\n• ITSEIA funda la primera academia de IA del Ecuador (2025)\n• Ecuador adopta Estrategia Nacional de IA (MINTEL)\n\nEcuador ocupa el puesto 82 en el Global AI Index — enorme oportunidad de crecimiento.",
    },
    {
      titulo: "5 errores comunes sobre la IA",
      contenido: "1. \"La IA piensa como un humano\" — No. Procesa patrones estadísticos.\n2. \"La IA va a reemplazar todos los trabajos\" — Transforma roles, no los elimina.\n3. \"La IA es infalible\" — Comete errores, alucina datos y tiene sesgos.\n4. \"Solo los programadores pueden usar IA\" — Cualquier profesional puede.\n5. \"La IA es algo nuevo\" — Tiene más de 70 años de historia.",
    },
    {
      titulo: "Resumen del Tema 1",
      contenido: "Hoy aprendimos:\n1. La IA es la capacidad de las máquinas de aprender, razonar y tomar decisiones\n2. No es lo mismo que automatización ni robótica\n3. Tiene más de 70 años de evolución, con inviernos y revoluciones\n4. Ya está presente en nuestra vida diaria en Ecuador\n5. Estamos en la era dorada de la IA generativa\n\nPróximo tema: Tipos de IA — estrecha, general y superinteligente",
    },
  ],
  quiz: [
    {
      pregunta: "¿En qué año Alan Turing publicó su artículo sobre máquinas e inteligencia?",
      opciones: ["1943", "1950", "1956", "1965"],
      respuesta: 1,
      explicacion: "Turing publicó 'Computing Machinery and Intelligence' en 1950, proponiendo el Test de Turing.",
    },
    {
      pregunta: "¿Quién acuñó el término 'Inteligencia Artificial'?",
      opciones: ["Alan Turing", "Marvin Minsky", "John McCarthy", "Geoffrey Hinton"],
      respuesta: 2,
      explicacion: "John McCarthy acuñó el término en la conferencia de Dartmouth en 1956.",
    },
    {
      pregunta: "¿Qué evento marcó un hito en 1997 para la IA?",
      opciones: [
        "Se creó el primer chatbot",
        "Deep Blue venció a Kasparov en ajedrez",
        "Se inventó el deep learning",
        "Google lanzó su buscador con IA",
      ],
      respuesta: 1,
      explicacion: "Deep Blue de IBM derrotó al campeón mundial de ajedrez Garry Kasparov en 1997.",
    },
    {
      pregunta: "¿Qué arquitectura revolucionó la IA moderna en 2017?",
      opciones: ["Redes neuronales recurrentes", "Máquinas de Boltzmann", "Transformers", "Autoencoders"],
      respuesta: 2,
      explicacion: "Los Transformers (paper 'Attention is All You Need', 2017) son la base de GPT, BERT y la IA generativa moderna.",
    },
    {
      pregunta: "¿Cuál es la diferencia principal entre IA y automatización?",
      opciones: [
        "La IA es más rápida",
        "La automatización usa internet y la IA no",
        "La IA aprende y se adapta; la automatización sigue reglas fijas",
        "No hay diferencia real",
      ],
      respuesta: 2,
      explicacion: "La IA tiene capacidad de aprendizaje y adaptación, mientras la automatización ejecuta reglas predefinidas sin aprender.",
    },
  ],
  ejercicio: {
    titulo: "Línea de tiempo interactiva de la IA",
    objetivo: "Construir una línea de tiempo visual que conecte los hitos más importantes de la IA con su impacto en la sociedad actual",
    herramientas: "Canva (canva.com) + Wikipedia + Stanford HAI (hai.stanford.edu) + Google Docs",
    datosEjemplo: "Investigar al menos 12 hitos clave:\n• 1950: Test de Turing\n• 1956: Conferencia de Dartmouth\n• 1966: ELIZA (primer chatbot)\n• 1974-1980: Primer invierno de la IA\n• 1997: Deep Blue vs Kasparov\n• 2011: IBM Watson gana Jeopardy\n• 2012: AlexNet revoluciona visión por computadora\n• 2016: AlphaGo derrota a Lee Sedol\n• 2017: Arquitectura Transformer (Google)\n• 2020: GPT-3 de OpenAI\n• 2022: ChatGPT lanzamiento público\n• 2023-2026: Era de IA generativa y regulación",
    pasos: [
      "Crear una cuenta gratuita en Canva y seleccionar plantilla de 'Timeline' o 'Línea de tiempo'",
      "Investigar cada hito en fuentes confiables (Wikipedia, Stanford HAI, MIT Technology Review)",
      "Para cada hito, documentar: año, nombre del evento, protagonistas, y una frase que explique su impacto",
      "Diseñar la línea de tiempo en Canva con colores que distingan las eras (fundacional, inviernos, renacimiento, era actual)",
      "Agregar imágenes representativas (fotos históricas o íconos)",
      "Incluir una sección al final: '¿Qué viene después?' con tu predicción personal fundamentada",
      "Exportar como PDF e imagen PNG",
      "Escribir un párrafo reflexivo (200 palabras) en Google Docs respondiendo: '¿Cómo impacta esta evolución en Ecuador hoy?'",
    ],
    resultado: "Línea de tiempo visual con mínimo 12 hitos, diseño limpio y profesional, más un párrafo reflexivo que conecte la historia de la IA con el contexto ecuatoriano actual",
    criterios: [
      { criterio: "Completitud (mínimo 12 hitos con datos correctos)", puntos: 25 },
      { criterio: "Calidad de la investigación (fuentes confiables citadas)", puntos: 20 },
      { criterio: "Diseño visual (legibilidad, estética, uso de color)", puntos: 20 },
      { criterio: "Conexión con el contexto ecuatoriano", puntos: 20 },
      { criterio: "Predicción futura fundamentada", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "Stanford AI Index Report 2024", url: "https://aiindex.stanford.edu/report/", tipo: "documentacion", descripcion: "Reporte anual del Stanford HAI con datos actualizados sobre el estado y evolución de la IA a nivel global." },
    { titulo: "AI Timeline — Our World in Data", url: "https://ourworldindata.org/artificial-intelligence", tipo: "herramienta", descripcion: "Visualizaciones interactivas sobre la evolución de la IA: capacidad de cómputo, hitos, inversión por país." },
    { titulo: "Historia de la IA — Wikipedia", url: "https://es.wikipedia.org/wiki/Inteligencia_artificial", tipo: "documentacion", descripcion: "Artículo completo en español sobre la historia, enfoques y aplicaciones de la IA." },
    { titulo: "Curso IA para Todos — Coursera (Andrew Ng)", url: "https://www.coursera.org/learn/ai-for-everyone-es", tipo: "herramienta", descripcion: "Curso gratuito de Andrew Ng en español. Fundamentos de IA para no programadores." },
    { titulo: "¿Qué es la IA? — IBM (video 7 min)", url: "https://www.youtube.com/watch?v=ad79nYk2keg", tipo: "lectura", descripcion: "Explicación clara y visual de IBM sobre qué es la IA, su historia y aplicaciones." },
    { titulo: "MIT Technology Review — IA", url: "https://www.technologyreview.es/inteligencia-artificial", tipo: "lectura", descripcion: "Noticias y análisis en español sobre los últimos avances en IA del MIT." },
  ],
};

const tema2: TemaC1 = {
  id: 2,
  titulo: "Tipos de IA: estrecha, general, superinteligente",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/Y2m40hM0AoI",
  videoTitulo: "Curso de Inteligencia Artificial completo en español — Tipos de IA",
  videoDuracion: "~60 min · Español · Curso completo",
  slidesUrl: "https://gamma.app/docs/4n84xwfm5y5qjdx",
  teoria: `La Inteligencia Artificial se clasifica en tres niveles según su capacidad y alcance. Comprender esta clasificación es esencial para separar la realidad de la ciencia ficción y para tomar decisiones informadas sobre qué esperar de las herramientas que usas a diario.

La IA Estrecha (ANI — Artificial Narrow Intelligence) es la única que existe hoy en 2026. Está diseñada para realizar una tarea específica de forma excepcional, pero no puede transferir ese conocimiento a otros dominios. Es como un cirujano brillante que no sabe cocinar un huevo: excelente en su especialidad, inútil fuera de ella.

Ejemplos de ANI que usas a diario: Siri responde preguntas pero no puede conducir un auto. Netflix recomienda películas pero no puede escribir un guion. AlphaGo juega Go a nivel sobrehumano pero no puede jugar ajedrez sin ser reentrenado desde cero. ChatGPT genera texto impresionante pero no tiene conciencia de lo que dice — procesa patrones estadísticos, no comprende significado.

La ANI se subdivide en categorías más específicas según su capacidad de memoria:
• IA Reactiva: Responde a estímulos sin memoria. Ejemplo clásico: Deep Blue de IBM que venció a Kasparov. Evaluaba posiciones pero no "recordaba" partidas anteriores.
• IA con Memoria Limitada: Usa datos recientes para tomar decisiones. Los autos autónomos de Tesla recuerdan la velocidad de los autos cercanos por unos segundos. ChatGPT mantiene el contexto de tu conversación pero lo "olvida" al cerrar sesión.
• Sistemas Reactivos Avanzados: Combinan percepción y reacción en tiempo real. Los filtros de spam de Gmail procesan millones de emails detectando patrones de phishing actualizados constantemente.

La IA General (AGI — Artificial General Intelligence) tendría capacidad cognitiva equivalente a un humano: podría aprender cualquier tarea intelectual, razonar de forma abstracta, transferir conocimiento entre dominios completamente distintos, y adaptarse a situaciones nunca vistas. Un AGI podría aprender a programar por la mañana, diagnosticar enfermedades al mediodía y componer una sinfonía por la noche — todo con la misma facilidad.

No existe aún. Los grandes laboratorios la consideran su objetivo principal:
• Sam Altman (OpenAI): "Podríamos tener AGI en esta década."
• Dario Amodei (Anthropic): "Necesitamos avances fundamentales en razonamiento."
• Yann LeCun (Meta): "Estamos lejos; los LLMs no entienden el mundo."
• Geoffrey Hinton: "El peligro es real y debemos prepararnos."

Las brechas entre la IA actual y la AGI son enormes: razonamiento causal (entender por qué, no solo correlaciones), aprendizaje continuo (aprender sin olvidar lo anterior), sentido común (saber que el agua moja sin que nadie te lo diga), y conciencia situacional (saber que estás en una conversación, no solo procesando tokens).

La Superinteligencia Artificial (ASI) superaría la inteligencia humana en absolutamente todos los dominios: ciencia, creatividad, estrategia, habilidades sociales, invención. Es un concepto teórico estudiado principalmente por el filósofo Nick Bostrom en su libro "Superintelligence: Paths, Dangers, Strategies" (2014). Una ASI podría resolver problemas que la humanidad entera no puede — pero también plantea riesgos existenciales si sus objetivos no están alineados con los nuestros.

En la práctica profesional, toda la IA que usas hoy es ANI. El 100% de la IA comercial disponible en 2026 es IA estrecha. Cuando alguien dice "la IA va a reemplazar todos los trabajos mañana", confunde ANI con AGI. Tu ventaja competitiva como profesional está en dominar las herramientas ANI actuales — ChatGPT, Claude, Gemini, Copilot, DALL-E — y entender sus limitaciones reales. Saber qué puede y qué no puede hacer la IA actual te convierte en un profesional más valioso que quienes la temen o la sobreestiman.

En Ecuador, toda la IA implementada en banca (detección de fraude), salud (imagenología), agricultura (drones) y logística (rutas de entrega) es ANI. Esto significa que hay un mercado enorme para profesionales que sepan configurar, supervisar y optimizar estas herramientas estrechas — que es exactamente lo que aprendes en ITSEIA.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Tipos de IA: Estrecha, General y Superinteligente\nC1. Introducción a IA Aplicada — Tema 2\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido: "Al finalizar esta sesión serás capaz de:\n• Clasificar los tres niveles de Inteligencia Artificial según su capacidad\n• Identificar ejemplos reales de IA estrecha que usas a diario\n• Comprender por qué la IA general (AGI) aún no existe\n• Evaluar críticamente las predicciones sobre superinteligencia",
    },
    {
      titulo: "Los tres niveles de Inteligencia Artificial",
      contenido: "ANI (IA Estrecha): Diseñada para UNA tarea específica. Es toda la IA que existe hoy.\nEjemplos: Siri, GPT, AlphaGo, detectores de fraude.\n\nAGI (IA General): Capacidad cognitiva equivalente a un humano en CUALQUIER tarea. No existe aún.\nObjetivo de: OpenAI, DeepMind, Anthropic.\n\nASI (Superinteligencia): Supera la capacidad humana en todos los dominios. Es teórica.\nReferencia: Nick Bostrom, \"Superintelligence\" (2014).",
    },
    {
      titulo: "IA Estrecha — Lo que realmente tenemos hoy",
      contenido: "• IA Reactiva: Responde sin memoria. Ejemplo: Deep Blue (ajedrez).\n• IA con Memoria Limitada: Aprende de datos recientes. Ejemplo: Tesla Autopilot, ChatGPT.\n• Sistemas de recomendación: Netflix, Spotify, TikTok.\n• Procesamiento de lenguaje: Traductores, asistentes de voz.\n• Visión por computadora: Reconocimiento facial.\n\nDato: El 100% de la IA comercial en 2026 es IA estrecha.",
    },
    {
      titulo: "IA Estrecha que ya funciona en Ecuador",
      contenido: "• Chatbots bancarios: Banco Pichincha y Produbanco (atención 24/7)\n• Detección de fraude: Todas las tarjetas de crédito en Ecuador\n• Agricultura: Drones + visión artificial en la Sierra ecuatoriana\n• Diagnóstico médico: Hospitales usando IA para radiografías (ImagemIA)\n• Logística: Rappi Ecuador y Uber optimizan rutas en Quito y Guayaquil",
    },
    {
      titulo: "¿Cuán cerca estamos de la AGI?",
      contenido: "Sam Altman (OpenAI): \"Podríamos tener AGI en esta década.\"\nDario Amodei (Anthropic): \"Necesitamos avances fundamentales en razonamiento.\"\nYann LeCun (Meta): \"Estamos lejos; los LLMs no entienden el mundo.\"\nGeoffrey Hinton: \"El peligro es real y debemos prepararnos.\"\n\nBrechas: Razonamiento causal · Aprendizaje continuo · Sentido común · Conciencia situacional",
    },
    {
      titulo: "5 errores comunes sobre tipos de IA",
      contenido: "1. \"ChatGPT es IA General\" — No. Es IA estrecha muy avanzada.\n2. \"La Superinteligencia llegará mañana\" — No hay consenso científico.\n3. \"Toda IA aprende sola\" — La mayoría necesita datos curados por humanos.\n4. \"Si es estrecha, no es peligrosa\" — IA estrecha mal diseñada causa sesgos.\n5. \"La IA General será como un humano\" — Sería radicalmente diferente.",
    },
    {
      titulo: "Resumen del Tema 2",
      contenido: "1. Existen 3 niveles: ANI (estrecha), AGI (general) y ASI (superinteligente)\n2. Toda la IA que usamos hoy es estrecha\n3. La AGI no existe aún, pero es el objetivo de los grandes laboratorios\n4. La superinteligencia es teórica y genera debates éticos profundos\n5. Ecuador ya aprovecha la IA estrecha en banca, salud y agricultura\n\nPróximo: Tema 3 — Machine Learning, Deep Learning e IA Simbólica",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué tipo de IA es ChatGPT?",
      opciones: ["IA General (AGI)", "IA Estrecha (ANI)", "Superinteligencia (ASI)", "IA Híbrida"],
      respuesta: 1,
      explicacion: "ChatGPT es ANI: un modelo de lenguaje optimizado para texto, no un sistema con inteligencia general.",
    },
    {
      pregunta: "¿Qué significa AGI?",
      opciones: [
        "Artificial General Intelligence",
        "Advanced Generative Interface",
        "Automated Global Integration",
        "Artificial Gradient Inference",
      ],
      respuesta: 0,
      explicacion: "AGI = Artificial General Intelligence, inteligencia artificial de nivel humano en todos los dominios.",
    },
    {
      pregunta: "¿Cuál es la principal limitación de la IA Estrecha (ANI)?",
      opciones: [
        "Es muy lenta procesando datos",
        "No puede transferir conocimiento entre dominios distintos",
        "Solo funciona con internet",
        "Requiere supervisión humana constante",
      ],
      respuesta: 1,
      explicacion: "La ANI es experta en su tarea específica pero no puede aplicar ese conocimiento a otras áreas.",
    },
    {
      pregunta: "¿Quién es el filósofo conocido por estudiar los riesgos de la Superinteligencia?",
      opciones: ["Elon Musk", "Nick Bostrom", "Sam Altman", "Yuval Harari"],
      respuesta: 1,
      explicacion: "Nick Bostrom escribió 'Superintelligence: Paths, Dangers, Strategies' (2014), obra de referencia sobre ASI.",
    },
    {
      pregunta: "¿Qué porcentaje de la IA comercial disponible en 2026 es IA Estrecha?",
      opciones: ["50%", "75%", "90%", "100%"],
      respuesta: 3,
      explicacion: "El 100% de la IA comercial actual es IA Estrecha (ANI). La AGI y ASI no existen todavía.",
    },
  ],
  ejercicio: {
    titulo: "Clasificación y análisis de sistemas de IA del mundo real",
    objetivo: "Clasificar 10 sistemas de IA reales según su tipo (estrecha, general, superinteligente) y argumentar cada clasificación",
    herramientas: "Google Sheets + navegador web + Google Docs",
    datosEjemplo: "Sistemas a clasificar:\n1. Siri (Apple)\n2. ChatGPT (OpenAI)\n3. AlphaFold (DeepMind) — predicción de proteínas\n4. Tesla Autopilot\n5. DeepL Translator\n6. DALL-E 3\n7. Recomendaciones de Netflix\n8. GitHub Copilot\n9. Google Search\n10. Alexa (Amazon)",
    pasos: [
      "Crear un Google Sheet con columnas: Sistema, Empresa, Qué hace, Tipo de IA, Justificación, Limitaciones",
      "Investigar cada sistema: qué hace exactamente, qué puede y qué NO puede hacer",
      "Clasificar cada uno como IA Estrecha, General o Superinteligente (spoiler: todos son estrechos actualmente)",
      "Escribir una justificación de 2-3 líneas para cada clasificación",
      "Identificar qué le faltaría a ChatGPT para ser considerado IA General",
      "Investigar: ¿Alguna empresa ecuatoriana usa estos sistemas? Documentar al menos 2 ejemplos",
      "Crear un cuadro comparativo: 'IA Estrecha vs AGI' con mínimo 5 diferencias",
      "Escribir una reflexión de 150 palabras: '¿Es posible la AGI en los próximos 10 años?'",
    ],
    resultado: "Tabla completa de clasificación con justificaciones sólidas, cuadro comparativo IA Estrecha vs AGI, y reflexión fundamentada sobre el futuro de la AGI",
    criterios: [
      { criterio: "Clasificación correcta de los 10 sistemas", puntos: 25 },
      { criterio: "Calidad de las justificaciones", puntos: 25 },
      { criterio: "Cuadro comparativo IA Estrecha vs AGI", puntos: 20 },
      { criterio: "Ejemplos de uso en Ecuador", puntos: 15 },
      { criterio: "Reflexión sobre AGI fundamentada", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "Types of AI — IBM Technology", url: "https://www.ibm.com/think/topics/artificial-intelligence-types", tipo: "documentacion", descripcion: "Explicación detallada de los tipos de IA por capacidad y su clasificación." },
    { titulo: "ChatGPT — OpenAI (ejemplo de ANI)", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "Experimenta directamente con un LLM para entender sus capacidades y limitaciones." },
    { titulo: "DeepMind — Investigación en AGI", url: "https://deepmind.google/", tipo: "documentacion", descripcion: "Laboratorio de Google dedicado a avanzar hacia la inteligencia artificial general." },
    { titulo: "OpenAI — Misión y enfoque AGI", url: "https://openai.com/about", tipo: "lectura", descripcion: "La misión de OpenAI: crear AGI segura que beneficie a toda la humanidad." },
    { titulo: "Superinteligencia — Nick Bostrom (resumen TED)", url: "https://www.youtube.com/watch?v=MnT1xgZgkpk", tipo: "lectura", descripcion: "TED Talk de Bostrom sobre los riesgos de la superinteligencia artificial." },
    { titulo: "ArXiv — Papers recientes de IA", url: "https://arxiv.org/list/cs.AI/recent", tipo: "documentacion", descripcion: "Repositorio de papers científicos más recientes sobre investigación en IA." },
  ],
};

const tema3: TemaC1 = {
  id: 3,
  titulo: "Machine Learning, Deep Learning e IA simbólica",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/xyU2pzKTQE0",
  videoTitulo: "Curso de Machine Learning desde cero — Completo en español",
  videoDuracion: "~3h · Español · Curso completo desde cero",
  slidesUrl: "https://gamma.app/docs/gf3be2fm1nbr0ty",
  teoria: `La IA moderna se construye sobre tres paradigmas principales. Cada uno resuelve problemas de forma diferente y tiene aplicaciones específicas. Entender cuándo usar cada enfoque es lo que distingue a un profesional competente de alguien que solo sigue tutoriales.

El Machine Learning (ML) es el enfoque donde las máquinas aprenden de datos sin ser programadas explícitamente. En la programación tradicional, tú escribes las reglas: "si la temperatura es mayor a 38°C, es fiebre". En ML, le das miles de ejemplos de temperaturas con su diagnóstico, y el algoritmo descubre las reglas por sí mismo. La diferencia es fundamental: en lugar de programar soluciones, programas sistemas que encuentran soluciones.

El ML se divide en tres tipos fundamentales:

Aprendizaje Supervisado: El algoritmo entrena con datos etiquetados — es decir, ejemplos donde ya conocemos la respuesta correcta. Le das 10,000 emails clasificados como "spam" o "no spam", y aprende a clasificar emails nuevos. Otros ejemplos: predicción de precios de casas (regresión), diagnóstico médico (clasificación), scoring crediticio en bancos ecuatorianos. Es el tipo más usado en la industria (80% de las aplicaciones comerciales de ML).

Aprendizaje No Supervisado: El algoritmo busca patrones ocultos en datos sin etiquetas. No le dices qué buscar — él descubre la estructura. Ejemplo: darle datos de 100,000 clientes de un supermercado y que automáticamente los agrupe en segmentos (familias, jóvenes solteros, adultos mayores). Se usa en segmentación de mercado, detección de anomalías y compresión de datos.

Aprendizaje por Refuerzo: El algoritmo aprende por prueba y error, recibiendo recompensas o penalizaciones. Así entrenó DeepMind a AlphaGo: jugó millones de partidas contra sí mismo, y las victorias eran la recompensa. Se usa en robótica, juegos, trading algorítmico y optimización de recursos.

El Deep Learning (DL) es un subconjunto del ML que usa redes neuronales con múltiples capas (de ahí "profundo" — deep). Cada capa extrae características más abstractas de los datos. La primera capa de una red de visión detecta bordes, la segunda detecta formas, la tercera detecta objetos, la cuarta detecta escenas completas.

El Deep Learning es la tecnología detrás de los avances más impactantes de los últimos años: reconocimiento facial (Face ID de Apple), traducción automática (DeepL, Google Translate), generación de imágenes (DALL-E, Midjourney, Stable Diffusion), asistentes de voz (Siri, Alexa), conducción autónoma (Tesla, Waymo) y, por supuesto, los modelos de lenguaje como GPT-4, Claude y Gemini.

¿Qué necesita el Deep Learning? Tres cosas: grandes cantidades de datos (millones de ejemplos), poder computacional masivo (GPUs especializadas de NVIDIA), y mucho tiempo de entrenamiento. GPT-4 se entrenó con billones de tokens de texto durante meses usando miles de GPUs. Por eso el DL es caro y lo dominan las grandes empresas tecnológicas.

La IA Simbólica (también llamada "Good Old-Fashioned AI" o GOFAI) usa reglas lógicas explícitas creadas por humanos. Funciona con sentencias tipo: "SI paciente tiene fiebre Y tos Y dificultad respiratoria ENTONCES posible neumonía". No aprende de datos — sigue las reglas que un experto humano definió.

Los sistemas expertos de los años 80 usaban este enfoque y fueron muy exitosos en dominios específicos: MYCIN diagnosticaba infecciones bacterianas, DENDRAL identificaba estructuras moleculares, R1/XCON configuraba pedidos de computadoras. Hoy la IA simbólica se usa en sistemas legales (verificación de contratos), diagnóstico médico reglado (protocolos clínicos), validación de datos bancarios y motores de reglas de negocio.

La tendencia actual más prometedora combina ambos enfoques: los sistemas neuro-simbólicos usan deep learning para percepción (ver, escuchar, leer) y reglas simbólicas para razonamiento (decidir, verificar, explicar). Esto da lo mejor de ambos mundos: la flexibilidad del aprendizaje con la precisión de las reglas.

En tu carrera profesional, el ML supervisado y el deep learning serán los más relevantes para aplicaciones de negocio. Pero entender la IA simbólica te da perspectiva sobre cuándo las reglas claras y auditables superan a los modelos que nadie puede explicar — algo crucial en banca, salud y legalidad, sectores clave en Ecuador.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Machine Learning, Deep Learning e IA Simbólica\nC1. Introducción a IA Aplicada — Tema 3\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido: "Al finalizar esta sesión serás capaz de:\n• Explicar la diferencia entre ML, DL e IA simbólica\n• Identificar los tres tipos de aprendizaje automático\n• Reconocer cuándo usar cada enfoque en problemas reales\n• Evaluar las ventajas y limitaciones de cada paradigma",
    },
    {
      titulo: "Machine Learning — Aprender de datos",
      contenido: "Programación tradicional: Datos + Reglas → Resultado\nMachine Learning: Datos + Resultados → Reglas\n\nEl ML descubre patrones que los humanos no pueden programar manualmente.\n\n80% de las aplicaciones comerciales de ML son supervisadas.",
    },
    {
      titulo: "Tres tipos de Machine Learning",
      contenido: "Supervisado: Datos etiquetados → predice nuevos datos. Ej: spam/no spam.\nNo Supervisado: Sin etiquetas → descubre patrones ocultos. Ej: segmentación de clientes.\nPor Refuerzo: Prueba y error con recompensas. Ej: AlphaGo, robótica.\n\nEl supervisado domina la industria; el no supervisado descubre lo inesperado; el refuerzo optimiza decisiones secuenciales.",
    },
    {
      titulo: "Deep Learning — Redes neuronales profundas",
      contenido: "Múltiples capas que extraen características cada vez más abstractas:\nCapa 1: Bordes → Capa 2: Formas → Capa 3: Objetos → Capa 4: Escenas\n\nRequiere: Datos masivos + GPUs potentes + Tiempo de entrenamiento\n\nEs la tecnología detrás de: GPT-4, Claude, DALL-E, Face ID, Tesla Autopilot, DeepL",
    },
    {
      titulo: "IA Simbólica — Reglas lógicas humanas",
      contenido: "SI fiebre Y tos Y dificultad respiratoria → posible neumonía\n\nNo aprende de datos — sigue reglas de expertos humanos.\n\nVentajas: Explicable, auditable, predecible\nLimitaciones: No se adapta, no escala, requiere experto humano\n\nUso actual: Sistemas legales, protocolos clínicos, reglas bancarias",
    },
    {
      titulo: "Sistemas neuro-simbólicos (el futuro)",
      contenido: "La tendencia combina ambos enfoques:\n• Deep Learning para percepción (ver, escuchar, leer)\n• Reglas simbólicas para razonamiento (decidir, verificar, explicar)\n\nLo mejor de ambos mundos: flexibilidad del aprendizaje + precisión de las reglas.\n\nCrucial en banca, salud y legalidad — sectores clave en Ecuador.",
    },
    {
      titulo: "Resumen del Tema 3",
      contenido: "1. ML: las máquinas aprenden patrones de datos (supervisado, no supervisado, refuerzo)\n2. DL: redes neuronales profundas que extraen características abstractas\n3. IA Simbólica: reglas lógicas explícitas, explicables y auditables\n4. El futuro combina ambos: sistemas neuro-simbólicos\n5. En tu carrera: ML supervisado y DL son los más demandados\n\nPróximo: Tema 4 — Aplicaciones reales de IA en Ecuador y LATAM",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la diferencia principal entre ML y programación tradicional?",
      opciones: [
        "ML usa internet, la programación no",
        "En ML la máquina aprende de datos; en programación tradicional se escriben reglas explícitas",
        "ML solo funciona con números",
        "No hay diferencia real",
      ],
      respuesta: 1,
      explicacion: "En ML el sistema aprende patrones de los datos; en programación tradicional el humano define todas las reglas.",
    },
    {
      pregunta: "¿Qué tipo de Machine Learning usa datos etiquetados?",
      opciones: ["No supervisado", "Por refuerzo", "Supervisado", "Semi-supervisado"],
      respuesta: 2,
      explicacion: "El aprendizaje supervisado entrena con datos etiquetados (input → output conocido).",
    },
    {
      pregunta: "¿Por qué el Deep Learning se llama 'profundo'?",
      opciones: [
        "Porque analiza problemas muy complejos",
        "Porque usa redes neuronales con múltiples capas",
        "Porque requiere mucho tiempo de entrenamiento",
        "Porque comprende el significado profundo del lenguaje",
      ],
      respuesta: 1,
      explicacion: "El 'deep' se refiere a las múltiples capas (profundidad) de las redes neuronales.",
    },
    {
      pregunta: "¿Cuál es un ejemplo de IA simbólica?",
      opciones: [
        "ChatGPT generando texto",
        "Un sistema de reglas SI-ENTONCES para diagnóstico médico",
        "Reconocimiento facial en un celular",
        "Recomendaciones de Spotify",
      ],
      respuesta: 1,
      explicacion: "Los sistemas expertos basados en reglas lógicas son el ejemplo clásico de IA simbólica.",
    },
    {
      pregunta: "¿Qué porcentaje de las aplicaciones comerciales de ML son supervisadas?",
      opciones: ["40%", "60%", "80%", "95%"],
      respuesta: 2,
      explicacion: "Aproximadamente el 80% de las aplicaciones comerciales de ML utilizan aprendizaje supervisado.",
    },
  ],
  ejercicio: {
    titulo: "Comparación práctica de enfoques de IA con un problema real",
    objetivo: "Resolver un mismo problema con tres enfoques distintos (reglas manuales, ML clásico y Deep Learning conceptual) y comparar resultados",
    herramientas: "Google Sheets para reglas manuales + Google Colab (colab.research.google.com) para ML + Google Docs para análisis",
    datosEjemplo: "Dataset ficticio de 100 clientes de un banco ecuatoriano:\nColumnas: Edad, Ingresos mensuales ($), Años de empleo, Número de créditos previos, Monto solicitado ($), Resultado (Aprobado/Rechazado)\n\nEjemplo de regla manual: SI ingresos > $1,500 Y años_empleo > 2 → Aprobado",
    pasos: [
      "Crear el dataset en Google Sheets con 20 registros ficticios de clientes ecuatorianos",
      "Enfoque 1 (IA Simbólica): Escribir 5 reglas manuales tipo SI-ENTONCES para aprobar/rechazar créditos",
      "Aplicar las reglas a los 20 registros y calcular la tasa de acierto",
      "Enfoque 2 (ML Supervisado): Abrir Google Colab y usar scikit-learn para entrenar un modelo de clasificación",
      "Comparar la tasa de acierto del modelo ML vs las reglas manuales",
      "Enfoque 3 (Conceptual DL): Investigar cómo un banco real usaría Deep Learning para este problema",
      "Escribir un análisis comparativo (300 palabras): ¿Cuándo conviene cada enfoque?",
      "Reflexionar sobre la explicabilidad: ¿Puede un cliente pedir la razón de su rechazo en cada enfoque?",
    ],
    resultado: "Tabla comparativa de 3 enfoques con tasa de acierto, ventajas, desventajas y análisis de explicabilidad",
    criterios: [
      { criterio: "Dataset creado con datos realistas ecuatorianos", puntos: 15 },
      { criterio: "Reglas manuales bien formuladas y aplicadas", puntos: 20 },
      { criterio: "Modelo ML funcional en Google Colab", puntos: 25 },
      { criterio: "Análisis comparativo de 3 enfoques", puntos: 25 },
      { criterio: "Reflexión sobre explicabilidad", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course", tipo: "herramienta", descripcion: "Curso interactivo gratuito de Google que cubre los fundamentos de Machine Learning." },
    { titulo: "Teachable Machine — Google", url: "https://teachablemachine.withgoogle.com", tipo: "herramienta", descripcion: "Entrena un modelo de ML sin código. Clasifica imágenes, sonidos o poses corporales." },
    { titulo: "Kaggle — Datasets y competencias", url: "https://www.kaggle.com/", tipo: "herramienta", descripcion: "Plataforma con miles de datasets y competencias de ML para practicar." },
    { titulo: "3Blue1Brown — Redes neuronales (visual)", url: "https://www.3blue1brown.com/topics/neural-networks", tipo: "lectura", descripcion: "Explicación visual extraordinaria de cómo funcionan las redes neuronales con animaciones matemáticas." },
    { titulo: "Google Colab — Python en la nube", url: "https://colab.research.google.com", tipo: "herramienta", descripcion: "Entorno gratuito para ejecutar código Python con GPUs. Ideal para ML sin instalación." },
    { titulo: "DotCSV — Deep Learning explicado (español)", url: "https://www.youtube.com/watch?v=6M5VXKLf4D4", tipo: "lectura", descripcion: "Canal en español que explica Deep Learning con animaciones claras." },
  ],
};

const tema4: TemaC1 = {
  id: 4,
  titulo: "Aplicaciones reales de IA en Ecuador y LATAM",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/dIf0Ndubhfs",
  videoTitulo: "Inteligencia Artificial y el futuro de los profesionales del Ecuador",
  videoDuracion: "~40 min · Español · Contexto ecuatoriano",
  slidesUrl: "https://gamma.app/docs/ln3vw924c1p8gt0",
  teoria: `La IA ya no es exclusiva de Silicon Valley. Ecuador y Latinoamérica están adoptando soluciones de IA en sectores clave, creando oportunidades profesionales concretas para quienes dominen estas herramientas. Este tema te dará un mapa detallado de dónde se está usando IA en tu región y dónde están las oportunidades.

SECTOR FINANCIERO — El más avanzado en IA en Ecuador

Los bancos ecuatorianos lideran la adopción de IA en el país. Banco Pichincha y Banco del Pacífico usan modelos de Machine Learning para detección de fraude en tiempo real: cada transacción con tarjeta pasa por un algoritmo que evalúa si es legítima o sospechosa en milisegundos. Produbanco implementó chatbots con procesamiento de lenguaje natural para atención al cliente 24/7, reduciendo tiempos de espera de 15 minutos a menos de 30 segundos.

El scoring crediticio alternativo es otra innovación: en lugar de basarse solo en historial bancario (que excluye a millones de ecuatorianos sin cuenta formal), algunos bancos usan ML para evaluar capacidad de pago usando datos alternativos como historial de pagos de servicios básicos y comportamiento digital. Esto democratiza el acceso al crédito.

Según reportes del sector, estas implementaciones redujeron fraudes en un 40% y aumentaron la satisfacción del cliente en un 60%.

SECTOR SALUD — IA para diagnóstico y predicción

Hospitales en Quito y Guayaquil están piloteando IA para imagenología médica. Algoritmos de deep learning analizan rayos X, tomografías y mamografías detectando anomalías con precisión comparable a radiólogos experimentados — pero en segundos en lugar de minutos.

ImagemIA, empresa ecuatoriana fundada por el mismo equipo detrás de ITSEIA, desarrolla soluciones de IA predictiva para imagenología médica que reducen inasistencias a citas en un 30%. Su modelo predice qué pacientes tienen mayor probabilidad de faltar a sus citas y permite al hospital tomar acciones preventivas (recordatorios personalizados, reagendamiento proactivo).

El IESS (Instituto Ecuatoriano de Seguridad Social) explora el uso de IA para triaje automatizado en emergencias, priorizando pacientes según la gravedad de sus síntomas antes de que un médico los vea.

SECTOR AGRÍCOLA — IA para el pilar de la economía

La agricultura representa el 8% del PIB ecuatoriano y emplea a más del 25% de la población. La adopción de IA en este sector tiene un impacto directo en la economía nacional.

Drones con visión por computadora monitorean plantaciones de banano (Ecuador es el mayor exportador mundial), cacao y flores. Estos drones detectan enfermedades de las plantas, estrés hídrico y plagas semanas antes de que sean visibles al ojo humano.

Sensores IoT combinados con modelos de ML predicen el momento óptimo de riego y aplicación de fertilizantes, reduciendo el uso de agua hasta un 30% y aumentando rendimientos entre un 15% y un 25%. En la floricultura de la Sierra, empresas exportadoras usan IA para predecir la demanda de San Valentín y Día de la Madre con meses de anticipación, optimizando la producción.

SECTOR LOGÍSTICA Y COMERCIO

Mercado Libre usa IA para logística predictiva en toda Latinoamérica, anticipando qué productos comprarás antes de que hagas clic. Rappi optimiza rutas de entrega con algoritmos que consideran tráfico, clima y demanda en tiempo real. LATAM Airlines usa pricing dinámico con ML para ajustar precios de boletos según demanda, temporada y perfil del comprador.

En Ecuador, empresas de delivery como PedidosYa y Rappi ya operan con optimización de rutas basada en IA. Supermaxi y otros retailers exploran IA para gestión de inventario predictivo.

IA EN GOBIERNO Y POLÍTICAS PÚBLICAS

El gobierno ecuatoriano trabaja en una Estrategia Nacional de IA a través del MINTEL (Ministerio de Telecomunicaciones). SENESCYT ha incorporado analítica de datos para la asignación de becas, usando datos históricos para predecir qué candidatos tienen mayor probabilidad de completar sus estudios.

La LOPDP (Ley Orgánica de Protección de Datos Personales), vigente desde 2023, regula el uso de datos personales en sistemas automatizados, estableciendo un marco legal para la IA en Ecuador.

Ecuador ocupa el puesto 82 en el Global AI Index — lo que significa que hay una enorme oportunidad de crecimiento para profesionales capacitados.

EL PANORAMA LATAM

Brasil lidera con Nubank (scoring crediticio), iFood (logística) y centros de IA de Google y Meta. Chile destaca con NotCo (alimentos con IA) y startups de minería inteligente. Colombia tiene Rappi, MiAguila (logística) y un ecosistema de startups en crecimiento. México cuenta con centros de IA de Amazon y Google, además de startups en fintech.

Para ti como profesional, esto significa que la demanda de especialistas en IA en Ecuador y LATAM está creciendo más rápido que la oferta. Dominar estas herramientas te posiciona en un mercado con empleabilidad del 85-92%.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Aplicaciones reales de IA en Ecuador y LATAM\nC1. Introducción a IA Aplicada — Tema 4\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido: "Al finalizar esta sesión serás capaz de:\n• Identificar sectores ecuatorianos que ya usan IA\n• Describir casos reales de implementación en banca, salud y agricultura\n• Mapear oportunidades profesionales en IA en tu región\n• Evaluar el estado de Ecuador en el índice global de IA",
    },
    {
      titulo: "Sector financiero — El más avanzado en Ecuador",
      contenido: "• Banco Pichincha y Pacífico: Detección de fraude con ML en tiempo real\n• Produbanco: Chatbots con NLP para atención 24/7\n• Scoring crediticio alternativo: ML evalúa capacidad de pago sin historial bancario\n\nResultados: -40% fraudes, +60% satisfacción del cliente\n\nOportunidad: Ecuador necesita especialistas en ML para fintech",
    },
    {
      titulo: "Sector salud — Diagnóstico y predicción",
      contenido: "• Imagenología médica: DL analiza rayos X y tomografías en segundos\n• ImagemIA (empresa ecuatoriana): IA predictiva que reduce inasistencias 30%\n• IESS: Explora triaje automatizado con IA en emergencias\n\nLa IA no reemplaza al médico — le da superpoderes de velocidad y precisión.",
    },
    {
      titulo: "Sector agrícola — Pilar de la economía",
      contenido: "Ecuador = Mayor exportador mundial de banano\n\n• Drones con visión artificial detectan enfermedades semanas antes\n• Sensores IoT + ML optimizan riego (-30% agua, +25% rendimiento)\n• Floricultura: IA predice demanda de San Valentín con meses de anticipación\n\n8% del PIB, 25% del empleo → impacto masivo de la IA aquí",
    },
    {
      titulo: "Ecuador en el mapa global de IA",
      contenido: "Puesto 82 en el Global AI Index → ENORME oportunidad de crecimiento\n\nEstrategia Nacional de IA (MINTEL) en desarrollo\nLOPDP vigente desde 2023 → marco legal para IA\nSENESCYT usa analítica de datos para becas\n\nLATAM: Brasil lidera, Chile y Colombia crecen rápido\nEmpleabilidad IA en Ecuador: 85-92%",
    },
    {
      titulo: "Resumen del Tema 4",
      contenido: "1. Banca ecuatoriana lidera en adopción de IA (fraude, chatbots, scoring)\n2. Salud avanza con imagenología y predicción\n3. Agricultura se beneficia de drones y sensores inteligentes\n4. Ecuador puesto 82 en Global AI Index — mucho espacio para crecer\n5. Empleabilidad 85-92% para especialistas en IA\n\nPróximo: Tema 5 — Ética, privacidad, sesgos y marco regulatorio",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué sector ecuatoriano lidera la adopción de IA?",
      opciones: ["Agricultura", "Sector financiero/banca", "Turismo", "Minería"],
      respuesta: 1,
      explicacion: "Los bancos ecuatorianos como Pichincha y Produbanco lideran la implementación de ML para fraude y chatbots.",
    },
    {
      pregunta: "¿Qué tecnología usan los agricultores ecuatorianos para monitorear cultivos?",
      opciones: [
        "Robots humanoides",
        "Drones con visión por computadora",
        "Satélites de la NASA",
        "Sensores de temperatura solamente",
      ],
      respuesta: 1,
      explicacion: "Drones con visión por computadora monitorizan cultivos de banano, cacao y flores en Ecuador.",
    },
    {
      pregunta: "¿Qué ley ecuatoriana regula el uso de datos personales en sistemas de IA?",
      opciones: [
        "Ley de Comercio Electrónico",
        "LOPDP — Ley Orgánica de Protección de Datos Personales",
        "Código Penal Digital",
        "Ley de Telecomunicaciones",
      ],
      respuesta: 1,
      explicacion: "La LOPDP regula la protección de datos personales incluyendo su uso en sistemas automatizados.",
    },
    {
      pregunta: "¿Qué empresa ecuatoriana desarrolla IA predictiva para imagenología médica?",
      opciones: ["Rappi Ecuador", "ImagemIA", "Banco Pichincha", "Supermaxi"],
      respuesta: 1,
      explicacion: "ImagemIA desarrolla soluciones de IA predictiva que reducen inasistencias médicas en un 30%.",
    },
    {
      pregunta: "¿Cuál es el rango de empleabilidad para especialistas en IA en Ecuador?",
      opciones: ["50-60%", "65-75%", "85-92%", "95-100%"],
      respuesta: 2,
      explicacion: "La empleabilidad para especialistas en IA en Ecuador está entre el 85% y 92% según datos del sector.",
    },
  ],
  ejercicio: {
    titulo: "Mapa de IA en Ecuador — Investigación de campo",
    objetivo: "Mapear 5 empresas ecuatorianas que usan IA en sus operaciones, documentando sector, tecnología y resultados",
    herramientas: "Google Docs + navegador web + LinkedIn (para investigar empresas)",
    datosEjemplo: "Sectores a investigar:\n• Banca y fintech\n• Salud y farmacéutica\n• Agricultura y exportación\n• Retail y e-commerce\n• Gobierno y servicios públicos",
    pasos: [
      "Investigar en Google, LinkedIn y prensa ecuatoriana (El Comercio, Primicias) empresas que usen IA",
      "Seleccionar 5 empresas de diferentes sectores",
      "Para cada empresa documentar: nombre, sector, tipo de IA que usa, problema que resuelve, resultado reportado",
      "Crear un mapa visual (puede ser en Canva o Google Slides) mostrando las 5 empresas por sector",
      "Agregar una sección de 'oportunidades detectadas': áreas donde aún NO se aplica IA en Ecuador",
      "Comparar con un país LATAM líder (Brasil o Chile): ¿qué hacen ellos que Ecuador no?",
      "Incluir fuentes verificables (links a artículos o reportes)",
      "Escribir una conclusión (200 palabras): '¿Dónde están las mayores oportunidades de IA en Ecuador?'",
    ],
    resultado: "Documento con mapa de 5 empresas ecuatorianas usando IA, análisis de oportunidades, comparación regional y conclusión",
    criterios: [
      { criterio: "5 empresas diferentes con datos verificables", puntos: 25 },
      { criterio: "Diversidad de sectores cubiertos", puntos: 15 },
      { criterio: "Análisis de oportunidades no exploradas", puntos: 20 },
      { criterio: "Comparación con país LATAM líder", puntos: 20 },
      { criterio: "Fuentes citadas y conclusión fundamentada", puntos: 20 },
    ],
  },
  recursos: [
    { titulo: "Índice Latinoamericano de IA — CENIA/BID", url: "https://indicelatam.cl", tipo: "documentacion", descripcion: "Índice que mide el avance de la IA en países de América Latina incluyendo Ecuador." },
    { titulo: "Datos Abiertos Ecuador — INEC", url: "https://www.ecuadorencifras.gob.ec/institucional/home/", tipo: "herramienta", descripcion: "Portal de datos abiertos del INEC. Datasets sobre empleo, economía y población ecuatoriana." },
    { titulo: "BID — IA para el bien social en LATAM", url: "https://publications.iadb.org/es/inteligencia-artificial-para-el-bien-social-en-america-latina-y-el-caribe", tipo: "lectura", descripcion: "Publicación del BID sobre aplicaciones de IA para el bien social en LATAM con casos por país." },
    { titulo: "Oxford AI Readiness Index", url: "https://oxfordinsights.com/ai-readiness/ai-readiness-index/", tipo: "lectura", descripcion: "Ranking global de preparación para IA por país. Ecuador puesto 82." },
    { titulo: "LOPDP Ecuador — Texto completo", url: "https://www.registroficial.gob.ec/", tipo: "documentacion", descripcion: "Ley Orgánica de Protección de Datos Personales de Ecuador — marco regulatorio para IA." },
    { titulo: "Masterclass: IA para empresas (video 60 min)", url: "https://www.youtube.com/watch?v=xSfZR8SEQYE", tipo: "lectura", descripcion: "Masterclass completa sobre cómo las empresas implementan IA en sus operaciones." },
  ],
};

const tema5: TemaC1 = {
  id: 5,
  titulo: "Ética, privacidad, sesgos y marco regulatorio",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/QaELm7cSzm0",
  videoTitulo: "Curso completo: Ética aplicada a la Inteligencia Artificial",
  videoDuracion: "~60 min · Español · Taller educativo completo",
  slidesUrl: "https://gamma.app/docs/8cmrbocizoegodi",
  teoria: `La IA es una herramienta poderosa, pero su uso irresponsable puede causar daño real a personas y comunidades. Comprender los desafíos éticos no es opcional para un profesional de IA — es una competencia profesional esencial que te diferenciará en el mercado laboral y te protegerá legalmente.

SESGOS ALGORÍTMICOS — Cuando la IA hereda nuestros prejuicios

Los sesgos algorítmicos ocurren cuando los datos de entrenamiento reflejan prejuicios históricos de la sociedad. La IA no "inventa" discriminación — la amplifica y automatiza a partir de datos sesgados.

Caso Amazon (2018): Amazon desarrolló un sistema de reclutamiento con IA para filtrar currículos automáticamente. Después de un año, descubrieron que el sistema penalizaba currículos que mencionaban la palabra "women" (mujeres) — porque fue entrenado con datos de contrataciones de los últimos 10 años, donde la mayoría de contratados eran hombres. El sistema aprendió que "ser hombre" correlacionaba con "ser contratado", y perpetuó esa discriminación. Amazon canceló el proyecto.

Caso COMPAS (Estados Unidos): El sistema COMPAS (Correctional Offender Management Profiling for Alternative Sanctions) predecía la probabilidad de reincidencia criminal para decidir sentencias y libertad condicional. Una investigación de ProPublica (2016) reveló que el sistema predecía mayor reincidencia para personas afroamericanas que para personas blancas con historiales similares. El sesgo venía de datos históricos que reflejaban décadas de discriminación racial en el sistema judicial.

Caso reconocimiento facial: Estudios del MIT Media Lab demostraron que los sistemas de reconocimiento facial de IBM, Microsoft y Face++ tenían tasas de error de hasta 34.7% para mujeres de piel oscura, comparado con menos del 1% para hombres de piel clara. ¿Por qué? Los datasets de entrenamiento contenían mayoritariamente rostros de hombres blancos.

Estos no son errores técnicos — son reflejos automatizados de desigualdades sociales. Y en Ecuador, donde existen brechas históricas por género, etnia y región, el riesgo de sesgos es particularmente alto si no se auditan los datos.

PRIVACIDAD DE DATOS — El marco legal en Ecuador

En Ecuador, la LOPDP (Ley Orgánica de Protección de Datos Personales), vigente desde 2023, establece que toda persona tiene derechos fundamentales sobre sus datos:

• Derecho de acceso: Saber qué datos tuyos se procesan y quién los tiene
• Derecho de rectificación: Corregir datos incorrectos
• Derecho de eliminación: Solicitar que borren tus datos
• Derecho de oposición: Oponerte a que tus datos se usen para decisiones automatizadas
• Derecho de portabilidad: Llevarte tus datos a otra empresa

Las empresas que usen IA con datos personales deben cumplir principios de: consentimiento informado (el usuario sabe y acepta), minimización de datos (solo recoger lo necesario), finalidad específica (usar datos solo para lo declarado) y seguridad adecuada (proteger contra hackeos y filtraciones).

El incumplimiento puede resultar en multas de hasta el 1% de la facturación anual de la empresa.

TRANSPARENCIA Y EXPLICABILIDAD

La transparencia algorítmica exige que las decisiones automatizadas sean comprensibles para los afectados. Si un banco niega un crédito usando IA, el cliente tiene derecho a saber por qué. Si una empresa te rechaza en un proceso de selección automatizado, debes poder entender los criterios.

El AI Act de la Unión Europea (2024) es la regulación más avanzada del mundo en IA. Clasifica los sistemas por nivel de riesgo:
• Riesgo inaceptable (prohibido): scoring social, reconocimiento facial masivo en espacios públicos
• Alto riesgo (regulado estrictamente): IA en salud, educación, empleo, crédito, justicia
• Riesgo limitado: chatbots (deben identificarse como IA)
• Riesgo mínimo: filtros de spam, recomendaciones de contenido

Ecuador aún no tiene una regulación específica para IA, pero la LOPDP cubre muchos aspectos. Se espera que la Estrategia Nacional de IA incluya regulación específica en los próximos años.

DEEPFAKES Y DESINFORMACIÓN

La IA puede generar videos, audio e imágenes falsos extremadamente realistas. Los deepfakes representan un riesgo creciente:
• En política: deepfakes de candidatos diciendo cosas que nunca dijeron
• En fraude: voces clonadas para estafas telefónicas
• En extorsión: imágenes manipuladas para chantaje

En Latinoamérica ya se han documentado casos de deepfakes políticos durante elecciones en Brasil, Argentina y México. Ecuador no es inmune a esta amenaza.

TU RESPONSABILIDAD COMO PROFESIONAL

Como profesional de IA, tu responsabilidad es triple:
1. Auditar datos de entrenamiento: Verificar que los datos no contengan sesgos históricos de género, raza, región o nivel socioeconómico antes de entrenar cualquier modelo.
2. Cumplir con la LOPDP: Implementar consentimiento informado, minimización de datos y seguridad adecuada en todo sistema que procese datos personales.
3. Diseñar para transparencia: Crear sistemas que puedan explicar sus decisiones. Preferir modelos interpretables cuando las decisiones afectan a personas.

La ética no frena la innovación — la hace sostenible. Las empresas que ignoran la ética terminan con escándalos, demandas y pérdida de confianza. Las que la priorizan construyen productos que la gente realmente quiere usar.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Ética, Privacidad, Sesgos y Marco Regulatorio\nC1. Introducción a IA Aplicada — Tema 5\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido: "Al finalizar esta sesión serás capaz de:\n• Identificar casos reales de sesgo algorítmico y sus consecuencias\n• Conocer tus derechos bajo la LOPDP de Ecuador\n• Evaluar el nivel de riesgo de un sistema de IA según el AI Act europeo\n• Aplicar principios éticos en tu trabajo como profesional de IA",
    },
    {
      titulo: "Sesgos algorítmicos — La IA hereda nuestros prejuicios",
      contenido: "Caso Amazon: Sistema de reclutamiento penalizaba mujeres (datos históricos sesgados)\nCaso COMPAS: Predecía mayor reincidencia para afroamericanos\nCaso reconocimiento facial: 34.7% error en mujeres de piel oscura vs <1% hombres blancos\n\nLa IA no inventa discriminación — la amplifica y automatiza.",
    },
    {
      titulo: "LOPDP — Tus derechos en Ecuador",
      contenido: "Ley Orgánica de Protección de Datos Personales (vigente 2023):\n\n• Acceso: Saber qué datos tuyos se procesan\n• Rectificación: Corregir datos incorrectos\n• Eliminación: Solicitar que borren tus datos\n• Oposición: Oponerte a decisiones automatizadas\n• Portabilidad: Llevarte tus datos a otra empresa\n\nMultas: Hasta 1% de facturación anual",
    },
    {
      titulo: "AI Act — La regulación europea como referencia",
      contenido: "Clasificación por nivel de riesgo:\n\nProhibido: Scoring social, reconocimiento facial masivo\nAlto riesgo: IA en salud, educación, empleo, crédito, justicia\nRiesgo limitado: Chatbots (deben identificarse como IA)\nRiesgo mínimo: Filtros de spam, recomendaciones\n\nEcuador aún no tiene regulación específica para IA — pero la LOPDP cubre muchos aspectos.",
    },
    {
      titulo: "Deepfakes y desinformación",
      contenido: "La IA genera videos, audio e imágenes falsos extremadamente realistas.\n\n• Política: Deepfakes de candidatos diciendo cosas falsas\n• Fraude: Voces clonadas para estafas telefónicas\n• Extorsión: Imágenes manipuladas para chantaje\n\nCasos documentados en Brasil, Argentina y México.\nEcuador no es inmune a esta amenaza.",
    },
    {
      titulo: "Tu responsabilidad como profesional de IA",
      contenido: "1. Auditar datos: Verificar sesgos antes de entrenar modelos\n2. Cumplir LOPDP: Consentimiento, minimización, seguridad\n3. Diseñar para transparencia: Sistemas que expliquen sus decisiones\n\nLa ética no frena la innovación — la hace sostenible.\nEmpresas éticas = confianza = éxito a largo plazo.",
    },
    {
      titulo: "Resumen del Tema 5",
      contenido: "1. Los sesgos algorítmicos amplifican discriminación histórica\n2. La LOPDP protege tus datos personales en Ecuador\n3. El AI Act europeo clasifica IA por nivel de riesgo\n4. Los deepfakes son una amenaza creciente en LATAM\n5. Tu responsabilidad: auditar, cumplir ley, diseñar con transparencia\n\nCon esto completamos el Módulo 1: Fundamentos de IA",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué problema tuvo el sistema de reclutamiento con IA de Amazon?",
      opciones: [
        "Era muy lento procesando currículos",
        "Penalizaba currículos de mujeres por sesgos en datos históricos",
        "No podía leer archivos PDF",
        "Contrataba demasiadas personas",
      ],
      respuesta: 1,
      explicacion: "El sistema aprendió de datos históricos sesgados (mayormente contrataciones masculinas) y discriminó a mujeres.",
    },
    {
      pregunta: "¿Qué ley ecuatoriana protege los datos personales usados en sistemas de IA?",
      opciones: [
        "Ley de Seguridad Ciudadana",
        "Código de Comercio",
        "LOPDP — Ley Orgánica de Protección de Datos Personales",
        "Ley de Telecomunicaciones",
      ],
      respuesta: 2,
      explicacion: "La LOPDP regula la protección de datos personales en Ecuador, incluyendo su tratamiento automatizado.",
    },
    {
      pregunta: "¿Qué es la 'explicabilidad' en IA?",
      opciones: [
        "Que la IA pueda hablar en cualquier idioma",
        "Que las decisiones automatizadas sean comprensibles para humanos",
        "Que el código fuente sea público",
        "Que la IA explique chistes",
      ],
      respuesta: 1,
      explicacion: "La explicabilidad exige que las decisiones de la IA puedan ser entendidas y auditadas por personas.",
    },
    {
      pregunta: "Según el AI Act europeo, ¿qué nivel de riesgo tiene la IA usada en procesos de empleo?",
      opciones: ["Riesgo mínimo", "Riesgo limitado", "Alto riesgo", "Riesgo inaceptable (prohibido)"],
      respuesta: 2,
      explicacion: "El AI Act clasifica la IA en empleo, educación, salud y crédito como 'alto riesgo' con regulación estricta.",
    },
    {
      pregunta: "¿Cuál es la responsabilidad ética principal de un profesional de IA?",
      opciones: [
        "Maximizar las ganancias de la empresa",
        "Hacer el sistema lo más rápido posible",
        "Auditar sesgos, cumplir regulaciones y priorizar transparencia",
        "Publicar todos los datos en internet",
      ],
      respuesta: 2,
      explicacion: "La responsabilidad ética incluye auditar sesgos, cumplir la LOPDP y diseñar sistemas transparentes.",
    },
  ],
  ejercicio: {
    titulo: "Análisis de caso real de sesgo algorítmico",
    objetivo: "Analizar un caso documentado de sesgo en IA, aplicar el marco LOPDP ecuatoriano y proponer soluciones",
    herramientas: "Google Docs + navegador web para investigación + AI Fairness 360 de IBM (demo)",
    datosEjemplo: "Casos sugeridos para investigar:\n• Amazon Recruiting (2018) — sesgo de género en contratación\n• COMPAS (2016) — sesgo racial en predicción de reincidencia\n• Reconocimiento facial MIT Media Lab — sesgo racial en precisión\n• Google Photos (2015) — clasificación incorrecta de personas\n• Apple Card (2019) — sesgo de género en límites de crédito",
    pasos: [
      "Elegir un caso documentado de sesgo en IA de la lista o buscar uno nuevo",
      "Investigar a fondo: qué datos se usaron, qué sesgo se detectó, qué consecuencias tuvo",
      "Aplicar el marco LOPDP: ¿qué artículos de la ley ecuatoriana se vulnerarían si esto ocurriera en Ecuador?",
      "Clasificar el sistema según el AI Act europeo: ¿qué nivel de riesgo tendría?",
      "Proponer 3 medidas técnicas concretas para prevenir el sesgo detectado",
      "Proponer 2 medidas organizacionales (procesos, auditorías, equipo diverso)",
      "Explorar la demo de AI Fairness 360 de IBM (aif360.mybluemix.net) y describir cómo funciona",
      "Redactar una opinión fundamentada (250 palabras): '¿Necesita Ecuador una ley específica de IA?'",
    ],
    resultado: "Análisis completo del caso con referencia a LOPDP, clasificación AI Act, 5 propuestas de mitigación y opinión fundamentada",
    criterios: [
      { criterio: "Investigación del caso con fuentes verificables", puntos: 20 },
      { criterio: "Aplicación correcta de la LOPDP", puntos: 20 },
      { criterio: "Clasificación según AI Act", puntos: 10 },
      { criterio: "Propuestas de mitigación (técnicas + organizacionales)", puntos: 25 },
      { criterio: "Opinión fundamentada sobre regulación en Ecuador", puntos: 25 },
    ],
  },
  recursos: [
    { titulo: "LOPDP Ecuador — Texto oficial", url: "https://www.registroficial.gob.ec/index.php/registro-oficial-web/", tipo: "documentacion", descripcion: "Texto completo de la Ley Orgánica de Protección de Datos Personales de Ecuador." },
    { titulo: "AI Fairness 360 — IBM (demo)", url: "https://aif360.mybluemix.net", tipo: "herramienta", descripcion: "Toolkit de IBM para detectar y mitigar sesgos en modelos de ML. Incluye demos interactivas." },
    { titulo: "AI Act — Unión Europea", url: "https://artificialintelligenceact.eu/", tipo: "documentacion", descripcion: "Texto y guía del AI Act europeo que clasifica sistemas de IA por nivel de riesgo." },
    { titulo: "Ética de la IA — UNESCO", url: "https://www.unesco.org/es/artificial-intelligence/recommendation-ethics", tipo: "lectura", descripcion: "Marco ético global para la IA adoptado por 193 países. Referencia fundamental." },
    { titulo: "Algorithmic Justice League", url: "https://www.ajl.org/", tipo: "herramienta", descripcion: "Organización fundada por Joy Buolamwini que combate los sesgos en IA." },
    { titulo: "ProPublica — Machine Bias (COMPAS)", url: "https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing", tipo: "lectura", descripcion: "Investigación periodística sobre el sesgo racial del sistema COMPAS." },
  ],
};

// ─── MÓDULO 2: IA Generativa y Prompt Engineering ────────────────────────────

const MOD2 = "IA Generativa y Prompt Engineering";

// ─── MÓDULO 3: Herramientas No-Code y Aplicaciones ──────────────────────────

const MOD3 = "Herramientas No-Code y Aplicaciones";

// ─── MÓDULO 4: Proyecto Final Aplicado ───────────────────────────────────────

const MOD4 = "Proyecto Final Aplicado";

// ─── Export: 20 temas (5 completos + 15 placeholders) ────────────────────────

export const C1_TEMAS: TemaC1[] = [
  // Módulo 1 — completos
  tema1,
  tema2,
  tema3,
  tema4,
  tema5,
  // Módulo 2 — placeholders
  placeholder(6, "¿Qué es la IA Generativa? De GANs a GPT", MOD2, 2),
  placeholder(7, "Prompt Engineering: principios y técnicas", MOD2, 2),
  placeholder(8, "Prompts avanzados: cadena de pensamiento y few-shot", MOD2, 2),
  placeholder(9, "ChatGPT y Claude: comparativa práctica", MOD2, 2),
  placeholder(10, "Generación de imágenes: DALL-E, Midjourney, Stable Diffusion", MOD2, 2),
  placeholder(11, "Generación de código con IA: Copilot y Cursor", MOD2, 2),
  // Módulo 3 — placeholders
  placeholder(12, "Automatización sin código: Make y Zapier", MOD3, 3),
  placeholder(13, "Chatbots con IA: Botpress y Voiceflow", MOD3, 3),
  placeholder(14, "Análisis de datos con IA: hojas de cálculo inteligentes", MOD3, 3),
  placeholder(15, "Diseño asistido por IA: Canva AI, Gamma, Figma AI", MOD3, 3),
  placeholder(16, "Productividad personal con IA: Notion AI, Otter, Fireflies", MOD3, 3),
  // Módulo 4 — placeholders
  placeholder(17, "Definición del proyecto final: problema + solución", MOD4, 4),
  placeholder(18, "Desarrollo del prototipo con herramientas No-Code", MOD4, 4),
  placeholder(19, "Testing, iteración y documentación", MOD4, 4),
  placeholder(20, "Presentación final y demostración", MOD4, 4),
];
