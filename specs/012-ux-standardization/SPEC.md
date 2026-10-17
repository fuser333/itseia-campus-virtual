# ESPECIFICACIÓN: Estandarización UX — Principio Henry Ford

**Versión:** 1.0
**Fecha:** 24 marzo 2026
**Autor:** Héctor Bolívar — ITSEIA

---

## Problema que resuelve
La plataforma tecnologico.itseia.ai tiene 94 páginas pero es un CAOS de navegación. Hay dos menús diferentes según cómo entras, páginas sin retorno, contenido mezclado entre roles, y el mismo sidebar muestra cosas distintas. Un lead que entra con el demo sale espantado. Necesitamos estandarizar TODO antes de seguir construyendo.

## Principio Henry Ford
"Estandarizar antes de producir." Cada producto (carrera, preuni, bootcamp, curso pro) es una INSTANCIA del mismo estándar, no un mundo aparte.

## Usuarios objetivo
| Rol | Descripción | Qué ve |
|-----|-------------|--------|
| ALUMNO | Estudiante de carrera (IA/CD/BD) o preuni | Su carrera, herramientas, cuenta |
| EXTERNO | Profesional en curso corto ($97-$297) | Su curso, demos, AI Lab |
| DOCENTE | Profesor asignado a materias | Sus materias, entregas, capacitación |
| B2B | Empresa con equipo en capacitación | Su equipo, progreso, reportes |
| PÚBLICO | Visitante sin login | Landing, carreras, catálogo |

## EL ESTÁNDAR (aplica a TODO)

### Estándar 1 — Menú por rol (sidebar izquierdo)
Cada rol tiene SU menú. No ve lo de los demás. El sidebar se puede minimizar (solo iconos) pero NUNCA desaparece.

**ALUMNO:**
```
MI APRENDIZAJE
  Dashboard
  Mi Carrera (o Mi Preuni)
  Calendario
  Clases en Vivo

HERRAMIENTAS
  AI Lab (TODOS los modelos)
  Biblioteca
  Flashcards
  Certificaciones

MI CUENTA
  Pagos
  Perfil
  Certificados
```

**EXTERNO (cursos pro):**
```
MI CURSO
  Dashboard
  [Nombre de su curso]
  Demos Interactivos

HERRAMIENTAS
  AI Lab
  Biblioteca

MI CUENTA
  Pagos
  Perfil
  Certificado
```

**DOCENTE:**
```
MIS MATERIAS
  Dashboard Docente
  [Lista de sus materias]

GESTIÓN
  Calificar Entregas
  Progreso Alumnos
  Anuncios
  Programar Clases

CAPACITACIÓN
  Docencia Virtual 120h
  Mi Certificación CES
```

**B2B:**
```
MI EMPRESA
  Dashboard Corporativo
  Mi Equipo
  Capacitación activa

REPORTES
  Progreso del equipo
  Certificados equipo
```

### Estándar 2 — Sesión (idéntica en TODO producto)
Sin importar si es carrera, preuni, bootcamp, o curso pro:

```
┌────────────────────────────────┐
│ VIDEO (arriba, fijo, sticky)   │
│ Se puede minimizar             │
├────────────────────────────────┤
│ ▼ Presentación    (acordeón)   │
│ ▼ Teoría          expandible   │
│ ▼ Quiz            sin perder   │
│ ▼ Ejercicio       el video     │
│ ▼ AI Lab                       │
│ ▼ Recursos                     │
│ ▼ Clase en Vivo                │
├────────────────────────────────┤
│ ← Anterior  │ Ver materia │ → │
└────────────────────────────────┘
```

### Estándar 3 — Header público (sin login)
```
[ITSEIA logo] Inicio  Carreras  Catálogo  AI Lab  [Ingresar] [Inscribirme]
```

### Estándar 4 — Login inteligente
Login → detecta rol → redirige a SU dashboard con SU menú. Nunca mezcla.

## Funcionalidades principales

### Fase A — Estandarización (NO agregar nada nuevo, solo ordenar)
- [ ] **F01:** Sidebar dinámico por rol — 4 menús diferentes — Prioridad: CRÍTICA
- [ ] **F02:** Sesión estándar con video sticky + acordeón abajo — Prioridad: CRÍTICA
- [ ] **F03:** Header público consistente en TODAS las páginas sin login — Prioridad: CRÍTICA
- [ ] **F04:** Login redirige al dashboard correcto según rol — Prioridad: CRÍTICA
- [ ] **F05:** Eliminar "Mis Cursos" (V1 obsoleto) — Prioridad: Alta
- [ ] **F06:** Login con stats reales (no hardcodeados) — Prioridad: Alta

### Fase B — Completar huecos
- [ ] **F07:** Crear rol EXTERNO y dashboard de cursos profesionales — Prioridad: Alta
- [ ] **F08:** Arreglar perfil (no carga) — Prioridad: Alta
- [ ] **F09:** Arreglar cohorte (vacío) — Prioridad: Media
- [ ] **F10:** Arreglar pagos (no mostrar Docencia Virtual a estudiantes) — Prioridad: Alta
- [ ] **F11:** Certificaciones con contenido real (no "se cargarán pronto") — Prioridad: Media
- [ ] **F12:** AI Lab con TODOS los modelos (ChatGPT, Claude, Perplexity, DeepSeek, NotebookLM, terminal) — Prioridad: Alta

### Fase C — B2B
- [ ] **F13:** Dashboard corporativo B2B — Prioridad: Media
- [ ] **F14:** Gestión de equipos B2B — Prioridad: Media

## Fuera de alcance
- ❌ Contenido nuevo (ya tenemos 254 sesiones)
- ❌ Presentaciones Gamma (proyecto separado)
- ❌ Landing /informacion/ V2 (proyecto separado)
- ❌ Nuevas features — SOLO estandarizar y arreglar lo roto

## Criterios de éxito
- [ ] **CE01:** Cada rol ve SOLO su menú, nada más
- [ ] **CE02:** La sesión es IDÉNTICA en carrera, preuni, bootcamp y curso pro (video + acordeón)
- [ ] **CE03:** No hay página sin botón de regreso o breadcrumb
- [ ] **CE04:** Login redirige correctamente según rol
- [ ] **CE05:** Perfil carga sin spinner infinito
- [ ] **CE06:** Pagos NO muestra Docencia Virtual a estudiantes
- [ ] **CE07:** AI Lab muestra más de 3 modelos
- [ ] **CE08:** CERO deploys sin verificar en local primero

## Stack tecnológico
| Capa | Tecnología | Ya existe |
|------|-----------|-----------|
| Frontend | Next.js 15 + Tailwind + shadcn | SÍ |
| Auth/Roles | Supabase Auth + profiles.role | SÍ |
| DB | Supabase PostgreSQL | SÍ |
| Deploy | Vercel | SÍ |

## Complejidad estimada
- Módulos principales: 3 fases (A, B, C)
- Integraciones: 0 nuevas
- Agent Teams: SÍ — un equipo por fase
