// ─────────────────────────────────────────────────────────────────────────────
// Microsoft Azure AI Fundamentals (AI-900) — datos estáticos
// ----------------------------------------------------------------------------
// Fuente de verdad: contenido textual del programa para la página
//   /certificaciones/azure-ai-fundamentals
// Compatible con la página existente apps/web/src/app/certificaciones/[slug]/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type {
  CertificationLevel,
  CertificationStatus,
  ExamQuestionOption,
} from "@/types/database";

export interface LeccionTeorica {
  id: string;
  orden: number;
  titulo: string;
  contenidoMarkdown: string;
  duracionLecturaMin: number;
}

export interface VideoCurado {
  url: string | null;
  titulo: string;
  duracionMin: number;
  canal: string | null;
  pendiente: boolean;
  notas: string | null;
}

export interface PreguntaSimulacro {
  id: string;
  enunciado: string;
  opciones: ExamQuestionOption[];
  respuestaCorrecta: number;
  explicacion: string;
}

export interface DominioData {
  orden: number;
  nombre: string;
  descripcion: string;
  porcentajeEnExamen: number;
  lecciones: LeccionTeorica[];
  video: VideoCurado;
  slidesUrl?: string;
  preguntasPractica: PreguntaSimulacro[];
  preguntasSimulacro: PreguntaSimulacro[];
}

export interface CertificacionData {
  slug: string;
  nombre: string;
  proveedor: string;
  logoUrl: string;
  nivelDificultad: CertificationLevel;
  costoExamenUsd: number;
  duracionHorasEstimada: number;
  umbralAprobacionPorcentaje: number;
  idiomaExamen: string;
  descripcion: string;
  estado: CertificationStatus;
  examOficialCodigo: string;
  totalPreguntasSimulacro: number;
  duracionSimulacroMin: number;
  dominios: DominioData[];
}

function q(
  id: string,
  enunciado: string,
  opciones: [string, string, string, string],
  respuestaCorrecta: number,
  explicacion: string
): PreguntaSimulacro {
  return {
    id,
    enunciado,
    opciones: opciones.map((text, idx) => ({
      text,
      is_correct: idx === respuestaCorrecta,
    })),
    respuestaCorrecta,
    explicacion,
  };
}

export const azureAiFundamentalsData: CertificacionData = {
  slug: "azure-ai-fundamentals",
  nombre: "Microsoft Azure AI Fundamentals",
  proveedor: "Microsoft",
  logoUrl: "/logos/azure-ai-fundamentals.svg",
  nivelDificultad: "basico",
  costoExamenUsd: 99,
  duracionHorasEstimada: 20,
  umbralAprobacionPorcentaje: 70,
  idiomaExamen: "español",
  descripcion:
    "Certifícate con Microsoft en fundamentos de IA y Machine Learning en Azure. Examen AI-900: 40-60 preguntas, 1 hora, score mínimo 700/1000. Cubre cargas de trabajo de IA, ML, visión computacional, NLP e IA conversacional con Azure Cognitive Services.",
  estado: "activa",
  examOficialCodigo: "AI-900",
  totalPreguntasSimulacro: 50,
  duracionSimulacroMin: 60,
  dominios: [
    // ── MÓDULO 1 ───────────────────────────────────────────────────────────
    {
      orden: 1,
      nombre: "Conceptos de IA y Cargas de Trabajo",
      descripcion:
        "Fundamentos de inteligencia artificial, tipos de cargas de trabajo de IA y principios de IA responsable según Microsoft.",
      porcentajeEnExamen: 20,
      video: {
        url: "https://www.youtube.com/embed/PLACEHOLDER",
        titulo: "Azure AI-900 — Módulo 1: Conceptos de IA y Workloads",
        duracionMin: 40,
        canal: "Microsoft Learn",
        pendiente: true,
        notas:
          "GRABACIÓN PROPIA NECESARIA. Usar módulo oficial de Microsoft Learn como referencia: learn.microsoft.com/es-es/certifications/exams/ai-900",
      },
      slidesUrl: undefined,
      lecciones: [
        {
          id: "AZ1.1",
          orden: 1,
          titulo: "Fundamentos de Inteligencia Artificial",
          duracionLecturaMin: 6,
          contenidoMarkdown: `La inteligencia artificial en el contexto de Azure Microsoft se define como la capacidad de los sistemas informáticos de realizar tareas que normalmente requieren inteligencia humana. Microsoft organiza la IA en torno a tres capacidades fundamentales que todo profesional debe conocer:

**1. Aprendizaje automático (Machine Learning):** la base de la mayoría de soluciones de IA modernas. Los modelos aprenden de datos históricos para hacer predicciones o identificar patrones sin ser programados explícitamente para cada caso. En Azure, el servicio principal es **Azure Machine Learning**.

**2. Detección de anomalías:** identificación automática de valores atípicos o comportamientos fuera de lo esperado. Clave en sectores como banca (detección de fraude), manufactura (control de calidad) y ciberseguridad. Azure ofrece **Azure Anomaly Detector** como servicio cognitivo especializado.

**3. Visión computacional:** análisis y comprensión de imágenes y video mediante IA. Incluye reconocimiento de objetos, clasificación de imágenes, detección de rostros y análisis de escenas. Cubierto por **Azure Computer Vision** y **Azure Custom Vision**.

**4. Procesamiento de lenguaje natural (NLP):** comprensión y generación de texto en lenguaje humano. Incluye análisis de sentimientos, extracción de entidades clave, traducción y resumen. Servicios: **Azure Language Service** y **Azure Translator**.

**5. IA conversacional:** sistemas capaces de mantener diálogos con usuarios en lenguaje natural. Chatbots, asistentes virtuales y sistemas de soporte automatizado. Servicios: **Azure Bot Service** y **Azure Cognitive Service for Language (LUIS/CLU)**.

**6. IA generativa:** capacidad de producir contenido nuevo a partir de indicaciones. En Azure, esto se implementa principalmente a través de **Azure OpenAI Service**, que da acceso a modelos GPT-4, DALL-E y Embeddings de OpenAI dentro del entorno seguro y regulado de Azure.

Estas seis capacidades no son excluyentes; las soluciones empresariales modernas combinan varias. Un sistema de análisis de llamadas de servicio al cliente, por ejemplo, usa NLP para transcripción, análisis de sentimientos para calidad, y ML para predicción de abandono.`,
        },
        {
          id: "AZ1.2",
          orden: 2,
          titulo: "Cargas de trabajo de Machine Learning",
          duracionLecturaMin: 6,
          contenidoMarkdown: `Microsoft clasifica las cargas de trabajo de ML en el examen AI-900 en cuatro categorías principales:

**Aprendizaje supervisado:** el modelo aprende a partir de datos etiquetados (ejemplos con respuesta correcta conocida). Se divide en:
- **Regresión:** predice un valor numérico continuo. Ejemplo: predecir el precio de un departamento en Quito basado en metros cuadrados, ubicación y año de construcción.
- **Clasificación:** predice a qué categoría pertenece un elemento. Binaria (sí/no) o multiclase. Ejemplo: clasificar solicitudes de crédito como aprobadas o rechazadas.

**Aprendizaje no supervisado:** el modelo identifica patrones en datos sin etiquetar.
- **Clustering:** agrupa elementos similares. Ejemplo: segmentar clientes de un banco por comportamiento de uso sin categorías predefinidas.

**Aprendizaje por refuerzo:** el modelo aprende mediante prueba y error, recibiendo recompensas por acciones correctas. Menos común en aplicaciones empresariales estándar, pero relevante en optimización y robótica.

**Características y etiquetas en ML:**
- **Características (features):** las variables de entrada usadas para hacer predicciones. Ejemplo: edad, ingreso mensual, historial crediticio.
- **Etiquetas (labels):** la variable de salida que el modelo intenta predecir. Ejemplo: probabilidad de impago.
- **División de datos:** entrenamiento (70%), validación (15%), prueba (15%) es la proporción estándar.

**Métricas de evaluación:**
- **Clasificación:** precisión (accuracy), precisión por clase (precision), recall, F1-score, AUC-ROC
- **Regresión:** Error Absoluto Medio (MAE), Error Cuadrático Medio (RMSE), R² (coeficiente de determinación)`,
        },
        {
          id: "AZ1.3",
          orden: 3,
          titulo: "Principios de IA Responsable de Microsoft",
          duracionLecturaMin: 5,
          contenidoMarkdown: `Microsoft define **seis principios de IA responsable** que son materia directa del examen AI-900:

**1. Imparcialidad (Fairness):** los sistemas de IA deben tratar a todas las personas equitativamente. Ejemplo: un modelo de contratación no debe discriminar por género, etnia o edad.

**2. Confiabilidad y seguridad (Reliability & Safety):** los sistemas de IA deben funcionar de forma confiable y segura. Deben ser probados exhaustivamente y tener mecanismos de fallo seguro.

**3. Privacidad y seguridad (Privacy & Security):** la IA debe respetar la privacidad y proteger los datos personales. Los modelos no deben revelar información privada de los datos de entrenamiento.

**4. Inclusión (Inclusiveness):** la IA debe empoderar a todos, incluyendo personas con discapacidades. Accesibilidad como requisito de diseño, no como característica opcional.

**5. Transparencia (Transparency):** los sistemas de IA deben ser comprensibles. Las personas deben poder entender cómo funcionan y cuáles son sus limitaciones.

**6. Responsabilidad (Accountability):** deben existir mecanismos de responsabilidad para asegurar que los sistemas de IA funcionen según los principios anteriores. Los humanos mantienen el control y la responsabilidad final.

**Herramientas de IA Responsable en Azure:**
- **Azure Machine Learning Responsible AI Dashboard:** visualiza imparcialidad, explicabilidad, rendimiento y análisis de errores
- **Fairlearn:** biblioteca open source para evaluar y mitigar sesgos en modelos de clasificación
- **InterpretML:** explicabilidad de modelos complejos`,
        },
        {
          id: "AZ1.4",
          orden: 4,
          titulo: "Azure AI Services: catálogo y organización",
          duracionLecturaMin: 6,
          contenidoMarkdown: `**Azure AI Services** (anteriormente llamados Azure Cognitive Services) son APIs preentrenadas que permiten agregar capacidades de IA a aplicaciones sin necesidad de expertise en ML. Se organizan en cinco categorías:

**Visión:**
- Azure Computer Vision: análisis de imágenes, OCR, generación de descripciones
- Azure Custom Vision: entrenamiento de clasificadores de imágenes personalizados
- Azure Face API: detección y reconocimiento facial
- Azure Video Indexer: análisis de video (trascripción, detección de escenas, caras)

**Voz:**
- Azure Speech to Text: transcripción de audio a texto
- Azure Text to Speech: síntesis de voz con voces naturales
- Azure Speech Translation: traducción de voz en tiempo real
- Azure Speaker Recognition: identificación de hablantes

**Lenguaje:**
- Azure Language Service: análisis de sentimientos, extracción de entidades, resumen, clasificación
- Azure Translator: traducción a más de 100 idiomas
- Azure Immersive Reader: accesibilidad para lectura
- Azure Question Answering: creación de bases de conocimiento Q&A

**Decisión:**
- Azure Anomaly Detector: detección de anomalías en series temporales
- Azure Content Moderator: moderación automática de contenido
- Azure Personalizer: personalización de experiencias mediante RL

**Azure OpenAI Service:**
- Acceso a GPT-4, GPT-3.5-turbo, DALL-E 3, Whisper y Embeddings
- Dentro del entorno seguro de Azure con cumplimiento normativo (ISO 27001, SOC 2, GDPR)
- Datos no usados para entrenar modelos base de OpenAI
- Disponible en regiones específicas con latencia predecible

**Endpoint y autenticación:** todos los servicios se consumen via HTTP REST con clave de API o Azure Active Directory (Azure AD).`,
        },
        {
          id: "AZ1.5",
          orden: 5,
          titulo: "Implementación de IA en Azure: flujo de trabajo",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Flujo estándar de implementación de una solución de IA en Azure:**

**1. Definir el problema:** ¿es una tarea de clasificación, regresión, detección, generación? ¿Necesito un modelo preentrenado (AI Services) o uno personalizado (Azure ML)?

**2. Preparar datos:** recopilar, limpiar y etiquetar datos. En Azure: **Azure Data Factory** para integración, **Azure Databricks** para procesamiento a escala, **Azure Storage** para almacenamiento.

**3. Elegir el servicio:**
- Tarea estándar + datos generales → Azure AI Services (sin entrenamiento)
- Tarea estándar + datos propios del dominio → Azure Custom Vision / Custom Speech / Custom Translator
- Tarea completamente personalizada → Azure Machine Learning

**4. Entrenar / configurar:** en Azure ML, usando Designer (interfaz visual drag-and-drop), Automated ML (AutoML, el sistema elige el mejor algoritmo automáticamente) o código (SDK Python/R).

**5. Evaluar:** revisar métricas de rendimiento. En clasificación: matriz de confusión, AUC. En regresión: RMSE, R².

**6. Desplegar:** publicar como endpoint en Azure Kubernetes Service (AKS) para producción o Azure Container Instances (ACI) para desarrollo.

**7. Monitorear:** Azure ML Monitor rastrea drift de datos y degradación del modelo en producción.

**Herramienta clave para el examen — Azure Machine Learning Studio:** interfaz web integrada que cubre todo el ciclo desde datos hasta despliegue. Disponible en ml.azure.com.`,
        },
      ],
      preguntasPractica: [
        q("AZ1.P1", "¿Cuál de los siguientes es un ejemplo de aprendizaje supervisado de tipo regresión?",
          ["Agrupar clientes por comportamiento de compra.", "Predecir el precio de venta de un inmueble.", "Detectar transacciones fraudulentas (sí/no).", "Transcribir audio a texto."], 1,
          "La regresión predice un valor numérico continuo. Predecir precio es regresión; clasificar fraude es clasificación binaria."),
        q("AZ1.P2", "¿Cuál de los seis principios de IA responsable de Microsoft aborda que todas las personas sean tratadas equitativamente?",
          ["Transparencia", "Responsabilidad", "Imparcialidad (Fairness)", "Inclusión"], 2,
          "Imparcialidad (Fairness) es el principio que requiere que los sistemas de IA traten a todas las personas equitativamente."),
        q("AZ1.P3", "Una empresa quiere agregar análisis de sentimientos a su aplicación de soporte al cliente sin entrenar un modelo propio. ¿Qué servicio de Azure es el más adecuado?",
          ["Azure Machine Learning Designer", "Azure Language Service", "Azure Anomaly Detector", "Azure Custom Vision"], 1,
          "Azure Language Service ofrece análisis de sentimientos preentrenado como API REST, sin necesidad de entrenamiento."),
        q("AZ1.P4", "¿Cuál es el score mínimo para aprobar el examen Microsoft AI-900?",
          ["500/1000", "600/1000", "700/1000", "800/1000"], 2,
          "El examen AI-900 requiere un score mínimo de 700 sobre 1000 para aprobar."),
        q("AZ1.P5", "¿Qué herramienta de Azure permite entrenar modelos de clasificación sin escribir código, usando una interfaz visual de arrastrar y soltar?",
          ["Azure Databricks", "Azure Machine Learning Designer", "Azure Synapse Analytics", "Azure Logic Apps"], 1,
          "Azure Machine Learning Designer ofrece una interfaz visual drag-and-drop para construir pipelines de ML sin código."),
        q("AZ1.P6", "¿Cómo se llama el servicio de Azure que da acceso a modelos GPT-4 y DALL-E dentro del entorno seguro de Azure?",
          ["Azure Cognitive Services", "Azure Bot Service", "Azure OpenAI Service", "Azure Language Studio"], 2,
          "Azure OpenAI Service proporciona acceso a modelos de OpenAI (GPT-4, DALL-E, Whisper) dentro del entorno seguro y normativo de Azure."),
        q("AZ1.P7", "¿Qué tipo de aprendizaje automático se usa cuando los datos de entrenamiento NO tienen etiquetas (respuestas correctas)?",
          ["Aprendizaje supervisado", "Aprendizaje no supervisado", "Aprendizaje por refuerzo", "Aprendizaje profundo"], 1,
          "El aprendizaje no supervisado trabaja con datos sin etiquetar para descubrir patrones y estructuras internas."),
        q("AZ1.P8", "¿Cuál es la diferencia principal entre 'características' (features) y 'etiquetas' (labels) en ML?",
          ["Las características son el resultado; las etiquetas son las variables de entrada.", "Las características son las variables de entrada; las etiquetas son la variable de salida que se predice.", "No existe diferencia, son sinónimos.", "Las características pertenecen al conjunto de prueba; las etiquetas al de entrenamiento."], 1,
          "Features = entradas (variables independientes). Labels = salida (variable dependiente que el modelo predice)."),
        q("AZ1.P9", "¿Qué herramienta de Azure evalúa imparcialidad, explicabilidad y análisis de errores de modelos de ML?",
          ["Azure Synapse Analytics", "Azure Machine Learning Responsible AI Dashboard", "Azure Monitor", "Azure Policy"], 1,
          "El Responsible AI Dashboard en Azure ML integra Fairlearn e InterpretML para análisis de imparcialidad y explicabilidad."),
        q("AZ1.P10", "¿Qué servicio de Azure detecta valores atípicos en series temporales de datos (ej. anomalías en métricas de IoT)?",
          ["Azure Stream Analytics", "Azure Anomaly Detector", "Azure Time Series Insights", "Azure Event Hubs"], 1,
          "Azure Anomaly Detector es el servicio cognitivo especializado en detección de anomalías en series temporales."),
      ],
      preguntasSimulacro: [],
    },

    // ── MÓDULO 2 ───────────────────────────────────────────────────────────
    {
      orden: 2,
      nombre: "Machine Learning en Azure",
      descripcion:
        "Azure Machine Learning: Designer, AutoML, pipelines, evaluación de modelos y despliegue como endpoints.",
      porcentajeEnExamen: 25,
      video: {
        url: "https://www.youtube.com/embed/PLACEHOLDER",
        titulo: "Azure AI-900 — Módulo 2: Machine Learning en Azure",
        duracionMin: 45,
        canal: "Microsoft Learn",
        pendiente: true,
        notas:
          "GRABACIÓN PROPIA NECESARIA. Referencia: learn.microsoft.com/es-es/azure/machine-learning/",
      },
      slidesUrl: undefined,
      lecciones: [
        {
          id: "AZ2.1",
          orden: 1,
          titulo: "Azure Machine Learning Studio y workspace",
          duracionLecturaMin: 6,
          contenidoMarkdown: `**Azure Machine Learning (Azure ML)** es la plataforma end-to-end de Microsoft para el ciclo de vida completo del Machine Learning. Se accede desde **ml.azure.com** o mediante el portal de Azure.

**Componentes del workspace de Azure ML:**

**Compute:**
- **Compute Instance:** VM gestionada para desarrollo (notebooks, experimentos)
- **Compute Cluster:** clúster escalable para entrenamiento distribuido (0 a N nodos)
- **Inference Cluster (AKS):** Kubernetes gestionado para endpoints de producción
- **Attached Compute:** conectar Databricks, HDInsight u otros recursos existentes

**Activos de datos:**
- **Datastores:** conexiones a Azure Blob Storage, Azure Data Lake, Azure SQL, etc.
- **Data Assets:** versiones registradas de datasets con linaje de datos

**Experimentos y Jobs:**
- Cada ejecución de entrenamiento es un "job" que registra métricas, parámetros, artefactos y logs
- Los experimentos agrupan jobs relacionados para comparación

**Registro de modelos:**
- Cada modelo entrenado se registra con versión, métricas y metadatos
- El registro permite auditoría completa y rollback a versiones anteriores

**Endpoints:**
- **Real-time endpoints:** respuesta sincrónica para inferencia en tiempo real (REST API)
- **Batch endpoints:** procesamiento asíncrono de grandes volúmenes de datos`,
        },
        {
          id: "AZ2.2",
          orden: 2,
          titulo: "Automated ML (AutoML)",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Automated ML** es la capacidad de Azure ML para automatizar la selección del algoritmo, la ingeniería de características y el ajuste de hiperparámetros, produciendo el mejor modelo posible para un dataset dado sin intervención manual.

**Proceso de AutoML:**
1. Cargar dataset al workspace
2. Seleccionar tipo de tarea: clasificación, regresión o pronóstico de series temporales
3. Seleccionar columna objetivo (label)
4. Configurar criterio de salida (tiempo máximo, score mínimo)
5. AutoML itera sobre decenas de algoritmos y combinaciones
6. Produce un ranking de los mejores modelos con sus métricas
7. El mejor modelo puede desplegarse con un clic

**Algoritmos que AutoML puede evaluar (ejemplos):**
- Clasificación: LogisticRegression, RandomForest, GradientBoosting, LightGBM, XGBoost, NaiveBayes, SVM
- Regresión: ElasticNet, LightGBM, RandomForest, GradientBoosting, DecisionTree

**Explicabilidad en AutoML:** para cada modelo ganador, AutoML genera una vista de importancia de características (feature importance) que muestra qué variables tuvieron más peso en las predicciones. Crítico para validar que el modelo usa las variables correctas y no hay data leakage.

**Cuándo usar AutoML:** cuando se necesita una baseline rápida, cuando no hay expertise en selección de algoritmos, o cuando se quiere comparar sistemáticamente muchas opciones.`,
        },
        {
          id: "AZ2.3",
          orden: 3,
          titulo: "Azure ML Designer: pipelines visuales",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Azure Machine Learning Designer** es la interfaz visual drag-and-drop que permite construir pipelines de ML completos sin escribir código.

**Componentes disponibles en Designer:**
- **Entrada de datos:** cargar datasets desde Datastores o subir archivos
- **Transformación de datos:** normalización, manejo de valores faltantes, codificación de categóricas, selección de características
- **Algoritmos de ML:** clasificación (Two-Class Boosted Decision Tree, Multiclass Logistic Regression, etc.), regresión, clustering
- **Evaluación:** Score Model, Evaluate Model con matrices de confusión y métricas
- **Despliegue:** Connect to Real-Time Endpoint directamente desde el pipeline

**Flujo típico en Designer:**
1. Dataset → 2. Select Columns → 3. Clean Missing Data → 4. Split Data (70/30) → 5. Algoritmo → 6. Train Model → 7. Score Model → 8. Evaluate Model

**Diferencia Designer vs. AutoML:**
- Designer: el científico de datos elige y configura cada componente manualmente (control total, más flexible)
- AutoML: el sistema elige el mejor algoritmo automáticamente (más rápido, menos control)

**Pipelines de inferencia:** una vez entrenado el modelo en Designer, se crea automáticamente un "inference pipeline" que puede desplegarse como endpoint real-time o batch. El pipeline de inferencia elimina los componentes de entrenamiento y deja solo la transformación y predicción.`,
        },
        {
          id: "AZ2.4",
          orden: 4,
          titulo: "Evaluación de modelos y métricas clave",
          duracionLecturaMin: 6,
          contenidoMarkdown: `**Métricas de clasificación en el examen AI-900:**

**Matriz de confusión:** tabla 2x2 que muestra:
- **TP (True Positive):** predicho positivo, era positivo — correcto
- **TN (True Negative):** predicho negativo, era negativo — correcto
- **FP (False Positive):** predicho positivo, era negativo — error tipo I ("falsa alarma")
- **FN (False Negative):** predicho negativo, era positivo — error tipo II ("caso perdido")

**Métricas derivadas:**
- **Accuracy:** (TP+TN)/(Total) — % de predicciones correctas. Engañosa con datos desbalanceados.
- **Precision:** TP/(TP+FP) — de los que predijo positivos, ¿cuántos lo eran?
- **Recall:** TP/(TP+FN) — de todos los positivos reales, ¿cuántos encontró?
- **F1-Score:** media armónica de Precision y Recall. Balance entre ambas.
- **AUC-ROC:** área bajo la curva ROC. 0.5 = aleatorio, 1.0 = perfecto. >0.8 es bueno.

**Métricas de regresión:**
- **MAE (Mean Absolute Error):** promedio del error absoluto. Interpretable en las unidades del problema.
- **RMSE (Root Mean Square Error):** penaliza más los errores grandes. Más sensible a outliers que MAE.
- **R² (R-cuadrado):** proporción de varianza explicada. 1.0 = perfecto, 0 = no mejor que la media.

**Para el examen:** si la pregunta menciona "detección de fraude" y pregunta qué métrica priorizar, la respuesta es Recall (no perder fraudes reales). Si menciona "spam filtering" y pregunta sobre no molestar usuarios, la respuesta es Precision (no enviar falsos positivos a spam).`,
        },
        {
          id: "AZ2.5",
          orden: 5,
          titulo: "Despliegue y monitoreo de modelos en Azure",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Opciones de despliegue de modelos en Azure ML:**

**Real-time endpoints:**
- Ideal para predicciones individuales con latencia baja (<100ms)
- Se despliega en Azure Container Instances (ACI, para dev/test) o Azure Kubernetes Service (AKS, para producción)
- Expone un endpoint REST con autenticación por clave o token
- Escala automáticamente según tráfico

**Batch endpoints:**
- Ideal para procesar grandes volúmenes de datos de forma asíncrona
- Se lanza como job programado (diario, semanal)
- Lee datos de Azure Blob Storage, procesa y escribe resultados de vuelta
- Costo menor que real-time para casos de uso no urgentes

**Data drift (deriva de datos):**
El fenómeno por el cual la distribución de los datos en producción se aleja de la distribución de los datos de entrenamiento. Causa degradación del rendimiento del modelo con el tiempo. Azure ML Monitor detecta drift automáticamente comparando estadísticas de características en producción contra el baseline de entrenamiento.

**Model drift:** cambio en la relación entre las características y la variable objetivo. Requiere reentrenamiento del modelo.

**Pipeline de MLOps en Azure:**
1. Datos nuevos → Azure Data Factory → Azure ML Dataset
2. Trigger automático → pipeline de reentrenamiento en Azure ML
3. Comparación de métricas → si mejora, registrar nueva versión
4. Aprobación (humana o automatizada) → deploy al endpoint
5. Monitor → detectar drift → reiniciar ciclo`,
        },
      ],
      preguntasPractica: [
        q("AZ2.P1", "¿Cuál es la diferencia principal entre Azure ML Designer y AutoML?",
          ["Designer usa código Python; AutoML usa JavaScript.", "Designer es el científico de datos elige cada componente manualmente; AutoML elige el mejor algoritmo automáticamente.", "AutoML solo funciona para regresión; Designer para clasificación.", "No existe diferencia práctica entre ambos."], 1,
          "Designer = control manual con interfaz visual. AutoML = selección automática del mejor algoritmo."),
        q("AZ2.P2", "En el contexto de clasificación, ¿qué mide el Recall?",
          ["De los predichos positivos, cuántos eran realmente positivos.", "De todos los positivos reales, cuántos encontró el modelo.", "El porcentaje total de predicciones correctas.", "El área bajo la curva ROC."], 1,
          "Recall = TP/(TP+FN): de todos los casos positivos reales, qué proporción el modelo identificó correctamente."),
        q("AZ2.P3", "Una empresa quiere predecir qué clientes van a cancelar su suscripción el próximo mes. ¿Qué tipo de tarea de ML es?",
          ["Regresión", "Clustering", "Clasificación binaria", "Pronóstico de series temporales"], 2,
          "Cancelar o no cancelar es una variable binaria (sí/no), por tanto es clasificación binaria (churn prediction)."),
        q("AZ2.P4", "¿Qué es el 'data drift' y por qué es importante monitorear en producción?",
          ["Error en el código de despliegue del modelo.", "Cambio en la distribución de los datos de producción respecto al entrenamiento, que degrada el rendimiento del modelo.", "Versión desactualizada del SDK de Azure ML.", "Inconsistencia entre las métricas de entrenamiento y las de validación."], 1,
          "Data drift ocurre cuando la distribución de datos en producción cambia respecto al entrenamiento, degradando el rendimiento del modelo."),
        q("AZ2.P5", "¿Cuándo se prefiere un Batch Endpoint sobre un Real-Time Endpoint en Azure ML?",
          ["Cuando se necesita latencia menor a 100ms.", "Cuando se procesan grandes volúmenes de datos de forma asíncrona.", "Cuando el modelo necesita actualizarse cada hora.", "Cuando el modelo está en desarrollo y aún no está listo para producción."], 1,
          "Batch endpoints son ideales para procesar grandes volúmenes sin urgencia de tiempo real, con menor costo."),
      ],
      preguntasSimulacro: [],
    },

    // ── MÓDULO 3 ───────────────────────────────────────────────────────────
    {
      orden: 3,
      nombre: "Visión Computacional con Azure",
      descripcion:
        "Azure Computer Vision, Custom Vision, Face API y análisis de documentos con Document Intelligence.",
      porcentajeEnExamen: 25,
      video: {
        url: "https://www.youtube.com/embed/PLACEHOLDER",
        titulo: "Azure AI-900 — Módulo 3: Visión Computacional",
        duracionMin: 40,
        canal: "Microsoft Learn",
        pendiente: true,
        notas: "GRABACIÓN PROPIA NECESARIA.",
      },
      slidesUrl: undefined,
      lecciones: [
        {
          id: "AZ3.1",
          orden: 1,
          titulo: "Azure Computer Vision: análisis de imágenes",
          duracionLecturaMin: 6,
          contenidoMarkdown: `**Azure Computer Vision** (parte de Azure AI Services) es un conjunto de APIs preentrenadas para análisis visual sin necesidad de entrenar modelos propios.

**Capacidades principales:**

**Análisis de imágenes:**
- Descripción automática en lenguaje natural ("Una persona sentada frente a una computadora portátil")
- Detección de objetos con bounding boxes y nivel de confianza
- Reconocimiento de escenas y categorías de imagen
- Detección de colores dominantes y de primer plano/fondo
- Calificación de contenido adulto (para moderación)

**OCR (Optical Character Recognition) — Read API:**
- Extracción de texto de imágenes y PDFs, incluyendo texto manuscrito
- Soporta más de 150 idiomas
- Identifica el layout del documento (tablas, columnas, párrafos)
- Ideal para digitalización de formularios, recibos, documentos de identidad

**Análisis espacial:**
- Cuenta personas en una zona definida en video en tiempo real
- Detecta distancias entre personas (uso en control de aforo)
- Monitoreo de zonas de acceso restringido

**Casos de uso en Ecuador:**
- Digitalización del archivo físico del Registro Civil
- Extracción automática de datos de RUC y facturas para integración contable
- Control de aforo en eventos y centros comerciales
- Análisis de estanterías de supermercados (inventario visual)`,
        },
        {
          id: "AZ3.2",
          orden: 2,
          titulo: "Azure Custom Vision: modelos de visión personalizados",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Azure Custom Vision** (customvision.ai) permite entrenar modelos de clasificación de imágenes y detección de objetos usando datos propios, sin escribir código de ML.

**Dos tareas principales:**

**Clasificación de imágenes:**
- Asigna una o más etiquetas a una imagen completa
- Ejemplos: clasificar rayos X como "normal" vs "patología", identificar variedad de fruta en foto, categorizar daños en vehículos asegurados

**Detección de objetos:**
- Localiza y clasifica múltiples objetos dentro de una imagen
- Devuelve bounding box + etiqueta + confianza por cada objeto
- Ejemplos: detectar piezas defectuosas en línea de manufactura, identificar especies de fauna en cámaras trampa

**Proceso de entrenamiento:**
1. Crear proyecto en customvision.ai
2. Subir imágenes (mínimo 5 por clase, recomendado 50+)
3. Etiquetar manualmente (clasificación) o dibujar bounding boxes (detección)
4. Entrenar → evaluar métricas (precision, recall, AP)
5. Publicar como endpoint para consumo via API

**Transferencia de aprendizaje:** Custom Vision usa fine-tuning sobre modelos preentrenados de Microsoft, lo que permite obtener buenos resultados con pocas imágenes (50-200 por clase vs. miles en entrenamiento desde cero).

**Exportar para edge:** los modelos pueden exportarse como ONNX (compatible con Windows), CoreML (iOS), TensorFlow Lite (Android) o contenedor Docker para uso offline.`,
        },
        {
          id: "AZ3.3",
          orden: 3,
          titulo: "Azure Face API: detección y análisis facial",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Azure Face API** provee capacidades de análisis facial con importantes restricciones de uso responsable.

**Capacidades disponibles:**
- **Detección de rostros:** localiza uno o más rostros en una imagen, devuelve bounding box y atributos
- **Atributos faciales:** edad estimada, emoción (alegría, tristeza, sorpresa, etc.), pose de la cabeza, uso de accesorios (gafas, máscara)
- **Comparación de rostros (Face Verify):** determina si dos imágenes muestran la misma persona
- **Búsqueda en grupo (Find Similar):** encuentra imágenes similares a un rostro de referencia en una colección
- **Agrupación (Face Group):** agrupa automáticamente imágenes por identidad sin etiquetas previas

**Identificación facial (Face Identify):** la capacidad de identificar a una persona específica a partir de una colección etiquetada (Person Group). **Requiere acceso aprobado** — Microsoft restringió esta funcionalidad en 2023 para limitar su uso solo a casos verificados (cumplimiento de ley, acceso a instalaciones con consentimiento explícito).

**Restricciones de uso responsable (AI-900):**
- Prohibido usar para inferir emociones o identidad en vigilancia masiva
- Requerido consentimiento explícito de las personas fotografiadas
- Prohibido en contextos de aplicación de la ley sin marcos legales claros
- Datos faciales clasificados como datos biométricos sensibles bajo GDPR y legislaciones equivalentes`,
        },
        {
          id: "AZ3.4",
          orden: 4,
          titulo: "Azure Document Intelligence y Form Recognizer",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Azure Document Intelligence** (anteriormente Form Recognizer) es el servicio especializado en extracción de información estructurada de documentos.

**Modelos preentrenados:**
- **Factura (Invoice):** extrae campos estándar — número de factura, fechas, líneas de detalle, totales, datos del proveedor y cliente
- **Recibo (Receipt):** procesa tickets de punto de venta — comercio, items, subtotales, impuestos
- **Documento de identidad (ID Document):** extrae datos de pasaportes, cédulas de identidad y licencias de conducir
- **Tarjeta de presentación:** nombre, empresa, cargo, teléfono, email
- **W-2 / Nómina:** para contextos de RRHH (principalmente mercado norteamericano)

**Modelo general (Read):** OCR de alta precisión para documentos sin estructura fija.

**Modelo personalizado (Custom):** para documentos con formato propio. Se entrena con 5+ ejemplos etiquetados. Ideal para formularios internos de empresas, contratos con estructura propietaria, documentos de aduana ecuatorianos.

**Azure Document Intelligence Studio** (documentintelligence.ai.azure.com): interfaz web para etiquetar documentos de entrenamiento, probar el modelo y ver resultados en JSON.

**Caso de uso Ecuador:** extracción automática de datos de facturas del SRI (Servicio de Rentas Internas) para integración con sistemas contables. El modelo personalizado puede aprender el formato específico de las facturas electrónicas ecuatorianas.`,
        },
        {
          id: "AZ3.5",
          orden: 5,
          titulo: "Video Indexer y análisis de video en Azure",
          duracionLecturaMin: 4,
          contenidoMarkdown: `**Azure Video Indexer** es el servicio de análisis de video que extrae automáticamente insights de contenido audiovisual.

**Capacidades de audio:**
- Transcripción automática del habla con marcas de tiempo
- Identificación de hablantes (speaker diarization)
- Traducción automática a 50+ idiomas
- Detección de palabras clave y temas

**Capacidades de video:**
- Detección de escenas, planos y momentos clave
- Reconocimiento de celebridades y figuras públicas
- Detección de texto en pantalla (OCR en video)
- Moderación de contenido (adulto, violencia)
- Detección de emociones faciales en participantes

**Integración con Azure Media Services:** para video a escala empresarial (streaming, transcodificación, DRM).

**Acceso:** mediante la API REST de Video Indexer o el portal www.videoindexer.ai. Los videos se indexan y los metadatos quedan disponibles para búsqueda y consulta.

**Caso de uso: auditoría de videollamadas empresariales.** Una empresa ecuatoriana puede indexar grabaciones de reuniones de Teams para: buscar rápidamente discusiones sobre un tema específico, generar resúmenes automáticos, y asegurar el cumplimiento de que ciertos temas se discutieron en la reunión de directorio.`,
        },
      ],
      preguntasPractica: [
        q("AZ3.P1", "¿Cuál es la diferencia principal entre Azure Computer Vision y Azure Custom Vision?",
          ["Computer Vision es más costoso que Custom Vision.", "Computer Vision usa modelos preentrenados para tareas generales; Custom Vision permite entrenar modelos con imágenes propias.", "Custom Vision solo funciona para detección de texto.", "No hay diferencia; son el mismo servicio con distinto nombre."], 1,
          "Computer Vision = modelos preentrenados para análisis general. Custom Vision = entrenamiento personalizado con imágenes propias del dominio."),
        q("AZ3.P2", "Una empresa de seguros quiere procesar automáticamente fotos de daños en vehículos y clasificarlas por tipo de daño. ¿Qué servicio de Azure es el más adecuado?",
          ["Azure Face API", "Azure Computer Vision (Read API)", "Azure Custom Vision", "Azure Form Recognizer"], 2,
          "Azure Custom Vision permite entrenar un clasificador de imágenes con fotos propias de daños en vehículos, adaptado al catálogo específico de la aseguradora."),
        q("AZ3.P3", "¿Qué capacidad de Azure Face API fue restringida por Microsoft en 2023 para solo casos con aprobación especial?",
          ["Detección de rostros en imágenes", "Identificación de personas específicas (Face Identify)", "Estimación de edad en fotos", "Detección de uso de mascarilla"], 1,
          "Microsoft restringió Face Identify (identificar personas específicas) en 2023, requiriendo aprobación para casos legítimos como acceso a instalaciones."),
        q("AZ3.P4", "¿Cuántos ejemplos de imágenes mínimos se necesitan por clase para entrenar un modelo en Azure Custom Vision?",
          ["1", "5", "100", "1000"], 1,
          "Azure Custom Vision requiere mínimo 5 imágenes por clase, aunque recomienda 50 o más para buenos resultados."),
        q("AZ3.P5", "¿Qué servicio de Azure extrae automáticamente datos estructurados de facturas y documentos de identidad usando modelos preentrenados?",
          ["Azure Computer Vision Read API", "Azure Document Intelligence (Form Recognizer)", "Azure Custom Vision", "Azure Language Service"], 1,
          "Azure Document Intelligence incluye modelos preentrenados para facturas, recibos, documentos de identidad y más."),
      ],
      preguntasSimulacro: [],
    },

    // ── MÓDULO 4 ───────────────────────────────────────────────────────────
    {
      orden: 4,
      nombre: "NLP e IA Conversacional en Azure",
      descripcion:
        "Azure Language Service, Translator, LUIS/CLU, Azure Bot Service y IA conversacional con Azure OpenAI.",
      porcentajeEnExamen: 30,
      video: {
        url: "https://www.youtube.com/embed/PLACEHOLDER",
        titulo: "Azure AI-900 — Módulo 4: NLP e IA Conversacional",
        duracionMin: 45,
        canal: "Microsoft Learn",
        pendiente: true,
        notas: "GRABACIÓN PROPIA NECESARIA.",
      },
      slidesUrl: undefined,
      lecciones: [
        {
          id: "AZ4.1",
          orden: 1,
          titulo: "Azure Language Service: NLP en la nube",
          duracionLecturaMin: 6,
          contenidoMarkdown: `**Azure Language Service** (anteriormente Text Analytics + LUIS + QnA Maker unificados) es el servicio NLP de Azure AI Services que cubre un amplio rango de tareas de comprensión de texto.

**Capacidades preentrenadas:**

**Análisis de sentimientos:** clasifica el texto como positivo, negativo, neutral o mixto, con puntuación de confianza. También incluye **Opinion Mining** que atribuye el sentimiento a aspectos específicos ("el servicio es excelente pero el precio es caro").

**Reconocimiento de entidades con nombre (NER):** identifica y clasifica entidades en el texto: personas, organizaciones, ubicaciones, fechas, cantidades, productos. Ejemplo: en "Juan Pérez de Banco Pichincha firmó el contrato el 15 de marzo", extrae: persona (Juan Pérez), organización (Banco Pichincha), fecha (15 de marzo).

**Extracción de frases clave (Key Phrase Extraction):** identifica las ideas principales de un texto. Útil para indexación, resumen y navegación de grandes volúmenes de documentos.

**Detección de idioma:** identifica en qué idioma está escrito un texto con nivel de confianza.

**Resumen de texto:** capacidad de condensar documentos largos en resúmenes extractivos (usando las frases más representativas del original) o abstractivos (generando nuevas oraciones).

**PII Detection:** identifica y enmascara información personal identificable (nombres, DNI, teléfonos, emails) en documentos antes de procesarlos.

**Traducción de documentos integrada:** conexión nativa con Azure Translator para flujos de NLP multilingüe.`,
        },
        {
          id: "AZ4.2",
          orden: 2,
          titulo: "Comprensión del lenguaje conversacional (CLU) y Question Answering",
          duracionLecturaMin: 6,
          contenidoMarkdown: `**Conversational Language Understanding (CLU)** es el sucesor moderno de LUIS (Language Understanding Intelligent Service). Permite entrenar modelos de comprensión de lenguaje natural para extraer la intención y las entidades de los mensajes de usuario.

**Conceptos clave de CLU:**

**Intenciones (Intents):** qué quiere hacer el usuario. Ejemplos en un chatbot bancario: "ConsultarSaldo", "TransferirDinero", "BloquearTarjeta", "HablarConAgente".

**Entidades:** datos específicos dentro del mensaje. En "Quiero transferir $200 a Juan Pérez mañana", las entidades son: cantidad ($200), destinatario (Juan Pérez), fecha (mañana).

**Utterances de entrenamiento:** ejemplos de frases que los usuarios podrían decir para cada intención. Se recomienda mínimo 15-20 utterances por intención para un rendimiento aceptable.

**Question Answering (anteriormente QnA Maker):** permite crear una base de conocimiento de preguntas y respuestas a partir de:
- Documentos existentes (PDFs, Word, páginas web)
- Pares Q&A manuales
- FAQs publicadas en URLs

El servicio aprende a responder preguntas similares (no idénticas) usando embeddings semánticos. Ideal para chatbots de soporte al cliente, portales de preguntas frecuentes y asistentes de onboarding.

**Diferencia clave para el examen:**
- CLU = el usuario quiere HACER algo (intención + entidades)
- Question Answering = el usuario quiere SABER algo (pregunta → respuesta de una base de conocimiento)`,
        },
        {
          id: "AZ4.3",
          orden: 3,
          titulo: "Azure Translator y servicios de voz",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Azure Translator** proporciona traducción automática neuronal de alta calidad para más de 100 idiomas.

**Modalidades:**
- **Text translation:** traducción de texto estructurado o no estructurado
- **Document translation:** traduce documentos completos preservando el formato original (Word, PDF, PowerPoint)
- **Custom Translator:** permite entrenar modelos de traducción personalizados con terminología del dominio (ej. vocabulario médico o legal específico de Ecuador)
- **Transliteration:** convierte texto entre sistemas de escritura (ej. árabe a caracteres latinos)

**Servicios de voz de Azure (Azure Speech):**

**Speech to Text (STT):** transcripción de audio en tiempo real o por lotes. Soporta español de múltiples variedades (incluido español latinoamericano). Custom Speech permite adaptar el modelo a vocabulario especializado (terminología médica, nombres de productos).

**Text to Speech (TTS):** síntesis de voz con voces neurales ultra-realistas. Disponible en 140+ voces en 60+ idiomas. Custom Neural Voice permite crear una voz personalizada de la marca con 30 minutos de audio de muestra.

**Speech Translation:** traducción de voz a voz o voz a texto en tiempo real. Usado en sistemas de comunicación multilingüe en tiempo real.

**Speaker Recognition:** verifica si la voz pertenece a una persona inscrita (Speaker Verification) o identifica quién habló en una grabación (Speaker Identification).`,
        },
        {
          id: "AZ4.4",
          orden: 4,
          titulo: "Azure Bot Service y arquitectura de chatbots",
          duracionLecturaMin: 6,
          contenidoMarkdown: `**Azure Bot Service** es la plataforma de Microsoft para construir, hospedar y escalar chatbots conversacionales integrados con múltiples canales.

**Componentes de un bot en Azure:**

**Bot Framework SDK:** el framework de desarrollo (C# o Node.js) que proporciona las abstracciones para manejar conversaciones, turnos de diálogo y gestión de estado.

**Bot Framework Composer:** interfaz visual de bajo código para diseñar flujos de conversación sin programar. Similar a un diagrama de flujo pero con capacidades de IA integradas.

**Integración con CLU y Question Answering:** el bot delega la comprensión del lenguaje a CLU (para intenciones) y a QnA (para respuestas de la base de conocimiento), y toma decisiones de flujo basadas en el resultado.

**Canales disponibles:** Microsoft Teams, WhatsApp (via Twilio), Web Chat (embebible en cualquier sitio), Facebook Messenger, Slack, Telegram, Line, SMS (via Twilio).

**Gestión de estado:** el bot mantiene estado de conversación (qué se ha dicho, datos recopilados) en:
- **Memory Store:** para desarrollo local
- **Azure Blob Storage o Cosmos DB:** para producción

**Arquitectura típica de chatbot bancario ecuatoriano:**
1. Usuario escribe en WhatsApp o Web
2. Azure Bot Service recibe el mensaje
3. CLU extrae intención y entidades
4. Si es pregunta → Question Answering responde
5. Si es transacción → Bot llama API del core bancario
6. Si no puede resolver → Escala a agente humano (handoff a Dynamics 365 o Zendesk)`,
        },
        {
          id: "AZ4.5",
          orden: 5,
          titulo: "Azure OpenAI Service: IA generativa en Azure",
          duracionLecturaMin: 5,
          contenidoMarkdown: `**Azure OpenAI Service** proporciona acceso a los modelos de OpenAI (GPT-4, GPT-3.5-turbo, DALL-E 3, Whisper, Embeddings) dentro del entorno seguro, regulado y cumpliente de Azure.

**Diferencias clave vs. OpenAI directo:**
- Los datos NO se usan para entrenar modelos base de OpenAI
- Cumplimiento normativo: ISO 27001, SOC 2, GDPR, HIPAA, FedRAMP
- SLA de 99.9% uptime garantizado por Microsoft
- Integración nativa con Azure AD, Key Vault y Private Endpoint
- Opciones de región (datos no salen de la región configurada)
- Filtros de contenido configurables por el administrador

**Modelos disponibles (AI-900):**
- **GPT-4 / GPT-4o:** generación de texto de alta calidad, razonamiento complejo
- **GPT-3.5-turbo:** texto con balance velocidad/costo
- **DALL-E 3:** generación de imágenes a partir de texto
- **Whisper:** transcripción de audio con alta precisión
- **Embeddings (text-embedding-ada-002):** vectorización de texto para búsqueda semántica

**Casos de uso empresariales (examen AI-900):**
- **Retrieval Augmented Generation (RAG):** chatbot que responde usando documentos propios de la empresa, combinando búsqueda semántica (embeddings) con generación (GPT)
- **Copilot personalizado:** asistente de productividad integrado en sistemas internos
- **Generación de código:** asistente para desarrolladores (GitHub Copilot usa modelos similares)

**Azure AI Studio** (ai.azure.com): portal unificado para experimentar con Azure OpenAI, desplegar modelos y construir soluciones de IA generativa en producción.`,
        },
      ],
      preguntasPractica: [
        q("AZ4.P1", "¿Qué capacidad de Azure Language Service identifica y clasifica personas, organizaciones y ubicaciones en un texto?",
          ["Análisis de sentimientos", "Reconocimiento de entidades con nombre (NER)", "Extracción de frases clave", "Detección de idioma"], 1,
          "NER (Named Entity Recognition) identifica y clasifica entidades como personas, organizaciones, ubicaciones, fechas y cantidades."),
        q("AZ4.P2", "En CLU (Conversational Language Understanding), ¿qué son las 'intenciones' (intents)?",
          ["Los datos específicos extraídos del mensaje (nombres, cantidades, fechas).", "Lo que el usuario quiere hacer, expresado como categoría de acción.", "Los ejemplos de entrenamiento del modelo.", "Las respuestas predefinidas del chatbot."], 1,
          "Las intenciones representan lo que el usuario quiere hacer. Ej: 'ConsultarSaldo', 'ReservarCita', 'CancelarPedido'."),
        q("AZ4.P3", "¿Cuál es la diferencia entre CLU y Question Answering en Azure?",
          ["CLU es más moderno; Question Answering está obsoleto.", "CLU extrae intenciones y entidades (el usuario quiere HACER algo); QA responde preguntas desde una base de conocimiento (el usuario quiere SABER algo).", "CLU funciona solo en inglés; QA en español.", "No existe diferencia práctica."], 1,
          "CLU = comprensión de intenciones para acciones. QA = base de conocimiento para responder preguntas frecuentes."),
        q("AZ4.P4", "¿Qué ventaja ofrece Azure OpenAI Service respecto a usar la API de OpenAI directamente?",
          ["Los modelos de Azure OpenAI son más inteligentes que los de OpenAI.", "Los datos no se usan para entrenar modelos base, con cumplimiento normativo (ISO 27001, GDPR) y SLA garantizado.", "Azure OpenAI es completamente gratuito.", "Azure OpenAI incluye licencias de Office 365."], 1,
          "Azure OpenAI garantiza privacidad de datos, cumplimiento normativo, SLA de 99.9% e integración nativa con el ecosistema Azure."),
        q("AZ4.P5", "¿Qué arquitectura de IA generativa combina búsqueda semántica en documentos propios con generación de texto para crear chatbots que responden con información de la empresa?",
          ["Fine-tuning de GPT-4 con datos propios.", "Retrieval Augmented Generation (RAG).", "Transfer Learning supervisado.", "Azure AutoML para NLP."], 1,
          "RAG combina embeddings para búsqueda semántica en documentos propios con un LLM para generar respuestas contextualizadas."),
      ],
      preguntasSimulacro: [],
    },
  ],
};

// ── Construcción del banco de simulacro ────────────────────────────────────
azureAiFundamentalsData.dominios.forEach((dominio) => {
  dominio.preguntasSimulacro = [...dominio.preguntasPractica];
});

// ── Extras para simulacro completo (50 preguntas total) ────────────────────
const AZURE_EXTRAS: PreguntaSimulacro[] = [
  q("AZE.1", "¿Cuánto dura el examen AI-900 de Microsoft?",
    ["30 minutos", "45 minutos", "1 hora", "2 horas"], 2,
    "El examen AI-900 tiene una duración de 1 hora con 40-60 preguntas."),
  q("AZE.2", "¿Qué servicio de Azure permite crear modelos de traducción adaptados a terminología específica del sector (ej. médico o legal)?",
    ["Azure Translator (estándar)", "Custom Translator", "Azure Language Service", "Azure Speech Translation"], 1,
    "Custom Translator permite entrenar modelos de traducción con glosarios y textos del dominio específico."),
  q("AZE.3", "¿Cuál de los seis principios de IA responsable de Microsoft aborda que los sistemas de IA deben ser comprensibles?",
    ["Imparcialidad", "Inclusión", "Transparencia", "Responsabilidad"], 2,
    "Transparencia requiere que los sistemas de IA sean comprensibles, con documentación de limitaciones y comportamiento."),
  q("AZE.4", "¿Qué tipo de salida produce un modelo de 'detección de objetos' en Azure Custom Vision?",
    ["Una etiqueta para la imagen completa.", "Múltiples etiquetas con bounding boxes para cada objeto detectado.", "Una transcripción de texto del contenido de la imagen.", "Un score de sentimiento de la imagen."], 1,
    "La detección de objetos localiza y clasifica múltiples objetos en una imagen, devolviendo bounding box + etiqueta + confianza por objeto."),
  q("AZE.5", "¿Cuál es la métrica de evaluación más apropiada cuando los datos de entrenamiento están muy desbalanceados (ej. 99% normal, 1% fraude)?",
    ["Accuracy (exactitud total)", "F1-Score o AUC-ROC", "RMSE", "R-cuadrado"], 1,
    "Con datos desbalanceados, accuracy es engañosa. F1-Score y AUC-ROC son más informativas sobre el rendimiento real en la clase minoritaria."),
  q("AZE.6", "¿Qué servicio de Azure permite construir chatbots y conectarlos a múltiples canales como Teams, WhatsApp y Web sin código adicional?",
    ["Azure Language Service", "Azure Bot Service", "Azure Logic Apps", "Azure Communication Services"], 1,
    "Azure Bot Service gestiona el hosting y la integración con múltiples canales de comunicación."),
  q("AZE.7", "¿Qué técnica de ML se usa cuando un modelo aprende mediante prueba y error, recibiendo recompensas por acciones correctas?",
    ["Aprendizaje supervisado", "Aprendizaje no supervisado", "Aprendizaje por refuerzo", "Aprendizaje semi-supervisado"], 2,
    "El aprendizaje por refuerzo aprende mediante recompensas y penalizaciones por acciones en un entorno dado."),
  q("AZE.8", "¿Cuál es el portal web principal para trabajar con Azure Machine Learning?",
    ["portal.azure.com", "ml.azure.com", "ai.azure.com", "customvision.ai"], 1,
    "ml.azure.com es el portal de Azure Machine Learning Studio para gestión de experimentos, modelos y endpoints."),
  q("AZE.9", "¿Qué modelo de Azure AI Services detecta anomalías en series temporales de métricas de negocio?",
    ["Azure Computer Vision", "Azure Anomaly Detector", "Azure Time Series Insights", "Azure Stream Analytics"], 1,
    "Azure Anomaly Detector es el servicio cognitivo especializado en detección de anomalías en series temporales."),
  q("AZE.10", "¿Qué significa que Azure OpenAI Service cumpla con GDPR?",
    ["Los modelos son más precisos para idiomas europeos.", "Los datos de los usuarios europeos no se usan para entrenar modelos y se respetan los derechos de privacidad.", "El servicio solo está disponible en Europa.", "Los modelos fueron entrenados en Europa."], 1,
    "El cumplimiento GDPR implica que los datos no se reutilizan para entrenamiento, los usuarios tienen derechos sobre sus datos y existen mecanismos de borrado."),
];

// Distribuir extras para llegar a 50 preguntas totales (10 por módulo + extras)
azureAiFundamentalsData.dominios[0].preguntasSimulacro.push(...AZURE_EXTRAS.slice(0, 3));
azureAiFundamentalsData.dominios[1].preguntasSimulacro.push(...AZURE_EXTRAS.slice(3, 5));
azureAiFundamentalsData.dominios[2].preguntasSimulacro.push(...AZURE_EXTRAS.slice(5, 7));
azureAiFundamentalsData.dominios[3].preguntasSimulacro.push(...AZURE_EXTRAS.slice(7, 10));

// ── Lookup por slug ─────────────────────────────────────────────────────────

export const certificacionesData: Record<string, CertificacionData> = {
  "azure-ai-fundamentals": azureAiFundamentalsData,
};

export function getCertificacionData(slug: string): CertificacionData | null {
  return certificacionesData[slug] ?? null;
}
