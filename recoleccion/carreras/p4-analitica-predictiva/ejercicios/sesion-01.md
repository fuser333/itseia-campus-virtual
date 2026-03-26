# Ejercicio Sesion 1: Regresion Lineal y Logistica

**Materia:** Analitica Predictiva
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Construir modelos de regresion lineal y logistica con scikit-learn para predecir variables continuas y binarias: predecir ventas de empresas ecuatorianas con regresion lineal multiple, y predecir riesgo de morosidad crediticia con regresion logistica.

## Contexto

El BCE y la Superintendencia de Bancos publican datos historicos de credito en Ecuador. Las instituciones financieras usan modelos de scoring para aprobar o rechazar prestamos. La regresion logistica es el modelo base del scoring crediticio: rapido, interpretable y regulatoriamente aceptado por la SB Ecuador.

## Instrucciones

1. Crea el archivo `sesion01_regresion_ecuador.py`:

```python
# Regresion Lineal y Logistica - ITSEIA
# Analitica Predictiva
# Dataset: ventas empresas + scoring crediticio Ecuador

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (mean_squared_error, r2_score,
                              accuracy_score, classification_report,
                              confusion_matrix, roc_auc_score)
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("REGRESION LINEAL Y LOGISTICA — ECUADOR")
print("=" * 65)

# ================================================
# PARTE 1: REGRESION LINEAL
# Dataset: ventas mensuales empresas PYME Ecuador
# ================================================
print("\n--- PARTE 1: REGRESION LINEAL MULTIPLE ---")
print("  Prediccion ventas PYME Ecuador")

n = 300
df_ventas = pd.DataFrame({
    "empleados":        np.random.randint(5, 150, n),
    "anios_operacion":  np.random.randint(1, 25, n),
    "inversion_marketing": np.random.uniform(500, 15000, n),
    "tiene_ecommerce":  np.random.binomial(1, 0.45, n),
    "provincia_quito":  np.random.binomial(1, 0.40, n),
    "provincia_guayas": np.random.binomial(1, 0.35, n),
    "sector": np.random.choice(["comercio","manufactura","servicios"], n,
                                p=[0.45, 0.25, 0.30]),
})

# Variable objetivo: ventas mensuales en USD (relacion real con ruido)
df_ventas["ventas_mensuales"] = (
    df_ventas["empleados"] * 850 +
    df_ventas["anios_operacion"] * 1200 +
    df_ventas["inversion_marketing"] * 3.5 +
    df_ventas["tiene_ecommerce"] * 8000 +
    df_ventas["provincia_quito"] * 5000 +
    df_ventas["provincia_guayas"] * 4500 +
    np.random.normal(0, 8000, n)
).clip(1000, 500000).round(0)

# Preparar features
X = df_ventas[["empleados","anios_operacion","inversion_marketing",
               "tiene_ecommerce","provincia_quito","provincia_guayas"]].copy()
y = df_ventas["ventas_mensuales"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Modelo
modelo_lr = LinearRegression()
modelo_lr.fit(X_train, y_train)
y_pred = modelo_lr.predict(X_test)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2   = r2_score(y_test, y_pred)

print(f"\n  METRICAS REGRESION LINEAL:")
print(f"  R² (coef. determinacion): {r2:.4f}")
print(f"  RMSE:                     ${rmse:,.0f}")
print(f"  Error promedio:           {rmse/y_test.mean()*100:.1f}% de las ventas")

print(f"\n  COEFICIENTES (impacto en ventas):")
coefs = pd.Series(modelo_lr.coef_, index=X.columns).sort_values(ascending=False)
for feature, coef in coefs.items():
    signo = "+" if coef > 0 else ""
    print(f"  {feature:<25}: {signo}${coef:,.0f} por unidad")
print(f"  Intercepto:               ${modelo_lr.intercept_:,.0f}")

# Prediccion nueva empresa
nueva_empresa = pd.DataFrame({
    "empleados": [25], "anios_operacion": [5],
    "inversion_marketing": [3000], "tiene_ecommerce": [1],
    "provincia_quito": [1], "provincia_guayas": [0]
})
pred_nueva = modelo_lr.predict(nueva_empresa)[0]
print(f"\n  PREDICCION empresa nueva (25 emp, 5 anos, mkt $3K, ecommerce, Quito):")
print(f"  Ventas estimadas: ${pred_nueva:,.0f}/mes")

# ================================================
# PARTE 2: REGRESION LOGISTICA (SCORING)
# Dataset: creditos banco Ecuador
# ================================================
print("\n--- PARTE 2: REGRESION LOGISTICA — SCORING CREDITICIO ---")

n_cred = 1000
edad = np.random.randint(22, 70, n_cred)
ingreso = np.random.uniform(500, 8000, n_cred)
deuda_existente = np.random.uniform(0, ingreso * 2, n_cred)
historial_meses = np.random.randint(0, 120, n_cred)
num_productos = np.random.randint(1, 8, n_cred)
monto_solicitado = np.random.uniform(1000, 50000, n_cred)

# Probabilidad de morosidad (logit real)
log_odds = (
    -3.0
    + 0.8 * (deuda_existente / ingreso)      # ratio deuda/ingreso
    - 0.015 * historial_meses                 # mas historial = menos riesgo
    - 0.0001 * ingreso                        # mas ingreso = menos riesgo
    + 0.00002 * monto_solicitado              # mas monto = mas riesgo
    - 0.2 * num_productos                     # mas productos = mas engagement
    + np.random.normal(0, 0.5, n_cred)
)
prob_mora = 1 / (1 + np.exp(-log_odds))
mora = (prob_mora > 0.5).astype(int)

df_credito = pd.DataFrame({
    "edad": edad, "ingreso_mensual": ingreso.round(0),
    "deuda_existente": deuda_existente.round(0),
    "historial_meses": historial_meses,
    "num_productos_banco": num_productos,
    "monto_solicitado": monto_solicitado.round(0),
    "mora": mora
})

print(f"  Dataset: {n_cred} creditos | Tasa mora: {mora.mean()*100:.1f}%")

X_c = df_credito.drop(columns=["mora"])
y_c = df_credito["mora"]

X_tc, X_vc, y_tc, y_vc = train_test_split(X_c, y_c, test_size=0.2,
                                            random_state=42, stratify=y_c)

scaler = StandardScaler()
X_tc_s = scaler.fit_transform(X_tc)
X_vc_s = scaler.transform(X_vc)

modelo_log = LogisticRegression(random_state=42, max_iter=1000)
modelo_log.fit(X_tc_s, y_tc)
y_pred_c = modelo_log.predict(X_vc_s)
y_prob_c = modelo_log.predict_proba(X_vc_s)[:, 1]

print(f"\n  METRICAS SCORING CREDITICIO:")
print(f"  Accuracy:  {accuracy_score(y_vc, y_pred_c):.4f}")
print(f"  AUC-ROC:   {roc_auc_score(y_vc, y_prob_c):.4f}")
print(f"\n  Reporte de clasificacion:")
print(classification_report(y_vc, y_pred_c, target_names=["Al dia","En mora"]))

cm = confusion_matrix(y_vc, y_pred_c)
print(f"  Matriz de confusion:")
print(f"                 Pred Al dia  Pred En mora")
print(f"  Real Al dia:   {cm[0,0]:>10}  {cm[0,1]:>12}")
print(f"  Real En mora:  {cm[1,0]:>10}  {cm[1,1]:>12}")

# Scoring de nuevo solicitante
nuevo_sol = pd.DataFrame({
    "edad": [32], "ingreso_mensual": [2500],
    "deuda_existente": [3000], "historial_meses": [48],
    "num_productos_banco": [3], "monto_solicitado": [15000]
})
nuevo_sol_s = scaler.transform(nuevo_sol)
prob_mora_nuevo = modelo_log.predict_proba(nuevo_sol_s)[0][1]
decision = "APROBAR" if prob_mora_nuevo < 0.35 else "REVISAR" if prob_mora_nuevo < 0.60 else "RECHAZAR"
print(f"\n  SCORING nuevo solicitante (32 anos, $2500 ingreso, $3K deuda):")
print(f"  Probabilidad de mora: {prob_mora_nuevo:.3f} ({prob_mora_nuevo*100:.1f}%)")
print(f"  Decision:             {decision}")

plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.scatter(y_test[:50], y_pred[:50], alpha=0.5, color="#1F2F58")
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], "r--")
plt.xlabel("Ventas reales"); plt.ylabel("Ventas predichas")
plt.title(f"Regresion Lineal — R²={r2:.3f}")

plt.subplot(1, 2, 2)
scores_sorted = sorted(zip(y_prob_c, y_vc), reverse=True)
acumulado = np.cumsum([y for _, y in scores_sorted]) / y_vc.sum()
plt.plot(np.linspace(0, 1, len(acumulado)), acumulado, color="#1F2F58", label="Modelo")
plt.plot([0, 1], [0, 1], "r--", label="Aleatorio")
plt.xlabel("% poblacion"); plt.ylabel("% mora capturada")
plt.title(f"Curva Lift — AUC={roc_auc_score(y_vc, y_prob_c):.3f}")
plt.legend()

plt.tight_layout()
plt.savefig("regresion_ecuador.png", dpi=150, bbox_inches="tight")
plt.close()
print("\n  Grafico guardado: regresion_ecuador.png")

print("\n" + "=" * 65)
print("REGRESION — CONCEPTOS CLAVE:")
print("  R²:        que tan bien el modelo explica la varianza")
print("  RMSE:      error promedio en las mismas unidades del target")
print("  AUC-ROC:   capacidad discriminativa (1=perfecto, 0.5=aleatorio)")
print("  Coefs.:    impacto marginal de cada variable en el target")
print("  Scoring:   prob_mora < 0.35 aprobar | < 0.60 revisar | rechazar")
print("=" * 65)
```

2. Agrega la variable `sector` (comercio/manufactura/servicios) al modelo de regresion lineal usando one-hot encoding y analiza si mejora el R².

3. Implementa validacion cruzada (k=5) para ambos modelos y compara los scores cv vs los scores en test.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un modelo de scoring crediticio con regresion logistica para un banco ecuatoriano. El AUC es 0.78 y la tasa de mora en el dataset es 22%. ¿Como decido el threshold optimo de decision (0.35, 0.50, 0.60) si el costo de un falso negativo (aprobar un cliente que mora) es 5 veces mayor que el costo de un falso positivo (rechazar un cliente bueno)? Dame el codigo para calcular el threshold optimo con la funcion de costo."

Despues de leer la respuesta:
- Implementa el threshold optimo con la funcion de costo asimetrica.
- Recalcula las metricas del modelo con el nuevo threshold.

## Que aprendiste

- La regresion lineal multiple modela relaciones continuas: `y = b0 + b1*x1 + b2*x2 + ...`.
- R² mide que porcentaje de la varianza del target explica el modelo (1 = perfecto).
- La regresion logistica modela probabilidades: output entre 0 y 1 via funcion sigmoide.
- AUC-ROC mide la capacidad discriminativa independientemente del threshold elegido.
- El threshold de decision (default 0.5) debe ajustarse segun el costo relativo de cada tipo de error.
- `StandardScaler` es obligatorio antes de la regresion logistica para que los coeficientes sean comparables.

## Reto extra

Construye un sistema de scoring crediticio completo para una cooperativa de ahorro y credito ecuatoriana: pipeline de preprocesamiento, comparacion de 5 modelos (LogReg, Decision Tree, Random Forest, GBM, XGBoost), seleccion del mejor por AUC, optimizacion de threshold por costo de negocio, y generacion de scorecard con bandas de riesgo (A: < 0.10, B: 0.10-0.25, C: 0.25-0.50, D: > 0.50). Incluye interpretabilidad SHAP del modelo ganador.
