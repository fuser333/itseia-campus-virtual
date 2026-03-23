# Tasks: Modulo Docente Completo

**Input**: plan.md + spec.md
**Prerequisites**:
- 001-platform-foundation completo: auth, roles, profiles.role, subjects.teacher_id, enrollments
- 005-exam-integrity completo: quiz_questions, quiz_attempts con respuestas por pregunta
- 007-attendance-tracking completo: tabla attendance con live_session_id, joined_at, left_at

**Tests**: Verificar RLS en cada tabla nueva (docente no puede ver/modificar datos de
otro docente). Smoke test certificado: docente con 120h obtiene PDF descargable.
Test anuncios: anuncio publicado aparece para estudiante matriculado, no para estudiante
de otra materia.

## Format: `[ID] [P?] [Story] Description`
- P = paralelizable (puede ejecutarse concurrentemente con otras tareas P)
- Story = historia de usuario que sirve (US1-US5)

---

## Phase A: Capacitacion 120h con certificado

**Purpose**: Docente accede al curso, completa modulos y obtiene certificado PDF.
Entregable CES independiente que puede demostrarse a SENESCYT sin las otras fases.

- [ ] T001 [US1] [US5] Crear migracion `supabase/migrations/20260323_011_teacher_module.sql`
      con las tablas: `teacher_training_progress`, `teacher_certificates`,
      `teacher_external_hours`, `assignment_rubrics`, `teacher_interventions`,
      `announcements`, `announcement_reads`, `direct_messages`. Incluir RLS policies
      e indices segun plan.md. Incluir seed del programa "Docencia Virtual Efectiva"
      con sus 8 modulos (INSERT en programs, semesters, subjects, sessions con
      `program_type = 'teacher_training'`, contenido placeholder).
- [ ] T002 [P] [US1] Extender `apps/web/src/types/database.ts` con los tipos:
      `TeacherTrainingProgress`, `TeacherCertificate`, `TeacherExternalHours`,
      `AssignmentRubric`, `TeacherIntervention`, `Announcement`, `AnnouncementRead`,
      `DirectMessage`. Puede ejecutarse en paralelo con T001.
- [ ] T003 [US1] Implementar `features/teacher/queries.ts` con la funcion
      `getTrainingProgress(teacherId)` — consulta `teacher_training_progress` agregada
      por `session_id`, suma `hours_credited`, retorna `{ hoursCompleted, hoursTotal: 120,
      modulesCompleted, hasCertificate }`. Requiere T001 y T002.
- [ ] T004 [US1] Implementar `features/teacher/actions.ts` con Server Action
      `completeModule(sessionId)` — verifica rol docente, inserta en
      `teacher_training_progress` si no existe, recalcula total de horas, y si total >= 120
      llama `triggerCertificateGeneration(teacherId)`. Requiere T003.
- [ ] T005 [US1] [US5] Implementar `GET /api/teacher/certificate/route.ts` — recibe
      `teacherId` en query params, valida que el docente tiene >= 120h en
      `teacher_training_progress`, genera PDF con `@react-pdf/renderer` (nombre, fecha,
      total horas, logo ITSEIA, referencia Art. 61 RRA 2022), sube a Supabase Storage
      `certificates/teacher/{teacherId}.pdf`, inserta o actualiza fila en
      `teacher_certificates`, retorna URL publica firmada. Requiere T004.
- [ ] T006 [P] [US1] Implementar componente `TrainingProgress.tsx` — barra de progreso
      horizontal con etiqueta "X/120h completadas", porcentaje numerico y link a la
      pagina de capacitacion. Estado de carga mientras fetch. Puede ejecutarse en
      paralelo con T005.
- [ ] T007 [US1] Implementar pagina `apps/web/src/app/teacher/capacitacion/page.tsx`
      — header con barra de progreso grande, lista de 8 modulos con estado (completado/
      pendiente/en progreso), boton "Ir al modulo" que navega a la sesion academica
      del modulo, boton "Descargar Certificado" (disabled hasta 120h, hace GET al
      route T005). Requiere T003, T004, T006.
- [ ] T008 [P] [US5] Implementar pagina `apps/web/src/app/admin/docentes/capacitacion/
      page.tsx` — tabla de todos los docentes activos con columnas: nombre, materias
      asignadas, horas completadas de 120, fecha certificado, estado (En progreso /
      Certificado). Selector para registrar horas externas validadas (llama Server Action
      `saveExternalHours`). Botones "Exportar CSV" y "Exportar PDF". Puede ejecutarse en
      paralelo con T007.
- [ ] T009 [US1] Agregar widget `TrainingProgress` al dashboard principal
      `apps/web/src/app/teacher/page.tsx` — insertar antes de la seccion "Mis Materias".
      Agregar nav items "Capacitacion" y "Comunicacion" en `apps/web/src/app/teacher/
      layout.tsx`. Requiere T006, T007.

**Checkpoint Phase A**: Un docente puede navegar a /teacher/capacitacion, ver los 8 modulos,
marcar uno como completado (boton de prueba para QA), ver las horas acumularse, y cuando
llega a 120h el boton "Descargar Certificado" se habilita y genera un PDF descargable.
El coordinador en /admin/docentes/capacitacion ve al docente con su progreso real.

---

## Phase B: Editor de contenido mejorado

**Purpose**: Docente recibe feedback de calidad al editar sesiones, sin reescribir el editor.

- [ ] T010 [P] [US2] Implementar componente `SessionQualityBar.tsx` — acepta props con
      boolean por cada tipo de contenido (hasVideo, hasSlides, hasTheory, hasQuiz,
      hasAssignment, hasAiLab, hasResources); renderiza 7 iconos con tooltip, verde si
      presente, gris si ausente; incluye texto "X/7 completos" y badge de estado
      (Completa / En progreso). Puede ejecutarse en paralelo con otras tareas de Phase B.
- [ ] T011 [P] [US2] Agregar validacion de URL YouTube al tab Video del editor existente
      `sesion/[num]/edit/page.tsx` — agregar `useEffect` con debounce 800ms que hace
      fetch a `https://www.youtube.com/oembed?url=...&format=json`; muestra badge verde
      "Video verificado" o rojo "URL no valida" segun respuesta. El guardado no se
      bloquea por el estado del badge. Puede ejecutarse en paralelo con T010.
- [ ] T012 [P] [US2] Agregar contador de palabras al tab Teoria del editor — funcion
      pura `countWords(markdown: string)` que cuenta palabras ignorando sintaxis markdown;
      `useEffect` que la ejecuta con debounce 300ms sobre `theoryMarkdown`; render de
      etiqueta `"{count} palabras"` con clases Tailwind rojo/verde segun umbral 1500;
      texto de ayuda "Minimo 1500 palabras segun estandar CES". Puede ejecutarse en
      paralelo con T010 y T011.
- [ ] T013 [US2] Implementar componente `AssignmentRubric.tsx` — tabla con filas editables
      (criterion_name, description, weight_percent), validacion que sum(weights) == 100%
      mostrada en tiempo real, boton "Agregar criterio", boton "Eliminar" por fila;
      al guardar hace upsert en `assignment_rubrics` via Server Action `saveRubric`.
      Requiere T001 y T002.
- [ ] T014 [US2] Integrar `AssignmentRubric` y toggle en tab Assignment del editor —
      agregar toggle switch "Incluir rubrica de evaluacion" debajo del campo de
      instrucciones; cuando activo monta `AssignmentRubric` con el `assignment.id`
      correspondiente. Agregar `SessionQualityBar` en el header del editor con las props
      calculadas del estado actual de la sesion. Requiere T010, T013.

**Checkpoint Phase B**: Docente edita una sesion, pega URL de YouTube invalida y ve
la etiqueta roja sin que el formulario se bloquee. Escribe menos de 1500 palabras en teoria
y ve el contador en rojo con el deficit exacto. Activa la rubrica y puede agregar criterios
con pesos que suman 100% antes de guardar.

---

## Phase C: Analytics pedagogico

**Purpose**: Docente identifica estudiantes en riesgo y preguntas problematicas.

- [ ] T015 [US3] Implementar `GET /api/teacher/analytics/[subjectId]/route.ts` — valida
      que el usuario autenticado es el docente de la materia (o admin/coordinacion); ejecuta
      tres queries paralelas:
      1. `students_at_risk`: JOIN session_progress + quiz_attempts + attendance filtrado por
         subjectId; aplica los tres criterios de riesgo; retorna lista con nombre, criterios
         activados, ultimo acceso.
      2. `quiz_error_rates`: para cada quiz_question de la materia, cuenta intentos totales
         y respuestas incorrectas; retorna lista ordenada por tasa de error desc.
      3. `session_engagement`: para cada sesion de la materia, promedio de (completed_at -
         started_at) de session_progress donde ambos no son null, y count(completed)/
         count(all) como tasa de completitud.
      Requiere T001 y T002.
- [ ] T016 [P] [US3] Implementar `StudentRiskTable.tsx` — tabla con estudiantes en riesgo,
      columnas: nombre, criterios (badges de colores), ultimo acceso, boton "Intervenir"
      que despliega textarea inline; al confirmar llama Server Action `saveIntervention`;
      etiqueta "Intervencion registrada" post-guardado. Puede ejecutarse en paralelo con T017.
- [ ] T017 [P] [US3] Implementar `QuizErrorRateChart.tsx` — lista de preguntas con barra
      horizontal proporcional a tasa de error; texto de pregunta truncado a 80 chars con
      tooltip completo; etiqueta de porcentaje. Puede ejecutarse en paralelo con T016.
- [ ] T018 [P] [US3] Implementar `SessionEngagement.tsx` — tabla con sesiones de la
      materia, columnas: numero, titulo, tiempo promedio estimado (en minutos), barra de
      completitud porcentual con color segun valor (rojo <50%, amarillo <80%, verde >=80%).
      Puede ejecutarse en paralelo con T016 y T017.
- [ ] T019 [US3] Agregar tab "Analytics" a `apps/web/src/app/teacher/materias/[id]/page.tsx`
      — tabs internos con tres sub-vistas: "Estudiantes en riesgo" (StudentRiskTable),
      "Preguntas de quiz" (QuizErrorRateChart), "Engagement" (SessionEngagement). El tab
      hace el fetch al endpoint T015 al activarse. Requiere T015, T016, T017, T018.
- [ ] T020 [US3] Agregar Server Action `saveIntervention(studentId, subjectId, noteText)`
      en `features/teacher/actions.ts` — valida rol, inserta en teacher_interventions,
      retorna confirmacion. Requiere T001 y T002.

**Checkpoint Phase C**: Docente selecciona una materia con al menos 3 estudiantes y algun
quiz respondido, activa el tab Analytics, ve la lista de estudiantes en riesgo (aunque
sea vacia con mensaje "Sin estudiantes en riesgo"), ve las preguntas del quiz ordenadas
por tasa de error, y puede registrar una intervencion para un estudiante especifico.

---

## Phase D: Comunicacion docente-estudiante

**Purpose**: Docente publica anuncios y envia mensajes directos. Estudiantes los reciben
en tiempo real sin recargar.

- [ ] T021 [US4] Implementar `POST /api/announcements/route.ts` — recibe body con
      `{ subject_id, title, body_markdown }`; valida que el usuario autenticado es docente
      de esa materia via subjects.teacher_id; inserta en announcements; retorna el objeto.
      Implementar tambien `GET /api/announcements/route.ts` — acepta `subject_id` y `role`;
      si rol docente retorna todos los anuncios de la materia con contador de lecturas;
      si rol estudiante retorna solo anuncios publicados con flag `is_read` calculado desde
      announcement_reads. Requiere T001 y T002.
- [ ] T022 [US4] Implementar `AnnouncementComposer.tsx` — formulario con Input titulo,
      Textarea cuerpo (markdown), selector de materia, boton "Publicar"; debajo tabla de
      anuncios publicados con columnas: titulo, materia, fecha, lecturas, acciones
      (archivar); llamada a POST /api/announcements al publicar; llamada a GET para listar.
      Requiere T021.
- [ ] T023 [US4] Implementar pagina `apps/web/src/app/teacher/comunicacion/page.tsx`
      — tab "Anuncios" que monta `AnnouncementComposer`; tab "Mensajes directos" con
      lista de estudiantes de las materias del docente y hilo de mensajes al seleccionar
      uno (INSERT/SELECT en direct_messages); estado de lectura con punto verde/gris.
      Requiere T022.
- [ ] T024 [US4] Configurar Supabase Realtime en la tabla announcements para INSERT events
      — el canal se suscribe filtrado por subject_id. Agregar el subscriber en la pagina
      del dashboard del estudiante (si ya existe un componente de anuncios) o documentar
      el patron de suscripcion para que el spec del dashboard de estudiante lo implemente.
      Verificar que el RLS de announcements permite SELECT a estudiantes matriculados.
      Requiere T021.

**Checkpoint Phase D**: Docente publica un anuncio para una materia. Estudiante autenticado
y matriculado en esa materia ve el anuncio en /teacher/comunicacion o en la pagina de su
materia (segun donde se consuma el endpoint). Estudiante de otra materia no puede ver el
anuncio (test de RLS con usuario diferente).

---

## Dependencies & Execution Order

- T001 es el prerequisito absoluto de todas las fases (migracion crea las tablas).
- T002 puede ejecutarse en paralelo con T001 (solo tipos TypeScript, no depende de DB).
- T003, T004, T005 deben ejecutarse en secuencia dentro de Phase A.
- T006, T008 pueden ejecutarse en paralelo una vez T001 y T002 esten listos.
- T007 requiere T003, T004, T006 completados.
- T009 requiere T007 completado.
- T010, T011, T012 son completamente independientes entre si — paralelizables desde que
  T001 y T002 esten listos (T011 y T012 solo modifican el editor existente).
- T013 requiere T001 y T002. T014 requiere T010 y T013.
- T015 requiere T001 y T002. T016, T017, T018 pueden ejecutarse en paralelo una vez T002
  este listo (son componentes UI puros con props mockeadas para desarrollo).
- T019 requiere T015, T016, T017, T018. T020 requiere T001 y T002.
- T021 requiere T001 y T002. T022 requiere T021. T023 requiere T022. T024 requiere T021.

## Agent Team Strategy

- **Agente 1 (DB + Backend)**: T001 -> T002 -> T003 -> T004 -> T005 -> T015 -> T020 -> T021
- **Agente 2 (Capacitacion UI)**: T006 (espera T002) -> T007 -> T008 -> T009
- **Agente 3 (Editor mejoras)**: T010 + T011 + T012 (en paralelo, solo requieren T002) -> T013 -> T014
- **Agente 4 (Analytics + Comunicacion UI)**: T016 + T017 + T018 (en paralelo, requieren T002) -> T019 -> T022 -> T023 -> T024
