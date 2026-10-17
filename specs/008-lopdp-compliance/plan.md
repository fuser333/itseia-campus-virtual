# Implementation Plan: Cumplimiento LOPDP Ecuador

**Branch**: `008-lopdp-compliance` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)

## Summary

Implementar los mecanismos tecnicos de cumplimiento de la Ley Organica de Proteccion de Datos
Personales de Ecuador (LOPDP): consentimiento explicito en registro, pagina publica de politica
de privacidad, seccion "Mis Datos" con exportacion JSON y solicitud de eliminacion, y panel
admin para gestionar solicitudes de derechos ARCO dentro del plazo legal de 15 dias habiles.
Este spec protege a ITSEIA de sanciones (hasta 1% del volumen de negocio) y es requisito CES
previo al primer registro de estudiante real.

## Technical Context

**Language/Version**: TypeScript 5.x
**Framework**: Next.js 15 App Router — app existente en `apps/web/`
**CSS**: Tailwind CSS 4 + shadcn/ui (`components/ui/dialog.tsx`, `components/ui/checkbox.tsx`
implicitly via shadcn — agregar si no existe)
**DB**: Supabase PostgreSQL (nuevas tablas consent_records y data_requests)
**Auth**: Supabase Auth (operativo) — la pagina de registro esta en
  `apps/web/src/app/(auth)/register/page.tsx`
**Deploy**: Vercel (tecnologico.itseia.ai)
**Dependencias nuevas**: ninguna — logica de feriados con array hardcodeado Ecuador 2026
  (simple, sin libreria de calendario de feriados)
**Paginas existentes relevantes**:
- `apps/web/src/app/(auth)/register/page.tsx` — donde se agrega el checkbox de consentimiento
- `apps/web/src/app/profile/page.tsx` — donde se agrega la seccion "Mis Datos"
- `apps/web/src/app/admin/page.tsx` — donde se agrega el panel de solicitudes
- `apps/web/src/types/database.ts` — tipos a extender

## Constitution Check

1. **Problema institucional**: LOPDP vigente desde mayo 2021 en Ecuador — cumplimiento
   obligatorio para cualquier entidad que procese datos personales. ITSEIA procesa nombre,
   cedula, correo y desempeno academico desde el primer registro. Incumplimiento: sanciones
   hasta 1% del volumen de negocio anual. Ademas requisito CES (Principio VI) para modalidad
   en linea: "LOPDP privacy policy with consent at enrollment".
2. **Roles afectados**: lead/aspirante y estudiante (da consentimiento, ejerce derechos ARCO),
   admin (gestiona solicitudes, resuelve en plazo legal). El rol "finanzas" no es afectado
   en esta fase.
3. **Datos, permisos y riesgos**: `consent_records` contiene IP de origen — dato personal
   derivado. `data_requests` puede contener notas sensibles sobre el motivo de eliminacion.
   RLS: `consent_records` — usuario solo puede ver su propio registro. `data_requests` — usuario
   ve sus solicitudes; admin ve todas. Riesgo critico: exportacion de datos del usuario debe
   incluir TODOS los datos (no solo perfil) — verificar que el query agrega enrollments,
   grades, attendance, consent, quiz attempts. Riesgo: eliminacion logica debe ser irreversible
   despues de 30 dias — implementar con `deleted_at` y job de limpieza diferido.
4. **Verificacion de exito**: test end-to-end de registro sin aceptar checkbox — debe
   bloquear. Test de exportacion: usuario descarga JSON y verificar que incluye todos sus
   datos. Test de plazo: crear solicitud, verificar que a los 12 dias habiles aparece alerta
   en admin (< 3 dias restantes).
5. **Slice minimo util**: consentimiento en registro + pagina /privacidad + seccion "Mis
   Datos" con exportacion y solicitud de eliminacion + panel admin de solicitudes. Todo P1
   y P2 es obligatorio antes del primer estudiante real.
6. **CES Compliance (Principio VI)**: la Constitution lista explicitamente "LOPDP privacy
   policy with consent at enrollment" como parte del Platform Minimum Viable Compliance.
   Este spec cierra ese requisito.
7. **AI-First (Principio VII)**: no aplica en este spec — el cumplimiento legal requiere
   mecanismos deterministos y auditables. No se justifica IA para consentimiento o
   gestion de solicitudes ARCO.
8. **Calidad de contenido (Principio VIII)**: no aplica — este spec es compliance legal,
   no contenido academico. La politica de privacidad es texto legal provisto por el equipo
   institucional (A1 del spec).

## Project Structure

### Documentacion

```text
specs/008-lopdp-compliance/
├── plan.md          (este archivo)
└── spec.md
```

### Codigo fuente — archivos nuevos

```text
apps/web/src/
├── app/
│   ├── privacidad/
│   │   └── page.tsx                  — pagina publica (sin auth) con politica de privacidad vigente
│   ├── admin/
│   │   └── privacidad/
│   │       └── page.tsx              — panel admin: lista de solicitudes ARCO con estados y plazos
│   └── api/
│       └── privacy/
│           ├── consent/route.ts       — POST: registra consentimiento al crear cuenta
│           ├── export-data/route.ts   — GET: genera JSON con todos los datos del usuario autenticado
│           ├── request-delete/route.ts — POST: crea solicitud de eliminacion
│           ├── request-rectify/route.ts — POST: crea solicitud de rectificacion
│           └── requests/route.ts      — GET (admin): lista solicitudes; PATCH: actualiza estado
├── components/
│   └── privacy/
│       ├── ConsentCheckbox.tsx        — checkbox no pre-marcado con link a /privacidad
│       ├── MyDataSection.tsx          — seccion del perfil con lista de datos y acciones ARCO
│       └── DataRequestsPanel.tsx      — tabla admin de solicitudes con plazos y acciones
└── features/
    └── privacy/
        ├── data-export.ts             — agrega todos los datos del usuario para exportacion JSON
        ├── deadline.ts                — calcula fecha limite (15 dias habiles, excluyendo feriados EC)
        └── version.ts                 — POLICY_VERSION constante y funcion de comparacion
```

### Codigo fuente — archivos modificados

```text
apps/web/src/
├── app/(auth)/register/page.tsx
│     — agregar ConsentCheckbox antes del boton "Crear cuenta"
│     — validar que checkbox esta marcado antes de llamar Supabase Auth signUp
│     — al crear cuenta exitosamente: llamar POST /api/privacy/consent con user_id, IP, version
├── app/profile/page.tsx
│     — agregar tab o seccion "Mis Datos" con MyDataSection
├── app/admin/layout.tsx (o admin/page.tsx)
│     — agregar enlace "Privacidad / LOPDP" en la navegacion del admin
├── middleware.ts
│     — si usuario autenticado y consent_records sin version actual: redirigir a /actualizar-consentimiento
└── types/database.ts
      — agregar tipos ConsentRecord, DataRequest
```

### Base de datos — migraciones nuevas

```text
supabase/migrations/
└── 20260322_008_lopdp_compliance.sql
    — CREATE TABLE consent_records
    — CREATE TABLE data_requests
    — CREATE TABLE privacy_policy_versions (version, content_markdown, published_at)
    — RLS policies para cada tabla
    — Index: consent_records(user_id, policy_version), data_requests(status, requested_at)
    — Seed inicial: INSERT INTO privacy_policy_versions (version='1.0', content_markdown=placeholder, published_at=now())
```

## Implementation Phases

### Phase A: Consentimiento en registro y pagina /privacidad

**Objetivo**: ningun usuario puede registrarse sin consentimiento; /privacidad es publica y accesible.

- Crear migracion con:
  - `privacy_policy_versions`: `id`, `version` (text, ej: "1.0"), `content_markdown` (text),
    `published_at`, `is_current` (bool, solo uno puede ser true — constraint o trigger).
  - `consent_records`: `id`, `user_id` (FK auth.users), `policy_version` (text),
    `accepted_at` (timestamptz), `ip_address` (inet), `user_agent` (text).
  - `data_requests`: `id`, `user_id` (FK), `type` (enum: export/delete/rectify/oppose),
    `status` (enum: pending/in_progress/resolved/held), `requested_at`, `resolved_at`,
    `resolution_notes` (text), `legal_hold_reason` (text, para retencion legal justificada).
  - RLS `consent_records`: `user_id = auth.uid()` para SELECT/INSERT. Service role para admin.
  - RLS `data_requests`: `user_id = auth.uid()` para SELECT/INSERT. Admin puede SELECT/UPDATE todos.
- Implementar `features/privacy/version.ts`:
  - `POLICY_VERSION = '1.0'` — constante de la version actual.
  - `getCurrentPolicyVersion()` — query a `privacy_policy_versions WHERE is_current = true`.
- Implementar `ConsentCheckbox.tsx`:
  - Checkbox NO pre-marcado (atributo `defaultChecked={false}` en input, sin `checked` controlado inicial).
  - Texto: "He leido y acepto la [Politica de Privacidad](/privacidad) de ITSEIA (LOPDP)."
  - Si intentan hacer submit sin marcar: muestra error inline "Debes aceptar para continuar".
- Modificar `app/(auth)/register/page.tsx`:
  - Agregar `ConsentCheckbox` antes del submit.
  - Bloqueo client-side: boton deshabilitado si checkbox no marcado.
  - Bloqueo server-side: `POST /api/privacy/consent` se llama como segunda operacion tras el
    `signUp` exitoso de Supabase. Si falla el registro del consentimiento, se elimina la cuenta
    recien creada (rollback logico — mejor atomicidad posible sin transacciones HTTP).
- Implementar `POST /api/privacy/consent`:
  - Recibe `{ userId, policyVersion }` desde el cliente autenticado.
  - Captura IP del request headers (`x-forwarded-for` en Vercel) y `user-agent`.
  - Inserta en `consent_records`. Idempotente: si ya existe registro para `(user_id, version)`,
    retorna 200 sin duplicar.
- Implementar pagina `app/privacidad/page.tsx`:
  - Server Component — carga `content_markdown` de `privacy_policy_versions WHERE is_current = true`.
  - Renderiza el markdown con un parser simple (MDX o `remark`/`marked` — verificar cual
    ya esta en el proyecto; si ninguno, usar `dangerouslySetInnerHTML` con sanitizacion via
    `DOMPurify` o contenido controlado institucionalmente).
  - Sin autenticacion requerida — accesible publicamente.
  - Muestra version y fecha de publicacion en el pie.
- Modificar `middleware.ts`:
  - Para usuarios autenticados con rol estudiante: verificar si tienen `consent_records` con
    la version actual. Si no: redirigir a `/actualizar-consentimiento` (pagina minima con el
    texto de la nueva politica y el checkbox para re-aceptar).

### Phase B: Seccion "Mis Datos" y derechos ARCO para el usuario

**Objetivo**: estudiante puede ver, exportar y solicitar eliminacion de sus datos personales.

- Implementar `features/privacy/data-export.ts`:
  - `exportUserData(userId: string): Promise<UserDataExport>`:
    - Query paralelo con `Promise.all` a: perfil de usuario, enrollments, quiz_attempts,
      grades/notas, attendance, consent_records, data_requests previas.
    - Retorna objeto JSON normalizado y legible.
  - Excluir datos tecnicos internos (tokens, hashes de password) — solo datos personales y academicos.
- Implementar `GET /api/privacy/export-data`:
  - Solo para usuario autenticado (`auth.uid()` debe coincidir con el usuario exportado).
  - Llama `exportUserData`, serializa a JSON.
  - Retorna con headers: `Content-Type: application/json`,
    `Content-Disposition: attachment; filename="mis-datos-itseia.json"`.
  - Timeout: si la exportacion tarda > 10s (usuarios con mucho historial), retornar `202`
    y guardar el archivo en Supabase Storage con notificacion cuando este listo.
- Implementar `POST /api/privacy/request-delete`:
  - Crea registro en `data_requests` con `type = 'delete'`, `status = 'pending'`.
  - Retorna confirmacion con numero de solicitud y plazo estimado de 15 dias habiles.
- Implementar `POST /api/privacy/request-rectify`:
  - Crea registro con `type = 'rectify'` y `notes` de que campo corregir.
- Implementar `MyDataSection.tsx`:
  - Lista de datos personales: nombre completo, correo, cedula (si existe), fecha de registro,
    carreras/materias inscritas, historial de consentimientos.
  - Boton "Exportar mis datos (JSON)" — llama `/api/privacy/export-data`.
  - Boton "Solicitar eliminacion de cuenta" — abre dialog de confirmacion con texto del
    impacto (perdera acceso, sus datos seran eliminados en 30 dias, sus notas y certificados
    pueden retenerse por obligacion legal).
  - Boton "Solicitar correccion de datos" — abre form simple con campo de descripcion.
  - Lista de solicitudes previas del usuario con estado actual.
- Integrar en `app/profile/page.tsx`: nueva tab o seccion "Mis Datos / Privacidad".

### Phase C: Panel admin de solicitudes ARCO y alertas de plazo

**Objetivo**: ninguna solicitud vence el plazo legal de 15 dias habiles sin alerta al admin.

- Implementar `features/privacy/deadline.ts`:
  - `calculateDeadline(requestedAt: Date): Date`:
    - Suma 15 dias habiles excluyendo sabados, domingos y feriados nacionales de Ecuador 2026.
    - Feriados hardcodeados para 2026: Año Nuevo (1 enero), Carnaval (16-17 febrero),
      Viernes Santo (3 abril), Dia del Trabajo (1 mayo), Batalla de Pichincha (24 mayo),
      Primer Grito Independencia (10 agosto), Independencia Guayaquil (9 octubre),
      Dia de Difuntos (2 noviembre), Fundacion Cuenca (3 noviembre), Navidad (25 diciembre).
  - `getDaysUntilDeadline(requestedAt: Date): number` — dias habiles restantes desde hoy.
- Implementar `GET /api/privacy/requests` (admin only):
  - Retorna todas las `data_requests` con `status != 'resolved'`, ordenadas por
    `days_until_deadline ASC`.
  - Incluye `days_until_deadline` calculado con `deadline.ts`.
  - Marca solicitudes con `days_until_deadline <= 3` como urgentes.
- Implementar `PATCH /api/privacy/requests/[id]`:
  - Actualiza `status`, `resolved_at`, `resolution_notes`, `legal_hold_reason`.
  - Para `status = 'resolved'` con `type = 'delete'`: inicia proceso de eliminacion logica
    del usuario (set `deleted_at = now()` en el perfil; datos se eliminan fisicamente despues
    de 30 dias via job o manual).
- Implementar `DataRequestsPanel.tsx`:
  - Tabla con columnas: tipo de solicitud, nombre del estudiante, fecha de recepcion,
    plazo legal (fecha), dias restantes, estado.
  - Fila con `days_remaining <= 3`: fondo rojo/naranja con Badge "URGENTE".
  - Fila con `days_remaining <= 0`: fondo rojo intenso con Badge "VENCIDO".
  - Acciones por fila: dropdown "Marcar en proceso", "Resolver", "Retener por razon legal",
    cada una abre dialog con campo de notas.
  - Conteo en el header: "3 pendientes — 1 urgente" como resumen ejecutivo.
- Integrar `DataRequestsPanel` en nueva pagina `app/admin/privacidad/page.tsx`.
- Agregar enlace "Privacidad LOPDP" en la navegacion del admin con badge de conteo de
  solicitudes urgentes (usando la misma logica de notificacion in-app del sidebar).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Exportacion de datos agrega multiples tablas | La LOPDP Art. 20 exige portabilidad de TODOS los datos personales | Exportar solo el perfil no cumple el derecho legal — se requiere historial academico, asistencia, etc. |
| Feriados hardcodeados (no libreria) | El plazo legal en dias habiles es critico para evitar sanciones | Una libreria de feriados agrega dependencia; con < 15 feriados anuales en Ecuador el array hardcodeado es mantenible |

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Texto de politica de privacidad no disponible al momento de implementar | Media | Alto | Usar placeholder con estructura legal minima LOPDP. La plataforma aloja el texto — puede actualizarse via admin sin deploy |
| Exportacion JSON incluye datos de otras tablas no previstas inicialmente | Media | Medio | `data-export.ts` diseñado como funcion extensible; agregar tablas nuevas al exportador cuando se implementen nuevos modulos |
| Admin ignora solicitud hasta que vence el plazo | Media | Alto | Alerta visible con badge en sidebar + email futuro (Fase 4). El badge rojo es motivador suficiente en MVP |
| Estudiante menor de edad requiere consentimiento de representante legal | Baja (target adultos) | Alto | Documentado como edge case en spec. Agregar campo de "fecha de nacimiento" en registro con validacion de mayor de 18; si menor: mostrar mensaje de que se requiere representante |
| Eliminacion fisica de datos borra historial academico que SENESCYT puede requerir | Media | Alto | Implementar retension legal (LOPDP Art. 21): notas y certificados emitidos se retienen con flag `retained_for_compliance`; solo se eliminan datos de contacto y acceso |

## Environment Variables Required

Ninguna adicional. Usa las variables ya configuradas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Nota operacional: el `POLICY_VERSION` en `features/privacy/version.ts` debe actualizarse
manualmente cada vez que se publica una nueva version de la politica de privacidad, y la
nueva version debe insertarse en `privacy_policy_versions` via migracion o panel admin.
