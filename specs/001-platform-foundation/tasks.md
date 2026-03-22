# Tasks: ITSEIA Platform Foundation

**Input**: Design documents from `/specs/001-platform-foundation/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Include test or verification tasks whenever the feature touches permissions, academic
records, critical data flows, or regression-prone business logic.

**Organization**: Tasks are grouped by user story to preserve incremental delivery.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Crear la base tecnica del repositorio para arrancar implementacion.

- [ ] T001 Crear el workspace de la app web en `apps/web/`
- [ ] T002 Configurar TypeScript, linting, formato y aliases compartidos en `packages/config/`
- [ ] T003 Configurar base UI y tokens iniciales en `packages/ui/`
- [ ] T004 Preparar variables de entorno y documentacion tecnica inicial en `README.md` y
      `docs/arquitectura/`
- [ ] T005 Definir estructura inicial de Supabase en `supabase/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Construir el nucleo comun que bloquea todos los slices posteriores.

- [ ] T006 Crear migraciones base para `Person`, `Lead`, `Applicant`, `RoleAssignment`,
      `Program`, `AcademicPeriod`, `Cohort`, `StudentProfile` y `TeacherProfile` en
      `supabase/migrations/`
- [ ] T007 [P] Configurar politicas de acceso y seguridad iniciales en `supabase/policies/`
- [ ] T008 [P] Implementar layout raiz, auth guard y resolucion de rol en
      `apps/web/src/app/` y `apps/web/src/server/`
- [ ] T009 Crear seed minima para carreras, periodo base y usuarios demo en `supabase/seeds/`
- [ ] T010 Implementar componentes UI base para navegacion publica y privada en
      `packages/ui/` y `apps/web/src/components/`

**Checkpoint**: Base de datos, auth y control de roles listos.

---

## Phase 3: User Story 1 - Descubrir la oferta y postular (Priority: P1) 🎯 MVP

**Goal**: Lanzar el sitio publico y el flujo de preinscripcion.

**Independent Test**: Un usuario nuevo puede revisar carreras y enviar una postulacion valida.

### Tests for User Story 1

- [ ] T011 [P] [US1] Crear prueba de smoke para rutas publicas en `apps/web/tests/smoke/`
- [ ] T012 [P] [US1] Crear prueba end-to-end del formulario de preinscripcion en
      `apps/web/tests/e2e/`

### Implementation for User Story 1

- [ ] T013 [P] [US1] Construir home institucional en `apps/web/src/app/(marketing)/page.tsx`
- [ ] T014 [P] [US1] Construir paginas de carreras en `apps/web/src/app/(marketing)/carreras/`
- [ ] T015 [US1] Implementar formulario de preinscripcion y validaciones en
      `apps/web/src/features/admissions/`
- [ ] T016 [US1] Persistir leads o applicants desde acciones del servidor en
      `apps/web/src/server/`
- [ ] T017 [US1] Crear confirmacion y mensajes de seguimiento para postulacion enviada

**Checkpoint**: El embudo inicial de captacion esta operativo.

---

## Phase 4: User Story 2 - Operar la base academica y administrativa (Priority: P2)

**Goal**: Permitir a administracion gestionar estructura academica minima y pipeline de
postulantes.

**Independent Test**: Un admin autenticado puede gestionar catalogo y revisar postulaciones.

### Tests for User Story 2

- [ ] T018 [P] [US2] Crear prueba de acceso por rol para vistas admin en `apps/web/tests/e2e/`
- [ ] T019 [P] [US2] Crear prueba de flujo CRUD base para programas o cohortes

### Implementation for User Story 2

- [ ] T020 [P] [US2] Crear panel admin base en `apps/web/src/app/admin/`
- [ ] T021 [US2] Implementar gestion de programas, periodos y cohortes en
      `apps/web/src/features/catalog/`
- [ ] T022 [US2] Implementar bandeja de leads o postulantes en
      `apps/web/src/features/admissions/`
- [ ] T023 [US2] Implementar actualizacion de estados y asignacion inicial a cohorte
- [ ] T024 [US2] Implementar gestion de asignaciones de rol en `apps/web/src/features/identity/`

**Checkpoint**: Operacion administrativa minima lista.

---

## Phase 5: User Story 3 - Entrar al portal segun el rol (Priority: P3)

**Goal**: Habilitar dashboards base de estudiante y docente.

**Independent Test**: Estudiante y docente entran a su dashboard correcto sin fugas de permisos.

### Tests for User Story 3

- [ ] T025 [P] [US3] Crear prueba de login y redireccion por rol en `apps/web/tests/e2e/`
- [ ] T026 [P] [US3] Crear prueba de bloqueo de rutas cruzadas por rol

### Implementation for User Story 3

- [ ] T027 [P] [US3] Construir dashboard estudiante en `apps/web/src/app/student/`
- [ ] T028 [P] [US3] Construir dashboard docente en `apps/web/src/app/teacher/`
- [ ] T029 [US3] Implementar carga de resumen academico base desde `apps/web/src/server/`
- [ ] T030 [US3] Mostrar asignaciones iniciales segun perfil y cohorte

**Checkpoint**: Base del portal compartido validada.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cerrar calidad y dejar el MVP listo para demo interna.

- [ ] T031 [P] Documentar decisiones y flujos reales en `docs/`
- [ ] T032 Ajustar accesibilidad y responsive del sitio publico y paneles
- [ ] T033 Revisar rendimiento basico de paginas publicas
- [ ] T034 Ejecutar validacion manual definida en `quickstart.md`
- [ ] T035 Preparar demo interna y lista de pendientes para la siguiente fase

## Dependencies & Execution Order

- Fase 1 crea el contenedor tecnico.
- Fase 2 desbloquea todas las historias.
- US1 puede salir primero como MVP comercial.
- US2 depende de la base de auth, datos y UI comun.
- US3 depende de auth, roles y datos semilla.
- Polish ocurre al final de los slices comprometidos.

## Implementation Strategy

### MVP First

1. Completar Setup.
2. Completar Foundational.
3. Completar User Story 1.
4. Validar captacion y trazabilidad.

### Incremental Delivery

1. Abrir sitio publico y preinscripcion.
2. Agregar panel administrativo.
3. Agregar dashboards base por rol.
4. Usar esa base para la siguiente fase del campus virtual.
