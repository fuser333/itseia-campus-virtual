// ─── C1: Introducción a IA Aplicada — Datos de 20 temas ──────────────────────
// Curso C1 del programa MDT. 5 temas completos + 15 placeholders.

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
}

export interface TemaC1 {
  id: number;
  titulo: string;
  modulo: string;
  moduloNum: number;
  videoEmbed: string;
  videoTitulo: string;
  teoria: string;
  quiz: QuizQuestion[];
  ejercicio: {
    objetivo: string;
    herramientas: string;
    pasos: string[];
    resultado: string;
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
  videoEmbed: "https://www.youtube.com/embed/2ePf9rue1Ao",
  videoTitulo: "IA para todos — curso completo en español",
  teoria: `La Inteligencia Artificial (IA) es la rama de la informática que busca crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana: comprender lenguaje, reconocer patrones, tomar decisiones y aprender de la experiencia.

La historia de la IA comienza en 1950 cuando Alan Turing publicó "Computing Machinery and Intelligence" y propuso el famoso Test de Turing. En 1956, John McCarthy acuñó el término "Inteligencia Artificial" en la conferencia de Dartmouth, considerada el nacimiento oficial del campo.

Durante las décadas de 1960-70 surgieron los primeros sistemas expertos y programas de ajedrez. Sin embargo, las limitaciones de hardware provocaron el primer "invierno de la IA" en los años 80. El campo resurgió en 1997 cuando Deep Blue de IBM venció al campeón mundial Garry Kasparov.

El verdadero punto de inflexión llegó con el deep learning. En 2012, AlexNet revolucionó la visión por computadora. En 2016, AlphaGo de DeepMind derrotó al campeón mundial de Go. La era moderna se aceleró con los transformers (2017), GPT-3 (2020), DALL-E (2021), ChatGPT (2022) y GPT-4 (2023).

Hoy la IA está integrada en nuestro día a día: asistentes de voz, recomendaciones de streaming, diagnóstico médico, conducción autónoma y generación de contenido. Ecuador no es ajeno a esta revolución: bancos, hospitales y empresas agrícolas ya implementan soluciones de IA para optimizar sus operaciones.

Comprender esta evolución es fundamental para entender hacia dónde va la tecnología y cómo aprovecharla profesionalmente.`,
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
      pregunta: "¿Cuál es la definición más precisa de Inteligencia Artificial?",
      opciones: [
        "Software que reemplaza completamente al ser humano",
        "Sistemas que realizan tareas que normalmente requieren inteligencia humana",
        "Robots con conciencia propia",
        "Programas que solo procesan datos numéricos",
      ],
      respuesta: 1,
      explicacion: "La IA busca crear sistemas capaces de realizar tareas que típicamente requieren inteligencia humana.",
    },
  ],
  ejercicio: {
    objetivo: "Crear una línea de tiempo interactiva con los hitos más importantes de la IA",
    herramientas: "Google Slides o Canva (gratis)",
    pasos: [
      "Abrir Google Slides y crear una presentación nueva con orientación horizontal",
      "Investigar y seleccionar 10 hitos clave de la IA (1950-2024)",
      "Diseñar una línea de tiempo visual con fecha, evento y una imagen representativa por hito",
      "Agregar una diapositiva final con tu predicción sobre el próximo gran hito de la IA",
      "Compartir el enlace de la presentación en el foro del curso",
    ],
    resultado: "Presentación de 12 diapositivas con línea de tiempo visual de la historia de la IA",
  },
  recursos: [
    { titulo: "Stanford AI Index Report 2024", url: "https://aiindex.stanford.edu/report/", tipo: "lectura" },
    { titulo: "Historia de la IA — Wikipedia", url: "https://es.wikipedia.org/wiki/Inteligencia_artificial", tipo: "documentacion" },
    { titulo: "Curso IA para Todos — Coursera", url: "https://www.coursera.org/learn/ai-for-everyone-es", tipo: "herramienta" },
  ],
};

const tema2: TemaC1 = {
  id: 2,
  titulo: "Tipos de IA: estrecha, general, superinteligente",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/ad79nYk2keg",
  videoTitulo: "Tipos de Inteligencia Artificial explicados",
  teoria: `La Inteligencia Artificial se clasifica en tres niveles según su capacidad y alcance. Comprender esta clasificación es esencial para separar la realidad de la ciencia ficción.

La IA Estrecha (ANI — Artificial Narrow Intelligence) es la única que existe hoy. Está diseñada para realizar una tarea específica de forma excepcional, pero no puede transferir ese conocimiento a otros dominios. Ejemplos: Siri responde preguntas pero no conduce autos; AlphaGo juega Go pero no puede jugar ajedrez sin reentrenamiento. ChatGPT, aunque parece versátil, sigue siendo ANI — es un modelo de lenguaje optimizado para texto.

La IA General (AGI — Artificial General Intelligence) tendría capacidad cognitiva equivalente a un humano: podría aprender cualquier tarea intelectual, razonar abstractamente y transferir conocimiento entre dominios. No existe aún. Empresas como OpenAI y DeepMind la consideran su objetivo principal. Estimaciones de expertos varían entre 2030 y 2060 para su llegada.

La Superinteligencia Artificial (ASI) superaría la inteligencia humana en todos los dominios: ciencia, creatividad, habilidades sociales. Es un concepto teórico estudiado por filósofos como Nick Bostrom. Plantea preguntas existenciales sobre control y alineación de valores.

En la práctica profesional, toda la IA que usas hoy es ANI. Cuando alguien dice "la IA va a reemplazar todos los trabajos", confunde ANI con AGI. Tu ventaja competitiva está en dominar las herramientas ANI actuales — ChatGPT, Claude, Midjourney, Copilot — y entender sus limitaciones reales. Saber qué puede y qué no puede hacer la IA actual te convierte en un profesional más efectivo.`,
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
      pregunta: "¿Cuál de estos es un ejemplo correcto de IA Estrecha?",
      opciones: [
        "Un robot que cocina, conduce y diagnostica enfermedades",
        "Un sistema de recomendación de Netflix",
        "Una máquina consciente de sí misma",
        "Un programa que resuelve cualquier problema matemático",
      ],
      respuesta: 1,
      explicacion: "El sistema de recomendación de Netflix es ANI: excelente en sugerir contenido, pero no hace nada más.",
    },
  ],
  ejercicio: {
    objetivo: "Clasificar 10 herramientas de IA populares por tipo (ANI/AGI/ASI)",
    herramientas: "Google Docs o Notion (gratis)",
    pasos: [
      "Crear una tabla con columnas: Herramienta, Tipo de IA, Tarea específica, Justificación",
      "Clasificar: ChatGPT, Siri, Tesla Autopilot, DeepL, Midjourney, GitHub Copilot, AlphaFold, Grammarly, DALL-E, Google Maps",
      "Investigar si alguna de estas herramientas se acerca a AGI y argumentar por qué sí o no",
      "Escribir un párrafo final explicando por qué todas son ANI actualmente",
      "Compartir el documento en el foro del curso",
    ],
    resultado: "Tabla comparativa con 10 herramientas clasificadas y análisis argumentado",
  },
  recursos: [
    { titulo: "DeepMind — Investigación en AGI", url: "https://deepmind.google/", tipo: "documentacion" },
    { titulo: "OpenAI — Misión y enfoque AGI", url: "https://openai.com/about", tipo: "lectura" },
    { titulo: "ArXiv — Papers de IA", url: "https://arxiv.org/list/cs.AI/recent", tipo: "documentacion" },
  ],
};

const tema3: TemaC1 = {
  id: 3,
  titulo: "Machine Learning, Deep Learning e IA simbólica",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/KytW151dpqU",
  videoTitulo: "Machine Learning vs Deep Learning — diferencias clave",
  teoria: `La IA moderna se construye sobre tres paradigmas principales. Cada uno resuelve problemas de forma diferente y tiene aplicaciones específicas.

El Machine Learning (ML) es el enfoque donde las máquinas aprenden de datos sin ser programadas explícitamente. En lugar de escribir reglas, le das ejemplos y el algoritmo descubre los patrones. Se divide en tres tipos: aprendizaje supervisado (datos etiquetados, como clasificar emails en spam/no spam), no supervisado (encontrar patrones ocultos, como segmentar clientes) y por refuerzo (aprender por prueba y error, como entrenar un robot).

El Deep Learning (DL) es un subconjunto del ML que usa redes neuronales con múltiples capas (de ahí "profundo"). Cada capa extrae características más abstractas. Es la tecnología detrás de reconocimiento facial, traducción automática, generación de imágenes y los modelos de lenguaje como GPT. Requiere grandes cantidades de datos y poder computacional (GPUs).

La IA Simbólica (Good Old-Fashioned AI) usa reglas lógicas explícitas creadas por humanos. Funciona con sentencias tipo "SI temperatura > 38 ENTONCES posible fiebre". Los sistemas expertos de los años 80 usaban este enfoque. Hoy se usa en diagnóstico médico reglado, sistemas legales y validación de datos.

La tendencia actual combina enfoques: sistemas neuro-simbólicos que usan deep learning para percepción y reglas simbólicas para razonamiento. En tu carrera profesional, el ML supervisado y el deep learning serán los más relevantes, pero entender la IA simbólica te da perspectiva sobre cuándo las reglas claras superan a los datos.`,
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
      pregunta: "¿Qué recurso necesita principalmente el Deep Learning que el ML tradicional no tanto?",
      opciones: [
        "Conexión a internet",
        "Grandes cantidades de datos y GPUs",
        "Programadores expertos",
        "Bases de datos SQL",
      ],
      respuesta: 1,
      explicacion: "El Deep Learning requiere datasets masivos y GPUs potentes para entrenar redes neuronales profundas.",
    },
  ],
  ejercicio: {
    objetivo: "Identificar qué tipo de ML usa cada aplicación cotidiana",
    herramientas: "Google Sheets o Excel",
    pasos: [
      "Crear una hoja con columnas: Aplicación, Tipo (ML/DL/Simbólica), Subtipo, Justificación",
      "Clasificar: filtro de spam de Gmail, reconocimiento facial del celular, GPS de Waze, detector de fraude bancario, Shazam, chatbot de servicio al cliente, autocorrector del teclado, recomendaciones de YouTube",
      "Para cada aplicación, explicar qué tipo de datos usa para aprender",
      "Identificar cuáles combinan más de un enfoque (sistemas híbridos)",
      "Presentar hallazgos en un párrafo resumen",
    ],
    resultado: "Tabla con 8 aplicaciones clasificadas por tipo de ML y análisis de datos utilizados",
  },
  recursos: [
    { titulo: "Google ML Crash Course", url: "https://developers.google.com/machine-learning/crash-course", tipo: "herramienta" },
    { titulo: "Kaggle — Datasets y competencias", url: "https://www.kaggle.com/", tipo: "herramienta" },
    { titulo: "3Blue1Brown — Redes neuronales visual", url: "https://www.3blue1brown.com/topics/neural-networks", tipo: "lectura" },
  ],
};

const tema4: TemaC1 = {
  id: 4,
  titulo: "Aplicaciones reales de IA en Ecuador y LATAM",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/aircAruvnKk",
  videoTitulo: "Inteligencia Artificial en Latinoamérica",
  teoria: `La IA ya no es exclusiva de Silicon Valley. Ecuador y Latinoamérica están adoptando soluciones de IA en sectores clave, creando oportunidades profesionales concretas.

En el sector financiero, Banco Pichincha y Banco del Pacífico usan modelos de ML para detección de fraude en tiempo real y scoring crediticio alternativo. Produbanco implementó chatbots con procesamiento de lenguaje natural para atención al cliente 24/7. Estas implementaciones redujeron fraudes en un 40% según reportes del sector.

En salud, hospitales en Quito y Guayaquil están piloteando IA para imagenología médica — análisis de rayos X y tomografías con algoritmos de deep learning que detectan anomalías con precisión comparable a radiólogos experimentados. ImagemIA, empresa ecuatoriana, desarrolla soluciones de IA predictiva que reducen inasistencias médicas en un 30%.

La agricultura, pilar de la economía ecuatoriana, se beneficia de drones con visión por computadora para monitorear cultivos de banano, cacao y flores. Sensores IoT combinados con ML predicen plagas y optimizan riego, incrementando rendimientos hasta un 25%.

En LATAM más amplio: Mercado Libre usa IA para logística predictiva, Nubank para evaluación crediticia, Rappi para optimización de rutas y LATAM Airlines para pricing dinámico.

El gobierno ecuatoriano trabaja en una Estrategia Nacional de IA que incluye formación de talento, regulación ética y adopción en servicios públicos. La LOPDP (Ley Orgánica de Protección de Datos Personales) ya regula el uso de datos en sistemas automatizados.

Para ti como profesional, esto significa que la demanda de especialistas en IA en Ecuador está creciendo más rápido que la oferta. Dominar estas herramientas te posiciona en un mercado con empleabilidad del 85-92%.`,
  quiz: [
    {
      pregunta: "¿Qué sector ecuatoriano usa IA para detección de fraude en tiempo real?",
      opciones: ["Agricultura", "Sector financiero/banca", "Turismo", "Minería"],
      respuesta: 1,
      explicacion: "Bancos como Pichincha y Pacífico implementan ML para detectar transacciones fraudulentas.",
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
      pregunta: "¿Qué empresa latinoamericana usa IA para evaluación crediticia alternativa?",
      opciones: ["Rappi", "Globant", "Nubank", "MercadoLibre"],
      respuesta: 2,
      explicacion: "Nubank (Brasil) usa modelos de ML para scoring crediticio alternativo, sirviendo a poblaciones sin historial bancario.",
    },
    {
      pregunta: "¿Cuál es el rango de empleabilidad reportado para especialistas en IA en Ecuador?",
      opciones: ["50-60%", "65-75%", "85-92%", "95-100%"],
      respuesta: 2,
      explicacion: "La empleabilidad para especialistas en IA en Ecuador está entre el 85% y 92% según datos del sector.",
    },
  ],
  ejercicio: {
    objetivo: "Mapear 5 empresas ecuatorianas que usan IA en sus operaciones",
    herramientas: "Google Docs + navegador web para investigación",
    pasos: [
      "Investigar en Google, LinkedIn y prensa ecuatoriana empresas locales que usen IA",
      "Seleccionar 5 empresas de diferentes sectores (banca, salud, agricultura, retail, gobierno)",
      "Para cada empresa documentar: nombre, sector, tipo de IA que usa, problema que resuelve, resultado reportado",
      "Agregar una sección de 'oportunidades detectadas' — áreas donde aún no se aplica IA en Ecuador",
      "Incluir fuentes (links a artículos o reportes donde encontraste la información)",
    ],
    resultado: "Documento con mapa de 5 empresas ecuatorianas usando IA + análisis de oportunidades",
  },
  recursos: [
    { titulo: "BID — IA en América Latina", url: "https://www.iadb.org/es/ia", tipo: "lectura" },
    { titulo: "LOPDP Ecuador — Texto completo", url: "https://www.registroficial.gob.ec/", tipo: "documentacion" },
    { titulo: "AI Readiness Index — LATAM", url: "https://oxfordinsights.com/ai-readiness/ai-readiness-index/", tipo: "lectura" },
  ],
};

const tema5: TemaC1 = {
  id: 5,
  titulo: "Ética, privacidad, sesgos y marco regulatorio",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/UG_X_7g63rY",
  videoTitulo: "Ética en Inteligencia Artificial",
  teoria: `La IA es una herramienta poderosa, pero su uso irresponsable puede causar daño real. Comprender los desafíos éticos no es opcional — es una competencia profesional esencial.

Los sesgos algorítmicos ocurren cuando los datos de entrenamiento reflejan prejuicios históricos. Amazon descubrió que su sistema de reclutamiento con IA penalizaba currículos de mujeres porque fue entrenado con datos de contrataciones pasadas, dominadas por hombres. En Estados Unidos, el sistema COMPAS predecía mayor reincidencia criminal para personas afroamericanas, perpetuando discriminación sistémica.

La privacidad de datos es crítica. En Ecuador, la LOPDP (vigente desde 2023) establece que toda persona tiene derecho a conocer qué datos suyos se procesan, con qué finalidad y cómo se protegen. Las empresas que usen IA con datos personales deben cumplir principios de: consentimiento informado, minimización de datos, finalidad específica y seguridad adecuada.

La transparencia algorítmica (o "explicabilidad") exige que las decisiones automatizadas sean comprensibles. Si un banco niega un crédito usando IA, el cliente tiene derecho a saber por qué. La Unión Europea lidera con su AI Act (2024) que clasifica sistemas de IA por nivel de riesgo.

El deepfake representa otro riesgo ético: la IA puede generar videos falsos extremadamente realistas. En LATAM ya se han documentado casos de deepfakes políticos durante elecciones.

Como profesional de IA, tu responsabilidad es triple: (1) auditar datos de entrenamiento para detectar sesgos, (2) cumplir con la LOPDP y regulaciones aplicables, y (3) diseñar sistemas que prioricen la transparencia. La ética no frena la innovación — la hace sostenible.`,
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
      pregunta: "¿Qué regulación europea clasifica los sistemas de IA por nivel de riesgo?",
      opciones: ["GDPR", "AI Act", "Digital Services Act", "ePrivacy"],
      respuesta: 1,
      explicacion: "El AI Act de la UE (2024) establece categorías de riesgo: inaceptable, alto, limitado y mínimo.",
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
    objetivo: "Analizar un caso real de sesgo algorítmico y proponer soluciones",
    herramientas: "Google Docs + navegador web",
    pasos: [
      "Elegir un caso documentado de sesgo en IA (Amazon, COMPAS, reconocimiento facial, o buscar uno nuevo)",
      "Investigar: qué datos se usaron, qué sesgo se detectó, qué consecuencias tuvo",
      "Aplicar el marco LOPDP: ¿qué artículos de la ley ecuatoriana se vulnerarían si esto ocurriera en Ecuador?",
      "Proponer 3 medidas concretas para prevenir el sesgo detectado",
      "Redactar una opinión de 200 palabras sobre si la IA necesita más regulación en Ecuador",
    ],
    resultado: "Análisis de caso con referencia a la LOPDP y 3 propuestas de mitigación de sesgos",
  },
  recursos: [
    { titulo: "AI Ethics Guidelines — UNESCO", url: "https://www.unesco.org/en/artificial-intelligence/recommendation-ethics", tipo: "documentacion" },
    { titulo: "AI Act — Unión Europea", url: "https://artificialintelligenceact.eu/", tipo: "lectura" },
    { titulo: "Algorithmic Justice League", url: "https://www.ajl.org/", tipo: "herramienta" },
  ],
};

// ─── MÓDULO 2: IA Generativa y Prompt Engineering ────────────────────────────

const MOD2 = "IA Generativa y Prompt Engineering";

// ─── MÓDULO 3: Herramientas No-Code y Aplicaciones ──────────────────────────

const MOD3 = "Herramientas No-Code y Aplicaciones";

// ─── MÓDULO 4: Proyecto Final Aplicado ───────────────────────────────────────

const MOD4 = "Proyecto Final Aplicado";

// ─── Export: 20 temas (5 completos + 15 placeholders) ────────────────────────

export const C1_TEMAS: TemaC1[] = [
  // Módulo 1 — completos
  tema1,
  tema2,
  tema3,
  tema4,
  tema5,
  // Módulo 2 — placeholders
  placeholder(6, "¿Qué es la IA Generativa? De GANs a GPT", MOD2, 2),
  placeholder(7, "Prompt Engineering: principios y técnicas", MOD2, 2),
  placeholder(8, "Prompts avanzados: cadena de pensamiento y few-shot", MOD2, 2),
  placeholder(9, "ChatGPT y Claude: comparativa práctica", MOD2, 2),
  placeholder(10, "Generación de imágenes: DALL-E, Midjourney, Stable Diffusion", MOD2, 2),
  placeholder(11, "Generación de código con IA: Copilot y Cursor", MOD2, 2),
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
