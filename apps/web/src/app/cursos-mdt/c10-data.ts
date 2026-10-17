// ─── C10: IA Generativa y Creatividad — Datos de 20 temas ─────────────────────
// Curso C10 del programa MDT. 20 temas.
// Módulo 1: Conceptos IA generativa (texto, imagen, audio)
// Módulo 2: Midjourney, DALL-E, Stable Diffusion
// Módulo 3: Generación de video con IA (Sora, Runway, Veo)
// Módulo 4: Productos creativos con IA

export interface QuizQuestion {
  pregunta: string;
  opciones: string[];
  respuesta: number;
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

export type GammaUrl = string;

export interface EjercicioCriterio {
  criterio: string;
  puntos: number;
}

export interface TemaC10 {
  id: number;
  titulo: string;
  modulo: string;
  moduloNum: number;
  videoEmbed: string;
  videoTitulo: string;
  videoDuracion?: string;
  slidesUrl?: GammaUrl;
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
  teoria: string;
}

export const C10_MODULOS = [
  { num: 1, nombre: "Conceptos de IA Generativa", horas: 10, temas: 5 },
  { num: 2, nombre: "Generación de Imágenes con IA", horas: 10, temas: 5 },
  { num: 3, nombre: "Generación de Video con IA", horas: 10, temas: 5 },
  { num: 4, nombre: "Productos Creativos con IA", horas: 10, temas: 5 },
];

// ─── Helper para temas placeholder ──────────────────────────────────────────
const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC10 => ({
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

// ─── MÓDULO 1: Conceptos de IA Generativa ───────────────────────────────────

const MOD1 = "Conceptos de IA Generativa";

const tema1: TemaC10 = {
  id: 1,
  titulo: "¿Qué es la IA generativa? Texto, imagen y audio",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "IA Generativa explicada desde cero — Español",
  videoDuracion: "~35 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "¿Qué es la IA Generativa? Texto, Imagen y Audio\nC10. IA Generativa y Creatividad — Tema 1\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido:
        "Al finalizar esta sesión serás capaz de:\n• Definir qué es la IA generativa y cómo difiere de la IA discriminativa\n• Identificar los tres tipos principales: texto, imagen y audio\n• Explicar cómo funcionan los transformers y modelos de difusión\n• Evaluar oportunidades de la IA generativa en el mercado ecuatoriano",
    },
    {
      titulo: "IA discriminativa vs IA generativa",
      contenido:
        "IA Discriminativa: aprende a CLASIFICAR lo que ya existe\nEjemplo: ¿este email es spam o no? ¿esta foto tiene un gato?\nEntrada → Etiqueta\n\nIA Generativa: aprende a CREAR contenido nuevo\nEjemplo: genera un email de ventas, crea una imagen de un gato\nEntrada (prompt) → Contenido original nuevo\n\nLa IA generativa es la que transforma a creativos, marketers y diseñadores.",
    },
    {
      titulo: "Los tres tipos de IA generativa",
      contenido:
        "TEXTO:\n• Modelos: GPT-4o, Claude 3.5, Gemini Ultra\n• Crea: artículos, código, contratos, guiones, respuestas\n\nIMAGEN:\n• Modelos: DALL-E 3, Midjourney V7, Stable Diffusion\n• Crea: ilustraciones, fotografías, logos, diseños\n\nAUDIO:\n• Modelos: ElevenLabs, Suno AI, Udio, Bark\n• Crea: voces, música completa, efectos de sonido",
    },
    {
      titulo: "¿Cómo funciona? — Los transformers",
      contenido:
        "Transformer (2017, Google) = arquitectura que revolucionó la IA\nMecanismo de atención: el modelo 'presta atención' a las partes más relevantes del contexto\n\nProceso simplificado para LLMs:\n1. El texto se convierte en tokens (trozos de palabras)\n2. Cada token se convierte en un vector numérico\n3. La red atiende a todos los tokens anteriores\n4. Predice el siguiente token con mayor probabilidad\n\n'La IA no entiende — completa patrones estadísticos a escala masiva'",
    },
    {
      titulo: "¿Cómo funciona? — Modelos de difusión",
      contenido:
        "Para generación de imágenes:\n1. El modelo aprende millones de imágenes con descripciones\n2. Aprende cómo se ve 'ruido' y cómo se ve 'imagen limpia'\n3. Dado un prompt, parte de ruido aleatorio\n4. En 20-50 pasos elimina el ruido guiado por el prompt\n5. Resultado: imagen que coincide con la descripción\n\nCada imagen generada es única — no copia de ninguna imagen existente.",
    },
    {
      titulo: "El boom de la IA generativa — línea de tiempo",
      contenido:
        "2017: Transformers (Google) — el fundamento\n2020: GPT-3 — primer LLM verdaderamente impresionante\n2021: DALL-E 1, Codex — IA para imágenes y código\n2022: Stable Diffusion (open source), ChatGPT (100M usuarios en 2 meses)\n2023: GPT-4, Claude, Midjourney V5, DALL-E 3\n2024: Sora (video), Claude 3, Gemini 1.5, Runway Gen-3\n2025-2026: Modelos multimodales nativos — audio+texto+imagen+video",
    },
    {
      titulo: "Impacto en el mercado laboral ecuatoriano",
      contenido:
        "Roles que se transforman (no desaparecen):\n• Diseñadores gráficos: de ejecutar a dirigir y editar\n• Redactores: de producir a editar y estrategizar\n• Músicos: de tocar todo a arreglar y producir con IA\n• Desarrolladores: de codificar cada línea a revisar y arquitecturar\n\nRoles emergentes (nuevos en Ecuador):\n• Prompt engineer ($1,500-$3,000/mes en empresas con IA)\n• Director creativo de IA (curación y dirección artística)\n• Diseñador de experiencias IA (chatbots + interfaces)",
    },
    {
      titulo: "Limitaciones que debes conocer",
      contenido:
        "Texto: alucina datos, no tiene actualización en tiempo real, no tiene memoria entre sesiones\nImagen: manos deformes (mejorando), texto en imágenes poco confiable, sesgo occidental en estilos\nAudio: voces con acento extranjero, inconsistencias en pistas largas\nGeneral: derechos de autor en debate, sesgo en datos de entrenamiento, consumo energético alto\n\nLa IA generativa es una herramienta potente, no mágica. El profesional que la dirige bien es irremplazable.",
    },
    {
      titulo: "Resumen del Tema 1",
      contenido:
        "1. IA Generativa crea contenido nuevo vs. IA Discriminativa que clasifica lo existente\n2. Tres tipos principales: texto (LLMs), imagen (difusión), audio (TTS+música)\n3. Los transformers y modelos de difusión son las arquitecturas clave\n4. Ecuador tiene oportunidad real: diseñadores y creativos que dominen estas herramientas\n5. Las limitaciones son reales — el criterio humano sigue siendo imprescindible\n\nPróximo: Modelos de lenguaje — GPT, Claude y Gemini en profundidad",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la diferencia fundamental entre IA discriminativa e IA generativa?",
      opciones: [
        "La discriminativa es más cara y la generativa más barata",
        "La discriminativa clasifica contenido existente; la generativa crea contenido nuevo",
        "La discriminativa usa Python y la generativa usa JavaScript",
        "No hay diferencia real — son el mismo tipo de IA",
      ],
      respuesta: 1,
      explicacion:
        "La IA discriminativa aprende a clasificar o etiquetar datos existentes. La IA generativa aprende a crear contenido nuevo (texto, imagen, audio, video) que no existía previamente.",
    },
    {
      pregunta: "¿Qué arquitectura de 2017 es la base de prácticamente toda la IA generativa moderna?",
      opciones: ["GANs (Redes Generativas Antagónicas)", "Redes Recurrentes LSTM", "Transformers", "Autoencoders Variacionales"],
      respuesta: 2,
      explicacion:
        "Los Transformers, presentados en el paper 'Attention is All You Need' (Google, 2017), son la arquitectura base de GPT, Claude, Gemini, BERT y prácticamente todos los modelos de lenguaje modernos.",
    },
    {
      pregunta: "¿Cómo funcionan los modelos de difusión para generar imágenes?",
      opciones: [
        "Copian y combinan fragmentos de imágenes existentes en internet",
        "Parten de ruido aleatorio y lo van eliminando gradualmente guiados por el prompt",
        "Generan el código HTML de la imagen y lo renderizan",
        "Usan una base de datos de millones de imágenes y eligen la más similar al prompt",
      ],
      respuesta: 1,
      explicacion:
        "Los modelos de difusión aprenden el proceso de 'des-ruidización'. Parten de ruido visual puro y en 20-50 pasos iterativos eliminan el ruido guiados por la descripción del prompt, generando una imagen original.",
    },
    {
      pregunta: "¿Qué herramienta ecuatoriana o LATAM puede beneficiarse más inmediatamente de la IA generativa de audio?",
      opciones: [
        "Empresas mineras",
        "Agencias de publicidad y producción de contenido para marcas",
        "Empresas agrícolas",
        "Bancos centrales",
      ],
      respuesta: 1,
      explicacion:
        "Las agencias de publicidad y producción de contenido pueden usar IA de audio (voces, música, efectos) para reducir costos de producción drásticamente, generando más piezas en menos tiempo — impacto inmediato y medible.",
    },
    {
      pregunta: "¿Cuál es una limitación real de la generación de imágenes con IA en 2026?",
      opciones: [
        "No puede generar imágenes a color",
        "Solo funciona con prompts en inglés",
        "Las manos y el texto en imágenes siguen siendo áreas con errores frecuentes",
        "Las imágenes generadas siempre son idénticas para el mismo prompt",
      ],
      respuesta: 2,
      explicacion:
        "A pesar de los grandes avances, las manos humanas y el texto escrito dentro de imágenes siguen siendo puntos débiles de los modelos de difusión, aunque están mejorando con cada versión.",
    },
  ],
  ejercicio: {
    titulo: "Mapa mental interactivo de IA generativa con ejemplos reales",
    objetivo:
      "Construir un mapa mental visual que clasifique las principales herramientas de IA generativa por tipo (texto, imagen, audio, video) con casos de uso específicos para Ecuador",
    herramientas: "Canva / Miro (miro.com gratis) + ChatGPT + Google Docs",
    datosEjemplo:
      "Herramientas a mapear:\nTexto: ChatGPT, Claude, Gemini, Copilot, Perplexity\nImagen: DALL-E 3, Midjourney, Stable Diffusion, Adobe Firefly, Leonardo AI\nAudio: ElevenLabs, Suno AI, Udio, Bark, Murf\nVideo: Runway Gen-3, Sora (OpenAI), Veo (Google), Pika, HeyGen\nMultimodal: Gemini Ultra, GPT-4o, Claude 3.5 Sonnet",
    pasos: [
      "Abrir Canva o Miro y crear un nuevo mapa mental (buscar plantilla 'Mind Map' en Canva o 'Mapa Mental' en Miro)",
      "Crear nodo central: 'IA Generativa 2026'",
      "Crear 4 ramas principales: Texto, Imagen, Audio, Video",
      "Para cada herramienta, agregar: nombre, empresa, precio (gratuito/pago), y UN caso de uso específico para el mercado ecuatoriano",
      "En ChatGPT, pedir: 'Dame 5 casos de uso concretos de IA generativa para empresas ecuatorianas medianas en los sectores: retail, educación, turismo, agricultura y salud. Un caso por sector para texto, imagen y audio.' Incorporar los mejores al mapa.",
      "Agregar una sección de 'Limitaciones' con al menos 3 por tipo de IA",
      "Exportar el mapa mental como imagen PNG de alta resolución",
      "Escribir en Google Docs un análisis de 300 palabras: ¿qué tipo de IA generativa tiene más potencial inmediato en Ecuador y por qué? Cita 2 empresas ecuatorianas reales que ya la usen.",
    ],
    resultado:
      "Mapa mental visual completo con +20 herramientas clasificadas, casos de uso específicos para Ecuador en 5 sectores y análisis escrito de 300 palabras con perspectiva de mercado local.",
    criterios: [
      { criterio: "Completitud del mapa (mínimo 15 herramientas correctamente clasificadas)", puntos: 25 },
      { criterio: "Casos de uso ecuatorianos relevantes y específicos", puntos: 30 },
      { criterio: "Limitaciones identificadas con criterio técnico correcto", puntos: 15 },
      { criterio: "Calidad visual del mapa mental (legibilidad, estructura)", puntos: 15 },
      { criterio: "Análisis escrito con evidencia de investigación del mercado ecuatoriano", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "The State of AI Report 2024",
      url: "https://www.stateof.ai/",
      tipo: "documentacion",
      descripcion: "Reporte anual del estado del arte de la IA, incluida la IA generativa. Datos de inversión, modelos destacados y tendencias tecnológicas.",
    },
    {
      titulo: "Hugging Face — Hub de modelos de IA generativa",
      url: "https://huggingface.co/models",
      tipo: "herramienta",
      descripcion: "Repositorio con más de 300,000 modelos de IA, incluyendo modelos de texto, imagen y audio. Muchos gratuitos y ejecutables en el navegador.",
    },
    {
      titulo: "Attention is All You Need — Paper original Transformers",
      url: "https://arxiv.org/abs/1706.03762",
      tipo: "documentacion",
      descripcion: "El paper de Google de 2017 que introdujo la arquitectura Transformer. Base de GPT, BERT y toda la IA generativa moderna.",
    },
    {
      titulo: "Suno AI — Generación de música con IA",
      url: "https://suno.com",
      tipo: "herramienta",
      descripcion: "Genera canciones completas con letra y música a partir de un prompt de texto. Plan gratuito disponible. Excelente para entender IA generativa de audio.",
    },
    {
      titulo: "ElevenLabs — Síntesis de voz con IA",
      url: "https://elevenlabs.io",
      tipo: "herramienta",
      descripcion: "La herramienta líder para síntesis de voz realista con IA. Voces en español. Plan gratuito con 10,000 caracteres mensuales.",
    },
  ],
  teoria: `La Inteligencia Artificial Generativa representa el cambio más profundo en las herramientas creativas desde la invención de la cámara fotográfica. Por primera vez en la historia, las máquinas no solo pueden analizar y clasificar el contenido existente — pueden crear contenido completamente nuevo: textos, imágenes, música, voces y videos que no existían antes y que, en muchos casos, son indistinguibles de los creados por humanos con experiencia.

Para entender qué hace diferente a la IA generativa, primero hay que entender qué es la IA discriminativa: sistemas entrenados para reconocer y clasificar. Un detector de spam aprende que ciertos patrones de texto = spam. Un reconocedor facial aprende que ciertos patrones de píxeles = cara humana. La IA discriminativa responde la pregunta "¿qué es esto?". La IA generativa responde la pregunta "¿cómo creo algo nuevo con estas características?".

Existen tres tipos principales de IA generativa en producción en 2026. Los Modelos de Lenguaje Grandes (LLMs) como GPT-4o, Claude 3.5 Sonnet y Gemini Ultra generan texto: desde correos electrónicos y artículos hasta código de programación, contratos legales y guiones de video. Funcionan con la arquitectura Transformer, que utiliza un mecanismo de atención para procesar y generar texto token por token (fragmentos de palabras), prediendo cada próximo token basándose en todos los anteriores.

Los modelos de difusión generan imágenes. Herramientas como DALL-E 3, Midjourney V7 y Stable Diffusion FLUX aprenden la relación entre descripciones textuales y contenido visual procesando miles de millones de pares imagen-descripción. Para generar una imagen, parten de ruido visual aleatorio y ejecutan entre 20 y 50 pasos de "des-ruidización" guiados por el embedding del prompt, produciendo una imagen que corresponde a la descripción. Cada imagen es única y no es una copia de ninguna imagen del entrenamiento.

Los modelos de síntesis de audio funcionan con varios enfoques. La síntesis de voz (Text-to-Speech) de ElevenLabs o Murf convierte texto en voz con características humanas realistas: timbre, entonación, pauses naturales, incluso emociones. Los modelos de generación musical como Suno AI y Udio toman un prompt textual ("cumbia andina ecuatoriana con guitarra acústica y ritmo festivo") y generan canciones completas con melodía, armonía, letra y producción.

En el mercado ecuatoriano, las oportunidades para profesionales creativos que dominen estas herramientas son concretas e inmediatas. Las agencias de publicidad pueden producir campañas completas en días en lugar de semanas, reduciendo costos hasta un 70%. Las empresas de contenido digital pueden multiplicar su producción sin aumentar personal. Las startups ecuatorianas pueden crear branding profesional con presupuestos mínimos. Los educadores pueden generar materiales de aprendizaje personalizados. Las productoras de podcast pueden clonar voces para traducir contenido a múltiples idiomas.

Es igualmente importante comprender las limitaciones reales. Los LLMs alucinan: inventan datos, citas y estadísticas que suenan convincentes pero son incorrectos. Los modelos de imagen tienen dificultades consistentes con las manos humanas (aunque mejoran con cada versión) y con texto dentro de imágenes. Los modelos de audio pueden tener inconsistencias en producciones largas y acentos poco naturales en español de Ecuador específicamente. Ningún modelo generativo puede garantizar originalidad absoluta en términos legales.

El debate sobre derechos de autor en torno a la IA generativa está evolucionando rápidamente. En Ecuador, la Ley de Propiedad Intelectual no contemplaba explícitamente la IA al momento de su redacción. La práctica actual del mercado es que el contenido generado por IA bajo instrucciones de una persona pertenece a esa persona, pero esto puede cambiar con nuevas regulaciones. Para uso comercial, la recomendación es documentar los prompts usados y verificar las políticas de cada herramienta específica.`,
};

const tema2: TemaC10 = {
  id: 2,
  titulo: "Modelos de lenguaje: GPT, Claude y Gemini en profundidad",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Comparativa GPT-4 vs Claude vs Gemini — Guía completa español",
  videoDuracion: "~40 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "Modelos de Lenguaje: GPT, Claude y Gemini en Profundidad\nC10. IA Generativa y Creatividad — Tema 2\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "Los tres grandes modelos en 2026",
      contenido:
        "GPT-4o (OpenAI)\nClaude 3.5 Sonnet / Claude 3 Opus (Anthropic)\nGemini 1.5 Pro / Ultra (Google DeepMind)\n\nCada uno tiene fortalezas distintas. El profesional inteligente usa el correcto para cada tarea, no siempre el mismo.",
    },
    {
      titulo: "GPT-4o — OpenAI",
      contenido:
        "Fortalezas: multimodal nativo (texto+imagen+audio), velocidad, plugins y GPTs personalizados, integraciones con Microsoft 365 y Copilot\nLimitaciones: context window 128K, precio ($20/mes Plus), alucinaciones en datos numéricos\nMejor para: brainstorming, código, análisis de imágenes, generación masiva de contenido\nPrecio: gratuito (GPT-3.5) / $20/mes Plus / API por tokens",
    },
    {
      titulo: "Claude 3.5 Sonnet — Anthropic",
      contenido:
        "Fortalezas: context window 200K (más largo del mercado), razonamiento profundo, menos alucinaciones, mejor en análisis de documentos largos, más cuidadoso en respuestas\nLimitaciones: sin browsing en tiempo real, algunas respuestas más largas de lo necesario\nMejor para: análisis de contratos, documentos legales, redacción larga, código complejo\nPrecio: gratuito (Claude.ai) / $20/mes Pro",
    },
    {
      titulo: "Gemini 1.5 Pro — Google DeepMind",
      contenido:
        "Fortalezas: context window 1 MILLÓN de tokens, integración nativa con Google Workspace (Docs, Sheets, Gmail), búsqueda en tiempo real, multimodal\nLimitaciones: calidad creativa algo inferior a GPT y Claude, respuestas a veces más genéricas\nMejor para: análisis de documentos muy largos, integración Google, búsqueda actualizada\nPrecio: gratuito (Gemini.google.com) / $19.99/mes Advanced",
    },
    {
      titulo: "Comparativa práctica — ¿cuándo usar cada uno?",
      contenido:
        "Escribir una campaña publicitaria: GPT-4o (creatividad) o Claude (profundidad)\nAnalizar un contrato de 200 páginas: Claude (200K context)\nBuscar información actualizada de hoy: Gemini (grounding en búsqueda)\nCrear imagen desde texto: GPT-4o con DALL-E 3\nAnalizar hojas de cálculo en Google Sheets: Gemini\nCódigo complejo con múltiples archivos: Claude o GPT-4o con Cursor",
    },
    {
      titulo: "Prompt engineering — 5 principios fundamentales",
      contenido:
        "1. ROL: 'Eres un copywriter especialista en marketing digital para PyMEs ecuatorianas'\n2. CONTEXTO: describe el proyecto, la audiencia, el tono deseado\n3. TAREA ESPECÍFICA: qué exactamente debe producir\n4. FORMATO: tabla, lista, párrafo, JSON, longitud\n5. RESTRICCIONES: 'no uses jerga técnica', 'evita el tono vendedor agresivo'\n\nUn buen prompt = 40% del resultado. El resto es iteración.",
    },
    {
      titulo: "Chain of Thought — razonamiento en cadena",
      contenido:
        "Técnica: pedir al modelo que piense paso a paso antes de dar la respuesta final\n\nSin CoT: 'Resuelve este problema de finanzas'\nCon CoT: 'Resuelve este problema de finanzas. Primero, explica qué información necesitas. Segundo, describe el método. Tercero, resuelve. Cuarto, verifica el resultado.'\n\nResultado: 40-80% menos errores en problemas complejos. Especialmente útil para análisis, código y matemáticas.",
    },
    {
      titulo: "Alucina​ciones — cómo detectarlas y mitigarlas",
      contenido:
        "¿Qué es una alucinación? El modelo inventa datos con total confianza.\nEjemplos: estadísticas falsas, citas de libros inexistentes, nombres de empresas incorrectos\n\nCómo mitigar:\n• Pedir fuentes: 'cita las fuentes exactas con URL'\n• Verificar en Google los datos clave antes de publicar\n• Pedir al modelo: '¿Cuán seguro estás de esta información? ¿Qué no sabes?'\n• Usar Perplexity AI para búsqueda verificada con fuentes",
    },
    {
      titulo: "Resumen del Tema 2",
      contenido:
        "1. GPT-4o: multimodal, creativo, velocidad — ideal para brainstorming y contenido\n2. Claude: contexto largo, razonamiento profundo — ideal para documentos y análisis\n3. Gemini: integración Google, búsqueda en tiempo real — ideal para workspace\n4. Chain of Thought reduce errores 40-80% en tareas complejas\n5. Las alucinaciones son reales — siempre verifica datos críticos\n\nPróximo: Prompt engineering avanzado para creativos",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué modelo de IA tiene la ventana de contexto más larga en 2026, de hasta 1 millón de tokens?",
      opciones: ["GPT-4o", "Claude 3 Opus", "Gemini 1.5 Pro", "Llama 3"],
      respuesta: 2,
      explicacion:
        "Gemini 1.5 Pro de Google DeepMind ofrece una ventana de contexto de hasta 1 millón de tokens, lo que permite analizar libros enteros, conjuntos de código muy grandes o horas de transcripciones en una sola sesión.",
    },
    {
      pregunta: "¿Qué técnica de prompting reduce los errores en problemas complejos entre un 40% y un 80%?",
      opciones: [
        "Few-shot prompting",
        "Chain of Thought (razonamiento en cadena)",
        "Zero-shot prompting",
        "Prompt injection",
      ],
      respuesta: 1,
      explicacion:
        "Chain of Thought (CoT) pide al modelo que razone paso a paso antes de dar la respuesta final. Esto reduce errores significativamente en tareas que requieren razonamiento lógico, matemático o de múltiples pasos.",
    },
    {
      pregunta: "¿Para qué tarea es más recomendable usar Claude en lugar de GPT-4o?",
      opciones: [
        "Generar imágenes a partir de texto",
        "Buscar noticias del día de hoy",
        "Analizar un contrato legal de 200 páginas",
        "Crear una presentación con slides",
      ],
      respuesta: 2,
      explicacion:
        "Claude destaca por su ventana de contexto de 200K tokens y su capacidad de análisis profundo de documentos largos como contratos, informes o libros completos. Su arquitectura también tiende a alucinar menos que otros modelos en análisis de documentos.",
    },
    {
      pregunta: "¿Qué es una 'alucinación' en el contexto de los LLMs?",
      opciones: [
        "Cuando el modelo genera imágenes abstractas",
        "Cuando el modelo inventa datos, citas o hechos con total confianza aunque sean falsos",
        "Cuando el modelo tarda demasiado en responder",
        "Cuando el modelo no entiende el prompt",
      ],
      respuesta: 1,
      explicacion:
        "Una alucinación es cuando el modelo de lenguaje genera información que suena convincente y factual pero es incorrecta o inventada: estadísticas falsas, citas de libros que no existen, hechos históricos incorrectos, etc.",
    },
    {
      pregunta: "¿Cuál es la mejor práctica para mitigar las alucinaciones al usar un LLM?",
      opciones: [
        "Usar siempre el modelo más caro disponible",
        "Repetir el prompt varias veces hasta obtener la respuesta deseada",
        "Verificar en fuentes externas los datos críticos antes de publicarlos",
        "Usar solo prompts en inglés",
      ],
      respuesta: 2,
      explicacion:
        "La práctica más efectiva es verificar en fuentes externas (Google, Perplexity, fuentes oficiales) cualquier dato estadístico, cita o hecho específico antes de usarlo en contenido público o decisiones importantes.",
    },
  ],
  ejercicio: {
    titulo: "Benchmark personal: GPT vs Claude vs Gemini para tu caso de uso",
    objetivo:
      "Realizar un benchmark comparativo de los tres modelos principales (GPT-4o, Claude, Gemini) para un caso de uso profesional específico del estudiante, documentando calidad, velocidad y limitaciones",
    herramientas: "ChatGPT (chatgpt.com) + Claude.ai + Gemini (gemini.google.com) + Google Docs",
    datosEjemplo:
      "Tarea de benchmark: escribir un correo de prospección B2B para ofrecer servicios de capacitación en IA a medianas empresas de Quito, Ecuador. El correo debe: tener menos de 200 palabras, tono profesional pero cálido, incluir propuesta de valor clara, CTA específico para agendar una llamada de 20 minutos.",
    pasos: [
      "Definir el caso de uso a evaluar (puede ser el de ejemplo u otro relevante para tu trabajo: redacción de propuestas, análisis de documentos, generación de código, etc.)",
      "Enviar exactamente el mismo prompt a los tres modelos. Usar esta estructura: 'Eres [rol relevante]. Tu tarea es [tarea específica]. Contexto: [contexto necesario]. Formato: [cómo debe ser la respuesta]. Restricciones: [qué no debe incluir]'",
      "Para cada respuesta, evaluar en escala 1-5: calidad del contenido, precisión de la tarea, tono y estilo, creatividad, y cumplimiento de las restricciones",
      "Crear tabla comparativa en Google Docs con las evaluaciones de los tres modelos",
      "Iterar: tomar la respuesta del modelo con menor puntuación y mejorar el prompt. Evaluar si la nueva respuesta mejora. Documentar qué cambio en el prompt generó la mejora.",
      "Probar la técnica Chain of Thought con el modelo de peor desempeño inicial: agregar 'Antes de escribir la respuesta final, lista los 3 elementos más importantes que debe incluir y por qué'. Comparar con la respuesta sin CoT.",
      "Conclusión en Google Docs (300 palabras): ¿cuál modelo recomendarías para este caso de uso y por qué? ¿Qué limitaciones encontraste en cada uno? ¿Cómo cambió tu prompt a lo largo del ejercicio?",
    ],
    resultado:
      "Tabla comparativa de los tres modelos para un caso de uso real, con puntuaciones justificadas, iteraciones de prompt documentadas, demostración de Chain of Thought y recomendación fundamentada.",
    criterios: [
      { criterio: "Prompt estructurado correctamente con los 5 elementos (ROL+CONTEXTO+TAREA+FORMATO+RESTRICCIONES)", puntos: 20 },
      { criterio: "Evaluación objetiva y justificada de los tres modelos en la tabla", puntos: 25 },
      { criterio: "Documentación de al menos 2 iteraciones de mejora del prompt", puntos: 20 },
      { criterio: "Demostración de Chain of Thought con comparativa antes/después", puntos: 20 },
      { criterio: "Conclusión con recomendación fundamentada en evidencia del ejercicio", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "ChatGPT — OpenAI",
      url: "https://chatgpt.com",
      tipo: "herramienta",
      descripcion: "Acceso a GPT-4o. Plan gratuito disponible con limitaciones. Plan Plus $20/mes para acceso completo con DALL-E, análisis de archivos y más.",
    },
    {
      titulo: "Claude.ai — Anthropic",
      url: "https://claude.ai",
      tipo: "herramienta",
      descripcion: "Acceso a Claude 3.5 Sonnet y Claude 3 Haiku. Plan gratuito con límite diario. Plan Pro $20/mes para acceso extendido.",
    },
    {
      titulo: "Gemini — Google",
      url: "https://gemini.google.com",
      tipo: "herramienta",
      descripcion: "Acceso a Gemini 1.5 Flash gratuito y 1.5 Pro con Advanced ($19.99/mes). Integración nativa con Google Workspace.",
    },
    {
      titulo: "Prompt Engineering Guide",
      url: "https://www.promptingguide.ai/es",
      tipo: "documentacion",
      descripcion: "Guía completa de técnicas de prompt engineering en español: zero-shot, few-shot, chain of thought, y más. Mantenida por la comunidad.",
    },
    {
      titulo: "Perplexity AI — Búsqueda verificada con fuentes",
      url: "https://www.perplexity.ai",
      tipo: "herramienta",
      descripcion: "Alternativa a ChatGPT con búsqueda en tiempo real y fuentes verificables. Ideal para datos que necesitan estar actualizados y verificados.",
    },
  ],
  teoria: `Los modelos de lenguaje grandes (LLMs) son el corazón de la revolución de IA generativa en texto. En 2026, tres ecosistemas dominan el mercado: OpenAI con GPT-4o, Anthropic con Claude 3.5, y Google con Gemini 1.5. Aunque todos son capaces de generar texto de alta calidad, tienen arquitecturas, filosofías de diseño y fortalezas distintas que hacen unos mejores que otros para tareas específicas.

GPT-4o de OpenAI es el modelo más conocido globalmente gracias al lanzamiento de ChatGPT en noviembre de 2022. Su principal fortaleza es la versatilidad y la integración con el ecosistema de herramientas de OpenAI: puede generar imágenes con DALL-E 3, escuchar y generar audio en tiempo real, analizar documentos e imágenes, y ejecutarse como base para miles de GPTs personalizados. Microsoft ha integrado GPT en su suite completa bajo la marca Copilot. La versión gratuita está limitada a GPT-3.5; el plan Plus por $20 mensuales da acceso a GPT-4o con todas sus capacidades.

Claude 3.5 de Anthropic se distingue por dos características principales: la ventana de contexto de 200,000 tokens (permitiendo procesar documentos de hasta unas 150,000 palabras en una sola sesión) y su reputación de menor tasa de alucinaciones en análisis de documentos complejos. Anthropic fue fundada por ex-investigadores de OpenAI preocupados por la seguridad de la IA, lo que se refleja en una filosofía de diseño más cuidadosa. Claude destaca especialmente en análisis de contratos legales, revisión de código extenso, razonamiento lógico profundo y redacción de documentos técnicos.

Gemini 1.5 de Google DeepMind compite con una propuesta diferente: la integración nativa con el ecosistema Google. Gemini está embebido en Gmail, Docs, Sheets, Slides y Drive, lo que lo hace la opción más conveniente para usuarios que ya trabajan en Google Workspace. Su ventana de contexto de hasta 1 millón de tokens (la mayor del mercado) permite analizar horas de video, libros completos o repositorios de código enteros. Su capacidad de búsqueda en tiempo real mediante grounding elimina el problema de conocimiento desactualizado.

El prompt engineering es la habilidad de comunicarse efectivamente con los LLMs para obtener los resultados deseados. No es programación — es redacción estratégica. Los cinco elementos de un prompt efectivo son: el ROL (definir quién es el modelo en esa conversación), el CONTEXTO (información de fondo necesaria para la tarea), la TAREA ESPECÍFICA (qué exactamente debe producir el modelo), el FORMATO (cómo debe estar estructurada la respuesta) y las RESTRICCIONES (qué no debe incluir o qué límites debe respetar). Un prompt bien construido puede duplicar la calidad del resultado comparado con una petición vaga.

La técnica Chain of Thought (CoT) merece especial atención. Al pedirle al modelo que razone paso a paso antes de dar la respuesta final, se activan capacidades de razonamiento más profundas que reducen los errores entre un 40% y un 80% en tareas complejas. La diferencia entre "resuelve este problema" y "resuelve este problema paso a paso, mostrando tu razonamiento antes de dar la respuesta final" puede ser la diferencia entre una respuesta mediocre y una excelente.

Las alucinaciones son el principal riesgo operativo de usar LLMs en contextos profesionales. Un LLM puede generar con total confianza estadísticas inventadas, citar libros que no existen, mencionar estudios que nunca se realizaron, o atribuir citas a personas que nunca las dijeron. La mitigación requiere una práctica sistemática: verificar en fuentes externas todo dato numérico, estadística o cita antes de usarlo en contenido público, pedir al modelo que indique su nivel de certeza, y usar herramientas con búsqueda verificada como Perplexity cuando la actualidad y exactitud son críticas.`,
};

const tema3: TemaC10 = placeholder(3, "Prompt engineering avanzado para creativos", MOD1, 1);
const tema4: TemaC10 = placeholder(4, "IA generativa de audio: ElevenLabs, Suno y Udio", MOD1, 1);
const tema5: TemaC10 = placeholder(5, "Ética y derechos de autor en IA generativa", MOD1, 1);

// ─── MÓDULO 2: Generación de Imágenes con IA ───────────────────────────────

const MOD2 = "Generación de Imágenes con IA";

const tema6: TemaC10 = {
  id: 6,
  titulo: "Midjourney V7 — dominio completo de imagen IA",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Midjourney V7 Guía Completa en Español 2025",
  videoDuracion: "~45 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "Midjourney V7 — Dominio Completo de Imagen IA\nC10. IA Generativa y Creatividad — Tema 6\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Por qué Midjourney lidera el mercado?",
      contenido:
        "Midjourney es la herramienta de generación de imágenes con mayor calidad estética en 2026\nUsuarios activos: más de 16 millones\nDiferenciador: resultados fotorealistas y artísticos de nivel profesional\nV7 (2025): interfaz web propia, sin necesidad de Discord, prompts más intuitivos\n\nPrecio: $10/mes (200 imágenes) · $30/mes (ilimitado estándar) · $60/mes (ilimitado fast)",
    },
    {
      titulo: "Estructura de prompt en Midjourney",
      contenido:
        "Prompt básico: [sujeto] [contexto] [estilo] [parámetros]\n\nEjemplo básico: 'executive woman in modern office, Quito Ecuador cityscape background, professional photography, shallow depth of field'\n\nEjemplo avanzado: 'executive woman in modern office in Quito Ecuador, golden hour lighting, editorial fashion photography style, --ar 16:9 --style raw --q 2 --v 7'\n\nRegla: en inglés da mejores resultados, aunque Midjourney entiende español.",
    },
    {
      titulo: "Parámetros clave de Midjourney V7",
      contenido:
        "--ar X:Y : aspect ratio (16:9 para video/pantalla, 4:5 para Instagram, 1:1 para feed)\n--style raw : menos intervención artística del modelo, más fiel al prompt\n--q 0.25/1/2 : calidad (0.25 rápido, 1 normal, 2 alta calidad)\n--no X : excluir elementos ('--no text, watermark')\n--seed N : reproducir el mismo resultado\n--iw N : peso de imagen de referencia (con /blend)",
    },
    {
      titulo: "Estilos visuales populares en Midjourney",
      contenido:
        "Fotografía: 'shot on Canon 5D, f/1.4, 85mm lens, bokeh'\nCinematografía: 'cinematic still, anamorphic lens, film grain, Kodak Vision3'\nArte digital: 'digital illustration, flat design, vector style'\nAcuarela: 'watercolor painting, loose brushstrokes, soft colors'\nFotorrealismo: 'hyperrealistic, 8k, ultra detailed, studio lighting'\nMinimalista: 'minimalist design, clean, white background, single subject'",
    },
    {
      titulo: "Casos de uso Ecuador — negocios reales",
      contenido:
        "Empresa florícola Cayambe: imágenes de catálogo de rosas para exportación ($0 vs $500/sesión fotográfica)\nRestaurante Quito: fotografía de platos para Instagram y menú digital\nInmobiliaria Guayaquil: renders de interiores para ventas antes de construcción\nAgencia de turismo: destinos turísticos en Ecuador en estilos cinematográficos\nMarca de ropa: lookbooks para redes sociales sin modelos físicos\n\nROI: ahorro de $300-$2,000 por proyecto vs fotografía tradicional.",
    },
    {
      titulo: "Consistency — mantener coherencia en una serie",
      contenido:
        "Challenge: ¿cómo generar múltiples imágenes de la misma persona o producto?\nSolución Midjourney:\n1. --cref [URL de imagen]: character reference (mantiene rasgos del personaje)\n2. --sref [URL de imagen]: style reference (mantiene estilo visual)\n3. /blend [imagen1 + imagen2]: combina estilos de dos referencias\n4. Seeds: mismo seed = variaciones del mismo resultado\n\nLimitación: no es perfectamente consistente. Para branding estricto, complementar con editores.",
    },
    {
      titulo: "Inpainting y variaciones — edición de imágenes",
      contenido:
        "Upscale: aumentar resolución sin perder calidad\nVariations (V1-V4): generar 4 variantes del cuadrante seleccionado\nInpaint/Remix: seleccionar área y regenerar solo esa parte con nuevo prompt\nZoom Out: expandir la imagen más allá del frame original\nPan: extender la imagen en una dirección\n\nFlujo profesional: generar → seleccionar mejor → upscale → inpaint detalles problemáticos → exportar.",
    },
    {
      titulo: "Limitaciones y aspectos legales",
      contenido:
        "Manos y texto: siguen siendo áreas con errores frecuentes en V7 (mejoraron vs V6)\nPersonas reales: Midjourney prohíbe generar imágenes de personas reales identificables sin consentimiento\nDerechos: plan $10 no permite uso comercial en empresas >$1M ingresos anuales\n'Al estilo de' artistas vivos: zona gris legal, muchos artistas han demandado\nAdobe Firefly: la alternativa más segura legalmente (entrenado con imágenes licenciadas)\n\nPráctica: documentar en contratos de clientes el uso de IA generativa.",
    },
    {
      titulo: "Resumen del Tema 6",
      contenido:
        "1. Midjourney V7 es la herramienta de mayor calidad estética para generación de imágenes\n2. Estructura de prompt: sujeto + contexto + estilo + parámetros\n3. Parámetros clave: --ar, --style raw, --q, --no, --cref, --sref\n4. ROI real en Ecuador: $300-$2,000 de ahorro por proyecto vs fotografía tradicional\n5. Verificar derechos de uso según plan y tipo de cliente\n\nPróximo: DALL-E 3 y Adobe Firefly para uso comercial seguro",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué parámetro de Midjourney se usa para especificar el formato de la imagen (ej. 16:9 para pantalla)?",
      opciones: ["--style", "--ar", "--q", "--seed"],
      respuesta: 1,
      explicacion:
        "--ar (aspect ratio) define la relación de aspecto de la imagen. --ar 16:9 para pantalla ancha, --ar 1:1 para feed cuadrado de Instagram, --ar 4:5 para feed vertical de Instagram.",
    },
    {
      pregunta: "¿Qué parámetro de Midjourney reduce la intervención artística del modelo y hace la imagen más fiel al prompt?",
      opciones: ["--q 2", "--no text", "--style raw", "--iw 2"],
      respuesta: 2,
      explicacion:
        "'--style raw' reduce la interpretación artística que Midjourney aplica por defecto, resultando en imágenes más cercanas a la descripción literal del prompt. Útil para fotografía realista y product shots.",
    },
    {
      pregunta: "Una empresa florícola de Cayambe usa Midjourney para generar imágenes de su catálogo de exportación. ¿Qué ahorro aproximado logra vs una sesión fotográfica profesional?",
      opciones: ["$10-$50 por imagen", "$50-$100 por proyecto", "$300-$500 por proyecto", "$300-$2,000 por proyecto"],
      respuesta: 3,
      explicacion:
        "Una sesión fotográfica profesional para catálogo de exportación (fotógrafo, modelos, props, estudio) puede costar entre $500 y $2,000 o más. Con Midjourney, el costo es esencialmente el de la suscripción mensual ($10-$60), con un ROI muy alto.",
    },
    {
      pregunta: "¿Qué herramienta es la alternativa más segura legalmente para uso comercial de imágenes generadas con IA?",
      opciones: ["Midjourney V7", "Stable Diffusion base", "Adobe Firefly", "DALL-E 3 plan gratuito"],
      respuesta: 2,
      explicacion:
        "Adobe Firefly fue entrenado exclusivamente con imágenes licenciadas de Adobe Stock y contenido de dominio público, lo que lo convierte en la opción más segura para uso comercial sin riesgo de infracciones de derechos de autor.",
    },
    {
      pregunta: "¿Qué función de Midjourney permite regenerar solo una parte específica de una imagen generada?",
      opciones: ["Zoom Out", "Upscale", "Inpaint/Remix", "Pan"],
      respuesta: 2,
      explicacion:
        "Inpaint (también llamado Vary Region o Remix en Midjourney) permite seleccionar un área específica de la imagen generada y regenerarla con un nuevo prompt, sin afectar el resto de la imagen. Ideal para corregir manos, fondos o detalles problemáticos.",
    },
  ],
  ejercicio: {
    titulo: "Kit visual de marca Ecuador con Midjourney",
    objetivo:
      "Crear un kit visual completo para una marca ecuatoriana ficticia usando Midjourney V7 (o Leonardo AI si no hay acceso a Midjourney), demostrando dominio de prompts con parámetros y estilos consistentes",
    herramientas: "Midjourney (midjourney.com) o Leonardo AI (leonardo.ai) + Canva para composición final",
    datosEjemplo:
      "Marca ficticia: SIERRA VERDE — empresa de productos orgánicos de la Sierra ecuatoriana\nProductos: mermeladas, licores artesanales, miel, especias\nTono de marca: artesanal, natural, sofisticado, orgullo ecuatoriano\nPaleta: verdes, dorados, tierra, crema\nNecesidades: 1 foto de producto, 1 foto lifestyle, 1 imagen para hero de website, 1 imagen para Instagram Story, 1 imagen de campaña navideña",
    pasos: [
      "Abrir Midjourney (midjourney.com, pestaña Explore) o Leonardo AI (leonardo.ai)",
      "Generar imagen 1 — foto de producto: 'artisan glass jar with organic strawberry jam, wooden rustic table, flowers background, natural light, product photography, soft bokeh, --ar 1:1 --style raw --q 2' — generar 4 variaciones, seleccionar la mejor",
      "Generar imagen 2 — lifestyle: 'woman in traditional ecuadorian attire holding organic honey jar in andes mountains, golden hour, lifestyle photography, --ar 4:5 --style raw'",
      "Generar imagen 3 — hero website: 'organic farm in ecuador andes mountains, green terraces, fresh produce, misty morning, aerial view, cinematic, --ar 16:9 --q 2'",
      "Generar imagen 4 — Instagram Story: 'sierra verde organic brand, artisanal products flat lay on stone table, herbs flowers, warm tones, --ar 9:16'",
      "Generar imagen 5 — campaña navideña: 'organic gifts set with andean decorations, christmas, cozy, warm lighting, ecuadorian style, --ar 1:1'",
      "Para cada imagen: documentar el prompt exacto, los parámetros usados, y al menos 1 iteración de mejora con el prompt modificado",
      "Crear en Canva una presentación de 5 slides con las imágenes finales, el nombre de la marca, y el prompt que generó cada imagen",
    ],
    resultado:
      "Kit visual de 5 imágenes para la marca SIERRA VERDE con prompts documentados, parámetros justificados, iteraciones de mejora y presentación final en Canva lista para presentar a un cliente real.",
    criterios: [
      { criterio: "Las 5 imágenes generadas con prompts estructurados y parámetros correctos", puntos: 30 },
      { criterio: "Consistencia estética entre las 5 imágenes (misma identidad de marca)", puntos: 25 },
      { criterio: "Documentación de iteraciones de mejora de prompts", puntos: 20 },
      { criterio: "Presentación Canva profesional con prompts documentados", puntos: 15 },
      { criterio: "Adecuación cultural al mercado ecuatoriano (elementos locales visibles)", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "Midjourney — Plataforma oficial",
      url: "https://www.midjourney.com",
      tipo: "herramienta",
      descripcion: "Acceso a Midjourney V7 desde la web. Plan básico $10/mes con 200 imágenes. El mejor punto de entrada para aprender generación de imágenes con IA.",
    },
    {
      titulo: "Leonardo AI — Alternativa gratuita",
      url: "https://leonardo.ai",
      tipo: "herramienta",
      descripcion: "Interfaz amigable para Stable Diffusion con créditos gratuitos diarios. Excelente para practicar sin costo. Modelos especializados en fotografía y arte.",
    },
    {
      titulo: "Adobe Firefly — Generación segura para comercial",
      url: "https://firefly.adobe.com",
      tipo: "herramienta",
      descripcion: "Generador de imágenes de Adobe entrenado con imágenes licenciadas. La opción más segura para proyectos con clientes grandes.",
    },
    {
      titulo: "Midjourney Prompt Tips — Documentación oficial",
      url: "https://docs.midjourney.com/docs/prompts",
      tipo: "documentacion",
      descripcion: "Guía oficial de Midjourney con todos los parámetros, técnicas de prompt y ejemplos visuales de los diferentes estilos.",
    },
  ],
  teoria: `Midjourney se ha consolidado como la herramienta de generación de imágenes con mayor calidad estética del mercado. Fundada en 2021 por David Holz, la empresa logró algo inédito en el mundo de las startups de IA: alcanzar rentabilidad sin financiamiento externo, solo con ingresos de suscripciones de sus más de 16 millones de usuarios activos. Midjourney V7, lanzado en 2025, incorpora su propia interfaz web eliminando la dependencia de Discord que caracterizó las versiones anteriores.

La diferencia entre Midjourney y otras herramientas de generación de imágenes radica en su calibración estética. Mientras DALL-E 3 tiende hacia la ilustración y la representación literal del prompt, y Stable Diffusion ofrece máximo control técnico, Midjourney produce consistentemente imágenes con una calidad fotográfica y artística que profesionales de diseño han tardado años en desarrollar. Esta ventaja es especialmente visible en fotografía de producto, retratos, paisajes y composiciones con iluminación compleja.

La arquitectura de un prompt efectivo en Midjourney sigue la estructura: SUJETO (qué es lo principal de la imagen) + CONTEXTO (dónde está, cuál es el fondo) + ESTILO (fotografía, ilustración, pintura, cinematografía) + DETALLES TÉCNICOS (lente, iluminación, composición) + PARÁMETROS (--ar para formato, --style para nivel de interpretación artística, --q para calidad, --no para exclusiones).

Los parámetros más importantes a dominar son: --ar para el aspect ratio (--ar 16:9 para pantalla y video, --ar 1:1 para feed cuadrado, --ar 4:5 para feed vertical de Instagram, --ar 9:16 para stories y TikTok), --style raw que reduce la interpretación artística propia de Midjourney y hace el resultado más fiel al prompt literal, --q 2 para máxima calidad (más lento y costoso en créditos), y --no para excluir elementos específicos.

Para el mercado creativo ecuatoriano, las aplicaciones de mayor ROI inmediato incluyen: fotografía de producto para catálogos de exportación (flores, cacao, artesanías), imágenes lifestyle para redes sociales de restaurantes y hoteles, renders de interiores para inmobiliarias, material gráfico para campañas digitales y lookbooks para marcas de moda y textiles. En todos estos casos, el costo de una suscripción mensual de Midjourney ($10-$60) se compara favorablemente con una sesión fotográfica profesional que puede costar entre $300 y $2,000.

El reto de la consistencia visual (generar múltiples imágenes de la misma persona, personaje o producto con características coherentes) ha sido históricamente el punto débil de los modelos generativos. Midjourney V7 introduce --cref para character reference (mantiene los rasgos de un personaje a través de múltiples generaciones) y --sref para style reference (mantiene el estilo visual de una imagen de referencia). Aunque no es perfectamente consistente para branding estricto, ofrece una base sólida que puede complementarse con edición posterior.

Los aspectos legales son cruciales para el uso profesional. El plan básico de Midjourney ($10/mes) no permite uso comercial para empresas con ingresos superiores a $1 millón anuales. Generar imágenes "al estilo de" artistas vivos es una zona gris legal en proceso de definición por los tribunales. Para proyectos con clientes grandes o marcas reconocidas, la recomendación es usar Adobe Firefly (entrenado con imágenes licenciadas) o incluir en el contrato con el cliente una cláusula que especifique el uso de IA generativa. La transparencia con los clientes sobre el uso de estas herramientas es tanto una práctica ética como una protección legal.`,
};

const tema7: TemaC10 = placeholder(7, "DALL-E 3 y Adobe Firefly para uso comercial", MOD2, 2);
const tema8: TemaC10 = placeholder(8, "Stable Diffusion local — control total sin costo", MOD2, 2);
const tema9: TemaC10 = placeholder(9, "Flujos de trabajo profesionales de imagen IA", MOD2, 2);
const tema10: TemaC10 = placeholder(10, "Fotografía de producto con IA para e-commerce Ecuador", MOD2, 2);

// ─── MÓDULO 3: Generación de Video con IA ───────────────────────────────────

const MOD3 = "Generación de Video con IA";

const tema11: TemaC10 = {
  id: 11,
  titulo: "Generación de video con IA — panorama 2026",
  modulo: MOD3,
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Generación de video con IA — Sora, Runway, Veo comparativa",
  videoDuracion: "~40 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "Generación de Video con IA — Panorama 2026\nC10. IA Generativa y Creatividad — Tema 11\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "El salto de imagen a video — por qué es diferente",
      contenido:
        "Generar una imagen: un momento congelado en el tiempo\nGenerar un video: consistencia entre frames, movimiento coherente, física plausible\n\nReto técnico adicional:\n• Coherencia temporal: los objetos deben moverse de forma creíble\n• Física: el agua, el fuego, la ropa se comportan 'bien'\n• Identidad: los personajes deben mantener sus rasgos frame a frame\n• Duración: de segundos a minutos (2026: máx 4 min con calidad)",
    },
    {
      titulo: "Sora — OpenAI",
      contenido:
        "Lanzado: diciembre 2023 (investigación) → 2024 (producción limitada)\nFortalezas: coherencia física excepcional, videos de hasta 1 minuto de alta calidad\nDebilidades: acceso limitado (solo ChatGPT Plus y Pro), velocidad de generación lenta\nPrecio: incluido en ChatGPT Plus/Pro ($20-$200/mes)\nCasos de uso: branded content, piezas cinematográficas cortas, demos de producto\nDisponibilidad Ecuador: acceso vía VPN o desde plan Plus directamente",
    },
    {
      titulo: "Runway Gen-3 Alpha",
      contenido:
        "La herramienta profesional estándar en producción creativa en 2026\nFortalezas: máximo control editorial, camera controls (zoom, pan, dolly), interpolación entre imágenes\nModos: Text to Video, Image to Video, Video to Video\nCamera controls: permite especificar movimiento de cámara preciso\nPrecio: $15/mes (125 créditos) → $35/mes (Unlimited con límites)\nMejor para: directores creativos que necesitan control total",
    },
    {
      titulo: "Veo 2 — Google DeepMind",
      contenido:
        "Lanzado: 2024, disponible en VideoFX (Google Labs) y YouTube\nFortalezas: calidad visual alta, prompts en lenguaje natural muy intuitivos, integración YouTube\nDebilidades: acceso limitado por lista de espera\nHerramientas relacionadas: Lumiere (investigación Google), imagen en videos largos\nIntegración YouTube: creadores con 10K+ suscriptores tienen acceso prioritario\nCasos de uso: YouTube Shorts, contenido de marca, demos",
    },
    {
      titulo: "Pika Labs y Kling AI",
      contenido:
        "Pika Labs:\n• Animación de imágenes estáticas ('bring image to life')\n• 3 segundos gratis por día\n• Precio: desde $8/mes\n• Ideal para: animar productos, logos, personajes\n\nKling AI (Kuaishou, China):\n• Calidad comparable a Sora, con mayor acceso\n• Generación hasta 2 minutos\n• Precio: créditos desde $0.08/segundo de video\n• Ideal para: video largo, contenido narrativo",
    },
    {
      titulo: "HeyGen — avatares y videos corporativos",
      contenido:
        "Uso específico: crear videos con portavoces de IA (avatares)\nFunciones clave:\n• Avatar de tu propia imagen + voz clonada = videos sin cámara ni estudio\n• Traducción de video con labial (lip-sync) sincronizado\n• Teleprompter IA + generación de script\nCaso Ecuador real: empresa con presencia LATAM traduce un video corporativo a 5 idiomas con lip-sync\nPrecio: $24/mes (plan Essential), $120/mes (Business con avatar personalizado)",
    },
    {
      titulo: "Casos de uso reales en Ecuador",
      contenido:
        "1. Agencia de turismo: videos de destinos ecuatorianos sin filmar (Galápagos, Amazonia, Sierra)\n2. Inmobiliaria: tours virtuales de proyectos en construcción\n3. E-commerce: videos de producto en 5 segundos (Runway Image to Video)\n4. Empresa exportadora: presentaciones de producto en inglés con avatar de HeyGen\n5. ITSEIA: clips para redes sociales de testimoniales de profesores IA\n\nROI típico: reemplaza producción de $500-$5,000 por $15-$120/mes.",
    },
    {
      titulo: "Limitaciones actuales del video IA",
      contenido:
        "Manos y texto: mismo problema que en imágenes, amplificado por el tiempo\nCoherencia de personajes: los rostros pueden cambiar entre escenas\nFísica: los líquidos y el fuego a veces se comportan de forma extraña\nLongitud: máximo 1-4 minutos con calidad aceptable en 2026\nVoz: el video no incluye audio en la mayoría de herramientas (hay que agregar en edición)\nDerechos: zona legal aún más compleja que imágenes",
    },
    {
      titulo: "Resumen del Tema 11",
      contenido:
        "1. La generación de video es más compleja que imagen por la coherencia temporal\n2. Sora (OpenAI): calidad cinematográfica, acceso limitado\n3. Runway Gen-3: control profesional, el estándar de la industria\n4. Veo (Google): integración YouTube, muy intuitivo\n5. HeyGen: videos corporativos con avatares, excelente ROI en LATAM\n\nPróximo: Runway Gen-3 — práctica con Text to Video e Image to Video",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es el principal reto técnico que hace la generación de video más compleja que la generación de imágenes?",
      opciones: [
        "Los videos requieren más memoria RAM",
        "La coherencia temporal: los objetos deben moverse de forma creíble y mantener consistencia entre frames",
        "Los videos solo funcionan en inglés",
        "El tamaño de archivo es mayor",
      ],
      respuesta: 1,
      explicacion:
        "La coherencia temporal es el mayor reto: generar cientos de frames donde los objetos, personajes y física del mundo se mantienen consistentes y se mueven de forma creíble. Esto es computacionalmente mucho más complejo que generar una imagen estática.",
    },
    {
      pregunta: "¿Qué herramienta es ideal para una empresa que quiere traducir su video corporativo a 5 idiomas con lip-sync sincronizado?",
      opciones: ["Runway Gen-3", "Pika Labs", "HeyGen", "Sora de OpenAI"],
      respuesta: 2,
      explicacion:
        "HeyGen es especialista en traducción de video con lip-sync sincronizado. Puede traducir el audio de un video y ajustar el movimiento labial del presentador para que coincida con el nuevo idioma, sin necesidad de volver a filmar.",
    },
    {
      pregunta: "¿Cuál herramienta de generación de video permite especificar movimientos de cámara específicos como zoom, pan y dolly?",
      opciones: ["Pika Labs", "Runway Gen-3 con Camera Controls", "Kling AI", "Veo de Google"],
      respuesta: 1,
      explicacion:
        "Runway Gen-3 Alpha incluye Camera Controls que permiten al director especificar el movimiento exacto de la cámara virtual: zoom in/out, pan left/right, dolly, tilt, orbit. Esto da un nivel de control profesional único en el mercado.",
    },
    {
      pregunta: "¿Qué plataforma ecuatoriana o de Ecuador tiene acceso prioritario a Veo de Google para generación de video?",
      opciones: [
        "Canales de YouTube con más de 10,000 suscriptores",
        "Empresas registradas en SUPERCIAS",
        "Usuarios con plan Google Workspace Enterprise",
        "Estudiantes universitarios con email .edu.ec",
      ],
      respuesta: 0,
      explicacion:
        "Google integró Veo con YouTube y ofrece acceso prioritario a creadores con más de 10,000 suscriptores a través de YouTube Studio. Esto lo convierte en una herramienta muy relevante para los youtubers y creadores de contenido ecuatorianos en crecimiento.",
    },
    {
      pregunta: "¿Cuál es el ROI típico de usar herramientas de generación de video IA en una agencia de marketing en Ecuador?",
      opciones: [
        "Sin ROI medible — la calidad no es suficiente",
        "Solo ahorra tiempo, no dinero",
        "Reemplaza producciones de $500-$5,000 por un costo de suscripción de $15-$120/mes",
        "Solo aplicable para empresas multinacionales",
      ],
      respuesta: 2,
      explicacion:
        "Una producción de video profesional (filmar, editar, post-producción) puede costar entre $500 y $5,000 o más en Ecuador. Las herramientas de IA como Runway o HeyGen cuestan entre $15 y $120 mensuales, generando un ROI muy alto desde el primer proyecto.",
    },
  ],
  ejercicio: {
    titulo: "Crear un video de producto con IA para una marca ecuatoriana",
    objetivo:
      "Producir un video corto de 5-15 segundos para un producto ecuatoriano usando Runway Gen-3 o Pika Labs, combinando generación de imagen IA + animación de video IA",
    herramientas: "Runway ML (runwayml.com) o Pika Labs (pika.art) + Leonardo AI o Midjourney + CapCut para edición final",
    datosEjemplo:
      "Producto: Chocolate artesanal 'CACAO FINO DE AROMA' de Manabí, Ecuador\nDescripción visual: tableta de chocolate sobre piedra volcánica, fondo verde selva, vapor de cacao, iluminación cálida\nConcepto del video: la tableta se desliza suavemente hacia cámara, gotas de cacao líquido caen sobre ella, texto aparece: 'Del campo manabita al mundo'\nDuración: 8-10 segundos",
    pasos: [
      "Paso 1 — Crear imagen base: usar Leonardo AI o Midjourney para generar la imagen de producto: 'artisan dark chocolate bar on volcanic stone, tropical green jungle background, steam, warm golden lighting, macro photography, --ar 16:9 --style raw --q 2'. Seleccionar la mejor.",
      "Paso 2 — Animar con Runway o Pika: subir la imagen a Runway Gen-3 (runwayml.com → Image to Video) o Pika (pika.art → New Pika). En Runway, escribir el prompt de movimiento: 'slow dolly forward, chocolate melts gently, warm steam rises, dramatic lighting'. En Pika: 'gentle camera push in, steam rising, chocolate glistening'",
      "Generar 3 variaciones del video (en Pika es gratuito con límite diario, en Runway usa los créditos del plan). Seleccionar la mejor variación.",
      "Paso 3 — Agregar audio con ElevenLabs: generar narración breve (opcional): 'Cacao Fino de Aroma. Del campo manabita al mundo.' Descargar el audio en MP3.",
      "Paso 4 — Edición final en CapCut (capcut.com — gratuito): subir el video, agregar el audio, añadir título con el nombre de la marca, ajustar música de fondo (buscar en librería gratuita de CapCut 'cacao chocolate ambient')",
      "Paso 5 — Exportar en dos formatos: 16:9 para YouTube/web, 9:16 para Instagram/TikTok Stories (usar crop en CapCut)",
      "Documentar en Google Docs: prompts usados en cada herramienta, iteraciones que no funcionaron y por qué, tiempo total del proceso, costo estimado si se hubiera producido de forma tradicional",
    ],
    resultado:
      "Video de 8-10 segundos profesional para CACAO FINO DE AROMA en dos formatos (16:9 y 9:16), con narración IA opcional, música de fondo y texto de marca. Documentación del proceso con prompts y análisis de ROI vs producción tradicional.",
    criterios: [
      { criterio: "Calidad visual del video final (imagen y movimiento coherentes)", puntos: 30 },
      { criterio: "Coherencia de marca (la estética refleja el producto y el público objetivo)", puntos: 20 },
      { criterio: "Edición final completa: audio, texto, música y ambos formatos", puntos: 20 },
      { criterio: "Documentación de prompts y proceso iterativo", puntos: 15 },
      { criterio: "Análisis de ROI comparado con producción tradicional", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Runway ML — Generación de video profesional",
      url: "https://runwayml.com",
      tipo: "herramienta",
      descripcion: "La herramienta de generación de video IA más utilizada en producción profesional. Gen-3 Alpha con camera controls. Plan de entrada $15/mes.",
    },
    {
      titulo: "Pika Labs — Animación de imágenes con IA",
      url: "https://pika.art",
      tipo: "herramienta",
      descripcion: "Herramienta accesible para animar imágenes estáticas y generar videos cortos. Créditos gratuitos diarios disponibles.",
    },
    {
      titulo: "HeyGen — Avatares y traducción de video",
      url: "https://heygen.com",
      tipo: "herramienta",
      descripcion: "Especialista en videos corporativos con avatares IA y traducción con lip-sync. Muy útil para empresas latinoamericanas con presencia regional.",
    },
    {
      titulo: "CapCut — Editor de video gratuito",
      url: "https://www.capcut.com",
      tipo: "herramienta",
      descripcion: "Editor de video gratuito multiplataforma (web, iOS, Android, Windows). Tiene herramientas IA integradas para edición, captions automáticos y más.",
    },
  ],
  teoria: `La generación de video con inteligencia artificial representa la frontera más activa de la IA generativa en 2026. Si la generación de imágenes fue la revolución de 2022-2023, la generación de video de calidad cinematográfica es la revolución de 2024-2026. El lanzamiento de Sora por OpenAI en diciembre de 2023 demostró que era posible generar videos de hasta 60 segundos con coherencia física y visual que superaba todo lo visto anteriormente, estableciendo un nuevo estándar para el campo.

La diferencia técnica fundamental entre generar una imagen y generar un video reside en la coherencia temporal. Una imagen es un punto en el tiempo: un único conjunto de píxeles que debe verse bien. Un video es una secuencia de cientos o miles de frames donde cada elemento debe mantener su identidad, moverse de forma física y visualmente coherente, y cambiar de manera creíble entre frames consecutivos. Los objetos no pueden aparecer y desaparecer entre frames, los rostros deben mantener sus rasgos, y la física del agua, fuego, ropa y cabello debe ser plausible.

El ecosistema de herramientas de generación de video se ha diversificado rápidamente. Sora de OpenAI (accesible vía ChatGPT Plus y Pro) ofrece la mayor calidad cinematográfica del mercado, con coherencia física excepcional y capacidad para generar hasta 60 segundos de video de alta resolución. Runway Gen-3 Alpha es el estándar de la industria para directores creativos profesionales, con su sistema de Camera Controls que permite especificar movimientos de cámara (zoom, pan, dolly, tilt, orbit) con precisión técnica. Veo 2 de Google DeepMind destaca por sus prompts en lenguaje natural muy intuitivos y su integración con el ecosistema YouTube.

Para el mercado ecuatoriano, las herramientas de generación de video tienen aplicaciones de ROI inmediato y medible. Una agencia de turismo puede generar clips cinematográficos de las Galápagos, la Amazonia, el Cotopaxi o el centro histórico de Quito sin necesidad de un equipo de producción de $5,000 por día. Una inmobiliaria puede crear tours virtuales de proyectos en construcción usando renders + Runway antes de construir. Una empresa exportadora puede crear videos de presentación de producto en múltiples idiomas con HeyGen sin necesidad de estudio ni actores.

HeyGen merece atención especial por su aplicación en el mercado corporativo latinoamericano. Esta plataforma permite crear avatares de IA basados en la imagen real de una persona (con 5 minutos de video de entrenamiento) y generar videos donde ese avatar habla cualquier texto en cualquier idioma con sincronización labial (lip-sync) perfecta. Esto permite a una empresa ecuatoriana crear una vez su presentación corporativa en español y con un clic generar versiones en inglés, portugués, chino o árabe con el mismo portavoz y la misma credibilidad. El costo por video: prácticamente cero después de la suscripción.

Las limitaciones actuales son reales y deben ser conocidas. La coherencia de personajes a través de escenas largas sigue siendo imperfecta: los rostros pueden cambiar ligeramente. El texto dentro de los videos (carteles, texto on-screen) es poco confiable. La generación de audio sincronizado con el video no está integrada en la mayoría de herramientas (debe agregarse en edición posterior). La duración máxima con calidad aceptable está en 1-4 minutos dependiendo de la herramienta. Y el marco legal para videos generados con IA (especialmente cuando incluyen personas, estilos de artistas o marcas) está en proceso de definición.

Para el profesional creativo ecuatoriano, el flujo de trabajo más efectivo en 2026 es: generar la imagen base con Midjourney o DALL-E, animar con Runway o Pika, agregar narración con ElevenLabs, agregar música de una librería libre de derechos, y editar en CapCut o Premiere. Este flujo puede producir un video de product placement de 30 segundos en 2-4 horas, comparado con 2-3 días de producción tradicional.`,
};

const tema12: TemaC10 = placeholder(12, "Runway Gen-3 práctica — Text to Video e Image to Video", MOD3, 3);
const tema13: TemaC10 = placeholder(13, "HeyGen — Avatares y videos corporativos con IA", MOD3, 3);
const tema14: TemaC10 = placeholder(14, "Flujo de trabajo completo: imagen + video + audio IA", MOD3, 3);
const tema15: TemaC10 = placeholder(15, "Video IA para redes sociales — TikTok, Reels, YouTube Shorts", MOD3, 3);

// ─── MÓDULO 4: Productos Creativos con IA ───────────────────────────────────

const MOD4 = "Productos Creativos con IA";

const tema16: TemaC10 = {
  id: 16,
  titulo: "De la idea al producto: metodología creativa con IA",
  modulo: MOD4,
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Crear productos digitales creativos con IA — metodología completa",
  videoDuracion: "~42 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "De la Idea al Producto: Metodología Creativa con IA\nC10. IA Generativa y Creatividad — Tema 16\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué es un producto creativo con IA?",
      contenido:
        "Un producto creativo con IA es cualquier entregable que:\n• Usa IA como herramienta principal de producción (no solo asistente)\n• Genera valor económico medible para el cliente\n• Sería costoso o imposible producir sin IA en el mismo tiempo y presupuesto\n\nEjemplos reales en Ecuador:\n• Pack de branding completo de una PyME ($500-$1,500 en 1-2 días)\n• Álbum de música ambiental para restaurant ($200-$500 sin músico)\n• Curso en video con instructor IA ($300-$800 por módulo)\n• Chatbot de atención al cliente con personalidad de marca ($2,000-$5,000)",
    },
    {
      titulo: "El framework IDEA → PROTOTIPO → PRODUCTO",
      contenido:
        "IDEA (1-2 horas):\n• Define el problema que resuelve\n• Identifica el cliente y su willingness to pay\n• ChatGPT: 'Valida esta idea: [idea]. ¿A quién le pagaría por esto en Ecuador?'\n\nPROTOTIPO (1 día):\n• Crea una versión mínima viable con las herramientas IA disponibles\n• Regla: debe ser vendible aunque no perfecto\n\nPRODUCTO (1 semana):\n• Itera según feedback del cliente\n• Profesionaliza con edición humana",
    },
    {
      titulo: "Tipos de productos creativos con IA más rentables",
      contenido:
        "1. Branding visual: logo + paleta + guía de marca ($500-$2,000 en 2 días)\n2. Contenido de redes: pack mensual de 30 posts + videos ($300-$800/mes)\n3. Videos corporativos: presentación de empresa 2-3 min ($500-$1,500)\n4. Podcasts/audiolibros: producción narrada con voz IA ($200-$1,000 por episodio/capítulo)\n5. Cursos online: slides + narración + quiz IA ($300-$1,500 por módulo)\n6. Chatbots personalizados: GPT configurado para un negocio ($1,500-$5,000)",
    },
    {
      titulo: "Stack de herramientas por producto",
      contenido:
        "Branding visual: Midjourney + Canva + ChatGPT (brief de marca)\nContenido redes: Midjourney/DALL-E + Suno AI + CapCut + ChatGPT (copy)\nVideos corporativos: HeyGen + Runway + ElevenLabs + CapCut\nPodcast/audiolibros: ElevenLabs (voz) + Suno AI (música) + Audacity (edición)\nCursos online: Gamma.app (slides) + ElevenLabs (narración) + Canva (gráficos)\nChatbots: ChatGPT Custom GPTs o Claude Projects",
    },
    {
      titulo: "Pricing de servicios creativos con IA en Ecuador",
      contenido:
        "Regla de pricing: cobra por el valor del entregable, no por las horas de IA\n\nDesign tradicional: $80-$150/hora\nContenido con IA: mismo precio o hasta 30% menos para entrar al mercado\n\nEjemplo real: pack de 30 posts para Instagram:\n• Antes (diseñador tradicional): $600/mes\n• Con IA: cobra $400-$500, tu margen sube al 70%\n• El cliente paga menos, tú ganas más\n\nError a evitar: revelar que uses IA antes de que el cliente vea la calidad.",
    },
    {
      titulo: "Portafolio creativo — cómo presentarlo",
      contenido:
        "Plataformas para portafolio creativo con IA:\n• Behance (behance.net): estándar de diseñadores, gratis\n• Adobe Portfolio: incluido en suscripción Adobe\n• Notion: portfolio moderno con caso de estudio detallado\n• LinkedIn: publicar los mejores proyectos como posts\n\nEstructura de cada proyecto:\n1. El problema del cliente\n2. Tu proceso + herramientas usadas\n3. El resultado visual\n4. El impacto medible (si lo tienes)\n\nTransparencia: indicar uso de IA genera confianza, no lo contrario.",
    },
    {
      titulo: "Caso real — Agencia creativa con IA en Quito",
      contenido:
        "Persona: diseñador freelance, Quito, 5 años de experiencia\nAntes (2022): 8 clientes/mes, $80/hora, $3,200/mes\nDespués (2024, con IA): 14 clientes/mes, $100/hora equivalente, $5,600/mes\n\n¿Cómo? Las herramientas IA redujeron el tiempo de producción de 3 días a 6 horas por proyecto. Pudo aceptar más clientes con la misma calidad.\n\nDetalle: igual tiempo total de trabajo. Pero 2x más proyectos = 2x más ingresos.",
    },
    {
      titulo: "Resumen del Tema 16",
      contenido:
        "1. Los productos creativos con IA tienen alta demanda y márgenes superiores al promedio\n2. Framework IDEA → PROTOTIPO → PRODUCTO: de la idea al entregable en 1 semana\n3. Los 6 tipos más rentables: branding, contenido, video, podcast, cursos, chatbots\n4. Pricing: cobra por valor entregado, no por horas de IA\n5. Transparencia sobre uso de IA genera confianza con clientes\n\nPróximo: Construir y vender tu primer producto creativo con IA",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la regla principal para hacer pricing de servicios creativos producidos con IA?",
      opciones: [
        "Cobrar solo las horas que tardó la IA en generar el contenido",
        "Cobrar siempre 50% menos que el precio de mercado tradicional",
        "Cobrar por el valor del entregable para el cliente, no por las horas de producción",
        "Cobrar según el costo de las suscripciones de las herramientas usadas",
      ],
      respuesta: 2,
      explicacion:
        "El valor de un diseño de logo, un video corporativo o un pack de contenido para el cliente no disminuye por el hecho de que se usó IA para producirlo. El pricing debe basarse en el valor que genera para el cliente, no en el tiempo de producción.",
    },
    {
      pregunta: "¿Qué herramienta es la recomendada para crear cursos online con narración IA?",
      opciones: [
        "Suno AI para la voz y Runway para los slides",
        "Gamma.app para slides + ElevenLabs para narración",
        "HeyGen para todo el contenido del curso",
        "CapCut exclusivamente",
      ],
      respuesta: 1,
      explicacion:
        "Gamma.app es excelente para generar presentaciones/slides automáticamente desde un prompt, y ElevenLabs genera narración de voz natural. La combinación permite producir un módulo de curso completo con slides + audio narrado en pocas horas.",
    },
    {
      pregunta: "En el caso del diseñador freelance de Quito, ¿cómo logró duplicar sus ingresos con IA?",
      opciones: [
        "Subió sus precios al doble",
        "Las herramientas IA redujeron el tiempo por proyecto de 3 días a 6 horas, permitiéndole aceptar 2x más clientes",
        "Cambió de freelance a empresa con empleados",
        "Vendió sus propios cursos sobre IA",
      ],
      respuesta: 1,
      explicacion:
        "El caso real muestra que la productividad es el motor del ingreso: mismo tiempo total de trabajo, pero al reducir de 3 días a 6 horas por proyecto, pudo completar el doble de proyectos por mes, duplicando ingresos de $3,200 a $5,600.",
    },
    {
      pregunta: "¿Cuál es el framework de 3 etapas para llevar un producto creativo de la idea al mercado?",
      opciones: [
        "Research → Diseño → Entrega",
        "IDEA → PROTOTIPO → PRODUCTO",
        "Brief → Producción → Facturación",
        "Análisis → Ejecución → Evaluación",
      ],
      respuesta: 1,
      explicacion:
        "El framework IDEA (1-2 horas: validación del concepto) → PROTOTIPO (1 día: versión mínima viable vendible) → PRODUCTO (1 semana: iteración y profesionalización) permite pasar de concepto a entregable comercial en tiempo récord.",
    },
    {
      pregunta: "¿Por qué se recomienda ser transparente sobre el uso de IA con los clientes creativos?",
      opciones: [
        "Es obligatorio por ley en Ecuador",
        "Los clientes pagan más cuando saben que se usa IA",
        "Genera confianza y diferencia positivamente al profesional que domina estas herramientas",
        "Solo para evitar problemas con derechos de autor",
      ],
      respuesta: 2,
      explicacion:
        "La transparencia sobre el uso de IA posiciona al profesional como alguien que domina las herramientas más modernas del mercado. En lugar de generar desconfianza, demuestra eficiencia, modernidad y capacidad de entregar más valor en menos tiempo.",
    },
  ],
  ejercicio: {
    titulo: "Crear y vender tu primer pack de contenido IA para una marca ecuatoriana",
    objetivo:
      "Producir un pack de contenido completo para redes sociales de una marca ecuatoriana real o ficticia usando el stack completo de herramientas IA, y preparar la propuesta de venta al cliente",
    herramientas: "ChatGPT + Midjourney/DALL-E + CapCut + ElevenLabs (opcional) + Canva + Google Docs",
    datosEjemplo:
      "Cliente ficticio: PACHAMAMA SPA — spa de bienestar en Quito, inspirado en medicina andina\nNecesidades: pack mensual para Instagram: 12 posts imagen + copy, 4 Reels cortos (7-15 segundos), 1 video de presentación del spa (30 segundos)\nTono: natural, sereno, místico, ecuatoriano\nPaleta: verdes, terracotas, dorados, blanco",
    pasos: [
      "Definir la estrategia de contenido con ChatGPT: 'Eres director de contenido para Pachamama SPA, Quito. Crea un plan de contenido para Instagram para noviembre que incluya: 12 temas para posts imagen, 4 conceptos para Reels cortos, 1 concepto para video de presentación 30 segundos. Considera el contexto ecuatoriano: Día de Difuntos (2 nov), inicio de temporada alta turística'",
      "Generar 12 imágenes base con Midjourney o DALL-E: usar los temas del plan de contenido. Documenta cada prompt.",
      "Escribir los 12 copies de posts con ChatGPT: 'Escribe el copy para Instagram del post [tema]. Máx 150 caracteres + 5 hashtags relevantes para spa en Ecuador. Tono: sereno, espiritual, natural.'",
      "Crear 2 de los 4 Reels con Pika Labs o CapCut: animar 2 de las imágenes con movimiento sutil (humo de incienso, agua, flores) + agregar música ambiental de librería gratuita",
      "Construir el video de presentación 30 segundos: estructura en 4 escenas (5-8 seg cada una). Generar escenas con Runway o animar imágenes base con Pika. Editar en CapCut con música y texto.",
      "Preparar el pack entregable: organizar todo en carpeta Google Drive (imágenes, copies en Doc, videos). Crear portada del pack en Canva.",
      "Redactar propuesta de venta en Google Docs: ¿qué incluye el pack? ¿cuál es el precio? ¿por qué este pack vale ese precio para el cliente? Incluir 2 opciones de precio: Pack Básico y Pack Completo.",
    ],
    resultado:
      "Pack de contenido completo para PACHAMAMA SPA: 12 imágenes con copies, 2 Reels cortos, 1 video de presentación, todo organizado en Google Drive, con propuesta de venta profesional en dos niveles de precio.",
    criterios: [
      { criterio: "Calidad y coherencia visual del pack (12 imágenes + 2 Reels + 1 video)", puntos: 30 },
      { criterio: "Copies de posts relevantes, con tono correcto y hashtags ecuatorianos", puntos: 20 },
      { criterio: "Organización profesional del entregable (carpeta + portada Canva)", puntos: 15 },
      { criterio: "Propuesta de venta con pricing justificado en dos niveles", puntos: 20 },
      { criterio: "Documentación de prompts y herramientas utilizadas", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Gamma.app — Presentaciones con IA",
      url: "https://gamma.app",
      tipo: "herramienta",
      descripcion: "Crea presentaciones, documentos y páginas web con IA a partir de un texto o prompt. Plan gratuito disponible. Exporta a PDF/PPTX.",
    },
    {
      titulo: "Suno AI — Música generativa",
      url: "https://suno.com",
      tipo: "herramienta",
      descripcion: "Genera canciones y música de fondo para proyectos creativos desde un prompt de texto. Plan gratuito con 50 canciones/día.",
    },
    {
      titulo: "ElevenLabs — Voz IA profesional",
      url: "https://elevenlabs.io",
      tipo: "herramienta",
      descripcion: "La mejor herramienta para síntesis de voz realista en español. Plan gratuito con 10,000 caracteres/mes.",
    },
    {
      titulo: "Behance — Portafolio creativo",
      url: "https://www.behance.net",
      tipo: "herramienta",
      descripcion: "Plataforma de Adobe para portafolios creativos profesionales. Gratuito y muy usado por clientes para buscar diseñadores freelance.",
    },
    {
      titulo: "CapCut — Edición de video gratuita",
      url: "https://www.capcut.com",
      tipo: "herramienta",
      descripcion: "Editor de video gratuito con herramientas IA integradas: captions automáticos, eliminación de fondo, generación de clips. Disponible en web y móvil.",
    },
  ],
  teoria: `La convergencia de múltiples herramientas de IA generativa ha creado una nueva categoría de servicios creativos que no existía hace tres años: productos completamente generados por IA con dirección humana. Un profesional creativo que domina el stack de herramientas actual — ChatGPT para estrategia y copy, Midjourney para imagen, Runway/Pika para video, ElevenLabs para voz, Suno para música — puede producir en un día lo que antes requería un equipo de cinco personas durante una semana.

Este cambio tiene implicaciones profundas para el mercado creativo ecuatoriano. Los diseñadores freelance de Quito y Guayaquil que han adoptado estas herramientas han incrementado sus ingresos mensuales entre un 50% y un 100%, no subiendo precios sino completando el doble de proyectos en el mismo tiempo. Las agencias pequeñas pueden competir con agencias grandes en velocidad de producción y diversidad de entregables.

El framework IDEA → PROTOTIPO → PRODUCTO es la metodología más efectiva para monetizar estas capacidades. La fase de IDEA (1-2 horas) se centra en definir el problema del cliente y validar que existe disposición de pago. ChatGPT es ideal aquí: con el perfil del cliente y la descripción del proyecto, puede analizar si la idea tiene mercado, quiénes son los competidores y cuáles son los diferenciadores. La fase de PROTOTIPO (1 día) produce una versión mínima viable: no perfecta, pero vendible. La versión inicial de un branding puede no tener todos los touchpoints, pero si el logo y la paleta están bien, el cliente puede verlo y decidir. La fase de PRODUCTO (1 semana) itera con el feedback del cliente y profesionaliza con edición humana.

Los seis tipos de productos creativos con IA de mayor rentabilidad para el mercado ecuatoriano son: branding visual completo (logo, paleta, guía de marca, mockups), packs de contenido para redes sociales (imágenes + copies + videos), videos corporativos (presentación de empresa, producto o servicio), producción de podcast o audiolibros (narración IA + música), cursos online (slides + narración + quiz), y chatbots personalizados (GPT o Claude configurado para atención al cliente o ventas de un negocio específico).

El pricing de estos servicios requiere un cambio de mentalidad: de cobrar por hora a cobrar por valor. Un branding visual completo generado en 2 días con IA puede venderse a $1,500 — el mismo precio que cobraba un diseñador que tardaba 2 semanas. El cliente obtiene la misma calidad en menos tiempo. El profesional obtiene el mismo ingreso total con mayor margen de ganancia. Esta es la ecuación ganadora del mercado creativo con IA.

La transparencia sobre el uso de IA con los clientes es tanto una práctica ética como una ventaja competitiva. El profesional que puede decir "usé estas 5 herramientas de IA para producir este proyecto en 2 días en lugar de 2 semanas" se posiciona como un experto en productividad creativa — una habilidad cada vez más valorada. Los clientes más sofisticados ya preguntan activamente qué herramientas usa el creativo; aquellos que usan IA y pueden explicar el proceso con claridad ganan más confianza, no menos.

Para el mercado ecuatoriano específicamente, el contexto cultural es importante. Las marcas ecuatorianas tienen una identidad visual rica en elementos indígenas, naturales y andinos que los modelos de IA generativa pueden reproducir efectivamente cuando se dan los prompts correctos. Referir en los prompts a elementos específicos — ruanas, tejidos otavaleños, flores de la Sierra, cacao de la Costa, madera del Oriente — permite generar contenido auténticamente ecuatoriano que resuena con la audiencia local y diferencia el trabajo en el mercado internacional.`,
};

const tema17: TemaC10 = placeholder(17, "Branding completo con IA — logo, guía y mockups", MOD4, 4);
const tema18: TemaC10 = placeholder(18, "Contenido de redes sociales escalable con IA", MOD4, 4);
const tema19: TemaC10 = placeholder(19, "Cursos y e-learning generados con IA", MOD4, 4);
const tema20: TemaC10 = placeholder(20, "Construye y vende tu primer producto creativo con IA", MOD4, 4);

export const C10_TEMAS: TemaC10[] = [
  tema1, tema2, tema3, tema4, tema5,
  tema6, tema7, tema8, tema9, tema10,
  tema11, tema12, tema13, tema14, tema15,
  tema16, tema17, tema18, tema19, tema20,
];
