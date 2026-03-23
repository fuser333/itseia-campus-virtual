# Feature Specification: Foros de Discusion por Materia

**Feature Branch**: `003-discussion-forums`
**Created**: 2026-03-22
**Status**: Draft
**Input**: Foros de discusion asincronica por materia para cumplir Art. 61 RRA 2022 — herramientas de comunicacion asincronica exigidas por CES

## Institutional Alignment *(mandatory)*

### Source Inputs

- `docs/ces_aprobacion/INVESTIGACION_REQUISITOS_CES_ONLINE.md` — Art. 61 RRA 2022: herramientas de comunicacion asincronica obligatorias
- `docs/ces_aprobacion/02_ARQUITECTURA_MODERNA.md` — Decision Supabase Realtime como capa de mensajeria
- `docs/roadmap/fases.md` — Fase 3: Campus virtual base
- `.specify/memory/constitution.md` — Principio VI (CES Compliance by Design)
- Reglamento RRA 2022 Art. 61: plataforma debe ofrecer mecanismos de interaccion asincronica entre estudiantes y docentes

### Phase Fit

- **Roadmap Phase**: Fase 3 (Campus virtual base)
- **Why now**: El Art. 61 RRA 2022 exige explicitamente herramientas de comunicacion asincronica como parte del entorno virtual de aprendizaje. Sin foros documentados, el CES puede objetar la modalidad en linea durante la inspeccion. Ademas, los foros generan la evidencia de participacion activa que SENESCYT solicita en auditorias.
- **Out of scope**:
  - Chat en tiempo real entre estudiantes individuales (mensajeria privada — fase posterior)
  - Videoforos o respuestas en formato video
  - Sistema de calificacion de respuestas tipo Stack Overflow
  - Integracion con email para notificaciones externas (fase 4)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Estudiante publica pregunta en su foro de materia (Priority: P1)

Un estudiante autenticado ingresa a la pagina de su materia, navega al tab "Foro", y puede
escribir una pregunta o comentario. El mensaje aparece inmediatamente en el foro para todos
los participantes de esa materia (compañeros y docente). Otros estudiantes y el docente
pueden responder de forma anidada.

**Why this priority**: Es el flujo central que satisface el Art. 61 RRA 2022. Sin la
capacidad de publicar y responder, no existe herramienta de comunicacion asincronica.

**Independent Test**: Un estudiante puede publicar un mensaje en el foro de una materia y
otro estudiante puede verlo y responder, todo dentro de la misma sesion de navegador, sin
configuracion adicional.

**Acceptance Scenarios**:

1. **Given** estudiante autenticado en su materia, **When** escribe un mensaje en el foro y
   hace click en "Publicar", **Then** el mensaje aparece en el foro visible para todos los
   participantes de esa materia en menos de 2 segundos.
2. **Given** mensaje publicado en el foro, **When** otro participante hace click en
   "Responder", **Then** puede escribir una respuesta anidada bajo el mensaje original.
3. **Given** estudiante de materia A, **When** intenta acceder al foro de materia B donde
   no esta matriculado, **Then** el sistema le niega el acceso y muestra mensaje de
   restriccion.
4. **Given** foro con mensajes existentes, **When** estudiante entra al foro, **Then** ve
   los mensajes ordenados por fecha descendente con autor, hora y contenido visibles.

---

### User Story 2 — Docente modera el foro (Priority: P2)

El docente asignado a una materia puede fijar mensajes importantes al tope del foro
(anuncios, recursos clave) y eliminar contenido inapropiado o spam. Tiene visibilidad
completa de toda la actividad del foro de sus materias.

**Why this priority**: La moderacion docente es requisito implicito del CES para garantizar
la calidad del espacio de aprendizaje. Sin moderacion, el foro no puede funcionar como
herramienta academica valida.

**Independent Test**: Un docente puede fijar un mensaje y este aparece al tope del foro, y
puede eliminar un mensaje de spam sin que los estudiantes tengan esa opcion.

**Acceptance Scenarios**:

1. **Given** docente autenticado en su materia, **When** hace click en "Fijar" sobre un
   mensaje, **Then** ese mensaje se mueve al tope del foro y muestra insignia "Fijado".
2. **Given** docente ve un mensaje inapropiado, **When** hace click en "Eliminar",
   **Then** el mensaje desaparece del foro con confirmacion de la accion.
3. **Given** estudiante autenticado, **When** ve opciones disponibles en mensajes de
   compañeros, **Then** NO ve las opciones "Fijar" ni "Eliminar" (solo disponibles para
   docentes y admin).

---

### User Story 3 — Admin monitorea actividad de foros como metrica (Priority: P3)

El admin (Hector) accede a un panel que muestra metricas de participacion en foros: numero
de mensajes por materia, porcentaje de estudiantes que han publicado al menos una vez,
materias con foros inactivos. Esta informacion sirve como evidencia de interaccion para
reportes SENESCYT.

**Why this priority**: SENESCYT solicita evidencia de participacion activa en auditorias
de educacion en linea. Las metricas de foros son la prueba documental de que la comunicacion
asincronica efectivamente ocurre.

**Independent Test**: El panel admin muestra datos reales de al menos una materia con
actividad de foro, incluyendo conteo de mensajes y participantes unicos.

**Acceptance Scenarios**:

1. **Given** admin autenticado, **When** accede al panel de metricas de foros,
   **Then** ve por materia: total mensajes, participantes unicos, ultimo mensaje, tasa de
   participacion (% estudiantes que han publicado).
2. **Given** materia sin actividad en foro en los ultimos 7 dias, **When** admin revisa
   el panel, **Then** esa materia aparece marcada con alerta de "Foro inactivo".

---

### Edge Cases

- Estudiante intenta publicar mensaje vacio: el sistema muestra validacion y no permite
  la publicacion.
- Docente es reasignado a otra materia: pierde permisos de moderacion en la materia
  anterior y los gana en la nueva.
- Mensaje con contenido muy largo (>5000 caracteres): el sistema acepta pero muestra
  un preview con opcion "Ver mas".
- Estudiante dado de baja de la materia: pierde acceso al foro pero sus mensajes
  historicos permanecen visibles para el docente.
- Multiples respuestas simultaneas al mismo mensaje: el sistema maneja concurrencia
  y muestra todas las respuestas correctamente ordenadas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST crear automaticamente un foro por cada materia activa en la
  plataforma, accesible desde la pagina de la materia.
- **FR-002**: System MUST mostrar mensajes nuevos en el foro en menos de 2 segundos
  despues de ser publicados, sin recargar la pagina.
- **FR-003**: System MUST soportar hilos de respuesta anidados (un nivel de profundidad
  minimo: mensaje original y sus respuestas directas).
- **FR-004**: System MUST restringir el acceso a cada foro unicamente a estudiantes
  matriculados en esa materia, el docente asignado y el admin.
- **FR-005**: System MUST permitir al docente asignado fijar mensajes al tope del foro
  y eliminar cualquier mensaje del foro de su materia.
- **FR-006**: System MUST mostrar en cada mensaje: nombre del autor, foto de perfil,
  fecha y hora de publicacion (hora Ecuador UTC-5).
- **FR-007**: System MUST ofrecer busqueda de mensajes dentro del foro de una materia
  por palabras clave.
- **FR-008**: System MUST notificar al docente cuando un estudiante publica en el foro
  de su materia (notificacion dentro de la plataforma).
- **FR-009**: System MUST registrar metricas de participacion (mensajes por materia,
  participantes unicos) accesibles en el panel admin.
- **FR-010**: System MUST impedir que un estudiante elimine mensajes de otros
  participantes; solo puede eliminar sus propios mensajes.

### Key Entities

- **ForumPost**: Mensaje principal en el foro de una materia (subject_id, user_id,
  content, pinned, created_at, updated_at). Punto de entrada de cada hilo de discusion.
- **ForumReply**: Respuesta a un ForumPost (post_id, user_id, content, created_at).
  Relacionada al ForumPost padre mediante post_id.

## Assumptions & Dependencies

- **A1**: Supabase Realtime channels es suficiente para entregar mensajes en <2 segundos
  con la concurrencia esperada en el piloto (<50 estudiantes simultaneos).
- **A2**: Un nivel de anidacion (mensaje + respuestas directas) es suficiente para el
  uso academico; no se requieren hilos multi-nivel en esta fase.
- **A3**: Las notificaciones son internas a la plataforma (badge/contador); el email
  de notificaciones se implementa en una fase posterior.
- **D1**: Sistema de autenticacion y roles (estudiante, docente, admin) debe estar
  operativo — depende de 001-platform-foundation.
- **D2**: Modelo de materias y matriculacion debe existir en Supabase para poder
  vincular cada foro a su materia y verificar permisos de acceso.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un mensaje publicado por un estudiante es visible para el docente y
  otros compañeros en menos de 2 segundos sin recargar la pagina.
- **SC-002**: El 80% de los estudiantes activos publica al menos un mensaje en el
  foro de alguna de sus materias durante la primera semana de uso.
- **SC-003**: El docente puede fijar y eliminar mensajes en menos de 3 clicks desde
  la vista del foro.
- **SC-004**: El panel admin muestra datos de participacion actualizados para todas
  las materias activas, exportables como evidencia para SENESCYT.
- **SC-005**: Ningún estudiante puede ver ni participar en el foro de una materia
  en la que no esta matriculado (0% accesos no autorizados).
