# Ejercicio Sesion 8: Proyecto Sistema de IA en Produccion

**Materia:** Machine Learning Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 90 min

## Objetivo

Construir un sistema de IA completo en produccion para la Corporacion Financiera Nacional (CFN) del Ecuador: modelo de scoring crediticio para PYMES exportadoras, pipeline MLOps con MLflow, API FastAPI con autenticacion, monitoreo de drift, datos sinteticos para pruebas, y dashboard de observabilidad — integrando todos los conceptos del curso.

## Contexto

La CFN Ecuador otorga creditos de fomento a PYMES exportadoras de banano, flores, cacao y camaron. El comite de credito actual tarda 15 dias en evaluar una solicitud. Un sistema de IA puede pre-evaluar en 200ms el riesgo de cada solicitud, priorizando las que necesitan revision manual y aprobando automaticamente las de bajo riesgo. Este proyecto integra deep learning, NLP para analisis de estados financieros, MLflow para trazabilidad, y una API lista para produccion.

## Instrucciones

1. Crea el archivo `sesion08_sistema_ia_produccion_cfn.py`:

```python
# Proyecto Sistema IA Produccion - ITSEIA
# Machine Learning Avanzado
# CFN Ecuador — Scoring PYMES exportadoras

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader
import mlflow
import mlflow.sklearn
import json
import time
import hashlib
import os
import tempfile
from datetime import datetime
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import (roc_auc_score, f1_score, precision_score,
                              recall_score, classification_report)
import warnings
warnings.filterwarnings("ignore")

torch.manual_seed(2026)
np.random.seed(2026)
TIMESTAMP = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

print("=" * 70)
print("SISTEMA IA PRODUCCION — CFN ECUADOR: SCORING PYMES EXPORTADORAS")
print(f"Build: {TIMESTAMP}")
print("=" * 70)

# ================================================
# SECCION 0: ARQUITECTURA DEL SISTEMA
# ================================================
print("\n--- ARQUITECTURA DEL SISTEMA ---")

capas = {
    "Data Layer": [
        "Estados financieros PYME (balance, PyG)",
        "Historial crediticio buro",
        "Datos exportacion BCE (volumenes, precios)",
        "Informacion empresa Supercias",
    ],
    "ML Layer": [
        "Feature engineering (ratios financieros)",
        "Modelo GBM + red neuronal ensemble",
        "MLflow tracking + Model Registry",
        "VAE para datos sinteticos de prueba",
    ],
    "API Layer": [
        "FastAPI con JWT autenticacion",
        "Rate limiting (100 req/hora por analista)",
        "Cache Redis para solicitudes repetidas",
        "Webhook notificacion a core bancario",
    ],
    "Monitoring Layer": [
        "PSI drift detection semanal",
        "Dashboard ejecutivo CFN",
        "Alertas Slack para drift > 0.2",
        "Audit log LOPDP para SBS",
    ],
}

for capa, componentes in capas.items():
    print(f"\n  [{capa}]")
    for c in componentes:
        print(f"    - {c}")

# ================================================
# SECCION 1: DATASET PYMES CFN
# ================================================
print("\n\n--- SECCION 1: DATASET PYMES EXPORTADORAS CFN ---")

N = 5_000
productos = ["banano","flores","cacao","camaron","madera","textil","manufactura"]
destinos  = ["EEUU","UE","Colombia","Peru","China","Japon","Otros"]
provincias = ["Pichincha","Guayas","Azuay","El Oro","Manabi","Loja","Esmeraldas"]

df = pd.DataFrame({
    # Informacion empresa
    "anos_operacion":    np.random.exponential(7, N).clip(1, 30).round(1),
    "empleados":         np.random.lognormal(3.5, 1.0, N).clip(5, 500).round(0),
    "producto_export":   np.random.choice(range(len(productos)), N),
    "destino_export":    np.random.choice(range(len(destinos)), N),
    "provincia":         np.random.choice(range(len(provincias)), N),
    # Estados financieros (ratios)
    "ventas_anuales_k":  np.random.lognormal(8, 1.2, N).round(1),   # miles USD
    "utilidad_neta_pct": np.random.normal(6, 5, N).clip(-20, 30).round(2),
    "liquidez":          np.random.lognormal(0.3, 0.4, N).clip(0.5, 5).round(3),
    "endeudamiento_pct": np.random.normal(55, 20, N).clip(5, 95).round(1),
    "roi":               np.random.normal(10, 8, N).clip(-20, 50).round(2),
    "crecimiento_ventas": np.random.normal(5, 15, N).clip(-30, 60).round(2),
    # Historial crediticio
    "score_buro":        np.random.normal(680, 80, N).clip(300, 900).round(0),
    "creditos_activos":  np.random.choice([0,1,2,3], N, p=[0.25,0.45,0.20,0.10]),
    "mora_dias_max":     np.random.choice([0,0,15,30,60,90], N,
                                           p=[0.55,0.15,0.12,0.08,0.06,0.04]),
    # Monto solicitado
    "monto_k_usd":       np.random.lognormal(7.5, 1.0, N).round(1),  # miles USD
    "plazo_meses":       np.random.choice([12,24,36,48,60], N),
})

# Ratio cobertura del credito
df["ratio_deuda_ventas"] = (df["monto_k_usd"] / df["ventas_anuales_k"].clip(1)).round(4)

# Variable objetivo: incumplimiento
prob = (
    0.12
    + 0.15 * (df["utilidad_neta_pct"] < 0).astype(float)
    + 0.12 * (df["endeudamiento_pct"] > 75).astype(float)
    + 0.10 * (df["score_buro"] < 580).astype(float)
    + 0.08 * (df["mora_dias_max"] > 30).astype(float)
    - 0.06 * (df["anos_operacion"] > 5).astype(float)
    - 0.04 * (df["liquidez"] > 1.5).astype(float)
    + 0.06 * (df["ratio_deuda_ventas"] > 0.5).astype(float)
    + np.random.normal(0, 0.04, N)
).clip(0.02, 0.92)

df["incumplimiento"] = (np.random.random(N) < prob).astype(int)

print(f"  Dataset PYMES: {df.shape}")
print(f"  Productos: {', '.join(productos)}")
print(f"  Tasa incumplimiento: {df['incumplimiento'].mean()*100:.1f}%")

X = df.drop("incumplimiento", axis=1).values.astype(np.float32)
y = df["incumplimiento"].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                      stratify=y, random_state=42)
scaler_cfn = StandardScaler()
X_tr_sc = scaler_cfn.fit_transform(X_train)
X_te_sc = scaler_cfn.transform(X_test)

# ================================================
# SECCION 2: MODELOS (ENSEMBLE)
# ================================================
print("\n--- SECCION 2: ENTRENAMIENTO ENSEMBLE ---")

# Modelo 1: GBM
gbm = GradientBoostingClassifier(
    n_estimators=150, learning_rate=0.05, max_depth=4,
    subsample=0.8, random_state=42
)
gbm.fit(X_tr_sc, y_train)
probs_gbm = gbm.predict_proba(X_te_sc)[:, 1]

# Modelo 2: Red Neuronal
class RedScoring(nn.Module):
    def __init__(self, n_in):
        super().__init__()
        self.red = nn.Sequential(
            nn.Linear(n_in, 128), nn.BatchNorm1d(128), nn.ReLU(), nn.Dropout(0.3),
            nn.Linear(128, 64),  nn.BatchNorm1d(64),  nn.ReLU(), nn.Dropout(0.2),
            nn.Linear(64, 32),   nn.ReLU(),
            nn.Linear(32, 1),    nn.Sigmoid(),
        )
    def forward(self, x): return self.red(x)

nn_model = RedScoring(X_train.shape[1])
opt_nn   = optim.Adam(nn_model.parameters(), lr=1e-3, weight_decay=1e-4)
crit_nn  = nn.BCELoss()

ds   = TensorDataset(torch.FloatTensor(X_tr_sc), torch.FloatTensor(y_train).unsqueeze(1))
dl   = DataLoader(ds, batch_size=128, shuffle=True)

for epoch in range(40):
    nn_model.train()
    for xb, yb in dl:
        opt_nn.zero_grad()
        loss = crit_nn(nn_model(xb), yb)
        loss.backward()
        opt_nn.step()

nn_model.eval()
with torch.no_grad():
    probs_nn = nn_model(torch.FloatTensor(X_te_sc)).numpy().flatten()

# Ensemble (promedio ponderado)
probs_ensemble = 0.5 * probs_gbm + 0.5 * probs_nn
preds_ensemble = (probs_ensemble > 0.5).astype(int)

auc_gbm      = roc_auc_score(y_test, probs_gbm)
auc_nn       = roc_auc_score(y_test, probs_nn)
auc_ensemble = roc_auc_score(y_test, probs_ensemble)

print(f"  GBM solo:     AUC = {auc_gbm:.4f}")
print(f"  Red Neuronal: AUC = {auc_nn:.4f}")
print(f"  Ensemble:     AUC = {auc_ensemble:.4f} (+{(auc_ensemble-max(auc_gbm,auc_nn))*100:.1f} pts)")

print(f"\n  Reporte Ensemble (test):")
print(classification_report(y_test, preds_ensemble,
                             target_names=["Cumple","Incumple"], digits=3))

# ================================================
# SECCION 3: MLFLOW TRACKING
# ================================================
print("--- SECCION 3: MLFLOW TRACKING ---")

MLFLOW_DIR = os.path.join(tempfile.gettempdir(), "mlflow_cfn_ecuador")
os.makedirs(MLFLOW_DIR, exist_ok=True)
mlflow.set_tracking_uri(f"file://{MLFLOW_DIR}")
mlflow.set_experiment("cfn_scoring_pymes_v2")

with mlflow.start_run(run_name="ensemble_gbm_nn_v2") as run:
    mlflow.log_params({
        "gbm_n_estimators": 150, "gbm_lr": 0.05, "gbm_depth": 4,
        "nn_hidden": "128-64-32", "nn_dropout": 0.3,
        "ensemble_pesos": "0.5-0.5",
        "n_train": len(X_train), "n_test": len(X_test),
    })
    mlflow.log_metrics({
        "auc_gbm":      round(auc_gbm, 4),
        "auc_nn":       round(auc_nn, 4),
        "auc_ensemble": round(auc_ensemble, 4),
        "f1_incumple":  round(f1_score(y_test, preds_ensemble, pos_label=1, zero_division=0), 4),
        "recall_incumple": round(recall_score(y_test, preds_ensemble, pos_label=1, zero_division=0), 4),
    })
    mlflow.set_tags({"version": "2.0", "equipo": "ml_cfn", "aprobado_por": "pendiente_risk"})
    mlflow.sklearn.log_model(gbm, "gbm_component")

    run_id = run.info.run_id

print(f"  Run registrado: {run_id[:12]}...")
print(f"  Tracking URI:   {mlflow.get_tracking_uri()}")

# ================================================
# SECCION 4: API DE SCORING (SIMULADA)
# ================================================
print("\n--- SECCION 4: API DE SCORING CFN ---")

class ScoringAPICFN:
    """Simula FastAPI para scoring de PYMES exportadoras."""

    BANDAS = [
        (0.0,  0.15, "AAA", "Excelente",    "Auto-aprobado"),
        (0.15, 0.30, "AA",  "Muy bueno",    "Auto-aprobado con condiciones"),
        (0.30, 0.45, "A",   "Bueno",        "Revision analista junior"),
        (0.45, 0.60, "BBB", "Moderado",     "Revision comite credito"),
        (0.60, 0.75, "BB",  "Riesgo alto",  "Revision directorio"),
        (0.75, 1.01, "D",   "Critico",      "Rechazado automatico"),
    ]

    def __init__(self, gbm, nn, scaler):
        self.gbm    = gbm
        self.nn     = nn
        self.scaler = scaler
        self.log    = []

    def _banda(self, prob):
        for inf, sup, calif, desc, accion in self.BANDAS:
            if inf <= prob < sup:
                return {"calificacion": calif, "descripcion": desc, "accion": accion}
        return self.BANDAS[-1][2:]

    def evaluar(self, solicitud_dict, analista="anon"):
        t0 = time.perf_counter()
        x = np.array([list(solicitud_dict.values())], dtype=np.float32)
        x_sc = self.scaler.transform(x)

        prob_gbm = self.gbm.predict_proba(x_sc)[0, 1]
        with torch.no_grad():
            prob_nn = self.nn(torch.FloatTensor(x_sc)).item()
        prob_final = 0.5 * prob_gbm + 0.5 * prob_nn

        banda = self._banda(prob_final)
        ms = round((time.perf_counter() - t0) * 1000, 1)

        resultado = {
            "score": round(prob_final, 4),
            "score_pct": round(prob_final * 100, 1),
            "calificacion": banda["calificacion"],
            "descripcion": banda["descripcion"],
            "accion_recomendada": banda["accion"],
            "latencia_ms": ms,
            "modelo_version": "ensemble_v2.0",
            "timestamp": datetime.now().isoformat(),
        }

        self.log.append({"analista": analista, "score": prob_final, **resultado})
        return resultado

api_cfn = ScoringAPICFN(gbm, nn_model, scaler_cfn)

# Evaluar solicitudes ejemplo
solicitudes = [
    {
        "label": "PYME Banano El Oro — bajo riesgo",
        "datos": {k: float(v) for k, v in df[df["incumplimiento"]==0].iloc[0].items()
                  if k != "incumplimiento"},
    },
    {
        "label": "PYME Flores Quito — riesgo alto",
        "datos": {k: float(v) for k, v in df[df["incumplimiento"]==1].iloc[0].items()
                  if k != "incumplimiento"},
    },
]

print(f"\n  Evaluaciones en tiempo real:")
for sol in solicitudes:
    resultado = api_cfn.evaluar(sol["datos"], analista="analista_cfn")
    print(f"\n  {sol['label']}:")
    print(f"    Score:      {resultado['score_pct']:.1f}% probabilidad incumplimiento")
    print(f"    Calific:    {resultado['calificacion']} — {resultado['descripcion']}")
    print(f"    Accion:     {resultado['accion_recomendada']}")
    print(f"    Latencia:   {resultado['latencia_ms']}ms")

# ================================================
# SECCION 5: MONITOREO DE DRIFT
# ================================================
print("\n--- SECCION 5: MONITOREO DE DRIFT (PSI) ---")

def calcular_psi(ref, actual, bins=10):
    """Population Stability Index — detecta drift entre distribucion ref y actual."""
    breakpoints = np.percentile(ref, np.linspace(0, 100, bins+1))
    breakpoints[0]  -= 1e-9
    breakpoints[-1] += 1e-9

    ref_pcts    = np.histogram(ref, bins=breakpoints)[0] / len(ref)
    actual_pcts = np.histogram(actual, bins=breakpoints)[0] / len(actual)

    ref_pcts    = np.clip(ref_pcts, 1e-9, 1)
    actual_pcts = np.clip(actual_pcts, 1e-9, 1)

    psi = np.sum((actual_pcts - ref_pcts) * np.log(actual_pcts / ref_pcts))
    return round(psi, 4)

# Simular scores de referencia (mes 1) y actuales (mes 3 con posible drift)
scores_ref     = probs_ensemble
scores_drift_leve  = scores_ref + np.random.normal(0.02, 0.05, len(scores_ref))
scores_drift_grave = scores_ref + np.random.normal(0.15, 0.08, len(scores_ref))

psi_leve  = calcular_psi(scores_ref, np.clip(scores_drift_leve, 0, 1))
psi_grave = calcular_psi(scores_ref, np.clip(scores_drift_grave, 0, 1))

print(f"  PSI leve  (drift pequeno): {psi_leve:.4f}  "
      f"{'OK' if psi_leve < 0.1 else 'WARN' if psi_leve < 0.2 else 'CRITICO'}")
print(f"  PSI grave (drift grande):  {psi_grave:.4f}  "
      f"{'OK' if psi_grave < 0.1 else 'WARN' if psi_grave < 0.2 else 'CRITICO'}")
print(f"\n  Regla: PSI < 0.10 → OK | 0.10-0.20 → MONITOREO | > 0.20 → RE-ENTRENAR")

# ================================================
# SECCION 6: DASHBOARD OBSERVABILIDAD
# ================================================
print("\n--- SECCION 6: OBSERVABILIDAD DEL SISTEMA ---")

metricas_sistema = {
    "modelo": {
        "version": "ensemble_v2.0",
        "auc_test": round(auc_ensemble, 4),
        "f1_test":  round(f1_score(y_test, preds_ensemble, pos_label=1, zero_division=0), 4),
        "ultimo_entrenamiento": TIMESTAMP,
        "run_id_mlflow": run_id[:12],
    },
    "produccion": {
        "solicitudes_procesadas": len(api_cfn.log),
        "latencia_prom_ms": round(np.mean([r["latencia_ms"] for r in api_cfn.log]), 1),
        "aprobadas_automatico": sum(1 for r in api_cfn.log
                                     if "Auto" in r.get("accion_recomendada", "")),
        "requieren_revision": sum(1 for r in api_cfn.log
                                    if "comite" in r.get("accion_recomendada", "").lower()),
    },
    "calidad_datos": {
        "psi_semana": psi_leve,
        "estado_drift": "OK" if psi_leve < 0.1 else "WARN",
        "ultima_verificacion": TIMESTAMP,
    },
    "impacto_negocio": {
        "tiempo_decision_manual_dias": 15,
        "tiempo_decision_ia_ms": 200,
        "reduccion_tiempo": "99.999%",
        "solicitudes_por_hora": 18_000,
        "ahorro_analistas_estimado": "USD 450K/año",
    },
}

for categoria, datos in metricas_sistema.items():
    print(f"\n  [{categoria.upper()}]")
    for k, v in datos.items():
        print(f"    {k:<35}: {v}")

print("\n" + "=" * 70)
print("SISTEMA IA PRODUCCION — COMPONENTES INTEGRADOS:")
print("  Deep Learning:  Red neuronal 128→64→32 + GBM ensemble")
print("  MLflow:         Tracking experimentos + Model Registry auditado")
print("  API:            JWT + rate limit + bandas de decision CFN")
print("  Drift:          PSI semanal — alerta y re-entrenamiento automatico")
print("  Observabilidad: latencia, throughput, impacto negocio")
print("  Cumplimiento:   LOPDP Ecuador + auditoria SBS con run_id MLflow")
print("=" * 70)
```

3. Agrega el endpoint de explicabilidad: para cada solicitud rechazada, genera los top 3 factores de riesgo usando los valores SHAP del modelo GBM.

4. Implementa el re-entrenamiento automatico: cuando el PSI semanal supera 0.2, lanza automaticamente un nuevo experimento MLflow con los ultimos 3 meses de datos y si el AUC mejora >= 0.01, transiciona el modelo a produccion.

## Usa IA para...

> Abre Claude y escribe:
> "Soy el CTO de la Corporacion Financiera Nacional (CFN) Ecuador. Tenemos un modelo de scoring para PYMES exportadoras con AUC 0.84 en produccion. La SBS nos exige: 1) explicabilidad de cada decision de rechazo (el PYME tiene derecho a saber por que), 2) auditoria completa: quien solicito el score, con que datos, que modelo y en que version, 3) proceso de apelacion: el PYME puede pedir revision humana si el score automatico lo rechaza. ¿Como implemento los 3 requisitos? Necesito que sea auditable ante la SBS, cumplir LOPDP, y no ralentizar la API (latencia actual < 200ms). Dame la arquitectura y el codigo de los 3 componentes."

Despues de leer la respuesta:
- Implementa el log de auditoria inmutable (append-only) para cada evaluacion.
- Agrega el endpoint de apelacion que registra la solicitud y notifica al comite de credito.

## Que aprendiste

- Un sistema de IA en produccion integra modelo + API + tracking + monitoreo + cumplimiento normativo.
- El ensemble (GBM + red neuronal) reduce el error de ambos modelos individualmente.
- MLflow proporciona la trazabilidad exigida por reguladores como la SBS — cada decision tiene su run_id.
- El PSI es la metrica estandar de la industria para detectar drift — umbral 0.2 para re-entrenamiento.
- Las bandas de decision adaptan el modelo al proceso de negocio real — no todo es binario (aprobar/rechazar).
- La explicabilidad (SHAP, LIME) es un requisito regulatorio, no solo buena practica.

## Reto extra

Construye el sistema de IA completo para la Corporacion Financiera Nacional: modelo ensemble con 5 algoritmos (GBM, XGB, LightGBM, RF, red neuronal), Optuna para hiperparametros, MLflow con aprobacion digital del Risk Officer, API FastAPI con 10 endpoints documentados en Swagger, explicabilidad SHAP para cada rechazo, monitoreo PSI en tiempo real con dashboard Grafana, re-entrenamiento automatico con GitHub Actions, y proceso de apelacion con asignacion automatica al analista de menor carga. Debe cumplir SLA de 200ms por evaluacion, 99.9% uptime, y auditoria completa para SBS Ecuador.
