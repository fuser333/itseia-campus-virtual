# Ejercicio Sesion 5: Spark DataFrames — Operaciones con Datos Grandes

**Materia:** Ecosistema Big Data (Hadoop/Spark)
**Nivel:** Intermedio
**Herramienta IA:** Copilot
**Duracion estimada:** 45 min

## Objetivo

Usar Spark DataFrames para realizar operaciones de transformacion, limpieza, agrupacion y joins sobre datasets grandes, aprovechando el optimizador Catalyst de Spark que hace DataFrames hasta 5x mas eficientes que los RDDs para datos estructurados.

## Contexto

El Censo Nacional de Ecuador 2022 del INEC recopilo informacion de mas de 4 millones de viviendas y 18 millones de personas. Analizar ese dataset con Pandas en un computador normal puede tomar minutos o fallar por memoria. Con Spark DataFrames, el mismo analisis se distribuye automaticamente entre los nucleos del procesador y escala a cualquier tamano de cluster. Ademas, la sintaxis es muy similar a Pandas, lo que acelera la curva de aprendizaje.

## Instrucciones

1. Abre Google Colab (con PySpark instalado de la sesion anterior) y crea `sesion05_spark_dataframes.ipynb`:

```python
# ITSEIA - Ecosistema Big Data - Sesion 5
# Spark DataFrames: operaciones con datos grandes

from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import (StructType, StructField, StringType,
                                IntegerType, FloatType, DateType)
from pyspark.sql.window import Window
import pandas as pd
import numpy as np
import random
from datetime import date, timedelta

spark = SparkSession.builder \
    .appName("ITSEIA-DataFrames-Sesion5") \
    .config("spark.sql.shuffle.partitions", "4") \
    .getOrCreate()

print(f"Spark {spark.version} iniciado")
```

2. Crea datasets simulados del Censo Ecuador 2022:

```python
# ============================================================
# GENERAR DATASET CENSO SIMULADO (500K registros)
# ============================================================

random.seed(2022)
n = 500_000

provincias_info = {
    'Pichincha': ('Sierra', 0.18),
    'Guayas': ('Costa', 0.25),
    'Azuay': ('Sierra', 0.07),
    'Manabi': ('Costa', 0.09),
    'Tungurahua': ('Sierra', 0.05),
    'El Oro': ('Costa', 0.05),
    'Loja': ('Sierra', 0.05),
    'Esmeraldas': ('Costa', 0.04),
    'Imbabura': ('Sierra', 0.04),
    'Otras': ('Mixta', 0.18)
}

provincias = list(provincias_info.keys())
pesos = [v[1] for v in provincias_info.values()]

# Generar datos del censo
datos = {
    'id_persona': [f"EC{i:08d}" for i in range(n)],
    'provincia': random.choices(provincias, weights=pesos, k=n),
    'edad': [random.choices(
        range(0, 100),
        weights=[max(0.1, 3-abs(a-25)*0.05) for a in range(100)]
    )[0] for _ in range(n)],
    'sexo': random.choices(['Masculino', 'Femenino'], weights=[0.491, 0.509], k=n),
    'nivel_educacion': random.choices(
        ['Ninguno', 'Primaria', 'Secundaria', 'Superior', 'Postgrado'],
        weights=[0.05, 0.25, 0.38, 0.28, 0.04], k=n
    ),
    'condicion_empleo': random.choices(
        ['Empleado_Publico', 'Empleado_Privado', 'Independiente', 'Desempleado', 'Inactivo'],
        weights=[0.15, 0.32, 0.22, 0.05, 0.26], k=n
    ),
    'ingreso_mensual': [
        round(max(0, random.gauss(520, 280)), 2) for _ in range(n)
    ],
    'tiene_internet': random.choices([1, 0], weights=[0.58, 0.42], k=n),
    'tipo_vivienda': random.choices(
        ['Casa', 'Departamento', 'Cuarto', 'Mediagua', 'Otra'],
        weights=[0.55, 0.20, 0.08, 0.12, 0.05], k=n
    ),
    'etnia': random.choices(
        ['Mestizo', 'Indigena', 'Montubio', 'Afroecuatoriano', 'Blanco', 'Otro'],
        weights=[0.718, 0.070, 0.076, 0.075, 0.061, 0.003], k=n  # INEC 2022
    )
}

# Crear Spark DataFrame desde diccionario Python
pdf = pd.DataFrame(datos)
df_censo = spark.createDataFrame(pdf)

print(f"DataFrame Censo Ecuador (simulado INEC 2022):")
print(f"  Filas: {df_censo.count():,}")
print(f"  Columnas: {len(df_censo.columns)}")
df_censo.printSchema()
```

3. Operaciones basicas de exploracion:

```python
# ============================================================
# EXPLORACION INICIAL
# ============================================================

print("\n--- Primeras filas ---")
df_censo.show(5, truncate=False)

print("\n--- Estadisticas descriptivas ---")
df_censo.select('edad', 'ingreso_mensual', 'tiene_internet').describe().show()

# Equivalente a value_counts() de Pandas
print("\n--- Distribucion por provincia ---")
df_censo.groupBy('provincia') \
    .count() \
    .withColumn('pct', F.round(F.col('count') / n * 100, 1)) \
    .orderBy('count', ascending=False) \
    .show()
```

4. Transformaciones y limpieza:

```python
# ============================================================
# TRANSFORMACIONES Y LIMPIEZA
# ============================================================

print("\n--- Limpieza y transformacion ---")

# 1. Agregar columna de region
from pyspark.sql.functions import when

df_limpio = df_censo \
    .withColumn('region',
        when(F.col('provincia').isin(['Pichincha','Azuay','Tungurahua','Loja','Imbabura']),
             'Sierra')
        .when(F.col('provincia').isin(['Guayas','Manabi','El Oro','Esmeraldas']),
              'Costa')
        .otherwise('Otra')
    ) \
    .withColumn('grupo_edad',
        when(F.col('edad') < 18, 'Menor')
        .when(F.col('edad') < 30, 'Joven_18_29')
        .when(F.col('edad') < 50, 'Adulto_30_49')
        .when(F.col('edad') < 65, 'Adulto_Mayor_50_64')
        .otherwise('Tercera_Edad')
    ) \
    .withColumn('pea',  # Poblacion Economicamente Activa
        when((F.col('edad') >= 18) & (F.col('edad') <= 64) &
             (F.col('condicion_empleo').isin(['Empleado_Publico','Empleado_Privado',
                                              'Independiente','Desempleado'])), 1)
        .otherwise(0)
    ) \
    .withColumn('ingreso_mensual',
        # Limpiar: poner 0 a inactivos y menores
        when(F.col('condicion_empleo') == 'Inactivo', 0.0)
        .when(F.col('edad') < 15, 0.0)
        .otherwise(F.col('ingreso_mensual'))
    )

print("Columnas agregadas: region, grupo_edad, pea")
df_limpio.select('id_persona','provincia','region','grupo_edad','pea').show(5)

# 2. Filtrar PEA (trabajadores activos)
df_pea = df_limpio.filter(F.col('pea') == 1)
print(f"\nPEA total: {df_pea.count():,} personas ({df_pea.count()/n*100:.1f}% de la poblacion)")
```

5. Analisis avanzado con groupBy, agg y Window Functions:

```python
# ============================================================
# ANALISIS AVANZADO
# ============================================================

# Ingreso promedio por nivel educativo
print("\n--- Ingreso promedio por nivel educativo ---")
df_pea.filter(F.col('ingreso_mensual') > 0) \
    .groupBy('nivel_educacion') \
    .agg(
        F.count('*').alias('personas'),
        F.round(F.avg('ingreso_mensual'), 2).alias('ingreso_promedio'),
        F.round(F.stddev('ingreso_mensual'), 2).alias('desv_std'),
        F.round(F.percentile_approx('ingreso_mensual', 0.5), 2).alias('mediana')
    ) \
    .orderBy('ingreso_promedio', ascending=False) \
    .show()

# Tasa de acceso a internet por provincia y nivel educativo
print("\n--- Acceso a internet por provincia (top 6) ---")
df_limpio.groupBy('provincia') \
    .agg(
        F.round(F.avg('tiene_internet') * 100, 1).alias('pct_internet'),
        F.count('*').alias('poblacion')
    ) \
    .orderBy('pct_internet', ascending=False) \
    .show(6)

# Window Function: ranking de ingreso dentro de cada provincia
print("\n--- Ranking ingreso dentro de cada region ---")
windowSpec = Window.partitionBy('region').orderBy(F.desc('ingreso_mensual'))
df_ranking = df_pea.filter(F.col('ingreso_mensual') > 0) \
    .withColumn('rank_region', F.rank().over(windowSpec)) \
    .filter(F.col('rank_region') <= 3) \
    .select('region', 'provincia', 'nivel_educacion', 'condicion_empleo',
            'ingreso_mensual', 'rank_region') \
    .orderBy('region', 'rank_region')
df_ranking.show(12)

# Pivot: distribucion de condicion de empleo por region
print("\n--- Pivot: empleo por region ---")
df_limpio.filter(F.col('pea') == 1) \
    .groupBy('region') \
    .pivot('condicion_empleo') \
    .count() \
    .show()

# Guardar resultado como Parquet (formato columnar optimo para Big Data)
df_limpio.write.mode('overwrite').parquet('/tmp/censo_ecuador_procesado')
print("\nResultado guardado en formato Parquet (columnar, comprimido)")
print("Parquet es 5-10x mas rapido que CSV para consultas analiticas")

spark.stop()
print("\nSparkSession cerrada.")
```

6. Compara en una celda de texto: ¿Cuales son las 3 principales diferencias entre un Spark DataFrame y un Pandas DataFrame? ¿En que situacion preferirías cada uno?

## Usa IA para...

> Abre GitHub Copilot y empieza a escribir este comentario en una celda nueva:
> `# Calcular el indice de GINI de ingresos por provincia en el DataFrame del censo Ecuador`

Observa las sugerencias de Copilot y acepta o corrige la implementacion. El indice de GINI mide desigualdad (0 = perfecta igualdad, 1 = perfecta desigualdad).

## Que aprendiste

- `spark.createDataFrame(pandas_df)` convierte un Pandas DataFrame a Spark para escalar a millones de filas.
- `withColumn()` con `when().otherwise()` es el equivalente Spark de `np.where()` o `apply()` en Pandas.
- `groupBy().agg()` permite calcular multiples estadisticas en una sola pasada sobre los datos distribuidos.
- `Window.partitionBy().orderBy()` habilita funciones de ventana (rank, lag, lead) sobre grupos de datos.
- Parquet es el formato de almacenamiento ideal para Big Data: columnar, comprimido y con esquema embebido.

## Reto extra

Combina el DataFrame del censo con un segundo DataFrame que contenga el PIB per capita por provincia (genera 10 filas con datos aproximados: Pichincha $8,200, Guayas $7,100, etc.). Haz un `join` por provincia, luego calcula la correlacion entre PIB per capita y porcentaje de acceso a internet por provincia. Muestra el resultado ordenado por correlacion.
