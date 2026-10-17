# SPEC: COMPLETAR PLATAFORMA ITSEIA
**Version:** 1.0
**Fecha:** 25 marzo 2026
**Autor:** Prompt Maestro v3.0
**Estado:** PENDIENTE APROBACION

---

## 1. PROBLEMA

La plataforma educativa tecnologico.itseia.ai tiene 6 tipos de usuario pero solo el demo de CARRERAS funciona correctamente (sesion con Video, Presentacion, Teoria, Quiz, Ejercicio, AI Lab, Recursos, Clase en Vivo). Los otros 5 productos tienen paginas incompletas, rutas rotas en el sidebar, contenido invisible, y funcionalidades placeholder.

**Impacto:** No se puede mostrar la plataforma a leads ni a potenciales docentes/empresas porque solo 1 de 6 productos funciona como demo.

---

## 2. AUDITORIA — ESTADO ACTUAL POR PRODUCTO

### 2.1 CARRERAS (DEMO FUNCIONAL) — 85%
| Componente | Estado | Nota |
|-----------|--------|------|
| Landing /carreras-info | OK | EmailJS + pricing |
| Sidebar MENU_ALUMNO | OK | Mi Carrera, Calendario, Foros, etc |
| Session page (8 tabs) | OK | Video, Presentacion, Teoria, Quiz, Ejercicio, AI Lab, Recursos, Clase en Vivo |
| Texto visible | FIXED HOY | CSS !important en prose |
| Presentacion persiste | FIXED HOY | Tabs mantienen iframe |
| 3 carreras en Supabase | OK | IA, Ciencia Datos, Big Data |
| Quizzes | OK | STRING parse fixed |
| Velocidad | LENTA | 10+ queries secuenciales |

### 2.2 PREUNIVERSITARIO — 40%
| Componente | Estado | Nota |
|-----------|--------|------|
| Landing /preuni-info | OK | $480 regular, $400 becado |
| Sidebar MENU_PREUNI | EXISTE | 4 semanas + herramientas |
| Rutas /preuni/semana-1..4 | **NO EXISTEN** | Links rotos en sidebar |
| Redirector /preuniversitario | OK | Redirige a /carreras/{slug} |
| Contenido Supabase | OK | 20 sesiones, 4 materias, quizzes |
| Vista sesion dedicada | NO | Reutiliza vista carrera |

### 2.3 CURSOS PRO — 75%
| Componente | Estado | Nota |
|-----------|--------|------|
| Landing /cursos-pro-info | OK | 3 planes: $99/$197/$297 |
| Sidebar MENU_CURSOS_PRO | OK | Mi Curso, Demos, AI Lab |
| /mi-curso dashboard | OK | Progreso, modulos, stats |
| /courses/[id] | OK | Modulos colapsables |
| /courses/[id]/lesson/[lessonId] | OK | Markdown + AI chat |
| Verificar contenido visible | PENDIENTE | Puede tener mismos bugs de color |
| Demos Interactivos link | OK | Apunta a itseia.ai/demos/ |

### 2.4 CERTIFICACIONES — 90%
| Componente | Estado | Nota |
|-----------|--------|------|
| Landing /certificaciones-info | OK | AWS, GCP, Azure — $565 incluido |
| Catalogo /certificaciones | OK | 3 activos + 3 proximamente |
| Detalle /certificaciones/[slug] | OK | Dominios, historial examenes |
| Examen /certificaciones/[slug]/examen | OK | Cronometrado, navegacion |
| Resultados /certificaciones/[slug]/resultados | OK | Score + explicaciones |
| Admin report | OK | CSV export |
| Banco preguntas | VERIFICAR | Puede necesitar mas preguntas |

### 2.5 DOCENTES — 85%
| Componente | Estado | Nota |
|-----------|--------|------|
| Dashboard /teacher | OK | 4 stats + quick links |
| Sidebar layout propio | OK | 12 items, 3 secciones |
| /teacher/materias | OK | Grid de materias |
| /teacher/entregas | OK | Tabla filtrable + calificacion |
| /teacher/progreso | OK | Matriz estudiante x sesion |
| /teacher/asistencia | OK | Reporte + alertas >30% |
| /teacher/comunicacion | OK | Anuncios + mensajes |
| /teacher/capacitacion | OK | Curso 120h CES |
| /teacher/certificacion | OK | Progress + PDF |
| /teacher/programar-clases | OK | Grid con editor |
| /teacher/tutorias | **PLACEHOLDER** | Coming soon |
| Verificar texto visible | PENDIENTE | Puede tener bugs color |

### 2.6 EMPRESAS B2B — 55%
| Componente | Estado | Nota |
|-----------|--------|------|
| Landing /empresas-info | OK | 3 partners, pricing corporativo |
| Dashboard /b2b | OK | KPIs + partner cards |
| /b2b/team | PLACEHOLDER | Coming soon |
| /b2b/reportes | PLACEHOLDER | Coming soon |
| /b2b/capacitacion | **NO EXISTE** | Link roto en sidebar |
| Sidebar MENU_B2B | TIENE LINK ROTO | /b2b/capacitacion no existe |

---

## 3. USUARIOS

| Tipo | Rol Supabase | Menu | Ruta principal |
|------|-------------|------|----------------|
| Alumno Carrera | estudiante (type=carrera) | MENU_ALUMNO | /carreras |
| Preuniversitario | estudiante (type=preuni) | MENU_PREUNI | /preuniversitario |
| Curso Pro | estudiante (type=curso) | MENU_CURSOS_PRO | /mi-curso |
| Certificaciones | cualquier estudiante inscrito | Seccion inyectada | /certificaciones |
| Docente | docente | MENU_DOCENTE | /teacher |
| Empresa B2B | finanzas | MENU_B2B | /b2b |
| Admin | super_admin/admin | MENU_ADMIN | /admin |

---

## 4. FUNCIONALIDADES — 3 FASES

### FASE 1: AUDITORIA (ya completada arriba)

### FASE 2: FIXES (Prioridad CRITICA)

| ID | Fix | Producto | Esfuerzo |
|----|-----|----------|----------|
| F01 | Crear rutas /preuni/semana-1..4 (o redirigir a sesiones) | Preuniversitario | MEDIO |
| F02 | Crear /b2b/capacitacion (o remover del menu) | B2B | BAJO |
| F03 | Verificar texto visible en TODOS los productos | TODOS | MEDIO |
| F04 | Verificar que tabs sesion mantienen iframe en cursos | Cursos Pro | BAJO |
| F05 | Verificar quiz funciona en preuniversitario | Preuniversitario | BAJO |
| F06 | Verificar quiz funciona en certificaciones | Certificaciones | BAJO |
| F07 | Optimizar velocidad: combinar queries secuenciales | Carreras | ALTO |
| F08 | Verificar navegacion sidebar no tiene mas links rotos | TODOS | MEDIO |
| F09 | Verificar landing pages tienen login link funcional | TODOS | BAJO |
| F10 | Fix tutorias docente (al menos coming soon mejorado) | Docentes | BAJO |

### FASE 3: COMPLETAR (Prioridad ALTA)

| ID | Tarea | Producto | Esfuerzo |
|----|-------|----------|----------|
| C01 | Crear paginas /preuni/semana-N que muestren sesiones de esa semana | Preuniversitario | ALTO |
| C02 | Vincular presentaciones Gamma a sesiones preuni en Supabase | Preuniversitario | MEDIO |
| C03 | Generar teoria markdown para sesiones preuni sin teoria | Preuniversitario | ALTO |
| C04 | Crear /b2b/capacitacion con lista de programas activos del equipo | B2B | MEDIO |
| C05 | Implementar /b2b/team con gestion basica de miembros | B2B | ALTO |
| C06 | Implementar /b2b/reportes con metricas reales del equipo | B2B | ALTO |
| C07 | Completar banco preguntas certificaciones (min 50 por cert) | Certificaciones | ALTO |
| C08 | Implementar booking basico para tutorias docente | Docentes | ALTO |
| C09 | Verificar y completar contenido cursos pro (teoria + quiz por leccion) | Cursos Pro | ALTO |
| C10 | Optimizar performance: parallel queries, SWR cache, lazy loading | TODOS | ALTO |

---

## 5. FUERA DE ALCANCE

- Pagos online (Stripe/PayPal produccion) — se mantiene EmailJS + transferencia
- App movil nativa
- Sistema de chat en tiempo real entre estudiantes
- Videoconferencia propia (se usa Daily.co existente)
- Generacion automatica de contenido con IA (se genera manualmente)
- Multi-idioma
- Migracion de base de datos

---

## 6. CRITERIOS DE EXITO

| Criterio | Metrica | Target |
|----------|---------|--------|
| Todos los links del sidebar funcionan | 0 links rotos | 0 |
| Texto visible en TODAS las paginas | 0 paginas con texto invisible | 0 |
| Demo completo por producto | Se puede hacer recorrido completo | 6/6 productos |
| Presentaciones no desaparecen | Iframe persiste entre tabs | 100% |
| Pagina carga en < 3 segundos | LCP medido en Vercel | < 3s |
| Cada producto tiene: landing + sidebar + contenido | Checklist por producto | 6/6 |

---

## 7. STACK (YA EXISTENTE — NO CAMBIAR)

- **Frontend:** Next.js 15 App Router + TypeScript
- **Estilos:** Tailwind CSS v4 + shadcn/ui
- **Backend:** Supabase (Postgres + Auth + RLS + Realtime + Storage)
- **Deploy:** Vercel (tecnologico.itseia.ai)
- **Presentaciones:** Gamma API (embeds)
- **IA:** Gemini API (AI Lab)
- **Video:** Daily.co (clases en vivo)
- **Email:** EmailJS SDK v4
- **Hosting web:** cPanel SSH (itseia.ai)

---

## 8. COMPLEJIDAD Y EQUIPOS

**Complejidad total:** ALTA (6 productos x 3 fases)

### Equipos por producto:

| Equipo | Producto | Fase 2 (Fixes) | Fase 3 (Completar) |
|--------|----------|-----------------|---------------------|
| EQ-1 | Preuniversitario | F01, F05 | C01, C02, C03 |
| EQ-2 | Cursos Pro | F03, F04 | C09 |
| EQ-3 | Certificaciones | F03, F06 | C07 |
| EQ-4 | Docentes | F03, F10 | C08 |
| EQ-5 | Empresas B2B | F02, F03 | C04, C05, C06 |
| EQ-6 | Performance | F07 | C10 |

**Los 6 equipos trabajan en PARALELO.**
**Cada equipo reporta estado en TASKS.md.**

---

## 9. ORDEN DE EJECUCION

```
FASE 2 FIXES (dia 1)
├── EQ-1: Crear rutas preuni/semana-N (redirigir a sesiones existentes)
├── EQ-2: Verificar colores cursos pro
├── EQ-3: Verificar colores certificaciones
├── EQ-4: Verificar colores docentes
├── EQ-5: Crear /b2b/capacitacion + fix link sidebar
└── EQ-6: Combinar queries sesion (parallel fetch)

FASE 3 COMPLETAR (dia 2-3)
├── EQ-1: Paginas semana preuni + teoria + presentaciones
├── EQ-2: Completar contenido cursos pro
├── EQ-3: Banco 50 preguntas por certificacion
├── EQ-4: Booking tutorias basico
├── EQ-5: Team management + reportes B2B
└── EQ-6: SWR cache + lazy loading

BUILD + DEPLOY + QA FINAL
└── Verificacion cruzada: cada equipo prueba otro producto
```

---

**STOP: Esperando aprobacion del CEO para proceder con PLAN.md**
