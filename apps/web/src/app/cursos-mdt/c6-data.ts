// ─── C6: Análisis de Datos con Excel e IA — Datos de 16 temas ────────────────
// Curso C6 del programa MDT. 16 temas (scaffolding).
// Módulo 1: Excel avanzado + Power Query
// Módulo 2: ChatGPT Code Interpreter para análisis
// Módulo 3: Tableau y Power BI básicos
// Módulo 4: Dashboards predictivos con IA

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

export interface TemaC6 {
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

export const C6_MODULOS = [
  { num: 1, nombre: "Excel Avanzado + Power Query", horas: 10, temas: 4 },
  { num: 2, nombre: "ChatGPT Code Interpreter para Análisis", horas: 10, temas: 4 },
  { num: 3, nombre: "Tableau y Power BI básicos", horas: 10, temas: 4 },
  { num: 4, nombre: "Dashboards Predictivos con IA", horas: 10, temas: 4 },
];

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC6 => ({
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

// ─── MÓDULO 1: EXCEL AVANZADO + POWER QUERY ──────────────────────────────────

const tema1: TemaC6 = {
  id: 1,
  titulo: "Excel avanzado: tablas dinámicas, BUSCARX y fórmulas de análisis",
  modulo: "Excel Avanzado + Power Query",
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Excel avanzado para análisis de datos — desde tablas dinámicas hasta Power Query",
  videoDuracion: "22 min",
  teoria: `Excel sigue siendo la herramienta de análisis de datos más usada en el mundo empresarial ecuatoriano. Según datos de Microsoft, más del 750 millones de personas lo usan activamente, y en Ecuador representa el 80% de las herramientas de análisis en PyMEs. Dominar sus funciones avanzadas antes de pasar a herramientas como Power BI o Python no es un paso atrás: es la base que permite entender qué hacen las herramientas más sofisticadas.

Las tablas dinámicas (PivotTables) son el motor de análisis de Excel. Permiten resumir, cruzar y comparar miles de registros en segundos sin escribir una sola fórmula. La clave para usarlas efectivamente es entender los cuatro campos: Filas (dimensión de análisis), Columnas (segunda dimensión), Valores (métrica a agregar) y Filtros (segmentación). Un error común es usar tablas dinámicas sobre datos sin normalizar — si hay celdas combinadas, filas vacías o columnas sin encabezado, la tabla dinámica fallará o dará resultados incorrectos.

BUSCARX (XLOOKUP) reemplazó a BUSCARV desde Excel 2019 con tres ventajas críticas: busca en cualquier dirección (no solo de izquierda a derecha), maneja errores de forma elegante con el cuarto argumento, y puede retornar múltiples columnas en una sola fórmula. Para análisis de datos empresariales en Ecuador, BUSCARX es especialmente útil para cruzar bases de clientes con listas de precios, tablas de RUC con datos tributarios, o registros de empleados con tablas de beneficios.

Las fórmulas de análisis más valiosas para trabajo diario son: SUMAR.SI.CONJUNTO y CONTAR.SI.CONJUNTO (para análisis condicional multivariable), PROMEDIO.SI (para promedios filtrados), PERCENTIL (para detectar outliers), DESVEST (para medir variabilidad) y las funciones de texto como TEXTO, EXTRAE y CONCATENAR para limpiar datos importados de sistemas ERP o SRI.

Power Query, integrado en Excel desde 2016, transforma Excel de una hoja de cálculo en una herramienta ETL (Extract, Transform, Load) básica. Permite conectar a múltiples fuentes, limpiar datos con pasos reproducibles grabados, y actualizar todo con un clic. La diferencia con copiar-pegar datos manualmente es enorme: Power Query genera un registro de pasos que puede repetirse cada mes sin errores humanos.`,
  presentacionSlides: [
    {
      titulo: "Por qué Excel sigue siendo fundamental",
      contenido:
        "750M usuarios globales. 80% de PyMEs ecuatorianas lo usan. Base para entender Power BI, Python y SQL. Dominar Excel avanzado = ventaja inmediata en el mercado laboral.",
    },
    {
      titulo: "Tablas dinámicas: los 4 campos clave",
      contenido:
        "Filas (dimensión), Columnas (segunda dimensión), Valores (métrica), Filtros (segmentación). Prerequisito: datos normalizados sin celdas combinadas ni filas vacías.",
    },
    {
      titulo: "BUSCARX vs BUSCARV — Por qué migrar",
      contenido:
        "BUSCARX: busca en cualquier dirección, maneja errores con 4to argumento, retorna múltiples columnas. BUSCARV: solo izquierda a derecha, falla con #N/A sin IFERROR extra.",
    },
    {
      titulo: "Fórmulas de análisis esenciales",
      contenido:
        "SUMAR.SI.CONJUNTO · CONTAR.SI.CONJUNTO · PROMEDIO.SI · PERCENTIL · DESVEST · EXTRAE · TEXTO. Para datos ecuatorianos: cruzar RUC, SRI, IESS.",
    },
    {
      titulo: "Power Query: ETL dentro de Excel",
      contenido:
        "Extract (conectar fuentes), Transform (limpiar con pasos grabados), Load (cargar a tabla). Actualización con 1 clic. Reemplaza el copiar-pegar mensual.",
    },
    {
      titulo: "Casos de uso en empresas ecuatorianas",
      contenido:
        "Conciliación bancaria automática. Cruce de facturación SRI con CRM. Análisis de nómina IESS. Reporte de ventas por región. Todo en Excel, sin programar.",
    },
    {
      titulo: "Errores más comunes en Excel analítico",
      contenido:
        "1. Datos sin normalizar (celdas combinadas). 2. Números guardados como texto. 3. Fechas en formatos mixtos. 4. Referencias absolutas/relativas incorrectas. 5. Fórmulas sin validación.",
    },
    {
      titulo: "Recursos para profundizar",
      contenido:
        "Microsoft Learn — Excel (gratis y oficial). ExcelJet.net — referencia de fórmulas. Chandoo.org — casos prácticos. YouTube: Excel Off The Grid.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es el requisito más importante para que una tabla dinámica funcione correctamente?",
      opciones: [
        "Que los datos estén en color azul",
        "Que los datos estén normalizados: sin celdas combinadas, sin filas vacías, con encabezados en cada columna",
        "Que Excel esté en versión 2010 o anterior",
        "Que los datos provengan de una base de datos SQL",
      ],
      respuesta: 1,
      explicacion:
        "Las tablas dinámicas requieren datos limpios y normalizados. Celdas combinadas, filas vacías o columnas sin encabezado generan resultados incorrectos o errores.",
    },
    {
      pregunta: "¿Cuál es la principal ventaja de BUSCARX sobre BUSCARV?",
      opciones: [
        "BUSCARX es más rápido en archivos pequeños",
        "BUSCARX solo funciona en Excel 365",
        "BUSCARX puede buscar en cualquier dirección y manejar errores con el cuarto argumento",
        "BUSCARX reemplaza automáticamente todas las fórmulas del libro",
      ],
      respuesta: 2,
      explicacion:
        "BUSCARX supera a BUSCARV porque no está limitado a buscar de izquierda a derecha, acepta un valor por defecto cuando no encuentra coincidencia (4to argumento), y puede retornar múltiples columnas.",
    },
    {
      pregunta: "¿Qué significa ETL en el contexto de Power Query?",
      opciones: [
        "Excel Table Language",
        "Extract, Transform, Load — extraer, transformar y cargar datos",
        "External Tool Link",
        "Enterprise Total Lookup",
      ],
      respuesta: 1,
      explicacion:
        "ETL (Extract, Transform, Load) es el proceso estándar de integración de datos: extraer de la fuente, transformar para limpiar y estructurar, y cargar al destino final. Power Query implementa este proceso dentro de Excel.",
    },
    {
      pregunta: "¿Cuál fórmula es más adecuada para sumar ventas de una región específica en un mes específico?",
      opciones: [
        "SUMA",
        "SUMAR.SI",
        "SUMAR.SI.CONJUNTO",
        "BUSCARV",
      ],
      respuesta: 2,
      explicacion:
        "SUMAR.SI.CONJUNTO permite aplicar múltiples condiciones simultáneamente (región Y mes), mientras SUMAR.SI solo acepta un criterio a la vez.",
    },
    {
      pregunta: "Un número almacenado como texto en Excel genera cuál problema principal:",
      opciones: [
        "El archivo se vuelve más pesado",
        "Las fórmulas de suma y promedio lo ignoran o arrojan 0",
        "Excel se cierra automáticamente",
        "El número se convierte en fecha",
      ],
      respuesta: 1,
      explicacion:
        "Los números guardados como texto no participan en cálculos matemáticos. SUMA los ignora, lo que provoca totales incorrectos. Es uno de los errores más frecuentes al importar datos de sistemas ERP o SRI.",
    },
  ],
  ejercicio: {
    titulo: "Análisis de ventas con tablas dinámicas y Power Query",
    objetivo:
      "Construir un reporte de ventas mensual automatizable usando tablas dinámicas y Power Query sobre datos reales de una empresa ecuatoriana.",
    herramientas: "Microsoft Excel 2019 o posterior (incluye Power Query), dataset de ventas en CSV",
    datosEjemplo:
      "Dataset: 2,400 registros de ventas de una ferretería en Quito. Columnas: fecha, factura, cliente, RUC, vendedor, producto, categoría, cantidad, precio_unitario, descuento, ciudad.",
    pasos: [
      "Paso 1 — Importar con Power Query: Abrir Excel, ir a Datos > Obtener Datos > Desde CSV. Importar el dataset. En el Editor de Power Query, revisar tipos de datos automáticos y corregir: fecha debe ser Date, precio_unitario y descuento deben ser Decimal.",
      "Paso 2 — Limpiar datos en Power Query: Agregar columna calculada 'monto_neto' = cantidad * precio_unitario * (1 - descuento). Filtrar registros con RUC vacío. Estandarizar texto de ciudad (mayúsculas) con función Transformar > Mayúsculas. Cerrar y cargar.",
      "Paso 3 — Tabla dinámica de ventas por mes y categoría: Insertar tabla dinámica desde la tabla cargada. Filas: mes (agrupando la fecha por mes), Columnas: categoría, Valores: suma de monto_neto. Aplicar formato de moneda.",
      "Paso 4 — Análisis de vendedores con SUMAR.SI.CONJUNTO: En una hoja separada, usar SUMAR.SI.CONJUNTO para calcular ventas por vendedor en el mes de diciembre. Comparar con la tabla dinámica para verificar resultados.",
      "Paso 5 — BUSCARX para cruzar datos: Crear tabla de comisiones por vendedor (porcentaje fijo). Usar BUSCARX para traer el porcentaje de comisión a la tabla de resultados. Calcular comisión total por vendedor.",
      "Paso 6 — Actualización automática: Modificar 5 registros del CSV original. Volver a Excel y usar Datos > Actualizar Todo. Verificar que todos los análisis se actualicen sin intervención manual. Documentar el proceso de actualización mensual en 3 pasos.",
    ],
    resultado:
      "Reporte de ventas con tabla dinámica por mes/categoría, análisis de comisiones por vendedor y proceso documentado de actualización mensual con Power Query.",
    criterios: [
      { criterio: "Importación correcta con Power Query y tipos de datos validados", puntos: 20 },
      { criterio: "Columna monto_neto calculada y datos limpios (ciudad estandarizada, RUC sin vacíos)", puntos: 20 },
      { criterio: "Tabla dinámica funcional con agrupación por mes y categoría", puntos: 25 },
      { criterio: "BUSCARX implementado correctamente para cruzar comisiones", puntos: 20 },
      { criterio: "Actualización automática demostrada y proceso documentado", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Microsoft Learn — Excel para análisis de datos",
      url: "https://learn.microsoft.com/es-es/training/paths/excel-data-analysis/",
      tipo: "documentacion",
      descripcion: "Ruta de aprendizaje oficial de Microsoft para análisis de datos con Excel",
    },
    {
      titulo: "ExcelJet — Referencia de fórmulas con ejemplos",
      url: "https://exceljet.net/",
      tipo: "herramienta",
      descripcion: "La mejor referencia en línea para fórmulas Excel con ejemplos descargables",
    },
    {
      titulo: "Microsoft Learn — Power Query",
      url: "https://learn.microsoft.com/es-es/power-query/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de Power Query con tutoriales paso a paso",
    },
    {
      titulo: "Chandoo.org — Excel para análisis empresarial",
      url: "https://chandoo.org/wp/",
      tipo: "lectura",
      descripcion: "Blog especializado en Excel avanzado con casos prácticos de negocios",
    },
  ],
};

const tema2: TemaC6 = placeholder(2, "Power Query avanzado: transformaciones y M Language", "Excel Avanzado + Power Query", 1);
const tema3: TemaC6 = placeholder(3, "Modelos de datos en Excel con Power Pivot", "Excel Avanzado + Power Query", 1);
const tema4: TemaC6 = placeholder(4, "Proyecto: dashboard de ventas automatizado en Excel", "Excel Avanzado + Power Query", 1);

// ─── MÓDULO 2: CHATGPT CODE INTERPRETER PARA ANÁLISIS ────────────────────────

const tema5: TemaC6 = placeholder(5, "Introducción a ChatGPT para análisis de datos", "ChatGPT Code Interpreter para Análisis", 2);

const tema6: TemaC6 = {
  id: 6,
  titulo: "ChatGPT Code Interpreter: análisis estadístico sin programar",
  modulo: "ChatGPT Code Interpreter para Análisis",
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "ChatGPT Code Interpreter — análisis de datos con IA sin escribir código",
  videoDuracion: "24 min",
  teoria: `ChatGPT Code Interpreter (ahora llamado Advanced Data Analysis en ChatGPT Plus) representa un cambio de paradigma en el análisis de datos: por primera vez, cualquier profesional puede realizar análisis estadísticos complejos, limpiar datos y generar visualizaciones usando lenguaje natural. La herramienta ejecuta código Python en un entorno seguro y aislado, mostrando los resultados directamente en la conversación.

Para usarlo, simplemente se sube un archivo (CSV, Excel, PDF, imagen) y se describe en español qué análisis se quiere realizar. ChatGPT escribe el código Python, lo ejecuta, y devuelve resultados. Si hay un error, el sistema lo detecta, corrige el código automáticamente y reintenta. Este ciclo de auto-corrección es lo que lo hace accesible para no programadores.

Los análisis más valiosos que Code Interpreter puede realizar para empresas ecuatorianas son: (1) Análisis exploratorio inicial — estadísticas descriptivas (media, mediana, moda, desviación estándar, percentiles), detección de valores atípicos y distribución de variables. (2) Limpieza de datos — identificar y tratar duplicados, valores nulos y formatos inconsistentes. (3) Correlaciones — identificar qué variables se relacionan con las ventas o con la satisfacción del cliente. (4) Visualizaciones profesionales — histogramas, box plots, scatter plots, series de tiempo — exportables como PNG. (5) Segmentación básica — agrupar clientes por comportamiento usando clustering simple.

La clave para obtener buenos resultados es la calidad del prompt. Un prompt débil produce análisis genérico; un prompt específico produce análisis accionable. Comparación: prompt débil — "analiza estos datos de ventas"; prompt fuerte — "Tengo datos de ventas de una distribuidora en Quito de enero a diciembre 2024. Necesito: 1) estadísticas descriptivas del monto_neto por mes, 2) detectar los 5 clientes con mayor variabilidad en sus compras mensuales, 3) gráfico de línea de ventas con tendencia superpuesta. Usa el campo fecha como serie de tiempo y exporta cada gráfico en alta resolución."

Una limitación importante: Code Interpreter no accede a internet ni a datos en tiempo real. Solo puede analizar los archivos que se le suben directamente. Además, no conserva memoria entre sesiones — cada conversación comienza de cero. Para análisis recurrentes, es más eficiente guardar los prompts más efectivos como plantillas y reutilizarlos cada mes.`,
  presentacionSlides: [
    {
      titulo: "¿Qué es ChatGPT Code Interpreter?",
      contenido:
        "Advanced Data Analysis en ChatGPT Plus. Ejecuta Python real en entorno seguro. Sube CSV/Excel → describe en español → recibe análisis completo. Sin instalar nada.",
    },
    {
      titulo: "Ciclo de auto-corrección",
      contenido:
        "ChatGPT escribe código → lo ejecuta → si hay error, detecta y corrige → reintenta automáticamente. El usuario solo describe qué quiere, no depura código.",
    },
    {
      titulo: "5 análisis clave para empresas ecuatorianas",
      contenido:
        "1. Estadísticas descriptivas (media, mediana, percentiles). 2. Limpieza de datos. 3. Correlaciones entre variables. 4. Visualizaciones exportables. 5. Segmentación de clientes.",
    },
    {
      titulo: "Prompt débil vs prompt fuerte",
      contenido:
        "Débil: 'analiza mis ventas'. Fuerte: contexto + variables específicas + análisis requeridos numerados + formato de salida esperado. La calidad del prompt = calidad del análisis.",
    },
    {
      titulo: "Limitaciones importantes",
      contenido:
        "Sin acceso a internet. Sin datos en tiempo real. Sin memoria entre sesiones. Máximo de archivo: 512 MB. Solución: prompt-plantillas reutilizables para análisis mensual.",
    },
    {
      titulo: "Visualizaciones que genera",
      contenido:
        "Histogramas · Box plots · Scatter plots con regresión · Series de tiempo con tendencia · Mapas de calor de correlación · Gráficos de barras apiladas. Exportables en PNG.",
    },
    {
      titulo: "Integración con Excel",
      contenido:
        "Flujo recomendado: Power Query (limpiar en Excel) → exportar CSV → Code Interpreter (análisis estadístico) → descargar gráficos → pegar en reporte final.",
    },
    {
      titulo: "Casos de uso con datos ecuatorianos",
      contenido:
        "Análisis de cartera de crédito cooperativas. Estacionalidad de ventas retail. Correlación entre publicidad y ventas. Segmentación de deudores por riesgo. Tendencias de precios agrícolas.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué lenguaje de programación ejecuta ChatGPT Code Interpreter en segundo plano?",
      opciones: ["JavaScript", "R", "Python", "SQL"],
      respuesta: 2,
      explicacion:
        "Code Interpreter ejecuta Python en un entorno aislado y seguro. El usuario no necesita conocer Python — ChatGPT escribe y ejecuta el código automáticamente basándose en instrucciones en lenguaje natural.",
    },
    {
      pregunta: "¿Cuál es la diferencia principal entre un prompt débil y un prompt fuerte para análisis de datos?",
      opciones: [
        "El prompt fuerte usa términos técnicos en inglés",
        "El prompt fuerte incluye contexto, variables específicas, análisis numerados y formato de salida esperado",
        "El prompt fuerte es más corto y conciso",
        "El prompt débil genera mejores gráficos",
      ],
      respuesta: 1,
      explicacion:
        "Un prompt fuerte especifica el contexto del negocio, los campos del dataset, los análisis específicos que se requieren y el formato de salida. Esta precisión genera resultados directamente accionables.",
    },
    {
      pregunta: "¿Cuál es una limitación real de ChatGPT Code Interpreter?",
      opciones: [
        "Solo puede analizar archivos Excel, no CSV",
        "Solo funciona en inglés",
        "No accede a internet ni conserva memoria entre sesiones",
        "Solo puede generar gráficos de barras",
      ],
      respuesta: 2,
      explicacion:
        "Code Interpreter opera en un entorno aislado sin acceso a internet y no conserva datos entre conversaciones. Cada sesión comienza limpia, lo que requiere subir los archivos nuevamente.",
    },
    {
      pregunta: "¿Para qué tipo de análisis es más valioso Code Interpreter respecto a Excel?",
      opciones: [
        "Para calcular sumas simples",
        "Para crear tablas dinámicas",
        "Para análisis estadístico avanzado, correlaciones y visualizaciones tipo box plot o scatter plot",
        "Para formatear celdas y aplicar estilos",
      ],
      respuesta: 2,
      explicacion:
        "Excel es superior para análisis tabulares y dashboards dinámicos. Code Interpreter brilla en análisis estadístico (distribuciones, correlaciones, outliers) y visualizaciones científicas que Excel no genera de forma nativa.",
    },
    {
      pregunta: "¿Cuál es el flujo recomendado para combinar Excel y Code Interpreter?",
      opciones: [
        "Code Interpreter primero, luego Excel para limpiar",
        "Power Query (limpiar en Excel) → exportar CSV → Code Interpreter (análisis estadístico) → descargar resultados",
        "Usar solo Code Interpreter, Excel es obsoleto",
        "Importar directamente desde SQL a Code Interpreter",
      ],
      respuesta: 1,
      explicacion:
        "El flujo óptimo aprovecha las fortalezas de cada herramienta: Power Query para limpieza y transformación estructurada, Code Interpreter para análisis estadístico avanzado y visualizaciones científicas.",
    },
  ],
  ejercicio: {
    titulo: "Análisis estadístico completo con ChatGPT Code Interpreter",
    objetivo:
      "Realizar un análisis exploratorio completo de datos empresariales ecuatorianos usando únicamente prompts en español en ChatGPT Plus.",
    herramientas: "ChatGPT Plus (con Advanced Data Analysis activado), dataset de ventas en CSV",
    datosEjemplo:
      "Dataset: 1,800 registros de ventas mensuales de una importadora en Guayaquil. Variables: fecha, cliente, sector (retail/industrial/gobierno), monto, días_de_pago, vendedor, región.",
    pasos: [
      "Paso 1 — Subir dataset y análisis inicial: Subir el CSV a ChatGPT con Advanced Data Analysis. Usar el prompt: 'Tengo datos de ventas de una importadora ecuatoriana 2024. Muéstrame: dimensiones del dataset, estadísticas descriptivas de todas las variables numéricas, y cuántos valores nulos hay por columna.'",
      "Paso 2 — Análisis de distribución: Pedir: 'Genera un histograma del monto de venta con la curva de distribución normal superpuesta. Identifica si hay outliers usando el método IQR (rango intercuartílico) y lista los 10 registros más atípicos con su cliente y monto.'",
      "Paso 3 — Análisis de correlaciones: Solicitar: 'Crea un mapa de calor de correlación entre monto, días_de_pago y cualquier variable numérica disponible. Explica en español cuáles correlaciones son estadísticamente significativas y qué implica para el negocio.'",
      "Paso 4 — Segmentación por sector: Pedir: 'Compara las ventas por sector (retail, industrial, gobierno) usando box plots. Calcula la media, mediana y desviación estándar por sector. ¿Qué sector tiene mayor variabilidad en sus compras?'",
      "Paso 5 — Serie de tiempo con tendencia: Solicitar: 'Agrupa las ventas por mes y crea un gráfico de serie de tiempo con la tendencia lineal superpuesta. Identifica los 3 meses con ventas más bajas y los 3 más altos. Exporta el gráfico en alta resolución.'",
      "Paso 6 — Resumen ejecutivo: Pedir a ChatGPT: 'Basado en todos los análisis anteriores, redacta un resumen ejecutivo de 5 puntos con los hallazgos más importantes y 3 recomendaciones accionables para el gerente de ventas de esta importadora ecuatoriana.'",
    ],
    resultado:
      "Análisis exploratorio completo con 4 visualizaciones exportadas y resumen ejecutivo con hallazgos y recomendaciones.",
    criterios: [
      { criterio: "Prompts estructurados con contexto, variables y análisis específicos", puntos: 20 },
      { criterio: "Histograma con detección de outliers usando IQR", puntos: 20 },
      { criterio: "Mapa de calor de correlaciones con interpretación de negocio", puntos: 20 },
      { criterio: "Serie de tiempo con tendencia y análisis de estacionalidad", puntos: 20 },
      { criterio: "Resumen ejecutivo con 5 hallazgos y 3 recomendaciones accionables", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "ChatGPT Advanced Data Analysis — Guía oficial",
      url: "https://help.openai.com/en/articles/8437071-advanced-data-analysis",
      tipo: "documentacion",
      descripcion: "Documentación oficial de OpenAI sobre Advanced Data Analysis (Code Interpreter)",
    },
    {
      titulo: "Microsoft Learn — Análisis estadístico aplicado",
      url: "https://learn.microsoft.com/es-es/training/paths/data-analysis-excel/",
      tipo: "lectura",
      descripcion: "Conceptos estadísticos fundamentales para análisis de datos empresariales",
    },
    {
      titulo: "Seaborn — Galería de visualizaciones Python",
      url: "https://seaborn.pydata.org/examples/index.html",
      tipo: "herramienta",
      descripcion: "Referencia visual de todos los tipos de gráficos que Code Interpreter puede generar",
    },
    {
      titulo: "Towards Data Science — Exploratory Data Analysis",
      url: "https://towardsdatascience.com/exploratory-data-analysis-8fc1cb20fd15",
      tipo: "lectura",
      descripcion: "Guía práctica de análisis exploratorio de datos con ejemplos reales",
    },
  ],
};

const tema7: TemaC6 = placeholder(7, "Prompts avanzados para análisis de datos con IA", "ChatGPT Code Interpreter para Análisis", 2);
const tema8: TemaC6 = placeholder(8, "Proyecto: análisis de datos de tu empresa con Code Interpreter", "ChatGPT Code Interpreter para Análisis", 2);

// ─── MÓDULO 3: TABLEAU Y POWER BI BÁSICOS ────────────────────────────────────

const tema9: TemaC6 = placeholder(9, "Introducción a Power BI Desktop: interfaz y primeros pasos", "Tableau y Power BI básicos", 3);
const tema10: TemaC6 = placeholder(10, "DAX básico: medidas y columnas calculadas", "Tableau y Power BI básicos", 3);

const tema11: TemaC6 = {
  id: 11,
  titulo: "Tableau Public: visualizaciones interactivas para comunicar datos",
  modulo: "Tableau y Power BI básicos",
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Tableau Public — del dato a la visualización interactiva en 60 minutos",
  videoDuracion: "26 min",
  teoria: `Tableau es considerada la herramienta de visualización de datos más intuitiva del mercado enterprise. Su versión gratuita, Tableau Public, permite crear visualizaciones interactivas de nivel profesional y publicarlas en línea. Para analistas de datos en Ecuador, Tableau Public es además un portafolio en línea: cada visualización publicada tiene una URL única que puede compartirse en LinkedIn o enviarse a empleadores.

La filosofía de diseño de Tableau se basa en el principio de "show me" (muéstrame): el sistema sugiere automáticamente el tipo de gráfico más apropiado según el tipo de variables seleccionadas (dimensiones vs métricas, continuo vs discreto). Esto acelera enormemente el proceso de exploración visual — en lugar de decidir qué gráfico usar, simplemente se arrastran campos al lienzo y Tableau propone opciones.

Los conceptos fundamentales de Tableau son: (1) Dimensiones (texto, fechas, geografía) vs Métricas (números que se agregan); (2) Marks (el elemento visual: barra, línea, punto, mapa); (3) Shelves (Columns, Rows, Color, Size, Text, Detail) donde se arrastran los campos; (4) Calculated Fields — fórmulas personalizadas similares a Excel; (5) Filters — segmentación en múltiples capas.

Para datos ecuatorianos, las visualizaciones más impactantes en Tableau son los mapas. Tableau tiene soporte nativo para provincias y cantones del Ecuador — al conectar un campo de geografía, puede colorearse automáticamente el mapa del país por provincia con los valores de la métrica (ventas, clientes, incidentes, etc.). Esta visualización, imposible de replicar fácilmente en Excel, es extremadamente poderosa para presentaciones a directivos o clientes.

La diferencia entre Tableau y Power BI en el contexto ecuatoriano: Power BI es más común en empresas que ya usan ecosistema Microsoft (Office 365, Azure), tiene mejor integración con Excel y su modelo de precios favorece a organizaciones. Tableau es más flexible visualmente, más intuitivo para usuarios sin formación técnica, y su versión gratuita (Tableau Public) es más capaz que el free tier de Power BI. Para portafolio personal, Tableau Public es superior.`,
  presentacionSlides: [
    {
      titulo: "Tableau vs Power BI: cuándo usar cada uno",
      contenido:
        "Tableau: más flexible, intuitivo, Tableau Public gratuito, ideal para portafolio. Power BI: mejor integración Microsoft, más común en empresas con Office 365. Ambos son habilidades muy demandadas.",
    },
    {
      titulo: "Filosofía 'Show Me' de Tableau",
      contenido:
        "Arrastra campos → Tableau sugiere el gráfico apropiado según el tipo de datos. Dimensiones (texto/fecha) + Métricas (números) = visualización automática. Exploración visual en segundos.",
    },
    {
      titulo: "Conceptos clave de Tableau",
      contenido:
        "Dimensiones vs Métricas · Marks (barra/línea/punto/mapa) · Shelves (Columns, Rows, Color, Size, Text) · Calculated Fields · Filters en capas.",
    },
    {
      titulo: "Mapas de Ecuador en Tableau",
      contenido:
        "Soporte nativo para provincias y cantones del Ecuador. Coloreado automático por métrica. Mapa de calor de ventas por provincia → visualización imposible de replicar en Excel fácilmente.",
    },
    {
      titulo: "Tableau Public como portafolio profesional",
      contenido:
        "Cada vizualización tiene URL única. Compartible en LinkedIn. Empleadores verifican portafolio directamente. public.tableau.com/profile/[tu-nombre] → tu carta de presentación digital.",
    },
    {
      titulo: "Dashboard interactivo: componentes clave",
      contenido:
        "Sheets (gráficos individuales) + Dashboard (composición). Actions: filtros cruzados entre gráficos al hacer clic. Parámetros: controles interactivos para el usuario.",
    },
    {
      titulo: "Flujo de trabajo recomendado",
      contenido:
        "1. Conectar fuente (CSV/Excel/Sheets). 2. Explorar con Show Me. 3. Refinar visualizaciones. 4. Ensamblar dashboard. 5. Publicar en Tableau Public. 6. Compartir URL.",
    },
    {
      titulo: "Recursos de aprendizaje gratuitos",
      contenido:
        "Tableau Training Videos (tableau.com/learn). Tableau Public Gallery (inspiración). #MakeoverMonday — reto semanal de la comunidad. Tableau User Group Ecuador.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué es Tableau Public y cuál es su principal ventaja?",
      opciones: [
        "Una versión de pago de Tableau para empresas públicas del Ecuador",
        "La versión gratuita de Tableau que permite crear y publicar visualizaciones en línea con URL compartible",
        "Un plugin de Excel para importar datos",
        "Una herramienta exclusiva para datos geográficos",
      ],
      respuesta: 1,
      explicacion:
        "Tableau Public es la versión gratuita de Tableau. Permite crear visualizaciones profesionales y publicarlas con URLs únicas, funcionando como portafolio en línea para analistas de datos.",
    },
    {
      pregunta: "En Tableau, ¿qué diferencia una 'Dimensión' de una 'Métrica'?",
      opciones: [
        "Las dimensiones son números y las métricas son textos",
        "Las dimensiones son atributos cualitativos (texto, fecha, geografía) y las métricas son valores numéricos que se agregan",
        "Las dimensiones son más importantes que las métricas",
        "No hay diferencia, son términos sinónimos",
      ],
      respuesta: 1,
      explicacion:
        "En Tableau, las Dimensiones son campos cualitativos que segmentan los datos (región, producto, fecha), mientras que las Métricas son valores numéricos que se agregan con operaciones como suma, promedio o conteo.",
    },
    {
      pregunta: "¿Cuál es la principal ventaja de Tableau para visualizar datos geográficos de Ecuador?",
      opciones: [
        "Requiere instalar un plugin especial para Ecuador",
        "Solo funciona con coordenadas GPS exactas",
        "Tiene soporte nativo para provincias y cantones del Ecuador, permitiendo mapas coloreados automáticamente",
        "Los mapas solo están disponibles en la versión de pago",
      ],
      respuesta: 2,
      explicacion:
        "Tableau incluye datos geográficos de Ecuador de forma nativa. Al conectar un campo de provincia o cantón, genera automáticamente un mapa coloreado por la métrica seleccionada, sin configuración adicional.",
    },
    {
      pregunta: "¿Qué son las 'Actions' en un dashboard de Tableau?",
      opciones: [
        "Los botones de exportar a PDF",
        "Filtros cruzados que conectan múltiples gráficos: al hacer clic en un elemento, todos los gráficos del dashboard se filtran",
        "Las animaciones de entrada de los gráficos",
        "Los comandos de SQL que ejecuta Tableau",
      ],
      respuesta: 1,
      explicacion:
        "Las Actions en Tableau crean interactividad entre hojas del dashboard. Al hacer clic en una barra o punto, todos los gráficos conectados se filtran automáticamente, permitiendo exploración profunda de los datos.",
    },
    {
      pregunta: "¿En qué situación conviene elegir Power BI sobre Tableau?",
      opciones: [
        "Cuando se necesita portafolio público en línea",
        "Cuando el analista no tiene formación técnica",
        "Cuando la empresa ya usa Office 365 y Azure, aprovechando la integración nativa con el ecosistema Microsoft",
        "Cuando se requieren visualizaciones más creativas",
      ],
      respuesta: 2,
      explicacion:
        "Power BI se integra de forma nativa con Office 365, Teams, Azure y SharePoint, lo que lo hace más eficiente en organizaciones del ecosistema Microsoft. Tableau es más flexible visualmente y superior para portafolio personal.",
    },
  ],
  ejercicio: {
    titulo: "Dashboard interactivo de indicadores empresariales en Tableau Public",
    objetivo:
      "Crear y publicar un dashboard interactivo de 3 visualizaciones en Tableau Public con datos de una empresa ecuatoriana.",
    herramientas: "Tableau Public (gratuito en public.tableau.com), dataset en CSV o Excel",
    datosEjemplo:
      "Dataset: indicadores de 12 sucursales de una cadena de farmacias en Ecuador. Variables: provincia, ciudad, ventas_mes, clientes_atendidos, ticket_promedio, productos_top3.",
    pasos: [
      "Paso 1 — Configurar Tableau Public: Crear cuenta gratuita en public.tableau.com. Descargar Tableau Public Desktop. Conectar el dataset de farmacias como fuente de datos.",
      "Paso 2 — Mapa de ventas por provincia: Crear Sheet 1. Arrastrar 'provincia' al área de visualización — Tableau detecta geografía automáticamente. Arrastrar 'ventas_mes' a Color. Ajustar paleta de colores a degradado azul-gold (colores ITSEIA). Agregar etiquetas de ciudad.",
      "Paso 3 — Gráfico de barras de ticket promedio: Crear Sheet 2. Filas: ciudad (ordenada descendente por ticket). Columnas: ticket_promedio. Añadir referencia de línea con el promedio nacional. Colorear barras por encima/abajo del promedio.",
      "Paso 4 — Serie de tiempo de clientes: Crear Sheet 3 (requiere agregar columna de mes al dataset). Eje X: mes. Eje Y: clientes_atendidos. Línea con puntos. Añadir tendencia lineal.",
      "Paso 5 — Ensamblar dashboard: Crear nuevo Dashboard. Arrastrar los 3 sheets. Ajustar tamaño a 1200x800px. Agregar Actions: filtro cruzado al hacer clic en provincia del mapa. Añadir título y fuente de datos.",
      "Paso 6 — Publicar y compartir: Publicar en Tableau Public con título descriptivo. Copiar URL pública. Agregar descripción del dataset. Compartir URL en el portafolio y documentar qué decisión de negocio responde cada visualización.",
    ],
    resultado:
      "Dashboard publicado en Tableau Public con URL compartible, mapa de Ecuador por provincia, gráfico de barras comparativo y serie de tiempo con filtros cruzados.",
    criterios: [
      { criterio: "Mapa de Ecuador coloreado por métrica con etiquetas de ciudad", puntos: 25 },
      { criterio: "Gráfico de barras con línea de referencia de promedio nacional", puntos: 20 },
      { criterio: "Serie de tiempo con tendencia lineal", puntos: 20 },
      { criterio: "Dashboard ensamblado con Actions (filtros cruzados funcionando)", puntos: 20 },
      { criterio: "Publicado en Tableau Public con URL compartible y descripción", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Tableau Public — Plataforma gratuita",
      url: "https://public.tableau.com/",
      tipo: "herramienta",
      descripcion: "Plataforma gratuita de Tableau para crear y publicar visualizaciones interactivas",
    },
    {
      titulo: "Tableau Training — Videos oficiales gratuitos",
      url: "https://www.tableau.com/learn/training",
      tipo: "documentacion",
      descripcion: "Videos de entrenamiento oficiales de Tableau organizados por nivel",
    },
    {
      titulo: "Power BI — Microsoft Learn",
      url: "https://learn.microsoft.com/es-es/power-bi/",
      tipo: "documentacion",
      descripcion: "Documentación oficial y tutoriales de Power BI en español",
    },
    {
      titulo: "powerbi.microsoft.com — Power BI Desktop gratuito",
      url: "https://powerbi.microsoft.com/es-es/desktop/",
      tipo: "herramienta",
      descripcion: "Descarga gratuita de Power BI Desktop para Windows",
    },
  ],
};

const tema12: TemaC6 = placeholder(12, "Proyecto: comparativa Tableau vs Power BI con datos reales", "Tableau y Power BI básicos", 3);

// ─── MÓDULO 4: DASHBOARDS PREDICTIVOS CON IA ─────────────────────────────────

const tema13: TemaC6 = placeholder(13, "Introducción a modelos predictivos: regresión y pronóstico", "Dashboards Predictivos con IA", 4);
const tema14: TemaC6 = placeholder(14, "Power BI + Azure Machine Learning: predicciones sin código", "Dashboards Predictivos con IA", 4);
const tema15: TemaC6 = placeholder(15, "Alertas automáticas y monitoreo de KPIs con IA", "Dashboards Predictivos con IA", 4);

const tema16: TemaC6 = {
  id: 16,
  titulo: "Proyecto final: dashboard predictivo de ventas con IA integrada",
  modulo: "Dashboards Predictivos con IA",
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Dashboard predictivo completo — de los datos históricos al forecast inteligente",
  videoDuracion: "30 min",
  teoria: `Un dashboard predictivo combina visualización de datos históricos con modelos de machine learning que proyectan valores futuros. A diferencia de un dashboard descriptivo (que muestra qué pasó), un dashboard predictivo responde "qué va a pasar si las condiciones actuales se mantienen" y "qué debería pasar para alcanzar la meta".

El componente predictivo más accesible para empresas ecuatorianas sin equipo de data science es el forecasting de series de tiempo. Las ventas mensuales, el flujo de caja, el número de clientes activos y la demanda de inventario son todos ejemplos de series de tiempo — secuencias ordenadas cronológicamente donde el pasado informa el futuro. Herramientas como Power BI (con su función de pronóstico integrada), Google Sheets (con FORECAST.ETS) y ChatGPT Code Interpreter (con Prophet) pueden generar estas predicciones sin necesidad de programación avanzada.

La arquitectura de un dashboard predictivo empresarial tiene cuatro capas: (1) Datos históricos — mínimo 12-24 meses para modelos estacionales confiables; (2) Procesamiento — limpieza, normalización y cálculo de variables adicionales (crecimiento mes anterior, promedio móvil de 3 meses); (3) Modelo predictivo — puede ser tan simple como una regresión lineal o tan sofisticado como Prophet con variables exógenas; (4) Visualización — la predicción siempre debe mostrarse con intervalos de confianza, no como una línea exacta, para comunicar la incertidumbre inherente.

Para el contexto ecuatoriano, los dashboards predictivos más valiosos son: predicción de flujo de caja para gestión de liquidez (crítico para PyMEs que financian operación con crédito), predicción de demanda por SKU para optimización de inventario (el 30-40% del capital de trabajo de distribuidoras está atrapado en inventario inmovilizado), y predicción de riesgo de churn de clientes para activación proactiva de retención.

Las mejores prácticas de presentación de dashboards predictivos son: mostrar siempre el error histórico del modelo (si predijo 100 y fue 85, el error es 15%), actualizar las predicciones automáticamente cuando lleguen datos nuevos, y nunca presentar un pronóstico sin explicar sus supuestos ("este modelo asume que no habrá cambios en política económica ni en patrones de consumo post-pandemia").`,
  presentacionSlides: [
    {
      titulo: "Dashboard descriptivo vs predictivo",
      contenido:
        "Descriptivo: '¿Qué pasó?' — historial de ventas. Predictivo: '¿Qué va a pasar?' + '¿Qué debería pasar para cumplir la meta?' Ambos en un solo panel integrado.",
    },
    {
      titulo: "¿Por qué series de tiempo para Ecuador?",
      contenido:
        "Ventas mensuales, flujo de caja, demanda de inventario, clientes activos — todos son series de tiempo. Mínimo 12-24 meses históricos para modelos estacionales confiables.",
    },
    {
      titulo: "Las 4 capas de un dashboard predictivo",
      contenido:
        "1. Datos históricos (12-24 meses). 2. Procesamiento (limpieza, variables adicionales). 3. Modelo predictivo (regresión, Prophet). 4. Visualización con intervalos de confianza.",
    },
    {
      titulo: "Herramientas accesibles para pronóstico",
      contenido:
        "Power BI: función de pronóstico integrada (clic derecho en serie). Google Sheets: FORECAST.ETS. ChatGPT Code Interpreter: Prophet. Sin programación requerida.",
    },
    {
      titulo: "Los 3 dashboards predictivos más valiosos en Ecuador",
      contenido:
        "1. Predicción de flujo de caja (gestión de liquidez PyMEs). 2. Predicción de demanda por SKU (liberar capital en inventario). 3. Predicción de churn de clientes (retención proactiva).",
    },
    {
      titulo: "Intervalos de confianza: comunicar incertidumbre",
      contenido:
        "Nunca mostrar predicción como línea exacta. Siempre incluir banda de confianza (ej: 80% o 95%). Mostrar error histórico del modelo. Explicar supuestos del pronóstico.",
    },
    {
      titulo: "Actualización automática del dashboard predictivo",
      contenido:
        "Power BI: scheduled refresh desde fuente. Google Sheets: importar desde API o formulario. Objetivo: el modelo se re-entrena automáticamente con datos nuevos cada mes.",
    },
    {
      titulo: "Presentación a la dirección",
      contenido:
        "Frame: 'Si nada cambia, llegaremos a X'. 'Para llegar a Y, necesitamos Z'. Mostrar 3 escenarios: conservador, base, optimista. Ligar predicción a decisión de negocio específica.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuántos meses de datos históricos se recomiendan mínimo para un modelo de pronóstico estacional confiable?",
      opciones: ["3 meses", "6 meses", "12-24 meses", "5 años"],
      respuesta: 2,
      explicacion:
        "Para capturar patrones estacionales (que se repiten anualmente), el modelo necesita al menos 12 meses. Con 24 meses se pueden identificar tendencias de largo plazo además de la estacionalidad.",
    },
    {
      pregunta: "¿Por qué los dashboards predictivos siempre deben mostrar intervalos de confianza?",
      opciones: [
        "Porque es un requisito legal en Ecuador",
        "Para hacer el gráfico más colorido y atractivo",
        "Para comunicar la incertidumbre inherente de las predicciones y evitar que se tomen como valores exactos",
        "Porque Power BI los genera automáticamente sin opción de desactivarlos",
      ],
      respuesta: 2,
      explicacion:
        "Los intervalos de confianza comunican honestamente el rango probable de valores futuros. Presentar predicciones sin intervalos lleva a decisiones basadas en falsa precisión.",
    },
    {
      pregunta: "¿Cuál es la herramienta de pronóstico más accesible integrada en Power BI?",
      opciones: [
        "Hay que programar en R o Python obligatoriamente",
        "La función de pronóstico integrada accesible con clic derecho en una serie de tiempo",
        "Se debe contratar Azure Machine Learning separadamente",
        "Power BI no tiene capacidades de pronóstico",
      ],
      respuesta: 1,
      explicacion:
        "Power BI incluye una función de pronóstico nativa accesible desde el panel de Analytics de cualquier gráfico de línea. Permite configurar períodos a proyectar e intervalos de confianza sin código.",
    },
    {
      pregunta: "¿Cuál es el dashboard predictivo de mayor impacto inmediato para una PyME ecuatoriana?",
      opciones: [
        "Predicción del precio del petróleo",
        "Pronóstico de la tasa de cambio EUR/USD",
        "Predicción de flujo de caja para gestión de liquidez",
        "Predicción de tendencias de redes sociales",
      ],
      respuesta: 2,
      explicacion:
        "Las PyMEs ecuatorianas frecuentemente enfrentan problemas de liquidez porque no anticipan sus necesidades de caja. Un dashboard predictivo de flujo de caja permite planificar financiamiento con anticipación.",
    },
    {
      pregunta: "Al presentar un pronóstico a la dirección, ¿cuál es el enfoque más efectivo?",
      opciones: [
        "Mostrar solo el valor exacto predicho sin contexto",
        "Presentar tres escenarios (conservador, base, optimista) y ligar cada uno a una decisión de negocio específica",
        "Evitar hablar de incertidumbre para no generar preocupación",
        "Presentar únicamente datos históricos y omitir la proyección",
      ],
      respuesta: 1,
      explicacion:
        "Los tres escenarios dan a la dirección un rango de posibilidades para planificar. Al ligar cada escenario a una decisión concreta ('si el conservador se cumple, activamos plan B'), el pronóstico se convierte en herramienta de gestión.",
    },
  ],
  ejercicio: {
    titulo: "Proyecto final: dashboard predictivo integrado con Power BI + Code Interpreter",
    objetivo:
      "Construir un dashboard predictivo completo que combine datos históricos, pronóstico automatizado e indicadores en tiempo real para una empresa ecuatoriana.",
    herramientas:
      "Power BI Desktop (gratuito), ChatGPT Plus con Advanced Data Analysis, Google Sheets, dataset de ventas 24 meses",
    datosEjemplo:
      "Dataset: 24 meses de ventas de una cadena de tiendas de ropa en Quito, Guayaquil y Cuenca. Variables: fecha, ciudad, canal (físico/online), categoría, unidades, monto, devoluciones.",
    pasos: [
      "Paso 1 — Análisis exploratorio en Code Interpreter: Subir dataset a ChatGPT. Pedir: análisis de estacionalidad por mes, detección de tendencia general, identificación de ciudades con mayor crecimiento YoY. Exportar gráficos.",
      "Paso 2 — Pronóstico con Prophet en Code Interpreter: Pedir a ChatGPT: 'Usa Prophet para proyectar las ventas totales de los próximos 6 meses con intervalo de confianza del 80%. Genera gráfico con histórico + pronóstico. Exporta los valores predichos como CSV.'",
      "Paso 3 — Importar datos a Power BI: Conectar el dataset original más el CSV de pronóstico exportado. En Power Query, unir ambas tablas en una única serie de tiempo. Crear columna 'tipo': histórico o predicción.",
      "Paso 4 — Dashboard en Power BI: Sheet 1: serie de tiempo histórico + pronóstico con banda de confianza. Sheet 2: mapa de Ecuador con ventas por ciudad. Sheet 3: tabla de KPIs (ventas actuales vs meta vs pronóstico). Aplicar tema de colores con navy #1F2F58 y gold #FBBC0C.",
      "Paso 5 — Indicadores de alerta: Crear medidas DAX para: variación porcentual mes actual vs mes anterior, porcentaje de cumplimiento de meta, días restantes del mes con proyección de cierre. Agregar formato condicional: verde si cumple meta, rojo si está por debajo.",
      "Paso 6 — Presentación ejecutiva: Preparar presentación de 5 minutos usando el dashboard. Estructura: situación actual → pronóstico → escenarios (conservador/base/optimista) → recomendación de acción. Grabar en video o presentar en vivo.",
    ],
    resultado:
      "Dashboard predictivo publicado en Power BI con pronóstico de 6 meses, indicadores de alerta y presentación ejecutiva de 5 minutos.",
    criterios: [
      { criterio: "Análisis exploratorio con detección de estacionalidad y tendencia", puntos: 15 },
      { criterio: "Pronóstico Prophet exportado correctamente con intervalos de confianza", puntos: 20 },
      { criterio: "Dashboard Power BI funcional con histórico + pronóstico integrados", puntos: 25 },
      { criterio: "Indicadores de alerta con formato condicional (DAX)", puntos: 20 },
      { criterio: "Presentación ejecutiva de 5 minutos con 3 escenarios y recomendaciones", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "powerbi.microsoft.com — Power BI Desktop",
      url: "https://powerbi.microsoft.com/es-es/desktop/",
      tipo: "herramienta",
      descripcion: "Descarga gratuita de Power BI Desktop para Windows",
    },
    {
      titulo: "Microsoft Learn — Power BI pronósticos",
      url: "https://learn.microsoft.com/es-es/power-bi/transform-model/desktop-analytics-pane",
      tipo: "documentacion",
      descripcion: "Documentación oficial del panel de Analytics y pronósticos en Power BI",
    },
    {
      titulo: "Prophet — Facebook Forecasting",
      url: "https://facebook.github.io/prophet/",
      tipo: "herramienta",
      descripcion: "Librería de pronóstico de series de tiempo de Meta, accesible desde Code Interpreter",
    },
    {
      titulo: "Towards Data Science — Time Series Forecasting",
      url: "https://towardsdatascience.com/time-series-forecasting-with-prophet-in-python-4673fdd8ba76",
      tipo: "lectura",
      descripcion: "Guía práctica de forecasting con Prophet con ejemplos en Python",
    },
  ],
};

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const C6_TEMAS: TemaC6[] = [
  tema1,  tema2,  tema3,  tema4,
  tema5,  tema6,  tema7,  tema8,
  tema9,  tema10, tema11, tema12,
  tema13, tema14, tema15, tema16,
];
