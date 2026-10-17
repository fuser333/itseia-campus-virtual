# Tasks: Anti-fraude en Evaluaciones con IA

**Input**: plan.md + spec.md
**Prerequisites**: 001-platform-foundation completo; `QuizEngine.tsx` y
`QuizBuilder.tsx` existentes; `apps/web/src/app/api/quiz/[quizId]/attempt/route.ts`
existente; Gemini API operativa

**Tests**: Verificar que dos estudiantes reciben ordenes distintos; que auto-submit funciona
al expirar el timer; que tab-switches quedan registrados; que RLS impide al estudiante ver
su propio registro de integridad.

## Format: `[ID] [P?] [Story] Description`
- P = paralelizable (puede ejecutarse concurrentemente con otras tareas P)
- Story = historia de usuario que sirve

---

## Phase A: Aleatorizacion en servidor y modificacion de QuizEngine

**Purpose**: Dos estudiantes que toman el mismo quiz reciben ordenes de pregunta distintos;
el orden no puede ser manipulado desde el cliente.

- [ ] T001 [US1] Implementar `features/exam-integrity/shuffle.ts`:
      algoritmo Fisher-Yates con PRNG `mulberry32` (seed determinista);
      exportar `shuffleWithSeed<T>(array: T[], seed: number): T[]`
- [ ] T002 [US1] Implementar `POST /api/quiz/[quizId]/start/route.ts`:
      genera seed `murmurhash(userId + quizId + timestamp)`, calcula `shuffledQuestionIds[]`
      y `optionOrders` por pregunta, retorna `{ seed, shuffledQuestionIds, optionOrders, signedToken }`
      firmado con HMAC usando `QUIZ_INTEGRITY_SECRET`
- [ ] T003 [US1] Crear migracion `supabase/migrations/20260322_005_exam_integrity.sql`:
      `ALTER TABLE quizzes ADD COLUMN timer_minutes` y `bank_size` y `show_n_questions`;
      `CREATE TABLE quiz_attempt_integrity` con campos de integridad; RLS (solo docente de la
      materia y admin pueden SELECT — estudiante no puede ver su propio registro);
      index en `attempt_id`
- [ ] T004 [US1] Extender `apps/web/src/types/database.ts` con tipo `QuizAttemptIntegrity`
- [ ] T005 [US1] Modificar `apps/web/src/components/session/QuizEngine.tsx`:
      al montar llama `POST /api/quiz/[quizId]/start`, renderiza preguntas y opciones en el
      orden recibido del servidor; al enviar intento incluye `signedToken` y `questionOrder[]`
- [ ] T006 [US1] Modificar `apps/web/src/app/api/quiz/[quizId]/attempt/route.ts`:
      verificar HMAC del `signedToken` antes de guardar; persistir `question_order` en
      `quiz_attempt_integrity`

**Checkpoint**: Dos usuarios distintos inician el mismo quiz — verificar en DB que
`question_order` es diferente en ambos registros de `quiz_attempt_integrity`; intentar
enviar intento con `signedToken` invalido recibe error 400.

---

## Phase B: Temporizador, tab-switch detection y banco rotativo

**Purpose**: Quiz tiene tiempo limite con auto-submit; ausencias de pestaña quedan registradas;
docente puede configurar banco rotativo.

- [ ] T007 [US1] Implementar `features/exam-integrity/timer.ts`:
      hook `useQuizTimer(totalSeconds, onExpire)` que retorna `{ secondsLeft, formattedTime }`;
      persiste tiempo restante en `localStorage` keyed por `attempt_id` para sobrevivir recargas;
      `onExpire` dispara submit automatico con respuestas hasta ese momento
- [ ] T008 [P] [US1] Implementar `features/exam-integrity/visibility.ts`:
      hook `useTabVisibility()` via `document.addEventListener('visibilitychange')`;
      retorna `{ tabSwitchCount, lastSwitchAt }`; incrementa contador local en cada switch
- [ ] T009 [US1] Integrar `useQuizTimer` y `useTabVisibility` en `QuizEngine.tsx`:
      countdown visible en header con alerta a < 5 minutos; banner de advertencia al primer
      tab-switch; al enviar (manual o auto) incluir `{ time_per_question, tab_switch_count }`
- [ ] T010 [US2] Modificar `apps/web/src/components/teacher/QuizBuilder.tsx`:
      agregar campo "Tiempo limite (minutos)" y toggle "Banco rotativo" con campo
      "Mostrar N de M preguntas"; actualizar `POST /api/quiz/[quizId]/start` para seleccionar
      N preguntas aleatoriamente del banco antes del shuffle de orden

**Checkpoint**: Dejar timer llegar a 0 — el quiz se envia automaticamente con las respuestas
marcadas; cambiar de pestaña durante el quiz y verificar que `tab_switch_count` > 0 en el
registro de integridad; configurar banco de 20 preguntas con N=10 y verificar que dos
estudiantes reciben subconjuntos distintos.

---

## Phase C: Calculo de integrity_score y reporte Gemini

**Purpose**: Docente puede ver reporte de integridad con patrones detectados por IA y
exportarlo como evidencia CES.

- [ ] T011 [US3] Implementar `features/exam-integrity/integrity.ts`:
      `calculateIntegrityScore(attempt)` — formula determinista basada en tab_switches,
      tiempo por pregunta y velocidad total; ejecutar en servidor al guardar el intento
      y persistir el score
- [ ] T012 [US3] Implementar `GET /api/quiz/[quizId]/integrity-report/route.ts`:
      carga todos los `quiz_attempt_integrity` del quiz; calcula similitud Jaccard entre pares
      de `answer_vector` (similitud > 0.85 y orden diferente = flag "Patron sospechoso");
      envia resumen a Gemini para narrativa en español; retorna
      `{ attempts_summary, suspicious_pairs, gemini_narrative, generated_at }`
- [ ] T013 [US3] Agregar boton "Ver reporte de integridad" en `QuizBuilder.tsx` vista de
      intentos completados: dialog con tabla de intentos + badges de flags sospechosos +
      narrativa Gemini + boton "Exportar PDF/CSV"; PDF via libreria existente en
      `lib/pdf-certificate.ts`, CSV via `Blob + URL.createObjectURL`

**Checkpoint**: Despues de 3 intentos de quiz, el reporte se genera en < 60s; dos intentos
con respuestas identicas son marcados como "Patron sospechoso"; el CSV descargado contiene
datos de todos los intentos.

---

## Dependencies & Execution Order

- T001, T002, T003, T004 pueden ejecutarse en paralelo entre si (son bloques de base independientes).
- T005 depende de T001 y T002; T006 depende de T002 y T003.
- Phase B puede comenzar en paralelo con la finalizacion de Phase A — T007 y T008 son independientes.
- T009 y T010 dependen de T007 y T008 respectivamente.
- Phase C depende de T006 (integridad guardada) y T003 (tabla creada); T011 -> T012 -> T013.

## Agent Team Strategy

- **Agente 1 (Aleatorizacion)**: T001 -> T002 -> T005 -> T006
- **Agente 2 (DB + tipos)**: T003 + T004 (paralelo con Agente 1)
- **Agente 3 (Timer + Visibility)**: T007 + T008 (paralelo) -> T009 -> T010
- **Agente 4 (Integrity + Reporte)**: T011 -> T012 -> T013 (una vez T006 listo)
