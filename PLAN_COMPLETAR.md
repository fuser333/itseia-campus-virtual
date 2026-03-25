# PLAN: COMPLETAR PLATAFORMA ITSEIA
**Fecha:** 25 marzo 2026
**Guardrail:** NADA se declara hecho sin verificacion real

---

## FASE 2: FIXES (Prioridad 1)

### EQ-1: PREUNIVERSITARIO
- [ ] F01: Crear rutas /preuni/semana-1..4 que redirijan a sesiones existentes en Supabase
  - Verificar: Login como preuni, click semana-1 en sidebar → ve sesiones
- [ ] F05: Verificar quiz funciona en preuniversitario
  - Verificar: Completar un quiz, ver resultado

### EQ-2: CURSOS PRO
- [ ] F03-CP: Verificar texto visible en /mi-curso y /courses/[id]/lesson/[lessonId]
  - Verificar: Abrir leccion, teoria legible, instrucciones legibles
- [ ] F04: Verificar presentaciones persisten en cursos (si aplica)
  - Verificar: Cambiar tabs, volver a presentacion

### EQ-3: CERTIFICACIONES
- [ ] F03-CERT: Verificar texto visible en /certificaciones/[slug] y examen
  - Verificar: Abrir detalle certificacion, texto legible
- [ ] F06: Verificar examen simulacro funciona end-to-end
  - Verificar: Iniciar examen → responder → submit → ver resultados

### EQ-4: DOCENTES
- [ ] F03-DOC: Verificar texto visible en /teacher/*
  - Verificar: Login como docente, navegar todas las paginas
- [ ] F10: Mejorar /teacher/tutorias (al menos info util, no solo "coming soon")
  - Verificar: Pagina muestra info de como solicitar tutoria

### EQ-5: EMPRESAS B2B
- [ ] F02: Crear /b2b/capacitacion (link roto en sidebar)
  - Verificar: Login como empresa, click "Capacitacion Activa" → no 404
- [ ] F03-B2B: Verificar texto visible en /b2b/*
  - Verificar: Dashboard, team, reportes — todo legible

### EQ-6: PERFORMANCE
- [ ] F07: Optimizar session page — queries en paralelo
  - Verificar: Session carga en <3s (medido en Network tab)

---

## FASE 3: COMPLETAR (Prioridad 2)

### EQ-1: PREUNIVERSITARIO
- [ ] C01: Paginas /preuni/semana-N con lista de sesiones de esa semana
- [ ] C02: Vincular presentaciones Gamma a sesiones preuni
- [ ] C03: Generar teoria markdown para sesiones sin teoria

### EQ-2: CURSOS PRO
- [ ] C09: Verificar contenido completo (teoria + quiz por leccion)

### EQ-3: CERTIFICACIONES
- [ ] C07: Verificar banco preguntas suficiente (min 20 por certificacion)

### EQ-4: DOCENTES
- [ ] C08: Tutorias con info practica (horarios, como agendar, contacto)

### EQ-5: EMPRESAS B2B
- [ ] C04: /b2b/capacitacion con programas activos del equipo
- [ ] C05: /b2b/team con info basica (no placeholder vacio)
- [ ] C06: /b2b/reportes con al menos datos del enrollment

### EQ-6: PERFORMANCE
- [ ] C10: Parallel queries en session page + lazy loading tabs

---

## QA FINAL
- [ ] Login como ALUMNO (demo@itseia.ai) → navegar carreras completo
- [ ] Login como PREUNI → navegar 4 semanas
- [ ] Login como CURSO PRO (cursos@itseia.ai) → navegar mi-curso
- [ ] Login como DOCENTE (docente@itseia.ai) → navegar teacher/*
- [ ] Login como EMPRESA (empresa@itseia.ai) → navegar b2b/*
- [ ] Verificar certificaciones accesibles
- [ ] 0 links rotos en sidebar
- [ ] 0 paginas con texto invisible
- [ ] Build exitoso sin errores
- [ ] Deploy a produccion
