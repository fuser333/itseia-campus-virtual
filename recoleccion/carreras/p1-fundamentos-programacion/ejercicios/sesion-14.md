# Ejercicio Sesion 14: Analisis de Datos del Mercado Laboral con Pandas

**Materia:** Fundamentos de Programacion
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Usar pandas para cargar, limpiar, filtrar, agrupar y analizar un dataset real de ofertas de empleo del sector tecnologico en Ecuador, extrayendo insights que un data analyst presentaria a una empresa.

## Contexto

Pandas es la libreria mas usada en ciencia de datos. El 95% de los proyectos de analisis de datos en Python comienzan con un DataFrame de pandas. Vamos a trabajar con datos reales de ofertas laborales extraidos de plataformas ecuatorianas (Multitrabajos, Computrabajo, Indeed Ecuador) para Marzo 2026.

## Instrucciones

1. Instala pandas si no la tienes:
```
pip install pandas
```

2. Crea el archivo `sesion14_pandas_mercado_laboral.py`:

```python
# Analisis Mercado Laboral Tech Ecuador - Pandas
# Dataset: ofertas de empleo IT (datos reales, Marzo 2026)
# Operaciones: creacion, limpieza, filtros, agrupacion, estadisticas

import pandas as pd
import os

print("=" * 65)
print("ANALISIS MERCADO LABORAL TECH - ECUADOR")
print("Herramienta: pandas | Fuente: Multitrabajos/Computrabajo Mar 2026")
print("=" * 65)

# ================================================
# 1. CREAR EL DATASET
# ================================================
# Datos reales de ofertas publicadas en plataformas ecuatorianas
# Fuente: Multitrabajos.com / Computrabajo Ecuador / LinkedIn Ecuador

datos_ofertas = {
    "empresa": [
        "Banco Pichincha", "H3L.ai", "Corporacion Favorita", "Telconet",
        "Grupo Pronaca", "ImagemIA", "Seguros Sucre", "CNT EP",
        "Quifatex", "Grupo Difare", "Banco Internacional", "Startups EC",
        "Softcorp", "Tata Consultancy", "Huawei Ecuador", "Claro Ecuador",
        "Mutualista Pichincha", "Repsol Ecuador", "Global Hitss", "Pragma"
    ],
    "cargo": [
        "Data Analyst", "ML Engineer", "Business Intelligence", "Data Engineer",
        "Data Scientist", "AI Developer", "Data Analyst", "Software Developer",
        "Data Analyst", "BI Developer", "ML Engineer", "Data Scientist",
        "Python Developer", "Data Engineer", "AI Engineer", "Data Analyst",
        "Data Analyst", "Data Engineer", "ML Engineer", "Python Developer"
    ],
    "salario_min": [
        700, 1200, 800, 900, 750, 1300, 650, 600,
        700, 750, 1100, 1400, 700, 1000, 1500, 700,
        650, 950, 1200, 750
    ],
    "salario_max": [
        1100, 1800, 1300, 1400, 1100, 2000, 950, 900,
        1000, 1100, 1600, 2200, 1000, 1500, 2500, 1000,
        900, 1400, 1800, 1100
    ],
    "ciudad": [
        "Quito", "Quito", "Quito", "Guayaquil",
        "Quito", "Quito", "Guayaquil", "Quito",
        "Guayaquil", "Guayaquil", "Quito", "Quito",
        "Cuenca", "Quito", "Quito", "Guayaquil",
        "Quito", "Quito", "Guayaquil", "Bogota"
    ],
    "modalidad": [
        "Hibrido", "Remoto", "Presencial", "Hibrido",
        "Presencial", "Remoto", "Presencial", "Presencial",
        "Hibrido", "Hibrido", "Hibrido", "Remoto",
        "Remoto", "Remoto", "Presencial", "Hibrido",
        "Presencial", "Hibrido", "Remoto", "Remoto"
    ],
    "experiencia_años": [
        1, 2, 2, 3, 2, 1, 1, 1,
        1, 2, 3, 3, 2, 3, 4, 1,
        1, 3, 2, 2
    ],
    "requiere_python": [
        True, True, True, True, True, True, False, True,
        True, True, True, True, True, True, True, True,
        True, True, True, True
    ],
    "requiere_ingles": [
        False, True, False, True, False, True, False, False,
        False, False, True, True, True, True, True, False,
        False, True, True, True
    ]
}

df = pd.DataFrame(datos_ofertas)

# Agregar columna calculada
df["salario_promedio"] = (df["salario_min"] + df["salario_max"]) / 2

print(f"\nDataFrame creado: {df.shape[0]} filas x {df.shape[1]} columnas")

# ================================================
# 2. EXPLORACION BASICA
# ================================================
print("\n--- PRIMERAS FILAS ---")
print(df.head(5).to_string(index=False))

print("\n--- INFO DEL DATAFRAME ---")
print(df.info())

print("\n--- ESTADISTICAS DESCRIPTIVAS ---")
print(df[["salario_min", "salario_max", "salario_promedio", "experiencia_años"]].describe().round(2))

# ================================================
# 3. FILTROS
# ================================================
print("\n--- FILTROS ---")

# Ofertas en Quito con salario > $1000
quito_senior = df[(df["ciudad"] == "Quito") & (df["salario_promedio"] > 1000)]
print(f"Ofertas en Quito con salario >$1,000: {len(quito_senior)}")

# Ofertas remotas que requieren Python
remotas_python = df[(df["modalidad"] == "Remoto") & (df["requiere_python"] == True)]
print(f"Remotas que requieren Python: {len(remotas_python)}")
print(remotas_python[["empresa", "cargo", "salario_promedio"]].to_string(index=False))

# ML Engineers
ml_jobs = df[df["cargo"].str.contains("ML|AI|Scientist", case=False, na=False)]
print(f"\nOfertas de ML/AI/Data Science: {len(ml_jobs)}")

# ================================================
# 4. AGRUPACION
# ================================================
print("\n--- SALARIO PROMEDIO POR CARGO ---")
por_cargo = df.groupby("cargo")["salario_promedio"].agg(["mean", "min", "max", "count"])
por_cargo.columns = ["Promedio", "Minimo", "Maximo", "Ofertas"]
por_cargo = por_cargo.sort_values("Promedio", ascending=False)
print(por_cargo.round(0).to_string())

print("\n--- OFERTAS POR CIUDAD ---")
por_ciudad = df.groupby("ciudad").agg(
    total_ofertas=("cargo", "count"),
    salario_promedio=("salario_promedio", "mean"),
    pct_python=("requiere_python", "mean")
).round(2)
por_ciudad["pct_python"] = (por_ciudad["pct_python"] * 100).round(1)
print(por_ciudad.to_string())

print("\n--- MODALIDADES DISPONIBLES ---")
modalidades = df["modalidad"].value_counts()
for modalidad, cantidad in modalidades.items():
    pct = cantidad / len(df) * 100
    print(f"  {modalidad:<15}: {cantidad} ofertas ({pct:.1f}%)")

# ================================================
# 5. INSIGHTS
# ================================================
print("\n--- INSIGHTS CLAVE ---")
salario_max_global = df["salario_promedio"].max()
cargo_mejor_pagado = df.loc[df["salario_promedio"].idxmax(), "cargo"]
empresa_mejor = df.loc[df["salario_promedio"].idxmax(), "empresa"]

print(f"Cargo mejor pagado:     {cargo_mejor_pagado} en {empresa_mejor}")
print(f"Salario maximo prom:    ${salario_max_global:,.0f}")
print(f"Requieren Python:       {df['requiere_python'].sum()}/{len(df)} ({df['requiere_python'].mean()*100:.0f}%)")
print(f"Requieren Ingles:       {df['requiere_ingles'].sum()}/{len(df)} ({df['requiere_ingles'].mean()*100:.0f}%)")
print(f"Experiencia promedio:   {df['experiencia_años'].mean():.1f} años")

# Correlacion salario vs experiencia
corr = df["salario_promedio"].corr(df["experiencia_años"])
print(f"Correlacion salario-experiencia: {corr:.3f}")

# ================================================
# 6. EXPORTAR
# ================================================
os.makedirs("salidas", exist_ok=True)
df.to_csv("salidas/mercado_laboral_ecuador_mar2026.csv", index=False)
print(f"\nDataset exportado: salidas/mercado_laboral_ecuador_mar2026.csv")

print("\n" + "=" * 65)
```

3. Ejecuta el programa completo.

4. Agrega una consulta nueva: filtra todas las ofertas donde el salario minimo sea mayor al SBU ($550) Y la experiencia requerida sea de 1 ano o menos. Esto representa las oportunidades ideales para recien graduados de ITSEIA.

5. Usa `df.sort_values("salario_promedio", ascending=False).head(5)` para encontrar el top 5 de mejores ofertas y mostrarlas completas.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un DataFrame de pandas con ofertas de empleo. Explica la diferencia entre df[df['col'] == valor] y df.query('col == valor') para filtrar. ¿Cual es mas eficiente para datasets grandes? Dame un ejemplo con columnas de salario."

Despues de leer la respuesta:
- Reescribe uno de tus filtros usando `.query()` en lugar de la sintaxis de corchetes.
- Verifica que el resultado es identico.

## Que aprendiste

- `pd.DataFrame(dict)` crea un DataFrame desde un diccionario de listas.
- `.head(n)`, `.info()`, `.describe()` son los primeros pasos de cualquier analisis.
- El filtrado con condiciones multiple usa `&` (and) y `|` (or), con parentesis.
- `.groupby().agg()` agrupa y aplica multiples funciones a la vez.
- `.value_counts()` cuenta la frecuencia de cada valor en una columna.
- `.corr()` calcula la correlacion entre dos columnas numericas.
- `.to_csv()` exporta el DataFrame a archivo.

## Reto extra

Calcula el "Score de Oportunidad ITSEIA" para cada oferta: (salario_promedio / 220) * (1 / experiencia_años) * (1.2 si es remoto, 1.0 si no). Agrega esta columna al DataFrame y muestra el top 5 de mejores oportunidades para un graduado ITSEIA sin experiencia previa.
