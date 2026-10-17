# Ejercicio Sesion 6: MLflow — Experimentos y Registro de Modelos

**Materia:** Machine Learning Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 40 min

## Objetivo

Implementar el ciclo completo de experimentacion y registro de modelos con MLflow: tracking de experimentos, comparacion de runs, registro en Model Registry, transicion entre etapas (Staging → Production), y servicio de prediccion — aplicado al desarrollo de modelos de deteccion de fraude en transacciones del sistema financiero ecuatoriano.

## Contexto

Un equipo de ML en Produbanco Ecuador desarrolla 3 versiones del modelo de fraude cada mes. Sin MLflow, no saben que hiperparametros usaron en el modelo en produccion, no pueden reproducir el experimento del mes pasado, y no tienen forma de comparar las versiones. MLflow resuelve esto: cada experimento queda registrado con sus metricas, parametros, artefactos y el codigo exacto — reproducible en cualquier momento y auditable por la SBS.

## Instrucciones

1. Instala: `pip install mlflow`.

2. Crea el archivo `sesion06_mlflow_experimentos_ecuador.py`:

```python
# MLflow Experimentos - ITSEIA
# Machine Learning Avanzado
# Deteccion fraude — sistema financiero Ecuador

import mlflow
import mlflow.sklearn
import numpy as np
import pandas as pd
import json
import os
import time
import tempfile
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.metrics import (roc_auc_score, f1_score, precision_score, recall_score,
                              average_precision_score, classification_report)
from sklearn.pipeline import Pipeline
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)

print("=" * 65)
print("MLFLOW — EXPERIMENTOS FRAUDE FINANCIERO ECUADOR")
print("=" * 65)

# ================================================
# CONCEPTOS MLFLOW
# ================================================
print("\n--- CONCEPTOS MLFLOW ---")

componentes = {
    "Tracking Server": "Almacena metricas, params, artefactos de cada run",
    "Experiment":      "Agrupa runs del mismo proyecto — ej: 'fraude_produbanco_v3'",
    "Run":             "Ejecucion individual — un set de params + metricas + modelo",
    "Params":          "Hiperparametros del modelo — n_estimators, learning_rate",
    "Metrics":         "Resultados evaluacion — AUC, F1, precision, recall",
    "Artifacts":       "Archivos del run — modelo.pkl, graficos, reportes HTML",
    "Model Registry":  "Catalogo de modelos — Staging → Production → Archived",
    "Model Serving":   "Exponer modelo como REST API — mlflow models serve",
    "Tags":            "Metadatos — version_datos, equipo, aprobado_por",
}

for k, v in componentes.items():
    print(f"  {k:<20}: {v}")

# ================================================
# DATASET: TRANSACCIONES FINANCIERAS ECUADOR
# ================================================
print("\n--- DATASET: FRAUDE FINANCIERO ECUADOR ---")

N = 8_000
bancos = ["Produbanco","Banco Pichincha","Banco Guayaquil","Banco del Pacifico",
          "Banco Internacional"]
canales = ["ATM","POS","Online","Telefono","Sucursal"]

df = pd.DataFrame({
    "monto":             np.random.lognormal(4.5, 1.5, N).round(2),
    "hora":              np.random.randint(0, 24, N),
    "dia_semana":        np.random.randint(0, 7, N),
    "canal":             np.random.choice(range(len(canales)), N),
    "banco":             np.random.choice(range(len(bancos)), N),
    "provincia":         np.random.choice(range(10), N),
    "edad_cliente":      np.random.normal(40, 12, N).clip(18, 80).round(0),
    "n_transacc_mes":    np.random.poisson(15, N),
    "saldo_disponible":  np.random.lognormal(6, 1.2, N).round(2),
    "es_extranjero":     np.random.binomial(1, 0.05, N),
    "distancia_ultima_km": np.random.exponential(10, N).round(1),
    "n_intentos_fallidos": np.random.choice([0,0,0,1,2,3], N, p=[0.70,0.10,0.08,0.07,0.03,0.02]),
    "hora_inusual":      0,  # se calcula abajo
    "monto_atipico":     0,  # se calcula abajo
})

df["hora_inusual"]  = ((df["hora"] >= 1) & (df["hora"] <= 5)).astype(int)
df["ratio_saldo"]   = (df["monto"] / df["saldo_disponible"].clip(1)).round(4)

prob_fraude = (
    0.03
    + 0.20 * (df["ratio_saldo"] > 0.8).astype(float)
    + 0.15 * df["hora_inusual"]
    + 0.12 * df["es_extranjero"]
    + 0.10 * (df["distancia_ultima_km"] > 50).astype(float)
    + 0.08 * (df["n_intentos_fallidos"] > 0).astype(float)
    + np.random.normal(0, 0.02, N)
).clip(0.005, 0.95)

df["fraude"] = (np.random.random(N) < prob_fraude).astype(int)

print(f"  Dataset: {df.shape}")
print(f"  Tasa de fraude: {df['fraude'].mean()*100:.2f}%")

X = df.drop("fraude", axis=1).values.astype(np.float64)
y = df["fraude"].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# ================================================
# MLFLOW: CONFIGURACION
# ================================================
# Usar directorio temporal para el tracking
MLFLOW_DIR = os.path.join(tempfile.gettempdir(), "mlflow_itseia_fraude")
os.makedirs(MLFLOW_DIR, exist_ok=True)
mlflow.set_tracking_uri(f"file://{MLFLOW_DIR}")

EXPERIMENT_NAME = "fraude_ecuador_v1"
mlflow.set_experiment(EXPERIMENT_NAME)

print(f"\n--- MLFLOW TRACKING ---")
print(f"  URI:        file://{MLFLOW_DIR}")
print(f"  Experimento: {EXPERIMENT_NAME}")

# ================================================
# FUNCION: EJECUTAR Y LOGUEAR UN EXPERIMENTO
# ================================================
def run_experimento(nombre, modelo_clase, params, X_tr, y_tr, X_te, y_te,
                    tags=None):
    """Ejecuta un run de MLflow con tracking completo."""

    with mlflow.start_run(run_name=nombre) as run:
        run_id = run.info.run_id

        # Loguear parametros
        mlflow.log_params(params)
        mlflow.log_param("modelo_clase", modelo_clase.__name__)
        mlflow.log_param("n_train", len(X_tr))
        mlflow.log_param("n_test", len(X_te))
        mlflow.log_param("fraude_pct_train", round(y_tr.mean()*100, 2))

        if tags:
            mlflow.set_tags(tags)

        # Entrenar
        t0 = time.perf_counter()
        pipeline = Pipeline([
            ("scaler", StandardScaler()),
            ("modelo", modelo_clase(**params, random_state=42
                                     if "random_state" in modelo_clase().get_params()
                                     else {})),
        ])
        # Simplificar: entrenar sin random_state en params
        scaler = StandardScaler()
        X_tr_sc = scaler.fit_transform(X_tr)
        X_te_sc = scaler.transform(X_te)

        modelo = modelo_clase(**{k: v for k, v in params.items()
                                  if k in modelo_clase().get_params()})
        modelo.fit(X_tr_sc, y_tr)
        tiempo_entrenamiento = time.perf_counter() - t0

        # Predicciones
        probs = modelo.predict_proba(X_te_sc)[:, 1]
        preds = (probs > 0.5).astype(int)

        # Metricas
        metricas = {
            "auc_roc":          round(roc_auc_score(y_te, probs), 4),
            "avg_precision":    round(average_precision_score(y_te, probs), 4),
            "f1_fraude":        round(f1_score(y_te, preds, pos_label=1, zero_division=0), 4),
            "precision_fraude": round(precision_score(y_te, preds, pos_label=1, zero_division=0), 4),
            "recall_fraude":    round(recall_score(y_te, preds, pos_label=1, zero_division=0), 4),
            "tiempo_entreno_s": round(tiempo_entrenamiento, 3),
        }
        mlflow.log_metrics(metricas)

        # Guardar modelo
        mlflow.sklearn.log_model(modelo, "modelo_fraude")

        # Artefacto: reporte JSON
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json",
                                          delete=False) as f:
            json.dump({"params": params, "metricas": metricas,
                       "modelo": modelo_clase.__name__}, f, indent=2)
            mlflow.log_artifact(f.name, "reportes")

        return run_id, metricas

# ================================================
# EXPERIMENTOS: 3 CONFIGURACIONES
# ================================================
print("\n--- EJECUTANDO EXPERIMENTOS ---")

experimentos = [
    {
        "nombre": "RF_baseline",
        "clase":  RandomForestClassifier,
        "params": {"n_estimators": 100, "max_depth": 5,
                   "random_state": 42},
        "tags":   {"version": "1.0", "equipo": "data_science_produbanco",
                   "tipo": "baseline"},
    },
    {
        "nombre": "RF_optimizado",
        "clase":  RandomForestClassifier,
        "params": {"n_estimators": 200, "max_depth": 10,
                   "min_samples_split": 5, "random_state": 42},
        "tags":   {"version": "1.1", "equipo": "data_science_produbanco",
                   "tipo": "optimizado"},
    },
    {
        "nombre": "GBM_v1",
        "clase":  GradientBoostingClassifier,
        "params": {"n_estimators": 150, "learning_rate": 0.05,
                   "max_depth": 4, "subsample": 0.8, "random_state": 42},
        "tags":   {"version": "1.0", "equipo": "data_science_produbanco",
                   "tipo": "gradient_boosting"},
    },
]

resultados_experimentos = []
for exp in experimentos:
    run_id, metricas = run_experimento(
        exp["nombre"], exp["clase"], exp["params"],
        X_train, y_train, X_test, y_test,
        tags=exp["tags"]
    )
    resultados_experimentos.append({
        "nombre": exp["nombre"], "run_id": run_id[:8], **metricas
    })
    print(f"  [{exp['nombre']:<20}] AUC={metricas['auc_roc']:.4f} | "
          f"F1={metricas['f1_fraude']:.4f} | "
          f"Recall={metricas['recall_fraude']:.4f}")

# ================================================
# COMPARACION DE EXPERIMENTOS
# ================================================
print("\n--- COMPARACION DE RUNS ---")

df_comp = pd.DataFrame(resultados_experimentos)
df_comp = df_comp.sort_values("auc_roc", ascending=False)

print(f"\n  {'Modelo':<25} {'AUC':>7} {'Avg Prec':>10} {'F1':>7} "
      f"{'Recall':>8} {'Tiempo(s)':>10}")
print(f"  {'-'*70}")
for _, row in df_comp.iterrows():
    print(f"  {row['nombre']:<25} {row['auc_roc']:>7.4f} {row['avg_precision']:>10.4f} "
          f"{row['f1_fraude']:>7.4f} {row['recall_fraude']:>8.4f} "
          f"{row['tiempo_entreno_s']:>10.3f}s")

mejor_modelo = df_comp.iloc[0]["nombre"]
mejor_auc    = df_comp.iloc[0]["auc_roc"]
print(f"\n  Mejor modelo: {mejor_modelo} (AUC = {mejor_auc:.4f})")

# ================================================
# MODEL REGISTRY: CICLO DE VIDA
# ================================================
print("\n--- MODEL REGISTRY: CICLO DE VIDA ---")

ciclo_vida = {
    "None → Staging": {
        "quien":    "Data Scientist",
        "cuando":   "Modelo nuevo supera baseline en validacion",
        "accion":   "mlflow.register_model() + transition_model_version_stage('Staging')",
        "criterio": "AUC > 0.80 en test set, sin data leakage",
    },
    "Staging → Production": {
        "quien":    "ML Engineer + Risk Officer",
        "cuando":   "Validacion en ambiente staging con datos reales recientes",
        "accion":   "transition_model_version_stage('Production')",
        "criterio": "AB test: nuevo modelo >= actual en precision y recall",
    },
    "Production → Archived": {
        "quien":    "ML Engineer",
        "cuando":   "Nueva version en produccion, PSI > 0.2 (model drift)",
        "accion":   "transition_model_version_stage('Archived')",
        "criterio": "Mantener archived 6 meses para auditoria SBS",
    },
}

for transicion, info in ciclo_vida.items():
    print(f"\n  [{transicion}]")
    for k, v in info.items():
        print(f"    {k:<10}: {v}")

# ================================================
# SERVICIO DE PREDICCION
# ================================================
print("\n--- SERVICIO DE PREDICCION ---")

# Simular la llamada al modelo en produccion
scaler_prod = StandardScaler()
scaler_prod.fit(X_train)
modelo_prod = GradientBoostingClassifier(n_estimators=150, learning_rate=0.05,
                                          max_depth=4, subsample=0.8, random_state=42)
modelo_prod.fit(scaler_prod.transform(X_train), y_train)

# Transaccion nueva a evaluar
transaccion_nueva = {
    "monto": 2500.00,
    "hora": 3,           # Madrugada — sospechoso
    "dia_semana": 5,
    "canal": 2,          # Online
    "banco": 0,
    "provincia": 1,
    "edad_cliente": 28,
    "n_transacc_mes": 2,
    "saldo_disponible": 3000.00,
    "es_extranjero": 0,
    "distancia_ultima_km": 850.5,  # Muy lejos de ultima transaccion
    "n_intentos_fallidos": 2,
    "hora_inusual": 1,
    "ratio_saldo": round(2500/3000, 4),
}

X_nueva = np.array([list(transaccion_nueva.values())], dtype=np.float64)
X_nueva_sc = scaler_prod.transform(X_nueva)
prob_fraude_nueva = modelo_prod.predict_proba(X_nueva_sc)[0, 1]

print(f"\n  Transaccion evaluada:")
for k, v in list(transaccion_nueva.items())[:6]:
    print(f"    {k}: {v}")

print(f"\n  Score de fraude: {prob_fraude_nueva:.4f}")
print(f"  Decision:        {'BLOQUEAR' if prob_fraude_nueva > 0.5 else 'APROBAR'}")
print(f"  Nivel de alerta: {'ALTO' if prob_fraude_nueva > 0.7 else 'MEDIO' if prob_fraude_nueva > 0.4 else 'BAJO'}")

print("\n" + "=" * 65)
print("MLFLOW — CONCEPTOS CLAVE:")
print("  Experiment:    agrupa todos los runs del mismo proyecto")
print("  Run:           ejecucion individual con params + metrics + artefactos")
print("  log_params:    hiperparametros del modelo — reproducibilidad")
print("  log_metrics:   AUC, F1, etc — comparacion entre runs")
print("  log_model:     guarda modelo serializado — reproducible")
print("  Model Registry: Staging → Production → Archived — ciclo de vida")
print("=" * 65)
```

3. Implementa el detector de model drift: cada semana calcula el PSI (Population Stability Index) entre los scores del modelo en produccion y los scores del mes pasado — alerta si PSI > 0.2.

4. Agrega el AB testing entre dos versiones del modelo: divide el trafico 50/50, registra las metricas de negocio de cada version, y despues de 1,000 transacciones decide automaticamente cual pasa a produccion.

## Usa IA para...

> Abre Gemini y escribe:
> "Soy ML Engineer en Banco Pichincha Ecuador y necesito implementar MLflow en produccion para el equipo de fraude (5 data scientists). El reto es que cada scientist hace sus experimentos en su laptop con distintas versiones de Python y scikit-learn. ¿Como configuro: 1) MLflow Tracking Server centralizado en AWS EC2 con PostgreSQL como backend y S3 para artefactos, 2) autenticacion con LDAP del banco para controlar acceso, 3) politica de retencion de experimentos (mantener solo los ultimos 90 dias de runs, pero conservar todos los modelos en produccion)? Dame el docker-compose.yml y el script de configuracion inicial."

Despues de leer la respuesta:
- Implementa la politica de retencion de experimentos en Python.
- Agrega el script de limpieza automatica para runs mas antiguos de 90 dias.

## Que aprendiste

- MLflow tracking permite reproducir cualquier experimento exactamente — clave para auditoria SBS.
- Cada run almacena params + metrics + artefactos + codigo — todo lo necesario para reproducibilidad.
- El Model Registry formaliza el ciclo de vida: quien aprueba cada transicion y bajo que criterios.
- `log_model` serializa el modelo con sus dependencias — el mismo objeto se puede cargar en produccion.
- Comparar runs en la UI de MLflow revela rapidamente que modelo es mejor sin revisar notebooks.
- El model drift (PSI) detecta cuando el modelo se degradó y necesita re-entrenamiento.

## Reto extra

Construye el sistema MLOps completo para la deteccion de fraude de la Asociacion de Bancos Privados (ABPE) Ecuador: MLflow centralizado en AWS con PostgreSQL + S3, pipeline automatico de re-entrenamiento cuando PSI > 0.2 (trigger con Airflow), AB testing automatico entre modelo actual y candidato con 10,000 transacciones reales, registro obligatorio de aprobacion del Risk Officer antes de pasar a produccion, y dashboard ejecutivo mostrando el impacto economico del modelo (fraudes detectados × monto promedio × tasa de recuperacion). El sistema debe ser auditado por la SBS con trazabilidad completa.
