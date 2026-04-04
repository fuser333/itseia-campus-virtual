# Segundo Cerebro ITSEIA — Technical Decisions Log

## 2026-04-04 — MVP Architecture

### D01: pgvector en Supabase (no Pinecone/Weaviate)
- **Decision:** Usar pgvector extension en PostgreSQL existente
- **Razon:** Ya tenemos Supabase, 0 costo extra, misma DB, RLS nativo
- **Riesgo:** Performance con muchos vectores — mitigado con ivfflat index

### D02: OpenAI text-embedding-3-small (no Gemini embeddings)
- **Decision:** OpenAI para vectorizar, 1536 dimensiones
- **Razon:** Mas preciso que alternativas, $0.02/1M tokens (~$2/mes)
- **Trade-off:** Dependencia de 2 APIs (OpenAI + Gemini) en vez de 1

### D03: Gemini 2.0 Flash para generacion (no GPT-4o)
- **Decision:** Gemini para delta comparison y generacion de material
- **Razon:** Ya tenemos API key, contexto 1M tokens, tier gratuito generoso
- **Trade-off:** Calidad ligeramente inferior a GPT-4o en algunos casos

### D04: Textarea + markdown preview (no TipTap/ProseMirror)
- **Decision:** Editor simple textarea con preview markdown
- **Razon:** Minima complejidad, el alumno escribe markdown directo
- **Trade-off:** Sin toolbar rica, sin drag-drop imagenes

### D05: pdf-parse local (no Adobe API)
- **Decision:** Extraer texto de PDF con libreria npm local
- **Razon:** Sin dependencia de API externa, gratis, rapido
- **Limitacion:** No OCR, solo texto seleccionable en PDFs

### D06: youtube-transcript npm (no YouTube Data API)
- **Decision:** Obtener transcripciones sin API key
- **Razon:** Gratis, sin configuracion, suficiente para MVP
- **Limitacion:** Solo videos con subtitulos disponibles

### D07: Lazy-load del BrainPanel (dynamic import)
- **Decision:** El tab Segundo Cerebro se carga dinamicamente
- **Razon:** No penalizar carga inicial del AI Lab, bundle splitting
- **Implementacion:** React.lazy + Suspense en AILabPanel.tsx

### D08: ivfflat index (no hnsw)
- **Decision:** Indice ivfflat para busqueda vectorial
- **Razon:** Menor uso de memoria que hnsw, suficiente para escala MVP
- **Nota:** Si escala a >100K vectores, considerar hnsw
