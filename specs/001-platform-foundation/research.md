# Research: ITSEIA Platform Foundation

## Decision 1: Single web app instead of separate marketing and admin projects

- **Decision**: Implement one Next.js application with route groups for marketing, auth, admin,
  student and teacher.
- **Why**: ITSEIA necesita velocidad, consistencia visual y una sola fuente de verdad para
  sesiones, usuarios y permisos.
- **Rejected alternative**: Separar sitio publico y panel en proyectos distintos.
- **Reason rejected**: Aumenta complejidad operativa antes de validar el MVP y duplica esfuerzo de
  autenticacion, despliegue y mantenimiento.

## Decision 2: Supabase as the first system of record

- **Decision**: Usar Supabase para auth, base relacional, storage y control de acceso a nivel de
  datos.
- **Why**: Permite construir rapido con un backend confiable y suficiente para el volumen inicial
  del instituto.
- **Rejected alternative**: Backend custom desde cero con API independiente.
- **Reason rejected**: No agrega valor suficiente en Fase 0 y Fase 1 frente al tiempo y complejidad
  extra.

## Decision 3: Build custom admissions and admin foundation before custom LMS depth

- **Decision**: El MVP implementa sitio publico, admisiones, catalogo academico, roles y
  dashboards base; no implementa campus virtual completo.
- **Why**: Eso cubre apertura institucional, operacion minima y base del producto compartido.
- **Rejected alternative**: Construir primero tareas, notas, evaluaciones, videoclases y AI Lab.
- **Reason rejected**: Es una expansion temprana que puede retrasar el lanzamiento y dispersar el
  foco.

## Decision 4: Role assignments instead of a single role field per user

- **Decision**: Modelar roles como asignaciones versionables ligadas a personas.
- **Why**: Una persona podria evolucionar de lead a postulante, estudiante, docente o admin.
- **Rejected alternative**: Guardar un unico rol plano por usuario.
- **Reason rejected**: Limita flexibilidad institucional y complica transiciones operativas.

## Decision 5: Public content and institutional facts remain documentation-driven

- **Decision**: Mantener `docs/contexto/` y los specs como fuente durable de decisiones antes de
  convertirlas a pantallas y tablas.
- **Why**: El instituto parte desde documentacion regulatoria y academica; el software debe nacer
  alineado a esa realidad.
- **Rejected alternative**: Modelar producto directamente desde pantallas y prompts ad hoc.
- **Reason rejected**: Aumenta riesgo de contradiccion con la informacion institucional validada.
