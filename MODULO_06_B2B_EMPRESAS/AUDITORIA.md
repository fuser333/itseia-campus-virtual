# AUDITORIA MODULO 06 — B2B EMPRESAS
**Fecha:** 2026-03-31
**Estado general:** FUNCIONAL — 4 paginas, role guard "finanzas", contenido parcialmente estatico

---

## 1. PAGINAS QUE EXISTEN

| Ruta | Archivo | Tipo | Estado |
|------|---------|------|--------|
| `/b2b` | page.tsx (server) | Dashboard corporativo | FUNCIONA |
| `/b2b/team` | page.tsx (server) | Mi Equipo | FUNCIONA |
| `/b2b/reportes` | page.tsx (server) | Reportes del equipo | FUNCIONA |
| `/b2b/capacitacion` | page.tsx (server) | Capacitacion activa | FUNCIONA |
| `/b2b/layout.tsx` | layout (server) | Auth guard + SidebarWrapper | FUNCIONA |

**Total: 5 archivos, 4 rutas unicas + layout**

---

## 2. SIDEBAR Y NAVEGACION

- **Layout:** Usa `SidebarWrapper` (sidebar global del campus), NO sidebar propio
- **Navegacion interna:** Via quick action cards, no sidebar dedicado B2B
- **Auth guard:** Si (redirect a /login si no autenticado)
- **Role guard:** Si — solo role="finanzas" puede acceder (redirect a /dashboard si otro rol)

### Links internos entre paginas B2B:

| Desde | Hacia | Funciona? |
|-------|-------|-----------|
| /b2b | /b2b/team | SI (Quick Action card) |
| /b2b | /b2b/reportes | SI (Quick Action card) |
| /b2b | /payments | SI (KPI card link) |
| /b2b/team | /b2b | SI (breadcrumb) |
| /b2b/team | /b2b/capacitacion | SI (arrow link) |
| /b2b/reportes | /b2b | SI (breadcrumb) |
| /b2b/reportes | /b2b/capacitacion | SI |
| /b2b/reportes | /certificates | SI |
| /b2b/reportes | /payments | SI |
| /b2b/capacitacion | /b2b | SI (breadcrumb) |
| /b2b/capacitacion | /payments | SI |
| /b2b/capacitacion | /b2b/reportes | SI |

**Resultado: Todos los links funcionan correctamente**

---

## 3. CONTENIDO EN SUPABASE

Las paginas B2B consultan estas tablas:

| Tabla | Uso en B2B | Datos |
|-------|-----------|-------|
| profiles | Nombre empresa, rol | Dinamico (requiere role="finanzas") |
| enrollments | Capacitaciones activas/completadas | Filtrado por user_id del usuario B2B |
| programs | Detalle de programas | Dinamico |
| certificates | Certificados obtenidos | Filtrado por user_id |
| payments | Facturacion | Link externo a /payments |

**Nota:** El modelo B2B actual mapea 1 usuario "finanzas" = 1 empresa. No hay tabla separada de "companies" ni "team_members".

---

## 4. FUNCIONALIDADES POR PAGINA

### Dashboard (/b2b)
| Feature | Estado | Detalle |
|---------|--------|---------|
| Welcome header con nombre | OK | Gradiente navy, boton WhatsApp soporte |
| KPI cards (3) | PARCIAL | "Miembros del Equipo" muestra "--" (proximamente) |
| Capacitaciones activas | OK | Cards de enrollments activos |
| Partner companies (H3L, ImagemIA, Strata) | OK | Cards con links externos |
| Quick actions (3 cards) | OK | Mi Equipo, Reportes, Contactar Admin |

### Mi Equipo (/b2b/team)
| Feature | Estado | Detalle |
|---------|--------|---------|
| Header con breadcrumb | OK | |
| Card "Agrega mas miembros" | OK | Links a email y WhatsApp |
| Enrollments de la cuenta | OK | Lista de programas activos |
| Roadmap "funciones proximas" | OK | 3 cards: Invitar, Asignar, Progreso |

**Nota importante:** La gestion de equipo NO esta implementada. Es una landing con CTAs de contacto. El texto dice "proximmamente" (con typo).

### Reportes (/b2b/reportes)
| Feature | Estado | Detalle |
|---------|--------|---------|
| Header con breadcrumb | OK | + boton "Reporte detallado" (email) |
| KPI stats (4 cards) | OK | Activos, Completados, Horas, Certificados |
| Programas en curso | PARCIAL | Progress bar hardcoded al 15% |
| Programas completados | OK | Lista con badges |
| Certificados obtenidos | OK | Grid con fecha emision |
| Reportes detallados | PLACEHOLDER | 3 cards "Proximamente" |
| Quick links | OK | Capacitacion, Certificados, Facturacion |

### Capacitacion (/b2b/capacitacion)
| Feature | Estado | Detalle |
|---------|--------|---------|
| Header con breadcrumb | OK | |
| Stats row (3 cards) | OK | Programas, Horas estimadas, Certificados |
| Program cards | OK | Color-coded por tipo, link a programa |
| Recursos disponibles | OK | Material, AI Lab, Certificado |
| Quick links | OK | Reportes, Certificados, AI Lab |
| Empty state | OK | CTA WhatsApp + Email si sin programas |

---

## 5. QUE FALTA PARA ESTAR COMPLETO

### Critico:
1. **Gestion de equipo NO implementada:** /b2b/team es placeholder. No hay funcionalidad para invitar miembros, asignar cursos, o ver progreso individual. Todo redirige a email/WhatsApp.
2. **KPI "Miembros del Equipo" = "--":** No hay query real para contar miembros.
3. **Progress bar hardcoded:** En /b2b/reportes la barra de progreso esta fija al 15%, no refleja progreso real.

### Modelo de datos limitado:
4. **Sin tabla companies:** El modelo actual es 1 user "finanzas" = 1 empresa. No hay forma de asociar multiples empleados a una empresa.
5. **Sin tabla team_members o company_enrollments:** No hay relacion entre empresa y sus empleados en el sistema.

### Contenido estatico:
6. **Partner companies (H3L, ImagemIA, Strata):** Hardcoded en el componente, no viene de Supabase.
7. **Reportes detallados:** 3 cards marcadas "Proximamente" sin funcionalidad.

### Typo:
8. En /b2b/team: "proximmamente" (doble m) — corregir a "proximamente"

---

## 6. COMPONENTES USADOS

El modulo B2B no usa componentes externos significativos. Todo esta inline en los page.tsx con helper components locales:

| Componente | Archivo | Uso |
|------------|---------|-----|
| KpiCard | b2b/page.tsx (local) | Cards de KPI en dashboard |
| QuickAction | b2b/page.tsx (local) | Cards de acciones rapidas |
| Card, Badge | components/ui/ | UI primitivos compartidos |

---

## VEREDICTO

**Estado: 60% completo.** Las 4 paginas renderizan correctamente y la navegacion funciona, pero el modulo es mayormente informativo/placeholder. La funcionalidad core (gestion de equipo, asignacion de cursos, reportes individuales) no esta implementada. El flujo actual depende de contacto manual via email/WhatsApp. Se necesita:
- Tabla `companies` + `company_members`
- CRUD de miembros del equipo
- Dashboard con progreso real por empleado
- Reportes exportables PDF/CSV
