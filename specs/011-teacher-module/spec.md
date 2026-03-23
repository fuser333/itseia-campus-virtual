# Feature Specification: Modulo Docente Completo

**Feature Branch**: `011-teacher-module`
**Created**: 2026-03-23
**Status**: Draft
**Input**: Consolidar y completar el modulo docente existente con capacitacion 120h CES,
editor de contenido mejorado, analytics pedagogico y herramientas de comunicacion.

## Institutional Alignment *(mandatory)*

### Source Inputs

- `docs/ces_aprobacion/INVESTIGACION_REQUISITOS_CES_ONLINE.md` — Art. 57, 61, 62 RRA 2022
- `docs/ces_aprobacion/01_REQUISITOS_CES.md` — requisito: docentes con 120h capacitacion
- `docs/ces_aprobacion/03_PLAN_APROBACION.md` — plan de evidencias para SENESCYT
- `docs/roadmap/fases.md` — Fase 3: Campus virtual base (panel docente)
- `.specify/memory/constitution.md` — Principio VI (CES Compliance), VIII (Content Quality)
- Reglamento IST RPC-SE-04-No.012-2023: Art. 61 — docentes deben acreditar formacion en
  docencia virtual como requisito de contratacion y operacion en modalidad en linea.
- `specs/003-discussion-forums/spec.md` — foros ya implementados (out of scope aqui)
- `specs/002-sync-videoconference/spec.md` — videoconferencia ya especificada (out of scope)
- `specs/007-attendance-tracking/spec.md` — asistencia ya implementada (extiende aqui)

### Phase Fit

- **Roadmap Phase**: Fase 3 (Campus virtual base)
- **Why now**: El modulo docente es una de las tres patas del campus virtual (junto con el
  dashboard de estudiante y la infraestructura de videoconferencia). Sin el modulo docente
  completo, los profesores no pueden gestionar contenido con calidad, no hay evidencia de
  capacitacion para CES, y los estudiantes no reciben intervencion temprana cuando van
  retrasados. Este spec convierte el codigo parcial existente en un modulo coherente,
  auditado y listo para CES.
- **Out of scope**:
  - Videconferencia embebida (spec 002)
  - Foros de discusion (spec 003)
  - Sistema de notas y calificaciones formales (spec a definir en Fase 4)
  - Transcripcion automatica de clases con IA (Fase 4 diferenciacion)
  - Matching estudiantes-empresas (Fase 5)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Docente completa su capacitacion de 120h (Priority: P1)

Un docente recien contratado entra al panel docente y ve una seccion "Mi Capacitacion" que
le muestra el requerimiento CES de 120 horas de formacion en docencia virtual. La plataforma
le ofrece el curso completo "Docencia Virtual Efectiva" directamente dentro del campus, con
modulos autodirigidos sobre uso del LMS, creacion de contenido, evaluacion en linea y
herramientas IA. A medida que completa modulos, su contador de horas avanza. Al llegar a
120h, el sistema genera automaticamente su certificado digital descargable en PDF. El
coordinador puede ver en el panel admin el estado de capacitacion de cada docente sin
necesitar hojas de calculo externas.

**Why this priority**: El Art. 61 RRA 2022 exige que los docentes de modalidad en linea
tengan certificacion en docencia virtual. Sin evidencia de este requisito, el expediente CES
queda incompleto. Es el diferenciador operativo de ITSEIA: no solo exige la capacitacion,
la provee desde la misma plataforma que los docentes usaran para ensenar.

**Independent Test**: Un docente puede crear cuenta, acceder al curso de capacitacion,
completar un modulo, ver su progreso en horas, y un admin puede ver ese progreso en su panel.

**Acceptance Scenarios**:

1. **Given** docente autenticado en el panel, **When** accede a la seccion "Mi Capacitacion",
   **Then** ve el curso "Docencia Virtual Efectiva" con sus modulos, el total de horas
   acreditadas hasta ahora y la barra de progreso hacia las 120h.
2. **Given** docente que completa un modulo de capacitacion, **When** el sistema registra la
   finalizacion, **Then** las horas de ese modulo se suman al contador y la barra de progreso
   se actualiza en tiempo real.
3. **Given** docente que alcanza exactamente 120h acumuladas, **When** el sistema detecta el
   hito, **Then** genera automaticamente un certificado PDF con nombre del docente, fecha,
   numero de horas y firma institucional de ITSEIA, disponible para descarga inmediata.
4. **Given** coordinador academico autenticado, **When** accede al reporte de capacitacion
   docente, **Then** ve una tabla con todos los docentes activos, sus horas completadas,
   porcentaje de avance y estado (En progreso / Certificado), exportable a CSV para CES.
5. **Given** docente sin 120h completadas asignado a una materia activa, **When** el admin
   genera el reporte CES de docentes, **Then** esa fila aparece marcada en amarillo con
   indicador "Requiere completar capacitacion".

---

### User Story 2 - Docente crea contenido de sesion con calidad verificable (Priority: P1)

Un docente accede al editor de sesion de una materia asignada. En el tab de video pega una
URL de YouTube: el sistema valida en tiempo real si el video existe y es accesible, y muestra
una previsualizacion embebida. En el tab de teoria, escribe contenido en markdown con un
editor split-screen que muestra la vista renderizada en paralelo; el sistema le muestra un
indicador de "Calidad de contenido" que sube a verde cuando el texto supera 1500 palabras
con estructura adecuada. En el tab de ejercicio, construye la rubrica de evaluacion definiendo
criterios y pesos. Al terminar, ve un indicador visual de "Sesion completa" cuando los 7 tipos
de contenido estan presentes (Constitution Principio VIII).

**Why this priority**: La calidad del contenido es el producto de ITSEIA. Un docente que no
sabe si su video funciona o si su teoria es suficientemente larga produce sesiones deficientes
sin saberlo. El editor mejorado cierra ese gap con feedback inmediato.

**Independent Test**: Docente puede editar una sesion con todos los tipos de contenido,
recibir feedback de calidad en pantalla, y el sistema registra el estado de completitud de
la sesion.

**Acceptance Scenarios**:

1. **Given** docente pegando URL de YouTube, **When** la URL es valida y el video existe,
   **Then** aparece previsualizacion embebida en tiempo real y una etiqueta verde "Video
   verificado"; si la URL es invalida o el video no existe, aparece etiqueta roja "URL no
   valida" sin bloquear el guardado.
2. **Given** docente escribiendo teoria en markdown, **When** el contenido supera 1500 palabras,
   **Then** el contador de palabras cambia de rojo a verde y aparece la etiqueta "Contenido
   suficiente"; cuando esta por debajo muestra el deficit: "Faltan X palabras para el minimo".
3. **Given** docente en el tab de ejercicio, **When** activa el modo "Con rubrica", **Then**
   puede agregar criterios de evaluacion con nombre, descripcion y peso porcentual; el sistema
   valida que los pesos sumen 100% antes de permitir guardar.
4. **Given** sesion con los 7 tipos de contenido completados (video, slides, teoria, quiz,
   ejercicio, AI Lab, recursos), **When** el docente ve el estado de la sesion, **Then** un
   indicador circular verde con icono de check marca la sesion como "Completa segun CES".
5. **Given** sesion incompleta con algunos tipos de contenido faltantes, **When** docente ve
   el estado, **Then** cada tipo faltante muestra un icono de advertencia con el nombre del
   contenido que falta, sin bloquear la publicacion.

---

### User Story 3 - Docente identifica estudiantes en riesgo con analytics (Priority: P2)

Un docente entra a la seccion "Analytics" de su panel. Ve una vista de "Estudiantes en riesgo"
que lista automaticamente a los estudiantes que cumplen al menos uno de los criterios de
riesgo: mas de 30% de sesiones no completadas, nota promedio en quizzes por debajo de 60%,
o mas de 2 inasistencias consecutivas a clases sincronicas. Para cada estudiante en riesgo,
ve el criterio que lo activo y puede registrar una intervencion (nota interna). Ademas, ve
un grafico de "Preguntas de quiz mas falladas" por materia, que le ayuda a identificar que
temas necesitan refuerzo.

**Why this priority**: La deteccion temprana de estudiantes en riesgo es un requisito de
tutoria del Art. 61 RRA 2022 y es el mecanismo que convierte al campus virtual en una
experiencia de soporte real, no solo de entrega de contenido.

**Independent Test**: Un docente puede ver la lista de estudiantes en riesgo para una materia
con datos reales, y registrar una intervencion para un estudiante especifico.

**Acceptance Scenarios**:

1. **Given** docente en la seccion Analytics, **When** selecciona una materia, **Then** ve
   la tabla de estudiantes en riesgo con columnas: nombre, criterio de riesgo activado,
   ultimo acceso y accion.
2. **Given** tabla de estudiantes en riesgo, **When** docente hace click en "Registrar
   intervencion" para un estudiante, **Then** se abre un campo de texto donde puede escribir
   una nota interna (no visible al estudiante) que queda registrada con fecha y hora.
3. **Given** materia con al menos un quiz respondido, **When** docente accede al grafico de
   preguntas, **Then** ve las preguntas ordenadas de mayor a menor tasa de error, con el
   porcentaje de estudiantes que la respondio incorrectamente.
4. **Given** docente en Analytics, **When** accede a "Engagement por sesion", **Then** ve
   para cada sesion el tiempo promedio que los estudiantes pasaron en ella y el porcentaje
   que completo el contenido, permitiendo identificar sesiones con alta desercion.

---

### User Story 4 - Docente envia anuncios a sus estudiantes (Priority: P2)

Un docente necesita comunicar un cambio en la fecha de entrega de un ejercicio. Entra a la
seccion "Comunicacion" de su panel, redacta un anuncio, selecciona la materia destinataria y
lo publica. Todos los estudiantes de esa materia ven el anuncio en su dashboard con un indicador
de "Nuevo". Alternativamente, el docente puede enviar un mensaje directo a un estudiante
especifico para un seguimiento personalizado.

**Why this priority**: Art. 61 RRA 2022 exige interaccion asincronica docente-estudiante.
Los anuncios son la forma mas simple y auditada de cumplir ese requisito sin depender de
canales externos como WhatsApp o email informal.

**Independent Test**: Docente publica un anuncio, estudiante lo ve en su dashboard marcado
como nuevo, y el sistema registra la fecha de publicacion.

**Acceptance Scenarios**:

1. **Given** docente en la seccion Comunicacion, **When** crea un anuncio con titulo,
   cuerpo y materia seleccionada, **Then** el anuncio queda publicado y visible para todos
   los estudiantes matriculados en esa materia.
2. **Given** anuncio publicado, **When** estudiante accede a su dashboard, **Then** ve el
   anuncio con etiqueta "Nuevo" hasta que lo abra; al abrirlo, la etiqueta desaparece.
3. **Given** docente que quiere contactar a un estudiante especifico, **When** selecciona
   al estudiante desde la lista de su materia y redacta un mensaje, **Then** el mensaje llega
   al buzon privado del estudiante dentro de la plataforma.
4. **Given** docente que revisa sus anuncios pasados, **When** accede al historial de
   comunicaciones, **Then** ve la lista de anuncios con fecha, materia, cantidad de
   visualizaciones y opcion de editar o archivar.

---

### User Story 5 - Coordinador verifica estado de capacitacion docente para CES (Priority: P3)

El coordinador academico necesita preparar la documentacion de docentes para el expediente
CES. Accede al panel admin, secccion "Docentes - Capacitacion", y ve un reporte con todos
los docentes activos, sus horas acumuladas en el curso de capacitacion y si tienen o no el
certificado de 120h. Puede exportar este reporte directamente a PDF para adjuntarlo al
expediente CES sin necesitar hojas de calculo externas.

**Why this priority**: La evidencia documental de capacitacion docente es un requisito
verificable en la inspeccion CES. El reporte exportable convierte la base de datos en
evidencia oficial en minutos.

**Independent Test**: Coordinador accede al reporte, ve datos reales de al menos un docente,
y puede descargar el PDF exportado.

**Acceptance Scenarios**:

1. **Given** coordinador autenticado, **When** accede al reporte de capacitacion docente,
   **Then** ve tabla con: nombre docente, materias asignadas, horas completadas, fecha
   certificado (si aplica), y estado de cumplimiento.
2. **Given** reporte con datos, **When** coordinador hace click en "Exportar PDF",
   **Then** se descarga un PDF con encabezado institucional ITSEIA, tabla de docentes,
   fecha de generacion y leyenda de requisito Art. 61 RRA 2022.
3. **Given** docente que completa sus 120h, **When** el sistema genera el certificado,
   **Then** el coordinador puede tambien descargar ese certificado desde el panel admin
   sin necesitar pedirlo al docente.

---

### Edge Cases

- Docente asignado a materia sin haber completado 120h: el sistema permite la asignacion
  pero marca una advertencia visible solo para el coordinador, sin bloquear la operacion
  (la restriccion operativa depende de decision institucional, no tecnica).
- Video de YouTube con URL valida pero contenido privado o eliminado: el validador detecta
  el error de embed (onerror del iframe) y cambia el estado a "Video no accesible" tras
  el intento de carga.
- Docente que tiene mas de 120h de capacitacion por cursos previos: el sistema permite al
  coordinador registrar horas externas validadas manualmente, que se suman al contador.
- Anuncio enviado a materia con cero estudiantes matriculados: el sistema lo guarda sin
  error pero muestra aviso "Esta materia no tiene estudiantes activos".
- Docente sin materias asignadas accede al modulo de analytics: se muestra estado vacio con
  mensaje explicativo, sin errores de UI.
- Multiples docentes asignados a la misma materia (cobertura): ambos ven la misma materia
  en su panel y pueden editar contenido; el historial de cambios registra quien realizo cada
  modificacion.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST proporcionar un curso de capacitacion "Docencia Virtual Efectiva"
  con modulos autodirigidos directamente dentro del campus, accesible desde el panel docente.
- **FR-002**: System MUST rastrear las horas completadas por cada docente en el curso de
  capacitacion y mostrar el progreso hacia las 120h requeridas por CES.
- **FR-003**: System MUST generar automaticamente un certificado PDF con datos del docente,
  fecha e institucion cuando el docente alcanza 120h acumuladas de capacitacion.
- **FR-004**: System MUST validar en tiempo real si una URL de YouTube es accesible y mostrar
  previsualizacion embebida antes de guardar.
- **FR-005**: System MUST mostrar un contador de palabras y un indicador de calidad (rojo/verde)
  en el editor de teoria, con umbral minimo de 1500 palabras segun Principio VIII.
- **FR-006**: System MUST permitir a los docentes construir rubricas de evaluacion con
  criterios, descripciones y pesos porcentuales que sumen 100%, asociadas a cada ejercicio.
- **FR-007**: System MUST mostrar un indicador de completitud de sesion verificando los 7
  tipos de contenido requeridos por la Constitution (Principio VIII): video, slides, teoria,
  quiz, ejercicio, AI Lab, recursos.
- **FR-008**: System MUST identificar y listar automaticamente estudiantes en riesgo segun
  tres criterios: mas de 30% sesiones no completadas, promedio quiz inferior a 60%, o mas
  de 2 inasistencias sincronicas consecutivas.
- **FR-009**: System MUST permitir a los docentes registrar notas de intervencion por
  estudiante, con fecha y hora, visibles solo para docentes y coordinacion.
- **FR-010**: System MUST mostrar tasas de error por pregunta de quiz, ordenadas de mayor
  a menor, para que el docente identifique conceptos que necesitan refuerzo.
- **FR-011**: System MUST mostrar metricas de engagement por sesion: tiempo promedio en
  sesion y porcentaje de completitud.
- **FR-012**: System MUST permitir a docentes publicar anuncios dirigidos a los estudiantes
  de una materia especifica, con indicador de "Nuevo" para lecturas pendientes.
- **FR-013**: System MUST permitir mensajes directos docente-estudiante dentro de la
  plataforma, sin depender de canales externos.
- **FR-014**: System MUST proporcionar al coordinador un reporte de capacitacion docente
  exportable en CSV y PDF, con columnas: nombre, materias, horas, estado certificado.
- **FR-015**: System MUST permitir al coordinador registrar horas de capacitacion externas
  validadas para un docente, sumandolas al contador interno.

### Key Entities

- **TeacherTrainingCourse**: Curso de capacitacion virtual disponible en la plataforma.
  Tiene modulos con duracion en horas cada uno. Instancia unica del curso "Docencia Virtual
  Efectiva" con sus modulos definidos institucionalmente.
- **TeacherTrainingProgress**: Registro de avance de un docente especifico en el curso de
  capacitacion (teacher_id, module_id, completed_at, hours_credited). Permite calcular
  total de horas y estado de certificacion.
- **TeacherCertificate**: Certificado de 120h generado para un docente (teacher_id,
  issued_at, certificate_url, total_hours). Evidencia auditable para CES.
- **TeacherExternalHours**: Horas de capacitacion externas registradas manualmente por
  coordinacion (teacher_id, hours, description, validated_by, validated_at). Permite
  reconocer formacion previa.
- **SessionCompletionStatus**: Vista calculada o campo derivado que indica si una sesion
  academica tiene los 7 tipos de contenido presentes. No es una tabla independiente, es
  una funcion o query sobre las columnas existentes en sessions.
- **AssignmentRubric**: Criterios de evaluacion de un ejercicio (assignment_id,
  criterion_name, description, weight_percent, order_index). Multiples criterios por
  ejercicio; pesos deben sumar 100.
- **TeacherIntervention**: Nota de seguimiento de un docente sobre un estudiante en riesgo
  (teacher_id, student_id, subject_id, note_text, created_at). Solo visible para docentes
  y coordinacion.
- **Announcement**: Anuncio de docente para una materia (teacher_id, subject_id, title,
  body_markdown, published_at, is_archived). Con tabla AnnouncementRead para tracking de
  lecturas.
- **DirectMessage**: Mensaje privado entre docente y estudiante dentro de la plataforma
  (sender_id, recipient_id, subject_id, body, sent_at, read_at).

## Assumptions & Dependencies

- **A1**: El curso de capacitacion "Docencia Virtual Efectiva" tiene modulos predefinidos
  institucionalmente con duracion fija. No es un curso generado por IA ni editable por los
  docentes mismos, sino contenido curado por coordinacion.
- **A2**: Los modulos del curso de capacitacion se completude la misma forma que las sesiones
  academicas: el docente los consume como estudiante y el progreso se registra automaticamente.
  Se reutiliza el mecanismo de session_progress existente.
- **A3**: La generacion del certificado PDF se hace en el servidor usando una plantilla HTML
  renderizada a PDF con una libreria ligera (puppeteer o html-pdf), sin dependencias de
  servicios externos de certificacion.
- **A4**: El curso de capacitacion es un programa especial en Supabase marcado con
  `program_type = 'teacher_training'`, reutilizando la estructura de programas, semestres
  y sesiones existente para minimizar tablas nuevas.
- **A5**: Los analytics de engagement (tiempo en sesion) se construyen sobre los datos de
  session_progress existentes. El tiempo exacto on-page no requiere instrumentacion adicional
  en esta fase; se usa el timestamp de inicio y fin de la sesion si esta disponible en
  session_progress, o una estimacion basada en horas de acceso.
- **D1**: Spec 001 (platform-foundation) completo: roles docente y coordinacion, tabla
  profiles con role field, tabla subjects con teacher_id, matriculaciones funcionales.
- **D2**: Spec 005 (exam-integrity) completo: tabla quiz_questions con opciones y correctas,
  tabla quiz_attempts con respuestas por pregunta, necesario para el reporte de preguntas
  mas falladas.
- **D3**: Spec 007 (attendance-tracking) completo: tabla attendance con datos de asistencia
  sincronica por estudiante y sesion, necesario para la deteccion de riesgo por inasistencias.
- **D4**: Tabla session_progress existente con campos completed, started_at, completed_at,
  necesaria para metricas de engagement y deteccion de estudiantes en riesgo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un docente puede completar el primer modulo del curso de capacitacion y ver
  sus horas acreditadas actualizadas en menos de 5 segundos post-finalizacion.
- **SC-002**: El 100% de los docentes activos aparecen en el reporte de capacitacion del
  coordinador con su estado real de horas completadas.
- **SC-003**: El certificado PDF se genera en menos de 10 segundos desde que el docente
  alcanza las 120h y queda disponible para descarga inmediata.
- **SC-004**: La validacion de URL de YouTube se resuelve en menos de 3 segundos con
  resultado visible (verde/rojo) antes de que el docente guarde el contenido.
- **SC-005**: El indicador de completitud de sesion refleja el estado correcto de los 7
  tipos de contenido sin necesitar recargar la pagina.
- **SC-006**: La lista de estudiantes en riesgo se genera en menos de 5 segundos para una
  materia con hasta 50 estudiantes matriculados.
- **SC-007**: Un anuncio publicado por el docente aparece en el dashboard del estudiante
  en menos de 30 segundos sin que el estudiante recargue la pagina (Supabase Realtime).
- **SC-008**: El reporte de capacitacion docente exportado en PDF es aceptable como
  evidencia formal para el expediente CES (contiene nombre institucional, fecha, datos
  del docente, horas y referencia al Art. 61 RRA 2022).
