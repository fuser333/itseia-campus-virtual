# Implementation Plan: Foros de Discusion por Materia

**Branch**: `003-discussion-forums` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)

## Summary

Implementar foros de discusion asincronica por materia usando Supabase Realtime como capa
de entrega en tiempo real, sin dependencias externas adicionales. Cada materia activa tendra
un foro automaticamente disponible con hilos de mensajes anidados (post + respuestas), control
de moderacion para docentes y metricas de participacion exportables para evidencia SENESCYT,
cumpliendo el Art. 61 RRA 2022.

## Technical Context

**Language/Version**: TypeScript 5.x
**Framework**: Next.js 15 App Router — app existente en `apps/web/`
**CSS**: Tailwind CSS 4 + shadcn/ui (Textarea, Avatar, Badge ya disponibles en `components/ui/`)
**DB**: Supabase PostgreSQL + Supabase Realtime (suscripciones de canal por materia)
**Auth**: Supabase Auth con RLS — roles estudiante, docente, admin ya operativos
**Deploy**: Vercel (tecnologico.itseia.ai)
**Dependencias nuevas**: ninguna — Supabase Realtime ya incluido en `@supabase/supabase-js`
**Paginas existentes relevantes**:
- `apps/web/src/app/carreras/[slug]/materia/[subjectSlug]/page.tsx` — pagina de materia donde se agrega tab Foro
- `apps/web/src/app/teacher/materias/[id]/page.tsx` — panel docente de materia
- `apps/web/src/app/admin/page.tsx` — dashboard admin donde se agrega seccion metricas
- `apps/web/src/lib/supabase/client.ts` — cliente Supabase para Realtime
- `apps/web/src/types/database.ts` — tipos a extender

## Constitution Check

1. **Problema institucional**: Art. 61 RRA 2022 exige herramientas de comunicacion asincronica
   entre estudiantes y docentes como parte del entorno virtual de aprendizaje. Sin foros
   documentados, el CES puede objetar la modalidad en linea.
2. **Roles afectados**: estudiante (publica/responde/elimina propio), docente (modera: fija,
   elimina cualquier mensaje de su materia), admin (metricas globales).
3. **Datos, permisos y riesgos**: tablas `forum_posts` y `forum_replies` con RLS por
   `subject_id`. Riesgo: estudiante accede a foro de materia donde no esta matriculado —
   mitigado con policy `EXISTS (SELECT 1 FROM enrollments WHERE subject_id = ... AND user_id = auth.uid())`.
   Riesgo: mensajes con contenido inapropiado — docente puede eliminar, admin puede eliminar
   cualquiera.
4. **Verificacion de exito**: test de publicacion con dos usuarios en browsers separados
   (Realtime < 2s). Test de seguridad: usuario sin matricula intenta GET del foro — debe
   recibir error 403. Test de moderacion: docente fija y elimina mensaje.
5. **Slice minimo util**: publicar/responder + Realtime + moderacion docente. Las metricas
   admin (P3) se incluyen en Phase C como query agregada simple — no requieren infraestructura
   adicional.
6. **CES Compliance (Principio VI)**: satisface directamente Art. 61 RRA 2022. Los datos de
   participacion son exportables para SENESCYT. Comunicacion asincronica verificable por
   materia.
7. **AI-First (Principio VII)**: Supabase Realtime es la capa tecnica correcta — no hay
   alternativa AI-first relevante para mensajeria de foro. No se justifica complejidad AI
   adicional en este slice. Sugerencia diferida: moderacion automatica de contenido en Fase 4.
8. **Calidad de contenido (Principio VIII)**: no aplica — este spec es infraestructura de
   comunicacion, no contenido academico de sesion.

## Project Structure

### Documentacion

```text
specs/003-discussion-forums/
├── plan.md          (este archivo)
└── spec.md
```

### Codigo fuente — archivos nuevos

```text
apps/web/src/
├── app/
│   └── api/
│       └── forums/
│           ├── [subjectId]/posts/route.ts     — GET lista posts, POST nuevo post
│           ├── [subjectId]/posts/[postId]/route.ts  — DELETE post (autor o docente/admin)
│           └── [subjectId]/posts/[postId]/
│               ├── pin/route.ts               — PATCH: fijar/desfijar (solo docente/admin)
│               └── replies/route.ts           — GET replies, POST nueva reply
├── components/
│   └── forums/
│       ├── ForumThread.tsx    — lista de posts con sus replies anidadas
│       ├── ForumPost.tsx      — card de un post con acciones contextuales por rol
│       ├── ForumReply.tsx     — card de una respuesta
│       └── ForumComposer.tsx  — textarea + boton Publicar (reutilizable para post y reply)
└── features/
    └── forums/
        ├── actions.ts         — Server Actions: createPost, deletePost, pinPost, createReply
        ├── queries.ts         — getPostsForSubject, getRepliesForPost, getForumMetrics
        └── realtime.ts        — hook useForumRealtime(subjectId) con suscripcion Supabase
```

### Codigo fuente — archivos modificados

```text
apps/web/src/
├── app/carreras/[slug]/materia/[subjectSlug]/page.tsx
│     — agregar tab "Foro" que renderiza ForumThread
├── app/teacher/materias/[id]/page.tsx
│     — agregar tab "Foro" con las mismas ForumThread pero con controles de moderacion visibles
├── app/admin/page.tsx
│     — agregar seccion "Participacion en Foros" con tabla de metricas por materia
└── types/database.ts
      — agregar tipos ForumPost, ForumReply
```

### Base de datos — migraciones nuevas

```text
supabase/migrations/
└── 20260322_003_discussion_forums.sql
    — CREATE TABLE forum_posts
    — CREATE TABLE forum_replies
    — CREATE TABLE forum_notifications (in-app, para badge docente)
    — RLS policies
    — Indexes: forum_posts(subject_id, created_at), forum_replies(post_id)
    — Function: get_forum_metrics(subject_id) para metricas admin
```

## Implementation Phases

### Phase A: Tablas Supabase y API REST

**Objetivo**: crear y leer posts via API sin Realtime ni UI todavia.

- Crear migracion con:
  - `forum_posts`: `id`, `subject_id` (FK), `user_id` (FK), `content` (text),
    `is_pinned` (bool, default false), `created_at`, `updated_at`.
  - `forum_replies`: `id`, `post_id` (FK forum_posts), `user_id` (FK), `content` (text),
    `created_at`.
  - `forum_notifications`: `id`, `user_id` (FK), `post_id` (FK), `message` (text),
    `read` (bool), `created_at`.
  - RLS `forum_posts`: SELECT solo si `user_id` matriculado en `subject_id` o es docente/admin.
    INSERT solo si matriculado. DELETE solo si `user_id = auth.uid()` (propio) o rol docente/admin.
  - RLS `forum_replies`: misma logica por `post_id -> subject_id`.
- Implementar `GET /api/forums/[subjectId]/posts`: retorna posts ordenados por
  `is_pinned DESC, created_at DESC`, con replies anidadas via join o segunda query.
- Implementar `POST /api/forums/[subjectId]/posts`: valida contenido no vacio (max 5000 chars),
  inserta, crea notificacion para docente asignado.
- Implementar `DELETE /api/forums/[subjectId]/posts/[postId]`: verifica ownership o rol.
- Implementar `PATCH /api/forums/[subjectId]/posts/[postId]/pin`: solo docente/admin.
- Implementar `POST .../replies/route.ts` y `GET .../replies/route.ts`.

### Phase B: Realtime y componentes UI

**Objetivo**: mensajes aparecen en < 2 segundos sin recargar pagina.

- Implementar `features/forums/realtime.ts`: hook `useForumRealtime(subjectId)` que se
  suscribe al canal Supabase Realtime `forum:${subjectId}` escuchando INSERT en `forum_posts`
  y `forum_replies`. Actualiza el estado local con los nuevos items sin refetch completo.
- Implementar `ForumComposer.tsx`: `<Textarea>` controlado, contador de caracteres, boton
  "Publicar" deshabilitado si vacio, loading state durante POST.
- Implementar `ForumPost.tsx`:
  - Muestra: Avatar del autor (usar `components/ui/avatar.tsx`), nombre, timestamp en
    UTC-5 (Ecuador), contenido, conteo de respuestas.
  - Acciones contextuales: docente/admin ven "Fijar" y "Eliminar". Autor propio ve "Eliminar".
  - Si `is_pinned`: muestra Badge "Fijado" (usar `components/ui/badge.tsx`).
  - Boton "Responder" abre un `ForumComposer` anidado.
- Implementar `ForumReply.tsx`: version simplificada de `ForumPost` sin replies anidadas.
- Implementar `ForumThread.tsx`: lista paginada de posts (20 por pagina), posts fijados
  siempre al tope, buscador por palabra clave (filtro client-side sobre los posts cargados,
  o query con `ilike` para datasets grandes).
- Integrar `ForumThread` como tab en la pagina de materia estudiante y en el panel docente.

### Phase C: Notificaciones y metricas admin

**Objetivo**: docente ve badge cuando hay actividad; admin tiene evidencia para SENESCYT.

- In-app notifications: en el layout del docente (sidebar), mostrar badge con conteo de
  notificaciones no leidas de `forum_notifications`. Al hacer click, navegar al foro.
- Implementar `getForumMetrics(subjectId)` en `features/forums/queries.ts`:
  - Total posts, participantes unicos (COUNT DISTINCT user_id), ultimo post at,
    tasa de participacion (participantes unicos / total estudiantes matriculados).
  - Flag "Foro inactivo" si `max(created_at) < now() - interval '7 days'`.
- Agregar seccion en `admin/page.tsx`: tabla de metricas de foros por materia activa,
  boton "Exportar CSV" que genera archivo descargable con los mismos datos.
- La exportacion CSV es suficiente para evidencia SENESCYT en esta fase — no se requiere PDF.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Supabase Realtime subscription | La spec exige mensajes visibles en < 2 segundos sin recargar | Polling cada 2s es aceptable tecnicamente pero degrada UX y sobrecarga DB con muchos clientes |

No se introduce complejidad adicional significativa. Supabase Realtime ya esta disponible
en el cliente existente `apps/web/src/lib/supabase/client.ts`.

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| RLS mal configurado — acceso cross-materia | Baja | Critico | Test automatizado de seguridad: request con JWT de usuario sin matricula debe retornar 0 rows |
| Supabase Realtime connection drops (Vercel Edge) | Media | Bajo | Implementar reconnect automatico en el hook; fallback a refresco manual cada 30s |
| Mensajes de spam o contenido inapropiado en piloto | Media | Medio | Moderacion docente disponible desde el inicio (Phase A); limite 5000 chars previene abusos |
| Rendimiento con >500 posts en un foro | Baja | Bajo | Paginacion de 20 posts por pagina en Phase B; indices en `subject_id, created_at` |

## Environment Variables Required

Ninguna adicional. Usa las variables Supabase ya configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (para operaciones admin en API routes)
