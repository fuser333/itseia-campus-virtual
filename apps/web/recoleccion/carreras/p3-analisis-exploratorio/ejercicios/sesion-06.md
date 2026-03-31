# Ejercicio Sesion 6: Datos Faltantes — Estrategias

**Materia:** Analisis Exploratorio de Datos
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion estimada:** 35 min

## Objetivo

Detectar, visualizar y tratar valores faltantes (NaN) usando estrategias de imputacion simple (media, mediana, moda), imputacion multiple (KNN, iterativa) y eliminacion, sobre datos de salud y economia ecuatoriana.

## Contexto

En el mundo real, los datos siempre tienen faltantes. El INEC Ecuador reporta que el 12-18% de las encuestas ENEMDU tienen al menos un campo sin respuesta. Un analista que elimina todas las filas con NaN puede perder hasta el 40% del dataset. Conocer las estrategias correctas es la diferencia entre un analisis solido y uno sesgado.

## Instrucciones

1. Crea el archivo `sesion06_datos_faltantes_ecuador.py`.

2. Ejecuta este codigo:

```python
# Datos Faltantes: Deteccion y Tratamiento - ITSEIA
# Dataset: Encuesta de salud y condiciones laborales Ecuador
# Fuente: estructura basada en INEC / MSP Ecuador

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.experimental import enable_iterative_imputer  # noqa
from sklearn.impute import IterativeImputer

np.random.seed(42)
print("=" * 65)
print("DATOS FALTANTES - ENCUESTA SALUD ECUADOR")
print("=" * 65)

# ================================================
# CREAR DATASET CON FALTANTES REALISTAS
# ================================================
n = 200

df = pd.DataFrame({
    "cedula": [f"17{str(i).zfill(8)}" for i in range(n)],
    "edad": np.random.randint(18, 70, n),
    "provincia": np.random.choice(["Pichincha","Guayas","Azuay","Manabi","Loja"], n,
                                   p=[0.30, 0.25, 0.15, 0.20, 0.10]),
    "salario": np.random.normal(750, 350, n).clip(400, 4000).round(2),
    "peso_kg": np.random.normal(68, 12, n).clip(45, 120).round(1),
    "talla_cm": np.random.normal(163, 9, n).clip(145, 195).round(1),
    "glucosa": np.random.normal(95, 18, n).clip(60, 200).round(1),
    "presion_sistolica": np.random.normal(120, 15, n).clip(80, 180).round(0),
    "anios_educacion": np.random.randint(6, 20, n),
    "hijos": np.random.randint(0, 6, n)
})

# Calcular IMC real
df["imc"] = (df["peso_kg"] / (df["talla_cm"] / 100) ** 2).round(2)

# ================================================
# INYECTAR FALTANTES CON DISTINTOS PATRONES
# MCAR = Missing Completely At Random
# MAR  = Missing At Random (depende de otra variable)
# MNAR = Missing Not At Random (sesgo sistemico)
# ================================================

# MCAR: glucosa falta aleatoriamente (15%)
mask_glucosa = np.random.random(n) < 0.15
df.loc[mask_glucosa, "glucosa"] = np.nan

# MAR: salario falta mas para gente con menos educacion
prob_falta_sal = np.where(df["anios_educacion"] < 10, 0.30, 0.08)
mask_sal = np.random.random(n) < prob_falta_sal
df.loc[mask_sal, "salario"] = np.nan

# MNAR: presion arterial falta mas para personas mayores (no se midieron)
mask_presion = (df["edad"] > 55) & (np.random.random(n) < 0.45)
df.loc[mask_presion, "presion_sistolica"] = np.nan

# IMC falta si falta peso o talla
mask_imc = np.random.random(n) < 0.10
df.loc[mask_imc, "imc"] = np.nan

# ================================================
# ANALISIS DE FALTANTES
# ================================================
print("\n--- MAPA DE FALTANTES ---")
faltantes = df.isnull().sum()
pct = (faltantes / n * 100).round(1)
for col, cnt in faltantes.items():
    if cnt > 0:
        barra = "#" * int(pct[col] / 2)
        print(f"  {col:<25}: {cnt:>3} ({pct[col]:>5.1f}%) {barra}")

total_celdas_faltantes = df.isnull().sum().sum()
filas_con_faltantes = df.isnull().any(axis=1).sum()
print(f"\nTotal celdas faltantes: {total_celdas_faltantes} / {df.size}")
print(f"Filas con al menos 1 NaN: {filas_con_faltantes} ({filas_con_faltantes/n*100:.1f}%)")

# ================================================
# ESTRATEGIA 1: Eliminar (listwise)
# ================================================
df_completo = df.dropna()
print(f"\n--- ESTRATEGIA 1: ELIMINAR FILAS CON NaN ---")
print(f"  Antes: {len(df)} filas  |  Despues: {len(df_completo)} filas  |  Perdida: {len(df)-len(df_completo)}")

# ================================================
# ESTRATEGIA 2: Imputacion simple
# ================================================
print("\n--- ESTRATEGIA 2: IMPUTACION SIMPLE ---")
numericas = ["salario", "glucosa", "presion_sistolica", "imc"]
df_simple = df[numericas].copy()

# Media para glucosa (MCAR - sin sesgo)
imp_media = SimpleImputer(strategy="mean")
df_simple["glucosa"] = imp_media.fit_transform(df_simple[["glucosa"]])

# Mediana para salario (distribucion sesgada)
imp_mediana = SimpleImputer(strategy="median")
df_simple["salario"] = imp_mediana.fit_transform(df_simple[["salario"]])

# Mediana para presion (robusta a outliers)
df_simple["presion_sistolica"] = imp_mediana.fit_transform(df_simple[["presion_sistolica"]])

for col in numericas:
    antes = df[col].isnull().sum()
    despues = df_simple[col].isnull().sum()
    print(f"  {col:<25}: {antes} NaN → {despues} NaN")

# ================================================
# ESTRATEGIA 3: KNN Imputer
# ================================================
print("\n--- ESTRATEGIA 3: KNN IMPUTER (k=5) ---")
knn_imp = KNNImputer(n_neighbors=5)
df_knn = pd.DataFrame(
    knn_imp.fit_transform(df[numericas]),
    columns=numericas
)
print(f"  Faltantes despues de KNN: {df_knn.isnull().sum().sum()}")
# Comparar imputaciones
for col in ["salario", "glucosa"]:
    diff = abs(df_simple[col].mean() - df_knn[col].mean())
    print(f"  {col}: media_simple=${df_simple[col].mean():.1f}  media_knn=${df_knn[col].mean():.1f}  dif=${diff:.1f}")

# ================================================
# VISUALIZACION
# ================================================
fig, axes = plt.subplots(1, 3, figsize=(16, 5))
fig.suptitle("Datos Faltantes - Encuesta Salud Ecuador",
             fontsize=13, fontweight="bold")

# Heatmap de faltantes
cols_con_faltantes = [c for c in df.columns if df[c].isnull().any()]
sns.heatmap(df[cols_con_faltantes].isnull().astype(int).head(80),
            ax=axes[0], cmap=["#1F2F58", "#F0846D"],
            cbar_kws={"label": "0=dato  1=faltante"},
            yticklabels=False)
axes[0].set_title("Mapa de NaN (80 primeras filas)")
axes[0].tick_params(axis="x", rotation=45, labelsize=8)

# Barras de porcentaje
pct_plot = pct[pct > 0]
axes[1].barh(pct_plot.index, pct_plot.values, color="#FBBC0C", edgecolor="white")
axes[1].axvline(x=5, color="#F0846D", linestyle="--", label="5% umbral")
axes[1].axvline(x=15, color="red", linestyle="--", label="15% critico")
axes[1].set_title("% Faltantes por columna")
axes[1].set_xlabel("Porcentaje (%)")
axes[1].legend(fontsize=8)

# Comparacion distribuciones: original vs imputado
original_valido = df["salario"].dropna()
axes[2].hist(original_valido, bins=25, alpha=0.6, color="#1F2F58", label="Original (sin NaN)")
axes[2].hist(df_simple["salario"], bins=25, alpha=0.5, color="#FBBC0C", label="Mediana imputada")
axes[2].hist(df_knn["salario"], bins=25, alpha=0.4, color="#F0846D", label="KNN imputado")
axes[2].set_title("Salario: orig vs imputaciones")
axes[2].set_xlabel("USD/mes")
axes[2].legend(fontsize=7)

plt.tight_layout()
plt.savefig("sesion06_faltantes.png", dpi=150, bbox_inches="tight")
plt.show()

print("\nGrafico guardado: sesion06_faltantes.png")
print("=" * 65)
```

3. Analiza el heatmap de faltantes y describe el patron: son MCAR, MAR o MNAR?

4. Implementa la Estrategia 4: `IterativeImputer` de sklearn y compara su resultado con KNN.

## Usa IA para...

> Abre Gemini y escribe:
> "Tengo datos de salud con 18% de faltantes en presion arterial. El patron es que los mayores de 55 anos tienen mas faltantes. ¿Esto es MCAR, MAR o MNAR? ¿Por que importa esta clasificacion para elegir el metodo de imputacion?"

Despues de leer la respuesta:
- Clasifica cada columna del dataset segun su tipo de faltante.
- Ajusta la estrategia de imputacion segun la clasificacion.

## Que aprendiste

- MCAR, MAR y MNAR son los tres tipos de mecanismos de datos faltantes.
- Eliminar filas (listwise) es valido solo cuando los faltantes son pocos y MCAR.
- Media/mediana imputada infla el n artificialmente y reduce la varianza.
- KNN imputa usando los k vecinos mas similares — mas preciso que media para datos MAR.
- `df.isnull().sum()` cuenta NaN por columna; `df.isnull().any(axis=1).sum()` cuenta filas afectadas.
- Siempre comparar distribuciones antes/despues de imputar para detectar sesgo introducido.

## Reto extra

Simula el efecto del sesgo de imputacion: construye un modelo de regresion lineal para predecir salario usando las otras variables. Entrenalo con: (1) solo filas completas, (2) imputacion por media, (3) KNN imputer. Compara el R2 de los tres modelos. ¿Cual tecnica introduce menos sesgo en el modelo final?
