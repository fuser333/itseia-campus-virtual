// ─── C1: Introducción a IA Aplicada — Datos de 20 temas ──────────────────────
// Curso C1 del programa MDT. 11 temas completos + 9 placeholders.
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

const tema6: TemaC1 = {
  id: 6,
  titulo: "¿Qué es la IA Generativa? De GANs a GPT",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/-OPWZZhkrbQ",
  videoTitulo: "Introducción a la IA generativa — Curso oficial Google Cloud (subtítulos en español)",
  videoDuracion: "~22 min · Español (subtítulos) · Google Cloud Skills Boost",
  slidesUrl: "",
  teoria: `La Inteligencia Artificial Generativa es la rama de la IA que crea contenido nuevo — texto, imágenes, audio, video, código — a partir de patrones aprendidos de enormes cantidades de datos. A diferencia de la IA tradicional, que clasifica o predice (¿este correo es spam?, ¿qué nota tendrá este estudiante?), la IA generativa produce algo que no existía antes: un poema, un retrato, una canción, un programa funcional, una respuesta personalizada.

DEL CONCEPTO A LA REVOLUCIÓN — Los hitos que cambiaron todo

La IA generativa no nació en 2022 con ChatGPT. Es el resultado de tres décadas de investigación. Comprender esa historia te ayuda a separar la moda del fondo.

1. Modelos estadísticos clásicos (1990-2010). Los primeros modelos generativos eran cadenas de Markov y modelos n-gram que predecían la siguiente palabra basándose en la anterior. Útiles para autocompletar el celular, pero incapaces de mantener coherencia más allá de unas pocas palabras.

2. Variational Autoencoders — VAE (2013). Diederik Kingma propuso una red neuronal que comprime datos a un "espacio latente" y luego los reconstruye. Aprendía la distribución estadística de los datos. Pioneros en generación de rostros y dígitos manuscritos, pero las imágenes salían borrosas.

3. Generative Adversarial Networks — GANs (2014). Ian Goodfellow inventó las GANs durante una discusión en un bar de Montreal. La idea es elegante: dos redes neuronales compiten. El "generador" crea imágenes falsas, el "discriminador" trata de distinguirlas de las reales. Compitiendo, ambos mejoran. Las GANs revolucionaron la generación visual: thispersondoesnotexist.com (2019) muestra rostros 100% sintéticos indistinguibles de fotografías reales. Las GANs también son la tecnología detrás de los primeros deepfakes.

4. Modelos de Difusión — Diffusion Models (2020-2022). Aprenden a "des-ruidizar" imágenes: comienzan con ruido puro y, paso a paso, lo transforman en una imagen coherente guiada por un prompt. Son la base de DALL-E 2, Stable Diffusion y Midjourney. Producen imágenes más nítidas y diversas que las GANs y permiten control fino mediante texto.

5. Transformers (2017). Aquí ocurre el salto que lo cambió todo. Google publica "Attention is All You Need" y propone una arquitectura basada en "atención": cada palabra puede mirar a todas las demás simultáneamente, capturando relaciones a larga distancia. Los Transformers son la base de GPT (Generative Pre-trained Transformer), BERT, T5, y prácticamente todos los modelos modernos de lenguaje.

6. La era GPT (2018-2026). OpenAI escala los Transformers de forma agresiva: GPT-1 (117M parámetros, 2018), GPT-2 (1.5B, 2019), GPT-3 (175B, 2020), GPT-4 (estimado >1T, 2023), GPT-5 (2025). En noviembre de 2022 lanza ChatGPT, una interfaz conversacional sobre GPT-3.5, y alcanza 100 millones de usuarios en dos meses — el producto digital de adopción más rápida de la historia. Anthropic lanza Claude (2023), Google lanza Gemini (2024), Meta libera LLaMA, Mistral irrumpe desde Francia. La carrera comienza.

CÓMO FUNCIONA UN MODELO GENERATIVO POR DENTRO

Cuando le pides a ChatGPT "Escribe un haiku sobre Quito", el modelo no consulta una base de datos de haikus. Hace algo más sutil: predice token a token. Un token es aproximadamente media palabra. El modelo calcula la probabilidad de cada posible siguiente token basándose en miles de millones de patrones aprendidos durante el entrenamiento. Elige uno (con cierta aleatoriedad controlada por el parámetro "temperatura") y repite el proceso. Así, palabra por palabra, construye una respuesta coherente.

Los modelos modernos son MULTIMODALES: GPT-4o procesa texto, imágenes, audio y video en el mismo modelo. Le puedes mostrar la foto de un plato típico ecuatoriano y preguntarle "¿Qué ingredientes tiene un encebollado?" y respondería en texto. Esta convergencia entre tipos de medios es la frontera actual de la IA generativa.

QUÉ PUEDES HACER HOY EN ECUADOR CON IA GENERATIVA

• Generar contenido de marketing: anuncios, posts, emails personalizados (10x más rápido).
• Resumir documentos largos: contratos, leyes, manuales — ahorra horas de lectura.
• Traducir y localizar contenido: español ecuatoriano, kichwa, inglés técnico.
• Crear ilustraciones para redes sociales sin contratar diseñador.
• Programar prototipos en horas, no en semanas (Cursor, Copilot).
• Atención al cliente automatizada con chatbots conversacionales 24/7.
• Generar guiones, música de fondo, voces sintéticas para videos cortos.

LIMITACIONES QUE DEBES CONOCER

La IA generativa "alucina": inventa datos con seguridad. Le puedes preguntar por una ley ecuatoriana inexistente y te citará artículos ficticios. La salida depende de los datos de entrenamiento, que pueden estar sesgados o desactualizados. No tiene memoria persistente entre sesiones (a menos que se lo des explícitamente). No entiende causalidad — solo correlación estadística. Y produce contenido que puede infringir derechos de autor si se usa sin verificar.

Como profesional ecuatoriano, tu ventaja competitiva no es saber que existe la IA generativa — es saber usarla con criterio: verificar fuentes, auditar resultados, combinar IA con tu juicio profesional. Eso es lo que el mercado paga y lo que te enseñamos en ITSEIA.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "¿Qué es la IA Generativa? De GANs a GPT\nC1. Introducción a IA Aplicada — Tema 6\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido: "Al finalizar esta sesión serás capaz de:\n• Definir qué es la IA Generativa y diferenciarla de la IA tradicional\n• Identificar las arquitecturas clave: VAE, GAN, Diffusion y Transformers\n• Comprender cómo predice texto un modelo tipo GPT\n• Aplicar la IA generativa a casos reales en Ecuador",
    },
    {
      titulo: "IA Generativa vs IA Tradicional",
      contenido: "IA Tradicional: Clasifica o predice. ¿Es spam? ¿Qué nota sacará este alumno?\n\nIA Generativa: Crea contenido nuevo. Texto, imágenes, audio, video, código.\n\nDe ambas necesitas. Pero la GENERATIVA es lo que está cambiando el mercado laboral en 2026.",
    },
    {
      titulo: "Las 4 arquitecturas clave",
      contenido: "VAE (2013): comprime y reconstruye datos en un espacio latente\nGAN (Goodfellow, 2014): generador vs discriminador compitiendo\nDiffusion (2020-2022): aprende a quitar ruido paso a paso\nTransformers (Google, 2017): mecanismo de atención — base de GPT, Claude, Gemini\n\n\"Attention is All You Need\" — el paper que lo cambió todo.",
    },
    {
      titulo: "GAN vs Diffusion en imágenes",
      contenido: "GANs: thispersondoesnotexist.com — rostros 100% sintéticos\nDiffusion: DALL-E, Midjourney, Stable Diffusion\n\n¿La diferencia?\nGAN: rápido pero menos controlable\nDiffusion: más nítido, controlado por texto, mejor diversidad\n\nLa industria migró a Diffusion entre 2022 y 2024.",
    },
    {
      titulo: "Cómo predice texto GPT",
      contenido: "1. Recibe tu prompt → lo convierte en tokens (~media palabra cada uno)\n2. Predice probabilidades del SIGUIENTE token\n3. Elige uno (temperatura controla aleatoriedad)\n4. Repite hasta terminar\n\nNo consulta una base de datos. PREDICE patrones aprendidos en miles de millones de textos.\n\nPor eso a veces \"alucina\" — inventa con seguridad.",
    },
    {
      titulo: "Casos de uso en Ecuador",
      contenido: "• Marketing: anuncios y posts 10x más rápido\n• Legal: resumen de contratos y leyes\n• Educación: tutorías personalizadas 24/7\n• Salud: ImagemIA usa generativa para reportes médicos\n• Atención al cliente: chatbots para Banco Pichincha, Produbanco\n• Diseño: ilustraciones sin contratar diseñador\n• Desarrollo: prototipos en horas, no semanas",
    },
    {
      titulo: "Limitaciones que debes conocer",
      contenido: "1. Alucina: inventa datos con seguridad\n2. Sesgos: hereda prejuicios de los datos de entrenamiento\n3. Sin memoria persistente entre sesiones\n4. No entiende causalidad — solo patrones\n5. Puede infringir derechos de autor si no verificas\n\nTu valor profesional: usar IA con criterio, no a ciegas.",
    },
    {
      titulo: "Resumen del Tema 6",
      contenido: "1. La IA Generativa crea contenido — texto, imagen, audio, video, código\n2. Pasamos de VAE → GAN → Diffusion → Transformers en 10 años\n3. GPT predice token a token con probabilidades aprendidas\n4. Los modelos modernos son multimodales (GPT-4o, Claude 3.5)\n5. En Ecuador ya se usa en banca, salud, marketing y educación\n\nPróximo: Tema 7 — Prompt Engineering: principios y técnicas",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la diferencia principal entre IA tradicional e IA generativa?",
      opciones: [
        "La IA generativa funciona sin internet",
        "La IA tradicional clasifica/predice; la generativa crea contenido nuevo",
        "La IA generativa solo trabaja con imágenes",
        "No hay diferencia técnica real",
      ],
      respuesta: 1,
      explicacion: "La IA tradicional resuelve problemas de clasificación y predicción; la generativa produce contenido nuevo (texto, imágenes, audio, código).",
    },
    {
      pregunta: "¿Quién inventó las GANs (Generative Adversarial Networks)?",
      opciones: ["Geoffrey Hinton", "Yann LeCun", "Ian Goodfellow", "Andrew Ng"],
      respuesta: 2,
      explicacion: "Ian Goodfellow propuso las GANs en 2014. Dos redes (generador y discriminador) compiten para mejorar.",
    },
    {
      pregunta: "¿Qué arquitectura usan modelos como GPT-4 y Claude?",
      opciones: ["GANs", "VAE", "Transformers con mecanismo de atención", "Modelos de difusión"],
      respuesta: 2,
      explicacion: "GPT, Claude, Gemini y la mayoría de modelos de lenguaje modernos se basan en Transformers (paper 'Attention is All You Need', Google 2017).",
    },
    {
      pregunta: "¿Qué tecnología se usa hoy para generar imágenes en DALL-E, Midjourney y Stable Diffusion?",
      opciones: ["GANs", "Modelos de Difusión (Diffusion)", "Cadenas de Markov", "Redes recurrentes"],
      respuesta: 1,
      explicacion: "Los modelos de difusión generan imágenes partiendo de ruido y eliminándolo paso a paso, guiados por el prompt.",
    },
    {
      pregunta: "¿Qué significa que un modelo de IA generativa 'alucine'?",
      opciones: [
        "Que se desconecta a veces",
        "Que produce errores de sintaxis",
        "Que inventa información incorrecta presentándola como verdadera",
        "Que tarda mucho en responder",
      ],
      respuesta: 2,
      explicacion: "Alucinar significa generar datos plausibles pero falsos (citas, leyes, hechos inexistentes). Es una limitación crítica que debes verificar siempre.",
    },
  ],
  ejercicio: {
    titulo: "Mapeo comparativo: GAN vs Diffusion vs Transformer",
    objetivo: "Crear una tabla comparativa visual de las 3 arquitecturas modernas de IA generativa con ejemplos reales en Ecuador",
    herramientas: "Google Sheets + Canva + ChatGPT (chat.openai.com) + Claude (claude.ai)",
    datosEjemplo: "Arquitecturas a comparar:\n• GAN — Generative Adversarial Network (2014)\n• Diffusion Model — Modelo de difusión (2020-2022)\n• Transformer — Arquitectura de atención (2017)\n\nDimensiones de comparación:\n• Año de invención y autor\n• Cómo funciona en una frase\n• Qué genera mejor (texto, imagen, audio, video)\n• Ejemplo de producto comercial\n• Caso de uso real en Ecuador o LATAM\n• Ventajas y limitaciones",
    pasos: [
      "Crear un Google Sheet con columnas: Arquitectura, Año, Autor, Cómo funciona, Qué genera, Producto comercial, Caso Ecuador/LATAM, Ventajas, Limitaciones",
      "Investigar las 3 arquitecturas en Wikipedia, Google Cloud Skills Boost y los papers originales (al menos leer los abstracts)",
      "Llenar la tabla con datos verificados — no copiar de ChatGPT sin verificar",
      "Para cada arquitectura, identificar al menos 1 producto comercial real (ejemplo: GAN → NVIDIA StyleGAN; Diffusion → Midjourney; Transformer → ChatGPT)",
      "Buscar al menos 1 caso real de uso en Ecuador o LATAM por arquitectura (ejemplo: ImagemIA usa Diffusion para reportes médicos visuales)",
      "Diseñar una infografía en Canva que resuma la tabla con íconos y colores que diferencien las 3 arquitecturas",
      "Probar la diferencia en la práctica: pedirle a ChatGPT (Transformer) y a DALL-E (Diffusion) la misma idea — captura ambos resultados",
      "Escribir una conclusión de 200 palabras: '¿Cuál arquitectura tendrá más impacto en la economía ecuatoriana en los próximos 5 años y por qué?'",
    ],
    resultado: "Tabla comparativa completa con datos verificados, infografía profesional en Canva, capturas de pantalla de pruebas reales y conclusión fundamentada para Ecuador",
    criterios: [
      { criterio: "Tabla comparativa completa con datos correctos y fuentes", puntos: 30 },
      { criterio: "Infografía visual clara y profesional", puntos: 20 },
      { criterio: "Casos reales identificados (productos comerciales y Ecuador)", puntos: 20 },
      { criterio: "Pruebas prácticas con capturas (ChatGPT y DALL-E)", puntos: 15 },
      { criterio: "Conclusión fundamentada con visión local", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "Introduction to Generative AI — Google Cloud", url: "https://www.cloudskillsboost.google/course_templates/536", tipo: "documentacion", descripcion: "Curso oficial gratuito de Google Cloud sobre IA generativa con certificado. Subtítulos en español." },
    { titulo: "Attention is All You Need — Paper original", url: "https://arxiv.org/abs/1706.03762", tipo: "documentacion", descripcion: "Paper de Google (2017) que introdujo la arquitectura Transformer. Base de GPT, Claude, Gemini." },
    { titulo: "ThisPersonDoesNotExist", url: "https://thispersondoesnotexist.com", tipo: "herramienta", descripcion: "Demo en vivo de StyleGAN. Cada vez que recargas, ves un rostro 100% sintético generado por IA." },
    { titulo: "¿Qué es la IA Generativa? — IBM (español)", url: "https://www.ibm.com/es-es/topics/generative-ai", tipo: "lectura", descripcion: "Artículo claro de IBM en español sobre conceptos fundamentales de IA generativa." },
    { titulo: "Curso IA Generativa y LLMs — GitHub (Nicolás Metallo)", url: "https://github.com/machinelearnear/curso-ia-generativa-y-llms", tipo: "herramienta", descripcion: "Curso open-source en español con notebooks de Colab. Roadmap completo IA generativa y LLMs." },
    { titulo: "What is Generative AI? — AWS", url: "https://aws.amazon.com/es/what-is/generative-ai/", tipo: "lectura", descripcion: "Guía de AWS sobre IA generativa con ejemplos empresariales y arquitecturas técnicas." },
  ],
};

const tema7: TemaC1 = {
  id: 7,
  titulo: "Prompt Engineering: principios y técnicas",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/wM1NrkwJrvU",
  videoTitulo: "Curso de Prompt Engineering en Español: Cómo crear Prompts Efectivos (De 0 a Pro)",
  videoDuracion: "~45 min · Español · Curso completo en YouTube",
  slidesUrl: "",
  teoria: `El Prompt Engineering es la disciplina de diseñar instrucciones (prompts) que extraigan el mejor resultado posible de un modelo de IA generativa. No es magia ni adivinación — es una habilidad práctica con principios claros, demanda creciente y salarios competitivos. En 2026, dominar el prompting es tan importante para un profesional como saber escribir un correo formal lo era hace 20 años.

POR QUÉ IMPORTA EL PROMPT ENGINEERING

Un mismo modelo (ChatGPT, Claude, Gemini) puede darte resultados mediocres o brillantes dependiendo de cómo le hables. La diferencia entre "Escribe sobre marketing" y "Eres un especialista en marketing digital con 10 años de experiencia en LATAM. Escribe un plan de contenido de 30 días para una panadería en Quito que vende pan sin gluten, dirigido a mujeres 25-45 con sensibilidad al gluten. Incluye 3 publicaciones por semana, 2 reels y 1 carrusel. Usa tono cercano y emoji moderado." es la diferencia entre 30 minutos de re-trabajo y un entregable usable en el primer intento.

LOS 6 PRINCIPIOS DEL PROMPT EFECTIVO

1. Claridad: Sé específico. "Escribe un correo formal" es vago. "Escribe un correo formal de cobranza para un cliente que tiene 30 días de mora, monto $500, tono firme pero respetuoso, máximo 150 palabras, en español ecuatoriano" es claro.

2. Contexto: Dale al modelo la información que necesitaría un humano. Quién es el público, qué tono usar, qué evitar, qué objetivo tiene la tarea, qué restricciones existen.

3. Rol: Asignar una identidad mejora la respuesta. "Actúa como un abogado especializado en derecho laboral ecuatoriano" produce respuestas más técnicas y precisas que una pregunta genérica.

4. Formato: Indica explícitamente cómo quieres la salida. "Devuelve una tabla Markdown con 3 columnas", "Usa lista numerada", "Devuelve solo JSON con las claves nombre, edad, ciudad". Sin formato explícito, el modelo improvisa.

5. Restricciones: Limita la salida. "Máximo 200 palabras", "Sin emojis", "Solo en español formal", "No menciones competidores", "No inventes datos — si no sabes, dime explícitamente que no sabes".

6. Iteración: Refina. Tu primer prompt rara vez es el mejor. Pregunta de nuevo: "El tono fue muy formal, hazlo más cercano. Mantén la longitud."

LA FÓRMULA RTF — Rol, Tarea, Formato

Una fórmula simple para empezar: Rol + Tarea + Formato. Ejemplo:
"Eres un consultor de ventas B2B en Ecuador. (Rol) Redacta un email frío para CEO de una empresa logística para venderle un curso de IA aplicada a operaciones por $1,500. (Tarea) Devuelve el email en formato: asunto (60 caracteres máx), saludo, 3 párrafos cortos, CTA, firma. Tono profesional pero humano. Máximo 180 palabras totales. (Formato)"

LA FÓRMULA CRISPE — Más completa

C-R-I-S-P-E es un acrónimo más profesional:
• C — Capacity and Role: Quién eres tú (el modelo)
• R — Insight (contexto): Información de fondo
• S — Statement: La tarea exacta
• P — Personality: Tono, estilo, voz
• E — Experiment: Variantes posibles

Útil para tareas complejas y resultados de alta calidad.

ERRORES TÍPICOS DE PRINCIPIANTES

1. Prompts demasiado cortos: "Hazme un plan de marketing." El modelo no sabe para qué producto, qué público, qué presupuesto.
2. Pedir todo a la vez: "Hazme una estrategia, las publicaciones, el copy de los anuncios y los emails." Mejor dividir en pasos.
3. No dar ejemplos: Si quieres un estilo específico, muéstralo. "Quiero el tono de este texto: [pega ejemplo]".
4. No iterar: Aceptar la primera respuesta sin refinar.
5. No verificar: Confiar ciegamente en datos que el modelo da. Siempre verifica fechas, leyes, cifras.
6. No usar formato: Recibir bloques de texto cuando podrías recibir tablas, listas o JSON.

PROMPTS POSITIVOS VS NEGATIVOS

Los modelos responden mejor a instrucciones POSITIVAS ("Escribe en español ecuatoriano formal") que NEGATIVAS ("No escribas en mexicano"). Si necesitas excluir algo, sé específico: en vez de "No uses jerga", di "Usa vocabulario neutro de español latinoamericano formal".

EL PARÁMETRO TEMPERATURA

Aunque la mayoría de interfaces no lo expone, cuando uses la API podrás ajustar la "temperatura": 0 = determinista (siempre la misma respuesta), 0.7 = balanceado (default de ChatGPT), 1.0+ = creativo y aleatorio. Para tareas técnicas (resumir, traducir, extraer datos): temperatura baja. Para creatividad (poesía, ideas, brainstorming): temperatura alta.

CASOS DE USO PROFESIONAL EN ECUADOR

• Abogados: redactar contratos a partir de plantillas + datos del cliente.
• Marketing: crear 30 publicaciones de redes sociales en una sesión.
• Educadores: generar cuestionarios y planes de clase.
• Médicos: resumir historias clínicas largas en hallazgos clave.
• Empresarios: redactar propuestas comerciales personalizadas en minutos.
• Periodistas: investigar y estructurar artículos.

El profesional que domine prompt engineering en 2026 multiplica su productividad por 3-5x. No es opcional — es competencia básica.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Prompt Engineering: Principios y Técnicas\nC1. Introducción a IA Aplicada — Tema 7\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido: "Al finalizar esta sesión serás capaz de:\n• Aplicar los 6 principios del prompt efectivo\n• Usar las fórmulas RTF y CRISPE en tareas reales\n• Evitar los 6 errores típicos de principiantes\n• Iterar prompts hasta lograr el resultado deseado",
    },
    {
      titulo: "¿Por qué importa el prompting?",
      contenido: "Mismo modelo, prompts distintos = resultados radicalmente distintos.\n\nMAL: \"Escribe sobre marketing\"\nBIEN: \"Eres especialista en marketing digital LATAM con 10 años de experiencia. Escribe un plan de contenido de 30 días para panadería sin gluten en Quito, mujeres 25-45.\"\n\nDiferencia: 30 min de re-trabajo vs entregable usable.",
    },
    {
      titulo: "Los 6 principios del prompt efectivo",
      contenido: "1. Claridad — Sé específico, no vago\n2. Contexto — Da la información que necesitaría un humano\n3. Rol — \"Actúa como abogado laboral ecuatoriano...\"\n4. Formato — Tabla, lista, JSON, párrafos\n5. Restricciones — Máximo X palabras, sin emojis\n6. Iteración — Refina hasta perfección",
    },
    {
      titulo: "Fórmula RTF — Rol + Tarea + Formato",
      contenido: "ROL: \"Eres consultor de ventas B2B en Ecuador.\"\nTAREA: \"Redacta email frío para CEO de logística.\"\nFORMATO: \"Asunto (60 chars), saludo, 3 párrafos, CTA, firma. Máx 180 palabras.\"\n\nResultado: email listo para enviar al primer intento.\nFórmula simple, rápida, efectiva.",
    },
    {
      titulo: "Fórmula CRISPE — Profesional",
      contenido: "C — Capacity and Role: Quién eres\nR — Insight: contexto de fondo\nI — Insight (continuación)\nS — Statement: tarea exacta\nP — Personality: tono y estilo\nE — Experiment: variantes posibles\n\nIdeal para tareas complejas que requieren máxima calidad.\nUsa CRISPE en propuestas, contratos, contenido estratégico.",
    },
    {
      titulo: "6 errores típicos de principiantes",
      contenido: "1. Prompts demasiado cortos\n2. Pedir todo a la vez\n3. No dar ejemplos del estilo deseado\n4. No iterar — aceptar primera respuesta\n5. No verificar datos (alucinaciones)\n6. No especificar formato\n\n\"El prompt es como instrucciones a un becario brillante: cuanto más claro, mejor el resultado.\"",
    },
    {
      titulo: "Casos de uso profesional en Ecuador",
      contenido: "• Abogados: contratos personalizados en minutos\n• Marketing: 30 publicaciones de RR.SS en 1 sesión\n• Educadores: cuestionarios y planes de clase\n• Médicos: resúmenes de historias clínicas\n• Empresarios: propuestas comerciales\n• Periodistas: investigación y estructura de artículos\n\nProductividad: 3 a 5x quien NO domina prompts.",
    },
    {
      titulo: "Resumen del Tema 7",
      contenido: "1. El prompting es habilidad profesional clave en 2026\n2. 6 principios: claridad, contexto, rol, formato, restricciones, iteración\n3. Fórmula RTF para empezar; CRISPE para tareas complejas\n4. Prompts positivos > negativos\n5. Iterar siempre — el primer prompt rara vez es el mejor\n\nPróximo: Tema 8 — Prompts avanzados: cadena de pensamiento y few-shot",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué significa la fórmula RTF en prompting?",
      opciones: [
        "Real-Time Format",
        "Rol + Tarea + Formato",
        "Request, Test, Format",
        "Response Tuning Framework",
      ],
      respuesta: 1,
      explicacion: "RTF es una fórmula simple: definir el Rol del modelo, describir la Tarea y especificar el Formato de salida.",
    },
    {
      pregunta: "¿Cuál de estos es un PRINCIPIO del prompt efectivo?",
      opciones: [
        "Usar siempre mayúsculas",
        "Escribir siempre en inglés",
        "Dar contexto y especificar formato",
        "Usar prompts cortos siempre",
      ],
      respuesta: 2,
      explicacion: "Dar contexto y especificar formato son 2 de los 6 principios fundamentales (los otros: claridad, rol, restricciones, iteración).",
    },
    {
      pregunta: "Si quieres una respuesta determinista en una API, ¿qué temperatura usas?",
      opciones: ["Temperatura 0", "Temperatura 0.7", "Temperatura 1.5", "No importa"],
      respuesta: 0,
      explicacion: "Temperatura 0 hace al modelo determinista (siempre mismo output). Útil para tareas técnicas. Temperaturas altas (>1) son para creatividad.",
    },
    {
      pregunta: "¿Cuál es un error TÍPICO de principiantes en prompting?",
      opciones: [
        "Iterar mucho con el modelo",
        "Dar contexto detallado",
        "Pedir todo a la vez en un solo prompt",
        "Asignar un rol al modelo",
      ],
      respuesta: 2,
      explicacion: "Pedir muchas tareas en un solo prompt suele dar resultados mediocres. Mejor dividir en pasos secuenciales.",
    },
    {
      pregunta: "¿Cómo se redacta una restricción de forma EFECTIVA?",
      opciones: [
        "\"No uses palabras feas\"",
        "\"Sé bueno\"",
        "\"Usa vocabulario formal de español latinoamericano, máximo 200 palabras\"",
        "\"Hazlo bonito\"",
      ],
      respuesta: 2,
      explicacion: "Las instrucciones positivas y específicas (qué SÍ hacer) funcionan mejor que las negativas vagas. Cuantifica cuando puedas.",
    },
  ],
  ejercicio: {
    titulo: "Laboratorio de iteración: del mal prompt al prompt brillante",
    objetivo: "Transformar un prompt vago en un prompt profesional aplicando los 6 principios y la fórmula RTF, en un caso real ecuatoriano",
    herramientas: "ChatGPT (chat.openai.com) o Claude (claude.ai) — versión gratuita basta + Google Docs para registrar iteraciones",
    datosEjemplo: "Caso de negocio: Eres community manager freelance contratado por una cafetería en La Carolina (Quito). El dueño quiere atraer estudiantes universitarios de la USFQ. Presupuesto: $200/mes. Tu tarea es generar el primer mes de contenido para Instagram.\n\nPrompt inicial vago: \"Hazme contenido para Instagram de una cafetería\"",
    pasos: [
      "Abrir ChatGPT o Claude y pegar el prompt vago. Capturar la respuesta inicial (PROMPT v1)",
      "Aplicar el principio de CONTEXTO: agregar quién es el negocio, dónde está, a quién apunta, presupuesto, plataforma. Generar PROMPT v2 y capturar resultado",
      "Aplicar el principio de ROL: comenzar con 'Eres un community manager con 5 años de experiencia en cafeterías ecuatorianas...'. Generar PROMPT v3 y capturar resultado",
      "Aplicar el principio de FORMATO: pedir tabla con columnas (día, tipo de post, copy, hashtags, hora de publicación). Generar PROMPT v4 y capturar resultado",
      "Aplicar RESTRICCIONES: máximo 30 publicaciones, tono cercano, español ecuatoriano, sin clichés como 'el mejor café'. Generar PROMPT v5 y capturar resultado",
      "Iterar 1 vez más: si algo no te gusta del v5, refínalo (ejemplo: 'Mantén todo igual pero los miércoles haz una promoción especial para estudiantes con descuento del 15%'). Generar PROMPT v6 final",
      "Aplicar la fórmula CRISPE en un nuevo prompt complementario: pedir un email semanal a clientes frecuentes. Documentar cada componente C-R-I-S-P-E",
      "Crear documento final en Google Docs comparando los 6 prompts (v1 a v6) lado a lado con los resultados, y escribir un análisis de 200 palabras: ¿qué cambió en la calidad y por qué?",
    ],
    resultado: "Documento Google Docs con 6 versiones del prompt, cada respuesta capturada, análisis comparativo de la mejora y un prompt CRISPE final listo para usar en cliente real",
    criterios: [
      { criterio: "Aplicación correcta de los 6 principios en orden secuencial", puntos: 30 },
      { criterio: "Calidad y mejora visible entre versiones (v1 → v6)", puntos: 25 },
      { criterio: "Uso correcto de la fórmula CRISPE en prompt complementario", puntos: 20 },
      { criterio: "Análisis comparativo fundamentado", puntos: 15 },
      { criterio: "Aplicabilidad real al contexto ecuatoriano", puntos: 10 },
    ],
  },
  recursos: [
    { titulo: "Learn Prompting (en español)", url: "https://learnprompting.org/es/docs/introduction", tipo: "documentacion", descripcion: "Curso open-source más completo del mundo sobre prompting, traducido al español. Desde básico hasta avanzado." },
    { titulo: "Prompt Engineering Guide — DAIR.AI", url: "https://www.promptingguide.ai/es", tipo: "documentacion", descripcion: "Guía técnica completa con técnicas, papers y ejemplos. Versión en español disponible." },
    { titulo: "OpenAI — Best practices for prompt engineering", url: "https://platform.openai.com/docs/guides/prompt-engineering", tipo: "documentacion", descripcion: "Guía oficial de OpenAI con mejores prácticas para prompts en GPT-4 y modelos relacionados." },
    { titulo: "Anthropic Prompt Library", url: "https://docs.anthropic.com/en/prompt-library/library", tipo: "herramienta", descripcion: "Biblioteca oficial de Anthropic con prompts probados para tareas comunes (categorización, redacción, análisis)." },
    { titulo: "ChatGPT — chat.openai.com", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "Plataforma de OpenAI para practicar prompting. Versión gratuita disponible con GPT-4o mini." },
    { titulo: "Claude — claude.ai", url: "https://claude.ai", tipo: "herramienta", descripcion: "Plataforma de Anthropic. Excelente para tareas de razonamiento, análisis legal y escritura larga." },
  ],
};

const tema8: TemaC1 = {
  id: 8,
  titulo: "Prompts avanzados: cadena de pensamiento y few-shot",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/gAoVIsOlRJg",
  videoTitulo: "Curso Prompt Engineering en Español — Técnicas avanzadas (Zero-shot, Few-shot, CoT)",
  videoDuracion: "~35 min · Español · Curso gratuito completo",
  slidesUrl: "",
  teoria: `Una vez que dominas los principios básicos del prompting, las técnicas avanzadas te permiten resolver problemas complejos: razonamiento matemático, análisis legal, diagnóstico técnico, planificación estratégica. Las dos técnicas más poderosas son Few-Shot Prompting y Chain-of-Thought (CoT) — y ambas se inventaron entre 2020 y 2022 transformando la industria.

ZERO-SHOT, ONE-SHOT, FEW-SHOT — La gradación

• Zero-shot: Le pides al modelo que haga la tarea sin darle ningún ejemplo. "Clasifica este review como positivo, negativo o neutro: 'El servicio fue lento.'" Funciona para tareas simples y modelos potentes.

• One-shot: Le das UN ejemplo antes de la tarea real. "Clasifica el sentimiento. Ejemplo: 'Me encantó el café' → Positivo. Ahora clasifica: 'El servicio fue lento.'"

• Few-shot: Le das VARIOS ejemplos (típicamente 3-10). Funciona como "aprendizaje sin entrenamiento": el modelo identifica el patrón y lo aplica.

Few-shot es especialmente poderoso para:
- Formato consistente (extraer datos en JSON específico)
- Estilo personalizado (escribir como tu marca)
- Clasificación con categorías custom
- Razonamiento complejo en dominios especializados

Ejemplo Few-shot para extracción de datos:
"""
Extrae nombre, edad, ciudad de cada texto. Devuelve solo JSON.

Ejemplo 1: 'Juan tiene 30 años y vive en Quito.' → {"nombre":"Juan","edad":30,"ciudad":"Quito"}
Ejemplo 2: 'María, de Guayaquil, cumple 25 mañana.' → {"nombre":"María","edad":25,"ciudad":"Guayaquil"}
Ejemplo 3: 'Vivo en Cuenca y tengo 42, soy Pedro.' → {"nombre":"Pedro","edad":42,"ciudad":"Cuenca"}

Ahora extrae de: 'La doctora Ana López, 38, atiende en Ambato.'
"""

El modelo aprende el formato y lo aplica con precisión casi perfecta.

CHAIN-OF-THOUGHT (CoT) — La revolución del razonamiento

En 2022, investigadores de Google publicaron un paper que demostró algo sorprendente: si le pides al modelo que "piense paso a paso" antes de dar la respuesta final, su precisión en problemas matemáticos y de razonamiento sube de 18% a 57%. Es lo que se conoce como Chain-of-Thought Prompting.

Hay dos formas de aplicar CoT:

1. CoT explícito (Few-shot CoT): Le das ejemplos donde muestras el razonamiento paso a paso.

Ejemplo:
"""
P: Si Juan tiene 5 manzanas y come 2, luego compra 3 más, ¿cuántas tiene al final?
R: Juan empieza con 5 manzanas. Come 2, le quedan 5-2=3. Compra 3 más, total 3+3=6. Respuesta: 6.

P: Si una empresa factura $10,000 al mes y sus costos son $7,500, ¿cuál es su margen anual?
R:
"""

2. Zero-shot CoT (la frase mágica): Simplemente añades "Pensemos paso a paso" o "Let's think step by step" al final de la pregunta. Increíblemente, esto solo ya activa el modo de razonamiento del modelo.

Ejemplo:
"""
Si la inflación en Ecuador fue 3.2% en 2024 y 2.8% en 2025, ¿cuál fue la inflación acumulada de los 2 años? Pensemos paso a paso.
"""

CoT funciona porque obliga al modelo a generar tokens intermedios que le dan más "espacio de cómputo" para llegar a la respuesta correcta. Es como cuando te enseñaron en el colegio a "mostrar tu trabajo" en matemáticas.

CUÁNDO USAR CADA TÉCNICA

• Tareas simples (resumir, traducir, extraer): Zero-shot funciona.
• Formato específico o estilo de marca: Few-shot.
• Problemas matemáticos, lógica, razonamiento: CoT (zero-shot o few-shot CoT).
• Análisis legal, médico, financiero: Few-shot CoT (combinar ambas).
• Tareas creativas (poesía, ideas): Zero-shot con buena descripción.

TÉCNICAS COMPLEMENTARIAS DE NIVEL EXPERTO

Self-Consistency: Pides el mismo problema varias veces con CoT y eliges la respuesta más frecuente. Mejora la precisión en matemáticas y lógica.

Tree of Thoughts (ToT): El modelo explora múltiples ramas de razonamiento antes de elegir la mejor. Útil para planificación estratégica.

ReAct (Reasoning + Acting): Alterna razonamiento con acciones (búsquedas web, cálculos). Es la base de los "AI agents" modernos.

Role-Prompting Avanzado: No solo "actúa como abogado", sino "actúa como abogado laboral ecuatoriano con 15 años de experiencia que conoce el Código de Trabajo y los últimos fallos de la Corte Constitucional sobre estabilidad laboral."

PROMPT CHAINING — Encadenar tareas

Para tareas grandes, divide en pasos. Cada salida alimenta el siguiente prompt:

Paso 1: "Genera 10 ideas de productos digitales para emprendedores ecuatorianos."
Paso 2: "De estas 10 ideas, selecciona las 3 más viables. Justifica."
Paso 3: "Para la mejor de las 3, redacta un plan de negocio en 1 página."
Paso 4: "Convierte el plan en una propuesta visual para inversionistas."

Esto reduce errores y te permite revisar y corregir entre pasos.

CASOS DE USO AVANZADOS EN ECUADOR

• Análisis de fallos judiciales (CoT + Few-shot): subir 3 fallos similares y pedir análisis del cuarto.
• Diagnóstico médico asistido (Few-shot CoT): patrón de síntomas → diagnóstico diferencial.
• Auditoría contable: extracción de datos (Few-shot) + análisis (CoT).
• Estrategia comercial: ToT para evaluar múltiples escenarios de mercado.
• Educación personalizada: explicaciones adaptadas al nivel del estudiante con CoT.

El profesional que domina técnicas avanzadas no solo "usa IA" — la convierte en su socio de pensamiento. Esa es la diferencia entre quien gana $800/mes y quien gana $3,000/mes en el mercado de IA aplicada.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Prompts Avanzados: Chain-of-Thought y Few-Shot\nC1. Introducción a IA Aplicada — Tema 8\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido: "Al finalizar esta sesión serás capaz de:\n• Distinguir Zero-shot, One-shot y Few-shot prompting\n• Aplicar Chain-of-Thought (CoT) en problemas de razonamiento\n• Usar Self-Consistency, Tree of Thoughts y ReAct\n• Encadenar prompts para tareas complejas",
    },
    {
      titulo: "Zero/One/Few-Shot — La gradación",
      contenido: "Zero-shot: Sin ejemplos. \"Clasifica: 'El servicio fue lento.'\"\nOne-shot: Un ejemplo + tarea\nFew-shot: 3-10 ejemplos + tarea (más poderoso)\n\n¿Cuándo Few-shot?\n• Formato consistente (JSON)\n• Estilo de marca\n• Categorías custom\n• Razonamiento especializado",
    },
    {
      titulo: "Few-Shot en acción — extracción de datos",
      contenido: "Ejemplo 1: 'Juan tiene 30 años y vive en Quito.' → {\"nombre\":\"Juan\",\"edad\":30,\"ciudad\":\"Quito\"}\nEjemplo 2: 'María, de Guayaquil, cumple 25.' → {\"nombre\":\"María\",\"edad\":25,\"ciudad\":\"Guayaquil\"}\nEjemplo 3: 'Soy Pedro, 42, Cuenca.' → {\"nombre\":\"Pedro\",\"edad\":42,\"ciudad\":\"Cuenca\"}\n\nAhora: 'La doctora Ana López, 38, atiende en Ambato.' → ?\n\nEl modelo aprende el patrón y lo aplica con precisión casi perfecta.",
    },
    {
      titulo: "Chain-of-Thought (CoT) — La revolución",
      contenido: "Google 2022: pedir al modelo \"pensar paso a paso\" sube precisión del 18% al 57% en matemáticas.\n\n2 formas:\n• CoT explícito: ejemplos con razonamiento detallado\n• Zero-shot CoT: solo añade \"Pensemos paso a paso\"\n\nFunciona porque genera tokens intermedios que dan al modelo más \"espacio de cómputo\" para razonar.",
    },
    {
      titulo: "Cuándo usar cada técnica",
      contenido: "Resumir, traducir, extraer simples → Zero-shot\nFormato específico o estilo de marca → Few-shot\nMatemáticas, lógica, razonamiento → CoT\nAnálisis legal/médico/financiero → Few-shot CoT\nCreatividad → Zero-shot con buena descripción\n\nDominar estas técnicas es la diferencia entre $800 y $3,000/mes en LATAM.",
    },
    {
      titulo: "Técnicas de nivel experto",
      contenido: "Self-Consistency: pides la misma respuesta varias veces y eliges la moda\nTree of Thoughts (ToT): explora múltiples ramas de razonamiento\nReAct: razonamiento + acciones (búsquedas, cálculos) — base de los \"agents\"\nRole-Prompting Avanzado: \"abogado laboral ecuatoriano, 15 años, conoce Código de Trabajo y fallos recientes\"",
    },
    {
      titulo: "Prompt Chaining — Encadenar tareas",
      contenido: "Tarea grande → divide en pasos. Cada salida alimenta el siguiente prompt.\n\nEjemplo:\n1. Genera 10 ideas de productos digitales\n2. Selecciona las 3 más viables, justifica\n3. Plan de negocio para la mejor (1 página)\n4. Convierte en propuesta visual para inversionistas\n\nReduce errores. Permite revisar entre pasos.",
    },
    {
      titulo: "Resumen del Tema 8",
      contenido: "1. Few-shot transmite formato y estilo con ejemplos\n2. CoT obliga al modelo a razonar paso a paso\n3. Zero-shot CoT: la frase mágica \"Pensemos paso a paso\"\n4. Self-Consistency, ToT y ReAct para problemas duros\n5. Prompt Chaining: divide tareas grandes en pasos pequeños\n\nPróximo: Tema 9 — ChatGPT y Claude: comparativa práctica",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué es Few-Shot Prompting?",
      opciones: [
        "Un prompt que se ejecuta varias veces",
        "Dar al modelo varios ejemplos antes de la tarea real",
        "Un prompt sin contexto",
        "Una técnica para acortar prompts",
      ],
      respuesta: 1,
      explicacion: "Few-shot consiste en mostrar al modelo varios ejemplos del patrón que debe seguir. Mejora precisión en formato y estilo.",
    },
    {
      pregunta: "¿Qué frase activa el modo de razonamiento Zero-shot CoT?",
      opciones: [
        "\"Responde rápido\"",
        "\"Sé creativo\"",
        "\"Pensemos paso a paso\" / \"Let's think step by step\"",
        "\"Resume en 1 línea\"",
      ],
      respuesta: 2,
      explicacion: "Investigadores de Google demostraron que esa frase mágica activa el razonamiento paso a paso del modelo.",
    },
    {
      pregunta: "¿Para qué tarea es MÁS útil el Chain-of-Thought (CoT)?",
      opciones: [
        "Traducir un saludo",
        "Resolver un problema de matemáticas o lógica",
        "Extraer un nombre de un texto",
        "Generar un haiku",
      ],
      respuesta: 1,
      explicacion: "CoT mejora dramáticamente la precisión en problemas que requieren razonamiento paso a paso (matemáticas, lógica, análisis).",
    },
    {
      pregunta: "¿Qué es Self-Consistency en prompting?",
      opciones: [
        "Que el modelo responda siempre lo mismo",
        "Pedir la respuesta varias veces y elegir la más frecuente",
        "Un tipo de fine-tuning",
        "Un prompt sin variaciones",
      ],
      respuesta: 1,
      explicacion: "Self-Consistency genera múltiples respuestas con CoT y selecciona la más común. Mejora precisión en lógica.",
    },
    {
      pregunta: "¿Qué es Prompt Chaining?",
      opciones: [
        "Encadenar varios prompts: la salida de uno es entrada del siguiente",
        "Un solo prompt muy largo",
        "Conectar dos modelos distintos",
        "Repetir el mismo prompt 5 veces",
      ],
      respuesta: 0,
      explicacion: "Prompt Chaining divide tareas complejas en pasos secuenciales, donde cada salida alimenta al siguiente prompt. Reduce errores.",
    },
  ],
  ejercicio: {
    titulo: "Resolver problemas de auditoría con CoT y Few-Shot",
    objetivo: "Aplicar Chain-of-Thought y Few-Shot a un caso real de análisis financiero ecuatoriano y comparar resultados con prompts simples",
    herramientas: "ChatGPT (chat.openai.com) o Claude (claude.ai) + Google Sheets para registrar resultados",
    datosEjemplo: "Caso: Pequeña empresa ecuatoriana 'Panadería Doña Rosa' con datos:\n• Ingresos 2025: $48,000 anuales\n• Costos directos: $24,000\n• Gastos operativos: $14,400\n• Impuestos (RUC personas naturales): asume 0% si renta neta < base imponible\n• Base imponible 2025 (Ecuador): $11,902\n\nProblema: ¿Cuánto debe pagar de Impuesto a la Renta? ¿Cuál es la utilidad neta?",
    pasos: [
      "PROMPT v1 (Zero-shot básico): Pregunta directa al modelo sin más contexto. Captura respuesta",
      "PROMPT v2 (Zero-shot CoT): Misma pregunta + 'Pensemos paso a paso'. Captura respuesta",
      "PROMPT v3 (Few-shot CoT): Antes del problema, dale 2 ejemplos resueltos paso a paso de cálculo de utilidad e impuestos para emprendedores ecuatorianos. Captura respuesta",
      "Validar las 3 respuestas: ¿cuál es matemáticamente correcta? ¿Cuál considera el contexto ecuatoriano?",
      "Aplicar Self-Consistency: ejecuta el PROMPT v3 tres veces. ¿Coinciden las respuestas? Si no, ¿cuál es la mayoría?",
      "Aplicar Role-Prompting avanzado: comienza con 'Eres contador público autorizado en Ecuador con 10 años de experiencia en pequeños negocios. Conoces la LORTI y los rangos de la base imponible 2025.' Captura respuesta",
      "Crear un Prompt Chain de 3 pasos: (1) calcular utilidad neta, (2) calcular impuesto a la renta aplicable, (3) sugerir 3 estrategias legales para optimizar carga tributaria. Captura cada paso",
      "Crear documento Google Sheets con columnas: Técnica, Prompt, Respuesta, Precisión (1-10), Tiempo. Escribir conclusión de 200 palabras: ¿qué técnica fue más efectiva y por qué?",
    ],
    resultado: "Hoja de cálculo con 5+ versiones del problema resueltas con técnicas distintas, comparación cuantitativa de calidad, y conclusión fundamentada sobre cuál técnica conviene a un contador ecuatoriano",
    criterios: [
      { criterio: "Aplicación correcta de CoT (zero-shot y few-shot)", puntos: 25 },
      { criterio: "Aplicación de Self-Consistency con análisis", puntos: 15 },
      { criterio: "Role-Prompting avanzado con contexto ecuatoriano", puntos: 20 },
      { criterio: "Prompt Chaining funcional con 3 pasos", puntos: 25 },
      { criterio: "Conclusión comparativa fundamentada", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "Chain-of-Thought Prompting (paper original)", url: "https://arxiv.org/abs/2201.11903", tipo: "documentacion", descripcion: "Paper de Google (Wei et al., 2022) que introdujo Chain-of-Thought. Lectura fundamental." },
    { titulo: "Tree of Thoughts (paper)", url: "https://arxiv.org/abs/2305.10601", tipo: "documentacion", descripcion: "Paper que introdujo ToT, técnica para problemas complejos con múltiples ramas de razonamiento." },
    { titulo: "ReAct: Reasoning + Acting (paper)", url: "https://arxiv.org/abs/2210.03629", tipo: "documentacion", descripcion: "Paper de Princeton/Google que introdujo ReAct, base de los AI agents modernos." },
    { titulo: "Cadena de Pensamiento — LearnPrompting (español)", url: "https://learnprompting.org/es/docs/intermediate/chain_of_thought", tipo: "lectura", descripcion: "Explicación clara en español de Chain-of-Thought con ejemplos prácticos." },
    { titulo: "Few-Shot Prompting — Prompting Guide", url: "https://www.promptingguide.ai/es/techniques/fewshot", tipo: "lectura", descripcion: "Guía técnica de Few-Shot con teoría, casos de uso y limitaciones." },
    { titulo: "Anthropic — Building effective prompts", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", tipo: "documentacion", descripcion: "Documentación oficial de Anthropic con técnicas avanzadas para Claude (chain-of-thought, XML tags, examples)." },
  ],
};

const tema9: TemaC1 = {
  id: 9,
  titulo: "ChatGPT y Claude: comparativa práctica",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/tdjMFxaZo-E",
  videoTitulo: "Claude de 0 a Experto: La Guía Completa 2026 (mejor que ChatGPT)",
  videoDuracion: "~50 min · Español · Guía completa actualizada 2026",
  slidesUrl: "",
  teoria: `ChatGPT y Claude son los dos modelos de lenguaje más usados profesionalmente en el mundo en 2026. Ambos parten de la arquitectura Transformer, ambos cuestan similar, ambos tienen versiones gratuitas — pero tienen filosofías, fortalezas y debilidades muy distintas. Como profesional, elegir bien según la tarea puede multiplicar tu productividad o frustrarte sin saber por qué.

LAS DOS EMPRESAS DETRÁS

OpenAI (creador de ChatGPT) fue fundada en 2015 por Sam Altman, Elon Musk, Ilya Sutskever y otros. Hoy es una empresa con valuación >$157 mil millones, respaldada principalmente por Microsoft (que ha invertido más de $13B). Filosofía: "AGI segura para toda la humanidad", aunque críticos cuestionan qué tan abierta sigue siendo.

Anthropic (creador de Claude) fue fundada en 2021 por Dario y Daniela Amodei (ex-OpenAI) y otros investigadores. Su misión es "investigación en seguridad de IA". Inversores principales: Amazon ($4B+) y Google ($2B). Su enfoque se llama "Constitutional AI": entrenar modelos con un conjunto de principios éticos explícitos.

LOS MODELOS EN 2026

OpenAI:
• GPT-5 (lanzado 2025): modelo principal, multimodal nativo (texto, imagen, audio, video)
• GPT-5.4: versión actualizada con mejor razonamiento
• GPT-4o mini: versión gratuita, rápida, suficiente para tareas comunes

Anthropic:
• Claude Opus 4.6: el más potente — 80.8% en SWE-bench Verified (benchmark de código)
• Claude Sonnet 4.5: balance velocidad/calidad — recomendado para uso diario
• Claude Haiku 4.5: rápido y barato — para tareas simples

Ambas empresas también ofrecen contextos de 1 millón de tokens (~750,000 palabras), lo que permite analizar libros completos, bases de código grandes o años de correspondencia legal en una sola conversación.

FORTALEZAS DE CHATGPT

1. Generación de imágenes integrada (GPT-5 con DALL-E 4): le pides una imagen y la genera en la misma conversación.
2. Voice Mode: conversación de voz natural, casi indistinguible de hablar con humano. Excelente para idiomas.
3. Custom GPTs: puedes crear y compartir versiones personalizadas para tareas específicas (ejemplo: "Tutor de inglés para ecuatorianos").
4. Integración con la web (búsqueda en tiempo real).
5. Computer Use: GPT-5 puede ver tu pantalla y hacer clic, escribir, navegar — útil para automatización.
6. Comunidad gigante: millones de prompts compartidos en GitHub, Reddit, foros.
7. Mejor en tareas creativas con tono "viral" (memes, posts virales, copy publicitario).

FORTALEZAS DE CLAUDE

1. Razonamiento profundo: Claude 4.6 supera a GPT-5 en muchos benchmarks de lógica, matemáticas, código y análisis legal.
2. Escritura larga y matizada: redacta ensayos, contratos, propuestas con menos clichés y mejor estructura.
3. Honestidad: cuando no sabe, lo dice. Tiende a alucinar menos que ChatGPT.
4. Análisis de documentos: contextos de 1M tokens (200K en plan gratuito) — sube PDFs, contratos, códigos enormes.
5. Programación: 80.8% en SWE-bench Verified vs ~70% de GPT-5. La elección de los desarrolladores en 2026.
6. Artifacts: ventana paralela donde Claude crea código, documentos o componentes interactivos que puedes editar en vivo.
7. Tono más respetuoso y matizado para temas delicados (política, ética, religión).

CUÁNDO USAR CADA UNO

Usa ChatGPT (GPT-5) para:
• Generar imágenes en la conversación
• Conversaciones de voz para practicar idiomas
• Búsquedas en tiempo real
• Tareas creativas con sabor viral (redes sociales, memes)
• Cuando necesitas Custom GPTs específicos
• Automatización de tu computadora con Computer Use

Usa Claude (Opus 4.6 o Sonnet 4.5) para:
• Programar (especialmente en proyectos complejos con Cursor)
• Análisis de documentos largos (contratos, leyes, códigos)
• Escritura de calidad profesional (ensayos, propuestas, libros)
• Razonamiento matemático y lógico
• Tareas que exigen mínima alucinación (legal, médico, financiero)
• Cuando trabajas con artefactos interactivos

PRECIOS COMPARATIVOS (2026, US dólares, planes individuales)

ChatGPT:
• Free: GPT-4o mini, límites diarios. Suficiente para usuarios casuales.
• Plus: $20/mes — GPT-5, generación de imágenes, voice mode, prioridad.
• Pro: $200/mes — GPT-5 con razonamiento extendido, sin límites prácticos.

Claude:
• Free: Claude Sonnet 4.5, límites diarios. Excelente como prueba.
• Pro: $20/mes — Claude Opus 4.6 con límites generosos, contexto de 1M tokens.
• Max: $100-$200/mes — Claude Opus 4.6 con contexto de 1M y prioridad.

API: ambos cobran por tokens (~$3-15 por millón de tokens según el modelo).

BENCHMARKS PÚBLICOS 2026

• SWE-bench Verified (código): Claude Opus 4.6 (80.8%) > GPT-5 (~70%)
• MMLU (conocimiento general): GPT-5 (~92%) ≈ Claude Opus (~90%)
• HumanEval (programación): Claude Opus 4.6 (94%) > GPT-5 (~88%)
• GSM8K (matemáticas): GPT-5 (~96%) ≈ Claude Opus (~95%)
• Hallucination rate: Claude < GPT (Claude alucina menos)

EL ENFOQUE PRÁCTICO PARA UN PROFESIONAL ECUATORIANO

La estrategia inteligente: usa ambos. Por $40/mes ($20 cada uno) tienes acceso a las dos versiones premium. Cada uno destaca en cosas distintas, y cuando uno te frustra, el otro suele resolverlo.

En ITSEIA enseñamos a usar Claude para análisis profesional, escritura larga y código; ChatGPT para creatividad, redes sociales e imágenes; y Gemini de Google para búsquedas integradas con el ecosistema Google Workspace.

El profesional que NO usa estos modelos en 2026 está compitiendo con una mano atada a la espalda. El que usa solo uno está dejando dinero sobre la mesa. El que sabe cuándo usar cada uno gana 3x más en cualquier industria.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "ChatGPT y Claude: Comparativa Práctica\nC1. Introducción a IA Aplicada — Tema 9\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido: "Al finalizar esta sesión serás capaz de:\n• Comparar arquitecturas, filosofías y modelos de OpenAI y Anthropic\n• Identificar cuándo usar ChatGPT vs cuándo usar Claude\n• Interpretar benchmarks 2026 (SWE-bench, MMLU, HumanEval)\n• Diseñar tu propio stack de IA para trabajo profesional",
    },
    {
      titulo: "Las 2 empresas detrás",
      contenido: "OpenAI (ChatGPT) — fundada 2015 por Altman, Musk, Sutskever\n• Inversor principal: Microsoft ($13B+)\n• Filosofía: AGI segura para toda la humanidad\n\nAnthropic (Claude) — fundada 2021 por hermanos Amodei (ex-OpenAI)\n• Inversores: Amazon ($4B+), Google ($2B)\n• Filosofía: Constitutional AI (principios éticos explícitos)",
    },
    {
      titulo: "Modelos en 2026",
      contenido: "OpenAI:\n• GPT-5 — multimodal nativo (texto, imagen, audio, video)\n• GPT-5.4 — mejor razonamiento\n• GPT-4o mini — gratuito\n\nAnthropic:\n• Claude Opus 4.6 — el más potente (80.8% SWE-bench)\n• Claude Sonnet 4.5 — balance velocidad/calidad\n• Claude Haiku 4.5 — rápido y barato\n\nAmbos: contexto de hasta 1M tokens.",
    },
    {
      titulo: "Fortalezas de ChatGPT",
      contenido: "1. Generación de imágenes integrada (DALL-E 4)\n2. Voice Mode — conversación natural\n3. Custom GPTs — versiones especializadas\n4. Búsqueda web en tiempo real\n5. Computer Use — controla tu pantalla\n6. Comunidad gigante de prompts\n7. Tono \"viral\" (redes sociales, memes)",
    },
    {
      titulo: "Fortalezas de Claude",
      contenido: "1. Razonamiento profundo (supera a GPT-5 en lógica)\n2. Escritura larga y matizada\n3. Más honesto — alucina menos\n4. Análisis de documentos largos (1M tokens)\n5. Programación: 80.8% SWE-bench (líder en 2026)\n6. Artifacts — ventana interactiva paralela\n7. Tono respetuoso para temas delicados",
    },
    {
      titulo: "Cuándo usar cada uno",
      contenido: "ChatGPT para:\n• Imágenes en chat\n• Voz / idiomas\n• Búsqueda web\n• Creatividad viral\n• Custom GPTs\n• Computer Use\n\nClaude para:\n• Programación seria\n• Análisis de docs largos\n• Escritura profesional\n• Razonamiento matemático/lógico\n• Tareas con mínima alucinación\n• Artifacts",
    },
    {
      titulo: "Precios y benchmarks 2026",
      contenido: "Precios:\nChatGPT Plus / Claude Pro: $20/mes cada uno\nPro/Max: $100-$200/mes\n\nBenchmarks clave:\n• SWE-bench (código): Claude (80.8%) > GPT (70%)\n• HumanEval: Claude (94%) > GPT (88%)\n• MMLU (general): GPT ≈ Claude\n• GSM8K (matemáticas): GPT (96%) ≈ Claude (95%)\n• Hallucinations: Claude < GPT",
    },
    {
      titulo: "Resumen del Tema 9",
      contenido: "1. ChatGPT (OpenAI) y Claude (Anthropic) son los líderes 2026\n2. ChatGPT brilla en multimodal, voz, imágenes, comunidad\n3. Claude lidera en código, razonamiento, escritura larga, honestidad\n4. La estrategia inteligente: usar ambos ($40/mes)\n5. El profesional que NO los usa en 2026 está en desventaja\n\nPróximo: Tema 10 — Generación de imágenes con DALL-E, Midjourney y Stable Diffusion",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué empresa está detrás de Claude?",
      opciones: ["OpenAI", "Google DeepMind", "Anthropic", "Meta AI"],
      respuesta: 2,
      explicacion: "Claude es desarrollado por Anthropic, fundada en 2021 por Dario y Daniela Amodei (ex-OpenAI).",
    },
    {
      pregunta: "Según los benchmarks 2026, ¿qué modelo destaca MÁS en programación (SWE-bench)?",
      opciones: ["GPT-5", "Claude Opus 4.6", "Gemini Pro", "LLaMA 3"],
      respuesta: 1,
      explicacion: "Claude Opus 4.6 alcanza 80.8% en SWE-bench Verified, superando a GPT-5 (~70%) en programación.",
    },
    {
      pregunta: "¿Qué fortaleza ÚNICA tiene ChatGPT que Claude NO ofrece de forma nativa?",
      opciones: [
        "Generación de imágenes integrada en la conversación",
        "Análisis de documentos PDF",
        "Programación",
        "Resúmenes de texto",
      ],
      respuesta: 0,
      explicacion: "ChatGPT integra DALL-E directamente — generas imágenes en la misma conversación. Claude no genera imágenes nativamente.",
    },
    {
      pregunta: "¿Qué es 'Constitutional AI', el enfoque de Anthropic?",
      opciones: [
        "Una constitución legal para empresas de IA",
        "Entrenar modelos con un conjunto de principios éticos explícitos",
        "Un tipo de fine-tuning",
        "Una técnica de búsqueda",
      ],
      respuesta: 1,
      explicacion: "Constitutional AI es el método de Anthropic para entrenar modelos guiándolos con principios éticos durante el entrenamiento.",
    },
    {
      pregunta: "Para un profesional ecuatoriano que va a programar y analizar contratos, ¿qué modelo conviene MÁS?",
      opciones: [
        "ChatGPT Free",
        "Claude Pro (Opus 4.6) por su superioridad en código y análisis largo",
        "Gemini gratuito",
        "Cualquiera, son idénticos",
      ],
      respuesta: 1,
      explicacion: "Claude Opus 4.6 lidera en código (SWE-bench) y soporta contextos de 1M tokens — ideal para contratos largos y proyectos.",
    },
  ],
  ejercicio: {
    titulo: "Test ciego: ChatGPT vs Claude en 5 tareas profesionales reales",
    objetivo: "Ejecutar 5 tareas idénticas en ambos modelos, evaluar resultados con criterios objetivos y construir tu propia matriz de decisión",
    herramientas: "ChatGPT Free o Plus (chat.openai.com) + Claude Free o Pro (claude.ai) + Google Sheets",
    datosEjemplo: "5 tareas a evaluar:\n1. Programación: 'Escribe un script Python que extraiga emails de un PDF y los exporte a CSV'\n2. Escritura profesional: 'Redacta una propuesta comercial de 1 página para vender consultoría de IA a una pyme ecuatoriana de logística (precio $1,500/mes)'\n3. Análisis legal: 'Lee este contrato laboral [pegar uno tipo] e identifica 5 cláusulas riesgosas según Código de Trabajo de Ecuador'\n4. Razonamiento matemático: 'Una empresa importa 500 pares de zapatos a Ecuador a $25 c/u. Aranceles 30%, IVA 15%. Calcula precio mínimo de venta para 25% de margen neto'\n5. Creatividad viral: 'Genera 5 ideas de reels TikTok para una academia de IA dirigidos a jóvenes ecuatorianos 18-25'",
    pasos: [
      "Crear Google Sheet con columnas: Tarea, Modelo, Respuesta (link), Calidad técnica (1-10), Calidad de escritura (1-10), Tiempo, Tokens usados (estimado), Notas",
      "Ejecutar las 5 tareas en ChatGPT con un mismo prompt cuidadosamente diseñado (aplica los principios del Tema 7)",
      "Ejecutar exactamente las mismas 5 tareas en Claude — copiar y pegar el prompt idéntico",
      "Para cada tarea, evaluar con criterios objetivos: ¿el código corre? ¿la propuesta es persuasiva? ¿el análisis legal es correcto según LORTI/Código del Trabajo? ¿los cálculos son exactos? ¿las ideas son virales?",
      "Calificar cada respuesta de 1-10 en calidad técnica y calidad de escritura, justificando con 2 frases",
      "Identificar al menos 1 error o alucinación en alguna respuesta — documentar exactamente qué se inventó o se equivocó",
      "Construir tu MATRIZ DE DECISIÓN personal: para cada tipo de tarea (código, legal, escritura, matemáticas, creatividad), cuál modelo prefieres y por qué",
      "Escribir conclusión de 250 palabras: '¿Qué stack de IA recomendarías a un profesional ecuatoriano que ganará el equivalente a 10 horas semanales gracias a IA?'",
    ],
    resultado: "Matriz comparativa con 10 ejecuciones (5 tareas × 2 modelos), calificaciones objetivas, errores documentados, matriz de decisión personalizada y recomendación final fundamentada",
    criterios: [
      { criterio: "Ejecución completa de las 5 tareas en ambos modelos", puntos: 25 },
      { criterio: "Calificaciones objetivas con criterios claros", puntos: 20 },
      { criterio: "Identificación de al menos 1 error/alucinación", puntos: 15 },
      { criterio: "Matriz de decisión personalizada", puntos: 25 },
      { criterio: "Conclusión fundamentada con visión de profesional ecuatoriano", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "ChatGPT — chat.openai.com", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "Plataforma oficial de OpenAI. Incluye GPT-5, generación de imágenes y voice mode (en plan Plus)." },
    { titulo: "Claude — claude.ai", url: "https://claude.ai", tipo: "herramienta", descripcion: "Plataforma oficial de Anthropic. Acceso a Claude Sonnet 4.5 (gratis) y Opus 4.6 (Pro)." },
    { titulo: "OpenAI Documentation — Modelos", url: "https://platform.openai.com/docs/models", tipo: "documentacion", descripcion: "Documentación oficial de los modelos de OpenAI con especificaciones técnicas y precios." },
    { titulo: "Anthropic — Modelos Claude", url: "https://docs.anthropic.com/en/docs/about-claude/models", tipo: "documentacion", descripcion: "Documentación oficial de Anthropic con detalles de cada versión de Claude, capacidades y precios." },
    { titulo: "LMSYS Chatbot Arena — Leaderboard", url: "https://lmarena.ai/leaderboard", tipo: "lectura", descripcion: "Ranking comunitario donde usuarios votan a ciegas qué modelo respondió mejor. Métrica más honesta del mercado." },
    { titulo: "Claude vs ChatGPT — Zapier (español)", url: "https://zapier.com/blog/claude-vs-chatgpt/", tipo: "lectura", descripcion: "Comparativa práctica actualizada de Zapier con casos de uso reales de productividad." },
  ],
};

const tema10: TemaC1 = {
  id: 10,
  titulo: "Generación de imágenes: DALL-E, Midjourney, Stable Diffusion",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/Jvy7U2UUCIs",
  videoTitulo: "Creación de imágenes con IA — DALL·E, Midjourney y Stable Diffusion",
  videoDuracion: "~40 min · Español · Tutorial completo de las 3 herramientas",
  slidesUrl: "",
  teoria: `La generación de imágenes con IA ha pasado de ser una curiosidad académica a una industria que está transformando el diseño gráfico, la publicidad, el cine y el marketing en menos de cinco años. En 2026, cualquier profesional ecuatoriano que sepa usar estas herramientas ahorra horas de trabajo, contrata menos diseñadores externos y produce más contenido visual que su competencia.

CÓMO FUNCIONA LA GENERACIÓN DE IMÁGENES CON IA

Todas las herramientas modernas (DALL-E, Midjourney, Stable Diffusion, Imagen 3, FLUX) usan modelos de difusión. La idea: el modelo aprende observando miles de millones de imágenes con sus descripciones, y luego, cuando le das un prompt, parte de "ruido visual" puro y, paso a paso, lo va "des-ruidizando" hasta producir una imagen coherente con tu descripción. Cada paso reduce el ruido y aumenta el detalle.

LAS 3 HERRAMIENTAS PRINCIPALES — Comparativa práctica

1. DALL-E 3 (de OpenAI, integrado en ChatGPT)
• Acceso: dentro de ChatGPT Plus ($20/mes) o vía API
• Fortaleza: integración perfecta con conversación. Le pides imagen y la genera en chat.
• Estilo: realista y comercial. Bueno para anuncios, productos, diseños limpios.
• Limitación: menos personalizable que Midjourney y Stable Diffusion.
• Mejor para: profesionales no-diseñadores que quieren imágenes rápidas y útiles.

2. Midjourney (V7 en 2026)
• Acceso: $10-$60/mes, requiere cuenta de Discord o app web
• Fortaleza: la mejor calidad estética del mercado. Imágenes parecen arte profesional.
• Estilo: muy artístico, cinematográfico, con composición sofisticada.
• Limitación: menos preciso para texto dentro de imágenes (logos, carteles).
• Mejor para: diseñadores, agencias creativas, artistas, marketing premium.

3. Stable Diffusion (de Stability AI)
• Acceso: gratuito (open source) — corres el modelo en tu computadora o en plataformas como ComfyUI, Forge, AUTOMATIC1111
• Fortaleza: control total. Puedes usar LoRA, ControlNet, modelos custom, inpainting avanzado.
• Estilo: depende del modelo base que uses (hay miles).
• Limitación: requiere GPU buena (mínimo 8GB VRAM) y curva de aprendizaje técnica.
• Mejor para: profesionales que necesitan generar volumen, control estilístico exacto, o privacidad (datos no salen de tu equipo).

OTRAS HERRAMIENTAS NOTABLES EN 2026

• Imagen 3 (Google): integrado en Gemini, excelente con texto dentro de imágenes
• FLUX (Black Forest Labs): nuevo competidor con calidad superior a SD
• Adobe Firefly: integrado con Photoshop, entrenado solo con imágenes licenciadas (más seguro legalmente)
• Leonardo AI: combina Stable Diffusion con interfaz amigable, ideal para principiantes que quieren control
• Krea AI: enfoque en tiempo real e iteración visual

CÓMO ESCRIBIR UN PROMPT EFECTIVO PARA IMÁGENES

A diferencia del prompting de texto, el prompting visual sigue una estructura más densa. Una fórmula útil es: SUJETO + ESTILO + CONTEXTO + COMPOSICIÓN + DETALLES TÉCNICOS.

Ejemplo MAL: "Un café"
Ejemplo BIEN: "Una taza de café latte humeante sobre una mesa de madera rústica, fotografía profesional con luz natural cálida desde una ventana lateral, fondo desenfocado de cafetería en Quito, estilo editorial Bon Appétit, composición de 1/3, alta resolución, detalles realistas en la espuma --ar 16:9 --quality 2"

Componentes:
• SUJETO: "taza de café latte humeante"
• ESTILO: "fotografía profesional", "estilo editorial Bon Appétit"
• CONTEXTO: "mesa de madera rústica", "cafetería en Quito"
• COMPOSICIÓN: "luz natural cálida", "fondo desenfocado", "regla de tercios"
• DETALLES TÉCNICOS: "alta resolución", "detalles realistas en la espuma", parámetros como --ar (aspect ratio) o --quality

Términos útiles que mejoran la calidad: "cinematic lighting", "8k", "hyperrealistic", "studio photography", "shallow depth of field", "golden hour", "art deco", "minimalist", "bokeh".

PROMPTS NEGATIVOS

En Stable Diffusion y Midjourney puedes excluir elementos: "--no text" en Midjourney, o un campo "negative prompt" en Stable Diffusion. Útil para evitar manos deformes (problema clásico), texto distorsionado, sobreexposición, etc.

DERECHOS DE AUTOR Y USO COMERCIAL

Atención: las normas varían por herramienta y plan.
• DALL-E 3: imágenes generadas son tuyas con uso comercial libre.
• Midjourney: con plan pago, uso comercial permitido (gratis es solo personal).
• Stable Diffusion: depende del modelo base — algunos prohíben uso comercial.
• Adobe Firefly: la opción más segura legalmente, entrenado solo con imágenes licenciadas.

Para Ecuador, revisa la LOPI (Ley Orgánica de Propiedad Intelectual) y considera que generar imágenes "al estilo de" un artista vivo puede tener implicaciones legales. Cuando trabajes con clientes, deja siempre por escrito en el contrato qué herramienta usaste y qué derechos tienen.

CASOS DE USO PARA PROFESIONALES ECUATORIANOS

• Marketing digital: anuncios para Meta, Google y TikTok sin contratar fotógrafo. 30 imágenes por hora.
• Inmobiliarias: visualizar remodelaciones de casas o departamentos antes de invertir.
• Restaurantes: fotos profesionales de platos sin contratar food photographer.
• Educación: ilustrar libros, presentaciones, materiales educativos.
• Moda y textil: generar mood boards y prototipos visuales antes de producir.
• Periodismo: crear ilustraciones editoriales para columnas y reportajes.
• Arquitectura: renders rápidos de propuestas iniciales antes de modelado 3D detallado.

LIMITACIONES QUE DEBES CONOCER

1. Manos: las IAs siguen teniendo problemas con manos y dedos (mejorando, pero no perfecto).
2. Texto en imágenes: solo Imagen 3 y FLUX manejan bien texto dentro de imágenes.
3. Coherencia entre escenas: difícil generar el mismo personaje en distintas poses sin técnicas avanzadas (LoRA, IP-Adapter).
4. Sesgos visuales: las herramientas heredan sesgos de los datos. Por defecto, "doctor" suele generar hombre blanco. Hay que pedirlo explícitamente.
5. Originalidad legal: los modelos pueden replicar estilos artísticos casi exactos — riesgo de reclamos.

El profesional que domina IA visual en 2026 reduce sus costos de producción 80% y multiplica su capacidad creativa. Es una habilidad que paga sola en menos de un mes.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Generación de Imágenes con IA: DALL-E, Midjourney, Stable Diffusion\nC1. Introducción a IA Aplicada — Tema 10\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido: "Al finalizar esta sesión serás capaz de:\n• Explicar cómo funcionan los modelos de difusión\n• Comparar DALL-E 3, Midjourney y Stable Diffusion\n• Escribir prompts visuales efectivos con la fórmula SECCD\n• Aplicar IA visual a casos profesionales en Ecuador",
    },
    {
      titulo: "Cómo funciona la generación con IA",
      contenido: "Modelos de difusión:\n1. Aprende viendo miles de millones de imágenes con descripciones\n2. Parte de ruido visual puro\n3. Paso a paso, va \"des-ruidizando\" guiado por tu prompt\n4. Cada paso reduce ruido y aumenta detalle\n\nResultado: imagen original que coincide con tu descripción en segundos.",
    },
    {
      titulo: "Las 3 herramientas principales",
      contenido: "DALL-E 3 (OpenAI)\n• En ChatGPT Plus, $20/mes · Realista · Fácil\n\nMidjourney (V7)\n• $10-$60/mes vía Discord/web · Calidad estética líder\n\nStable Diffusion (Stability AI)\n• Gratis, open source · Control total · Curva técnica",
    },
    {
      titulo: "Otras herramientas notables 2026",
      contenido: "• Imagen 3 (Google) — excelente con texto en imágenes\n• FLUX (Black Forest Labs) — competidor superior en SD\n• Adobe Firefly — más seguro legalmente (datos licenciados)\n• Leonardo AI — SD con interfaz amigable\n• Krea AI — generación en tiempo real\n\nElige según presupuesto, control deseado y caso de uso.",
    },
    {
      titulo: "Fórmula SECCD para prompts visuales",
      contenido: "S — SUJETO: \"taza de café latte humeante\"\nE — ESTILO: \"fotografía profesional, editorial Bon Appétit\"\nC — CONTEXTO: \"mesa rústica, cafetería en Quito\"\nC — COMPOSICIÓN: \"luz natural cálida, regla de tercios\"\nD — DETALLES: \"8k, hyperrealistic, --ar 16:9\"\n\nEjemplo: del MAL \"un café\" al BIEN un editorial profesional.",
    },
    {
      titulo: "Términos mágicos para mejorar calidad",
      contenido: "• cinematic lighting\n• 8k / hyperrealistic\n• shallow depth of field\n• golden hour / blue hour\n• studio photography\n• bokeh\n• art deco / minimalist\n• photorealistic\n\nPrompts negativos: --no text (Midjourney), \"negative prompt\" en SD para evitar manos deformes, texto distorsionado, sobreexposición.",
    },
    {
      titulo: "Derechos de autor — atención",
      contenido: "DALL-E 3: tuyas con uso comercial libre\nMidjourney: comercial solo con plan pago\nStable Diffusion: depende del modelo base\nAdobe Firefly: la opción más segura legalmente\n\nEcuador: revisa LOPI. Generar \"al estilo de\" un artista vivo puede tener implicaciones legales. Documenta en contratos con clientes qué herramienta usaste.",
    },
    {
      titulo: "Resumen del Tema 10",
      contenido: "1. Modelos de difusión generan imágenes desde ruido guiados por prompt\n2. DALL-E 3: rápido y comercial · Midjourney: calidad estética · SD: control total\n3. Fórmula SECCD: Sujeto + Estilo + Contexto + Composición + Detalles\n4. Limitaciones: manos, texto, coherencia, sesgos\n5. Reduce costos 80% y multiplica creatividad\n\nPróximo: Tema 11 — Generación de código con IA: Copilot y Cursor",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué tecnología usan DALL-E 3, Midjourney y Stable Diffusion para generar imágenes?",
      opciones: ["GANs clásicas", "Modelos de difusión", "Redes recurrentes", "Modelos n-gram"],
      respuesta: 1,
      explicacion: "Las herramientas modernas de generación de imágenes usan modelos de difusión: parten de ruido y lo eliminan paso a paso guiados por el prompt.",
    },
    {
      pregunta: "¿Cuál herramienta es OPEN SOURCE y se puede correr localmente?",
      opciones: ["DALL-E 3", "Midjourney", "Stable Diffusion", "Adobe Firefly"],
      respuesta: 2,
      explicacion: "Stable Diffusion es open source. Puedes correrlo en tu propia GPU con interfaces como AUTOMATIC1111, Forge o ComfyUI.",
    },
    {
      pregunta: "Según la fórmula SECCD, ¿qué representa la 'C' final?",
      opciones: ["Color", "Composición", "Cantidad", "Cámara"],
      respuesta: 1,
      explicacion: "SECCD = Sujeto, Estilo, Contexto, Composición, Detalles. Composición incluye encuadre, regla de tercios, profundidad de campo.",
    },
    {
      pregunta: "¿Cuál es una limitación TÍPICA de las IAs generadoras de imágenes en 2026?",
      opciones: [
        "No funcionan en español",
        "Problemas con manos y dedos en personajes",
        "Solo generan imágenes en blanco y negro",
        "Tardan días en generar 1 imagen",
      ],
      respuesta: 1,
      explicacion: "Las manos siguen siendo el reto clásico (mejorando, pero no perfecto). También coherencia entre escenas y texto en imágenes.",
    },
    {
      pregunta: "Para uso comercial seguro legalmente, ¿cuál herramienta destaca?",
      opciones: [
        "Stable Diffusion con cualquier modelo",
        "Adobe Firefly (entrenado solo con imágenes licenciadas)",
        "Midjourney en plan gratuito",
        "Cualquiera, da lo mismo",
      ],
      respuesta: 1,
      explicacion: "Adobe Firefly se entrenó exclusivamente con imágenes licenciadas (Adobe Stock + dominio público), reduciendo riesgo legal en uso comercial.",
    },
  ],
  ejercicio: {
    titulo: "Campaña visual completa para una marca ecuatoriana",
    objetivo: "Crear un set visual profesional (5 imágenes) para una marca ficticia ecuatoriana usando 2 herramientas de IA y publicar lista para redes sociales",
    herramientas: "ChatGPT Plus con DALL-E 3 (chat.openai.com) o Bing Image Creator gratis (bing.com/create) + Leonardo AI gratis (leonardo.ai) + Canva (canva.com)",
    datosEjemplo: "Marca ficticia: 'Tropikal Café' — cafetería boutique en Cumbayá (Quito) que sirve café 100% ecuatoriano de altura. Público: profesionales 25-45 con poder adquisitivo. Tono: sofisticado, cálido, orgullo ecuatoriano.\n\nNecesidades visuales:\n1. Foto hero de la cafetería para Instagram (16:9)\n2. Producto: latte art con mapa de Ecuador en la espuma (1:1)\n3. Lifestyle: cliente disfrutando del café leyendo (4:5)\n4. Storytelling: granos de café siendo cosechados en finca de Loja (16:9)\n5. Anuncio: portada con copy de promo \"2x1 los miércoles\" (1:1)",
    pasos: [
      "Investigar referencias visuales: buscar 5 cuentas de Instagram de cafeterías premium (locales o internacionales) y guardar capturas como inspiración",
      "Diseñar prompts SECCD para cada una de las 5 imágenes — escribirlos primero en Google Docs antes de generar",
      "Generar imágenes 1, 2 y 5 en DALL-E 3 (vía ChatGPT) o Bing Image Creator si no tienes ChatGPT Plus",
      "Generar imágenes 3 y 4 en Leonardo AI (gratis con créditos diarios) — comparar la diferencia estilística",
      "Iterar cada imagen al menos 2 veces — guardar las versiones intermedias para mostrar la progresión",
      "Editar la imagen 5 (anuncio) en Canva agregando el copy '2x1 los miércoles · Tropikal Café · Cumbayá' con tipografía elegante (Canva permite hacer esto fácil)",
      "Crear un brief de marca de 1 página con: paleta de colores, fuentes, tono y las 5 imágenes finales (en Google Docs o Canva)",
      "Reflexión final (200 palabras): ¿qué diferencias notaste entre DALL-E 3 y Leonardo? ¿Qué imagen requirió más iteraciones y por qué? ¿Cómo cobrarías este trabajo a un cliente real?",
    ],
    resultado: "Set de 5 imágenes profesionales generadas con IA, brief de marca de 1 página, comparativa entre 2 herramientas y reflexión sobre pricing del servicio para un cliente ecuatoriano",
    criterios: [
      { criterio: "Aplicación correcta de la fórmula SECCD en los 5 prompts", puntos: 25 },
      { criterio: "Calidad visual de las 5 imágenes finales (consistencia de marca)", puntos: 30 },
      { criterio: "Iteraciones documentadas y mejora visible", puntos: 15 },
      { criterio: "Comparativa entre DALL-E y Leonardo justificada", puntos: 15 },
      { criterio: "Reflexión sobre pricing aplicable al mercado ecuatoriano", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "Bing Image Creator (DALL-E 3 gratis)", url: "https://www.bing.com/create", tipo: "herramienta", descripcion: "Acceso gratuito a DALL-E 3 vía Microsoft Bing. Excelente para empezar sin pagar ChatGPT Plus." },
    { titulo: "Midjourney", url: "https://www.midjourney.com", tipo: "herramienta", descripcion: "La mejor calidad estética del mercado. Requiere suscripción ($10-$60/mes) y cuenta Discord o web." },
    { titulo: "Leonardo AI", url: "https://leonardo.ai", tipo: "herramienta", descripcion: "Stable Diffusion con interfaz amigable. Plan gratuito con créditos diarios. Ideal para principiantes con control." },
    { titulo: "Stable Diffusion Web — Hugging Face", url: "https://huggingface.co/spaces/stabilityai/stable-diffusion", tipo: "herramienta", descripcion: "Demo gratuita de Stable Diffusion en navegador, sin instalación. Perfecto para experimentar." },
    { titulo: "Adobe Firefly", url: "https://firefly.adobe.com", tipo: "herramienta", descripcion: "Generador de Adobe entrenado solo con imágenes licenciadas. La opción más segura para uso comercial." },
    { titulo: "Civitai — Modelos Stable Diffusion", url: "https://civitai.com", tipo: "lectura", descripcion: "Comunidad con miles de modelos custom de Stable Diffusion (LoRA, checkpoints, embeddings). Verifica licencias antes de uso comercial." },
  ],
};

const tema11: TemaC1 = {
  id: 11,
  titulo: "Generación de código con IA: Copilot y Cursor",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/bMmVZFd7HA4",
  videoTitulo: "Curso de Cursor: Editor IA, Todo Lo Que Necesitas Saber",
  videoDuracion: "~50 min · Español · Curso completo del editor con IA",
  slidesUrl: "",
  teoria: `La generación de código con IA es la disrupción más profunda en el mundo del desarrollo de software desde la invención del compilador. En 2026, un programador junior con buen uso de Cursor o Copilot produce el equivalente al output de un programador semi-senior de 2022 — con menos errores, mejor documentación y más rapidez. Y no es exclusivo de programadores: profesionales de todas las áreas usan IA para automatizar tareas, crear scripts y analizar datos.

LAS DOS HERRAMIENTAS QUE DOMINAN EL MERCADO

GitHub Copilot (Microsoft + OpenAI/Anthropic)
• Lanzado en 2021, fue el primer asistente IA masivo para código.
• Se integra como extensión en VS Code, JetBrains, Visual Studio, Neovim.
• Sugerencias en tiempo real mientras escribes (autocompletado inteligente).
• Chat lateral para preguntas y refactorización.
• En 2026 te permite elegir el modelo: GPT-5, Claude Sonnet 4.5, Gemini.
• Precio: $10-$19/mes individual, $19-$39/mes para equipos.
• Más de 1.5 millones de suscriptores en 2026.

Cursor (Anysphere)
• Editor de código completo, fork de VS Code con IA nativa profundamente integrada.
• Lanzado en 2023, alcanzó valuación de $9.5B en 2025.
• Funciones únicas: Composer (genera código en múltiples archivos), Tab autocomplete con predicción de cursor, chat con contexto de todo tu código, agente que ejecuta tareas.
• Soporta Claude Opus 4.6, GPT-5, Gemini Pro y modelos locales.
• Precio: gratis con límites, Pro $20/mes, Business $40/mes.
• La elección preferida de developers profesionales en 2026 según múltiples encuestas.

DIFERENCIAS CLAVE — Copilot vs Cursor

Copilot funciona DENTRO de tu editor existente. Si ya tienes VS Code configurado, instalas la extensión y listo. Buena experiencia para autocompletado pero menos potente para tareas complejas multi-archivo.

Cursor ES tu editor. Reemplaza VS Code completamente y la IA está integrada desde el núcleo. Su diferenciador principal es Composer: le pides "Crea un sistema de login con Supabase, formularios en React, validación con Zod y rutas protegidas" y modifica/crea 8-12 archivos en una sola operación. Eso Copilot no lo hace bien.

QUÉ PUEDES HACER CON IA + CÓDIGO

1. Autocompletado inteligente: mientras escribes, sugiere la siguiente línea o función completa.
2. Generación de código desde texto: "Escribe función Python que lea CSV y filtre por columna 'edad' > 25".
3. Refactorización automática: "Convierte este código a TypeScript y agrega tipos".
4. Detección de bugs: "Encuentra el bug en este código y propón fix".
5. Tests automáticos: "Genera tests Jest para esta función".
6. Documentación: "Agrega JSDoc con ejemplos a todas las funciones de este archivo".
7. Migración de código: "Migra este componente de React clase a hooks".
8. Explicación: "Explíca qué hace este código en lenguaje no técnico".
9. Code Review: "Revisa este PR y señala problemas de seguridad y performance".
10. Pair programming: chat conversacional mientras desarrollas.

MEJORES PRÁCTICAS PARA USAR IA EN CÓDIGO

1. Da contexto: en Cursor, usa @archivo.ts para que el modelo vea el código relacionado.
2. Sé específico con tecnologías: "Usa React 18 con hooks, sin clases. TypeScript estricto. Tailwind CSS."
3. Pide explicaciones: si vas a modificar código complejo, pide que el modelo explique qué cambió antes de aceptar.
4. Verifica siempre: la IA puede inventar APIs inexistentes, bibliotecas que no funcionan, sintaxis equivocada. Corre el código.
5. Usa el modelo correcto: Claude Opus 4.6 es el rey del código en 2026. GPT-5 mejor para creatividad. Gemini para tareas con contexto Google.
6. Itera en pasos pequeños: en lugar de "Construye toda la app", pide componente por componente.
7. Confía en tests: pide tests primero, luego implementación (TDD asistido por IA).

NIVELES DE INVOLUCRAMIENTO DEL DESARROLLADOR

• Asistente: La IA sugiere, tú revisas cada línea. Bajo riesgo, alta calidad.
• Co-piloto: La IA escribe bloques, tú los validas y conectas. Productividad alta.
• Agente: La IA ejecuta tareas completas (ejemplo: "Resuelve el issue #42 del repositorio"). Riesgo más alto, supervisión necesaria.

En 2026, los developers profesionales operan principalmente en modo Co-piloto, con saltos a modo Agente para tareas repetitivas o exploratorias.

LIMITACIONES Y RIESGOS

1. Alucinaciones técnicas: la IA inventa funciones de bibliotecas que no existen.
2. Código inseguro: puede generar SQL injection, hardcodeo de credenciales, validaciones débiles.
3. Dependencia: si no entiendes lo que copia y pegas, no podrás depurarlo cuando falle.
4. Privacidad: el código que escribes se envía a servidores de la empresa. En proyectos confidenciales, considera modelos locales (Ollama, LM Studio) o planes empresariales con cláusulas de privacidad.
5. Licencias: el código generado puede haber sido entrenado con código GPL — riesgo legal en productos comerciales.

OPORTUNIDADES PROFESIONALES EN ECUADOR

• Desarrollador Junior 2026 con IA = productividad de Senior 2022.
• Empresas ecuatorianas como Kushki, Banco Pichincha, ImagemIA buscan developers que dominen Cursor.
• Salarios: developer junior con IA $1,200-$2,000/mes; semi-senior $2,500-$4,500/mes; senior con IA $5,000-$10,000+/mes (remoto LATAM).
• Freelance: $25-$80/hora dependiendo de tu nicho.
• Habilidad transversal: contadores que saben Python con IA automatizan procesos completos. Marketers que saben SQL con IA hacen análisis avanzados.

PARA NO PROGRAMADORES

¿Eres profesional no técnico? La IA + código te permite:
• Automatizar Excel con macros generadas por IA.
• Crear scripts Python sencillos para limpiar datos.
• Generar SQL para consultar bases de datos sin saber sintaxis.
• Construir prototipos web simples con HTML/CSS sin curso largo.
• Conectar APIs (Zapier-style) con scripts cortos.

En ITSEIA enseñamos a no programadores a usar Cursor para resolver problemas reales sin volverse developers — solo necesitas saber pedir bien y verificar que el código corra.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Generación de Código con IA: Copilot y Cursor\nC1. Introducción a IA Aplicada — Tema 11\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido: "Al finalizar esta sesión serás capaz de:\n• Comparar GitHub Copilot vs Cursor en flujos profesionales\n• Identificar 10 tareas que se aceleran con IA + código\n• Aplicar mejores prácticas de prompting técnico\n• Estimar oportunidades laborales en Ecuador con esta habilidad",
    },
    {
      titulo: "Las 2 herramientas dominantes",
      contenido: "GitHub Copilot (Microsoft + OpenAI/Anthropic)\n• Extensión en VS Code, JetBrains, etc.\n• $10-$19/mes individual\n• 1.5M suscriptores en 2026\n\nCursor (Anysphere)\n• Editor completo, fork de VS Code\n• Composer (genera multi-archivo)\n• Gratis con límites; Pro $20/mes\n• Valuación $9.5B en 2025",
    },
    {
      titulo: "Diferencias clave",
      contenido: "Copilot:\n• Vive DENTRO de tu editor existente\n• Excelente autocompletado en línea\n• Menos potente para tareas complejas multi-archivo\n\nCursor:\n• ES tu editor (reemplaza VS Code)\n• Composer modifica 8-12 archivos en 1 operación\n• Chat con contexto de TODO tu código\n• Preferido por developers profesionales en 2026",
    },
    {
      titulo: "10 cosas que puedes hacer",
      contenido: "1. Autocompletado inteligente\n2. Generar código desde texto\n3. Refactorización automática\n4. Detección de bugs\n5. Tests automáticos (Jest, Pytest)\n6. Documentación (JSDoc, docstrings)\n7. Migración de código (clase → hooks)\n8. Explicación en lenguaje no técnico\n9. Code review\n10. Pair programming conversacional",
    },
    {
      titulo: "Mejores prácticas",
      contenido: "1. Da contexto: usa @archivo.ts en Cursor\n2. Sé específico con stack: \"React 18, hooks, TypeScript estricto, Tailwind\"\n3. Pide explicaciones antes de aceptar cambios\n4. Verifica TODO — la IA inventa APIs inexistentes\n5. Modelo correcto: Claude Opus 4.6 = rey del código\n6. Itera en pasos pequeños\n7. TDD asistido: tests primero, luego implementación",
    },
    {
      titulo: "Niveles de involucramiento",
      contenido: "Asistente: IA sugiere, tú revisas cada línea\n→ Bajo riesgo, alta calidad\n\nCo-piloto: IA escribe bloques, tú validas y conectas\n→ Productividad alta — modo profesional 2026\n\nAgente: IA ejecuta tareas completas\n→ Alto riesgo, supervisión obligatoria\n\nEjemplo agente: \"Resuelve issue #42 del repositorio\"",
    },
    {
      titulo: "Limitaciones y riesgos",
      contenido: "1. Alucinaciones: inventa funciones que no existen\n2. Código inseguro: SQL injection, credenciales hardcoded\n3. Dependencia: si no entiendes, no puedes depurar\n4. Privacidad: código va a servidores externos\n5. Licencias: riesgo de copyright (entrenamiento con GPL)\n\nVerifica siempre. Corre tests. Lee lo que aceptas.",
    },
    {
      titulo: "Resumen del Tema 11 y Cierre Módulo 2",
      contenido: "1. Cursor lidera la productividad en 2026\n2. Copilot mejor para integrar en flujos existentes\n3. 10 tareas concretas que se aceleran 3-10x\n4. Modelo correcto importa — Claude para código serio\n5. Verifica siempre — alucinaciones técnicas existen\n\nMÓDULO 2 COMPLETO — IA Generativa y Prompt Engineering\nPróximo: Módulo 3 — Herramientas No-Code y Aplicaciones",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la diferencia principal entre GitHub Copilot y Cursor?",
      opciones: [
        "Copilot solo funciona con Python; Cursor con cualquier lenguaje",
        "Copilot es una extensión en tu editor; Cursor es un editor completo con IA nativa",
        "Cursor es gratuito sin límites; Copilot siempre cuesta",
        "Son idénticos, distintos nombres",
      ],
      respuesta: 1,
      explicacion: "Copilot se instala como extensión en editores existentes. Cursor reemplaza el editor con uno construido alrededor de la IA.",
    },
    {
      pregunta: "¿Qué función de Cursor permite modificar múltiples archivos en una sola operación?",
      opciones: ["Tab Autocomplete", "Inline Chat", "Composer", "Settings Sync"],
      respuesta: 2,
      explicacion: "Composer es la función estrella de Cursor: pide cambios complejos y modifica/crea varios archivos coordinadamente.",
    },
    {
      pregunta: "Según la lección, ¿qué modelo lidera benchmarks de código en 2026?",
      opciones: ["GPT-3.5", "Claude Opus 4.6", "Gemini Nano", "LLaMA 2"],
      respuesta: 1,
      explicacion: "Claude Opus 4.6 lidera SWE-bench Verified con 80.8% — superando a GPT-5 en tareas de programación.",
    },
    {
      pregunta: "¿Cuál es un RIESGO importante al usar IA para generar código?",
      opciones: [
        "Que el código sea siempre demasiado eficiente",
        "Alucinaciones técnicas — la IA inventa funciones inexistentes",
        "Que solo funcione en inglés",
        "Que sea ilegal usarlo profesionalmente",
      ],
      respuesta: 1,
      explicacion: "La IA puede generar llamadas a APIs/funciones que no existen. Siempre debes verificar corriendo el código.",
    },
    {
      pregunta: "¿Qué nivel de involucramiento describe a un developer que la IA escribe bloques y él valida y conecta?",
      opciones: ["Asistente", "Co-piloto", "Agente", "Spectator"],
      respuesta: 1,
      explicacion: "Co-piloto es el modo profesional dominante en 2026: IA escribe, developer valida y conecta — alta productividad con supervisión.",
    },
  ],
  ejercicio: {
    titulo: "Construir un mini-proyecto Python con Cursor o Copilot",
    objetivo: "Crear un script Python funcional que automatice una tarea real para un negocio ecuatoriano, usando IA como pair programmer",
    herramientas: "Cursor (cursor.com — gratis con límites) o GitHub Codespaces con Copilot gratuito + Python 3.11+ + repositorio en GitHub",
    datosEjemplo: "Caso de negocio: pequeña ferretería en Quito recibe Excel con ventas diarias y necesita un script que:\n• Lea archivo Excel ventas.xlsx (columnas: fecha, producto, cantidad, precio_unitario)\n• Calcule totales por producto\n• Filtre productos con ventas > $100\n• Genere reporte PDF con tabla y top 5 productos\n• Envíe el reporte por email al dueño (opcional, con SMTP)\n\nDatos de ejemplo: crear un Excel con 50 filas ficticias de productos típicos de ferretería ecuatoriana (martillos, taladros, pinturas, focos, etc.) con precios en USD",
    pasos: [
      "Instalar Cursor (cursor.com) o abrir Codespaces con Copilot habilitado. Crear nuevo proyecto Python",
      "Generar el archivo Excel de ejemplo con un prompt: 'Crea ventas.xlsx con 50 filas ficticias, productos típicos de ferretería ecuatoriana, precios en USD'",
      "Pedir al asistente: 'Lee este Excel con pandas y muestra los primeros 5 registros'. Validar que corra",
      "Iterar con prompts incrementales: '(1) calcula totales por producto, (2) filtra productos con ventas mayores a $100, (3) genera tabla resumen'",
      "Pedir generación del PDF con reportlab: 'Crea reporte.pdf con tabla del resumen y los top 5 productos'. Verificar que el PDF se genera correctamente",
      "Pedir tests con pytest: 'Genera 3 tests para las funciones críticas'. Correr los tests",
      "Pedir documentación: 'Agrega docstrings a todas las funciones y un README.md con instrucciones de uso para alguien sin experiencia técnica'",
      "Subir el repositorio a GitHub público. Escribir reflexión de 250 palabras: '¿Cuántos prompts necesitaste? ¿Cuántos errores hubo? ¿Qué hiciste cuando la IA alucinó? ¿Cuánto cobrarías por esto a la ferretería?'",
    ],
    resultado: "Repositorio GitHub funcional con script Python que lee Excel, genera PDF, tiene tests y README, más reflexión sobre productividad real con IA y pricing del servicio en Ecuador",
    criterios: [
      { criterio: "Script Python funcional que cumple los 4 requisitos", puntos: 30 },
      { criterio: "Tests pytest que pasan", puntos: 15 },
      { criterio: "Documentación clara (docstrings + README)", puntos: 15 },
      { criterio: "Repositorio GitHub bien estructurado y público", puntos: 15 },
      { criterio: "Reflexión sobre el proceso, errores y pricing", puntos: 25 },
    ],
  },
  recursos: [
    { titulo: "Cursor — cursor.com", url: "https://cursor.com", tipo: "herramienta", descripcion: "Editor de código con IA nativa. Plan gratuito con límites generosos. Recomendado en 2026." },
    { titulo: "GitHub Copilot", url: "https://github.com/features/copilot", tipo: "herramienta", descripcion: "Asistente IA de Microsoft+GitHub. Funciona como extensión. Gratis para estudiantes y open-source maintainers." },
    { titulo: "Cursor Documentation", url: "https://docs.cursor.com", tipo: "documentacion", descripcion: "Documentación oficial de Cursor con guías de Composer, Tab, Chat, Agent y configuración avanzada." },
    { titulo: "GitHub Copilot Docs", url: "https://docs.github.com/en/copilot", tipo: "documentacion", descripcion: "Documentación oficial con tutoriales de uso, atajos de teclado y mejores prácticas." },
    { titulo: "Awesome Cursor Rules — GitHub", url: "https://github.com/PatrickJS/awesome-cursorrules", tipo: "lectura", descripcion: "Repositorio comunitario con archivos .cursorrules para optimizar Cursor en distintos stacks (React, Next.js, Python, etc.)." },
    { titulo: "Codeium — alternativa gratuita", url: "https://codeium.com", tipo: "herramienta", descripcion: "Alternativa gratuita a Copilot. Buena opción para estudiantes que aún no quieren pagar." },
  ],
};

// ─── MÓDULO 3: Herramientas No-Code y Aplicaciones ──────────────────────────

const MOD3 = "Herramientas No-Code y Aplicaciones";

// ─── MÓDULO 4: Proyecto Final Aplicado ───────────────────────────────────────

const MOD4 = "Proyecto Final Aplicado";

// ─── Export: 20 temas (11 completos + 9 placeholders) ────────────────────────

export const C1_TEMAS: TemaC1[] = [
  // Módulo 1 — completos
  tema1,
  tema2,
  tema3,
  tema4,
  tema5,
  // Módulo 2 — completos
  tema6,
  tema7,
  tema8,
  tema9,
  tema10,
  tema11,
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
