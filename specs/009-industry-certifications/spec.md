# Feature Specification: Modulo de Certificaciones de Industria

**Feature Branch**: `009-industry-certifications`
**Created**: 2026-03-22
**Status**: Draft
**Input**: Modulo donde los estudiantes estudian para certificaciones internacionales usando la misma estructura de 7 tabs de las sesiones academicas. Primera fase: 5 certificaciones (AWS, Google TensorFlow, Azure AI-900, GitHub Copilot, Google Data Analytics).

## Institutional Alignment *(mandatory)*

### Source Inputs

- `.specify/memory/constitution.md` — Principio IV (plataforma compartida, experiencia por rol), Principio VII (AI-First), Principio VIII (Content Quality Standard: 7 tabs)
- `docs/roadmap/fases.md` — Fase 4: Diferenciacion ITSEIA (portafolio de proyectos, seguimiento de habilidades)
- Vision CEO (2026-03-22): "Ahi ganamos el ano — un alumno sale con titulo SENESCYT + certificaciones AWS/Google/Azure = IMBATIBLE"
- `docs/contexto/` — Brecha de talento 10:1 en Ecuador; diferenciador frente a universidades que no otorgan certificaciones industriales

### Phase Fit

- **Roadmap Phase**: Fase 4 (Diferenciacion ITSEIA)
- **Why now**: La combinacion titulo SENESCYT + certificaciones internacionales es el argumento de venta mas fuerte de ITSEIA frente a universidades tradicionales. La infraestructura de sesiones con 7 tabs ya existe en Fase 3. Las certificaciones se montan encima sin cambiar el modelo de datos central: solo agregan un tipo de programa. Preparar la especificacion ahora permite iniciar construccion en paralelo con el campus virtual base y tener contenido listo cuando llegue Fase 4.
- **Out of scope**:
  - Examen oficial en la plataforma (los examenes los aplica el proveedor externo: AWS, Google, Microsoft)
  - Integracion de pago para voucher de examen (Fase 5)
  - Certificados emitidos por ITSEIA con firma digital (existe en Fase 3 para carreras formales)
  - Rutas de aprendizaje que combinen varias certificaciones (Fase 5)
  - Reconocimiento de creditos formales por certificacion aprobada (requiere resolucion CES)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Estudiante navega el catalogo y empieza a estudiar una certificacion (Priority: P1)

Un estudiante matriculado en cualquier carrera accede a la seccion "Certificaciones" en el menu lateral de la plataforma. Ve las certificaciones disponibles organizadas por proveedor. Selecciona AWS Cloud Practitioner, lee la descripcion (dominio, costo del examen, dificultad, duracion estimada), hace click en "Iniciar preparacion" y entra al primer dominio. Desde ahi navega las sesiones igual que en sus materias formales: Video, Diapositivas, Teoria, Quiz, Ejercicio, AI Lab, Recursos.

**Why this priority**: Sin el catalogo y la capacidad de empezar a estudiar, el resto de la feature no existe. Es el flujo principal y la promesa visible al estudiante y al mercado.

**Independent Test**: Un estudiante puede encontrar AWS Cloud Practitioner en el catalogo, abrirlo, e ingresar a la primera sesion del primer dominio con los 7 tabs cargados, sin necesidad del modo examen ni del portfolio.

**Acceptance Scenarios**:

1. **Given** estudiante autenticado, **When** accede a la seccion "Certificaciones" en el menu lateral, **Then** ve una lista de certificaciones con nombre, proveedor, logo, nivel de dificultad, costo estimado del examen oficial y numero de dominios.
2. **Given** estudiante en el catalogo, **When** hace click en "AWS Cloud Practitioner", **Then** ve la pagina de la certificacion con descripcion del programa, lista de dominios como materias y un boton "Iniciar preparacion".
3. **Given** estudiante hace click en "Iniciar preparacion", **When** no habia iniciado antes, **Then** el sistema registra el inicio y lo lleva al primer dominio, primera sesion.
4. **Given** estudiante en una sesion de certificacion, **When** navega los tabs, **Then** los 7 tabs (Video, Diapositivas, Teoria, Quiz, Ejercicio, AI Lab, Recursos) estan disponibles con contenido especifico para esa sesion.
5. **Given** estudiante regresa dias despues, **When** abre la certificacion, **Then** el sistema lo lleva a la sesion donde lo dejo con el progreso guardado.

---

### User Story 2 — Estudiante practica con simulacro de examen (Priority: P2)

Despues de completar los dominios de una certificacion, el estudiante accede al "Modo Examen" de esa certificacion. El sistema presenta N preguntas en el tiempo real del examen oficial, con formato identico (opciones multiples, una sola respuesta, sin posibilidad de regresar). Al terminar, ve el puntaje, las respuestas correctas e incorrectas con explicaciones, y una estimacion de si esta listo para el examen oficial.

**Why this priority**: El simulacro es el diferenciador principal del modulo. Un estudiante puede estudiar teoria en YouTube, pero el simulacro cronometrado con preguntas estilo examen real y retroalimentacion inmediata es lo que convierte la preparacion en resultado.

**Independent Test**: Un estudiante puede iniciar el modo examen de AWS Cloud Practitioner, responder 65 preguntas en 90 minutos (o el tiempo que se configure), y ver los resultados con porcentaje de acierto por dominio.

**Acceptance Scenarios**:

1. **Given** estudiante en la pagina de una certificacion, **When** hace click en "Modo Examen", **Then** ve las reglas (numero de preguntas, tiempo limite, no se puede regresar) y un boton "Comenzar examen".
2. **Given** examen iniciado, **When** el estudiante responde una pregunta y hace click en "Siguiente", **Then** no puede regresar a la pregunta anterior y el temporizador sigue corriendo.
3. **Given** tiempo agotado o todas las preguntas respondidas, **When** el examen termina, **Then** el sistema muestra: puntaje total, porcentaje por dominio, respuestas correctas e incorrectas con explicacion de cada una.
4. **Given** examen completado, **When** el estudiante ve los resultados, **Then** el sistema indica si el puntaje supero el umbral de aprobacion del examen oficial (ej. 70% para AWS CCP).
5. **Given** estudiante realiza multiples simulacros, **When** accede al historial, **Then** ve la evolucion de sus puntajes en el tiempo con grafico de progreso.

---

### User Story 3 — Admin registra progreso y prepara reporte de certificaciones (Priority: P3)

El admin (coordinacion academica) accede a un panel donde ve cuantos estudiantes estan preparando cada certificacion, cual es su progreso promedio, y quienes han superado el umbral del simulacro. Puede exportar el listado para seguimiento o para presentarlo como indicador ante potenciales empleadores partners.

**Why this priority**: El admin necesita visibilidad para gestionar la propuesta de valor hacia empresas: "X estudiantes de ITSEIA certificados o en proceso de certificacion en AWS" es un argumento de ventas B2B directo.

**Independent Test**: El admin puede ver en su panel cuantos estudiantes iniciaron cada certificacion y cual es el progreso promedio, sin necesidad del portfolio ni del modo examen avanzado.

**Acceptance Scenarios**:

1. **Given** admin autenticado, **When** accede al reporte de certificaciones, **Then** ve por cada certificacion: numero de estudiantes activos, progreso promedio (% sesiones completadas), numero de simulacros aprobados.
2. **Given** admin revisa una certificacion especifica, **When** hace click en "Ver detalle", **Then** ve la lista de estudiantes con su progreso individual, ultimo simulacro y puntaje.
3. **Given** admin necesita el reporte, **When** hace click en "Exportar", **Then** descarga un CSV con nombre estudiante, certificacion, progreso, puntajes de simulacros y fecha del ultimo acceso.

---

### User Story 4 — Certificacion aparece en el portfolio del estudiante (Priority: P4)

Cuando un estudiante supera el umbral del simulacro de una certificacion, la plataforma agrega automaticamente esa certificacion (con estado "En preparacion — simulacro aprobado") a su perfil y portfolio. Si el estudiante sube evidencia del certificado oficial, el estado cambia a "Certificado oficial obtenido".

**Why this priority**: El portfolio hace visible el logro al mundo externo (empleadores, LinkedIn). Es el cierre del ciclo de valor del modulo.

**Independent Test**: Un estudiante que aprueba un simulacro puede ver la certificacion en su perfil con el estado correcto, independientemente del reporte admin o del catalogo.

**Acceptance Scenarios**:

1. **Given** estudiante supera el umbral de aprobacion en un simulacro, **When** ve su perfil, **Then** la certificacion aparece con estado "Simulacro aprobado — listo para rendir examen oficial".
2. **Given** estudiante sube imagen o PDF del certificado oficial, **When** el admin valida el documento, **Then** el estado cambia a "Certificado oficial obtenido" con fecha.
3. **Given** empleador o tercero visita el perfil publico del estudiante, **When** ve la seccion certificaciones, **Then** puede ver las certificaciones con su estado sin necesidad de autenticarse.

---

### Edge Cases

- Proveedor actualiza el contenido del examen anualmente (AWS, Google y Microsoft cambian el dominio de objetivos cada 1-2 anos): el sistema debe permitir al admin marcar una certificacion como "Actualizacion pendiente" sin bloquear el acceso a los estudiantes que ya estaban estudiando.
- Contenido de certificaciones mayoritariamente en ingles: los 7 tabs pueden ser bilingues (video en ingles con descripcion en espanol, teoria en espanol, quiz en ambos idiomas). El idioma del quiz de simulacro debe coincidir con el idioma del examen oficial.
- Estudiante que no esta matriculado en ninguna carrera formal pero quiere solo las certificaciones: por definir si se les da acceso (fuera del alcance de esta especificacion, requiere decision comercial).
- Certificacion descontinuada por el proveedor (ej. GitHub Copilot cambia su esquema de certificacion): el admin puede archivar la certificacion; los estudiantes que la iniciaron mantienen su progreso visible pero no pueden iniciar nuevas.
- Estudiante sube certificado falso: el admin valida manualmente el documento antes de cambiar el estado. No hay validacion automatica con APIs de proveedor en esta fase.
- Estudiante quiere repetir el simulacro: puede repetirlo ilimitadamente. Cada intento se guarda en el historial con fecha y puntaje.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST mostrar una seccion "Certificaciones" en el menu lateral de la plataforma, accesible para estudiantes matriculados en cualquier programa formal o de formacion continua.
- **FR-002**: System MUST presentar un catalogo de certificaciones con nombre, proveedor, logo, nivel de dificultad, costo estimado del examen oficial, numero de dominios y duracion estimada de preparacion.
- **FR-003**: System MUST estructurar cada certificacion como un programa de tipo "certificacion" compuesto por dominios (equivalentes a materias) y sesiones dentro de cada dominio, reutilizando las entidades existentes de la plataforma.
- **FR-004**: System MUST presentar cada sesion de certificacion con los mismos 7 tabs del campus virtual: Video, Diapositivas, Teoria, Quiz, Ejercicio, AI Lab, Recursos.
- **FR-005**: System MUST guardar el progreso del estudiante por sesion (completada / en curso / no iniciada) y retomar desde donde lo dejo en cada acceso.
- **FR-006**: System MUST ofrecer un "Modo Examen" por certificacion con: numero de preguntas configurable, temporizador, navegacion secuencial sin retroceso y calificacion automatica al finalizar.
- **FR-007**: System MUST mostrar al finalizar el simulacro: puntaje total, porcentaje por dominio, respuesta correcta e incorrecta con explicacion para cada pregunta.
- **FR-008**: System MUST comparar el puntaje del simulacro con el umbral de aprobacion del examen oficial y mostrar al estudiante si supero o no el umbral con un mensaje claro.
- **FR-009**: System MUST guardar el historial de simulacros del estudiante con fecha, puntaje total y puntaje por dominio, y mostrarlo como grafico de evolucion.
- **FR-010**: System MUST agregar automaticamente la certificacion al portfolio del estudiante cuando supera el umbral del simulacro, con estado "Simulacro aprobado".
- **FR-011**: System MUST permitir al estudiante subir evidencia del certificado oficial para que el admin valide y cambie el estado a "Certificado oficial obtenido".
- **FR-012**: System MUST permitir al admin ver, por certificacion, la lista de estudiantes activos con progreso individual y exportar el reporte en CSV.
- **FR-013**: System MUST permitir al admin marcar una certificacion como "Actualizacion pendiente" o "Archivada" sin eliminar el progreso de los estudiantes que ya la iniciaron.
- **FR-014**: System MUST configurar el AI Lab de cada sesion con un prompt contextual especifico a la certificacion (ej. "Estoy preparando el examen AWS Cloud Practitioner, ayudame con el dominio Seguridad").

### Key Entities

- **CertificationProgram**: Certificacion como unidad de programa (nombre, proveedor, logo_url, nivel_dificultad, costo_examen_usd, duracion_horas_estimada, estado: activa/actualizacion_pendiente/archivada, idioma_examen, umbral_aprobacion_porcentaje).
- **CertificationDomain**: Dominio dentro de una certificacion, equivalente a materia (certification_id, nombre, descripcion, porcentaje_en_examen, orden).
- **CertificationSession**: Sesion dentro de un dominio, reutiliza la estructura de sesion existente con los 7 tabs (domain_id, session_id, orden).
- **CertificationEnrollment**: Registro de que estudiante inicio que certificacion (user_id, certification_id, started_at, last_accessed_at).
- **ExamAttempt**: Intento de simulacro (user_id, certification_id, started_at, finished_at, score_total, score_por_dominio JSON, aprobado boolean).
- **ExamQuestion**: Pregunta del banco (certification_id, domain_id, enunciado, opciones JSON, respuesta_correcta, explicacion, idioma, activa boolean).
- **CertificationBadge**: Logro en portfolio (user_id, certification_id, estado: simulacro_aprobado/certificado_oficial, evidencia_url, validado_por, validado_at).

## Assumptions & Dependencies

- **A1**: El contenido de preparacion de las 5 certificaciones iniciales proviene de fuentes gratuitas oficiales (AWS Skill Builder, Google ML Crash Course, Microsoft Learn, GitHub Docs). ITSEIA no paga licencias de contenido.
- **A2**: Las preguntas del banco de simulacro son elaboradas por docentes ITSEIA basadas en los objetivos oficiales de cada examen, no son preguntas filtradas. Esto evita problemas legales con los proveedores.
- **A3**: El umbral de aprobacion del simulacro refleja el umbral del examen oficial: AWS CCP 70%, Azure AI-900 70%, Google TFA 60% (aproximado), GitHub Copilot segun certificacion vigente, Google Data Analytics 80%.
- **A4**: El acceso a certificaciones esta incluido en la mensualidad del estudiante matriculado. No hay costo adicional para el estudiante (el costo es el examen oficial que el paga directamente al proveedor).
- **D1**: La plataforma de Fase 3 debe tener operativas las entidades de sesion con 7 tabs antes de montar este modulo.
- **D2**: La feature de portfolio de estudiante (Fase 4) debe existir o construirse en paralelo para que los badges sean visibles.
- **D3**: El banco de preguntas inicial (minimo 100 preguntas por certificacion) debe ser creado por el equipo academico antes del lanzamiento al estudiante.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un estudiante puede encontrar una certificacion en el catalogo, abrirla e ingresar a la primera sesion en menos de 2 minutos desde el menu lateral.
- **SC-002**: El modo examen de cualquier certificacion carga las preguntas, el temporizador y la navegacion correctamente en menos de 5 segundos.
- **SC-003**: Al terminar un simulacro, los resultados completos (puntaje total, por dominio, respuestas con explicacion) son visibles en menos de 3 segundos.
- **SC-004**: El progreso del estudiante se guarda correctamente: al regresar a una sesion parcialmente vista, el sistema muestra el estado "en curso" sin perder avance.
- **SC-005**: El admin puede exportar el reporte de progreso de todos los estudiantes en una certificacion en un solo click, sin espera mayor a 10 segundos para hasta 200 estudiantes.
- **SC-006**: Un estudiante que supera el umbral del simulacro ve la certificacion en su portfolio con el estado correcto dentro de los 60 segundos siguientes a finalizar el examen.
- **SC-007**: El catalogo muestra al menos 5 certificaciones activas con contenido completo (minimo 3 dominios y 2 sesiones por dominio con 7 tabs cada una) en el lanzamiento de Fase 4.
