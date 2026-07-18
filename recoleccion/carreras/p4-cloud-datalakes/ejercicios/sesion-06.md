# Ejercicio Sesion 6: MLOps y Despliegue de Modelos

**Materia:** Cloud Computing y Data Lakes
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 50 min

## Objetivo

Implementar MLOps para llevar modelos de ML a produccion: versionado de experimentos con MLflow, empaquetado con Docker, despliegue como API REST con FastAPI, monitoreo de drift, y ciclo CI/CD para reentrenamiento automatico, aplicados al modelo de scoring crediticio ecuatoriano.

## Contexto

El 87% de los modelos de ML nunca llegan a produccion — se quedan en notebooks. MLOps es la disciplina que conecta el laboratorio con produccion. En Ecuador, las cooperativas de la SEPS y el Banco Pichincha necesitan modelos de scoring que se actualicen mensualmente, sean auditables y tengan API para consumir desde sistemas core bancarios.

## Instrucciones

1. Instala: `pip install mlflow fastapi uvicorn`.

2. Crea el archivo `sesion06_mlops_fastapi_ecuador.py`:

```python
# MLOps + FastAPI - ITSEIA
# Cloud Computing y Data Lakes
# Modelo scoring → MLflow → API → monitoreo

import pandas as pd
import numpy as np
import json
import pickle
import os
from datetime import datetime
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, accuracy_score
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("MLOPS + FASTAPI — SCORING CREDITICIO ECUADOR")
print("=" * 65)

# ================================================
# PIPELINE MLOPS: CICLO COMPLETO
# ================================================
print("\n--- CICLO MLOPS ---")
ciclo_mlops = {
    "1. Data":       "Extraer + validar datos de la COAC",
    "2. Develop":    "Feature engineering + entrenamiento (notebook)",
    "3. Track":      "MLflow: loggear metricas, params, artefactos",
    "4. Package":    "Docker container con modelo + dependencias",
    "5. Deploy":     "FastAPI en Cloud Run / ECS / Kubernetes",
    "6. Monitor":    "Data drift PSI, performance drift AUC",
    "7. Retrain":    "Trigger automatico cuando AUC cae > 3%",
}
for paso, desc in ciclo_mlops.items():
    print(f"  {paso:<15}: {desc}")

# ================================================
# ENTRENAR MODELO (version produccion)
# ================================================
print("\n--- ENTRENAMIENTO MODELO PRODUCCION ---")

n = 5000
X_raw = pd.DataFrame({
    "edad":                  np.random.randint(18, 65, n),
    "ingreso_log":           np.random.normal(7.5, 0.6, n),
    "ratio_deuda_ingreso":   np.random.uniform(0.05, 3.0, n),
    "años_socio":            np.random.randint(0, 20, n),
    "puntaje_interno":       np.random.randint(300, 950, n),
    "tasa_cumplimiento":     np.random.uniform(0, 1, n),
    "tiene_garante":         np.random.binomial(1, 0.55, n),
    "plazo_meses":           np.random.choice([12,24,36,48,60], n),
    "tipo_credito_enc":      np.random.randint(1, 5, n),
    "provincia_riesgo":      np.random.uniform(0.08, 0.30, n),
})

log_odds = (-5 + 2.5*X_raw["ratio_deuda_ingreso"]
             - 0.003*X_raw["puntaje_interno"]
             - 0.8*X_raw["tasa_cumplimiento"]
             - 0.5*X_raw["tiene_garante"]
             + np.random.normal(0, 0.8, n))
y = (1/(1+np.exp(-log_odds)) > 0.45).astype(int)

X_train, X_test, y_train, y_test = train_test_split(X_raw, y, test_size=0.2,
                                                      random_state=42, stratify=y)
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

params = {"n_estimators": 150, "learning_rate": 0.08, "max_depth": 4,
          "min_samples_leaf": 20, "random_state": 42}
modelo = GradientBoostingClassifier(**params)
modelo.fit(X_train_s, y_train)
y_prob = modelo.predict_proba(X_test_s)[:, 1]
auc_score = roc_auc_score(y_test, y_prob)

print(f"  AUC: {auc_score:.4f} | Train size: {len(X_train)} | Test size: {len(X_test)}")

# ================================================
# MLFLOW: TRACKING DE EXPERIMENTOS
# ================================================
print("\n--- MLFLOW: TRACKING ---")

try:
    import mlflow
    import mlflow.sklearn

    mlflow.set_experiment("scoring_coac_ecuador")

    with mlflow.start_run(run_name=f"gbm_v1_{datetime.now().strftime('%Y%m%d_%H%M')}"):
        # Loggear parametros
        mlflow.log_params(params)
        mlflow.log_param("scaler", "StandardScaler")
        mlflow.log_param("features", list(X_raw.columns))
        mlflow.log_param("train_size", len(X_train))

        # Loggear metricas
        mlflow.log_metric("auc_roc", auc_score)
        mlflow.log_metric("accuracy", accuracy_score(y_test, (y_prob > 0.5).astype(int)))
        mlflow.log_metric("mora_rate_train", y_train.mean())

        # Loggear modelo
        mlflow.sklearn.log_model(
            modelo, "model",
            registered_model_name="scoring_coac_ecuador_v1",
            input_example=X_test.head(3)
        )

        run_id = mlflow.active_run().info.run_id
        print(f"  MLflow run_id: {run_id}")
        print(f"  Experimento: scoring_coac_ecuador")
        print(f"  AUC loggeado: {auc_score:.4f}")
        print(f"  Modelo registrado: scoring_coac_ecuador_v1")

    MLFLOW_OK = True
except ImportError:
    MLFLOW_OK = False
    print("  mlflow no instalado. Instala con: pip install mlflow")
    print("  Guardando modelo con pickle como alternativa...")

# Guardar modelo para uso en FastAPI
MODEL_PATH = "/tmp/modelo_coac_ecuador.pkl"
SCALER_PATH = "/tmp/scaler_coac_ecuador.pkl"
METADATA_PATH = "/tmp/metadata_coac_ecuador.json"

with open(MODEL_PATH, "wb") as f:
    pickle.dump(modelo, f)
with open(SCALER_PATH, "wb") as f:
    pickle.dump(scaler, f)

metadata = {
    "version": "1.0.0",
    "fecha_entrenamiento": datetime.now().isoformat(),
    "auc_test": round(auc_score, 4),
    "features": list(X_raw.columns),
    "n_train": len(X_train),
    "threshold_produccion": 0.40,
    "descripcion": "Modelo GBM scoring crediticio COAC Ecuador",
}
with open(METADATA_PATH, "w") as f:
    json.dump(metadata, f, indent=2)

print(f"  Modelo guardado: {MODEL_PATH}")
print(f"  Scaler guardado: {SCALER_PATH}")
print(f"  Metadata:        {METADATA_PATH}")

# ================================================
# FASTAPI: CODIGO DE LA API (mostrar estructura)
# ================================================
print("\n--- FASTAPI: ESTRUCTURA DE LA API ---")

codigo_fastapi = '''
# api/main.py — FastAPI para scoring crediticio COAC Ecuador

from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel, validator, Field
import pickle, json, numpy as np, pandas as pd
from datetime import datetime

app = FastAPI(
    title="Scoring Crediticio COAC Ecuador",
    description="API para prediccion de riesgo de mora — SEPS compliant",
    version="1.0.0",
)

# Cargar modelo al iniciar
with open("modelo_coac_ecuador.pkl", "rb") as f:
    MODELO = pickle.load(f)
with open("scaler_coac_ecuador.pkl", "rb") as f:
    SCALER = pickle.load(f)
with open("metadata_coac_ecuador.json") as f:
    METADATA = json.load(f)

FEATURES = METADATA["features"]
THRESHOLD = METADATA["threshold_produccion"]

# Schema de entrada
class SolicitudCredito(BaseModel):
    edad:                  int   = Field(..., ge=18, le=80, description="Edad del solicitante")
    ingreso_log:           float = Field(..., gt=0)
    ratio_deuda_ingreso:   float = Field(..., ge=0, le=10)
    años_socio:            int   = Field(..., ge=0, le=50)
    puntaje_interno:       int   = Field(..., ge=300, le=950)
    tasa_cumplimiento:     float = Field(..., ge=0, le=1)
    tiene_garante:         int   = Field(..., ge=0, le=1)
    plazo_meses:           int   = Field(..., ge=1, le=120)
    tipo_credito_enc:      int   = Field(..., ge=1, le=5)
    provincia_riesgo:      float = Field(..., ge=0, le=1)

# Autenticacion por API Key
def verificar_api_key(x_api_key: str = Header(...)):
    API_KEYS_VALIDAS = {"coac-quito-2024", "coac-guayaquil-2024"}
    if x_api_key not in API_KEYS_VALIDAS:
        raise HTTPException(status_code=401, detail="API Key invalida")
    return x_api_key

@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "modelo_version": METADATA["version"],
        "auc_baseline": METADATA["auc_test"],
        "timestamp": datetime.now().isoformat(),
    }

@app.post("/score", dependencies=[Depends(verificar_api_key)])
def calcular_score(solicitud: SolicitudCredito):
    """Calcula el score crediticio para una solicitud."""
    X = pd.DataFrame([solicitud.dict()])[FEATURES]
    X_scaled = SCALER.transform(X)
    prob_mora = float(MODELO.predict_proba(X_scaled)[0][1])

    if prob_mora < 0.15:   banda, decision = "A1", "APROBAR"
    elif prob_mora < 0.30: banda, decision = "A2", "APROBAR"
    elif prob_mora < 0.45: banda, decision = "B",  "CONDICIONADO"
    elif prob_mora < 0.60: banda, decision = "C",  "COMITE"
    else:                  banda, decision = "D",  "RECHAZAR"

    return {
        "prob_mora":      round(prob_mora, 4),
        "score_1000":     int((1 - prob_mora) * 1000),
        "banda_riesgo":   banda,
        "decision":       decision,
        "version_modelo": METADATA["version"],
        "timestamp":      datetime.now().isoformat(),
    }

@app.get("/modelo/info")
def info_modelo():
    return METADATA

# Ejecutar: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
'''

print("  Estructura FastAPI:")
for linea in codigo_fastapi.split("\n"):
    if any(k in linea for k in ["@app.", "class ", "def ", "title", "version"]):
        print(f"  {linea.strip()}")

# ================================================
# DOCKERFILE
# ================================================
print("\n--- DOCKERFILE ---")

dockerfile = """
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY modelo_coac_ecuador.pkl .
COPY scaler_coac_ecuador.pkl .
COPY metadata_coac_ecuador.json .
COPY api/main.py .

EXPOSE 8000
HEALTHCHECK CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
"""
print(dockerfile)

# ================================================
# MONITOREO DATA DRIFT
# ================================================
print("--- MONITOREO: DATA DRIFT (PSI) ---")

def calcular_psi(baseline, produccion, bins=10):
    """
    Population Stability Index — mide drift de una feature.
    PSI < 0.10: estable
    PSI 0.10-0.25: cambio moderado — monitorear
    PSI > 0.25: drift significativo — reentrenar
    """
    min_val = min(baseline.min(), produccion.min())
    max_val = max(baseline.max(), produccion.max())
    limites = np.linspace(min_val, max_val, bins + 1)

    pct_base = np.histogram(baseline, bins=limites)[0] / len(baseline)
    pct_prod = np.histogram(produccion, bins=limites)[0] / len(produccion)

    pct_base = np.clip(pct_base, 1e-6, None)
    pct_prod = np.clip(pct_prod, 1e-6, None)

    psi = np.sum((pct_prod - pct_base) * np.log(pct_prod / pct_base))
    return round(psi, 4)

# Simular produccion con drift
X_produccion_sin_drift = X_test.copy()
X_produccion_con_drift = X_test.copy()
X_produccion_con_drift["ingreso_log"] += 0.5  # crisis economica: ingresos bajan

print("\n  PSI por feature (produccion sin drift vs con drift):")
print(f"  {'Feature':<25} {'PSI sin drift':<15} {'PSI con drift':<15} Estado")
for col in X_raw.columns:
    psi_ok    = calcular_psi(X_train[col].values, X_produccion_sin_drift[col].values)
    psi_drift = calcular_psi(X_train[col].values, X_produccion_con_drift[col].values)
    estado    = "ALERTA" if psi_drift > 0.25 else ("MONITOR" if psi_drift > 0.10 else "OK")
    print(f"  {col:<25} {psi_ok:<15.4f} {psi_drift:<15.4f} {estado}")

print("\n" + "=" * 65)
print("MLOPS — CICLO COMPLETO:")
print("  MLflow:  trackear experimentos, versionar modelos")
print("  FastAPI: API REST con validacion Pydantic + autenticacion")
print("  Docker:  containerizar modelo + dependencias para deploy")
print("  PSI:     detectar drift — > 0.25 reentrenar el modelo")
print("  CI/CD:   GitHub Actions → test → build → deploy automatico")
print("=" * 65)
```

3. Implementa el endpoint `POST /score/batch` que recibe una lista de solicitudes y devuelve todos los scores en un solo llamado.

4. Agrega logs estructurados (JSON) a cada prediccion para auditoria: timestamp, version modelo, features de entrada, score, decision.

## Usa IA para...

> Abre Gemini y escribe:
> "Tengo un modelo de scoring crediticio en produccion (FastAPI + Docker) para una cooperativa ecuatoriana. El AUC bajo de 0.86 a 0.79 en el ultimo mes. El PSI del feature 'ingreso_log' es 0.31 (alto drift). ¿Como diseño el pipeline de reentrenamiento automatico? Necesito: 1) trigger en Airflow cuando PSI > 0.25, 2) reentrenamiento con datos de los ultimos 6 meses, 3) A/B testing del nuevo modelo vs el actual (canary deployment 10%/90%), 4) rollback automatico si el nuevo modelo tiene AUC menor. Dame el codigo del DAG de Airflow y el codigo de A/B testing en FastAPI."

Despues de leer la respuesta:
- Diseña el DAG de reentrenamiento automatico en Airflow.
- Implementa el A/B testing basico en FastAPI con un flag de configuracion.

## Que aprendiste

- MLflow registra experimentos, parametros, metricas y artefactos — permite comparar cientos de experimentos.
- FastAPI con Pydantic valida automaticamente el input: tipos, rangos, campos requeridos — sin codigo manual.
- Docker empaqueta el modelo con sus dependencias exactas — "funciona en mi maquina" deja de ser problema.
- El PSI (Population Stability Index) mide el drift de las features: > 0.25 indica que el modelo debe reentrenarse.
- El CI/CD para ML incluye: test de calidad de datos → entrenamiento → evaluacion → despliegue automatico si supera baseline.
- El canary deployment expone el nuevo modelo al 10% del trafico — permite validar en produccion con riesgo controlado.

## Reto extra

Construye el pipeline MLOps completo para la SEPS Ecuador: GitHub Actions que detecta nuevos datos en S3, lanza entrenamiento en SageMaker, registra en MLflow, despliega en ECS si supera AUC baseline, notifica al equipo en Slack, y genera el Model Card automatico con fairness analysis por sexo y provincia. Todo el proceso de datos nuevos a modelo en produccion debe tomar menos de 2 horas.
