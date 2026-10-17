# AUDITORIA MODULO 03 -- CURSOS PROFESIONALES

**Fecha:** 2026-04-01 (v2 -- corrige hallazgos incorrectos de v1)
**Modulo:** Cursos Profesionales (program type: curso)
**3 programas:** Express ($97), Estandar ($197), Completo ($297)

---

## 1. RESUMEN EJECUTIVO

### La auditoria v1 estaba EQUIVOCADA en un punto critico

La auditoria anterior concluyo que Estandar y Completo estan "COMPLETAMENTE VACIOS". Esto es FALSO.

Los 3 programas tienen DOS caminos de contenido en Supabase:

| Camino | Express | Estandar | Completo |
|--------|---------|----------|----------|
| **courses -> modules -> lessons** | 1 curso, 7 modulos, 25 lessons | 0 | 0 |
| **semesters -> subjects -> sessions** | 3 semesters, 27 subjects, 27 sessions | 1 semester, 5 subjects, 40 sessions | 1 semester, 5 subjects, 45 sessions |

El codigo de `/mi-curso/page.tsx` (linea 72) tiene un FALLBACK: si el programa no tiene `courses`, convierte `semesters -> subjects` a "course cards" y muestra las `sessions`. Esto significa:

- **Express:** Muestra el camino courses (25 lessons con ~1000 chars markdown, 0 videos, 25 AI prompts)
- **Estandar:** Muestra 5 subject-cards con 8 sessions cada una (40 sessions con ~10,528 chars markdown, 40/40 videos YouTube)
- **Completo:** Muestra 5 subject-cards con 9 sessions cada una (45 sessions con ~11,277 chars markdown, 45/45 videos YouTube)

**Paradoja: Express (que "funciona") tiene el PEOR contenido. Estandar y Completo (que se reportaron como "vacios") tienen contenido 10x mas rico.**

---

## 2. ESTADO REAL POR PROGRAMA

### 2.1 EXPRESS ($97)

**Program ID:** `be7e6b1e-d8f9-4c97-9b29-bacb73925579`
**Slug:** `ia-profesionales-express`

**Camino activo (courses):**
| Componente | Cantidad | Contenido |
|------------|----------|-----------|
| Course | 1 ("Fundamentos de IA Generativa") | -- |
| Modules | 7 | -- |
| Lessons | 25 | Avg 1,050 chars markdown |
| Videos | 0/25 | CERO |
| PDFs | 0/25 | CERO |
| AI prompts | 25/25 | Funcional |
| Progress tracking | tabla `progress` | Funcional |

**Camino INACTIVO (semesters -- NO visible para usuarios Express):**
| Componente | Cantidad | Contenido |
|------------|----------|-----------|
| Semesters | 3 (Contadores, Medicos, Abogados) | -- |
| Subjects | 27 (9 per semester) | -- |
| Sessions | 27 | Avg 11,694 chars markdown + 13 unique YouTube videos |

**Problema Express:** El usuario ve el contenido debil (lessons) mientras existe contenido rico (sessions) que NO ve.

**Ruta del usuario Express:** `/mi-curso` -> card link a `/courses/906d7823` -> lesson page `/courses/906d7823/lesson/[lessonId]`

---

### 2.2 ESTANDAR ($197)

**Program ID:** `765cd165-6adc-413a-9a19-9c1219681a81`
**Slug:** `ia-aplicada-estandar`

**Camino activo (semesters -> subjects -> sessions):**

| Subject | Profesion | Sessions | Videos | Avg MD chars | Contenido correcto? |
|---------|-----------|----------|--------|-------------|---------------------|
| bdf16c69 | Contadores (Estandar) | 8 | 8/8 | ~9,649 | SI |
| 01a2f39a | Abogados (Estandar) | 8 | 8/8 | ~11,196 | SI |
| 3a310980 | Medicos (Estandar) | 8 | 8/8 | ~11,858 | SI |
| ef04483a | Gerentes (Estandar) | 8 | 8/8 | ~9,649 | **NO -- TIENE CONTENIDO DE CONTADORES** |
| b45e1f99 | Arquitectos (Estandar) | 8 | 8/8 | ~9,649 | **NO -- TIENE CONTENIDO DE CONTADORES** |

**TOTAL Estandar:** 40 sessions, 40/40 videos, avg 10,528 chars markdown

**BUG CRITICO:** Gerentes y Arquitectos tienen sessions con titulos y contenido de CONTADORES:
- "ChatGPT y Claude para Contadores" (deberia ser "ChatGPT y Claude para Gerentes")
- "Seguridad y Privacidad de Datos Financieros" (deberia ser contenido de gestion)
- etc.

**Ruta del usuario Estandar:** `/mi-curso` -> 5 subject cards -> link a `/carreras/ia-aplicada-estandar/materia/[subjectSlug]` -> session page `/carreras/ia-aplicada-estandar/materia/[subjectSlug]/sesion/[num]`

---

### 2.3 COMPLETO ($297)

**Program ID:** `259e324f-83c3-463e-bec4-c8b99cbecbd4`
**Slug:** `especialista-ia-completo`

**Camino activo (semesters -> subjects -> sessions):**

| Subject | Profesion | Sessions | Videos | Avg MD chars | Contenido correcto? |
|---------|-----------|----------|--------|-------------|---------------------|
| fda75990 | Contadores (Completo) | 9 | 9/9 | ~10,661 | SI |
| 82ed7436 | Abogados (Completo) | 9 | 9/9 | ~11,103 | SI |
| f73d4495 | Medicos (Completo) | 9 | 9/9 | ~12,294 | SI |
| 7f01fe2e | Gerentes (Completo) | 9 | 9/9 | ~10,661 | **NO -- TIENE CONTENIDO DE CONTADORES** |
| e9aa6dd7 | Arquitectos (Completo) | 9 | 9/9 | ~10,661 | **NO -- TIENE CONTENIDO DE CONTADORES** |

**TOTAL Completo:** 45 sessions, 45/45 videos, avg 11,277 chars markdown

**Diferencia vs Estandar:** Completo tiene 1 session extra por subject:
- Contadores: +Cierre Contable Asistido por IA
- Abogados: +Compliance: IA y la Ley en Ecuador
- Medicos: +Plan de Tratamiento Asistido por IA
- Gerentes: +Cierre Contable (MAL -- deberia ser de gestion)
- Arquitectos: +Cierre Contable (MAL -- deberia ser de arquitectura)

---

## 3. PROBLEMAS ENCONTRADOS (REVISADOS)

### P1 -- CRITICO: Gerentes y Arquitectos tienen contenido EQUIVOCADO

**Afecta:** Estandar (2 de 5 subjects) + Completo (2 de 5 subjects) = 34 sessions con contenido incorrecto
**Que pasa:** Las sessions de los subjects Gerentes y Arquitectos contienen contenido textual y de video de CONTADORES
**Ejemplo:** "IA Aplicada para Gerentes (Estandar)" muestra "ChatGPT y Claude para Contadores", "Deteccion de Anomalias y Fraude", etc.
**Impacto:** Un gerente o arquitecto que paga $197-$297 recibe contenido de contadores. Destruye credibilidad.
**Causa probable:** Al crear las sessions se copiaron las del perfil Contadores sin personalizar para Gerentes/Arquitectos.

**Solucion:** Crear sessions especificas para cada profesion:
- **Gerentes:** IA para Toma de Decisiones, Automatizacion de Reportes Ejecutivos, Analisis Competitivo con IA, Productividad Personal con IA, Comunicacion Ejecutiva con IA
- **Arquitectos:** IA Generativa en Diseno, Midjourney/DALL-E para Visualizacion, Automatizacion de Presupuestos, BIM + IA, Especificaciones Tecnicas con IA

### P2 -- ALTO: Express muestra contenido inferior al que existe

**Que pasa:** Express tiene 2 capas de contenido -- el usuario ve las lessons (1050 chars avg, 0 videos) pero existen sessions con contenido 10x mejor (11,694 chars avg, YouTube videos)
**Impacto:** El usuario Express recibe la peor experiencia aunque hay contenido rico disponible
**Solucion (opcion A):** Eliminar el course de Express y dejar que use el fallback semesters -> subjects -> sessions (como Estandar/Completo)
**Solucion (opcion B):** Enriquecer las 25 lessons del Express con el contenido de las sessions + videos
**Recomendacion:** Opcion A es mas rapida. Opcion B mantiene la estructura courses pero requiere mas trabajo.

### P3 -- MEDIO: Express semesters NO coinciden con tiers del curso

**Que pasa:** Los semesters de Express se llaman "Contadores", "Medicos", "Abogados" (por profesion), pero el curso Express es para TODAS las profesiones con contenido generico
**Impacto:** Si se activa el fallback (opcion A de P2), el usuario Express veria 3 "cursos" por profesion en vez de 1 curso generico
**Solucion:** Si se elige opcion A, hay que reestructurar los semesters/subjects de Express para que sean genericos (Modulo 1-7) en vez de por profesion

### P4 -- MEDIO: 0 AI Lab context/prompts en sessions de Estandar/Completo

**Que pasa:** Las 85 sessions de Estandar+Completo tienen `ai_lab_context = null` y `ai_lab_suggested_prompt = null`
**Impacto:** El panel AI Lab en la pagina de sesion no tiene prompts sugeridos
**Contraste:** Las 25 lessons de Express SI tienen `ai_prompt_suggested` (25/25)
**Solucion:** Agregar ai_lab_context y ai_lab_suggested_prompt a cada session

### P5 -- BAJO: 0 PDFs en todo el modulo

**Que pasa:** 0/25 lessons y 0/85 sessions tienen PDF
**Impacto:** No hay material descargable en ningun programa
**Solucion:** Generar PDFs resumen por modulo/session

### P6 -- INFO: El flujo de routing funciona correctamente

Los 3 programas tienen rutas funcionales:
- Express: `/mi-curso` -> `/courses/[id]` -> `/courses/[id]/lesson/[lessonId]`
- Estandar: `/mi-curso` -> `/carreras/ia-aplicada-estandar/materia/[slug]` -> `sesion/[num]`
- Completo: `/mi-curso` -> `/carreras/especialista-ia-completo/materia/[slug]` -> `sesion/[num]`

La pagina de subject (`/carreras/[slug]/materia/[subjectSlug]/page.tsx` linea 51) acepta CUALQUIER tipo de programa, no solo carreras.

---

## 4. CONTENIDO DETALLADO

### 4.1 Express -- Lessons (camino courses, activo)

**Course: Fundamentos de IA Generativa (906d7823)**

| Modulo | # Lessons | Avg MD | Videos | AI Prompts |
|--------|-----------|--------|--------|------------|
| 1. Que es la IA Generativa | 5 | 777 chars | 0 | 5 |
| 2. Prompt Engineering Basico | 3 | 765 chars | 0 | 3 |
| 3. ChatGPT: Dominio Completo | 4 | 1,159 chars | 0 | 4 |
| 4. Claude: El Asistente Inteligente | 3 | 1,241 chars | 0 | 3 |
| 5. Gemini: La IA de Google | 3 | 1,168 chars | 0 | 3 |
| 6. IA en tu Profesion | 4 | 1,523 chars | 0 | 4 |
| 7. Proyecto Final | 3 | 975 chars | 0 | 3 |
| **TOTAL** | **25** | **1,050** | **0** | **25** |

### 4.2 Express -- Sessions (camino semesters, INACTIVO/orphaned)

| Semester | Subjects | Sessions | Avg MD | Videos |
|----------|----------|----------|--------|--------|
| Contadores | 9 | 9 | ~11,500 | 9/9 |
| Medicos | 9 | 9 | ~12,000 | 9/9 |
| Abogados | 9 | 9 | ~11,500 | 9/9 |
| **TOTAL** | **27** | **27** | **11,694** | **27/27** |

### 4.3 Estandar -- Sessions (activo via semesters)

| Subject | Sessions | Avg MD | Videos | Contenido correcto |
|---------|----------|--------|--------|---------------------|
| Contadores | 8 (T01-T04 + F01-F04) | ~9,649 | 8/8 | SI |
| Abogados | 8 (T01-T04 + J01-J04) | ~11,196 | 8/8 | SI |
| Medicos | 8 (T01-T04 + S01-S04) | ~11,858 | 8/8 | SI |
| Gerentes | 8 | ~9,649 | 8/8 | NO (contadores) |
| Arquitectos | 8 | ~9,649 | 8/8 | NO (contadores) |
| **TOTAL** | **40** | **10,528** | **40/40** | **3/5 correctos** |

### 4.4 Completo -- Sessions (activo via semesters)

| Subject | Sessions | Avg MD | Videos | Contenido correcto |
|---------|----------|--------|--------|---------------------|
| Contadores | 9 (T01-T04 + F01-F05) | ~10,661 | 9/9 | SI |
| Abogados | 9 (T01-T04 + J01-J05) | ~11,103 | 9/9 | SI |
| Medicos | 9 (T01-T04 + S01-S05) | ~12,294 | 9/9 | SI |
| Gerentes | 9 | ~10,661 | 9/9 | NO (contadores) |
| Arquitectos | 9 | ~10,661 | 9/9 | NO (contadores) |
| **TOTAL** | **45** | **11,277** | **45/45** | **3/5 correctos** |

---

## 5. METRICAS DE COMPLETITUD (REVISADAS)

### Express
| Componente | Estado | % |
|------------|--------|---|
| Program + enrollment | Funcional | 100% |
| Course (1) | Existe | 100% |
| Modules (7) | Completos | 100% |
| Lessons (25) estructura | Completas | 100% |
| Markdown (lessons) | Existe pero corto (~1050 chars) | 30% |
| AI prompts (lessons) | 25/25 | 100% |
| Videos (lessons) | 0/25 | 0% |
| PDFs | 0 | 0% |
| Contenido rico en semesters (orphaned) | 27 sessions, 11,694 chars avg, 27 videos | NO SE USA |
| Progress tracking | tabla `progress` funcional | 100% |
| **SUBTOTAL EXPRESS** | **Estructura completa, contenido debil, contenido rico orphaned** | **~45%** |

### Estandar
| Componente | Estado | % |
|------------|--------|---|
| Program | Existe | 100% |
| Semesters -> Subjects -> Sessions | 1 semester, 5 subjects, 40 sessions | 100% |
| Markdown (sessions) | 40/40, avg 10,528 chars | 90% |
| Videos YouTube | 40/40 | 100% |
| AI Lab prompts | 0/40 | 0% |
| PDFs | 0/40 | 0% |
| Contenido correcto por profesion | 3/5 subjects (Gerentes y Arquitectos MAL) | 60% |
| Progress tracking | tabla `session_progress` | 100% |
| **SUBTOTAL ESTANDAR** | **Estructura funcional, 60% contenido correcto** | **~70%** |

### Completo
| Componente | Estado | % |
|------------|--------|---|
| Program | Existe | 100% |
| Semesters -> Subjects -> Sessions | 1 semester, 5 subjects, 45 sessions | 100% |
| Markdown (sessions) | 45/45, avg 11,277 chars | 90% |
| Videos YouTube | 45/45 | 100% |
| AI Lab prompts | 0/45 | 0% |
| PDFs | 0/45 | 0% |
| Contenido correcto por profesion | 3/5 subjects (Gerentes y Arquitectos MAL) | 60% |
| Session extra vs Estandar | +1 session/subject (avanzado) | 100% |
| Progress tracking | tabla `session_progress` | 100% |
| **SUBTOTAL COMPLETO** | **Estructura funcional, 60% contenido correcto** | **~72%** |

### TOTAL MODULO 03 (REVISADO)
| Programa | % Completitud | Peso | Antes (v1) |
|----------|---------------|------|------------|
| Express | ~45% | 33% | ~55% (baja porque se descubrio contenido orphaned) |
| Estandar | ~70% | 33% | ~5% (sube drasticamente -- tenia contenido) |
| Completo | ~72% | 33% | ~5% (sube drasticamente -- tenia contenido) |
| **PROMEDIO PONDERADO** | | **~62%** | ~22% |

---

## 6. PLAN DE ACCION (PRIORIZADO)

### Prioridad 1 -- CRITICA: Corregir contenido de Gerentes y Arquitectos

**Afecta:** 34 sessions (Estandar: 16 + Completo: 18)
**Accion:** Crear sessions con contenido especifico para cada profesion

Para Gerentes (basado en spec CLAUDE.md):
- G-01: IA para Toma de Decisiones Estrategicas
- G-02: Automatizacion de Reportes Ejecutivos
- G-03: Analisis Competitivo y de Mercado con IA
- G-04: Productividad Personal con IA
- G-05: Comunicacion Ejecutiva con IA (solo Completo)

Para Arquitectos (basado en spec CLAUDE.md):
- A-01: IA Generativa en Diseno Arquitectonico
- A-02: Midjourney y DALL-E para Visualizacion
- A-03: Automatizacion de Presupuestos y Planillas
- A-04: BIM Asistido por IA
- A-05: Especificaciones Tecnicas con IA (solo Completo)

### Prioridad 2 -- ALTA: Enriquecer Express

**Opcion recomendada:** Enriquecer las 25 lessons existentes con contenido de las sessions orphaned
- Expandir markdown de ~1050 a ~3000+ chars
- Agregar video_url (tomar de sessions existentes los 13 YouTube URLs unicos)
- Mantener AI prompts existentes

### Prioridad 3 -- MEDIA: Agregar AI Lab prompts a sessions

**Afecta:** 85 sessions de Estandar + Completo
**Accion:** Agregar ai_lab_context y ai_lab_suggested_prompt a cada session

### Prioridad 4 -- BAJA: PDFs y material descargable

**Afecta:** Todo el modulo
**Accion:** Generar PDFs resumen para cada modulo/session

---

## 7. IDS Y SLUGS DE REFERENCIA

### Programs
| Tier | ID | Slug |
|------|-----|------|
| Express | be7e6b1e-d8f9-4c97-9b29-bacb73925579 | ia-profesionales-express |
| Estandar | 765cd165-6adc-413a-9a19-9c1219681a81 | ia-aplicada-estandar |
| Completo | 259e324f-83c3-463e-bec4-c8b99cbecbd4 | especialista-ia-completo |

### Express Course
| ID | Name |
|----|------|
| 906d7823-b98b-4308-ae0c-580c814be9bf | Fundamentos de IA Generativa |

### Estandar Subjects (Semester: 0c1c710e)
| ID | Name | Slug | Correcto? |
|----|------|------|-----------|
| bdf16c69 | IA Aplicada para Contadores (Estandar) | ia-aplicada-estandar-contadores | SI |
| 01a2f39a | IA Aplicada para Abogados (Estandar) | ia-aplicada-estandar-abogados | SI |
| 3a310980 | IA Aplicada para Medicos (Estandar) | ia-aplicada-estandar-medicos | SI |
| ef04483a | IA Aplicada para Gerentes (Estandar) | ia-aplicada-estandar-gerentes | NO (contadores) |
| b45e1f99 | IA Aplicada para Arquitectos (Estandar) | ia-aplicada-estandar-arquitectos | NO (contadores) |

### Completo Subjects (Semester: 3521ae57)
| ID | Name | Slug | Correcto? |
|----|------|------|-----------|
| fda75990 | IA Aplicada para Contadores (Completo) | especialista-ia-completo-contadores | SI |
| 82ed7436 | IA Aplicada para Abogados (Completo) | especialista-ia-completo-abogados | SI |
| f73d4495 | IA Aplicada para Medicos (Completo) | especialista-ia-completo-medicos | SI |
| 7f01fe2e | IA Aplicada para Gerentes (Completo) | especialista-ia-completo-gerentes | NO (contadores) |
| e9aa6dd7 | IA Aplicada para Arquitectos (Completo) | especialista-ia-completo-arquitectos | NO (contadores) |
