# Tasks: Calendario Academico Integrado

**Input**: plan.md + spec.md
**Prerequisites**: 001-platform-foundation completo (auth, roles, modelo de materias y
matriculacion existentes); Supabase Realtime disponible en cliente existente;
spec 002-sync-videoconference deployado (para vincular eventos de clase a salas Daily.co)

**Tests**: Verificar propagacion Realtime < 5s; exportacion iCal importable en Google Calendar
sin errores; vista movil usable en 375px sin scroll horizontal.

## Format: `[ID] [P?] [Story] Description`
- P = paralelizable (puede ejecutarse concurrentemente con otras tareas P)
- Story = historia de usuario que sirve

---

## Phase A: Tabla y API de eventos

**Purpose**: Crear y leer eventos via API con datos correctos en DB y permisos por rol.

- [ ] T001 [US1] [US2] Crear migracion `supabase/migrations/20260322_006_academic_calendar.sql`:
      tabla `calendar_events` con enum de tipos (class/deadline/tutoring/exam), campos
      `live_session_id` nullable (FK a spec 002), `cancelled_at` para soft delete; RLS
      (SELECT por matricula/rol, INSERT/UPDATE/DELETE solo para docente asignado a `subject_id`);
      indices en `(subject_id, scheduled_at)` y `(teacher_id)`; trigger de notificacion in-app
      a estudiantes en INSERT/UPDATE
- [ ] T002 [P] [US1] Extender `apps/web/src/types/database.ts` con tipo `CalendarEvent`
- [ ] T003 [US1] [US2] Implementar `GET /api/calendar/events/route.ts` — retorna eventos del
      periodo `?from=ISO&to=ISO` filtrados por rol: estudiante ve solo sus materias, docente
      sus materias, admin todos
- [ ] T004 [US2] Implementar `POST /api/calendar/events/route.ts` — valida `scheduled_at`
      en UTC-5, `duration_minutes` entre 15-300, tipo valido, docente asignado a `subject_id`
- [ ] T005 [US2] Implementar `PATCH /api/calendar/events/[id]/route.ts` y
      `DELETE /api/calendar/events/[id]/route.ts` — actualizar con notificacion de cambio;
      soft delete con `cancelled_at = now()`
- [ ] T006 [US1] [US2] Implementar `features/calendar/queries.ts` —
      `getEventsForUser(userId, from, to)` y `getGlobalEvents()` (admin)

**Checkpoint**: Docente crea un evento via `POST /api/calendar/events`; estudiante matriculado
en esa materia puede leerlo via `GET`; estudiante de otra materia recibe 0 resultados;
docente de otra materia no puede hacer DELETE del evento.

---

## Phase B: Componentes de vista y propagacion Realtime

**Purpose**: Estudiante ve calendario semanal y mensual con todos sus eventos; cambios del
docente se reflejan en < 5 segundos.

- [ ] T007 [US1] [US2] Implementar `features/calendar/realtime.ts` — hook
      `useCalendarRealtime(subjectIds[])` suscrito a `calendar:${subjectId}` para
      INSERT/UPDATE/DELETE en `calendar_events`; fallback de refresco cada 60s
- [ ] T008 [P] [US1] Implementar `components/calendar/WeekView.tsx` — grid CSS 7 columnas
      x horas (8:00-22:00), eventos posicionados con `grid-row` calculado desde `scheduled_at`,
      colision de eventos en la misma hora mostrados en columnas paralelas; vista diaria/3 dias
      en movil via `use-mobile.ts`
- [ ] T009 [P] [US1] Implementar `components/calendar/MonthView.tsx` — grid 7 columnas x
      semanas del mes; pills de eventos por dia; "+N mas" con dialog al hacer click
- [ ] T010 [P] [US1] [US2] Implementar `components/calendar/CalendarEvent.tsx` — color por
      tipo (class=azul, deadline=rojo, tutoring=verde, exam=naranja); abre `EventDetail` al click
- [ ] T011 [P] [US1] [US2] Implementar `components/calendar/EventDetail.tsx` — dialog con
      titulo, materia, docente, tipo, hora, duracion; boton "Unirse a clase" si
      `videoconference_link` existe, texto "Sala pendiente" si no
- [ ] T012 [US2] Implementar `components/calendar/EventForm.tsx` — formulario docente para
      crear/editar eventos (tipo, materia, titulo, fecha/hora, duracion, descripcion);
      accesible al hacer click en celda vacia del calendario
- [ ] T013 [US1] [US2] Implementar `components/calendar/AcademicCalendar.tsx` — componente
      raiz con estado `view: 'week' | 'month'`, controles Semana/Mes/Hoy/navegacion,
      integra Realtime hook
- [ ] T014 [US1] [US2] [US3] Crear pagina `apps/web/src/app/calendario/page.tsx` —
      Server Component carga datos iniciales + hidratacion cliente para Realtime; agregar
      widget "Proximas clases" (3 eventos) en `dashboard/page.tsx` del estudiante y seccion
      en `teacher/page.tsx`; agregar enlace "Calendario" en `Sidebar.tsx`

**Checkpoint**: Docente crea un evento desde el calendario; en otro browser, estudiante
matriculado ve el evento aparecer sin recargar la pagina en < 5s; en movil 375px el
calendario no tiene scroll horizontal.

---

## Phase C: Exportacion iCal y recordatorios

**Purpose**: Admin puede exportar .ics para SENESCYT; estudiante recibe recordatorio
30 minutos antes de clase.

- [ ] T015 [US3] Implementar `features/calendar/ical.ts` — genera string iCal RFC 5545
      con `VCALENDAR`, `VEVENT` por cada evento; campos `UID`, `DTSTART`, `DTEND`,
      `SUMMARY`, `DESCRIPTION`, `URL`; timestamps en formato UTC
- [ ] T016 [US3] Implementar `GET /api/calendar/export/route.ts` — carga eventos del
      periodo `?from=ISO&to=ISO&subjectId=X`, genera .ics, retorna con headers
      `Content-Type: text/calendar` y `Content-Disposition: attachment; filename="calendario-itseia.ics"`
- [ ] T017 [P] [US1] Implementar recordatorio in-app: al cargar el calendario, el cliente
      programa `setTimeout` local para mostrar toast (usando `components/ui/sonner.tsx`) 30
      minutos antes de cada evento de clase de la semana visible
- [ ] T018 [P] [US3] Crear vista global de admin en `apps/web/src/app/admin/calendario/page.tsx`
      — renderiza `AcademicCalendar` sin filtro de materia, con filtros por programa y tipo
      de evento, y boton "Exportar iCal"

**Checkpoint**: Exportar .ics e importar en Google Calendar sin errores de formato; el
archivo contiene todos los eventos del periodo seleccionado; admin ve todos los eventos de
todos los programas en la vista global.

---

## Dependencies & Execution Order

- T001 y T002 son paralelos y bloqueantes para todo lo demas.
- T003-T006 dependen de T001 y son paralelos entre si.
- Phase B puede comenzar en cuanto T001-T002 esten listos.
- T007-T011 son paralelos entre si dentro de Phase B.
- T012 y T013 dependen de T007-T011 y van despues.
- T014 depende de T013 y puede incluir T018 (admin view) en paralelo.
- Phase C (T015-T018) es independiente de Phase B y puede ejecutarse en paralelo.

## Agent Team Strategy

- **Agente 1 (DB + API)**: T001 -> T003 + T004 + T005 + T006 (paralelo)
- **Agente 2 (Types + Realtime)**: T002 (paralelo con T001) -> T007
- **Agente 3 (Vistas calendario)**: T008 + T009 + T010 + T011 (paralelo) -> T012 -> T013 -> T014
- **Agente 4 (iCal + Admin)**: T015 -> T016 + T017 + T018 (paralelo)
