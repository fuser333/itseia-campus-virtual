// ─── C14: Estrategia de Datos para Empresas — Datos de 20 temas ───────────────
// Curso C14 del programa MDT. 20 temas (scaffolding).
// Módulo 1: Cultura data-driven en la organización
// Módulo 2: Data governance y calidad de datos
// Módulo 3: KPIs e indicadores con IA
// Módulo 4: Roadmap de transformación digital

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

export interface TemaC14 {
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

export const C14_MODULOS = [
  { num: 1, nombre: "Cultura Data-Driven", horas: 15, temas: 5 },
  { num: 2, nombre: "Data Governance y Calidad", horas: 15, temas: 5 },
  { num: 3, nombre: "KPIs e Indicadores con IA", horas: 15, temas: 5 },
  { num: 4, nombre: "Roadmap de Transformación Digital", horas: 15, temas: 5 },
];

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC14 => ({
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

// ─── MÓDULO 1: CULTURA DATA-DRIVEN ───────────────────────────────────────────

const tema1: TemaC14 = {
  id: 1,
  titulo: "¿Qué significa ser una empresa data-driven?",
  modulo: "Cultura Data-Driven",
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Cultura data-driven: de la intuición a la evidencia",
  videoDuracion: "18 min",
  teoria: `Una empresa data-driven toma decisiones basadas principalmente en datos y análisis, no en intuición o jerarquía. Este enfoque ha demostrado resultados concretos: según McKinsey, las organizaciones líderes en uso de datos tienen 23 veces más probabilidades de adquirir clientes, 6 veces más de retenerlos y 19 veces más de ser rentables que sus competidores.

En Ecuador, el contexto es particular. La mayoría de las PyMEs —que representan el 99,5% de las empresas registradas en el SUPERCIAS— toman decisiones con base en la experiencia del gerente o en datos financieros básicos del SRI. Pocas tienen dashboards, métricas de cliente o indicadores operativos en tiempo real. Esta brecha es exactamente donde la ventaja competitiva de los próximos 5 años se va a construir.

Ser data-driven no significa tener un data warehouse de millones de dólares. Significa adoptar tres hábitos organizacionales: primero, definir preguntas de negocio concretas antes de recopilar datos ("¿Cuál es mi tasa de retención mensual?" es mejor punto de partida que "analicemos nuestros datos"); segundo, construir flujos de datos simples y confiables que respondan esas preguntas de forma recurrente; tercero, crear una cultura de revisión donde las decisiones importantes incluyan evidencia cuantitativa.

El modelo de madurez de datos de Gartner tiene cinco niveles: (1) Consciente — sabe que los datos importan pero no los usa; (2) Reactivo — usa datos solo para resolver problemas; (3) Proactivo — monitorea KPIs regularmente; (4) Orientado a servicios — los datos fluyen entre áreas; (5) Transformado — datos como ventaja competitiva estratégica. La mayoría de las empresas ecuatorianas medianas están en el nivel 1 o 2. El objetivo de este curso es llevarlas al nivel 3-4.

Las barreras más comunes en Ecuador son culturales, no tecnológicas: "los datos son del gerente", falta de confianza en los propios registros históricos, miedo a que los datos revelen ineficiencias, y la creencia de que "esto es para empresas grandes". El rol del estratega de datos es tanto técnico como de gestión del cambio.`,
  presentacionSlides: [
    {
      titulo: "¿Qué es una empresa data-driven?",
      contenido:
        "Decisiones basadas en evidencia, no intuición. 23x más probabilidad de adquirir clientes (McKinsey). Ecuador: 99.5% PyMEs con datos mínimos.",
    },
    {
      titulo: "El modelo de madurez de datos (Gartner)",
      contenido:
        "Nivel 1 Consciente → Nivel 2 Reactivo → Nivel 3 Proactivo → Nivel 4 Orientado a servicios → Nivel 5 Transformado. Meta del curso: llevar empresas al nivel 3-4.",
    },
    {
      titulo: "Los 3 hábitos data-driven",
      contenido:
        "1. Preguntas de negocio primero. 2. Flujos de datos confiables y recurrentes. 3. Cultura de revisión con evidencia en decisiones clave.",
    },
    {
      titulo: "Barreras culturales en Ecuador",
      contenido:
        "Datos como propiedad del gerente. Desconfianza en registros históricos. Miedo a revelar ineficiencias. 'Esto es para empresas grandes' — creencia incorrecta.",
    },
    {
      titulo: "El costo de NO ser data-driven",
      contenido:
        "Decisiones lentas. Clientes perdidos sin saberlo. Inventario excesivo o insuficiente. Campañas sin ROI medido. En Ecuador: competidores internacionales que sí miden.",
    },
    {
      titulo: "Caso: empresa de distribución en Quito",
      contenido:
        "Antes: rutas decididas por el chofer más antiguo. Después: ruteo optimizado con datos históricos de entrega. Resultado: 18% menos combustible, 22% más entregas/día.",
    },
    {
      titulo: "Primer paso práctico",
      contenido:
        "Auditoría de datos en 1 hora: listar las 5 preguntas más importantes del negocio y verificar si existe un número confiable que las responda hoy.",
    },
    {
      titulo: "Recursos recomendados",
      contenido:
        "Google Looker Studio (gratis). Metabase (open source). Power BI Free tier. Notion databases. El stack no importa al inicio — el hábito sí.",
    },
  ],
  quiz: [
    {
      pregunta: "Según el modelo de madurez de Gartner, una empresa que solo usa datos para resolver problemas después de que ocurren está en:",
      opciones: [
        "Nivel 1 — Consciente",
        "Nivel 2 — Reactivo",
        "Nivel 3 — Proactivo",
        "Nivel 4 — Orientado a servicios",
      ],
      respuesta: 1,
      explicacion:
        "El nivel 2 Reactivo describe exactamente este patrón: los datos se usan como respuesta a problemas, no de forma anticipada o sistemática.",
    },
    {
      pregunta: "¿Cuál es el primer hábito recomendado para iniciar una cultura data-driven?",
      opciones: [
        "Contratar un data scientist",
        "Comprar un software de Business Intelligence",
        "Definir preguntas de negocio concretas antes de recopilar datos",
        "Migrar todos los datos a la nube",
      ],
      respuesta: 2,
      explicacion:
        "Las preguntas de negocio guían qué datos recopilar y cómo usarlos. Sin preguntas claras, los datos acumulados no generan valor.",
    },
    {
      pregunta: "¿Qué porcentaje de las empresas en Ecuador son PyMEs según el SUPERCIAS?",
      opciones: ["85%", "92%", "99,5%", "75%"],
      respuesta: 2,
      explicacion:
        "El 99,5% de las empresas registradas en Ecuador son PyMEs, lo que hace crítica la democratización de las herramientas de datos.",
    },
    {
      pregunta: "Una empresa que tiene dashboards de KPIs revisados semanalmente y los equipos los usan para planificar está en qué nivel de madurez:",
      opciones: ["Nivel 1", "Nivel 2", "Nivel 3", "Nivel 5"],
      respuesta: 2,
      explicacion:
        "El nivel 3 Proactivo implica monitoreo regular de KPIs y uso de datos para planificación, no solo para responder a crisis.",
    },
    {
      pregunta: "¿Cuál es la principal barrera para adoptar datos en empresas ecuatorianas medianas?",
      opciones: [
        "Falta de tecnología disponible",
        "Costos prohibitivos del software",
        "Barreras culturales: datos como propiedad del gerente y desconfianza",
        "Falta de internet en las oficinas",
      ],
      respuesta: 2,
      explicacion:
        "La barrera principal es cultural, no tecnológica. Herramientas gratuitas como Looker Studio o Metabase están disponibles; el problema es la disposición organizacional.",
    },
  ],
  ejercicio: {
    titulo: "Auditoría de madurez de datos en 60 minutos",
    objetivo:
      "Evaluar el nivel de madurez data-driven de una empresa real o ficticia y diseñar el plan de 3 meses para subir un nivel.",
    herramientas: "Google Sheets o Notion, plantilla de auditoría proporcionada",
    datosEjemplo:
      "Empresa: Distribuidora de alimentos en Guayaquil, 25 empleados, facturación $800K/año, usa Excel para inventario y WhatsApp para pedidos.",
    pasos: [
      "Paso 1 — Identificar la empresa: Elige una empresa real de tu entorno o usa el caso proporcionado. Documenta sector, tamaño y modelo de negocio en 3 líneas.",
      "Paso 2 — Auditoría de preguntas: Lista las 5 preguntas de negocio más importantes (ej: '¿Cuál es mi cliente más rentable?'). Para cada pregunta, indica si existe hoy un número confiable que la responda (Sí/No/Parcial).",
      "Paso 3 — Mapeo de datos existentes: Enumera todas las fuentes de datos de la empresa (facturas, WhatsApp, Excel, sistema contable, etc.). Clasifica cada una por confiabilidad (Alta/Media/Baja) y frecuencia de actualización.",
      "Paso 4 — Diagnóstico de nivel: Usa la rúbrica del modelo Gartner para asignar un nivel del 1 al 5. Documenta 3 evidencias que justifican ese nivel.",
      "Paso 5 — Plan de subida de nivel: Define 3 acciones específicas para subir un nivel en 90 días. Cada acción debe tener: qué hacer, quién lo hace, costo estimado (en tiempo y dinero) y métrica de éxito.",
      "Paso 6 — Presentación: Prepara un slide de 1 página con el diagnóstico y el plan. Practica explicarlo en 3 minutos.",
    ],
    resultado:
      "Documento de auditoría completo con diagnóstico de madurez, evidencias y plan de 90 días para una empresa específica.",
    criterios: [
      { criterio: "5 preguntas de negocio identificadas con evaluación de disponibilidad de datos", puntos: 20 },
      { criterio: "Mapa de fuentes de datos con clasificación de confiabilidad", puntos: 20 },
      { criterio: "Diagnóstico de nivel con 3 evidencias justificadas", puntos: 25 },
      { criterio: "Plan de 3 acciones específicas con métricas de éxito", puntos: 25 },
      { criterio: "Presentación clara y concisa en 3 minutos", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "Gartner Data & Analytics Maturity Model",
      url: "https://www.gartner.com/en/data-analytics",
      tipo: "documentacion",
      descripcion: "Modelo oficial de madurez de datos de Gartner",
    },
    {
      titulo: "Google Looker Studio — Tutorial gratuito",
      url: "https://lookerstudio.google.com/",
      tipo: "herramienta",
      descripcion: "Herramienta gratuita de visualización de datos de Google",
    },
    {
      titulo: "Metabase — BI open source",
      url: "https://www.metabase.com/",
      tipo: "herramienta",
      descripcion: "Plataforma de inteligencia de negocios gratuita y de código abierto",
    },
    {
      titulo: "McKinsey: The data-driven enterprise of 2025",
      url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-data-driven-enterprise-of-2025",
      tipo: "lectura",
      descripcion: "Reporte McKinsey sobre empresas data-driven y sus ventajas competitivas",
    },
  ],
};

const tema2: TemaC14 = placeholder(2, "Diagnóstico de datos en tu empresa", "Cultura Data-Driven", 1);
const tema3: TemaC14 = placeholder(3, "Storytelling con datos para directivos", "Cultura Data-Driven", 1);
const tema4: TemaC14 = placeholder(4, "Gestión del cambio cultural hacia datos", "Cultura Data-Driven", 1);
const tema5: TemaC14 = placeholder(5, "Caso práctico: empresa ecuatoriana data-driven", "Cultura Data-Driven", 1);

// ─── MÓDULO 2: DATA GOVERNANCE Y CALIDAD ─────────────────────────────────────

const tema6: TemaC14 = {
  id: 6,
  titulo: "Qué es data governance y por qué importa en Ecuador",
  modulo: "Data Governance y Calidad",
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Data governance: ordenar los datos antes de analizarlos",
  videoDuracion: "20 min",
  teoria: `Data governance es el conjunto de políticas, procesos, roles y métricas que aseguran que los datos de una organización sean precisos, accesibles, consistentes y seguros. En términos simples: es el sistema que define quién es dueño de cada dato, cómo se recopila, dónde se almacena y quién puede usarlo.

En Ecuador, la relevancia de data governance ha aumentado significativamente con la Ley Orgánica de Protección de Datos Personales (LOPDP), vigente desde 2023. Esta ley establece que las empresas deben documentar qué datos personales recopilan, con qué base legal, por cuánto tiempo los conservan y cómo los protegen. Incumplir puede resultar en multas de hasta el 2% de la facturación anual. Para una distribuidora con $1M de ventas, eso son $20.000.

Los problemas de calidad de datos más comunes en empresas ecuatorianas son: duplicados (el mismo cliente registrado tres veces con nombres diferentes), campos vacíos críticos (RUC faltante en facturas), inconsistencias de formato (fechas en DD/MM/YYYY y MM/DD/YYYY mezcladas), datos obsoletos (precios o contactos desactualizados) y silos de información (ventas no sabe lo que sabe servicio al cliente).

Un framework práctico de data governance para PyMEs tiene cuatro componentes: (1) Inventario de datos — listar todos los conjuntos de datos y sus características; (2) Responsables — asignar un "dueño" a cada conjunto de datos crítico; (3) Definiciones — establecer qué significa cada campo (¿"cliente activo" es quien compró en los últimos 30, 60 o 90 días?); (4) Procesos de calidad — rutinas de limpieza, validación y actualización.

La calidad de datos se mide en seis dimensiones según el DAMA International: completitud (¿están todos los campos?), exactitud (¿los valores son correctos?), consistencia (¿el mismo dato dice lo mismo en dos sistemas?), validez (¿está en el formato correcto?), unicidad (¿no hay duplicados?) y actualidad (¿están al día?). Una auditoría inicial de calidad suele revelar que entre el 15% y el 40% de los registros tienen al menos un problema en estas dimensiones.`,
  presentacionSlides: [
    {
      titulo: "¿Qué es data governance?",
      contenido:
        "Políticas, procesos, roles y métricas para datos precisos, accesibles, consistentes y seguros. No es tecnología — es organización.",
    },
    {
      titulo: "LOPDP Ecuador — Obligaciones clave",
      contenido:
        "Vigente desde 2023. Documentar: qué datos, base legal, tiempo de conservación, medidas de seguridad. Multas hasta 2% de facturación anual.",
    },
    {
      titulo: "Los 5 problemas de calidad más comunes en Ecuador",
      contenido:
        "1. Duplicados de clientes. 2. Campos vacíos críticos (RUC). 3. Inconsistencias de formato. 4. Datos obsoletos. 5. Silos entre áreas.",
    },
    {
      titulo: "Framework de governance para PyMEs (4 componentes)",
      contenido:
        "1. Inventario de datos. 2. Responsables (data owners). 3. Definiciones acordadas. 4. Procesos de calidad recurrentes.",
    },
    {
      titulo: "Las 6 dimensiones de calidad de datos (DAMA)",
      contenido:
        "Completitud · Exactitud · Consistencia · Validez · Unicidad · Actualidad. Auditoría inicial: 15-40% de registros con al menos un problema.",
    },
    {
      titulo: "Herramientas prácticas",
      contenido:
        "OpenRefine (limpieza gratuita). Great Expectations (Python, validación automática). dbt (transformación con tests). Power Query en Excel para limpieza básica.",
    },
    {
      titulo: "El 'dueño del dato' en la práctica",
      contenido:
        "Ejemplo: 'datos de clientes' — dueño: Gerente Comercial. Responsable técnico: analista CRM. Proceso: actualización mensual, auditoría trimestral.",
    },
    {
      titulo: "ROI del data governance",
      contenido:
        "Gartner: datos de mala calidad cuestan en promedio $12.9M/año a empresas grandes. Para PyMEs: decisiones incorrectas, facturas rechazadas, clientes perdidos.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué ley ecuatoriana obliga a las empresas a documentar sus prácticas de manejo de datos personales?",
      opciones: [
        "Ley de Comercio Electrónico (LCIE)",
        "Ley Orgánica de Protección de Datos Personales (LOPDP)",
        "Reglamento del SRI sobre facturación electrónica",
        "Ley Orgánica de Telecomunicaciones",
      ],
      respuesta: 1,
      explicacion:
        "La LOPDP, vigente desde 2023, es la norma principal en Ecuador sobre protección de datos personales y establece obligaciones de governance y multas por incumplimiento.",
    },
    {
      pregunta: "Según DAMA International, ¿cuántas dimensiones tiene la calidad de datos?",
      opciones: ["4", "5", "6", "8"],
      respuesta: 2,
      explicacion:
        "DAMA define 6 dimensiones: completitud, exactitud, consistencia, validez, unicidad y actualidad.",
    },
    {
      pregunta: "¿Qué porcentaje de registros suele tener al menos un problema de calidad en una auditoría inicial típica?",
      opciones: ["5-10%", "15-40%", "50-60%", "Menos del 5%"],
      respuesta: 1,
      explicacion:
        "Las auditorías iniciales de calidad de datos típicamente revelan que entre el 15% y el 40% de los registros tienen al menos un problema en las 6 dimensiones.",
    },
    {
      pregunta: "En un framework de data governance para PyMEs, ¿qué significa 'dueño del dato'?",
      opciones: [
        "El gerente general que paga por el sistema de datos",
        "El área o persona responsable de la calidad y actualización de un conjunto de datos específico",
        "El proveedor de la base de datos",
        "El programador que creó la tabla en la base de datos",
      ],
      respuesta: 1,
      explicacion:
        "El data owner es el área o persona del negocio responsable de garantizar la calidad, actualización y uso adecuado de un conjunto de datos específico.",
    },
    {
      pregunta: "¿Cuál herramienta es gratuita y sirve específicamente para limpieza de datos?",
      opciones: ["Tableau", "Salesforce", "OpenRefine", "SAP"],
      respuesta: 2,
      explicacion:
        "OpenRefine (antes Google Refine) es una herramienta gratuita y open source diseñada específicamente para explorar y limpiar datos.",
    },
  ],
  ejercicio: {
    titulo: "Auditoría de calidad de datos con OpenRefine",
    objetivo:
      "Detectar y documentar problemas de calidad en un dataset real de empresa ecuatoriana usando OpenRefine.",
    herramientas: "OpenRefine (gratuito, descarga en openrefine.org), dataset de ejemplo en CSV",
    datosEjemplo:
      "Dataset: 500 registros de clientes de una ferretería en Cuenca. Campos: nombre, RUC/cédula, teléfono, ciudad, fecha_última_compra, monto_total.",
    pasos: [
      "Paso 1 — Instalar OpenRefine: Descargar desde openrefine.org e instalar localmente. Crear un nuevo proyecto importando el CSV de clientes proporcionado.",
      "Paso 2 — Análisis de completitud: Para cada columna, usar 'Text Facet' o 'Blank rows' para identificar cuántos registros tienen valores vacíos. Documentar en tabla: campo, total registros, registros vacíos, porcentaje.",
      "Paso 3 — Detección de duplicados: En el campo RUC/cédula, usar 'Text Facet' para identificar valores que aparecen más de una vez. Listar los 5 casos más frecuentes de duplicados.",
      "Paso 4 — Inconsistencias de formato: En el campo teléfono, usar 'Text Facet' para identificar formatos distintos (09XXXXXXXX vs 9XXXXXXXX vs +593 9XXXXXXXX). Documentar cuántos registros tienen cada formato.",
      "Paso 5 — Datos obsoletos: Filtrar registros con fecha_última_compra mayor a 2 años. Calcular qué porcentaje del total representan.",
      "Paso 6 — Reporte de calidad: Completar la plantilla de reporte con puntuación por dimensión (completitud, unicidad, validez, actualidad). Proponer 3 acciones de mejora prioritarias con tiempo estimado.",
    ],
    resultado:
      "Reporte de auditoría de calidad con puntuación por dimensión y plan de mejora con 3 acciones prioritarias.",
    criterios: [
      { criterio: "Análisis de completitud con tabla por campo (porcentajes correctos)", puntos: 20 },
      { criterio: "Identificación y documentación de duplicados", puntos: 20 },
      { criterio: "Detección de inconsistencias de formato con conteo", puntos: 20 },
      { criterio: "Análisis de actualidad de datos", puntos: 15 },
      { criterio: "Reporte final con puntuación y 3 acciones priorizadas", puntos: 25 },
    ],
  },
  recursos: [
    {
      titulo: "OpenRefine — Herramienta de limpieza de datos",
      url: "https://openrefine.org/",
      tipo: "herramienta",
      descripcion: "Herramienta gratuita y open source para limpiar y transformar datos",
    },
    {
      titulo: "LOPDP Ecuador — Texto oficial",
      url: "https://www.telecomunicaciones.gob.ec/ley-organica-de-proteccion-de-datos-personales/",
      tipo: "documentacion",
      descripcion: "Ley Orgánica de Protección de Datos Personales Ecuador — texto completo",
    },
    {
      titulo: "DAMA — The Data Management Body of Knowledge",
      url: "https://www.dama.org/cpages/body-of-knowledge",
      tipo: "lectura",
      descripcion: "Estándar internacional de gestión de datos — DMBOK",
    },
    {
      titulo: "Great Expectations — Validación de datos en Python",
      url: "https://greatexpectations.io/",
      tipo: "herramienta",
      descripcion: "Framework Python para documentar y validar automáticamente la calidad de datos",
    },
  ],
};

const tema7: TemaC14 = placeholder(7, "Limpieza de datos con Python y pandas", "Data Governance y Calidad", 2);
const tema8: TemaC14 = placeholder(8, "Pipelines de datos automatizados", "Data Governance y Calidad", 2);
const tema9: TemaC14 = placeholder(9, "Seguridad y privacidad de datos (LOPDP práctica)", "Data Governance y Calidad", 2);
const tema10: TemaC14 = placeholder(10, "Caso: implementar governance en una PyME ecuatoriana", "Data Governance y Calidad", 2);

// ─── MÓDULO 3: KPIs E INDICADORES CON IA ─────────────────────────────────────

const tema11: TemaC14 = {
  id: 11,
  titulo: "Diseño de KPIs con IA: del objetivo al número",
  modulo: "KPIs e Indicadores con IA",
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "KPIs inteligentes: cómo la IA mejora el diseño de indicadores",
  videoDuracion: "22 min",
  teoria: `Un KPI (Key Performance Indicator) es un valor medible que demuestra con qué efectividad una organización logra sus objetivos clave. La diferencia entre un KPI real y un número decorativo está en tres criterios: (1) está directamente vinculado a un objetivo estratégico, (2) puede ser monitoreado con frecuencia suficiente para tomar acción, y (3) hay alguien responsable de su resultado.

El framework OKR (Objectives and Key Results), popularizado por Google, es uno de los más efectivos para alinear KPIs con estrategia. Un Objective es cualitativo e inspirador ("Convertirnos en la distribuidora con mejor servicio de Quito"). Los Key Results son cuantitativos y verificables ("Reducir tiempo de entrega de 48h a 24h antes de diciembre", "NPS de clientes de 45 a 65"). Los KPIs son las métricas que monitorean el progreso hacia esos Key Results.

La inteligencia artificial potencia los KPIs de tres formas: automatización de cálculo (conectar fuentes de datos heterogéneas y calcular KPIs en tiempo real sin intervención manual), detección de anomalías (alertas automáticas cuando un KPI se desvía del rango esperado), y predicción (modelos que proyectan el valor futuro del KPI basándose en tendencias históricas y variables externas).

Para empresas ecuatorianas, los KPIs más accionables varían por sector. Retail: tasa de conversión por local, ticket promedio, rotación de inventario por SKU. Servicios: tasa de retención mensual, NPS, tiempo de resolución de soporte. Manufactura: OEE (Overall Equipment Effectiveness), tasa de defectos, costo por unidad producida. Construcción: variación de presupuesto vs ejecutado, días de retraso promedio, costo por m² construido.

Una trampa común es el "KPI vanity": métricas que se ven bien pero no impulsan decisiones. Seguidores en Instagram es un KPI vanity si no está vinculado a ventas. Visitas al sitio web es vanity si no se mide conversión. La pregunta de diagnóstico es: "Si este número sube un 20%, ¿qué acción concreta tomamos diferente?"`,
  presentacionSlides: [
    {
      titulo: "¿Qué hace a un KPI real?",
      contenido:
        "3 criterios: vinculado a objetivo estratégico + monitoreable con frecuencia accionable + alguien responsable de su resultado.",
    },
    {
      titulo: "Framework OKR: Objectives + Key Results",
      contenido:
        "Objetivo: cualitativo e inspirador. Key Results: cuantitativos y verificables. KPIs: métricas que monitorean el progreso. Popularizado por Google.",
    },
    {
      titulo: "Cómo la IA potencia los KPIs",
      contenido:
        "1. Automatización de cálculo (tiempo real, multi-fuente). 2. Detección de anomalías (alertas automáticas). 3. Predicción (proyección con ML).",
    },
    {
      titulo: "KPIs por sector en Ecuador",
      contenido:
        "Retail: ticket promedio, rotación SKU. Servicios: tasa retención, NPS. Manufactura: OEE, defectos. Construcción: variación presupuesto, costo/m².",
    },
    {
      titulo: "KPI vanity vs KPI accionable",
      contenido:
        "Vanity: seguidores, visitas, 'leads'. Accionable: tasa conversión, CAC, LTV, NPS. Test: '¿Si sube 20%, qué hacemos diferente?'",
    },
    {
      titulo: "Ejemplo: dashboard con Looker Studio + BigQuery",
      contenido:
        "Fuentes: Google Sheets (ventas), HubSpot (CRM), Meta Ads (leads). Frecuencia: diaria automática. Alertas: email si conversión baja de 3%.",
    },
    {
      titulo: "IA para detección de anomalías en KPIs",
      contenido:
        "Prophet (Facebook): detecta desviaciones vs temporada histórica. Isolation Forest: anomalías multivariadas. CloudWatch Anomaly Detection (AWS): para KPIs en tiempo real.",
    },
    {
      titulo: "Plantilla de KPI completa",
      contenido:
        "Nombre · Objetivo vinculado · Fórmula exacta · Fuente de datos · Frecuencia · Dueño · Meta · Umbral de alerta · Historial mínimo requerido.",
    },
  ],
  quiz: [
    {
      pregunta: "En el framework OKR, ¿qué son los Key Results?",
      opciones: [
        "Los objetivos cualitativos e inspiradores del equipo",
        "Las tareas diarias del proyecto",
        "Métricas cuantitativas y verificables que muestran progreso hacia el objetivo",
        "Los reportes mensuales de gestión",
      ],
      respuesta: 2,
      explicacion:
        "Los Key Results son resultados específicos, medibles y temporalmente acotados que, cuando se logran, demuestran el alcance del objetivo.",
    },
    {
      pregunta: "¿Cuál es la pregunta diagnóstica para identificar un 'KPI vanity'?",
      opciones: [
        "¿Cuánto costó implementar este KPI?",
        "¿Si este número sube un 20%, qué acción concreta tomamos diferente?",
        "¿Cuántas personas pueden ver este dashboard?",
        "¿Es fácil de calcular este indicador?",
      ],
      respuesta: 1,
      explicacion:
        "Si un KPI no cambia las decisiones cuando varía, es decorativo. La pregunta de acción concreta distingue KPIs reales de vanity metrics.",
    },
    {
      pregunta: "¿Qué herramienta de Facebook/Meta es útil para detectar desviaciones de KPIs respecto a tendencias históricas?",
      opciones: ["TensorFlow", "Prophet", "PyTorch", "Spark"],
      respuesta: 1,
      explicacion:
        "Prophet es una librería de forecasting desarrollada por Facebook, ideal para series de tiempo con estacionalidad, perfecta para detectar anomalías en KPIs históricos.",
    },
    {
      pregunta: "Para una empresa de servicios en Ecuador, ¿cuál es un KPI accionable de retención?",
      opciones: [
        "Número de seguidores en Instagram",
        "Tasa de retención mensual de clientes activos",
        "Número de vistas del sitio web",
        "Cantidad de emails enviados",
      ],
      respuesta: 1,
      explicacion:
        "La tasa de retención mensual es directamente accionable: si baja, se revisan procesos de servicio, precios o comunicación. Las otras opciones son métricas vanity o de actividad.",
    },
    {
      pregunta: "En un KPI bien definido, ¿cuál de estos elementos es imprescindible?",
      opciones: [
        "Que tenga un nombre en inglés para ser más profesional",
        "Que sea calculado manualmente por el gerente",
        "Que haya alguien responsable de su resultado",
        "Que se reporte solo una vez al año",
      ],
      respuesta: 2,
      explicacion:
        "Sin un responsable claro, los KPIs no generan accountability. Los criterios esenciales son: vínculo estratégico, frecuencia accionable y responsable definido.",
    },
  ],
  ejercicio: {
    titulo: "Dashboard de KPIs con IA usando Looker Studio",
    objetivo:
      "Diseñar y construir un dashboard de 5 KPIs para una empresa ecuatoriana usando Looker Studio conectado a Google Sheets.",
    herramientas: "Google Looker Studio (gratuito), Google Sheets, dataset de ventas proporcionado",
    datosEjemplo:
      "Dataset: 12 meses de ventas de una tienda de tecnología en Quito. Columnas: fecha, vendedor, producto, categoría, monto, canal (online/presencial), estado (pagado/pendiente).",
    pasos: [
      "Paso 1 — Definir los 5 KPIs: Usando el framework OKR, define el objetivo estratégico de la empresa y elige 5 KPIs accionables. Para cada uno: nombre, fórmula exacta, frecuencia, dueño y meta.",
      "Paso 2 — Preparar el dataset en Google Sheets: Importar el CSV de ventas a Google Sheets. Agregar columnas calculadas necesarias: mes_año, semana, monto_neto.",
      "Paso 3 — Conectar Looker Studio: Crear un nuevo reporte en Looker Studio. Conectar el Google Sheet como fuente de datos. Verificar que los tipos de datos sean correctos (fecha como Date, monto como Number).",
      "Paso 4 — Construir visualizaciones: Para cada KPI, elegir la visualización apropiada (scorecard para valor actual, gráfico de línea para tendencia, barra para comparación). Añadir filtros de fecha y vendedor.",
      "Paso 5 — Añadir comparación histórica: Para el KPI principal (ventas totales), añadir comparación mes actual vs mismo mes año anterior. Calcular variación porcentual.",
      "Paso 6 — Configurar alertas (opcional avanzado): Usando Google Apps Script, configurar un trigger que envíe email si el KPI de conversión baja de un umbral definido.",
    ],
    resultado:
      "Dashboard funcional en Looker Studio con 5 KPIs, comparación histórica y al menos 2 filtros interactivos.",
    criterios: [
      { criterio: "5 KPIs definidos con fórmula, frecuencia, dueño y meta (plantilla completa)", puntos: 25 },
      { criterio: "Dashboard funcional en Looker Studio conectado a datos reales", puntos: 30 },
      { criterio: "Visualizaciones apropiadas para cada tipo de KPI", puntos: 20 },
      { criterio: "Comparación histórica implementada", puntos: 15 },
      { criterio: "Presentación del dashboard en 3 minutos explicando qué acción tomarías si cada KPI cae", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "Google Looker Studio — Documentación oficial",
      url: "https://support.google.com/looker-studio/",
      tipo: "herramienta",
      descripcion: "Plataforma gratuita de visualización y reportes de Google",
    },
    {
      titulo: "Prophet — Forecasting de series de tiempo",
      url: "https://facebook.github.io/prophet/",
      tipo: "herramienta",
      descripcion: "Librería Python/R de Facebook para forecasting con estacionalidad",
    },
    {
      titulo: "OKR — Guía práctica de Google",
      url: "https://rework.withgoogle.com/guides/set-goals-with-okrs/steps/introduction/",
      tipo: "lectura",
      descripcion: "Guía oficial de Google sobre cómo implementar OKRs",
    },
    {
      titulo: "KPI.org — Biblioteca de KPIs por industria",
      url: "https://www.kpi.org/",
      tipo: "lectura",
      descripcion: "Referencia de KPIs estándar por sector industrial",
    },
  ],
};

const tema12: TemaC14 = placeholder(12, "Dashboards ejecutivos con Power BI", "KPIs e Indicadores con IA", 3);
const tema13: TemaC14 = placeholder(13, "Detección automática de anomalías en KPIs", "KPIs e Indicadores con IA", 3);
const tema14: TemaC14 = placeholder(14, "Forecasting de ventas con Prophet", "KPIs e Indicadores con IA", 3);
const tema15: TemaC14 = placeholder(15, "Proyecto: sistema de alertas de KPIs para una empresa", "KPIs e Indicadores con IA", 3);

// ─── MÓDULO 4: ROADMAP DE TRANSFORMACIÓN DIGITAL ─────────────────────────────

const tema16: TemaC14 = {
  id: 16,
  titulo: "Cómo construir un roadmap de datos en 90 días",
  modulo: "Roadmap de Transformación Digital",
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Roadmap data: de cero a resultados en 90 días",
  videoDuracion: "25 min",
  teoria: `Un roadmap de datos es un plan visual y cronológico que muestra cómo una organización avanzará desde su situación actual de madurez de datos hasta un estado objetivo, con hitos medibles, recursos asignados y responsables definidos. Es la diferencia entre "queremos ser data-driven" y "el 15 de septiembre tenemos el primer dashboard operativo".

El horizonte de 90 días es estratégicamente elegido: es suficientemente corto para mantener momentum y urgencia, y suficientemente largo para mostrar resultados tangibles. Los primeros 30 días (Fase Descubrir) se enfocan en diagnóstico: auditoría de fuentes de datos, entrevistas con áreas clave, identificación de la "pregunta de un millón" (el problema de datos que más duele al negocio). Los días 31-60 (Fase Construir) consisten en implementar la solución mínima viable: conectar las 2-3 fuentes de datos más críticas, calcular los 3-5 KPIs principales, crear el primer dashboard. Los días 61-90 (Fase Escalar) son de refinamiento y expansión: incorporar feedback, agregar más fuentes, automatizar reportes, capacitar a los usuarios.

Para empresas ecuatorianas, las iniciativas de datos con mayor ROI en los primeros 90 días suelen ser: (1) segmentación de clientes por valor (RFM: Recencia, Frecuencia, Monto) — permite concentrar esfuerzo comercial en el 20% de clientes que generan el 80% del ingreso; (2) análisis de rotación de inventario por producto — identifica cuáles SKUs están acumulando capital sin moverse; (3) tasa de conversión de leads por canal — revela cuáles canales de marketing están realmente generando ventas vs cuáles generan ruido.

El stack tecnológico para un roadmap de 90 días debe ser pragmático: Google Sheets o Airtable para recolección de datos inicial, Python o SQL para transformación, Looker Studio o Metabase para visualización. No es el momento de implementar un data warehouse completo — es el momento de demostrar valor. La migración a un stack más robusto (BigQuery, dbt, Superset) viene después de validar que los datos están resolviendo problemas reales de negocio.

La presentación del roadmap a la dirección debe incluir: situación actual (nivel de madurez con evidencias), situación objetivo (qué decisiones se tomarán diferente), hoja de ruta (con fechas, entregables y responsables), inversión requerida (tiempo y dinero), y ROI esperado (cuantificado en decisiones mejoradas, costos reducidos o ingresos adicionales).`,
  presentacionSlides: [
    {
      titulo: "¿Qué es un roadmap de datos?",
      contenido:
        "Plan visual y cronológico: situación actual → situación objetivo, con hitos medibles, recursos y responsables. 'Queremos ser data-driven' → '15 sept: primer dashboard operativo'.",
    },
    {
      titulo: "Por qué 90 días",
      contenido:
        "Suficientemente corto: mantiene urgencia y momentum. Suficientemente largo: resultados tangibles. Validado por decenas de transformaciones digitales en PyMEs.",
    },
    {
      titulo: "Fase 1 (Días 1-30): Descubrir",
      contenido:
        "Auditoría de fuentes de datos. Entrevistas con áreas clave. Identificar la 'pregunta de un millón' — el problema de datos que más duele al negocio.",
    },
    {
      titulo: "Fase 2 (Días 31-60): Construir",
      contenido:
        "Conectar 2-3 fuentes críticas. Calcular 3-5 KPIs principales. Primer dashboard funcional. MVP de datos, no la solución perfecta.",
    },
    {
      titulo: "Fase 3 (Días 61-90): Escalar",
      contenido:
        "Incorporar feedback de usuarios. Agregar más fuentes de datos. Automatizar reportes. Capacitar equipos. Documentar governance inicial.",
    },
    {
      titulo: "Las 3 iniciativas de mayor ROI inicial en Ecuador",
      contenido:
        "1. Segmentación RFM de clientes (Recencia-Frecuencia-Monto). 2. Análisis de rotación de inventario por SKU. 3. Tasa de conversión por canal de marketing.",
    },
    {
      titulo: "Stack pragmático para 90 días",
      contenido:
        "Recolección: Google Sheets / Airtable. Transformación: Python / SQL. Visualización: Looker Studio / Metabase. Migrar a stack robusto DESPUÉS de validar valor.",
    },
    {
      titulo: "Cómo presentar el roadmap a la dirección",
      contenido:
        "Situación actual con evidencias → Situación objetivo → Hoja de ruta con fechas → Inversión requerida → ROI cuantificado. Sin jerga técnica.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es el objetivo principal de los primeros 30 días en un roadmap de datos?",
      opciones: [
        "Implementar el data warehouse completo",
        "Contratar al equipo de data scientists",
        "Diagnóstico: auditar fuentes, entrevistar áreas, identificar el problema que más duele",
        "Lanzar el primer dashboard a toda la empresa",
      ],
      respuesta: 2,
      explicacion:
        "La fase Descubrir (días 1-30) es de diagnóstico y comprensión. Sin entender bien el problema, las soluciones técnicas serán incorrectas o irrelevantes.",
    },
    {
      pregunta: "¿Qué significa RFM en el análisis de clientes?",
      opciones: [
        "Registro, Factura, Monto",
        "Recencia, Frecuencia, Monto",
        "Rentabilidad, Frecuencia, Mercado",
        "Región, Formato, Mercado",
      ],
      respuesta: 1,
      explicacion:
        "RFM es un modelo de segmentación de clientes basado en Recencia (cuándo compró por última vez), Frecuencia (cuántas veces compra) y Monto (cuánto gasta).",
    },
    {
      pregunta: "¿Cuándo es el momento adecuado para migrar a un stack de datos robusto (BigQuery, dbt)?",
      opciones: [
        "Antes de comenzar cualquier análisis",
        "En el día 1 del roadmap",
        "Después de validar que los datos están resolviendo problemas reales de negocio",
        "Solo si la empresa tiene más de 500 empleados",
      ],
      respuesta: 2,
      explicacion:
        "El stack avanzado debe implementarse después de validar valor con herramientas simples. Migrar primero es costoso y puede generar resistencia si no hay resultados previos.",
    },
    {
      pregunta: "¿Qué herramienta gratuita se recomienda para visualización en las primeras etapas del roadmap?",
      opciones: ["Tableau Enterprise", "SAP Analytics Cloud", "Looker Studio o Metabase", "IBM Cognos"],
      respuesta: 2,
      explicacion:
        "Looker Studio (Google, gratuito) y Metabase (open source) son las opciones recomendadas para iniciar sin inversión, con suficiente capacidad para los primeros 90 días.",
    },
    {
      pregunta: "En la presentación del roadmap a la dirección, ¿qué elemento es más importante incluir para conseguir aprobación?",
      opciones: [
        "Diagramas técnicos de la arquitectura de datos",
        "Lista de todas las herramientas que se van a usar",
        "ROI cuantificado: qué decisiones mejorarán, costos reducidos o ingresos adicionales",
        "El CV del equipo técnico que ejecutará el proyecto",
      ],
      respuesta: 2,
      explicacion:
        "La dirección aprueba proyectos basados en retorno esperado. El ROI cuantificado conecta el roadmap técnico con el lenguaje de negocios que importa a los directivos.",
    },
  ],
  ejercicio: {
    titulo: "Diseñar el roadmap de datos de 90 días para una empresa ecuatoriana",
    objetivo:
      "Crear un roadmap completo de transformación de datos para una empresa específica, presentable a la dirección.",
    herramientas:
      "Miro o FigJam (gratis para 3 tableros), Google Slides o Canva para presentación ejecutiva",
    datosEjemplo:
      "Empresa: Clínica privada en Quito, 8 médicos, 50 pacientes/día, usa sistema de agendamiento manual en WhatsApp, facturación en Excel, historial clínico en papel.",
    pasos: [
      "Paso 1 — Diagnóstico inicial: Para la empresa asignada, completar la auditoría de madurez (del ejercicio del tema 1). Identificar el nivel actual y la 'pregunta de un millón' del negocio.",
      "Paso 2 — Definir situación objetivo: Describir cómo será la empresa después de 90 días. ¿Qué decisiones se tomarán diferente? ¿Qué datos estarán disponibles que hoy no lo están?",
      "Paso 3 — Fase Descubrir (días 1-30): Listar las 5 actividades concretas del mes 1. Incluir: entrevistas a realizar, sistemas a auditar, datasets a evaluar. Resultado entregable al final del mes.",
      "Paso 4 — Fase Construir (días 31-60): Diseñar el MVP de datos: qué 3 fuentes se conectarán, qué 5 KPIs se calcularán, qué dashboard se construirá. Stack tecnológico elegido con justificación.",
      "Paso 5 — Fase Escalar (días 61-90): Plan de expansión: qué se agrega, cómo se capacita al equipo, qué governance se implementa. Métricas de éxito al día 90.",
      "Paso 6 — Presentación ejecutiva: Crear presentación de 8 slides para la dirección: problema actual → oportunidad → roadmap → inversión → ROI esperado. Sin jerga técnica.",
    ],
    resultado:
      "Roadmap visual en Miro/FigJam más presentación ejecutiva de 8 slides lista para presentar a la dirección.",
    criterios: [
      { criterio: "Diagnóstico con nivel de madurez y 'pregunta de un millón' bien identificada", puntos: 15 },
      { criterio: "Situación objetivo concreta y medible", puntos: 15 },
      { criterio: "Plan detallado de las 3 fases con actividades, entregables y responsables", puntos: 30 },
      { criterio: "Stack tecnológico justificado y apropiado para la etapa", puntos: 15 },
      { criterio: "Presentación ejecutiva sin jerga técnica con ROI cuantificado", puntos: 25 },
    ],
  },
  recursos: [
    {
      titulo: "Miro — Tablero colaborativo para roadmaps",
      url: "https://miro.com/",
      tipo: "herramienta",
      descripcion: "Herramienta de pizarra colaborativa, gratis para 3 tableros",
    },
    {
      titulo: "dbt — Data Build Tool",
      url: "https://www.getdbt.com/",
      tipo: "herramienta",
      descripcion: "Herramienta para transformación y documentación de datos con tests",
    },
    {
      titulo: "Thoughtworks Technology Radar",
      url: "https://www.thoughtworks.com/radar",
      tipo: "lectura",
      descripcion: "Referencia actualizada de tecnologías de datos recomendadas vs obsoletas",
    },
    {
      titulo: "Harvard Business Review: Why Data Science Projects Fail",
      url: "https://hbr.org/2023/01/why-data-science-projects-fail",
      tipo: "lectura",
      descripcion: "Análisis de las causas más frecuentes de fracaso en proyectos de datos",
    },
  ],
};

const tema17: TemaC14 = placeholder(17, "Change management para equipos que resisten los datos", "Roadmap de Transformación Digital", 4);
const tema18: TemaC14 = placeholder(18, "Arquitectura de datos moderna: Data Mesh vs Data Lake", "Roadmap de Transformación Digital", 4);
const tema19: TemaC14 = placeholder(19, "Monetización de datos en empresas ecuatorianas", "Roadmap de Transformación Digital", 4);
const tema20: TemaC14 = placeholder(20, "Proyecto final: presentación de estrategia de datos ante panel", "Roadmap de Transformación Digital", 4);

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const C14_TEMAS: TemaC14[] = [
  tema1,  tema2,  tema3,  tema4,  tema5,
  tema6,  tema7,  tema8,  tema9,  tema10,
  tema11, tema12, tema13, tema14, tema15,
  tema16, tema17, tema18, tema19, tema20,
];
