// ITSEIA IGNITE v1 — contenido hardcoded para el demo del preuniversitario.
// 4 semanas, 20 días. En el demo sólo están activos los Días 1, 2 y 3.

export type IgniteSession = {
  number: number;
  title: string;
  description: string;
  durationMinutes: number;
  status: "available" | "locked";
  videoEmbed?: string;
  tools: { name: string; emoji: string; desc: string }[];
  emotionalGoal: string;
  technicalGoal: string;
  agenda: { time: string; title: string; description: string }[];
  assignment: string;
  deliverable: string;
};

export type IgniteSubject = {
  slug: string;
  name: string;
  description: string;
  sessions: IgniteSession[];
};

export type IgniteWeek = {
  number: 1 | 2 | 3 | 4;
  name: string;
  tagline: string;
  subjects: IgniteSubject[];
};

export const IGNITE_WEEKS: IgniteWeek[] = [
  {
    number: 1,
    name: "Ignición",
    tagline: "Creación visual, de audio y video con IA generativa",
    subjects: [
      {
        slug: "creacion-generativa",
        name: "Creación generativa",
        description: "Imagen, audio y video desde texto — tus primeras obras con IA.",
        sessions: [
          {
            number: 1,
            title: "Hoy hago una IA que habla como yo",
            description: "Tu primer día. Generas una canción con tu voz, imágenes con tu estilo, y una app que responde como tú.",
            durationMinutes: 120,
            status: "available",
            videoEmbed: "https://www.youtube.com/embed/sGuPsEOznug",
            tools: [
              { name: "Suno AI", emoji: "🎵", desc: "Genera canciones completas desde texto. Letra, melodía, voz e instrumentación en 30 segundos." },
              { name: "Midjourney v7", emoji: "🎨", desc: "El mejor modelo de imagen por IA. Resultado cinematográfico desde un prompt en español." },
              { name: "Lovable", emoji: "💛", desc: "Apps web funcionales desde una descripción. Sin código, listas en 2 minutos." },
            ],
            emotionalGoal: "Hoy comprendes que la IA no reemplaza tu creatividad — la amplifica 100x. Sales del Día 1 con 3 activos reales que puedes compartir.",
            technicalGoal: "Entender los 3 pilares: generación de audio, generación de imagen y generación de interfaces. Dominio básico de prompting.",
            agenda: [
              { time: "0:00 - 0:15", title: "Bienvenida + filosofía IGNITE", description: "Por qué este programa es distinto. Tu compromiso, nuestro compromiso." },
              { time: "0:15 - 0:40", title: "Suno — tu primera canción", description: "Subes una idea, sale una canción con tu voz. Aprendes prompting para audio." },
              { time: "0:40 - 1:10", title: "Midjourney — tu primer retrato IA", description: "Prompts efectivos, aspect ratios, estilos. Generas 4 imágenes propias." },
              { time: "1:10 - 1:45", title: "Lovable — tu primera app funcional", description: "Construyes una app real en vivo. Se publica y queda online." },
              { time: "1:45 - 2:00", title: "Showcase + cierre", description: "Compartes lo que hiciste. Vemos el top 3 del día." },
            ],
            assignment: "Crea un post en Instagram o TikTok que combine: (a) canción con Suno sobre tu historia, (b) 3 imágenes de Midjourney como visual, (c) app Lovable en el perfil como 'link bio'. Tag #ITSEIAIgnite #Dia1.",
            deliverable: "Reel/Post publicado con el tag. Subes el link en el foro de tu cohorte.",
          },
          {
            number: 2,
            title: "Mi voz habla 5 idiomas",
            description: "Clonas tu voz en 30 segundos, la haces hablar japonés, chino y árabe, y generas un avatar tuyo presentando.",
            durationMinutes: 120,
            status: "available",
            tools: [
              { name: "ElevenLabs v3", emoji: "🔊", desc: "Clonación de voz con 30 segundos de audio. Genera audios en cualquier idioma con tu voz." },
              { name: "HeyGen", emoji: "🎬", desc: "Avatar AI con tu cara y voz. Presenta contenido en múltiples idiomas con labios sincronizados." },
              { name: "Gemini / DeepL", emoji: "🌐", desc: "Traducción de alta calidad. Matices culturales, no traducción literal." },
            ],
            emotionalGoal: "Las barreras de idioma desaparecen. Tu mensaje puede llegar a 5.000 millones de personas.",
            technicalGoal: "Clonación de voz + traducción + generación de avatar sincronizado. Entender cómo TTS conecta con avatares.",
            agenda: [
              { time: "0:00 - 0:15", title: "Recap Día 1 + top 3 cohorte", description: "Revisamos los mejores proyectos del Día 1. Aprendemos de los aciertos." },
              { time: "0:15 - 0:40", title: "ElevenLabs — clona tu voz", description: "Grabas 30 segundos hablando. En 2 minutos tu voz habla japonés, mandarín, árabe, alemán y francés." },
              { time: "0:40 - 1:15", title: "HeyGen — tu avatar presentador", description: "Avatar con tu cara habla esos 5 idiomas con labios sincronizados. Uso para presentaciones profesionales." },
              { time: "1:15 - 1:30", title: "Competencia cohorte", description: "Mejor 'yo hablando idiomas' se lleva puntos XP. Todos votan." },
              { time: "1:30 - 2:00", title: "Cómo funciona por detrás", description: "Explicación técnica básica: encoding de voz, transformers multilingües, cloning con pocas muestras." },
            ],
            assignment: "Crea un video de 1 minuto en TikTok/IG donde tu avatar se presenta a un familiar imaginario o real en un idioma que nunca has hablado. El mensaje debe ser emocional y real.",
            deliverable: "Video de 1 minuto con tu avatar hablando en otro idioma. Tag #Dia2 #ITSEIAIgnite en TikTok o Instagram.",
          },
          {
            number: 3,
            title: "Animé mi foto del colegio",
            description: "Transformas una foto en video cinematográfico de 10 segundos con movimiento realista. La IA genera física, luces y cámara.",
            durationMinutes: 120,
            status: "available",
            videoEmbed: "https://www.youtube.com/embed/c79-Q4jH__o",
            tools: [
              { name: "Kling AI 3.0", emoji: "🎥", desc: "El mejor modelo image-to-video ahora mismo. 10 segundos a 30fps con física consistente." },
              { name: "Runway Gen-4", emoji: "🎬", desc: "Video desde texto con control cinematográfico. Cambia cámara, luz, estilo." },
              { name: "Pika Labs", emoji: "✨", desc: "Efectos visuales especiales: explosiones, transformaciones, morphing." },
            ],
            emotionalGoal: "Los recuerdos se vuelven cine. Transformas el pasado en algo que parece producción profesional.",
            technicalGoal: "Imagen → video con IA. Entender modelos de difusión para video (Kling, Runway, Pika) y sus diferencias.",
            agenda: [
              { time: "0:00 - 0:15", title: "Los mejores videos IA virales 2026", description: "Vemos ejemplos brillantes que rompieron internet este año. Inspiración para tu proyecto." },
              { time: "0:15 - 0:45", title: "Kling 3.0 — tu foto se mueve", description: "Subes una foto (tuya, familiar, del colegio). Describes qué quieres que pase. En 2 minutos tienes un video de 10 seg con movimiento realista." },
              { time: "0:45 - 1:15", title: "Runway Gen-4 — escena cinematográfica", description: "Generas una escena completa desde texto. Control de plano, iluminación, lente. Nivel producción indie." },
              { time: "1:15 - 1:30", title: "Showcase cohorte", description: "Presentas tu mejor escena. Los compañeros dan feedback y votan los top 3 del día." },
              { time: "1:30 - 2:00", title: "Trucos avanzados + reel en 3 min", description: "Cómo hacer un reel viral en 3 minutos usando IA. Técnicas de editing con CapCut + Pika." },
            ],
            assignment: "Crea un video de 30 segundos titulado 'Mi vida en cine IA'. Mezcla al menos 3 escenas: una foto tuya animada, una escena generada desde texto, y un efecto especial con Pika.",
            deliverable: "Reel Instagram o TikTok de 30 segundos con los 3 tipos de escenas. Comparte el link en el foro del día.",
          },
          {
            number: 4,
            title: "Mi primer agente autónomo",
            description: "Construyes un agente que responde por ti — escribe emails, agenda citas, resume reuniones. Tu primera automatización real.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Claude Projects", emoji: "🤖", desc: "Agentes con memoria y herramientas. Entiende contexto y ejecuta tareas complejas." },
              { name: "GPT-5 + Custom GPTs", emoji: "⚡", desc: "Crea tu propio asistente especializado con instrucciones y conocimiento cargado." },
              { name: "Notion AI", emoji: "📝", desc: "Agente productivo conectado a tu workspace. Resume, escribe, organiza." },
            ],
            emotionalGoal: "Descubres que puedes clonar tu forma de trabajar. El agente libera tu tiempo para lo importante.",
            technicalGoal: "Fundamentos de agentes IA: system prompt, tools, memoria. Diseño de flujos de decisión.",
            agenda: [
              { time: "0:00 - 0:20", title: "Qué es un agente IA (vs un chatbot)", description: "Diferencia clave: agentes ejecutan acciones, no sólo responden." },
              { time: "0:20 - 1:00", title: "Crea tu primer Custom GPT", description: "System prompt, knowledge base, tools. Tu asistente personal." },
              { time: "1:00 - 1:30", title: "Claude Projects — agente con memoria", description: "Projects con archivos, instrucciones, estilo de respuesta." },
              { time: "1:30 - 2:00", title: "Conecta tu agente a tu flujo real", description: "Integra con Notion, Gmail, calendario. El agente empieza a trabajar por ti." },
            ],
            assignment: "Diseña un agente IA que resuelva UN problema real de tu día a día (ej: resume clases, responde preguntas de mamá sobre tecnología, prepara resúmenes de noticias).",
            deliverable: "Custom GPT o Claude Project publicado. Comparte el link en el foro.",
          },
          {
            number: 5,
            title: "Showcase Semana 1 · Cierre de Ignición",
            description: "Presentas los 4 activos de la semana ante tu cohorte. Votación colaborativa y feedback de Héctor.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Figma + Canva", emoji: "🎨", desc: "Presenta profesionalmente lo que hiciste. Portafolio visual." },
              { name: "Lovable", emoji: "💛", desc: "Publicas tu portafolio como landing página online." },
            ],
            emotionalGoal: "Entiendes que la semana no fue 'cursos sueltos' — fue una transformación. Ya eres otro ser humano.",
            technicalGoal: "Curar, seleccionar y presentar trabajo IA. Storytelling visual y técnico.",
            agenda: [
              { time: "0:00 - 0:15", title: "Filosofía del cierre", description: "Por qué presentar tu trabajo es clave desde el Día 5." },
              { time: "0:15 - 1:30", title: "Cada estudiante presenta 2 minutos", description: "2 minutos por persona. Disciplina radical. Todos presentan, todos votan." },
              { time: "1:30 - 2:00", title: "Feedback Héctor + top 5 cohorte", description: "Lecciones, reconocimientos, ajustes para la Semana 2." },
            ],
            assignment: "Presentación de 2 minutos con los 4 activos de la Semana 1. Video + imágenes + audio + app.",
            deliverable: "Video de tu presentación grabado. Se sube al canal de YouTube privado de la cohorte.",
          },
        ],
      },
    ],
  },
  {
    number: 2,
    name: "Construcción",
    tagline: "De consumidor a creador: apps web funcionales sin código",
    subjects: [
      {
        slug: "apps-sin-codigo",
        name: "Apps sin código + Bases de datos",
        description: "Lovable, Bolt, v0, Supabase. Construyes apps reales en producción.",
        sessions: [
          { number: 6, title: "Lovable nivel pro", description: "Apps multi-pantalla con lógica, autenticación y diseño profesional.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
          { number: 7, title: "Bolt + v0 — interfaces profesionales", description: "Componentes React generados por IA. Diseño nivel Stripe.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
          { number: 8, title: "Supabase — datos reales en tu app", description: "Base de datos, autenticación, storage. Tu app ya no es un prototipo.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
          { number: 9, title: "Cursor IDE — programar con IA a tu lado", description: "El editor que predice tu siguiente línea de código. Tu copiloto.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
          { number: 10, title: "Demo interno Semana 2", description: "Cada estudiante presenta una app en producción con dominio propio.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
        ],
      },
    ],
  },
  {
    number: 3,
    name: "Automatización",
    tagline: "Agentes IA, automatizaciones y protocolos modernos",
    subjects: [
      {
        slug: "agentes-automatizacion",
        name: "Agentes + Automatizaciones",
        description: "n8n, Zapier, Claude agents, MCP. Tus procesos corren solos.",
        sessions: [
          { number: 11, title: "n8n — automatiza todo tu día", description: "Flujos conectados: email → sheets → notificación en WhatsApp.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
          { number: 12, title: "Zapier + APIs — conectas apps", description: "Integrar cualquier app con cualquier otra. Tu ecosistema personal.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
          { number: 13, title: "Claude Agents — tu segundo cerebro", description: "Agentes con tool use y memoria persistente. IA que ejecuta.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
          { number: 14, title: "MCP — Claude con herramientas custom", description: "Model Context Protocol: cómo dar acceso a tus propias APIs.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
          { number: 15, title: "Proyecto medio — un flujo que te ahorra horas", description: "Diseñas, construyes y lanzas una automatización que usas en tu vida.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
        ],
      },
    ],
  },
  {
    number: 4,
    name: "Lanzamiento",
    tagline: "Demo Day: presentas tu proyecto ante familia y medios ITSEIA",
    subjects: [
      {
        slug: "demo-day",
        name: "Lanzamiento público",
        description: "Pitch, landing, redes sociales y presentación final en vivo.",
        sessions: [
          { number: 16, title: "Pitch — cómo vender tu idea en 3 minutos", description: "Estructura de pitch efectivo. Storytelling para productos digitales.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
          { number: 17, title: "Landing page que convierte", description: "Hero, CTAs, prueba social. Desde Lovable o v0.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
          { number: 18, title: "Instagram + TikTok deploy", description: "Publicas el proyecto en redes. Primeros usuarios reales.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
          { number: 19, title: "Rehearsal — ensayo general", description: "Presentas a los compañeros. Ajustes finales antes del Demo Day.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
          { number: 20, title: "DEMO DAY", description: "Presentas en vivo ante tu familia, Héctor Velasco y medios ITSEIA. Este es el día.", durationMinutes: 120, status: "locked", tools: [], emotionalGoal: "", technicalGoal: "", agenda: [], assignment: "", deliverable: "" },
        ],
      },
    ],
  },
];

export function getWeek(n: 1 | 2 | 3 | 4): IgniteWeek {
  const w = IGNITE_WEEKS.find((x) => x.number === n);
  if (!w) throw new Error(`Semana ${n} no encontrada`);
  return w;
}

export function getSessionByNumber(n: number): IgniteSession | null {
  for (const week of IGNITE_WEEKS) {
    for (const subject of week.subjects) {
      for (const session of subject.sessions) {
        if (session.number === n) return session;
      }
    }
  }
  return null;
}

export function getWeekNumberForSession(n: number): 1 | 2 | 3 | 4 {
  for (const week of IGNITE_WEEKS) {
    for (const subject of week.subjects) {
      for (const session of subject.sessions) {
        if (session.number === n) return week.number;
      }
    }
  }
  return 1;
}

export function getTotalSessions(): number {
  return IGNITE_WEEKS.reduce((acc, w) => {
    return (
      acc +
      w.subjects.reduce((a, s) => a + s.sessions.length, 0)
    );
  }, 0);
}
