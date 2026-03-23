# Implementation Plan: Biblioteca Virtual con APIs Open Access

**Branch**: `004-virtual-library` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)

## Summary

Construir una biblioteca virtual de $0 de costo operativo integrando OpenAlex (fuente primaria,
250M+ papers), arXiv (cobertura IA/ML) y Scielo (papers latinoamericanos en español) via APIs
de acceso abierto, con un proxy en Next.js que une y normaliza los resultados. Gemini API
(ya integrado) provee sugerencias contextuales desde la sesion activa. El modulo cumple el
Art. 61 RRA 2022 y genera el registro de uso de biblioteca que SENESCYT puede auditar.

## Technical Context

**Language/Version**: TypeScript 5.x
**Framework**: Next.js 15 App Router — app existente en `apps/web/`
**CSS**: Tailwind CSS 4 + shadcn/ui
**DB**: Supabase PostgreSQL (saved_papers, library_searches)
**Auth**: Supabase Auth (operativo)
**Deploy**: Vercel (tecnologico.itseia.ai)
**APIs externas**:
- OpenAlex: `https://api.openalex.org/works?search=QUERY&per-page=20` — sin autenticacion
- arXiv: `https://export.arxiv.org/api/query?search_query=QUERY&max_results=10` — sin autenticacion, responde XML
- Scielo: `https://search.scielo.org/api/v1/article/?q=QUERY&count=10&lang=es,en` — sin autenticacion
**IA**: Gemini API via `apps/web/src/lib/ai/gemini.ts` (ya integrado)
**Dependencias nuevas**: ninguna de terceros — `xml2js` o `fast-xml-parser` para parsear
respuesta XML de arXiv (alternativa: usar endpoint `https://export.arxiv.org/api/query` con
Accept header JSON si disponible, o parsear manualmente el Atom XML)
**Paginas existentes relevantes**:
- `apps/web/src/lib/ai/gemini.ts` — cliente Gemini reutilizable
- `apps/web/src/app/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx` — sesion desde donde se accede contextualmente
- `apps/web/src/types/database.ts` — tipos a extender

## Constitution Check

1. **Problema institucional**: Art. 61 RRA 2022 exige acceso a al menos UNA biblioteca
   virtual para modalidad en linea. Sin este componente el expediente CES esta incompleto.
   Ademas el registro de uso es evidencia auditable para SENESCYT.
2. **Roles afectados**: estudiante (busca, guarda, cita), docente (busca y vincula papers
   a sesiones como lecturas recomendadas), admin (reportes de uso para SENESCYT).
3. **Datos, permisos y riesgos**: `saved_papers` es dato personal (lista de lectura por
   usuario) — RLS `user_id = auth.uid()`. `library_searches` se registra con `user_id`
   pero puede anonimizarse para reportes. Riesgo: las APIs externas pueden estar
   temporalmente caidas — mitigar con fallback gracioso entre fuentes.
4. **Verificacion de exito**: test de busqueda con termino "redes neuronales" retorna
   >= 10 resultados en < 3s. Test de guardado: paper guardado aparece en lista de favoritos
   del usuario. Test de cita APA: formato correcto verificado manualmente contra estandar.
5. **Slice minimo util**: busqueda + resultados + guardar + citar APA. Las sugerencias
   contextuales Gemini (P3) se incluyen en Phase C porque reutilizan infra ya existente.
   El vinculo de papers a sesiones (P2) se incluye en Phase B.
6. **CES Compliance (Principio VI)**: cumple directamente Art. 61 RRA 2022. El registro
   de `library_searches` es la evidencia de uso que SENESCYT puede solicitar.
7. **AI-First (Principio VII)**: uso de APIs Open Access (OpenAlex, arXiv, Scielo) en lugar
   de contrato EBSCO ($15,000+/año). Gemini para sugerencias contextuales. Cumple mandato
   de la Constitution — costo $0 de biblioteconomia.
8. **Calidad de contenido (Principio VIII)**: no aplica directamente. La biblioteca
   complementa el contenido de las sesiones pero no es el contenido en si.

## Project Structure

### Documentacion

```text
specs/004-virtual-library/
├── plan.md          (este archivo)
└── spec.md
```

### Codigo fuente — archivos nuevos

```text
apps/web/src/
├── app/
│   ├── biblioteca/
│   │   └── page.tsx                 — pagina principal de la biblioteca virtual
│   └── api/
│       └── library/
│           ├── search/route.ts      — GET: proxy que llama las 3 APIs y unifica resultados
│           ├── save/route.ts        — POST: guarda paper en saved_papers del usuario
│           ├── saved/route.ts       — GET: lista papers guardados del usuario autenticado
│           ├── suggest/route.ts     — POST: Gemini genera query desde contexto de sesion
│           └── usage-report/route.ts — GET: metricas de uso para admin
├── components/
│   └── library/
│       ├── LibrarySearch.tsx        — barra de busqueda + filtros (año, idioma, area)
│       ├── PaperCard.tsx            — card de un paper con titulo, autores, año, abstract, acciones
│       ├── SavedPapers.tsx          — lista personal de favoritos del estudiante
│       └── RecommendedPapers.tsx    — papers recomendados por docente en una sesion
└── features/
    └── library/
        ├── openalex.ts             — cliente OpenAlex: normaliza respuesta a PaperResult[]
        ├── arxiv.ts                — cliente arXiv: parsea Atom XML a PaperResult[]
        ├── scielo.ts               — cliente Scielo: normaliza respuesta a PaperResult[]
        ├── merge.ts                — deduplica y ordena resultados de las 3 fuentes
        ├── apa.ts                  — genera cita APA desde metadatos del paper
        └── queries.ts              — getSavedPapers, getRecommendedPapers, logSearch
```

### Codigo fuente — archivos modificados

```text
apps/web/src/
├── app/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx
│     — agregar link/boton "Buscar en biblioteca" que abre biblioteca con contexto de sesion
│     — agregar seccion "Lecturas recomendadas" que muestra RecommendedPapers
├── app/teacher/materias/[id]/sesion/[num]/edit/page.tsx
│     — agregar panel "Lecturas recomendadas" donde docente puede buscar y vincular papers
├── app/admin/page.tsx
│     — agregar seccion "Uso de Biblioteca" con metricas exportables
├── components/layout/Sidebar.tsx
│     — agregar enlace "Biblioteca Virtual" en la navegacion del estudiante
└── types/database.ts
      — agregar tipos SavedPaper, LibrarySearch, PaperResult (interfaz normalizada)
```

### Base de datos — migraciones nuevas

```text
supabase/migrations/
└── 20260322_004_virtual_library.sql
    — CREATE TABLE saved_papers
    — CREATE TABLE library_searches
    — CREATE TABLE session_recommended_papers (docente vincula paper a sesion)
    — RLS policies
    — Indexes: saved_papers(user_id), library_searches(user_id, created_at)
```

## Implementation Phases

### Phase A: Proxy de busqueda y normalizacion

**Objetivo**: busqueda unificada retorna resultados desde las 3 fuentes en < 3s.

- Definir interfaz `PaperResult` en `types/database.ts`:
  `{ id, source, title, authors[], year, abstract, url, doi, language }`.
- Implementar `features/library/openalex.ts`:
  - `GET https://api.openalex.org/works?search=QUERY&per-page=15&select=id,title,authorships,publication_year,abstract_inverted_index,doi,language,primary_location`
  - Normalizar `abstract_inverted_index` (formato invertido de OpenAlex) a texto plano.
- Implementar `features/library/arxiv.ts`:
  - `GET https://export.arxiv.org/api/query?search_query=all:QUERY&max_results=10`
  - Parsear XML Atom con `fast-xml-parser` (paquete ligero, sin dependencias).
- Implementar `features/library/scielo.ts`:
  - `GET https://search.scielo.org/api/v1/article/?q=QUERY&count=10&lang=es,en`
  - Priorizar para terminos en español o cuando filtro idioma = español.
- Implementar `features/library/merge.ts`: deduplicar por DOI, ordenar por relevancia
  (OpenAlex score primero, luego por año descendente).
- Implementar `GET /api/library/search`: recibe `q`, `year_from`, `year_to`, `language`,
  llama las 3 fuentes en paralelo (`Promise.allSettled`), retorna merged results.
  Si una fuente falla, retorna las otras con nota en response header.
- Registrar cada busqueda en `library_searches` con `user_id`, `query`, `sources_used`,
  `result_count` (para reporte SENESCYT).
- Implementar `features/library/apa.ts`: genera string APA 7ma edicion desde `PaperResult`.
- Test manual: buscar "machine learning" y verificar >= 10 resultados en < 3s.

### Phase B: Guardar, citar y vincular a sesiones

**Objetivo**: estudiante guarda papers; docente recomienda a sesiones.

- Crear migracion con tablas:
  - `saved_papers`: `id`, `user_id`, `paper_id` (external ID del paper), `source`,
    `title`, `authors` (jsonb), `year`, `url`, `apa_citation`, `saved_at`.
  - `session_recommended_papers`: `id`, `session_id` (FK sesiones), `subject_id` (FK),
    `teacher_id` (FK), `paper_id`, `title`, `authors` (jsonb), `url`, `source`, `created_at`.
  - `library_searches`: `id`, `user_id`, `query`, `sources_used` (text[]), `result_count`,
    `subject_id` (nullable, si proviene de contexto de sesion), `created_at`.
- Implementar `POST /api/library/save`: guarda `PaperResult` + cita APA en `saved_papers`.
- Implementar `GET /api/library/saved`: retorna lista de favoritos del usuario autenticado.
- Implementar endpoint para docente: `POST /api/library/recommend` — vincula un paper
  a una sesion especifica (inserta en `session_recommended_papers`).
- Implementar `GET /api/library/recommend?sessionId=X`: retorna papers recomendados de una sesion.
- Implementar `PaperCard.tsx`: card con titulo (link externo), autores, año, badge de fuente,
  abstract truncado a 3 lineas con "Ver mas", botones "Guardar" y "Copiar cita APA".
- Implementar `SavedPapers.tsx`: lista de favoritos con boton "Eliminar" y filtro por busqueda.
- Implementar `RecommendedPapers.tsx`: lista simplificada para la pagina de sesion del estudiante.
- Integrar en `sesion/[num]/page.tsx`: seccion "Lecturas recomendadas" con `RecommendedPapers`.
- Integrar en `teacher/materias/[id]/sesion/[num]/edit/page.tsx`: buscador inline con boton
  "Recomendar para esta sesion".

### Phase C: Sugerencias contextuales con Gemini y pagina principal

**Objetivo**: biblioteca se abre con resultados pre-cargados desde el contexto de la sesion.

- Implementar `POST /api/library/suggest`: recibe `sessionTitle` y `sessionDescription`,
  usa `apps/web/src/lib/ai/gemini.ts` para generar 3-5 terminos de busqueda relevantes en
  ingles y español, retorna el primer termino como query sugerida.
- Prompt Gemini: "Dado el titulo de sesion academica '{title}' y descripcion '{desc}',
  genera 3 terminos de busqueda academica en ingles para encontrar papers relevantes en
  OpenAlex. Responde solo con los terminos separados por coma."
- Implementar pagina `app/biblioteca/page.tsx`:
  - Si viene con param `?sessionId=X`: auto-llama `/api/library/suggest` y ejecuta busqueda.
  - Si viene sin param: muestra buscador vacio con placeholder y busquedas recientes del usuario.
  - `LibrarySearch.tsx`: input de busqueda, filtros de año (slider range), idioma (select),
    boton buscar.
  - Paginacion: 20 resultados por pagina con "Cargar mas".
- Agregar link "Biblioteca Virtual" en `Sidebar.tsx` para estudiantes y docentes.
- Agregar seccion metricas en `admin/page.tsx`:
  - Top 10 terminos mas buscados, busquedas por materia, papers guardados por usuario.
  - Boton "Exportar CSV" para evidencia SENESCYT.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Parseo XML de arXiv | La API de arXiv solo retorna Atom XML, no JSON | arXiv es la fuente primaria de papers de IA/ML — no tenerla deja un hueco critico en cobertura |
| Tres APIs en paralelo | La spec exige cobertura en español (Scielo) e ingles (OpenAlex, arXiv) | Usar solo OpenAlex cubriria ingles pero dejaria escasa cobertura de papers latinoamericanos |

Se introduce `fast-xml-parser` como unica dependencia nueva (8KB, sin dependencias transitivas).

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OpenAlex rate limit (10 req/s free) | Baja (piloto <50 usuarios) | Medio | Cache de 5 minutos en memoria para queries identicas; headers `X-RateLimit` de respuesta |
| arXiv responde en > 3s (servidor a veces lento) | Media | Bajo | `Promise.allSettled` con timeout de 2.5s por fuente; si arXiv timeout, retornar solo OpenAlex+Scielo |
| Scielo API inestable (documentacion escasa) | Media | Bajo | Scielo es fuente terciaria; si falla, OpenAlex cubre el 90% de casos |
| Abstract no disponible en algunos papers | Alta | Bajo | Mostrar "Resumen no disponible" y enlace al texto completo — ya contemplado en spec |
| Gemini genera queries en ingles para sesiones en español | Media | Bajo | Prompt incluye instruccion explicita de generar terminos en ambos idiomas |

## Environment Variables Required

Ninguna adicional. Usa las variables ya configuradas:
- `GEMINI_API_KEY` (ya en uso por `apps/web/src/lib/ai/gemini.ts`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Las APIs de OpenAlex, arXiv y Scielo son de acceso publico sin autenticacion.
