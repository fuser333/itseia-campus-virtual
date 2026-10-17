# Feature Specification: ITSEIA Platform Foundation

**Feature Branch**: `001-platform-foundation`  
**Created**: 2026-03-21  
**Status**: Draft  
**Input**: User description: "Crear la base del proyecto ITSEIA para una plataforma educativa institucional con sitio publico, panel administrativo, portal docente y portal estudiantil, organizada por fases y preparada para implementacion en Next.js, Supabase y shadcn/ui"

## Institutional Alignment *(mandatory)*

### Source Inputs

- `docs/contexto/institucional.md`
- `docs/roadmap/fases.md`
- `docs/arquitectura/base-tecnica.md`
- `ESTRUCTURA_COMPLETA.md`

### Phase Fit

- **Roadmap Phase**: Fase 0
- **Why now**: ITSEIA todavia no tiene una plataforma implementada. Antes de construir campus
  virtual, AI Lab o modulos financieros, necesita una base ordenada que convierta la vision
  institucional en un MVP ejecutable y versionable.
- **Out of scope**: LMS completo, AI Lab multi-modelo, pagos en linea, facturacion electronica,
  app movil, bolsa de empleo y automatizaciones comerciales avanzadas.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Descubrir la oferta y postular (Priority: P1)

Como aspirante, quiero entender rapidamente la propuesta del instituto, revisar las carreras y
dejar mis datos o postularme, para iniciar el proceso de admision sin depender de mensajes
manuales.

**Why this priority**: Sin captacion y preinscripcion no existe validacion comercial ni embudo
real para la apertura institucional.

**Independent Test**: Un usuario nuevo puede entrar al sitio, revisar una carrera y enviar una
preinscripcion valida sin iniciar sesion ni pedir ayuda interna.

**Acceptance Scenarios**:

1. **Given** un visitante entra a la pagina publica, **When** navega a la seccion de carreras,
   **Then** puede ver la propuesta academica de IA, Ciencia de Datos y Big Data e Inteligencia de
   Negocio con informacion consistente.
2. **Given** un aspirante completa el formulario de preinscripcion, **When** envia datos validos,
   **Then** el sistema registra el lead o postulacion, confirma recepcion y deja trazabilidad para
   seguimiento administrativo.

---

### User Story 2 - Operar la base academica y administrativa (Priority: P2)

Como super admin o coordinacion academica, quiero gestionar carreras, periodos, cohortes,
usuarios y postulaciones, para operar el instituto desde una sola base institucional.

**Why this priority**: Sin catalogo academico, roles y control de postulaciones no se puede pasar
de marketing a operacion institucional.

**Independent Test**: Un administrador autenticado puede crear la estructura academica minima y
revisar el embudo de postulantes sin requerir soporte tecnico.

**Acceptance Scenarios**:

1. **Given** un administrador autenticado, **When** crea o edita una carrera, periodo academico y
   cohorte, **Then** la informacion queda disponible para uso interno y asociacion posterior con
   estudiantes y docentes.
2. **Given** existen leads o postulantes registrados, **When** el administrador revisa el panel de
   admisiones, **Then** puede consultar estado, fuente, datos de contacto y siguiente accion
   operativa.

---

### User Story 3 - Entrar al portal segun el rol (Priority: P3)

Como docente o estudiante, quiero ingresar a un portal que reconozca mi rol y me muestre un
dashboard base, para validar que la plataforma ya tiene una estructura operativa lista para
expandirse hacia campus virtual.

**Why this priority**: Permite cerrar la base del sistema compartido y comprobar desde temprano el
modelo de acceso por roles.

**Independent Test**: Un estudiante y un docente con cuentas validas pueden iniciar sesion y ver
su espacio inicial sin acceder a areas de otros roles.

**Acceptance Scenarios**:

1. **Given** un estudiante autenticado y asignado a una cohorte, **When** entra al portal,
   **Then** visualiza su resumen academico base y no puede acceder a vistas administrativas.
2. **Given** un docente autenticado con asignaciones activas, **When** entra al portal, **Then**
   visualiza sus materias o cohortes asignadas y no puede acceder a flujos de finanzas o super
   admin.

---

### Edge Cases

- Que ocurre si un lead intenta enviar el formulario dos veces con el mismo correo?
- Como se comporta el sistema si una persona tiene mas de un rol institucional?
- Que pasa si un usuario autenticado no tiene cohorte o asignacion docente activa?
- Como se protege el acceso cuando un rol es removido o desactivado?
- Como se mantiene la consistencia si una carrera cambia despues de abrir un periodo academico?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST publicar un sitio institucional con informacion del instituto y de las
  tres carreras iniciales.
- **FR-002**: System MUST capturar leads y preinscripciones con fecha, origen, estado y datos de
  contacto.
- **FR-003**: System MUST permitir a administracion gestionar carreras, periodos academicos y
  cohortes iniciales.
- **FR-004**: System MUST mantener un registro unico de personas y sus asignaciones de rol.
- **FR-005**: System MUST restringir acceso a vistas y acciones segun rol institucional.
- **FR-006**: System MUST permitir revisar y actualizar el estado operativo de leads y
  postulaciones.
- **FR-007**: System MUST permitir asociar una persona admitida a una carrera y cohorte.
- **FR-008**: System MUST ofrecer un dashboard base para estudiante con informacion resumida de su
  perfil academico inicial.
- **FR-009**: System MUST ofrecer un dashboard base para docente con informacion resumida de sus
  asignaciones iniciales.
- **FR-010**: System MUST mantener trazabilidad de cambios relevantes en estados de postulacion,
  roles y asociaciones academicas.
- **FR-011**: System MUST preparar la estructura para futuras capacidades de campus virtual sin
  exigir su implementacion en este MVP.
- **FR-012**: System MUST operar con contenido y etiquetas en espanol y con contexto academico de
  Ecuador.

### Key Entities *(include if feature involves data)*

- **Lead**: Persona interesada que deja datos para seguimiento comercial o admision.
- **Applicant**: Lead avanzado al flujo de postulacion con estado operativo y destino academico.
- **Person**: Registro canonico de un individuo que puede convertirse en postulante, estudiante,
  docente o administrador.
- **RoleAssignment**: Relacion entre una persona y un rol institucional con vigencia y estado.
- **Program**: Carrera ofertada por ITSEIA.
- **AcademicPeriod**: Periodo academico ordinario usado para organizar oferta y cohortes.
- **Cohort**: Grupo operativo de estudiantes asociado a un programa y periodo.
- **StudentProfile**: Extension de persona para operacion estudiantil.
- **TeacherProfile**: Extension de persona para operacion docente.

## Assumptions & Dependencies

- **Assumption A1**: El lanzamiento inicial opera sobre una sola sede y un solo contexto horario.
- **Assumption A2**: La primera version usa una sola aplicacion web para sitio publico y portal
  autenticado.
- **Assumption A3**: El campus virtual profundo y el modulo financiero completo se implementaran
  despues del MVP fundacional.
- **Dependency D1**: Se requiere contenido institucional definitivo para paginas publicas,
  carreras y mensajes de admision.
- **Dependency D2**: La politica de roles y responsables operativos debe ser validada por ITSEIA
  antes de abrir modulos administrativos a usuarios reales.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un aspirante puede completar la preinscripcion inicial en menos de 10 minutos sin
  ayuda manual.
- **SC-002**: Un administrador puede crear las 3 carreras, 1 periodo activo y al menos 1 cohorte
  por carrera sin intervencion de desarrollo.
- **SC-003**: El control de acceso por roles bloquea el acceso no autorizado en el 100% de los
  escenarios criticos validados del MVP.
- **SC-004**: El equipo administrativo puede localizar un lead o postulante por nombre o correo en
  menos de 1 minuto.
- **SC-005**: Al menos el 90% de los usuarios piloto de estudiante y docente acceden a su
  dashboard correcto en el primer intento durante validacion interna.
