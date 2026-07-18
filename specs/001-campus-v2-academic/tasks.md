# Tasks: Campus Virtual V2 — Estructura Académica Real

**Input**: Design documents from `/specs/001-campus-v2-academic/`
**Prerequisites**: plan.md (complete), spec.md (complete)

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Schema V3 Migration)

**Purpose**: Crear la estructura de base de datos académica real

- [ ] T001 [US1] Escribir `supabase_schema_v3.sql` con tablas: semesters, subjects, sessions, quizzes, quiz_questions, quiz_attempts, assignments, submissions, session_progress, session_resources
- [ ] T002 [US1] Agregar RLS policies para las 10 tablas nuevas (estudiante ve lo suyo, docente ve su materia, admin ve todo)
- [ ] T003 [US1] Alterar tabla programs: agregar career_code TEXT, total_semesters INTEGER
- [ ] T004 [P] [US1] Crear Supabase Storage buckets: submissions, slides, resources
- [ ] T005 [US1] Actualizar `src/types/database.ts` con interfaces: Semester, Subject, Session, Quiz, QuizQuestion, QuizAttempt, Assignment, Submission, SessionProgress, SessionResource
- [ ] T006 [US1] Escribir seed SQL con 3 carreras × 5 períodos × 87 asignaturas exactas del CES (nombres, horas docencia/práctica/autónomo del PDF oficial)
- [ ] T007 [US1] CEO ejecuta SQL V3 + seed en Supabase (instrucciones paso a paso)

**Checkpoint**: Base de datos tiene estructura académica real. Verificar con query: SELECT count(*) FROM subjects → debe dar 87.

---

## Phase 2: Foundational (Academic Navigation)

**Purpose**: Navegación Carrera → Período → Materia → Sesión funcional

⚠️ CRITICAL: No se puede implementar contenido sin navegación

- [ ] T008 [US1] Crear `src/app/carreras/page.tsx` — Vista pública de las 3 carreras con cards
- [ ] T009 [US1] Crear `src/app/carreras/[slug]/page.tsx` — Vista de carrera con 5 períodos y materias
- [ ] T010 [US1] Crear `src/app/carreras/[slug]/materia/[subjectSlug]/page.tsx` — Vista de materia con lista de sesiones y progreso
- [ ] T011 [US1] Crear `src/app/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx` — CORE: página de sesión con 7 tabs
- [ ] T012 [P] [US1] Crear `src/components/academic/CareerOverview.tsx` — Card carrera con períodos y progreso
- [ ] T013 [P] [US1] Crear `src/components/academic/SemesterCard.tsx` — Card período con materias
- [ ] T014 [P] [US1] Crear `src/components/academic/SubjectCard.tsx` — Card materia con progreso y herramientas
- [ ] T015 [P] [US1] Crear `src/components/academic/Breadcrumb.tsx` — Navegación posicional académica
- [ ] T016 [US1] Actualizar `src/app/dashboard/page.tsx` — Agregar sección de progreso de carrera si el estudiante está inscrito en carrera
- [ ] T017 [US1] Actualizar `src/components/layout/Sidebar.tsx` — Agregar "Mi Carrera" link para estudiantes de carrera
- [ ] T018 [US3] Crear `src/app/admin/carreras/page.tsx` — CRUD carreras en admin panel
- [ ] T019 [US3] Crear `src/app/admin/materias/page.tsx` — CRUD materias con filtro por carrera/período

**Checkpoint**: Estudiante puede navegar desde dashboard hasta sesión vacía. Admin puede ver/editar estructura académica. Verificar: 87 materias visibles en navegación.

---

## Phase 3: User Story 1 — Estudiante estudia sesión completa (Priority: P1) 🎯 MVP

**Goal**: Un estudiante puede ver los 7 tipos de contenido en una sesión y marcar progreso

**Independent Test**: Navegar como estudiante a una sesión y verificar que se muestran los 7 tabs con contenido

### Session Components

- [ ] T020 [P] [US1] Crear `src/components/session/VideoPlayer.tsx` — YouTube embed responsive, tracking de tiempo visto, posts a session_progress.video_watched
- [ ] T021 [P] [US1] Crear `src/components/session/SlideViewer.tsx` — PDF embebido con iframe, marca slides_viewed en progreso
- [ ] T022 [P] [US1] Crear `src/components/session/TheoryContent.tsx` — ReactMarkdown con rehype-highlight para syntax highlighting, marca theory_read
- [ ] T023 [US1] Crear `src/components/session/QuizEngine.tsx` — Motor de quiz: muestra preguntas, selección de opciones, submit, auto-grade contra respuestas correctas, muestra explicaciones, retry si no aprueba, guarda en quiz_attempts
- [ ] T024 [P] [US1] Crear `src/components/session/AssignmentPanel.tsx` — Muestra instrucciones markdown, file upload a Supabase Storage, muestra estado de entrega y calificación si existe
- [ ] T025 [P] [US1] Crear `src/components/session/AILabPanel.tsx` — Wrapper de ChatPanel existente, auto-inyecta contexto de la sesión (materia + tema + contenido teórico)
- [ ] T026 [P] [US1] Crear `src/components/session/ResourceList.tsx` — Lista de recursos con icono por tipo (PDF, link, video, github, dataset, tool)
- [ ] T027 [US1] Crear `src/components/session/SessionTabs.tsx` — Tab navigation para los 7 tipos de contenido, muestra badge de completado por tab
- [ ] T028 [US1] Crear `src/components/session/SessionNav.tsx` — Prev/Next sesión con indicadores de completado, link a materia

### API Routes

- [ ] T029 [US1] Crear `src/app/api/sessions/[id]/progress/route.ts` — POST: actualiza session_progress (video_watched, slides_viewed, theory_read, quiz_passed, assignment_submitted, ai_lab_used, completed)
- [ ] T030 [US1] Crear `src/app/api/quiz/[id]/attempt/route.ts` — POST: recibe respuestas, auto-grade contra quiz_questions, calcula score/percentage, guarda en quiz_attempts, retorna resultado con explicaciones
- [ ] T031 [US1] Crear `src/app/api/assignments/[id]/submit/route.ts` — POST: recibe file, sube a Supabase Storage, crea registro en submissions

**Checkpoint**: Estudiante puede ver sesión completa con 7 tabs. Quiz auto-califica. Progreso se registra.

---

## Phase 4: User Story 2 — Docente gestiona contenido (Priority: P2)

**Goal**: Docente puede crear/editar contenido de sesiones y calificar entregas

**Independent Test**: Docente agrega video + teoría + quiz a una sesión, estudiante lo ve

### Teacher Panel

- [ ] T032 [US2] Crear `src/app/teacher/layout.tsx` — Layout docente con sidebar propio (blanco, como admin)
- [ ] T033 [US2] Crear `src/app/teacher/page.tsx` — Dashboard: materias asignadas, entregas pendientes, progreso general
- [ ] T034 [US2] Crear `src/app/teacher/materias/[id]/page.tsx` — Vista materia: lista de sesiones con indicador de contenido por tipo (verde=tiene, gris=falta)
- [ ] T035 [US2] Crear `src/app/teacher/materias/[id]/sesion/[num]/edit/page.tsx` — CORE: Editor de sesión con formularios para cada tipo de contenido
- [ ] T036 [P] [US2] Crear `src/components/teacher/ContentEditor.tsx` — Form: video URL input, PDF upload, markdown editor con preview side-by-side
- [ ] T037 [US2] Crear `src/components/teacher/QuizBuilder.tsx` — CRUD preguntas: agregar/editar/eliminar preguntas, opciones, marcar correcta, escribir explicación, preview del quiz
- [ ] T038 [P] [US2] Crear `src/components/teacher/SubmissionsTable.tsx` — Tabla entregas por materia: estudiante, archivo, fecha, estado. Inline: nota + textarea feedback + botón calificar
- [ ] T039 [P] [US2] Crear `src/components/teacher/StudentProgress.tsx` — Tabla: estudiantes × sesiones, cada celda muestra completado/no, filtros por período

### API Routes

- [ ] T040 [US2] Crear `src/app/api/assignments/[id]/grade/route.ts` — POST: docente envía nota + feedback, actualiza submission, notifica progreso
- [ ] T041 [US2] Actualizar `src/middleware.ts` — Agregar /teacher a rutas protegidas con verificación de role "docente"

**Checkpoint**: Docente puede CRUD contenido de sesión completo. Puede calificar entregas. Puede ver progreso.

---

## Phase 5: User Story 3 — Admin gestiona estructura y operación (Priority: P2)

**Goal**: Admin tiene visibilidad y control total de la estructura académica

- [ ] T042 [US3] Actualizar `src/app/admin/layout.tsx` — Agregar nav items: Carreras, Materias, Sesiones, Entregas
- [ ] T043 [US3] Crear `src/app/admin/sesiones/page.tsx` — CRUD sesiones con filtro por carrera/período/materia
- [ ] T044 [US3] Crear `src/app/admin/entregas/page.tsx` — Vista global de entregas con filtros
- [ ] T045 [P] [US3] Crear `src/lib/pdf-certificate.ts` — Generación PDF con jsPDF: nombre estudiante, programa, fecha, QR code, logo ITSEIA, firma
- [ ] T046 [US3] Actualizar `src/app/admin/page.tsx` — Agregar métricas: completion rates por materia, quiz pass rates, entregas pendientes
- [ ] T047 [US3] Crear `src/app/api/admin/seed-malla/route.ts` — POST: seed completo de estructura académica desde JSON

**Checkpoint**: Admin puede ver y gestionar toda la estructura académica, emitir certificados PDF reales.

---

## Phase 6: User Story 4 — Visitante descubre y se matricula (Priority: P3)

**Goal**: Flujo completo de captación hasta matrícula con pago

- [ ] T048 [US4] Crear `src/app/programs/[slug]/page.tsx` — Página pública de programa con descripción, malla visual, precios, CTA
- [ ] T049 [US4] Crear `src/app/apply/page.tsx` — Formulario de admisión: datos personales, carrera deseada, motivación. Guarda en tabla leads
- [ ] T050 [US4] Actualizar PayPal con productos reales: Matrícula $180, Pensión $300/mes, Pensión Pionero $220/mes con descuento 25%
- [ ] T051 [US4] Actualizar landing page `src/app/page.tsx` — Agregar sección de carreras con link a /programs/[slug]

**Checkpoint**: Visitante puede ver carreras, llenar admisión, pagar con PayPal, y acceder al campus.

---

## Phase 7: Content — 3 Materias Completas del Semestre 1

**Purpose**: Contenido educativo REAL para las primeras materias

⚠️ CRITICAL: Esta fase usa agentes de contenido especializados, no ingenieros

- [ ] T052 [P] [US1] **Carrera IA — "Fundamentos de Programación"**: Investigar y crear contenido para 16 sesiones: buscar videos YouTube (Python para principiantes en español), escribir teoría detallada, crear 5 preguntas quiz por sesión con explicaciones, diseñar ejercicio práctico por sesión, escribir prompt AI Lab contextual, listar recursos
- [ ] T053 [P] [US1] **Carrera CD — "Introducción a Ciencia de Datos"**: 16 sesiones completas con videos reales, teoría sobre qué es ciencia de datos, herramientas (Python, Pandas), quizzes, ejercicios con datasets reales
- [ ] T054 [P] [US1] **Carrera BD — "Introducción a Big Data"**: 16 sesiones completas con videos reales, teoría sobre ecosistema Big Data, herramientas (Hadoop conceptual, Python), quizzes, ejercicios
- [ ] T055 [US1] Cargar contenido de las 48 sesiones en Supabase via API o seed SQL

**Checkpoint**: Las 3 materias tienen 100% de sesiones con los 7 tipos de contenido. Videos son reales de YouTube. Quizzes tienen explicaciones.

---

## Phase 8: Polish & Cross-Cutting

**Purpose**: Completar los 21 módulos y pulir

- [ ] T056 [P] Actualizar TASKS.md con estado final
- [ ] T057 [P] Mobile responsive verification en 375px, 768px, 1200px para TODAS las páginas nuevas
- [ ] T058 [P] Verificar RLS: estudiante A no puede ver datos de estudiante B
- [ ] T059 Deploy final a tecnologico.itseia.ai via Vercel
- [ ] T060 Verificación: los 14 criterios de éxito de SPEC.md Sección 7 pasan
- [ ] T061 Verificación: los 8 criterios de éxito de spec.md (SC-001 a SC-008) pasan

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Schema)**: No dependencies — START HERE
- **Phase 2 (Navigation)**: Depends on Phase 1
- **Phase 3 (Session Components)**: Depends on Phase 1 + Phase 2
- **Phase 4 (Teacher Panel)**: Depends on Phase 1 + Phase 3
- **Phase 5 (Admin)**: Depends on Phase 1 + Phase 2
- **Phase 6 (Public)**: Depends on Phase 1
- **Phase 7 (Content)**: Depends on Phase 1 + Phase 3 (needs structure + components)
- **Phase 8 (Polish)**: Depends on all previous

### Parallel Opportunities
- T012-T015 (academic components) can run in parallel
- T020-T026 (session components) can run in parallel
- T036-T039 (teacher components) can run in parallel
- T052-T054 (3 materias content) can run in parallel with AGENT TEAMS
- Phases 4, 5, 6 can run in parallel after Phase 3

### Agent Team Strategy
- **Agent 1 (Arquitecto BD)**: Phase 1 — Schema + Seed
- **Agent 2 (Frontend)**: Phase 2 + Phase 3 — Navigation + Session components
- **Agent 3 (Backend)**: Phase 3 APIs + Phase 4 APIs — Quiz grading, submissions, progress
- **Agent 4 (Contenido IA)**: Phase 7 T052 — Fundamentos Programación
- **Agent 5 (Contenido CD)**: Phase 7 T053 — Intro Ciencia Datos
- **Agent 6 (Contenido BD)**: Phase 7 T054 — Intro Big Data
- **Lead (CTO)**: Coordinación, review, deploy
