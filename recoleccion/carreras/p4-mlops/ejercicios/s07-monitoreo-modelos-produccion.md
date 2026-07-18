# Ejercicio Sesion 7: Monitoreo de Modelos en Produccion

**Materia:** MLOps y Despliegue de Modelos
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion:** 55 min

## Objetivo

Implementar monitoreo completo de modelos en produccion: deteccion de data drift y model drift, alertas automaticas, dashboards de performance en tiempo real y sistema de reentrenamiento triggereado por degradacion de metricas. Usando Evidently AI, Prometheus y Grafana.

## Contexto (Ecuador)

El modelo de prediccion de churn de Claro Ecuador (3 millones de clientes) fue desplegado en enero de 2025. En marzo, el equipo recibe quejas de que el modelo esta fallando: esta prediciendo "no churn" para clientes que se estan yendo. El problema es data drift: el comportamiento de los usuarios cambio tras el lanzamiento de una promocion de la competencia (CNT fibra). Sin monitoreo, este problema se detecta tarde. Con monitoreo automatico, una alerta se dispara en 48 horas.

## Instrucciones

1. Instala las herramientas de monitoreo:
   ```bash
   pip install evidently prometheus-client grafana-api pandas scikit-learn fastapi uvicorn
   ```

2. Simula el escenario de data drift:
   ```python
   import numpy as np
   import pandas as pd
   from sklearn.ensemble import GradientBoostingClassifier
   from sklearn.model_selection import train_test_split
   import pickle

   np.random.seed(42)
   n = 5000

   # Dataset de ENTRENAMIENTO (comportamiento enero 2025)
   df_train = pd.DataFrame({
       'datos_consumidos_gb': np.random.lognormal(3.5, 0.8, n),
       'llamadas_mes': np.random.poisson(45, n),
       'meses_contrato': np.random.randint(1, 36, n),
       'facturas_vencidas': np.random.poisson(0.3, n),
       'velocidad_promedio_mbps': np.random.normal(15, 5, n).clip(1, 50),
       'cambio_plan_reciente': np.random.binomial(1, 0.1, n)
   })
   df_train['churn'] = (
       (df_train['facturas_vencidas'] > 1) |
       (df_train['meses_contrato'] < 3) |
       (df_train['velocidad_promedio_mbps'] < 5)
   ).astype(int)

   X_train = df_train.drop('churn', axis=1)
   y_train = df_train['churn']
   model = GradientBoostingClassifier(n_estimators=100, random_state=42)
   model.fit(X_train, y_train)
   with open('models/modelo_churn_claro.pkl', 'wb') as f:
       pickle.dump(model, f)

   # Dataset de PRODUCCION (comportamiento marzo 2025 - POST drift)
   # CNT lanzo fibra de 300Mbps a mitad de precio -> CAMBIO DE COMPORTAMIENTO
   df_produccion = pd.DataFrame({
       'datos_consumidos_gb': np.random.lognormal(4.2, 1.2, 1000),  # SUBE (mas uso)
       'llamadas_mes': np.random.poisson(30, 1000),                   # BAJA (WhatsApp)
       'meses_contrato': np.random.randint(1, 36, 1000),
       'facturas_vencidas': np.random.poisson(0.5, 1000),             # SUBE (incertidumbre)
       'velocidad_promedio_mbps': np.random.normal(12, 7, 1000).clip(1, 50),  # MAS VARIANZA
       'cambio_plan_reciente': np.random.binomial(1, 0.3, 1000)       # MAS CAMBIOS
   })

   print("Dataset de entrenamiento y produccion generados.")
   print(f"Diferencia en datos_consumidos_gb: "
         f"train={df_train['datos_consumidos_gb'].mean():.1f} "
         f"vs prod={df_produccion['datos_consumidos_gb'].mean():.1f}")
   ```

3. Analisis de data drift con Evidently:
   ```python
   from evidently.report import Report
   from evidently.metric_preset import DataDriftPreset, DataQualityPreset
   from evidently.metrics import ColumnDriftMetric

   # Reporte de drift completo
   report = Report(metrics=[
       DataDriftPreset(),
       DataQualityPreset(),
       ColumnDriftMetric(column_name="datos_consumidos_gb"),
       ColumnDriftMetric(column_name="llamadas_mes"),
       ColumnDriftMetric(column_name="velocidad_promedio_mbps"),
   ])

   report.run(reference_data=df_train.drop('churn', axis=1),
              current_data=df_produccion)

   # Guarda el reporte HTML interactivo
   report.save_html("reports/drift_report_marzo_2025.html")
   print("Reporte generado: reports/drift_report_marzo_2025.html")
   print("Abre este archivo en tu navegador para ver el dashboard interactivo")

   # Extrae los resultados como JSON para alertas
   report_dict = report.as_dict()
   drift_detected = any(
       m.get('result', {}).get('drift_detected', False)
       for m in report_dict.get('metrics', [])
   )
   print(f"\nDRIFT DETECTADO: {drift_detected}")
   ```

4. Monitoreo de performance del modelo en el tiempo:
   ```python
   from evidently.metric_preset import ClassificationPreset
   from evidently.test_suite import TestSuite
   from evidently.tests import (TestNumberOfDriftedColumns,
                                  TestShareOfDriftedColumns,
                                  TestColumnDrift)

   # Simula predicciones del modelo en produccion con labels reales
   with open('models/modelo_churn_claro.pkl', 'rb') as f:
       modelo = pickle.load(f)

   df_produccion['churn_real'] = (
       (df_produccion['facturas_vencidas'] > 0.8) |
       (df_produccion['cambio_plan_reciente'] == 1)
   ).astype(int)
   df_produccion['churn_predicho'] = modelo.predict(df_produccion.drop('churn_real', axis=1))

   # Test suite para validar calidad continua
   tests = TestSuite(tests=[
       TestNumberOfDriftedColumns(lt=3),       # Menos de 3 columnas con drift
       TestShareOfDriftedColumns(lt=0.3),       # Menos del 30% de columnas con drift
       TestColumnDrift(column_name="datos_consumidos_gb", stattest_threshold=0.1),
   ])
   tests.run(reference_data=df_train.drop('churn', axis=1),
             current_data=df_produccion.drop(['churn_real','churn_predicho'], axis=1))
   tests.save_html("reports/test_suite_marzo_2025.html")

   # Resultados
   resultados = tests.as_dict()
   tests_fallidos = [t for t in resultados['tests'] if t['status'] == 'FAIL']
   print(f"\nTests fallidos: {len(tests_fallidos)}")
   for t in tests_fallidos:
       print(f"  FALLO: {t['name']} - {t.get('description', '')}")
   ```

5. Expone metricas de monitoreo via Prometheus:
   ```python
   # monitoring/metrics_server.py
   from prometheus_client import start_http_server, Counter, Gauge, Histogram
   import time
   import random

   # Define las metricas
   PREDICCIONES_TOTAL = Counter('ml_predictions_total', 'Total de predicciones realizadas',
                                  ['modelo', 'resultado'])
   PRECISION_MODELO = Gauge('ml_model_precision', 'Precision del modelo en produccion',
                              ['modelo'])
   LATENCIA_INFERENCIA = Histogram('ml_inference_duration_seconds',
                                    'Latencia de inferencia en segundos',
                                    buckets=[0.001, 0.005, 0.01, 0.05, 0.1, 0.5])
   DATA_DRIFT_SCORE = Gauge('ml_data_drift_score', 'Score de data drift (0=sin drift, 1=drift total)',
                              ['feature'])

   def simular_trafico_produccion():
       """Simula trafico en produccion y actualiza metricas"""
       start_http_server(8001)  # Prometheus scrape en :8001/metrics
       print("Servidor de metricas iniciado en :8001/metrics")

       precision_actual = 0.88
       while True:
           # Simula prediccion
           inicio = time.time()
           time.sleep(random.uniform(0.001, 0.05))  # Latencia simulada
           latencia = time.time() - inicio

           resultado = random.choice(['churn', 'no_churn'])
           PREDICCIONES_TOTAL.labels(modelo='churn_v1', resultado=resultado).inc()
           LATENCIA_INFERENCIA.observe(latencia)

           # Simula degradacion gradual (drift)
           precision_actual -= random.uniform(0, 0.002)
           PRECISION_MODELO.labels(modelo='churn_v1').set(precision_actual)
           DATA_DRIFT_SCORE.labels(feature='datos_consumidos_gb').set(
               max(0, 1 - precision_actual)
           )

           if precision_actual < 0.75:
               print("ALERTA: Precision bajo umbral critico 0.75!")
               precision_actual = 0.88  # Reset para la demo

           time.sleep(1)

   if __name__ == '__main__':
       simular_trafico_produccion()
   ```

6. Configura alertas automaticas cuando hay drift:
   ```python
   import smtplib
   from email.mime.text import MIMEText

   def enviar_alerta_drift(features_con_drift: list, metricas: dict):
       """Envia alerta al equipo de ML cuando se detecta drift significativo"""
       mensaje = f"""
       ALERTA DATA DRIFT - Modelo Churn Claro Ecuador

       Se ha detectado drift significativo en las siguientes features:
       {', '.join(features_con_drift)}

       Metricas actuales:
       - AUC-ROC: {metricas.get('roc_auc', 'N/A'):.4f}
       - Precision: {metricas.get('precision', 'N/A'):.4f}

       ACCION REQUERIDA: Revisar si es necesario reentrenar el modelo.
       Dashboard: http://grafana.claro.ec/d/ml-monitoring

       Este mensaje fue generado automaticamente por el sistema MLOps de ITSEIA.
       """
       print(f"[SIMULADO] Email de alerta enviado a: mlops-team@claro.com.ec")
       print(mensaje)

   # Ejecuta la alerta si se detecta drift
   if drift_detected:
       features_drift = ['datos_consumidos_gb', 'llamadas_mes']
       enviar_alerta_drift(features_drift, {'roc_auc': 0.74, 'precision': 0.71})
   ```

## Usa IA para...

- Pedirle a ChatGPT que explique la diferencia entre data drift, concept drift y model decay con ejemplos de negocios ecuatorianos para cada uno
- Preguntar cuales son las pruebas estadisticas disponibles para detectar drift: KS test, Population Stability Index (PSI), Chi-squared, Wasserstein distance
- Si Evidently no detecta drift pero el business reporta que el modelo esta fallando, preguntar como detectar "concept drift silencioso" donde los datos se ven iguales pero la relacion input-output cambio
- Pedir el codigo para implementar un "champion-challenger" setup: el modelo viejo (champion) maneja el 90% del trafico y el nuevo (challenger) el 10%, con A/B testing automatico

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Cual es la diferencia entre data drift (cambio en X), concept drift (cambio en P(Y|X)) y model decay
- Que es el PSI (Population Stability Index) y que valor indica drift significativo (>0.2 = critico)
- Por que monitorear la distribucion de las features de entrada es tan importante como monitorear la precision del modelo
- Como Prometheus y Grafana complementan a Evidently en un stack de monitoreo ML completo

## Reto Extra

Implementa un sistema de reentrenamiento automatico triggereado por drift. Cuando el score de drift supera 0.2 en mas de 2 features, el sistema automaticamente: 1) Descarga los datos de produccion recientes (ultimos 30 dias), 2) Los combina con los datos de entrenamiento originales (50/50), 3) Reentrena el modelo, 4) Si el nuevo modelo supera al viejo en el test set, lo sube al Model Registry de MLflow como version candidata, 5) Envia notificacion al equipo. Todo esto sin intervencion humana. Implementa el loop completo en un script `auto_retrain.py` que puede ejecutarse desde un cron job diario.
