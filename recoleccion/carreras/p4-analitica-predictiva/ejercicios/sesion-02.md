# Ejercicio Sesion 2: Arboles de Decision y Random Forest

**Materia:** Analitica Predictiva
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Construir y comparar arboles de decision y Random Forest para clasificacion y regresion: visualizar el arbol, interpretar la importancia de features, tunear hiperparametros con GridSearchCV, y aplicar al problema de segmentacion de clientes del sector retail ecuatoriano.

## Contexto

Supermaxi, TIA y las cadenas de retail ecuatorianas necesitan segmentar clientes para personalizar promociones. Un arbol de decision permite crear reglas interpretables como "si el cliente gasta mas de $300/mes y tiene tarjeta de fidelidad, es cliente Premium". Random Forest agrupa cientos de arboles para mayor precision sin sacrificar mucha interpretabilidad.

## Instrucciones

1. Crea el archivo `sesion02_arboles_random_forest_ecuador.py`:

```python
# Arboles de Decision y Random Forest - ITSEIA
# Analitica Predictiva
# Dataset: clientes retail Ecuador (Supermaxi/TIA)

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.tree import DecisionTreeClassifier, export_text, plot_tree
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (accuracy_score, classification_report,
                              confusion_matrix)
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("ARBOLES DE DECISION Y RANDOM FOREST — RETAIL ECUADOR")
print("=" * 65)

# ================================================
# DATASET: CLIENTES RETAIL ECUADOR
# ================================================
print("\n--- GENERANDO DATASET CLIENTES RETAIL ---")

n = 800
df = pd.DataFrame({
    "edad":              np.random.randint(18, 70, n),
    "ingreso_mensual":   np.random.choice([400,600,800,1200,2000,3500],
                                           n, p=[0.20,0.25,0.22,0.18,0.10,0.05]),
    "gasto_mensual":     np.random.uniform(50, 1200, n),
    "frecuencia_visitas":np.random.randint(1, 20, n),    # por mes
    "tiene_tarjeta_fid": np.random.binomial(1, 0.45, n),
    "usa_app_movil":     np.random.binomial(1, 0.38, n),
    "anios_cliente":     np.random.randint(0, 15, n),
    "num_hijos":         np.random.choice([0,1,2,3,4], n, p=[0.30,0.25,0.28,0.12,0.05]),
    "zona": np.random.choice(["norte","sur","centro","valles"], n,
                               p=[0.25,0.30,0.25,0.20]),
    "canal_preferido": np.random.choice(["tienda","online","mixto"], n,
                                         p=[0.55,0.20,0.25]),
})

# Target: segmento (regla de negocio real)
def asignar_segmento(row):
    score = (
        row["gasto_mensual"] / 100 +
        row["frecuencia_visitas"] * 0.5 +
        row["tiene_tarjeta_fid"] * 2 +
        row["usa_app_movil"] * 1.5 +
        row["anios_cliente"] * 0.3 +
        row["ingreso_mensual"] / 500
    ) + np.random.normal(0, 0.5)

    if score >= 12:
        return "VIP"
    elif score >= 8:
        return "Premium"
    elif score >= 5:
        return "Regular"
    else:
        return "Basico"

df["segmento"] = df.apply(asignar_segmento, axis=1)

print(f"  Dataset: {len(df)} clientes")
print(f"  Distribucion segmentos:")
for seg, cnt in df["segmento"].value_counts().items():
    pct = cnt/len(df)*100
    print(f"    {seg:<10}: {cnt:>4} ({pct:.1f}%)")

# Encoding
le = LabelEncoder()
df["zona_enc"]   = le.fit_transform(df["zona"])
df["canal_enc"]  = le.fit_transform(df["canal_preferido"])
df["target"]     = le.fit_transform(df["segmento"])

feature_cols = ["edad","ingreso_mensual","gasto_mensual","frecuencia_visitas",
                "tiene_tarjeta_fid","usa_app_movil","anios_cliente",
                "num_hijos","zona_enc","canal_enc"]

X = df[feature_cols]
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                      random_state=42, stratify=y)

# ================================================
# ARBOL DE DECISION
# ================================================
print("\n--- ARBOL DE DECISION ---")

dt = DecisionTreeClassifier(max_depth=4, min_samples_leaf=20, random_state=42)
dt.fit(X_train, y_train)
y_pred_dt = dt.predict(X_test)

acc_dt = accuracy_score(y_test, y_pred_dt)
cv_dt  = cross_val_score(dt, X, y, cv=5, scoring="accuracy").mean()

print(f"  Accuracy test:  {acc_dt:.4f}")
print(f"  Accuracy CV-5:  {cv_dt:.4f}")
print(f"  Profundidad:    {dt.get_depth()}")
print(f"  Nodos hoja:     {dt.get_n_leaves()}")

print("\n  Reglas del arbol (max 15 lineas):")
reglas = export_text(dt, feature_names=feature_cols, max_depth=3)
print("\n".join(reglas.split("\n")[:20]))

# Importancia features
imp_dt = pd.Series(dt.feature_importances_, index=feature_cols).sort_values(ascending=False)
print("\n  Importancia de features:")
for feat, imp in imp_dt.items():
    barra = "#" * int(imp * 40)
    print(f"  {feat:<25}: {barra} {imp:.4f}")

# ================================================
# RANDOM FOREST
# ================================================
print("\n--- RANDOM FOREST ---")

rf = RandomForestClassifier(n_estimators=100, max_depth=8,
                             min_samples_leaf=10, random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)
y_pred_rf = rf.predict(X_test)

acc_rf = accuracy_score(y_test, y_pred_rf)
cv_rf  = cross_val_score(rf, X, y, cv=5, scoring="accuracy").mean()

print(f"  Accuracy test:  {acc_rf:.4f}")
print(f"  Accuracy CV-5:  {cv_rf:.4f}")
print(f"  Mejora vs DT:   {(acc_rf - acc_dt)*100:+.2f}pp")

imp_rf = pd.Series(rf.feature_importances_, index=feature_cols).sort_values(ascending=False)
print("\n  Top 5 features mas importantes (RF):")
for feat, imp in imp_rf.head(5).items():
    print(f"  {feat:<25}: {imp:.4f}")

# ================================================
# TUNING DE HIPERPARAMETROS
# ================================================
print("\n--- GRID SEARCH: TUNING HIPERPARAMETROS ---")

param_grid = {
    "n_estimators": [50, 100],
    "max_depth": [5, 8, None],
    "min_samples_leaf": [5, 10, 20]
}

gs = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid, cv=3, scoring="accuracy", n_jobs=-1, verbose=0
)
gs.fit(X_train, y_train)

print(f"  Mejores hiperparametros: {gs.best_params_}")
print(f"  Mejor score CV:         {gs.best_score_:.4f}")

rf_best = gs.best_estimator_
y_pred_best = rf_best.predict(X_test)
print(f"  Accuracy test (tuned):  {accuracy_score(y_test, y_pred_best):.4f}")

# ================================================
# CLASIFICACION NUEVA CLIENTE
# ================================================
print("\n--- PREDICCION NUEVOS CLIENTES ---")

nuevos = pd.DataFrame({
    "edad": [28, 45, 35], "ingreso_mensual": [800, 3500, 1200],
    "gasto_mensual": [180, 750, 350], "frecuencia_visitas": [4, 15, 8],
    "tiene_tarjeta_fid": [0, 1, 1], "usa_app_movil": [1, 1, 0],
    "anios_cliente": [1, 12, 4], "num_hijos": [0, 3, 2],
    "zona_enc": [1, 0, 2], "canal_enc": [2, 0, 1]
})

segmentos_nombres = le.inverse_transform(range(4))
pred_seg = rf_best.predict(nuevos)
pred_proba = rf_best.predict_proba(nuevos)

print("  Cliente | Segmento pred | Confianza")
perfiles = ["Joven empleado","Ejecutivo senior","Familia clase media"]
for i, (perfil, seg) in enumerate(zip(perfiles, pred_seg)):
    confianza = pred_proba[i].max() * 100
    nombre_seg = le.inverse_transform([seg])[0]
    print(f"  {perfil:<22}: {nombre_seg:<10} ({confianza:.1f}% confianza)")

# Visualizacion
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Arbol de decision visualizado
plot_tree(dt, feature_names=feature_cols, class_names=le.classes_,
          filled=True, rounded=True, max_depth=2, ax=axes[0],
          fontsize=6)
axes[0].set_title("Arbol de Decision (primeros 2 niveles)")

# Importancia de features RF
imp_rf.plot(kind="barh", ax=axes[1], color="#1F2F58")
axes[1].set_title("Importancia de Features — Random Forest")
axes[1].set_xlabel("Importancia (Gini)")

plt.tight_layout()
plt.savefig("arboles_retail_ecuador.png", dpi=150, bbox_inches="tight")
plt.close()
print("\n  Grafico guardado: arboles_retail_ecuador.png")

print("\n" + "=" * 65)
print("ARBOLES — CONCEPTOS CLAVE:")
print("  max_depth:     controla overfitting (mas profundo = mas memoriza)")
print("  min_samples_leaf: nodos hoja con minimo N muestras (regulariza)")
print("  feature_importance: que variables mas discriminan el target")
print("  Random Forest: promedia N arboles para reducir varianza")
print("  GridSearchCV:  busqueda exhaustiva de hiperparametros optimos")
print("=" * 65)
```

2. Visualiza el arbol completo con `export_text` y identifica la regla que separa los clientes VIP del resto.

3. Calcula la "ganancia de informacion" (Information Gain) de la primera division del arbol e interpretala en contexto de negocio.

## Usa IA para...

> Abre Claude y escribe:
> "Tengo un Random Forest con 100 arboles para segmentar clientes de retail ecuatoriano en 4 categorias (VIP, Premium, Regular, Basico). El accuracy es 82% pero necesito explicar la clasificacion de un cliente especifico al gerente de marketing. ¿Como uso SHAP values para explicar por que el modelo clasifico a un cliente como VIP? Dame el codigo completo con visualizacion del SHAP waterfall plot."

Despues de leer la respuesta:
- Implementa SHAP values para los 3 clientes nuevos del ejercicio.
- Interpreta en palabras simples por que cada cliente fue clasificado en su segmento.

## Que aprendiste

- Un arbol de decision crea reglas de tipo `if-then-else` interpretables por el negocio.
- `max_depth` y `min_samples_leaf` son los hiperparametros mas importantes para controlar overfitting.
- Random Forest reduce la varianza promediando N arboles entrenados en subconjuntos aleatorios de datos y features.
- `feature_importances_` indica cuanto contribuye cada variable a la reduccion de impureza Gini.
- `GridSearchCV` con CV anidado da una estimacion no sesgada del rendimiento del modelo tuneado.
- SHAP values permiten explicar predicciones individuales — esencial para modelos que toman decisiones de negocio.

## Reto extra

Construye un sistema de recomendacion de promociones para los 4 segmentos de clientes: para cada segmento, analiza los 3 productos mas comprados (simula canasta de compras), calcula el ticket promedio y frecuencia ideal, y genera automaticamente el texto del email de promocion usando la API de OpenAI (GPT-4o-mini). El sistema debe correr semanal y personalizarse con el nombre del cliente.
