// ─── Curso Estándar $197 — Steveen Pinchao (Ingeniero Industrial) ───────────
// IA Aplicada para Ingeniería Industrial. 60h, 8 módulos × 5 temas × 1.5h.
// Cliente piloto: Ing. Steveen Alexander Pinchao Pérez.
// 5 temas reales del M1 con teoría 700+ palabras, quiz, ejercicio y recursos.
// 35 temas (M2-M8) quedan como placeholder hasta producción Gamma + videos.

export interface QuizQuestionSteveen {
  pregunta: string;
  opciones: string[];
  respuesta: number; // index 0-3
  explicacion: string;
}

export interface RecursoSteveen {
  titulo: string;
  url: string;
  tipo: "documentacion" | "herramienta" | "lectura";
  descripcion?: string;
}

export interface PresentacionSlideSteveen {
  titulo: string;
  contenido: string;
}

/** URL de presentación generada en Gamma (https://gamma.app/docs/...) */
export type GammaUrlSteveen = string;

export interface EjercicioCriterioSteveen {
  criterio: string;
  puntos: number;
}

export interface TemaProSteveen {
  id: number;
  titulo: string;
  modulo: string;
  moduloNum: number;
  videoEmbed: string;
  videoTitulo: string;
  videoDuracion?: string;
  /** URL de la presentación generada en Gamma (preferido sobre presentacionSlides) */
  slidesUrl?: GammaUrlSteveen;
  teoria: string;
  /** Fallback inline cuando no hay Gamma URL */
  presentacionSlides: PresentacionSlideSteveen[];
  quiz: QuizQuestionSteveen[];
  ejercicio: {
    titulo?: string;
    objetivo: string;
    herramientas: string;
    datosEjemplo?: string;
    pasos: string[];
    resultado: string;
    criterios?: EjercicioCriterioSteveen[];
  };
  recursos: RecursoSteveen[];
}

// ─── Definición de los 8 módulos ────────────────────────────────────────────

export const STEVEEN_MODULOS = [
  { num: 1, nombre: "Fundamentos de IA para Ingeniería Industrial", horas: 7.5, temas: 5 },
  { num: 2, nombre: "ChatGPT — Dominio profesional", horas: 7.5, temas: 5 },
  { num: 3, nombre: "Claude — Análisis avanzado", horas: 7.5, temas: 5 },
  { num: 4, nombre: "Optimización de producción con IA", horas: 7.5, temas: 5 },
  { num: 5, nombre: "Mantenimiento predictivo con IA", horas: 7.5, temas: 5 },
  { num: 6, nombre: "Control de calidad con IA", horas: 7.5, temas: 5 },
  { num: 7, nombre: "Cadena de suministro inteligente", horas: 7.5, temas: 5 },
  { num: 8, nombre: "Integración y proyecto final aplicado", horas: 7.5, temas: 5 },
];

// ─── Helper para temas placeholder ──────────────────────────────────────────

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaProSteveen => ({
  id,
  titulo,
  modulo,
  moduloNum,
  videoEmbed: "",
  videoTitulo: titulo,
  slidesUrl: "",
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

// ─── MÓDULO 1: Fundamentos de IA para Ingeniería Industrial ─────────────────

const MOD1 = "Fundamentos de IA para Ingeniería Industrial";

const tema1: TemaProSteveen = {
  id: 1,
  titulo: "Qué es IA, ML y Deep Learning — explicado para ingenieros",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "",
  videoTitulo: "Qué es IA, ML y Deep Learning para ingenieros industriales",
  videoDuracion: "~60 min · Español · Por confirmar",
  slidesUrl: "",
  teoria: `La Inteligencia Artificial (IA) es la capacidad de un sistema informático para realizar tareas que normalmente requieren inteligencia humana: reconocer patrones, tomar decisiones, entender lenguaje y aprender de la experiencia. Para un ingeniero industrial, esta definición no es teórica — es la diferencia entre un sistema que ejecuta reglas fijas y uno que mejora con cada turno de producción.

Imagina un inspector de calidad con 20 años en la línea de producción. Ese inspector "sabe" cuándo una pieza tiene un defecto solo con verla, sin necesidad de medir nada. La IA hace algo similar: aprende de miles de ejemplos hasta que puede identificar patrones por sí sola. La diferencia clave con la automatización tradicional está en el aprendizaje. Una macro de Excel ejecuta los mismos pasos siempre. Un sistema de IA cambia su comportamiento según los datos que recibe.

El Machine Learning (Aprendizaje Automático) es un subconjunto de la IA donde el sistema aprende de datos sin ser programado explícitamente para cada escenario. En lugar de programar regla por regla — "si la pieza mide más de 10.5 cm, rechazar" —, le das al sistema 10.000 mediciones de piezas buenas y malas, y él descubre solo cuáles son los rangos aceptables y qué combinaciones de variables predicen un defecto. Esto es revolucionario para ingeniería industrial porque captura el conocimiento tácito que un operador experimentado tiene en la cabeza pero no puede explicar fácilmente.

Existen tres tipos fundamentales de Machine Learning. El aprendizaje supervisado entrena con ejemplos etiquetados: 10.000 fotos de piezas marcadas como "buena" o "defectuosa", y el modelo aprende a clasificar piezas nuevas. Es el más usado en la industria — aproximadamente el 80% de las aplicaciones comerciales. El aprendizaje no supervisado descubre patrones ocultos sin etiquetas: agrupa proveedores por comportamiento de entrega, segmenta clientes por hábitos de compra, encuentra correlaciones que nadie había visto. El aprendizaje por refuerzo aprende por prueba y error con recompensas: optimiza rutas de distribución probando combinaciones, ajusta parámetros de máquina hasta encontrar el punto óptimo.

El Deep Learning (Aprendizaje Profundo) es un subconjunto de ML que usa redes neuronales con muchas capas para procesar datos muy complejos como imágenes, audio o texto. Si el ML es como un inspector que revisa mediciones numéricas en un Excel, el Deep Learning es como un inspector que puede analizar fotografías de alta resolución, leer reportes técnicos enteros y escuchar los sonidos de una máquina para detectar fallas — todo simultáneamente. Es lo que permite que Tesla detecte defectos imperceptibles al ojo humano y que ChatGPT entienda preguntas complejas sobre tu proceso productivo.

La pirámide es clara: la IA es el campo más amplio, el Machine Learning es un subconjunto, y el Deep Learning es un subconjunto del ML. No son tres tecnologías independientes — son capas de una misma disciplina con distintos niveles de sofisticación, costo y requerimiento de datos.

Lo que la IA NO es. No es un robot con consciencia — eso es ciencia ficción. No reemplaza al ingeniero industrial — lo potencia con superpoderes de análisis y velocidad. No funciona sin datos — sin información histórica digital, no hay IA posible. No toma decisiones éticas por sí sola — siempre necesita un criterio humano detrás. Esta última distinción es crítica: en sectores ecuatorianos regulados como banca, salud y alimentos, la IA propone pero el profesional decide.

En 2026, todo ingeniero industrial necesita dominar estos tres conceptos no para programar modelos, sino para conversar inteligentemente con proveedores de soluciones, evaluar propuestas tecnológicas y liderar proyectos de transformación digital en su planta. La empleabilidad de ingenieros industriales con habilidades en IA en Ecuador supera el 85% según datos del sector.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Qué es IA, ML y Deep Learning para ingenieros\nMódulo 1 — Tema 1\nIA Aplicada para Ingeniería Industrial — itseia.ai",
    },
    {
      titulo: "Qué aprenderás hoy",
      contenido: "Al finalizar esta sesión podrás:\n• Distinguir IA, Machine Learning y Deep Learning con analogías industriales\n• Identificar los tres tipos de Machine Learning\n• Reconocer cuándo cada enfoque aplica a tu planta\n• Diferenciar IA real de promesas exageradas",
    },
    {
      titulo: "La analogía del inspector de 20 años",
      contenido: "Un inspector con 20 años en la línea sabe cuándo una pieza está mal solo con verla.\n\nLa IA aprende ese conocimiento tácito a partir de miles de ejemplos.\n\nLa automatización tradicional ejecuta reglas. La IA descubre reglas a partir de datos.",
    },
    {
      titulo: "Machine Learning — Tres tipos",
      contenido: "• Supervisado: aprende de ejemplos etiquetados (bueno/defectuoso). 80% de la industria.\n• No supervisado: descubre patrones ocultos sin etiquetas. Segmenta proveedores y clientes.\n• Por refuerzo: aprende por prueba y error con recompensas. Optimiza rutas y parámetros.",
    },
    {
      titulo: "Deep Learning — Cuándo usarlo",
      contenido: "Redes neuronales con muchas capas para datos complejos:\n• Imágenes: detectar defectos en visión por computadora\n• Audio: escuchar fallas en máquinas por su sonido\n• Texto: analizar reportes técnicos largos\n\nRequiere más datos, más cómputo y más costo.",
    },
    {
      titulo: "La pirámide IA → ML → DL",
      contenido: "IA (campo amplio)\n  └─ Machine Learning (aprende de datos)\n       └─ Deep Learning (redes neuronales profundas)\n\nNo son tres tecnologías independientes. Son capas de una misma disciplina.",
    },
    {
      titulo: "Lo que la IA NO es",
      contenido: "• No es robot con consciencia (eso es ciencia ficción)\n• No reemplaza al ingeniero, lo potencia\n• No funciona sin datos digitales históricos\n• No toma decisiones éticas por sí sola\n\nEn Ecuador (banca, salud, alimentos): la IA propone, el profesional decide.",
    },
    {
      titulo: "Resumen del Tema 1.1",
      contenido: "1. IA, ML y DL son capas, no tecnologías independientes\n2. ML aprende de datos: supervisado, no supervisado, por refuerzo\n3. DL es ML con redes profundas para datos complejos\n4. La IA potencia al ingeniero, no lo reemplaza\n5. Empleabilidad +85% para ingenieros industriales con IA en Ecuador",
    },
    {
      titulo: "Próximo Tema",
      contenido: "Tema 1.2 — Tipos de IA y casos de uso en manufactura\nVeremos 10 casos reales de empresas como Siemens, Tesla, BMW y P&G.\n\nitseia.ai — La primera academia de IA del Ecuador",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la relación correcta entre IA, Machine Learning y Deep Learning?",
      opciones: [
        "Son tres tecnologías completamente diferentes e independientes",
        "IA es el campo más amplio, ML es un subconjunto, y DL es un subconjunto de ML",
        "Deep Learning contiene a Machine Learning, que contiene a IA",
        "Machine Learning y Deep Learning son lo mismo",
      ],
      respuesta: 1,
      explicacion: "La IA es el campo más amplio; el ML es un subconjunto que aprende de datos; el DL es un subconjunto del ML que usa redes neuronales profundas.",
    },
    {
      pregunta: "Un sistema que predice la demanda de productos usando datos históricos de ventas es un ejemplo de:",
      opciones: [
        "Automatización tradicional",
        "Machine Learning",
        "Robótica industrial",
        "Internet de las Cosas (IoT)",
      ],
      respuesta: 1,
      explicacion: "Aprender patrones a partir de datos históricos para predecir nuevos casos es la definición clásica de Machine Learning supervisado.",
    },
    {
      pregunta: "¿Qué necesita una empresa industrial para empezar a usar IA de forma básica?",
      opciones: [
        "Un equipo de 10 programadores y servidores propios",
        "Datos históricos digitales, un problema claro y herramientas accesibles",
        "Reemplazar todo el personal por robots",
        "Esperar a que la tecnología esté más madura",
      ],
      respuesta: 1,
      explicacion: "Sin datos históricos digitales no hay IA posible. Con datos, un problema claro y herramientas como ChatGPT o Power BI, ya se puede empezar hoy.",
    },
    {
      pregunta: "¿Qué tipo de Machine Learning usa datos etiquetados como 'bueno' o 'defectuoso'?",
      opciones: [
        "No supervisado",
        "Por refuerzo",
        "Supervisado",
        "Híbrido",
      ],
      respuesta: 2,
      explicacion: "El aprendizaje supervisado entrena con datos donde la respuesta correcta ya está etiquetada por humanos.",
    },
    {
      pregunta: "Detectar grietas microscópicas en soldaduras analizando fotos de alta resolución es típicamente una tarea de:",
      opciones: [
        "Automatización tradicional con sensores",
        "Machine Learning con datos en Excel",
        "Deep Learning con visión por computadora",
        "IA simbólica con reglas SI-ENTONCES",
      ],
      respuesta: 2,
      explicacion: "El análisis de imágenes complejas con redes neuronales profundas es el caso de uso clásico del Deep Learning.",
    },
  ],
  ejercicio: {
    titulo: "Clasificación de procesos industriales por tipo de IA",
    objetivo: "Clasificar 10 procesos industriales reales según el tipo de IA aplicable y justificar cada decisión con criterio profesional",
    herramientas: "Google Sheets + ChatGPT Plus (para validar tu razonamiento) + Google Docs",
    datosEjemplo: "10 procesos a clasificar:\n1. Predecir cuántas unidades se venderán el próximo mes con 3 años de historia\n2. Detectar grietas microscópicas en soldaduras con cámaras de alta resolución\n3. Calcular el costo total de materia prima del mes\n4. Agrupar proveedores en categorías según comportamiento de entrega\n5. Predecir cuándo una máquina CNC va a fallar con datos de vibración\n6. Generar el reporte mensual de producción a partir de Excel\n7. Decidir el número de operadores por turno la próxima semana\n8. Detectar fraude en facturas de proveedores\n9. Optimizar la programación de 15 órdenes en 5 máquinas\n10. Responder dudas de operadores sobre el procedimiento ISO 9001",
    pasos: [
      "Crear una hoja en Google Sheets con columnas: Proceso, Tipo de IA, Por qué, Herramienta sugerida, ¿Tienes los datos hoy?",
      "Para cada proceso, clasificarlo como: ML Supervisado, ML No Supervisado, Deep Learning, IA Generativa o No requiere IA",
      "Justificar cada clasificación en 2-3 líneas explicando qué patrón debe aprenderse",
      "Identificar la herramienta accesible (ChatGPT, Claude, Power BI IA, Copilot Excel, etc.)",
      "Marcar SÍ/NO si tu empresa actual ya tiene los datos digitales necesarios",
      "Validar tu clasificación con ChatGPT usando el prompt sugerido en el módulo",
      "Escribir 200 palabras: ¿cuáles 3 procesos de tu empresa son los mejores candidatos para empezar con IA en los próximos 30 días?",
      "Compartir el resultado con tu equipo y discutir prioridades",
    ],
    resultado: "Tabla de 10 procesos clasificados con justificación, herramienta sugerida y disponibilidad de datos, más una reflexión de 200 palabras con los 3 mejores candidatos para tu empresa",
    criterios: [
      { criterio: "Clasificación correcta de los 10 procesos", puntos: 30 },
      { criterio: "Justificaciones claras y técnicamente sólidas", puntos: 25 },
      { criterio: "Herramientas sugeridas son accesibles y realistas", puntos: 15 },
      { criterio: "Evaluación honesta de disponibilidad de datos", puntos: 15 },
      { criterio: "Reflexión final con 3 candidatos priorizados", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "¿Qué es la Inteligencia Artificial? — DotCSV", url: "https://www.youtube.com/watch?v=VnPbMVFJ6JA", tipo: "lectura", descripcion: "Explicación visual en español de qué es la IA, sin tecnicismos." },
    { titulo: "AI in Manufacturing — McKinsey", url: "https://www.mckinsey.com/capabilities/operations/our-insights/ai-in-production-a-game-changer-for-manufacturers", tipo: "documentacion", descripcion: "Reporte de McKinsey sobre el impacto real de la IA en plantas manufactureras." },
    { titulo: "Diferencia entre IA, ML y DL — Google Cloud", url: "https://cloud.google.com/learn/artificial-intelligence-vs-machine-learning", tipo: "documentacion", descripcion: "Comparación oficial de Google sobre los tres niveles, con ejemplos prácticos." },
    { titulo: "ChatGPT Plus", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "Herramienta principal de ML/IA generativa que usaremos durante el curso. $20/mes." },
    { titulo: "Teachable Machine — Google", url: "https://teachablemachine.withgoogle.com", tipo: "herramienta", descripcion: "Entrena un modelo de ML sin programar. Ideal para experimentar con clasificación de imágenes." },
    { titulo: "Industry 4.0 in Ecuador — CFN", url: "https://www.cfn.fin.ec/", tipo: "lectura", descripcion: "Estado de la transformación digital en industria ecuatoriana." },
  ],
};

const tema2: TemaProSteveen = {
  id: 2,
  titulo: "Tipos de IA y casos de uso en manufactura",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "",
  videoTitulo: "10 casos reales de IA en manufactura — Siemens, Tesla, BMW",
  videoDuracion: "~50 min · Español · Por confirmar",
  slidesUrl: "",
  teoria: `Para el ingeniero industrial, conocer los tipos de IA no es trivia académica — es la base para evaluar propuestas tecnológicas, elegir herramientas y liderar proyectos de transformación digital. Existen dos formas complementarias de clasificar la IA: por nivel de capacidad (cuán inteligente es) y por función (qué hace en la práctica).

Por nivel de capacidad, la clasificación más usada distingue tres categorías. La IA Estrecha o Narrow AI es la única que existe comercialmente en 2026: hace UNA tarea muy bien — detectar defectos, predecir demanda, generar reportes — pero no puede transferir ese conocimiento a otros dominios. Un modelo entrenado para clasificar fotos de soldaduras no puede de pronto programar producción. La IA General o AGI haría cualquier tarea intelectual como un humano, transfiriendo conocimiento entre dominios; aún no existe y los grandes laboratorios la persiguen. La Superinteligencia superaría al humano en todo dominio; es ciencia ficción aún. Toda la IA que evaluarás en tu carrera profesional como ingeniero industrial en los próximos años será IA Estrecha — y eso es suficiente para transformar plantas enteras.

Por función — la clasificación que más te servirá en el día a día — existen cinco categorías clave. La IA Generativa crea contenido nuevo: texto, imágenes, código, reportes. ChatGPT y Claude son sus exponentes. En manufactura genera reportes de producción, procedimientos ISO, análisis de causa raíz y emails técnicos en segundos. La IA Predictiva anticipa eventos futuros con datos históricos. Power BI IA y Minitab IA son ejemplos. Predice cuándo va a fallar una máquina, qué piezas tendrán defectos, cuál será la demanda del próximo trimestre. La IA Conversacional responde preguntas y explica procesos: ChatGPT como asistente que aclara dudas sobre procedimientos. La IA Visual analiza imágenes y video: detecta defectos en línea de producción, lee etiquetas, cuenta unidades. La IA de Optimización encuentra la mejor combinación de variables: programa producción óptima, optimiza rutas de distribución, asigna recursos.

10 casos reales de IA en manufactura (2024-2026) que te dan dimensión del impacto:

Siemens (Alemania): Mantenimiento predictivo en turbinas de gas usando sensores y ML. Resultado: 20% menos paradas no planificadas. Tesla (EE.UU.): Visión por computadora con Deep Learning en cada estación de ensamblaje detectando defectos en tiempo real. Foxconn (China): IA para planificación de producción, redujo el tiempo de programación de 4 horas a 10 minutos. BMW (Alemania): Cámaras con Deep Learning detectan defectos imperceptibles al ojo humano en pintura y carrocería. Procter & Gamble: IA predice defectos de calidad antes de que ocurran, redujo desperdicios en 30%. Amazon: Robots con IA en almacenes redujeron tiempos de picking en 50%. DHL: Predicción de volúmenes de envío y optimización de rutas, ahorró 15% en combustible. Walmart: Predicción de demanda con IA, redujo rupturas de stock en 30%. Caterpillar: IA analiza datos de sensores en equipos pesados para prevenir accidentes. Unilever: IA programa turnos de producción optimizando costos laborales.

¿Y en Ecuador? El sector cementero (Holcim, UNACEM) está adoptando mantenimiento predictivo. Cervecería Nacional usa analítica avanzada para optimizar producción. Pronaca explora visión por computadora en líneas de procesamiento. Empresas exportadoras de banano usan drones con IA para monitoreo de plantaciones. Esto te da contexto real: las herramientas que estudiarás no son experimentos — están generando ahorros millonarios en empresas grandes y son accesibles para empresas medianas con un presupuesto razonable.

La pregunta correcta no es "¿la IA va a llegar a mi industria?" sino "¿cuándo voy a empezar a usarla, antes o después que mi competencia?". En manufactura ecuatoriana, el ingeniero industrial que domine estas herramientas en 2026 tiene ventaja competitiva real frente a quienes esperen a que sea "lo normal".`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Tipos de IA y casos reales en manufactura\nMódulo 1 — Tema 2\nIA Aplicada para Ingeniería Industrial — itseia.ai",
    },
    {
      titulo: "Qué aprenderás hoy",
      contenido: "Al finalizar esta sesión podrás:\n• Clasificar la IA por capacidad (ANI, AGI, ASI)\n• Distinguir 5 tipos de IA por función\n• Reconocer 10 casos reales de IA en manufactura global\n• Identificar empresas ecuatorianas que ya usan IA",
    },
    {
      titulo: "Tipos de IA por capacidad",
      contenido: "ANI (IA Estrecha): UNA tarea muy bien. Es lo que existe HOY.\nAGI (IA General): cualquier tarea como un humano. NO existe aún.\nASI (Superinteligencia): supera al humano. Ciencia ficción.\n\nTu carrera trabajará con ANI, y eso basta para transformar plantas.",
    },
    {
      titulo: "5 tipos de IA por función",
      contenido: "• Generativa: crea texto, imágenes, código (ChatGPT, Claude)\n• Predictiva: anticipa fallas, demanda (Power BI IA, Minitab)\n• Conversacional: responde preguntas (ChatGPT como asistente)\n• Visual: analiza imágenes (detección de defectos)\n• Optimización: mejor combinación de variables (programación de producción)",
    },
    {
      titulo: "10 casos reales — Parte 1",
      contenido: "1. Siemens: mantenimiento predictivo, -20% paradas\n2. Tesla: visión en cada estación de ensamblaje\n3. Foxconn: programación de 4h → 10 min\n4. BMW: Deep Learning detecta defectos invisibles\n5. P&G: predice defectos antes de que ocurran, -30% desperdicio",
    },
    {
      titulo: "10 casos reales — Parte 2",
      contenido: "6. Amazon: robots reducen picking 50%\n7. DHL: rutas óptimas, -15% combustible\n8. Walmart: predicción de demanda, -30% rupturas\n9. Caterpillar: previene accidentes con sensores + IA\n10. Unilever: programa turnos optimizando costos",
    },
    {
      titulo: "IA en manufactura ecuatoriana",
      contenido: "• Holcim, UNACEM: mantenimiento predictivo en cementeras\n• Cervecería Nacional: analítica para optimizar producción\n• Pronaca: explora visión por computadora\n• Exportadoras de banano: drones con IA en plantaciones\n\nLas herramientas no son experimentos. Están en producción real.",
    },
    {
      titulo: "Resumen del Tema 1.2",
      contenido: "1. Toda la IA comercial es ANI (IA Estrecha) y eso basta\n2. 5 tipos por función: Generativa, Predictiva, Conversacional, Visual, Optimización\n3. Casos globales: Siemens, Tesla, BMW, P&G, Amazon, Walmart\n4. Ecuador ya tiene casos reales en cemento, alimentos, banano\n5. La pregunta no es 'si', es 'cuándo empezarás'",
    },
    {
      titulo: "Próximo Tema",
      contenido: "Tema 1.3 — El ecosistema de herramientas IA en 2026\nMapearemos ChatGPT, Claude, Copilot, Power BI, Minitab y más, con precios y casos de uso.\n\nitseia.ai — La primera academia de IA del Ecuador",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué tipo de IA es la única que existe comercialmente en 2026?",
      opciones: [
        "Superinteligencia Artificial (ASI)",
        "IA General (AGI)",
        "IA Estrecha (Narrow AI)",
        "IA Consciente",
      ],
      respuesta: 2,
      explicacion: "Toda la IA comercial actual es IA Estrecha: hace UNA tarea muy bien pero no transfiere conocimiento a otros dominios.",
    },
    {
      pregunta: "Siemens redujo sus paradas no planificadas un 20% gracias a:",
      opciones: [
        "Más personal de mantenimiento",
        "Mantenimiento predictivo con IA",
        "Reemplazo total de las turbinas",
        "Mantenimiento preventivo con calendario fijo",
      ],
      respuesta: 1,
      explicacion: "Siemens implementó mantenimiento predictivo con sensores y ML, anticipando fallas antes de que ocurran.",
    },
    {
      pregunta: "Una fábrica quiere generar reportes de producción diarios automáticamente. ¿Qué tipo de IA necesita?",
      opciones: [
        "IA Visual",
        "IA Generativa",
        "IA de Optimización",
        "IA Robótica",
      ],
      respuesta: 1,
      explicacion: "Generar texto y reportes a partir de datos es la función clásica de la IA Generativa (ChatGPT, Claude).",
    },
    {
      pregunta: "Detectar defectos en línea de producción con cámaras requiere principalmente:",
      opciones: [
        "IA Conversacional",
        "IA Generativa",
        "IA Visual con Deep Learning",
        "IA de Optimización",
      ],
      respuesta: 2,
      explicacion: "El análisis de imágenes en tiempo real es el caso emblemático de la IA Visual con redes neuronales profundas.",
    },
    {
      pregunta: "En Ecuador, ¿qué sector ya tiene casos documentados de uso de IA en manufactura?",
      opciones: [
        "Solo el sector tecnológico",
        "Cementeras, alimentos y banano",
        "Únicamente la banca",
        "Ningún sector industrial aún",
      ],
      respuesta: 1,
      explicacion: "Holcim, Cervecería Nacional, Pronaca y exportadoras de banano ya tienen casos reales de IA en producción.",
    },
  ],
  ejercicio: {
    titulo: "Mapa de IA en tu cadena de valor industrial",
    objetivo: "Construir un mapa visual de tu cadena de valor identificando dónde aplica cada tipo de IA, con herramientas accesibles y ejemplos concretos",
    herramientas: "Miro o Lucidchart (versiones gratuitas) + ChatGPT Plus + Google Sheets",
    datosEjemplo: "Etapas de la cadena de valor industrial:\n• Proveedores y abastecimiento\n• Recepción y almacén de materia prima\n• Producción y planta\n• Control de calidad\n• Almacén de producto terminado\n• Logística y distribución\n• Atención post-venta",
    pasos: [
      "Crear un diagrama de tu cadena de valor en Miro o Lucidchart con las 7 etapas",
      "Para cada etapa, identificar 1-2 procesos repetitivos con datos disponibles",
      "Asignar a cada proceso el tipo de IA aplicable: Generativa, Predictiva, Conversacional, Visual u Optimización",
      "Sugerir una herramienta accesible para cada caso (ChatGPT, Power BI IA, Copilot Excel, Claude, etc.)",
      "Buscar 1 caso real de empresa global o ecuatoriana que ya lo haga (usar ChatGPT para investigar)",
      "Estimar impacto: alto, medio o bajo (en horas ahorradas o errores reducidos)",
      "Priorizar los 3 procesos con mayor impacto y menor esfuerzo de implementación",
      "Escribir un resumen ejecutivo de 250 palabras para presentar a la gerencia",
    ],
    resultado: "Mapa visual de tu cadena de valor con tipos de IA, herramientas y casos referencia, más un resumen ejecutivo de 250 palabras priorizando los 3 mejores quick wins",
    criterios: [
      { criterio: "Mapa visual completo y claro", puntos: 25 },
      { criterio: "Asignación correcta de tipos de IA", puntos: 20 },
      { criterio: "Herramientas sugeridas son realistas y accesibles", puntos: 20 },
      { criterio: "Casos referencia bien documentados", puntos: 15 },
      { criterio: "Resumen ejecutivo claro y accionable", puntos: 20 },
    ],
  },
  recursos: [
    { titulo: "AI in Manufacturing 2024 — Capgemini", url: "https://www.capgemini.com/insights/research-library/generative-ai-in-organizations-2024/", tipo: "documentacion", descripcion: "Estudio anual de Capgemini sobre adopción de IA en manufactura global." },
    { titulo: "How BMW uses AI — CNBC", url: "https://www.youtube.com/watch?v=P7fi4hP_y80", tipo: "lectura", descripcion: "Documental sobre cómo BMW aplica Deep Learning en líneas de producción." },
    { titulo: "5 formas en que la IA transforma manufactura — WEF", url: "https://www.weforum.org/stories/2024/01/how-ai-is-revolutionizing-manufacturing/", tipo: "documentacion", descripcion: "Reporte del World Economic Forum con casos globales clave." },
    { titulo: "Miro — Diagramas colaborativos", url: "https://miro.com", tipo: "herramienta", descripcion: "Plataforma de diagramación visual gratuita para mapear tu cadena de valor." },
    { titulo: "Industry 4.0 — Deloitte", url: "https://www2.deloitte.com/us/en/insights/focus/industry-4-0.html", tipo: "lectura", descripcion: "Análisis de Deloitte sobre la cuarta revolución industrial y el rol de la IA." },
    { titulo: "Cámara de Industrias y Producción — Ecuador", url: "https://www.cip.org.ec/", tipo: "lectura", descripcion: "Reportes sobre el estado de la industria ecuatoriana y casos de transformación digital." },
  ],
};

const tema3: TemaProSteveen = {
  id: 3,
  titulo: "El ecosistema de herramientas IA en 2026",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "",
  videoTitulo: "Mapa completo de herramientas IA para ingeniería industrial 2026",
  videoDuracion: "~55 min · Español · Por confirmar",
  slidesUrl: "",
  teoria: `Existe un exceso de herramientas de IA en el mercado en 2026. Cada semana aparecen nuevas startups prometiendo transformar tu negocio. Para el ingeniero industrial, la pregunta correcta no es "¿qué herramienta es la mejor?" sino "¿qué herramienta resuelve mi problema específico al menor costo y con mi equipo actual?". Este tema te da el mapa completo para tomar decisiones informadas.

Mapa de herramientas IA esenciales para ingeniería industrial (2026):

ChatGPT Plus ($20/mes): el caballo de batalla. Excelente para análisis de datos en Excel, generación de reportes, código sencillo, generación de imágenes para presentaciones, conversaciones largas con contexto. Limitación principal: puede "alucinar" datos — inventar información con apariencia de certeza. Siempre debes verificar datos críticos.

Claude Pro ($20/mes): el especialista en documentos largos. Su ventana de contexto procesa más de 200.000 tokens, equivalente a 60 páginas de manual técnico de una sola vez. Excelente para análisis profundo, comparativas técnicas, redacción de procedimientos ISO y evaluación de propuestas. Limitación: no ejecuta código directamente como ChatGPT.

Copilot Excel (incluido en Microsoft 365): si tu empresa ya paga Microsoft 365, lo tienes. Perfecto para fórmulas complejas, tablas dinámicas, análisis automático dentro de Excel. Limitación: solo funciona dentro de Excel, no es conversacional general.

Power BI IA (desde $10/mes): ideal para dashboards interactivos, alertas automáticas, detección de tendencias y anomalías. Requiere datos estructurados pero genera visualizaciones ejecutivas impactantes. Limitación: curva de aprendizaje inicial de 1-2 semanas.

Minitab IA ($1.800/año licencia): la herramienta de elite para Statistical Process Control (SPC), Diseño de Experimentos (DOE), análisis Weibull y capacidad de proceso. Cara, con curva de aprendizaje pronunciada, pero indispensable en plantas grandes con cultura Six Sigma.

Tableau (desde $15/mes): visualización ejecutiva de datos de alto nivel. Muy popular en gerencia y dirección. Limitación: no hace cálculos estadísticos avanzados.

NotebookLM (gratis, Google): subes documentos, manuales, normativas y haces preguntas en lenguaje natural. Perfecto como base de conocimiento de procedimientos. Limitación: solo funciona con Google y tiene límite de fuentes.

n8n (gratis, self-hosted): automatización de flujos entre herramientas. Conectas Excel → ChatGPT → Email → Power BI sin programar. Limitación: requiere configuración técnica inicial.

¿ChatGPT Plus o Claude Pro? La pregunta más común. La respuesta práctica: si tienes presupuesto, usa ambas y rota según la tarea. Si solo puedes elegir una, depende de tu trabajo principal. Para análisis de Excel con miles de filas, ChatGPT gana. Para leer manuales técnicos largos, comparar cotizaciones extensas o redactar procedimientos ISO de 30 páginas, Claude gana. Para generar imágenes y código, ChatGPT. Para cumplimiento regulatorio y análisis cuidadoso de contratos, Claude.

Estrategia recomendada para el ingeniero industrial promedio en Ecuador:

Fase 1 (mes 1, $20/mes): ChatGPT Plus + NotebookLM gratis. Aprende prompt engineering básico. Genera reportes y consulta procedimientos. ROI esperado: 5-10 horas ahorradas por semana.

Fase 2 (mes 2-3, $40/mes): agrega Claude Pro. Empieza a leer documentos largos con IA, redactar procedimientos ISO, evaluar proveedores. ROI esperado: 10-15 horas ahorradas por semana.

Fase 3 (mes 4+, $50-70/mes): agrega Power BI IA si tu empresa tiene datos en Excel. Empieza a construir dashboards predictivos. ROI esperado: 15-25 horas ahorradas por semana, plus mejor toma de decisiones gerencial.

Fase 4 (cuando se justifique): Minitab IA solo si haces SPC formal, n8n si quieres automatizar flujos completos.

El error más común que cometen los ingenieros industriales en Ecuador es comprar la herramienta "más completa" sin haber dominado herramientas básicas. ChatGPT Plus bien usado supera a Minitab mal configurado. Empieza simple, mide resultados, escala cuando el ROI lo justifique.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "El ecosistema de herramientas IA en 2026\nMódulo 1 — Tema 3\nIA Aplicada para Ingeniería Industrial — itseia.ai",
    },
    {
      titulo: "Qué aprenderás hoy",
      contenido: "Al finalizar esta sesión podrás:\n• Mapear las 8 herramientas IA esenciales para ingeniería industrial\n• Comparar ChatGPT Plus vs Claude Pro según tarea\n• Diseñar tu plan de adopción por fases (mes 1 a mes 4+)\n• Evitar el error de comprar la herramienta 'más completa'",
    },
    {
      titulo: "Las 8 herramientas esenciales",
      contenido: "1. ChatGPT Plus ($20/mes) — caballo de batalla\n2. Claude Pro ($20/mes) — documentos largos\n3. Copilot Excel (incluido M365) — análisis en Excel\n4. Power BI IA (desde $10/mes) — dashboards\n5. Minitab IA ($1.800/año) — SPC y DOE\n6. Tableau ($15+/mes) — visualización ejecutiva\n7. NotebookLM (gratis) — base de conocimiento\n8. n8n (gratis) — automatización de flujos",
    },
    {
      titulo: "ChatGPT Plus vs Claude Pro",
      contenido: "ChatGPT Plus gana en:\n• Análisis de Excel con miles de filas\n• Generación de imágenes\n• Cálculos y código\n\nClaude Pro gana en:\n• Manuales técnicos largos (+60 páginas)\n• Comparativas técnicas detalladas\n• Procedimientos ISO\n• Análisis cuidadoso de contratos",
    },
    {
      titulo: "Plan de adopción por fases — Fase 1",
      contenido: "Mes 1 — $20/mes\n• ChatGPT Plus + NotebookLM gratis\n• Aprende prompt engineering básico\n• Genera reportes simples\n• Consulta procedimientos con NotebookLM\n\nROI esperado: 5-10 horas ahorradas por semana",
    },
    {
      titulo: "Plan de adopción por fases — Fase 2 y 3",
      contenido: "Mes 2-3 — $40/mes\n• Agrega Claude Pro\n• Documentos largos, ISO, evaluación de proveedores\n• ROI: 10-15 horas/semana\n\nMes 4+ — $50-70/mes\n• Agrega Power BI IA\n• Dashboards predictivos para gerencia\n• ROI: 15-25 horas/semana + mejor toma de decisiones",
    },
    {
      titulo: "El error más común en Ecuador",
      contenido: "Comprar la herramienta 'más completa' sin dominar las básicas.\n\nChatGPT Plus bien usado > Minitab mal configurado.\n\nRegla práctica:\n1. Empieza simple\n2. Mide resultados con datos\n3. Escala solo cuando el ROI lo justifique",
    },
    {
      titulo: "Resumen del Tema 1.3",
      contenido: "1. 8 herramientas esenciales con precios y limitaciones claras\n2. ChatGPT y Claude se complementan, no compiten\n3. Plan por fases: $20 → $40 → $70/mes con ROI medible\n4. NotebookLM gratis es subutilizado y muy potente\n5. Empieza simple. Escala con ROI demostrado.",
    },
    {
      titulo: "Próximo Tema",
      contenido: "Tema 1.4 — Cómo evaluar si una herramienta IA sirve para tu caso\nVeremos el framework PIED y el checklist de 5 preguntas antes de comprar.\n\nitseia.ai — La primera academia de IA del Ecuador",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál herramienta es ideal para analizar un manual técnico de 150 páginas?",
      opciones: [
        "Copilot Excel",
        "Claude Pro",
        "Power BI IA",
        "Minitab",
      ],
      respuesta: 1,
      explicacion: "Claude Pro tiene una ventana de contexto que procesa más de 200.000 tokens — perfecto para documentos extensos.",
    },
    {
      pregunta: "Para crear un dashboard de producción con alertas automáticas, la mejor opción es:",
      opciones: [
        "ChatGPT Plus",
        "NotebookLM",
        "Power BI IA",
        "Claude Pro",
      ],
      respuesta: 2,
      explicacion: "Power BI IA está diseñada específicamente para dashboards interactivos con alertas y detección de tendencias.",
    },
    {
      pregunta: "¿Cuál es la principal limitación de ChatGPT Plus que un ingeniero debe considerar?",
      opciones: [
        "No funciona en español",
        "Puede generar datos falsos con apariencia de certeza (alucinaciones)",
        "Solo funciona con internet rápido",
        "No puede leer archivos Excel",
      ],
      respuesta: 1,
      explicacion: "Las alucinaciones son el principal riesgo. Siempre verifica datos críticos antes de tomar decisiones.",
    },
    {
      pregunta: "¿Qué herramienta gratuita permite usar tus documentos como base de conocimiento consultable?",
      opciones: [
        "Tableau",
        "n8n",
        "NotebookLM",
        "Minitab",
      ],
      respuesta: 2,
      explicacion: "NotebookLM (Google) es gratis, sube documentos como fuentes y permite hacer preguntas en lenguaje natural.",
    },
    {
      pregunta: "Según el plan de adopción recomendado, ¿con cuánto presupuesto mensual conviene empezar?",
      opciones: [
        "$0 — solo herramientas gratuitas",
        "$20 — solo ChatGPT Plus + NotebookLM gratis",
        "$70 — todas las herramientas a la vez",
        "$200 — incluyendo Minitab desde el inicio",
      ],
      respuesta: 1,
      explicacion: "Fase 1 recomienda $20/mes (ChatGPT + NotebookLM). Escalar solo cuando el ROI esté demostrado.",
    },
  ],
  ejercicio: {
    titulo: "Tabla de decisión: tu stack IA personalizado",
    objetivo: "Diseñar tu propio stack de herramientas IA priorizadas según tus tareas reales semanales y tu presupuesto disponible",
    herramientas: "Google Sheets + ChatGPT Plus para validar tu razonamiento",
    datosEjemplo: "Tareas semanales típicas de un ingeniero industrial:\n• Reporte de producción semanal (2h actuales)\n• Análisis de causa raíz incidentes (4h por incidente)\n• Evaluación de cotizaciones de proveedores (3h)\n• Revisión y actualización de procedimientos ISO (4h/mes)\n• Dashboard de KPIs para gerencia (3h semanales)\n• Análisis estadístico de datos de calidad (2h semanales)\n• Programación de turnos (2h semanales)\n• Atención de dudas operativas del equipo (5h semanales)",
    pasos: [
      "Listar tus 8-10 tareas semanales reales con tiempo actual de cada una",
      "Para cada tarea, identificar la herramienta IA más adecuada (de las 8 del módulo)",
      "Estimar el tiempo con IA bien aplicada (consultar con ChatGPT como sanity check)",
      "Calcular el ahorro semanal en horas y monetizar (usar costo hora-ingeniero promedio Ecuador: $8-15)",
      "Sumar el costo total de las herramientas necesarias por mes",
      "Calcular ROI: (ahorro mensual en $) / (costo mensual herramientas)",
      "Diseñar tu plan de adopción de 90 días por fases con metas específicas y medibles",
      "Presentar a tu jefe directo (o redactar el caso de negocio) con cifras concretas",
    ],
    resultado: "Tabla de decisión con 8-10 tareas, herramientas asignadas, ahorro mensual en horas y dólares, ROI calculado y plan de adopción de 90 días con fases claras",
    criterios: [
      { criterio: "Identificación realista de tareas semanales", puntos: 15 },
      { criterio: "Asignación correcta de herramientas a cada tarea", puntos: 25 },
      { criterio: "Estimación honesta y verificada de ahorros", puntos: 20 },
      { criterio: "Cálculo de ROI con datos concretos", puntos: 20 },
      { criterio: "Plan de adopción de 90 días claro y accionable", puntos: 20 },
    ],
  },
  recursos: [
    { titulo: "ChatGPT Plus", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "$20/mes. La herramienta principal para empezar." },
    { titulo: "Claude Pro", url: "https://claude.ai", tipo: "herramienta", descripcion: "$20/mes. Especialista en documentos largos y análisis profundo." },
    { titulo: "NotebookLM (Google)", url: "https://notebooklm.google.com", tipo: "herramienta", descripcion: "Gratis. Sube documentos y consúltalos en lenguaje natural." },
    { titulo: "Power BI IA — Microsoft", url: "https://powerbi.microsoft.com/es-es/", tipo: "herramienta", descripcion: "Desde $10/mes. Dashboards interactivos con IA integrada." },
    { titulo: "n8n — Automatización gratuita", url: "https://n8n.io", tipo: "herramienta", descripcion: "Gratis self-hosted. Conecta herramientas sin programar." },
    { titulo: "Comparativa anual de herramientas IA — G2", url: "https://www.g2.com/categories/artificial-intelligence", tipo: "documentacion", descripcion: "Reseñas y comparativas verificadas de usuarios reales." },
  ],
};

const tema4: TemaProSteveen = {
  id: 4,
  titulo: "Cómo evaluar si una herramienta IA sirve para tu caso",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "",
  videoTitulo: "Framework PIED — Evaluar herramientas IA antes de comprar",
  videoDuracion: "~45 min · Español · Por confirmar",
  slidesUrl: "",
  teoria: `El mercado de herramientas IA en 2026 vive un boom. Cada semana aparecen nuevas plataformas prometiendo "transformar tu negocio con un clic". El ingeniero industrial que sobrevive a este ruido es el que tiene un framework de evaluación claro y disciplinado. Sin un método, terminas pagando suscripciones que nadie usa, comprando licencias que el equipo no entiende, e implementando proyectos sin ROI medible.

El Framework PIED — desarrollado por consultores de transformación digital — te da un lente práctico para evaluar cualquier herramienta de IA antes de invertir tiempo y dinero. Sus cuatro letras representan los cuatro filtros que toda decisión de adopción debe pasar.

P — Problema. ¿Tengo un problema claro y medible que esta herramienta resuelve? Esta es la pregunta más importante y la que más gente se salta. La respuesta correcta nunca es "quiero usar IA". La respuesta correcta es del tipo: "quiero reducir el tiempo de generación de reportes mensuales de producción de 2 horas a 15 minutos" o "quiero detectar anomalías en datos de calidad antes de que generen reclamos de clientes". Si no puedes formular el problema en una frase con un número, no estás listo para comprar IA — estás listo para definir tu problema primero.

I — Inputs. ¿Tengo los datos que la herramienta necesita? La IA sin datos es como un motor sin gasolina. Tres preguntas concretas: ¿Los datos están en formato digital o están en bitácoras de papel? ¿Tengo al menos 6 meses de historia? ¿Los datos están limpios y estructurados, o son un caos de hojas de Excel sin formato uniforme? Si fallaste en alguna, tu primer proyecto de IA no es comprar la herramienta — es digitalizar y limpiar datos. Sin esto, la mejor herramienta del mundo no servirá.

E — Evaluación. ¿Puedo probar antes de comprar? La regla de oro: nunca pagues por anualidad sin haber probado al menos 2 semanas. Pregúntate: ¿Tiene versión gratuita o trial? ¿Puedo probar con MIS datos reales (anonimizados si es necesario)? ¿El resultado es verificable contra mi realidad operativa? Las herramientas que no permiten pruebas serias suelen ser las que tienen problemas. Las buenas saben que su demo vende sola.

D — Despliegue. ¿Puedo implementarlo sin depender de consultores externos para siempre? Una herramienta que requiere consultoría permanente para mantenerse no es una solución — es una dependencia. Tres preguntas: ¿Mi equipo puede usarla después de 2-4 horas de capacitación? ¿Se integra con mis herramientas actuales (Excel, ERP, Power BI)? ¿El costo mensual sostenido es proporcional al ahorro generado?

Más allá del framework PIED, existe un checklist práctico de 5 preguntas antes de comprar cualquier herramienta de IA en ingeniería industrial:

1. ¿Tenemos datos históricos digitales de este proceso (mínimo 6 meses)? SÍ / NO
2. ¿El proceso es repetitivo y tiene patrones identificables? SÍ / NO
3. ¿Actualmente una persona toma decisiones basándose en experiencia o intuición? SÍ / NO
4. ¿Un error en este proceso tiene impacto económico significativo? SÍ / NO
5. ¿El volumen de datos es demasiado grande para analizar manualmente? SÍ / NO

Si tienes 3 o más "SÍ", el proceso es buen candidato para IA. Si tienes menos, la herramienta no resolverá el problema — necesitas trabajar primero en estructurar el proceso o digitalizar los datos.

Errores frecuentes que el framework te ayuda a evitar:

Error 1: comprar por moda. "Todos están usando ChatGPT, debemos usarlo nosotros también." No es razón. Sin un problema medible, no hay ROI.

Error 2: subestimar la curva de aprendizaje. Una herramienta poderosa que el equipo no domina genera resultados peores que herramientas simples bien usadas.

Error 3: depender de un consultor para siempre. Si después de 6 meses todavía necesitas a un externo para usar la herramienta, hay un problema de despliegue.

Error 4: ignorar el cumplimiento. En Ecuador, la LOPDP (Ley Orgánica de Protección de Datos Personales) regula el manejo de información. Algunas herramientas IA mandan datos a servidores en el extranjero — verifica antes de subir información sensible.

Error 5: no medir resultados. "Estamos usando ChatGPT para reportes" no es resultado. "Reducimos tiempo de reportes de 8 horas a 1.5 horas semanales" sí lo es. Mide siempre.

El ingeniero industrial que aplica disciplinadamente el framework PIED y este checklist toma decisiones de adopción de IA con criterio profesional. Esa disciplina es lo que separa a los líderes de transformación digital de los compradores impulsivos.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Cómo evaluar si una herramienta IA sirve para tu caso\nMódulo 1 — Tema 4\nIA Aplicada para Ingeniería Industrial — itseia.ai",
    },
    {
      titulo: "Qué aprenderás hoy",
      contenido: "Al finalizar esta sesión podrás:\n• Aplicar el framework PIED para evaluar cualquier herramienta IA\n• Usar el checklist de 5 preguntas antes de comprar\n• Reconocer 5 errores frecuentes en adopción de IA\n• Cumplir con la LOPDP de Ecuador en tus decisiones",
    },
    {
      titulo: "Framework PIED",
      contenido: "P — Problema: claro y medible (con número)\nI — Inputs: ¿tengo los datos digitales que necesita?\nE — Evaluación: ¿puedo probar antes de comprar?\nD — Despliegue: ¿puedo implementarlo sin consultor externo permanente?",
    },
    {
      titulo: "P — Problema bien formulado",
      contenido: "MAL: 'Quiero usar IA en mi empresa'\nBIEN: 'Quiero reducir el tiempo de generación de reportes mensuales de 2h a 15min'\n\nSi no puedes formular el problema con un número, no estás listo para comprar IA. Estás listo para definir el problema.",
    },
    {
      titulo: "I — Inputs disponibles",
      contenido: "Tres preguntas concretas:\n1. ¿Los datos están en formato digital o en papel?\n2. ¿Tengo al menos 6 meses de historia?\n3. ¿Los datos están limpios y estructurados?\n\nSi fallaste en alguna, primero digitalizar y limpiar. Sin datos, no hay IA.",
    },
    {
      titulo: "Checklist de 5 preguntas",
      contenido: "1. ¿Tenemos datos históricos digitales (+6 meses)?\n2. ¿El proceso es repetitivo con patrones?\n3. ¿Hoy alguien decide por experiencia/intuición?\n4. ¿Un error tiene impacto económico significativo?\n5. ¿El volumen es demasiado grande para análisis manual?\n\n3+ SÍ = buen candidato para IA",
    },
    {
      titulo: "5 errores frecuentes",
      contenido: "1. Comprar por moda sin problema medible\n2. Subestimar la curva de aprendizaje\n3. Depender de un consultor para siempre\n4. Ignorar la LOPDP — datos en servidores extranjeros\n5. No medir resultados con cifras concretas\n\nEl framework PIED te protege de los 5.",
    },
    {
      titulo: "Resumen del Tema 1.4",
      contenido: "1. PIED: Problema, Inputs, Evaluación, Despliegue\n2. Checklist de 5 preguntas: necesitas 3+ SÍ\n3. La IA sin datos es motor sin gasolina\n4. Verifica LOPDP antes de subir datos sensibles\n5. Mide resultados con cifras o no estás haciendo nada",
    },
    {
      titulo: "Próximo Tema",
      contenido: "Tema 1.5 — Mapa de oportunidades IA en tu empresa\nUsaremos lo aprendido para construir tu roadmap personalizado de adopción.\n\nitseia.ai — La primera academia de IA del Ecuador",
    },
  ],
  quiz: [
    {
      pregunta: "Según el framework PIED, ¿cuál es el primer paso para evaluar una herramienta de IA?",
      opciones: [
        "Verificar el precio mensual",
        "Definir un problema claro y medible",
        "Leer reseñas en internet",
        "Contratar a un consultor",
      ],
      respuesta: 1,
      explicacion: "P es la primera letra: sin un Problema claro y medible, las otras evaluaciones no tienen sentido.",
    },
    {
      pregunta: "Tu empresa quiere implementar IA para 'modernizarse'. ¿Cuál es el error principal?",
      opciones: [
        "El presupuesto es insuficiente",
        "No hay un problema específico y medible que resolver",
        "El equipo no es técnico",
        "Faltan servidores propios",
      ],
      respuesta: 1,
      explicacion: "'Modernizarse' no es un problema medible. Sin un objetivo concreto con número, no hay ROI posible.",
    },
    {
      pregunta: "Un proceso con datos en bitácoras de papel manuscritas y sin historial digital, ¿es candidato inmediato para IA?",
      opciones: [
        "Sí, la IA puede leer papel",
        "No, primero hay que digitalizar y estructurar los datos",
        "Sí, con suficiente presupuesto",
        "Depende del proveedor de IA",
      ],
      respuesta: 1,
      explicacion: "El paso I (Inputs) del framework PIED exige datos digitales. Sin eso, primero digitaliza, luego implementa IA.",
    },
    {
      pregunta: "Si en el checklist de 5 preguntas obtienes solo 2 'SÍ', ¿qué significa?",
      opciones: [
        "El proceso es candidato perfecto para IA inmediata",
        "El proceso aún no es buen candidato — falta estructurarlo o digitalizar datos",
        "Hay que comprar la herramienta más cara disponible",
        "Hay que abandonar el proceso para siempre",
      ],
      respuesta: 1,
      explicacion: "Se necesitan 3+ SÍ para considerarlo buen candidato. Con 2, primero hay que trabajar en el proceso o los datos.",
    },
    {
      pregunta: "En Ecuador, ¿qué ley regula el manejo de datos personales en sistemas IA?",
      opciones: [
        "Ley de Régimen Tributario Interno (LORTI)",
        "Ley Orgánica de Protección de Datos Personales (LOPDP)",
        "Ley Orgánica de Educación Superior (LOES)",
        "Código Civil",
      ],
      respuesta: 1,
      explicacion: "La LOPDP, vigente desde 2023, regula el uso de datos personales en sistemas automatizados con multas de hasta 1% de facturación.",
    },
  ],
  ejercicio: {
    titulo: "Aplicación del framework PIED a 3 herramientas reales",
    objetivo: "Evaluar 3 herramientas de IA candidatas para un problema real de tu empresa usando el framework PIED y el checklist de 5 preguntas, y emitir una recomendación fundamentada",
    herramientas: "Google Sheets + ChatGPT Plus o Claude para investigar herramientas + Google Docs para el reporte final",
    datosEjemplo: "Problema modelo (puedes adaptar al tuyo):\n'Reducir el tiempo de análisis de causa raíz de incidentes de calidad de 4 horas por incidente a 1 hora, manteniendo o mejorando la calidad del análisis. Tenemos 18 meses de incidentes documentados en Excel con descripción, causa identificada y acción correctiva.'\n\nHerramientas candidatas sugeridas:\n• ChatGPT Plus ($20/mes)\n• Claude Pro ($20/mes)\n• Una herramienta especializada de calidad (investigar 1)",
    pasos: [
      "Definir el problema específico de tu empresa con un número medible",
      "Crear una hoja de evaluación con columnas: Criterio PIED, Herramienta A, Herramienta B, Herramienta C, Puntaje 1-5",
      "Aplicar las 4 letras del PIED a cada herramienta investigando especificaciones reales",
      "Aplicar el checklist de 5 preguntas marcando SÍ/NO para cada herramienta vs tu problema",
      "Calcular puntaje total /20 (5 puntos × 4 criterios PIED) para cada herramienta",
      "Revisar costo total año 1 (suscripción + capacitación + datos preparados)",
      "Verificar cumplimiento LOPDP (¿dónde guardan los datos?, ¿hay acuerdo de procesamiento?)",
      "Escribir reporte de recomendación de 350 palabras con la herramienta ganadora, justificación y plan de implementación a 90 días",
    ],
    resultado: "Hoja de evaluación PIED comparando 3 herramientas con puntajes, checklist de 5 preguntas, análisis LOPDP y reporte de recomendación de 350 palabras con plan de 90 días",
    criterios: [
      { criterio: "Problema bien formulado con número medible", puntos: 15 },
      { criterio: "Aplicación correcta de los 4 criterios PIED", puntos: 25 },
      { criterio: "Checklist de 5 preguntas con evidencia", puntos: 20 },
      { criterio: "Análisis de cumplimiento LOPDP", puntos: 15 },
      { criterio: "Reporte final claro y accionable", puntos: 25 },
    ],
  },
  recursos: [
    { titulo: "Cómo evaluar herramientas de IA — MIT Sloan", url: "https://sloanreview.mit.edu/article/when-lean-meets-industry-4-0/", tipo: "documentacion", descripcion: "Artículo del MIT Sloan sobre criterios de evaluación de tecnología en manufactura." },
    { titulo: "AI Readiness Assessment — McKinsey", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights", tipo: "documentacion", descripcion: "Marco de McKinsey para evaluar madurez antes de adoptar IA." },
    { titulo: "Framework de adopción de IA — Gartner", url: "https://www.gartner.com/en/topics/artificial-intelligence", tipo: "documentacion", descripcion: "Análisis de Gartner sobre fases y criterios de adopción empresarial de IA." },
    { titulo: "LOPDP Ecuador — Texto oficial", url: "https://www.proteccionverde.com/wp-content/uploads/2023/09/Ley-Organica-de-Proteccion-de-Datos-Personales.pdf", tipo: "documentacion", descripcion: "Ley Orgánica de Protección de Datos Personales del Ecuador, vigente desde 2023." },
    { titulo: "Plantilla de evaluación de proveedores tech — HBR", url: "https://hbr.org/2023/07/how-to-use-ai-to-make-better-decisions", tipo: "lectura", descripcion: "Harvard Business Review sobre toma de decisiones con IA." },
    { titulo: "Checklist de adopción IA — Deloitte", url: "https://www2.deloitte.com/us/en/insights/focus/industry-4-0.html", tipo: "lectura", descripcion: "Checklist práctico de Deloitte para evaluar madurez tecnológica." },
  ],
};

const tema5: TemaProSteveen = {
  id: 5,
  titulo: "Mapa de oportunidades IA en tu empresa",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "",
  videoTitulo: "Cómo construir el roadmap de IA de tu planta — método paso a paso",
  videoDuracion: "~50 min · Español · Por confirmar",
  slidesUrl: "",
  teoria: `Llegaste al tema que conecta toda la teoría con la acción. Si los temas 1.1 a 1.4 te dieron los fundamentos, este tema te enseña a construir un mapa personalizado de oportunidades de IA para tu empresa, priorizado por impacto y factibilidad. Cuando termines este tema y su ejercicio, tendrás un roadmap concreto para presentar a tu gerencia, no una lista de buenas intenciones.

La metodología de mapeo tiene cinco pasos disciplinados que aplicarás en orden:

Paso 1 — Inventario de procesos. Lista TODOS los procesos repetitivos de tu operación. Repetitivos significa que se ejecutan al menos una vez por semana de forma similar. No filtres aún por "esto se puede automatizar" — solo lista. Procesos típicos en ingeniería industrial: generación de reportes, análisis de causa raíz, evaluación de proveedores, redacción de procedimientos ISO, programación de turnos, análisis estadístico de calidad, atención de dudas operativas, dashboards de KPI, gestión de inventario, planificación de mantenimiento. Una lista típica tendrá 15-25 procesos.

Paso 2 — Evaluación rápida. Aplica el checklist de 5 preguntas del Tema 1.4 a cada proceso de tu lista. Marca SÍ/NO en cada una. Solo los procesos con 3+ "SÍ" continúan al siguiente paso. Esto suele filtrar la lista inicial a 8-12 procesos viables.

Paso 3 — Priorización con matriz impacto/esfuerzo. Esta es la herramienta más poderosa para decidir por dónde empezar. Coloca cada proceso filtrado en una matriz 2x2:

Eje vertical: Impacto (alto vs bajo). Mide el ahorro económico anual potencial: horas ahorradas multiplicadas por costo hora-ingeniero, errores reducidos, tiempo de ciclo mejorado, satisfacción de cliente.

Eje horizontal: Esfuerzo (bajo vs alto). Mide qué tan complejo es implementar la solución: disponibilidad de datos, capacitación necesaria, costo de herramientas, tiempo de implementación, resistencia al cambio.

Cuadrantes resultantes:
- Cuadrante 1 (Alto impacto, Bajo esfuerzo) = QUICK WINS, prioridad MÁXIMA. Empieza aquí.
- Cuadrante 2 (Alto impacto, Alto esfuerzo) = PROYECTOS ESTRATÉGICOS. Planifica a mediano plazo (3-6 meses).
- Cuadrante 3 (Bajo impacto, Bajo esfuerzo) = QUICK FILL. Hazlo si sobra tiempo del cuadrante 1.
- Cuadrante 4 (Bajo impacto, Alto esfuerzo) = NO PRIORIZAR. No vale la pena.

Paso 4 — Quick wins primero. Empieza siempre por el Cuadrante 1. ¿Por qué? Porque genera resultados visibles en 1-2 semanas, construye confianza del equipo en la tecnología, libera tiempo para proyectos más complejos y demuestra ROI a la gerencia. Los 5 quick wins más comunes en ingeniería industrial:

1. Reportes de producción con ChatGPT — Ahorro: 2 horas/día. Esfuerzo: bajo. Implementación: 1 semana.
2. Análisis de causa raíz con Claude — Ahorro: 4 horas por incidente. Esfuerzo: bajo. Implementación: 1 semana.
3. SOPs y procedimientos ISO con Claude — Ahorro: 1 día por procedimiento. Esfuerzo: bajo. Implementación: 2 semanas.
4. Análisis de datos de calidad con ChatGPT — Ahorro: 4 horas/semana. Esfuerzo: medio. Implementación: 2-3 semanas.
5. Dashboard de KPIs con Power BI IA — Ahorro: 3 horas/semana. Esfuerzo: medio. Implementación: 3-4 semanas.

Paso 5 — Escalar después. Una vez que el equipo ve resultados de los quick wins, expandir a procesos del Cuadrante 2 con confianza ganada. La regla es simple: nunca empieces un proyecto del Cuadrante 2 sin haber consolidado al menos 2 quick wins. La transformación digital se construye sobre victorias acumuladas, no sobre big bangs.

El plan de adopción de 90 días recomendado para una empresa típica de ingeniería industrial en Ecuador:

Días 1-30 (Mes 1): Fase de fundamentos. Capacitación del equipo en ChatGPT y Claude. Prompt engineering básico. Implementación de 2 quick wins (típicamente reportes y análisis de causa raíz). KPI: 8-12 horas ahorradas semanales.

Días 31-60 (Mes 2): Fase de expansión. Agregar Power BI IA o Copilot Excel según necesidades. Implementación de 1-2 quick wins adicionales. Definición de proyecto estratégico para Cuadrante 2. KPI: 15-20 horas ahorradas semanales + dashboard funcional.

Días 61-90 (Mes 3): Fase de proyecto estratégico. Inicio del primer proyecto del Cuadrante 2 (típicamente mantenimiento predictivo o pronóstico de demanda). Documentación de procesos optimizados. Reporte ejecutivo a gerencia con ROI demostrado. KPI: 20-25 horas ahorradas semanales + caso de negocio para fase 4.

El error más grande que cometen los ingenieros industriales en Ecuador al construir su roadmap es la "parálisis por análisis": pasar 6 meses planificando en vez de empezar con 2 quick wins en 2 semanas. La transformación digital es iterativa, no perfecta. Empieza pequeño, mide, escala.`,
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido: "Mapa de oportunidades IA en tu empresa\nMódulo 1 — Tema 5\nIA Aplicada para Ingeniería Industrial — itseia.ai",
    },
    {
      titulo: "Qué aprenderás hoy",
      contenido: "Al finalizar esta sesión podrás:\n• Construir tu mapa personalizado de oportunidades IA\n• Aplicar la matriz impacto/esfuerzo para priorizar\n• Identificar tus quick wins en 30 días\n• Diseñar tu plan de adopción de 90 días",
    },
    {
      titulo: "Metodología de mapeo — 5 pasos",
      contenido: "1. Inventario de procesos repetitivos (15-25 típicamente)\n2. Evaluación con checklist de 5 preguntas (filtra a 8-12)\n3. Priorización con matriz impacto/esfuerzo\n4. Quick wins primero (Cuadrante 1)\n5. Escalar a proyectos estratégicos (Cuadrante 2)",
    },
    {
      titulo: "Matriz impacto / esfuerzo",
      contenido: "ALTO IMPACTO + BAJO ESFUERZO = QUICK WINS (empieza aquí)\nALTO IMPACTO + ALTO ESFUERZO = ESTRATÉGICOS (3-6 meses)\nBAJO IMPACTO + BAJO ESFUERZO = QUICK FILL (si sobra tiempo)\nBAJO IMPACTO + ALTO ESFUERZO = NO PRIORIZAR\n\nLa regla: empieza siempre por el Cuadrante 1.",
    },
    {
      titulo: "5 quick wins más comunes",
      contenido: "1. Reportes de producción con ChatGPT — 2h/día ahorradas\n2. Análisis causa raíz con Claude — 4h/incidente\n3. SOPs e ISO con Claude — 1 día/procedimiento\n4. Análisis de datos de calidad con ChatGPT — 4h/semana\n5. Dashboard KPIs con Power BI IA — 3h/semana",
    },
    {
      titulo: "Plan de 90 días — Mes 1",
      contenido: "Fase de fundamentos\n• Capacitación equipo en ChatGPT y Claude\n• Prompt engineering básico\n• 2 quick wins implementados\n\nKPI esperado: 8-12 horas ahorradas semanales",
    },
    {
      titulo: "Plan de 90 días — Mes 2 y 3",
      contenido: "Mes 2 — Expansión\n• Power BI IA o Copilot Excel\n• 1-2 quick wins más\n• KPI: 15-20 horas ahorradas semanales\n\nMes 3 — Proyecto estratégico\n• Mantenimiento predictivo o pronóstico de demanda\n• Reporte ejecutivo a gerencia\n• KPI: 20-25 horas ahorradas semanales",
    },
    {
      titulo: "El error más grande",
      contenido: "Parálisis por análisis: 6 meses planificando vs 2 semanas implementando 2 quick wins.\n\nLa transformación digital es iterativa, no perfecta.\n\nEmpieza pequeño. Mide. Escala con resultados demostrados.",
    },
    {
      titulo: "Cierre del Módulo 1",
      contenido: "Hoy completamos los 5 temas del Módulo 1: Fundamentos.\n\nPróximo Módulo: ChatGPT — Dominio profesional para ingenieros industriales.\n\nitseia.ai — La primera academia de IA del Ecuador",
    },
  ],
  quiz: [
    {
      pregunta: "¿Por cuál tipo de proceso debe empezar la adopción de IA en una planta?",
      opciones: [
        "El más complejo y costoso de la empresa",
        "Uno repetitivo con datos disponibles y alto impacto visible",
        "El que el gerente general quiera por intuición",
        "El más fácil aunque no tenga impacto",
      ],
      respuesta: 1,
      explicacion: "Los quick wins (alto impacto, bajo esfuerzo) construyen confianza del equipo y demuestran ROI rápido a la gerencia.",
    },
    {
      pregunta: "En la matriz impacto/esfuerzo, ¿qué cuadrante se prioriza primero?",
      opciones: [
        "Alto impacto + alto esfuerzo",
        "Bajo impacto + bajo esfuerzo",
        "Alto impacto + bajo esfuerzo",
        "Bajo impacto + alto esfuerzo",
      ],
      respuesta: 2,
      explicacion: "El Cuadrante 1 (Alto impacto + Bajo esfuerzo) son los quick wins: máxima prioridad para empezar.",
    },
    {
      pregunta: "Un ingeniero genera reportes de producción copiando datos de Excel a Word durante 2 horas diarias. ¿Cuál es la mejor opción?",
      opciones: [
        "Reemplazar todo el sistema con IA empresarial",
        "Automatizar con ChatGPT y reducir el proceso a 10-15 minutos",
        "Contratar un asistente para que copie por él",
        "Eliminar el reporte para siempre",
      ],
      respuesta: 1,
      explicacion: "Es un quick win clásico: ChatGPT genera reportes a partir de Excel en minutos. Ahorro de 1.5h+ diarias.",
    },
    {
      pregunta: "¿Cuál es el error más grande al construir un roadmap de IA según el módulo?",
      opciones: [
        "Empezar con quick wins demasiado pronto",
        "Parálisis por análisis: planificar 6 meses sin implementar",
        "Usar la matriz impacto/esfuerzo",
        "Documentar resultados",
      ],
      respuesta: 1,
      explicacion: "La transformación digital es iterativa. Mejor 2 quick wins implementados que 6 meses de planificación perfecta sin acción.",
    },
    {
      pregunta: "Según el plan de 90 días, ¿cuándo se debería iniciar el primer proyecto del Cuadrante 2 (estratégico)?",
      opciones: [
        "El día 1, antes de los quick wins",
        "Después de consolidar al menos 2 quick wins (mes 2-3)",
        "Solo después de un año de operación",
        "Nunca, son demasiado complejos",
      ],
      respuesta: 1,
      explicacion: "La regla es no iniciar Cuadrante 2 sin antes consolidar 2 quick wins que demuestren valor y construyan confianza.",
    },
  ],
  ejercicio: {
    titulo: "Tu mapa personalizado de oportunidades IA — Plan 90 días",
    objetivo: "Construir el mapa completo de oportunidades de IA de tu empresa con priorización por matriz impacto/esfuerzo y plan de adopción de 90 días con KPI medibles",
    herramientas: "Google Sheets + Miro o Lucidchart para la matriz visual + ChatGPT Plus + Google Slides para presentación final",
    datosEjemplo: "Procesos típicos a inventariar (adaptar a tu empresa):\n• Generación de reportes mensuales\n• Análisis de causa raíz de incidentes\n• Evaluación de proveedores\n• Redacción y revisión de procedimientos ISO\n• Programación de turnos de producción\n• Análisis estadístico de calidad\n• Atención de dudas operativas del equipo\n• Dashboard de KPIs para gerencia\n• Gestión de inventario\n• Planificación de mantenimiento\n• Cotizaciones a clientes\n• Capacitación de personal nuevo",
    pasos: [
      "Hacer inventario de 15-25 procesos repetitivos de tu operación en Google Sheets",
      "Aplicar el checklist de 5 preguntas a cada proceso (necesitas 3+ SÍ para continuar)",
      "Para los procesos viables, calcular impacto en horas/dólares ahorrados anualmente",
      "Estimar esfuerzo en escala 1-10 (datos disponibles, capacitación, costo, tiempo)",
      "Construir la matriz 2x2 visualmente en Miro identificando los 4 cuadrantes",
      "Identificar tus 3-5 quick wins (Cuadrante 1) con detalle: herramienta, plazo, KPI",
      "Identificar 1-2 proyectos estratégicos (Cuadrante 2) para mes 3 o posterior",
      "Diseñar el plan de 90 días con: actividades por mes, KPI esperados, presupuesto, responsables",
      "Crear presentación ejecutiva de 10 slides para tu gerencia (incluye matriz, plan y caso de negocio)",
    ],
    resultado: "Inventario filtrado de procesos, matriz impacto/esfuerzo visual, plan de 90 días con KPI semanales/mensuales, y presentación ejecutiva de 10 slides para gerencia",
    criterios: [
      { criterio: "Inventario completo de 15+ procesos", puntos: 15 },
      { criterio: "Aplicación correcta del checklist de 5 preguntas", puntos: 15 },
      { criterio: "Matriz impacto/esfuerzo bien construida", puntos: 20 },
      { criterio: "Quick wins claramente identificados con KPI", puntos: 20 },
      { criterio: "Plan de 90 días detallado y realista", puntos: 15 },
      { criterio: "Presentación ejecutiva clara y persuasiva", puntos: 15 },
    ],
  },
  recursos: [
    { titulo: "AI Adoption Framework — Harvard Business Review", url: "https://hbr.org/2023/07/how-to-use-ai-to-make-better-decisions", tipo: "documentacion", descripcion: "Marco de HBR para adopción ordenada de IA en empresas." },
    { titulo: "90-Day AI Plan for Manufacturing — Deloitte", url: "https://www2.deloitte.com/us/en/insights/focus/industry-4-0.html", tipo: "documentacion", descripcion: "Plan de Deloitte específico para manufactura con casos detallados." },
    { titulo: "Quick Wins con IA en manufactura — Accenture", url: "https://www.accenture.com/us-en/insights/industry-x/ai-manufacturing", tipo: "lectura", descripcion: "Guía de Accenture sobre los quick wins más efectivos en plantas industriales." },
    { titulo: "Matriz impacto/esfuerzo — plantilla Miro", url: "https://miro.com/templates/impact-effort-matrix/", tipo: "herramienta", descripcion: "Plantilla gratuita para construir tu matriz de priorización." },
    { titulo: "ROI calculator para IA — McKinsey", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights", tipo: "herramienta", descripcion: "Modelo de McKinsey para calcular retorno de proyectos de IA." },
    { titulo: "Caso real de transformación digital en cementera — Holcim", url: "https://www.holcim.com.ec/", tipo: "lectura", descripcion: "Sitio de Holcim Ecuador con casos de transformación digital en producción." },
  ],
};

// ─── Definición de los nombres de módulos M2-M8 ─────────────────────────────

const MOD2 = "ChatGPT — Dominio profesional";
const MOD3 = "Claude — Análisis avanzado";
const MOD4 = "Optimización de producción con IA";
const MOD5 = "Mantenimiento predictivo con IA";
const MOD6 = "Control de calidad con IA";
const MOD7 = "Cadena de suministro inteligente";
const MOD8 = "Integración y proyecto final aplicado";

// ─── Array completo de los 40 temas ─────────────────────────────────────────

export const STEVEEN_TEMAS: TemaProSteveen[] = [
  // M1 (5 temas reales)
  tema1,
  tema2,
  tema3,
  tema4,
  tema5,

  // M2 — ChatGPT — Dominio profesional
  {
    id: 6,
    titulo: "Interfaz, modelos y configuración de ChatGPT Plus",
    modulo: MOD2,
    moduloNum: 2,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "ChatGPT Plus para ingenieros industriales — configuración y modelos",
    videoDuracion: "~50 min · Español",
    slidesUrl: "",
    teoria: `ChatGPT Plus es la herramienta más usada por ingenieros industriales en 2026 para tareas de análisis, redacción y automatización. Dominar su interfaz y configuración no es trivial: elegir el modelo equivocado o ignorar funciones clave puede significar gastar el doble de tiempo y dinero. Este tema cubre todo lo que necesitas saber para usar ChatGPT Plus como un profesional desde el primer día.

La interfaz de ChatGPT Plus tiene cinco áreas clave. El selector de modelo (arriba a la izquierda) te permite cambiar entre GPT-4o, GPT-4o mini, GPT-4 Turbo y o1. El panel lateral izquierdo almacena el historial de conversaciones y te permite crear proyectos (Projects) con instrucciones persistentes. El área central es el chat. La barra inferior tiene los botones de adjuntar archivos, activar búsqueda web y ejecutar código. El menú de perfil (abajo izquierda) tiene las configuraciones de privacidad, memoria y plan.

Los modelos disponibles en 2026 y cuándo usar cada uno. GPT-4o es el modelo principal: balance óptimo entre velocidad, calidad y costo. Úsalo para el 80% de tus tareas: análisis de datos, reportes, redacción técnica, emails. GPT-4o mini es más rápido y barato pero menos preciso en razonamiento complejo: úsalo para tareas simples y repetitivas. GPT-4 Turbo tiene ventana de contexto de 128k tokens: úsalo cuando necesites procesar documentos largos. o1 y o1-mini son modelos de razonamiento profundo: úsalos para problemas complejos de matemáticas, ingeniería o programación donde necesitas razonamiento paso a paso.

La función de memoria (Memory) merece configuración deliberada. Cuando está activa, ChatGPT recuerda información de conversaciones anteriores: tu empresa, tu rol, tus preferencias de formato. Para un ingeniero industrial, configurar la memoria con contexto profesional ahorra minutos en cada conversación. Prompt recomendado para activar memoria útil: "Recuerda que soy ingeniero industrial en una planta de alimentos en Ecuador, trabajo con Excel y Power BI, y prefiero respuestas directas con listas numeradas". Con este contexto activo, cada respuesta llega preconfigurada para tu perfil.

Los Custom Instructions son el equivalente a un system prompt persistente sin necesidad de repetirlo en cada conversación. Se configuran en Settings → Custom Instructions y tienen dos campos: "What would you like ChatGPT to know about you?" y "How would you like ChatGPT to respond?". Para el primer campo, incluye tu rol, industria, herramientas que usas y contexto de Ecuador. Para el segundo, especifica formato preferido (listas, tablas), nivel de detalle, si quieres ejemplos locales, y si prefieres que cuestione tus suposiciones.

La función de subir archivos (paperclip) acepta Excel, PDF, CSV, imágenes, Word y PowerPoint. Para el ingeniero industrial esto es transformador: sube tu reporte de producción en Excel y pide análisis estadístico; sube el manual del equipo en PDF y pide resumen de procedimientos de mantenimiento; sube una foto de un medidor y pide interpretación del valor. La limitación a conocer: el análisis de Excel con muchas hojas o fórmulas complejas puede fallar; para esos casos, exporta a CSV primero.

La función de búsqueda web (Browse) busca información actualizada en internet antes de responder. Actívala cuando necesites datos recientes: precios actuales de insumos, normativas vigentes, casos de uso nuevos. No la actives para análisis de tus propios documentos ya que ralentiza la respuesta. La función Code Interpreter ejecuta Python en un sandbox y puede hacer cálculos estadísticos, generar gráficas y procesar archivos. Para el ingeniero industrial es útil para análisis de datos que superan las capacidades de Excel.

La seguridad de datos en ChatGPT Plus es un tema crítico. OpenAI usa por defecto las conversaciones para mejorar modelos, pero permite desactivarlo en Settings → Data Controls → Improve the model for everyone. Si trabajas con datos de clientes, proveedores o información confidencial de la empresa, desactiva este toggle SIEMPRE. Para datos realmente sensibles bajo LOPDP, evalúa Claude API con acuerdo empresarial o herramientas autohospedadas.`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "ChatGPT Plus: interfaz, modelos y configuración\nMódulo 2 — Tema 1\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "5 áreas de la interfaz", contenido: "1. Selector de modelo (arriba izquierda)\n2. Panel lateral: historial + Projects\n3. Chat central\n4. Barra inferior: archivos, web, código\n5. Menú perfil: privacidad, memoria, plan" },
      { titulo: "Cuándo usar cada modelo", contenido: "GPT-4o: 80% de tareas (reportes, análisis, emails)\nGPT-4o mini: tareas simples y repetitivas\nGPT-4 Turbo: documentos largos (128k tokens)\no1: razonamiento profundo matemático o de ingeniería" },
      { titulo: "Memoria (Memory)", contenido: "Recuerda contexto entre conversaciones.\n\nPrompt recomendado:\n'Soy ingeniero industrial en planta de alimentos Ecuador, uso Excel y Power BI, prefiero listas numeradas.'" },
      { titulo: "Custom Instructions", contenido: "System prompt persistente en Settings.\n\nCampo 1: quién eres + industria + herramientas\nCampo 2: formato preferido + nivel detalle + ejemplos locales" },
      { titulo: "Subir archivos", contenido: "Acepta: Excel, PDF, CSV, imágenes, Word, PowerPoint\n\nTip: exporta Excel complejo a CSV antes de subir.\nUso: reportes, manuales, fotos de medidores." },
      { titulo: "Browse + Code Interpreter", contenido: "Browse: datos actualizados de internet. Actívalo para precios, normativas, casos nuevos.\n\nCode Interpreter: Python en sandbox. Estadísticas y gráficas que Excel no puede." },
      { titulo: "Seguridad de datos", contenido: "Settings → Data Controls → desactiva 'Improve the model'\n\nObligatorio si trabajas con datos de clientes o proveedores.\nDatos sensibles LOPDP: evalúa Claude API o autohospedado." },
    ],
    quiz: [
      { pregunta: "¿Qué modelo de ChatGPT deberías usar para analizar un problema matemático complejo de programación lineal?", opciones: ["GPT-4o mini", "o1 o o1-mini", "Browse web", "GPT-3.5"], respuesta: 1, explicacion: "o1 y o1-mini son modelos de razonamiento profundo diseñados para problemas matemáticos complejos." },
      { pregunta: "¿Dónde se configuran las instrucciones persistentes que ChatGPT recuerda en cada sesión?", opciones: ["En el primer mensaje de cada chat", "En Settings → Custom Instructions", "En el selector de modelo", "No es posible configurar instrucciones persistentes"], respuesta: 1, explicacion: "Custom Instructions en Settings permite definir contexto y preferencias que persisten en todas las conversaciones." },
      { pregunta: "Para procesar un Excel con 50.000 filas y calcular estadísticas descriptivas, ¿qué función de ChatGPT deberías activar?", opciones: ["Browse (búsqueda web)", "Memory", "Code Interpreter", "Custom Instructions"], respuesta: 2, explicacion: "Code Interpreter ejecuta Python en un sandbox y puede procesar archivos grandes y calcular estadísticas." },
      { pregunta: "Si tu empresa maneja datos de clientes y quieres usar ChatGPT, ¿qué configuración es obligatoria?", opciones: ["Activar la memoria", "Desactivar 'Improve the model for everyone' en Data Controls", "Usar solo GPT-4o mini", "Activar Browse siempre"], respuesta: 1, explicacion: "Desactivar el entrenamiento con tus datos protege la confidencialidad de información de clientes bajo LOPDP." },
      { pregunta: "¿Cuál es la ventaja principal de exportar un Excel complejo a CSV antes de subirlo a ChatGPT?", opciones: ["El archivo pesa más", "Evita fallos con fórmulas y hojas múltiples que ChatGPT no puede interpretar bien", "CSV es más seguro", "No hay ventaja"], respuesta: 1, explicacion: "ChatGPT puede fallar al analizar Excel con fórmulas complejas o múltiples hojas; CSV es texto plano sin ambigüedad." },
    ],
    ejercicio: {
      titulo: "Configuración profesional de ChatGPT Plus",
      objetivo: "Configurar ChatGPT Plus con Custom Instructions y Memory adaptados a tu rol como ingeniero industrial, y ejecutar 5 tareas reales documentando calidad y tiempo",
      herramientas: "ChatGPT Plus + Google Sheets para registro de resultados",
      pasos: [
        "Acceder a Settings → Custom Instructions y configurar el Campo 1 con: rol, industria, empresa (o tipo de empresa), herramientas que usas, país",
        "Configurar Campo 2 con: formato preferido, nivel de detalle, preferencia de ejemplos locales, si quieres que cuestione tus suposiciones",
        "Ir a Settings → Data Controls y verificar la configuración de privacidad para tus datos",
        "Ejecutar tarea 1: subir un archivo Excel de producción real (o crear uno de ejemplo) y pedir análisis de 5 KPIs clave",
        "Ejecutar tarea 2: pedir un reporte de turno de producción a partir de datos que ingresas en el chat",
        "Ejecutar tarea 3: usar Browse para buscar el precio actual de un insumo que uses en tu trabajo",
        "Ejecutar tarea 4: usar Code Interpreter para generar un gráfico de tendencia con datos de calidad",
        "Ejecutar tarea 5: pedir un análisis de causa raíz de un incidente real o ficticio",
        "Registrar en Google Sheets: tarea, modelo usado, tiempo, calidad 1-10, observaciones",
      ],
      resultado: "ChatGPT Plus configurado con Custom Instructions profesionales, 5 tareas ejecutadas con registro de calidad y tiempo, y reflexión de 150 palabras sobre qué funciones tienen más ROI para tu rol",
      criterios: [
        { criterio: "Custom Instructions completas y específicas para tu rol", puntos: 20 },
        { criterio: "Configuración correcta de privacidad (Data Controls)", puntos: 15 },
        { criterio: "5 tareas ejecutadas con distintos modelos/funciones", puntos: 35 },
        { criterio: "Registro documentado con calidad y tiempo", puntos: 15 },
        { criterio: "Reflexión de ROI por función", puntos: 15 },
      ],
    },
    recursos: [
      { titulo: "OpenAI — ChatGPT Plus Features", url: "https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus", tipo: "documentacion", descripcion: "Documentación oficial de OpenAI sobre todas las funciones de ChatGPT Plus." },
      { titulo: "ChatGPT Custom Instructions — Guide", url: "https://openai.com/blog/custom-instructions-for-chatgpt", tipo: "documentacion", descripcion: "Guía oficial de OpenAI sobre cómo configurar Custom Instructions." },
      { titulo: "ChatGPT Plus", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "Acceso a ChatGPT Plus con todos los modelos y funciones avanzadas." },
    ],
  },
  {
    id: 7,
    titulo: "Metodología CRTF para prompts efectivos",
    modulo: MOD2,
    moduloNum: 2,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Metodología CRTF — Prompts industriales que funcionan",
    videoDuracion: "~55 min · Español",
    slidesUrl: "",
    teoria: `Un prompt mal escrito es la causa número uno de resultados decepcionantes con ChatGPT. La mayoría de ingenieros industriales escribe prompts como si estuviera enviando un mensaje de WhatsApp. El resultado: respuestas genéricas que hay que corregir manualmente, perdiendo más tiempo del que ahorran. La metodología CRTF cambia eso: es un framework de cuatro componentes que produce prompts reproducibles y profesionales.

CRTF son las iniciales de Contexto, Rol, Tarea y Formato. Son los cuatro elementos mínimos necesarios para que ChatGPT entienda exactamente qué necesitas y lo entregue de la manera que lo puedes usar directamente. No es el único framework de prompting (el más conocido es el RISEN, hay también el COSTAR), pero es el más práctico para el contexto industrial ecuatoriano porque se puede aprender en 30 minutos y aplicar de inmediato.

Componente 1 — Contexto. Es la información de fondo que ChatGPT necesita conocer para dar una respuesta relevante. Sin contexto, el modelo asume una situación genérica y produce respuestas genéricas. Con contexto específico, produce respuestas que aplican directamente a tu situación. Buen contexto para un ingeniero industrial incluye: sector (alimentos, textil, plásticos, metalmecánica), tamaño de empresa (PYME, mediana, grande), herramientas disponibles (Excel, SAP, Power BI), país y normativas aplicables (INEN, ISO, FDA si exporta). Ejemplo: "Trabajo en una planta de lácteos en Cayambe, Ecuador. Producimos 50.000 litros diarios de leche pasteurizada. Tenemos datos de producción en Excel de los últimos 2 años y usamos NORMA INEN para calidad."

Componente 2 — Rol. Define qué experto debe ser ChatGPT para esta tarea. El rol activa patrones de conocimiento específicos en el modelo. Sin rol, el modelo actúa como asistente general. Con rol específico, actúa como el experto que necesitas. Para ingeniería industrial los roles más útiles son: "experto en Lean Manufacturing con experiencia en manufactura de alimentos", "consultor de mantenimiento predictivo especializado en PYMES industriales latinoamericanas", "analista de cadena de suministro con expertise en exportación ecuatoriana". La especificidad del rol importa: "experto en manufactura" produce respuesta distinta a "experto en manufactura de lácteos en Ecuador bajo normas INEN".

Componente 3 — Tarea. Es el verbo de acción específico: qué debe hacer ChatGPT exactamente. El error más frecuente es la tarea vaga ("ayúdame con", "dime sobre", "explícame"). Las tareas específicas tienen un verbo de acción preciso y un objeto claro: "Analiza los siguientes datos de producción y calcula el OEE", "Redacta un procedimiento SOP para la limpieza de la pasteurizadora según INEN 9", "Identifica los 5 principales factores que podrían estar causando el aumento de defectos en la semana 43". La tarea específica reduce drásticamente las iteraciones necesarias para obtener un resultado útil.

Componente 4 — Formato. Define cómo debe presentarse la respuesta. Sin especificar formato, ChatGPT elige uno por defecto que puede no ser el que necesitas. Los formatos más útiles en ingeniería industrial: tabla (para comparativas, datos estructurados), lista numerada (para pasos de procedimiento, causas priorizadas), JSON (para datos a importar a otros sistemas), correo (para comunicaciones formales), informe ejecutivo (para presentar a gerencia), código Python (para análisis que luego ejecutas). Especifica también límites de longitud cuando importa: "máximo 200 palabras", "no más de 5 puntos", "en una sola página A4".

El prompt CRTF completo combina los cuatro componentes en un bloque coherente. Ejemplo industrial completo: "CONTEXTO: Soy supervisor de producción en una planta de conservas de palmito en Santo Domingo, Ecuador. Esta semana tuvimos 3 incidentes de contaminación detectados en control de calidad, con un total de 450 kg de producto rechazado. Los datos de temperatura de cocción estuvieron entre 78-82°C cuando el estándar es 85-90°C. TAREA: Analiza la situación y genera un análisis de causa raíz preliminar usando la metodología 5 Porqués. ROL: Eres un experto en control de calidad alimentaria con experiencia en HACCP y normativas del Arcsa Ecuador. FORMATO: Entrega el análisis en una tabla con 3 columnas: Nivel del Porqué, Causa Identificada, Evidencia o Dato que la Sustenta. Máximo 5 niveles." Este prompt produce un resultado profesional en el primer intento.

La iteración es parte del proceso, no un fallo. Incluso con un prompt CRTF bien estructurado, la primera respuesta puede necesitar ajuste. La técnica de iteración eficiente: en lugar de reescribir el prompt completo, agrega una instrucción específica: "La respuesta anterior está bien pero necesito que la tabla incluya también una columna de Acción Correctiva Recomendada". O: "Bien, ahora redacta esto mismo pero como un informe formal de una página para presentar a la gerencia general". Cada iteración parte del contexto ya establecido, por lo que es mucho más eficiente que empezar de cero.`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Metodología CRTF para prompts industriales\nMódulo 2 — Tema 2\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "CRTF: los 4 componentes", contenido: "C — Contexto: información de fondo específica\nR — Rol: qué experto debe ser ChatGPT\nT — Tarea: verbo de acción preciso + objeto claro\nF — Formato: cómo entregar la respuesta" },
      { titulo: "C — Contexto", contenido: "Sin contexto: respuesta genérica.\nCon contexto: respuesta aplicable directamente.\n\nIncluye: sector, tamaño, herramientas, país, normativas.\n\nEjemplo: 'Planta lácteos Cayambe, 50k litros/día, Excel 2 años, INEN.'" },
      { titulo: "R — Rol", contenido: "Activa patrones de conocimiento específicos.\n\nGenérico: 'experto en manufactura'\nEspecífico: 'experto en manufactura de lácteos en Ecuador bajo normas INEN'\n\nLa especificidad del rol cambia la calidad de la respuesta." },
      { titulo: "T — Tarea", contenido: "Verbo preciso + objeto claro.\n\nMal: 'ayúdame con el OEE'\nBien: 'Analiza los siguientes datos y calcula el OEE descompuesto en Disponibilidad, Rendimiento y Calidad'\n\nTarea específica = menos iteraciones." },
      { titulo: "F — Formato", contenido: "Tabla, lista numerada, JSON, correo, informe, código Python.\n\nEspecifica límites: 'máximo 200 palabras', '5 puntos', 'una página A4'.\n\nSin formato → ChatGPT elige → puede no ser lo que necesitas." },
      { titulo: "Prompt CRTF completo — ejemplo", contenido: "CONTEXTO: supervisor planta conservas palmito Santo Domingo, 3 incidentes, 450 kg rechazados, temp 78-82°C (estándar 85-90°C).\nROL: experto calidad alimentaria HACCP + Arcsa Ecuador.\nTAREA: análisis causa raíz 5 Porqués.\nFORMATO: tabla 3 columnas, máximo 5 niveles." },
      { titulo: "Iteración eficiente", contenido: "No reescribas el prompt completo.\n\nAgrega instrucción específica:\n'Bien, ahora agrega columna de Acción Correctiva'\n'Redacta como informe formal para gerencia'\n\nEl contexto ya está establecido." },
    ],
    quiz: [
      { pregunta: "¿Qué componente del CRTF define qué experto debe ser ChatGPT?", opciones: ["Contexto", "Rol", "Tarea", "Formato"], respuesta: 1, explicacion: "El Rol activa patrones de conocimiento específicos en el modelo, produciendo respuestas más especializadas." },
      { pregunta: "¿Cuál es el error más frecuente en el componente Tarea de un prompt industrial?", opciones: ["Usar lenguaje técnico", "Escribir la tarea de forma vaga ('ayúdame con', 'dime sobre')", "Especificar el sector", "Definir el formato"], respuesta: 1, explicacion: "Las tareas vagas producen respuestas genéricas. Un verbo de acción preciso + objeto claro reduce iteraciones drásticamente." },
      { pregunta: "Un ingeniero pide un análisis de proveedores. ¿Qué formato es más útil para comparar 5 proveedores en 4 criterios?", opciones: ["Correo formal", "Tabla comparativa", "Código Python", "Lista de viñetas sin estructura"], respuesta: 1, explicacion: "Una tabla con proveedores en filas y criterios en columnas permite comparación directa y es fácil de presentar." },
      { pregunta: "Después de recibir una respuesta buena pero incompleta en ChatGPT, ¿cuál es la técnica de iteración más eficiente?", opciones: ["Cerrar el chat y empezar uno nuevo", "Agregar una instrucción específica en el mismo chat sin reescribir el contexto", "Cambiar de modelo", "Copiar la respuesta y editarla manualmente"], respuesta: 1, explicacion: "El contexto ya está establecido en el chat. Una instrucción adicional específica es mucho más rápida que empezar de cero." },
      { pregunta: "¿Qué incluye un buen Contexto en un prompt para ingeniería industrial en Ecuador?", opciones: ["Solo el nombre de la empresa", "Sector, tamaño, herramientas, país y normativas aplicables", "Solo el problema a resolver", "El nombre del ingeniero"], respuesta: 1, explicacion: "Contexto específico con sector, herramientas y normativas locales permite a ChatGPT producir respuestas directamente aplicables." },
    ],
    ejercicio: {
      titulo: "Biblioteca personal de 10 prompts CRTF industriales",
      objetivo: "Crear una biblioteca de 10 prompts CRTF para tus tareas más repetitivas, probados en ChatGPT con evaluación de calidad",
      herramientas: "ChatGPT Plus + Google Sheets o Notion para la biblioteca",
      datosEjemplo: "Tareas candidatas: reporte de producción diario, análisis de causa raíz, evaluación de proveedores, SOP de procedimiento, análisis de datos de calidad, comunicación a gerencia, análisis de KPIs, plan de mejora, diagnóstico de proceso, capacitación de operadores.",
      pasos: [
        "Identificar 10 tareas repetitivas semanales que actualmente te toman más de 30 minutos",
        "Para cada tarea, escribir el prompt CRTF completo con los 4 componentes claramente marcados",
        "Probar cada prompt en ChatGPT y evaluar la respuesta: calidad 1-10, utilidad inmediata SÍ/NO",
        "Para los prompts con calidad < 7, identificar qué componente CRTF es débil y reescribirlo",
        "Iterar hasta que todos los prompts tengan calidad >= 8",
        "Organizar la biblioteca en Google Sheets con columnas: Nombre, Contexto, Rol, Tarea, Formato, Calidad, Tiempo ahorrado estimado",
        "Calcular el ROI total: horas ahorradas × costo hora ingeniero × 4 semanas al mes",
      ],
      resultado: "Biblioteca de 10 prompts CRTF validados con calidad >= 8, organizados en Google Sheets con cálculo de ROI mensual",
      criterios: [
        { criterio: "10 prompts con los 4 componentes CRTF explícitos", puntos: 30 },
        { criterio: "Evidencia de prueba y iteración (calidad antes/después)", puntos: 25 },
        { criterio: "Todos los prompts con calidad >= 8 en ChatGPT", puntos: 25 },
        { criterio: "Biblioteca organizada con cálculo de ROI mensual", puntos: 20 },
      ],
    },
    recursos: [
      { titulo: "Prompt Engineering Guide — OpenAI", url: "https://platform.openai.com/docs/guides/prompt-engineering", tipo: "documentacion", descripcion: "Guía oficial de OpenAI con técnicas de prompting verificadas." },
      { titulo: "Learn Prompting — Guía completa", url: "https://learnprompting.org/docs/intro", tipo: "documentacion", descripcion: "Recurso gratuito y completo sobre técnicas de prompt engineering con ejemplos." },
      { titulo: "ChatGPT Plus", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "Plataforma para probar y validar los prompts de la biblioteca." },
    ],
  },
  {
    id: 8,
    titulo: "Análisis de datos de producción con ChatGPT",
    modulo: MOD2,
    moduloNum: 2,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Análisis de datos industriales con ChatGPT — Excel, CSV y estadísticas",
    videoDuracion: "~60 min · Español",
    slidesUrl: "",
    teoria: `El análisis de datos de producción es una de las tareas más demandantes del ingeniero industrial: consume horas semanales en Excel, requiere criterio estadístico y termina en reportes que nadie lee porque no dicen nada concreto. ChatGPT transforma este flujo: en lugar de construir fórmulas manualmente y redactar conclusiones a mano, el ingeniero sube el archivo, hace la pregunta correcta y obtiene análisis estadístico, visualizaciones y conclusiones accionables en minutos.

El flujo de análisis de datos con ChatGPT tiene cinco pasos. Paso 1: preparar el archivo. Un Excel limpio con una fila de encabezados claros y sin celdas fusionadas es todo lo que necesitas. Si el archivo tiene múltiples hojas, es mejor separar la hoja de datos a analizar en un CSV independiente. Paso 2: subir el archivo. Usa el botón de adjunto en la barra inferior de ChatGPT Plus. Paso 3: escribir el primer prompt de exploración. "Analiza este archivo y dime qué información contiene, cuántas filas y columnas hay, y qué análisis podrías hacer con estos datos". Paso 4: solicitar el análisis específico con un prompt CRTF. Paso 5: iterar con preguntas de profundización.

Los tipos de análisis que ChatGPT puede hacer con datos industriales son más amplios de lo que la mayoría imagina. Estadística descriptiva: promedio, mediana, desviación estándar, máximos y mínimos de cualquier variable. Análisis de tendencias: "¿hay una tendencia de aumento o disminución en la producción de las últimas 8 semanas?". Comparativas entre períodos: "¿cómo se compara la eficiencia del turno mañana vs tarde vs noche?". Detección de anomalías: "¿hay valores atípicos en los datos de temperatura que superen 3 desviaciones estándar del promedio?". Correlaciones simples: "¿existe relación entre la humedad ambiental y el número de defectos de soldadura?". Pareto de causas: "ordena las causas de paro de máquina de mayor a menor frecuencia e identifica el 20% que causa el 80% del tiempo perdido".

Las visualizaciones son el área donde ChatGPT brilla especialmente para presentaciones ejecutivas. Con Code Interpreter activo, puede generar gráficos de control, histogramas, diagramas de dispersión, gráficas de tendencia y Pareto directamente como imágenes descargables. El prompt tipo: "Genera un gráfico de líneas con la producción diaria de las últimas 6 semanas, incluye una línea de tendencia y marca los días donde la producción fue más de 10% inferior al promedio. Usa colores azul y naranja". El resultado es una imagen lista para pegar en una presentación de PowerPoint.

Para datos de calidad, el flujo es especialmente poderoso. Si tienes un Excel con: fecha, turno, operador, número de piezas producidas, número de defectos, tipo de defecto, ChatGPT puede calcular el porcentaje de defectos por período, identificar el turno con mayor tasa de defectos, determinar el tipo de defecto más frecuente, calcular si la tasa de defectos supera el límite de control y redactar el análisis completo de causa raíz preliminar. Lo que antes tomaba 4 horas ahora toma 20 minutos, con mejor presentación y más profundidad estadística.

Limitaciones que el ingeniero debe conocer para no confiar ciegamente. Primero: ChatGPT puede cometer errores en cálculos estadísticos complejos (especialmente con fórmulas no estándar o datos con muchos valores nulos). Siempre verifica los cálculos críticos en Excel o Minitab independientemente. Segundo: el análisis de series de tiempo complejas (ARIMA, estacionalidad múltiple) puede ser impreciso; para esos casos usa Python directamente. Tercero: ChatGPT no tiene memoria entre sesiones a menos que la actives, así que si cierras el chat y abres uno nuevo, deberás volver a subir el archivo.

El prompt maestro para análisis de datos de producción que funciona en el 90% de los casos industriales: "CONTEXTO: [describe tu planta, producto, período de los datos]. ARCHIVO: adjunto el Excel con datos de producción de [período]. ROL: eres un analista industrial experto en estadística de procesos manufactureros. TAREA: Analiza los datos y entrega: 1) Estadísticas descriptivas de las variables principales, 2) Identificación de las 3 tendencias más relevantes, 3) Detección de anomalías o valores atípicos, 4) Top 3 problemas identificados con su impacto en porcentaje, 5) Recomendaciones específicas y accionables. FORMATO: Usa encabezados claros, tablas para los datos numéricos, y un párrafo ejecutivo de máximo 100 palabras al inicio con el resumen del hallazgo más importante."`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Análisis de datos de producción con ChatGPT\nMódulo 2 — Tema 3\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "5 pasos del flujo de análisis", contenido: "1. Preparar archivo (Excel limpio, encabezados claros, sin celdas fusionadas)\n2. Subir archivo a ChatGPT\n3. Prompt de exploración inicial\n4. Prompt CRTF de análisis específico\n5. Iterar con preguntas de profundización" },
      { titulo: "Tipos de análisis disponibles", contenido: "• Estadística descriptiva (promedio, mediana, desviación, máximos)\n• Tendencias por período\n• Comparativas por turno/operador/línea\n• Detección de anomalías (>3 desviaciones)\n• Correlaciones simples\n• Pareto de causas" },
      { titulo: "Visualizaciones con Code Interpreter", contenido: "Gráficos de control, histogramas, dispersión, tendencia, Pareto.\n\nPrompt: 'Genera gráfico de líneas de producción 6 semanas con tendencia y días -10% marcados. Azul y naranja.'\n\nImagen descargable lista para PowerPoint." },
      { titulo: "Flujo para datos de calidad", contenido: "Excel: fecha, turno, operador, producción, defectos, tipo defecto.\n\nChatGPT entrega: % defectos por período, turno con mayor tasa, tipo más frecuente, análisis causa raíz preliminar.\n\n4 horas → 20 minutos." },
      { titulo: "Limitaciones críticas", contenido: "1. Verifica cálculos estadísticos críticos en Excel/Minitab\n2. Series de tiempo complejas (ARIMA): usa Python directamente\n3. Sin memoria entre sesiones: vuelve a subir el archivo en chats nuevos" },
      { titulo: "Prompt maestro industrial", contenido: "CONTEXTO: planta, producto, período\nROL: analista industrial experto en estadística\nTAREA: 1) descriptivas, 2) tendencias, 3) anomalías, 4) top 3 problemas, 5) recomendaciones\nFORMATO: encabezados + tablas + párrafo ejecutivo 100 palabras" },
    ],
    quiz: [
      { pregunta: "¿Por qué se recomienda exportar a CSV antes de subir un Excel complejo a ChatGPT?", opciones: ["CSV es más moderno", "Evita errores con fórmulas y múltiples hojas que ChatGPT no interpreta bien", "ChatGPT no acepta Excel", "CSV tiene más datos"], respuesta: 1, explicacion: "ChatGPT puede fallar con fórmulas complejas y múltiples hojas; CSV es texto plano sin ambigüedad." },
      { pregunta: "¿Qué función de ChatGPT Plus permite generar gráficos de producción como imágenes descargables?", opciones: ["Custom Instructions", "Browse web", "Code Interpreter", "Memory"], respuesta: 2, explicacion: "Code Interpreter ejecuta Python para generar visualizaciones como imágenes descargables." },
      { pregunta: "Para un Pareto de causas de paro de máquina, ¿qué debe incluir el CRTF de Tarea?", opciones: ["Solo 'hazme un Pareto'", "'Ordena las causas de mayor a menor frecuencia e identifica el 20% que causa el 80% del tiempo perdido'", "Solo cargar el archivo", "'Dibuja una gráfica bonita'"], respuesta: 1, explicacion: "La tarea específica con el criterio 80/20 produce el análisis Pareto correcto y accionable." },
      { pregunta: "¿Cuándo NO deberías confiar ciegamente en los resultados estadísticos de ChatGPT?", opciones: ["Nunca, ChatGPT siempre tiene razón", "Cuando el cálculo es crítico para una decisión importante o involucra fórmulas no estándar", "Solo cuando el archivo tiene menos de 100 filas", "Solo en domingos"], respuesta: 1, explicacion: "Los cálculos estadísticos críticos siempre deben verificarse en Excel o Minitab de forma independiente." },
      { pregunta: "En el prompt maestro industrial para análisis de datos, ¿cuántas áreas de entrega se especifican en la Tarea?", opciones: ["1", "3", "5", "10"], respuesta: 2, explicacion: "El prompt maestro especifica 5 entregables: estadísticas descriptivas, tendencias, anomalías, top 3 problemas y recomendaciones." },
    ],
    ejercicio: {
      titulo: "Análisis completo de datos de producción con ChatGPT",
      objetivo: "Analizar un dataset real de producción industrial con ChatGPT y generar un reporte ejecutivo con hallazgos, visualizaciones y recomendaciones accionables",
      herramientas: "ChatGPT Plus (Code Interpreter activo) + Excel o CSV con datos reales o de ejemplo",
      datosEjemplo: "Si no tienes datos propios, descarga el dataset de ejemplo en: https://github.com/datasets/manufacturing (o crea uno con: fecha, turno, línea, unidades producidas, unidades defectuosas, tiempo de paro en minutos, causa de paro) con al menos 90 filas (3 meses de datos diarios).",
      pasos: [
        "Preparar o conseguir dataset industrial con mínimo 90 filas y 5+ variables",
        "Limpiar el archivo: encabezados claros, sin celdas fusionadas, exportar a CSV",
        "Subir a ChatGPT y ejecutar el prompt de exploración inicial",
        "Ejecutar el prompt maestro industrial completo con CRTF",
        "Solicitar 3 visualizaciones: tendencia de producción, Pareto de causas de paro, comparativa por turno",
        "Descargar las imágenes generadas y evaluar su calidad",
        "Pedir el análisis de anomalías y correlaciones",
        "Compilar el reporte final en Google Docs: párrafo ejecutivo, tablas, gráficos, recomendaciones",
        "Evaluar tiempo total vs tiempo que tomaría sin ChatGPT",
      ],
      resultado: "Reporte ejecutivo de 2-3 páginas con estadísticas descriptivas, 3 visualizaciones, anomalías detectadas y 5 recomendaciones accionables, más registro del tiempo total del análisis",
      criterios: [
        { criterio: "Dataset preparado correctamente y subido", puntos: 15 },
        { criterio: "Prompt maestro CRTF bien estructurado", puntos: 20 },
        { criterio: "3 visualizaciones generadas y descargadas", puntos: 20 },
        { criterio: "Reporte ejecutivo completo con hallazgos verificados", puntos: 30 },
        { criterio: "Registro del tiempo ahorrado vs método tradicional", puntos: 15 },
      ],
    },
    recursos: [
      { titulo: "ChatGPT Data Analysis — OpenAI docs", url: "https://help.openai.com/en/articles/8555545-file-uploads-faq", tipo: "documentacion", descripcion: "FAQ oficial sobre análisis de archivos y Code Interpreter en ChatGPT." },
      { titulo: "Datasets industriales de ejemplo — Kaggle", url: "https://www.kaggle.com/datasets?search=manufacturing", tipo: "herramienta", descripcion: "Datasets reales de manufactura para practicar análisis con ChatGPT." },
      { titulo: "ChatGPT Plus", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "Plataforma con Code Interpreter para análisis de datos y generación de gráficos." },
    ],
  },
  {
    id: 9,
    titulo: "Reportes y documentación automatizada",
    modulo: MOD2,
    moduloNum: 2,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Automatizar reportes industriales con ChatGPT — de 2 horas a 10 minutos",
    videoDuracion: "~55 min · Español",
    slidesUrl: "",
    teoria: `La generación de reportes es la tarea que más tiempo consume y menos valor agrega en la operación industrial típica. Un supervisor de producción en Ecuador gasta entre 2 y 4 horas semanales construyendo reportes que en su mayoría repiten la misma estructura con datos distintos. ChatGPT puede generar el 80% de ese reporte en menos de 5 minutos si tienes los datos estructurados y el prompt correcto.

Existen cinco tipos de reportes industriales que ChatGPT automatiza con alta calidad. Primero, el reporte de turno: resumen de producción, incidentes, novedades y pendientes de un turno específico. Segundo, el informe de causa raíz: análisis estructurado de un incidente con evidencias, causas raíz identificadas y acciones correctivas. Tercero, el reporte ejecutivo de KPIs: presentación de indicadores clave para gerencia con comparativa vs meta y período anterior. Cuarto, el procedimiento SOP: instrucciones paso a paso para un proceso específico con formato estándar. Quinto, el informe de auditoría: reporte de hallazgos de una auditoría interna con no conformidades, evidencias y planes de acción.

El flujo de automatización de reportes tiene tres pasos. Paso 1 — Plantilla maestra: define una vez la estructura del reporte con todos los campos que siempre aparecen. Esta plantilla se convierte en el FORMATO del prompt CRTF. Paso 2 — Datos del período: recopila los datos variables (producción del día, incidentes, KPIs, novedades) en un formato estructurado simple, típicamente una lista de puntos o una tabla en el chat. Paso 3 — Generación: ejecuta el prompt CRTF con la plantilla en el formato y los datos en el contexto.

Ejemplo de prompt para reporte de turno diario: "CONTEXTO: Soy supervisor del turno tarde (14:00-22:00) en la línea 3 de ensamblaje de motores eléctricos, planta Quito. Los datos del turno son: Producción: 342 motores (meta: 380). Paros: 2 paros no planificados de 25 y 40 minutos por falla en prensa hidráulica #2. Calidad: 8 motores rechazados por falla en bobinado. Novedades: el operador García tuvo que salir a las 19:30 por emergencia familiar; cubierto por Rivera. ROL: eres un supervisor industrial con experiencia en documentación de turno según estándares ISO. TAREA: Genera el reporte de turno completo. FORMATO: Usa la estructura estándar: Encabezado (fecha, turno, línea, supervisor), Producción (real vs meta con %), Incidentes (descripción y acción tomada), Calidad (defectos y tipo), Novedades operativas, Pendientes para turno siguiente. Máximo 1 página."

Para reportes de KPIs ejecutivos, la clave es incluir el contexto correcto: los datos del período actual, los datos del período anterior y la meta. ChatGPT puede calcular variaciones porcentuales, identificar tendencias y redactar el párrafo ejecutivo que la gerencia necesita para tomar decisiones. El formato más efectivo para presentaciones ejecutivas en Ecuador: resumen de 3 líneas al inicio (el dato más importante, la variación vs período anterior, y la recomendación clave), seguido de tabla de KPIs, y cierre con próximos pasos.

Los SOPs (Standard Operating Procedures) son documentos que toman entre 4 y 8 horas escribir desde cero. Con ChatGPT, el flujo es: describes el proceso en lenguaje natural (como explicarías a un nuevo operador), especificas el formato ISO estándar que requiere tu empresa, y ChatGPT genera la primera versión completa. Esta primera versión necesita revisión técnica para verificar precisión, pero como punto de partida reduce el tiempo de creación de 8 horas a 2 horas. La revisión del experto es irremplazable; la generación del borrador, no.

La consistencia es el beneficio menos mencionado pero más valioso de la automatización de reportes. Cuando los reportes los genera siempre el mismo prompt con la misma estructura, la información es comparable entre períodos, los supervisores de diferentes turnos usan el mismo formato, y la gerencia puede hacer análisis histórico sin tener que normalizar formatos distintos. Esta consistencia tiene valor económico directo: ahorra tiempo en reuniones de revisión y reduce errores de interpretación.`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Reportes y documentación automatizada\nMódulo 2 — Tema 4\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "5 tipos de reporte automatizable", contenido: "1. Reporte de turno (producción, incidentes, novedades)\n2. Informe de causa raíz\n3. Reporte ejecutivo de KPIs\n4. Procedimiento SOP\n5. Informe de auditoría" },
      { titulo: "Flujo de 3 pasos", contenido: "Paso 1: Plantilla maestra (estructura fija del reporte)\nPaso 2: Datos del período (variables del día/semana)\nPaso 3: Generar con prompt CRTF\n\nDe 2-4 horas → 10 minutos." },
      { titulo: "Prompt reporte de turno", contenido: "CONTEXTO: turno tarde línea 3, 342 motores (meta 380), 2 paros, 8 rechazados, novedad operador\nROL: supervisor industrial ISO\nTAREA: generar reporte completo\nFORMATO: encabezado, producción %, incidentes, calidad, novedades, pendientes. Máx 1 página." },
      { titulo: "KPIs ejecutivos — clave", contenido: "Incluir: período actual + período anterior + meta.\n\nFormato efectivo Ecuador:\n1. Resumen 3 líneas (dato clave, variación, recomendación)\n2. Tabla de KPIs\n3. Próximos pasos" },
      { titulo: "SOPs con ChatGPT", contenido: "Tiempo tradicional: 4-8 horas desde cero.\nCon ChatGPT: describes el proceso en lenguaje natural → ChatGPT genera borrador → revisas y ajustas.\n\nResultado: 8h → 2h. La revisión del experto sigue siendo irremplazable." },
      { titulo: "El beneficio invisible: consistencia", contenido: "Mismo prompt = mismo formato = datos comparables entre períodos.\n\nValor económico: menos tiempo en reuniones, menos errores de interpretación, análisis histórico directo." },
    ],
    quiz: [
      { pregunta: "¿Cuál es el paso 1 del flujo de automatización de reportes?", opciones: ["Generar el reporte directamente", "Definir la plantilla maestra con la estructura fija del reporte", "Recopilar los datos del período", "Contratar un consultor"], respuesta: 1, explicacion: "La plantilla maestra define la estructura fija que se convierte en el FORMATO del prompt CRTF, permitiendo consistencia entre períodos." },
      { pregunta: "Para un reporte ejecutivo de KPIs, ¿qué tres tipos de datos debes incluir en el contexto?", opciones: ["Solo los datos del día actual", "Datos del período actual, período anterior y meta", "Solo la meta y el actual", "Solo los datos históricos de 5 años"], respuesta: 1, explicacion: "Los tres datos permiten a ChatGPT calcular variaciones porcentuales e identificar si la tendencia está mejorando o empeorando vs meta." },
      { pregunta: "¿Cuánto tiempo toma crear un SOP con ChatGPT vs el método tradicional?", opciones: ["Igual que sin ChatGPT", "De 4-8 horas a 2 horas (ChatGPT genera el borrador, experto lo revisa)", "30 segundos sin revisión", "Solo funciona en inglés"], respuesta: 1, explicacion: "ChatGPT genera la primera versión a partir de tu descripción en lenguaje natural; la revisión técnica sigue siendo necesaria pero el tiempo total baja de 8h a 2h." },
      { pregunta: "¿Cuál es el beneficio de consistencia que genera la automatización de reportes?", opciones: ["Los reportes se ven más bonitos", "Los datos son comparables entre períodos porque todos usan la misma estructura", "No hay beneficio de consistencia", "Solo aplica en grandes empresas"], respuesta: 1, explicacion: "La misma plantilla produce formatos comparables que facilitan el análisis histórico y reducen tiempo en reuniones de revisión." },
      { pregunta: "En el formato de reporte ejecutivo para Ecuador, ¿qué va primero?", opciones: ["La tabla completa de KPIs", "Un resumen de 3 líneas con el dato más importante, variación y recomendación clave", "Los gráficos de 5 años", "El nombre del responsable"], respuesta: 1, explicacion: "El resumen ejecutivo de 3 líneas al inicio respeta el tiempo limitado de la gerencia y asegura que el mensaje clave se transmita." },
    ],
    ejercicio: {
      titulo: "Sistema de reportes automatizados para tu planta",
      objetivo: "Crear plantillas de prompt para 3 tipos de reporte de tu área, probarlos con datos reales y medir el tiempo ahorrado vs el método tradicional",
      herramientas: "ChatGPT Plus + Google Docs para las plantillas + cronómetro para medir tiempo",
      pasos: [
        "Identificar 3 reportes que generas semanalmente y que más tiempo te consumen",
        "Para cada reporte, documentar la estructura actual: ¿qué secciones tiene?, ¿qué datos necesita?",
        "Crear la plantilla CRTF para cada reporte con el formato exacto que tu empresa usa",
        "Medir el tiempo que toma generar un reporte de cada tipo con el método actual (cronometrar)",
        "Probar cada prompt con datos reales del último período y medir el tiempo con ChatGPT",
        "Evaluar la calidad: ¿necesita ajustes? ¿hay datos que ChatGPT interpreta mal?",
        "Calcular ahorro de tiempo semanal y mensual en horas y dólares",
        "Documentar las 3 plantillas finales en un archivo compartido para tu equipo",
      ],
      resultado: "3 plantillas de prompt validadas para reportes reales, comparativa de tiempo antes/después, y cálculo de ahorro mensual en horas",
      criterios: [
        { criterio: "3 plantillas CRTF completas y específicas para reportes reales", puntos: 30 },
        { criterio: "Evidencia de prueba con datos reales", puntos: 25 },
        { criterio: "Medición documentada de tiempo antes y después", puntos: 25 },
        { criterio: "Plantillas organizadas para uso del equipo", puntos: 20 },
      ],
    },
    recursos: [
      { titulo: "Plantillas de reporte industrial — ISO 9001", url: "https://www.iso.org/iso-9001-quality-management.html", tipo: "documentacion", descripcion: "Norma ISO 9001 con requisitos de documentación para sistemas de gestión de calidad." },
      { titulo: "ChatGPT Plus", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "Plataforma para generar y probar las plantillas de reportes automatizados." },
      { titulo: "Lean Documentation — Lean Enterprise Institute", url: "https://www.lean.org/", tipo: "lectura", descripcion: "Principios de documentación lean aplicables para simplificar reportes industriales." },
    ],
  },
  {
    id: 10,
    titulo: "Análisis de causa raíz (Ishikawa + 5 Porqués) con ChatGPT",
    modulo: MOD2,
    moduloNum: 2,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Ishikawa y 5 Porqués con ChatGPT — análisis de causa raíz en 20 minutos",
    videoDuracion: "~60 min · Español",
    slidesUrl: "",
    teoria: `El análisis de causa raíz es una de las competencias más valoradas del ingeniero industrial y una de las que más tiempo consume cuando se hace bien. Las dos metodologías más usadas en la industria — el Diagrama de Ishikawa (espina de pescado) y la técnica de los 5 Porqués — son poderosas pero exigen tiempo, facilitación y conocimiento del proceso. ChatGPT puede actuar como co-facilitador del análisis, acelerando el proceso sin reemplazar el criterio del ingeniero.

El Diagrama de Ishikawa organiza las posibles causas de un problema en seis categorías conocidas como las 6M: Mano de obra, Máquina, Método, Material, Medio ambiente y Medición. Para cada categoría, el equipo identifica las causas que podrían contribuir al efecto no deseado. El diagrama resultante tiene forma de espina de pescado: el problema está a la derecha (cabeza), las 6M son las espinas principales, y las causas específicas son las sub-espinas.

La limitación clásica del Ishikawa cuando se hace manualmente es que el equipo tiende a listar causas que ya conoce bien y que confirman lo que ya piensa. ChatGPT rompe este sesgo porque puede sugerir causas que el equipo no había considerado, basándose en miles de casos de análisis de causa raíz de la literatura técnica industrial. El rol correcto de ChatGPT no es hacer el análisis por el equipo, sino expandir el conjunto de hipótesis a investigar.

El prompt para Ishikawa con ChatGPT: "CONTEXTO: Somos una planta de producción de tableros eléctricos en Guayaquil. En la semana 45 tuvimos un incremento del 15% en defectos de soldadura en la línea de ensamblaje de disyuntores de 220V. Las condiciones en esa semana fueron: humedad elevada (87% vs promedio de 72%), dos operadores nuevos en el puesto de soldadura, y se cambió el proveedor de estaño. ROL: eres un ingeniero industrial experto en análisis de causa raíz con experiencia en manufactura de componentes eléctricos. TAREA: Genera un análisis Ishikawa completo con las 6M, listando al menos 3 causas posibles por categoría. Para cada causa, indica si es confirmable con los datos disponibles o si requiere investigación adicional. FORMATO: Tabla con columnas: Categoría (6M), Causa Posible, Nivel de Sospecha (Alto/Medio/Bajo basado en el contexto), Cómo Confirmarla."

Los 5 Porqués es la técnica para profundizar en una causa hasta llegar a la causa raíz sistémica. La regla: preguntar "¿por qué?" al menos 5 veces de forma encadenada, donde cada respuesta se convierte en la pregunta del siguiente nivel. La causa raíz es la que, si se elimina, previene que el problema vuelva a ocurrir. Las causas superficiales solo tratan síntomas.

El prompt para 5 Porqués: "CONTEXTO: Una inspección de calidad encontró 12 tableros eléctricos con soldadura defectuosa en la línea de Guayaquil. Investigación inicial indica que la temperatura de la punta de soldadura era incorrecta. ROL: eres un experto en RCA (Root Cause Analysis) industrial. TAREA: Aplica la técnica de los 5 Porqués comenzando desde 'La temperatura de la punta de soldadura era incorrecta' y llega a la causa raíz sistémica. En cada nivel, evalúa si hay evidencia que confirme la causa antes de avanzar al siguiente porqué. FORMATO: Tabla con columnas: Nivel, Porqué, Hipótesis de Causa, Evidencia Necesaria para Confirmar, ¿Confirmar antes de avanzar? (SÍ/NO)."

La combinación más efectiva es usar Ishikawa para identificar el conjunto completo de hipótesis (evitar el sesgo de confirmación) y luego aplicar 5 Porqués a las hipótesis con mayor nivel de sospecha. ChatGPT puede facilitar ambas etapas en secuencia, creando un análisis que en una reunión tradicional de 3 horas puede completarse en 45 minutos con el mismo rigor metodológico.

El entregable final del análisis de causa raíz debe incluir: descripción del problema con datos cuantitativos, diagrama Ishikawa con nivel de sospecha por causa, análisis 5 Porqués de las 2-3 causas principales, causa raíz identificada con evidencia, acciones correctivas con responsable y fecha, y acciones preventivas para que el problema no vuelva a ocurrir en condiciones similares.`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Análisis de causa raíz con ChatGPT\nMódulo 2 — Tema 5\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "Las dos metodologías", contenido: "Ishikawa (Espina de pescado): organiza causas en 6M\n• Mano de obra, Máquina, Método, Material, Medio ambiente, Medición\n\n5 Porqués: profundiza hasta la causa raíz sistémica\n• Preguntar '¿por qué?' 5 veces encadenados" },
      { titulo: "ChatGPT como co-facilitador", contenido: "No reemplaza el criterio del ingeniero.\nExpande el conjunto de hipótesis evitando sesgo de confirmación.\n\nBasado en miles de casos de RCA de la literatura técnica industrial." },
      { titulo: "Prompt Ishikawa completo", contenido: "CONTEXTO: planta, producto, incidente, condiciones especiales\nROL: experto RCA manufactura específica\nTAREA: 6M con 3+ causas por categoría + nivel de sospecha + cómo confirmar\nFORMATO: tabla 4 columnas" },
      { titulo: "Prompt 5 Porqués", contenido: "CONTEXTO: causa inicial identificada + datos disponibles\nROL: experto en RCA industrial\nTAREA: 5 niveles con evaluación de evidencia en cada nivel\nFORMATO: tabla con nivel, hipótesis, evidencia, ¿confirmar antes de avanzar?" },
      { titulo: "Flujo combinado más efectivo", contenido: "1. Ishikawa → todas las hipótesis (evitar sesgo)\n2. Seleccionar 2-3 con mayor sospecha\n3. 5 Porqués → cada hipótesis seleccionada\n4. Causa raíz con evidencia\n\nReunión 3h → 45 minutos." },
      { titulo: "Entregable final", contenido: "• Problema con datos cuantitativos\n• Ishikawa con nivel de sospecha\n• 5 Porqués de causas principales\n• Causa raíz con evidencia\n• Acciones correctivas (responsable + fecha)\n• Acciones preventivas" },
    ],
    quiz: [
      { pregunta: "¿Cuáles son las 6M del Diagrama de Ishikawa?", opciones: ["Máquina, Material, Método, Mano de obra, Medición, Medio ambiente", "Momento, Mercado, Modelo, Método, Máquina, Meta", "Solo 3M: Máquina, Material, Método", "Las 6M no son parte del Ishikawa"], respuesta: 0, explicacion: "Las 6M clásicas de Ishikawa son: Máquina, Material, Método, Mano de obra, Medición y Medio ambiente." },
      { pregunta: "¿Cuál es el rol correcto de ChatGPT en el análisis de causa raíz?", opciones: ["Reemplazar completamente al equipo de ingeniería", "Confirmar automáticamente la causa raíz sin evidencia", "Expandir el conjunto de hipótesis y evitar el sesgo de confirmación del equipo", "Solo hacer diagramas visuales"], respuesta: 2, explicacion: "ChatGPT actúa como co-facilitador: sugiere causas que el equipo no consideró, pero el ingeniero evalúa y confirma con evidencia." },
      { pregunta: "¿Cuántas veces se pregunta '¿por qué?' en la técnica de los 5 Porqués?", opciones: ["1 vez es suficiente", "Exactamente 5 veces siempre", "Al menos 5 veces hasta llegar a la causa sistémica", "10 veces como mínimo"], respuesta: 2, explicacion: "La técnica pide al menos 5 porqués encadenados; puede requerir más si la causa raíz sistémica no aparece en el quinto nivel." },
      { pregunta: "¿Qué combinación de metodologías es más efectiva para un análisis de causa raíz completo?", opciones: ["Solo Ishikawa", "Solo 5 Porqués", "Ishikawa para generar hipótesis + 5 Porqués para profundizar en las principales", "Ninguna, con experiencia basta"], respuesta: 2, explicacion: "Ishikawa genera el universo de hipótesis evitando sesgo; 5 Porqués profundiza en las más probables hasta la causa raíz sistémica." },
      { pregunta: "¿Qué debe incluir el entregable final de un análisis de causa raíz completo?", opciones: ["Solo la causa raíz identificada", "Problema, Ishikawa, 5 Porqués, causa raíz, acciones correctivas y preventivas", "Solo las acciones correctivas", "Solo el diagrama de Ishikawa"], respuesta: 1, explicacion: "Un RCA completo incluye todos los componentes desde la descripción del problema hasta las acciones preventivas que evitan recurrencia." },
    ],
    ejercicio: {
      titulo: "RCA completo con Ishikawa + 5 Porqués en ChatGPT",
      objetivo: "Realizar un análisis de causa raíz completo de un incidente real o simulado de tu empresa usando Ishikawa y 5 Porqués con ChatGPT como co-facilitador",
      herramientas: "ChatGPT Plus + Google Docs para el entregable final + Lucidchart o Miro para el diagrama visual",
      datosEjemplo: "Incidente ejemplo para usar si no tienes uno propio: 'En una planta de embutidos de Latacunga, en la semana del 14 al 20 de octubre se registraron 180 kg de producto rechazado por temperatura de cocción fuera de especificación (se requiere 72°C por 15 minutos mínimo; en 3 lotes se registró 68-70°C). El rechazo representa el 6.8% de la producción semanal vs el promedio histórico del 1.2%.'",
      pasos: [
        "Seleccionar un incidente real de tu empresa o usar el ejemplo proporcionado",
        "Documentar el problema con datos cuantitativos: magnitud, período, impacto económico",
        "Ejecutar el prompt Ishikawa completo con ChatGPT y evaluar las causas sugeridas",
        "Identificar las 3 causas con mayor nivel de sospecha basándote en el contexto real",
        "Ejecutar el prompt 5 Porqués para cada una de las 3 causas seleccionadas",
        "Identificar la causa raíz sistémica con evidencia disponible",
        "Redactar el plan de acción correctiva con responsable, fecha y indicador de cierre",
        "Redactar las acciones preventivas para condiciones similares",
        "Compilar todo en el entregable final de 2-3 páginas en Google Docs",
      ],
      resultado: "Entregable de RCA completo: problema cuantificado, Ishikawa, 5 Porqués, causa raíz con evidencia, 5+ acciones correctivas y preventivas con responsables y fechas",
      criterios: [
        { criterio: "Problema bien descrito con datos cuantitativos", puntos: 15 },
        { criterio: "Ishikawa con 6M completas y nivel de sospecha", puntos: 25 },
        { criterio: "5 Porqués correctamente encadenado hasta causa raíz sistémica", puntos: 25 },
        { criterio: "Plan de acción completo con responsables y fechas", puntos: 20 },
        { criterio: "Entregable bien organizado y profesional", puntos: 15 },
      ],
    },
    recursos: [
      { titulo: "Root Cause Analysis — ASQ", url: "https://asq.org/quality-resources/root-cause-analysis", tipo: "documentacion", descripcion: "American Society for Quality: guía completa de RCA con Ishikawa y 5 Porqués." },
      { titulo: "5 Porqués — Lean Enterprise Institute", url: "https://www.lean.org/lexicon-terms/5-whys/", tipo: "documentacion", descripcion: "Definición y ejemplos de la técnica 5 Porqués del Lean Enterprise Institute." },
      { titulo: "ChatGPT Plus", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "Co-facilitador del análisis de causa raíz." },
    ],
  },

  // M3 — Claude — Análisis avanzado
  {
    id: 11,
    titulo: "Claude Projects y Artifacts para ingeniería",
    modulo: MOD3,
    moduloNum: 3,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Claude Projects y Artifacts — el asistente industrial que recuerda todo",
    videoDuracion: "~55 min · Español",
    slidesUrl: "",
    teoria: `Claude de Anthropic es el modelo de IA más sofisticado para tareas de análisis de largo aliento, documentos técnicos extensos y razonamiento estructurado. Si ChatGPT es el caballo de batalla para tareas rápidas y variadas, Claude es el especialista para tareas complejas que requieren profundidad, consistencia y contexto extendido. Para el ingeniero industrial, dos funcionalidades de Claude son especialmente transformadoras: Projects y Artifacts.

Claude Projects (disponible en Claude.ai Pro y Teams) permite crear asistentes especializados con memoria persistente de documentos y contexto. Un Project es como contratar a un asistente que ya leyó todos los manuales de tus equipos, conoce tus procedimientos ISO, sabe el historial de incidentes de tu planta y puede responder preguntas en cualquier momento sin que tengas que volver a explicar el contexto. Esto es radicalmente diferente a chatear con Claude sin Projects: con Projects, cada conversación arranca desde el conocimiento acumulado, no desde cero.

Cómo configurar un Claude Project para tu planta industrial: primero creas el Project y le das un nombre descriptivo ("Asistente Técnico Planta Cayambe"). Luego subes los documentos base: manuales de equipos (PDF), procedimientos ISO de tu empresa (Word o PDF), normativas INEN relevantes, historial de incidentes del último año (Excel o CSV), fichas técnicas de materiales. Claude indexa todos estos documentos y los puede referenciar en cualquier conversación posterior. Finalmente escribes las instrucciones del Project: quién eres tú, qué tipo de preguntas hará el equipo, qué tono usar, qué nunca debe inventar.

Los Artifacts son el equivalente de los entregables de Claude: documentos, tablas, código o visualizaciones que Claude genera y que puedes editar directamente en el panel lateral sin perder el contexto de la conversación. Cuando pides "Genera un procedimiento SOP para limpieza de pasteurizadora", Claude produce el SOP como un Artifact que aparece en el panel derecho. Puedes pedir cambios específicos ("agrega la sección de EPP requerido"), Claude los aplica directamente en el Artifact, y puedes descargarlo como texto o código cuando esté listo. Los Artifacts son especialmente útiles para: procedimientos ISO y SOPs, matrices de evaluación de proveedores, hojas de cálculo de análisis, plantillas de reportes, código Python para análisis de datos.

La ventana de contexto de Claude Pro es de 200.000 tokens — aproximadamente 150.000 palabras o 300 páginas de texto. Para comparar: GPT-4o maneja 128.000 tokens. Esta diferencia es crítica en ingeniería industrial cuando necesitas analizar un manual técnico completo de una línea de producción, revisar un contrato de compra de maquinaria de 150 páginas, leer y analizar la normativa INEN completa de tu categoría de producto, o comparar tres cotizaciones técnicas largas en paralelo. Claude puede cargar todo eso en una sola conversación y hacer referencias cruzadas entre documentos.

La diferencia de estilo entre Claude y ChatGPT es relevante para el ingeniero industrial. ChatGPT tiende a respuestas más concisas y directas, mejores para tareas cortas y variadas. Claude tiende a respuestas más largas, más matizadas y con más caveats (advertencias cuando algo no está claro o podría estar incompleto). Para análisis técnicos complejos donde la precisión importa más que la brevedad, Claude es preferible. Para respuestas rápidas en reuniones o mensajes cotidianos, ChatGPT es más eficiente. La estrategia profesional es usar ambos: ChatGPT para el 70% del trabajo diario, Claude para el 30% que requiere profundidad.

Para configurar tu primer Project industrial en Claude, el prompt de instrucciones recomendado es: "Eres el asistente técnico de ingeniería de [nombre planta]. Tu base de conocimiento incluye los documentos cargados en este Project. Cuando respondas: 1) cita siempre el documento fuente si la información viene de los documentos cargados; 2) si algo no está en los documentos, dilo explícitamente en lugar de inventar; 3) usa unidades del sistema métrico decimal siempre; 4) cuando analices datos, presenta los números exactos antes de las conclusiones; 5) si una pregunta requiere decisión de gerencia o es de alta consecuencia, recomienda escalar al ingeniero responsable antes de actuar."`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Claude Projects y Artifacts para ingeniería\nMódulo 3 — Tema 1\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "Claude vs ChatGPT para el ingeniero", contenido: "ChatGPT: caballo de batalla, tareas rápidas y variadas, 70% del trabajo diario.\nClaude: especialista de profundidad, análisis complejos, documentos largos, 30% crítico.\n\nNo compiten: se complementan." },
      { titulo: "Claude Projects — qué es", contenido: "Asistente con memoria persistente de documentos.\nSube: manuales, ISO, normativas INEN, historial incidentes, fichas técnicas.\n\nCada conversación arranca desde el conocimiento acumulado, no desde cero." },
      { titulo: "Configurar Project industrial", contenido: "1. Crear Project con nombre descriptivo\n2. Subir documentos base (PDF, Word, Excel)\n3. Escribir instrucciones: quién eres, tono, nunca inventar\n\nResultado: asistente que ya leyó todos tus manuales." },
      { titulo: "Claude Artifacts", contenido: "Entregables editables en panel lateral:\n• SOPs e ISO\n• Matrices de proveedores\n• Hojas de cálculo\n• Plantillas de reportes\n• Código Python\n\nEdita directamente sin perder contexto." },
      { titulo: "Ventana de contexto 200k tokens", contenido: "≈ 150.000 palabras · ≈ 300 páginas\n\nPuedes cargar:\n• Manual técnico completo de línea de producción\n• Contrato de maquinaria de 150 páginas\n• Normativa INEN completa\n• 3 cotizaciones técnicas en paralelo" },
      { titulo: "Instrucciones recomendadas del Project", contenido: "1. Cita siempre el documento fuente\n2. Si no está en los docs, dilo explícitamente\n3. Sistema métrico decimal siempre\n4. Números exactos antes de conclusiones\n5. Decisiones de alta consecuencia: escalar al ingeniero" },
    ],
    quiz: [
      { pregunta: "¿Cuál es la principal ventaja de Claude Projects sobre un chat normal de Claude?", opciones: ["Es más rápido", "Tiene memoria persistente de documentos que arranca cada conversación con contexto acumulado", "Es gratuito", "Solo funciona con imágenes"], respuesta: 1, explicacion: "Projects permite cargar documentos base que Claude recuerda en todas las conversaciones posteriores, eliminando la necesidad de re-explicar contexto." },
      { pregunta: "¿Qué son los Artifacts en Claude?", opciones: ["Errores del modelo", "Entregables editables (SOPs, tablas, código) que aparecen en el panel lateral y se pueden modificar sin perder contexto", "Archivos de audio", "Solo gráficos visuales"], respuesta: 1, explicacion: "Los Artifacts son documentos generados por Claude que se pueden editar iterativamente en el panel derecho mientras la conversación continúa." },
      { pregunta: "¿Aproximadamente cuántas páginas de texto puede procesar Claude Pro en una sola conversación?", opciones: ["10 páginas", "50 páginas", "300 páginas (200k tokens)", "5 páginas solamente"], respuesta: 2, explicacion: "La ventana de 200.000 tokens de Claude Pro equivale a aproximadamente 300 páginas de texto." },
      { pregunta: "¿Para qué tipo de tarea industrial es preferible usar Claude sobre ChatGPT?", opciones: ["Responder mensajes de WhatsApp rápidos", "Analizar un manual técnico de 200 páginas o comparar múltiples cotizaciones largas", "Generar imágenes de productos", "Tareas que duran menos de 30 segundos"], respuesta: 1, explicacion: "Claude sobresale en análisis profundos de largo aliento con documentos extensos, donde su ventana de contexto y estilo matizado son ventajas." },
      { pregunta: "¿Qué instrucción del Project protege contra alucinaciones en contexto industrial?", opciones: ["Usar siempre inglés", "Si algo no está en los documentos cargados, decirlo explícitamente en lugar de inventar", "Responder siempre de forma breve", "No usar tablas"], respuesta: 1, explicacion: "Instruir a Claude a reconocer explícitamente cuando no tiene información en los documentos reduce drásticamente las alucinaciones en contextos técnicos." },
    ],
    ejercicio: {
      titulo: "Mi primer Claude Project industrial",
      objetivo: "Crear un Claude Project especializado para tu área industrial con documentos base reales y probarlo con 10 preguntas técnicas reales",
      herramientas: "Claude Pro (claude.ai) + documentos técnicos de tu planta (manuales, SOPs, normativas)",
      pasos: [
        "Acceder a Claude.ai Pro y crear un nuevo Project con nombre descriptivo de tu área",
        "Recopilar 3-5 documentos base: manual de equipo principal, 2 SOPs clave, normativa INEN relevante o procedimiento ISO",
        "Subir los documentos al Project (PDF, Word o texto)",
        "Escribir las instrucciones del Project con los 5 puntos recomendados adaptados a tu contexto",
        "Ejecutar 10 preguntas técnicas reales que harías en tu trabajo: 5 que sí están en los documentos, 5 que están en el límite",
        "Verificar que las respuestas citen correctamente los documentos fuente",
        "Probar los límites: hacer 2 preguntas sobre algo que no está en los documentos para verificar que Claude lo reconoce",
        "Crear un Artifact (SOP o plantilla) usando el Project y evaluar la calidad",
        "Documentar los resultados: ¿qué funciona bien?, ¿qué necesita ajuste en las instrucciones?",
      ],
      resultado: "Claude Project funcional con documentos base cargados, instrucciones configuradas, 10 preguntas probadas y Artifact generado. Reporte de 1 página con hallazgos y mejoras planificadas.",
      criterios: [
        { criterio: "Project configurado con 3+ documentos relevantes", puntos: 20 },
        { criterio: "Instrucciones completas con los 5 puntos mínimos", puntos: 25 },
        { criterio: "10 preguntas probadas con evaluación de calidad", puntos: 30 },
        { criterio: "Prueba de límites (preguntas fuera de los docs) ejecutada", puntos: 15 },
        { criterio: "Artifact generado y evaluado", puntos: 10 },
      ],
    },
    recursos: [
      { titulo: "Claude Projects — Anthropic docs", url: "https://docs.anthropic.com/en/docs/claude-ai/projects", tipo: "documentacion", descripcion: "Documentación oficial de Anthropic sobre Claude Projects y cómo configurarlos." },
      { titulo: "Claude Pro", url: "https://claude.ai/", tipo: "herramienta", descripcion: "Acceso a Claude Pro con Projects, Artifacts y ventana de contexto de 200k tokens." },
      { titulo: "Anthropic — Prompt engineering", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", tipo: "documentacion", descripcion: "Guía oficial de Anthropic para obtener el máximo rendimiento de Claude en tareas complejas." },
    ],
  },
  {
    id: 12,
    titulo: "Análisis de documentos técnicos largos (+60 páginas)",
    modulo: MOD3,
    moduloNum: 3,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Leer 200 páginas en 10 minutos con Claude — documentos técnicos industriales",
    videoDuracion: "~60 min · Español",
    slidesUrl: "",
    teoria: `Una de las tareas más lentas y de menor valor agregado del trabajo del ingeniero industrial es leer documentos técnicos extensos: manuales de equipos de 300 páginas, contratos de mantenimiento de 80 páginas, normativas INEN de 120 páginas, informes de auditoría de 60 páginas. Claude convierte estas lecturas de 4-8 horas en análisis de 20-30 minutos manteniendo la profundidad técnica.

El flujo para análisis de documentos largos con Claude tiene cuatro fases. Fase 1 — Carga: sube el PDF o texto directamente en el chat de Claude. Documentos hasta 60 páginas caben directamente en el chat; documentos más largos conviene dividirlos o cargarlos a través de un Project. Fase 2 — Exploración: pide a Claude un resumen estructurado del documento para entender su organización antes de hacer preguntas específicas. Fase 3 — Extracción dirigida: haz preguntas específicas sobre secciones o temas de interés. Fase 4 — Síntesis: pide síntesis comparativas, tablas de referencia rápida o listas de acción.

El prompt de exploración inicial para cualquier documento técnico industrial: "He cargado [nombre del documento]. Antes de hacer preguntas específicas, dame: 1) Un resumen ejecutivo de 200 palabras de qué trata el documento y cuál es su propósito, 2) Una tabla de contenidos comentada con las 10 secciones más importantes y 1 línea sobre qué contiene cada una, 3) Los 5 datos técnicos o especificaciones más críticos que aparecen en el documento, 4) Cualquier advertencia, restricción o requisito obligatorio que el ingeniero debe conocer."

Para manuales de equipos, los prompts más valiosos son cuatro. Primero, especificaciones técnicas: "Lista todas las especificaciones técnicas del equipo [nombre]: potencia, tensión, presiones de operación, temperaturas, caudales, tolerancias. Presenta en tabla." Segundo, procedimientos de mantenimiento: "Extrae y lista todos los intervalos de mantenimiento preventivo: qué se hace, con qué frecuencia, quién lo hace y qué herramientas o repuestos se necesitan." Tercero, solución de problemas: "Genera una tabla de los problemas más frecuentes listados en el manual con sus síntomas, causas y procedimientos de solución." Cuarto, parámetros de alarma: "Lista todos los valores de alarma, alertas y límites de proceso mencionados en el manual con las acciones recomendadas para cada uno."

Para contratos técnicos y de compraventa de maquinaria, el análisis con Claude es especialmente valioso porque los contratos extensos suelen ocultar cláusulas desfavorables en secciones que nadie lee. El prompt de análisis contractual: "CONTEXTO: Soy ingeniero industrial en Ecuador y estoy evaluando este contrato de compra de maquinaria. ROL: actúa como un revisor legal técnico con experiencia en contratos de equipos industriales en América Latina. TAREA: Identifica y explica: 1) Las 5 cláusulas más favorables para el comprador, 2) Las 5 cláusulas más riesgosas o desfavorables para el comprador con explicación del riesgo, 3) Cualquier cláusula relacionada con garantía, repuestos y soporte técnico, 4) Obligaciones del comprador que podrían implicar costos ocultos, 5) Cualquier referencia a normativa que difiera de la ecuatoriana. FORMATO: Tabla con columnas: Tipo de Cláusula, Sección del Contrato, Contenido Resumido, Nivel de Riesgo (Alto/Medio/Bajo), Recomendación."

Para normativas técnicas (INEN, ISO, FDA, HACCP), el análisis se centra en identificar los requisitos aplicables a tu operación específica. El prompt: "Esta normativa tiene [N] páginas. Mi empresa produce [producto] en [sector] en Ecuador. Dame: 1) Los artículos o secciones que aplican directamente a mi operación, 2) Los requisitos obligatorios vs los recomendados, 3) Los parámetros numéricos críticos (temperaturas, tiempos, concentraciones), 4) Las no conformidades más comunes en empresas similares según el espíritu de la norma, 5) Un checklist de 20 puntos para autoevaluación del cumplimiento."

La limitación más importante que el ingeniero debe respetar: Claude puede cometer errores de citación de números exactos en documentos muy densos. Cuando la decisión depende de un valor específico (una temperatura de proceso, un voltaje máximo, un plazo contractual), siempre localiza y lee la sección original directamente. Claude es excelente para identificar dónde está la información relevante y explicar su significado, pero las cifras críticas siempre deben verificarse en la fuente.`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Análisis de documentos técnicos largos con Claude\nMódulo 3 — Tema 2\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "El problema: documentos extensos", contenido: "Manuales: 300 páginas · Contratos: 80 páginas\nNormativas INEN: 120 páginas · Auditorías: 60 páginas\n\n4-8 horas de lectura → 20-30 minutos con Claude" },
      { titulo: "4 fases del análisis", contenido: "1. Carga (PDF o texto directo)\n2. Exploración (resumen estructurado)\n3. Extracción dirigida (preguntas específicas)\n4. Síntesis (tablas de referencia rápida)" },
      { titulo: "Prompt de exploración inicial", contenido: "1) Resumen ejecutivo 200 palabras\n2) Tabla de contenidos comentada (10 secciones)\n3) 5 especificaciones técnicas más críticas\n4) Advertencias y requisitos obligatorios" },
      { titulo: "Prompts para manuales de equipo", contenido: "• Especificaciones técnicas → tabla completa\n• Mantenimiento preventivo → intervalos y recursos\n• Solución de problemas → síntomas, causas, solución\n• Parámetros de alarma → valores y acciones" },
      { titulo: "Análisis contractual de maquinaria", contenido: "Identifica: 5 cláusulas favorables, 5 riesgosas, garantía/repuestos, costos ocultos, diferencias con normativa ecuatoriana.\n\nFormato: tabla con nivel de riesgo y recomendación." },
      { titulo: "Análisis de normativas (INEN, ISO, HACCP)", contenido: "Aplicables a tu operación + obligatorios vs recomendados + parámetros numéricos + no conformidades comunes + checklist de 20 puntos." },
      { titulo: "Limitación crítica", contenido: "Claude puede cometer errores en cifras exactas de documentos muy densos.\n\nRegla: identificar con Claude dónde está la información → verificar el número exacto en la fuente." },
    ],
    quiz: [
      { pregunta: "¿Cuánto tiempo se puede ahorrar al analizar un documento técnico de 200 páginas con Claude vs lectura tradicional?", opciones: ["Sin diferencia", "De 4-8 horas a 20-30 minutos", "Solo 5 minutos de ahorro", "Claude no puede leer documentos técnicos"], respuesta: 1, explicacion: "Claude puede explorar, extraer y sintetizar un documento de 200 páginas en 20-30 minutos frente a las 4-8 horas de lectura tradicional." },
      { pregunta: "¿Cuál es la limitación más importante al usar Claude para análisis de contratos o normativas?", opciones: ["No puede leer PDF", "Las cifras exactas deben verificarse en la fuente original antes de tomar decisiones críticas", "No funciona en español", "Solo funciona con contratos cortos"], respuesta: 1, explicacion: "Claude puede cometer errores en valores numéricos específicos en documentos muy densos; siempre verificar cifras críticas en el original." },
      { pregunta: "Para analizar una normativa INEN, ¿cuál es el prompt más completo?", opciones: ["'Resume esto'", "Preguntar por artículos aplicables, requisitos obligatorios vs recomendados, parámetros numéricos y checklist de cumplimiento", "Solo pedir los títulos de sección", "Preguntar por el autor de la normativa"], respuesta: 1, explicacion: "El análisis completo de normativa identifica lo que aplica a tu operación específica con distinción entre obligatorio y recomendado." },
      { pregunta: "¿Cuándo conviene cargar un documento a un Claude Project en lugar de directamente al chat?", opciones: ["Siempre, sin excepción", "Cuando el documento supera 60 páginas o necesitas referenciarlo en múltiples conversaciones", "Solo para documentos en inglés", "Nunca"], respuesta: 1, explicacion: "Los Projects son ideales para documentos muy largos o que necesitas consultar frecuentemente sin volver a cargarlos." },
      { pregunta: "En el análisis de un contrato de compra de maquinaria, ¿qué aspecto es más crítico para el comprador ecuatoriano?", opciones: ["El tamaño de la letra del contrato", "Las cláusulas de garantía, repuestos, soporte técnico y diferencias con normativa ecuatoriana", "El color de la portada", "Solo el precio de compra"], respuesta: 1, explicacion: "Garantía, repuestos y soporte en Ecuador son los puntos donde más frecuentemente aparecen costos ocultos y riesgos para el comprador." },
    ],
    ejercicio: {
      titulo: "Análisis de documento técnico real con Claude",
      objetivo: "Analizar un documento técnico real (manual, normativa o contrato) de tu empresa con Claude y extraer información estructurada accionable en menos de 30 minutos",
      herramientas: "Claude Pro + PDF del documento a analizar",
      datosEjemplo: "Si no tienes documento propio, usa: Norma INEN 9 de Leche Pasteurizada (disponible en inec.gob.ec) o el manual público de un PLC Siemens S7-1200 (disponible en siemens.com/support).",
      pasos: [
        "Seleccionar un documento técnico real de 30+ páginas (manual, normativa INEN, contrato, auditoría)",
        "Cargar el documento en Claude Pro",
        "Ejecutar el prompt de exploración inicial y evaluar la calidad del resumen",
        "Para documentos de equipo: ejecutar los 4 prompts de extracción (especificaciones, mantenimiento, problemas, alarmas)",
        "Para normativas: ejecutar el prompt de análisis normativo con checklist de cumplimiento",
        "Para contratos: ejecutar el prompt de análisis contractual con tabla de riesgos",
        "Seleccionar 3 datos numéricos críticos del análisis y verificarlos manualmente en el documento original",
        "Compilar el resultado: tabla de referencia rápida del documento en 1-2 páginas",
        "Medir el tiempo total y compararlo con el tiempo estimado de lectura tradicional",
      ],
      resultado: "Tabla de referencia rápida del documento técnico analizado, checklist o lista de riesgos según el tipo, 3 datos verificados manualmente, y tiempo total documentado",
      criterios: [
        { criterio: "Documento técnico de 30+ páginas analizado", puntos: 15 },
        { criterio: "Prompt de exploración ejecutado y evaluado", puntos: 20 },
        { criterio: "Prompts específicos según tipo de documento", puntos: 25 },
        { criterio: "3 datos numéricos verificados en la fuente", puntos: 20 },
        { criterio: "Tabla de referencia rápida compilada", puntos: 20 },
      ],
    },
    recursos: [
      { titulo: "INEN — Normativas técnicas ecuatorianas", url: "https://www.normalizacion.gob.ec/normas-tecnicas/", tipo: "documentacion", descripcion: "Catálogo oficial de normas técnicas INEN del Ecuador para descargar y analizar." },
      { titulo: "Claude Pro", url: "https://claude.ai/", tipo: "herramienta", descripcion: "Plataforma con ventana de contexto de 200k tokens para análisis de documentos extensos." },
      { titulo: "ISO 9001 — Gestión de calidad", url: "https://www.iso.org/iso-9001-quality-management.html", tipo: "documentacion", descripcion: "Normativa ISO 9001 de referencia para sistemas de gestión de calidad industrial." },
    ],
  },
  {
    id: 13,
    titulo: "Evaluación de proveedores con matriz ponderada",
    modulo: MOD3,
    moduloNum: 3,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Matriz ponderada de proveedores con Claude — decisiones de compra objetivas",
    videoDuracion: "~55 min · Español",
    slidesUrl: "",
    teoria: `La evaluación de proveedores es una de las decisiones más recurrentes y con mayor impacto económico en la operación industrial. Un proveedor mal elegido significa retrasos de producción, calidad inconsistente, costos ocultos de mantenimiento y riesgos de desabastecimiento. La mayoría de las empresas medianas en Ecuador toma estas decisiones basándose en precio (70%) y relación personal (30%), ignorando criterios técnicos y operativos que determinan el costo total de propiedad.

La matriz ponderada de proveedores es una herramienta de decisión multicriteria que asigna pesos relativos a cada criterio de evaluación según su importancia para la operación, y califica a cada proveedor en cada criterio. El resultado es una puntuación ponderada que permite comparación objetiva. La ventaja sobre decidir por precio solo: refleja el costo total de la relación con el proveedor, no solo el precio unitario.

Los criterios típicos para evaluación de proveedores industriales en Ecuador y sus pesos recomendados: Calidad del producto (20%): historial de defectos, certificaciones ISO o INEN, procedimientos de control de calidad. Precio y condiciones comerciales (18%): precio unitario, descuentos por volumen, condiciones de pago, Incoterm. Tiempo de entrega (15%): plazos de entrega, puntualidad histórica, capacidad de entrega urgente. Servicio técnico y soporte (12%): disponibilidad de soporte en Ecuador, tiempo de respuesta ante problemas, capacitación. Solidez financiera y continuidad (10%): antigüedad, certificaciones, diversificación de clientes, riesgo de quiebra. Capacidad de escalar (10%): puede crecer con tu demanda. Logística y distribución (8%): ubicación, red de distribución, condiciones de almacenamiento. Cumplimiento ambiental y legal (7%): BPM, ARCSA, SRI al día. Los pesos deben ajustarse según el tipo de proveedor: para insumos críticos de calidad, calidad pesa más; para commodities, precio puede pesar más.

El proceso con Claude para construir la matriz tiene cinco pasos. Paso 1 — Definir criterios y pesos: "Soy ingeniero de compras en [tipo de empresa]. Necesito evaluar proveedores de [tipo de material]. Propón 8-10 criterios de evaluación con sus pesos porcentuales sumando 100%, justificando cada peso según el impacto en mi operación." Paso 2 — Documentar a los proveedores: para cada proveedor candidato, recopila la información disponible y la pegas en el chat. Paso 3 — Calificación: "Con base en la información de cada proveedor, califícalos en cada criterio en escala 1-10. Para los criterios donde no hay información, usa N/A y explica qué necesitarías verificar." Paso 4 — Cálculo ponderado: Claude puede calcular el puntaje final multiplicando calificación × peso y sumando. Paso 5 — Análisis de riesgo: "Identifica los 3 riesgos principales de elegir al proveedor con mayor puntaje y las 3 banderas rojas del proveedor con menor puntaje."

Un error frecuente en la evaluación de proveedores es la falta de ponderación por tipo de insumo. Un proveedor de material crítico (ingrediente activo, componente de seguridad) necesita pesos completamente distintos a un proveedor de insumos de limpieza o papelería. Claude puede ayudarte a definir los pesos correctos para cada categoría: "Tengo 4 categorías de proveedores: materias primas críticas, packaging, servicios de mantenimiento y suministros generales. Para cada categoría propón los criterios y pesos más apropiados considerando riesgo operativo y costo total."

La evaluación periódica de proveedores activos es igualmente importante. Con Claude Projects puedes cargar el historial de desempeño de tus proveedores activos (defectos reportados, retrasos en entrega, incidentes de calidad, cambios de precio) y hacer evaluaciones trimestrales que alimenten las decisiones de renovación de contrato o búsqueda de alternativas. El prompt trimestral: "Cargué el historial de desempeño del Q3 de nuestros 8 proveedores activos. Evalúa el desempeño de cada uno contra los criterios de nuestra matriz, identifica cuáles están por debajo del umbral aceptable (puntaje < 6.0) y recomienda acciones: mantener, poner en observación, o iniciar proceso de sustitución."

La documentación del proceso de evaluación es un requisito ISO 9001 y una protección legal ante reclamos de proveedores. Claude puede generar el informe formal de la evaluación con justificaciones trazables que muestran exactamente cómo se llegó a la decisión de selección.`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Evaluación de proveedores con matriz ponderada\nMódulo 3 — Tema 3\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "El problema: decisiones sin criterio", contenido: "Empresas medianas en Ecuador: 70% precio + 30% relación personal.\n\nIgnoran: calidad histórica, tiempo de entrega, soporte técnico, riesgo de quiebra.\n\nResultado: costos ocultos y riesgos operativos." },
      { titulo: "Criterios y pesos recomendados", contenido: "Calidad 20% · Precio/condiciones 18% · Entrega 15%\nSoporte técnico 12% · Solidez financiera 10%\nCapacidad de escalar 10% · Logística 8% · Ambiental/legal 7%\n\nAjustar según criticidad del insumo." },
      { titulo: "5 pasos con Claude", contenido: "1. Definir criterios y pesos (con justificación)\n2. Documentar candidatos (info disponible al chat)\n3. Calificación 1-10 por criterio\n4. Cálculo ponderado automatizado\n5. Análisis de riesgo del proveedor ganador" },
      { titulo: "Ponderación por categoría de insumo", contenido: "MP crítica: calidad pesa más (30%+)\nPackaging: precio y entrega pesan más\nServicios mantenimiento: soporte técnico y solidez\nSuministros generales: precio domina\n\nClaude define los pesos por categoría." },
      { titulo: "Evaluación periódica Q trimestral", contenido: "Projects: carga historial de desempeño activos.\nClaude evalúa y clasifica: mantener, observar, sustituir.\n\nRequisito ISO 9001 + protección legal ante reclamos." },
    ],
    quiz: [
      { pregunta: "¿Cuál es la ventaja principal de la matriz ponderada sobre decidir solo por precio?", opciones: ["Es más rápida", "Refleja el costo total de la relación con el proveedor incluyendo calidad, entrega y soporte", "Es obligatoria por ley", "El proveedor más barato siempre gana"], respuesta: 1, explicacion: "La matriz ponderada captura el costo total de la relación, evitando que costos ocultos de calidad deficiente o retrasos eliminen el ahorro del precio bajo." },
      { pregunta: "Para un proveedor de ingrediente activo crítico en una planta de alimentos, ¿qué criterio debería tener mayor peso?", opciones: ["Precio unitario", "Calidad del producto e historial de defectos", "Ubicación geográfica", "Antigüedad del vendedor"], respuesta: 1, explicacion: "Para insumos críticos que afectan directamente la calidad o seguridad del producto final, calidad debe tener el mayor peso." },
      { pregunta: "¿Con qué frecuencia se recomienda la evaluación de proveedores activos?", opciones: ["Solo una vez al contratar", "Trimestralmente con historial de desempeño", "Solo cuando hay problemas", "Cada 5 años"], respuesta: 1, explicacion: "La evaluación trimestral con datos reales de desempeño permite identificar deterioro antes de que se convierta en crisis operativa." },
      { pregunta: "¿Por qué la documentación del proceso de evaluación es importante bajo ISO 9001?", opciones: ["No es importante", "Es un requisito de trazabilidad y protección legal ante reclamos de proveedores", "Solo para auditorías externas de lujo", "Solo lo necesitan empresas grandes"], respuesta: 1, explicacion: "ISO 9001 exige trazabilidad en la selección de proveedores; la documentación también protege legalmente ante disputas contractuales." },
      { pregunta: "Si un proveedor activo obtiene puntaje < 6.0 en la evaluación trimestral, ¿qué acción recomienda el proceso?", opciones: ["Aumentar los pedidos automáticamente", "Ponerlo en observación o iniciar proceso de sustitución según severidad", "Ignorar el resultado", "Subir los pesos de los criterios para que pase"], respuesta: 1, explicacion: "El umbral de 6.0 activa una revisión formal: observación con plan de mejora o proceso de sustitución dependiendo del historial y criticidad." },
    ],
    ejercicio: {
      titulo: "Matriz ponderada de proveedores con Claude",
      objetivo: "Construir y aplicar una matriz ponderada para evaluar 3 proveedores reales o simulados de tu área con Claude, generando el informe de decisión",
      herramientas: "Claude Pro + Google Sheets para la matriz + documentación de proveedores disponible",
      datosEjemplo: "Si no tienes proveedores propios, evalúa 3 proveedores simulados de material de empaque para una empresa de alimentos: Proveedor A (precio bajo, entrega irregular, sin certificación), Proveedor B (precio medio, entrega puntual, ISO 9001), Proveedor C (precio alto, entrega garantizada 24h, BPM y soporte técnico propio).",
      pasos: [
        "Pedir a Claude que proponga 8-10 criterios con pesos para tu tipo de proveedor específico",
        "Ajustar los criterios y pesos según tu criterio profesional (discutir con Claude si algún peso parece incorrecto)",
        "Documentar la información disponible de los 3 proveedores en el chat",
        "Pedir la calificación 1-10 por criterio con justificación para cada proveedor",
        "Pedir el cálculo ponderado y la tabla comparativa final",
        "Solicitar el análisis de riesgos del proveedor recomendado",
        "Construir la tabla final en Google Sheets con todos los datos",
        "Redactar el informe formal de decisión de 1 página con Claude",
      ],
      resultado: "Matriz ponderada completa en Google Sheets, análisis de riesgos del proveedor recomendado, e informe formal de decisión de 1 página",
      criterios: [
        { criterio: "Criterios y pesos bien justificados para el tipo de proveedor", puntos: 20 },
        { criterio: "Calificaciones documentadas con evidencia o justificación", puntos: 25 },
        { criterio: "Cálculo ponderado correcto en Google Sheets", puntos: 20 },
        { criterio: "Análisis de riesgos del proveedor ganador", puntos: 20 },
        { criterio: "Informe de decisión formal y trazable", puntos: 15 },
      ],
    },
    recursos: [
      { titulo: "Supplier Evaluation — ASQ", url: "https://asq.org/quality-resources/supplier-quality", tipo: "documentacion", descripcion: "American Society for Quality: guía de evaluación de proveedores con criterios y mejores prácticas." },
      { titulo: "ISO 9001 — Gestión de proveedores", url: "https://www.iso.org/iso-9001-quality-management.html", tipo: "documentacion", descripcion: "Requisitos ISO 9001 para la selección, evaluación y monitoreo de proveedores externos." },
      { titulo: "Claude Pro", url: "https://claude.ai/", tipo: "herramienta", descripcion: "Plataforma para construir y aplicar matrices de evaluación con análisis de riesgo." },
    ],
  },
  {
    id: 14,
    titulo: "Comparativas técnicas y benchmarking con Claude",
    modulo: MOD3,
    moduloNum: 3,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Benchmarking industrial con Claude — comparar opciones técnicas en 30 minutos",
    videoDuracion: "~50 min · Español",
    slidesUrl: "",
    teoria: `El benchmarking es la práctica de comparar sistemáticamente el desempeño propio contra referencias externas (competidores, industria, mejores prácticas globales) para identificar brechas y oportunidades de mejora. En la práctica industrial ecuatoriana, el benchmarking se hace poco y mal: demasiado informal, sin datos verificables, y sin metodología que convierta los hallazgos en acciones concretas. Claude puede acelerar y estructurar tanto el benchmarking externo como las comparativas técnicas internas.

Las comparativas técnicas internas son las más accesibles y de mayor impacto inmediato. Ejemplos: comparar el OEE de tres líneas de producción para identificar cuál es la de mejor práctica interna; comparar el tiempo de cambio de formato entre turnos para identificar al turno que lo hace más rápido y documentar su método; comparar el costo de mantenimiento por unidad producida entre equipos similares para decidir cuál reemplazar primero. Claude estructura estas comparativas a partir de los datos que le proporcionas y genera tablas, identificación de brechas y recomendaciones.

El prompt para comparativa técnica interna: "CONTEXTO: Tenemos 3 líneas de ensamblaje de [producto] con los siguientes datos de la semana [N]: Línea 1: producción 1.200 u/día, tiempo de paro 45 min/día, defectos 2.1%, consumo energético 180 kWh/día. Línea 2: producción 1.450 u/día, tiempo de paro 20 min/día, defectos 1.3%, consumo energético 165 kWh/día. Línea 3: producción 980 u/día, tiempo de paro 95 min/día, defectos 3.8%, consumo energético 210 kWh/día. ROL: eres un analista de operaciones industriales. TAREA: Calcula el OEE de cada línea, identifica la brecha de la Línea 3 vs la mejor práctica interna (Línea 2), y propón las 5 acciones prioritarias para cerrar esa brecha. FORMATO: tabla comparativa primero, luego análisis de brechas, luego plan de acción con impacto estimado."

Para benchmarking externo, Claude tiene conocimiento de estándares de industria hasta su fecha de corte (agosto 2025). Puede indicar rangos típicos de indicadores para distintos sectores industriales y compararte contra ellos. Importante: para benchmarking con datos post-agosto 2025, activa Browse en ChatGPT o usa Perplexity para obtener datos actualizados. El prompt de benchmarking externo: "CONTEXTO: Mi planta produce [producto] en Ecuador con estas métricas actuales: OEE 68%, tasa de defectos 2.8%, tiempo de entrega 5 días, costo de mantenimiento 3.2% del valor de activos. TAREA: Compara estos indicadores contra los benchmarks de la industria [sector] en América Latina y a nivel global. FORMATO: tabla con: Indicador, Mi valor, Benchmark Latam, Benchmark Global Top Quartile, Brecha, Prioridad de Mejora (Alta/Media/Baja)."

La comparativa de soluciones técnicas es otra aplicación de alto valor. Cuando el ingeniero debe decidir entre tecnologías (por ejemplo, tres tipos de sistemas SCADA, dos marcas de robots colaborativos, o tres enfoques para mantenimiento predictivo), Claude puede estructurar la comparativa técnica a partir de las especificaciones. El prompt: "Tengo que elegir entre [Opción A], [Opción B] y [Opción C] para [aplicación específica] en mi planta. Cargué las fichas técnicas de cada opción. TAREA: Construye una tabla comparativa con los criterios técnicos más relevantes para esta aplicación, indica cuál opción es superior en cada criterio y justifica cuál es la opción recomendada con un análisis TCO (Costo Total de Propiedad) a 5 años."

El análisis TCO (Total Cost of Ownership) es el marco más importante para comparativas de inversión en maquinaria y tecnología. El precio de compra rara vez representa más del 40-60% del costo total; el resto son: costos de instalación y puesta en marcha, energía durante la vida útil, mantenimiento preventivo y correctivo, repuestos, capacitación, y costo de downtime cuando falla. Claude puede construir el modelo TCO a 5 o 10 años si le proporcionas los datos base, revelando que la opción más barata al inicio puede ser la más cara al final.`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Comparativas técnicas y benchmarking con Claude\nMódulo 3 — Tema 4\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "Tipos de comparativa con Claude", contenido: "1. Comparativa técnica interna (líneas, turnos, equipos)\n2. Benchmarking externo (vs industria Latam y global)\n3. Comparativa de soluciones técnicas (opciones de compra)\n4. Análisis TCO (Costo Total de Propiedad)" },
      { titulo: "Comparativa interna — prompt", contenido: "CONTEXTO: datos de 3 líneas (producción, paros, defectos, energía)\nROL: analista de operaciones\nTAREA: calcular OEE, brecha vs mejor práctica, plan de acción\nFORMATO: tabla comparativa → análisis brechas → plan" },
      { titulo: "Benchmarking externo", contenido: "Claude conoce benchmarks de industria hasta agosto 2025.\nPara datos más recientes: Browse en ChatGPT o Perplexity.\n\nTabla: Mi valor | Benchmark Latam | Top Quartile Global | Brecha | Prioridad" },
      { titulo: "Comparativa de soluciones técnicas", contenido: "Carga fichas técnicas de 3 opciones.\nClaude construye tabla comparativa por criterios técnicos.\nIdentifica la opción superior en cada criterio.\nRecomienda con justificación." },
      { titulo: "Análisis TCO — el más importante", contenido: "Precio compra = 40-60% del costo total.\n\nResto: instalación, energía vida útil, mantenimiento, repuestos, capacitación, costo downtime.\n\nClaude construye modelo TCO a 5-10 años." },
    ],
    quiz: [
      { pregunta: "¿Qué es el benchmarking externo en manufactura?", opciones: ["Comparar el desempeño propio solo entre turnos", "Comparar sistemáticamente indicadores propios contra referencias de la industria o competidores", "Medir el peso de los productos", "Comparar salarios del equipo"], respuesta: 1, explicacion: "El benchmarking externo compara indicadores clave de la empresa contra estándares de industria para identificar brechas y prioridades de mejora." },
      { pregunta: "¿Qué representa típicamente el precio de compra en el Costo Total de Propiedad (TCO) de un equipo industrial?", opciones: ["El 100%", "El 40-60%", "Solo el 5%", "El 90%"], respuesta: 1, explicacion: "El precio de compra raramente supera el 60% del TCO; energía, mantenimiento, repuestos y downtime representan una parte significativa." },
      { pregunta: "Para benchmarking con datos de industria más recientes que agosto 2025, ¿qué herramienta deberías usar?", opciones: ["Solo Claude sin conexión", "Browse en ChatGPT o Perplexity para datos actualizados", "Solo libros de texto", "No es posible obtener datos recientes"], respuesta: 1, explicacion: "Claude tiene conocimiento hasta agosto 2025; para datos más recientes, Browse en ChatGPT o Perplexity accesan fuentes actualizadas." },
      { pregunta: "En una comparativa interna de 3 líneas, ¿cuál es el primer paso del análisis?", opciones: ["Cerrar la línea con peor desempeño", "Calcular OEE de cada línea e identificar la brecha vs la mejor práctica interna", "Aumentar el personal en todas las líneas", "Comprar equipo nuevo inmediatamente"], respuesta: 1, explicacion: "Calcular OEE y establecer la mejor práctica interna permite cuantificar la brecha exacta y priorizar acciones por impacto." },
      { pregunta: "¿Qué deben incluir los datos cuando se le pide a Claude una comparativa entre opciones tecnológicas?", opciones: ["Solo el precio de cada opción", "Las fichas técnicas o especificaciones detalladas de cada opción", "Solo el nombre de la marca", "El número de empleados del proveedor"], respuesta: 1, explicacion: "Claude necesita las especificaciones técnicas reales para hacer una comparativa estructurada y recomendar con criterio." },
    ],
    ejercicio: {
      titulo: "Benchmarking de una línea de producción con Claude",
      objetivo: "Realizar un benchmarking completo de una línea o proceso de tu empresa contra indicadores de industria y generar un plan de mejora priorizado",
      herramientas: "Claude Pro + datos reales de tu operación + Google Sheets para la tabla de benchmarking",
      datosEjemplo: "Si no tienes datos propios, usa: OEE 71%, tasa de defectos 2.4%, tiempo de changeover 45 min, costo mantenimiento 3.8% de activos, puntualidad de entrega 87% para una empresa de plásticos en Ecuador.",
      pasos: [
        "Recopilar 5-8 indicadores clave de tu operación o área con sus valores actuales",
        "Ejecutar el prompt de benchmarking externo vs Latam y global con Claude",
        "Identificar los 3 indicadores con mayor brecha vs el top quartile global",
        "Para el indicador con mayor brecha, ejecutar análisis de causas con Ishikawa",
        "Construir la tabla completa de benchmarking en Google Sheets",
        "Solicitar a Claude el plan de mejora priorizado para los 3 indicadores críticos",
        "Calcular el impacto económico de cerrar cada brecha (horas, costos, defectos)",
        "Preparar una presentación de 5 slides con los hallazgos para gerencia",
      ],
      resultado: "Tabla de benchmarking completa (interno + externo), análisis de causas del indicador más crítico, plan de mejora con impacto económico y presentación de 5 slides",
      criterios: [
        { criterio: "5+ indicadores comparados vs benchmarks de industria", puntos: 25 },
        { criterio: "Identificación y cuantificación de brechas", puntos: 20 },
        { criterio: "Análisis de causas del indicador más crítico", puntos: 20 },
        { criterio: "Plan de mejora con impacto económico calculado", puntos: 20 },
        { criterio: "Presentación para gerencia clara y accionable", puntos: 15 },
      ],
    },
    recursos: [
      { titulo: "Industry Benchmarks Manufacturing — Deloitte", url: "https://www2.deloitte.com/us/en/insights/focus/industry-4-0.html", tipo: "documentacion", descripcion: "Benchmarks de manufactura de Deloitte para comparar indicadores operativos." },
      { titulo: "OEE Benchmarks — Vorne Industries", url: "https://www.oee.com/benchmarks.html", tipo: "documentacion", descripcion: "Benchmarks mundiales de OEE por industria con criterios de clasificación." },
      { titulo: "Claude Pro", url: "https://claude.ai/", tipo: "herramienta", descripcion: "Plataforma para análisis de benchmarking estructurado y comparativas técnicas." },
    ],
  },
  {
    id: 15,
    titulo: "Seguridad, privacidad y LOPDP Ecuador con IA",
    modulo: MOD3,
    moduloNum: 3,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "LOPDP Ecuador y uso responsable de IA en la empresa industrial",
    videoDuracion: "~50 min · Español",
    slidesUrl: "",
    teoria: `El uso de herramientas de IA en la empresa industrial no es solo una decisión técnica: es también una decisión legal y de gestión de riesgo. En Ecuador, la Ley Orgánica de Protección de Datos Personales (LOPDP), vigente desde su reglamento en 2023, establece obligaciones específicas para empresas que procesan datos personales en sistemas automatizados. El ingeniero industrial que lidera proyectos de transformación digital necesita entender qué implica esta ley para las herramientas que usa y recomienda.

La LOPDP define dato personal como cualquier información que identifica o hace identificable a una persona natural: nombre, cédula, correo electrónico, dirección, número de teléfono, datos biométricos, datos de salud, datos financieros, historial laboral. En el contexto industrial, los datos personales más frecuentes son: datos de empleados (cédula, salario, historial de desempeño, datos médicos), datos de clientes (nombre, dirección de entrega, historial de compras, información financiera), y datos de proveedores personas naturales (cédula, RUC personal, datos bancarios).

Las obligaciones clave de la LOPDP para empresas que usan IA tienen cinco dimensiones. Primero, el principio de finalidad: los datos deben recolectarse para una finalidad específica y legítima, y no pueden usarse para otros propósitos sin nuevo consentimiento. Segundo, el principio de minimización: solo recoger los datos estrictamente necesarios. Tercero, el consentimiento: para datos sensibles (salud, biométricos, financieros), el consentimiento debe ser explícito, informado y documentado. Cuarto, la seguridad: implementar medidas técnicas y organizativas proporcionales al riesgo. Quinto, la transferencia internacional: enviar datos a servidores en otros países requiere garantías específicas (acuerdos con el procesador, países con nivel adecuado de protección).

Para el uso de ChatGPT y Claude en el contexto empresarial industrial, las reglas prácticas bajo LOPDP son cuatro. Regla 1: nunca subas cédulas, nombres completos de empleados, datos de salud o información financiera personal a herramientas IA en la nube sin un acuerdo de procesador de datos firmado. Regla 2: para análisis de datos de empleados, anonimiza siempre antes de procesar (reemplaza nombres por ID interno, cédulas por código). Regla 3: para datos de clientes, usa solo lo necesario para la tarea y anonimiza los identificadores directos. Regla 4: los acuerdos empresariales de Claude (Teams/Enterprise) y ChatGPT Team/Enterprise incluyen cláusulas de procesador de datos que cumplen mejor con LOPDP que los planes personales.

La anonimización es la herramienta práctica más importante para cumplir LOPDP mientras se usa IA. Antes de subir cualquier dataset a ChatGPT o Claude para análisis, aplica estas transformaciones: reemplaza nombres por ID numérico (empleado_001, empleado_002), reemplaza cédulas por código interno, generaliza edades exactas a rangos (30-35, 36-40), elimina números de teléfono y correos a menos que sean indispensables, reemplaza direcciones por zona o región. Con estos cambios, el dataset mantiene su utilidad analítica pero deja de ser datos personales identificables bajo LOPDP.

Las multas por incumplimiento de LOPDP para empresas son de hasta el 1% de la facturación anual para infracciones leves, hasta el 2% para graves, y hasta el 3% para muy graves. Adicionalmente, la ARCOTEL (autoridad de control) puede imponer la suspensión del tratamiento de datos y la eliminación de los datos procesados ilegalmente. Para una empresa industrial con USD 5 millones de facturación, una infracción grave podría representar USD 100.000 de multa más los costos legales y de reputación.

Un protocolo de uso responsable de IA para el ingeniero industrial se puede condensar en un documento de una página que cubra: lista blanca de herramientas aprobadas con nivel de uso permitido, categorías de datos que sí se pueden procesar con IA en la nube (datos operativos sin identificadores personales) vs datos que no (datos de empleados o clientes con identificadores), proceso de anonimización estándar para los datasets, y responsable de mantener actualizada la política. Claude puede generar la primera versión de este protocolo en 10 minutos si le describes tu tipo de empresa y los datos que maneja.`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Seguridad, privacidad y LOPDP Ecuador\nMódulo 3 — Tema 5 (cierre módulo)\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "LOPDP — datos personales en la industria", contenido: "Dato personal: nombre, cédula, correo, teléfono, biométricos, salud, finanzas.\n\nEn tu planta: empleados (cédula, salario, salud), clientes (datos de entrega, compras), proveedores persona natural." },
      { titulo: "5 obligaciones clave LOPDP", contenido: "1. Finalidad: usar datos solo para el propósito declarado\n2. Minimización: solo los datos necesarios\n3. Consentimiento: explícito para datos sensibles\n4. Seguridad: medidas proporcionales al riesgo\n5. Transferencia internacional: garantías específicas requeridas" },
      { titulo: "4 reglas prácticas con IA en la nube", contenido: "1. Sin cédulas, nombres de empleados o datos salud sin acuerdo de procesador\n2. Anonimizar siempre antes de analizar datos de empleados\n3. Datos de clientes: mínimo necesario + anonimizar IDs\n4. Planes Team/Enterprise incluyen mejores cláusulas de procesador" },
      { titulo: "Cómo anonimizar correctamente", contenido: "Nombres → ID numérico (empleado_001)\nCédulas → código interno\nEdades exactas → rangos (30-35)\nTeléfonos/correos → eliminar si no son esenciales\nDirecciones → zona o región" },
      { titulo: "Multas LOPDP", contenido: "Leve: hasta 1% facturación anual\nGrave: hasta 2%\nMuy grave: hasta 3%\n\nEmpresa con $5M ventas → multa grave = $100.000\n\n+ suspensión del tratamiento + eliminación de datos" },
      { titulo: "Protocolo de 1 página para tu empresa", contenido: "• Lista blanca de herramientas aprobadas\n• Datos que sí/no a la nube\n• Proceso de anonimización estándar\n• Responsable de política\n\nClaude lo genera en 10 minutos." },
    ],
    quiz: [
      { pregunta: "¿Qué ley ecuatoriana regula el tratamiento de datos personales en sistemas automatizados como la IA?", opciones: ["Ley de Comercio Electrónico", "LOPDP — Ley Orgánica de Protección de Datos Personales", "Código del Trabajo", "Ley de Telecomunicaciones"], respuesta: 1, explicacion: "La LOPDP, vigente con su reglamento desde 2023, establece las obligaciones para el tratamiento de datos personales en Ecuador." },
      { pregunta: "¿Cuál es la transformación correcta para anonimizar el nombre de un empleado antes de subir datos a ChatGPT?", opciones: ["Poner iniciales como J.P.", "Reemplazar por ID numérico interno como empleado_001", "Usar un seudónimo", "No es necesario anonimizar"], respuesta: 1, explicacion: "El ID numérico interno elimina la identificabilidad directa mientras mantiene la utilidad analítica del dataset." },
      { pregunta: "¿Cuánto puede ser la multa LOPDP por una infracción grave para una empresa con USD 5 millones de facturación?", opciones: ["USD 500", "USD 10.000", "USD 100.000 (2% de facturación)", "No existen multas en Ecuador"], respuesta: 2, explicacion: "Infracción grave = hasta 2% de facturación anual. USD 5M × 2% = USD 100.000, más costos legales y reputacionales." },
      { pregunta: "¿Qué tipo de plan de ChatGPT u Claude incluye mejores garantías para cumplimiento LOPDP?", opciones: ["Plan gratuito", "Plan personal ($20/mes)", "Planes Team o Enterprise con acuerdo de procesador de datos", "Cualquier plan es igual"], respuesta: 2, explicacion: "Los planes Team y Enterprise incluyen cláusulas de procesador de datos que ofrecen mejores garantías legales que los planes personales." },
      { pregunta: "¿Cuál es el principio LOPDP que prohíbe usar datos de empleados para un propósito distinto al original sin nuevo consentimiento?", opciones: ["Principio de seguridad", "Principio de finalidad", "Principio de transparencia", "Principio de exactitud"], respuesta: 1, explicacion: "El principio de finalidad establece que los datos solo pueden usarse para el propósito específico y legítimo para el que fueron recolectados." },
    ],
    ejercicio: {
      titulo: "Protocolo de uso responsable de IA bajo LOPDP",
      objetivo: "Crear el protocolo de uso responsable de IA para tu empresa o área industrial, cubriendo herramientas aprobadas, tipos de datos y proceso de anonimización, cumpliendo LOPDP",
      herramientas: "Claude Pro + LOPDP texto oficial + Google Docs para el documento",
      pasos: [
        "Listar todas las herramientas IA que tu empresa usa o planea usar actualmente",
        "Para cada herramienta, verificar en sus términos de servicio la política de datos (¿usan tus datos para entrenar?)",
        "Identificar todos los tipos de datos que tu empresa maneja que podrían ser personales bajo LOPDP",
        "Clasificar cada tipo de dato: puede subirse a la nube sin restricción, requiere anonimización, o está prohibido",
        "Documentar el proceso de anonimización estándar para los datasets más usados en análisis",
        "Usar Claude para generar la primera versión del protocolo en 1 página",
        "Revisar y ajustar con criterio legal propio o de un asesor",
        "Redactar la lista blanca de herramientas aprobadas con niveles de uso",
      ],
      resultado: "Protocolo de uso responsable de IA de 1-2 páginas con lista blanca de herramientas, clasificación de tipos de datos, proceso de anonimización estándar y responsable designado",
      criterios: [
        { criterio: "Identificación completa de herramientas y su política de datos", puntos: 20 },
        { criterio: "Clasificación correcta de tipos de datos bajo LOPDP", puntos: 25 },
        { criterio: "Proceso de anonimización documentado y aplicable", puntos: 25 },
        { criterio: "Protocolo de 1-2 páginas claro y aplicable inmediatamente", puntos: 20 },
        { criterio: "Responsable y proceso de actualización definidos", puntos: 10 },
      ],
    },
    recursos: [
      { titulo: "LOPDP Ecuador — Texto oficial", url: "https://www.telecomunicaciones.gob.ec/wp-content/uploads/2021/06/Ley-Organica-de-Datos-Personales.pdf", tipo: "documentacion", descripcion: "Ley Orgánica de Protección de Datos Personales del Ecuador, Registro Oficial 2021." },
      { titulo: "Anthropic — Privacy Policy", url: "https://www.anthropic.com/legal/privacy", tipo: "documentacion", descripcion: "Política de privacidad de Anthropic: cómo maneja los datos en cada tipo de plan." },
      { titulo: "OpenAI — Enterprise Privacy", url: "https://openai.com/enterprise-privacy/", tipo: "documentacion", descripcion: "Política de privacidad empresarial de OpenAI con garantías para planes Team y Enterprise." },
    ],
  },

  // M4 — Optimización de producción con IA
  {
    id: 16,
    titulo: "Análisis de cuellos de botella con ChatGPT y datos reales",
    modulo: MOD4,
    moduloNum: 4,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Identificar cuellos de botella industriales con ChatGPT — método paso a paso",
    videoDuracion: "~55 min · Español",
    slidesUrl: "",
    teoria: `Un cuello de botella es la operación o recurso que limita el rendimiento de todo el sistema productivo. Puede ser una máquina, un operador, un proceso, un espacio físico o un flujo de información. La teoría de los cuellos de botella, formalizada por Eliyahu Goldratt en "La Meta", establece un principio contraproducente: optimizar cualquier parte del sistema que no sea el cuello de botella no mejora el rendimiento total — solo genera inventario en proceso y crea la ilusión de eficiencia local.

Identificar el cuello de botella correcto es el primer paso. Los síntomas clásicos son: la estación tiene siempre trabajo esperando (cola de inventario en proceso delante), sus operadores rara vez esperan material, es la que más limita el flujo cuando se analiza el throughput, y es la que primero siente el impacto cuando hay variabilidad aguas arriba. Un cuello de botella incorrectamente identificado lleva a inversiones de mejora en el lugar equivocado.

El flujo de análisis con ChatGPT tiene cuatro pasos. Paso 1 — Recopilar datos del sistema: tiempos de ciclo de cada estación, tasas de defectos por estación, tiempos de paro por máquina, inventario en proceso entre estaciones. Paso 2 — Cargar a ChatGPT y explorar: "Tengo datos de una línea de producción de [producto] con [N] estaciones. Aquí están los tiempos de ciclo y tasas de defecto. Identifica cuál es el cuello de botella y por qué." Paso 3 — Análisis de impacto: "Si elimino este cuello de botella o lo reduzco en un 20%, ¿cuál sería el impacto en el throughput total de la línea?" Paso 4 — Opciones de solución: "Genera 5 alternativas para reducir el tiempo de ciclo del cuello de botella identificado, ordenadas de menor a mayor inversión requerida."

El prompt completo para análisis de cuello de botella: "CONTEXTO: Tenemos una línea de producción de [producto] en [ciudad, Ecuador] con 6 estaciones. Los datos de la última semana son: Estación 1 (Corte): tiempo ciclo 45 seg, defectos 0.5%, paros 15 min/día. Estación 2 (Doblez): tiempo ciclo 38 seg, defectos 0.8%, paros 8 min/día. Estación 3 (Soldadura): tiempo ciclo 72 seg, defectos 3.2%, paros 45 min/día. Estación 4 (Pintura): tiempo ciclo 55 seg, defectos 1.1%, paros 25 min/día. Estación 5 (Ensamblaje): tiempo ciclo 41 seg, defectos 0.4%, paros 12 min/día. Estación 6 (Empaque): tiempo ciclo 35 seg, defectos 0.3%, paros 5 min/día. ROL: eres un ingeniero industrial experto en optimización de líneas de producción. TAREA: 1) Identifica el cuello de botella y justifica con datos. 2) Calcula el throughput actual de la línea. 3) Calcula el throughput potencial si se elimina el cuello de botella. 4) Propón las 3 mejores acciones para reducir el tiempo de ciclo del cuello de botella. FORMATO: Primero la identificación con justificación, luego los cálculos en tabla, luego el plan de acción."

Los cinco métodos más comunes para reducir un cuello de botella sin inversión de capital, ordenados por impacto típico: primero, reducir el tiempo de setup/cambio de herramienta (SMED — Single Minute Exchange of Die); segundo, reducir defectos en la estación que eliminan piezas del flujo y requieren reproceso; tercero, aplicar mantenimiento preventivo más frecuente para reducir paros no planificados; cuarto, optimizar el método de trabajo con estudio de tiempos y movimientos; quinto, reorganizar el flujo de trabajo para eliminar movimientos innecesarios del operador. ChatGPT puede ayudar a cuantificar el impacto de cada opción con los datos disponibles.

La priorización de inversión basada en el análisis de cuello de botella cambia completamente el ROI de los proyectos de mejora. Invertir USD 50.000 en una máquina que no es el cuello de botella puede generar cero mejora en el throughput total. La misma inversión en el cuello de botella puede aumentar la producción total un 20-30%. ChatGPT puede generar el análisis de ROI comparativo: "Con los datos de producción actual y precio de venta [X], ¿cuál es el ingreso adicional mensual si aumentamos el throughput en un 25% al eliminar el cuello de botella en soldadura?"`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Análisis de cuellos de botella con ChatGPT\nMódulo 4 — Tema 1\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "Qué es un cuello de botella", contenido: "La operación que limita el throughput de todo el sistema.\n\nRegla Goldratt: optimizar lo que NO es el cuello de botella no mejora el sistema — solo genera inventario en proceso." },
      { titulo: "Síntomas del cuello de botella", contenido: "• Cola de inventario en proceso delante de la estación\n• Operadores rara vez esperan material\n• Limita el throughput cuando hay variabilidad\n• Primera que se afecta con problemas aguas arriba" },
      { titulo: "Flujo de análisis con ChatGPT", contenido: "1. Recopilar: tiempos ciclo, defectos, paros, WIP entre estaciones\n2. Explorar: identificar cuello con datos\n3. Impacto: ¿qué pasa si lo reduzco 20%?\n4. Soluciones: 5 alternativas menor a mayor inversión" },
      { titulo: "5 métodos sin capital", contenido: "1. SMED: reducir setup y cambio de herramienta\n2. Reducir defectos que eliminan piezas del flujo\n3. Mantenimiento preventivo más frecuente\n4. Estudio de tiempos y movimientos\n5. Eliminar movimientos innecesarios del operador" },
      { titulo: "ROI del análisis correcto", contenido: "$50k en máquina que NO es cuello de botella = 0% mejora throughput.\n$50k en el cuello de botella = +20-30% throughput.\n\nChatGPT calcula el ingreso adicional mensual." },
    ],
    quiz: [
      { pregunta: "¿Cuál es la regla fundamental de la Teoría de Restricciones respecto a los cuellos de botella?", opciones: ["Optimizar todas las estaciones por igual", "Optimizar cualquier parte que no sea el cuello de botella no mejora el throughput total", "El cuello de botella siempre es la máquina más vieja", "Aumentar personal en todas las estaciones"], respuesta: 1, explicacion: "Goldratt establece que el sistema solo mejora cuando se trabaja directamente sobre su restricción (cuello de botella)." },
      { pregunta: "¿Cuál de estos síntomas indica que una estación ES el cuello de botella?", opciones: ["Sus operadores a menudo esperan material sin hacer nada", "Siempre tiene cola de inventario en proceso esperando y sus operadores rara vez esperan", "Es la estación con menor tiempo de ciclo", "Produce sin ningún defecto"], respuesta: 1, explicacion: "El cuello de botella siempre tiene demanda mayor a su capacidad: cola delante y operadores ocupados continuamente." },
      { pregunta: "De los 5 métodos para reducir un cuello de botella sin capital, ¿cuál aplica la metodología SMED?", opciones: ["Mantenimiento preventivo", "Reducir defectos", "Reducir el tiempo de setup y cambio de herramienta", "Reorganizar el layout"], respuesta: 2, explicacion: "SMED (Single Minute Exchange of Die) es la metodología para reducir tiempos de setup a menos de 10 minutos." },
      { pregunta: "¿Por qué es crucial identificar correctamente el cuello de botella antes de invertir?", opciones: ["No importa dónde se invierte", "Invertir en lo que no es el cuello de botella puede no generar ninguna mejora en el throughput total", "El cuello de botella siempre está en la última estación", "El análisis es solo académico"], respuesta: 1, explicacion: "La inversión mal dirigida puede tener ROI de cero si no ataca la restricción real del sistema." },
      { pregunta: "En el ejemplo del prompt, la Estación 3 (Soldadura) con tiempo de ciclo de 72 segundos es el cuello de botella. ¿Por qué?", opciones: ["Tiene el menor número de operadores", "Tiene el mayor tiempo de ciclo (72 seg), mayor tasa de defectos (3.2%) y mayor tiempo de paros (45 min/día)", "Es la estación del medio", "Produce el componente más importante"], respuesta: 1, explicacion: "El mayor tiempo de ciclo limita el ritmo de la línea; sumado a mayor defecto y mayor paro, confirma que es la restricción." },
    ],
    ejercicio: {
      titulo: "Identificar y atacar el cuello de botella de tu línea",
      objetivo: "Analizar los datos reales de tu línea de producción con ChatGPT, identificar el cuello de botella con evidencia y generar un plan de mejora con ROI calculado",
      herramientas: "ChatGPT Plus + datos de producción reales o de ejemplo + Google Sheets",
      datosEjemplo: "Dataset de ejemplo: línea de ensamblaje de luminarias LED, 5 estaciones: Corte PCB (30s, 0.3%, 10min paro), Soldadura SMD (65s, 2.8%, 40min paro), Ensamblaje carcasa (42s, 0.6%, 15min paro), Prueba eléctrica (38s, 1.1%, 20min paro), Empaque (25s, 0.2%, 8min paro). Precio venta $18/unidad, turno de 8 horas.",
      pasos: [
        "Recopilar datos de tu línea: tiempos de ciclo, % defectos y minutos de paro por estación",
        "Ejecutar el prompt completo de análisis de cuello de botella con ChatGPT",
        "Verificar manualmente la identificación: ¿la estación señalada tiene cola de WIP en la realidad?",
        "Calcular el throughput actual y el potencial si se elimina el cuello de botella",
        "Solicitar a ChatGPT las 5 alternativas de mejora ordenadas por inversión",
        "Seleccionar las 2 alternativas más viables para tu empresa y estimar su impacto",
        "Calcular el ROI de cada alternativa: inversión requerida / ingreso adicional mensual",
        "Presentar el análisis en tabla en Google Sheets con recomendación fundamentada",
      ],
      resultado: "Análisis de cuello de botella documentado con evidencia, tabla de throughput actual vs potencial, 5 alternativas de mejora con estimación de ROI y recomendación de las 2 más viables",
      criterios: [
        { criterio: "Identificación correcta del cuello de botella con justificación", puntos: 25 },
        { criterio: "Cálculo de throughput actual y potencial", puntos: 20 },
        { criterio: "5 alternativas de mejora con nivel de inversión", puntos: 25 },
        { criterio: "ROI calculado para las 2 alternativas recomendadas", puntos: 20 },
        { criterio: "Verificación cruzada con realidad operativa", puntos: 10 },
      ],
    },
    recursos: [
      { titulo: "La Meta — Eliyahu Goldratt", url: "https://www.amazon.com/Goal-Process-Ongoing-Improvement/dp/0884271951", tipo: "lectura", descripcion: "El libro fundacional de la Teoría de Restricciones (TOC) — lectura obligatoria para el ingeniero industrial." },
      { titulo: "Lean Manufacturing — Lean Enterprise Institute", url: "https://www.lean.org/explore-lean/what-is-lean/", tipo: "documentacion", descripcion: "Principios y herramientas Lean para identificar y eliminar desperdicios y cuellos de botella." },
      { titulo: "ChatGPT Plus", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "Plataforma para análisis de cuellos de botella con datos reales de producción." },
    ],
  },
  {
    id: 17,
    titulo: "OEE y Takt Time: diagnóstico con IA",
    modulo: MOD4,
    moduloNum: 4,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "OEE y Takt Time con IA — diagnóstico de eficiencia industrial en 20 minutos",
    videoDuracion: "~60 min · Español",
    slidesUrl: "",
    teoria: `El OEE (Overall Equipment Effectiveness o Efectividad Global del Equipo) es el indicador más usado en manufactura para medir qué tan bien se aprovecha el tiempo disponible de un equipo o línea de producción. El Takt Time es el ritmo al que la demanda del cliente exige producir. Juntos, estos dos indicadores forman el diagnóstico básico de eficiencia de cualquier operación manufacturera. Con IA, calcularlos, interpretarlos y generar el plan de acción toma 20 minutos en lugar de varias horas.

El OEE se calcula como el producto de tres factores: Disponibilidad × Rendimiento × Calidad. La Disponibilidad es el porcentaje del tiempo planificado en que el equipo estuvo disponible para producir (descuenta paros). El Rendimiento es la velocidad real de producción vs la velocidad máxima teórica. La Calidad es el porcentaje de unidades producidas sin defecto. Un OEE del 85% se considera clase mundial en manufactura continua. El promedio real de la industria está entre 60-65%. En Ecuador, la mayoría de PYMES industriales tiene OEE entre 45-65% sin saberlo.

La fórmula completa. Disponibilidad = (Tiempo disponible − Tiempo de paros) / Tiempo disponible. Rendimiento = (Unidades reales producidas × Tiempo ciclo ideal) / Tiempo disponible. Calidad = Unidades buenas / Unidades producidas totales. OEE = Disponibilidad × Rendimiento × Calidad.

El prompt para calcular y diagnosticar OEE con ChatGPT: "CONTEXTO: Tengo datos de producción de una prensadora hidráulica en una planta metalmecánica en Quito. Turno de 8 horas (480 min). Datos del día: tiempo de paros planificados (almuerzo, mantenimiento) = 60 min. Tiempo de paros no planificados = 45 min. Velocidad nominal = 120 piezas/hora. Piezas reales producidas = 310. Piezas con defecto = 18. ROL: eres un ingeniero industrial experto en OEE y manufactura esbelta. TAREA: 1) Calcula la Disponibilidad, Rendimiento, Calidad y OEE con las fórmulas estándar. 2) Compara contra el benchmark de clase mundial (85%). 3) Identifica cuál de los tres factores (D, R o C) tiene mayor impacto en el OEE bajo. 4) Propón las 3 acciones más impactantes para subir el OEE en los próximos 30 días. FORMATO: primero tabla con cálculos paso a paso, luego análisis comparativo, luego plan de acción."

El Takt Time es la velocidad a la que el sistema debe producir para satisfacer la demanda del cliente. Se calcula como: Tiempo disponible de producción / Demanda del cliente en ese período. Si tu turno tiene 420 minutos de producción neta y el cliente pide 210 unidades por turno, el Takt Time es 2 minutos por unidad. Esto significa que cada estación de la línea debe completar una unidad cada 2 minutos para estar en equilibrio con la demanda. Cualquier estación con tiempo de ciclo mayor al Takt Time es un cuello de botella desde la perspectiva del cliente.

El diagnóstico de Takt Time con ChatGPT: "CONTEXTO: Mi planta produce contenedores de plástico. La demanda del cliente es 850 unidades por turno de 8 horas. El tiempo de producción neto (descontando descansos) es 450 minutos por turno. Tengo 5 estaciones con tiempos de ciclo de: 55 seg, 62 seg, 48 seg, 71 seg y 45 seg. ROL: ingeniero industrial experto en balance de línea y manufactura esbelta. TAREA: 1) Calcula el Takt Time requerido. 2) Identifica qué estaciones están por encima del Takt Time y cuánto. 3) Calcula cuántas estaciones necesito en paralelo para cada cuello de botella. 4) Propón el balance de línea óptimo para alcanzar el Takt Time. FORMATO: tabla comparativa tiempo ciclo vs Takt Time, análisis de desequilibrio, propuesta de balance."

Combinar OEE y Takt Time da el diagnóstico más completo de la operación. Si el OEE es bajo (por ejemplo 65%) y el Takt Time se está cumpliendo, significa que estás sobre-corriendo la línea — produciendo más velocidad de lo que el cliente pide, generando inventario innecesario. Si el OEE es bajo y el Takt Time no se está cumpliendo, tienes un problema doble: ineficiencia y demanda insatisfecha. Si el OEE es alto (85%+) y el Takt Time no se cumple, el problema es capacidad — necesitas más recursos. Este diagnóstico combinado es lo que le permite al ingeniero industrial hacer la recomendación correcta de inversión.`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "OEE y Takt Time con IA\nMódulo 4 — Tema 2\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "OEE — definición", contenido: "OEE = Disponibilidad × Rendimiento × Calidad\n\nClase mundial: 85%\nPromedio industria: 60-65%\nPYMEs Ecuador: 45-65% (sin saberlo)" },
      { titulo: "Fórmulas OEE", contenido: "D = (Tiempo disponible − Paros) / Tiempo disponible\nR = (Unidades reales × Ciclo ideal) / Tiempo disponible\nC = Unidades buenas / Unidades totales producidas" },
      { titulo: "Takt Time", contenido: "Takt Time = Tiempo disponible neto / Demanda del cliente\n\nEjemplo: 420 min / 210 unidades = 2 min/unidad\n\nEstaciones con ciclo > Takt Time son cuellos de botella vs demanda." },
      { titulo: "Diagnóstico combinado", contenido: "OEE bajo + Takt OK: sobre-corriendo, inventario innecesario\nOEE bajo + Takt mal: doble problema\nOEE alto + Takt mal: problema de capacidad, necesitas más recursos" },
    ],
    quiz: [
      { pregunta: "¿Cuál es el OEE considerado 'clase mundial' en manufactura continua?", opciones: ["50%", "70%", "85%", "100%"], respuesta: 2, explicacion: "85% de OEE se considera clase mundial; el promedio real de la industria está entre 60-65%." },
      { pregunta: "Si el tiempo disponible es 480 min, los paros son 80 min, ¿cuál es la Disponibilidad?", opciones: ["100%", "83.3%", "16.7%", "80%"], respuesta: 1, explicacion: "Disponibilidad = (480-80)/480 = 400/480 = 83.3%" },
      { pregunta: "¿Cómo se calcula el Takt Time?", opciones: ["Demanda / Tiempo disponible", "Tiempo disponible neto / Demanda del cliente por período", "Tiempo de ciclo × Número de estaciones", "Velocidad nominal / Velocidad real"], respuesta: 1, explicacion: "Takt Time = Tiempo disponible neto / Demanda del cliente. Representa el ritmo al que el cliente exige producir." },
      { pregunta: "Si el OEE es alto (88%) pero el Takt Time no se cumple, ¿cuál es el diagnóstico?", opciones: ["Problema de eficiencia en las máquinas", "Problema de capacidad: se necesitan más recursos para satisfacer la demanda", "El OEE no importa en este caso", "Los operadores no están capacitados"], respuesta: 1, explicacion: "OEE alto + Takt insatisfecho indica que el equipo es eficiente pero insuficiente para la demanda — el problema es capacidad, no eficiencia." },
      { pregunta: "¿Cuál de los tres factores del OEE impacta directamente la tasa de defectos?", opciones: ["Disponibilidad", "Rendimiento", "Calidad", "Los tres por igual"], respuesta: 2, explicacion: "El factor Calidad del OEE = Unidades buenas / Unidades totales producidas, y es el que captura directamente los defectos." },
    ],
    ejercicio: {
      titulo: "Diagnóstico OEE + Takt Time de tu operación",
      objetivo: "Calcular el OEE real de un equipo o línea de tu empresa, compararlo contra benchmark, calcular el Takt Time requerido y generar el plan de mejora",
      herramientas: "ChatGPT Plus + datos reales de producción + Google Sheets",
      datosEjemplo: "Dataset de ejemplo: inyectora de plástico, turno 8h (480 min), paros planificados 60 min, paros no planificados 55 min, velocidad nominal 90 piezas/hora, piezas reales 235, defectos 12. Demanda cliente: 220 unidades/turno.",
      pasos: [
        "Recopilar datos del turno: tiempo planificado, paros, unidades producidas, defectos, velocidad nominal",
        "Ejecutar el prompt de OEE con ChatGPT y obtener D, R, C y OEE calculados",
        "Verificar los cálculos manualmente en Google Sheets",
        "Calcular el Takt Time requerido con la demanda real del cliente",
        "Comparar los tiempos de ciclo de cada estación contra el Takt Time",
        "Identificar los 3 factores prioritarios para subir el OEE",
        "Generar el plan de acción a 30 días con métricas de seguimiento",
        "Calcular el impacto económico de subir el OEE al 80% (unidades adicionales × precio de venta)",
      ],
      resultado: "Diagnóstico OEE documentado con D, R, C calculados, comparativa vs benchmark, análisis Takt Time y plan de mejora a 30 días con impacto económico",
      criterios: [
        { criterio: "OEE calculado correctamente con los 3 factores", puntos: 25 },
        { criterio: "Comparativa vs benchmark clase mundial documentada", puntos: 15 },
        { criterio: "Takt Time calculado y estaciones comparadas", puntos: 20 },
        { criterio: "Plan de mejora a 30 días con 3+ acciones", puntos: 25 },
        { criterio: "Impacto económico calculado", puntos: 15 },
      ],
    },
    recursos: [
      { titulo: "OEE — The Complete Guide — Vorne", url: "https://www.oee.com/", tipo: "documentacion", descripcion: "Guía completa de OEE con fórmulas, benchmarks y casos de mejora de Vorne Industries." },
      { titulo: "Lean Takt Time — Lean Enterprise Institute", url: "https://www.lean.org/lexicon-terms/takt-time/", tipo: "documentacion", descripcion: "Definición y cálculo del Takt Time con ejemplos industriales del LEI." },
      { titulo: "ChatGPT Plus", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "Plataforma para cálculo y análisis de OEE y Takt Time con datos reales." },
    ],
  },
  {
    id: 18,
    titulo: "Teoría de Restricciones aplicada con IA",
    modulo: MOD4,
    moduloNum: 4,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Teoría de Restricciones con IA — los 5 pasos de Goldratt aplicados",
    videoDuracion: "~55 min · Español",
    slidesUrl: "",
    teoria: `La Teoría de Restricciones (TOC — Theory of Constraints) de Eliyahu Goldratt es uno de los marcos de mejora continua más poderosos en manufactura. Su premisa central: cualquier sistema tiene al menos una restricción que limita su rendimiento, y el camino de mejora siempre pasa por identificar y explotar esa restricción antes de optimizar cualquier otro elemento. Con IA, los cinco pasos del proceso de mejora TOC se pueden ejecutar más rápido y con más rigor analítico.

Los cinco pasos del TOC son: Paso 1 — Identificar la restricción del sistema: cuál es el cuello de botella que limita el throughput. Paso 2 — Explotar la restricción: obtener el máximo throughput posible de la restricción sin inversión adicional, solo con mejor gestión. Paso 3 — Subordinar todo lo demás a la restricción: ajustar el ritmo de todos los demás recursos al ritmo de la restricción para no generar cola innecesaria. Paso 4 — Elevar la restricción: si después de explotar y subordinar el sistema sigue limitado, invertir en aumentar la capacidad de la restricción. Paso 5 — Volver al paso 1: una vez que la restricción es superada, surge una nueva restricción en otro lugar.

El prompt para análisis TOC completo con ChatGPT: "CONTEXTO: Tengo una planta de [producto] en Ecuador con 6 procesos: Recepción de MP (capacidad 500 kg/h), Molienda (cap 350 kg/h), Mezclado (cap 480 kg/h), Moldeo (cap 290 kg/h), Enfriamiento (cap 450 kg/h), Empaque (cap 520 kg/h). La demanda del mercado es 400 kg/h. ROL: eres un experto en Teoría de Restricciones y consultor de manufactura. TAREA: Aplica los 5 pasos del TOC a este sistema. En el Paso 2 (Explotar), sugiere 3 formas de extraer más capacidad del proceso limitante sin inversión. En el Paso 3 (Subordinar), indica qué ajuste deben hacer los demás procesos. En el Paso 4, calcula el ROI de invertir en aumentar la capacidad del restricción en 30%. FORMATO: un párrafo por paso con tabla de capacidades al inicio."

El concepto del tambor-amortiguador-cuerda (Drum-Buffer-Rope o DBR) es la implementación operativa del TOC. El Tambor es la restricción: marca el ritmo de todo el sistema. El Amortiguador es el inventario protector frente a la restricción: garantiza que la restricción nunca se quede sin trabajo por variabilidad aguas arriba. La Cuerda es el mecanismo de control: libera material al sistema al ritmo del tambor para que no se acumule inventario innecesario antes de la restricción. Claude puede ayudar a diseñar el sistema DBR para tu planta específica.

La diferencia entre TOC, Lean y Six Sigma es importante para que el ingeniero sepa cuándo usar cada uno. TOC: cuando el problema principal es capacidad (el cuello de botella) — enfocarse en throughput. Lean: cuando el problema principal es el desperdicio (tiempo, movimiento, inventario) — enfocarse en flujo. Six Sigma: cuando el problema principal es la variabilidad y los defectos — enfocarse en proceso. En la práctica, las tres metodologías son complementarias y la mayoría de las plantas necesita elementos de las tres según el tipo de problema que enfrenta. ChatGPT puede ayudar a diagnosticar cuál de las tres es más urgente dado el perfil de tu operación.

Para pymes industriales ecuatorianas, la secuencia práctica recomendada es: primero aplicar TOC para identificar y atacar la restricción principal (resultado en 2-4 semanas); segundo, aplicar Lean para eliminar desperdicios en la restricción ya identificada (resultado en 1-3 meses); tercero, aplicar Six Sigma para reducir la variabilidad del proceso mejorado (resultado en 3-6 meses). Esta secuencia maximiza el impacto visible en el menor tiempo posible y construye momentum para la transformación.`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Teoría de Restricciones con IA\nMódulo 4 — Tema 3\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "Los 5 pasos del TOC", contenido: "1. Identificar la restricción del sistema\n2. Explotar: máximo throughput sin inversión\n3. Subordinar: ajustar el resto al ritmo de la restricción\n4. Elevar: invertir en aumentar capacidad de la restricción\n5. Volver al paso 1 (nueva restricción surge)" },
      { titulo: "Drum-Buffer-Rope (DBR)", contenido: "Tambor: la restricción marca el ritmo\nAmortiguador: inventario protector frente a la restricción\nCuerda: libera material al ritmo del tambor\n\nEvita inventario innecesario y garantiza que la restricción nunca espera." },
      { titulo: "TOC vs Lean vs Six Sigma", contenido: "TOC → problema es capacidad → enfoque throughput\nLean → problema es desperdicio → enfoque flujo\nSix Sigma → problema es variabilidad → enfoque proceso\n\nSecuencia práctica Ecuador: TOC → Lean → Six Sigma" },
    ],
    quiz: [
      { pregunta: "En los 5 pasos del TOC, ¿qué significa 'explotar' la restricción?", opciones: ["Destruirla físicamente", "Obtener el máximo throughput posible de ella sin inversión adicional, solo con mejor gestión", "Ignorarla temporalmente", "Reemplazarla con otra máquina"], respuesta: 1, explicacion: "Explotar significa extraer el máximo rendimiento de la restricción existente antes de considerar cualquier inversión." },
      { pregunta: "En un sistema con 6 procesos de 500, 350, 480, 290, 450 y 520 kg/h, ¿cuál es la restricción con demanda de 400 kg/h?", opciones: ["Proceso de 500 kg/h", "Proceso de 290 kg/h (Moldeo)", "Proceso de 520 kg/h", "No hay restricción porque la demanda es 400"], respuesta: 1, explicacion: "290 kg/h es menor que la demanda de 400 kg/h, por lo que es la restricción que limita el throughput del sistema." },
      { pregunta: "¿Cuál es el propósito del Amortiguador en el sistema DBR?", opciones: ["Reducir la velocidad del sistema", "Garantizar que la restricción nunca se quede sin material por variabilidad aguas arriba", "Aumentar la demanda del cliente", "Reemplazar a los operadores"], respuesta: 1, explicacion: "El amortiguador de inventario protege a la restricción de quedarse ociosa por problemas en procesos anteriores." },
      { pregunta: "¿Cuándo es más apropiado aplicar Six Sigma en lugar de TOC?", opciones: ["Cuando el problema principal es la capacidad (cuello de botella)", "Cuando el problema principal es la variabilidad y los defectos del proceso", "Solo en grandes empresas", "Nunca en Ecuador"], respuesta: 1, explicacion: "Six Sigma ataca variabilidad y defectos; TOC ataca restricciones de capacidad; Lean ataca desperdicios." },
      { pregunta: "¿Qué ocurre después de que el Paso 4 del TOC eleva una restricción hasta que deja de serlo?", opciones: ["El proceso se detiene definitivamente", "Volver al Paso 1: una nueva restricción emerge en otro punto del sistema", "El sistema queda perfecto para siempre", "Se cierra la planta"], respuesta: 1, explicacion: "Superar una restricción siempre revela la siguiente; TOC es un proceso de mejora continua cíclico." },
    ],
    ejercicio: {
      titulo: "Análisis TOC completo de tu proceso productivo",
      objetivo: "Aplicar los 5 pasos del TOC a tu proceso productivo real con asistencia de ChatGPT y generar el plan DBR operativo",
      herramientas: "ChatGPT Plus + datos de capacidad de cada proceso + Google Docs",
      datosEjemplo: "Planta de snacks en Ambato: MP lavado 800 kg/h, Corte 650 kg/h, Fritura 400 kg/h, Condimentado 580 kg/h, Empaque 700 kg/h. Demanda 500 kg/h. Precio venta $2.50/kg.",
      pasos: [
        "Mapear todos los procesos con su capacidad máxima real (no nominal)",
        "Ejecutar el prompt TOC completo con ChatGPT identificando la restricción",
        "Desarrollar 3 acciones de Explotación sin inversión para la restricción",
        "Definir el nivel de Subordinación de cada proceso aguas arriba",
        "Calcular el ROI de Elevar la restricción en 25% de capacidad",
        "Diseñar el sistema DBR: tamaño del amortiguador y mecanismo de la cuerda",
        "Calcular el impacto en throughput y margen si se implementa el DBR",
        "Documentar el plan de implementación en 60 días",
      ],
      resultado: "Análisis TOC completo con restricción identificada, plan de explotación, diseño DBR y ROI de elevación calculado en documento de 2 páginas",
      criterios: [
        { criterio: "Restricción correctamente identificada con justificación cuantitativa", puntos: 20 },
        { criterio: "3 acciones de explotación sin inversión viables", puntos: 25 },
        { criterio: "Diseño del sistema DBR (tambor, amortiguador, cuerda)", puntos: 25 },
        { criterio: "ROI de elevación calculado con datos reales", puntos: 20 },
        { criterio: "Plan de implementación a 60 días", puntos: 10 },
      ],
    },
    recursos: [
      { titulo: "Theory of Constraints — TOC Institute", url: "https://www.tocinstitute.org/theory-of-constraints.html", tipo: "documentacion", descripcion: "Guía completa del TOC Institute con los 5 pasos y ejemplos de implementación." },
      { titulo: "La Meta — Eliyahu Goldratt (resumen)", url: "https://www.lean.org/", tipo: "lectura", descripcion: "Resumen ejecutivo del libro fundacional de la Teoría de Restricciones." },
      { titulo: "ChatGPT Plus", url: "https://chat.openai.com", tipo: "herramienta", descripcion: "Co-facilitador del análisis TOC con cálculos y simulaciones." },
    ],
  },
  {
    id: 19,
    titulo: "Simulación de escenarios productivos con Claude",
    modulo: MOD4,
    moduloNum: 4,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Simulación de escenarios What-If con Claude — decisiones sin riesgo",
    videoDuracion: "~55 min · Español",
    slidesUrl: "",
    teoria: `La simulación de escenarios o análisis What-If es la práctica de preguntar "¿qué pasaría si...?" antes de implementar un cambio en la operación real. Esta práctica reduce el riesgo de decisiones costosas al explorar sus consecuencias probables en un entorno virtual antes de comprometer recursos. Con Claude, la simulación de escenarios no requiere software especializado de simulación como Arena o AnyLogic — para el nivel de precisión que necesita una PYME industrial en Ecuador, Claude ofrece análisis suficientemente riguroso a costo cero adicional.

Los tipos de escenarios que Claude puede simular para el ingeniero industrial son cinco. Primero, escenarios de capacidad: "¿qué pasa si agrego un segundo turno?", "¿qué pasa si compro una segunda máquina para el cuello de botella?", "¿cuánto aumenta mi producción si reduzco el tiempo de setup en un 30%?". Segundo, escenarios de demanda: "¿puedo cumplir con un pedido urgente de 50% más de demanda la próxima semana sin horas extra?", "¿si perdiera a mi cliente principal, cuántos meses tengo de runway?". Tercero, escenarios de costos: "¿qué pasa con mis costos unitarios si el costo de la materia prima sube un 15%?", "¿cuál es el impacto en el margen si subo el salario básico en un 10%?". Cuarto, escenarios de calidad: "¿cuánto cuesta mantener una tasa de defectos del 3% vs invertir para bajarla al 1%?". Quinto, escenarios de supply chain: "¿qué pasa si mi proveedor principal falla por 2 semanas?", "¿necesito buffer de inventario extra con el proveedor nuevo de menor confiabilidad?".

El prompt para simulación de escenarios: "CONTEXTO: Mi planta produce 800 unidades diarias de [producto] con un turno de 8 horas. Los costos son: materia prima $1.20/u, mano de obra $0.80/u, costos indirectos $0.40/u, precio de venta $3.50/u, margen actual $1.10/u. La capacidad instalada es de 1.000 u/día. ROL: eres un analista de operaciones y finanzas industriales. TAREA: Simula los siguientes 4 escenarios y compara su impacto en margen y throughput: Escenario 1 — Agregar turno nocturno (costo laboral +60% por recargo nocturno, capacidad total +80%). Escenario 2 — Subir precio de venta un 8% con estimación de reducción de demanda del 5%. Escenario 3 — Invertir $15.000 en automatizar el cuello de botella para aumentar capacidad al 100%. Escenario 4 — Tercerizar el empaque (reducción de costo laboral 30%, pero costo tercero $0.35/u). FORMATO: tabla comparativa con: Escenario, Margen/u, Throughput/día, Ingreso mensual estimado, Payback de inversión si aplica. Cierre con recomendación de escenario óptimo."

La diferencia entre una simulación Claude y una simulación profesional con software como Arena o Simio es importante de entender. Claude puede simular correctamente relaciones lineales y aritméticas: costos, capacidades, márgenes. Donde Claude tiene limitaciones es en la dinámica estocástica: colas de espera con distribuciones de probabilidad, variabilidad aleatoria de tiempos de proceso, fenómenos emergentes de sistemas complejos. Para ese nivel de sofisticación, se necesita software de simulación discreta. Para el 80% de las decisiones operativas de una PYME industrial ecuatoriana, la precisión de Claude es más que suficiente.

El análisis de sensibilidad es la extensión natural de la simulación de escenarios. En lugar de analizar cuatro escenarios discretos, el análisis de sensibilidad pregunta: "¿en qué rango de valores de esta variable cambia la decisión óptima?". Ejemplo: "¿a qué precio de venta deja de ser rentable el turno nocturno?" Claude puede calcular el punto de cruce exacto: "Calcula el precio de venta mínimo que hace que el turno nocturno sea más rentable que la operación actual. Presente el resultado como función lineal y gráficamente si es posible."`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Simulación de escenarios productivos con Claude\nMódulo 4 — Tema 4\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "5 tipos de escenarios", contenido: "1. Capacidad: segundo turno, nueva máquina, SMED\n2. Demanda: pedido urgente, pérdida de cliente\n3. Costos: alza MP, salarios, energía\n4. Calidad: costo defecto vs inversión en mejora\n5. Supply chain: falla de proveedor, buffer de inventario" },
      { titulo: "Claude vs software de simulación", contenido: "Claude: relaciones lineales, costos, márgenes — suficiente para 80% de decisiones de PYME.\n\nArena/Simio: dinámica estocástica, colas probabilísticas, sistemas complejos." },
      { titulo: "Análisis de sensibilidad", contenido: "Extiende la simulación: ¿en qué rango de valores cambia la decisión óptima?\n\n'¿A qué precio de venta deja de ser rentable el turno nocturno?'\n\nClaude calcula el punto de cruce exacto." },
    ],
    quiz: [
      { pregunta: "¿Cuál es el propósito principal de la simulación de escenarios What-If?", opciones: ["Reemplazar al gerente de producción", "Explorar las consecuencias de un cambio antes de comprometer recursos reales", "Generar reportes decorativos", "Solo para empresas grandes"], respuesta: 1, explicacion: "El análisis What-If reduce el riesgo de decisiones costosas al simular sus consecuencias en un entorno virtual." },
      { pregunta: "¿Para qué tipo de simulación Claude NO es suficiente y se necesita software especializado?", opciones: ["Calcular impacto de alza de materia prima", "Comparar márgenes entre escenarios de precio", "Simulación de colas con distribuciones de probabilidad estocástica", "Calcular el payback de una inversión"], respuesta: 2, explicacion: "Claude es excelente para relaciones lineales y aritméticas, pero la dinámica estocástica (colas probabilísticas) requiere Arena, Simio u otros." },
      { pregunta: "¿Qué responde un análisis de sensibilidad que no responde la simulación de 4 escenarios?", opciones: ["Nada diferente", "En qué rango de valores de una variable cambia la decisión óptima (el punto de cruce)", "El costo exacto de cada decisión", "Cuándo jubilarse"], respuesta: 1, explicacion: "La sensibilidad identifica los umbrales exactos donde una decisión deja de ser óptima frente a la alternativa." },
    ],
    ejercicio: {
      titulo: "Simulación de 4 escenarios de mejora con Claude",
      objetivo: "Simular 4 escenarios de mejora operativa para tu empresa con Claude y seleccionar el óptimo con análisis de ROI y sensibilidad",
      herramientas: "Claude Pro + datos reales de costos y producción + Google Sheets",
      datosEjemplo: "Empresa de manufactura de zapatos en Ambato: producción 200 pares/día, MP $8/par, MOD $4/par, CI $2/par, precio venta $22/par, capacidad instalada 240 pares/día.",
      pasos: [
        "Documentar los datos actuales de producción, costos y márgenes",
        "Definir 4 escenarios relevantes para tu situación actual",
        "Ejecutar el prompt de simulación con los 4 escenarios",
        "Construir la tabla comparativa en Google Sheets",
        "Hacer análisis de sensibilidad para el escenario ganador",
        "Identificar el punto de cruce donde el escenario dejaría de ser óptimo",
        "Escribir la recomendación ejecutiva de 200 palabras",
      ],
      resultado: "Tabla comparativa de 4 escenarios con margen, throughput e ingreso, análisis de sensibilidad y recomendación ejecutiva justificada",
      criterios: [
        { criterio: "4 escenarios relevantes y bien definidos", puntos: 20 },
        { criterio: "Tabla comparativa correcta con cálculos verificados", puntos: 30 },
        { criterio: "Análisis de sensibilidad del escenario óptimo", puntos: 25 },
        { criterio: "Recomendación ejecutiva clara y fundamentada", puntos: 25 },
      ],
    },
    recursos: [
      { titulo: "What-If Analysis — MIT OpenCourseWare", url: "https://ocw.mit.edu/courses/15-778-management-of-supply-chains-summer-2004/", tipo: "documentacion", descripcion: "Material del MIT sobre análisis de escenarios en operaciones y cadena de suministro." },
      { titulo: "Claude Pro", url: "https://claude.ai/", tipo: "herramienta", descripcion: "Plataforma para simulaciones lineales y análisis de sensibilidad de escenarios industriales." },
      { titulo: "Google Sheets", url: "https://sheets.google.com", tipo: "herramienta", descripcion: "Herramienta para construir modelos de simulación y tablas comparativas de escenarios." },
    ],
  },
  {
    id: 20,
    titulo: "Dashboard de producción con Power BI IA",
    modulo: MOD4,
    moduloNum: 4,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Power BI IA para ingenieros industriales — dashboards que toman decisiones",
    videoDuracion: "~65 min · Español",
    slidesUrl: "",
    teoria: `Power BI es la herramienta de inteligencia de negocios más usada en empresas industriales medianas y grandes en Ecuador. Desde 2023, Microsoft ha integrado capacidades de IA directamente en Power BI que permiten detectar anomalías automáticamente, generar explicaciones en lenguaje natural de por qué un indicador cambió, y construir modelos predictivos sin escribir una sola línea de código. Para el ingeniero industrial, esto transforma Power BI de una herramienta de visualización pasiva a un sistema activo de soporte a decisiones.

Las funcionalidades de IA en Power BI más útiles para manufactura son cuatro. Primero, Anomaly Detection: detecta automáticamente valores atípicos en series de tiempo y los resalta visualmente con explicaciones. Si la producción de un día cae un 18% sin motivo aparente, Power BI IA lo detecta, lo muestra en el gráfico y genera una hipótesis de causa. Segundo, Key Influencers: analiza qué variables tienen mayor influencia en un KPI objetivo. Por ejemplo: "¿qué factores influyen más en la tasa de defectos de la línea 3?" — la respuesta puede ser turno, operador, proveedor de MP o temperatura ambiental. Tercero, Q&A (preguntas en lenguaje natural): escribe en el dashboard "¿cuál fue la producción máxima del turno noche en enero?" y Power BI responde con el visual correcto. Cuarto, Smart Narratives: genera automáticamente un párrafo en lenguaje natural que explica el dashboard para personas que no saben leer gráficos.

El flujo para construir un dashboard de producción con Power BI IA tiene cinco pasos. Paso 1 — Fuente de datos: conectar Power BI a tu Excel de producción (Get Data → Excel → seleccionar archivo). Paso 2 — Modelo de datos: definir las relaciones entre tablas (fechas, turnos, líneas, KPIs). Paso 3 — Medidas DAX para los KPIs principales: OEE, tasa de defectos, throughput por turno, costo por unidad. Paso 4 — Visualizaciones con IA: activar Anomaly Detection en las series de tiempo críticas y añadir el visual Key Influencers para la tasa de defectos. Paso 5 — Smart Narrative: añadir un cuadro de texto con Smart Narrative que genera el resumen ejecutivo automáticamente al refrescar el dashboard.

Para calcular el OEE en Power BI con DAX, las medidas necesarias son: OEE = Disponibilidad × Rendimiento × Calidad (como medidas DAX calculadas a partir de los datos de producción). Claude puede generar el código DAX completo para estas medidas si le proporcionas la estructura de tus tablas. El prompt: "Tengo en Power BI una tabla 'Produccion' con columnas: Fecha, Turno, Línea, TiempoDisponible_min, TiempoParos_min, UnidadesProducidas, UnidadesBuenas, VelocidadNominal_u_min. Genera el código DAX para calcular: Disponibilidad, Rendimiento, Calidad y OEE."

La integración entre ChatGPT y Power BI amplía las posibilidades del dashboard. Con el conector de Power BI para ChatGPT (disponible en Microsoft Fabric), puedes hacer preguntas al dashboard en lenguaje natural y recibir insights generados por GPT-4 sobre los datos. Alternativamente, exporta los datos del dashboard a Excel mensualmente y usa ChatGPT para el análisis narrativo: "Aquí están los datos del mes. Redacta el informe ejecutivo de producción de noviembre con los 3 hallazgos más importantes y las 3 recomendaciones para diciembre."

El diseño del dashboard tiene principios críticos para el contexto industrial ecuatoriano. Regla 1: máximo 7 KPIs por página (el cerebro humano no puede procesar más simultáneamente). Regla 2: el rojo y verde deben usarse solo para alertas, nunca decorativamente. Regla 3: los números más importantes siempre van arriba a la izquierda (es donde los ojos van primero). Regla 4: incluir siempre el período de referencia del comparativo (vs semana anterior, vs meta, vs mismo período año anterior). Regla 5: el dashboard se prueba con el usuario final antes de publicar — si el gerente no puede responder 3 preguntas de negocio en menos de 30 segundos mirando el dashboard, rediseñar.`,
    presentacionSlides: [
      { titulo: "Portada", contenido: "Dashboard de producción con Power BI IA\nMódulo 4 — Tema 5 (cierre módulo)\nIA Aplicada para Ingeniería Industrial — itseia.ai" },
      { titulo: "4 funcionalidades IA en Power BI", contenido: "1. Anomaly Detection: detecta valores atípicos automáticamente\n2. Key Influencers: qué variables afectan más el KPI\n3. Q&A: preguntas en lenguaje natural al dashboard\n4. Smart Narratives: párrafo explicativo auto-generado" },
      { titulo: "5 pasos para construir el dashboard", contenido: "1. Conectar a Excel de producción\n2. Modelo de datos con relaciones\n3. Medidas DAX para OEE y KPIs\n4. Activar Anomaly Detection + Key Influencers\n5. Smart Narrative para resumen ejecutivo" },
      { titulo: "DAX con Claude", contenido: "Claude genera el código DAX para Disponibilidad, Rendimiento, Calidad y OEE si le describes la estructura de tu tabla.\n\nMedidas reutilizables en cualquier reporte." },
      { titulo: "5 principios de diseño", contenido: "1. Máx 7 KPIs por página\n2. Rojo/verde solo para alertas\n3. Número más importante arriba izquierda\n4. Siempre incluir período de referencia del comparativo\n5. Probar con el usuario final: 3 preguntas en 30 segundos" },
    ],
    quiz: [
      { pregunta: "¿Qué hace la funcionalidad Anomaly Detection de Power BI IA?", opciones: ["Corrige errores de datos automáticamente", "Detecta y resalta valores atípicos en series de tiempo con hipótesis de causa", "Elimina datos duplicados", "Genera presentaciones automáticamente"], respuesta: 1, explicacion: "Anomaly Detection identifica caídas o picos inusuales en los KPIs y proporciona explicaciones automáticas del cambio." },
      { pregunta: "¿Cuántos KPIs máximo se recomiendan por página en un dashboard industrial?", opciones: ["20", "7", "50", "1"], respuesta: 1, explicacion: "El cerebro humano no puede procesar más de 7 elementos simultáneamente con criterio; más KPIs generan confusión, no claridad." },
      { pregunta: "¿Para qué sirve la funcionalidad Key Influencers en Power BI?", opciones: ["Para seguir a influencers de redes sociales", "Para identificar qué variables tienen mayor influencia estadística en un KPI objetivo", "Para calcular el salario de empleados", "Para diseñar el logo de la empresa"], respuesta: 1, explicacion: "Key Influencers analiza correlaciones entre variables y el KPI objetivo para identificar los factores más importantes." },
      { pregunta: "¿Cómo puede Claude ayudar en Power BI?", opciones: ["Claude no se conecta a Power BI de ninguna forma", "Generando código DAX para medidas si le describes la estructura de las tablas", "Solo diseñando el fondo del dashboard", "Reemplazando completamente a Power BI"], respuesta: 1, explicacion: "Claude puede generar código DAX correcto para medidas como OEE, tasas y comparativos si le describes la estructura de tus tablas." },
      { pregunta: "¿Cuándo se considera que el diseño del dashboard es correcto?", opciones: ["Cuando tiene muchos colores", "Cuando el usuario final puede responder 3 preguntas de negocio en menos de 30 segundos", "Cuando tiene más de 20 gráficos", "Cuando el gerente nunca lo mira"], respuesta: 1, explicacion: "La prueba de los 30 segundos verifica que el dashboard cumple su propósito: apoyar decisiones rápidas sin necesitar explicación." },
    ],
    ejercicio: {
      titulo: "Dashboard de producción con OEE y Anomaly Detection",
      objetivo: "Construir un dashboard de producción funcional en Power BI con al menos 5 KPIs, OEE calculado con DAX y Anomaly Detection activo",
      herramientas: "Power BI Desktop (gratis) + datos de producción en Excel + Claude para código DAX",
      datosEjemplo: "Dataset de ejemplo: 90 días de datos diarios con columnas: Fecha, Turno, Línea, TiempoDisponible_min, TiempoParos_min, UnidadesProducidas, UnidadesBuenas, VelocidadNominal. Descargar de: https://www.oee.com/ o crear con Excel con datos de ejemplo.",
      pasos: [
        "Instalar Power BI Desktop (gratis en microsoft.com/power-bi)",
        "Importar el dataset de producción desde Excel",
        "Crear las medidas DAX para Disponibilidad, Rendimiento, Calidad y OEE (pedir código a Claude)",
        "Construir gráfico de OEE por día con Anomaly Detection activo",
        "Añadir Key Influencers con la tasa de defectos como variable objetivo",
        "Diseñar el dashboard con máximo 7 KPIs siguiendo los 5 principios",
        "Añadir Smart Narrative y probar la Q&A con 3 preguntas reales",
        "Publicar en Power BI Service (plan gratuito) y compartir el link",
      ],
      resultado: "Dashboard publicado en Power BI Service con OEE, Anomaly Detection, Key Influencers y Smart Narrative, más link accesible para compartir con el equipo",
      criterios: [
        { criterio: "OEE calculado correctamente con DAX (D, R, C, OEE)", puntos: 25 },
        { criterio: "Anomaly Detection activado en al menos 1 KPI de tiempo", puntos: 20 },
        { criterio: "Diseño con máximo 7 KPIs y principios de diseño aplicados", puntos: 20 },
        { criterio: "Smart Narrative o Q&A funcionando", puntos: 15 },
        { criterio: "Dashboard publicado y compartible", puntos: 20 },
      ],
    },
    recursos: [
      { titulo: "Power BI Desktop — Descarga gratuita", url: "https://powerbi.microsoft.com/es-es/downloads/", tipo: "herramienta", descripcion: "Descarga gratuita de Power BI Desktop para construir dashboards sin costo." },
      { titulo: "Power BI AI Features — Microsoft docs", url: "https://learn.microsoft.com/es-es/power-bi/visuals/power-bi-visualization-anomaly-detection", tipo: "documentacion", descripcion: "Documentación oficial de Microsoft sobre Anomaly Detection en Power BI." },
      { titulo: "DAX Guide — SQLBI", url: "https://dax.guide/", tipo: "documentacion", descripcion: "Referencia completa de funciones DAX con ejemplos para medidas en Power BI." },
    ],
  },

  // M5 — Mantenimiento predictivo con IA
  {
    id: 21,
    titulo: "Fundamentos de mantenimiento predictivo y sensores IoT",
    modulo: MOD5,
    moduloNum: 5,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Fundamentos de mantenimiento predictivo y sensores IoT",
    teoria: `## Mantenimiento predictivo: del correctivo al inteligente

El mantenimiento industrial ha evolucionado en cuatro generaciones. La primera fue el mantenimiento **correctivo**: reparar cuando falla. La segunda, el **preventivo**: cambiar piezas en intervalos fijos independientemente de su estado real. La tercera, el **predictivo**: monitorear condición y actuar solo cuando los datos lo justifican. La cuarta, emergente hoy, es el **mantenimiento autónomo con IA**: sistemas que aprenden y anticipan fallas sin intervención humana.

Para Ecuador, donde el costo de paradas no planificadas en sectores como floricultura, bananeras y fabricación de alimentos puede representar miles de dólares por hora, el mantenimiento predictivo no es un lujo: es una necesidad competitiva.

### ¿Qué es el mantenimiento predictivo?

El mantenimiento predictivo (PdM) consiste en monitorear continuamente el estado de los equipos mediante sensores y analizar los datos recolectados para predecir cuándo ocurrirá una falla antes de que suceda. A diferencia del preventivo, no interviene en intervalos fijos: interviene cuando los datos indican que el equipo está degradándose y se aproxima al umbral de falla.

Los beneficios documentados en la industria son significativos:
- Reducción de paradas no planificadas entre 30% y 50%
- Extensión de vida útil de equipos entre 20% y 40%
- Reducción de costos de mantenimiento entre 10% y 25%
- Mejora en disponibilidad de equipos (OEE) entre 5% y 10% adicionales

### Sensores IoT en mantenimiento industrial

Los **sensores IoT** (Internet of Things) son el sistema nervioso del mantenimiento predictivo. Cada tipo de sensor mide una señal física diferente que revela el estado interno del equipo:

**Vibración:** Acelerómetros MEMS o piezoeléctricos instalados en carcasas de motores, bombas y compresores. El espectro de vibración revela desbalance, desalineación, desgaste de rodamientos y problemas de engranajes. Un rodamiento sano tiene un espectro limpio; un rodamiento con defecto incipiente muestra picos en frecuencias específicas calculables con las fórmulas BPFO, BPFI, BSF y FTF.

**Temperatura:** Termopares tipo K, RTDs (PT100/PT1000) y cámaras termográficas. El aumento de temperatura en bobinados de motores indica sobrecarga o problemas de aislamiento. En transformadores, el aceite caliente señala arco eléctrico interno. Las variaciones anómalas frente a la temperatura ambiental son el primer indicio de un problema.

**Corriente eléctrica:** Transformadores de corriente (CT) instalados en el panel. La firma de corriente del motor (MCSA — Motor Current Signature Analysis) revela barras rotas del rotor, excentricidad y problemas de rodamientos con mayor precisión que la vibración en muchos casos, y sin necesidad de acceder al equipo físicamente.

**Presión y caudal:** Transductores de presión en sistemas hidráulicos y neumáticos. Una caída de presión indica fugas; una presión excesiva señala obstrucciones. En bombas centrífugas, la curva presión-caudal define el punto de operación óptimo; desviarse de él acelera el desgaste.

**Ultrasonido:** Sensores de 40 kHz detectan fugas de aire comprimido y gas, cavitación en bombas y fallas incipientes en rodamientos antes de que aparezcan en el espectro de vibración. La detección de fugas de aire comprimido sola puede justificar el ROI completo del sistema IoT en plantas medianas.

### Arquitectura de un sistema IoT predictivo

Una implementación típica tiene cuatro capas:

1. **Capa de percepción:** Sensores instalados en los equipos críticos
2. **Capa de conectividad:** Transmisión de datos via WiFi, LoRaWAN, Modbus TCP o 4G/LTE al servidor central
3. **Capa de procesamiento:** Base de datos de series de tiempo (InfluxDB, TimescaleDB) + motor de análisis (Python, ML models)
4. **Capa de presentación:** Dashboard (Grafana, Tableau, Power BI) con alertas automáticas por email/SMS/WhatsApp

### Priorización con matriz de criticidad

No todos los equipos justifican instrumentación IoT completa. La **matriz de criticidad** evalúa cada equipo en dos ejes:

- **Consecuencia de la falla:** Impacto en producción, seguridad, calidad y costo de reparación (escala 1-5)
- **Probabilidad de falla:** Historial de averías, edad del equipo, condiciones de operación (escala 1-5)

El producto de ambos factores da el índice de riesgo. Equipos con índice ≥ 15 son candidatos prioritarios para PdM con IoT. Entre 8-14, conviene mantenimiento preventivo reforzado. Bajo 8, mantenimiento correctivo planificado es suficiente.

### IA sobre los datos de sensores

Los datos crudos de sensores tienen poco valor sin análisis. La IA agrega tres capacidades:

**Detección de anomalías:** Algoritmos como Isolation Forest, LSTM Autoencoder o One-Class SVM aprenden el comportamiento "normal" del equipo y lanzan alertas cuando los datos se desvían de ese baseline, incluso cuando no hay umbrales definidos previamente.

**Pronóstico de vida útil restante (RUL):** Modelos de regresión o redes neuronales recurrentes predicen cuántas horas o ciclos le quedan al componente antes de fallar, permitiendo programar la intervención en la ventana de mantenimiento más conveniente.

**Diagnóstico automático de causa raíz:** Modelos de clasificación entrenados con casos históricos identifican automáticamente si la anomalía detectada corresponde a desbalance, desalineación, rodamiento defectuoso u otro modo de falla, orientando al técnico antes de que abra el equipo.

### Caso práctico Ecuador: florícola en Cayambe

Una florícola con 40 motores de bombeo de riego implementó sensores de vibración y temperatura en los 12 equipos más críticos (bombas principales de riego y cuartos fríos). En seis meses detectaron tres fallas incipientes en rodamientos y evitaron dos paradas que, en temporada alta de exportación, habrían costado aproximadamente $18,000 en pérdida de flor y horas extra de reparación de emergencia. El ROI del sistema se recuperó en el primer año de operación.`,
    presentacionSlides: [
      { titulo: "Evolución del mantenimiento industrial", contenido: "Correctivo → Preventivo → Predictivo → Autónomo IA. Cada generación reduce costos y aumenta disponibilidad. Ecuador: sectores agroindustrial y manufacturero lideran adopción." },
      { titulo: "¿Qué mide cada sensor IoT?", contenido: "Vibración (rodamientos, desbalance), Temperatura (sobrecarga, aislamiento), Corriente MCSA (barras rotor, excentricidad), Presión/Caudal (fugas, obstrucciones), Ultrasonido (fugas aire, cavitación)." },
      { titulo: "Arquitectura de 4 capas", contenido: "1. Percepción (sensores físicos) → 2. Conectividad (WiFi/LoRaWAN/4G) → 3. Procesamiento (InfluxDB + Python/ML) → 4. Presentación (Grafana/Tableau + alertas)." },
      { titulo: "Matriz de criticidad: priorizar inversión", contenido: "Consecuencia × Probabilidad = Índice de riesgo. ≥15: PdM con IoT obligatorio. 8-14: preventivo reforzado. <8: correctivo planificado. No todo equipo justifica sensor." },
      { titulo: "Beneficios documentados del PdM", contenido: "Paradas no planificadas: -30% a -50%. Vida útil equipos: +20% a +40%. Costos mantenimiento: -10% a -25%. OEE: +5% a +10% adicionales sobre línea base actual." },
      { titulo: "IA sobre datos de sensores", contenido: "Detección anomalías (Isolation Forest, LSTM). Pronóstico RUL (vida útil restante en horas/ciclos). Diagnóstico automático causa raíz (clasificador de modos de falla)." },
      { titulo: "Caso Ecuador: florícola Cayambe", contenido: "12 motores críticos instrumentados. 3 fallas detectadas antes de ocurrir. 2 paradas evitadas en temporada alta. Ahorro estimado: $18,000. ROI recuperado en <12 meses." },
      { titulo: "Punto de partida práctico", contenido: "Paso 1: hacer matriz de criticidad de tus equipos. Paso 2: identificar los 3-5 más críticos. Paso 3: definir qué variable física medir. Paso 4: cotizar sensores IoT (desde $80 por punto)." },
    ],
    quiz: [
      { pregunta: "¿Cuál es la diferencia principal entre mantenimiento preventivo y predictivo?", opciones: ["El preventivo usa sensores y el predictivo no", "El preventivo interviene en intervalos fijos; el predictivo interviene cuando los datos indican degradación", "El predictivo es más caro y menos efectivo", "Son lo mismo, solo cambia el nombre"], respuesta: 1, explicacion: "El preventivo cambia piezas en fechas fijas independientemente del estado real. El predictivo monitorea condición y actúa solo cuando los datos justifican la intervención." },
      { pregunta: "¿Qué es MCSA en el contexto de sensores industriales?", opciones: ["Motor Current Signature Analysis — análisis de la firma de corriente del motor", "Manual Control System Architecture", "Mean Cycle Stress Analysis", "Maintenance Cost Saving Algorithm"], respuesta: 0, explicacion: "MCSA analiza la firma de corriente del motor para detectar barras rotas del rotor, excentricidad y problemas de rodamientos sin acceder físicamente al equipo." },
      { pregunta: "En la matriz de criticidad, ¿qué índice mínimo justifica implementar PdM con IoT?", opciones: ["5 o más", "8 o más", "15 o más", "20 o más"], respuesta: 2, explicacion: "Un índice de criticidad ≥ 15 (Consecuencia × Probabilidad en escala 1-5) indica equipos que justifican la inversión en instrumentación IoT completa para mantenimiento predictivo." },
      { pregunta: "¿Para qué sirve el análisis de ultrasonido en mantenimiento predictivo?", opciones: ["Solo para medir temperatura de rodamientos", "Detectar fugas de aire comprimido, cavitación en bombas y fallas incipientes en rodamientos", "Medir la velocidad de rotación del eje", "Calcular el OEE del equipo"], respuesta: 1, explicacion: "Los sensores de ultrasonido (40 kHz) detectan fugas de aire comprimido, cavitación y fallas incipientes en rodamientos antes de que aparezcan en el espectro de vibración." },
      { pregunta: "¿Qué es RUL en el contexto del mantenimiento predictivo con IA?", opciones: ["Remote Update Log — registro de actualizaciones remotas", "Remaining Useful Life — vida útil restante predicha por el modelo de IA", "Reliability Under Load — confiabilidad bajo carga", "Routine Upgrade Level — nivel de actualización rutinaria"], respuesta: 1, explicacion: "RUL (Remaining Useful Life) es la predicción de cuántas horas o ciclos le quedan al componente antes de fallar, generada por modelos de ML entrenados con datos históricos del equipo." },
    ],
    ejercicio: {
      titulo: "Matriz de criticidad y plan de sensores para tu planta",
      objetivo: "Construir una matriz de criticidad de equipos reales y definir qué sensores IoT instalar en los más críticos, con justificación técnica y económica.",
      herramientas: "Excel o Google Sheets, Claude.ai (claude.ai/chat)",
      pasos: [
        "Lista al menos 10 equipos de tu planta (o una planta que conozcas) en una hoja de cálculo con columnas: Equipo, Área, Función, Edad (años), Promedio fallas/año.",
        "Agrega columnas para evaluar Consecuencia de Falla (1-5) en cuatro dimensiones: Producción, Seguridad, Calidad, Costo reparación. Promedia los cuatro para obtener el score de consecuencia.",
        "Agrega columna Probabilidad de Falla (1-5) basándote en: historial de averías (más averías = mayor score), edad del equipo y condiciones de operación (ambiente corrosivo, temperaturas extremas, vibración).",
        "Calcula Índice de Criticidad = Consecuencia × Probabilidad. Ordena de mayor a menor. Colorea en rojo ≥15, amarillo 8-14, verde <8.",
        "Para los 3 equipos con mayor índice de criticidad, usa Claude con este prompt: 'Soy ingeniero industrial en Ecuador. El equipo [nombre] tiene función [función]. ¿Qué sensores IoT específicos recomendarías para mantenimiento predictivo? Incluye tipo de sensor, marca accesible, costo aproximado en USD y variable que mide.' Documenta las recomendaciones.",
        "Elabora una tabla resumen con los 3 equipos prioritarios, los sensores recomendados y el costo estimado de instrumentación. Compara con el costo de una parada no planificada de 8 horas en cada equipo.",
      ],
      resultado: "Matriz de criticidad completa con ≥10 equipos, top 3 con plan de sensores IoT documentado y análisis costo-beneficio preliminar.",
      criterios: [
        { criterio: "Matriz de criticidad con 10+ equipos y evaluación en 4 dimensiones", puntos: 30 },
        { criterio: "Cálculo correcto del índice y clasificación con colores", puntos: 20 },
        { criterio: "Plan de sensores para 3 equipos prioritarios con especificaciones técnicas", puntos: 30 },
        { criterio: "Análisis costo-beneficio con números reales de la planta", puntos: 20 },
      ],
    },
    recursos: [
      { titulo: "Reliabilityweb — PdM Knowledge Center", url: "https://reliabilityweb.com/articles/category/predictive-maintenance", tipo: "lectura", descripcion: "Biblioteca de artículos técnicos sobre mantenimiento predictivo, análisis de vibración y confiabilidad industrial." },
      { titulo: "InfluxDB — Time Series Database para IoT", url: "https://docs.influxdata.com/influxdb/v2/", tipo: "documentacion", descripcion: "Documentación oficial de InfluxDB, la base de datos de series de tiempo más usada en proyectos IoT industriales." },
      { titulo: "ISO 13374 — Condition Monitoring of Machines", url: "https://www.iso.org/standard/57576.html", tipo: "documentacion", descripcion: "Estándar internacional para sistemas de monitoreo de condición de máquinas, referencia para estructurar datos de sensores." },
    ],
  },

  {
    id: 22,
    titulo: "Análisis de datos de vibración y temperatura con IA",
    modulo: MOD5,
    moduloNum: 5,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Análisis de datos de vibración y temperatura con IA",
    teoria: `## Vibración y temperatura: los idiomas del equipo industrial

Todo equipo industrial comunica su estado interno a través de señales físicas. La vibración y la temperatura son las dos señales más ricas en información sobre condición mecánica y eléctrica. Aprender a leerlas con herramientas de IA convierte al ingeniero industrial en un diagnosticador de primer nivel, capaz de detectar fallas antes de que se vuelvan costosas.

### Vibración: el espectro que revela todo

La vibración de una máquina es la suma de múltiples frecuencias, cada una generada por un componente específico. Un eje rotando genera vibración a la frecuencia de rotación (1×). Un desbalance genera un pico prominente en exactamente 1×RPM. Una desalineación genera picos en 1× y 2×RPM. Un rodamiento defectuoso genera picos en las frecuencias características de sus defectos: BPFO (defecto en pista externa), BPFI (pista interna), BSF (elemento rodante) y FTF (jaula).

**Fórmulas de frecuencias de rodamiento:**
- BPFO = (N/2) × RPM/60 × (1 – Bd/Pd × cos(α))
- BPFI = (N/2) × RPM/60 × (1 + Bd/Pd × cos(α))

Donde N = número de elementos rodantes, Bd = diámetro de la bola, Pd = diámetro del paso, α = ángulo de contacto.

La buena noticia es que no necesitas calcular estas fórmulas manualmente: ChatGPT y Claude pueden hacerlo si les das las especificaciones del rodamiento (número SKF, FAG, NSK, etc.), y además interpretar si los picos detectados corresponden a fallas o a comportamiento normal.

### Niveles de severidad de vibración

La norma **ISO 10816** establece límites de vibración para diferentes categorías de máquinas. Los cuatro niveles son:

- **Zona A (verde):** Máquina nueva, vibración muy baja
- **Zona B (amarillo):** Aceptable para operación continua a largo plazo
- **Zona C (naranja):** Inadecuada para operación continua; requiere acción correctiva próxima
- **Zona D (rojo):** Peligrosa; puede dañar el equipo; parar inmediatamente

La velocidad de vibración se mide en mm/s (RMS). Por ejemplo, para un motor de 15 kW sobre base rígida, la zona C comienza en 4.5 mm/s y la D en 11.2 mm/s.

### Temperatura: firma de la carga y el desgaste

La temperatura de rodamientos, bobinados de motores y contactos eléctricos sigue patrones predecibles. Un rodamiento correctamente lubricado opera entre 40°C y 70°C sobre la temperatura ambiente. Cuando supera 70°C sobre ambiente, indica falta de lubricación, contaminación, sobrecarga o daño estructural.

Para motores eléctricos, la **regla de los 10°C** es crítica: cada 10°C de aumento en la temperatura del bobinado sobre el límite de la clase de aislamiento reduce la vida útil del aislamiento a la mitad. Un motor clase F (155°C) operando continuamente a 165°C no durará la mitad de lo esperado: durará una cuarta parte.

### Análisis con Python y IA

El flujo práctico para analizar datos de sensores tiene cuatro pasos:

**Paso 1 — Importar y visualizar:**
```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv('vibration_motor_01.csv')
df['timestamp'] = pd.to_datetime(df['timestamp'])
df.plot(x='timestamp', y=['vib_x', 'vib_y', 'temp_bearing'])
```

**Paso 2 — Calcular estadísticos de señal:**
Los más útiles para diagnóstico de rodamientos son: RMS (energía total), Kurtosis (detecta impactos — valores >4 indican defecto), Crest Factor (ratio pico/RMS — normal <3, con defecto >6).

**Paso 3 — Detección de anomalías:**
```python
from sklearn.ensemble import IsolationForest
model = IsolationForest(contamination=0.05, random_state=42)
df['anomaly'] = model.fit_predict(df[['vib_rms', 'temp_bearing']])
# -1 = anomalía, 1 = normal
```

**Paso 4 — Interpretar con IA:**
Exporta las anomalías detectadas y el resumen estadístico, luego usa Claude con el prompt: *"Analiza estos datos de vibración de un motor trifásico de 30 kW a 1750 RPM. RMS promedio: [X] mm/s, Kurtosis máxima: [Y], temperatura rodamiento delantero: [Z]°C. ¿Qué modos de falla son probables? ¿Qué acción correctiva recomendarías?"*

### Correlación vibración-temperatura para diagnóstico

La correlación entre ambas señales es más potente que analizarlas por separado. Los patrones típicos son:

| Patrón | Diagnóstico probable |
|--------|---------------------|
| Vibración alta + temperatura alta | Desbalance severo o desalineación avanzada |
| Vibración alta + temperatura normal | Aflojamiento mecánico o problema de engranaje |
| Vibración baja + temperatura alta | Falta de lubricación o sobrecarga eléctrica |
| Vibración normal + temperatura normal + Kurtosis alta | Defecto incipiente de rodamiento (detectar temprano) |

Este análisis multivariable es exactamente lo que los modelos de ML aprenden a reconocer con datos históricos etiquetados de tu propia planta.

### Herramientas accesibles para Ecuador

Para equipos pequeños y medianos sin presupuesto para sistemas SCADA completos, existen opciones accesibles:

- **Fluke 810 o 3561 FC:** Analizadores de vibración portátiles con diagnóstico automático integrado, disponibles en distribuidores en Quito y Guayaquil
- **Arduino + ADXL345 + ESP32:** Solución DIY para <$50 por punto de medición, conecta a plataformas cloud gratuitas (ThingSpeak, Grafana Cloud free tier)
- **ChatGPT + datos Excel:** Para análisis estadístico sin programar: copiar y pegar datos de vibración y pedir interpretación con contexto del equipo`,
    presentacionSlides: [
      { titulo: "El espectro de vibración: cada frecuencia tiene un culpable", contenido: "1×RPM: desbalance. 2×RPM: desalineación. Frecuencias BPFO/BPFI/BSF/FTF: rodamientos. Armónicos de engranajes: desgaste de dientes. La IA interpreta el espectro en segundos." },
      { titulo: "Norma ISO 10816: límites de vibración", contenido: "Zona A (verde): máquina nueva. Zona B (amarillo): aceptable largo plazo. Zona C (naranja): acción correctiva próxima. Zona D (rojo): parar ya. Referencia para cada categoría de máquina." },
      { titulo: "Regla de los 10°C en motores eléctricos", contenido: "Cada 10°C sobre el límite de clase de aislamiento reduce la vida útil del bobinado a la mitad. Motor clase F (155°C) a 165°C → dura ¼ de lo esperado. Temperatura es predictor de vida útil." },
      { titulo: "Estadísticos clave de señal de vibración", contenido: "RMS: energía total (indica severidad). Kurtosis: detecta impactos incipientes (>4 = alerta). Crest Factor: ratio pico/RMS (normal <3, defecto >6). Python calcula los tres en segundos." },
      { titulo: "Detección de anomalías con Isolation Forest", contenido: "Algoritmo no supervisado: aprende el comportamiento 'normal' del equipo. No necesita etiquetas históricas. Detecta puntos que se desvían del patrón aprendido. Contamination=0.05 → 5% esperado de anomalías." },
      { titulo: "Correlación vibración+temperatura: 4 patrones diagnósticos", contenido: "Vibración+Temp altas → Desbalance/desalineación severa. Vibración alta+Temp normal → Aflojamiento. Vibración baja+Temp alta → Falta lubricación. Vibración normal+Kurtosis alta → Defecto incipiente." },
      { titulo: "Herramientas accesibles en Ecuador", contenido: "Fluke 810/3561 FC: diagnóstico automático portátil (distribuidores Quito/GYE). Arduino+ADXL345+ESP32: <$50/punto DIY → ThingSpeak free. ChatGPT+Excel: análisis sin programar." },
      { titulo: "Prompt para diagnóstico con Claude/ChatGPT", contenido: "Modelo: [nombre equipo, potencia, RPM]. RMS: [X] mm/s. Kurtosis: [Y]. Temp rodamiento: [Z]°C. Historial fallas: [descripción]. → Claude responde con diagnóstico diferencial y acción recomendada." },
    ],
    quiz: [
      { pregunta: "¿Qué indica un pico de vibración prominente exactamente en 1×RPM?", opciones: ["Defecto en rodamiento pista externa", "Desbalance del rotor", "Desalineación severa del eje", "Cavitación en bomba"], respuesta: 1, explicacion: "Un pico dominante en 1×RPM (la frecuencia de rotación) es la firma clásica del desbalance del rotor. La desalineación genera picos en 1× y 2×RPM simultáneamente." },
      { pregunta: "¿Qué mide la Kurtosis de una señal de vibración y qué valor indica defecto incipiente?", opciones: ["Energía total; Kurtosis >10 indica defecto", "Presencia de impactos; Kurtosis >4 indica defecto incipiente", "Frecuencia dominante; Kurtosis >2 es normal", "Temperatura equivalente; Kurtosis >7 es crítico"], respuesta: 1, explicacion: "La Kurtosis mide la presencia de impactos en la señal. Una señal sana tiene Kurtosis ~3. Valores >4 indican impactos repetitivos característicos de defectos incipientes en rodamientos." },
      { pregunta: "Según la regla de los 10°C, ¿qué ocurre con un motor clase F (155°C límite) que opera continuamente a 175°C?", opciones: ["Su vida útil se reduce a la mitad", "Su vida útil se reduce a 1/4 de lo esperado", "No tiene impacto mientras no supere 180°C", "Su vida útil se reduce a 1/8 de lo esperado"], respuesta: 1, explicacion: "A 175°C está 20°C sobre el límite. Cada 10°C reduce la vida a la mitad. Dos veces: ½ × ½ = ¼ de la vida útil esperada. Esta degradación acelerada es irreversible." },
      { pregunta: "¿Para qué sirve el algoritmo Isolation Forest en análisis de vibraciones?", opciones: ["Calcula las frecuencias BPFO y BPFI de rodamientos", "Detecta anomalías sin necesitar datos históricos etiquetados de fallas", "Mide la temperatura equivalente a partir de la vibración", "Genera informes de mantenimiento en formato PDF"], respuesta: 1, explicacion: "Isolation Forest es un algoritmo no supervisado que aprende el comportamiento normal del equipo y detecta puntos que se desvían, sin necesitar un dataset etiquetado de fallas históricas." },
      { pregunta: "Un motor muestra vibración normal pero Kurtosis de 5.8 y temperatura de rodamiento normal. ¿Cuál es el diagnóstico más probable?", opciones: ["El equipo está en perfectas condiciones", "Defecto incipiente en rodamiento (detección temprana posible)", "Sobrecarga eléctrica severa", "Desalineación avanzada del eje"], respuesta: 1, explicacion: "Vibración RMS normal con Kurtosis elevada (>4) y temperatura normal es el patrón típico de un defecto incipiente de rodamiento. Es el momento ideal para intervenir antes de que progrese a falla catastrófica." },
    ],
    ejercicio: {
      titulo: "Análisis de señal de vibración con Python y ChatGPT",
      objetivo: "Procesar datos reales (o simulados) de vibración de un motor, calcular estadísticos diagnósticos y usar IA para interpretar el estado del equipo.",
      herramientas: "Google Colab (colab.research.google.com), ChatGPT o Claude",
      pasos: [
        "En Google Colab, crea un nuevo notebook. En la primera celda, genera datos de vibración simulados: un motor normal (RMS ~1.2 mm/s, Kurtosis ~3) y el mismo motor con defecto de rodamiento (RMS ~3.5 mm/s, Kurtosis ~6.5). Usa numpy para generar las señales.",
        "Calcula los tres estadísticos diagnósticos para ambos estados: RMS = np.sqrt(np.mean(signal**2)), Kurtosis con scipy.stats.kurtosis(signal), Crest Factor = np.max(np.abs(signal)) / np.sqrt(np.mean(signal**2)).",
        "Grafica la señal en el tiempo y el histograma de amplitudes para ambos estados. Observa visualmente la diferencia en la forma del histograma (Kurtosis alta → colas más pesadas).",
        "Aplica Isolation Forest de sklearn a los estadísticos de ambos estados. Verifica que el algoritmo clasifica correctamente el estado con defecto como anomalía.",
        "Copia los estadísticos calculados (RMS, Kurtosis, Crest Factor) y la descripción del equipo simulado. Abre ChatGPT o Claude y usa el prompt: 'Soy ingeniero de mantenimiento. Motor 15 kW, 1450 RPM. Estado normal: RMS [X], Kurtosis [Y], CF [Z]. Estado anómalo: RMS [A], Kurtosis [B], CF [C]. ¿Qué diagnóstico diferencial propones y qué acción correctiva recomiendas?' Documenta la respuesta.",
        "Escribe un párrafo de conclusiones: ¿qué aprendiste sobre el valor de la Kurtosis para detección temprana? ¿Cómo usarías este análisis en un equipo real de tu empresa?",
      ],
      resultado: "Notebook de Google Colab con análisis completo, gráficas de señal, estadísticos calculados, resultado de Isolation Forest y diagnóstico de IA documentado.",
      criterios: [
        { criterio: "Notebook ejecutable con generación de señales normal y anómala", puntos: 25 },
        { criterio: "Cálculo correcto de RMS, Kurtosis y Crest Factor para ambos estados", puntos: 25 },
        { criterio: "Implementación y resultado de Isolation Forest con interpretación", puntos: 25 },
        { criterio: "Prompt a IA y diagnóstico documentado con análisis crítico", puntos: 25 },
      ],
    },
    recursos: [
      { titulo: "Google Colab — Entorno Python gratuito en la nube", url: "https://colab.research.google.com/", tipo: "herramienta", descripcion: "Plataforma gratuita de Google para ejecutar notebooks Python sin instalación. Ideal para análisis de datos de mantenimiento." },
      { titulo: "ISO 10816 — Vibration evaluation of machines", url: "https://www.iso.org/standard/57594.html", tipo: "documentacion", descripcion: "Norma internacional con límites de vibración por categoría de máquina. Referencia fundamental para diagnóstico de severidad." },
      { titulo: "SKF Bearing Calculator — Frecuencias de rodamientos", url: "https://www.skf.com/group/support/engineering-tools/skf-bearing-calculator", tipo: "herramienta", descripcion: "Calculadora oficial de SKF para frecuencias características BPFO, BPFI, BSF y FTF de cualquier referencia de rodamiento." },
    ],
  },

  {
    id: 23,
    titulo: "MTBF y MTTR: predicción de fallas con ChatGPT",
    modulo: MOD5,
    moduloNum: 5,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "MTBF y MTTR: predicción de fallas con ChatGPT",
    teoria: `## MTBF y MTTR: las métricas que cuantifican la confiabilidad

En ingeniería de mantenimiento, lo que no se mide no se puede mejorar. El **MTBF** (Mean Time Between Failures — Tiempo Medio Entre Fallas) y el **MTTR** (Mean Time To Repair — Tiempo Medio de Reparación) son las dos métricas más fundamentales para cuantificar el desempeño de los equipos y predecir su comportamiento futuro.

### MTBF: ¿cada cuánto falla?

El MTBF es el promedio de tiempo operativo entre fallas consecutivas de un equipo o componente. Se calcula como:

**MTBF = Tiempo total de operación / Número de fallas**

Por ejemplo, si un compresor operó 2,160 horas en el año y presentó 3 fallas, su MTBF = 2,160/3 = **720 horas** (30 días). Esto significa que, en promedio, el equipo opera 720 horas entre fallas.

El MTBF se usa para:
- **Programar el mantenimiento preventivo** antes de que el equipo alcance su MTBF
- **Calcular la disponibilidad** del equipo
- **Comparar equipos** de diferentes fabricantes o antigüedades
- **Justificar el reemplazo** cuando el MTBF disminuye sistemáticamente año a año

### MTTR: ¿cuánto tardamos en reparar?

El MTTR mide la velocidad de respuesta y eficiencia del equipo de mantenimiento:

**MTTR = Tiempo total de reparación / Número de reparaciones**

Un MTTR bajo indica: repuestos disponibles en almacén, técnicos capacitados, procedimientos de reparación documentados y herramientas adecuadas. Un MTTR alto señala exactamente lo opuesto: esperar por repuestos importados, técnicos sin experiencia específica o falta de documentación técnica.

### Disponibilidad: la métrica que integra ambas

La disponibilidad operacional combina MTBF y MTTR:

**Disponibilidad = MTBF / (MTBF + MTTR)**

Con el ejemplo anterior: MTBF = 720h, MTTR = 4h → Disponibilidad = 720/(720+4) = **99.4%**

Si el MTTR sube a 24h (un día perdido esperando repuesto importado): Disponibilidad = 720/(720+24) = **96.8%** → más de 2.5 puntos porcentuales menos, que en una planta de tres turnos representa aproximadamente 219 horas perdidas al año.

### Distribución de Weibull: predecir fallas con estadística

La distribución de Weibull es el modelo estadístico estándar para analizar datos de confiabilidad industrial. Su parámetro beta (β) revela el tipo de falla:

- **β < 1:** Mortalidad infantil — fallas decrecen con el tiempo. Típico de nuevos equipos mal instalados o rodamientos con defecto de fabricación
- **β = 1:** Fallas aleatorias — tasa constante, independiente de la edad. Componentes electrónicos en su "vida útil"
- **β > 1:** Desgaste — fallas aumentan con el tiempo. Rodamientos, correas, sellos. β entre 2 y 3 es típico de desgaste gradual; β >4 indica desgaste acelerado

El parámetro eta (η) es la vida característica: el tiempo al que el 63.2% de los componentes habrán fallado.

### ChatGPT como asistente de análisis de confiabilidad

ChatGPT puede realizar análisis estadísticos de confiabilidad cuando se le proporciona el historial de fallas correctamente estructurado. El prompt efectivo incluye:

1. Datos de fallas en formato tabular (fecha falla, fecha reparación, duración operación previa)
2. Contexto del equipo (tipo, potencia, aplicación, ambiente operativo)
3. Objetivo específico (calcular MTBF/MTTR, ajustar Weibull, predecir próxima falla, recomendar intervalo PM)

**Prompt modelo:**
*"Eres un experto en confiabilidad industrial. Tengo los siguientes datos de fallas de un motor de 30 kW en una florícola de Cayambe: [tabla de datos]. Calcula MTBF, MTTR y disponibilidad. Determina si las fallas siguen un patrón aleatorio o de desgaste. Recomienda el intervalo óptimo de mantenimiento preventivo para maximizar disponibilidad."*

ChatGPT realizará los cálculos, interpretará el patrón de fallas y entregará recomendaciones concretas. El ingeniero debe validar los resultados con su criterio y conocimiento del equipo.

### OEE y la relación con MTBF/MTTR

El OEE (Overall Equipment Effectiveness) es la métrica integradora de la eficiencia productiva:

**OEE = Disponibilidad × Rendimiento × Calidad**

La disponibilidad en el OEE es directamente función del MTBF y MTTR. Mejorar el MTBF en un 20% (mediante mantenimiento predictivo que previene fallas) y reducir el MTTR en un 30% (mediante almacén de repuestos críticos y procedimientos documentados) puede subir el OEE 3-5 puntos porcentuales, que en producción continua equivalen a decenas de miles de dólares anuales en capacidad productiva recuperada.

### Caso práctico: análisis de confiabilidad en planta de alimentos Ecuador

Una planta de procesamiento de palmito en Santo Domingo registró las fallas de su línea de envasado durante 18 meses. Al calcular el MTBF por componente, descubrieron que las electroválvulas neumáticas fallaban cada 340 horas en promedio (β=2.8 en Weibull → desgaste claro). Al implementar reemplazo preventivo a las 280 horas (80% del MTBF), las paradas no planificadas de esa causa bajaron de 12 eventos en 18 meses a 1, reduciendo el MTTR promedio de 3.2h a 0.8h (cambio planificado vs. reparación de emergencia).`,
    presentacionSlides: [
      { titulo: "MTBF y MTTR: las dos métricas fundacionales", contenido: "MTBF = Tiempo operación total / N° fallas. MTTR = Tiempo total reparación / N° reparaciones. Disponibilidad = MTBF / (MTBF + MTTR). Tres números que definen la confiabilidad de cualquier equipo." },
      { titulo: "¿Qué causa un MTTR alto?", contenido: "Repuestos importados sin stock local. Técnicos no capacitados en el equipo específico. Sin procedimientos de reparación documentados. Sin herramientas especiales. Cada causa tiene solución concreta." },
      { titulo: "Distribución de Weibull: ¿qué tipo de falla tengo?", contenido: "β<1: Mortalidad infantil (instalación defectuosa). β=1: Fallas aleatorias (electrónica). β>1: Desgaste (rodamientos, sellos, correas). β entre 2-3: Desgaste gradual típico en maquinaria industrial." },
      { titulo: "Disponibilidad: el impacto de reducir MTTR", contenido: "MTBF=720h, MTTR=4h → Disponibilidad 99.4%. MTTR=24h (esperar repuesto) → 96.8%. Diferencia: 219 horas perdidas/año en planta 3 turnos. Tener repuestos en almacén paga solo." },
      { titulo: "Prompt ChatGPT para análisis de confiabilidad", contenido: "Incluir: datos de fallas en tabla, tipo y potencia del equipo, ambiente operativo, objetivo (calcular MTBF/MTTR, ajustar Weibull, intervalo PM óptimo). ChatGPT calcula + interpreta + recomienda." },
      { titulo: "OEE y la cadena MTBF→Disponibilidad→OEE", contenido: "OEE = Disponibilidad × Rendimiento × Calidad. Mejorar MTBF 20% + reducir MTTR 30% → +3-5 puntos OEE. En planta continua = decenas de miles de dólares anuales recuperados." },
      { titulo: "Caso palmito Santo Domingo: de 12 fallas a 1", contenido: "Electroválvulas neumáticas: MTBF=340h, β=2.8 (desgaste). Solución: reemplazo preventivo a 280h (80% MTBF). Resultado: de 12 paradas a 1 en 18 meses. MTTR bajó de 3.2h a 0.8h." },
      { titulo: "Herramientas para análisis de confiabilidad", contenido: "Excel + funciones Weibull.DIST. Python: reliability library (pip install reliability). ReliaSoft Weibull++: software profesional. ChatGPT: análisis rápido desde tabla de datos pegada." },
    ],
    quiz: [
      { pregunta: "Un equipo operó 4,320 horas en el año y presentó 6 fallas. ¿Cuál es su MTBF?", opciones: ["420 horas", "720 horas", "540 horas", "360 horas"], respuesta: 1, explicacion: "MTBF = Tiempo total de operación / Número de fallas = 4,320h / 6 fallas = 720 horas por falla en promedio." },
      { pregunta: "¿Qué indica un parámetro beta (β) de Weibull igual a 0.7 en datos de fallas de un equipo?", opciones: ["Fallas por desgaste acelerado — reemplazar pronto", "Mortalidad infantil — fallas que disminuyen con el tiempo de operación", "Fallas aleatorias — sin tendencia temporal", "Desgaste gradual normal en maquinaria"], respuesta: 1, explicacion: "β < 1 indica mortalidad infantil: la tasa de fallas decrece con el tiempo. Típico de equipos con defectos de instalación, fabricación o rodamientos defectuosos que fallan pronto pero los sobrevivientes son confiables." },
      { pregunta: "¿Cuál es la fórmula de disponibilidad operacional?", opciones: ["MTBF × MTTR", "MTBF / MTTR", "MTBF / (MTBF + MTTR)", "(MTBF - MTTR) / MTBF"], respuesta: 2, explicacion: "Disponibilidad = MTBF / (MTBF + MTTR). Refleja la fracción del tiempo que el equipo está disponible para producir, considerando tanto la frecuencia de fallas (MTBF) como la velocidad de reparación (MTTR)." },
      { pregunta: "¿Cuál es la práctica recomendada para programar el reemplazo preventivo de un componente con β=2.8 y MTBF=340h?", opciones: ["Reemplazar exactamente a las 340 horas", "Reemplazar a las 500 horas (50% sobre MTBF)", "Reemplazar alrededor de las 272-280 horas (80% del MTBF)", "No reemplazar preventivamente; esperar la falla"], respuesta: 2, explicacion: "Con β>1 (desgaste) y MTBF conocido, la práctica estándar es intervenir al 70-85% del MTBF para evitar que el componente alcance la zona de falla probable. 80% × 340h = 272h es el intervalo óptimo." },
      { pregunta: "¿Qué información mínima necesita ChatGPT para calcular MTBF y recomendar intervalo de mantenimiento?", opciones: ["Solo el nombre del equipo y la marca", "Tabla de datos de fallas (fechas, duraciones), tipo de equipo, potencia y objetivo del análisis", "Solo el número total de fallas en el año", "El manual del fabricante completo en formato PDF"], respuesta: 1, explicacion: "ChatGPT necesita datos estructurados (tabla de fallas con fechas y duraciones), contexto del equipo (tipo, potencia, aplicación, ambiente) y el objetivo específico para realizar un análisis de confiabilidad útil." },
    ],
    ejercicio: {
      titulo: "Análisis MTBF/MTTR y predicción de fallas con ChatGPT",
      objetivo: "Calcular MTBF, MTTR y disponibilidad de un equipo real o simulado, identificar el patrón de Weibull y obtener recomendaciones de intervalo PM de ChatGPT.",
      herramientas: "Excel o Google Sheets, ChatGPT Plus o Claude",
      pasos: [
        "Crea una hoja de cálculo con el historial de fallas de un equipo (real o simulado). Columnas: N° falla, Fecha inicio falla, Fecha fin reparación, Horas operación desde última falla, Duración reparación (MTTR individual), Causa de falla.",
        "Calcula en la hoja: MTBF = PROMEDIO de columna 'Horas desde última falla'. MTTR = PROMEDIO de columna 'Duración reparación'. Disponibilidad = MTBF / (MTBF + MTTR). Expresa disponibilidad en porcentaje.",
        "Grafica un scatter plot de 'Número de falla' (eje X) vs 'Horas operación' (eje Y). Observa si hay tendencia: si las horas entre fallas disminuyen, el equipo se degrada (β>1). Si son aleatorias, β≈1.",
        "Copia la tabla completa de datos y pega en ChatGPT con el prompt: 'Eres experto en confiabilidad industrial. Analiza estos datos de fallas de [equipo] en una planta en Ecuador. Calcula MTBF y MTTR, determina el parámetro beta de Weibull (tipo de falla), calcula disponibilidad y recomienda el intervalo óptimo de mantenimiento preventivo. Incluye el costo estimado de una parada no planificada de 8 horas si la producción es de $500/hora.'",
        "Documenta las recomendaciones de ChatGPT. Evalúa críticamente: ¿son razonables para tu industria? ¿Coinciden con tu experiencia del equipo?",
        "Calcula el ahorro potencial: si implementas el PM en el intervalo recomendado y evitas 2 paradas no planificadas de 8h al año a $500/h cada una, ¿cuánto ahorras? Compara con el costo del PM planificado.",
      ],
      resultado: "Hoja de cálculo con análisis MTBF/MTTR/Disponibilidad, respuesta completa de ChatGPT documentada, evaluación crítica y cálculo de ahorro potencial.",
      criterios: [
        { criterio: "Historial de fallas estructurado con todas las columnas requeridas", puntos: 20 },
        { criterio: "Cálculo correcto de MTBF, MTTR y Disponibilidad con fórmulas visibles", puntos: 30 },
        { criterio: "Prompt bien construido y respuesta de ChatGPT documentada", puntos: 25 },
        { criterio: "Evaluación crítica de recomendaciones y cálculo de ahorro potencial", puntos: 25 },
      ],
    },
    recursos: [
      { titulo: "Reliability Python Library — Análisis de Weibull", url: "https://reliability.readthedocs.io/en/latest/", tipo: "herramienta", descripcion: "Librería Python especializada en análisis de confiabilidad: distribución Weibull, MTBF, pronóstico RUL y más." },
      { titulo: "NASA GSFC Reliability Engineering — Weibull Guide", url: "https://www.nasa.gov/sites/default/files/atoms/files/reliability_primer_0.pdf", tipo: "lectura", descripcion: "Guía introductoria de NASA sobre análisis de confiabilidad con distribución Weibull. Fundamentos y aplicaciones prácticas." },
      { titulo: "ReliaSoft — Weibull++ Overview", url: "https://www.reliasoft.com/resources/resource-center/introduction-to-weibull-analysis", tipo: "documentacion", descripcion: "Introducción al análisis de Weibull de ReliaSoft, referencia académica e industrial estándar en confiabilidad." },
    ],
  },

  {
    id: 24,
    titulo: "Dashboard de salud de equipos con Tableau",
    modulo: MOD5,
    moduloNum: 5,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Dashboard de salud de equipos con Tableau",
    teoria: `## Tableau para mantenimiento predictivo: visualización que salva equipos

Los datos de sensores y el análisis estadístico solo crean valor cuando los decisores correctos los ven en el momento oportuno. Tableau es la plataforma de visualización de datos más usada en industria a nivel global, y su capacidad para conectar con fuentes de datos en tiempo real la convierte en la herramienta ideal para dashboards de salud de equipos.

### ¿Por qué Tableau para mantenimiento?

Las alternativas gratuitas como Power BI y Grafana son válidas, pero Tableau destaca por:

**Velocidad de desarrollo:** Tableau Public permite crear dashboards profesionales sin programar, arrastrando y soltando. Un ingeniero sin experiencia en BI puede tener su primer dashboard de mantenimiento funcional en 2-3 horas.

**Cálculos de confiabilidad nativos:** Tableau soporta cálculos de campo complejos (running averages, percentiles, agregaciones condicionales) que permiten calcular MTBF, disponibilidad y tendencias directamente en la herramienta sin pre-procesar los datos.

**Tableau Pulse (IA nativa):** La versión 2024+ incluye Tableau Pulse, que genera insights automáticos en lenguaje natural sobre los datos. Al conectar con datos de sensores, Pulse puede detectar automáticamente anomalías y describir tendencias sin que el usuario sepa nada de estadística.

**Ask Data / Einstein Analytics:** Funcionalidad de preguntas en lenguaje natural: el usuario escribe "muéstrame los 5 equipos con mayor tiempo de parada este mes" y Tableau genera automáticamente la visualización correspondiente.

### Arquitectura de un dashboard de salud de equipos

Un dashboard efectivo para mantenimiento predictivo tiene cuatro vistas complementarias:

**Vista 1 — Semáforo de estado por equipo:**
Cada equipo aparece como un tile de color (verde/amarillo/rojo) basado en reglas de negocio: verde si vibración y temperatura están en zona normal, amarillo si alguna variable está en zona de alerta, rojo si está en zona crítica. El operador de sala de control ve el estado de toda la planta de un vistazo.

**Vista 2 — Tendencias históricas:**
Gráficas de línea de las variables clave (vibración RMS, temperatura rodamiento, corriente) en el tiempo, con líneas de referencia marcando los umbrales de alerta y crítico. Permite ver si un equipo está mejorando o degradándose gradualmente.

**Vista 3 — KPIs de confiabilidad:**
MTBF actual vs. MTBF objetivo, disponibilidad del mes vs. mes anterior, número de paradas no planificadas, MTTR promedio. Métricas que el jefe de mantenimiento necesita para su reunión semanal.

**Vista 4 — Calendario de mantenimiento:**
Gráfica de Gantt o timeline con las próximas intervenciones programadas basadas en el MTBF y los intervalos PM definidos. Permite anticipar recursos (técnicos, repuestos, paradas de producción).

### Construcción paso a paso en Tableau Public

**Paso 1 — Preparar los datos:**
Exporta los datos de sensores a Excel o CSV con estructura: timestamp, equipo_id, nombre_equipo, area, vib_rms, temp_rodamiento, corriente, estado (normal/alerta/critico).

**Paso 2 — Conectar Tableau:**
En Tableau Public, File → Connect to Data → Microsoft Excel (o Text/CSV). Arrastra la tabla al área de diseño.

**Paso 3 — Crear campo calculado para semáforo:**
```
IF [vib_rms] > 4.5 OR [temp_rodamiento] > 80 THEN "CRÍTICO"
ELSEIF [vib_rms] > 2.8 OR [temp_rodamiento] > 65 THEN "ALERTA"
ELSE "NORMAL"
END
```

**Paso 4 — Construir visualizaciones:**
- Semáforo: Drag equipo a Columns, arrastrar Estado a Color (verde/amarillo/rojo)
- Tendencia: Drag timestamp a Columns, vib_rms a Rows, equipo a Color
- KPIs: Text tables con cálculos de MTBF y disponibilidad

**Paso 5 — Dashboard con acciones:**
Crear un dashboard que combine las cuatro vistas. Agregar Dashboard Actions para que al hacer clic en un equipo del semáforo, se filtre automáticamente la vista de tendencias para ese equipo.

### ChatGPT para diseñar los cálculos de Tableau

Los cálculos de Tableau (Table Calculations y LOD Expressions) tienen una sintaxis particular que puede ser difícil al inicio. ChatGPT es un asistente invaluable para escribirlos:

**Prompt:** *"Estoy construyendo un dashboard de mantenimiento en Tableau. Necesito calcular el MTBF por equipo a partir de un dataset con columnas: equipo_id, timestamp_falla, horas_operacion_previa. Escríbeme la LOD Expression correcta en Tableau para calcular el MTBF promedio por equipo."*

ChatGPT entrega el código de cálculo listo para pegar en Tableau, explicando cada parte de la sintaxis.

### Tableau Public vs. Tableau Desktop

Para la mayoría de los ingenieros en Ecuador que empiezan con análisis de mantenimiento, **Tableau Public es suficiente**. Es completamente gratuito y permite crear dashboards interactivos publicables en la web. La única limitación es que los dashboards son públicos (no pueden contener datos confidenciales de la empresa). Para uso interno con datos sensibles, Tableau Desktop tiene licencia de $70/mes o está disponible en muchas universidades ecuatorianas con licencias académicas.`,
    presentacionSlides: [
      { titulo: "¿Por qué Tableau para mantenimiento predictivo?", contenido: "Desarrollo sin programar (drag & drop). Cálculos de confiabilidad nativos. Tableau Pulse: insights automáticos con IA. Ask Data: preguntas en lenguaje natural. Dashboard en 2-3 horas para un ingeniero nuevo." },
      { titulo: "Las 4 vistas de un dashboard efectivo", contenido: "1. Semáforo de estado (verde/amarillo/rojo por equipo). 2. Tendencias históricas con umbrales. 3. KPIs de confiabilidad (MTBF, disponibilidad, paradas). 4. Calendario de mantenimiento próximo." },
      { titulo: "Campo calculado para semáforo de estado", contenido: "IF vib_rms > 4.5 OR temp > 80 → CRÍTICO. ELSEIF vib_rms > 2.8 OR temp > 65 → ALERTA. ELSE → NORMAL. Lógica condicional que convierte datos crudos en decisión de colores." },
      { titulo: "Tableau Pulse: IA que describe los datos", contenido: "Tableau 2024+: Pulse genera insights automáticos en español sobre anomalías y tendencias. Sin saber estadística: 'Equipo Motor-03 muestra vibración 40% sobre promedio histórico de las últimas 72 horas.'" },
      { titulo: "LOD Expressions: cálculos avanzados", contenido: "FIXED LOD calcula MTBF por equipo sin filtros de visualización. INCLUDE LOD agrega dimensiones extra. ChatGPT escribe las LOD Expressions si describes qué quieres calcular en lenguaje natural." },
      { titulo: "Dashboard Actions: navegación inteligente", contenido: "Clic en equipo del semáforo → filtra automáticamente tendencias + KPIs de ese equipo. Hover sobre barra → tooltip con datos de última medición. Drill-down desde planta → área → equipo." },
      { titulo: "Tableau Public vs Desktop", contenido: "Public: GRATIS, dashboards públicos en web, ideal para aprender y proyectos sin datos confidenciales. Desktop: $70/mes, datos privados, conexiones a bases de datos en tiempo real, 14 días de prueba gratis." },
      { titulo: "Flujo completo en 5 pasos", contenido: "1. Exportar datos sensores a CSV/Excel. 2. Conectar Tableau. 3. Crear campos calculados (semáforo, MTBF). 4. Construir 4 vistas. 5. Armar dashboard con acciones de filtro." },
    ],
    quiz: [
      { pregunta: "¿Qué es Tableau Pulse y para qué sirve en mantenimiento predictivo?", opciones: ["Un sensor de vibración integrado en Tableau", "Una funcionalidad de IA que genera insights automáticos en lenguaje natural sobre los datos", "Un plugin para conectar Tableau con PLC Siemens", "Un formato de exportación de dashboards a PDF"], respuesta: 1, explicacion: "Tableau Pulse (disponible desde versión 2024) usa IA para analizar automáticamente los datos y generar descripciones en lenguaje natural sobre anomalías y tendencias, sin que el usuario necesite saber estadística." },
      { pregunta: "¿Cuál es la principal diferencia entre Tableau Public y Tableau Desktop?", opciones: ["Tableau Public no puede conectarse a Excel, Desktop sí", "Tableau Public es gratuito pero los dashboards son públicos; Desktop es de pago y permite datos privados", "Tableau Desktop es más lento que Public", "No hay diferencias técnicas, solo de precio"], respuesta: 1, explicacion: "Tableau Public es completamente gratuito pero requiere publicar los dashboards en la web de forma pública. Tableau Desktop ($70/mes) permite trabajar con datos confidenciales internamente y conectarse a bases de datos en tiempo real." },
      { pregunta: "¿Qué hace un Dashboard Action de tipo Filter en Tableau?", opciones: ["Filtra los datos de la base de datos origen", "Al interactuar con una visualización (clic, hover), filtra automáticamente otras visualizaciones en el dashboard", "Envía un email cuando se detecta una anomalía", "Calcula promedios móviles automáticamente"], respuesta: 1, explicacion: "Los Dashboard Actions de tipo Filter permiten la navegación interactiva: al hacer clic en un equipo del semáforo, todas las demás visualizaciones del dashboard se filtran automáticamente para mostrar solo los datos de ese equipo." },
      { pregunta: "¿Para qué se usan las LOD (Level of Detail) Expressions en Tableau?", opciones: ["Para cambiar el nivel de zoom del dashboard", "Para realizar cálculos de agregación en un nivel de detalle diferente al de la visualización actual", "Para conectar múltiples fuentes de datos simultáneamente", "Para exportar el dashboard a PowerPoint"], respuesta: 1, explicacion: "Las LOD Expressions (FIXED, INCLUDE, EXCLUDE) permiten calcular métricas en un nivel de detalle específico independientemente de la agregación de la visualización. Por ejemplo, MTBF por equipo aunque la vista esté filtrada por área." },
      { pregunta: "¿Qué formato de datos es más conveniente para conectar datos de sensores IoT a Tableau?", opciones: ["Imágenes JPG de las pantallas de los sensores", "Archivo CSV o Excel con columnas: timestamp, equipo_id, variable, valor", "Documento Word con tablas de datos copiadas", "Base de datos Oracle solamente"], respuesta: 1, explicacion: "Tableau conecta fácilmente con archivos CSV o Excel estructurados con columnas bien definidas. La estructura timestamp + equipo_id + variables medidas es el formato estándar para datos de series de tiempo de sensores." },
    ],
    ejercicio: {
      titulo: "Dashboard de salud de equipos en Tableau Public",
      objetivo: "Construir un dashboard interactivo de mantenimiento con semáforo de estado, tendencias históricas y KPIs de confiabilidad usando datos simulados de sensores.",
      herramientas: "Tableau Public (public.tableau.com — gratuito), Excel o Google Sheets",
      pasos: [
        "Descarga e instala Tableau Public desde public.tableau.com. Crea una cuenta gratuita.",
        "Prepara en Excel un dataset de sensores simulados con 90 días de datos diarios para 5 equipos. Columnas: fecha, equipo_id, nombre_equipo, area, vib_rms (valores entre 0.5-8 mm/s), temp_rodamiento (valores entre 35-90°C), horas_operacion_acumuladas. Incluye algunos valores anómalos para que el semáforo los detecte.",
        "Conecta Tableau Public al archivo Excel. En la primera hoja, construye el semáforo: crea un campo calculado 'Estado' con la lógica IF/ELSEIF para clasificar cada registro como NORMAL/ALERTA/CRÍTICO. Usa colores verde/amarillo/rojo.",
        "En una segunda hoja, crea la gráfica de tendencias: fecha en el eje X, vib_rms en el eje Y, equipo en Color. Agrega líneas de referencia en los umbrales de alerta (2.8) y crítico (4.5).",
        "En una tercera hoja, crea una tabla de KPIs: calcula por equipo el número de registros en cada estado, el máximo de vibración y temperatura del mes, y la tendencia (mejora/empeora comparando último mes vs. anterior).",
        "Crea el Dashboard combinando las tres hojas. Agrega un Dashboard Action de tipo Filter: al hacer clic en un equipo del semáforo, se filtran las tendencias y KPIs para mostrar solo ese equipo. Publica el dashboard en Tableau Public y copia el enlace.",
      ],
      resultado: "Dashboard publicado en Tableau Public con URL pública, semáforo funcional, tendencias con umbrales y KPIs de confiabilidad con interactividad entre vistas.",
      criterios: [
        { criterio: "Dataset preparado con 90 días de datos para 5 equipos con valores anómalos incluidos", puntos: 20 },
        { criterio: "Semáforo funcional con campo calculado correcto y colores verde/amarillo/rojo", puntos: 30 },
        { criterio: "Tendencias con líneas de referencia en umbrales correctos", puntos: 25 },
        { criterio: "Dashboard Action de Filter funcionando y URL de Tableau Public entregada", puntos: 25 },
      ],
    },
    recursos: [
      { titulo: "Tableau Public — Plataforma gratuita de visualización", url: "https://public.tableau.com/", tipo: "herramienta", descripcion: "Descarga gratuita de Tableau Public y galería de dashboards de ejemplo, incluyendo varios de mantenimiento industrial." },
      { titulo: "Tableau Help — LOD Expressions", url: "https://help.tableau.com/current/pro/desktop/es-es/calculations_calculatedfields_lod.htm", tipo: "documentacion", descripcion: "Documentación oficial de Tableau en español sobre Level of Detail Expressions para cálculos avanzados de confiabilidad." },
      { titulo: "Tableau Learning Path — Fundamentals", url: "https://www.tableau.com/learn/training/20242", tipo: "lectura", descripcion: "Ruta de aprendizaje oficial gratuita de Tableau con videos y ejercicios para dominar los fundamentos en 6 horas." },
    ],
  },

  {
    id: 25,
    titulo: "Plan de mantenimiento predictivo con Claude",
    modulo: MOD5,
    moduloNum: 5,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Plan de mantenimiento predictivo con Claude",
    teoria: `## Construir un plan de mantenimiento predictivo completo con Claude

Un plan de mantenimiento predictivo no es solo una lista de tareas. Es un sistema estructurado que combina la criticidad de los equipos, los modos de falla identificados, las variables de condición a monitorear, los umbrales de intervención y los procedimientos de respuesta. Claude es el asistente ideal para construir este plan porque puede integrar información técnica compleja, estructurarla lógicamente y adaptarla al contexto específico de tu empresa en Ecuador.

### Los 6 componentes de un plan PdM profesional

**1. Inventario de equipos con criticidad:**
Listado completo de equipos con su índice de criticidad calculado (Consecuencia × Probabilidad). Los equipos con criticidad ≥15 son el foco principal del plan.

**2. Modos de falla y sus indicadores (FMEA simplificado):**
Para cada equipo crítico, documentar: ¿cuáles son los modos de falla más frecuentes? ¿Qué señal física indica que ese modo de falla está ocurriendo? ¿Cuánto tiempo de anticipación típicamente tenemos desde que la señal aparece hasta la falla real?

**3. Variables de monitoreo y umbrales:**
Para cada modo de falla, definir: qué variable medir (vibración, temperatura, corriente, presión), con qué frecuencia medir, el umbral de alerta (investigar), el umbral crítico (intervenir inmediatamente) y la fuente del umbral (norma ISO, recomendación fabricante, experiencia histórica).

**4. Procedimientos de respuesta:**
Qué hace el técnico cuando el sistema lanza una alerta: ¿verifica in situ? ¿Escala al supervisor? ¿Para el equipo? Definir la cadena de escalamiento y los tiempos de respuesta máximos para cada nivel de alerta.

**5. Plan de reposición de repuestos críticos:**
Basado en el MTBF de cada componente crítico, calcular el inventario mínimo que debe mantenerse en almacén. Incluir lead time de importación para componentes que no están disponibles localmente.

**6. Indicadores del plan y revisión periódica:**
Métricas para evaluar si el plan está funcionando: disponibilidad de equipos críticos (objetivo ≥97%), número de fallas no planificadas por mes (objetivo: 0 en equipos con PdM), MTTR promedio (objetivo: reducir 20% en 6 meses).

### Claude como co-constructor del plan

Claude puede ayudar en cada componente del plan si se le da el contexto correcto. El método más efectivo es el diálogo estructurado en pasos:

**Primer prompt — contexto de la planta:**
*"Voy a construir un plan de mantenimiento predictivo para mi empresa. Somos [tipo de empresa] en [ciudad, Ecuador] con [X] empleados. Los equipos principales son: [lista de equipos con potencia y función]. El equipo más crítico para la producción es [nombre] porque [razón]. El mayor problema actual de mantenimiento es [descripción del problema]. Tenemos [X] técnicos de mantenimiento con [nivel de experiencia]. Actualmente hacemos mantenimiento [correctivo/preventivo]. ¿Qué información adicional necesitas para ayudarme a construir el plan?"*

**Segundo prompt — FMEA simplificado:**
Con el contexto dado, pide: *"Para el equipo [nombre], genera un FMEA simplificado con los 5 modos de falla más probables, la variable de condición que indica cada modo de falla, el tiempo de anticipación típico y el umbral de alerta recomendado según norma ISO o estándar de la industria."*

**Tercer prompt — Plan de acción:**
*"Basándote en el FMEA, crea un plan de monitoreo para los próximos 6 meses incluyendo: frecuencia de medición por variable, herramientas necesarias (tipo de sensor o equipo de medición), responsable de cada medición y procedimiento de escalamiento cuando se supere el umbral de alerta."*

**Cuarto prompt — Presupuesto:**
*"Estima el presupuesto de implementación del plan: sensores necesarios, instrumentos de medición, software de análisis (herramientas gratuitas o de bajo costo disponibles en Ecuador), horas de capacitación del equipo de mantenimiento y costo anual de operación del sistema."*

### FMEA: el corazón analítico del plan

El **Failure Mode and Effects Analysis (FMEA)** es la herramienta estándar para identificar sistemáticamente cómo puede fallar un equipo y qué tan grave sería cada falla. Aunque existe una metodología formal (AIAG/VDA), Claude puede ayudar a construir una versión simplificada orientada a resultados:

| Modo de Falla | Causa Probable | Efecto | Variable de Condición | Umbral Alerta | Tiempo Anticipación |
|---------------|----------------|--------|-----------------------|---------------|---------------------|
| Falla de rodamiento delantero | Falta de lubricación, sobrecarga | Parada no planificada + daño al eje | Vibración RMS + Kurtosis | RMS >2.8 mm/s o Kurtosis >4 | 2-8 semanas |
| Falla bobinado motor | Sobrecalentamiento por ciclos de arranque | Corto circuito, reemplazo motor | Temperatura bobinado | >80°C sobre ambiente | 1-4 semanas |

### Integración con el sistema de gestión de mantenimiento (CMMS)

Un plan PdM bien diseñado debe eventualmente integrarse con un **CMMS** (Computerized Maintenance Management System). Opciones gratuitas o de bajo costo disponibles para empresas ecuatorianas:

- **Limble CMMS:** Plan gratuito para equipos pequeños, en español
- **UpKeep:** Mobile-first, técnicos usan celular para registrar intervenciones
- **Fiix:** Integración con IoT y sensores, plan básico gratuito
- **Excel como CMMS:** Para empresas con pocos equipos, una hoja bien diseñada con macros puede funcionar como CMMS básico

Claude puede ayudar a diseñar la estructura de tu CMMS en Excel si no tienes presupuesto para software especializado.

### Caso práctico: planta de flores en Cotopaxi

Una florícola mediana con 15 equipos clave en su área de pos-cosecha implementó un plan PdM construido en tres sesiones de trabajo con Claude. El plan identificó 8 modos de falla críticos en 4 equipos prioritarios, estableció monitoreo semanal de vibración y temperatura con un vibrómetro portátil de $350, y definió intervalos de lubricación preventiva ajustados al MTBF real (no al intervalo genérico del fabricante). En 8 meses, las paradas no planificadas bajaron de un promedio de 4.2 por mes a 0.7 por mes, con una disponibilidad de equipos que subió de 91% a 97.3%.`,
    presentacionSlides: [
      { titulo: "Los 6 componentes de un plan PdM profesional", contenido: "1. Inventario con criticidad. 2. FMEA (modos de falla + señales). 3. Variables de monitoreo + umbrales. 4. Procedimientos de respuesta + escalamiento. 5. Repuestos críticos en almacén. 6. KPIs del plan + revisión periódica." },
      { titulo: "Claude como co-constructor: 4 prompts secuenciales", contenido: "Prompt 1: Contexto completo de la planta. Prompt 2: FMEA simplificado por equipo crítico. Prompt 3: Plan de monitoreo 6 meses (frecuencia, herramientas, responsables). Prompt 4: Presupuesto de implementación." },
      { titulo: "FMEA simplificado: la tabla de 6 columnas", contenido: "Modo de Falla → Causa Probable → Efecto en Producción → Variable de Condición → Umbral de Alerta → Tiempo de Anticipación. Claude genera esta tabla en minutos con el contexto del equipo." },
      { titulo: "¿Qué hace el técnico cuando aparece una alerta?", contenido: "Nivel 1 (Alerta): Verifica in situ en <24h, documenta lectura. Nivel 2 (Crítico): Escala a supervisor en <2h, programa intervención. Nivel 3 (Emergencia): Para equipo, llama técnico especialista. Sin procedimiento escrito, los técnicos improvisan." },
      { titulo: "Repuestos críticos: el inventario mínimo", contenido: "MTBF del componente + Lead time de importación = momento de reorden. Rodamiento con MTBF 720h y lead time 30 días → reordenar cuando queden 30 días de operación. ChatGPT calcula el inventario mínimo por componente." },
      { titulo: "CMMS: de la hoja de papel al sistema", contenido: "Opciones gratuitas: Limble (plan free), UpKeep (mobile), Excel con macros. Claude diseña tu estructura de CMMS en Excel. Digitalizar el registro de intervenciones es el primer paso de cualquier plan PdM serio." },
      { titulo: "KPIs del plan: ¿está funcionando?", contenido: "Disponibilidad equipos críticos: objetivo ≥97%. Fallas no planificadas/mes: objetivo 0 en equipos con PdM. MTTR promedio: reducir 20% en 6 meses. Revisar KPIs mensualmente y ajustar el plan." },
      { titulo: "Caso Cotopaxi: de 4.2 paradas/mes a 0.7", contenido: "15 equipos, 4 prioritarios, 8 modos de falla críticos. Vibrómetro portátil $350 + plan semanal. En 8 meses: disponibilidad 91% → 97.3%. Resultado construido en 3 sesiones de trabajo con Claude." },
    ],
    quiz: [
      { pregunta: "¿Cuáles son los 6 componentes de un plan de mantenimiento predictivo profesional?", opciones: ["Sensores, WiFi, servidor, software, pantalla y alarma", "Inventario de equipos, FMEA, variables de monitoreo, procedimientos de respuesta, repuestos críticos y KPIs del plan", "Solo MTBF, MTTR y disponibilidad", "Manual del fabricante, herramienta, técnico, repuesto, tiempo y costo"], respuesta: 1, explicacion: "Un plan PdM profesional requiere: (1) inventario con criticidad, (2) FMEA de modos de falla, (3) variables de monitoreo con umbrales, (4) procedimientos de respuesta y escalamiento, (5) inventario de repuestos críticos y (6) KPIs del plan con revisión periódica." },
      { pregunta: "En el contexto de mantenimiento predictivo, ¿qué significa FMEA?", opciones: ["Frecuencia Máxima de Emisión de Alarmas", "Failure Mode and Effects Analysis — Análisis de Modos de Falla y Efectos", "Full Maintenance Equipment Analysis", "Frequency Monitoring and Early Alert"], respuesta: 1, explicacion: "FMEA (Failure Mode and Effects Analysis) es la metodología para identificar sistemáticamente cómo puede fallar un equipo, cuál sería el efecto de cada falla y qué variable de condición permite detectarla anticipadamente." },
      { pregunta: "¿Por qué es importante definir el lead time de importación al calcular el inventario de repuestos críticos?", opciones: ["Por requisitos legales del SRI de Ecuador", "Para calcular cuándo reordenar: si el componente tarda 30 días en llegar y su MTBF es 720h, hay que reordenar cuando queden 30 días de vida útil estimada", "Solo aplica para empresas que importan más de $10,000 al año", "No es importante; los repuestos siempre están disponibles localmente"], respuesta: 1, explicacion: "El lead time de importación determina el momento de reorden. Si un rodamiento crítico tiene MTBF de 720h (30 días) y tarda 30 días en importarse, debe reordenarse inmediatamente cuando se instala el nuevo. Sin este cálculo, la empresa inevitablemente quedará sin repuesto en el momento de la falla." },
      { pregunta: "¿Cuál es la ventaja de usar Claude para construir el FMEA de un equipo industrial?", opciones: ["Claude reemplaza completamente al ingeniero de mantenimiento", "Claude integra información técnica del equipo, normas ISO y mejores prácticas para generar una tabla FMEA estructurada en minutos, que el ingeniero luego valida con su experiencia", "Claude solo funciona para equipos de marca americana", "Claude genera el FMEA automáticamente sin necesitar ningún dato de entrada"], respuesta: 1, explicacion: "Claude acelera la construcción del FMEA generando una tabla estructurada con modos de falla, señales de condición y umbrales basados en normas y mejores prácticas. El ingeniero aporta el conocimiento específico del equipo real y valida si las recomendaciones son aplicables a su contexto." },
      { pregunta: "¿Qué KPI del plan PdM indica más directamente que el sistema de monitoreo predictivo está funcionando?", opciones: ["El costo mensual de energía eléctrica del área de mantenimiento", "El número de fallas no planificadas por mes en equipos bajo PdM (objetivo: 0)", "El número de sensores IoT instalados", "El tamaño del equipo de mantenimiento en personas"], respuesta: 1, explicacion: "El número de fallas no planificadas en equipos bajo PdM es el KPI más directo de la efectividad del sistema. Si el PdM funciona, las fallas deben detectarse y resolverse antes de que el equipo pare inesperadamente. El objetivo en equipos correctamente monitoreados es 0 fallas no planificadas." },
    ],
    ejercicio: {
      titulo: "Construir un plan PdM completo con Claude en 4 prompts",
      objetivo: "Desarrollar un plan de mantenimiento predictivo estructurado y completo para una empresa real o simulada, usando Claude como asistente técnico en un diálogo estructurado de 4 prompts.",
      herramientas: "Claude.ai (claude.ai/chat), Word o Google Docs para documentar",
      pasos: [
        "Define el contexto de tu empresa: tipo de industria, ciudad, número de empleados, lista de 8-10 equipos principales con su función productiva y edad aproximada. Si no trabajas actualmente en una empresa industrial, usa el caso de una florícola mediana en Tabacundo, Pichincha, con equipos de pos-cosecha (cámaras frías, empacadoras, bandas transportadoras, compresores).",
        "Ejecuta el Prompt 1 con Claude: describe completamente la empresa, equipos y el mayor problema de mantenimiento actual. Documenta qué información adicional pidió Claude y respóndela. Guarda la respuesta completa.",
        "Ejecuta el Prompt 2: solicita a Claude el FMEA simplificado de los 3 equipos más críticos (según la criticidad que definiste o que Claude identificó). La tabla debe incluir: Modo de Falla, Causa Probable, Efecto en Producción, Variable de Condición, Umbral de Alerta y Tiempo de Anticipación.",
        "Ejecuta el Prompt 3: basado en el FMEA, pide a Claude el plan de monitoreo para los próximos 6 meses con frecuencias de medición, herramientas necesarias y costos estimados en dólares (contexto Ecuador). Solicita también el procedimiento de escalamiento para alertas.",
        "Ejecuta el Prompt 4: solicita el presupuesto de implementación del plan, priorizando opciones de bajo costo disponibles en Ecuador. Incluye inventario mínimo de repuestos críticos con justificación basada en MTBF.",
        "Ensambla los resultados en un documento de Word/Google Docs con portada, los 6 componentes del plan completos, y una sección de conclusiones donde evalúas: ¿qué tan aplicable es el plan generado con Claude para una empresa real en Ecuador? ¿Qué ajustes harías con tu conocimiento del sector?",
      ],
      resultado: "Documento completo del plan PdM con los 6 componentes, FMEA de 3 equipos críticos, plan de monitoreo 6 meses, presupuesto estimado y evaluación crítica de aplicabilidad.",
      criterios: [
        { criterio: "Contexto de empresa bien definido y diálogo con Claude documentado (4 prompts completos)", puntos: 20 },
        { criterio: "FMEA de 3 equipos con las 6 columnas requeridas y umbrales justificados", puntos: 30 },
        { criterio: "Plan de monitoreo 6 meses con frecuencias, herramientas y costos en contexto Ecuador", puntos: 25 },
        { criterio: "Evaluación crítica de aplicabilidad con ajustes propios del ingeniero", puntos: 25 },
      ],
    },
    recursos: [
      { titulo: "Claude.ai — Asistente para análisis técnico industrial", url: "https://claude.ai/chat", tipo: "herramienta", descripcion: "Interfaz web gratuita de Claude. La versión Pro permite subir documentos técnicos del fabricante para análisis contextualizado del equipo." },
      { titulo: "Limble CMMS — Software gratuito de mantenimiento", url: "https://limblecmms.com/", tipo: "herramienta", descripcion: "CMMS con plan gratuito que incluye registro de equipos, órdenes de trabajo y seguimiento básico de KPIs. Disponible en español." },
      { titulo: "AIAG FMEA Manual 4ta Edición — Referencia formal", url: "https://www.aiag.org/quality/automotive-core-tools/fmea", tipo: "documentacion", descripcion: "Referencia formal de la metodología FMEA de la industria automotriz, aplicable a cualquier sector manufacturero." },
    ],
  },

  // M6 — Control de calidad (placeholders)
  placeholder(26, "SPC y gráficos de control con Minitab IA", MOD6, 6),
  placeholder(27, "Reglas Western Electric y detección de tendencias", MOD6, 6),
  placeholder(28, "Cp/Cpk y capacidad de proceso con IA", MOD6, 6),
  placeholder(29, "Análisis Pareto de defectos con ChatGPT", MOD6, 6),
  placeholder(30, "Reportes de calidad automatizados (5W+1H)", MOD6, 6),

  // M7 — Cadena de suministro (placeholders)
  placeholder(31, "Pronóstico de demanda con Copilot Excel", MOD7, 7),
  placeholder(32, "Variables externas que afectan la demanda", MOD7, 7),
  placeholder(33, "Clasificación ABC/XYZ de inventario con IA", MOD7, 7),
  placeholder(34, "EOQ y punto de reorden optimizado con Claude", MOD7, 7),
  placeholder(35, "NotebookLM como base de conocimiento supply chain", MOD7, 7),

  // M8 — Integración y proyecto final (placeholders)
  placeholder(36, "Automatización de procesos con n8n e IA", MOD8, 8),
  placeholder(37, "Conectar herramientas: Excel → ChatGPT → Power BI", MOD8, 8),
  placeholder(38, "Copilot Excel avanzado para ingeniería industrial", MOD8, 8),
  placeholder(39, "Proyecto integrador: diagnóstico IA de tu empresa", MOD8, 8),
  placeholder(40, "Presentación de resultados y plan de implementación", MOD8, 8),
];
