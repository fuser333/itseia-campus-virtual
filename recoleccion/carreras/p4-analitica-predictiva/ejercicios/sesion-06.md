# Ejercicio Sesion 6: Feature Engineering Avanzado

**Materia:** Analitica Predictiva
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 45 min

## Objetivo

Aplicar tecnicas avanzadas de feature engineering para mejorar modelos predictivos: transformaciones matematicas, encoding de variables categoricas de alta cardinalidad, interacciones entre variables, features temporales, y seleccion de features con metodos de filtro, wrapper y embedded.

## Contexto

El feature engineering es "el arte de crear las variables correctas". En Ecuador, los datos del IESS tienen variables como "categoria de afiliado" con 20+ categorias, o "ciudad" con 200+ cantones. Sin encoding correcto, un modelo de ML no puede procesarlos. Las features bien diseadas pueden mejorar el AUC de 0.72 a 0.88 sin cambiar el algoritmo.

## Instrucciones

1. Crea el archivo `sesion06_feature_engineering_ecuador.py`:

```python
# Feature Engineering Avanzado - ITSEIA
# Analitica Predictiva
# Dataset: afiliados IESS Ecuador + creditos

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import (LabelEncoder, OrdinalEncoder,
                                    PolynomialFeatures)
from sklearn.feature_selection import (SelectKBest, f_classif,
                                        RFE, mutual_info_classif)
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("FEATURE ENGINEERING AVANZADO — IESS ECUADOR")
print("=" * 65)

# ================================================
# DATASET: AFILIADOS IESS ECUADOR
# ================================================
print("\n--- DATASET: AFILIADOS IESS ---")

n = 1500
cantones = ["Quito","Guayaquil","Cuenca","Ambato","Manta","Loja",
            "Riobamba","Ibarra","Esmeraldas","Latacunga","Orellana",
            "Machala","Santo Domingo","Portoviejo","Tena"]
sectores_iess = ["privado","publico","domestico","voluntario","autonomo"]
tipos_contrato = ["indefinido","plazo_fijo","temporal","obra_cierta"]
niveles_ed = ["primaria","secundaria","tecnico","universitario","posgrado"]

df_raw = pd.DataFrame({
    "edad":          np.random.randint(18, 65, n),
    "sexo":          np.random.choice(["M","F"], n, p=[0.52, 0.48]),
    "canton":        np.random.choice(cantones, n),
    "sector":        np.random.choice(sectores_iess, n, p=[0.55,0.25,0.08,0.07,0.05]),
    "tipo_contrato": np.random.choice(tipos_contrato, n, p=[0.45,0.28,0.17,0.10]),
    "educacion":     np.random.choice(niveles_ed, n, p=[0.08,0.35,0.22,0.28,0.07]),
    "salario":       np.random.lognormal(6.5, 0.6, n),  # ~$450-$5000
    "anos_afiliado": np.random.randint(0, 35, n),
    "num_aportes_12m": np.random.randint(0, 12, n),
    "tiene_credito_iess": np.random.binomial(1, 0.35, n),
    "deuda_iess":    np.random.lognormal(7, 1, n) * np.random.binomial(1, 0.35, n),
    "num_cargas":    np.random.randint(0, 6, n),
    "mes_ingreso":   np.random.randint(1, 13, n),
    "anio_ingreso":  np.random.randint(2000, 2024, n),
})

# Target: retraso en aportaciones (1 = al menos 2 meses en mora en el ano)
log_odds = (
    -3.5
    - 0.03 * df_raw["anos_afiliado"]
    + 0.5 * (df_raw["sector"] == "temporario").astype(float)
    + 0.4 * (df_raw["tipo_contrato"] == "temporal").astype(float)
    - 0.0003 * df_raw["salario"]
    + 0.2 * (df_raw["num_aportes_12m"] < 10).astype(float)
    + np.random.normal(0, 0.8, n)
)
df_raw["mora_aportaciones"] = (1/(1+np.exp(-log_odds)) > 0.45).astype(int)
print(f"  Dataset crudo: {df_raw.shape} | Mora: {df_raw['mora_aportaciones'].mean()*100:.1f}%")

# ================================================
# 1. TRANSFORMACIONES MATEMATICAS
# ================================================
print("\n--- 1. TRANSFORMACIONES MATEMATICAS ---")

df = df_raw.copy()

# Log transform para variables con distribucion sesgada
df["salario_log"] = np.log1p(df["salario"])
df["deuda_log"]   = np.log1p(df["deuda_iess"])

# Raiz cuadrada para conteos
df["num_cargas_sqrt"] = np.sqrt(df["num_cargas"])

# Binning con cuantiles (no intervalos fijos)
df["salario_quintil"] = pd.qcut(df["salario"], q=5,
                                  labels=["Q1","Q2","Q3","Q4","Q5"])

# Variables binarias desde continuas
df["salario_bajo"] = (df["salario"] < 450).astype(int)   # sueldo minimo Ecuador
df["tiene_deuda"]  = (df["deuda_iess"] > 0).astype(int)

print("  Transformaciones aplicadas:")
print(f"  salario: skew={df['salario'].skew():.2f} → salario_log: skew={df['salario_log'].skew():.2f}")
print(f"  deuda:   skew={df['deuda_iess'].skew():.2f} → deuda_log:  skew={df['deuda_log'].skew():.2f}")

# ================================================
# 2. FEATURES TEMPORALES
# ================================================
print("\n--- 2. FEATURES TEMPORALES ---")

df["antiguedad_anios"] = 2024 - df["anio_ingreso"]
df["antiguedad_cuadrado"] = df["antiguedad_anios"] ** 2  # efecto no lineal
df["trimestre_ingreso"] = ((df["mes_ingreso"] - 1) // 3) + 1
df["es_primer_semestre"] = (df["mes_ingreso"] <= 6).astype(int)

# Interaccion temporal: aportaciones regularidad
df["regularidad_aportaciones"] = df["num_aportes_12m"] / 12  # ratio 0-1
df["aportaciones_esperadas_vs_reales"] = df["anos_afiliado"] * 12 - df["num_aportes_12m"]

print("  Features temporales creadas:")
for feat in ["antiguedad_anios","trimestre_ingreso","regularidad_aportaciones"]:
    print(f"  {feat}: media={df[feat].mean():.2f} | std={df[feat].std():.2f}")

# ================================================
# 3. ENCODING CATEGORICAS
# ================================================
print("\n--- 3. ENCODING DE VARIABLES CATEGORICAS ---")

# a) Label Encoding para ordinal
orden_educacion = ["primaria","secundaria","tecnico","universitario","posgrado"]
orden_contrato  = ["temporal","obra_cierta","plazo_fijo","indefinido"]
df["educacion_ord"] = df["educacion"].map(
    {v: i for i, v in enumerate(orden_educacion)}
)
df["contrato_ord"] = df["tipo_contrato"].map(
    {v: i for i, v in enumerate(orden_contrato)}
)

# b) One-Hot Encoding para nominales de baja cardinalidad
df_ohe = pd.get_dummies(df[["sexo","sector"]], prefix=["sexo","sector"])

# c) Target Encoding para alta cardinalidad (canton)
print("  Target Encoding para canton (15 valores):")
target_enc_canton = df.groupby("canton")["mora_aportaciones"].mean()
df["canton_target_enc"] = df["canton"].map(target_enc_canton).round(4)
print("  Canton → P(mora) via target encoding:")
print("  " + str(dict(target_enc_canton.round(3).items()))[:100] + "...")

# d) Frequency Encoding
df["canton_freq_enc"] = df["canton"].map(df["canton"].value_counts(normalize=True))

print(f"\n  Cardinalidades: canton={df['canton'].nunique()} | sector={df['sector'].nunique()}")

# ================================================
# 4. INTERACCIONES
# ================================================
print("\n--- 4. INTERACCIONES ENTRE VARIABLES ---")

df["salario_x_antiguedad"] = df["salario_log"] * df["antiguedad_anios"] / 10
df["deuda_ratio_salario"]  = df["deuda_log"] / (df["salario_log"] + 1)
df["cargas_x_salario"]     = df["num_cargas"] / (df["salario"] / 1000 + 1)
df["aportes_x_contrato"]   = df["regularidad_aportaciones"] * df["contrato_ord"]

# Interacciones polinomiales de las 3 mejores features
top_features = ["salario_log","anos_afiliado","regularidad_aportaciones"]
poly = PolynomialFeatures(degree=2, include_bias=False, interaction_only=True)
poly_features = poly.fit_transform(df[top_features])
poly_names = poly.get_feature_names_out(top_features)
df_poly = pd.DataFrame(poly_features[:, len(top_features):],
                        columns=poly_names[len(top_features):])

print("  Interacciones generadas:")
for col in df_poly.columns:
    print(f"  {col}")

# ================================================
# 5. SELECCION DE FEATURES
# ================================================
print("\n--- 5. SELECCION DE FEATURES ---")

# Construir DataFrame final
feature_cols = (
    ["edad","salario_log","deuda_log","num_cargas_sqrt","anos_afiliado",
     "num_aportes_12m","tiene_credito_iess","tiene_deuda","salario_bajo",
     "educacion_ord","contrato_ord","canton_target_enc","canton_freq_enc",
     "antiguedad_anios","regularidad_aportaciones","deuda_ratio_salario",
     "cargas_x_salario","salario_x_antiguedad"] +
    list(df_ohe.columns)
)

df_final = pd.concat([df.reset_index(drop=True),
                       df_ohe.reset_index(drop=True)], axis=1)
df_final = df_final[[c for c in feature_cols if c in df_final.columns]].fillna(0)

X_final = df_final.values
y_final = df["mora_aportaciones"].values

# a) Filtro: Mutual Information
mi_scores = mutual_info_classif(X_final, y_final, random_state=42)
mi_ranking = pd.Series(mi_scores, index=df_final.columns).sort_values(ascending=False)
print(f"\n  Top 10 features por Mutual Information:")
for feat, score in mi_ranking.head(10).items():
    print(f"  {feat:<30}: {score:.5f}")

# b) Embedded: Importancia RF
rf_sel = RandomForestClassifier(n_estimators=100, random_state=42)
scaler = StandardScaler()
rf_sel.fit(scaler.fit_transform(X_final), y_final)
rf_imp = pd.Series(rf_sel.feature_importances_,
                    index=df_final.columns).sort_values(ascending=False)
print(f"\n  Top 10 features por RF Importance:")
for feat, imp in rf_imp.head(10).items():
    barra = "#" * int(imp * 200)
    print(f"  {feat:<30}: {barra} {imp:.5f}")

# c) Comparar: original vs engineered
print(f"\n--- IMPACTO DEL FEATURE ENGINEERING ---")
features_originales = ["edad","salario","anos_afiliado","num_aportes_12m",
                        "num_cargas","tiene_credito_iess","deuda_iess"]

X_orig = df[features_originales].values
X_engi = scaler.fit_transform(X_final)

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
rf_base = RandomForestClassifier(n_estimators=50, random_state=42)

auc_orig = cross_val_score(rf_base, StandardScaler().fit_transform(X_orig),
                            y_final, cv=cv, scoring="roc_auc").mean()
auc_engi = cross_val_score(rf_base, X_engi, y_final, cv=cv,
                            scoring="roc_auc").mean()

print(f"  AUC sin feature engineering: {auc_orig:.4f}")
print(f"  AUC con feature engineering: {auc_engi:.4f}")
print(f"  Mejora:                      {(auc_engi - auc_orig)*100:+.2f}pp")

# Grafico
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

mi_ranking.head(12).plot(kind="barh", ax=axes[0], color="#1F2F58")
axes[0].set_title("Top 12 Features — Mutual Information")
axes[0].set_xlabel("Mutual Information Score")

rf_imp.head(12).plot(kind="barh", ax=axes[1], color="#73B8E7")
axes[1].set_title("Top 12 Features — RF Importance")
axes[1].set_xlabel("Feature Importance (Gini)")

plt.tight_layout()
plt.savefig("feature_engineering_ecuador.png", dpi=150, bbox_inches="tight")
plt.close()
print("\n  Grafico guardado: feature_engineering_ecuador.png")

print("\n" + "=" * 65)
print("FEATURE ENGINEERING — TECNICAS APRENDIDAS:")
print("  Log/sqrt:         corregir skewness en variables numericas")
print("  Binning:          convertir continua en categorica (pd.qcut)")
print("  Target Encoding:  alta cardinalidad → media del target por categoria")
print("  Interacciones:    producto de variables para capturar no linealidad")
print("  Mutual Info:      seleccion no parametrica, captura relaciones no lineales")
print("  RF Importance:    seleccion embedded, considera interacciones")
print("=" * 65)
```

2. Implementa el encoding de fechas con features ciclicas (sen/cos del mes) para capturar la periodicidad anual.

3. Crea un `sklearn.Pipeline` que encadene: imputacion → encoding → scaling → seleccion → modelo.

## Usa IA para...

> Abre Gemini y escribe:
> "En mi dataset del IESS Ecuador tengo la variable 'canton' con 220 valores distintos. Quiero explorar 4 alternativas de encoding: 1) One-Hot (problema: 220 columnas), 2) Target encoding (riesgo: leakage), 3) Leave-One-Out encoding (correcto), 4) Embedding categorico con keras. ¿Cuando usar cada uno? ¿Como implemento Leave-One-Out encoding en Python para evitar leakage dentro del cross-validation? Dame codigo completo con validacion correcta."

Despues de leer la respuesta:
- Implementa Leave-One-Out encoding para el canton en el ejercicio.
- Compara el AUC vs el target encoding simple que ya implementaste.

## Que aprendiste

- Las transformaciones logaritmicas reducen el skewness y mejoran la convergencia de modelos lineales.
- El target encoding es potente pero requiere hacerse DENTRO del fold para evitar leakage.
- Las features de interaccion capturan relaciones no lineales que los modelos lineales no pueden ver.
- Mutual Information es una metrica no parametrica que detecta cualquier tipo de relacion (lineal o no).
- El feature engineering bien hecho puede mejorar el AUC mas que cambiar el algoritmo.
- Un sklearn Pipeline garantiza que las transformaciones se apliquen correctamente en cada fold de CV.

## Reto extra

Construye un sistema automatico de feature engineering para datos del IESS: implementa `featuretools` para generar features automaticas desde tablas relacionadas (afiliado, empresa, historial de aportes), aplica seleccion con Boruta (wrapper robusto), y genera un reporte PDF con las 20 mejores features, su importancia y una descripcion en lenguaje natural de lo que mide cada una. Compara el AUC del modelo manual vs el modelo con features automaticas.
