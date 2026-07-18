# SPEC — Segundo Cerebro ITSEIA

## Problema

Los estudiantes de ITSEIA consumen contenido educativo de forma pasiva: ven videos, leen teoria, pero no retienen ni conectan conocimiento. El workflow viral de Obsidian + NotebookLM + Gemini resuelve esto pero tiene 3 problemas:

1. **Requiere instalar Obsidian** (app local, curva de aprendizaje)
2. **NotebookLM no tiene API** (todo manual: subir archivos, copiar resultados)
3. **El ciclo es manual** (exportar → subir → analizar → copiar → pegar)

ITSEIA puede construir esto MEJOR: 100% web, automatizado, integrado a la plataforma educativa, sin que el alumno instale nada.

## Usuarios

| Usuario | Necesidad |
|---------|-----------|
| Alumno carrera (IA, Datos, Big Data) | Organizar 5 semestres de conocimiento, estudiar eficientemente |
| Alumno preuni | Absorber 4 semanas intensivas sin perderse |
| Profesional (cursos pro) | Conectar IA con su profesion (contador, medico, abogado) |
| Cliente B2B (IDCE) | Retener conocimiento del programa corporativo |
| Docente | Preparar material y ver que saben sus alumnos |

## Funcionalidades

### Prioridad ALTA (MVP — Fase 1)

**F01 — Base de Conocimiento Personal** [P1]
- El alumno escribe notas en markdown dentro de la plataforma
- Notas organizadas por materia/tema (vinculadas a las sesiones del curso)
- Cada nota se vectoriza automaticamente (OpenAI embeddings → pgvector)
- Busqueda semantica: "que se sobre redes neuronales?" busca por significado, no keywords

**F02 — Ingesta de Fuentes Externas** [P1]
- Subir PDF → se extrae texto, se vectoriza
- Pegar URL de articulo → se scrapea contenido, se vectoriza
- Pegar URL de YouTube → se obtiene transcripcion (YouTube API), se vectoriza
- Cada fuente queda asociada a la materia/tema del alumno

**F03 — Comparacion Delta ("Lo que NO sabes")** [P1]
- El alumno sube una fuente nueva (PDF, URL, video)
- Gemini API compara contra su base de conocimiento (vectores en pgvector)
- Genera un "resumen delta": SOLO lo que es nuevo/diferente/relevante
- Elimina redundancia: no repite lo que ya sabe

**F04 — Generacion de Material de Estudio** [P1]
- Desde cualquier fuente o resumen delta, generar:
  - Flashcards (formato pregunta/respuesta)
  - Resumen ejecutivo (1 pagina)
  - Tabla comparativa (concepto A vs B)
  - Preguntas de practica (quiz)
- Se guardan en la base del alumno y se pueden revisar despues

### Prioridad MEDIA (Fase 2)

**F05 — Podcast de Audio** [P2]
- Generar audio TTS del resumen delta
- El alumno escucha "lo nuevo" en el bus, gym, etc.
- Usar Google TTS o ElevenLabs API

**F06 — Grafo de Conocimiento Visual** [P2]
- Visualizar conexiones entre notas/conceptos
- Estilo grafo de Obsidian pero en el navegador (D3.js o similar)
- Nodos = conceptos, aristas = relaciones
- Click en nodo → ver la nota completa

**F07 — Sincronizacion con Sesiones del Curso** [P2]
- Al completar una sesion en la plataforma, el "Segundo Cerebro" se enriquece automaticamente
- La teoria de la sesion se agrega como nota a la base del alumno
- Las flashcards del curso se vinculan al grafo

### Prioridad BAJA (Fase 3)

**F08 — Notas Colaborativas** [P3]
- Compartir notas entre alumnos de la misma cohorte
- "Paquetes de conocimiento" por materia

**F09 — Exportacion** [P3]
- Exportar toda la base como Markdown (compatible con Obsidian)
- Exportar como PDF
- Exportar flashcards a Anki (formato .apkg)

**F10 — Integracion NotebookLM Manual** [P3]
- Boton "Exportar a NotebookLM" genera el archivo consolidado
- Instrucciones para subir a NotebookLM (para quien quiera el workflow completo)

## Fuera de Alcance

- No construimos un clon de Obsidian (no grafos editables complejos)
- No soportamos edicion colaborativa en tiempo real (como Google Docs)
- No creamos una app movil nativa (web responsive es suficiente)
- No integramos con Notion, Roam, o LogSeq
- No hacemos OCR de imagenes (solo texto de PDFs)

## Criterios de Exito

| Criterio | Metrica | Meta |
|----------|---------|------|
| Alumno crea notas | Notas por usuario/semana | >= 3 |
| Fuentes ingestadas | URLs/PDFs por usuario/mes | >= 5 |
| Resumen delta generado | Deltas por usuario/semana | >= 2 |
| Flashcards generadas | Cards por usuario/mes | >= 20 |
| Tiempo de estudio reducido | Encuesta pre/post | -40% |
| Retencion de conocimiento | Quiz score pre/post | +25% |

## Stack Propuesto

| Componente | Tecnologia | Razon |
|-----------|-----------|-------|
| Frontend | Next.js 15 (ya existente) | Misma plataforma, no app separada |
| Base de datos | Supabase PostgreSQL | Ya tenemos, pgvector disponible |
| Vectores | pgvector (Supabase) | Sin servicio externo, todo en 1 DB |
| Embeddings | OpenAI text-embedding-3-small | Barato ($0.02/1M tokens), preciso |
| IA generativa | Gemini 2.0 Flash API (ya tenemos key) | Contexto largo (1M tokens), barato |
| Extraccion PDF | pdf-parse (npm) | Simple, sin servicios externos |
| Transcripcion YT | youtube-transcript (npm) | Gratis, sin API key |
| TTS (Fase 2) | Google Cloud TTS o Gemini | Ya tenemos cuenta Google |
| Grafo (Fase 2) | react-force-graph o vis-network | Ligero, renderiza en browser |

## Complejidad

| Fase | Funcionalidades | Estimacion |
|------|----------------|------------|
| Fase 1 (MVP) | F01-F04 | 2-3 dias desarrollo |
| Fase 2 | F05-F07 | 2-3 dias adicionales |
| Fase 3 | F08-F10 | 1-2 dias adicionales |

**Complejidad total: MEDIA-ALTA**
- pgvector es nuevo (no lo hemos usado antes)
- La comparacion delta requiere prompt engineering fino
- La ingesta de YouTube/PDF necesita parseo robusto
- Pero: todo corre en infra existente (Supabase + Vercel + APIs que ya tenemos)

## Principio Hector

> "¿Podria Hector mantener esto solo un domingo por la tarde si algo falla?"

**SI** — Todo corre en Supabase (ya lo maneja) + APIs externas (Gemini/OpenAI ya configurados). No hay infra nueva. Si falla, es una tab del AI Lab que deja de funcionar, no se cae la plataforma.
