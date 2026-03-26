# Ejercicio Sesion 1: EDA — Que es y por que importa

**Materia:** Analisis Exploratorio de Datos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 25 min

## Objetivo

Comprender que es el Analisis Exploratorio de Datos (EDA), para que sirve en proyectos reales, y ejecutar un primer EDA de 5 pasos sobre un dataset ecuatoriano real.

## Contexto

El EDA es el primer paso obligatorio en cualquier proyecto de ciencia de datos. Antes de entrenar modelos o hacer predicciones, necesitas entender tus datos: cuantos son, que tipos tienen, si hay errores, que distribuciones siguen. Empresas como el INEC Ecuador publican datasets masivos — sin EDA, esos datos son ruido. Con EDA, son conocimiento.

## Instrucciones

1. Crea un archivo `sesion01_eda_intro_ecuador.py` o abre Google Colab.

2. Instala las librerias si es necesario: `pip install pandas matplotlib seaborn`.

3. Ejecuta este codigo paso a paso:

```python
# EDA Introduccion - ITSEIA Ciencia de Datos
# Dataset: Datos simulados basados en INEC Ecuador 2024
# Sesion 1: Los 5 pasos del EDA

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

print("=" * 60)
print("ANALISIS EXPLORATORIO DE DATOS - EDA")
print("Dataset: Mercado Laboral Ecuador 2024 (INEC)")
print("=" * 60)

# ================================================
# DATOS: muestra representativa del mercado laboral
# basada en estructura ENEMDU INEC Ecuador
# ================================================
data = {
    "provincia": ["Pichincha","Guayas","Azuay","Manabi","Tungurahua",
                  "Pichincha","Guayas","Azuay","Loja","El Oro",
                  "Pichincha","Guayas","Imbabura","Chimborazo","Cotopaxi"],
    "edad": [28, 35, 42, 31, 27, 45, 38, 29, 33, 41,
             24, 52, 36, 30, 48],
    "nivel_educacion": ["universitario","universitario","posgrado","bachillerato",
                        "universitario","posgrado","bachillerato","universitario",
                        "bachillerato","universitario","universitario","posgrado",
                        "bachillerato","universitario","bachillerato"],
    "sector": ["tecnologia","comercio","salud","agricultura","textil",
               "tecnologia","comercio","educacion","agricultura","mineria",
               "tecnologia","banca","textil","agricultura","comercio"],
    "salario_mensual": [1850, 620, 2100, 450, 750, 3200, 580, 1100, 420, 980,
                        2400, 4100, 680, 510, 590],
    "horas_semana": [40, 48, 44, 52, 45, 38, 50, 40, 60, 48,
                     42, 35, 46, 55, 50],
    "satisfaccion": [4, 3, 5, 2, 3, 5, 2, 4, 2, 3, 4, 5, 3, 2, 3]
}

df = pd.DataFrame(data)

# ================================================
# PASO 1: DIMENSIONES
# ================================================
print("\n--- PASO 1: DIMENSIONES DEL DATASET ---")
print(f"Filas:    {df.shape[0]}")
print(f"Columnas: {df.shape[1]}")
print(f"Tamanio total: {df.size} celdas")

# ================================================
# PASO 2: TIPOS DE DATOS
# ================================================
print("\n--- PASO 2: TIPOS DE DATOS ---")
print(df.dtypes)
print(f"\nVariables numericas: {df.select_dtypes('number').columns.tolist()}")
print(f"Variables categoricas: {df.select_dtypes('object').columns.tolist()}")

# ================================================
# PASO 3: PRIMERAS Y ULTIMAS FILAS
# ================================================
print("\n--- PASO 3: MUESTRA DE DATOS ---")
print("Primeras 3 filas:")
print(df.head(3).to_string())
print("\nUltimas 3 filas:")
print(df.tail(3).to_string())

# ================================================
# PASO 4: VALORES NULOS
# ================================================
print("\n--- PASO 4: VALORES NULOS ---")
nulos = df.isnull().sum()
print(nulos)
print(f"\nDataset limpio: {'SI' if nulos.sum() == 0 else 'NO - revisar!'}")

# ================================================
# PASO 5: ESTADISTICAS BASICAS
# ================================================
print("\n--- PASO 5: ESTADISTICAS BASICAS ---")
print(df.describe().round(2).to_string())

# ================================================
# VISUALIZACION: distribucion de salarios
# ================================================
fig, axes = plt.subplots(1, 2, figsize=(12, 4))
fig.suptitle("EDA - Mercado Laboral Ecuador 2024", fontsize=13, fontweight="bold")

df["salario_mensual"].hist(bins=8, ax=axes[0], color="#1F2F58", edgecolor="white")
axes[0].set_title("Distribucion de Salarios")
axes[0].set_xlabel("Salario mensual (USD)")
axes[0].set_ylabel("Frecuencia")

df["sector"].value_counts().plot(kind="bar", ax=axes[1],
                                  color="#FBBC0C", edgecolor="white")
axes[1].set_title("Trabajadores por Sector")
axes[1].set_xlabel("Sector")
axes[1].set_ylabel("Cantidad")
axes[1].tick_params(axis="x", rotation=45)

plt.tight_layout()
plt.savefig("sesion01_eda_ecuador.png", dpi=150, bbox_inches="tight")
plt.show()
print("\nGrafico guardado: sesion01_eda_ecuador.png")

print("\n" + "=" * 60)
print("RESUMEN EDA - 5 PASOS COMPLETADOS")
print(f"  1. Dimensiones:    {df.shape[0]} filas x {df.shape[1]} columnas")
print(f"  2. Tipos datos:    {len(df.dtypes)} columnas analizadas")
print(f"  3. Muestra:        head() y tail() revisados")
print(f"  4. Nulos:          {df.isnull().sum().sum()} valores faltantes")
print(f"  5. Estadisticas:   describe() ejecutado")
print("=" * 60)
```

4. Ejecuta el codigo completo y observa cada salida.

5. Modifica el dataset: agrega 5 filas mas con datos de provincias que faltan (Esmeraldas, Santa Elena, Orellana, Sucumbios, Napo).

## Usa IA para...

> Abre ChatGPT y escribe exactamente esto:
> "Soy estudiante de Ciencia de Datos. Explica el EDA en 5 pasos concretos. Para cada paso di: que hago, con que funcion de pandas, y que pregunta respondo. Da un ejemplo breve de cada uno."

Despues de leer la respuesta:
- Compara los 5 pasos que ChatGPT describe con los del codigo.
- Identifica si el codigo tiene algun paso adicional o faltante.

## Que aprendiste

- EDA es el proceso de entender un dataset antes de modelar.
- `df.shape` devuelve (filas, columnas).
- `df.dtypes` muestra el tipo de cada columna.
- `df.isnull().sum()` detecta valores faltantes columna por columna.
- `df.describe()` entrega estadisticas de todas las variables numericas.
- `df.head()` y `df.tail()` muestran muestras del dataset.

## Reto extra

Carga el dataset real de ENEMDU del INEC desde `https://www.ecuadorencifras.gob.ec` (formato CSV disponible en datos abiertos). Ejecuta los 5 pasos del EDA sobre ese dataset real y reporta: cuantas filas tiene, cuantos valores nulos, y cual es el salario promedio nacional segun los datos.
