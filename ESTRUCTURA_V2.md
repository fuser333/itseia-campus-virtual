# ESTRUCTURA V2 — ITSEIA Academy Online

**Fecha:** 24 marzo 2026
**Basada en:** ESTRUCTURA_COMPLETA.md (V1, 21 marzo)
**Principio:** Henry Ford — estandarizar antes de producir
**Ingeniero en Jefe:** CTO Claude Code
**Mesa Directiva:** CEO Héctor Velasco

---

## ECOSISTEMA (sin cambios de V1)

```
                    ┌─────────────────────┐
                    │  ITSEIA ACADEMY      │
                    │  tecnologico.itseia.ai│
                    └──────────┬──────────┘
                               │
        ┌──────────┬───────────┼───────────┬──────────┐
        │          │           │           │          │
   ┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐
   │Carreras ││Cursos   ││Preuni   ││Bootcamps││Corporate│
   │Online   ││Profes.  ││Online   ││3 meses  ││B2B      │
   │$220/mes ││$97-297  ││$180     ││$497     ││$2K-10K  │
   └────┬────┘└────┬────┘└────┬────┘└────┬────┘└────┬────┘
        │          │          │          │          │
        └──────────┴──────┬───┴──────────┴──────────┘
                          │
               GRADUADOS + CERTIFICACIONES
                     (AWS, Google, Azure)
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌─────────┐      ┌─────────┐      ┌─────────┐
   │  H3L    │      │ImagemIA │      │ Strata  │
   │7 paises │      │Salud IA │      │19 paises│
   └─────────┘      └─────────┘      └─────────┘
```

---

## ARQUITECTURA V2

### URLs (actualizado)
```
itseia.ai/                  → cPanel (web institucional)
itseia.ai/informacion/      → cPanel (landing de ventas V2)
itseia.ai/cursos/           → cPanel (landing cursos pro con 9 preguntas)
itseia.ai/demos/            → cPanel (demos IA interactivos)
itseia.ai/mallas/           → cPanel (mallas curriculares)
tecnologico.itseia.ai/      → Vercel (LA PLATAFORMA)
```

### Stack (sin cambios)
```
Next.js 15 + TypeScript + Tailwind 4 + shadcn/ui
Supabase Auth + PostgreSQL + Storage
Vercel deploy
Gemini API (tutor IA)
Daily.co (videoconferencia)
OpenAlex+arXiv+Scielo (biblioteca)
```

---

## ESQUELETO DE LA PLATAFORMA (estandarizado)

### Capa 1: Experiencia PÚBLICA (sin login)

```
HEADER PÚBLICO (siempre visible):
┌──────────────────────────────────────────────────────┐
│ [ITSEIA logo]  Inicio  Carreras  Catálogo  AI Lab    │
│                                    [Ingresar] [Inscr]│
└──────────────────────────────────────────────────────┘

PÁGINAS PÚBLICAS:
  /                    → Landing principal ("Aprende IA con IA incluida")
  /carreras            → Solo las 3 carreras (IA, CD, BD)
  /catalogo            → TODO: carreras + preuni + bootcamp + cursos pro
  /ai-lab              → Demo del AI Lab (limitado sin login)
  /certificaciones     → Catálogo de certificaciones industria
  /login               → Iniciar sesión
  /register            → Registrarse
  /privacidad          → Política LOPDP
```

### Capa 2: Experiencia LOGUEADA (con login)

**Regla:** Login → detecta rol → redirige a SU dashboard → ve SOLO su menú.

```
LAYOUT LOGUEADO:
┌──────────┬──────────────────────────────────────────┐
│          │ Breadcrumb: Inicio > Carrera > Materia > │
│ SIDEBAR  ├──────────────────────────────────────────┤
│ (por rol)│                                          │
│          │           CONTENIDO                      │
│ Se puede │           (cambia por página)             │
│ minimizar│                                          │
│ pero     │                                          │
│ NUNCA    │                                          │
│ desapare-│                                          │
│ ce       │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

---

## 4 MENÚS POR ROL

### ROL: ALUMNO (estudiante de carrera o preuni)

```
MI APRENDIZAJE
  📊 Dashboard                    ← Progreso, XP, próximas clases
  🎓 Mi Carrera                   ← IA/CD/BD (si inscrito)
     └→ Semestre 1 > Materias > Sesiones
  📚 Mi Preuniversitario          ← Si inscrito (4 semanas)
  📅 Calendario                   ← Clases, deadlines, tutorías
  📹 Clases en Vivo               ← Daily.co (CES 51% sincrónico)

HERRAMIENTAS
  🤖 AI Lab                       ← TODOS los modelos + playground + flashcards
  📖 Biblioteca                   ← OpenAlex + arXiv + Scielo
  🎴 Flashcards                   ← Generadas por IA
  🏆 Certificaciones              ← AWS, Google, Azure
  💬 Foros                         ← Por materia (CES asincrónico)

MI CUENTA
  💳 Pagos                        ← Estado de cuenta
  👤 Perfil                       ← Datos personales + LOPDP
  📜 Certificados                 ← Emitidos
  🎒 Portafolio                   ← Mis proyectos

───── Estado: 85% construido ─────
Falta: Tutorías UI, Foros en menú
```

### ROL: EXTERNO (cursos profesionales $97-$297)

```
MI CURSO
  📊 Dashboard                    ← Progreso, módulos completados
  💼 [Mi Curso]                   ← El curso asignado por las 9 preguntas
     └→ Módulos T-01 a F-05 con 8 tabs
  🧪 Demos Interactivos           ← Calculadora, Jurisprudencia, Diagnóstico

HERRAMIENTAS
  🤖 AI Lab                       ← Gemini + links a ChatGPT/Claude
  📖 Biblioteca                   ← Papers de su profesión

MI CUENTA
  💳 Pagos                        ← $97/$197/$297
  👤 Perfil
  📜 Certificado                  ← Al completar

───── Estado: 30% construido ─────
Falta: Rol EXTERNO, dashboard propio, integrar cursos de Academy
```

### ROL: DOCENTE

```
MIS MATERIAS
  📊 Dashboard Docente            ← Mis materias, entregas pendientes, alertas
  📚 [Lista de materias]          ← Solo las suyas
     └→ Editor de sesiones (contenido, quiz, recursos)

GESTIÓN
  📝 Calificar Entregas           ← Con rúbrica y feedback
  📊 Progreso Alumnos             ← Filtrado por materia/sesión
  📢 Anuncios                     ← Comunicación CES
  📹 Programar Clases             ← Agenda sincrónica (CES 51%)
  📞 Tutorías                     ← Horario disponible (CES Art. 24)
  📋 Asistencia                   ← Reportes SENESCYT

CAPACITACIÓN
  🎓 Docencia Virtual 120h        ← 8 módulos CES obligatorios
  📜 Mi Certificación             ← Descargable al completar

───── Estado: 70% construido ─────
Falta: Comunicación, Tutorías UI, Calificaciones completas
```

### ROL: B2B (empresa)

```
MI EMPRESA
  📊 Dashboard Corporativo        ← Resumen equipo, inversión, ROI
  👥 Mi Equipo                    ← Lista de empleados + progreso
  📚 Capacitación Activa          ← Cursos asignados al equipo

EMPRESAS DEL ECOSISTEMA
  🔍 H3L                          ← Presentación + video + convenio
  🏥 ImagemIA                     ← Presentación + video + convenio
  🧠 Strata                       ← Presentación + video + convenio

REPORTES
  📊 Progreso del Equipo          ← Exportable PDF/CSV
  📜 Certificados Equipo          ← Emitidos por empleado
  💳 Facturación                  ← Mensual/anual

───── Estado: 20% construido ─────
Falta: CASI TODO
```

### ROL: ADMIN (Héctor + Coordinación)

```
(Ya existe al 95% — no tocar)
Usuarios, Programas, Carreras, Cursos, Lecciones,
Sesiones, Matrículas, Pagos, Certificaciones,
Asistencia CES, Calendario, AI Usage, Capacitación
Docente, Cohortes, Integridad, Privacidad LOPDP
```

---

## EL ESTÁNDAR DE SESIÓN (aplica a TODO producto)

**Sin importar si es Carrera, Preuni, Bootcamp, Curso Pro o Certificación:**

```
┌────────────────────────────────────────┐
│ ← Volver a materia    Sesión 3 de 16  │
├────────────────────────────────────────┤
│                                        │
│  ▶ VIDEO                               │  ← Sticky arriba
│  [YouTube embed - no se sale del sitio]│     Se puede minimizar
│                                        │
├────────────────────────────────────────┤
│                                        │
│  ▼ Presentación    (acordeón)          │  ← Abre/cierra sin
│  ▼ Teoría ●        expandible          │     perder el video
│  ▼ Quiz            debajo del          │
│  ▼ Ejercicio       video               │
│  ▼ AI Lab                              │
│  ▼ Recursos                            │
│  ▼ Clase en Vivo                       │
│                                        │
├────────────────────────────────────────┤
│ ← Anterior    Ver materia  Siguiente → │
└────────────────────────────────────────┘
```

**8 tabs en acordeón (NO pestañas horizontales):**
1. Presentación — Slides Gamma o PDF
2. Teoría — Markdown expandible
3. Quiz — 5 preguntas con anti-fraude
4. Ejercicio — Práctico paso a paso
5. AI Lab — Tutor contextual + herramientas
6. Recursos — Links verificados
7. Clase en Vivo — Daily.co (cuando hay clase)

---

## INVENTARIO: QUÉ EXISTE vs QUÉ FALTA

### Contenido (en Supabase)
| Producto | Sesiones | Video | Teoría | Quiz | Slides | Estado |
|----------|----------|-------|--------|------|--------|--------|
| Carreras IA | 16 | ✓ | ✓ | ✓ | ✗ | 75% |
| Carreras CD | 16 | ✓ | ✓ | ✓ | ✗ | 75% |
| Carreras BD | 16 | ✓ | ✓ | ✓ | ✗ | 75% |
| Preuniversitario | 20 | ✓ | ✓ | ✓ | ✗ | 75% |
| Bootcamp Intensivo | 48 | ✓ | ✓ | ✓ | ✗ | 75% |
| Capacitación Equipos | 8 | ✓ | ✓ | ✓ | ✗ | 75% |
| Transformación Digital | 18 | ✓ | ✓ | ✓ | ✗ | 75% |
| Curso Express | 27 | ✓ | ✓ | ✓ | ✗ | 75% |
| Curso Estándar | 40 | ✓ | ✓ | ✓ | ✗ | 75% |
| Curso Completo | 45 | ✓ | ✓ | ✓ | ✗ | 75% |
| **TOTAL** | **254** | **254** | **254** | **254** | **0** | |

**Falta en TODOS:** Slides/Presentaciones (0/254) y Ejercicios verificados

### Plataforma (en código Next.js)
| Componente | Existe | Funciona | Estándar V2 |
|-----------|--------|----------|-------------|
| Header público | ✓ | ✓ | Necesita logo ITSEIA |
| Sidebar por rol | PARCIAL | Mezcla roles | REHACER con 4 menús |
| Sesión 8 tabs | ✓ (horizontal) | ✓ | CAMBIAR a acordeón |
| VideoPlayer | ✓ | ✓ | OK, agregar sticky |
| QuizEngine | ✓ | ✓ | OK, tiene anti-fraude |
| AI Lab | ✓ | Solo Gemini | AGREGAR modelos |
| Biblioteca | ✓ | ✓ | OK |
| Calendario | ✓ | ✓ | OK |
| Certificaciones | ✓ | Solo AWS | AGREGAR Google, Azure |
| Flashcards | ✓ | ✓ | OK |
| Daily.co | ✓ | Mock mode | ACTIVAR con API key |
| Foros | ✓ | ✓ | OK |
| LOPDP | ✓ | ✓ | OK |
| Login | ✓ | Stats hardcodeados | ARREGLAR |
| Perfil | ✓ | NO CARGA | ARREGLAR |
| Cohorte | ✓ | VACÍO | ARREGLAR |

### Landings (en cPanel)
| Landing | URL | Existe | Estado |
|---------|-----|--------|--------|
| Principal | itseia.ai | ✓ | V3 desplegada |
| Información | itseia.ai/informacion/ | ✓ | V1 — necesita V2 con online |
| Cursos Pro | itseia.ai/cursos/ | ✓ | 9 preguntas funcionando |
| Demos | itseia.ai/demos/ | ✓ | 7 demos + 3 profesionales |
| Mallas | itseia.ai/mallas/ | ✓ | Interactivas funcionando |
| Academy | itseia.ai/academy/ | ✓ | Sistema V1 con Gamma |

### Assets reutilizables
| Asset | Ubicación | Para qué |
|-------|-----------|----------|
| 27 módulos .md (Cont+Med+Abog) | PROYECTO_AULA_IA_PERSONALIZADA | Cursos pro |
| 3 demos HTML (Calc+Legal+Diag) | itseia.ai/demos/ | Cursos pro |
| 3 quiz.json | cursos/*/quiz.json | Evaluaciones |
| 5 PDFs Gamma | itseia.ai/academy/slides/ | Presentaciones |
| Landing 9 preguntas | itseia.ai/cursos/ | Captura cursos pro |
| Videos Alberto/Luma/Neo | PROYECTO_LANDING_INFO_2026 | Fraternidad |
| Investigación CES completa | docs/ces_aprobacion/ | Compliance |
| 13 SQL migrations | supabase/migrations/ | BD lista |

---

## FASES DE EJECUCIÓN V2

### Fase 1: ESQUELETO (1 semana)
**Objetivo:** Estandarizar sin agregar contenido nuevo

1. Sidebar dinámico por rol (4 menús)
2. Sesión estándar (video sticky + acordeón)
3. Header público consistente
4. Login inteligente por rol
5. Arreglar: perfil, cohorte, pagos, stats login

**Equipo:** Ingeniero en Jefe + Frontend UX + QA
**Entregable:** Plataforma navegable con estándar uniforme EN LOCAL

### Fase 2: LLENAR HUECOS (1 semana)
**Objetivo:** Completar lo que falta por rol

1. Rol EXTERNO + dashboard cursos pro
2. AI Lab multi-modelo
3. CES gaps docente (tutorías, comunicación, calificaciones)
4. Certificaciones (Google, Azure además de AWS)
5. Presentaciones Gamma (254 slides)

**Equipo:** Por módulo — agentes especializados
**Entregable:** Cada rol tiene su menú completo y funcional

### Fase 3: B2B + POLISH (1 semana)
**Objetivo:** Corporate + UX premium

1. Dashboard corporativo B2B
2. Presentaciones H3L/ImagemIA/Strata
3. UX premium (colores, logos, tipografía legible)
4. Landing /informacion/ V2 con online

**Equipo:** Marketing + Frontend + UX
**Entregable:** B2B funcional + plataforma visualmente premium

### Fase 4: QA + DEPLOY
**Regla:** TODO se prueba en LOCAL primero
1. Testing completo por rol
2. Testing CES compliance
3. Testing mobile
4. Deploy final

---

## CES COMPLIANCE CHECKLIST (por menú)

### Alumno DEBE tener:
- [x] Clases en vivo (Daily.co) → "Clases en Vivo" en menú
- [x] Biblioteca virtual → "Biblioteca" en menú
- [x] Evaluaciones anti-fraude → QuizEngine con integrity
- [x] Calendario académico → "Calendario" en menú
- [x] Foros → "Foros" en menú
- [x] LOPDP → "Perfil" con datos personales
- [ ] Tutorías → FALTA en menú
- [x] Registro asistencia → Automático con Daily.co

### Docente DEBE tener:
- [x] Editor contenido → /teacher/materias
- [x] Capacitación 120h → /teacher/capacitacion
- [x] Asistencia → /teacher/asistencia
- [ ] Calificaciones completas → FALTA rúbrica
- [ ] Comunicación → FALTA implementación
- [ ] Programar clases → FALTA acceso docente
- [ ] Tutorías → FALTA UI

---

## MESA DIRECTIVA

| Rol | Responsable | Función |
|-----|-------------|---------|
| CEO | Héctor Velasco | Visión, aprobación, ventas |
| CTO / Ingeniero en Jefe | Claude Code | Arquitectura, ejecución |
| Dir. UX | Agente UX | Diseño visual, flujos |
| Dir. Contenido | Agente Contenido | 254 sesiones, presentaciones |
| Dir. Marketing | Agente Marketing | Landings, campañas, copy |
| Dir. CES/Legal | Agente Legal | Compliance, documentación |
| Dir. Ventas | Agente Ventas | 6 toques, leads, conversión |

---

*V2 creada: 24 marzo 2026*
*Aprobación pendiente: CEO Héctor Velasco*
