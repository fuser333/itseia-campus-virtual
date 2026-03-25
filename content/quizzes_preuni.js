#!/usr/bin/env node
/**
 * quizzes_preuni.js
 * Creates quizzes for the 16 Preuniversitario IA sessions without quizzes.
 * Checkpoint days (5, 10, 15, 20) already have quizzes -> skipped automatically.
 *
 * Run: node content/quizzes_preuni.js
 */

const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';

const H     = { apikey: SKEY, Authorization: 'Bearer ' + SKEY, 'Content-Type': 'application/json' };
const H_R   = { ...H, Prefer: 'return=representation' };
const H_MIN = { ...H, Prefer: 'return=minimal' };

async function get(path) {
  const r = await fetch(BASE + path, { headers: H });
  if (!r.ok) throw new Error(`GET ${path} -> ${r.status}: ${await r.text()}`);
  return r.json();
}

async function post(table, body) {
  const r = await fetch(`${BASE}/${table}`, { method: 'POST', headers: H_R, body: JSON.stringify(body) });
  const data = await r.json();
  if (r.status !== 201) throw new Error(`POST ${table} -> ${r.status}: ${JSON.stringify(data).slice(0, 300)}`);
  return Array.isArray(data) ? data[0] : data;
}

async function postMin(table, body) {
  const r = await fetch(`${BASE}/${table}`, { method: 'POST', headers: H_MIN, body: JSON.stringify(body) });
  if (r.status !== 201) throw new Error(`POST ${table} minimal -> ${r.status}: ${(await r.text()).slice(0, 300)}`);
}

function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

// options JSON string: '[{"id":"a","text":"...","is_correct":true},...]'
function opts(a, b, c, d, correct) {
  return JSON.stringify([
    { id: 'a', text: a, is_correct: correct === 'a' },
    { id: 'b', text: b, is_correct: correct === 'b' },
    { id: 'c', text: c, is_correct: correct === 'c' },
    { id: 'd', text: d, is_correct: correct === 'd' }
  ]);
}

// ── Session IDs (verified from DB 2026-03-22) ────────────────────────────────
// Format: { sessionId, quizTitle, questions: [{q, options, exp}] }

const SESSIONS_TO_CREATE = [

  // ══════════════════════════════════════════════════════════════════════════
  // SEMANA 1 - Fundamentos de IA Aplicada
  // ══════════════════════════════════════════════════════════════════════════

  {
    sessionId: '4646472c-5177-40c6-9f03-9c9eb9b41bd5',
    title: 'Dia 1: Bienvenida al Futuro con IA',
    quizTitle: 'Quiz Dia 1 - Que es la IA y primeras herramientas',
    questions: [
      {
        q: 'Que significa la sigla "IA" en tecnologia?',
        options: opts('Inteligencia Artificial', 'Internet Avanzado', 'Informacion Automatizada', 'Instruccion Algoritmica', 'a'),
        exp: 'IA significa Inteligencia Artificial: tecnologia que permite a las maquinas aprender y realizar tareas que normalmente requieren inteligencia humana.'
      },
      {
        q: 'Cual de estas IAs tiene acceso a informacion actualizada de Google en tiempo real?',
        options: opts('Gemini', 'ChatGPT version gratuita', 'Claude', 'Las tres tienen el mismo acceso', 'a'),
        exp: 'Gemini esta integrado con los servicios de Google y puede acceder a informacion reciente de la web. ChatGPT free y Claude tienen fecha de corte de entrenamiento.'
      },
      {
        q: 'Para que es especialmente buena Claude segun lo visto en clase?',
        options: opts('Seguir instrucciones largas y precisas', 'Generar imagenes', 'Buscar en internet', 'Crear videos', 'a'),
        exp: 'Claude de Anthropic destaca en seguir instrucciones detalladas y largas con alta precision. Es ideal para analizar documentos y redaccion estructurada.'
      },
      {
        q: 'Un LLM predice la respuesta mas probable basandose en:',
        options: opts('Patrones aprendidos de enormes cantidades de texto', 'Una base de datos de respuestas guardadas', 'Conexion directa a Wikipedia', 'Inteligencia humana programada manualmente', 'a'),
        exp: 'Los LLMs aprenden patrones estadisticos del lenguaje leyendo miles de millones de textos. No memorizan respuestas: generan la continuacion mas probable.'
      },
      {
        q: 'Cual es la mejor forma de comparar ChatGPT, Claude y Gemini?',
        options: opts('Hacerles la misma pregunta y comparar las respuestas', 'Ver cual tiene la interfaz mas bonita', 'Elegir la mas popular sin probarlas', 'Preguntar a un experto cual es la mejor', 'a'),
        exp: 'La evaluacion practica es clave: hacer la misma pregunta a las tres IAs revela diferencias reales en precision, tono y profundidad de respuesta.'
      }
    ]
  },

  {
    sessionId: '237268b4-29a2-49db-8f5a-e2b6ef58a82e',
    title: 'Dia 2: Prompt Engineering - Habla Como Experto',
    quizTitle: 'Quiz Dia 2 - Prompt Engineering',
    questions: [
      {
        q: 'Segun el framework CREA, que significa la "R"?',
        options: opts('Rol', 'Resultado', 'Revision', 'Rapidez', 'a'),
        exp: 'En CREA: C = Contexto, R = Rol (que papel debe asumir la IA), E = Especifico, A = Accion. Definir el rol mejora enormemente la calidad de las respuestas.'
      },
      {
        q: 'Cual es la diferencia clave entre un prompt basico y uno avanzado?',
        options: opts('El avanzado incluye contexto, rol, formato esperado y detalles especificos', 'El avanzado es mas largo sin importar el contenido', 'El avanzado usa palabras tecnicas complicadas', 'No hay diferencia real en los resultados', 'a'),
        exp: 'Un prompt avanzado estructura la solicitud con contexto, un rol para la IA, formato de respuesta deseado y detalles precisos. Esto multiplica la calidad del output.'
      },
      {
        q: 'Que es "few-shot learning" en prompts?',
        options: opts('Darle ejemplos a la IA para que entienda el patron que quieres', 'Hacer pocas preguntas en cada sesion', 'Usar la IA con una conexion lenta de internet', 'Aprender IA con pocos recursos', 'a'),
        exp: 'Few-shot significa dar 2-3 ejemplos del formato o estilo que quieres antes de tu pregunta principal. La IA detecta el patron y replica la misma estructura.'
      },
      {
        q: 'Tienes este prompt: "Escribe sobre marketing". Que le falta?',
        options: opts('Contexto, audiencia objetivo, formato y accion especifica', 'Nada, es un prompt perfecto', 'Solo le falta ser mas corto', 'Solo necesita mas signos de puntuacion', 'a'),
        exp: 'Un prompt efectivo debe especificar: para quien es, que tipo de contenido, que formato (lista/parrafo/tabla), que tono, y que resultado exacto se espera.'
      },
      {
        q: 'Para que sirve el "refinamiento iterativo" en prompt engineering?',
        options: opts('Mejorar la respuesta en varias vueltas dando feedback a la IA', 'Repetir el mismo prompt muchas veces esperando mejor resultado', 'Borrar el historial y empezar desde cero', 'Cambiar de IA si la primera no funciona', 'a'),
        exp: 'El refinamiento iterativo es un dialogo: obtienes una respuesta, la evaluas, y dices "hazlo mas conciso" o "agrega ejemplos". Cada vuelta mejora el resultado.'
      }
    ]
  },

  {
    sessionId: 'c2532947-621c-42cc-b726-eb67e29abed2',
    title: 'Dia 3: IA para Productividad Extrema',
    quizTitle: 'Quiz Dia 3 - IA y Productividad Personal',
    questions: [
      {
        q: 'Para que es Perplexity superior a Google Search?',
        options: opts('Sintetiza informacion de varias fuentes y las cita', 'Tiene mas resultados de busqueda', 'Funciona sin internet', 'Es mas rapido en cargar la pagina', 'a'),
        exp: 'Perplexity lee multiples fuentes y entrega un resumen con citas verificables. Google muestra links, Perplexity te da la respuesta directamente con respaldo.'
      },
      {
        q: 'Que ventaja tiene la IA al resumir un documento de 20 paginas?',
        options: opts('Extrae los puntos clave en minutos, ahorrando horas de lectura', 'Crea un documento mas largo que el original', 'Traduce el documento automaticamente', 'Imprime el documento en mejor calidad', 'a'),
        exp: 'La IA puede procesar textos largos en segundos y extraer las ideas principales, conclusiones y datos clave. Ideal para articulos academicos o reportes.'
      },
      {
        q: 'Cual es la principal ventaja de usar IA para redactar emails profesionales?',
        options: opts('Garantiza tono profesional, estructura clara y ahorra tiempo', 'El destinatario no sabra que lo escribio una IA', 'Los emails llegaran automaticamente', 'Evita que el email vaya a spam', 'a'),
        exp: 'La IA ayuda a estructurar ideas, elegir el tono correcto y ahorrar tiempo. Tu revisas y personalizas el resultado final antes de enviar.'
      },
      {
        q: 'Para que sirve Notion AI en la organizacion personal?',
        options: opts('Crear sistemas de organizacion, resumir notas y planificar tareas', 'Solo para hacer listas de compras', 'Unicamente para proyectos en equipo grandes', 'Sustituir el correo electronico', 'a'),
        exp: 'Notion AI integra un asistente de IA en tu espacio de trabajo: puede resumir notas, generar ideas, crear plantillas de plan semanal y mejorar cualquier texto.'
      },
      {
        q: 'Como usarias IA para preparar un examen universitario?',
        options: opts('Pedirle que cree resumen, flashcards y preguntas de practica', 'Copiar las respuestas del examen que la IA invente', 'Pedirle que haga el examen por ti', 'La IA no sirve para estudiar', 'a'),
        exp: 'La IA es un tutor personal 24/7: crea resumenes personalizados, genera preguntas de practica, explica conceptos dificiles y adapta el nivel a tus conocimientos.'
      }
    ]
  },

  {
    sessionId: '98e28a37-cb51-441d-9b4b-6a23166fa457',
    title: 'Dia 4: Python con IA como Copiloto',
    quizTitle: 'Quiz Dia 4 - Python Basico con IA',
    questions: [
      {
        q: 'Cual es la forma correcta de crear una variable en Python?',
        options: opts('nombre = "Juan"', 'var nombre = "Juan"', 'String nombre = "Juan"', 'nombre := "Juan"', 'a'),
        exp: 'En Python las variables se crean con asignacion directa: nombre = valor. No se necesita declarar el tipo. Es una de las razones por las que Python es tan legible.'
      },
      {
        q: 'Cual es la principal razon para usar Google Colab en lugar de instalar Python localmente?',
        options: opts('Corre en el navegador sin instalacion y tiene GPU gratis', 'Es mas rapido que Python instalado', 'Tiene mas librerias que Python local', 'Solo funciona con IA', 'a'),
        exp: 'Google Colab es un Jupyter Notebook en la nube: no necesitas instalar nada, tiene GPU gratuita para ML y puedes compartir el notebook facilmente.'
      },
      {
        q: 'Que hace este codigo: print("Hola " + nombre)?',
        options: opts('Muestra "Hola" seguido del valor de la variable nombre', 'Crea una variable llamada nombre', 'Suma los textos sin mostrarlos', 'Genera un error porque no se pueden sumar textos', 'a'),
        exp: 'print() muestra el resultado en consola. El operador + en strings los concatena. Si nombre = "Ana", el resultado seria "Hola Ana".'
      },
      {
        q: 'Cual es la mejor forma de usar ChatGPT para aprender Python?',
        options: opts('Pedirle codigo, ejecutarlo, y pedir que explique cada linea', 'Solo copiar el codigo sin entenderlo', 'Memorizar todo el codigo antes de ejecutarlo', 'Preguntar solo teoria sin practicar', 'a'),
        exp: 'El ciclo mas efectivo: pide codigo -> ejecuta -> si hay error pegaselo a la IA -> pide explicacion linea por linea. Aprendes haciendo, no memorizando.'
      },
      {
        q: 'Para que sirve una funcion en Python?',
        options: opts('Agrupar codigo reutilizable que puedes llamar multiples veces', 'Solo para operaciones matematicas', 'Para conectar Python con internet', 'Para crear interfaces graficas', 'a'),
        exp: 'Las funciones (def nombre():) encapsulan logica reutilizable. En vez de repetir 20 lineas, defines la funcion una vez y la llamas cuando la necesites.'
      }
    ]
  },

  // Day 5 = "Dia 5: Diseno Visual con IA Generativa" -> already has checkpoint quiz

  // ══════════════════════════════════════════════════════════════════════════
  // SEMANA 2 - Analisis de Datos con IA
  // ══════════════════════════════════════════════════════════════════════════

  {
    sessionId: '9323390f-956c-4848-affb-2fa3e04e3ac8',
    title: 'Dia 6: Excel + IA = Superpoderes',
    quizTitle: 'Quiz Dia 6 - Excel con IA',
    questions: [
      {
        q: 'Para que se usa la funcion VLOOKUP (BUSCARV) en Excel?',
        options: opts('Buscar un valor y traer datos de una columna relacionada', 'Calcular el promedio de una columna', 'Crear graficos automaticamente', 'Eliminar filas duplicadas', 'a'),
        exp: 'VLOOKUP busca un valor (ej: codigo de producto) en una tabla y devuelve un dato relacionado (ej: precio). La IA puede generarla con solo describir tus columnas.'
      },
      {
        q: 'Que es una tabla dinamica en Excel?',
        options: opts('Herramienta para resumir y analizar datos de una tabla grande', 'Una tabla que cambia su diseno automaticamente', 'Una tabla que se actualiza desde internet', 'Un grafico que se mueve en la hoja', 'a'),
        exp: 'Las tablas dinamicas agrupan, suman y resumen datos con drag-and-drop. Ej: ventas totales por producto por mes, en segundos, sin formulas complejas.'
      },
      {
        q: 'Cual es la mejor instruccion para pedir una formula de Excel a ChatGPT?',
        options: opts('"Col A=fechas, B=productos, C=ventas. Suma ventas de enero"', '"Dame una formula de Excel"', '"Como uso Excel?"', '"Necesito calcular cosas en Excel"', 'a'),
        exp: 'Mientras mas contexto des (nombres de columnas, tipo de datos, resultado esperado), mejor sera la formula que genere la IA. La precision del prompt es todo.'
      },
      {
        q: 'Que tipo de grafico usarias para mostrar ventas mensuales a lo largo de 1 ano?',
        options: opts('Grafico de lineas (muestra tendencia en el tiempo)', 'Grafico de pastel (pie chart)', 'Grafico de dispersion (scatter)', 'Histograma', 'a'),
        exp: 'Los graficos de lineas son ideales para series temporales (datos en el tiempo). El pastel es para proporciones, el scatter para correlaciones entre dos variables.'
      },
      {
        q: 'Para que sirven las macros en Excel generadas con IA?',
        options: opts('Automatizar tareas repetitivas como limpiar datos o formatear reportes', 'Hacer que Excel funcione mas rapido en general', 'Compartir archivos por email automaticamente', 'Agregar imagenes a las celdas', 'a'),
        exp: 'Las macros son scripts VBA que automatizan acciones repetitivas. Con IA puedes describirlas en lenguaje natural y obtener el codigo sin saber programar.'
      }
    ]
  },

  {
    sessionId: '3d3aff86-5422-4b6b-a521-492338685fae',
    title: 'Dia 7: Python para Datos (Pandas con IA)',
    quizTitle: 'Quiz Dia 7 - Pandas con IA',
    questions: [
      {
        q: 'Como se carga un archivo CSV en pandas?',
        options: opts('df = pd.read_csv("archivo.csv")', 'df = pandas.load("archivo.csv")', 'df = open("archivo.csv")', 'df = import_csv("archivo.csv")', 'a'),
        exp: 'pd.read_csv() es la funcion estandar de pandas para cargar datos CSV. El resultado es un DataFrame (df), la estructura principal de trabajo en pandas.'
      },
      {
        q: 'Que hace df.shape en pandas?',
        options: opts('Muestra el numero de filas y columnas del DataFrame', 'Cambia la forma del grafico', 'Muestra los primeros 5 registros', 'Ordena los datos por forma', 'a'),
        exp: 'df.shape retorna una tupla (filas, columnas). Si ves (1000, 8), tu dataset tiene 1000 registros y 8 columnas. Es lo primero que debes revisar al cargar datos.'
      },
      {
        q: 'Que comando usas para ver los primeros 5 registros de un DataFrame?',
        options: opts('df.head()', 'df.first()', 'df.show(5)', 'df.top(5)', 'a'),
        exp: 'df.head() muestra los primeros 5 registros por defecto. Puedes pasar un numero: df.head(10) para ver los primeros 10. df.tail() muestra los ultimos.'
      },
      {
        q: 'Cual es la ventaja de pandas vs Excel para datasets de 1 millon de filas?',
        options: opts('Pandas los procesa facilmente; Excel se congela o no los abre', 'No hay diferencia entre pandas y Excel', 'Excel es mas rapido con datasets grandes', 'Pandas tampoco puede manejar 1 millon de filas', 'a'),
        exp: 'Excel tiene limite de ~1 millon de filas y se vuelve muy lento. Pandas maneja decenas de millones de filas eficientemente y el codigo es reproducible y automatizable.'
      },
      {
        q: 'Como filtras en pandas las filas donde la columna "edad" es mayor a 18?',
        options: opts('df[df["edad"] > 18]', 'df.filter(edad > 18)', 'df.where("edad > 18")', 'df.select(edad, ">18")', 'a'),
        exp: 'El filtrado booleano en pandas usa la sintaxis df[condicion]. La condicion df["edad"] > 18 crea una mascara de True/False que filtra las filas.'
      }
    ]
  },

  {
    sessionId: '45fe1e03-edc9-4139-8a93-e9d8cf2badfe',
    title: 'Dia 8: Visualizacion de Datos con IA',
    quizTitle: 'Quiz Dia 8 - Visualizacion de Datos',
    questions: [
      {
        q: 'Cual libreria de Python crea graficos estadisticos elegantes con poco codigo?',
        options: opts('seaborn', 'numpy', 'pandas', 'requests', 'a'),
        exp: 'seaborn esta construido sobre matplotlib y crea graficos estadisticos profesionales con muy poco codigo. Ideal para correlaciones, distribuciones y comparaciones.'
      },
      {
        q: 'Que tipo de grafico usarias para comparar proporciones (ej: % de ventas por categoria)?',
        options: opts('Grafico de pastel o barras apiladas al 100%', 'Grafico de lineas', 'Histograma', 'Boxplot', 'a'),
        exp: 'Para proporciones del total, el pie chart o barras apiladas al 100% son los mas claros. Los graficos de lineas son para tendencias en el tiempo.'
      },
      {
        q: 'Que ventaja tiene plotly sobre matplotlib?',
        options: opts('Genera graficos interactivos (zoom, hover, filtros) compartibles como HTML', 'Es mas facil de instalar', 'Hace graficos en 3D exclusivamente', 'No necesita datos para crear graficos', 'a'),
        exp: 'plotly crea graficos interactivos: puedes hacer zoom, ver datos al pasar el mouse, filtrar series. matplotlib crea imagenes estaticas (PNG/SVG).'
      },
      {
        q: 'Cual es el primer paso antes de crear una visualizacion de datos?',
        options: opts('Entender el mensaje a comunicar y elegir el tipo de grafico correcto', 'Elegir los colores del grafico', 'Importar todas las librerias disponibles', 'Crear el grafico y ver que sale', 'a'),
        exp: 'Primero define: Que quiero mostrar? Comparacion, tendencia, distribucion, relacion? El tipo de grafico se elige segun el mensaje, no al reves.'
      },
      {
        q: 'Para que sirve un boxplot?',
        options: opts('Mostrar la distribucion y detectar valores extremos (outliers)', 'Mostrar tendencias en el tiempo', 'Comparar categorias con barras', 'Mostrar la relacion entre dos variables', 'a'),
        exp: 'El boxplot muestra mediana, cuartiles y valores atipicos de una distribucion. Ideal para comparar la dispersion de datos entre grupos o detectar outliers.'
      }
    ]
  },

  {
    sessionId: '82bef53d-79bb-45f3-b38c-2c79b7155711',
    title: 'Dia 9: Streamlit - Apps de Datos Interactivas',
    quizTitle: 'Quiz Dia 9 - Streamlit',
    questions: [
      {
        q: 'Que lenguaje se usa para crear apps con Streamlit?',
        options: opts('Python', 'JavaScript', 'HTML y CSS', 'SQL', 'a'),
        exp: 'Streamlit convierte scripts Python en aplicaciones web interactivas. No necesitas saber HTML, CSS ni JavaScript. Solo Python y la logica de tus datos.'
      },
      {
        q: 'Cual es el comando Streamlit para mostrar un titulo en la app?',
        options: opts('st.title("Mi App")', 'print("Mi App")', '<h1>Mi App</h1>', 'streamlit.header("Mi App")', 'a'),
        exp: 'Streamlit usa el prefijo st. para todos sus componentes: st.title(), st.header(), st.write(), st.dataframe(), st.plotly_chart(). No se usa HTML directo.'
      },
      {
        q: 'Que widget de Streamlit permite al usuario subir un archivo CSV?',
        options: opts('st.file_uploader()', 'st.upload()', 'st.input_file()', 'st.csv_reader()', 'a'),
        exp: 'st.file_uploader() crea un boton de carga de archivos. El usuario puede subir CSV, Excel, imagenes, etc. El resultado se procesa directamente en Python.'
      },
      {
        q: 'Donde puedes publicar gratis una app de Streamlit?',
        options: opts('Streamlit Community Cloud (streamlit.io)', 'Solo en servidores de pago', 'Unicamente en GitHub Pages', 'No se puede publicar gratis', 'a'),
        exp: 'Streamlit Community Cloud ofrece hosting gratuito para apps publicas. Conectas tu repositorio de GitHub y en minutos tu app tiene una URL publica accesible.'
      },
      {
        q: 'Que hace st.slider("Edad", 18, 65) en una app Streamlit?',
        options: opts('Crea un control deslizante entre 18 y 65 que el usuario puede ajustar', 'Muestra un texto con el rango de edades', 'Filtra automaticamente datos entre 18 y 65', 'Crea una tabla con edades de 18 a 65', 'a'),
        exp: 'st.slider() crea un widget interactivo deslizante. El valor que el usuario selecciona se captura en una variable Python y puede usarse para filtrar datos o calculos.'
      }
    ]
  },

  // Day 10 = "Dia 10: Mini-Proyecto 1 - Dashboard de Datos Ecuador" -> already has checkpoint quiz

  // ══════════════════════════════════════════════════════════════════════════
  // SEMANA 3 - Machine Learning y Creacion de Apps
  // ══════════════════════════════════════════════════════════════════════════

  {
    sessionId: 'c7d76d7b-e42e-4392-a288-80eebff1769a',
    title: 'Dia 11: Introduccion a Machine Learning',
    quizTitle: 'Quiz Dia 11 - Introduccion a ML',
    questions: [
      {
        q: 'Cual de estos es un ejemplo de aprendizaje supervisado?',
        options: opts('Un modelo entrenado con emails etiquetados como spam o no spam', 'Un modelo que agrupa clientes sin saber cuantos grupos hay', 'Un robot que aprende a caminar por prueba y error', 'Un motor de busqueda que indexa paginas web', 'a'),
        exp: 'Aprendizaje supervisado = se le dan ejemplos etiquetados (spam/no spam, enfermo/sano). El modelo aprende la regla para clasificar nuevos casos.'
      },
      {
        q: 'Que es Teachable Machine de Google?',
        options: opts('Herramienta gratuita para entrenar modelos de ML arrastrando imagenes, sin codigo', 'Una plataforma de videos educativos sobre IA', 'Un asistente de IA similar a ChatGPT', 'Un lenguaje de programacion para ML', 'a'),
        exp: 'Teachable Machine es gratuita y sin codigo: subes ejemplos (imagenes, sonidos), la herramienta entrena el modelo automaticamente y puedes exportarlo a Python.'
      },
      {
        q: 'Que es Hugging Face en el contexto de ML?',
        options: opts('Plataforma con miles de modelos de ML pre-entrenados listos para usar', 'Una red social para cientificos de datos', 'Un lenguaje de programacion de IA', 'Un editor de codigo con IA', 'a'),
        exp: 'Hugging Face es el "GitHub de los modelos de ML". Tiene miles de modelos pre-entrenados (traduccion, sentimientos, imagen, audio) que puedes usar con pocas lineas de Python.'
      },
      {
        q: 'Como aprende un modelo de aprendizaje no supervisado?',
        options: opts('Encuentra patrones y grupos en los datos sin etiquetas previas', 'Un humano le dice que cada dato significa', 'Recibe una recompensa cada vez que acierta', 'Copia el comportamiento de otro modelo', 'a'),
        exp: 'No supervisado = sin etiquetas. El modelo descubre estructura oculta en los datos. Ejemplo: agrupar clientes similares sin saber de antemano cuantos grupos hay.'
      },
      {
        q: 'Por que es importante entender ML aunque uses herramientas no-code?',
        options: opts('Para interpretar resultados, elegir el modelo correcto y detectar errores', 'No es necesario si usas herramientas no-code', 'Solo para impresionar en entrevistas de trabajo', 'Para poder vender los modelos que crees', 'a'),
        exp: 'Conocer los fundamentos de ML te permite elegir el tipo de modelo correcto, interpretar los resultados, detectar si el modelo esta fallando y comunicar hallazgos.'
      }
    ]
  },

  {
    sessionId: '4b1a5db7-1070-4506-ba32-063743c1d693',
    title: 'Dia 12: Google AI Studio - Crea Apps con Gemini',
    quizTitle: 'Quiz Dia 12 - Google AI Studio y Gemini API',
    questions: [
      {
        q: 'Que es un "system prompt" en Google AI Studio?',
        options: opts('Instrucciones permanentes que definen el comportamiento del chatbot', 'El primer mensaje que escribe el usuario', 'Una pregunta del sistema sobre el computador', 'El codigo Python para conectar la API', 'a'),
        exp: 'El system prompt establece el rol, tono y restricciones del asistente. Ej: "Eres un tutor de matematicas amigable para estudiantes de bachillerato en Ecuador."'
      },
      {
        q: 'Cual modelo Gemini elegiras si necesitas velocidad y bajo costo?',
        options: opts('Gemini Flash', 'Gemini Pro', 'Gemini Ultra', 'Gemini Nano', 'a'),
        exp: 'Gemini Flash es mas rapido y economico, ideal para aplicaciones con muchas peticiones. Gemini Pro es mas inteligente pero mas lento y costoso.'
      },
      {
        q: 'Que necesitas para conectar la Gemini API desde Python?',
        options: opts('Una API key gratuita obtenida desde Google AI Studio', 'Pagar una suscripcion premium de Google', 'Instalar hardware especial en tu computadora', 'Tener una cuenta de Google Workspace Enterprise', 'a'),
        exp: 'Google ofrece API keys gratuitas para Gemini con generosos limites para desarrolladores. Solo creas cuenta en Google AI Studio, vas a "Get API key" y la copias.'
      },
      {
        q: 'Cual es la ventaja principal de Google AI Studio frente a usar ChatGPT directamente?',
        options: opts('Permite exportar el codigo Python listo para usar en tu app', 'Tiene mejor interfaz visual', 'Sus respuestas son siempre mas precisas', 'Es gratis sin limite de uso', 'a'),
        exp: 'Google AI Studio es un entorno de desarrollo: puedes probar prompts visualmente y luego hacer clic en "Get code" para obtener el codigo Python listo para tu aplicacion.'
      },
      {
        q: 'Si quieres que tu chatbot siempre responda en espanol, donde lo configuras?',
        options: opts('En el system prompt: "Siempre responde en espanol"', 'En la configuracion de idioma del computador', 'El modelo detecta automaticamente sin configuracion', 'No es posible forzar el idioma', 'a'),
        exp: 'El system prompt controla el comportamiento del modelo. Especificar "responde siempre en espanol" asegura respuestas en ese idioma independiente del idioma del usuario.'
      }
    ]
  },

  {
    sessionId: '86c3809f-4d2c-458d-b11d-f4419bc0c41a',
    title: 'Dia 13: Lovable.dev - Apps Sin Codigo',
    quizTitle: 'Quiz Dia 13 - Apps No-Code con Lovable.dev',
    questions: [
      {
        q: 'Como le describes a la IA de Lovable.dev lo que quieres construir?',
        options: opts('En lenguaje natural, como si le hablaras a un desarrollador', 'En codigo HTML y CSS', 'Con un diagrama de flujo tecnico', 'Seleccionando opciones de un menu', 'a'),
        exp: 'Lovable.dev usa IA conversacional: describes lo que quieres como "Quiero una app con registro de usuarios y lista de tareas" y la IA lo construye.'
      },
      {
        q: 'Que ventaja tiene Lovable.dev frente a programar desde cero?',
        options: opts('Reduce semanas de desarrollo a horas, sin necesitar saber codigo', 'El codigo generado es siempre perfecto', 'Las apps no pueden tener errores', 'No tiene limites en el numero de usuarios', 'a'),
        exp: 'La principal ventaja es la velocidad: puedes tener un prototipo funcional en horas. Un desarrollador tardaria semanas. Ideal para validar ideas rapidamente.'
      },
      {
        q: 'Que tipo de apps puedes crear con Lovable.dev?',
        options: opts('Apps web: portfolios, landing pages, dashboards, apps con base de datos', 'Solo apps para iPhone', 'Unicamente juegos de video', 'Solo presentaciones de diapositivas', 'a'),
        exp: 'Lovable.dev genera aplicaciones web completas (React + backend). Puedes crear desde un portfolio personal hasta una app con autenticacion de usuarios y base de datos.'
      },
      {
        q: 'Como agregas una nueva funcionalidad a tu app en Lovable.dev?',
        options: opts('Continuas la conversacion con la IA describiendo lo que quieres agregar', 'Debes descargar el codigo y editarlo manualmente', 'Tienes que crear una app nueva desde cero', 'No puedes modificar la app una vez creada', 'a'),
        exp: 'Lovable es iterativo: dices "agrega un boton de exportar a PDF" y la IA actualiza la app. Cada iteracion refina el producto sin perder lo ya construido.'
      },
      {
        q: 'Cual de estos es el mejor caso de uso para Lovable.dev?',
        options: opts('Crear un prototipo funcional de una idea de startup en un fin de semana', 'Construir el sistema bancario de un banco grande', 'Desarrollar juegos AAA para consolas', 'Crear software de control de hardware industrial', 'a'),
        exp: 'Lovable es perfecto para MVPs y prototipos: valida tu idea rapido sin inversion en desarrollo. Para sistemas criticos y complejos se requiere desarrollo profesional tradicional.'
      }
    ]
  },

  {
    sessionId: '1c1b87a7-de71-4c96-8f97-879f0432316c',
    title: 'Dia 14: Replit - Programacion Colaborativa con IA',
    quizTitle: 'Quiz Dia 14 - Replit y Programacion con IA',
    questions: [
      {
        q: 'Que es Replit?',
        options: opts('Entorno de desarrollo online para programar en cualquier lenguaje desde el navegador', 'Un lenguaje de programacion nuevo', 'Una app para editar videos', 'Un servicio de almacenamiento en la nube', 'a'),
        exp: 'Replit es un IDE (entorno de desarrollo) en la nube. Programas en el navegador sin instalar nada, en Python, JavaScript, HTML/CSS y mas lenguajes.'
      },
      {
        q: 'Que es Replit Ghostwriter AI?',
        options: opts('IA integrada en Replit que autocompleta y genera codigo mientras programas', 'Un asistente que escribe textos en lugar de codigo', 'Una herramienta para hacer presentaciones', 'Un servicio de traduccion de codigo', 'a'),
        exp: 'Ghostwriter es la IA de Replit: sugiere la siguiente linea de codigo, completa funciones, explica errores y puede generar bloques desde comentarios en espanol.'
      },
      {
        q: 'Cual es la ventaja de Replit frente a Google Colab para crear apps web?',
        options: opts('Soporta HTML, CSS y JS ademas de Python, y hace deploy con URL publica', 'Replit es mas rapido para calculos matematicos', 'Google Colab no puede ejecutar Python', 'No hay diferencia relevante entre los dos', 'a'),
        exp: 'Replit soporta proyectos multi-archivo con HTML/CSS/JS/Python y hace deploy con URL publica inmediata. Colab esta optimizado para notebooks de ciencia de datos.'
      },
      {
        q: 'Como funciona la colaboracion en tiempo real en Replit?',
        options: opts('Multiples personas editan el mismo codigo simultaneamente como Google Docs', 'Debes enviar el archivo por email al colaborador', 'Solo una persona puede editar a la vez con turnos', 'La colaboracion no es en tiempo real, se sincroniza cada hora', 'a'),
        exp: 'Replit tiene multiplayer: comparte el link del Repl y varios desarrolladores pueden editar el mismo codigo al mismo tiempo, ver los cambios en vivo y ejecutar juntos.'
      },
      {
        q: 'Que hace el boton "Run" en Replit?',
        options: opts('Ejecuta el programa y lo publica con una URL publica accesible', 'Guarda el archivo en el computador', 'Envia el codigo a GitHub', 'Verifica la sintaxis sin ejecutar', 'a'),
        exp: 'En Replit, Run ejecuta el programa Y le asigna una URL publica permanente. Cualquier persona con el link puede acceder a tu app en tiempo real.'
      }
    ]
  },

  // Day 15 = "Dia 15: Automatizacion con IA" -> already has checkpoint quiz

  // ══════════════════════════════════════════════════════════════════════════
  // SEMANA 4 - Proyecto Final Integrador
  // ══════════════════════════════════════════════════════════════════════════

  {
    sessionId: '2b85238a-c17e-4bf3-b5e2-869048b1e53a',
    title: 'Dia 16: Planificacion del Proyecto Final',
    quizTitle: 'Quiz Dia 16 - Planificacion del Proyecto Final',
    questions: [
      {
        q: 'Cuantos proyectos debe incluir el portfolio final del Preuniversitario IA?',
        options: opts('3 proyectos: App Web, Chatbot y Dashboard de Datos', '1 proyecto grande', '2 proyectos a elegir', '5 proyectos pequenos', 'a'),
        exp: 'El portfolio tiene 3 proyectos que demuestran diferentes skills: App Web (Lovable/Streamlit), Chatbot inteligente (Gemini API) y Dashboard interactivo (Python + pandas).'
      },
      {
        q: 'Que herramienta usas para crear wireframes y mockups del proyecto?',
        options: opts('Figma o Canva con asistencia de IA', 'Solo papel y lapiz', 'Excel', 'Google Docs', 'a'),
        exp: 'Figma es el estandar para wireframes profesionales. Canva AI es una alternativa mas accesible. Ambas permiten disenar la estructura visual antes de programar.'
      },
      {
        q: 'Cual es el proposito del chatbot inteligente en el proyecto final?',
        options: opts('Tener personalidad y proposito claro, usando Google AI Studio + Gemini API', 'Simplemente responder "hola" y "adios"', 'Reemplazar a un maestro en clases', 'Crear contenido para redes sociales automaticamente', 'a'),
        exp: 'El chatbot debe tener un proposito util y claro: tutor de matematicas, asesor de carrera, guia turistico de Ecuador, etc. Se construye con Google AI Studio y la Gemini API.'
      },
      {
        q: 'Por que es importante definir el cronograma de trabajo con IA al inicio?',
        options: opts('Para distribuir tareas en los dias disponibles y no llegar al final sin terminar', 'Para mostrar al instructor que planificaste', 'La IA hace el proyecto sola segun el cronograma', 'No es necesario, se trabaja segun el humor del dia', 'a'),
        exp: 'Un cronograma realista ayuda a dividir el trabajo: cuanto tiempo para cada proyecto, que funcionalidades son core vs extras. ChatGPT puede ayudarte a crear uno con estimaciones.'
      },
      {
        q: 'Que es lo mas importante al elegir el tema de tu proyecto final?',
        options: opts('Que resuelva un problema real que conozcas bien', 'Que sea el mas complicado tecnicamente', 'Que impresione visualmente aunque no funcione bien', 'Que sea igual al proyecto del companero', 'a'),
        exp: 'Los mejores proyectos resuelven problemas reales. Si conoces el problema bien, tienes mejores criterios para disenar la solucion. La tecnologia es el medio, no el fin.'
      }
    ]
  },

  {
    sessionId: '7a259bf6-2194-4524-89b8-114ef432034d',
    title: 'Dia 17: Desarrollo Sprint 1',
    quizTitle: 'Quiz Dia 17 - Desarrollo Sprint 1',
    questions: [
      {
        q: 'En el Sprint 1, cual es la meta de avance en cada proyecto?',
        options: opts('30% de avance en cada uno de los 3 proyectos', 'Completar un proyecto al 100%', '10% de avance y dejar el resto para el final', 'Solo planificar, no programar', 'a'),
        exp: 'El Sprint 1 es de inicio: estructura basica de la app, conexion de la API de Gemini y carga del dataset. El objetivo es tener los 3 proyectos iniciados con 30% de avance.'
      },
      {
        q: 'Cual es la metodologia correcta al bloquearte durante el desarrollo?',
        options: opts('Pegar el error o descripcion del problema a la IA y pedir solucion', 'Esperar a que el instructor este libre para preguntar', 'Dejar esa funcionalidad y no incluirla', 'Reiniciar el computador y esperar que se resuelva', 'a'),
        exp: 'La IA es tu primera linea de soporte: copia el mensaje de error, describe el problema y pide solucion. ChatGPT resuelve el 80% de los errores comunes de programacion.'
      },
      {
        q: 'Por que se hacen commits constantes a GitHub durante el sprint?',
        options: opts('Para guardar el progreso y poder volver a versiones anteriores si algo sale mal', 'Para mostrar al instructor que se esta trabajando', 'GitHub lo requiere para que el codigo funcione', 'Es opcional, no tiene importancia practica', 'a'),
        exp: 'Git/GitHub es control de versiones: cada commit guarda el estado del proyecto. Si un cambio rompe todo, puedes volver al commit anterior. Es una practica profesional esencial.'
      },
      {
        q: 'Que deben incluir los mensajes de commit descriptivos?',
        options: opts('Una descripcion clara de que cambios se hicieron: "feat: formulario de contacto"', 'Solo la fecha y hora', 'El nombre del programador', 'El numero de lineas modificadas', 'a'),
        exp: 'Un buen mensaje de commit explica que se cambio y por que. Convenciones: "feat: nueva funcionalidad", "fix: correccion de error", "docs: documentacion actualizada".'
      },
      {
        q: 'Que hacer si en 40 minutos no puedes avanzar en un proyecto?',
        options: opts('Pide a la IA una version mas simple de la funcionalidad que funcione', 'Abandonar ese proyecto y enfocarse en los otros dos', 'Seguir intentando sin cambiar el enfoque', 'Entregar el proyecto sin esa funcionalidad sin mencionarlo', 'a'),
        exp: 'El principio del MVP: mejor funcionar simple que estar roto complejo. Pide a la IA una version reducida que funcione, y si hay tiempo, agregas la version completa despues.'
      }
    ]
  },

  {
    sessionId: 'aab56e17-e08a-4600-b37a-9a4e57bca9f5',
    title: 'Dia 18: Desarrollo Sprint 2',
    quizTitle: 'Quiz Dia 18 - Desarrollo Sprint 2',
    questions: [
      {
        q: 'Al llegar al Sprint 2, cual es el objetivo de avance esperado?',
        options: opts('70% de avance en cada proyecto', '100% completado en todos', '40% de avance', 'Solo uno de los tres proyectos al 100%', 'a'),
        exp: 'El Sprint 2 lleva cada proyecto al 70%: funcionalidades core completas, diseno mejorado, y lista de ajustes pendientes para el dia 19.'
      },
      {
        q: 'Como mejoras el diseno visual de tu app con IA?',
        options: opts('Usar Canva AI para assets visuales y pedir a la IA que mejore el CSS/UI', 'Solo usar los colores por defecto de la libreria', 'Contratar un disenador profesional', 'El diseno no es importante para proyectos tecnicos', 'a'),
        exp: 'Canva AI genera elementos visuales. Para mejorar el UI de tu app, puedes pedir a ChatGPT: "mejora este CSS para que se vea mas moderno" con el codigo actual.'
      },
      {
        q: 'Que es "refactorizar" codigo y por que lo hacemos en el Sprint 2?',
        options: opts('Reescribir el codigo para que sea mas limpio sin cambiar su funcionalidad', 'Agregar mas funcionalidades al codigo', 'Eliminar el codigo que no se usa del proyecto', 'Cambiar el lenguaje de programacion', 'a'),
        exp: 'Refactorizar = mejorar el codigo sin cambiar lo que hace. Codigo limpio es mas facil de mantener y extender. Pide a la IA: "refactoriza este codigo para que sea mas legible".'
      },
      {
        q: 'Como haces testing de tu chatbot durante el Sprint 2?',
        options: opts('Probarlo con preguntas variadas incluyendo casos extremos e inesperados', 'Solo probarlo con las preguntas que tu esperas', 'Pedir a la IA que lo pruebe sola', 'No es necesario probar si la IA lo genero', 'a'),
        exp: 'El testing real incluye casos extremos: preguntas fuera del tema, respuestas muy largas, lenguaje informal, idiomas diferentes. Los bugs se encuentran donde no esperas.'
      },
      {
        q: 'Segun la prioridad del Sprint 2, cual es el orden correcto?',
        options: opts('Que funcione > Que se vea bonito > Que sea perfecto', 'Que se vea bonito > Que funcione > Que sea perfecto', 'Que sea perfecto > Que funcione > Que se vea bonito', 'Los tres tienen la misma prioridad', 'a'),
        exp: 'En desarrollo agil: primero que funcione (funcionalidad > todo), luego mejorar la UI, y la perfeccion es iterativa. Un producto que funciona feo es mejor que uno bonito roto.'
      }
    ]
  },

  {
    sessionId: '645df034-eed1-4dc7-b6fb-31cd3cc4a6c5',
    title: 'Dia 19: Finalizacion y Preparacion de Presentacion',
    quizTitle: 'Quiz Dia 19 - Presentacion Profesional',
    questions: [
      {
        q: 'Cual es la estructura de la presentacion final de 5 minutos?',
        options: opts('Intro 30s + Demo App 1min + Demo Chatbot 1min + Demo Dashboard 1min + Tech Stack 1min + Cierre 30s', 'Leer el codigo de cada proyecto durante 5 minutos', 'Solo mostrar slides sin demos en vivo', 'Hablar 5 minutos de teoria sin mostrar los proyectos', 'a'),
        exp: 'La estructura balanceada permite mostrar los 3 proyectos en vivo. Los demos en vivo son mas convincentes que los screenshots y demuestran que realmente funciona.'
      },
      {
        q: 'Para que sirve el README en GitHub?',
        options: opts('Documentar el proyecto: que hace, como instalarlo, tecnologias usadas', 'Guardar el codigo del proyecto', 'Es decorativo, no tiene funcion tecnica', 'Solo para proyectos de empresas grandes', 'a'),
        exp: 'El README es la cara de tu proyecto en GitHub. Debe explicar: que problema resuelve, como se usa, que tecnologias usa y como ejecutarlo. ChatGPT puede generarlo por ti.'
      },
      {
        q: 'Por que es importante grabar videos demo de cada proyecto?',
        options: opts('Para compartirlos en LinkedIn y tenerlos como respaldo si algo falla en vivo', 'Porque el instructor los exige para la calificacion', 'Para vender los proyectos en internet', 'No es necesario grabar, solo mostrar en vivo', 'a'),
        exp: 'Los videos demo son tu portfolio: los publicas en LinkedIn junto con el certificado, y son respaldo si algo falla tecnicamente durante la presentacion en vivo.'
      },
      {
        q: 'Como usas IA para crear una presentacion de slides profesional?',
        options: opts('Pides a ChatGPT la estructura y textos, y usas Canva AI para el diseno visual', 'La IA crea la presentacion completa en PowerPoint automaticamente', 'Buscas plantillas en Google Images', 'Copias la presentacion de otro estudiante', 'a'),
        exp: 'Flujo recomendado: ChatGPT genera estructura y copies, Canva AI crea el diseno visual coherente. Tu revisas, personalizas y aseguras que refleje tu trabajo.'
      },
      {
        q: 'Cual es el mejor tip para presentar con confianza segun el curso?',
        options: opts('Ensayar la presentacion hasta que fluya naturalmente sin leer las diapositivas', 'Memorizar el guion palabra por palabra', 'Leer el texto de las diapositivas directamente', 'Improvisar sin preparacion previa', 'a'),
        exp: 'La confianza viene del ensayo. Practica en voz alta, graba un video de ti presentando para detectar mejoras. El objetivo es saber la historia, no memorizar palabras exactas.'
      }
    ]
  }

  // Day 20 = "Dia 20: Presentaciones Finales y Certificacion" -> already has checkpoint quiz
];

// ── ALL 20 session IDs for final verification ─────────────────────────────────
const ALL_SESSION_IDS = [
  '4646472c-5177-40c6-9f03-9c9eb9b41bd5', // Dia 1
  '237268b4-29a2-49db-8f5a-e2b6ef58a82e', // Dia 2
  'c2532947-621c-42cc-b726-eb67e29abed2', // Dia 3
  '98e28a37-cb51-441d-9b4b-6a23166fa457', // Dia 4
  '12380685-1208-4611-99f2-813c71ba529c', // Dia 5 (checkpoint)
  '9323390f-956c-4848-affb-2fa3e04e3ac8', // Dia 6
  '3d3aff86-5422-4b6b-a521-492338685fae', // Dia 7
  '45fe1e03-edc9-4139-8a93-e9d8cf2badfe', // Dia 8
  '82bef53d-79bb-45f3-b38c-2c79b7155711', // Dia 9
  '5e9c6c55-3c62-4554-84e4-4cdd311a8131', // Dia 10 (checkpoint)
  'c7d76d7b-e42e-4392-a288-80eebff1769a', // Dia 11
  '4b1a5db7-1070-4506-ba32-063743c1d693', // Dia 12
  '86c3809f-4d2c-458d-b11d-f4419bc0c41a', // Dia 13
  '1c1b87a7-de71-4c96-8f97-879f0432316c', // Dia 14
  'b9933278-dcbd-4857-9783-18a5da17e0ee', // Dia 15 (checkpoint)
  '2b85238a-c17e-4bf3-b5e2-869048b1e53a', // Dia 16
  '7a259bf6-2194-4524-89b8-114ef432034d', // Dia 17
  'aab56e17-e08a-4600-b37a-9a4e57bca9f5', // Dia 18
  '645df034-eed1-4dc7-b6fb-31cd3cc4a6c5', // Dia 19
  'e96acb80-36be-41ba-93e2-1e9e954a0769'  // Dia 20 (checkpoint)
];

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('='.repeat(65));
  console.log('ITSEIA Academy - Preuniversitario IA Quiz Builder');
  console.log(`Sessions to process: ${SESSIONS_TO_CREATE.length}`);
  console.log('='.repeat(65));

  // Check which sessions already have quizzes
  const idsStr = ALL_SESSION_IDS.join(',');
  const existingQuizzes = await get(`/quizzes?session_id=in.(${idsStr})&select=id,session_id,title`);
  const existingSet = new Set(existingQuizzes.map(q => q.session_id));
  console.log(`\nExisting quizzes: ${existingQuizzes.length}`);
  existingQuizzes.forEach(q => console.log(`  [EXISTS] ${q.title}`));

  // Filter out sessions that already have quizzes
  const toCreate = SESSIONS_TO_CREATE.filter(s => !existingSet.has(s.sessionId));
  const alreadyDone = SESSIONS_TO_CREATE.filter(s => existingSet.has(s.sessionId));

  if (alreadyDone.length > 0) {
    console.log(`\nAlready have quizzes (will skip): ${alreadyDone.length}`);
    alreadyDone.forEach(s => console.log(`  [SKIP] ${s.title}`));
  }

  console.log(`\nTo create: ${toCreate.length} quizzes`);
  if (toCreate.length === 0) {
    console.log('Nothing to do!');
  }

  console.log('\n' + '='.repeat(65));
  console.log('CREATING QUIZZES...');
  console.log('='.repeat(65));

  let created = 0;
  let errors = 0;

  for (const session of toCreate) {
    try {
      console.log(`\n[${created + 1}/${toCreate.length}] ${session.title}`);

      // INSERT quiz
      const quiz = await post('quizzes', {
        session_id: session.sessionId,
        title: session.quizTitle,
        pass_percentage: 60,
        max_attempts: 5,
        is_active: true
      });
      console.log(`  quiz_id: ${quiz.id}`);

      // INSERT 5 questions
      for (let i = 0; i < session.questions.length; i++) {
        const q = session.questions[i];
        await postMin('quiz_questions', {
          quiz_id: quiz.id,
          question_text: q.q,
          question_type: 'multiple_choice',
          options: q.options,    // JSON string
          explanation: q.exp,
          points: 1,
          order_index: i + 1
        });
        process.stdout.write(`  Q${i + 1}... `);
        await wait(80);
      }
      console.log('done');
      console.log(`  [OK] 5 questions inserted`);
      created++;
    } catch (err) {
      console.error(`  [ERROR]: ${err.message}`);
      errors++;
    }

    await wait(150);
  }

  // Final verification: check all 20 sessions
  console.log('\n' + '='.repeat(65));
  console.log('FINAL VERIFICATION - All 20 sessions');
  console.log('='.repeat(65));

  const finalQuizzes = await get(`/quizzes?session_id=in.(${idsStr})&select=id,session_id,title`);
  const finalSet = new Set(finalQuizzes.map(q => q.session_id));

  const DAY_NAMES = {
    '4646472c-5177-40c6-9f03-9c9eb9b41bd5': 'Dia 1: Bienvenida al Futuro con IA',
    '237268b4-29a2-49db-8f5a-e2b6ef58a82e': 'Dia 2: Prompt Engineering',
    'c2532947-621c-42cc-b726-eb67e29abed2': 'Dia 3: IA para Productividad',
    '98e28a37-cb51-441d-9b4b-6a23166fa457': 'Dia 4: Python con IA',
    '12380685-1208-4611-99f2-813c71ba529c': 'Dia 5: Diseno Visual con IA (checkpoint)',
    '9323390f-956c-4848-affb-2fa3e04e3ac8': 'Dia 6: Excel + IA',
    '3d3aff86-5422-4b6b-a521-492338685fae': 'Dia 7: Pandas con IA',
    '45fe1e03-edc9-4139-8a93-e9d8cf2badfe': 'Dia 8: Visualizacion de Datos',
    '82bef53d-79bb-45f3-b38c-2c79b7155711': 'Dia 9: Streamlit',
    '5e9c6c55-3c62-4554-84e4-4cdd311a8131': 'Dia 10: Mini-Proyecto Dashboard (checkpoint)',
    'c7d76d7b-e42e-4392-a288-80eebff1769a': 'Dia 11: Intro Machine Learning',
    '4b1a5db7-1070-4506-ba32-063743c1d693': 'Dia 12: Google AI Studio',
    '86c3809f-4d2c-458d-b11d-f4419bc0c41a': 'Dia 13: Lovable.dev',
    '1c1b87a7-de71-4c96-8f97-879f0432316c': 'Dia 14: Replit',
    'b9933278-dcbd-4857-9783-18a5da17e0ee': 'Dia 15: Automatizacion con IA (checkpoint)',
    '2b85238a-c17e-4bf3-b5e2-869048b1e53a': 'Dia 16: Planificacion Proyecto Final',
    '7a259bf6-2194-4524-89b8-114ef432034d': 'Dia 17: Desarrollo Sprint 1',
    'aab56e17-e08a-4600-b37a-9a4e57bca9f5': 'Dia 18: Desarrollo Sprint 2',
    '645df034-eed1-4dc7-b6fb-31cd3cc4a6c5': 'Dia 19: Finalizacion y Presentacion',
    'e96acb80-36be-41ba-93e2-1e9e954a0769': 'Dia 20: Presentaciones Finales (checkpoint)'
  };

  let allOk = true;
  for (const id of ALL_SESSION_IDS) {
    const has = finalSet.has(id);
    const name = DAY_NAMES[id] || id;
    console.log(`  ${has ? '[OK]     ' : '[MISSING]'} ${name}`);
    if (!has) allOk = false;
  }

  console.log('\n' + '='.repeat(65));
  console.log('SUMMARY');
  console.log('='.repeat(65));
  console.log(`Quizzes created this run : ${created}`);
  console.log(`Errors                   : ${errors}`);
  console.log(`Total quizzes in DB      : ${finalQuizzes.length} / 20`);
  console.log(`All 20 sessions covered  : ${allOk ? 'YES' : 'NO - check above'}`);

  if (errors > 0) process.exit(1);
}

main().catch(e => {
  console.error('\nFATAL:', e.message);
  process.exit(1);
});
