# Implementation Plan: Calendario Academico Integrado

**Branch**: `006-academic-calendar` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)

## Summary

Construir un calendario academico integrado con React puro (sin libreria de calendario externa),
con vistas semanal y mensual, codificacion de eventos por color, propagacion en tiempo real
de eventos docente a estudiantes via Supabase Realtime, exportacion iCal y recordatorios
in-app. El calendario conecta con la infraestructura de videoconferencia de spec 002 y es
la evidencia de planificacion sistematica que el CES solicita para aprobar la modalidad en linea.

## Technical Context

**Language/Version**: TypeScript 5.x
**Framework**: Next.js 15 App Router — app existente en `apps/web/`
**CSS**: Tailwind CSS 4 + shadcn/ui (`components/ui/dialog.tsx`, `components/ui/badge.tsx`
ya disponibles)
**DB**: Supabase PostgreSQL + Supabase Realtime (propagacion < 5s de eventos docente)
**Auth**: Supabase Auth (operativo)
**Deploy**: Vercel (tecnologico.itseia.ai)
**Dependencias nuevas**: ninguna — calendario implementado con React + date math nativo
(sin FullCalendar, sin react-big-calendar). `date-fns` es probable que ya este en el proyecto
como dependencia transitiva; si no, se usa logica de fecha nativa (iso strings + Date objects).
**Relacion con otros specs**: los eventos de tipo `class` referencian `live_sessions` y
`scheduled_classes` del spec 002. El boton "Unirse a clase" en el evento del calendario
navega a la sala Daily.co creada en spec 002.
**Paginas existentes relevantes**:
- `apps/web/src/app/dashboard/page.tsx` — dashboard estudiante donde se puede agregar widget del calendario
- `apps/web/src/app/teacher/page.tsx` — dashboard docente
- `apps/web/src/components/layout/Sidebar.tsx` — agregar enlace Calendario
- `apps/web/src/types/database.ts` — tipos a extender

## Constitution Check

1. **Problema institucional**: CES exige planificacion documentada y visible de sesiones
   sincronicas para modalidad en linea (Reglamento IST RPC-SE-04-No.012-2023). Un calendario
   integrado a la DB es la unica forma de demostrar planificacion activa y actualizada.
2. **Roles afectados**: estudiante (ve eventos de sus materias, solo lectura), docente (crea,
   edita y cancela eventos de sus materias), admin/coordinacion academica (vista global de
   todos los programas, exportacion para SENESCYT).
3. **Datos, permisos y riesgos**: tabla `calendar_events` con RLS por `subject_id` y rol.
   Riesgo: docente crea evento en materia que no le corresponde — mitigar verificando
   `teacher_id = auth.uid()` en INSERT policy. Riesgo: evento sin sala vinculada muestra
   link roto — mitigar mostrando "Sala pendiente" en lugar de link.
4. **Verificacion de exito**: test de propagacion (docente crea evento, estudiante en otro
   browser ve el evento dentro de 5s). Test de exportacion iCal: importar .ics en Google
   Calendar sin errores. Test movil: calendario usable en 375px sin scroll horizontal.
5. **Slice minimo util**: vistas semanal/mensual + creacion de eventos docente + propagacion
   Realtime + exportacion iCal. Recordatorio in-app (FR-008) se incluye en Phase C como
   funcionalidad que reutiliza la infraestructura de notificaciones de spec 003.
6. **CES Compliance (Principio VI)**: el calendario integrado es el artefacto que evidencia
   planificacion sistematica de sesiones sincronicas. El historial de eventos es evidencia
   para SENESCYT (FR-010 — almacenar por minimo 1 periodo academico).
7. **AI-First (Principio VII)**: no aplica en este spec — un calendario es una vista de datos
   estructurados. No se justifica complejidad AI para este componente. El vinculo con salas
   Daily.co (spec 002) es la "AI-first" integration en la capa de delivery.
8. **Calidad de contenido (Principio VIII)**: no aplica directamente. Los eventos de clase
   sincronica en el calendario referencian sesiones que si deben cumplir el estandar de
   contenido del Principio VIII.

## Project Structure

### Documentacion

```text
specs/006-academic-calendar/
├── plan.md          (este archivo)
└── spec.md
```

### Codigo fuente — archivos nuevos

```text
apps/web/src/
├── app/
│   ├── calendario/
│   │   └── page.tsx            — pagina principal del calendario (estudiante/docente)
│   └── api/
│       └── calendar/
│           ├── events/route.ts          — GET: lista eventos por rol/periodo; POST: crea evento
│           ├── events/[id]/route.ts     — PATCH: edita evento; DELETE: cancela evento
│           └── export/route.ts          — GET: genera archivo .ics del periodo seleccionado
├── components/
│   └── calendar/
│       ├── AcademicCalendar.tsx    — componente raiz: controla vista y estado de fecha activa
│       ├── WeekView.tsx            — rejilla de 7 columnas x horas del dia, eventos posicionados
│       ├── MonthView.tsx           — rejilla de 5-6 semanas, eventos como pills en cada dia
│       ├── CalendarEvent.tsx       — pill/card de evento con color por tipo y acciones
│       ├── EventDetail.tsx         — dialog con detalle completo del evento al hacer click
│       └── EventForm.tsx           — formulario de creacion/edicion de evento (solo docente)
└── features/
    └── calendar/
        ├── actions.ts              — Server Actions: createEvent, updateEvent, deleteEvent
        ├── queries.ts              — getEventsForUser(userId, from, to), getGlobalEvents()
        ├── realtime.ts             — hook useCalendarRealtime(subjectIds[]) con Supabase
        └── ical.ts                 — genera string iCal RFC 5545 desde array de eventos
```

### Codigo fuente — archivos modificados

```text
apps/web/src/
├── app/dashboard/page.tsx
│     — agregar widget "Proximas clases" (next 3 eventos del usuario)
├── app/teacher/page.tsx
│     — agregar seccion "Mi agenda" con link al calendario
├── app/admin/page.tsx (o nueva app/admin/calendario/page.tsx)
│     — agregar vista global de calendario con filtros y exportacion
├── components/layout/Sidebar.tsx
│     — agregar enlace "Calendario" con icono en navegacion principal
└── types/database.ts
      — agregar tipo CalendarEvent
```

### Base de datos — migraciones nuevas

```text
supabase/migrations/
└── 20260322_006_academic_calendar.sql
    — CREATE TABLE calendar_events
    — RLS policies: SELECT por matricula/rol, INSERT/UPDATE/DELETE para docente de la materia
    — Index: calendar_events(subject_id, scheduled_at), calendar_events(teacher_id)
    — Trigger: on INSERT/UPDATE -> notificacion in-app a estudiantes de la materia
```

## Implementation Phases

### Phase A: Tabla y API de eventos

**Objetivo**: crear y leer eventos via API; datos correctos en DB.

- Crear migracion con tabla `calendar_events`:
  - `id`, `type` (enum: class/deadline/tutoring/exam), `subject_id` (FK, nullable para
    eventos institucionales), `teacher_id` (FK users), `title`, `scheduled_at` (timestamptz),
    `duration_minutes` (int), `description` (text), `videoconference_link` (text, nullable),
    `live_session_id` (FK live_sessions, nullable — vinculo con spec 002), `created_by` (FK),
    `cancelled_at` (timestamptz, nullable — soft delete), `created_at`.
  - RLS SELECT: estudiante matriculado en `subject_id` puede ver eventos de sus materias.
    Docente puede ver eventos de sus materias. Admin puede ver todos.
  - RLS INSERT: `teacher_id = auth.uid()` y docente asignado a `subject_id`.
  - RLS UPDATE/DELETE: mismo que INSERT.
- Implementar `GET /api/calendar/events?from=ISO&to=ISO`: retorna eventos del periodo para
  el usuario autenticado segun su rol. Para estudiante: solo materias en que esta matriculado.
  Para docente: sus materias. Para admin: todos.
- Implementar `POST /api/calendar/events`: valida `scheduled_at` en UTC-5, `duration_minutes`
  entre 15-300, `type` valido, docente asignado a `subject_id`. Inserta y retorna evento.
- Implementar `PATCH /api/calendar/events/[id]`: actualiza campos; si `scheduled_at` cambia,
  crea notificacion de cambio. `DELETE /api/calendar/events/[id]`: soft delete con
  `cancelled_at = now()`.
- Implementar `features/calendar/queries.ts`: `getEventsForUser`, `getGlobalEvents` (admin).

### Phase B: Componentes de vista y propagacion Realtime

**Objetivo**: estudiante ve su calendario semanal y mensual con todos los eventos de sus
materias. Cambios del docente se reflejan en < 5s.

- Implementar `features/calendar/realtime.ts`:
  - Hook `useCalendarRealtime(subjectIds: string[])` suscrito al canal
    `calendar:${subjectId}` para INSERT/UPDATE/DELETE en `calendar_events`.
  - Actualiza el estado local del calendario sin refresco de pagina.
- Implementar `AcademicCalendar.tsx`:
  - Estado: `view: 'week' | 'month'`, `activeDate: Date`, `events: CalendarEvent[]`.
  - Controles: botones Semana/Mes, navegacion anterior/siguiente, boton "Hoy".
  - En movil (< 768px): vista diaria o de 3 dias en lugar de semana completa (detectar con
    `use-mobile.ts` ya disponible en `apps/web/src/hooks/use-mobile.ts`).
- Implementar `WeekView.tsx`:
  - Grid CSS de 7 columnas x filas de hora (8:00 - 22:00, bandas de 30 min).
  - Eventos posicionados con `grid-row` calculado desde `scheduled_at.getHours()`.
  - Colision de eventos en la misma hora: mostrar lado a lado con ancho reducido.
- Implementar `MonthView.tsx`:
  - Grid de 7 columnas x semanas del mes. Cada celda muestra pills de eventos del dia.
  - Si > 3 eventos en un dia: mostrar "+N mas" con dialog al hacer click.
- Implementar `CalendarEvent.tsx`:
  - Color por tipo: class = `bg-blue-500`, deadline = `bg-red-500`, tutoring = `bg-green-500`,
    exam = `bg-orange-500`.
  - Al click: abre `EventDetail` con dialog.
- Implementar `EventDetail.tsx`:
  - Muestra: titulo, materia, docente, tipo, hora, duracion.
  - Si tipo = class y `videoconference_link` existe: boton "Unirse a clase".
  - Si tipo = class y `videoconference_link` es null: texto "Sala pendiente de activacion".
- Implementar `EventForm.tsx` (solo docente):
  - Campos: tipo (select), materia (select de materias asignadas al docente), titulo,
    fecha y hora (datetime-local), duracion (minutos), descripcion.
  - Accesible desde boton "Nueva clase" en la vista del docente y al hacer click en
    una celda vacia del calendario.
- Pagina `app/calendario/page.tsx`: renderiza `AcademicCalendar` con datos cargados via
  Server Component + hidratacion cliente para Realtime.

### Phase C: Exportacion iCal y recordatorios

**Objetivo**: admin puede exportar .ics; estudiante recibe recordatorio 30 min antes de clase.

- Implementar `features/calendar/ical.ts`:
  - Genera string iCal RFC 5545 con `VCALENDAR`, `VEVENT` por cada evento.
  - Campos obligatorios: `UID`, `DTSTART`, `DTEND`, `SUMMARY`, `DESCRIPTION`, `URL`.
  - Todos los timestamps en formato `YYYYMMDDTHHMMSS` UTC.
- Implementar `GET /api/calendar/export?from=ISO&to=ISO&subjectId=X` (opcional subjectId):
  - Carga eventos del periodo, genera .ics, retorna con headers
    `Content-Type: text/calendar` y `Content-Disposition: attachment; filename="calendario-itseia.ics"`.
- Agregar boton "Exportar iCal" en la vista del admin y en el header del calendario del estudiante.
- Recordatorios in-app (FR-008):
  - Supabase Edge Function (cron) que se ejecuta cada 30 minutos, busca eventos con
    `scheduled_at BETWEEN now() + 25min AND now() + 35min`, crea notificacion in-app
    para cada estudiante matriculado.
  - Alternativamente: la primera vez que el estudiante carga el calendario, el cliente
    programa un `setTimeout` local para mostrar un toast 30 min antes de cada evento
    de la semana visible. Mas simple y sin costo de Edge Function.
  - Implementar la version cliente (setTimeout + toast Sonner `components/ui/sonner.tsx`)
    para el MVP; diferir Edge Function a cuando se tenga feedback de uso.
- Vista global admin: nueva seccion en `admin/` o nueva pagina `admin/calendario/` que
  renderiza `AcademicCalendar` con todos los eventos sin filtro de materia, con filtros
  adicionales por programa y tipo, y boton "Exportar iCal".

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Implementacion custom de WeekView/MonthView | Sin dependencias externas pesadas | react-big-calendar (100KB+) o FullCalendar (~$0 pero 150KB) agregan peso y opiniones de estilo incompatibles con Tailwind. La logica de grid es ~ 200 lineas de CSS/TS — manejable |

El calendario custom no supera 400 lineas entre WeekView y MonthView. Es la opcion mas
simple que cumple los requisitos responsive y de accesibilidad del proyecto.

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Colision de eventos en WeekView (dos clases a la misma hora) | Media | Bajo | Mostrar eventos en columnas paralelas dentro de la celda de hora — implementar en Phase B |
| iCal generado no compatible con todos los clientes de calendario | Baja | Medio | Validar .ics contra RFC 5545 con herramienta online antes de release; probar en Google Calendar |
| Docente crea muchos eventos a futuro — tabla crece rapido | Baja | Bajo | Indices en `scheduled_at`; queries siempre con rango de fechas acotado (max 6 meses) |
| Recordatorio setTimeout perdido si usuario cierra el browser | Alta | Bajo | El recordatorio es bonus — el estudiante ya tiene la informacion en el calendario. No es bloqueante |
| Sincronizacion Realtime no llega si Supabase tiene lag | Baja | Bajo | Refresco automatico del calendario cada 60s como fallback |

## Environment Variables Required

Ninguna adicional. Usa las variables Supabase ya configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
