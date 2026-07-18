# SPEC: MÓDULO 06 B2B EMPRESAS
**Fecha:** 31 marzo 2026
**Prioridad:** MÁXIMA — primer cliente esperando
**Cliente:** IDCE (Julio Cruz, banca, 5 personas, $1,250)

---

## 1. PROBLEMA

El módulo B2B tiene páginas pero están vacías o con datos hardcoded. El primer cliente B2B (IDCE) llenó el formulario y espera su curso. No podemos entregar porque:
- /b2b/team es placeholder
- KPIs hardcoded 15%
- No hay curso cargado en Supabase
- No hay sistema de notas
- Las 8 tabs de sesión no tienen contenido

## 2. USUARIOS

| Usuario | Rol Supabase | Qué necesita |
|---------|-------------|-------------|
| Julio Cruz (IDCE) | finanzas | Ver su curso, tomar sesiones, ver notas |
| 4 empleados IDCE | estudiante | Tomar curso, ver progreso, ver notas |
| Héctor (ITSEIA) | admin/docente | Poner notas, ver progreso equipo, gestionar |

## 3. FUNCIONALIDADES

| ID | Tarea | Prioridad |
|----|-------|-----------|
| F01 | Subir curso IDCE a Supabase (programa + 8 módulos + 16 sesiones) | CRÍTICA |
| F02 | Cada sesión con teoría markdown del CURSO_IDCE_BANCA.md | CRÍTICA |
| F03 | Videos curados para cada sesión (banca/finanzas en español) | ALTA |
| F04 | Quiz por sesión (al menos 5 preguntas cada uno) | ALTA |
| F05 | Ejercicios prácticos por sesión | ALTA |
| F06 | AI Lab context configurado para banca | MEDIA |
| F07 | Recursos complementarios por sesión | MEDIA |
| F08 | /b2b/team con lista real de participantes IDCE | ALTA |
| F09 | Dashboard B2B con KPIs reales (no hardcoded) | ALTA |
| F10 | Sistema de notas (docente pone, alumno ve) | ALTA |
| F11 | Crear 5 cuentas Supabase para equipo IDCE | CRÍTICA |
| F12 | Enrollment de los 5 en el programa IDCE | CRÍTICA |

## 4. FUERA DE ALCANCE
- Presentaciones Gamma (se agregan después)
- Clase en vivo (se coordina por Meet separado)
- App móvil

## 5. CRITERIOS DE ÉXITO
- Julio Cruz entra, ve su curso con 8 módulos y 16 sesiones
- Cada sesión tiene: video + teoría + quiz + ejercicio + AI Lab + recursos
- /b2b/team muestra los 5 participantes con progreso
- Dashboard muestra KPIs reales
- Héctor puede poner notas desde panel docente/admin
