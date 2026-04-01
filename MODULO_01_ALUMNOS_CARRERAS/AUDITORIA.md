# AUDITORIA MODULO 01 — ALUMNOS CARRERAS
**Fecha:** 31 marzo 2026
**Auditor:** Claude Opus 4.6
**Scope:** Supabase data + codigo fuente /app/carreras/

---

## RESUMEN EJECUTIVO

| Metrica | Valor |
|---------|-------|
| Carreras activas | 3 (IA, Ciencia de Datos, Big Data) |
| Semestres totales | 15 (5 por carrera) |
| Materias (subjects) | 87 (29 por carrera) |
| Sesiones activas (3 carreras) | 1,712 |
| Sesiones totales plataforma | 1,942 (incluye preuni/bootcamp/curso) |
| Quizzes activos (carreras) | 48 (16 por carrera) |
| Assignments activos (carreras) | 24 (IA: 16, CD: 4, BD: 4) |
| Session Resources | 68 (total plataforma) |
| Ejercicios recolectados (carpeta) | 366 archivos (352 carreras + 5 cursos-pro + 9 videos) |
| Componentes sesion | 12/12 existen |
| Sidebar links MENU_ALUMNO | 12/12 con pagina |

---

## 1. SESIONES POR CARRERA Y PERIODO

### Inteligencia Artificial (464 sesiones)
| Periodo | Sesiones | Video | Teoria | Slides | AI Context | AI Prompt |
|---------|----------|-------|--------|--------|------------|-----------|
| P1 - Fundamentos | 96 | 96 (100%) | 96 | 0 | 96 | 96 |
| P2 - Programacion | 96 | 96 (100%) | 96 | 0 | 96 | 96 |
| P3 - ML y Datos | 96 | 80 (83%) | 96 | 0 | 80 | 80 |
| P4 - Deep Learning | 96 | 64 (66%) | 96 | 0 | 64 | 64 |
| P5 - IA Avanzada | 80 | 48 (60%) | 80 | 0 | 48 | 48 |
| **TOTAL** | **464** | **384 (82%)** | **464 (100%)** | **1 (<1%)** | **384 (82%)** | **384 (82%)** |

### Ciencia de Datos (608 sesiones)
| Periodo | Sesiones | Video | Teoria | Slides | AI Context | AI Prompt |
|---------|----------|-------|--------|--------|------------|-----------|
| P1 - Fundamentos | 96 | 96 (100%) | 96 | 0 | 96 | 96 |
| P2 - Prog+Estadistica | 96 | 96 (100%) | 96 | 0 | 96 | 96 |
| P3 - ML | 96 | 64 (66%) | 96 | 0 | 64 | 64 |
| P4 - Deep Learning | 160 | 32 (20%) | 160 | 0 | 32 | 32 |
| P5 - Avanzado | 160 | 48 (30%) | 160 | 0 | 48 | 48 |
| **TOTAL** | **608** | **336 (55%)** | **608 (100%)** | **1 (<1%)** | **372 (61%)** | **372 (61%)** |

### Big Data (640 sesiones)
| Periodo | Sesiones | Video | Teoria | Slides | AI Context | AI Prompt |
|---------|----------|-------|--------|--------|------------|-----------|
| P1 - Fundamentos | 96 | 96 (100%) | 96 | 0 | 96 | 96 |
| P2 - Prog+Estadistica | 96 | 96 (100%) | 96 | 0 | 96 | 96 |
| P3 - Ecosistema Big Data | 96 | 64 (66%) | 96 | 0 | 64 | 64 |
| P4 - Analitica y Cloud | 192 | 0 (0%) | 192 | 0 | 0 | 0 |
| P5 - IA Negocios | 160 | 32 (20%) | 160 | 0 | 32 | 32 |
| **TOTAL** | **640** | **288 (45%)** | **640 (100%)** | **0 (0%)** | **372 (58%)** | **372 (58%)** |

---

## 2. VIDEOS DUPLICADOS

| Metrica | Valor |
|---------|-------|
| Sesiones con video (total) | 1,214 |
| URLs unicas | 475 |
| URLs repetidas (>1 uso) | 313 URLs |
| Sesiones afectadas por duplicacion | 1,052 (86% de sesiones con video) |

**Top URLs mas repetidas:**
- 14x: youtube.com/watch?v=KytW151dpqU
- 12x: youtube.com/watch?v=pD46iUTHUZI
- 12x: youtube.com/watch?v=XMxSmkblzkA
- 11x: youtube.com/watch?v=jC4v5AS4RIM
- 10x: youtube.com/watch?v=G6OPbpGE8Kk (y 2 mas con 10x)
- 9x: 3 URLs adicionales
- 8x: multiples URLs

**Conclusion:** Solo ~162 sesiones (de 1,214) tienen un video genuinamente unico. El 86% reutiliza el mismo video en multiples sesiones.

---

## 3. QUIZZES Y ASSIGNMENTS

### Quizzes (254 activos total)
| Carrera | Quizzes |
|---------|---------|
| IA | 16 |
| Ciencia de Datos | 16 |
| Big Data | 16 |
| Otros (preuni/bootcamp/curso) | 206 |

**Cobertura carreras:** 48 quizzes / 1,712 sesiones = **2.8%** de sesiones tienen quiz.

### Assignments (24 activos total)
| Carrera | Assignments |
|---------|-------------|
| IA | 16 |
| Ciencia de Datos | 4 |
| Big Data | 4 |

**Cobertura carreras:** 24 assignments / 1,712 sesiones = **1.4%** de sesiones tienen ejercicio.

### Ejercicios Recolectados vs En Plataforma
| Metrica | Valor |
|---------|-------|
| Archivos en recoleccion/carreras/ | 352 |
| Assignments en BD (carreras) | 24 |
| **Gap:** ejercicios sin subir | **~328** |

---

## 4. SLIDES

| Carrera | Con slides |
|---------|-----------|
| IA | 1 sesion |
| Ciencia de Datos | 1 sesion |
| Big Data | 0 sesiones |

**Conclusion:** Slides estan practicamente vacias. Solo 2 sesiones de 1,712 tienen slides_url.

---

## 5. SIDEBAR MENU_ALUMNO

Todas las 12 rutas del menu de alumno tienen pagina creada:

| Link | Ruta | Estado |
|------|------|--------|
| Dashboard | /dashboard | OK |
| Mi Carrera | /carreras | OK |
| Calendario | /calendario | OK |
| Clases en Vivo | /cohorte | OK |
| Foros | /foros | OK |
| AI Lab | /ai-lab | OK |
| Biblioteca | /biblioteca | OK |
| Flashcards | /flashcards | OK |
| Pagos | /payments | OK |
| Perfil | /profile | OK |
| Certificados | /certificates | OK |
| Portafolio | /portfolio | OK |

**Menus adicionales implementados:** MENU_PREUNI, MENU_BOOTCAMP, MENU_CURSOS_PRO, MENU_DOCENTE, MENU_ADMIN, MENU_FINANZAS, MENU_B2B + seccion inyectable de CERTIFICACIONES.

**Deteccion de menu:** Basada en role + program_types del enrollment activo. Prioridad: carrera > bootcamp > preuni > curso.

---

## 6. SESION DE EJEMPLO — Tabs de Contenido

La pagina de sesion (`/carreras/[slug]/materia/[subjectSlug]/sesion/[num]`) es un componente `"use client"` que construye 8 tabs:

| Tab | Componente | Disponibilidad | Estado Codigo |
|-----|-----------|----------------|---------------|
| Video | VideoPlayer.tsx | Si session.video_url existe | OK - YouTube embed, marca "visto" a 30s |
| Presentacion | SlideViewer.tsx | Si session.slides_url existe | OK - Soporta Google Slides y PDF |
| Teoria | TheoryContent.tsx | Si session.theory_markdown existe | OK - Renderiza markdown |
| Quiz | QuizEngine.tsx | Si hay quiz para la sesion | OK - Shuffle servidor, timer, integridad |
| Ejercicio | AssignmentPanel.tsx | Si hay assignment para la sesion | OK - Drag&drop upload, calificacion |
| AI Lab | AILabPanel.tsx | SIEMPRE disponible | OK - 4 sub-tabs: Chat, Comparar, Playground, Flashcards |
| Recursos | ResourceList.tsx + LibrarySuggest.tsx | SIEMPRE disponible | OK - Lista recursos + sugerencias biblioteca |
| Clase en Vivo | LiveClassPanel.tsx | SIEMPRE disponible | OK - Daily.co integration |

**Progreso:** API `/api/sessions/[id]/progress` hace upsert de 7 campos (video_watched, slides_viewed, theory_read, quiz_passed, assignment_submitted, ai_lab_used). Marca `completed=true` cuando TODOS los 6 boolean son true.

**Navegacion:** SessionNav.tsx con botones prev/next entre sesiones.

**Tabs mantienen estado:** Patron `display:none` para tabs visitadas (evita recarga de iframes).

---

## LO QUE FUNCIONA

- **Estructura academica completa:** 3 carreras x 5 periodos x ~6 materias = 87 subjects con 1,712 sesiones
- **Teoria al 100%:** Las 1,712 sesiones tienen theory_markdown
- **Videos P1-P2 al 100%:** Periodos 1 y 2 de las 3 carreras tienen video en todas las sesiones
- **12 componentes de sesion existen** y compilan (VideoPlayer, SlideViewer, TheoryContent, QuizEngine, AssignmentPanel, AILabPanel, ResourceList, LiveClassPanel, SessionTabs, SessionNav, SessionAccordion, LibrarySuggest)
- **QuizEngine v2** con integridad: shuffle de servidor, timer, deteccion de cambio de pestana, registro de intentos
- **AssignmentPanel** con drag&drop, validacion de tipo/tamano, estado de calificacion
- **AI Lab v2** con 4 sub-tabs (Chat, Comparar, Playground, Flashcards) + links a herramientas externas
- **Sidebar dinamico** adapta menu segun role (7 tipos) + enrollment activo
- **12/12 rutas del MENU_ALUMNO** tienen pagina
- **Progress tracking** funcional con API POST + upsert + auto-complete
- **Session page** optimizada: 6 etapas con Promise.all (no waterfall)
- **Tabs no recargan iframes** al cambiar entre ellas (patron display:none)

---

## LO QUE FALTA

- **728 sesiones sin video** en carreras (42% del total): BD P4 tiene 0 videos de 192 sesiones, CD P4 solo 20%
- **Slides practicamente vacias:** Solo 2 de 1,712 sesiones tienen slides_url (<0.1%)
- **AI context/prompt incompleto:** IA al 82%, CD al 61%, BD al 58% — periodos avanzados estan vacios
- **328 ejercicios sin subir:** 352 archivos en recoleccion/ pero solo 24 assignments en BD
- **Quizzes escasos en carreras:** 48 quizzes para 1,712 sesiones (2.8%). Los cursos-pro tienen 206 quizzes (mucho mejor cobertura)
- **Assignments desiguales:** IA tiene 16, CD y BD solo 4 cada una
- **Session Resources escasos:** 68 total para toda la plataforma
- **Completion logic demasiado estricta:** Requiere los 6 campos true (video + slides + theory + quiz + assignment + ai_lab). Si una sesion NO tiene quiz ni assignment ni slides, el alumno NUNCA puede marcarla como completada

---

## LO QUE ESTA ROTO

- **Completion imposible en 97%+ de sesiones:** La API de progreso requiere `video_watched AND slides_viewed AND theory_read AND quiz_passed AND assignment_submitted AND ai_lab_used` = ALL true. Pero solo 48 sesiones tienen quiz y 24 tienen assignment. Las ~1,664 sesiones restantes NUNCA pueden llegar a `completed=true` porque quiz_passed y assignment_submitted nunca se activan.
- **Videos masivamente duplicados:** 313 URLs repetidas afectan 1,052 sesiones. El alumno ve el MISMO video en hasta 14 sesiones diferentes. Esto destruye la credibilidad del contenido.
- **Slides tab visible pero inutil:** El tab "Presentacion" se muestra solo si slides_url existe, pero solo 2 sesiones la tienen. Esto esta "bien" por diseno (se oculta), pero el contenido simplemente no existe.

---

## PRIORIDAD DE FIXES

### P0 — CRITICO (bloquea la experiencia del alumno)
1. **Arreglar logica de completion:** Si una sesion no tiene quiz, slides o assignment, esos campos deben auto-marcarse como `true` o la condicion de completion debe ser condicional. Sin esto, el progreso del alumno SIEMPRE se queda en <100%.

### P1 — ALTO (contenido incompleto visible para el alumno)
2. **Subir los 328 ejercicios de recoleccion/ a la BD** como assignments — hay 352 archivos listos, solo 24 estan en Supabase
3. **Eliminar videos duplicados:** 313 URLs se reusan en 1,052 sesiones. Priorizar buscar/grabar videos unicos para periodos 3-5
4. **Completar AI context/prompt** para periodos avanzados (P4-P5 de CD y BD estan en 0-30%)
5. **Agregar quizzes a carreras:** 48 quizzes para 1,712 sesiones (2.8%). Minimo 1 quiz por materia = 87 quizzes

### P2 — MEDIO (mejora calidad)
6. **Agregar slides** (Google Slides o PDF) — actualmente casi vacias
7. **Balancear assignments:** IA tiene 16, CD y BD solo 4 — deberian tener cobertura similar
8. **Agregar session_resources** — 68 para toda la plataforma es insuficiente

### P3 — BAJO (polish)
9. **Sesiones desiguales por periodo:** P4 de CD tiene 160 sesiones vs P1 tiene 96 — revisar si algunas sesiones estan demas
10. **BD P4 tiene 192 sesiones sin ningun video** — es el peor caso, priorizar contenido para este periodo

---

## ARCHIVOS CLAVE AUDITADOS

```
apps/web/src/app/carreras/page.tsx                           — Lista 3 carreras (type=carrera)
apps/web/src/app/carreras/layout.tsx                         — Auth check: sidebar o public header
apps/web/src/app/carreras/[slug]/page.tsx                    — Detalle carrera: semestres + materias + progreso
apps/web/src/app/carreras/[slug]/materia/[subjectSlug]/page.tsx — Detalle materia: sesiones + foro
apps/web/src/app/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx — Sesion: 8 tabs
apps/web/src/components/session/SessionTabs.tsx              — Tab bar + display:none pattern
apps/web/src/components/session/VideoPlayer.tsx              — YouTube embed + 30s auto-mark
apps/web/src/components/session/QuizEngine.tsx               — v2 con integridad
apps/web/src/components/session/AssignmentPanel.tsx          — Upload + calificacion
apps/web/src/components/session/AILabPanel.tsx               — 4 sub-tabs
apps/web/src/components/session/LiveClassPanel.tsx           — Daily.co
apps/web/src/components/layout/Sidebar.tsx                   — 7 menus dinamicos
apps/web/src/app/api/sessions/[id]/progress/route.ts        — Upsert progreso
apps/web/recoleccion/                                        — 366 archivos (ejercicios sin subir)
```
