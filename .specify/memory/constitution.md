<!--
Sync Impact Report
Version change: 0.0.0 -> 1.0.0
Modified principles:
- Placeholder principle 1 -> I. Institutional Source Alignment
- Placeholder principle 2 -> II. Spec-First Delivery
- Placeholder principle 3 -> III. Phase-Based MVP
- Placeholder principle 4 -> IV. Shared Platform, Role-Based Experience
- Placeholder principle 5 -> V. Simplicity, Security, and Verifiability
Added sections:
- Technical Guardrails
- Workflow and Quality Gates
Removed sections:
- None
Templates requiring updates:
- ✅ updated .specify/templates/plan-template.md
- ✅ updated .specify/templates/spec-template.md
- ✅ updated .specify/templates/tasks-template.md
Follow-up TODOs:
- None
-->
# Plataforma Completa ITSEIA Constitution

## Core Principles

### I. Institutional Source Alignment
Every feature MUST map to a real institutional need, approved product direction, or documented
academic or administrative process. The canonical source for institutional facts is the material
summarized in `docs/contexto/` and validated against the source PDFs stored locally. Features
without traceability to those inputs or to an approved roadmap phase MUST not move to planning.

### II. Spec-First Delivery
No implementation starts from a vague idea. Every relevant change MUST pass through a
specification, an implementation plan, and an actionable task breakdown. Specs define the what
and why; plans define the technical shape; tasks define the executable sequence. Work that skips
this chain is considered ungoverned work.

### III. Phase-Based MVP
The platform MUST be delivered in phases with clear release criteria. Each feature MUST belong
to a roadmap phase and define the smallest independently demonstrable slice of value. If a
proposal tries to solve future-phase problems before current-phase needs, it MUST be reduced or
deferred.

### IV. Shared Platform, Role-Based Experience
ITSEIA will be built as one shared platform with explicit role-based experiences for super admin,
coordinacion academica, docente, estudiante, finanzas, and lead or postulante. New work MUST
extend a common data and permission model instead of creating disconnected parallel flows or
duplicated systems.

### V. Simplicity, Security, and Verifiability
The default path MUST favor the simplest architecture that satisfies the phase objective. New
complexity requires written justification in the plan. Security, data access control, and
verification are mandatory: critical flows involving identity, academic records, payments,
permissions, or student progress MUST include server-side validation and an explicit test or
manual verification strategy.

## Technical Guardrails

The default platform stack is:

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS 4 and shadcn/ui
- Supabase for auth, database, storage, and row-level security
- Vercel for deployment

Departures from this stack are allowed only when they materially reduce risk or unlock a required
capability that the base stack cannot cover cleanly.

The repository structure MUST stay organized around:

- `apps/` for applications
- `packages/` for reusable code and shared configuration
- `supabase/` for data and security artifacts
- `docs/` for durable project knowledge
- `specs/` for feature-level delivery artifacts

Institutional content MUST be Spanish-first. Ecuadorian operating context, local academic
structures, and regulated educational workflows are not optional assumptions; they are baseline
constraints.

## Workflow and Quality Gates

Every feature plan MUST answer the following before implementation:

1. What institutional problem or phase objective does this solve?
2. Which roles are affected?
3. What data entities, permissions, and operational risks are touched?
4. How will success be verified?
5. Why is this the smallest useful slice?

Before merge or acceptance, the work MUST show:

- alignment to roadmap phase
- updated documentation when facts or workflow assumptions change
- verification evidence appropriate to the risk of the change
- no orphaned modules, screens, or data models without owning workflow

If a commodity capability can be integrated faster than rebuilding it from scratch, the plan MUST
consider that option and justify the chosen path.

## Governance

This constitution overrides ad hoc delivery preferences inside this repository. Amendments MUST
be documented in `.specify/memory/constitution.md`, versioned using semantic versioning, and
reflected in any affected templates or workflow documents.

Compliance review expectations:

- every plan performs a constitution check before implementation
- every spec identifies phase fit and institutional alignment
- every task list preserves incremental delivery by user story or usable slice

Versioning policy:

- MAJOR for breaking governance or principle changes
- MINOR for new principles or materially expanded rules
- PATCH for clarifications that do not change execution meaning

**Version**: 1.0.0 | **Ratified**: 2026-03-21 | **Last Amended**: 2026-03-21
