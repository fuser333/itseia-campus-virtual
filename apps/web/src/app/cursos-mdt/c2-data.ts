// ─── C2: ChatGPT Avanzado para Negocios — Datos de 20 temas ──────────────────
// Curso C2 del programa MDT. 20 temas (scaffolding).
// Módulo 1: Fundamentos de prompting avanzado
// Módulo 2: ChatGPT en ventas y marketing
// Módulo 3: Automatización con ChatGPT API
// Módulo 4: Casos prácticos sectoriales Ecuador

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

export interface TemaC2 {
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

export const C2_MODULOS = [
  { num: 1, nombre: "Fundamentos de Prompting Avanzado", horas: 10, temas: 5 },
  { num: 2, nombre: "ChatGPT en Ventas y Marketing", horas: 10, temas: 5 },
  { num: 3, nombre: "Automatización con ChatGPT API", horas: 10, temas: 5 },
  { num: 4, nombre: "Casos Prácticos Sectoriales Ecuador", horas: 10, temas: 5 },
];

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC2 => ({
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

// ─── MÓDULO 1: FUNDAMENTOS DE PROMPTING AVANZADO ─────────────────────────────

const tema1: TemaC2 = {
  id: 1,
  titulo: "Anatomía de un prompt efectivo: estructura y psicología",
  modulo: "Fundamentos de Prompting Avanzado",
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Prompting avanzado: cómo pensar para que la IA piense mejor",
  videoDuracion: "20 min",
  teoria: `Un prompt es mucho más que una pregunta escrita a una IA. Es un contrato de comunicación: defines el rol, el contexto, la tarea, el formato y las restricciones. ChatGPT no "entiende" en el sentido humano, sino que predice la continuación más probable dado el contexto. Comprender esto transforma radicalmente cómo escribes prompts.

La estructura de un prompt de alta efectividad tiene cinco componentes. Primero, el rol: "Actúa como gerente de ventas con 15 años de experiencia en empresas de distribución ecuatorianas." El rol activa un patrón de respuesta especializado. Segundo, el contexto: datos relevantes de la situación que el modelo necesita para calibrar su respuesta. Tercero, la tarea: qué debe producir exactamente, con verbos de acción precisos (redacta, analiza, clasifica, compara). Cuarto, el formato: tabla de 3 columnas, lista numerada, párrafo de 150 palabras, JSON. Quinto, las restricciones: qué evitar, qué tono usar, qué no incluir.

El prompting en cadena (chain-of-thought) es una técnica que mejora dramáticamente la calidad de razonamiento. En lugar de pedir la respuesta directamente, se le pide al modelo que piense paso a paso. "Antes de dar tu respuesta, enumera los 3 factores más relevantes del problema y pondera cuál pesa más." Esta técnica reduce errores en tareas complejas entre un 30% y un 60% según investigaciones de Google y Anthropic.

Para el contexto ecuatoriano de negocios, el prompting culturalmente calibrado es una ventaja competitiva. Un prompt que menciona "PyME familiar en Quito con 20 empleados, sector ferretero, clientes principalmente contratistas de obra" obtiene respuestas completamente distintas a uno genérico. La especificidad del contexto local es directamente proporcional a la utilidad de la respuesta.

Errores más frecuentes de prompts de baja calidad: preguntas vagas sin contexto ("dame ideas de marketing"), peticiones de listas interminables sin criterio de priorización, no especificar la audiencia del output, y no indicar el nivel de detalle esperado. Cada uno de estos errores se corrige con los cinco componentes del prompt estructurado.`,
  presentacionSlides: [
    {
      titulo: "¿Qué es realmente un prompt?",
      contenido:
        "Contrato de comunicación con la IA. ChatGPT predice continuaciones, no 'entiende'. Definir rol + contexto + tarea + formato + restricciones = resultados 5x mejores.",
    },
    {
      titulo: "Los 5 componentes del prompt de alta efectividad",
      contenido:
        "1. Rol (actúa como...). 2. Contexto (datos relevantes). 3. Tarea (verbo de acción preciso). 4. Formato (tabla, lista, JSON). 5. Restricciones (qué evitar, qué tono).",
    },
    {
      titulo: "Chain-of-Thought: razonamiento paso a paso",
      contenido:
        "Pedir al modelo que piense antes de responder. 'Enumera los 3 factores más relevantes y pondera cuál pesa más.' Reduce errores 30-60% en tareas complejas (Google/Anthropic).",
    },
    {
      titulo: "Prompting culturalmente calibrado para Ecuador",
      contenido:
        "Especificidad local = mayor utilidad. Mencionar sector, tamaño, ciudad, tipo de cliente cambia completamente la respuesta. Ventaja competitiva vs. prompts genéricos.",
    },
    {
      titulo: "Errores más frecuentes en prompts de baja calidad",
      contenido:
        "Preguntas vagas sin contexto. Listas sin criterio de priorización. No especificar audiencia del output. No indicar nivel de detalle esperado.",
    },
    {
      titulo: "Comparación: prompt malo vs. prompt estructurado",
      contenido:
        "Malo: 'dame ideas de marketing para mi empresa'. Bueno: 'Actúa como consultor de marketing digital. Tengo una ferretería en Quito con 20 empleados. Lista 5 tácticas de captación de contratistas, ordenadas por costo-efectividad, con métricas de seguimiento para cada una.'",
    },
    {
      titulo: "Iteración: el prompt como proceso",
      contenido:
        "El primer prompt rara vez es el mejor. Técnica del refinamiento progresivo: pide, evalúa, ajusta un componente a la vez. Guardar biblioteca de prompts que funcionan.",
    },
    {
      titulo: "Herramientas para gestionar prompts",
      contenido:
        "OpenAI Playground (testing). PromptBase (mercado de prompts). Notion (biblioteca personal). GitHub Gists (versionado). El activo más valioso: tu colección de prompts probados.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es el primer componente de un prompt de alta efectividad?",
      opciones: [
        "El formato de la respuesta esperada",
        "El rol que debe asumir el modelo",
        "Las restricciones de tono y estilo",
        "La longitud máxima de la respuesta",
      ],
      respuesta: 1,
      explicacion:
        "El rol activa un patrón de respuesta especializado en el modelo. Definirlo primero orienta todos los demás componentes del prompt.",
    },
    {
      pregunta: "La técnica chain-of-thought mejora los resultados principalmente porque:",
      opciones: [
        "Hace que el modelo responda más rápido",
        "Reduce el costo de tokens usados",
        "Obliga al modelo a razonar antes de responder, reduciendo errores en tareas complejas",
        "Permite usar imágenes en el prompt",
      ],
      respuesta: 2,
      explicacion:
        "El chain-of-thought fuerza un proceso de razonamiento intermedio. Según investigaciones de Google y Anthropic, reduce errores entre el 30% y el 60% en tareas que requieren lógica compleja.",
    },
    {
      pregunta: "¿Qué efecto tiene especificar el contexto cultural local (ciudad, sector, tamaño de empresa) en un prompt?",
      opciones: [
        "Ninguno — el modelo ignora esos datos",
        "Aumenta el costo de la consulta al API",
        "Genera respuestas más calibradas y aplicables al contexto real del negocio",
        "Limita la creatividad del modelo",
      ],
      respuesta: 2,
      explicacion:
        "La especificidad del contexto local es directamente proporcional a la utilidad de la respuesta. El modelo ajusta su output a los patrones del contexto proporcionado.",
    },
    {
      pregunta: "¿Cuál de estos es un error típico de un prompt de baja calidad?",
      opciones: [
        "Especificar el formato de salida como JSON",
        "Definir el rol del modelo antes de la tarea",
        "Solicitar una lista sin criterio de priorización",
        "Incluir contexto sobre el sector de la empresa",
      ],
      respuesta: 2,
      explicacion:
        "Pedir listas sin criterio produce outputs difíciles de aplicar. Un buen prompt siempre especifica el criterio de ordenamiento o priorización.",
    },
    {
      pregunta: "¿Qué herramienta sirve específicamente para probar y ajustar prompts antes de usarlos en producción?",
      opciones: [
        "Google Analytics",
        "OpenAI Playground",
        "Meta Business Suite",
        "Hootsuite",
      ],
      respuesta: 1,
      explicacion:
        "OpenAI Playground permite experimentar con diferentes configuraciones de modelo, temperatura y prompts antes de integrarlos en flujos de trabajo reales.",
    },
  ],
  ejercicio: {
    titulo: "Biblioteca de prompts para tu negocio o sector",
    objetivo:
      "Construir una biblioteca de 10 prompts estructurados y probados para tareas repetitivas de negocio, aplicando los 5 componentes del prompt efectivo.",
    herramientas: "ChatGPT (cuenta gratuita o Plus), Notion o Google Docs para documentar la biblioteca",
    datosEjemplo:
      "Empresa de referencia: distribuidora de repuestos automotrices en Quito, 15 empleados, clientes: mecánicas y talleres, facturación mensual $120,000.",
    pasos: [
      "Paso 1 — Elegir 10 tareas repetitivas: Lista las tareas de texto que realizas o realizaría tu empresa cada semana (ej: responder emails de cotización, redactar propuestas, generar reportes de ventas, crear publicaciones en redes). Elige 10.",
      "Paso 2 — Estructura cada prompt: Para cada tarea, escribe un prompt que incluya los 5 componentes: rol, contexto, tarea, formato y restricciones. Documenta en una tabla de Notion con columna 'Prompt v1'.",
      "Paso 3 — Probar en ChatGPT y evaluar: Ejecuta cada prompt en ChatGPT. Evalúa la respuesta en una escala 1-5 según: utilidad, precisión, formato correcto y aplicabilidad al contexto ecuatoriano.",
      "Paso 4 — Refinar los prompts con calificación menor a 4: Para cada prompt que obtuvo menos de 4/5, identifica cuál de los 5 componentes estaba débil y mejóralo. Documenta como 'Prompt v2' con nota de qué cambió.",
      "Paso 5 — Aplicar chain-of-thought a los 3 prompts más complejos: Para los 3 prompts que requieren más razonamiento, agrega la instrucción de pensar paso a paso antes de responder. Compara resultados v2 vs v3.",
      "Paso 6 — Presentar la biblioteca: Organiza los 10 prompts finales en Notion con etiquetas por área (ventas, marketing, operaciones, finanzas). Presenta 3 de los mejores con demostración en vivo durante 5 minutos.",
    ],
    resultado:
      "Biblioteca de 10 prompts documentados con versiones y evaluaciones, lista para uso inmediato en el negocio.",
    criterios: [
      { criterio: "10 prompts con los 5 componentes correctamente identificados", puntos: 25 },
      { criterio: "Evaluación honesta con escala 1-5 y justificación", puntos: 20 },
      { criterio: "Al menos 3 prompts refinados con comparación v1 vs v2", puntos: 20 },
      { criterio: "Chain-of-thought aplicado a 3 prompts complejos con análisis de mejora", puntos: 20 },
      { criterio: "Presentación organizada y demostración en vivo de 3 prompts", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "OpenAI — Guía oficial de prompting",
      url: "https://platform.openai.com/docs/guides/prompt-engineering",
      tipo: "documentacion",
      descripcion: "Guía oficial de OpenAI con mejores prácticas de prompt engineering",
    },
    {
      titulo: "OpenAI Playground — Ambiente de pruebas",
      url: "https://platform.openai.com/playground",
      tipo: "herramienta",
      descripcion: "Herramienta para probar prompts con diferentes configuraciones de modelo",
    },
    {
      titulo: "Anthropic — Prompt engineering guide",
      url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
      tipo: "documentacion",
      descripcion: "Guía de prompting de Anthropic, aplicable también a ChatGPT",
    },
    {
      titulo: "PromptBase — Mercado de prompts probados",
      url: "https://promptbase.com/",
      tipo: "herramienta",
      descripcion: "Plataforma de compra y venta de prompts optimizados para casos de uso específicos",
    },
  ],
};

const tema2: TemaC2 = placeholder(2, "Few-shot y zero-shot: técnicas de ejemplos en el prompt", "Fundamentos de Prompting Avanzado", 1);
const tema3: TemaC2 = placeholder(3, "Prompts para análisis y toma de decisiones", "Fundamentos de Prompting Avanzado", 1);
const tema4: TemaC2 = placeholder(4, "Gestión de contexto en conversaciones largas", "Fundamentos de Prompting Avanzado", 1);
const tema5: TemaC2 = placeholder(5, "Proyecto: sistema de prompts para un área de negocio", "Fundamentos de Prompting Avanzado", 1);

// ─── MÓDULO 2: CHATGPT EN VENTAS Y MARKETING ─────────────────────────────────

const tema6: TemaC2 = {
  id: 6,
  titulo: "ChatGPT como copiloto de ventas: propuestas, objeciones y seguimiento",
  modulo: "ChatGPT en Ventas y Marketing",
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "ChatGPT en ventas: más cierres, menos tiempo redactando",
  videoDuracion: "22 min",
  teoria: `El equipo de ventas promedio dedica entre el 35% y el 50% de su tiempo a tareas administrativas: redactar propuestas, responder emails, preparar presentaciones, escribir seguimientos. ChatGPT puede reducir ese tiempo en un 60-70%, liberando horas para la actividad de mayor valor: la conversación con el cliente.

En el ciclo de ventas B2B ecuatoriano, ChatGPT tiene aplicaciones concretas en cada etapa. En prospección: investigar empresas objetivo y generar guiones de primer contacto personalizados por sector. En calificación: generar listas de preguntas BANT (Budget, Authority, Need, Timeline) adaptadas al producto o servicio. En la propuesta: redactar el documento completo a partir de notas de la reunión, con estructura profesional y lenguaje técnico del sector. En el manejo de objeciones: generar respuestas preparadas para las 10 objeciones más comunes, con argumentos específicos para el contexto ecuatoriano. En el seguimiento: redactar emails personalizados basados en el historial de la conversación.

La técnica de "Role-play de ventas con ChatGPT" es una de las más valiosas y menos usadas. El vendedor le pide a ChatGPT que actúe como un cliente difícil con objeciones específicas, luego practica sus respuestas y le pide retroalimentación al modelo. Esto es el equivalente a tener un coach de ventas disponible 24/7 sin costo adicional.

Para marketing de contenidos en empresas ecuatorianas, ChatGPT puede generar en minutos lo que tomaría horas: posts para LinkedIn calibrados al tono empresarial, copy para Meta Ads con llamados a la acción para el mercado ecuatoriano, guiones para videos de TikTok siguiendo las tendencias locales, emails de nurturing para leads en diferentes etapas del embudo, y artículos de blog optimizados para SEO en español ecuatoriano.

Un flujo de trabajo típico de ventas aumentado con IA: el vendedor toma notas breves de la reunión (5 minutos), las pega en un prompt estructurado en ChatGPT, y en 2 minutos tiene el borrador de la propuesta, el email de seguimiento, y las respuestas a las objeciones mencionadas. Lo que antes tomaba 2 horas ahora toma 15 minutos.`,
  presentacionSlides: [
    {
      titulo: "El tiempo perdido del vendedor",
      contenido:
        "35-50% del tiempo de ventas en tareas administrativas. ChatGPT puede reducirlo 60-70%. Resultado: más horas de conversación real con clientes.",
    },
    {
      titulo: "ChatGPT en cada etapa del ciclo de ventas B2B",
      contenido:
        "Prospección: guiones personalizados. Calificación: preguntas BANT. Propuesta: documento completo desde notas. Objeciones: respuestas preparadas. Seguimiento: emails personalizados.",
    },
    {
      titulo: "Role-play de ventas: el coach 24/7",
      contenido:
        "ChatGPT actúa como cliente difícil con objeciones específicas. Practica respuestas. Pide retroalimentación. Coach de ventas disponible siempre, sin costo adicional.",
    },
    {
      titulo: "Marketing de contenidos acelerado",
      contenido:
        "Posts LinkedIn B2B. Copy Meta Ads Ecuador. Guiones TikTok. Emails de nurturing. Artículos SEO en español ecuatoriano. Horas de trabajo en minutos.",
    },
    {
      titulo: "El flujo de trabajo de ventas aumentado",
      contenido:
        "Reunión → notas 5 min → prompt estructurado → 2 min → propuesta + email seguimiento + respuestas objeciones. De 2 horas a 15 minutos.",
    },
    {
      titulo: "Objeciones más comunes en Ecuador y cómo manejarlas con IA",
      contenido:
        "'Está muy caro' — argumento de ROI. 'Lo pienso' — urgencia sin presión. 'Ya tenemos proveedor' — diferenciador específico. ChatGPT genera argumentos sector por sector.",
    },
    {
      titulo: "Personalización masiva con ChatGPT",
      contenido:
        "Lista de 50 prospectos + datos básicos de cada uno = 50 emails personalizados en 30 minutos. Personalización que antes era imposible a escala.",
    },
    {
      titulo: "Límites éticos del ChatGPT en ventas",
      contenido:
        "Nunca enviar sin revisión humana. Verificar datos factuales antes de incluirlos. No usar para engañar — el cliente que descubre el engaño nunca vuelve.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué porcentaje del tiempo del vendedor promedio se dedica a tareas administrativas?",
      opciones: ["10-15%", "20-25%", "35-50%", "60-70%"],
      respuesta: 2,
      explicacion:
        "Estudios de Salesforce y HubSpot indican que los vendedores dedican entre el 35% y el 50% del tiempo a tareas administrativas como redacción y seguimientos, en lugar de vender.",
    },
    {
      pregunta: "¿Qué significa BANT en el contexto de calificación de ventas?",
      opciones: [
        "Brand, Audience, Network, Time",
        "Budget, Authority, Need, Timeline",
        "Business, Analytics, Negotiation, Target",
        "Base, Approach, Nurture, Track",
      ],
      respuesta: 1,
      explicacion:
        "BANT es un framework de calificación de prospectos: Budget (presupuesto disponible), Authority (poder de decisión), Need (necesidad real), Timeline (urgencia del proyecto).",
    },
    {
      pregunta: "¿Cuál es la técnica de usar ChatGPT como cliente difícil para practicar ventas?",
      opciones: [
        "Prompt chaining",
        "Zero-shot learning",
        "Role-play de ventas",
        "Fine-tuning",
      ],
      respuesta: 2,
      explicacion:
        "El role-play de ventas con ChatGPT permite practicar manejo de objeciones con un cliente simulado disponible 24/7, con retroalimentación inmediata sobre las respuestas.",
    },
    {
      pregunta: "En el flujo de trabajo de ventas aumentado con IA, ¿cuánto tiempo toma generar propuesta + email + respuestas a objeciones?",
      opciones: ["2 horas (igual que antes)", "1 hora", "30 minutos", "Aproximadamente 15 minutos"],
      respuesta: 3,
      explicacion:
        "Con un prompt estructurado a partir de notas de 5 minutos, ChatGPT genera la propuesta, el email de seguimiento y respuestas a objeciones en aproximadamente 2 minutos de procesamiento más revisión.",
    },
    {
      pregunta: "¿Cuál es un límite ético clave al usar ChatGPT en ventas?",
      opciones: [
        "Nunca usar ChatGPT para emails",
        "No usar ChatGPT en B2B, solo B2C",
        "Nunca enviar outputs sin revisión humana y verificar datos factuales",
        "Limitar el uso a una tarea por semana",
      ],
      respuesta: 2,
      explicacion:
        "ChatGPT puede cometer errores factuales. En ventas, un dato incorrecto destruye credibilidad. La revisión humana antes de enviar es obligatoria, no opcional.",
    },
  ],
  ejercicio: {
    titulo: "Flujo de ventas completo asistido por ChatGPT",
    objetivo:
      "Construir y ejecutar el flujo completo de ventas B2B para un prospecto real usando ChatGPT en cada etapa del ciclo.",
    herramientas: "ChatGPT (cuenta gratuita o Plus), Google Docs para documentar, email real para práctica",
    datosEjemplo:
      "Prospecto de referencia: empresa constructora mediana en Quito, 40 empleados, obras en curso en el norte de Quito. Producto a vender: software de gestión de proyectos.",
    pasos: [
      "Paso 1 — Investigación del prospecto: Usa ChatGPT para generar una ficha de investigación del sector construcción en Ecuador: tamaños de empresa, desafíos típicos, jerga del sector, decisores clave. Documenta la ficha en Google Docs.",
      "Paso 2 — Guion de primer contacto: Con la ficha del paso 1, crea un prompt para que ChatGPT genere 3 versiones del primer email de contacto (tono formal, tono consultivo, tono directo). Evalúa cuál es más apropiada para el contexto ecuatoriano.",
      "Paso 3 — Preguntas BANT personalizadas: Genera con ChatGPT 10 preguntas BANT adaptadas a una constructora ecuatoriana. Las preguntas deben sonar naturales en una conversación, no como un formulario.",
      "Paso 4 — Propuesta desde notas: Simula una reunión de 20 minutos y toma notas breves (4-5 puntos clave). Usa esas notas como input de un prompt para que ChatGPT genere una propuesta de 2 páginas con estructura profesional.",
      "Paso 5 — Manejo de objeciones: Pide a ChatGPT que actúe como el gerente de la constructora con 3 objeciones específicas ('está caro', 'ya tenemos Excel', 'no es el momento'). Practica tus respuestas y pide retroalimentación al modelo.",
      "Paso 6 — Email de seguimiento personalizado: Basado en la simulación del paso 5, genera con ChatGPT el email de seguimiento post-reunión que aborde específicamente las objeciones mencionadas. Revisa y ajusta antes de 'enviarlo'.",
    ],
    resultado:
      "Flujo completo documentado: ficha de prospecto + 3 versiones de primer contacto + preguntas BANT + propuesta + transcripción de role-play + email de seguimiento.",
    criterios: [
      { criterio: "Ficha de investigación del sector con datos relevantes para Ecuador", puntos: 15 },
      { criterio: "3 versiones de primer contacto con evaluación comparativa", puntos: 20 },
      { criterio: "10 preguntas BANT personalizadas y naturales", puntos: 15 },
      { criterio: "Propuesta de 2 páginas generada desde notas breves", puntos: 25 },
      { criterio: "Role-play documentado con 3 objeciones y respuestas refinadas", puntos: 25 },
    ],
  },
  recursos: [
    {
      titulo: "HubSpot — Guía de ventas B2B con IA",
      url: "https://blog.hubspot.com/sales/ai-sales",
      tipo: "lectura",
      descripcion: "Guía actualizada de cómo integrar IA en el proceso de ventas B2B",
    },
    {
      titulo: "OpenAI ChatGPT",
      url: "https://chat.openai.com/",
      tipo: "herramienta",
      descripcion: "Plataforma principal de ChatGPT para uso en ventas y marketing",
    },
    {
      titulo: "Salesforce — State of Sales Report",
      url: "https://www.salesforce.com/resources/research-reports/state-of-sales/",
      tipo: "lectura",
      descripcion: "Reporte anual de Salesforce sobre tendencias y uso de IA en ventas",
    },
    {
      titulo: "Anthropic Claude — Alternativa para redacción",
      url: "https://claude.ai/",
      tipo: "herramienta",
      descripcion: "Modelo alternativo a ChatGPT con fortalezas en redacción larga y análisis",
    },
  ],
};

const tema7: TemaC2 = placeholder(7, "Copy publicitario con ChatGPT: Meta Ads y Google Ads", "ChatGPT en Ventas y Marketing", 2);
const tema8: TemaC2 = placeholder(8, "Email marketing automatizado con IA", "ChatGPT en Ventas y Marketing", 2);
const tema9: TemaC2 = placeholder(9, "Contenido para redes sociales a escala", "ChatGPT en Ventas y Marketing", 2);
const tema10: TemaC2 = placeholder(10, "Proyecto: estrategia de contenido mensual con ChatGPT", "ChatGPT en Ventas y Marketing", 2);

// ─── MÓDULO 3: AUTOMATIZACIÓN CON CHATGPT API ────────────────────────────────

const tema11: TemaC2 = {
  id: 11,
  titulo: "Introducción a la API de OpenAI: conectar ChatGPT a tus sistemas",
  modulo: "Automatización con ChatGPT API",
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "ChatGPT API: de usuario a constructor de aplicaciones IA",
  videoDuracion: "25 min",
  teoria: `La API de OpenAI es la diferencia entre usar ChatGPT y construir con ChatGPT. A través de la API, puedes integrar la inteligencia de GPT-4 directamente en tus aplicaciones, flujos de trabajo, formularios, bots de WhatsApp, sistemas de atención al cliente, y cualquier sistema que pueda hacer una solicitud HTTP. El costo de la API es por token usado, no por suscripción, lo que la hace accesible para PyMEs ecuatorianas que quieren automatizar tareas específicas.

El modelo de precios de la API de OpenAI (2024-2025) usa tokens. Un token equivale aproximadamente a 0.75 palabras en inglés o 0.6 palabras en español. GPT-4o Mini cuesta $0.15 por millón de tokens de entrada y $0.60 por millón de salida — para la mayoría de aplicaciones de negocio, esto representa menos de $20 al mes en uso intensivo. GPT-4o cuesta más pero ofrece mayor capacidad de razonamiento para tareas complejas.

La arquitectura básica de una llamada a la API tiene tres elementos: el mensaje de sistema (system prompt), que define el comportamiento global del asistente; los mensajes de usuario (user messages), que contienen las solicitudes específicas; y el historial de conversación (conversation history), que da contexto a respuestas anteriores. Manejar correctamente el historial es crucial — enviarlo completo cada vez aumenta costos, pero truncarlo incorrectamente pierde contexto.

Casos de automatización de alto impacto para empresas ecuatorianas: clasificación automática de emails entrantes por urgencia y tema; generación de respuestas sugeridas para el área de atención al cliente; extracción de datos estructurados de documentos (facturas, contratos, formularios en PDF); análisis de sentimiento de reseñas y comentarios de clientes; generación automática de informes desde datos crudos de ventas.

Para integrar sin programar, herramientas como Make (antes Integromat) y Zapier tienen conectores nativos con la API de OpenAI. Esto permite crear flujos donde, por ejemplo: llega un formulario de Google Forms → se envía a ChatGPT para análisis → se crea una tarea en Notion → se envía un email de confirmación personalizado. Todo sin escribir una línea de código.`,
  presentacionSlides: [
    {
      titulo: "API de OpenAI: de usuario a constructor",
      contenido:
        "La API integra GPT-4 en tus sistemas via HTTP. Costo por token, no suscripción fija. GPT-4o Mini: $0.15/M tokens entrada. Accesible para PyMEs ecuatorianas.",
    },
    {
      titulo: "Tokens: la unidad de medida de la API",
      contenido:
        "1 token ≈ 0.75 palabras inglés / 0.6 palabras español. GPT-4o Mini: $0.15 entrada + $0.60 salida por millón. Uso intensivo de negocio: menos de $20/mes.",
    },
    {
      titulo: "Arquitectura de una llamada a la API",
      contenido:
        "System prompt: comportamiento global del asistente. User messages: solicitudes específicas. Conversation history: contexto de respuestas anteriores. Los tres son mensajes de rol diferente.",
    },
    {
      titulo: "Gestión del historial: el balance costo-contexto",
      contenido:
        "Enviar historial completo = máximo contexto, máximo costo. Truncar incorrectamente = pérdida de contexto. Estrategia: ventana deslizante de últimos N mensajes relevantes.",
    },
    {
      titulo: "5 automatizaciones de alto impacto para Ecuador",
      contenido:
        "1. Clasificación de emails por urgencia. 2. Respuestas sugeridas de atención al cliente. 3. Extracción de datos de facturas/contratos. 4. Análisis de sentimiento de reseñas. 5. Informes automáticos de ventas.",
    },
    {
      titulo: "Integración sin código: Make y Zapier",
      contenido:
        "Make y Zapier tienen conectores nativos con OpenAI API. Ejemplo: Google Forms → ChatGPT análisis → Notion tarea → email confirmación. Sin programar.",
    },
    {
      titulo: "Seguridad en la API: prácticas obligatorias",
      contenido:
        "API key en variables de entorno, nunca en código. Rate limiting para controlar costos. Input sanitization para evitar prompt injection. Logs de uso para auditoría.",
    },
    {
      titulo: "Parámetros clave de la API",
      contenido:
        "Temperature (0-2): creatividad vs determinismo. Max tokens: longitud máxima. Top_p: diversidad de vocabulario. Frequency penalty: evita repeticiones. Para negocios: temperature 0.3-0.7.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la principal diferencia entre usar ChatGPT.com y usar la API de OpenAI?",
      opciones: [
        "La API es más lenta que la interfaz web",
        "La API permite integrar GPT en sistemas propios y automatizar flujos de trabajo",
        "La API solo funciona en inglés",
        "La API requiere un equipo de 10 programadores",
      ],
      respuesta: 1,
      explicacion:
        "La API transforma ChatGPT de una herramienta de uso manual a un componente integrable en cualquier sistema que haga solicitudes HTTP, habilitando automatizaciones a escala.",
    },
    {
      pregunta: "¿Aproximadamente cuántas palabras en español equivalen a 1 millón de tokens?",
      opciones: ["750,000 palabras", "600,000 palabras", "1,000,000 palabras", "300,000 palabras"],
      respuesta: 1,
      explicacion:
        "En español, 1 token equivale aproximadamente a 0.6 palabras, por lo que 1 millón de tokens representa alrededor de 600,000 palabras en español.",
    },
    {
      pregunta: "En la arquitectura de la API, ¿qué define el 'system prompt'?",
      opciones: [
        "El mensaje específico del usuario en cada turno",
        "El historial de la conversación anterior",
        "El comportamiento global y el rol del asistente para toda la sesión",
        "El modelo de lenguaje a usar (GPT-4 vs GPT-3.5)",
      ],
      respuesta: 2,
      explicacion:
        "El system prompt establece las instrucciones persistentes que guían el comportamiento del modelo durante toda la conversación, independientemente de lo que el usuario pregunte.",
    },
    {
      pregunta: "Para automatizar sin programar usando la API de OpenAI, ¿qué herramientas son más adecuadas?",
      opciones: [
        "AWS Lambda y Docker",
        "Make (Integromat) y Zapier",
        "React y Node.js",
        "Tableau y Power BI",
      ],
      respuesta: 1,
      explicacion:
        "Make y Zapier tienen conectores nativos con la API de OpenAI y permiten crear flujos automatizados complejos sin escribir código, ideales para equipos sin desarrolladores.",
    },
    {
      pregunta: "¿Qué valor de 'temperature' es más recomendable para tareas de negocio que requieren respuestas consistentes?",
      opciones: [
        "Temperature 2.0 (máxima creatividad)",
        "Temperature 1.5",
        "Temperature 0.3-0.7",
        "Temperature 0.0 siempre",
      ],
      respuesta: 2,
      explicacion:
        "Para aplicaciones de negocio, temperature entre 0.3 y 0.7 ofrece un balance entre consistencia (necesaria para tareas repetibles) y algo de variación natural en el lenguaje.",
    },
  ],
  ejercicio: {
    titulo: "Primer flujo automatizado con ChatGPT API y Make",
    objetivo:
      "Construir un flujo de automatización funcional que use la API de OpenAI para procesar datos de negocio sin escribir código.",
    herramientas: "Make.com (plan gratuito), cuenta de OpenAI con API key, Google Forms, Google Sheets, Gmail",
    datosEjemplo:
      "Caso: empresa de servicios de contabilidad en Quito recibe consultas de clientes por formulario web. Necesita clasificar automáticamente cada consulta por urgencia y generar una respuesta inicial personalizada.",
    pasos: [
      "Paso 1 — Obtener API key: Crear cuenta en platform.openai.com. Generar una API key en la sección API Keys. Guardarla en un lugar seguro (nunca en documentos compartidos).",
      "Paso 2 — Crear el formulario de entrada: En Google Forms, crear un formulario con campos: nombre del cliente, empresa, RUC, tipo de consulta (dropdown), descripción del problema (texto largo), urgencia percibida (1-5).",
      "Paso 3 — Conectar Make con Google Forms: En Make.com, crear un nuevo escenario. Agregar el módulo 'Google Forms — Watch Responses'. Conectar con el formulario del paso 2.",
      "Paso 4 — Agregar módulo de OpenAI: Agregar el módulo 'OpenAI — Create a Chat Completion'. Configurar con tu API key. En el system prompt, definir el rol del asistente de contabilidad. En el user message, mapear los campos del formulario.",
      "Paso 5 — Procesar la respuesta: Agregar módulo de Google Sheets para registrar la consulta + clasificación de urgencia generada por ChatGPT. Agregar módulo de Gmail para enviar la respuesta automática al cliente.",
      "Paso 6 — Probar con 5 casos: Enviar 5 consultas de prueba con diferentes niveles de urgencia y tipos. Verificar que la clasificación sea correcta, las respuestas sean apropiadas y los registros en Sheets estén completos.",
    ],
    resultado:
      "Flujo funcional en Make que clasifica consultas de clientes, registra en Sheets y envía respuesta automática personalizada usando ChatGPT API.",
    criterios: [
      { criterio: "API key configurada correctamente en Make (no expuesta)", puntos: 15 },
      { criterio: "Formulario con campos relevantes y sistema prompt bien definido", puntos: 20 },
      { criterio: "Flujo completo funcional (Forms → OpenAI → Sheets → Gmail)", puntos: 30 },
      { criterio: "5 casos de prueba documentados con evaluación de calidad de respuestas", puntos: 25 },
      { criterio: "Identificación de al menos 2 mejoras posibles al flujo", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "OpenAI — Documentación oficial de la API",
      url: "https://platform.openai.com/docs/",
      tipo: "documentacion",
      descripcion: "Documentación completa de la API de OpenAI con ejemplos y referencia técnica",
    },
    {
      titulo: "Make.com — Automatización sin código",
      url: "https://www.make.com/",
      tipo: "herramienta",
      descripcion: "Plataforma de automatización con conector nativo para OpenAI API",
    },
    {
      titulo: "OpenAI — Tokenizer",
      url: "https://platform.openai.com/tokenizer",
      tipo: "herramienta",
      descripcion: "Herramienta oficial para calcular el número de tokens en un texto",
    },
    {
      titulo: "OpenAI — Pricing actualizado",
      url: "https://openai.com/api/pricing/",
      tipo: "documentacion",
      descripcion: "Precios actualizados de todos los modelos de la API de OpenAI",
    },
  ],
};

const tema12: TemaC2 = placeholder(12, "Funciones y herramientas: ChatGPT que ejecuta acciones", "Automatización con ChatGPT API", 3);
const tema13: TemaC2 = placeholder(13, "Asistentes personalizados con la API Assistants", "Automatización con ChatGPT API", 3);
const tema14: TemaC2 = placeholder(14, "Procesamiento de documentos con IA (PDF, CSV, imágenes)", "Automatización con ChatGPT API", 3);
const tema15: TemaC2 = placeholder(15, "Proyecto: chatbot de atención al cliente para empresa ecuatoriana", "Automatización con ChatGPT API", 3);

// ─── MÓDULO 4: CASOS PRÁCTICOS SECTORIALES ECUADOR ───────────────────────────

const tema16: TemaC2 = {
  id: 16,
  titulo: "ChatGPT en sectores clave de Ecuador: salud, retail, construcción y educación",
  modulo: "Casos Prácticos Sectoriales Ecuador",
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "IA sectorial Ecuador: casos reales y resultados medibles",
  videoDuracion: "28 min",
  teoria: `Ecuador tiene una economía diversificada con sectores de alto potencial para la adopción de IA conversacional. Analizar casos concretos por sector elimina la abstracción y permite que cada profesional identifique aplicaciones directas en su contexto. Este tema presenta 4 sectores con implementaciones reales y métricas documentadas.

Sector salud: Las clínicas y consultorios privados en Ecuador enfrentan tres problemas crónicos que ChatGPT puede mitigar. Primero, el 30-40% de citas agendadas resultan en inasistencias (dato respaldado por estudios de gestión hospitalaria latinoamericana). Un sistema de recordatorios personalizados generados por IA y enviados por WhatsApp puede reducir esta tasa al 10-15%. Segundo, la documentación clínica consume en promedio 2 horas del médico por cada 8 horas de atención. Dictado de voz + transcripción + estructuración con IA puede reducirlo a 20 minutos. Tercero, las preguntas frecuentes de pacientes (¿cómo prepararme para el examen?, ¿cuáles son los síntomas de alarma?) consumen tiempo de enfermería que puede automatizarse.

Sector retail y distribución: Las cadenas de retail medianas en Ecuador (entre 3 y 15 locales) gestionan catálogos de 2,000 a 50,000 SKUs. ChatGPT con acceso a datos de inventario puede generar automáticamente: descripciones de producto optimizadas para e-commerce, respuestas a consultas de disponibilidad, análisis de rotación de inventario en lenguaje natural, y sugerencias de reorden basadas en histórico. Un caso documentado en Guayaquil: distribuidora de productos de limpieza redujo el tiempo de generación de cotizaciones de 45 minutos a 4 minutos usando un bot interno con ChatGPT API.

Sector construcción: Las constructoras medianas en Quito y Guayaquil tienen problemas de comunicación entre obra y oficina. Un asistente interno entrenado en el historial de proyectos puede responder preguntas como: ¿cuánto costó el m² de hormigón en el proyecto X?, ¿qué subcontratistas usamos para instalaciones eléctricas?, ¿cuál fue la variación de presupuesto promedio en nuestros últimos 5 proyectos?

Sector educación y capacitación: Las instituciones de formación (institutos técnicos, universidades privadas) pueden usar ChatGPT para: generación de material didáctico personalizado por nivel, evaluación automática de ensayos con rubrica definida, tutorías virtuales disponibles 24/7, y análisis de rendimiento académico con recomendaciones individuales.`,
  presentacionSlides: [
    {
      titulo: "Por qué casos sectoriales y no genéricos",
      contenido:
        "La abstracción paraliza la adopción. Los casos concretos por sector eliminan la brecha entre 'entiendo la teoría' y 'veo cómo aplicarlo en mi negocio'.",
    },
    {
      titulo: "Salud: 3 problemas con solución IA inmediata",
      contenido:
        "1. Inasistencias 30-40% → recordatorios IA por WhatsApp → 10-15%. 2. Documentación 2h/jornada → dictado + IA → 20 min. 3. Preguntas frecuentes de pacientes → chatbot 24/7.",
    },
    {
      titulo: "Retail y distribución: del catálogo al chat",
      contenido:
        "2,000-50,000 SKUs en empresas medianas. IA genera: descripciones e-commerce, respuestas de disponibilidad, análisis de rotación, sugerencias de reorden. Caso Guayaquil: cotizaciones de 45 min a 4 min.",
    },
    {
      titulo: "Construcción: la memoria institucional digital",
      contenido:
        "Bot entrenado en historial de proyectos responde: costo m² hormigón, subcontratistas usados, variación de presupuesto histórica. La experiencia de la empresa, siempre disponible.",
    },
    {
      titulo: "Educación: personalización a escala",
      contenido:
        "Material didáctico por nivel. Evaluación automática de ensayos. Tutorías 24/7. Análisis de rendimiento con recomendaciones individuales. ITSEIA como caso propio.",
    },
    {
      titulo: "Factores de éxito comunes en los 4 sectores",
      contenido:
        "1. Empezar con un problema doloroso y medible. 2. MVP en 2 semanas máximo. 3. Integrar al flujo existente, no crear uno nuevo. 4. Medir antes y después con la misma métrica.",
    },
    {
      titulo: "Barreras de adopción en Ecuador y cómo superarlas",
      contenido:
        "Resistencia del equipo: involucrar desde el diseño. Desconfianza en IA: empezar con tarea de bajo riesgo. Costo percibido alto: mostrar ROI en la primera semana.",
    },
    {
      titulo: "Tu plan de implementación en 30 días",
      contenido:
        "Día 1-7: elegir el problema más doloroso de tu sector. Día 8-14: construir el MVP con herramientas del módulo 3. Día 15-30: medir, ajustar, documentar el caso para replicar.",
    },
  ],
  quiz: [
    {
      pregunta: "En el sector salud ecuatoriano, ¿qué tasa de inasistencias a citas es típica sin intervención de IA?",
      opciones: ["5-10%", "15-20%", "30-40%", "50-60%"],
      respuesta: 2,
      explicacion:
        "La tasa de inasistencias en clínicas privadas latinoamericanas oscila entre el 30% y el 40%. Los sistemas de recordatorio automatizado pueden reducirla al 10-15%.",
    },
    {
      pregunta: "¿En cuánto tiempo redujo sus cotizaciones la distribuidora de Guayaquil mencionada en el tema?",
      opciones: ["De 2 horas a 30 minutos", "De 45 minutos a 4 minutos", "De 1 hora a 15 minutos", "De 30 minutos a 10 minutos"],
      respuesta: 1,
      explicacion:
        "La distribuidora de productos de limpieza en Guayaquil redujo el tiempo de generación de cotizaciones de 45 minutos a 4 minutos usando un bot interno con ChatGPT API.",
    },
    {
      pregunta: "¿Qué tipo de datos necesita el asistente IA de una constructora para ser útil?",
      opciones: [
        "Datos de redes sociales de la empresa",
        "Historial de proyectos: costos, subcontratistas, variaciones de presupuesto",
        "Información pública del sector en internet",
        "Datos de competidores",
      ],
      respuesta: 1,
      explicacion:
        "El valor del asistente para constructoras está en la memoria institucional: el historial propio de proyectos que contiene la experiencia acumulada de la empresa.",
    },
    {
      pregunta: "¿Cuál es el primer factor de éxito común en implementaciones de IA en los 4 sectores analizados?",
      opciones: [
        "Tener un equipo técnico de al menos 5 personas",
        "Comprar el plan más caro de ChatGPT",
        "Empezar con un problema doloroso y medible",
        "Implementar en todos los departamentos simultáneamente",
      ],
      respuesta: 2,
      explicacion:
        "Empezar con un problema concreto y medible permite demostrar ROI rápidamente, superar resistencias internas y generar momentum para la adopción.",
    },
    {
      pregunta: "¿En cuántos días se recomienda construir el MVP de implementación IA en tu sector?",
      opciones: [
        "6 meses (planificación rigurosa)",
        "3 meses",
        "1 mes completo",
        "Máximo 2 semanas",
      ],
      respuesta: 3,
      explicacion:
        "Un MVP de IA en 2 semanas máximo es el estándar recomendado. Más tiempo significa más oportunidad de que el proyecto se paralice por burocracia o pérdida de momentum.",
    },
  ],
  ejercicio: {
    titulo: "Caso de implementación sectorial: diseño y presentación",
    objetivo:
      "Diseñar una implementación completa de ChatGPT para una empresa real de tu sector, con métricas de éxito y plan de 30 días.",
    herramientas: "ChatGPT para prototipar, Canva o Google Slides para presentación, Make.com para flujo de automatización",
    datosEjemplo:
      "Si no tienes empresa propia, elige una de las siguientes: clínica dental en Quito (12 doctores), ferretería en Guayaquil (3 locales), constructora residencial en Cuenca (proyectos $500K-$2M), instituto de inglés en Quito (800 estudiantes).",
    pasos: [
      "Paso 1 — Seleccionar empresa y sector: Elige tu empresa real o una del listado. Documenta: sector, tamaño, número de empleados, procesos principales, herramientas actuales que usa.",
      "Paso 2 — Identificar el problema más doloroso: Usa ChatGPT para analizar los desafíos típicos del sector. Selecciona el problema con mayor impacto medible. Define la métrica actual (ej: 'generamos 30 cotizaciones/semana y tardamos 40 min cada una').",
      "Paso 3 — Diseñar la solución IA: Diseña la solución técnica: qué modelo, qué datos de entrada, qué output, cómo se integra al flujo actual. Dibuja el diagrama de flujo en papel o Miro.",
      "Paso 4 — Construir el prototipo: Usa las herramientas del módulo 3 (Make + OpenAI API o ChatGPT con Custom Instructions) para construir una versión funcional mínima. No tiene que ser perfecta — debe demostrar el concepto.",
      "Paso 5 — Medir el impacto: Ejecutar 10 casos reales o simulados con el prototipo. Medir el tiempo antes vs. después. Calcular el ahorro semanal, mensual y anual en horas y en dinero (costo hora del empleado x horas ahorradas).",
      "Paso 6 — Presentación de 10 minutos: Presenta ante el grupo: el problema, la solución, la demo en vivo, las métricas de impacto medidas, los próximos 3 pasos para llevarla a producción.",
    ],
    resultado:
      "Implementación prototipada con métricas de impacto medidas y presentación ejecutiva de 10 minutos lista para presentar a la dirección de la empresa.",
    criterios: [
      { criterio: "Problema bien definido con métrica actual documentada", puntos: 15 },
      { criterio: "Diseño de solución con diagrama de flujo", puntos: 20 },
      { criterio: "Prototipo funcional demostrable (aunque sea básico)", puntos: 25 },
      { criterio: "Métricas de impacto calculadas con 10 casos reales o simulados", puntos: 25 },
      { criterio: "Presentación ejecutiva con demo en vivo y plan de próximos pasos", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "OpenAI — Casos de uso por industria",
      url: "https://openai.com/customer-stories/",
      tipo: "lectura",
      descripcion: "Casos de éxito documentados por OpenAI en diferentes sectores e industrias",
    },
    {
      titulo: "Make.com — Templates de automatización",
      url: "https://www.make.com/en/templates",
      tipo: "herramienta",
      descripcion: "Biblioteca de plantillas de automatización listas para usar con OpenAI",
    },
    {
      titulo: "McKinsey — The economic potential of generative AI",
      url: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai",
      tipo: "lectura",
      descripcion: "Análisis de McKinsey sobre el potencial económico de la IA generativa por sector",
    },
    {
      titulo: "Zapier — Guía de automatización con ChatGPT",
      url: "https://zapier.com/blog/chatgpt-automation/",
      tipo: "documentacion",
      descripcion: "Guía práctica de Zapier para automatizar procesos de negocio con ChatGPT",
    },
  ],
};

const tema17: TemaC2 = placeholder(17, "ChatGPT en el sector financiero y bancario ecuatoriano", "Casos Prácticos Sectoriales Ecuador", 4);
const tema18: TemaC2 = placeholder(18, "IA conversacional en atención al cliente multicanal", "Casos Prácticos Sectoriales Ecuador", 4);
const tema19: TemaC2 = placeholder(19, "Gobierno corporativo e IA: uso ético y políticas internas", "Casos Prácticos Sectoriales Ecuador", 4);
const tema20: TemaC2 = placeholder(20, "Proyecto final: implementación IA presentada ante panel de empresarios", "Casos Prácticos Sectoriales Ecuador", 4);

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const C2_TEMAS: TemaC2[] = [
  tema1,  tema2,  tema3,  tema4,  tema5,
  tema6,  tema7,  tema8,  tema9,  tema10,
  tema11, tema12, tema13, tema14, tema15,
  tema16, tema17, tema18, tema19, tema20,
];
