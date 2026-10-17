# Implementation Plan: ITSEIA Platform Foundation

**Branch**: `001-platform-foundation` | **Date**: 2026-03-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-platform-foundation/spec.md`

## Summary

Construir la base tecnica del producto ITSEIA como una sola aplicacion web con experiencia
publica y privada, respaldada por Supabase, para resolver tres slices iniciales:

1. sitio publico y preinscripcion
2. operacion academica administrativa minima
3. dashboard base por rol para estudiante y docente

La implementacion debe priorizar velocidad de salida, control por roles y una estructura de datos
que permita crecer despues hacia campus virtual, pagos y AI Lab sin rehacer el nucleo.

## Technical Context

**Language/Version**: TypeScript 5.x con Node 24 para desarrollo  
**Primary Dependencies**: Next.js 15, React 19, Tailwind CSS 4, shadcn/ui, Supabase SSR,
Supabase JS, Zod  
**Storage**: Supabase PostgreSQL + Supabase Storage  
**Testing**: Vitest, React Testing Library, Playwright  
**Target Platform**: Web responsive en navegadores modernos con despliegue en Vercel  
**Project Type**: Monorepo web application  
**Performance Goals**: Paginas publicas con LCP objetivo menor a 2.5s; flujos administrativos
primarios bajo 2s en condiciones normales  
**Constraints**: Espanol primero, RBAC estricto, PII protegida, contexto academico Ecuador,
arquitectura simple y escalable  
**Scale/Scope**: 100-250 usuarios activos iniciales, 3 programas, una sede, una operacion
institucional inicial

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Institutional alignment is explicitly documented in `docs/contexto/institucional.md`,
  `docs/roadmap/fases.md` y `ESTRUCTURA_COMPLETA.md`.
- The feature is assigned to Fase 0 y desbloquea Fase 1 y Fase 2 sin invadir modulos de fases
  posteriores.
- Roles afectados: lead o aspirante, super admin, coordinacion academica, estudiante, docente.
- Riesgos operativos: permisos, PII, consistencia de catalogo academico, trazabilidad de
  admisiones.
- The default stack is used with no justified deviation.
- La estrategia de verificacion incluye pruebas de acceso por rol, formularios criticos y smoke
  tests de navegacion.
- Se considera integracion futura con soluciones externas para LMS o ERP, pero el MVP se enfoca
  en el nucleo propio y no en reconstruir todo el campus virtual.

## Project Structure

### Documentation (this feature)

```text
specs/001-platform-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── README.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
└── web/
    ├── src/
    │   ├── app/
    │   │   ├── (marketing)/
    │   │   ├── (auth)/
    │   │   ├── admin/
    │   │   ├── student/
    │   │   └── teacher/
    │   ├── components/
    │   ├── features/
    │   │   ├── admissions/
    │   │   ├── catalog/
    │   │   ├── identity/
    │   │   └── dashboards/
    │   ├── lib/
    │   └── server/
    └── tests/

packages/
├── ui/
└── config/

supabase/
├── migrations/
├── policies/
└── seeds/

docs/
specs/
```

**Structure Decision**: Una sola aplicacion `apps/web` servira marketing, auth y portales
autenticados. Esto evita duplicar repositorios o romper la fuente de verdad de usuarios y roles.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| None | N/A | N/A |
