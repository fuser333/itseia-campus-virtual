# Ejercicio Sesion 1: Que es MLOps — Ciclo de Vida del Modelo

**Materia:** MLOps y Despliegue de Modelos
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 45 min

## Objetivo

Comprender el ciclo de vida completo de un modelo de ML en produccion (ML Lifecycle), identificar los problemas que MLOps resuelve (reproducibilidad, model drift, colaboracion, automatizacion) y disenar el diagrama de arquitectura MLOps para un caso de uso ecuatoriano real.

## Contexto (Ecuador)

El Banco del Pichincha (el banco mas grande del Ecuador con 3 millones de clientes) tiene un modelo de scoring crediticio que evalua el riesgo de cada prestamo. El modelo fue entrenado en 2022, pero el comportamiento economico de los ecuatorianos cambio tras la pandemia y los cambios politicos. El modelo esta tomando malas decisiones. Este es el problema que MLOps resuelve.

## Instrucciones

1. Abre Google Colab. Crea un notebook de investigacion (sin codigo por ahora).

2. Mapea el ciclo de vida del modelo del Banco Pichincha. Crea un diagrama en texto (ASCII art) o con una celda Markdown con los siguientes 8 estadios:

   ```
   [1. DEFINICION DEL PROBLEMA]
       |
       v
   [2. RECOLECCION Y VALIDACION DE DATOS]
       |
       v
   [3. FEATURE ENGINEERING]
       |
       v
   [4. ENTRENAMIENTO Y EXPERIMENTACION]
       |
       v
   [5. EVALUACION Y VALIDACION]
       |
       v
   [6. DESPLIEGUE (DEPLOY)]
       |
       v
   [7. MONITOREO EN PRODUCCION]
       |
       v
   [8. REENTRENAMIENTO] --------> vuelve a [2]
   ```

   Para cada estadio, documenta:
   - Quien es el responsable (Data Scientist, Data Engineer, MLOps Engineer, DevOps)
   - Que herramientas se usan tipicamente
   - Que problemas pueden ocurrir
   - Que entregable produce ese estadio

3. Implementa un modelo baseline del problema de scoring crediticio para demostrar los problemas SIN MLOps:
   ```python
   import numpy as np
   import pandas as pd
   from sklearn.ensemble import GradientBoostingClassifier
   from sklearn.model_selection import train_test_split
   from sklearn.metrics import roc_auc_score
   import pickle
   import datetime

   # Dataset sintetico de creditos ecuatorianos
   np.random.seed(42)
   n = 5000
   df = pd.DataFrame({
       'edad': np.random.randint(20, 65, n),
       'ingresos_mensuales': np.random.lognormal(7, 0.5, n),
       'deudas_actuales': np.random.exponential(2000, n),
       'historial_pagos': np.random.uniform(0, 1, n),
       'empleo_meses': np.random.randint(0, 120, n),
       'provincia': np.random.choice(['Pichincha','Guayas','Azuay','Manabi'], n),
   })
   df['default'] = ((df['deudas_actuales'] > df['ingresos_mensuales'] * 6) |
                    (df['historial_pagos'] < 0.3)).astype(int)

   X = pd.get_dummies(df.drop('default', axis=1))
   y = df['default']
   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

   # Entrenamiento SIN tracking, SIN versionado
   modelo = GradientBoostingClassifier(n_estimators=100, random_state=42)
   modelo.fit(X_train, y_train)

   # Guardar con nombre generico (problema: cual version es esta?)
   with open('modelo_credito.pkl', 'wb') as f:
       pickle.dump(modelo, f)

   auc = roc_auc_score(y_test, modelo.predict_proba(X_test)[:,1])
   print(f"AUC-ROC: {auc:.4f}")
   print("Archivo guardado. Pero... que version es? Cuando se enteno? Con que datos?")
   ```

4. Simula el problema de "model drift": los datos cambian con el tiempo y el modelo degradea:
   ```python
   # Simula datos del 2025 con comportamiento diferente post-crisis
   df_2025 = pd.DataFrame({
       'edad': np.random.randint(20, 65, 1000),
       'ingresos_mensuales': np.random.lognormal(6.8, 0.7, 1000),  # Ingresos bajaron
       'deudas_actuales': np.random.exponential(3500, 1000),        # Deudas subieron
       'historial_pagos': np.random.uniform(0, 0.8, 1000),          # Historial peor
       'empleo_meses': np.random.randint(0, 80, 1000),
       'provincia': np.random.choice(['Pichincha','Guayas','Azuay','Manabi'], 1000),
   })
   df_2025['default'] = ((df_2025['deudas_actuales'] > df_2025['ingresos_mensuales'] * 5) |
                          (df_2025['historial_pagos'] < 0.35)).astype(int)

   X_2025 = pd.get_dummies(df_2025.drop('default', axis=1))
   X_2025 = X_2025.reindex(columns=X_train.columns, fill_value=0)

   auc_2025 = roc_auc_score(df_2025['default'],
                             modelo.predict_proba(X_2025)[:,1])
   print(f"AUC original: {auc:.4f}")
   print(f"AUC con datos 2025: {auc_2025:.4f}")
   print(f"Degradacion: {(auc - auc_2025):.4f} puntos")
   ```

5. Documenta los 5 problemas clave que MLOps resuelve para este banco, con impacto economico estimado.

## Usa IA para...

- Pedirle a Claude que explique la diferencia entre DevOps, DataOps y MLOps con un diagrama de Venn en Markdown
- Preguntar cuales son las 3 causas principales de fracaso de modelos de ML en produccion segun estudios de la industria
- Si no entiendes la diferencia entre "model drift" y "data drift", pedir ejemplos concretos del sector bancario ecuatoriano
- Generar una lista de preguntas para una entrevista de trabajo como MLOps Engineer en una empresa ecuatoriana (Banco Pichincha, Claro, CNT)

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Cuales son las 8 etapas del ciclo de vida de un modelo de ML
- Que es el "model drift" y el "data drift" y como se diferencian
- Por que guardar un modelo como `.pkl` sin metadata es una mala practica
- Que herramientas forman el stack tipico de MLOps (DVC, MLflow, Docker, Kubernetes, CI/CD)

## Reto Extra

Investiga y documenta 3 incidentes reales de fallos de modelos de ML en produccion a nivel mundial (Amazon CV hiring bias, Uber self-driving accident, Facebook content moderation failures). Para cada uno, identifica en que etapa del ciclo de vida fallo el proceso y que practica de MLOps habria prevenido el problema. Concluye: de los 3 incidentes, cual podria ocurrir en Ecuador y que impacto tendria. Presenta esto como un caso de estudio de 1 pagina.
