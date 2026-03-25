<!-- Sync Impact Report
Version: 0.0.0 → 1.0.0 (MAJOR: initial constitution)
Added: 8 principles, 3 additional sections
Removed: none (initial)
Templates requiring updates: ✅ all templates are default, will sync on first use
-->

# ITSEIA Academy Online — Constitution

## Core Principles

### I. Estructura Madre es Ley
ESTRUCTURA_COMPLETA.md define 21 módulos exactos para la plataforma (7 alumno, 4 docente, 7 admin, 3 público). Ningún módulo se agrega ni elimina sin aprobación explícita del CEO. Toda decisión técnica DEBE verificarse contra este documento antes de implementarse. Si hay conflicto entre una decisión técnica y la estructura madre, la estructura madre gana.

### II. Datos Académicos CES son Inamovibles
Las 3 carreras (IA, Ciencia de Datos, Big Data) tienen estructura oficial presentada al CES (PROYECTO_CARRERAS_ITSEIA_CORREGIDO.pdf). Cada carrera: 5 períodos, 3600 horas, 75 créditos, 600h/período. Los nombres de asignaturas, horas de docencia, horas de práctica y horas de autónomo son EXACTOS y no pueden modificarse. 1 crédito = 48 horas de actividad del estudiante (RRA Art. 9). Las materias varían entre 60h y 260h totales según el período.

### III. Simplicidad Antes que Todo
Pregunta obligatoria antes de cada decisión: "¿Podría Héctor mantener esto solo un domingo por la tarde si algo falla?" Si NO → buscar alternativa más simple. Stack bloqueado: Next.js (App Router) + TypeScript + Tailwind CSS 4 + shadcn/ui + Supabase + Vercel. NO se permite sin autorización explícita: microservicios, Kubernetes, Kafka, múltiples bases de datos, GraphQL, auth propia, monorepos complejos. Costo operativo máximo: $95/mes a 200 estudiantes.

### IV. Cada Materia es un Producto Completo
Cada asignatura en la plataforma DEBE tener para cada sesión de clase: (1) Video de 15-30 min, (2) Presentación/slides PDF, (3) Contenido teórico en markdown, (4) Quiz con auto-grading y explicaciones, (5) Ejercicio práctico con instrucciones y rúbrica, (6) AI Lab contextual con prompt específico, (7) Recursos y bibliografía. Una materia sin estos 7 elementos NO está completa. Nunca declarar una materia como "lista" si falta alguno.

### V. AI Lab es el Diferenciador
El AI Lab NO es un chatbot genérico. DEBE incluir: tutor IA contextual por materia (Gemini API), selector multi-modelo (mínimo 3 modelos), editor de código en browser para materias de programación, y acceso a herramientas IA externas. El AI Lab recibe automáticamente el contexto de la sesión actual. El estudiante NO paga por el uso de IA — está incluido en su matrícula. Cuota: 500 consultas/mes por estudiante.

### VI. Panel Docente es Obligatorio
El 0% actual del panel docente es inaceptable. Un docente DEBE poder: ver sus materias asignadas, subir contenido (video URL, PDF, markdown), crear quizzes, revisar y calificar entregas de trabajos, ver progreso de sus estudiantes. Sin panel docente, la plataforma no puede operar como instituto real.

### VII. Contenido Real, No Genérico
Nunca crear contenido placeholder o genérico. Los 27 módulos profesionales existentes (contadores, médicos, abogados — 6,590 líneas de contenido real) y las mallas de INVESTIGACION_MATERIAS.md (38KB) son la fuente de contenido. Los videos DEBEN ser de YouTube de calidad verificada (no inventados). Los quizzes DEBEN tener explicaciones para cada respuesta. Los ejercicios DEBEN ser prácticos y aplicables.

### VIII. Equipo de Agentes, No Trabajo Solo
Todo desarrollo DEBE usar agentes especializados según la MESA_DIRECTIVA_Y_EQUIPO.md: Director Académico (curriculum), Director Tecnología (arquitectura), Director Producto (UX), Director Contenido (materiales), Director QA (verificación). Nunca un solo agente hace todo. El CTO coordina. Las decisiones se registran en DECISIONS.md.

## Estructura Académica Oficial

Fuente: PROYECTO_CARRERAS_ITSEIA_CORREGIDO.pdf (presentado al CES, febrero 2026)

### Carrera 1: Inteligencia Artificial
- Título: Tecnólogo/a Superior en Inteligencia Artificial
- Campo RANT: 06-1-1 Ciencias Computacionales
- Período 1 (6 asignaturas, 600h): Fundamentos Programación, Matemáticas IA I, Intro IA, Lógica Computacional, Comunicación Académica, Ética Digital
- Período 2 (6 asignaturas, 600h): POO, Matemáticas IA II, Estadística/Probabilidad, Bases de Datos, Estructuras Datos/Algoritmos, Inglés Técnico I
- Período 3 (6 asignaturas, 600h): Machine Learning I, Python Ciencia Datos, Procesamiento Datos, Cloud Computing IA, Visualización Datos, Metodologías Ágiles
- Período 4 (6 asignaturas, 600h): ML II Avanzado, Deep Learning/Redes Neuronales, PLN, Visión Artificial, MLOps/Despliegue, Inglés Técnico II
- Período 5 (5 asignaturas, 600h): IA Generativa/LLMs, Sistemas Recomendación, Robótica/IA Embebida, Emprendimiento Tecnológico, Proyecto Integrador

### Carrera 2: Ciencia de Datos
- Título: Tecnólogo/a Superior en Ciencia de Datos
- Campo RANT: 06-1-2 Diseño y adm. de redes y BD
- Período 1 (6 asignaturas, 600h): Fundamentos Programación, Matemáticas I (Cálculo), Intro Ciencia Datos, Lógica/Pensamiento Analítico, Comunicación Académica, Ética Digital/Gobernanza
- Período 2 (6 asignaturas, 600h): POO, Matemáticas II (Álgebra Lineal), Estadística Descriptiva/Inferencial, BD Relacionales, Estructuras Datos, Inglés Técnico I
- Período 3 (6 asignaturas, 600h): Python Ciencia Datos, Análisis Exploratorio, ML I, BD NoSQL, Visualización Datos, Metodologías Ágiles
- Período 4 (6 asignaturas, 600h): ML II, Deep Learning Aplicado, PLN, Data Engineering/Pipelines, Cloud Computing Datos, Inglés Técnico II
- Período 5 (5 asignaturas, 600h): Análisis Avanzado/Modelado Predictivo, Big Data/Procesamiento Distribuido, Storytelling con Datos, Emprendimiento Tecnológico, Proyecto Integrador

### Carrera 3: Big Data e Inteligencia de Negocio
- Título: Tecnólogo/a Superior en Big Data e Inteligencia de Negocio
- Campo RANT: 06-1-2 Diseño y adm. de redes y BD
- Período 1 (6 asignaturas, 600h): Fundamentos Programación, Matemáticas I (Estadística), Intro Big Data, Lógica/Pensamiento Analítico, Comunicación Académica, Ética Digital/Responsabilidad
- Período 2 (6 asignaturas, 600h): POO, Matemáticas II (Álgebra/Cálculo), Estadística Inferencial, BD Relacionales/NoSQL, Estructuras Datos, Inglés Técnico I
- Período 3 (6 asignaturas, 600h): Ecosistema Big Data (Hadoop/Spark), Python Análisis Datos, Inteligencia Negocio/Reporting, Data Warehousing/ETL, Visualización/Dashboards, Metodologías Ágiles
- Período 4 (6 asignaturas, 600h): ML para Negocios, Analítica Predictiva, Procesamiento Tiempo Real (Streaming), Cloud Computing/Data Lakes, Gestión Proyectos Datos, Inglés Técnico II
- Período 5 (5 asignaturas, 600h): IA Aplicada a Negocios, Gobierno Datos/Compliance, Estrategia Digital/Transformación, Emprendimiento Tecnológico, Proyecto Integrador

## Productos y Precios (Fase 1 — sin CES)

| Producto | Precio | Tipo |
|----------|--------|------|
| Preuniversitario online | $180 | Pago único |
| Curso Express Profesionales | $97 | Pago único |
| Curso Estándar Profesionales | $197 | Pago único |
| Curso Completo Profesionales | $297 | Pago único |
| Matrícula carrera | $180 | Pago único |
| Pensión mensual carrera | $300/mes | Recurrente |
| Pensión Pionero (50 cupos) | $220/mes | Recurrente, 25% desc |

## Governance

Esta constitución es la ley suprema del proyecto ITSEIA Academy Online. Tiene prioridad sobre cualquier otra decisión, preferencia o práctica.

### Enmiendas
- Solo el CEO (Héctor Velasco) puede aprobar cambios a esta constitución
- Toda enmienda requiere: documentación del cambio, justificación, y actualización del número de versión
- El CTO propone cambios; el CEO aprueba o rechaza

### Cumplimiento
- Todo PR/review DEBE verificar cumplimiento con los 8 principios
- El agente `revisor` incluye verificación constitucional en su checklist
- Violaciones de principios I, II, III o IV bloquean el merge

### Referencia
- Guardrail principal: ESTRUCTURA_COMPLETA.md (21 módulos)
- Datos académicos: PROYECTO_CARRERAS_ITSEIA_CORREGIDO.pdf
- Modelo educativo: Modelo_Educativo_-signed.pdf
- Investigación LMS: INVESTIGACION_LMS_MEJORES_PRACTICAS.md
- Créditos CES: INVESTIGACION_CREDITOS_ACADEMICOS_ECUADOR.md
- Mesa directiva: MESA_DIRECTIVA_Y_EQUIPO.md

**Version**: 1.0.0 | **Ratified**: 2026-03-21 | **Last Amended**: 2026-03-21
