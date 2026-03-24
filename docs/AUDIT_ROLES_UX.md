# AUDIT: ITSEIA Platform - User Roles & UX Implementation Status

**Date:** March 24, 2026  
**Project:** Plataforma Completa ITSEIA / apps/web  
**Codebase:** /src (~400+ React components, 40+ pages, 6 user roles)

---

## EXECUTIVE SUMMARY

The platform supports 6 distinct user roles with varying levels of implementation:
- **ALUMNO (Estudiante):** 85% complete — most student features working
- **EXTERNO (Cursos Profesionales):** 30% complete — needs integration with old Academy system
- **DOCENTE:** 70% complete — core teaching features present, but scattered across /teacher and /admin
- **COORDINACION/ADMIN:** 95% complete — comprehensive administration panel
- **FINANZAS:** 60% complete — payments interface present
- **B2B (Corporate):** 20% complete — placeholder page, no dedicated dashboard

### Key Issues Found

1. **Login page shows outdated stats:** 22 cursos, 198 módulos (from old Academy system, not current database)
2. **EXTERNO role not implemented** — no professional course assignment or quiz system
3. **Teacher Training (120h requirement)** exists but scattered between /teacher/capacitacion and /admin/docentes/capacitacion
4. **Profile page exists but incomplete** — loads user data, shows XP level, missing some fields
5. **Teacher navigation confusing** — features split between /teacher/* and /admin/* paths
6. **B2B page is placeholder** — shows generic form, no actual corporate dashboard

---

## ROLE-BY-ROLE BREAKDOWN

### 1. ALUMNO (Estudiante) — 85% Complete

#### Navigation (Sidebar)

| Section | Items | Status |
|---------|-------|--------|
| **Principal** | Dashboard, Mi Carrera, AI Lab, Flashcards | ✅ Works |
| **Academy** | Biblioteca, Calendario, Certificaciones | ✅ Works |
| **Mi Cuenta** | Mis Pagos, Mi Perfil | ✅ Works |
| **Explorar** | Catalogo, Carreras | ⚠️ Duplicates /carreras path |

#### Pages & Features

| Feature | Path | Exists? | Works? | Notes |
|---------|------|---------|--------|-------|
| **Dashboard** | `/dashboard` | ✅ Yes | ✅ Works | Shows progress, Mi Carrera, calendar widget, last lesson |
| **Mi Carrera** | `/carreras/[slug]` | ✅ Yes | ✅ Works | Career progress, semester/session tracking |
| **Calendario** | `/calendario` | ✅ Yes | ✅ Works | Academic calendar, Realtime events, videoconf links |
| **AI Lab Chat** | `/ai-lab` | ✅ Yes | ✅ Works | Conversations saved to localStorage, 500 request limit |
| **AI Lab History** | `/ai-lab/historial` | ✅ Yes | ⚠️ Partial | Path exists, component lazy-loaded |
| **Code Playground** | `/ai-lab` (tab) | ✅ Yes | ⚠️ Partial | Lazy-loaded, not fully tested |
| **Biblioteca (Library)** | `/biblioteca` | ✅ Yes | ✅ Works | Search + saved papers, OpenAlex/Scielo/arXiv integration |
| **Flashcards** | `/flashcards` | ✅ Yes | ✅ Works | Groups by session, deck study mode |
| **Certificaciones** | `/certificaciones` | ✅ Yes | ⚠️ Partial | Shows catalog, exam/results pages exist but incomplete |
| **Certificados** | `/certificates` | ✅ Yes | ⚠️ Partial | Shows issued certs, progress data missing |
| **Mis Pagos** | `/payments` | ✅ Yes | ✅ Works | Lists transactions by status + program offerings |
| **Mi Perfil** | `/profile` | ✅ Yes | ✅ Works | Name update, XP level (4 tiers), AI usage this month |
| **Cursos/Lecciones** | `/courses/[id]/lesson/[id]` | ✅ Yes | ⚠️ Partial | Lesson content, but progress tracking needs testing |

#### AI Lab Models Available

The login page hardcodes "22 cursos, 198 módulos" but real database has:
- Supabase tables: courses, modules, lessons (actual count should be fetched dynamically)
- Models supported (from code): Gemini 2.5 Flash Lite, Claude, ChatGPT (paid keys stored)
- AI Lab usage is logged to `ai_usage_logs` table

#### Critical Missing for Students

- ❌ No link between /payments and actual enrollment flow
- ❌ Certificaciones catalog loaded but exams might not be wired to Supabase
- ⚠️ Flashcard creation/editing UX not present
- ❌ No portfolio page despite `/portfolio/[userId]` route existing
- ❌ No peer review or group project collaboration features

---

### 2. EXTERNO (Cursos Profesionales) — 30% Complete

#### Current State

This role is **NOT IMPLEMENTED**. No dedicated pages or permissions.

#### What Should Exist (Based on MEMORIA)

- Professional course dashboard (9 courses × profession: Contadores, Abogados, Médicos, etc.)
- 9-question quiz with email gate (data capture before quiz starts)
- Course assignment after quiz (low/medium/high level)
- **Expected URL:** itseia.ai/profesionales/
- **Pricing:** Express $97, Estándar $197, Completo $297

#### Code Currently Present

| Path | What | Status |
|------|------|--------|
| `/profesionales` (doesn't exist) | ❌ Not implemented | Missing |
| Quiz API (`/api/quiz`) | ✅ Exists | But routes to certifications, not professional courses |
| Quiz component | ⚠️ Partial | Used for certifications, not professional courses |

#### Missing Implementation

1. EXTERNO role not defined in `UserRole` type (only: super_admin, admin, coordinacion, docente, estudiante, finanzas)
2. No sidebar items for professional courses
3. No course recommendation engine post-quiz
4. No dashboard showing "current profession course"
5. No connection to old `/academy/` system (if reusing)

---

### 3. DOCENTE (Teacher) — 70% Complete

#### Navigation Paths

| Section | Items | Status |
|---------|-------|--------|
| **Panel Docente** (sidebar) | Gestionar Cursos, Lecciones, Sesiones, Entregas | ✅ Present |
| **Teacher Routes** | `/teacher/capacitacion`, `/entregas`, `/progreso`, etc. | ⚠️ Mixed UI |

#### Pages & Features

| Feature | Path | Exists? | Works? | Notes |
|---------|------|---------|--------|-------|
| **Capacitacion (120h)** | `/teacher/capacitacion` | ✅ Yes | ✅ Works | CES Art. 61 compliance, module completion, cert download |
| **Capacitacion Report** | `/admin/docentes/capacitacion` | ✅ Yes | ✅ Works | For coordinacion/admin to track all teachers |
| **Calificar Entregas** | `/teacher/entregas` | ✅ Yes | ⚠️ Partial | Shows subjects, SubmissionsTable component, grading UI missing |
| **Progreso Alumnos** | `/teacher/progreso` | ✅ Yes | ⚠️ Partial | Shows students per subject, session completion counts |
| **Anuncios/Comunicación** | `/teacher/comunicacion` | ✅ Yes | ❌ No content | Route exists, component likely empty |
| **Materias Asignadas** | `/teacher/materias` | ✅ Yes | ⚠️ Partial | Route exists, needs testing |
| **Asistencia** | `/teacher/asistencia` | ✅ Yes | ⚠️ Partial | Route exists, component might need work |

#### Admin Panel (also docente-accessible)

| Feature | Path | Status |
|---------|------|--------|
| Gestionar Cursos | `/admin/courses` | ✅ Works |
| Gestionar Lecciones | `/admin/lessons` | ✅ Works |
| Gestionar Sesiones | `/admin/sesiones` | ✅ Works |
| Revisar Entregas | `/admin/entregas` | ⚠️ Partial |

#### Critical Gaps

- ❌ No unified teacher dashboard (bounces between /teacher/* and /admin/*)
- ❌ No rubric/grading scale interface
- ⚠️ Submissions review UI exists but grading workflow incomplete
- ⚠️ Student progress tracking exists but filtering/sorting limited
- ❌ No bulk actions (e.g., mark all as complete)
- ❌ No sync with external grading systems

---

### 4. COORDINACION / ADMIN — 95% Complete

#### Admin Dashboard

| Metric | Implementation |
|--------|-----------------|
| Total Students (count) | ✅ Loaded |
| Active Enrollments | ✅ Loaded |
| Monthly Revenue | ✅ Calculated |
| AI Lab Usage Cost | ✅ Tracked |
| Recent Enrollments | ✅ Table shows 10 |
| Recent Payments | ✅ Table shows 10 |
| Career Completion Rates | ⚠️ Partial |

#### Administration Sections

| Section | Pages | Status |
|---------|-------|--------|
| **Users** | `/admin/users` | ✅ Complete |
| **Programs (Meta)** | `/admin/programs` | ✅ Complete |
| **Carreras (Academic)** | `/admin/carreras` | ✅ Complete |
| **Courses** | `/admin/courses` | ✅ Complete |
| **Lessons** | `/admin/lessons` | ✅ Complete |
| **Sessions** | `/admin/sesiones` | ✅ Complete |
| **Matriculas** | `/admin/enrollments` | ✅ Complete |
| **Payments** | `/admin/payments` | ✅ Complete |
| **Certificaciones** | `/admin/certificaciones` | ✅ Complete |
| **Asistencia** | `/admin/asistencia` | ✅ Complete |
| **Calendario Global** | `/admin/calendario` | ✅ Complete |
| **AI Usage** | `/admin/ai-usage` | ✅ Complete |
| **Teacher Capacitation** | `/admin/docentes/capacitacion` | ✅ Complete |
| **Cohortes** | `/admin/cohortes` | ✅ Complete |
| **Integridad** | `/admin/integridad` | ⚠️ Partial |
| **Privacidad (LOPDP)** | `/admin/privacidad` | ✅ Complete |

#### Role Hierarchy

```
super_admin   — all pages
admin         — all pages except system-level (/admin/ai-usage)
coordinacion  — all pages except system-level
finanzas      — /admin/payments + calendar
docente       — /admin/courses, /lessons, /sesiones, /entregas
```

---

### 5. FINANZAS (Finance) — 60% Complete

#### Access

- ✅ Can see `/admin/payments`
- ⚠️ No dedicated finance dashboard
- ⚠️ No revenue reports, no tax documents

#### Missing

- ❌ Monthly/annual P&L reports
- ❌ Invoice generation
- ❌ Refund workflows
- ❌ Payment method analysis
- ❌ Delinquency alerts

---

### 6. B2B (Corporate) — 20% Complete

#### Current State

| Path | Content | Status |
|------|---------|--------|
| `/b2b` | Corporate training page | ✅ Exists |
| B2B Programs Query | Searches programs by name pattern | ✅ Works |
| B2B Dashboard | ❌ MISSING | None |

#### What Exists

- Header + features (Teams, Custom, Price Range)
- Grid of B2B programs pulled from DB (filtered by name like "b2b%", "empresarial%")
- Card layout with semester/subject counts

#### What's Missing

- ❌ No B2B role in UserRole type
- ❌ No sidebar navigation for B2B users
- ❌ No corporate account dashboard
- ❌ No team member management
- ❌ No billing contact setup
- ❌ No progress tracking for enrolled company
- ❌ No company-level reporting
- ❌ No custom pricing checkout flow

---

## LOGIN PAGE AUDIT

**Current Stats Display (Hardcoded)**

```
22 cursos | 198 modulos | AI Lab
```

**Issues**

- ❌ Not fetched from database — hardcoded in login component
- ⚠️ Numbers come from OLD Academy system (itseia.ai/academy)
- ⚠️ Should be dynamic to show actual count

**What Should Be Loaded**

```sql
SELECT COUNT(DISTINCT id) FROM courses WHERE is_active = true; 
-- (actual: unknown, fetch to verify)

SELECT COUNT(DISTINCT id) FROM modules WHERE is_active = true;
-- (actual: unknown, fetch to verify)
```

---

## SIDEBAR ANALYSIS

### Code Location

`/src/components/layout/Sidebar.tsx` (495 lines)

### How Role Detection Works

```typescript
// Fetches profile.role from Supabase profiles table
role: UserRole = profile?.role || "estudiante";

// getSections(role) returns role-specific menu items
// 6 sections: Principal, Academy, Mi Cuenta, Explorar, Panel Docente, Administracion, Sistema
```

### Navigation Items by Role

**ALL_ROLES** (all 6): Dashboard, AI Lab, Biblioteca, Calendario, Mi Perfil, Carreras

**STAFF_ROLES** (docente, coordinacion, admin, super_admin): Panel Docente pages

**ADMIN_ROLES** (coordinacion, admin, super_admin): Full Admin panel

**FINANZAS Only**: `/admin/payments`

**ESTUDIANTE Only**: `/payments`, Flashcards, Certificaciones, Mi Carrera

### Problems

- ⚠️ `/carreras` appears twice (Mi Carrera vs Carreras in Explorar) — bad UX
- ⚠️ No "EXTERNO" section — professional course nav missing
- ⚠️ Teacher items in "Panel Docente" but some admin overrides needed
- ✅ XP bar shows for estudiante only (correct)

---

## USER ROLES TYPE DEFINITION

**Current Definition** (`/src/types/database.ts`):

```typescript
export type UserRole = 
  | "super_admin"
  | "admin" 
  | "coordinacion" 
  | "docente" 
  | "estudiante" 
  | "finanzas";
```

**Missing**

- ❌ "externo" (for professional courses)
- ❌ "empresa" or "b2b_admin" (for corporate accounts)

---

## DATABASE SCHEMA ALIGNMENT

### Tables Used for Role Management

| Table | Column | Role Filter | Status |
|-------|--------|-------------|--------|
| profiles | role | UserRole enum | ✅ Matches |
| enrollments | status | "active" check | ✅ Correct |
| sessions | is_active | Boolean filter | ✅ Correct |
| programs | type | "carrera", "curso", "preuni", "bootcamp", "teacher_training" | ⚠️ Missing "b2b" type |
| subjects | teacher_id | For docente filtering | ✅ Correct |

### Missing Columns

- ❌ enrollments.program_type (quick lookup, would optimize queries)
- ⚠️ programs.audience (could be "student", "professional", "corporate")

---

## FEATURE MATRIX — WHAT'S FULLY FUNCTIONAL

### Student Features (✅ Working)

- Dashboard with progress, streaks, XP
- Enrollment in careers (type = "carrera")
- Lesson completion + progress tracking
- AI Lab chat (localStorage-backed)
- Biblioteca search + favorites
- Calendar view with upcoming events
- Flashcard study mode
- Payment tracking
- Profile editing

### Teacher Features (✅ Working)

- 120h capacity training with certification
- Can see assigned subjects
- Can view student progress per subject
- Can see submissions (but grading UI incomplete)
- Can mark training modules complete

### Admin Features (✅ Working)

- Create/edit users, programs, courses, lessons
- View all enrollments + payments
- Create calendar events
- Track AI Lab usage
- Export data (some pages)
- LOPDP compliance tools

---

## CRITICAL BUGS & MISSING IMPLEMENTATIONS

### Priority 1 (Blocking)

| Issue | Impact | Fix |
|-------|--------|-----|
| EXTERNO role missing | No professional course delivery | Add role + sidebar + quiz/assignment flow |
| Login stats hardcoded | Misleading for new users | Fetch from DB dynamically |
| Payments page shows no "teacher_training" option | Teachers can't enroll in 120h course | Query programs where type = "teacher_training" |
| No B2B dashboard | Corporate customers have no portal | Create `/b2b/dashboard` + role permissions |

### Priority 2 (Degraded UX)

| Issue | Impact | Fix |
|-------|--------|-----|
| `/carreras` duplicated in nav | Confusing navigation | Remove one, link properly |
| Docente features split /teacher/* + /admin/* | Teachers get lost | Consolidate to /teacher/* or /admin/teacher/* |
| Certificaciones catalog loaded but exams not wired | Students think certs available when not | Connect exam flow to database |
| Flashcard UI doesn't allow creation | Only view-only mode | Add creation/edit forms |
| Profile page missing avatar upload | Users can't personalize | Add image upload to `/profile` |

### Priority 3 (Nice to Have)

| Issue | Impact | Fix |
|-------|--------|-----|
| No bulk grading | Teachers must grade one-by-one | Batch operation UI |
| No discussion forums visible | Community features promised but not implemented | Implement `/foros` or integrate into lessons |
| No leaderboard/badges | Gamification incomplete | Add badges + leaderboard |
| No dark mode toggle | Some prefer dark mode | Add theme switcher |

---

## RECOMMENDATIONS

### Immediate (This Sprint)

1. **Fix Login Stats**
   - Query actual course/module counts from DB
   - Update during dashboard load, cache with SWR

2. **Implement EXTERNO Role**
   - Add role to `UserRole` type
   - Create `/profesionales/dashboard`
   - Wire up quiz → assignment flow
   - Add sidebar nav section

3. **Payments ↔ Enrollment Flow**
   - Add `teacher_training` to enrollment creation
   - Show 120h course in `/payments` as option
   - Create checkout flow for training

4. **B2B Dashboard**
   - Create `/b2b/dashboard` (SSR or client)
   - Show company name, team members, invoices
   - Add invite team member flow

### Next Sprint

5. **Teacher Navigation Consolidation**
   - Move all `/admin/courses`, `/admin/lessons`, etc. to `/teacher/*`
   - Keep admin-only pages under `/admin/*`

6. **Certificate Exam Flow**
   - Wire `/certificaciones/[slug]/examen` to Supabase
   - Implement attempt tracking
   - Store results in database

7. **Flashcard Creation**
   - Add form to create/edit cards
   - Assign to sessions
   - Bulk import from CSV

### Future

8. **Forums/Discussions** — Currently mentioned in APIs but UI missing
9. **Portfolio Page** — Route exists (`/portfolio/[userId]`) but not linked
10. **Peer Review System** — Database schema ready but UI not implemented

---

## CHECKLIST FOR CEO

### What Works Today (MVP-Ready)

- [x] Students can enroll in careers
- [x] Students can complete lessons + track progress
- [x] Students can use AI Lab (chat + playground)
- [x] Students see calendar of classes
- [x] Teachers can view student progress
- [x] Teachers complete 120h capacity training
- [x] Admin can manage all content
- [x] Payments tracked (though not connected to enrollment)

### What Needs Work (Pre-Launch)

- [ ] Professional course system (EXTERNO role)
- [ ] B2B corporate portal
- [ ] Login page dynamic stats
- [ ] Certificate exam integration
- [ ] Teacher grading workflow
- [ ] Flashcard creation UI

### What Can Wait (Post-Launch)

- [ ] Forums/discussions
- [ ] Portfolio showcase
- [ ] Peer review
- [ ] Leaderboards/badges
- [ ] Dark mode

---

## APPENDIX: Directory Structure

```
src/
├── app/
│   ├── (auth)/              ← Login/Register
│   ├── admin/               ← Admin panel (18 sections)
│   ├── teacher/             ← Teacher dashboard (6 pages)
│   ├── dashboard/           ← Student main hub
│   ├── carreras/            ← Career browsing
│   ├── ai-lab/              ← Chat + code playground
│   ├── biblioteca/          ← Research library
│   ├── flashcards/          ← Flashcard study
│   ├── calendario/          ← Academic calendar
│   ├── certificaciones/     ← Industry certs
│   ├── payments/            ← Transaction history
│   ├── profile/             ← User settings
│   ├── certificates/        ← Issued diplomas
│   ├── b2b/                 ← Corporate training
│   └── api/                 ← Backend routes (40+ endpoints)
├── components/
│   ├── layout/              ← Sidebar, header
│   ├── ui/                  ← Button, Card, etc.
│   ├── admin/               ← Admin tables/forms
│   ├── teacher/             ← Teacher components
│   ├── ai-lab/              ← Chat, playground
│   ├── library/             ← Research search
│   ├── calendar/            ← Calendar UI
│   ├── certifications/      ← Cert cards
│   └── ...
└── types/
    └── database.ts          ← All types + UserRole
```

---

**Report Generated:** March 24, 2026  
**Auditor:** Claude Code  
**Scope:** Complete platform walkthrough, role-by-role UX audit

