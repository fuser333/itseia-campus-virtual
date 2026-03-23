# Tasks: Biblioteca Virtual con APIs Open Access

**Input**: plan.md + spec.md
**Prerequisites**: 001-platform-foundation completo (auth, roles, modelo de sesiones academicas
existente); `apps/web/src/lib/ai/gemini.ts` operativo con API key configurada

**Tests**: Verificar que busqueda retorna >= 10 resultados en < 3s; que saved_papers aplica
RLS por user_id; que fallback entre fuentes funciona cuando una API esta caida.

## Format: `[ID] [P?] [Story] Description`
- P = paralelizable (puede ejecutarse concurrentemente con otras tareas P)
- Story = historia de usuario que sirve

---

## Phase A: Proxy de busqueda y normalizacion

**Purpose**: Busqueda unificada retorna resultados desde las 3 fuentes en < 3 segundos.

- [ ] T001 [P] [US1] Agregar `fast-xml-parser` como dependencia en `apps/web/package.json`
      y extender `apps/web/src/types/database.ts` con interfaz `PaperResult`
      `{ id, source, title, authors[], year, abstract, url, doi, language }`
- [ ] T002 [P] [US1] Implementar `features/library/openalex.ts` — cliente OpenAlex:
      llama `api.openalex.org/works?search=QUERY&per-page=15`, normaliza
      `abstract_inverted_index` a texto plano, retorna `PaperResult[]`
- [ ] T003 [P] [US1] Implementar `features/library/arxiv.ts` — cliente arXiv:
      llama `export.arxiv.org/api/query`, parsea Atom XML con `fast-xml-parser`,
      retorna `PaperResult[]`
- [ ] T004 [P] [US1] Implementar `features/library/scielo.ts` — cliente Scielo:
      llama `search.scielo.org/api/v1/article/`, normaliza respuesta, prioriza para
      terminos en español
- [ ] T005 [US1] Implementar `features/library/merge.ts` — deduplica por DOI,
      ordena por relevancia (OpenAlex score primero, luego año descendente)
- [ ] T006 [US1] Implementar `features/library/apa.ts` — genera string APA 7ma edicion
      desde metadatos de `PaperResult`
- [ ] T007 [US1] Implementar `GET /api/library/search/route.ts` — recibe `q`, `year_from`,
      `year_to`, `language`; llama las 3 fuentes en paralelo con `Promise.allSettled` y
      timeout de 2.5s por fuente; registra busqueda en `library_searches`; retorna resultados
      merged

**Checkpoint**: `GET /api/library/search?q=machine+learning` retorna >= 10 resultados en
< 3s; si arXiv timeout, los resultados de OpenAlex y Scielo igual se retornan; fila creada
en `library_searches`.

---

## Phase B: Guardar, citar y vincular a sesiones

**Purpose**: Estudiante guarda papers en favoritos; docente recomienda papers a sesiones.

- [ ] T008 [US1] [US2] Crear migracion `supabase/migrations/20260322_004_virtual_library.sql`
      con tablas `saved_papers`, `session_recommended_papers`, `library_searches`, RLS
      (`saved_papers`: `user_id = auth.uid()`), indices por `user_id` y `created_at`
- [ ] T009 [P] [US1] Implementar `POST /api/library/save/route.ts` y
      `GET /api/library/saved/route.ts` — guardar paper con cita APA pre-calculada;
      retornar lista de favoritos del usuario autenticado
- [ ] T010 [P] [US2] Implementar `POST /api/library/recommend/route.ts` y
      `GET /api/library/recommend?sessionId=X/route.ts` — docente vincula paper a sesion;
      estudiante consulta papers recomendados de una sesion
- [ ] T011 [P] [US1] Implementar `components/library/PaperCard.tsx` — card con titulo
      (link externo), autores, año, badge de fuente, abstract truncado con "Ver mas",
      botones "Guardar" y "Copiar cita APA" (con feedback visual al copiar)
- [ ] T012 [P] [US1] Implementar `components/library/SavedPapers.tsx` — lista de favoritos
      con boton "Eliminar" y filtro por busqueda
- [ ] T013 [US2] Implementar `components/library/RecommendedPapers.tsx` — lista simplificada
      para la pagina de sesion del estudiante
- [ ] T014 [US2] Integrar `RecommendedPapers` en la pagina de sesion del estudiante
      (`sesion/[num]/page.tsx`) y agregar buscador inline con boton "Recomendar para esta sesion"
      en `teacher/materias/[id]/sesion/[num]/edit/page.tsx`

**Checkpoint**: Estudiante guarda un paper y aparece en su lista de favoritos; docente
vincula un paper a una sesion y el estudiante lo ve en "Lecturas recomendadas".

---

## Phase C: Sugerencias contextuales Gemini y pagina principal

**Purpose**: Biblioteca se abre con resultados pre-cargados desde el contexto de la sesion;
admin tiene metricas de uso exportables.

- [ ] T015 [US3] Implementar `POST /api/library/suggest/route.ts` — recibe `sessionTitle`
      y `sessionDescription`, usa `apps/web/src/lib/ai/gemini.ts` para generar 3-5 terminos
      de busqueda academica en ingles y español, retorna el primer termino como query sugerida
- [ ] T016 [US1] [US3] Implementar pagina `apps/web/src/app/biblioteca/page.tsx`:
      si viene con `?sessionId=X` auto-llama `/api/library/suggest` y ejecuta busqueda;
      si viene sin param muestra buscador vacio con busquedas recientes
- [ ] T017 [P] [US1] Implementar `components/library/LibrarySearch.tsx` — input de busqueda,
      filtros de año (range), idioma (select), boton buscar con paginacion "Cargar mas"
      (20 resultados por pagina)
- [ ] T018 [P] [US3] Agregar enlace "Biblioteca Virtual" en
      `components/layout/Sidebar.tsx` para estudiantes y docentes
- [ ] T019 [US3] Agregar seccion "Uso de Biblioteca" en `apps/web/src/app/admin/page.tsx`:
      top 10 terminos buscados, busquedas por materia, papers guardados por usuario;
      boton "Exportar CSV" para SENESCYT

**Checkpoint**: Al abrir `/biblioteca?sessionId=X`, la biblioteca muestra resultados
pre-cargados relevantes al titulo de la sesion sin que el usuario escriba nada; admin
ve metricas de uso con datos reales; link en sidebar navega correctamente.

---

## Dependencies & Execution Order

- T001-T004 son completamente paralelos entre si (clientes de cada fuente son independientes).
- T005, T006, T007 dependen de T001-T004 y deben ejecutarse en ese orden.
- Phase B puede comenzar en paralelo con el final de Phase A — T008 es independiente.
- T009-T013 dependen de T008 y son paralelos entre si.
- T014 depende de T013 y T010.
- Phase C puede comenzar en paralelo con Phase B una vez T007 este listo.
- T015 es prerequisito de T016; T017 y T018 son paralelos entre si y con T015.

## Agent Team Strategy

- **Agente 1 (Clientes API)**: T001 -> T002 + T003 + T004 (paralelo) -> T005 -> T006 -> T007
- **Agente 2 (DB + guardado)**: T008 -> T009 + T010 (paralelo)
- **Agente 3 (Componentes UI)**: T011 + T012 + T013 (paralelo, una vez T008 listo) -> T014
- **Agente 4 (Gemini + pagina + admin)**: T015 -> T016 + T017 + T018 (paralelo) -> T019
