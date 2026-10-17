# SPEC: RECOLECCION DE CONTENIDO ITSEIA
**Version:** 1.0
**Fecha:** 25 marzo 2026
**Prompt Maestro v3.0**
**Estado:** PENDIENTE APROBACION

---

## 1. PROBLEMA

La plataforma tiene 278 sesiones con teoria y video, pero:
- Videos son de 3 minutos (solo presentacion del curso, no ensenan)
- Solo hay contenido en INGLES para recursos
- 275/278 sesiones de carreras no tienen slides
- Ejercicios inexistentes (0 session_resources en preuni)
- Contenido no ensena CON IA, solo SOBRE IA
- Cursos Pro Estandar/Completo vacios

**El alumno abre la plataforma y encuentra contenido mediocre.** Eso mata la retencion.

---

## 2. DIMENSION DEL TRABAJO

### Materias por producto:
| Producto | Materias | Sesiones/Materia | Total sesiones |
|----------|----------|-----------------|----------------|
| Carrera IA | 29 | 16 | 464 |
| Carrera Ciencia Datos | 29 | 16 | 464 |
| Carrera Big Data | 29 | 16 | 464 |
| Preuniversitario | 4 | 5 | 18 |
| Cursos Express | 27 | 5 | ~135 |
| Cursos Estandar | 5 | 8 | 40 |
| Cursos Completo | 5 | 10 | 50 |
| Bootcamps | 22 | 12 | ~264 |
| **TOTAL** | **150** | — | **~1,900** |

### Materias UNICAS (muchas se repiten entre carreras):
Las 3 carreras comparten ~15 materias (Fundamentos Programacion, Matematicas I, POO, Estadistica, Bases de Datos, etc). Materias unicas reales: **~60-70**.

### Por cada materia necesitamos:
| Tipo contenido | Estandar minimo | Idioma |
|---------------|----------------|--------|
| Video curado | 10-30 min, actualizado 2024-2026 | ESPAÑOL latino |
| Ejercicio practico | Dataset real + notebook/instrucciones | ESPAÑOL |
| Recursos | 3-5 links curados (tutorials, tools, papers) | ESPAÑOL |
| Teoria enriquecida | 2000+ palabras con ejemplos Ecuador/LatAm | ESPAÑOL |

---

## 3. USUARIOS DEL CONTENIDO

| Usuario | Que necesita | Prioridad |
|---------|-------------|-----------|
| Alumno carrera | Contenido completo 5 semestres, ensena CON IA | P1 |
| Alumno preuni | 4 semanas practicas, motivador, sin aburrir | P1 |
| Profesional (curso) | Aplicacion directa a su profesion, ROI inmediato | P1 |
| Docente | Material de referencia para sus clases | P2 |
| Empresa B2B | Reportes de lo que su equipo aprende | P3 |

---

## 4. FUNCIONALIDADES (EQUIPOS DE RECOLECCION)

### F01 — EQUIPO VIDEO (Prioridad ALTA)
**Rol:** Curar los mejores videos en español por materia.
**Criterios:**
- Duracion: 10-30 minutos
- Idioma: Español latinoamericano (NO de Espana)
- Actualizado: 2024-2026 preferido, minimo 2022
- Ensena CON IA (muestra herramientas en pantalla), no solo teoria
- Canales de referencia: Platzi, Codigo Facilito, Ringa Tech, Dot CSV (si es LatAm), Corey Schafer en español, etc
- Fuentes: YouTube (principal), Vimeo, canales educativos gratuitos
- **NO contenido pago/protegido**

**Entregable:** Por materia → URL de video + titulo + canal + duracion + justificacion de seleccion

### F02 — EQUIPO EJERCICIOS (Prioridad ALTA)
**Rol:** Crear o curar ejercicios practicos.
**Criterios:**
- Cada ejercicio usa una herramienta de IA (ChatGPT, Claude, Gemini, Copilot)
- Dataset REAL (no inventado): Kaggle, datos.gob.ec, Banco Central Ecuador
- Formato: Markdown con instrucciones paso a paso
- Nivel: Progresivo dentro del semestre (basico → intermedio → avanzado)
- Incluir "que aprendiste" y "reto extra" al final
- Notebooks Google Colab cuando aplique

**Entregable:** Por sesion → Markdown del ejercicio + URL dataset + nivel dificultad

### F03 — EQUIPO RECURSOS (Prioridad MEDIA)
**Rol:** Curar recursos complementarios en español.
**Criterios:**
- 3-5 recursos por materia
- Tipos: tutoriales web, documentacion oficial (en español), herramientas gratuitas, datasets abiertos, papers relevantes
- SIEMPRE en español o con version en español disponible
- Priorizar recursos ecuatorianos/latinoamericanos
- Incluir: datos.gob.ec, INEC, Banco Central, papers de ESPOL/PUCE/EPN

**Entregable:** Por materia → Lista de recursos con titulo + URL + tipo + descripcion 1 linea

### F04 — EQUIPO TEORIA (Prioridad MEDIA)
**Rol:** Enriquecer la teoria existente con ejemplos LatAm.
**Criterios:**
- Minimo 2000 palabras por sesion (actual: muchas tienen ~500)
- Ejemplos de empresas ecuatorianas/LatAm (no solo Google/Amazon)
- Casos de uso: banca ecuatoriana, retail, salud publica Ecuador, agricultura, petroleo
- Incluir secciones: "En Ecuador...", "Ejemplo real:", "Sabias que..."
- Formato Markdown con headers, listas, code blocks, tablas

**Entregable:** Por sesion → Markdown enriquecido

---

## 5. FUERA DE ALCANCE

- Grabar videos propios (se curan existentes)
- Crear presentaciones Gamma (proyecto separado, depende de creditos)
- Traducir papers del ingles (se buscan que ya existan en español)
- Contenido pago de terceros (todo debe ser gratuito/abierto)
- Crear datasets desde cero (se curan existentes)

---

## 6. CRITERIOS DE EXITO

| Criterio | Metrica | Target |
|----------|---------|--------|
| Cobertura video | % materias con video curado 10-30min | 100% carreras P1-P2 |
| Cobertura ejercicios | % sesiones con ejercicio practico | 100% P1, 80% P2-P5 |
| Idioma | % contenido en español | 100% |
| Calidad percibida | Rating 1-5 por equipo revisor | >= 4.5/5 (90%) |
| Actualizacion | % contenido 2024-2026 | >= 70% |
| Usa herramientas IA | % ejercicios que usan ChatGPT/Claude/etc | 100% |
| Ejemplos LatAm | % teoria con al menos 1 ejemplo Ecuador | 100% |

---

## 7. ESTRUCTURA DE EQUIPOS

### Por cada materia, el equipo de recoleccion incluye:
| Agente | Rol | Busca |
|--------|-----|-------|
| Pedagogo | Valida que el contenido ensena, no solo informa | Estructura, secuencia, didactica |
| Especialista IA | Verifica que las herramientas IA son correctas y actuales | Prompts, herramientas, precision |
| Ingeniero | Verifica que el codigo/notebook funciona | Datasets, codigo, reproducibilidad |
| Curador LatAm | Busca ejemplos y fuentes locales | Empresas Ecuador, datos INEC, papers ESPOL |

### Proceso por materia:
```
1. INVESTIGACION → Buscar 5-10 opciones por tipo de contenido
2. EVALUACION   → Cada agente califica 1-5 segun sus criterios
3. SELECCION    → Top 1-2 por tipo (video, ejercicio, recursos)
4. ENRIQUECIMIENTO → Teoria expandida con ejemplos LatAm
5. ENTREGA      → JSON/Markdown listo para cargar a Supabase
```

---

## 8. ORDEN DE EJECUCION (Prioridad)

### Sprint 1 — Periodo 1 de las 3 carreras (materias compartidas)
Las 3 carreras comparten ~6 materias en P1:
- Fundamentos de Programacion (Python)
- Matematicas I
- Introduccion a IA / Ciencia de Datos / Big Data
- Logica y Pensamiento Analitico
- Comunicacion Academica
- Etica Digital

**6 materias x 16 sesiones = 96 sesiones** a completar primero.

### Sprint 2 — Preuniversitario (4 materias, 18 sesiones)
Ya tiene contenido basico, solo enriquecer.

### Sprint 3 — Cursos Express (27 materias, ~135 sesiones)
Contenido existe parcialmente, completar y curar videos.

### Sprint 4 — Periodo 2 de carreras (materias compartidas)
~6 materias compartidas (POO, Matematicas II, Estadistica, BD, Estructuras de Datos, Ingles)

### Sprint 5-8 — Periodos 3-5 (materias especializadas por carrera)

---

## 9. FORMATO DE ENTREGA

Cada materia se entrega como carpeta:
```
recoleccion/
├── carrera-ia/
│   ├── p1-fundamentos-programacion/
│   │   ├── INVESTIGACION.md      (opciones encontradas)
│   │   ├── SELECCION.md          (lo elegido + justificacion)
│   │   ├── video_curado.json     (url, titulo, canal, duracion)
│   │   ├── ejercicios/
│   │   │   ├── sesion-01.md
│   │   │   ├── sesion-02.md
│   │   │   └── ...
│   │   ├── recursos.json         (lista de recursos curados)
│   │   └── teoria/
│   │       ├── sesion-01.md      (teoria enriquecida)
│   │       └── ...
│   └── p1-matematicas-i/
│       └── ...
└── preuni/
    └── ...
```

---

## 10. COMPLEJIDAD

**Total:** ~70 materias unicas x 4 tipos de contenido = **280 entregables**
**Sprint 1 (P1 compartido):** 6 materias x 4 = **24 entregables** — START HERE

---

**STOP: Esperando aprobacion del CEO para proceder con PLAN.md**
