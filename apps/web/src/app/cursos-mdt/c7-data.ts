// ─── C7: Marketing Digital con IA — Datos de 16 temas ────────────────────────
// Curso C7 del programa MDT. 16 temas (scaffolding).
// Módulo 1: Estrategia de marketing con IA
// Módulo 2: Contenido generativo (texto, imagen, video)
// Módulo 3: Pixels + IA predictiva en Meta/TikTok Ads
// Módulo 4: Optimización de campañas con ML

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

export interface TemaC7 {
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

export const C7_MODULOS = [
  { num: 1, nombre: "Estrategia de Marketing con IA", horas: 15, temas: 4 },
  { num: 2, nombre: "Contenido Generativo (Texto, Imagen, Video)", horas: 15, temas: 4 },
  { num: 3, nombre: "Pixels + IA Predictiva en Meta/TikTok Ads", horas: 15, temas: 4 },
  { num: 4, nombre: "Optimización de Campañas con ML", horas: 15, temas: 4 },
];

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC7 => ({
  id,
  titulo,
  modulo,
  moduloNum,
  videoEmbed: "",
  videoTitulo: titulo,
  teoria: "Contenido en desarrollo — disponible próximamente.",
  presentacionSlides: [],
  quiz: [],
  ejercicio: { objetivo: "Próximamente", herramientas: "", pasos: [], resultado: "" },
  recursos: [],
});

// ─── MÓDULO 1: ESTRATEGIA DE MARKETING CON IA ────────────────────────────────

const tema1: TemaC7 = {
  id: 1,
  titulo: "Marketing con IA: del marketing de intuición al marketing de datos",
  modulo: "Estrategia de Marketing con IA",
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Marketing con IA — cómo la inteligencia artificial transforma la estrategia de marketing en Ecuador",
  videoDuracion: "20 min",
  teoria: `El marketing con inteligencia artificial no es el futuro: es el presente de las empresas que están ganando cuota de mercado en Ecuador. La diferencia entre el marketing tradicional y el marketing con IA no es tecnológica en su esencia — es filosófica. El marketing tradicional parte de una hipótesis del marketer ("creo que a mi audiencia le gusta X") y la valida con presupuesto. El marketing con IA invierte el proceso: parte de señales de comportamiento de la audiencia real y usa esos datos para generar hipótesis que se prueban con inversión mínima antes de escalar.

En Ecuador, el contexto tiene particularidades importantes. WhatsApp es el canal de comunicación dominante — más del 90% de la población mayor de 18 años lo usa activamente. Facebook sigue siendo la red social con mayor penetración en segmentos de 30-55 años, mientras TikTok ha capturado el 18-29 con tasas de engagement entre 3 y 5 veces superiores a Instagram. Cualquier estrategia de marketing digital para el mercado ecuatoriano debe partir de esta realidad, no de benchmarks internacionales.

La IA aplica en marketing en cuatro grandes áreas: (1) Audiencias — modelos de look-alike, segmentación predictiva y exclusión de audiencias no rentables; (2) Contenido — generación y personalización de textos, imágenes y videos a escala; (3) Optimización de puja — algoritmos que asignan presupuesto en tiempo real al anuncio y audiencia con mayor probabilidad de conversión; (4) Atribución — modelos que identifican qué canales y touchpoints realmente contribuyen a la venta.

El funnel de marketing con IA tiene tres etapas que corresponden a temperaturas de audiencia: TOFU (Top of Funnel) — audiencias frías, objetivo de awareness y captura de atención; MOFU (Middle of Funnel) — audiencias tibias que ya interactuaron, objetivo de consideración y lead nurturing; BOFU (Bottom of Funnel) — audiencias calientes con intención de compra, objetivo de conversión. La IA optimiza automáticamente para el objetivo declarado de cada etapa.

Para una PyME ecuatoriana que comienza con marketing digital, el error más costoso es intentar hacer todo a la vez. La estrategia más efectiva con presupuesto limitado es: (1) instalar y verificar el pixel de Meta en el sitio web, (2) construir audiencias personalizadas con clientes existentes (mínimo 1,000 contactos), (3) crear audiencias look-alike del 1-2% (personas similares a tus mejores clientes), (4) iniciar campañas de conversión con presupuesto mínimo de $5-10/día, y (5) escalar únicamente lo que funciona después de 7-14 días de datos.`,
  presentacionSlides: [
    {
      titulo: "Marketing tradicional vs marketing con IA",
      contenido:
        "Tradicional: hipótesis del marketer → inversión para validar. Con IA: señales de comportamiento → hipótesis → inversión mínima → escalar solo lo que funciona. Invierte el flujo de riesgo.",
    },
    {
      titulo: "El mercado digital ecuatoriano en números",
      contenido:
        "WhatsApp: 90%+ penetración. Facebook: líder 30-55 años. TikTok: 18-29 con engagement 3-5x mayor. Instagram: lifestyle y B2C premium. LinkedIn: B2B limitado pero efectivo.",
    },
    {
      titulo: "Las 4 áreas donde la IA transforma el marketing",
      contenido:
        "1. Audiencias (look-alike, segmentación predictiva). 2. Contenido (generación a escala). 3. Optimización de puja (tiempo real). 4. Atribución (qué canal realmente convierte).",
    },
    {
      titulo: "El funnel de marketing con IA: TOFU, MOFU, BOFU",
      contenido:
        "TOFU (frío): awareness → captura de atención. MOFU (tibio): consideración → nurturing. BOFU (caliente): conversión → compra. La IA optimiza para el objetivo de cada etapa.",
    },
    {
      titulo: "Stack mínimo viable para PyME ecuatoriana",
      contenido:
        "1. Meta Pixel instalado. 2. Audiencia personalizada de clientes (1,000+ contactos). 3. Look-alike 1-2%. 4. Campaña de conversión $5-10/día. 5. 7-14 días de datos antes de escalar.",
    },
    {
      titulo: "CAC, LTV y ROAS: los tres KPIs que manda la IA",
      contenido:
        "CAC (Costo de Adquisición de Cliente). LTV (Valor de Vida del Cliente). ROAS (Retorno sobre Inversión Publicitaria). La IA optimiza ROAS pero el negocio se gana con LTV/CAC > 3.",
    },
    {
      titulo: "El error más costoso: hacer todo a la vez",
      contenido:
        "Un canal bien ejecutado > cinco canales mediocres. Foco: Facebook Ads para Ecuador es el motor de leads número uno. TikTok como segundo canal. WhatsApp como cierre. Escalar en ese orden.",
    },
    {
      titulo: "IA como socio estratégico, no como reemplazo",
      contenido:
        "La IA optimiza la ejecución. La estrategia (posicionamiento, propuesta de valor, audiencia objetivo) sigue siendo humana. El marketer con IA no es reemplazado — reemplaza al marketer sin IA.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la diferencia fundamental entre el marketing tradicional y el marketing con IA?",
      opciones: [
        "El marketing con IA solo funciona con grandes presupuestos",
        "El marketing tradicional parte de hipótesis del marketer; el marketing con IA parte de señales de comportamiento real de la audiencia",
        "El marketing con IA elimina la necesidad de creatividad humana",
        "El marketing tradicional es más efectivo para empresas pequeñas en Ecuador",
      ],
      respuesta: 1,
      explicacion:
        "El cambio de paradigma es filosófico: de hipótesis basadas en intuición a hipótesis basadas en señales de comportamiento real. La IA invierte el flujo de riesgo — primero prueba con datos, después invierte.",
    },
    {
      pregunta: "¿Cuál red social tiene mayor penetración en el segmento de 30-55 años en Ecuador?",
      opciones: ["TikTok", "Instagram", "LinkedIn", "Facebook"],
      respuesta: 3,
      explicacion:
        "Facebook mantiene el liderazgo en el segmento de 30-55 años en Ecuador, lo que lo hace el canal más efectivo para productos y servicios dirigidos a profesionales, padres de familia y tomadores de decisión.",
    },
    {
      pregunta: "¿Qué significa ROAS en marketing digital?",
      opciones: [
        "Registro Online de Audiencias Segmentadas",
        "Return on Ad Spend — retorno sobre inversión publicitaria",
        "Rate of Audience Size",
        "Reach Over Average Spend",
      ],
      respuesta: 1,
      explicacion:
        "ROAS (Return on Ad Spend) mide cuánto ingreso genera cada dólar invertido en publicidad. Un ROAS de 4 significa que por cada $1 invertido, se generan $4 en ventas.",
    },
    {
      pregunta: "En el funnel de marketing, ¿qué tipo de audiencia corresponde al BOFU?",
      opciones: [
        "Audiencias frías que nunca oyeron de la marca",
        "Audiencias que interactuaron con contenido pero no compraron",
        "Audiencias calientes con intención de compra declarada o comportamiento de compra",
        "Audiencias basadas en intereses generales",
      ],
      respuesta: 2,
      explicacion:
        "BOFU (Bottom of Funnel) son audiencias calientes: personas que visitaron la página de precios, agregaron al carrito, completaron un formulario, o son clientes anteriores. La IA optimiza para conversión en esta etapa.",
    },
    {
      pregunta: "¿Cuántos días mínimo se recomienda esperar antes de escalar una campaña de conversión?",
      opciones: ["1-2 días", "3-5 días", "7-14 días", "30 días"],
      respuesta: 2,
      explicacion:
        "El algoritmo de Meta necesita 7-14 días para salir de la 'fase de aprendizaje' y optimizar correctamente. Escalar antes de este período interrumpe el aprendizaje y eleva los costos.",
    },
  ],
  ejercicio: {
    titulo: "Auditoría de presencia digital y diseño de estrategia de marketing con IA",
    objetivo:
      "Evaluar la presencia digital actual de una empresa ecuatoriana y diseñar una estrategia de marketing con IA de 90 días con presupuesto definido.",
    herramientas: "Meta Business Suite (gratuito), Google Analytics (gratuito), Canva para presentación",
    datosEjemplo:
      "Empresa: academia de idiomas en Quito con 200 estudiantes activos. Tiene página de Facebook con 3,000 seguidores, Instagram con 800, sin pixel instalado, sin CRM, con lista de 450 emails de ex-estudiantes.",
    pasos: [
      "Paso 1 — Auditoría digital: Analizar la presencia actual: seguidores por red, engagement promedio, si tiene pixel instalado, si tiene Google Analytics, si tiene pixel de Meta. Para cada canal, calificar del 1 al 5. Identificar las 3 mayores brechas.",
      "Paso 2 — Definir audiencias: Usando la lista de 450 emails de ex-estudiantes, diseñar: a) audiencia personalizada por email para retargeting, b) audiencia look-alike del 2% para expansión. Describir las características del cliente ideal (edad, intereses, comportamiento digital) para la academia.",
      "Paso 3 — Diseñar el funnel de 90 días: TOFU (días 1-30): tipo de contenido orgánico, frecuencia, red social prioritaria. MOFU (días 31-60): campañas de lead nurturing, qué oferta, presupuesto diario. BOFU (días 61-90): campaña de conversión, oferta de cierre, CTA específico.",
      "Paso 4 — Plan de contenido con IA: Diseñar un calendario de 2 semanas de contenido (14 piezas). Para cada pieza: red social, formato (video/imagen/texto), tema, hook (primera oración), y herramienta de IA a usar (ChatGPT para copy, Midjourney/DALL-E para imagen, CapCut para video).",
      "Paso 5 — Presupuesto y KPIs: Distribuir un presupuesto mensual de $300 entre los canales propuestos. Para cada canal: presupuesto asignado, KPI principal, meta numérica y cómo se medirá. Calcular el CAC objetivo basándose en el precio del servicio.",
      "Paso 6 — Presentación ejecutiva: Crear presentación de 6 slides: diagnóstico actual → audiencias → funnel → calendario de contenido → presupuesto → KPIs y métricas de éxito. Presentar en 5 minutos.",
    ],
    resultado:
      "Estrategia de marketing con IA de 90 días con auditoría, definición de audiencias, funnel, calendario de contenido, presupuesto distribuido y KPIs.",
    criterios: [
      { criterio: "Auditoría con calificación por canal y 3 brechas identificadas", puntos: 15 },
      { criterio: "Audiencias personalizadas y look-alike bien definidas con justificación", puntos: 20 },
      { criterio: "Funnel de 90 días con diferenciación clara entre TOFU, MOFU y BOFU", puntos: 25 },
      { criterio: "Calendario de 14 piezas con hook, formato y herramienta de IA especificados", puntos: 20 },
      { criterio: "Presupuesto distribuido con CAC objetivo calculado y KPIs medibles", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "Meta Business Suite — Centro de ayuda",
      url: "https://business.facebook.com/help/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de Meta para gestión de campañas y audiencias",
    },
    {
      titulo: "HubSpot — Marketing Statistics 2026",
      url: "https://www.hubspot.com/marketing-statistics",
      tipo: "lectura",
      descripcion: "Estadísticas actualizadas de marketing digital con benchmarks por industria",
    },
    {
      titulo: "Google Analytics 4 — Documentación",
      url: "https://support.google.com/analytics/",
      tipo: "documentacion",
      descripcion: "Guía oficial de Google Analytics 4 para medir el comportamiento de usuarios",
    },
    {
      titulo: "Think With Google — Insights Ecuador",
      url: "https://www.thinkwithgoogle.com/intl/es-419/",
      tipo: "lectura",
      descripcion: "Datos de comportamiento digital del consumidor latinoamericano de Google",
    },
  ],
};

const tema2: TemaC7 = placeholder(2, "Buyer persona con IA: del supuesto al dato real", "Estrategia de Marketing con IA", 1);
const tema3: TemaC7 = placeholder(3, "SEO con IA: posicionamiento orgánico acelerado", "Estrategia de Marketing con IA", 1);
const tema4: TemaC7 = placeholder(4, "Proyecto: plan de marketing digital de 90 días", "Estrategia de Marketing con IA", 1);

// ─── MÓDULO 2: CONTENIDO GENERATIVO ──────────────────────────────────────────

const tema5: TemaC7 = placeholder(5, "Copy persuasivo con ChatGPT: frameworks AIDA y PAS", "Contenido Generativo (Texto, Imagen, Video)", 2);

const tema6: TemaC7 = {
  id: 6,
  titulo: "Contenido generativo: texto, imagen y video con IA para marketing en Ecuador",
  modulo: "Contenido Generativo (Texto, Imagen, Video)",
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Contenido con IA — cómo crear texto, imágenes y videos de marketing en minutos",
  videoDuracion: "28 min",
  teoria: `La creación de contenido siempre fue el cuello de botella del marketing digital. Una estrategia de contenido sólida requiere entre 20 y 40 piezas mensuales por canal activo — lo que antes demandaba un equipo de diseñadores, copywriters y editores de video ahora puede producirse con un equipo pequeño que domina las herramientas de IA generativa.

Para texto, ChatGPT y Claude son los líderes. La clave no es usarlos para generar contenido genérico, sino para acelerarlo con voz y datos propios. El método más efectivo: (1) definir la voz de la marca en un prompt de sistema (tono, palabras que usa, palabras que evita, datos de la empresa); (2) usar frameworks de copy probados como AIDA (Atención, Interés, Deseo, Acción) o PAS (Problema, Agitación, Solución); (3) siempre editar la salida con conocimiento del contexto local ecuatoriano. Un copy que menciona "el ruido del tráfico en la Av. Naciones Unidas a las 7 AM" conecta mucho más con una audiencia en Quito que uno genérico.

Para imágenes, DALL-E 3 (integrado en ChatGPT Plus), Midjourney y Adobe Firefly son las herramientas principales. En marketing ecuatoriano, la imagen generativa tiene usos específicos muy valiosos: fondos personalizados para productos fotogradeados, variaciones de creativos para A/B testing, ilustraciones para contenido educativo, y mockups de productos antes de producirlos físicamente. La limitación principal: la IA aún tiene dificultades con texto en imágenes y con representaciones precisas de personas de rasgos latinoamericanos. La solución práctica es usar fotografía real para personas y IA para fondos, elementos de diseño y composiciones abstractas.

Para video, la IA ha democratizado completamente la producción. CapCut con sus funciones de IA (auto-subtítulos, eliminación de fondos, voz en off automática) permite editar en móvil lo que antes requería Adobe Premiere. Herramientas como HeyGen generan avatares de video con voz sintética a partir de un guión. Runway ML y Pika Labs generan video desde texto o imagen. Para TikTok e Instagram Reels en Ecuador, el formato más efectivo sigue siendo el video nativo con presencia humana real — la IA debe usarse como acelerador de producción, no como reemplazo del presentador.

El flujo de producción de contenido con IA para una PyME ecuatoriana: lunes — usar ChatGPT para generar los borradores de copy de la semana (15 piezas en 30 minutos); martes — generar imágenes en DALL-E o Canva AI para las piezas más importantes; miércoles/jueves — grabar videos cortos usando los guiones de ChatGPT, editar con CapCut AI; viernes — programar todo el contenido de la semana siguiente en Meta Business Suite o Buffer. Este flujo permite mantener presencia constante en 3-4 redes con dedicación de 2-3 horas semanales.`,
  presentacionSlides: [
    {
      titulo: "El cuello de botella del contenido: resuelto con IA",
      contenido:
        "20-40 piezas/mes por canal activo. Antes: equipo de diseñadores + copywriters + editores. Ahora: 1 persona con IA. Tiempo reducido de días a horas.",
    },
    {
      titulo: "Copy con IA: el método de 3 pasos",
      contenido:
        "1. Voz de marca en prompt de sistema (tono, palabras clave, datos empresa). 2. Framework probado: AIDA o PAS. 3. Edición con contexto local ecuatoriano. El copy genérico no convierte.",
    },
    {
      titulo: "AIDA y PAS: frameworks de copy que funcionan",
      contenido:
        "AIDA: Atención → Interés → Deseo → Acción. PAS: Problema → Agitación → Solución. Aplicar con datos reales del dolor del cliente ecuatoriano, no ejemplos abstractos.",
    },
    {
      titulo: "Imágenes con IA: usos reales en marketing ecuatoriano",
      contenido:
        "Fondos para productos. Variaciones para A/B testing. Ilustraciones educativas. Mockups pre-producción. Limitación: personas latinoamericanas y texto en imagen → usar foto real.",
    },
    {
      titulo: "Video con IA: CapCut + HeyGen + Runway",
      contenido:
        "CapCut: auto-subtítulos, eliminación de fondo, voz en off (móvil). HeyGen: avatares con guión. Runway/Pika: video desde texto. TikTok Ecuador: video humano real con IA de producción.",
    },
    {
      titulo: "Flujo semanal de contenido con IA",
      contenido:
        "Lunes: ChatGPT → 15 borradores de copy (30 min). Martes: DALL-E/Canva AI → imágenes. Mié-Jue: grabar con guiones de IA, editar en CapCut. Viernes: programar en Meta Business Suite.",
    },
    {
      titulo: "Contexto ecuatoriano en el copy: por qué importa",
      contenido:
        "Mencionar: Av. Naciones Unidas, Malecón 2000, tráfico en la Simón Bolívar, precio en dólares con decimales ecuatorianos, IESS, SRI. La especificidad local multiplica la conexión con la audiencia.",
    },
    {
      titulo: "Herramientas del stack de contenido con IA",
      contenido:
        "ChatGPT/Claude (copy) · DALL-E 3/Midjourney (imagen) · CapCut (video móvil) · HeyGen (avatar video) · Canva AI (diseño) · Meta Business Suite (programación).",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es el método más efectivo para generar copy con IA que tenga la voz de la marca?",
      opciones: [
        "Pedir a ChatGPT que genere texto genérico y publicarlo directamente",
        "Definir la voz de la marca en un prompt de sistema y aplicar frameworks como AIDA o PAS, editando con contexto local",
        "Usar solo plantillas pre-escritas sin modificación",
        "Contratar un copywriter tradicional en lugar de usar IA",
      ],
      respuesta: 1,
      explicacion:
        "El método de 3 pasos — voz de marca en prompt de sistema + framework probado + edición con contexto local — genera copy que se siente auténtico y conecta con la audiencia específica.",
    },
    {
      pregunta: "¿Qué significa el framework PAS en copywriting?",
      opciones: [
        "Presupuesto, Audiencia, Segmentación",
        "Problema, Agitación, Solución",
        "Publicidad, Anuncio, Servicio",
        "Posicionamiento, Acción, Seguimiento",
      ],
      respuesta: 1,
      explicacion:
        "PAS (Problema, Agitación, Solución) es un framework de copy que primero identifica el problema del cliente, amplifica el dolor (agitación) para crear urgencia, y luego presenta el producto o servicio como solución.",
    },
    {
      pregunta: "¿Cuál es la principal limitación de las herramientas de generación de imágenes con IA para marketing ecuatoriano?",
      opciones: [
        "Solo generan imágenes en blanco y negro",
        "Son demasiado costosas para PyMEs",
        "Tienen dificultades con texto en imágenes y con representaciones precisas de personas de rasgos latinoamericanos",
        "Solo funcionan en inglés",
      ],
      respuesta: 2,
      explicacion:
        "Las herramientas actuales de IA tienen limitaciones conocidas con texto insertado en imágenes (genera errores tipográficos) y con personas de rasgos latinoamericanos específicos. La solución es usar fotografía real para personas y IA para fondos y elementos de diseño.",
    },
    {
      pregunta: "¿Cuál herramienta es más apropiada para crear videos cortos con auto-subtítulos desde el móvil?",
      opciones: ["Adobe Premiere Pro", "Final Cut Pro", "CapCut con sus funciones de IA", "HeyGen"],
      respuesta: 2,
      explicacion:
        "CapCut es una aplicación móvil gratuita que incluye auto-subtítulos con IA, eliminación de fondos, voz en off automática y efectos. Es la herramienta estándar para creadores de contenido en TikTok e Instagram Reels.",
    },
    {
      pregunta: "¿Cuánto tiempo aproximado toma generar 15 borradores de copy para la semana usando ChatGPT con el método correcto?",
      opciones: ["4-6 horas", "Todo un día de trabajo", "30 minutos", "No es posible generar esa cantidad"],
      respuesta: 2,
      explicacion:
        "Con prompts bien estructurados que incluyen voz de marca, framework de copy y contexto del negocio, ChatGPT puede generar 15 borradores en 30 minutos. El tiempo principal está en la edición con contexto local.",
    },
  ],
  ejercicio: {
    titulo: "Producción de 10 piezas de contenido con IA en una sesión",
    objetivo:
      "Crear un lote completo de 10 piezas de contenido de marketing (5 textos + 3 imágenes + 2 guiones de video) para una empresa ecuatoriana usando herramientas de IA.",
    herramientas:
      "ChatGPT Plus o Claude (copy y guiones), DALL-E 3 o Canva AI (imágenes), CapCut (video opcional)",
    datosEjemplo:
      "Empresa: consultora de recursos humanos en Quito. Servicio: selección de personal con IA. Audiencia: gerentes de RR.HH. de empresas medianas (50-200 empleados). Precio: $1,500 por proceso de selección.",
    pasos: [
      "Paso 1 — Configurar voz de marca: Crear un prompt de sistema con: nombre de empresa, servicios, audiencia objetivo (gerentes de RR.HH.), tono (profesional pero cercano, usa 'tú'), palabras clave ('talento', 'eficiencia', 'IA'), palabras prohibidas (evitar jerga anglosajona excesiva). Guardar este prompt para reusar.",
      "Paso 2 — Generar 5 piezas de copy con frameworks: Pieza 1: AIDA para LinkedIn (problema de contratar mal + solución IA). Pieza 2: PAS para Facebook (dolor de procesos lentos de selección). Pieza 3: Historia de caso ficticio para Instagram. Pieza 4: Carrusel de '5 señales de que tu proceso de selección necesita IA'. Pieza 5: CTA directo para WhatsApp ('Agenda tu diagnóstico gratuito').",
      "Paso 3 — Generar 3 imágenes con IA: Imagen 1: infografía de proceso de selección con IA (texto en Canva + fondo IA). Imagen 2: foto de ambiente de oficina moderno en Quito para background del copy. Imagen 3: variación de creativos del post AIDA para A/B testing (mismo texto, diferente imagen).",
      "Paso 4 — Crear 2 guiones de video (60 segundos): Guión 1: formato PAS — abrir con problema ('¿Cuánto tiempo pierdes en entrevistas con candidatos que no califican?'), agitar, presentar solución, CTA. Guión 2: formato testimonial ficticio — narrar historia de empresa ecuatoriana que redujo tiempo de contratación de 45 a 12 días. Cada guión debe incluir: gancho (0-3 seg), desarrollo (3-50 seg), CTA (50-60 seg).",
      "Paso 5 — Revisión editorial: Para cada pieza, verificar: ¿tiene tilde donde corresponde? ¿menciona contexto ecuatoriano específico? ¿el CTA es claro? ¿el tono es consistente con la voz de marca? Corregir con la lista de verificación proporcionada.",
      "Paso 6 — Organizar en calendario: Distribuir las 10 piezas en un calendario de 2 semanas. Asignar: red social, fecha y hora de publicación óptima (según datos de engagement por red), y si requiere pago para amplificación. Exportar como tabla.",
    ],
    resultado:
      "Lote de 10 piezas de contenido (5 copy, 3 imágenes, 2 guiones) con calendario de 2 semanas y checklist de revisión editorial completado.",
    criterios: [
      { criterio: "Prompt de sistema con voz de marca completo y reutilizable", puntos: 15 },
      { criterio: "5 piezas de copy con frameworks correctamente aplicados (AIDA/PAS identificables)", puntos: 25 },
      { criterio: "3 imágenes generadas con IA apropiadas para uso de marketing", puntos: 20 },
      { criterio: "2 guiones de 60 segundos con gancho + desarrollo + CTA estructurados", puntos: 25 },
      { criterio: "Calendario de 2 semanas con red, fecha, hora y decisión de pago/orgánico", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "ChatGPT — Prompts para marketing",
      url: "https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api",
      tipo: "documentacion",
      descripcion: "Guía oficial de OpenAI para diseñar prompts efectivos para generación de contenido",
    },
    {
      titulo: "Canva AI — Generación de diseños con IA",
      url: "https://www.canva.com/ai-image-generator/",
      tipo: "herramienta",
      descripcion: "Herramienta de generación de imágenes integrada en Canva con edición directa",
    },
    {
      titulo: "HubSpot — Guía de copywriting con IA",
      url: "https://blog.hubspot.com/marketing/ai-copywriting",
      tipo: "lectura",
      descripcion: "Guía práctica de copywriting con herramientas de IA para marketing digital",
    },
    {
      titulo: "CapCut — Herramientas de IA para video",
      url: "https://www.capcut.com/",
      tipo: "herramienta",
      descripcion: "Editor de video con IA para móvil y desktop — auto-subtítulos, eliminación de fondo, voice-over",
    },
  ],
};

const tema7: TemaC7 = placeholder(7, "Generación de imágenes para ads: DALL-E, Midjourney y Firefly", "Contenido Generativo (Texto, Imagen, Video)", 2);
const tema8: TemaC7 = placeholder(8, "Proyecto: campaña de contenido de 30 días con IA", "Contenido Generativo (Texto, Imagen, Video)", 2);

// ─── MÓDULO 3: PIXELS + IA PREDICTIVA EN META/TIKTOK ADS ─────────────────────

const tema9: TemaC7 = placeholder(9, "Meta Pixel: instalación, verificación y eventos personalizados", "Pixels + IA Predictiva en Meta/TikTok Ads", 3);
const tema10: TemaC7 = placeholder(10, "Audiencias de Meta Ads: personalizadas, look-alike y por intereses", "Pixels + IA Predictiva en Meta/TikTok Ads", 3);

const tema11: TemaC7 = {
  id: 11,
  titulo: "TikTok Pixel y IA predictiva: capturar la audiencia más joven de Ecuador",
  modulo: "Pixels + IA Predictiva en Meta/TikTok Ads",
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "TikTok Pixel y ads con IA — cómo capturar leads del segmento 18-29 en Ecuador",
  videoDuracion: "24 min",
  teoria: `TikTok ha transformado el marketing digital en Ecuador de forma más acelerada de lo que la mayoría de las marcas reconoce. En 2025, TikTok superó a Instagram en tiempo de uso diario en el segmento de 18-29 años en Ecuador, con un promedio de 95 minutos diarios por usuario. El engagement promedio en TikTok (likes + comentarios + shares dividido entre seguidores) es 3-5 veces superior al de Instagram para el mismo tamaño de audiencia. Para marcas que buscan penetrar el segmento joven, ignorar TikTok ya no es una opción estratégica viable.

El TikTok Pixel funciona de forma análoga al Meta Pixel: es un fragmento de código que se instala en el sitio web y rastrea el comportamiento de los visitantes — páginas vistas, tiempo en página, eventos de formulario, compras completadas. Este seguimiento permite a TikTok Ads Manager crear audiencias de retargeting (personas que visitaron el sitio) y audiencias look-alike (personas similares a quienes convirtieron). En Ecuador, el Pixel de TikTok está instalado en menos del 10% de los sitios web de PyMEs con presencia en la plataforma, lo que representa una ventaja competitiva significativa para quienes lo implementan correctamente.

La IA predictiva de TikTok Ads opera a través de su algoritmo "Smart Performance Campaign" (SPC), que optimiza automáticamente creativos, audiencias y pujas simultáneamente. A diferencia de Meta, donde el marketer controla más variables, TikTok SPC requiere menor configuración manual pero exige creativos de calidad nativa — videos que se vean como contenido orgánico, no como publicidad tradicional. El formato que mejor funciona en Ecuador: videos de 15-30 segundos con hook en los primeros 3 segundos, formato vertical 9:16, con presencia humana real y subtítulos automáticos.

Los tipos de campaña más efectivos para generación de leads en TikTok Ecuador son: (1) Lead Generation nativo — formulario dentro de TikTok que el usuario llena sin salir de la app (tasa de conversión 3-5x mayor que los que redirigen a sitio web); (2) Traffic a landing page con Pixel — para productos que requieren más información antes de convertir; (3) Spark Ads — amplificar contenido orgánico que ya está funcionando, lo que reduce el costo de producción creativa significativamente.

El costo por lead en TikTok Ecuador es actualmente más bajo que en Meta para el segmento 18-29, con promedios de $1.50-$3 por lead en sectores de educación y servicios, comparado con $4-$8 en Meta para el mismo segmento. Sin embargo, la calidad del lead en TikTok requiere mayor nurturing — el usuario de TikTok tiene menor intención de compra inmediata que el que llega por búsqueda en Google o retargeting de Meta.`,
  presentacionSlides: [
    {
      titulo: "TikTok en Ecuador: los números que importan",
      contenido:
        "18-29 años: 95 min/día promedio. Engagement 3-5x mayor que Instagram. CPL $1.50-$3 en educación (vs $4-$8 en Meta para mismo segmento). Pixel instalado en menos del 10% de PyMEs.",
    },
    {
      titulo: "TikTok Pixel vs Meta Pixel: similitudes y diferencias",
      contenido:
        "Ambos: rastrean comportamiento en sitio web, crean audiencias de retargeting y look-alike. Diferencia: TikTok tiene menos señales de datos históricos en Ecuador → ventana de aprendizaje más larga.",
    },
    {
      titulo: "Smart Performance Campaign (SPC): la IA de TikTok",
      contenido:
        "Optimiza creativos + audiencias + pujas simultáneamente. Menos control manual que Meta. Requiere creativos de calidad nativa (no publicidad tradicional). 50+ conversiones para salir de aprendizaje.",
    },
    {
      titulo: "Creativos nativos para TikTok Ecuador",
      contenido:
        "Video 9:16 vertical · 15-30 segundos · Hook en primeros 3 segundos · Presencia humana real · Subtítulos automáticos · Sin logo gigante · Que parezca orgánico, no ad.",
    },
    {
      titulo: "3 tipos de campaña para leads en Ecuador",
      contenido:
        "1. Lead Gen nativo (formulario in-app, 3-5x mayor conversión). 2. Traffic + Pixel (para productos complejos). 3. Spark Ads (amplificar orgánico que funciona). Comenzar con Lead Gen nativo.",
    },
    {
      titulo: "Instalar el TikTok Pixel correctamente",
      contenido:
        "TikTok Ads Manager → Assets → Events → Web Events. Opción 1: pixel manual (código en header). Opción 2: integración con Google Tag Manager. Verificar con TikTok Pixel Helper extension.",
    },
    {
      titulo: "Calidad del lead de TikTok vs Meta",
      contenido:
        "TikTok: menor costo, menor intención de compra inmediata → requiere nurturing más largo. Meta: mayor costo, mayor intención. Estrategia: TikTok para llenar el funnel, Meta para cerrar.",
    },
    {
      titulo: "TikTok for Business: recursos Ecuador",
      contenido:
        "business.tiktok.com → Ads Manager. TikTok Creative Center → tendencias de hashtags Ecuador. TikTok Academy (gratuita). Búsqueda '#Ecuador' para entender contenido que funciona localmente.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es el tiempo promedio diario de uso de TikTok en el segmento de 18-29 años en Ecuador?",
      opciones: ["30 minutos", "45 minutos", "95 minutos", "120 minutos"],
      respuesta: 2,
      explicacion:
        "En 2025, el segmento de 18-29 años en Ecuador usa TikTok en promedio 95 minutos diarios, superando a Instagram y Facebook en tiempo de uso para ese grupo demográfico.",
    },
    {
      pregunta: "¿Qué es un 'Spark Ad' en TikTok?",
      opciones: [
        "Una campaña de video generada completamente por IA",
        "Una función que amplifica contenido orgánico existente que ya está funcionando bien",
        "Un formato de anuncio de imagen estática",
        "Una campaña exclusiva para negocios verificados",
      ],
      respuesta: 1,
      explicacion:
        "Spark Ads permite amplificar publicaciones orgánicas existentes (propias o de creadores de contenido con permiso) como anuncios pagados, conservando el engagement orgánico acumulado y reduciendo costos de producción.",
    },
    {
      pregunta: "¿Por qué el formato Lead Generation nativo de TikTok tiene 3-5 veces mayor tasa de conversión?",
      opciones: [
        "Porque TikTok cobra menos por este formato",
        "Porque el usuario llena el formulario sin salir de la app, eliminando la fricción de redirigir a un sitio externo",
        "Porque los formularios nativos son más cortos",
        "Porque TikTok prioriza este formato en su algoritmo",
      ],
      respuesta: 1,
      explicacion:
        "La fricción de salir de una app y cargar un sitio web externo reduce significativamente la tasa de conversión. El formulario nativo in-app elimina esa fricción, manteniendo al usuario en el entorno que ya está usando.",
    },
    {
      pregunta: "¿Qué deben hacer los creativos de TikTok para funcionar como anuncios efectivos en Ecuador?",
      opciones: [
        "Seguir el formato de publicidad tradicional de TV con logo prominente y jingle",
        "Ser videos en formato horizontal 16:9 de alta producción",
        "Verse como contenido nativo orgánico: vertical 9:16, presencia humana, hook en 3 segundos, subtítulos",
        "Durar mínimo 2 minutos para explicar bien el producto",
      ],
      respuesta: 2,
      explicacion:
        "En TikTok, los anuncios que se perciben como publicidad tradicional generan rechazo inmediato. Los creativos nativos — que se ven y sienten como contenido orgánico de TikTok — tienen tasas de completación y conversión significativamente mayores.",
    },
    {
      pregunta: "Comparando la calidad de leads de TikTok vs Meta para el segmento joven en Ecuador, ¿cuál es la estrategia correcta?",
      opciones: [
        "Usar solo TikTok porque es más barato",
        "Usar solo Meta porque los leads tienen más intención de compra",
        "TikTok para llenar el funnel con leads a bajo costo, Meta para retargetear y cerrar con mayor intención",
        "Ambos generan leads de igual calidad sin distinción",
      ],
      respuesta: 2,
      explicacion:
        "La estrategia complementaria es óptima: TikTok genera volumen a menor costo pero requiere más nurturing; Meta captura usuarios con mayor intención de compra a mayor costo. Usados juntos, optimizan el costo total de adquisición.",
    },
  ],
  ejercicio: {
    titulo: "Configurar TikTok Pixel y lanzar campaña de Lead Generation nativa",
    objetivo:
      "Instalar y verificar el TikTok Pixel en un sitio web y configurar una campaña de Lead Generation nativa para el mercado ecuatoriano.",
    herramientas:
      "TikTok for Business (ads.tiktok.com), Google Tag Manager (si aplica), TikTok Pixel Helper (extensión Chrome), sitio web de práctica",
    datosEjemplo:
      "Empresa: plataforma de cursos de inglés online para adultos en Ecuador. Precio: $89/mes. Audiencia objetivo: profesionales de 22-35 años que trabajan en empresas que requieren inglés (BPO, turismo, exportación).",
    pasos: [
      "Paso 1 — Crear cuenta en TikTok for Business: Acceder a ads.tiktok.com. Crear cuenta Business con el email de la empresa. Configurar el perfil: país (Ecuador), moneda (USD), sector (educación). Verificar el número de teléfono.",
      "Paso 2 — Instalar el TikTok Pixel: En el Ads Manager: Assets → Events → Web Events → Set Up Web Events. Elegir método de instalación manual. Copiar el código base del pixel. Instalar en el header del sitio web (antes de </head>). Verificar con TikTok Pixel Helper que el evento 'PageView' dispara.",
      "Paso 3 — Configurar evento de conversión: En Web Events, agregar evento 'Lead' con el trigger del botón de formulario o página de confirmación. Verificar que el evento Lead dispara correctamente completando el formulario de prueba. Documentar el ID del pixel y los eventos configurados.",
      "Paso 4 — Crear la campaña de Lead Generation: Nueva campaña → Objetivo: Lead Generation. Nombre de campaña: 'Cursos Inglés Ecuador — Lead Gen [mes/año]'. Presupuesto diario: $10. Nivel de grupo de anuncios: audiencia (Ecuador, 22-35 años, intereses: aprendizaje de idiomas, desarrollo profesional, BPO). Crear formulario nativo con: imagen, 3 preguntas (nombre, email, empresa), CTA 'Solicitar información'.",
      "Paso 5 — Crear el creativo nativo: Grabar video de 20-25 segundos con estructura: Hook (0-3s): pregunta directa ('¿Tu trabajo necesita inglés pero no tienes tiempo de estudiar?'). Desarrollo (3-20s): mostrar la solución con subtítulos automáticos de CapCut. CTA (20-25s): llamado a acción claro. Subir al anuncio y verificar que el Pixel está asociado.",
      "Paso 6 — Monitoreo y análisis inicial: Después de 48 horas de campaña activa, revisar en Ads Manager: impresiones, CTR, costo por lead, tasa de completación del formulario. Identificar qué audiencia tiene menor CPL. Documentar aprendizajes para la optimización del siguiente período.",
    ],
    resultado:
      "TikTok Pixel instalado y verificado, campaña de Lead Generation configurada con presupuesto real o de prueba, creativo nativo producido y reporte de métricas iniciales.",
    criterios: [
      { criterio: "Pixel instalado correctamente con PageView verificado con Pixel Helper", puntos: 25 },
      { criterio: "Evento Lead configurado y disparando en el flujo de conversión", puntos: 20 },
      { criterio: "Campaña configurada con audiencia, presupuesto y formulario nativo completo", puntos: 25 },
      { criterio: "Creativo de video nativo con estructura Hook-Desarrollo-CTA en 20-25 segundos", puntos: 20 },
      { criterio: "Reporte de métricas iniciales con análisis y próximos pasos", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "TikTok for Business — Ads Manager",
      url: "https://ads.tiktok.com/",
      tipo: "herramienta",
      descripcion: "Plataforma oficial de publicidad de TikTok para crear y gestionar campañas",
    },
    {
      titulo: "TikTok Business Help Center — Pixel",
      url: "https://ads.tiktok.com/help/article/tiktok-pixel",
      tipo: "documentacion",
      descripcion: "Documentación oficial de TikTok para instalación y configuración del Pixel",
    },
    {
      titulo: "Meta Business Suite — Ads Manager",
      url: "https://business.facebook.com/",
      tipo: "herramienta",
      descripcion: "Plataforma de gestión de anuncios de Meta (Facebook e Instagram)",
    },
    {
      titulo: "TikTok Creative Center — Tendencias Ecuador",
      url: "https://ads.tiktok.com/business/creativecenter/",
      tipo: "herramienta",
      descripcion: "Centro de creatividades de TikTok con tendencias de hashtags y música por país",
    },
  ],
};

const tema12: TemaC7 = placeholder(12, "Atribución multicanal: qué canal realmente convierte en Ecuador", "Pixels + IA Predictiva en Meta/TikTok Ads", 3);

// ─── MÓDULO 4: OPTIMIZACIÓN DE CAMPAÑAS CON ML ───────────────────────────────

const tema13: TemaC7 = placeholder(13, "A/B testing con IA: cómo probar y escalar creativos", "Optimización de Campañas con ML", 4);
const tema14: TemaC7 = placeholder(14, "Advantage+ de Meta: automatic placements y audiencias con ML", "Optimización de Campañas con ML", 4);
const tema15: TemaC7 = placeholder(15, "Email marketing con IA: segmentación predictiva y personalización", "Optimización de Campañas con ML", 4);

const tema16: TemaC7 = {
  id: 16,
  titulo: "Proyecto final: campaña integrada con IA de principio a fin",
  modulo: "Optimización de Campañas con ML",
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Campaña integrada con IA — del brief a los resultados optimizados con Machine Learning",
  videoDuracion: "32 min",
  teoria: `Una campaña de marketing integrada con IA no es la suma de herramientas individuales — es un sistema donde cada componente alimenta al siguiente: los datos de comportamiento del pixel informan las audiencias, las audiencias informan los creativos, los creativos informan la optimización, y los resultados informan la siguiente iteración. Este ciclo cerrado, imposible de ejecutar manualmente a escala, es lo que diferencia el marketing con ML del marketing tradicional.

El framework RACE (Reach, Act, Convert, Engage) adaptado para marketing con IA en Ecuador: (1) Reach — usar TikTok y Meta para llegar a audiencias frías con contenido nativo de alta relevancia, optimizado por los algoritmos de ML de cada plataforma; (2) Act — retargetear visitantes del sitio web con anuncios específicos para el punto del funnel donde abandonaron, usando audiencias personalizadas del pixel; (3) Convert — usar campañas de conversión con Advantage+ de Meta o SPC de TikTok, dejando que la IA optimice la puja en tiempo real; (4) Engage — mantener clientes existentes activos con email marketing segmentado con IA y contenido orgánico de valor.

La clave del éxito con ML en campañas publicitarias es el volumen de señales. El algoritmo de Meta necesita mínimo 50 conversiones por semana por conjunto de anuncios para salir de la fase de aprendizaje y optimizar efectivamente. Para una PyME ecuatoriana con presupuesto limitado, la implicación práctica es: concentrar el presupuesto en 1-2 conjuntos de anuncios en lugar de diversificar en muchos, hasta que se alcance el volumen de señales suficiente.

El análisis de datos post-campaña con IA es donde se genera la ventaja competitiva sostenible. Herramientas como ChatGPT Code Interpreter pueden analizar los exports de Ads Manager (disponibles en CSV), identificar qué creativos tienen menor frecuencia de ad fatigue, qué segmentos de audiencia tienen mejor ROAS por día de la semana y hora del día, y proyectar cuánto presupuesto adicional puede absorberse antes de que el ROAS marginal caiga por debajo del umbral de rentabilidad.

En Ecuador, el calendario de campañas tiene particularidades que el ML debe considerar: el quincenero (pago de quincena los 15) genera picos de intención de compra; el regreso a clases en octubre y mayo impacta el sector educación y retail infantil; el día de la madre (segundo domingo de mayo) es el evento de mayor gasto en publicidad después de Navidad; la temporada de fútbol nacional reduce el engagement en contenidos no relacionados durante los partidos de LigaPro. Incorporar estas variables como contexto en los análisis con IA produce recomendaciones más relevantes que los benchmarks internacionales.`,
  presentacionSlides: [
    {
      titulo: "El sistema de marketing con IA: el ciclo cerrado",
      contenido:
        "Pixel → datos de comportamiento → audiencias → creativos → optimización ML → resultados → nueva iteración. Cada componente alimenta al siguiente. Imposible a escala sin IA.",
    },
    {
      titulo: "Framework RACE con IA para Ecuador",
      contenido:
        "Reach: TikTok + Meta (audiencias frías). Act: retargeting pixel (abandono de funnel). Convert: Advantage+ / SPC (ML optimiza puja). Engage: email segmentado + orgánico de valor.",
    },
    {
      titulo: "La regla de las 50 conversiones semanales",
      contenido:
        "Meta necesita 50 conversiones/semana/conjunto para salir de aprendizaje. Implicación: concentrar presupuesto en 1-2 conjuntos, no diversificar, hasta alcanzar señales suficientes.",
    },
    {
      titulo: "Análisis post-campaña con Code Interpreter",
      contenido:
        "Exportar Ads Manager en CSV → ChatGPT Code Interpreter. Identificar: ad fatigue, ROAS por hora/día, segmentos más rentables, punto de retorno marginal decreciente.",
    },
    {
      titulo: "Calendario de campañas Ecuador: variables del ML",
      contenido:
        "Quincenero (día 15): pico de intención de compra. Regreso clases: oct y may. Día de la madre: 2do domingo mayo. Fútbol LigaPro: engagement cae en partidos. Incorporar en análisis.",
    },
    {
      titulo: "Advantage+ de Meta vs SPC de TikTok",
      contenido:
        "Advantage+: optimiza placements + audiencias + creativos simultáneamente. SPC TikTok: similar pero más agresivo en creativos nativos. Ambos: dejar que el ML decida; el humano define el objetivo.",
    },
    {
      titulo: "Presupuesto óptimo por canal para PyME ecuatoriana",
      contenido:
        "Budget $300/mes: 60% Meta ($180) conversión + retargeting. 30% TikTok ($90) lead gen. 10% Google ($30) branded search. Revisar distribución mensualmente con datos reales.",
    },
    {
      titulo: "El informe de campaña que convence a la dirección",
      contenido:
        "No: impresiones y alcance. Sí: leads generados, CPL, conversión a cliente, CAC, ROAS. Formato: comparativa vs mes anterior + proyección próximos 30 días + 3 acciones recomendadas.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuántas conversiones semanales por conjunto de anuncios necesita Meta para salir de la fase de aprendizaje?",
      opciones: ["10 conversiones", "25 conversiones", "50 conversiones", "100 conversiones"],
      respuesta: 2,
      explicacion:
        "Meta recomienda un mínimo de 50 eventos de conversión por semana por conjunto de anuncios para que el algoritmo salga de la fase de aprendizaje y optimice efectivamente. Por debajo de ese volumen, el sistema sigue en modo de exploración con costos más altos.",
    },
    {
      pregunta: "¿Qué representa la 'R' del framework RACE adaptado para marketing con IA?",
      opciones: [
        "Retención de clientes existentes",
        "Reach — llegar a audiencias frías con contenido nativo optimizado por ML",
        "Revenue — ingresos generados por la campaña",
        "Remarketing de visitantes anteriores",
      ],
      respuesta: 1,
      explicacion:
        "En el framework RACE, Reach es la primera etapa: llegar a audiencias frías que aún no conocen la marca, usando TikTok y Meta con contenido nativo de alta relevancia optimizado por los algoritmos de ML de cada plataforma.",
    },
    {
      pregunta: "¿Cuál herramienta se recomienda para analizar exports de Ads Manager e identificar ad fatigue y ROAS por hora?",
      opciones: [
        "Excel con tablas dinámicas solamente",
        "El dashboard interno de Meta Ads Manager",
        "ChatGPT Code Interpreter con el CSV exportado de Ads Manager",
        "Google Data Studio conectado directamente a Meta",
      ],
      respuesta: 2,
      explicacion:
        "ChatGPT Code Interpreter puede analizar los exports CSV de Ads Manager para identificar patrones que el dashboard de Meta no muestra por defecto: ad fatigue, ROAS por hora del día, rendimiento por segmento demográfico y proyecciones de retorno marginal.",
    },
    {
      pregunta: "¿Cómo impacta el 'quincenero' ecuatoriano en la estrategia de campañas?",
      opciones: [
        "Reduce el presupuesto disponible de las empresas para publicidad",
        "Genera un pico de intención de compra alrededor del día 15 del mes que debe anticiparse con mayor presupuesto",
        "No tiene impacto en el comportamiento del consumidor digital",
        "Solo impacta al sector alimentario",
      ],
      respuesta: 1,
      explicacion:
        "El quincenero (pago de quincena el día 15) genera un pico de liquidez en consumidores que eleva la intención de compra. Las campañas que anticipan este patrón con mayor presupuesto y ofertas específicas obtienen mejor ROAS en esas fechas.",
    },
    {
      pregunta: "¿Cuál es la distribución de presupuesto recomendada para una PyME ecuatoriana con $300/mes en publicidad digital?",
      opciones: [
        "100% en Google Ads porque tiene la mejor intención de compra",
        "50% Meta, 50% TikTok por igual",
        "60% Meta (conversión + retargeting), 30% TikTok (lead gen), 10% Google (branded search)",
        "Invertir todo en un solo canal para maximizar el aprendizaje del algoritmo",
      ],
      respuesta: 2,
      explicacion:
        "La distribución 60/30/10 aprovecha las fortalezas de cada canal: Meta para conversión y retargeting (mayor intención), TikTok para volumen de leads a bajo costo, Google para capturar búsquedas de marca. Esta es una distribución base que debe ajustarse con datos reales mes a mes.",
    },
  ],
  ejercicio: {
    titulo: "Proyecto final: campaña integrada de 30 días con análisis ML post-campaña",
    objetivo:
      "Diseñar, configurar y analizar una campaña de marketing integrada con IA que cubra los cuatro módulos del curso: estrategia, contenido generativo, pixel y optimización ML.",
    herramientas:
      "Meta Ads Manager (business.facebook.com), TikTok for Business (ads.tiktok.com), ChatGPT Code Interpreter, Canva AI o DALL-E, CapCut",
    datosEjemplo:
      "Empresa: ITSEIA — Academia de Inteligencia Artificial en Quito. Producto: carrera de Desarrollador de IA, $300/mes, inicio junio 2026. Audiencia: profesionales o estudiantes de 20-35 años en Ecuador interesados en tecnología y desarrollo profesional.",
    pasos: [
      "Paso 1 — Estrategia y brief de campaña: Completar el brief de campaña con: objetivo (leads calificados), KPIs con metas numéricas (CPL < $5, 50 leads en 30 días), audiencias (primaria y secundaria con justificación), canales seleccionados con porcentaje de presupuesto, calendario de lanzamiento y fechas clave del mercado ecuatoriano.",
      "Paso 2 — Producción de contenido con IA: Crear 3 piezas de contenido diferenciadas por etapa del funnel: TOFU — video TikTok de 20 segundos con hook '¿Qué hace un Desarrollador de IA en Ecuador?' (guión con ChatGPT, producir con CapCut). MOFU — carrusel de Instagram '5 carreras que la IA va a crear en Ecuador en 2026' (copy ChatGPT, imágenes DALL-E). BOFU — ad de conversión de Facebook con oferta de inscripción y beneficios específicos (AIDA framework, imagen Canva AI).",
      "Paso 3 — Configuración técnica: Verificar que el Meta Pixel está instalado en la landing page con eventos PageView y Lead configurados. Verificar TikTok Pixel con los mismos eventos. En Meta Ads Manager, configurar: campaña de tráfico (TOFU, $3/día), campaña de lead gen (BOFU, $7/día). En TikTok Ads: campaña Lead Gen nativa ($5/día).",
      "Paso 4 — Análisis de datos post-semana 1: Después de 7 días, exportar datos de Meta Ads Manager en CSV (nivel de anuncio: impresiones, clics, CTR, leads, CPL por día). Subir a ChatGPT Code Interpreter con prompt: 'Analiza el rendimiento de esta campaña de 7 días. Identifica: qué anuncio tiene mejor CPL, qué días de la semana tienen menor costo, qué audiencia convierte mejor. Genera gráficos de cada análisis y recomienda 3 optimizaciones específicas.'",
      "Paso 5 — Optimización con ML: Basándose en el análisis de Code Interpreter: pausar los 2 creativos con peor CPL, aumentar 20% el presupuesto del anuncio con mejor rendimiento, ajustar la franja horaria según el análisis de conversión por hora, y crear una variación del creativo ganador (mismo mensaje, diferente hook). Documentar cada decisión con su justificación basada en datos.",
      "Paso 6 — Informe final de campaña: Presentar informe ejecutivo de 1 página con: resultados vs metas (leads generados, CPL real vs objetivo, ROAS si aplica), 3 aprendizajes principales, 3 recomendaciones para la próxima campaña, y proyección de resultados del siguiente mes manteniendo el presupuesto. Presentar en 5 minutos usando el dashboard de Meta y los gráficos de Code Interpreter.",
    ],
    resultado:
      "Campaña integrada configurada y activa (o simulada) con análisis ML real usando Code Interpreter, optimizaciones documentadas e informe ejecutivo de 1 página.",
    criterios: [
      { criterio: "Brief de campaña completo con KPIs, audiencias y distribución de presupuesto justificada", puntos: 15 },
      { criterio: "3 piezas de contenido con IA diferenciadas por etapa del funnel (TOFU/MOFU/BOFU)", puntos: 20 },
      { criterio: "Configuración técnica correcta de pixels y campañas en Meta y/o TikTok", puntos: 20 },
      { criterio: "Análisis post-campaña con Code Interpreter: gráficos generados y 3 optimizaciones identificadas", puntos: 25 },
      { criterio: "Informe ejecutivo de 1 página con resultados, aprendizajes y proyección", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "Meta Business Suite — Ads Manager",
      url: "https://business.facebook.com/",
      tipo: "herramienta",
      descripcion: "Plataforma oficial de Meta para gestión de campañas de Facebook e Instagram",
    },
    {
      titulo: "TikTok for Business — Centro de recursos",
      url: "https://ads.tiktok.com/help/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de TikTok Ads con guías de campaña y pixel",
    },
    {
      titulo: "HubSpot — Marketing Analytics Guide",
      url: "https://blog.hubspot.com/marketing/marketing-analytics",
      tipo: "lectura",
      descripcion: "Guía completa de análisis de marketing digital con métricas y frameworks",
    },
    {
      titulo: "Google Analytics 4 — Análisis de audiencias",
      url: "https://support.google.com/analytics/answer/9267568",
      tipo: "documentacion",
      descripcion: "Configuración de audiencias y segmentos en Google Analytics 4 para integración con campañas",
    },
  ],
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const C7_TEMAS: TemaC7[] = [
  tema1,  tema2,  tema3,  tema4,
  tema5,  tema6,  tema7,  tema8,
  tema9,  tema10, tema11, tema12,
  tema13, tema14, tema15, tema16,
];
