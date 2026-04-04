# Segundo Cerebro ITSEIA — Project Memory

## Estado
- **Fase:** 1 (MVP)
- **Inicio:** 2026-04-04
- **Stack:** Next.js 15 + Supabase pgvector + OpenAI embeddings + Gemini 2.0 Flash

## Arquitectura
- Frontend: componentes en `src/components/brain/`
- API Routes: `src/app/api/brain/{notes,ingest,delta,generate,search}`
- Lib: `src/lib/brain/{embeddings,vectorSearch,ingestPdf,ingestUrl,ingestYoutube,deltaEngine}`
- DB: tablas brain_notes, brain_sources, brain_deltas con pgvector
- Integracion: tab "Segundo Cerebro" en AILabPanel.tsx (lazy-loaded)

## Variables de Entorno (ya existentes)
- OPENAI_API_KEY — embeddings text-embedding-3-small
- GEMINI_API_KEY — comparacion delta + generacion material
- SUPABASE_SERVICE_ROLE_KEY — acceso admin a pgvector

## Decisiones Clave
- pgvector en Supabase (0 costo extra, ya tenemos la DB)
- OpenAI text-embedding-3-small (1536 dims, $0.02/1M tokens)
- Gemini 2.0 Flash para generacion (contexto 1M, gratis tier)
- pdf-parse para PDFs (local, sin API externa)
- youtube-transcript para YouTube (sin API key)

## UI
- Todos los textos en espanol
- Colores ITSEIA: navy #0A1628, yellow #FBBC0C, blue #73B8E7, coral #F0846D
