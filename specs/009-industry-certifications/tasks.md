# Tasks: Modulo de Certificaciones de Industria

**Input**: plan.md + spec.md
**Prerequisites**: Fase 3 de la plataforma completa y desplegada — sesiones con 7 tabs
operativas, QuizEngine funcional, AILabPanel con soporte de prompt contextual, portfolio del
estudiante existente, panel admin base en `apps/web/src/app/admin/`.

**Tests**: Verificar RLS (estudiante solo ve sus propios intentos y badges), que el endpoint
`start/route.ts` no retorna `respuesta_correcta` en el payload al cliente, flujo completo
de simulacro desde inicio hasta badge en portfolio.

## Format: `[ID] [P?] [Story] Description`
- P = paralelizable (puede ejecutarse concurrentemente con otras tareas P)
- Story = historia de usuario que sirve

---

## Phase A: Modelo de datos y contenido semilla

**Purpose**: Tablas operativas en Supabase con AWS Cloud Practitioner cargado. Sin UI todavia.

- [ ] T001 [US1] Crear migracion `supabase/migrations/20260322_009_industry_certifications.sql`
      con tablas `certification_programs`, `certification_domains`, `certification_sessions`,
      `certification_enrollments`, `exam_questions`, `exam_attempts`, `certification_badges`;
      incluir RLS policies (estudiante lee/escribe solo sus filas; admin lee todo; preguntas
      de examen solo visibles para matriculados sin exponer `respuesta_correcta` a cliente)
      e indices en `(user_id, certification_id)` para enrollments y attempts

- [ ] T002 [P] [US1] Extender `apps/web/src/types/database.ts` con los tipos
      `CertificationProgram`, `CertificationDomain`, `CertificationSession`,
      `CertificationEnrollment`, `ExamQuestion`, `ExamAttempt`, `CertificationBadge`

- [ ] T003 [P] [US1] Crear script de datos semilla (dentro de la migracion o en
      `supabase/seed/009_certifications.sql`) con AWS Cloud Practitioner completo:
      6 dominios con sus porcentajes, umbral 70%, estado activa, idioma ingles; vincular
      al menos 2 sessions existentes o nuevas por dominio con `type="certificacion"`

- [ ] T004 [US1] Implementar `apps/web/src/features/certifications/queries.ts` con funciones:
      `getCatalog()`, `getCertification(slug)`, `getStudentProgress(userId, certificationId)`,
      `getExamQuestions(certificationId, limit, domainId?)` — esta ultima NO incluye
      `respuesta_correcta` en el retorno al cliente

- [ ] T005 [US1] [US2] Implementar `apps/web/src/features/certifications/actions.ts` con
      Server Actions: `enrollCertification(certificationId)` con UPSERT,
      `startExam(certificationId)` que selecciona N preguntas aleatorias y crea el intento,
      `submitExam(attemptId, respuestas[])` que calcula score en servidor compara con
      `respuesta_correcta`, marca `aprobado` y dispara UPSERT de badge si pasa el umbral,
      `validateBadge(badgeId)` solo para rol admin

**Checkpoint**: Ejecutar migracion en Supabase local; insertar un intento de examen via
Server Action y verificar que `score_total` y `aprobado` se calculan correctamente; confirmar
que la consulta de preguntas para el cliente no contiene el campo `respuesta_correcta`.

---

## Phase B: Catalogo y flujo de estudio

**Purpose**: Estudiante puede navegar el catalogo, abrir una certificacion y estudiar sus
sesiones con los 7 tabs existentes.

- [ ] T006 [US1] Implementar `apps/web/src/components/certifications/CertificationCard.tsx`
      y `CertificationCatalog.tsx` — CertificationCard muestra logo del proveedor, nivel de
      dificultad con chip de color, costo examen, numero de dominios, barra de progreso si el
      estudiante ya inicio; CertificationCatalog es un grid responsivo con filtros por
      proveedor

- [ ] T007 [US1] Implementar `apps/web/src/app/certificaciones/page.tsx` que carga el
      catalogo via `getCatalog()` y renderiza `CertificationCatalog`; accesible para cualquier
      estudiante autenticado con matricula activa; agregar enlace en el menu lateral de la
      plataforma (sidebar navigation existente)

- [ ] T008 [US1] Implementar `apps/web/src/components/certifications/DomainList.tsx` y
      `apps/web/src/app/certificaciones/[slug]/page.tsx` — pagina de detalle con header de
      stats (dominios, horas, costo, umbral, idioma), acordeon de dominios con estado de
      sesiones, botones "Iniciar preparacion" / "Continuar" y "Modo Examen"; llamar
      `enrollCertification` al hacer click en "Iniciar preparacion" via UPSERT

- [ ] T009 [P] [US1] Modificar `apps/web/src/app/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx`
      para detectar `program.type === "certificacion"`: ajustar breadcrumb a
      "Certificaciones > [cert] > [dominio] > Sesion N" y pasar al `AILabPanel` el prompt
      contextual "Estoy preparando el examen [cert], dominio [dominio]. Ayudame con los
      conceptos de esta sesion." (FR-014)

- [ ] T010 [P] [US1] Implementar `POST apps/web/src/app/api/certifications/enroll/route.ts`
      como endpoint alternativo REST para el caso de que el Server Action no sea invocable
      desde el flujo de navegacion del catalogo; valida sesion Supabase del usuario y retorna
      el enrollment creado o existente

**Checkpoint**: Un estudiante autenticado puede abrir el catalogo, ver AWS Cloud Practitioner,
hacer click en "Iniciar preparacion", ser redirigido a la primera sesion del primer dominio
y ver los 7 tabs con el prompt de AI Lab contextualizado para la certificacion.

---

## Phase C: Modo Examen

**Purpose**: Estudiante puede rendir un simulacro cronometrado sin retroceder y ver resultados
con retroalimentacion completa por pregunta.

- [ ] T011 [US2] Implementar `apps/web/src/components/certifications/ExamSimulator.tsx`
      que envuelve la logica de `QuizEngine.tsx` con restricciones de modo examen: navegacion
      secuencial sin retroceso (boton Atras deshabilitado), sin feedback inmediato por
      pregunta, barra de progreso "Pregunta X de N", temporizador regresivo visible que al
      llegar a 0 llama `submitExam` automaticamente; pantalla de inicio con reglas antes de
      comenzar

- [ ] T012 [US2] Implementar `POST apps/web/src/app/api/certifications/exam/start/route.ts`
      que selecciona N preguntas aleatorias del banco (Fisher-Yates en el servidor), crea fila
      en `exam_attempts` con `started_at` y retorna las preguntas SIN el campo
      `respuesta_correcta`; y `POST .../exam/[attemptId]/submit/route.ts` que recibe las
      respuestas del cliente, las compara con `respuesta_correcta` en servidor, calcula
      `score_total` y `score_por_dominio`, actualiza `exam_attempts` y dispara UPSERT de
      badge si corresponde

- [ ] T013 [US2] Implementar `apps/web/src/app/certificaciones/[slug]/examen/page.tsx`
      que renderiza `ExamSimulator` solo para estudiantes autenticados y matriculados en la
      certificacion; al finalizar redirige a la pagina de resultados

- [ ] T014 [P] [US2] Implementar `apps/web/src/components/certifications/ExamResultsSummary.tsx`
      con puntaje total coloreado (verde si aprueba, rojo si no), tabla de puntaje por dominio,
      lista de preguntas con respuesta del estudiante (verde/rojo), respuesta correcta y
      explicacion; y `apps/web/src/app/certificaciones/[slug]/resultados/[attemptId]/page.tsx`
      que carga el intento y lo renderiza con `ExamResultsSummary`

- [ ] T015 [P] [US2] Implementar `apps/web/src/components/certifications/ExamHistoryChart.tsx`
      con grafico de linea (shadcn/ui Recharts o similar ya en el stack) mostrando la
      evolucion de puntajes de intentos anteriores del estudiante; integrar en la pagina de
      detalle de la certificacion debajo de `DomainList`

**Checkpoint**: Un estudiante puede iniciar el modo examen de AWS Cloud Practitioner, responder
preguntas sin poder retroceder, agotar el tiempo o terminar manualmente, y ver los resultados
con puntaje por dominio y explicaciones; confirmar que ninguna llamada de red expone
`respuesta_correcta` antes del submit.

---

## Phase D: Portfolio y reporte admin

**Purpose**: El logro es visible en el portfolio del estudiante y el admin puede generar
reportes B2B.

- [ ] T016 [US4] Implementar `apps/web/src/components/certifications/CertificationBadge.tsx`
      con logo del proveedor, nombre de la certificacion, chip de estado
      (`simulacro_aprobado` en amarillo, `certificado_oficial` en verde con fecha de
      validacion); incluir flujo de subida de evidencia: file picker que sube a Supabase
      Storage bucket `certification-evidence` y actualiza `evidencia_url` en el badge

- [ ] T017 [US4] Modificar `apps/web/src/app/portfolio/[userId]/page.tsx` para agregar
      seccion "Certificaciones" que fetcha `certification_badges` del usuario (solo
      `simulacro_aprobado` y `certificado_oficial`); la seccion es visible publicamente;
      renderizar cuadricula de `CertificationBadge`

- [ ] T018 [US3] Implementar `apps/web/src/app/admin/certificaciones/page.tsx`:
      tabla con metricas por certificacion (estudiantes activos, progreso promedio, simulacros
      aprobados), boton "Ver detalle" con tabla de estudiantes individuales, boton
      "Exportar CSV" via `Blob + URL.createObjectURL`, botones de gestion de estado
      (Actualizacion pendiente / Archivar) que llaman `updateCertificationStatus` Server Action

- [ ] T019 [US4] Implementar `POST apps/web/src/app/api/certifications/badge/validate/route.ts`
      solo para rol admin: actualiza `certification_badges.estado` a `certificado_oficial`
      con `validado_por` (admin user_id) y `validado_at`; agregar en panel admin el boton
      "Validar certificado" en la vista de detalle del estudiante que llama este endpoint

**Checkpoint**: Un estudiante que aprueba un simulacro ve el badge `simulacro_aprobado` en
su portfolio en menos de 60 segundos (SC-006); el admin puede ver el reporte de todos los
estudiantes de AWS Cloud Practitioner y exportar el CSV con datos correctos.

---

## Dependencies & Execution Order

- Phase A es la base bloqueante — T001, T002, T003 pueden correr en paralelo entre si; T004
  y T005 requieren T001 y T002 completos.
- Phase B requiere Phase A completa. T006, T007, T008 son secuenciales entre si. T009 y T010
  son independientes entre si y pueden correr en paralelo con T006/T007/T008.
- Phase C requiere T005 (Server Actions) y T008 (pagina de detalle de certificacion).
  T011, T012, T013 son secuenciales. T014 y T015 son independientes entre si y paralelizables
  una vez T012 este listo.
- Phase D es independiente de Phase C en lo que respecta a badges (T016, T017) pero T019
  requiere que los badges existan en la DB (T005 dispara el UPSERT de badge). T018 solo
  requiere Phase A completa.

## Agent Team Strategy

- **Agente 1 (Data)**: T001 -> T002 -> T003 -> T004 -> T005
- **Agente 2 (Catalog UI)**: T002 (en paralelo con Agente 1 post-T001) -> T006 -> T007 -> T008
- **Agente 3 (Session + API)**: T009 + T010 (en paralelo con Agente 2, post-Phase A)
- **Agente 4 (Exam)**: T011 -> T012 -> T013; T014 + T015 en paralelo post-T012
- **Agente 5 (Portfolio + Admin)**: T016 + T017 en paralelo -> T018 -> T019
