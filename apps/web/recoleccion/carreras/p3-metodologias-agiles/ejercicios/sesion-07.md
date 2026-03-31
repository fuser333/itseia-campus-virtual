# Ejercicio Sesion 7: Gestion de Proyectos de Datos con Agile

**Materia:** Metodologias Agiles
**Nivel:** Intermedio
**Herramienta IA:** Claude + ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Aplicar Agile especificamente al ciclo de vida de proyectos de datos y machine learning (CRISP-DM + Scrum), disenar el backlog tecnico de un proyecto de ML, gestionar la deuda tecnica y crear metricas de progreso especificas para proyectos de datos en Ecuador.

## Contexto

Gestionar proyectos de datos con Agile tiene desafios unicos que no existen en desarrollo de software tradicional: los requisitos del modelo cambian cuando ves los datos por primera vez, el EDA puede revelar que el problema original no es el correcto, y el "terminado" en ML es subjetivo (¿cuando es suficientemente bueno el modelo?). Este ejercicio integra CRISP-DM (la metodologia estandar de datos) con Scrum para crear un framework practico.

## Instrucciones

1. Crea el archivo `S07_Agile_Proyectos_Datos_[tu_nombre].md`.

2. Integra CRISP-DM con Scrum:

```
CRISP-DM + SCRUM: Framework para Proyectos de Datos Ecuador

FASE CRISP-DM        | SPRINT(S) TIPICO | ENTREGABLES AGILES
---------------------|------------------|---------------------
1. Business          | Sprint 0 (1 sem) | Product Backlog inicial
   Understanding     |                  | Definition of Done para ML
                     |                  | Metricas de exito definidas
---------------------|------------------|---------------------
2. Data              | Sprint 1-2       | Pipeline ETL funcionando
   Understanding     |                  | Reporte EDA con hallazgos
                     |                  | Diccionario de datos
---------------------|------------------|---------------------
3. Data              | Sprint 2-3       | Dataset limpio y validado
   Preparation       |                  | Feature engineering documentado
                     |                  | Tests de calidad de datos
---------------------|------------------|---------------------
4. Modeling          | Sprint 3-5       | Modelo baseline + metricas
                     |                  | Experimentos documentados
                     |                  | Modelo candidato seleccionado
---------------------|------------------|---------------------
5. Evaluation        | Sprint 5-6       | Validacion con stakeholders
                     |                  | A/B test diseñado
                     |                  | Decision: deploy o iterar
---------------------|------------------|---------------------
6. Deployment        | Sprint 6-7       | Modelo en produccion (API)
                     |                  | Monitoreo configurado
                     |                  | Documentacion tecnica

DIFERENCIAS CLAVE DE AGILE EN PROYECTOS DE DATOS:

1. EL EDA PUEDE REDEFINIR EL PROYECTO:
   En Scrum clasico: el Sprint Backlog no cambia durante el sprint.
   En proyectos de datos: si el EDA revela que los datos no soportan el
   objetivo original, el Product Backlog DEBE cambiar.
   Regla: ___________

2. "TERMINADO" ES DIFERENTE:
   En software: la funcionalidad funciona o no funciona.
   En ML: el modelo tiene 82% de accuracy. ¿Es suficiente?
   Definition of Done para ML debe incluir:
   - Metrica minima: ___________ (ej: AUC > 0.85)
   - Validacion con datos de negocio: ___________
   - Comparacion con baseline: ___________

3. LA DEUDA TECNICA EN DATOS:
   ¿Que es la deuda tecnica en proyectos de datos?
   Ejemplos especificos:
   - "El modelo funciona pero solo en la maquina de Sofia"
   - "___________"
   - "___________"
   - "___________"
```

3. Diseña el backlog completo para un proyecto ML real:

```
PROYECTO: Prediccion de abandono escolar temprano — Ministerio de Educacion Ecuador

Contexto: El 18% de estudiantes ecuatorianos abandona la escuela antes de
terminar la secundaria (MINEDUC 2023). El ministerio quiere un modelo que
identifique estudiantes en riesgo 2 meses antes para intervenir a tiempo.

Datos disponibles:
- AMIE (estadisticas escolares): asistencia, calificaciones, repitencia
- INEC: nivel socioeconomico familiar, region, etnia
- MSP: acceso a salud del estudiante

SPRINT 0: Business Understanding (1 semana)
[Completa las historias tecnicas]

Historia S0-1 (8 pts, Tecnica):
"Como equipo de datos, necesitamos definir con el cliente la metrica objetivo
 del modelo para tener criterio de exito claro."
  Criterio Done:
  - Metrica acordada y documentada (ej: Recall > 0.80 para clase 'en riesgo')
  - Presupuesto de falsos negativos definido (costo de no identificar un alumno en riesgo)
  - Firmado por el Director de Analisis del MINEDUC

Historia S0-2 (3 pts, Tecnica):
"Como equipo, necesitamos acceso a los datasets del AMIE y del INEC para
 comenzar la fase de comprension de datos."
  Criterio Done: ___________

[Escribe las historias para los sprints 1-3]

SPRINT 1: Data Understanding (2 semanas)

Historia S1-1 (5 pts):
"Como data scientist, quiero explorar la distribucion de la tasa de abandono
 por provincia para identificar regiones prioritarias de intervencion."
Tareas tecnicas:
  - Conectar a API del AMIE y descargar datos 2018-2023 (Diego, 4h)
  - EDA inicial: distribucion abandono por provincia, anio, etnia (Sofia, 8h)
  - Visualizaciones con Seaborn/Plotly (Sofia, 4h)
  - Reporte EDA en Notion con hallazgos criticos (Sofia+Ana, 3h)

Historia S1-2 (8 pts): [Escribe tu propia historia para esta fase]
Historia S1-3 (5 pts): [Escribe tu propia historia]

SPRINT 2: Data Preparation (2 semanas)
[Escribe 3 historias tecnicas para limpieza, feature engineering, split train/test]

SPRINT 3: Modelado (2 semanas)
[Escribe 3 historias: baseline, comparacion modelos, optimizacion]
```

4. Crea el Burndown Chart del Sprint 3 y analiza que paso:

```python
# BURNDOWN CHART — Sprint 3 (Modelado)
# Abre en Google Colab

import matplotlib.pyplot as plt
import numpy as np

dias = list(range(0, 11))  # 10 dias de trabajo (2 semanas sin fines de semana)

# Puntos comprometidos: 40
# Linea ideal: baja linealmente de 40 a 0
ideal = [40 - (40/10)*d for d in dias]

# Puntos reales completados (el equipo tuvo problemas con los datos)
real = [40, 40, 37, 35, 35, 30, 27, 22, 18, 14, 10]
# Nota: terminaron el sprint con 10 puntos sin completar

fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(dias, ideal, 'b--', linewidth=2, label='Progreso ideal', alpha=0.6)
ax.plot(dias, real, 'r-o', linewidth=2.5, markersize=7, label='Progreso real')

# Anotaciones de eventos
ax.annotate('Dia 3-4: Datos AMIE\ntienen errores\n(limpieza extra)',
            xy=(4, 35), xytext=(5.5, 38),
            arrowprops=dict(arrowstyle='->', color='#F0846D'),
            color='#F0846D', fontsize=9)

ax.annotate('Dia 7: PO cambia\nmetrica objetivo',
            xy=(7, 22), xytext=(5, 18),
            arrowprops=dict(arrowstyle='->', color='#F0846D'),
            color='#F0846D', fontsize=9)

ax.fill_between(dias, ideal, real,
                where=[r > i for r, i in zip(real, ideal)],
                alpha=0.1, color='red', label='Deuda del sprint')

ax.set_xlabel('Dia del sprint', fontsize=12)
ax.set_ylabel('Story points restantes', fontsize=12)
ax.set_title('Burndown Chart — Sprint 3: Modelado\nProyecto Abandono Escolar MINEDUC Ecuador',
             fontsize=12, color='#1F2F58', loc='left')
ax.legend()
ax.set_xticks(dias)
ax.set_xticklabels(['Ini','D1','D2','D3','D4','D5','D6','D7','D8','D9','D10'])
ax.grid(True, alpha=0.3)
for sp in ['top','right']: ax.spines[sp].set_visible(False)

plt.tight_layout()
plt.savefig('burndown_sprint3_mineduc.png', dpi=150, bbox_inches='tight')
plt.show()

print("Analisis del sprint:")
print(f"  Comprometido: 40 story points")
print(f"  Completado: {40 - real[-1]} story points ({(40-real[-1])/40*100:.0f}%)")
print(f"  Pendiente: {real[-1]} story points")
print("\nPreguntas para la retrospectiva:")
print("  1. ¿Por que los datos del AMIE tuvieron errores?")
print("     -> No hubo validacion de calidad antes de planificar el sprint")
print("  2. ¿Por que el PO cambio la metrica a mitad del sprint?")
print("     -> ___________")
print("  3. ¿Que cambiamos en el Sprint 4?")
print("     -> ___________")
```

5. En el documento, responde: ¿Cual es la diferencia entre un proyecto de datos "terminado" y uno "listo para produccion"? Nombra 5 cosas que deben verificarse entre esos dos estados.

## Usa IA para...

> Abre Claude y escribe:
> "Soy lider de un equipo de datos trabajando en un modelo ML para el MINEDUC Ecuador que predice abandono escolar. Mi Product Owner (Director de Analisis) dice que el modelo con 78% de accuracy 'no es suficiente bueno' pero no sabe exactamente que umbral necesita. Como Scrum Master, ayudame a facilitar una sesion de 30 minutos con el PO para definir la Definition of Done del modelo en terminos de negocio, no tecnicos. Dame el guion de la sesion."

Implementa esa sesion como un roleplay con un companero donde uno es el SM y el otro el Director de Analisis.

## Que aprendiste

- CRISP-DM + Scrum es mas efectivo que usar cualquiera de los dos solos para proyectos de datos.
- El EDA puede (y debe) redefinir el Product Backlog: es una caracteristica de los proyectos de datos, no un fallo de planificacion.
- La Definition of Done en ML debe incluir metricas cuantificables acordadas con el negocio, no solo metricas tecnicas.
- El Burndown Chart revela patrones: si la curva real esta siempre por encima de la ideal, hay problemas sistematicos (subestimacion, datos de mala calidad, cambios de alcance).
- La deuda tecnica en datos (modelos no reproducibles, pipelines manuales) es tan peligrosa como en software.

## Reto extra

Diseña el MLflow experiment tracking setup para el proyecto del MINEDUC. Usando MLflow (gratuito), configura el logging de: parametros del modelo (n_estimators, max_depth), metricas (accuracy, recall, AUC, F1), artefactos (modelo serializado, reporte de clasificacion, grafico de importancia de variables). Muestra como 3 experimentos distintos quedan registrados y como el equipo puede comparar y seleccionar el mejor modelo para produccion.
