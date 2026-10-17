# Feature Specification: Videoconferencia Sincronica CES

**Feature Branch**: `002-sync-videoconference`
**Created**: 2026-03-22
**Status**: Draft
**Input**: Videoconferencia sincronica embebida con grabacion y asistencia automatica para cumplir requisito CES del 51% de creditos sincronicos

## Institutional Alignment *(mandatory)*

### Source Inputs

- `docs/ces_aprobacion/INVESTIGACION_REQUISITOS_CES_ONLINE.md` — Art. 57, 61 RRA 2022
- `docs/ces_aprobacion/02_ARQUITECTURA_MODERNA.md` — Decision Daily.co
- `docs/roadmap/fases.md` — Fase 3: Campus virtual base
- `.specify/memory/constitution.md` — Principio VI (CES Compliance by Design)
- Reglamento IST RPC-SE-04-No.012-2023: 51% creditos sincronicos obligatorios

### Phase Fit

- **Roadmap Phase**: Fase 3 (Campus virtual base)
- **Why now**: Sin videoconferencia sincronica con registro, el CES no puede aprobar la
  modalidad en linea. Es el requisito mas critico: 51% de creditos deben ser sincronicos
  verificables. Bloquea la aprobacion completa.
- **Out of scope**:
  - Breakout rooms avanzados
  - Pizarra digital compartida (fase posterior)
  - Streaming a YouTube/Facebook (existe en Restream, no en plataforma)
  - Transcripcion automatica con IA (fase 4 — diferenciacion)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Docente inicia clase sincronica (Priority: P1)

Un docente asignado a una materia accede a la sesion correspondiente en el panel docente,
hace click en "Iniciar Clase", y se abre una sala de videoconferencia embebida dentro de
la plataforma. Los estudiantes de esa materia ven un boton "Unirse a Clase" en su vista
de sesion. La clase queda grabada automaticamente y la asistencia se registra sin
intervencion manual.

**Why this priority**: Sin esto no hay 51% sincronico. Es el nucleo del requisito CES.

**Independent Test**: Un docente puede crear una sala, un estudiante puede unirse, la
grabacion se almacena, y la asistencia queda registrada en la base de datos.

**Acceptance Scenarios**:

1. **Given** docente autenticado en su materia, **When** hace click en "Iniciar Clase",
   **Then** se crea una sala Daily.co embebida en la plataforma con video/audio activo.
2. **Given** sala activa, **When** estudiante hace click en "Unirse a Clase",
   **Then** entra a la sala embebida sin salir de la plataforma ni instalar software.
3. **Given** clase en curso, **When** un participante entra o sale,
   **Then** el sistema registra automaticamente fecha, hora, duracion en tabla attendance.
4. **Given** clase finalizada, **When** docente hace click en "Terminar Clase",
   **Then** la grabacion se almacena y queda accesible en la sesion como video diferido.

---

### User Story 2 — Estudiante revisa clase grabada (Priority: P2)

Un estudiante que no pudo asistir a la clase sincronica accede a la sesion y encuentra
la grabacion disponible en el tab de Video. Puede verla completa dentro de la plataforma.

**Why this priority**: El CES exige que las grabaciones esten disponibles para consulta
diferida. Complementa la asistencia sincronica.

**Independent Test**: La grabacion aparece en la sesion y se reproduce embebida.

**Acceptance Scenarios**:

1. **Given** clase grabada disponible, **When** estudiante accede al tab Video de la sesion,
   **Then** ve la grabacion embebida y puede reproducirla sin salir de la plataforma.
2. **Given** multiples clases grabadas, **When** estudiante navega las sesiones,
   **Then** cada sesion muestra su grabacion correspondiente.

---

### User Story 3 — Admin verifica cumplimiento 51% sincronico (Priority: P2)

El admin (Hector) accede a un reporte que muestra el porcentaje de creditos con sesiones
sincronicas realizadas vs el total de creditos del programa. El reporte indica si se
cumple el 51% exigido por CES.

**Why this priority**: El CES pide evidencia del cumplimiento. El reporte es la prueba.

**Independent Test**: El reporte muestra datos reales de sesiones sincronicas vs totales.

**Acceptance Scenarios**:

1. **Given** admin autenticado, **When** accede al reporte de cumplimiento sincronico,
   **Then** ve por programa: total creditos, creditos con sesion sincronica, porcentaje.
2. **Given** porcentaje por debajo de 51%, **When** admin revisa el reporte,
   **Then** el sistema marca en rojo las materias sin sesiones sincronicas programadas.

---

### User Story 4 — Calendario de sesiones sincronicas visible (Priority: P3)

Los estudiantes ven un calendario con las proximas sesiones sincronicas programadas,
incluyendo fecha, hora, materia y docente. Pueden agregar recordatorios.

**Why this priority**: El CES exige planificacion visible de sesiones sincronicas.

**Independent Test**: Calendario muestra sesiones futuras con datos correctos.

**Acceptance Scenarios**:

1. **Given** estudiante matriculado, **When** accede al calendario,
   **Then** ve sus proximas clases sincronicas con fecha, hora, materia y docente.
2. **Given** docente programa una clase, **When** la crea en el panel docente,
   **Then** aparece automaticamente en el calendario de todos los estudiantes de esa materia.

---

### Edge Cases

- Docente pierde conexion durante la clase: la sala se mantiene activa para los
  estudiantes, la grabacion continua.
- Estudiante intenta unirse a clase que ya termino: ve mensaje "Clase finalizada" con
  link a la grabacion.
- Mas de 50 estudiantes en una sala: verificar limites de Daily.co free tier.
- Docente olvida terminar la clase: auto-cierre despues de 30 minutos sin participantes.
- Zona horaria: todas las horas en Ecuador (UTC-5), sin conversion.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST crear salas de videoconferencia embebidas en la pagina de sesion
  usando la API de Daily.co (o proveedor equivalente con API-first approach).
- **FR-002**: System MUST registrar automaticamente la asistencia de cada participante
  (hora entrada, hora salida, duracion total) sin intervencion manual.
- **FR-003**: System MUST grabar automaticamente cada sesion sincronica y almacenar la
  grabacion accesible desde la sesion correspondiente.
- **FR-004**: System MUST mostrar un boton "Iniciar Clase" solo al docente asignado, y
  "Unirse a Clase" a los estudiantes matriculados cuando haya sala activa.
- **FR-005**: System MUST impedir el acceso a salas de clases de materias donde el
  estudiante no esta matriculado.
- **FR-006**: System MUST generar un reporte de cumplimiento del 51% sincronico por
  programa, materia y periodo, exportable para documentacion CES.
- **FR-007**: System MUST mostrar un calendario de sesiones sincronicas programadas visible
  para estudiantes y docentes.
- **FR-008**: System MUST funcionar en navegador sin instalar software adicional (WebRTC).
- **FR-009**: System MUST soportar al menos 40 participantes simultaneos por sala.
- **FR-010**: System MUST almacenar grabaciones por minimo 1 periodo academico (6 meses).

### Key Entities

- **LiveSession**: Sala activa vinculada a una sesion academica (daily_room_name,
  started_at, ended_at, recording_url, created_by).
- **Attendance**: Registro de asistencia por participante (user_id, live_session_id,
  joined_at, left_at, duration_seconds, was_present).
- **ScheduledClass**: Clase programada en calendario (subject_id, session_id, teacher_id,
  scheduled_at, duration_minutes).

## Assumptions & Dependencies

- **A1**: Daily.co free tier (2,000 min/mes) es suficiente para piloto con <50 estudiantes.
- **A2**: Grabaciones se almacenan en Daily.co cloud (no Supabase Storage) para evitar
  costos de almacenamiento excesivos.
- **A3**: La grabacion esta disponible 10-30 minutos despues de finalizar la sesion
  (procesamiento Daily.co).
- **D1**: API key de Daily.co necesaria (crear cuenta en daily.co).
- **D2**: Tablas attendance, live_sessions, scheduled_classes deben crearse en Supabase.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un docente puede iniciar una clase y un estudiante puede unirse en menos de
  30 segundos sin instalar nada.
- **SC-002**: El 100% de las sesiones sincronicas tienen registro de asistencia automatico
  sin intervencion manual.
- **SC-003**: Las grabaciones estan disponibles para consulta diferida dentro de las 2 horas
  posteriores a la clase.
- **SC-004**: El reporte de cumplimiento sincronico muestra datos correctos verificables
  contra los registros de asistencia.
- **SC-005**: La plataforma soporta al menos 40 participantes simultaneos en una sala sin
  degradacion perceptible de video/audio.
- **SC-006**: El calendario muestra las proximas 4 semanas de clases programadas con
  informacion correcta.
