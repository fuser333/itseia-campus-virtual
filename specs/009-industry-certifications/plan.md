# Implementation Plan: Modulo de Certificaciones de Industria

**Branch**: `009-industry-certifications` | **Date**: 2026-03-22 | **Spec**: [spec.md](./spec.md)

## Summary

Construir el modulo de certificaciones de industria sobre la infraestructura existente de
sesiones con 7 tabs de la plataforma ITSEIA. Un estudiante matriculado puede navegar un
catalogo de certificaciones internacionales (AWS, Google TensorFlow, Azure AI-900, GitHub
Copilot, Google Data Analytics), estudiar usando la misma estructura pedagogica de los
programas formales, practicar con un simulacro cronometrado, y ver el logro reflejado en su
portfolio. El modulo reutiliza las entidades `programs`, `subjects`, `sessions` con
`type="certificacion"` e introduce nuevas tablas para el banco de preguntas, intentos de
examen y badges de portfolio.

## Technical Context

**Language/Version**: TypeScript 5.x
**Framework**: Next.js 15 App Router — app existente en `apps/web/`
**CSS**: Tailwind CSS 4 + shadcn/ui
**DB**: Supabase PostgreSQL + RLS activo
**Auth**: Supabase Auth (operativo)
**Deploy**: Vercel (tecnologico.itseia.ai)
**Dependencias nuevas**: ninguna — reutiliza estructura existente de 7 tabs
**Dependencias externas**: ninguna — examen oficial lo aplica el proveedor externo

**Paginas existentes relevantes**:
- `apps/web/src/app/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx` — estructura
  de 7 tabs ya operativa; las sesiones de certificacion la reutilizan directamente
- `apps/web/src/components/session/QuizEngine.tsx` — motor de quiz existente; ExamSimulator
  lo envuelve con restricciones de modo examen
- `apps/web/src/components/session/AILabPanel.tsx` — el tab AI Lab ya acepta un prompt
  contextual; solo se parametriza para certificaciones
- `apps/web/src/app/portfolio/[userId]/page.tsx` — pagina de portfolio existente donde
  aparecen los badges de certificacion
- `apps/web/src/app/admin/sesiones/page.tsx` — panel admin base para extender con reporte
- `apps/web/src/types/database.ts` — tipos a extender con las entidades nuevas

## Constitution Check

1. **Problema institucional**: La combinacion titulo SENESCYT + certificaciones
   internacionales (AWS, Google, Azure) es el argumento de venta diferenciador de ITSEIA
   frente a universidades tradicionales. Mapeado en la Vision CEO (2026-03-22) y en el
   analisis de brecha de talento 10:1 de `docs/contexto/`. Fase 4 del roadmap: Diferenciacion
   ITSEIA.
2. **Roles afectados**: estudiante (navega catalogo, estudia, rinde simulacro, ve portfolio);
   coordinacion academica / admin (ve progreso agregado, exporta reporte, gestiona estado de
   certificaciones); docente (crea/edita contenido de sesiones de certificacion, igual que en
   programas formales).
3. **Datos, permisos y riesgos**: nuevas tablas `certification_programs`,
   `certification_domains`, `certification_enrollments`, `exam_questions`, `exam_attempts`,
   `certification_badges` con RLS estricto por `user_id` para datos de estudiante. Riesgo de
   propiedad intelectual: el banco de preguntas debe ser elaborado por docentes ITSEIA basado
   en objetivos oficiales publicos, no preguntas filtradas de examenes reales. Riesgo: un
   estudiante sube un certificado falso — el admin valida manualmente antes de cambiar estado
   (no hay validacion automatica con APIs de proveedor en Fase 4).
4. **Verificacion de exito**: smoke test de flujo completo — estudiante encuentra AWS Cloud
   Practitioner en catalogo, entra a la primera sesion del primer dominio con los 7 tabs
   cargados, rinde un simulacro y ve el badge en su portfolio. Test de permisos: estudiante
   sin matricula activa en ningun programa no puede iniciar una certificacion (FR-001 limita
   acceso a matriculados).
5. **Slice minimo util**: catalogo visible + una certificacion con al menos 3 dominios y 2
   sesiones por dominio con 7 tabs + modo examen funcional con banco de preguntas. Portfolio
   y reporte admin completan el valor pero no bloquean el flujo principal.
6. **CES Compliance (Principio VI)**: las certificaciones son formacion continua (no programa
   formal CES). Aplican requisitos reducidos mientras el expediente CES esta en proceso. No
   se emiten creditos academicos formales ni certificados con firma digital SENESCYT en esta
   fase.
7. **AI-First (Principio VII)**: el tab AI Lab de cada sesion de certificacion se inicializa
   con un prompt contextual de la certificacion y el dominio especifico (FR-014), potenciando
   la preparacion con IA. Examen oficial sigue siendo externo — cumple el mandato de no
   reinventar lo que el proveedor ya ofrece.
8. **Calidad de contenido (Principio VIII)**: cada sesion de certificacion DEBE tener los 7
   tabs antes de marcarse como completa. La primera certificacion (AWS Cloud Practitioner)
   funciona como piloto aprobado por el CEO antes de escalar a las otras 4.

## Project Structure

### Documentacion

```text
specs/009-industry-certifications/
├── plan.md          (este archivo)
└── spec.md
```

### Codigo fuente — archivos nuevos

```text
apps/web/src/
├── app/
│   ├── certificaciones/
│   │   ├── page.tsx                              — Catalogo de certificaciones (US1)
│   │   └── [slug]/
│   │       ├── page.tsx                          — Detalle de certificacion + lista de dominios
│   │       ├── examen/
│   │       │   └── page.tsx                      — Modo examen (US2)
│   │       └── resultados/[attemptId]/
│   │           └── page.tsx                      — Resultados del simulacro (US2)
│   ├── api/
│   │   └── certifications/
│   │       ├── enroll/route.ts                   — POST: registrar inicio de certificacion
│   │       ├── exam/start/route.ts               — POST: crear intento de examen
│   │       ├── exam/[attemptId]/submit/route.ts  — POST: enviar respuestas y calcular puntaje
│   │       └── badge/validate/route.ts           — POST: admin valida certificado oficial
│   └── admin/
│       └── certificaciones/
│           └── page.tsx                          — Reporte de progreso por certificacion (US3)
├── components/
│   └── certifications/
│       ├── CertificationCatalog.tsx              — Grid de tarjetas de certificacion
│       ├── CertificationCard.tsx                 — Tarjeta individual (logo, nivel, dominios)
│       ├── DomainList.tsx                        — Lista de dominios como acordeon
│       ├── ExamSimulator.tsx                     — QuizEngine con modo examen estricto
│       ├── ExamResultsSummary.tsx                — Puntaje total, por dominio, respuestas
│       ├── ExamHistoryChart.tsx                  — Grafico de evolucion de simulacros
│       └── CertificationBadge.tsx                — Badge para portfolio/perfil del estudiante
└── features/
    └── certifications/
        ├── actions.ts                            — Server Actions: enrollCertification,
        │                                           startExam, submitExam, validateBadge
        └── queries.ts                            — Consultas: getCatalog, getCertification,
                                                    getExamQuestions, getStudentProgress
```

### Codigo fuente — archivos modificados

```text
apps/web/src/
├── app/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx
│     — detectar si la sesion pertenece a un programa tipo "certificacion" para ajustar
│       el breadcrumb y el prompt del AI Lab con contexto de certificacion
├── app/portfolio/[userId]/page.tsx
│     — agregar seccion "Certificaciones" que muestra CertificationBadge por cada badge
│       en estado simulacro_aprobado o certificado_oficial
├── app/admin/sesiones/page.tsx  (o nuevo admin/certificaciones/page.tsx independiente)
│     — link de navegacion hacia el nuevo reporte de certificaciones
└── types/database.ts
      — agregar tipos CertificationProgram, CertificationDomain, CertificationEnrollment,
        ExamQuestion, ExamAttempt, CertificationBadge
```

### Base de datos — migraciones nuevas

```text
supabase/migrations/
└── 20260322_009_industry_certifications.sql
    — CREATE TABLE certification_programs
      (id, slug, nombre, proveedor, logo_url, nivel_dificultad, costo_examen_usd,
       duracion_horas_estimada, umbral_aprobacion_porcentaje, idioma_examen,
       estado: activa/actualizacion_pendiente/archivada, created_at)
    — CREATE TABLE certification_domains
      (id, certification_id FK, nombre, descripcion, porcentaje_en_examen, orden)
    — CREATE TABLE certification_sessions
      (id, domain_id FK, session_id FK — reutiliza sessions existentes, orden)
    — CREATE TABLE certification_enrollments
      (id, user_id FK, certification_id FK, started_at, last_accessed_at)
      UNIQUE (user_id, certification_id)
    — CREATE TABLE exam_questions
      (id, certification_id FK, domain_id FK, enunciado, opciones JSONB,
       respuesta_correcta, explicacion, idioma, activa boolean, created_at)
    — CREATE TABLE exam_attempts
      (id, user_id FK, certification_id FK, started_at, finished_at,
       score_total integer, score_por_dominio JSONB, aprobado boolean,
       respuestas JSONB, created_at)
    — CREATE TABLE certification_badges
      (id, user_id FK, certification_id FK,
       estado: simulacro_aprobado/certificado_oficial,
       evidencia_url, validado_por FK users, validado_at, created_at)
    — RLS: estudiante lee/escribe solo sus propias filas en enrollments, attempts, badges
    — RLS: admin y coordinacion leen todas las filas para reportes
    — RLS: exam_questions es de lectura para estudiantes matriculados, escritura solo admin/docente
    — INDEX: certification_enrollments(user_id, certification_id)
    — INDEX: exam_attempts(user_id, certification_id, created_at)
    — INDEX: exam_questions(certification_id, domain_id) WHERE activa = true
```

## Implementation Phases

### Phase A: Modelo de datos y contenido semilla

**Objetivo**: tablas operativas en Supabase con AWS Cloud Practitioner cargado como primera
certificacion. Sin UI todavia.

- Crear migracion `20260322_009_industry_certifications.sql` con las 7 tablas, RLS e indices.
- Extender `apps/web/src/types/database.ts` con los 6 nuevos tipos.
- Insertar datos semilla en la migracion o en un script separado:
  - `certification_programs`: AWS Cloud Practitioner (6 dominios, umbral 70%, ingles).
  - `certification_domains`: los 6 dominios oficiales de AWS CCP con su porcentaje en examen.
  - Vincular sesiones academicas existentes o crear nuevas con `type="certificacion"` para
    los dominios. Minimo 2 sesiones por dominio para cumplir SC-007.
- Implementar `features/certifications/queries.ts`: `getCatalog()`, `getCertification(slug)`,
  `getStudentProgress(userId, certificationId)`, `getExamQuestions(certificationId, limit, randomize)`.
- Implementar `features/certifications/actions.ts`: `enrollCertification(certificationId)`,
  `startExam(certificationId)`, `submitExam(attemptId, respuestas)`, `validateBadge(badgeId)`.

### Phase B: Catalogo y flujo de estudio

**Objetivo**: estudiante puede navegar el catalogo, abrir una certificacion y estudiar sus
sesiones con los 7 tabs.

- Implementar `app/certificaciones/page.tsx` con `CertificationCatalog.tsx`:
  - Grid de tarjetas con logo del proveedor, nivel de dificultad (chips de color), costo
    del examen oficial, numero de dominios, estado de la certificacion.
  - Filtros por proveedor (AWS / Google / Microsoft / GitHub).
  - Si el estudiante ya inicio la certificacion, mostrar barra de progreso en la tarjeta.
- Implementar `app/certificaciones/[slug]/page.tsx`:
  - Header con nombre, proveedor, descripcion, stats (dominios, sesiones, horas estimadas,
    costo examen, umbral aprobacion, idioma examen).
  - `DomainList.tsx`: acordeon por dominio con lista de sesiones y su estado de completitud.
  - Boton "Iniciar preparacion" (si no esta matriculado) o "Continuar" (si ya inicio).
  - Boton "Modo Examen" accesible siempre (no requiere completar todos los dominios).
  - Indicador de estado de la certificacion: Activa / Actualizacion pendiente / Archivada.
- Modificar `app/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx`:
  - Detectar `program.type === "certificacion"` en el contexto de la sesion.
  - Cuando sea certificacion: ajustar breadcrumb a "Certificaciones > [cert] > [dominio]".
  - Pasar al `AILabPanel` el prompt contextual: "Estoy preparando el examen [cert], dominio
    [dominio]. Ayudame con los conceptos de esta sesion."
- Implementar `POST /api/certifications/enroll/route.ts`: inserta en
  `certification_enrollments` con idempotencia (UPSERT), retorna enrollment existente si ya
  habia uno.

### Phase C: Modo Examen (ExamSimulator)

**Objetivo**: estudiante puede rendir un simulacro cronometrado con las restricciones del
examen oficial y ver sus resultados con retroalimentacion completa.

- Implementar `components/certifications/ExamSimulator.tsx`:
  - Envuelve `QuizEngine.tsx` existente con comportamiento de modo examen:
    - Preguntas aleatorias del banco (usando Fisher-Yates shuffle en el servidor via la
      Server Action `startExam`).
    - Temporizador regresivo visible en la barra superior; al llegar a 0 envia automaticamente.
    - Navegacion secuencial: el boton "Atras" esta deshabilitado una vez avanzada la pregunta.
    - Sin feedback inmediato por pregunta (el resultado aparece solo al finalizar).
    - Barra de progreso: "Pregunta X de N".
  - Pantalla de inicio (reglas): numero de preguntas, tiempo limite, advertencia de no retroceder.
  - Al finalizar: llama `submitExam` con todas las respuestas.
- Implementar `app/certificaciones/[slug]/examen/page.tsx`: renderiza `ExamSimulator`,
  verifica que el estudiante este autenticado y matriculado.
- Implementar `POST /api/certifications/exam/start/route.ts`: selecciona N preguntas
  aleatorias del banco, crea fila en `exam_attempts` con `started_at`, retorna las preguntas
  sin indicar cual es la respuesta correcta.
- Implementar `POST /api/certifications/exam/[attemptId]/submit/route.ts`:
  - Calcula `score_total` y `score_por_dominio` comparando respuestas del estudiante con
    `respuesta_correcta` de cada pregunta.
  - Marca `aprobado = score_total >= umbral_aprobacion_porcentaje`.
  - Si `aprobado = true`, inserta o actualiza `certification_badges` con estado
    `simulacro_aprobado` via UPSERT.
  - Retorna attempt completo con respuestas correctas e incorrectas y explicaciones para
    cada pregunta.
- Implementar `app/certificaciones/[slug]/resultados/[attemptId]/page.tsx` con
  `ExamResultsSummary.tsx`:
  - Puntaje total (grande, color segun aprueba/no aprueba vs umbral).
  - Puntaje por dominio en tabla o barras horizontales.
  - Lista de preguntas: enunciado, respuesta del estudiante (verde/rojo), respuesta correcta
    y explicacion.
  - Boton "Volver a intentar" y boton "Ver mi progreso".
- Implementar `ExamHistoryChart.tsx`: linea de tiempo con puntaje de cada intento previo;
  usa datos de `exam_attempts` del estudiante para esa certificacion.

### Phase D: Portfolio y reporte admin

**Objetivo**: el logro es visible en el portfolio del estudiante y el admin puede generar
reportes para relaciones B2B con empleadores.

- Implementar `components/certifications/CertificationBadge.tsx`:
  - Tarjeta compacta con logo del proveedor, nombre de la certificacion, chip de estado
    (`simulacro_aprobado` en amarillo, `certificado_oficial` en verde).
  - En estado `certificado_oficial`: muestra fecha de validacion.
  - Flujo de subida de evidencia: boton "Subir certificado oficial" que abre un file picker,
    sube el archivo a Supabase Storage en bucket `certification-evidence`, inserta URL en
    `certification_badges.evidencia_url` con estado pendiente de validacion admin.
- Modificar `app/portfolio/[userId]/page.tsx`: agregar seccion "Certificaciones" que fetcha
  `certification_badges` del usuario y renderiza una cuadricula de `CertificationBadge`.
  La seccion es visible publicamente (sin autenticacion) — solo se muestran badges validados.
- Implementar `app/admin/certificaciones/page.tsx`:
  - Tabla por certificacion: nombre, estudiantes activos (COUNT enrollments), progreso
    promedio (AVG de sesiones completadas / total sesiones), simulacros aprobados (COUNT
    donde `aprobado = true`).
  - Boton "Ver detalle" por certificacion: tabla de estudiantes con nombre, progreso
    individual, ultimo simulacro, puntaje.
  - Boton "Exportar CSV" con los mismos datos via `Blob + URL.createObjectURL`.
  - Boton "Marcar como Actualizacion pendiente" / "Archivar" por certificacion: llama
    Server Action que actualiza `certification_programs.estado`.
- Implementar `POST /api/certifications/badge/validate/route.ts`: solo admin — actualiza
  `certification_badges.estado` a `certificado_oficial` con `validado_por` y `validado_at`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Tabla `exam_questions` separada (no reutiliza QuizEngine questions) | El banco de examen necesita: aleatorizado por dominio, bilingue, campo `activa` para deprecar sin borrar, y explicacion por pregunta. El QuizEngine existente tiene preguntas embebidas en el JSON de la sesion, no en una tabla relacional consultable. | Embeber preguntas en sesiones no permite aleatorizar a nivel de certificacion ni cruzar multiples sesiones para un examen de 65 preguntas |
| Server Action `submitExam` calcula score en servidor | Calcular el puntaje en cliente expone las respuestas correctas antes de que el estudiante termine. Riesgo de fraude. | No hay alternativa del lado del cliente que no exponga las respuestas en el payload inicial |
| Supabase Storage para evidencias de certificado | El admin necesita acceder al documento para validarlo manualmente. Un enlace externo (Google Drive del estudiante) no es confiable ni auditable. | Almacenamiento externo no controlado no cumple la auditabilidad requerida |

## Risks and Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Banco de preguntas vacio en lanzamiento (D3: minimo 100 preguntas por cert) | Alta | Alto | Bloquear acceso a "Modo Examen" si `COUNT(exam_questions WHERE certification_id AND activa) < 20`; mostrar "Simulacro disponible proximamente" |
| Proveedor (AWS/Google) cambia el dominio de objetivos — contenido obsoleto | Media | Medio | Estado `actualizacion_pendiente` en `certification_programs` permite advertir a estudiantes sin bloquear acceso; admin es responsable de mantener el estado actualizado |
| RLS mal configurado — estudiante ve preguntas de examen en otro contexto | Baja | Critico | El endpoint `start/route.ts` retorna preguntas SIN el campo `respuesta_correcta`; solo `submit` compara con la respuesta correcta en servidor |
| Estudiante sube certificado falso y el admin no lo valida a tiempo | Media | Bajo | Badge en portfolio solo muestra `certificado_oficial` despues de validacion manual; hasta entonces muestra `simulacro_aprobado` (valido por ITSEIA, no por el proveedor) |

## Environment Variables Required

```bash
# No requiere nuevas variables de entorno
# Reutiliza NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY ya configuradas en Vercel
```
