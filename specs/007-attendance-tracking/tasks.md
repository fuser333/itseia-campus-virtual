# Tasks: Registro Automatico de Asistencia

**Input**: plan.md + spec.md
**Prerequisites**: spec 002-sync-videoconference completamente deployado y verificado en
produccion (tablas `live_sessions` y `attendance` existentes, webhook Daily.co funcional);
libreria PDF ya instalada en `apps/web/src/lib/pdf-certificate.ts`

**Tests**: Verificar idempotencia del webhook (duplicados no crean filas extra); test de alerta
con 4+ inasistencias en 10 sesiones; CSV/PDF con datos correctos verificables contra DB.

## Format: `[ID] [P?] [Story] Description`
- P = paralelizable (puede ejecutarse concurrentemente con otras tareas P)
- Story = historia de usuario que sirve

---

## Phase A: Clasificacion de presencia y extension de webhook

**Purpose**: Cada registro de asistencia tiene un `status` calculado automaticamente al
procesar el evento `participant-left` de Daily.co.

- [ ] T001 [US1] Crear migracion `supabase/migrations/20260322_007_attendance_tracking.sql`:
      `ALTER TABLE attendance ADD COLUMN status`, `is_manual_override`, `override_reason`;
      `ALTER TABLE live_sessions ADD COLUMN is_test_session`; `CREATE TABLE absence_alerts`
      con RLS (docente de la materia y admin); indices en
      `attendance(user_id, live_session_id)` y `absence_alerts(subject_id, acknowledged_at)`
- [ ] T002 [P] [US1] Extender `apps/web/src/types/database.ts` con campos de spec 007
      en tipo `Attendance` y nuevos tipos `AttendanceReport` y `AlertItem`
- [ ] T003 [US1] Implementar `features/attendance/classify.ts`:
      `classifyAttendance(durationSeconds, plannedDurationSeconds): 'present' | 'partial' | 'absent'`
      con umbrales 60%/10%; default de 5400s si `plannedDurationSeconds` es null
- [ ] T004 [US1] Modificar `apps/web/src/app/api/daily/webhook/route.ts` (de spec 002):
      al procesar `participant-left`, acumular `duration_seconds` para multiples entradas/salidas
      del mismo estudiante en la misma sesion; llamar `classifyAttendance` y persistir `status`;
      ignorar si `live_sessions.is_test_session = true`

**Checkpoint**: Simular webhook `participant-left` con `duration_seconds` en los tres umbrales;
verificar que `attendance.status` es `present`, `partial` o `absent` respectivamente; enviar
el mismo webhook dos veces — verificar que no hay duplicados en `attendance`.

---

## Phase B: Lista de asistencia y justificaciones manuales para docente

**Purpose**: Docente ve lista de asistencia dentro de los 5 minutos de terminar la clase con
capacidad de override manual.

- [ ] T005 [US2] Implementar `features/attendance/report.ts`:
      `buildAttendanceReport(subjectId, periodFrom, periodTo)` — carga `live_sessions` del
      periodo con `attendance` asociadas y lista de matriculados; genera matriz
      `{[studentId][sessionId]: AttendanceStatus}`; calcula `porcentajeAsistencia` por
      estudiante y conteos por sesion
- [ ] T006 [US2] Implementar `GET /api/attendance/report/route.ts` — retorna `ReportData`
      JSON para el `subjectId` y periodo solicitado; RLS: docente solo puede ver sus materias
- [ ] T007 [US2] Implementar `components/attendance/AttendanceReport.tsx`:
      tabla matricula x sesiones con colores (verde/amarillo/rojo/gris); fila de totales al pie;
      selector de periodo; boton "Exportar"; override manual por celda con dialog de razon
      que persiste `is_manual_override = true` y `override_reason`
- [ ] T008 [US2] Integrar tab "Asistencia" con `AttendanceReport` en
      `apps/web/src/app/teacher/materias/[id]/page.tsx`

**Checkpoint**: En la vista docente, tab "Asistencia" muestra la lista completa de una clase
de prueba con estados correctos; docente puede hacer override de un celda, la razon queda
guardada y el cambio es visible en la tabla.

---

## Phase C: Alertas de inasistencia y exportacion CSV/PDF

**Purpose**: Docente recibe alerta cuando estudiante supera 30% de inasistencias; admin puede
exportar reporte en CSV y PDF para SENESCYT.

- [ ] T009 [US2] Implementar `features/attendance/alerts.ts`:
      `checkAbsenceAlerts(subjectId)` — calcula porcentaje de ausencia por estudiante en el
      semestre activo; si > 30% y no existe alerta activa, inserta en `absence_alerts`;
      llamar desde el webhook (Phase A) al finalizar cada sesion y disponible via
      `GET /api/attendance/alert-check`
- [ ] T010 [P] [US2] Implementar `components/attendance/AttendanceAlert.tsx` — banner en
      panel docente con nombre del estudiante, % inasistencia, ultima sesion ausente; boton
      "Reconocer" marca `acknowledged_at = now()`
- [ ] T011 [P] [US3] Implementar `features/attendance/export-csv.ts` — genera CSV con columnas
      Nombre, Cedula, Materia, Sesiones Presentes/Parciales/Ausentes, Total, % Asistencia;
      UTF-8 con BOM para compatibilidad Excel en Windows
- [ ] T012 [P] [US3] Implementar `features/attendance/export-pdf.ts` — reutiliza libreria
      PDF de `apps/web/src/lib/pdf-certificate.ts`; header con logo ITSEIA, nombre de materia,
      periodo, fecha; tabla de asistencia; pie "Evidencia para SENESCYT"
- [ ] T013 [US3] Implementar `GET /api/attendance/export/route.ts` —
      `?subjectId=X&from=ISO&to=ISO&format=csv|pdf`; llama generador correspondiente y
      retorna archivo con headers correctos de descarga
- [ ] T014 [US3] Implementar `components/attendance/ComplianceDashboard.tsx` — tabla global
      por programa/materia con sesiones planificadas, realizadas, % cumplimiento sincronico;
      indicador rojo si < 51%; boton "Exportar CSV global"; integrar en
      `apps/web/src/app/admin/sesiones/page.tsx` reemplazando la tabla simple de spec 002

**Checkpoint**: Admin selecciona una materia y periodo, hace click en "Exportar CSV" —
el archivo descargado contiene filas correctas para todos los estudiantes; el PDF tiene
header institucional y pie de evidencia SENESCYT; `ComplianceDashboard` muestra materias
en rojo con < 51% de cumplimiento.

---

## Dependencies & Execution Order

- CONDICION DE ENTRADA: spec 002 debe estar deployado y verificado antes de comenzar.
- T001, T002, T003 son paralelos entre si y bloqueantes para todo lo demas.
- T004 depende de T001 y T003 (usa `classify.ts` y los nuevos campos de la migracion).
- Phase B puede comenzar una vez T001 este completo; T005 es prerequisito de T006 y T007.
- T008 depende de T007.
- Phase C puede comenzar en paralelo con Phase B una vez T004 este listo.
- T009 depende de T004; T010-T012 son paralelos entre si; T013 depende de T011 y T012;
  T014 depende de T006 y T013.

## Agent Team Strategy

- **Agente 1 (DB + Webhook)**: T001 -> T003 -> T004 -> T009
- **Agente 2 (Types + Report logic)**: T002 (paralelo con T001) -> T005 -> T006
- **Agente 3 (UI Docente)**: T007 -> T008 -> T010 (una vez T006 listo)
- **Agente 4 (Export + Admin)**: T011 + T012 (paralelo, una vez T001 listo) -> T013 -> T014
