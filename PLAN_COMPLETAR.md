# PLAN: COMPLETAR PLATAFORMA ITSEIA
**Fecha:** 25 marzo 2026
**Ultimo deploy:** 25 mar ~14:30 — 139 paginas, 0 errores
**Guardrail:** NADA se declara hecho sin verificacion real

---

## FASE 2: FIXES — COMPLETADA

- [x] F01: Crear rutas /preuni/semana-1..4 — 4 paginas + layout
- [x] F02: Crear /b2b/capacitacion — pagina funcional con enrollments reales
- [x] F03-CP: Fix colores mi-curso — 12 tokens CSS reemplazados
- [x] F03-CERT: Verificar certificaciones — fondo oscuro, texto OK
- [x] F03-DOC: Fix teacher layout — style color explicito
- [x] F04: Presentaciones persisten — SessionTabs con display:none
- [x] F07: Performance session — 14 queries → 6 etapas Promise.all
- [x] F10: Tutorias docente — reescrito con horarios, WhatsApp, pasos
- [x] Links sidebar: 45/45 rutas verificadas, 0 links rotos

---

## FASE 3: COMPLETAR — PARCIALMENTE COMPLETADA

### HECHO:
- [x] C01: Paginas /preuni/semana-N — 4 paginas creadas
- [x] C04: /b2b/capacitacion con datos reales
- [x] C05: /b2b/team mejorado con enrollments
- [x] C06: /b2b/reportes mejorado con KPIs
- [x] C07: 3 certificaciones + 57 exam questions + 14 dominios
- [x] C08: Tutorias con info practica
- [x] C10: Performance optimizada

### PENDIENTE:
- [ ] C02: Vincular slides Gamma a sesiones preuni (solo 2/18 tienen slides)
- [ ] C03: Session resources preuni (0 recursos)
- [ ] C09: Cursos Pro Estandar y Completo VACIOS — necesitan courses+modules+lessons

---

## INVENTARIO SUPABASE (25 mar 2026)

### PREUNIVERSITARIO (18 sesiones)
| Contenido | Tiene | Falta |
|-----------|-------|-------|
| Teoria markdown | 18/18 (100%) | — |
| Video URL | 18/18 (100%) | — |
| Slides/Presentacion | 2/18 (11%) | 16 sin slides |
| Quiz (5 preg c/u) | 18/18 (100%) | — |
| Session resources | 0/18 (0%) | Todo |

### CURSOS PRO (CRITICO)
| Programa | Courses | Modules | Lessons | Videos | Quizzes |
|----------|---------|---------|---------|--------|---------|
| Express | 1 | 7 | 25 (con texto) | 0 | 0 |
| Estandar | **0** | **0** | **0** | 0 | 0 |
| Completo | **0** | **0** | **0** | 0 | 0 |

**Nota critica:** No existe tabla `lesson_progress` — solo `session_progress`. Los cursos pro NO tienen tracking de progreso del alumno.

### CERTIFICACIONES (MEJORADO HOY)
| Certificacion | Dominios | Preguntas | Estado |
|--------------|----------|-----------|--------|
| AWS Cloud Practitioner | 6 | 20 | Activa |
| Google Cloud Digital Leader | 4 | ~18 | Activa (NUEVA) |
| Azure AI Fundamentals | 4 | ~19 | Activa (NUEVA) |

### CARRERAS (REFERENCIA)
- 3 carreras activas (IA, Ciencia Datos, Big Data)
- 278+ sessions con teoria + video
- 254 quizzes
- 3/278 con slides

---

## QA FINAL — CHECKLIST
- [ ] Login demo@itseia.ai → carreras → sesion → 8 tabs visibles
- [ ] Login preuni → 4 semanas → sesiones con teoria/video/quiz
- [ ] Login cursos@itseia.ai → mi-curso → Express → leccion con texto
- [ ] Login docente@itseia.ai → teacher dashboard → todas las paginas
- [ ] Login empresa@itseia.ai → b2b → capacitacion/team/reportes
- [ ] Certificaciones → catalogo 3 certs → detalle → simulacro
- [ ] 0 paginas con texto invisible
- [ ] 0 links rotos en sidebar
- [x] Build exitoso — 139 paginas
- [x] Deploy produccion — tecnologico.itseia.ai

---

## PRIORIDADES PROXIMA SESION

### URGENTE (bloquea demo):
1. **Cursos Pro Estandar/Completo vacios** — Necesita courses+modules+lessons en Supabase
2. **Lesson progress tracking** — No existe tabla, cursos pro no registran avance

### IMPORTANTE (mejora demo):
3. **Slides preuni** — Solo 2/18 tienen presentacion
4. **Slides carreras** — Solo 3/278 tienen presentacion
5. **QA visual en vivo** — Verificar cada producto con screenshots

### NICE TO HAVE:
6. **Session resources preuni** — 0 recursos adicionales
7. **Videos en cursos pro** — 0/25 lessons tienen video
8. **Contenido mas robusto cursos pro** — ~1K chars/leccion es poco

---

## DEMO PROTEGIDO
- **Git tag:** demo-estable-25mar (commit 7fa5e4c)
- **Vercel URL:** itseia-academy-online-9oghbpyja-hector-velascos-projects.vercel.app
- **Rollback:** `git checkout demo-estable-25mar && npm run build && npx vercel --prod`
