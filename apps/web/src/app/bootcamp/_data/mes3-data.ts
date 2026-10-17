// ─── BOOTCAMP INTENSIVO DE IA — Mes 3 (16 sesiones) ─────────────────────────
// Tema: Especialización y Proyecto Final
// Módulo 1: Computer Vision (OpenCV, YOLO)            — Sesiones 1-4
// Módulo 2: NLP (sentiment, chatbots)                 — Sesiones 5-8
// Módulo 3: MLOps (MLflow, monitoreo)                 — Sesiones 9-12
// Módulo 4: Proyecto Final                            — Sesiones 13-16

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

export interface SesionBootcamp {
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

export const BOOTCAMP_MES3_MODULOS = [
  { num: 1, nombre: "Computer Vision", horas: 8, sesiones: 4 },
  { num: 2, nombre: "NLP Aplicado", horas: 8, sesiones: 4 },
  { num: 3, nombre: "MLOps", horas: 8, sesiones: 4 },
  { num: 4, nombre: "Proyecto Final", horas: 8, sesiones: 4 },
];

const MOD1 = "Computer Vision";
const MOD2 = "NLP Aplicado";
const MOD3 = "MLOps";
const MOD4 = "Proyecto Final";

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): SesionBootcamp => ({
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

// ─── MÓDULO 1: COMPUTER VISION (Sesiones 1-4) ────────────────────────────────

const sesion1: SesionBootcamp = {
  id: 1,
  titulo: "Computer Vision desde cero: OpenCV y detección de objetos con YOLO",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Computer Vision con OpenCV y YOLOv8 — Detección en tiempo real",
  videoDuracion: "28 min",
  teoria: `Computer Vision (CV) es el campo de la inteligencia artificial que permite a los sistemas interpretar y comprender el contenido de imágenes y videos. Desde contar personas en una tienda hasta detectar defectos en manufactura o identificar placas de vehículos, CV tiene aplicaciones concretas y rentables en el contexto empresarial ecuatoriano actual.

OpenCV es la librería fundamental de visión por computadora. Con más de 20 años de desarrollo, es el estándar para operaciones básicas: cargar y guardar imágenes, convertir entre espacios de color (BGR, RGB, HSV, gris), redimensionar, rotar, dibujar sobre imágenes, capturar video de cámara, y aplicar filtros morfológicos. OpenCV usa por defecto BGR, no RGB, lo que confunde a quienes vienen de PIL o matplotlib. Para mostrar colores correctos hay que convertir con cv2.cvtColor(imagen, cv2.COLOR_BGR2RGB).

El espacio HSV (Hue-Saturation-Value) es útil para detectar objetos por color independientemente de la iluminación. El canal Hue representa el tono puro del color y no cambia con los cambios de luz, a diferencia de BGR donde los tres canales varían simultáneamente.

YOLO (You Only Look Once) es la familia de modelos de detección de objetos más usada por su balance entre velocidad y precisión. YOLOv8 (Ultralytics, 2023) puede detectar, segmentar, clasificar y estimar poses. Su velocidad en GPU es de 100+ fps y en CPU (laptop ecuatoriana sin GPU) de 10-30 fps en 640x480, suficiente para vigilancia y control de calidad no crítico en tiempo real.

YOLO divide la imagen en cuadrícula y predice para cada celda: si hay objeto, qué clase, y las coordenadas del bounding box. Todo en una sola pasada (de ahí "You Only Look Once"), a diferencia de Faster R-CNN que usa dos etapas y es más preciso pero más lento. YOLOv8 está preentrenado en COCO (80 clases) y puede fine-tunearse con 100-500 imágenes por clase gracias al transfer learning.

Uso básico de YOLOv8 en Python:

    from ultralytics import YOLO
    import cv2
    model = YOLO("yolov8n.pt")
    results = model("imagen.jpg")
    for r in results:
        for box in r.boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            label = f"{model.names[cls]} {conf:.2f}"
            cv2.rectangle(imagen, (x1, y1), (x2, y2), (0, 255, 0), 2)

Para aplicaciones en Ecuador, los casos de mayor ROI son: control de aforo en tiendas y eventos, verificación de EPP en obras de construcción, control de calidad en líneas agroindustriales (flores, camarón, banano), lectura de placas vehiculares para control de acceso, y análisis de comportamiento de clientes en retail.

El fine-tuning para casos personalizados usa Roboflow (capa gratuita) para etiquetar imágenes con bounding boxes, aplicar augmentación y exportar en formato YOLO. Un equipo puede etiquetar 300-500 imágenes en un día, entrenar YOLOv8s en Google Colab con GPU gratuita en 2-3 horas, y obtener un modelo funcional con precisión superior al 85% en condiciones de campo.`,
  presentacionSlides: [
    {
      titulo: "Computer Vision en Ecuador",
      contenido:
        "Control de aforo · EPP en obras · control de calidad agroindustrial (flores, banano, camarón) · lectura de placas · análisis comportamiento retail.",
    },
    {
      titulo: "OpenCV: la base de CV",
      contenido:
        "20+ años, estándar en la industria.\nOperaciones: cargar, convertir colores, redimensionar, rotar, capturar video.\nOjo: OpenCV usa BGR, no RGB.",
    },
    {
      titulo: "Espacios de color",
      contenido:
        "BGR (default OpenCV) → RGB (matplotlib).\nHSV: detectar objetos por color, robusto a iluminación variable.\nGrises: cuando el color no importa.",
    },
    {
      titulo: "YOLO: detección en una sola pasada",
      contenido:
        "YOLOv8 (Ultralytics 2023): detectar, segmentar, clasificar, poses.\nGPU: 100+ fps · CPU: 10-30 fps @ 640x480.\nPreentrenado en COCO: 80 clases.",
    },
    {
      titulo: "Cómo funciona YOLO",
      contenido:
        "Cuadrícula → cada celda predice objeto + clase + bounding box.\nUna sola pasada = velocidad.\nVs Faster R-CNN: más lento pero más preciso.",
    },
    {
      titulo: "Fine-tuning para Ecuador",
      contenido:
        "100-500 imágenes por clase.\nRoboflow: etiquetar + augmentación.\nGoogle Colab GPU gratis: 2-3h de entrenamiento.\nPrecisión superior al 85% alcanzable.",
    },
    {
      titulo: "Pipeline CV completo",
      contenido:
        "Captura → preprocesamiento (OpenCV) → detección (YOLO) → postprocesamiento (dibujar, contar, alertar) → output (dashboard, API).",
    },
    {
      titulo: "Stack CV 2026",
      contenido:
        "OpenCV + YOLOv8 (Ultralytics) + Roboflow (etiquetado) + Google Colab (entrenamiento) + FastAPI (deploy) + Streamlit (demo).",
    },
  ],
  quiz: [
    {
      pregunta: "¿Por qué OpenCV lee imágenes en BGR en lugar de RGB?",
      opciones: [
        "Porque BGR es más eficiente computacionalmente",
        "Por razones históricas del diseño original en los años 90",
        "Porque los monitores muestran en BGR",
        "Porque Python solo soporta BGR",
      ],
      respuesta: 1,
      explicacion:
        "OpenCV heredó el orden BGR de su implementación original. matplotlib y PIL usan RGB, causando inversión de colores si no se convierte.",
    },
    {
      pregunta: "¿Cuál espacio de color es más útil para detectar objetos en condiciones de iluminación variable?",
      opciones: ["BGR", "RGB", "HSV", "Escala de grises"],
      respuesta: 2,
      explicacion:
        "HSV separa el tono del color (Hue) de la iluminación (Value), haciendo la detección por color más robusta a cambios de luz.",
    },
    {
      pregunta: "¿Cuál es la ventaja principal de YOLO sobre Faster R-CNN?",
      opciones: [
        "Es más preciso en todos los casos",
        "Detecta en una sola pasada por la red, haciéndolo significativamente más rápido",
        "No requiere GPU",
        "Solo funciona con videos, no con imágenes estáticas",
      ],
      respuesta: 1,
      explicacion:
        "YOLO procesa en una sola pasada (100+ fps en GPU). Faster R-CNN usa dos etapas: más preciso pero mucho más lento.",
    },
    {
      pregunta: "¿Cuántas imágenes por clase se necesitan para fine-tunear YOLOv8 con resultados útiles?",
      opciones: ["10-20", "100-500", "50,000+", "1 millón"],
      respuesta: 1,
      explicacion:
        "YOLOv8 puede fine-tunearse con 100-500 imágenes por clase gracias al transfer learning desde COCO.",
    },
    {
      pregunta: "¿Qué herramienta permite etiquetar imágenes y exportar en formato YOLO?",
      opciones: ["Google Colab", "Roboflow", "Docker Desktop", "FastAPI"],
      respuesta: 1,
      explicacion:
        "Roboflow es la herramienta estándar para etiquetar, aplicar augmentación y exportar datasets en formato YOLO.",
    },
  ],
  ejercicio: {
    titulo: "Sistema de conteo de personas con YOLOv8 y alerta de aforo",
    objetivo:
      "Construir un sistema que detecte y cuente personas en un video con alerta cuando se supere un aforo máximo.",
    herramientas: "Google Colab con GPU, ultralytics (YOLOv8), OpenCV, numpy, matplotlib",
    datosEjemplo:
      "Control de aforo en tienda en Quito. Aforo máximo: 20 personas. Video de 2 minutos de cámara de seguridad.",
    pasos: [
      "Paso 1 — Instalar y cargar YOLOv8: pip install ultralytics. Descargar yolov8n.pt. Verificar que 'person' (id=0) está en model.names.",
      "Paso 2 — Frame estático: Cargar imagen con cv2.imread. Aplicar modelo. Dibujar bounding boxes solo para clase 'person'. Mostrar con conteo.",
      "Paso 3 — Procesar video: Abrir con cv2.VideoCapture. Para cada frame: inferencia → filtrar personas → dibujar → escribir conteo. Guardar video procesado.",
      "Paso 4 — Alerta de aforo: AFORO_MAXIMO=20. Si el conteo supera el máximo, texto rojo + mensaje 'AFORO EXCEDIDO'. Registrar timestamps.",
      "Paso 5 — Reporte de ocupación: Con matplotlib, graficar personas por segundo durante el video. Calcular máximo, porcentaje sobre aforo y hora pico.",
      "Paso 6 — Evaluar precisión: Para 10 frames, contar manualmente y comparar con detección. Calcular accuracy. Documentar fallos.",
    ],
    resultado:
      "Video procesado con detección + alertas de aforo + gráfico de ocupación temporal + reporte de precisión con análisis de fallos.",
    criterios: [
      { criterio: "YOLOv8 con filtro para clase 'person' funcionando correctamente", puntos: 25 },
      { criterio: "Video procesado con bounding boxes y conteo visibles", puntos: 20 },
      { criterio: "Alerta de aforo funcional con cambio visual al superar el límite", puntos: 20 },
      { criterio: "Gráfico de ocupación temporal con matplotlib", puntos: 15 },
      { criterio: "Evaluación de precisión en 10 frames con análisis de fallos", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "Ultralytics YOLOv8 — Documentación oficial",
      url: "https://docs.ultralytics.com/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de YOLOv8: detección, segmentación, clasificación y poses",
    },
    {
      titulo: "OpenCV — Tutoriales Python",
      url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
      tipo: "documentacion",
      descripcion: "Tutoriales oficiales de OpenCV para Python",
    },
    {
      titulo: "Roboflow — Datasets de Computer Vision",
      url: "https://roboflow.com/",
      tipo: "herramienta",
      descripcion: "Plataforma para etiquetar imágenes, augmentación y exportar datasets",
    },
    {
      titulo: "PyImageSearch — Computer Vision con Python",
      url: "https://pyimagesearch.com/",
      tipo: "lectura",
      descripcion: "Blog referencia de Computer Vision con OpenCV y deep learning",
    },
  ],
};

const sesion2: SesionBootcamp = placeholder(2, "Segmentación de instancias y estimación de poses con YOLOv8", MOD1, 1);
const sesion3: SesionBootcamp = placeholder(3, "Fine-tuning de YOLO con dataset personalizado ecuatoriano", MOD1, 1);
const sesion4: SesionBootcamp = placeholder(4, "Pipeline CV en producción: cámara IP + análisis en tiempo real", MOD1, 1);

// ─── MÓDULO 2: NLP APLICADO (Sesiones 5-8) ───────────────────────────────────

const sesion5: SesionBootcamp = {
  id: 5,
  titulo: "NLP aplicado: análisis de sentimientos y opiniones en español",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Análisis de sentimientos en español ecuatoriano con transformers",
  videoDuracion: "24 min",
  teoria: `El Procesamiento de Lenguaje Natural (NLP) es el subcampo de la IA que trabaja con texto y lenguaje humano. En 2026, gracias a los transformers, el NLP ha alcanzado capacidades que antes requerían años de especialización: analizar sentimientos en reseñas de clientes, extraer entidades nombradas de contratos, clasificar tickets de soporte, generar resúmenes de documentos largos, y construir chatbots que entienden modismos ecuatorianos.

El análisis de sentimientos clasifica texto en positivo, negativo y neutro (tres clases) o en escalas más finas de cinco clases. Sus aplicaciones directas en Ecuador son: analizar comentarios en redes sociales sobre la marca, procesar reseñas de Google Maps y TripAdvisor, clasificar tickets de soporte por urgencia emocional, y monitorear menciones de marca en tiempo real.

La arquitectura transformer (Google, 2017) revolucionó el NLP. BERT (2018) demostró que el preentrenamiento masivo seguido de fine-tuning con pocos datos superaba todos los métodos anteriores. Para español: BETO (DCC Universidad de Chile), RoBERTa-base-spanish, y modelos multilingüe como mBERT y XLM-RoBERTa.

Para análisis de sentimientos sin entrenar desde cero, la opción más eficiente es usar modelos preentrenados desde HuggingFace. El modelo pysentimiento/robertuito-sentiment-analysis está entrenado en tweets en español de LATAM con excelente rendimiento en jerga regional ecuatoriana:

    from transformers import pipeline
    classifier = pipeline("sentiment-analysis",
                          model="pysentimiento/robertuito-sentiment-analysis")
    resultado = classifier("El servicio de este banco en Quito es terrible, esperas 2 horas")
    print(resultado)  # [{'label': 'NEG', 'score': 0.98}]

El fine-tuning en datos propios requiere 500-2000 ejemplos etiquetados, tokenizar con el tokenizer del modelo base, y entrenar con AdamW (learning rate 2e-5) durante 3-5 épocas. Evaluar con accuracy, F1 y matriz de confusión.

Una pipeline de monitoreo de sentimiento tiene cinco componentes: (1) Ingestión (API/scraping), (2) Preprocesamiento (limpiar texto, normalizar), (3) Análisis (aplicar modelo), (4) Almacenamiento (con timestamp, fuente, score), (5) Visualización (dashboard con tendencias y alertas cuando el sentimiento negativo supera umbral).

El Aspect-Based Sentiment Analysis (ABSA) va más allá del score global: identifica qué aspectos específicos son positivos o negativos. "Negativa en tiempo de espera, positiva en atención del personal" — más accionable que solo "reseña negativa". Esencial para empresas ecuatorianas con múltiples dimensiones de servicio (bancos, clínicas, hoteles).

Fuentes de datos en Ecuador: Twitter/X API (con limitaciones), Meta Graph API, Instagram Graph API para cuentas de negocio, Google Places API para reseñas de Google Maps, y scraping ético con BeautifulSoup respetando robots.txt y términos de servicio.`,
  presentacionSlides: [
    {
      titulo: "NLP aplicado en Ecuador",
      contenido:
        "Reseñas Google Maps · comentarios redes sociales · tickets de soporte · extracción de cláusulas en contratos · chatbots con modismos ecuatorianos.",
    },
    {
      titulo: "Análisis de sentimientos",
      contenido:
        "3 clases básicas: positivo · negativo · neutro.\n5 clases finas: muy negativo → muy positivo.\nAplicación: alertas cuando sentimiento negativo supera umbral diario.",
    },
    {
      titulo: "BERT para español",
      contenido:
        "Google 2018: preentrenamiento + fine-tuning con pocos datos.\nPara español: BETO · RoBERTa-spanish · XLM-RoBERTa (multilingüe 100+ idiomas).",
    },
    {
      titulo: "Modelo listo: robertuito",
      contenido:
        "pysentimiento/robertuito-sentiment-analysis\nEntrenado en tweets LATAM, funciona con jerga ecuatoriana.\n3 líneas con HuggingFace pipeline.",
    },
    {
      titulo: "Fine-tuning en datos propios",
      contenido:
        "500-2000 ejemplos etiquetados.\nAdamW, lr=2e-5, 3-5 épocas.\nEvaluar: accuracy, F1, matriz de confusión.\nGoogle Colab GPU gratuito.",
    },
    {
      titulo: "Pipeline de monitoreo (5 componentes)",
      contenido:
        "1. Ingestión\n2. Preprocesamiento\n3. Análisis (modelo NLP)\n4. Almacenamiento\n5. Dashboard con alertas",
    },
    {
      titulo: "ABSA: análisis por aspectos",
      contenido:
        "'Negativa en tiempo de espera, positiva en atención' vs score global.\nPara bancos, hoteles, restaurantes con múltiples dimensiones de servicio.",
    },
    {
      titulo: "Fuentes de datos Ecuador",
      contenido:
        "Twitter API · Meta Graph API · Google Places API · scraping ético + robots.txt.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué modelo está entrenado específicamente en tweets en español de LATAM?",
      opciones: [
        "BETO",
        "pysentimiento/robertuito-sentiment-analysis",
        "GPT-4o",
        "BERT en inglés",
      ],
      respuesta: 1,
      explicacion:
        "El modelo robertuito de pysentimiento está entrenado en tweets de América Latina, efectivo con jerga y expresiones regionales ecuatorianas.",
    },
    {
      pregunta: "¿Cuántos ejemplos etiquetados se necesitan para fine-tunear BERT en un dominio específico?",
      opciones: ["10-20", "500-2000", "100,000+", "1 millón"],
      respuesta: 1,
      explicacion:
        "Gracias al transfer learning, 500-2000 ejemplos son suficientes para fine-tunear BERT en un dominio específico.",
    },
    {
      pregunta: "¿Qué diferencia al ABSA del análisis de sentimientos estándar?",
      opciones: [
        "ABSA es más rápido",
        "ABSA analiza sentimiento por aspectos específicos, no solo un score global",
        "ABSA solo funciona en inglés",
        "ABSA no requiere ML",
      ],
      respuesta: 1,
      explicacion:
        "ABSA identifica qué aspectos específicos son positivos o negativos, en lugar de un único score global poco accionable.",
    },
    {
      pregunta: "¿Cuál es el learning rate estándar para fine-tuning de BERT?",
      opciones: ["0.01", "0.1", "2e-5", "1.0"],
      respuesta: 2,
      explicacion:
        "El learning rate 2e-5 con AdamW es el estándar para fine-tuning de modelos BERT en 3-5 épocas.",
    },
    {
      pregunta: "¿Qué principio ético es obligatorio al hacer scraping para NLP?",
      opciones: [
        "Solo hacer scraping de noche",
        "Respetar robots.txt y términos de servicio de cada sitio",
        "Siempre usar VPN",
        "Almacenar en servidor fuera de Ecuador",
      ],
      respuesta: 1,
      explicacion:
        "El robots.txt y los términos de servicio definen el uso aceptable de los datos. Ignorarlos puede tener consecuencias legales.",
    },
  ],
  ejercicio: {
    titulo: "Monitor de sentimiento para marca ecuatoriana",
    objetivo:
      "Sistema de análisis de sentimientos sobre 200 reseñas de Google Maps de negocio ecuatoriano con reporte ejecutivo.",
    herramientas:
      "Google Colab, transformers, pandas, matplotlib, seaborn, dataset de reseñas",
    datosEjemplo:
      "200 reseñas Google Maps de cadena de farmacias en Quito. Columnas: texto_resena, calificacion (1-5), fecha, sucursal.",
    pasos: [
      "Paso 1 — Cargar modelo: Instalar transformers. Cargar pipeline robertuito. Importar dataset con pandas.",
      "Paso 2 — Preprocesamiento: Limpiar reseñas (caracteres especiales, tildes, minúsculas). Filtrar las de menos de 10 palabras.",
      "Paso 3 — Análisis en batch: Aplicar modelo en lotes de 32. Guardar label y score en nuevas columnas.",
      "Paso 4 — Análisis exploratorio: Gráficos de distribución por sucursal, tendencia por mes, correlación calificación estrellas vs sentimiento detectado.",
      "Paso 5 — Temas negativos: Filtrar NEG. Usar Claude o spaCy para extraer frases frecuentes. Identificar 5 temas principales de queja.",
      "Paso 6 — Reporte ejecutivo: Figura con 4 gráficos + interpretación. Exportar como PDF con insights accionables.",
    ],
    resultado:
      "Pipeline sobre 200 reseñas + reporte ejecutivo con 4 gráficos + 5 temas de queja identificados.",
    criterios: [
      { criterio: "Modelo robertuito aplicado en batch correctamente", puntos: 25 },
      { criterio: "Preprocesamiento limpio y documentado", puntos: 15 },
      { criterio: "4 gráficos exploratorios con interpretación correcta", puntos: 25 },
      { criterio: "5 temas de queja con evidencia textual", puntos: 20 },
      { criterio: "Reporte ejecutivo exportado con insights accionables", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "HuggingFace — robertuito",
      url: "https://huggingface.co/pysentimiento/robertuito-sentiment-analysis",
      tipo: "herramienta",
      descripcion: "Modelo de análisis de sentimientos entrenado en tweets en español de LATAM",
    },
    {
      titulo: "HuggingFace NLP Course — gratuito",
      url: "https://huggingface.co/learn/nlp-course/chapter1/1",
      tipo: "documentacion",
      descripcion: "Curso gratuito oficial de HuggingFace sobre NLP con transformers",
    },
    {
      titulo: "pysentimiento — NLP en español",
      url: "https://pypi.org/project/pysentimiento/",
      tipo: "herramienta",
      descripcion: "Librería Python para NLP en español de América Latina",
    },
    {
      titulo: "Stanford NLP — Sentiment Analysis",
      url: "https://nlp.stanford.edu/sentiment/",
      tipo: "lectura",
      descripcion: "Introducción al análisis de sentimientos del grupo NLP de Stanford",
    },
  ],
};

const sesion6: SesionBootcamp = placeholder(6, "Extracción de entidades y clasificación de texto con spaCy", MOD2, 2);
const sesion7: SesionBootcamp = placeholder(7, "Chatbots con Rasa o Botpress: NLU para servicios al cliente", MOD2, 2);
const sesion8: SesionBootcamp = placeholder(8, "Resumen automático de documentos y generación de reportes", MOD2, 2);

// ─── MÓDULO 3: MLOPS (Sesiones 9-12) ─────────────────────────────────────────

const sesion9: SesionBootcamp = {
  id: 9,
  titulo: "MLOps desde cero: MLflow para experimentación y registro de modelos",
  modulo: MOD3,
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "MLOps con MLflow: del experimento al modelo en producción",
  videoDuracion: "25 min",
  teoria: `MLOps (Machine Learning Operations) aplica los principios de DevOps al ciclo de vida del machine learning. La diferencia con software tradicional es que los modelos no solo tienen código: tienen datos y pesos aprendidos que se degradan con el tiempo cuando el mundo cambia.

El ciclo de vida de un modelo en producción tiene cinco etapas: Experimentación, Registro (versionar modelo, métricas, artefactos), Deployment (API), Monitoreo (vigilar drift) y Reentrenamiento (cuando el modelo se degrada). MLOps gestiona estas cinco etapas de forma sistemática.

MLflow es el toolkit más adoptado para equipos pequeños y medianos. Sus cuatro componentes: (1) MLflow Tracking — registra métricas, parámetros y artefactos de cada experimento; (2) MLflow Models — empaqueta modelos con sus dependencias; (3) MLflow Model Registry — catálogo con etapas (Staging, Production, Archived); (4) MLflow Projects — reproducibilidad de experimentos.

Ejemplo de uso en scikit-learn:

    import mlflow, mlflow.sklearn
    mlflow.set_experiment("rotacion-personal-ecuador")
    with mlflow.start_run(run_name="rf-100-arboles"):
        clf = RandomForestClassifier(n_estimators=100, max_depth=8)
        clf.fit(X_train, y_train)
        y_pred = clf.predict(X_test)
        mlflow.log_param("n_estimators", 100)
        mlflow.log_metric("accuracy", accuracy_score(y_test, y_pred))
        mlflow.log_metric("f1", f1_score(y_test, y_pred))
        mlflow.sklearn.log_model(clf, "modelo")

Después, mlflow ui lanza una interfaz web para comparar todos los runs en tabla ordenada por métricas, reemplazando las hojas de cálculo manuales.

Data drift: la distribución de las variables de entrada cambia (estafadores cambian métodos en 2025 vs 2023). Concept drift: cambia la relación entre inputs y outputs (el covid cambió los patrones de compra). Ambos degradan el modelo sin aviso explícito. Evidently AI es la herramienta open source estándar: genera reportes comparando distribución de entrenamiento vs producción por cada variable.

En Ecuador, los factores de drift más frecuentes son: inflación y cambios en el SBU, eventos electorales o de mercado, cambios en regulaciones (IESS, Código del Trabajo), y estacionalidad Costa/Sierra. Un modelo entrenado antes del incremento de inflación de 2022 probablemente necesita reentrenamiento con datos más recientes.

Las 5 mejores prácticas para equipos pequeños: (1) versionar desde el primer experimento con MLflow o DVC; (2) pipeline de entrenamiento como script reproducible, no notebook interactivo; (3) definir umbrales de degradación antes del deploy (ej: si F1 cae de 0.87 a menos de 0.82, alertar); (4) guardar datos de entrenamiento junto al modelo; (5) documentar el contexto temporal del modelo (período de entrenamiento, condiciones del mercado).`,
  presentacionSlides: [
    {
      titulo: "¿Qué es MLOps?",
      contenido:
        "DevOps para ML: desplegar modelos confiablemente, versionar experimentos, monitorear drift, reentrenar.\nLos modelos tienen datos y pesos que cambian con el tiempo.",
    },
    {
      titulo: "Ciclo de vida del modelo",
      contenido:
        "1. Experimentación\n2. Registro\n3. Deployment\n4. Monitoreo\n5. Reentrenamiento",
    },
    {
      titulo: "MLflow: 4 componentes",
      contenido:
        "Tracking: métricas y parámetros.\nModels: empaqueta con dependencias.\nModel Registry: Staging/Production/Archived.\nProjects: reproducibilidad.",
    },
    {
      titulo: "MLflow Tracking en la práctica",
      contenido:
        "mlflow.set_experiment()\nwith mlflow.start_run():\n    log_param(), log_metric(), log_model()\nluego: mlflow ui para comparar runs.",
    },
    {
      titulo: "Data drift vs concept drift",
      contenido:
        "Data drift: distribución de inputs cambia.\nConcept drift: relación input-output cambia.\nAmbos degradan el modelo sin aviso.",
    },
    {
      titulo: "Evidently AI: detectar drift",
      contenido:
        "Compara distribución entrenamiento vs producción.\nReporte por feature + score global.\nOpen source, integración con MLflow.",
    },
    {
      titulo: "Factores de drift en Ecuador",
      contenido:
        "Inflación y SBU · eventos electorales · cambios IESS/laborales · estacionalidad Costa/Sierra.",
    },
    {
      titulo: "5 mejores prácticas MLOps",
      contenido:
        "1. Versionar desde experimento 1.\n2. Script reproducible, no notebook.\n3. Umbrales de degradación antes del deploy.\n4. Guardar datos junto al modelo.\n5. Documentar contexto temporal.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la diferencia entre data drift y concept drift?",
      opciones: [
        "Son sinónimos",
        "Data drift: cambia distribución de inputs. Concept drift: cambia relación input-output",
        "Data drift es solo clasificación. Concept drift solo regresión",
        "Data drift en entrenamiento. Concept drift en producción",
      ],
      respuesta: 1,
      explicacion:
        "Data drift: inputs con distribución diferente al entrenamiento. Concept drift: relación inputs-target cambia. Ambos degradan el modelo por razones distintas.",
    },
    {
      pregunta: "¿Cuáles son los 4 componentes de MLflow?",
      opciones: [
        "Tracking, Models, Registry y Projects",
        "Training, Testing, Staging y Production",
        "Data, Model, API y Monitoring",
        "Ingestion, Transform, Train y Deploy",
      ],
      respuesta: 0,
      explicacion:
        "Tracking (métricas), Models (empaquetado), Model Registry (catálogo con etapas) y Projects (reproducibilidad).",
    },
    {
      pregunta: "¿Qué herramienta open source detecta data drift en producción?",
      opciones: ["MLflow Tracking", "Docker", "Evidently AI", "FastAPI"],
      respuesta: 2,
      explicacion:
        "Evidently AI genera reportes de drift comparando la distribución de datos de entrenamiento vs producción.",
    },
    {
      pregunta: "En Ecuador, ¿qué puede causar data drift en modelos de comportamiento de consumidores?",
      opciones: [
        "Actualización del IDE",
        "Cambio de versión de Python",
        "Inflación y cambios en el salario real frente al SBU",
        "Renovación de la página web",
      ],
      respuesta: 2,
      explicacion:
        "Cambios económicos como inflación o modificaciones al SBU cambian los patrones de consumo, degradando modelos entrenados en datos previos.",
    },
    {
      pregunta: "¿Por qué automatizar el pipeline como script y no notebook?",
      opciones: [
        "Scripts son más fáciles de escribir",
        "Notebooks no son compatibles con Python 3.11",
        "Un script corre desde cero reproduciblemente en CI/CD",
        "MLflow no funciona con Jupyter",
      ],
      respuesta: 2,
      explicacion:
        "Un script ejecutable garantiza reproducibilidad y puede ser activado automáticamente por sistemas CI/CD.",
    },
  ],
  ejercicio: {
    titulo: "5 experimentos con MLflow y reporte de drift con Evidently",
    objetivo:
      "Registrar 5 algoritmos en MLflow, identificar el mejor y detectar data drift con Evidently AI.",
    herramientas: "Google Colab, MLflow, scikit-learn, Evidently AI, pandas",
    datosEjemplo:
      "Dataset rotación 400 empleados. Comparar: Logistic Regression, Random Forest, Gradient Boosting, SVM y XGBoost.",
    pasos: [
      "Paso 1 — Configurar MLflow: pip install mlflow. Para cada uno de los 5 algoritmos: run con log_param, log_metric (accuracy, F1, AUC-ROC) y log_model.",
      "Paso 2 — Comparar en UI: mlflow ui. Tabla comparativa de 5 runs. Identificar el mejor por AUC-ROC en test. Captura de pantalla.",
      "Paso 3 — Promover al Registry: mlflow.register_model() para el ganador. Stage 'Staging'. Agregar descripción con contexto ecuatoriano.",
      "Paso 4 — Simular drift: Crear dataset sintético con distribución modificada de salario y ausentismo en 30% (simula crisis económica).",
      "Paso 5 — Reporte Evidently: ColumnDriftReport comparando entrenamiento vs dataset con drift. Identificar 3 variables con mayor drift.",
      "Paso 6 — Estrategia de reentrenamiento: Para cada variable con drift, definir criterio de activación (ej: drift score > 0.15 en variable X → reentrenar con últimos 6 meses).",
    ],
    resultado:
      "5 runs en MLflow + tabla comparativa + modelo en Registry + reporte Evidently con 3 variables drifteadas + estrategia de reentrenamiento.",
    criterios: [
      { criterio: "5 runs en MLflow con métricas correctas y artefactos guardados", puntos: 25 },
      { criterio: "Captura de tabla comparativa con identificación del mejor modelo", puntos: 15 },
      { criterio: "Modelo promovido al Model Registry correctamente", puntos: 20 },
      { criterio: "Reporte Evidently con 3 variables de mayor drift", puntos: 25 },
      { criterio: "Estrategia de reentrenamiento con criterios de activación documentados", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "MLflow — Documentación oficial",
      url: "https://mlflow.org/docs/latest/index.html",
      tipo: "documentacion",
      descripcion: "Documentación completa de MLflow: tracking, registry, deployment",
    },
    {
      titulo: "Evidently AI — Monitoreo de modelos",
      url: "https://docs.evidentlyai.com/",
      tipo: "herramienta",
      descripcion: "Herramienta open source para monitoreo de calidad de datos y drift",
    },
    {
      titulo: "Made With ML — MLOps Course",
      url: "https://madewithml.com/",
      tipo: "lectura",
      descripcion: "Curso gratuito de MLOps orientado a producción con Python",
    },
    {
      titulo: "DVC — Data Version Control",
      url: "https://dvc.org/",
      tipo: "herramienta",
      descripcion: "Versionar datos y pipelines de ML junto a Git",
    },
  ],
};

const sesion10: SesionBootcamp = placeholder(10, "Pipelines de ML automatizados con Prefect o Airflow", MOD3, 3);
const sesion11: SesionBootcamp = placeholder(11, "Monitoreo de modelos: métricas de negocio vs métricas de ML", MOD3, 3);
const sesion12: SesionBootcamp = placeholder(12, "Reentrenamiento automatizado: triggers y estrategias", MOD3, 3);

// ─── MÓDULO 4: PROYECTO FINAL (Sesiones 13-16) ───────────────────────────────

const sesion13: SesionBootcamp = {
  id: 13,
  titulo: "Proyecto Final: definición, arquitectura y plan de entrega",
  modulo: MOD4,
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Proyecto Final Bootcamp IA — Elegir, diseñar y ejecutar tu solución",
  videoDuracion: "22 min",
  teoria: `El proyecto final del Bootcamp ITSEIA no es un ejercicio académico: es una solución real que resuelve un problema real de una empresa ecuatoriana. Al finalizar, el participante tiene un portafolio técnico demostrable que distingue su perfil en el mercado laboral.

El problema ideal tiene cinco características: (1) Real — existe hoy en una empresa o sector que conoces de primera mano; (2) Datos disponibles — hay histórico o se puede recopilar en el tiempo del proyecto; (3) Impacto medible — puedes cuantificar el valor creado; (4) Técnicamente alcanzable en 4 semanas con las herramientas del bootcamp; (5) Usuario claro — hay una persona real que usará la solución.

Los proyectos más exitosos en contexto ecuatoriano: asistente de cumplimiento legal para PyMEs con RAG (LOPDP + Código del Trabajo), detector de defectos en banano de exportación con YOLOv8, analizador de sentimiento de redes sociales para marca de consumo masivo, predictor de rotación de personal para call center en Guayaquil, y chatbot de clínica privada integrado a WhatsApp Business.

La arquitectura sigue el patrón del Mes 2: capa de datos (fuente, ingesta, almacenamiento), capa de modelo (entrenamiento, registro en MLflow), capa de API (FastAPI + Docker), capa de interfaz (Streamlit o canal preferido del usuario). Si usa LLMs, documentar el costo estimado de tokens en producción.

El plan de 4 semanas usa metodología sprint. Semana 1 (Exploración): cargar datos, definir el problema con precisión, construir el baseline más simple posible. Semana 2 (Iteración): mejorar modelo, pipeline completo end-to-end. Semana 3 (Integración): API, interfaz de usuario, prueba con usuario real. Semana 4 (Pulido): bugs, documentación técnica, presentación y video de 3 minutos.

La rúbrica tiene 5 dimensiones con peso igual (20% cada una): (1) Relevancia del problema (real, impactante, stakeholder identificado); (2) Calidad técnica (código limpio, reproducible, métricas documentadas, deploy funcional); (3) Experiencia de usuario (interfaz intuitiva, latencia aceptable, errores manejados); (4) Impacto medible (ROI: tiempo ahorrado, costo reducido, error reducido); (5) Presentación (demo en vivo, pitch de 5 minutos).

El portafolio técnico incluye: repositorio GitHub público con README profesional (problema, arquitectura, instrucciones de instalación, video de demo), notebook de exploración de datos, script de entrenamiento reproducible, Dockerfile, y URL de la aplicación en producción. Es el artefacto más valioso del bootcamp.

Al cierre del bootcamp de 3 meses, los participantes tienen 6 entregables de portafolio: asistente multi-API (Mes 2 S1), sistema RAG (Mes 2 S5), agente LangGraph (Mes 2 S9), API en producción en Railway (Mes 2 S13), proyecto CV o NLP (Mes 3 Módulos 1-2), y el Proyecto Final integrador. Eso es lo que diferencia a un graduado ITSEIA.`,
  presentacionSlides: [
    {
      titulo: "El proyecto final",
      contenido:
        "SÍ: solución real para empresa real con datos reales.\nNO: ejercicio académico ni demo con datos ficticios.\nResultado: portafolio técnico que genera valor.",
    },
    {
      titulo: "Problema ideal: 5 características",
      contenido:
        "1. Real (existe hoy).\n2. Datos disponibles.\n3. Impacto medible.\n4. Alcanzable en 4 semanas.\n5. Usuario claro.",
    },
    {
      titulo: "Proyectos exitosos en Ecuador",
      contenido:
        "Asistente LOPDP para PyMEs · detector defectos banano · analizador sentimiento marca · predictor rotación call center · chatbot clínica en WhatsApp.",
    },
    {
      titulo: "Arquitectura del proyecto",
      contenido:
        "Datos → Modelo (MLflow) → API (FastAPI + Docker) → Interfaz (Streamlit o canal preferido).\nDocumentar costo tokens si usa LLMs.",
    },
    {
      titulo: "Plan de 4 semanas",
      contenido:
        "S1: Exploración + baseline.\nS2: Iteración + pipeline completo.\nS3: Integración + API + prueba con usuario real.\nS4: Pulido + documentación + demo + video.",
    },
    {
      titulo: "Rúbrica: 5 dimensiones iguales",
      contenido:
        "1. Relevancia del problema (20%).\n2. Calidad técnica (20%).\n3. Experiencia de usuario (20%).\n4. Impacto medible (20%).\n5. Presentación (20%).",
    },
    {
      titulo: "Portafolio técnico completo",
      contenido:
        "GitHub público + README profesional + notebook exploración + script reproducible + Dockerfile + URL en producción.",
    },
    {
      titulo: "Los 6 entregables del bootcamp",
      contenido:
        "1. Asistente multi-API\n2. Sistema RAG\n3. Agente LangGraph\n4. API en Railway\n5. Proyecto CV o NLP\n6. Proyecto Final\n\nEso es lo que te diferencia.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuántas características debe tener el problema ideal para el proyecto final?",
      opciones: [
        "2 (real y técnicamente posible)",
        "3 (real, datos, impacto medible)",
        "5 (real, datos, impacto medible, alcanzable 4 semanas, usuario claro)",
        "7 (incluyendo presupuesto y equipo)",
      ],
      respuesta: 2,
      explicacion:
        "Las 5 características garantizan un proyecto que puede completarse, generar valor y demostrarse ante un stakeholder real.",
    },
    {
      pregunta: "¿Cuál es el objetivo principal de la Semana 1 del proyecto final?",
      opciones: [
        "API en producción",
        "Cargar datos, definir el problema y construir el baseline más simple",
        "Grabar el video de demo",
        "Escribir toda la documentación",
      ],
      respuesta: 1,
      explicacion:
        "La Semana 1 es exploración: entender datos, precisar el problema y establecer un baseline de referencia.",
    },
    {
      pregunta: "¿Qué debe incluir el README del repositorio GitHub?",
      opciones: [
        "Solo el nombre del proyecto",
        "Problema, arquitectura, instrucciones de instalación y link al video de demo",
        "El código fuente completo en el README",
        "Solo datos de contacto del autor",
      ],
      respuesta: 1,
      explicacion:
        "Un README profesional permite que cualquier persona entienda el problema, instale el proyecto y vea la demo sin asistencia.",
    },
    {
      pregunta: "¿Por qué el portafolio técnico es el artefacto más valioso del bootcamp?",
      opciones: [
        "Porque tiene más páginas",
        "Porque es la única entrega evaluada",
        "Porque demuestra capacidad real de construir y desplegar IA en producción",
        "Porque incluye el certificado",
      ],
      respuesta: 2,
      explicacion:
        "El portafolio demuestra capacidad práctica demostrable. Una solución de IA en producción con métricas reales supera a cualquier certificado en el mercado laboral.",
    },
    {
      pregunta: "¿Cuánto pesa cada dimensión de la rúbrica de evaluación?",
      opciones: [
        "Calidad técnica 50%, el resto se reparte",
        "La presentación no se evalúa",
        "Todas las dimensiones tienen el mismo peso: 20% cada una",
        "El impacto medible tiene el doble de peso",
      ],
      respuesta: 2,
      explicacion:
        "Las 5 dimensiones tienen peso igual: relevancia del problema, calidad técnica, experiencia de usuario, impacto medible y presentación.",
    },
  ],
  ejercicio: {
    titulo: "Documento de diseño del proyecto final",
    objetivo:
      "Redactar el documento de diseño completo del proyecto final con problema, arquitectura técnica, plan de sprints y métricas de éxito.",
    herramientas:
      "Google Docs, Claude para revisión técnica, draw.io o Excalidraw para arquitectura",
    datosEjemplo:
      "5 secciones: (1) Descripción del problema, (2) Arquitectura técnica, (3) Plan de 4 semanas, (4) Métricas de éxito, (5) Riesgos y mitigación.",
    pasos: [
      "Paso 1 — Seleccionar el problema: Eligir un problema que cumpla las 5 características. Documentar empresa/sector, problema específico, stakeholder e impacto esperado.",
      "Paso 2 — Descripción (1 página): Contexto + Problema (qué cuesta y cuánto) + Solución propuesta con IA + Impacto esperado con números.",
      "Paso 3 — Diagrama de arquitectura: En draw.io/Excalidraw: fuente de datos → preprocesamiento → modelo → API → interfaz. Tecnologías específicas en cada capa.",
      "Paso 4 — Plan de 4 sprints: Cada semana: 3-5 tareas con entregable verificable. Tareas completables en 2-3 días.",
      "Paso 5 — Métricas de éxito: Métricas técnicas (AUC-ROC > 0.85, latencia < 2s) y de negocio (30% reducción tiempo X). Baseline actual + valor objetivo.",
      "Paso 6 — Revisión con IA: Pegar en Claude: 'Eres evaluador de bootcamp de IA. Revisa este documento: viabilidad técnica 4 semanas, claridad del problema, arquitectura, métricas.' Incorporar 3 mejoras documentadas.",
    ],
    resultado:
      "Documento de 4-6 páginas: descripción del problema + diagrama arquitectura + plan 4 sprints + métricas técnicas y de negocio + revisión de IA con mejoras incorporadas.",
    criterios: [
      { criterio: "Problema con las 5 características, bien documentado", puntos: 25 },
      { criterio: "Diagrama de arquitectura con tecnologías específicas", puntos: 20 },
      { criterio: "Plan de 4 sprints con tareas concretas y entregables verificables", puntos: 20 },
      { criterio: "Métricas técnicas y de negocio con baseline y objetivo", puntos: 20 },
      { criterio: "Revisión de IA con al menos 3 mejoras incorporadas", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Y Combinator — Essential Startup Advice",
      url: "https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice",
      tipo: "lectura",
      descripcion: "Principios para construir productos que resuelven problemas reales",
    },
    {
      titulo: "Streamlit — Interfaces de IA en horas",
      url: "https://streamlit.io/",
      tipo: "herramienta",
      descripcion: "Framework Python para crear interfaces de usuario para proyectos de IA",
    },
    {
      titulo: "Excalidraw — Diagramas de arquitectura",
      url: "https://excalidraw.com/",
      tipo: "herramienta",
      descripcion: "Herramienta gratuita para diagramas técnicos de arquitectura de sistemas",
    },
    {
      titulo: "Papers With Code — Estado del arte por tarea",
      url: "https://paperswithcode.com/",
      tipo: "lectura",
      descripcion: "Directorio de modelos y benchmarks para cada tarea de ML",
    },
  ],
};

const sesion14: SesionBootcamp = placeholder(14, "Proyecto Final: semanas 1 y 2 — datos y modelo", MOD4, 4);
const sesion15: SesionBootcamp = placeholder(15, "Proyecto Final: integración, API y prueba con usuario real", MOD4, 4);
const sesion16: SesionBootcamp = placeholder(16, "Demo Day: presentación final, portafolio y cierre del bootcamp", MOD4, 4);

// ─── EXPORT ─────────────────────────────────────────────────────────────────

export const BOOTCAMP_MES3_SESIONES: SesionBootcamp[] = [
  sesion1,  sesion2,  sesion3,  sesion4,
  sesion5,  sesion6,  sesion7,  sesion8,
  sesion9,  sesion10, sesion11, sesion12,
  sesion13, sesion14, sesion15, sesion16,
];
