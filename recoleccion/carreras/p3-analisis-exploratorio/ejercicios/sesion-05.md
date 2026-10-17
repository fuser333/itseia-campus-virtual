# Ejercicio Sesion 5: Outliers — Deteccion y Tratamiento

**Materia:** Analisis Exploratorio de Datos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Detectar valores atipicos (outliers) usando metodos IQR, Z-score y Isolation Forest, y aplicar estrategias de tratamiento: eliminar, capear o transformar, sobre datos economicos ecuatorianos.

## Contexto

Los outliers pueden arruinar un modelo de ML o revelar fraude, errores de captura, o casos genuinamente excepcionales. En datos salariales del Ecuador, un salario de $50,000/mes puede ser el CEO de Pacifictel o un error de digitacion — la diferencia importa. Un cientifico de datos debe detectar, investigar y decidir que hacer con cada outlier antes de modelar.

## Instrucciones

1. Crea el archivo `sesion05_outliers_ecuador.py`.

2. Ejecuta este codigo:

```python
# Outliers: Deteccion y Tratamiento - ITSEIA
# Dataset: Ventas y salarios Ecuador con anomalias
# Fuente: simulado con parametros reales Ecuador

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import IsolationForest
from scipy import stats

np.random.seed(2026)
print("=" * 65)
print("DETECCION Y TRATAMIENTO DE OUTLIERS - ECUADOR")
print("=" * 65)

# ================================================
# DATASET: salarios Ecuador con outliers intencionados
# ================================================
n = 200
salarios_base = np.random.normal(800, 300, n).clip(400, 3000)

# Inyectar outliers realistas Ecuador:
# - Errores de digitacion (valores imposibles)
# - Ejecutivos con salario muy alto
# - Becarios con salario muy bajo
outliers_altos = np.array([15000, 22000, 8500, 12000, 9800])   # ejecutivos/errores
outliers_bajos = np.array([50, 80, 30, 100])                     # becarios/errores
salarios = np.concatenate([salarios_base, outliers_altos, outliers_bajos])
np.random.shuffle(salarios)

# Otras variables
edades = np.random.randint(18, 62, len(salarios))
horas = np.random.normal(44, 8, len(salarios)).clip(15, 84)

df = pd.DataFrame({
    "id": range(1, len(salarios) + 1),
    "salario": salarios.round(2),
    "edad": edades,
    "horas_semana": horas.round(1)
})

print(f"Dataset: {len(df)} registros (incluye {len(outliers_altos) + len(outliers_bajos)} outliers inyectados)")

# ================================================
# METODO 1: IQR (Rango Intercuartilico)
# ================================================
print("\n--- METODO 1: REGLA IQR ---")
Q1 = df["salario"].quantile(0.25)
Q3 = df["salario"].quantile(0.75)
IQR = Q3 - Q1
limite_inf = Q1 - 1.5 * IQR
limite_sup = Q3 + 1.5 * IQR

outliers_iqr = df[(df["salario"] < limite_inf) | (df["salario"] > limite_sup)]
print(f"  Q1: ${Q1:,.2f}  |  Q3: ${Q3:,.2f}  |  IQR: ${IQR:,.2f}")
print(f"  Limites: [{limite_inf:,.2f} , {limite_sup:,.2f}]")
print(f"  Outliers detectados: {len(outliers_iqr)}")
print(f"  Valores extremos: {sorted(outliers_iqr['salario'].tolist())}")

# ================================================
# METODO 2: Z-Score
# ================================================
print("\n--- METODO 2: Z-SCORE (umbral |z| > 3) ---")
z_scores = np.abs(stats.zscore(df["salario"]))
outliers_z = df[z_scores > 3]
print(f"  Media: ${df['salario'].mean():,.2f}  |  Std: ${df['salario'].std():,.2f}")
print(f"  Outliers detectados: {len(outliers_z)}")
print(f"  Max z-score: {z_scores.max():.2f}")

# ================================================
# METODO 3: Isolation Forest (ML - no supervisado)
# ================================================
print("\n--- METODO 3: ISOLATION FOREST ---")
iso = IsolationForest(contamination=0.05, random_state=42)
df["iso_flag"] = iso.fit_predict(df[["salario", "edad", "horas_semana"]])
outliers_iso = df[df["iso_flag"] == -1]
print(f"  Outliers detectados: {len(outliers_iso)}")
print(f"  (usa combinacion de 3 variables, no solo salario)")

# ================================================
# COMPARACION METODOS
# ================================================
print("\n--- COMPARACION DE METODOS ---")
idx_iqr = set(outliers_iqr.index)
idx_z   = set(outliers_z.index)
idx_iso = set(outliers_iso.index)
print(f"  Solo IQR:       {len(idx_iqr - idx_z - idx_iso)}")
print(f"  Solo Z-Score:   {len(idx_z - idx_iqr - idx_iso)}")
print(f"  Solo IsoForest: {len(idx_iso - idx_iqr - idx_z)}")
print(f"  Todos coinciden: {len(idx_iqr & idx_z & idx_iso)}")

# ================================================
# ESTRATEGIAS DE TRATAMIENTO
# ================================================
print("\n--- ESTRATEGIAS DE TRATAMIENTO ---")

# Opcion A: Eliminar
df_sin_outliers = df[~(z_scores > 3)].copy()
print(f"  A. Eliminar:    {len(df)} → {len(df_sin_outliers)} registros")

# Opcion B: Capear (Winsorizing)
df_capeado = df.copy()
df_capeado["salario_capeado"] = df_capeado["salario"].clip(
    lower=df_capeado["salario"].quantile(0.01),
    upper=df_capeado["salario"].quantile(0.99)
)
print(f"  B. Capear (1-99%): max antes=${df['salario'].max():,.0f}  max despues=${df_capeado['salario_capeado'].max():,.0f}")

# Opcion C: Transformar (log)
df["log_salario"] = np.log1p(df["salario"])
print(f"  C. Log transform: skew antes={df['salario'].skew():.3f}  despues={df['log_salario'].skew():.3f}")

# ================================================
# VISUALIZACION
# ================================================
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle("Deteccion de Outliers - Salarios Ecuador 2024",
             fontsize=14, fontweight="bold")

# Boxplot
axes[0, 0].boxplot(df["salario"], vert=True, patch_artist=True,
                   boxprops=dict(facecolor="#73B8E7"),
                   flierprops=dict(marker="o", color="#F0846D", markersize=6))
axes[0, 0].set_title("Boxplot — outliers como circulos")
axes[0, 0].set_ylabel("Salario (USD)")

# Histograma con limites IQR
axes[0, 1].hist(df["salario"], bins=50, color="#1F2F58", edgecolor="white", alpha=0.8)
axes[0, 1].axvline(limite_inf, color="#F0846D", lw=2, linestyle="--", label=f"Inf ${limite_inf:,.0f}")
axes[0, 1].axvline(limite_sup, color="#FBBC0C", lw=2, linestyle="--", label=f"Sup ${limite_sup:,.0f}")
axes[0, 1].set_title("Histograma con limites IQR")
axes[0, 1].set_xlabel("Salario (USD)")
axes[0, 1].legend(fontsize=8)

# Antes vs despues de eliminar
axes[1, 0].boxplot([df["salario"], df_sin_outliers["salario"]],
                   labels=["Con outliers", "Sin outliers"],
                   patch_artist=True)
axes[1, 0].set_title("Antes vs Despues de Eliminar")
axes[1, 0].set_ylabel("Salario (USD)")

# Isolation Forest: scatter
colores = df["iso_flag"].map({1: "#1F2F58", -1: "#F0846D"})
axes[1, 1].scatter(df["salario"], df["horas_semana"],
                   c=colores, alpha=0.6, s=25)
axes[1, 1].set_title("Isolation Forest (rojo = outlier)")
axes[1, 1].set_xlabel("Salario (USD)")
axes[1, 1].set_ylabel("Horas/semana")

plt.tight_layout()
plt.savefig("sesion05_outliers.png", dpi=150, bbox_inches="tight")
plt.show()

print("\nGrafico guardado: sesion05_outliers.png")
print("=" * 65)
```

3. Despues de ejecutar, decide para cada outlier detectado: es error de datos o valor real?

4. Implementa una funcion `decidir_tratamiento(valor, contexto)` que sugiera automaticamente la estrategia segun reglas de negocio Ecuador (salario minimo SBU = $460, maximo razonable = $10,000).

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Tengo un dataset de salarios en Ecuador. Identifique 9 outliers con Z-score > 3. Algunos son ejecutivos reales con salarios de $15,000 y otros parecen errores de digitacion de $50. ¿Como decido si eliminar, capear o mantener cada uno? Dame un framework de decision de 3 preguntas."

Despues de leer la respuesta:
- Aplica el framework al dataset del ejercicio.
- Documenta cada decision con un comentario en el codigo.

## Que aprendiste

- IQR: outlier si valor < Q1 - 1.5*IQR o > Q3 + 1.5*IQR. Simple y robusto.
- Z-score: outlier si |z| > 3. Asume distribucion normal — sensible a la propia skewness.
- Isolation Forest: detecta outliers multivariados con ML, no requiere supuesto de normalidad.
- Eliminar: cuando son errores claros. Capear: cuando son valores extremos reales. Transformar: cuando la distribucion completa tiene sesgo.
- Siempre investigar el contexto de negocio antes de decidir que hacer.

## Reto extra

Implementa DBSCAN (de sklearn) como cuarto metodo de deteccion de outliers. Compara sus resultados con IQR, Z-score e Isolation Forest en una tabla resumen. Prueba con epsilon=500 y min_samples=5. ¿Que ventaja tiene DBSCAN sobre los otros metodos en datos multivariados?
