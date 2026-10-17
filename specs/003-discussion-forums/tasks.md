# Tasks: Foros de Discusion por Materia

**Input**: plan.md + spec.md
**Prerequisites**: 001-platform-foundation completo (auth, roles, modelo de materias y
matriculacion operativos; paginas de materia para estudiante y docente existentes)

**Tests**: Verificar acceso cross-materia (RLS), moderacion por rol y entrega Realtime < 2s.

## Format: `[ID] [P?] [Story] Description`
- P = paralelizable (puede ejecutarse concurrentemente con otras tareas P)
- Story = historia de usuario que sirve

---

## Phase A: Tablas Supabase y API REST

**Purpose**: Crear y leer posts via API con control de permisos correcto, sin Realtime ni UI.

- [ ] T001 [US1] [US2] Crear migracion `supabase/migrations/20260322_003_discussion_forums.sql`
      con tablas `forum_posts`, `forum_replies`, `forum_notifications`, RLS policies por
      `subject_id` (SELECT/INSERT por matricula, DELETE por ownership o rol docente/admin),
      indices en `forum_posts(subject_id, created_at)` y `forum_replies(post_id)`
- [ ] T002 [P] [US1] [US2] Extender `apps/web/src/types/database.ts` con tipos `ForumPost`
      y `ForumReply`
- [ ] T003 [US1] Implementar `GET /api/forums/[subjectId]/posts/route.ts` — retorna posts
      ordenados por `is_pinned DESC, created_at DESC` con replies anidadas
- [ ] T004 [US1] Implementar `POST /api/forums/[subjectId]/posts/route.ts` — valida contenido
      no vacio (max 5000 chars), inserta post y crea notificacion en `forum_notifications` para
      el docente asignado
- [ ] T005 [US2] Implementar `DELETE /api/forums/[subjectId]/posts/[postId]/route.ts` —
      verifica ownership o rol docente/admin antes de eliminar
- [ ] T006 [US2] Implementar `PATCH /api/forums/[subjectId]/posts/[postId]/pin/route.ts` —
      solo docente/admin pueden fijar/desfijar
- [ ] T007 [US1] Implementar endpoints de replies:
      `GET` y `POST` en `api/forums/[subjectId]/posts/[postId]/replies/route.ts`

**Checkpoint**: Un usuario matriculado puede crear y leer posts via curl; un usuario sin
matricula recibe 0 rows/403; docente puede fijar y eliminar cualquier post; estudiante solo
puede eliminar el propio.

---

## Phase B: Realtime y componentes UI

**Purpose**: Mensajes aparecen en < 2 segundos sin recargar pagina; UI completa por rol.

- [ ] T008 [US1] Implementar `features/forums/realtime.ts` — hook `useForumRealtime(subjectId)`
      suscrito al canal Supabase Realtime `forum:${subjectId}` para INSERT en `forum_posts` y
      `forum_replies`; reconnect automatico en caso de drop
- [ ] T009 [P] [US1] [US2] Implementar `components/forums/ForumComposer.tsx` — Textarea
      controlado, contador de caracteres, boton "Publicar" deshabilitado si vacio, loading state
- [ ] T010 [P] [US1] [US2] Implementar `components/forums/ForumPost.tsx` — Avatar, nombre,
      timestamp UTC-5, contenido, acciones contextuales por rol (Fijar/Eliminar para docente,
      Eliminar propio para estudiante), Badge "Fijado", boton Responder que abre ForumComposer
- [ ] T011 [P] [US1] Implementar `components/forums/ForumReply.tsx` — version simplificada
      de ForumPost sin replies anidadas
- [ ] T012 [US1] [US2] Implementar `components/forums/ForumThread.tsx` — lista paginada
      (20 por pagina), posts fijados al tope, buscador por palabra clave con `ilike`
- [ ] T013 [US1] [US2] Integrar `ForumThread` como tab "Foro" en la pagina de materia del
      estudiante (`app/carreras/[slug]/materia/[subjectSlug]/page.tsx`) y en el panel docente
      (`app/teacher/materias/[id]/page.tsx`)

**Checkpoint**: Dos browsers con usuarios distintos de la misma materia — mensaje publicado
en uno aparece en el otro en < 2s sin recargar; estudiante de otra materia no ve el foro.

---

## Phase C: Notificaciones in-app y metricas admin

**Purpose**: Docente ve badge de actividad; admin tiene datos exportables para SENESCYT.

- [ ] T014 [US2] Implementar badge de notificaciones no leidas en el sidebar del docente
      consultando `forum_notifications WHERE read = false`; click navega al foro correspondiente
- [ ] T015 [US3] Implementar `features/forums/queries.ts` — funcion `getForumMetrics(subjectId)`:
      total posts, participantes unicos (`COUNT DISTINCT user_id`), ultimo post at, tasa de
      participacion (participantes / total matriculados), flag "Foro inactivo" si ultimo post
      > 7 dias
- [ ] T016 [US3] Agregar seccion "Participacion en Foros" en `apps/web/src/app/admin/page.tsx`
      con tabla de metricas por materia activa y boton "Exportar CSV"

**Checkpoint**: Admin ve metricas reales de al menos una materia con actividad; el CSV
descargado incluye tasa de participacion y flag de inactividad; docente ve badge con conteo
correcto de notificaciones no leidas.

---

## Dependencies & Execution Order

- Phase A es bloqueante — ninguna otra fase puede comenzar sin las tablas y la API.
- T001 y T002 son independientes y pueden ejecutarse en paralelo.
- T003 a T007 dependen de T001 y pueden ejecutarse en paralelo entre si.
- En Phase B: T008 (Realtime hook) puede desarrollarse en paralelo con T009-T011 (componentes
  atomicos); T012 y T013 dependen de T008-T011 y deben ir despues.
- Phase C puede ejecutarse en paralelo con Phase B una vez T001 este completo.

## Agent Team Strategy

- **Agente 1 (DB + API)**: T001 -> T003 -> T004 -> T005 -> T006 -> T007
- **Agente 2 (Types + Realtime)**: T002 (paralelo con T001) -> T008
- **Agente 3 (Componentes UI)**: T009 + T010 + T011 (en paralelo, una vez T001 listo) -> T012 -> T013
- **Agente 4 (Admin + Notificaciones)**: T014 + T015 (en paralelo con Phase B) -> T016
