# Feature Specification: Campus Virtual V2 — Estructura Académica Real

**Feature Branch**: `001-campus-v2-academic`
**Created**: 2026-03-21
**Status**: Draft
**Input**: Rediseño completo del campus virtual ITSEIA Academy con estructura académica real (3 carreras CES, 5 períodos, 87 asignaturas), componentes de sesión con 7 tipos de contenido, panel docente, y 3 materias del Semestre 1 completamente desarrolladas

## User Scenarios & Testing

### User Story 1 — Estudiante navega y estudia una sesión completa (Priority: P1)

Un estudiante matriculado en la carrera de Inteligencia Artificial ingresa a tecnologico.itseia.ai, ve su dashboard con el progreso de su carrera, navega al Período 1, selecciona la materia "Fundamentos de Programación", y accede a la Sesión 1 donde encuentra: un video de 20 minutos sobre introducción a Python, una presentación PDF con los conceptos clave, contenido teórico detallado, un quiz de 5 preguntas con explicaciones, un ejercicio práctico para escribir su primer programa, el AI Lab contextualizado para preguntas sobre Python, y recursos adicionales. Al completar el quiz y marcar la sesión como vista, su progreso se actualiza automáticamente.

**Why this priority**: Sin esta experiencia, la plataforma no tiene razón de existir. Es el core del producto.

**Independent Test**: Crear un estudiante de prueba, inscribirlo en IA, y verificar que puede navegar desde dashboard hasta completar una sesión con los 7 tipos de contenido.

**Acceptance Scenarios**:
1. **Given** estudiante matriculado en carrera IA, **When** accede al dashboard, **Then** ve los 5 períodos con progreso por materia
2. **Given** estudiante en la vista de materia, **When** selecciona una sesión, **Then** ve tabs con Video, Presentación, Teoría, Quiz, Ejercicio, AI Lab, Recursos
3. **Given** estudiante completa el quiz con >=70%, **When** marca sesión como completada, **Then** el progreso de la materia y el período se actualizan
4. **Given** estudiante abre AI Lab en una sesión, **When** hace una pregunta, **Then** el tutor IA responde con contexto específico de esa sesión

---

### User Story 2 — Docente gestiona contenido de su materia (Priority: P2)

Un docente asignado a "Fundamentos de Programación" ingresa al panel docente, ve las sesiones de su materia con el estado de contenido de cada una, selecciona una sesión, y puede: agregar un video de YouTube, cargar un PDF de presentación, escribir la teoría en markdown con preview, crear un quiz de 5 preguntas con opciones y explicaciones, definir un ejercicio práctico con instrucciones, y ver las entregas de los estudiantes con la opción de calificar y dar feedback.

**Why this priority**: Sin panel docente, solo el admin puede cargar contenido, lo cual no escala.

**Independent Test**: Crear un usuario docente, asignarle una materia, y verificar que puede CRUD contenido completo de una sesión.

**Acceptance Scenarios**:
1. **Given** docente con materia asignada, **When** ingresa a /teacher, **Then** ve solo sus materias con estado de contenido por sesión
2. **Given** docente en editor de sesión, **When** agrega video URL + teoría + quiz, **Then** el contenido se guarda y es visible para estudiantes
3. **Given** estudiante entregó trabajo, **When** docente califica con nota y feedback, **Then** estudiante ve su calificación en su panel

---

### User Story 3 — Admin gestiona estructura académica y operación (Priority: P2)

El admin (Héctor) accede al panel admin, ve las 3 carreras con sus 5 períodos y todas las asignaturas, puede editar la estructura académica, ver el progreso global de estudiantes, gestionar matrículas con pagos PayPal, emitir certificados PDF, y monitorear el uso del AI Lab.

**Why this priority**: El admin necesita gestionar la operación completa del instituto.

**Independent Test**: Verificar que admin puede ver y editar estructura de carreras, períodos, materias, y emitir un certificado.

**Acceptance Scenarios**:
1. **Given** admin autenticado, **When** accede a gestión de carreras, **Then** ve las 3 carreras con estructura completa editable
2. **Given** admin en gestión de pagos, **When** un estudiante paga por PayPal, **Then** el pago se registra y la matrícula se activa automáticamente
3. **Given** estudiante completó un programa, **When** admin emite certificado, **Then** se genera PDF con QR verificable

---

### User Story 4 — Visitante descubre carreras y se matricula (Priority: P3)

Un visitante llega a tecnologico.itseia.ai, ve la landing con las 3 carreras, precios y diferenciadores, selecciona una carrera, llena el formulario de admisión, paga la matrícula de $180 con PayPal, y automáticamente tiene acceso a su dashboard con las materias del Período 1.

**Why this priority**: Sin captación y pagos, no hay negocio.

**Independent Test**: Flujo completo de visitante anónimo hasta estudiante matriculado con pago confirmado.

**Acceptance Scenarios**:
1. **Given** visitante en landing, **When** navega carreras, **Then** ve descripción completa con malla, precios y CTA de inscripción
2. **Given** visitante en formulario admisión, **When** completa datos y paga por PayPal, **Then** recibe acceso inmediato al campus

---

### Edge Cases

- Estudiante intenta acceder a sesión de período al que no está matriculado: mostrar bloqueo con opción de ver preview
- Quiz tiene 0 preguntas (docente no las creó): mostrar mensaje "Quiz en preparación" en vez de componente vacío
- Video de YouTube eliminado: mostrar placeholder con mensaje "Video no disponible, contacta al docente"
- AI Lab alcanza 500 consultas/mes: mostrar contador en 0 con fecha de reinicio
- PayPal rechaza pago: mostrar error con opción de reintentar y contacto WhatsApp
- Docente edita contenido mientras estudiante estudia: cambios se reflejan en la siguiente carga, no en tiempo real
- Sesión sin contenido de ningún tipo: no aparece en la lista de sesiones disponibles

## Requirements

### Functional Requirements

**Estructura Académica**
- **FR-001**: Sistema DEBE mostrar las 3 carreras oficiales CES (IA, Ciencia de Datos, Big Data) con datos exactos del documento presentado al CES
- **FR-002**: Sistema DEBE organizar cada carrera en 5 períodos con 5-6 asignaturas cada uno, respetando horas de docencia, práctica y autónomo
- **FR-003**: Sistema DEBE permitir navegación jerárquica: Carrera > Período > Materia > Sesión
- **FR-004**: Sistema DEBE calcular y mostrar progreso del estudiante por sesión, materia, período y carrera

**Sesión de Clase**
- **FR-005**: Cada sesión DEBE soportar 7 tipos de contenido: video embed, presentación PDF, teoría markdown, quiz, ejercicio práctico, AI Lab contextual, recursos adicionales
- **FR-006**: Sistema DEBE registrar progreso granular por sesión: video visto, slides revisados, teoría leída, quiz aprobado, ejercicio entregado, AI Lab usado
- **FR-007**: Una sesión se marca como completada solo cuando los elementos requeridos están hechos
- **FR-008**: Sistema DEBE permitir navegación anterior/siguiente entre sesiones con indicadores de completado

**Quiz Engine**
- **FR-009**: Sistema DEBE soportar quizzes de opción múltiple con auto-grading
- **FR-010**: Cada pregunta DEBE tener explicación que se muestra después de responder
- **FR-011**: Quiz DEBE tener nota mínima configurable (default 70%), máximo de intentos (default 3), y tiempo límite opcional

**Entregas de Trabajos**
- **FR-012**: Estudiante DEBE poder subir archivos (PDF, ZIP, PY, IPYNB, DOCX) como entrega de ejercicio
- **FR-013**: Docente DEBE poder calificar entregas con nota numérica y feedback de texto

**AI Lab**
- **FR-014**: AI Lab DEBE recibir automáticamente el contexto de la sesión actual
- **FR-015**: AI Lab DEBE soportar selección de modelo (mínimo 3 modelos)
- **FR-016**: Sistema DEBE controlar cuota de 500 consultas/mes por estudiante

**Panel Docente**
- **FR-017**: Docente DEBE ver solo las materias asignadas
- **FR-018**: Docente DEBE poder editar contenido de cada sesión
- **FR-019**: Docente DEBE poder ver entregas y calificar
- **FR-020**: Docente DEBE poder ver progreso de estudiantes

**Pagos**
- **FR-021**: Sistema DEBE procesar pagos con PayPal: matrícula $180, pensión $300/mes, pensión pionero $220/mes
- **FR-022**: Sistema DEBE aplicar descuentos hasta 25%
- **FR-023**: Al confirmar pago, la matrícula se activa automáticamente

**Certificados**
- **FR-024**: Sistema DEBE generar certificado PDF con nombre, programa, fecha, QR code
- **FR-025**: Certificado verificable en URL pública

**Contenido Completo (3 Materias Semestre 1)**
- **FR-026**: "Fundamentos de Programación" (carrera IA) con sesiones completas: videos reales, teoría, quizzes, ejercicios, AI Lab, recursos
- **FR-027**: "Introducción a Ciencia de Datos" (carrera CD) con sesiones completas
- **FR-028**: "Introducción a Big Data" (carrera BD) con sesiones completas

### Key Entities

- **Carrera**: 3 carreras oficiales CES con título, campo RANT, créditos totales (75), horas totales (3600)
- **Período**: 5 por carrera, cada uno 600h, con nivel (básico, profesional, integración)
- **Asignatura**: 5-6 por período, con horas docencia/práctica/autónomo, herramientas, docente
- **Sesión**: Unidad atómica de clase, con 7 tipos de contenido, tracking de progreso granular
- **Quiz**: Evaluación por sesión con preguntas opción múltiple, auto-grading, explicaciones
- **Entrega**: Archivo subido por estudiante, con calificación y feedback del docente
- **Progreso**: Tracking por sesión (video, slides, teoría, quiz, ejercicio, AI Lab) con agregación a nivel materia/período/carrera

## Success Criteria

### Measurable Outcomes

- **SC-001**: Estudiante navega desde dashboard hasta completar una sesión con los 7 tipos de contenido en menos de 5 minutos de navegación
- **SC-002**: Las 3 materias del Semestre 1 tienen 100% de sesiones con contenido real poblado (video, teoría, quiz, ejercicio)
- **SC-003**: Docente puede crear contenido completo de una sesión en menos de 15 minutos desde el panel docente
- **SC-004**: Quiz auto-califica y muestra explicaciones inmediatamente sin intervención humana
- **SC-005**: Estructura de las 3 carreras coincide 100% con el documento oficial del CES (nombres, horas, créditos exactos)
- **SC-006**: Visitante puede matricularse y pagar con PayPal completando todo el flujo en menos de 5 minutos
- **SC-007**: Certificado PDF contiene datos correctos y QR redirige a verificación funcional
- **SC-008**: Los 21 módulos de ESTRUCTURA_COMPLETA.md tienen páginas correspondientes en la plataforma

## Assumptions

- Videos de YouTube disponibles en español/inglés para cada tema del Semestre 1
- CEO ejecutará SQL de migración en Supabase cuando se proporcione
- Los 27 módulos profesionales existentes se integran en cursos profesionales, no se duplican
- Cohortes (foro, ranking, deadlines) se implementan en feature posterior
- Sandpack editor de código se implementa como mejora incremental del AI Lab
