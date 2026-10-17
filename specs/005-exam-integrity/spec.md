# Feature Specification: Anti-fraude en Evaluaciones con IA

**Feature Branch**: `005-exam-integrity`
**Created**: 2026-03-22
**Status**: Draft
**Input**: Mecanismos de deteccion de deshonestidad academica en evaluaciones en linea para cumplir Art. 62 RRA 2022

## Institutional Alignment *(mandatory)*

### Source Inputs

- `docs/ces_aprobacion/INVESTIGACION_REQUISITOS_CES_ONLINE.md` — Art. 62 RRA 2022: mecanismos de deteccion de deshonestidad academica obligatorios en modalidad en linea
- `docs/ces_aprobacion/02_ARQUITECTURA_MODERNA.md` — Decision Gemini para analisis de patrones post-examen
- `docs/roadmap/fases.md` — Fase 3: Campus virtual base
- `.specify/memory/constitution.md` — Principio VI (CES Compliance by Design)
- Reglamento RRA 2022 Art. 62: plataformas de educacion en linea deben demostrar mecanismos que prevengan y detecten la deshonestidad academica

### Phase Fit

- **Roadmap Phase**: Fase 3 (Campus virtual base)
- **Why now**: El Art. 62 RRA 2022 es un requisito explicito para la aprobacion de la modalidad en linea. Sin mecanismos documentados de integridad academica, el CES puede rechazar el expediente o condicionar la aprobacion. Implementarlo desde el inicio establece el estandar correcto y evita retrofitting costoso cuando haya estudiantes reales.
- **Out of scope**:
  - Proctoring con camara completo (requiere consentimiento LOPDP y revision legal — fase posterior)
  - Deteccion de plagio en textos (para tareas escritas — spec separada)
  - Bloqueo de aplicaciones en dispositivo del estudiante (requiere software nativo)
  - Reconocimiento facial de identidad (fase posterior, post-aprobacion SENESCYT)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Estudiante realiza quiz con preguntas aleatorizadas (Priority: P1)

Cuando un estudiante inicia un quiz, el sistema presenta las preguntas en un orden aleatorio
unico para ese estudiante en ese intento. Las opciones de respuesta de cada pregunta
multiple tambien aparecen en orden aleatorio. Un temporizador visible cuenta el tiempo
restante. Al vencer el tiempo, el quiz se envia automaticamente con las respuestas
registradas hasta ese momento.

**Why this priority**: La aleatorizacion es el mecanismo mas efectivo, tecnico y legalmente
simple para prevenir que dos estudiantes tengan el mismo examen. Cumple el Art. 62 RRA 2022
sin necesidad de camara ni software adicional.

**Independent Test**: Dos estudiantes que realizan el mismo quiz simultaneamente reciben
ordenes de pregunta diferentes, verificable comparando sus sesiones lado a lado.

**Acceptance Scenarios**:

1. **Given** estudiante inicia un quiz, **When** el quiz se carga, **Then** las preguntas
   aparecen en un orden diferente al orden base definido por el docente, aleatorio por
   intento y por estudiante.
2. **Given** pregunta de seleccion multiple visible, **When** el estudiante la lee,
   **Then** las opciones de respuesta estan en orden aleatorio diferente al orden base.
3. **Given** quiz activo con temporizador de 30 minutos, **When** el tiempo llega a cero,
   **Then** el sistema envia automaticamente el quiz con todas las respuestas marcadas
   hasta ese momento sin accion del estudiante.
4. **Given** estudiante intenta salir de la pagina durante el quiz, **When** hace click
   en el boton atras o cierra la pestaña, **Then** el sistema muestra advertencia y
   registra el evento como "abandono de pestaña".

---

### User Story 2 — Docente configura banco de preguntas rotativo (Priority: P2)

El docente puede cargar un banco de preguntas para una evaluacion (por ejemplo, 40
preguntas) y configurar el quiz para que a cada estudiante se le presenten solo N preguntas
seleccionadas aleatoriamente del banco (por ejemplo, 20 de 40). Esto garantiza que
distintos estudiantes reciban subconjuntos diferentes de preguntas.

**Why this priority**: El banco rotativo es el segundo nivel de proteccion contra fraude
— incluso si dos estudiantes comparten respuestas, recibiran preguntas distintas. Tambien
permite reutilizar preguntas de forma segura entre periodos.

**Independent Test**: Un docente configura un banco de 20 preguntas con seleccion de 10,
y dos estudiantes que realizan el quiz reciben conjuntos diferentes de preguntas.

**Acceptance Scenarios**:

1. **Given** docente en el editor de quiz, **When** activa "Banco rotativo" y define
   "Mostrar 15 de 30 preguntas", **Then** cada estudiante recibe 15 preguntas diferentes
   seleccionadas aleatoriamente del banco de 30.
2. **Given** dos estudiantes que tomaron el mismo quiz con banco rotativo, **When** el
   docente revisa los intentos, **Then** puede verificar que cada estudiante recibio
   un subconjunto diferente de preguntas.

---

### User Story 3 — Admin ve reporte de integridad con patrones detectados por IA (Priority: P3)

Despues de que los estudiantes completan un quiz, el admin o docente puede solicitar un
reporte de integridad que muestra: tiempo promedio por pregunta, numero de cambios de
pestaña detectados, comparacion de respuestas entre estudiantes, y un puntaje de integridad
general calculado por IA. El reporte identifica intentos sospechosos para revision docente.

**Why this priority**: El reporte de integridad es la evidencia documentada que SENESCYT
puede solicitar para verificar que los mecanismos del Art. 62 RRA 2022 funcionan. Sin
reporte exportable, la funcionalidad no tiene valor de compliance.

**Independent Test**: Despues de un quiz de prueba con 3 estudiantes, el reporte muestra
datos de tiempo por pregunta y tab-switches para cada intento en menos de 1 minuto.

**Acceptance Scenarios**:

1. **Given** quiz completado por los estudiantes, **When** docente solicita "Reporte de
   integridad", **Then** el sistema genera en menos de 1 minuto un reporte con: tiempo
   por pregunta, tab-switches, puntaje de integridad (0-100) por intento.
2. **Given** dos intentos con respuestas identicas en mismo orden, **When** la IA analiza
   el reporte, **Then** el sistema marca ambos intentos con alerta de "Patron sospechoso —
   revision recomendada".
3. **Given** reporte generado, **When** admin hace click en "Exportar", **Then** descarga
   PDF o CSV del reporte con datos de todos los intentos del quiz.

---

### Edge Cases

- Estudiante pierde conexion a internet durante el quiz: al reconectarse, el quiz
  continua desde el punto en que estaba con el tiempo transcurrido descontado.
- Docente no configura banco rotativo: el sistema usa la aleatorizacion de orden como
  mecanismo de integridad minimo por defecto.
- Estudiante con accesibilidad (lector de pantalla): la aleatorizacion no afecta la
  accesibilidad; el orden es aleatorio pero consistente durante el intento.
- Quiz con una sola pregunta: la aleatorizacion aplica solo a las opciones de respuesta.
- Estudiante realiza multiples intentos si el docente lo permite: cada intento genera
  su propio registro de integridad independiente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST aleatorizar el orden de las preguntas por estudiante y por
  intento al iniciar cada quiz.
- **FR-002**: System MUST aleatorizar el orden de las opciones de respuesta en preguntas
  de seleccion multiple, independientemente del orden de las preguntas.
- **FR-003**: System MUST implementar un temporizador configurable por el docente
  (minimo 5 minutos, maximo 180 minutos) con auto-envio al vencer.
- **FR-004**: System MUST registrar automaticamente cada vez que el estudiante abandona
  la pestaña o ventana del quiz durante el intento (tab-switch detection).
- **FR-005**: System MUST soportar bancos de preguntas rotativos donde el docente define
  cuantas preguntas del banco se presentan a cada estudiante.
- **FR-006**: System MUST registrar el tiempo que el estudiante tarda en responder cada
  pregunta individual.
- **FR-007**: System MUST generar un reporte de integridad por quiz en menos de 60
  segundos, incluyendo: tiempo por pregunta, tab-switches, puntaje de integridad.
- **FR-008**: System MUST comparar respuestas entre intentos del mismo quiz para
  detectar patrones de respuesta identicos y marcarlos como sospechosos.
- **FR-009**: System MUST garantizar que ningun estudiante reciba exactamente el mismo
  orden de preguntas que otro estudiante en el mismo quiz.
- **FR-010**: System MUST exportar reportes de integridad en formato PDF y CSV para
  evidencia SENESCYT.

### Key Entities

- **QuizAttemptIntegrity**: Registro de integridad por intento (attempt_id,
  time_per_question JSON, tab_switches, question_order JSON, integrity_score,
  suspicious_flags, created_at). Vinculado 1:1 con cada intento de quiz.

## Assumptions & Dependencies

- **A1**: La deteccion de cambio de pestaña se implementa via Page Visibility API del
  navegador, disponible en todos los navegadores modernos sin software adicional.
- **A2**: El puntaje de integridad (0-100) se calcula con Gemini evaluando el patron
  de tiempo por pregunta y tab-switches; no requiere camara ni biometria.
- **A3**: La aleatorizacion en el servidor (no en el cliente) garantiza que el orden
  no pueda ser manipulado por el estudiante inspeccionando el codigo.
- **A4**: El banco de preguntas de hasta 200 preguntas por quiz es suficiente para
  el contexto de ITSEIA en esta fase.
- **D1**: Sistema de evaluaciones (quizzes) base debe existir — depende de
  001-platform-foundation.
- **D2**: Gemini API ya disponible en la plataforma para el analisis de patrones en
  el reporte de integridad.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Cada estudiante recibe un orden de preguntas estadisticamente diferente
  al de cualquier otro estudiante en el mismo quiz (0% intentos con orden identico).
- **SC-002**: El reporte de integridad se genera en menos de 60 segundos despues de
  que el docente lo solicita, para grupos de hasta 50 estudiantes.
- **SC-003**: El 100% de los tab-switches durante un quiz quedan registrados en el
  reporte de integridad sin excepcion.
- **SC-004**: Los reportes de integridad son exportables en PDF/CSV y verificables
  como evidencia de cumplimiento Art. 62 RRA 2022 ante SENESCYT.
- **SC-005**: El sistema detecta y marca como sospechosos el 100% de los intentos con
  respuestas en orden identico al de otro intento en el mismo quiz.
