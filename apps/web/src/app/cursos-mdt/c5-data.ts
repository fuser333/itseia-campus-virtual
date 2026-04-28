// ─── C5: Machine Learning Práctico — Datos de 16 temas ───────────────────────
// Curso C5 del programa MDT. 16 temas (scaffolding).
// Módulo 1: Conceptos de ML aplicado
// Módulo 2: Regresión y clasificación
// Módulo 3: Clustering y reducción dimensional
// Módulo 4: Deploy de modelos en producción

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

export interface TemaC5 {
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

export const C5_MODULOS = [
  { num: 1, nombre: "Conceptos de ML Aplicado", horas: 20, temas: 4 },
  { num: 2, nombre: "Regresión y Clasificación", horas: 20, temas: 4 },
  { num: 3, nombre: "Clustering y Reducción Dimensional", horas: 20, temas: 4 },
  { num: 4, nombre: "Deploy de Modelos en Producción", horas: 20, temas: 4 },
];

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC5 => ({
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

// ─── MÓDULO 1: CONCEPTOS DE ML APLICADO ──────────────────────────────────────

const tema1: TemaC5 = {
  id: 1,
  titulo: "¿Qué es Machine Learning? Del hype a los casos reales en Ecuador",
  modulo: "Conceptos de ML Aplicado",
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Machine Learning aplicado: casos reales en Ecuador y LATAM",
  videoDuracion: "20 min",
  teoria: `Machine Learning (ML) es una subdisciplina de la inteligencia artificial que permite a los sistemas aprender patrones a partir de datos y mejorar su desempeño con la experiencia, sin ser programados explícitamente para cada tarea. La diferencia con la programación tradicional es fundamental: en programación clásica, el desarrollador escribe las reglas; en ML, el sistema infiere las reglas a partir de ejemplos.

Existen tres tipos principales de aprendizaje. El aprendizaje supervisado trabaja con datos etiquetados: el modelo aprende de ejemplos con respuesta conocida (precio de una casa, si un correo es spam, si un cliente va a comprar). El aprendizaje no supervisado encuentra patrones en datos sin etiquetas: agrupa clientes similares, detecta anomalías, reduce dimensiones. El aprendizaje por refuerzo aprende por prueba y error con un sistema de recompensas, es el que está detrás de los sistemas de recomendación de Netflix y los juegos de IA.

En Ecuador, el Machine Learning ya está generando valor en sectores concretos. En el sector financiero: Banco Pichincha y Banco del Pacífico usan modelos de credit scoring para evaluar riesgo de crédito en microsegmentos que antes no tenían acceso. En el sector agrícola: el INIAP y empresas como Agroins usan ML para predicción de rendimiento de cultivos y detección temprana de plagas en imágenes satelitales. En retail: cadenas como Supermaxi y TIA usan modelos de predicción de demanda para optimizar inventarios, especialmente para productos perecederos. En el sector público: el SRI usa ML para detectar evasión tributaria correlacionando declaraciones, facturación electrónica y comportamiento de consumo.

El proceso estándar de un proyecto de ML sigue el framework CRISP-DM (Cross-Industry Standard Process for Data Mining): (1) Comprensión del negocio, (2) Comprensión de los datos, (3) Preparación de datos, (4) Modelado, (5) Evaluación, (6) Despliegue. En la práctica, el 70-80% del tiempo se invierte en los pasos 2, 3 y 5, no en el modelado.

Scikit-learn es la librería de ML más usada en Python por su consistencia: todos los modelos siguen la misma API (fit, predict, score). Esto significa que aprender a usar un modelo te enseña a usar todos:

    from sklearn.linear_model import LinearRegression
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.cluster import KMeans

    # La misma API para todos los modelos:
    modelo.fit(X_train, y_train)    # entrenar
    modelo.predict(X_test)          # predecir
    modelo.score(X_test, y_test)    # evaluar

Un error frecuente de principiantes es elegir el modelo más complejo disponible. La regla de oro: empieza con el modelo más simple que puede resolver el problema, luego aumenta complejidad solo si la métrica de evaluación lo justifica. Un modelo simple entendido es más valioso que un modelo complejo mal interpretado.`,
  presentacionSlides: [
    {
      titulo: "ML vs programación tradicional: la diferencia clave",
      contenido:
        "Programación tradicional: humano escribe reglas → datos → output. ML: datos + output (conocidos) → el sistema aprende las reglas. El cambio de paradigma más importante en software.",
    },
    {
      titulo: "Los 3 tipos de aprendizaje",
      contenido:
        "Supervisado: datos etiquetados (precio casa, spam/no-spam). No supervisado: patrones sin etiquetas (segmentación, anomalías). Por refuerzo: prueba y error con recompensas (recomendaciones, juegos).",
    },
    {
      titulo: "ML en Ecuador: casos reales 2024",
      contenido:
        "Banca: credit scoring (Banco Pichincha). Agro: predicción de plagas (INIAP). Retail: predicción de demanda (Supermaxi). Tributario: detección evasión (SRI). Todos en producción hoy.",
    },
    {
      titulo: "CRISP-DM: el proceso estándar",
      contenido:
        "1. Comprensión negocio. 2. Comprensión datos. 3. Preparación datos. 4. Modelado. 5. Evaluación. 6. Despliegue. Realidad: 70-80% del tiempo en pasos 2, 3 y 5 — no en modelado.",
    },
    {
      titulo: "Scikit-learn: la API universal de ML",
      contenido:
        "fit(X_train, y_train) — entrenar. predict(X_test) — predecir. score(X_test, y_test) — evaluar. Misma API para TODOS los modelos. Aprender uno = aprender todos.",
    },
    {
      titulo: "La regla de oro: empieza simple",
      contenido:
        "Regresión lineal antes que XGBoost. Árbol de decisión antes que red neuronal. Un modelo simple entendido > modelo complejo mal interpretado. La complejidad se justifica con métricas.",
    },
    {
      titulo: "Overfitting vs underfitting",
      contenido:
        "Underfitting: modelo demasiado simple, no captura el patrón. Overfitting: modelo memoriza el entrenamiento, falla en datos nuevos. Solución: train/test split + validación cruzada.",
    },
    {
      titulo: "El mercado laboral en Ecuador",
      contenido:
        "ML Engineer: $1,200-$3,000/mes. Data Scientist: $900-$2,500/mes. Analista de datos con ML: $700-$1,500/mes. Habilidad más demandada en tecnología después de Python (2024).",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la diferencia fundamental entre programación tradicional y Machine Learning?",
      opciones: [
        "ML usa más hardware y consume más energía",
        "En programación tradicional el humano escribe las reglas; en ML el sistema aprende las reglas de los datos",
        "ML solo funciona con Python, la programación tradicional con cualquier lenguaje",
        "ML es siempre más preciso que la programación tradicional",
      ],
      respuesta: 1,
      explicacion:
        "El cambio de paradigma central: en programación clásica defines las reglas explícitamente. En ML, proporcionas datos con resultados conocidos y el algoritmo infiere las reglas por sí solo.",
    },
    {
      pregunta: "¿En cuál de los siguientes casos se aplica aprendizaje supervisado?",
      opciones: [
        "Agrupar clientes de un banco por comportamiento de gasto similar",
        "Predecir si un préstamo será pagado o no, usando historial crediticio etiquetado",
        "Encontrar anomalías en transacciones financieras sin ejemplos previos",
        "Entrenar un agente para jugar ajedrez",
      ],
      respuesta: 1,
      explicacion:
        "El aprendizaje supervisado requiere datos etiquetados: ejemplos con la respuesta correcta conocida. Predecir impago usando historial etiquetado como 'pagó/no pagó' es un caso clásico de clasificación supervisada.",
    },
    {
      pregunta: "En el framework CRISP-DM, ¿en qué etapas se invierte el 70-80% del tiempo real?",
      opciones: [
        "Comprensión del negocio y Despliegue",
        "Solo en el Modelado",
        "Comprensión de los datos, Preparación de datos y Evaluación",
        "Igual distribución en todas las etapas",
      ],
      respuesta: 2,
      explicacion:
        "Contra la intuición popular, el modelado no es lo que más tiempo consume. La limpieza y preparación de datos, exploración y evaluación rigurosa ocupan la mayor parte del tiempo en proyectos reales.",
    },
    {
      pregunta: "¿Qué método de Scikit-learn se usa para entrenar cualquier modelo?",
      opciones: ["modelo.train()", "modelo.fit()", "modelo.learn()", "modelo.run()"],
      respuesta: 1,
      explicacion:
        "La API consistente de Scikit-learn usa fit() para entrenar, predict() para predecir y score() para evaluar. Esta uniformidad es lo que hace tan eficiente aprender Scikit-learn.",
    },
    {
      pregunta: "¿Qué institución ecuatoriana usa ML para detectar evasión tributaria?",
      opciones: [
        "Banco Central del Ecuador (BCE)",
        "INEC",
        "Servicio de Rentas Internas (SRI)",
        "Superintendencia de Bancos",
      ],
      respuesta: 2,
      explicacion:
        "El SRI usa modelos de ML que correlacionan declaraciones tributarias, facturación electrónica y patrones de consumo para identificar contribuyentes con comportamiento inconsistente e iniciar auditorías.",
    },
  ],
  ejercicio: {
    titulo: "Tu primer modelo ML: predecir el precio de propiedades en Quito",
    objetivo:
      "Implementar un primer modelo de regresión lineal con Scikit-learn para predecir precios de propiedades usando datos del mercado inmobiliario de Quito.",
    herramientas:
      "Google Colab, Scikit-learn, Pandas, Matplotlib, dataset de propiedades de Quito (proporcionado)",
    datosEjemplo:
      "Dataset: 800 propiedades en Quito. Variables: metros_cuadrados, habitaciones, banos, sector (norte/sur/centro/valles), año_construccion, precio_usd.",
    pasos: [
      "Paso 1 — Exploración inicial: Cargar el dataset con Pandas. Ejecutar df.info() y df.describe(). Identificar variables numéricas y categóricas. Verificar nulos y outliers con boxplot de precio_usd.",
      "Paso 2 — Preparación de datos: Manejar nulos (imputer o dropna según el caso). Codificar la variable categórica 'sector' con pd.get_dummies(). Separar features (X) de target (y=precio_usd).",
      "Paso 3 — Train/test split: Usar train_test_split con test_size=0.2 y random_state=42. Verificar tamaños: print(X_train.shape, X_test.shape). Documentar cuántos registros en cada conjunto.",
      "Paso 4 — Entrenar el modelo: Crear LinearRegression(). Llamar fit(X_train, y_train). Inspeccionar los coeficientes: ¿cuánto agrega cada metro cuadrado al precio? ¿Qué sector tiene mayor impacto?",
      "Paso 5 — Evaluar el modelo: Calcular R² con score(X_test, y_test). Calcular MAE y RMSE con mean_absolute_error y mean_squared_error de sklearn.metrics. Graficar valores reales vs predichos con Matplotlib.",
      "Paso 6 — Interpretar resultados: ¿Qué R² obtuviste? ¿Es aceptable para este problema? ¿Qué variables son más importantes? Identificar en qué rango de precios el modelo comete más errores.",
    ],
    resultado:
      "Notebook con modelo de regresión lineal entrenado, métricas de evaluación (R², MAE, RMSE) y gráfico de predicciones vs valores reales.",
    criterios: [
      { criterio: "Exploración completa con identificación de outliers y nulos documentada", puntos: 15 },
      { criterio: "Preparación correcta: codificación categórica y train/test split verificado", puntos: 20 },
      { criterio: "Modelo entrenado con coeficientes interpretados correctamente", puntos: 25 },
      { criterio: "Métricas calculadas (R², MAE, RMSE) con interpretación de qué significan", puntos: 25 },
      { criterio: "Gráfico de predicciones vs reales y conclusiones escritas", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Scikit-learn — Documentación oficial",
      url: "https://scikit-learn.org/stable/",
      tipo: "documentacion",
      descripcion: "Documentación completa de Scikit-learn con tutoriales, guías de usuario y referencia de API",
    },
    {
      titulo: "Scikit-learn — Getting Started",
      url: "https://scikit-learn.org/stable/getting_started.html",
      tipo: "documentacion",
      descripcion: "Tutorial de inicio rápido oficial de Scikit-learn con los conceptos fundamentales",
    },
    {
      titulo: "CRISP-DM — Guía del proceso estándar",
      url: "https://www.datascience-pm.com/crisp-dm-2/",
      tipo: "lectura",
      descripcion: "Explicación detallada del framework CRISP-DM para proyectos de ciencia de datos",
    },
    {
      titulo: "Google Colab — Entorno de ML gratuito con GPU",
      url: "https://colab.research.google.com/",
      tipo: "herramienta",
      descripcion: "Entorno Jupyter en la nube con acceso gratuito a GPU para entrenamiento de modelos",
    },
  ],
};

const tema2: TemaC5 = placeholder(2, "El pipeline de ML: datos, features y métricas de evaluación", "Conceptos de ML Aplicado", 1);
const tema3: TemaC5 = placeholder(3, "Preprocesamiento: escalado, encoding y manejo de nulos", "Conceptos de ML Aplicado", 1);
const tema4: TemaC5 = placeholder(4, "Validación cruzada y selección de hiperparámetros", "Conceptos de ML Aplicado", 1);

// ─── MÓDULO 2: REGRESIÓN Y CLASIFICACIÓN ─────────────────────────────────────

const tema5: TemaC5 = placeholder(5, "Regresión lineal y polinomial: predicción de valores continuos", "Regresión y Clasificación", 2);

const tema6: TemaC5 = {
  id: 6,
  titulo: "Árboles de decisión y Random Forest: clasificación con datos ecuatorianos",
  modulo: "Regresión y Clasificación",
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Random Forest: el mejor clasificador para datos tabulares en producción",
  videoDuracion: "26 min",
  teoria: `Los árboles de decisión son modelos que aprenden reglas de decisión jerárquicas a partir de los datos. Su mayor ventaja es la interpretabilidad: puedes visualizar el árbol y entender exactamente por qué el modelo clasifica un ejemplo de cierta manera. Esto los hace ideales para contextos regulados como el sector financiero ecuatoriano, donde se requiere explicar las decisiones de crédito.

Un árbol de decisión funciona dividiendo recursivamente el espacio de features según el criterio que maximiza la separación entre clases (Gini impurity o entropía de información). El problema es que los árboles profundos tienden a sobreajustarse (overfitting): memorizan el conjunto de entrenamiento pero generalizan mal.

Random Forest resuelve esto mediante el ensemble de árboles: entrena múltiples árboles de decisión con subconjuntos aleatorios de datos y features, y promedia sus predicciones. Esta técnica (bagging + feature randomness) reduce el sobreajuste drásticamente manteniendo la capacidad predictiva:

    from sklearn.ensemble import RandomForestClassifier
    from sklearn.tree import DecisionTreeClassifier
    from sklearn.metrics import classification_report, confusion_matrix

    # Árbol individual
    arbol = DecisionTreeClassifier(max_depth=5, random_state=42)
    arbol.fit(X_train, y_train)

    # Random Forest (ensemble)
    rf = RandomForestClassifier(n_estimators=100, max_depth=10,
                                 random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    y_pred = rf.predict(X_test)

    # Evaluación
    print(classification_report(y_test, y_pred))

En problemas de clasificación, la exactitud (accuracy) no es siempre la métrica correcta. En Ecuador, un modelo de detección de fraude bancario puede tener 99% de accuracy simplemente prediciendo "no fraude" siempre, porque el fraude real es el 1% de los casos. Las métricas relevantes son precisión (de los que el modelo dice que son fraude, ¿cuántos realmente lo son?), recall (de todos los fraudes reales, ¿cuántos detectó el modelo?) y F1-score (media armónica entre precisión y recall).

La importancia de features (feature_importance_) es uno de los outputs más valiosos de Random Forest: te dice qué variables tienen más impacto en las predicciones. En un modelo de predicción de abandono de clientes (churn), las features más importantes suelen ser: días desde la última compra, frecuencia de compra, monto promedio y número de reclamos. Esto guía las acciones de retención.

Casos de uso en Ecuador donde Random Forest tiene alto impacto: detección de fraude en tarjetas de crédito (Banco del Pacífico, Diners Club), predicción de incumplimiento en microcréditos (BanEcuador, EcuaFact), clasificación de riesgo en pólizas de seguros (Seguros Equinoccial, Chubb Ecuador), y detección de enfermedades agrícolas en cultivos de banano y cacao basada en imágenes.

Un pipeline completo con Scikit-learn encadena preprocesamiento y modelado en un objeto único, lo que previene data leakage (el error más frecuente en ML aplicado):

    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import StandardScaler

    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('modelo', RandomForestClassifier(n_estimators=100))
    ])
    pipeline.fit(X_train, y_train)
    pipeline.predict(X_test)`,
  presentacionSlides: [
    {
      titulo: "Árbol de decisión: cómo funciona",
      contenido:
        "Divide el espacio de features jerárquicamente. Criterio: minimizar Gini impurity o maximizar ganancia de información. Ventaja: interpretable. Limitación: overfitting en árboles profundos.",
    },
    {
      titulo: "Random Forest: fuerza en el ensemble",
      contenido:
        "100+ árboles entrenados con subconjuntos aleatorios de datos y features. Predicción final = votación mayoritaria. Reduce overfitting dramáticamente. Estándar industrial para datos tabulares.",
    },
    {
      titulo: "API en Scikit-learn",
      contenido:
        "RandomForestClassifier(n_estimators=100, max_depth=10). fit() + predict() + classification_report(). n_jobs=-1 usa todos los núcleos disponibles. random_state=42 para reproducibilidad.",
    },
    {
      titulo: "Métricas de clasificación: más allá de accuracy",
      contenido:
        "Accuracy: engaña en clases desbalanceadas. Precisión: ¿cuántos positivos predichos son reales? Recall: ¿cuántos positivos reales detectamos? F1: balance entre ambos. Matriz de confusión: la imagen completa.",
    },
    {
      titulo: "Feature importance: qué explica el modelo",
      contenido:
        "rf.feature_importances_: ranking de variables por impacto. Guía acciones de negocio: si 'días_sin_compra' es la feature más importante en churn, ahí está la palanca de retención.",
    },
    {
      titulo: "Casos de uso en Ecuador",
      contenido:
        "Fraude bancario: Banco del Pacífico, Diners Club. Microcrédito: BanEcuador. Seguros: Equinoccial, Chubb. Agro: detección plagas en banano y cacao. Todos en producción.",
    },
    {
      titulo: "Pipeline: prevenir data leakage",
      contenido:
        "Pipeline([('scaler', StandardScaler()), ('modelo', RandomForestClassifier())]). Encadena preprocesamiento + modelo. Previene filtrar información del test al entrenamiento — el error más caro en ML.",
    },
    {
      titulo: "Gradient Boosting: el siguiente paso",
      contenido:
        "XGBoost, LightGBM, CatBoost: ensembles secuenciales que corrigen errores del modelo anterior. Ganadores de Kaggle. Más poderosos que RF pero menos interpretables. Próximo tema.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la principal limitación de un árbol de decisión profundo?",
      opciones: [
        "Es muy lento de entrenar",
        "No puede manejar variables categóricas",
        "Tiende a sobreajustarse (overfitting) y memorizar el conjunto de entrenamiento",
        "Solo funciona con datos balanceados",
      ],
      respuesta: 2,
      explicacion:
        "Los árboles profundos memorizan el conjunto de entrenamiento (overfitting) y generalizan mal a datos nuevos. Random Forest resuelve esto con bagging y aleatorización de features.",
    },
    {
      pregunta: "¿Por qué accuracy puede ser engañosa en detección de fraude bancario en Ecuador?",
      opciones: [
        "Porque los bancos no permiten usar accuracy como métrica",
        "Porque si el fraude es 1% de los casos, un modelo que predice siempre 'no fraude' tiene 99% de accuracy",
        "Porque accuracy solo funciona con regresión",
        "Porque los datos de fraude son confidenciales",
      ],
      respuesta: 1,
      explicacion:
        "En clases desbalanceadas, accuracy es engañosa. Un modelo trivial que ignora el fraude obtiene 99% de accuracy. Las métricas correctas son precisión, recall y F1 sobre la clase minoritaria (fraude).",
    },
    {
      pregunta: "¿Qué atributo de RandomForestClassifier muestra qué variables tienen más impacto en las predicciones?",
      opciones: [
        "rf.coef_",
        "rf.feature_importances_",
        "rf.variable_weights_",
        "rf.feature_scores_",
      ],
      respuesta: 1,
      explicacion:
        "feature_importances_ es un array con la importancia relativa de cada feature. La suma total es 1. Permite identificar qué variables realmente impulsan las predicciones del modelo.",
    },
    {
      pregunta: "¿Cuál es el propósito principal de usar un Pipeline de Scikit-learn?",
      opciones: [
        "Hacer el código más corto",
        "Prevenir data leakage encadenando preprocesamiento y modelo en un solo objeto",
        "Acelerar el entrenamiento usando múltiples CPU",
        "Guardar el modelo en disco automáticamente",
      ],
      respuesta: 1,
      explicacion:
        "El Pipeline asegura que el preprocesamiento (escalado, encoding) se aprende SOLO con datos de entrenamiento y se aplica al test. Sin pipeline, es fácil filtrar información del test al entrenamiento (data leakage), que invalida toda la evaluación.",
    },
    {
      pregunta: "¿Qué parámetro de RandomForestClassifier controla cuántos árboles se entrenan?",
      opciones: ["max_depth", "n_jobs", "n_estimators", "random_state"],
      respuesta: 2,
      explicacion:
        "n_estimators define cuántos árboles de decisión forman el bosque. Más árboles = mejor generalización hasta cierto punto, pero mayor tiempo de entrenamiento. 100-500 es el rango típico en producción.",
    },
  ],
  ejercicio: {
    titulo: "Predicción de churn de clientes con Random Forest",
    objetivo:
      "Construir un modelo de clasificación para predecir qué clientes de una empresa ecuatoriana abandonarán el servicio en los próximos 30 días.",
    herramientas:
      "Google Colab, Scikit-learn, Pandas, Seaborn, dataset de churn de empresa de telecomunicaciones ecuatoriana",
    datosEjemplo:
      "Dataset: 5,000 clientes de una operadora móvil. Variables: meses_cliente, plan (prepago/postpago), uso_datos_gb, llamadas_mes, reclamos_ultimo_trimestre, dias_ultimo_pago, churn (0/1).",
    pasos: [
      "Paso 1 — EDA de churn: Cargar datos y explorar. Calcular la tasa de churn del dataset. Visualizar con seaborn la distribución de cada variable según churn (0 vs 1) usando sns.boxplot o sns.histplot con hue='churn'.",
      "Paso 2 — Preprocesamiento: Codificar 'plan' con pd.get_dummies(). Verificar nulos y manejarlos. Separar X e y. Aplicar train_test_split con stratify=y para preservar la proporción de churn en ambos conjuntos.",
      "Paso 3 — Árbol de decisión base: Entrenar DecisionTreeClassifier(max_depth=5). Evaluar con classification_report(). Visualizar la matriz de confusión con ConfusionMatrixDisplay. Anotar precisión y recall para la clase churn=1.",
      "Paso 4 — Random Forest: Entrenar RandomForestClassifier(n_estimators=200, random_state=42). Evaluar con las mismas métricas. Comparar en tabla: Árbol vs Random Forest en precisión, recall y F1 para churn=1.",
      "Paso 5 — Feature importance: Extraer y visualizar feature_importances_ con un gráfico de barras horizontales ordenado. Identificar las 3 variables más predictivas del churn. ¿Tienen sentido de negocio?",
      "Paso 6 — Umbral de decisión: Por defecto, el modelo predice churn si probabilidad > 0.5. Probar con umbral = 0.3 usando predict_proba y comparar recall. Documentar: ¿qué umbral preferiría la empresa y por qué?",
    ],
    resultado:
      "Modelo Random Forest entrenado con métricas de clasificación, comparación con árbol base, gráfico de feature importance y análisis del impacto del umbral de decisión.",
    criterios: [
      { criterio: "EDA con visualizaciones que muestran diferencias entre clientes churn y no-churn", puntos: 15 },
      { criterio: "Preprocesamiento correcto con stratify en el split y manejo de categóricas", puntos: 15 },
      { criterio: "Comparación árbol vs Random Forest con métricas completas (precisión, recall, F1)", puntos: 25 },
      { criterio: "Feature importance visualizado e interpretado con lógica de negocio", puntos: 25 },
      { criterio: "Análisis de umbral de decisión con justificación de negocio", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "Scikit-learn — Random Forest",
      url: "https://scikit-learn.org/stable/modules/ensemble.html#forests-of-randomized-trees",
      tipo: "documentacion",
      descripcion: "Documentación oficial de Random Forest en Scikit-learn con parámetros y ejemplos",
    },
    {
      titulo: "Scikit-learn — Métricas de clasificación",
      url: "https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics",
      tipo: "documentacion",
      descripcion: "Guía completa de métricas de clasificación: precisión, recall, F1, ROC-AUC",
    },
    {
      titulo: "Towards Data Science — Understanding Random Forest",
      url: "https://towardsdatascience.com/understanding-random-forest-58381e0602d2",
      tipo: "lectura",
      descripcion: "Explicación intuitiva del algoritmo Random Forest con visualizaciones",
    },
    {
      titulo: "XGBoost — Documentación oficial",
      url: "https://xgboost.readthedocs.io/en/stable/",
      tipo: "documentacion",
      descripcion: "Documentación de XGBoost, el algoritmo de gradient boosting más usado en competencias",
    },
  ],
};

const tema7: TemaC5 = placeholder(7, "Regresión logística y SVM: cuando el límite es lineal", "Regresión y Clasificación", 2);
const tema8: TemaC5 = placeholder(8, "XGBoost y LightGBM: gradient boosting en producción", "Regresión y Clasificación", 2);

// ─── MÓDULO 3: CLUSTERING Y REDUCCIÓN DIMENSIONAL ────────────────────────────

const tema9: TemaC5 = placeholder(9, "K-Means clustering: segmentación de clientes y mercados", "Clustering y Reducción Dimensional", 3);
const tema10: TemaC5 = placeholder(10, "Clustering jerárquico y DBSCAN: detectar grupos sin definir K", "Clustering y Reducción Dimensional", 3);

const tema11: TemaC5 = {
  id: 11,
  titulo: "PCA y t-SNE: reducción dimensional para visualizar y mejorar modelos",
  modulo: "Clustering y Reducción Dimensional",
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "PCA y t-SNE: ver lo invisible en datos de alta dimensión",
  videoDuracion: "23 min",
  teoria: `La reducción dimensional es el proceso de transformar datos de alta dimensión (muchas variables) en una representación de menor dimensión que preserva la información más importante. Es una de las técnicas más poderosas y menos enseñadas en cursos de ML introductorios, aunque tiene aplicaciones directas en empresas ecuatorianas con muchas variables.

El problema de la alta dimensionalidad: con más de 20-30 variables, los algoritmos de ML tienden a degradarse (la "maldición de la dimensionalidad"), las visualizaciones se vuelven imposibles, y el riesgo de overfitting aumenta. Reducir dimensiones antes de entrenar modelos frecuentemente mejora el rendimiento.

PCA (Principal Component Analysis) es la técnica de reducción dimensional más usada. Encuentra las direcciones de máxima varianza en los datos y proyecta los datos originales sobre esas direcciones. Los componentes principales son combinaciones lineales de las variables originales, ordenadas por la varianza que explican:

    from sklearn.decomposition import PCA
    from sklearn.preprocessing import StandardScaler
    import matplotlib.pyplot as plt

    # SIEMPRE escalar antes de PCA
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Determinar cuántos componentes necesitamos
    pca_full = PCA()
    pca_full.fit(X_scaled)

    # Gráfico de varianza explicada acumulada
    varianza_acumulada = pca_full.explained_variance_ratio_.cumsum()
    plt.plot(varianza_acumulada)
    plt.axhline(y=0.95, color='r', linestyle='--', label='95% varianza')
    plt.xlabel('Número de componentes')
    plt.ylabel('Varianza explicada acumulada')
    plt.title('Cuántos componentes necesitamos')

    # Reducir a 2 componentes para visualización
    pca_2d = PCA(n_components=2)
    X_2d = pca_2d.fit_transform(X_scaled)

En el contexto ecuatoriano, PCA es especialmente útil para datos del INEC que tienen decenas de variables socioeconómicas por parroquia: ingreso, educación, salud, vivienda, servicios básicos. Con PCA, estas decenas de variables se pueden reducir a 2-3 componentes que explican el 80-90% de la varianza, y visualizar en un gráfico de dispersión 2D que muestra la "topografía socioeconómica" del Ecuador.

t-SNE (t-Distributed Stochastic Neighbor Embedding) es una técnica no lineal más poderosa para visualización. Mientras PCA preserva distancias globales, t-SNE preserva las relaciones de vecindad local, lo que produce visualizaciones más intuitivas de clusters:

    from sklearn.manifold import TSNE

    # t-SNE solo para visualización, no como preprocesamiento de ML
    tsne = TSNE(n_components=2, perplexity=30, random_state=42, n_iter=1000)
    X_tsne = tsne.fit_transform(X_scaled)

Importante: t-SNE es computacionalmente costoso y sus resultados dependen de hiperparámetros como perplexity. Se usa principalmente para exploración y visualización, NO como preprocesamiento de modelos predictivos (PCA es mejor para eso).

UMAP (Uniform Manifold Approximation and Projection) es la alternativa moderna a t-SNE: más rápido, más estable y más fiel a la estructura global de los datos. En 2024, UMAP está reemplazando a t-SNE en la mayoría de los pipelines de producción.

Aplicación directa en Ecuador: analizar los datos del Censo 2022 con PCA para identificar qué combinación de variables socioeconómicas distingue mejor a las parroquias ricas de las pobres, o qué dimensiones explican la brecha entre la Sierra y la Costa.`,
  presentacionSlides: [
    {
      titulo: "La maldición de la dimensionalidad",
      contenido:
        "Con 30+ variables: algoritmos degradan, visualización imposible, overfitting aumenta. Solución: reducción dimensional antes de entrenar. Paradoja: menos variables, mejor modelo.",
    },
    {
      titulo: "PCA: máxima varianza en mínimas dimensiones",
      contenido:
        "Componentes principales = combinaciones lineales de variables originales, ordenadas por varianza explicada. Regla práctica: reducir hasta explicar 95% de varianza acumulada.",
    },
    {
      titulo: "PCA en Scikit-learn: el flujo correcto",
      contenido:
        "SIEMPRE: StandardScaler() antes de PCA. PCA() para encontrar número de componentes. PCA(n_components=K) para reducir. Visualizar varianza acumulada con gráfico de codo.",
    },
    {
      titulo: "Caso Ecuador: topografía socioeconómica del Censo 2022",
      contenido:
        "50+ variables por parroquia (INEC). PCA reduce a 2 componentes que explican 82% de varianza. Resultado: mapa 2D donde cada punto es una parroquia, color = quintil de ingreso.",
    },
    {
      titulo: "t-SNE: preservar vecindad local para visualización",
      contenido:
        "Técnica no lineal. Preserva clusters locales mejor que PCA. Parámetro clave: perplexity (5-50). Limitación: lento, no reproducible entre corridas, solo para visualización.",
    },
    {
      titulo: "UMAP: el sucesor de t-SNE en producción",
      contenido:
        "Más rápido que t-SNE. Más fiel a estructura global. Reproducible. Funciona como preprocesamiento para clustering. Estándar en bioinformática y análisis de texto 2024.",
    },
    {
      titulo: "PCA como preprocesamiento de ML",
      contenido:
        "Pipeline: StandardScaler → PCA(n_components=0.95) → RandomForest. Ventajas: elimina multicolinealidad, reduce overfitting, acelera entrenamiento. Desventaja: pierde interpretabilidad.",
    },
    {
      titulo: "Cuándo usar cada técnica",
      contenido:
        "PCA: preprocesamiento de ML, reducir multicolinealidad, visualización inicial. t-SNE: exploración visual de clusters. UMAP: reemplaza t-SNE en producción. Siempre escalar antes.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Por qué es obligatorio aplicar StandardScaler antes de PCA?",
      opciones: [
        "Para que el código funcione sin errores",
        "Porque PCA es sensible a la escala: variables con mayor magnitud dominan los componentes si no se escala",
        "Para reducir el tiempo de procesamiento",
        "Porque Scikit-learn lo exige en su API",
      ],
      respuesta: 1,
      explicacion:
        "PCA busca la dirección de máxima varianza. Si una variable está en miles (ingreso) y otra en unidades (número de hijos), la primera dominará sin importar su relevancia real. Escalar asegura que todas las variables tengan igual peso inicial.",
    },
    {
      pregunta: "¿Qué porcentaje de varianza acumulada se usa típicamente como criterio para elegir el número de componentes PCA?",
      opciones: ["50%", "75%", "95%", "100%"],
      respuesta: 2,
      explicacion:
        "El 95% de varianza explicada es el criterio más común: asegura que se preserva la mayoría de la información relevante mientras se logra una reducción significativa de dimensiones.",
    },
    {
      pregunta: "¿Para qué tipo de análisis es más apropiado t-SNE?",
      opciones: [
        "Como preprocesamiento de modelos predictivos de producción",
        "Visualización exploratoria de clusters en 2D",
        "Reducción de multicolinealidad en regresión",
        "Aceleración del entrenamiento de redes neuronales",
      ],
      respuesta: 1,
      explicacion:
        "t-SNE es excelente para visualización exploratoria porque preserva relaciones de vecindad local, haciendo los clusters visualmente claros. NO se recomienda como preprocesamiento de ML por su costo computacional y falta de reproducibilidad.",
    },
    {
      pregunta: "¿Cuál es la principal ventaja de UMAP sobre t-SNE?",
      opciones: [
        "UMAP es más fácil de instalar",
        "UMAP es más rápido, reproducible y más fiel a la estructura global de los datos",
        "UMAP no requiere escalar los datos",
        "UMAP siempre produce mejores visualizaciones",
      ],
      respuesta: 1,
      explicacion:
        "UMAP combina velocidad (mucho más rápido que t-SNE en grandes datasets), reproducibilidad (mismo resultado con mismo random_state) y mejor preservación de la estructura global además de la local.",
    },
    {
      pregunta: "En un Pipeline de Scikit-learn con PCA, ¿cuál es el orden correcto?",
      opciones: [
        "PCA → StandardScaler → Modelo",
        "Modelo → PCA → StandardScaler",
        "StandardScaler → PCA → Modelo",
        "PCA → Modelo → StandardScaler",
      ],
      respuesta: 2,
      explicacion:
        "El orden correcto es: StandardScaler (escalar) → PCA (reducir dimensiones) → Modelo (predecir). PCA requiere datos escalados, y el modelo trabaja con los componentes ya reducidos.",
    },
  ],
  ejercicio: {
    titulo: "Análisis socioeconómico de parroquias ecuatorianas con PCA y t-SNE",
    objetivo:
      "Aplicar reducción dimensional para visualizar y analizar los patrones socioeconómicos de las parroquias del Ecuador usando datos del Censo 2022.",
    herramientas:
      "Google Colab, Scikit-learn (PCA, TSNE), Pandas, Matplotlib, Plotly, datos INEC Censo 2022 (muestra de 500 parroquias, proporcionada)",
    datosEjemplo:
      "Dataset: 500 parroquias ecuatorianas. Variables (15): ingreso_promedio, tasa_pobreza, escolaridad_años, acceso_agua, acceso_electricidad, acceso_internet, hacinamiento, desempleo, poblacion, area_km2, altitud, region (Costa/Sierra/Amazonia), provincia.",
    pasos: [
      "Paso 1 — Preparación: Cargar datos de parroquias. Separar variables numéricas (12 variables) de categóricas (region, provincia). Verificar nulos y escalar con StandardScaler. Documentar qué variables se incluyen en PCA.",
      "Paso 2 — PCA exploratoria: Ejecutar PCA() completo. Graficar la varianza explicada acumulada. Identificar cuántos componentes son necesarios para alcanzar el 90% y el 95% de varianza.",
      "Paso 3 — PCA 2D: Reducir a 2 componentes. Crear scatter plot con Plotly donde x=PC1, y=PC2, color=region (Costa/Sierra/Amazonia). ¿Se separan las regiones en el espacio de componentes principales?",
      "Paso 4 — Interpretar componentes: Visualizar el loading plot: qué variables contribuyen más a PC1 y PC2. ¿PC1 representa nivel de desarrollo? ¿PC2 representa algo más? Argumentar la interpretación.",
      "Paso 5 — t-SNE: Aplicar TSNE(n_components=2, perplexity=30) sobre los datos escalados. Crear scatter plot coloreado por region. Comparar visualmente con el PCA 2D: ¿cuál muestra mejor separación de clusters?",
      "Paso 6 — Insights de negocio: Identificar las 5 parroquias más similares a Quito en el espacio PCA (distancia euclidiana al punto de Quito). ¿Qué variables explican esa similitud? ¿Tiene implicaciones para políticas públicas o decisiones de inversión?",
    ],
    resultado:
      "Notebook con análisis PCA y t-SNE completo, visualizaciones interactivas Plotly, interpretación de componentes y mínimo 3 insights concretos sobre la geografía socioeconómica ecuatoriana.",
    criterios: [
      { criterio: "Preparación correcta con escalado y selección justificada de variables", puntos: 15 },
      { criterio: "Gráfico de varianza acumulada con número de componentes elegido y justificado", puntos: 15 },
      { criterio: "Scatter PCA 2D y t-SNE interactivos con coloreo por región", puntos: 25 },
      { criterio: "Interpretación del loading plot: qué significa PC1 y PC2", puntos: 25 },
      { criterio: "3 insights de negocio/política pública derivados del análisis dimensional", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "Scikit-learn — PCA documentación",
      url: "https://scikit-learn.org/stable/modules/decomposition.html#pca",
      tipo: "documentacion",
      descripcion: "Documentación oficial de PCA en Scikit-learn con ejemplos y guía matemática",
    },
    {
      titulo: "Scikit-learn — t-SNE documentación",
      url: "https://scikit-learn.org/stable/modules/manifold.html#t-sne",
      tipo: "documentacion",
      descripcion: "Documentación oficial de t-SNE con parámetros, limitaciones y ejemplos",
    },
    {
      titulo: "UMAP — Documentación oficial",
      url: "https://umap-learn.readthedocs.io/en/latest/",
      tipo: "documentacion",
      descripcion: "Documentación de UMAP, el sucesor de t-SNE con mejor rendimiento y reproducibilidad",
    },
    {
      titulo: "INEC — Datos del Censo 2022 por parroquia",
      url: "https://www.ecuadorencifras.gob.ec/censo-de-poblacion-y-vivienda/",
      tipo: "herramienta",
      descripcion: "Microdatos del Censo de Población y Vivienda 2022 con variables socioeconómicas por parroquia",
    },
  ],
};

const tema12: TemaC5 = placeholder(12, "Detección de anomalías: Isolation Forest y Autoencoder", "Clustering y Reducción Dimensional", 3);

// ─── MÓDULO 4: DEPLOY DE MODELOS EN PRODUCCIÓN ───────────────────────────────

const tema13: TemaC5 = placeholder(13, "Guardar y cargar modelos: joblib, pickle y ONNX", "Deploy de Modelos en Producción", 4);
const tema14: TemaC5 = placeholder(14, "Construir una API REST con FastAPI para servir modelos ML", "Deploy de Modelos en Producción", 4);
const tema15: TemaC5 = placeholder(15, "Deploy en la nube: AWS SageMaker y Google Vertex AI", "Deploy de Modelos en Producción", 4);

const tema16: TemaC5 = {
  id: 16,
  titulo: "Proyecto final: pipeline completo de ML en producción para una empresa ecuatoriana",
  modulo: "Deploy de Modelos en Producción",
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Del Colab al servidor: pipeline de ML completo en producción",
  videoDuracion: "30 min",
  teoria: `El proyecto final del curso integra todo el flujo de ML: desde la comprensión del problema de negocio hasta un modelo funcionando en producción que cualquier usuario puede consultar a través de una API. Esta es la habilidad que diferencia a un ML Engineer de alguien que solo entrena modelos en Jupyter notebooks.

MLOps (Machine Learning Operations) es la disciplina que aplica principios de DevOps al ciclo de vida de modelos de ML. Los tres pilares son: reproducibilidad (cualquier persona puede recrear el modelo con los mismos resultados), monitoreo (el modelo en producción es evaluado continuamente para detectar degradación) y automatización (el reentrenamiento se dispara automáticamente cuando la performance cae).

Un pipeline completo de ML en producción tiene estas etapas:

    # 1. Preprocesamiento como objeto persistente
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import StandardScaler
    from sklearn.ensemble import RandomForestClassifier
    import joblib

    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('modelo', RandomForestClassifier(n_estimators=200, random_state=42))
    ])
    pipeline.fit(X_train, y_train)

    # 2. Guardar el pipeline completo (preprocesador + modelo)
    joblib.dump(pipeline, 'modelo_churn_v1.pkl')

    # 3. Cargar y predecir en producción
    pipeline_prod = joblib.load('modelo_churn_v1.pkl')
    prediccion = pipeline_prod.predict(nuevos_datos)
    probabilidad = pipeline_prod.predict_proba(nuevos_datos)[:, 1]

Para servir el modelo como API REST con FastAPI:

    from fastapi import FastAPI
    from pydantic import BaseModel
    import joblib
    import pandas as pd

    app = FastAPI(title="API Predicción Churn Ecuador")
    modelo = joblib.load("modelo_churn_v1.pkl")

    class DatosCliente(BaseModel):
        meses_cliente: int
        plan: str
        uso_datos_gb: float
        llamadas_mes: int
        reclamos_ultimo_trimestre: int

    @app.post("/predecir")
    def predecir_churn(datos: DatosCliente):
        df = pd.DataFrame([datos.dict()])
        prob = modelo.predict_proba(df)[0][1]
        return {"probabilidad_churn": round(float(prob), 4),
                "riesgo": "Alto" if prob > 0.6 else "Medio" if prob > 0.3 else "Bajo"}

Para el contexto ecuatoriano, los casos de deploy más frecuentes son: API de scoring de crédito integrada al core bancario (conecta con Misys o Temenos), API de predicción de demanda integrada al ERP (SAP, Oracle), y scripts de batch scoring que corren cada noche actualizando una tabla en PostgreSQL con los scores más recientes de todos los clientes.

El monitoreo del modelo en producción es crítico. Los modelos se degradan porque el mundo cambia: los patrones de comportamiento del consumidor ecuatoriano en 2024 son diferentes a los de 2022, especialmente post-pandemia. Las métricas de monitoreo incluyen: data drift (¿las distribuciones de las variables de entrada están cambiando?), concept drift (¿la relación entre features y target está cambiando?) y performance degradation (¿las métricas de evaluación están bajando?).

MLflow es la herramienta open source estándar para tracking de experimentos y versionado de modelos. Permite comparar múltiples experimentos, registrar métricas, parámetros y artefactos, y manejar el ciclo de vida del modelo (Staging → Production → Archived).`,
  presentacionSlides: [
    {
      titulo: "Del notebook al servidor: el gap más grande en ML",
      contenido:
        "El 85% de los modelos de ML nunca llegan a producción. El gap: un modelo en Colab vs un sistema que procesa miles de requests. MLOps es el puente entre ciencia de datos e ingeniería de software.",
    },
    {
      titulo: "Los 3 pilares de MLOps",
      contenido:
        "Reproducibilidad: cualquiera puede recrear el modelo. Monitoreo: detectar degradación en producción. Automatización: reentrenamiento automático cuando performance cae.",
    },
    {
      titulo: "Pipeline completo con joblib",
      contenido:
        "Pipeline(scaler + modelo). fit() una vez. joblib.dump() para guardar todo. joblib.load() en producción. Ventaja: el preprocesador y el modelo viajan juntos, no hay desincronización.",
    },
    {
      titulo: "FastAPI: API REST en 20 líneas",
      contenido:
        "@app.post('/predecir'). Pydantic para validar inputs. predict_proba() para probabilidades. Respuesta: JSON con probabilidad y clasificación de riesgo. Documentación automática en /docs.",
    },
    {
      titulo: "Casos de deploy en Ecuador",
      contenido:
        "API scoring de crédito → core bancario (Misys/Temenos). API predicción demanda → ERP (SAP/Oracle). Batch scoring nocturno → PostgreSQL con scores de todos los clientes.",
    },
    {
      titulo: "Data drift y concept drift: por qué los modelos se degradan",
      contenido:
        "Data drift: distribuciones de entrada cambian (post-pandemia). Concept drift: relación feature→target cambia (inflación 2023 Ecuador). Monitorear mensualmente. Reentrenar cuando F1 cae >5%.",
    },
    {
      titulo: "MLflow: versionado y tracking de experimentos",
      contenido:
        "mlflow.log_metric(), log_param(), log_artifact(). Model Registry: Staging → Production → Archived. Comparar 20 experimentos en 1 tabla. Estándar open source de la industria.",
    },
    {
      titulo: "Rúbrica del proyecto final",
      contenido:
        "Pipeline guardado con joblib (20%). API FastAPI funcional (25%). Documentación y README (15%). Métricas de evaluación con interpretación de negocio (20%). Demo en vivo o video (20%).",
    },
  ],
  quiz: [
    {
      pregunta: "¿Por qué es preferible guardar el Pipeline completo (preprocesador + modelo) en lugar de solo el modelo?",
      opciones: [
        "Porque el archivo resultante es más pequeño",
        "Porque evita desincronización: el mismo escalado aprendido en entrenamiento se aplica en producción automáticamente",
        "Porque FastAPI solo acepta Pipelines, no modelos individuales",
        "Porque es más rápido de cargar",
      ],
      respuesta: 1,
      explicacion:
        "Si guardas solo el modelo, debes recrear manualmente el escalado en producción usando los mismos parámetros. Si hay discrepancia (usar StandardScaler con media/std diferentes), las predicciones serán incorrectas. El Pipeline garantiza consistencia automática.",
    },
    {
      pregunta: "¿Qué es data drift en el monitoreo de modelos ML?",
      opciones: [
        "Un error en el código de preprocesamiento que cambia los datos",
        "El cambio en las distribuciones de las variables de entrada a lo largo del tiempo",
        "La diferencia entre datos de entrenamiento y datos de test",
        "La corrupción de datos en la base de datos de producción",
      ],
      respuesta: 1,
      explicacion:
        "Data drift ocurre cuando la distribución estadística de las variables de entrada cambia después del despliegue. Por ejemplo, el uso de datos móviles en Ecuador aumentó drásticamente post-pandemia, afectando modelos de scoring entrenados antes de 2020.",
    },
    {
      pregunta: "¿Cuál es la función de Pydantic en una API FastAPI que sirve un modelo ML?",
      opciones: [
        "Acelerar las predicciones del modelo",
        "Conectarse a la base de datos de producción",
        "Definir y validar automáticamente el esquema de los datos de entrada",
        "Serializar el modelo en formato ONNX",
      ],
      respuesta: 2,
      explicacion:
        "Pydantic valida que los datos enviados a la API tengan el tipo correcto y los campos requeridos. Si alguien envía texto donde se espera un número, Pydantic retorna un error descriptivo antes de que el modelo intente predecir.",
    },
    {
      pregunta: "¿Qué herramienta open source se usa para tracking de experimentos y versionado de modelos ML?",
      opciones: ["Airflow", "MLflow", "Kubernetes", "Docker"],
      respuesta: 1,
      explicacion:
        "MLflow es el estándar open source de la industria para tracking de experimentos (métricas, parámetros, artefactos) y gestión del ciclo de vida de modelos (Staging, Production, Archived).",
    },
    {
      pregunta: "¿Cuándo se recomienda reentrenar un modelo en producción?",
      opciones: [
        "Cada semana, independientemente del rendimiento",
        "Solo cuando el cliente reporta predicciones incorrectas",
        "Cuando las métricas de evaluación caen por debajo del umbral definido o se detecta drift significativo",
        "Una vez al año en revisión anual",
      ],
      respuesta: 2,
      explicacion:
        "El reentrenamiento debe ser disparado por evidencia: caída de métricas (ej. F1 baja más del 5%) o detección de data/concept drift significativo. Sin umbrales definidos, el reentrenamiento puede ser innecesario o tardío.",
    },
  ],
  ejercicio: {
    titulo: "Pipeline de ML en producción: API de predicción de riesgo crediticio",
    objetivo:
      "Construir un pipeline completo de ML: desde el entrenamiento con datos ecuatorianos hasta una API FastAPI funcional con documentación y monitoreo básico.",
    herramientas:
      "Google Colab para entrenamiento, VS Code para API, FastAPI, joblib, Pydantic, dataset de microcréditos BanEcuador (anonimizado, proporcionado)",
    datosEjemplo:
      "Dataset: 3,000 microcréditos otorgados en Ecuador 2021-2023. Variables: monto_credito, plazo_meses, ingreso_declarado, sector_economico, provincia, edad, experiencia_negocio_años, garantia_tipo, incumplimiento (0/1).",
    pasos: [
      "Paso 1 — Entrenamiento: Cargar datos en Colab. Hacer EDA y preprocesamiento completo. Entrenar al menos 2 modelos (Logistic Regression + Random Forest). Evaluar con classification_report. Elegir el mejor modelo con justificación.",
      "Paso 2 — Pipeline y serialización: Crear Pipeline(StandardScaler + mejor_modelo). Entrenar con todos los datos disponibles (no solo train). Guardar con joblib.dump('modelo_credito_v1.pkl'). Verificar que el archivo se guardó correctamente cargándolo y haciendo 1 predicción de prueba.",
      "Paso 3 — API FastAPI: Crear archivo main.py con FastAPI. Definir el modelo Pydantic con todas las variables de entrada. Implementar el endpoint POST /predecir que cargue el modelo, haga la predicción y retorne probabilidad de incumplimiento + clasificación de riesgo (Alto/Medio/Bajo) + límite de crédito recomendado.",
      "Paso 4 — Documentación automática: Correr uvicorn main:app --reload. Abrir localhost:8000/docs. Hacer una predicción desde la interfaz Swagger. Capturar screenshot de la documentación automática.",
      "Paso 5 — Monitoreo básico: Agregar un endpoint GET /metricas que retorne: número total de predicciones realizadas, distribución de riesgo (Alto/Medio/Bajo en %), timestamp de última predicción. Implementar con un diccionario en memoria.",
      "Paso 6 — README y demo: Escribir un README.md con: descripción del modelo, cómo instalarlo, cómo correrlo, ejemplo de request/response en JSON. Grabar un video de 3 minutos mostrando el modelo entrenando, la API corriendo y una predicción real.",
    ],
    resultado:
      "Pipeline guardado en .pkl, API FastAPI funcional con documentación Swagger automática, endpoint de métricas y README completo. Video demo de 3 minutos.",
    criterios: [
      { criterio: "Comparación de 2+ modelos con elección justificada por métricas de negocio (no solo accuracy)", puntos: 20 },
      { criterio: "Pipeline correctamente serializado con prueba de carga y predicción", puntos: 20 },
      { criterio: "API FastAPI funcional con validación Pydantic y 3 clasificaciones de riesgo", puntos: 25 },
      { criterio: "Endpoint de métricas funcionando con distribución de predicciones", puntos: 15 },
      { criterio: "README completo y video demo de 3 minutos mostrando flujo end-to-end", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "FastAPI — Documentación oficial",
      url: "https://fastapi.tiangolo.com/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de FastAPI para construir APIs REST con Python en minutos",
    },
    {
      titulo: "MLflow — Documentación oficial",
      url: "https://mlflow.org/docs/latest/index.html",
      tipo: "documentacion",
      descripcion: "Documentación de MLflow para tracking de experimentos, modelo registry y deploy",
    },
    {
      titulo: "Scikit-learn — Persistencia de modelos",
      url: "https://scikit-learn.org/stable/model_persistence.html",
      tipo: "documentacion",
      descripcion: "Guía oficial para guardar y cargar modelos Scikit-learn con joblib y pickle",
    },
    {
      titulo: "Google Cloud — Vertex AI para deploy de ML",
      url: "https://cloud.google.com/vertex-ai/docs",
      tipo: "documentacion",
      descripcion: "Plataforma de ML de Google Cloud con capa gratuita para experimentación y deploy",
    },
  ],
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const C5_TEMAS: TemaC5[] = [
  tema1,  tema2,  tema3,  tema4,
  tema5,  tema6,  tema7,  tema8,
  tema9,  tema10, tema11, tema12,
  tema13, tema14, tema15, tema16,
];
