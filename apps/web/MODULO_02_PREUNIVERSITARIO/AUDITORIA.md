# AUDITORIA MODULO 02 -- PREUNIVERSITARIO

**Fecha:** 2026-03-31
**Modulo:** Preuniversitario IA (program type: preuni)
**Program ID:** 958d9795-8958-450e-828a-ff24eb4b0f00

---

## 1. RESUMEN EJECUTIVO

| Metrica | Valor |
|---------|-------|
| Semanas (paginas) | 4 |
| Subjects en Supabase | 4 |
| Sesiones totales en Supabase | 20 |
| Sesiones por semana | 5 cada una |
| Videos cargados | 0 de 20 |
| Quizzes cargados | 0 de 20 |
| Contenido teoria (markdown) | 0 de 20 |
| Recursos/PDFs | 0 de 20 |
| Sidebar links | 4 de 4 funcionan |
| Tabla de progreso | session_progress (existe y funciona) |

**Estado general: ESTRUCTURA COMPLETA, CONTENIDO VACIO**

---

## 2. ESTRUCTURA EN SUPABASE

### 2.1 Programa
- **Nombre:** Preuniversitario IA
- **Slug:** preuniversitario-ia
- **Tipo:** preuni
- **Activo:** Si

### 2.2 Semester
Solo 1 semester:
- `c8f0d3b2` -- "Preuniversitario IA - Modulo Completo (4 Semanas)"

### 2.3 Subjects (4 -- uno por semana)

| # | Subject ID | Nombre | Slug |
|---|-----------|--------|------|
| 1 | 28c2bfd1 | Semana 1: Fundamentos de IA Aplicada | preuni-semana-1-fundamentos-ia |
| 2 | 681161a4 | Semana 2: Analisis de Datos con IA | preuni-semana-2-datos-ia |
| 3 | 2a7ed6f2 | Semana 3: Machine Learning y Creacion de Apps | preuni-semana-3-ml-apps |
| 4 | 4eac7f01 | Semana 4: Proyecto Final Integrador | preuni-semana-4-proyecto-final |

### 2.4 Sesiones (20 total -- 5 por semana)

**Semana 1: Fundamentos de IA Aplicada**
| # | Titulo | Duracion | Video | Quiz | Teoria |
|---|--------|----------|-------|------|--------|
| 1 | Dia 1: Bienvenida al Futuro con IA | 120 min | NO | NO | NO |
| 2 | Dia 2: Prompt Engineering - Habla Como Experto | 120 min | NO | NO | NO |
| 3 | Dia 3: IA para Productividad Extrema | 120 min | NO | NO | NO |
| 4 | Dia 4: Python con IA como Copiloto | 120 min | NO | NO | NO |
| 5 | Dia 5: Diseno Visual con IA Generativa | 120 min | NO | NO | NO |

**Semana 2: Analisis de Datos con IA**
| # | Titulo | Duracion | Video | Quiz | Teoria |
|---|--------|----------|-------|------|--------|
| 1 | Dia 6: Excel + IA = Superpoderes | 120 min | NO | NO | NO |
| 2 | Dia 7: Python para Datos (Pandas con IA) | 120 min | NO | NO | NO |
| 3 | Dia 8: Visualizacion de Datos con IA | 120 min | NO | NO | NO |
| 4 | Dia 9: Streamlit - Apps de Datos Interactivas | 120 min | NO | NO | NO |
| 5 | Dia 10: Mini-Proyecto 1 - Dashboard de Datos Ecuador | 120 min | NO | NO | NO |

**Semana 3: Machine Learning y Creacion de Apps**
| # | Titulo | Duracion | Video | Quiz | Teoria |
|---|--------|----------|-------|------|--------|
| 1 | Dia 11: Introduccion a Machine Learning | 120 min | NO | NO | NO |
| 2 | Dia 12: Google AI Studio - Crea Apps con Gemini | 120 min | NO | NO | NO |
| 3 | Dia 13: Lovable.dev - Apps Sin Codigo | 120 min | NO | NO | NO |
| 4 | Dia 14: Replit - Programacion Colaborativa con IA | 120 min | NO | NO | NO |
| 5 | Dia 15: Automatizacion con IA | 120 min | NO | NO | NO |

**Semana 4: Proyecto Final Integrador**
| # | Titulo | Duracion | Video | Quiz | Teoria |
|---|--------|----------|-------|------|--------|
| 1 | Dia 16: Planificacion del Proyecto Final | 120 min | NO | NO | NO |
| 2 | Dia 17: Desarrollo Sprint 1 | 120 min | NO | NO | NO |
| 3 | Dia 18: Desarrollo Sprint 2 | 120 min | NO | NO | NO |
| 4 | Dia 19: Finalizacion y Preparacion de Presentacion | 120 min | NO | NO | NO |
| 5 | Dia 20: Presentaciones Finales y Certificacion | 120 min | NO | NO | NO |

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

**PROBLEMA CRITICO:** El codigo usa `semesters.number = WEEK_NUMBER` pero solo existe 1 semester (number=1). Las semanas 2, 3 y 4 NO encontraran semester y mostraran "El contenido de esta semana aun no esta disponible."

### 3.3 URL de sesiones
Cada sesion linkea a: `/carreras/{program.slug}/materia/{subject.slug}/sesion/{session.number}`
Ejemplo: `/carreras/preuniversitario-ia/materia/preuni-semana-1-fundamentos-ia/sesion/1`
Esto requiere que la ruta `/carreras/[slug]/materia/[materiaSlug]/sesion/[sesionNumber]` exista y funcione.

---

## 4. SIDEBAR (MENU_PREUNI)

| Link | Label | Destino | Funciona |
|------|-------|---------|----------|
| /dashboard | Dashboard | SI | SI |
| /preuni/semana-1 | Semana 1: Fundamentos IA | SI | SI (si hay datos en semester #1) |
| /preuni/semana-2 | Semana 2: Datos con IA | SI | PARCIAL (muestra "no disponible" por falta de semester #2) |
| /preuni/semana-3 | Semana 3: ML y Apps | SI | PARCIAL (muestra "no disponible" por falta de semester #3) |
| /preuni/semana-4 | Semana 4: Proyecto Final | SI | PARCIAL (muestra "no disponible" por falta de semester #4) |
| /ai-lab | AI Lab | SI | SI |
| /biblioteca | Biblioteca | SI | SI |
| /payments | Pagos | SI | SI |
| /profile | Perfil | SI | SI |
| /certificates | Certificado | SI | SI |

---

## 5. PROBLEMAS ENCONTRADOS

### P1 -- CRITICO: Solo 1 semester, pero 4 paginas esperan 4 semesters
- **Que pasa:** El codigo busca `semesters.number = 2/3/4` pero solo existe semester number=1
- **Impacto:** Semanas 2, 3 y 4 siempre muestran "contenido no disponible"
- **Solucion:** Crear 3 semesters adicionales (numbers 2, 3, 4) para el programa preuni, O refactorizar las paginas para usar subjects directamente (cada subject ya corresponde a una semana)

### P2 -- CRITICO: 0 contenido en las 20 sesiones
- **Que pasa:** Las sesiones tienen titulo y descripcion, pero ningun contenido educativo
- **Campos vacios:** video_url, content (markdown/teoria), quiz, recursos/PDFs
- **Impacto:** Incluso si se arregla P1, las sesiones estarian vacias al acceder

### P3 -- MEDIO: Todas las sesiones tienen 120 min
- **Que pasa:** Todas las 20 sesiones muestran "120 min" -- probablemente placeholder
- **Impacto:** Duraciones no realistas para sesiones individuales

### P4 -- BAJO: Hay 1 course en tabla courses que duplica subject de semana 1
- **Dato:** Existe un registro en `courses` (id: 9a9948eb, "Semana 1: Fundamentos de IA Aplicada") ademas del subject correspondiente
- **Impacto:** No afecta el flujo actual pero puede causar confusion en /mi-curso

### P5 -- BAJO: Pagina semana-4 linka a /certificates que puede no existir aun
- **Dato:** El boton "Ver Certificados" al final de semana 4 apunta a /certificates
- **Impacto:** Si la ruta no existe, error 404

---

## 6. QUE FALTA PARA ESTAR COMPLETO

### Prioridad 1 (Bloqueo total)
- [ ] Crear semesters #2, #3, #4 para el programa preuni, y reasignar subjects a ellos
  - Subject "Semana 2" -> semester #2
  - Subject "Semana 3" -> semester #3
  - Subject "Semana 4" -> semester #4

### Prioridad 2 (Contenido)
- [ ] Cargar video_url para las 20 sesiones (o al menos las de semana 1)
- [ ] Cargar contenido teorico (markdown) para las 20 sesiones
- [ ] Crear quizzes para las 20 sesiones
- [ ] Cargar recursos/PDFs donde aplique
- [ ] Ajustar duraciones reales por sesion

### Prioridad 3 (Nice to have)
- [ ] Verificar que la ruta `/carreras/preuniversitario-ia/materia/.../sesion/N` renderiza correctamente
- [ ] Verificar que /certificates funciona
- [ ] Agregar navegacion "ir a semana anterior/siguiente" consistente

---

## 7. METRICAS DE COMPLETITUD

| Componente | Estado | % |
|------------|--------|---|
| Estructura DB (programa, semester, subjects) | Parcial (falta 3 semesters) | 40% |
| Sesiones (registros) | Completo (20/20 existen) | 100% |
| Contenido sesiones (video+teoria+quiz) | Vacio | 0% |
| Paginas Next.js (4 semanas) | Completas (codigo listo) | 100% |
| Sidebar | Completo | 100% |
| Progreso tracking | Funcional (session_progress existe) | 100% |
| **TOTAL MODULO** | **Estructura lista, sin contenido** | **~40%** |
