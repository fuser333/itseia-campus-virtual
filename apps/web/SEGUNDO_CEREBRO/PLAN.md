# PLAN — Segundo Cerebro ITSEIA

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js 15)               │
│                                                      │
│  AI Lab Tab: "Segundo Cerebro"                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Mis     │ │ Agregar  │ │  Delta   │ │Material│ │
│  │  Notas   │ │ Fuente   │ │ "Lo Nuevo"│ │Estudio │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │
│       │            │            │            │      │
├───────┼────────────┼────────────┼────────────┼──────┤
│       ▼            ▼            ▼            ▼      │
│              API Routes (/api/brain/*)               │
│                                                      │
│  /api/brain/notes     POST/GET/PUT/DELETE notas      │
│  /api/brain/ingest    POST fuente (URL/PDF/YT)       │
│  /api/brain/delta     POST comparar nuevo vs conocido │
│  /api/brain/generate  POST generar material estudio   │
│  /api/brain/search    POST busqueda semantica         │
│                                                      │
├──────────────────────────────────────────────────────┤
│                  BACKEND SERVICES                     │
│                                                      │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │  Supabase  │  │  OpenAI     │  │  Gemini      │  │
│  │  pgvector  │  │  Embeddings │  │  2.0 Flash   │  │
│  │            │  │  (vectorizar)│  │  (comparar + │  │
│  │  notas     │  │             │  │   generar)   │  │
│  │  fuentes   │  │             │  │             │  │
│  │  vectores  │  │             │  │             │  │
│  └────────────┘  └─────────────┘  └──────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Flujo de Datos

```
ALUMNO ENTRA A SESION 5 DE ML
        │
        ▼
  teoria_markdown (7,157 chars promedio)
        │
        ▼
  OpenAI embedding → vector 1536 dims
        │
        ▼
  INSERT brain_entries (user_id, session_id, content, embedding)
        │
        ▼
  ✅ Base de conocimiento del alumno crece automaticamente

ALUMNO AGREGA VIDEO YOUTUBE
        │
        ▼
  youtube-transcript → texto transcripcion
        │
        ▼
  OpenAI embedding → vector
        │
        ▼
  INSERT brain_sources (user_id, url, content, embedding)
        │
        ▼
  Gemini API: "Compara esta fuente con lo que el alumno ya sabe"
        │
        ├──→ pgvector similarity search (top 20 notas relevantes)
        │
        ▼
  RESUMEN DELTA: "Lo que NO sabias: X, Y, Z"
        │
        ▼
  ✅ Se guarda como nueva nota + se generan flashcards
```

## Estructura de Carpetas

```
src/
├── app/
│   └── api/
│       └── brain/
│           ├── notes/route.ts          # CRUD notas
│           ├── ingest/route.ts         # Ingestar URL/PDF/YT
│           ├── delta/route.ts          # Comparacion delta
│           ├── generate/route.ts       # Generar material estudio
│           └── search/route.ts         # Busqueda semantica
├── components/
│   └── brain/
│       ├── BrainPanel.tsx              # Panel principal (tab AI Lab)
│       ├── NoteEditor.tsx              # Editor markdown de notas
│       ├── NoteList.tsx                # Lista de notas del alumno
│       ├── SourceIngester.tsx          # Formulario agregar fuente
│       ├── DeltaViewer.tsx             # Mostrar resumen delta
│       ├── StudyMaterialGenerator.tsx  # Generar flashcards/resumenes
│       └── SemanticSearch.tsx          # Barra busqueda semantica
├── lib/
│   └── brain/
│       ├── embeddings.ts              # OpenAI embeddings helper
│       ├── vectorSearch.ts            # pgvector similarity search
│       ├── ingestPdf.ts               # Extraer texto de PDF
│       ├── ingestUrl.ts               # Scrape URL
│       ├── ingestYoutube.ts           # Transcripcion YouTube
│       └── deltaEngine.ts             # Logica comparacion Gemini
└── types/
    └── brain.ts                        # Types para el modulo
```

## Schema Supabase (migracion)

```sql
-- Habilitar pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Notas del alumno (su base de conocimiento)
CREATE TABLE brain_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  session_id UUID REFERENCES sessions(id),        -- vinculo a sesion del curso
  subject_id UUID REFERENCES subjects(id),        -- vinculo a materia
  embedding VECTOR(1536),                         -- OpenAI text-embedding-3-small
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Fuentes externas ingestadas
CREATE TABLE brain_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('pdf', 'url', 'youtube', 'text')),
  title TEXT NOT NULL,
  url TEXT,
  content TEXT NOT NULL,                          -- texto extraido
  embedding VECTOR(1536),
  metadata JSONB,                                 -- duracion video, paginas pdf, etc
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Resúmenes delta generados
CREATE TABLE brain_deltas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source_id UUID REFERENCES brain_sources(id),
  delta_content TEXT NOT NULL,                    -- "lo que no sabias"
  known_content TEXT,                             -- "lo que ya sabias"
  flashcards JSONB,                              -- [{q: "...", a: "..."}]
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indices para busqueda vectorial rapida
CREATE INDEX brain_notes_embedding_idx ON brain_notes
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX brain_sources_embedding_idx ON brain_sources
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- RLS
ALTER TABLE brain_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_deltas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own brain_notes" ON brain_notes
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own brain_sources" ON brain_sources
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own brain_deltas" ON brain_deltas
  FOR ALL USING (auth.uid() = user_id);

-- Funcion de busqueda semantica
CREATE OR REPLACE FUNCTION match_brain_notes(
  query_embedding VECTOR(1536),
  match_user_id UUID,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bn.id,
    bn.title,
    bn.content,
    1 - (bn.embedding <=> query_embedding) AS similarity
  FROM brain_notes bn
  WHERE bn.user_id = match_user_id
    AND 1 - (bn.embedding <=> query_embedding) > match_threshold
  ORDER BY bn.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

## Decisiones Tecnicas

| Decision | Opcion elegida | Alternativa descartada | Razon |
|----------|---------------|----------------------|-------|
| Vectores | pgvector (Supabase) | Pinecone, Weaviate | Ya tenemos Supabase, 0 costo extra |
| Embeddings | OpenAI text-embedding-3-small | Gemini embeddings | Mas preciso, mas barato, 1536 dims |
| IA generativa | Gemini 2.0 Flash | GPT-4o | Ya tenemos key, contexto 1M tokens, gratis tier |
| PDF parsing | pdf-parse (npm) | Adobe API, pdfjs | Simple, local, sin API externa |
| YouTube | youtube-transcript (npm) | YouTube Data API | Sin API key, gratis, solo transcripcion |
| Editor notas | textarea + markdown preview | TipTap, ProseMirror | Simple, el alumno escribe markdown |

## Dependencias Nuevas (npm)

```
pdf-parse              # Extraer texto de PDF
youtube-transcript     # Transcripcion de YouTube (sin API key)
openai                 # Ya instalado (para embeddings)
```

## Variables de Entorno (ya existentes)

```
GEMINI_API_KEY=...          # Ya configurada
OPENAI_API_KEY=...          # Ya configurada
SUPABASE_SERVICE_ROLE_KEY=... # Ya configurada
```

No se necesitan variables nuevas.

## Fases de Implementacion

### Fase 1: MVP (2-3 dias)

| # | Tarea | Estimacion |
|---|-------|------------|
| 1.1 | Migracion SQL: crear tablas brain_notes, brain_sources, brain_deltas + pgvector | 30 min |
| 1.2 | lib/brain/embeddings.ts — helper OpenAI embeddings | 30 min |
| 1.3 | lib/brain/vectorSearch.ts — busqueda semantica pgvector | 30 min |
| 1.4 | API /api/brain/notes — CRUD notas con vectorizacion automatica | 1h |
| 1.5 | API /api/brain/ingest — ingestar PDF, URL, YouTube | 2h |
| 1.6 | lib/brain/deltaEngine.ts — comparacion Gemini (lo nuevo vs lo conocido) | 1h |
| 1.7 | API /api/brain/delta — endpoint comparacion delta | 1h |
| 1.8 | API /api/brain/generate — generar flashcards, resumenes, quizzes | 1h |
| 1.9 | API /api/brain/search — busqueda semantica | 30 min |
| 1.10 | BrainPanel.tsx — panel principal como tab del AI Lab | 2h |
| 1.11 | NoteEditor.tsx + NoteList.tsx — editor y lista de notas | 1.5h |
| 1.12 | SourceIngester.tsx — formulario agregar fuentes | 1h |
| 1.13 | DeltaViewer.tsx — mostrar resumen delta | 1h |
| 1.14 | StudyMaterialGenerator.tsx — generar material | 1h |
| 1.15 | SemanticSearch.tsx — barra de busqueda | 30 min |
| 1.16 | Auto-ingest: cuando alumno completa sesion, agregar teoria a su cerebro | 1h |
| 1.17 | Pre-cargar base inicial desde contenido existente (1,958 sesiones) | 1h |
| 1.18 | Integrar como tab "Segundo Cerebro" en AILabPanel.tsx | 30 min |

### Fase 2: Mejoras (2-3 dias)
- F05 Podcast TTS
- F06 Grafo visual
- F07 Sincronizacion sesiones avanzada

### Fase 3: Extras (1-2 dias)
- F08 Notas colaborativas
- F09 Exportacion Obsidian/Anki
- F10 Guia NotebookLM manual

## Riesgos

| Riesgo | Probabilidad | Impacto | Mitigacion |
|--------|-------------|---------|------------|
| pgvector no habilitado en Supabase | Baja | Alto | Verificar antes, habilitar via SQL |
| Costos embeddings OpenAI | Media | Bajo | text-embedding-3-small es $0.02/1M tokens (~$2/mes) |
| Transcripcion YouTube falla | Media | Medio | Fallback: pedir al alumno que pegue el texto |
| PDF muy grande (100+ pags) | Baja | Medio | Limitar a 50 pags, chunking |
| Gemini rate limit | Baja | Medio | Ya tenemos key, tier gratuito es generoso |

## Base Inicial Pre-cargada

Al crear la cuenta, el alumno recibe su cerebro con:

| Modulo | Contenido pre-cargado |
|--------|----------------------|
| Carreras | 1,958 sesiones × teoria (promedio 7,157 chars) |
| Preuni | 20 sesiones × teoria (promedio 4,587 chars) |
| Cursos Pro | 112 sesiones × teoria (promedio 10,528 chars) |
| B2B IDCE | 16 sesiones × teoria (promedio 6,200 chars) |
| Certificaciones | Material AWS, Google, Azure, Claude |

El alumno no empieza de cero — su Segundo Cerebro YA SABE todo el contenido de su carrera. Solo le queda agregar fuentes externas y el sistema le dice que es nuevo.
