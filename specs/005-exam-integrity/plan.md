# Implementation Plan: Anti-fraude en Evaluaciones con IA

**Branch**: `005-exam-integrity` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)

## Summary

Extender el componente existente `QuizEngine.tsx` con aleatorizacion de preguntas y opciones
por semilla determinista (user_id + quiz_id), temporizador con auto-envio, deteccion de cambios
de pestaña via Page Visibility API, y registro de metricas de integridad por intento. Una
nueva ruta API usa Gemini para analizar patrones post-examen y generar el reporte de
integridad exportable requerido por Art. 62 RRA 2022.

## Technical Context

**Language/Version**: TypeScript 5.x
**Framework**: Next.js 15 App Router — app existente en `apps/web/`
**CSS**: Tailwind CSS 4 + shadcn/ui
**DB**: Supabase PostgreSQL (nueva tabla quiz_attempt_integrity)
**Auth**: Supabase Auth (operativo)
**Deploy**: Vercel (tecnologico.itseia.ai)
**IA**: Gemini API via `apps/web/src/lib/ai/gemini.ts` (ya integrado)
**Componente existente a modificar**: `apps/web/src/components/session/QuizEngine.tsx`
**API existente a modificar**: `apps/web/src/app/api/quiz/[quizId]/attempt/route.ts`
**Teacher component a modificar**: `apps/web/src/components/teacher/QuizBuilder.tsx`
**Dependencias nuevas**: ninguna — `crypto.getRandomValues` disponible en navegador moderno
para seed-based shuffle; Page Visibility API nativa

## Constitution Check

1. **Problema institucional**: Art. 62 RRA 2022 exige mecanismos documentados de deteccion
   de deshonestidad academica en evaluaciones online. Sin esto el CES puede rechazar o
   condicionar la aprobacion de modalidad en linea.
2. **Roles afectados**: estudiante (realiza quiz con mecanismos activos sin experiencia
   invasiva), docente (configura banco de preguntas, revisa reporte de integridad),
   admin (exporta reportes como evidencia SENESCYT).
3. **Datos, permisos y riesgos**: `quiz_attempt_integrity` contiene timestamps detallados
   y patrones de comportamiento — datos sensibles de rendimiento academico. RLS: solo el
   docente asignado a la materia y el admin pueden leer; el estudiante no puede ver su
   propio registro de integridad (previene gaming). Riesgo: la aleatorizacion en cliente
   puede ser manipulada — mitigar generando el orden en servidor y enviandolo firmado.
4. **Verificacion de exito**: test con dos usuarios simultaneos verificando ordenes
   distintos. Test de auto-envio: dejar timer llegar a 0 y verificar que el intento se
   guarda correctamente. Test de tab-switch: cambiar de pestaña y verificar registro.
5. **Slice minimo util**: aleatorizacion + timer + tab-switch detection + registro de
   integridad. El banco rotativo (P2) y el reporte Gemini (P3) se incluyen en Phase B/C
   respectivamente porque son independientes y de mayor riesgo tecnico.
6. **CES Compliance (Principio VI)**: satisface directamente Art. 62 RRA 2022. Los reportes
   exportables son la evidencia documentada de mecanismos de integridad academica.
7. **AI-First (Principio VII)**: Gemini analiza patrones de respuesta post-examen — enfoque
   de anti-fraude no invasivo (sin camara, sin software adicional). Cumple Principio VII:
   "AI-powered pattern analysis, not invasive proctoring software".
8. **Calidad de contenido (Principio VIII)**: la aleatorizacion afecta la entrega del
   contenido de quizzes. Los quizzes siguen necesitando cumplir el estandar de 5 preguntas
   con explicaciones (Principio VIII punto 4).

## Project Structure

### Documentacion

```text
specs/005-exam-integrity/
├── plan.md          (este archivo)
└── spec.md
```

### Codigo fuente — archivos nuevos

```text
apps/web/src/
├── app/
│   └── api/
│       └── quiz/
│           └── [quizId]/
│               ├── start/route.ts          — POST: genera orden aleatorio en servidor, retorna seed firmado
│               └── integrity-report/route.ts — GET: genera reporte con Gemini para docente/admin
├── features/
│   └── exam-integrity/
│       ├── shuffle.ts       — Fisher-Yates shuffle con seed determinista (mulberry32 PRNG)
│       ├── timer.ts         — hook useQuizTimer(durationSeconds, onExpire)
│       ├── visibility.ts    — hook useTabVisibility() — Page Visibility API
│       └── integrity.ts     — calcula integrity_score 0-100 desde metricas de integridad
```

### Codigo fuente — archivos modificados

```text
apps/web/src/
├── components/session/QuizEngine.tsx
│     — aleatorizacion de preguntas y opciones via shuffle.ts con seed del servidor
│     — temporizador visible con auto-submit al expirar
│     — registro de time_per_question (timestamp por pregunta)
│     — tab-switch detection via useTabVisibility()
│     — enviar metricas de integridad al guardar el intento
├── components/teacher/QuizBuilder.tsx
│     — agregar configuracion de timer (minutos)
│     — agregar opcion "Banco rotativo": definir N preguntas del banco, mostrar M
│     — agregar boton "Reporte de integridad" en vista de intentos del quiz
├── app/api/quiz/[quizId]/attempt/route.ts
│     — validar que el order enviado por el cliente coincide con el seed firmado del servidor
│     — guardar quiz_attempt_integrity junto con el intento
└── types/database.ts
      — agregar tipo QuizAttemptIntegrity
```

### Base de datos — migraciones nuevas

```text
supabase/migrations/
└── 20260322_005_exam_integrity.sql
    — ALTER TABLE quizzes ADD COLUMN timer_minutes int DEFAULT NULL
    — ALTER TABLE quizzes ADD COLUMN bank_size int DEFAULT NULL (total preguntas en banco)
    — ALTER TABLE quizzes ADD COLUMN show_n_questions int DEFAULT NULL (cuantas mostrar)
    — CREATE TABLE quiz_attempt_integrity
    — RLS: solo docente de la materia y admin pueden SELECT; nadie mas
    — Index: quiz_attempt_integrity(attempt_id)
```

## Implementation Phases

### Phase A: Aleatorizacion en servidor y modificacion de QuizEngine

**Objetivo**: dos estudiantes que toman el mismo quiz reciben ordenes de pregunta distintos.

- Implementar `features/exam-integrity/shuffle.ts`:
  - Algoritmo Fisher-Yates con PRNG `mulberry32` (seed = hash(user_id + quiz_id + attempt_number)).
  - Exportar `shuffleWithSeed<T>(array: T[], seed: number): T[]`.
  - La semilla se genera en el servidor al iniciar el quiz (`POST /api/quiz/[quizId]/start`).
- Implementar `POST /api/quiz/[quizId]/start`:
  - Recibe `userId`, calcula `seed = murmurhash(userId + quizId + timestamp)`.
  - Genera `shuffledQuestionIds[]` y `shuffledOptionOrder` por pregunta.
  - Retorna `{ seed, shuffledQuestionIds, optionOrders, signedToken }` — token HMAC firmado
    con `QUIZ_INTEGRITY_SECRET` para que el cliente no pueda alterar el orden.
- Modificar `QuizEngine.tsx`:
  - Al montar: llama `POST /api/quiz/[quizId]/start`, recibe orden aleatorio del servidor.
  - Renderiza preguntas en el orden recibido; opciones en el orden recibido.
  - Al enviar el intento: incluye `signedToken` y `questionOrder[]` para validacion.
- Modificar `POST /api/quiz/[quizId]/attempt/route.ts`:
  - Verificar HMAC del `signedToken` antes de guardar el intento.
  - Guardar `question_order` en `quiz_attempt_integrity`.

### Phase B: Temporizador, tab-switch detection y banco rotativo

**Objetivo**: quiz tiene tiempo limite; las ausencias de pestaña se registran; docente puede
configurar banco rotativo.

- Implementar `features/exam-integrity/timer.ts`:
  - Hook `useQuizTimer(totalSeconds: number, onExpire: () => void)`.
  - Retorna `{ secondsLeft, formattedTime, isExpired }`.
  - `onExpire` llama el submit automatico del quiz con las respuestas hasta ese momento.
  - El tiempo restante persiste en `localStorage` keyed por `attempt_id` para sobrevivir
    recargas accidentales.
- Implementar `features/exam-integrity/visibility.ts`:
  - Hook `useTabVisibility()` que escucha `document.addEventListener('visibilitychange')`.
  - Retorna `{ tabSwitchCount, lastSwitchAt }`.
  - Cada switch incrementa el contador local que se envia junto al intento.
- Modificar `QuizEngine.tsx`:
  - Integrar `useQuizTimer` — mostrar countdown en header del quiz con alerta visual a < 5 min.
  - Integrar `useTabVisibility` — mostrar banner de advertencia al primer tab-switch.
  - Al enviar el intento (manual o auto): incluir `{ time_per_question, tab_switch_count }`.
- Crear tabla `quiz_attempt_integrity`:
  - `id`, `attempt_id` (FK), `time_per_question` (jsonb: `{questionId: seconds}`),
    `tab_switches` (int), `question_order` (jsonb: `questionId[]`), `option_orders` (jsonb),
    `integrity_score` (int 0-100, calculado post-envio), `suspicious_flags` (jsonb), `created_at`.
- Modificar `QuizBuilder.tsx`:
  - Agregar campo "Tiempo limite (minutos)" — opcional, null = sin limite.
  - Agregar toggle "Banco rotativo": si activo, campo "Mostrar N preguntas de M total".
  - Modificar logica de `POST /api/quiz/[quizId]/start`: si banco rotativo activo,
    seleccionar N preguntas aleatoriamente del banco de M antes de shuffle de orden.

### Phase C: Calculo de integrity_score y reporte Gemini

**Objetivo**: docente puede ver reporte de integridad con patrones detectados por IA.

- Implementar `features/exam-integrity/integrity.ts`:
  - `calculateIntegrityScore(attempt: QuizAttemptIntegrity): number` — regla simple:
    100 - (tab_switches * 10) - (si tiempo_por_pregunta < 3s para > 50% preguntas: -20)
    - (si respuestas todas en primeros 30s: -30). Minimo 0.
  - Esta funcion se ejecuta en el servidor al guardar el intento y se persiste.
- Implementar deteccion de patrones entre intentos en `GET /api/quiz/[quizId]/integrity-report`:
  - Cargar todos los `quiz_attempt_integrity` del quiz.
  - Calcular similitud de respuestas entre pares de intentos (Jaccard similarity de
    `answer_vector`). Si similitud > 0.85 y orden diferente: flag "Patron sospechoso".
  - Enviar el resumen a Gemini para narrativa del reporte:
    Prompt: "Analiza estos {n} intentos del quiz '{titulo}'. Datos: {json_resumen}.
    Identifica patrones anomalos y genera un parrafo de observacion en español. Sé objetivo."
  - Retornar `{ attempts_summary, suspicious_pairs, gemini_narrative, generated_at }`.
- Modificar `QuizBuilder.tsx`: agregar boton "Ver reporte de integridad" en la vista de
  intentos completados. Abre dialog con tabla de intentos + badges de flags sospechosos
  + narrativa Gemini + boton "Exportar PDF/CSV".
- Exportacion PDF: usar `lib/pdf-certificate.ts` como referencia para generar PDF del reporte
  (reutilizar cliente PDF ya instalado). CSV via Blob + URL.createObjectURL.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Seed generado en servidor + token HMAC | Si el orden se genera en cliente, el estudiante puede inspeccionar el orden correcto antes de responder | Sin firma del servidor la aleatorizacion es cosmética, no segura |
| PRNG custom (mulberry32) en lugar de Math.random | Math.random no es seedable en JS — imposible reproducir el orden para verificacion post-facto | Sin reproducibilidad el docente no puede verificar que dos estudiantes tuvieron ordenes distintos |

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Auto-submit falla si usuario perdio conexion | Media | Alto | Guardar respuestas parciales en localStorage cada 30s; al reconectar, enviar el estado guardado |
| Page Visibility API bloqueada por algunos browsers (iOS Safari full-screen) | Baja | Bajo | Documentar limitacion; en iOS Safari el tab-switch puede no detectarse siempre |
| Gemini tarda > 60s para grupos grandes (>50 estudiantes) | Baja | Medio | Generar reporte de forma asincrona con indicador de progreso; retornar `202 Accepted` y polling |
| Integrity score gaming (estudiante ralentiza respuestas artificialmente) | Baja | Bajo | El score es solo orientativo para el docente — la decision final es humana |
| QUIZ_INTEGRITY_SECRET no configurado en Vercel | Media | Alto | Validacion de startup: si no existe la variable, lanzar error en build |

## Environment Variables Required

```bash
QUIZ_INTEGRITY_SECRET=   # Secret HMAC para firmar el token de orden aleatorio (min 32 chars)
```

Las variables de Gemini y Supabase ya estan configuradas.
