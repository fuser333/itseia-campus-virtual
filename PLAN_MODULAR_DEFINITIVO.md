# Plan Modular Definitivo — Plataforma ITSEIA

## El flujo correcto (de principio a fin)

```
1. Landing tecnologico.itseia.ai
   → Persona escoge módulo (Carreras, MDT, Pro, B2B, etc.)
   
2. Login del módulo
   → Cada módulo tiene su propio login/acceso
   
3. Dashboard del módulo
   → Sidebar izquierdo PROPIO (no genérico)
   → Panel derecho estandarizado (formato Julio Cruz)
   
4. Dentro de un curso/materia
   → Las 7 pestañas: Video, Presentación, Teoría, Quiz, Ejercicio, AI Lab, Recursos
   → MISMO formato para TODOS los módulos
   
5. "Descubre ITSEIA" (cross-sell)
   → Landings embebidas DENTRO del módulo (no navega a otro módulo)
   → El alumno NUNCA sale de su módulo
```

## Cada módulo es AUTÓNOMO

| Módulo | Sidebar propio | Contenido | Skills |
|--------|---------------|-----------|--------|
| Carreras | CarrerasSidebar | Semestres + materias | /fabrica-cursos tipo carrera |
| Preuni | PreuniSidebar | 20 días | /fabrica-cursos tipo preuni |
| Cursos MDT | CursosMdtSidebar | 15 cursos | /fabrica-cursos tipo mdt |
| Cursos Pro | CursosProSidebar | Por profesión | /fabrica-cursos tipo profesional |
| Bootcamp | BootcampSidebar | 12 módulos | /fabrica-cursos tipo bootcamp |
| B2B | B2BSidebar | Por empresa | /fabrica-cursos tipo b2b |
| Certificaciones | CertificacionesSidebar | AWS/Google/Azure | /fabrica-cursos tipo certificacion |
| Docentes | DocentesSidebar | Gestión cursos | N/A |

## Mínimos de contenido por tema (rúbrica)

| Componente | Mínimo | Skill que lo produce |
|-----------|--------|---------------------|
| Video | 30 minutos, relevante, canal reputado | /buscar-videos |
| Presentación | 10 slides mínimo, prompt Gamma | /crear-presentaciones |
| Teoría | 500+ palabras | Dentro de /fabrica-cursos |
| Quiz | 5 preguntas, 4 opciones c/u | /crear-quiz |
| Ejercicio | Paso a paso con datos Ecuador | /crear-ejercicio |
| AI Lab | Nada (el alumno lo usa directo) | N/A |
| Recursos | 3+ URLs verificadas | /buscar-recursos |

## Flujo cuando llega un cliente nuevo

```
ADIUM (oncología) firma contrato
  → /fabrica-cursos b2b "oncología" "ADIUM"
    → Deep search del sector
    → Brainstorm 3 propuestas
    → Crea módulos con contenido
  → /producir-contenido [ruta-curso]
    → /buscar-videos (30+ min cada uno)
    → /crear-presentaciones (10+ slides)
    → /crear-quiz (5 preguntas por tema)
    → /crear-ejercicio (paso a paso)
    → /buscar-recursos (3+ URLs)
  → Se crean 30 usuarios en Supabase
  → Se asigna el curso al módulo B2B
  → Los 30 usuarios entran con su login
  → Ven su sidebar B2B propio
  → Estudian con las 7 pestañas
  → NUNCA ven otros módulos (solo "Descubre ITSEIA" como propaganda)
```

## Lo que falta hacer (priorizado)

### AHORA (hoy):
1. Landings embebidas dentro de /cursos-mdt (agente trabajando)
2. Replicar landings embebidas en los otros 7 módulos
3. Verificar que CADA módulo sea autónomo (no navegue a otro)

### LUNES:
4. Skill para crear usuarios en batch y asignarlos a un módulo
5. Probar flujo completo: crear curso → producir contenido → subir a plataforma
6. Tener listo para ADIUM (oncología)
