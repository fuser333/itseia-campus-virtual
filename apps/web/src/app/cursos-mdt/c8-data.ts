// ─── C8: IA para Recursos Humanos — Datos de 16 temas ────────────────────────
// Curso C8 del programa MDT. 60 horas (16 temas).
// Módulo 1: Reclutamiento con IA (4 temas)
// Módulo 2: People Analytics (4 temas)
// Módulo 3: Onboarding y capacitación con IA (4 temas)
// Módulo 4: Cumplimiento y ética laboral Ecuador (4 temas)

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

export interface TemaC8 {
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

export const C8_MODULOS = [
  { num: 1, nombre: "Reclutamiento con IA", horas: 15, temas: 4 },
  { num: 2, nombre: "People Analytics", horas: 15, temas: 4 },
  { num: 3, nombre: "Onboarding y Capacitación con IA", horas: 15, temas: 4 },
  { num: 4, nombre: "Cumplimiento y Ética Laboral Ecuador", horas: 15, temas: 4 },
];

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC8 => ({
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

// ─── MÓDULO 1: RECLUTAMIENTO CON IA ──────────────────────────────────────────

const tema1: TemaC8 = {
  id: 1,
  titulo: "Reclutamiento inteligente: del anuncio al candidato con IA",
  modulo: "Reclutamiento con IA",
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Reclutamiento con IA: atraer y filtrar talento en Ecuador",
  videoDuracion: "20 min",
  teoria: `El reclutamiento es la función de recursos humanos más transformada por la IA en los últimos cinco años. Un proceso que antes tomaba semanas puede comprimirse a días cuando se automatiza la atracción, el cribado inicial y la comunicación con candidatos. Para empresas ecuatorianas, esto tiene una relevancia particular: el mercado laboral nacional combina alta demanda de perfiles técnicos con una oferta dispersa geográficamente entre Quito, Guayaquil, Cuenca y ciudades intermedias.

La IA interviene en cuatro etapas del funnel de reclutamiento. Primero, la redacción del anuncio: los modelos de lenguaje generan descripciones de cargo inclusivas, con lenguaje neutro en género y alineadas con el nivel del puesto. La investigación de LinkedIn y Textio muestra que los anuncios con lenguaje inclusivo reciben hasta un 42% más de aplicaciones de mujeres en roles técnicos. Segundo, la distribución inteligente: herramientas como Recruitee, Greenhouse o Workday conectan con múltiples bolsas de empleo (LinkedIn, Indeed, Computrabajo Ecuador) desde un único panel. Tercero, el cribado de hojas de vida: los ATS (Applicant Tracking Systems) con IA aplican filtros configurables por competencias, años de experiencia y formación. Cuarto, el primer contacto: chatbots de reclutamiento como Mya o HireVue conducen entrevistas asincrónicas de screening en menos de diez minutos.

En Ecuador, las principales bolsas de empleo son Multitrabajos.com, OCC Mundial, LinkedIn Ecuador y los grupos de Facebook por sector. Una estrategia de reclutamiento multicanal publicada desde un ATS con integración a estas plataformas puede triplicar el volumen de aplicaciones sin aumentar el trabajo manual del equipo de RR.HH.

Los sistemas ATS más usados en empresas ecuatorianas medianas son Zoho Recruit (por su versión gratuita y soporte en español), Breezy HR y el módulo de talento de SAP para corporaciones. La ventaja del ATS con IA no es eliminar al reclutador humano, sino liberar su tiempo de las tareas repetitivas (leer 200 hojas de vida idénticas) para concentrarlo en las decisiones que requieren juicio humano (la entrevista final, la negociación salarial, la valoración cultural).

Un riesgo crítico que todo profesional de RR.HH. debe entender es el sesgo algorítmico en reclutamiento. El caso más citado es el de Amazon (2018), que descartó su sistema de IA para reclutamiento porque había aprendido a desfavorecer candidatas mujeres, replicando el sesgo histórico de los datos de entrenamiento. En Ecuador, el artículo 11 de la Constitución prohíbe la discriminación laboral. El IESS registra denuncias por discriminación en la contratación. Usar IA sin auditar sus sesgos puede exponer legalmente a la empresa. La práctica correcta es revisar regularmente si las tasas de avance por género, etnia o edad son equitativas antes y después del filtro de IA.

El perfil de cargo es el documento que alimenta toda la automatización: si está mal redactado, la IA filtrará mal. Un perfil de cargo con IA bien estructurado tiene cinco secciones: (1) Propósito del rol en una sola oración; (2) Responsabilidades principales (5-7 en lenguaje de acción verificable); (3) Competencias requeridas separadas en esenciales vs deseables; (4) Indicadores de éxito a 90 días; (5) Condiciones del rol (horario, modalidad, remuneración referencial). Esta estructura permite que el ATS evalúe candidatos con criterios claros y que los candidatos sepan exactamente qué se espera de ellos.`,
  presentacionSlides: [
    {
      titulo: "IA en el funnel de reclutamiento",
      contenido:
        "4 etapas: redacción del anuncio + distribución multicanal + cribado de hojas de vida + primer contacto automatizado.",
    },
    {
      titulo: "Anuncios inclusivos con IA",
      contenido:
        "Lenguaje neutro en género + nivel de cargo apropiado. LinkedIn/Textio: +42% aplicaciones femeninas en roles técnicos con lenguaje inclusivo.",
    },
    {
      titulo: "Bolsas de empleo Ecuador",
      contenido:
        "Multitrabajos.com · OCC Mundial · LinkedIn Ecuador · Computrabajo · grupos Facebook sector.\nEstrategia multicanal desde un ATS = 3x volumen sin trabajo extra.",
    },
    {
      titulo: "ATS más usados en Ecuador",
      contenido:
        "Zoho Recruit (gratis, español) · Breezy HR · SAP Talent para corporaciones.\nEl ATS libera tiempo del reclutador para decisiones de juicio humano.",
    },
    {
      titulo: "Riesgo: sesgo algorítmico",
      contenido:
        "Caso Amazon 2018: IA discriminó candidatas. Art. 11 Constitución Ecuador: prohíbe discriminación laboral.\nAuditar sesgos por género/etnia/edad antes y después del filtro.",
    },
    {
      titulo: "Perfil de cargo bien estructurado",
      contenido:
        "1. Propósito del rol (1 frase). 2. Responsabilidades (5-7 acciones verificables). 3. Competencias esenciales vs deseables. 4. Indicadores a 90 días. 5. Condiciones del rol.",
    },
    {
      titulo: "Chatbots de reclutamiento",
      contenido:
        "Mya, HireVue: entrevistas asincrónicas de screening en <10 minutos.\nDisponibles 24/7. Reducen tiempo de screening en 60-70%.",
    },
    {
      titulo: "Caso Ecuador: empresa de 50 personas",
      contenido:
        "Antes: 3 semanas para cubrir una vacante, 2 personas en RR.HH. todo el tiempo.\nDespués (Zoho Recruit + IA): 8 días promedio. Mismas 2 personas gestionan 3x vacantes.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuántas etapas del funnel de reclutamiento pueden automatizarse con IA según este módulo?",
      opciones: ["1", "2", "4", "8"],
      respuesta: 2,
      explicacion:
        "Las 4 etapas son: redacción del anuncio, distribución multicanal, cribado de hojas de vida y primer contacto con chatbot.",
    },
    {
      pregunta: "¿Qué porcentaje más de aplicaciones femeninas generan los anuncios con lenguaje inclusivo en roles técnicos?",
      opciones: ["10%", "25%", "42%", "80%"],
      respuesta: 2,
      explicacion:
        "Según investigación de LinkedIn y Textio, los anuncios con lenguaje neutro en género reciben hasta un 42% más de aplicaciones de mujeres en roles técnicos.",
    },
    {
      pregunta: "¿Cuál fue el problema del sistema de reclutamiento con IA de Amazon en 2018?",
      opciones: [
        "Era demasiado costoso de operar",
        "No se integraba con las bolsas de empleo",
        "Aprendió a desfavorecer candidatas mujeres replicando sesgos históricos",
        "Solo funcionaba para roles técnicos",
      ],
      respuesta: 2,
      explicacion:
        "El sistema de Amazon replicó el sesgo histórico de sus datos de entrenamiento y discriminaba a candidatas mujeres, por lo que fue descartado.",
    },
    {
      pregunta: "¿Cuál es la herramienta ATS más accesible para una PyME ecuatoriana que necesita versión gratuita y soporte en español?",
      opciones: ["SAP Talent", "Workday", "Zoho Recruit", "Greenhouse"],
      respuesta: 2,
      explicacion:
        "Zoho Recruit ofrece versión gratuita, interfaz en español y es la opción más adoptada por PyMEs ecuatorianas.",
    },
    {
      pregunta: "En un perfil de cargo bien estructurado, ¿qué diferencia hay entre competencias esenciales y deseables?",
      opciones: [
        "No hay diferencia, son sinónimos",
        "Las esenciales eliminan candidatos al ser requisito mínimo; las deseables son ventajas adicionales",
        "Las deseables son más importantes que las esenciales",
        "Las esenciales son solo para cargos directivos",
      ],
      respuesta: 1,
      explicacion:
        "Las competencias esenciales son requisitos mínimos sin los cuales el candidato no avanza. Las deseables son diferenciadores que suman puntos pero no son eliminatorias.",
    },
  ],
  ejercicio: {
    titulo: "Perfil de cargo + anuncio inclusivo con IA",
    objetivo:
      "Crear un perfil de cargo completo y un anuncio de empleo inclusivo usando IA para un puesto real de una empresa ecuatoriana.",
    herramientas: "Claude.ai o ChatGPT (plan gratuito), Google Docs, Zoho Recruit (cuenta gratuita)",
    datosEjemplo:
      "Empresa: agencia de comunicación digital en Quito, 15 empleados. Vacante: Diseñador UX/UI. Modalidad híbrida. Salario referencial: $800-$1,200.",
    pasos: [
      "Paso 1 — Elegir empresa y vacante: Define una empresa real o del caso proporcionado. Documenta sector, tamaño y el puesto a cubrir.",
      "Paso 2 — Entrevista al hiring manager con IA: Usa este prompt en Claude: 'Eres un experto en RR.HH. Hazme 8 preguntas para entender el rol de [puesto] que necesito cubrir y definir el perfil ideal.' Responde las preguntas como si fueras el gerente.",
      "Paso 3 — Generar perfil de cargo: Con las respuestas, pide a la IA: 'Genera un perfil de cargo con las 5 secciones estándar: propósito, responsabilidades, competencias esenciales/deseables, indicadores a 90 días y condiciones del rol.'",
      "Paso 4 — Auditar sesgo del perfil: Solicita a la IA: 'Analiza este perfil de cargo e identifica cualquier lenguaje que pueda ser excluyente por género, edad o etnia. Propón versión inclusiva.'",
      "Paso 5 — Generar anuncio de empleo: Pide a la IA que adapte el perfil a un anuncio de 250-300 palabras para publicar en LinkedIn y Multitrabajos.com, con lenguaje inclusivo y tono apropiado para el sector.",
      "Paso 6 — Publicar en Zoho Recruit: Crea cuenta gratuita en Zoho Recruit. Carga el anuncio y simula la publicación en 2 plataformas simultáneas.",
    ],
    resultado:
      "Perfil de cargo completo en las 5 secciones + anuncio de empleo inclusivo listo para publicar + captura de Zoho Recruit con la vacante cargada.",
    criterios: [
      { criterio: "Perfil de cargo con las 5 secciones completas y lenguaje de acción verificable", puntos: 30 },
      { criterio: "Anuncio con lenguaje inclusivo, sin sesgos identificados por la IA", puntos: 25 },
      { criterio: "Competencias esenciales y deseables correctamente diferenciadas", puntos: 20 },
      { criterio: "Anuncio configurado en Zoho Recruit con integración a 2 plataformas", puntos: 15 },
      { criterio: "Indicadores de éxito a 90 días específicos y medibles", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "Zoho Recruit — ATS gratuito",
      url: "https://www.zoho.com/recruit/",
      tipo: "herramienta",
      descripcion: "Sistema de seguimiento de candidatos con plan gratuito y soporte en español",
    },
    {
      titulo: "LinkedIn Talent Solutions — Reclutamiento inclusivo",
      url: "https://business.linkedin.com/talent-solutions/resources/talent-strategy/diversity-recruiting",
      tipo: "lectura",
      descripcion: "Guía de LinkedIn sobre reclutamiento inclusivo con datos de efectividad",
    },
    {
      titulo: "Multitrabajos Ecuador",
      url: "https://www.multitrabajos.com/",
      tipo: "herramienta",
      descripcion: "Principal bolsa de empleo de Ecuador con API de integración para ATS",
    },
    {
      titulo: "MIT: Algorithmic Fairness in Hiring",
      url: "https://news.mit.edu/2021/machine-learning-fairness-explained-0908",
      tipo: "lectura",
      descripcion: "Explicación del MIT sobre sesgo algorítmico en sistemas de contratación",
    },
  ],
};

const tema2: TemaC8 = placeholder(2, "Entrevistas con IA: screening, evaluación y decisión", "Reclutamiento con IA", 1);
const tema3: TemaC8 = placeholder(3, "Evaluaciones de competencias y assessments con IA", "Reclutamiento con IA", 1);
const tema4: TemaC8 = placeholder(4, "Employer branding digital con IA para empresas ecuatorianas", "Reclutamiento con IA", 1);

// ─── MÓDULO 2: PEOPLE ANALYTICS ──────────────────────────────────────────────

const tema5: TemaC8 = placeholder(5, "Introducción a People Analytics: datos que hablan del talento", "People Analytics", 2);

const tema6: TemaC8 = {
  id: 6,
  titulo: "Rotación de personal: predecir y prevenir con IA",
  modulo: "People Analytics",
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Predecir la rotación de personal con modelos de IA",
  videoDuracion: "22 min",
  teoria: `La rotación de personal es uno de los costos ocultos más subestimados en las empresas ecuatorianas. La Society for Human Resource Management (SHRM) estima que reemplazar a un empleado cuesta entre el 50% y el 200% de su salario anual, dependiendo del nivel. Para un cargo de $1,000 mensuales en Quito, eso equivale a $6,000-$24,000 en costos de reclutamiento, capacitación, productividad perdida y error del nuevo empleado durante los primeros meses. Si la empresa tiene 30% de rotación anual sobre una nómina de 50 personas, el costo invisible puede superar los $200,000 al año.

La inteligencia artificial permite construir modelos predictivos de rotación que identifican qué empleados tienen alta probabilidad de renunciar en los próximos 3-6 meses, antes de que lo hagan. Estos modelos se alimentan de señales de comportamiento que, individualmente, parecen insignificantes, pero combinadas tienen alta capacidad predictiva. Las señales más relevantes incluyen: disminución en el uso de sistemas internos, reducción de participación en reuniones, cambios en el patrón de llegada/salida, solicitudes frecuentes de días libres, menor interacción con el equipo en herramientas colaborativas, ausencia de solicitudes de capacitación, y una revisión salarial pendiente más de 18 meses.

El proceso técnico para construir un modelo predictivo de rotación tiene cuatro etapas. Primera: recolección de datos históricos — los empleados que se fueron en los últimos 3 años con sus características (antigüedad, área, cargo, evaluaciones de desempeño, ausentismo, salario relativo al mercado). Segunda: feature engineering — convertir datos brutos en variables que el modelo entiende (meses de antigüedad, diferencia porcentual entre salario actual y media del mercado, días de ausentismo en los últimos 6 meses). Tercera: entrenamiento del modelo — Random Forest y Gradient Boosting son los algoritmos más efectivos para este caso por su capacidad de manejar variables mixtas y generar scores de importancia de variables. Cuarta: implementación de alertas — integrar el modelo con el HRIS (Human Resources Information System) para que el equipo de RR.HH. reciba alertas semanales con los empleados en zona de riesgo.

En Ecuador, el IESS registra estadísticas de rotación por sector. Los sectores con mayor rotación son construcción (40-60% anual), comercio al por menor (35-50%) y call centers (50-80%). Los sectores con menor rotación son banca y finanzas (8-15%) y sector público (prácticamente nula por estabilidad laboral). Conocer el benchmark sectorial es esencial para interpretar si la rotación de tu empresa es un problema o está dentro de la norma.

Una práctica crítica antes de implementar People Analytics es la transparencia con los empleados. La LOPDP ecuatoriana (artículo 22) establece que los titulares de datos personales tienen derecho a conocer el tratamiento que se da a sus datos. Analizar comportamiento laboral con IA implica tratar datos personales. Las mejores prácticas incluyen: informar en el contrato o política interna qué datos se recopilan y con qué propósito, garantizar que los scores predictivos se usen para retención (intervención de RR.HH.) y no para discriminación, y nunca tomar decisiones automáticas sobre personas basadas exclusivamente en el modelo (el artículo 21 de la LOPDP prohíbe decisiones puramente automatizadas que afecten derechos).

Las intervenciones de retención más efectivas una vez identificado un empleado en riesgo son, en orden de impacto según la literatura de People Analytics: conversación 1:1 genuina con el manager directo, ajuste salarial o reconocimiento, asignación a un proyecto desafiante, oportunidad de ascenso o desarrollo, y flexibilidad de horario o modalidad. La IA identifica quién está en riesgo; el humano ejecuta la intervención. Esta división de responsabilidades es la que hace que los programas de retención con IA funcionen.`,
  presentacionSlides: [
    {
      titulo: "El costo real de la rotación",
      contenido:
        "SHRM: reemplazar 1 empleado = 50-200% de su salario anual.\n30% rotación en 50 personas a $1k/mes = más de $200k/año invisible.",
    },
    {
      titulo: "Señales predictivas de renuncia",
      contenido:
        "Reducción uso sistemas internos · menos participación en reuniones · ausentismo creciente · sin solicitudes de capacitación · revisión salarial pendiente >18 meses.",
    },
    {
      titulo: "4 etapas del modelo predictivo",
      contenido:
        "1. Datos históricos de quienes se fueron.\n2. Feature engineering (antigüedad, salario relativo, ausentismo).\n3. Entrenar modelo (Random Forest / Gradient Boosting).\n4. Alertas semanales en HRIS.",
    },
    {
      titulo: "Rotación por sector Ecuador (IESS)",
      contenido:
        "Construcción: 40-60% anual\nComercio retail: 35-50%\nCall centers: 50-80%\nBanca: 8-15%\nSector público: casi nula.",
    },
    {
      titulo: "LOPDP y People Analytics",
      contenido:
        "Art. 22 LOPDP: empleados tienen derecho a saber qué datos se analizan.\nArt. 21: prohibidas decisiones puramente automatizadas que afecten derechos.\nUsar IA para retención, no para discriminación.",
    },
    {
      titulo: "Intervenciones de retención (por impacto)",
      contenido:
        "1. Conversación 1:1 genuina\n2. Ajuste salarial o reconocimiento\n3. Proyecto desafiante\n4. Ascenso o desarrollo\n5. Flexibilidad horario/modalidad",
    },
    {
      titulo: "Herramientas disponibles",
      contenido:
        "Python (scikit-learn) para el modelo. Power BI o Looker Studio para el dashboard. HRIS con API: BambooHR, Zoho People. Alternativa no-code: Obviously AI.",
    },
    {
      titulo: "La regla de oro",
      contenido:
        "IA identifica QUIÉN está en riesgo.\nEl humano ejecuta la INTERVENCIÓN.\n\nNunca automatizar la decisión final sobre personas.",
    },
  ],
  quiz: [
    {
      pregunta: "Según la SHRM, ¿cuánto cuesta reemplazar a un empleado en proporción a su salario anual?",
      opciones: [
        "10-20% del salario anual",
        "50-200% del salario anual",
        "Exactamente un mes de salario",
        "Solo los costos de reclutamiento directos",
      ],
      respuesta: 1,
      explicacion:
        "La SHRM estima el costo total de reemplazo entre el 50% y el 200% del salario anual, incluyendo reclutamiento, capacitación y productividad perdida.",
    },
    {
      pregunta: "¿Cuál de estos sectores en Ecuador tiene la mayor rotación de personal según datos del IESS?",
      opciones: ["Banca y finanzas", "Sector público", "Call centers", "Educación pública"],
      respuesta: 2,
      explicacion:
        "Los call centers tienen rotación anual de 50-80%, la más alta entre los sectores registrados en Ecuador.",
    },
    {
      pregunta: "¿Qué algoritmos son más efectivos para modelos predictivos de rotación de personal?",
      opciones: [
        "Regresión lineal simple",
        "Random Forest y Gradient Boosting",
        "K-means clustering",
        "Algoritmos de visión por computadora",
      ],
      respuesta: 1,
      explicacion:
        "Random Forest y Gradient Boosting son los más efectivos para este caso porque manejan variables mixtas (numéricas y categóricas) y generan scores de importancia de variables interpretables.",
    },
    {
      pregunta: "¿Qué prohíbe el artículo 21 de la LOPDP ecuatoriana en el contexto de People Analytics?",
      opciones: [
        "Usar cualquier tipo de dato laboral",
        "Compartir datos con el IESS",
        "Tomar decisiones puramente automatizadas que afecten derechos de las personas",
        "Contratar empleados sin revisión de IA",
      ],
      respuesta: 2,
      explicacion:
        "El artículo 21 de la LOPDP prohíbe las decisiones automatizadas que afecten derechos. Esto significa que el modelo de IA puede sugerir, pero un humano debe tomar la decisión final.",
    },
    {
      pregunta: "¿Cuál es la intervención de retención de mayor impacto según la literatura de People Analytics?",
      opciones: [
        "Aumento de sueldo inmediato",
        "Conversación 1:1 genuina con el manager directo",
        "Asignación a un proyecto desafiante",
        "Flexibilidad de horario",
      ],
      respuesta: 1,
      explicacion:
        "La conversación directa y auténtica con el manager es la intervención de mayor impacto. Muchas renuncias se previenen simplemente siendo escuchado por el jefe directo.",
    },
  ],
  ejercicio: {
    titulo: "Modelo de predicción de rotación en Python con dataset de RR.HH.",
    objetivo:
      "Construir un modelo predictivo de rotación de personal usando Python y scikit-learn con un dataset simulado de empleados ecuatorianos.",
    herramientas: "Google Colab (gratuito), Python, scikit-learn, pandas, matplotlib, dataset de ejemplo",
    datosEjemplo:
      "Dataset: 400 registros de empleados de una empresa de manufactura en Guayaquil. Variables: antigüedad (meses), salario, área, evaluación_desempeño (1-5), ausentismo_semestral (días), horas_extra, rotó (Sí/No).",
    pasos: [
      "Paso 1 — Cargar y explorar datos: En Google Colab, importar el CSV y usar pandas para explorar distribuciones. Graficar la proporción de empleados que rotaron vs los que permanecen.",
      "Paso 2 — Limpieza y feature engineering: Tratar valores nulos. Crear variable 'salario_relativo_media' (salario del empleado / media del área). Codificar variables categóricas (área, nivel) con pd.get_dummies.",
      "Paso 3 — Dividir dataset: Usar train_test_split con 80% entrenamiento y 20% prueba. Separar la variable objetivo (rotó) de las variables predictoras.",
      "Paso 4 — Entrenar Random Forest: Instanciar RandomForestClassifier con 100 árboles. Entrenar con los datos de entrenamiento. Evaluar con el conjunto de prueba: accuracy, precision, recall y AUC-ROC.",
      "Paso 5 — Importancia de variables: Extraer feature_importances_ del modelo. Graficar las top 8 variables que más predicen la rotación. Interpretar qué dice cada variable sobre el comportamiento de la empresa.",
      "Paso 6 — Simular alertas: Aplicar el modelo a los empleados actuales (datos no etiquetados). Identificar los 10 empleados con mayor probabilidad de rotar. Proponer acción de retención para cada uno.",
    ],
    resultado:
      "Notebook de Google Colab con modelo entrenado, métricas de evaluación, gráfico de importancia de variables y lista de 10 empleados en zona de riesgo con propuesta de intervención.",
    criterios: [
      { criterio: "Dataset cargado y explorado con gráficos de distribución", puntos: 15 },
      { criterio: "Feature engineering correcto (salario relativo, encoding)", puntos: 20 },
      { criterio: "Modelo Random Forest entrenado con AUC-ROC > 0.70", puntos: 25 },
      { criterio: "Gráfico de importancia de variables con interpretación de negocio", puntos: 20 },
      { criterio: "Lista de 10 empleados en riesgo con propuesta de intervención fundamentada", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "scikit-learn — Random Forest Classifier",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html",
      tipo: "documentacion",
      descripcion: "Documentación oficial de scikit-learn para el clasificador Random Forest",
    },
    {
      titulo: "SHRM — Employee Turnover Costs",
      url: "https://www.shrm.org/topics-tools/tools/toolkits/retaining-talent",
      tipo: "lectura",
      descripcion: "Guía de la SHRM sobre costos de rotación y estrategias de retención",
    },
    {
      titulo: "Google Colab",
      url: "https://colab.research.google.com/",
      tipo: "herramienta",
      descripcion: "Entorno de Python gratuito en la nube, sin instalación requerida",
    },
    {
      titulo: "LOPDP Ecuador — Texto oficial",
      url: "https://www.telecomunicaciones.gob.ec/ley-organica-de-proteccion-de-datos-personales/",
      tipo: "documentacion",
      descripcion: "Ley Orgánica de Protección de Datos Personales — texto completo vigente",
    },
  ],
};

const tema7: TemaC8 = placeholder(7, "Análisis de clima laboral con NLP y encuestas", "People Analytics", 2);
const tema8: TemaC8 = placeholder(8, "Dashboard de RR.HH. con Power BI: métricas que importan", "People Analytics", 2);

// ─── MÓDULO 3: ONBOARDING Y CAPACITACIÓN CON IA ──────────────────────────────

const tema9: TemaC8 = placeholder(9, "Diseño de onboarding digital: primeros 90 días con IA", "Onboarding y Capacitación con IA", 3);
const tema10: TemaC8 = placeholder(10, "LMS inteligentes: personalización del aprendizaje con IA", "Onboarding y Capacitación con IA", 3);

const tema11: TemaC8 = {
  id: 11,
  titulo: "Generación de contenido de capacitación con IA",
  modulo: "Onboarding y Capacitación con IA",
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Crear materiales de capacitación con IA en una fracción del tiempo",
  videoDuracion: "21 min",
  teoria: `La creación de contenido de capacitación es una de las tareas más demandantes del área de RR.HH. y formación. Desarrollar un curso interno de 4 horas con metodología tradicional puede tomar entre 40 y 80 horas de trabajo de un diseñador instruccional: investigar el contenido, estructurar el guion, desarrollar los materiales, crear las evaluaciones y producir el soporte visual. Con IA, ese tiempo puede reducirse al 30-40% del original, con calidad comparable o superior en contenido, aunque siempre con revisión experta final.

Los tipos de contenido de capacitación que la IA genera con mayor efectividad son: guiones de módulos e-learning estructurados con objetivos de aprendizaje, preguntas de evaluación con distractores plausibles, resúmenes ejecutivos de políticas o procedimientos extensos, cuestionarios de diagnóstico de conocimientos previos, casos de estudio basados en situaciones reales del sector, y materiales de apoyo visualizables (esquemas, listas, comparativas). Lo que la IA no reemplaza es la experiencia del experto que valida el contenido técnico ni el juicio pedagógico sobre qué nivel de dificultad es apropiado para el público objetivo.

La arquitectura de un prompt efectivo para generar contenido de capacitación tiene cinco componentes. Primero, el contexto del aprendiz: quién es el estudiante, su nivel actual de conocimiento y su rol profesional. Segundo, el objetivo de aprendizaje en formato Bloom: "Al finalizar este módulo, el participante será capaz de [verbo de acción observable] [contenido específico] [en qué condiciones]." Tercero, el formato solicitado: longitud, estructura, tipo de evaluación, tono. Cuarto, restricciones: vocabulario específico a usar o evitar, normativa aplicable, ejemplos de contexto ecuatoriano. Quinto, ejemplo o referencia de estilo si existe material previo con el que alinear.

Las herramientas especializadas en creación de e-learning con IA incluyen Articulate Rise (el estándar corporativo, con IA integrada desde 2024), iSpring Suite, Canva para Educación y ITSEIA Studio (próximamente). Para videos de capacitación, HeyGen permite crear presentadores virtuales en español con voz natural, eliminando la necesidad de grabar con cámara. Synthesia ofrece la misma funcionalidad con avatares localizables. Para quizzes automáticos, Quizgecko y Formative generan bancos de preguntas desde documentos de texto.

Un caso de uso muy relevante para empresas ecuatorianas es la generación de contenido de inducción corporativa. El proceso estándar: cargar el Reglamento Interno de Trabajo (obligatorio por el Código del Trabajo, Art. 64), el manual de marca, las políticas de RR.HH. y el organigrama a un asistente con RAG (como Strata o una instancia de Claude con documentos adjuntos). El asistente puede entonces responder preguntas de nuevos empleados en tiempo real, generar resúmenes por rol y crear evaluaciones de comprensión del reglamento interno.

La evaluación del aprendizaje es donde muchas empresas se quedan cortas. El modelo de Kirkpatrick tiene cuatro niveles: reacción (¿les gustó el curso?), aprendizaje (¿aprendieron?), comportamiento (¿cambiaron cómo hacen su trabajo?) y resultados (¿mejoró el negocio?). La IA ayuda principalmente en el nivel 2: generar evaluaciones de conocimiento robustas con preguntas de aplicación, casos y análisis, no solo memorización. El nivel 4 requiere conectar con datos de negocio, algo que People Analytics debe coordinar con el área de capacitación.

La propiedad intelectual del contenido generado con IA es un tema en evolución legal en Ecuador. La normativa del IEPI (Instituto Ecuatoriano de Propiedad Intelectual) no tiene aún regulación específica sobre obras generadas con IA. La práctica recomendada es documentar que el contenido fue generado con asistencia de IA y revisado por experto humano. Para capacitaciones certificadas por SECAP, el contenido debe seguir los formatos exigidos por el organismo y ser firmado por el instructor responsable.`,
  presentacionSlides: [
    {
      titulo: "IA en la creación de contenido de capacitación",
      contenido:
        "Tiempo tradicional: 40-80h para un curso de 4h.\nCon IA: reducción al 30-40% del tiempo original.\nSiempre con revisión experta final.",
    },
    {
      titulo: "Qué genera la IA con mayor efectividad",
      contenido:
        "Guiones e-learning con objetivos · preguntas con distractores plausibles · resúmenes de políticas · casos de estudio · materiales de apoyo visual.",
    },
    {
      titulo: "Arquitectura del prompt de capacitación",
      contenido:
        "1. Contexto del aprendiz\n2. Objetivo Bloom (verbo observable + contenido + condición)\n3. Formato solicitado\n4. Restricciones (norma, vocabulario)\n5. Ejemplo de estilo",
    },
    {
      titulo: "Herramientas especializadas",
      contenido:
        "Articulate Rise: estándar corporativo con IA.\nHeyGen / Synthesia: presentadores virtuales en español.\nQuizgecko: quizzes automáticos desde documentos.",
    },
    {
      titulo: "Caso Ecuador: inducción con RAG",
      contenido:
        "Cargar Reglamento Interno + políticas + organigrama a Claude/Strata.\nEl asistente responde preguntas de nuevos empleados 24/7 y genera evaluaciones de comprensión.",
    },
    {
      titulo: "Modelo Kirkpatrick (4 niveles)",
      contenido:
        "1. Reacción: ¿les gustó?\n2. Aprendizaje: ¿aprendieron? (IA ayuda aquí)\n3. Comportamiento: ¿cambiaron?\n4. Resultados: ¿mejoró el negocio?",
    },
    {
      titulo: "Certificación SECAP en Ecuador",
      contenido:
        "Contenido IA para SECAP: seguir formatos oficiales + firmado por instructor responsable.\nDocumentar que fue asistido por IA y revisado por experto.",
    },
    {
      titulo: "Propiedad intelectual del contenido IA",
      contenido:
        "IEPI Ecuador: sin regulación específica aún (2026).\nMejor práctica: documentar asistencia de IA + revisión humana + firma del responsable técnico.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuánto tiempo ahorra la IA respecto al método tradicional en la creación de contenido de capacitación?",
      opciones: [
        "No ahorra tiempo significativo",
        "Ahorra el 10-15% del tiempo",
        "Reduce el tiempo al 30-40% del original (ahorra 60-70%)",
        "Elimina completamente la necesidad de tiempo humano",
      ],
      respuesta: 2,
      explicacion:
        "La IA reduce el tiempo de desarrollo al 30-40% del original, lo que equivale a un ahorro del 60-70%, siempre con revisión experta final.",
    },
    {
      pregunta: "¿Cuál es el segundo nivel del modelo Kirkpatrick y cómo la IA lo apoya?",
      opciones: [
        "Reacción — con encuestas de satisfacción automáticas",
        "Aprendizaje — con evaluaciones de conocimiento robustas generadas por IA",
        "Comportamiento — monitoreando cambios con cámaras",
        "Resultados — calculando ROI automáticamente",
      ],
      respuesta: 1,
      explicacion:
        "El nivel 2 es Aprendizaje (¿aprendieron?). La IA contribuye principalmente aquí generando preguntas de evaluación de aplicación, casos y análisis, no solo memorización.",
    },
    {
      pregunta: "En Ecuador, ¿qué artículo del Código del Trabajo obliga a las empresas a tener Reglamento Interno?",
      opciones: ["Art. 11", "Art. 42", "Art. 64", "Art. 95"],
      respuesta: 2,
      explicacion:
        "El Art. 64 del Código del Trabajo ecuatoriano establece la obligación de las empresas de tener un Reglamento Interno de Trabajo.",
    },
    {
      pregunta: "¿Qué formato de objetivo de aprendizaje es el correcto según la taxonomía Bloom?",
      opciones: [
        "'El participante entenderá la LOPDP'",
        "'Al finalizar, el participante será capaz de redactar una política de privacidad conforme a la LOPDP en 60 minutos'",
        "'Hablar sobre datos personales'",
        "'Saber todo sobre la ley de datos'",
      ],
      respuesta: 1,
      explicacion:
        "Un objetivo Bloom bien redactado incluye: verbo de acción observable (redactar), contenido específico (política de privacidad conforme a LOPDP) y condición (en 60 minutos).",
    },
    {
      pregunta: "¿Qué herramienta permite crear presentadores virtuales en español para videos de capacitación sin grabar con cámara?",
      opciones: ["Articulate Rise", "HeyGen o Synthesia", "Quizgecko", "Google Slides"],
      respuesta: 1,
      explicacion:
        "HeyGen y Synthesia permiten crear videos de capacitación con avatares hablando en español natural, eliminando la necesidad de grabación en cámara.",
    },
  ],
  ejercicio: {
    titulo: "Módulo de inducción con IA para una empresa ecuatoriana",
    objetivo:
      "Crear un módulo completo de inducción corporativa con IA incluyendo guion, evaluación de comprensión y asistente de preguntas frecuentes.",
    herramientas: "Claude.ai, Google Docs, Quizgecko (gratuito), Canva para material visual",
    datosEjemplo:
      "Empresa: cadena de farmacias en Ecuador, 80 empleados, 5 sucursales en Quito. Nuevo empleado: vendedor de mostrador. Primer día de trabajo.",
    pasos: [
      "Paso 1 — Definir perfil del aprendiz y objetivos: Documenta el rol del nuevo empleado y sus conocimientos previos asumidos. Redacta 3 objetivos de aprendizaje en formato Bloom para la inducción.",
      "Paso 2 — Estructura del módulo: Pide a Claude que genere la estructura de un módulo de inducción de 45 minutos en 5 secciones, con tiempo estimado por sección y tipo de actividad.",
      "Paso 3 — Guion completo con IA: Para la sección más importante (por ejemplo, atención al cliente y políticas de la empresa), genera el guion completo con la arquitectura de prompt de 5 componentes. Revisa y edita.",
      "Paso 4 — Evaluación de comprensión: Usa Quizgecko para generar 8 preguntas de comprensión del Reglamento Interno (carga el texto o usa el guion generado). Incluye al menos 3 preguntas de aplicación (casos).",
      "Paso 5 — Asistente de preguntas frecuentes: En Claude, usa el modo de documento adjunto para cargar el guion y genera una lista de las 15 preguntas más frecuentes de nuevos empleados con sus respuestas.",
      "Paso 6 — Material visual: En Canva, crea una infografía de una página con los 5 puntos más importantes del módulo de inducción usando la paleta corporativa de la empresa.",
    ],
    resultado:
      "Módulo de inducción con: 3 objetivos Bloom + estructura de 5 secciones + guion completo de la sección principal + 8 preguntas de evaluación + 15 FAQ con respuestas + infografía visual.",
    criterios: [
      { criterio: "3 objetivos Bloom correctamente redactados (verbo + contenido + condición)", puntos: 20 },
      { criterio: "Guion completo con prompt de 5 componentes, revisado y editado", puntos: 30 },
      { criterio: "8 preguntas de evaluación (mínimo 3 de aplicación con casos)", puntos: 20 },
      { criterio: "15 FAQ con respuestas precisas basadas en el contenido del módulo", puntos: 15 },
      { criterio: "Infografía visual clara y alineada con la identidad de la empresa", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Articulate Rise 360",
      url: "https://articulate.com/360/rise",
      tipo: "herramienta",
      descripcion: "Plataforma estándar corporativo para crear e-learning con IA integrada",
    },
    {
      titulo: "Quizgecko — Generador de quizzes con IA",
      url: "https://quizgecko.com/",
      tipo: "herramienta",
      descripcion: "Genera bancos de preguntas de evaluación desde cualquier documento de texto",
    },
    {
      titulo: "Kirkpatrick Partners — Modelo de evaluación",
      url: "https://www.kirkpatrickpartners.com/the-kirkpatrick-model/",
      tipo: "lectura",
      descripcion: "Sitio oficial del Modelo Kirkpatrick de evaluación del aprendizaje",
    },
    {
      titulo: "SECAP Ecuador — Normas de capacitación",
      url: "https://www.secap.gob.ec/",
      tipo: "documentacion",
      descripcion: "Servicio Ecuatoriano de Capacitación Profesional — formatos y requisitos oficiales",
    },
  ],
};

const tema12: TemaC8 = placeholder(12, "Métricas de capacitación: ROI del aprendizaje con datos", "Onboarding y Capacitación con IA", 3);

// ─── MÓDULO 4: CUMPLIMIENTO Y ÉTICA LABORAL ECUADOR ──────────────────────────

const tema13: TemaC8 = placeholder(13, "Código del Trabajo Ecuador: obligaciones clave para RR.HH.", "Cumplimiento y Ética Laboral Ecuador", 4);
const tema14: TemaC8 = placeholder(14, "IESS: afiliación, beneficios y auditoría con IA", "Cumplimiento y Ética Laboral Ecuador", 4);
const tema15: TemaC8 = placeholder(15, "Acoso laboral y discriminación: detección con IA y protocolo", "Cumplimiento y Ética Laboral Ecuador", 4);

const tema16: TemaC8 = {
  id: 16,
  titulo: "LOPDP, ética de datos y IA responsable en RR.HH.",
  modulo: "Cumplimiento y Ética Laboral Ecuador",
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "IA responsable en RR.HH.: LOPDP y ética laboral en Ecuador",
  videoDuracion: "24 min",
  teoria: `La Ley Orgánica de Protección de Datos Personales (LOPDP) del Ecuador, vigente desde mayo de 2023 con el Reglamento publicado en octubre de 2024, es la norma central que regula el tratamiento de datos personales en el país. Para el área de Recursos Humanos, su relevancia es máxima: los datos de empleados son datos personales y en muchos casos datos sensibles, que reciben protección reforzada.

Los datos sensibles en el ámbito laboral incluyen, según el artículo 27 de la LOPDP: datos de salud (historial médico para el IESS, certificados de discapacidad, pruebas de embarazo), datos biométricos (huella dactilar para control de asistencia, reconocimiento facial), datos sobre afiliación sindical, y datos sobre orientación sexual o identidad de género. Estos datos solo pueden tratarse con consentimiento explícito del titular o cuando la ley lo permite expresamente (por ejemplo, la afiliación al IESS requiere datos de salud por mandato legal).

Las bases legales para tratar datos de empleados en Ecuador son cuatro. Primera: ejecución de contrato — los datos necesarios para cumplir el contrato de trabajo (nombre, cédula, cuenta bancaria, cargo) pueden tratarse sin consentimiento adicional. Segunda: obligación legal — datos requeridos por el IESS, el Ministerio de Trabajo o el SRI (declaraciones de nómina, actas de finiquito). Tercera: interés legítimo — análisis internos de desempeño o clima laboral con anonimización apropiada. Cuarta: consentimiento — para análisis de datos que van más allá de la relación laboral, como encuestas de bienestar que incluyen preguntas sensibles.

El principio de minimización de datos es fundamental: solo recopilar los datos estrictamente necesarios para el propósito declarado. En la práctica de RR.HH. con IA, esto significa no recopilar datos de redes sociales de empleados sin consentimiento, no monitorear comunicaciones privadas aunque sean en dispositivos de empresa sin política documentada, y no usar datos de salud para decisiones de ascenso o permanencia.

Las multas por incumplimiento de la LOPDP son graduadas en tres categorías. Leve: hasta 1.000 salarios básicos unificados (aproximadamente USD 500.000 en 2026, dado el SBU de $500). Grave: hasta 2.000 SBU. Muy grave: hasta 5.000 SBU (aproximadamente USD 2.5 millones). Para una PyME, incluso una infracción leve puede ser devastadora. Sin embargo, la Superintendencia de Protección de Datos, organismo de control creado por la LOPDP, aplica criterios de proporcionalidad para empresas pequeñas.

El Código del Trabajo ecuatoriano también regula aspectos relevantes para la IA en RR.HH. El artículo 172 establece las causas para despido intempestivo; usar una decisión de IA como única justificación para despedir a un empleado sin seguir el debido proceso puede resultar en responsabilidad civil. El artículo 46 prohíbe la discriminación en el trabajo. Si un sistema de IA produce resultados discriminatorios (por ejemplo, un modelo de desempeño que sistemáticamente puntúa más bajo a trabajadoras embarazadas), la empresa es responsable aunque el sesgo sea del algoritmo.

Las mejores prácticas de IA responsable en RR.HH. sintetizan la experiencia de las empresas más avanzadas en People Analytics. Primera: mantener un registro de actividades de tratamiento (RAT) para todos los sistemas de RR.HH. con IA, documentando propósito, base legal, categorías de datos y tiempo de retención. Segunda: realizar evaluaciones de impacto de privacidad (EIPD) antes de implementar nuevos sistemas de análisis de personal. Tercera: garantizar supervisión humana en todas las decisiones sobre personas: la IA recomienda, el humano decide. Cuarta: establecer procedimientos claros para que los empleados ejerzan sus derechos ARCO-P (Acceso, Rectificación, Cancelación, Oposición y Portabilidad). Quinta: capacitar al equipo de RR.HH. en privacidad y ética de datos al menos una vez al año.

El cumplimiento normativo no es un obstáculo para la innovación con IA en RR.HH.; es su precondición de sostenibilidad. Las empresas que implementan IA con governance ético son las que pueden escalarla sin riesgo reputacional ni legal. En Ecuador, donde la confianza institucional es frágil, ser una empresa que protege los datos de sus empleados puede ser también un diferenciador en la atracción de talento.`,
  presentacionSlides: [
    {
      titulo: "LOPDP y datos laborales",
      contenido:
        "Vigente desde mayo 2023 (Reglamento oct 2024). Datos de empleados = datos personales con protección máxima. Datos sensibles: salud, biométricos, afiliación sindical.",
    },
    {
      titulo: "Datos sensibles en RR.HH. (Art. 27 LOPDP)",
      contenido:
        "Salud (historial IESS, discapacidad). Biométricos (huella, reconocimiento facial). Afiliación sindical. Orientación sexual.\nRequieren consentimiento explícito o habilitación legal expresa.",
    },
    {
      titulo: "4 bases legales para datos de empleados",
      contenido:
        "1. Ejecución de contrato (nombre, cuenta, cargo).\n2. Obligación legal (IESS, Min. Trabajo).\n3. Interés legítimo (análisis internos anonimizados).\n4. Consentimiento (encuestas sensibles).",
    },
    {
      titulo: "Principio de minimización",
      contenido:
        "Solo recopilar datos estrictamente necesarios.\nNO: redes sociales sin consentimiento · monitoreo de comunicaciones sin política · datos de salud para ascensos.",
    },
    {
      titulo: "Multas LOPDP Ecuador",
      contenido:
        "Leve: hasta 1.000 SBU (~$500k)\nGrave: hasta 2.000 SBU (~$1M)\nMuy grave: hasta 5.000 SBU (~$2.5M)\nProporcionalidad para PyMEs, pero riesgo real.",
    },
    {
      titulo: "Código del Trabajo y IA",
      contenido:
        "Art. 172: causas de despido — IA no puede ser única justificación.\nArt. 46: discriminación prohibida — empresa responsable del sesgo del algoritmo.",
    },
    {
      titulo: "5 mejores prácticas IA responsable en RR.HH.",
      contenido:
        "1. Registro de Actividades de Tratamiento (RAT).\n2. Evaluación de Impacto de Privacidad (EIPD).\n3. Supervisión humana en toda decisión sobre personas.\n4. Procedimiento ARCO-P documentado.\n5. Capacitación anual en privacidad.",
    },
    {
      titulo: "Cumplimiento = sostenibilidad",
      contenido:
        "IA con governance ético = escalable sin riesgo legal.\nEn Ecuador: proteger datos de empleados es también diferenciador en atracción de talento.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuándo entró en vigencia la LOPDP en Ecuador?",
      opciones: [
        "Enero 2020",
        "Mayo 2023 (con Reglamento en octubre 2024)",
        "Julio 2021",
        "Diciembre 2022",
      ],
      respuesta: 1,
      explicacion:
        "La LOPDP entró en vigencia en mayo de 2023. Su Reglamento fue publicado en octubre de 2024, completando el marco normativo.",
    },
    {
      pregunta: "¿Cuál de estos datos de empleados se considera 'sensible' según el artículo 27 de la LOPDP?",
      opciones: [
        "Nombre completo y cédula",
        "Cargo y departamento",
        "Huella dactilar para control de asistencia (dato biométrico)",
        "Correo electrónico corporativo",
      ],
      respuesta: 2,
      explicacion:
        "Los datos biométricos como la huella dactilar son datos sensibles según el Art. 27 de la LOPDP y requieren consentimiento explícito o habilitación legal expresa.",
    },
    {
      pregunta: "¿Qué significa el principio de minimización de datos en el contexto de RR.HH. con IA?",
      opciones: [
        "Usar la menor cantidad de herramientas de IA posible",
        "Recopilar solo los datos estrictamente necesarios para el propósito declarado",
        "Minimizar el presupuesto de tecnología de RR.HH.",
        "Tener el menor número de empleados en el área de RR.HH.",
      ],
      respuesta: 1,
      explicacion:
        "Minimización significa que solo se recopilan los datos estrictamente necesarios para el propósito declarado, y ninguno adicional, aunque sea posible obtenerlos.",
    },
    {
      pregunta: "Según el Código del Trabajo (Art. 46), si un sistema de IA discrimina sistemáticamente a trabajadoras embarazadas, ¿quién es responsable?",
      opciones: [
        "El proveedor de la IA únicamente",
        "La empresa que implementó el sistema",
        "El empleado que operó el software",
        "Nadie, porque fue el algoritmo, no un humano",
      ],
      respuesta: 1,
      explicacion:
        "La empresa es responsable del sesgo del algoritmo que implementó. La prohibición de discriminación del Art. 46 aplica al resultado, independientemente de si el sesgo fue humano o algorítmico.",
    },
    {
      pregunta: "¿Qué significan las siglas ARCO-P en el contexto de derechos bajo la LOPDP?",
      opciones: [
        "Análisis, Recolección, Control, Operación y Protección",
        "Acceso, Rectificación, Cancelación, Oposición y Portabilidad",
        "Auditoría, Revisión, Cumplimiento, Organización y Privacidad",
        "Almacenamiento, Registro, Confidencialidad, Operación y Prevención",
      ],
      respuesta: 1,
      explicacion:
        "ARCO-P son los derechos que los titulares de datos pueden ejercer: Acceso (conocer sus datos), Rectificación (corregirlos), Cancelación (eliminarlos), Oposición (impedir su uso) y Portabilidad (transferirlos).",
    },
  ],
  ejercicio: {
    titulo: "Auditoría de cumplimiento LOPDP para un sistema de RR.HH. con IA",
    objetivo:
      "Realizar una auditoría de cumplimiento de la LOPDP sobre un sistema de People Analytics y producir el Registro de Actividades de Tratamiento (RAT) con plan de remediación.",
    herramientas:
      "Plantilla RAT (descargable de la Superintendencia de Protección de Datos), Claude para análisis legal, Google Sheets para el inventario",
    datosEjemplo:
      "Sistema: empresa de servicios financieros en Quito con 120 empleados. Usa: control de asistencia biométrico, ATS con IA para reclutamiento, plataforma de e-learning con seguimiento de progreso, encuesta anual de clima laboral.",
    pasos: [
      "Paso 1 — Inventario de sistemas: Lista todos los sistemas de RR.HH. que recopilan datos de empleados en la empresa. Para cada sistema: nombre, propósito, datos que recopila, quién tiene acceso, dónde se almacenan.",
      "Paso 2 — Clasificación de datos: Para cada sistema, clasifica los datos en: ordinarios (nombre, cargo) vs sensibles (biométricos, salud). Identifica cuáles datos sensibles tienen base legal documentada.",
      "Paso 3 — Análisis de bases legales: Para cada tipo de dato, determina la base legal aplicable (contrato, obligación legal, interés legítimo o consentimiento). Identifica dónde la base legal no está documentada — esos son los gaps de cumplimiento.",
      "Paso 4 — Evaluación de riesgos: Usa Claude para analizar el escenario: 'Como experto en LOPDP Ecuador, analiza este inventario de datos de RR.HH. e identifica los 5 mayores riesgos de cumplimiento con la ley.' Documenta los riesgos identificados.",
      "Paso 5 — Completar el RAT: Llena el Registro de Actividades de Tratamiento para los 3 sistemas más críticos siguiendo la plantilla oficial: responsable, finalidad, base legal, categorías de datos, destinatarios, plazos de conservación, medidas de seguridad.",
      "Paso 6 — Plan de remediación: Para cada gap identificado, propone una acción correctiva con responsable, plazo y criterio de verificación. Prioriza por severidad del riesgo.",
    ],
    resultado:
      "Inventario de sistemas completo + RAT de 3 sistemas con plantilla oficial + análisis de 5 riesgos de cumplimiento + plan de remediación con 8-10 acciones priorizadas.",
    criterios: [
      { criterio: "Inventario completo con clasificación correcta de datos ordinarios vs sensibles", puntos: 20 },
      { criterio: "Bases legales correctamente identificadas y gaps documentados", puntos: 25 },
      { criterio: "RAT completado para 3 sistemas siguiendo plantilla oficial", puntos: 25 },
      { criterio: "5 riesgos de cumplimiento identificados y fundamentados en la LOPDP", puntos: 15 },
      { criterio: "Plan de remediación con acciones específicas, responsables y plazos", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "LOPDP Ecuador — Texto oficial y Reglamento",
      url: "https://www.telecomunicaciones.gob.ec/ley-organica-de-proteccion-de-datos-personales/",
      tipo: "documentacion",
      descripcion: "Ley Orgánica de Protección de Datos Personales — texto completo y Reglamento 2024",
    },
    {
      titulo: "Código del Trabajo Ecuador",
      url: "https://www.trabajo.gob.ec/wp-content/uploads/downloads/2012/11/c%C3%B3digo-de-trabajo-actualizado.pdf",
      tipo: "documentacion",
      descripcion: "Código del Trabajo de Ecuador — versión actualizada del Ministerio de Trabajo",
    },
    {
      titulo: "Superintendencia de Protección de Datos — Ecuador",
      url: "https://www.superderechos.gob.ec/",
      tipo: "documentacion",
      descripcion: "Organismo de control de la LOPDP: resoluciones, guías y plantilla RAT oficial",
    },
    {
      titulo: "IAPP — Privacy in HR Practices",
      url: "https://iapp.org/resources/article/privacy-in-hr-practices/",
      tipo: "lectura",
      descripcion: "International Association of Privacy Professionals: mejores prácticas de privacidad en RR.HH.",
    },
  ],
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const C8_TEMAS: TemaC8[] = [
  tema1,  tema2,  tema3,  tema4,
  tema5,  tema6,  tema7,  tema8,
  tema9,  tema10, tema11, tema12,
  tema13, tema14, tema15, tema16,
];
