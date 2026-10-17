# Ejercicio Sesion 4: Correlaciones y Heatmaps

**Materia:** Analisis Exploratorio de Datos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Calcular matrices de correlacion, visualizar heatmaps, interpretar coeficientes de Pearson y Spearman, y detectar relaciones lineales y no lineales entre variables del mercado laboral ecuatoriano.

## Contexto

La correlacion mide si dos variables se mueven juntas. En ciencia de datos es fundamental para seleccionar features, detectar multicolinealidad y entender relaciones en los datos. En el contexto laboral ecuatoriano: años de educacion correlaciona positivamente con salario, pero esa correlacion varia por sector. Con un heatmap lo ves en segundos.

## Instrucciones

1. Crea el archivo `sesion04_correlaciones_ecuador.py`.

2. Ejecuta el siguiente codigo:

```python
# Correlaciones y Heatmaps - ITSEIA
# Dataset: Condiciones laborales Ecuador 2024
# Fuente: estructura ENEMDU INEC

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

np.random.seed(2026)
print("=" * 65)
print("CORRELACIONES Y HEATMAPS - MERCADO LABORAL ECUADOR")
print("=" * 65)

# ================================================
# DATASET: 150 trabajadores Ecuador
# Variables continuas correlacionadas realistas
# ================================================
n = 150
edades = np.random.randint(22, 60, n)
anios_edu = np.random.normal(13, 3, n).clip(6, 20).astype(int)

# Salario correlaciona con educacion (r≈0.65) y experiencia
experiencia = (edades - anios_edu - 5).clip(0, 35)
salario = (
    300
    + anios_edu * 95
    + experiencia * 35
    + np.random.normal(0, 250, n)
).clip(400, 6000)

# Productividad correlaciona con educacion y salario
productividad = (
    0.3 * anios_edu
    + 0.0002 * salario
    + np.random.normal(5, 1.5, n)
).clip(2, 10)

# Horas de trabajo: correlacion negativa con salario (informal trabaja mas)
horas = (55 - 0.003 * salario + np.random.normal(0, 5, n)).clip(20, 80)

# Satisfaccion laboral (1-5)
satisfaccion = (
    1
    + 0.0003 * salario
    + 0.1 * productividad
    + np.random.normal(0, 0.5, n)
).clip(1, 5)

df = pd.DataFrame({
    "edad": edades,
    "anios_educacion": anios_edu,
    "experiencia_laboral": experiencia,
    "salario_mensual": salario.round(0),
    "productividad": productividad.round(2),
    "horas_semana": horas.round(1),
    "satisfaccion": satisfaccion.round(1)
})

# ================================================
# CORRELACION DE PEARSON (variables numericas)
# ================================================
print("\n--- MATRIZ DE CORRELACION DE PEARSON ---")
corr_pearson = df.corr(method="pearson")
print(corr_pearson.round(3).to_string())

# ================================================
# CORRELACION DE SPEARMAN (monotona, robusta)
# ================================================
print("\n--- MATRIZ DE CORRELACION DE SPEARMAN ---")
corr_spearman = df.corr(method="spearman")
print(corr_spearman.round(3).to_string())

# ================================================
# TOP CORRELACIONES CON SALARIO
# ================================================
print("\n--- TOP CORRELACIONES CON SALARIO (Pearson) ---")
corr_salario = corr_pearson["salario_mensual"].drop("salario_mensual")
corr_ord = corr_salario.abs().sort_values(ascending=False)
for col in corr_ord.index:
    val = corr_salario[col]
    fuerza = "FUERTE" if abs(val) >= 0.5 else ("MODERADA" if abs(val) >= 0.3 else "DEBIL")
    direccion = "positiva" if val > 0 else "negativa"
    print(f"  {col:<25}: r={val:+.3f}  [{fuerza} {direccion}]")

# ================================================
# PRUEBA DE SIGNIFICANCIA ESTADISTICA
# ================================================
print("\n--- SIGNIFICANCIA ESTADISTICA (p-value) ---")
for col in ["anios_educacion", "experiencia_laboral", "horas_semana"]:
    r, p = stats.pearsonr(df[col], df["salario_mensual"])
    sig = "SIGNIFICATIVA" if p < 0.05 else "no significativa"
    print(f"  {col:<25}: r={r:+.3f}, p={p:.4f}  → {sig}")

# ================================================
# VISUALIZACION: heatmaps y scatter
# ================================================
fig, axes = plt.subplots(1, 3, figsize=(18, 6))
fig.suptitle("Correlaciones - Mercado Laboral Ecuador 2024",
             fontsize=14, fontweight="bold")

# Heatmap Pearson
mask = np.triu(np.ones_like(corr_pearson, dtype=bool))
sns.heatmap(corr_pearson, ax=axes[0], annot=True, fmt=".2f",
            cmap="coolwarm", center=0, mask=mask,
            linewidths=0.5, square=True, annot_kws={"size": 8})
axes[0].set_title("Heatmap Pearson\n(triangulo inferior)")
axes[0].tick_params(axis="x", rotation=45, labelsize=8)
axes[0].tick_params(axis="y", rotation=0, labelsize=8)

# Heatmap Spearman
sns.heatmap(corr_spearman, ax=axes[1], annot=True, fmt=".2f",
            cmap="YlOrRd", center=0, linewidths=0.5, square=True,
            annot_kws={"size": 8})
axes[1].set_title("Heatmap Spearman\n(todas las correlaciones)")
axes[1].tick_params(axis="x", rotation=45, labelsize=8)
axes[1].tick_params(axis="y", rotation=0, labelsize=8)

# Scatter: educacion vs salario
axes[2].scatter(df["anios_educacion"], df["salario_mensual"],
                alpha=0.5, color="#1F2F58", s=30)
# Linea de tendencia
z = np.polyfit(df["anios_educacion"], df["salario_mensual"], 1)
p_line = np.poly1d(z)
x_line = np.linspace(df["anios_educacion"].min(), df["anios_educacion"].max(), 100)
axes[2].plot(x_line, p_line(x_line), color="#FBBC0C", lw=2.5,
             label=f"Tendencia (r={corr_pearson.loc['anios_educacion','salario_mensual']:.2f})")
axes[2].set_title("Educacion vs Salario")
axes[2].set_xlabel("Anios de educacion")
axes[2].set_ylabel("Salario mensual (USD)")
axes[2].legend()

plt.tight_layout()
plt.savefig("sesion04_correlaciones.png", dpi=150, bbox_inches="tight")
plt.show()

print("\nGrafico guardado: sesion04_correlaciones.png")
print("=" * 65)
```

3. Analiza el heatmap e identifica el par de variables con correlacion mas alta y mas baja.

4. Agrega una nueva variable `distancia_trabajo_km` generada de forma aleatoria y analiza si correlaciona con satisfaccion.

## Usa IA para...

> Abre ChatGPT y escribe:
> "En mi analisis EDA encontre que 'anios_educacion' y 'experiencia_laboral' tienen correlacion 0.78 entre si, y ambas correlacionan con 'salario'. ¿Esto es multicolinealidad? ¿Es un problema si voy a usar regresion lineal? ¿Que debo hacer?"

Despues de leer la respuesta:
- Calcula el VIF (Variance Inflation Factor) para las variables de tu dataset.
- Decide cuales eliminar si vas a construir un modelo de regresion.

## Que aprendiste

- Pearson mide correlacion lineal; Spearman mide correlacion monotona (robusta a outliers).
- r = +1 correlacion perfecta positiva; r = -1 perfecta negativa; r = 0 sin correlacion lineal.
- El heatmap visualiza toda la matriz de correlaciones de golpe.
- El p-value decide si la correlacion es estadisticamente significativa.
- Multicolinealidad: dos features correlacionadas entre si pueden causar problemas en modelos lineales.
- `seaborn.heatmap()` con `annot=True` muestra los valores dentro del mapa.

## Reto extra

Divide el dataset en dos grupos: sector tecnologia vs resto. Calcula la matriz de correlacion para cada grupo por separado. ¿Cambia la correlacion educacion-salario segun el sector? Muestra ambos heatmaps lado a lado y redacta una interpretacion de 3 lineas para un ejecutivo de recursos humanos ecuatoriano.
