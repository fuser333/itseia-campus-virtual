# Feature Specification: Calendario Academico Integrado

**Feature Branch**: `006-academic-calendar`
**Created**: 2026-03-22
**Status**: Draft
**Input**: Calendario academico integrado con planificacion visible de sesiones sincronicas, deadlines y tutorias, exigido por CES para modalidad en linea

## Institutional Alignment *(mandatory)*

### Source Inputs

- `docs/ces_aprobacion/INVESTIGACION_REQUISITOS_CES_ONLINE.md` — CES exige planificacion documentada y visible de sesiones sincronicas para modalidad en linea
- `docs/ces_aprobacion/02_ARQUITECTURA_MODERNA.md` — Decision componente React integrado vinculado a base de datos
- `docs/roadmap/fases.md` — Fase 3: Campus virtual base
- `.specify/memory/constitution.md` — Principio VI (CES Compliance by Design)
- Reglamento IST RPC-SE-04-No.012-2023: planificacion academica documentada y accesible para estudiantes y docentes

### Phase Fit

- **Roadmap Phase**: Fase 3 (Campus virtual base)
- **Why now**: El CES requiere evidencia de planificacion sistematica de las actividades sincronicas. Un calendario integrado a la base de datos — en lugar de imagenes o PDFs estaticos — es la unica forma de demostrar que la planificacion esta activa, actualizada y accesible para todos los actores. Bloquea la aprobacion si no existe.
- **Out of scope**:
  - Sincronizacion bidireccional con Google Calendar / Outlook (solo exportacion iCal en esta fase)
  - Calendario de examenes finales con sala de examen asignada
  - Gestion de licencias docentes o ausencias
  - Reserva de recursos fisicos (laboratorios, salas) — modalidad online en esta fase

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Estudiante ve su agenda academica completa (Priority: P1)

Un estudiante autenticado accede a la seccion "Calendario" de su panel y ve una vista
semanal o mensual con todos sus eventos academicos personalizados: clases sincronicas
programadas (con materia, docente, link de acceso), fechas de entrega de tareas,
evaluaciones y sesiones de tutoria. Los eventos estan codificados por colores segun
su tipo. Puede cambiar entre vista semanal y mensual.

**Why this priority**: Es el flujo principal para el estudiante y la evidencia mas directa
para el CES de que la planificacion academica es visible y accesible. Un estudiante que
encuentra su proxima clase en menos de 10 segundos es la prueba de que el sistema funciona.

**Independent Test**: Un estudiante puede acceder al calendario, ver sus proximas 2 clases
sincronicas con fecha, hora y materia correctas, y cambiar entre vista semanal y mensual.

**Acceptance Scenarios**:

1. **Given** estudiante autenticado matriculado en 3 materias, **When** accede al
   calendario, **Then** ve todos sus eventos de las 3 materias en una sola vista unificada,
   codificados por color.
2. **Given** vista de calendario activa, **When** estudiante cambia entre "Semana" y
   "Mes", **Then** la vista cambia mostrando el periodo correspondiente con todos los
   eventos correctamente posicionados.
3. **Given** evento de clase sincronica en el calendario, **When** estudiante hace click
   en el evento, **Then** ve detalles: materia, docente, duracion y boton "Unirse a clase"
   que lo lleva directamente a la sala de videoconferencia.
4. **Given** estudiante en el calendario, **When** hace click en "Esta semana",
   **Then** puede identificar su proxima clase en menos de 10 segundos.

---

### User Story 2 — Docente programa sesiones sincronicas que aparecen para sus alumnos (Priority: P2)

Un docente autenticado accede a su panel de calendario, hace click en una fecha/hora, y
crea una sesion sincronica para una de sus materias. Especifica la materia, duracion y
tipo de evento (clase, tutoria, evaluacion). El evento aparece automaticamente en el
calendario de todos los estudiantes matriculados en esa materia, sin accion adicional.

**Why this priority**: La propagacion automatica de eventos del docente al calendario del
estudiante elimina la friccion de comunicacion y garantiza que todos los participantes
tienen la misma informacion de planificacion. Es la base para que el calendario sea
"activo" y no un documento estatico.

**Independent Test**: Un docente crea un evento de clase y al instante ese evento es
visible en el calendario de un estudiante matriculado en esa materia.

**Acceptance Scenarios**:

1. **Given** docente autenticado con materias asignadas, **When** crea un nuevo evento
   de clase sincronica para Materia A el martes a las 18:00, **Then** el evento aparece
   automaticamente en el calendario de todos los estudiantes de Materia A.
2. **Given** docente edita la hora de un evento ya creado, **When** guarda el cambio,
   **Then** el evento actualizado se refleja en el calendario de los estudiantes con la
   nueva hora sin que ellos tengan que hacer nada.
3. **Given** docente cancela un evento, **When** lo elimina del calendario, **Then**
   los estudiantes ven el evento removido y reciben notificacion de cancelacion.

---

### User Story 3 — Admin ve y gestiona el calendario global institucional (Priority: P3)

El admin accede a una vista de calendario global que muestra todos los eventos de todas
las materias y programas de ITSEIA. Puede filtrar por programa, materia o tipo de evento.
Esta vista es la base para generar el calendario academico institucional que se presenta
a SENESCYT como parte de la documentacion de planificacion.

**Why this priority**: El CES solicita evidencia del calendario academico institucional
planificado. La vista global del admin es el artefacto que se puede exportar y presentar
en auditorias o visitas de inspeccion.

**Independent Test**: El admin puede ver todos los eventos del mes en curso para todos los
programas y exportarlos en formato iCal o como vista imprimible.

**Acceptance Scenarios**:

1. **Given** admin autenticado, **When** accede al calendario global, **Then** ve todos
   los eventos de todas las materias activas con filtros por programa y tipo de evento.
2. **Given** vista de calendario global, **When** admin selecciona exportar periodo,
   **Then** puede descargar archivo iCal con todos los eventos del periodo seleccionado.

---

### Edge Cases

- Docente programa dos eventos en la misma materia al mismo tiempo: el sistema muestra
  advertencia de conflicto pero no bloquea la creacion.
- Estudiante matriculado en una materia despues de que ya habia eventos programados: el
  sistema muestra todos los eventos futuros de esa materia desde el momento de la
  matriculacion.
- Evento programado en zona horaria incorrecta: todas las horas se almacenan y muestran
  en UTC-5 (Ecuador), sin conversion de zona horaria.
- Clase sincronica programada pero spec 002 no ha creado la sala aun: el evento muestra
  "Sala pendiente de activacion" en lugar del link directo.
- Estudiante accede desde movil: el calendario debe ser usable en pantalla de 375px con
  vista diaria o de 3 dias en lugar de semanal completa.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST ofrecer vistas de calendario en formato semanal y mensual para
  estudiantes y docentes.
- **FR-002**: System MUST mostrar automaticamente en el calendario del estudiante todos
  los eventos de las materias en que esta matriculado, sin configuracion manual.
- **FR-003**: System MUST propagar eventos creados por el docente al calendario de sus
  estudiantes en tiempo real (menos de 5 segundos).
- **FR-004**: System MUST diferenciar visualmente los tipos de evento por color:
  clase sincronica (azul), deadline/entrega (rojo), tutoria (verde), evaluacion (naranja).
- **FR-005**: System MUST mostrar al hacer click en un evento: materia, docente,
  duracion, tipo y link de acceso si aplica.
- **FR-006**: System MUST permitir filtrar eventos por materia, por tipo y por periodo.
- **FR-007**: System MUST exportar el calendario en formato iCal (.ics) compatible con
  Google Calendar y aplicaciones de calendario estandar.
- **FR-008**: System MUST enviar recordatorio dentro de la plataforma 30 minutos antes
  de cada clase sincronica programada.
- **FR-009**: System MUST proveer vista global al admin con todos los eventos de todos
  los programas, filtrable por materia y programa.
- **FR-010**: System MUST almacenar el historial completo de eventos academicos por
  minimo 1 periodo academico como evidencia de planificacion para SENESCYT.

### Key Entities

- **CalendarEvent**: Evento academico programado (type: class/deadline/tutoring/exam,
  subject_id, teacher_id, title, scheduled_at, duration_minutes, description,
  videoconference_link, created_by, created_at). Fuente de verdad de la planificacion.

## Assumptions & Dependencies

- **A1**: "Tiempo real" para propagacion de eventos se define como menos de 5 segundos,
  usando Supabase Realtime o refresco automatico del calendario cada 30 segundos.
- **A2**: El recordatorio de 30 minutos es una notificacion in-app; el envio de email
  o SMS es fuera de alcance para esta fase.
- **A3**: Los eventos de clase sincronica en el calendario son independientes de si
  la sala Daily.co ya esta creada; la vinculacion con la sala es responsabilidad de
  spec 002-sync-videoconference.
- **D1**: Sistema de autenticacion, roles y matriculacion debe estar operativo — depende
  de 001-platform-foundation.
- **D2**: Modelo de materias y asignacion de docentes debe existir en Supabase para
  propagar eventos correctamente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un estudiante puede identificar su proxima clase sincronica en menos de
  10 segundos desde que accede al calendario.
- **SC-002**: El 100% de las sesiones sincronicas programadas por docentes son visibles
  en el calendario de sus estudiantes dentro de los 5 segundos posteriores a la creacion.
- **SC-003**: El archivo iCal exportado es compatible e importable en Google Calendar
  sin errores de formato.
- **SC-004**: El calendario global del admin muestra el 100% de los eventos activos de
  todos los programas, exportables como evidencia de planificacion para SENESCYT.
- **SC-005**: La vista movil del calendario (375px) permite navegar eventos sin scroll
  horizontal ni contenido cortado.
