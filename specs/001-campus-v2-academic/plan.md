# Implementation Plan: Campus Virtual V2 — Estructura Académica Real

**Branch**: `001-campus-v2-academic` | **Date**: 2026-03-21 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-campus-v2-academic/spec.md`

## Summary

Rediseñar la plataforma ITSEIA Academy Online para reflejar la estructura académica real del CES (3 carreras, 5 períodos, 87 asignaturas) con sesiones de clase que incluyen 7 tipos de contenido (video, slides, teoría, quiz, ejercicio, AI Lab, recursos). Incluye panel docente completo, 3 materias del Semestre 1 con contenido real, y sistema de quizzes con auto-grading.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16.2.1 (App Router), Tailwind CSS 4, shadcn/ui, @supabase/ssr, @paypal/react-paypal-js, react-markdown, lucide-react
**Storage**: Supabase PostgreSQL (proyecto wqlselfapnggxxeziruo, Pro plan) + Supabase Storage (submissions, slides)
**Testing**: Manual testing + agente revisor + agente tester (Prompt Maestro)
**Target Platform**: Web (desktop + mobile responsive) — Vercel deployment
**Project Type**: Web application (LMS - Learning Management System)
**Performance Goals**: < 3s first contentful paint, < 300KB JS bundle, AI Lab responde < 5s
**Constraints**: Costo operativo < $95/mes a 200 estudiantes, PayPal sandbox (test), Gemini API
**Scale/Scope**: 200 estudiantes inicial, 3 carreras, 87 asignaturas, ~1400 sesiones totales

## Constitution Check

*GATE: Verificado contra `.specify/memory/constitution.md` v1.0.0*

| Principio | Status | Verificación |
|-----------|--------|-------------|
| I. Estructura Madre es Ley | PASS | Plan implementa los 21 módulos de ESTRUCTURA_COMPLETA.md |
| II. Datos CES Inamovibles | PASS | Usa datos exactos de PROYECTO_CARRERAS_ITSEIA_CORREGIDO.pdf |
| III. Simplicidad | PASS | Stack bloqueado, sin microservicios, sin dependencias innecesarias |
| IV. Cada Materia es Producto Completo | PASS | 7 tipos de contenido obligatorios por sesión |
| V. AI Lab es el Diferenciador | PASS | Tutor contextual + multi-modelo + editor código futuro |
| VI. Panel Docente Obligatorio | PASS | Fase D crea panel docente completo |
| VII. Contenido Real | PASS | Usa mallas CES + INVESTIGACION_MATERIAS.md + videos YouTube reales |
| VIII. Equipo de Agentes | PASS | Plan define equipos por fase con agentes especializados |

## Project Structure

### Documentation (this feature)

```text
specs/001-campus-v2-academic/
├── spec.md              # Especificación (completada)
├── plan.md              # Este archivo
├── tasks.md             # Siguiente: /speckit.tasks
└── checklists/
    └── requirements.md  # Checklist de calidad (completado)
```

### Source Code (existing + new)

```text
src/
├── app/
│   ├── (auth)/                    # EXISTE — Login, Register
│   ├── (public)/                  # EXISTE parcial
│   ├── admin/                     # EXISTE — Extender con carreras, materias, sesiones
│   ├── ai-lab/                    # EXISTE — Funcional
│   ├── api/
│   │   ├── ai/chat/               # EXISTE — Multi-modelo funcional
│   │   ├── auth/                  # EXISTE — Confirm, callback
│   │   ├── enroll/                # EXISTE
│   │   ├── payments/              # EXISTE — PayPal create/capture
│   │   ├── xp/                    # EXISTE — Gamificación
│   │   ├── quiz/attempt/          # NUEVO — Auto-grading quiz
│   │   ├── assignments/submit/    # NUEVO — Upload + submission
│   │   ├── assignments/grade/     # NUEVO — Docente califica
│   │   ├── sessions/progress/     # NUEVO — Progreso granular sesión
│   │   └── admin/seed-malla/      # NUEVO — Seed académico
│   ├── carreras/                  # NUEVO — Navegación académica
│   │   ├── [slug]/                # Vista de carrera con períodos
│   │   └── [slug]/materia/
│   │       ├── [subjectSlug]/     # Vista de materia con sesiones
│   │       └── [subjectSlug]/sesion/
│   │           └── [num]/         # CORE: Sesión con 7 tabs
│   ├── teacher/                   # NUEVO — Panel docente completo
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Dashboard docente
│   │   ├── materias/[id]/         # Editor contenido materia
│   │   ├── materias/[id]/sesion/[num]/edit  # Editor sesión
│   │   ├── entregas/              # Revisor entregas
│   │   └── progreso/              # Progreso estudiantes
│   ├── apply/                     # NUEVO — Formulario admisión
│   ├── programs/[slug]/           # NUEVO — Página de programa público
│   ├── dashboard/                 # EXISTE — Agregar progreso carrera
│   ├── courses/                   # EXISTE — Se mantiene para cursos profesionales
│   ├── certificates/              # EXISTE — Agregar generación PDF real
│   ├── payments/                  # EXISTE
│   ├── portfolio/                 # EXISTE
│   ├── pricing/                   # EXISTE
│   └── profile/                   # EXISTE
├── components/
│   ├── ui/                        # EXISTE — 18 componentes shadcn/ui
│   ├── layout/                    # EXISTE — Header, Sidebar
│   ├── ai-lab/                    # EXISTE — ChatPanel, ModelSelector
│   ├── courses/                   # EXISTE — CourseCard, ModuleAccordion
│   ├── gamification/              # EXISTE — XPToast, LevelBadge
│   ├── payments/                  # EXISTE — PayPalCheckout
│   ├── session/                   # NUEVO — Componentes de sesión
│   │   ├── VideoPlayer.tsx        # YouTube embed con tracking
│   │   ├── SlideViewer.tsx        # PDF viewer embebido
│   │   ├── TheoryContent.tsx      # Markdown mejorado
│   │   ├── QuizEngine.tsx         # Motor quizzes auto-grading
│   │   ├── AssignmentPanel.tsx    # Instrucciones + upload
│   │   ├── AILabPanel.tsx         # Chat contextual (reutiliza ChatPanel)
│   │   ├── ResourceList.tsx       # Lista recursos
│   │   ├── SessionTabs.tsx        # Navegación 7 tabs
│   │   └── SessionNav.tsx         # Anterior/Siguiente
│   ├── academic/                  # NUEVO — Navegación académica
│   │   ├── CareerOverview.tsx     # Card carrera con períodos
│   │   ├── SemesterCard.tsx       # Card período con materias
│   │   ├── SubjectCard.tsx        # Card materia con progreso
│   │   └── Breadcrumb.tsx         # Posición académica
│   └── teacher/                   # NUEVO — Componentes docente
│       ├── ContentEditor.tsx      # Editor contenido sesión
│       ├── QuizBuilder.tsx        # CRUD preguntas quiz
│       ├── SubmissionsTable.tsx   # Tabla entregas con calificación
│       └── StudentProgress.tsx    # Tabla progreso estudiantes
├── lib/
│   ├── supabase/                  # EXISTE — client, server, middleware
│   ├── ai/                        # EXISTE — gemini, models
│   ├── gamification.ts            # EXISTE
│   ├── paypal.ts                  # EXISTE
│   └── pdf-certificate.ts         # NUEVO — Generación PDF certificado
└── types/
    └── database.ts                # EXISTE — Extender con tipos V3
```

**Structure Decision**: Estructura web application Next.js App Router existente. Se extiende con nuevas rutas `/carreras/` (académica), `/teacher/` (docente), y nuevos componentes en `components/session/`, `components/academic/`, `components/teacher/`. Los cursos profesionales existentes en `/courses/` se mantienen sin cambios.

## Implementation Phases

### Phase A: Schema V3 + Seed (Day 1)
**Team**: Arquitecto BD (Dir. Tecnología)
**Deliverables**:
1. SQL migration `supabase_schema_v3.sql` con tablas: semesters, subjects, sessions, quizzes, quiz_questions, quiz_attempts, assignments, submissions, session_progress, session_resources
2. RLS policies para todas las tablas nuevas
3. Alteraciones a tablas existentes: programs (add career_code, total_semesters), profiles (add current_semester)
4. Seed SQL con las 3 carreras × 5 períodos × 87 asignaturas exactas del CES
5. Supabase Storage buckets: submissions, slides, resources
6. Actualizar `types/database.ts` con interfaces V3

**Dependencies**: Ninguna
**Constitution Gate**: Principio II (datos CES exactos), Principio III (simplicidad)

### Phase B: Academic Navigation (Day 2-3)
**Team**: Frontend Developer + Dir. Producto
**Deliverables**:
1. Rutas: /carreras, /carreras/[slug], /carreras/[slug]/materia/[subjectSlug], /carreras/[slug]/materia/[subjectSlug]/sesion/[num]
2. Componentes: CareerOverview, SemesterCard, SubjectCard, Breadcrumb
3. Dashboard actualizado con progreso de carrera
4. Admin: CRUD semestres y materias (extendiendo patrón existente de admin/programs)
5. Sidebar actualizado con "Mi Carrera" para estudiantes de carrera

**Dependencies**: Phase A (tablas deben existir)
**Constitution Gate**: Principio I (21 módulos), Principio III (simplicidad)

### Phase C: Session Components (Day 3-5)
**Team**: Frontend Developer + Backend Developer
**Deliverables**:
1. VideoPlayer.tsx — YouTube embed con tracking de tiempo visto (posts a session_progress)
2. SlideViewer.tsx — PDF embebido con página tracking
3. TheoryContent.tsx — ReactMarkdown extendido con syntax highlighting (rehype-highlight)
4. QuizEngine.tsx — Motor de quizzes: mostrar preguntas, selección, submit, auto-grade, explicaciones, retry
5. AssignmentPanel.tsx — Instrucciones + file upload a Supabase Storage + status
6. AILabPanel.tsx — Wrapper de ChatPanel con contexto de sesión auto-inyectado
7. ResourceList.tsx — Lista de recursos con iconos por tipo
8. SessionTabs.tsx — Tab navigation para los 7 tipos de contenido
9. SessionNav.tsx — Prev/Next con indicadores completado
10. API routes: /api/quiz/attempt (auto-grading), /api/assignments/submit, /api/sessions/progress

**Dependencies**: Phase A (tablas), Phase B (rutas)
**Constitution Gate**: Principio IV (7 tipos de contenido obligatorios)

### Phase D: Teacher Panel (Day 5-7)
**Team**: Frontend Developer + Backend Developer
**Deliverables**:
1. /teacher layout con sidebar y dashboard
2. ContentEditor.tsx — Form: video URL, PDF upload, markdown editor con preview
3. QuizBuilder.tsx — CRUD preguntas con drag-reorder, preview, explicaciones
4. SubmissionsTable.tsx — Lista entregas por materia, calificación inline, feedback
5. StudentProgress.tsx — Tabla progreso estudiantes con filtros
6. API route: /api/assignments/grade
7. Middleware: /teacher protegido para role "docente"

**Dependencies**: Phase A, Phase C
**Constitution Gate**: Principio VI (panel docente obligatorio)

### Phase E: 3 Materias Completas (Day 7-12)
**Team**: Dir. Contenido + Content Researcher + Dir. Académico + Especialista AI
**Deliverables**:
1. **Carrera IA — "Fundamentos de Programación"**: 16 sesiones con video YouTube real, presentación PDF, teoría markdown detallada, quiz 5 preguntas con explicaciones, ejercicio práctico, prompt AI Lab, recursos. Herramientas: Python, VS Code, Jupyter.
2. **Carrera CD — "Introducción a Ciencia de Datos"**: 16 sesiones completas. Herramientas: Python, Pandas, Jupyter, datasets.
3. **Carrera BD — "Introducción a Big Data"**: 16 sesiones completas. Herramientas: Python, SQL, terminal, Hadoop conceptual.

Cada sesión = ~2-3 horas de investigación y redacción = ~120 horas de trabajo de contenido.

**Dependencies**: Phase A (estructura en BD), Phase C (componentes para mostrar contenido)
**Constitution Gate**: Principio VII (contenido real, no genérico), Principio IV (7 tipos)

### Phase F: Missing Modules + Polish (Day 12-15)
**Team**: Full team
**Deliverables**:
1. Certificado PDF real con jsPDF (nombre, programa, QR, branding ITSEIA)
2. PayPal productos reales (matrícula $180, pensiones $300/$220)
3. Formulario admisión /apply (lead capture)
4. Páginas de programa /programs/[slug]
5. Admin: gestión mallas visual, emisión certificados
6. CRM leads básico
7. Analytics dashboard mejorado

**Dependencies**: All previous phases
**Constitution Gate**: Principio I (21 módulos completos)

### Phase G: Verification + Deploy (Day 15-16)
**Team**: Dir. QA
**Deliverables**:
1. Test end-to-end: registro → pago → enrollment → estudio → quiz → progreso → certificado
2. Test: docente crea contenido → estudiante lo ve
3. Test: mobile responsive (375px, 768px, 1200px)
4. Test: RLS aislamiento entre estudiantes
5. Deploy final producción en tecnologico.itseia.ai

**Dependencies**: All phases complete
**Constitution Gate**: All 8 principles verified

## Complexity Tracking

No constitution violations. Stack es el bloqueado por Principio III.

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| CEO no ejecuta SQL en Supabase a tiempo | Low | High (blocks all) | Proporcionar SQL en un solo archivo, instrucciones paso a paso |
| Videos YouTube no disponibles en español para todos los temas | Medium | Medium | Aceptar videos en inglés, priorizar canales educativos reconocidos |
| 48 sesiones × 7 contenidos = 336 piezas de contenido es mucho | High | High | Usar agentes paralelos, priorizar calidad sobre cantidad, 8 sesiones primero por materia |
| Supabase Storage límites para uploads de estudiantes | Low | Low | Cap 10MB por archivo, monitorear uso |
| ChatGPT/Claude/Gemini iframes bloqueados por X-Frame-Options | Confirmed | Medium | Usar proxy API Gemini (ya funcional), abrir herramientas en tabs nuevas |

## Environment Variables Required

```
# .env.example — ya configuradas en .env.local y Vercel
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
SUPABASE_SERVICE_ROLE_KEY=[service role key]
GEMINI_API_KEY=[gemini api key]
PAYPAL_CLIENT_ID=[paypal client id]
PAYPAL_SECRET=[paypal secret]
NEXT_PUBLIC_PAYPAL_CLIENT_ID=[same as PAYPAL_CLIENT_ID]
PAYPAL_MODE=sandbox
```
