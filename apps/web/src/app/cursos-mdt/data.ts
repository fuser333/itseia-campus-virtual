// ─── Cursos MDT — fuente de verdad ───────────────────────────────────────────
// 15 cursos profesionales de Manejo De Tecnología (MDT).
// Precio oficial: Desde $99 (pago único por curso).

export interface SesionMDT {
  numero: number;
  titulo: string;
}

export interface CursoMDT {
  slug: string;
  nombre: string;
  horas: number;
  precio: string;
  descripcion: string;
  categoria: string;
  sesiones: SesionMDT[];
}

export const CURSOS_MDT: CursoMDT[] = [
  {
    slug: "c1",
    nombre: "Fundamentos de IA Práctica",
    horas: 12,
    precio: "Desde $99",
    descripcion:
      "Domina los conceptos esenciales de la Inteligencia Artificial y aprende a usar las herramientas más potentes del mercado desde el día uno.",
    categoria: "Fundamentos",
    sesiones: [
      { numero: 1, titulo: "¿Qué es la IA? Conceptos clave y panorama actual" },
      { numero: 2, titulo: "Herramientas principales: ChatGPT, Claude, Gemini" },
      { numero: 3, titulo: "Prompting efectivo — técnicas y patrones" },
      { numero: 4, titulo: "IA en el trabajo diario — casos reales Ecuador" },
      { numero: 5, titulo: "Proyecto final: automatiza una tarea de tu trabajo" },
      { numero: 6, titulo: "Presentación y retroalimentación de proyectos" },
    ],
  },
  {
    slug: "c2",
    nombre: "ChatGPT Avanzado para Negocios",
    horas: 10,
    precio: "Desde $99",
    descripcion:
      "Lleva ChatGPT más allá del uso básico: GPTs personalizados, integraciones, automatizaciones y casos de uso empresariales reales.",
    categoria: "Herramientas IA",
    sesiones: [
      { numero: 1, titulo: "Anatomía de un prompt perfecto para negocios" },
      { numero: 2, titulo: "GPTs personalizados — creación y despliegue" },
      { numero: 3, titulo: "Integración con Google Workspace y Office 365" },
      { numero: 4, titulo: "Análisis de datos con Code Interpreter" },
      { numero: 5, titulo: "Flujos de trabajo con ChatGPT + Zapier/Make" },
    ],
  },
  {
    slug: "c3",
    nombre: "Automatización con Make y Zapier",
    horas: 14,
    precio: "Desde $99",
    descripcion:
      "Crea flujos de automatización potentes sin programar. Conecta tus apps favoritas y elimina tareas repetitivas con Make (ex Integromat) y Zapier.",
    categoria: "Automatización",
    sesiones: [
      { numero: 1, titulo: "Introducción a la automatización sin código" },
      { numero: 2, titulo: "Zapier: primeros flujos y triggers esenciales" },
      { numero: 3, titulo: "Make: escenarios avanzados y módulos de datos" },
      { numero: 4, titulo: "Conectar CRM, email y redes sociales" },
      { numero: 5, titulo: "IA + automatización: ChatGPT dentro de tus flujos" },
      { numero: 6, titulo: "Proyecto: automatiza un proceso de negocio completo" },
      { numero: 7, titulo: "Mantenimiento, errores y buenas prácticas" },
    ],
  },
  {
    slug: "c4",
    nombre: "Python para Análisis de Datos",
    horas: 18,
    precio: "Desde $99",
    descripcion:
      "Aprende Python desde cero con enfoque en análisis de datos reales. Pandas, NumPy, visualización y primeros modelos de Machine Learning.",
    categoria: "Datos",
    sesiones: [
      { numero: 1, titulo: "Python desde cero — sintaxis y estructuras" },
      { numero: 2, titulo: "Pandas: carga, limpieza y transformación de datos" },
      { numero: 3, titulo: "NumPy y operaciones vectoriales" },
      { numero: 4, titulo: "Visualización con Matplotlib y Seaborn" },
      { numero: 5, titulo: "Análisis exploratorio (EDA) paso a paso" },
      { numero: 6, titulo: "Introducción a scikit-learn — modelos básicos" },
      { numero: 7, titulo: "Proyecto final: análisis de dataset real ecuatoriano" },
      { numero: 8, titulo: "Presentación y correcciones" },
      { numero: 9, titulo: "Buenas prácticas y siguientes pasos" },
    ],
  },
  {
    slug: "c5",
    nombre: "Excel + IA: Dashboards Inteligentes",
    horas: 10,
    precio: "Desde $99",
    descripcion:
      "Transforma hojas de cálculo aburridas en dashboards interactivos con IA integrada. Fórmulas avanzadas, Power Query y Copilot para Excel.",
    categoria: "Productividad",
    sesiones: [
      { numero: 1, titulo: "Fórmulas avanzadas: XLOOKUP, LAMBDA, arrays dinámicos" },
      { numero: 2, titulo: "Power Query: automatiza la importación y limpieza" },
      { numero: 3, titulo: "Tablas dinámicas profesionales y segmentadores" },
      { numero: 4, titulo: "Dashboard interactivo: diseño y mejores prácticas" },
      { numero: 5, titulo: "Microsoft Copilot para Excel — productividad x10" },
    ],
  },
  {
    slug: "c6",
    nombre: "Marketing Digital con IA",
    horas: 12,
    precio: "Desde $99",
    descripcion:
      "Crea campañas, copy y contenido con IA. Desde segmentación con datos hasta generación de creativos y optimización de anuncios en Meta y Google.",
    categoria: "Marketing",
    sesiones: [
      { numero: 1, titulo: "Estrategia digital en la era de la IA" },
      { numero: 2, titulo: "Copy e ideas de contenido con Claude y ChatGPT" },
      { numero: 3, titulo: "Imágenes y videos con IA — Midjourney, Leonardo, Sora" },
      { numero: 4, titulo: "Meta Ads + IA: segmentación y optimización automática" },
      { numero: 5, titulo: "SEO potenciado con IA — contenido y análisis" },
      { numero: 6, titulo: "Métricas, reportes automáticos y ajuste de campañas" },
    ],
  },
  {
    slug: "c7",
    nombre: "Power BI: Visualización Profesional",
    horas: 12,
    precio: "Desde $99",
    descripcion:
      "Desde cero hasta reportes de nivel ejecutivo en Power BI. Conexión a fuentes de datos, DAX esencial y diseño de dashboards corporativos.",
    categoria: "Datos",
    sesiones: [
      { numero: 1, titulo: "Introducción a Power BI Desktop y servicio en la nube" },
      { numero: 2, titulo: "Conectar y transformar datos con Power Query" },
      { numero: 3, titulo: "Modelo de datos y relaciones" },
      { numero: 4, titulo: "DAX esencial: medidas, columnas calculadas, KPIs" },
      { numero: 5, titulo: "Visualizaciones impactantes y diseño ejecutivo" },
      { numero: 6, titulo: "Publicar, compartir y colaborar en Power BI Service" },
    ],
  },
  {
    slug: "c8",
    nombre: "Creación de Contenido con IA",
    horas: 8,
    precio: "Desde $99",
    descripcion:
      "Produce contenido de alta calidad para redes, blogs y videos en fracción del tiempo usando IA generativa y flujos de creación sistemáticos.",
    categoria: "Contenido",
    sesiones: [
      { numero: 1, titulo: "Sistema de creación: pilares, formatos y calendario" },
      { numero: 2, titulo: "Textos que conectan — Claude y ChatGPT para copy" },
      { numero: 3, titulo: "Imágenes y gráficos con IA — guías de estilo" },
      { numero: 4, titulo: "Video corto con IA — scripts, b-roll y edición asistida" },
    ],
  },
  {
    slug: "c9",
    nombre: "Bases de Datos y SQL para Profesionales",
    horas: 14,
    precio: "Desde $99",
    descripcion:
      "Aprende SQL desde cero y domina el diseño de bases de datos relacionales. Consultas avanzadas, optimización y conexión con Python y herramientas de BI.",
    categoria: "Datos",
    sesiones: [
      { numero: 1, titulo: "Fundamentos de bases de datos relacionales" },
      { numero: 2, titulo: "SQL básico: SELECT, WHERE, ORDER BY, GROUP BY" },
      { numero: 3, titulo: "JOINs y subconsultas — el poder de combinar datos" },
      { numero: 4, titulo: "Diseño de esquemas: normalización y claves" },
      { numero: 5, titulo: "SQL avanzado: CTEs, ventanas, índices" },
      { numero: 6, titulo: "SQL + Python y SQL + Power BI" },
      { numero: 7, titulo: "Proyecto: base de datos de una empresa real" },
    ],
  },
  {
    slug: "c10",
    nombre: "Inteligencia de Negocios (BI) Aplicada",
    horas: 14,
    precio: "Desde $99",
    descripcion:
      "Transforma datos en decisiones. Estrategia de BI, ETL, modelado dimensional, KPIs y construcción de un stack completo de análisis empresarial.",
    categoria: "Datos",
    sesiones: [
      { numero: 1, titulo: "¿Qué es BI y por qué lo necesita tu empresa?" },
      { numero: 2, titulo: "Arquitectura de datos: fuentes, ETL y Data Warehouse" },
      { numero: 3, titulo: "Modelado dimensional — estrella y copo de nieve" },
      { numero: 4, titulo: "KPIs que importan: definición y jerarquía de métricas" },
      { numero: 5, titulo: "Dashboard ejecutivo en Power BI o Looker Studio" },
      { numero: 6, titulo: "Storytelling con datos — presentar resultados a directivos" },
      { numero: 7, titulo: "Proyecto integrador: BI para una empresa ecuatoriana" },
    ],
  },
  {
    slug: "c11",
    nombre: "IA Aplicada a Recursos Humanos",
    horas: 10,
    precio: "Desde $99",
    descripcion:
      "Automatiza reclutamiento, análisis de desempeño y formación interna con IA. Herramientas específicas para el área de Talento Humano.",
    categoria: "Gestión",
    sesiones: [
      { numero: 1, titulo: "IA en el ciclo de vida del colaborador" },
      { numero: 2, titulo: "Reclutamiento inteligente: filtros, JD y entrevistas con IA" },
      { numero: 3, titulo: "Análisis de desempeño y planes de desarrollo asistidos por IA" },
      { numero: 4, titulo: "Capacitación interna con IA: cursos personalizados" },
      { numero: 5, titulo: "Ética, privacidad y sesgos en IA para RRHH" },
    ],
  },
  {
    slug: "c12",
    nombre: "Ciberseguridad en la Era de la IA",
    horas: 10,
    precio: "Desde $99",
    descripcion:
      "Entiende las nuevas amenazas impulsadas por IA y aprende a proteger tus datos, cuentas y empresa con herramientas y prácticas actuales.",
    categoria: "Seguridad",
    sesiones: [
      { numero: 1, titulo: "Panorama actual: amenazas IA — deepfakes, phishing y más" },
      { numero: 2, titulo: "Protección de identidad digital y contraseñas robustas" },
      { numero: 3, titulo: "Seguridad en la nube y servicios SaaS" },
      { numero: 4, titulo: "IA defensiva: herramientas que te protegen" },
      { numero: 5, titulo: "Plan de respuesta ante incidentes para PYMEs" },
    ],
  },
  {
    slug: "c13",
    nombre: "Emprendimiento con IA",
    horas: 12,
    precio: "Desde $99",
    descripcion:
      "Lanza o escala tu negocio usando IA como palanca de crecimiento. Validación de ideas, automatización de operaciones y captación de clientes con IA.",
    categoria: "Emprendimiento",
    sesiones: [
      { numero: 1, titulo: "De idea a negocio viable — validación rápida con IA" },
      { numero: 2, titulo: "Propuesta de valor y modelo de negocio asistido por IA" },
      { numero: 3, titulo: "Marketing de arranque: contenido y anuncios con IA" },
      { numero: 4, titulo: "Operaciones lean: automatizar ventas y atención al cliente" },
      { numero: 5, titulo: "Finanzas básicas y proyecciones con IA" },
      { numero: 6, titulo: "Pitch deck con IA — presentar y convencer inversores" },
    ],
  },
  {
    slug: "c14",
    nombre: "No-Code + IA: Crea Apps sin Programar",
    horas: 12,
    precio: "Desde $99",
    descripcion:
      "Construye aplicaciones funcionales sin escribir una línea de código usando plataformas no-code potenciadas con IA: Bubble, Glide, Softr y más.",
    categoria: "Desarrollo",
    sesiones: [
      { numero: 1, titulo: "El ecosistema no-code y cuándo usarlo" },
      { numero: 2, titulo: "Bubble: diseño de UI y lógica de negocio" },
      { numero: 3, titulo: "Glide Apps: apps móviles desde Google Sheets" },
      { numero: 4, titulo: "Softr + Airtable: portales de clientes y membresías" },
      { numero: 5, titulo: "Integrar IA en apps no-code — OpenAI + Zapier" },
      { numero: 6, titulo: "Proyecto: app completa lista para usuarios reales" },
    ],
  },
  {
    slug: "c15",
    nombre: "Liderazgo e IA en Organizaciones",
    horas: 8,
    precio: "Desde $99",
    descripcion:
      "Para líderes y directivos que necesitan entender el impacto de la IA en sus equipos, tomar decisiones estratégicas y liderar la transformación digital.",
    categoria: "Gestión",
    sesiones: [
      { numero: 1, titulo: "IA para líderes: qué necesitas saber (y qué no)" },
      { numero: 2, titulo: "Evaluación de madurez digital de tu organización" },
      { numero: 3, titulo: "Roadmap de adopción de IA — priorización y ROI" },
      { numero: 4, titulo: "Gestión del cambio y cultura de datos" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCursoBySlug(slug: string): CursoMDT | undefined {
  return CURSOS_MDT.find((c) => c.slug === slug);
}

export const CATEGORIAS_MDT = [
  ...new Set(CURSOS_MDT.map((c) => c.categoria)),
] as const;
