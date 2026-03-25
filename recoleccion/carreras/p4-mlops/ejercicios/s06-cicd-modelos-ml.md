# Ejercicio Sesion 6: CI/CD para Modelos de ML

**Materia:** MLOps y Despliegue de Modelos
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 55 min

## Objetivo

Implementar un pipeline de CI/CD (Continuous Integration / Continuous Deployment) completo para modelos de ML usando GitHub Actions: tests automaticos de calidad del modelo, construccion de imagen Docker, validacion de metricas antes del deploy y despliegue automatico solo si el modelo supera los umbrales de performance definidos.

## Contexto (Ecuador)

El equipo de ML de Pacifictel (empresa de telecomunicaciones de la Costa ecuatoriana) despliega actualizaciones de su modelo de prediccion de fallas de red cada semana. Sin CI/CD, el proceso manual toma 3 dias y ha causado 3 incidentes de produccion en el ultimo ano por modelos mal validados. Con CI/CD, el pipeline valida el modelo automaticamente antes de desplegarlo y solo lo sube si supera los criterios de calidad.

## Instrucciones

1. Prerequisito: Cuenta en GitHub con un repositorio nuevo. Conocimiento basico de Git.

2. Estructura del proyecto:
   ```
   pacifictel-red-predictor/
   ├── .github/
   │   └── workflows/
   │       ├── ci.yml          # Tests en cada PR
   │       └── cd.yml          # Deploy en merge a main
   ├── src/
   │   ├── train.py
   │   ├── evaluate.py
   │   └── predict.py
   ├── app/
   │   └── main.py             # FastAPI
   ├── tests/
   │   ├── test_model.py
   │   └── test_api.py
   ├── Dockerfile
   ├── requirements.txt
   └── config/
       └── thresholds.json     # Umbrales de calidad del modelo
   ```

3. Define los umbrales de calidad del modelo:
   ```json
   // config/thresholds.json
   {
     "min_accuracy": 0.85,
     "min_f1_score": 0.80,
     "min_roc_auc": 0.88,
     "max_false_negative_rate": 0.15,
     "max_inference_time_ms": 100,
     "min_training_samples": 1000
   }
   ```

4. Implementa el script de evaluacion con validacion de umbrales:
   ```python
   # src/evaluate.py
   import json
   import pickle
   import sys
   import time
   import numpy as np
   from sklearn.metrics import (accuracy_score, f1_score,
                                 roc_auc_score, confusion_matrix)

   def evaluar_modelo(modelo_path: str, X_test, y_test,
                       thresholds_path: str = 'config/thresholds.json'):
       with open(modelo_path, 'rb') as f:
           artefacto = pickle.load(f)
       modelo = artefacto['modelo']

       with open(thresholds_path) as f:
           thresholds = json.load(f)

       # Metricas
       y_pred = modelo.predict(X_test)
       y_prob = modelo.predict_proba(X_test)[:,1]

       inicio = time.time()
       _ = modelo.predict(X_test[:100])
       latencia_ms = (time.time() - inicio) * 10  # promedio por muestra

       metricas = {
           "accuracy": accuracy_score(y_test, y_pred),
           "f1_score": f1_score(y_test, y_pred),
           "roc_auc": roc_auc_score(y_test, y_prob),
           "false_negative_rate": confusion_matrix(y_test, y_pred)[1][0] / sum(y_test),
           "inference_time_ms": latencia_ms
       }

       # Validacion de umbrales
       errores = []
       checks = [
           ("accuracy",          metricas["accuracy"],          thresholds["min_accuracy"],          True),
           ("f1_score",          metricas["f1_score"],          thresholds["min_f1_score"],           True),
           ("roc_auc",           metricas["roc_auc"],           thresholds["min_roc_auc"],            True),
           ("false_neg_rate",    metricas["false_negative_rate"],thresholds["max_false_negative_rate"],False),
           ("inference_time_ms", metricas["inference_time_ms"], thresholds["max_inference_time_ms"],  False),
       ]

       for nombre, valor, umbral, mayor_es_mejor in checks:
           pasa = valor >= umbral if mayor_es_mejor else valor <= umbral
           estado = "PASA" if pasa else "FALLA"
           print(f"[{estado}] {nombre}: {valor:.4f} (umbral: {umbral})")
           if not pasa:
               errores.append(f"{nombre}={valor:.4f} no cumple umbral {umbral}")

       if errores:
           print(f"\nMODELO NO APROBADO: {len(errores)} criterio(s) fallaron")
           sys.exit(1)  # Exit code 1 = falla el pipeline CI/CD
       else:
           print("\nMODELO APROBADO: todos los criterios superados")
           with open('metrics/evaluation_report.json', 'w') as f:
               json.dump(metricas, f, indent=2)
           sys.exit(0)
   ```

5. Crea los tests de model quality:
   ```python
   # tests/test_model.py
   import pytest
   import pickle
   import numpy as np
   from sklearn.metrics import roc_auc_score

   @pytest.fixture
   def modelo_y_datos():
       with open('models/modelo_red.pkl', 'rb') as f:
           artefacto = pickle.load(f)
       np.random.seed(123)
       # Genera datos de test con distribucion conocida
       X = np.random.randn(500, 10)
       y = (X[:,0] + X[:,1] > 0).astype(int)
       return artefacto['modelo'], X, y

   def test_modelo_existe():
       import os
       assert os.path.exists('models/modelo_red.pkl'), "El modelo no existe"

   def test_modelo_predice(modelo_y_datos):
       modelo, X, y = modelo_y_datos
       preds = modelo.predict(X)
       assert len(preds) == len(y), "Numero de predicciones incorrecto"
       assert set(preds).issubset({0, 1}), "Predicciones binarias esperadas"

   def test_modelo_tiene_probabilidades(modelo_y_datos):
       modelo, X, y = modelo_y_datos
       probs = modelo.predict_proba(X)
       assert probs.shape == (len(X), 2), "Shape de probabilidades incorrecto"
       assert np.allclose(probs.sum(axis=1), 1.0), "Probabilidades deben sumar 1"

   def test_no_overfitting(modelo_y_datos):
       """El modelo no debe tener 100% accuracy (indica overfitting)"""
       modelo, X, y = modelo_y_datos
       from sklearn.metrics import accuracy_score
       acc = accuracy_score(y, modelo.predict(X))
       assert acc < 0.99, f"Accuracy de {acc:.2%} sugiere overfitting"
   ```

6. Crea el workflow de CI (`.github/workflows/ci.yml`):
   ```yaml
   name: CI - Validar Modelo ML

   on:
     push:
       branches: [develop, feature/*]
     pull_request:
       branches: [main]

   jobs:
     test-model:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout codigo
           uses: actions/checkout@v4

         - name: Setup Python 3.11
           uses: actions/setup-python@v4
           with:
             python-version: '3.11'
             cache: 'pip'

         - name: Instalar dependencias
           run: pip install -r requirements.txt

         - name: Ejecutar tests unitarios
           run: pytest tests/ -v --tb=short

         - name: Entrenar modelo (si hay cambios en src/)
           run: python src/train.py

         - name: Validar metricas del modelo
           run: python src/evaluate.py models/modelo_red.pkl
           # Si el modelo no supera los umbrales, este step falla
           # y el PR no puede mergearse a main

         - name: Construir imagen Docker
           run: docker build -t pacifictel-red:${{ github.sha }} .

         - name: Subir reporte de metricas
           uses: actions/upload-artifact@v3
           with:
             name: model-evaluation-report
             path: metrics/evaluation_report.json
   ```

7. Crea el workflow de CD (`.github/workflows/cd.yml`):
   ```yaml
   name: CD - Deploy a Produccion

   on:
     push:
       branches: [main]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       needs: []  # Solo se ejecuta si CI paso

       steps:
         - uses: actions/checkout@v4
         - name: Login a Docker Hub
           uses: docker/login-action@v2
           with:
             username: ${{ secrets.DOCKERHUB_USERNAME }}
             password: ${{ secrets.DOCKERHUB_TOKEN }}

         - name: Build y Push imagen
           uses: docker/build-push-action@v4
           with:
             push: true
             tags: |
               tu-usuario/pacifictel-red:latest
               tu-usuario/pacifictel-red:${{ github.sha }}

         - name: Deploy en servidor (SSH)
           uses: appleboy/ssh-action@master
           with:
             host: ${{ secrets.SERVER_HOST }}
             username: ${{ secrets.SERVER_USER }}
             key: ${{ secrets.SSH_PRIVATE_KEY }}
             script: |
               docker pull tu-usuario/pacifictel-red:latest
               docker stop pacifictel-app || true
               docker rm pacifictel-app || true
               docker run -d --name pacifictel-app \
                 -p 8000:8000 \
                 --restart always \
                 tu-usuario/pacifictel-red:latest
               echo "Deploy completado: $(date)"
   ```

## Usa IA para...

- Pedirle a Claude que explique la diferencia entre CI (validacion automatica) y CD (despliegue automatico) con el diagrama del pipeline completo para el caso de Pacifictel
- Preguntar como implementar "canary deployment" para modelos de ML: despliega el nuevo modelo al 10% del trafico primero, mide resultados, y solo si son buenos lo sube al 100%
- Si el pipeline CI falla por un modelo que tecnicamente funciona pero los umbrales son muy estrictos, preguntar como disenar umbrales adaptativos basados en el historial de performance
- Pedir el codigo para notificar por Slack o email cuando el pipeline falla o cuando un modelo nuevo llega a produccion

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que es un "quality gate" en CI/CD para modelos y como protege de regresiones en produccion
- Por que las metricas del modelo deben validarse automaticamente antes de cada deploy
- Que es el "canary deployment" y por que es mejor que el "big bang deployment" para modelos de ML
- Como los GitHub Secrets protegen credenciales (DockerHub, SSH) sin exponerlos en el codigo

## Reto Extra

Implementa "model comparison CI": antes de hacer merge a main, el pipeline CI compara automaticamente el nuevo modelo vs el modelo actualmente en produccion usando el mismo dataset de evaluacion. Si el nuevo modelo tiene peor AUC que el modelo en produccion, el CI falla y el PR no puede mergearse. Agrega un comentario automatico en el PR de GitHub con la tabla comparativa de metricas (nuevo vs produccion) usando la API de GitHub via `gh` CLI o el action `marocchino/sticky-pull-request-comment`.
