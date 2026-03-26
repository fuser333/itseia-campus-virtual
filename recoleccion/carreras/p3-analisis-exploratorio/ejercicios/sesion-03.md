# Ejercicio Sesion 3: Distribucion de Variables

**Materia:** Analisis Exploratorio de Datos
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion estimada:** 30 min

## Objetivo

Identificar y visualizar la distribucion de variables continuas y categoricas en un dataset ecuatoriano, reconociendo distribuciones normales, sesgadas, bimodales y uniformes.

## Contexto

Conocer la distribucion de tus variables es critico en ciencia de datos: define que modelos usar, que transformaciones aplicar y como interpretar resultados. Un cientifico de datos que no verifica distribuciones puede cometer errores graves al modelar. En los datos del INEC Ecuador, la distribucion de ingresos es tipicamente log-normal — lo opuesto a la distribucion normal que asumen muchos modelos.

## Instrucciones

1. Crea el archivo `sesion03_distribuciones_ecuador.py`.

2. Ejecuta este codigo:

```python
# Distribuciones de Variables - ITSEIA
# Dataset: Educacion y economia Ecuador 2024
# Fuente: basado en INEC, Ministerio Educacion Ecuador

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

np.random.seed(42)

print("=" * 65)
print("DISTRIBUCION DE VARIABLES - DATOS ECUADOR 2024")
print("=" * 65)

# ================================================
# GENERACION DE DATOS SIMULADOS REALISTAS
# Basados en parametros reales Ecuador INEC 2024
# ================================================

n = 300  # tamanio muestra

# Variable 1: Ingresos (distribucion log-normal - realista Ecuador)
ingresos_log = np.random.lognormal(mean=6.4, sigma=0.8, size=n)
# mu=6.4 → mediana ~$601, sigma=0.8 → dispersion alta

# Variable 2: Edad trabajadores activos (distribucion normal)
edades = np.random.normal(loc=35, scale=8, size=n).clip(18, 65)

# Variable 3: Horas de trabajo semanal (bimodal: formal vs informal)
horas_formal = np.random.normal(40, 3, size=n // 2)
horas_informal = np.random.normal(52, 5, size=n // 2)
horas_trabajo = np.concatenate([horas_formal, horas_informal])

# Variable 4: Anios de educacion (discreta)
niveles_edu = np.random.choice(
    [6, 9, 12, 15, 17, 19],       # primaria, basica, bachillerato, tec, uni, posgrado
    p=[0.08, 0.12, 0.35, 0.15, 0.25, 0.05],
    size=n
)

# Variable 5: Sector (categorica)
sectores = np.random.choice(
    ["agricultura", "comercio", "tecnologia", "manufactura", "salud", "educacion"],
    p=[0.22, 0.28, 0.10, 0.18, 0.12, 0.10],
    size=n
)

df = pd.DataFrame({
    "ingresos": ingresos_log,
    "edad": edades,
    "horas_semana": horas_trabajo,
    "anios_educacion": niveles_edu,
    "sector": sectores
})

# ================================================
# PRUEBA DE NORMALIDAD (Shapiro-Wilk)
# ================================================
print("\n--- PRUEBA DE NORMALIDAD (Shapiro-Wilk, p < 0.05 = NO normal) ---")
for col in ["ingresos", "edad", "horas_semana"]:
    stat, p = stats.shapiro(df[col].sample(50, random_state=42))
    resultado = "NO NORMAL" if p < 0.05 else "NORMAL"
    print(f"  {col:<18}: stat={stat:.4f}, p={p:.4f}  → {resultado}")

# ================================================
# TRANSFORMACION LOG para ingresos
# ================================================
df["log_ingresos"] = np.log(df["ingresos"])

print("\n--- ESTADISTICAS ANTES Y DESPUES DE LOG ---")
for col in ["ingresos", "log_ingresos"]:
    print(f"  {col:<18}: media={df[col].mean():.2f}  skew={df[col].skew():.3f}")

# ================================================
# DISTRIBUCION CATEGORICA
# ================================================
print("\n--- DISTRIBUCION SECTOR (variable categorica) ---")
conteo = df["sector"].value_counts()
for sector, cnt in conteo.items():
    pct = cnt / n * 100
    barra = "#" * int(pct / 2)
    print(f"  {sector:<15}: {cnt:>3} ({pct:.1f}%) {barra}")

# ================================================
# VISUALIZACION: 6 graficos de distribuciones
# ================================================
fig, axes = plt.subplots(2, 3, figsize=(15, 9))
fig.suptitle("Distribuciones de Variables - Ecuador 2024",
             fontsize=14, fontweight="bold")

# 1. Ingresos (log-normal)
axes[0, 0].hist(df["ingresos"], bins=40, color="#1F2F58",
                edgecolor="white", alpha=0.8)
axes[0, 0].set_title("Ingresos (log-normal)")
axes[0, 0].set_xlabel("USD/mes")
axes[0, 0].axvline(df["ingresos"].mean(), color="#FBBC0C", lw=2, label="Media")
axes[0, 0].axvline(df["ingresos"].median(), color="#F0846D", lw=2, label="Mediana")
axes[0, 0].legend(fontsize=8)

# 2. Log(Ingresos)
axes[0, 1].hist(df["log_ingresos"], bins=30, color="#73B8E7",
                edgecolor="white", alpha=0.8)
axes[0, 1].set_title("Log(Ingresos) - post transformacion")
axes[0, 1].set_xlabel("ln(USD/mes)")

# 3. Edades (normal)
axes[0, 2].hist(df["edad"], bins=25, color="#FBBC0C",
                edgecolor="white", alpha=0.8)
x_norm = np.linspace(18, 65, 100)
y_norm = stats.norm.pdf(x_norm, df["edad"].mean(), df["edad"].std())
ax_twin = axes[0, 2].twinx()
ax_twin.plot(x_norm, y_norm, color="#1F2F58", lw=2)
axes[0, 2].set_title("Edad (aprox. normal)")
axes[0, 2].set_xlabel("Anos")

# 4. Horas (bimodal)
axes[1, 0].hist(df["horas_semana"], bins=30, color="#F0846D",
                edgecolor="white", alpha=0.8)
axes[1, 0].set_title("Horas/semana (bimodal: formal vs informal)")
axes[1, 0].set_xlabel("Horas")

# 5. Anios educacion (discreta)
conteo_edu = pd.Series(df["anios_educacion"]).value_counts().sort_index()
axes[1, 1].bar(conteo_edu.index, conteo_edu.values,
               color="#1F2F58", edgecolor="white", alpha=0.85)
axes[1, 1].set_title("Anios de educacion (discreta)")
axes[1, 1].set_xlabel("Anios")

# 6. Sector (categorica)
conteo_sec = df["sector"].value_counts()
axes[1, 2].barh(conteo_sec.index, conteo_sec.values,
                color="#73B8E7", edgecolor="white")
axes[1, 2].set_title("Distribucion por sector")
axes[1, 2].set_xlabel("Frecuencia")

plt.tight_layout()
plt.savefig("sesion03_distribuciones.png", dpi=150, bbox_inches="tight")
plt.show()

print("\nGrafico guardado: sesion03_distribuciones.png")
print("=" * 65)
```

3. Ejecuta y analiza cada grafico. Responde en comentarios del codigo:
   - Que distribucion tiene cada variable?
   - Cual necesita transformacion antes de usar en un modelo lineal?

4. Aplica la prueba de Kolmogorov-Smirnov (de scipy) como alternativa a Shapiro-Wilk para muestras grandes.

## Usa IA para...

> Abre Gemini (gemini.google.com) y escribe:
> "Tengo una variable de ingresos en Ecuador con asimetria positiva fuerte (skew = 2.3). ¿Que transformaciones matematicas puedo aplicar para normalizarla antes de usar regresion lineal? Explica log, raiz cuadrada y Box-Cox con sus ventajas."

Despues de leer la respuesta:
- Aplica las tres transformaciones a la variable `ingresos` de tu dataset.
- Compara la asimetria antes y despues de cada transformacion.

## Que aprendiste

- Una distribucion describe como se reparten los valores de una variable.
- La distribucion normal tiene skew=0; positiva tiene cola derecha (ingresos, precios).
- La distribucion bimodal revela dos subpoblaciones mezcladas.
- `stats.shapiro()` prueba normalidad: p < 0.05 rechaza normalidad.
- `np.log()` transforma distribuciones log-normales a normales.
- Variables categoricas se analizan con frecuencias y proporciones, no con medias.

## Reto extra

Toma la variable de ingresos y aplica el test de Anderson-Darling (`scipy.stats.anderson`) para verificar si sigue una distribucion log-normal, exponencial o normal. Reporta los resultados con sus niveles de significancia y explica que implica para un modelo de prediccion de salarios.
