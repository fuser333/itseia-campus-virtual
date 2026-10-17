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

[Código python]
    import pandas as pd
    import numpy as np
    import matplotlib.pyplot as plt
    
    df = pd.read_csv('vibration_motor_01.csv')
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.plot(x='timestamp', y=['vib_x', 'vib_y', 'temp_bearing'])
[/Código]

**Paso 2 — Calcular estadísticos de señal:**
Los más útiles para diagnóstico de rodamientos son: RMS (energía total), Kurtosis (detecta impactos — valores >4 indican defecto), Crest Factor (ratio pico/RMS — normal <3, con defecto >6).

**Paso 3 — Detección de anomalías:**

[Código python]
    from sklearn.ensemble import IsolationForest
    model = IsolationForest(contamination=0.05, random_state=42)
    df['anomaly'] = model.fit_predict(df[['vib_rms', 'temp_bearing']])
    # -1 = anomalía, 1 = normal
[/Código]

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

[Código ]
    IF [vib_rms] > 4.5 OR [temp_rodamiento] > 80 THEN "CRÍTICO"
    ELSEIF [vib_rms] > 2.8 OR [temp_rodamiento] > 65 THEN "ALERTA"
    ELSE "NORMAL"
    END
[/Código]

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

  // M6 — Control de calidad con IA
  {
    id: 26,
    titulo: "SPC y gráficos de control con Minitab IA",
    modulo: MOD6,
    moduloNum: 6,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "SPC y gráficos de control con Minitab IA",
    teoria: `## Control Estadístico de Procesos: la ciencia que separa variación normal de señales reales

El Control Estadístico de Procesos (SPC — Statistical Process Control) es el conjunto de técnicas estadísticas desarrolladas por Walter Shewhart en los años 1920 y popularizadas globalmente por W. Edwards Deming, que permite monitorear y controlar la calidad de los procesos manufactureros de manera objetiva y sistemática.

La premisa fundamental del SPC es que todo proceso tiene variación. La pregunta clave no es "¿hay variación?" sino "¿esta variación es normal (aleatoria) o hay una causa especial (asignable) que debo eliminar?" Los gráficos de control son la herramienta visual que responde esa pregunta.

### El gráfico de control: anatomía y lógica

Un gráfico de control Shewhart tiene tres elementos estructurales:

**Línea Central (CL):** El promedio del proceso cuando opera bajo control estadístico. Es la referencia del comportamiento esperado.

**Límites de Control Superior (UCL) e Inferior (LCL):** Calculados como ±3σ (tres desviaciones estándar) alrededor de la línea central. Si el proceso está bajo control estadístico, el 99.73% de los puntos deben caer dentro de estos límites por pura probabilidad estadística.

**Los puntos de datos:** Mediciones individuales o estadísticos de subgrupos (promedios, rangos, proporciones) graficados en el tiempo.

La lógica es elegante: si un punto cae fuera de los límites de ±3σ, la probabilidad de que sea solo ruido aleatorio es 0.27% (1 en 370). Algo más que azar está actuando. Esa es la causa especial que hay que investigar y eliminar.

### Tipos de gráficos de control y cuándo usar cada uno

**Para variables continuas (medidas con número):**
- **Gráfico X̄-R (Xbar-R):** Para subgrupos de tamaño 2-10. El más común en manufactura. Monitorea promedio del subgrupo (X̄) y rango (R).
- **Gráfico X̄-S:** Para subgrupos de tamaño ≥10. Usa desviación estándar (S) en lugar del rango para mayor precisión estadística.
- **Gráfico I-MR (Individuals-Moving Range):** Para observaciones individuales sin subgrupos. Ideal cuando medir más de una unidad por período es impractical (producción lenta, análisis de laboratorio costoso).

**Para atributos (conteos, proporciones):**
- **Gráfico p:** Fracción defectiva cuando el tamaño del subgrupo varía. Ejemplo: porcentaje de facturas con error por lote de facturación.
- **Gráfico np:** Número de defectivos cuando el subgrupo es constante.
- **Gráfico c:** Número de defectos por unidad cuando el tamaño de la unidad es constante.
- **Gráfico u:** Número de defectos por unidad cuando el tamaño varía.

### Minitab IA: automatización del análisis SPC

Minitab es el software estadístico estándar en manufactura y calidad para SPC. Sus capacidades de IA en las versiones recientes incluyen:

**Asistente Estadístico:** Guía interactiva que pregunta "¿qué quieres analizar?" y selecciona automáticamente el tipo de gráfico correcto, ejecuta el análisis y genera un informe en lenguaje plain text interpretando los resultados y señalando puntos fuera de control.

**Companion AI:** Funcionalidad que analiza los gráficos de control generados y sugiere causas posibles para las señales detectadas, basándose en la base de conocimiento de Minitab sobre causas comunes por industria.

**Detección automática de señales:** Minitab identifica y resalta automáticamente todos los puntos que violan las reglas de detección (no solo los puntos fuera de límites, sino también patrones como corridas, tendencias y puntos estratificados).

Para Ecuador, donde Minitab tiene licencias académicas disponibles a través de distribuidores como Qualitas Consultores, la versión de prueba de 30 días es completamente funcional y suficiente para dominar los fundamentos.

### Proceso de implementación de SPC en una línea de producción

1. **Seleccionar la característica crítica de calidad (CTQ):** La variable que más impacta la satisfacción del cliente o el costo de no calidad. Para una embotelladora: volumen de llenado. Para una metalmecánica: dimensión crítica de tolerancia.

2. **Definir el plan de muestreo:** Tamaño del subgrupo (n), frecuencia de muestreo, responsable de la medición, instrumento de medición con calibración verificada.

3. **Fase de análisis (Fase I):** Recolectar 20-25 subgrupos históricos para establecer los límites de control iniciales. Identificar y eliminar causas especiales en los datos históricos antes de usar esos límites para monitoreo futuro.

4. **Fase de monitoreo (Fase II):** Con los límites establecidos, monitorear el proceso en tiempo real. Responder a señales según el plan de respuesta definido.

5. **Mejorar y recalcular:** Después de implementar mejoras, recalcular los límites de control con los nuevos datos para reflejar el proceso mejorado.

### ChatGPT como intérprete de gráficos SPC

Una vez que Minitab genera el gráfico y señala los puntos fuera de control, ChatGPT puede ayudar a interpretar las posibles causas. El prompt efectivo:

*"En mi proceso de [descripción del proceso] el gráfico X̄-R muestra: [descripción de señales — por ejemplo: 'punto 14 fuera de UCL, puntos 18-22 con tendencia ascendente, punto 27 fuera de LCL']. Las variables del proceso son: [temperatura, velocidad, operador, turno, materia prima]. ¿Qué causas asignables investigarías primero para cada señal? ¿Qué preguntas le harías al operador?"*`,
    presentacionSlides: [
      { titulo: "SPC: separar ruido de señal en el proceso", contenido: "Premisa: todo proceso tiene variación. La pregunta clave: ¿es variación aleatoria normal o una causa especial? Los gráficos de control ±3σ responden objetivamente. Si punto fuera de límites: probabilidad de ser ruido = 0.27%." },
      { titulo: "Anatomía de un gráfico de control", contenido: "CL (Línea Central): promedio del proceso bajo control. UCL: +3σ. LCL: -3σ. Regla básica: 99.73% de puntos deben estar dentro si solo hay variación aleatoria. Punto fuera = causa especial = investigar." },
      { titulo: "¿Qué gráfico usar en cada situación?", contenido: "Variables continuas, subgrupos 2-10: X̄-R. Variables, subgrupos ≥10: X̄-S. Observaciones individuales: I-MR. Fracción defectiva: gráfico p. Número defectivos (n fijo): np. Defectos por unidad: c o u." },
      { titulo: "Minitab Asistente Estadístico: SPC sin ser estadístico", contenido: "El Asistente pregunta: '¿Qué tipo de dato tienes?' y elige el gráfico. Ejecuta el análisis. Genera informe en lenguaje plain text. Señala señales y posibles causas. Disponible en prueba 30 días gratis." },
      { titulo: "Las 5 fases de implementación de SPC", contenido: "1. Seleccionar CTQ (característica crítica). 2. Definir plan de muestreo (n, frecuencia). 3. Fase I: 20-25 subgrupos históricos para límites iniciales. 4. Fase II: monitoreo en tiempo real. 5. Mejorar y recalcular." },
      { titulo: "Minitab Companion AI: diagnóstico de causas", contenido: "Analiza señales en gráficos de control y sugiere causas posibles por tipo de industria. Complementa el diagnóstico del ingeniero con la base de conocimiento de miles de casos documentados." },
      { titulo: "Prompt para interpretar señales con ChatGPT", contenido: "Describir: proceso, tipo de gráfico, señales detectadas (puntos fuera, tendencias, corridas), variables del proceso (turno, operador, material, temperatura). ChatGPT sugiere causas asignables prioritarias a investigar." },
      { titulo: "SPC en Ecuador: sectores de aplicación", contenido: "Industria alimentaria (ARCSA exige control de proceso). Floricultura (calibres de tallos, longitudes). Metalmecánica (tolerancias dimensionales). Textil (resistencia de tela). Cualquier proceso repetitivo con especificación." },
    ],
    quiz: [
      { pregunta: "¿Qué significa que un punto caiga fuera de los límites de control ±3σ en un gráfico de Shewhart?", opciones: ["El producto está dentro de especificación del cliente", "La probabilidad de que sea solo variación aleatoria es 0.27%, indicando una causa especial", "El proceso está funcionando perfectamente", "Se debe detener la producción obligatoriamente"], respuesta: 1, explicacion: "Los límites ±3σ se calculan para que el 99.73% de los puntos caigan dentro si solo hay variación aleatoria. Un punto fuera tiene apenas 0.27% de probabilidad de ser ruido, lo que estadísticamente indica una causa especial que debe investigarse." },
      { pregunta: "¿Cuándo se debe usar el gráfico I-MR en lugar del gráfico X̄-R?", opciones: ["Cuando el tamaño del subgrupo es mayor a 10", "Cuando las observaciones son individuales (sin subgrupos), por ejemplo en análisis de laboratorio costosos o producción lenta", "Solo para datos de atributos (defectivos)", "Cuando el proceso tiene alta variación estacional"], respuesta: 1, explicacion: "El gráfico I-MR (Individuals - Moving Range) se usa cuando medir más de una unidad por período no es práctico o económico: análisis de laboratorio costosos, producción de piezas únicas o procesos lentos donde solo hay una medición disponible por período." },
      { pregunta: "¿Cuántos subgrupos históricos se necesitan en la Fase I del SPC para establecer límites de control confiables?", opciones: ["5 a 10 subgrupos", "20 a 25 subgrupos", "50 a 100 subgrupos", "Al menos 500 observaciones individuales"], respuesta: 1, explicacion: "La práctica estándar del SPC requiere 20-25 subgrupos en la Fase I para tener suficiente información estadística para calcular límites de control confiables. Con menos de 20 subgrupos, los límites son inestables y pueden generar falsas alarmas." },
      { pregunta: "¿Para qué tipo de dato es más apropiado el gráfico p en SPC?", opciones: ["Medidas de temperatura en grados centígrados", "Fracción defectiva (porcentaje de unidades defectuosas) cuando el tamaño del subgrupo varía", "Número de defectos por unidad cuando el tamaño de la unidad es constante", "Dimensiones mecánicas en milímetros"], respuesta: 1, explicacion: "El gráfico p monitorea la fracción defectiva (proporción de unidades defectuosas) y es el correcto cuando el tamaño del subgrupo varía de un período al otro, porque sus límites de control se recalculan para cada punto según el n de ese subgrupo." },
      { pregunta: "¿Qué ventaja ofrece el Asistente Estadístico de Minitab sobre hacer el análisis SPC manualmente?", opciones: ["Es más barato que Excel", "Selecciona automáticamente el tipo de gráfico correcto, ejecuta el análisis y genera un informe en lenguaje natural interpretando los resultados sin que el usuario necesite conocer la teoría estadística en detalle", "Solo funciona para la industria automotriz", "No tiene ventajas reales sobre el análisis manual"], respuesta: 1, explicacion: "El Asistente de Minitab guía al usuario con preguntas sobre el tipo de dato y objetivo del análisis, selecciona el gráfico estadísticamente correcto y genera un informe en lenguaje plain text que interpreta señales y sugiere causas, haciendo el SPC accesible para ingenieros sin formación estadística avanzada." },
    ],
    ejercicio: {
      titulo: "Gráfico de control X̄-R con Minitab o Python para proceso real",
      objetivo: "Construir un gráfico de control X̄-R para una característica de calidad real o simulada, interpretar las señales y usar ChatGPT para proponer causas asignables.",
      herramientas: "Minitab (prueba 30 días en minitab.com) o Python con matplotlib/numpy, ChatGPT o Claude",
      pasos: [
        "Selecciona una característica de calidad de un proceso que conozcas (peso de llenado, dimensión, tiempo de ciclo) o simula datos de llenado de botellas de agua: 25 subgrupos de n=5, con un promedio objetivo de 500 ml y desviación estándar de 3 ml. Para introducir señales, en los subgrupos 12-16 aumenta el promedio a 507 ml (simula cambio de operario).",
        "Si usas Minitab: ingresa los datos en columnas, ve a Stat → Control Charts → Variables Charts for Subgroups → Xbar-R. Selecciona las columnas de datos, define n=5, ejecuta. Si usas Python: usa numpy para generar los datos y matplotlib para graficar con líneas horizontales para UCL, LCL y CL calculados.",
        "Identifica visualmente todos los puntos o patrones que indican causa especial. Anótalos: número de subgrupo, tipo de señal (fuera de límite, tendencia, corrida).",
        "Copia las señales detectadas y usa ChatGPT con el prompt: 'En mi proceso de llenado de botellas de 500 ml, el gráfico X̄-R muestra: [describe las señales exactas que encontraste]. Las variables del proceso son: operario, turno, temperatura ambiente, lote de materia prima. ¿Qué causas asignables investigarías para cada señal? Enuméralas por prioridad.'",
        "Documenta las causas sugeridas por ChatGPT. Para cada causa, escribe qué dato necesitarías recolectar para confirmarla (hoja de verificación, registro de cambios de turno, temperatura del almacén, etc.).",
        "Reflexión final: ¿qué acción correctiva implementarías si la causa real fuera un cambio de operario sin capacitación suficiente? ¿Cómo lo documentarías en el sistema de calidad?",
      ],
      resultado: "Gráfico X̄-R con señales identificadas, análisis de causas de ChatGPT documentado, plan de investigación con datos a recolectar y propuesta de acción correctiva.",
      criterios: [
        { criterio: "Gráfico X̄-R construido correctamente con UCL, LCL, CL visibles y datos en subgrupos", puntos: 30 },
        { criterio: "Señales de causa especial identificadas correctamente con número de subgrupo y tipo", puntos: 25 },
        { criterio: "Prompt bien construido y causas de ChatGPT documentadas con evaluación", puntos: 25 },
        { criterio: "Plan de investigación y propuesta de acción correctiva documentados", puntos: 20 },
      ],
    },
    recursos: [
      { titulo: "Minitab — Prueba gratuita 30 días", url: "https://www.minitab.com/en-us/products/minitab/free-trial/", tipo: "herramienta", descripcion: "Descarga la versión de prueba completa de Minitab Statistical Software, el estándar industrial para SPC y análisis de calidad." },
      { titulo: "ASQ — SPC Handbook online", url: "https://asq.org/quality-resources/statistical-process-control", tipo: "documentacion", descripcion: "Recursos de la American Society for Quality sobre SPC: guías, ejemplos y casos de uso por industria." },
      { titulo: "NIST/SEMATECH e-Handbook of Statistical Methods — SPC", url: "https://www.itl.nist.gov/div898/handbook/pmc/pmc.htm", tipo: "lectura", descripcion: "Manual gratuito del NIST (Instituto Nacional de Estándares de EE.UU.) sobre métodos estadísticos para control de procesos." },
    ],
  },

  {
    id: 27,
    titulo: "Reglas Western Electric y detección de tendencias",
    modulo: MOD6,
    moduloNum: 6,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Reglas Western Electric y detección de tendencias",
    teoria: `## Más allá del punto fuera de control: las 8 reglas que detectan todo

Un error común al implementar SPC es pensar que solo los puntos fuera de los límites ±3σ indican problemas. En realidad, un proceso puede estar "degradándose silenciosamente" con todos sus puntos dentro de los límites, pero mostrando patrones que estadísticamente no son aleatorios. Las **Reglas Western Electric** (también conocidas como Reglas de Nelson o Reglas de AT&T) son el conjunto estandarizado de criterios para detectar estas señales no aleatorias.

### Las 8 reglas Western Electric

Las reglas se aplican simultáneamente al mismo gráfico de control. Cada una detecta un tipo diferente de comportamiento no aleatorio:

**Regla 1 — Punto fuera de ±3σ:** Un punto fuera de los límites de control. La más conocida. Indica cambio drástico o abrupto en el proceso.

**Regla 2 — Corrida de 9 puntos al mismo lado de la línea central:** Nueve o más puntos consecutivos todos por encima O todos por debajo del CL. La probabilidad de que 9 lanzamientos de moneda den el mismo resultado es (0.5)^9 = 0.2%. Indica un cambio sostenido en el promedio del proceso.

**Regla 3 — Tendencia de 6 puntos:** Seis puntos consecutivos monotónicamente crecientes O decrecientes. Indica una tendencia sistemática (desgaste de herramienta, temperatura que sube gradualmente, contaminación acumulativa).

**Regla 4 — 14 puntos alternantes:** Catorce puntos que alternan hacia arriba y hacia abajo. Indica mezcla de dos poblaciones diferentes (dos máquinas, dos turnos, dos operadores medidos alternadamente).

**Regla 5 — Dos de tres en zona A:** Dos de los últimos tres puntos en la zona A (entre 2σ y 3σ, del mismo lado). Señal de cambio moderado en el proceso.

**Regla 6 — Cuatro de cinco en zona B:** Cuatro de los últimos cinco puntos en la zona B o zona A (más allá de 1σ, del mismo lado). Señal de shift moderado sostenido.

**Regla 7 — 15 puntos en zona C:** Quince puntos consecutivos dentro de la zona C (entre la línea central y ±1σ). Paradójicamente, demasiada estabilidad también es sospechosa: indica estratificación (posiblemente los subgrupos mezclan datos de procesos diferentes).

**Regla 8 — 8 puntos en zonas A o B (ambos lados):** Ocho puntos consecutivos fuera de la zona C (ninguno cerca del centro). Confirma mezcla de dos procesos o poblaciones distintas.

### ¿Por qué importan estas reglas en la industria ecuatoriana?

En Ecuador, los procesos manufactureros frecuentemente operan con:
- Múltiples turnos (A, B, C) con diferente nivel de experiencia
- Materias primas de diferentes proveedores o lotes con variabilidad
- Equipos con mantenimiento irregular que se degradan gradualmente
- Ambientes con temperatura variable (especialmente en instalaciones sin climatización)

Estos factores generan exactamente los patrones que las Reglas Western Electric detectan. Sin estas reglas, el ingeniero de calidad puede mirar el gráfico y concluir "todo está dentro de los límites, no hay problema" mientras el proceso se deteriora gradualmente.

### Implementación práctica

**En Minitab:** Las reglas Western Electric se activan en las opciones del gráfico de control. Al ejecutar Stat → Control Charts, en el diálogo aparece el botón "Tests". Seleccionar las 8 reglas y Minitab automáticamente señala con un número (1-8) cada punto que viola la regla correspondiente y lista las violaciones en el output de la sesión.

**En Python:**

[Código python]
    import numpy as np
    
    def check_western_electric(data, cl, ucl, lcl, sigma):
        violations = []
        n = len(data)
    
        # Regla 1: Punto fuera de ±3σ
        for i, x in enumerate(data):
            if x > ucl or x < lcl:
                violations.append((i, 'Regla 1: Punto fuera de 3σ'))
    
        # Regla 2: 9 puntos consecutivos al mismo lado del CL
        for i in range(8, n):
            segment = data[i-8:i+1]
            if all(x > cl for x in segment) or all(x < cl for x in segment):
                violations.append((i, 'Regla 2: Corrida de 9 puntos'))
    
        # Regla 3: 6 puntos en tendencia creciente o decreciente
        for i in range(5, n):
            segment = data[i-5:i+1]
            if all(segment[j] < segment[j+1] for j in range(5)):
                violations.append((i, 'Regla 3: Tendencia creciente'))
            if all(segment[j] > segment[j+1] for j in range(5)):
                violations.append((i, 'Regla 3: Tendencia decreciente'))
    
        return violations
[/Código]

**Con ChatGPT:** Si pegas una lista de 25-30 puntos de un gráfico de control y los valores de CL, UCL y LCL, ChatGPT puede verificar todas las reglas Western Electric y explicar qué causa probable genera cada violación detectada.

### Interpretación de las causas más comunes

| Regla violada | Causa más frecuente en manufactura |
|---------------|-----------------------------------|
| Regla 1 | Cambio de material, falla de equipo, error de medición |
| Regla 2 | Cambio de turno/operador, ajuste no documentado |
| Regla 3 | Desgaste de herramienta, temperatura ambiental, degradación |
| Regla 4 | Mezcla de dos máquinas o dos operadores en datos alternos |
| Reglas 5 y 6 | Shift gradual por ajuste excesivo o cambio de proveedor |
| Regla 7 | Muestreo incorrecto (subgrupos de diferentes procesos mezclados) |
| Regla 8 | Dos turnos con diferente media pero sin distinción en el gráfico |`,
    presentacionSlides: [
      { titulo: "Reglas Western Electric: detectar lo que el ojo no ve", contenido: "Un proceso puede degradarse con todos los puntos DENTRO de los límites si muestra patrones no aleatorios. Las 8 reglas Western Electric detectan corridas, tendencias, mezclas y estratificación que el ojo humano ignora." },
      { titulo: "Las 4 reglas más importantes", contenido: "Regla 1: Punto fuera ±3σ (cambio abrupto). Regla 2: 9 puntos al mismo lado del CL (shift sostenido). Regla 3: 6 puntos en tendencia (desgaste gradual). Regla 4: 14 alternantes (mezcla de 2 poblaciones)." },
      { titulo: "Regla 7: demasiada estabilidad también es sospechosa", contenido: "15 puntos consecutivos en zona C (±1σ): paradoja SPC. Tanta estabilidad indica que los subgrupos mezclan datos de procesos diferentes. El gráfico parece 'perfecto' pero en realidad hay un problema de muestreo." },
      { titulo: "Causas por tipo de regla", contenido: "Regla 1: falla equipo, material diferente. Regla 2: cambio turno/operador. Regla 3: desgaste herramienta, temperatura. Regla 4: mezcla de máquinas alternadas. Reglas 5-6: ajuste excesivo, cambio proveedor." },
      { titulo: "Activar las 8 reglas en Minitab", contenido: "Stat → Control Charts → [tipo de gráfico] → botón Tests. Seleccionar las 8 reglas. Minitab señala con número 1-8 cada violación y lista todas en el output de sesión. Sin este paso, se pierden el 60% de las señales." },
      { titulo: "Python: verificar reglas automáticamente", contenido: "Función check_western_electric(data, cl, ucl, lcl, sigma). Recorre los datos, aplica lógica de cada regla, devuelve lista de (índice, descripción_violación). Automatiza lo que sería revisión visual tediosa." },
      { titulo: "ChatGPT para diagnóstico diferencial de causas", contenido: "Pegar lista de valores del gráfico + CL/UCL/LCL. ChatGPT verifica todas las reglas y para cada violación propone: causas más probables por sector, datos a recolectar para confirmar, acción correctiva prioritaria." },
      { titulo: "Impacto en industria ecuatoriana", contenido: "Turnos múltiples con diferente experiencia → Regla 4 o Regla 8. Proveedores variables → Regla 5-6. Equipos sin mantenimiento → Regla 3 (tendencia). Sin estas reglas: proceso 'parece ok' mientras la calidad se degrada." },
    ],
    quiz: [
      { pregunta: "¿Qué detecta la Regla 2 de Western Electric (corrida de 9 puntos al mismo lado del CL)?", opciones: ["Una falla catastrófica del equipo", "Un cambio sostenido en el promedio del proceso (shift), aunque todos los puntos estén dentro de los límites ±3σ", "Un error de calibración del instrumento de medición", "Variación normal del proceso sin ninguna causa especial"], respuesta: 1, explicacion: "La Regla 2 detecta que 9 puntos consecutivos están todos por encima o todos por debajo de la línea central. La probabilidad estadística de esto por azar es 0.2%, indicando un shift sostenido en el promedio del proceso, típicamente por cambio de operador, turno, materia prima o ajuste no documentado." },
      { pregunta: "¿Qué problema de proceso indica la Regla 7 (15 puntos consecutivos en la zona C, dentro de ±1σ)?", opciones: ["El proceso es extremadamente estable y preciso, lo cual es siempre deseable", "Estratificación: los subgrupos posiblemente mezclan datos de dos procesos o poblaciones distintas", "El proceso está fuera de control estadístico y debe pararse", "Los límites de control están mal calculados por una σ demasiado grande"], respuesta: 1, explicacion: "La Regla 7 es la 'paradoja de la estabilidad': 15 puntos dentro de ±1σ es estadísticamente imposible por pura aleatoriedad. Indica estratificación — los subgrupos probablemente mezclan mediciones de dos procesos distintos que se cancelan mutuamente, creando una falsa apariencia de estabilidad." },
      { pregunta: "Un gráfico de control muestra 6 puntos consecutivos creciendo monotónicamente, todos dentro de los límites ±3σ. ¿Qué regla Western Electric viola este patrón?", opciones: ["Regla 1 — Punto fuera de límites", "Regla 3 — Tendencia de 6 puntos consecutivos", "Regla 4 — 14 puntos alternantes", "Regla 7 — 15 puntos en zona C"], respuesta: 1, explicacion: "La Regla 3 detecta 6 o más puntos consecutivos monotónicamente crecientes o decrecientes. Es la firma clásica de tendencia sistemática causada por desgaste de herramienta, temperatura ambiental que sube gradualmente o contaminación acumulativa." },
      { pregunta: "En el contexto de manufactura ecuatoriana con múltiples turnos (A, B, C), ¿qué patrón Western Electric es más probable que aparezca si los tres turnos tienen diferentes niveles de habilidad del operador?", opciones: ["Regla 3 (tendencia) porque los operadores mejoran con el tiempo", "Regla 4 (14 puntos alternantes) o Regla 8 (8 puntos en zonas A/B ambos lados), porque mezclan datos de procesos con diferentes medias", "Regla 1 (punto fuera de límites) siempre y en todos los turnos", "Regla 7 (15 puntos en zona C) porque la mezcla centra los datos"], respuesta: 1, explicacion: "Cuando tres turnos con diferentes niveles de habilidad se mezclan en el mismo gráfico, el resultado típico es la aparición de Regla 4 (alternancia entre alto y bajo) o Regla 8 (puntos consistentemente alejados del centro en ambas direcciones), reflejando la mezcla de dos o tres poblaciones con diferentes medias." },
      { pregunta: "¿Cuál es la ventaja de activar las 8 reglas Western Electric en Minitab versus solo revisar puntos fuera de ±3σ?", opciones: ["Las 8 reglas son más fáciles de calcular manualmente que los límites ±3σ", "Se detectan el 60% adicional de señales de causa especial que no generan puntos fuera de límites pero sí muestran patrones no aleatorios", "Las 8 reglas eliminan la necesidad de calcular límites de control", "Solo la Regla 1 es estadísticamente válida; las otras 7 son opcionales"], respuesta: 1, explicacion: "Las Reglas 2-8 detectan causas especiales que NO generan puntos fuera de los límites ±3σ. Un proceso con shift gradual, tendencia de desgaste o mezcla de turnos puede verse 'dentro de control' revisando solo puntos fuera de límites, mientras se está deteriorando silenciosamente." },
    ],
    ejercicio: {
      titulo: "Aplicar las 8 reglas Western Electric a un gráfico de control",
      objetivo: "Identificar todas las violaciones de reglas Western Electric en un dataset de control de calidad y diagnosticar las causas probables con la ayuda de IA.",
      herramientas: "Python (Google Colab) o Minitab, ChatGPT o Claude",
      pasos: [
        "Genera un dataset de 30 subgrupos de n=5 para un proceso de llenado de cajas de chocolates (peso objetivo 250g, σ=2g). En los subgrupos 8-16, añade una tendencia creciente de 0.3g por subgrupo (simula desgaste de dosificador). En los subgrupos 20-28, añade una corrida donde todos los promedios están 1.5σ por encima del CL (simula cambio de turno con operario nuevo).",
        "Calcula el CL, UCL y LCL a partir de los primeros 7 subgrupos 'normales'. Grafica todos los 30 subgrupos con las líneas de control.",
        "Aplica manualmente (o con la función Python del tema) las 8 reglas Western Electric. Para cada violación, anota: número de subgrupo, regla violada, descripción del patrón.",
        "Usa ChatGPT con el prompt: 'Analiza estas violaciones de reglas Western Electric en mi proceso de llenado de cajas de chocolates (250g objetivo): [lista tus violaciones]. ¿Qué causa probable sugiere cada patrón? ¿Qué datos de proceso recopilarías para confirmar tu hipótesis?'",
        "Para cada causa sugerida por ChatGPT, escribe qué acción correctiva implementarías: ¿Es un ajuste de calibración, capacitación del operario, mantenimiento del dosificador o cambio de proveedor de material?",
        "Reflexiona: ¿cuántas señales hubieras detectado revisando solo puntos fuera de ±3σ? ¿Cuántas adicionales detectaste con las reglas 2-8? ¿Cuál es el impacto económico estimado de detectar cada tipo de señal una semana antes?",
      ],
      resultado: "Dataset con gráfico de control, lista completa de violaciones Western Electric identificadas, diagnóstico de causas de ChatGPT y plan de acciones correctivas documentado.",
      criterios: [
        { criterio: "Dataset generado con tendencia y corrida simuladas, gráfico con líneas de control visibles", puntos: 25 },
        { criterio: "Todas las violaciones Western Electric identificadas correctamente con número de regla", puntos: 30 },
        { criterio: "Diagnóstico de causas con ChatGPT documentado con evaluación crítica", puntos: 25 },
        { criterio: "Plan de acciones correctivas y reflexión sobre valor de las reglas adicionales", puntos: 20 },
      ],
    },
    recursos: [
      { titulo: "Western Electric Statistical Quality Control Handbook (PDF original)", url: "https://www.westernelectric.com/support/quality", tipo: "lectura", descripcion: "El manual original de Western Electric donde se publicaron por primera vez estas reglas en 1956. Referencia histórica y técnica fundamental." },
      { titulo: "ASQ — Control Chart Rules and Patterns", url: "https://asq.org/quality-resources/control-chart", tipo: "documentacion", descripcion: "Guía de la American Society for Quality sobre todas las reglas de detección de señales en gráficos de control con ejemplos visuales." },
      { titulo: "Statsmodels Python — Process Control", url: "https://www.statsmodels.org/stable/stats.html", tipo: "herramienta", descripcion: "Librería Python que incluye funciones para construir gráficos de control y verificar reglas de detección de señales." },
    ],
  },

  {
    id: 28,
    titulo: "Cp/Cpk y capacidad de proceso con IA",
    modulo: MOD6,
    moduloNum: 6,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Cp/Cpk y capacidad de proceso con IA",
    teoria: `## Capacidad de proceso: ¿puede tu proceso cumplir las especificaciones del cliente?

Los gráficos de control responden "¿está el proceso bajo control estadístico?" La capacidad de proceso responde la siguiente pregunta: "Si el proceso está bajo control, ¿es suficientemente bueno para cumplir los requerimientos del cliente?" Estas son preguntas distintas. Un proceso puede estar perfectamente bajo control estadístico y sin embargo ser incapaz de cumplir las especificaciones.

### Los índices Cp y Cpk: definición y cálculo

**Cp (Índice de Capacidad Potencial):**

Cp = (LSE − LIE) / (6σ)

Donde LSE = Límite Superior de Especificación (del cliente), LIE = Límite Inferior de Especificación, σ = desviación estándar del proceso.

Cp mide cuántas veces cabe la amplitud de ±3σ del proceso dentro de la tolerancia del cliente. Un Cp = 1.0 significa que el proceso usa exactamente el 100% de la tolerancia. Un Cp = 1.33 significa que el proceso usa el 75% de la tolerancia, dejando un margen de seguridad.

**Cpk (Índice de Capacidad Real):**

Cpk = mín [ (LSE − X̄) / 3σ, (X̄ − LIE) / 3σ ]

Cpk es el Cp ajustado por el centrado del proceso. Mientras Cp asume que el proceso está perfectamente centrado (promedio = punto medio de la tolerancia), Cpk considera la distancia real del promedio al límite más cercano. Cpk ≤ Cp siempre. Si Cpk = Cp, el proceso está perfectamente centrado.

### Valores de referencia e interpretación

| Cpk | Interpretación | Partes Por Millón (PPM) defectuosas |
|-----|----------------|-------------------------------------|
| < 1.0 | Proceso incapaz — genera defectos | > 2,700 |
| 1.0 | Mínimo aceptable (norma antigua) | 2,700 |
| 1.33 | Mínimo en industria moderna | 63 |
| 1.67 | Proceso capaz con margen | 0.57 |
| 2.0 | Seis Sigma (σ de proceso = 1/6 de tolerancia) | 0.002 |

En Ecuador, la norma INEN para muchos productos alimentarios requiere Cpk ≥ 1.33 como mínimo. La industria automotriz (normas IATF 16949) exige Cpk ≥ 1.67 para características críticas de seguridad.

### La diferencia práctica entre Cp y Cpk

Imaginemos un proceso de llenado de bebidas con especificación 500 ± 10 ml (LIE=490, LSE=510). El proceso tiene σ=2 ml.

- Cp = (510-490)/(6×2) = 20/12 = **1.67** → proceso potencialmente capaz
- Si el promedio real es 506 ml (descentrado hacia arriba):
- Cpk = mín[(510-506)/(3×2), (506-490)/(3×2)] = mín[0.67, 2.67] = **0.67** → proceso incapaz en la práctica

El proceso tiene suficiente "anchura" (Cp=1.67) pero está tan descentrado que supera el límite superior. La solución no es reducir la variación (ya es pequeña) sino centrar el proceso: ajustar la dosificadora para que el promedio sea 500 ml.

Este diagnóstico (centrar vs. reducir variación) es exactamente lo que distingue a un ingeniero de calidad efectivo, y es el tipo de análisis que ChatGPT y Claude pueden ayudar a estructurar.

### Pp y Ppk: capacidad de largo plazo

Además de Cp/Cpk (que usan σ estimado de rangos internos del subgrupo — variación a corto plazo), existen los índices Pp y Ppk que usan la desviación estándar total del proceso incluyendo variación entre subgrupos (largo plazo):

- Pp/Ppk ≤ Cp/Cpk siempre
- Si Pp/Ppk es mucho menor que Cp/Cpk, el proceso tiene variación adicional a largo plazo (cambios de turno, de lote, de operador) que no se captura a corto plazo

Comparar Cp con Pp revela el "potencial oculto" del proceso: cuánto podría mejorar Cpk si se eliminaran las fuentes de variación entre subgrupos.

### Análisis de capacidad con ChatGPT

ChatGPT puede calcular y interpretar índices de capacidad cuando se le proveen:
1. Tamaño de muestra (n) y datos o estadísticos resumidos (X̄, σ o Rango)
2. Límites de especificación del cliente (LIE, LSE)
3. Contexto del producto (industria, norma aplicable)

**Prompt modelo:**
*"Tengo datos de un proceso de llenado de fundas de arroz de 1 kg. En 25 subgrupos de n=5, el promedio global es X̄=1,003 g, la desviación estándar estimada por rangos es σ̂=2.5 g. La especificación del cliente es 1,000 ± 8 g (LIE=992, LSE=1,008). Calcula Cp, Cpk, Pp y Ppk. Interpreta si el proceso es capaz, indica cuántas PPM defectuosas se esperan y recomienda la acción prioritaria: centrar el proceso o reducir su variabilidad."*

### Capacidad de proceso para atributos: índice Z y DPMO

Cuando la característica de calidad es un atributo (defectivo/no defectivo) en lugar de una variable continua, la métrica de capacidad equivalente es el **DPMO** (Defects Per Million Opportunities — Defectos Por Millón de Oportunidades):

DPMO = (Total de defectos / Total de oportunidades) × 1,000,000

Y el índice Sigma equivalente se obtiene de tablas estándar. Un proceso con 66,807 DPMO opera a 3σ (Cpk=1.0). Un proceso con 3.4 DPMO opera a 6σ (Cpk=2.0).`,
    presentacionSlides: [
      { titulo: "Cp vs Cpk: dos preguntas diferentes", contenido: "Cp: ¿tiene el proceso suficiente anchura para la tolerancia? Cpk: considerando dónde está centrado el promedio, ¿cuántos defectos genera realmente? Cp=1.67 con Cpk=0.67 → proceso potencialmente bueno pero mal centrado." },
      { titulo: "Fórmulas Cp y Cpk", contenido: "Cp = (LSE - LIE) / 6σ. Cpk = mín[(LSE - X̄)/3σ, (X̄ - LIE)/3σ]. Cpk ≤ Cp siempre. Si Cpk = Cp → proceso perfectamente centrado. La diferencia Cp-Cpk revela el problema de centrado." },
      { titulo: "Tabla de referencia: Cpk → PPM defectuosas", contenido: "<1.0: >2,700 PPM (proceso incapaz). 1.0: 2,700 PPM (mínimo histórico). 1.33: 63 PPM (mínimo industria moderna). 1.67: 0.57 PPM. 2.0: 0.002 PPM (Seis Sigma). INEN Ecuador: mínimo 1.33." },
      { titulo: "Diagnóstico: ¿centrar o reducir variación?", contenido: "Cpk bajo porque Cp bajo → hay que REDUCIR variación (menor σ: mejor proceso, mejor equipo). Cpk bajo aunque Cp sea alto → hay que CENTRAR el proceso (ajustar promedio al punto medio de la tolerancia). Diagnóstico antes de acción." },
      { titulo: "Pp vs Ppk: corto vs largo plazo", contenido: "Cp/Cpk: variación interna del subgrupo (corto plazo). Pp/Ppk: variación total incluyendo entre subgrupos (largo plazo). Diferencia grande = hay fuentes de variación entre turnos/lotes/operadores que controlar." },
      { titulo: "DPMO: capacidad para atributos", contenido: "DPMO = (defectos / oportunidades) × 1,000,000. 66,807 DPMO = 3σ = Cpk 1.0. 6,210 DPMO = 4σ = Cpk 1.33. 233 DPMO = 5σ = Cpk 1.67. 3.4 DPMO = 6σ = Cpk 2.0. Para procesos de inspección visual." },
      { titulo: "Prompt para análisis de capacidad con ChatGPT", contenido: "Incluir: X̄, σ o rango promedio, tamaño de subgrupo, LIE y LSE del cliente, industria y norma aplicable. ChatGPT calcula Cp, Cpk, PPM esperadas, y recomienda: centrar vs. reducir variación. Diagnóstico en segundos." },
      { titulo: "Normativa ecuatoriana de capacidad de proceso", contenido: "INEN: normas sectoriales alimentarias requieren Cpk ≥ 1.33. ARCSA: para industria farmacéutica y alimentos procesados. IATF 16949: Cpk ≥ 1.67 para características de seguridad en automotriz (plantas en Ecuador)." },
    ],
    quiz: [
      { pregunta: "Un proceso tiene Cp=1.8 y Cpk=0.9. ¿Cuál es el diagnóstico correcto y la acción recomendada?", opciones: ["El proceso es capaz; no se requiere ninguna acción", "El proceso tiene suficiente amplitud pero está descentrado; la acción es ajustar el promedio hacia el punto medio de la tolerancia", "Hay que reducir la variabilidad del proceso porque σ es muy grande", "El proceso está bajo control estadístico y es capaz"], respuesta: 1, explicacion: "Cp=1.8 significa el proceso tiene suficiente amplitud (usa solo el 56% de la tolerancia). Cpk=0.9 significa está descentrado y genera defectos. La diferencia grande Cp-Cpk indica que el problema no es σ (ya es pequeño) sino el centrado del promedio. Acción: ajustar el promedio sin cambiar la variabilidad." },
      { pregunta: "¿Qué significa un Cpk=1.33 en términos de partes defectuosas?", opciones: ["El proceso genera 2,700 partes defectuosas por millón", "El proceso genera aproximadamente 63 partes defectuosas por millón", "El proceso es perfecto: 0 defectos por millón", "El proceso genera el 1.33% de defectos"], respuesta: 1, explicacion: "Cpk=1.33 corresponde a un proceso a 4σ, que genera aproximadamente 63 partes por millón de oportunidades (63 PPM) fuera de especificación. Este es el mínimo exigido por la mayoría de las normas de calidad modernas, incluyendo muchos estándares INEN." },
      { pregunta: "¿Cuál es la diferencia entre Cpk (corto plazo) y Ppk (largo plazo)?", opciones: ["Son exactamente iguales; solo difieren en el nombre según el software usado", "Cpk usa la variación interna del subgrupo; Ppk usa la variación total del proceso incluyendo variación entre subgrupos (turnos, lotes, operadores)", "Ppk siempre es mayor que Cpk", "Cpk se usa para variables y Ppk para atributos"], respuesta: 1, explicacion: "Cpk estima σ a partir de los rangos internos de los subgrupos, capturando solo variación a corto plazo dentro del turno. Ppk usa la desviación estándar total del dataset, incluyendo variación entre subgrupos. Si Ppk << Cpk, hay fuentes de variación entre turnos o lotes que reducen la capacidad real del proceso." },
      { pregunta: "Una planta de alimentos en Ecuador tiene un proceso con DPMO=6,210. ¿A qué nivel Sigma opera y cuál es el Cpk equivalente?", opciones: ["2 Sigma, Cpk=0.67", "3 Sigma, Cpk=1.0", "4 Sigma, Cpk=1.33", "6 Sigma, Cpk=2.0"], respuesta: 2, explicacion: "6,210 DPMO corresponde a 4 Sigma, equivalente a Cpk=1.33. Este es el nivel que la mayoría de las normas INEN y estándares de calidad alimentaria ecuatorianos consideran el mínimo aceptable para producción comercial." },
      { pregunta: "¿Por qué es incorrecto intentar reducir la variabilidad (σ) de un proceso cuyo problema principal es de centrado (Cp alto pero Cpk bajo)?", opciones: ["Porque reducir σ es siempre incorrecto en calidad", "Porque el recurso se gasta en la acción equivocada: el problema es que el promedio no está en el centro de la tolerancia, no que σ sea grande", "Porque la norma ISO prohíbe reducir variabilidad en procesos capaces", "Porque Cpk no depende de σ sino solo de la especificación del cliente"], respuesta: 1, explicacion: "Cuando Cp es alto pero Cpk es bajo, el proceso ya tiene suficiente variabilidad controlada. El problema es el centrado: el promedio está desviado del centro de la tolerancia. Invertir recursos en reducir σ no resuelve el problema; solo ajustar el promedio mejora Cpk de manera efectiva." },
    ],
    ejercicio: {
      titulo: "Cálculo de capacidad Cp/Cpk y diagnóstico con ChatGPT",
      objetivo: "Calcular los índices Cp y Cpk para un proceso industrial, diagnosticar si el problema es de variabilidad o de centrado, y obtener recomendaciones de mejora de ChatGPT.",
      herramientas: "Excel o Google Sheets, ChatGPT o Claude",
      pasos: [
        "Elige un proceso con especificación definida. Opción A: usa datos reales de tu empresa. Opción B: usa este dataset simulado de llenado de bolsas de azúcar (especificación: 1,000 ± 15 g): genera 25 subgrupos de n=5 con promedio X̄=1,008 g y σ=4 g (el proceso está descentrado hacia arriba).",
        "En Excel, calcula: σ̂ usando el método de rangos (R̄/d2, donde d2=2.326 para n=5). Luego calcula: Cp = (LSE - LIE) / (6 × σ̂). Cpk = MIN[(LSE - X̄)/(3×σ̂), (X̄ - LIE)/(3×σ̂)]. Muestra todas las fórmulas visibles en la hoja.",
        "Interpreta los resultados: ¿Cuál es la causa del problema (variabilidad vs centrado)? ¿Cuántas PPM defectuosas esperarías? ¿Cuál es la acción prioritaria?",
        "Usa ChatGPT con el prompt completo: incluye el proceso, los valores de LIE, LSE, X̄, σ̂, Cp y Cpk calculados. Pide: confirmación del diagnóstico, PPM esperadas, y un plan de acción concreto de 3 pasos para mejorar Cpk al nivel de 1.33 mínimo.",
        "Evalúa el plan de ChatGPT: ¿Es técnicamente correcto? ¿Es aplicable a una empresa ecuatoriana con presupuesto limitado? ¿Qué ajustarías con tu conocimiento del proceso real?",
        "Calcula el ahorro económico potencial: si el proceso genera actualmente X% de producto fuera de especificación y mejoras Cpk a 1.33, ¿cuánto material se ahorra al mes? Usa el costo del producto para hacer el cálculo.",
      ],
      resultado: "Hoja de cálculo con Cp/Cpk calculados con fórmulas visibles, diagnóstico documentado, plan de ChatGPT evaluado críticamente y cálculo de ahorro económico potencial.",
      criterios: [
        { criterio: "Cp y Cpk calculados correctamente con fórmulas visibles en Excel (no solo resultado)", puntos: 30 },
        { criterio: "Diagnóstico correcto de causa raíz (variabilidad vs centrado) con justificación", puntos: 25 },
        { criterio: "Prompt bien construido, respuesta de ChatGPT documentada con evaluación crítica", puntos: 25 },
        { criterio: "Cálculo de ahorro económico potencial con supuestos explicitados", puntos: 20 },
      ],
    },
    recursos: [
      { titulo: "iSixSigma — Process Capability (Cp, Cpk) Reference", url: "https://www.isixsigma.com/dictionary/process-capability-cpk/", tipo: "documentacion", descripcion: "Referencia completa de iSixSigma sobre índices de capacidad de proceso con ejemplos y tabla de PPM por nivel Cpk." },
      { titulo: "Quality-One — Capability Analysis Guide", url: "https://quality-one.com/capability-analysis/", tipo: "lectura", descripcion: "Guía práctica de análisis de capacidad de proceso con ejemplos industriales y diferencia entre Cp/Cpk y Pp/Ppk." },
      { titulo: "Minitab Blog — Capability Analysis", url: "https://blog.minitab.com/en/statistics-and-quality-data-analysis/process-capability-analysis-using-minitab-1", tipo: "lectura", descripcion: "Tutorial oficial de Minitab para ejecutar análisis de capacidad de proceso con interpretación paso a paso." },
    ],
  },

  {
    id: 29,
    titulo: "Análisis Pareto de defectos con ChatGPT",
    modulo: MOD6,
    moduloNum: 6,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Análisis Pareto de defectos con ChatGPT",
    teoria: `## El principio de Pareto: el 80/20 que transforma la gestión de calidad

Vilfredo Pareto, economista italiano del siglo XIX, observó que el 80% de la riqueza de Italia pertenecía al 20% de la población. Joseph Juran, uno de los padres de la calidad moderna, aplicó este principio a los defectos industriales y acuñó el concepto: en casi cualquier proceso, el **80% de los defectos provienen del 20% de las causas**.

Esta observación tiene una implicación práctica poderosa: no es necesario resolver todos los problemas de calidad para obtener mejoras dramáticas. Basta con identificar y eliminar las pocas causas vitales que generan la mayoría de los defectos.

### El diagrama de Pareto: construcción e interpretación

El diagrama de Pareto combina un gráfico de barras con una curva acumulativa de porcentaje. Su construcción sigue cinco pasos:

1. **Recolectar datos:** Registrar todos los defectos por tipo durante un período definido (una semana, un lote, un mes).

2. **Ordenar de mayor a menor:** Calcular la frecuencia de cada tipo de defecto y ordenar en forma decreciente.

3. **Calcular porcentaje acumulado:** Para cada tipo de defecto, el porcentaje acumulado es la suma de su frecuencia más todas las frecuencias anteriores, dividida entre el total.

4. **Graficar:** Barras ordenadas de mayor a menor (eje izquierdo: frecuencia absoluta), curva de porcentaje acumulado (eje derecho: 0-100%).

5. **Identificar el punto 80%:** El tipo de defecto donde la curva cruza el 80% es la línea divisoria. Todo lo que está a la izquierda es el "vital few" — las pocas causas vitales. Todo lo que está a la derecha es el "useful many".

### Pareto en dos niveles: encontrar la causa raíz

El Pareto estratificado (también llamado Pareto de segundo nivel o drill-down Pareto) es la técnica que lleva el análisis de "cuáles son los defectos más frecuentes" a "cuáles son las causas raíz de esos defectos frecuentes".

**Nivel 1 — Pareto de tipos de defecto:**
Identifica que el defecto "Peso fuera de especificación" representa el 67% de todos los defectos.

**Nivel 2 — Pareto de causas del defecto principal:**
Para las instancias de "Peso fuera de especificación", analiza qué causas las originaron: Turno A (42%), Turno C (31%), Materia prima Proveedor B (18%), Calibración de balanza (9%).

**Nivel 3 (si aplica) — Pareto de causas de la causa principal:**
Para el "Turno A", ¿qué específicamente causa el problema de peso? Operador con menos de 3 meses de entrenamiento (71%), máquina dosificadora #3 sin mantenimiento reciente (29%).

Este drill-down de tres niveles convierte datos crudos de calidad en causas raíz accionables con alta precisión y bajo riesgo de atacar el síntoma en lugar de la causa.

### ChatGPT como analista de Pareto

ChatGPT acelera significativamente el análisis de Pareto cuando se le proporciona el dataset correctamente:

**Para construir el diagrama:**
*"Aquí están los defectos de mi línea de producción del último mes: [lista tipos y frecuencias]. Ordénalos en formato de diagrama de Pareto, calcula el porcentaje acumulado para cada tipo y dime cuáles son las causas vitales (el 80% acumulado)."*

**Para investigar causas raíz:**
*"El defecto 'Sellado incompleto' representa el 52% de los defectos en mi empacadora de alimentos. Las instancias registradas muestran este patrón: [datos por turno, máquina, temperatura, operador]. Haz un Pareto de segundo nivel e identifica las 2-3 causas más probables a investigar primero."*

**Para redactar el plan de acción:**
*"Basado en el Pareto de segundo nivel, las causas prioritarias son: [lista causas]. Redacta un plan de acción SMART (Específico, Medible, Alcanzable, Relevante, con Tiempo definido) para eliminar cada causa en las próximas 4 semanas. Considera que somos una empresa mediana en Ecuador con 3 técnicos de calidad disponibles."*

### Pareto para costos de calidad

Una variante poderosa del Pareto analiza no la frecuencia de defectos sino su **costo**: defecto poco frecuente pero costoso puede aparecer en el primer lugar del Pareto de costos aunque ocupe el quinto lugar en el Pareto de frecuencias.

Los componentes del costo de calidad (Modelo PAF — Prevention, Appraisal, Failure):
- **Costos de Prevención:** Capacitación, calibración, AMEF, auditorías de proceso
- **Costos de Evaluación:** Inspección, pruebas, laboratorio
- **Costos de Falla Interna:** Reproceso, scrap, reinspección
- **Costos de Falla Externa:** Devoluciones, garantías, pérdida de cliente

En la mayoría de las empresas ecuatorianas medianas, los costos de calidad totales representan entre el 5% y el 20% de las ventas. El Pareto de costos de calidad frecuentemente revela que las fallas externas (devoluciones, garantías) son el componente más costoso, aunque el equipo de calidad pasa la mayor parte del tiempo en evaluación (inspección).`,
    presentacionSlides: [
      { titulo: "Principio de Pareto en calidad industrial", contenido: "El 80% de los defectos proviene del 20% de las causas. Implicación: no resolver todos los problemas para obtener mejoras dramáticas. Identificar y eliminar las 'pocas causas vitales' (vital few). Joseph Juran aplicó el principio de Pareto a la calidad." },
      { titulo: "Construir el diagrama de Pareto: 5 pasos", contenido: "1. Recolectar defectos por tipo. 2. Ordenar de mayor a menor frecuencia. 3. Calcular % acumulado. 4. Graficar barras + curva acumulada. 5. Marcar el 80%: todo a la izquierda = vital few a atacar." },
      { titulo: "Pareto en 3 niveles: de síntoma a causa raíz", contenido: "Nivel 1: ¿Cuál defecto es el más frecuente? Nivel 2: ¿Cuál es la causa de ese defecto? (turno, máquina, proveedor). Nivel 3: ¿Qué específicamente causa esa causa? Drill-down hasta la causa raíz accionable." },
      { titulo: "ChatGPT para construir el Pareto de segundo nivel", contenido: "Pegar datos de defectos por tipo + variables de proceso (turno, máquina, operador). ChatGPT ordena, calcula % acumulado, identifica vital few y propone el Pareto de segundo nivel con causas probables a investigar." },
      { titulo: "Pareto de costos vs Pareto de frecuencias", contenido: "Frecuencia: cuántas veces ocurre cada defecto. Costo: cuánto cuesta cada defecto. Un defecto raro pero costoso puede ser el más importante económicamente. Hacer AMBOS análisis antes de priorizar acciones." },
      { titulo: "Modelo PAF: los 4 componentes del costo de calidad", contenido: "Prevención (capacitación, calibración). Evaluación (inspección, laboratorio). Falla Interna (reproceso, scrap). Falla Externa (devoluciones, garantías). En empresas medianas Ecuador: costos de calidad = 5-20% de ventas." },
      { titulo: "Prompt para plan de acción SMART con ChatGPT", contenido: "Causas prioritarias del Pareto + contexto empresa (tamaño, sector, recursos disponibles). ChatGPT redacta plan SMART por causa: acción específica, métrica, responsable, fecha límite, costo estimado." },
      { titulo: "Pareto en Excel: gráfico nativo desde 2016", contenido: "Excel 2016+: seleccionar datos de defectos → Insertar → Gráfico → Histograma/Pareto. Excel ordena automáticamente y traza la curva acumulada. Para drill-down: Pareto separado por turno, máquina o proveedor." },
    ],
    quiz: [
      { pregunta: "¿Qué representa el punto donde la curva acumulada del diagrama de Pareto cruza el 80%?", opciones: ["El defecto más frecuente en valor absoluto", "La línea divisoria entre las 'pocas causas vitales' (vital few) que generan el 80% de los defectos y el resto", "El máximo nivel de calidad alcanzable por el proceso", "El punto donde el Cpk del proceso es igual a 1.0"], respuesta: 1, explicacion: "El punto donde la curva acumulada cruza el 80% separa las pocas causas vitales (a la izquierda) que generan la mayoría de los defectos, de las muchas causas triviales (a la derecha). Atacar las causas a la izquierda del 80% produce el mayor impacto con el menor esfuerzo." },
      { pregunta: "¿Para qué sirve el Pareto de segundo nivel (drill-down)?", opciones: ["Para hacer el mismo análisis con datos del segundo mes", "Para identificar las causas raíz del defecto más frecuente, desagregando por variables como turno, máquina o proveedor", "Para calcular el Cpk de cada tipo de defecto", "Para comparar dos plantas diferentes entre sí"], respuesta: 1, explicacion: "El Pareto de segundo nivel toma el defecto más frecuente del primer nivel y analiza qué causas lo originan (turno, máquina, operador, proveedor). Este drill-down convierte la información de 'qué defecto es más frecuente' en 'qué causa específica hay que eliminar'." },
      { pregunta: "Una empresa analiza sus defectos por frecuencia y por costo. El defecto 'Etiqueta mal colocada' es el más frecuente (40% de defectos) pero barato de reparar. El defecto 'Contaminación de producto' ocurre solo el 5% de las veces pero genera devoluciones del 100% del lote. ¿Cuál debe atacarse primero?", opciones: ["Etiqueta mal colocada, porque es el más frecuente", "Contaminación de producto, porque el costo económico es mucho mayor aunque ocurra menos", "Son igualmente prioritarios", "Ninguno, porque juntos no llegan al 80% en frecuencia"], respuesta: 1, explicacion: "El Pareto de costos puede diferir del Pareto de frecuencias. Un defecto con alto costo por unidad (devolución del lote completo) puede ser mucho más impactante económicamente que un defecto frecuente pero barato. Siempre hacer los dos análisis antes de priorizar." },
      { pregunta: "¿Qué información debe incluir el prompt a ChatGPT para obtener un análisis de Pareto de segundo nivel útil?", opciones: ["Solo el nombre del defecto más frecuente", "La lista de defectos con frecuencias del primer nivel, más los datos del defecto principal desagregados por variables de proceso (turno, máquina, proveedor, operador)", "El precio de venta de cada producto defectuoso", "El manual de calidad de la empresa en formato PDF"], respuesta: 1, explicacion: "Para un Pareto de segundo nivel útil, ChatGPT necesita: (1) los datos del Pareto de primer nivel para identificar el defecto principal, y (2) los datos del defecto principal desagregados por las variables de proceso relevantes (turno, máquina, proveedor) para construir el segundo nivel." },
      { pregunta: "¿Cuál de los 4 componentes del costo de calidad (modelo PAF) suele ser el más costoso en empresas ecuatorianas medianas sin un sistema de calidad maduro?", opciones: ["Costos de prevención (capacitación y calibración)", "Costos de evaluación (inspección y laboratorio)", "Costos de falla externa (devoluciones y garantías)", "Costos de falla interna (reproceso y scrap)"], respuesta: 2, explicacion: "En empresas sin sistema de calidad maduro, los costos de falla externa (devoluciones, garantías, pérdida de clientes) son típicamente los más altos. Aunque el equipo de calidad pasa la mayor parte del tiempo en evaluación (inspección), el mayor costo económico proviene de los defectos que llegan al cliente." },
    ],
    ejercicio: {
      titulo: "Análisis Pareto de dos niveles con ChatGPT para proceso real",
      objetivo: "Construir un diagrama de Pareto de defectos, identificar las causas vitales, ejecutar un drill-down de segundo nivel y redactar un plan de acción SMART con la ayuda de ChatGPT.",
      herramientas: "Excel o Google Sheets, ChatGPT o Claude",
      pasos: [
        "Recolecta o simula datos de defectos de un proceso. Opción recomendada: una línea de empaque de frutas exportadas con los siguientes defectos en 1,000 cajas inspeccionadas: Peso fuera de rango: 87 cajas; Daño mecánico: 53 cajas; Color incorrecto: 41 cajas; Etiqueta defectuosa: 28 cajas; Caja dañada: 19 cajas; Otros: 12 cajas. Total: 240 cajas con defecto.",
        "En Excel, construye el Pareto de primer nivel: ordena defectos de mayor a menor, calcula % individual y % acumulado, crea el gráfico combinado (barras + línea acumulada) y marca el umbral del 80%.",
        "Identifica los 'vital few' — los defectos que superan el 80% acumulado. Para el defecto más frecuente ('Peso fuera de rango'), asume estos datos de segundo nivel (desagregados por turno): Turno A: 39; Turno C: 28; Turno B: 14; Sin datos turno: 6. Construye el Pareto de segundo nivel.",
        "Usa ChatGPT con el prompt: 'Analiza este Pareto de segundo nivel de defectos de peso fuera de rango en una empacadora de frutas de exportación en Ecuador. Turno A: 39 casos (50%), Turno C: 28 (36%), Turno B: 14 (18%). ¿Qué causas investigarías en el Turno A? ¿Qué preguntas le harías al supervisor del Turno A? Redacta un plan de acción SMART de 3 acciones para las próximas 4 semanas con responsable, métrica de éxito y presupuesto máximo de $500.'",
        "Documenta el plan de ChatGPT. Evalúa: ¿es aplicable a una empacadora mediana en Ecuador? ¿Cuál de las 3 acciones tiene el mayor impacto potencial con el menor costo?",
        "Calcula el impacto económico: si el proceso genera 240 defectos en 1,000 cajas (24% tasa de defectos) y el plan reduce los defectos del Turno A en un 70%, ¿cuántas cajas adicionales se exportarían por mes si la planta produce 15,000 cajas/mes? A $8/caja exportada, ¿cuál es el ingreso adicional mensual?",
      ],
      resultado: "Pareto de primer y segundo nivel en Excel, plan de acción SMART de ChatGPT documentado con evaluación, cálculo de impacto económico.",
      criterios: [
        { criterio: "Pareto de primer nivel correcto con gráfico combinado barras+línea acumulada y umbral 80% marcado", puntos: 25 },
        { criterio: "Pareto de segundo nivel del defecto principal con datos desagregados por variable", puntos: 25 },
        { criterio: "Prompt bien construido y plan SMART de ChatGPT documentado con evaluación crítica", puntos: 25 },
        { criterio: "Cálculo de impacto económico con supuestos explicitados", puntos: 25 },
      ],
    },
    recursos: [
      { titulo: "ASQ — Pareto Chart Tutorial", url: "https://asq.org/quality-resources/pareto", tipo: "documentacion", descripcion: "Tutorial oficial de la American Society for Quality sobre el diagrama de Pareto con ejemplos de construcción e interpretación." },
      { titulo: "iSixSigma — Cost of Quality (PAF Model)", url: "https://www.isixsigma.com/dictionary/cost-of-quality-coq/", tipo: "lectura", descripcion: "Explicación detallada del modelo PAF de costos de calidad con benchmark de porcentajes de ventas típicos por industria." },
      { titulo: "Excel — Crear gráfico de Pareto (soporte Microsoft)", url: "https://support.microsoft.com/es-es/office/crear-un-diagrama-de-pareto-a1512496-6dba-4743-9ab1-df5012972856", tipo: "documentacion", descripcion: "Instrucciones oficiales de Microsoft para crear diagramas de Pareto directamente en Excel 2016 y versiones posteriores." },
    ],
  },

  {
    id: 30,
    titulo: "Reportes de calidad automatizados (5W+1H)",
    modulo: MOD6,
    moduloNum: 6,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Reportes de calidad automatizados (5W+1H)",
    teoria: `## Reportes de calidad con IA: del dato crudo al informe ejecutivo en minutos

Un reporte de calidad efectivo no es solo una colección de datos y gráficos. Es una narrativa estructurada que lleva al lector desde la evidencia del problema hasta la causa raíz y las acciones correctivas, permitiendo tomar decisiones informadas con rapidez. La combinación del framework **5W+1H** con herramientas de IA transforma la redacción de reportes de una tarea que tomaba horas en un proceso de 15-20 minutos.

### El framework 5W+1H en calidad industrial

El 5W+1H (What, Who, When, Where, Why, How — Qué, Quién, Cuándo, Dónde, Por qué, Cómo) es el framework periodístico adaptado a la solución de problemas de calidad. Cada pregunta estructura una sección del reporte:

**What (¿Qué ocurrió?):** Descripción específica del defecto o desviación. No "hubo problema de calidad" sino "el 23% de los lotes del turno A presentaron peso inferior al límite de especificación mínima de 992g, con promedio de 988g".

**Who (¿Quién está involucrado?):** Operadores, turnos, clientes afectados, áreas de la planta. Incluye quién detectó el problema, quién lo reportó y quién es responsable de la corrección.

**When (¿Cuándo ocurrió?):** Período específico, fecha de primera detección, si el problema es nuevo o recurrente. La línea de tiempo del defecto frecuentemente revela la causa.

**Where (¿Dónde ocurrió?):** Línea de producción, máquina específica, área de la planta, lote de producto. Localizar el problema es el primer paso para encontrar la causa.

**Why (¿Por qué ocurrió?):** Esta es la sección más crítica. Aquí se aplica el análisis de causa raíz: los 5 Porqués, el diagrama de Ishikawa, el análisis de Pareto. ChatGPT y Claude son especialmente útiles en esta sección.

**How (¿Cómo se resuelve?):** Acciones correctivas (eliminar la causa) y preventivas (evitar recurrencia). Incluye responsable, fecha límite y métrica de verificación.

### Los 5 Porqués con asistencia de IA

La técnica de los **5 Porqués** de Toyota consiste en preguntar "¿por qué?" de forma iterativa hasta alcanzar la causa raíz sistémica, no solo el síntoma superficial:

Problema: el producto salió fuera de peso.
- Por qué 1: la dosificadora entregó menos material
- Por qué 2: el tornillo dosificador tenía desgaste acumulado
- Por qué 3: el mantenimiento preventivo estaba atrasado 3 semanas
- Por qué 4: el técnico de mantenimiento asignado estuvo enfermo y no hubo reemplazo
- Por qué 5: el procedimiento de sustitución de personal de mantenimiento no existe en el sistema

La causa raíz es sistémica: **falta de procedimiento de contingencia de personal de mantenimiento**. La acción correctiva es crear y documentar ese procedimiento, no solo arreglar el tornillo.

**Prompt para 5 Porqués con ChatGPT:**
*"Ayúdame a aplicar los 5 Porqués para este problema de calidad: [descripción del problema con datos concretos — qué pasó, cuándo, en qué equipo, con qué resultado medible]. El proceso involucra [descripción breve del proceso]. Variables conocidas: [operadores, máquinas, materiales, turno]. Guíame a través de los 5 Porqués hasta la causa raíz sistémica y propone la acción correctiva para esa causa raíz."*

### Automatización del reporte con Claude

Claude es especialmente efectivo para redactar reportes ejecutivos de calidad porque puede:
1. Tomar datos brutos (tabla de defectos, resultados de análisis Pareto, conclusiones del 5 Porqués) y organizarlos en el formato 5W+1H
2. Adaptar el lenguaje al audiencia (técnico para el equipo de calidad, ejecutivo para la gerencia)
3. Generar múltiples versiones del mismo reporte para diferentes destinatarios

**Prompt para reporte ejecutivo:**
*"Redacta un reporte de calidad ejecutivo usando el formato 5W+1H para la siguiente situación en nuestra planta en Ecuador: [datos del problema, resultados del análisis, causa raíz encontrada, acciones propuestas]. El reporte es para la gerencia general que no tiene formación técnica en calidad. Debe ser conciso (máximo 400 palabras), sin jerga estadística, con énfasis en el impacto económico y las acciones concretas."*

### Automatización con Excel + Power Query + ChatGPT

Para empresas con volumen alto de reportes de calidad, el flujo automatizado es:

1. **Excel/Power Query:** Consolidar datos de defectos de múltiples fuentes (registros de producción, hojas de inspección, sistema de devoluciones) en una tabla maestra
2. **Cálculos automáticos:** COUNTIF, SUMIF y tablas dinámicas que actualizan los indicadores de calidad en tiempo real
3. **ChatGPT/Claude via API:** Para empresas con capacidad técnica, usar la API de OpenAI o Anthropic para generar automáticamente la narrativa del reporte desde los datos de la tabla

**Prompt para narrativa desde datos:**
*"Eres el analista de calidad de una empresa manufacturera en Ecuador. Basado en estos indicadores del mes de [mes]: [tabla de datos con defectos, CPK, Pareto top 3, DPMO], redacta el párrafo de análisis ejecutivo para el informe mensual de calidad. Compara con el mes anterior y destaca los 2 hallazgos más importantes y las 2 acciones prioritarias."*

### Cumplimiento normativo con IA

En Ecuador, la **ARCSA** (Agencia Nacional de Regulación, Control y Vigilancia Sanitaria) requiere que las empresas de alimentos y cosméticos mantengan registros de control de calidad en formatos específicos. Claude puede ayudar a adaptar los reportes a los formatos requeridos:

*"Tengo este reporte de control de calidad de proceso. Adaptalo al formato de registro que exige la ARCSA para empresas de alimentos procesados según el Reglamento de Buenas Prácticas de Manufactura. Incluye todos los campos requeridos por la normativa ecuatoriana."*`,
    presentacionSlides: [
      { titulo: "5W+1H: el framework que estructura cualquier reporte de calidad", contenido: "What (¿Qué?): defecto específico con datos. Who (¿Quién?): operadores, turnos, clientes. When (¿Cuándo?): período, primera detección. Where (¿Dónde?): máquina, línea, lote. Why (¿Por qué?): causa raíz. How (¿Cómo?): acciones correctivas." },
      { titulo: "5 Porqués: de síntoma a causa raíz sistémica", contenido: "Toyota: preguntar '¿por qué?' 5 veces hasta la causa sistémica. Ejemplo: producto fuera de peso → dosificadora desgastada → mantenimiento atrasado → técnico enfermo → NO HAY PROCEDIMIENTO DE CONTINGENCIA. La acción correctiva es el procedimiento, no el tornillo." },
      { titulo: "Prompt para 5 Porqués con ChatGPT", contenido: "Describir el problema con datos concretos + proceso + variables conocidas. ChatGPT guía iterativamente a través de los 5 Porqués. Pedir explícitamente que llegue a la causa raíz SISTÉMICA, no al síntoma superficial." },
      { titulo: "Claude para reporte ejecutivo: un prompt, un informe", contenido: "Datos brutos + causa raíz + acciones → Claude redacta 5W+1H completo. Pedir versión para gerencia (sin jerga, con impacto económico) y versión técnica (con datos estadísticos para el equipo de calidad). Un input, dos outputs." },
      { titulo: "Automatización: Excel + ChatGPT API", contenido: "Power Query consolida datos de múltiples hojas. COUNTIF/tablas dinámicas calculan indicadores automáticamente. API de OpenAI/Anthropic genera narrativa desde los datos. Resultado: informe mensual de calidad en <15 minutos vs. 3-4 horas manuales." },
      { titulo: "ARCSA Ecuador: cumplimiento normativo con IA", contenido: "ARCSA exige registros de control de calidad en formatos específicos para alimentos y cosméticos. Claude adapta reportes existentes al formato requerido si le provees el reporte actual y la normativa aplicable. Ahorra horas de reformateo manual." },
      { titulo: "Ishikawa + IA: causa raíz en 4 categorías", contenido: "El diagrama de causa-efecto (espina de pescado) organiza causas en: Máquina, Material, Método, Mano de obra, Medio ambiente, Medición (6M). Pide a Claude que genere el diagrama Ishikawa para tu defecto principal: lista de causas posibles por cada M." },
      { titulo: "Estructura del reporte completo en 6 secciones", contenido: "1. Resumen ejecutivo (3 puntos). 2. Descripción del problema (What/When/Where/Who). 3. Análisis de causa raíz (Why: 5 Porqués + Pareto). 4. Acciones correctivas (How: SMART). 5. Indicadores de seguimiento. 6. Aprobaciones/firmas." },
    ],
    quiz: [
      { pregunta: "¿Cuál es el objetivo principal de los 5 Porqués en el análisis de causa raíz?", opciones: ["Hacer exactamente 5 preguntas y no más", "Llegar a la causa raíz sistémica del problema, no quedarse en el síntoma superficial", "Identificar a los 5 operadores responsables del defecto", "Calcular los 5 indicadores de calidad más importantes"], respuesta: 1, explicacion: "Los 5 Porqués buscan la causa raíz sistémica preguntando '¿por qué?' de forma iterativa. El número 5 es orientativo; el objetivo es seguir preguntando hasta identificar una causa sobre la que se puede actuar sistémicamente para prevenir recurrencias, no solo corregir el síntoma." },
      { pregunta: "En el framework 5W+1H para reportes de calidad, ¿cuál de las 6 preguntas aborda la causa raíz del problema?", opciones: ["What (¿Qué ocurrió?)", "When (¿Cuándo ocurrió?)", "Why (¿Por qué ocurrió?)", "How (¿Cómo se resuelve?)"], respuesta: 2, explicacion: "'Why' (¿Por qué?) es la sección de análisis de causa raíz del reporte, donde se aplican los 5 Porqués, el diagrama de Ishikawa y el análisis de Pareto. Esta sección es la más crítica porque determina la acción correctiva correcta." },
      { pregunta: "¿Qué diferencia a una 'acción correctiva' de una 'acción preventiva' en un reporte de calidad?", opciones: ["Son sinónimos; se usan indistintamente en reportes de calidad", "Acción correctiva: elimina la causa del problema actual. Acción preventiva: evita que el mismo tipo de problema ocurra en el futuro en otros procesos o productos", "Acción correctiva la hace el operador; acción preventiva la hace el gerente", "Acción preventiva se aplica antes de producir; acción correctiva durante la producción"], respuesta: 1, explicacion: "La acción correctiva elimina la causa del problema que ya ocurrió (reparar el dosificador, crear el procedimiento de contingencia). La acción preventiva extiende la solución para prevenir que el mismo tipo de causa raíz genere problemas en otros procesos o productos similares." },
      { pregunta: "¿Por qué Claude es más efectivo que solo Excel para generar reportes ejecutivos de calidad?", opciones: ["Porque Claude puede imprimir los reportes directamente", "Porque Claude convierte datos brutos en narrativa estructurada en lenguaje natural, adaptable a diferentes audiencias (técnica vs. gerencial) en minutos", "Porque Claude reemplaza completamente al analista de calidad", "Porque Excel no puede hacer análisis estadístico"], respuesta: 1, explicacion: "Excel maneja cálculos y tablas eficientemente, pero generar la narrativa interpretativa (qué significan los datos, cuáles son las implicaciones, qué acciones se recomiendan) requiere tiempo humano. Claude genera esa narrativa en segundos a partir de los datos y el contexto del problema." },
      { pregunta: "¿Para qué tipo de empresa ecuatoriana es más relevante adaptar reportes de calidad al formato ARCSA?", opciones: ["Empresas de servicios financieros y seguros", "Empresas de alimentos procesados, cosméticos y productos farmacéuticos sujetos a regulación sanitaria", "Empresas de construcción civil", "Cualquier empresa con más de 50 empleados"], respuesta: 1, explicacion: "La ARCSA (Agencia Nacional de Regulación, Control y Vigilancia Sanitaria) regula alimentos procesados, cosméticos y productos farmacéuticos en Ecuador, exigiendo registros de control de calidad en formatos específicos. Las empresas de estos sectores deben cumplir estas regulaciones para operar legalmente." },
    ],
    ejercicio: {
      titulo: "Reporte de calidad completo 5W+1H con 5 Porqués y Claude",
      objetivo: "Redactar un reporte de calidad ejecutivo completo usando el framework 5W+1H, aplicar los 5 Porqués para identificar la causa raíz y generar el informe con la asistencia de Claude.",
      herramientas: "Claude.ai (claude.ai/chat), Word o Google Docs",
      pasos: [
        "Selecciona un problema de calidad real de tu empresa o usa este caso: Una fábrica de galletas en Ambato recibió una devolución de 450 cajas (15% del lote) de un supermercado de Quito porque el peso neto era inferior al declarado en el empaque (300g declarado, promedio medido: 288g). El defecto se detectó el 15 de abril durante auditoría del cliente. Las galletas fueron producidas en los turnos A y C del 10 al 12 de abril en la máquina dosificadora #2.",
        "Aplica los 5 Porqués al problema. Usa este prompt con Claude: 'Guíame a través de los 5 Porqués para el siguiente problema de calidad en una galleta ecuatoriana: peso neto 12g inferior al declarado, detectado en devolución de supermercado, producido en dosificadora #2 turnos A y C. Empieza con el primer porqué y espera mi respuesta para continuar al siguiente.' Documenta cada paso del diálogo.",
        "Una vez identificada la causa raíz (después de ~5 iteraciones), solicita a Claude: 'Basado en la causa raíz que identificamos, propón 3 acciones correctivas SMART con responsable, fecha límite (dentro de 30 días) y métrica de verificación. Considera que la empresa es una PYME en Ecuador con 25 empleados.'",
        "Solicita a Claude que redacte el reporte completo: 'Redacta el reporte ejecutivo de calidad 5W+1H para este problema. Versión para gerencia: máximo 350 palabras, sin jerga estadística, con énfasis en impacto económico (costo de la devolución, riesgo de pérdida del cliente). Incluye el análisis de los 5 Porqués de forma resumida y las 3 acciones correctivas SMART.'",
        "Edita el reporte generado: ajusta el tono, agrega datos específicos de tu contexto ecuatoriano, verifica que las acciones sean realmente aplicables. El ingeniero siempre revisa y mejora el output de la IA.",
        "Compara el tiempo invertido: ¿cuánto tiempo tomó generar el reporte con Claude vs. cuánto tiempo estimarías que tomaría sin IA? ¿Qué porción del trabajo total hizo la IA y qué porción fue tu criterio profesional?",
      ],
      resultado: "Reporte de calidad ejecutivo completo en formato 5W+1H con 5 Porqués documentados, 3 acciones SMART y reflexión sobre el valor de la IA en la generación de reportes.",
      criterios: [
        { criterio: "Diálogo de 5 Porqués documentado con causa raíz sistémica identificada", puntos: 30 },
        { criterio: "Reporte ejecutivo 5W+1H completo con las 6 secciones requeridas", puntos: 30 },
        { criterio: "3 acciones correctivas SMART con responsable, fecha y métrica de verificación", puntos: 25 },
        { criterio: "Reflexión sobre división del trabajo ingeniero/IA y ajustes realizados al output de Claude", puntos: 15 },
      ],
    },
    recursos: [
      { titulo: "Claude.ai — Asistente para análisis de causa raíz", url: "https://claude.ai/chat", tipo: "herramienta", descripcion: "Interfaz web de Claude para ejecutar los 5 Porqués de forma iterativa y generar reportes de calidad estructurados." },
      { titulo: "ASQ — 5 Whys Template and Guide", url: "https://asq.org/quality-resources/five-whys", tipo: "documentacion", descripcion: "Guía oficial de la American Society for Quality sobre la técnica de los 5 Porqués con plantillas descargables y ejemplos industriales." },
      { titulo: "ARCSA Ecuador — Normativa BPM alimentos", url: "https://www.controlsanitario.gob.ec/buenas-practicas-de-manufactura/", tipo: "documentacion", descripcion: "Sitio oficial de la ARCSA con el Reglamento de Buenas Prácticas de Manufactura vigente en Ecuador para industria alimentaria." },
    ],
  },

  // M7 — Cadena de suministro inteligente
  {
    id: 31,
    titulo: "Pronóstico de demanda con Copilot Excel",
    modulo: MOD7,
    moduloNum: 7,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Pronóstico de demanda con Copilot Excel",
    teoria: `## Pronóstico de demanda: el punto de partida de toda la cadena de suministro

Todo en la cadena de suministro empieza con el pronóstico de demanda. Cuánto producir, cuánto comprar, cuántos trabajadores contratar, cuánto espacio de almacén necesitar: todas estas decisiones dependen de qué tan bien la empresa predice cuánto van a comprar sus clientes.

Un error del 20% en el pronóstico de demanda puede significar, según un lado, 20% de producto no vendido que ocupa almacén y genera costos financieros (exceso de inventario), o 20% de demanda insatisfecha que genera ventas perdidas y clientes frustrados (ruptura de stock). En Ecuador, donde los márgenes en muchos sectores como alimentos, textil y consumo masivo son estrechos, la precisión del pronóstico tiene impacto directo en la rentabilidad.

### Métodos de pronóstico: de simple a avanzado

**Métodos cuantitativos básicos (series de tiempo):**

- **Promedio móvil simple:** Promedia los últimos N períodos. Simple pero lento para detectar cambios de tendencia. Útil para demanda estable sin tendencia ni estacionalidad.

- **Promedio móvil ponderado:** Asigna más peso a los períodos recientes. Más responsive que el simple pero requiere definir los pesos.

- **Suavizamiento exponencial simple (SES):** El método más usado en la práctica por su balance entre simplicidad y efectividad. Una constante α (entre 0 y 1) determina cuánto peso se da a los datos más recientes vs. el historial. α alto (>0.5) = más reactivo, mejor para demanda volátil. α bajo (<0.3) = más suavizado, mejor para demanda estable.

- **Holt-Winters:** Extensión del suavizamiento exponencial que maneja tendencia y estacionalidad simultáneamente. Tres constantes: α (nivel), β (tendencia), γ (estacionalidad). El método de elección para productos con estacionalidad marcada como helados, bebidas gaseosas, útiles escolares.

**Métodos causales:**
La regresión lineal usa variables explicativas (precio, gasto en publicidad, PIB, temperatura, festivos) para predecir la demanda. Más poderoso que las series de tiempo puras pero requiere identificar las variables correctas y recolectar sus datos.

### Copilot en Excel: pronóstico sin programar

Microsoft 365 Copilot en Excel puede construir modelos de pronóstico conversacionalmente. El flujo práctico:

1. **Preparar los datos:** Tabla con columnas Período (fecha o número de mes) y Ventas (unidades o valor). Al menos 24 períodos históricos para capturar dos ciclos de estacionalidad.

2. **Usar la función FORECAST.ETS nativa de Excel:** Esta función de Excel (disponible desde 2016) implementa el algoritmo ETS (Error, Trend, Seasonality) automáticamente:
   
[Código ]
       =FORECAST.ETS(fecha_futura, valores_históricos, fechas_históricas, [estacionalidad], [tipo_datos])
       
       Con el parámetro de estacionalidad=12 para datos mensuales, Excel detecta automáticamente el patrón estacional.
    
    3. **Copilot para interpretar y mejorar:** Con datos en la tabla, pregunta a Copilot: "Analiza las tendencias en mis datos de ventas y crea una proyección para los próximos 6 meses" o "¿Qué factores podrían estar causando los picos en los meses de diciembre y julio?" Copilot genera gráficas y texto explicativo automáticamente.
    
    4. **Hoja de pronóstico inteligente:** Data → Forecast Sheet en Excel crea una hoja completa con pronóstico, intervalos de confianza y gráfica, sin necesidad de Copilot.
    
    ### Métricas de precisión del pronóstico
    
    Un pronóstico sin medición de precisión es incompleto. Las tres métricas más usadas:
    
    **MAE (Mean Absolute Error):**
    MAE = (1/n) × Σ|Demanda_real − Pronóstico|
    Fácil de interpretar: promedio del error absoluto en las mismas unidades que la demanda.
    
    **MAPE (Mean Absolute Percentage Error):**
    MAPE = (1/n) × Σ|(Demanda_real − Pronóstico) / Demanda_real| × 100%
    Permite comparar precisión entre productos con diferentes escalas de demanda. Un MAPE de 10% significa que el pronóstico se equivoca en promedio un 10%. En industria de consumo masivo, MAPE < 15% se considera aceptable.
    
    **RMSE (Root Mean Square Error):**
    RMSE = √[(1/n) × Σ(Demanda_real − Pronóstico)²]
    Penaliza más los errores grandes. Útil cuando el costo de errores grandes es desproporcionadamente alto.
    
    ### ChatGPT para interpretar el pronóstico
    
    Una vez que Excel genera el pronóstico, ChatGPT ayuda a contextualizar los resultados:
    
    *"Mi producto tiene ventas históricas de los últimos 24 meses con un MAPE del 18% usando promedio móvil de 3 meses. El pronóstico para los próximos 3 meses es [valores]. Soy una empresa de alimentos en Ecuador y el período proyectado incluye las fiestas de agosto en Quito y el regreso a clases. ¿Qué ajustes al pronóstico recomendarías basándote en estos factores de mercado local? ¿Qué método de pronóstico podría reducir el MAPE por debajo de 15%?"*`,
        presentacionSlides: [
          { titulo: "El pronóstico de demanda: base de toda la cadena", contenido: "Cuánto producir, comprar, almacenar y contratar: todo depende del pronóstico. Error 20%: exceso de inventario (capital inmovilizado) o ruptura de stock (ventas perdidas). En Ecuador: márgenes estrechos = impacto directo en rentabilidad." },
          { titulo: "4 métodos cuantitativos: de simple a avanzado", contenido: "Promedio móvil simple: estable, sin tendencia. Promedio móvil ponderado: más reactivo. Suavizamiento exponencial (SES): balance simplicidad/precisión, α controla reactividad. Holt-Winters: tendencia + estacionalidad simultánea." },
          { titulo: "FORECAST.ETS en Excel: pronóstico con un solo clic", contenido: "Función nativa Excel 2016+. Algoritmo ETS detecta automáticamente tendencia y estacionalidad. Parámetro estacionalidad=12 para datos mensuales. Data → Forecast Sheet: hoja completa con intervalos de confianza en segundos." },
          { titulo: "Copilot Excel: pronóstico conversacional", contenido: "Con datos en tabla: 'Analiza tendencias y proyecta 6 meses.' 'Explica los picos de diciembre.' 'Compara suavizamiento exponencial vs promedio móvil para estos datos.' Copilot genera gráficas + texto interpretativo automáticamente." },
          { titulo: "MAPE: la métrica de precisión más usada", contenido: "MAPE = promedio de |error / real| × 100%. Permite comparar productos de diferente escala. MAPE <10%: excelente. 10-15%: aceptable en consumo masivo. 15-25%: mejorable. >25%: modelo incorrecto o datos insuficientes." },
          { titulo: "α en suavizamiento exponencial: cómo elegirlo", contenido: "α alto (>0.5): pronóstico más reactivo a cambios recientes. Mejor para demanda volátil o con tendencia cambiante. α bajo (<0.3): más suavizado. Mejor para demanda estable. Excel Solver puede optimizar α para minimizar MAPE con datos históricos." },
          { titulo: "Prompt para ajuste de pronóstico con ChatGPT", contenido: "Incluir: método actual + MAPE + valores proyectados + factores locales Ecuador (fiestas locales, temporadas, eventos). ChatGPT propone ajustes cuantitativos y recomienda método alternativo si MAPE es alto." },
          { titulo: "Estacionalidad en Ecuador: factores clave", contenido: "Regreso a clases (febrero + septiembre). Fiestas de Quito (diciembre). Carnaval (febrero/marzo). Exportaciones floricultura (San Valentín, Día de la Madre). Bananeras: ciclicidad de precios internacionales. Cada sector tiene su patrón." },
        ],
        quiz: [
          { pregunta: "¿Qué impacto tiene un error del 20% en el pronóstico de demanda en una empresa de alimentos en Ecuador?", opciones: ["Ninguno, el mercado ecuatoriano es muy estable", "Exceso de inventario (capital inmovilizado y producto perecible) o ruptura de stock (ventas perdidas y clientes frustrados)", "Solo impacta el área de marketing, no la cadena de suministro", "Solo es relevante para empresas exportadoras"], respuesta: 1, explicacion: "Un error de 20% en pronóstico genera problemas en ambos lados: sobreestimación produce exceso de inventario con costos financieros y riesgo de vencimiento en productos perecibles; subestimación genera ruptura de stock, ventas perdidas y posible pérdida de clientes a la competencia." },
          { pregunta: "¿Para qué tipo de producto es más adecuado el método Holt-Winters?", opciones: ["Productos con demanda perfectamente constante mes a mes", "Productos con tendencia y estacionalidad marcada, como helados, bebidas gaseosas o útiles escolares", "Productos nuevos sin historial de ventas", "Materias primas industriales con demanda derivada"], respuesta: 1, explicacion: "Holt-Winters es el método de elección cuando la serie de tiempo tiene simultáneamente tendencia (crecimiento o decrecimiento sostenido) y estacionalidad (patrón que se repite periódicamente). Maneja tres constantes: α para el nivel, β para la tendencia y γ para la estacionalidad." },
          { pregunta: "¿Qué MAPE indica una precisión aceptable para un producto de consumo masivo en Ecuador?", opciones: ["Menos del 1%", "Menos del 15%", "Menos del 30%", "Menos del 50%"], respuesta: 1, explicacion: "Un MAPE inferior al 15% se considera aceptable para productos de consumo masivo, donde la demanda tiene inherente variabilidad. Para productos especiales de alta rotación o en industrias con cadenas de suministro largas, se busca MAPE < 10%." },
          { pregunta: "¿Qué hace la función FORECAST.ETS de Excel?", opciones: ["Solo calcula promedios móviles simples", "Implementa automáticamente el algoritmo ETS que detecta tendencia y estacionalidad en los datos históricos para generar pronósticos con intervalos de confianza", "Conecta Excel con datos de ventas de Salesforce en tiempo real", "Genera gráficas de dispersión de los datos históricos"], respuesta: 1, explicacion: "FORECAST.ETS implementa el algoritmo Error-Trend-Seasonality (ETS) de forma automática. Detecta los componentes de tendencia y estacionalidad en los datos históricos y genera pronósticos con intervalos de confianza superior e inferior, sin que el usuario necesite conocer la estadística." },
          { pregunta: "Un analista tiene α=0.8 en su modelo de suavizamiento exponencial. ¿Qué significa esto y en qué tipo de demanda es apropiado?", opciones: ["El modelo promedia los últimos 8 meses de datos", "El modelo da 80% de peso al período más reciente y 20% al historial acumulado; es apropiado para demanda volátil o con cambios rápidos de tendencia", "El modelo tiene un error del 80% en sus pronósticos", "El modelo solo funciona con datos de los últimos 8 semanas"], respuesta: 1, explicacion: "En suavizamiento exponencial, α determina el peso relativo del dato más reciente. Con α=0.8, el 80% del pronóstico se basa en la última observación y solo el 20% en el historial acumulado. Esto hace el modelo muy reactivo, apropiado cuando la demanda cambia rápidamente o hay cambios de tendencia frecuentes." },
        ],
        ejercicio: {
          titulo: "Modelo de pronóstico de demanda con FORECAST.ETS y Copilot Excel",
          objetivo: "Construir un modelo de pronóstico en Excel para un producto con estacionalidad, calcular el MAPE y usar Copilot para interpretar los resultados y mejorar el pronóstico.",
          herramientas: "Excel con Microsoft 365 (o Excel 2019+), Copilot Excel (si disponible), ChatGPT como alternativa",
          pasos: [
            "Crea una tabla en Excel con 36 meses de datos históricos de ventas (enero 2022 a diciembre 2024) para un producto con estacionalidad marcada. Usa este patrón para simularlo: demanda base de 1,000 unidades, más una tendencia creciente de 5 unidades/mes, más estacionalidad multiplicativa (diciembre ×1.8, noviembre ×1.4, julio ×1.3, febrero ×0.7, enero ×0.8, resto ×1.0), más ruido aleatorio ±5%.",
            "Usa FORECAST.ETS para pronosticar los próximos 6 meses (enero-junio 2025). En una celda de fecha futura: =FORECAST.ETS(F37, $B$2:$B$37, $A$2:$A$37, 12, 1). Repite para los 6 meses futuros. También usa Data → Forecast Sheet para obtener la hoja completa con intervalos de confianza.",
            "Valida el modelo usando los últimos 12 meses como holdout: aplica FORECAST.ETS usando solo los primeros 24 meses de datos para pronosticar meses 25-36. Compara los pronósticos con los valores reales para esos 12 meses. Calcula MAE y MAPE para evaluar la precisión.",
            "Si tienes Copilot Excel activo: selecciona la tabla y pregunta 'Analiza la estacionalidad de estos datos y dime cuáles son los meses de mayor y menor demanda. ¿El modelo FORECAST.ETS captura bien la estacionalidad?' Si no tienes Copilot, usa ChatGPT: pega los datos del MAPE calculado y pide interpretación.",
            "Optimiza el coeficiente α para SES usando Excel Solver: minimiza el MAPE usando Solver con α como variable de decisión (restricción: 0 < α < 1). Compara el MAPE del SES optimizado vs. FORECAST.ETS automático.",
            "Escribe un resumen de 150 palabras: ¿qué método fue más preciso para este tipo de demanda? ¿Cómo usarías este pronóstico para tomar decisiones de compra de materias primas con 8 semanas de lead time?",
          ],
          resultado: "Modelo de pronóstico en Excel con FORECAST.ETS, validación con holdout, MAPE calculado, optimización de α con Solver e interpretación con Copilot/ChatGPT.",
          criterios: [
            { criterio: "Dataset de 36 meses correctamente construido con tendencia y estacionalidad", puntos: 20 },
            { criterio: "FORECAST.ETS aplicado correctamente para 6 meses futuros con hoja de pronóstico completa", puntos: 25 },
            { criterio: "Validación holdout con MAE y MAPE calculados correctamente", puntos: 30 },
            { criterio: "Interpretación con Copilot/ChatGPT documentada + reflexión sobre uso en decisiones de compra", puntos: 25 },
          ],
        },
        recursos: [
          { titulo: "Microsoft — FORECAST.ETS function reference", url: "https://support.microsoft.com/es-es/office/función-pronostico-ets-15389b8b-677e-4fbd-bd95-21d464333f41", tipo: "documentacion", descripcion: "Documentación oficial de Microsoft en español para la función FORECAST.ETS con ejemplos y parámetros detallados." },
          { titulo: "Copilot in Excel — Getting started", url: "https://support.microsoft.com/es-es/topic/copilot-en-excel-principios-básicos-d7110502-0334-4b4f-a175-a73abdfc118a", tipo: "herramienta", descripcion: "Guía oficial de Microsoft para usar Copilot en Excel para análisis de datos y creación de pronósticos conversacionales." },
          { titulo: "Forecasting Principles and Practice — Textbook online gratuito", url: "https://otexts.com/fpp3/", tipo: "lectura", descripcion: "Libro de texto gratuito en inglés sobre métodos de pronóstico (Holt-Winters, ARIMA, ML) con ejemplos en R. Referencia académica estándar." },
        ],
      },
    
      {
        id: 32,
        titulo: "Variables externas que afectan la demanda",
        modulo: MOD7,
        moduloNum: 7,
        videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
        videoTitulo: "Variables externas que afectan la demanda",
        teoria: `## Más allá del historial: las variables externas que cambian la demanda
    
    Los métodos de series de tiempo como el suavizamiento exponencial o FORECAST.ETS asumen que el futuro es similar al pasado. Esta suposición falla cuando ocurren eventos externos que cambian estructuralmente el comportamiento de la demanda: un cambio en el precio de la competencia, una campaña publicitaria masiva, una crisis económica, una variación climática extrema o un cambio en la política arancelaria ecuatoriana.
    
    Incorporar estas variables externas al modelo de pronóstico — pasando de un enfoque univariado (solo historial de ventas) a uno multivariado (ventas + variables explicativas) — puede reducir el MAPE en 20-40% en muchos contextos industriales.
    
    ### Tipos de variables externas más relevantes para Ecuador
    
    **Variables macroeconómicas:**
    - **Inflación mensual (BCE):** Afecta el poder adquisitivo del consumidor y el costo de materias primas. En Ecuador, la inflación tiene correlación documentada con la demanda de productos de primera necesidad.
    - **Tasa de desempleo (INEC):** Indicador rezagado pero potente para bienes durables y de consumo discrecional. La tasa de desempleo en Ecuador fue ~4.5% en 2024 con variación regional significativa.
    - **PIB per cápita y consumo privado (BCE):** Indicadores de capacidad de gasto de los hogares. Alta correlación con demanda de bienes de consumo no básico.
    - **Tipo de cambio implícito:** Aunque Ecuador usa el dólar, las variaciones del peso colombiano y el sol peruano afectan el comercio fronterizo y la competencia de productos importados.
    
    **Variables sectoriales:**
    - **Precio del petróleo WTI:** Afecta directamente el costo de plásticos, fertilizantes y transporte en Ecuador.
    - **Precio del banano y las flores FOB:** Para empresas de exportación e insumos para esos sectores.
    - **Índice de precios al productor (IPP) del BCE:** Variación de precios de materias primas industriales.
    
    **Variables climáticas:**
    - **Precipitación mensual (INAMHI):** Crítica para agricultura, agroind industria, bebidas y turismo. El fenómeno El Niño en Ecuador tiene efectos dramáticos en la producción agrícola con rezago de 3-6 meses.
    - **Temperatura media en las ciudades principales:** Correlaciona con consumo de helados, bebidas frías, ropa de abrigo.
    
    **Variables de mercado:**
    - **Precio de la competencia:** La elasticidad precio-demanda permite cuantificar cómo un cambio del 10% en el precio del competidor afecta las ventas propias.
    - **Inversión publicitaria propia y de la competencia:** Con un rezago de 2-4 semanas típicamente.
    - **Días de festividades y eventos:** Fiestas de Quito (6 de diciembre), Carnaval, Semana Santa, regreso a clases (septiembre, febrero), Navidad.
    
    ### Regresión lineal múltiple: incorporar las variables externas
    
    La regresión lineal múltiple es el método estadístico para modelar la relación entre la demanda y múltiples variables explicativas simultáneamente:
    
    **Demanda = β₀ + β₁×PIB + β₂×Precio_propio + β₃×Publicidad + β₄×Meses_desde_enero + β₅×Es_diciembre + ε**
    
    Donde:
    - β₀ es la demanda base (intercepto)
    - Cada βᵢ es el coeficiente que indica cuánto cambia la demanda por cada unidad de cambio en la variable correspondiente
    - Es_diciembre es una variable dummy (0/1) que captura el efecto estacional de ese mes
    
    **En Excel:**
    Datos → Análisis de Datos → Regresión (requiere activar el complemento Analysis ToolPak). Seleccionar rango Y (ventas), rango X (variables explicativas), y Excel genera automáticamente coeficientes, R², valor-p para cada variable y residuales.
    
    ### ChatGPT para identificar variables y construir el modelo
    
    ChatGPT puede ayudar a identificar qué variables externas son más relevantes para tu negocio específico y cómo estructurar el modelo:
    
    *"Soy gerente de producción de una empresa de helados en Guayaquil, Ecuador. Quiero mejorar mi pronóstico de demanda incorporando variables externas. Actualmente uso solo el historial de ventas de 24 meses con MAPE del 22%. ¿Qué variables externas específicas para Ecuador recomendarías incluir en un modelo de regresión? ¿Dónde consigo los datos de esas variables gratuitamente? ¿Cómo construiría el modelo en Excel?"*
    
    ### Fuentes de datos de variables externas en Ecuador
    
    | Variable | Fuente | Frecuencia | URL |
    |----------|--------|------------|-----|
    | Inflación | BCE | Mensual | estadisticas.bce.fin.ec |
    | Desempleo | INEC | Trimestral | ecuadorencifras.gob.ec |
    | PIB y consumo | BCE | Trimestral | contenido.bce.fin.ec |
    | Precipitación | INAMHI | Mensual | inamhi.gob.ec |
    | Precio petróleo | EIA USA | Diario | eia.gov/dnav/pet |
    | Festivos Ecuador | Gobierno | Anual | gob.ec/feriados |
    
    ### Validación del modelo multivariado
    
    Un modelo más complejo no siempre es mejor. Para validar si las variables externas mejoran realmente el pronóstico:
    
    1. **R² ajustado:** El R² normal siempre aumenta cuando se agregan variables. El R² ajustado penaliza por el número de variables. Si R² ajustado no mejora al agregar una variable, esa variable no aporta.
    2. **Valor-p de cada coeficiente:** Si p > 0.05, la variable no es estadísticamente significativa y probablemente no aporta al modelo.
    3. **Comparar MAPE en holdout:** El MAPE en datos no usados para entrenar el modelo es el verdadero indicador de si el modelo multivariado es mejor que el univariado.`,
        presentacionSlides: [
          { titulo: "Series de tiempo vs. modelos causales", contenido: "Series de tiempo: el futuro se parece al pasado. Modelos causales: incorporan variables que CAMBIAN el futuro. Reducción de MAPE potencial: 20-40%. Necesario cuando hay eventos externos relevantes para el sector." },
          { titulo: "Variables macroeconómicas de Ecuador para pronóstico", contenido: "Inflación BCE (poder adquisitivo). Desempleo INEC (bienes durables). PIB/consumo privado BCE (bienes no básicos). Tipo de cambio implícito (comercio fronterizo). Todas disponibles gratuitamente en portales del gobierno." },
          { titulo: "Variables climáticas: críticas para agroindustria", contenido: "Precipitación mensual INAMHI: agricultura, bebidas, turismo. Fenómeno El Niño: efecto dramático con rezago 3-6 meses en producción agrícola. Temperatura: helados, bebidas frías, ropa. INAMHI.gob.ec: datos históricos gratuitos." },
          { titulo: "Regresión lineal múltiple en Excel", contenido: "Activar Analysis ToolPak. Datos → Análisis de Datos → Regresión. Y: ventas históricas. X: variables explicativas. Output: coeficientes β, R², valor-p, residuales. Todo en segundos sin programar." },
          { titulo: "Cómo interpretar el R² ajustado", contenido: "R² normal SIEMPRE sube al agregar variables. R² ajustado penaliza por variables extras. Si R² ajustado no mejora → la variable no aporta. Buscar R² ajustado >0.70 para modelo aceptable en pronóstico de demanda." },
          { titulo: "Variables dummy para estacionalidad y eventos", contenido: "Diciembre=1 resto=0 captura el efecto navidad. Feria_Quito=1 captura el mes de fiestas. Regreso_clases=1 para septiembre y febrero. Cada dummy agrega un coeficiente que mide el impacto exacto del evento en unidades vendidas." },
          { titulo: "Fuentes de datos externos: todo gratis en Ecuador", contenido: "BCE (estadisticas.bce.fin.ec): inflación, PIB, consumo. INEC (ecuadorencifras.gob.ec): desempleo, censos. INAMHI (inamhi.gob.ec): clima, precipitación. EIA (eia.gov): precio petróleo. Gobierno (gob.ec): calendario festivos." },
          { titulo: "Prompt para identificar variables con ChatGPT", contenido: "Sector + ciudad + productos + MAPE actual. ChatGPT recomienda: qué variables externas incluir, dónde conseguir los datos en Ecuador, cómo estructurar el modelo en Excel, qué rezagos temporales considerar (efecto del clima sobre ventas puede tardar 2-3 meses)." },
        ],
        quiz: [
          { pregunta: "¿Por qué los modelos de series de tiempo pueden fallar en Ecuador durante un año de fenómeno El Niño?", opciones: ["Porque Excel no puede procesar datos climáticos", "Porque El Niño genera cambios estructurales en la demanda agrícola e industrial que no se reflejan en el historial normal de ventas", "Porque la inflación de Ecuador siempre sube durante El Niño", "Porque los datos del INEC no están disponibles durante esos períodos"], respuesta: 1, explicacion: "Los modelos de series de tiempo asumen que el futuro es similar al pasado. El fenómeno El Niño genera cambios drásticos en la producción agrícola, los precios de materias primas y el poder adquisitivo que no están en el historial normal de ventas, haciendo que el modelo univariado falle significativamente." },
          { pregunta: "¿Para qué sirve una variable dummy en un modelo de regresión para pronóstico de demanda?", opciones: ["Para reemplazar los valores faltantes en el dataset", "Para capturar el efecto de eventos discretos (festivos, estaciones, campañas) mediante variables binarias (0/1)", "Para suavizar la serie de tiempo automáticamente", "Para conectar Excel con datos externos de internet"], respuesta: 1, explicacion: "Las variables dummy son variables binarias (0=no ocurre, 1=ocurre) que permiten incluir efectos de eventos discretos en el modelo de regresión. Por ejemplo, 'Es_diciembre' captura el efecto navideño: el coeficiente β de esa dummy representa exactamente cuántas unidades adicionales se venden en diciembre vs. un mes sin ese evento." },
          { pregunta: "¿Por qué es preferible usar el R² ajustado en lugar del R² simple al evaluar un modelo de regresión con múltiples variables?", opciones: ["Porque el R² ajustado siempre da valores más altos", "Porque el R² simple siempre aumenta al agregar más variables aunque no sean relevantes; el R² ajustado penaliza por el número de variables y solo mejora si la variable realmente aporta", "Porque Excel solo calcula R² ajustado, no R² simple", "Porque el R² simple es solo para modelos de series de tiempo"], respuesta: 1, explicacion: "El R² simple matemáticamente solo puede aumentar (nunca bajar) cuando se agrega una variable, incluso si es ruido aleatorio. El R² ajustado incorpora una penalización por el número de variables, solo mejorando cuando la variable añadida genera una mejora real en el poder explicativo del modelo." },
          { pregunta: "Una empresa de distribución de bebidas en Guayaquil quiere mejorar su pronóstico incorporando variables externas. ¿Cuál de las siguientes variables externas tiene mayor probabilidad de ser relevante para su demanda?", opciones: ["El precio del petróleo WTI en Chicago", "La temperatura media mensual en Guayaquil y el calendario de festivos y eventos deportivos nacionales", "El PIB de Colombia", "La tasa de inflación de Argentina"], respuesta: 1, explicacion: "Para una empresa de bebidas en Guayaquil, las variables más directamente relevantes son la temperatura (a mayor temperatura, mayor consumo de bebidas frías) y el calendario de eventos (partidos de fútbol, fiestas locales, festivos) que generan picos de consumo. El precio del petróleo de Chicago tiene efecto muy indirecto comparado con estas variables." },
          { pregunta: "¿Cómo se obtienen gratuitamente los datos de inflación mensual de Ecuador para incluirlos en un modelo de pronóstico?", opciones: ["No hay datos de inflación disponibles públicamente en Ecuador", "Del portal del Banco Central del Ecuador (estadisticas.bce.fin.ec) que publica series históricas mensuales de inflación y otros indicadores macroeconómicos", "Solo en el INEC, por solicitud formal con costo de $50", "En la Cámara de Comercio de Quito, con actualización anual"], respuesta: 1, explicacion: "El Banco Central del Ecuador publica en su portal estadisticas.bce.fin.ec series históricas de inflación mensual, tipo de cambio implícito, PIB, consumo privado y otros indicadores macroeconómicos de forma gratuita y descargable en Excel." },
        ],
        ejercicio: {
          titulo: "Modelo de regresión con variables externas para pronóstico de demanda",
          objetivo: "Construir un modelo de regresión lineal múltiple en Excel que incorpore al menos 3 variables externas relevantes para Ecuador y comparar su MAPE con el modelo univariado de series de tiempo.",
          herramientas: "Excel con Analysis ToolPak activado, ChatGPT o Claude",
          pasos: [
            "Selecciona un producto o sector para modelar. Opción recomendada: ventas mensuales de helados en una ciudad de la costa ecuatoriana (Guayaquil o Manta), donde temperatura y estacionalidad son muy relevantes.",
            "Construye el dataset de 36 meses con las siguientes columnas: Mes (1-36), Ventas (variable Y), Temperatura_media (26-31°C con variación estacional), Ingreso_percapita_relativo (índice 100=promedio, con ciclo económico), Variable_dummy_verano (1 en meses junio-agosto), Variable_dummy_navidad (1 en diciembre).",
            "Activa el Analysis ToolPak en Excel: Archivo → Opciones → Complementos → Ir → Analysis ToolPak. Luego: Datos → Análisis de Datos → Regresión. Y: columna Ventas. X: las 4 variables explicativas. Ejecuta y analiza el output: R² ajustado, coeficientes β y valores-p.",
            "Identifica cuáles variables son estadísticamente significativas (valor-p < 0.05). Elimina las no significativas y recorre el modelo. Compara el R² ajustado del modelo completo vs. el modelo reducido.",
            "Calcula el MAPE del modelo de regresión usando los últimos 12 meses como holdout (igual que hiciste con FORECAST.ETS en el tema anterior). Compara los dos MAPE: ¿el modelo multivariado mejora la precisión?",
            "Usa ChatGPT con el prompt: 'Tengo un modelo de regresión para ventas de helados en Guayaquil. R² ajustado=0.78. Variables significativas: temperatura (β=+45, p=0.002), dummy_navidad (β=+380, p=0.001). Variables no significativas: ingreso (p=0.34), dummy_verano (p=0.28). ¿Cómo interpreto estos coeficientes en lenguaje de negocio? ¿Qué variables adicionales debería probar para mejorar el R² ajustado?'",
          ],
          resultado: "Modelo de regresión en Excel con al menos 3 variables externas, output de regresión completo, comparación de MAPE vs. modelo univariado e interpretación de coeficientes con ChatGPT.",
          criterios: [
            { criterio: "Dataset de 36 meses con 4 variables explicativas correctamente construido", puntos: 20 },
            { criterio: "Regresión ejecutada correctamente con Analysis ToolPak, output completo analizado", puntos: 30 },
            { criterio: "Interpretación de R² ajustado, coeficientes significativos y valores-p", puntos: 25 },
            { criterio: "Comparación de MAPE con modelo univariado y conclusión sobre qué modelo usar", puntos: 25 },
          ],
        },
        recursos: [
          { titulo: "BCE Ecuador — Portal de estadísticas macroeconómicas", url: "https://estadisticas.bce.fin.ec/", tipo: "herramienta", descripcion: "Portal oficial del Banco Central del Ecuador con series históricas descargables de inflación, PIB, consumo, tipo de cambio y más." },
          { titulo: "INAMHI Ecuador — Datos climáticos históricos", url: "https://www.inamhi.gob.ec/", tipo: "herramienta", descripcion: "Instituto Nacional de Meteorología e Hidrología del Ecuador. Series históricas de temperatura, precipitación y eventos climáticos por estación." },
          { titulo: "Excel Analysis ToolPak — Guía de regresión", url: "https://support.microsoft.com/es-es/office/usar-las-herramientas-para-análisis-para-realizar-análisis-de-datos-complejos-6c67ccf0-f4a9-487c-8dec-bdb5a2cefab6", tipo: "documentacion", descripcion: "Guía oficial de Microsoft para usar el Analysis ToolPak de Excel, incluyendo el módulo de regresión lineal múltiple." },
        ],
      },
    
      {
        id: 33,
        titulo: "Clasificación ABC/XYZ de inventario con IA",
        modulo: MOD7,
        moduloNum: 7,
        videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
        videoTitulo: "Clasificación ABC/XYZ de inventario con IA",
        teoria: `## ABC/XYZ: la clasificación que prioriza tu gestión de inventario
    
    Gestionar todos los ítems del inventario con el mismo nivel de atención es un desperdicio de recursos. La clasificación **ABC/XYZ** combina dos dimensiones de análisis para identificar qué productos merecen gestión intensiva, cuáles pueden manejarse con políticas estándar y cuáles son candidatos para simplificación o eliminación.
    
    ### Clasificación ABC: el eje del valor
    
    La clasificación ABC aplica el principio de Pareto al inventario, analizando la contribución de cada ítem al valor total del inventario o las ventas:
    
    **Clase A:** Los ítems que representan el 70-80% del valor total pero solo el 10-20% del número de ítems. Son los productos más críticos para el negocio. Requieren gestión intensiva: control de stock en tiempo real, revisión frecuente del punto de reorden, relaciones cercanas con proveedores.
    
    **Clase B:** 15-25% del valor total y 30% de los ítems. Gestión estándar: revisiones periódicas, políticas de reorden automático razonables.
    
    **Clase C:** Solo 5-10% del valor total pero el 50-70% del número de ítems. Son los muchos productos de bajo valor. Política simplificada: revisiones menos frecuentes, lotes de reorden más grandes, posible eliminación de ítems de muy bajo movimiento.
    
    **Cálculo de la clasificación ABC en Excel:**
    
    1. Calcular para cada ítem: Valor anual consumido = Cantidad consumida/año × Precio unitario
    2. Ordenar de mayor a menor valor anual
    3. Calcular % individual y % acumulado del valor total
    4. Asignar clase: A si % acumulado ≤ 80%, B si ≤ 95%, C si > 95%
    
    ### Clasificación XYZ: el eje de la variabilidad de la demanda
    
    La clasificación XYZ mide qué tan predecible es la demanda de cada ítem usando el **coeficiente de variación (CV)**:
    
    **CV = Desviación estándar de la demanda mensual / Media de la demanda mensual**
    
    **Clase X:** CV < 0.2. Demanda muy estable y predecible. El pronóstico es altamente confiable. Política: JIT (Just In Time), stocks mínimos, reposición automática.
    
    **Clase Y:** 0.2 ≤ CV < 0.5. Demanda con variabilidad moderada pero tendencia identificable. Política: suavizamiento exponencial, stock de seguridad moderado.
    
    **Clase Z:** CV ≥ 0.5. Demanda altamente irregular e impredecible. El pronóstico tiene alta incertidumbre. Política: stock de seguridad alto, o gestión bajo demanda (no mantener inventario permanente).
    
    ### La matriz ABC/XYZ: 9 celdas, 9 políticas
    
    La combinación de ambas clasificaciones crea una matriz 3×3:
    
    | | X (estable) | Y (moderada) | Z (irregular) |
    |--|-------------|--------------|---------------|
    | **A (alto valor)** | AX: control máximo + JIT | AY: SES + stock seguridad moderado | AZ: revisión diaria + colaboración proveedor |
    | **B (valor medio)** | BX: reorden automático | BY: revisión semanal | BZ: revisar si justifica mantener |
    | **C (bajo valor)** | CX: lote grande, revisión mensual | CY: revisión trimestral | CZ: candidato a eliminar |
    
    Los ítems **AZ** (alto valor + demanda impredecible) son los más peligrosos del inventario: costosos de mantener en exceso y críticos si faltan. Merecen atención especial y colaboración directa con el proveedor.
    
    ### ChatGPT para construir y analizar la clasificación ABC/XYZ
    
    **Para construir la clasificación:**
    *"Tengo un dataset de 120 SKUs con consumo mensual de los últimos 12 meses en unidades y costo unitario de cada uno. ¿Puedo pegarte la tabla y que me ayudes a calcular la clasificación ABC/XYZ completa, identificar los ítems AZ que requieren atención urgente y proponer políticas de gestión para cada categoría?"*
    
    **Para política de inventario:**
    *"Mis ítems AX son: [lista de productos]. Son materia prima para una empresa de alimentos en Quito, con proveedor principal en Colombia. ¿Qué política de inventario recomiendas para maximizar disponibilidad minimizando el capital inmovilizado? Considera un lead time de 15 días y una demanda mensual promedio de [X] unidades."*
    
    ### Implementación en Python para grandes datasets
    
    Para empresas con catálogos de cientos o miles de SKUs, Python automatiza la clasificación completa:
    
[/Código]python
import pandas as pd
import numpy as np

def clasificar_abc_xyz(df):
    # ABC: por valor anual
    df['valor_anual'] = df['demanda_anual'] * df['costo_unitario']
    df = df.sort_values('valor_anual', ascending=False)
    df['pct_acumulado'] = df['valor_anual'].cumsum() / df['valor_anual'].sum() * 100
    df['clase_abc'] = pd.cut(df['pct_acumulado'], bins=[0, 80, 95, 100],
                              labels=['A', 'B', 'C'])
    # XYZ: por coeficiente de variación
    meses_cols = [c for c in df.columns if c.startswith('mes_')]
    df['cv'] = df[meses_cols].std(axis=1) / df[meses_cols].mean(axis=1)
    df['clase_xyz'] = pd.cut(df['cv'], bins=[0, 0.2, 0.5, np.inf],
                              labels=['X', 'Y', 'Z'])
    df['clasificacion'] = df['clase_abc'].astype(str) + df['clase_xyz'].astype(str)
    return df
`,
    presentacionSlides: [
      { titulo: "ABC: clasificar por valor de consumo", contenido: "A: 70-80% del valor, 10-20% de ítems → gestión intensiva. B: 15-25% del valor → gestión estándar. C: 5-10% del valor, 50-70% de ítems → simplificada. Pareto aplicado al inventario: no gestionar todo igual." },
      { titulo: "XYZ: clasificar por variabilidad de la demanda", contenido: "X (CV<0.2): demanda estable → JIT, stock mínimo. Y (CV 0.2-0.5): variabilidad moderada → SES + stock seguridad. Z (CV>0.5): demanda irregular → stock alto o gestión bajo demanda. CV = σ / μ de la demanda mensual." },
      { titulo: "La matriz ABC/XYZ: 9 políticas de gestión", contenido: "AX: control máximo + JIT. AY: SES + stock moderado. AZ: ¡CRÍTICO! revisión diaria + colaboración proveedor. BX: reorden automático. CZ: candidato a eliminar. Una política diferente para cada cuadrante." },
      { titulo: "Por qué los ítems AZ son los más peligrosos", contenido: "Alto valor (costoso tener en exceso) + demanda impredecible (difícil de pronosticar) = combinación explosiva. Una rotura de stock de un ítem AZ detiene la producción. Un exceso inmoviliza capital crítico. Necesitan gestión especial: VMI, Kanban con proveedor." },
      { titulo: "Cálculo ABC/XYZ en Excel: paso a paso", contenido: "ABC: valor_anual = demanda_anual × costo_unitario. Ordenar descendente. % acumulado. Cortes en 80% y 95%. XYZ: CV = DESVEST.M / PROMEDIO de los 12 meses de demanda. Clasificar por umbrales 0.2 y 0.5. Concatenar: 'A' & 'X' = 'AX'." },
      { titulo: "Automatización en Python para 1,000+ SKUs", contenido: "pd.cut para clasificación ABC/XYZ automática. .std(axis=1) y .mean(axis=1) para CV por filas (un cálculo por SKU). Output: DataFrame con clasificación completa lista para filtrar y analizar. ChatGPT escribe el código en segundos." },
      { titulo: "Prompt para política de inventario con ChatGPT", contenido: "Ítem + clasificación ABC/XYZ + lead time proveedor + demanda promedio + CV + costo de rotura de stock. ChatGPT recomienda: stock de seguridad en unidades, punto de reorden exacto, frecuencia de revisión, política de colaboración con proveedor." },
      { titulo: "ABC/XYZ en Ecuador: aplicación por sector", contenido: "Alimentos: AZ frecuente en insumos importados con alta variabilidad de precio. Floricultura: AX en fungicidas críticos para temporada. Manufactura: CZ son candidatos a estandarización o eliminación del catálogo." },
    ],
    quiz: [
      { pregunta: "¿Qué criterio determina si un ítem es clase A, B o C en la clasificación ABC?", opciones: ["El peso físico del producto en kilogramos", "El valor monetario del consumo anual (cantidad consumida × precio unitario), ordenado y acumulado", "El número de unidades físicas en almacén en este momento", "La frecuencia con que se hace un pedido al proveedor"], respuesta: 1, explicacion: "La clasificación ABC ordena los ítems por valor de consumo anual (demanda × costo unitario) de mayor a menor, luego asigna A al conjunto de ítems que acumula hasta el 80% del valor total, B hasta el 95%, y C al resto." },
      { pregunta: "¿Cómo se calcula el Coeficiente de Variación (CV) para la clasificación XYZ?", opciones: ["CV = Demanda máxima / Demanda mínima del año", "CV = Desviación estándar de la demanda mensual / Media de la demanda mensual", "CV = Cantidad en almacén / Cantidad pedida", "CV = Costo unitario / Precio de venta"], respuesta: 1, explicacion: "CV = σ/μ donde σ es la desviación estándar de la demanda mensual y μ es la media mensual. Un CV alto significa que la demanda varía mucho en relación a su promedio (alta incertidumbre). Un CV bajo indica demanda estable y predecible." },
      { pregunta: "¿Por qué los ítems clasificados como AZ merecen atención especial?", opciones: ["Porque son los más baratos y más fáciles de conseguir", "Porque combinan alto valor monetario (críticos para el negocio) con demanda altamente impredecible (difícil gestionar el stock)", "Porque son los más vendidos en volumen de unidades", "Porque AZ significa que son ítems nuevos sin historial de demanda"], respuesta: 1, explicacion: "AZ es la combinación más crítica: alto valor (un exceso inmoviliza capital importante) + alta variabilidad (el pronóstico es poco confiable). Una rotura de stock en un ítem AZ puede detener la producción o generar pérdidas significativas, mientras un exceso representa capital inmovilizado costoso." },
      { pregunta: "¿Cuál es la política de inventario recomendada para ítems CZ?", opciones: ["Control máximo con revisión diaria y colaboración estrecha con el proveedor", "Son candidatos a eliminación del catálogo o gestión bajo demanda; no justifican mantener inventario permanente", "JIT (Just In Time) con reposición automática muy frecuente", "Stock de seguridad alto para compensar la alta variabilidad"], respuesta: 1, explicacion: "CZ son ítems de bajo valor monetario (C) con demanda muy irregular (Z). La combinación no justifica mantener inventario permanente: el capital inmovilizado es pequeño pero el costo de gestión puede ser desproporcionado. Se recomienda gestión bajo pedido o eliminación del catálogo si el volumen no lo justifica." },
      { pregunta: "Un producto tiene demanda mensual de: [80, 85, 82, 78, 200, 79, 83, 81, 190, 80, 84, 82] unidades. ¿Qué clasificación XYZ recibiría aproximadamente?", opciones: ["X (CV<0.2) — demanda muy estable", "Y (0.2≤CV<0.5) — variabilidad moderada", "Z (CV≥0.5) — demanda altamente irregular", "No se puede clasificar sin el costo unitario"], respuesta: 2, explicacion: "Los datos tienen media ~92 y desviación estándar ~47 (los dos picos de 200 y 190 aumentan mucho la variabilidad). CV ≈ 47/92 ≈ 0.51, que supera el umbral de 0.5 para clase Z. Los picos esporádicos (posiblemente pedidos especiales o estacionalidad fuerte) hacen la demanda muy irregular." },
    ],
    ejercicio: {
      titulo: "Clasificación ABC/XYZ de inventario para una empresa ecuatoriana",
      objetivo: "Aplicar la clasificación ABC/XYZ completa a un dataset de SKUs, identificar los ítems críticos por categoría y proponer políticas de gestión diferenciadas con la ayuda de ChatGPT.",
      herramientas: "Excel o Google Sheets, ChatGPT o Claude",
      pasos: [
        "Prepara un dataset de 30 SKUs en Excel con columnas: Código_SKU, Descripción, Costo_Unitario (USD), y demanda mensual para 12 meses (enero-diciembre). Incluye variedad: algunos ítems de alto valor y demanda estable, otros de bajo valor y demanda irregular.",
        "Calcula la Clasificación ABC: columna 'Valor_Anual' = SUMA(demandas 12 meses) × Costo_Unitario. Ordena de mayor a menor. Calcula '% individual' y '% acumulado'. Asigna clase A si % acumulado ≤80%, B si ≤95%, C si >95% usando función SI anidada.",
        "Calcula la Clasificación XYZ: para cada SKU, calcula el CV = DESVEST.M(demandas 12 meses) / PROMEDIO(demandas 12 meses). Asigna X si CV<0.2, Y si CV<0.5, Z si CV≥0.5.",
        "Crea la Clasificación Combinada concatenando las dos letras (ejemplo: 'A'&'X' = 'AX'). Usa tablas dinámicas para contar cuántos ítems hay en cada categoría y su valor total.",
        "Identifica los 3 ítems AZ de tu dataset. Usa ChatGPT con el prompt: 'Tengo 3 ítems clasificados AZ en mi empresa en Ecuador: [nombres, costos, demanda promedio, CV]. El lead time de estos ítems es [X] días. ¿Qué política de inventario específica recomiendas para cada uno? Incluye stock de seguridad sugerido en unidades, punto de reorden, frecuencia de revisión y estrategia con el proveedor.'",
        "Elabora una tabla resumen de políticas diferenciadas para cada categoría ABC/XYZ (las 9 combinaciones que tengas en tu dataset), con descripción de la política en 1-2 oraciones por categoría.",
      ],
      resultado: "Dataset de 30 SKUs con clasificación ABC/XYZ completa, conteo por categoría, política de ChatGPT para ítems AZ y tabla de políticas diferenciadas por categoría.",
      criterios: [
        { criterio: "Cálculo correcto de Valor Anual, % acumulado y clasificación ABC con fórmulas visibles", puntos: 25 },
        { criterio: "Cálculo correcto de CV y clasificación XYZ para los 30 SKUs", puntos: 25 },
        { criterio: "Identificación de ítems AZ y política de ChatGPT documentada con evaluación", puntos: 30 },
        { criterio: "Tabla resumen de políticas diferenciadas para todas las categorías presentes en el dataset", puntos: 20 },
      ],
    },
    recursos: [
      { titulo: "Investopedia — ABC Analysis Inventory Management", url: "https://www.investopedia.com/terms/a/abc-analysis.asp", tipo: "lectura", descripcion: "Explicación completa del análisis ABC con ejemplos numéricos y comparación con otros métodos de clasificación de inventario." },
      { titulo: "Lokad — XYZ Analysis Reference", url: "https://www.lokad.com/xyz-classification-definition", tipo: "documentacion", descripcion: "Referencia técnica sobre clasificación XYZ con fórmulas de CV, umbrales recomendados y combinación con ABC." },
      { titulo: "APICS — Supply Chain Management Fundamentals", url: "https://www.ascm.org/supply-chain-management-resources/", tipo: "lectura", descripcion: "Recursos de la Asociación para la Gestión de la Cadena de Suministro (ASCM/APICS), referencia profesional estándar en gestión de inventario." },
    ],
  },

  {
    id: 34,
    titulo: "EOQ y punto de reorden optimizado con Claude",
    modulo: MOD7,
    moduloNum: 7,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "EOQ y punto de reorden optimizado con Claude",
    teoria: `## EOQ y punto de reorden: los dos pilares cuantitativos de la gestión de inventario

La gestión de inventario enfrenta un trade-off fundamental: pedir poco frecuentemente reduce el costo de ordenar pero aumenta el costo de mantener inventario. Pedir frecuentemente reduce el inventario promedio pero aumenta los costos de gestión de pedidos. El **EOQ** (Economic Order Quantity — Cantidad Económica de Pedido) resuelve este trade-off matemáticamente, encontrando el tamaño de lote que minimiza el costo total.

### El modelo EOQ: fórmula y supuestos

**Fórmula EOQ:**
EOQ = √(2 × D × S / H)

Donde:
- **D** = Demanda anual en unidades
- **S** = Costo de ordenar por pedido (USD/pedido): incluye tiempo del comprador, costo de procesamiento, envío fijo si aplica
- **H** = Costo de mantener una unidad por año (USD/unidad/año): generalmente 20-30% del costo unitario como regla de dedo (incluye financiamiento, espacio, obsolescencia, seguros)

**Ejemplo Ecuador — Empresa de alimentos en Ambato:**
- Demanda anual de fundas de empaque especial: D = 12,000 unidades
- Costo de ordenar (tiempo comprador + envío desde Guayaquil): S = $45/pedido
- Costo unitario de la funda: $0.80 → H = 0.25 × $0.80 = $0.20/unidad/año

EOQ = √(2 × 12,000 × 45 / 0.20) = √(5,400,000) = **2,324 unidades por pedido**

Esto significa ordenar ~5 veces al año (12,000/2,324), no 12 veces (mensual) ni 52 veces (semanal).

**Supuestos del modelo EOQ básico:**
1. Demanda conocida y constante (D determinístico)
2. Lead time de reposición conocido y constante
3. Costo de ordenar y costo de mantener conocidos y constantes
4. No se permiten quiebres de stock
5. Los pedidos llegan todos a la vez (no entregas parciales)

Estos supuestos son restrictivos. En la práctica, la demanda varía, los lead times fluctúan y los costos cambian. Las extensiones del modelo EOQ (con demanda estocástica, con descuentos por volumen, con entregas parciales) abordan estas limitaciones.

### Punto de reorden (ROP): cuándo pedir

El **punto de reorden** es el nivel de inventario que, cuando se alcanza, dispara una orden de compra. Debe calcularse para que cuando llegue el pedido, el inventario no se haya agotado:

**ROP básico (lead time determinístico):**
ROP = Demanda diaria promedio × Lead time (días)

**ROP con stock de seguridad (lead time incierto):**
ROP = Demanda diaria promedio × Lead time promedio + Stock de seguridad

**Stock de seguridad = z × σ_demanda × √(Lead_time)**

Donde z es el factor de servicio (z=1.65 para nivel de servicio del 95%, z=2.05 para 98%, z=2.33 para 99%).

**Ejemplo continuando el caso anterior:**
- Demanda diaria promedio = 12,000/365 = 32.9 unidades/día
- Lead time promedio = 7 días
- σ_demanda_diaria = 8 unidades (25% de CV)
- Nivel de servicio objetivo = 95% → z = 1.65

Stock de seguridad = 1.65 × 8 × √7 = 1.65 × 8 × 2.65 = **35 unidades**
ROP = 32.9 × 7 + 35 = 230 + 35 = **265 unidades**

Cuando el inventario llegue a 265 unidades, se lanza la orden de 2,324 unidades (EOQ).

### Claude como asistente de optimización de inventario

Claude es especialmente útil para:
1. Calcular EOQ y ROP paso a paso con los datos de la empresa
2. Sensibilizar el modelo: ¿qué pasa con el EOQ si el costo de ordenar sube 50%?
3. Incorporar descuentos por volumen al análisis
4. Construir la tabla de costos totales para comparar el EOQ vs. la política actual

**Prompt modelo para cálculo con Claude:**
*"Soy gerente de compras de una empresa manufacturera en Ecuador. Necesito optimizar el inventario de mi materia prima más importante. Datos: Demanda anual D=24,000 unidades, Costo unitario=$1.50, Costo de ordenar S=$60/pedido, Tasa de mantenimiento=25% anual, Lead time promedio=10 días, σ demanda diaria=15 unidades, Nivel de servicio objetivo=95%. Calcula: EOQ, número óptimo de pedidos por año, costo total anual con EOQ vs. mi política actual (un pedido mensual de 2,000 unidades), ROP con stock de seguridad. Muestra todos los pasos del cálculo y dime cuánto ahorro anual esperar si adopto el EOQ."*

### Limitaciones del EOQ y alternativas modernas

El EOQ asume demanda determinística y no considera múltiples niveles de la cadena. Las alternativas modernas para contextos más complejos son:

- **EOQ con descuentos por volumen:** Cuando el proveedor ofrece mejor precio a mayor cantidad, el EOQ se recalcula para cada rango de precio y se elige el punto de menor costo total.
- **Sistema de revisión continua (s, Q):** Revisar el inventario continuamente y pedir EOQ cuando llega al ROP. Más costoso de administrar pero menor stock de seguridad.
- **Sistema de revisión periódica (R, S):** Revisar cada R períodos y pedir hasta S unidades. Más simple de administrar, requiere más stock de seguridad.
- **MRP (Material Requirements Planning):** Para manufactura con estructura de producto (árbol de ensamble), el MRP calcula automáticamente las necesidades de componentes a partir del plan maestro de producción.`,
    presentacionSlides: [
      { titulo: "El trade-off fundamental del inventario", contenido: "Pedir más cantidad: menos pedidos (costo ordenar ↓) pero más inventario promedio (costo mantener ↑). Pedir menos: lo inverso. El EOQ es el punto exacto donde la suma de ambos costos es mínima. Matemática que reemplaza la intuición." },
      { titulo: "Fórmula EOQ y sus tres variables", contenido: "EOQ = √(2 × D × S / H). D: demanda anual. S: costo por pedido (tiempo + envío). H: costo de mantener por unidad/año (25% del costo unitario como regla de dedo). Ejemplo Ecuador: D=12,000, S=$45, H=$0.20 → EOQ=2,324 unidades." },
      { titulo: "Punto de reorden con stock de seguridad", contenido: "ROP básico = Demanda_diaria × Lead_time. Con incertidumbre: ROP = Demanda_diaria × LT + z × σ_demanda × √LT. z=1.65 para 95% servicio. z=2.05 para 98%. z=2.33 para 99%. Mayor nivel de servicio = mayor stock seguridad = más capital." },
      { titulo: "EOQ vs. política actual: la tabla de costos", contenido: "Costo Total = Costo_ordenar_anual + Costo_mantener_anual. Con EOQ: ambos son iguales en el mínimo (propiedad matemática del modelo). Comparar con política actual (mensual, trimestral) muestra el ahorro exacto en dólares." },
      { titulo: "Prompt para cálculo completo con Claude", contenido: "Incluir: D, costo unitario, S, tasa mantenimiento %, lead time días, σ demanda diaria, nivel de servicio %. Claude calcula: EOQ, pedidos/año, costo total actual vs. EOQ, ROP con stock seguridad, ahorro anual en USD." },
      { titulo: "Sensibilización del modelo: ¿qué pasa si...?", contenido: "Si S sube 50%: EOQ aumenta √1.5 = 22%. Si H sube 50%: EOQ disminuye √1.5 = 18%. Si D se duplica: EOQ aumenta √2 = 41%. Estas relaciones no lineales (raíz cuadrada) sorprenden a muchos gerentes: el EOQ es robusto ante cambios moderados." },
      { titulo: "EOQ con descuentos por volumen", contenido: "Proveedor ofrece: 0-999 unidades a $1.50, 1000-2999 a $1.35, ≥3000 a $1.25. Calcular EOQ para cada rango con su H correspondiente. Verificar si el EOQ cae en el rango. Calcular costo total incluyendo costo de compra. Elegir el punto de menor costo total." },
      { titulo: "Sistemas de revisión: continua vs. periódica", contenido: "Continua (s,Q): revisar siempre, pedir EOQ cuando llega a ROP. Menor stock seguridad. Sistema de revisión periódica (R,S): revisar cada R días, pedir hasta S. Más fácil administrativamente. Más stock seguridad. Elegir según capacidad de monitoreo del equipo." },
    ],
    quiz: [
      { pregunta: "Una empresa tiene D=6,000 unidades/año, S=$50/pedido, H=$0.40/unidad/año. ¿Cuál es el EOQ?", opciones: ["750 unidades", "866 unidades", "1,225 unidades", "600 unidades"], respuesta: 1, explicacion: "EOQ = √(2 × 6,000 × 50 / 0.40) = √(600,000 / 0.40) = √1,500,000 ≈ 1,225 unidades. No es 866, que sería EOQ = √(2 × 6,000 × 50 / 0.80). Verificar con H=0.40." },
      { pregunta: "¿Qué representa el punto de reorden (ROP) en la gestión de inventario?", opciones: ["El máximo nivel de inventario permitido en el almacén", "El nivel de inventario al que, cuando se alcanza, se debe lanzar una orden de compra para no quedarse sin stock durante el lead time", "El EOQ dividido entre el número de pedidos por año", "El inventario promedio durante un año completo"], respuesta: 1, explicacion: "El ROP es el disparador de la orden de compra. Cuando el inventario disponible desciende hasta el ROP, se emite un pedido de EOQ unidades. Está calculado para que el inventario llegue a cero exactamente cuando el nuevo pedido arriba (sin stock de seguridad) o a nivel del stock de seguridad (con incertidumbre)." },
      { pregunta: "¿Para qué sirve el factor z en el cálculo del stock de seguridad?", opciones: ["Para ajustar el EOQ cuando hay descuentos por volumen", "Para determinar cuántas unidades extra mantener en función del nivel de servicio deseado: mayor z = mayor servicio al cliente = más capital inmovilizado", "Para calcular el costo de ordenar ajustado por inflación", "Para convertir la demanda anual a demanda diaria"], respuesta: 1, explicacion: "El factor z viene de la distribución normal estándar. z=1.65 da 95% de probabilidad de no agotar el stock durante el lead time. z=2.33 da 99%. Mayor nivel de servicio requiere más stock de seguridad (más capital inmovilizado), este es el trade-off fundamental del ROP." },
      { pregunta: "Si el costo de mantener inventario (H) se duplica, ¿en qué proporción cambia el EOQ?", opciones: ["El EOQ se reduce a la mitad", "El EOQ se reduce en √2 ≈ 29%", "El EOQ no cambia porque H no está en el numerador", "El EOQ se duplica"], respuesta: 1, explicacion: "EOQ = √(2DS/H). Si H se duplica: EOQ_nuevo = √(2DS/(2H)) = √(2DS/H) × (1/√2) = EOQ_original/√2. El EOQ se reduce en un factor de √2 ≈ 1.41, es decir, disminuye aproximadamente un 29%, no un 50%. La relación de raíz cuadrada amortigua los cambios." },
      { pregunta: "¿Cuál es la propiedad matemática especial del EOQ que facilita verificar si el cálculo es correcto?", opciones: ["En el EOQ, el número de pedidos por año siempre es igual a 12", "En el EOQ, el costo anual de ordenar es igual al costo anual de mantener inventario (ambos representan el 50% del costo total)", "En el EOQ, el inventario promedio siempre es igual a la demanda semanal", "En el EOQ, el ROP siempre es igual al EOQ dividido entre dos"], respuesta: 1, explicacion: "En el punto EOQ, donde se minimiza el costo total, el costo anual de ordenar (D/EOQ × S) es exactamente igual al costo anual de mantener ((EOQ/2) × H). Esta propiedad permite verificar el cálculo: si los dos costos no son iguales, hay un error en la fórmula." },
    ],
    ejercicio: {
      titulo: "Optimización de inventario EOQ + ROP con Claude para empresa ecuatoriana",
      objetivo: "Calcular el EOQ y punto de reorden para los tres ítems clasificados como A de tu empresa, comparar con la política actual y cuantificar el ahorro potencial con la asistencia de Claude.",
      herramientas: "Excel o Google Sheets, Claude.ai",
      pasos: [
        "Selecciona 3 ítems de inventario de alta importancia (clase A de la clasificación del tema anterior, o usa estos datos para una empresa de alimentos en Ecuador): Ítem 1: harina de trigo, D=36,000 kg/año, costo=$0.45/kg, S=$35/pedido, política actual=mensual. Ítem 2: azúcar, D=18,000 kg/año, costo=$0.62/kg, S=$40/pedido, política actual=quincenal. Ítem 3: envases plásticos, D=120,000 u/año, costo=$0.08/u, S=$55/pedido, política actual=mensual.",
        "Para cada ítem, calcula en Excel con las fórmulas visibles: H = 25% × costo unitario. EOQ = RAIZ(2×D×S/H). Número de pedidos/año = D/EOQ. Costo anual de ordenar = (D/EOQ) × S. Costo anual de mantener = (EOQ/2) × H. Costo total con EOQ = ordenar + mantener.",
        "Calcula el costo total con la política actual de cada ítem para comparar: política actual → tamaño de lote = D / (número de pedidos actuales). Costo con política actual = (D/Q_actual)×S + (Q_actual/2)×H.",
        "Usa Claude con el siguiente prompt para cada ítem: 'Para un ítem con D=[X] unidades/año, costo unitario=$[Y], S=$[Z]/pedido, tasa de mantenimiento=25%: (1) Confirma mi EOQ calculado de [resultado], (2) Lead time=12 días, σ demanda diaria=[calc], nivel de servicio objetivo 97%: calcula ROP con stock de seguridad, (3) Cuantifica el ahorro mensual vs. la política actual de [descripción]. Muestra todo el proceso.'",
        "Elabora una tabla comparativa de los 3 ítems con: EOQ, pedidos/año con EOQ, costo total actual, costo total con EOQ, ahorro anual en USD, ROP con stock de seguridad.",
        "Calcula el ahorro total anual de adoptar EOQ para los 3 ítems. Si la empresa tiene 30 ítems clase A con ahorro promedio similar, estima el ahorro total de programa de optimización completo.",
      ],
      resultado: "Tabla comparativa de 3 ítems con EOQ, ROP, costo actual vs. EOQ, ahorro anual calculado y extrapolación del ahorro potencial del programa completo.",
      criterios: [
        { criterio: "EOQ calculado correctamente para los 3 ítems con fórmulas visibles en Excel", puntos: 30 },
        { criterio: "ROP con stock de seguridad calculado correctamente con z apropiado para 97% de servicio", puntos: 25 },
        { criterio: "Comparación cuantitativa costo actual vs. EOQ con ahorro en USD para cada ítem", puntos: 25 },
        { criterio: "Diálogo con Claude documentado y extrapolación del ahorro potencial del programa completo", puntos: 20 },
      ],
    },
    recursos: [
      { titulo: "Investopedia — Economic Order Quantity (EOQ) Formula", url: "https://www.investopedia.com/terms/e/economicorderquantity.asp", tipo: "lectura", descripcion: "Explicación completa del EOQ con ejemplos numéricos, supuestos del modelo y variantes para descuentos por volumen." },
      { titulo: "APICS Dictionary — Inventory Management Terms", url: "https://www.ascm.org/learning-development/apics-dictionary/", tipo: "documentacion", descripcion: "Diccionario oficial de APICS/ASCM con definiciones precisas de EOQ, ROP, stock de seguridad y todos los términos de gestión de inventario." },
      { titulo: "MIT OpenCourseWare — Supply Chain Management", url: "https://ocw.mit.edu/courses/15-760b-introduction-to-operations-management-spring-2004/", tipo: "lectura", descripcion: "Curso gratuito del MIT sobre operaciones y cadena de suministro, incluyendo módulos completos sobre modelos de inventario." },
    ],
  },

  {
    id: 35,
    titulo: "NotebookLM como base de conocimiento supply chain",
    modulo: MOD7,
    moduloNum: 7,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "NotebookLM como base de conocimiento supply chain",
    teoria: `## NotebookLM: tu base de conocimiento de cadena de suministro con IA

NotebookLM es la herramienta de Google que transforma documentos estáticos (manuales, contratos, informes, normativas) en una base de conocimiento conversacional. Para un gerente de cadena de suministro o un ingeniero industrial, esto significa poder hacer preguntas en lenguaje natural sobre documentos técnicos complejos y obtener respuestas precisas citando la fuente, en lugar de buscar manualmente en cientos de páginas.

### ¿Qué es NotebookLM y cómo funciona?

NotebookLM (notebooklm.google.com) permite:
1. **Subir fuentes de conocimiento:** PDFs, documentos Word, hojas de cálculo Google, páginas web (URLs), archivos de texto o grabaciones de audio
2. **Generar un "modelo de lenguaje personalizado"** basado exclusivamente en esas fuentes
3. **Hacer preguntas en lenguaje natural** y obtener respuestas fundamentadas citando el párrafo exacto de la fuente
4. **Generar resúmenes, briefings y FAQs** automáticamente
5. **Crear Audio Overviews:** NotebookLM puede convertir el contenido del notebook en un podcast de dos voces que explica los conceptos clave

La diferencia crítica con ChatGPT o Claude es que NotebookLM solo responde basándose en los documentos que subiste. No "alucina" información de su entrenamiento general. Si la respuesta no está en tus documentos, lo dice explícitamente.

### Aplicaciones en cadena de suministro

**Base de conocimiento de proveedores:**
Sube: contratos de proveedores, acuerdos de nivel de servicio (SLA), fichas técnicas de materiales, histórico de calidad, catálogos de precios. Luego pregunta: "¿Cuál es el tiempo de entrega garantizado por contrato del proveedor Acero del Ecuador para pedidos superiores a 5 toneladas?" NotebookLM responde citando el párrafo exacto del contrato.

**Análisis de normativas y certificaciones:**
Sube: normas INEN aplicables a tus productos, requisitos de importación del SENAE, normativa ARCSA para alimentos. Pregunta: "¿Qué documentación exige el SENAE para importar materiales de embalaje de China? ¿Exige certificación de origen preferencial?" NotebookLM analiza todas las normas simultáneamente.

**Gestión de manuales técnicos:**
En una planta con 50 equipos, los manuales de operación y mantenimiento pueden sumar miles de páginas. Sube los manuales a NotebookLM y pregunta: "¿Cuál es el torque de apriete para los pernos de la brida del compresor Atlas Copco GA37?" en lugar de buscar en 300 páginas.

**Base de conocimiento de lecciones aprendidas:**
Sube reportes de problemas pasados de calidad, incidentes con proveedores, informes de no conformidad. Pregunta: "¿Cuántas veces hemos tenido problemas con el proveedor Plásticos del Norte? ¿Cuáles fueron las causas y cómo se resolvieron?"

**Análisis de informes de mercado y estudios sectoriales:**
Sube reportes de cámaras de comercio, estudios del BCE sobre el sector, informes INEC, análisis de competencia. Pregunta: "¿Cuáles son las perspectivas de crecimiento del sector alimentos procesados en Ecuador para 2025-2026 según estos informes?"

### Cómo construir un notebook efectivo de supply chain

**Paso 1 — Organizar las fuentes:**
Define el alcance del notebook. Para supply chain, tiene más valor un notebook enfocado (por ejemplo, "Gestión de proveedores nacionales") que uno genérico con 50 documentos de temas distintos. NotebookLM permite hasta 50 fuentes por notebook con hasta 500,000 palabras por fuente.

**Paso 2 — Preparar los documentos:**
Los documentos deben estar en formato digital (no imágenes escaneadas sin OCR). Para contratos y manuales en papel, usar Adobe Scan o la app de Google para digitalizar con OCR antes de subir.

**Paso 3 — Definir las preguntas frecuentes:**
NotebookLM genera automáticamente una FAQ del notebook. Revísala para verificar que las preguntas más críticas están cubiertas. Si falta algún tema, probablemente faltan documentos relevantes.

**Paso 4 — Crear el Study Guide:**
El botón "Study Guide" en NotebookLM genera automáticamente un documento estructurado con los conceptos clave, un glosario y preguntas de comprensión basados en tus documentos. Útil para onboarding de nuevos miembros del equipo de supply chain.

**Paso 5 — Usar el Audio Overview:**
Para equipos que prefieren audio o para absorber el contenido durante el traslado, el Audio Overview genera un podcast de 10-20 minutos que resume los documentos del notebook en un formato conversacional natural.

### NotebookLM vs. ChatGPT para documentos internos: ¿cuándo usar cada uno?

| Criterio | NotebookLM | ChatGPT |
|----------|-----------|---------|
| Fuentes de conocimiento | Solo tus documentos (confiable) | Su entrenamiento + documentos adjuntos |
| Riesgo de alucinación | Muy bajo (cita la fuente) | Moderado sin documentos |
| Tipo de preguntas | Específicas sobre tus documentos | Conceptuales y de razonamiento |
| Mejor para | Contratos, manuales, normas, informes | Análisis, síntesis, cálculos |
| Confidencialidad | Documentos van a servidores de Google | Igual |
| Costo | Gratuito (con cuenta Google) | GPT-4: de pago |

La combinación ideal: usa NotebookLM para extraer información específica de tus documentos internos, luego lleva esa información a ChatGPT o Claude para análisis, síntesis y toma de decisiones.`,
    presentacionSlides: [
      { titulo: "NotebookLM: IA que responde solo desde tus documentos", contenido: "No alucina información externa. Cita el párrafo exacto de la fuente. 50 fuentes × 500K palabras por notebook. PDFs, Word, Google Docs, URLs, audio. Gratuito con cuenta Google. notebooklm.google.com." },
      { titulo: "5 aplicaciones clave en cadena de suministro", contenido: "1. Base de conocimiento de proveedores (contratos + SLAs). 2. Análisis de normativas INEN/SENAE/ARCSA. 3. Manuales técnicos (miles de páginas consultables en segundos). 4. Lecciones aprendidas (incidentes pasados). 5. Informes de mercado y estudios sectoriales." },
      { titulo: "Audio Overview: el podcast de tus documentos", contenido: "NotebookLM genera automáticamente un podcast de 2 voces (10-20 min) que resume el contenido del notebook. Para absorber información durante traslados. Para onboarding de nuevos miembros del equipo. Para comunicar hallazgos al equipo sin leer informes completos." },
      { titulo: "Construir el notebook en 5 pasos", contenido: "1. Definir alcance enfocado. 2. Digitalizar documentos en papel (Adobe Scan). 3. Revisar FAQ auto-generada. 4. Crear Study Guide para onboarding. 5. Usar Audio Overview para difusión al equipo." },
      { titulo: "Preguntas potentes para supply chain en NotebookLM", contenido: "'¿Qué dice el contrato con [proveedor] sobre penalidades por entrega tardía?' '¿Cuáles son los requisitos SENAE para importar [material] desde [país]?' '¿Cuántas veces fallamos con el proveedor X en los últimos 2 años y cuáles fueron las causas?'" },
      { titulo: "NotebookLM vs. ChatGPT: cuándo usar cada uno", contenido: "NotebookLM: preguntas específicas sobre tus documentos internos, bajo riesgo de alucinación, gratis. ChatGPT/Claude: análisis conceptual, síntesis, cálculos, razonamiento complejo. Combinación ideal: NotebookLM extrae → ChatGPT analiza." },
      { titulo: "Limitación: no reemplaza el criterio del ingeniero", contenido: "NotebookLM puede malinterpretar contexto técnico complejo. Siempre verificar respuestas críticas leyendo el párrafo original citado. Para decisiones importantes (contratos, seguridad), el ingeniero lee el documento original. IA como asistente, no como árbitro." },
      { titulo: "Caso práctico: notebook de proveedores en 30 minutos", contenido: "Subir 5 contratos de proveedores + 5 historiales de calidad + norma INEN relevante. Generar FAQ y Study Guide. Primera pregunta: 'Dame el ranking de mis proveedores por cumplimiento de entrega según los contratos y los históricos.' NotebookLM responde con citas específicas." },
    ],
    quiz: [
      { pregunta: "¿Cuál es la diferencia fundamental entre NotebookLM y ChatGPT para analizar documentos de supply chain?", opciones: ["NotebookLM es de pago y ChatGPT es gratuito", "NotebookLM responde exclusivamente basándose en los documentos que subiste y cita la fuente; ChatGPT puede combinar información de entrenamiento general con los documentos, con mayor riesgo de alucinación", "NotebookLM solo funciona con documentos en inglés", "No hay diferencia práctica; ambos funcionan igual para documentos industriales"], respuesta: 1, explicacion: "NotebookLM es un sistema de recuperación aumentada por generación (RAG) que trabaja solo con los documentos del notebook y cita el párrafo exacto de la fuente para cada respuesta. Esto reduce drásticamente el riesgo de 'alucinaciones' (información inventada) comparado con ChatGPT en modo general." },
      { pregunta: "¿Qué es el Audio Overview de NotebookLM y para qué es útil en un equipo de supply chain?", opciones: ["Es una función para transcribir grabaciones de voz a texto", "Genera automáticamente un podcast de dos voces (10-20 minutos) que resume el contenido del notebook; útil para onboarding de nuevos miembros o para absorber información durante traslados", "Es una alarma de audio que avisa cuando se actualiza un documento del notebook", "Solo está disponible para documentos en formato de audio; no funciona con PDFs"], respuesta: 1, explicacion: "El Audio Overview convierte el contenido de los documentos del notebook en un episodio de podcast conversacional de dos voces generado por IA, permitiendo absorber información durante el traslado, comunicar hallazgos al equipo o facilitar el onboarding sin necesidad de leer documentos extensos." },
      { pregunta: "¿Por qué es importante que los documentos estén en formato digital con OCR antes de subirlos a NotebookLM?", opciones: ["Porque NotebookLM solo acepta documentos creados después de 2020", "Porque NotebookLM procesa texto digital; documentos escaneados como imágenes sin OCR no tienen texto legible para el modelo", "Porque los documentos en papel tienen derechos de autor y no se pueden digitalizar", "Solo aplica para documentos en chino o japonés"], respuesta: 1, explicacion: "NotebookLM procesa el contenido textual de los documentos. Un PDF escaneado que es solo una imagen (sin capa de texto OCR) no tiene texto que el modelo pueda leer. Usar Adobe Scan, Google PhotoScan u otras apps de OCR para convertir documentos en papel a PDF con texto digital antes de subirlos." },
      { pregunta: "¿Cuál es la combinación óptima de NotebookLM y ChatGPT/Claude para analizar contratos de proveedores?", opciones: ["Usar solo ChatGPT para todo porque tiene más capacidad de razonamiento", "Usar NotebookLM para extraer información específica citando la fuente (condiciones de entrega, penalidades, precios) y luego llevar esa información a ChatGPT/Claude para análisis comparativo y toma de decisiones", "Usar solo NotebookLM porque es gratuito y ChatGPT es de pago", "Usar ambas herramientas por separado para el mismo análisis y comparar resultados"], respuesta: 1, explicacion: "La combinación óptima es secuencial: NotebookLM extrae información precisa y citada de los documentos (contratos, normas, manuales) sin alucinar. ChatGPT o Claude recibe esa información verificada y realiza el análisis comparativo, la síntesis de decisión o los cálculos que van más allá de recuperar información." },
      { pregunta: "¿Para qué tipo de pregunta es más adecuado NotebookLM vs. Claude?", opciones: ["NotebookLM: '¿Cuánto es 2+2?'. Claude: '¿Qué dice el contrato?'", "NotebookLM: '¿Qué penalidades establece el contrato con Proveedor X por entrega tardía?'. Claude: '¿Cómo debería estructurar mi estrategia de negociación con proveedores?'", "Ambas herramientas son igualmente apropiadas para todos los tipos de preguntas", "NotebookLM para preguntas de ingeniería; Claude solo para preguntas de marketing"], respuesta: 1, explicacion: "NotebookLM es la herramienta ideal para preguntas que requieren información precisa de documentos específicos (contratos, manuales, normas). Claude y ChatGPT son superiores para preguntas que requieren razonamiento, síntesis, generación de estrategias o cálculos que van más allá de recuperar información de documentos." },
    ],
    ejercicio: {
      titulo: "Construir una base de conocimiento de supply chain con NotebookLM",
      objetivo: "Crear un notebook de supply chain con al menos 4 documentos relevantes, practicar preguntas específicas citadas en la fuente y generar un Audio Overview para el equipo.",
      herramientas: "NotebookLM (notebooklm.google.com — gratuito con cuenta Google), documentos en PDF/Word",
      pasos: [
        "Accede a NotebookLM en notebooklm.google.com con tu cuenta de Google. Crea un nuevo notebook llamado 'Base de Conocimiento Supply Chain [tu empresa o sector]'.",
        "Recopila y sube al menos 4 documentos relevantes. Opciones: (a) Un contrato de proveedor o modelo de contrato descargado de internet. (b) Una norma INEN en PDF (descargables desde normalizacion.gob.ec). (c) Un informe del BCE sobre el sector industrial o el Manual del Exportador del PRO ECUADOR. (d) El reglamento SENAE para importaciones (disponible en aduana.gob.ec). Digitaliza con OCR si es necesario.",
        "Revisa la FAQ automática que genera NotebookLM. ¿Las preguntas cubren los temas más importantes de tus documentos? ¿Qué preguntas adicionales necesitas que el notebook pueda responder?",
        "Ejecuta al menos 5 preguntas específicas al notebook. Ejemplos: '¿Cuáles son los plazos de entrega estipulados en el contrato de proveedor?', '¿Qué certificaciones exige la norma INEN [número] para [producto]?', '¿Cuál es el procedimiento para importar [material] según el SENAE?'. Copia las respuestas y verifica que incluyan la cita de la fuente.",
        "Genera el Audio Overview del notebook. Escúchalo durante 10 minutos. ¿Captura los conceptos más importantes de tus documentos? ¿Cometió algún error conceptual que debas corregir añadiendo más contexto al notebook?",
        "Reflexión final: ¿Cuánto tiempo te habría tomado encontrar manualmente las respuestas a tus 5 preguntas en los documentos originales? ¿Cuánto tiempo tomó con NotebookLM? ¿En qué situaciones de tu trabajo habitual te sería más útil esta herramienta?",
      ],
      resultado: "Notebook de NotebookLM con 4+ documentos, 5 preguntas con respuestas citadas documentadas, Audio Overview generado y reflexión sobre el tiempo ahorrado.",
      criterios: [
        { criterio: "Notebook creado con al menos 4 documentos relevantes de supply chain en Ecuador", puntos: 25 },
        { criterio: "5 preguntas específicas con respuestas de NotebookLM documentadas, cada una con la cita de la fuente", puntos: 35 },
        { criterio: "Audio Overview generado con evaluación de precisión y cobertura de contenido", puntos: 20 },
        { criterio: "Reflexión sobre tiempo ahorrado y casos de uso prioritarios para la profesión del estudiante", puntos: 20 },
      ],
    },
    recursos: [
      { titulo: "NotebookLM — Plataforma gratuita de Google", url: "https://notebooklm.google.com/", tipo: "herramienta", descripcion: "Acceso directo a NotebookLM de Google. Gratuito con cuenta de Google. Crea tu primer notebook de supply chain en minutos." },
      { titulo: "PRO ECUADOR — Manual del Exportador e informes sectoriales", url: "https://www.proecuador.gob.ec/exportaciones/informes/", tipo: "herramienta", descripcion: "Informes sectoriales y manuales del exportador ecuatoriano en PDF, ideales para subir a NotebookLM como base de conocimiento de comercio exterior." },
      { titulo: "SENAE Ecuador — Normativa de importaciones y exportaciones", url: "https://www.aduana.gob.ec/para-exportar/normativa/", tipo: "documentacion", descripcion: "Portal del Servicio Nacional de Aduana del Ecuador con normativa vigente en PDF para importaciones y exportaciones, perfecta para NotebookLM." },
    ],
  },

  // M8 — Integración y proyecto final aplicado
  {
    id: 36,
    titulo: "Automatización de procesos con n8n e IA",
    modulo: MOD8,
    moduloNum: 8,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Automatización de procesos con n8n e IA",
    teoria: `## n8n: automatización de procesos industriales sin programar

La automatización de procesos es el siguiente nivel después de dominar las herramientas de IA individualmente. **n8n** (pronunciado "n-eight-n") es la plataforma de automatización de código abierto que permite conectar aplicaciones y servicios con flujos de trabajo visuales, integrando herramientas de IA como ChatGPT, Claude, Google Gemini con fuentes de datos industriales (Excel, bases de datos, correo electrónico, sistemas ERP) sin necesidad de programar.

### ¿Qué es n8n y por qué es ideal para ingenieros industriales?

n8n es una alternativa de código abierto a Zapier y Make (antes Integromat). Sus ventajas para el contexto industrial ecuatoriano:

**Self-hosted gratuito:** A diferencia de Zapier, n8n puede instalarse en un servidor propio (incluyendo una PC en la red de la empresa) sin costo de licencia. Esto es crítico para procesos que involucran datos confidenciales de producción que no deben salir de la empresa.

**Nodos de IA integrados:** n8n tiene nodos nativos para OpenAI (ChatGPT), Anthropic (Claude), Google Gemini y modelos locales (Ollama). No necesitas saber programar la API; arrastras el nodo y configuras el prompt.

**Conectores con herramientas empresariales:** Google Sheets, Excel (via Microsoft 365), bases de datos SQL, correo electrónico (Gmail/Outlook), WhatsApp Business, Slack, Telegram. En Ecuador, donde muchas PYMEs operan con Google Workspace o Microsoft 365, estos conectores son inmediatamente aplicables.

**Programación temporal:** Los flujos pueden ejecutarse automáticamente en horarios definidos (diariamente a las 6 AM, cada hora, al recibir un nuevo correo).

### Casos de automatización industrial con n8n + IA

**Caso 1 — Reporte de calidad diario automatizado:**
Flujo: [Trigger: Cron 6 AM] → [Google Sheets: leer datos de defectos del día anterior] → [ChatGPT: generar análisis de Pareto y narrativa ejecutiva] → [Gmail: enviar reporte al jefe de calidad y gerencia]

El ingeniero solo define el prompt una vez. Cada mañana la gerencia recibe el reporte de calidad sin que nadie tenga que generarlo manualmente.

**Caso 2 — Alerta de mantenimiento predictivo:**
Flujo: [Trigger: Webhook desde sensor IoT cada hora] → [Condición: si vibración > umbral] → [ChatGPT: generar diagnóstico de causa probable] → [WhatsApp Business: enviar alerta al técnico de turno]

El técnico recibe en su WhatsApp no solo "equipo X con vibración alta" sino "Motor bomba #3: vibración 4.8 mm/s (zona C). Causa probable: desalineación del eje. Revisar acoplamiento antes del siguiente turno."

**Caso 3 — Análisis de cotizaciones de proveedores:**
Flujo: [Trigger: nuevo email de proveedor con PDF adjunto] → [PDF Extract: extraer texto del PDF] → [Claude: comparar cotización con especificaciones requeridas y últimas compras] → [Google Sheets: agregar a tabla comparativa] → [Email: responder al proveedor con confirmación de recibido]

**Caso 4 — Dashboard de KPIs de producción:**
Flujo: [Trigger: Cron cada 4 horas] → [SQL: leer datos de producción de ERP] → [ChatGPT: calcular OEE y detectar desviaciones] → [Google Sheets: actualizar dashboard] → [Slack: notificar si OEE < 80%]

### Construir el primer flujo en n8n

**Instalación rápida con Docker (opción técnica):**

[Código bash]
    docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
[/Código]
Luego accede en http://localhost:5678

**Instalación sin Docker (opción simple):**
- Instalar Node.js desde nodejs.org
- npm install n8n -g
- Ejecutar: n8n start
- Acceder en http://localhost:5678

**Estructura de un flujo básico:**
1. **Trigger node:** Define cuándo se ejecuta el flujo (programado, webhook, evento)
2. **Action nodes:** Los pasos del flujo (leer datos, llamar a IA, enviar resultado)
3. **Condition nodes:** Lógica condicional (if vibración > umbral, then...)
4. **Output nodes:** Qué hacer con el resultado (email, Google Sheets, WhatsApp)

### n8n Cloud: la alternativa sin instalación

Para empresas que no quieren gestionar la instalación, n8n Cloud ofrece:
- Plan Starter: €20/mes con 2,500 ejecuciones/mes
- Plan Pro: €50/mes con 50,000 ejecuciones/mes
- Prueba gratuita de 14 días

Para la mayoría de las empresas ecuatorianas medianas, el plan Starter es suficiente para automatizar reportes diarios, alertas de mantenimiento y análisis de cotizaciones.

### ChatGPT para diseñar los flujos de automatización

Antes de construir en n8n, ChatGPT puede ayudar a diseñar la lógica del flujo:

*"Quiero automatizar el siguiente proceso en mi planta en Ecuador: cada lunes, consolidar los datos de producción de la semana anterior desde Google Sheets, calcular el OEE y el top 3 de defectos, generar un informe ejecutivo y enviarlo por email al equipo directivo. Diseña el flujo de automatización en n8n con los nodos específicos que necesito y el prompt exacto para el nodo de ChatGPT que genera el análisis."*`,
    presentacionSlides: [
      { titulo: "n8n: automatización visual sin programar", contenido: "Plataforma open-source que conecta aplicaciones + IA. Self-hosted gratuito (datos no salen de la empresa). Nodos nativos para ChatGPT, Claude, Gemini. Conectores con Google Sheets, Excel, email, WhatsApp Business, bases de datos SQL." },
      { titulo: "4 casos de automatización industrial clave", contenido: "1. Reporte de calidad diario automático (Cron → Sheets → ChatGPT → Gmail). 2. Alerta predictiva en WhatsApp (sensor → condición → Claude → técnico). 3. Análisis de cotizaciones (email+PDF → Claude → Sheets). 4. Dashboard KPIs cada 4h (SQL → ChatGPT → Slack)." },
      { titulo: "Estructura de un flujo n8n", contenido: "Trigger: cuándo ejecutar (horario, webhook, evento). Action: qué hacer (leer datos, llamar IA, procesar). Condition: lógica if/then. Output: qué hacer con el resultado (email, Sheets, WhatsApp). Cada nodo es un bloque visual que se arrastra y conecta." },
      { titulo: "Instalación en 3 pasos", contenido: "Opción Docker: docker run n8nio/n8n → http://localhost:5678. Opción npm: npm install n8n -g → n8n start → http://localhost:5678. Opción cloud: n8n.io → plan Starter €20/mes → sin instalación. 14 días gratis." },
      { titulo: "El nodo de OpenAI/Claude en n8n", contenido: "Arrastrar nodo 'OpenAI' o 'Anthropic'. Conectar API key (la misma de ChatGPT Plus). Definir el prompt usando datos del nodo anterior con {{$json.campo}}. El output del nodo de IA se conecta al siguiente paso del flujo." },
      { titulo: "Prompt para diseñar flujos con ChatGPT", contenido: "Describir el proceso manual actual completo. Describir las herramientas disponibles (Google Sheets, qué ERP, qué email). ChatGPT diseña el flujo n8n con nodos específicos, lógica condicional y el prompt exacto para el nodo de IA." },
      { titulo: "n8n vs. Zapier vs. Make: comparación rápida", contenido: "n8n: open-source, self-hosted gratuito, nodos IA nativos, más técnico. Zapier: más fácil, más integraciones, costoso en volumen. Make (Integromat): precio medio, muy visual, buen soporte. Para PYME Ecuador con datos sensibles: n8n self-hosted gana." },
      { titulo: "ROI de automatizar con n8n", contenido: "Reporte manual diario: 1h/día × 20 días = 20h/mes. Con n8n: 0h/mes (automático). A $15/h de analista: ahorro $300/mes. N8n Cloud Starter: €20/mes. ROI: 15× en el primer mes. La automatización paga sola en días." },
    ],
    quiz: [
      { pregunta: "¿Cuál es la principal ventaja de n8n self-hosted vs. Zapier para una empresa industrial en Ecuador?", opciones: ["n8n tiene más integraciones con software empresarial que Zapier", "n8n self-hosted es gratuito y los datos de producción permanecen en los servidores de la empresa, sin salir a la nube de un tercero", "Zapier no puede conectarse con Google Sheets", "n8n funciona sin internet mientras que Zapier necesita conexión permanente"], respuesta: 1, explicacion: "La ventaja crítica de n8n self-hosted es que puede instalarse en servidores propios de la empresa, manteniendo los datos de producción confidenciales internamente sin que salgan a servidores de terceros. Esto es especialmente importante para datos de producción, calidad y costos que no deben estar en la nube pública." },
      { pregunta: "En n8n, ¿qué es un nodo 'Trigger'?", opciones: ["El nodo que envía el resultado final por email", "El nodo que define cuándo se inicia la ejecución del flujo (horario programado, webhook, nuevo correo)", "El nodo que llama a la API de ChatGPT", "El nodo que conecta con bases de datos SQL"], respuesta: 1, explicacion: "Un nodo Trigger es el punto de inicio de un flujo en n8n. Define el evento que dispara la ejecución: puede ser un horario (Cron), una llamada HTTP (Webhook), la llegada de un nuevo email, un cambio en una hoja de cálculo, etc. Sin un Trigger, el flujo nunca se ejecuta." },
      { pregunta: "¿Cómo se pasan datos del nodo anterior al prompt del nodo de ChatGPT en n8n?", opciones: ["Hay que copiar y pegar los datos manualmente en el prompt cada vez", "Usando la sintaxis {{$json.nombre_campo}} dentro del prompt para referenciar dinámicamente los datos del nodo anterior", "No es posible combinar datos dinámicos con prompts en n8n", "Solo se pueden pasar datos numéricos, no texto"], respuesta: 1, explicacion: "En n8n, la sintaxis {{$json.campo}} dentro del texto de un prompt permite insertar dinámicamente el valor de cualquier campo del output del nodo anterior. Por ejemplo, un prompt podría decir: 'Analiza los siguientes defectos del día: {{$json.defectos}}', donde 'defectos' es una columna de la hoja de cálculo leída en el nodo anterior." },
      { pregunta: "¿Cuál de los siguientes casos de automatización industrial con n8n tiene el ROI más inmediato y fácil de calcular?", opciones: ["Automatizar el inventario completo del almacén", "Automatizar la generación y envío del reporte diario de calidad que actualmente toma 1 hora manual por día", "Automatizar el control PLC de los equipos de producción", "Automatizar el sistema de nómina de los empleados"], respuesta: 1, explicacion: "La automatización de reportes periódicos (diarios, semanales) tiene ROI inmediato y fácil de calcular: horas manuales eliminadas × costo por hora del analista. Un reporte de 1h/día × 20 días = 20h/mes; a $15/h = $300/mes de valor creado vs. ~€20/mes del plan cloud de n8n." },
      { pregunta: "¿Para qué sirve el nodo 'Condition' en un flujo de n8n de mantenimiento predictivo?", opciones: ["Para programar el horario de ejecución del flujo", "Para aplicar lógica condicional: si la vibración supera el umbral, ejecutar el camino de alerta; si no, ejecutar el camino normal de registro", "Para conectar con la API de los sensores IoT", "Para formatear el texto del mensaje antes de enviarlo por WhatsApp"], respuesta: 1, explicacion: "El nodo Condition (IF) en n8n permite dividir el flujo en dos caminos según una condición lógica. En mantenimiento predictivo: si vibración > umbral → enviar alerta a WhatsApp; si vibración ≤ umbral → solo registrar en base de datos. Sin nodos de condición, todos los registros generarían alertas." },
    ],
    ejercicio: {
      titulo: "Diseñar y construir un flujo de automatización con n8n",
      objetivo: "Diseñar un flujo de automatización industrial con n8n que integre al menos un nodo de IA, una fuente de datos y un canal de salida, probarlo en la plataforma y documentar el ROI.",
      herramientas: "n8n Cloud (prueba gratuita 14 días en n8n.io) o n8n local (npm install n8n -g), ChatGPT para diseñar la lógica",
      pasos: [
        "Define el proceso que vas a automatizar. Elige uno de estos tres: (A) Reporte de calidad diario: leer datos de defectos de Google Sheets → ChatGPT genera análisis → Gmail envía reporte. (B) Alerta de inventario bajo: leer inventario de Google Sheets → si algún ítem < punto de reorden → Gmail envía alerta con la lista. (C) Análisis de texto de no conformidades: al recibir email con descripción de problema de calidad → Claude sugiere causas raíz y acciones → copiar respuesta a Google Sheets.",
        "Usa ChatGPT para diseñar el flujo antes de construirlo: 'Quiero automatizar [el proceso elegido] usando n8n. Las herramientas disponibles son Google Sheets y Gmail (o Outlook). Diseña el flujo detallado con los nodos específicos de n8n que necesito, la lógica condicional (si aplica) y el prompt exacto para el nodo de OpenAI/Claude.'",
        "Accede a n8n Cloud (prueba gratuita en app.n8n.io) o instala localmente con npm. Crea un nuevo workflow en blanco.",
        "Construye el flujo nodo por nodo siguiendo el diseño de ChatGPT: Agrega el Trigger node (Manual o Cron). Agrega el nodo de Google Sheets para leer datos. Configura el nodo de OpenAI o Claude con el prompt diseñado (usa {{$json.campo}} para datos dinámicos). Agrega el nodo de Gmail para el output.",
        "Ejecuta el flujo con el botón 'Test' y verifica cada nodo: ¿los datos se pasan correctamente? ¿El prompt de IA produce el output esperado? ¿El email llega correctamente? Corrige errores iterativamente.",
        "Calcula el ROI: estima cuántas horas mensuales ahorra este flujo vs. hacerlo manualmente. Multiplica por el costo estimado por hora del profesional que actualmente hace este trabajo. Compara con el costo de n8n Cloud ($0 en self-hosted, ~€20/mes en cloud).",
      ],
      resultado: "Flujo de n8n funcionando con capturas de pantalla de cada nodo, resultado de la ejecución de prueba documentado y cálculo de ROI mensual.",
      criterios: [
        { criterio: "Flujo diseñado con ChatGPT documentado antes de la construcción en n8n", puntos: 20 },
        { criterio: "Flujo construido en n8n con al menos 3 nodos (trigger + IA + output) y ejecutado exitosamente", puntos: 40 },
        { criterio: "Capturas de pantalla del flujo y del resultado de ejecución (output generado por IA)", puntos: 20 },
        { criterio: "Cálculo de ROI documentado con horas ahorradas y comparación costo/beneficio", puntos: 20 },
      ],
    },
    recursos: [
      { titulo: "n8n Docs — Getting Started", url: "https://docs.n8n.io/getting-started/", tipo: "documentacion", descripcion: "Documentación oficial de n8n para comenzar: instalación, primeros workflows y referencia de nodos incluyendo OpenAI y Anthropic." },
      { titulo: "n8n Cloud — Prueba gratuita 14 días", url: "https://app.n8n.io/", tipo: "herramienta", descripcion: "Plataforma cloud de n8n con prueba gratuita de 14 días. La forma más rápida de comenzar sin instalación local." },
      { titulo: "n8n Community — Workflows industriales", url: "https://community.n8n.io/", tipo: "lectura", descripcion: "Comunidad de n8n con miles de workflows compartidos, incluyendo automatizaciones de reportes, alertas y análisis de datos con IA." },
    ],
  },

  {
    id: 37,
    titulo: "Conectar herramientas: Excel → ChatGPT → Power BI",
    modulo: MOD8,
    moduloNum: 8,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Conectar herramientas: Excel → ChatGPT → Power BI",
    teoria: `## El stack de inteligencia de datos para ingeniería industrial

Las herramientas individuales son poderosas. Su combinación en un flujo integrado es transformadora. El stack **Excel → ChatGPT → Power BI** representa el flujo de trabajo más práctico para ingenieros industriales que quieren convertir datos de producción en inteligencia accionable sin necesidad de un equipo de datos dedicado.

### El flujo completo explicado

**Capa 1 — Excel: recolección y estructura de datos**
Excel sigue siendo la herramienta de captura de datos más usada en planta. Los operadores registran datos de producción, calidad y mantenimiento en hojas de cálculo. Power Query en Excel consolida automáticamente múltiples fuentes (varias hojas, varios archivos, datos de sistemas ERP simplificados) en una tabla maestra estructurada.

**Capa 2 — ChatGPT: análisis e interpretación**
La tabla maestra de Excel se convierte en el input para ChatGPT. El ingeniero copia los datos relevantes (o usa la API de OpenAI para automatizar este paso) y hace preguntas en lenguaje natural: "¿Qué turno tiene el mayor MTTR este mes? ¿Hay correlación entre la temperatura del día y los defectos de calidad? ¿Cuál es la tendencia del OEE en las últimas 6 semanas?"

ChatGPT procesa el contexto, realiza los cálculos estadísticos necesarios y genera:
- Análisis narrativo para el informe ejecutivo
- Código Python o DAX para implementar los cálculos en la siguiente capa
- Recomendaciones de mejora basadas en los patrones detectados

**Capa 3 — Power BI: visualización y distribución**
Power BI conecta directamente con Excel como fuente de datos, se actualiza automáticamente cuando el archivo Excel cambia, y distribuye los dashboards a toda la organización a través del navegador web o la app mobile, sin que cada usuario necesite tener Excel o Power BI Desktop instalado.

### Técnicas de integración práctica

**Excel → ChatGPT (manual — más accesible):**

1. Exporta la tabla resumen de Excel como CSV o copia directamente las celdas
2. Abre ChatGPT y pega los datos con el contexto del análisis
3. Usa el prompt: *"Aquí están los datos de producción de las últimas 4 semanas de nuestra planta en Ecuador: [datos]. Analiza: 1) Tendencia del OEE semanal, 2) Correlación entre fallos y turno de producción, 3) Top 3 causas de paradas. Genera: análisis narrativo de 200 palabras para el informe ejecutivo, código DAX para calcular el OEE en Power BI."*

**Excel → ChatGPT (automatizado con Apps Script):**

Para Google Sheets (la alternativa gratuita a Excel con Microsoft 365):

[Código javascript]
    function analizarDatosConChatGPT() {
      const hoja = SpreadsheetApp.getActiveSheet();
      const datos = hoja.getDataRange().getValues();
    
      const respuesta = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + PropertiesService.getScriptProperties().getProperty('OPENAI_KEY'),
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          model: 'gpt-4o',
          messages: [{
            role: 'user',
            content: 'Analiza estos datos de producción: ' + JSON.stringify(datos)
          }]
        })
      });
    
      const analisis = JSON.parse(respuesta.getContentText()).choices[0].message.content;
      hoja.getRange('M1').setValue(analisis);
    }
[/Código]

**Power BI → ChatGPT (narración automática con Power BI AI):**

Power BI tiene una funcionalidad nativa de "Smart Narrative" (Narrativa inteligente) que genera automáticamente texto descriptivo de un visual. Para funcionalidades más avanzadas, el Power BI Copilot (disponible en Microsoft 365 Copilot) puede:
- Generar resúmenes ejecutivos del dashboard
- Responder preguntas en lenguaje natural sobre los datos del informe
- Sugerir visualizaciones adicionales basándose en los datos

### Caso práctico: OEE mensual integrado

**Excel:** El supervisor de turno llena diariamente: tiempo disponible, paradas (tiempo + causa), velocidad real vs. nominal, unidades buenas vs. defectuosas.

**Power Query (Excel):** Consolida los 30 archivos diarios del mes en una sola tabla con columnas: Fecha, Turno, Tiempo_disponible, Tiempo_paradas, Velocidad_real, Velocidad_nominal, Unidades_buenas, Unidades_totales.

**ChatGPT:** Con la tabla consolidada, genera: Disponibilidad = (Tiempo_disp - Tiempo_paradas) / Tiempo_disp. Rendimiento = Velocidad_real / Velocidad_nominal. Calidad = Unidades_buenas / Unidades_totales. OEE = Disponibilidad × Rendimiento × Calidad. Análisis de causas de paradas con Pareto. Comparativo por turno y semana.

**Power BI:** Dashboard con el OEE diario, semanal y mensual en gráficas de línea. Semáforo de disponibilidad, rendimiento y calidad. Pareto de causas de paradas. Accesible desde el celular del gerente de planta en tiempo real.

### DAX: el lenguaje de cálculo de Power BI

ChatGPT puede escribir medidas DAX complejas que serían difíciles de crear sin conocer el lenguaje. Ejemplo:

**Prompt:** *"Necesito una medida DAX en Power BI que calcule el OEE mensual acumulado solo para el turno A. Los campos disponibles son: Disponibilidad, Rendimiento, Calidad y Turno."*

**ChatGPT genera:**

[Código dax]
    OEE_TurnoA =
    CALCULATE(
        AVERAGEX(
            VALUES('Produccion'[Fecha]),
            CALCULATE(
                [Disponibilidad] * [Rendimiento] * [Calidad]
            )
        ),
        'Produccion'[Turno] = "A"
    )
[/Código]

Sin DAX y sin ChatGPT, este cálculo requeriría conocimientos avanzados de Power BI. Con ChatGPT, el ingeniero industrial lo implementa en 2 minutos describiendo qué quiere en lenguaje natural.`,
    presentacionSlides: [
      { titulo: "El stack industrial: Excel → ChatGPT → Power BI", contenido: "Excel: captura y estructura de datos (donde ya viven los datos en planta). ChatGPT: análisis, interpretación y código. Power BI: visualización y distribución a la organización. Tres herramientas que el 80% de las empresas ya tienen o pueden acceder gratis." },
      { titulo: "Power Query: consolidar 30 archivos en segundos", contenido: "Datos → Obtener datos → Desde carpeta → Seleccionar carpeta con archivos Excel del mes. Power Query consolida automáticamente todos los archivos con estructura consistente. Sin fórmulas manuales, sin copiar y pegar. Actualización con un clic." },
      { titulo: "ChatGPT para análisis: 3 outputs clave", contenido: "1. Análisis narrativo para el informe ejecutivo (200 palabras listas para copiar). 2. Código DAX para implementar cálculos en Power BI. 3. Recomendaciones accionables basadas en patrones detectados. Un prompt, tres entregables." },
      { titulo: "Integración automática con Google Apps Script", contenido: "Google Sheets + Apps Script + API de OpenAI = análisis automático sin copiar/pegar. Botón en la hoja: 'Analizar con ChatGPT'. Resultado aparece en celda M1. Escalable a análisis diarios automáticos vía trigger temporal." },
      { titulo: "Power BI Smart Narrative: texto automático desde el visual", contenido: "En cualquier visual de Power BI: clic derecho → Agregar narrativa inteligente. Power BI genera automáticamente texto descriptivo del gráfico. Copilot (Microsoft 365) va más lejos: responde preguntas en lenguaje natural sobre el informe." },
      { titulo: "Caso OEE mensual integrado", contenido: "Excel: 30 archivos diarios de turno. Power Query: consolida en tabla maestra. ChatGPT: calcula OEE, analiza causas, genera código DAX. Power BI: dashboard desde el celular del gerente. Ciclo completo: Excel crudo → insight en tiempo real." },
      { titulo: "DAX con ChatGPT: de lenguaje natural a cálculo", contenido: "Prompt: 'Calcula el OEE mensual solo para el Turno A usando campos Disponibilidad, Rendimiento, Calidad, Turno.' ChatGPT genera la función CALCULATE + AVERAGEX + VALUES correctamente. El ingeniero la copia en Power BI y funciona." },
      { titulo: "Herramientas disponibles en Ecuador sin costo extra", contenido: "Microsoft 365 Business Basic ($6/usuario/mes): Excel Online + Power BI Pro incluido. Google Workspace: Google Sheets + Data Studio gratuito. ChatGPT gratuito (GPT-3.5) o ChatGPT Plus ($20/mes). Stack completo por <$30/mes/usuario." },
    ],
    quiz: [
      { pregunta: "¿Cuál es el rol de Power Query de Excel en el stack Excel → ChatGPT → Power BI?", opciones: ["Es el motor de visualización que genera los gráficos del dashboard", "Consolida automáticamente múltiples archivos o fuentes de datos en una tabla maestra estructurada, eliminando la necesidad de copiar y pegar manualmente", "Llama a la API de ChatGPT directamente desde Excel", "Reemplaza a Power BI para la visualización de KPIs"], respuesta: 1, explicacion: "Power Query es el motor de transformación de datos de Excel que permite conectar, consolidar y transformar datos de múltiples fuentes (30 archivos diarios, varias hojas, bases de datos) en una tabla maestra limpia y estructurada automáticamente, que luego sirve como input para ChatGPT y Power BI." },
      { pregunta: "¿Cuál es la ventaja principal de usar ChatGPT para generar código DAX para Power BI?", opciones: ["DAX es más fácil de aprender con ChatGPT que con la documentación oficial", "El ingeniero industrial puede describir en lenguaje natural qué cálculo necesita y obtener el código DAX correcto en segundos, sin necesidad de conocer la sintaxis del lenguaje", "ChatGPT puede conectarse directamente a Power BI para implementar el código automáticamente", "Power BI no tiene fórmulas propias, solo usa las que genera ChatGPT"], respuesta: 1, explicacion: "DAX (Data Analysis Expressions) tiene una sintaxis específica con funciones como CALCULATE, FILTER, VALUES que requieren experiencia para usar correctamente. ChatGPT permite describir el cálculo en lenguaje natural ('OEE mensual solo para Turno A') y obtener el código DAX funcional listo para copiar en Power BI." },
      { pregunta: "¿Qué hace la función 'Narrativa inteligente' de Power BI?", opciones: ["Traduce los datos del dashboard al idioma del usuario automáticamente", "Genera automáticamente texto descriptivo en lenguaje natural que explica las tendencias y valores clave de una visualización", "Conecta el informe de Power BI con ChatGPT para análisis avanzado", "Permite al usuario hacer preguntas de voz al dashboard"], respuesta: 1, explicacion: "La Narrativa inteligente (Smart Narrative) de Power BI analiza los datos de un visual y genera automáticamente un párrafo descriptivo que explica los puntos clave: valores más altos/bajos, tendencias principales, comparaciones relevantes. Es la capa de IA nativa de Power BI para comunicación de datos." },
      { pregunta: "En el caso del OEE mensual integrado, ¿por qué es importante que Excel use Power Query para consolidar los 30 archivos diarios en lugar de fórmulas manuales?", opciones: ["Power Query es obligatorio para conectar con Power BI", "Power Query actualiza automáticamente la tabla consolidada cuando se agregan nuevos archivos diarios, mientras que las fórmulas manuales requieren intervención humana cada día", "Las fórmulas manuales no pueden calcular el OEE correctamente", "Power Query funciona sin necesitar Excel instalado"], respuesta: 1, explicacion: "Power Query crea una conexión automática con la carpeta de archivos. Cuando se agrega el archivo del día siguiente, al hacer clic en 'Actualizar', Power Query detecta el nuevo archivo y lo incorpora automáticamente a la tabla consolidada. Esto elimina el trabajo diario de copiar y pegar datos manualmente." },
      { pregunta: "¿Cuál es el costo aproximado del stack completo Excel + ChatGPT + Power BI para un profesional en Ecuador?", opciones: ["Más de $500 al mes", "Gratis sin ningún costo", "Aproximadamente $20-30 al mes por usuario con las opciones de pago mínimas", "Requiere licencia empresarial de más de $1,000 al año"], respuesta: 2, explicacion: "Microsoft 365 Business Basic (~$6/mes) incluye Excel Online y Power BI Pro. ChatGPT Plus ($20/mes) agrega GPT-4. Total: ~$26/mes por usuario. Opción aún más económica: Google Workspace + Google Sheets gratuito + Google Looker Studio gratuito + ChatGPT gratuito (GPT-3.5) = prácticamente $0 adicionales." },
    ],
    ejercicio: {
      titulo: "Implementar el stack Excel → ChatGPT → Power BI para OEE",
      objetivo: "Construir el flujo completo de datos de producción desde Excel hasta un dashboard de Power BI, usando ChatGPT para el análisis intermedio y la generación de código DAX.",
      herramientas: "Excel con Power Query (Microsoft 365 u Office 2019+), ChatGPT o Claude, Power BI Desktop (gratuito, powerbi.microsoft.com)",
      pasos: [
        "Prepara en Excel 4 archivos simulando datos diarios de una semana (lunes a jueves). Cada archivo debe tener: Turno, Tiempo_disponible_min, Tiempo_paradas_min, Velocidad_real_unid_min, Velocidad_nominal_unid_min, Unidades_buenas, Unidades_totales. Incluye variación entre turnos para hacer el análisis interesante.",
        "Usa Power Query para consolidar los 4 archivos: Datos → Obtener datos → Desde carpeta. Selecciona la carpeta donde guardaste los 4 archivos. Power Query detecta y consolida automáticamente. Agrega una columna calculada 'OEE' = (Tiempo_disp-Tiempo_paradas)/Tiempo_disp × Vel_real/Vel_nominal × Unid_buenas/Unid_totales. Cierra y carga la tabla consolidada.",
        "Copia la tabla consolidada (máximo 30 filas) y pégala en ChatGPT. Usa el prompt: 'Aquí están mis datos de producción semanal. Analiza: 1) OEE promedio por turno y día, 2) Cuál es el principal componente que reduce el OEE (disponibilidad, rendimiento o calidad), 3) Genera el análisis narrativo para el informe semanal (150 palabras). 4) Escribe las medidas DAX para Power BI: OEE_Promedio, OEE_TurnoA, OEE_TurnoB, OEE_TurnoC.'",
        "Instala Power BI Desktop (gratuito en powerbi.microsoft.com/desktop). Conecta con el archivo Excel: Obtener datos → Excel. Importa la tabla consolidada de Power Query.",
        "En Power BI, crea las medidas DAX que ChatGPT generó. Construye el dashboard con: gráfico de línea con OEE diario por turno, tarjetas con OEE promedio por turno, gráfico de barras de los 3 componentes (disponibilidad, rendimiento, calidad). Agrega la Narrativa inteligente para el resumen automático.",
        "Exporta una captura del dashboard completo. Compara el análisis de ChatGPT con lo que ves visualmente en Power BI. ¿Coinciden las conclusiones? ¿Qué acción concreta tomarías basándote en este análisis para mejorar el OEE la próxima semana?",
      ],
      resultado: "Archivos Excel consolidados con Power Query, análisis de ChatGPT documentado con medidas DAX, dashboard de Power BI funcional con captura de pantalla y recomendación accionable.",
      criterios: [
        { criterio: "Power Query consolidando 4 archivos correctamente con columna OEE calculada", puntos: 25 },
        { criterio: "Prompt bien construido y análisis de ChatGPT con medidas DAX documentadas", puntos: 30 },
        { criterio: "Dashboard de Power BI funcionando con los 3 visuales requeridos y medidas DAX implementadas", puntos: 30 },
        { criterio: "Recomendación accionable de mejora fundamentada en el análisis del dashboard", puntos: 15 },
      ],
    },
    recursos: [
      { titulo: "Power BI Desktop — Descarga gratuita", url: "https://powerbi.microsoft.com/es-es/desktop/", tipo: "herramienta", descripcion: "Descarga gratuita de Power BI Desktop para crear dashboards profesionales conectados a Excel, bases de datos y servicios en la nube." },
      { titulo: "DAX Guide — Referencia completa de funciones DAX", url: "https://dax.guide/", tipo: "documentacion", descripcion: "Referencia completa y gratuita de todas las funciones DAX de Power BI con ejemplos, anotaciones y casos de uso." },
      { titulo: "Microsoft Learn — Power Query Tutorial", url: "https://learn.microsoft.com/es-es/power-query/power-query-what-is-power-query", tipo: "documentacion", descripcion: "Tutorial oficial de Microsoft en español sobre Power Query: cómo consolidar datos de múltiples fuentes en Excel y Power BI." },
    ],
  },

  {
    id: 38,
    titulo: "Copilot Excel avanzado para ingeniería industrial",
    modulo: MOD8,
    moduloNum: 8,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Copilot Excel avanzado para ingeniería industrial",
    teoria: `## Copilot en Excel: el asistente de IA que vive dentro de tu hoja de cálculo

Microsoft 365 Copilot en Excel representa una evolución cualitativa en el uso de hojas de cálculo para ingeniería industrial. A diferencia de ChatGPT (al que debes llevar los datos externamente), Copilot vive dentro de Excel, tiene acceso directo a todos los datos de la hoja activa y puede realizar análisis complejos, crear fórmulas, generar gráficas y escribir código Python directamente en el contexto de tu trabajo.

### ¿Qué puede hacer Copilot en Excel?

**Análisis de datos en lenguaje natural:**
Selecciona una tabla con datos de producción y escribe en el panel de Copilot: "¿Qué turno tiene el mayor número de paradas por mantenimiento?" o "Muéstrame la correlación entre la temperatura y los defectos de calidad". Copilot analiza la tabla y responde con texto e, cuando aplica, crea automáticamente una gráfica o tabla dinámica que visualiza la respuesta.

**Generación de fórmulas complejas:**
Describe en lenguaje natural qué quieres calcular: "Calcula el MAPE del pronóstico comparando la columna B (pronóstico) con la columna C (real), mostrando el porcentaje de error para cada fila y el promedio total". Copilot genera la fórmula exacta de Excel lista para usar.

**Python en Excel (nativo desde 2024):**
Una de las funcionalidades más revolucionarias: Copilot puede escribir código Python que se ejecuta directamente dentro de Excel sin instalación adicional. El ingeniero describe el análisis en lenguaje natural y Copilot escribe y ejecuta el código:

*"Entrena un modelo de regresión lineal con los datos de las columnas A-F para predecir la variable de la columna G. Muestra los coeficientes, R² y grafíca la línea de regresión."*

Copilot genera el código scikit-learn equivalente, lo ejecuta en la nube de Microsoft y devuelve los resultados directamente en la hoja de Excel.

**Identificación de tendencias e insights:**
Al hacer clic en "Identificar insights" sobre un dataset, Copilot analiza automáticamente y lista los patrones más relevantes: "El Turno C tiene un OEE 12% menor que los otros turnos. Los lunes muestran consistentemente más paradas no planificadas. La velocidad de la línea 2 ha disminuido 8% en las últimas 4 semanas."

**Limpieza y transformación de datos:**
"Elimina las filas donde la columna de OEE esté en blanco. Convierte los valores de la columna de fecha al formato DD/MM/YYYY. Agrega una columna que clasifique cada registro como 'Turno A', 'Turno B' o 'Turno C' según los valores de la columna de hora de inicio."

### Casos de uso avanzados para ingeniería industrial

**Análisis de regresión para parámetros de proceso:**
"Analiza si existe correlación estadística entre la presión de laminación (columna B), la temperatura del rodillo (columna C) y el grosor final de la lámina (columna D). Identifica cuál variable tiene mayor influencia y calcula el coeficiente de determinación R²."

**Optimización de turnos con datos históricos:**
"Con los datos de los últimos 3 meses, identifica las 5 combinaciones de [turno + máquina + producto] que producen mayor número de defectos. Para cada combinación, muestra también el MTBF del equipo en ese turno y la experiencia promedio del operador."

**Análisis de varianza (ANOVA) simplificado:**
"Determina si hay diferencia estadísticamente significativa en el OEE promedio entre los tres turnos (A, B, C) usando los datos de la hoja. Explica el resultado en lenguaje no estadístico para presentarlo a la gerencia."

### Limitaciones y buenas prácticas

**Limitación 1 — Disponibilidad:**
Microsoft 365 Copilot requiere licencia Copilot ($30/usuario/mes adicional sobre Microsoft 365). En Ecuador, el acceso es a través de distribuidores Microsoft locales. Para uso educativo, muchas universidades tienen acuerdos que incluyen Copilot.

**Limitación 2 — Datos sensibles:**
Los datos ingresados en Copilot se procesan en los servidores de Microsoft Azure. Para datos extremadamente confidenciales (fórmulas propietarias, precios de contratos), evaluar si es apropiado según la política de datos de la empresa.

**Limitación 3 — Verificación siempre necesaria:**
Copilot puede cometer errores en fórmulas complejas o análisis estadísticos avanzados. Siempre verificar los resultados de Copilot con lógica de ingeniería antes de tomar decisiones basadas en ellos. Copilot es un asistente, no un árbitro.

**Buena práctica — Prompt iterativo:**
Si la primera respuesta de Copilot no es exactamente lo que necesitas, refina el prompt: "El cálculo anterior está bien pero necesito que también muestre el intervalo de confianza del 95% para cada predicción". Copilot puede refinar su output conversacionalmente.

### Alternativa gratuita: Claude + Google Colab

Para quienes no tienen acceso a Copilot, la alternativa gratuita de igual potencia es:
1. Exportar los datos de Excel a CSV
2. Subir el CSV a Claude (que acepta archivos adjuntos con suscripción Pro)
3. Hacer el análisis conversacionalmente en Claude, que generará código Python ejecutable en Google Colab
4. Copiar los resultados de vuelta a Excel

Esta alternativa requiere más pasos pero es completamente gratuita con las versiones base de las herramientas.`,
    presentacionSlides: [
      { titulo: "Copilot en Excel: IA que vive en tu hoja de cálculo", contenido: "Acceso directo a todos los datos de la hoja activa. Análisis en lenguaje natural sin exportar. Genera fórmulas complejas desde descripción. Python en Excel (sin instalación). Identifica insights automáticamente. Requiere Microsoft 365 Copilot ($30/usuario/mes extra)." },
      { titulo: "Las 5 capacidades más poderosas para ingeniería industrial", contenido: "1. Análisis de correlación entre parámetros de proceso. 2. Generación de fórmulas MAPE, Cp/Cpk, MTBF desde descripción natural. 3. Python en Excel para regresión y ML. 4. Insights automáticos (turno con peor OEE, tendencias). 5. Limpieza de datos conversacional." },
      { titulo: "Python en Excel: ML sin instalar nada", contenido: "Copilot escribe el código Python (scikit-learn, pandas, matplotlib) que se ejecuta en la nube de Microsoft. El ingeniero describe: 'Entrena un modelo de regresión para predecir defectos desde temperatura y velocidad.' Copilot genera, ejecuta y devuelve resultados en la hoja." },
      { titulo: "Análisis de varianza (ANOVA) en lenguaje natural", contenido: "'¿Hay diferencia significativa en OEE entre los tres turnos?' Copilot ejecuta el ANOVA, interpreta el p-value y entrega la conclusión en lenguaje para gerencia: 'Sí existe diferencia estadísticamente significativa. El Turno B tiene un OEE 11% menor (p=0.003).'" },
      { titulo: "Alternativa gratuita sin Copilot", contenido: "Claude Pro acepta archivos CSV adjuntos. Google Colab ejecuta Python gratis. Flujo: Excel → CSV → subir a Claude → análisis conversacional → código Python en Colab → resultados de vuelta a Excel. Más pasos, igual potencia, sin costo adicional." },
      { titulo: "Buenas prácticas de prompts en Copilot Excel", contenido: "Ser específico con las columnas: 'columna B (vibración)' en lugar de 'los datos de vibración'. Pedir el formato de salida: 'como tabla', 'como gráfica', 'como fórmula'. Iterar: 'el análisis anterior está bien pero agrega el intervalo de confianza del 95%'." },
      { titulo: "Limitaciones importantes a recordar", contenido: "Copilot puede cometer errores en fórmulas avanzadas. Verificar SIEMPRE con lógica de ingeniería. Datos confidenciales → revisar política de seguridad antes de usar. Disponibilidad: $30/usuario/mes extra. En Ecuador: distribuidores Microsoft locales." },
      { titulo: "Casos clave para el ingeniero industrial ecuatoriano", contenido: "OEE por turno/máquina/producto: análisis que tomaría 2h manual → 5 min con Copilot. Correlación parámetros de proceso: sin saber estadística avanzada. Pronóstico con ML integrado. Reporte ejecutivo desde datos brutos. Identificar outliers en producción." },
    ],
    quiz: [
      { pregunta: "¿Cuál es la diferencia fundamental entre usar Copilot en Excel vs. ChatGPT para analizar datos industriales?", opciones: ["No hay diferencia práctica; ambos analizan datos de la misma manera", "Copilot en Excel accede directamente a los datos de la hoja activa sin necesidad de exportarlos o copiarlos; ChatGPT requiere que el usuario lleve los datos externamente al chat", "ChatGPT tiene mayor precisión en análisis estadísticos que Copilot", "Copilot solo funciona para datos de ventas, no para datos industriales"], respuesta: 1, explicacion: "Copilot vive dentro de Excel y tiene acceso directo al contexto completo de la hoja activa: todas las tablas, nombres de columnas, fórmulas existentes. ChatGPT requiere que el usuario exporte o copie los datos manualmente al chat. Esta diferencia de contexto hace a Copilot significativamente más conveniente para análisis iterativos." },
      { pregunta: "¿Qué permite la funcionalidad de 'Python en Excel' disponible con Copilot?", opciones: ["Ejecutar scripts de Python previamente escritos en un IDE externo", "Escribir y ejecutar código Python (pandas, scikit-learn, matplotlib) directamente dentro de Excel sin instalación adicional, con los resultados devueltos a la hoja", "Conectar Excel con un servidor Python externo de la empresa", "Solo generar gráficos de Python que se insertan como imágenes en Excel"], respuesta: 1, explicacion: "Python en Excel (disponible desde 2024) ejecuta código Python en la nube de Microsoft Fabric directamente desde una celda de Excel. Copilot puede escribir el código (regresión, clustering, análisis de series de tiempo) y los resultados aparecen en la hoja como valores o gráficas, sin necesidad de instalar Python ni Jupyter." },
      { pregunta: "¿Qué limitación es más importante considerar al usar Copilot Excel con datos de producción sensibles en una empresa ecuatoriana?", opciones: ["Copilot solo funciona con datos en inglés", "Los datos procesados por Copilot se envían a servidores de Microsoft Azure, por lo que datos extremadamente confidenciales deben evaluarse bajo la política de seguridad de datos de la empresa", "Copilot no puede analizar más de 100 filas de datos", "Copilot en Excel solo está disponible en Windows, no en Mac"], respuesta: 1, explicacion: "Copilot procesa los datos en los servidores de Microsoft Azure. Para la mayoría de los datos de producción esto es aceptable (Microsoft tiene certificaciones ISO 27001 y SOC 2). Sin embargo, para datos que incluyan secretos industriales, fórmulas propietarias o información contractual sensible, la empresa debe evaluar si está cómoda con el procesamiento en la nube." },
      { pregunta: "¿Cuál es la alternativa gratuita a Copilot Excel para análisis estadístico avanzado en datos de producción?", opciones: ["No existe alternativa gratuita con capacidades similares", "Exportar datos a CSV → subir a Claude Pro (que acepta archivos adjuntos) → análisis conversacional → código Python ejecutable en Google Colab gratuito", "Usar solo las funciones estadísticas nativas de Excel sin IA", "Descargar Power BI Desktop que incluye Copilot gratuito"], respuesta: 1, explicacion: "La alternativa gratuita de igual potencia: Claude Pro acepta archivos CSV adjuntos, puede analizar los datos conversacionalmente y generar código Python ejecutable en Google Colab (completamente gratuito). Requiere más pasos que Copilot en Excel pero ofrece capacidades análogas sin costo de licencia adicional." },
      { pregunta: "Un ingeniero industrial describe en Copilot Excel: 'Determina si hay diferencia estadísticamente significativa en el número de defectos entre los tres turnos'. ¿Qué análisis estadístico debería ejecutar Copilot?", opciones: ["Una regresión lineal simple entre turno y número de defectos", "Un análisis de varianza (ANOVA) de un factor para comparar las medias de defectos entre tres grupos independientes (turnos)", "Un análisis de correlación de Pearson entre turno y defectos", "Un gráfico de control SPC para comparar los tres turnos"], respuesta: 1, explicacion: "Para comparar las medias de una variable continua (número de defectos) entre tres grupos independientes (Turno A, B, C), el análisis estadístico correcto es el ANOVA (Analysis of Variance) de un factor. El resultado es un valor-p: si p<0.05, las diferencias son estadísticamente significativas y no debidas al azar." },
    ],
    ejercicio: {
      titulo: "Análisis avanzado con Copilot Excel (o Claude como alternativa)",
      objetivo: "Usar Copilot Excel o Claude para realizar análisis de correlación entre parámetros de proceso, generar fórmulas complejas automáticamente e identificar insights accionables en datos industriales.",
      herramientas: "Excel con Microsoft 365 Copilot (o alternativa gratuita: Claude Pro con archivo adjunto + Google Colab)",
      pasos: [
        "Prepara un dataset de proceso industrial en Excel con 60 registros y estas columnas: Fecha, Turno (A/B/C), Temperatura_proceso (°C), Velocidad_linea (m/min), Presion_hidraulica (bar), Num_defectos, OEE (%).",
        "Si tienes Copilot Excel: selecciona la tabla completa y usa el panel de Copilot para preguntar: (a) '¿Cuál de las tres variables de proceso (temperatura, velocidad, presión) tiene mayor correlación con el número de defectos?' (b) 'Crea una columna que calcule el índice de eficiencia combinado: OEE × (1 - Num_defectos/100)'. (c) '¿Hay diferencia estadísticamente significativa en el OEE entre los tres turnos? Explica para un gerente no técnico.'",
        "Si usas Claude como alternativa: exporta el dataset a CSV. En Claude, adjunta el CSV y usa prompts equivalentes. Para el análisis de correlación, pide que genere código Python ejecutable en Google Colab. Ejecuta el código en colab.research.google.com y copia los resultados de vuelta a Excel.",
        "Genera la fórmula de MAPE usando Copilot/Claude: 'Escribe la fórmula de Excel para calcular el MAPE entre la columna de OEE real y la columna de OEE objetivo (que es 85% constante), mostrando el error porcentual absoluto para cada fila y el promedio en la última fila.'",
        "Usa Copilot/Claude para identificar los 5 registros con mayor número de defectos. Para cada uno, pide que identifique si existe algún patrón en las variables de proceso que los diferencie de los registros con pocos defectos.",
        "Elabora un resumen ejecutivo de 200 palabras usando Copilot/Claude: 'Basándote en el análisis completo de este dataset de producción, redacta el párrafo de conclusiones para el informe mensual del jefe de producción, destacando los 3 hallazgos más importantes y las 2 acciones prioritarias.'",
      ],
      resultado: "Dataset analizado con correlaciones calculadas, fórmula MAPE implementada, análisis de varianza entre turnos documentado y resumen ejecutivo generado con Copilot o Claude.",
      criterios: [
        { criterio: "Dataset preparado correctamente con 60 registros y las 7 columnas requeridas", puntos: 15 },
        { criterio: "Análisis de correlación realizado con identificación de la variable de mayor influencia", puntos: 25 },
        { criterio: "Fórmula MAPE implementada correctamente con Copilot/Claude", puntos: 25 },
        { criterio: "Análisis de varianza entre turnos con interpretación para gerencia no técnica", puntos: 20 },
        { criterio: "Resumen ejecutivo de 200 palabras con hallazgos y acciones", puntos: 15 },
      ],
    },
    recursos: [
      { titulo: "Microsoft Learn — Copilot in Excel", url: "https://learn.microsoft.com/es-es/copilot/microsoft-365/microsoft-365-copilot-excel", tipo: "documentacion", descripcion: "Documentación oficial de Microsoft en español sobre Copilot en Excel: funcionalidades, requisitos y guías de uso paso a paso." },
      { titulo: "Python in Excel — Microsoft Documentation", url: "https://support.microsoft.com/en-us/office/introduction-to-python-in-excel-55643c2e-ff56-4168-b1ce-9428c8308545", tipo: "documentacion", descripcion: "Guía oficial de Microsoft para usar Python directamente dentro de Excel, incluyendo bibliotecas disponibles y ejemplos de análisis de datos." },
      { titulo: "Google Colab — Entorno Python gratuito", url: "https://colab.research.google.com/", tipo: "herramienta", descripcion: "Alternativa gratuita a Python en Excel. Ejecuta notebooks Python en la nube de Google con acceso a pandas, scikit-learn, matplotlib y más." },
    ],
  },

  {
    id: 39,
    titulo: "Proyecto integrador: diagnóstico IA de tu empresa",
    modulo: MOD8,
    moduloNum: 8,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Proyecto integrador: diagnóstico IA de tu empresa",
    teoria: `## El proyecto integrador: convertir el aprendizaje en transformación real

El proyecto integrador es el punto culminante del curso. No es un ejercicio teórico sino un diagnóstico real de tu empresa (o de una empresa que conozcas) usando todas las herramientas y metodologías aprendidas en los 8 módulos. El objetivo es demostrar que puedes aplicar la IA de forma integral para resolver problemas industriales reales, no solo manejar herramientas en aislamiento.

### ¿Qué es un diagnóstico IA de empresa industrial?

Un diagnóstico IA es una evaluación sistemática de los procesos industriales de una empresa, usando herramientas de inteligencia artificial para:

1. **Identificar las oportunidades de mejora más valiosas** (donde la IA puede tener mayor impacto)
2. **Cuantificar el potencial de mejora** (en términos de ahorro de costos, mejora de calidad, reducción de tiempo)
3. **Proponer el roadmap de implementación** (qué implementar primero, segundo y tercero, con qué herramientas y qué inversión)

### Los 5 áreas de análisis del diagnóstico

**Área 1 — Producción y OEE:**
¿Cuál es el OEE actual? ¿Cuáles son los componentes que más lo reducen (disponibilidad, rendimiento o calidad)? ¿Cuáles son las principales causas de paradas? ¿Cómo se podría mejorar el OEE con las herramientas aprendidas (análisis de restricciones, chatGPT para diagnóstico, Power BI para monitoreo)?

**Área 2 — Calidad:**
¿Cuál es la tasa de defectos actual? ¿Existe un sistema SPC o los procesos no están bajo control estadístico? ¿Cuál es el Cpk de los procesos críticos? ¿Qué herramientas de calidad (SPC, Pareto, análisis de capacidad) están ausentes o son manuales y podrían automatizarse con IA?

**Área 3 — Mantenimiento:**
¿Se hace mantenimiento correctivo, preventivo o predictivo? ¿Cuál es el MTBF y MTTR de los equipos críticos? ¿Hay datos de sensores disponibles o solo datos de fallas registradas? ¿Cuál sería el ROI de implementar monitoreo predictivo?

**Área 4 — Cadena de suministro:**
¿Cómo se hacen los pronósticos de demanda actualmente? ¿Qué MAPE tienen? ¿Existe clasificación ABC/XYZ del inventario? ¿Se usa EOQ para definir los lotes de compra? ¿Cuántos ítems están en categoría AZ (alto valor, alta variabilidad) sin política de gestión específica?

**Área 5 — Automatización e integración:**
¿Qué procesos manuales repetitivos existen (reportes, análisis, alertas) que podrían automatizarse con n8n, Python o el stack Excel → ChatGPT → Power BI? ¿Qué datos existen pero no se están usando para tomar decisiones?

### Metodología del diagnóstico: el proceso de 6 pasos

**Paso 1 — Recolección de datos:**
Entrevistar al gerente de planta, jefe de producción, jefe de calidad y jefe de mantenimiento (o tú mismo si trabajas en esas áreas). Recopilar los datos disponibles: registros de producción, hojas de control de calidad, órdenes de mantenimiento, registros de inventario.

**Paso 2 — Análisis con herramientas aprendidas:**
Aplicar cada metodología del curso a los datos recolectados: calcular el OEE real, construir el Pareto de defectos, calcular el MTBF de los equipos críticos, hacer la clasificación ABC/XYZ del inventario, calcular el EOQ para los ítems A.

**Paso 3 — Asistencia con IA para el análisis:**
Para cada área, usar ChatGPT o Claude para profundizar el análisis. "Aquí están los datos de defectos de mi planta de [sector] en Ecuador. Identifica las 3 oportunidades de mejora de calidad más impactantes y cuantifica el ahorro potencial para cada una." "Analiza mi cadena de suministro basándote en estos indicadores. ¿Qué herramienta de IA tendría el mayor impacto en reducir los costos de inventario?"

**Paso 4 — Cuantificación de oportunidades:**
Para cada oportunidad identificada, estimar: el impacto en ahorro de costos (USD/mes), el esfuerzo de implementación (bajo/medio/alto) y el tiempo para ver resultados (semanas/meses). Este análisis costo-beneficio es la base del roadmap.

**Paso 5 — Roadmap de implementación:**
Priorizar las oportunidades por: impacto × facilidad de implementación. Las de alto impacto y bajo esfuerzo son las "victorias rápidas" (Quick Wins) para implementar en el primer mes. Las de alto impacto y mayor esfuerzo son los proyectos estratégicos del trimestre.

**Paso 6 — Presentación ejecutiva:**
El diagnóstico se entrega como un documento de 8-12 páginas con: resumen ejecutivo (1 página), análisis por área (1 página cada una), roadmap visual con timeline, análisis costo-beneficio total, y próximos 3 pasos concretos con responsables y fechas.

### Claude como asistente principal del diagnóstico

Claude es especialmente adecuado para el diagnóstico integrado porque puede:
1. Mantener el contexto de toda la conversación (empresa, sector, datos, hallazgos anteriores)
2. Integrar información de múltiples áreas para identificar conexiones que el análisis aislado pierde
3. Generar el documento de diagnóstico completo desde los datos recolectados

**Prompt inicial del diagnóstico:**
*"Voy a realizar el diagnóstico IA de mi empresa. Te voy a dar información de las 5 áreas de análisis en los próximos mensajes. Después de recibir toda la información, me ayudarás a: (1) identificar las 3 principales oportunidades de mejora con IA, (2) cuantificar el ahorro potencial de cada una, (3) proponer el roadmap de implementación con Quick Wins y proyectos estratégicos. ¿Estás listo para empezar? Empiezo con el área de Producción y OEE."*`,
    presentacionSlides: [
      { titulo: "El proyecto integrador: del aprendizaje a la transformación", contenido: "No es un ejercicio teórico. Es un diagnóstico real de tu empresa usando todos los módulos del curso. Objetivo: identificar oportunidades de mejora, cuantificarlas en USD y proponer el roadmap de implementación." },
      { titulo: "Las 5 áreas del diagnóstico IA", contenido: "1. Producción y OEE: ¿cuánto se pierde en paradas y velocidad reducida? 2. Calidad: ¿existe SPC? ¿cuál es el Cpk? 3. Mantenimiento: ¿predictivo o solo correctivo? 4. Cadena de suministro: ¿MAPE del pronóstico? ¿EOQ implementado? 5. Automatización: ¿qué procesos manuales son automatizables?" },
      { titulo: "Metodología: 6 pasos del diagnóstico", contenido: "1. Recolectar datos (entrevistas + registros existentes). 2. Analizar con herramientas del curso (OEE, Pareto, MTBF, ABC/XYZ, EOQ). 3. Profundizar con ChatGPT/Claude. 4. Cuantificar oportunidades en USD/mes. 5. Priorizar por impacto × facilidad. 6. Presentación ejecutiva 8-12 páginas." },
      { titulo: "Quick Wins vs. Proyectos Estratégicos", contenido: "Quick Wins: alto impacto + bajo esfuerzo = implementar en el primer mes. Ejemplo: automatizar el reporte diario de calidad con n8n. Proyectos estratégicos: alto impacto + mayor esfuerzo = trimestre. Ejemplo: implementar SPC completo con límites de control." },
      { titulo: "Cuantificar el ahorro: el lenguaje de la gerencia", contenido: "Producción: OEE actual 72% → objetivo 80% = +8% de capacidad. A $1,000/h de producción → $160,000/año adicionales. Calidad: defectos 5% → 1.5% con SPC = 3.5% menos reproceso → ahorro en materiales y tiempo. Los números justifican la inversión." },
      { titulo: "Prompt inicial del diagnóstico con Claude", contenido: "Iniciar la sesión con el contexto completo de la empresa. Enviar datos de cada área en mensajes separados. Al final pedir: (1) top 3 oportunidades, (2) ahorro cuantificado, (3) roadmap con timeline y responsables. Claude mantiene el contexto completo de la conversación." },
      { titulo: "El entregable final: 8-12 páginas ejecutivas", contenido: "Resumen ejecutivo (1 página) con hallazgo principal y ahorro total potencial. Análisis por área (5 páginas). Roadmap visual con timeline (1 página). Análisis costo-beneficio total (1 página). Próximos 3 pasos con responsables y fechas (1 página)." },
      { titulo: "¿Por qué este proyecto es tu mejor carta de presentación?", contenido: "Demuestra no solo conocer herramientas de IA sino saber aplicarlas a problemas reales de ingeniería industrial. El diagnóstico con datos reales de tu empresa vale más que cualquier certificado. Es el puente entre el curso y el impacto profesional real." },
    ],
    quiz: [
      { pregunta: "¿Cuál es el objetivo principal del diagnóstico IA de empresa industrial?", opciones: ["Demostrar que se conocen todas las herramientas de IA del curso", "Identificar las oportunidades de mejora más valiosas con IA, cuantificarlas en términos económicos y proponer el roadmap de implementación", "Generar el manual de calidad de la empresa con IA", "Reemplazar al personal de producción con sistemas automatizados"], respuesta: 1, explicacion: "El diagnóstico IA no es un ejercicio académico: es una evaluación sistemática de los procesos industriales que identifica dónde la IA puede tener mayor impacto económico, cuantifica ese impacto en USD y prioriza las acciones de implementación para que la gerencia pueda tomar decisiones de inversión." },
      { pregunta: "¿Qué diferencia a una 'Victoria Rápida' (Quick Win) de un 'Proyecto Estratégico' en el roadmap del diagnóstico?", opciones: ["Las victorias rápidas solo se pueden hacer con herramientas gratuitas", "Las victorias rápidas tienen alto impacto y bajo esfuerzo de implementación (primeras en ejecutar); los proyectos estratégicos tienen alto impacto pero requieren mayor esfuerzo y tiempo", "Las victorias rápidas son las de menor impacto económico", "No hay diferencia práctica entre ambos tipos de iniciativas"], respuesta: 1, explicacion: "La priorización por impacto × facilidad identifica las Quick Wins: iniciativas de alto valor que se pueden implementar rápidamente (primer mes) con recursos existentes. Los proyectos estratégicos requieren más inversión, tiempo y coordinación pero tienen impacto transformacional a mediano plazo." },
      { pregunta: "¿Por qué Claude es especialmente adecuado para asistir en el diagnóstico integrado de empresa vs. ChatGPT?", opciones: ["Claude es más barato que ChatGPT", "Claude puede mantener el contexto de toda la conversación del diagnóstico (empresa, datos de las 5 áreas, hallazgos de cada análisis) e integrar la información para identificar conexiones entre áreas", "ChatGPT no puede analizar datos industriales", "Claude tiene integración nativa con sistemas ERP industriales"], respuesta: 1, explicacion: "Claude tiene una ventana de contexto extensa que permite mantener coherencia a través de una conversación larga de diagnóstico (empresa, sector, datos de producción, calidad, mantenimiento, cadena de suministro, automatización) e integrar la información de todas las áreas para identificar conexiones que el análisis aislado pierde." },
      { pregunta: "¿Cuál es la estructura recomendada para el entregable del diagnóstico IA?", opciones: ["Una presentación de PowerPoint de 50 diapositivas con todos los gráficos", "Un documento de 8-12 páginas con: resumen ejecutivo, análisis por área (5), roadmap visual, análisis costo-beneficio y próximos 3 pasos con responsables", "Solo un correo electrónico con las conclusiones principales", "Un dashboard de Power BI sin texto narrativo"], respuesta: 1, explicacion: "El diagnóstico debe ser lo suficientemente completo para sustentar decisiones de inversión pero conciso para que los tomadores de decisión lo lean. 8-12 páginas con el resumen ejecutivo al frente, análisis por área, roadmap visual y próximos pasos concretos es el formato ejecutivo estándar para presentaciones de mejora industrial." },
      { pregunta: "Si el OEE actual de una planta es 68% y el objetivo con mejoras de IA es 78%, ¿cómo se cuantifica el ahorro potencial si la planta opera 16 horas/día, 25 días/mes y el costo de oportunidad de producción es $800/hora?", opciones: ["Ahorro = (78% - 68%) × $800 = $80/hora", "Ahorro mensual = (0.78 - 0.68) × 16h/día × 25 días × $800/h = $32,000/mes de capacidad productiva adicional", "Ahorro = 10% de $800 = $80/día", "No se puede cuantificar sin conocer el número de productos"], respuesta: 1, explicacion: "Ahorro mensual = ΔoEE × horas/mes × costo/hora = (0.78-0.68) × (16×25)h × $800 = 0.10 × 400h × $800 = $32,000/mes de capacidad productiva recuperada. Este es el valor anualizable para el análisis costo-beneficio de la inversión en herramientas de IA." },
    ],
    ejercicio: {
      titulo: "Diagnóstico IA: 5 áreas de análisis con Claude",
      objetivo: "Realizar un diagnóstico IA completo de tu empresa o un caso industrial ecuatoriano, identificar las 3 principales oportunidades de mejora cuantificadas en USD y proponer el roadmap de implementación.",
      herramientas: "Claude.ai (claude.ai/chat), Word o Google Docs para el documento final, Excel para los análisis cuantitativos",
      pasos: [
        "Define el contexto empresarial. Opción A: usa tu empresa actual. Opción B: usa este caso: Empresa ALIMECUADOR S.A., procesadora de snacks en Quito. 45 empleados. OEE actual: 71%. Tasa de defectos: 4.8%. Mantenimiento: 100% correctivo. Pronóstico de demanda: Excel mensual manual con MAPE estimado ~25%. Sin clasificación ABC/XYZ. Sin dashboards de KPIs. 3 reportes manuales diarios de 45 min cada uno.",
        "Inicia el diagnóstico con Claude con el prompt: 'Voy a realizar el diagnóstico IA de ALIMECUADOR S.A. (o tu empresa). Te enviaré datos de 5 áreas. Después identificarás las 3 principales oportunidades de mejora con IA, cuantificarás el ahorro potencial en USD/mes para cada una y propondrás el roadmap de implementación. ¿Listo? Comienzo con Producción: OEE=71%, principales paradas: [descripción], turno con peor rendimiento: [turno C, OEE=63%].'",
        "Envía los datos de las 5 áreas a Claude en mensajes separados (Producción, Calidad, Mantenimiento, Cadena de suministro, Automatización). Para cada área, incluye los datos numéricos disponibles y pide a Claude que calcule el indicador principal (OEE real, MTBF, MAPE estimado, etc.).",
        "Una vez enviadas las 5 áreas, pide a Claude: 'Basándote en el análisis completo de las 5 áreas, identifica: (1) Las 3 principales oportunidades de mejora ordenadas por impacto económico. (2) Para cada oportunidad: ahorro mensual estimado en USD, herramienta de IA a usar, esfuerzo de implementación (bajo/medio/alto), tiempo para ver resultados. (3) Roadmap con Quick Wins (primer mes) y proyectos estratégicos (trimestre 1 y trimestre 2).'",
        "Con el output de Claude, construye el documento de diagnóstico en Word/Google Docs siguiendo la estructura: portada, resumen ejecutivo (1 pág.), análisis por área (1 pág. cada una), roadmap visual, análisis costo-beneficio total (suma de ahorros vs. inversión estimada), próximos 3 pasos con responsables y fechas.",
        "Calcula el ROI total del programa: suma todos los ahorros mensuales de las oportunidades identificadas. Estima el costo de implementación (herramientas, tiempo de ingeniería, capacitación). Calcula el período de recuperación de la inversión: Inversión / Ahorro mensual = N meses.",
      ],
      resultado: "Documento de diagnóstico de 8-12 páginas con análisis de 5 áreas, 3 oportunidades cuantificadas en USD, roadmap de implementación y cálculo de ROI del programa.",
      criterios: [
        { criterio: "Diálogo con Claude documentado con datos reales o coherentes de empresa ecuatoriana", puntos: 20 },
        { criterio: "Análisis cuantitativo de las 5 áreas con indicadores calculados (OEE, MTBF, MAPE, ABC/XYZ)", puntos: 25 },
        { criterio: "3 oportunidades identificadas con ahorro cuantificado, herramienta de IA y esfuerzo estimados", puntos: 25 },
        { criterio: "Roadmap con Quick Wins y proyectos estratégicos + cálculo de ROI total del programa", puntos: 30 },
      ],
    },
    recursos: [
      { titulo: "Claude.ai — Asistente para diagnóstico empresarial integral", url: "https://claude.ai/chat", tipo: "herramienta", descripcion: "Interfaz web de Claude para el diagnóstico integrado. La suscripción Pro permite conversaciones largas con contexto completo del análisis." },
      { titulo: "McKinsey — AI in Manufacturing Report", url: "https://www.mckinsey.com/industries/advanced-electronics/our-insights/smart-manufacturing-and-industry-4-0", tipo: "lectura", descripcion: "Informe de McKinsey sobre la adopción de IA en manufactura con benchmarks de ROI por caso de uso, útil para validar los ahorros estimados en el diagnóstico." },
      { titulo: "MIPRO Ecuador — Diagnósticos industriales para PYMES", url: "https://www.produccion.gob.ec/mipro/", tipo: "documentacion", descripcion: "El Ministerio de Producción del Ecuador ofrece programas de diagnóstico para PYMES industriales. Referencia para contextualizar el diagnóstico en el ecosistema industrial ecuatoriano." },
    ],
  },

  {
    id: 40,
    titulo: "Presentación de resultados y plan de implementación",
    modulo: MOD8,
    moduloNum: 8,
    videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
    videoTitulo: "Presentación de resultados y plan de implementación",
    teoria: `## Presentar resultados de IA a la gerencia: de los datos al sí

Identificar las oportunidades de mejora con IA es solo la mitad del trabajo. La otra mitad es comunicarlas efectivamente a quienes deben aprobar la implementación: la gerencia general, el directorio o los dueños de la empresa. En Ecuador, donde la adopción de IA en la industria todavía está en etapas tempranas, la presentación de resultados tiene un componente adicional de educación: el tomador de decisiones frecuentemente necesita primero entender qué puede hacer la IA para luego evaluar si le conviene invertir.

### El framework de presentación para proyectos de IA industrial

La estructura más efectiva para presentar resultados de diagnóstico IA a gerencia usa el modelo **Situación → Complicación → Resolución** (SCR) de McKinsey, adaptado al contexto industrial:

**Situación (1-2 minutos):**
El estado actual documentado con números: "Nuestra planta opera con un OEE del 71%, una tasa de defectos del 4.8% y tres informes diarios que consumen 2.25 horas de tiempo calificado cada día. Estos son los datos de los últimos 6 meses."

No comenzar con "hablemos de inteligencia artificial". Comenzar con los problemas del negocio que la gerencia ya conoce y reconoce.

**Complicación (1-2 minutos):**
Por qué el statu quo es insostenible: "Con un OEE de 71% frente al benchmark de la industria de 82%, perdemos $28,000 mensuales en capacidad productiva no aprovechada. Si los competidores que ya están usando IA para mantenimiento predictivo reducen sus paradas un 30%, su OEE llegaría a 85%, lo que les daría una ventaja de costo de 12% sobre nosotros."

**Resolución (el resto de la presentación):**
Las 3 iniciativas de IA propuestas con su ROI específico, el roadmap de implementación y la inversión requerida.

### Los 4 principios de comunicación para gerencia no técnica

**Principio 1 — Dinero, no tecnología:**
La gerencia no necesita entender cómo funciona el suavizamiento exponencial o el Isolation Forest. Necesita entender que "mejorar el pronóstico de demanda con IA reduce el inventario promedio un 18%, liberando $45,000 en capital de trabajo". Traducir todo al idioma del negocio.

**Principio 2 — Mostrar el riesgo de no actuar:**
En la cultura empresarial ecuatoriana, es más motivador mostrar el riesgo de no implementar que el beneficio de implementar: "Si no mejoramos el Cpk de este proceso de aquí a 6 meses, la certificación de cliente X está en riesgo. Eso representa el 23% de nuestras ventas."

**Principio 3 — Quick Wins primero:**
Proponer primero las iniciativas de bajo esfuerzo y resultado rápido (automatizar los 3 reportes diarios con n8n, ahorro inmediato de 45h/mes = $675/mes) construye credibilidad antes de proponer los proyectos más ambiciosos (mantenimiento predictivo con IoT).

**Principio 4 — Piloto antes de escalar:**
En lugar de pedir aprobación para implementar toda la hoja de ruta, proponer: "Empecemos con un piloto de 60 días en la línea 2. Inversión: $800. Si el OEE de esa línea sube al menos 3 puntos, escalamos a toda la planta." Los pilotos reducen el riesgo percibido y aceleran la aprobación.

### Estructura de la presentación: 12 diapositivas

1. **Portada:** Nombre de la empresa, "Diagnóstico IA: Oportunidades de Mejora Industrial", fecha
2. **Resumen ejecutivo:** 3 oportunidades + ahorro total mensual + inversión total requerida + período de recuperación
3. **Situación actual — Producción:** OEE actual, benchmark, brecha, costo de la brecha mensual
4. **Situación actual — Calidad:** Tasa de defectos, Cpk si está disponible, costo de no calidad
5. **Situación actual — Mantenimiento:** MTBF/MTTR actuales, costo de paradas no planificadas
6. **Situación actual — Cadena de suministro:** MAPE actual, costo de exceso de inventario o roturas de stock
7. **Oportunidad 1 — Quick Win:** Nombre, herramienta IA, ahorro mensual, inversión, período de recuperación
8. **Oportunidad 2 — Proyecto estratégico:** Igual que anterior con mayor impacto y mayor inversión
9. **Oportunidad 3 — Proyecto estratégico:** Igual
10. **Roadmap:** Timeline visual (Gantt) con las 3 iniciativas a lo largo de 6 meses
11. **Análisis costo-beneficio consolidado:** Tabla comparativa de inversión total vs. ahorro total en 12 meses
12. **Próximos 3 pasos:** Acciones concretas con responsable y fecha de inicio (primera semana)

### ChatGPT para preparar la presentación

ChatGPT puede asistir en múltiples aspectos de la preparación:

**Para las diapositivas:**
*"Aquí está el análisis completo del diagnóstico IA de mi empresa [datos]. Redacta el contenido de las diapositivas 7, 8 y 9 (las tres oportunidades) usando el framework SCR, en lenguaje ejecutivo no técnico, con énfasis en el ROI y el período de recuperación."*

**Para anticipar objeciones:**
*"Voy a presentar este diagnóstico IA a la gerencia de una empresa manufacturera ecuatoriana tradicional. ¿Cuáles son las 5 objeciones más probables que presentará el gerente general y cómo las respondería de forma convincente?"*

**Para el análisis de sensibilidad:**
*"El gerente preguntará '¿qué pasa si el ahorro real es solo la mitad del estimado?' Prepara el análisis de sensibilidad: si el ahorro real del proyecto de OEE es 50%, 75% y 100% del estimado, ¿cuál es el período de recuperación en cada escenario?"*

### Cerrar con un plan de acción concreto

La presentación debe terminar no con "gracias por su atención" sino con tres preguntas accionables:

1. "¿Aprobamos el piloto de la línea 2 esta semana?"
2. "¿Quién sería el responsable interno de coordinar la implementación?"
3. "¿Qué información adicional necesitan para tomar la decisión?"

El objetivo no es que la gerencia "entienda la IA". El objetivo es que diga "aprobado, empecemos".`,
    presentacionSlides: [
      { titulo: "El framework SCR para presentar proyectos de IA", contenido: "Situación: el estado actual con números documentados. Complicación: por qué el statu quo es insostenible (costo de la brecha, riesgo competitivo). Resolución: las 3 iniciativas con ROI específico y roadmap. Nunca empezar con 'inteligencia artificial': empezar con el problema del negocio." },
      { titulo: "4 principios para gerencia no técnica", contenido: "1. Dinero, no tecnología: traducir todo a USD/mes y período de recuperación. 2. Mostrar el riesgo de NO actuar más que el beneficio de actuar. 3. Quick Wins primero: credibilidad antes de proyectos ambiciosos. 4. Piloto antes de escalar: reduce el riesgo percibido, acelera la aprobación." },
      { titulo: "Las 12 diapositivas de la presentación ejecutiva", contenido: "1. Portada. 2. Resumen ejecutivo (ahorro total + inversión + ROI). 3-6. Situación actual por área (producción, calidad, mantenimiento, supply chain). 7-9. Las 3 oportunidades con ROI individual. 10. Roadmap Gantt 6 meses. 11. Costo-beneficio consolidado. 12. Próximos 3 pasos con fecha." },
      { titulo: "Cómo proponer el piloto para acelerar la aprobación", contenido: "'Empecemos con un piloto de 60 días en la línea 2. Inversión: $800. Si el OEE sube ≥3 puntos, escalamos a toda la planta.' Criterio de éxito medible + riesgo acotado + tiempo definido = la fórmula para obtener el primer sí en empresas conservadoras." },
      { titulo: "ChatGPT para anticipar objeciones de gerencia", contenido: "Prompt: 'Voy a presentar este diagnóstico a una empresa manufacturera ecuatoriana tradicional. ¿Cuáles son las 5 objeciones más probables del gerente general y cómo las respondería?' Prepara las respuestas con datos. La reunión con objeciones respondidas de antemano no tiene sorpresas." },
      { titulo: "Análisis de sensibilidad: 50-75-100% del ahorro estimado", contenido: "Gerente: '¿Y si los resultados son la mitad de lo esperado?' Tu respuesta preparada: 'Con 50% del ahorro estimado, el período de recuperación es 8 meses en lugar de 4. Con 75%, son 5 meses. El peor escenario razonable sigue siendo rentable.' ChatGPT calcula los tres escenarios automáticamente." },
      { titulo: "Cierre accionable: 3 preguntas de compromiso", contenido: "No 'gracias por su atención'. Terminar con: '¿Aprobamos el piloto esta semana?' '¿Quién coordina internamente?' '¿Qué información adicional necesitan?' El objetivo no es que entiendan la IA: es que digan 'aprobado, empecemos'." },
      { titulo: "La presentación es el comienzo, no el fin", contenido: "Un diagnóstico aprobado es el inicio de un programa de transformación, no un proyecto único. Cada Quick Win implementado genera datos para el siguiente análisis. En 12 meses, la empresa que empieza un diagnóstico IA hoy puede tener un sistema de mejora continua impulsado por datos que se autoalimenta." },
    ],
    quiz: [
      { pregunta: "¿Por qué el framework SCR (Situación-Complicación-Resolución) recomienda comenzar con el problema del negocio en lugar de con 'la inteligencia artificial'?", opciones: ["Porque la gerencia generalmente desconoce qué es la inteligencia artificial", "Porque comenzar con el problema crea inmediato contexto emocional y relevancia en los tomadores de decisión, mientras que empezar con tecnología genera distancia o escepticismo", "Porque el framework SCR prohíbe mencionar tecnologías en la apertura", "Porque en Ecuador la IA tiene mala reputación en el sector industrial"], respuesta: 1, explicacion: "El framework SCR comienza con la Situación porque los tomadores de decisión se conectan inmediatamente con problemas que ya conocen (OEE bajo, defectos, costos de inventario). Comenzar con tecnología activa el filtro de 'otra moda tecnológica'; comenzar con el problema activa el filtro de 'esto afecta mis resultados, prestemos atención'." },
      { pregunta: "¿Cuál de los 4 principios de comunicación para gerencia no técnica es más relevante en el contexto cultural empresarial ecuatoriano?", opciones: ["Principio 1: Dinero, no tecnología", "Principio 2: Mostrar el riesgo de no actuar más que el beneficio de actuar", "Principio 3: Quick Wins primero", "Principio 4: Piloto antes de escalar"], respuesta: 1, explicacion: "En la cultura empresarial ecuatoriana, donde la aversión al riesgo y la preferencia por lo probado son características frecuentes, mostrar el riesgo de no implementar (certificación en riesgo, competidores adelantándose, pérdidas mensuales cuantificadas) suele ser más motivador que mostrar los beneficios potenciales, que son percibidos como inciertos." },
      { pregunta: "¿Por qué es estratégicamente mejor proponer un piloto de 60 días que pedir aprobación para implementar toda la hoja de ruta desde el inicio?", opciones: ["Porque los pilotos son más baratos de implementar que el programa completo", "Porque limita el riesgo percibido del gerente: une inversión pequeña + criterio de éxito medible + tiempo definido = decisión más fácil de aprobar; el éxito del piloto construye credibilidad para escalar", "Porque la legislación ecuatoriana requiere pilotos antes de implementaciones grandes", "Porque un programa completo siempre falla; solo los pilotos tienen éxito"], respuesta: 1, explicacion: "El piloto acotado reduce el riesgo percibido: si falla, el costo es pequeño. Si tiene éxito, la decisión de escalar se vuelve obvia. Pedir aprobación para un programa grande implica pedir confianza en algo no probado, lo que activa resistencias. El piloto exitoso convierte la promesa en evidencia." },
      { pregunta: "¿Para qué sirve preparar el análisis de sensibilidad (escenarios 50-75-100% del ahorro) antes de la presentación ejecutiva?", opciones: ["Para mostrar que el análisis fue realizado con metodología formal", "Para responder de antemano la objeción más frecuente de la gerencia ('¿y si los resultados son la mitad de lo esperado?') con datos que demuestran que incluso el escenario conservador es rentable", "Solo para el caso en que el gerente sea del área financiera", "Para calcular cuántos empleados se pueden reducir si se implementa la IA"], respuesta: 1, explicacion: "La objeción 'pero ¿y si no funciona igual de bien?' es la más frecuente en presentaciones de proyectos de mejora. Preparar los tres escenarios (50%, 75%, 100% del ahorro estimado) con sus respectivos períodos de recuperación permite responder con datos que muestran que incluso el caso pesimista es favorable para la empresa." },
      { pregunta: "¿Cuál debe ser el cierre ideal de una presentación de diagnóstico IA a la gerencia?", opciones: ["'Gracias por su atención. Están libres de hacer preguntas.'", "'En resumen, la inteligencia artificial tiene un brillante futuro en la industria ecuatoriana.'", "Tres preguntas accionables: ¿Aprobamos el piloto esta semana? ¿Quién coordina internamente? ¿Qué información adicional necesitan para decidir?'", "'Les enviaré el análisis completo por email para que lo revisen con calma.'"], respuesta: 2, explicacion: "El cierre con tres preguntas accionables es la diferencia entre una presentación 'interesante' y una que genera compromisos. Las tres preguntas convierten la reunión en una decisión: ¿sí al piloto?, ¿quién lo coordina?, ¿qué falta para decidir? Sin estas preguntas, la respuesta típica es 'lo pensamos' y el proyecto se congela." },
    ],
    ejercicio: {
      titulo: "Presentación ejecutiva del diagnóstico IA: 12 diapositivas con ChatGPT",
      objetivo: "Construir la presentación ejecutiva completa de 12 diapositivas del diagnóstico IA, usando ChatGPT para el contenido y practicar las respuestas a las 5 objeciones más probables de la gerencia.",
      herramientas: "ChatGPT o Claude, PowerPoint o Google Slides, opcionalmente Gamma.app para diseño automatizado",
      pasos: [
        "Toma el diagnóstico IA desarrollado en el tema anterior (o el caso de ALIMECUADOR) como base. Usa ChatGPT con el prompt: 'Basándote en este diagnóstico: [resumen de las 3 oportunidades con sus datos], redacta el contenido completo de las 12 diapositivas de la presentación ejecutiva usando el framework SCR. Incluye el texto de cada diapositiva en lenguaje ejecutivo, con énfasis en USD y ROI. El audiencia es el gerente general de una empresa manufacturera ecuatoriana sin conocimiento técnico de IA.'",
        "Crea la presentación en PowerPoint, Google Slides o Gamma.app. Usa los colores corporativos de la empresa si los tienes, o un diseño profesional y limpio. Cada diapositiva debe tener: título claro, 3-5 puntos clave en bullets o números, y cuando aplique, gráfica o tabla. Menos texto es más.",
        "Construye el análisis de sensibilidad para las 3 oportunidades: usa ChatGPT para calcular el período de recuperación si el ahorro real es 50%, 75% y 100% del estimado. Agrega esta tabla a la diapositiva 11 (costo-beneficio consolidado).",
        "Usa ChatGPT para anticipar objeciones: 'Las 5 objeciones más probables que presentará el gerente general de ALIMECUADOR a este diagnóstico IA, y la respuesta más convincente para cada una con datos del análisis.' Prepara las respuestas y tenlas listas como notas del presentador en las diapositivas correspondientes.",
        "Practica la presentación completa: grábate durante 15-20 minutos presentando las 12 diapositivas sin leer las notas. Evalúa: ¿cada diapositiva se puede explicar en ≤90 segundos? ¿Las transiciones entre diapositivas son fluidas? ¿Las diapositivas 7-9 (las oportunidades) comunican claramente el ROI?",
        "Reflexión final: ¿Qué parte del diagnóstico fue más fácil de hacer con IA y cuál requirió más criterio de ingeniería propio? ¿Qué aprendizaje del curso (módulo 1 al 8) se aplicó más directamente en este proyecto final?",
      ],
      resultado: "Presentación de 12 diapositivas completa y lista para presentar a gerencia, análisis de sensibilidad incluido, 5 objeciones con respuestas preparadas y reflexión del proceso de aprendizaje.",
      criterios: [
        { criterio: "Presentación de 12 diapositivas con estructura SCR y las secciones requeridas", puntos: 30 },
        { criterio: "Análisis de sensibilidad con escenarios 50-75-100% del ahorro estimado", puntos: 20 },
        { criterio: "5 objeciones de gerencia con respuestas documentadas y fundamentadas", puntos: 25 },
        { criterio: "Reflexión sobre el proceso de aprendizaje: qué módulos se aplicaron más y cuál fue el aporte específico del ingeniero vs. la IA", puntos: 25 },
      ],
    },
    recursos: [
      { titulo: "Gamma.app — Presentaciones con IA en minutos", url: "https://gamma.app/", tipo: "herramienta", descripcion: "Plataforma de IA para crear presentaciones ejecutivas profesionales desde texto. El ingeniero describe el contenido y Gamma genera el diseño completo." },
      { titulo: "McKinsey — How to present like McKinsey", url: "https://www.mckinsey.com/capabilities/mckinsey-design/our-insights/the-art-of-saying-more-with-less", tipo: "lectura", descripcion: "Principios de comunicación ejecutiva de McKinsey para presentar proyectos de mejora a la alta dirección de manera convincente y concisa." },
      { titulo: "ITSEIA — Recursos de presentación ejecutiva", url: "https://itseia.ai/cursos", tipo: "herramienta", descripcion: "Plataforma ITSEIA con recursos complementarios para la presentación de proyectos de IA industrial, incluyendo plantillas y casos de éxito en Ecuador." },
    ],
  },
];
