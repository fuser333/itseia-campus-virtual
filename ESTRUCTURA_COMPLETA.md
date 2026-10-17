# ESTRUCTURA COMPLETA — ITSEIA Academy Online

**Fecha:** 21 marzo 2026
**Vision:** La primera plataforma educativa del mundo que combina titulo SENESCYT + AI Lab multi-modelo + peer review + portafolio profesional

---

## ECOSISTEMA COMPLETO

```
                    ┌─────────────────────┐
                    │  ITSEIA ACADEMY      │
                    │  (la plataforma)     │
                    └──────────┬──────────┘
                               │
        ┌──────────┬───────────┼───────────┬──────────┐
        │          │           │           │          │
   ┌─────────┐┌─────────┐┌─────────┐┌─────────┐┌─────────┐
   │Carreras ││Cursos   ││Preuni   ││Bootcamps││Corporate│
   │Online   ││Profes.  ││Online   ││3 meses  ││B2B      │
   │(titulo) ││$97-297  ││$180     ││$497     ││$2K-10K  │
   └────┬────┘└────┬────┘└────┬────┘└────┬────┘└────┬────┘
        │          │          │          │          │
        └──────────┴──────┬───┴──────────┴──────────┘
                          │
                    GRADUADOS / CERTIFICADOS
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌─────────┐      ┌─────────┐      ┌─────────┐
   │  H3L    │      │ImagemIA │      │ Strata  │
   │Pipeline │      │Casos    │      │Herram.  │
   │talento  │      │reales   │      │estudio  │
   └─────────┘      └─────────┘      └─────────┘
```

---

## ARQUITECTURA DE LA PLATAFORMA

### URLs
```
itseia.ai/              → cPanel (web institucional, sin cambios)
tecnologico.itseia.ai/      → Vercel (Next.js + Supabase) ← LA PLATAFORMA
```

### Stack
```
Framework:    Next.js 15 (App Router)
Language:     TypeScript
CSS:          Tailwind CSS 4 + shadcn/ui
Auth:         Supabase Auth (ya existente)
DB:           Supabase PostgreSQL (ya existente)
ORM:          supabase-js (NO Prisma)
Storage:      Supabase Storage
AI Proxy:     Next.js API Routes → OpenRouter / Gemini
AI Lab:       Sandpack (editor browser) + API proxy
Email:        Resend
Pagos:        Stripe Checkout
Deploy:       Vercel + Supabase
```

### Costos operativos
| Escala | Total/mes |
|--------|-----------|
| 50 alumnos | $12 |
| 200 alumnos | $95 |
| 500 alumnos | $170 |

---

## MODULOS DE LA PLATAFORMA

### Para el ALUMNO
1. Dashboard personal (progreso, cohorte, nivel XP)
2. Mis materias (split-screen teoria + lab)
3. AI Lab (ChatGPT + Claude + Gemini + comparador)
4. Mis proyectos / Portafolio
5. Mi cohorte (foro, ranking, deadlines)
6. Mis certificados
7. Mi estado de cuenta / pagos

### Para el DOCENTE
8. Panel docente (materias asignadas)
9. Subir contenido (texto, video, PDFs)
10. Revisar y calificar proyectos
11. Ver progreso alumnos

### Para el ADMIN (Hector)
12. Gestion mallas curriculares (cargar/editar)
13. Gestion cohortes
14. Gestion pagos/matriculas
15. Consumo API IA (costos por alumno)
16. Emision certificados
17. CRM leads basico
18. Analytics dashboard

### Sitio publico (marketing)
19. Landing de carreras/programas
20. Formulario de admision
21. Catalogo de cursos

---

## ROLES DEL SISTEMA

| Rol | Acceso |
|-----|--------|
| Super Admin (Hector) | Todo |
| Coordinacion Academica | Mallas, cohortes, docentes, progreso |
| Docente | Sus materias, contenido, calificaciones |
| Estudiante | Dashboard, materias, AI Lab, portafolio |
| Finanzas | Pagos, matriculas, morosos |
| Lead (no logueado) | Sitio publico, formulario admision |

---

## INTEGRACIONES CON EMPRESAS (por fase)

### H3L → Pipeline de talento
- Fase 2: Proyectos con datos simulados de auditoria
- Fase 3: Pasantias reales para mejores alumnos
- Fase 4: Bolsa de trabajo conectada a clientes H3L (7 paises)

### Strata → Herramienta de estudio
- Fase 2: Acceso a Strata dentro del AI Lab
- Fase 3: Alumnos certificados en uso de Strata
- Fase 4: Descuento Strata para graduados

### ImagemIA → Casos reales
- Fase 3: Datos reales de imagenologia para proyectos
- Fase 4: Pipeline de talento para equipo ImagemIA

---

## PRODUCTOS Y PRECIOS

| Producto | Precio | CES? | Fase |
|---------|--------|------|------|
| Preuniversitario online | $180 | NO | 1 |
| Cursos profesionales (Express) | $97 | NO | 1 |
| Cursos profesionales (Estandar) | $197 | NO | 1 |
| Cursos profesionales (Completo) | $297 | NO | 1 |
| Bootcamp IA (3 meses) | $497 | NO | 2 |
| Carrera online (pension) | $220/mes | SI (tramitar) | 3 |
| Capacitacion B2B | $2K-10K | NO | 3 |

---

*Documento creado: 21 marzo 2026*
