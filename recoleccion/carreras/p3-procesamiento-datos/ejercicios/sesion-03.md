# Ejercicio Sesion 3: Transformacion de Datos con Pandas Avanzado

**Materia:** Procesamiento de Datos
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion estimada:** 40 min

## Objetivo

Dominar las transformaciones avanzadas de pandas: `melt`, `pivot`, `stack/unstack`, `apply` con funciones complejas, `groupby` con funciones personalizadas, y `merge` con multiples tipos de join, sobre datos del sector agricola ecuatoriano.

## Contexto

Los datos del MAGAP vienen en formatos distintos segun el anio: algunos en formato "ancho" (una columna por mes), otros en formato "largo" (una fila por mes). Saber transformar entre estos formatos con pandas es esencial para construir pipelines que consolidan multiples fuentes con estructuras heterogeneas.

## Instrucciones

1. Crea el archivo `sesion03_pandas_avanzado_ecuador.py`:

```python
# Pandas Avanzado: Transformaciones - ITSEIA
# melt, pivot, stack, apply, groupby avanzado
# Dataset: produccion agricola MAGAP Ecuador

import pandas as pd
import numpy as np

np.random.seed(2026)
print("=" * 65)
print("PANDAS AVANZADO — PRODUCCION AGRICOLA ECUADOR")
print("=" * 65)

# ================================================
# DATOS EN FORMATO ANCHO (wide format)
# Como vienen del MAGAP: una columna por mes
# ================================================
df_ancho = pd.DataFrame({
    "provincia":    ["Pichincha","Guayas","Manabi","Los Rios","Tungurahua"],
    "cultivo":      ["papa","arroz","maiz","banano","brocolí"],
    "area_ha":      [12500, 45000, 38000, 62000, 8500],
    "ene_2024": [11200, 41000, 34000, 58000, 7800],
    "feb_2024": [10800, 40500, 35000, 60000, 8200],
    "mar_2024": [12100, 43000, 36500, 62500, 9000],
    "abr_2024": [11900, 42000, 37000, 63000, 8800],
    "may_2024": [12400, 44500, 38000, 65000, 9200],
    "jun_2024": [11700, 43500, 36800, 64000, 8900],
})
print(f"Formato ancho: {df_ancho.shape}")
print(df_ancho.to_string(index=False))

# ================================================
# MELT: ancho → largo (long format)
# ================================================
print("\n--- MELT: WIDE → LONG FORMAT ---")
meses_cols = [c for c in df_ancho.columns if c.endswith("_2024")]
df_largo = df_ancho.melt(
    id_vars=["provincia", "cultivo", "area_ha"],
    value_vars=meses_cols,
    var_name="mes_codigo",
    value_name="produccion_tm"
)
df_largo["mes"] = df_largo["mes_codigo"].str.replace("_2024","").str.title()
df_largo = df_largo.drop(columns=["mes_codigo"]).sort_values(["provincia","mes"])
print(f"Formato largo: {df_largo.shape}")
print(df_largo.head(10).to_string(index=False))

# ================================================
# PIVOT: largo → ancho (inverso de melt)
# ================================================
print("\n--- PIVOT TABLE: LARGO → ANCHO ---")
pivot_result = df_largo.pivot_table(
    values="produccion_tm",
    index=["provincia","cultivo"],
    columns="mes",
    aggfunc="mean"
).round(0)
print(pivot_result.to_string())

# ================================================
# APPLY CON FUNCION COMPLEJA
# ================================================
print("\n--- APPLY: FUNCION COMPLEJA POR FILA ---")

def clasificar_productor(row):
    """Clasifica provincia como pequeno/mediano/grande productor."""
    area = row["area_ha"]
    prod_media = row["produccion_tm"]
    rendimiento = prod_media / area if area > 0 else 0

    if area > 50000:
        escala = "gran_productor"
    elif area > 15000:
        escala = "mediano_productor"
    else:
        escala = "pequeno_productor"

    rendimiento_cat = "alto" if rendimiento > 0.9 else ("medio" if rendimiento > 0.7 else "bajo")

    return pd.Series({
        "escala": escala,
        "rendimiento_relativo": round(rendimiento, 3),
        "categoria_rendimiento": rendimiento_cat
    })

df_largo["produccion_tm_media"] = df_largo.groupby("provincia")["produccion_tm"].transform("mean")
df_largo_enriquecido = df_largo.join(
    df_largo.apply(
        lambda row: clasificar_productor({
            "area_ha": row["area_ha"],
            "produccion_tm": row["produccion_tm"]
        }), axis=1
    )
)
print(df_largo_enriquecido[["provincia","cultivo","escala","rendimiento_relativo"]].drop_duplicates().to_string(index=False))

# ================================================
# GROUPBY AVANZADO: funciones personalizadas
# ================================================
print("\n--- GROUPBY AVANZADO ---")

# 1. Agregaciones multiples
agg_provincia = df_largo.groupby("provincia").agg(
    produccion_total=("produccion_tm","sum"),
    produccion_max=("produccion_tm","max"),
    produccion_min=("produccion_tm","min"),
    variabilidad=("produccion_tm","std"),
    meses_activos=("mes","count")
).round(2)
print("Agregaciones por provincia:")
print(agg_provincia.to_string())

# 2. Transform: normalizar dentro de cada cultivo
print("\n  Normalizacion por cultivo (z-score):")
df_largo["produccion_zscore"] = df_largo.groupby("cultivo")["produccion_tm"].transform(
    lambda x: (x - x.mean()) / x.std()
).round(3)
print(df_largo[["provincia","cultivo","produccion_tm","produccion_zscore"]].head(10).to_string(index=False))

# 3. Rolling windows por provincia
print("\n  Promedio movil 3 meses por provincia:")
df_rolling = df_largo.copy()
df_rolling["prod_rolling3"] = df_rolling.groupby("provincia")["produccion_tm"].transform(
    lambda x: x.rolling(3, min_periods=1).mean()
).round(0)
print(df_rolling[["provincia","mes","produccion_tm","prod_rolling3"]].head(12).to_string(index=False))

# ================================================
# MERGES AVANZADOS
# ================================================
print("\n--- MERGES AVANZADOS ---")

# Dataset precios por cultivo
df_precios = pd.DataFrame({
    "cultivo":    ["papa","arroz","maiz","banano","brocolí","tomate","cacao"],
    "precio_kg":  [0.45, 0.35, 0.28, 0.18, 0.65, 0.55, 2.80],
    "unidad":     ["kg"]*7
})

# INNER JOIN: solo cultivos con precio
merge_inner = df_ancho.merge(df_precios, on="cultivo", how="inner")
print(f"  INNER JOIN: {len(merge_inner)} filas (solo cultivos con precio)")

# LEFT JOIN: todos los cultivos del MAGAP, precio si existe
merge_left = df_ancho.merge(df_precios, on="cultivo", how="left")
print(f"  LEFT JOIN:  {len(merge_left)} filas | NaN precios: {merge_left['precio_kg'].isna().sum()}")

# Calcular valor de produccion
df_valor = merge_inner.copy()
df_valor["valor_produccion"] = (df_valor["area_ha"] * df_valor["precio_kg"]).round(0)
print("\n  Valor de produccion estimado por provincia:")
print(df_valor[["provincia","cultivo","area_ha","precio_kg","valor_produccion"]].to_string(index=False))

print("\n" + "=" * 65)
print("PANDAS AVANZADO — OPERACIONES DOMINADAS:")
print("  melt():        wide → long (desnormalizar)")
print("  pivot_table(): long → wide con agregacion")
print("  apply():       funcion compleja por fila o columna")
print("  groupby().agg(): multiples agregaciones")
print("  .transform():  operacion que mantiene el shape original")
print("  .rolling():    ventana movil temporal")
print("  .merge():      joins SQL-style entre DataFrames")
print("=" * 65)
```

2. Ejecuta y analiza el pivot resultante.

3. Implementa una transformacion adicional: calcular el "indice de estacionalidad" por mes para cada cultivo (produccion del mes / promedio anual del cultivo).

## Usa IA para...

> Abre Gemini y escribe:
> "Tengo datos agricolas Ecuador en formato largo (provincia, cultivo, mes, produccion_tm). ¿Como calculo el indice de Herfindahl para medir la concentracion de produccion por provincia? ¿Y como creo un ranking de provincias por diversificacion agricola? Dame el codigo pandas."

Despues de leer la respuesta:
- Implementa el indice de Herfindahl para los datos del ejercicio.
- Interpreta el resultado: que provincia tiene la produccion mas concentrada?

## Que aprendiste

- `melt()` transforma formato ancho (wide) a largo (long): de columnas a filas.
- `pivot_table()` hace lo inverso: de filas a columnas con agregacion.
- `apply(funcion, axis=1)` aplica una funcion a cada fila del DataFrame.
- `groupby().transform()` aplica una operacion dentro de cada grupo manteniendo el shape.
- `rolling(n).mean()` calcula el promedio movil de n periodos.
- `merge(how='left')` conserva todos los registros del DataFrame izquierdo.

## Reto extra

Implementa un pipeline de "consolidacion de fuentes heterogeneas": tienes 3 CSVs del MAGAP con el mismo tipo de datos pero distinto formato (uno wide por anio, uno long, uno con columnas en espanol e ingles mezclados). Escribe una funcion `normalizar_fuente(df, formato)` que estandarice cualquier fuente al formato largo canonical y luego consolida los 3 en un unico DataFrame sin duplicados.
