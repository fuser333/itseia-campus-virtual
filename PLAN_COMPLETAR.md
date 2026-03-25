# PLAN: COMPLETAR PLATAFORMA ITSEIA
**Fecha:** 25 marzo 2026
**Guardrail:** NADA se declara hecho sin verificacion real
**Ultimo deploy:** 25 mar 13:55 — 138 paginas, 0 errores

---

## FASE 2: FIXES (COMPLETADA)

### EQ-1: PREUNIVERSITARIO
- [x] F01: Crear rutas /preuni/semana-1..4 — Layout + 4 paginas con sesiones, progreso, navegacion
- [ ] F05: Verificar quiz funciona en preuniversitario — PENDIENTE (necesita probar en vivo)

### EQ-2: CURSOS PRO
- [x] F03-CP: Fix texto visible en /mi-curso — Colores corregidos a #1F2F58
- [ ] F04: Verificar presentaciones persisten en cursos — PENDIENTE (verificar en vivo)

### EQ-3: CERTIFICACIONES
- [ ] F03-CERT: Verificar texto visible en /certificaciones/* — PENDIENTE (verificar en vivo)
- [ ] F06: Verificar examen simulacro funciona end-to-end — PENDIENTE

### EQ-4: DOCENTES
- [x] F03-DOC: Fix teacher layout con style color explicito
- [x] F10: /teacher/tutorias reescrito con info practica (horarios, WhatsApp, pasos)

### EQ-5: EMPRESAS B2B
- [x] F02: Crear /b2b/capacitacion — Pagina funcional con programas activos
- [x] F03-B2B: /b2b/team y /b2b/reportes mejorados con datos reales

### EQ-6: PERFORMANCE
- [x] F07: Session page — 14 queries → 6 etapas con Promise.all

---

## FASE 3: COMPLETAR (EN PROGRESO)

### EQ-1: PREUNIVERSITARIO
- [x] C01: Paginas /preuni/semana-N con lista de sesiones — HECHO (4 paginas)
- [ ] C02: Vincular presentaciones Gamma a sesiones preuni en Supabase
- [ ] C03: Generar teoria markdown para sesiones sin teoria

### EQ-2: CURSOS PRO
- [ ] C09: Verificar contenido completo (teoria + quiz por leccion)

### EQ-3: CERTIFICACIONES
- [ ] C07: Verificar banco preguntas suficiente (min 20 por certificacion)

### EQ-4: DOCENTES
- [x] C08: Tutorias con info practica — HECHO (horarios, WhatsApp, pasos Daily.co)

### EQ-5: EMPRESAS B2B
- [x] C04: /b2b/capacitacion con programas activos — HECHO
- [x] C05: /b2b/team mejorado — HECHO
- [x] C06: /b2b/reportes mejorado — HECHO

### EQ-6: PERFORMANCE
- [x] C10: Parallel queries en session page — HECHO

---

## QA FINAL (PENDIENTE — requiere verificacion en vivo)
- [ ] Login como ALUMNO (demo@itseia.ai) → navegar carreras completo
- [ ] Login como PREUNI → navegar 4 semanas
- [ ] Login como CURSO PRO (cursos@itseia.ai) → navegar mi-curso
- [ ] Login como DOCENTE (docente@itseia.ai) → navegar teacher/*
- [ ] Login como EMPRESA (empresa@itseia.ai) → navegar b2b/*
- [ ] Verificar certificaciones accesibles
- [ ] 0 links rotos en sidebar
- [ ] 0 paginas con texto invisible
- [x] Build exitoso sin errores — 138 paginas
- [x] Deploy a produccion — tecnologico.itseia.ai

---

## INVENTARIO SUPABASE (25 mar 2026)
| Dato | Cantidad | Estado |
|------|----------|--------|
| Sessions totales | 278 | TODAS con teoria + video |
| Sessions con slides | 3/278 | Solo 1% tiene presentacion |
| Quizzes | 254 | OK |
| Exam questions (certs) | 20 | INSUFICIENTE — solo AWS |
| Certification domains | 6 | 2 certs x 3 dominios |
| Cursos Pro programs | 3 | Express, Estandar, Completo |
| Cursos Pro courses | 2 | Faltan modulos Estandar/Completo |
| Cursos Pro lessons | 25 | TODAS con contenido |

## PENDIENTES PARA PROXIMA SESION
1. **Verificacion en vivo** de cada producto con credenciales de prueba
2. **Slides**: Solo 3 de 278 sesiones tienen presentacion — vincular Gamma existentes o generar nuevas
3. **Exam questions**: Solo 20 — necesita 50+ para que los simulacros sean utiles
4. **Cursos Pro modulos**: Solo 2 cursos, el Estandar y Completo necesitan sus modulos propios
5. **QA final**: Probar login de cada tipo de usuario y navegar completo
