# Implementation Plan: AI Lab Avanzado — Segundo Cerebro y Multi-herramienta

**Branch**: `010-ai-lab-advanced` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)

## Summary

Evolucionar el AI Lab de un chat Gemini simple (existente en Fase 3) a una plataforma de
aceleracion del aprendizaje con cuatro capacidades nuevas: (1) historial de conversaciones
persistido en Supabase, (2) modo comparacion que abre ChatGPT/Claude/Perplexity con la
pregunta precargada en nueva pestana, (3) Playground de codigo Python/JavaScript con Pyodide
(WebAssembly en navegador, costo $0), y (4) generacion de flashcards desde la teoria de la
sesion via Gemini API con mazo personal del estudiante. El grafo de conocimiento inter-sesiones
queda diferido a Fase 5.

## Technical Context

**Language/Version**: TypeScript 5.x
**Framework**: Next.js 15 App Router — app existente en `apps/web/`
**CSS**: Tailwind CSS 4 + shadcn/ui
**DB**: Supabase PostgreSQL + RLS activo
**Auth**: Supabase Auth (operativo)
**Deploy**: Vercel (tecnologico.itseia.ai)
**Gemini API**: gemini-2.5-flash-lite (ya integrado); clave en variable de entorno
  `GEMINI_API_KEY`

**Dependencias nuevas**:
- `pyodide` — Python 3.11 via WebAssembly en navegador. Se carga desde CDN oficial
  (`https://cdn.jsdelivr.net/pyodide/v0.27.x/full/pyodide.js`) con lazy loading para no
  afectar el First Contentful Paint del resto de la plataforma. Costo: $0 (ejecucion local
  en el navegador del estudiante).
- `@codemirror/lang-python` + `@codemirror/lang-javascript` — editor con syntax highlighting.
  Alternativa: `react-simple-code-editor` si el bundle de CodeMirror resulta demasiado pesado.
  Justificacion: un `<textarea>` sin syntax highlighting degrada la experiencia en un curso
  de IA; la diferencia pedagogica es material.

**Componentes existentes relevantes**:
- `apps/web/src/components/session/AILabPanel.tsx` — panel de AI Lab de la sesion activa;
  se extiende con las 4 nuevas capacidades preservando la interfaz actual
- `apps/web/src/app/ai-lab/ChatPanel.tsx` — componente de chat de la pagina `/ai-lab`;
  se extiende con historial y modo comparacion
- `apps/web/src/app/ai-lab/page.tsx` — pagina global de AI Lab; se extiende con navigation
  a historial global y mazo de flashcards
- `apps/web/src/app/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx` — pagina
  de sesion; el tab AI Lab ya renderiza `AILabPanel`; se agrega el sub-tab Playground

## Constitution Check

1. **Problema institucional**: El tab AI Lab es uno de los 7 tabs obligatorios del Content
   Quality Standard (Principio VIII). En su forma actual es un chat Gemini basico sin
   historial ni capacidades avanzadas. El CEO identifica el AI Lab como el diferenciador
   tecnico que convierte la plataforma de un LMS generico a una experiencia de aprendizaje
   con IA real. Fase 4 del roadmap: Diferenciacion ITSEIA. El tutor IA contextualizado cumple
   ademas el requisito CES Art. 61 RRA 2022 de herramienta de tutoria asincrona.
2. **Roles afectados**: estudiante (usa todas las capacidades — chat, comparacion, playground,
   flashcards, historial, mazo personal); docente (puede ver snippets guardados en entregas
   si se integra en fases futuras; en esta fase su rol es de configurar el ejercicio de codigo
   de la sesion que se precarga en el Playground); admin (visualizacion de uso de AI Lab en
   `/admin/ai-usage` ya existente — no requiere cambios en esta fase).
3. **Datos, permisos y riesgos**: nuevas tablas `ai_conversations`, `ai_favorites`,
   `code_snippets`, `flashcards`, `flashcard_decks` con RLS por `user_id`. Riesgo principal:
   Pyodide ejecuta codigo arbitrario del estudiante en el navegador — el sandbox de WebAssembly
   aísla el codigo del sistema operativo y del filesystem del servidor (no hay riesgo de
   server-side code execution). En el navegador, un bucle infinito puede bloquear el tab del
   estudiante — mitigado con un Web Worker que puede terminarse con `worker.terminate()` al
   cumplir el timeout de 10s. Riesgo de costo Gemini por generacion de flashcards: gemini-
   2.5-flash-lite a $0.10/$0.40 por 1M tokens; una teoria de sesion tipica es ~2000 tokens
   de entrada, ~300 tokens de salida = ~$0.0003 por generacion. Con 200 estudiantes × 30
   sesiones = 6000 generaciones maximas/semestre = $1.80. Dentro del presupuesto de $150/mes.
4. **Verificacion de exito**: smoke test — estudiante abre AI Lab, envia pregunta, cierra la
   sesion, la reabre y ve el historial; ejecuta `print("ok")` en el Playground y ve la salida
   en menos de 3 segundos; genera flashcards de una sesion con teoria cargada y ve al menos
   5 cards. Test de permisos: estudiante A no puede leer conversaciones de estudiante B.
5. **Slice minimo util**: historial de conversaciones (US1) es la base de todo lo demas y la
   capacidad con mayor impacto en retencion diaria. Comparacion de modelos (US2) es el
   diferenciador pedagogico mas visible. Playground (US3) y flashcards (US4) son capacidades
   complementarias que se pueden lanzar en fases del sprint sin bloquearse mutuamente.
6. **CES Compliance (Principio VI)**: el historial de conversaciones del AI Lab constituye
   evidencia de tutoria asincrona verificable (Art. 61 RRA 2022). Los registros en
   `ai_conversations` son trazables por estudiante y por sesion — exportables para
   documentacion CES si se requiere. El Playground no es un requisito CES pero refuerza la
   componente practica del 65% exigida por el Content Quality Standard (Principio VIII).
7. **AI-First (Principio VII)**: Pyodide (WebAssembly) en lugar de servidor de computo
   dedicado — $0 adicional vs $20-$80/mes de un servidor Jupyter. Gemini para generacion
   de flashcards vs construccion manual por docentes. Comparacion de modelos es pedagogia
   de IA aplicada directamente dentro de la plataforma. Cumple el mandato de demostrar lo
   que se ensena.
8. **Calidad de contenido (Principio VIII)**: el Playground con ejercicio precargado convierte
   el tab Ejercicio de PDF de instrucciones a codigo ejecutable. Las flashcards generadas
   automatizan la creacion de material de repaso. Ambas capacidades elevan la calidad
   del contenido existente sin reemplazarlo.

## Project Structure

### Documentacion

```text
specs/010-ai-lab-advanced/
├── plan.md          (este archivo)
└── spec.md
```

### Codigo fuente — archivos nuevos

```text
apps/web/src/
├── app/
│   ├── ai-lab/
│   │   └── historial/
│   │       └── page.tsx                     — Historial global de conversaciones del estudiante
│   ├── flashcards/
│   │   └── page.tsx                         — Mazo personal de flashcards del estudiante
│   └── api/
│       └── ai-lab/
│           ├── conversations/route.ts       — GET: historial paginado; POST: guardar mensaje
│           ├── favorites/route.ts           — POST/DELETE: marcar/desmarcar favorito
│           ├── flashcards/generate/route.ts — POST: llama Gemini con teoria, retorna flashcards
│           ├── flashcards/route.ts          — GET: mazo del estudiante; POST: guardar mazo
│           └── snippets/route.ts            — GET/POST: snippets de codigo del estudiante
├── components/
│   └── ai-lab/
│       ├── ConversationHistory.tsx          — Lista paginada de conversaciones pasadas
│       ├── ComparisonMode.tsx               — Layout dos columnas: Gemini + modelo externo
│       ├── CodePlayground.tsx               — Editor CodeMirror + ejecucion Pyodide/Web Worker
│       ├── PlaygroundOutput.tsx             — Panel de salida (stdout, stderr, graficas)
│       ├── FlashcardViewer.tsx              — Vista frente/dorso con navegacion
│       ├── FlashcardGenerator.tsx           — Boton + spinner + mazo generado
│       └── FlashcardDeckSession.tsx         — Sesion de repaso en orden aleatorio
└── features/
    └── ai-lab/
        ├── actions.ts                       — Server Actions: saveConversation, generateFlashcards,
        │                                      saveSnippet, saveDeck
        ├── queries.ts                       — Consultas: getConversations, getFavorites,
        │                                      getFlashcards, getSnippets
        └── pyodide-worker.ts                — Web Worker para ejecucion de codigo con timeout
```

### Codigo fuente — archivos modificados

```text
apps/web/src/
├── components/session/AILabPanel.tsx
│     — agregar sub-tabs: "Chat" (existente) | "Comparar" | "Playground" | "Flashcards"
│     — en "Chat": integrar ConversationHistory del lado derecho (colapsable)
│     — en "Comparar": renderizar ComparisonMode
│     — en "Playground": renderizar CodePlayground con ejercicio de la sesion precargado
│     — en "Flashcards": renderizar FlashcardGenerator + FlashcardViewer si ya hay mazo
├── apps/web/src/app/ai-lab/ChatPanel.tsx
│     — extender con persistencia: guardar cada mensaje en ai_conversations via Server Action
│     — agregar boton de favorito por respuesta del asistente
│     — agregar enlace "Ver historial completo" -> /ai-lab/historial
└── types/database.ts
      — agregar tipos AIConversation, AIFavorite, CodeSnippet, Flashcard, FlashcardDeck
```

### Base de datos — migraciones nuevas

```text
supabase/migrations/
└── 20260322_010_ai_lab_advanced.sql
    — CREATE TABLE ai_conversations
      (id, user_id FK, session_id FK nullable, model text, messages JSONB,
       es_comparacion boolean default false, created_at, updated_at)
    — CREATE TABLE ai_favorites
      (id, user_id FK, conversation_id FK, mensaje_index integer, created_at)
      UNIQUE (user_id, conversation_id, mensaje_index)
    — CREATE TABLE code_snippets
      (id, user_id FK, session_id FK nullable, language text, code text,
       output text, created_at, updated_at)
    — CREATE TABLE flashcards
      (id, user_id FK, session_id FK, frente text, dorso text,
       editada boolean default false, created_at)
    — CREATE TABLE flashcard_decks
      (id, user_id FK, flashcard_ids JSONB, started_at, completed_at,
       cards_revisadas integer default 0, created_at)
    — RLS: todas las tablas restringen lectura y escritura a user_id = auth.uid()
    — INDEX: ai_conversations(user_id, session_id)
    — INDEX: ai_conversations(user_id, created_at DESC) para historial paginado
    — INDEX: flashcards(user_id, session_id)
    — INDEX: code_snippets(user_id, session_id)
```

## Implementation Phases

### Phase A: Historial de conversaciones y persistencia

**Objetivo**: cada conversacion en el AI Lab queda guardada en Supabase y el estudiante puede
acceder al historial desde su sesion y desde la pagina global `/ai-lab/historial`. Esta es
la capacidad de mayor impacto en retencion diaria y la base del resto del modulo.

- Crear migracion `20260322_010_ai_lab_advanced.sql` con las 5 tablas y RLS.
- Extender `apps/web/src/types/database.ts` con los 5 nuevos tipos.
- Modificar `apps/web/src/app/ai-lab/ChatPanel.tsx`:
  - Al enviar cada mensaje del usuario y al recibir cada respuesta del asistente, llamar la
    Server Action `saveConversation(sessionId?, messages[])` que hace UPSERT en
    `ai_conversations` con el array `messages` actualizado.
  - Al cargar el componente, llamar `getConversations(sessionId)` para recuperar la ultima
    conversacion de esa sesion y pre-poblar el chat.
  - Agregar icono de estrella (favorito) junto a cada respuesta del asistente; click llama
    `toggleFavorite(conversationId, mensajeIndex)`.
  - Enlace "Ver historial completo" en el header del ChatPanel que abre `/ai-lab/historial`.
- Implementar `GET /api/ai-lab/conversations/route.ts`: retorna conversaciones paginadas
  (20 por pagina, query param `?page=N`) filtradas por `user_id` del usuario autenticado;
  opcionalmente filtradas por `session_id`.
- Implementar `apps/web/src/app/ai-lab/historial/page.tsx` con `ConversationHistory.tsx`:
  lista de conversaciones ordenadas por `created_at DESC`, cada una con el nombre de la
  sesion y materia asociada, excerpt del primer mensaje del usuario, y chip del modelo usado.
  Paginacion: boton "Cargar mas" (infinite scroll no requerido en esta fase).
- Implementar `features/ai-lab/actions.ts` y `features/ai-lab/queries.ts` con las
  funciones base.

### Phase B: Modo Comparacion

**Objetivo**: estudiante puede comparar la respuesta de Gemini con la de ChatGPT, Claude o
Perplexity en un layout de dos columnas, sin iframes embebidos ni APIs de pago adicionales.

- Implementar `components/ai-lab/ComparisonMode.tsx`:
  - Layout en dos columnas (en mobile < 768px: dos tabs apiladas verticalmente con
    `flex-col`).
  - Columna izquierda: `ChatPanel` de Gemini existente, no duplicar logica.
  - Columna derecha: selector de modelo externo (ChatGPT, Claude, Perplexity) con radio
    buttons o dropdown; boton "Abrir en [modelo]" que construye la URL con la pregunta
    codificada:
    - ChatGPT: `https://chatgpt.com/?q={encodeURIComponent(pregunta)}`
    - Claude: `https://claude.ai/new?q={encodeURIComponent(pregunta)}`
    - Perplexity: `https://www.perplexity.ai/search?q={encodeURIComponent(pregunta)}`
  - Al hacer click en "Comparar": envia la pregunta a Gemini (columna izquierda) y activa
    el boton de apertura de la columna derecha con la misma pregunta precargada.
  - Boton "Guardar comparacion": llama `saveConversation` con flag `es_comparacion = true`
    y el modelo externo seleccionado registrado en el campo `model`.
- Agregar toggle "Modo Comparacion" en `AILabPanel.tsx` que activa/desactiva `ComparisonMode`.
- Agregar el sub-tab "Comparar" en `AILabPanel.tsx` como alternativa al toggle.

### Phase C: Playground de Codigo

**Objetivo**: estudiante puede ejecutar Python y JavaScript en el navegador sin instalar nada,
con el ejercicio de la sesion precargado, timeout de 10s y boton "Depurar con IA".

- Implementar `features/ai-lab/pyodide-worker.ts` como Web Worker:
  - Importa Pyodide desde CDN con lazy loading.
  - Expone un mensaje `{ type: 'run', code: string, language: 'python' | 'javascript' }`.
  - Captura `stdout` y `stderr` via `sys.stdout` redirect (Python) o `console` intercept (JS).
  - Retorna `{ output: string, error: string | null, duration_ms: number }`.
  - El worker parent llama `worker.terminate()` si no responde en 10s y retorna el mensaje
    de timeout.
- Implementar `components/ai-lab/CodePlayground.tsx`:
  - Editor con CodeMirror (`@codemirror/lang-python`, `@codemirror/lang-javascript`).
    Lazy-loaded: el import de CodeMirror ocurre solo cuando el estudiante abre el sub-tab
    "Playground" para no penalizar el FCP de la pagina de sesion.
  - Selector de lenguaje: Python / JavaScript.
  - Boton "Ejecutar": crea o reutiliza el Web Worker, envia el codigo, muestra spinner
    hasta recibir respuesta o timeout.
  - Boton "Depurar con IA": si hay error en la salida, envia al `ChatPanel` de Gemini el
    prompt automatico: "Tengo este codigo Python:\n```\n{code}\n```\nY este error:\n{error}\nExplica que esta mal y como corregirlo."
  - Boton "Guardar snippet": llama `saveSnippet(sessionId, language, code, output)`.
- Implementar `components/ai-lab/PlaygroundOutput.tsx`:
  - Panel inferior con `stdout` en texto normal, `stderr` en rojo con numero de linea
    destacado.
  - Mensaje de timeout: "Tiempo de ejecucion excedido (10s). Verifica si hay bucles
    infinitos."
  - Soporte de imagenes en output: si el codigo de Python usa matplotlib y genera una
    imagen via `plt.show()`, Pyodide puede retornar el PNG como base64 — renderizar como
    `<img>` (nice-to-have, no bloqueante para esta fase).
- Agregar sub-tab "Playground" en `AILabPanel.tsx` que renderiza `CodePlayground`.
- Modificar la entidad de sesion (o agregar campo en la tabla `sessions`) para almacenar
  `ejercicio_codigo` (language, code inicial). El docente puede cargarlo desde el panel de
  edicion de sesion. `CodePlayground` lee este campo al inicializarse para pre-poblar el
  editor; si no hay ejercicio definido, muestra el editor en blanco.
- Implementar `GET|POST /api/ai-lab/snippets/route.ts` para recuperar y guardar snippets.

### Phase D: Flashcards generadas por IA

**Objetivo**: estudiante puede generar flashcards desde la teoria de la sesion con un click,
editarlas y guardarlas en su mazo personal para sesiones de repaso.

- Implementar `POST /api/ai-lab/flashcards/generate/route.ts`:
  - Recibe `sessionId` del body.
  - Fetch del campo `theory_markdown` de la sesion desde Supabase (solo texto, sin imagenes).
  - Si `theory_markdown` esta vacio o null: retorna `{ error: "NO_THEORY" }` con status 400.
  - Llama Gemini API con el prompt:
    ```
    Genera entre 5 y 15 flashcards de estudio en formato JSON basandote en el siguiente
    texto. Cada flashcard debe tener: "frente" (una pregunta concisa) y "dorso" (la respuesta
    directa, maxima 3 oraciones). Prioriza conceptos clave, definiciones y formulas.
    Responde SOLO con el array JSON, sin texto adicional.
    Texto: {theory_markdown}
    ```
  - Parsear el JSON de la respuesta con try/catch; si falla el parseo, reintentar una vez
    con temperatura menor.
  - Retornar el array de flashcards generadas (no las guarda todavia; el estudiante primero
    las revisa y edita).
- Implementar `components/ai-lab/FlashcardGenerator.tsx`:
  - Boton "Generar Flashcards" visible en el sub-tab "Flashcards" del `AILabPanel`.
  - Al hacer click: spinner + llamada a `/api/ai-lab/flashcards/generate`.
  - Si responde `NO_THEORY`: mostrar mensaje "La teoria de esta sesion aun no esta disponible."
  - Al recibir las flashcards: renderiza `FlashcardViewer` con las cards generadas en modo
    edicion (frente y dorso editables inline).
  - Boton "Guardar en mi mazo": llama `saveFlashcards(sessionId, cards[])` que inserta en
    tabla `flashcards` y crea un `flashcard_deck` con los IDs.
- Implementar `components/ai-lab/FlashcardViewer.tsx`:
  - Vista unica de una card con animacion CSS flip 3D al hacer click (frente con la pregunta,
    dorso con la respuesta).
  - Navegacion: botones "Anterior" / "Siguiente" o teclas de flecha izquierda/derecha.
  - Espacio o click: voltear la card actual.
  - Indicador de progreso: "Card X de N".
  - Edicion inline: icono de lapiz que convierte el texto en `<input>` editable.
- Implementar `components/ai-lab/FlashcardDeckSession.tsx`:
  - Renderiza `FlashcardViewer` con el mazo completo en orden aleatorio (Fisher-Yates en
    cliente).
  - Al terminar todas las cards: pantalla de resumen "Repasaste N flashcards". Boton
    "Repetir" o "Volver al AI Lab".
  - Actualiza `flashcard_decks.completed_at` y `cards_revisadas` al finalizar.
- Implementar `apps/web/src/app/flashcards/page.tsx`:
  - Lista de mazos del estudiante agrupados por materia.
  - Boton "Repasar" por materia o por sesion que lanza `FlashcardDeckSession`.
- Agregar sub-tab "Flashcards" en `AILabPanel.tsx` que renderiza `FlashcardGenerator` (si
  no hay mazo guardado) o `FlashcardViewer` en modo repaso (si ya hay mazo guardado para
  esa sesion).
- Agregar enlace "Mi Mazo de Flashcards" en la pagina global `/ai-lab` que abre
  `/flashcards`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Pyodide via Web Worker (no servidor) | El Playground requiere ejecucion de codigo Python del estudiante. Un servidor Jupyter/Cloud Functions cuesta $20-$80/mes y tiene latencia de cold start. Pyodide en navegador es $0 y la primera carga (~8MB) ocurre solo una vez por sesion. | No hay servidor de computo dedicado bajo el presupuesto de $150/mes. Un `<iframe>` apuntando a replit.com o colab.google.com no permite precargar el ejercicio de la sesion de forma programatica. |
| Web Worker para timeout de ejecucion | El codigo en bucle infinito en el thread principal bloquea toda la UI del estudiante, incluido el boton de cancelar. El Web Worker puede terminarse desde el thread principal con `worker.terminate()`. | `setTimeout` en el thread principal no puede interrumpir codigo Python en ejecucion dentro de Pyodide |
| CodeMirror (editor con syntax highlighting) | Cursos de IA y Ciencia de Datos requieren que los estudiantes lean y escriban codigo. Sin syntax highlighting, la experiencia es degradada en comparacion con el entorno de trabajo real (VS Code, Jupyter). | Un `<textarea>` simple no cumple el standard pedagogico de un instituto especializado en IA |

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Pyodide no carga en conexiones lentas (primer carga ~8MB) | Media | Medio | Lazy loading: el CDN de Pyodide solo se importa cuando el estudiante abre el sub-tab "Playground", no al cargar la sesion. Mostrar spinner con mensaje "Cargando entorno Python..." |
| Gemini rechaza prompt de generacion de flashcards por contenido tecnico | Baja | Bajo | Catch de error de Gemini con mensaje amigable. Reintentar con prompt mas simple. El estudiante puede crear flashcards manualmente si la generacion falla. |
| Historial de conversaciones crece ilimitado en Supabase | Media | Bajo | Retener maximo 90 dias de conversaciones por usuario. Job programado (Supabase Edge Function o pg_cron) que borra `ai_conversations` con `created_at < now() - interval '90 days'`. Avisar al usuario en la UI. |
| `messages` JSONB crece mucho en conversaciones largas | Baja | Bajo | Limitar a 50 mensajes por conversacion en el cliente; al llegar al limite, iniciar una nueva conversacion automaticamente. |
| ComparisonMode: URLs de ChatGPT/Claude/Perplexity cambian | Baja | Bajo | URLs de apertura de chat son patrones publicos documentados. Extraer en constante `EXTERNAL_MODEL_URLS` en `features/ai-lab/constants.ts` para actualizar en un solo lugar. |

## Environment Variables Required

```bash
# No requiere nuevas variables de entorno
# Reutiliza GEMINI_API_KEY, NEXT_PUBLIC_SUPABASE_URL,
# NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY ya configuradas
```
