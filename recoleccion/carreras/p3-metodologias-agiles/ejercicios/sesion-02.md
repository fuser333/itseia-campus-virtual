# Ejercicio Sesion 2: Scrum — Roles, Eventos y Artefactos

**Materia:** Metodologias Agiles
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Identificar y aplicar correctamente los 3 roles, 5 eventos y 3 artefactos del framework Scrum, simulando un equipo de datos en una empresa ecuatoriana que trabaja en un proyecto de analytics con sprint de 2 semanas.

## Contexto

Supermaxi Ecuador quiere un sistema de recomendacion de productos para su plataforma de delivery. El equipo de datos tiene 5 personas. El gerente de marketing no sabe exactamente que quiere, pero sabe que quiere "algo como lo que hace Amazon". Tu eres el Scrum Master del equipo. En este ejercicio defines la estructura completa de Scrum para este proyecto y aprendes por que cada rol y ceremonia existe.

## Instrucciones

1. Crea el documento `S02_Scrum_Framework_[tu_nombre].md`.

2. Define el equipo Scrum para el proyecto Supermaxi:

```
EQUIPO SCRUM — Proyecto Sistema de Recomendacion Supermaxi Ecuador

PRODUCT OWNER:
- Nombre ficticio: Maria Bermudez (Gerente de Marketing Digital)
- Responsabilidades REALES del PO:
  1. ___________
  2. ___________
  3. ___________
  4. ___________
- NO es responsabilidad del PO:
  1. ___________
  2. ___________

SCRUM MASTER:
- Nombre ficticio: Carlos Aguirre (Tech Lead / Analista Senior)
- Responsabilidades REALES del SM:
  1. ___________
  2. ___________
  3. ___________
  ¿Es el jefe del equipo? ___________
  ¿Puede asignar tareas? ___________

DEVELOPMENT TEAM (4 personas):
- Sofia Torres: Data Scientist (ML/Python)
- Diego Vasquez: Data Engineer (Pipelines/SQL)
- Ana Loja: Analista BI (Dashboards/SQL)
- Pedro Ortega: MLOps (Docker/Cloud)
- Caracteristica clave del equipo en Scrum: ___________
  (pista: son auto-___________)
```

3. Describe los 5 eventos de Scrum con su proposito y tiempo limite:

```
5 EVENTOS SCRUM — Proyecto Supermaxi (Sprint de 2 semanas)

1. SPRINT
   - Duracion en este proyecto: ___________
   - Que se produce al final: ___________
   - ¿Puede el PO cambiar el Sprint Backlog durante el sprint? ___________

2. SPRINT PLANNING
   - ¿Cuando ocurre? ___________
   - ¿Cuanto dura? (timebox para sprint 2 semanas): ___________
   - Preguntas que responde:
     * ¿Que se puede entregar? → ___________
     * ¿Como se hara el trabajo? → ___________
   - Asisten: ___________

3. DAILY SCRUM (standup)
   - Duracion: ___________
   - Frecuencia: ___________
   - Las 3 preguntas:
     * ¿___________?
     * ¿___________?
     * ¿___________?
   - ¿Debe asistir el PO? ___________
   - En el contexto de datos: ejemplo de respuesta real:
     * "Ayer terminé el EDA del dataset de ventas Supermaxi 2023.
        Hoy voy a entrenar el modelo baseline de colaborative filtering.
        Bloqueo: el dataset de inventario en tiempo real aun no tiene acceso."

4. SPRINT REVIEW
   - ¿Cuando ocurre? ___________
   - ¿Quien asiste? ___________
   - ¿Que se muestra? ___________
   - Diferencia con Sprint Retrospectiva: ___________

5. SPRINT RETROSPECTIVA
   - ¿Cuando ocurre? (relacion con Review): ___________
   - 3 preguntas que se responden:
     * ¿Que salió ___________?
     * ¿Que podria ___________?
     * ¿Que haremos ___________?
   - ¿Participa el PO? ___________
```

4. Construye los 3 artefactos para el Sprint 1 del proyecto:

```
3 ARTEFACTOS SCRUM — Sprint 1 Supermaxi Recomendaciones

ARTEFACTO 1: PRODUCT BACKLOG
(Lista priorizada de todo lo que el producto necesita)

Formato: Como [usuario], quiero [funcionalidad] para [beneficio]
Prioridad: Alta/Media/Baja | Estimacion: Story Points (Fibonacci: 1,2,3,5,8,13)

Item 1 (Alta, 8 pts):
"Como gerente de marketing, quiero ver el top 10 de productos mas comprados
 juntos en Supermaxi para disenar combos promocionales."

Item 2 (Alta, 5 pts):
"Como cliente de SuperMaxi Express, quiero recibir recomendaciones de productos
 basadas en mis compras anteriores al entrar a la app."

Item 3 (Alta, 13 pts):
"Como data scientist del equipo, quiero un pipeline automatico que actualice
 el modelo de recomendacion semanalmente con datos nuevos."

[Escribe 3 items mas que sean realistas para este proyecto]

Item 4 (_____, __ pts):
"Como ___________, quiero ___________ para ___________."

Item 5 (_____, __ pts):
"Como ___________, quiero ___________ para ___________."

Item 6 (_____, __ pts):
"Como ___________, quiero ___________ para ___________."

---

ARTEFACTO 2: SPRINT BACKLOG (Sprint 1 - 2 semanas)
(Subset del Product Backlog que el equipo se compromete a completar)

Items seleccionados del Product Backlog para Sprint 1:
[Items 1 y 2 del backlog, desglosados en tareas tecnicas]

Item 1 desglosado:
  - Tarea A: Extraer dataset ventas Supermaxi 2022-2024 (Diego, 4h)
  - Tarea B: Analisis frecuencia items comprados juntos (Sofia, 6h)
  - Tarea C: Implementar algoritmo Apriori/FP-Growth (Sofia, 8h)
  - Tarea D: Visualizar top 20 combinaciones en dashboard (Ana, 4h)
  - Tarea E: Presentar resultados al PO (Equipo, 1h)

Item 2 desglosado:
  [Escribe al menos 3 tareas tecnicas con responsable y estimacion]
  - Tarea A: ___________
  - Tarea B: ___________
  - Tarea C: ___________

---

ARTEFACTO 3: INCREMENT (Entregable del Sprint)
"Al final del Sprint 1, entregamos:"
- ___________
- ___________
- Definition of Done:
  * Codigo en repositorio GitHub con pull request aprobado
  * Tests unitarios con cobertura > 70%
  * Documentacion de la metodologia en Confluence
  * Demo aprobada por el PO en Sprint Review
```

5. Simula una Daily Standup de 15 minutos del dia 6 del Sprint 1. Escribe el dialogo completo (4 personas + Scrum Master) donde aparezca al menos un bloqueo real y como el SM lo gestiona.

## Usa IA para...

> Abre Claude y escribe:
> "Soy Scrum Master de un equipo de datos en Ecuador. Nuestro Product Owner (gerente de marketing) llega a cada Daily Standup y empieza a asignar tareas directamente a los desarrolladores, saltandose el proceso. El equipo se siente frustrado. Dame un guion de 10 lineas para la conversacion que debo tener con el PO explicandole su rol correcto en Scrum sin generar conflicto."

Practica ese guion con un companero de clase asumiendo roles alternos.

## Que aprendiste

- Los 3 roles de Scrum tienen responsabilidades claramente separadas y ninguno puede invadir el territorio del otro.
- El Scrum Master NO es el jefe del equipo: es un facilitador y protector del proceso.
- Los 5 eventos tienen timeboxes maximos que deben respetarse para mantener agilidad.
- El Product Backlog es un documento vivo: se refina continuamente con nuevos aprendizajes.
- La Daily Standup no es una reunion de reporte al jefe: es coordinacion horizontal entre pares del equipo.

## Reto extra

Crea un Product Backlog completo (minimo 15 items) para un proyecto real: un sistema de analytics para una cadena de farmacias ecuatorianas (Cruz Azul o Fybeca) que quiere predecir que medicamentos tendra alta demanda en los proximos 7 dias. Estima cada item en story points usando Planning Poker y prioriza usando la tecnica MoSCoW (Must have, Should have, Could have, Won't have).
