# AUDITORIA MODULO 02 -- PREUNIVERSITARIO

**Fecha:** 2026-04-01 (actualizado)
**Modulo:** Preuniversitario IA (program type: preuni)
**Program ID:** 958d9795-8958-450e-828a-ff24eb4b0f00

---

## 1. RESUMEN EJECUTIVO

| Metrica | Valor |
|---------|-------|
| Semanas (paginas) | 4 |
| Semesters en Supabase | 4 (CORREGIDO -- eran 1) |
| Subjects en Supabase | 4 |
| Sesiones totales en Supabase | 20 |
| Sesiones por semana | 5 cada una |
| Videos cargados | 20 de 20 (YouTube) |
| Quizzes cargados | 20 de 20 |
| Contenido teoria (markdown) | Pendiente verificar en sesion page |
| Sidebar links | 4 de 4 funcionan |
| Tabla de progreso | session_progress (existe y funciona) |

**Estado general: ESTRUCTURA COMPLETA Y FUNCIONAL**

---

## 2. ESTRUCTURA EN SUPABASE

### 2.1 Programa
- **Nombre:** Preuniversitario IA
- **Slug:** preuniversitario-ia
- **Tipo:** preuni
- **Activo:** Si

### 2.2 Semesters (4 -- uno por semana) -- CORREGIDO 2026-04-01

| # | Semester ID | Nombre |
|---|------------|--------|
| 1 | c8f0d3b2 | Semana 1: Fundamentos de IA Aplicada |
| 2 | ea169814 | Semana 2: Analisis de Datos con IA |
| 3 | 20de74a7 | Semana 3: Machine Learning y Creacion de Apps |
| 4 | 917529a7 | Semana 4: Proyecto Final Integrador |

### 2.3 Subjects (4 -- uno por semana, asignados a su semester correcto)

| # | Subject ID | Nombre | Slug | Semester |
|---|-----------|--------|------|----------|
| 1 | 28c2bfd1 | Semana 1: Fundamentos de IA Aplicada | preuni-semana-1-fundamentos-ia | c8f0d3b2 (#1) |
| 2 | 681161a4 | Semana 2: Analisis de Datos con IA | preuni-semana-2-datos-ia | ea169814 (#2) |
| 3 | 2a7ed6f2 | Semana 3: Machine Learning y Creacion de Apps | preuni-semana-3-ml-apps | 20de74a7 (#3) |
| 4 | 4eac7f01 | Semana 4: Proyecto Final Integrador | preuni-semana-4-proyecto-final | 917529a7 (#4) |

### 2.4 Sesiones (20 total -- 5 por semana)

**Semana 1: Fundamentos de IA Aplicada**
| # | Titulo | Duracion | Video | Quiz |
|---|--------|----------|-------|------|
| 1 | Dia 1: Bienvenida al Futuro con IA | 120 min | SI (YouTube) | SI |
| 2 | Dia 2: Prompt Engineering - Habla Como Experto | 120 min | SI (YouTube) | SI |
| 3 | Dia 3: IA para Productividad Extrema | 120 min | SI (YouTube) | SI |
| 4 | Dia 4: Python con IA como Copiloto | 120 min | SI (YouTube) | SI |
| 5 | Dia 5: Diseno Visual con IA Generativa | 120 min | SI (YouTube) | SI |

**Semana 2: Analisis de Datos con IA**
| # | Titulo | Duracion | Video | Quiz |
|---|--------|----------|-------|------|
| 1 | Dia 6: Excel + IA = Superpoderes | 120 min | SI (YouTube) | SI |
| 2 | Dia 7: Python para Datos (Pandas con IA) | 120 min | SI (YouTube) | SI |
| 3 | Dia 8: Visualizacion de Datos con IA | 120 min | SI (YouTube) | SI |
| 4 | Dia 9: Streamlit - Apps de Datos Interactivas | 120 min | SI (YouTube) | SI |
| 5 | Dia 10: Mini-Proyecto 1 - Dashboard de Datos Ecuador | 120 min | SI (YouTube) | SI |

**Semana 3: Machine Learning y Creacion de Apps**
| # | Titulo | Duracion | Video | Quiz |
|---|--------|----------|-------|------|
| 1 | Dia 11: Introduccion a Machine Learning | 120 min | SI (YouTube) | SI |
| 2 | Dia 12: Google AI Studio - Crea Apps con Gemini | 120 min | SI (YouTube) | SI |
| 3 | Dia 13: Lovable.dev - Apps Sin Codigo | 120 min | SI (YouTube) | SI |
| 4 | Dia 14: Replit - Programacion Colaborativa con IA | 120 min | SI (YouTube) | SI |
| 5 | Dia 15: Automatizacion con IA | 120 min | SI (YouTube) | SI |

**Semana 4: Proyecto Final Integrador**
| # | Titulo | Duracion | Video | Quiz |
|---|--------|----------|-------|------|
| 1 | Dia 16: Planificacion del Proyecto Final | 120 min | SI (YouTube) | SI |
| 2 | Dia 17: Desarrollo Sprint 1 | 120 min | SI (YouTube) | SI |
| 3 | Dia 18: Desarrollo Sprint 2 | 120 min | SI (YouTube) | SI |
| 4 | Dia 19: Finalizacion y Preparacion de Presentacion | 120 min | SI (YouTube) | SI |
| 5 | Dia 20: Presentaciones Finales y Certificacion | 120 min | SI (YouTube) | SI |

---

## 3. PAGINAS Y CODIGO

### 3.1 Archivos

| Archivo | Existe | Funcion |
|---------|--------|---------|
| `/preuni/layout.tsx` | SI | Auth guard + SidebarWrapper + contenedor max-w-4xl |
| `/preuni/semana-1/page.tsx` | SI | Server component, fetch program->semester->subjects->sessions->progress |
| `/preuni/semana-2/page.tsx` | SI | Identico patron, WEEK_NUMBER=2 |
| `/preuni/semana-3/page.tsx` | SI | Identico patron, WEEK_NUMBER=3 |
| `/preuni/semana-4/page.tsx` | SI | Identico patron + banner de completitud |

### 3.2 Flujo de datos (cada semana-N)
1. Busca `programs` donde type="preuni" y is_active=true
2. Busca `semesters` donde program_id=X y number=WEEK_NUMBER
3. Busca `subjects` para ese semester
4. Busca `sessions` para esos subjects
5. Busca `session_progress` para el user actual

**CORREGIDO:** Ahora existen 4 semesters (numbers 1-4), cada uno con su subject asignado. Las 4 semanas cargan correctamente.

### 3.3 URL de sesiones
Cada sesion linkea a: `/carreras/{program.slug}/materia/{subject.slug}/sesion/{session.number}`
Ejemplo: `/carreras/preuniversitario-ia/materia/preuni-semana-1-fundamentos-ia/sesion/1`
Ruta Next.js: `/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx` -- EXISTE

---

## 4. SIDEBAR (MENU_PREUNI)

| Link | Label | Destino | Funciona |
|------|-------|---------|----------|
| /dashboard | Dashboard | SI | SI |
| /preuni/semana-1 | Semana 1: Fundamentos IA | SI | SI |
| /preuni/semana-2 | Semana 2: Datos con IA | SI | SI (CORREGIDO) |
| /preuni/semana-3 | Semana 3: ML y Apps | SI | SI (CORREGIDO) |
| /preuni/semana-4 | Semana 4: Proyecto Final | SI | SI (CORREGIDO) |
| /ai-lab | AI Lab | SI | SI |
| /biblioteca | Biblioteca | SI | SI |
| /payments | Pagos | SI | SI |
| /profile | Perfil | SI | SI |
| /certificates | Certificado | SI | SI |

---

## 5. PROBLEMAS ENCONTRADOS Y ESTADO

### P1 -- CRITICO: Solo 1 semester, pero 4 paginas esperan 4 semesters -- RESUELTO
- **Que se hizo:** Creados 3 semesters nuevos (numbers 2, 3, 4) y reasignados subjects correspondientes
- **Semesters creados:** ea169814 (#2), 20de74a7 (#3), 917529a7 (#4)
- **Subjects reasignados:** 681161a4 -> sem #2, 2a7ed6f2 -> sem #3, 4eac7f01 -> sem #4
- **Estado:** RESUELTO

### P2 -- La auditoria anterior decia 0 contenido -- DATOS INCORRECTOS EN AUDITORIA ANTERIOR
- **Realidad:** Las 20 sesiones SI tienen video_url (YouTube) y las 20 tienen quiz asociado
- **Pendiente:** Verificar contenido markdown/teoria dentro de cada sesion
- **Estado:** PARCIALMENTE RESUELTO (videos y quizzes existen)

### P3 -- MEDIO: Todas las sesiones tienen 120 min
- **Que pasa:** Todas las 20 sesiones muestran "120 min" -- probablemente placeholder
- **Estado:** PENDIENTE (bajo impacto)

### P4 -- BAJO: Hay 1 course en tabla courses que duplica subject de semana 1
- **Estado:** PENDIENTE (no afecta flujo)

### P5 -- BAJO: Pagina semana-4 linka a /certificates
- **Estado:** PENDIENTE verificacion

---

## 6. QUE FALTA PARA ESTAR COMPLETO

### Prioridad 1 (Bloqueo total)
- [x] Crear semesters #2, #3, #4 para el programa preuni -- HECHO 2026-04-01
- [x] Reasignar subjects a semesters correctos -- HECHO 2026-04-01

### Prioridad 2 (Contenido)
- [x] Videos YouTube en las 20 sesiones -- YA EXISTIAN
- [x] Quizzes en las 20 sesiones -- YA EXISTIAN
- [ ] Verificar contenido teorico (markdown) en sesion page
- [ ] Ajustar duraciones reales por sesion (120 min placeholder)

### Prioridad 3 (Nice to have)
- [x] Ruta `/carreras/[slug]/materia/[subjectSlug]/sesion/[num]/page.tsx` existe
- [ ] Verificar que /certificates funciona end-to-end
- [x] Navegacion semana anterior/siguiente ya implementada en cada page

---

## 7. METRICAS DE COMPLETITUD

| Componente | Estado | % |
|------------|--------|---|
| Estructura DB (programa, semesters, subjects) | Completo (4 semesters, 4 subjects) | 100% |
| Sesiones (registros) | Completo (20/20 existen) | 100% |
| Videos (YouTube URLs) | Completo (20/20) | 100% |
| Quizzes | Completo (20/20) | 100% |
| Contenido teoria (markdown) | Pendiente verificar | ? |
| Paginas Next.js (4 semanas) | Completas y funcionales | 100% |
| Sidebar | Completo | 100% |
| Progreso tracking | Funcional (session_progress existe) | 100% |
| **TOTAL MODULO** | **Estructura y contenido base completos** | **~90%** |
