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

  // M2 — ChatGPT — Dominio profesional (placeholders)
  placeholder(6, "Interfaz, modelos y configuración de ChatGPT Plus", MOD2, 2),
  placeholder(7, "Metodología CRTF para prompts efectivos", MOD2, 2),
  placeholder(8, "Análisis de datos de producción con ChatGPT", MOD2, 2),
  placeholder(9, "Reportes y documentación automatizada", MOD2, 2),
  placeholder(10, "Análisis de causa raíz (Ishikawa + 5 Porqués) con ChatGPT", MOD2, 2),

  // M3 — Claude — Análisis avanzado (placeholders)
  placeholder(11, "Claude Projects y Artifacts para ingeniería", MOD3, 3),
  placeholder(12, "Análisis de documentos técnicos largos (+60 páginas)", MOD3, 3),
  placeholder(13, "Evaluación de proveedores con matriz ponderada", MOD3, 3),
  placeholder(14, "Comparativas técnicas y benchmarking con Claude", MOD3, 3),
  placeholder(15, "Seguridad, privacidad y LOPDP Ecuador", MOD3, 3),

  // M4 — Optimización de producción (placeholders)
  placeholder(16, "Análisis de cuellos de botella con ChatGPT y datos reales", MOD4, 4),
  placeholder(17, "OEE y Takt Time: diagnóstico con IA", MOD4, 4),
  placeholder(18, "Teoría de Restricciones aplicada con IA", MOD4, 4),
  placeholder(19, "Simulación de escenarios productivos con Claude", MOD4, 4),
  placeholder(20, "Dashboard de producción con Power BI IA", MOD4, 4),

  // M5 — Mantenimiento predictivo (placeholders)
  placeholder(21, "Fundamentos de mantenimiento predictivo y sensores IoT", MOD5, 5),
  placeholder(22, "Análisis de datos de vibración y temperatura con IA", MOD5, 5),
  placeholder(23, "MTBF y MTTR: predicción de fallas con ChatGPT", MOD5, 5),
  placeholder(24, "Dashboard de salud de equipos con Tableau", MOD5, 5),
  placeholder(25, "Plan de mantenimiento predictivo con Claude", MOD5, 5),

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
