# Ejercicio Sesion 1: Apache Kafka — Conceptos y Arquitectura

**Materia:** Streaming y Procesamiento en Tiempo Real
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Comprender la arquitectura de Apache Kafka: brokers, topics, particiones, offsets, grupos de consumidores y retencion de mensajes — implementando un simulador que modela el flujo de transacciones del sistema de pagos interbancario del BCE Ecuador en tiempo real.

## Contexto

El BCE Ecuador opera el Sistema de Pagos Interbancarios (SPI) que procesa 2 millones de transacciones diarias entre los 30 bancos privados del pais. Kafka es el backbone de datos en tiempo real de empresas como LinkedIn (origen de Kafka), Uber, Netflix y la CNBV de Mexico. En Ecuador, la banca privada y las fintechs (Kushki, Paymentez) ya usan Kafka para procesar pagos en tiempo real con latencia de milisegundos.

## Instrucciones

1. Crea el archivo `sesion01_kafka_conceptos_ecuador.py`:

```python
# Apache Kafka Conceptos - ITSEIA
# Streaming y Procesamiento en Tiempo Real
# SPI BCE Ecuador — arquitectura Kafka simulada

import json
import time
import hashlib
import random
import threading
from datetime import datetime, timedelta
from collections import defaultdict, deque
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
random.seed(2026)

print("=" * 65)
print("APACHE KAFKA — CONCEPTOS Y ARQUITECTURA")
print("Sistema de Pagos Interbancarios BCE Ecuador")
print("=" * 65)

# ================================================
# CONCEPTOS KAFKA
# ================================================
print("\n--- CONCEPTOS FUNDAMENTALES ---")

conceptos = {
    "Broker":          "Servidor Kafka — almacena y sirve mensajes. Cluster = N brokers",
    "Topic":           "Canal de mensajes — 'transacciones_spi', 'alertas_fraude'",
    "Particion":       "Subdivision del topic — paralelismo y orden garantizado por particion",
    "Offset":          "Posicion del mensaje en la particion — inmutable, secuencial",
    "Producer":        "Publica mensajes a un topic — BCE, bancos, cajeros",
    "Consumer":        "Lee mensajes de un topic — sistema antifraude, conciliacion",
    "Consumer Group":  "Conjunto de consumidores que colaboran — cada mensaje va a UN miembro",
    "Retencion":       "Cuanto tiempo guardar mensajes — default 7 dias, configurable",
    "Replication":     "Copias del topic en distintos brokers — tolerance a fallos",
    "Log Compaction":  "Conservar solo el ultimo valor por key — ideal para estados",
}

for k, v in conceptos.items():
    print(f"  {k:<18}: {v}")

# ================================================
# TOPOLOGIA: SPI BCE ECUADOR
# ================================================
print("\n--- TOPOLOGIA KAFKA: SPI BCE ECUADOR ---")

topologia = {
    "Topics": {
        "transacciones.raw":     "Todas las transacciones SPI — alta frecuencia",
        "transacciones.validadas": "Pasaron validacion basica del BCE",
        "alertas.fraude":        "Transacciones sospechosas — antifraude en tiempo real",
        "notificaciones.banco":  "Confirmaciones a banco origen/destino",
        "auditoria.log":         "Log inmutable para SBS — retencion 7 anos",
        "metricas.kpi":          "Agregaciones 1-min para dashboard ejecutivo",
    },
    "Producers": {
        "Banco Pichincha":   "Core bancario → Kafka via Debezium CDC",
        "Banco Guayaquil":   "API REST → Kafka producer",
        "Cajeros ATM (BCE)": "Device → Kafka via MQTT bridge",
        "Sistema SPI BCE":   "Validador central → publica resultado",
    },
    "Consumers": {
        "Antifraude (ML)":   "Group: antifraude | Particiones: 12 | Lag SLA: < 500ms",
        "Conciliacion":      "Group: conciliacion | Batch nocturno | Desde offset 0",
        "Notificador":       "Group: notify | Push a bancos confirmacion",
        "Dashboard CEO":     "Group: dashboard | Ventana 1-min agregaciones",
        "Auditoria SBS":     "Group: audit | Consume TODO, retencion S3 7 anos",
    },
}

for categoria, items in topologia.items():
    print(f"\n  [{categoria}]")
    for nombre, desc in items.items():
        print(f"    {nombre:<25}: {desc}")

# ================================================
# SIMULADOR DE BROKER KAFKA
# ================================================
print("\n--- SIMULADOR KAFKA BROKER ---")

class KafkaSimulado:
    """Simulador minimal de Apache Kafka para entender conceptos."""

    def __init__(self, brokers=3, replication_factor=2):
        self.brokers          = brokers
        self.replication      = replication_factor
        self.topics           = {}
        self.consumer_groups  = {}
        self.partitions_count = {}

    def create_topic(self, nombre, particiones=6, retencion_horas=168):
        self.topics[nombre] = {
            "particiones": [[] for _ in range(particiones)],
            "n_particiones": particiones,
            "retencion_horas": retencion_horas,
            "creado": datetime.now().isoformat(),
        }
        self.partitions_count[nombre] = particiones
        print(f"  Topic creado: '{nombre}' | {particiones} particiones | "
              f"Retencion: {retencion_horas}h | Repl: {self.replication}x")

    def producir(self, topic, key, value, headers=None):
        """Publica un mensaje. Particion = hash(key) % n_partitions."""
        if topic not in self.topics:
            raise ValueError(f"Topic '{topic}' no existe")

        n_part   = self.topics[topic]["n_particiones"]
        particion = hash(str(key)) % n_part if key else 0
        mensajes  = self.topics[topic]["particiones"][particion]
        offset    = len(mensajes)

        mensaje = {
            "offset":    offset,
            "particion": particion,
            "key":       key,
            "value":     value,
            "timestamp": datetime.now().isoformat(),
            "headers":   headers or {},
        }
        mensajes.append(mensaje)
        return offset, particion

    def consumir(self, topic, group, desde_offset=0, max_mensajes=10):
        """Consume mensajes de un topic para un grupo."""
        if group not in self.consumer_groups:
            self.consumer_groups[group] = {}
        if topic not in self.consumer_groups[group]:
            self.consumer_groups[group][topic] = defaultdict(lambda: desde_offset)

        mensajes_consumidos = []
        n_part = self.topics[topic]["n_particiones"]

        for p in range(n_part):
            offset_actual = self.consumer_groups[group][topic][p]
            particion     = self.topics[topic]["particiones"][p]
            nuevos        = particion[offset_actual:offset_actual + max_mensajes]
            mensajes_consumidos.extend(nuevos)
            if nuevos:
                self.consumer_groups[group][topic][p] += len(nuevos)

        return mensajes_consumidos

    def lag(self, topic, group):
        """Calcula el lag (mensajes pendientes) de un consumer group."""
        if group not in self.consumer_groups or topic not in self.consumer_groups[group]:
            total = sum(len(p) for p in self.topics[topic]["particiones"])
            return total

        lag_total = 0
        for p_idx, particion in enumerate(self.topics[topic]["particiones"]):
            offset_consumido = self.consumer_groups[group][topic].get(p_idx, 0)
            lag_total += max(0, len(particion) - offset_consumido)
        return lag_total

    def stats(self, topic):
        t = self.topics[topic]
        total_msgs = sum(len(p) for p in t["particiones"])
        return {
            "topic":        topic,
            "particiones":  t["n_particiones"],
            "total_mensajes": total_msgs,
            "msgs_por_partition": [len(p) for p in t["particiones"]],
        }

# ================================================
# DEMO: FLUJO SPI BCE
# ================================================
print("\n--- DEMO: FLUJO DE TRANSACCIONES SPI ---")

kafka = KafkaSimulado(brokers=3, replication_factor=2)
kafka.create_topic("transacciones.raw",      particiones=12, retencion_horas=168)
kafka.create_topic("alertas.fraude",         particiones=4,  retencion_horas=720)
kafka.create_topic("notificaciones.banco",   particiones=8,  retencion_horas=48)

BANCOS = ["Pichincha","Guayaquil","Pacifico","Internacional","Produbanco",
          "Bolivariano","Austro","Loja"]

def generar_transaccion(banco_origen=None):
    banco_o = banco_origen or random.choice(BANCOS)
    banco_d = random.choice([b for b in BANCOS if b != banco_o])
    monto   = round(np.random.lognormal(5, 1.5), 2)
    return {
        "id":          hashlib.md5(f"{time.time()}{random.random()}".encode()).hexdigest()[:16],
        "banco_origen": banco_o,
        "banco_destino": banco_d,
        "monto_usd":   monto,
        "tipo":        random.choice(["transferencia","pago_servicio","nomina","debito"]),
        "timestamp":   datetime.now().isoformat(),
        "canal":       random.choice(["online","mobile","SPI","ATM"]),
    }

# Producir 100 transacciones
print(f"\n  Produciendo transacciones al topic 'transacciones.raw'...")
N_TXN = 100
for _ in range(N_TXN):
    txn   = generar_transaccion()
    offset, part = kafka.producir(
        "transacciones.raw",
        key=txn["banco_origen"],
        value=txn,
        headers={"source": "spi_bce", "version": "2.1"}
    )

stats = kafka.stats("transacciones.raw")
print(f"  Total producido:   {stats['total_mensajes']} mensajes")
print(f"  Por particion:     {stats['msgs_por_partition']}")

# Consumir — grupo antifraude
mensajes_anti = kafka.consumir("transacciones.raw", "antifraude", max_mensajes=10)
print(f"\n  Consumer group 'antifraude' consumio: {len(mensajes_anti)} mensajes")
print(f"  Ejemplo mensaje:")
if mensajes_anti:
    m = mensajes_anti[0]
    print(f"    offset={m['offset']}, particion={m['particion']}")
    print(f"    value: {json.dumps(m['value'], indent=6)[:200]}...")

lag_anti = kafka.lag("transacciones.raw", "antifraude")
print(f"\n  Lag del grupo 'antifraude': {lag_anti} mensajes pendientes")

# ================================================
# PARTICIONAMIENTO Y ORDEN
# ================================================
print("\n--- PARTICIONAMIENTO: ORDEN GARANTIZADO ---")

print("  Garantia de orden en Kafka:")
print("  - Dentro de una particion: orden GARANTIZADO (offset secuencial)")
print("  - Across particiones:     sin garantia de orden global")
print("  - Clave constante:        misma particion = mismo orden para ese banco")

distribucion = defaultdict(int)
for p_idx, particion in enumerate(kafka.topics["transacciones.raw"]["particiones"]):
    for msg in particion:
        distribucion[msg["key"]] += 1

print(f"\n  Distribucion de mensajes por banco (key-based partitioning):")
for banco, cnt in sorted(distribucion.items(), key=lambda x: x[1], reverse=True):
    barra = "#" * int(cnt / 2)
    print(f"  {banco:<15}: {barra} {cnt}")

print("\n" + "=" * 65)
print("KAFKA — CONCEPTOS CLAVE:")
print("  Topic:     canal logico de mensajes — append-only log")
print("  Particion: unidad de paralelismo — orden garantizado dentro")
print("  Offset:    posicion inmutable — permite replay desde cualquier punto")
print("  Key:       determina la particion — misma key = misma particion")
print("  Group:     consumidores colaborando — cada mensaje a UN consumidor del grupo")
print("  Lag:       mensajes pendientes — KPI critico de latencia del sistema")
print("=" * 65)
```

3. Implementa el simulador de rebalanceo de consumidores: cuando un consumer del grupo cae, los otros asumen sus particiones automaticamente.

4. Agrega el calculo de throughput del sistema: mensajes/segundo producidos y consumidos, y el tiempo de procesamiento end-to-end.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy arquitecto de datos en el BCE Ecuador y necesito dimensionar el cluster Kafka para el Sistema de Pagos Interbancarios. Tenemos 2 millones de transacciones diarias con picos de 500 TPS (transacciones por segundo) en horas laborables. Cada mensaje pesa 2KB. Necesito: 1) calcular el numero de brokers, particiones y replication factor para garantizar 99.99% uptime y latencia < 5ms P99, 2) configuracion de retencion para cumplir los 7 anos de auditoria de la SBS sin costos excesivos (usar S3 Tiered Storage), 3) estrategia de compresion (gzip vs lz4 vs zstd) para el volumen de transacciones. Dame los calculos paso a paso y la configuracion server.properties."

Despues de leer la respuesta:
- Implementa el calculador de capacidad de Kafka en Python.
- Genera el server.properties recomendado para el BCE Ecuador.

## Que aprendiste

- Kafka es un log distribuido e inmutable — los mensajes no se borran al consumirlos.
- La particion es la unidad de paralelismo y orden — mas particiones = mas throughput pero mas overhead.
- La key del mensaje determina la particion — misma key garantiza orden para ese flujo de datos.
- El consumer group permite escalar horizontalmente la lectura — N consumers para N particiones.
- El lag es el KPI critico — mide cuantos mensajes estan pendientes de procesamiento.
- La retencion configurable permite replay historico — reprocessar todos los pagos desde hace 7 dias.

## Reto extra

Diseña e implementa la arquitectura Kafka completa para el sistema de pagos moviles de Banco Pichincha Ecuador: 5 millones de transacciones diarias en hora pico, 8 topics (payments.raw, fraud.alerts, notifications.push, reconciliation.daily, audit.immutable, analytics.realtime, loyalty.points, merchant.settlements), consumer groups especializados con SLAs distintos, schema registry con Avro para compatibilidad hacia atras/adelante, monitoreo con Prometheus + Grafana mostrando lag por consumer group, y disaster recovery con replicacion cross-region entre AWS us-east-1 y us-west-2.
