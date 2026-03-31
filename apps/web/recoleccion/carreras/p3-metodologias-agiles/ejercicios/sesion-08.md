# Ejercicio Sesion 8: Proyecto — Planificar Sprint para Proyecto IA

**Materia:** Metodologias Agiles
**Nivel:** Intermedio
**Herramienta IA:** Claude + Copilot
**Duracion estimada:** 50 min

## Objetivo

Integrar todos los conocimientos del modulo de Metodologias Agiles para planificar y simular un sprint completo de 2 semanas para un proyecto real de Inteligencia Artificial en Ecuador, produciendo todos los artefactos Scrum: Product Backlog, Sprint Backlog, Definition of Done, Daily Standups, Sprint Review y Retrospectiva.

## Contexto

Este es el proyecto integrador de Metodologias Agiles. Debes demostrar que puedes liderar como Scrum Master/Product Owner un sprint de un equipo de datos trabajando en un proyecto de IA real. El proyecto: una startup ecuatoriana llamada AgroPredict quiere desarrollar un modelo de IA que ayude a los agricultores de la Sierra ecuatoriana a predecir el rendimiento de su cosecha de papa basandose en datos meteorologicos, tipo de suelo, altitud y precio historico. El MVP debe estar listo en 3 sprints.

## Instrucciones

1. Crea el archivo `S08_Proyecto_Sprint_AgroPredict_[tu_nombre].md`.

### ARTEFACTO 1: DEFINICION DEL PROYECTO

```
FICHA DEL PROYECTO

Nombre: AgroPredict — IA para agricultura andina Ecuador
Equipo:
  - Product Owner: Ing. Rosa Lema (Co-fundadora, experta en agronomia)
  - Scrum Master: [Tu nombre]
  - Dev Team:
    * Sofia Torres — Data Scientist (ML, Python, scikit-learn)
    * Diego Vasquez — Data Engineer (ETL, APIs meteorologicas, SQL)
    * Ana Loja — MLOps/Full Stack (Flask API, Docker, deploy)
    * Pedro Ortega — Data Analyst (validacion con agricultores, visualizacion)

Duracion total: 3 sprints (6 semanas)
Sprint actual: Sprint 1
Velocity objetivo: 35 story points

Objetivo del producto (Product Goal):
"Desarrollar un modelo de ML que prediga con un error menor a 15%
 el rendimiento de cosecha de papa en la Sierra ecuatoriana,
 accesible via app movil para agricultores con conectividad limitada."

Datos disponibles:
- INAMHI (meteorologia): temperatura, lluvia, heladas por canton
- MAG (Ministerio Agricultura): rendimientos historicos 2010-2024
- INIAP: datos de suelo y variedades de papa
- Precio papa en mercados: Mercado Mayorista Quito, Riobamba, Latacunga

Riesgos identificados:
1. Los datos del INAMHI tienen muchos valores faltantes (~20%)
2. Los agricultores objetivo tienen conectividad 2G/3G limitada
3. El modelo debe ser interpretable (el agricultor debe entender por que)
4. Estacionalidad fuerte: ciclo agricola sierra norte = mar-ago
```

### ARTEFACTO 2: PRODUCT BACKLOG COMPLETO

```
PRODUCT BACKLOG — AgroPredict
(Priorizado por valor de negocio, estimado en story points)

EPICA 1: DATOS Y PIPELINE
E1-H1 (8 pts, Must Have):
"Como data engineer, quiero un pipeline automatico que descargue diariamente
 los datos meteorologicos del INAMHI para los 50 cantones de la Sierra
 para mantener el modelo actualizado."
Criterio Done: Pipeline corre en AWS Lambda, logs en CloudWatch, alerta
               si falla mas de 2 dias consecutivos.

E1-H2 (5 pts, Must Have):
"Como data scientist, quiero acceso limpio y validado a los rendimientos
 historicos de papa del MAG 2010-2024 para entrenar el modelo base."
Criterio Done:
  - Dataset en S3 con contrato de datos documentado
  - Reporte de calidad: completitud > 85%, sin duplicados
  - ___________

E1-H3 (8 pts, Should Have):
[Escribe una historia sobre integracion de datos de precios de mercado]

E1-H4 (3 pts, Must Have):
[Historia sobre feature engineering: indices meteorologicos derivados]

EPICA 2: MODELO ML
E2-H1 (5 pts, Must Have):
"Como data scientist, quiero entrenar un modelo baseline de regresion
 para predecir rendimiento de papa y tener una metrica inicial de referencia."
Criterio Done:
  - Modelo Random Forest entrenado y evaluado (MAE, RMSE, R2)
  - Experimento registrado en MLflow
  - MAE < 20% como baseline aceptable
  - ___________

E2-H2 (8 pts, Must Have):
[Historia sobre optimizacion del modelo y seleccion de features]

E2-H3 (13 pts, Should Have):
[Historia sobre modelo interpretable con SHAP values para agricultores]

EPICA 3: PRODUCTO
E3-H1 (8 pts, Must Have):
"Como agricultor de Latacunga, quiero ingresar datos de mi parcela (canton,
 altitud, variedad, fecha de siembra) y recibir una prediccion de rendimiento
 esperado en quintales por hectarea."
Criterio Done:
  - API REST en Flask con endpoint /predict
  - Tiempo de respuesta < 2 segundos
  - ___________
  - ___________

E3-H2 (5 pts, Should Have):
[Historia sobre modo offline de la app (conectividad limitada)]

E3-H3 (3 pts, Could Have):
[Historia sobre comparacion de prediccion vs rendimiento real al cosechar]
```

### ARTEFACTO 3: SPRINT BACKLOG SPRINT 1

```
SPRINT 1 PLANNING
Fecha: [Semana 1-2 del proyecto]
Sprint Goal: "Al final del Sprint 1, tenemos datos limpios del INAMHI
              y MAG listos para modelar, y un modelo baseline funcionando
              con metricas documentadas."

ITEMS COMPROMETIDOS (35 story points):
| ID    | Historia                          | Pts | Dueno   |
|-------|-----------------------------------|-----|---------|
| E1-H1 | Pipeline INAMHI automatico        |  8  | Diego   |
| E1-H2 | Dataset MAG limpio y validado     |  5  | Diego   |
| E1-H4 | Feature engineering meteorologico |  3  | Sofia   |
| E2-H1 | Modelo baseline Random Forest     |  5  | Sofia   |
| TECH1 | Setup AWS + MLflow + GitHub repo  |  5  | Ana     |
| TECH2 | Contrato de datos documentado     |  3  | Pedro   |
| BUFFER| Impedimentos y deuda tecnica      |  6  | -       |
| TOTAL |                                   | 35  |         |

DESGLOSE DETALLADO — E1-H1: Pipeline INAMHI (8 pts)

SEMANA 1:
Dia 1 (Lunes):
  09:00: Sprint Planning (2h) — Todo el equipo
  11:00: Diego — Revisar documentacion API INAMHI, crear cuenta si es necesario
  14:00: Sofia — Setup ambiente Python + MLflow en Colab/local
  15:00: Ana — Crear repositorio GitHub + estructura de carpetas

Dia 2 (Martes):
  09:00: Daily (15 min)
  09:15: Diego — Implementar cliente Python para API INAMHI (4h)
  09:15: Sofia — EDA exploratoria: que variables tiene el dataset MAG (4h)

Dia 3 (Miercoles):
  09:00: Daily (15 min)
  09:15: Diego — Tests de la API + manejo de errores y valores nulos (3h)
  09:15: Sofia — EDA: distribucion temporal, estacionalidad, outliers (3h)
  14:00: Pair: Diego + Sofia revisan esquema de datos conjunto (2h)

Dia 4 (Jueves):
  09:00: Daily (15 min)
  09:15: Diego — Lambda function para descarga diaria en AWS (4h)
  09:15: Pedro — Entrevista con 2 agricultores de Latacunga (validacion) (3h)

Dia 5 (Viernes):
  09:00: Daily (15 min)
  09:15: Diego — Prueba end-to-end del pipeline + documentacion
  15:00: Revision de codigo (code review) con Ana
  17:00: Demo interna del pipeline al equipo (30 min)

SEMANA 2:
[Completa el plan de la semana 2 con el mismo nivel de detalle,
 incluyendo E2-H1 (modelo baseline) como la tarea central]
```

### ARTEFACTO 4: DAILY STANDUPS (3 simulados)

```
DAILY STANDUP — Dia 5 (Viernes semana 1)
[Escribe el dialogo completo de 15 minutos para los 4 miembros del equipo.
 Incluye: un bloqueo real con la API del INAMHI que requiere atencion,
 buenas noticias del EDA que cambian ligeramente la prioridad, y el
 SM gestionando ambas situaciones eficientemente]

DAILY STANDUP — Dia 8 (Miercoles semana 2)
[Escribe el dialogo. El modelo baseline tiene un MAE de 32%, peor de lo
 esperado. Sofia tiene una hipotesis: falta una variable de altitud que
 no esta en el dataset. Diego sabe como obtenerla pero tarda 1 dia.
 Muestra como el equipo decide: ¿cambian el Sprint Backlog o lo dejan
 para el Sprint 2?]

DAILY STANDUP — Dia 10 (Viernes semana 2)
[Ultimo daily antes del Sprint Review. El pipeline esta listo, el modelo
 tiene MAE de 18% (por debajo del objetivo). Hay 6 puntos sin completar
 (TECH2). ¿Como lo gestiona el SM en el daily?]
```

### ARTEFACTO 5: SPRINT REVIEW

```
SPRINT REVIEW — Sprint 1
Fecha: Ultimo viernes del sprint
Asistentes: Todo el equipo + Rosa Lema (PO) + 1 agricultor invitado

AGENDA (60 minutos):
00-05: Scrum Master presenta el Sprint Goal y si se cumplio
05-35: Demo de los entregables
  - Diego muestra el pipeline INAMHI en vivo (5 min)
  - Pedro presenta los hallazgos de las entrevistas con agricultores (5 min)
  - Sofia presenta el modelo baseline con metricas (10 min)
  - Demo del primer prototipo de prediccion en consola Python (5 min)
35-50: Feedback del PO y del agricultor invitado
50-60: Actualizacion del Product Backlog para Sprint 2

RESULTADOS DEL SPRINT:
Items completados: [Lista]
Items no completados y por que: [Lista]
Velocidad real: ___ / 35 comprometidos
Sprint Goal cumplido: Si / No
Feedback clave del PO: [Escribe 3 puntos de feedback realistas]
```

### ARTEFACTO 6: SPRINT RETROSPECTIVA

```
SPRINT RETROSPECTIVA — Sprint 1
Duracion: 45 minutos | Dinamica: Sailboat

[Dibuja (en texto ASCII o describe) el sailboat con:
 - Viento (que nos impulso): 3 items
 - Ancla (que nos freno): 3 items
 - Roca (riesgos para el Sprint 2): 2 items
 - Isla (nuestro objetivo): 1 item]

COMPROMISOS PARA SPRINT 2 (3 items SMART):
1. ___________
2. ___________
3. ___________
```

## Usa IA para...

> Abre Claude con el contexto del proyecto y escribe:
> "Soy Scrum Master del equipo AgroPredict en Ecuador. Al final del Sprint 1, nuestro modelo baseline para predecir rendimiento de papa tiene un MAE de 18% (objetivo era < 15%). El PO quiere que en el Sprint 2 lo bajemos a 12%. El equipo cree que necesitamos datos de suelo del INIAP que aun no tenemos acceso. Ayudame a facilitar la conversacion del Sprint Planning del Sprint 2 donde: a) el equipo sea honesto sobre lo que puede lograr sin los datos del INIAP, b) el PO entienda que el objetivo del 12% puede ser muy agresivo, c) lleguen a un compromiso realista. Dame el guion de 10 intercambios."

Implementa ese guion como el Sprint Planning del Sprint 2.

## Que aprendiste

- Un proyecto de IA gestionado con Agile entrega valor en cada sprint en lugar de esperar 6 meses para ver el primer resultado.
- El Product Backlog de un proyecto ML debe incluir historias tecnicas de datos, modelado, MLOps y producto: todas tienen valor de negocio.
- La Definition of Done en ML debe ser especifica, medible y acordada con el negocio antes de empezar, no despues.
- Los Daily Standups en proyectos de datos revelan dependencias criticas (un dataset bloqueado puede paralizar al equipo).
- La velocidad real del Sprint 1 es la base para planificar el Sprint 2 con realismo.

## Reto extra

Implementa el modelo baseline del proyecto AgroPredict usando datos simulados. Crea un dataset de 5,000 parcelas de papa en Ecuador con las variables: canton, altitud, temperatura_promedio, lluvia_mm, heladas_dias, variedad (Superchola/Gabriela/Esperanza), rendimiento_quintales. Entrena un Random Forest, evalua con MAE y RMSE, registra el experimento en MLflow, y crea un endpoint Flask simple `/predict` que reciba los parametros de una parcela y retorne la prediccion. Documenta todo como si fuera el entregable del Sprint 1.
