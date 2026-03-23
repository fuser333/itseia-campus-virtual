# Tasks: Cumplimiento LOPDP Ecuador

**Input**: plan.md + spec.md
**Prerequisites**: 001-platform-foundation completo; pagina de registro en
`apps/web/src/app/(auth)/register/page.tsx` existente; pagina de perfil en
`apps/web/src/app/profile/page.tsx` existente; `middleware.ts` existente y extensible

**Tests**: Verificar que registro sin checkbox bloqueado tanto en cliente como en servidor;
exportacion JSON incluye datos de todas las tablas relevantes; plazo de 15 dias habiles
calculado correctamente excluyendo feriados Ecuador.

## Format: `[ID] [P?] [Story] Description`
- P = paralelizable (puede ejecutarse concurrentemente con otras tareas P)
- Story = historia de usuario que sirve

---

## Phase A: Consentimiento en registro y pagina /privacidad

**Purpose**: Ningun usuario puede registrarse sin consentimiento registrado; /privacidad es
accesible publicamente sin autenticacion.

- [ ] T001 [US1] Crear migracion `supabase/migrations/20260322_008_lopdp_compliance.sql`:
      tabla `privacy_policy_versions` con constraint de solo un `is_current = true`; tabla
      `consent_records` con campos `user_id`, `policy_version`, `accepted_at`, `ip_address`,
      `user_agent`; tabla `data_requests` con enums de tipo y status; RLS para cada tabla;
      indices en `consent_records(user_id, policy_version)` y `data_requests(status, requested_at)`;
      seed con version "1.0" placeholder de politica
- [ ] T002 [P] [US1] Extender `apps/web/src/types/database.ts` con tipos `ConsentRecord`
      y `DataRequest`
- [ ] T003 [P] [US1] Implementar `features/privacy/version.ts`:
      constante `POLICY_VERSION = '1.0'` y funcion `getCurrentPolicyVersion()` que
      consulta `privacy_policy_versions WHERE is_current = true`
- [ ] T004 [US1] Implementar `POST /api/privacy/consent/route.ts` — recibe `{ userId, policyVersion }`;
      captura IP de `x-forwarded-for` y `user-agent`; inserta en `consent_records`;
      idempotente si ya existe registro para `(user_id, version)`
- [ ] T005 [US1] Implementar `components/privacy/ConsentCheckbox.tsx` — checkbox NO
      pre-marcado (`defaultChecked={false}`), texto con link a `/privacidad`, error inline
      si intenta submit sin marcar
- [ ] T006 [US1] Modificar `apps/web/src/app/(auth)/register/page.tsx`:
      agregar `ConsentCheckbox` antes del submit; deshabilitar boton si checkbox no marcado;
      tras `signUp` exitoso llamar `POST /api/privacy/consent`; si falla el registro de
      consentimiento, eliminar la cuenta recien creada (rollback logico)
- [ ] T007 [P] [US1] Crear pagina `apps/web/src/app/privacidad/page.tsx` — Server Component
      sin autenticacion; carga `content_markdown` de `privacy_policy_versions WHERE is_current = true`;
      renderiza el markdown; muestra version y fecha de publicacion en el pie
- [ ] T008 [US1] Modificar `apps/web/src/middleware.ts` — para usuarios autenticados con
      rol estudiante: verificar si tienen `consent_records` con la version actual; si no,
      redirigir a `/actualizar-consentimiento` con checkbox de re-aceptacion

**Checkpoint**: Un nuevo usuario no puede crear cuenta sin marcar el checkbox; al completar
el registro existe un `ConsentRecord` en DB con `ip_address` y `user_agent` correctos;
`/privacidad` es accesible sin estar logueado; usuario existente sin version actual de
consentimiento es redirigido al flujo de actualizacion.

---

## Phase B: Seccion "Mis Datos" y derechos ARCO para el usuario

**Purpose**: Estudiante puede ver, exportar y solicitar eliminacion o rectificacion de sus
datos personales conforme a LOPDP Art. 20 y 21.

- [ ] T009 [US2] Implementar `features/privacy/data-export.ts`:
      `exportUserData(userId)` — query paralelo con `Promise.all` a perfil, enrollments,
      quiz_attempts, grades, attendance, consent_records, data_requests previas; retorna
      objeto JSON normalizado excluyendo tokens y hashes de password; si tarda > 10s,
      guardar en Supabase Storage y notificar
- [ ] T010 [US2] Implementar `GET /api/privacy/export-data/route.ts` — solo para usuario
      autenticado (`auth.uid()` debe coincidir); llama `exportUserData`; retorna con
      `Content-Disposition: attachment; filename="mis-datos-itseia.json"`
- [ ] T011 [P] [US2] Implementar `POST /api/privacy/request-delete/route.ts` — crea registro
      `data_requests` con `type = 'delete'`, `status = 'pending'`; retorna confirmacion con
      numero de solicitud y plazo estimado de 15 dias habiles
- [ ] T012 [P] [US2] Implementar `POST /api/privacy/request-rectify/route.ts` — crea registro
      con `type = 'rectify'` y campo de descripcion de que corregir
- [ ] T013 [US2] Implementar `components/privacy/MyDataSection.tsx`:
      lista de datos personales del usuario (nombre, correo, cedula, carreras, historial de
      consentimientos); boton "Exportar mis datos (JSON)"; boton "Solicitar eliminacion" con
      dialog de confirmacion que explica impacto y retencion legal; boton "Solicitar correccion";
      lista de solicitudes previas del usuario con estado
- [ ] T014 [US2] Integrar `MyDataSection` en `apps/web/src/app/profile/page.tsx`
      como nueva tab o seccion "Mis Datos / Privacidad"

**Checkpoint**: Estudiante descarga su JSON y contiene datos de todas las tablas relevantes
(no solo perfil); solicitud de eliminacion enviada aparece en `data_requests` con
`status = 'pending'`; boton de eliminacion requiere confirmacion explicita antes de enviar.

---

## Phase C: Panel admin de solicitudes ARCO y alertas de plazo

**Purpose**: Ninguna solicitud vence el plazo legal de 15 dias habiles sin alerta al admin.

- [ ] T015 [US3] Implementar `features/privacy/deadline.ts`:
      `calculateDeadline(requestedAt)` — suma 15 dias habiles excluyendo sabados, domingos
      y feriados nacionales Ecuador 2026 (array hardcodeado); `getDaysUntilDeadline(requestedAt)`
      retorna dias habiles restantes desde hoy
- [ ] T016 [US3] Implementar `GET /api/privacy/requests/route.ts` (admin only) — retorna
      todas las `data_requests` con `status != 'resolved'` ordenadas por
      `days_until_deadline ASC`; incluye campo calculado `days_until_deadline`; marca
      solicitudes con `days_until_deadline <= 3` como urgentes
- [ ] T017 [US3] Implementar `PATCH /api/privacy/requests/[id]/route.ts` — actualiza
      `status`, `resolved_at`, `resolution_notes`, `legal_hold_reason`; si
      `status = 'resolved'` y `type = 'delete'`: inicia eliminacion logica con
      `deleted_at = now()` en el perfil (datos fisicos se eliminan despues de 30 dias)
- [ ] T018 [US3] Implementar `components/privacy/DataRequestsPanel.tsx`:
      tabla con tipo, nombre del estudiante, fecha de recepcion, plazo legal (fecha),
      dias restantes, estado; filas con <= 3 dias en naranja con Badge "URGENTE";
      filas vencidas en rojo con Badge "VENCIDO"; dropdown de acciones (en proceso /
      resolver / retener con razon legal), cada una con dialog de notas; header con
      conteo ejecutivo "N pendientes — M urgentes"
- [ ] T019 [US3] Crear pagina `apps/web/src/app/admin/privacidad/page.tsx` con
      `DataRequestsPanel`; agregar enlace "Privacidad LOPDP" en la navegacion del admin
      con badge de conteo de solicitudes urgentes en el sidebar

**Checkpoint**: Solicitud de un estudiante aparece en el panel admin dentro de los 5 minutos;
solicitud creada hace 13 dias habiles muestra Badge "URGENTE"; admin puede resolver una
solicitud de eliminacion y `deleted_at` queda registrado en el perfil del usuario.

---

## Dependencies & Execution Order

- T001, T002, T003 son paralelos entre si y bloqueantes para sus dependientes.
- T004 depende de T001; T005 es independiente; T006 depende de T004 y T005.
- T007 y T008 son paralelos entre si y con T006.
- Phase B puede comenzar una vez T001 este completo.
- T009 depende de T001 (para saber que tablas consultar); T010 depende de T009.
- T011, T012 son paralelos entre si y con T009-T010.
- T013 depende de T010, T011, T012; T014 depende de T013.
- Phase C puede comenzar en paralelo con Phase B una vez T001 este listo.
- T015 es prerequisito de T016 y T017; T018 depende de T016 y T017; T019 depende de T018.

## Agent Team Strategy

- **Agente 1 (DB + Consentimiento)**: T001 -> T003 -> T004 -> T006 -> T008
- **Agente 2 (Pagina publica + Types)**: T002 + T007 (paralelo con Agente 1)
- **Agente 3 (Exportacion + ARCO usuario)**: T009 -> T010 + T011 + T012 (paralelo) -> T013 -> T014
- **Agente 4 (Panel admin + Plazos)**: T015 -> T016 + T017 (paralelo) -> T018 -> T019
