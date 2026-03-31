# Ejercicio Sesion 7: Procesamiento Batch vs Streaming

**Materia:** Ecosistema Big Data (Hadoop/Spark)
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Comprender y comparar los paradigmas de procesamiento batch (por lotes) y streaming (tiempo real), implementar un pipeline de streaming con Spark Structured Streaming sobre datos de transacciones financieras ecuatorianas, y decidir cual paradigma usar segun el caso de negocio.

## Contexto

El Banco Pichincha procesa millones de transacciones al dia. Algunas operaciones pueden esperar: el reporte mensual de rentabilidad por producto puede calcularse cada noche (batch). Pero la deteccion de fraude no puede esperar: si alguien usa tu tarjeta de credito en Quito y 5 minutos despues en Miami, el banco necesita detectarlo en segundos (streaming). En este ejercicio construyes un pipeline de deteccion de anomalias en tiempo real con Spark Structured Streaming.

## Instrucciones

1. Abre Google Colab y crea `sesion07_batch_vs_streaming.ipynb`:

```python
# ITSEIA - Ecosistema Big Data - Sesion 7
# Batch vs Streaming: dos paradigmas complementarios

from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import *
import pandas as pd
import numpy as np
import random
import time
import threading
import json
import os
from datetime import datetime, timedelta

spark = SparkSession.builder \
    .appName("ITSEIA-Streaming-Sesion7") \
    .config("spark.sql.shuffle.partitions", "2") \
    .getOrCreate()

spark.sparkContext.setLogLevel("ERROR")
print("Spark iniciado para Batch + Streaming")
```

2. Parte 1: Pipeline BATCH para reporte mensual:

```python
# ============================================================
# PARTE 1: BATCH PROCESSING
# Caso: Reporte mensual de transacciones bancarias Ecuador
# Se ejecuta 1 vez por noche, procesa datos del dia anterior
# ============================================================

print("="*55)
print("PARTE 1: PROCESAMIENTO BATCH")
print("="*55)

random.seed(42)
n_tx = 200_000

# Datos historicos del mes (procesados en batch)
tx_historicas = pd.DataFrame({
    'tx_id': [f"TX{i:08d}" for i in range(n_tx)],
    'banco_origen': random.choices(
        ['Pichincha','Guayaquil','Produbanco','Pacifico','Internacional'],
        weights=[0.35, 0.25, 0.18, 0.12, 0.10], k=n_tx
    ),
    'tipo': random.choices(
        ['Transferencia','Pago_TC','Retiro_ATM','Deposito','Pago_Servicio'],
        weights=[0.30, 0.25, 0.20, 0.15, 0.10], k=n_tx
    ),
    'monto': [round(abs(np.random.lognormal(5.2, 1.4)), 2) for _ in range(n_tx)],
    'ciudad': random.choices(['Quito','Guayaquil','Cuenca','Ambato','Manta'],
                              weights=[0.38, 0.32, 0.12, 0.10, 0.08], k=n_tx),
    'hora': [random.randint(0, 23) for _ in range(n_tx)],
    'dia': [random.randint(1, 31) for _ in range(n_tx)],
    'es_fin_semana': [random.choice([0, 1]) for _ in range(n_tx)],
    'canal': random.choices(['App','Web','ATM','Ventanilla'], weights=[0.45,0.25,0.20,0.10], k=n_tx)
})

df_batch = spark.createDataFrame(tx_historicas)
df_batch.createOrReplaceTempView("tx_historicas")

print(f"\nDataset batch: {df_batch.count():,} transacciones del mes")

# Reporte batch: KPIs mensuales
print("\n--- REPORTE BATCH: KPIs Mensuales ---")
spark.sql("""
    SELECT
        banco_origen,
        tipo,
        canal,
        COUNT(*) AS num_transacciones,
        ROUND(SUM(monto), 2) AS volumen_total,
        ROUND(AVG(monto), 2) AS ticket_promedio,
        ROUND(PERCENTILE_APPROX(monto, 0.95), 2) AS p95_monto
    FROM tx_historicas
    GROUP BY banco_origen, tipo, canal
    ORDER BY volumen_total DESC
    LIMIT 15
""").show()

# Patron por hora del dia (para planificacion de capacidad)
print("\n--- Volumen por hora del dia ---")
df_batch.groupBy('hora') \
    .agg(F.count('*').alias('tx'), F.round(F.sum('monto'), 0).alias('volumen')) \
    .orderBy('hora') \
    .show(24)

t0 = time.time()
# Simular tiempo de procesamiento batch
df_batch.write.mode('overwrite').parquet('/tmp/reporte_batch')
t_batch = time.time() - t0
print(f"\nBATCH completado en {t_batch:.2f}s para {n_tx:,} registros")
print("Frecuencia tipica: 1 vez por noche. Latencia: horas. OK para reportes.")
```

3. Parte 2: Streaming para deteccion de fraude en tiempo real:

```python
# ============================================================
# PARTE 2: STRUCTURED STREAMING
# Caso: Deteccion de anomalias en tiempo real
# ============================================================

print("\n" + "="*55)
print("PARTE 2: STRUCTURED STREAMING (tiempo real)")
print("="*55)

# En produccion: Kafka como fuente. Aqui: archivos JSON en carpeta
# Spark Structured Streaming puede leer de Kafka, socket, archivos

# Crear directorio para simular stream
os.makedirs('/tmp/stream_input', exist_ok=True)
os.makedirs('/tmp/stream_output', exist_ok=True)
os.makedirs('/tmp/stream_checkpoint', exist_ok=True)

# Schema del mensaje de transaccion (debe definirse para streaming)
schema_tx = StructType([
    StructField("tx_id", StringType(), True),
    StructField("timestamp", StringType(), True),
    StructField("banco", StringType(), True),
    StructField("cliente_id", StringType(), True),
    StructField("monto", FloatType(), True),
    StructField("ciudad", StringType(), True),
    StructField("tipo", StringType(), True),
    StructField("latitud", FloatType(), True),
    StructField("longitud", FloatType(), True)
])

# Funcion para generar transacciones en tiempo real (simula Kafka producer)
def generar_transacciones_stream(n_lotes=8, intervalo_seg=2):
    """Escribe archivos JSON en la carpeta de input cada 'intervalo_seg' segundos"""
    ciudades_ec = {
        'Quito': (-0.2295, -78.5243),
        'Guayaquil': (-2.1962, -79.8862),
        'Cuenca': (-2.9001, -79.0059),
        'Miami': (25.7617, -80.1918),  # Anomalia geografica
        'Madrid': (40.4168, -3.7038),  # Anomalia geografica
    }

    for lote in range(n_lotes):
        transacciones = []
        n_en_lote = random.randint(5, 15)

        for _ in range(n_en_lote):
            # 10% de probabilidad de transaccion anomala (ciudad extranjera)
            es_anomala = random.random() < 0.10
            if es_anomala:
                ciudad = random.choice(['Miami', 'Madrid'])
            else:
                ciudad = random.choice(['Quito', 'Guayaquil', 'Cuenca'])

            lat, lon = ciudades_ec[ciudad]
            monto = round(random.uniform(100, 8000), 2) if es_anomala else round(random.uniform(5, 500), 2)

            transacciones.append({
                "tx_id": f"RT{random.randint(10000000,99999999)}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "banco": random.choice(['Pichincha','Guayaquil','Produbanco']),
                "cliente_id": f"CLI{random.randint(1000,9999)}",
                "monto": monto,
                "ciudad": ciudad,
                "tipo": random.choice(['Compra','Retiro','Transferencia']),
                "latitud": lat + random.uniform(-0.01, 0.01),
                "longitud": lon + random.uniform(-0.01, 0.01)
            })

        # Escribir archivo JSON (simula mensaje Kafka)
        archivo = f"/tmp/stream_input/lote_{lote:03d}.json"
        with open(archivo, 'w') as f:
            for tx in transacciones:
                f.write(json.dumps(tx) + '\n')

        print(f"  [Producer] Lote {lote+1}/{n_lotes}: {len(transacciones)} transacciones escritas")
        time.sleep(intervalo_seg)

    print("  [Producer] Stream de transacciones terminado")

# Iniciar producer en hilo separado
producer_thread = threading.Thread(
    target=generar_transacciones_stream,
    args=(8, 2),
    daemon=True
)
producer_thread.start()
print("Producer iniciado en background. Generando transacciones...")
time.sleep(3)  # Esperar que lleguen los primeros datos

# Leer stream de archivos JSON
df_stream = spark.readStream \
    .schema(schema_tx) \
    .option("maxFilesPerTrigger", 2) \
    .json('/tmp/stream_input/')

# Transformaciones en streaming: misma API que batch
df_stream_procesado = df_stream \
    .withColumn('es_internacional',
        F.when(F.col('ciudad').isin(['Miami', 'Madrid', 'New_York']), True).otherwise(False)
    ) \
    .withColumn('es_monto_alto',
        F.when(F.col('monto') > 2000, True).otherwise(False)
    ) \
    .withColumn('nivel_riesgo',
        F.when(F.col('es_internacional') & F.col('es_monto_alto'), 'ALTO')
        .when(F.col('es_internacional') | F.col('es_monto_alto'), 'MEDIO')
        .otherwise('BAJO')
    ) \
    .withColumn('procesado_en', F.current_timestamp())

# Agregar en ventana de tiempo
df_agregado = df_stream_procesado \
    .groupBy(
        F.window(F.col('procesado_en'), '30 seconds', '10 seconds'),
        'nivel_riesgo'
    ) \
    .agg(
        F.count('*').alias('num_tx'),
        F.round(F.sum('monto'), 2).alias('volumen')
    )

# Iniciar query de streaming (escribe a consola)
query = df_stream_procesado \
    .filter(F.col('nivel_riesgo').isin(['ALTO', 'MEDIO'])) \
    .select('tx_id', 'timestamp', 'banco', 'cliente_id',
            'monto', 'ciudad', 'nivel_riesgo', 'procesado_en') \
    .writeStream \
    .outputMode('append') \
    .format('console') \
    .option('truncate', False) \
    .option('numRows', 20) \
    .start()

print("\n[Streaming] Pipeline activo. Mostrando transacciones de riesgo MEDIO/ALTO:")
print("[Streaming] Esperando datos...")
query.awaitTermination(timeout=25)  # Procesa por 25 segundos
query.stop()
print("\n[Streaming] Query detenida.")
```

4. Compara y decide:

```python
# ============================================================
# COMPARACION: Batch vs Streaming
# ============================================================

print("\n" + "="*55)
print("COMPARACION: Batch vs Streaming")
print("="*55)

tabla = [
    ("Latencia", "Horas o dias", "Segundos o milisegundos"),
    ("Costo computo", "Bajo (nocturno)", "Alto (permanente)"),
    ("Complejidad", "Simple", "Alta"),
    ("Consistencia datos", "Total (datos completos)", "Eventual (ventanas de tiempo)"),
    ("Caso Ecuador: SRI", "Reporte mensual recaudacion", "Deteccion factura duplicada"),
    ("Caso Ecuador: BCE", "Estadisticas PIB trimestral", "Monitoreo tipo de cambio"),
    ("Caso Ecuador: Banco", "Reporte rentabilidad mensual", "Deteccion fraude tarjeta"),
    ("Herramienta", "Spark Batch, Hadoop MapReduce", "Spark Streaming, Kafka, Flink"),
]

print(f"\n{'Dimension':<25} {'BATCH':^25} {'STREAMING':^25}")
print("-" * 75)
for dimension, batch, stream in tabla:
    print(f"  {dimension:<23} {batch:<25} {stream:<25}")

print("\nRegla practica:")
print("  - Preguntas retrospectivas (¿que paso?) -> BATCH")
print("  - Preguntas en presente (¿que esta pasando?) -> STREAMING")
print("  - La mayoria de empresas ecuatorianas necesitan los DOS")

spark.stop()
```

5. En una celda de texto: diseña el pipeline batch + streaming ideal para una empresa de delivery en Ecuador (como iFood o Rappi). ¿Que procesarias en batch cada noche? ¿Que procesarias en streaming? Justifica con casos de uso especificos.

## Usa IA para...

> Abre Claude y escribe:
> "Soy ingeniero de datos en una empresa financiera de Ecuador. Tengo un pipeline de deteccion de fraude con Spark Streaming. El problema es que tenemos muchos falsos positivos (bloqueos incorrectos). ¿Como implementaria un modelo de ML que se entrene en batch con datos historicos y luego sus predicciones se apliquen en el pipeline de streaming en tiempo real? Explica la arquitectura Lambda."

Dibuja un diagrama (en texto/ASCII) de la arquitectura Lambda basandote en la respuesta de Claude.

## Que aprendiste

- Batch procesa datos acumulados periodicamente (noche, semana, mes): bajo costo, alta latencia.
- Structured Streaming en Spark usa la misma API que batch, solo cambia `read` por `readStream` y `write` por `writeStream`.
- `outputMode` en streaming: `append` (solo nuevos), `complete` (todos), `update` (solo actualizados).
- Las ventanas de tiempo (`window()`) agrupan eventos en intervalos definidos para calcular metricas en tiempo real.
- La arquitectura Lambda combina batch (exacto pero lento) con streaming (rapido pero aproximado).

## Reto extra

Implementa un streaming que detecte "tarjeta clonada": un mismo `cliente_id` que realiza transacciones en dos ciudades diferentes dentro de un intervalo de 10 minutos. Usa `window()` con `groupBy` y detecta cuando un cliente aparece en mas de una ciudad en la misma ventana de tiempo. Genera una alerta con el patron `ALERTA CLONACION: cliente X en Quito y Miami con 7 minutos de diferencia`.
