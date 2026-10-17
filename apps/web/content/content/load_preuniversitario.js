#!/usr/bin/env node
/**
 * Load Preuniversitario IA content into ITSEIA Academy V3
 *
 * Creates 1 semester with 4 subjects (one per week), each with 5 sessions (one per day).
 * Content extracted from CURRICULUM_PREUNIVERSITARIO_IA_MEJORADO.md
 *
 * Run: node content/load_preuniversitario.js
 */

const fs = require('fs');
const path = require('path');

// ============================================
// Configuration
// ============================================

const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';

const headers = {
  'apikey': SKEY,
  'Authorization': 'Bearer ' + SKEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};
const headersMinimal = {
  'apikey': SKEY,
  'Authorization': 'Bearer ' + SKEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
};

const PREUNI_PROGRAM_ID = '958d9795-8958-450e-828a-ff24eb4b0f00';

const CURRICULUM_PATH = '/Users/hectorvelasco/Mis Empresas/ITSEIA/DEPARTAMENTOS/01_MARKETING_VENTAS/CURRICULUM_PREUNIVERSITARIO_IA_MEJORADO.md';

// ============================================
// Supabase API helpers
// ============================================

async function supabasePost(table, body) {
  const res = await fetch(BASE + '/' + table, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (res.status !== 201) {
    throw new Error(`POST ${table} failed (${res.status}): ${JSON.stringify(data).substring(0, 200)}`);
  }
  return Array.isArray(data) ? data[0] : data;
}

async function supabasePostMinimal(table, body) {
  const res = await fetch(BASE + '/' + table, {
    method: 'POST',
    headers: headersMinimal,
    body: JSON.stringify(body)
  });

  if (res.status !== 201) {
    const text = await res.text();
    throw new Error(`POST ${table} failed (${res.status}): ${text.substring(0, 200)}`);
  }
  return true;
}

// ============================================
// Preuniversitario content structure (4 weeks x 5 days)
// ============================================

const WEEKS = [
  {
    number: 1,
    name: 'Semana 1: Fundamentos de IA Aplicada',
    code: 'PREUNI-S1',
    slug: 'preuni-semana-1-fundamentos-ia',
    description: 'De cero a crear con IA en 5 dias. Domina ChatGPT, Claude, Gemini, prompt engineering, productividad con IA, Python basico y diseno con IA generativa.',
    tools: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Notion AI', 'Google Colab', 'DALL-E', 'Canva AI'],
    sessions: [
      {
        number: 1,
        title: 'Dia 1: Bienvenida al Futuro con IA',
        description: 'Comprender que es IA y tener primeras conversaciones productivas con 3 IAs diferentes.',
        tools: ['ChatGPT', 'Claude', 'Gemini'],
        duration: 120,
        theory: `# Dia 1: Bienvenida al Futuro con IA

## Objetivo
Comprender que es IA y tener primeras conversaciones productivas con 3 IAs diferentes.

## Herramientas: ChatGPT, Claude, Gemini

## Contenidos
- **Que es IA (sin tecnicismos):** LLMs explicados simple — son modelos matematicos entrenados con texto masivo que predicen la mejor respuesta
- **Diferencias entre ChatGPT, Claude y Gemini:** Cada una tiene fortalezas distintas. ChatGPT es la mas popular, Claude es mas precisa en instrucciones largas, Gemini tiene acceso a informacion reciente de Google
- **Casos de uso reales en Ecuador:** Bancos usando deteccion de fraude, retail con recomendaciones, gobierno con digitalizacion
- **Creacion de cuentas** en las 3 plataformas (gratuitas)

## Practica
1. **Ejercicio 1:** Conversar con ChatGPT sobre un tema complejo (ej: economia ecuatoriana)
2. **Ejercicio 2:** Pedirle a Claude que analice un PDF (subir articulo cientifico)
3. **Ejercicio 3:** Usar Gemini para buscar informacion actualizada
4. **Ejercicio 4:** Comparar respuestas de las 3 IAs a la misma pregunta

## Entregable
- Documento comparativo: "Cual IA es mejor para que?"
- Evidencia de cuentas creadas en las 3 plataformas

## Tarea
- Usar ChatGPT para resolver 1 problema academico real (matematica, redaccion, etc.)`,
        ai_context: 'Eres un tutor del Preuniversitario IA de ITSEIA. El estudiante es joven (17-22 anos) y es su primer dia con IA. Explica conceptos simples, sin tecnicismos. Motiva y genera curiosidad. Contexto: Ecuador, 2026.',
        ai_prompt: 'Soy estudiante nuevo y nunca he usado IA. Explicame en terminos simples que diferencia hay entre ChatGPT, Claude y Gemini. Cual me recomiendas para empezar?'
      },
      {
        number: 2,
        title: 'Dia 2: Prompt Engineering - Habla Como Experto',
        description: 'Dominar la tecnica de crear prompts efectivos para obtener mejores resultados de la IA.',
        tools: ['ChatGPT', 'Claude', 'Notion AI'],
        duration: 120,
        theory: `# Dia 2: Prompt Engineering - Habla Como Experto

## Objetivo
Dominar la tecnica de crear prompts efectivos para obtener mejores resultados de la IA.

## Herramientas: ChatGPT, Claude, Notion AI

## Contenidos
- **Anatomia de un prompt efectivo:** contexto, tarea, formato, tono
- **Framework CREA:** Contexto, Rol, Especifico, Accion
- **Prompts basicos vs. avanzados** (comparacion lado a lado)
- **Chain-of-thought prompting:** pedir razonamiento paso a paso mejora la calidad
- **Few-shot learning:** dar ejemplos a la IA para que entienda el patron

## Practica
1. **Ejercicio 1:** Transformar 10 prompts malos en buenos
2. **Ejercicio 2:** Crear prompts para roles especificos (ej: "actua como profesor de fisica")
3. **Ejercicio 3:** Usar tecnica de refinamiento iterativo (mejorar respuesta en 5 vueltas)
4. **Ejercicio 4:** Crear un "prompt library" personal en Notion

## Entregable
- Biblioteca de 20 prompts probados y efectivos (por categoria)
- Screenshots de mejores resultados obtenidos

## Tarea
- Crear 5 prompts nuevos para resolver problemas de tu vida diaria`,
        ai_context: 'Eres un experto en prompt engineering que ensena a estudiantes jovenes. Ensena el framework CREA (Contexto, Rol, Especifico, Accion). Da ejemplos concretos. Corrige prompts del estudiante y explica por que la version mejorada funciona mejor.',
        ai_prompt: 'Quiero aprender a hacer buenos prompts. Dame un ejemplo de un prompt malo y su version mejorada usando el framework CREA.'
      },
      {
        number: 3,
        title: 'Dia 3: IA para Productividad Extrema',
        description: 'Usar IA para automatizar tareas de estudio, trabajo y organizacion personal.',
        tools: ['ChatGPT', 'Claude', 'Notion AI', 'Perplexity'],
        duration: 120,
        theory: `# Dia 3: IA para Productividad Extrema

## Objetivo
Usar IA para automatizar tareas de estudio, trabajo y organizacion personal.

## Herramientas: ChatGPT, Claude, Notion AI, Perplexity

## Contenidos
- **Redaccion asistida:** emails profesionales, informes, ensayos — la IA como tu editor personal
- **Resumir textos largos:** extraer insights de documentos de 20+ paginas en minutos
- **Traduccion contextual:** mucho mas alla de Google Translate, traducciones que entienden el contexto
- **Organizacion de tareas:** planificacion con IA que prioriza y estructura tu semana
- **Research inteligente con Perplexity:** busqueda web con fuentes citadas, superior a Google para investigacion

## Practica
1. **Ejercicio 1:** Redactar 3 emails profesionales con IA (solicitud empleo, queja formal, networking)
2. **Ejercicio 2:** Resumir articulo academico de 20 paginas a 1 pagina
3. **Ejercicio 3:** Crear plan semanal de estudio usando IA
4. **Ejercicio 4:** Investigar tema complejo con Perplexity y comparar vs. Google

## Entregable
- Carpeta "Productividad IA" con 5 documentos creados

## Tarea
- Usar Notion AI para crear tu sistema de organizacion personal`,
        ai_context: 'Eres un coach de productividad que usa IA. Ensena al estudiante a automatizar tareas cotidianas: emails, resumenes, investigacion, organizacion. Da ejemplos practicos para un joven ecuatoriano.',
        ai_prompt: 'Necesito organizar mi semana de estudio. Tengo clases de lunes a viernes y quiero estudiar IA. Ayudame a crear un plan semanal.'
      },
      {
        number: 4,
        title: 'Dia 4: Python con IA como Copiloto',
        description: 'Escribir primeros programas en Python sin memorizar sintaxis, usando IA como asistente.',
        tools: ['ChatGPT', 'Google Colab', 'GitHub Copilot'],
        duration: 120,
        theory: `# Dia 4: Python con IA como Copiloto

## Objetivo
Escribir primeros programas en Python sin memorizar sintaxis, usando IA como asistente.

## Herramientas: ChatGPT, Google Colab, GitHub Copilot (o Replit AI)

## Contenidos
- **Por que Python es el lenguaje de IA:** simplicidad, ecosistema de librerias, demanda laboral
- **Variables, tipos de datos, operaciones basicas** (explicado por IA, no memorizado)
- **Estructuras de control:** if, for, while — generadas por IA y explicadas linea por linea
- **Funciones** creadas con asistencia de IA
- **Debugging con IA:** la IA encuentra y explica errores mejor que tu manual de Python

## Practica
1. **Ejercicio 1:** Crear calculadora simple (pedir a IA el codigo, entenderlo, modificarlo)
2. **Ejercicio 2:** Programa que convierte temperatura (Celsius a Fahrenheit)
3. **Ejercicio 3:** Generador de contrasenas aleatorias
4. **Ejercicio 4:** Mini-juego de adivinanza de numeros
5. **Ejercicio 5:** Pedir a IA que explique cada linea del codigo creado

## Entregable
- Google Colab notebook con 5 programas funcionando
- Comentarios en espanol explicando que hace cada bloque (con ayuda de IA)

## Tarea
- Crear 2 programas propios usando ChatGPT como asistente`,
        ai_context: 'Eres un tutor de Python para principiantes absolutos. El estudiante no sabe programar. Genera codigo Python simple, explicado linea por linea en espanol. Usa Google Colab. Si hay errores, explicalos de forma amigable.',
        ai_prompt: 'Quiero crear mi primer programa en Python: una calculadora que sume, reste, multiplique y divida. Explicame cada linea del codigo.'
      },
      {
        number: 5,
        title: 'Dia 5: Diseno Visual con IA Generativa',
        description: 'Crear imagenes, graficos y disenos usando IA generativa.',
        tools: ['DALL-E', 'Midjourney', 'Canva AI'],
        duration: 120,
        theory: `# Dia 5: Diseno Visual con IA Generativa

## Objetivo
Crear imagenes, graficos y disenos usando IA generativa.

## Herramientas: DALL-E, Midjourney (demo), Canva AI

## Contenidos
- **Como funciona la IA generativa de imagenes:** de texto a imagen, difusion, estilos
- **Prompt engineering para imagenes:** ser descriptivo, especificar estilo, composicion, iluminacion
- **Estilos artisticos:** fotorrealista, ilustracion, 3D, pixel art, acuarela, etc.
- **Canva AI para diseno rapido:** posters, presentaciones, contenido para redes sociales
- **Etica en IA generativa:** derechos de autor, deepfakes, uso responsable

## Practica
1. **Ejercicio 1:** Generar 10 imagenes con DALL-E (diferentes estilos)
2. **Ejercicio 2:** Crear logo personal con IA
3. **Ejercicio 3:** Disenar post de Instagram con Canva AI
4. **Ejercicio 4:** Generar portada de presentacion profesional
5. **Ejercicio 5:** Crear galeria de imagenes para proyecto ficticio

## Entregable
- Portfolio visual con 15 imagenes creadas + prompts usados
- Diseno completo de presentacion en Canva AI

## Tarea
- Disenar poster promocional de un evento ficticio usando IA

## CHECKPOINT SEMANA 1
- Evaluacion rapida: Crear prompt complejo que integre todo lo aprendido
- Feedback grupal de proyectos`,
        ai_context: 'Eres un experto en diseno con IA generativa. Ensena al estudiante a crear imagenes con DALL-E y Canva AI. Da prompts de ejemplo para diferentes estilos. Explica etica y derechos de autor en IA generativa.',
        ai_prompt: 'Quiero crear un logo para un proyecto personal usando IA. Dame 5 prompts diferentes para DALL-E que generen logos profesionales.'
      }
    ]
  },
  {
    number: 2,
    name: 'Semana 2: Analisis de Datos con IA',
    code: 'PREUNI-S2',
    slug: 'preuni-semana-2-datos-ia',
    description: 'De Excel a Python: datos inteligentes. Domina Excel con IA, pandas, visualizacion de datos, Streamlit y crea tu primer dashboard interactivo.',
    tools: ['ChatGPT', 'Excel', 'Google Colab', 'pandas', 'matplotlib', 'Streamlit'],
    sessions: [
      {
        number: 1,
        title: 'Dia 6: Excel + IA = Superpoderes',
        description: 'Usar IA para dominar Excel sin memorizar formulas.',
        tools: ['ChatGPT', 'Excel', 'Google Sheets'],
        duration: 120,
        theory: `# Dia 6: Excel + IA = Superpoderes

## Objetivo
Usar IA para dominar Excel sin memorizar formulas.

## Herramientas: ChatGPT, Excel, Google Sheets

## Contenidos
- **Formulas complejas generadas por IA:** VLOOKUP, INDEX+MATCH, SUMIFS — no las memorizas, las pides
- **Tablas dinamicas explicadas por IA:** el concepto, no la mecanica
- **Analisis de datos basico en Excel:** tendencias, promedios, desviaciones
- **Automatizacion de tareas repetitivas** con macros generadas por IA

## Practica
1. **Ejercicio 1:** Dataset de ventas (100 filas) - calcular metricas con IA
2. **Ejercicio 2:** Crear tabla dinamica siguiendo instrucciones de ChatGPT
3. **Ejercicio 3:** Graficos automaticos (pedir a IA que tipo usar)
4. **Ejercicio 4:** Limpieza de datos (eliminar duplicados, rellenar vacios) con IA

## Entregable
- Archivo Excel con 3 analisis completos: reporte ventas, analisis clientes, dashboard visual

## Tarea
- Analizar dataset personal (notas, gastos, etc.) usando IA + Excel`,
        ai_context: 'Eres un experto en Excel que ensena con IA. El estudiante es joven y no domina formulas avanzadas. Genera formulas Excel explicadas paso a paso. Usa datos de ejemplo relevantes para Ecuador.',
        ai_prompt: 'Tengo una tabla de ventas con columnas: Fecha, Producto, Cantidad, Precio. Necesito una formula para calcular ventas totales por producto. Explicamelo paso a paso.'
      },
      {
        number: 2,
        title: 'Dia 7: Python para Datos (Pandas con IA)',
        description: 'Manipular datasets en Python usando pandas con asistencia total de IA.',
        tools: ['Google Colab', 'ChatGPT', 'pandas'],
        duration: 120,
        theory: `# Dia 7: Python para Datos (Pandas con IA)

## Objetivo
Manipular datasets en Python usando pandas con asistencia total de IA.

## Herramientas: Google Colab, ChatGPT, pandas

## Contenidos
- **Por que pandas > Excel para datos grandes:** velocidad, reproducibilidad, automatizacion
- **Cargar datasets (CSV, Excel) con IA generando codigo**
- **Operaciones basicas:** filtrar, ordenar, agrupar (con IA escribiendo el codigo)
- **Limpieza de datos:** valores nulos, duplicados, formatos inconsistentes
- **Estadisticas descriptivas con pandas:** describe(), value_counts(), groupby()

## Practica
1. **Ejercicio 1:** Cargar dataset ecuatoriano (INEC, BCE) en pandas
2. **Ejercicio 2:** Filtrar datos por condiciones (pedirle a IA el codigo)
3. **Ejercicio 3:** Calcular promedios, maximos, minimos por categoria
4. **Ejercicio 4:** Crear nuevas columnas calculadas con IA
5. **Ejercicio 5:** Exportar resultados limpios

## Entregable
- Notebook con analisis de dataset real ecuatoriano: codigo comentado, insights, datos limpios

## Tarea
- Buscar dataset interesante en Kaggle y hacer analisis exploratorio con IA`,
        ai_context: 'Eres un tutor de Python/pandas para principiantes. Genera codigo pandas explicado linea por linea. Usa datasets relevantes para Ecuador. Si el estudiante tiene errores, explicalos con paciencia.',
        ai_prompt: 'Tengo un CSV con datos del INEC sobre empleo en Ecuador. Ayudame a cargarlo en pandas y hacer analisis basico: cuantas filas tiene, que columnas, estadisticas descriptivas.'
      },
      {
        number: 3,
        title: 'Dia 8: Visualizacion de Datos con IA',
        description: 'Crear graficos profesionales en Python sin saber codigo de visualizacion.',
        tools: ['Google Colab', 'matplotlib', 'seaborn', 'plotly'],
        duration: 120,
        theory: `# Dia 8: Visualizacion de Datos con IA

## Objetivo
Crear graficos profesionales en Python sin saber codigo de visualizacion.

## Herramientas: Google Colab, matplotlib, seaborn, plotly (con IA)

## Contenidos
- **Tipos de graficos y cuando usarlos:** barras, lineas, dispersion, pastel, boxplot — la IA recomienda
- **matplotlib basico:** la libreria fundamental, generada por IA
- **seaborn:** graficos estadisticos elegantes con una linea de codigo
- **plotly:** graficos interactivos que puedes compartir como HTML
- **Personalizacion:** colores, titulos, leyendas (con IA ajustando)

## Practica
1. **Ejercicio 1:** Crear 5 tipos de graficos del mismo dataset
2. **Ejercicio 2:** Grafico interactivo con plotly (pedirle a IA)
3. **Ejercicio 3:** Dashboard simple con multiples graficos
4. **Ejercicio 4:** Exportar graficos en alta calidad

## Entregable
- Notebook con 8 visualizaciones profesionales
- Imagen PNG de cada grafico para portfolio

## Tarea
- Crear infografia de datos usando Python + IA`,
        ai_context: 'Eres un experto en visualizacion de datos con Python. Genera codigo matplotlib/seaborn/plotly explicado. Recomienda el tipo de grafico correcto segun los datos del estudiante. Ensena buenas practicas de diseno visual.',
        ai_prompt: 'Tengo datos de ventas mensuales. Que tipo de grafico me recomiendas para mostrar la tendencia? Genera el codigo en Python con matplotlib.'
      },
      {
        number: 4,
        title: 'Dia 9: Streamlit - Apps de Datos Interactivas',
        description: 'Crear aplicacion web interactiva de analisis de datos con Streamlit y IA.',
        tools: ['Streamlit', 'Google Colab', 'ChatGPT'],
        duration: 120,
        theory: `# Dia 9: Streamlit - Apps de Datos Interactivas

## Objetivo
Crear aplicacion web interactiva de analisis de datos con Streamlit y IA.

## Herramientas: Streamlit, Google Colab, ChatGPT

## Contenidos
- **Que es Streamlit:** framework Python para crear apps web de datos sin HTML/CSS/JS
- **Estructura basica de app Streamlit** (IA genera el codigo completo)
- **Widgets interactivos:** sliders, selectboxes, file uploaders — interfaz drag-and-drop conceptual
- **Mostrar dataframes y graficos en la app:** st.dataframe(), st.plotly_chart()
- **Deploy gratuito en Streamlit Cloud:** tu app online en 2 minutos

## Practica
1. **Ejercicio 1:** Crear app basica "Hello Streamlit" con IA
2. **Ejercicio 2:** App de visualizacion de CSV (usuario sube archivo)
3. **Ejercicio 3:** Agregar filtros interactivos
4. **Ejercicio 4:** Publicar app en Streamlit Cloud (online, gratis)

## Entregable
- App Streamlit publicada y funcionando online
- Codigo fuente en GitHub
- URL publica para compartir

## Tarea
- Mejorar tu app Streamlit con nuevas funcionalidades (con ayuda de IA)`,
        ai_context: 'Eres un experto en Streamlit que ensena a crear apps de datos. Genera codigo Streamlit completo y funcional. El estudiante es principiante. Explica cada widget y como se conectan los datos.',
        ai_prompt: 'Quiero crear mi primera app con Streamlit que muestre un grafico interactivo de datos. Dame el codigo completo para empezar.'
      },
      {
        number: 5,
        title: 'Dia 10: Mini-Proyecto 1 - Dashboard de Datos Ecuador',
        description: 'Proyecto integrador que combina Python, pandas, visualizacion y Streamlit.',
        tools: ['Streamlit', 'pandas', 'plotly', 'Google Colab'],
        duration: 120,
        theory: `# Dia 10: Mini-Proyecto 1 - Dashboard de Datos Ecuador

## Objetivo
Proyecto integrador que combina Python, pandas, visualizacion y Streamlit.

## Herramientas: TODAS las de la semana 2

## Proyecto: "Analiza Ecuador: Dashboard Interactivo"

Crear dashboard web con datos reales de Ecuador:
- **Fuente:** INEC, Banco Central, o Kaggle
- **Analisis:** 5 metricas clave
- **Visualizaciones:** Minimo 4 graficos interactivos
- **Deploy:** App publica en Streamlit Cloud

## Proceso
1. Elegir dataset y definir preguntas a responder
2. Cargar y limpiar datos con pandas (IA asiste)
3. Crear visualizaciones con plotly (IA genera codigo)
4. Construir app Streamlit completa
5. Deploy en Streamlit Cloud
6. Preparar presentacion de 3 minutos

## Entregable
- App Streamlit completa y publicada
- Codigo en GitHub con README
- Presentacion de 3 minutos mostrando insights

## CHECKPOINT SEMANA 2
- Presentaciones de dashboards (5 min por persona)
- Peer review (estudiantes se dan feedback)`,
        ai_context: 'Eres un mentor de proyecto de datos. Guia al estudiante a crear un dashboard Streamlit con datos de Ecuador. Ayuda con seleccion de datos, analisis, codigo y presentacion. Se practico y orientado a resultados.',
        ai_prompt: 'Quiero crear un dashboard con datos del INEC sobre empleo en Ecuador. Que metricas deberia incluir y como estructuro el proyecto?'
      }
    ]
  },
  {
    number: 3,
    name: 'Semana 3: Machine Learning y Creacion de Apps',
    code: 'PREUNI-S3',
    slug: 'preuni-semana-3-ml-apps',
    description: 'De usuario de IA a creador de IA. Introduccion a Machine Learning, Google AI Studio, Lovable.dev, Replit y automatizacion con Zapier.',
    tools: ['Google Colab', 'Teachable Machine', 'Google AI Studio', 'Lovable.dev', 'Replit', 'Zapier'],
    sessions: [
      {
        number: 1,
        title: 'Dia 11: Introduccion a Machine Learning',
        description: 'Entender que es ML y usar modelos pre-entrenados sin matematica compleja.',
        tools: ['Google Colab', 'Teachable Machine', 'ChatGPT', 'Hugging Face'],
        duration: 120,
        theory: `# Dia 11: Introduccion a Machine Learning

## Objetivo
Entender que es ML y usar modelos pre-entrenados sin matematica compleja.

## Herramientas: Google Colab, Teachable Machine, ChatGPT

## Contenidos
- **Que es Machine Learning:** explicado simple por IA — la maquina aprende patrones de datos
- **Tipos:** Supervisado (le das ejemplos), No supervisado (encuentra patrones solo), Refuerzo (aprende por prueba y error)
- **Casos de uso:** Netflix recomienda peliculas, Spotify crea playlists, Amazon sugiere productos, bancos ecuatorianos detectan fraude
- **Teachable Machine:** entrena tu propio modelo de IA sin escribir una linea de codigo

## Practica
1. **Ejercicio 1:** Entrenar clasificador de imagenes en Teachable Machine (ejemplo: reconocer billetes ecuatorianos)
2. **Ejercicio 2:** Exportar modelo y usarlo en Python (IA genera codigo)
3. **Ejercicio 3:** Usar modelo pre-entrenado de Hugging Face con IA
4. **Ejercicio 4:** Clasificador de texto (sentimientos positivo/negativo)

## Entregable
- Modelo de Teachable Machine funcionando
- Notebook con 2 modelos pre-entrenados en accion
- Video demo de 1 minuto

## Tarea
- Explorar Hugging Face y probar 3 modelos diferentes`,
        ai_context: 'Eres un tutor de Machine Learning para principiantes absolutos. Explica ML sin matematicas complejas, con analogias simples. Guia al estudiante a usar Teachable Machine y Hugging Face. Genera codigo Python simple.',
        ai_prompt: 'Explicame Machine Learning como si tuviera 15 anos. Dame un ejemplo con algo que uso todos los dias (Netflix, Spotify, etc).'
      },
      {
        number: 2,
        title: 'Dia 12: Google AI Studio - Crea Apps con Gemini',
        description: 'Usar Google AI Studio para crear prototipos inteligentes con Gemini API.',
        tools: ['Google AI Studio', 'Gemini API', 'Python'],
        duration: 120,
        theory: `# Dia 12: Google AI Studio - Crea Apps con Gemini

## Objetivo
Usar Google AI Studio para crear prototipos inteligentes con Gemini API.

## Herramientas: Google AI Studio, Gemini API, Python

## Contenidos
- **Que es Google AI Studio:** interfaz visual para experimentar con modelos Gemini de Google
- **Crear prompts estructurados** en la interfaz (system prompt + user prompt)
- **Probar modelos Gemini:** Flash (rapido y barato), Pro (mas inteligente)
- **Obtener API key gratuita:** como registrarse y obtener acceso
- **Conectar Gemini API desde Python** (con ayuda de IA para el codigo)

## Practica
1. **Ejercicio 1:** Crear chatbot en Google AI Studio (interfaz visual)
2. **Ejercicio 2:** Exportar codigo Python del chatbot
3. **Ejercicio 3:** Personalizar respuestas del chatbot con system prompts
4. **Ejercicio 4:** Crear "Tutor de matematicas con IA" usando Gemini

## Entregable
- Chatbot funcional en Google AI Studio
- Script Python que usa Gemini API
- Documentacion de tu prompt estructurado

## Tarea
- Disenar idea de app inteligente que usaras con Gemini API`,
        ai_context: 'Eres un experto en Google AI Studio y Gemini API. Guia al estudiante paso a paso para crear su primer chatbot. Genera codigo Python para conectar con Gemini API. Usa la API key de ITSEIA para demos.',
        ai_prompt: 'Quiero crear un chatbot que sea un tutor de matematicas para estudiantes de secundaria. Como lo hago con Google AI Studio?'
      },
      {
        number: 3,
        title: 'Dia 13: Lovable.dev - Apps Sin Codigo',
        description: 'Crear aplicacion web completa sin escribir codigo, solo con IA conversacional.',
        tools: ['Lovable.dev', 'ChatGPT'],
        duration: 120,
        theory: `# Dia 13: Lovable.dev - Apps Sin Codigo

## Objetivo
Crear aplicacion web completa sin escribir codigo, solo con IA conversacional.

## Herramientas: Lovable.dev, ChatGPT (para planificar)

## Contenidos
- **Que es Lovable.dev:** plataforma que crea apps web completas conversando con IA
- **Crear cuenta y explorar templates:** miles de plantillas para empezar
- **Conversar con IA para disenar app:** describes lo que quieres y la IA lo construye
- **Personalizar diseno y funcionalidades:** colores, componentes, interacciones
- **Publicar app online:** hosting incluido, URL publica instantanea

## Practica
1. **Ejercicio 1:** Crear portfolio personal con Lovable.dev
2. **Ejercicio 2:** App de "Calculadora de propinas inteligente"
3. **Ejercicio 3:** Landing page para negocio ficticio
4. **Ejercicio 4:** Integrar formulario de contacto

## Entregable
- App web publicada y funcionando
- URL publica para compartir
- Screenshots del proceso de creacion

## Tarea
- Mejorar tu app con nuevas secciones usando conversacion con IA`,
        ai_context: 'Eres un experto en desarrollo no-code con Lovable.dev. Guia al estudiante a crear apps web sin programar. Sugiere ideas de apps, ayuda a planificar funcionalidades y a describir lo que quiere a la IA de Lovable.',
        ai_prompt: 'Quiero crear mi portfolio personal con Lovable.dev. Que secciones deberia incluir y como se lo describo a la IA?'
      },
      {
        number: 4,
        title: 'Dia 14: Replit - Programacion Colaborativa con IA',
        description: 'Usar Replit AI para crear apps mas complejas con programacion asistida.',
        tools: ['Replit', 'Replit AI'],
        duration: 120,
        theory: `# Dia 14: Replit - Programacion Colaborativa con IA

## Objetivo
Usar Replit AI para crear apps mas complejas con programacion asistida.

## Herramientas: Replit, Replit AI (Ghostwriter)

## Contenidos
- **Que es Replit:** entorno de desarrollo online donde puedes programar en cualquier lenguaje
- **Replit AI (Ghostwriter):** autocompletado inteligente que escribe codigo por ti
- **Crear apps multiarchivo:** HTML, CSS, JS, Python — todo en un solo lugar
- **Deploy instantaneo en Replit:** un clic y tu app esta online
- **Colaboracion en tiempo real:** como Google Docs pero para codigo

## Practica
1. **Ejercicio 1:** Crear "To-Do List App" con Replit AI
2. **Ejercicio 2:** Agregar base de datos simple (sqlite)
3. **Ejercicio 3:** Personalizar diseno con CSS (IA genera estilos)
4. **Ejercicio 4:** Publicar app y compartir URL

## Entregable
- App funcional en Replit (publica)
- Codigo comentado (IA explica cada parte)
- Link de la app funcionando

## Tarea
- Crear app simple de tu eleccion usando Replit AI`,
        ai_context: 'Eres un tutor de programacion con Replit. El estudiante tiene conocimientos basicos de Python. Guia paso a paso para crear apps web. Genera codigo HTML/CSS/JS/Python explicado. Ensena deploy en Replit.',
        ai_prompt: 'Quiero crear una app de To-Do List en Replit. Guidame paso a paso desde crear el proyecto hasta publicarlo online.'
      },
      {
        number: 5,
        title: 'Dia 15: Automatizacion con IA',
        description: 'Crear workflows automaticos que conectan apps usando Zapier/Make con IA.',
        tools: ['Zapier', 'Make.com', 'ChatGPT'],
        duration: 120,
        theory: `# Dia 15: Automatizacion con IA

## Objetivo
Crear workflows automaticos que conectan apps usando Zapier/Make con IA.

## Herramientas: Zapier, Make.com, ChatGPT (para disenar flujos)

## Contenidos
- **Que es automatizacion no-code:** conectar apps para que trabajen juntas sin programar
- **Conceptos clave:** triggers (que dispara la accion), acciones (que se ejecuta), filtros (condiciones)
- **Zapier vs. Make.com:** Zapier es mas simple, Make es mas potente y visual
- **Usar IA para disenar workflows:** describe lo que quieres y ChatGPT te dice como armarlo
- **Integraciones:** Gmail, Google Sheets, Notion, Slack, y cientos mas

## Practica
1. **Ejercicio 1:** Automatizacion simple (email nuevo en Gmail → fila en Google Sheets)
2. **Ejercicio 2:** Bot que resume emails largos con IA y envia resumen a Slack
3. **Ejercicio 3:** Workflow: guardar links de Twitter en Notion automaticamente
4. **Ejercicio 4:** Disenar workflow complejo con ayuda de ChatGPT

## Entregable
- 3 automatizaciones funcionando
- Diagrama de flujo de cada una (creado con IA)
- Video demo de 2 minutos

## CHECKPOINT SEMANA 3
- Demostracion grupal de apps creadas
- Votacion: "App mas creativa de la semana"

## Tarea
- Crear automatizacion que resuelva problema personal real`,
        ai_context: 'Eres un experto en automatizacion no-code con Zapier y Make. Ensena al estudiante a crear workflows que conectan apps. Da ideas de automatizaciones utiles para un joven ecuatoriano. Explica triggers y acciones con ejemplos simples.',
        ai_prompt: 'Quiero automatizar algo util: cuando reciba un email importante, que se guarde automaticamente en una hoja de Google Sheets. Como lo hago con Zapier?'
      }
    ]
  },
  {
    number: 4,
    name: 'Semana 4: Proyecto Final Integrador',
    code: 'PREUNI-S4',
    slug: 'preuni-semana-4-proyecto-final',
    description: 'Tu portfolio de IA que impresiona. Planificacion, desarrollo sprint 1 y 2, finalizacion y presentaciones finales con certificacion.',
    tools: ['ChatGPT', 'Google AI Studio', 'Lovable.dev', 'Streamlit', 'Replit', 'Canva AI', 'GitHub'],
    sessions: [
      {
        number: 1,
        title: 'Dia 16: Planificacion del Proyecto Final',
        description: 'Definir alcance del proyecto final y crear plan de trabajo con asistencia de IA.',
        tools: ['ChatGPT', 'Notion AI', 'Figma'],
        duration: 120,
        theory: `# Dia 16: Planificacion del Proyecto Final

## Objetivo
Definir alcance del proyecto final y crear plan de trabajo con asistencia de IA.

## PROYECTO FINAL: "AI-POWERED SOLUTION PORTFOLIO"

Cada estudiante creara 3 proyectos que demuestren dominio de IA:

### Proyecto 1: App Web Funcional
- Opciones: Lovable.dev, Replit, o Streamlit
- Debe resolver problema real
- Ejemplos: Calculadora de presupuesto con IA, Asistente de estudio con flashcards, Generador de CVs, App de recetas inteligente

### Proyecto 2: Chatbot Inteligente Personalizado
- Usar Google AI Studio + Gemini API
- Debe tener personalidad y proposito claro
- Ejemplos: Tutor virtual de matematicas, Asesor de carrera, Coach de productividad, Guia turistico de Ecuador

### Proyecto 3: Dashboard de Datos Interactivo
- Python + pandas + Streamlit
- Dataset real (minimo 500 filas)
- Minimo 5 visualizaciones
- Ejemplos: Mercado laboral Ecuador, Salud publica, Comercio electronico, Redes sociales

## Actividades del Dia
1. Brainstorming de ideas (con ChatGPT)
2. Seleccionar las 3 ideas finales
3. Crear wireframes/mockups con IA (Figma o Canva)
4. Definir datasets y APIs necesarias
5. Crear cronograma de trabajo con IA

## Entregable
- Documento de propuesta con descripcion, publico objetivo, funcionalidades, mockups y cronograma

## Tarea
- Investigar y descargar datasets necesarios
- Crear cuentas en plataformas que usaras`,
        ai_context: 'Eres un mentor de proyecto final. Ayuda al estudiante a elegir y planificar 3 proyectos: app web, chatbot y dashboard. Da ideas creativas, ayuda a definir alcance realista para 1 semana. Contexto: joven ecuatoriano.',
        ai_prompt: 'Necesito ideas para mi proyecto final del Preuniversitario IA. Tengo que hacer 3 proyectos: una app web, un chatbot y un dashboard. Dame 3 ideas originales que se conecten entre si.'
      },
      {
        number: 2,
        title: 'Dia 17: Desarrollo Sprint 1',
        description: 'Iniciar desarrollo de los 3 proyectos con asistencia intensiva de IA.',
        tools: ['Lovable.dev', 'Google AI Studio', 'Streamlit', 'ChatGPT'],
        duration: 120,
        theory: `# Dia 17: Desarrollo Sprint 1

## Objetivo
Iniciar desarrollo de los 3 proyectos con asistencia intensiva de IA.

## Plan de Trabajo (2 horas)
- **00:00-00:40** → Proyecto 1 (App Web): Estructura basica + 2 funcionalidades core
- **00:40-01:20** → Proyecto 2 (Chatbot): Configurar Gemini API + primeras conversaciones
- **01:20-02:00** → Proyecto 3 (Dashboard): Cargar dataset + analisis exploratorio + 2 graficos

## Metodologia
- Trabajo intenso con IA como copiloto
- Pair programming (estudiantes se ayudan)
- Commits constantes a GitHub
- Si te bloqueas: pide ayuda a IA inmediatamente

## Actividades
- **Proyecto 1:** Estructura basica + 2 funcionalidades core
- **Proyecto 2:** Configurar Gemini API + primeras conversaciones del chatbot
- **Proyecto 3:** Cargar dataset + analisis exploratorio + 2 graficos

## Meta del Dia
- Avance 30% de cada proyecto
- Codigo en GitHub (con commits descriptivos)
- Lista de bloqueos/dudas para resolver

## Tarea
- Continuar desarrollo por tu cuenta (minimo 2 horas extra)
- Pedir ayuda a IA cuando te bloquees`,
        ai_context: 'Eres un mentor de desarrollo sprint. Ayuda al estudiante a avanzar rapido en sus 3 proyectos. Si se bloquea, dale la solucion inmediata con codigo. Prioriza velocidad y funcionalidad sobre perfeccion.',
        ai_prompt: 'Estoy trabajando en mi app web con Lovable.dev. Necesito agregar un formulario que capture nombre y email. Como se lo pido a la IA de Lovable?'
      },
      {
        number: 3,
        title: 'Dia 18: Desarrollo Sprint 2',
        description: 'Completar 70% de los proyectos y empezar refinamiento.',
        tools: ['Lovable.dev', 'Google AI Studio', 'Streamlit', 'Canva AI'],
        duration: 120,
        theory: `# Dia 18: Desarrollo Sprint 2

## Objetivo
Completar 70% de los proyectos y empezar refinamiento.

## Plan de Trabajo (2 horas)
- **00:00-00:40** → Proyecto 1: Completar funcionalidades + mejorar UI/UX
- **00:40-01:20** → Proyecto 2: Afinar respuestas del chatbot + cubrir casos de uso
- **01:20-02:00** → Proyecto 3: Completar visualizaciones + agregar interactividad

## Actividades
- Testing exhaustivo de cada proyecto (con ayuda de companeros)
- Debugging asistido por IA (pega el error y la IA lo resuelve)
- Mejorar diseno visual (UX/UI) usando Canva AI para assets
- Optimizar codigo (pedir a IA que refactorice)

## Meta del Dia
- Avance 70% de cada proyecto
- Proyectos funcionales (aunque no perfectos)
- Lista de mejoras pendientes para el dia 19

## Tarea
- Pulir detalles de los 3 proyectos
- Preparar texto de presentacion (con ayuda de IA)`,
        ai_context: 'Eres un mentor de refinamiento de proyectos. Ayuda al estudiante a mejorar UI/UX, corregir bugs y optimizar codigo. Da feedback constructivo. Prioriza: que funcione > que se vea bonito > que sea perfecto.',
        ai_prompt: 'Mi chatbot a veces da respuestas incorrectas o muy largas. Como puedo mejorar el system prompt para que sea mas preciso y conciso?'
      },
      {
        number: 4,
        title: 'Dia 19: Finalizacion y Preparacion de Presentacion',
        description: 'Completar 100% de proyectos y crear presentacion profesional.',
        tools: ['Canva AI', 'ChatGPT', 'GitHub'],
        duration: 120,
        theory: `# Dia 19: Finalizacion y Preparacion de Presentacion

## Objetivo
Completar 100% de proyectos y crear presentacion profesional.

## Plan de Trabajo (2 horas)
- **00:00-01:00** → Finalizar los 3 proyectos (100%)
- **01:00-01:40** → Crear presentacion profesional
- **01:40-02:00** → Ensayo de presentacion (pitch de 5 min)

## Actividades
- Ultimos ajustes y testing final
- Deploy/publicacion de todos los proyectos
- Crear presentacion con IA (Canva AI o ChatGPT genera slides)
- Grabar demo videos de cada proyecto (1 min cada uno)
- Preparar repositorio GitHub profesional con README

## Estructura de Presentacion (5 minutos)
1. **Introduccion (30 seg):** Quien eres + problema que resuelves
2. **Demo Proyecto 1 (1 min):** App Web en vivo
3. **Demo Proyecto 2 (1 min):** Chatbot conversando
4. **Demo Proyecto 3 (1 min):** Dashboard interactivo
5. **Tech stack y aprendizajes (1 min):** Herramientas usadas
6. **Cierre y Q&A (30 seg):** Proximos pasos

## Entregable
- 3 proyectos completados al 100%
- Presentacion de slides profesional
- Videos demo de cada proyecto
- Repositorio GitHub publico y documentado
- LinkedIn post anunciando tu portfolio (redactado con IA)

## Tarea
- Ensayar presentacion hasta que fluya naturalmente
- Preparar respuestas a posibles preguntas`,
        ai_context: 'Eres un coach de presentaciones y pitch. Ayuda al estudiante a crear slides profesionales y ensayar su presentacion de 5 minutos. Da tips de comunicacion, estructura narrativa y manejo de nervios.',
        ai_prompt: 'Necesito crear una presentacion de 5 minutos para mi proyecto final. Ayudame a estructurar los slides y dame tips para presentar con confianza.'
      },
      {
        number: 5,
        title: 'Dia 20: Presentaciones Finales y Certificacion',
        description: 'Presentar proyectos al grupo y recibir certificacion.',
        tools: ['Canva AI', 'ChatGPT'],
        duration: 120,
        theory: `# Dia 20: Presentaciones Finales y Certificacion

## Objetivo
Presentar proyectos al grupo y recibir certificacion del Preuniversitario IA ITSEIA.

## Formato
- 5 minutos presentacion + 2 minutos Q&A por estudiante
- Evaluacion por rubrica (instructor + autoevaluacion + peers)
- Feedback constructivo grupal

## Agenda
- **18:00-18:10** → Bienvenida y explicacion de dinamica
- **18:10-19:30** → Presentaciones (12 estudiantes x 7 min = 84 min)
- **19:30-19:45** → Votacion: Mejores proyectos por categoria
- **19:45-20:00** → Entrega de certificados + foto grupal + cierre

## Categorias de Premios
- App mas innovadora
- Chatbot mas util
- Dashboard mas visual
- Mejor uso de IA
- Proyecto mas completo

## Rubrica de Evaluacion
| Criterio | Peso | Descripcion |
|----------|------|-------------|
| Funcionalidad | 30% | Los 3 proyectos funcionan correctamente |
| Uso de IA | 25% | Demuestra dominio de herramientas de IA |
| Creatividad | 20% | Originalidad en la solucion del problema |
| Presentacion | 15% | Claridad, estructura, confianza |
| Documentacion | 10% | GitHub con README, codigo comentado |

## Post-evento
- Compartir proyectos en redes sociales
- Agregar al LinkedIn como certificacion
- Mantenerse en comunidad alumni ITSEIA
- Ruta siguiente: Carrera en IA, Ciencia de Datos o Big Data en ITSEIA

## Felicidades!
Has completado el Preuniversitario IA de ITSEIA. En 4 semanas pasaste de no saber que es la IA a crear apps, chatbots y dashboards. El futuro no se espera. Se construye.`,
        ai_context: 'Eres un mentor de cierre del Preuniversitario IA. Felicita al estudiante, ayuda con preguntas de ultima hora, sugiere proximos pasos de carrera en IA. Motiva a continuar aprendiendo. Contexto: ITSEIA ofrece carreras de 2.5 anos en IA, Ciencia de Datos y Big Data.',
        ai_prompt: 'Acabo de terminar el Preuniversitario IA. Que carrera me recomiendas: IA, Ciencia de Datos o Big Data? Quiero la que tenga mejor salida laboral en Ecuador.'
      }
    ]
  }
];

// ============================================
// Main loading logic
// ============================================

async function loadPreuniversitario() {
  console.log('='.repeat(60));
  console.log('ITSEIA Academy V3 - Preuniversitario IA Loader');
  console.log('Loading 4 weeks x 5 days = 20 sessions');
  console.log('Target: Preuniversitario IA program (958d9795...)');
  console.log('='.repeat(60));

  // Step 1: Create semester
  console.log('\nCreating semester: Preuniversitario IA - 4 Semanas');
  const semester = await supabasePost('semesters', {
    program_id: PREUNI_PROGRAM_ID,
    number: 1,
    name: 'Preuniversitario IA - Modulo Completo (4 Semanas)',
    level: 'basic',
    is_active: true
  });
  console.log(`Semester created: ${semester.id}`);

  let totalSessions = 0;
  let totalSubjects = 0;

  // Step 2: Create subjects (one per week) and sessions (one per day)
  for (const week of WEEKS) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`WEEK ${week.number}: ${week.name}`);
    console.log(`${'='.repeat(50)}`);

    // Create subject for this week
    const subject = await supabasePost('subjects', {
      semester_id: semester.id,
      code: week.code,
      name: week.name,
      slug: week.slug,
      description: week.description,
      credit_hours: 3,
      hours_docencia: 3,   // 30% of 10h
      hours_practica: 5,   // 50% of 10h
      hours_autonomo: 2,   // 20% of 10h
      hours_total: 10,
      tools: week.tools,
      order_index: week.number,
      is_active: true
    });
    console.log(`  Subject created: ${subject.id}`);
    totalSubjects++;

    // Create sessions for each day
    for (const session of week.sessions) {
      console.log(`\n  [Dia ${(week.number - 1) * 5 + session.number}] ${session.title}`);

      const sess = await supabasePost('sessions', {
        subject_id: subject.id,
        number: session.number,
        title: session.title,
        description: session.description,
        theory_markdown: session.theory,
        ai_lab_context: session.ai_context,
        ai_lab_suggested_prompt: session.ai_prompt,
        estimated_duration_minutes: session.duration,
        order_index: session.number,
        is_active: true
      });
      console.log(`    Session created: ${sess.id} (${(session.theory.length / 1024).toFixed(1)} KB)`);
      totalSessions++;

      // Create quiz for checkpoint days (day 5, 10, 15, 20) and knowledge-check days
      if (session.number === 5) {
        try {
          const quizTitle = `Checkpoint ${week.name}`;
          const quiz = await supabasePost('quizzes', {
            session_id: sess.id,
            title: quizTitle,
            pass_percentage: 60,
            max_attempts: 5,
            is_active: true
          });

          const checkpointQuestions = getCheckpointQuestions(week.number);
          for (let q = 0; q < checkpointQuestions.length; q++) {
            await supabasePostMinimal('quiz_questions', {
              quiz_id: quiz.id,
              question_text: checkpointQuestions[q].question_text,
              question_type: checkpointQuestions[q].question_type,
              options: JSON.stringify(checkpointQuestions[q].options),
              explanation: checkpointQuestions[q].explanation,
              points: 1,
              order_index: q + 1
            });
          }
          console.log(`    Quiz created: ${checkpointQuestions.length} questions`);
        } catch (err) {
          console.log(`    Quiz error: ${err.message}`);
        }
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 150));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('COMPLETED SUCCESSFULLY');
  console.log('='.repeat(60));
  console.log(`\nSemester ID: ${semester.id}`);
  console.log(`Subjects created: ${totalSubjects}`);
  console.log(`Sessions created: ${totalSessions}`);
}

// ============================================
// Checkpoint quiz questions per week
// ============================================

function getCheckpointQuestions(weekNumber) {
  const quizzes = {
    1: [
      {
        question_text: 'Que es un LLM (Large Language Model)?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Un modelo matematico entrenado con texto masivo que predice la mejor respuesta', is_correct: true },
            { text: 'Un robot que piensa como humano', is_correct: false },
            { text: 'Un buscador de internet avanzado', is_correct: false },
            { text: 'Un programa que memoriza todas las respuestas posibles', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'Los LLMs son modelos matematicos entrenados con enormes cantidades de texto. Aprenden patrones del lenguaje y predicen la respuesta mas probable y util.'
      },
      {
        question_text: 'Cual es la estructura correcta del framework CREA para prompts?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Contexto, Rol, Especifico, Accion', is_correct: true },
            { text: 'Crear, Revisar, Evaluar, Aplicar', is_correct: false },
            { text: 'Copiar, Repetir, Editar, Automatizar', is_correct: false },
            { text: 'Consultar, Responder, Escribir, Analizar', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'CREA = Contexto (situacion), Rol (que papel debe asumir la IA), Especifico (detalles precisos), Accion (que debe hacer exactamente).'
      },
      {
        question_text: 'Por que Python es el lenguaje mas usado en IA?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Es simple de aprender, tiene miles de librerias de IA y alta demanda laboral', is_correct: true },
            { text: 'Es el unico lenguaje que las IAs entienden', is_correct: false },
            { text: 'Es el lenguaje mas rapido que existe', is_correct: false },
            { text: 'Fue creado especificamente para IA', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'Python combina simplicidad (facil de aprender), un ecosistema enorme de librerias (pandas, TensorFlow, etc.) y altisima demanda laboral en el campo de IA.'
      },
      {
        question_text: 'Que es chain-of-thought prompting?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Pedir a la IA que razone paso a paso antes de dar la respuesta final', is_correct: true },
            { text: 'Encadenar multiples IAs para obtener mejor respuesta', is_correct: false },
            { text: 'Hacer la misma pregunta muchas veces seguidas', is_correct: false },
            { text: 'Usar ChatGPT y Claude al mismo tiempo', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'Chain-of-thought consiste en pedir a la IA que muestre su razonamiento paso a paso, lo que mejora significativamente la calidad de las respuestas complejas.'
      },
      {
        question_text: 'Que herramienta usamos para investigar con fuentes citadas en tiempo real?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Perplexity', is_correct: true },
            { text: 'DALL-E', is_correct: false },
            { text: 'Google Colab', is_correct: false },
            { text: 'Canva AI', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'Perplexity es un motor de busqueda con IA que cita fuentes verificables. Es superior a Google para investigacion porque sintetiza la informacion y te muestra de donde viene.'
      }
    ],
    2: [
      {
        question_text: 'Que ventaja tiene pandas sobre Excel para datos grandes?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Mayor velocidad, reproducibilidad del analisis y capacidad de automatizacion', is_correct: true },
            { text: 'Es mas facil de usar que Excel', is_correct: false },
            { text: 'Tiene mejores graficos que Excel', is_correct: false },
            { text: 'Funciona sin internet', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'pandas procesa millones de filas en segundos, el codigo es reproducible (puedes repetir el analisis) y se puede automatizar completamente.'
      },
      {
        question_text: 'Que es Streamlit?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Un framework Python para crear apps web de datos sin HTML/CSS/JS', is_correct: true },
            { text: 'Una libreria para hacer graficos estaticos', is_correct: false },
            { text: 'Un servicio de streaming de video', is_correct: false },
            { text: 'Un editor de codigo online', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'Streamlit permite crear apps web interactivas usando solo Python. Ideal para dashboards de datos, y se puede publicar gratis en Streamlit Cloud.'
      },
      {
        question_text: 'Que funcion de pandas muestra estadisticas descriptivas de un dataset?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'df.describe()', is_correct: true },
            { text: 'df.statistics()', is_correct: false },
            { text: 'df.summary()', is_correct: false },
            { text: 'df.analyze()', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'df.describe() muestra count, mean, std, min, 25%, 50%, 75% y max de todas las columnas numericas.'
      },
      {
        question_text: 'Que libreria de Python crea graficos interactivos?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'plotly', is_correct: true },
            { text: 'matplotlib', is_correct: false },
            { text: 'seaborn', is_correct: false },
            { text: 'numpy', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'plotly genera graficos interactivos que se pueden compartir como HTML. matplotlib y seaborn generan graficos estaticos (imagenes).'
      },
      {
        question_text: 'Cual es la mejor forma de pedir formulas de Excel a ChatGPT?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Describir exactamente que datos tienes, en que columnas estan y que resultado esperas', is_correct: true },
            { text: 'Simplemente decir "dame una formula de Excel"', is_correct: false },
            { text: 'Copiar y pegar toda la hoja de calculo', is_correct: false },
            { text: 'Pedir que adivine que formula necesitas', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'La precision del prompt determina la calidad de la formula. Describe la estructura de tus datos, las columnas y el resultado esperado.'
      }
    ],
    3: [
      {
        question_text: 'Que tipo de Machine Learning usa Netflix para recomendar peliculas?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Aprendizaje supervisado (aprende de tus preferencias anteriores)', is_correct: true },
            { text: 'Aprendizaje no supervisado (encuentra patrones solo)', is_correct: false },
            { text: 'Aprendizaje por refuerzo (prueba y error)', is_correct: false },
            { text: 'No usa Machine Learning, es manual', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'Netflix usa aprendizaje supervisado: entrena modelos con tus calificaciones y historial de visualizacion para predecir que peliculas te gustaran.'
      },
      {
        question_text: 'Que es Google AI Studio?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Una interfaz visual para experimentar con modelos Gemini de Google', is_correct: true },
            { text: 'Un editor de imagenes con IA', is_correct: false },
            { text: 'Una red social de Google', is_correct: false },
            { text: 'Una app para grabar musica', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'Google AI Studio permite crear y probar prompts, construir chatbots y obtener API keys para usar Gemini en tus propias aplicaciones.'
      },
      {
        question_text: 'Que es Lovable.dev?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Plataforma que crea apps web completas conversando con IA, sin programar', is_correct: true },
            { text: 'Una red social para programadores', is_correct: false },
            { text: 'Un lenguaje de programacion nuevo', is_correct: false },
            { text: 'Una tienda de apps', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'Lovable.dev es una plataforma no-code donde describes lo que quieres en lenguaje natural y la IA construye la app web completa, con hosting incluido.'
      },
      {
        question_text: 'En automatizacion con Zapier, que es un "trigger"?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'El evento que dispara la automatizacion (ej: recibir un email)', is_correct: true },
            { text: 'El resultado final de la automatizacion', is_correct: false },
            { text: 'Un error en el workflow', is_correct: false },
            { text: 'El nombre de la automatizacion', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'Un trigger es el evento inicial que activa el workflow. Ejemplo: "Cuando recibo un email nuevo" (trigger) → "Guarda el asunto en Google Sheets" (accion).'
      },
      {
        question_text: 'Que es Teachable Machine?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Herramienta de Google que permite entrenar modelos de ML sin codigo', is_correct: true },
            { text: 'Un curso online de Machine Learning', is_correct: false },
            { text: 'Un lenguaje de programacion para ML', is_correct: false },
            { text: 'Un robot educativo fisico', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'Teachable Machine permite entrenar clasificadores de imagenes, sonido y poses sin escribir codigo. Solo le muestras ejemplos y el modelo aprende.'
      }
    ],
    4: [
      {
        question_text: 'Cuantos proyectos incluye el portfolio del proyecto final?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: '3 proyectos: App Web, Chatbot y Dashboard', is_correct: true },
            { text: '1 proyecto grande', is_correct: false },
            { text: '5 proyectos pequenos', is_correct: false },
            { text: '2 proyectos: App y Dashboard', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'El portfolio incluye 3 proyectos que demuestran diferentes habilidades: App Web (Lovable/Replit), Chatbot (Gemini API) y Dashboard (Streamlit).'
      },
      {
        question_text: 'Cual es la estructura correcta de la presentacion final (5 min)?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Intro + Demo App + Demo Chatbot + Demo Dashboard + Tech Stack + Cierre', is_correct: true },
            { text: 'Leer el codigo de cada proyecto', is_correct: false },
            { text: 'Hablar solo de la teoria aprendida', is_correct: false },
            { text: 'Mostrar solo screenshots sin demos en vivo', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: '30 seg intro, 1 min app, 1 min chatbot, 1 min dashboard, 1 min tech stack, 30 seg cierre. Los demos en vivo son mas impactantes que screenshots.'
      },
      {
        question_text: 'Que herramientas de IA aprendiste en el Preuniversitario?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: '14 herramientas: ChatGPT, Claude, Gemini, Python, Streamlit, Lovable.dev, y mas', is_correct: true },
            { text: 'Solo ChatGPT', is_correct: false },
            { text: '3 herramientas: ChatGPT, Excel, Word', is_correct: false },
            { text: '2 herramientas: Python y JavaScript', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'El Preuniversitario cubre 14 herramientas de IA: ChatGPT, Claude, Gemini, Perplexity, Python, Google Colab, GitHub Copilot, Google AI Studio, Lovable.dev, Replit, DALL-E/Midjourney, Canva AI, Zapier/Make, Notion AI.'
      },
      {
        question_text: 'Cual es el siguiente paso despues del Preuniversitario en ITSEIA?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'Carrera de 2.5 anos en IA, Ciencia de Datos o Big Data', is_correct: true },
            { text: 'No hay siguiente paso', is_correct: false },
            { text: 'Repetir el preuniversitario', is_correct: false },
            { text: 'Un examen de admision', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'ITSEIA ofrece 3 carreras tecnologicas de 2.5 anos (5 semestres): Inteligencia Artificial, Ciencia de Datos y Big Data. Horario vespertino 17:30-21:30.'
      },
      {
        question_text: 'Que es lo mas importante que aprendiste sobre usar IA como profesional?',
        question_type: 'multiple_choice',
        options: {
          options: [
            { text: 'La IA es una herramienta que potencia tu capacidad, pero el criterio y la responsabilidad son tuyos', is_correct: true },
            { text: 'La IA reemplaza completamente el trabajo humano', is_correct: false },
            { text: 'Solo necesitas saber usar ChatGPT', is_correct: false },
            { text: 'La IA siempre tiene la razon', is_correct: false }
          ],
          correct_index: 0
        },
        explanation: 'La IA no reemplaza el criterio profesional. Es un multiplicador de capacidad: hace el trabajo repetitivo mas rapido, pero las decisiones importantes las tomas tu.'
      }
    ]
  };

  return quizzes[weekNumber] || [];
}

// ============================================
// Main
// ============================================

loadPreuniversitario().catch(err => {
  console.error('\nFATAL ERROR:', err.message);
  process.exit(1);
});
