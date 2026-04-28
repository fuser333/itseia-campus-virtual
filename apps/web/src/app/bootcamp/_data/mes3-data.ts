// ─── BOOTCAMP INTENSIVO DE IA — Mes 3 (16 sesiones) ─────────────────────────
// Programa: Bootcamp Intensivo de IA — ITSEIA
// Mes 3: Especialización y Proyecto Final
// Módulo 1: Visión Computacional (Sesiones 1-4)
// Módulo 2: NLP Avanzado (Sesiones 5-8)
// Módulo 3: MLOps (Sesiones 9-12)
// Módulo 4: Proyecto Final (Sesiones 13-16)

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

export interface SesionMes3 {
  id: number;
  titulo: string;
  modulo: string;
  moduloNum: number;
  videoEmbed: string;
  videoTitulo: string;
  videoDuracion?: string;
  teoria: string;
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
}

export const BOOTCAMP_MES3_MODULOS = [
  { num: 1, nombre: "Visión Computacional", horas: 8, sesiones: 4 },
  { num: 2, nombre: "NLP Avanzado", horas: 8, sesiones: 4 },
  { num: 3, nombre: "MLOps", horas: 8, sesiones: 4 },
  { num: 4, nombre: "Proyecto Final", horas: 8, sesiones: 4 },
];

const MOD1 = "Visión Computacional";
const MOD2 = "NLP Avanzado";
const MOD3 = "MLOps";
const MOD4 = "Proyecto Final";

// ─── MÓDULO 1: Visión Computacional (Sesiones 1-4) ──────────────────────────

const sesion1: SesionMes3 = {
  id: 1,
  titulo: "OpenCV: Procesamiento de Imágenes desde Cero",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "OpenCV en Python — Fundamentos de Visión Computacional",
  videoDuracion: "45 min",
  teoria: `OpenCV (Open Source Computer Vision Library) es la biblioteca de visión computacional más utilizada en el mundo. Desarrollada originalmente por Intel en 1999 y mantenida hoy por la comunidad open source, OpenCV provee más de 2,500 algoritmos optimizados para procesamiento de imágenes y video en tiempo real.

Una imagen digital es fundamentalmente una matriz de números. Una imagen en escala de grises de 640x480 píxeles es una matriz de 480 filas por 640 columnas donde cada celda contiene un valor entre 0 (negro) y 255 (blanco). Una imagen a color en formato BGR (el estándar de OpenCV) tiene tres de estas matrices apiladas, una por canal: Azul, Verde y Rojo. Entender esta representación matricial es crítico porque todas las operaciones de procesamiento son operaciones matemáticas sobre estas matrices.

Las operaciones fundamentales en OpenCV se agrupan en cuatro categorías. Primero, las transformaciones geométricas: redimensionar (cv2.resize), rotar (cv2.rotate), recortar (slicing de array NumPy), voltear (cv2.flip) y aplicar perspectiva (cv2.warpPerspective). Segundo, el procesamiento de color: convertir espacios de color (cv2.cvtColor), por ejemplo de BGR a HSV para segmentar objetos por color, o a escala de grises para simplificar cómputo. Tercero, el filtrado: suavizar con Gaussian Blur para eliminar ruido (cv2.GaussianBlur), detectar bordes con Canny (cv2.Canny), aplicar morfología (erosión, dilatación) para limpiar máscaras binarias. Cuarto, la detección de características: contornos (cv2.findContours), esquinas (cv2.cornerHarris), puntos de interés (SIFT, ORB).

El pipeline estándar de procesamiento de imagen en un proyecto profesional sigue este flujo: cargar imagen → convertir espacio de color → aplicar filtro de ruido → detectar características de interés → extraer región de interés (ROI) → clasificar o medir → visualizar resultado. Este pipeline se aplica a casos reales como control de calidad en manufactura, análisis de documentos y seguimiento de objetos en video.

En el contexto ecuatoriano, OpenCV se usa en proyectos de detección de plagas en cultivos de banano mediante análisis de imágenes de drones, medición del tamaño de camarones en plantas acuícolas, y verificación de documentos de identidad en procesos bancarios digitales. La combinación OpenCV + Python + una cámara económica puede reemplazar procesos de inspección visual que antes requerían operadores humanos trabajando en condiciones adversas.

El rendimiento es una consideración importante. OpenCV está optimizado en C++ internamente; la API de Python es un wrapper. Para aplicaciones en tiempo real, el pipeline debe procesar un frame en menos de 33ms (30 FPS). Las optimizaciones clave son: usar operaciones vectorizadas de NumPy en lugar de loops Python, reducir resolución de frames antes de procesar, y aplicar el procesamiento más costoso solo sobre la región de interés, no sobre el frame completo.`,
  presentacionSlides: [
    { titulo: "Mes 3 — Sesión 1", contenido: "OpenCV: Procesamiento de Imágenes\nVisión Computacional Aplicada\nITSEIA Bootcamp Intensivo de IA" },
    { titulo: "¿Qué es una imagen para una computadora?", contenido: "Escala de grises: matriz 2D de valores 0-255\nColor BGR: 3 matrices apiladas (Azul, Verde, Rojo)\nShape: (alto, ancho, canales)\nTipo: NumPy ndarray" },
    { titulo: "Operaciones fundamentales", contenido: "1. Transformaciones geométricas: resize, rotate, warp\n2. Espacios de color: BGR → HSV, Grayscale\n3. Filtrado: GaussianBlur, Canny, morfología\n4. Detección: contornos, esquinas, keypoints" },
    { titulo: "Pipeline estándar", contenido: "Cargar → Color → Filtrar → Detectar → ROI → Clasificar → Visualizar\n\nCada paso tiene su función OpenCV correspondiente." },
    { titulo: "Casos Ecuador", contenido: "• Detección de plagas en cultivos de banano (drones)\n• Medición de camarones en acuicultura\n• Verificación de documentos bancarios\n• Control de calidad en manufactura" },
    { titulo: "Rendimiento en tiempo real", contenido: "30 FPS = 33ms por frame\nOptimizar: NumPy vectorizado, reducir resolución, procesar solo ROI\nProfile con cv2.getTickCount()" },
  ],
  quiz: [
    { pregunta: "¿En qué formato de color almacena OpenCV las imágenes por defecto (diferente de lo esperado)?", opciones: ["RGB", "BGR", "HSV", "CMYK"], respuesta: 1, explicacion: "OpenCV usa BGR (Azul, Verde, Rojo) en lugar del RGB estándar de la mayoría de bibliotecas. Ignorar esto causa colores invertidos." },
    { pregunta: "¿Qué función de OpenCV detecta bordes usando gradientes de intensidad?", opciones: ["cv2.GaussianBlur", "cv2.Canny", "cv2.findContours", "cv2.threshold"], respuesta: 1, explicacion: "cv2.Canny implementa el algoritmo de detección de bordes de Canny que aplica doble umbral sobre gradientes." },
    { pregunta: "¿Cuántos ms máximo puede tomar procesar un frame para mantener 30 FPS?", opciones: ["16ms", "33ms", "100ms", "500ms"], respuesta: 1, explicacion: "30 FPS = 1000ms / 30 = ~33ms por frame. A mayor latencia, el video se ve entrecortado." },
    { pregunta: "¿Por qué se convierte a escala de grises antes de muchas operaciones de procesamiento?", opciones: ["OpenCV no soporta imágenes a color", "Reduce de 3 canales a 1, disminuyendo el cómputo requerido", "Las imágenes en grises son más precisas", "Es un requisito de todos los algoritmos de detección"], respuesta: 1, explicacion: "Convertir a escala de grises reduce la cantidad de datos a procesar (3 canales → 1), acelerando operaciones posteriores." },
    { pregunta: "¿Qué es una ROI (Region of Interest) en procesamiento de imágenes?", opciones: ["Una imagen completa procesada", "Una subsección de la imagen donde se aplica el procesamiento costoso", "El histograma de colores de la imagen", "Una máscara binaria de la imagen completa"], respuesta: 1, explicacion: "La ROI es el área de interés específica de la imagen. Procesar solo la ROI en lugar del frame completo reduce enormemente el cómputo." },
  ],
  ejercicio: {
    titulo: "Pipeline de control de calidad con OpenCV",
    objetivo: "Construir un pipeline de inspección visual que detecte objetos de un color específico en imágenes, cuente cuántos hay y marque los defectuosos (tamaño fuera de rango).",
    herramientas: "Python 3.10+, OpenCV (pip install opencv-python), NumPy, Google Colab o Jupyter Notebook",
    datosEjemplo: "Usar imágenes de muestra: pelotas rojas, frutas de un color, o tokens de colores. Se pueden generar imágenes sintéticas con cv2.circle() para la práctica.",
    pasos: [
      "Instalar OpenCV: pip install opencv-python-headless numpy",
      "Cargar imagen: img = cv2.imread('muestra.jpg')",
      "Convertir a HSV: hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)",
      "Definir rango de color objetivo (ej. rojo): lower = np.array([0,120,70]), upper = np.array([10,255,255])",
      "Crear máscara: mask = cv2.inRange(hsv, lower, upper)",
      "Limpiar con morfología: mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5,5)))",
      "Encontrar contornos: contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)",
      "Para cada contorno: calcular área con cv2.contourArea(), clasificar como OK (área 500-3000) o DEFECTO",
      "Dibujar bounding box verde (OK) o rojo (defecto) sobre imagen original",
      "Imprimir resumen: total detectados, cuántos OK, cuántos defectos",
    ],
    resultado: "Script Python que procesa una imagen e identifica objetos por color, clasificando cada uno como conforme o defectuoso según su tamaño. Visualización con bounding boxes y conteo en pantalla.",
    criterios: [
      { criterio: "La máscara de color detecta correctamente los objetos objetivo", puntos: 25 },
      { criterio: "La morfología elimina ruido sin eliminar objetos válidos", puntos: 20 },
      { criterio: "Los contornos se clasifican correctamente por área", puntos: 25 },
      { criterio: "La visualización es clara con colores diferenciados", puntos: 20 },
      { criterio: "El script imprime un resumen numérico del resultado", puntos: 10 },
    ],
  },
  recursos: [
    { titulo: "OpenCV Python Tutorials — Documentación oficial", url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html", tipo: "documentacion", descripcion: "Tutoriales oficiales de OpenCV en Python, desde básico hasta avanzado." },
    { titulo: "Real Python — OpenCV Guide", url: "https://realpython.com/opencv-python-color-spaces/", tipo: "lectura", descripcion: "Guía práctica de espacios de color en OpenCV con ejemplos Python." },
    { titulo: "OpenCV en Google Colab", url: "https://colab.research.google.com/", tipo: "herramienta", descripcion: "Entorno gratuito para ejecutar OpenCV sin instalación local." },
    { titulo: "NumPy para imágenes", url: "https://numpy.org/doc/stable/user/absolute_beginners.html", tipo: "documentacion", descripcion: "Fundamentos de NumPy necesarios para manipulación de matrices de imágenes." },
  ],
};

const sesion2: SesionMes3 = {
  id: 2,
  titulo: "YOLO: Detección de Objetos en Tiempo Real",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "YOLOv8 — Detección de Objetos en Tiempo Real con Python",
  videoDuracion: "50 min",
  teoria: `YOLO (You Only Look Once) es la arquitectura de detección de objetos en tiempo real más influyente de la última década. Su nombre describe su innovación fundamental: a diferencia de los detectores de dos etapas (como R-CNN) que primero proponen regiones candidatas y luego las clasifican, YOLO predice bounding boxes y probabilidades de clase directamente en un único paso hacia adelante de la red neuronal. Esta arquitectura de una sola etapa es lo que le permite alcanzar velocidades de inferencia aptas para video en tiempo real.

La arquitectura de YOLO divide la imagen en una grilla de SxS celdas. Cada celda predice simultáneamente: B bounding boxes (cada una con coordenadas x, y, ancho, alto y puntuación de confianza) y C probabilidades de clase condicional. La salida es un tensor de dimensiones SxSx(B*5+C). En YOLOv8, la arquitectura ha evolucionado hacia un diseño sin anclas fijas (anchor-free) que simplifica el entrenamiento y mejora la precisión en objetos pequeños.

YOLOv8, desarrollado por Ultralytics, es la versión actual más adoptada industrialmente. Ofrece cinco variantes según el balance velocidad/precisión: nano (n), small (s), medium (m), large (l) y extra-large (x). Para producción en Ecuador con hardware típico (GPU RTX 3060 o superior), la variante medium ofrece un excelente equilibrio. En CPU solamente, la variante nano permite inferencia razonable aunque por debajo de tiempo real.

El flujo de uso con YOLOv8 es notablemente accesible gracias a la API de Ultralytics. Con cinco líneas de código se puede ejecutar detección sobre una imagen, video o cámara en vivo: importar YOLO, cargar el modelo preentrenado en COCO (80 clases), llamar model.predict() sobre la fuente, iterar sobre los resultados y acceder a boxes.xyxy para las coordenadas y boxes.cls para las clases detectadas.

El entrenamiento personalizado (fine-tuning) con datos propios es donde YOLO cobra máximo valor para proyectos ecuatorianos. Si el modelo preentrenado en COCO no incluye las clases que necesitas (por ejemplo: cacao dañado vs sano, especie de pez en planta acuícola, tipo de vehículo específico), puedes entrenarlo con tus propias imágenes anotadas. El proceso requiere: recopilar y anotar imágenes (herramienta recomendada: Roboflow), organizar en estructura YOLO (train/val/test con imágenes y labels), crear archivo data.yaml con rutas y nombre de clases, y ejecutar model.train(). Con 200-500 imágenes por clase y una GPU modesta, el entrenamiento de YOLOv8n tarda entre 30 minutos y 2 horas.

Las métricas clave para evaluar un detector son mAP (mean Average Precision), que mide la precisión promedio sobre todos los umbrales de IoU y todas las clases, y la latencia de inferencia en milisegundos por frame. Un mAP@50 superior a 0.85 indica un modelo listo para producción en tareas de detección industrial.`,
  presentacionSlides: [
    { titulo: "Mes 3 — Sesión 2", contenido: "YOLO: Detección de Objetos en Tiempo Real\nYOLOv8 + Python + casos Ecuador\nITSEIA Bootcamp Intensivo de IA" },
    { titulo: "¿Por qué YOLO es especial?", contenido: "Detectores de 2 etapas: proponer regiones → clasificar (lento)\nYOLO: predice todo en 1 solo paso (rápido)\n\nResultado: 30-120 FPS según variante y hardware" },
    { titulo: "Arquitectura YOLOv8", contenido: "Divide imagen en grilla SxS\nCada celda: B boxes + C probabilidades de clase\nAnchor-free: sin anclas fijas (más simple y preciso)\n5 variantes: n, s, m, l, x" },
    { titulo: "Uso en 5 líneas", contenido: "from ultralytics import YOLO\nmodel = YOLO('yolov8m.pt')\nresults = model.predict('imagen.jpg')\nfor r in results:\n    print(r.boxes.xyxy, r.boxes.cls)" },
    { titulo: "Fine-tuning con datos propios", contenido: "1. Anotar imágenes (Roboflow)\n2. Organizar: train/val/test + labels\n3. Crear data.yaml\n4. model.train(data='data.yaml', epochs=50)\n200-500 imágenes por clase" },
    { titulo: "Casos Ecuador", contenido: "• Cacao dañado vs sano (exportación)\n• Especies de peces en acuicultura\n• Conteo de reses en ganadería\n• Vehículos en peajes inteligentes" },
  ],
  quiz: [
    { pregunta: "¿Cuál es la innovación fundamental de YOLO respecto a detectores anteriores?", opciones: ["Usa redes más profundas que los detectores previos", "Realiza la detección en un solo paso (una sola pasada por la red)", "Funciona únicamente con imágenes estáticas", "No requiere GPU para funcionar"], respuesta: 1, explicacion: "YOLO (You Only Look Once) predice bounding boxes y clases en un único paso de inferencia, a diferencia de los detectores de 2 etapas que proponen regiones primero." },
    { pregunta: "¿Qué variante de YOLOv8 se recomienda para producción con balance velocidad/precisión en GPU?", opciones: ["nano (n) — máxima velocidad", "medium (m) — balance óptimo", "extra-large (x) — máxima precisión siempre", "small (s) — solo para CPU"], respuesta: 1, explicacion: "YOLOv8m (medium) ofrece el mejor balance entre velocidad de inferencia y precisión para hardware de producción típico." },
    { pregunta: "¿Qué mide la métrica mAP en detección de objetos?", opciones: ["Milisegundos por frame de inferencia", "Precisión promedio sobre todos los umbrales IoU y clases", "Porcentaje de GPU utilizado", "Número de objetos detectados por frame"], respuesta: 1, explicacion: "mAP (mean Average Precision) es la métrica estándar de detección de objetos: calcula el AP para cada clase y promedia." },
    { pregunta: "¿Cuántas imágenes por clase se necesitan como mínimo para un fine-tuning útil con YOLOv8?", opciones: ["10-20 imágenes", "200-500 imágenes", "10,000 imágenes", "100,000 imágenes"], respuesta: 1, explicacion: "Con 200-500 imágenes por clase bien anotadas se puede obtener un modelo útil en producción gracias al transfer learning desde COCO." },
    { pregunta: "¿Qué herramienta se recomienda para anotar imágenes para entrenamiento de YOLO?", opciones: ["Microsoft Paint", "Roboflow", "Google Docs", "Jupyter Notebook"], respuesta: 1, explicacion: "Roboflow es la plataforma de anotación más usada para proyectos YOLO. Incluye conversión automática al formato de Ultralytics y data augmentation." },
  ],
  ejercicio: {
    titulo: "Detector de objetos personalizado con YOLOv8",
    objetivo: "Ejecutar YOLOv8 preentrenado sobre imágenes propias, interpretar los resultados, y diseñar el plan de fine-tuning para una clase personalizada relevante al contexto del estudiante.",
    herramientas: "Python 3.10+, ultralytics (pip install ultralytics), Google Colab (GPU T4 gratuita), Roboflow (plan gratuito)",
    datosEjemplo: "Tomar 10 fotos con el celular de objetos de interés: frutas, productos de tienda, vehículos, herramientas. Usar imágenes de internet si no hay disponibles localmente.",
    pasos: [
      "En Google Colab: !pip install ultralytics",
      "Ejecutar detección preentrenada: from ultralytics import YOLO; model = YOLO('yolov8m.pt'); results = model.predict('tu_imagen.jpg', save=True)",
      "Revisar resultados: cuántos objetos detectó, qué clases, con qué confianza",
      "Ejecutar sobre 5 imágenes diferentes y registrar: ¿qué detectó bien? ¿qué no detectó?",
      "Identificar una clase que COCO no incluye pero es relevante para un negocio ecuatoriano",
      "Diseñar el plan de datos: ¿cuántas imágenes recopilar? ¿cómo anotarlas? ¿qué métricas esperar?",
      "Crear una cuenta en Roboflow y subir 20 imágenes de la clase elegida (práctica de anotación)",
      "Documentar hallazgos en un notebook con capturas de los resultados",
    ],
    resultado: "Notebook ejecutado con detecciones sobre imágenes propias + documento de plan de fine-tuning para clase personalizada + 20 imágenes anotadas en Roboflow.",
    criterios: [
      { criterio: "YOLOv8 ejecutado exitosamente sobre mínimo 5 imágenes", puntos: 30 },
      { criterio: "Análisis crítico de qué detectó bien y mal", puntos: 20 },
      { criterio: "Clase personalizada identificada con justificación de negocio", puntos: 20 },
      { criterio: "Plan de datos documentado (volumen, fuentes, métricas esperadas)", puntos: 20 },
      { criterio: "20 imágenes anotadas en Roboflow", puntos: 10 },
    ],
  },
  recursos: [
    { titulo: "YOLOv8 Documentación — Ultralytics", url: "https://docs.ultralytics.com/", tipo: "documentacion", descripcion: "Documentación oficial de YOLOv8 con guías de entrenamiento y despliegue." },
    { titulo: "Roboflow — Plataforma de anotación", url: "https://roboflow.com/", tipo: "herramienta", descripcion: "Plataforma de anotación, augmentation y gestión de datasets para visión computacional." },
    { titulo: "YOLOv8 en Colab — Tutorial oficial", url: "https://colab.research.google.com/github/ultralytics/ultralytics/blob/main/examples/tutorial.ipynb", tipo: "herramienta", descripcion: "Notebook oficial de Ultralytics para ejecutar YOLOv8 en Google Colab." },
    { titulo: "Papers with Code — Object Detection", url: "https://paperswithcode.com/task/object-detection", tipo: "lectura", descripcion: "Benchmark de todos los modelos de detección de objetos con métricas comparativas." },
    { titulo: "COCO Dataset — 80 clases preentrenadas", url: "https://cocodataset.org/", tipo: "documentacion", descripcion: "Dataset COCO con las 80 clases en las que está preentrenado YOLOv8." },
  ],
};

const sesion3: SesionMes3 = {
  id: 3,
  titulo: "Stable Diffusion: Generación de Imágenes con IA",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Stable Diffusion — Cómo funciona y cómo usarlo profesionalmente",
  videoDuracion: "48 min",
  teoria: `Stable Diffusion es un modelo generativo de imágenes de código abierto lanzado por Stability AI en agosto de 2022. A diferencia de DALL-E (cerrado, de pago) o Midjourney (cerrado, suscripción), Stable Diffusion es completamente open source y puede ejecutarse en hardware local con una GPU de 4GB de VRAM o superior, lo que lo hace accesible para proyectos en Ecuador sin costos recurrentes de API.

El mecanismo de funcionamiento se basa en difusión latente. Durante el entrenamiento, el modelo aprendió a revertir un proceso de añadir ruido gaussiano progresivo a imágenes. En la inferencia, parte de ruido puro y aplica iterativamente pasos de denoising guiados por el texto (prompt). La clave de la dirección del denoising es el codificador de texto CLIP, que convierte el prompt a un embedding vectorial que orienta el proceso de generación. El resultado es una imagen que satisface simultáneamente la señal del texto y la distribución de imágenes naturales aprendida durante el entrenamiento.

La arquitectura Latent Diffusion funciona en un espacio latente comprimido (factor 8x) en lugar de en el espacio de píxeles directamente. Esto reduce dramáticamente el cómputo necesario: un modelo de difusión en espacio latente puede generar imágenes de 512x512 en una GPU de consumo, mientras que los modelos de difusión en espacio de píxeles requerirían hardware de datacenter.

Los parámetros de generación más importantes para un uso profesional son: el prompt positivo (qué generar), el prompt negativo (qué evitar, crucial para calidad), el CFG Scale (cuánto sigue el modelo el prompt: 7 es estándar, más alto = más fiel pero menos creativo), el número de pasos de sampling (20-30 es suficiente con samplers modernos como DPM++ 2M Karras), y la semilla (seed) para reproducibilidad de resultados.

Para aplicaciones profesionales en Ecuador, Stable Diffusion con técnicas de fine-tuning como LoRA (Low-Rank Adaptation) permite entrenar un modelo que genera imágenes con el estilo visual de una marca específica usando solo 20-30 imágenes de referencia. Esto tiene aplicaciones directas en: generación de variaciones de productos para e-commerce (Jumbo, Supermaxi, tiendas online), creación de mockups de packaging, generación de contenido visual para redes sociales en el estilo editorial de la marca, y visualización de proyectos arquitectónicos o de diseño de interiores a partir de bocetos.

La ética del uso de modelos generativos es un tema activo. Stable Diffusion fue entrenado sobre LAION-5B, un dataset web que incluye obras de artistas sin su consentimiento explícito. El debate sobre derechos de autor de imágenes generadas por IA está abierto legalmente en múltiples jurisdicciones. Como práctica responsable, se recomienda: declarar siempre que el contenido fue generado por IA, no usar para imitar el estilo de artistas vivos específicos sin permiso, y verificar la política de uso comercial del modelo específico empleado.`,
  presentacionSlides: [
    { titulo: "Mes 3 — Sesión 3", contenido: "Stable Diffusion: Generación de Imágenes con IA\nOpen source, local, profesional\nITSEIA Bootcamp Intensivo de IA" },
    { titulo: "¿Qué hace especial a Stable Diffusion?", contenido: "Open source (puedes descargarlo y ejecutarlo)\nLocal (sin costos de API)\nPersonalizable (fine-tuning con tus propias imágenes)\nActiva comunidad de modelos y extensiones" },
    { titulo: "Cómo funciona: difusión latente", contenido: "Entrenamiento: añade ruido → aprende a revertirlo\nInferencia: parte de ruido puro\nDenoising guiado por CLIP (texto → vector)\nEspacio latente: 8x más eficiente que píxeles" },
    { titulo: "Parámetros clave", contenido: "Prompt positivo: qué generar\nPrompt negativo: qué evitar (crucial)\nCFG Scale: 7 = balance texto/creatividad\nPasos: 20-30 (DPM++ 2M Karras)\nSeed: reproducibilidad" },
    { titulo: "LoRA: fine-tuning económico", contenido: "20-30 imágenes de referencia\nEntrena en GPU de consumo (~1 hora)\nAplica estilo de marca específico\nCasos: e-commerce, packaging, redes sociales" },
    { titulo: "Ética y uso responsable", contenido: "Declarar siempre que es contenido de IA\nNo imitar artistas vivos sin permiso\nVerificar licencia comercial del modelo\nRespeto a derechos de autor" },
  ],
  quiz: [
    { pregunta: "¿Cuál es la ventaja principal de Stable Diffusion respecto a DALL-E o Midjourney?", opciones: ["Genera imágenes de mayor calidad", "Es open source y puede ejecutarse localmente sin costos de API", "Tiene más variedad de estilos predefinidos", "Es el único que soporta español en los prompts"], respuesta: 1, explicacion: "Stable Diffusion es open source y corre localmente en GPU de consumo, eliminando costos recurrentes de API y permitiendo personalización completa." },
    { pregunta: "¿Qué componente de Stable Diffusion convierte el texto del prompt en un vector que guía la generación?", opciones: ["El VAE (Variational Autoencoder)", "El codificador de texto CLIP", "El sampler DPM++", "El modelo U-Net"], respuesta: 1, explicacion: "CLIP convierte el prompt de texto a un embedding vectorial que orienta el proceso de denoising hacia la imagen deseada." },
    { pregunta: "¿Para qué sirve el prompt negativo en Stable Diffusion?", opciones: ["Para generar imágenes en colores negativos (invertidos)", "Para especificar qué elementos evitar en la imagen generada", "Para reducir el tiempo de generación", "Para generar en menor resolución"], respuesta: 1, explicacion: "El prompt negativo lista elementos que el modelo debe evitar. Ejemplos típicos: 'blurry, bad anatomy, extra fingers, watermark'." },
    { pregunta: "¿Cuántas imágenes de referencia necesita LoRA para hacer fine-tuning de un estilo de marca?", opciones: ["1-5 imágenes", "20-30 imágenes", "1,000 imágenes", "10,000 imágenes"], respuesta: 1, explicacion: "LoRA (Low-Rank Adaptation) puede aprender un estilo con solo 20-30 imágenes de referencia en ~1 hora de entrenamiento en GPU de consumo." },
    { pregunta: "¿Cuál es la práctica ética recomendada al usar imágenes generadas por IA en comunicaciones profesionales?", opciones: ["No declarar el origen para evitar confusiones", "Declarar siempre que el contenido fue generado por IA", "Solo usar en redes sociales, nunca en materiales impresos", "Agregar una marca de agua automáticamente"], respuesta: 1, explicacion: "La transparencia sobre el origen del contenido generado por IA es la práctica ética estándar recomendada por la mayoría de organizaciones profesionales." },
  ],
  ejercicio: {
    titulo: "Generación de assets visuales con Stable Diffusion para una marca ecuatoriana",
    objetivo: "Usar Stable Diffusion (via API de Stability AI o interfaz AUTOMATIC1111) para generar 5 variaciones de un asset visual para una marca ficticia ecuatoriana, optimizando prompts y documentando el proceso.",
    herramientas: "Stability AI API (stability.ai, plan gratuito de prueba) o Google Colab con diffusers, AUTOMATIC1111 WebUI si hay GPU local",
    datosEjemplo: "Marca ficticia: 'Andes Coffee' — café de especialidad de Loja. Necesita imágenes para redes sociales: taza de café con paisaje andino, empaque artesanal, barista preparando café de origen.",
    pasos: [
      "Acceder a Stability AI API o instalar diffusers en Colab: !pip install diffusers transformers accelerate",
      "Definir el brief visual: marca, estilo, paleta de colores, emoción que debe transmitir",
      "Escribir el primer prompt positivo descriptivo (mínimo 50 palabras detalladas)",
      "Escribir el prompt negativo (elementos a evitar: blurry, watermark, text, bad quality)",
      "Generar la imagen con CFG=7, 25 pasos, 512x512",
      "Evaluar resultado: ¿qué funciona? ¿qué falta?",
      "Iterar el prompt 3 veces mejorando cada vez, documentando qué cambió",
      "Generar versión final con upscaling a 1024x1024",
      "Documentar el prompt ganador con todos los parámetros para reproducibilidad",
    ],
    resultado: "5 imágenes generadas con iteración documentada de prompts + prompt final reproducible + análisis de qué técnicas de prompting mejoraron la calidad.",
    criterios: [
      { criterio: "Brief visual de la marca definido claramente", puntos: 15 },
      { criterio: "Mínimo 3 iteraciones de prompt documentadas con cambios justificados", puntos: 35 },
      { criterio: "Imagen final de calidad aceptable para uso en redes sociales", puntos: 30 },
      { criterio: "Prompt final documentado con todos los parámetros", puntos: 20 },
    ],
  },
  recursos: [
    { titulo: "Stability AI API — Documentación", url: "https://platform.stability.ai/docs/api-reference", tipo: "documentacion", descripcion: "API REST de Stability AI para generación de imágenes sin infraestructura propia." },
    { titulo: "Hugging Face Diffusers", url: "https://huggingface.co/docs/diffusers/index", tipo: "documentacion", descripcion: "Biblioteca oficial para usar modelos de difusión incluyendo Stable Diffusion." },
    { titulo: "AUTOMATIC1111 WebUI", url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui", tipo: "herramienta", descripcion: "Interfaz web local más popular para Stable Diffusion con cientos de extensiones." },
    { titulo: "PromptHero — Biblioteca de prompts", url: "https://prompthero.com/", tipo: "herramienta", descripcion: "Galería de prompts exitosos con los parámetros exactos usados para cada imagen." },
  ],
};

const sesion4: SesionMes3 = {
  id: 4,
  titulo: "Casos Reales de Visión Computacional en Ecuador",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Visión Computacional en la Industria Ecuatoriana — Casos y ROI",
  videoDuracion: "42 min",
  teoria: `La visión computacional ha pasado de ser una tecnología experimental a una herramienta de reducción de costos y mejora de calidad en industrias ecuatorianas concretas. Esta sesión analiza cinco sectores donde la implementación ya está ocurriendo o donde existe demanda clara documentada, para que el estudiante pueda identificar oportunidades profesionales reales.

El sector agrícola es el más activo. Ecuador exporta flores, banano, cacao y camarón por más de 6,000 millones de dólares anuales, y cada uno de estos productos tiene procesos de control de calidad que hoy son manuales y candidatos a automatización visual. En floricultura, los sistemas de visión computacional miden el largo del tallo, el diámetro del botón y detectan imperfecciones en el pétalo usando cámaras industriales y modelos de clasificación entrenados con imágenes del tipo de flor específico. En banano, los algoritmos detectan el porcentaje de área afectada por Sigatoka o Black Sigatoka en fotografías de hojas tomadas por drones, lo que permite aplicaciones de fungicidas de precisión reduciendo el uso hasta un 30% sin afectar la calidad del tratamiento.

El sector retail y logístico presenta el caso de uso más estandarizado globalmente: la gestión de inventario por visión. Supermercados como Supermaxi o TIA pueden usar cámaras sobre los estantes para detectar productos agotados (shelf gaps) en tiempo real, disparando alertas al equipo de reposición automáticamente. El sistema requiere un modelo YOLOv8 fine-tuned con el planograma específico de cada cadena. La reducción en pérdidas por desabastecimiento no detectado justifica la inversión en 6 a 18 meses según el volumen de tiendas.

En el sector financiero y de seguros, el caso más impactante es la automatización de peritajes vehiculares. Cuando un vehículo sufre un siniestro, hoy un perito físico debe visitar el automóvil, fotografiar el daño, estimar el costo de reparación y emitir un informe. Este proceso tarda 3 a 7 días hábiles. Un sistema de visión computacional puede, a partir de fotos tomadas por el asegurado con su celular: detectar la zona dañada, clasificar el tipo de daño (abolladura, rayón, ruptura), estimar el porcentaje de severidad, y pre-calcular el costo de reparación consultando una base de precios de repuestos. El resultado reduce el proceso a horas y libera a los peritos para casos complejos.

En manufactura, la planta de Toyota en Quito y varias empresas de metalmecánica e industria plástica están explorando la inspección visual automatizada en línea de producción. El sistema instala una cámara sobre la cinta transportadora, captura cada pieza y la clasifica como conforme o defectuosa en menos de 100ms, separando automáticamente las piezas rechazadas. La clave técnica es el balance entre precisión (no rechazar piezas buenas) y recall (no pasar piezas malas). Este trade-off se configura ajustando el umbral de confianza del modelo según el costo relativo de cada tipo de error.

La propuesta de valor para el profesional de IA que implementa estos sistemas combina: conocimiento de visión computacional (OpenCV, YOLO, modelos de clasificación), comprensión del negocio del cliente (métricas de calidad, costos de los errores manuales, procesos de integración), y gestión del proyecto de implementación (hardware: cámaras industriales, iluminación controlada, edge computing con NVIDIA Jetson o Raspberry Pi). Los proyectos bien delimitados con ROI claro y métricas de éxito definidas antes de empezar tienen tasas de éxito mucho mayores que los proyectos de "exploración general de IA".`,
  presentacionSlides: [
    { titulo: "Mes 3 — Sesión 4", contenido: "Visión Computacional en Ecuador\nCasos reales, ROI y oportunidades profesionales\nITSEIA Bootcamp Intensivo de IA" },
    { titulo: "Sector agrícola", contenido: "Floricultura: largo de tallo, calidad de botón, defectos\nBanano: detección de Sigatoka en hojas por drones\nCacao: clasificación de granos por fermentación\nCamarón: medición de talla en planta" },
    { titulo: "Retail y logística", contenido: "Shelf gap detection: productos agotados en tiempo real\nModelo YOLO fine-tuned con planograma de cada cadena\nAlertas automáticas al equipo de reposición\nROI: 6-18 meses según volumen de tiendas" },
    { titulo: "Seguros: peritaje automatizado", contenido: "Hoy: perito físico, 3-7 días, alto costo\nCon IA: fotos del asegurado → detección daño → estimación costo → horas\nBeneficios: velocidad, consistencia, escalabilidad" },
    { titulo: "Manufactura", contenido: "Cámara sobre cinta transportadora\nClasificación OK/defecto en <100ms\nTrade-off: umbral de confianza = precision vs recall\nHardware: NVIDIA Jetson, Raspberry Pi" },
    { titulo: "Propuesta de valor profesional", contenido: "Visión CV + negocio del cliente + gestión del proyecto\nHardware: cámaras industriales, iluminación, edge\nPrecio: $15,000-$80,000 según complejidad\nEmplear métricas de éxito antes de empezar" },
  ],
  quiz: [
    { pregunta: "¿Cuál de estos sectores ecuatorianos tiene la mayor adopción actual de visión computacional según la sesión?", opciones: ["Minería", "Sector agrícola y exportación", "Turismo", "Educación"], respuesta: 1, explicacion: "El sector agrícola de exportación (flores, banano, cacao, camarón) es el más activo en adopción de visión computacional en Ecuador por el impacto directo en calidad de exportación." },
    { pregunta: "En un sistema de inspección visual de manufactura, ¿qué implica ajustar el umbral de confianza del modelo?", opciones: ["Cambiar el modelo YOLO por otro más preciso", "Modificar el balance entre precision (no rechazar buenos) y recall (no pasar malos)", "Aumentar la velocidad de la cinta transportadora", "Reducir el número de cámaras necesarias"], respuesta: 1, explicacion: "El umbral de confianza controla el balance: umbral alto = menos falsos positivos (más precision); umbral bajo = menos falsos negativos (más recall)." },
    { pregunta: "¿Cuánto puede durar hoy un peritaje vehicular manual en Ecuador y a qué reduce el tiempo el sistema de visión computacional?", opciones: ["De 1 día a 1 hora", "De 3-7 días a horas", "De 1 mes a 1 semana", "No hay diferencia significativa"], respuesta: 1, explicacion: "El peritaje manual toma 3-7 días hábiles. El sistema de IA, con fotos del asegurado desde el celular, puede completar la pre-evaluación en horas." },
    { pregunta: "¿Qué hardware se menciona como opción para edge computing en inspección visual industrial?", opciones: ["iPad Pro y MacBook", "NVIDIA Jetson o Raspberry Pi", "Servidor en la nube de AWS", "Smartphone Android de gama media"], respuesta: 1, explicacion: "NVIDIA Jetson (para inferencia GPU en edge) y Raspberry Pi (para casos de menor demanda) son las plataformas de edge computing más usadas en inspección visual industrial." },
    { pregunta: "¿Cuál es el rango de inversión típico para un proyecto de visión computacional industrial en Ecuador según la sesión?", opciones: ["$500-$2,000", "$5,000-$10,000", "$15,000-$80,000", "$500,000+"], respuesta: 2, explicacion: "Los proyectos bien delimitados de visión computacional industrial se ubican en el rango de $15,000-$80,000 según la complejidad del sistema y la integración requerida." },
  ],
  ejercicio: {
    titulo: "Análisis de oportunidad: proyecto de visión computacional para empresa ecuatoriana",
    objetivo: "Identificar un caso de uso real de visión computacional para una empresa o sector ecuatoriano específico, cuantificar el problema actual y diseñar la solución técnica con estimación de ROI.",
    herramientas: "Google Docs o Notion para el análisis, datos públicos de sectores económicos del Ecuador (Banco Central, Pro Ecuador)",
    datosEjemplo: "Sectores a analizar: floricultura en Cayambe, banano en El Oro, camarón en Guayas, manufactura en Cuenca, retail en Quito/Guayaquil, seguros vehiculares.",
    pasos: [
      "Elegir un sector/empresa específica (real o representativa del sector)",
      "Describir el proceso manual actual: ¿quién lo hace? ¿cuánto tarda? ¿cuál es el costo estimado?",
      "Identificar el problema que visión computacional puede resolver (defectos, conteo, medición, clasificación)",
      "Definir las entradas: ¿qué imágenes o video se necesitan? ¿cómo se capturan?",
      "Proponer la arquitectura técnica: ¿qué modelo? (YOLO, clasificador CNN, OCR) ¿qué hardware?",
      "Calcular el ahorro anual estimado: (tiempo ahorrado x costo hora) + (reducción de errores x costo de cada error)",
      "Estimar el costo de implementación: desarrollo + hardware + instalación + capacitación",
      "Calcular ROI y tiempo de recuperación de inversión",
      "Presentar en formato de 1 página ejecutiva",
    ],
    resultado: "Documento de 1 página con análisis de oportunidad: problema actual cuantificado, solución propuesta, arquitectura técnica, estimación de ROI y tiempo de recuperación.",
    criterios: [
      { criterio: "Problema actual descrito con números (tiempo, costo, escala)", puntos: 25 },
      { criterio: "Solución técnica específica y factible", puntos: 25 },
      { criterio: "Cálculo de ahorro anual con supuestos explícitos", puntos: 25 },
      { criterio: "Estimación de costo e inversión fundamentada", puntos: 15 },
      { criterio: "Presentación ejecutiva clara y concisa (1 página)", puntos: 10 },
    ],
  },
  recursos: [
    { titulo: "Pro Ecuador — Estadísticas de exportación", url: "https://www.proecuador.gob.ec/estadisticas/", tipo: "lectura", descripcion: "Datos oficiales de exportaciones ecuatorianas por sector, útiles para cuantificar el mercado." },
    { titulo: "NVIDIA Jetson para edge AI", url: "https://developer.nvidia.com/embedded/jetson-modules", tipo: "documentacion", descripcion: "Plataforma de cómputo edge de NVIDIA para visión computacional industrial." },
    { titulo: "Ultralytics HUB — Gestión de proyectos YOLO", url: "https://hub.ultralytics.com/", tipo: "herramienta", descripcion: "Plataforma cloud de Ultralytics para entrenamiento y gestión de modelos YOLO en producción." },
    { titulo: "Roboflow Universe — Datasets públicos", url: "https://universe.roboflow.com/", tipo: "herramienta", descripcion: "Miles de datasets anotados disponibles para fine-tuning, incluyendo algunos de agricultura." },
  ],
};

// ─── MÓDULO 2: NLP Avanzado (Sesiones 5-8) ──────────────────────────────────

const sesion5: SesionMes3 = {
  id: 5,
  titulo: "Análisis de Sentimientos: Teoría y Práctica",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Análisis de Sentimientos con Python y Transformers — Guía completa",
  videoDuracion: "46 min",
  teoria: `El análisis de sentimientos (también llamado minería de opiniones) es la tarea de NLP que determina la actitud emocional expresada en un texto: positiva, negativa o neutral. Es uno de los casos de uso de IA con mayor adopción empresarial global porque resuelve un problema concreto con ROI inmediato: entender qué piensan los clientes a escala, sin leer manualmente miles de comentarios, reseñas o mensajes.

Existen tres enfoques principales ordenados por sofisticación. El enfoque léxico o basado en diccionarios (VADER, SentiWordNet) asigna una puntuación positiva o negativa a cada palabra según un diccionario precompilado y promedia. Es rápido, sin entrenamiento, pero falla con contexto, ironía y vocabulario específico del dominio. El enfoque de Machine Learning clásico (Naive Bayes, SVM con TF-IDF) entrena un clasificador sobre textos etiquetados. Mejor que léxico pero requiere muchos datos etiquetados para el dominio específico. El enfoque de Transformers (BERT, RoBERTa, modelos especializados como pysentimiento para español) usa atención para capturar contexto de largo alcance. Actualmente es el estado del arte y el que se recomienda para producción.

Para el contexto ecuatoriano, el español tiene particularidades que los modelos entrenados solo en inglés no manejan bien: modismos locales ("de ley", "chevere", "dar duro"), diminutivos que cambian el tono ("malito", "rapidito"), la tendencia cultural a expresar críticas de forma indirecta, y el uso de regionalismos que difieren entre Quito, Guayaquil y regiones rurales. Por esto se recomienda usar modelos preentrenados en español latinoamericano o hacer fine-tuning con datos ecuatorianos.

pysentimiento es la biblioteca de referencia para análisis de sentimientos en español latinoamericano. Está basada en modelos BERT preentrenados en tweets en español y ofrece análisis de sentimientos (POS/NEG/NEU), detección de emociones (alegría, tristeza, enojo, miedo, sorpresa, asco), análisis de odio, y detección de ironía. Se instala con pip y requiere muy pocas líneas para obtener resultados de calidad profesional.

El análisis de aspecto (Aspect-Based Sentiment Analysis o ABSA) es la evolución del análisis de sentimientos simple. En lugar de clasificar un texto completo como positivo o negativo, ABSA identifica los aspectos específicos mencionados y el sentimiento asociado a cada uno. Por ejemplo, una reseña de un restaurante en Quito podría tener sentimiento positivo hacia la comida pero negativo hacia el servicio y neutro hacia el precio. Este nivel de granularidad permite a las empresas identificar exactamente qué mejorar, no solo si los clientes están satisfechos o no.

Los casos de uso con mayor ROI documentado en empresas ecuatorianas son: monitoreo de redes sociales para marcas (Twitter/X, Instagram, Facebook), análisis de reseñas de Google Maps y plataformas como Listo o Domicilios.com, clasificación automática de tickets de soporte al cliente por urgencia emocional, y análisis de encuestas de satisfacción (CSAT/NPS) a escala sin procesamiento manual. Una empresa de telecomunicaciones puede procesar 10,000 comentarios en segundos con un pipeline automatizado, lo que tomaría semanas a un equipo humano.`,
  presentacionSlides: [
    { titulo: "Mes 3 — Sesión 5", contenido: "Análisis de Sentimientos\nDel diccionario a los Transformers\nITSEIA Bootcamp Intensivo de IA" },
    { titulo: "3 enfoques de menor a mayor sofisticación", contenido: "1. Léxico (VADER): diccionario de palabras, rápido, sin contexto\n2. ML clásico (SVM + TF-IDF): necesita datos etiquetados\n3. Transformers (BERT, pysentimiento): estado del arte, maneja contexto" },
    { titulo: "El desafío del español ecuatoriano", contenido: "'De ley' = definitivamente (positivo)\n'Malito' = mediocre (negativo suavizado)\n'Dar duro' = ser muy bueno (positivo informal)\nModelos solo-inglés fallan con estos patrones" },
    { titulo: "pysentimiento para español", contenido: "BERT preentrenado en tweets en español\nSentimientos: POS/NEG/NEU\nEmociones: alegría, tristeza, enojo, miedo\nDetección de ironía y odio\npip install pysentimiento" },
    { titulo: "Análisis de aspecto (ABSA)", contenido: "Resumen: positivo/negativo en texto completo\nABSA: sentimiento por aspecto específico\nEjemplo: comida ❤ | servicio ✗ | precio ➡\nMucho más útil para mejora de producto" },
    { titulo: "Casos Ecuador", contenido: "• Monitoreo de redes para marcas\n• Reseñas Google Maps y plataformas delivery\n• Tickets de soporte clasificados por emoción\n• Encuestas NPS/CSAT a escala" },
  ],
  quiz: [
    { pregunta: "¿Cuál es la limitación principal del enfoque léxico (VADER) para análisis de sentimientos?", opciones: ["Es demasiado lento para producción", "No maneja contexto, ironía ni vocabulario específico del dominio", "Solo funciona en inglés sin versión para español", "Requiere GPU para funcionar"], respuesta: 1, explicacion: "Los enfoques léxicos asignan puntajes por palabra individual sin entender el contexto. 'No me gusta' puede ser malinterpretado si solo analiza 'gusta' = positivo." },
    { pregunta: "¿Por qué se recomienda pysentimiento sobre modelos en inglés para análisis de comentarios ecuatorianos?", opciones: ["pysentimiento es más rápido que cualquier modelo en inglés", "Está preentrenado en español latinoamericano, manejando modismos y regionalismos", "pysentimiento no requiere instalación", "Los modelos en inglés no soportan texto"], respuesta: 1, explicacion: "pysentimiento fue entrenado en tweets en español latinoamericano, capturando modismos, regionalismos e ironías propias del español de la región." },
    { pregunta: "¿Qué es el Análisis de Sentimientos Basado en Aspectos (ABSA)?", opciones: ["Analizar el sentimiento solo de los adjetivos en el texto", "Identificar aspectos específicos mencionados y el sentimiento asociado a cada uno", "Clasificar el texto como formal o informal", "Detectar el idioma del texto antes del análisis"], respuesta: 1, explicacion: "ABSA identifica aspectos (comida, servicio, precio) y el sentimiento específico de cada uno, siendo mucho más informativo que el análisis de sentimiento global." },
    { pregunta: "¿Cuántos comentarios puede procesar un pipeline de análisis de sentimientos automatizado en segundos?", opciones: ["10-20 comentarios", "100 comentarios", "10,000 comentarios", "Solo 1 por vez"], respuesta: 2, explicacion: "Un pipeline con modelos de Transformers en batch puede procesar miles de comentarios en segundos, lo que tomaría semanas a un equipo humano." },
    { pregunta: "¿Cuál de estos es un caso de uso con mayor ROI documentado para análisis de sentimientos en empresas ecuatorianas?", opciones: ["Generación automática de nuevos productos", "Clasificación de tickets de soporte por urgencia emocional", "Traducción automática de documentos legales", "Predicción del precio del dólar"], respuesta: 1, explicacion: "Clasificar tickets de soporte por emoción (urgente/frustrado vs informativo) permite priorizar atención humana donde más impacta, con ROI claro y medible." },
  ],
  ejercicio: {
    titulo: "Monitor de sentimientos para marca ecuatoriana",
    objetivo: "Construir un script que analice comentarios reales de redes sociales o reseñas de una marca ecuatoriana, genere estadísticas de sentimiento y produzca un informe ejecutivo automático.",
    herramientas: "Python, pysentimiento, pandas, matplotlib, Google Colab, datos de reseñas de Google Maps o comentarios públicos",
    datosEjemplo: "Reseñas de Google Maps de: aerolíneas ecuatorianas, cadenas de comida rápida (KFC Ecuador, Subway Ecuador), bancos (Banco Pichincha, Banco del Pacífico), supermercados. Buscar con 'Ecuador' en Google Maps y copiar las primeras 50 reseñas.",
    pasos: [
      "!pip install pysentimiento pandas matplotlib",
      "Recopilar 50 comentarios reales de una marca (copiar manualmente o usar la API de Google Places si está disponible)",
      "Crear DataFrame de pandas con columna 'texto' y 'fecha'",
      "Inicializar pysentimiento: from pysentimiento import create_analyzer; analyzer = create_analyzer(task='sentiment', lang='es')",
      "Analizar cada comentario: df['sentimiento'] = df['texto'].apply(lambda x: analyzer.predict(x).output)",
      "Calcular estadísticas: value_counts() para distribución, media de confianza",
      "Crear gráfico de torta con matplotlib: positivos vs negativos vs neutrales",
      "Extraer los 5 comentarios más negativos (para área de mejora)",
      "Extraer los 5 comentarios más positivos (para fortalezas)",
      "Generar reporte de texto con resumen ejecutivo de 3 párrafos",
    ],
    resultado: "Script Python ejecutado + gráfico de distribución de sentimientos + top 5 comentarios positivos y negativos + reporte ejecutivo de 3 párrafos.",
    criterios: [
      { criterio: "pysentimiento aplicado correctamente a mínimo 50 comentarios", puntos: 30 },
      { criterio: "Estadísticas de distribución calculadas y graficadas", puntos: 25 },
      { criterio: "Comentarios extremos identificados y presentados", puntos: 20 },
      { criterio: "Reporte ejecutivo con insights accionables", puntos: 25 },
    ],
  },
  recursos: [
    { titulo: "pysentimiento — GitHub oficial", url: "https://github.com/pysentimiento/pysentimiento", tipo: "documentacion", descripcion: "Biblioteca de análisis de sentimientos para español latinoamericano basada en BERT." },
    { titulo: "Hugging Face — Modelos de sentimientos en español", url: "https://huggingface.co/models?language=es&pipeline_tag=text-classification", tipo: "herramienta", descripcion: "Catálogo de modelos de clasificación de texto en español disponibles en Hugging Face." },
    { titulo: "VADER Sentiment Analysis", url: "https://github.com/cjhutto/vaderSentiment", tipo: "documentacion", descripcion: "Implementación de referencia de análisis de sentimientos léxico para comparación." },
    { titulo: "Papers: Aspect-Based Sentiment Analysis Survey", url: "https://arxiv.org/abs/2006.03023", tipo: "lectura", descripcion: "Survey académico sobre ABSA con estado del arte y benchmark de datasets." },
  ],
};

const sesion6: SesionMes3 = {
  id: 6,
  titulo: "Chatbots con LLMs: Diseño e Implementación",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Chatbots con LangChain y OpenAI — De cero a producción",
  videoDuracion: "52 min",
  teoria: `La era de los chatbots basados en reglas (árbol de decisión IF-THEN) ha quedado atrás para la mayoría de aplicaciones empresariales. Los chatbots modernos se construyen sobre LLMs (Modelos de Lenguaje Grande) que entienden lenguaje natural libre, mantienen contexto de la conversación y pueden conectarse a fuentes de datos externas. Esta sesión cubre los patrones arquitectónicos para construir chatbots empresariales robustos.

LangChain es el framework de referencia para construir aplicaciones sobre LLMs. Abstrae la complejidad de conectar modelos de lenguaje con herramientas externas, gestionar la memoria conversacional, implementar cadenas de prompts y orquestar agentes autónomos. Su popularidad viene de que resuelve los problemas prácticos que aparecen al ir más allá de una llamada simple a la API de OpenAI o Claude.

El patrón de Retrieval-Augmented Generation (RAG) es la arquitectura más importante para chatbots empresariales. El problema que resuelve: los LLMs tienen un conocimiento estático hasta su fecha de entrenamiento y no conocen la información específica de tu empresa. RAG soluciona esto de la siguiente forma: (1) los documentos de la empresa se procesan y convierten a embeddings vectoriales almacenados en una base de datos vectorial (Chroma, Pinecone, Weaviate); (2) cuando el usuario hace una pregunta, se buscan los fragmentos más relevantes por similitud semántica; (3) esos fragmentos se incluyen en el prompt del LLM como contexto; (4) el LLM genera una respuesta usando esa información específica. El resultado es un chatbot que "conoce" los documentos de la empresa y responde con información actualizada sin necesidad de reentrenar el modelo.

La gestión de memoria conversacional es el segundo desafío técnico. Los LLMs son stateless por naturaleza: cada llamada a la API es independiente. Para dar al chatbot la sensación de recordar la conversación, se implementa una ventana de contexto que incluye los últimos N turnos de diálogo. LangChain implementa varios tipos de memoria: ConversationBufferMemory (guarda todos los mensajes hasta el límite del contexto), ConversationSummaryMemory (resume la conversación acumulada para ahorrar tokens), y ConversationKGMemory (extrae entidades y relaciones del diálogo como un grafo de conocimiento).

Los prompts de sistema (system prompts) son el componente más determinante de la personalidad y comportamiento del chatbot. Un system prompt bien diseñado define: el rol del asistente ("Eres el asistente virtual de Banco Pichincha especializado en tarjetas de crédito"), los límites de lo que puede y no puede responder, el tono y formato de las respuestas, y las instrucciones para casos límite (qué hacer cuando no sabe la respuesta, cómo escalar a un humano). El tiempo invertido en diseñar y probar el system prompt tiene el mayor impacto en la calidad percibida del chatbot.

Para el mercado ecuatoriano, los casos de uso con mayor tracción son: asistentes de atención al cliente para telecomunicaciones (CNT, Claro, Movistar), banca (Pichincha, Pacífico, Guayaquil), e-commerce y delivery, y municipios con servicios ciudadanos. La integración con WhatsApp Business API es crucial porque WhatsApp tiene penetración superior al 90% en Ecuador. El stack técnico para un chatbot de WhatsApp empresarial es: WhatsApp Business API (via Twilio o Meta directamente) + LangChain + LLM (Claude o GPT-4) + base de datos vectorial para RAG + PostgreSQL para logs de conversación.`,
  presentacionSlides: [
    { titulo: "Mes 3 — Sesión 6", contenido: "Chatbots con LLMs\nLangChain + RAG + WhatsApp\nITSEIA Bootcamp Intensivo de IA" },
    { titulo: "Del chatbot de reglas al LLM", contenido: "Chatbot tradicional: árbol IF-THEN, frágil, costoso de mantener\nChatbot LLM: lenguaje natural libre, adapta, aprende del contexto\n\nLangChain: el framework que conecta todo" },
    { titulo: "RAG — Retrieval-Augmented Generation", contenido: "Problema: LLM no conoce docs de tu empresa\nSolución RAG:\n1. Documentos → embeddings → BD vectorial\n2. Pregunta → buscar fragmentos relevantes\n3. Fragmentos + pregunta → LLM → respuesta\nResultado: chatbot que 'conoce' tu empresa" },
    { titulo: "Gestión de memoria conversacional", contenido: "LLMs son stateless: cada llamada es independiente\nConversationBufferMemory: guarda todos los turnos\nConversationSummaryMemory: resume para ahorrar tokens\nConversationKGMemory: grafo de entidades del diálogo" },
    { titulo: "El system prompt: componente más importante", contenido: "Define: rol, límites, tono, casos borde\nEjemplo: 'Eres asistente de Banco Pichincha...'\nTiempo en system prompt = máximo impacto en calidad\nProbar con Red-teaming antes de producción" },
    { titulo: "Stack WhatsApp Ecuador", contenido: "WhatsApp API (Twilio o Meta) → LangChain → LLM\n+ BD vectorial para RAG\n+ PostgreSQL para logs\n>90% penetración de WhatsApp en Ecuador" },
  ],
  quiz: [
    { pregunta: "¿Cuál es el problema principal que resuelve el patrón RAG en chatbots empresariales?", opciones: ["Hace que el chatbot responda más rápido", "Permite al chatbot conocer y responder sobre documentos específicos de la empresa sin reentrenar el modelo", "Elimina la necesidad de un system prompt", "Reduce el costo de las llamadas a la API del LLM"], respuesta: 1, explicacion: "RAG resuelve el problema de que los LLMs no conocen la información específica de la empresa, conectando la generación con búsqueda semántica en documentos propios." },
    { pregunta: "¿Por qué los LLMs son 'stateless' y cómo se soluciona para dar continuidad a conversaciones?", opciones: ["Son stateless porque no tienen memoria RAM. Se soluciona con más hardware.", "Son stateless porque cada llamada a la API es independiente. Se soluciona incluyendo el historial de turnos anteriores en el prompt.", "Son stateless porque no guardan logs. Se soluciona con una base de datos.", "No son stateless; recuerdan automáticamente las conversaciones."], respuesta: 1, explicacion: "Cada llamada a la API del LLM es independiente. La continuidad se logra incluyendo explícitamente los turnos anteriores de la conversación en el contexto del nuevo prompt." },
    { pregunta: "¿Qué tipo de memoria de LangChain resume la conversación acumulada para reducir el uso de tokens?", opciones: ["ConversationBufferMemory", "ConversationSummaryMemory", "ConversationKGMemory", "ConversationWindowMemory"], respuesta: 1, explicacion: "ConversationSummaryMemory genera un resumen de la conversación pasada en lugar de incluir todos los mensajes, reduciendo el consumo de tokens en diálogos largos." },
    { pregunta: "¿Por qué la integración con WhatsApp Business API es prioritaria para chatbots en Ecuador?", opciones: ["WhatsApp es más barato que SMS", "WhatsApp tiene penetración superior al 90% en Ecuador, siendo el canal de comunicación dominante", "WhatsApp tiene mejor latencia que otros canales", "Solo WhatsApp permite integración con LLMs"], respuesta: 1, explicacion: "Con >90% de penetración en Ecuador, WhatsApp es donde están los usuarios. Un chatbot en WhatsApp alcanza al mayor número posible de clientes." },
    { pregunta: "¿Cuál es el componente de un chatbot LLM que más impacto tiene en la calidad percibida según la sesión?", opciones: ["El modelo LLM elegido (GPT-4 vs Claude)", "El system prompt bien diseñado y probado", "La velocidad del servidor de hosting", "El número de documentos en la base de datos vectorial"], respuesta: 1, explicacion: "El system prompt define el rol, comportamiento, límites y tono del chatbot. Un system prompt bien diseñado mejora dramáticamente la calidad percibida independientemente del modelo usado." },
  ],
  ejercicio: {
    titulo: "Chatbot RAG para empresa ecuatoriana",
    objetivo: "Construir un chatbot funcional usando LangChain + OpenAI que responda preguntas sobre los documentos de una empresa usando RAG, con memoria de conversación.",
    herramientas: "Python, LangChain, OpenAI API (o Claude API), ChromaDB, Google Colab, documentos PDF de ejemplo",
    datosEjemplo: "Usar los documentos públicos de una empresa ecuatoriana: política de devoluciones, catálogo de productos, preguntas frecuentes de un banco o aerolínea. Si no hay disponibles, crear un documento ficticio de 2 páginas con políticas de 'Andes Coffee'.",
    pasos: [
      "!pip install langchain langchain-openai chromadb pypdf",
      "Configurar API key: import os; os.environ['OPENAI_API_KEY'] = 'tu-key'",
      "Cargar documento: from langchain.document_loaders import PyPDFLoader; loader = PyPDFLoader('empresa.pdf')",
      "Dividir en chunks: from langchain.text_splitter import RecursiveCharacterTextSplitter",
      "Crear embeddings y guardar en ChromaDB: from langchain.vectorstores import Chroma",
      "Configurar el retriever: retriever = vectorstore.as_retriever(search_kwargs={'k': 3})",
      "Crear el chatbot con memoria: from langchain.memory import ConversationBufferMemory",
      "Configurar system prompt con el rol del asistente de la empresa",
      "Crear cadena RAG con ConversationalRetrievalChain",
      "Probar con 5 preguntas: 3 que pueden responder con el documento, 2 que no",
    ],
    resultado: "Chatbot funcional que responde preguntas sobre los documentos de la empresa con contexto recuperado y memoria de conversación. Demo con 5 preguntas documentado en notebook.",
    criterios: [
      { criterio: "Documentos cargados e indexados en ChromaDB correctamente", puntos: 25 },
      { criterio: "RAG funcional: retriever devuelve contexto relevante", puntos: 30 },
      { criterio: "Memoria conversacional implementada (recuerda turnos anteriores)", puntos: 25 },
      { criterio: "System prompt define claramente el rol y límites del chatbot", puntos: 20 },
    ],
  },
  recursos: [
    { titulo: "LangChain — Documentación oficial", url: "https://python.langchain.com/docs/get_started/introduction", tipo: "documentacion", descripcion: "Documentación completa de LangChain con tutoriales de RAG, memoria y agentes." },
    { titulo: "OpenAI API Reference", url: "https://platform.openai.com/docs/api-reference", tipo: "documentacion", descripcion: "Referencia de la API de OpenAI con ejemplos de chat completions y embeddings." },
    { titulo: "ChromaDB — Base de datos vectorial", url: "https://docs.trychroma.com/", tipo: "documentacion", descripcion: "Base de datos vectorial open source para almacenar embeddings en proyectos RAG." },
    { titulo: "WhatsApp Business API — Meta for Developers", url: "https://developers.facebook.com/docs/whatsapp/", tipo: "documentacion", descripcion: "Documentación oficial de Meta para integrar WhatsApp Business API en aplicaciones." },
  ],
};

const sesion7: SesionMes3 = {
  id: 7,
  titulo: "Traducción Automática y NLP Multilingüe",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "NLP Multilingüe con Transformers — Traducción y transferencia cross-lingual",
  videoDuracion: "44 min",
  teoria: `La traducción automática neuronal (NMT, Neural Machine Translation) ha alcanzado calidad cercana a la humana en pares de idiomas con muchos datos de entrenamiento, y sigue mejorando rápidamente. Para el profesional de IA en Ecuador, el dominio de herramientas de NMT abre oportunidades en sectores con necesidades multilingües: turismo (inglés, español, quechua/kichwa), comercio exterior (inglés, portugués, chino, árabe para exportaciones), educación internacional y empresas multinacionales con sede en Ecuador.

La arquitectura Transformer seq2seq es la base de todos los sistemas de traducción modernos. A diferencia de los enfoques anteriores basados en alineación de palabras o frases, los Transformers aprenden representaciones contextuales del texto fuente completo antes de generar la traducción token por token. El mecanismo de atención cruzada (cross-attention) en el decoder permite que cada token generado "mire" a todos los tokens del source, eligiendo los más relevantes en cada paso. Esto produce traducciones que respetan la estructura sintáctica del idioma objetivo mejor que los sistemas anteriores.

Los modelos de referencia son Helsinki-NLP/opus-mt (familia de modelos fine-tuned para cientos de pares de idiomas, disponibles en Hugging Face gratuitamente), NLLB-200 de Meta (200 idiomas en un solo modelo, incluyendo kichwa), mBART-50 (modelo multilingüe de Facebook/Meta para 50 idiomas) y M2M-100 (100 idiomas, traducción directa sin pasar por inglés como pivote). Para producción a gran escala con latencia baja, las APIs comerciales de DeepL (superior calidad para inglés-español-francés-alemán) y Google Translate Cloud son las opciones habituales.

El procesamiento multilingüe va más allá de la traducción. Los modelos multilingües como mBERT y XLM-RoBERTa permiten realizar tareas de NLP (clasificación, NER, análisis de sentimientos) entrenando en un idioma y aplicando en otro sin traducción previa. Esto se llama transferencia cross-lingual y es especialmente útil cuando hay pocos datos etiquetados en el idioma objetivo: se entrena el clasificador en inglés (donde hay muchos datos) y se aplica directamente al español ecuatoriano.

Para el kichwa (o quechua del Ecuador), la situación es de recursos escasos (low-resource language). No existen modelos de traducción de alta calidad para kichwa-español. El modelo NLLB-200 de Meta incluye soporte básico para variantes del quechua (qug para Chimborazo Highland Quechua), pero la calidad es limitada. Los esfuerzos académicos más relevantes son los del Grupo de PLN de la PUCE y proyectos de la SENESCYT para digitalización de textos en kichwa. Un profesional que contribuya a modelos de traducción kichwa-español tendría un impacto cultural y social único en Ecuador.

La evaluación de calidad de traducción usa la métrica BLEU (Bilingual Evaluation Understudy) como estándar histórico. BLEU compara n-grams de la traducción automática con traducciones de referencia humanas. Aunque ampliamente usado, BLEU tiene limitaciones: no captura la adecuación semántica, penaliza variaciones válidas de traducción, y no correlaciona perfectamente con la evaluación humana. Métricas más modernas como COMET y BERTScore usan embeddings para evaluación semántica y correlacionan mejor con juicios humanos.`,
  presentacionSlides: [
    { titulo: "Mes 3 — Sesión 7", contenido: "Traducción Automática y NLP Multilingüe\nDel par de idiomas al mundo multilingüe\nITSEIA Bootcamp Intensivo de IA" },
    { titulo: "Arquitectura NMT: Transformer seq2seq", contenido: "Encoder: comprende el texto fuente completo\nDecoder: genera la traducción token por token\nCross-attention: cada token generado mira al fuente\nResultado: respeta la sintaxis del idioma objetivo" },
    { titulo: "Modelos de referencia", contenido: "Helsinki-NLP/opus-mt: cientos de pares, gratuito (HuggingFace)\nNLLB-200 Meta: 200 idiomas, incluye kichwa\nmBART-50: 50 idiomas, Facebook/Meta\nDeepL API: calidad superior para ES-EN-FR-DE" },
    { titulo: "Transferencia cross-lingual", contenido: "mBERT / XLM-RoBERTa: modelos multilingües\nEntrena en inglés → aplica en español sin traducción\nÚtil cuando hay pocos datos en el idioma objetivo\nEvita el costo de etiquetar datos en cada idioma" },
    { titulo: "Kichwa: el desafío ecuatoriano", contenido: "Low-resource language: pocos datos digitales\nNLLB-200 incluye quechua básico (qug)\nOportunidad única: contribuir a modelos kichwa-español\nReferencia: Grupo PLN PUCE + SENESCYT" },
    { titulo: "Evaluación de calidad", contenido: "BLEU: n-grams coincidentes (estándar histórico)\nLimitaciones: no captura semántica, penaliza variaciones\nModernas: COMET, BERTScore (correlación humana superior)\nSiempre revisar con hablantes nativos en producción" },
  ],
  quiz: [
    { pregunta: "¿Cuál es el modelo de Meta que incluye soporte para 200 idiomas incluyendo variantes del quechua?", opciones: ["mBERT", "mBART-50", "NLLB-200", "XLM-RoBERTa"], respuesta: 2, explicacion: "NLLB-200 (No Language Left Behind) de Meta soporta 200 idiomas incluyendo variantes del quechua (qug para Chimborazo Highland Quechua)." },
    { pregunta: "¿Qué es la transferencia cross-lingual en NLP?", opciones: ["Traducir un texto antes de procesarlo", "Entrenar un modelo en un idioma y aplicarlo directamente en otro sin traducción", "Usar el mismo modelo para clasificación y traducción", "Mezclar datos de múltiples idiomas en el entrenamiento"], respuesta: 1, explicacion: "La transferencia cross-lingual permite usar modelos multilingües (mBERT, XLM-RoBERTa) entrenados en un idioma para tareas en otro, sin datos etiquetados en el idioma objetivo." },
    { pregunta: "¿Cuál es la limitación principal de la métrica BLEU para evaluar calidad de traducción?", opciones: ["Es demasiado lenta para calcular en producción", "No captura adecuación semántica y penaliza variaciones de traducción válidas", "Solo funciona para inglés", "Requiere licencia comercial"], respuesta: 1, explicacion: "BLEU compara n-grams superficialmente sin entender el significado, penalizando traducciones correctas que usan sinónimos o estructuras alternativas válidas." },
    { pregunta: "¿Por qué el kichwa es considerado un 'low-resource language' para NLP?", opciones: ["Porque tiene pocas palabras en su vocabulario", "Porque hay pocos datos digitales disponibles para entrenamiento de modelos", "Porque no es un idioma oficial en Ecuador", "Porque los modelos internacionales no pueden procesar caracteres del kichwa"], respuesta: 1, explicacion: "El kichwa tiene muy pocos textos digitalizados disponibles para entrenar modelos. La mayoría del corpus existe solo en forma oral o en documentos físicos no digitalizados." },
    { pregunta: "¿Qué métricas más modernas que BLEU correlacionan mejor con evaluaciones humanas de calidad de traducción?", opciones: ["Accuracy y F1-Score", "COMET y BERTScore", "ROUGE y METEOR", "MAE y RMSE"], respuesta: 1, explicacion: "COMET y BERTScore usan embeddings semánticos para evaluar la calidad, capturando similitud de significado más allá de coincidencias de n-grams." },
  ],
  ejercicio: {
    titulo: "Pipeline de traducción y análisis multilingüe",
    objetivo: "Construir un pipeline que: (1) traduzca comentarios de clientes del inglés al español, (2) aplique análisis de sentimientos, y (3) genere un reporte bilingüe con los hallazgos.",
    herramientas: "Python, transformers (Hugging Face), Helsinki-NLP opus-mt-en-es, pysentimiento, pandas, Google Colab",
    datosEjemplo: "50 reseñas en inglés de un producto o servicio ecuatoriano (buscar en TripAdvisor o Amazon para hoteles o productos de exportación ecuatorianos: café, cacao, flores).",
    pasos: [
      "!pip install transformers sentencepiece pysentimiento pandas",
      "Cargar modelo de traducción: from transformers import pipeline; translator = pipeline('translation_en_to_es', model='Helsinki-NLP/opus-mt-en-es')",
      "Traducir los 50 comentarios en inglés a español",
      "Cargar pysentimiento: analyzer = create_analyzer(task='sentiment', lang='es')",
      "Aplicar análisis de sentimientos a los comentarios traducidos",
      "Crear DataFrame con columnas: texto_original, texto_traducido, sentimiento, confianza",
      "Calcular estadísticas: % positivos, negativos, neutrales",
      "Identificar los 3 temas más mencionados en comentarios negativos (análisis manual)",
      "Generar reporte bilingüe: resumen en español e inglés de los hallazgos",
      "Opcional: probar con NLLB-200 y comparar calidad de traducción",
    ],
    resultado: "DataFrame con 50 comentarios traducidos y analizados + estadísticas de sentimiento + reporte bilingüe ejecutivo + comparación de calidad de traducción.",
    criterios: [
      { criterio: "Pipeline de traducción EN→ES funcional con 50 comentarios", puntos: 30 },
      { criterio: "Análisis de sentimientos aplicado sobre texto traducido", puntos: 25 },
      { criterio: "DataFrame completo con todas las columnas requeridas", puntos: 20 },
      { criterio: "Reporte bilingüe con insights y recomendaciones", puntos: 25 },
    ],
  },
  recursos: [
    { titulo: "Helsinki-NLP Models en Hugging Face", url: "https://huggingface.co/Helsinki-NLP", tipo: "herramienta", descripcion: "Familia de modelos de traducción para cientos de pares de idiomas, gratuitos." },
    { titulo: "NLLB-200 — Meta AI", url: "https://ai.meta.com/research/no-language-left-behind/", tipo: "lectura", descripcion: "Modelo de Meta para 200 idiomas incluyendo kichwa. Descargable desde Hugging Face." },
    { titulo: "DeepL API — Traducción profesional", url: "https://www.deepl.com/pro-api", tipo: "herramienta", descripcion: "API de traducción de alta calidad. Plan gratuito con 500,000 caracteres/mes." },
    { titulo: "COMET — Evaluación de traducción", url: "https://github.com/Unbabel/COMET", tipo: "documentacion", descripcion: "Métrica moderna de evaluación de calidad de traducción basada en embeddings." },
  ],
};

const sesion8: SesionMes3 = {
  id: 8,
  titulo: "NLP para el Español de Ecuador: Casos y Desafíos",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "NLP en español ecuatoriano — Modismos, datos y oportunidades",
  videoDuracion: "40 min",
  teoria: `El español hablado en Ecuador tiene características lingüísticas particulares que representan tanto un desafío técnico como una oportunidad de diferenciación para profesionales de NLP en el mercado local. Ignorar estas particularidades produce sistemas que fallan sistemáticamente en producción con usuarios reales, generando desconfianza y abandono de las herramientas de IA.

Las particularidades más importantes del español ecuatoriano para NLP son: el uso del tuteo formal en lugar del voseo (a diferencia de Argentina o Colombia), la influencia del quechua/kichwa en el vocabulario coloquial ("ñaño/ñaña" para hermano/a, "guagua" para niño/a, "achachay" para frío, "ararray" para quemado), los modismos propios del Ecuador ("de una" = de acuerdo/claro, "chévere" = genial, "frenón" = rápido, "dar duro" = ser muy bueno en algo, "maleta" = persona inútil), y la diferencia léxica significativa entre el español de Quito (más conservador, influenciado por la sierra) y el de Guayaquil (más informal, con influencias costeñas distintas).

El problema del sesgo regional en modelos entrenados en español general es documentable: los modelos entrenados principalmente en español peninsular o mexicano (las dos variedades más representadas en corpus digitales) producen errores sistemáticos con el español ecuatoriano. Esto incluye: no reconocer entidades con nombre típicamente ecuatorianas (Supermaxi, CNT, Banco Pacífico, SRI, Conafips), fallar en análisis de sentimientos con modismos locales, y producir transcripciones de voz erróneas con el acento serrano o costeño ecuatoriano.

El dataset disponible en español ecuatoriano es limitado pero creciente. Twitter/X tiene corpus significativos de usuarios ecuatorianos que pueden usarse para pre-entrenamiento de modelos de sentimientos. El diario El Comercio y El Universo tienen archivos históricos para modelos de lenguaje de dominio periodístico. Los fallos judiciales digitalizados del Consejo de la Judicatura son un corpus legal relevante. Para NER con entidades ecuatorianas, es necesario construir datasets propios con datos del SRI, SENESCYT y otras entidades públicas.

Una oportunidad de nicho con alta demanda y poca oferta en Ecuador es el desarrollo de sistemas de NLP para sectores regulados: análisis automático de contratos bajo la legislación ecuatoriana (LOSNCP para contratación pública, Código de Comercio, Código del Trabajo), extracción de información de declaraciones tributarias, y procesamiento de trámites del Registro Civil o la Superintendencia de Compañías. Estos sistemas requieren entender la terminología legal ecuatoriana específica, los formatos de formularios del Estado, y las referencias a artículos de leyes locales.

El flujo de trabajo para adaptar un modelo de NLP al español ecuatoriano sigue estos pasos: (1) identificar el dominio y tarea específica (ej. clasificación de quejas de telecomunicaciones en español ecuatoriano), (2) recopilar 1,000-5,000 ejemplos etiquetados del dominio (esto puede hacerse con un equipo de anotadores locales a un costo de $0.10-$0.50 por ejemplo), (3) fine-tunear un modelo base multilingüe (XLM-RoBERTa o BETO) sobre estos datos, (4) evaluar con métricas relevantes y un test set con hablantes nativos ecuatorianos, y (5) desplegar con monitoreo de drift para detectar cuando el modelo empieza a fallar con nuevas expresiones o temas emergentes.`,
  presentacionSlides: [
    { titulo: "Mes 3 — Sesión 8", contenido: "NLP para el Español de Ecuador\nDesafíos, datasets y oportunidades\nITSEIA Bootcamp Intensivo de IA" },
    { titulo: "Particularidades lingüísticas Ecuador", contenido: "Tuteo formal (no voseo)\nInfluencia kichwa: ñaño, guagua, achachay\nModismos: 'de una', 'chévere', 'dar duro'\nDiferencia Quito (serrano) vs Guayaquil (costeño)" },
    { titulo: "El problema del sesgo regional", contenido: "Modelos entrenados en español peninsular/mexicano:\n• No reconocen: Supermaxi, CNT, SRI, Conafips\n• Fallan con modismos locales en sentimientos\n• Errores de transcripción con acento ecuatoriano\nSolución: fine-tuning con datos locales" },
    { titulo: "Datasets disponibles en Ecuador", contenido: "Twitter/X: corpus de usuarios ecuatorianos\nEl Comercio / El Universo: archivo periodístico\nConsejo de la Judicatura: fallos judiciales\nSRI / SENESCYT: datos estructurados\n⚠️ Todos requieren limpieza y etiquetado" },
    { titulo: "Nicho de alta demanda: NLP legal-público", contenido: "Análisis de contratos (LOSNCP, Código Trabajo)\nExtracción de declaraciones tributarias\nProcesamiento de trámites Registro Civil\nTerminología legal ecuatoriana específica\nPoca oferta local = alta oportunidad" },
    { titulo: "Flujo de adaptación al español EC", contenido: "1. Definir dominio y tarea específica\n2. Recopilar 1,000-5,000 ejemplos etiquetados\n3. Fine-tune XLM-RoBERTa o BETO\n4. Evaluar con test set nativo ecuatoriano\n5. Deploy + monitoreo de drift" },
  ],
  quiz: [
    { pregunta: "¿Cuál de las siguientes NO es una particularidad del español ecuatoriano relevante para NLP?", opciones: ["Uso del tuteo formal en lugar del voseo", "Influencia del kichwa en el vocabulario coloquial", "El uso del voseo como forma estándar de tratamiento", "Diferencia léxica entre español serrano y costeño"], respuesta: 2, explicacion: "Ecuador usa el tuteo formal, NO el voseo (que es característico de Argentina, Uruguay y partes de Colombia). El voseo sería incorrecto para modelos del español ecuatoriano." },
    { pregunta: "¿Por qué los modelos de NLP entrenados en español peninsular o mexicano fallan con texto ecuatoriano?", opciones: ["El español de Ecuador usa un alfabeto diferente", "Las variedades de español de España y México tienen más corpus disponible, por lo que los modelos sobreajustan a esas variedades ignorando modismos y entidades ecuatorianas", "Los modelos no pueden procesar más de un dialecto del mismo idioma", "Es un problema solo de análisis de voz, no de texto"], respuesta: 1, explicacion: "Los corpus digitales de español están dominados por español peninsular y mexicano. Los modelos entrenados en estos datos no reconocen modismos ni entidades ecuatorianas específicas." },
    { pregunta: "¿Cuál es el costo aproximado por ejemplo para etiquetar datos de NLP con anotadores humanos locales?", opciones: ["$0.001-$0.005 por ejemplo", "$0.10-$0.50 por ejemplo", "$5-$10 por ejemplo", "$50-$100 por ejemplo"], respuesta: 1, explicacion: "El etiquetado humano para NLP en Ecuador cuesta aproximadamente $0.10-$0.50 por ejemplo, dependiendo de la complejidad. Para 1,000 ejemplos, el costo es manejable ($100-$500)." },
    { pregunta: "¿Qué modelo base multilingüe se recomienda como punto de partida para fine-tuning en español ecuatoriano?", opciones: ["GPT-4 (requiere acceso a OpenAI)", "XLM-RoBERTa o BETO", "ResNet50 (modelo de imágenes)", "YOLO (modelo de detección de objetos)"], respuesta: 1, explicacion: "XLM-RoBERTa y BETO son modelos BERT pre-entrenados en múltiples idiomas/español, ideales para fine-tuning en tareas de NLP en español ecuatoriano." },
    { pregunta: "¿Cuál de estos sectores representa una oportunidad de nicho con alta demanda y poca oferta local de NLP en Ecuador?", opciones: ["Traducción del español al inglés general", "NLP para análisis de contratos y documentos legales bajo legislación ecuatoriana", "Reconocimiento de voz para inglés americano", "Generación de imágenes de moda"], respuesta: 1, explicacion: "El NLP legal en español ecuatoriano (LOSNCP, Código Comercio, tributación) tiene alta demanda en el sector público y privado pero muy poca oferta de soluciones especializadas locales." },
  ],
  ejercicio: {
    titulo: "Clasificador de quejas en español ecuatoriano",
    objetivo: "Construir y evaluar un clasificador de texto que categorice quejas de clientes en español ecuatoriano por departamento responsable (facturación, soporte técnico, atención al cliente, logística).",
    herramientas: "Python, transformers (Hugging Face), BETO o XLM-RoBERTa, datasets, Google Colab",
    datosEjemplo: "Crear manualmente 80 ejemplos de quejas en español ecuatoriano para las 4 categorías (20 por categoría), incluyendo modismos locales. Ejemplos: 'Chévere el producto pero me llegó roto de ley' (logística), 'El técnico no vino y ya pagué de una' (soporte), 'Me cobran de más en la factura y nadie da solución' (facturación).",
    pasos: [
      "!pip install transformers datasets scikit-learn",
      "Crear el dataset de 80 ejemplos con etiquetas de categoría",
      "Dividir en train (64) y test (16)",
      "Cargar tokenizer: from transformers import AutoTokenizer; tokenizer = AutoTokenizer.from_pretrained('dccuchile/bert-base-spanish-wwm-cased')",
      "Tokenizar el dataset",
      "Cargar modelo base: AutoModelForSequenceClassification con 4 labels",
      "Configurar Trainer de Hugging Face con métricas de accuracy y F1",
      "Entrenar por 5 épocas",
      "Evaluar en test set: imprimir accuracy, F1 por clase, matriz de confusión",
      "Probar con 5 quejas nuevas inventadas con modismos ecuatorianos",
    ],
    resultado: "Clasificador de quejas entrenado con datos en español ecuatoriano. Reporte con accuracy, F1 por categoría y análisis de errores del modelo.",
    criterios: [
      { criterio: "Dataset de 80 ejemplos con modismos ecuatorianos auténticos", puntos: 20 },
      { criterio: "Modelo BETO o XLM-RoBERTa fine-tuneado correctamente", puntos: 30 },
      { criterio: "Métricas evaluadas: accuracy, F1, matriz de confusión", puntos: 25 },
      { criterio: "Prueba con nuevos ejemplos con modismos locales documentada", puntos: 25 },
    ],
  },
  recursos: [
    { titulo: "BETO — BERT en español (DCCUCHILE)", url: "https://huggingface.co/dccuchile/bert-base-spanish-wwm-cased", tipo: "herramienta", descripcion: "Modelo BERT pre-entrenado en español por la Universidad de Chile. Base ideal para fine-tuning." },
    { titulo: "XLM-RoBERTa en Hugging Face", url: "https://huggingface.co/xlm-roberta-base", tipo: "herramienta", descripcion: "Modelo multilingüe de Meta preentrenado en 100 idiomas, excelente para transferencia cross-lingual." },
    { titulo: "Hugging Face Trainer — Tutorial", url: "https://huggingface.co/docs/transformers/training", tipo: "documentacion", descripcion: "Guía oficial para fine-tuning de modelos con la API Trainer de Hugging Face." },
    { titulo: "Datasets — Hugging Face", url: "https://huggingface.co/docs/datasets/", tipo: "documentacion", descripcion: "Biblioteca de Hugging Face para cargar, procesar y compartir datasets de NLP." },
  ],
};

// ─── Sesiones 9-16 (módulos MLOps y Proyecto Final) ─────────────────────────
// Se completan en la segunda parte del archivo.

export const BOOTCAMP_MES3_SESIONES: SesionMes3[] = [
  sesion1,
  sesion2,
  sesion3,
  sesion4,
  sesion5,
  sesion6,
  sesion7,
  sesion8,
];

export default BOOTCAMP_MES3_SESIONES;
