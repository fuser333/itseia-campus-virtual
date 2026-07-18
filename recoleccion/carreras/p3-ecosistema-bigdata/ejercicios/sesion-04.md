# Ejercicio Sesion 4: Apache Spark — Intro y PySpark Basico

**Materia:** Ecosistema Big Data (Hadoop/Spark)
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Instalar y configurar PySpark en Google Colab, crear un SparkContext y SparkSession, trabajar con RDDs (Resilient Distributed Datasets) y comprender por que Spark es hasta 100x mas rapido que MapReduce tradicional al procesar datos reales del Ecuador en memoria.

## Contexto

Hadoop MapReduce escribe los resultados intermedios en disco entre cada fase, lo que lo hace lento para analisis iterativos como machine learning. Apache Spark resuelve esto procesando en memoria RAM, haciendo que el mismo calculo sea hasta 100x mas rapido. En Ecuador, empresas como el Banco Pichincha, CNT y empresas de retail usan Spark para analisis en tiempo casi-real. En este ejercicio arrancas tu primer cluster Spark en Google Colab de forma completamente gratuita.

## Instrucciones

1. Abre Google Colab y crea `sesion04_pyspark_intro.ipynb`. Instala PySpark:

```python
# ITSEIA - Ecosistema Big Data - Sesion 4
# Apache Spark: introduccion y PySpark basico

# Instalacion en Google Colab
!pip install pyspark --quiet
!pip install findspark --quiet

print("Instalacion completada.")
```

2. Configura la SparkSession:

```python
import findspark
findspark.init()

from pyspark.sql import SparkSession
from pyspark import SparkContext, SparkConf
import pandas as pd
import numpy as np

# Crear SparkSession (punto de entrada unico en Spark 2.x+)
spark = SparkSession.builder \
    .appName("ITSEIA-BigData-Sesion4") \
    .config("spark.driver.memory", "2g") \
    .config("spark.executor.memory", "1g") \
    .config("spark.sql.shuffle.partitions", "4") \
    .getOrCreate()

sc = spark.sparkContext

print("=" * 50)
print("SPARK SESSION INICIADA")
print("=" * 50)
print(f"Version Spark: {spark.version}")
print(f"Nombre App: {sc.appName}")
print(f"Master URL: {sc.master}")
print(f"Cores disponibles: {sc.defaultParallelism}")
print(f"UI disponible en: http://localhost:4040")
```

3. RDDs: la abstraccion fundamental de Spark:

```python
# ============================================================
# RDDs: Resilient Distributed Datasets
# ============================================================

print("\n" + "="*50)
print("PARTE 1: RDDs Basicos")
print("="*50)

# Crear RDD desde una lista Python
# Spark distribuye automaticamente en particiones
numeros = sc.parallelize(range(1, 101), numSlices=4)
print(f"\nRDD de numeros 1-100:")
print(f"  Particiones: {numeros.getNumPartitions()}")
print(f"  Primeros 5: {numeros.take(5)}")
print(f"  Total elementos: {numeros.count()}")

# Transformaciones (LAZY - no se ejecutan hasta una accion)
pares = numeros.filter(lambda x: x % 2 == 0)         # Lazy
cuadrados = pares.map(lambda x: x ** 2)              # Lazy
print(f"\nTransformaciones (lazy - aun no ejecutadas):")
print(f"  .filter(par) -> {pares.count()} elementos")   # Accion: ejecuta todo
print(f"  .map(cuadrado) suma = {cuadrados.sum()}")      # Accion: ejecuta todo

# Crear RDD desde datos de facturas Ecuador
import random
random.seed(42)

provincias = ['Pichincha','Guayas','Azuay','Manabi','Tungurahua','Loja']
datos_facturas = [
    (f"FAC{i:06d}",
     random.choice(provincias),
     round(random.uniform(10, 5000), 2),
     random.choice(['Venta','Servicio']))
    for i in range(1, 100_001)  # 100K facturas
]

rdd_facturas = sc.parallelize(datos_facturas, numSlices=6)
print(f"\nRDD Facturas SRI Ecuador:")
print(f"  Total: {rdd_facturas.count():,} registros")
print(f"  Particiones: {rdd_facturas.getNumPartitions()}")
print(f"  Ejemplo: {rdd_facturas.first()}")
```

4. Transformaciones y acciones fundamentales:

```python
# ============================================================
# TRANSFORMACIONES Y ACCIONES
# ============================================================

print("\n" + "="*50)
print("PARTE 2: Transformaciones y Acciones RDD")
print("="*50)

# map: transformar cada elemento
rdd_con_iva = rdd_facturas.map(
    lambda f: (f[0], f[1], f[2], f[2] * 1.15, f[3])  # Agregar monto con IVA
)
print(f"\nmap() - Agregar IVA 15%:")
print(f"  Ejemplo: {rdd_con_iva.first()}")

# filter: seleccionar elementos que cumplen condicion
facturas_grandes = rdd_facturas.filter(lambda f: f[2] > 1000)
print(f"\nfilter() - Facturas > $1,000:")
print(f"  Total: {facturas_grandes.count():,} facturas ({facturas_grandes.count()/100000*100:.1f}%)")

# map para pares (clave, valor)
rdd_prov_monto = rdd_facturas.map(lambda f: (f[1], f[2]))

# reduceByKey: agrupar por clave y reducir
ventas_por_prov = rdd_prov_monto.reduceByKey(lambda a, b: a + b)
print("\nreduceByKey() - Ventas totales por provincia:")
for prov, total in sorted(ventas_por_prov.collect(), key=lambda x: x[1], reverse=True):
    print(f"  {prov:<15}: ${total:>12,.2f}")

# groupByKey vs reduceByKey (performance)
print("\n--- IMPORTANTE: reduceByKey vs groupByKey ---")
print("reduceByKey: combina en cada particion ANTES de transferir por red -> RAPIDO")
print("groupByKey: transfiere todos los valores por red ANTES de reducir -> LENTO")
print("Regla: SIEMPRE preferir reduceByKey, aggregateByKey o combineByKey")

# sortBy: ordenar
top3_provincias = ventas_por_prov.sortBy(lambda x: x[1], ascending=False).take(3)
print(f"\nsortBy() - Top 3 provincias por ventas:")
for prov, total in top3_provincias:
    print(f"  {prov}: ${total:,.2f}")
```

5. Caching y performance:

```python
# ============================================================
# CACHING: Ventaja clave de Spark sobre MapReduce
# ============================================================

import time

print("\n" + "="*50)
print("PARTE 3: Caching en memoria (ventaja sobre Hadoop)")
print("="*50)

# Sin cache: cada accion re-calcula desde el principio
rdd_filtrado = rdd_facturas.filter(lambda f: f[2] > 500)

t0 = time.time()
count1 = rdd_filtrado.count()
t1 = time.time() - t0

t0 = time.time()
sum1 = rdd_filtrado.map(lambda f: f[2]).sum()
t2 = time.time() - t0

print(f"\nSIN CACHE:")
print(f"  .count(): {count1:,} registros en {t1:.3f}s (calculo completo)")
print(f"  .sum(): ${sum1:,.2f} en {t2:.3f}s (recalculo desde inicio)")

# CON cache: primer calculo toma tiempo, los siguientes son instantaneos
rdd_filtrado_cached = rdd_filtrado.cache()

t0 = time.time()
count2 = rdd_filtrado_cached.count()  # Primer acceso: carga en memoria
t3 = time.time() - t0

t0 = time.time()
sum2 = rdd_filtrado_cached.map(lambda f: f[2]).sum()  # Desde memoria
t4 = time.time() - t0

print(f"\nCON CACHE (.cache()):")
print(f"  .count() primera vez: {count2:,} en {t3:.3f}s (carga en RAM)")
print(f"  .sum() desde cache: ${sum2:,.2f} en {t4:.3f}s (desde RAM)")
print(f"\nAceleracion: {t2/t4:.1f}x mas rapido con cache")
print("En Hadoop MapReduce: cada operacion lee desde disco -> 10-100x mas lento")

# Liberar cache
rdd_filtrado_cached.unpersist()
print("\nCache liberado (buena practica para liberar memoria)")
```

6. Escribe en una celda de texto: ¿Cual es la diferencia entre una transformacion y una accion en Spark? ¿Por que las transformaciones son "lazy"? Justifica con un ejemplo de como esto ahorra tiempo de computo.

## Usa IA para...

> Abre Claude y escribe:
> "En PySpark, explica la diferencia entre persist(StorageLevel.MEMORY_ONLY), persist(StorageLevel.MEMORY_AND_DISK) y persist(StorageLevel.DISK_ONLY). ¿Cuando usaria cada uno con un cluster de 32GB de RAM procesando un dataset de 20GB en Ecuador?"

Aplica la respuesta de Claude para elegir el nivel de persistencia correcto para el RDD de facturas del ejercicio.

## Que aprendiste

- `SparkSession` es el punto de entrada unico para todas las operaciones Spark 2.x+.
- Los RDDs son colecciones distribuidas e inmutables. Cada transformacion crea un nuevo RDD.
- Transformaciones (`map`, `filter`, `reduceByKey`) son lazy: no se ejecutan hasta una accion.
- Acciones (`count`, `collect`, `sum`, `take`) disparan la ejecucion y devuelven resultados.
- `.cache()` almacena el RDD en memoria para iteraciones multiples: hasta 100x mas rapido que re-leer de disco.

## Reto extra

Crea un pipeline PySpark completo que: 1) Genere 1 millon de registros de transacciones bancarias ecuatorianas (banco, tipo, monto, ciudad, hora), 2) Filtre solo transacciones mayores a $500, 3) Calcule el promedio de transaccion por banco, 4) Encuentre la hora del dia con mayor volumen total, 5) Identifique el top 3 de ciudades por numero de transacciones. Todo con RDDs y sin usar DataFrames aun.
