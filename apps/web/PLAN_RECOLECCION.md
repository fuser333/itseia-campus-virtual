# PLAN: RECOLECCION DE CONTENIDO ITSEIA
**Fecha:** 25 marzo 2026
**Estado:** EN EJECUCION

---

## DIMENSION TOTAL

### CARRERAS (3 x 5 periodos x ~6 materias = ~60 materias unicas)
- Contenido: Video 10-30min + Ejercicio practico + Recursos + Teoria enriquecida
- Idioma: 100% español latino

### CURSOS PRO (22 profesiones x 3 niveles = 66 curricula)
- 4 modulos transversales (iguales para todos)
- 5 modulos especializados por profesion = 110 modulos
- 3 niveles: Express (avanzado IA), Estandar (intermedio), Completo (desde cero)

### PREUNIVERSITARIO (4 semanas, 18 sesiones)
- Enriquecer teoria + agregar slides + recursos

### CERTIFICACIONES (3 certs, 90 preguntas)
- Ya completado

---

## SPRINTS DE EJECUCION

### SPRINT 1 — Carreras Periodo 1 (materias compartidas)
6 materias que comparten las 3 carreras:
1. Fundamentos de Programacion (Python con IA)
2. Matematicas I
3. Intro a IA / Ciencia de Datos / Big Data
4. Logica y Pensamiento Analitico
5. Comunicacion Academica y Tecnica
6. Etica Digital

Por cada materia: buscar video, crear ejercicio, curar recursos, enriquecer teoria.

### SPRINT 2 — Cursos Pro: 7 profesiones con spec (35 modulos)
Profesiones ya definidas: Salud, Legal, Finanzas, Arquitectura, Marketing, Gestion, RRHH
Por cada: crear contenido 3 niveles (Express/Estandar/Completo)

### SPRINT 3 — Cursos Pro: 15 profesiones nuevas (75 modulos)
Educacion, Periodismo, Psicologia, Ing Industrial, Diseno, Ventas, Admin Publica, Agro, Odontologia, Farmacia, Turismo, Sistemas, Economia, + 2 nuevas

### SPRINT 4 — Preuniversitario enriquecido
16 slides faltantes + recursos + ejercicios mejorados

### SPRINT 5-8 — Carreras Periodos 2-5
Materias especializadas por carrera

---

## EQUIPOS DE RECOLECCION (AGENTES)

### EQ-VIDEO: Curador de videos educativos
- Busca en YouTube videos 10-30min en español latino
- Criterio: ensena CON IA, no solo SOBRE IA
- Actualizado 2024-2026
- Entrega: URL + titulo + canal + duracion + justificacion

### EQ-EJERCICIO: Creador de ejercicios practicos
- Usa datasets reales (Kaggle, datos.gob.ec, INEC)
- Cada ejercicio usa ChatGPT/Claude/Gemini/Copilot
- Formato markdown paso a paso
- Entrega: Markdown con instrucciones + URL dataset

### EQ-RECURSOS: Curador de recursos en español
- 3-5 recursos por materia/modulo
- Prioriza fuentes Ecuador/LatAm
- Tutoriales, herramientas, papers, datasets
- Entrega: JSON con titulo + URL + tipo + descripcion

### EQ-TEORIA: Enriquecedor de contenido
- Expande teoria a 2000+ palabras
- Agrega ejemplos Ecuador (banca, retail, salud publica, petroleo)
- Secciones: "En Ecuador...", "Ejemplo real:", "Sabias que..."
- Entrega: Markdown enriquecido

### EQ-CURSOS-PRO: Creador de modulos profesionales
- Define 5 modulos especializados por profesion nueva
- Herramientas especificas por campo
- 3 niveles de profundidad
- Entrega: spec de modulo + contenido por sesion

---

## ESTRUCTURA DE ENTREGA

```
recoleccion/
├── carreras/
│   ├── p1-fundamentos-programacion/
│   │   ├── video.json
│   │   ├── recursos.json
│   │   ├── ejercicios/sesion-01.md ... sesion-16.md
│   │   └── teoria/sesion-01.md ... sesion-16.md
│   └── ... (60 materias)
├── cursos-pro/
│   ├── transversales/
│   │   ├── T01-fundamentos-ia.md
│   │   ├── T02-chatgpt-claude.md
│   │   ├── T03-seguridad-datos.md
│   │   └── T04-evaluacion-ia.md
│   ├── salud/
│   │   ├── modulos-spec.json
│   │   ├── S01-diagnostico.md ... S05-comunicacion.md
│   │   └── niveles.json (express/estandar/completo)
│   ├── legal/ ...
│   ├── finanzas/ ...
│   └── ... (22 profesiones)
└── preuni/
    ├── semana-1/ ... semana-4/
    └── recursos.json
```
