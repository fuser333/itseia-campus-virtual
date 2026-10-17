# Ejercicio Sesion 5: Spark Streaming

**Materia:** Streaming y Procesamiento en Tiempo Real
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Implementar Spark Structured Streaming para procesamiento de micro-batches con alta latencia pero alto throughput: agregaciones continuas, joins con datos estaticos, checkpointing, y modo continuous processing — aplicado al analisis en tiempo real de exportaciones ecuatorianas reportadas al SENAE (Servicio Nacional de Aduana del Ecuador).

## Contexto

El SENAE Ecuador procesa 8,000 declaraciones de exportacion diarias. Con Spark Structured Streaming, el equipo de comercio exterior puede ver en tiempo real: que productos se estan exportando, a que destinos, con que volumen y valor — sin esperar el reporte mensual. La arquitectura Lambda/Kappa con Spark permite procesar tanto el stream en tiempo real como el historico con el mismo codigo SQL — eliminando la deuda tecnica de mantener dos sistemas.

## Instrucciones

1. Crea el archivo `sesion05_spark_streaming_ecuador.py`:

```python
# Spark Structured Streaming - ITSEIA
# Streaming y Procesamiento en Tiempo Real
# SENAE Ecuador — exportaciones tiempo real

import numpy as np
import pandas as pd
import json
import time
import random
from datetime import datetime, timedelta
from collections import defaultdict, deque
import threading
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
random.seed(2026)

print("=" * 65)
print("SPARK STRUCTURED STREAMING — EXPORTACIONES SENAE ECUADOR")
print("=" * 65)

# ================================================
# CONCEPTOS: SPARK STREAMING vs FLINK vs KAFKA STREAMS
# ================================================
print("\n--- COMPARACION FRAMEWORKS STREAMING ---")

comparacion = {
    "Latencia":       {"Kafka Streams": "< 5ms",  "Flink": "< 100ms", "Spark SS": "100ms-1s"},
    "Throughput":     {"Kafka Streams": "Medio",   "Flink": "Alto",    "Spark SS": "Muy alto"},
    "Modelo":         {"Kafka Streams": "Evento-a-evento", "Flink": "Evento-a-evento", "Spark SS": "Micro-batch"},
    "Estado":         {"Kafka Streams": "RocksDB", "Flink": "RocksDB", "Spark SS": "HDFS/S3 checkpoint"},
    "SQL":            {"Kafka Streams": "KSQL sep.","Flink": "Flink SQL", "Spark SS": "SparkSQL nativo"},
    "ML integration": {"Kafka Streams": "Manual",  "Flink": "FlinkML", "Spark SS": "MLlib nativo"},
    "Batch + stream": {"Kafka Streams": "No",      "Flink": "Limitado","Spark SS": "Mismo API"},
    "Ecosistema":     {"Kafka Streams": "Kafka",   "Flink": "Flink",   "Spark SS": "Spark (Delta, MLlib)"},
}

print(f"\n  {'Feature':<20} {'Kafka Streams':<20} {'Flink':<18} {'Spark SS'}")
print(f"  {'-'*72}")
for feat, vals in comparacion.items():
    print(f"  {feat:<20} {vals['Kafka Streams']:<20} {vals['Flink']:<18} {vals['Spark SS']}")

print(f"\n  Regla: Kafka Streams = microservicio. Flink = baja latencia. Spark = batch+stream unificado.")

# ================================================
# DATOS: DECLARACIONES EXPORTACION SENAE
# ================================================
print("\n--- GENERANDO STREAM EXPORTACIONES SENAE ---")

PRODUCTOS_EXPORT = {
    "banano":        {"precio_ton": 280,  "principales_destinos": ["EEUU","UE","Colombia"]},
    "flores":        {"precio_ton": 3500, "principales_destinos": ["EEUU","UE","Rusia"]},
    "cacao":         {"precio_ton": 2800, "principales_destinos": ["EEUU","UE","Japon"]},
    "camaron":       {"precio_ton": 4200, "principales_destinos": ["China","EEUU","UE"]},
    "atun":          {"precio_ton": 1800, "principales_destinos": ["UE","Colombia","Peru"]},
    "petroleo":      {"precio_ton": 550,  "principales_destinos": ["China","EEUU","Panama"]},
    "madera":        {"precio_ton": 420,  "principales_destinos": ["China","EEUU","Colombia"]},
    "concentrado":   {"precio_ton": 800,  "principales_destinos": ["China","Peru","Colombia"]},
}

DESTINOS  = ["EEUU","UE","China","Colombia","Peru","Rusia","Japon","Panama","Chile"]
EXPORTADORES = [f"EXP{i:04d}" for i in range(200)]

def generar_declaracion_export(ts_segundos):
    producto   = random.choice(list(PRODUCTOS_EXPORT.keys()))
    info       = PRODUCTOS_EXPORT[producto]
    toneladas  = round(np.random.lognormal(2, 1.5), 2)
    precio_ton = info["precio_ton"] * np.random.uniform(0.85, 1.15)
    valor_fob  = round(toneladas * precio_ton, 2)
    destino    = random.choice(info["principales_destinos"] + DESTINOS[:3])

    return {
        "declaracion_id": f"DAE{random.randint(1000000, 9999999)}",
        "exportador_ruc": random.choice(EXPORTADORES),
        "producto":        producto,
        "subpartida":      f"{random.randint(100,999)}.{random.randint(10,99)}",
        "destino":         destino,
        "toneladas":       toneladas,
        "valor_fob_usd":   valor_fob,
        "precio_ton_usd":  round(precio_ton, 2),
        "aduana":          random.choice(["Guayaquil","Quito","Esmeraldas","Manta"]),
        "timestamp_s":     ts_segundos,
        "timestamp":       datetime.now().isoformat(),
    }

# Generar stream de 5,000 declaraciones simulando llegada continua
N_DECLARACIONES = 5_000
stream_export   = []
t = 0
for _ in range(N_DECLARACIONES):
    t += random.randint(1, 30)  # nueva declaracion cada 1-30 segundos
    stream_export.append(generar_declaracion_export(t))

print(f"  Declaraciones generadas: {len(stream_export):,}")
print(f"  Ventana temporal:        {t//3600:.1f} horas de stream")
print(f"  Productos: {', '.join(PRODUCTOS_EXPORT.keys())}")

# ================================================
# MICRO-BATCH PROCESSOR (SIMULA SPARK SS)
# ================================================
print("\n--- MICRO-BATCH PROCESSING (Simula Spark SS) ---")

class SparkStreamingSimulado:
    """
    Simula Spark Structured Streaming en modo micro-batch.
    Cada trigger_interval_s se procesa el batch acumulado.
    """

    def __init__(self, trigger_interval_s=60, checkpoint_dir="/tmp/checkpoint_senae"):
        self.trigger_interval = trigger_interval_s
        self.checkpoint_dir   = checkpoint_dir
        self.buffer           = []
        self.ultimo_proceso_t = 0
        self.batch_id         = 0
        self.estado_acum      = defaultdict(lambda: {"valor_fob": 0.0, "toneladas": 0.0, "n": 0})

    def ingestar(self, declaracion):
        """Agrega declaracion al buffer del batch actual."""
        self.buffer.append(declaracion)

    def deberia_procesar(self, timestamp_actual):
        return timestamp_actual - self.ultimo_proceso_t >= self.trigger_interval

    def procesar_micro_batch(self, timestamp_actual):
        """Procesa el batch acumulado — simula una ejecucion de Spark SS."""
        if not self.buffer:
            return None

        batch    = self.buffer.copy()
        self.buffer = []
        self.batch_id += 1
        self.ultimo_proceso_t = timestamp_actual

        # === QUERIES SPARK SS ===

        # Query 1: Aggregacion por producto y destino (window 1h)
        agg_producto_destino = defaultdict(lambda: {"valor_fob": 0.0, "toneladas": 0.0, "n": 0})
        for decl in batch:
            k = (decl["producto"], decl["destino"])
            agg_producto_destino[k]["valor_fob"]   += decl["valor_fob_usd"]
            agg_producto_destino[k]["toneladas"]   += decl["toneladas"]
            agg_producto_destino[k]["n"]           += 1

        # Actualizar estado acumulado (como checkpointing)
        for k, v in agg_producto_destino.items():
            self.estado_acum[k]["valor_fob"]  += v["valor_fob"]
            self.estado_acum[k]["toneladas"]  += v["toneladas"]
            self.estado_acum[k]["n"]          += v["n"]

        # Query 2: Top productos por valor FOB en este batch
        por_producto = defaultdict(float)
        for decl in batch:
            por_producto[decl["producto"]] += decl["valor_fob_usd"]

        # Query 3: Deteccion subvaloracion (precio muy bajo vs referencia)
        alertas_subval = []
        for decl in batch:
            precio_ref = PRODUCTOS_EXPORT[decl["producto"]]["precio_ton"]
            if decl["precio_ton_usd"] < precio_ref * 0.6:  # < 60% del precio referencia
                alertas_subval.append({
                    "declaracion_id": decl["declaracion_id"],
                    "producto": decl["producto"],
                    "precio_declarado": decl["precio_ton_usd"],
                    "precio_referencia": precio_ref,
                    "diferencia_pct": round((decl["precio_ton_usd"] / precio_ref - 1) * 100, 1),
                })

        return {
            "batch_id":      self.batch_id,
            "n_declaraciones": len(batch),
            "timestamp":     timestamp_actual,
            "top_productos": dict(sorted(por_producto.items(),
                                          key=lambda x: x[1], reverse=True)[:5]),
            "alertas_subval": alertas_subval,
        }


spark_ss = SparkStreamingSimulado(trigger_interval_s=300)  # micro-batch cada 5 min

# Simular stream en tiempo real
batches_procesados = []
for decl in stream_export:
    spark_ss.ingestar(decl)
    if spark_ss.deberia_procesar(decl["timestamp_s"]):
        resultado = spark_ss.procesar_micro_batch(decl["timestamp_s"])
        if resultado:
            batches_procesados.append(resultado)

# Procesar residuo final
if spark_ss.buffer:
    resultado = spark_ss.procesar_micro_batch(stream_export[-1]["timestamp_s"] + 1)
    if resultado:
        batches_procesados.append(resultado)

print(f"  Micro-batches procesados: {len(batches_procesados)}")
print(f"  Declaraciones por batch:  {np.mean([b['n_declaraciones'] for b in batches_procesados]):.0f} prom")

# ================================================
# RESULTADOS: DASHBOARD SENAE EN TIEMPO REAL
# ================================================
print("\n--- DASHBOARD EXPORTACIONES (Estado acumulado) ---")

# Agrupar por producto
por_producto = defaultdict(lambda: {"valor_fob": 0.0, "toneladas": 0.0, "n": 0})
for (producto, destino), datos in spark_ss.estado_acum.items():
    por_producto[producto]["valor_fob"]  += datos["valor_fob"]
    por_producto[producto]["toneladas"]  += datos["toneladas"]
    por_producto[producto]["n"]          += datos["n"]

print(f"\n  {'Producto':<18} {'Valor FOB USD':>15} {'Toneladas':>12} {'Decl':>6}")
print(f"  {'-'*55}")
for prod, datos in sorted(por_producto.items(),
                            key=lambda x: x[1]["valor_fob"], reverse=True):
    print(f"  {prod:<18} {datos['valor_fob']:>15,.2f} {datos['toneladas']:>12,.1f} "
          f"{datos['n']:>6}")

# Alertas de subvaloracion
total_alertas = sum(len(b["alertas_subval"]) for b in batches_procesados)
print(f"\n  Alertas subvaloracion: {total_alertas}")
if total_alertas > 0:
    primer_batch_con_alertas = next((b for b in batches_procesados if b["alertas_subval"]), None)
    if primer_batch_con_alertas:
        for a in primer_batch_con_alertas["alertas_subval"][:3]:
            print(f"  {a['declaracion_id']}: {a['producto']} a ${a['precio_declarado']:.0f}/ton "
                  f"(ref: ${a['precio_referencia']:.0f}) → {a['diferencia_pct']}%")

# ================================================
# OUTPUT MODES DE SPARK SS
# ================================================
print("\n--- OUTPUT MODES DE SPARK STRUCTURED STREAMING ---")

output_modes = {
    "Append Mode":  {
        "descripcion": "Solo nuevas filas — no actualiza resultados anteriores",
        "cuando":      "Eventos individuales sin agregaciones — log de declaraciones",
        "limitacion":  "No soporta agregaciones con actualizaciones",
    },
    "Update Mode":  {
        "descripcion": "Solo filas que cambiaron — eficiente para dashboards",
        "cuando":      "Agregaciones que cambian con nuevos datos",
        "limitacion":  "Necesita sink que soporte upsert (Delta Lake, Cassandra)",
    },
    "Complete Mode":{
        "descripcion": "Toda la tabla de resultados en cada trigger",
        "cuando":      "Aggregaciones globales — Top N en todo el stream",
        "limitacion":  "Costoso con mucho estado — solo para queries chicas",
    },
}

for modo, info in output_modes.items():
    print(f"\n  [{modo}]")
    for k, v in info.items():
        print(f"    {k:<12}: {v}")

print("\n" + "=" * 65)
print("SPARK STRUCTURED STREAMING — CONCEPTOS CLAVE:")
print("  Micro-batch:    trigger cada N ms/s — throughput > latencia")
print("  Checkpointing:  estado en S3/HDFS — recovery exactamente-una-vez")
print("  Mismo API:      batch y stream con la misma sintaxis DataFrame/SQL")
print("  Delta Lake:     sink natural — ACID, time travel, schema evolution")
print("  Append/Update:  modo de salida — tradeoff entre completitud y eficiencia")
print("  Join streaming: enrichment con tablas estaticas — sin reparticion costosa")
print("=" * 65)
```

3. Implementa el join de streaming con tabla estatica: enriquece cada declaracion de exportacion con el tipo de empresa exportadora (PYME/mediana/grande) desde una tabla de referencia del SRI.

4. Agrega el output mode Update con Delta Lake simulado: mantiene el estado acumulado por producto y actualiza solo las filas que cambian en cada micro-batch.

## Usa IA para...

> Abre Claude y escribe:
> "Implemento Spark Structured Streaming para procesar declaraciones de exportacion del SENAE Ecuador. El stream viene de Kafka (8,000 declaraciones/dia). Necesito: 1) join del stream con una tabla estatica de aranceles (subpartida → arancel %) que se actualiza mensualmente — ¿como hago que el join tome la version mas reciente sin reiniciar el job?, 2) watermark de 2 horas para manejar declaraciones tardias de aduanas remotas (Esmeraldas tiene hasta 4h de delay), 3) escribir el resultado a Delta Lake con modo Update — como convierto el stream a formato Delta con MERGE semantics? Dame el codigo PySpark con writeStream y las configuraciones de checkpoint."

Despues de leer la respuesta:
- Implementa el join con tabla de aranceles (usando broadcast join para la tabla chica).
- Agrega el writer a Delta Lake simulado con append mode y partition by (producto, fecha).

## Que aprendiste

- Spark Structured Streaming usa micro-batches — mayor latencia que Flink pero mismo API que batch.
- El checkpointing en S3/HDFS garantiza exactamente-una-vez semantics tras un fallo.
- El mismo codigo DataFrame/SQL funciona para batch historico y stream — elimina la deuda tecnica Lambda.
- Los output modes (append/update/complete) determinan que filas se escriben al sink en cada trigger.
- El broadcast join con tabla estatica enriquece cada evento sin mover datos (no shuffle).
- Delta Lake como sink de streaming da ACID, time travel y schema evolution — el sink ideal para stream.

## Reto extra

Construye el sistema de comercio exterior en tiempo real para el SENAE Ecuador: Spark Structured Streaming leyendo declaraciones de exportacion/importacion de Kafka, join con tablas de aranceles, precios de referencia COMEX y lista de empresas SICE, deteccion de subvaloracion (precio declarado < 70% del precio de referencia), calculo de aranceles en tiempo real por subpartida, alerta automatica al Analista de Control cuando se detecta posible fraude aduanero, escritura a Delta Lake con particionamiento por (producto, mes, aduana), y dashboard Streamlit mostrando la balanza comercial del dia anterior actualizada cada 15 minutos.
