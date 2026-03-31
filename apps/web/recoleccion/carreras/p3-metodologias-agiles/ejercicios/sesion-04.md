# Ejercicio Sesion 4: Kanban — Tableros y Flujo de Trabajo

**Materia:** Metodologias Agiles
**Nivel:** Intermedio
**Herramienta IA:** Copilot
**Duracion estimada:** 40 min

## Objetivo

Disenar y operar un tablero Kanban para un equipo de datos, aplicar los principios de limite de trabajo en progreso (WIP limits), medir metricas de flujo (cycle time, throughput, lead time) y detectar cuellos de botella en el pipeline de analisis de datos de una empresa ecuatoriana.

## Contexto

El equipo de analytics de Banco Guayaquil tiene 5 analistas procesando solicitudes de reportes de multiples areas del banco. El problema: siempre hay 30 tickets en cola, los reportes tardan 3 semanas y nadie sabe en que estado esta cada solicitud. Kanban es la metodologia perfecta para este caso: no hay sprints fijos, el trabajo fluye continuamente y los WIP limits obligan a terminar antes de empezar algo nuevo.

## Instrucciones

1. Crea el archivo `S04_Kanban_BancoGuayaquil_[tu_nombre].md`.

2. Disena el tablero Kanban (en texto/ASCII) para el equipo de analytics:

```
TABLERO KANBAN — Equipo Analytics Banco Guayaquil
================================================

Columnas del tablero y sus WIP limits:

BACKLOG     | ANALISIS    | EN PROCESO  | REVISION QA | LISTO
(sin limite)| WIP: 3      | WIP: 4      | WIP: 2      | (sin limite)
------------|-------------|-------------|-------------|----------
Ticket #1   | Ticket #8   | Ticket #12  | Ticket #15  | Ticket #3
Solicitud:  | Solicitud:  | Solicitud:  | Solicitud:  | Solicitud:
Reporte     | Dashboard   | Modelo      | Reporte     | KPIs Q3
ventas Q4   | creditos    | scoring     | mora 2024   | [ENTREGADO]
Cliente:    | Riesgo      | Riesgo      | Cliente:    |
Retail      | Tiempo      | Tiempo      | CFO         | Ticket #5
Banco       | inicio:     | inicio:     |             | [ENTREGADO]
            | 3 dias      | 8 dias      |             |
            |             |             |             |
Ticket #2   | Ticket #9   | Ticket #13  |             |
[...]       | [...]       | [...]       |             |

ESTADO ACTUAL:
- Backlog: 8 tickets pendientes
- Analisis: 3 tickets (WIP maximo alcanzado)
- En Proceso: 4 tickets (WIP maximo alcanzado - CUELLO DE BOTELLA)
- Revision QA: 1 ticket (por debajo del WIP)
- Entregados esta semana: 2

CUELLO DE BOTELLA DETECTADO: En Proceso esta en su WIP maximo.
¿Que debe hacer el equipo ANTES de empezar un ticket nuevo de Backlog?
Respuesta: ___________
```

3. Define las reglas y politicas del tablero:

```
POLITICAS KANBAN — Equipo Analytics Banco Guayaquil

1. DEFINICION DE LISTO PARA EMPEZAR (Ready):
   Un ticket puede moverse a "Analisis" cuando:
   - [ ] ___________
   - [ ] ___________
   - [ ] ___________
   - [ ] Tiene un analista asignado

2. DEFINICION DE TERMINADO (Done):
   Un ticket puede moverse a "Listo" cuando:
   - [ ] El reporte/dashboard esta deployado en produccion
   - [ ] ___________
   - [ ] ___________
   - [ ] El solicitante confirmo que el entregable cumple sus necesidades

3. CLASES DE SERVICIO (tipos de ticket con prioridad diferente):
   - URGENTE (rojo): Solicitud del CEO/Directorio. Sin WIP limit. Pasa a frente de cola.
   - STANDARD (amarillo): Solicitudes normales. Respetan WIP limits.
   - MEJORA (verde): Optimizacion de procesos internos. Solo cuando hay capacidad libre.
   - EXPEDITE (naranja): Solicitudes con fecha regulatoria (SIB, Banco Central). ___________

4. WIP LIMITS Y SU RAZON DE SER:
   - Analisis WIP=3: Porque analizar mas de 3 requerimientos en paralelo genera confusion y reproceso.
   - En Proceso WIP=4: ___________
   - Revision QA WIP=2: ___________
   Regla de oro: Si no puedo mover un ticket HACIA ADELANTE, debo ayudar a mover
   uno que ya esta en proceso en lugar de empezar uno nuevo.
```

4. Calcula las metricas de flujo con datos reales del mes:

```python
# Metricas Kanban - Calcular con Python
# Abre este codigo en Google Colab o cualquier Python

import statistics
from datetime import date, timedelta

# Datos del mes (octubre 2024) - Tickets completados
tickets_octubre = [
    {'id': 'ANA-001', 'tipo': 'STANDARD', 'ingreso': date(2024,10,1),
     'analisis': date(2024,10,2), 'proceso': date(2024,10,3),
     'qa': date(2024,10,7), 'entregado': date(2024,10,9)},

    {'id': 'ANA-002', 'tipo': 'URGENTE', 'ingreso': date(2024,10,3),
     'analisis': date(2024,10,3), 'proceso': date(2024,10,4),
     'qa': date(2024,10,5), 'entregado': date(2024,10,6)},

    {'id': 'ANA-003', 'tipo': 'STANDARD', 'ingreso': date(2024,10,2),
     'analisis': date(2024,10,5), 'proceso': date(2024,10,8),
     'qa': date(2024,10,12), 'entregado': date(2024,10,15)},

    {'id': 'ANA-004', 'tipo': 'STANDARD', 'ingreso': date(2024,10,1),
     'analisis': date(2024,10,6), 'proceso': date(2024,10,10),
     'qa': date(2024,10,16), 'entregado': date(2024,10,22)},

    {'id': 'ANA-005', 'tipo': 'MEJORA',  'ingreso': date(2024,10,5),
     'analisis': date(2024,10,10), 'proceso': date(2024,10,14),
     'qa': date(2024,10,20), 'entregado': date(2024,10,24)},

    {'id': 'ANA-006', 'tipo': 'STANDARD', 'ingreso': date(2024,10,8),
     'analisis': date(2024,10,9), 'proceso': date(2024,10,11),
     'qa': date(2024,10,14), 'entregado': date(2024,10,16)},

    {'id': 'ANA-007', 'tipo': 'STANDARD', 'ingreso': date(2024,10,10),
     'analisis': date(2024,10,15), 'proceso': date(2024,10,18),
     'qa': date(2024,10,22), 'entregado': date(2024,10,25)},

    {'id': 'ANA-008', 'tipo': 'URGENTE', 'ingreso': date(2024,10,14),
     'analisis': date(2024,10,14), 'proceso': date(2024,10,15),
     'qa': date(2024,10,16), 'entregado': date(2024,10,17)},
]

# Calcular metricas por ticket
for t in tickets_octubre:
    t['lead_time'] = (t['entregado'] - t['ingreso']).days
    t['cycle_time'] = (t['entregado'] - t['analisis']).days
    t['tiempo_espera'] = (t['analisis'] - t['ingreso']).days

# ---- REPORTE DE METRICAS ----
print("=" * 60)
print("METRICAS KANBAN — Equipo Analytics Banco Guayaquil")
print("Periodo: Octubre 2024")
print("=" * 60)

lead_times = [t['lead_time'] for t in tickets_octubre]
cycle_times = [t['cycle_time'] for t in tickets_octubre]
esperas = [t['tiempo_espera'] for t in tickets_octubre]

print(f"\nTHROUGHPUT: {len(tickets_octubre)} tickets completados en octubre")
print(f"  Promedio semanal: {len(tickets_octubre)/4:.1f} tickets/semana")

print(f"\nLEAD TIME (desde solicitud hasta entrega):")
print(f"  Promedio: {statistics.mean(lead_times):.1f} dias")
print(f"  Mediana:  {statistics.median(lead_times):.1f} dias")
print(f"  Minimo:   {min(lead_times)} dias (Ticket: {min(tickets_octubre, key=lambda x: x['lead_time'])['id']})")
print(f"  Maximo:   {max(lead_times)} dias (Ticket: {max(tickets_octubre, key=lambda x: x['lead_time'])['id']})")

print(f"\nCYCLE TIME (desde que se empieza hasta entrega):")
print(f"  Promedio: {statistics.mean(cycle_times):.1f} dias")
print(f"  Mediana:  {statistics.median(cycle_times):.1f} dias")

print(f"\nTIEMPO EN COLA (espera antes de empezar):")
print(f"  Promedio: {statistics.mean(esperas):.1f} dias")
print(f"  Esta espera representa el {statistics.mean(esperas)/statistics.mean(lead_times)*100:.0f}% del lead time total")

print(f"\nPOR TIPO DE TICKET:")
for tipo in set(t['tipo'] for t in tickets_octubre):
    tickets_tipo = [t for t in tickets_octubre if t['tipo'] == tipo]
    avg_lt = statistics.mean([t['lead_time'] for t in tickets_tipo])
    print(f"  {tipo}: {len(tickets_tipo)} tickets, lead time prom {avg_lt:.1f} dias")

print("\n--- CUELLO DE BOTELLA ---")
# Calcular tiempo promedio en cada columna
for columna, inicio_col, fin_col in [
    ('Analisis', 'analisis', 'proceso'),
    ('En Proceso', 'proceso', 'qa'),
    ('QA', 'qa', 'entregado')
]:
    tiempos = [(t[fin_col] - t[inicio_col]).days for t in tickets_octubre]
    print(f"  {columna}: {statistics.mean(tiempos):.1f} dias promedio")

print("\nColumna con mayor tiempo: 'En Proceso' -> es el cuello de botella")
print("Recomendacion: Aumentar capacidad en 'En Proceso' o bajar complejidad")
```

5. En el documento, escribe el plan de mejora para el equipo: 3 acciones concretas para reducir el lead time promedio de 15 a 8 dias en el proximo mes.

## Usa IA para...

> Abre GitHub Copilot y escribe en el archivo Python:
> `# Generar un diagrama de flujo acumulativo (Cumulative Flow Diagram) para los datos de Kanban del ejercicio`

Acepta y adapta las sugerencias de Copilot para crear el grafico con Matplotlib. El CFD muestra cuantos tickets hay en cada columna a lo largo del tiempo y es la herramienta visual principal de Kanban.

## Que aprendiste

- Kanban no tiene sprints: el trabajo fluye continuamente basado en capacidad, no en iteraciones.
- Los WIP limits son la clave de Kanban: obligan a terminar antes de empezar y revelan cuellos de botella.
- Lead time = tiempo total desde solicitud hasta entrega. Cycle time = solo el tiempo activo de trabajo.
- El cuello de botella siempre esta en la columna con el tiempo promedio mas alto.
- Las Clases de Servicio permiten tratar diferentes tipos de trabajo con politicas diferentes dentro del mismo flujo.

## Reto extra

Crea un tablero Kanban digital para tu equipo de ITSEIA usando Notion. Configura las columnas con propiedades personalizadas: tipo de trabajo, estimacion, responsable, fecha de entrega. Agrega 5 tickets reales de proyectos del curso. Presenta el tablero en la siguiente clase mostrando el flujo de al menos 2 tickets desde Backlog hasta Done.
