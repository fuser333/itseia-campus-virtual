# Implementation Plan: Videoconferencia Sincronica CES

**Branch**: `002-sync-videoconference` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)

## Summary

Integrar Daily.co como proveedor de videoconferencia embebida dentro de la plataforma ITSEIA,
con creacion automatica de salas por sesion academica, grabacion en nube y registro de
asistencia via webhooks. Este modulo satisface el requisito CES del 51% de creditos
sincronicos verificables (Art. 57 y 61 RRA 2022) y es el prerequisito tecnico directo para
los specs 007-attendance-tracking y 006-academic-calendar.

## Technical Context

**Language/Version**: TypeScript 5.x
**Framework**: Next.js 15 App Router — app existente en `apps/web/`
**CSS**: Tailwind CSS 4 + shadcn/ui
**DB**: Supabase PostgreSQL (proyecto: wqlselfapnggxxeziruo) + Supabase Realtime
**Auth**: Supabase Auth (operativo, RLS activo)
**Deploy**: Vercel (tecnologico.itseia.ai)
**Proveedor video**: Daily.co REST API + Daily.co iframe embed
**Dependencias nuevas**: `@daily-co/daily-js` (SDK cliente para control del iframe)
**Dependencias externas**: ninguna adicional en servidor (llamadas REST directas)
**Constraint presupuesto**: Daily.co free tier cubre 2,000 min/mes — suficiente para piloto.
Costo de grabacion: Daily.co cobra por minuto de grabacion almacenada; evaluar al escalar.
**Paginas existentes relevantes**:
- `apps/web/src/app/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx` — pagina de sesion donde se embebe la sala
- `apps/web/src/app/teacher/materias/[id]/sesion/[num]/edit/page.tsx` — panel de edicion de sesion para docente
- `apps/web/src/types/database.ts` — tipos Supabase a extender

## Constitution Check

1. **Problema institucional**: Requisito CES Art. 57 y 61 RRA 2022 — 51% de creditos sincronicos
   verificables. Sin esto el expediente CES queda bloqueado. Mapeado en `docs/ces_aprobacion/`.
2. **Roles afectados**: docente (inicia/termina clase), estudiante (se une), super admin y
   coordinacion academica (reporte de cumplimiento 51%).
3. **Datos, permisos y riesgos**: nuevas tablas `live_sessions`, `attendance`, `scheduled_classes`
   con RLS estricto por materia. Riesgo: webhook Daily.co no autenticado — mitigar con
   secret header validation. Riesgo: grabaciones son PII derivada — Daily.co cloud,
   acceso solo via URL firmada desde sesion autenticada.
4. **Verificacion de exito**: test de integracion con sala real (docente crea, estudiante
   entra, webhook llega, asistencia queda en DB). Smoke test: boton "Iniciar Clase" visible
   solo para docente asignado, invisible para estudiante de otra materia.
5. **Slice minimo util**: sala embebida + asistencia automatica + grabacion accesible. El
   calendario de sesiones (User Story 4) se comparte con spec 006 y se implementa ahi.
6. **CES Compliance (Principio VI)**: este spec es el corazon del requisito de 51% sincronico.
   Genera la evidencia auditable que SENESCYT solicita.
7. **AI-First (Principio VII)**: videoconferencia via API embebida (Daily.co), no link externo.
   Cumple el mandato de la Constitution. Transcripcion IA diferida a Fase 4.
8. **Calidad de contenido (Principio VIII)**: no aplica directamente — este spec es
   infraestructura de entrega, no contenido academico.

## Project Structure

### Documentacion

```text
specs/002-sync-videoconference/
├── plan.md          (este archivo)
└── spec.md
```

### Codigo fuente — archivos nuevos

```text
apps/web/src/
├── app/
│   └── api/
│       ├── daily/
│       │   ├── create-room/route.ts       — POST: crea sala Daily.co, guarda en live_sessions
│       │   └── webhook/route.ts           — POST: recibe eventos participant-joined/left
│       └── sessions/[id]/
│           └── live/route.ts             — GET: consulta sala activa de una sesion
├── components/
│   └── videoconference/
│       ├── LiveClassRoom.tsx             — iframe Daily.co + controles docente/estudiante
│       └── JoinClassButton.tsx           — boton contextual (Iniciar / Unirse / Ver grabacion)
└── features/
    └── videoconference/
        ├── actions.ts                    — Server Actions: createRoom, endRoom
        └── queries.ts                    — consultas Supabase: getLiveSession, getAttendance
```

### Codigo fuente — archivos modificados

```text
apps/web/src/
├── app/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx
│     — agregar tab "Clase en Vivo" con JoinClassButton / LiveClassRoom
├── app/teacher/materias/[id]/sesion/[num]/edit/page.tsx
│     — agregar panel "Sesion Sincronica" con boton Iniciar Clase y listado de asistencia
├── app/admin/sesiones/page.tsx
│     — agregar reporte de cumplimiento 51% sincronico
└── types/database.ts
│     — agregar tipos LiveSession, Attendance, ScheduledClass
```

### Base de datos — migraciones nuevas

```text
supabase/migrations/
└── 20260322_002_sync_videoconference.sql
    — CREATE TABLE live_sessions
    — CREATE TABLE attendance
    — CREATE TABLE scheduled_classes
    — RLS policies para cada tabla
    — Indexes: live_sessions(session_id), attendance(live_session_id, user_id)
```

## Implementation Phases

### Phase A: Infraestructura Daily.co y tablas Supabase

**Objetivo**: poder crear una sala y que quede registrada en la DB. Sin UI todavia.

- Crear cuenta Daily.co y obtener API key (variable de entorno `DAILY_API_KEY`).
- Crear migracion `20260322_002_sync_videoconference.sql` con las tres tablas y RLS.
  - `live_sessions`: `id`, `session_id` (FK a sesiones academicas), `daily_room_name`,
    `daily_room_url`, `started_at`, `ended_at`, `recording_url`, `created_by` (FK users),
    `planned_duration_minutes`.
  - `attendance`: `id`, `live_session_id` (FK), `user_id` (FK), `joined_at`, `left_at`,
    `duration_seconds`, `status` (present/partial/absent), `is_manual_override`,
    `override_reason`.
  - `scheduled_classes`: `id`, `subject_id` (FK), `session_id` (FK, nullable),
    `teacher_id` (FK users), `scheduled_at`, `duration_minutes`, `title`, `created_at`.
- Implementar `POST /api/daily/create-room` — llama `POST https://api.daily.co/v1/rooms`
  con `privacy: private`, `exp` de 4h, y persiste el resultado en `live_sessions`.
- Implementar `GET /api/sessions/[id]/live` — retorna sala activa para esa sesion si existe.
- Implementar `features/videoconference/actions.ts`: `createRoom(sessionId)` y `endRoom(liveSessionId)`.
- Configurar secreto webhook en Daily.co y validar `X-Daily-Signature` en el endpoint.

### Phase B: Webhook de asistencia

**Objetivo**: registrar joined_at / left_at automaticamente sin intervencion humana.

- Implementar `POST /api/daily/webhook`:
  - Evento `participant-joined`: insertar o actualizar fila en `attendance` con `joined_at`.
  - Evento `participant-left`: actualizar fila con `left_at`, calcular `duration_seconds`,
    asignar `status` segun regla: present (>=60% planned_duration), partial (10-60%),
    absent (<10%).
  - Idempotencia: usar `ON CONFLICT (live_session_id, user_id, joined_at)` para ignorar
    duplicados de webhook.
  - Filtro: solo registrar asistencia de `user_id` que exista en la matriculacion de esa
    materia (query a enrollments).
- Evento `recording-ready`: actualizar `live_sessions.recording_url` con la URL de Daily.co.
- Auto-cierre: si `participant-left` deja sala con 0 participantes, schedule cierre en 30
  minutos via `setTimeout` en el proceso Vercel (o via Supabase Edge Function).

### Phase C: Componentes UI

**Objetivo**: docente puede iniciar clase, estudiante puede unirse, todo dentro de la plataforma.

- Implementar `JoinClassButton.tsx`:
  - Rol docente + sala no activa: muestra boton "Iniciar Clase" que llama `createRoom`.
  - Rol docente + sala activa: muestra botones "Unirse" y "Terminar Clase".
  - Rol estudiante + sala activa: muestra boton "Unirse a Clase".
  - Sala terminada con grabacion: muestra "Ver Grabacion" con link a `recording_url`.
  - Estudiante no matriculado: muestra mensaje de restriccion, sin boton.
- Implementar `LiveClassRoom.tsx`:
  - `<iframe src={daily_room_url} allow="camera; microphone; fullscreen" />` con altura
    responsiva (min 480px).
  - Controles encima del iframe: nombre de materia, docente, duracion transcurrida.
  - Boton "Salir de la clase" para estudiante (sale del iframe, no termina la sala).
  - Boton "Terminar Clase" para docente (llama `endRoom`, sala se cierra para todos).
- Integrar en `sesion/[num]/page.tsx`: agregar tab "Clase en Vivo" que renderiza
  `JoinClassButton` y condicionalmente `LiveClassRoom`.
- Integrar en `teacher/materias/[id]/sesion/[num]/edit/page.tsx`: seccion lateral con
  estado de sala activa, boton Iniciar y listado de asistencia post-clase.

### Phase D: Reporte de cumplimiento 51%

**Objetivo**: admin puede ver y exportar la evidencia de sesiones sincronicas.

- Agregar seccion en `admin/sesiones/page.tsx`: tabla por programa/materia con columnas:
  total sesiones planificadas, sesiones con clase sincronica realizada, porcentaje.
- Calcular porcentaje: `COUNT(live_sessions con ended_at) / COUNT(scheduled_classes)`.
- Materias con porcentaje < 51%: resaltar en rojo con etiqueta "Requiere atencion".
- Boton "Exportar CSV": genera archivo con los mismos datos para documentacion CES.
- Implementar `GET /api/sessions/[id]/live` extendido para listar historial de salas
  por sesion (grabaciones pasadas accesibles desde la pagina de la sesion).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Dependencia externa Daily.co | WebRTC propio requeriria servidor de senalizacion (STUN/TURN) — $150+/mes adicionales y semanas de desarrollo | La Constitution Principio VII exige video embebido via API |
| Webhook endpoint publico | Daily.co necesita endpoint para notificar eventos; no hay alternativa con polling que sea confiable para asistencia | Polling cada 5s saturaria la DB y no garantizaria precision de timestamps |
| SDK cliente `@daily-co/daily-js` | Necesario para controlar el iframe (mute, leave, end) desde React sin recargar pagina | El iframe solo sin SDK no permite ejecutar acciones programaticas |

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Webhook Daily.co no llega (timeout Vercel) | Media | Alto | Verificar que el endpoint responde en <3s; diferir procesamiento pesado a cola si necesario |
| Daily.co free tier agotado en piloto intensivo | Baja | Medio | Monitorear minutos consumidos; plan Developer ($0.004/min grabacion) disponible |
| Grabacion no disponible inmediatamente post-clase | Alta | Bajo | Mostrar "Grabacion procesando..." con polling cada 2 min hasta que `recording_url` no sea null |
| Docente olvida terminar sala (costo grabacion acumulado) | Media | Medio | Auto-cierre a los 30 min sin participantes (webhook `participant-left` con sala vacia) |
| RLS mal configurado — estudiante accede a sala de otra materia | Baja | Critico | Test de seguridad obligatorio: intentar GET /api/sessions/[id]/live con user sin matricula |

## Environment Variables Required

```bash
DAILY_API_KEY=          # API key de Daily.co (secreta, solo servidor)
DAILY_WEBHOOK_SECRET=   # Secret para validar firma HMAC de webhooks
NEXT_PUBLIC_DAILY_DOMAIN= # Subdominio de la cuenta Daily.co (ej: itseia.daily.co)
```
