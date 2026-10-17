# Data Model: ITSEIA Platform Foundation

## Core Entities

### Person

Registro canonico de cualquier individuo que interactua con la plataforma.

Suggested fields:

- id
- first_name
- last_name
- email
- phone
- document_id
- status
- created_at

### Lead

Captura inicial de interes comercial o academico.

Suggested fields:

- id
- person_id (optional at first capture)
- source
- interest_program_id
- message
- status
- created_at

### Applicant

Estado de una persona dentro del flujo de postulacion.

Suggested fields:

- id
- person_id
- program_id
- cohort_id (optional until assignment)
- application_status
- notes
- reviewed_by
- reviewed_at

### RoleAssignment

Relacion entre persona y rol institucional.

Suggested fields:

- id
- person_id
- role_code
- scope_type
- scope_id
- active_from
- active_until
- status

### Program

Carrera ofertada por ITSEIA.

Suggested fields:

- id
- slug
- name
- title_awarded
- duration_periods
- total_credits
- total_hours
- modality
- campus
- status

### AcademicPeriod

Periodo academico operativo.

Suggested fields:

- id
- name
- starts_on
- ends_on
- status

### Cohort

Grupo academico asociado a programa y periodo.

Suggested fields:

- id
- code
- program_id
- academic_period_id
- shift
- capacity
- status

### StudentProfile

Vista operativa del estudiante.

Suggested fields:

- id
- person_id
- student_code
- program_id
- cohort_id
- academic_status

### TeacherProfile

Vista operativa del docente.

Suggested fields:

- id
- person_id
- teacher_code
- specialty_area
- employment_status

## Relationships

- Person 1:N RoleAssignment
- Person 0:N Lead
- Person 0:N Applicant
- Program 1:N Cohort
- AcademicPeriod 1:N Cohort
- Person 0:1 StudentProfile
- Person 0:1 TeacherProfile
- StudentProfile N:1 Program
- StudentProfile N:1 Cohort
- Applicant N:1 Program
- Applicant N:0..1 Cohort

## Modeling Notes

- `Person` debe existir antes que `StudentProfile` o `TeacherProfile`.
- `RoleAssignment` debe permitir multiples roles por persona.
- `Lead` y `Applicant` deben conservar historial de estados.
- `Program`, `AcademicPeriod` y `Cohort` forman el nucleo del catalogo academico inicial.
- Las futuras entidades de materias, tareas, notas y pagos se agregaran sobre este modelo sin
  romper el nucleo.
