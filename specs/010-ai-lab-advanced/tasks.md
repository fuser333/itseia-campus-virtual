# Tasks: AI Lab Avanzado — Segundo Cerebro y Multi-herramienta

**Input**: plan.md + spec.md
**Prerequisites**: Fase 3 de la plataforma completa — `AILabPanel.tsx` operativo con chat
Gemini contextualizado, `ChatPanel.tsx` en `/ai-lab`, pagina de sesion con 7 tabs activos,
perfil del estudiante existente.

**Tests**: Verificar RLS (estudiante A no lee conversaciones de estudiante B); confirmar que
Pyodide se carga solo al abrir el sub-tab Playground (no en la carga inicial de la sesion);
que un bucle `while True:` termina en 10s con mensaje de timeout y no bloquea la UI;
que el endpoint de generacion de flashcards retorna el mensaje correcto cuando `theory_markdown`
es null.

## Format: `[ID] [P?] [Story] Description`
- P = paralelizable (puede ejecutarse concurrentemente con otras tareas P)
- Story = historia de usuario que sirve

---

## Phase A: Historial de conversaciones y persistencia

**Purpose**: Cada conversacion queda guardada en Supabase y el estudiante puede leer su
historial. Esta es la capacidad base del AI Lab Avanzado y prerequisito de las siguientes fases.

- [ ] T001 [US1] Crear migracion `supabase/migrations/20260322_010_ai_lab_advanced.sql` con
      tablas `ai_conversations`, `ai_favorites`, `code_snippets`, `flashcards`,
      `flashcard_decks`; RLS que restringe lectura y escritura a `user_id = auth.uid()`;
      indices en `ai_conversations(user_id, session_id)`,
      `ai_conversations(user_id, created_at DESC)`, `flashcards(user_id, session_id)`,
      `code_snippets(user_id, session_id)`

- [ ] T002 [P] [US1] Extender `apps/web/src/types/database.ts` con tipos `AIConversation`,
      `AIFavorite`, `CodeSnippet`, `Flashcard`, `FlashcardDeck`

- [ ] T003 [P] [US1] Implementar `apps/web/src/features/ai-lab/queries.ts` con funciones:
      `getConversations(userId, sessionId?, page?)` paginado a 20 por pagina,
      `getFavorites(userId)`, `getFlashcards(userId, sessionId?)`, `getSnippets(userId, sessionId?)`

- [ ] T004 [US1] Implementar `apps/web/src/features/ai-lab/actions.ts` con Server Actions:
      `saveConversation(sessionId, messages[], model, esComparacion?)` hace UPSERT en
      `ai_conversations` actualizando el array JSONB con cada turno de la conversacion;
      `toggleFavorite(conversationId, mensajeIndex)` hace UPSERT/DELETE en `ai_favorites`;
      `saveSnippet(sessionId, language, code, output)` inserta en `code_snippets`;
      `saveFlashcards(sessionId, cards[])` inserta en `flashcards` y crea `flashcard_deck`;
      `updateDeckCompletion(deckId, cardsRevisadas)` actualiza `completed_at`

- [ ] T005 [US1] Implementar `GET /api/ai-lab/conversations/route.ts` con paginacion y
      filtro opcional por `session_id`; y `GET|POST /api/ai-lab/favorites/route.ts`

- [ ] T006 [US1] Modificar `apps/web/src/app/ai-lab/ChatPanel.tsx` para persistir
      conversaciones: al enviar cada mensaje del usuario y al recibir cada respuesta del
      asistente llamar `saveConversation`; al montar el componente, llamar `getConversations`
      para pre-poblar la ultima conversacion de esa sesion; agregar icono de estrella por
      respuesta del asistente que llama `toggleFavorite`; agregar enlace
      "Ver historial completo" en el header del panel

- [ ] T007 [P] [US1] Implementar `apps/web/src/components/ai-lab/ConversationHistory.tsx`
      (lista paginada) y `apps/web/src/app/ai-lab/historial/page.tsx` que renderiza el
      historial global con filtro por materia, nombre de sesion en cada item, excerpt del
      primer mensaje, chip del modelo y paginacion via boton "Cargar mas"

**Checkpoint**: Estudiante envia mensaje en AI Lab, cierra la sesion, la reabre y ve el
historial pre-cargado; navega a `/ai-lab/historial` y ve todas sus conversaciones anteriores;
un intento de lectura de conversaciones de otro usuario devuelve 0 filas (RLS activo).

---

## Phase B: Modo Comparacion

**Purpose**: Estudiante puede comparar respuestas de Gemini con ChatGPT, Claude o Perplexity
sin salir de la plataforma ni integrar APIs de pago adicionales.

- [ ] T008 [US2] Implementar `apps/web/src/components/ai-lab/ComparisonMode.tsx`: layout dos
      columnas (izquierda: ChatPanel Gemini existente; derecha: selector de modelo externo +
      boton "Abrir en [modelo]"); en mobile < 768px colapsar a dos tabs verticales con
      `flex-col`; construir URL con `encodeURIComponent(pregunta)` para cada modelo
      (ChatGPT: `chatgpt.com/?q=`, Claude: `claude.ai/new?q=`, Perplexity:
      `perplexity.ai/search?q=`); al hacer click en "Comparar" enviar a Gemini y activar el
      boton de apertura del modelo externo; boton "Guardar comparacion" llama
      `saveConversation` con `esComparacion = true`; URLs extraidas en
      `apps/web/src/features/ai-lab/constants.ts`

- [ ] T009 [US2] Modificar `apps/web/src/components/session/AILabPanel.tsx` para agregar
      sub-tabs: "Chat" | "Comparar" | "Playground" | "Flashcards"; el sub-tab "Comparar"
      renderiza `ComparisonMode`; preservar el comportamiento existente del tab "Chat"

**Checkpoint**: Estudiante activa el sub-tab "Comparar", escribe una pregunta, ve la
respuesta de Gemini en la columna izquierda y el boton que abre ChatGPT con la pregunta
precargada en nueva pestana; en mobile los dos paneles son tabs apiladas.

---

## Phase C: Playground de Codigo

**Purpose**: Estudiante ejecuta Python y JavaScript en el navegador sin instalar nada, con
timeout de 10s via Web Worker y boton "Depurar con IA".

- [ ] T010 [US3] Implementar `apps/web/src/features/ai-lab/pyodide-worker.ts` como Web
      Worker: carga Pyodide desde CDN con lazy import; acepta mensaje
      `{ type: 'run', code: string, language: 'python' | 'javascript' }`; redirige stdout y
      stderr de Python; para JavaScript evalua con `eval` en contexto aislado del worker;
      retorna `{ output, error, duration_ms }`; el thread principal llama
      `worker.terminate()` si no responde en 10000ms y retorna mensaje de timeout

- [ ] T011 [US3] Implementar `apps/web/src/components/ai-lab/PlaygroundOutput.tsx`: panel
      con stdout en texto normal, stderr en rojo con numero de linea destacado, mensaje de
      timeout estandarizado, soporte de imagen PNG base64 para output de matplotlib (si
      el resultado contiene prefijo `data:image/png;base64`)

- [ ] T012 [US3] Implementar `apps/web/src/components/ai-lab/CodePlayground.tsx`: editor
      CodeMirror lazy-loaded (import dinamico `() => import('@codemirror/...')` solo cuando
      el sub-tab Playground se activa); selector Python/JavaScript; boton "Ejecutar" que
      crea o reutiliza el Web Worker y renderiza `PlaygroundOutput`; boton "Depurar con IA"
      que inyecta en el ChatPanel el prompt automatico con codigo y error; boton "Guardar
      snippet" que llama `saveSnippet`; pre-cargar el campo `ejercicio_codigo` de la sesion
      activa si existe, o mostrar el editor en blanco

- [ ] T013 [P] [US3] Agregar campo `ejercicio_codigo` (JSONB con `language` y `code`) a
      la tabla `sessions` en una migracion complementaria o via columna adicional; modificar
      el panel de edicion de sesion del docente
      (`apps/web/src/app/teacher/materias/[id]/sesion/[num]/edit/page.tsx`) para incluir
      un campo de texto donde el docente puede cargar el codigo inicial del ejercicio

- [ ] T014 [P] [US3] Integrar el sub-tab "Playground" en `AILabPanel.tsx` que renderiza
      `CodePlayground`; implementar `GET|POST /api/ai-lab/snippets/route.ts` para guardar
      y recuperar snippets

**Checkpoint**: Estudiante abre el sub-tab Playground (Pyodide NO se carga antes de este
momento), ejecuta `print("Hola ITSEIA")` en Python, ve la salida en menos de 3 segundos;
ejecuta `while True: pass` y ve el mensaje de timeout en 10s sin que la UI se bloquee;
hace click en "Depurar con IA" con un error y el ChatPanel recibe el prompt automatico.

---

## Phase D: Flashcards generadas por IA

**Purpose**: Estudiante genera flashcards desde la teoria de la sesion con un click, las
edita y las guarda en su mazo personal para sesiones de repaso.

- [ ] T015 [US4] Implementar `POST /api/ai-lab/flashcards/generate/route.ts`: fetch de
      `theory_markdown` de la sesion desde Supabase; si es null o vacio retornar
      `{ error: "NO_THEORY" }` con status 400; llamar Gemini API con el prompt de generacion
      de flashcards (5-15 cards, formato JSON con `frente` y `dorso`); parsear respuesta con
      try/catch; reintentar una vez con temperatura menor si el parseo falla; retornar el
      array de flashcards sin guardar todavia

- [ ] T016 [US4] Implementar `apps/web/src/components/ai-lab/FlashcardViewer.tsx`: vista
      unica de una card con animacion CSS `transform: rotateY(180deg)` al hacer click o
      presionar espacio; navegacion con botones "Anterior"/"Siguiente" y teclas de flecha;
      indicador "Card X de N"; edicion inline con icono de lapiz que convierte el texto en
      `contenteditable` o `<input>`; estado gestionado localmente antes de guardar

- [ ] T017 [US4] Implementar `apps/web/src/components/ai-lab/FlashcardGenerator.tsx`:
      boton "Generar Flashcards" con spinner; manejo de `NO_THEORY` con mensaje descriptivo;
      al recibir las cards renderiza `FlashcardViewer` en modo edicion; boton "Guardar en
      mi mazo" llama `saveFlashcards(sessionId, cards[])` via Server Action e inserta en
      `flashcards` + crea `flashcard_deck`

- [ ] T018 [P] [US4] Implementar `apps/web/src/components/ai-lab/FlashcardDeckSession.tsx`:
      renderiza `FlashcardViewer` con mazo en orden aleatorio (Fisher-Yates en cliente);
      pantalla de resumen al terminar con boton "Repetir" y "Volver"; actualiza
      `flashcard_decks.completed_at` y `cards_revisadas` via `updateDeckCompletion`

- [ ] T019 [P] [US4] Implementar `apps/web/src/app/flashcards/page.tsx`: lista de mazos del
      estudiante agrupados por materia (fetch via `getFlashcards(userId)`); boton "Repasar"
      por materia o sesion que abre `FlashcardDeckSession`; implementar
      `GET|POST /api/ai-lab/flashcards/route.ts` para recuperar y actualizar mazos

- [ ] T020 [US4] Integrar el sub-tab "Flashcards" en `AILabPanel.tsx`: si no hay mazo
      guardado para la sesion activa, renderiza `FlashcardGenerator`; si ya hay mazo
      guardado, renderiza `FlashcardViewer` en modo repaso con boton "Regenerar"; agregar
      enlace "Mi Mazo" en la pagina global `/ai-lab` apuntando a `/flashcards`

**Checkpoint**: Estudiante hace click en "Generar Flashcards" en una sesion con teoria
cargada, ve al menos 5 cards en menos de 10 segundos, edita una card, guarda el mazo, navega
a `/flashcards`, selecciona el mazo y repasa las cards; el estado `completed_at` del deck
se actualiza en Supabase al terminar el repaso.

---

## Dependencies & Execution Order

- Phase A es la base bloqueante — T001, T002, T003 pueden correr en paralelo; T004, T005, T006
  y T007 requieren T001 y T002.
- Phase B requiere T004 (Server Actions) y T009 requiere T008. T008 puede empezar en paralelo
  con Phase A post-T001.
- Phase C es independiente de Phase B. T010 y T013 pueden correr en paralelo entre si. T011
  puede correr en paralelo con T010. T012 requiere T010 y T011. T014 requiere T012.
- Phase D es independiente de Phase C. T015, T016, T017 son secuenciales entre si. T018 y
  T019 son paralelizables post-T017. T020 requiere T017 completo.
- T009 (sub-tabs en AILabPanel) es un hub que bloquea la integracion visible de las Phases
  B, C y D — puede implementarse temprano con sub-tabs vacios (placeholders) para que las
  otras fases puedan integrarse incrementalmente.

## Agent Team Strategy

- **Agente 1 (Data + Actions)**: T001 -> T002 -> T003 -> T004 -> T005
- **Agente 2 (Chat + Historial)**: T002 (paralelo) -> T006 -> T007
- **Agente 3 (ComparisonMode)**: T008 -> T009 (hub de sub-tabs AILabPanel, con placeholders)
- **Agente 4 (Playground)**: T010 -> T011 -> T012; T013 + T014 en paralelo post-T012
- **Agente 5 (Flashcards)**: T015 -> T016 -> T017; T018 + T019 en paralelo -> T020
