# AUDITORIA MODULO 03 -- CURSOS PROFESIONALES

**Fecha:** 2026-03-31
**Modulo:** Cursos Profesionales (program type: curso)
**3 programas:** Express, Estandar, Completo

---

## 1. RESUMEN EJECUTIVO

| Metrica | Express | Estandar | Completo |
|---------|---------|----------|----------|
| Program ID | be7e6b1e | 765cd165 | 259e324f |
| Slug | ia-profesionales-express | ia-aplicada-estandar | especialista-ia-completo |
| Courses (tabla courses) | 1 | 0 | 0 |
| Modules | 7 | 0 | 0 |
| Lessons totales | 25 | 0 | 0 |
| Lessons con video | 0 | -- | -- |
| Lessons con PDF | 0 | -- | -- |
| Lessons con markdown | 25 (687-1654 chars c/u) | -- | -- |
| Lessons con AI prompt | 25 | -- | -- |
| Tabla progress | SI (existe) | -- | -- |
| Tabla lesson_progress | NO EXISTE | -- | -- |

**Estado general: Express tiene estructura + contenido basico. Estandar y Completo estan COMPLETAMENTE VACIOS.**

---

## 2. ESTRUCTURA EN SUPABASE

### 2.1 Programas

| Programa | Nombre | Tipo | Semesters | Courses |
|----------|--------|------|-----------|---------|
| Express | Curso Express: IA para Profesionales | curso | 3 (Contadores, Medicos, Abogados) | 1 ("Fundamentos de IA Generativa") |
| Estandar | Curso Estandar: IA Aplicada | curso | 1 ("Curso Estandar - 4 Semanas") | 0 |
| Completo | Curso Completo: Especialista IA | curso | 1 ("Curso Completo - 6 Semanas") | 0 |

### 2.2 Express -- Course: "Fundamentos de IA Generativa" (906d7823)

**7 Modules:**

| # | Module ID | Nombre | Lessons |
|---|-----------|--------|---------|
| 1 | 00356c39 | Que es la IA Generativa | 5 |
| 2 | 6510d93b | Prompt Engineering Basico | 3 |
| 3 | 7cb37e75 | ChatGPT: Dominio Completo | 4 |
| 4 | eb226b17 | Claude: El Asistente Inteligente | 3 |
| 5 | 1277f23e | Gemini: La IA de Google | 3 |
| 6 | 772603a5 | IA en tu Profesion | 4 |
| 7 | 4294b441 | Proyecto Final | 3 |

**25 Lessons detalladas:**

**Modulo 1: Que es la IA Generativa (5 lessons)**
| # | Titulo | Dur | Video | PDF | Markdown | AI Prompt |
|---|--------|-----|-------|-----|----------|-----------|
| 1 | Bienvenida al Curso | 10m | NO | NO | 687 chars | SI |
| 2 | Historia de la IA: De Turing a ChatGPT | 15m | NO | NO | 836 chars | SI |
| 3 | Como funciona un modelo de lenguaje | 20m | NO | NO | 699 chars | SI |
| 4 | Tipos de IA: Narrow vs General vs Super | 15m | NO | NO | 818 chars | SI |
| 5 | El ecosistema actual: OpenAI, Anthropic, Google | 15m | NO | NO | 847 chars | SI |

**Modulo 2: Prompt Engineering Basico (3 lessons)**
| # | Titulo | Dur | Video | PDF | Markdown | AI Prompt |
|---|--------|-----|-------|-----|----------|-----------|
| 1 | Que es un Prompt | 15m | NO | NO | 747 chars | SI |
| 2 | Tecnicas de Prompt Engineering | 20m | NO | NO | 771 chars | SI |
| 3 | Errores Comunes y Como Evitarlos | 15m | NO | NO | 777 chars | SI |

**Modulo 3: ChatGPT: Dominio Completo (4 lessons)**
| # | Titulo | Dur | Video | PDF | Markdown | AI Prompt |
|---|--------|-----|-------|-----|----------|-----------|
| 1 | Introduccion a ChatGPT y sus versiones | 15m | NO | NO | 1048 chars | SI |
| 2 | Custom Instructions y Memoria | 12m | NO | NO | 1181 chars | SI |
| 3 | GPTs Personalizados: Crea tu propio asistente | 20m | NO | NO | 1149 chars | SI |
| 4 | Code Interpreter y Analisis de Datos | 18m | NO | NO | 1256 chars | SI |

**Modulo 4: Claude: El Asistente Inteligente (3 lessons)**
| # | Titulo | Dur | Video | PDF | Markdown | AI Prompt |
|---|--------|-----|-------|-----|----------|-----------|
| 1 | Que es Claude y por que es diferente | 15m | NO | NO | 1183 chars | SI |
| 2 | Projects y Knowledge Base en Claude | 15m | NO | NO | 1309 chars | SI |
| 3 | Claude para Programacion y Analisis | 20m | NO | NO | 1231 chars | SI |

**Modulo 5: Gemini: La IA de Google (3 lessons)**
| # | Titulo | Dur | Video | PDF | Markdown | AI Prompt |
|---|--------|-----|-------|-----|----------|-----------|
| 1 | Gemini: El ecosistema de Google | 15m | NO | NO | 1198 chars | SI |
| 2 | Gemini en Google Workspace | 18m | NO | NO | 1062 chars | SI |
| 3 | NotebookLM y AI Studio | 20m | NO | NO | 1243 chars | SI |

**Modulo 6: IA en tu Profesion (4 lessons)**
| # | Titulo | Dur | Video | PDF | Markdown | AI Prompt |
|---|--------|-----|-------|-----|----------|-----------|
| 1 | IA para Contadores y Finanzas | 18m | NO | NO | 1507 chars | SI |
| 2 | IA para Abogados y Profesionales Legales | 18m | NO | NO | 1654 chars | SI |
| 3 | IA para Medicos y Salud | 18m | NO | NO | 1453 chars | SI |
| 4 | IA para Marketing, Ventas y Gerencia | 20m | NO | NO | 1477 chars | SI |

**Modulo 7: Proyecto Final (3 lessons)**
| # | Titulo | Dur | Video | PDF | Markdown | AI Prompt |
|---|--------|-----|-------|-----|----------|-----------|
| 1 | Briefing del Proyecto Final | 15m | NO | NO | 1020 chars | SI |
| 2 | Desarrollo del Proyecto | 25m | NO | NO | 985 chars | SI |
| 3 | Entrega y Certificacion | 15m | NO | NO | 920 chars | SI |

### 2.3 Estandar -- SIN CONTENIDO
- **Program:** 765cd165 "Curso Estandar: IA Aplicada"
- **Semesters:** 1 ("Curso Estandar - 4 Semanas")
- **Courses:** 0 (tabla courses vacia para este program)
- **Modules:** 0
- **Lessons:** 0
- **Subjects en semesters:** Existe 1 subject (bdf16c69) pero sin sesiones relevantes

### 2.4 Completo -- SIN CONTENIDO
- **Program:** 259e324f "Curso Completo: Especialista IA"
- **Semesters:** 1 ("Curso Completo - 6 Semanas")
- **Courses:** 0 (tabla courses vacia para este program)
- **Modules:** 0
- **Lessons:** 0

---

## 3. PAGINAS Y CODIGO

### 3.1 Archivos

| Archivo | Existe | Funcion |
|---------|--------|---------|
| `/mi-curso/layout.tsx` | SI | Auth guard + SidebarWrapper |
| `/mi-curso/page.tsx` | SI | Hub principal -- muestra cursos del enrollment activo |
| `/courses/layout.tsx` | SI | Auth guard + SidebarWrapper |
| `/courses/page.tsx` | SI | Redirect a /carreras (legacy) |
| `/courses/[id]/page.tsx` | SI | Detalle de curso con ModuleAccordion |
| `/courses/[id]/lesson/[lessonId]/page.tsx` | SI | Pagina de leccion (video + markdown + AI chat) |
| `ModuleAccordion.tsx` | SI | Acordeon de modulos con lessons y progreso |

### 3.2 Flujo /mi-curso
1. Busca enrollment activo del usuario
2. Obtiene program del enrollment
3. Si el program tiene `courses` en tabla courses -> los muestra con modules/lessons
4. Si NO tiene courses -> convierte semesters->subjects a "courses" virtuales (para preuni/bootcamp)
5. Calcula progreso por course y total

### 3.3 Flujo /courses/[id]
1. Busca course por ID en tabla courses
2. Verifica enrollment del usuario en el program del course
3. Busca modules -> lessons -> progress
4. Renderiza con ModuleAccordion

### 3.4 Flujo /courses/[id]/lesson/[lessonId]
1. Client component (usa useState, useEffect)
2. Busca lesson, module, course
3. Renderiza: video (YouTube embed), PDF link, markdown (ReactMarkdown), AI prompt suggested
4. Chat panel lateral con ChatPanel
5. Boton "Marcar como completada" usa tabla `progress` (upsert)
6. Navegacion prev/next lesson
7. XP system (llama a /api/xp)

---

## 4. SIDEBAR (MENU_CURSOS_PRO)

| Link | Label | Destino | Funciona |
|------|-------|---------|----------|
| /dashboard | Dashboard | SI | SI |
| /mi-curso | Mi Curso | SI | SI (muestra cursos si hay enrollment) |
| https://itseia.ai/demos/ | Demos Interactivos | Externo | SI |
| /ai-lab | AI Lab | SI | SI |
| /biblioteca | Biblioteca | SI | SI |
| /payments | Pagos | SI | SI |
| /profile | Perfil | SI | SI |
| /certificates | Certificado | SI | SI |

**Todos los links del sidebar funcionan correctamente.**

---

## 5. PROBLEMAS ENCONTRADOS

### P1 -- CRITICO: Estandar y Completo no tienen NINGUN contenido
- **Que pasa:** 0 courses, 0 modules, 0 lessons para ambos programas
- **Impacto:** Si un usuario se inscribe en Estandar ($197) o Completo ($297), vera "El contenido se esta preparando"
- **Solucion:** Crear courses, modules y lessons para ambos programas

### P2 -- ALTO: 0 videos en las 25 lessons del Express
- **Que pasa:** Todas las lessons tienen video_url = null
- **Impacto:** La seccion de video no aparece en ninguna leccion
- **Solucion:** Grabar y subir videos para cada leccion, o embedear videos de YouTube

### P3 -- ALTO: 0 PDFs/recursos en las 25 lessons
- **Que pasa:** Todas las lessons tienen pdf_url = null
- **Impacto:** No hay material descargable
- **Solucion:** Crear PDFs de apoyo para cada leccion

### P4 -- MEDIO: Contenido markdown muy corto (687-1654 chars)
- **Que pasa:** El markdown promedio es ~1000 caracteres (~150-250 palabras)
- **Impacto:** Contenido teorico muy breve para un curso pago
- **Solucion:** Expandir cada leccion a 3000-5000+ caracteres con ejemplos, ejercicios, etc.

### P5 -- MEDIO: NO existe tabla lesson_progress
- **Que pasa:** El codigo usa tabla `progress` (NO `lesson_progress`)
- **Impacto:** Funciona correctamente con la tabla `progress` existente -- NO hay bug
- **Nota:** La tabla `progress` tiene columns: user_id, lesson_id, completed, completed_at

### P6 -- BAJO: /courses/page.tsx hace redirect a /carreras
- **Que pasa:** La ruta /courses redirige a /carreras (sistema legacy)
- **Impacto:** Si alguien navega a /courses directamente, no vera cursos pro
- **Nota:** El flujo correcto es /mi-curso -> /courses/[id] -> /courses/[id]/lesson/[lessonId]

### P7 -- BAJO: Express tiene 3 semesters por profesion pero no se usan
- **Dato:** Los semesters "IA para Contadores", "IA para Medicos", "IA para Abogados" existen pero el flujo va por courses->modules->lessons, no por semesters
- **Impacto:** Datos huerfanos, no afectan funcionamiento

---

## 6. QUE FALTA PARA ESTAR COMPLETO

### Prioridad 1 -- Express (ya tiene estructura)
- [ ] Agregar video_url a las 25 lessons
- [ ] Expandir contenido markdown de cada lesson (de ~1000 a 3000-5000 chars)
- [ ] Agregar PDFs de apoyo por modulo o por lesson
- [ ] Verificar que el flujo completo funciona end-to-end con un enrollment real

### Prioridad 2 -- Estandar ($197)
- [ ] Crear 1 course en tabla courses para el program Estandar
- [ ] Crear modules (8-12 segun plan de 4 semanas)
- [ ] Crear lessons (40-60 lecciones)
- [ ] Cargar contenido: video, markdown, PDFs, AI prompts

### Prioridad 3 -- Completo ($297)
- [ ] Crear 1 course en tabla courses para el program Completo
- [ ] Crear modules (12-18 segun plan de 6 semanas)
- [ ] Crear lessons (60-90 lecciones)
- [ ] Cargar contenido: video, markdown, PDFs, AI prompts

### Prioridad 4 -- UX / Funcionalidad
- [ ] Verificar que el quiz del itseia.ai/cursos/ dirige correctamente al programa segun resultado
- [ ] Verificar flujo de enrollment automatico post-pago
- [ ] Considerar agregar quizzes al final de cada modulo
- [ ] Considerar agregar certificado por completar el curso

---

## 7. METRICAS DE COMPLETITUD

### Express
| Componente | Estado | % |
|------------|--------|---|
| Program + enrollment | Funcional | 100% |
| Course (1) | Existe | 100% |
| Modules (7) | Completos | 100% |
| Lessons (25) estructura | Completas | 100% |
| Markdown contenido | Existe pero corto | 40% |
| AI prompts | 25/25 | 100% |
| Videos | 0/25 | 0% |
| PDFs | 0/25 | 0% |
| Quizzes | 0 | 0% |
| Progress tracking | Funcional (tabla progress) | 100% |
| **SUBTOTAL EXPRESS** | **Estructura completa, contenido parcial** | **~55%** |

### Estandar
| Componente | Estado | % |
|------------|--------|---|
| Program | Existe | 100% |
| Course/Modules/Lessons | NO EXISTEN | 0% |
| Contenido | NO EXISTE | 0% |
| **SUBTOTAL ESTANDAR** | **Solo el programa existe** | **~5%** |

### Completo
| Componente | Estado | % |
|------------|--------|---|
| Program | Existe | 100% |
| Course/Modules/Lessons | NO EXISTEN | 0% |
| Contenido | NO EXISTE | 0% |
| **SUBTOTAL COMPLETO** | **Solo el programa existe** | **~5%** |

### TOTAL MODULO 03
| Programa | % Completitud | Peso |
|----------|---------------|------|
| Express | ~55% | 33% |
| Estandar | ~5% | 33% |
| Completo | ~5% | 33% |
| **PROMEDIO PONDERADO** | | **~22%** |
