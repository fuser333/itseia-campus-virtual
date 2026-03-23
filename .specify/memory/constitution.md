<!--
Sync Impact Report
Version change: 1.0.0 -> 2.0.0
Modified principles:
- I. Institutional Source Alignment (unchanged)
- II. Spec-First Delivery (unchanged)
- III. Phase-Based MVP (unchanged)
- IV. Shared Platform, Role-Based Experience (unchanged)
- V. Simplicity, Security, and Verifiability (unchanged)
Added principles:
- VI. CES Compliance by Design
- VII. AI-First Architecture
- VIII. Content Quality Standard (65% Practical)
Added sections:
- CES Regulatory Guardrails
- Platform Minimum Viable Compliance
Updated sections:
- Technical Guardrails (added modern integrations)
Templates requiring updates:
- plan-template.md (add CES compliance check)
- spec-template.md (add CES alignment section)
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

### VI. CES Compliance by Design
Every feature that touches academic delivery MUST comply with CES (Consejo de Educacion Superior)
requirements for modalidad en linea. The platform MUST guarantee:
- At least 51% of program credits have synchronous student-teacher interaction with verifiable
  attendance records (Art. 57, 61 RRA 2022; Reglamento IST RPC-SE-04-No.012-2023).
- Academic integrity mechanisms in all evaluations (Art. 62 RRA 2022).
- Access to at least one virtual library for students (Art. 61 RRA 2022).
- Asynchronous interaction tools: forums, messaging, tutoring (Art. 61 RRA 2022).
- Traceable records of all student activity, attendance, and grades for SENESCYT reporting.
- LOPDP (Ley Organica de Proteccion de Datos Personales) compliance: published privacy policy,
  consent at enrollment, data export/deletion mechanisms.
Non-compliant features MUST NOT be deployed to production for formal academic programs.
Formacion continua (cursos, bootcamps, preuniversitario) may operate with reduced requirements
while CES approval is in process.

Reference: `docs/ces_aprobacion/INVESTIGACION_REQUISITOS_CES_ONLINE.md`
Precedent: IST Yaruqui — IA online approved (RPC-SO-26-NO.429-2024)

### VII. AI-First Architecture
ITSEIA is an AI institute. The platform MUST demonstrate what it teaches. Every commodity
capability MUST be evaluated against an AI-powered alternative before choosing the traditional
approach. Specifically:
- Videoconferencing: API-embedded (Daily.co or equivalent), not external links.
- Library: Open access APIs (OpenAlex, Scielo, arXiv) with AI search, not expensive EBSCO
  contracts.
- Anti-fraud: AI-powered pattern analysis, not invasive proctoring software.
- Tutoring: Multi-model AI Lab (Gemini API + links to ChatGPT, Claude, Perplexity).
- Content: AI-generated with human validation, not manually authored from scratch.
The platform cost MUST stay under $150/month at 200 students.

### VIII. Content Quality Standard
Every academic session MUST have 7 types of content before being marked complete:
1. Video: validated by pedagogy team for topic relevance and adequate duration.
2. Slides: professional presentation (Gamma API or equivalent).
3. Theory: minimum 1500 words, 65% practical (examples, exercises, code).
4. Quiz: 5 questions with explanations, anti-fraud enabled.
5. Exercise: hands-on, step-by-step, with clear deliverable.
6. AI Lab: contextual prompt + links to external AI tools.
7. Resources: 5 verified, relevant links.
Each product module MUST have ONE complete pilot approved by the CEO before scaling to remaining
sessions. Incomplete content MUST NOT be presented as finished to students.

## CES Regulatory Guardrails

The following are non-negotiable regulatory requirements. They define the MINIMUM the platform
MUST have before presenting to CES for online modality approval:

### Platform Minimum Viable Compliance (PMVC)
- [ ] Videoconferencing with recording and automatic attendance (51% synchronous)
- [ ] Discussion forums per subject (asynchronous interaction)
- [ ] Virtual library access (at least one: OpenAlex, Scielo, or equivalent)
- [ ] Anti-fraud in evaluations (randomization, timer, pattern analysis)
- [ ] Academic calendar visible and linked to sessions
- [ ] Automatic attendance records exportable for SENESCYT
- [ ] LOPDP privacy policy with consent at registration
- [ ] Role separation: admin, coordinator, teacher, student, finance
- [ ] Grade traceability: teacher grades, student sees grades, exportable reports
- [ ] Material repository organized by subject
- [ ] Teachers with 120h virtual education certification (operational, not platform)

### Documentation for CES Submission
- [ ] LMS description document (name, version, capabilities)
- [ ] Server infrastructure specification (Vercel, Supabase, uptime guarantee)
- [ ] Bandwidth and concurrent capacity documentation
- [ ] Virtual library access contract or API documentation
- [ ] Backup and data recovery plan
- [ ] Information security policy
- [ ] Platform demo video showing all required functionalities

## Technical Guardrails

The default platform stack is:

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS 4 and shadcn/ui
- Supabase for auth, database, storage, and row-level security
- Vercel for deployment
- Daily.co for embedded videoconferencing
- Gemini API for AI tutoring
- OpenAlex/Scielo/arXiv APIs for virtual library

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
6. Does it comply with CES requirements for online modality? (Principle VI)
7. Does it use AI-first approach where applicable? (Principle VII)

Before merge or acceptance, the work MUST show:

- alignment to roadmap phase
- CES compliance check (for academic features)
- updated documentation when facts or workflow assumptions change
- verification evidence appropriate to the risk of the change
- no orphaned modules, screens, or data models without owning workflow
- content quality standard met (Principle VIII) for any session content

If a commodity capability can be integrated faster than rebuilding it from scratch, the plan MUST
consider that option and justify the chosen path.

## Governance

This constitution overrides ad hoc delivery preferences inside this repository. Amendments MUST
be documented in `.specify/memory/constitution.md`, versioned using semantic versioning, and
reflected in any affected templates or workflow documents.

Compliance review expectations:

- every plan performs a constitution check before implementation
- every spec identifies phase fit, institutional alignment, and CES compliance
- every task list preserves incremental delivery by user story or usable slice
- every content module has a complete pilot before scaling

Versioning policy:

- MAJOR for breaking governance or principle changes
- MINOR for new principles or materially expanded rules
- PATCH for clarifications that do not change execution meaning

**Version**: 2.0.0 | **Ratified**: 2026-03-21 | **Last Amended**: 2026-03-22
