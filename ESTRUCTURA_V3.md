# ESTRUCTURA V3 — ITSEIA Academy Online (DEFINITIVA)

**Fecha:** 24 marzo 2026
**Aprobación pendiente:** CEO Héctor Velasco

---

## ECOSISTEMA

```
                    ┌─────────────────────┐
                    │  ITSEIA ACADEMY      │
                    │  tecnologico.itseia.ai│
                    └──────────┬──────────┘
                               │
   ┌──────────┬───────────┬────┼────┬──────────┬──────────┐
   │          │           │         │          │          │
┌──────┐┌──────────┐┌─────────┐┌─────────┐┌─────────┐┌──────────┐
│Carrer││Certifica-││Cursos   ││Preuni   ││Bootcamp ││Corporate │
│as    ││ciones    ││Profes.  ││Online   ││3 meses  ││B2B       │
│Online││AWS,Azure ││$97-297  ││$180     ││$497     ││$2K-10K   │
│$220  ││Google,etc││9 pregs  ││         ││         ││          │
└──┬───┘└──┬───────┘└────┬────┘└────┬────┘└────┬────┘└────┬─────┘
   │       │             │          │          │          │
   └───┬───┘             └────┬─────┘          │     ┌────┴─────┐
       │                      │                │     │          │
  TÍTULO SENESCYT        CERTIFICADO      CERTIFICADO│  H3L     │
  + CERTS INDUSTRIA      ITSEIA          ITSEIA     │  ImagemIA│
                                                     │  Strata  │
                                                     └──────────┘
```

**Carreras + Certificaciones van JUNTAS** (mismo nivel, se ven juntas)
**Las 3 empresas van DENTRO de B2B/Corporativo**

---

## 6 MENÚS POR TIPO DE USUARIO

### 1. ALUMNO (carrera formal + certificaciones)

```
MI APRENDIZAJE
  📊 Dashboard
  🎓 Mi Carrera (IA / CD / BD)
     └→ Semestre > Materias > Sesiones
  🏆 Certificaciones
     └→ AWS / Google / Azure / Claude Code...
  📅 Calendario
  📹 Clases en Vivo
  💬 Foros

HERRAMIENTAS
  🤖 AI Lab (todos los modelos)
  📖 Biblioteca
  🎴 Flashcards

MI CUENTA
  💳 Pagos
  👤 Perfil
  📜 Certificados
  🎒 Portafolio
```

### 2. EXTERNO (cursos profesionales)

```
MI CURSO
  📊 Dashboard
  💼 [Mi Curso Asignado]
     └→ Módulos T-01 a F-05
  🧪 Demos Interactivos

HERRAMIENTAS
  🤖 AI Lab
  📖 Biblioteca

MI CUENTA
  💳 Pagos
  👤 Perfil
  📜 Certificado
```

### 3. CERTIFICACIONES (alumnos O externos)

```
MIS CERTIFICACIONES
  📊 Dashboard Certificaciones
  🏆 [Certificación activa]
     └→ Dominios > Sesiones (mismos 8 tabs)
  📝 Simulacros de Examen
  🌐 Guía de Traducción (exámenes en inglés)

CERTIFICACIONES DISPONIBLES
  ☁️ AWS Cloud Practitioner
  🔷 Azure AI Fundamentals
  🟡 Google Cloud Digital Leader
  🤖 Claude Code
  💻 GitHub Copilot
  🔥 TensorFlow Developer
  ... (más)
```

### 4. DOCENTE

```
MIS MATERIAS
  📊 Dashboard Docente
  📚 [Lista de sus materias]
     └→ Editor de sesiones

GESTIÓN
  📝 Calificar Entregas
  📊 Progreso Alumnos
  📢 Anuncios
  📹 Programar Clases
  📞 Tutorías
  📋 Asistencia

CAPACITACIÓN CES
  🎓 Docencia Virtual 120h
  📜 Mi Certificación
```

### 5. B2B / CORPORATIVO

```
MI EMPRESA
  📊 Dashboard Corporativo
  👥 Mi Equipo
  📚 Capacitación Activa

NUESTRAS EMPRESAS
  🔍 H3L (presentación + video + convenio)
  🏥 ImagemIA (presentación + video + convenio)
  🧠 Strata (presentación + video + convenio)

REPORTES
  📊 Progreso del Equipo
  📜 Certificados Equipo
  💳 Facturación
```

### 6. ADMIN (sin cambios, ya al 95%)

```
(Todo el panel administrativo existente)
```

---

## ESTÁNDAR DE SESIÓN (aplica a TODO)

```
┌──────────────────────────────────────────┐
│ ← Volver a materia       Sesión 3 de 16 │
├──────────────────────────────────────────┤
│                                          │
│ [Video●][Present][Teoría●][Quiz]         │ ← TABS ARRIBA
│ [Ejercicio][AI Lab][Recursos][Clase Vivo]│   para escoger
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  ▶ CONTENIDO PRINCIPAL                   │ ← Lo que escogí
│  (el tab activo se muestra aquí)         │   arriba se ve
│                                          │   aquí grande
│                                          │
├──────────────────────────────────────────┤
│  ▼ Presentación    (acordeón)            │ ← Los OTROS tabs
│  ▼ Teoría ●        como acordeón         │   se abren abajo
│  ▼ Quiz            para ver varios       │   sin perder lo
│  ▼ Ejercicio       al mismo tiempo       │   de arriba
│  ▼ AI Lab                                │
│  ▼ Recursos                              │
│  ▼ Clase en Vivo                         │
├──────────────────────────────────────────┤
│ ← Anterior    Ver materia    Siguiente → │
└──────────────────────────────────────────┘

REGLA: Si escojo Video arriba → video se muestra grande
       → abajo puedo abrir Teoría en acordeón al mismo tiempo
       Si cambio a Quiz arriba → quiz se muestra grande
       → video baja al acordeón
```

---

## NO TOCAR (protegido)

| Asset | URL | Estado |
|-------|-----|--------|
| Landing cursos pro | itseia.ai/cursos/ | INTACTA (9 preguntas) |
| Academy HTML | itseia.ai/academy/ | INTACTA |
| Landing info V1 | itseia.ai/informacion/ | INTACTA hasta V2 aprobada |
| Demos | itseia.ai/demos/ | INTACTA |
| Mallas | itseia.ai/mallas/ | INTACTA |
| Web principal | itseia.ai/ | INTACTA |

---

## FASES DE EJECUCIÓN

### Fase 1: ESQUELETO (estandarizar)
- Sidebar dinámico 6 menús por rol
- Sesión estándar (tabs arriba + acordeón abajo)
- Header público consistente
- Login inteligente por rol
- Arreglar bugs (perfil, cohorte, pagos, login stats)
- TODO en LOCAL primero

### Fase 2: LLENAR MÓDULOS
- Rol EXTERNO + dashboard cursos pro (basado en Academy existente)
- Certificaciones como producto independiente
- AI Lab multi-modelo
- CES gaps docente
- Presentaciones Gamma (254)

### Fase 3: B2B + UX PREMIUM
- Dashboard corporativo
- Presentaciones H3L/ImagemIA/Strata con video
- Convenios firmados
- UX premium (colores, logos, tipografía)
- Landing /informacion/ V2

### Fase 4: QA + DEPLOY
- Testing por rol EN LOCAL
- Testing CES compliance
- Testing mobile
- Deploy solo cuando TODO esté verificado

---

*ESTRUCTURA V3 — 24 marzo 2026*
*Pendiente aprobación CEO*
