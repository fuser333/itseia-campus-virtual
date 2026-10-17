# Implementation Plan: Registro Automatico de Asistencia

**Branch**: `007-attendance-tracking` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)

**Dependencia critica**: Este plan DEPENDE de `002-sync-videoconference` estando implementado
y operativo. Las tablas `live_sessions` y `attendance` definidas en spec 002 son la base de
datos de entrada de este modulo. No implementar en produccion antes de que spec 002 este
desplegado y verificado.

## Summary

Extender la infraestructura de asistencia creada en spec 002 (registro automatico via webhooks
Daily.co) con tres capas adicionales: (1) clasificacion de presencia (Presente/Parcial/Ausente),
(2) reportes y alertas para docente y admin, y (3) exportacion en CSV y PDF compatible con
los formatos de reporte que SENESCYT solicita en visitas de inspeccion. Este spec cierra el
ciclo del requisito del 51% sincronico: spec 002 captura los datos; este spec los convierte
en evidencia auditable.

## Technical Context

**Language/Version**: TypeScript 5.x
**Framework**: Next.js 15 App Router — app existente en `apps/web/`
**CSS**: Tailwind CSS 4 + shadcn/ui (`components/ui/table.tsx`, `components/ui/badge.tsx`
ya disponibles)
**DB**: Supabase PostgreSQL — tablas `live_sessions` y `attendance` de spec 002, extendidas.
**Auth**: Supabase Auth (operativo)
**Deploy**: Vercel (tecnologico.itseia.ai)
**PDF**: `apps/web/src/lib/pdf-certificate.ts` como referencia para la libreria PDF ya instalada
(verificar si es `jspdf` o `@react-pdf/renderer` — reutilizar la misma)
**Dependencias nuevas**: ninguna — reutiliza infra de spec 002 y libreria PDF existente
**Paginas existentes relevantes**:
- `apps/web/src/app/teacher/materias/[id]/page.tsx` — donde se agrega lista de asistencia post-clase
- `apps/web/src/app/admin/sesiones/page.tsx` — donde se agrega dashboard de cumplimiento
- `apps/web/src/app/admin/page.tsx` — dashboard principal con metricas globales
- `apps/web/src/types/database.ts` — tipos a extender (Attendance ya definido en spec 002)

## Constitution Check

1. **Problema institucional**: SENESCYT puede solicitar registros de asistencia por materia
   y periodo en visitas de inspeccion. Sin exportacion estructurada, el cumplimiento del 51%
   existe en la DB pero no es presentable como evidencia formal.
2. **Roles afectados**: docente (ve lista post-clase, recibe alertas de inasistencia), admin/
   coordinacion academica (reporte global exportable, verificacion del 51% por programa),
   estudiante (no ve directamente su registro de asistencia en esta fase — fuera de alcance).
3. **Datos, permisos y riesgos**: asistencia es dato academico sensible. RLS: docente solo
   puede ver asistencia de sus materias. Admin puede ver todo. Riesgo: webhook llega dos
   veces por el mismo evento (idempotencia) — ya mitigado en spec 002 pero verificar en tests
   de este spec. Riesgo: duracion de la clase no registrada en `live_sessions` impide calcular
   porcentaje de presencia — mitigar con valor default si `planned_duration_minutes` es null.
4. **Verificacion de exito**: test end-to-end: clase de prueba con 3 usuarios, verificar que
   CSV exportado contiene datos correctos de todos. Test de alerta: simular 4 inasistencias
   en materia de 10 sesiones y verificar que alerta aparece en panel docente.
5. **Slice minimo util**: lista de asistencia post-clase + reporte exportable CSV/PDF +
   alerta de >30% inasistencias. El dashboard de cumplimiento 51% se extiende del ya
   implementado en spec 002 Phase D.
6. **CES Compliance (Principio VI)**: este spec es la capa de evidencia del requisito del
   51% sincronico. Directamente alineado con Art. 61 RRA 2022 y Reglamento IST 2023.
   Los reportes exportables son los artefactos para SENESCYT.
7. **AI-First (Principio VII)**: la clasificacion de presencia (Presente/Parcial/Ausente)
   es regla determinista (60%/10% thresholds) — no requiere IA y es mas auditable
   ante SENESCYT con logica transparente. No se justifica complejidad AI aqui.
8. **Calidad de contenido (Principio VIII)**: no aplica — este spec es infraestructura
   de compliance, no contenido academico.

## Project Structure

### Documentacion

```text
specs/007-attendance-tracking/
├── plan.md          (este archivo)
└── spec.md
```

### Codigo fuente — archivos nuevos

```text
apps/web/src/
├── app/
│   └── api/
│       └── attendance/
│           ├── report/route.ts           — GET: genera reporte consolidado por materia/periodo
│           ├── export/route.ts           — GET: descarga CSV o PDF del reporte
│           └── alert-check/route.ts      — GET: verifica umbrales de inasistencia (llamado por cron o on-demand)
├── components/
│   └── attendance/
│       ├── AttendanceReport.tsx          — tabla de asistencia por sesion/estudiante
│       ├── AttendanceAlert.tsx           — banner/badge de alerta de inasistencia para docente
│       └── ComplianceDashboard.tsx       — dashboard del 51% por programa/materia (extiende spec 002)
└── features/
    └── attendance/
        ├── classify.ts     — classifyAttendance(durationSeconds, plannedDurationSeconds): 'present'|'partial'|'absent'
        ├── report.ts       — buildAttendanceReport(subjectId, periodFrom, periodTo): ReportData
        ├── export-csv.ts   — generateAttendanceCSV(report): string
        ├── export-pdf.ts   — generateAttendancePDF(report): Buffer (reutiliza lib PDF existente)
        └── alerts.ts       — checkAbsenceAlerts(subjectId): AlertItem[]
```

### Codigo fuente — archivos modificados

```text
apps/web/src/
├── app/api/daily/webhook/route.ts           (de spec 002)
│     — agregar clasificacion de status con classify.ts al registrar left_at
│     — agregar llamada a checkAbsenceAlerts si esta es la sesion N de la materia
├── app/teacher/materias/[id]/page.tsx
│     — agregar seccion "Asistencia" con AttendanceReport por sesion
│     — agregar AttendanceAlert si hay estudiantes con > 30% inasistencias
├── app/admin/sesiones/page.tsx              (extendido desde spec 002 Phase D)
│     — reemplazar tabla simple por ComplianceDashboard completo
│     — agregar botones "Exportar CSV" y "Exportar PDF" por materia y global
└── types/database.ts
      — extender tipo Attendance con campos de spec 007 (status, is_manual_override, override_reason)
      — agregar tipo AttendanceReport, AlertItem
```

### Base de datos — migraciones nuevas

```text
supabase/migrations/
└── 20260322_007_attendance_tracking.sql
    — ALTER TABLE attendance ADD COLUMN IF NOT EXISTS status text DEFAULT 'absent'
    — ALTER TABLE attendance ADD COLUMN IF NOT EXISTS is_manual_override bool DEFAULT false
    — ALTER TABLE attendance ADD COLUMN IF NOT EXISTS override_reason text
    — ALTER TABLE live_sessions ADD COLUMN IF NOT EXISTS is_test_session bool DEFAULT false
    — CREATE TABLE absence_alerts (id, subject_id, student_id, alert_threshold, sessions_absent, total_sessions, created_at, acknowledged_at)
    — RLS: docente de la materia y admin pueden SELECT/INSERT en absence_alerts
    — Index: attendance(user_id, live_session_id), absence_alerts(subject_id, acknowledged_at)
```

## Implementation Phases

### Phase A: Clasificacion de presencia y extension de webhook

**Objetivo**: cada registro de asistencia tiene un `status` calculado automaticamente.

- Implementar `features/attendance/classify.ts`:
  - `classifyAttendance(durationSeconds: number, plannedDurationSeconds: number): AttendanceStatus`
  - Reglas: `>= 0.6 * planned` → `present`; `>= 0.1 * planned` → `partial`; `< 0.1 * planned` → `absent`.
  - Si `plannedDurationSeconds` es 0 o null: usar 5400 (90 minutos) como default institucional.
- Modificar `apps/web/src/app/api/daily/webhook/route.ts` (spec 002):
  - Al procesar evento `participant-left`: calcular `duration_seconds = left_at - joined_at`.
  - Si el estudiante entra y sale multiples veces en la misma sesion: acumular
    `duration_seconds` en el mismo registro (UPDATE con `duration_seconds = duration_seconds + delta`).
  - Llamar `classifyAttendance` y persistir `status` en el mismo UPDATE.
  - Filtrar: si `is_test_session = true` en `live_sessions`, no computar asistencia.
- Crear migracion con los ALTER TABLE necesarios (status, is_manual_override, override_reason,
  is_test_session) y la tabla `absence_alerts`.
- Test: verificar que despues de que el webhook procesa un `participant-left`, la fila en
  `attendance` tiene `status` correcto para los tres umbrales.

### Phase B: Lista de asistencia y justificaciones manuales para docente

**Objetivo**: docente ve la lista de asistencia dentro de los 5 minutos de terminar la clase.

- Implementar `features/attendance/report.ts`:
  - `buildAttendanceReport(subjectId, periodFrom, periodTo)`:
    - Carga `live_sessions` del periodo con sus `attendance` asociadas.
    - Carga lista de estudiantes matriculados en la materia.
    - Genera estructura: `{ sessions[], students[], matrix: {[studentId][sessionId]: AttendanceStatus} }`.
    - Calcula por estudiante: `sessionesPresente`, `sessionesParcial`, `sessionesAusente`,
      `porcentajeAsistencia` (present + 0.5 * partial) / totalSessions.
    - Calcula por sesion: conteo de presentes, parciales, ausentes.
- Implementar `AttendanceReport.tsx`:
  - Tabla con columnas: nombre del estudiante y una columna por sesion.
  - Celdas codificadas por color: verde (present), amarillo (partial), rojo (absent), gris (sin dato).
  - Fila de totales al pie: porcentaje de asistencia por sesion.
  - Selector de periodo (from/to date) para filtrar.
  - Boton "Exportar" que llama `/api/attendance/export?format=csv|pdf`.
- Override manual: en cada celda de la tabla, docente puede hacer click y abrir un dialog
  para cambiar el status con campo de razon. Persiste `is_manual_override = true` y
  `override_reason` en la fila de attendance.
- Integrar en `teacher/materias/[id]/page.tsx`: tab "Asistencia" con `AttendanceReport`.

### Phase C: Alertas de inasistencia y exportacion

**Objetivo**: docente recibe alerta automatica cuando estudiante supera 30% de inasistencias.

- Implementar `features/attendance/alerts.ts`:
  - `checkAbsenceAlerts(subjectId: string): Promise<AlertItem[]>`:
    - Calcula `porcentajeAusencia` por estudiante para `live_sessions` del semestre activo.
    - Si `porcentajeAusencia > 0.30` y no existe alerta activa (sin `acknowledged_at`):
      inserta en `absence_alerts`.
    - Retorna lista de alertas activas del `subject_id`.
  - La funcion se llama en el webhook (Phase A) despues de cada sesion finalizada, y
    tambien disponible on-demand via `GET /api/attendance/alert-check?subjectId=X`.
- Implementar `AttendanceAlert.tsx`:
  - Banner en el panel del docente cuando existen alertas activas.
  - Muestra: nombre del estudiante, % de inasistencia, ultima sesion ausente.
  - Boton "Reconocer alerta" marca `acknowledged_at = now()` — la alerta desaparece del banner.
- Implementar `features/attendance/export-csv.ts`:
  - Genera CSV con columnas: Nombre, Cedula (si disponible), Materia, Sesiones Presentes,
    Sesiones Parciales, Sesiones Ausentes, Total Sesiones, % Asistencia.
  - Formato compatible con hojas de calculo (UTF-8 con BOM para Excel en Windows).
- Implementar `features/attendance/export-pdf.ts`:
  - Reutiliza la libreria PDF ya en uso en `apps/web/src/lib/pdf-certificate.ts`.
  - Layout: header con logo ITSEIA, nombre de materia, periodo, fecha de generacion.
  - Tabla de asistencia con los mismos datos del CSV.
  - Pie de pagina: "Generado por ITSEIA Platform — evidencia para SENESCYT".
- Implementar `GET /api/attendance/report`: retorna `ReportData` JSON.
- Implementar `GET /api/attendance/export?subjectId=X&from=ISO&to=ISO&format=csv|pdf`:
  llama el generador correspondiente y retorna el archivo.
- `ComplianceDashboard.tsx`: tabla global por programa con columnas: materia, docente,
  sesiones planificadas, sesiones realizadas, % cumplimiento sincronico. Indicador rojo
  si < 51%. Boton "Exportar CSV global" para enviar a SENESCYT.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Acumulacion de duracion por multiples entradas/salidas | La spec FR-003 lo exige explicitamente | Tomar solo la primera entrada y ultima salida no es correcto si el estudiante sale y vuelve a entrar — perderia tiempo real de presencia |

No se introduce complejidad arquitectural adicional significativa. Este spec es principalmente
logica de negocios sobre datos ya existentes de spec 002.

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Spec 002 no implementado antes de comenzar | Depende de coordinacion | Critico | Condicion de entrada explicita: no empezar Phase A hasta que spec 002 este en produccion y verificado |
| Webhook llega duplicado para el mismo participant-left | Media | Medio | Logica idempotente: verificar si `left_at` ya existe para `(live_session_id, user_id)` antes de actualizar |
| PDF muy pesado para exportaciones de semestre completo (>100 sesiones) | Baja | Bajo | Limitar exportacion PDF a 1 materia a la vez; CSV para exportaciones globales |
| Feriados nacionales Ecuador no contemplados en calculos | Media | Bajo | En esta fase los calculos son por sesiones realizadas vs planificadas — no por dias calendario, por lo que los feriados no afectan directamente |
| RLS del docente permite ver asistencia de materia de otro docente | Baja | Critico | Policy: `subject_id IN (SELECT subject_id FROM subject_teachers WHERE teacher_id = auth.uid())` |

## Environment Variables Required

Ninguna adicional. Usa las variables ya configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DAILY_WEBHOOK_SECRET` (de spec 002 — para validar webhooks que disparan clasificacion)
