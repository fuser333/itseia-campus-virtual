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
    tagline: "Apps sin código: Bubble, Glide, Softr, Zapier UI, Make",
    subjects: [
      {
        slug: "apps-sin-codigo",
        name: "Apps sin código",
        description: "Construyes apps web y móviles funcionales con Bubble, Glide, Softr, Zapier Interfaces y Make. Sin escribir código.",
        sessions: [
          {
            number: 6,
            title: "Bubble — tu primera app web sin código",
            description: "Diseño visual, lógica de negocio y base de datos en una sola plataforma. Construyes una app web real publicada en internet.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Diseñar UI", emoji: "🎨", desc: "Editor visual drag-and-drop con responsive nativo. Mismo nivel que Figma." },
              { name: "Lógica de workflows", emoji: "⚙️", desc: "Eventos, condiciones, acciones encadenadas. Lógica compleja sin código." },
              { name: "Base de datos visual", emoji: "🗄️", desc: "Diseñas tablas y relaciones con clicks. Datos persistentes desde el Día 1." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
          {
            number: 7,
            title: "Glide — apps móviles desde una hoja de cálculo",
            description: "Convierte un Google Sheet en una app móvil profesional en minutos. Ideal para directorios, catálogos y comunidades.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Sheet → App", emoji: "📱", desc: "Conectas un Google Sheet y Glide genera la app móvil completa al instante." },
              { name: "Componentes nativos", emoji: "🧩", desc: "Listas, formularios, mapas, chats. Bloques listos para usar." },
              { name: "Publicación instantánea", emoji: "🚀", desc: "Publicas en iOS y Android sin pasar por App Store ni Play Store." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
          {
            number: 8,
            title: "Softr — portales y membership sites",
            description: "Construyes un portal de clientes, un directorio o una membresía sobre Airtable. La capa de presentación lista en horas.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Sobre Airtable", emoji: "🧱", desc: "Conexión nativa con tu base Airtable. Los datos viven donde ya los tienes." },
              { name: "Áreas de miembros", emoji: "🔐", desc: "Login, roles, contenido restringido. Membresía profesional sin código." },
              { name: "Bloques pre-armados", emoji: "📦", desc: "Headers, hero, listados, formularios. Diseño profesional out-of-the-box." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
          {
            number: 9,
            title: "Zapier Interfaces — formularios e interfaces conectadas",
            description: "Diseñas interfaces que disparan automatizaciones de Zapier. Formularios, dashboards y portales conectados a tu stack.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Interfaces builder", emoji: "🖥️", desc: "Constructor visual de páginas conectadas con tus Zaps existentes." },
              { name: "Formularios inteligentes", emoji: "📝", desc: "Captura de leads que dispara workflows: CRM, email, Slack, todo a la vez." },
              { name: "Tablas Zapier", emoji: "📊", desc: "Base de datos integrada que se sincroniza con todas tus automatizaciones." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
          {
            number: 10,
            title: "Make — escenarios visuales avanzados",
            description: "Make (antes Integromat) te permite construir escenarios visuales complejos con bifurcaciones, loops y manejo de errores.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Editor visual", emoji: "🎯", desc: "Lienzo donde arrastras módulos y conectas APIs visualmente." },
              { name: "Routers y filtros", emoji: "🔀", desc: "Bifurcaciones lógicas, condiciones y manejo de errores como un programador senior." },
              { name: "1500+ apps", emoji: "🌐", desc: "Conexiones nativas con casi cualquier herramienta SaaS del mercado." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
        ],
      },
    ],
  },
  {
    number: 3,
    name: "Automatización",
    tagline: "Zapier, Make, IA + automation, agentes IA y RPA",
    subjects: [
      {
        slug: "automatizacion-agentes",
        name: "Automatización + Agentes IA",
        description: "Construyes flujos que corren solos: Zapier, Make, IA generativa dentro de tus automatizaciones, agentes autónomos y RPA.",
        sessions: [
          {
            number: 11,
            title: "Zapier flows — conecta toda tu vida digital",
            description: "Diseñas Zaps de varios pasos con triggers, filtros y formatos. Tu primer flujo que ahorra horas reales por semana.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Triggers y acciones", emoji: "⚡", desc: "Eventos disparan acciones en cadena: email → CRM → Slack → Sheets." },
              { name: "Paths y filtros", emoji: "🛤️", desc: "Lógica condicional para que el Zap reaccione distinto según los datos." },
              { name: "Formateadores", emoji: "🧰", desc: "Transformas texto, fechas y números antes de enviarlos al siguiente paso." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
          {
            number: 12,
            title: "Make scenarios — automatización de nivel profesional",
            description: "Diseñas escenarios complejos en Make: iteradores, agregadores, manejo de errores y ejecución programada.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Iteradores y agregadores", emoji: "🔁", desc: "Procesas listas y arreglos. Cada item pasa por su propio sub-flujo." },
              { name: "Webhooks", emoji: "🔗", desc: "Recibes datos en tiempo real desde cualquier sistema externo." },
              { name: "Programación", emoji: "⏰", desc: "Escenarios que corren cada hora, cada día o bajo demanda." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
          {
            number: 13,
            title: "IA + Automation — Claude y GPT dentro de tus flujos",
            description: "Inyectas inteligencia generativa en cada Zap o escenario: clasificación automática, redacción de respuestas, resúmenes en vivo.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "OpenAI en Zapier", emoji: "🧠", desc: "Pasos de GPT-5 que clasifican, redactan o resumen dentro del flujo." },
              { name: "Anthropic en Make", emoji: "✨", desc: "Claude integrado a tus escenarios para análisis y razonamiento avanzado." },
              { name: "Prompt engineering", emoji: "🎯", desc: "Diseñas prompts robustos pensados para automatización (no chat humano)." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
          {
            number: 14,
            title: "Agentes IA — Claude Agents y Custom GPTs en producción",
            description: "Construyes agentes con memoria, herramientas y objetivos. Tu primer agente autónomo que toma decisiones y ejecuta acciones reales.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Claude Agents", emoji: "🤖", desc: "Agentes con tool use, memoria persistente y razonamiento extendido." },
              { name: "Custom GPTs", emoji: "🛠️", desc: "Asistentes especializados con instrucciones, base de conocimiento y acciones." },
              { name: "Diseño de agentes", emoji: "🎛️", desc: "Cómo definir objetivos, límites y herramientas para que el agente sea útil." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
          {
            number: 15,
            title: "RPA — bots que usan tu computadora por ti",
            description: "Robotic Process Automation: bots que abren ventanas, llenan formularios y manejan apps de escritorio. Para tareas que las APIs no cubren.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "UiPath y Power Automate", emoji: "🪄", desc: "Las dos plataformas líderes de RPA. Grabas un proceso y se ejecuta solo." },
              { name: "Web automation", emoji: "🕷️", desc: "Navegadores controlados que llenan, extraen y publican datos en sitios web." },
              { name: "RPA + IA", emoji: "🧬", desc: "Combinas bots tradicionales con visión por computadora y LLMs para casos complejos." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
        ],
      },
    ],
  },
  {
    number: 4,
    name: "Lanzamiento",
    tagline: "Pricing, marketing, distribución, métricas y escalado",
    subjects: [
      {
        slug: "lanzamiento",
        name: "Lanzamiento público",
        description: "Lanzas tu proyecto al mundo: definición de precio, plan de marketing, canales de distribución, KPIs y estrategia de escalado.",
        sessions: [
          {
            number: 16,
            title: "Pricing — cómo le pones precio a tu proyecto",
            description: "Modelos de precio (freemium, suscripción, one-time, valor), psicología de pricing y cómo evitar dejar dinero sobre la mesa.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Modelos de pricing", emoji: "💵", desc: "Freemium, suscripción mensual/anual, pago único, pricing por uso." },
              { name: "Anclas y bundling", emoji: "🎁", desc: "Tres planes, plan ancla, descuento anual. Las palancas psicológicas que funcionan." },
              { name: "Pricing por valor", emoji: "📈", desc: "Cómo cobrar por el resultado y no por el tiempo. La diferencia entre 10x y 100x." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
          {
            number: 17,
            title: "Marketing — landing, copy y prueba social",
            description: "Construyes la landing que convierte: hero, propuesta de valor, copy persuasivo, testimonios y CTA claros.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Estructura de landing", emoji: "🏠", desc: "Hero, problema, solución, prueba social, FAQ, CTA. La arquitectura que convierte." },
              { name: "Copywriting", emoji: "✍️", desc: "Frameworks PAS, AIDA y JTBD aplicados a productos digitales reales." },
              { name: "Pruebas sociales", emoji: "🌟", desc: "Cómo conseguir y mostrar tus primeros 10 testimonios cuando aún no tienes usuarios." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
          {
            number: 18,
            title: "Distribución — TikTok, Instagram, Reddit y comunidades",
            description: "Diseñas un plan de distribución multicanal. Dónde están tus primeros 100 usuarios y cómo llegarles sin pagar publicidad.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Canales orgánicos", emoji: "📣", desc: "TikTok, Reels, Shorts, Twitter/X, LinkedIn. Ritmo y formato por canal." },
              { name: "Comunidades", emoji: "👥", desc: "Reddit, Discord, Slack, foros de nicho. Cómo aportar antes de pedir." },
              { name: "Lanzamiento Product Hunt", emoji: "🦄", desc: "Cómo planificar un launch en Product Hunt y aprovechar el tráfico." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
          {
            number: 19,
            title: "Métricas — KPIs y analítica desde el Día 1",
            description: "Defines qué medir, cómo medirlo y cómo tomar decisiones con datos. Funnel de conversión, retención y north-star metric.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "North-star metric", emoji: "⭐", desc: "La única métrica que importa. Cómo elegirla para tu producto." },
              { name: "Funnel de conversión", emoji: "🔻", desc: "Visitas → registros → activación → retención → ingresos. Mides cada paso." },
              { name: "Plausible y PostHog", emoji: "📊", desc: "Analytics privacy-first y product analytics. Setup completo en 30 minutos." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
          {
            number: 20,
            title: "Escalado + DEMO DAY",
            description: "Estrategia de escalado para los primeros 1.000 usuarios y presentación final en vivo ante familia, Héctor Velasco y medios ITSEIA.",
            durationMinutes: 120,
            status: "locked",
            tools: [
              { name: "Plan de escalado", emoji: "🚀", desc: "Qué automatizar, qué tercerizar y cuándo contratar a tu primera persona." },
              { name: "Pitch de 3 minutos", emoji: "🎤", desc: "Estructura ganadora: problema, solución, tracción, equipo, ask." },
              { name: "Demo Day en vivo", emoji: "🏆", desc: "Presentación final ante familia, Héctor Velasco, prensa y medios ITSEIA." },
            ],
            emotionalGoal: "🔒 Disponible en la cohorte completa de IGNITE — Regístrate en itseia.ai/preuni-info para acceder al programa de 4 semanas.",
            technicalGoal: "",
            agenda: [],
            assignment: "",
            deliverable: "",
          },
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
