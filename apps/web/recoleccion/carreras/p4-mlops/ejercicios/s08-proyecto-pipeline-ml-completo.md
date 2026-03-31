# Ejercicio Sesion 8: Proyecto — Pipeline ML Completo (Train → Deploy → Monitor)

**Materia:** MLOps y Despliegue de Modelos
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 60 min

## Objetivo

Construir un pipeline MLOps de extremo a extremo que integra todas las herramientas del periodo: DVC para versionado, MLflow para tracking, Docker para containerizacion, FastAPI para serving, GitHub Actions para CI/CD y Evidently para monitoreo. El pipeline completo para un problema real ecuatoriano.

## Contexto (Ecuador)

El proyecto final simula el trabajo real de un MLOps Engineer en una empresa ecuatoriana de alto impacto. Elige uno de los siguientes escenarios:

**Escenario A:** Sistema de deteccion de anomalias en el consumo electrico para EERQ (Empresa Electrica Regional Quito). Detecta fraudes (hurto de energia electrica) y fallas tecnicas antes de que escalen.

**Escenario B:** Modelo de prediccion de precios de vivienda para RE/MAX Ecuador. La API permite que los agentes coticen propiedades en tiempo real desde su celular.

**Escenario C:** Clasificador de documentos tributarios para una firma contable de Guayaquil. Clasifica automaticamente facturas, retenciones, declaraciones y notas de credito para acelerar el cierre contable.

## Instrucciones

### Fase 1: Setup del Repositorio (10 min)

1. Crea la estructura completa del proyecto:
   ```bash
   mkdir pipeline-mlops-ecuador
   cd pipeline-mlops-ecuador

   # Inicializa Git y DVC
   git init && dvc init

   # Crea la estructura de directorios
   mkdir -p {data/{raw,processed},models,src,app,tests,config,reports,notebooks}

   # .gitignore inicial
   cat > .gitignore << 'EOF'
   data/raw/
   data/processed/
   models/*.pkl
   models/*.joblib
   __pycache__/
   .env
   venv/
   *.pyc
   EOF

   git add . && git commit -m "chore: inicializa estructura proyecto MLOps Ecuador"
   ```

2. Define la configuracion del proyecto:
   ```yaml
   # config/project_config.yaml
   proyecto:
     nombre: "Proyecto MLOps Ecuador"
     escenario: "A"  # Cambia segun tu eleccion
     version: "1.0.0"

   datos:
     raw_path: "data/raw/"
     processed_path: "data/processed/"
     test_size: 0.2
     random_state: 42

   modelo:
     nombre: "GradientBoosting"
     hiperparametros:
       n_estimators: 200
       learning_rate: 0.05
       max_depth: 5
       random_state: 42

   evaluacion:
     umbrales:
       min_roc_auc: 0.85
       min_f1: 0.78
       max_latencia_ms: 50

   mlflow:
     experiment_name: "MLOps_Ecuador_Pipeline"
     model_name: "modelo_produccion_ec"

   api:
     host: "0.0.0.0"
     port: 8000
     max_batch_size: 50
     api_key_header: "X-ITSEIA-Key"
   ```

### Fase 2: Pipeline de Datos y Entrenamiento (20 min)

3. Implementa el pipeline DVC completo:
   ```bash
   # dvc.yaml - define el DAG del pipeline
   ```
   ```yaml
   stages:
     generar_datos:
       cmd: python src/generar_datos.py
       deps: [src/generar_datos.py, config/project_config.yaml]
       outs: [data/raw/dataset.csv]

     preprocesar:
       cmd: python src/preprocesar.py
       deps: [data/raw/dataset.csv, src/preprocesar.py]
       outs:
         - data/processed/X_train.csv
         - data/processed/X_test.csv
         - data/processed/y_train.csv
         - data/processed/y_test.csv
         - data/processed/preprocessor.pkl

     entrenar:
       cmd: python src/entrenar.py
       deps:
         - data/processed/X_train.csv
         - data/processed/y_train.csv
         - src/entrenar.py
       outs:
         - models/modelo_v1.pkl
       metrics:
         - reports/train_metrics.json:
             cache: false

     evaluar:
       cmd: python src/evaluar.py
       deps:
         - models/modelo_v1.pkl
         - data/processed/X_test.csv
         - data/processed/y_test.csv
         - src/evaluar.py
         - config/project_config.yaml
       metrics:
         - reports/eval_metrics.json:
             cache: false
       plots:
         - reports/confusion_matrix.csv:
             cache: false
         - reports/roc_curve.csv:
             cache: false
   ```

4. Implementa `src/entrenar.py` con MLflow tracking integrado:
   ```python
   import mlflow
   import mlflow.sklearn
   import pandas as pd
   import pickle
   import json
   import yaml
   from sklearn.ensemble import GradientBoostingClassifier
   from sklearn.metrics import roc_auc_score, f1_score, accuracy_score

   with open('config/project_config.yaml') as f:
       config = yaml.safe_load(f)

   X_train = pd.read_csv('data/processed/X_train.csv')
   y_train = pd.read_csv('data/processed/y_train.csv').squeeze()
   X_test  = pd.read_csv('data/processed/X_test.csv')
   y_test  = pd.read_csv('data/processed/y_test.csv').squeeze()

   mlflow.set_experiment(config['mlflow']['experiment_name'])

   with mlflow.start_run(run_name="pipeline_automatico_v1"):
       # Log config completa
       mlflow.log_params(config['modelo']['hiperparametros'])
       mlflow.log_param("escenario", config['proyecto']['escenario'])

       # Entrenamiento
       params = config['modelo']['hiperparametros']
       modelo = GradientBoostingClassifier(**params)
       modelo.fit(X_train, y_train)

       # Metricas
       y_pred = modelo.predict(X_test)
       y_prob = modelo.predict_proba(X_test)[:,1]
       metricas = {
           "roc_auc": roc_auc_score(y_test, y_prob),
           "f1_score": f1_score(y_test, y_pred),
           "accuracy": accuracy_score(y_test, y_pred)
       }
       mlflow.log_metrics(metricas)

       # Guarda modelo con firma (schema de inputs/outputs)
       from mlflow.models.signature import infer_signature
       firma = infer_signature(X_train, y_prob)
       mlflow.sklearn.log_model(
           modelo, "model",
           registered_model_name=config['mlflow']['model_name'],
           signature=firma
       )

       # Artefactos adicionales
       with open('models/modelo_v1.pkl', 'wb') as f:
           pickle.dump(modelo, f)
       with open('reports/train_metrics.json', 'w') as f:
           json.dump(metricas, f, indent=2)

       print(f"Entrenamiento completado: {metricas}")
       mlflow.set_tag("pipeline_version", "1.0")
       mlflow.set_tag("ambiente", "training")
   ```

### Fase 3: API y Containerizacion (15 min)

5. La API FastAPI debe cargar el modelo desde MLflow Model Registry:
   ```python
   # app/main.py
   import mlflow.sklearn
   from fastapi import FastAPI, HTTPException, Depends
   from fastapi.security.api_key import APIKeyHeader
   from pydantic import BaseModel
   import os, time, yaml

   with open('config/project_config.yaml') as f:
       config = yaml.safe_load(f)

   # Carga desde MLflow Registry en startup
   MODEL_URI = f"models:/{config['mlflow']['model_name']}/Production"
   try:
       modelo = mlflow.sklearn.load_model(MODEL_URI)
       print(f"Modelo cargado desde MLflow: {MODEL_URI}")
   except Exception as e:
       print(f"Warning: No se pudo cargar desde MLflow ({e}). Usando archivo local.")
       import pickle
       with open('models/modelo_v1.pkl', 'rb') as f:
           modelo = pickle.load(f)

   app = FastAPI(title=config['proyecto']['nombre'],
                  version=config['proyecto']['version'])

   API_KEY_HEADER = APIKeyHeader(name=config['api']['api_key_header'])
   VALID_KEYS = os.environ.get('API_KEYS', 'dev-key-ecuador').split(',')

   def auth(key: str = Depends(API_KEY_HEADER)):
       if key not in VALID_KEYS: raise HTTPException(403, "API Key invalida")
       return key

   @app.get("/health")
   def health(): return {"status": "ok", "modelo": config['mlflow']['model_name']}

   @app.post("/v1/predict")
   def predict(datos: dict, key: str = Depends(auth)):
       inicio = time.time()
       X = [[datos.get(f, 0) for f in modelo.feature_names_in_]]
       prob = float(modelo.predict_proba(X)[0][1])
       latencia = (time.time() - inicio) * 1000
       return {"probabilidad": prob, "clase": int(prob > 0.5),
               "latencia_ms": round(latencia, 2)}
   ```

6. Dockerfile multi-stage optimizado:
   ```dockerfile
   # Stage 1: Build
   FROM python:3.11-slim AS builder
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir --user -r requirements.txt

   # Stage 2: Runtime
   FROM python:3.11-slim
   WORKDIR /app
   COPY --from=builder /root/.local /root/.local
   COPY . .
   ENV PATH=/root/.local/bin:$PATH
   EXPOSE 8000
   HEALTHCHECK --interval=30s --timeout=10s \
     CMD curl -f http://localhost:8000/health || exit 1
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

### Fase 4: Monitoreo y Cierre (15 min)

7. Reporte final de monitoreo con Evidently:
   ```python
   # src/monitorear.py
   from evidently.report import Report
   from evidently.metric_preset import DataDriftPreset, ClassificationPreset
   import pandas as pd

   # Simula datos de produccion (30 dias post-deploy)
   reference = pd.read_csv('data/processed/X_train.csv')
   current   = pd.read_csv('data/processed/X_test.csv')  # En prod: datos reales del mes

   report = Report(metrics=[DataDriftPreset(), ClassificationPreset()])
   report.run(reference_data=reference, current_data=current,
              column_mapping=None)
   report.save_html('reports/monitoring_report.html')
   print("Reporte de monitoreo: reports/monitoring_report.html")
   ```

8. Documenta el pipeline completo en el notebook `notebooks/pipeline_overview.ipynb`:
   - Diagrama ASCII del flujo completo: datos -> DVC -> entrenamiento -> MLflow -> Docker -> FastAPI -> monitoreo
   - Tabla de herramientas usadas y su rol
   - Metricas finales del modelo en produccion
   - Lecciones aprendidas: 3 decisiones tecnicas que tomaste y por que

## Usa IA para...

- Pedirle a Claude que revise tu arquitectura y proponga 3 mejoras para escalar a 10x el trafico
- Pedirle a ChatGPT que estime el costo mensual de operar este pipeline en AWS (EC2, S3, RDS para MLflow, ECR para Docker)
- Preguntar como esta arquitectura se compara con las soluciones gestionadas (AWS SageMaker, Google Vertex AI, Azure ML): ventajas y desventajas de cada approach
- Generar el resumen ejecutivo de 1 pagina para presentar el pipeline a los directivos de la empresa ecuatoriana: sin jerga tecnica, enfocado en el valor de negocio

## Que aprendiste

Al completar este proyecto integrador de MLOps:
- Sabes construir el pipeline completo de un modelo de ML de produccion desde cero
- Puedes trabajar con las 6 herramientas fundamentales del stack MLOps moderno
- Entiendes como cada pieza del pipeline protege la calidad del modelo en produccion
- Puedes estimar el costo y complejidad de operar un sistema de ML real en Ecuador
- Tienes un proyecto de portfolio real para mostrar en entrevistas de trabajo

## Entregables del Proyecto

Al finalizar, entrega en el repositorio GitHub:
1. `README.md` con instrucciones de setup y ejecucion en 5 pasos
2. Notebook con el reporte de metricas finales y visualizaciones
3. Screenshot de la UI de MLflow con los experimentos
4. Screenshot del reporte HTML de Evidently con el analisis de drift
5. Link al Docker Hub con la imagen publicada
6. Screenshot del pipeline CI/CD ejecutandose en GitHub Actions

## Reto Extra

Implementa el pipeline completo en la nube usando herramientas gestionadas:
- Cambia el tracking de MLflow local a **Dagshub** (gratis, MLflow + DVC en la nube)
- Despliega la API en **Render.com** o **Railway.app** (gratis con Docker)
- Agrega el monitoreo en **Evidently Cloud** (plan gratis disponible)

El objetivo es tener el pipeline 100% en la nube, accesible desde cualquier computador, sin infraestructura local. Comparte el link publico de la API desplegada con tu instructor como entregable final. Esta es exactamente la arquitectura que usarias en tu primer trabajo como MLOps Engineer en una empresa ecuatoriana.
