#!/usr/bin/env node
/**
 * generate_gamma_presentations.js
 *
 * Generates 12 presentations via Gamma API v1.0, exports each as PDF,
 * and updates the corresponding session's slides_url in Supabase.
 *
 * Run: node content/generate_gamma_presentations.js
 *
 * Gamma API: https://public-api.gamma.app/v1.0
 * Auth header: X-API-KEY
 * Flow: POST /generations → poll GET /generations/{id} until completed → grab exportUrl
 */

// ============================================
// Config
// ============================================

const GAMMA_KEY  = 'sk-gamma-i1QpwB075C7XJzrB37YkUOCybMnM6FswKcmxbpH8g';
const GAMMA_BASE = 'https://public-api.gamma.app/v1.0';

const SUPA_BASE  = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SUPA_KEY   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';

const SUPA_HEADERS = {
  apikey:          SUPA_KEY,
  Authorization:  'Bearer ' + SUPA_KEY,
  'Content-Type': 'application/json',
  Prefer:         'return=representation'
};

const GAMMA_HEADERS = {
  'X-API-KEY':     GAMMA_KEY,
  'Content-Type':  'application/json'
};

// ============================================
// The 12 presentations
// Format:
//   title       : presentation title shown in Gamma
//   inputText   : structured content for the 10 slides
//   sessionQuery: partial title to match a Supabase session (or null to skip DB update)
//   programSlug : used to narrow the Supabase session search
// ============================================

const PRESENTATIONS = [
  // 1 ---------------------------------------------------------------
  {
    title: 'Fundamentos de Programacion y Python',
    inputText: `
# Fundamentos de Programacion y Python
## Carrera: Inteligencia Artificial — Sesion 1

### Slide 1: Bienvenida a la Carrera IA
- Que es la Inteligencia Artificial
- Por que estudiar IA en 2026
- Tu primer dia en ITSEIA

### Slide 2: Que es la Programacion?
- Instrucciones que le damos a una computadora
- Algoritmos: receta paso a paso
- Ejemplo cotidiano: como preparar un café (pseudocodigo)

### Slide 3: Por que Python?
- #1 en IA y Machine Learning
- Sintaxis legible y amigable
- Ecosistema: NumPy, Pandas, TensorFlow, scikit-learn
- Gratis y open source

### Slide 4: Instalando Python
- Python.org — descargar version 3.12+
- Anaconda para ciencia de datos
- VS Code como editor recomendado
- Verificar: python --version

### Slide 5: Tu Primer Programa
- print("Hola, Mundo!")
- Ejecutar en terminal vs editor
- Errores comunes y como leerlos
- Celebrar el primer output!

### Slide 6: Variables y Tipos de Datos
- Variables: cajas que guardan informacion
- Tipos: int, float, str, bool
- Ejemplos: nombre = "Maria", edad = 25, promedio = 9.5
- Reglas de nombres de variables

### Slide 7: La Funcion print()
- print() es tu ventana al mundo
- Imprimir texto, numeros, variables
- f-strings: f"Hola {nombre}, tienes {edad} anos"
- Separadores y fin de linea

### Slide 8: Operadores Basicos
- Aritmeticos: + - * / // % **
- Comparacion: == != < > <= >=
- Logicos: and or not
- Practica: calculadora en 5 lineas

### Slide 9: Input del Usuario
- input("Ingresa tu nombre: ")
- Combinar input + print
- Convertir tipos: int(), float()
- Mini proyecto: calculadora interactiva

### Slide 10: Proximos Pasos
- Condicionales if/else (Sesion 2)
- Bucles for y while (Sesion 3)
- Funciones (Sesion 4)
- Recurso: docs.python.org/es
- Tarea: hacer 3 programas con print()
    `.trim(),
    sessionQuery: 'Fundamentos de Programaci',
    programSlug: 'carrera-ia'
  },

  // 2 ---------------------------------------------------------------
  {
    title: 'Introduccion a la Ciencia de Datos',
    inputText: `
# Introduccion a la Ciencia de Datos
## Carrera: Ciencia de Datos — Sesion 1

### Slide 1: Que es la Ciencia de Datos?
- La interseccion de estadistica, programacion y dominio de negocio
- "El trabajo mas sexy del siglo XXI" — Harvard Business Review
- Datos como el petroleo del siglo XXI

### Slide 2: El Ciclo de Vida del Dato
- Recoleccion de datos
- Limpieza y preparacion
- Exploracion y analisis
- Modelado
- Comunicacion de resultados

### Slide 3: Metodologia CRISP-DM
- Business Understanding: entender el problema
- Data Understanding: explorar los datos
- Data Preparation: limpiar y transformar
- Modeling: construir modelos
- Evaluation: validar resultados
- Deployment: implementar en produccion

### Slide 4: Herramientas del Cientifico de Datos
- Python (pandas, numpy, matplotlib, seaborn)
- Jupyter Notebooks: tu laboratorio interactivo
- SQL para bases de datos
- Power BI / Tableau para visualizacion
- Git para control de versiones

### Slide 5: Python para Datos — Primeros Pasos
- import pandas as pd
- import numpy as np
- Leer un CSV: pd.read_csv('datos.csv')
- Ver primeras filas: df.head()

### Slide 6: Estadistica Descriptiva Basica
- Media, mediana, moda
- Desviacion estandar
- Distribucion de datos
- df.describe() en pandas

### Slide 7: Tipos de Datos y Problemas
- Datos estructurados vs no estructurados
- Clasificacion, regresion, clustering
- Ejemplos: prediccion de ventas, deteccion de fraude, segmentacion de clientes

### Slide 8: Perspectiva Laboral Ecuador y LATAM
- Salario promedio Data Scientist Ecuador: $1,200-$2,500/mes
- Demanda creciente en banca, telecomunicaciones, retail
- Brecha de talento: 30,000 plazas vs 3,000 graduados
- Oportunidades remotas internacionales

### Slide 9: Casos de Exito en LATAM
- Banco Pichincha: prediccion de credito
- Claro Ecuador: churn de clientes
- Farmacias: optimizacion de inventario
- Startups FinTech usando ML

### Slide 10: Tu Mapa de Aprendizaje
- Semestre 1: Python, Estadistica, SQL
- Semestre 2: Machine Learning, Visualizacion
- Semestre 3: Deep Learning, Big Data
- Certificaciones: Google Data Analytics, IBM Data Science
- Proyecto final: pipeline completo de datos reales
    `.trim(),
    sessionQuery: 'Introduccion a la Ciencia de Datos',
    programSlug: 'carrera-ciencia-datos'
  },

  // 3 ---------------------------------------------------------------
  {
    title: 'Fundamentos de IA Aplicada',
    inputText: `
# Fundamentos de IA Aplicada
## Preuniversitario ITSEIA — Semana 1, Dia 1

### Slide 1: Bienvenida al Preuniversitario IA
- 4 semanas intensivas de Inteligencia Artificial
- Sin requisitos previos — empezamos desde cero
- ITSEIA: el primer IST especializado en IA de Ecuador

### Slide 2: Que es la Inteligencia Artificial?
- Sistemas que aprenden de datos y toman decisiones
- IA = imitar capacidades humanas con maquinas
- No es ciencia ficcion — ya la usas todos los dias

### Slide 3: Breve Historia de la IA
- 1950: Alan Turing — "Can machines think?"
- 1956: Conferencia de Dartmouth — nace el termino IA
- 1997: Deep Blue vence a Kasparov
- 2012: Deep Learning revoluciona vision artificial
- 2022: ChatGPT — la IA llega al publico masivo

### Slide 4: IA en Tu Vida Cotidiana
- Netflix y Spotify: recomendaciones personalizadas
- Google Maps: rutas optimas en tiempo real
- Face ID: reconocimiento facial
- Correo: filtro de spam
- TikTok/Instagram: algoritmo de contenido

### Slide 5: Tipos de IA
- IA Estrecha (Narrow AI): especializada en 1 tarea
- IA General (AGI): nivel humano — aun no existe
- IA Superinteligente: mas alla del humano — futuro lejano
- Donde estamos hoy: Narrow AI muy avanzada

### Slide 6: Machine Learning — La Base de Todo
- Las maquinas aprenden de ejemplos
- Entrenamiento: miles de fotos de gatos
- El modelo aprende patrones automaticamente
- Prediccion: clasifica nuevas fotos

### Slide 7: Aplicaciones Reales de IA
- Salud: diagnostico por imagenes, deteccion temprana cancer
- Finanzas: deteccion de fraude, trading automatico
- Educacion: tutores personalizados (como ITSEIA Academy)
- Agricultura: drones con vision artificial
- Legal: analisis de contratos

### Slide 8: IA en Ecuador
- BanEcuador: scoring crediticio con ML
- IESS: optimizacion de asignacion de turnos medicos
- Municipio de Quito: semaforos inteligentes (piloto)
- Startups locales: ImagemIA (diagnostico medico)
- Oportunidad: somos pioneers en la region

### Slide 9: El Futuro con IA
- 85 millones de trabajos se transformaran (WEF 2025)
- 97 millones de nuevos roles emergeran
- Habilidades clave: pensamiento critico + IA
- Los que usen IA reemplazaran a los que no
- Ecuador necesita ingenieros IA locales

### Slide 10: Esta Semana en el Preuniversitario
- Dia 1 (hoy): Fundamentos de IA
- Dia 2: Prompt Engineering con ChatGPT y Claude
- Dia 3: IA para crear (imagenes, videos, codigo)
- Dia 4: ML sin codigo — primeros modelos
- Dia 5: Proyecto grupal + presentacion
    `.trim(),
    sessionQuery: 'Fundamentos de IA',
    programSlug: 'preuniversitario'
  },

  // 4 ---------------------------------------------------------------
  {
    title: 'Prompt Engineering: Habla con la IA',
    inputText: `
# Prompt Engineering: Habla con la IA
## Preuniversitario ITSEIA — Semana 1, Dia 2

### Slide 1: Que es el Prompt Engineering?
- El arte de hablar con la IA de forma efectiva
- Un buen prompt = mejores resultados
- Skill #1 mas demandada en 2026 segun LinkedIn
- No requiere saber programar

### Slide 2: Los Grandes Modelos de Lenguaje (LLMs)
- ChatGPT (OpenAI): el mas popular
- Claude (Anthropic): el mas seguro y detallado
- Gemini (Google): integrado con busqueda
- Llama (Meta): open source
- Todos usan el mismo principio: texto entra, texto sale

### Slide 3: Anatomia de un Buen Prompt
- ROL: "Actua como un experto en..."
- CONTEXTO: quien eres, que necesitas
- TAREA: que quieres exactamente
- FORMATO: como quieres la respuesta
- EJEMPLO: muestra como quieres el output

### Slide 4: ChatGPT vs Claude — Comparacion
- ChatGPT: muy versatil, GPT-4o es multimodal
- Claude: respuestas mas largas y precisas, mejor para documentos
- Gemini: mejor conectado a Google, busqueda en tiempo real
- Para educacion: Claude sobresale en explicaciones detalladas
- Para crear: ChatGPT + DALL-E para imagenes

### Slide 5: Prompts Basicos — Ejemplos
- Malo: "Explicame IA"
- Bueno: "Explicame que es Machine Learning en 5 puntos, con ejemplos de Ecuador, para un estudiante de bachillerato"
- Malo: "Haz un codigo"
- Bueno: "Escribe en Python una funcion que calcule el promedio de una lista de numeros, con comentarios en espanol"

### Slide 6: Tecnicas Avanzadas de Prompting
- Chain of Thought: "Piensa paso a paso..."
- Few-Shot: dar 2-3 ejemplos antes de pedir
- Role Prompting: "Eres un profesor universitario..."
- Output Format: "Responde en formato JSON / tabla / lista"
- Temperatura: controlar creatividad vs precision

### Slide 7: Prompt Engineering para Estudiar
- Crear resumenes: "Resume este texto en 10 puntos clave"
- Explicar conceptos: "Explicame X como si tuviera 15 anos"
- Generar ejercicios: "Crea 10 preguntas sobre este tema con respuestas"
- Corregir codigo: "Encuentra el error en este codigo Python"
- Traducir y adaptar contenido

### Slide 8: Limites de la IA — Lo que Debes Saber
- Alucinaciones: la IA puede inventar datos
- Corte de conocimiento: no sabe lo que paso ayer
- No reemplaza el criterio humano
- Siempre verificar informacion critica
- Sesgo en los datos de entrenamiento

### Slide 9: Proyecto — Tu Primer Prompt Profesional
- Elige un tema de tu carrera futura
- Crea un prompt con ROL + CONTEXTO + TAREA + FORMATO
- Ejecutalo en ChatGPT y en Claude
- Compara las respuestas
- Itera 3 veces mejorando el prompt

### Slide 10: Recursos para Seguir Practicando
- Learn Prompting: learnprompting.org (gratis)
- Prompt Engineering Guide: promptingguide.ai
- ChatGPT: chat.openai.com
- Claude: claude.ai
- Gamma (para presentaciones): gamma.app
    `.trim(),
    sessionQuery: 'Prompt Engineering',
    programSlug: 'preuniversitario'
  },

  // 5 ---------------------------------------------------------------
  {
    title: 'IA para Contadores: Fundamentos',
    inputText: `
# IA para Contadores: Fundamentos
## Curso Profesional Contadores — Modulo T-01

### Slide 1: La IA Esta Cambiando la Contabilidad
- El 40% de las tareas contables se pueden automatizar (McKinsey 2025)
- Los contadores que usen IA seran 5x mas productivos
- La IA no reemplaza al contador — reemplaza al contador que no usa IA
- Oportunidad unica para profesionales en Ecuador

### Slide 2: Que Puede Hacer la IA por Ti Como Contador?
- Automatizar conciliaciones bancarias
- Generar reportes financieros en segundos
- Detectar anomalias y posible fraude
- Interpretar normativas contables actualizadas
- Preparar declaraciones (con supervision humana)

### Slide 3: Herramientas IA para Contadores
- ChatGPT Plus: redaccion de informes, interpretacion de normas
- Claude: analisis de documentos largos, contratos, estados financieros
- Microsoft 365 Copilot: Excel con IA integrado
- QuickBooks AI: contabilidad automatica
- Xero + IA: facturacion y conciliacion automatica

### Slide 4: IA y el SRI Ecuador
- Interpretacion automatica del Reglamento Tributario
- Recordatorios de fechas de declaracion
- Calculo de multas e intereses
- Comparacion de regimenes fiscales (RIMPE vs general)
- Ejemplos de prompts para consultas tributarias

### Slide 5: Automatizacion de Reportes con Excel + Copilot
- Antes: 4 horas para estado de resultados
- Con Copilot: 20 minutos
- Genera graficos automaticamente
- Detecta celdas con errores
- Explica las formulas en lenguaje natural

### Slide 6: Caso Real — Empresa Comercial Quito
- Empresa: 50 empleados, facturacion mensual $200K
- Problema: conciliacion bancaria tomaba 8 horas/mes
- Solucion: Excel + Power Query + Copilot
- Resultado: 45 minutos/mes (-91% tiempo)
- ROI: 7.5 horas liberadas para analisis estrategico

### Slide 7: Deteccion de Anomalias con IA
- Los algoritmos detectan patrones inusuales
- Facturas duplicadas, pagos atipicos, variaciones inesperadas
- Excel: reglas de formato condicional avanzado
- Python (nivel basico): pandas para identificar outliers
- Ahorro promedio: 2-3% de ingresos en fraudes detectados

### Slide 8: Etica y Responsabilidad Profesional
- La IA puede cometer errores — el contador firma
- Verificar siempre los calculos criticos
- Confidencialidad: NO subir datos de clientes a ChatGPT publico
- Usar Microsoft 365 Copilot (datos privados en tu empresa)
- Tu criterio profesional sigue siendo insustituible

### Slide 9: ROI de Aprender IA Como Contador
- Ahorro tiempo: 10-15 horas/mes
- Tarifa hora contador: $15-$30/hora
- Ahorro mensual: $150-$450/mes
- Inversion en curso ITSEIA: $197
- Recuperas la inversion en menos de 2 semanas

### Slide 10: Lo Que Aprenderemos en Este Curso
- Modulo T-01 (hoy): Fundamentos IA
- Modulo T-02: ChatGPT y Claude para contadores
- Modulo T-03: Seguridad y privacidad de datos
- Modulo F-01: Automatizacion de reportes
- Modulo F-02: Deteccion de anomalias
- Certificado ITSEIA al completar
    `.trim(),
    sessionQuery: 'IA para Contadores',
    programSlug: 'curso-contadores'
  },

  // 6 ---------------------------------------------------------------
  {
    title: 'IA para Medicos: Fundamentos',
    inputText: `
# IA para Medicos: Fundamentos
## Curso Profesional Medicos — Modulo T-01

### Slide 1: La IA Transforma la Medicina
- La IA diagnostica ciertos canceres mejor que radiologos (Nature, 2024)
- El 30% de los errores medicos son prevenibles con IA (OMS)
- No es reemplazar al medico — es amplificar su capacidad
- Los medicos que usen IA tendran mejores resultados clinicos

### Slide 2: Aplicaciones IA en Medicina Actual
- Diagnostico por imagen: rayos X, TAC, resonancias
- Prediccion de readmisiones hospitalarias
- Documentacion clinica automatica
- Drug discovery: descubrimiento de nuevos farmacos
- Triaje inteligente en urgencias

### Slide 3: Herramientas IA Clinicas Disponibles Hoy
- ChatGPT / Claude: busqueda bibliografica, redaccion de informes
- Nuance DAX: dictado medico con IA (Microsoft)
- Google MedPaLM 2: modelo de lenguaje medico
- ImagemIA: analisis de imagenes medicas (empresa ecuatoriana)
- Epic + IA: notas clinicas automaticas

### Slide 4: ImagemIA — Caso Ecuador
- Empresa fundada en Quito por ITSEIA
- Analiza imagenes de radiologia con IA
- Reduce inasistencias a citas 30%
- Prioriza casos urgentes automaticamente
- Adoptado por clinicas en Ecuador y Colombia

### Slide 5: IA para Documentacion Clinica
- Dictado de historia clinica en tiempo real
- Genera SOAP automaticamente del audio
- Reduce carga administrativa 40%
- Medico se concentra en el paciente
- Compatible con sistemas como MedSystem Ecuador

### Slide 6: Diagnostico Asistido por IA
- La IA como segundo par de ojos
- No diagnostica sola — asiste al clinico
- Reduce la tasa de falsos negativos
- Casos de uso: dermatologa, radiologia, patologia
- Alerta temprana en monitoreo de UCI

### Slide 7: Etica en IA Medica
- El medico mantiene la responsabilidad legal
- Sesgo algoritmico: modelos entrenados en poblaciones distintas
- Consentimiento informado sobre uso de IA
- Privacidad de datos del paciente (Ley LOPD Ecuador)
- Transparencia: el paciente puede saber si se uso IA

### Slide 8: Privacidad de Datos del Paciente
- HIPAA (USA) / GDPR (Europa) / LOPD (Ecuador)
- Nunca subir datos identificables a ChatGPT publico
- Usar anonimizacion antes de cualquier analisis
- Sistemas hospitalarios con IA deben tener contrato de datos
- Tu reputacion y licencia estan en juego

### Slide 9: ROI para el Medico
- Ahorro documentacion: 2 horas/dia
- Consultas adicionales posibles: 4-6/dia
- Ingreso adicional: $200-$400/dia
- Inversion en curso ITSEIA: $197
- Retorno: primer dia de aplicacion

### Slide 10: Mapa del Curso Completo
- Modulo T-01: Fundamentos IA en salud (hoy)
- Modulo T-02: ChatGPT y Claude en clinica
- Modulo T-03: Privacidad de datos del paciente
- Modulo S-01: Diagnostico asistido por IA
- Modulo S-02: Documentacion clinica automatizada
- Modulo S-03: Busqueda bibliografica con IA
    `.trim(),
    sessionQuery: 'IA para M',
    programSlug: 'curso-medicos'
  },

  // 7 ---------------------------------------------------------------
  {
    title: 'AWS Cloud Practitioner: Introduccion',
    inputText: `
# AWS Cloud Practitioner: Introduccion
## Track Certificaciones — AWS CLF-C02

### Slide 1: Por Que Certificarse en AWS?
- AWS domina el 32% del mercado cloud mundial
- Profesionales certificados ganan 25% mas (Global Knowledge 2025)
- 1.5 millones de puestos cloud sin cubrir en LATAM
- Certificacion mas demandada en Ecuador para IT
- 1 examen, 90 minutos, $100 USD

### Slide 2: Que es la Nube (Cloud)?
- Recursos informaticos bajo demanda via internet
- Sin servidores propios — pagas lo que usas
- Alta disponibilidad: 99.99% uptime
- Escalabilidad infinita
- AWS = Amazon Web Services, fundada 2006

### Slide 3: Los 3 Modelos de Servicio Cloud
- IaaS (Infraestructura): maquinas virtuales, almacenamiento
- PaaS (Plataforma): entornos de ejecucion gestionados
- SaaS (Software): aplicaciones listas para usar
- Ejemplos AWS: EC2 (IaaS), Elastic Beanstalk (PaaS), Amazon Connect (SaaS)

### Slide 4: Los 4 Modelos de Despliegue
- Cloud Publica: todo en AWS (mas comun)
- Cloud Privada: datacenter propio estilo cloud
- Cloud Hibrida: mezcla de ambos
- Multi-Cloud: AWS + Azure + GCP
- Gobierno Ecuador: Modelo Hibrido (datos sensibles on-premise)

### Slide 5: Servicios Core de AWS
- EC2: maquinas virtuales (Elastic Compute Cloud)
- S3: almacenamiento de objetos (Simple Storage Service)
- RDS: bases de datos relacionales gestionadas
- Lambda: funciones sin servidor (serverless)
- IAM: gestion de identidades y accesos

### Slide 6: AWS para IA y Machine Learning
- SageMaker: entrenar y desplegar modelos ML
- Rekognition: vision artificial
- Comprehend: procesamiento de lenguaje natural
- Transcribe: voz a texto
- Bedrock: LLMs como Claude y Llama en AWS

### Slide 7: Modelo de Precios AWS
- Pay-as-you-go: pagas por uso real
- Reserved Instances: hasta 72% descuento con compromiso
- Spot Instances: hasta 90% descuento (recursos sobrantes)
- Free Tier: 1 ano gratis para nuevas cuentas
- Calculadora: calculator.aws

### Slide 8: La Certificacion AWS Cloud Practitioner
- Codigo: CLF-C02 (examen actualizado 2024)
- 65 preguntas de opcion multiple
- 90 minutos
- Puntuacion minima: 700/1000
- Valido 3 anos, renovable con recertificacion

### Slide 9: Dominios del Examen
- Cloud Concepts (24%): conceptos basicos, modelos de despliegue
- Security & Compliance (30%): IAM, cifrado, Well-Architected
- Cloud Technology & Services (34%): servicios principales AWS
- Billing & Pricing (12%): modelos de costo, calculadora, soporte

### Slide 10: Plan de Estudio Recomendado
- Semana 1-2: Cloud Concepts + Security
- Semana 3-4: Technology & Services
- Semana 5: Billing & Practice Exams
- Practica: AWS Skill Builder (gratis)
- Simulacros: Tutorials Dojo (recomendado)
- Meta: 500 preguntas de practica antes del examen
    `.trim(),
    sessionQuery: 'AWS Cloud Practitioner',
    programSlug: 'certificaciones'
  },

  // 8 ---------------------------------------------------------------
  {
    title: 'Google Cloud Digital Leader',
    inputText: `
# Google Cloud Digital Leader
## Track Certificaciones — Google CDL

### Slide 1: Google Cloud en el Ecosistema Tech
- Google Cloud: 11% mercado cloud, creciendo 28% anual
- Lider en IA/ML con Vertex AI y Gemini
- BigQuery: el data warehouse mas usado en empresas
- Certificacion ideal para roles no-tecnicos que usan cloud
- 90 preguntas, 90 minutos, $200 USD

### Slide 2: Que Aprenderemos Hoy
- Que es Google Cloud y su diferenciador
- Los servicios de IA/ML de Google
- Estructura del examen CDL
- Plan de estudio en 4 semanas
- Recursos gratuitos disponibles

### Slide 3: Google Cloud vs AWS vs Azure
- Google Cloud: mejor en IA, datos y analytics
- AWS: mayor ecosistema, mas servicios
- Azure: mejor integracion con Microsoft 365
- Para IA/ML: Google Cloud es el lider claro
- Para empresas con Google Workspace: Google Cloud natural

### Slide 4: Servicios Clave de Google Cloud
- Compute Engine: maquinas virtuales
- Cloud Storage: almacenamiento de objetos
- BigQuery: SQL analitico a escala masiva
- Cloud Run: contenedores serverless
- Looker: business intelligence

### Slide 5: IA y ML en Google Cloud
- Vertex AI: plataforma unificada de ML
- Gemini API: acceso a los modelos Gemini
- Vision AI: reconocimiento de imagenes
- Natural Language AI: analisis de texto
- Speech-to-Text / Text-to-Speech
- AutoML: entrenar modelos sin codigo

### Slide 6: Vertex AI — El Diferenciador
- Entrena, despliega y monitorea modelos en 1 plataforma
- Compatible con TensorFlow, PyTorch, scikit-learn
- AutoML para no-programadores
- Model Garden: catalogo de modelos pre-entrenados
- Gemini integrado para casos generativos

### Slide 7: BigQuery para Analisis de Datos
- Analiza terabytes de datos en segundos
- SQL estandar — facil de aprender
- Completamente serverless (sin infraestructura)
- Integracion nativa con Looker y Data Studio
- Caso uso Ecuador: analisis de datos SRI, INEC

### Slide 8: Estructura del Examen CDL
- Digital Transformation with Google Cloud (17%)
- Innovating with Data and Google Cloud (16%)
- Infrastructure and Application Modernization (22%)
- Google Cloud Security and Operations (20%)
- Scaling with Google Cloud Operations (16%)
- Trust and Security (9%)

### Slide 9: Google Cloud for Education
- Google Workspace for Education: suite completa gratuita
- Google Classroom: LMS integrado
- Chromebooks: dispositivos optimizados para cloud
- Google AI Tools for Education (NotebookLM, etc.)
- ITSEIA usa Google Meet + Calendar + Drive

### Slide 10: Plan de Estudio 4 Semanas
- Semana 1: Cloud fundamentals + Digital Transformation
- Semana 2: Data, IA y ML en Google Cloud
- Semana 3: Infrastructure + Security
- Semana 4: Simulacros y repaso
- Recurso oficial: cloud.google.com/training (muchos GRATIS)
- Vouchers de examen disponibles en Google Developer Student Clubs
    `.trim(),
    sessionQuery: 'Google Cloud Digital Leader',
    programSlug: 'certificaciones'
  },

  // 9 ---------------------------------------------------------------
  {
    title: 'Docencia Virtual Efectiva',
    inputText: `
# Docencia Virtual Efectiva
## Capacitacion Docentes ITSEIA — Modulo 1

### Slide 1: El Docente Digital del Siglo XXI
- La educacion virtual no es menor que la presencial — es diferente
- Tus estudiantes son nativos digitales: atencion fragmentada, multitarea
- El docente virtual es parte productor de contenido, parte facilitador
- ITSEIA Academy: plataforma con IA, videos, quizzes, proyectos

### Slide 2: Principios de Aprendizaje Online
- Microlearning: sesiones de 15-20 minutos maximas
- Video engagement: 6 minutos optimo (MIT Media Lab)
- Active recall: el quiz despues de cada lectura fija el conocimiento
- Spaced repetition: repasar a los 1, 7 y 30 dias
- Social learning: foros, proyectos grupales, peer review

### Slide 3: Diseno de una Sesion Efectiva
- 0-2 min: Hook — por que importa este tema?
- 2-10 min: Contenido core con ejemplos concretos
- 10-12 min: Actividad o ejercicio practico
- 12-14 min: Resumen y conexion con siguiente sesion
- 14-15 min: Quiz de 3-5 preguntas (refuerzo)

### Slide 4: El LMS ITSEIA Academy
- Plataforma propia en itseia.ai/academy/
- Modulos: videos, teoria markdown, AI Lab, quizzes, tareas
- Dashboard del docente: progreso de cada estudiante
- Notificaciones automaticas por email
- Gemini AI integrado para soporte 24/7

### Slide 5: Crear Contenido Video Efectivo
- Cara visible: genera confianza y conexion emocional
- Fondo profesional o virtual limpio
- Iluminacion frontal, no trasera
- Audio claro: microfono de solapa > microfono de laptop
- Camtasia / OBS para grabacion de pantalla

### Slide 6: Tecnicas de Engagement Virtual
- Hacer preguntas directas: "Que harias tu en este caso?"
- Crear expectativa: "Al final de esta sesion sabras..."
- Humor situacional apropiado
- Casos reales de Ecuador y LATAM
- Retos semanales con reconocimiento publico

### Slide 7: Feedback y Evaluacion Virtual
- Rubrica clara antes de cada tarea
- Retroalimentacion en 48 horas (compromiso ITSEIA)
- Comentarios especificos, no generales
- Video feedback de 2-3 minutos para proyectos importantes
- Reconocer publicamente el trabajo excelente

### Slide 8: Manejo de Grupos Online
- Check-in semanal de 5 minutos con cada estudiante
- Canal de WhatsApp/Discord por cohorte
- Sesion sincronica semanal de 60 minutos (Office Hours)
- Identificar desercion temprano: inactividad 3 dias
- Mentor de cohort: estudiante adelantado que ayuda a los demas

### Slide 9: Herramientas del Docente ITSEIA
- Zoom/Google Meet: clases sincronicas
- Loom: videos rapidos de feedback
- Canva: materiales visuales
- Notion: organizacion del syllabus
- ChatGPT/Claude: generar ejercicios, rubrica, casos

### Slide 10: Tu Plan de Accion Inmediato
- Esta semana: Revisa el dashboard del LMS ITSEIA
- Dia 1-2: Graba tu video de bienvenida (2-3 min)
- Dia 3-4: Crea tu primer quiz de 5 preguntas
- Dia 5: Diseña la rubrica de tu primera tarea
- Modulo 2: El Campus Virtual ITSEIA (como navegar y administrar)
    `.trim(),
    sessionQuery: 'Docencia Virtual Efectiva',
    programSlug: 'formacion-docentes'
  },

  // 10 ---------------------------------------------------------------
  {
    title: 'El Campus Virtual ITSEIA',
    inputText: `
# El Campus Virtual ITSEIA
## Capacitacion Docentes ITSEIA — Modulo 2

### Slide 1: Tu Nueva Aula — itseia.ai/academy/
- Plataforma propia, no un LMS generico
- Construida especificamente para educacion en IA
- 22 cursos, 198 modulos activos
- AI Lab con Gemini integrado para cada sesion
- Accesible 24/7 desde cualquier dispositivo

### Slide 2: Arquitectura del Campus
- Programas > Semestres > Materias > Sesiones
- Cada sesion: video + teoria + AI Lab + quiz + tarea + recursos
- Sistema de progreso por estudiante
- Insignias y certificados automaticos al completar

### Slide 3: Como Crear una Sesion Nueva
- Dashboard Docente > Mi Materia > Nueva Sesion
- Campos: titulo, descripcion, duracion estimada
- Subir video (YouTube/Vimeo embed o upload directo)
- Redactar teoria en Markdown (sintaxis simple)
- Activar/desactivar segun avance del grupo

### Slide 4: El AI Lab — Tu Diferenciador
- Cada sesion tiene un AI Lab con contexto especifico
- Gemini 2.5 Flash responde sobre el tema de la sesion
- Como docente configuras: prompt de sistema, contexto, sugerencias
- Ejemplo: "Explica las diferencias entre CNN y RNN con ejemplos clinicos"
- Los estudiantes practican con IA mientras aprenden

### Slide 5: Crear Quizzes Efectivos
- Dashboard > Sesion > Agregar Quiz
- 3-5 preguntas opcion multiple por sesion
- Minimo aprobatorio configurable (default 70%)
- Maximo de intentos: 3 (configurable)
- Las preguntas se mezclan aleatoriamente

### Slide 6: Asignar y Revisar Tareas
- Crea instrucciones en Markdown con rubrica incluida
- Tipos de archivo aceptados: PDF, .py, .ipynb, video
- Flujo: estudiante sube tarea > tu recibes notificacion > calificas
- Calificacion 0-100 con comentario obligatorio
- Historial de entregas completo

### Slide 7: Monitorear el Progreso
- Panel de progreso: % completado por estudiante
- Ultima actividad: detecta inactividad temprano
- Quizzes: ver intentos, scores, tiempo invertido
- Engagement score por sesion (views, tiempo, interacciones AI Lab)
- Exportar reporte CSV para reuniones academicas

### Slide 8: Comunicacion con Estudiantes
- Anuncios: mensaje a toda la cohorte
- Comentarios en sesion: hilo de discusion
- Notificaciones email automaticas (nueva sesion, feedback)
- WhatsApp Business: complemento para urgencias
- Politica ITSEIA: respuesta maxima 48 horas

### Slide 9: Presentaciones y Recursos
- Sube PDFs, links, presentaciones (slides_url)
- Las presentaciones de Gamma se ven directamente en el aula
- Recursos externos: YouTube, articulos, papers
- Organiza por tipo: lectura obligatoria / complementaria
- Nomocle tus archivos: [codigo]_[tema]_[fecha].pdf

### Slide 10: Soporte y Comunidad Docente
- Slack #docentes: canal de ayuda interna ITSEIA
- Reunion semanal docentes: viernes 5pm (Google Meet)
- Base de conocimiento: Notion equipo ITSEIA
- Quien contactar: administracion@itseia.ai
- Siguiente modulo: Estrategias de Evaluacion Autentica
    `.trim(),
    sessionQuery: 'El Campus Virtual ITSEIA',
    programSlug: 'formacion-docentes'
  },

  // 11 ---------------------------------------------------------------
  {
    title: 'H3L: Auditoria Operativa con IA',
    inputText: `
# H3L: Auditoria Operativa con IA
## ITSEIA Empresas — Presentacion Corporativa

### Slide 1: H3L — Liberando Capacidad Atrapada
- h3l.ai | Fundada 2023 | 7 paises
- Mision: identificar y liberar capacidad operativa oculta en empresas
- Capacidad atrapada promedio: $150,000 - $800,000 por empresa
- Metodologia unica combinando IA + auditoria humana
- Clientes: PYMES y medianas empresas, sector financiero, salud, retail

### Slide 2: El Problema que Resolvemos
- El 73% de las empresas tiene procesos ineficientes que nadie ve (Gartner 2024)
- Horas-hombre en tareas repetitivas: 30-40% del tiempo total
- Decisiones basadas en intuicion, no en datos
- Sistemas desconectados que no se hablan
- Resultado: dinero y tiempo que se evaporan sin saberlo

### Slide 3: La Metodologia H3L
- Fase 1 — Diagnostico (2 semanas): mapeo de procesos con IA
- Fase 2 — Analisis (1 semana): identificar cuellos de botella
- Fase 3 — Propuesta (3 dias): plan de optimizacion con ROI proyectado
- Fase 4 — Implementacion (4-12 semanas): ejecucion con equipo H3L
- Fase 5 — Medicion: KPIs antes/despues verificados

### Slide 4: Que Audita H3L?
- Procesos financieros y contables
- Operaciones de recursos humanos
- Atencion al cliente y soporte
- Supply chain y logistica
- Tecnologia y sistemas internos

### Slide 5: IA al Servicio de la Auditoria
- NLP: analiza miles de emails, tickets, documentos en horas
- Process Mining: mapea flujos reales vs flujos documentados
- Anomaly Detection: identifica desviaciones y desperdicios
- Predictive Analytics: proyecta ROI de cada optimizacion
- Dashboards en tiempo real para directivos

### Slide 6: Resultados Reales — Casos de Estudio
- Empresa Financiera Quito: $320,000 capacidad recuperada en 6 meses
- Clinica Privada Guayaquil: 40% reduccion tiempo administrativo
- Distribuidora Lima: $180,000 en eficiencia logistica
- Banco Regional Colombia: 65% menos tiempo en conciliaciones
- Promedio de ROI: 8:1 en el primer ano

### Slide 7: Presencia Internacional
- Ecuador: sede principal, Quito
- Colombia, Peru, Chile, Mexico, Espana, USA
- Equipo: 35 consultores especializados
- Partners: Microsoft, AWS, Salesforce
- Certificaciones: ISO 9001, CMMI Level 3

### Slide 8: Strata — El Cerebro Digital
- Producto hermano: strata.h3l.ai
- 9,000+ documentos indexados, 19 paises
- Tu empresa tiene un asistente que sabe todo
- Desde $19.99/mes por usuario
- Integracion con Slack, Teams, Notion

### Slide 9: Como Contratar H3L
- Paso 1: Sesion de diagnostico inicial GRATIS (30 min)
- Paso 2: Propuesta personalizada en 5 dias
- Paso 3: Firma de confidencialidad y acceso
- Paso 4: Auditoria 3-4 semanas
- Paso 5: Implementacion del plan de optimizacion
- Contacto: h3l.ai | WhatsApp +593 95 989 2034

### Slide 10: Por Que H3L + ITSEIA?
- H3L identifica la brecha de talento IA en tu empresa
- ITSEIA forma al talento que H3L necesita
- Pipeline completo: diagnosis → training → implementation
- Descuento corporativo para empleados de clientes H3L
- Caso Ecuador: empresas con H3L contratan graduados ITSEIA
    `.trim(),
    sessionQuery: 'H3L',
    programSlug: 'empresas'
  },

  // 12 ---------------------------------------------------------------
  {
    title: 'Capacitacion Corporativa ITSEIA',
    inputText: `
# Capacitacion Corporativa ITSEIA
## Oferta B2B — Transformacion IA para Equipos

### Slide 1: ITSEIA Empresas — Transforma Tu Equipo
- Instituto especializado #1 en IA de Ecuador
- +200 profesionales capacitados en IA aplicada
- Modalidad: presencial, virtual o hibrida
- Grupos desde 5 hasta 500 personas
- ROI promedio: equipo 3x mas productivo en 90 dias

### Slide 2: Por Que Capacitar en IA Ahora?
- El 85% de las empresas LATAM no tienen estrategia IA (IDC 2025)
- Las empresas con IA crecen 2.6x mas rapido (Accenture)
- Tus competidores ya estan implementando IA
- La ventana de ventaja competitiva es ahora (2025-2027)
- Costo de no actuar: quedar obsoleto en 3-5 anos

### Slide 3: Catalogo de Programas Corporativos
- IA Fundamentals (1 dia): concienciacion ejecutiva
- IA para Profesionales (8 semanas): por area funcional
- Data Analytics Bootcamp (3 meses): equipos tecnicos
- IA Leadership (2 dias): alta gerencia, vision estrategica
- Certificaciones Cloud: AWS, Google Cloud, Azure

### Slide 4: Personalizacion por Area
- Contadores: automatizacion reportes, deteccion fraude
- Medicos/Clinicas: documentacion IA, diagnostico asistido
- Abogados: investigacion juridica, redaccion contratos
- Marketing: contenido IA, ads optimization, analytics
- Gerencia General: dashboards IA, toma de decisiones

### Slide 5: Metodologia ITSEIA
- 30% teoria — conceptos solidos y actualizados
- 50% practica — casos reales de tu industria
- 20% proyecto — cada participante implementa algo real
- AI Lab: practicar con ChatGPT, Claude, Gemini
- Seguimiento 30 dias post-capacitacion

### Slide 6: El Dashboard Corporativo
- Panel exclusivo para RRHH y Gerencia
- Progreso individual de cada participante
- Quizzes y evaluaciones en tiempo real
- Certificados digitales con QR verificable
- Exportar reportes de competencias adquiridas

### Slide 7: Inversiones y Paquetes
- Basico (hasta 20 personas, 1 dia): desde $1,500
- Estandar (hasta 50 personas, 4 semanas): desde $4,500
- Premium (ilimitado, 3 meses + seguimiento): desde $9,500
- Precio por persona en grupo: desde $80/persona
- Financiamiento disponible en 3 cuotas sin interes

### Slide 8: ROI Calculado para Tu Empresa
- Ejemplo empresa 50 empleados:
- Ahorro tiempo promedio: 10h/persona/mes
- Costo hora empleado: $8
- Ahorro mensual: $4,000
- Inversion programa: $4,500
- Break-even: 1.1 meses — ROI a 12 meses: 964%

### Slide 9: Empresas que Ya Confian en ITSEIA
- Sector financiero: 3 clientes activos en Quito
- Salud: 2 clinicas privadas capacitadas
- Retail: cadena de 12 locales, 45 personas capacitadas
- Tech: 2 startups en crecimiento
- Metas 2026: 20 empresas, 500 profesionales capacitados

### Slide 10: Siguiente Paso
- Agenda tu sesion estrategica GRATIS (45 min)
- Diagnosticamos las necesidades de tu equipo
- Te presentamos propuesta personalizada en 48h
- Contacto: administracion@itseia.ai
- WhatsApp: +593 95 989 2034
- Web: itseia.ai | Calificacion Google: 4.9/5
    `.trim(),
    sessionQuery: 'Capacitacion Corporativa',
    programSlug: 'empresas'
  }
];

// ============================================
// Gamma API helpers
// ============================================

async function gammaCreate(presentation) {
  const body = {
    inputText: presentation.inputText,
    textMode: 'preserve',
    format: 'presentation',
    numCards: 10,
    exportAs: 'pdf',
    textOptions: {
      tone: 'professional, educational, clear, inspiring',
      amount: 'medium',
      language: 'Spanish'
    },
    imageOptions: {
      source: 'pictographic'
    }
  };

  const res = await fetch(GAMMA_BASE + '/generations', {
    method: 'POST',
    headers: GAMMA_HEADERS,
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Gamma POST failed (${res.status}): ${JSON.stringify(data).substring(0, 300)}`);
  }
  return data;
}

async function gammaPoll(generationId, maxWaitMs = 300000) {
  const start = Date.now();
  const interval = 8000; // 8 seconds

  while (Date.now() - start < maxWaitMs) {
    await sleep(interval);

    const res = await fetch(`${GAMMA_BASE}/generations/${generationId}`, {
      headers: GAMMA_HEADERS
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Gamma poll failed (${res.status}): ${JSON.stringify(data).substring(0, 200)}`);
    }

    const status = data.status || data.generation?.status;
    const exportUrl = data.exportUrl || data.generation?.exportUrl;
    const gammaUrl  = data.gammaUrl  || data.generation?.gammaUrl  || data.url || data.generation?.url;

    console.log(`    Polling... status=${status}`);

    if (status === 'completed' || status === 'complete') {
      return { exportUrl, gammaUrl, data };
    }
    if (status === 'failed' || status === 'error') {
      throw new Error(`Gamma generation failed: ${JSON.stringify(data).substring(0, 200)}`);
    }
  }

  throw new Error(`Gamma generation timed out after ${maxWaitMs / 1000}s`);
}

// ============================================
// Supabase helpers
// ============================================

async function supabaseGet(path) {
  const res = await fetch(SUPA_BASE + path, { headers: SUPA_HEADERS });
  const data = await res.json();
  if (!res.ok) throw new Error(`Supabase GET ${path} → ${res.status}: ${JSON.stringify(data).substring(0, 200)}`);
  return data;
}

async function findSessionId(presentation) {
  if (!presentation.sessionQuery) return null;

  try {
    // Try to find by partial title match — search across all sessions
    const encoded = encodeURIComponent(`%${presentation.sessionQuery}%`);
    const sessions = await supabaseGet(
      `/sessions?title=ilike.${encoded}&select=id,title,subject_id&limit=5`
    );

    if (sessions.length > 0) {
      // Return the first match
      return sessions[0];
    }

    console.log(`    Warning: no session found matching "${presentation.sessionQuery}"`);
    return null;

  } catch (e) {
    console.log(`    Warning: session lookup failed: ${e.message}`);
    return null;
  }
}

async function updateSessionSlidesUrl(sessionId, slidesUrl) {
  const res = await fetch(
    `${SUPA_BASE}/sessions?id=eq.${sessionId}`,
    {
      method: 'PATCH',
      headers: {
        ...SUPA_HEADERS,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ slides_url: slidesUrl })
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase PATCH sessions failed (${res.status}): ${body.substring(0, 200)}`);
  }
}

// ============================================
// Utils
// ============================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// ============================================
// Main
// ============================================

async function main() {
  console.log('=== ITSEIA Academy — Generando 12 Presentaciones Gamma ===');
  console.log(`Inicio: ${new Date().toISOString()}\n`);

  const results = [];

  for (let i = 0; i < PRESENTATIONS.length; i++) {
    const pres = PRESENTATIONS[i];
    const idx = pad(i + 1);

    console.log(`[${idx}/12] ${pres.title}`);

    let gammaUrl  = null;
    let exportUrl = null;
    let sessionId = null;
    let sessionTitle = null;
    let status = 'pending';

    try {
      // Step 1: Create generation
      console.log(`    Iniciando generacion Gamma...`);
      const created = await gammaCreate(pres);

      // Extract generation ID — handle different response shapes
      const generationId =
        created.id             ||
        created.generationId   ||
        created.generation?.id ||
        created.data?.id;

      if (!generationId) {
        throw new Error(`No generationId in response: ${JSON.stringify(created).substring(0, 300)}`);
      }

      console.log(`    Generation ID: ${generationId}`);

      // Step 2: Poll until complete
      console.log(`    Esperando completacion (max 5 min)...`);
      const result = await gammaPoll(generationId);

      gammaUrl  = result.gammaUrl;
      exportUrl = result.exportUrl;

      // Use gammaUrl as fallback if no PDF export URL
      const slidesUrl = exportUrl || gammaUrl;

      console.log(`    Gamma URL: ${gammaUrl}`);
      console.log(`    Export PDF URL: ${exportUrl || '(no PDF, usando gammaUrl)'}`);

      // Step 3: Find matching session in Supabase
      const sessionRecord = await findSessionId(pres);
      if (sessionRecord) {
        sessionId    = sessionRecord.id;
        sessionTitle = sessionRecord.title;
        console.log(`    Session encontrada: "${sessionTitle}" (${sessionId})`);

        // Step 4: Update slides_url
        await updateSessionSlidesUrl(sessionId, slidesUrl);
        console.log(`    slides_url actualizado en Supabase.`);
      } else {
        console.log(`    (Sin sesion en DB para actualizar)`);
      }

      status = 'ok';
      console.log(`    COMPLETADO\n`);

    } catch (err) {
      status = 'error';
      console.error(`    ERROR: ${err.message}\n`);
    }

    results.push({
      index:        i + 1,
      title:        pres.title,
      status,
      gammaUrl,
      exportUrl,
      sessionId,
      sessionTitle
    });

    // Brief pause between API calls to be respectful of rate limits
    if (i < PRESENTATIONS.length - 1) {
      console.log('    (Pausa 3s entre generaciones...)\n');
      await sleep(3000);
    }
  }

  // ============================================
  // Final report
  // ============================================
  console.log('\n=== REPORTE FINAL ===\n');
  console.log(`Fin: ${new Date().toISOString()}\n`);

  let ok = 0, errors = 0;

  for (const r of results) {
    const mark = r.status === 'ok' ? 'OK' : 'ERROR';
    console.log(`[${mark}] ${pad(r.index)}/12 — ${r.title}`);
    if (r.gammaUrl)     console.log(`       Gamma URL : ${r.gammaUrl}`);
    if (r.exportUrl)    console.log(`       PDF URL   : ${r.exportUrl}`);
    if (r.sessionTitle) console.log(`       DB Session: ${r.sessionTitle} (${r.sessionId})`);
    if (r.status === 'ok') ok++; else errors++;
  }

  console.log(`\nTotal: ${ok} exitosas, ${errors} errores`);

  if (errors > 0) {
    process.exit(1);
  }
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
