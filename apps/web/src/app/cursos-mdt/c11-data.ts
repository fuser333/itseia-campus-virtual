// ─── C11: Visión Computacional Aplicada — Datos de 20 temas ──────────────────
// Curso C11 del programa MDT. 20 temas.
// Módulo 1: Conceptos de visión por computadora
// Módulo 2: OpenCV y procesamiento básico
// Módulo 3: Detección de objetos con YOLO
// Módulo 4: Casos prácticos en Ecuador (agricultura, retail, seguridad)

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

export interface TemaC11 {
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

export const C11_MODULOS = [
  { num: 1, nombre: "Conceptos de Visión por Computadora", horas: 15, temas: 5 },
  { num: 2, nombre: "OpenCV y Procesamiento Básico", horas: 15, temas: 5 },
  { num: 3, nombre: "Detección de Objetos con YOLO", horas: 15, temas: 5 },
  { num: 4, nombre: "Casos Prácticos Ecuador", horas: 15, temas: 5 },
];

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC11 => ({
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

// ─── MÓDULO 1: Conceptos de Visión por Computadora ──────────────────────────

const MOD1 = "Conceptos de Visión por Computadora";

const tema1: TemaC11 = {
  id: 1,
  titulo: "¿Qué es la visión por computadora? Historia y fundamentos",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Visión por computadora desde cero — Fundamentos en español",
  videoDuracion: "~40 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "¿Qué es la Visión por Computadora? Historia y Fundamentos\nC11. Visión Computacional Aplicada — Tema 1\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido:
        "Al finalizar esta sesión serás capaz de:\n• Definir qué es la visión por computadora y cómo difiere de la visión humana\n• Identificar los hitos históricos clave del campo\n• Clasificar las tareas principales: clasificación, detección, segmentación\n• Reconocer aplicaciones de visión computacional en Ecuador",
    },
    {
      titulo: "La visión humana vs la visión computacional",
      contenido:
        "Visión humana: instantánea, contextual, enriquecida con experiencia y emoción\n• 'Veo un perro' — reconoce especie, postura, amenaza, emoción\n• Tarda 0.1 segundos en procesar una escena compleja\n\nVisión computacional: matemática, estadística, requiere entrenamiento\n• Ve una matriz de números (píxeles 0-255)\n• Para 'ver' un perro: necesita miles de ejemplos etiquetados\n\nVentaja de la máquina: velocidad, escala, consistencia, disponibilidad 24/7",
    },
    {
      titulo: "Las tareas principales de visión computacional",
      contenido:
        "CLASIFICACIÓN: ¿Qué hay en esta imagen? → 'Esto es un perro' (1 etiqueta)\nDETECCIÓN: ¿Dónde está y qué es? → bounding box + etiqueta\nSEGMENTACIÓN: ¿Exactamente qué píxeles son del objeto? → máscara pixel por pixel\nESIMACIÓN DE POSE: ¿Cómo está el cuerpo posicionado? → puntos clave articulaciones\nRECONOCIMIENTO FACIAL: ¿Quién es esta persona? → identidad\nOCR: ¿Qué texto hay en la imagen? → extracción de texto",
    },
    {
      titulo: "Historia — los hitos que importan",
      contenido:
        "1966: MIT Summer Vision Project — primer intento de hacer que computadoras 'vean'\n1980s: detectores de bordes (Canny, Sobel), visión clásica con features manuales\n2001: Haar Cascades (Viola-Jones) — primer detector de rostros en tiempo real\n2012: AlexNet gana ImageNet — el deep learning revoluciona la visión computacional\n2016: YOLO v1 — detección de objetos en tiempo real (30 fps)\n2020s: SAM (Segment Anything), Grounding DINO, modelos fundacionales de visión",
    },
    {
      titulo: "Cómo ve una imagen un computador",
      contenido:
        "Imagen digital = matriz de números\n• Imagen 1024x768 en escala de grises: 786,432 números (0=negro, 255=blanco)\n• Imagen RGB: 3 matrices (Red, Green, Blue) = 2,359,296 números\n• Imagen de 1 megapíxel RGB: ~3 millones de valores numéricos\n\nRed neuronal convolucional (CNN):\n• Aplica filtros que detectan bordes, texturas, formas\n• Capas progresivas: bordes → formas simples → partes → objetos completos\n• El aprendizaje es encontrar los mejores valores de filtro",
    },
    {
      titulo: "Datasets clave para aprender visión computacional",
      contenido:
        "ImageNet: 14 millones de imágenes, 1,000 categorías — el benchmark histórico\nCOCO (Common Objects in Context): 330,000 imágenes con detección + segmentación\nCIFAR-10: 60,000 imágenes pequeñas, 10 categorías — ideal para aprender\nOpen Images (Google): 9 millones de imágenes anotadas\nRoboflow Universe: datasets especializados para industria (incluye algunos de Ecuador)\n\nRegla: buen dataset = 70% del éxito del modelo.",
    },
    {
      titulo: "Aplicaciones de visión computacional en Ecuador",
      contenido:
        "Agricultura: drones con visión IA detectan plagas en cultivos de flores y banano (Quito, Los Ríos)\nSalud: ImagemIA (empresa ecuatoriana) — IA en imagenología médica radiografías y tomografías\nRetail: cámaras con IA detectan cuáles áreas de la tienda tienen más tráfico\nBanca: reconocimiento facial en cajeros automáticos Pichincha y Produbanco\nTransporte: detección de placas para control de tránsito en Quito (AMT)\nSeguros: análisis de fotos de accidentes para estimación automática de daños",
    },
    {
      titulo: "¿Por qué aprender visión computacional en 2026?",
      contenido:
        "Mercado de visión artificial: $48 mil millones en 2023, creciendo al 19% anual\nEcuador: demanda alta, oferta baja de profesionales\nSalarios: $2,000-$5,000/mes para especialistas en visión IA en Ecuador (empresas internacionales)\nHerramientas accesibles: OpenCV gratis, YOLO gratis, Google Colab gratis\n\nEl profesional que sabe integrar visión computacional en sistemas reales tiene ventaja competitiva enorme — no hay muchos en el mercado ecuatoriano.",
    },
    {
      titulo: "Resumen del Tema 1",
      contenido:
        "1. Visión computacional: hacer que máquinas interpreten imágenes y video\n2. Tareas clave: clasificación, detección, segmentación, OCR, reconocimiento facial\n3. 2012 (AlexNet) y 2016 (YOLO) fueron los hitos que lo cambiaron todo\n4. Una imagen es una matriz de números — las CNNs aprenden a interpretar esas matrices\n5. Ecuador tiene aplicaciones reales en agricultura, salud, retail y seguridad\n\nPróximo: Redes neuronales convolucionales (CNN) — cómo aprenden a ver",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál fue el hito de 2012 que revolucionó la visión por computadora con deep learning?",
      opciones: [
        "El lanzamiento de OpenCV 4.0",
        "AlexNet ganó la competencia ImageNet con una ventaja aplastante",
        "Google lanzó TensorFlow",
        "Los primeros drones con cámara comerciales",
      ],
      respuesta: 1,
      explicacion:
        "AlexNet, de Alex Krizhevsky y Geoffrey Hinton, ganó la competencia ImageNet en 2012 con un error del 15.3% vs el 26% del segundo lugar. Demostró que las CNN profundas con GPU superaban todos los métodos anteriores y marcó el inicio de la era del deep learning en visión.",
    },
    {
      pregunta: "¿Cuál es la diferencia entre detección de objetos y segmentación semántica?",
      opciones: [
        "Son lo mismo con diferente nombre",
        "La detección identifica qué hay y dibuja un bounding box; la segmentación identifica exactamente qué píxeles pertenecen a cada objeto",
        "La detección usa Python y la segmentación usa R",
        "La segmentación solo funciona con imágenes médicas",
      ],
      respuesta: 1,
      explicacion:
        "La detección de objetos produce un bounding box (rectángulo) alrededor del objeto y su etiqueta. La segmentación produce una máscara pixel por pixel, identificando exactamente el contorno del objeto — mucho más precisa pero computacionalmente más costosa.",
    },
    {
      pregunta: "¿Qué representa un píxel en una imagen en escala de grises para un computador?",
      opciones: [
        "Una coordenada geográfica",
        "Un número entre 0 (negro) y 255 (blanco)",
        "Una letra del alfabeto ASCII",
        "Un vector de 3 dimensiones",
      ],
      respuesta: 1,
      explicacion:
        "En escala de grises, cada píxel es un número entre 0 (negro absoluto) y 255 (blanco absoluto). Una imagen RGB tiene tres matrices (R, G, B) donde cada canal va de 0 a 255, dando 256³ ≈ 16.7 millones de colores posibles.",
    },
    {
      pregunta: "¿Qué empresa ecuatoriana aplica visión computacional en imagenología médica?",
      opciones: [
        "Banco Pichincha",
        "CNT Ecuador",
        "ImagemIA",
        "SENESCYT",
      ],
      respuesta: 2,
      explicacion:
        "ImagemIA es una empresa ecuatoriana fundada por el mismo equipo detrás de ITSEIA que desarrolla IA predictiva para imagenología médica, incluyendo análisis de radiografías y tomografías con redes neuronales convolucionales.",
    },
    {
      pregunta: "¿Cuál es el dataset más utilizado como benchmark histórico en visión por computadora con 14 millones de imágenes?",
      opciones: ["CIFAR-10", "COCO", "ImageNet", "Open Images"],
      respuesta: 2,
      explicacion:
        "ImageNet tiene más de 14 millones de imágenes etiquetadas en más de 20,000 categorías. La competencia anual ImageNet Large Scale Visual Recognition Challenge (ILSVRC) fue el benchmark que impulsó los avances en visión computacional desde 2010.",
    },
  ],
  ejercicio: {
    titulo: "Exploración de modelos pre-entrenados de visión computacional",
    objetivo:
      "Experimentar con modelos de visión computacional pre-entrenados usando Google Colab para entender clasificación, detección y OCR sin necesidad de entrenar desde cero",
    herramientas: "Google Colab + Python + TensorFlow/Keras + OpenCV + pytesseract",
    datosEjemplo:
      "Imágenes para probar:\n1. Foto de una rosa ecuatoriana (buscar en Google Images 'rose farm Ecuador')\n2. Foto de un mercado de Quito (buscar 'mercado central Quito')\n3. Foto de un cartel o señal de tráfico en Ecuador\n4. Foto de un producto con etiqueta (cualquier producto de supermercado ecuatoriano)",
    pasos: [
      "Abrir Google Colab y crear notebook 'Vision_Computacional_Exploracion'",
      "Instalar dependencias: !pip install tensorflow opencv-python-headless pytesseract Pillow",
      "En ChatGPT, pedir: 'Dame código Python para Google Colab que: 1) cargue el modelo MobileNetV2 pre-entrenado en ImageNet, 2) clasifique una imagen descargada de una URL, 3) muestre las top-5 predicciones con sus porcentajes de confianza'",
      "Ejecutar el código con las 4 imágenes de ejemplo. Documentar qué predice el modelo para cada imagen y el nivel de confianza.",
      "Segundo experimento — detección con YOLOv8: en ChatGPT pedir: 'Dame código Python para Google Colab que use ultralytics YOLO (pip install ultralytics) para detectar objetos en una imagen de un mercado ecuatoriano. Mostrar la imagen con bounding boxes dibujados'",
      "Tercer experimento — OCR con pytesseract: en ChatGPT pedir código para extraer el texto de la imagen del cartel ecuatoriano usando pytesseract",
      "Documentar los resultados en el notebook: ¿qué acertó? ¿qué falló? ¿Por qué crees que el modelo identificó mal algunos elementos del contexto ecuatoriano? ¿Qué datos de entrenamiento necesitaría para mejorar?",
      "Reflexión final (200 palabras en el notebook): ¿cómo aplicarías uno de estos tres modelos en un negocio ecuatoriano real? ¿Cuál sería el caso de uso y qué datos necesitarías?",
    ],
    resultado:
      "Notebook con tres experimentos funcionales (clasificación con MobileNetV2, detección con YOLO, OCR con pytesseract) aplicados a imágenes del contexto ecuatoriano, con análisis de aciertos, errores y reflexión sobre aplicaciones reales.",
    criterios: [
      { criterio: "Los tres experimentos ejecutan correctamente sin errores", puntos: 30 },
      { criterio: "Documentación de predicciones con niveles de confianza para las 4 imágenes", puntos: 20 },
      { criterio: "Análisis crítico de aciertos y errores en contexto ecuatoriano", puntos: 20 },
      { criterio: "Reflexión sobre aplicación real en negocio ecuatoriano con caso de uso concreto", puntos: 20 },
      { criterio: "Organización y claridad del notebook (comentarios, markdown)", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "OpenCV — Librería oficial de visión por computadora",
      url: "https://opencv.org/",
      tipo: "documentacion",
      descripcion: "La librería open source más utilizada para visión computacional. Documentación completa, tutoriales y ejemplos en Python.",
    },
    {
      titulo: "CS231n — Stanford: CNNs for Visual Recognition",
      url: "http://cs231n.stanford.edu/",
      tipo: "documentacion",
      descripcion: "El curso de Stanford sobre redes neuronales convolucionales. Material gratuito de clase mundial para entender la teoría detrás de la visión computacional.",
    },
    {
      titulo: "Roboflow Universe — Datasets de visión",
      url: "https://universe.roboflow.com/",
      tipo: "herramienta",
      descripcion: "Plataforma con más de 200,000 datasets de visión computacional listos para usar, incluyendo algunos de contexto latinoamericano. Herramientas de anotación incluidas.",
    },
    {
      titulo: "Google Colab — Entorno gratuito con GPU",
      url: "https://colab.research.google.com",
      tipo: "herramienta",
      descripcion: "Jupyter notebooks gratuitos con acceso a GPU T4. Perfecto para entrenar y probar modelos de visión computacional sin instalación local.",
    },
  ],
  teoria: `La visión por computadora (Computer Vision o CV) es la disciplina de la inteligencia artificial que busca dotar a las máquinas de la capacidad de interpretar y entender el contenido visual: imágenes estáticas, videos en tiempo real, transmisiones de cámaras de seguridad, fotografías aéreas de drones o imágenes médicas de resonancias magnéticas. Es una de las áreas de la IA con mayor impacto económico y social, y una de las de mayor crecimiento en aplicaciones industriales.

Para entender por qué la visión computacional es diferente a simplemente "guardar una imagen en un computador", hay que comprender cómo la máquina representa lo que ve. Una imagen digital es fundamentalmente una matriz de números: cada píxel es un valor entre 0 y 255. Una imagen en escala de grises de 1,024×768 píxeles es una matriz con 786,432 números. Una imagen a color RGB tiene tres matrices de ese tamaño (una para el canal Rojo, una para el Verde y una para el Azul), totalizando casi 2.4 millones de valores numéricos. El computador no "ve" un paisaje — procesa una tabla gigante de números.

Las tareas de visión computacional se organizan en niveles crecientes de complejidad y precisión. La clasificación de imágenes responde la pregunta más simple: "¿qué hay en esta imagen?" y devuelve una etiqueta (gato, perro, árbol, placa de auto). La detección de objetos va más lejos: "¿qué hay y dónde está?" produciendo un bounding box (rectángulo) alrededor de cada objeto junto con su etiqueta y nivel de confianza. La segmentación semántica es aún más precisa: identifica exactamente qué píxeles pertenecen a cada clase de objeto, produciendo una máscara pixel por pixel. La segmentación de instancias distingue además entre objetos individuales de la misma clase.

La historia moderna de la visión computacional tiene un antes y un después clarísimo: 2012. Antes de ese año, los métodos dominantes usaban features diseñadas manualmente por expertos: detectores de bordes como Canny y Sobel, descriptores como HOG (Histogram of Oriented Gradients) y SIFT, y clasificadores como SVM. Estos métodos funcionaban, pero eran frágiles ante variaciones de iluminación, pose y escala.

En 2012, AlexNet, una red neuronal convolucional profunda diseñada por Alex Krizhevsky bajo la supervisión de Geoffrey Hinton, ganó la competencia ImageNet con un error de clasificación del 15.3% cuando el segundo lugar tenía 26%. La diferencia era abismal. Esta arquitectura, entrenada sobre dos GPU GTX 580 durante varios días, demostró que el deep learning con suficientes datos y poder computacional superaba todos los métodos tradicionales. Ese momento cambió todo el campo.

En el contexto ecuatoriano, las aplicaciones de visión computacional están en fase de adopción temprana pero acelerada. El sector agrícola tiene un potencial enorme: Ecuador es el mayor exportador mundial de banano y uno de los principales de flores, y las pérdidas por plagas no detectadas a tiempo pueden ser devastadoras. Los sistemas de drones con cámaras multiespectrales y modelos de detección de enfermedades pueden identificar focos de plaga con días de anticipación, permitiendo intervenciones quirúrgicas en lugar de fumigaciones masivas. Empresas como AGROSIG están comenzando a implementar estas tecnologías en haciendas de la Costa y la Sierra ecuatorianas.

El sistema financiero ecuatoriano también adopta visión computacional. El Banco Pichincha y Produbanco han implementado reconocimiento facial en aplicaciones móviles y cajeros automáticos como segunda capa de seguridad. La Agencia Metropolitana de Tránsito (AMT) de Quito usa cámaras con OCR para lectura automática de placas vehiculares y detección de infracciones. Y el sector de seguros está comenzando a usar análisis de imágenes de accidentes para estimación automática de daños, reduciendo el tiempo de procesamiento de reclamaciones de días a horas.

La curva de aprendizaje de la visión computacional se ha democratizado enormemente. OpenCV (la librería open source más usada del campo) es gratuita y tiene miles de tutoriales en español. Los modelos pre-entrenados en ImageNet y COCO están disponibles sin costo en TensorFlow Hub y PyTorch Hub. Google Colab ofrece acceso gratuito a GPU para entrenamiento. Y frameworks como YOLO en su versión de Ultralytics tienen una API tan simple que un principiante puede ejecutar su primer detector de objetos en menos de 10 líneas de código.`,
};

const tema2: TemaC11 = placeholder(2, "Redes neuronales convolucionales (CNN) — cómo aprenden a ver", MOD1, 1);
const tema3: TemaC11 = placeholder(3, "Clasificación de imágenes con modelos pre-entrenados", MOD1, 1);
const tema4: TemaC11 = placeholder(4, "Transfer learning — reutilizar modelos entrenados", MOD1, 1);
const tema5: TemaC11 = placeholder(5, "Anotación de datos de imágenes con Roboflow", MOD1, 1);

// ─── MÓDULO 2: OpenCV y Procesamiento Básico ─────────────────────────────────

const MOD2 = "OpenCV y Procesamiento Básico";

const tema6: TemaC11 = {
  id: 6,
  titulo: "OpenCV desde cero — instalación y primeras operaciones",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "OpenCV Python — Curso completo en español desde cero",
  videoDuracion: "~50 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "OpenCV desde Cero — Instalación y Primeras Operaciones\nC11. Visión Computacional Aplicada — Tema 6\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué es OpenCV?",
      contenido:
        "Open Source Computer Vision Library\n• Creada por Intel en 1999, ahora mantenida por la comunidad open source\n• Más de 2,500 algoritmos optimizados para visión computacional\n• Disponible en Python, C++, Java, MATLAB\n• 47,000+ estrellas en GitHub, +18 millones de descargas\n• Usada por: Google, Microsoft, Intel, Alibaba, Boeing\n• Gratis, sin licencia comercial",
    },
    {
      titulo: "Instalación y configuración",
      contenido:
        "Opción 1 — Google Colab (recomendada para aprender):\n!pip install opencv-python-headless\nimport cv2\nprint(cv2.__version__)  # → 4.x.x\n\nOpción 2 — Local con conda:\nconda install -c conda-forge opencv\n\nOpción 3 — pip local:\npip install opencv-python\n\nImagen de prueba: cv2.imread('imagen.jpg')\nMostrar: cv2.imshow('nombre', img) [solo local]",
    },
    {
      titulo: "Operaciones básicas con imágenes",
      contenido:
        "Leer imagen: img = cv2.imread('foto.jpg')\nDimensiones: img.shape → (altura, ancho, canales) ej: (480, 640, 3)\nCanales BGR: OpenCV usa Blue-Green-Red, NO RGB\nConvertir a escala de grises: gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)\nRedimensionar: resized = cv2.resize(img, (320, 240))\nGuardar: cv2.imwrite('resultado.jpg', img)\n\nAtención: cv2.imread devuelve None si el archivo no existe — siempre verificar.",
    },
    {
      titulo: "Operaciones de procesamiento frecuentes",
      contenido:
        "Desenfoque (noise reduction): blur = cv2.GaussianBlur(img, (5,5), 0)\nDetección de bordes: edges = cv2.Canny(img, 100, 200)\nUmbralización: _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)\nDilatación y erosión: cv2.dilate(img, kernel) / cv2.erode(img, kernel)\nRecortar región: roi = img[y1:y2, x1:x2]\n\nCasos de uso Ecuador: preprocesar fotos de documentos del SRI, limpiar imágenes de cámaras de seguridad con poca luz.",
    },
    {
      titulo: "Dibujar sobre imágenes",
      contenido:
        "Rectángulo: cv2.rectangle(img, (x1,y1), (x2,y2), (0,255,0), 2)\nCirculo: cv2.circle(img, (cx,cy), radio, (255,0,0), -1)\nTexto: cv2.putText(img, 'Hola', (x,y), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)\nLínea: cv2.line(img, (x1,y1), (x2,y2), color, grosor)\n\nAplicación: dibujar bounding boxes sobre resultados de detección de objetos — fundamental para visualizar resultados de modelos IA.",
    },
    {
      titulo: "Trabajar con video y cámara",
      contenido:
        "Capturar desde cámara web: cap = cv2.VideoCapture(0)\nCapturar desde archivo: cap = cv2.VideoCapture('video.mp4')\nLoop de captura:\nret, frame = cap.read()\nif not ret: break\ncv2.imshow('frame', frame)\nif cv2.waitKey(1) == ord('q'): break\n\ncap.release()\ncv2.destroyAllWindows()\n\nEn Google Colab: usar JavaScript para acceder a la cámara del navegador.",
    },
    {
      titulo: "Transformaciones geométricas",
      contenido:
        "Rotación: M = cv2.getRotationMatrix2D(center, angulo, escala); cv2.warpAffine(img, M, size)\nFlip: cv2.flip(img, 1) — horizontal; flip(img, 0) — vertical\nPerspectiva: cv2.getPerspectiveTransform() — corregir fotos tomadas en ángulo\n\nCaso de uso Ecuador: corregir perspectiva de fotografías de documentos de identidad (cédulas) tomadas en ángulo para OCR más preciso en sistemas bancarios o del SRI.",
    },
    {
      titulo: "Histograma y análisis de color",
      contenido:
        "Histograma: distribución de intensidades de píxeles\ncv2.calcHist([img], [0], None, [256], [0,256])\n\nAplicación práctica:\n• Detectar sobreexposición en fotos de flores para exportación\n• Normalizar condiciones de luz en imágenes de calidad agrícola\n• Ecualizar histograma para mejorar contraste: cv2.equalizeHist(gray)\n\nEspacio HSV: mejor para detección de colores específicos que RGB/BGR.",
    },
    {
      titulo: "Resumen del Tema 6",
      contenido:
        "1. OpenCV: la librería estándar de visión computacional, gratuita y poderosa\n2. Imágenes son arrays numpy — OpenCV usa formato BGR (no RGB)\n3. Operaciones fundamentales: leer, convertir color, redimensionar, desenfoque, bordes\n4. Dibujar bounding boxes y texto es fundamental para visualizar detecciones\n5. Transformaciones geométricas: corrección de perspectiva esencial para OCR\n\nPróximo: Detección de formas y contornos con OpenCV",
    },
  ],
  quiz: [
    {
      pregunta: "¿En qué formato de color trabaja OpenCV por defecto (diferente a lo que la mayoría esperaría)?",
      opciones: ["RGB (Red, Green, Blue)", "BGR (Blue, Green, Red)", "HSV (Hue, Saturation, Value)", "CMYK"],
      respuesta: 1,
      explicacion:
        "OpenCV usa el formato BGR (Blue, Green, Red) en lugar del RGB estándar. Esto es una fuente común de errores: mostrar una imagen con matplotlib.pyplot.imshow() directamente desde OpenCV resulta en colores incorrectos hasta convertir con cv2.cvtColor(img, cv2.COLOR_BGR2RGB).",
    },
    {
      pregunta: "¿Qué función de OpenCV detecta bordes en una imagen?",
      opciones: ["cv2.GaussianBlur()", "cv2.threshold()", "cv2.Canny()", "cv2.dilate()"],
      respuesta: 2,
      explicacion:
        "cv2.Canny() implementa el algoritmo de detección de bordes de Canny (1986), que usa gradientes de intensidad para encontrar bordes. Requiere dos umbrales que controlan la sensibilidad.",
    },
    {
      pregunta: "¿Cuál es la ventaja principal de usar el espacio de color HSV sobre BGR para detección de colores?",
      opciones: [
        "HSV procesa más rápido",
        "En HSV el color (Hue) está separado del brillo y la saturación, facilitando detectar un color específico bajo diferentes condiciones de luz",
        "HSV usa menos memoria",
        "OpenCV solo puede hacer detección de color en HSV",
      ],
      respuesta: 1,
      explicacion:
        "En el espacio HSV, el canal Hue (tono) representa el color puro independientemente de la iluminación. Esto hace mucho más fácil detectar 'todos los objetos verdes' definiendo un rango de Hue, independientemente de si la imagen es más oscura o más clara.",
    },
    {
      pregunta: "¿Para qué se usa cv2.getPerspectiveTransform() en aplicaciones de procesamiento de documentos?",
      opciones: [
        "Para comprimir el tamaño del archivo de imagen",
        "Para corregir la perspectiva de documentos fotografiados en ángulo, facilitando el OCR",
        "Para aumentar la resolución de imágenes borrosas",
        "Para cambiar el formato de color",
      ],
      respuesta: 1,
      explicacion:
        "La corrección de perspectiva transforma una imagen tomada en ángulo (donde el documento aparece trapezoidal) a una vista frontal perfecta (rectangular). Esto mejora dramáticamente la precisión del OCR en sistemas que procesan cédulas, facturas o documentos del SRI.",
    },
    {
      pregunta: "¿Qué retorna img.shape para una imagen RGB de 640x480 píxeles?",
      opciones: ["(640, 480)", "(480, 640)", "(480, 640, 3)", "(640, 480, 3)"],
      respuesta: 2,
      explicacion:
        "shape retorna (alto, ancho, canales). Una imagen de 640 píxeles de ancho por 480 de alto con 3 canales de color retorna (480, 640, 3). La convención en NumPy/OpenCV es siempre (filas, columnas) = (alto, ancho).",
    },
  ],
  ejercicio: {
    titulo: "Pipeline de procesamiento de imágenes de productos agrícolas ecuatorianos",
    objetivo:
      "Construir un pipeline básico de procesamiento de imágenes con OpenCV para analizar imágenes de rosas ecuatorianas, aplicando operaciones de preprocesamiento, detección de bordes y análisis de color",
    herramientas: "Google Colab + Python + OpenCV + NumPy + Matplotlib",
    datosEjemplo:
      "Usar imágenes de rosas ecuatorianas disponibles en:\n• Unsplash (buscar 'ecuador roses farm')\n• Pixabay (buscar 'roses flower')\nO cualquier imagen de flor descargada de internet para el ejercicio",
    pasos: [
      "Crear notebook 'OpenCV_Rosas_Ecuador' en Google Colab",
      "Instalar OpenCV: !pip install opencv-python-headless",
      "Descargar imagen de rosa: !wget -O rosa.jpg 'URL_IMAGEN' (buscar imagen en Unsplash o usar URL directa)",
      "Ejecutar pipeline de procesamiento completo (pedir código a ChatGPT: 'Dame código Python completo con OpenCV para procesar una imagen de rosa ecuatoriana. Debe: 1) leer la imagen, 2) mostrar dimensiones y estadísticas básicas, 3) convertir a escala de grises, 4) aplicar GaussianBlur con kernel 5x5, 5) detectar bordes con Canny (umbrales 50 y 150), 6) mostrar las 4 versiones de la imagen en una grilla 2x2 con matplotlib, 7) calcular el histograma de color').",
      "Ejecutar el código y documentar con texto markdown en el notebook qué hace cada paso",
      "Experimento de detección de color: pedir a ChatGPT código para detectar la región de la flor usando el espacio HSV (separar la flor del fondo verde/marrón por color). Visualizar la máscara resultante.",
      "Experimento de contornos: detectar los contornos de la flor con cv2.findContours() y dibujarlos sobre la imagen original en verde",
      "Análisis final: ¿qué información útil podría extraer este pipeline para un sistema de control de calidad de flores para exportación? Escribir 200 palabras en el notebook.",
    ],
    resultado:
      "Notebook con pipeline completo de 5 operaciones OpenCV aplicado a imagen de rosa ecuatoriana, experimento de detección de color HSV, detección de contornos y análisis de aplicabilidad en control de calidad para exportación.",
    criterios: [
      { criterio: "Pipeline de 5 operaciones OpenCV ejecutando correctamente", puntos: 30 },
      { criterio: "Visualización en grilla 2x2 con las 4 versiones de la imagen", puntos: 20 },
      { criterio: "Detección de color HSV con máscara de la flor correcta", puntos: 20 },
      { criterio: "Detección de contornos dibujados sobre la imagen original", puntos: 15 },
      { criterio: "Análisis de aplicabilidad en control de calidad exportación", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "OpenCV Python Tutorials — Documentación oficial",
      url: "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html",
      tipo: "documentacion",
      descripcion: "Tutoriales oficiales de OpenCV en Python. Desde instalación hasta técnicas avanzadas de visión computacional.",
    },
    {
      titulo: "OpenCV Tutorial en Español — Pildoras Informáticas",
      url: "https://www.youtube.com/c/PildorasInformaticas",
      tipo: "lectura",
      descripcion: "Canal de YouTube en español con tutoriales de OpenCV y Python para visión computacional. Excelente para hispanohablantes.",
    },
    {
      titulo: "NumPy para arrays de imágenes",
      url: "https://numpy.org/doc/stable/user/quickstart.html",
      tipo: "documentacion",
      descripcion: "Documentación de NumPy. OpenCV usa arrays de NumPy para representar imágenes — entender NumPy es fundamental para manipular imágenes.",
    },
    {
      titulo: "Roboflow — Plataforma de datos de visión",
      url: "https://roboflow.com",
      tipo: "herramienta",
      descripcion: "Plataforma para anotar, gestionar y versionar datasets de visión computacional. Plan gratuito con 3 proyectos y 1,000 imágenes.",
    },
  ],
  teoria: `OpenCV (Open Source Computer Vision Library) es la biblioteca más utilizada en el mundo para visión computacional y procesamiento de imágenes. Desarrollada inicialmente por Intel en 1999 con el objetivo de proporcionar herramientas de visión computacional de alta performance accesibles a todos, hoy es mantenida por la comunidad open source y tiene más de 47,000 estrellas en GitHub. Es gratuita para uso tanto académico como comercial, lo que la convierte en el punto de entrada estándar para cualquier profesional que quiera trabajar con imágenes y video en Python.

La idea central de OpenCV es que una imagen digital es fundamentalmente un array de NumPy: una estructura de datos numérica donde cada elemento representa la intensidad de un píxel. Esto significa que todas las operaciones matemáticas que puedes hacer con NumPy, puedes hacerlas con imágenes. Multiplicar una imagen por 0.5 la oscurece. Restar dos imágenes revela las diferencias entre ellas. Indexar el array img[y1:y2, x1:x2] recorta una región de interés (ROI).

Un aspecto contraintuitivo que sorprende a todos los principiantes es que OpenCV usa el formato de color BGR (Blue, Green, Red) en lugar del RGB estándar. Esta decisión histórica de los primeros desarrolladores de OpenCV genera errores frecuentes: si lees una imagen con OpenCV y la muestras con matplotlib, los canales rojo y azul aparecen intercambiados, dando colores incorrectos. La conversión es simple: cv2.cvtColor(img, cv2.COLOR_BGR2RGB), pero hay que recordarla siempre.

Las operaciones de procesamiento de imágenes que todo profesional de visión computacional debe conocer son: la conversión a escala de grises (cv2.cvtColor con COLOR_BGR2GRAY), que reduce tres canales a uno y acelera el procesamiento posterior; el suavizado gaussiano (cv2.GaussianBlur), que reduce el ruido antes de aplicar detección de bordes o umbralización; la detección de bordes con el algoritmo de Canny (cv2.Canny), que usa gradientes de intensidad para encontrar los contornos de los objetos; la umbralización (cv2.threshold), que convierte una imagen en grises a blanco y negro usando un umbral de intensidad; y las operaciones morfológicas de dilatación y erosión que permiten engrosar o adelgazar regiones de interés.

Para aplicaciones de color, el espacio HSV (Hue, Saturation, Value) es generalmente superior al BGR. La razón es que en HSV el color puro (Hue) está separado del brillo (Value) y la saturación (Saturation). Esto permite detectar "todo lo que es de color verde" con un rango simple de valores de Hue, independientemente de si la imagen fue tomada con más o menos luz. Para un sistema que necesita detectar hojas enfermas de distinto color en una plantación de banano en Ecuador bajo diferentes condiciones climáticas, HSV es la elección correcta.

La detección de contornos (cv2.findContours) es una operación fundamental que permite extraer las formas geométricas de una imagen binaria. Encuentra las cadenas de píxeles que forman los bordes de los objetos y los representa como listas de puntos. Sobre esos contornos se pueden calcular propiedades útiles: área (cv2.contourArea), perímetro (cv2.arcLength), bounding box (cv2.boundingRect), y forma (circularidad, elongación). En un sistema de control de calidad de flores ecuatorianas para exportación, esto permite detectar automáticamente flores con pétalos incompletos o deformados.

La capacidad de trabajar con video en tiempo real es quizás la aplicación más impactante de OpenCV en Ecuador. Un loop simple de captura de cámara, procesamiento frame por frame y visualización de resultados puede construirse en menos de 20 líneas de código Python. Esto es la base de todos los sistemas de video vigilancia inteligente, control de calidad en líneas de producción, y análisis de tráfico vehicular que usan visión computacional. La Agencia Metropolitana de Tránsito de Quito, por ejemplo, usa principios muy similares en sus sistemas de detección de placas vehiculares.`,
};

const tema7: TemaC11 = placeholder(7, "Detección de formas y contornos con OpenCV", MOD2, 2);
const tema8: TemaC11 = placeholder(8, "OCR con Tesseract y visión de documentos", MOD2, 2);
const tema9: TemaC11 = placeholder(9, "Procesamiento de video en tiempo real", MOD2, 2);
const tema10: TemaC11 = placeholder(10, "Reconocimiento facial con OpenCV y DeepFace", MOD2, 2);

// ─── MÓDULO 3: Detección de Objetos con YOLO ────────────────────────────────

const MOD3 = "Detección de Objetos con YOLO";

const tema11: TemaC11 = {
  id: 11,
  titulo: "YOLO — You Only Look Once, el detector más usado del mundo",
  modulo: MOD3,
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "YOLOv8 Tutorial completo en español — detección de objetos",
  videoDuracion: "~45 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "YOLO — You Only Look Once, el Detector más Usado del Mundo\nC11. Visión Computacional Aplicada — Tema 11\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué hace único a YOLO?",
      contenido:
        "YOLO (You Only Look Once) — creado por Joseph Redmon, 2016\nAntes de YOLO: Faster R-CNN → 7 frames por segundo (no era tiempo real)\nDespués de YOLO: 45-155 frames por segundo → tiempo real\n\n¿Cómo lo logra? En lugar de proponer regiones y luego clasificarlas (2 pasos), YOLO procesa TODA la imagen UNA SOLA VEZ dividida en una grilla y predice simultáneamente boxes y clases\n\nEsto lo hace perfecto para video en tiempo real.",
    },
    {
      titulo: "Evolución de YOLO — versiones",
      contenido:
        "v1 (2016): primer YOLO, 45 fps, revolucionario\nv3 (2018): mejor precisión en objetos pequeños, multi-escala\nv4 (2020): optimizado para producción, mejor tradeoff velocidad/precisión\nv5 (2020, Ultralytics): facilidad de uso, Python nativo, muy popular\nv8 (2023, Ultralytics): arquitectura nueva, detección+segmentación+pose\nv10 (2024): sin NMS post-procesamiento, más rápido\nv11 (2024, YOLO11): el más reciente, mejor en objetos pequeños\n\nRecomendación para empezar: YOLOv8 de Ultralytics.",
    },
    {
      titulo: "Instalación y uso básico de YOLOv8",
      contenido:
        "pip install ultralytics\n\nfrom ultralytics import YOLO\n\n# Cargar modelo pre-entrenado (descarga automática)\nmodel = YOLO('yolov8n.pt')  # 'n'=nano, 's'=small, 'm'=medium\n\n# Inferencia en imagen\nresults = model('imagen.jpg')\nresults[0].show()  # mostrar imagen con boxes\nresults[0].save()  # guardar resultado\n\n# Inferencia en cámara en tiempo real\nresults = model(source=0, show=True)  # 0 = cámara web",
    },
    {
      titulo: "Métricas de evaluación — mAP, Precision, Recall",
      contenido:
        "IoU (Intersection over Union): cuánto se superpone el box predicho con el real\nmAP@50: mean Average Precision con IoU ≥ 50% — métrica principal de YOLO\nmAP@50:95: más estricta — IoU entre 50% y 95%\n\nYOLOv8n en COCO: mAP@50 = 52.9%\nYOLOv8x en COCO: mAP@50 = 64.0%\n\nTradeoff: n (nano) = ultra rápido, menos preciso. x = más lento, más preciso. Para producción en Ecuador: 'm' o 's' suele ser el balance óptimo.",
    },
    {
      titulo: "Fine-tuning — entrenar en tus propios datos",
      contenido:
        "Cuando usar fine-tuning: el modelo base no detecta lo que necesitas (flores específicas, defectos de manufactura, productos locales)\n\nPasos en 5 líneas de código:\n1. Preparar dataset en formato YOLO (imágenes + labels .txt)\n2. Anotar con Roboflow o Label Studio\n3. model = YOLO('yolov8s.pt')  # partir del pre-entrenado\n4. model.train(data='dataset.yaml', epochs=100, imgsz=640)\n5. model.val()  # evaluar\n\nRegla de oro: mínimo 100 imágenes por clase, idealmente 500+",
    },
    {
      titulo: "YOLO en casos de uso Ecuador",
      contenido:
        "Flores: detectar etapa de madurez (botón cerrado → abierto → marchito) para clasificación automática de exportación\nBanano: detectar manchas de Sigatoka negra en hojas desde drones\nRetail: contar personas por zona en supermercados (sin reconocer identidad)\nTransporte: detectar placas vehiculares + vehículos\nConstructora: contar camiones que entran/salen de obra con carga\nSalud: detectar anormalidades en imágenes médicas (con dataset médico específico)",
    },
    {
      titulo: "Segmentación e estimación de pose con YOLOv8",
      contenido:
        "YOLOv8-seg: segmentación de instancias (máscara pixel por pixel)\nmodel = YOLO('yolov8n-seg.pt')\n\nYOLOv8-pose: estimación de postura humana (17 puntos clave del cuerpo)\nmodel = YOLO('yolov8n-pose.pt')\n\nAplicación pose en Ecuador:\n• Gimnasios y fisioterapeutas: análisis de forma en ejercicios\n• Cámaras de seguridad: detectar comportamientos sospechosos (caída, pelea)\n• Fábricas: detectar posturas de trabajo ergonómicamente incorrectas",
    },
    {
      titulo: "Optimización para deployment",
      contenido:
        "Para Raspberry Pi / dispositivos embebidos:\n• YOLO nano (yolov8n) = el más pequeño\n• Exportar a ONNX: model.export(format='onnx')\n• Exportar a TensorRT (GPU NVIDIA): más rápido en hardware NVIDIA\n\nPara API web (Flask/FastAPI):\n• Procesar imagen recibida → YOLO → devolver JSON con boxes\n\nPara Jetson Nano (dispositivos edge Ecuador):\n• Ideal para cámaras industriales en campo sin internet constante",
    },
    {
      titulo: "Resumen del Tema 11",
      contenido:
        "1. YOLO procesa toda la imagen en un solo paso → 45-155 fps en tiempo real\n2. YOLOv8 de Ultralytics: la versión más fácil de usar, recomendada para aprender\n3. mAP@50 es la métrica principal para evaluar la calidad de la detección\n4. Fine-tuning en 5 pasos con mínimo 100 imágenes propias por clase\n5. Ecuador: flores, banano, retail, transporte y salud son casos de uso reales\n\nPróximo: Fine-tuning de YOLO para detectar productos ecuatorianos",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál fue la innovación principal de YOLO respecto a detectores anteriores como Faster R-CNN?",
      opciones: [
        "Usa más capas de redes neuronales",
        "Procesa toda la imagen en UN solo paso en lugar de dos (proponer regiones + clasificar), logrando tiempo real",
        "Funciona sin GPU",
        "No necesita datos de entrenamiento",
      ],
      respuesta: 1,
      explicacion:
        "La innovación de YOLO es la arquitectura single-shot: procesa la imagen dividida en grilla y predice simultáneamente bounding boxes y clases en un solo forward pass, en lugar del proceso de dos etapas de Faster R-CNN. Esto lo hace 5-10x más rápido.",
    },
    {
      pregunta: "¿Cuántas imágenes por clase se recomienda como mínimo para fine-tuning de YOLO?",
      opciones: ["10 imágenes", "50 imágenes", "100 imágenes", "10,000 imágenes"],
      respuesta: 2,
      explicacion:
        "El mínimo recomendado para fine-tuning es 100 imágenes por clase, idealmente 500 o más. Con menos imágenes, el modelo tiende a hacer overfitting y no generaliza bien. La calidad de las anotaciones es igualmente importante.",
    },
    {
      pregunta: "¿Qué significa mAP@50 en el contexto de evaluación de YOLO?",
      opciones: [
        "El modelo fue entrenado con 50 épocas",
        "Mean Average Precision calculado cuando la superposición entre el box predicho y el real (IoU) es mayor al 50%",
        "El modelo detecta objetos hasta 50 metros de distancia",
        "El batch size de entrenamiento fue 50",
      ],
      respuesta: 1,
      explicacion:
        "mAP@50 es la media del Average Precision calculada para cada clase, usando un umbral de IoU de 0.50. Si el box predicho se superpone en más del 50% con el box real, se cuenta como detección correcta. Es la métrica estándar para comparar detectores de objetos.",
    },
    {
      pregunta: "Para desplegar un modelo YOLO en un dispositivo Raspberry Pi o sistema embebido en una finca ecuatoriana sin internet constante, ¿qué formato de exportación es más adecuado?",
      opciones: ["PyTorch .pt (modelo original)", "ONNX (Open Neural Network Exchange)", "JSON", "CSV"],
      respuesta: 1,
      explicacion:
        "ONNX (Open Neural Network Exchange) es el formato estándar para desplegar modelos en hardware diverso, incluyendo Raspberry Pi, microcontroladores y dispositivos edge. Permite usar el modelo sin depender de PyTorch y generalmente con mejor optimización para el hardware objetivo.",
    },
    {
      pregunta: "¿Qué variante de YOLOv8 detecta la postura del cuerpo humano con 17 puntos clave?",
      opciones: ["yolov8n.pt", "yolov8n-seg.pt", "yolov8n-pose.pt", "yolov8n-cls.pt"],
      respuesta: 2,
      explicacion:
        "yolov8n-pose.pt es el modelo de estimación de pose de YOLOv8. Detecta 17 puntos clave del cuerpo humano (keypoints) como hombros, codos, rodillas, etc. Útil para análisis de movimiento, ergonomía y seguridad.",
    },
  ],
  ejercicio: {
    titulo: "Detector de objetos con YOLOv8 para supermercado ecuatoriano",
    objetivo:
      "Entrenar un detector de objetos con YOLOv8 para detectar productos típicos de un supermercado ecuatoriano (banano, agua, bebidas) usando fine-tuning con imágenes propias o de internet",
    herramientas: "Google Colab (con GPU) + Python + Ultralytics YOLO + Roboflow",
    datosEjemplo:
      "Dataset: crear en Roboflow un proyecto con 3 clases:\n1. 'banano' — fotografías de bananos individuales o racimos\n2. 'agua_botella' — botellas de agua (Tesalia, Güitig)\n3. 'gaseosa' — latas o botellas de Coca-Cola, Fanta, Sprite\nRecolectar 30-50 imágenes por clase (total 90-150 imágenes) desde:\n• Fotos propias con teléfono\n• Google Images con verificación de uso permitido\n• Roboflow Universe (buscar productos similares)",
    pasos: [
      "Crear cuenta en Roboflow (roboflow.com) y nuevo proyecto de detección de objetos con 3 clases: banano, agua_botella, gaseosa",
      "Subir 30 imágenes por clase y anotarlas con la herramienta de Roboflow (dibujar bounding boxes alrededor de cada objeto)",
      "En Roboflow: Generate Dataset → aplicar augmentaciones (flip horizontal, rotación ±15°, brillo aleatorio). Exportar en formato 'YOLOv8' y copiar el código de descarga",
      "Abrir Google Colab, activar GPU (Entorno de ejecución → Cambiar tipo de entorno → T4 GPU)",
      "Instalar: !pip install ultralytics",
      "Descargar dataset de Roboflow con el código generado: from roboflow import Roboflow; rf = Roboflow(api_key='TU_KEY'); ... dataset.download('yolov8')",
      "Entrenar: model = YOLO('yolov8s.pt'); model.train(data='data.yaml', epochs=50, imgsz=640, batch=16)",
      "Evaluar: metrics = model.val() — documentar mAP@50 obtenido",
      "Probar el modelo con al menos 5 imágenes nuevas: model('nueva_imagen.jpg') y mostrar los resultados",
      "Análisis final: ¿qué mAP@50 obtuviste? ¿Qué clase tuvo mejor y peor desempeño? ¿Cuántas imágenes adicionales crees que mejorarían el modelo?",
    ],
    resultado:
      "Modelo YOLOv8 fine-tuned para 3 clases de productos ecuatorianos con mAP@50 documentado, inferencia en 5 imágenes nuevas, análisis de resultados y plan de mejora con más datos.",
    criterios: [
      { criterio: "Dataset anotado correctamente en Roboflow (90+ imágenes, 3 clases)", puntos: 25 },
      { criterio: "Entrenamiento completado con mAP@50 documentado", puntos: 25 },
      { criterio: "Inferencia en 5 imágenes nuevas con visualización de boxes", puntos: 20 },
      { criterio: "Análisis comparativo de desempeño por clase", puntos: 20 },
      { criterio: "Plan de mejora fundamentado con datos", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "Ultralytics YOLOv8 — Documentación oficial",
      url: "https://docs.ultralytics.com/",
      tipo: "documentacion",
      descripcion: "Documentación completa de YOLOv8 con tutoriales, configuración, métricas y guías de deployment. La referencia principal para trabajar con YOLO.",
    },
    {
      titulo: "Roboflow — Plataforma de datasets y anotación",
      url: "https://roboflow.com",
      tipo: "herramienta",
      descripcion: "Plataforma completa para crear, anotar, aumentar y exportar datasets de visión computacional. Integración directa con YOLO. Plan gratuito disponible.",
    },
    {
      titulo: "Roboflow Universe — Datasets públicos",
      url: "https://universe.roboflow.com/",
      tipo: "herramienta",
      descripcion: "Más de 200,000 datasets de visión computacional públicos listos para descargar y usar en proyectos. Busca datasets de productos latinoamericanos.",
    },
    {
      titulo: "Papers with Code — Object Detection",
      url: "https://paperswithcode.com/task/object-detection",
      tipo: "documentacion",
      descripcion: "Comparativa actualizada de modelos de detección de objetos con resultados en COCO, código disponible y rankings actualizados.",
    },
  ],
  teoria: `YOLO (You Only Look Once) es el detector de objetos más influyente e implementado en la historia de la visión computacional. Creado por Joseph Redmon y publicado en 2016 en el paper "You Only Look Once: Unified, Real-Time Object Detection", resolvió el principal cuello de botella de los detectores de objetos anteriores: la velocidad. Mientras Faster R-CNN (el estado del arte anterior) procesaba 7 frames por segundo (insuficiente para aplicaciones en tiempo real), YOLO v1 procesaba 45 frames por segundo con precisión competitiva.

La innovación arquitectónica de YOLO es elegante en su simplicidad: en lugar del proceso de dos etapas de los detectores anteriores (primero proponer regiones de interés, luego clasificar cada región), YOLO reformuló la detección como un problema de regresión única. Divide la imagen en una grilla NxN y, en un solo forward pass de la red neuronal, predice simultáneamente los bounding boxes y las probabilidades de clase para todas las celdas de la grilla. "You Only Look Once" no es solo un nombre creativo — describe literalmente cómo funciona el algoritmo.

La familia YOLO ha evolucionado rápidamente. YOLOv5, desarrollado por Ultralytics en 2020, popularizó YOLO al hacer su uso extremadamente accesible en Python. YOLOv8, también de Ultralytics (2023), unificó detección, segmentación e estimación de pose en una sola API coherente. YOLO v11 (YOLO11) de 2024 mejora especialmente la detección de objetos pequeños y la eficiencia en dispositivos con recursos limitados. Ultralytics ha creado el ecosistema YOLO más utilizado en producción con una API de Python que permite hacer inferencia en 3 líneas de código.

Para el mercado ecuatoriano, las aplicaciones de YOLO son numerosas y de alto impacto. En el sector florícola (Ecuador es el tercer mayor exportador mundial de flores), los sistemas de visión con YOLO pueden clasificar automáticamente flores por etapa de desarrollo (botón cerrado, apertura 50%, flor completa, en declive), detectar defectos en pétalos que reducen el valor de exportación, y contar unidades en cintas transportadoras. Empresas florícolas de Cayambe, Tabacundo y El Quinche pueden reducir costos de mano de obra en clasificación hasta un 40% con estos sistemas.

En el sector bananero (Ecuador es el mayor exportador mundial de banano), YOLO puede detectar síntomas tempranos de Sigatoka negra, la plaga más destructiva del banano, en imágenes capturadas por drones sobrevolando las plantaciones. Un drone con cámara + modelo YOLO específico puede inspeccionar 100 hectáreas por hora con una precisión de detección del 90%+, algo imposible con personal humano al mismo costo y velocidad.

El fine-tuning de YOLO en datos propios es uno de los flujos de trabajo más accesibles de la IA aplicada. El proceso consiste en: recolectar imágenes de los objetos que quieres detectar (mínimo 100 por clase, idealmente 500+), anotarlas con herramientas como Roboflow (dibujar bounding boxes alrededor de cada objeto y etiquetarlos), aplicar data augmentation para generar variaciones artificiales, entrenar el modelo base pre-entrenado en COCO con tus datos específicos (fine-tuning), y evaluar con métricas como mAP@50. En Google Colab con GPU T4 gratuita, entrenar 100 épocas con un dataset de 500 imágenes toma entre 30 y 90 minutos.

La evaluación de modelos YOLO usa como métrica principal el mAP (mean Average Precision). mAP@50 calcula la precisión promedio cuando un bounding box predicho se considera correcto si se superpone en al menos 50% con el box de referencia (IoU ≥ 0.50). Para aplicaciones industriales que requieren alta precisión (robótica, cirugía), se usa mAP@50:95 que es más estricto. Para aplicaciones de conteo y clasificación general, mAP@50 superior al 70% es aceptable para producción.`,
};

const tema12: TemaC11 = placeholder(12, "Fine-tuning de YOLO con dataset propio", MOD3, 3);
const tema13: TemaC11 = placeholder(13, "Segmentación de instancias con YOLOv8-seg", MOD3, 3);
const tema14: TemaC11 = placeholder(14, "Deployment de modelos YOLO en producción", MOD3, 3);
const tema15: TemaC11 = placeholder(15, "Métricas avanzadas de evaluación en detección", MOD3, 3);

// ─── MÓDULO 4: Casos Prácticos Ecuador ──────────────────────────────────────

const MOD4 = "Casos Prácticos Ecuador";

const tema16: TemaC11 = {
  id: 16,
  titulo: "Visión computacional en agricultura ecuatoriana",
  modulo: MOD4,
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "IA y drones en agricultura precisión Ecuador — casos reales",
  videoDuracion: "~38 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "Visión Computacional en Agricultura Ecuatoriana\nC11. Visión Computacional Aplicada — Tema 16\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "La agricultura en Ecuador — cifras clave",
      contenido:
        "• Ecuador: 8% PIB agrícola, +1.5 millones de empleos directos\n• Primer exportador mundial de banano ($3.9B/año)\n• Tercer exportador de flores ($0.9B/año)\n• Cacao fino de aroma: 60% de la producción mundial\n• Principal problema: pérdidas por plagas 15-30% de cosechas\n• Oportunidad: detección temprana con IA reduce pérdidas hasta 70%",
    },
    {
      titulo: "Drones + visión IA — la revolución del agro ecuatoriano",
      contenido:
        "Hardware: DJI Phantom 4 Multispectral, DJI Agras T30, sensores RGB + NIR\nSoftware IA: YOLO fine-tuned en cultivos específicos\n\nFlujo de trabajo:\n1. Drone vuela ruta programada a 30-50m de altura\n2. Captura imágenes cada 3-5 metros\n3. Se construye mapa ortofotográfico de la finca\n4. IA analiza el mapa detectando zonas de estrés, plagas, sequía\n5. Agrónomo recibe mapa de calor con alertas georreferenciadas",
    },
    {
      titulo: "Casos de detección de enfermedades",
      contenido:
        "BANANO — Sigatoka negra:\n• Síntoma visual: manchas amarillas → marrones → negras en hojas\n• YOLO entrenado detecta manchas con >85% precisión\n• Detectar 2-3 semanas antes que sea visible a ojo humano\n\nROSAS — Botrytis (moho gris):\n• Síntoma: manchas grises en pétalos, tallos\n• Modelo detecta en imágenes de cámara de invernadero\n\nPALMA AFRICANA (Ecuador Costa):\n• Detección de anillo rojo (Rhynchophorus palmarum) por coloración de hojas",
    },
    {
      titulo: "Visión en control de calidad de exportación",
      contenido:
        "FLORES para exportación:\n• Clasificación automática: etapa de apertura, longitud de tallo, defectos de pétalo\n• Sistema actual: cinta transportadora + cámara + YOLO + clasificador\n• Velocidad: 3,000-5,000 flores/hora (vs 500-800 manual)\n• Precisión: 94-96% vs 85-90% manual (cansancio humano)\n\nBANANO para exportación:\n• Calibrado automático del grado (curvatura, largo, ausencia de manchas)\n• Cámaras en packing house → rechazo automático de fruta sub-estándar",
    },
    {
      titulo: "Sistemas de irrigación inteligente con visión",
      contenido:
        "Problema: riego uniforme en campo con condiciones heterogéneas\nSolución: cámaras multiespectrales + índice NDVI (vegetación)\n• NDVI alto: planta sana y bien hidratada\n• NDVI bajo: estrés hídrico o enfermedad\n\nFlujo:\n1. Drone mapea NDVI de toda la finca\n2. IA identifica zonas de bajo NDVI\n3. Sistema de riego por goteo ajusta zonas específicas\n4. Nueva lectura en 48h confirma recuperación\n\nAhorro de agua: 20-35% en haciendas de la Sierra ecuatoriana.",
    },
    {
      titulo: "Caso de estudio — Hacienda bananera Los Ríos",
      contenido:
        "Empresa: hacienda 800 ha, Los Ríos, Ecuador\nProblema: Sigatoka negra afectaba 15% de cosecha anual ($120K pérdida/año)\nSolución implementada:\n• 2 drones DJI Phantom 4 con sensores RGB\n• Modelo YOLOv8 fine-tuned con 2,000 imágenes de Sigatoka en 5 etapas\n• Vuelos semanales, análisis automático\nResultados después de 1 año:\n• Detección promedio: 2.5 semanas antes del punto crítico\n• Reducción de pérdidas: de 15% a 4.5% (-70%)\n• ROI del proyecto en 8 meses",
    },
    {
      titulo: "Herramientas disponibles en Ecuador",
      contenido:
        "Drones agrícolas: DJI (distribuidor en Quito y Guayaquil), AgTech Ecuador\nSoftware de mapeo: DroneDeploy, Pix4D, OpenDroneMap (open source)\nPlatformas de análisis: ESRI AgroSense, Climate.ai, FieldView\nDesarrollo propio: OpenCV + YOLO + Python + Google Colab\nFinanciamiento: BanEcuador tiene líneas de crédito para tecnología agrícola\nCFN: crédito productivo para adquisición de drones y sistemas de precisión",
    },
    {
      titulo: "Oportunidades de negocio — visión IA en agro Ecuador",
      contenido:
        "1. Servicio de mapeo + análisis por hectárea ($15-$40/ha/vuelo)\n2. Venta de sistemas de clasificación automática a packing houses\n3. Consultoría de implementación (diseño del sistema, entrenamiento del modelo, instalación)\n4. SaaS de análisis de imágenes agrícolas por suscripción\n5. Entrenamiento del personal agrícola en uso de tecnología IA\n\nMercado potencial Ecuador: +500,000 ha cultivadas con cultivos de exportación = mercado de $50M+/año en servicios de visión IA.",
    },
    {
      titulo: "Resumen del Tema 16",
      contenido:
        "1. Ecuador: tercer exportador de flores y primero de banano — agricultura ideal para visión IA\n2. Sigatoka negra en banano y Botrytis en rosas son los principales targets de detección\n3. Drones + YOLO fine-tuned → detección 2-3 semanas antes del punto crítico\n4. Control de calidad en packing house: 3,000-5,000 flores/hora con 94-96% precisión\n5. Oportunidades de negocio concretas y financiamiento disponible (BanEcuador, CFN)\n\nPróximo: Visión computacional en retail y seguridad Ecuador",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué índice espectral se usa para detectar estrés hídrico en cultivos con imágenes de drones?",
      opciones: ["RGB estándar", "NDVI (Normalized Difference Vegetation Index)", "Histograma HSV", "COCO Index"],
      respuesta: 1,
      explicacion:
        "El NDVI (Índice de Vegetación de Diferencia Normalizada) usa la diferencia entre el espectro infrarrojo cercano (NIR) y el rojo para medir la salud de la vegetación. Valores altos indican plantas sanas y bien hidratadas; valores bajos indican estrés hídrico o enfermedad.",
    },
    {
      pregunta: "¿Cuánto tiempo antes del punto crítico puede detectar Sigatoka negra un sistema YOLO entrenado en cultivos bananeros?",
      opciones: ["Mismo día que aparece", "1 semana", "2-3 semanas", "Solo cuando la planta ya está muerta"],
      respuesta: 2,
      explicacion:
        "Los modelos YOLO entrenados en imágenes multiespectrales de Sigatoka negra pueden detectar los primeros síntomas visuales (manchas amarillas iniciales) 2 a 3 semanas antes de que la enfermedad sea visible al ojo humano y llegue a su punto crítico de daño.",
    },
    {
      pregunta: "¿Cuál es la velocidad de clasificación automática de flores con sistemas de visión IA comparada con la manual?",
      opciones: [
        "Son similares: 500-800 flores/hora ambas",
        "Manual es más precisa: 5,000 flores/hora vs 3,000 con IA",
        "IA: 3,000-5,000 flores/hora con 94-96% precisión vs 500-800 flores/hora manual con 85-90%",
        "IA solo funciona en laboratorio, no en packing house",
      ],
      respuesta: 2,
      explicacion:
        "Los sistemas de clasificación automática con visión IA en cintas transportadoras procesan 3,000-5,000 flores por hora con una precisión del 94-96%. La clasificación manual promedia 500-800 flores por hora con 85-90% de precisión (que además disminuye con la fatiga).",
    },
    {
      pregunta: "¿Qué institución financiera ecuatoriana ofrece crédito para adquisición de drones y tecnología de agricultura de precisión?",
      opciones: ["Banco Central del Ecuador", "BanEcuador y CFN", "Solo bancos privados", "SUPERCIAS"],
      respuesta: 1,
      explicacion:
        "BanEcuador tiene líneas de crédito específicas para tecnología agrícola, y la Corporación Financiera Nacional (CFN) ofrece crédito productivo para innovación en el sector agropecuario. Ambas facilitan el acceso a financiamiento para drones y sistemas de visión IA.",
    },
    {
      pregunta: "En el caso de estudio de la hacienda bananera en Los Ríos, ¿en cuánto tiempo se recuperó la inversión en el sistema de visión IA?",
      opciones: ["3 meses", "8 meses", "2 años", "No se recuperó"],
      respuesta: 1,
      explicacion:
        "El sistema de drones + YOLO redujo las pérdidas por Sigatoka negra del 15% al 4.5% de la cosecha. Con una pérdida anual anterior de $120K, el ahorro fue de $126K en el primer año, logrando ROI en 8 meses.",
    },
  ],
  ejercicio: {
    titulo: "Prototipo de detector de defectos en flores ecuatorianas para exportación",
    objetivo:
      "Construir un prototipo básico de detector de calidad de flores usando imágenes de internet y YOLOv8, simulando un sistema de clasificación para exportación",
    herramientas: "Google Colab + Roboflow + YOLOv8 + Python",
    datosEjemplo:
      "Dataset objetivo: 3 clases de estado de rosa\n1. 'flor_perfecta' — rosa completamente abierta, sin defectos, para exportación\n2. 'flor_defecto' — rosa con pétalos dañados, manchas o deformidades\n3. 'boton_cerrado' — rosa aún en botón, no lista para corte\n\nRecolectar 40-50 imágenes por clase de:\n• Google Images (buscar 'fresh perfect rose' / 'damaged rose petal' / 'rose bud')\n• Unsplash y Pexels (gratis)\n• Si tienes acceso: fotos propias de floristería",
    pasos: [
      "Crear proyecto en Roboflow 'Clasificacion_Rosas_Ecuador' con 3 clases",
      "Recolectar y subir 40-50 imágenes por clase (mínimo 120 total)",
      "Anotar todas las imágenes en Roboflow: para 'flor_perfecta' y 'flor_defecto', dibujar bounding box alrededor de la flor completa. Para 'boton_cerrado', alrededor del botón.",
      "Aplicar augmentaciones en Roboflow: flip horizontal (50%), rotación ±15°, brillo ±25%, blur ligero. Generar dataset aumentado (debería llegar a 200-300 imágenes).",
      "Exportar en formato YOLOv8 y copiar API key + código de descarga",
      "Abrir Google Colab con GPU T4 activada. Instalar: !pip install ultralytics roboflow",
      "Descargar dataset y entrenar: model = YOLO('yolov8s.pt'); model.train(data='data.yaml', epochs=80, imgsz=640)",
      "Evaluar: metrics = model.val(). Documentar mAP@50 por clase y global.",
      "Crear demo de inferencia: probar con 5 imágenes nuevas no vistas durante el entrenamiento. Mostrar resultados con confianza.",
      "Reflexión (250 palabras): ¿qué precisión obtuviste? ¿Sería suficiente para un sistema de exportación real? ¿Qué mejorarías y cómo? ¿Cuál sería el costo de implementar esto en un packing house ecuatoriano?",
    ],
    resultado:
      "Prototipo de clasificador de rosas con YOLOv8 fine-tuned para 3 clases, con mAP@50 documentado, inferencia en imágenes nuevas y análisis de viabilidad para implementación real en Ecuador.",
    criterios: [
      { criterio: "Dataset anotado correctamente en Roboflow con augmentaciones", puntos: 25 },
      { criterio: "Entrenamiento completado con mAP@50 >= 60% (considerando dataset pequeño)", puntos: 25 },
      { criterio: "Inferencia en 5 imágenes nuevas con visualización de resultados", puntos: 20 },
      { criterio: "Análisis de viabilidad para implementación real en Ecuador", puntos: 20 },
      { criterio: "Estimación de costo de implementación fundamentada", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "INIAP Ecuador — Investigación agropecuaria",
      url: "https://www.iniap.gob.ec/",
      tipo: "documentacion",
      descripcion: "Instituto Nacional de Investigaciones Agropecuarias del Ecuador. Información sobre plagas, enfermedades y buenas prácticas agrícolas en Ecuador.",
    },
    {
      titulo: "DJI Agriculture — Drones agrícolas",
      url: "https://agriculture.dji.com/",
      tipo: "herramienta",
      descripcion: "Línea de drones y sensores agrícolas de DJI. Incluye el Phantom 4 Multispectral para análisis NDVI y el Agras T30 para fumigación de precisión.",
    },
    {
      titulo: "OpenDroneMap — Software libre para mapeo con drones",
      url: "https://www.opendronemap.org/",
      tipo: "herramienta",
      descripcion: "Software open source para procesar imágenes de drones y generar mapas ortofotográficos, modelos 3D y análisis multiespectrales. Alternativa gratuita a Pix4D.",
    },
    {
      titulo: "EXPE Ecuador — Exportaciones agrícolas",
      url: "https://www.proecuador.gob.ec/",
      tipo: "documentacion",
      descripcion: "ProEcuador: estadísticas y tendencias de exportaciones agrícolas ecuatorianas. Datos de volumen, precios y mercados destino para flores, banano y cacao.",
    },
  ],
  teoria: `Ecuador ocupa una posición única en el mundo como potencia agrícola exportadora: primer exportador mundial de banano, tercer exportador de flores cortadas, mayor productor de cacao fino de aroma del planeta, y con una producción significativa de camarones, atún, aceite de palma y cacao. Esta concentración de cultivos de exportación de alto valor crea una demanda específica y creciente de tecnología de precisión para maximizar rendimientos y calidad mientras se reducen costos de insumos y pérdidas.

La visión computacional, combinada con drones y sensores especializados, está transformando la agricultura ecuatoriana de un modelo basado en observación humana e intervenciones masivas a uno de agricultura de precisión con intervenciones quirúrgicas. El principio es simple pero poderoso: en lugar de aplicar fungicidas a toda la plantación cuando aparecen los primeros síntomas de Sigatoka negra, un sistema de drones + visión IA puede mapear semanalmente el estado de salud de cada planta en cientos de hectáreas, identificar exactamente los focos iniciales de infección días o semanas antes de que sean visibles al ojo humano, y generar un mapa de calor georreferenciado que guía una intervención focalizada en el 5-10% del área en lugar del 100%.

La Sigatoka negra (Mycosphaerella fijiensis) es la enfermedad más devastadora del banano a nivel mundial. En Ecuador, puede reducir la producción en un 15-50% si no se controla adecuadamente. Los síntomas visuales pasan por etapas claramente diferenciables: pequeñas rayas pálidas, rayas amarillas, manchas café con halo amarillo, y finalmente manchas negras con tejido muerto. Un modelo YOLO entrenado con imágenes de cada etapa puede detectar las primeras rayas pálidas, que son el indicador más temprano, con más de 85% de precisión en condiciones de campo.

Para el sector florícola, la visión computacional tiene dos aplicaciones primarias: detección de enfermedades en invernadero y clasificación de calidad en packing house. En invernaderos, cámaras fijas instaladas cada 20-30 metros monitorizan continuamente el estado de las flores y alertan sobre primeros síntomas de Botrytis (moho gris), pulgones, trips y otras plagas. En packing house, cintas transportadoras con cámaras industriales y modelos YOLO clasifican automáticamente cada flor por etapa de apertura, longitud de tallo, defectos de pétalos y presencia de plagas, alcanzando velocidades de 3,000 a 5,000 flores por hora con precisión superior a la manual.

El índice NDVI (Normalized Difference Vegetation Index) es fundamental en la agricultura de precisión con drones. Este índice, calculado a partir de la diferencia normalizada entre la reflectancia del infrarrojo cercano (NIR) y el rojo visible, es un indicador confiable del estado fisiológico de la vegetación. Las plantas sanas con clorofila activa reflejan mucho NIR y absorben mucho rojo, dando NDVI alto (0.6-0.9). Las plantas estresadas, enfermas o con riego deficiente tienen NDVI bajo (0.1-0.4). Drones como el DJI Phantom 4 Multispectral tienen cámaras con sensor NIR incorporado que permiten generar mapas NDVI en tiempo real.

El ecosistema de herramientas para implementar visión computacional en agricultura ecuatoriana es accesible y mayoritariamente de bajo costo. OpenDroneMap permite procesar imágenes de drones con software libre para generar mapas ortofotográficos de alta resolución. YOLOv8 en Google Colab con los datasets de plagas disponibles en Roboflow Universe permite construir modelos de detección funcionales sin costo. BanEcuador y la CFN tienen líneas de financiamiento específicas para innovación tecnológica en el sector agropecuario. Y el INIAP (Instituto Nacional de Investigaciones Agropecuarias) del Ecuador tiene investigaciones activas sobre plagas y enfermedades de los principales cultivos exportadores que son colaborativas con el sector privado.`,
};

const tema17: TemaC11 = placeholder(17, "Visión computacional en retail y análisis de tráfico", MOD4, 4);
const tema18: TemaC11 = placeholder(18, "Sistemas de seguridad con visión IA en Ecuador", MOD4, 4);
const tema19: TemaC11 = placeholder(19, "Proyecto integrador: sistema de visión end-to-end", MOD4, 4);
const tema20: TemaC11 = placeholder(20, "APIs de visión IA: Google Vision, Azure, AWS Rekognition", MOD4, 4);

export const C11_TEMAS: TemaC11[] = [
  tema1, tema2, tema3, tema4, tema5,
  tema6, tema7, tema8, tema9, tema10,
  tema11, tema12, tema13, tema14, tema15,
  tema16, tema17, tema18, tema19, tema20,
];
