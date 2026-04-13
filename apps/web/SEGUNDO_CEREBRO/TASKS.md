# Segundo Cerebro ITSEIA — Task Tracking

## Fase 1: MVP

| # | Tarea | Estado | Fecha |
|---|-------|--------|-------|
| 1.1 | Migracion SQL: brain_notes, brain_sources, brain_deltas + pgvector | DONE | 2026-04-04 |
| 1.2 | lib/brain/embeddings.ts — helper OpenAI embeddings | DONE | 2026-04-04 |
| 1.3 | lib/brain/vectorSearch.ts — busqueda semantica pgvector | DONE | 2026-04-04 |
| 1.4 | API /api/brain/notes — CRUD notas con vectorizacion | DONE | 2026-04-04 |
| 1.5 | API /api/brain/ingest — ingestar PDF, URL, YouTube | DONE | 2026-04-04 |
| 1.6 | lib/brain/deltaEngine.ts — comparacion Gemini | DONE | 2026-04-04 |
| 1.7 | API /api/brain/delta — endpoint comparacion delta | DONE | 2026-04-04 |
| 1.8 | API /api/brain/generate — generar flashcards, resumenes, quizzes | DONE | 2026-04-04 |
| 1.9 | API /api/brain/search — busqueda semantica | DONE | 2026-04-04 |
| 1.10 | BrainPanel.tsx — panel principal tab AI Lab | DONE | 2026-04-04 |
| 1.11 | NoteEditor.tsx + NoteList.tsx — editor y lista | DONE | 2026-04-04 |
| 1.12 | SourceIngester.tsx — formulario fuentes | DONE | 2026-04-04 |
| 1.13 | DeltaViewer.tsx — mostrar resumen delta | DONE | 2026-04-04 |
| 1.14 | StudyMaterialGenerator.tsx — generar material | DONE | 2026-04-04 |
| 1.15 | SemanticSearch.tsx — barra busqueda | DONE | 2026-04-04 |
| 1.16 | Auto-ingest sesion completada | BACKLOG | — |
| 1.17 | Pre-cargar base inicial (1,958 sesiones) | BACKLOG | — |
| 1.18 | Integrar tab en AILabPanel.tsx | DONE | 2026-04-04 |

## Fase 2: Mejoras (pendiente)
- F05 Podcast TTS
- F06 Grafo visual
- F07 Sincronizacion sesiones avanzada

## Fase 3: Extras (pendiente)
- F08 Notas colaborativas
- F09 Exportacion Obsidian/Anki
- F10 Guia NotebookLM manual
