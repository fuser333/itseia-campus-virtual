# Ejercicio Sesion 8: Proyecto — Procesar Dataset Grande con PySpark

**Materia:** Ecosistema Big Data (Hadoop/Spark)
**Nivel:** Intermedio
**Herramienta IA:** Claude + ChatGPT
**Duracion estimada:** 50 min

## Objetivo

Construir un pipeline completo de Big Data con PySpark que procese un dataset de mas de 1 millon de registros del Ecuador, aplicando las fases de ingesta, limpieza, transformacion, analisis con Spark SQL, y exportacion de resultados en formato Parquet, demostrando dominio end-to-end del ecosistema Spark.

## Contexto

Este es el proyecto integrador del modulo Ecosistema Big Data. Debes simular el trabajo de un ingeniero de datos en el equipo de analytics del Banco Central del Ecuador (BCE). La tarea: procesar el dataset de transacciones del sistema de pagos SENRED (Sistema Nacional de Registro de Transacciones), identificar patrones de la economia ecuatoriana y generar un reporte ejecutivo que pueda presentarse a las autoridades del BCE.

## Instrucciones

1. Abre Google Colab y crea `proyecto_final_bigdata_bce.ipynb`. Instala y configura:

```python
# ITSEIA - Ecosistema Big Data - Sesion 8 (PROYECTO FINAL)
# Pipeline completo con PySpark: Dataset BCE Ecuador

!pip install pyspark --quiet
!pip install matplotlib seaborn --quiet

from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import *
from pyspark.sql.window import Window
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import random
import time
import os

spark = SparkSession.builder \
    .appName("BCE-Ecuador-Analytics") \
    .config("spark.driver.memory", "3g") \
    .config("spark.sql.shuffle.partitions", "8") \
    .config("spark.sql.adaptive.enabled", "true") \
    .getOrCreate()

spark.sparkContext.setLogLevel("ERROR")
print(f"Pipeline BCE Ecuador iniciado. Spark {spark.version}")
print(f"Cores: {spark.sparkContext.defaultParallelism}")
```

2. Fase 1: Generacion e ingesta del dataset (1M+ registros):

```python
# ============================================================
# FASE 1: INGESTA
# Dataset SENRED simulado: transacciones interbancarias Ecuador
# ============================================================

print("\n" + "="*60)
print("FASE 1: INGESTA DEL DATASET SENRED")
print("="*60)

random.seed(2024)
N = 1_200_000  # 1.2 millones de transacciones

t0 = time.time()

bancos = {
    'BP': 'Banco Pichincha', 'BG': 'Banco Guayaquil',
    'PP': 'Produbanco', 'BPP': 'Banco Pacifico',
    'BI': 'Banco Internacional', 'RB': 'Rumiñahui',
    'BNF': 'BanEcuador', 'CFN': 'CFN'
}
banco_ids = list(bancos.keys())

tipos_tx = ['TRANSFERENCIA_INTERBANCARIA', 'PAGO_NOMINA', 'PAGO_PROVEEDOR',
            'CREDITO_DESEMBOLSO', 'REMESA_RECIBIDA', 'PAGO_IMPUESTO_SRI',
            'BONO_GOBIERNO', 'COMERCIO_EXTERIOR']

provincias = ['Pichincha','Guayas','Azuay','Manabi','El Oro',
              'Tungurahua','Loja','Imbabura','Esmeraldas','Chimborazo',
              'Sucumbios','Orellana','Santo_Domingo','Santa_Elena','Bolivar']

# Generar en chunks para eficiencia de memoria
chunk_size = 200_000
chunks_pd = []

for chunk in range(N // chunk_size):
    n_chunk = chunk_size
    fecha_base = pd.date_range('2023-01-01', '2024-12-31', periods=n_chunk)

    chunk_df = pd.DataFrame({
        'tx_id': [f"SENRED{chunk*chunk_size+i:010d}" for i in range(n_chunk)],
        'fecha': fecha_base.strftime('%Y-%m-%d'),
        'anio': fecha_base.year,
        'mes': fecha_base.month,
        'dia_semana': fecha_base.dayofweek,
        'hora': np.random.randint(0, 24, n_chunk),
        'banco_origen': np.random.choice(banco_ids, n_chunk),
        'banco_destino': np.random.choice(banco_ids, n_chunk),
        'provincia_origen': np.random.choice(provincias, n_chunk,
            p=[0.22,0.26,0.07,0.08,0.05,0.06,0.04,0.05,0.03,0.04,0.03,0.02,0.03,0.01,0.01]),
        'provincia_destino': np.random.choice(provincias, n_chunk),
        'tipo_transaccion': np.random.choice(tipos_tx,
            n_chunk, p=[0.35,0.20,0.15,0.10,0.08,0.06,0.04,0.02]),
        'monto': np.round(np.random.lognormal(7.5, 1.8, n_chunk).clip(1, 5_000_000), 2),
        'estado': np.random.choice(['EXITOSA','RECHAZADA','PENDIENTE'],
            n_chunk, p=[0.93, 0.05, 0.02]),
        'es_empresa': np.random.choice([1, 0], n_chunk, p=[0.60, 0.40])
    })
    chunks_pd.append(chunk_df)
    print(f"  Chunk {chunk+1}/{N//chunk_size} generado: {n_chunk:,} registros")

df_pd = pd.concat(chunks_pd, ignore_index=True)
t_gen = time.time() - t0
print(f"\nDataset generado: {len(df_pd):,} registros en {t_gen:.1f}s")

# Crear Spark DataFrame
t0 = time.time()
df_senred = spark.createDataFrame(df_pd)
df_senred = df_senred.repartition(8)  # Distribuir en 8 particiones
df_senred.cache()  # Cachear para multiples operaciones
_ = df_senred.count()  # Forzar materializacion del cache
t_spark = time.time() - t0
print(f"DataFrame Spark creado y cacheado en {t_spark:.1f}s")
print(f"Particiones: {df_senred.rdd.getNumPartitions()}")
df_senred.printSchema()
```

3. Fase 2: Limpieza y validacion:

```python
# ============================================================
# FASE 2: LIMPIEZA Y VALIDACION DE CALIDAD
# ============================================================

print("\n" + "="*60)
print("FASE 2: LIMPIEZA Y CONTROL DE CALIDAD")
print("="*60)

# Reporte de calidad
total = df_senred.count()
nulos = {col: df_senred.filter(F.col(col).isNull()).count()
         for col in df_senred.columns}
print("\n--- Valores nulos por columna ---")
for col, n_nulos in nulos.items():
    if n_nulos > 0:
        print(f"  {col}: {n_nulos:,} ({n_nulos/total*100:.2f}%)")
    else:
        print(f"  {col}: OK")

# Verificar transacciones con mismo banco origen-destino
mismos_bancos = df_senred.filter(F.col('banco_origen') == F.col('banco_destino')).count()
print(f"\nTransacciones intrabancarias (mismo banco): {mismos_bancos:,} ({mismos_bancos/total*100:.1f}%)")

# Detectar montos anomalos (outliers extremos)
stats = df_senred.select(
    F.percentile_approx('monto', 0.99).alias('p99'),
    F.percentile_approx('monto', 0.999).alias('p999'),
    F.max('monto').alias('max_monto')
).first()
print(f"\nEstadisticas de monto:")
print(f"  Percentil 99: ${stats['p99']:,.2f}")
print(f"  Percentil 99.9: ${stats['p999']:,.2f}")
print(f"  Maximo: ${stats['max_monto']:,.2f}")

# Limpiar: filtrar solo exitosas y montos razonables
df_limpio = df_senred \
    .filter(F.col('estado') == 'EXITOSA') \
    .filter(F.col('monto') > 0) \
    .filter(F.col('monto') <= 2_000_000) \
    .withColumn('trimestre', ((F.col('mes') - 1) / 3).cast('int') + 1) \
    .withColumn('es_fin_semana', F.when(F.col('dia_semana') >= 5, 1).otherwise(0)) \
    .withColumn('franja_horaria',
        F.when(F.col('hora').between(0, 5), 'Madrugada')
        .when(F.col('hora').between(6, 11), 'Manana')
        .when(F.col('hora').between(12, 17), 'Tarde')
        .otherwise('Noche')
    )

df_limpio.createOrReplaceTempView("senred_limpio")
n_limpio = df_limpio.count()
print(f"\nDataset limpio: {n_limpio:,} registros ({n_limpio/total*100:.1f}% del original)")
```

4. Fase 3: Analisis con Spark SQL:

```python
# ============================================================
# FASE 3: ANALISIS CON SPARK SQL
# ============================================================

print("\n" + "="*60)
print("FASE 3: ANALISIS ECONOMICO")
print("="*60)

# 3.1: Flujos por tipo de transaccion
print("\n--- 3.1 Flujos por tipo de transaccion ---")
spark.sql("""
    SELECT
        tipo_transaccion,
        COUNT(*) AS num_tx,
        ROUND(SUM(monto)/1e9, 3) AS volumen_miles_millones_USD,
        ROUND(AVG(monto), 2) AS ticket_promedio,
        ROUND(SUM(monto)/SUM(SUM(monto)) OVER () * 100, 2) AS pct_total
    FROM senred_limpio
    GROUP BY tipo_transaccion
    ORDER BY volumen_miles_millones_USD DESC
""").show()

# 3.2: Estacionalidad mensual
print("\n--- 3.2 Estacionalidad del sistema de pagos ---")
spark.sql("""
    SELECT
        anio, mes,
        COUNT(*) AS num_tx,
        ROUND(SUM(monto)/1e6, 1) AS volumen_millones_USD,
        ROUND(AVG(monto), 2) AS ticket_promedio
    FROM senred_limpio
    GROUP BY anio, mes
    ORDER BY anio, mes
""").show(24)

# 3.3: Matriz de flujos entre bancos (top 5x5)
print("\n--- 3.3 Flujos entre bancos (millones USD) ---")
spark.sql("""
    SELECT
        banco_origen,
        banco_destino,
        ROUND(SUM(monto)/1e6, 1) AS flujo_MUSD,
        COUNT(*) AS num_tx
    FROM senred_limpio
    WHERE banco_origen != banco_destino
    GROUP BY banco_origen, banco_destino
    ORDER BY flujo_MUSD DESC
    LIMIT 15
""").show()

# 3.4: Concentracion geografica (Indice HHI simplificado)
print("\n--- 3.4 Concentracion de pagos por provincia ---")
spark.sql("""
    WITH vol_prov AS (
        SELECT
            provincia_origen,
            SUM(monto) AS vol_prov,
            SUM(SUM(monto)) OVER () AS vol_total
        FROM senred_limpio
        GROUP BY provincia_origen
    )
    SELECT
        provincia_origen,
        ROUND(vol_prov/1e6, 1) AS volumen_MUSD,
        ROUND(vol_prov/vol_total*100, 2) AS pct,
        ROUND(POWER(vol_prov/vol_total*100, 2), 4) AS contribucion_HHI
    FROM vol_prov
    ORDER BY volumen_MUSD DESC
""").show()

# 3.5: Pagos del gobierno (BONO + SRI) como % del total
print("\n--- 3.5 Transferencias del sector publico ---")
spark.sql("""
    SELECT
        CASE WHEN tipo_transaccion IN ('BONO_GOBIERNO','PAGO_IMPUESTO_SRI')
             THEN 'Sector Publico'
             ELSE 'Sector Privado' END AS sector,
        COUNT(*) AS num_tx,
        ROUND(SUM(monto)/1e6, 1) AS volumen_MUSD,
        ROUND(SUM(monto)/SUM(SUM(monto)) OVER() * 100, 2) AS pct
    FROM senred_limpio
    GROUP BY sector
    ORDER BY volumen_MUSD DESC
""").show()
```

5. Fase 4: Exportacion y visualizacion:

```python
# ============================================================
# FASE 4: EXPORTACION Y VISUALIZACION
# ============================================================

print("\n" + "="*60)
print("FASE 4: EXPORTACION Y VISUALIZACION FINAL")
print("="*60)

# Exportar resultados clave como Parquet
print("\nExportando resultados en Parquet...")

# Resumen mensual
df_mensual = spark.sql("""
    SELECT anio, mes, tipo_transaccion,
           COUNT(*) AS num_tx,
           ROUND(SUM(monto), 2) AS volumen
    FROM senred_limpio
    GROUP BY anio, mes, tipo_transaccion
""")
df_mensual.write.mode('overwrite').partitionBy('anio').parquet('/tmp/bce_mensual')
print("  /tmp/bce_mensual guardado (particionado por anio)")

# Para visualizacion, convertir a Pandas (agregaciones pequenas)
df_viz = spark.sql("""
    SELECT anio, mes, SUM(monto)/1e6 AS volumen_MUSD, COUNT(*) AS num_tx
    FROM senred_limpio GROUP BY anio, mes ORDER BY anio, mes
""").toPandas()

# Grafico final
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.patch.set_facecolor('#F9F6E7')

# Volumen mensual
for anio_val in [2023, 2024]:
    subset = df_viz[df_viz['anio'] == anio_val]
    axes[0].plot(subset['mes'], subset['volumen_MUSD'],
                 marker='o', label=str(anio_val),
                 linewidth=2.5, markersize=6)
axes[0].set_title('Volumen SENRED por mes (Millones USD)\nFuente: BCE Ecuador (simulado)',
                  fontsize=10, loc='left', color='#1F2F58')
axes[0].set_xlabel('Mes')
axes[0].set_ylabel('Millones USD')
axes[0].legend()
axes[0].set_xticks(range(1, 13))
for sp in ['top','right']: axes[0].spines[sp].set_visible(False)

# Numero de transacciones
for anio_val in [2023, 2024]:
    subset = df_viz[df_viz['anio'] == anio_val]
    axes[1].bar([m - 0.2 if anio_val == 2023 else m + 0.2 for m in subset['mes']],
                subset['num_tx'] / 1000, width=0.35,
                label=str(anio_val),
                color='#1F2F58' if anio_val == 2023 else '#73B8E7',
                alpha=0.85)
axes[1].set_title('Numero de transacciones por mes (miles)\nSENRED 2023-2024',
                  fontsize=10, loc='left', color='#1F2F58')
axes[1].set_xlabel('Mes')
axes[1].set_ylabel('Miles de transacciones')
axes[1].legend()
axes[1].set_xticks(range(1, 13))
for sp in ['top','right']: axes[1].spines[sp].set_visible(False)

plt.tight_layout()
plt.savefig('bce_ecuador_senred_analisis.png', dpi=150, bbox_inches='tight')
plt.show()
print("\nVisualizacion guardada: bce_ecuador_senred_analisis.png")

# Reporte de performance del pipeline
print("\n" + "="*60)
print("REPORTE DE PERFORMANCE DEL PIPELINE")
print("="*60)
print(f"  Dataset procesado: {n_limpio:,} registros")
print(f"  Particiones Spark: 8")
print(f"  Formato salida: Parquet (particionado)")
print(f"  Consultas SQL ejecutadas: 5")
print(f"  Visualizaciones generadas: 1")
print(f"\nCompetencias demostradas:")
print(f"  - Ingesta y generacion de dataset masivo")
print(f"  - Control de calidad y limpieza con Spark")
print(f"  - Analisis con Spark SQL (CTEs, window functions)")
print(f"  - Exportacion en formato Parquet particionado")
print(f"  - Visualizacion de resultados con Matplotlib")
print(f"\nProyecto completado. Listo para presentar al BCE Ecuador.")

df_senred.unpersist()
spark.stop()
```

6. Escribe un **resumen ejecutivo** en 8-10 oraciones dirigido al Directorio del BCE Ecuador. Incluye: objetivo del analisis, fuente de datos, hallazgos principales (volumen, bancos dominantes, estacionalidad, participacion sector publico), y 2 recomendaciones de politica basadas en los datos.

## Usa IA para...

> Abre Claude con el grafico generado (`bce_ecuador_senred_analisis.png`) y escribe:
> "Soy analista del BCE Ecuador. Esta grafica muestra el volumen de transacciones SENRED 2023-2024. Identifica 3 patrones economicos relevantes y sugiere que factores macroeconomicos del Ecuador podrian explicar cada patron. Usa conocimiento real del Ecuador."

Usa la respuesta de Claude para enriquecer tu resumen ejecutivo.

## Que aprendiste

- Un pipeline de Big Data completo tiene 4 fases: ingesta, limpieza, transformacion/analisis y exportacion.
- `.repartition(n)` distribuye datos uniformemente para optimizar el procesamiento paralelo.
- `.cache()` seguido de una accion (`.count()`) fuerza la materializacion en memoria para consultas posteriores rapidas.
- Parquet particionado por ano permite que Spark lea solo las particiones necesarias (partition pruning).
- `spark.sql.adaptive.enabled = true` activa el optimizador adaptativo de Spark 3.x que mejora automaticamente los planes de ejecucion.

## Reto extra

Agrega una quinta fase al pipeline: machine learning. Usando `pyspark.ml.clustering.KMeans`, agrupa las provincias en 3 clusters segun su patron de transacciones (volumen promedio, numero de transacciones, hora pico, tipo predominante). Interpreta los clusters: ¿que tipo de economia representa cada grupo? ¿Cual es el cluster de alta actividad financiera, cual el de economia primaria y cual el intermedio? Presenta los resultados en un grafico de dispersion.
