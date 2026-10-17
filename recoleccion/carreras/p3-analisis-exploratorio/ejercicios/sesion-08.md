# Ejercicio Sesion 8: Proyecto EDA Completo — Datos Ecuador INEC

**Materia:** Analisis Exploratorio de Datos
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 90 min

## Objetivo

Realizar un EDA completo de principio a fin sobre un dataset simulado con estructura real del INEC Ecuador, integrando todos los pasos aprendidos: estadisticas descriptivas, distribuciones, correlaciones, outliers, faltantes y feature engineering, produciendo un reporte ejecutivo.

## Contexto

Este es el ejercicio integrador de la materia. Simulas el rol de Analista de Datos en el INEC Ecuador que recibe los microdatos de la encuesta ENEMDU 2024 y debe preparar un reporte para el Ministerio de Economia. El dataset tiene todos los problemas del mundo real: outliers, faltantes, categorias mal codificadas y variables que necesitan transformacion.

## Instrucciones

1. Crea el archivo `sesion08_eda_proyecto_inec_ecuador.py`.

2. Ejecuta el codigo del proyecto completo:

```python
# PROYECTO EDA COMPLETO - ITSEIA
# Simulacion ENEMDU INEC Ecuador 2024
# Analista: [Tu nombre]
# Objetivo: Reporte condiciones laborales Ecuador

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import seaborn as sns
from scipy import stats
from sklearn.impute import KNNImputer
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
plt.rcParams["figure.facecolor"] = "#F9F6E7"

print("=" * 70)
print("PROYECTO EDA — ENEMDU INEC ECUADOR 2024")
print("Analisis Exploratorio Completo")
print("=" * 70)

# ============================================================
# FASE 1: CARGA Y DESCRIPCION INICIAL
# ============================================================
print("\n[FASE 1] CARGA Y DESCRIPCION INICIAL")
n = 500

provincias = {
    "Pichincha": 0.22, "Guayas": 0.20, "Azuay": 0.08,
    "Manabi": 0.12, "Los Rios": 0.06, "Tungurahua": 0.07,
    "Imbabura": 0.05, "Loja": 0.05, "El Oro": 0.06,
    "Chimborazo": 0.05, "Cotopaxi": 0.04
}

df = pd.DataFrame({
    "id": range(1, n + 1),
    "provincia": np.random.choice(
        list(provincias.keys()),
        p=list(provincias.values()), size=n
    ),
    "area": np.random.choice(["urbano", "rural"], p=[0.64, 0.36], size=n),
    "sexo": np.random.choice(["hombre", "mujer"], p=[0.50, 0.50], size=n),
    "edad": np.random.randint(15, 65, n),
    "estado_civil": np.random.choice(
        ["soltero","casado","union_libre","divorciado","viudo"],
        p=[0.28, 0.40, 0.18, 0.09, 0.05], size=n
    ),
    "nivel_educacion": np.random.choice(
        ["sin_instruccion","primaria","basica","bachillerato",
         "tecnico","universitario","posgrado"],
        p=[0.03, 0.10, 0.14, 0.38, 0.12, 0.19, 0.04], size=n
    ),
    "sector_economico": np.random.choice(
        ["agricultura","manufactura","comercio","construccion",
         "transporte","educacion","salud","tecnologia","servicios","otro"],
        p=[0.18, 0.10, 0.22, 0.08, 0.07, 0.08, 0.06, 0.05, 0.10, 0.06], size=n
    ),
    "condicion_ocupacion": np.random.choice(
        ["empleado_privado","empleado_publico","cuenta_propia",
         "patrono","no_remunerado"],
        p=[0.40, 0.13, 0.32, 0.08, 0.07], size=n
    ),
    "horas_semana": np.random.normal(42, 12, n).clip(1, 84).round(0),
})

# Ingresos: log-normal con efecto educacion
edu_bonus = {"sin_instruccion": 0, "primaria": 0.3, "basica": 0.5,
             "bachillerato": 0.8, "tecnico": 1.1, "universitario": 1.5, "posgrado": 2.0}
bonus = df["nivel_educacion"].map(edu_bonus)
df["ingreso_mensual"] = (
    np.random.lognormal(6.0 + bonus * 0.3, 0.5, n) * 0.8
).clip(50, 8000).round(2)

# Ajuste: sector publico gana mas
mask_pub = df["condicion_ocupacion"] == "empleado_publico"
df.loc[mask_pub, "ingreso_mensual"] *= 1.3

# Inyectar problemas reales:
# - Outliers: 8 salarios imposibles
idx_out = np.random.choice(n, 8, replace=False)
df.loc[idx_out[:4], "ingreso_mensual"] = np.random.choice([25000, 30000, 18000, 22000], 4)
df.loc[idx_out[4:], "ingreso_mensual"] = np.random.choice([10, 20, 30], 4)

# - Faltantes: 12% ingresos, 8% horas, 5% educacion
df.loc[np.random.choice(n, int(n * 0.12), replace=False), "ingreso_mensual"] = np.nan
df.loc[np.random.choice(n, int(n * 0.08), replace=False), "horas_semana"] = np.nan
df.loc[np.random.choice(n, int(n * 0.05), replace=False), "nivel_educacion"] = np.nan

# - Errores de codificacion categorica
mask_err = np.random.choice(n, 5, replace=False)
df.loc[mask_err, "sexo"] = np.random.choice(["Hombre", "MUJER", "m", "f"], 5)

print(f"  Dataset: {df.shape[0]} filas x {df.shape[1]} columnas")
print(f"  Tipos: {df.dtypes.value_counts().to_dict()}")

# ============================================================
# FASE 2: LIMPIEZA Y CALIDAD DE DATOS
# ============================================================
print("\n[FASE 2] LIMPIEZA Y CALIDAD")

# Estandarizar categorias mal codificadas
df["sexo"] = df["sexo"].str.lower().str.strip()
df["sexo"] = df["sexo"].replace({"m": "hombre", "f": "mujer",
                                  "hombre": "hombre", "mujer": "mujer"})
print(f"  sexo estandarizado: {df['sexo'].value_counts().to_dict()}")

# Reporte faltantes
falt = df.isnull().sum()
falt_pct = (falt / n * 100).round(1)
print("\n  Faltantes por columna:")
for c in falt[falt > 0].index:
    print(f"    {c:<25}: {falt[c]:>3} ({falt_pct[c]:>5.1f}%)")

# Tratamiento outliers: capear salarios extremos con Winsorizing
q99 = df["ingreso_mensual"].quantile(0.99)
q01 = df["ingreso_mensual"].quantile(0.01)
df["ingreso_limpio"] = df["ingreso_mensual"].clip(lower=q01, upper=q99)

# Imputar faltantes
imp = KNNImputer(n_neighbors=5)
cols_imp = ["ingreso_limpio", "horas_semana"]
df[cols_imp] = imp.fit_transform(df[cols_imp])

# Imputar educacion con moda
moda_edu = df["nivel_educacion"].mode()[0]
df["nivel_educacion"] = df["nivel_educacion"].fillna(moda_edu)

print(f"\n  Faltantes despues de limpieza: {df.isnull().sum().sum()}")

# ============================================================
# FASE 3: ANALISIS DESCRIPTIVO
# ============================================================
print("\n[FASE 3] ANALISIS DESCRIPTIVO")

print("\n  INGRESOS (despues de limpieza):")
print(f"    Media:    ${df['ingreso_limpio'].mean():,.2f}")
print(f"    Mediana:  ${df['ingreso_limpio'].median():,.2f}")
print(f"    Std:      ${df['ingreso_limpio'].std():,.2f}")
print(f"    Min:      ${df['ingreso_limpio'].min():,.2f}")
print(f"    Max:      ${df['ingreso_limpio'].max():,.2f}")
print(f"    Skewness: {df['ingreso_limpio'].skew():.3f}")

SBU = 460
bajo_sbu = (df["ingreso_limpio"] < SBU).sum()
print(f"\n    Personas bajo SBU ($460): {bajo_sbu} ({bajo_sbu/n*100:.1f}%)")

# Ingreso promedio por provincia
print("\n  INGRESO PROMEDIO POR PROVINCIA (Top 5):")
prov_ingreso = df.groupby("provincia")["ingreso_limpio"].agg(["mean","median","count"]).round(2)
prov_ingreso.columns = ["media", "mediana", "n"]
print(prov_ingreso.sort_values("media", ascending=False).head(5).to_string())

# Brecha de genero
print("\n  BRECHA DE GENERO:")
brecha = df.groupby("sexo")["ingreso_limpio"].median()
if "hombre" in brecha.index and "mujer" in brecha.index:
    dif = brecha["hombre"] - brecha["mujer"]
    pct_brecha = dif / brecha["hombre"] * 100
    print(f"    Mediana hombre: ${brecha['hombre']:,.2f}")
    print(f"    Mediana mujer:  ${brecha['mujer']:,.2f}")
    print(f"    Brecha:         ${dif:,.2f} ({pct_brecha:.1f}%)")

# ============================================================
# FASE 4: FEATURE ENGINEERING
# ============================================================
print("\n[FASE 4] FEATURE ENGINEERING")

# Educacion ordinal
edu_ord = {"sin_instruccion": 0, "primaria": 1, "basica": 2,
           "bachillerato": 3, "tecnico": 4, "universitario": 5, "posgrado": 6}
df["educacion_nivel"] = df["nivel_educacion"].map(edu_ord)

# Variables derivadas
df["log_ingreso"] = np.log1p(df["ingreso_limpio"])
df["ingreso_por_hora"] = (df["ingreso_limpio"] / (df["horas_semana"] * 4.33)).round(3)
df["es_urbano"] = (df["area"] == "urbano").astype(int)
df["es_sector_formal"] = df["condicion_ocupacion"].isin(
    ["empleado_privado", "empleado_publico"]
).astype(int)
df["rango_salarial"] = pd.cut(df["ingreso_limpio"],
    bins=[0, 460, 800, 1500, 3000, 99999],
    labels=["bajo","basico","medio","alto","premium"])

print(f"  Features creadas: educacion_nivel, log_ingreso, ingreso_por_hora,")
print(f"                    es_urbano, es_sector_formal, rango_salarial")

# ============================================================
# FASE 5: CORRELACIONES
# ============================================================
print("\n[FASE 5] CORRELACIONES")
num_cols = ["ingreso_limpio", "educacion_nivel", "edad",
            "horas_semana", "es_urbano", "es_sector_formal"]
corr = df[num_cols].corr()
print("\n  Correlaciones con ingreso_limpio:")
corr_ing = corr["ingreso_limpio"].drop("ingreso_limpio").sort_values(key=abs, ascending=False)
for col, val in corr_ing.items():
    signo = "+" if val > 0 else ""
    print(f"    {col:<22}: r={signo}{val:.3f}")

# ============================================================
# FASE 6: DASHBOARD DE VISUALIZACION
# ============================================================
fig = plt.figure(figsize=(18, 14))
fig.suptitle("PROYECTO EDA — ENEMDU INEC Ecuador 2024\nAnalisis Exploratorio Completo",
             fontsize=15, fontweight="bold", y=0.98)

gs = gridspec.GridSpec(3, 3, figure=fig, hspace=0.45, wspace=0.35)

# 1. Distribucion ingresos
ax1 = fig.add_subplot(gs[0, 0])
ax1.hist(df["ingreso_limpio"], bins=40, color="#1F2F58", edgecolor="white", alpha=0.85)
ax1.axvline(df["ingreso_limpio"].median(), color="#FBBC0C", lw=2, label=f"Mediana ${df['ingreso_limpio'].median():.0f}")
ax1.axvline(460, color="#F0846D", lw=1.5, linestyle="--", label="SBU $460")
ax1.set_title("Distribucion de Ingresos")
ax1.set_xlabel("USD/mes")
ax1.legend(fontsize=7)

# 2. Boxplot por sector
ax2 = fig.add_subplot(gs[0, 1:])
top_sectores = df.groupby("sector_economico")["ingreso_limpio"].median().nlargest(6).index
df_top = df[df["sector_economico"].isin(top_sectores)]
df_top.boxplot(column="ingreso_limpio", by="sector_economico", ax=ax2)
ax2.set_title("Ingresos por Sector (Top 6)")
ax2.set_xlabel("")
ax2.set_ylabel("USD/mes")
plt.sca(ax2)
plt.xticks(rotation=25, fontsize=8)
plt.title("")

# 3. Heatmap correlaciones
ax3 = fig.add_subplot(gs[1, 0])
mask = np.triu(np.ones_like(corr, dtype=bool))
sns.heatmap(corr, ax=ax3, annot=True, fmt=".2f", cmap="coolwarm",
            center=0, mask=mask, linewidths=0.5,
            annot_kws={"size": 7}, cbar_kws={"shrink": 0.8})
ax3.set_title("Correlaciones")
ax3.tick_params(axis="both", labelsize=7)

# 4. Brecha genero por provincia
ax4 = fig.add_subplot(gs[1, 1:])
brecha_prov = df.groupby(["provincia", "sexo"])["ingreso_limpio"].median().unstack()
if "hombre" in brecha_prov.columns and "mujer" in brecha_prov.columns:
    brecha_prov["brecha"] = brecha_prov["hombre"] - brecha_prov["mujer"]
    brecha_prov_sorted = brecha_prov["brecha"].sort_values(ascending=False).dropna()
    brecha_prov_sorted.plot(kind="bar", ax=ax4, color="#73B8E7", edgecolor="white")
    ax4.set_title("Brecha Salarial Genero por Provincia")
    ax4.set_xlabel("")
    ax4.set_ylabel("Diferencia mediana (USD)")
    ax4.tick_params(axis="x", rotation=30, labelsize=8)

# 5. Distribucion nivel educacion
ax5 = fig.add_subplot(gs[2, 0])
edu_cnt = df["nivel_educacion"].value_counts()
ax5.pie(edu_cnt.values, labels=edu_cnt.index, autopct="%1.0f%%",
        textprops={"fontsize": 7})
ax5.set_title("Nivel de Educacion")

# 6. Ingreso por nivel educacion
ax6 = fig.add_subplot(gs[2, 1])
edu_ing = df.groupby("nivel_educacion")["ingreso_limpio"].median().reindex(
    list(edu_ord.keys())
).dropna()
ax6.bar(range(len(edu_ing)), edu_ing.values, color="#FBBC0C", edgecolor="white")
ax6.set_xticks(range(len(edu_ing)))
ax6.set_xticklabels(edu_ing.index, rotation=35, fontsize=7)
ax6.set_title("Mediana ingreso por educacion")
ax6.set_ylabel("USD/mes")

# 7. Urbano vs rural
ax7 = fig.add_subplot(gs[2, 2])
area_ing = df.groupby("area")["ingreso_limpio"].agg(["median", "mean"])
area_ing.plot(kind="bar", ax=ax7, color=["#1F2F58","#FBBC0C"], edgecolor="white")
ax7.set_title("Ingreso Urbano vs Rural")
ax7.set_ylabel("USD/mes")
ax7.tick_params(axis="x", rotation=0)
ax7.legend(["Mediana","Media"], fontsize=8)

plt.savefig("sesion08_proyecto_eda_inec.png", dpi=150, bbox_inches="tight")
plt.show()

# ============================================================
# REPORTE EJECUTIVO
# ============================================================
print("\n" + "=" * 70)
print("REPORTE EJECUTIVO — ENEMDU INEC ECUADOR 2024")
print("=" * 70)
print(f"  Muestra analizada:      {n:,} encuestas")
print(f"  Faltantes tratados:     {falt.sum()} valores (KNN + moda)")
print(f"  Outliers tratados:      Winsorizing 1%-99%")
print(f"  Ingreso mediano:        ${df['ingreso_limpio'].median():,.2f}")
print(f"  Bajo SBU ($460):        {bajo_sbu} personas ({bajo_sbu/n*100:.1f}%)")
print(f"  Sector mejor pagado:    {df.groupby('sector_economico')['ingreso_limpio'].median().idxmax()}")
print(f"  Provincia mejor pagada: {df.groupby('provincia')['ingreso_limpio'].median().idxmax()}")
print(f"  Correlacion edu-ingreso:{corr.loc['educacion_nivel','ingreso_limpio']:+.3f}")
print("=" * 70)
```

3. Ejecuta el proyecto completo. Analiza el dashboard de 7 graficos.

4. Extiende el reporte ejecutivo con:
   - Porcentaje que trabaja mas de 48 horas (sobreempleo segun OIT).
   - Tasa de empleo formal vs informal.
   - Correlacion entre horas trabajadas y nivel de satisfaccion.

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Soy analista de datos en el INEC Ecuador. Acabo de completar un EDA de 500 encuestas ENEMDU. Ingreso mediano $650, 31% bajo SBU, brecha genero 18%, tecnologia es el sector mejor pagado. Redacta para mi un parrafo ejecutivo de 100 palabras para el Ministro de Economia, con hallazgos clave y 2 recomendaciones de politica publica."

Despues de leer la respuesta:
- Ajusta el parrafo con los datos reales que obtuviste en tu dataset.
- Agrega el parrafo como comentario al final del codigo.

## Que aprendiste

- Un EDA completo tiene 6 fases: carga, limpieza, descriptivo, features, correlaciones, visualizacion.
- Los datos reales siempre tienen errores de codificacion, outliers y faltantes — la limpieza es el 40% del trabajo.
- KNN imputer preserva mejor las correlaciones que la imputacion por media.
- Winsorizing es mas conservadora que eliminar: mantiene el n pero acota extremos.
- La brecha salarial de genero es verificable con datos: no es opinion, es medicion.
- Un dashboard de 6-8 graficos comunica el EDA completo mejor que tablas de texto.

## Reto extra

Descarga el dataset real ENEMDU de https://www.ecuadorencifras.gob.ec/empleo-desempleo-y-subempleo/ (disponible en CSV). Adapta el pipeline de este ejercicio para correr sobre los datos reales. Identifica las 3 diferencias mas importantes entre los resultados simulados y los datos reales. Redacta una hipotesis que explique cada diferencia.
