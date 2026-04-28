// ─── C4: Python para Análisis de Datos — Datos de 16 temas ──────────────────
// Curso C4 del programa MDT. 16 temas (scaffolding).
// Módulo 1: Python básico para datos
// Módulo 2: Pandas y datasets reales de Ecuador
// Módulo 3: Visualización con Matplotlib y Plotly
// Módulo 4: Storytelling con datos

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

export interface TemaC4 {
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

export const C4_MODULOS = [
  { num: 1, nombre: "Python Básico para Datos", horas: 15, temas: 4 },
  { num: 2, nombre: "Pandas y Datasets Ecuador", horas: 15, temas: 4 },
  { num: 3, nombre: "Visualización con Matplotlib y Plotly", horas: 15, temas: 4 },
  { num: 4, nombre: "Storytelling con Datos", horas: 15, temas: 4 },
];

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC4 => ({
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

// ─── MÓDULO 1: PYTHON BÁSICO PARA DATOS ──────────────────────────────────────

const tema1: TemaC4 = {
  id: 1,
  titulo: "Variables, listas y funciones en Python",
  modulo: "Python Básico para Datos",
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Python desde cero: variables, listas y funciones para análisis de datos",
  videoDuracion: "22 min",
  teoria: `Python es el lenguaje de programación más utilizado en ciencia de datos por tres razones concretas: sintaxis legible similar al inglés, una biblioteca estándar extensa y un ecosistema de paquetes (NumPy, Pandas, Matplotlib, Scikit-learn) que resuelve el 95% de los problemas de análisis de datos sin reinventar la rueda.

En Ecuador, Python también está ganando terreno en el sector financiero (Banco Pichincha, Produbanco), en instituciones públicas (INEC, BCE) y en startups de tecnología. Aprender Python hoy es equivalente a aprender Excel hace 20 años — quien lo domina tiene ventaja competitiva real en el mercado laboral ecuatoriano.

Las variables en Python almacenan datos sin necesidad de declarar el tipo explícitamente. Python infiere el tipo automáticamente:

    precio = 45.50          # float (número decimal)
    producto = "arroz"      # str (texto)
    en_stock = True         # bool (verdadero/falso)
    cantidad = 120          # int (número entero)

Las listas son colecciones ordenadas de elementos, y son la estructura más usada en análisis inicial de datos. Permiten almacenar múltiples valores en una sola variable:

    ventas_enero = [1200, 3400, 890, 2100, 4500]
    ciudades = ["Quito", "Guayaquil", "Cuenca", "Ambato"]

    # Acceso por índice (empieza en 0)
    print(ciudades[0])     # "Quito"
    print(ventas_enero[-1]) # 4500 (último elemento)

    # Operaciones útiles
    total = sum(ventas_enero)     # 12090
    promedio = total / len(ventas_enero)   # 2418.0
    maximo = max(ventas_enero)    # 4500

Las funciones permiten encapsular lógica reutilizable. Son el puente entre scripts sueltos y código mantenible:

    def calcular_promedio(lista_valores):
        if len(lista_valores) == 0:
            return 0
        return sum(lista_valores) / len(lista_valores)

    def clasificar_venta(monto):
        if monto >= 3000:
            return "Alta"
        elif monto >= 1000:
            return "Media"
        else:
            return "Baja"

    resultado = calcular_promedio(ventas_enero)  # 2418.0
    categoria = clasificar_venta(3400)            # "Alta"

Una buena práctica desde el inicio es nombrar variables y funciones de forma descriptiva. En análisis de datos esto es crítico porque los scripts se comparten con colegas y se revisan meses después. "v1" o "dato" son nombres que generan confusión; "ventas_mensuales_quito" es autoexplicativo.

Los comentarios con # son esenciales para documentar el razonamiento detrás del código. En Ecuador, donde los equipos de datos están creciendo, el código documentado es la diferencia entre un analista junior y uno que agrega valor real al equipo.`,
  presentacionSlides: [
    {
      titulo: "¿Por qué Python para análisis de datos?",
      contenido:
        "Sintaxis legible. Ecosistema: NumPy, Pandas, Matplotlib, Scikit-learn. Adoptado por INEC, BCE, Banco Pichincha. El nuevo Excel del analista ecuatoriano.",
    },
    {
      titulo: "Variables: almacenando datos",
      contenido:
        "Python infiere el tipo automáticamente. int (120), float (45.50), str ('Quito'), bool (True). Sin necesidad de declarar el tipo — código más limpio.",
    },
    {
      titulo: "Listas: colecciones de datos",
      contenido:
        "ventas = [1200, 3400, 890]. Acceso por índice desde 0. sum(), len(), max(), min() incorporados. Base de todo análisis exploratorio inicial.",
    },
    {
      titulo: "Operaciones con listas",
      contenido:
        "Slicing: ventas[1:3]. Append: ventas.append(5000). List comprehension: [v*1.12 for v in ventas] — aplicar IVA a toda la lista en una línea.",
    },
    {
      titulo: "Funciones: código reutilizable",
      contenido:
        "def calcular_margen(costo, precio): return (precio-costo)/precio*100. DRY: Don't Repeat Yourself. Una función, mil usos.",
    },
    {
      titulo: "Buenas prácticas desde el inicio",
      contenido:
        "Nombres descriptivos: ventas_mensuales_quito vs v1. Comentarios con #. Funciones pequeñas con una sola responsabilidad. PEP 8: estándar de estilo Python.",
    },
    {
      titulo: "Python en el contexto ecuatoriano",
      contenido:
        "INEC usa Python para procesar Censo 2022. BCE publica APIs en Python. Startups fintech en Quito: requisito en el 73% de ofertas laborales de datos (2024).",
    },
    {
      titulo: "Entorno de trabajo recomendado",
      contenido:
        "Google Colab (gratis, sin instalación). VS Code + extensión Python (local). Anaconda Distribution (todo incluido). Recomendación: Colab para el curso.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es el índice del primer elemento de una lista en Python?",
      opciones: ["1", "0", "-1", "Depende del tipo de lista"],
      respuesta: 1,
      explicacion:
        "En Python (y la mayoría de lenguajes de programación), los índices de listas comienzan en 0. El primer elemento es lista[0], el segundo es lista[1], y así sucesivamente.",
    },
    {
      pregunta: "¿Qué devuelve la función len([10, 20, 30, 40])?",
      opciones: ["3", "4", "40", "10"],
      respuesta: 1,
      explicacion:
        "len() retorna el número de elementos en la lista. La lista [10, 20, 30, 40] tiene 4 elementos, por lo tanto len() retorna 4.",
    },
    {
      pregunta: "¿Cuál de estas variables está correctamente nombrada según buenas prácticas de Python (PEP 8)?",
      opciones: ["VentasMensuales", "ventas_mensuales_quito", "VentasMensualesQuito", "v_m_q"],
      respuesta: 1,
      explicacion:
        "PEP 8 recomienda snake_case para variables: palabras en minúscula separadas por guion bajo. ventas_mensuales_quito es descriptivo y sigue la convención estándar.",
    },
    {
      pregunta: "¿Qué hace el siguiente código: [v * 1.12 for v in ventas]?",
      opciones: [
        "Suma todos los valores de ventas y multiplica por 1.12",
        "Crea una nueva lista aplicando el factor 1.12 a cada elemento de ventas",
        "Filtra los elementos de ventas mayores a 1.12",
        "Divide cada elemento de ventas entre 1.12",
      ],
      respuesta: 1,
      explicacion:
        "Esto es una list comprehension: crea una nueva lista aplicando la operación v*1.12 a cada elemento v de la lista ventas. Es la forma pythónica de aplicar IVA a una lista de precios.",
    },
    {
      pregunta: "¿En qué entorno se recomienda trabajar Python sin instalación local?",
      opciones: ["Sublime Text", "Google Colab", "Notepad++", "Microsoft Word"],
      respuesta: 1,
      explicacion:
        "Google Colab es una plataforma gratuita de Google que ejecuta Python en la nube, sin instalación, con acceso a GPUs gratuitas y integración con Google Drive.",
    },
  ],
  ejercicio: {
    titulo: "Análisis de ventas con Python puro: datos de una tienda en Quito",
    objetivo:
      "Practicar variables, listas y funciones analizando un dataset real de ventas de una tienda ecuatoriana sin usar librerías externas.",
    herramientas: "Google Colab (gratuito, sin instalación), enlace de notebook proporcionado",
    datosEjemplo:
      "Tienda de electrodomésticos en Quito. Ventas mensuales 2024 (en USD): [8500, 9200, 7800, 11000, 10500, 9800, 8900, 12000, 11500, 13000, 15000, 18000]",
    pasos: [
      "Paso 1 — Configurar Colab: Abrir Google Colab (colab.research.google.com), crear un nuevo notebook. Nombrar el notebook: 'Análisis_Ventas_Quito_[TuNombre]'.",
      "Paso 2 — Crear las variables: Definir la lista ventas_2024 con los 12 valores mensuales. Crear una lista meses con los nombres de los meses en español. Verificar que len(ventas_2024) == 12.",
      "Paso 3 — Calcular estadísticas básicas: Usando sum(), len(), max(), min(), calcular: total anual, promedio mensual, mes de mayor venta (valor), mes de menor venta (valor). Imprimir cada resultado con print() formateado.",
      "Paso 4 — Crear función de clasificación: Definir la función clasificar_mes(monto) que retorne 'Alto' si monto >= 12000, 'Medio' si monto >= 9000, 'Bajo' en caso contrario. Aplicarla a cada mes con un for loop.",
      "Paso 5 — Calcular crecimiento: Crear la función calcular_crecimiento(mes_actual, mes_anterior) que retorne el porcentaje de variación. Calcular el crecimiento mes a mes para los 11 pares consecutivos.",
      "Paso 6 — Reporte final: Imprimir un reporte estructurado con: resumen anual, top 3 meses, clasificación de cada mes, y mes con mayor crecimiento porcentual.",
    ],
    resultado:
      "Notebook funcional en Colab con análisis completo de ventas: estadísticas, clasificaciones y reporte de crecimiento usando solo Python puro.",
    criterios: [
      { criterio: "Variables y lista correctamente definidas con nombres descriptivos", puntos: 15 },
      { criterio: "Estadísticas básicas calculadas e impresas con formato claro", puntos: 20 },
      { criterio: "Función clasificar_mes con lógica correcta y aplicada a todos los meses", puntos: 25 },
      { criterio: "Función calcular_crecimiento correcta con 11 resultados", puntos: 25 },
      { criterio: "Reporte final legible e informativo", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Python.org — Tutorial oficial en español",
      url: "https://docs.python.org/es/3/tutorial/",
      tipo: "documentacion",
      descripcion: "Tutorial oficial de Python en español, desde conceptos básicos hasta avanzados",
    },
    {
      titulo: "Google Colab — Entorno de notebooks gratuito",
      url: "https://colab.research.google.com/",
      tipo: "herramienta",
      descripcion: "Entorno de Jupyter notebooks en la nube de Google, gratuito con GPU",
    },
    {
      titulo: "PEP 8 — Guía de estilo para código Python",
      url: "https://pep8.org/",
      tipo: "documentacion",
      descripcion: "Estándar oficial de estilo y convenciones para código Python",
    },
    {
      titulo: "Real Python — Tutoriales prácticos",
      url: "https://realpython.com/python-lists-tuples/",
      tipo: "lectura",
      descripcion: "Tutorial completo sobre listas y tuplas en Python con ejemplos prácticos",
    },
  ],
};

const tema2: TemaC4 = placeholder(2, "Estructuras de control: condicionales y bucles", "Python Básico para Datos", 1);
const tema3: TemaC4 = placeholder(3, "Diccionarios y conjuntos: datos estructurados", "Python Básico para Datos", 1);
const tema4: TemaC4 = placeholder(4, "Lectura y escritura de archivos CSV y JSON", "Python Básico para Datos", 1);

// ─── MÓDULO 2: PANDAS Y DATASETS ECUADOR ─────────────────────────────────────

const tema5: TemaC4 = placeholder(5, "Introducción a NumPy: arrays y operaciones vectorizadas", "Pandas y Datasets Ecuador", 2);

const tema6: TemaC4 = {
  id: 6,
  titulo: "Pandas: carga y exploración de datasets del INEC y BCE",
  modulo: "Pandas y Datasets Ecuador",
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Pandas con datos reales: INEC y BCE Ecuador desde cero",
  videoDuracion: "25 min",
  teoria: `Pandas es la librería de Python más importante para análisis de datos tabulares. Introduce dos estructuras principales: Series (una columna con índice) y DataFrame (tabla bidimensional con filas y columnas). Si dominas Pandas, puedes analizar el 80% de los datasets que encontrarás en tu carrera como analista de datos en Ecuador.

El Instituto Nacional de Estadística y Censos (INEC) publica decenas de datasets gratuitos en su portal: resultados del Censo 2022, Encuesta Nacional de Empleo (ENEMDU), IPC mensual, estadísticas vitales, y más. El Banco Central del Ecuador (BCE) publica series macroeconómicas: PIB trimestral, balanza comercial, inflación, tasas de interés, remesas. Estos son los datos con los que trabajan economistas, analistas financieros y consultores en Ecuador.

Para cargar datos en Pandas:

    import pandas as pd

    # Desde URL directa del INEC (datos abiertos)
    url_inec = "https://www.ecuadorencifras.gob.ec/documentos/web-inec/EMPLEO/2024/Enemdu_IPC.csv"
    df = pd.read_csv(url_inec)

    # Desde archivo local
    df = pd.read_csv("ventas_quito_2024.csv", encoding="utf-8")

    # Desde Excel (BCE publica en .xlsx)
    df_bce = pd.read_excel("BCE_PIB_Trimestral.xlsx", sheet_name="PIB")

Los primeros comandos de exploración son siempre los mismos — memorízalos:

    df.shape          # (filas, columnas): (1024, 15)
    df.head(5)        # primeras 5 filas
    df.tail(5)        # últimas 5 filas
    df.info()         # tipos de datos y valores nulos
    df.describe()     # estadísticas descriptivas de columnas numéricas
    df.columns        # lista de nombres de columnas
    df.dtypes         # tipo de dato de cada columna

La limpieza básica es el paso que más tiempo consume en proyectos reales — los analistas experimentados dicen que representa el 70-80% del tiempo de trabajo. Los patrones más frecuentes con datos ecuatorianos:

    # Eliminar filas con valores nulos en columna crítica
    df = df.dropna(subset=["ruc"])

    # Rellenar nulos con valor por defecto
    df["provincia"].fillna("No especificada", inplace=True)

    # Convertir columna de texto a número (limpiando el signo $)
    df["monto"] = df["monto"].str.replace("$", "").str.replace(",", "").astype(float)

    # Filtrar solo registros de Quito
    df_quito = df[df["ciudad"] == "Quito"]

    # Agrupar ventas por mes
    df["mes"] = pd.to_datetime(df["fecha"]).dt.month
    ventas_por_mes = df.groupby("mes")["monto"].sum()

Una habilidad clave es combinar datasets de distintas fuentes. Por ejemplo, enriquecer datos de ventas propios con el IPC del BCE para calcular ventas en términos reales (ajustadas por inflación). Esto requiere merge:

    df_ventas_reales = pd.merge(df_ventas, df_ipc, on="mes_año", how="left")
    df_ventas_reales["venta_real"] = df_ventas_reales["monto"] / (df_ventas_reales["ipc"] / 100)`,
  presentacionSlides: [
    {
      titulo: "¿Qué es Pandas y por qué importa?",
      contenido:
        "Librería Python para datos tabulares. Series (1D) + DataFrame (2D). Estándar de la industria en análisis de datos. Compatible con INEC, BCE, SRI, datosabiertos.gob.ec.",
    },
    {
      titulo: "Fuentes de datos oficiales de Ecuador",
      contenido:
        "INEC: Censo 2022, ENEMDU, IPC. BCE: PIB, inflación, remesas, tasas. SRI: estadísticas tributarias. datosabiertos.gob.ec: portal único del Estado. Todos gratuitos.",
    },
    {
      titulo: "Cargar datos en Pandas",
      contenido:
        "pd.read_csv() para CSV (INEC). pd.read_excel() para XLSX (BCE). pd.read_json() para APIs. Parámetros clave: encoding='utf-8', sep=';', skiprows=2.",
    },
    {
      titulo: "Los 7 comandos de exploración esenciales",
      contenido:
        "df.shape · df.head() · df.tail() · df.info() · df.describe() · df.columns · df.dtypes. Memorizar estos 7 = explorar cualquier dataset en 5 minutos.",
    },
    {
      titulo: "Limpieza de datos: patrones frecuentes Ecuador",
      contenido:
        "dropna() para nulos críticos. fillna() para completar. str.replace() para limpiar montos con '$'. pd.to_datetime() para fechas en formatos mixtos.",
    },
    {
      titulo: "Filtrado y agrupación",
      contenido:
        "df[df['ciudad']=='Quito'] — filtrar. groupby('mes')['monto'].sum() — agrupar. value_counts() — frecuencias. pivot_table() — tabla dinámica.",
    },
    {
      titulo: "Merge: combinar fuentes de datos",
      contenido:
        "pd.merge(df_ventas, df_ipc, on='mes_año', how='left'). Caso Ecuador: ventas propias + IPC del BCE = ventas reales ajustadas por inflación.",
    },
    {
      titulo: "Caso práctico: ENEMDU 2024",
      contenido:
        "Dataset: 80,000 encuestados. Variables: empleo, ingresos, provincia, sexo, edad. Análisis: tasa de empleo adecuado por provincia. Resultado: brecha Sierra vs Costa.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué comando de Pandas muestra el número de filas y columnas de un DataFrame?",
      opciones: ["df.size()", "df.shape", "df.count()", "df.length()"],
      respuesta: 1,
      explicacion:
        "df.shape es un atributo (no método, no lleva paréntesis) que retorna una tupla (filas, columnas). Por ejemplo, (1024, 15) significa 1024 filas y 15 columnas.",
    },
    {
      pregunta: "¿Qué institución ecuatoriana publica el dataset ENEMDU con datos de empleo?",
      opciones: [
        "Banco Central del Ecuador (BCE)",
        "Instituto Nacional de Estadística y Censos (INEC)",
        "Servicio de Rentas Internas (SRI)",
        "Ministerio de Economía",
      ],
      respuesta: 1,
      explicacion:
        "El INEC publica la Encuesta Nacional de Empleo, Desempleo y Subempleo (ENEMDU) trimestralmente. El BCE publica datos macroeconómicos como PIB, inflación y remesas.",
    },
    {
      pregunta: "¿Qué hace df.dropna(subset=['ruc'])?",
      opciones: [
        "Elimina la columna 'ruc' del DataFrame",
        "Elimina las filas donde la columna 'ruc' tiene valores nulos",
        "Rellena los valores nulos de 'ruc' con ceros",
        "Cuenta cuántos nulos hay en la columna 'ruc'",
      ],
      respuesta: 1,
      explicacion:
        "dropna(subset=['ruc']) elimina solo las filas donde la columna 'ruc' tiene NaN. Sin el parámetro subset, eliminaría filas con cualquier nulo en cualquier columna.",
    },
    {
      pregunta: "Para agrupar las ventas por mes y sumar los montos, ¿cuál es el código correcto?",
      opciones: [
        "df.sum('mes')['monto']",
        "df.groupby('mes')['monto'].sum()",
        "df.pivot('mes', 'monto')",
        "df.merge('mes', 'monto')",
      ],
      respuesta: 1,
      explicacion:
        "groupby('mes') agrupa el DataFrame por la columna mes, ['monto'] selecciona esa columna, y .sum() suma los valores de cada grupo. Es el patrón split-apply-combine de Pandas.",
    },
    {
      pregunta: "¿Cuál es el propósito del parámetro how='left' en pd.merge()?",
      opciones: [
        "Ordenar el resultado de izquierda a derecha",
        "Mantener todos los registros del DataFrame izquierdo aunque no haya coincidencia en el derecho",
        "Usar solo las columnas del DataFrame izquierdo",
        "Fusionar por la columna más a la izquierda",
      ],
      respuesta: 1,
      explicacion:
        "how='left' en un merge es un LEFT JOIN: mantiene todas las filas del DataFrame izquierdo. Si no hay coincidencia en el derecho, las columnas del derecho quedan como NaN.",
    },
  ],
  ejercicio: {
    titulo: "Análisis de empleo por provincia con datos ENEMDU del INEC",
    objetivo:
      "Cargar, limpiar y analizar el dataset ENEMDU del INEC usando Pandas para identificar patrones de empleo por provincia en Ecuador.",
    herramientas:
      "Google Colab, Pandas, datos INEC disponibles en ecuadorencifras.gob.ec o dataset de muestra proporcionado",
    datosEjemplo:
      "Dataset: ENEMDU Q4 2024 — 15,000 registros. Variables clave: provincia, area (urbano/rural), sexo, empleo_adecuado, ingreso_mensual, nivel_instruccion.",
    pasos: [
      "Paso 1 — Importar y explorar: Cargar el CSV de ENEMDU con pd.read_csv(). Ejecutar los 7 comandos de exploración (shape, head, tail, info, describe, columns, dtypes). Documentar en comentarios qué encontraste.",
      "Paso 2 — Auditoría de calidad: Usar df.isnull().sum() para contar nulos por columna. Identificar las 3 columnas con más nulos. Decidir estrategia: dropna o fillna para cada una, con justificación.",
      "Paso 3 — Limpieza: Aplicar las decisiones de limpieza. Verificar que df.isnull().sum() bajó. Corregir tipos de datos si es necesario (ingreso_mensual como float, provincia como str).",
      "Paso 4 — Análisis por provincia: Calcular para cada provincia: tasa de empleo adecuado (% de encuestados con empleo_adecuado=='Sí'), ingreso mensual promedio, brecha de género (ingreso promedio hombres vs mujeres).",
      "Paso 5 — Top y Bottom: Identificar las 3 provincias con mayor ingreso promedio y las 3 con menor. Calcular la diferencia absoluta y porcentual entre la provincia de mayor y menor ingreso.",
      "Paso 6 — Reporte: Crear un DataFrame resumen con las métricas por provincia ordenado por ingreso promedio descendente. Exportarlo como CSV con df.to_csv('reporte_empleo_provincias.csv', index=False).",
    ],
    resultado:
      "Notebook Colab con análisis completo del ENEMDU y CSV exportado con métricas de empleo por provincia en Ecuador.",
    criterios: [
      { criterio: "Exploración completa con los 7 comandos y comentarios explicativos", puntos: 15 },
      { criterio: "Auditoría de nulos con estrategia justificada por columna", puntos: 20 },
      { criterio: "Limpieza implementada correctamente con verificación", puntos: 20 },
      { criterio: "Análisis por provincia con las 3 métricas (empleo, ingreso, género)", puntos: 30 },
      { criterio: "CSV exportado con formato correcto y reporte ordenado", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Pandas — Documentación oficial",
      url: "https://pandas.pydata.org/docs/",
      tipo: "documentacion",
      descripcion: "Documentación completa de Pandas con guías de usuario y referencia de API",
    },
    {
      titulo: "INEC Ecuador — Portal de datos abiertos",
      url: "https://www.ecuadorencifras.gob.ec/estadisticas/",
      tipo: "herramienta",
      descripcion: "Portal oficial del INEC con datasets del Censo 2022, ENEMDU, IPC y más",
    },
    {
      titulo: "BCE — Estadísticas macroeconómicas",
      url: "https://www.bce.fin.ec/index.php/estadisticas",
      tipo: "herramienta",
      descripcion: "Series de PIB, inflación, remesas, tasas de interés y balanza comercial de Ecuador",
    },
    {
      titulo: "Datos Abiertos Ecuador",
      url: "https://www.datosabiertos.gob.ec/",
      tipo: "herramienta",
      descripcion: "Portal único del Estado ecuatoriano con datasets de todas las instituciones públicas",
    },
  ],
};

const tema7: TemaC4 = placeholder(7, "Limpieza avanzada: manejo de fechas, duplicados y outliers", "Pandas y Datasets Ecuador", 2);
const tema8: TemaC4 = placeholder(8, "Análisis exploratorio: correlaciones y tablas dinámicas", "Pandas y Datasets Ecuador", 2);

// ─── MÓDULO 3: VISUALIZACIÓN CON MATPLOTLIB Y PLOTLY ─────────────────────────

const tema9: TemaC4 = placeholder(9, "Matplotlib: gráficos estáticos desde cero", "Visualización con Matplotlib y Plotly", 3);
const tema10: TemaC4 = placeholder(10, "Seaborn: visualizaciones estadísticas elegantes", "Visualización con Matplotlib y Plotly", 3);

const tema11: TemaC4 = {
  id: 11,
  titulo: "Plotly Express: dashboards interactivos con datos de Ecuador",
  modulo: "Visualización con Matplotlib y Plotly",
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Plotly Express: de datos del INEC a gráficos interactivos en 10 líneas",
  videoDuracion: "24 min",
  teoria: `Plotly es la librería de visualización interactiva más popular en Python. A diferencia de Matplotlib, que genera imágenes estáticas, Plotly crea gráficos HTML interactivos: el usuario puede hacer zoom, hover para ver valores exactos, filtrar categorías clicando en la leyenda y exportar en PNG con un solo botón. Esta interactividad es la diferencia entre una presentación que impresiona y una que genera preguntas incómodas.

Plotly Express (px) es la API de alto nivel que permite crear gráficos complejos en una sola línea:

    import plotly.express as px
    import pandas as pd

    # Cargar datos de PIB Ecuador por sector (BCE)
    df_pib = pd.read_csv("pib_sectorial_ecuador.csv")

    # Gráfico de barras interactivo
    fig = px.bar(
        df_pib,
        x="sector",
        y="pib_millones_usd",
        color="año",
        title="PIB Ecuador por sector económico 2020-2024",
        labels={"pib_millones_usd": "PIB (millones USD)", "sector": "Sector"},
        text_auto=True
    )
    fig.show()

Los tipos de gráficos más útiles en análisis de datos ecuatorianos:

    # Serie de tiempo: evolución del precio del petróleo (WTI impacta directamente al presupuesto ecuatoriano)
    fig_tiempo = px.line(df_petroleo, x="fecha", y="precio_usd", title="Precio WTI 2020-2024")

    # Dispersión: relación entre nivel de instrucción e ingreso (ENEMDU)
    fig_scatter = px.scatter(df_enemdu, x="años_instruccion", y="ingreso_mensual",
                             color="provincia", size="muestra", hover_name="provincia")

    # Mapa de Ecuador con datos por provincia
    fig_mapa = px.choropleth(df_provincias, geojson=geojson_ecuador,
                              locations="provincia_codigo", color="tasa_empleo",
                              title="Tasa de empleo adecuado por provincia")

    # Histograma: distribución de ingresos
    fig_hist = px.histogram(df_enemdu, x="ingreso_mensual", nbins=50,
                             color="sexo", title="Distribución de ingresos por sexo")

Dash (también de Plotly) permite convertir cualquier gráfico Plotly en una aplicación web interactiva con filtros, dropdowns y rangos de fecha. Para el contexto ecuatoriano, esto significa que un analista puede construir un dashboard de monitoreo económico sin saber HTML ni JavaScript. La curva de aprendizaje de Dash es de 2-3 días para un dashboard funcional.

La configuración de colores en visualizaciones para presentaciones en Ecuador debe considerar: usar paletas accesibles para daltónicos (px.colors.qualitative.Safe), evitar rojo/verde para no confundir con semáforos de regulación, y usar el azul institucional si es para organismos del Estado. En presentaciones al sector privado, los colores corporativos de la empresa cliente crean mayor impacto.`,
  presentacionSlides: [
    {
      titulo: "Plotly vs Matplotlib: ¿cuándo usar cada uno?",
      contenido:
        "Matplotlib: gráficos estáticos para reportes PDF, publicaciones. Plotly: gráficos interactivos para dashboards, presentaciones ejecutivas. En análisis exploratorio: Plotly siempre.",
    },
    {
      titulo: "Plotly Express: una línea, un gráfico",
      contenido:
        "px.bar(), px.line(), px.scatter(), px.histogram(), px.pie(), px.choropleth(). API de alto nivel: menos código, más legibilidad. Compatible con DataFrames de Pandas directamente.",
    },
    {
      titulo: "Gráficos de series de tiempo con datos BCE",
      contenido:
        "px.line() con x='fecha', y='valor'. Múltiples líneas con color='variable'. Bandas de confianza con add_trace(). Anotaciones en eventos clave (pandemia 2020, crisis petróleo).",
    },
    {
      titulo: "Scatter plot: correlaciones en ENEMDU",
      contenido:
        "px.scatter(x='años_instruccion', y='ingreso_mensual', color='provincia', size='muestra'). Hover interactivo muestra valores exactos. Trendline='ols' agrega regresión.",
    },
    {
      titulo: "Mapas de Ecuador por provincia",
      contenido:
        "px.choropleth() con GeoJSON de provincias ecuatorianas. color='tasa_empleo'. Resultado: mapa interactivo con zoom y hover. Fuente GeoJSON: datosabiertos.gob.ec.",
    },
    {
      titulo: "Personalización profesional",
      contenido:
        "fig.update_layout(title_font_size=20, paper_bgcolor='white'). Colores: px.colors.qualitative.Safe para daltónicos. Exportar: fig.write_html('dashboard.html') o fig.write_image('grafico.png').",
    },
    {
      titulo: "Introducción a Dash: dashboards web sin HTML",
      contenido:
        "import dash, dash_core_components. 3 componentes: Layout (qué se ve), Callbacks (interactividad), Server (despliegue). Dashboard funcional en 50 líneas de Python.",
    },
    {
      titulo: "Caso: dashboard de exportaciones Ecuador",
      contenido:
        "Fuente: BCE balanza comercial. Gráficos: línea temporal, barras por producto (petróleo, banano, camarón, flores), mapa por destino. Filtros: año, producto, destino.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la principal ventaja de Plotly sobre Matplotlib para presentaciones ejecutivas?",
      opciones: [
        "Plotly es más rápido de calcular",
        "Plotly genera gráficos interactivos con zoom, hover y filtros",
        "Plotly tiene más tipos de gráficos disponibles",
        "Plotly es más fácil de instalar",
      ],
      respuesta: 1,
      explicacion:
        "La interactividad es la ventaja clave de Plotly: hover para ver valores exactos, zoom, filtrado por clic en leyenda. Esto transforma una presentación estática en una herramienta de exploración en vivo.",
    },
    {
      pregunta: "¿Qué función de Plotly Express crea un mapa coroplético con datos por provincia?",
      opciones: ["px.map()", "px.choropleth()", "px.geo()", "px.scatter_mapbox()"],
      respuesta: 1,
      explicacion:
        "px.choropleth() crea mapas donde las regiones se colorean según un valor. Requiere un GeoJSON con las geometrías de las regiones y una columna de identificador para hacer el join.",
    },
    {
      pregunta: "Para agregar una línea de tendencia (regresión) a un scatter plot en Plotly Express, ¿qué parámetro se usa?",
      opciones: ["regression=True", "trendline='ols'", "line_fit=True", "fit_line='linear'"],
      respuesta: 1,
      explicacion:
        "trendline='ols' en px.scatter() agrega automáticamente una línea de regresión lineal (Ordinary Least Squares) con la ecuación y R² disponibles al hacer hover.",
    },
    {
      pregunta: "¿Qué comando exporta un gráfico Plotly como archivo HTML interactivo?",
      opciones: ["fig.save('grafico.html')", "fig.export_html('grafico.html')", "fig.write_html('grafico.html')", "fig.to_html('grafico.html')"],
      respuesta: 2,
      explicacion:
        "fig.write_html('dashboard.html') exporta el gráfico como un archivo HTML independiente que puede abrirse en cualquier navegador sin necesidad de Python instalado.",
    },
    {
      pregunta: "¿Qué librería del ecosistema Plotly permite crear dashboards web interactivos con dropdowns y filtros?",
      opciones: ["Plotly Charts", "Streamlit exclusivamente", "Dash", "Flask-Plotly"],
      respuesta: 2,
      explicacion:
        "Dash es el framework de aplicaciones web de Plotly. Permite crear dashboards interactivos completos usando solo Python, sin necesidad de JavaScript o HTML.",
    },
  ],
  ejercicio: {
    titulo: "Dashboard interactivo de exportaciones de Ecuador con Plotly",
    objetivo:
      "Construir un dashboard interactivo con datos de exportaciones del BCE que muestre tendencias, composición por producto y destinos geográficos.",
    herramientas:
      "Google Colab, Plotly Express, Pandas, datos BCE de balanza comercial (CSV proporcionado)",
    datosEjemplo:
      "Dataset BCE: exportaciones mensuales 2019-2024. Columnas: fecha, producto (petróleo, banano, camarón, cacao, flores, otros), monto_fob_millones, pais_destino.",
    pasos: [
      "Paso 1 — Cargar y explorar: Importar Plotly Express y Pandas. Cargar el CSV del BCE. Hacer exploración básica (shape, head, dtypes). Convertir 'fecha' a datetime.",
      "Paso 2 — Serie de tiempo: Agrupar exportaciones totales por mes. Crear gráfico de línea con px.line() mostrando la evolución 2019-2024. Añadir anotación en marzo 2020 (inicio pandemia).",
      "Paso 3 — Composición por producto: Agrupar por año y producto, sumar montos. Crear gráfico de barras apiladas con px.bar(barmode='stack') mostrando la participación de cada producto por año.",
      "Paso 4 — Top destinos: Identificar los 10 países que más compran productos ecuatorianos. Crear gráfico de barras horizontales ordenado de mayor a menor con px.bar(orientation='h').",
      "Paso 5 — Scatter correlación: Crear scatter plot de precio del petróleo vs exportaciones totales mensuales (ambas series disponibles en el dataset). Añadir trendline='ols'.",
      "Paso 6 — Exportar dashboard: Guardar los 4 gráficos como archivos HTML separados con fig.write_html(). Crear un notebook limpio y comentado que cualquier persona pueda ejecutar.",
    ],
    resultado:
      "4 gráficos interactivos exportados como HTML: serie temporal, barras apiladas por producto, top destinos y scatter correlación petróleo-exportaciones.",
    criterios: [
      { criterio: "Gráfico de serie de tiempo con anotación de pandemia y formato correcto", puntos: 20 },
      { criterio: "Barras apiladas por producto con colores diferenciados y leyenda clara", puntos: 25 },
      { criterio: "Top 10 destinos ordenado correctamente como barras horizontales", puntos: 20 },
      { criterio: "Scatter con trendline y R² visible en hover", puntos: 20 },
      { criterio: "Notebook documentado con comentarios y 4 archivos HTML exportados", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Plotly Express — Documentación oficial",
      url: "https://plotly.com/python/plotly-express/",
      tipo: "documentacion",
      descripcion: "Galería completa de gráficos de Plotly Express con código de ejemplo",
    },
    {
      titulo: "Dash — Framework de dashboards Python",
      url: "https://dash.plotly.com/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de Dash para crear dashboards web interactivos",
    },
    {
      titulo: "BCE Ecuador — Balanza Comercial",
      url: "https://www.bce.fin.ec/index.php/estadisticas",
      tipo: "herramienta",
      descripcion: "Series de exportaciones e importaciones de Ecuador por producto y país",
    },
    {
      titulo: "Matplotlib — Documentación oficial",
      url: "https://matplotlib.org/stable/tutorials/index.html",
      tipo: "documentacion",
      descripcion: "Tutoriales oficiales de Matplotlib para gráficos estáticos en Python",
    },
  ],
};

const tema12: TemaC4 = placeholder(12, "Mapas geográficos de Ecuador con GeoPandas y Plotly", "Visualización con Matplotlib y Plotly", 3);

// ─── MÓDULO 4: STORYTELLING CON DATOS ────────────────────────────────────────

const tema13: TemaC4 = placeholder(13, "Principios de storytelling con datos: qué contar y cómo", "Storytelling con Datos", 4);
const tema14: TemaC4 = placeholder(14, "Diseño de reportes ejecutivos automatizados con Python", "Storytelling con Datos", 4);
const tema15: TemaC4 = placeholder(15, "Presentaciones de datos para audiencias no técnicas", "Storytelling con Datos", 4);

const tema16: TemaC4 = {
  id: 16,
  titulo: "Proyecto final: análisis completo de un dataset ecuatoriano",
  modulo: "Storytelling con Datos",
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Proyecto final: de datos crudos del INEC a historia con impacto",
  videoDuracion: "28 min",
  teoria: `El proyecto final del curso integra todas las habilidades adquiridas: Python, Pandas, Plotly y storytelling con datos. El objetivo es demostrar que puedes tomar un dataset real de Ecuador, procesarlo, analizarlo, visualizarlo y comunicar hallazgos de forma que una persona no técnica entienda y tome decisiones con esa información.

El marco de storytelling con datos de Cole Nussbaumer Knaflic (libro "Storytelling with Data") propone tres pasos: primero, entender el contexto (¿quién es tu audiencia? ¿qué necesita saber? ¿qué acción tomarás después de ver los datos?); segundo, elegir la visualización apropiada para cada mensaje (las barras para comparar, las líneas para tendencias, los scatter para correlaciones); tercero, eliminar el ruido (todo elemento visual que no añade información — fondos grises, bordes de gráficos, gridlines innecesarias, leyendas que repiten el título).

Para el contexto ecuatoriano, los datasets más ricos para un proyecto final son:

- Censo de Población 2022 (INEC): 17 millones de registros, demografía completa por parroquia
- ENEMDU 2024 (INEC): empleo, ingresos, educación por provincia y área
- Exportaciones por producto 2019-2024 (BCE): tendencias pre y post pandemia
- Registro de empresas SUPERCIAS 2023: sector, tamaño, provincia, fecha de constitución
- Presupuesto General del Estado 2024: asignaciones por ministerio y ejecución

La narrativa de datos sigue la estructura periodística de la pirámide invertida: el hallazgo más importante primero, luego los datos que lo sustentan, luego el contexto y metodología. En una presentación de 10 minutos: 1 minuto de contexto, 6 minutos de hallazgos (máximo 3 ideas principales), 2 minutos de implicaciones, 1 minuto de conclusión y próximos pasos.

Una práctica profesional es el "one-pager": un solo documento A4 o slide que resume todo el análisis. Obliga a priorizar lo más importante y eliminar lo accesorio. Si tu análisis no cabe en un one-pager con sentido, probablemente tienes demasiadas ideas y necesitas enfocar.

El entregable final incluye: notebook de Colab documentado (reproducible), al menos 4 visualizaciones interactivas en Plotly, un one-pager ejecutivo, y una presentación de 5 slides para una audiencia no técnica específica (que debes definir tú: gerente de ventas, directorio de ONG, parlamentario, etc.).`,
  presentacionSlides: [
    {
      titulo: "El marco de storytelling con datos",
      contenido:
        "3 pasos de Cole Nussbaumer: 1. Entender contexto (audiencia + acción). 2. Elegir visualización apropiada. 3. Eliminar el ruido. El gráfico más elegante es el que más informa en menos elementos.",
    },
    {
      titulo: "Datasets ecuatorianos para el proyecto final",
      contenido:
        "Censo 2022 INEC (17M registros). ENEMDU 2024. Exportaciones BCE 2019-2024. SUPERCIAS empresas 2023. Presupuesto Estado 2024. Todos gratuitos, todos reales.",
    },
    {
      titulo: "La pirámide invertida para datos",
      contenido:
        "Hallazgo más importante PRIMERO. Datos que lo sustentan. Contexto y metodología. En presentación de 10 min: 1 contexto + 6 hallazgos + 2 implicaciones + 1 conclusión.",
    },
    {
      titulo: "Eliminar el ruido: antes y después",
      contenido:
        "Eliminar: fondos grises, bordes de gráficos, gridlines innecesarias, leyendas que repiten el título, 3D (siempre distorsiona). Resultado: el dato habla solo.",
    },
    {
      titulo: "El one-pager: disciplina de síntesis",
      contenido:
        "1 página A4 con todo el análisis. Obliga a priorizar. Si no cabe con sentido: tienes demasiadas ideas. Herramienta: Canva, Figma, o PowerPoint con layout profesional.",
    },
    {
      titulo: "Estructura del entregable final",
      contenido:
        "1. Notebook Colab reproducible. 2. +4 visualizaciones Plotly interactivas. 3. One-pager ejecutivo. 4. Presentación 5 slides para audiencia definida. Repositorio GitHub.",
    },
    {
      titulo: "Rúbrica de evaluación",
      contenido:
        "Calidad del análisis (30%). Visualizaciones apropiadas y limpias (25%). Narrativa y comunicación (25%). Código reproducible y documentado (20%).",
    },
    {
      titulo: "Próximos pasos: de analista a científico de datos",
      contenido:
        "C5 Machine Learning Práctico. C14 Estrategia de Datos. Portafolio en GitHub con 3 proyectos reales. Certificación Google Data Analytics. Ofertas laborales: $800-$2,500 en Ecuador.",
    },
  ],
  quiz: [
    {
      pregunta: "Según el marco de storytelling de Cole Nussbaumer, ¿cuál es el primer paso?",
      opciones: [
        "Elegir la visualización más atractiva",
        "Entender el contexto: audiencia y acción esperada",
        "Limpiar los datos completamente",
        "Crear el one-pager ejecutivo",
      ],
      respuesta: 1,
      explicacion:
        "El contexto es el primer paso: saber quién verá los datos y qué decisión se tomará con ellos determina qué analizar, qué mostrar y cómo presentarlo. Sin contexto, el análisis puede ser técnicamente perfecto e inútil.",
    },
    {
      pregunta: "¿Qué institución ecuatoriana publica el Registro de Empresas con datos del sector, tamaño y provincia?",
      opciones: [
        "Banco Central del Ecuador (BCE)",
        "INEC",
        "Superintendencia de Compañías (SUPERCIAS)",
        "Ministerio de Producción",
      ],
      respuesta: 2,
      explicacion:
        "La Superintendencia de Compañías (SUPERCIAS) mantiene el registro de empresas constituidas en Ecuador, con información de sector económico, tamaño, provincia y fecha de constitución.",
    },
    {
      pregunta: "En la estructura de pirámide invertida para una presentación de datos, ¿qué va primero?",
      opciones: [
        "La metodología de recolección de datos",
        "El contexto histórico del problema",
        "El hallazgo más importante",
        "Las limitaciones del análisis",
      ],
      respuesta: 2,
      explicacion:
        "La pirámide invertida pone lo más importante al inicio. La audiencia decide en los primeros 30 segundos si vale la pena seguir prestando atención. El hallazgo principal primero captura ese momento.",
    },
    {
      pregunta: "¿Cuál de estos elementos se recomienda ELIMINAR para reducir el ruido en un gráfico?",
      opciones: [
        "El título del gráfico",
        "Los valores en las barras",
        "Las gridlines y bordes de gráfico innecesarios",
        "Las etiquetas de los ejes",
      ],
      respuesta: 2,
      explicacion:
        "Gridlines, bordes, fondos grises, leyendas redundantes y gráficos 3D son ruido visual. Eliminarlos hace que los datos sean el foco. Esta es una de las enseñanzas centrales de 'Storytelling with Data'.",
    },
    {
      pregunta: "¿Cuál es el propósito del 'one-pager' como entregable de análisis de datos?",
      opciones: [
        "Ahorrar papel en impresión",
        "Forzar la priorización eliminando lo accesorio y comunicar lo esencial",
        "Cumplir con un formato estándar del sector",
        "Facilitar la búsqueda en bases de datos",
      ],
      respuesta: 1,
      explicacion:
        "El one-pager es una disciplina de síntesis: si no puedes resumir un análisis en una página con coherencia, probablemente no tienes claridad suficiente sobre qué es lo más importante. Fuerza la priorización radical.",
    },
  ],
  ejercicio: {
    titulo: "Proyecto final: análisis del Censo 2022 o ENEMDU para una audiencia específica",
    objetivo:
      "Integrar Python, Pandas, Plotly y storytelling para producir un análisis completo de un dataset ecuatoriano con entregables profesionales.",
    herramientas:
      "Google Colab, Pandas, Plotly Express, Canva o PowerPoint, GitHub para repositorio público",
    datosEjemplo:
      "Opción A: ENEMDU Q4 2024 — analizar brechas de empleo e ingreso por provincia, sexo y nivel de instrucción. Opción B: Exportaciones BCE 2019-2024 — analizar impacto de pandemia y recuperación por producto.",
    pasos: [
      "Paso 1 — Selección y contexto: Elegir dataset (ENEMDU o Exportaciones BCE). Definir la audiencia específica (ej: 'Gerente de RRHH de empresa con operaciones en 3 provincias' o 'Asesor del Ministerio de Comercio Exterior'). Escribir en 3 líneas: qué necesita saber esta audiencia y qué decisión tomará.",
      "Paso 2 — Análisis exploratorio: Cargar datos con Pandas. Ejecutar auditoría de calidad. Limpiar y preparar el dataset. Explorar con groupby, describe y correlaciones. Documentar en comentarios los hallazgos inesperados.",
      "Paso 3 — Selección de hallazgos: Identificar las 3 ideas más importantes que responden a las necesidades de tu audiencia. Para cada idea: ¿qué dato la sustenta? ¿qué visualización la comunica mejor?",
      "Paso 4 — Construcción de visualizaciones: Crear mínimo 4 gráficos Plotly apropiados (mínimo 1 serie de tiempo, 1 comparación, 1 distribución, 1 relación). Aplicar principios de eliminación de ruido. Exportar como HTML.",
      "Paso 5 — One-pager: Diseñar en Canva o PowerPoint un resumen de 1 página A4 con: problema, hallazgo principal, 2 visualizaciones clave, implicación. Sin jerga técnica.",
      "Paso 6 — Presentación y repositorio: Crear 5 slides de presentación para tu audiencia específica. Subir el notebook a GitHub como repositorio público con README explicativo. Verificar que el notebook sea reproducible ejecutando 'Restart and run all'.",
    ],
    resultado:
      "Notebook reproducible en GitHub, 4+ visualizaciones HTML, one-pager ejecutivo y 5 slides de presentación para audiencia definida.",
    criterios: [
      { criterio: "Análisis técnico: limpieza, exploración y hallazgos correctos (3 ideas principales identificadas)", puntos: 30 },
      { criterio: "Visualizaciones: apropiadas para cada mensaje, sin ruido, interactivas", puntos: 25 },
      { criterio: "Narrativa: one-pager coherente y presentación de 5 slides sin jerga técnica", puntos: 25 },
      { criterio: "Código: notebook reproducible, documentado, en repositorio GitHub público con README", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "Storytelling with Data — Recursos gratuitos",
      url: "https://www.storytellingwithdata.com/blog",
      tipo: "lectura",
      descripcion: "Blog de Cole Nussbaumer con ejemplos prácticos de mejora de visualizaciones",
    },
    {
      titulo: "INEC — Resultados Censo 2022",
      url: "https://www.ecuadorencifras.gob.ec/censo-de-poblacion-y-vivienda/",
      tipo: "herramienta",
      descripcion: "Portal oficial del Censo de Población y Vivienda 2022 con microdatos descargables",
    },
    {
      titulo: "Plotly — Galería de ejemplos",
      url: "https://plotly.com/python/",
      tipo: "documentacion",
      descripcion: "Galería completa de tipos de gráficos de Plotly con código Python ejecutable",
    },
    {
      titulo: "GitHub — Guía de inicio con repositorios",
      url: "https://docs.github.com/es/get-started/quickstart/create-a-repo",
      tipo: "documentacion",
      descripcion: "Guía oficial en español para crear y publicar repositorios en GitHub",
    },
  ],
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const C4_TEMAS: TemaC4[] = [
  tema1,  tema2,  tema3,  tema4,
  tema5,  tema6,  tema7,  tema8,
  tema9,  tema10, tema11, tema12,
  tema13, tema14, tema15, tema16,
];
