// ─── C12: Procesamiento de Lenguaje Natural — Datos de 20 temas ───────────────
// Curso C12 del programa MDT. 20 temas.
// Módulo 1: Fundamentos NLP
// Módulo 2: Análisis de sentimiento
// Módulo 3: Chatbots con LLMs
// Módulo 4: Casos español Ecuador (atención cliente, encuestas)

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

export interface TemaC12 {
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

export const C12_MODULOS = [
  { num: 1, nombre: "Fundamentos de NLP", horas: 15, temas: 5 },
  { num: 2, nombre: "Análisis de Sentimiento", horas: 15, temas: 5 },
  { num: 3, nombre: "Chatbots con LLMs", horas: 15, temas: 5 },
  { num: 4, nombre: "Casos Español Ecuador", horas: 15, temas: 5 },
];

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC12 => ({
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

// ─── MÓDULO 1: Fundamentos de NLP ────────────────────────────────────────────

const MOD1 = "Fundamentos de NLP";

const tema1: TemaC12 = {
  id: 1,
  titulo: "Introducción al Procesamiento de Lenguaje Natural",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "NLP desde cero — Procesamiento de Lenguaje Natural en español",
  videoDuracion: "~40 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "Introducción al Procesamiento de Lenguaje Natural\nC12. Procesamiento de Lenguaje Natural — Tema 1\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido:
        "Al finalizar esta sesión serás capaz de:\n• Definir qué es el NLP y cuál es su relación con la IA\n• Identificar las tareas principales del NLP\n• Explicar el pipeline básico de procesamiento de texto\n• Reconocer aplicaciones de NLP en el contexto ecuatoriano",
    },
    {
      titulo: "¿Qué es el NLP?",
      contenido:
        "Natural Language Processing (NLP) = Procesamiento de Lenguaje Natural\nLa intersección entre la lingüística, la informática y la IA\n\n¿Qué busca? Hacer que las máquinas puedan:\n• Leer y entender texto humano\n• Generar texto coherente y relevante\n• Traducir entre idiomas\n• Extraer información de documentos\n• Conversar de forma natural\n\nBase de: ChatGPT, Google Translate, Alexa, correctores de texto, filtros de spam",
    },
    {
      titulo: "¿Por qué el español y el contexto ecuatoriano importan?",
      contenido:
        "El español es el 4to idioma más hablado del mundo con 600M hablantes\nPero el 72% de los datos de entrenamiento de los modelos de NLP son en inglés\n\nEcuador-específico:\n• Jerga ecuatoriana: 'chévere', 'bacán', 'de una', 'ñaño'\n• Regionalismos: serranos vs costeños tienen vocabulario diferente\n• Acrónimos locales: SRI, IESS, SENECYT, BCE\n• Modelo que no conoce el contexto ecuatoriano falla en uso real\n\nOportunidad: NLP en español para Ecuador tiene poca competencia.",
    },
    {
      titulo: "Tareas principales del NLP",
      contenido:
        "Clasificación de texto: ¿este email es spam o no?\nAnálisis de sentimiento: ¿esta reseña es positiva, negativa o neutral?\nReconocimiento de entidades (NER): identificar personas, empresas, lugares en texto\nExtracción de información: extraer datos específicos de documentos\nResumen automático: condensar texto largo en resumen breve\nTraducción: de español a inglés, quechua, etc.\nGeneración de texto: chatbots, completado de frases\nPregunta-Respuesta: responder preguntas basadas en documentos",
    },
    {
      titulo: "Pipeline de NLP — del texto al modelo",
      contenido:
        "1. TOKENIZACIÓN: dividir texto en unidades (palabras, caracteres, subpalabras)\n   'El banano es bueno' → ['El', 'banano', 'es', 'bueno']\n\n2. NORMALIZACIÓN: lowercase, eliminar puntuación, stopwords\n   ['el', 'banano', 'bueno'] (sin 'es' = stopword)\n\n3. EMBEDDINGS: convertir tokens en vectores numéricos\n   'banano' → [0.23, -0.45, 0.81, ...] (vector de 300 dims)\n\n4. MODELO: procesa los vectores y produce salida\n5. POSTPROCESAMIENTO: convertir salida a formato útil",
    },
    {
      titulo: "Tokenización — el primer paso crítico",
      contenido:
        "Word tokenization: divide por espacios y puntuación\nBPE (Byte Pair Encoding): subpalabras — el estándar en LLMs modernos\n'ChatGPT' → ['Chat', 'G', 'PT'] (3 tokens en algunos modelos)\n\nProblemas con español:\n'Análisis' en BPE puede tokenizarse como ['An', 'álisis'] — sin tilde a veces\nLas tildes son críticas en español: 'mas' vs 'más'\n\nTokenizers en HuggingFace son específicos por modelo. Siempre verificar el tokenizer correcto para cada modelo en español.",
    },
    {
      titulo: "Embeddings — el lenguaje en números",
      contenido:
        "Un embedding es la representación numérica de una palabra en un espacio vectorial de alta dimensión\n\nPropiedad mágica de los embeddings:\nvec('rey') - vec('hombre') + vec('mujer') ≈ vec('reina')\nvec('Quito') - vec('Ecuador') + vec('Colombia') ≈ vec('Bogotá')\n\nModelos de embeddings en español:\n• Word2Vec entrenado en español\n• FastText (Meta) — maneja palabras con tildes\n• BERT multilingüe — el más poderoso\n• BETO — BERT entrenado específicamente en español",
    },
    {
      titulo: "Modelos NLP pre-entrenados — de spaCy a BERT",
      contenido:
        "spaCy: librería industrial de NLP, rápida y eficiente\n• Modelo en español: es_core_news_lg\n• Tareas: tokenización, POS tagging, NER, dependencias sintácticas\n• Uso: extracción de entidades, análisis de texto a escala\n\nBERT (Google, 2018): primer modelo con atención bidireccional\n• entiende el contexto de izquierda Y derecha de cada palabra\n• BETO: BERT en español (datos de Wikipedia en español)\n\nRoBERTa, XLM-R: variantes mejoradas multilingüe",
    },
    {
      titulo: "Resumen del Tema 1",
      contenido:
        "1. NLP es hacer que las máquinas lean, entiendan y generen lenguaje humano\n2. Pipeline básico: tokenización → normalización → embeddings → modelo → salida\n3. El español tiene características únicas: tildes, regionalismos, jerga local\n4. Ecuador tiene oportunidad única: NLP en español local con poco competencia\n5. Herramientas clave: spaCy, BERT/BETO, HuggingFace Transformers\n\nPróximo: Tokenización y embeddings en profundidad con práctica",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué es la tokenización en el contexto del NLP?",
      opciones: [
        "Generar tokens de seguridad para autenticación",
        "Dividir el texto en unidades más pequeñas (palabras, subpalabras o caracteres) para procesarlas",
        "Traducir el texto de español a inglés",
        "Comprimir el texto para reducir su tamaño",
      ],
      respuesta: 1,
      explicacion:
        "La tokenización es el primer paso del pipeline de NLP: divide el texto en unidades llamadas tokens. Los modelos modernos usan BPE (Byte Pair Encoding) que divide en subpalabras, lo que permite manejar palabras poco comunes y errores de ortografía.",
    },
    {
      pregunta: "¿Qué modelo de BERT fue entrenado específicamente con datos en español?",
      opciones: ["BERT multilingual base", "RoBERTa large", "BETO", "GPT-3 español"],
      respuesta: 2,
      explicacion:
        "BETO es el equivalente de BERT entrenado en español, usando datos de Wikipedia en español y otros corpus en castellano. Tiene mejor desempeño en tareas en español que el BERT multilingual genérico.",
    },
    {
      pregunta: "¿Cuál es la 'propiedad mágica' de los embeddings de palabras?",
      opciones: [
        "Son siempre exactos en la traducción",
        "Las operaciones matemáticas entre vectores capturan relaciones semánticas: vec(rey) - vec(hombre) + vec(mujer) ≈ vec(reina)",
        "Pueden generar imágenes a partir de texto",
        "Siempre tienen la misma dimensión para todos los idiomas",
      ],
      respuesta: 1,
      explicacion:
        "Los embeddings capturan relaciones semánticas en el espacio vectorial. La operación vec('rey') - vec('hombre') + vec('mujer') ≈ vec('reina') demuestra que el modelo aprendió que la relación rey-hombre es análoga a la relación reina-mujer.",
    },
    {
      pregunta: "¿Por qué las tildes son críticas en el NLP aplicado al español ecuatoriano?",
      opciones: [
        "Solo por razones estéticas de presentación",
        "Cambian el significado de las palabras: 'mas' (pero) vs 'más' (adicional), y el modelo debe diferenciarlas correctamente",
        "Los modelos de NLP no pueden procesar tildes",
        "Son opcionales en texto digital",
      ],
      respuesta: 1,
      explicacion:
        "En español las tildes son diacríticos que cambian el significado: 'mas' (conjunción adversativa equivalente a 'pero') vs 'más' (mayor cantidad). Confundirlos lleva a errores semánticos graves. Por eso FastText y los tokenizadores modernos deben manejar correctamente el español con tildes.",
    },
    {
      pregunta: "¿Cuál es el principal pipeline de NLP en orden correcto?",
      opciones: [
        "Modelo → Tokenización → Normalización → Embeddings",
        "Tokenización → Normalización → Embeddings → Modelo → Postprocesamiento",
        "Normalización → Modelo → Tokenización → Embeddings",
        "Embeddings → Tokenización → Modelo → Normalización",
      ],
      respuesta: 1,
      explicacion:
        "El pipeline correcto es: 1) Tokenizar el texto, 2) Normalizar (minúsculas, eliminar puntuación y stopwords), 3) Convertir a embeddings numéricos, 4) Procesar con el modelo de ML, 5) Postprocesar la salida para el formato útil.",
    },
  ],
  ejercicio: {
    titulo: "Pipeline de NLP para análisis de tweets ecuatorianos con spaCy",
    objetivo:
      "Construir un pipeline básico de NLP con spaCy para analizar texto en español ecuatoriano: tokenización, extracción de entidades y análisis de frecuencia de palabras",
    herramientas: "Google Colab + Python + spaCy + NLTK + pandas + matplotlib",
    datosEjemplo:
      "Textos de ejemplo (tweets/comentarios ecuatorianos ficticios para el ejercicio):\n1. 'El SRI implementó el nuevo sistema de facturación electrónica en Quito y Guayaquil este año'\n2. 'El Banco Pichincha ofrece créditos para emprendedores con tasas del BCE'\n3. 'ITSEIA lanzó el primer programa de IA en Ecuador con sede en Quito'\n4. 'La Supercias reportó crecimiento del 15% en nuevas empresas ecuatorianas en 2024'\n5. 'Chévere el evento de emprendimiento en el Centro Cultural de Guayaquil'\n6. 'El IESS mejoró su plataforma digital para afiliados en todo el país'",
    pasos: [
      "Crear notebook 'NLP_Ecuador_Pipeline' en Google Colab",
      "Instalar spaCy y modelo en español: !pip install spacy; !python -m spacy download es_core_news_lg",
      "En ChatGPT, pedir: 'Dame código Python completo para Google Colab con spaCy que: 1) cargue el modelo es_core_news_lg, 2) procese los 6 textos de ejemplo, 3) para cada texto muestre: tokens, entidades nombradas (NER) con su tipo, lemas de las palabras principales, y POS tags. Usar pandas para organizar los resultados en tabla'",
      "Ejecutar el código. Documentar qué entidades detectó spaCy correctamente (SRI, Banco Pichincha, Quito, ITSEIA, BCE) y cuáles falló.",
      "Análisis de frecuencia: usando NLTK o Counter de Python, construir una nube de palabras más frecuentes en los 6 textos (excluir stopwords). En ChatGPT pedir el código para generar la nube con wordcloud library.",
      "Experimento con texto difícil: agregar 3 textos con jerga ecuatoriana ('ñaño', 'chiro', 'bacán', 'chela') y observar cómo los maneja spaCy. ¿Reconoce 'ñaño' como una persona? ¿Qué tag le da?",
      "Conclusión en el notebook: ¿qué entidades fue capaz de reconocer spaCy correctamente en contexto ecuatoriano? ¿Qué falló? ¿Por qué crees que el modelo tiene problemas con jerga local? ¿Qué datos de entrenamiento adicionales necesitaría?",
    ],
    resultado:
      "Pipeline de NLP funcional con spaCy para 6 textos ecuatorianos, tabla de entidades detectadas vs. esperadas, análisis de frecuencia con nube de palabras, experimento con jerga local y análisis crítico de las limitaciones del modelo pre-entrenado.",
    criterios: [
      { criterio: "Pipeline completo funcionando: tokenización + NER + lemas + POS", puntos: 30 },
      { criterio: "Análisis comparativo de entidades detectadas vs. esperadas", puntos: 20 },
      { criterio: "Nube de palabras generada correctamente con stopwords excluidas", puntos: 15 },
      { criterio: "Experimento con jerga ecuatoriana documentado", puntos: 20 },
      { criterio: "Análisis crítico de limitaciones del modelo en contexto ecuatoriano", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "spaCy — Librería industrial de NLP",
      url: "https://spacy.io/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de spaCy con tutoriales, modelos en español y guías de uso industrial. Incluye modelo es_core_news_lg para español.",
    },
    {
      titulo: "HuggingFace — Hub de modelos NLP",
      url: "https://huggingface.co/models?language=es",
      tipo: "herramienta",
      descripcion: "Repositorio de modelos NLP pre-entrenados en español, incluyendo BETO, RoBERTa-es y modelos de análisis de sentimiento en español.",
    },
    {
      titulo: "NLTK — Natural Language Toolkit",
      url: "https://www.nltk.org/",
      tipo: "documentacion",
      descripcion: "Librería clásica de NLP en Python con corpus en español, tokenizadores, stemmer y herramientas básicas de análisis lingüístico.",
    },
    {
      titulo: "Stanford NLP — Recursos en español",
      url: "https://nlp.stanford.edu/",
      tipo: "lectura",
      descripcion: "Grupo de NLP de Stanford con recursos, papers y herramientas para procesamiento de lenguaje natural en múltiples idiomas incluyendo español.",
    },
    {
      titulo: "BETO — BERT en español",
      url: "https://huggingface.co/dccuchile/bert-base-spanish-wwm-cased",
      tipo: "herramienta",
      descripcion: "BERT entrenado con texto en español, incluyendo Wikipedia en español. Mejor desempeño que BERT multilingual para tareas específicas en español.",
    },
  ],
  teoria: `El Procesamiento de Lenguaje Natural (NLP, por sus siglas en inglés Natural Language Processing) es la rama de la inteligencia artificial que busca dotar a las máquinas de la capacidad de leer, entender, interpretar y generar lenguaje humano. Es la tecnología subyacente de ChatGPT, Google Translate, los correctores ortográficos, los filtros de spam, los asistentes de voz, y cualquier sistema que interactúe con texto o voz humana.

El lenguaje natural es inherentemente complejo para las máquinas: es ambiguo (la misma frase puede tener significados distintos según el contexto), cambia con el tiempo (las jergas evolucionan), varía por región (el español de Ecuador tiene características distintas al de España, México o Argentina), y está lleno de ironía, sarcasmo, metáforas y sobreentendidos culturales que requieren conocimiento del mundo para interpretarse correctamente.

El pipeline clásico de NLP transforma el texto en bruto en representaciones que los algoritmos de machine learning pueden procesar. El primer paso es la tokenización: dividir el texto en unidades mínimas llamadas tokens. Los modelos modernos usan BPE (Byte Pair Encoding), que divide en subpalabras en lugar de palabras completas. Esto permite manejar palabras desconocidas (como neologismos o nombres propios ecuatorianos) dividiéndolas en partes conocidas. La palabra "SENESCYT" podría tokenizarse como "SEN", "ESC", "YT" en un modelo no especializado.

La normalización prepara el texto para el análisis: convertir a minúsculas, eliminar puntuación no significativa, y filtrar stopwords (palabras de alta frecuencia con poco contenido semántico: "el", "la", "de", "que"). La lematización va más lejos que el stemming: convierte cada palabra a su forma base léxica (lema). "Corriendo" → "correr", "ecuatorianos" → "ecuatoriano". spaCy tiene un lematizador para español que funciona bien con palabras estándar.

Los embeddings son la representación matemática del lenguaje. Cada palabra o token se representa como un vector numérico en un espacio de alta dimensión (típicamente 300-768 dimensiones). La propiedad más notable de los buenos embeddings es que las relaciones semánticas se preservan como relaciones geométricas: words que significan cosas similares tienen vectores cercanos en el espacio, y las relaciones analógicas funcionan algebraicamente. BETO (BERT entrenado en español) y FastText con datos en español son los embeddings más efectivos para texto ecuatoriano.

Para el contexto específico de Ecuador, el NLP tiene retos y oportunidades únicos. La jerga ecuatoriana ("chévere", "bacán", "de una", "ñaño", "chiro", "biela") no aparece en los datos de entrenamiento de la mayoría de modelos de NLP en español, lo que causa errores de interpretación. Los acrónimos institucionales ecuatorianos (SRI, IESS, SENESCYT, BCE, AMT, MAGAP) tienen significados específicos que un modelo genérico puede no conocer. Los nombres geográficos locales (Cayambe, Otavalo, Atacames, Loja, Macas) son frecuentemente mal detectados como entidades no identificadas.

Esta brecha entre los modelos de NLP generales y las necesidades específicas del mercado ecuatoriano es precisamente la oportunidad. Un profesional que domina NLP y lo adapta al contexto local — entrenando modelos con datos ecuatorianos, construyendo sistemas de análisis de sentimiento calibrados para el consumidor ecuatoriano, desarrollando chatbots con vocabulario y tono local — tiene una ventaja competitiva enorme en un mercado con muy poca oferta de este perfil. Las empresas ecuatorianas de todos los sectores (banca, retail, gobierno, salud, telecomunicaciones) necesitan estos sistemas y no encuentran quién los construya.

Las herramientas disponibles para comenzar son todas gratuitas: spaCy con el modelo es_core_news_lg para análisis lingüístico rápido y eficiente, HuggingFace Transformers para acceder a BETO y decenas de modelos en español, NLTK para procesamiento básico de texto con corpus en español, y Google Colab para ejecutar todo sin necesidad de hardware propio. La barrera de entrada al NLP en 2026 es más baja que nunca.`,
};

const tema2: TemaC12 = placeholder(2, "Tokenización y embeddings en profundidad", MOD1, 1);
const tema3: TemaC12 = placeholder(3, "Modelos BERT y transformers para NLP en español", MOD1, 1);
const tema4: TemaC12 = placeholder(4, "Extracción de entidades nombradas (NER)", MOD1, 1);
const tema5: TemaC12 = placeholder(5, "Clasificación de texto con ML", MOD1, 1);

// ─── MÓDULO 2: Análisis de Sentimiento ──────────────────────────────────────

const MOD2 = "Análisis de Sentimiento";

const tema6: TemaC12 = {
  id: 6,
  titulo: "Análisis de sentimiento — fundamentos y aplicaciones",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Análisis de sentimiento con Python y NLP — Tutorial completo español",
  videoDuracion: "~45 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "Análisis de Sentimiento — Fundamentos y Aplicaciones\nC12. Procesamiento de Lenguaje Natural — Tema 6\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué es el análisis de sentimiento?",
      contenido:
        "Sentiment Analysis = determinar la opinión o emoción expresada en un texto\n\nNivel básico — Polaridad:\n• Positivo: 'Me encanta el servicio del Banco Pichincha'\n• Negativo: 'Pésima atención en el call center'\n• Neutral: 'El horario es de 9am a 5pm'\n\nNivel avanzado — Emoción:\n• Alegría, tristeza, ira, miedo, sorpresa, disgusto\n\nNivel aspect-based:\n• Positivo en precio pero negativo en servicio al cliente",
    },
    {
      titulo: "¿Por qué importa para empresas ecuatorianas?",
      contenido:
        "CX (Customer Experience): análisis masivo de reseñas Google, TripAdvisor, redes\nMonitoreo de marca: ¿qué dice Ecuador de tu empresa en Twitter/X?\nVoz del cliente en encuestas: análisis de preguntas abiertas\nGestión de crisis: detectar picos de sentimiento negativo antes que sea viral\nCompetencia: analizar las reseñas de tu competidor\n\nVolumen típico empresa mediana Ecuador: 500-5,000 comentarios/mes en redes → imposible leer manual. Con NLP: análisis en segundos.",
    },
    {
      titulo: "Enfoques técnicos — léxico vs. ML",
      contenido:
        "Enfoque léxico (regla-based):\n• Diccionarios de palabras positivas/negativas (VADER, SentiWordNet)\n• Rápido, interpretable, sin datos de entrenamiento\n• Limitación: no entiende sarcasmo, dobles negaciones\n\nEnfoque ML supervisado:\n• Entrenar clasificador con textos etiquetados (positivo/negativo)\n• Más preciso para dominio específico\n• Requiere datos etiquetados (100-1,000 ejemplos)\n\nEnfoque Transformer (BERT):\n• Estado del arte, comprende contexto completo\n• Modelos en español preentrenados disponibles en HuggingFace",
    },
    {
      titulo: "Modelos de sentimiento en español — cuáles usar",
      contenido:
        "pysentimiento (HuggingFace):\n• Específico para español e italiano\n• Entrenado con tweets en español de LATAM\n• Categorías: POS, NEG, NEU + emociones\n• Pip install pysentimiento\n\nBETO fine-tuned para sentimiento:\n• HuggingFace: finiteautomata/beto-sentiment-analysis\n• Muy bueno para reseñas largas\n\nVADER español:\n• Adaptación del VADER original al español\n• Más rápido pero menos preciso\n\nPara Ecuador: pysentimiento da mejores resultados con texto de redes sociales LATAM.",
    },
    {
      titulo: "Análisis de sentimiento con ChatGPT — zero-shot",
      contenido:
        "Prompt para análisis de 1 texto:\n'Analiza el sentimiento de este comentario en español. Clasifica como Positivo, Negativo o Neutral. Explica tu razonamiento. Texto: [texto]'\n\nPrompt para análisis de lotes:\n'Tengo 20 comentarios de clientes de un banco ecuatoriano. Para cada uno, clasifica el sentimiento (POS/NEG/NEU), el aspecto principal mencionado (servicio, precios, tecnología, etc.) y la intensidad (alta/media/baja). Responde en formato tabla CSV.'\n\nLimitación: GPT tiene cuota de tokens → para volúmenes grandes usar pysentimiento vía código.",
    },
    {
      titulo: "Aspect-Based Sentiment Analysis (ABSA)",
      contenido:
        "Problema: 'El Banco Pichincha tiene buena app pero el servicio al cliente es terrible'\n• App: POSITIVO\n• Servicio al cliente: NEGATIVO\n• Sentimiento global sería: NEUTRO → ¡pierde información!\n\nABSA extrae opiniones por aspecto:\n1. Identificar el aspecto: 'app', 'servicio al cliente'\n2. Clasificar el sentimiento de cada aspecto por separado\n\nHerramienta: pyABSA (Python) o prompt específico de ChatGPT\n\nEcuador: muy útil para análisis de reseñas de bancos, hoteles y restaurantes.",
    },
    {
      titulo: "Pipeline de monitoreo de marca en Ecuador",
      contenido:
        "1. Fuentes de datos: Twitter/X API, Google Reviews, Facebook (scraping ético)\n2. Recolección: Scrapy, Tweepy, Google Places API\n3. Limpieza: eliminar bots, spam, duplicados\n4. Análisis de sentimiento: pysentimiento o modelo fine-tuned\n5. Dashboard: Streamlit o Power BI con actualización periódica\n6. Alertas: si sentimiento negativo > 30% en 24h → notificación automática\n\nHerramientas comerciales equivalentes: Mention, Brandwatch ($300-$1,000/mes). Solución propia: ~$30/mes.",
    },
    {
      titulo: "Retos del sentimiento en español ecuatoriano",
      contenido:
        "Sarcasmo: 'Qué rápida la atención del SRI, solo 3 horas de espera 👏'\n→ Sentimiento real: negativo, pero texto aparece positivo\n\nDiminutivos: 'servicito regular' ≠ 'servicio regular'\n→ En Ecuador los diminutivos suavizan la crítica, el modelo puede perder el matiz\n\nJerga: 'La app del banco está a full' → positivo\n'Está quemado ese servicio' → negativo extremo\n\nEmojis: 🔥 puede ser positivo o negativo según contexto\n\nSolución: fine-tuning con datos ecuatorianos específicos del dominio.",
    },
    {
      titulo: "Resumen del Tema 6",
      contenido:
        "1. Análisis de sentimiento: determinar polaridad (positivo/negativo/neutral) de texto\n2. Enfoques: léxico (rápido), ML supervisado (preciso con datos propios), Transformer (estado del arte)\n3. pysentimiento: el mejor modelo para español LATAM, especial para redes sociales\n4. ABSA: analizar sentimiento por aspecto específico → más información que análisis global\n5. El español ecuatoriano tiene sarcasmo, jerga y diminutivos que desafían los modelos\n\nPróximo: Fine-tuning de análisis de sentimiento con datos de Ecuador",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la limitación principal del enfoque léxico para análisis de sentimiento?",
      opciones: [
        "Es muy lento para procesar texto",
        "No entiende sarcasmo, dobles negaciones ni contexto — trabaja con diccionarios de palabras aisladas",
        "Solo funciona en inglés",
        "Requiere demasiados datos de entrenamiento",
      ],
      respuesta: 1,
      explicacion:
        "El enfoque léxico compara palabras contra diccionarios de sentimiento pero no entiende el contexto. 'No es bueno' contiene la palabra positiva 'bueno' pero el sentimiento es negativo. El sarcasmo 'Qué bien que tardó 3 horas' sería detectado como positivo erróneamente.",
    },
    {
      pregunta: "¿Qué modelo de análisis de sentimiento en español está entrenado con tweets de LATAM y disponible en HuggingFace?",
      opciones: ["VADER español", "pysentimiento", "GPT-3 fine-tuned", "spaCy-sentiment"],
      respuesta: 1,
      explicacion:
        "pysentimiento es una librería Python con modelos entrenados en datos de Twitter en español latinoamericano. Detecta polaridad (POS/NEG/NEU) y emociones. Disponible en HuggingFace y con instalación simple via pip.",
    },
    {
      pregunta: "¿Por qué el Aspect-Based Sentiment Analysis (ABSA) aporta más valor que el análisis de sentimiento global?",
      opciones: [
        "Es más rápido de implementar",
        "Permite saber qué aspectos específicos (servicio, precio, app) son positivos o negativos, en lugar de un único score global que pierde información",
        "Solo funciona con reseñas en inglés",
        "No requiere datos de entrenamiento",
      ],
      respuesta: 1,
      explicacion:
        "Un comentario como 'La app es excelente pero el servicio al cliente es pésimo' tendría sentimiento global NEUTRO, perdiendo la información valiosa. ABSA extrae que app=POS y servicio=NEG, lo que permite a la empresa tomar acciones específicas.",
    },
    {
      pregunta: "En el contexto ecuatoriano, ¿cuál es el reto específico de la frase 'servicito regular' para un modelo de sentimiento?",
      opciones: [
        "Contiene un error ortográfico que el modelo no puede procesar",
        "El diminutivo 'servicito' suaviza la crítica con connotación peyorativa sutil que los modelos genéricos no capturan como negativo",
        "No hay reto — cualquier modelo identifica 'regular' como neutral",
        "La palabra 'servicio' no está en los diccionarios",
      ],
      respuesta: 1,
      explicacion:
        "En Ecuador y LATAM, los diminutivos frecuentemente tienen una función irónica o suavizante de la crítica. 'Servicito regular' implica un juicio negativo más matizado que 'servicio regular'. Los modelos genéricos suelen perder esta connotación cultural.",
    },
    {
      pregunta: "¿Cuál es el costo estimado de construir un sistema propio de monitoreo de marca con sentimiento NLP comparado con herramientas comerciales?",
      opciones: [
        "Son iguales — ambas opciones cuestan $300-$1,000/mes",
        "La solución propia cuesta ~$30/mes vs $300-$1,000/mes de herramientas como Mention o Brandwatch",
        "La solución propia es siempre más cara por el tiempo de desarrollo",
        "Las herramientas comerciales son gratuitas para PyMEs ecuatorianas",
      ],
      respuesta: 1,
      explicacion:
        "Un sistema de monitoreo con pysentimiento, Python y Streamlit puede construirse por el costo de servidores cloud (~$30/mes), comparado con los $300-$1,000 mensuales de herramientas comerciales como Mention o Brandwatch. El ROI del desarrollo propio es muy alto.",
    },
  ],
  ejercicio: {
    titulo: "Analizador de reseñas de restaurants de Quito con pysentimiento",
    objetivo:
      "Construir un sistema de análisis de sentimiento para reseñas de restaurantes de Quito usando pysentimiento, con visualización de resultados y detección de aspectos mencionados",
    herramientas: "Google Colab + Python + pysentimiento + pandas + matplotlib + seaborn",
    datosEjemplo:
      "Reseñas ficticias de restaurantes de Quito para el ejercicio:\n1. 'Excelente comida en La Ronda, el ceviche de camarón estaba delicioso pero el servicio fue lento'\n2. 'Pésimo lugar, los precios son un robo y la atención del mesero fue grosera'\n3. 'Chévere el ambiente, aunque la música estaba muy alta. La seco de pollo, rica'\n4. 'Recomendado! Las papas con cuero estaban a punto y el precio muy justo'\n5. 'El locro de papa estuvo muy bueno, ideal para el frío de Quito. Volvería'\n6. 'Regular nomás, ni chicha ni limonada. Esperaba más por lo que cobran'\n7. 'Tardaron 45 minutos el plato y cuando llegó estaba frío. Nunca más'\n8. 'El sancocho estuvo delicioso, las porciones grandes. Excelente relación precio-calidad'\n9. 'Bacán el lugar, pero muy lleno los fines de semana. La fritada impecable'\n10. 'Ambiente bonito pero la comida muy sosa, le faltaba sazón al seco'",
    pasos: [
      "Crear notebook 'Sentimiento_Restaurantes_Quito' en Google Colab",
      "Instalar pysentimiento: !pip install pysentimiento",
      "En ChatGPT pedir código para: 'importar pysentimiento, crear un analizador de sentimiento en español, analizar las 10 reseñas, guardar resultados en DataFrame con columnas: reseña, sentimiento, confianza, y mostrar distribución de sentimientos con gráfico de barras'",
      "Ejecutar el código. Verificar qué reseñas se clasificaron correctamente y cuáles no (especialmente la #6 con jerga 'ni chicha ni limonada' y la #3 con 'chévere')",
      "Análisis de aspectos manualmente: para las 10 reseñas, crear columna adicional 'aspectos_mencionados' con: comida, servicio, precio, ambiente, tiempo. Usar ChatGPT para extraer los aspectos automáticamente con prompt.",
      "Crear pivot table en pandas: filas=sentimiento, columnas=aspecto_mencionado, valores=count. ¿Qué aspecto tiene más menciones negativas?",
      "Generar gráfico de heatmap con seaborn mostrando la tabla de aspecto vs sentimiento",
      "Agregar 5 reseñas propias con texto inventado usando jerga ecuatoriana. Ejecutar el análisis y documentar si pysentimiento las clasifica correctamente.",
    ],
    resultado:
      "Sistema de análisis de sentimiento para 15 reseñas de restaurantes de Quito, con distribución de sentimientos, análisis de aspectos en tabla pivot, heatmap y evaluación de la precisión del modelo con jerga ecuatoriana local.",
    criterios: [
      { criterio: "Análisis de sentimiento de las 10 reseñas con pysentimiento funcionando", puntos: 25 },
      { criterio: "Extracción de aspectos mencionados (comida, servicio, precio, ambiente)", puntos: 20 },
      { criterio: "Tabla pivot y heatmap aspecto-sentimiento correctos", puntos: 20 },
      { criterio: "Evaluación crítica de errores del modelo (jerga, sarcasmo, diminutivos)", puntos: 20 },
      { criterio: "5 reseñas propias con jerga ecuatoriana y análisis de precisión", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "pysentimiento — Análisis de sentimiento en español",
      url: "https://github.com/pysentimiento/pysentimiento",
      tipo: "herramienta",
      descripcion: "Librería Python para análisis de sentimiento en español e italiano, con modelos entrenados en datos de Twitter de LATAM. Instalación simple con pip.",
    },
    {
      titulo: "HuggingFace — Modelos de sentimiento en español",
      url: "https://huggingface.co/models?pipeline_tag=text-classification&language=es",
      tipo: "herramienta",
      descripcion: "Colección de modelos pre-entrenados para clasificación de texto en español, incluyendo varios de análisis de sentimiento fine-tuned en distintos dominios.",
    },
    {
      titulo: "TASS — Corpus de sentimiento en español LATAM",
      url: "http://tass.sepln.org/",
      tipo: "documentacion",
      descripcion: "Workshop de análisis de sentimiento en español con corpus anotados de Twitter LATAM. Recurso académico para entrenamiento y evaluación de modelos.",
    },
    {
      titulo: "SentimentAnalysis.net — Guía completa",
      url: "https://sentimentanalysis.net/",
      tipo: "lectura",
      descripcion: "Guía completa sobre técnicas de análisis de sentimiento: enfoques léxicos, ML y deep learning, con casos de uso empresariales.",
    },
  ],
  teoria: `El análisis de sentimiento es la tarea de NLP que busca determinar la actitud, opinión o emoción expresada en un fragmento de texto. Para las empresas en Ecuador, es una de las aplicaciones de NLP con mayor ROI inmediato: en lugar de leer manualmente cientos de reseñas de Google, comentarios de Instagram o respuestas a encuestas, un sistema de análisis de sentimiento puede procesar miles de textos en segundos y producir métricas agregadas, tendencias temporales y alertas automáticas.

El análisis de sentimiento opera en varios niveles de sofisticación. El nivel más básico es la clasificación de polaridad: positivo, negativo o neutral. Un nivel intermedio detecta emociones específicas: alegría, tristeza, ira, miedo, sorpresa, disgusto, anticipación. El nivel más avanzado y útil para empresas es el Aspect-Based Sentiment Analysis (ABSA): no solo "este comentario es negativo" sino "este comentario es positivo sobre el precio pero negativo sobre el servicio al cliente". Esta granularidad permite a la empresa tomar acciones específicas en lugar de generales.

Los enfoques técnicos para análisis de sentimiento han evolucionado desde métodos basados en léxicos hasta los transformers modernos. Los métodos léxicos, como VADER, usan diccionarios de palabras con puntuaciones de sentimiento predefinidas. Son rápidos, interpretables y funcionan sin datos de entrenamiento, pero fallan ante el sarcasmo, la ironía, las dobles negaciones y el argot. Los métodos de machine learning supervisado entrenan clasificadores (regresión logística, SVM, random forest) con textos etiquetados manualmente, logrando mayor precisión en dominios específicos. Los modelos basados en transformers (BERT y sus variantes) representan el estado del arte: comprenden el contexto completo de la frase y capturan sutilezas semánticas que los métodos anteriores pierden.

Para el español ecuatoriano específicamente, pysentimiento es la herramienta más recomendada como punto de partida. Esta librería Python, disponible en HuggingFace y con instalación via pip, contiene modelos entrenados con datos de Twitter en español latinoamericano y detecta polaridad (positivo, negativo, neutro), así como emociones básicas. Su ventaja sobre los modelos genéricos de BERT es que fue entrenada con el tipo de texto informal, abreviado y lleno de argot que caracteriza las redes sociales latinoamericanas.

Los retos específicos del análisis de sentimiento en el contexto ecuatoriano son múltiples y requieren atención especial. El sarcasmo y la ironía son frecuentes en el español latinoamericano: "Qué rápida la atención del SRI, solo 3 horas de espera 👏" tiene sentimiento real negativo pero las palabras individuales sugieren positivo. Los diminutivos tienen una carga afectiva ambigua: "servicito regular" implica una crítica más severa que "servicio regular". La jerga local ("bacán", "chévere", "a full", "quemado", "chiro") no está en los datos de entrenamiento de la mayoría de modelos y puede clasificarse incorrectamente.

Un caso de uso particularmente valioso para el mercado ecuatoriano es el análisis masivo de reseñas de Google My Business para restaurantes, hoteles y servicios. Ecuador tiene una cultura fuerte de reseñas en Google (especialmente desde la pandemia que aceleró el comportamiento digital), y las empresas medianas reciben entre 50 y 500 nuevas reseñas mensuales. Un sistema de análisis de sentimiento con extracción de aspectos puede generar automáticamente un informe semanal: "Esta semana el aspecto más mencionado negativamente fue el tiempo de espera (18 menciones, 67% negativo). La comida sigue siendo el aspecto más positivo (45 menciones, 89% positivo)". Este tipo de inteligencia, que antes requería un analista dedicado, se puede automatizar completamente.

La arquitectura para un sistema de monitoreo de sentimiento para una empresa ecuatoriana mediana puede construirse completamente con herramientas gratuitas o de muy bajo costo: Python para el pipeline de análisis, pysentimiento para la clasificación, pandas para la manipulación de datos, Streamlit para el dashboard (gratuito para proyectos no comerciales), y notificaciones automáticas por correo o WhatsApp. El costo total es básicamente el hosting del servidor, que puede ser mínimo en plataformas como Railway o Render. Esto contrasta con las herramientas comerciales de monitoreo como Mention o Brandwatch que cuestan entre $300 y $1,000 mensuales.`,
};

const tema7: TemaC12 = placeholder(7, "Fine-tuning de sentimiento con datos ecuatorianos", MOD2, 2);
const tema8: TemaC12 = placeholder(8, "Análisis de reseñas y comentarios masivos", MOD2, 2);
const tema9: TemaC12 = placeholder(9, "Dashboard de sentimiento en tiempo real con Streamlit", MOD2, 2);
const tema10: TemaC12 = placeholder(10, "Evaluación y métricas de modelos de clasificación NLP", MOD2, 2);

// ─── MÓDULO 3: Chatbots con LLMs ─────────────────────────────────────────────

const MOD3 = "Chatbots con LLMs";

const tema11: TemaC12 = {
  id: 11,
  titulo: "Arquitectura de chatbots con LLMs — de reglas a RAG",
  modulo: MOD3,
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Cómo construir chatbots con LLMs — arquitecturas y ejemplos",
  videoDuracion: "~45 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "Arquitectura de Chatbots con LLMs — de Reglas a RAG\nC12. Procesamiento de Lenguaje Natural — Tema 11\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "Evolución de los chatbots",
      contenido:
        "GEN 1 (1966-2010): Basados en reglas\n• ELIZA (1966): respuestas predefinidas con patrones simples\n• Árboles de decisión: si el cliente dice X, responder Y\n• Limitación: no entienden variaciones del lenguaje\n\nGEN 2 (2015-2022): ML + NLU\n• Intención + entidades: clasificar qué quiere el usuario\n• Herramientas: Dialogflow, Rasa, Microsoft LUIS\n\nGEN 3 (2022-2026): LLMs\n• GPT, Claude, Gemini como motor de conversación\n• Comprensión profunda del contexto y variaciones",
    },
    {
      titulo: "Arquitectura de chatbot con LLM — componentes",
      contenido:
        "1. INTERFAZ: chat web, WhatsApp, Telegram, voz\n2. SISTEMA DE PROMPT: instrucciones del bot (personalidad, límites, tono)\n3. MEMORIA: historial de conversación (short-term) + información del usuario (long-term)\n4. CONOCIMIENTO EXTERNO: base de datos, documentos, FAQs (para RAG)\n5. LLM: el motor de razonamiento y generación\n6. ACCIONES: APIs externas (consultar saldo, crear ticket, enviar email)\n7. GUARDRAILS: filtros de seguridad, límites de tema, escalamiento a humano",
    },
    {
      titulo: "System Prompt — el DNA del chatbot",
      contenido:
        "El system prompt define la personalidad y reglas del chatbot\n\nEjemplo para un banco ecuatoriano:\n'Eres el asistente virtual de Banco Andino Ecuador. Tu nombre es Andino. Eres amable, formal pero cercano. Solo respondes preguntas sobre productos bancarios, tasas, y trámites del banco. Si te preguntan algo fuera de ese alcance, di amablemente que no puedes ayudar con eso. Nunca inventes información — si no sabes, deriva al asesor humano al 1800-ANDINO. Habla en español formal del Ecuador, no uses jerga.'\n\nBueno el system prompt = chatbot confiable y en marca.",
    },
    {
      titulo: "RAG — Retrieval Augmented Generation",
      contenido:
        "Problema: el LLM no sabe los detalles específicos de tu empresa\n(horarios, precios, políticas, productos específicos)\n\nSolución: RAG\n1. Tu documentación (FAQ, catálogo, manual) se convierte en vectores\n2. Cuando el usuario pregunta, se buscan los fragmentos más relevantes\n3. Esos fragmentos se inyectan en el prompt del LLM\n4. El LLM responde basándose en TU documentación\n\nVentaja: el chatbot responde con información real y actualizada de tu empresa, sin alucinaciones.",
    },
    {
      titulo: "Herramientas para construir chatbots con LLMs",
      contenido:
        "Sin código:\n• ChatGPT Custom GPTs: gratis con Plus, puedes subir documentos\n• Claude Projects: memoria larga con documentos propios\n• Botpress: interfaz visual + LLM\n\nCon código (Python):\n• LangChain: framework para apps LLM con RAG\n• LlamaIndex: especializado en RAG con documentos\n• OpenAI Assistants API: con file search nativo\n• Groq API: LLMs ultra-rápidos y gratuitos con límites\n\nDespliegue Ecuador:\n• WhatsApp Business API (Meta) + Twilio como puente\n• Telegram Bot API (gratis, sin límites de mensajes)",
    },
    {
      titulo: "Chatbots en WhatsApp — el canal dominante en Ecuador",
      contenido:
        "Ecuador: WhatsApp tiene penetración del 92% en smartphones\nLas empresas ecuatorianas prefieren WhatsApp Business sobre web chat\n\nArquitectura:\n1. Cliente escribe en WhatsApp\n2. WhatsApp Business API (Meta) recibe el mensaje\n3. Webhook en tu servidor Python procesa el mensaje\n4. LLM genera respuesta con system prompt de la empresa\n5. La respuesta vuelve al cliente en WhatsApp\n\nHerramientas: Twilio (con costo), Ultramsg ($15/mes), Baileys (open source, no oficial)",
    },
    {
      titulo: "Escalamiento humano — regla de oro",
      contenido:
        "Todo chatbot debe tener escalamiento claro a un humano\nRegla: si el bot no puede resolver en 3 intentos → derivar a agente\n\nCasos de escalamiento automático:\n• Cliente expresa frustración alta (sentimiento negativo intenso)\n• Pregunta fuera del scope del bot 3+ veces\n• Solicitud de queja formal\n• Transacción de alto valor (préstamo, inversión importante)\n• Emergencia o urgencia expresada\n\nEcuador: el 68% de los clientes prefiere hablar con humano para temas complejos. El bot es para resolver el 80% de consultas simples.",
    },
    {
      titulo: "Métricas de éxito de un chatbot",
      contenido:
        "Tasa de resolución: % de conversaciones resueltas sin escalamiento humano (objetivo: >70%)\nSatisfacción (CSAT): encuesta al final de la conversación (objetivo: >4/5)\nTasa de abandono: % que abandona la conversación sin resolver (objetivo: <15%)\nTiempo de respuesta: promedio de segundos para cada respuesta del bot (objetivo: <3 seg)\nEscalamientos: % de conversaciones derivadas a humano (referencial: 20-30%)\nTemas más frecuentes: top 10 preguntas para optimizar el sistema prompt",
    },
    {
      titulo: "Resumen del Tema 11",
      contenido:
        "1. Los chatbots evolucionaron de reglas estáticas a LLMs que comprenden contexto\n2. System prompt = el DNA del chatbot: define personalidad, límites y tono\n3. RAG permite que el bot responda con información real de tu empresa sin alucinaciones\n4. WhatsApp (92% penetración) es el canal dominante en Ecuador para chatbots\n5. El escalamiento a humano es obligatorio para los casos complejos\n\nPróximo: Construir tu primer chatbot con OpenAI y LangChain",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué es el RAG (Retrieval Augmented Generation) en el contexto de chatbots con LLMs?",
      opciones: [
        "Una técnica para hacer el chatbot más rápido",
        "Un sistema que busca fragmentos relevantes de tus documentos y los inyecta en el prompt del LLM para que responda con información real de tu empresa",
        "Un tipo de red neuronal recurrente",
        "Un protocolo de seguridad para chatbots",
      ],
      respuesta: 1,
      explicacion:
        "RAG combina búsqueda de información (Retrieval) con generación de texto (Generation). Convierte tus documentos en vectores, busca los más relevantes para la pregunta del usuario, y los incluye en el prompt del LLM. Esto elimina las alucinaciones sobre datos de tu empresa específica.",
    },
    {
      pregunta: "¿Cuál es la penetración de WhatsApp en smartphones en Ecuador?",
      opciones: ["45%", "67%", "92%", "100%"],
      respuesta: 2,
      explicacion:
        "WhatsApp tiene una penetración del 92% en smartphones ecuatorianos, lo que lo convierte en el canal de comunicación digital dominante y el más importante para chatbots de atención al cliente en Ecuador.",
    },
    {
      pregunta: "¿Cuál es la tasa de resolución objetivo para que un chatbot se considere exitoso?",
      opciones: ["Mayor al 40%", "Mayor al 70%", "100% — nunca debe escalar", "No importa si el CSAT es alto"],
      respuesta: 1,
      explicacion:
        "Una tasa de resolución superior al 70% es el objetivo estándar de la industria: el bot resuelve de forma autónoma más de 7 de cada 10 conversaciones. El 20-30% restante se deriva a agentes humanos para casos complejos.",
    },
    {
      pregunta: "En la arquitectura de un chatbot empresarial, ¿qué función cumple el 'system prompt'?",
      opciones: [
        "Es el código Python que ejecuta el chatbot",
        "Define la personalidad, el tono, los límites temáticos y las reglas de comportamiento del chatbot",
        "Es la interfaz de usuario que ve el cliente",
        "Es la base de datos donde se guardan las conversaciones",
      ],
      respuesta: 1,
      explicacion:
        "El system prompt es el conjunto de instrucciones invisibles para el usuario que definen quién es el bot, cómo debe hablar, qué puede y no puede responder, y cómo debe manejar situaciones específicas. Es el 'DNA' del chatbot — determinante para su comportamiento.",
    },
    {
      pregunta: "¿Cuándo debe escalar automáticamente un chatbot a un agente humano?",
      opciones: [
        "Nunca — el objetivo es cero escalamientos",
        "Solo cuando el cliente lo pide explícitamente",
        "Cuando el cliente expresa frustración alta, la pregunta está fuera del scope después de 3 intentos, o es una transacción de alto valor",
        "Siempre después de 2 minutos de conversación",
      ],
      respuesta: 2,
      explicacion:
        "El escalamiento automático debe ocurrir en situaciones de alto riesgo o insatisfacción: frustración expresada (sentimiento negativo intenso), preguntas fuera del scope después de múltiples intentos, solicitudes de queja formal, transacciones de alto valor, o cualquier urgencia expresada.",
    },
  ],
  ejercicio: {
    titulo: "Construir chatbot de atención al cliente para empresa ecuatoriana con GPT",
    objetivo:
      "Construir un chatbot funcional de atención al cliente usando OpenAI API o Claude API con un system prompt personalizado para una empresa ecuatoriana, con manejo de contexto de conversación",
    herramientas: "Python + OpenAI API (o Claude API via Anthropic) + Google Colab o local + Streamlit (opcional para UI)",
    datosEjemplo:
      "Empresa: TECNOFAST S.A. — empresa de internet y telecomunicaciones en Ecuador\nProductos: Internet fibra óptica 50Mbps ($29.99/mes), 100Mbps ($49.99/mes), 300Mbps ($79.99/mes)\nContrato mínimo: 12 meses\nZonas de cobertura: Quito (todas las zonas), Guayaquil (norte y centro), Cuenca\nSoporte técnico: 24/7 al 1800-TECNO o WhatsApp 0998765432\nInstalación: gratis en contratos anuales, $50 en mensual",
    pasos: [
      "Obtener API key de OpenAI (platform.openai.com) o usar Claude API (console.anthropic.com). Ambas tienen créditos gratuitos para empezar.",
      "Crear notebook en Google Colab o script Python local",
      "Instalar: !pip install openai (o anthropic para Claude)",
      "Diseñar el system prompt de TECNOFAST con ChatGPT: 'Ayúdame a escribir un system prompt para un chatbot de atención al cliente de TECNOFAST, empresa de telecomunicaciones en Ecuador. El bot se llama Speedy. Los datos de la empresa son: [pegar datos de ejemplo]'. Refinar el prompt hasta que sea completo y en tono apropiado.",
      "Implementar el loop de conversación: el código debe mantener el historial de mensajes (messages list) y enviarlo en cada llamada a la API para que el bot recuerde el contexto",
      "Probar con estas conversaciones:\n   a) '¿Cuánto cuesta el internet de 100Mbps?'\n   b) '¿Tienen cobertura en Manta?' (respuesta correcta: no)\n   c) '¿Puedo contratar sin contrato anual?'\n   d) 'Mi internet no funciona, necesito soporte técnico'\n   e) '¿Cuánto cobran por la instalación si me comprometo 12 meses?'",
      "Implementar un contador de 'intención fuera de scope': si el usuario pregunta algo que TECNOFAST no puede resolver 2 veces seguidas, el bot debe derivar: 'Para esta consulta, te conecto con un asesor humano. Llama al 1800-TECNO o escríbenos al WhatsApp 0998765432'",
      "Reflexión final: ¿qué preguntas respondió correctamente? ¿Cuáles falló? ¿Qué agregarías al system prompt para mejorar las respuestas problemáticas?",
    ],
    resultado:
      "Chatbot funcional de TECNOFAST con system prompt personalizado, manejo de historial de conversación, respuestas correctas a las 5 conversaciones de prueba, escalamiento automático implementado y análisis de mejoras.",
    criterios: [
      { criterio: "Chatbot funcional con API conectada y conversación fluida", puntos: 30 },
      { criterio: "System prompt completo con personalidad, límites y tono correcto de TECNOFAST", puntos: 25 },
      { criterio: "Manejo correcto de historial de conversación (contexto entre mensajes)", puntos: 15 },
      { criterio: "Escalamiento automático implementado y probado", puntos: 15 },
      { criterio: "Análisis de aciertos y errores con propuestas de mejora al system prompt", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "OpenAI API — Documentación oficial",
      url: "https://platform.openai.com/docs",
      tipo: "documentacion",
      descripcion: "Documentación completa de la API de OpenAI para construir aplicaciones con GPT-4o. Incluye tutoriales de chatbots con manejo de conversaciones.",
    },
    {
      titulo: "LangChain — Framework para aplicaciones LLM",
      url: "https://python.langchain.com/docs/get_started/introduction",
      tipo: "documentacion",
      descripcion: "Framework Python para construir aplicaciones con LLMs, RAG, agentes y memoria. El más usado para chatbots empresariales en producción.",
    },
    {
      titulo: "Streamlit — UIs de IA en Python",
      url: "https://streamlit.io/",
      tipo: "herramienta",
      descripcion: "Framework para crear interfaces web de aplicaciones de IA en Python sin HTML/CSS. Gratis y open source. Ideal para demos de chatbots.",
    },
    {
      titulo: "WhatsApp Business API — Meta",
      url: "https://developers.facebook.com/docs/whatsapp/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de la API de WhatsApp Business para integrar chatbots con LLMs en WhatsApp. Requiere verificación empresarial.",
    },
  ],
  teoria: `Los chatbots han evolucionado en tres generaciones fundamentalmente distintas. La primera generación (1966-2010) usaba reglas estáticas: el sistema ELIZA de 1966 reconocía patrones de texto predefinidos y respondía con frases preconfiguradas. Esta arquitectura, aunque simple, sigue presente en sistemas legacy de muchas empresas ecuatorianas como menús interactivos de call centers con opciones del 1 al 9. La segunda generación (2015-2022) incorporó machine learning para reconocimiento de intenciones y extracción de entidades, usando herramientas como Dialogflow de Google o Microsoft LUIS. Aunque mucho más flexible, seguía requiriendo que el desarrollador definiera manualmente todas las intenciones posibles. La tercera generación (2022-presente) usa LLMs como motor de razonamiento: el chatbot comprende lenguaje natural con todas sus variaciones sin necesitar intenciones predefinidas.

La arquitectura de un chatbot moderno basado en LLM tiene varios componentes críticos. El system prompt es el elemento más importante: define quién es el bot, cómo debe comunicarse, qué puede y no puede responder, y cómo manejar situaciones específicas. Un system prompt bien diseñado es la diferencia entre un bot que "alucina" información incorrecta sobre tu empresa y uno que responde de forma consistente y en marca. Para una empresa ecuatoriana, el system prompt debe especificar el tono (formal-amigable, coloquial, técnico), el idioma (español estándar, no jerga), las restricciones temáticas (solo responder sobre los productos de la empresa), y las políticas de escalamiento.

El RAG (Retrieval Augmented Generation) resuelve el principal problema de los chatbots con LLMs para uso empresarial: los modelos de lenguaje no conocen los detalles específicos de cada empresa. El LLM no sabe cuáles son los precios actuales de tus planes de internet, tus horarios de atención, tus políticas de devolución ni los nombres de tus ejecutivos de ventas. Sin RAG, el bot inventaría información plausible pero incorrecta. Con RAG, la documentación de la empresa (FAQs, catálogos, manuales, políticas) se convierte en vectores de embeddings almacenados en una base de datos vectorial. Cuando el usuario hace una pregunta, el sistema busca los fragmentos de documentación más relevantes y los incluye en el contexto del LLM, que entonces responde basándose en información real y actualizada.

Para el mercado ecuatoriano específicamente, WhatsApp es el canal indiscutible para chatbots de atención al cliente. Con una penetración del 92% en smartphones, es donde los ecuatorianos ya están conversando con amigos, familia y empresas. Las empresas que implementan chatbots en WhatsApp reportan tasas de respuesta y engagement significativamente superiores a los chatbots web tradicionales. La API oficial de WhatsApp Business de Meta permite conectar un LLM con el chat de WhatsApp de una empresa, aunque requiere verificación empresarial y tiene costos por conversación. Alternativas como Twilio ofrecen una capa de abstracción más simple para el desarrollo.

La gestión del historial de conversación es crucial para la experiencia del usuario. Un chatbot que "olvida" lo que el usuario dijo dos mensajes antes genera frustración. La solución técnica es sencilla: mantener una lista de mensajes (con roles "user" y "assistant") y enviarla completa en cada llamada a la API del LLM. El modelo tiene contexto de toda la conversación y puede referirse a información mencionada anteriormente. Para conversaciones largas, se implementa una ventana deslizante que mantiene los últimos N mensajes para no exceder el límite de contexto del modelo.

El escalamiento a agentes humanos no es opcional: es un componente de diseño obligatorio. Los estudios de experiencia de cliente muestran que el 68% de los ecuatorianos prefiere hablar con un humano para temas complejos o emocionalmente cargados (quejas, problemas técnicos graves, decisiones financieras importantes). El chatbot debe reconocer automáticamente cuándo escalar: cuando el sentimiento del usuario es negativo de forma intensa, cuando la pregunta está fuera del scope del bot después de múltiples intentos, cuando el usuario solicita explícitamente un humano, o cuando la transacción implica riesgo financiero significativo. El escalamiento no es un fracaso del chatbot — es parte del diseño correcto.`,
};

const tema12: TemaC12 = placeholder(12, "RAG — Retrieval Augmented Generation para empresas", MOD3, 3);
const tema13: TemaC12 = placeholder(13, "Chatbots en WhatsApp con LangChain y API de Meta", MOD3, 3);
const tema14: TemaC12 = placeholder(14, "Evaluación de chatbots: CSAT, tasa de resolución y más", MOD3, 3);
const tema15: TemaC12 = placeholder(15, "Chatbots de voz con Whisper y text-to-speech", MOD3, 3);

// ─── MÓDULO 4: Casos Español Ecuador ─────────────────────────────────────────

const MOD4 = "Casos Español Ecuador";

const tema16: TemaC12 = {
  id: 16,
  titulo: "NLP para análisis de encuestas en Ecuador",
  modulo: MOD4,
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Análisis automatizado de encuestas con NLP — Python",
  videoDuracion: "~38 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "NLP para Análisis de Encuestas en Ecuador\nC12. Procesamiento de Lenguaje Natural — Tema 16\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "El problema de las preguntas abiertas en encuestas",
      contenido:
        "Encuestas con preguntas abiertas generan datos ricos y cualitativos\nProblema: si la encuesta tiene 500, 1,000 o 10,000 respuestas, es imposible leerlas todas\n\nEjemplo Ecuador:\nMinisterio de Educación encuesta a 80,000 docentes: '¿Qué mejoras propone para la educación pública?'\n→ 80,000 respuestas en texto libre\n→ Un equipo de 10 personas tardaría 3 meses en leerlas\n→ Con NLP: análisis completo en 2-3 horas",
    },
    {
      titulo: "Técnicas NLP para análisis de encuestas",
      contenido:
        "1. Análisis de sentimiento: ¿la respuesta es positiva, negativa o neutral?\n2. Topic Modeling: ¿cuáles son los temas principales emergentes?\n3. Extracción de temas con ChatGPT: más rápido que entrenamiento de modelos\n4. Clustering semántico: agrupar respuestas similares automáticamente\n5. Análisis de frecuencia: palabras y frases más mencionadas\n6. Extracción de entidades: nombres de lugares, personas, instituciones mencionadas",
    },
    {
      titulo: "Topic Modeling — LDA y alternativas modernas",
      contenido:
        "LDA (Latent Dirichlet Allocation): método clásico, descubre N temas automáticamente\n• Cada documento = mezcla de temas\n• Cada tema = distribución de palabras\n• Útil para exploración cuando no sabes los temas de antemano\n\nBERTopic: LDA moderno con embeddings\n• Agrupa documentos semánticamente similares\n• Genera etiquetas de temas automáticamente\n• pip install bertopic\n\nAlternativa simple: usar ChatGPT para clasificar en temas predefinidos\n• Más rápido, no requiere configuración\n• Menos escalable para millones de respuestas",
    },
    {
      titulo: "Flujo de análisis de encuesta — paso a paso",
      contenido:
        "1. Recolectar respuestas en CSV o Google Forms → descargar como Excel\n2. Limpiar: eliminar respuestas vacías, spam, duplicados\n3. Análisis de sentimiento: pysentimiento por respuesta\n4. Topic Modeling con BERTopic o ChatGPT en lotes de 50\n5. Clustering: agrupar respuestas por similitud semántica\n6. Dashboard final: sentimiento por pregunta + temas + citas representativas\n\nHerramientas: pandas + pysentimiento + BERTopic + Streamlit/Tableau",
    },
    {
      titulo: "Contexto Ecuador — encuestas de instituciones públicas",
      contenido:
        "INEC (Instituto Nacional de Estadística): Encuesta Nacional de Empleo y Desempleo (ENEMDU), Censo 2022\nMSP: encuestas de satisfacción en centros de salud\nMinisterio de Educación: encuestas a docentes y padres de familia\nSRI: encuestas de satisfacción del contribuyente\nBancos ecuatorianos: NPS (Net Promoter Score) post-servicio\n\nTodas tienen preguntas abiertas con miles de respuestas que se analizan manualmente — oportunidad para NLP.",
    },
    {
      titulo: "Análisis de NPS (Net Promoter Score) con NLP",
      contenido:
        "NPS: '¿Qué probabilidad hay de que nos recomiende? (0-10)'\nDetractores: 0-6 · Pasivos: 7-8 · Promotores: 9-10\n\nCon NLP: combinar la puntuación numérica con la pregunta abierta '¿Por qué?'\n\nInsight poderoso:\nDetractores (puntuación 0-6) mencionan principalmente:\n• 45% tiempo de espera\n• 30% precio\n• 25% calidad del producto\n\nEsto permite acciones específicas, no 'mejorar la satisfacción' en general\nAnálisis con NLP: 30 minutos. Sin NLP: semanas de lectura manual.",
    },
    {
      titulo: "Análisis de voz del ciudadano — redes sociales + gobierno",
      contenido:
        "Gobierno Ecuador 2024: el MSP monitorea menciones en redes de:\n• Quejas sobre hospitales públicos\n• Problemas de abastecimiento de medicamentos\n• Satisfacción con campañas de vacunación\n\nHerramienta: scraping ético de Twitter/X + análisis pysentimiento + dashboard Streamlit\n\nMunicipios ecuatorianos como Quito y Guayaquil:\n• Monitoreo de sentimiento sobre obras viales\n• Análisis de quejas en redes durante emergencias naturales\n• Medición de aprobación de políticas públicas",
    },
    {
      titulo: "Exportación de resultados — formatos útiles",
      contenido:
        "Para gerentes/directivos:\n• PDF con resumen ejecutivo + gráficos + top quotes\n• Presentación PowerPoint / Google Slides automática\n\nPara analistas:\n• Excel / CSV con todas las respuestas + sentimiento + tema asignado\n\nPara sistemas externos:\n• JSON API para integración con dashboards de BI\n\nGeneración automática de reporte:\n'Tengo estos resultados de análisis NLP de encuesta: [datos]. Genera un resumen ejecutivo de 300 palabras para el directorio de la empresa'",
    },
    {
      titulo: "Resumen del Tema 16",
      contenido:
        "1. NLP transforma el análisis de encuestas de semanas a horas\n2. Topic Modeling (BERTopic) descubre temas automáticamente sin conocerlos de antemano\n3. NPS + NLP = insights accionables sobre por qué los clientes son promotores o detractores\n4. Ecuador: INEC, MSP, SRI y municipios tienen necesidades urgentes de análisis NLP\n5. El reporte ejecutivo final puede generarse automáticamente con ChatGPT\n\nPróximo: Chatbot de atención ciudadana en español ecuatoriano",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la ventaja principal de usar BERTopic sobre LDA clásico para análisis de encuestas?",
      opciones: [
        "BERTopic es más rápido en todos los casos",
        "BERTopic usa embeddings semánticos y agrupa documentos por significado en lugar de solo frecuencia de palabras, generando topics más coherentes",
        "LDA requiere datos en inglés y BERTopic no",
        "BERTopic es gratuito y LDA tiene licencia",
      ],
      respuesta: 1,
      explicacion:
        "BERTopic usa BERT embeddings para representar documentos semánticamente antes de agruparlos, lo que produce topics más coherentes y significativos que LDA clásico, que solo mira frecuencia de palabras sin entender el contexto.",
    },
    {
      pregunta: "En análisis de NPS con NLP, ¿cuál es el insight más valioso que se puede extraer?",
      opciones: [
        "La puntuación promedio global",
        "La distribución de promotores, pasivos y detractores",
        "Los temas específicos que los detractores mencionan más frecuentemente en sus respuestas abiertas",
        "El número total de respuestas recibidas",
      ],
      respuesta: 2,
      explicacion:
        "Saber que el NPS es -15 dice poco. Saber que el 45% de los detractores menciona 'tiempo de espera' como problema principal permite tomar una acción específica y medible. El NLP convierte el número en un diagnóstico accionable.",
    },
    {
      pregunta: "¿Qué institución ecuatoriana tiene datos de 80,000 respuestas abiertas de docentes que se beneficiarían de análisis NLP?",
      opciones: ["SRI", "IESS", "Ministerio de Educación", "SUPERCIAS"],
      respuesta: 2,
      explicacion:
        "El Ministerio de Educación de Ecuador encuesta a más de 80,000 docentes públicos. Las preguntas abiertas como '¿Qué mejoras propone para la educación pública?' generan decenas de miles de respuestas que un equipo humano tardaría meses en analizar y que NLP puede procesar en horas.",
    },
    {
      pregunta: "¿Cuál es el flujo correcto para análisis de encuesta con NLP?",
      opciones: [
        "Topic Modeling → Limpiar → Recolectar → Dashboard",
        "Recolectar → Limpiar → Sentimiento + Topic Modeling → Clustering → Dashboard",
        "Dashboard → Recolectar → Limpiar → Modelo",
        "Limpiar → Recolectar → Dashboard → Sentimiento",
      ],
      respuesta: 1,
      explicacion:
        "El flujo correcto es: 1) Recolectar las respuestas, 2) Limpiar (eliminar vacíos, spam, duplicados), 3) Aplicar análisis de sentimiento y topic modeling, 4) Clustering por similitud semántica, 5) Presentar en dashboard con visualizaciones.",
    },
    {
      pregunta: "¿Qué herramienta se recomienda para generar automáticamente el reporte ejecutivo de resultados de análisis NLP?",
      opciones: [
        "Jupyter Notebook como documento final",
        "ChatGPT con los datos del análisis como input del prompt",
        "Excel con tablas pivot solamente",
        "No se puede automatizar — requiere redacción humana siempre",
      ],
      respuesta: 1,
      explicacion:
        "ChatGPT puede tomar los datos del análisis NLP (porcentajes de sentimiento, temas principales, citas representativas) como input y generar automáticamente un resumen ejecutivo narrativo de 200-400 palabras listo para presentar al directorio.",
    },
  ],
  ejercicio: {
    titulo: "Análisis NLP de respuestas abiertas de encuesta de satisfacción bancaria",
    objetivo:
      "Aplicar un pipeline completo de NLP para analizar 30 respuestas abiertas de una encuesta de satisfacción de clientes de un banco ecuatoriano, incluyendo sentimiento, temas y generación automática de reporte ejecutivo",
    herramientas: "Google Colab + Python + pysentimiento + BERTopic + pandas + matplotlib + ChatGPT",
    datosEjemplo:
      "Pregunta de encuesta: '¿Cuál es el principal problema que ha tenido con nuestro servicio en los últimos 3 meses?'\n\nRespuestas ficticias de clientes de banco ecuatoriano (selección de 10 para el ejercicio):\n1. 'La aplicación móvil se cae constantemente cuando quiero transferir. Muy frustrante'\n2. 'El tiempo de atención en las ventanillas es eterno. 2 horas la última vez'\n3. 'Cobran comisiones altísimas por cada transacción. En el Produbanco es más barato'\n4. 'El servicio al cliente es excelente, siempre me ayudan con mis dudas'\n5. 'La app es buena pero me bloquearon la tarjeta sin avisarme, fue un mal rato'\n6. 'Los cajeros automáticos frecuentemente sin papel o sin efectivo'\n7. 'Todo bien con el servicio, aunque me gustaría más sucursales en el norte de Quito'\n8. 'Perdí mi tarjeta y el proceso de reposición tardó 15 días. Muy lento'\n9. 'Los asesores son atentos pero a veces no saben responder consultas técnicas'\n10. 'Me cobraron una comisión que no me explicaron al abrir la cuenta. Me siento engañado'",
    pasos: [
      "Crear notebook 'NLP_Encuesta_Banco_Ecuador' en Google Colab",
      "Instalar librerías: !pip install pysentimiento bertopic pandas matplotlib",
      "Crear DataFrame con las 10 respuestas y ejecutar pysentimiento para clasificar el sentimiento de cada una. Documentar en tabla: respuesta, sentimiento, confianza.",
      "Con ChatGPT, extraer el tema principal de cada respuesta con prompt: 'Para cada uno de estos 10 comentarios de clientes de banco ecuatoriano: [pegar respuestas]. Clasifica el tema principal en: app_digital, tiempo_espera, comisiones, calidad_servicio, cajeros, procesos_operativos, comunicacion. Responde solo con tabla CSV: numero_respuesta, tema'",
      "Combinar el análisis de sentimiento con los temas en el DataFrame de pandas",
      "Crear tabla cruzada (pivot table): filas=tema, columnas=sentimiento, valores=count",
      "Generar 2 visualizaciones: gráfico de barras de distribución de sentimiento general + heatmap de tema vs sentimiento",
      "Generar reporte ejecutivo con ChatGPT: 'Aquí están los resultados del análisis NLP de 10 respuestas de encuesta de satisfacción de un banco ecuatoriano: [pegar tabla pivot + distribución de sentimiento]. Genera un reporte ejecutivo de 250 palabras para el Gerente de Experiencia del Cliente con: hallazgos principales, top 3 problemas urgentes y 3 recomendaciones accionables'",
      "Copiar el reporte a Google Docs y darle formato profesional",
    ],
    resultado:
      "Análisis NLP completo de 10 respuestas de encuesta bancaria ecuatoriana: clasificación de sentimiento, extracción de temas, tabla cruzada y heatmap, más reporte ejecutivo de 250 palabras generado automáticamente con ChatGPT y formateado en Google Docs.",
    criterios: [
      { criterio: "Clasificación de sentimiento correcta para las 10 respuestas con pysentimiento", puntos: 25 },
      { criterio: "Extracción de temas completa y coherente para las 10 respuestas", puntos: 20 },
      { criterio: "Tabla cruzada y heatmap tema vs sentimiento correctos", puntos: 20 },
      { criterio: "Reporte ejecutivo de 250 palabras con hallazgos y recomendaciones accionables", puntos: 25 },
      { criterio: "Formato profesional en Google Docs del reporte final", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "BERTopic — Topic Modeling moderno con BERT",
      url: "https://maartengr.github.io/BERTopic/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de BERTopic con tutoriales, ejemplos en español y guías de implementación para análisis de grandes corpus de texto.",
    },
    {
      titulo: "INEC Ecuador — Datos y encuestas públicas",
      url: "https://www.ecuadorencifras.gob.ec/estadisticas/",
      tipo: "documentacion",
      descripcion: "Instituto Nacional de Estadística y Censos. Datos públicos de encuestas nacionales. Fuente de datos reales para practicar análisis NLP.",
    },
    {
      titulo: "pysentimiento — Análisis de sentimiento LATAM",
      url: "https://pypi.org/project/pysentimiento/",
      tipo: "herramienta",
      descripcion: "Librería para análisis de sentimiento en español con modelos entrenados en Twitter LATAM. Documentación con ejemplos de código.",
    },
    {
      titulo: "Streamlit — Dashboard de resultados NLP",
      url: "https://streamlit.io/",
      tipo: "herramienta",
      descripcion: "Framework Python para crear dashboards interactivos de análisis de datos. Ideal para presentar resultados de análisis NLP a audiencias no técnicas.",
    },
  ],
  teoria: `El análisis de encuestas es una de las aplicaciones de NLP con mayor impacto en el sector público y privado ecuatoriano. Instituciones como el INEC, el Ministerio de Educación, el MSP, el SRI y los municipios de Quito y Guayaquil realizan encuestas masivas que incluyen preguntas abiertas con miles de respuestas en texto libre. Las empresas privadas de telecomunicaciones, banca, retail y servicios también recopilan miles de respuestas a preguntas como "¿por qué nos recomiendaría?" o "¿qué podríamos mejorar?" en sus encuestas de NPS y satisfacción. El análisis manual de estas respuestas es tan costoso en tiempo y recursos que frecuentemente se omite, y solo se usan las preguntas cerradas con escalas numéricas.

El Procesamiento de Lenguaje Natural convierte este desafío en una oportunidad. Un pipeline bien diseñado puede procesar 10,000 respuestas en el tiempo que un analista tardaría en leer 100. El valor no está solo en la velocidad — está en la objetividad y la completitud. El análisis humano está sesgado por la fatiga, por la tendencia a recordar las últimas respuestas leídas, y por las preconcepciones del analista. El NLP es consistente: aplica el mismo criterio a todas las respuestas.

El topic modeling es la técnica más valiosa para el análisis exploratorio de respuestas abiertas cuando no se saben los temas de antemano. El algoritmo LDA (Latent Dirichlet Allocation) clásico trata cada documento como una mezcla de N temas, donde cada tema es una distribución de palabras. Dado un corpus de 1,000 respuestas de una encuesta sobre servicios públicos en Quito, LDA podría descubrir automáticamente 5-8 temas latentes: transporte, agua y alcantarillado, seguridad ciudadana, trámites municipales, espacios verdes. BERTopic mejora este proceso usando embeddings semánticos: agrupa las respuestas por su significado en lugar de solo por las palabras que contienen, produciendo temas más coherentes y mejor etiquetados automáticamente.

Para el análisis de NPS (Net Promoter Score), la combinación de la puntuación numérica con el análisis NLP de la pregunta abierta "¿por qué?" es particularmente poderosa. Un banco ecuatoriano con NPS de -15 sabe que tiene un problema, pero no sabe exactamente cuál. El NLP sobre las respuestas de los detractores puede revelar que el 45% menciona "tiempo de espera en ventanilla", el 30% menciona "comisiones no comunicadas", y el 25% menciona "problemas con la aplicación móvil". Esta información permite al gerente de experiencia del cliente tomar tres acciones específicas en lugar de lanzar una iniciativa vaga de "mejorar la satisfacción".

El análisis de sentimiento por aspecto (ABSA) aporta una capa adicional de inteligencia. Una respuesta como "el asesor fue muy amable pero el sistema se cayó tres veces mientras me atendía" contiene un aspecto positivo (servicio del asesor) y uno negativo (sistema tecnológico). El análisis de sentimiento global clasificaría esta respuesta como neutra o ambigua. El ABSA extrae que servicio=positivo y tecnología=negativo, información mucho más valiosa para la institución.

La generación automática del reporte ejecutivo final, usando ChatGPT con los resultados del análisis NLP como contexto, cierra el ciclo de valor. En lugar de que un analista pase días redactando el informe de resultados, el sistema puede generar en segundos un resumen ejecutivo de 200-400 palabras con los hallazgos principales, los problemas más urgentes identificados y las recomendaciones basadas en datos. El resultado es un workflow donde el equipo de investigación invierte tiempo en diseñar la encuesta y revisar los resultados del NLP, no en leer manualmente miles de respuestas ni redactar informes desde cero.`,
};

const tema17: TemaC12 = placeholder(17, "Atención al cliente con NLP — chatbot omnicanal", MOD4, 4);
const tema18: TemaC12 = placeholder(18, "NLP para el sector bancario ecuatoriano", MOD4, 4);
const tema19: TemaC12 = placeholder(19, "Reconocimiento de voz en español ecuatoriano con Whisper", MOD4, 4);
const tema20: TemaC12 = placeholder(20, "Proyecto integrador: sistema NLP end-to-end en español", MOD4, 4);

export const C12_TEMAS: TemaC12[] = [
  tema1, tema2, tema3, tema4, tema5,
  tema6, tema7, tema8, tema9, tema10,
  tema11, tema12, tema13, tema14, tema15,
  tema16, tema17, tema18, tema19, tema20,
];
