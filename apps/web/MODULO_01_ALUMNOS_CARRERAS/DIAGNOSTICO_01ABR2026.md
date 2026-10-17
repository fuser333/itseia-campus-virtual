# DIAGNOSTICO MODULO 01 — ALUMNOS CARRERAS
**Fecha:** 1 abril 2026
**Auditor:** Claude Opus 4.6
**Scope:** Supabase data verification + code fix + video cleanup

---

## ACCIONES REALIZADAS HOY

### 1. FIX P0 CRITICO: Logica de completion (HECHO)
**Archivo:** `src/app/api/sessions/[id]/progress/route.ts`

**Problema:** La API requeria 6 campos `true` para marcar sesion como completada (video_watched, slides_viewed, theory_read, quiz_passed, assignment_submitted, ai_lab_used). Pero solo 48 sesiones tienen quiz y 24 tienen assignment. Las ~1,664 sesiones restantes NUNCA podian llegar a `completed=true`.

**Solucion:** La completion ahora es CONDICIONAL:
- Si la sesion NO tiene video → `video_watched` auto-true
- Si la sesion NO tiene slides → `slides_viewed` auto-true
- Si la sesion NO tiene quiz → `quiz_passed` auto-true
- Si la sesion NO tiene assignment → `assignment_submitted` auto-true
- La API verifica en BD si existe quiz/assignment activo para esa sesion
- Al crear nuevo progress record, campos N/A se inicializan en true
- Completion requiere al menos 1 tipo de contenido completado + ai_lab_used

### 2. LIMPIEZA DE VIDEOS ROTOS (HECHO)
**531 sesiones** tenian video_url apuntando a videos de YouTube que devuelven 404 (video eliminado/privado). Se verifico CADA URL unica (397 URLs) via YouTube oEmbed API.

**84 sesiones adicionales** tenian video que si existia pero estaba asignado al TEMA INCORRECTO (ej: un video de "Ciberseguridad Basica" asignado a sesion de "Falacias Logicas").

**Total limpiado:** 615 sesiones → video_url set to NULL

---

## ESTADO ACTUAL (POST-CLEANUP)

### Estructura Academica
| Metrica | Valor |
|---------|-------|
| Carreras activas | 3 (IA, Ciencia de Datos, Big Data) |
| Periodos por carrera | 5 |
| Total materias (subjects) | 87 |
| Total sesiones carreras | 1,712 |
| Total sesiones plataforma | 1,958 |

### Contenido por Tipo
| Tipo Contenido | Sesiones | Cobertura |
|----------------|----------|-----------|
| Theory markdown (>1000 chars) | 1,704 | 99.5% |
| Theory markdown (>2000 chars) | 1,025 | 59.9% |
| Theory markdown (>5000 chars) | 847 | 49.5% |
| Video (verified, correct topic) | 393 | 23.0% |
| Quizzes | 48 | 2.8% |
| Assignments | 24 | 1.4% |
| Session Resources | 68 | 4.0% |
| Slides | 2 | 0.1% |

### Videos por Carrera/Periodo (Post-Cleanup)
| Carrera | P1 | P2 | P3 | P4 | P5 | Total |
|---------|----|----|----|----|-----|-------|
| IA (464 ses.) | ~50 | ~37 | ~37 | ~33 | ~20 | ~177 |
| CD (608 ses.) | ~61 | ~37 | ~31 | ~16 | ~16 | ~161 |
| BD (640 ses.) | ~63 | ~37 | ~28 | 0 | ~11 | ~139 |
| **Notas** | Mejor | Decent | Partial | Muy bajo | Muy bajo | |

### Lo que SI funciona
- Theory al 99.5% (1,704/1,712 sesiones con >1000 chars)
- 12/12 componentes de sesion compilados y funcionales
- 12/12 rutas del MENU_ALUMNO con pagina
- Progress tracking ahora con completion CONDICIONAL (fix de hoy)
- 393 videos verificados y correctamente asignados
- QuizEngine v2 con integridad
- AI Lab v2 con 4 sub-tabs
- Sidebar dinamico (7 tipos de menu)

---

## SCORE ESTIMADO: 32/100

| Componente | Peso | Score | Subtotal |
|------------|------|-------|----------|
| Theory | 20% | 95/100 | 19.0 |
| Video | 25% | 23/100 | 5.8 |
| Quizzes | 15% | 3/100 | 0.5 |
| Assignments | 15% | 1/100 | 0.2 |
| Completion Logic | 10% | 90/100 | 9.0 |
| Slides | 5% | 0/100 | 0.0 |
| Resources | 5% | 4/100 | 0.2 |
| AI Context/Prompt | 5% | 65/100 | 3.3 |
| **TOTAL** | **100%** | | **38.0** |

Nota: Subio de ~35 (auditoria anterior) a 38 gracias a fix de completion y limpieza de videos rotos.

---

## TOP 10 ISSUES CRITICOS (Prioridad)

### P0 — BLOCKER (completado hoy)
1. ~~Completion imposible~~ **FIXED** — Logica ahora condicional

### P1 — CRITICO (bloquea calidad para alumno)
2. **1,319 sesiones sin video (77%)** — Big Data P4 tiene 192 sesiones con 0 videos. Necesita esfuerzo masivo de curado de contenido YouTube en espanol.
3. **Solo 48 quizzes para 1,712 sesiones (2.8%)** — Minimo deberian ser 87 (1 por materia). Ideal: 1 por sesion = 1,712.
4. **Solo 24 assignments para 1,712 sesiones (1.4%)** — 352 ejercicios en carpeta `recoleccion/` sin subir a BD. Gap de 328 ejercicios.
5. **54% de URLs originales estaban rotas (404)** — Los videos fueron generados con IDs inventados. Todo video nuevo debe ser VERIFICADO con oEmbed antes de insertar.

### P2 — ALTO (mejora significativa)
6. **AI context/prompt incompleto** — P4-P5 de CD y BD tienen 0-30% cobertura. Afecta la experiencia del AI Lab.
7. **Assignments desbalanceados** — IA: 16, CD: 4, BD: 4. Desigualdad severa.
8. **68 session resources para 1,712 sesiones** — Insuficiente. Agregar links a docs, papers, herramientas.

### P3 — MEDIO (polish)
9. **Slides practicamente inexistentes** — Solo 2 de 1,712 sesiones. Considerar generar Google Slides automaticamente.
10. **Sesiones desiguales por periodo** — BD P4 tiene 192 sesiones vs IA P5 con 80. Revisar si hay sesiones duplicadas o vacias.

---

## PROXIMOS PASOS RECOMENDADOS

### Semana 1: Quick Wins
- [ ] Subir los 352 ejercicios de `recoleccion/` como assignments (script batch)
- [ ] Generar 87 quizzes (1 por materia) con IA → insertar en BD
- [ ] Completar AI context/prompt para P4-P5

### Semana 2: Videos
- [ ] Curar videos YouTube en espanol para P1-P2 (288 sesiones x 3 carreras)
  - Canales recomendados: DotCSV, MoureDev, Fazt, Platzi, Codigo Facilito, HolaMundo, Soy Dalto, Pelado Nerd, Julio Profe, freeCodeCamp Espanol
  - REGLA: Verificar cada video con oEmbed ANTES de insertar
- [ ] Para P3-P5: considerar grabar videos propios o usar playlists completas

### Semana 3-4: Completar
- [ ] Generar slides (Google Slides o PDF) para las 87 materias
- [ ] Agregar session_resources (min 1 por materia = 87)
- [ ] Balancear assignments entre las 3 carreras

---

## ARCHIVOS MODIFICADOS

```
apps/web/src/app/api/sessions/[id]/progress/route.ts  — Fix completion condicional
```

## DATOS SUPABASE MODIFICADOS

```
sessions.video_url → NULL para 615 sesiones (531 broken + 84 mismatched)
```
