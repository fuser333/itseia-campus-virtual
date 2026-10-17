# Implementation Plan: Modulo Docente Completo

**Branch**: `011-teacher-module` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)

## Summary

Transformar el modulo docente existente (7 paginas, 2 componentes, parcialmente implementado)
en un modulo completo de CES con cuatro pilares: (A) curso de capacitacion 120h con certificado,
(B) editor de contenido mejorado con validacion de calidad, (C) analytics pedagogico con
deteccion de riesgo, y (D) herramientas de comunicacion docente-estudiante. El modulo
reutiliza la estructura de programas/sesiones/progreso existente para la capacitacion,
minimizando esquema nuevo. Ninguna pagina existente se elimina; todas se extienden o
complementan con nuevas secciones.

## Technical Context

**Language/Version**: TypeScript 5.x
**Framework**: Next.js 15 App Router — `apps/web/`
**CSS**: Tailwind CSS 4 + shadcn/ui
**DB**: Supabase PostgreSQL (proyecto: wqlselfapnggxxeziruo) + Supabase Realtime
**Auth**: Supabase Auth (operativo, RLS activo)
**Deploy**: Vercel (tecnologico.itseia.ai)
**PDF generation**: `@react-pdf/renderer` (ligero, sin Puppeteer, compatible con Vercel Edge)
**Dependencias nuevas**:
  - `@react-pdf/renderer` — generacion de certificados y reportes PDF en servidor
  - No se agregan dependencias de video/audio (videoconferencia es spec 002)
**Paginas existentes que se extienden**:
  - `apps/web/src/app/teacher/page.tsx` — agregar widget de progreso de capacitacion
  - `apps/web/src/app/teacher/layout.tsx` — agregar nav items "Capacitacion" y "Comunicacion"
  - `apps/web/src/app/teacher/materias/[id]/page.tsx` — agregar tab Analytics
  - `apps/web/src/app/teacher/materias/[id]/sesion/[num]/edit/page.tsx` — mejorar todos los
    tabs con feedback de calidad, agregar rubrica en ejercicio
  - `apps/web/src/components/teacher/QuizBuilder.tsx` — agregar vista de tasa de error
    por pregunta (lectura, no edicion)
**Paginas nuevas**:
  - `apps/web/src/app/teacher/capacitacion/page.tsx`
  - `apps/web/src/app/teacher/comunicacion/page.tsx`
  - `apps/web/src/app/admin/docentes/capacitacion/page.tsx`
  - `apps/web/src/app/api/teacher/certificate/route.ts`
  - `apps/web/src/app/api/teacher/analytics/[subjectId]/route.ts`
  - `apps/web/src/app/api/announcements/route.ts`

## Constitution Check

1. **Problema institucional**: Art. 61 RRA 2022 exige docentes con 120h de formacion en
   docencia virtual. Sin esto el expediente CES queda incompleto. El modulo docente parcial
   actual no ofrece la capacitacion ni genera la evidencia requerida. Mapeado en
   `docs/ces_aprobacion/01_REQUISITOS_CES.md`.
2. **Roles afectados**: docente (consume capacitacion, edita contenido, usa analytics,
   comunica), coordinacion academica (verifica capacitacion, exporta reporte CES),
   super_admin (acceso completo), estudiante (recibe anuncios, mensajes).
3. **Datos, permisos y riesgos**: nuevas tablas con RLS estricto. El certificado PDF se
   genera server-side y la URL se almacena en Supabase Storage con acceso autenticado.
   Riesgo: docente falsifica horas — mitigado con RLS que solo permite insertar progreso via
   Server Actions, nunca desde el cliente directamente. Riesgo: mensajes directos como vector
   de acoso — mitigado con registro completo y visibilidad para coordinacion.
4. **Verificacion de exito**: test funcional: docente completa modulo, horas se suman,
   certificado se genera. Test de seguridad: docente no puede insertar filas de
   teacher_training_progress para otro docente. Smoke test: admin ve el reporte con datos
   reales antes de deploy.
5. **Slice minimo util**: capacitacion 120h con certificado (Phase A) ya es un entregable
   demostrable a CES independientemente del editor mejorado y analytics.
6. **CES Compliance (Principio VI)**: este spec cubre directamente el requisito de 120h de
   formacion docente (Art. 61 RRA 2022). El certificado PDF es la evidencia formal que
   SENESCYT solicita. El reporte del coordinador es la prueba de cumplimiento institucional.
7. **AI-First (Principio VII)**: el modulo de capacitacion incluye un modulo especifico sobre
   "IA en la Docencia" (uso de Gemini, ChatGPT, Claude para preparar clases). El indicador
   de completitud de sesion verifica la presencia del tab AI Lab, reforzando el mandato
   AI-first de la Constitution.
8. **Calidad de contenido (Principio VIII)**: el indicador de completitud de sesion y el
   contador de palabras implementan directamente este principio en el workflow del docente,
   haciendo que la regla de 7 tipos de contenido y 1500 palabras sea visible en el
   punto de edicion.

## Project Structure

### Documentacion

```text
specs/011-teacher-module/
├── spec.md
├── plan.md          (este archivo)
├── tasks.md
└── checklists/
    └── requirements.md
```

### Codigo fuente — archivos nuevos

```text
apps/web/src/
├── app/
│   ├── teacher/
│   │   ├── capacitacion/
│   │   │   └── page.tsx            — curso 120h, progreso, acceso a modulos
│   │   └── comunicacion/
│   │       └── page.tsx            — anuncios + mensajes directos
│   ├── admin/
│   │   └── docentes/
│   │       └── capacitacion/
│   │           └── page.tsx        — reporte exportable para coordinacion/CES
│   └── api/
│       ├── teacher/
│       │   ├── certificate/
│       │   │   └── route.ts        — GET: genera PDF certificado y lo almacena en Storage
│       │   └── analytics/
│       │       └── [subjectId]/
│       │           └── route.ts    — GET: retorna datos de riesgo, engagement, quiz stats
│       └── announcements/
│           └── route.ts            — POST: crea anuncio; GET: lista anuncios por materia
├── components/
│   └── teacher/
│       ├── TrainingProgress.tsx    — widget de progreso 120h para dashboard
│       ├── SessionQualityBar.tsx   — indicador de 7 tipos + contador palabras
│       ├── AssignmentRubric.tsx    — constructor de rubrica con validacion de pesos
│       ├── StudentRiskTable.tsx    — tabla de estudiantes en riesgo con intervencion
│       ├── QuizErrorRateChart.tsx  — grafico de preguntas mas falladas
│       ├── SessionEngagement.tsx  — metricas de tiempo y completitud por sesion
│       └── AnnouncementComposer.tsx — editor de anuncios y mensajes directos
└── features/
    └── teacher/
        ├── actions.ts              — Server Actions: completeModule, generateCertificate,
        │                             publishAnnouncement, sendMessage, saveIntervention
        └── queries.ts              — consultas: getTrainingProgress, getStudentsAtRisk,
                                      getQuizErrorRates, getSessionEngagement
```

### Codigo fuente — archivos modificados

```text
apps/web/src/
├── app/teacher/layout.tsx
│     — agregar nav items "Capacitacion" (con badge de horas) y "Comunicacion"
├── app/teacher/page.tsx
│     — agregar widget TrainingProgress en la parte superior del dashboard
├── app/teacher/materias/[id]/page.tsx
│     — agregar tab "Analytics" con StudentRiskTable, QuizErrorRateChart,
│       SessionEngagement
├── app/teacher/materias/[id]/sesion/[num]/edit/page.tsx
│     — tab video: agregar validacion YouTube en tiempo real (debounce 800ms)
│     — tab theory: agregar contador de palabras con indicador rojo/verde
│     — tab assignment: agregar toggle "Con rubrica" que monta AssignmentRubric
│     — header de la pagina: agregar SessionQualityBar con estado de 7 tipos
└── types/database.ts
      — agregar tipos: TeacherTrainingProgress, TeacherCertificate,
        TeacherExternalHours, AssignmentRubric, TeacherIntervention,
        Announcement, AnnouncementRead, DirectMessage
```

### Base de datos — migraciones nuevas

```text
supabase/migrations/
└── 20260323_011_teacher_module.sql
    — Programa especial de capacitacion:
      INSERT INTO programs (name, program_type='teacher_training', ...)
      INSERT INTO semesters + subjects + sessions para los 8 modulos del curso
    — CREATE TABLE teacher_training_progress
      (id, teacher_id FK profiles, session_id FK sessions, completed_at, hours_credited)
      RLS: INSERT/SELECT solo para el propio teacher_id o coordinacion/admin
    — CREATE TABLE teacher_certificates
      (id, teacher_id FK profiles, issued_at, certificate_url, total_hours, is_valid)
      RLS: SELECT para el propio teacher o coordinacion/admin; INSERT solo via server
    — CREATE TABLE teacher_external_hours
      (id, teacher_id FK profiles, hours, description, validated_by FK profiles,
       validated_at, created_at)
      RLS: INSERT/UPDATE para coordinacion/admin; SELECT para el propio teacher
    — CREATE TABLE assignment_rubrics
      (id, assignment_id FK assignments, criterion_name, description, weight_percent,
       order_index, created_at)
      RLS: CRUD para docente de la materia o admin
    — CREATE TABLE teacher_interventions
      (id, teacher_id FK profiles, student_id FK profiles, subject_id FK subjects,
       note_text, created_at)
      RLS: INSERT para docente asignado; SELECT para docente asignado y coordinacion/admin
    — CREATE TABLE announcements
      (id, teacher_id FK profiles, subject_id FK subjects, title, body_markdown,
       published_at, is_archived, created_at)
      RLS: INSERT/UPDATE para docente de la materia; SELECT para estudiantes matriculados
    — CREATE TABLE announcement_reads
      (id, announcement_id FK announcements, user_id FK profiles, read_at)
      RLS: INSERT/SELECT para el propio user_id
    — CREATE TABLE direct_messages
      (id, sender_id FK profiles, recipient_id FK profiles, subject_id FK subjects,
       body, sent_at, read_at)
      RLS: SELECT para sender_id O recipient_id; INSERT para docente asignado
    — Indexes: teacher_training_progress(teacher_id), announcements(subject_id),
      direct_messages(recipient_id, read_at), teacher_interventions(student_id, subject_id)
```

## Content for the Training Course (Institucional)

El curso "Docencia Virtual Efectiva" tiene 8 modulos predefinidos con un total de 120 horas
(las horas de cada modulo representan dedicacion estimada, no tiempo de plataforma en linea):

| # | Titulo del Modulo | Horas |
|---|------------------|-------|
| 1 | Fundamentos de la Educacion Virtual y el Marco CES | 12h |
| 2 | Uso Efectivo del LMS ITSEIA (Navegacion y Contenido) | 16h |
| 3 | Diseno de Contenido Interactivo y Evaluaciones Online | 20h |
| 4 | Facilitacion de Clases Sincronicas con Videoconferencia | 14h |
| 5 | Evaluacion Formativa y Retroalimentacion Efectiva | 16h |
| 6 | Seguimiento del Progreso Estudiantil y Tutoria Virtual | 14h |
| 7 | Inteligencia Artificial como Herramienta Pedagogica | 16h |
| 8 | Etica, Privacidad y Normativa en la Educacion Online | 12h |
| **Total** | | **120h** |

Cada modulo tiene las mismas 7 secciones que una sesion academica normal (video, slides,
teoria, quiz, ejercicio, AI Lab, recursos), construidas por coordinacion academica con
contenido relevante para docentes. El docente los completa como cualquier otro estudiante
del campus.

## Implementation Phases

### Phase A: Capacitacion 120h con certificado

**Objetivo**: Docente accede al curso de capacitacion, completa modulos y genera certificado.
Este phase es el entregable CES mas critico y funciona de forma completamente independiente.

- Crear migracion `20260323_011_teacher_module.sql` con todas las tablas nuevas y el seed
  del programa de capacitacion (programa + semestre + 8 sesiones con contenido placeholder
  que coordinacion completara despues).
- Extender `types/database.ts` con los tipos nuevos del modulo.
- Implementar `features/teacher/queries.ts::getTrainingProgress(teacherId)` — retorna
  horas completadas, horas totales, modulos completados, tiene_certificado.
- Implementar Server Action `completeModule(sessionId)` en `features/teacher/actions.ts`
  — inserta en teacher_training_progress, recalcula total, y si total >= 120 dispara
  `generateCertificate`.
- Implementar `GET /api/teacher/certificate/route.ts` — genera PDF con `@react-pdf/renderer`,
  lo sube a Supabase Storage `certificates/teacher/{teacherId}.pdf` y registra en
  teacher_certificates. Retorna URL firmada.
- Implementar `apps/web/src/app/teacher/capacitacion/page.tsx` — lista de modulos con
  estado completado/pendiente, barra de progreso a 120h, boton "Descargar Certificado"
  (habilitado solo cuando total >= 120h).
- Implementar `TrainingProgress.tsx` — widget compacto para el dashboard principal del
  docente (barra de progreso + link a la pagina de capacitacion).
- Agregar widget al dashboard en `teacher/page.tsx`.
- Implementar `apps/web/src/app/admin/docentes/capacitacion/page.tsx` — tabla de todos los
  docentes con sus horas y estado, exportacion CSV y PDF via `@react-pdf/renderer`.
- Agregar nav item "Capacitacion" en `teacher/layout.tsx` con badge que muestra horas actuales.

### Phase B: Editor de contenido mejorado

**Objetivo**: Docente recibe feedback de calidad al editar sesiones. Implementacion incremental
sobre el editor existente sin reescritura.

- Implementar `SessionQualityBar.tsx` — barra horizontal con 7 iconos (uno por tipo de
  contenido); cada icono es verde si el contenido existe, gris si no. Calcula estado a partir
  de las props pasadas desde el editor. Colocar en el header de `sesion/[num]/edit/page.tsx`.
- En tab Video del editor: agregar validacion de URL YouTube con `useEffect` + debounce 800ms
  — hace fetch a `https://www.youtube.com/oembed?url={videoUrl}&format=json` para verificar
  existencia sin CORS issues. Muestra badge verde "Video verificado" o rojo "URL no valida".
- En tab Teoria del editor: agregar contador de palabras reactivo calculado sobre
  `theoryMarkdown`. Mostrar "X palabras" con color rojo cuando X < 1500 y verde cuando
  X >= 1500. Anadir texto de ayuda "Minimo 1500 palabras segun estandar CES".
- Implementar `AssignmentRubric.tsx` — tabla editable con filas de criterios (nombre,
  descripcion, peso %); suma de pesos se valida y muestra en tiempo real; boton agregar
  fila; boton eliminar fila; guardado via upsert en assignment_rubrics.
- En tab Assignment del editor: agregar toggle "Incluir rubrica de evaluacion" que monta
  `AssignmentRubric` cuando esta activo.
- Agregar migration field `has_rubric boolean default false` en assignments (o derivarlo
  de la existencia de filas en assignment_rubrics).

### Phase C: Analytics pedagogico

**Objetivo**: Docente identifica estudiantes en riesgo y preguntas problematicas.

- Implementar `GET /api/teacher/analytics/[subjectId]/route.ts` — endpoint que calcula y
  retorna tres datasets:
  1. `students_at_risk`: lista de estudiantes que cumplen al menos un criterio de riesgo
     (session completion < 70%, quiz avg < 60%, o attendance streaks con 2+ ausencias
     consecutivas). Join entre session_progress, quiz_attempts y attendance.
  2. `quiz_error_rates`: por cada pregunta de quizzes de esa materia, tasa de error
     (respuestas_incorrectas / intentos_totales), ordenado desc.
  3. `session_engagement`: por cada sesion, tiempo promedio estimado y tasa de completitud.
- Implementar `StudentRiskTable.tsx` — tabla con columnas: nombre, criterio de riesgo,
  ultimo acceso, boton "Registrar intervencion" que abre un textarea inline para escribir
  nota; al guardar llama Server Action `saveIntervention`.
- Implementar `QuizErrorRateChart.tsx` — lista ordenada de preguntas con barra horizontal
  proporcional a la tasa de error; texto truncado de la pregunta + porcentaje de error.
- Implementar `SessionEngagement.tsx` — tabla por sesion con: numero, titulo, tiempo promedio
  estimado y barra de completitud porcentual.
- Agregar tab "Analytics" a `teacher/materias/[id]/page.tsx` con selector de sub-vista:
  "Estudiantes en riesgo", "Preguntas de quiz", "Engagement por sesion".
- Implementar Server Action `saveIntervention(studentId, subjectId, noteText)` en
  `features/teacher/actions.ts`.

### Phase D: Comunicacion docente-estudiante

**Objetivo**: Docente puede enviar anuncios y mensajes directos. Estudiante los recibe
en su dashboard con indicador de nuevo.

- Implementar `POST /api/announcements/route.ts` — crea anuncio, inserta en announcements,
  retorna el objeto creado. RLS valida que el sender es docente de la materia.
- Implementar `GET /api/announcements/route.ts` — retorna anuncios para una materia con
  join a announcement_reads para el usuario actual, indicando si cada anuncio fue leido.
- Implementar `AnnouncementComposer.tsx` — formulario con campo titulo, editor markdown del
  cuerpo, selector de materia, boton publicar. Debajo, historial de anuncios publicados con
  contador de lecturas y botones archivar/editar.
- Implementar `apps/web/src/app/teacher/comunicacion/page.tsx` — tabs "Anuncios" y
  "Mensajes directos". Tab anuncios monta `AnnouncementComposer`. Tab mensajes directos
  muestra lista de estudiantes de las materias del docente y un hilo de conversacion al
  seleccionar uno.
- Agregar seccion "Anuncios" al dashboard del estudiante (fuera de scope de este spec pero
  anotado como consumidor): el componente AnnouncementFeed que consume el mismo endpoint
  GET con el rol estudiante sera implementado en el spec del dashboard de estudiante.
  Para este spec: verificar que el RLS y el endpoint permiten el acceso correcto al rol
  estudiante matriculado.
- Agregar nav item "Comunicacion" en `teacher/layout.tsx`.
- Configurar Supabase Realtime en la tabla announcements para que el dashboard del
  estudiante reciba notificaciones sin recargar (INSERT event).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| `@react-pdf/renderer` nueva dependencia | Certificado PDF es evidencia formal CES y debe descargarse. HTML/CSS print no es confiable en todos los navegadores y no genera archivo descargable consistente. | La alternativa `puppeteer` requiere Docker/Node server que no es compatible con Vercel Edge Functions sin configuracion adicional. `@react-pdf/renderer` corre en Node runtime normal de Vercel. |
| Endpoint `/api/teacher/analytics/[subjectId]` con tres joins | Los calculos de riesgo cruzan tres tablas (session_progress, quiz_attempts, attendance). No es posible hacerlo con una sola query simple y RLS aun aplica correctamente. | Tres endpoints separados multiplicarian las llamadas de red y el tiempo de carga del tab Analytics. Un endpoint consolidado con payload estructurado es mas eficiente. |
| Seed de programa de capacitacion en migracion SQL | El curso de 120h debe existir como dato en la DB antes de que cualquier docente pueda acceder. No puede ser creado ad-hoc desde la UI. | Alternativa de crearlo via admin panel requeriria que el admin lo construya manualmente antes de cada deploy/reset, introduciendo riesgo de inconsistencia. |

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Docente inserta filas falsas en teacher_training_progress via cliente | Baja | Alto | RLS: INSERT solo permitido desde Server Actions autenticadas con `service_role`, no desde cliente con `anon` key. Las Server Actions verifican rol del usuario. |
| Contenido del curso de capacitacion incompleto al momento del deploy | Alta | Medio | Seed crea sesiones con contenido placeholder. El curso funciona estructuralmente desde el dia 1. Coordinacion completa el contenido a su ritmo sin afectar el conteo de horas. |
| `@react-pdf/renderer` aumenta bundle size del servidor | Media | Bajo | La libreria corre solo en el route handler del servidor, no en el bundle del cliente. Impacto en cold start de Vercel minimo (<200ms adicionales). |
| Query de analytics lenta con muchos estudiantes | Media | Medio | Agregar indices en session_progress(user_id, session_id), quiz_attempts(user_id, quiz_id), attendance(user_id, live_session_id). Paginar si la materia supera 100 estudiantes. |
| Mensajes directos usados de forma inapropiada | Baja | Medio | Todos los mensajes son visibles para coordinacion/admin via RLS. Sin funcionalidad de "delete" para mensajes ya enviados, garantizando trazabilidad. |

## Environment Variables Required

Sin variables de entorno nuevas para este spec. Reutiliza:

```bash
NEXT_PUBLIC_SUPABASE_URL=         # Ya configurada
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Ya configurada
SUPABASE_SERVICE_ROLE_KEY=        # Ya configurada — usada por Server Actions para bypass RLS en certificate generation
```
