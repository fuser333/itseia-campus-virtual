# Ejercicio Sesion 3: Sprint Planning — Historias de Usuario

**Materia:** Metodologias Agiles
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Redactar historias de usuario de alta calidad con criterios de aceptacion verificables, estimar con Planning Poker, priorizar el Sprint Backlog y planificar un sprint completo de 2 semanas para un proyecto de datos en el contexto ecuatoriano.

## Contexto

El Ministerio de Salud Publica del Ecuador (MSP) necesita un sistema de analytics para monitorear el abastecimiento de medicamentos en los 1,800 centros de salud del pais. El equipo de datos tiene capacidad de 40 story points por sprint (velocity). Tu eres el equipo completo: escribiras las historias, las estimaras y planificaras el sprint como si fueran 4 personas.

## Instrucciones

1. Crea el archivo `S03_Sprint_Planning_MSP_[tu_nombre].md`.

2. Aprende la formula de una buena historia de usuario:

```
ANATOMIA DE UNA HISTORIA DE USUARIO

FORMATO BASICO:
"Como [ROL/PERSONA], quiero [ACCION/FUNCIONALIDAD]
 para [BENEFICIO/VALOR DE NEGOCIO]."

CRITERIOS DE ACEPTACION (formato DADO/CUANDO/ENTONCES):
"DADO que [contexto inicial]
 CUANDO [accion del usuario]
 ENTONCES [resultado esperado y verificable]"

INVERSION (principios INVEST para buenas historias):
- I: Independent (independiente de otras historias)
- N: Negotiable (detalles negociables con el PO)
- V: Valuable (entrega valor al usuario)
- E: Estimable (el equipo puede estimarla)
- S: Small (cabe en un sprint)
- T: Testable (tiene criterios de aceptacion verificables)
```

3. Evalua estas 5 historias del MSP y decide si son BUENAS o MALAS (y por que):

```
EVALUACION DE HISTORIAS DE USUARIO

Historia A:
"Como director nacional de farmacia del MSP, quiero un sistema completo
 de gestion de medicamentos con prediccion de demanda, alertas automaticas,
 integracion con todas las bases de datos del ministerio y reportes para
 SENPLADES, OPS/OMS y el Ministerio de Finanzas."

¿Es INVEST? ___________
Problema principal: ___________
Como corregirla: ___________

Historia B:
"Como enfermera del Centro de Salud #23 de Guayaquil, quiero ver el stock
 actual de amoxicilina 500mg en mi centro para saber si necesito hacer un
 pedido urgente antes de la consulta del martes."

¿Es INVEST? ___________
Criterio de aceptacion que le agregarias:
DADO que estoy en la pantalla de inventario de mi centro de salud
CUANDO busco "amoxicilina 500mg"
ENTONCES ___________

Historia C:
"El sistema debe ser rapido."

¿Es INVEST? ___________
Problema: ___________
Version mejorada: ___________

Historia D:
"Como analista del MSP, quiero una alerta automatica cuando el stock de
 cualquier medicamento en un centro de salud cae por debajo del minimo
 establecido para el tipo de establecimiento."

¿Es INVEST? ___________
Criterios de aceptacion (escribe 3):
1. DADO ___ CUANDO ___ ENTONCES ___
2. DADO ___ CUANDO ___ ENTONCES ___
3. DADO ___ CUANDO ___ ENTONCES ___

Historia E:
"Como data scientist del equipo MSP, quiero acceso a los datos historicos
 de consumo de medicamentos 2019-2024 en formato CSV para entrenar el
 modelo predictivo."

¿Es INVEST? ___________
¿Es historia tecnica o de usuario? ___________
¿Debe estar en el Product Backlog? ___________
```

4. Escribe 6 historias de usuario propias para el sistema MSP (2 por cada rol):

```
ROL 1: Enfermera de centro de salud rural
Historia 1:
"Como ___________, quiero ___________ para ___________."
Criterio de aceptacion:
DADO ___
CUANDO ___
ENTONCES ___
Estimacion: ___ story points (Fibonacci: 1/2/3/5/8/13)
Prioridad MoSCoW: ___

Historia 2:
[Repite estructura]

ROL 2: Director provincial de salud (ej: Directora Provincial del Azuay)
Historia 3: [...]
Historia 4: [...]

ROL 3: Analista de datos del MSP (central Quito)
Historia 5: [...]
Historia 6: [...]
```

5. Planifica el Sprint 1 completo con velocity de 40 puntos:

```
SPRINT PLANNING - Sprint 1
Proyecto: Sistema Analytics Medicamentos MSP Ecuador
Fecha: [Semana 1 del mes]
Duracion: 2 semanas
Velocity: 40 story points

SPRINT GOAL (objetivo del sprint en UNA oracion):
"Al final del Sprint 1, el equipo del MSP puede ver el inventario
 actual de sus 10 medicamentos mas criticos en tiempo real."

ITEMS SELECCIONADOS DEL PRODUCT BACKLOG:

| Historia | Descripcion breve                        | Pts | Responsable   |
|----------|------------------------------------------|-----|---------------|
| H-001    | Ver stock actual por centro de salud     |  5  | Data Engineer |
| H-002    | Alerta stock bajo minimo                 |  8  | Full Stack    |
| H-003    | Dashboard resumen provincial             |  8  | BI Analyst    |
| H-004    | Filtrar por tipo de medicamento          |  3  | Full Stack    |
| H-005    | Exportar reporte a Excel/PDF             |  5  | Full Stack    |
| H-006    | [Historia tecnica: pipeline ETL INABIO]  |  8  | Data Engineer |
| BUFFER   | Reserva para imprevistos                 |  3  | -             |
| TOTAL    |                                          | 40  |               |

DESGLOSE DE TAREAS (H-001 como ejemplo):

H-001: Ver stock actual por centro de salud (5 pts)
Dia 1 (Lunes):
  - Conectar a base de datos SALUD-SI del MSP (2h - Data Engineer)
  - Definir esquema de tablas relevantes (1h - Data Engineer)
Dia 2 (Martes):
  - Query SQL para extraer stock por medicamento y centro (3h - Data Engineer)
  - Validar datos con muestra de 10 centros (2h - Analista)
Dia 3 (Miercoles):
  - Endpoint API REST /api/stock/{centro_id} (3h - Full Stack)
  - Unit tests del endpoint (2h - Full Stack)
Dia 4 (Jueves):
  - Vista frontend con tabla de stock (3h - Full Stack)
  - Code review + merge a rama develop (1h - Equipo)
Dia 5 (Viernes):
  - Demo interna con datos reales de Quito (1h)

[Ahora haz el desglose de tareas para H-002 o H-003]
```

## Usa IA para...

> Abre Claude y escribe:
> "Soy analista de datos en el equipo del MSP Ecuador. Necesito escribir 3 historias de usuario para un sistema que prediga el desabastecimiento de medicamentos usando ML. Las historias deben ser para: el director nacional de farmacia, un medico general de un hospital de segundo nivel, y el equipo de compras del MSP. Incluye criterios de aceptacion DADO/CUANDO/ENTONCES y estimacion en story points."

Evalua cada historia de Claude con los criterios INVEST y ajusta las que no cumplan.

## Que aprendiste

- Una buena historia de usuario responde: ¿quien la necesita, que necesita y por que le importa?
- Los criterios de aceptacion convierten una historia vaga en un contrato verificable entre el equipo y el PO.
- El formato DADO/CUANDO/ENTONCES (Given/When/Then) facilita la escritura de tests automatizados.
- La estimacion en story points mide esfuerzo relativo, no horas absolutas: permite planning realista.
- Un Sprint Goal claro alinea al equipo en torno a un objetivo, no solo a una lista de tareas.

## Reto extra

Implementa una sesion de Planning Poker digital. Crea un script Python simple que: 1) Lea una lista de historias de usuario de un archivo JSON, 2) Para cada historia pregunte a 4 jugadores (simulados o reales en terminales distintas) su estimacion, 3) Revele todas las estimaciones a la vez, 4) Si hay discrepancia mayor a 1 nivel de Fibonacci, genere un prompt para que ChatGPT actue como facilitador explicando por que la historia podria ser mas compleja de lo esperado.
