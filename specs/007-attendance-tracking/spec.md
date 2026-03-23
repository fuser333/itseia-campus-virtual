# Feature Specification: Registro Automatico de Asistencia

**Feature Branch**: `007-attendance-tracking`
**Created**: 2026-03-22
**Status**: Draft
**Input**: Registro automatico de asistencia via webhooks de videoconferencia para evidenciar cumplimiento del 51% sincronico exigido por Art. 61 RRA + Reglamento IST 2023

**NOTE**: Este spec DEPENDE de 002-sync-videoconference. Funciona como extension del modulo
de videoconferencia; no puede operar de forma independiente en produccion.

## Institutional Alignment *(mandatory)*

### Source Inputs

- `docs/ces_aprobacion/INVESTIGACION_REQUISITOS_CES_ONLINE.md` — Art. 61 RRA 2022 y Reglamento IST RPC-SE-04-No.012-2023: evidencia del 51% de creditos sincronicos verificable
- `docs/ces_aprobacion/02_ARQUITECTURA_MODERNA.md` — Decision webhooks Daily.co para eventos join/leave + tabla attendance Supabase
- `docs/roadmap/fases.md` — Fase 3: Campus virtual base
- `specs/002-sync-videoconference/spec.md` — Dependencia directa: tabla attendance base
- `.specify/memory/constitution.md` — Principio VI (CES Compliance by Design)
- Reglamento IST 2023: SENESCYT puede solicitar registros de asistencia por materia y periodo como evidencia de operacion real del instituto

### Phase Fit

- **Roadmap Phase**: Fase 3 (Campus virtual base)
- **Why now**: El registro de asistencia es la evidencia critica para demostrar ante SENESCYT que el 51% de creditos sincronicos efectivamente se ejecuta. Spec 002 crea la infraestructura de videoconferencia; este spec la extiende para que cada sesion genere automaticamente un registro verificable y exportable. Sin esto, el cumplimiento sincronico existe operacionalmente pero no es auditable.
- **Out of scope**:
  - Asistencia en clases presenciales (escaner QR o biometria — fuera de modalidad online)
  - Calculo automatico de nota por asistencia (logica de calificacion — spec separada)
  - Justificacion de inasistencias con documentos adjuntos (fase posterior)
  - Integracion con sistema de notas del SENESCYT (SNIESE) — fase posterior

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Asistencia registrada automaticamente al entrar y salir de clase (Priority: P1)

Cuando un estudiante se une a una clase virtual activa, el sistema registra automaticamente
la hora de entrada. Cuando sale (o la clase termina), registra la hora de salida y calcula
la duracion total en la sesion. Todo ocurre sin ninguna accion del estudiante ni del docente.
El registro queda en la base de datos inmediatamente disponible para reportes.

**Why this priority**: Es el nucleo del requisito SENESCYT. Sin registro automatico, el
docente tendria que hacer listas manuales — proceso propenso a errores, dificil de auditar
y no escalable. El 100% de automatizacion es lo que hace el sistema valido ante SENESCYT.

**Independent Test**: Un estudiante entra a una sala de clase virtual y al salir, sin hacer
nada, existe un registro en la base de datos con su user_id, la sesion, hora de entrada,
hora de salida y duracion calculada.

**Acceptance Scenarios**:

1. **Given** clase sincronica activa, **When** estudiante matriculado hace click en
   "Unirse a Clase" y entra a la sala, **Then** el sistema registra automaticamente
   joined_at con timestamp preciso sin intervencion del estudiante.
2. **Given** estudiante en clase activa, **When** cierra la sala o la clase termina,
   **Then** el sistema registra automaticamente left_at y calcula duration_seconds.
3. **Given** estudiante que entra y sale multiples veces de la misma sesion, **When** se
   consulta su asistencia, **Then** el sistema suma el tiempo total de presencia en la
   sesion y lo registra como duracion acumulada.
4. **Given** clase finalizada, **When** docente accede al listado de asistencia,
   **Then** ve la lista completa de participantes con hora entrada, hora salida y duracion
   para cada uno, sin haber hecho ninguna accion manual.

---

### User Story 2 — Docente consulta lista de asistencia post-clase (Priority: P2)

Despues de finalizar una clase sincronica, el docente puede acceder a la lista completa
de asistencia desde el panel de la sesion. Ve quien asistio, cuanto tiempo estuvo, y puede
identificar a los estudiantes ausentes. La informacion esta disponible dentro de los
primeros 5 minutos de finalizada la clase.

**Why this priority**: El docente necesita visibilidad inmediata post-clase para hacer
seguimiento pedagogico. Es tambien la primera linea de verificacion antes de que los
datos lleguen a reportes institucionales.

**Independent Test**: Dentro de los 5 minutos de terminar una clase de prueba, el docente
ve la lista de asistencia con datos correctos de todos los participantes.

**Acceptance Scenarios**:

1. **Given** clase sincronica finalizada, **When** docente accede al detalle de la sesion,
   **Then** ve lista de asistencia con: nombre del estudiante, hora entrada, hora salida,
   duracion y estado (Presente / Ausente / Parcial).
2. **Given** lista de asistencia visible, **When** docente identifica estudiante con
   inasistencia, **Then** puede marcar manualmente una justificacion de inasistencia
   que queda registrada junto al registro automatico.
3. **Given** materia con inasistencia acumulada >30% de un estudiante, **When** el
   sistema calcula el porcentaje, **Then** genera una alerta visible para el docente en
   su panel.

---

### User Story 3 — Admin exporta reportes de asistencia para SENESCYT (Priority: P2)

El admin puede generar y exportar reportes de asistencia consolidados por materia, programa
o periodo academico. Los reportes muestran el porcentaje de sesiones sincronicas realizadas
vs planificadas, y el porcentaje de asistencia por estudiante. El formato es compatible con
los requerimientos de reporte de SENESCYT.

**Why this priority**: El reporte exportable es el artefacto final que se entrega a
SENESCYT en visitas de inspeccion o procesos de seguimiento. Sin exportacion, todo el
registro automatico no tiene valor de compliance documentado.

**Independent Test**: El admin genera un reporte de asistencia de una materia en CSV y
PDF, y el documento contiene datos correctos de todas las sesiones del periodo.

**Acceptance Scenarios**:

1. **Given** admin autenticado, **When** selecciona una materia y un periodo y solicita
   el reporte de asistencia, **Then** el sistema genera en menos de 5 segundos un reporte
   con: sesiones realizadas, sesiones planificadas, % cumplimiento, lista de estudiantes
   con % de asistencia individual.
2. **Given** reporte generado, **When** admin hace click en "Exportar CSV" o "Exportar PDF",
   **Then** descarga el archivo correctamente formateado con todos los datos del reporte.
3. **Given** reporte por programa, **When** admin lo revisa, **Then** puede identificar
   materias que no alcanzan el 51% de sesiones sincronicas realizadas.

---

### Edge Cases

- Estudiante pierde conexion durante la clase y se reconecta: el sistema registra dos
  entradas y suma el tiempo total acumulado como duracion de asistencia.
- Docente olvida terminar la clase en la plataforma (sala queda abierta): el sistema
  registra el cierre automatico con el timestamp del auto-cierre (definido en spec 002
  como 30 minutos sin participantes).
- Estudiante invitado o docente de apoyo se une a la sala: solo se registra asistencia
  de usuarios matriculados en la materia correspondiente.
- Webhook de Daily.co llega con retraso o duplicado: el sistema usa idempotencia para
  no crear registros duplicados de la misma entrada.
- Sesion de prueba o demo sin estudiantes reales: se puede marcar como "Sesion de prueba"
  para excluirla de los reportes de cumplimiento SENESCYT.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST registrar automaticamente joined_at de cada participante al
  entrar a una sala de clase virtual, sin accion manual.
- **FR-002**: System MUST registrar automaticamente left_at y calcular duration_seconds
  al salir el participante o al cerrarse la sala.
- **FR-003**: System MUST manejar correctamente entradas y salidas multiples del mismo
  estudiante en la misma sesion, acumulando el tiempo total de presencia.
- **FR-004**: System MUST clasificar automaticamente cada registro como Presente (>60%
  de la duracion de la clase), Parcial (10-60%) o Ausente (0-10% o sin registro).
- **FR-005**: System MUST mostrar la lista de asistencia al docente dentro de los 5
  minutos posteriores al fin de la clase, sin intervencion manual.
- **FR-006**: System MUST generar alertas automaticas para el docente cuando un
  estudiante acumula mas de 30% de inasistencias en la materia.
- **FR-007**: System MUST generar reportes de asistencia consolidados por materia,
  programa y periodo, en menos de 5 segundos.
- **FR-008**: System MUST exportar reportes de asistencia en formato CSV y PDF.
- **FR-009**: System MUST incluir en los reportes el porcentaje de sesiones sincronicas
  realizadas vs planificadas para verificar cumplimiento del 51%.
- **FR-010**: System MUST mantener el historial completo de asistencia por minimo 2
  anos como evidencia de cumplimiento para SENESCYT.

### Key Entities

- **Attendance**: Registro de asistencia por participante y sesion (user_id,
  live_session_id, joined_at, left_at, duration_seconds, status: present/partial/absent,
  is_manual_override, override_reason). Extiende la tabla base de spec 002.

## Assumptions & Dependencies

- **A1**: Los webhooks de Daily.co para eventos join/leave son confiables y llegan en
  menos de 5 segundos despues del evento real.
- **A2**: Un estudiante se considera "Presente" si asistio al 60% o mas de la duracion
  de la clase; "Parcial" entre 10-60%; "Ausente" menos del 10% o sin registro.
- **A3**: El umbral del 30% de inasistencias para alertas es configurable por el admin
  en una fase posterior; en esta fase es fijo en 30%.
- **D1**: Spec 002-sync-videoconference debe estar implementado y operativo. Esta spec
  no puede funcionar sin la infraestructura de salas virtuales.
- **D2**: Tabla live_sessions de spec 002 debe incluir duracion_planificada para calcular
  los porcentajes de presencia correctamente.
- **D3**: Daily.co debe estar configurado para enviar webhooks a un endpoint de la
  plataforma ITSEIA con los eventos participant-joined y participant-left.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las asistencias a clases sincronicas quedan registradas
  automaticamente sin ninguna intervencion manual del docente o estudiante.
- **SC-002**: El reporte de asistencia por materia se genera en menos de 5 segundos
  para periodos de hasta 5 meses de datos.
- **SC-003**: Los archivos exportados (CSV y PDF) contienen datos correctos y verificables
  contra los registros individuales de asistencia en la base de datos.
- **SC-004**: El porcentaje de sesiones sincronicas realizadas vs planificadas en el
  reporte es verificable y evidencia el cumplimiento del 51% para SENESCYT.
- **SC-005**: Cero registros duplicados de asistencia para el mismo estudiante en la
  misma sesion, incluso si el webhook llega mas de una vez.
