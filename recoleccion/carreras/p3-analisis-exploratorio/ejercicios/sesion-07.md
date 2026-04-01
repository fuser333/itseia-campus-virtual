# Ejercicio Sesion 7: Feature Engineering Basico

**Materia:** Analisis Exploratorio de Datos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Crear nuevas variables (features) a partir de variables existentes usando transformaciones matematicas, codificacion categorica, binning, interacciones y extraccion de fechas, mejorando la capacidad predictiva de un dataset ecuatoriano.

## Contexto

Los datos crudos rara vez tienen la forma optima para un modelo de ML. Feature engineering es el arte de crear variables que "expliquen mejor" el fenomeno. En Ecuador, la variable "salario" puede no ser util directamente — pero "salario_relativo_al_SBU" o "rango_salarial" pueden ser mucho mas poderosas para un modelo de segmentacion de clientes de banca.

## Instrucciones

1. Crea el archivo `sesion07_feature_engineering_ecuador.py`.

2. Ejecuta este codigo:

```python
# Feature Engineering Basico - ITSEIA
# Dataset: Clientes banco Ecuador 2024
# Tecnicas: binning, encoding, interacciones, fechas, ratios

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import matplotlib.pyplot as plt
import seaborn as sns

np.random.seed(2026)
print("=" * 65)
print("FEATURE ENGINEERING - CLIENTES BANCO ECUADOR")
print("=" * 65)

# ================================================
# DATASET ORIGINAL: clientes banco Ecuador
# ================================================
n = 300
fechas_nacimiento = pd.date_range("1965-01-01", "2003-12-31", periods=n)
fechas_apertura   = pd.date_range("2015-01-01", "2025-12-31", periods=n)

df = pd.DataFrame({
    "cliente_id": [f"ECU{str(i).zfill(5)}" for i in range(n)],
    "fecha_nacimiento": np.random.choice(fechas_nacimiento, n),
    "fecha_apertura_cuenta": np.random.choice(fechas_apertura, n),
    "salario_mensual": np.random.lognormal(6.5, 0.6, n).clip(400, 8000).round(2),
    "saldo_promedio": np.random.lognormal(5.8, 0.9, n).clip(0, 20000).round(2),
    "num_transacciones_mes": np.random.poisson(12, n),
    "provincia": np.random.choice(
        ["Pichincha","Guayas","Azuay","Manabi","Loja","Tungurahua"],
        p=[0.30, 0.25, 0.15, 0.15, 0.08, 0.07], size=n
    ),
    "tipo_cuenta": np.random.choice(["ahorro","corriente","inversion"], p=[0.55, 0.30, 0.15], size=n),
    "tiene_credito": np.random.choice([True, False], p=[0.35, 0.65], size=n),
    "monto_credito": np.random.lognormal(7.5, 0.8, n).clip(500, 50000).round(0),
})

# Clientes sin credito no tienen monto
df.loc[~df["tiene_credito"], "monto_credito"] = 0.0

print(f"Dataset original: {df.shape[0]} filas x {df.shape[1]} columnas")
print(f"Columnas: {df.columns.tolist()}")

# ================================================
# TECNICA 1: EXTRACCION DE FECHAS
# ================================================
print("\n--- TECNICA 1: EXTRACCION DE FECHAS ---")
fecha_ref = pd.Timestamp("2026-01-01")

df["edad_años"] = ((fecha_ref - df["fecha_nacimiento"]).dt.days / 365.25).astype(int)
df["antiguedad_meses"] = ((fecha_ref - df["fecha_apertura_cuenta"]).dt.days / 30.44).astype(int)
df["cohorte_anio"] = df["fecha_apertura_cuenta"].dt.year
df["es_cliente_reciente"] = (df["antiguedad_meses"] < 12).astype(int)

print(f"  edad_años:          media={df['edad_años'].mean():.1f} años")
print(f"  antiguedad_meses:   media={df['antiguedad_meses'].mean():.0f} meses")
print(f"  clientes recientes: {df['es_cliente_reciente'].sum()}")

# ================================================
# TECNICA 2: RATIOS Y INTERACCIONES
# ================================================
print("\n--- TECNICA 2: RATIOS Y VARIABLES DERIVADAS ---")
SBU = 460  # Salario Basico Unificado Ecuador 2024

df["salario_vs_sbu"] = (df["salario_mensual"] / SBU).round(3)
df["saldo_vs_salario"] = (df["saldo_promedio"] / df["salario_mensual"].replace(0, np.nan)).round(3)
df["promedio_por_transaccion"] = (df["saldo_promedio"] / df["num_transacciones_mes"].replace(0, np.nan)).round(2)
df["ratio_credito_ingreso"] = (df["monto_credito"] / (df["salario_mensual"] * 12)).round(3)

print(f"  salario_vs_sbu:      media={df['salario_vs_sbu'].mean():.2f}x SBU")
print(f"  saldo_vs_salario:    media={df['saldo_vs_salario'].mean():.2f} meses guardados")
print(f"  ratio_credito_ingr:  media={df['ratio_credito_ingreso'].mean():.2f}")

# ================================================
# TECNICA 3: BINNING (discretizacion)
# ================================================
print("\n--- TECNICA 3: BINNING ---")

# Rango etario Ecuador
df["grupo_etario"] = pd.cut(
    df["edad_años"],
    bins=[18, 25, 35, 45, 55, 100],
    labels=["joven(18-25)", "adulto-joven(26-35)",
            "adulto(36-45)", "senior(46-55)", "mayor(55+)"]
)

# Segmento salarial Ecuador
df["segmento_salarial"] = pd.cut(
    df["salario_mensual"],
    bins=[0, 460, 1000, 2500, 5000, 999999],
    labels=["subsistencia", "basico", "medio", "alto", "premium"]
)

print("  Distribucion grupo etario:")
print(df["grupo_etario"].value_counts().to_string())

print("\n  Distribucion segmento salarial:")
print(df["segmento_salarial"].value_counts().to_string())

# ================================================
# TECNICA 4: ENCODING CATEGORICO
# ================================================
print("\n--- TECNICA 4: ENCODING CATEGORICO ---")

# Label Encoding (orden implicito)
le = LabelEncoder()
df["provincia_le"] = le.fit_transform(df["provincia"])
print(f"  Label Encoding provincia: {dict(zip(le.classes_, le.transform(le.classes_)))}")

# One-Hot Encoding (sin orden)
ohe_cols = pd.get_dummies(df["tipo_cuenta"], prefix="cuenta", dtype=int)
df = pd.concat([df, ohe_cols], axis=1)
print(f"  One-Hot tipo_cuenta: {ohe_cols.columns.tolist()}")

# Binary Encoding para tiene_credito (ya es booleano)
df["tiene_credito_int"] = df["tiene_credito"].astype(int)

# ================================================
# RESUMEN FINAL
# ================================================
print(f"\n--- RESUMEN FEATURE ENGINEERING ---")
print(f"  Columnas originales:  11")
print(f"  Columnas generadas:   {df.shape[1] - 11}")
print(f"  Total columnas final: {df.shape[1]}")

nuevas = ["edad_años","antiguedad_meses","salario_vs_sbu","saldo_vs_salario",
          "grupo_etario","segmento_salarial","provincia_le","cuenta_ahorro",
          "cuenta_corriente","cuenta_inversion","ratio_credito_ingreso"]
print(f"\n  Nuevas features utiles para ML:")
for col in nuevas:
    print(f"    + {col}")

# ================================================
# VISUALIZACION
# ================================================
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle("Feature Engineering - Clientes Banco Ecuador 2024",
             fontsize=13, fontweight="bold")

# Distribucion segmento salarial
seg_count = df["segmento_salarial"].value_counts()
axes[0, 0].bar(seg_count.index, seg_count.values,
               color=["#F0846D","#FBBC0C","#73B8E7","#1F2F58","#2A3F6E"],
               edgecolor="white")
axes[0, 0].set_title("Segmento Salarial (binning)")
axes[0, 0].set_xlabel("Segmento")
axes[0, 0].set_ylabel("Clientes")
axes[0, 0].tick_params(axis="x", rotation=20)

# Saldo vs salario por segmento
df_plot = df.dropna(subset=["segmento_salarial"])
df_plot.boxplot(column="saldo_vs_salario", by="segmento_salarial", ax=axes[0, 1])
axes[0, 1].set_title("Meses de ahorro por segmento")
axes[0, 1].set_xlabel("Segmento salarial")
plt.sca(axes[0, 1])
plt.xticks(rotation=20, fontsize=7)

# Grupo etario
grupo_count = df["grupo_etario"].value_counts()
axes[1, 0].pie(grupo_count.values, labels=grupo_count.index,
               autopct="%1.1f%%", colors=["#1F2F58","#2A3F6E","#73B8E7","#FBBC0C","#F0846D"])
axes[1, 0].set_title("Distribucion Grupos Etarios")

# Ratio credito-ingreso por tipo de cuenta
df.boxplot(column="ratio_credito_ingreso", by="tipo_cuenta", ax=axes[1, 1])
axes[1, 1].set_title("Ratio credito/ingreso por tipo cuenta")
axes[1, 1].set_xlabel("Tipo de cuenta")

plt.tight_layout()
plt.savefig("sesion07_feature_engineering.png", dpi=150, bbox_inches="tight")
plt.show()

print("\nGrafico guardado: sesion07_feature_engineering.png")
print("=" * 65)
```

3. Ejecuta y analiza el resumen final de features.

4. Crea una feature adicional: `score_riesgo_cliente` calculado como combinacion ponderada de ratio_credito_ingreso, saldo_vs_salario y antiguedad_meses (inventa la formula).

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un dataset de clientes de banco Ecuador con salario, saldo, transacciones y edad. Quiero predecir si un cliente va a caer en mora. ¿Cuales son las 5 features derivadas mas utiles que deberia crear? Dame el codigo Python para cada una."

Despues de leer la respuesta:
- Implementa al menos 2 de las features sugeridas por ChatGPT.
- Verifica su correlacion con `tiene_credito` para evaluar si son utiles.

## Que aprendiste

- Feature engineering transforma datos crudos en variables utiles para ML.
- `pd.cut()` y `pd.qcut()` crean bins de igual amplitud o igual frecuencia respectivamente.
- Label Encoding asigna numeros ordinales a categorias — cuidado: puede implicar orden no real.
- One-Hot Encoding crea columnas binarias — apropiado para categorias sin orden.
- Ratios y cocientes entre variables suelen tener mas poder predictivo que las variables crudas.
- Extraer partes de fechas (anio, mes, antiguedad) convierte fechas en features numericas utiles.

## Reto extra

Investiga `PolynomialFeatures` de sklearn. Aplica grado 2 a las variables numericas `salario_mensual`, `saldo_promedio` y `num_transacciones_mes`. ¿Cuantas features genera? Entrena un modelo de regresion logistica para predecir `tiene_credito` con las features originales vs las polinomiales. ¿Mejora la precision?
