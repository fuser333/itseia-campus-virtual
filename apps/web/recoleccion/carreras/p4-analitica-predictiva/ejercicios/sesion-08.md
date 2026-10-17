# Ejercicio Sesion 8: Proyecto — Sistema Predictivo Sector Financiero Ecuador

**Materia:** Analitica Predictiva
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 90 min

## Objetivo

Construir un sistema predictivo completo para el sector financiero ecuatoriano: pipeline de ML end-to-end desde datos crudos hasta modelo en produccion, incluyendo feature engineering, comparacion de 5 algoritmos, seleccion del mejor modelo, interpretabilidad, y API de scoring crediticio lista para produccion.

## Contexto

Este es el proyecto integrador de Analitica Predictiva. Simulamos ser el equipo de Data Science de una cooperativa de ahorro y credito ecuatoriana con 25.000 socios. El directivo te pide un sistema que prediga en tiempo real si un solicitante va a entrar en mora — reemplazando el comite de credito manual que tarda 3 dias. El sistema debe ser preciso, explicable y auditable por la Superintendencia de Economia Popular y Solidaria (SEPS).

## Instrucciones

1. Crea el archivo `sesion08_proyecto_scoring_coac_ecuador.py`:

```python
# PROYECTO: Sistema de Scoring Crediticio COAC Ecuador
# Pipeline ML completo: datos → modelo → API scoring
# ITSEIA - Analitica Predictiva - Sesion 8

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import json
from datetime import datetime
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import (roc_auc_score, accuracy_score, f1_score,
                              classification_report, confusion_matrix,
                              roc_curve, auc, average_precision_score)
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import (RandomForestClassifier, GradientBoostingClassifier,
                               VotingClassifier)
from sklearn.impute import SimpleImputer
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 70)
print("PROYECTO: SCORING CREDITICIO COAC ECUADOR")
print("Sistema ML End-to-End — SEPS Compliant")
print(f"Ejecucion: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
print("=" * 70)

# ================================================
# DATOS HISTORICOS COAC (3 años)
# ================================================
print("\n[DATOS] Generando datos historicos socios COAC...")

n = 3000
df_raw = pd.DataFrame({
    # Variables sociodemograficas
    "edad":               np.random.randint(18, 70, n),
    "sexo":               np.random.choice(["M","F"], n, p=[0.52,0.48]),
    "estado_civil":       np.random.choice(["soltero","casado","divorciado","viudo"],
                                            n, p=[0.30,0.52,0.13,0.05]),
    "num_dependientes":   np.random.randint(0, 6, n),
    "nivel_educacion":    np.random.choice([1,2,3,4,5], n,
                                            p=[0.06,0.32,0.24,0.30,0.08]),

    # Variables financieras
    "ingreso_mensual":    np.random.lognormal(6.4, 0.55, n),
    "gasto_mensual":      np.random.lognormal(6.1, 0.5, n),
    "ahorro_mensual":     np.random.lognormal(5.0, 0.8, n),
    "deuda_actual":       np.random.lognormal(7.5, 1.2, n) * np.random.binomial(1, 0.6, n),
    "patrimonio_estimado": np.random.lognormal(9.5, 1.5, n),

    # Variables de historial COAC
    "años_socio":         np.random.randint(0, 20, n),
    "num_creditos_prev":  np.random.randint(0, 8, n),
    "creditos_sin_mora":  np.random.randint(0, 8, n),
    "puntaje_interno":    np.random.randint(300, 950, n),
    "aportes_puntual_pct": np.random.uniform(0, 1, n),

    # Variables del credito solicitado
    "monto_solicitado":   np.random.lognormal(9.5, 0.8, n),
    "plazo_meses":        np.random.choice([6,12,18,24,36,48,60], n,
                                            p=[0.05,0.20,0.18,0.22,0.20,0.10,0.05]),
    "tipo_credito":       np.random.choice(["consumo","vivienda","productivo","emergente"],
                                            n, p=[0.45,0.20,0.28,0.07]),
    "tiene_garante":      np.random.binomial(1, 0.55, n),
    "tiene_hipoteca":     np.random.binomial(1, 0.22, n),

    # Variables contextuales
    "provincia":          np.random.choice(["Pichincha","Guayas","Azuay","Tungurahua",
                                             "Manabi","Chimborazo","Los Rios","Loja"],
                                            n, p=[0.28,0.22,0.12,0.10,0.09,0.08,0.06,0.05]),
    "sector_economico":   np.random.choice(["comercio","agricultura","servicios",
                                             "manufactura","construccion"],
                                            n, p=[0.35,0.20,0.25,0.12,0.08]),
    "mes_solicitud":      np.random.randint(1, 13, n),
})

# Introducir algunos valores nulos (datos reales tienen faltantes)
for col in ["ingreso_mensual","gasto_mensual","patrimonio_estimado"]:
    mask = np.random.random(n) < 0.04  # 4% nulos
    df_raw.loc[mask, col] = np.nan

# Target: mora mayor a 90 dias en los 12 meses siguientes
capacidad_pago = df_raw["ingreso_mensual"] / (df_raw["monto_solicitado"] / df_raw["plazo_meses"] + 1)
log_odds = (
    -5.0
    + 3.0 / (capacidad_pago + 0.1)
    - 0.8 * df_raw["aportes_puntual_pct"]
    - 0.003 * df_raw["puntaje_interno"]
    + 0.5 * (df_raw["tipo_credito"] == "consumo").astype(float)
    - 0.4 * df_raw["tiene_garante"]
    - 0.5 * df_raw["tiene_hipoteca"]
    - 0.05 * df_raw["años_socio"]
    + np.random.normal(0, 0.9, n)
)
df_raw["mora_90d"] = (1/(1+np.exp(-log_odds)) > 0.48).astype(int)

print(f"  {n} solicitudes historicas | Mora 90d: {df_raw['mora_90d'].mean()*100:.1f}%")
print(f"  Nulos por columna (muestra): {df_raw.isnull().sum()[df_raw.isnull().sum()>0].to_dict()}")

# ================================================
# FEATURE ENGINEERING
# ================================================
print("\n[FEATURE ENG] Construyendo variables derivadas...")

df = df_raw.copy()

# Ratios financieros
df["ratio_deuda_ingreso"]   = (df["deuda_actual"] / (df["ingreso_mensual"] * 12 + 1)).clip(0, 5)
df["ratio_ahorro_ingreso"]  = (df["ahorro_mensual"] / (df["ingreso_mensual"] + 1)).clip(0, 1)
df["cuota_estimada"]        = df["monto_solicitado"] / df["plazo_meses"]
df["ratio_cuota_ingreso"]   = (df["cuota_estimada"] / (df["ingreso_mensual"] + 1)).clip(0, 2)
df["capacidad_pago_score"]  = (df["ingreso_mensual"] / (df["cuota_estimada"] + 1)).clip(0, 20)

# Historial crediticio
df["tasa_cumplimiento"]     = (df["creditos_sin_mora"] / (df["num_creditos_prev"] + 1)).clip(0, 1)
df["experiencia_crediticia"] = (df["num_creditos_prev"] > 0).astype(int)
df["puntaje_norm"]           = (df["puntaje_interno"] - 300) / 650  # normalizar 0-1

# Variables temporales
df["trimestre_solicitud"]   = ((df["mes_solicitud"] - 1) // 3) + 1
df["es_fin_anio"]           = df["mes_solicitud"].isin([11, 12]).astype(int)

# Log transforms
for col in ["ingreso_mensual","gasto_mensual","monto_solicitado","deuda_actual","patrimonio_estimado"]:
    df[f"{col}_log"] = np.log1p(df[col].fillna(df[col].median()))

# Encoding categoricas
df["sexo_enc"]     = (df["sexo"] == "M").astype(int)
df["tipo_cred_enc"] = df["tipo_credito"].map(
    {"consumo": 3, "emergente": 4, "productivo": 2, "vivienda": 1}
)
provincia_mora = df.groupby("provincia")["mora_90d"].mean()
df["provincia_riesgo"] = df["provincia"].map(provincia_mora)

sector_mora = df.groupby("sector_economico")["mora_90d"].mean()
df["sector_riesgo"] = df["sector_economico"].map(sector_mora)

FEATURES = [
    "edad", "nivel_educacion", "num_dependientes", "sexo_enc",
    "ingreso_mensual_log", "gasto_mensual_log", "monto_solicitado_log",
    "deuda_actual_log", "patrimonio_estimado_log",
    "ratio_deuda_ingreso", "ratio_ahorro_ingreso",
    "ratio_cuota_ingreso", "capacidad_pago_score",
    "años_socio", "puntaje_norm", "tasa_cumplimiento",
    "experiencia_crediticia", "aportes_puntual_pct",
    "tiene_garante", "tiene_hipoteca", "plazo_meses",
    "tipo_cred_enc", "trimestre_solicitud", "es_fin_anio",
    "provincia_riesgo", "sector_riesgo"
]

X = df[FEATURES].fillna(df[FEATURES].median())
y = df["mora_90d"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

print(f"  {len(FEATURES)} features construidas | Train: {len(X_train)} | Test: {len(X_test)}")

# ================================================
# COMPARACION 5 MODELOS
# ================================================
print("\n[MODELOS] Comparando 5 algoritmos...")

modelos = {
    "Logistic Reg.":    LogisticRegression(C=0.5, max_iter=1000, random_state=42),
    "Decision Tree":    DecisionTreeClassifier(max_depth=5, min_samples_leaf=30, random_state=42),
    "Random Forest":    RandomForestClassifier(n_estimators=150, max_depth=10,
                                               min_samples_leaf=20, random_state=42),
    "Grad. Boosting":   GradientBoostingClassifier(n_estimators=150, learning_rate=0.08,
                                                   max_depth=4, random_state=42),
    "Voting Ensemble":  VotingClassifier(
        estimators=[
            ("lr", LogisticRegression(max_iter=1000, random_state=42)),
            ("rf", RandomForestClassifier(n_estimators=100, random_state=42)),
            ("gb", GradientBoostingClassifier(n_estimators=100, random_state=42)),
        ],
        voting="soft"
    ),
}

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
resultados = {}

for nombre, modelo in modelos.items():
    cv_auc = cross_val_score(modelo, X_train_s, y_train, cv=cv,
                              scoring="roc_auc").mean()
    modelo.fit(X_train_s, y_train)
    y_prob  = modelo.predict_proba(X_test_s)[:,1]
    y_pred  = modelo.predict(X_test_s)
    test_auc = roc_auc_score(y_test, y_prob)
    resultados[nombre] = {
        "cv_auc": cv_auc, "test_auc": test_auc,
        "f1": f1_score(y_test, y_pred),
        "acc": accuracy_score(y_test, y_pred),
        "ap": average_precision_score(y_test, y_prob),
        "y_prob": y_prob, "modelo": modelo
    }
    print(f"  {nombre:<20}: CV-AUC={cv_auc:.4f} | Test-AUC={test_auc:.4f} | AP={resultados[nombre]['ap']:.4f}")

mejor_nombre = max(resultados, key=lambda k: resultados[k]["test_auc"])
mejor_res = resultados[mejor_nombre]
print(f"\n  Modelo ganador: {mejor_nombre} (AUC={mejor_res['test_auc']:.4f})")

# ================================================
# ANALISIS DEL MODELO GANADOR
# ================================================
print(f"\n[ANALISIS] Profundizando en {mejor_nombre}...")

modelo_ganador = mejor_res["modelo"]
y_prob_ganador = mejor_res["y_prob"]

# Reporte completo
print(f"\n  Reporte de clasificacion (threshold=0.50):")
print(classification_report(y_test, (y_prob_ganador > 0.5).astype(int),
                             target_names=["Al dia","En mora"]))

# Umbral optimo
fpr_arr, tpr_arr, thresholds = roc_curve(y_test, y_prob_ganador)
youden = tpr_arr - fpr_arr
threshold_optimo = thresholds[np.argmax(youden)]
pred_optimo = (y_prob_ganador > threshold_optimo).astype(int)

print(f"  Threshold optimo (Youden): {threshold_optimo:.3f}")
cm = confusion_matrix(y_test, pred_optimo)
tn, fp, fn, tp = cm.ravel()
precision = tp / (tp + fp)
recall    = tp / (tp + fn)
print(f"  Con threshold={threshold_optimo:.3f}: Precision={precision:.3f} | Recall={recall:.3f}")
print(f"  TP={tp} | FP={fp} | FN={fn} | TN={tn}")

# Importancia features (si tiene)
if hasattr(modelo_ganador, "feature_importances_"):
    imp = pd.Series(modelo_ganador.feature_importances_,
                     index=FEATURES).sort_values(ascending=False)
    print(f"\n  Top 10 features del modelo ganador:")
    for feat, val in imp.head(10).items():
        print(f"  {feat:<30}: {val:.5f}")

# ================================================
# SIMULACION SISTEMA DE SCORING
# ================================================
print("\n[SCORING] Simulacion sistema de decision...")

def scoring_coac(datos_socio, modelo, scaler, threshold=0.40):
    """
    Sistema de scoring para COAC Ecuador.
    Retorna: decision, score, banda de riesgo, motivos.
    """
    X_input = pd.DataFrame([datos_socio])[FEATURES].fillna(0)
    X_scaled = scaler.transform(X_input)
    prob_mora = modelo.predict_proba(X_scaled)[0][1]

    # Banda de riesgo SEPS
    if prob_mora < 0.15:
        banda = "A1 — Riesgo Muy Bajo"
        decision = "APROBAR"
    elif prob_mora < 0.30:
        banda = "A2 — Riesgo Bajo"
        decision = "APROBAR"
    elif prob_mora < 0.45:
        banda = "B  — Riesgo Medio"
        decision = "APROBAR con condiciones"
    elif prob_mora < 0.60:
        banda = "C  — Riesgo Alto"
        decision = "REVISAR con comite"
    else:
        banda = "D/E — Riesgo Muy Alto"
        decision = "RECHAZAR"

    return {
        "prob_mora": round(prob_mora, 4),
        "score_coac": int((1 - prob_mora) * 1000),  # escala 0-1000
        "banda_riesgo": banda,
        "decision": decision,
        "timestamp": datetime.now().isoformat()
    }

# Casos de prueba
casos_prueba = [
    {feat: 0 for feat in FEATURES}  # defaults para todos
]
# Caso 1: Perfil bajo riesgo
caso1 = {
    "edad": 42, "nivel_educacion": 4, "num_dependientes": 2, "sexo_enc": 0,
    "ingreso_mensual_log": np.log1p(2800), "gasto_mensual_log": np.log1p(1600),
    "monto_solicitado_log": np.log1p(10000), "deuda_actual_log": np.log1p(2000),
    "patrimonio_estimado_log": np.log1p(80000),
    "ratio_deuda_ingreso": 0.06, "ratio_ahorro_ingreso": 0.25,
    "ratio_cuota_ingreso": 0.10, "capacidad_pago_score": 8.5,
    "años_socio": 12, "puntaje_norm": 0.85, "tasa_cumplimiento": 1.0,
    "experiencia_crediticia": 1, "aportes_puntual_pct": 0.97,
    "tiene_garante": 1, "tiene_hipoteca": 0, "plazo_meses": 24,
    "tipo_cred_enc": 2, "trimestre_solicitud": 1, "es_fin_anio": 0,
    "provincia_riesgo": 0.14, "sector_riesgo": 0.13,
}
# Caso 2: Perfil alto riesgo
caso2 = {**caso1,
    "ingreso_mensual_log": np.log1p(450), "gasto_mensual_log": np.log1p(420),
    "monto_solicitado_log": np.log1p(20000), "deuda_actual_log": np.log1p(15000),
    "ratio_deuda_ingreso": 3.2, "ratio_cuota_ingreso": 1.5,
    "capacidad_pago_score": 0.8, "años_socio": 1,
    "puntaje_norm": 0.25, "tasa_cumplimiento": 0.40,
    "aportes_puntual_pct": 0.55, "tiene_garante": 0,
    "tipo_cred_enc": 3, "tipo_cred_enc_nominal": "consumo",
}

print("\n  Caso 1 — Socia con buen perfil:")
r1 = scoring_coac(caso1, modelo_ganador, scaler)
for k, v in r1.items():
    print(f"    {k}: {v}")

print("\n  Caso 2 — Socio con perfil alto riesgo:")
r2 = scoring_coac(caso2, modelo_ganador, scaler)
for k, v in r2.items():
    print(f"    {k}: {v}")

# ================================================
# DASHBOARD FINAL
# ================================================
fig = plt.figure(figsize=(18, 12))
gs = gridspec.GridSpec(2, 3, figure=fig, hspace=0.45, wspace=0.35)

colores_mod = ["#1F2F58","#73B8E7","#FBBC0C","#F0846D","#388E3C"]
# ROC multi-modelo
ax1 = fig.add_subplot(gs[0, :2])
for (nombre, res), color in zip(resultados.items(), colores_mod):
    fpr, tpr, _ = roc_curve(y_test, res["y_prob"])
    ax1.plot(fpr, tpr, lw=2, color=color,
             label=f"{nombre} (AUC={res['test_auc']:.3f})")
ax1.plot([0,1],[0,1],"k--",lw=0.8,label="Aleatorio")
ax1.fill_between(fpr_arr, tpr_arr, alpha=0.1, color="#1F2F58")
ax1.set_title("Curvas ROC — Comparacion 5 Modelos")
ax1.legend(fontsize=8); ax1.set_xlabel("FPR"); ax1.set_ylabel("TPR")

# AUC barras
ax2 = fig.add_subplot(gs[0, 2])
nombres_plot = list(resultados.keys())
cv_aucs  = [resultados[k]["cv_auc"] for k in nombres_plot]
test_aucs = [resultados[k]["test_auc"] for k in nombres_plot]
x_pos = range(len(nombres_plot))
ax2.bar([x-0.2 for x in x_pos], cv_aucs,  0.4, label="CV-AUC",  color="#1F2F58", alpha=0.85)
ax2.bar([x+0.2 for x in x_pos], test_aucs, 0.4, label="Test-AUC", color="#73B8E7", alpha=0.85)
ax2.set_xticks(list(x_pos))
ax2.set_xticklabels([n.split()[0] for n in nombres_plot], fontsize=8)
ax2.set_title("CV vs Test AUC"); ax2.legend()

# Distribucion scores
ax3 = fig.add_subplot(gs[1, :2])
scores_al_dia = y_prob_ganador[y_test == 0]
scores_mora   = y_prob_ganador[y_test == 1]
ax3.hist(scores_al_dia, bins=40, alpha=0.65, color="#73B8E7", density=True, label="Al dia")
ax3.hist(scores_mora, bins=40, alpha=0.65, color="#F0846D", density=True, label="En mora")
ax3.axvline(threshold_optimo, color="#1F2F58", lw=2, linestyle="--",
            label=f"Threshold Youden ({threshold_optimo:.2f})")
ax3.set_title(f"Distribucion Scores — {mejor_nombre}")
ax3.set_xlabel("P(mora)"); ax3.legend()

# Tabla resumen
ax4 = fig.add_subplot(gs[1, 2])
ax4.axis("off")
datos_tabla = [[n.replace("."," "), f"{resultados[n]['cv_auc']:.4f}",
                f"{resultados[n]['test_auc']:.4f}", f"{resultados[n]['f1']:.4f}"]
               for n in nombres_plot]
tabla = ax4.table(
    cellText=datos_tabla,
    colLabels=["Modelo","CV-AUC","Test-AUC","F1"],
    loc="center", cellLoc="center"
)
tabla.auto_set_font_size(False); tabla.set_fontsize(8)
ax4.set_title("Resumen Comparativo", fontsize=10, fontweight="bold")

plt.suptitle(f"Scoring Crediticio COAC Ecuador — Proyecto Final\nMejor modelo: {mejor_nombre} | AUC={mejor_res['test_auc']:.4f}",
             fontsize=13, fontweight="bold", y=1.01)
plt.savefig("proyecto_scoring_coac.png", dpi=150, bbox_inches="tight")
plt.close()
print("\n  Grafico guardado: proyecto_scoring_coac.png")

# ================================================
# REPORTE EJECUTIVO
# ================================================
print("\n" + "=" * 70)
print("REPORTE EJECUTIVO — SISTEMA SCORING COAC ECUADOR")
print("=" * 70)
print(f"  Fecha:               {datetime.now().strftime('%Y-%m-%d')}")
print(f"  Dataset:             {n} solicitudes historicas (3 años)")
print(f"  Features:            {len(FEATURES)} variables")
print(f"  Modelos evaluados:   {len(modelos)}")
print(f"  Mejor modelo:        {mejor_nombre}")
print(f"  AUC-ROC (test):      {mejor_res['test_auc']:.4f}")
print(f"  Precision (mora):    {precision:.3f}")
print(f"  Recall (mora):       {recall:.3f}")
print(f"  Threshold optimo:    {threshold_optimo:.3f}")
print(f"\n  BANDAS DE RIESGO SEPS:")
print(f"  A1 (< 0.15): Aprobar directamente")
print(f"  A2 (< 0.30): Aprobar con seguimiento")
print(f"  B  (< 0.45): Aprobar con condiciones adicionales")
print(f"  C  (< 0.60): Comite de credito obligatorio")
print(f"  D/E (>= 0.60): Rechazar")
print(f"\n  IMPACTO ESPERADO:")
tiempo_ahorro = 3 * 24 * 60  # 3 dias en minutos
print(f"  Reduccion tiempo decision:   3 dias → 2 segundos ({tiempo_ahorro:,} min ahorrados/solicitud)")
print(f"  Capacidad analisis:          ~500 solicitudes/dia (vs 50 manual)")
print(f"  Reduccion mora esperada:     -25% en 12 meses (benchmark industria)")
print("=" * 70)
```

2. Ejecuta el proyecto completo y analiza las bandas de riesgo de los 2 casos de prueba.

3. Implementa el sistema de scoring como endpoint Flask/FastAPI: `POST /score` recibe JSON del socio y devuelve la decision con el score.

4. Agrega monitoreo: registra cada prediccion en SQLite con timestamp, score, decision y realidad (si se conoce).

## Usa IA para...

> Abre Claude y escribe:
> "Soy el Data Scientist de una cooperativa de ahorro y credito en Ecuador. Mi modelo de scoring tiene AUC=0.86, pero la SEPS me exige que el sistema sea 'explicable e interpretable' para auditorias. ¿Como documento el modelo para cumplir con regulaciones? Necesito: 1) Model Card en formato SEPS, 2) documentacion de cada variable con justificacion del uso, 3) analisis de fairness (el modelo no debe discriminar por sexo o provincia), 4) proceso de apelacion cuando un socio es rechazado. Dame la estructura del documento de cumplimiento regulatorio."

Despues de leer la respuesta:
- Redacta el Model Card para el modelo del ejercicio.
- Implementa el analisis de fairness: calcula el AUC separado por sexo y por region.

## Que aprendiste

- Un sistema de scoring crediticio completo incluye: datos → feature engineering → comparacion modelos → seleccion → interpretabilidad → API → monitoreo.
- Las bandas de riesgo (A1/A2/B/C/D/E) estructuran la decision crediticia segun el marco regulatorio de la SEPS.
- El threshold optimo (Youden) balancea precision y recall considerando el costo asimetrico de errores.
- El Voting Ensemble combina las fortalezas de multiples modelos — a veces supera al mejor modelo individual.
- Un Model Card documenta el proposito, datos, metricas y limitaciones del modelo — exigido por reguladores financieros.
- El analisis de fairness detecta si el modelo discrimina grupos protegidos (sexo, edad, etnia, region).

## Reto extra

Despliega el sistema de scoring como microservicio en produccion: containeriza con Docker, despliega en AWS ECS o Google Cloud Run, agrega un dashboard de monitoreo con Grafana que muestre el AUC en tiempo real, la distribucion de scores semanal, y alertas cuando detecta drift en las features de entrada (PSI > 0.25). Implementa reentrenamiento automatico mensual con MLflow para versionado de modelos y registro de experimentos.
