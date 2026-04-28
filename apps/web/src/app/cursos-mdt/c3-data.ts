// ─── C3: Automatización con IA — Datos de 20 temas ───────────────────────────
// Curso C3 del programa MDT. 20 temas (scaffolding).
// Módulo 1: Notion AI y productividad personal
// Módulo 2: Make/Zapier + IA para flujos de trabajo
// Módulo 3: WhatsApp + AI workflows
// Módulo 4: Casos reales de empresas Ecuador

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

export interface TemaC3 {
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

export const C3_MODULOS = [
  { num: 1, nombre: "Notion AI y Productividad Personal", horas: 10, temas: 5 },
  { num: 2, nombre: "Make/Zapier + IA para Flujos de Trabajo", horas: 10, temas: 5 },
  { num: 3, nombre: "WhatsApp + AI Workflows", horas: 10, temas: 5 },
  { num: 4, nombre: "Casos Reales Empresas Ecuador", horas: 10, temas: 5 },
];

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC3 => ({
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

// ─── MÓDULO 1: NOTION AI Y PRODUCTIVIDAD PERSONAL ────────────────────────────

const tema1: TemaC3 = {
  id: 1,
  titulo: "Notion AI como sistema operativo personal: documentos, tareas y conocimiento",
  modulo: "Notion AI y Productividad Personal",
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Notion AI: convierte tu espacio de trabajo en un asistente inteligente",
  videoDuracion: "22 min",
  teoria: `Notion AI transforma una herramienta de notas y gestión de proyectos en un asistente inteligente integrado directamente en tu flujo de trabajo. La diferencia fundamental respecto a abrir ChatGPT en otra pestaña es el contexto: Notion AI tiene acceso inmediato a todos tus documentos, bases de datos y notas, lo que le permite generar contenido, resumir información y responder preguntas con el conocimiento específico de tu organización.

En 2024, Notion AI incorporó la función "Ask AI about this page", que permite hacer preguntas en lenguaje natural sobre cualquier documento. Para una empresa ecuatoriana con manuales de procedimientos, contratos, y reportes almacenados en Notion, esto significa que cualquier miembro del equipo puede preguntar "¿cuáles son los plazos de pago estipulados en el contrato con Proveedor X?" y obtener la respuesta en segundos, sin buscar manualmente.

Las capacidades de Notion AI más valiosas para empresas se dividen en cuatro categorías. Primera, generación de contenido: redactar actas de reunión desde notas breves, generar agendas de reunión, crear documentos de onboarding, escribir SOPs (procedimientos estándar de operación). Segunda, síntesis y resumen: resumir documentos largos, extraer puntos de acción de transcripciones, condensar reportes. Tercera, mejora de escritura: corregir gramática y tono, traducir entre inglés y español, adaptar el nivel de formalidad según la audiencia. Cuarta, análisis de base de datos: con la integración de AI en bases de datos de Notion, se pueden generar insights, clasificar registros automáticamente y extraer patrones.

Para profesionales ecuatorianos, Notion AI ofrece una ventaja particular en la gestión del conocimiento bilingüe. El entorno de trabajo en Ecuador mezcla constantemente español e inglés, especialmente en sectores de tecnología, finanzas y comercio exterior. Notion AI puede trabajar en ambos idiomas de forma fluida, generando contenido en el idioma que necesites sin salir de tu workspace.

La implementación más efectiva de Notion AI sigue un patrón de tres fases: primero, auditar qué información existe en Notion y cuál está fuera (en emails, WhatsApp, documentos de Word); segundo, migrar los documentos críticos a Notion con estructura consistente; tercero, crear plantillas de página con prompts de AI preconfigurados para tareas recurrentes. Esta preparación hace que el AI sea dramáticamente más útil desde el primer día.`,
  presentacionSlides: [
    {
      titulo: "Por qué Notion AI es diferente a ChatGPT",
      contenido:
        "Contexto integrado: tiene acceso a todos tus documentos y bases de datos. No hay que copiar y pegar. El AI conoce tu empresa, tus proyectos, tus contratos.",
    },
    {
      titulo: "Ask AI: preguntas en lenguaje natural sobre tus documentos",
      contenido:
        "'¿Cuáles son los plazos de pago del contrato con Proveedor X?' Respuesta instantánea sin búsqueda manual. El AI lee y razona sobre tus páginas de Notion.",
    },
    {
      titulo: "4 categorías de capacidades Notion AI",
      contenido:
        "1. Generación: actas, agendas, SOPs. 2. Síntesis: resumir, extraer acciones. 3. Mejora de escritura: gramática, tono, traducción. 4. Análisis de bases de datos: clasificar, extraer patrones.",
    },
    {
      titulo: "Ventaja bilingüe para profesionales ecuatorianos",
      contenido:
        "Ecuador mezcla español e inglés en sectores tech, finanzas, comercio exterior. Notion AI trabaja en ambos idiomas sin cambiar de herramienta.",
    },
    {
      titulo: "Las 3 fases de implementación efectiva",
      contenido:
        "Fase 1: Auditar qué información existe y dónde. Fase 2: Migrar documentos críticos con estructura consistente. Fase 3: Crear plantillas con prompts AI preconfigurados.",
    },
    {
      titulo: "Plantillas de alto impacto para empresas ecuatorianas",
      contenido:
        "Acta de reunión con AI (rellena automáticamente desde notas). SOP con AI (genera el procedimiento desde descripción verbal). Análisis de cliente con AI (genera ficha desde datos básicos).",
    },
    {
      titulo: "Notion AI en gestión de proyectos",
      contenido:
        "Generar plan de proyecto desde objetivo. Actualizar estados con IA. Identificar dependencias y riesgos. Generar reportes de avance desde los datos de la base de datos.",
    },
    {
      titulo: "Límites de Notion AI y cuándo usar ChatGPT",
      contenido:
        "Notion AI: mejor para trabajar con tus documentos. ChatGPT: mejor para tareas creativas externas o razonamiento complejo. Usar los dos de forma complementaria.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la ventaja principal de Notion AI sobre usar ChatGPT por separado?",
      opciones: [
        "Notion AI es más barato que ChatGPT",
        "Notion AI tiene acceso directo al contexto de tus documentos y bases de datos sin copiar y pegar",
        "Notion AI puede escribir código mejor que ChatGPT",
        "Notion AI funciona sin conexión a internet",
      ],
      respuesta: 1,
      explicacion:
        "El contexto integrado es el diferenciador clave. Notion AI puede razonar sobre tus documentos específicos sin necesidad de copiar el contenido a otra herramienta.",
    },
    {
      pregunta: "¿Qué función de Notion AI permite hacer preguntas sobre el contenido de tus páginas?",
      opciones: [
        "AI Writer",
        "Ask AI about this page",
        "Smart Search",
        "Document Reader",
      ],
      respuesta: 1,
      explicacion:
        "La función 'Ask AI about this page' permite hacer preguntas en lenguaje natural sobre cualquier documento de Notion y obtener respuestas basadas en su contenido.",
    },
    {
      pregunta: "¿Cuál es la primera fase de una implementación efectiva de Notion AI en una empresa?",
      opciones: [
        "Crear plantillas con prompts AI preconfigurados",
        "Pagar el plan Team de Notion",
        "Auditar qué información existe y dónde está almacenada",
        "Migrar todos los correos electrónicos a Notion",
      ],
      respuesta: 2,
      explicacion:
        "La auditoría de información es el primer paso. Sin saber qué existe y dónde, la migración y configuración del AI serán incompletas e ineficientes.",
    },
    {
      pregunta: "Para una empresa ecuatoriana del sector finanzas, ¿cuál categoría de Notion AI sería más valiosa inicialmente?",
      opciones: [
        "Mejora de escritura — corregir gramática de emails",
        "Síntesis — resumir reportes largos y extraer puntos de acción de reuniones",
        "Traducción — convertir documentos del inglés al español",
        "Generación de imágenes para presentaciones",
      ],
      respuesta: 1,
      explicacion:
        "El sector financiero genera grandes volúmenes de reportes y reuniones. La síntesis y extracción de puntos de acción tiene el mayor impacto inmediato en productividad.",
    },
    {
      pregunta: "¿Cuándo es preferible usar ChatGPT en lugar de Notion AI?",
      opciones: [
        "Siempre — ChatGPT es superior en todos los casos",
        "Nunca — Notion AI reemplaza completamente a ChatGPT",
        "Para tareas creativas externas o razonamiento complejo que no requieren contexto de tus documentos",
        "Solo para tareas en inglés",
      ],
      respuesta: 2,
      explicacion:
        "Notion AI y ChatGPT son complementarios. Notion AI brilla cuando el contexto de tus documentos es relevante; ChatGPT es mejor para tareas que requieren conocimiento externo amplio.",
    },
  ],
  ejercicio: {
    titulo: "Sistema operativo personal en Notion con IA integrada",
    objetivo:
      "Construir un workspace de Notion con plantillas de AI para las 5 tareas más repetitivas de tu rol profesional, y medir el ahorro de tiempo.",
    herramientas: "Notion (plan gratuito o Plus con AI), acceso a documentos reales de trabajo para migrar",
    datosEjemplo:
      "Rol de referencia: coordinador de ventas en empresa distribuidora, Quito. Tareas repetitivas: actas de reunión con clientes, seguimientos de cotizaciones, reportes semanales de ventas, onboarding de nuevos clientes, respuestas a preguntas frecuentes internas.",
    pasos: [
      "Paso 1 — Auditoría de información: Lista todos los lugares donde guardas información laboral (emails, WhatsApp, Excel, Word, carpetas de Google Drive). Identifica los 3 documentos más consultados por tu equipo.",
      "Paso 2 — Migrar los 3 documentos críticos: Importa o recrea esos documentos en Notion con estructura de títulos y secciones clara. Verifica que Notion AI pueda hacer preguntas sobre ellos usando 'Ask AI about this page'.",
      "Paso 3 — Crear 5 plantillas con AI preconfigurada: Para cada una de tus 5 tareas repetitivas, crea una plantilla de Notion que incluya un bloque de AI con el prompt preconfigurado (ej: 'Basándote en las notas de esta reunión, genera un acta con: asistentes, decisiones, compromisos con fechas y responsables').",
      "Paso 4 — Ejecutar 10 tareas reales: Durante 5 días, usa las plantillas AI para ejecutar 2 tareas repetitivas por día. Registra en una tabla: tarea, tiempo antes (estimado), tiempo con Notion AI, calidad del output (1-5).",
      "Paso 5 — Calcular el ROI: Suma las horas ahorradas en las 10 tareas. Proyecta el ahorro mensual y anual. Calcula en dinero si tu costo hora es $10, $15 o $25.",
      "Paso 6 — Presentar el sistema: Muestra el workspace en Notion con 3 plantillas en demostración en vivo. Presenta la tabla de resultados con ahorro medido. Describe las 2 mejoras que implementarías el próximo mes.",
    ],
    resultado:
      "Workspace de Notion con 5 plantillas AI funcionales, 10 tareas ejecutadas con métricas de tiempo antes/después, y cálculo de ROI mensual documentado.",
    criterios: [
      { criterio: "3 documentos críticos migrados con estructura correcta y AI consultable", puntos: 20 },
      { criterio: "5 plantillas con prompts AI relevantes y bien configurados", puntos: 25 },
      { criterio: "10 tareas ejecutadas con tabla de comparación de tiempos", puntos: 25 },
      { criterio: "Cálculo de ROI con proyección mensual y anual", puntos: 20 },
      { criterio: "Demostración en vivo de al menos 3 plantillas", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "Notion AI — Documentación oficial",
      url: "https://www.notion.so/help/notion-ai",
      tipo: "documentacion",
      descripcion: "Guía oficial de todas las capacidades de Notion AI con ejemplos de uso",
    },
    {
      titulo: "Notion — Plantillas de la comunidad",
      url: "https://www.notion.so/templates",
      tipo: "herramienta",
      descripcion: "Biblioteca de plantillas gratuitas y de pago para diferentes casos de uso",
    },
    {
      titulo: "Notion — API para integraciones",
      url: "https://developers.notion.com/",
      tipo: "documentacion",
      descripcion: "Documentación de la API de Notion para integraciones con otras herramientas",
    },
    {
      titulo: "Thomas Frank — Canal YouTube sobre Notion",
      url: "https://www.youtube.com/@ThomasFrankExplains",
      tipo: "lectura",
      descripcion: "Canal de referencia con tutoriales avanzados de Notion y Notion AI",
    },
  ],
};

const tema2: TemaC3 = placeholder(2, "Bases de datos inteligentes en Notion: filtros, relaciones y fórmulas con AI", "Notion AI y Productividad Personal", 1);
const tema3: TemaC3 = placeholder(3, "Gestión de proyectos con Notion AI: roadmaps y seguimiento", "Notion AI y Productividad Personal", 1);
const tema4: TemaC3 = placeholder(4, "Notion como wiki empresarial: documentación que se mantiene sola", "Notion AI y Productividad Personal", 1);
const tema5: TemaC3 = placeholder(5, "Proyecto: sistema de gestión empresarial completo en Notion", "Notion AI y Productividad Personal", 1);

// ─── MÓDULO 2: MAKE/ZAPIER + IA PARA FLUJOS DE TRABAJO ───────────────────────

const tema6: TemaC3 = {
  id: 6,
  titulo: "Make vs Zapier: cuándo usar cada uno y cómo integrar IA en tus flujos",
  modulo: "Make/Zapier + IA para Flujos de Trabajo",
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Make y Zapier con IA: automatiza lo repetitivo, enfócate en lo importante",
  videoDuracion: "24 min",
  teoria: `Make (antes Integromat) y Zapier son las dos plataformas dominantes de automatización sin código. Ambas permiten conectar aplicaciones mediante flujos visuales, pero tienen filosofías y fortalezas distintas que determinan cuál es la herramienta correcta para cada caso.

Zapier se diseñó con el principio de simplicidad máxima: cada automatización es un Zap con un trigger y una o más acciones lineales. Su fortaleza es la facilidad de configuración, su biblioteca de más de 6,000 aplicaciones integradas, y la curva de aprendizaje más suave. Para automatizaciones simples como "cuando llega un email con facturas adjuntas, guarda el adjunto en Google Drive y crea una tarea en Asana", Zapier es la elección correcta. El plan gratuito permite 100 tareas al mes con Zaps de un solo paso.

Make tiene una filosofía más poderosa: los escenarios son flujos visuales que pueden incluir ramas condicionales, bucles, manejo de errores, transformación de datos y lógica compleja. Para un empresario ecuatoriano que quiere automatizar el procesamiento de pedidos (recibir pedido por WhatsApp → verificar stock en Excel → generar cotización con IA → enviar al cliente → registrar en CRM → alertar a bodega si hay que reponer), Make es claramente superior. El plan gratuito incluye 1,000 operaciones al mes.

La integración de IA en los flujos de Make/Zapier transforma la automatización de "si esto, entonces aquello" a "si esto, analiza con IA y luego decide qué hacer". Los módulos de OpenAI en Make permiten incorporar decisiones inteligentes en cualquier punto del flujo. Ejemplos concretos: clasificar el sentimiento de un mensaje antes de decidir qué respuesta enviar; extraer datos estructurados de un texto libre (una descripción de problema de soporte) antes de crear el ticket; generar un resumen de reunión antes de enviar el email; traducir automáticamente documentos en el flujo de trabajo.

El costo de las automatizaciones con IA en Ecuador es sorprendentemente bajo para el valor que generan. Un escenario de Make que procesa 500 pedidos al mes, enriquece cada uno con análisis de IA y genera confirmaciones personalizadas puede costar menos de $15 al mes (plan básico de Make + consumo de API de OpenAI). Para un equipo que antes tardaba 3 horas diarias en esas tareas, el ROI es inmediato.

La gobernanza de automatizaciones es el aspecto más descuidado. Cada flujo activo debe tener: documentación de lo que hace, quién es el responsable, qué pasa si falla, y cómo se alerta. Un flujo de Make que falla silenciosamente puede causar pérdidas sin que nadie lo note por días. La regla: todo flujo de producción tiene alertas de error configuradas.`,
  presentacionSlides: [
    {
      titulo: "Make vs Zapier: la decisión correcta",
      contenido:
        "Zapier: simplicidad, 6,000+ apps, ideal para flujos lineales. Make: lógica compleja, bucles, condicionales, transformación de datos. Para la mayoría de empresas medianas: Make.",
    },
    {
      titulo: "La diferencia filosófica",
      contenido:
        "Zapier: 'si esto, entonces aquello'. Make: flujos visuales con ramas, errores, iteraciones. Zapier gratis: 100 tareas/mes. Make gratis: 1,000 operaciones/mes.",
    },
    {
      titulo: "IA en el flujo: de reglas a decisiones inteligentes",
      contenido:
        "Sin IA: automatización determinista. Con IA: 'analiza el sentimiento y decide qué respuesta enviar'. La IA convierte datos no estructurados en acciones específicas.",
    },
    {
      titulo: "4 patrones de integración IA + Make más usados",
      contenido:
        "1. Clasificación de entradas (emails, formularios). 2. Extracción de datos estructurados de texto libre. 3. Generación de contenido personalizado. 4. Resumen y síntesis antes de notificar.",
    },
    {
      titulo: "Costo real de automatización con IA en Ecuador",
      contenido:
        "500 pedidos/mes con análisis IA y confirmaciones personalizadas: menos de $15/mes (Make básico + OpenAI API). Vs 3 horas diarias de trabajo manual. ROI inmediato.",
    },
    {
      titulo: "Gobernanza de automatizaciones: la parte que todos ignoran",
      contenido:
        "Cada flujo activo necesita: documentación, responsable, protocolo de fallo, alertas de error. Un flujo que falla silenciosamente puede causar pérdidas días sin que nadie lo note.",
    },
    {
      titulo: "Casos de Make + IA más valorados en Ecuador",
      contenido:
        "Procesamiento de pedidos WhatsApp. Clasificación y respuesta de emails de soporte. Extracción de datos de facturas. Generación de reportes desde múltiples fuentes. Alertas de inventario con análisis contextual.",
    },
    {
      titulo: "Por dónde empezar si nunca has automatizado",
      contenido:
        "Paso 1: identifica la tarea más repetitiva de tu semana (mínimo 30 min/día). Paso 2: construye el flujo más simple posible. Paso 3: automatiza antes de agregar IA. Paso 4: agrega IA solo donde añade valor real.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la principal ventaja de Make sobre Zapier para flujos complejos?",
      opciones: [
        "Make tiene más aplicaciones integradas que Zapier",
        "Make es más barato en todos los planes",
        "Make soporta lógica compleja con ramas condicionales, bucles y manejo de errores",
        "Make funciona sin internet",
      ],
      respuesta: 2,
      explicacion:
        "Make permite construir flujos visuales con lógica compleja: ramas condicionales, bucles, transformación de datos y manejo de errores, lo que Zapier limita a flujos lineales.",
    },
    {
      pregunta: "¿Cuántas operaciones mensuales incluye el plan gratuito de Make?",
      opciones: ["100", "500", "1,000", "5,000"],
      respuesta: 2,
      explicacion:
        "El plan gratuito de Make incluye 1,000 operaciones al mes, suficiente para comenzar a automatizar flujos de trabajo básicos.",
    },
    {
      pregunta: "¿Qué transforma la integración de IA en un flujo de automatización?",
      opciones: [
        "Lo hace más lento pero más preciso",
        "Cambia de reglas deterministas a decisiones basadas en análisis inteligente del contenido",
        "Solo agrega capacidad de traducción automática",
        "Elimina la necesidad de configurar triggers",
      ],
      respuesta: 1,
      explicacion:
        "La IA convierte la automatización de 'si esto, entonces aquello' a 'analiza el contenido con IA y decide la mejor acción', habilitando decisiones contextuales.",
    },
    {
      pregunta: "¿Cuál es la regla de gobernanza más importante para flujos de automatización en producción?",
      opciones: [
        "Documentar todo en un archivo de Excel",
        "Usar solo Zapier, nunca Make",
        "Todo flujo de producción debe tener alertas de error configuradas",
        "Revisar manualmente cada automatización todos los días",
      ],
      respuesta: 2,
      explicacion:
        "Las alertas de error son obligatorias porque un flujo que falla silenciosamente puede causar pérdidas de datos o procesos sin que nadie lo detecte durante días.",
    },
    {
      pregunta: "Al comenzar a automatizar, ¿cuándo se debe agregar IA al flujo?",
      opciones: [
        "Desde el primer flujo, siempre",
        "Solo cuando el equipo técnico lo aprueba",
        "Después de automatizar el flujo básico, solo donde la IA añade valor real",
        "La IA debe ir al inicio de todos los flujos",
      ],
      respuesta: 2,
      explicacion:
        "Automatizar primero sin IA, luego agregar IA donde el análisis inteligente mejora el resultado. Agregar IA prematuramente complica flujos que podrían ser simples.",
    },
  ],
  ejercicio: {
    titulo: "Flujo de procesamiento inteligente de leads con Make + OpenAI",
    objetivo:
      "Construir un escenario en Make que reciba leads desde un formulario, los analice con IA, los clasifique por potencial y notifique al equipo de ventas con contexto.",
    herramientas: "Make.com (plan gratuito), OpenAI API key, Google Forms, Google Sheets, Gmail o Slack",
    datosEjemplo:
      "Empresa: agencia de capacitación empresarial en Quito. Recibe 20-30 leads por semana a través de formulario web. El equipo de ventas pierde tiempo en leads que no califican.",
    pasos: [
      "Paso 1 — Diseñar el formulario de captura: En Google Forms, crear formulario de captura de lead con: nombre, empresa, cargo, número de empleados (dropdown), descripción de necesidad (texto largo), presupuesto estimado (dropdown).",
      "Paso 2 — Crear la hoja de registro en Sheets: Crear Google Sheet con columnas: timestamp, todos los campos del formulario, más columnas que Make llenará: puntaje_lead, clasificacion, resumen_ai, vendedor_asignado.",
      "Paso 3 — Construir el escenario en Make: Módulo 1: Google Forms — Watch responses. Módulo 2: OpenAI — Create chat completion con prompt para analizar el lead, asignar puntaje 1-10 y generar resumen de 3 líneas del perfil. Módulo 3: Tools — Set variable para clasificar según puntaje (Alto/Medio/Bajo).",
      "Paso 4 — Registrar en Sheets: Módulo 4: Google Sheets — Add row con todos los datos del formulario más los campos generados por IA. Verificar que los datos lleguen correctamente.",
      "Paso 5 — Notificar al vendedor: Módulo 5 (rama si puntaje Alto): Gmail o Slack — enviar notificación al vendedor asignado con: nombre del lead, empresa, resumen de necesidad generado por IA, y enlace al registro en Sheets.",
      "Paso 6 — Configurar alerta de error: En la configuración del escenario, habilitar notificaciones de error por email. Probar el flujo con 5 leads de prueba con diferentes perfiles y verificar que la clasificación sea correcta.",
    ],
    resultado:
      "Escenario funcional en Make que clasifica leads automáticamente, registra en Sheets con análisis de IA, y notifica al equipo de ventas para leads de alto potencial.",
    criterios: [
      { criterio: "Formulario con campos relevantes para calificación de leads", puntos: 10 },
      { criterio: "Prompt de OpenAI bien diseñado con puntaje y resumen estructurado", puntos: 25 },
      { criterio: "Flujo completo funcional con todas las conexiones verificadas", puntos: 30 },
      { criterio: "5 casos de prueba con evaluación de precisión de clasificación", puntos: 25 },
      { criterio: "Alerta de error configurada y documentación del flujo", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "Make.com — Documentación oficial",
      url: "https://www.make.com/en/help",
      tipo: "documentacion",
      descripcion: "Documentación completa de Make con tutoriales y referencia de módulos",
    },
    {
      titulo: "Zapier — Guía de inicio rápido",
      url: "https://zapier.com/learn/",
      tipo: "documentacion",
      descripcion: "Guía oficial de Zapier para comenzar a automatizar flujos de trabajo",
    },
    {
      titulo: "Make.com — Templates con OpenAI",
      url: "https://www.make.com/en/templates",
      tipo: "herramienta",
      descripcion: "Plantillas de escenarios de Make que incluyen integración con OpenAI",
    },
    {
      titulo: "n8n — Alternativa open source a Make",
      url: "https://n8n.io/",
      tipo: "herramienta",
      descripcion: "Plataforma de automatización open source para quienes prefieren self-hosting",
    },
  ],
};

const tema7: TemaC3 = placeholder(7, "Automatización de reportes: de datos crudos a informe ejecutivo", "Make/Zapier + IA para Flujos de Trabajo", 2);
const tema8: TemaC3 = placeholder(8, "Flujos de onboarding de clientes y empleados con IA", "Make/Zapier + IA para Flujos de Trabajo", 2);
const tema9: TemaC3 = placeholder(9, "Procesamiento inteligente de documentos: facturas, contratos y formularios", "Make/Zapier + IA para Flujos de Trabajo", 2);
const tema10: TemaC3 = placeholder(10, "Proyecto: sistema de automatización end-to-end para una empresa", "Make/Zapier + IA para Flujos de Trabajo", 2);

// ─── MÓDULO 3: WHATSAPP + AI WORKFLOWS ───────────────────────────────────────

const tema11: TemaC3 = {
  id: 11,
  titulo: "WhatsApp Business API + IA: el canal principal de negocios en Ecuador",
  modulo: "WhatsApp + AI Workflows",
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "WhatsApp + IA: automatiza el canal donde están tus clientes",
  videoDuracion: "26 min",
  teoria: `En Ecuador, WhatsApp no es solo una aplicación de mensajería: es el canal principal de comunicación comercial. Según datos del INEC 2023, Ecuador tiene una tasa de penetración de WhatsApp del 89% entre usuarios de smartphone, la más alta de América del Sur. Las empresas ecuatorianas, desde ferreterías hasta clínicas especializadas, gestionan pedidos, consultas, cotizaciones y soporte casi exclusivamente por WhatsApp.

Esta realidad crea una oportunidad enorme y un problema igualmente grande. La oportunidad: cualquier automatización de WhatsApp tiene adopción inmediata porque los clientes ya están ahí. El problema: WhatsApp es inherentemente no escalable cuando es gestionado manualmente. Un negocio con 200 mensajes diarios necesita a alguien dedicado exclusivamente a responder, y la calidad de atención varía con el estado de ánimo del operador.

WhatsApp Business API (la versión para empresas, diferente a la app personal o Business app) permite integrar WhatsApp con sistemas externos via HTTP. Esto habilita tres niveles de automatización. Nivel 1 — Respuestas automáticas simples: responder fuera de horario, enviar menús de opciones, confirmar recepción de mensajes. Nivel 2 — Flujos de conversación estructurados: guiar al cliente por un árbol de decisiones para calificar su necesidad, capturar datos, generar cotizaciones. Nivel 3 — IA conversacional completa: integrar ChatGPT o Claude en el flujo para manejar consultas en lenguaje natural, con el conocimiento específico de la empresa.

Las plataformas que facilitan la integración de WhatsApp Business API con IA son: Twilio (líder global, $0.05 por conversación iniciada por empresa), 360dialog (partner oficial de Meta, popular en LATAM), Vonage, y WATI.io (especializada en WhatsApp, con plan gratuito limitado). Para empezar sin programar, WATI y Respond.io ofrecen constructores visuales de flujos de conversación con integración de OpenAI.

Un caso típico de implementación en Ecuador: clínica médica en Quito con 80 consultas diarias. Antes: 2 personas respondiendo WhatsApp todo el día. Después de implementar WhatsApp + IA: el bot maneja el 70% de los mensajes (agendamiento, preguntas frecuentes, confirmaciones de cita, resultados de exámenes). Las 2 personas ahora manejan solo el 30% restante que requiere criterio humano. Resultado: misma calidad, menor costo, disponibilidad 24/7.

La ética y el compliance de WhatsApp Business API son críticos. Meta prohíbe el spam y las mensajes no solicitadas. Las empresas pueden enviar mensajes iniciados por la empresa solo usando "plantillas aprobadas" por Meta. Los mensajes de respuesta a consultas del cliente son libres de contenido. Infringir estas reglas resulta en la inhabilitación del número, lo que en Ecuador puede ser catastrófico para un negocio que depende de WhatsApp.`,
  presentacionSlides: [
    {
      titulo: "WhatsApp en Ecuador: el dato que cambia todo",
      contenido:
        "89% de penetración entre usuarios de smartphone (INEC 2023). El canal principal de comunicación comercial ecuatoriana. No automatizarlo es una desventaja competitiva.",
    },
    {
      titulo: "WhatsApp Business API vs Business App",
      contenido:
        "App personal/Business: manual, 1 dispositivo. Business API: automatizable, multiagente, integrable con sistemas, escala ilimitada. Para negocios con más de 50 mensajes/día: API es obligatoria.",
    },
    {
      titulo: "3 niveles de automatización de WhatsApp",
      contenido:
        "Nivel 1: respuestas automáticas y menús. Nivel 2: flujos de conversación estructurados (árboles de decisión). Nivel 3: IA conversacional completa con conocimiento de la empresa.",
    },
    {
      titulo: "Plataformas para integrar WhatsApp + IA",
      contenido:
        "Twilio: líder global, $0.05/conversación. 360dialog: partner Meta, LATAM. WATI.io: especializada WhatsApp, constructor visual. Respond.io: multicanal con IA integrada.",
    },
    {
      titulo: "Caso Ecuador: clínica con 80 consultas/día",
      contenido:
        "Antes: 2 personas respondiendo WhatsApp tiempo completo. Después: bot maneja 70% (agendamiento, FAQ, confirmaciones). Equipo humano maneja solo el 30% crítico. Disponible 24/7.",
    },
    {
      titulo: "Compliance obligatorio de WhatsApp Business API",
      contenido:
        "Sin spam. Mensajes iniciados por empresa: solo plantillas aprobadas por Meta. Mensajes respuesta al cliente: contenido libre. Infracción = inhabilitación del número.",
    },
    {
      titulo: "Diseño del árbol de conversación",
      contenido:
        "Inicio: saludo + identificación de necesidad (1-4 opciones). Rama ventas: calificación + cotización automática. Rama soporte: diagnóstico + solución o escalamiento humano.",
    },
    {
      titulo: "Cuándo escalar a humano: la regla de oro",
      contenido:
        "Escalar si: el bot no entiende 2 veces seguidas. El cliente expresa frustración. La consulta involucra dinero > $X. El cliente pide explícitamente hablar con persona.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué porcentaje de penetración tiene WhatsApp entre usuarios de smartphone en Ecuador según INEC 2023?",
      opciones: ["65%", "75%", "89%", "95%"],
      respuesta: 2,
      explicacion:
        "Ecuador tiene una tasa de penetración de WhatsApp del 89%, la más alta de América del Sur, lo que lo convierte en el canal dominante de comunicación comercial.",
    },
    {
      pregunta: "¿Cuál es la diferencia principal entre la WhatsApp Business App y la WhatsApp Business API?",
      opciones: [
        "La API es gratuita y la App es de pago",
        "La API permite automatización, múltiples agentes e integración con sistemas; la App es manual y para 1 dispositivo",
        "La App soporta más idiomas que la API",
        "No hay diferencia relevante para empresas pequeñas",
      ],
      respuesta: 1,
      explicacion:
        "La WhatsApp Business API es la versión empresarial que permite automatización, integración con sistemas externos y múltiples agentes simultáneos, a diferencia de la App que es manual.",
    },
    {
      pregunta: "En el nivel 3 de automatización de WhatsApp, ¿qué capacidad se agrega?",
      opciones: [
        "Respuestas automáticas fuera de horario",
        "Menús de opciones numeradas",
        "IA conversacional completa que maneja consultas en lenguaje natural",
        "Confirmación automática de recepción",
      ],
      respuesta: 2,
      explicacion:
        "El nivel 3 integra modelos de IA (como ChatGPT) para manejar conversaciones en lenguaje natural, con el conocimiento específico de la empresa, superando los árboles de decisión fijos.",
    },
    {
      pregunta: "¿Qué tipo de mensajes puede enviar una empresa usando WhatsApp Business API sin restricción de contenido?",
      opciones: [
        "Mensajes de marketing masivo",
        "Mensajes de respuesta a consultas iniciadas por el cliente",
        "Notificaciones a clientes que no han escrito antes",
        "Plantillas de ofertas sin aprobación de Meta",
      ],
      respuesta: 1,
      explicacion:
        "Los mensajes de respuesta a conversaciones iniciadas por el cliente (dentro de la ventana de 24 horas) son libres de contenido. Los mensajes iniciados por la empresa requieren plantillas aprobadas.",
    },
    {
      pregunta: "¿Cuándo debe el bot de WhatsApp escalar la conversación a un agente humano?",
      opciones: [
        "Siempre, después de 3 mensajes",
        "Solo durante el horario de oficina",
        "Cuando el bot no entiende dos veces seguidas, cuando el cliente se frustra, o cuando está involucrado dinero significativo",
        "Nunca — el bot debe manejar todo",
      ],
      respuesta: 2,
      explicacion:
        "Las reglas de escalamiento protegen la experiencia del cliente. La frustración repetida y las consultas de alto valor son señales claras de que la interacción humana genera más valor.",
    },
  ],
  ejercicio: {
    titulo: "Bot de WhatsApp con IA para atención y calificación de clientes",
    objetivo:
      "Diseñar y prototipar un bot de WhatsApp con IA para una empresa ecuatoriana que automatice la atención inicial y califique leads automáticamente.",
    herramientas: "WATI.io (plan de prueba gratuito 7 días) o Respond.io, OpenAI API, Google Sheets para registro",
    datosEjemplo:
      "Empresa: inmobiliaria en Quito que recibe 40-60 consultas diarias por WhatsApp. Tipos de consulta: compra de departamentos, arriendo, inversión. El equipo pierde tiempo en clientes que no tienen capacidad de compra.",
    pasos: [
      "Paso 1 — Mapear los flujos de conversación: Identificar los 3 tipos de consulta más frecuentes. Para cada tipo, diseñar el árbol de conversación en papel: saludo → identificar tipo → recopilar datos → clasificar → responder o escalar. Máximo 5 turnos por flujo.",
      "Paso 2 — Configurar WATI o Respond.io: Crear cuenta de prueba. Conectar con número de WhatsApp de prueba (puede ser el personal para la práctica). Explorar el constructor visual de flujos.",
      "Paso 3 — Construir el flujo de bienvenida: Crear el mensaje de bienvenida con menú de opciones (1. Compra, 2. Arriendo, 3. Inversión, 4. Hablar con asesor). Configurar el enrutamiento según la respuesta.",
      "Paso 4 — Integrar IA en la rama de calificación: En la rama 'Compra', configurar el módulo de OpenAI con un prompt que analice las respuestas del cliente (presupuesto, plazo, sector preferido) y genere un puntaje de calificación + resumen del perfil.",
      "Paso 5 — Registrar en Google Sheets: Configurar el webhook para registrar cada conversación en Google Sheets con: número, fecha, tipo de consulta, puntaje IA, resumen del perfil generado.",
      "Paso 6 — Probar con 5 conversaciones reales: Iniciar 5 conversaciones de prueba simulando diferentes perfiles de cliente. Evaluar: flujo natural, precisión de clasificación, calidad del resumen generado. Documentar mejoras.",
    ],
    resultado:
      "Bot de WhatsApp funcional con IA que maneja al menos 2 flujos de conversación, califica clientes automáticamente y registra en Google Sheets.",
    criterios: [
      { criterio: "Árbol de conversación documentado para los 3 tipos de consulta", puntos: 15 },
      { criterio: "Flujo de bienvenida con menú configurado y funcionando", puntos: 20 },
      { criterio: "Integración de IA con prompt de calificación efectivo", puntos: 30 },
      { criterio: "Registro automático en Sheets verificado con datos reales", puntos: 20 },
      { criterio: "5 conversaciones de prueba con análisis de calidad y mejoras identificadas", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Meta — WhatsApp Business API documentación",
      url: "https://developers.facebook.com/docs/whatsapp/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de Meta para la WhatsApp Business API",
    },
    {
      titulo: "WATI.io — Plataforma WhatsApp Business",
      url: "https://www.wati.io/",
      tipo: "herramienta",
      descripcion: "Plataforma especializada en WhatsApp Business con constructor visual de bots",
    },
    {
      titulo: "Respond.io — Mensajería multicanal con IA",
      url: "https://respond.io/",
      tipo: "herramienta",
      descripcion: "Plataforma de mensajería multicanal con integración de IA y WhatsApp",
    },
    {
      titulo: "Twilio — WhatsApp Business API",
      url: "https://www.twilio.com/whatsapp",
      tipo: "herramienta",
      descripcion: "Solución enterprise de Twilio para WhatsApp Business API con SDK para múltiples lenguajes",
    },
  ],
};

const tema12: TemaC3 = placeholder(12, "Diseño de conversaciones: UX para bots de texto", "WhatsApp + AI Workflows", 3);
const tema13: TemaC3 = placeholder(13, "Automatización de ventas por WhatsApp: del lead al cierre", "WhatsApp + AI Workflows", 3);
const tema14: TemaC3 = placeholder(14, "Soporte al cliente 24/7 con IA conversacional", "WhatsApp + AI Workflows", 3);
const tema15: TemaC3 = placeholder(15, "Proyecto: sistema completo de atención WhatsApp con IA", "WhatsApp + AI Workflows", 3);

// ─── MÓDULO 4: CASOS REALES EMPRESAS ECUADOR ─────────────────────────────────

const tema16: TemaC3 = {
  id: 16,
  titulo: "Automatización real en PyMEs ecuatorianas: 4 casos con métricas documentadas",
  modulo: "Casos Reales Empresas Ecuador",
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Casos reales de automatización IA en Ecuador: qué funcionó y qué no",
  videoDuracion: "30 min",
  teoria: `Los casos de automatización con IA en PyMEs ecuatorianas son más abundantes de lo que se cree, pero pocas empresas los documentan o los comparten públicamente. Este tema analiza 4 implementaciones reales con métricas documentadas, patrones de éxito y fracasos honestos.

Caso 1 — Distribuidora de productos agrícolas en Riobamba (35 empleados): El problema era la gestión de pedidos. Los vendedores de campo tomaban pedidos por WhatsApp en texto libre ("quiero 20 sacos de X y 15 de Y para el martes"). El administrativo transcribía manualmente a Excel, lo que tomaba 2.5 horas diarias y generaba errores del 8% en pedidos. La solución: bot de WhatsApp con extracción de datos estructurados usando IA. El bot recibe el mensaje, lo procesa con GPT-4o Mini para extraer: productos, cantidades, fecha de entrega y cliente, y lo registra directamente en la hoja de pedidos con validación de inventario. Resultado después de 3 meses: 0 horas de transcripción manual, errores reducidos al 0.3%, tiempo de confirmación de pedido de 2 horas a 8 minutos.

Caso 2 — Agencia de publicidad digital en Quito (12 personas): El cuello de botella era la generación de reportes mensuales para clientes. Cada reporte tomaba 4-6 horas por cliente (8-10 clientes), con datos de Meta Ads, Google Ads, y redes sociales. La solución: flujo en Make que extrae datos de todas las plataformas, los consolida en Google Sheets, y ejecuta un prompt de análisis con GPT-4 que genera el texto narrativo del reporte (insights, recomendaciones, próximos pasos). Resultado: reportes de 4-6 horas reducidos a 45 minutos de revisión y personalización. La agencia agregó 3 clientes nuevos sin contratar más personal.

Caso 3 — Consultora de RRHH en Guayaquil (8 empleados): El problema era el screening inicial de CVs. Recibían 80-150 CVs por proceso de selección, y la revisión inicial tomaba 1.5 días. La solución: sistema de email automation donde cada CV recibido activa un flujo en Zapier que extrae el texto del PDF con un parser, lo envía a GPT-4 con la descripción del cargo y criterios de selección, obtiene un puntaje de compatibilidad (1-100) con justificación, y lo registra en Notion. Los CVs con puntaje mayor a 75 pasan automáticamente a la siguiente etapa. Resultado: tiempo de screening de 1.5 días a 2 horas de revisión de los candidatos pre-calificados. Precisión del 87% (validado contra criterio del equipo humano).

Caso 4 — Cadena de restaurantes en Quito (3 locales, 45 empleados): El problema era la gestión de reservas y el manejo de reseñas en Google Maps y TripAdvisor. Las reseñas negativas tardaban días en recibir respuesta. La solución: flujo en Make que monitorea nuevas reseñas, analiza el sentimiento con IA, genera una respuesta personalizada según la calificación y el contenido, y la envía para aprobación del gerente antes de publicar. Resultado: tiempo de respuesta promedio de 3 días a 4 horas, índice de satisfacción con respuestas aumentó del 62% al 91%.

El patrón común de estos 4 casos: problema muy específico y medible, implementación en menos de 3 semanas, ROI positivo en el primer mes, y adopción alta porque el equipo fue involucrado en el diseño.`,
  presentacionSlides: [
    {
      titulo: "Por qué los casos reales son más valiosos que la teoría",
      contenido:
        "Eliminar objeciones reales. Mostrar números concretos. Destruir el mito de que 'la IA es para empresas grandes'. Cada caso tiene contexto ecuatoriano, no genérico.",
    },
    {
      titulo: "Caso 1 — Distribuidora agrícola Riobamba",
      contenido:
        "Problema: transcripción manual de pedidos WhatsApp (2.5h/día, 8% errores). Solución: bot IA que estructura pedidos automáticamente. Resultado: 0h manual, 0.3% errores, confirmación en 8 min.",
    },
    {
      titulo: "Caso 2 — Agencia publicidad digital Quito",
      contenido:
        "Problema: reportes mensuales 4-6h por cliente (8-10 clientes). Solución: Make + GPT-4 genera narrativa desde datos de plataformas. Resultado: 45 min revisión. +3 clientes sin contratar.",
    },
    {
      titulo: "Caso 3 — Consultora RRHH Guayaquil",
      contenido:
        "Problema: screening de 80-150 CVs por proceso (1.5 días). Solución: parser PDF + GPT-4 puntaje 1-100 con criterios del cargo. Resultado: 2h revisión, 87% precisión validada.",
    },
    {
      titulo: "Caso 4 — Cadena restaurantes Quito",
      contenido:
        "Problema: respuesta a reseñas tardaba 3 días. Solución: Make monitorea reseñas, IA genera respuesta, gerente aprueba. Resultado: 4h promedio, satisfacción 62% a 91%.",
    },
    {
      titulo: "El patrón de éxito en los 4 casos",
      contenido:
        "Problema específico y medible. Implementación en menos de 3 semanas. ROI positivo en el primer mes. Equipo involucrado en el diseño desde el inicio.",
    },
    {
      titulo: "Errores comunes que causaron fracasos iniciales",
      contenido:
        "Automatizar demasiado de golpe. No involucrar al equipo operativo. No medir el estado antes para comparar después. Intentar solución perfecta en vez de MVP funcional.",
    },
    {
      titulo: "Tu siguiente paso: el caso número 5",
      contenido:
        "Eres el protagonista del quinto caso. Tienes todas las herramientas del curso. El proyecto final es diseñar e implementar una automatización real en tu empresa o sector con métricas.",
    },
  ],
  quiz: [
    {
      pregunta: "En el caso de la distribuidora agrícola de Riobamba, ¿cuánto tardaba la confirmación de un pedido antes de la automatización?",
      opciones: ["30 minutos", "2 horas", "1 día", "2.5 horas en transcripción total del día"],
      respuesta: 1,
      explicacion:
        "La transcripción manual tomaba 2.5 horas diarias en total, y el tiempo de confirmación por pedido era de aproximadamente 2 horas. Con la automatización se redujo a 8 minutos.",
    },
    {
      pregunta: "¿Qué resultado obtuvo la agencia de publicidad al automatizar sus reportes con Make + GPT-4?",
      opciones: [
        "Eliminó completamente el trabajo humano en reportes",
        "Redujo reportes de 4-6 horas a 45 minutos de revisión, permitiendo agregar 3 clientes nuevos",
        "Perdió clientes porque los reportes perdieron calidad",
        "Redujo a 0 el tiempo de reportes",
      ],
      respuesta: 1,
      explicacion:
        "Los reportes pasaron de 4-6 horas a 45 minutos de revisión y personalización. El tiempo liberado permitió a la agencia incorporar 3 clientes nuevos sin contratar más personal.",
    },
    {
      pregunta: "¿Qué precisión logró el sistema de screening de CVs de la consultora de RRHH al compararse con el criterio del equipo humano?",
      opciones: ["65%", "75%", "87%", "99%"],
      respuesta: 2,
      explicacion:
        "El sistema logró un 87% de precisión validado contra el criterio del equipo humano, lo que es suficientemente alto para confiar en la pre-calificación automática.",
    },
    {
      pregunta: "¿Cuál fue el impacto en el tiempo de respuesta a reseñas de la cadena de restaurantes?",
      opciones: [
        "De 3 días a 4 horas",
        "De 1 semana a 1 día",
        "De 1 día a 30 minutos",
        "No hubo cambio en tiempo, solo en calidad",
      ],
      respuesta: 0,
      explicacion:
        "El tiempo de respuesta a reseñas se redujo de 3 días a 4 horas, y el índice de satisfacción con las respuestas aumentó del 62% al 91%.",
    },
    {
      pregunta: "¿Cuál es el patrón de éxito más crítico que comparten los 4 casos analizados?",
      opciones: [
        "Usar el modelo de IA más caro disponible",
        "Implementar en todos los procesos simultáneamente",
        "Empezar con un problema específico y medible, e involucrar al equipo desde el inicio",
        "Contratar un equipo externo de consultores de IA",
      ],
      respuesta: 2,
      explicacion:
        "Los 4 casos comparten: problema específico y medible, implementación rápida (menos de 3 semanas), y equipo operativo involucrado en el diseño. Esto garantiza adopción y ROI temprano.",
    },
  ],
  ejercicio: {
    titulo: "Proyecto final: automatización real para una empresa ecuatoriana",
    objetivo:
      "Diseñar, implementar y documentar una automatización con IA para una empresa real o caso de estudio, con métricas de impacto medidas y presentación ejecutiva.",
    herramientas: "Make.com o Zapier, OpenAI API o Notion AI, WhatsApp o email según el caso, Google Sheets para métricas",
    datosEjemplo:
      "Si no tienes empresa propia, elige uno de estos sectores: veterinaria en Quito (agendamiento y seguimiento de pacientes), empresa de catering (gestión de cotizaciones), escuela de idiomas (seguimiento de estudiantes y pagos).",
    pasos: [
      "Paso 1 — Identificar el problema específico: Documenta el problema con datos actuales: ¿cuánto tiempo toma?, ¿cuántos errores genera?, ¿cuánto cuesta en horas-persona por semana? Esta es tu línea base.",
      "Paso 2 — Diseñar la solución: Dibuja el flujo de la automatización: entrada → procesamiento IA → salida → almacenamiento → notificación. Identifica qué herramientas usarás para cada paso. Valida que el diseño sea realizable en 2 semanas.",
      "Paso 3 — Implementar el MVP: Construye la versión mínima funcional. No busques la perfección: busca que funcione para el caso más frecuente del problema. Documenta cada decisión técnica.",
      "Paso 4 — Medir el impacto: Ejecuta la automatización durante 5-7 días con casos reales o simulados. Registra: tiempo antes vs. después, errores antes vs. después, satisfacción del equipo (1-5). Calcula el ROI semanal y proyecta el anual.",
      "Paso 5 — Documentar las lecciones: Qué funcionó bien. Qué falló y cómo lo resolviste. Qué harías diferente. Qué agregarías en la siguiente versión. Este documento es más valioso que la implementación perfecta.",
      "Paso 6 — Presentación de 12 minutos: El problema con datos. La solución con demo en vivo. Las métricas de impacto. El ROI calculado. Las lecciones aprendidas. Los próximos 3 pasos para escalar.",
    ],
    resultado:
      "Automatización funcional con métricas documentadas antes/después, cálculo de ROI, y presentación ejecutiva de 12 minutos con demo en vivo.",
    criterios: [
      { criterio: "Problema documentado con métricas de línea base (antes)", puntos: 15 },
      { criterio: "Diseño del flujo claro con herramientas y lógica explicadas", puntos: 15 },
      { criterio: "MVP funcional con demostración en vivo durante la presentación", puntos: 30 },
      { criterio: "Métricas de impacto medidas con cálculo de ROI", puntos: 25 },
      { criterio: "Documento de lecciones aprendidas con próximos pasos", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Make.com — Centro de aprendizaje",
      url: "https://www.make.com/en/help/tutorials",
      tipo: "documentacion",
      descripcion: "Tutoriales oficiales de Make para construir escenarios de automatización",
    },
    {
      titulo: "Zapier — Blog de automatización",
      url: "https://zapier.com/blog/",
      tipo: "lectura",
      descripcion: "Casos de uso, tutoriales y mejores prácticas de automatización de Zapier",
    },
    {
      titulo: "OpenAI — Casos de uso documentados",
      url: "https://openai.com/customer-stories/",
      tipo: "lectura",
      descripcion: "Implementaciones reales de la API de OpenAI en empresas de diferentes tamaños",
    },
    {
      titulo: "n8n — Plantillas de automatización con IA",
      url: "https://n8n.io/workflows/",
      tipo: "herramienta",
      descripcion: "Biblioteca de flujos de automatización open source, muchos con integración de IA",
    },
  ],
};

const tema17: TemaC3 = placeholder(17, "Automatización de marketing digital: redes, email y ads", "Casos Reales Empresas Ecuador", 4);
const tema18: TemaC3 = placeholder(18, "IA en operaciones: inventario, logística y recursos humanos", "Casos Reales Empresas Ecuador", 4);
const tema19: TemaC3 = placeholder(19, "Medir el ROI de la automatización: métricas y frameworks", "Casos Reales Empresas Ecuador", 4);
const tema20: TemaC3 = placeholder(20, "Proyecto final: automatización empresarial presentada ante panel", "Casos Reales Empresas Ecuador", 4);

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const C3_TEMAS: TemaC3[] = [
  tema1,  tema2,  tema3,  tema4,  tema5,
  tema6,  tema7,  tema8,  tema9,  tema10,
  tema11, tema12, tema13, tema14, tema15,
  tema16, tema17, tema18, tema19, tema20,
];
