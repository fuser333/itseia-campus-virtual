# Feature Specification: AI Lab Avanzado — Segundo Cerebro y Multi-herramienta

**Feature Branch**: `010-ai-lab-advanced`
**Created**: 2026-03-22
**Status**: Draft
**Input**: Evolucion del AI Lab de un chat Gemini simple a una plataforma de aceleracion del aprendizaje con comparacion multi-modelo, ejecucion de codigo en navegador, generacion de flashcards, historial de conversaciones y herramientas de estudio integradas.

## Institutional Alignment *(mandatory)*

### Source Inputs

- `.specify/memory/constitution.md` — Principio VII (AI-First Architecture): "Every commodity capability MUST be evaluated against an AI-powered alternative"; Principio VIII (Content Quality Standard): el tab AI Lab es uno de los 7 obligatorios por sesion
- `docs/roadmap/fases.md` — Fase 4: Diferenciacion ITSEIA — AI Lab multi-modelo, analitica de aprendizaje, seguimiento de habilidades
- Vision CEO (2026-03-22): diferenciador tecnico central — el AI Lab convierte la plataforma de un LMS generico en una experiencia de aprendizaje con IA real
- Referencia externa: https://x.com/s0n_ia_/status/2035779678577852667 — concepto Segundo Cerebro aplicado a aprendizaje
- `docs/ces_aprobacion/INVESTIGACION_REQUISITOS_CES_ONLINE.md` — Art. 61 RRA 2022: herramientas de interaccion asincrona obligatorias (tutoria, mensajeria)

### Phase Fit

- **Roadmap Phase**: Fase 4 (Diferenciacion ITSEIA)
- **Why now**: El AI Lab basico (tab Gemini en cada sesion + botones a ChatGPT, Claude, Perplexity) ya existe desde Fase 3. Esta especificacion define la evolucion a una herramienta que hace lo que ningun LMS del mercado ecuatoriano ofrece: ejecutar codigo Python en el navegador, comparar respuestas de dos modelos de IA lado a lado, generar flashcards automaticamente del contenido de la sesion y guardar el historial de conversaciones. Estas capacidades son el argumento pedagogico y comercial de ITSEIA como "Instituto de IA" — la plataforma debe demostrar lo que ensena.
- **Out of scope**:
  - Integracion de pago a APIs de modelos comerciales para el estudiante (el estudiante usa sus propias cuentas via links externos en esta fase)
  - Grafo de conocimiento inter-sesiones (alta complejidad de visualizacion, diferir a Fase 5)
  - Reconocimiento de voz para notas (requiere API adicional; diferir a Fase 5)
  - Exportar materiales de estudio como PDF completo del modulo (Fase 5)
  - Repositorio de flashcards compartido entre estudiantes (Fase 5)
  - Sistema de repeticion espaciada automatizada con algoritmo SM-2 (Fase 5; esta fase solo genera y muestra las flashcards)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Estudiante usa el tutor IA con contexto de la sesion activa (Priority: P1)

Un estudiante esta en la sesion "Redes Neuronales Convolucionales" dentro de la materia Deep Learning. Abre el tab "AI Lab". Ve el chat de Gemini ya inicializado con un prompt de contexto que dice "Estoy estudiando Redes Neuronales Convolucionales en el curso de Deep Learning de ITSEIA. Ayudame a entender los conceptos de esta sesion." El estudiante escribe su pregunta en espanol y recibe una respuesta contextualizada. Puede continuar la conversacion. Al terminar la sesion, la conversacion queda guardada en su historial de AI Lab.

**Why this priority**: El tutor con contexto es la version minima del AI Lab Avanzado. Sin esto, las historias de comparacion y flashcards no tienen base. Ademas, un tutor IA contextualizado es la herramienta de tutoria asincrona que el CES exige (Art. 61 RRA 2022), lo que lo convierte en requisito de cumplimiento indirecto.

**Independent Test**: Un estudiante puede abrir el tab AI Lab en cualquier sesion, enviar una pregunta y recibir una respuesta de Gemini que mencione el tema de la sesion. La conversacion queda guardada en su historial.

**Acceptance Scenarios**:

1. **Given** estudiante en cualquier sesion academica, **When** abre el tab "AI Lab", **Then** el chat se inicializa con un mensaje de sistema que incluye el nombre de la sesion, el nombre de la materia y el nombre del programa.
2. **Given** chat inicializado, **When** el estudiante escribe una pregunta y presiona enviar, **Then** recibe una respuesta de Gemini en menos de 10 segundos.
3. **Given** estudiante completa una conversacion, **When** cierra la sesion y la vuelve a abrir, **Then** el historial de la ultima conversacion de esa sesion sigue visible.
4. **Given** estudiante accede al historial global de AI Lab desde su perfil, **When** navega el historial, **Then** ve todas sus conversaciones anteriores ordenadas por fecha, con el nombre de la sesion donde ocurrieron.
5. **Given** estudiante quiere marcar una respuesta util, **When** hace click en el icono de favorito junto a una respuesta, **Then** esa respuesta queda guardada en su lista de favoritos del AI Lab.

---

### User Story 2 — Estudiante compara respuestas de dos modelos de IA lado a lado (Priority: P2)

Un estudiante tiene una duda conceptual sobre regularizacion en Machine Learning. En el tab AI Lab, activa el "Modo Comparacion". Escribe su pregunta una sola vez. El sistema envia la misma pregunta a Gemini (integrado) y genera un link de apertura automatica hacia ChatGPT o Claude con la misma pregunta precargada. El estudiante ve las dos respuestas en columnas paralelas dentro de la plataforma. Puede anotar cual modelo respondio mejor y por que.

**Why this priority**: La comparacion de modelos es el diferenciador pedagogico mas visible del AI Lab. Ninguna plataforma educativa en Ecuador lo ofrece. Ensenar a los estudiantes a evaluar y comparar modelos de IA es parte del curriculo de IA. Es ademas el argumento de demo mas fuerte para ferias y sesiones sabatinas.

**Independent Test**: Un estudiante activa el Modo Comparacion, escribe una pregunta, y ve la respuesta de Gemini en la columna izquierda junto con un link que abre ChatGPT (o Claude) con la misma pregunta precargada en una nueva pestana del navegador.

**Acceptance Scenarios**:

1. **Given** estudiante en el AI Lab, **When** activa el toggle "Modo Comparacion", **Then** la interfaz se divide en dos columnas: columna izquierda (Gemini, integrado) y columna derecha con selector de modelo externo (ChatGPT, Claude, Perplexity).
2. **Given** modo comparacion activo, **When** estudiante escribe una pregunta y hace click en "Comparar", **Then** Gemini responde en la columna izquierda y la columna derecha muestra un boton "Abrir en [modelo seleccionado]" con la pregunta precargada via URL.
3. **Given** ambas respuestas visibles, **When** el estudiante hace click en "Abrir en ChatGPT", **Then** se abre una nueva pestana con la interfaz de ChatGPT con la pregunta ya escrita, lista para enviar.
4. **Given** comparacion realizada, **When** estudiante hace click en "Guardar comparacion", **Then** se guarda en su historial con las dos respuestas y el modelo seleccionado para comparar.

---

### User Story 3 — Estudiante ejecuta codigo Python en el navegador (Priority: P3)

Un estudiante esta en la sesion "Regresion Logistica" y quiere probar el ejercicio. En el tab "AI Lab", abre el sub-tab "Playground de Codigo". Ve un editor con el ejercicio de la sesion precargado en Python. Hace click en "Ejecutar". El codigo corre en el navegador y ve la salida (graficas, valores, errores) sin instalar Python ni Jupyter. Puede modificar el codigo y volver a ejecutar. Puede pedir al asistente IA "explica este error" y recibe orientacion contextualizada.

**Why this priority**: Para los cursos tecnicos (IA, Ciencia de Datos, Big Data) el codigo ejecutable es el componente practico mas valorado. Evita la barrera de instalacion de entornos que frustra a principiantes y permite al estudiante experimentar directamente dentro de la plataforma. Es el diferenciador que convierte el Ejercicio de cada sesion de un PDF de instrucciones a una experiencia interactiva.

**Independent Test**: Un estudiante puede abrir el Playground, ejecutar un snippet de Python con print("Hola ITSEIA") y ver la salida en menos de 3 segundos, sin instalar nada.

**Acceptance Scenarios**:

1. **Given** estudiante en el AI Lab de una sesion tecnica, **When** abre el sub-tab "Playground", **Then** ve un editor de codigo con el ejercicio de la sesion precargado (o en blanco si no hay ejercicio definido).
2. **Given** editor con codigo Python, **When** estudiante hace click en "Ejecutar", **Then** la salida aparece en el panel inferior en menos de 5 segundos sin abandonar la plataforma.
3. **Given** codigo con error de sintaxis, **When** estudiante ejecuta, **Then** el panel de salida muestra el mensaje de error en rojo con el numero de linea.
4. **Given** error visible en la salida, **When** estudiante hace click en "Depurar con IA", **Then** el chat de Gemini recibe automaticamente el codigo y el error, y responde con una explicacion y sugerencia de correccion.
5. **Given** estudiante modifica el codigo y lo mejora, **When** hace click en "Guardar", **Then** el codigo se guarda en su historial de snippets vinculado a esa sesion.

---

### User Story 4 — Estudiante genera flashcards desde la teoria de la sesion (Priority: P4)

Un estudiante termina de leer la teoria de la sesion "Transformers y Mecanismos de Atencion". Abre el tab AI Lab y hace click en "Generar Flashcards". En menos de 10 segundos, el sistema genera 10 flashcards con pregunta al frente y respuesta al dorso, extraidas del contenido de la sesion. El estudiante puede revisarlas una a una (frente/dorso), editar las que no le gusten, y guardarlas en su mazo de estudio personal.

**Why this priority**: Las flashcards convierten el contenido pasivo (teoria) en practica activa de memoria. Son la forma mas eficaz de retencion para examenes. El hecho de que se generen automaticamente desde el contenido de la sesion elimina la friccion de crearlas manualmente. Es una capacidad que los estudiantes universitarios buscan activamente (Anki, Quizlet) — tenerla integrada en la plataforma reduce la dependencia de herramientas externas.

**Independent Test**: Un estudiante puede hacer click en "Generar Flashcards" en cualquier sesion que tenga teoria, y en menos de 10 segundos ve un mazo de al menos 5 flashcards con pregunta y respuesta basadas en el contenido.

**Acceptance Scenarios**:

1. **Given** estudiante en el tab AI Lab de una sesion con teoria, **When** hace click en "Generar Flashcards", **Then** el sistema genera entre 5 y 15 flashcards en menos de 10 segundos usando el contenido del tab Teoria de esa sesion.
2. **Given** flashcards generadas, **When** estudiante navega el mazo, **Then** ve la pregunta al frente; al hacer click o presionar espacio, ve la respuesta al dorso.
3. **Given** flashcard visible, **When** estudiante hace click en el icono de edicion, **Then** puede modificar el texto del frente o del dorso y guardar la version editada.
4. **Given** mazo revisado, **When** estudiante hace click en "Guardar en mi mazo", **Then** todas las flashcards quedan en su coleccion personal vinculadas a la sesion y la materia.
5. **Given** estudiante accede a "Mi Mazo" desde su perfil, **When** selecciona flashcards de una materia o sesion, **Then** puede iniciar una sesion de repaso con las flashcards en orden aleatorio.

---

### Edge Cases

- Estudiante escribe un prompt que el filtro de seguridad de Gemini rechaza: el sistema muestra el mensaje de error de Gemini en lenguaje amigable ("No pude responder esta pregunta. Intenta reformular.") sin exponer el error tecnico.
- Playground con codigo que entra en bucle infinito: el sistema tiene un timeout de 10 segundos de ejecucion; si el codigo no termina, cancela y muestra "Tiempo de ejecucion excedido. Revisa si hay bucles infinitos."
- Sesion sin contenido de teoria (tab Teoria vacio o en construccion): el boton "Generar Flashcards" muestra el mensaje "La teoria de esta sesion aun no esta disponible" en lugar de generar flashcards vacias.
- Historial muy largo (estudiante activo con cientos de conversaciones): el historial se pagina (20 por pagina) para no degradar el rendimiento.
- Modo Comparacion: el modelo externo (ChatGPT, Claude) puede estar caido o el link puede no funcionar en todos los paises: la columna derecha muestra siempre el boton de apertura externa, no un iframe embebido, para evitar restricciones CORS y de terceros.
- Codigo en Playground que intenta acceder a la red o al sistema de archivos: el sandbox de ejecucion bloquea acceso a red y filesystem; el estudiante ve un mensaje de error descriptivo.
- Estudiante en Modo Comparacion en dispositivo movil: la vista de dos columnas colapsa a dos tabs apiladas verticalmente (Gemini / Externo) en pantallas menores a 768px.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST inicializar el chat de Gemini en el tab AI Lab con un prompt de sistema que incluya: nombre de la sesion activa, nombre de la materia y nombre del programa, de forma automatica sin intervencion del estudiante.
- **FR-002**: System MUST guardar el historial de cada conversacion del AI Lab vinculada a la sesion donde ocurrio, con fecha y modelo usado, y mostrarlo al estudiante en su perfil.
- **FR-003**: System MUST permitir al estudiante marcar respuestas del AI Lab como favoritas y acceder a ellas desde una lista en su perfil.
- **FR-004**: System MUST ofrecer un Modo Comparacion que divida la interfaz del AI Lab en dos areas: una con el chat de Gemini integrado y otra con un boton que abre el modelo externo seleccionado (ChatGPT, Claude o Perplexity) en una nueva pestana con la misma pregunta precargada via URL.
- **FR-005**: System MUST guardar las comparaciones realizadas en el historial del estudiante con las respuestas de ambos modelos.
- **FR-006**: System MUST incluir un Playground de Codigo en el AI Lab con editor de texto y ejecucion en navegador para Python y JavaScript.
- **FR-007**: System MUST precargar en el Playground el ejercicio de codigo definido para la sesion activa cuando exista, o mostrar el editor en blanco cuando no exista.
- **FR-008**: System MUST ejecutar el codigo del Playground en menos de 5 segundos para scripts simples, con un timeout de 10 segundos para prevenir bucles infinitos.
- **FR-009**: System MUST ofrecer un boton "Depurar con IA" que envia el codigo actual y el mensaje de error al chat de Gemini con un prompt automatico solicitando explicacion y correccion.
- **FR-010**: System MUST permitir al estudiante guardar snippets de codigo en su historial personal vinculados a la sesion donde fueron creados.
- **FR-011**: System MUST generar flashcards automaticamente a partir del contenido del tab Teoria de la sesion activa cuando el estudiante solicite "Generar Flashcards", en menos de 10 segundos, con entre 5 y 15 flashcards por sesion.
- **FR-012**: System MUST presentar las flashcards generadas en formato frente/dorso (pregunta/respuesta) con navegacion por click o teclado, y opcion de edicion antes de guardar.
- **FR-013**: System MUST guardar las flashcards en el mazo personal del estudiante vinculadas a la sesion y la materia, y permitir sesiones de repaso desde el perfil.
- **FR-014**: System MUST mostrar un mensaje descriptivo cuando la teoria de una sesion no esta disponible, en lugar de generar flashcards vacias o mostrar un error tecnico.
- **FR-015**: System MUST adaptar la interfaz del Modo Comparacion a pantallas moviles colapsando las dos columnas en tabs verticales.

### Key Entities

- **AIConversation**: Conversacion del AI Lab (user_id, session_id, model: gemini/chatgpt/claude/perplexity, messages JSON, created_at, es_comparacion boolean, favorito boolean).
- **AIFavorite**: Respuesta marcada como favorita (user_id, conversation_id, mensaje_index, created_at).
- **CodeSnippet**: Codigo guardado desde el Playground (user_id, session_id, language, code, output, created_at, updated_at).
- **Flashcard**: Tarjeta de memoria (user_id, session_id, frente, dorso, editada boolean, created_at).
- **FlashcardDeck**: Sesion de repaso (user_id, flashcard_ids JSON, started_at, completed_at, cards_revisadas integer).

## Assumptions & Dependencies

- **A1**: El Playground de codigo usa una solucion de ejecucion en navegador (WebAssembly o iframe sandbox) que no requiere servidor de computo dedicado para scripts simples. El costo de computo para casos de uso educativo basico es marginal dentro del presupuesto de $150/mes (Principio VII, Constitution v2.0.0).
- **A2**: Los modelos externos (ChatGPT, Claude, Perplexity) se abren en una nueva pestana via URL con la pregunta precargada, no embebidos en iframe. Esto evita dependencias de APIs de terceros de pago y restricciones CORS.
- **A3**: La generacion de flashcards usa la API de Gemini con el contenido del tab Teoria de la sesion como contexto. El costo por generacion (gemini-2.5-flash-lite) es menor a $0.001 por sesion.
- **A4**: El historial de conversaciones se almacena en Supabase como JSON estructurado. No se usa un vector database en esta fase para busqueda semantica del historial (se difiere a Fase 5).
- **D1**: El tab AI Lab basico (chat Gemini en cada sesion) debe estar operativo en Fase 3 antes de implementar estas mejoras. Esta especificacion es una evolucion, no un reemplazo.
- **D2**: El contenido del tab Teoria de cada sesion debe estar cargado en Supabase como texto para que la generacion de flashcards pueda acceder a el. Sesiones sin teoria no podran generar flashcards.
- **D3**: El perfil del estudiante (Fase 3 o 4) debe existir como contenedor para el historial, favoritos, snippets y mazo de flashcards.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El chat de Gemini en el AI Lab carga con el contexto de la sesion activa en menos de 2 segundos despues de que el estudiante abre el tab.
- **SC-002**: Un estudiante puede ejecutar un script Python basico en el Playground en menos de 3 segundos desde el click en "Ejecutar".
- **SC-003**: Las flashcards de una sesion se generan en menos de 10 segundos despues de que el estudiante hace click en "Generar Flashcards".
- **SC-004**: El historial de conversaciones del AI Lab muestra todas las conversaciones previas del estudiante con la informacion de sesion correcta, sin omisiones ni duplicados.
- **SC-005**: En el Modo Comparacion, la respuesta de Gemini aparece en la columna izquierda en menos de 10 segundos y el boton de apertura del modelo externo funciona correctamente en los tres modelos disponibles (ChatGPT, Claude, Perplexity).
- **SC-006**: Un estudiante puede generar, revisar, editar y guardar un mazo de flashcards en menos de 3 minutos desde que termina de leer la teoria de una sesion.
- **SC-007**: El Playground incluye los ejercicios precargados en al menos el 80% de las sesiones tecnicas del primer modulo piloto antes del lanzamiento de Fase 4.
