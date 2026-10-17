# Tasks: Videoconferencia Sincronica CES

**Input**: plan.md + spec.md
**Prerequisites**: 001-platform-foundation completo y desplegado (auth, roles, matriculacion,
paginas de sesion y panel docente existentes)

**Tests**: Incluir verificacion de permisos por rol (docente vs estudiante vs no matriculado)
y de integridad del webhook (HMAC, idempotencia).

## Format: `[ID] [P?] [Story] Description`
- P = paralelizable (puede ejecutarse concurrentemente con otras tareas P)
- Story = historia de usuario que sirve

---

## Phase A: Infraestructura Daily.co y tablas Supabase

**Purpose**: Poder crear una sala y que quede registrada en la DB, sin UI todavia.

- [ ] T001 [US1] Crear cuenta Daily.co, obtener API key y configurar variables de entorno
      `DAILY_API_KEY`, `DAILY_WEBHOOK_SECRET` y `NEXT_PUBLIC_DAILY_DOMAIN` en Vercel y `.env.local`
- [ ] T002 [P] [US1] Crear migracion `supabase/migrations/20260322_002_sync_videoconference.sql`
      con tablas `live_sessions`, `attendance`, `scheduled_classes` y sus RLS policies e indices
- [ ] T003 [P] [US1] Extender `apps/web/src/types/database.ts` con tipos `LiveSession`,
      `Attendance` y `ScheduledClass`
- [ ] T004 [US1] Implementar `POST /api/daily/create-room/route.ts` — llama Daily.co REST API,
      persiste resultado en `live_sessions`
- [ ] T005 [US1] Implementar `GET /api/sessions/[id]/live/route.ts` — retorna sala activa para
      la sesion y validar que el usuario autenticado tiene acceso a esa materia (RLS check)
- [ ] T006 [US1] Implementar `features/videoconference/actions.ts` con `createRoom(sessionId)`
      y `endRoom(liveSessionId)` como Server Actions

**Checkpoint**: `POST /api/daily/create-room` con un `sessionId` valido crea una sala en
Daily.co y persiste la fila en `live_sessions`; `GET /api/sessions/[id]/live` retorna la sala;
un usuario sin matricula recibe error 403.

---

## Phase B: Webhook de asistencia

**Purpose**: Registrar joined_at / left_at automaticamente sin intervencion humana.

- [ ] T007 [US1] Implementar `POST /api/daily/webhook/route.ts`:
      validacion HMAC de `X-Daily-Signature`, manejo de eventos `participant-joined`,
      `participant-left` (con calculo de `duration_seconds` y status present/partial/absent),
      `recording-ready` (actualiza `recording_url`); idempotencia via `ON CONFLICT`
- [ ] T008 [US1] Agregar logica de auto-cierre en el webhook: si `participant-left` deja sala
      con 0 participantes, programar cierre de sala a los 30 minutos via `setTimeout` o
      Supabase Edge Function

**Checkpoint**: Simular eventos webhook con curl firmado; verificar que `attendance` recibe
`joined_at`, `left_at`, `duration_seconds` y `status` correctos; duplicados no crean filas extra.

---

## Phase C: Componentes UI

**Purpose**: Docente inicia clase, estudiante se une, todo dentro de la plataforma.

- [ ] T009 [US1] [US2] Implementar `components/videoconference/JoinClassButton.tsx`:
      cuatro estados por rol y estado de sala (Iniciar / Unirse / Terminar / Ver Grabacion /
      Restringido); conectar con `createRoom` y `endRoom`
- [ ] T010 [US1] [US2] Implementar `components/videoconference/LiveClassRoom.tsx`:
      iframe Daily.co responsive (min 480px), controles de materia y duracion, boton "Salir"
      para estudiante y "Terminar Clase" para docente
- [ ] T011 [US1] [US2] Integrar `JoinClassButton` y `LiveClassRoom` en
      `apps/web/src/app/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx`
      como nuevo tab "Clase en Vivo"
- [ ] T012 [US2] Integrar panel "Sesion Sincronica" en
      `apps/web/src/app/teacher/materias/[id]/sesion/[num]/edit/page.tsx` con estado de sala
      activa, boton Iniciar y listado de asistencia post-clase

**Checkpoint**: Docente inicia clase desde su panel y estudiante matriculado se une desde la
pagina de sesion sin salir de la plataforma; estudiante de otra materia no ve el boton Unirse.

---

## Phase D: Reporte de cumplimiento 51%

**Purpose**: Admin puede ver y exportar la evidencia de sesiones sincronicas para CES.

- [ ] T013 [US3] Implementar seccion de cumplimiento 51% en
      `apps/web/src/app/admin/sesiones/page.tsx`: tabla por programa/materia con
      sesiones planificadas, sesiones con clase realizada y porcentaje; filas < 51% en rojo
- [ ] T014 [US3] Agregar boton "Exportar CSV" que genera archivo descargable con los datos
      del reporte para documentacion CES via `Blob + URL.createObjectURL`

**Checkpoint**: El reporte muestra datos reales de al menos una materia con clase sincronica
realizada; el CSV descargado contiene los mismos valores que la tabla.

---

## Dependencies & Execution Order

- Phase A es la base bloqueante — todas las demas dependen de ella.
- T002 y T003 son independientes entre si y pueden ejecutarse en paralelo dentro de Phase A.
- Phase B requiere que T004 (create-room) este listo para poder probar el flujo completo.
- Phase C puede comenzar en paralelo con Phase B siempre que T005 y T006 de Phase A esten listos.
- T009, T010, T011, T012 de Phase C son independientes entre si y paralelizables.
- Phase D es independiente de Phase C y puede ejecutarse en paralelo una vez Phase A este completa.

## Agent Team Strategy

- **Agente 1 (Infra)**: T001 -> T002 -> T004 -> T005 -> T006 -> T007 -> T008
- **Agente 2 (Types + UI base)**: T003 (en paralelo con T002) -> T009 -> T010
- **Agente 3 (Integracion UI)**: T011 + T012 (en paralelo, una vez T009 y T010 listos)
- **Agente 4 (Reportes)**: T013 -> T014 (en paralelo con Phase C, una vez Phase A lista)
