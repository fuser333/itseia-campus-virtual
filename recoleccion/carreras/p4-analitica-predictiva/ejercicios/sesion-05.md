# Ejercicio Sesion 5: Evaluacion y Validacion de Modelos

**Materia:** Analitica Predictiva
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Dominar la evaluacion rigurosa de modelos predictivos: cross-validation estratificada, curvas ROC/PR, analisis de sesgo-varianza, validacion temporal para series de datos economicos ecuatorianos, y deteccion de data leakage.

## Contexto

En Ecuador, el SRI evalua modelos de deteccion de evasion tributaria. Una empresa de seguros como Equinoccial usa modelos de prediccion de siniestros. Un modelo con buen accuracy en training pero malo en produccion es un fracaso costoso — la validacion rigurosa previene esto. El data leakage es el error mas comun y devastador en proyectos de ML.

## Instrucciones

1. Crea el archivo `sesion05_evaluacion_modelos_ecuador.py`:

```python
# Evaluacion y Validacion de Modelos - ITSEIA
# Analitica Predictiva
# Metricas, CV, ROC, sesgo-varianza, leakage

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from sklearn.model_selection import (train_test_split, StratifiedKFold,
                                      cross_val_score, learning_curve,
                                      TimeSeriesSplit)
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (roc_curve, auc, precision_recall_curve,
                              average_precision_score, accuracy_score,
                              f1_score, roc_auc_score, confusion_matrix)
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("EVALUACION Y VALIDACION DE MODELOS — ECUADOR")
print("=" * 65)

# ================================================
# DATASET: DETECCION EVASION TRIBUTARIA SRI ECUADOR
# ================================================
print("\n--- DATASET: EVASION TRIBUTARIA ---")

n = 2000
ruc_digits = np.random.choice([2,6,9], n, p=[0.6,0.3,0.1])  # tipo contribuyente
ventas = np.random.lognormal(11, 1.5, n)
diferencia_iva = np.random.normal(0, 0.15, n)       # diferencia declarada vs calculada
ratio_gastos = np.random.uniform(0.3, 1.2, n)       # gastos/ventas
años_en_sistema = np.random.randint(1, 20, n)
num_empleados_dec = np.random.randint(0, 200, n)
cambios_rep_legal = np.random.randint(0, 5, n)
declaraciones_tardias = np.random.randint(0, 12, n)

# P(evasion) — regla realista
log_odds = (
    -4.0
    + 2.5 * np.abs(diferencia_iva)
    + 1.5 * (ratio_gastos > 0.95).astype(float)
    - 0.08 * años_en_sistema
    + 0.3 * cambios_rep_legal
    + 0.15 * declaraciones_tardias
    + np.random.normal(0, 0.8, n)
)
prob_evasion = 1 / (1 + np.exp(-log_odds))
evade = (prob_evasion > 0.55).astype(int)

df = pd.DataFrame({
    "tipo_contribuyente": ruc_digits,
    "ventas_log":          np.log1p(ventas),
    "diferencia_iva_abs":  np.abs(diferencia_iva),
    "ratio_gastos":        ratio_gastos.round(4),
    "años_sistema":        años_en_sistema,
    "num_empleados":       num_empleados_dec,
    "cambios_rep_legal":   cambios_rep_legal,
    "declaraciones_tardias": declaraciones_tardias,
    "evade":               evade
})

print(f"  Dataset: {n} contribuyentes | Tasa evasion: {evade.mean()*100:.1f}%")

X = df.drop(columns=["evade"])
y = df["evade"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s  = scaler.transform(X_test)

# ================================================
# COMPARAR MULTIPLES MODELOS
# ================================================
print("\n--- COMPARACION 4 MODELOS ---")

modelos = {
    "Logistic Reg.":     LogisticRegression(random_state=42, max_iter=1000),
    "Decision Tree":     DecisionTreeClassifier(max_depth=4, random_state=42),
    "Random Forest":     RandomForestClassifier(n_estimators=100, random_state=42),
    "Gradient Boost":    GradientBoostingClassifier(n_estimators=100, random_state=42),
}

resultados = {}
for nombre, modelo in modelos.items():
    # Cross-validation estratificada
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(modelo, X_train_s, y_train, cv=cv, scoring="roc_auc")

    # Entrenamiento y test
    modelo.fit(X_train_s, y_train)
    y_pred  = modelo.predict(X_test_s)
    y_proba = modelo.predict_proba(X_test_s)[:, 1]

    resultados[nombre] = {
        "modelo":    modelo,
        "cv_auc":    cv_scores.mean(),
        "cv_std":    cv_scores.std(),
        "test_auc":  roc_auc_score(y_test, y_proba),
        "test_acc":  accuracy_score(y_test, y_pred),
        "test_f1":   f1_score(y_test, y_pred),
        "y_proba":   y_proba,
        "overfitting": cv_scores.mean() - roc_auc_score(y_test, y_proba)
    }
    print(f"  {nombre:<18}: CV-AUC={cv_scores.mean():.4f}±{cv_scores.std():.3f} | "
          f"Test-AUC={roc_auc_score(y_test, y_proba):.4f} | "
          f"F1={f1_score(y_test, y_pred):.4f}")

mejor = max(resultados, key=lambda k: resultados[k]["test_auc"])
print(f"\n  Mejor modelo: {mejor} (AUC={resultados[mejor]['test_auc']:.4f})")

# ================================================
# CURVA ROC COMPARATIVA
# ================================================
print("\n--- CURVAS ROC ---")
for nombre, res in resultados.items():
    fpr, tpr, _ = roc_curve(y_test, res["y_proba"])
    auc_val = auc(fpr, tpr)
    print(f"  {nombre:<18}: AUC = {auc_val:.4f} | "
          f"Threshold optimo: {_[np.argmax(tpr - fpr)]:.3f}")

# ================================================
# ANALISIS SESGO-VARIANZA (Curva de Aprendizaje)
# ================================================
print("\n--- ANALISIS SESGO-VARIANZA ---")

modelo_gb = resultados["Gradient Boost"]["modelo"]
train_sizes, train_scores, val_scores = learning_curve(
    modelo_gb, X_train_s, y_train,
    train_sizes=np.linspace(0.1, 1.0, 8),
    cv=5, scoring="roc_auc", n_jobs=-1
)

print("  Curva de aprendizaje (Gradient Boost):")
print(f"  {'Train size':<12} {'Train AUC':<12} {'Val AUC':<12} {'Diagnostico'}")
for ts, tr, vl in zip(train_sizes,
                       train_scores.mean(axis=1),
                       val_scores.mean(axis=1)):
    gap = tr - vl
    diag = ("OVERFITTING" if gap > 0.05 else
            "UNDERFITTING" if vl < 0.65 else "BUENO")
    print(f"  {ts:<12.0f} {tr:<12.4f} {vl:<12.4f} {diag}")

# ================================================
# DETECCION DATA LEAKAGE
# ================================================
print("\n--- DETECCION DATA LEAKAGE ---")

print("  Tipos de leakage y como detectarlo:")
leakage_casos = [
    ("Target encoding pre-split",
     "Calcular media del target ANTES de dividir train/test → sobreestima AUC",
     "Siempre calcular target encoding DENTRO del CV fold"),
    ("Escalar con fit en todo el dataset",
     "scaler.fit(X_all) → el test 've' estadisticas del futuro",
     "scaler.fit(X_train) SOLO, luego .transform(X_test)"),
    ("Variable derivada del target",
     "Incluir 'deuda_mora' para predecir 'mora' — es la misma variable",
     "Revisar correlaciones extremas (r > 0.95) con el target"),
    ("Datos del futuro en features",
     "Usar 'pago_final' para predecir si pagara — info no disponible en decision",
     "Ordenar datos por fecha, nunca usar info posterior a la decision"),
]

for tipo, problema, solucion in leakage_casos:
    print(f"\n  LEAKAGE: {tipo}")
    print(f"    Problema:  {problema}")
    print(f"    Solucion:  {solucion}")

# Ejemplo: demostrar el efecto del leakage
print("\n  DEMO leakage — efecto en AUC:")
df["variable_leakage"] = df["evade"] * 0.7 + np.random.normal(0, 0.1, n)
X_leak = df.drop(columns=["evade"])
X_l_train, X_l_test, y_l_train, y_l_test = train_test_split(
    X_leak, y, test_size=0.2, random_state=42, stratify=y
)
sc2 = StandardScaler()
lr_leak = LogisticRegression(max_iter=1000)
lr_leak.fit(sc2.fit_transform(X_l_train), y_l_train)
auc_leak = roc_auc_score(y_l_test,
                          lr_leak.predict_proba(sc2.transform(X_l_test))[:,1])
auc_limpio = resultados["Logistic Reg."]["test_auc"]
print(f"  AUC sin leakage:  {auc_limpio:.4f}")
print(f"  AUC con leakage:  {auc_leak:.4f} ← INFLADO — no confiar!")

# ================================================
# VALIDACION TEMPORAL (datos ordenados en tiempo)
# ================================================
print("\n--- VALIDACION TEMPORAL ---")
tscv = TimeSeriesSplit(n_splits=5)
df_sorted = df.sample(frac=1).reset_index(drop=True)  # simular orden temporal
X_ts = scaler.fit_transform(df_sorted.drop(columns=["evade","variable_leakage"]))
y_ts = df_sorted["evade"]

scores_ts = []
for train_idx, val_idx in tscv.split(X_ts):
    rf_ts = RandomForestClassifier(n_estimators=50, random_state=42)
    rf_ts.fit(X_ts[train_idx], y_ts.iloc[train_idx])
    proba_ts = rf_ts.predict_proba(X_ts[val_idx])[:, 1]
    scores_ts.append(roc_auc_score(y_ts.iloc[val_idx], proba_ts))

print(f"  TimeSeriesSplit CV scores: {[round(s,4) for s in scores_ts]}")
print(f"  Media: {np.mean(scores_ts):.4f} | Std: {np.std(scores_ts):.4f}")
print(f"  Nota: varianza alta en TS-CV indica modelo inestable en el tiempo")

# Visualizacion
fig = plt.figure(figsize=(16, 10))
gs = gridspec.GridSpec(2, 2, figure=fig, hspace=0.40, wspace=0.35)

# ROC curves
ax1 = fig.add_subplot(gs[0, 0])
colores_mod = ["#1F2F58","#73B8E7","#FBBC0C","#F0846D"]
for (nombre, res), color in zip(resultados.items(), colores_mod):
    fpr, tpr, _ = roc_curve(y_test, res["y_proba"])
    ax1.plot(fpr, tpr, color=color, lw=2,
             label=f"{nombre} (AUC={res['test_auc']:.3f})")
ax1.plot([0,1],[0,1],"k--",lw=0.8)
ax1.set_title("Curvas ROC — Comparacion Modelos")
ax1.legend(fontsize=8); ax1.set_xlabel("FPR"); ax1.set_ylabel("TPR")

# Curva de aprendizaje
ax2 = fig.add_subplot(gs[0, 1])
ax2.fill_between(train_sizes,
                  train_scores.mean(axis=1) - train_scores.std(axis=1),
                  train_scores.mean(axis=1) + train_scores.std(axis=1), alpha=0.2, color="#1F2F58")
ax2.fill_between(train_sizes,
                  val_scores.mean(axis=1) - val_scores.std(axis=1),
                  val_scores.mean(axis=1) + val_scores.std(axis=1), alpha=0.2, color="#FBBC0C")
ax2.plot(train_sizes, train_scores.mean(axis=1), "o-", color="#1F2F58", label="Train")
ax2.plot(train_sizes, val_scores.mean(axis=1), "s-", color="#FBBC0C", label="Validacion")
ax2.set_title("Curva de Aprendizaje (GBM)")
ax2.legend(); ax2.set_xlabel("Muestras de entrenamiento"); ax2.set_ylabel("AUC-ROC")

# CV AUC por modelo
ax3 = fig.add_subplot(gs[1, 0])
nombres_mod = list(resultados.keys())
cv_aucs = [resultados[k]["cv_auc"] for k in nombres_mod]
test_aucs = [resultados[k]["test_auc"] for k in nombres_mod]
x_pos = range(len(nombres_mod))
ax3.bar([x - 0.2 for x in x_pos], cv_aucs, 0.4, label="CV-AUC", color="#1F2F58", alpha=0.8)
ax3.bar([x + 0.2 for x in x_pos], test_aucs, 0.4, label="Test-AUC", color="#73B8E7", alpha=0.8)
ax3.set_xticks(list(x_pos))
ax3.set_xticklabels([n.replace(" ","\n") for n in nombres_mod], fontsize=8)
ax3.set_title("CV vs Test AUC por Modelo"); ax3.legend()

# TimeSeriesSplit
ax4 = fig.add_subplot(gs[1, 1])
ax4.plot(range(1, 6), scores_ts, "o-", color="#1F2F58", lw=2)
ax4.axhline(np.mean(scores_ts), color="#FBBC0C", linestyle="--", label=f"Media={np.mean(scores_ts):.3f}")
ax4.set_title("TimeSeriesSplit AUC por Fold")
ax4.set_xlabel("Fold"); ax4.set_ylabel("AUC-ROC")
ax4.legend()

plt.suptitle("Evaluacion Rigurosa de Modelos — SRI Ecuador",
             fontsize=13, fontweight="bold", y=1.01)
plt.savefig("evaluacion_modelos_ecuador.png", dpi=150, bbox_inches="tight")
plt.close()
print("\n  Grafico guardado: evaluacion_modelos_ecuador.png")

print("\n" + "=" * 65)
print("EVALUACION — CONCEPTOS CLAVE:")
print("  StratifiedKFold: mantiene proporcion de clases en cada fold")
print("  AUC-ROC:         independiente del threshold, mide ranking")
print("  Curva aprendizaje: diagnostico de overfitting/underfitting")
print("  Data leakage:    causa AUC inflado — el error mas peligroso")
print("  TimeSeriesSplit: validacion temporal — no mezcla futuro y pasado")
print("=" * 65)
```

2. Implementa el threshold de Youden (maximiza sensibilidad + especificidad) para el modelo ganador y recalcula las metricas.

3. Agrega el analisis de matriz de confusion por quintil de score para entender como se distribuyen los errores.

## Usa IA para...

> Abre Claude y escribe:
> "Tengo un modelo de deteccion de evasion tributaria para el SRI Ecuador con AUC=0.84. El SRI puede auditar 1.000 empresas por mes. ¿Como calculo el 'lift' del modelo para justificar su uso frente al directorio? Si sin modelo auditamos aleatoriamente y encontramos 15% de evasores, ¿cuantos evasores adicionales detecta el modelo si auditamos el top decil? Dame el codigo Python del cumulative lift chart y el calculo del ROI del modelo."

Despues de leer la respuesta:
- Implementa el cumulative lift chart.
- Calcula el ROI economico del modelo en terminos de recaudacion adicional para el SRI.

## Que aprendiste

- `StratifiedKFold` mantiene la proporcion de clases en cada fold — esencial para datasets desbalanceados.
- AUC-ROC mide la capacidad de ranking del modelo independientemente del threshold elegido.
- La curva de aprendizaje diagnostica: brecha train-val grande = overfitting; ambas bajas = underfitting.
- El data leakage es el error mas peligroso: infla artificialmente las metricas y el modelo falla en produccion.
- `TimeSeriesSplit` respeta el orden temporal — para datos financieros y economicos es obligatorio.
- El threshold optimo no es siempre 0.5 — depende del costo relativo de falsos positivos vs negativos.

## Reto extra

Construye un sistema de evaluacion continua de modelos en produccion (model monitoring): simula 6 meses de predicciones de evasion, detecta drift en la distribucion de scores (PSI > 0.25 = alerta), calcula el performance degradation mensual, y genera automaticamente un reporte con recomendacion de reentrenamiento cuando el AUC cae mas del 3% respecto al baseline. Implementa en FastAPI con endpoint `/monitor/health` que devuelve el estado del modelo en JSON.
