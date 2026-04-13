# Ejercicio Sesion 4: Spark para Procesamiento Masivo

**Materia:** Cloud Computing y Data Lakes
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 50 min

## Objetivo

Usar Apache Spark con PySpark para procesar datasets de millones de registros: RDD vs DataFrame API, transformaciones lazy, acciones, particionamiento, broadcast joins, y optimizacion del plan de ejecucion (Catalyst), aplicados al Censo INEC y datos masivos de facturacion SRI Ecuador.

## Contexto

El Censo de Ecuador 2022 tiene 17.7 millones de registros. El SRI procesa 2+ millones de facturas diarias. pandas no puede con eso en memoria — Spark distribuye el procesamiento en un cluster. Con PySpark, el mismo codigo que desarrollas localmente escala a petabytes en AWS EMR, Databricks o Google Dataproc sin cambios.

## Instrucciones

1. Instala: `pip install pyspark`.

2. Crea el archivo `sesion04_pyspark_ecuador.py`:

```python
# PySpark - ITSEIA
# Cloud Computing y Data Lakes
# Procesamiento masivo: Censo + Facturas Ecuador

import pandas as pd
import numpy as np
from datetime import datetime
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("APACHE SPARK (PySpark) — DATOS MASIVOS ECUADOR")
print("=" * 65)

try:
    from pyspark.sql import SparkSession
    from pyspark.sql import functions as F
    from pyspark.sql.types import *
    from pyspark.sql.window import Window
    SPARK_OK = True

    spark = SparkSession.builder \
        .appName("ITSEIA-Ecuador-Data") \
        .config("spark.sql.shuffle.partitions", "8") \
        .config("spark.driver.memory", "2g") \
        .getOrCreate()
    spark.sparkContext.setLogLevel("ERROR")
    print(f"  Spark version: {spark.version}")

except ImportError:
    SPARK_OK = False
    print("  PySpark no instalado — instala con: pip install pyspark")
    print("  Mostrando el codigo con ejemplos ilustrativos...")

# ================================================
# CONCEPTOS SPARK
# ================================================
print("\n--- CONCEPTOS CLAVE APACHE SPARK ---")

conceptos = {
    "RDD":          "Resilient Distributed Dataset — baja nivel, inmutable, distribuido",
    "DataFrame":    "RDD con schema — API como pandas pero distribuida",
    "Lazy eval":    "Las transformaciones NO se ejecutan hasta una Action",
    "Transformation":"map, filter, select, groupBy → crean nuevo DF (lazy)",
    "Action":       "show, count, collect, write → dispara la ejecucion real",
    "Partition":    "unidad de paralelismo — cada worker procesa sus particiones",
    "Catalyst":     "Optimizador de queries — reordena, pushes predicados, etc.",
    "Tungsten":     "Motor de ejecucion — codegen bytecode, cache memoria eficiente",
    "Broadcast":    "Envia tabla pequena a todos los workers — evita shuffle en JOIN",
    "Shuffle":      "Redistribuir datos entre particiones — la operacion mas costosa",
}
for k, v in conceptos.items():
    print(f"  {k:<14}: {v}")

if SPARK_OK:
    # ================================================
    # DATASET 1: CENSO INEC SIMULADO (gran volumen)
    # ================================================
    print("\n--- DATASET: CENSO INEC ECUADOR (simulado) ---")

    # Generar datos del censo simulado
    n_censo = 500000  # 500K registros para demo (real: 17.7M)
    provincias = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua",
                  "Los Rios","Chimborazo","El Oro","Imbabura","Loja",
                  "Esmeraldas","Cotopaxi","Bolivar","Canar","Carchi"]
    pesos = [0.18,0.20,0.06,0.08,0.04,0.06,0.04,0.04,0.03,0.04,
             0.04,0.04,0.02,0.02,0.02] + [0.09/9]*9

    censo_pd = pd.DataFrame({
        "id_persona":     range(1, n_censo+1),
        "provincia":      np.random.choice(provincias, n_censo, p=pesos[:len(provincias)]),
        "edad":           np.random.randint(0, 99, n_censo),
        "sexo":           np.random.choice(["M","F"], n_censo),
        "nivel_educacion":np.random.choice(["ninguno","primaria","secundaria","superior","posgrado"],
                                            n_censo, p=[0.05,0.30,0.35,0.26,0.04]),
        "estado_civil":   np.random.choice(["soltero","casado","union_libre","divorciado"],
                                            n_censo, p=[0.35,0.40,0.18,0.07]),
        "tiene_trabajo":  np.random.binomial(1, 0.55, n_censo),
        "ingreso_mensual": np.where(
            np.random.binomial(1, 0.55, n_censo) == 1,
            np.random.lognormal(6.3, 0.5, n_censo).round(0), 0
        ),
        "tipo_vivienda":  np.random.choice(["propia","arrendada","prestada","gratuita"],
                                            n_censo, p=[0.55,0.28,0.12,0.05]),
        "acceso_internet":np.random.binomial(1, 0.55, n_censo),
        "canton":         np.random.choice(["canton_A","canton_B","canton_C","canton_D"],
                                            n_censo),
    })

    df_censo = spark.createDataFrame(censo_pd)
    print(f"  Registros: {df_censo.count():,} | Particiones: {df_censo.rdd.getNumPartitions()}")
    df_censo.printSchema()

    # ================================================
    # TRANSFORMACIONES SPARK
    # ================================================
    print("\n--- TRANSFORMACIONES LAZY ---")

    # 1. Filter + Select (lazy — no ejecuta todavia)
    df_pea = df_censo.filter(
        (F.col("edad").between(15, 64)) &
        (F.col("tiene_trabajo") == 1)
    ).select("provincia","edad","sexo","nivel_educacion","ingreso_mensual")

    # 2. GroupBy con multiples agregaciones
    df_prov_stats = df_censo.groupBy("provincia").agg(
        F.count("id_persona").alias("poblacion"),
        F.avg("edad").alias("edad_promedio"),
        F.sum("tiene_trabajo").alias("empleados"),
        F.avg("ingreso_mensual").alias("ingreso_promedio"),
        F.avg("acceso_internet").alias("tasa_internet"),
        F.countDistinct("canton").alias("cantones")
    ).orderBy(F.col("poblacion").desc())

    print("  Estadisticas por provincia (Spark Action — ejecuta el plan):")
    df_prov_stats.show(10, truncate=False)

    # 3. Window Functions
    print("  Ranking provincias por ingreso promedio:")
    window_rank = Window.orderBy(F.col("ingreso_promedio").desc())
    df_ranking = df_prov_stats.withColumn(
        "rank_ingreso", F.rank().over(window_rank)
    ).select("provincia","ingreso_promedio","rank_ingreso","empleados")
    df_ranking.show(10)

    # 4. Analisis brecha digital
    print("  Brecha digital por nivel educativo:")
    df_brecha = df_censo.groupBy("nivel_educacion").agg(
        F.avg("acceso_internet").alias("tasa_internet"),
        F.avg("ingreso_mensual").alias("ingreso_prom"),
        F.count("*").alias("personas")
    ).orderBy("nivel_educacion")
    df_brecha.show()

    # ================================================
    # DATASET 2: FACTURAS SRI (JOIN con broadcast)
    # ================================================
    print("--- BROADCAST JOIN: FACTURAS SRI + RUC ---")

    n_facturas = 200000
    facturas_pd = pd.DataFrame({
        "num_factura": range(1, n_facturas+1),
        "ruc":         np.random.choice(
            [f"17{i:08d}001" for i in range(1, 5001)], n_facturas  # 5000 RUCs distintos
        ),
        "total_usd":   np.random.lognormal(5, 1.2, n_facturas).round(2),
        "mes":         np.random.randint(1, 13, n_facturas),
        "tipo":        np.random.choice(["venta","compra"], n_facturas, p=[0.65,0.35]),
    })

    n_empresas = 5000
    empresas_pd = pd.DataFrame({
        "ruc":     [f"17{i:08d}001" for i in range(1, n_empresas+1)],
        "nombre":  [f"Empresa_{i}" for i in range(1, n_empresas+1)],
        "sector":  np.random.choice(["comercio","manufactura","servicios","construccion"],
                                     n_empresas, p=[0.40,0.20,0.30,0.10]),
        "provincia": np.random.choice(provincias[:10], n_empresas),
    })

    df_facturas = spark.createDataFrame(facturas_pd)
    df_empresas = spark.createDataFrame(empresas_pd)

    # Broadcast join (empresas es tabla pequena → broadcast a todos los workers)
    df_empresas_bc = F.broadcast(df_empresas)
    df_joined = df_facturas.join(df_empresas_bc, on="ruc", how="inner")

    # Analisis por sector
    print("  Facturacion por sector (con broadcast join):")
    df_sector = df_joined.groupBy("sector").agg(
        F.count("num_factura").alias("num_facturas"),
        F.sum("total_usd").alias("total_facturado"),
        F.avg("total_usd").alias("ticket_promedio")
    ).orderBy(F.col("total_facturado").desc())
    df_sector.show()

    # ================================================
    # PLAN DE EJECUCION
    # ================================================
    print("--- PLAN DE EJECUCION (EXPLAIN) ---")
    print("  El optimizador Catalyst genera el plan fisico:")
    df_sector.explain(mode="simple")

    # ================================================
    # GUARDAR EN PARQUET PARTICIONADO
    # ================================================
    print("--- GUARDAR PARQUET PARTICIONADO ---")
    output_path = "/tmp/spark_facturas_ecuador"
    df_joined.write \
        .mode("overwrite") \
        .partitionBy("sector", "mes") \
        .parquet(output_path)
    print(f"  Guardado en: {output_path}")
    print(f"  Particiones: sector x mes = {len(set(facturas_pd['mes']))*4} directorios")

    spark.stop()
    print("\n  Spark session cerrada.")

else:
    # Sin PySpark — mostrar el codigo equivalente
    print("\n  Equivalente pandas para 500K registros (no distribuido):")
    print("  df.groupby('provincia').agg({'id':'count','ingreso':'mean'}).sort_values('id', ascending=False)")
    print("\n  Con PySpark (distribuido en cluster):")
    print("  df_censo.groupBy('provincia').agg(F.count('id_persona'),F.avg('ingreso')).orderBy(F.col('id_persona').desc()).show()")

print("\n" + "=" * 65)
print("SPARK — CONCEPTOS CLAVE:")
print("  Lazy eval:   las transformaciones se acumulan hasta una Action")
print("  Particiones: unidad de paralelismo — 1 particion por core es ideal")
print("  Broadcast:   tabla < 10MB → broadcast evita shuffle costoso")
print("  Shuffle:     la operacion mas cara — minimizar con partitionBy")
print("  Catalyst:    optimizador automatico — predicate pushdown, etc.")
print("  write.partitionBy: organiza datos fisicamente para queries eficientes")
print("=" * 65)
```

3. Implementa un job Spark que calcule el "indice de Gini" de distribucion de ingresos por provincia usando los datos del censo simulado.

4. Agrega monitoreo del plan de ejecucion con `explain(mode="extended")` e identifica si hay broadcast joins.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un job PySpark que procesa 17 millones de registros del Censo Ecuador en un cluster EMR de 4 nodos (1 master, 3 workers con 16GB RAM y 4 cores cada uno). El job tarda 45 minutos. ¿Como optimizo para que tarde menos de 10 minutos? Necesito analizar: 1) numero optimo de particiones, 2) memoria para driver y executors, 3) si hay data skew en la columna 'provincia', 4) como usar cache() y persist() correctamente. Dame el codigo con las configuraciones optimizadas."

Despues de leer la respuesta:
- Implementa el `cache()` en el DataFrame mas reutilizado del ejercicio.
- Agrega la configuracion de `spark.sql.shuffle.partitions` optima para el dataset.

## Que aprendiste

- Spark evalua las transformaciones de forma lazy: se acumulan en un plan de ejecucion hasta que una Action lo ejecuta.
- El broadcast join evita el shuffle costoso cuando una tabla es pequena (< 10MB) — mejora hasta 100x el rendimiento.
- Las particiones son la unidad de paralelismo: la regla de oro es `num_particiones = 2-4 x num_cores`.
- `write.partitionBy("sector","mes")` organiza el Parquet fisicamente para que las queries con filtros sean instantaneas.
- `explain()` muestra el plan fisico — esencial para diagnosticar problemas de rendimiento.
- Para 17 millones de registros: pandas falla (out of memory), Spark procesa en minutos en un cluster.

## Reto extra

Construye un pipeline PySpark que procese el Registro Civil de Ecuador: lee los datos de nacimientos, matrimonios y defunciones (simulados) de 20 años, calcula indicadores demograficos (tasa natalidad, nupcialidad, mortalidad) por canton y anio, detecta anomalias estadisticas (cantones con mortalidad 3+ desviaciones sobre la media), y genera un reporte HTML automatico con Plotly. Despliega en Google Dataproc con un notebook Jupyter.
