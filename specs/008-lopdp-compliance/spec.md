# Feature Specification: Cumplimiento LOPDP Ecuador

**Feature Branch**: `008-lopdp-compliance`
**Created**: 2026-03-22
**Status**: Draft
**Input**: Implementacion de mecanismos de proteccion de datos personales conforme a la Ley Organica de Proteccion de Datos Personales de Ecuador (LOPDP, vigente mayo 2021)

## Institutional Alignment *(mandatory)*

### Source Inputs

- Ley Organica de Proteccion de Datos Personales Ecuador (LOPDP) — vigente desde mayo 2021
- Reglamento LOPDP (Decreto Ejecutivo No. 977, 2021) — derechos ARCO: Acceso, Rectificacion, Cancelacion, Oposicion
- `docs/ces_aprobacion/INVESTIGACION_REQUISITOS_CES_ONLINE.md` — proteccion de datos estudiantiles como requisito de plataforma educativa
- `docs/roadmap/fases.md` — Fase 3: Campus virtual base
- `.specify/memory/constitution.md` — Principio VII (Privacidad y datos de estudiantes)
- LOPDP Art. 9: consentimiento libre, especifico, informado e inequivoco como base de legitimacion del tratamiento de datos

### Phase Fit

- **Roadmap Phase**: Fase 3 (Campus virtual base)
- **Why now**: La LOPDP es de cumplimiento obligatorio desde mayo 2021 para cualquier entidad que trate datos personales en Ecuador. ITSEIA procesa datos de estudiantes (nombre, cedula, correo, desempeno academico) desde el primer registro. Implementar cumplimiento desde el inicio evita sanciones (hasta el 1% del volumen de negocio anual), protege la reputacion institucional y es un diferenciador de confianza ante estudiantes y SENESCYT.
- **Out of scope**:
  - Designacion formal de Delegado de Proteccion de Datos (DPD) — rol humano, no tecnico
  - Registro ante la Superintendencia de Proteccion de Datos (SNAI) — tramite institucional
  - Analisis de impacto de proteccion de datos (AIPD) completo — documento institucional
  - Cifrado de base de datos en reposo — configuracion de infraestructura Supabase

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Estudiante acepta politica de privacidad al registrarse (Priority: P1)

Durante el proceso de registro en la plataforma, antes de que el estudiante pueda completar
la creacion de su cuenta, el sistema presenta un resumen claro de la politica de privacidad
de ITSEIA con un checkbox obligatorio de consentimiento. El checkbox no puede estar
pre-marcado. El estudiante debe leer (o al menos desplazar) la politica y marcar
voluntariamente el checkbox para continuar. El consentimiento queda registrado con
timestamp e IP para evidencia legal.

**Why this priority**: El Art. 9 LOPDP exige que el consentimiento sea el primer acto
del tratamiento de datos. Sin consentimiento registrado, cualquier dato procesado
posteriormente es ilicito bajo la LOPDP. Es el requisito legal mas critico y debe estar
operativo antes de que el primer estudiante real se registre.

**Independent Test**: Un usuario se registra en la plataforma, el sistema le muestra
el checkbox de privacidad no pre-marcado, y al completar el registro existe un registro
en ConsentRecord con su user_id, timestamp e IP.

**Acceptance Scenarios**:

1. **Given** usuario en el formulario de registro, **When** llega al paso de consentimiento,
   **Then** ve un checkbox de privacidad NO pre-marcado con enlace a la politica completa
   y no puede continuar sin marcarlo.
2. **Given** usuario que intenta hacer click en "Crear cuenta" sin marcar el checkbox,
   **When** intenta enviar el formulario, **Then** el sistema bloquea el registro y muestra
   mensaje "Debes aceptar la politica de privacidad para continuar".
3. **Given** usuario que marca el checkbox y completa el registro, **When** se crea la
   cuenta, **Then** el sistema almacena un registro ConsentRecord con: user_id, version
   de la politica aceptada, timestamp exacto e IP de origen.
4. **Given** politica de privacidad actualizada a nueva version, **When** usuario existente
   inicia sesion, **Then** el sistema le presenta la nueva version para aceptacion antes
   de permitir el acceso.

---

### User Story 2 — Estudiante accede, exporta y solicita eliminacion de sus datos (Priority: P2)

Un estudiante autenticado accede a la seccion "Mis Datos" en su perfil y puede ver todos
sus datos personales almacenados por ITSEIA. Puede exportar sus datos en formato JSON
(derecho de portabilidad LOPDP Art. 20) y puede enviar una solicitud formal de eliminacion
de sus datos (derecho al olvido LOPDP Art. 21). La solicitud queda registrada para gestion
por el admin dentro del plazo legal de 15 dias habiles.

**Why this priority**: Los derechos ARCO (Acceso, Rectificacion, Cancelacion, Oposicion)
son obligatorios bajo la LOPDP. El mecanismo para ejercerlos debe estar disponible en la
plataforma. Su ausencia es una infraccion directa de la ley, independientemente del tamaño
de la institucion.

**Independent Test**: Un estudiante puede ver sus datos en "Mis Datos", descargar el JSON
con sus datos personales, y enviar una solicitud de eliminacion que queda registrada en
el panel admin.

**Acceptance Scenarios**:

1. **Given** estudiante autenticado, **When** accede a "Configuracion > Mis Datos",
   **Then** ve listado de sus datos personales almacenados: nombre, correo, cedula,
   historial academico, registros de acceso y consentimientos otorgados.
2. **Given** estudiante en "Mis Datos", **When** hace click en "Exportar mis datos",
   **Then** el sistema genera y descarga en menos de 60 segundos un archivo JSON con
   todos sus datos personales en formato legible.
3. **Given** estudiante que desea eliminar su cuenta, **When** hace click en "Solicitar
   eliminacion de datos", **Then** ve formulario de confirmacion, envia la solicitud y
   recibe confirmacion de que la solicitud fue recibida y sera atendida en 15 dias habiles.
4. **Given** estudiante con datos incorrectos, **When** accede a "Mis Datos" y edita
   sus datos personales basicos (nombre, correo), **Then** el cambio queda guardado y
   registrado con timestamp (derecho de rectificacion).

---

### User Story 3 — Admin gestiona solicitudes de datos con panel de respuesta en <15 dias (Priority: P2)

El admin tiene un panel dedicado que lista todas las solicitudes de datos recibidas
(exportacion, eliminacion, rectificacion). Cada solicitud muestra el tipo, fecha de
recepcion, plazo legal de respuesta (15 dias habiles desde recepcion), estudiante
solicitante y estado (pendiente, en proceso, resuelto). El sistema envia alertas cuando
una solicitud se acerca al vencimiento del plazo.

**Why this priority**: La LOPDP establece un plazo maximo de 15 dias habiles para atender
solicitudes de derechos. El incumplimiento del plazo es sancionable. El panel garantiza
que ninguna solicitud se pierda en el flujo operativo del instituto.

**Independent Test**: Una solicitud de eliminacion enviada por un estudiante aparece
inmediatamente en el panel admin con el plazo de respuesta calculado correctamente.

**Acceptance Scenarios**:

1. **Given** solicitud de datos enviada por estudiante, **When** admin accede al panel
   de solicitudes, **Then** ve la solicitud listada con: tipo, fecha, estudiante, plazo
   legal de vencimiento (15 dias habiles desde recepcion) y estado "Pendiente".
2. **Given** solicitud con menos de 3 dias habiles para vencer, **When** el sistema
   revisa los plazos, **Then** envia alerta de urgencia al admin dentro de la plataforma.
3. **Given** admin resuelve una solicitud de eliminacion, **When** la marca como
   "Resuelto" con fecha, **Then** el sistema registra la resolucion y queda en el log
   de cumplimiento con fecha de atencion.

---

### Edge Cases

- Estudiante solicita eliminacion de datos pero tiene deudas pendientes o carrera en
  curso: el sistema recibe la solicitud pero el admin puede marcarla como "Retencion
  legal justificada" con nota explicativa, segun permite la LOPDP para obligaciones
  contractuales en curso.
- Estudiante menor de edad (18 años) al registrarse: el sistema debe requerir
  consentimiento del representante legal — marcado como necesita clarificacion
  institucional sobre la poblacion objetivo.
- Solicitud de datos de estudiante que ya fue eliminado: el sistema responde con
  confirmacion de que los datos fueron eliminados en la fecha indicada (se mantiene
  solo el log de eliminacion, no los datos).
- Version de politica de privacidad actualizada: el sistema debe guardar el historial
  de versiones y que version acepto cada usuario.
- Exportacion de datos de estudiante con historial academico muy extenso (>1000 registros):
  el sistema procesa en segundo plano y notifica al estudiante cuando el archivo esta listo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST mostrar un checkbox de consentimiento NO pre-marcado durante
  el registro, con enlace a la politica de privacidad completa, bloqueando el registro
  si no se acepta.
- **FR-002**: System MUST almacenar un registro de consentimiento por usuario que incluya:
  user_id, version de politica, timestamp, IP de origen.
- **FR-003**: System MUST mantener pagina /privacidad accesible publicamente (sin login)
  con la politica de privacidad vigente de ITSEIA.
- **FR-004**: System MUST ofrecer en el perfil del usuario una seccion "Mis Datos"
  donde pueda ver todos sus datos personales almacenados.
- **FR-005**: Users MUST poder exportar todos sus datos personales en formato JSON
  descargable en menos de 60 segundos desde "Mis Datos".
- **FR-006**: Users MUST poder enviar solicitud formal de eliminacion de datos desde
  "Mis Datos", con confirmacion de recepcion.
- **FR-007**: System MUST registrar todas las solicitudes de datos (exportacion,
  eliminacion, rectificacion) en una tabla DataRequest con estado y fecha.
- **FR-008**: System MUST mostrar al admin un panel de solicitudes de datos con estado,
  tipo, solicitante, fecha de recepcion y plazo legal de respuesta (15 dias habiles).
- **FR-009**: System MUST generar alerta para el admin cuando una solicitud de datos
  tiene menos de 3 dias habiles para vencer su plazo legal.
- **FR-010**: System MUST solicitar nueva aceptacion de politica de privacidad a usuarios
  existentes cuando se publica una nueva version.

### Key Entities

- **ConsentRecord**: Registro de consentimiento dado por un usuario (user_id,
  policy_version, accepted_at, ip_address, user_agent). Evidencia legal del consentimiento.
- **DataRequest**: Solicitud de ejercicio de derechos LOPDP (user_id, type:
  export/delete/rectify/oppose, status: pending/in_progress/resolved, requested_at,
  resolved_at, resolution_notes, legal_hold_reason). Trazabilidad de cumplimiento.

## Assumptions & Dependencies

- **A1**: La politica de privacidad de ITSEIA sera redactada por el Director Legal antes
  de la apertura al publico; la plataforma solo la aloja y versiona.
- **A2**: El plazo de 15 dias habiles se calcula automaticamente excluyendo sabados,
  domingos y feriados nacionales de Ecuador.
- **A3**: La eliminacion de datos de un estudiante es logica en primera instancia (datos
  marcados como eliminados) y fisica despues de 30 dias de confirmacion, para permitir
  reversiones ante errores.
- **A4**: Los datos academicos minimos (notas, certificados emitidos) pueden retenerse
  por obligacion legal aunque el estudiante solicite eliminacion, segun LOPDP Art. 21.
- **D1**: Sistema de autenticacion y perfiles de usuario debe estar operativo — depende
  de 001-platform-foundation.
- **D2**: El endpoint /privacidad debe estar configurado en la arquitectura de rutas
  de la plataforma antes del primer registro de usuario real.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los usuarios registrados tiene un ConsentRecord valido con
  timestamp e IP almacenado; ninguna cuenta existe sin consentimiento previo.
- **SC-002**: Un estudiante puede exportar todos sus datos personales en formato JSON
  en menos de 60 segundos desde que hace click en "Exportar mis datos".
- **SC-003**: El 100% de las solicitudes de datos recibidas aparecen en el panel admin
  dentro de los 5 minutos posteriores a su envio.
- **SC-004**: Cero solicitudes de datos vencen el plazo legal de 15 dias habiles sin
  una alerta enviada al admin con al menos 3 dias de anticipacion.
- **SC-005**: La pagina /privacidad esta accesible publicamente sin autenticacion y
  muestra la version vigente de la politica, verificable como evidencia de cumplimiento
  ante cualquier auditoria LOPDP.
