# Ejercicio Sesion 8: Proyecto Sistema de Streaming Empresarial

**Materia:** Streaming y Procesamiento en Tiempo Real
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 90 min

## Objetivo

Construir un sistema de streaming empresarial completo para Corporacion Favorita Ecuador: pipeline Kafka con producers/consumers, CDC del sistema de ventas, deteccion de fraude en tiempo real con ventanas temporales, alertas de inventario, y dashboard operacional — integrando todos los conceptos del curso en una arquitectura de produccion.

## Contexto

Corporacion Favorita opera 400 supermercados con 18,500 empleados y USD 2.8 billones en ventas anuales. Su mayor riesgo operativo: un sistema de fraude interno donde cajeros hacen "sweethearting" (pasar productos sin cobrar a complices). Actualmente detectan estos casos semanas despues en auditorias. Un sistema de streaming que analiza cada transaccion de caja en tiempo real puede detectar patrones anomalos en segundos — y alertar al supervisor de turno antes de que el cajero termine su turno.

## Instrucciones

1. Crea el archivo `sesion08_streaming_favorita_ecuador.py`:

```python
# Proyecto Streaming Empresarial - ITSEIA
# Streaming y Procesamiento en Tiempo Real
# Corporacion Favorita Ecuador — tiempo real completo

import numpy as np
import pandas as pd
import json
import time
import random
import hashlib
from datetime import datetime, timedelta
from collections import defaultdict, deque
from enum import Enum
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
random.seed(2026)
TIMESTAMP = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

print("=" * 70)
print("SISTEMA STREAMING EMPRESARIAL — CORPORACION FAVORITA ECUADOR")
print(f"Build: {TIMESTAMP}")
print("=" * 70)

# ================================================
# ARQUITECTURA DEL SISTEMA
# ================================================
print("\n--- ARQUITECTURA: STREAMING FAVORITA ---")

arquitectura_streaming = {
    "Fuentes": {
        "POS (400 sucursales)": "Cada transaccion de caja → Kafka producer via API",
        "Sistema inventario":   "CDC Debezium PostgreSQL → kafka.inventario.cambios",
        "Empleados":            "Swipes de acceso → kafka.rrhh.turnos",
        "Precios":              "Cambios de precio → kafka.precios.actualizaciones",
    },
    "Kafka Topics": {
        "favorita.pos.transacciones":  "Ventas en tiempo real — particionado por sucursal",
        "favorita.inventario.stock":    "CDC stock por SKU — log compacted",
        "favorita.fraude.alertas":      "Alertas antifraude — retencion 90 dias",
        "favorita.operaciones.kpis":    "KPIs operacionales por minuto",
    },
    "Procesamiento": {
        "Antifraude (Kafka Streams)": "Ventana 30min por cajero — sweethearting detection",
        "Inventario (Flink)":         "Stock bajo umbral → alerta reposicion inmediata",
        "KPIs (Spark SS)":            "Ventas por sucursal cada 5min — dashboard CEO",
    },
    "Sinks": {
        "Delta Lake (S3)":    "Historico transacciones — analitica batch + stream",
        "Redis":              "Cache KPIs — dashboard con latencia < 50ms",
        "PostgreSQL DW":      "Marts para BI — Tableau/Superset",
        "PagerDuty/WhatsApp": "Notificaciones equipo operaciones",
    },
}

for capa, items in arquitectura_streaming.items():
    print(f"\n  [{capa}]")
    for nombre, desc in items.items():
        print(f"    {nombre:<35}: {desc}")

# ================================================
# SECCION 1: GENERADOR DE DATOS
# ================================================
print("\n\n--- SECCION 1: GENERACION DE DATOS FAVORITA ---")

SUCURSALES = [
    {"id": f"SC{i:03d}", "nombre": f"Supermaxi_{i:03d}", "zona": random.choice(
        ["norte","centro","sur","valles"])} for i in range(1, 21)
]
N_CAJEROS_POR_SUCURSAL = 8
CAJEROS = [
    {"id": f"CAJ{s['id']}{j:02d}", "sucursal": s["id"],
     "nombre": f"Cajero_{j}", "turno": random.choice(["manana","tarde","noche"]),
     "es_sospechoso": random.random() < 0.03}  # 3% cajeros con comportamiento anomalo
    for s in SUCURSALES
    for j in range(1, N_CAJEROS_POR_CAJERO := N_CAJEROS_POR_SUCURSAL + 1)
]

CATEGORIAS = ["alimentos","bebidas","lacteos","carnes","panaderia",
              "limpieza","cuidado_personal","electrodomesticos"]
SKUS       = [f"SKU{i:06d}" for i in range(1, 5001)]

def generar_transaccion_caja(cajero, minuto, es_fraudulenta=False):
    n_items = random.randint(2, 25)
    items   = []
    total   = 0.0
    n_items_sin_cobrar = 0

    for _ in range(n_items):
        precio = round(np.random.lognormal(1.5, 0.8), 2)
        cantidad = random.randint(1, 5)
        cobrado  = True

        # Sweethearting: cajero no cobra algunos items al complice
        if es_fraudulenta and random.random() < 0.25:
            cobrado = False
            n_items_sin_cobrar += 1

        if cobrado:
            total += precio * cantidad

        items.append({
            "sku":      random.choice(SKUS),
            "categoria": random.choice(CATEGORIAS),
            "precio":   precio,
            "cantidad": cantidad,
            "cobrado":  cobrado,
        })

    return {
        "txn_id":       hashlib.md5(f"{cajero['id']}{minuto}{random.random()}".encode()).hexdigest()[:16],
        "cajero_id":    cajero["id"],
        "sucursal_id":  cajero["sucursal"],
        "minuto":       minuto,
        "n_items":      n_items,
        "n_items_cobrados": sum(1 for i in items if i["cobrado"]),
        "n_items_sin_cobrar": n_items_sin_cobrar,
        "total_usd":    round(total, 2),
        "tiempo_seg":   random.randint(30, 300),  # duracion de la transaccion
        "metodo_pago":  random.choice(["efectivo","tarjeta_debito","tarjeta_credito","transferencia"]),
        "es_fraudulenta": es_fraudulenta,
        "items":        items[:3],  # solo primeros 3 para no saturar memoria
    }

# Generar 2 horas de stream (120 minutos)
MINUTOS = 120
stream_pos = []
for minuto in range(MINUTOS):
    # ~5 transacciones por cajero por hora = ~0.08 por minuto
    for cajero in CAJEROS:
        if random.random() < 0.08:
            es_fraudulenta = cajero["es_sospechoso"] and random.random() < 0.3
            txn = generar_transaccion_caja(cajero, minuto, es_fraudulenta)
            stream_pos.append(txn)

# Datos de inventario (stock actual)
inventario_inicial = {sku: random.randint(5, 200) for sku in SKUS[:500]}

print(f"  Sucursales:   {len(SUCURSALES)}")
print(f"  Cajeros:      {len(CAJEROS)}")
print(f"  Transacciones generadas: {len(stream_pos):,}")
print(f"  Cajeros sospechosos: {sum(1 for c in CAJEROS if c['es_sospechoso'])}")
print(f"  Txns fraudulentas: {sum(1 for t in stream_pos if t['es_fraudulenta'])}")

# ================================================
# SECCION 2: BROKER KAFKA (SIMPLIFICADO)
# ================================================
print("\n--- SECCION 2: KAFKA BROKER ---")

class KafkaBrokerFavorita:
    def __init__(self):
        self.topics = defaultdict(list)

    def produce(self, topic, key, value):
        self.topics[topic].append({"key": key, "value": value, "ts": datetime.now().isoformat()})

    def consume_all(self, topic):
        return self.topics.get(topic, [])

    def stats(self):
        return {t: len(msgs) for t, msgs in self.topics.items()}

kafka = KafkaBrokerFavorita()

# Publicar todas las transacciones
for txn in stream_pos:
    kafka.produce("favorita.pos.transacciones", key=txn["sucursal_id"], value=txn)

print(f"  Topic stats: {kafka.stats()}")

# ================================================
# SECCION 3: DETECCION SWEETHEARTING (KAFKA STREAMS)
# ================================================
print("\n--- SECCION 3: DETECCION SWEETHEARTING ---")

class DetectorSweethearting:
    """
    Ventana 30 minutos por cajero.
    Patron: ratio items_sin_cobrar/total_items > 20% en la ventana.
    """

    VENTANA_MIN = 30
    RATIO_UMBRAL = 0.15
    MIN_TXNS = 3

    def __init__(self):
        self.estado        = defaultdict(lambda: deque())
        self.alertas       = []
        self.cooldown      = defaultdict(lambda: -99)

    def procesar(self, txn):
        cajero_id = txn["cajero_id"]
        minuto    = txn["minuto"]

        # Limpiar fuera de la ventana
        ventana = self.estado[cajero_id]
        while ventana and minuto - ventana[0]["minuto"] > self.VENTANA_MIN:
            ventana.popleft()

        ventana.append({
            "minuto":       minuto,
            "n_items":      txn["n_items"],
            "n_sin_cobrar": txn["n_items_sin_cobrar"],
            "total_usd":    txn["total_usd"],
        })

        # Evaluar si hay patron
        if len(ventana) >= self.MIN_TXNS:
            total_items     = sum(v["n_items"] for v in ventana)
            total_sin_cobrar = sum(v["n_sin_cobrar"] for v in ventana)
            ratio           = total_sin_cobrar / total_items if total_items > 0 else 0

            if ratio > self.RATIO_UMBRAL and minuto - self.cooldown[cajero_id] > 30:
                self.cooldown[cajero_id] = minuto
                sucursal = txn["sucursal_id"]
                perdida_estimada = sum(v["total_usd"] for v in ventana) * ratio

                self.alertas.append({
                    "tipo":      "SWEETHEARTING",
                    "cajero_id": cajero_id,
                    "sucursal":  sucursal,
                    "minuto":    minuto,
                    "n_txns":    len(ventana),
                    "ratio_sin_cobrar": round(ratio * 100, 1),
                    "perdida_estimada_usd": round(perdida_estimada, 2),
                    "severidad": "ALTA" if ratio > 0.3 else "MEDIA",
                })

        return len(self.alertas) > 0


detector_fraud = DetectorSweethearting()
for txn in sorted(stream_pos, key=lambda x: x["minuto"]):
    detector_fraud.procesar(txn)

print(f"\n  Alertas sweethearting: {len(detector_fraud.alertas)}")
# Evaluar precision
cajeros_sospechosos_ids = {c["id"] for c in CAJEROS if c["es_sospechoso"]}
verdaderos_positivos = sum(1 for a in detector_fraud.alertas
                             if a["cajero_id"] in cajeros_sospechosos_ids)
falsos_positivos     = len(detector_fraud.alertas) - verdaderos_positivos
print(f"  Verdaderos positivos:  {verdaderos_positivos}")
print(f"  Falsos positivos:      {falsos_positivos}")
if detector_fraud.alertas:
    for a in detector_fraud.alertas[:3]:
        tp = "REAL" if a["cajero_id"] in cajeros_sospechosos_ids else "FP"
        print(f"  [{tp}] {a['cajero_id']} | ratio={a['ratio_sin_cobrar']:.1f}% | "
              f"perdida=${a['perdida_estimada_usd']:.2f} | min={a['minuto']}")

# ================================================
# SECCION 4: KPIs EN TIEMPO REAL (SPARK SS)
# ================================================
print("\n--- SECCION 4: KPIs OPERACIONALES ---")

# Micro-batch cada 15 minutos
kpis_por_ventana = []
for ventana_inicio in range(0, MINUTOS, 15):
    ventana_fin = ventana_inicio + 15
    txns_ventana = [t for t in stream_pos
                     if ventana_inicio <= t["minuto"] < ventana_fin]

    if not txns_ventana:
        continue

    por_sucursal = defaultdict(lambda: {"ventas": 0.0, "txns": 0, "items": 0})
    for txn in txns_ventana:
        por_sucursal[txn["sucursal_id"]]["ventas"] += txn["total_usd"]
        por_sucursal[txn["sucursal_id"]]["txns"]   += 1
        por_sucursal[txn["sucursal_id"]]["items"]  += txn["n_items"]

    kpis_por_ventana.append({
        "ventana":    f"{ventana_inicio:03d}-{ventana_fin:03d}",
        "total_ventas": round(sum(t["total_usd"] for t in txns_ventana), 2),
        "total_txns":   len(txns_ventana),
        "sucursales_activas": len(por_sucursal),
        "venta_promedio_txn": round(np.mean([t["total_usd"] for t in txns_ventana]), 2),
        "top_sucursal": max(por_sucursal.items(), key=lambda x: x[1]["ventas"])[0]
                         if por_sucursal else "N/A",
    })

print(f"\n  KPIs por micro-batch (15 min):")
print(f"  {'Ventana':>10} {'Ventas USD':>14} {'Txns':>8} {'Suc. Activas':>14} {'Ticket Prom':>12}")
print(f"  {'-'*62}")
for kpi in kpis_por_ventana:
    print(f"  {kpi['ventana']:>10} {kpi['total_ventas']:>14,.2f} {kpi['total_txns']:>8} "
          f"{kpi['sucursales_activas']:>14} {kpi['venta_promedio_txn']:>12.2f}")

# ================================================
# SECCION 5: OBSERVABILIDAD DEL PIPELINE
# ================================================
print("\n--- SECCION 5: OBSERVABILIDAD ---")

total_ventas_stream = sum(t["total_usd"] for t in stream_pos)
total_fraude_estimado = sum(a["perdida_estimada_usd"] for a in detector_fraud.alertas)

observabilidad = {
    "kafka": {
        "topics": len(kafka.stats()),
        "mensajes_totales": sum(kafka.stats().values()),
        "lag_estimado_ms": 45,
    },
    "antifraude": {
        "alertas_generadas": len(detector_fraud.alertas),
        "cajeros_monitoreados": len(detector_fraud.estado),
        "perdida_estimada_usd": round(total_fraude_estimado, 2),
    },
    "kpis": {
        "micro_batches_procesados": len(kpis_por_ventana),
        "ventas_totales_usd": round(total_ventas_stream, 2),
        "txns_procesadas": len(stream_pos),
        "throughput_tps": round(len(stream_pos) / (MINUTOS * 60), 2),
    },
    "sistema": {
        "uptime_pct": 99.9,
        "latencia_promedio_ms": 87,
        "build_timestamp": TIMESTAMP,
    },
}

for categoria, datos in observabilidad.items():
    print(f"\n  [{categoria.upper()}]")
    for k, v in datos.items():
        print(f"    {k:<35}: {v}")

print("\n" + "=" * 70)
print("STREAMING EMPRESARIAL — COMPONENTES INTEGRADOS:")
print("  Kafka:        backbone de mensajeria — producers/consumers/topics")
print("  Kafka Streams: deteccion sweethearting con ventanas temporales 30min")
print("  Spark SS:     KPIs operacionales por micro-batch 15min")
print("  CDC:          cambios de inventario propagados sin impacto en OLTP")
print("  Alertas:      reglas por umbral + escalation chain a supervisor")
print("  Observabilidad: lag, latencia, throughput, impacto negocio")
print("=" * 70)
```

3. Agrega el modulo de inventario: cuando una sucursal vende > 80% del stock de un SKU en la ventana de 1 hora, emite alerta de reposicion urgente al sistema de logistica de Favorita.

4. Implementa el replay: dado un cajero bajo investigacion, replaya todas sus transacciones de las ultimas 24 horas desde el offset de Kafka y recalcula el patron de fraude con el umbral ajustado.

## Usa IA para...

> Abre Claude y escribe:
> "Soy el Director de Tecnologia de Corporacion Favorita Ecuador. Implementamos deteccion de sweethearting (cajero no cobra items a complices) con Kafka Streams. El problema es que el 15% de las alertas son falsos positivos — cajeros que hacen descuentos validos por productos danados o devoluciones. Necesito: 1) enriquecer el stream de transacciones con el registro de autorizaciones de descuento (tabla en PostgreSQL) para filtrar los descuentos validos antes de evaluar el patron, 2) agregar el contexto del cajero: horas trabajadas hoy, historial de comportamiento de los ultimos 30 dias, tipo de producto en la transaccion sospechosa, 3) ML model en streaming: score de riesgo 0-1 para cada transaccion basado en las features del cajero + turno + historial. ¿Como integro el join del stream con la tabla de descuentos autorizados en Kafka Streams (KTable join)?"

Despues de leer la respuesta:
- Implementa el join del stream con la KTable de descuentos autorizados.
- Agrega el score de riesgo con una formula ponderada de 5 factores.

## Que aprendiste

- Una arquitectura de streaming empresarial combina Kafka + Kafka Streams + Spark SS segun los SLAs.
- La deteccion de sweethearting con ventanas temporales captura patrones que el batch no puede ver.
- Los KPIs en micro-batch dan visibilidad operacional sin la complejidad del streaming evento-a-evento.
- El join con KTable permite enriquecer el stream en tiempo real con datos de referencia.
- La observabilidad del pipeline (lag, latencia, throughput) es tan importante como los resultados de negocio.
- El tradeoff precision/recall en sistemas de fraude tiene costo economico directo — umbral = decision de negocio.

## Reto extra

Construye el sistema de streaming completo para Corporacion Favorita Ecuador: 400 sucursales × 8 cajeros cada una, Kafka con 12 particiones por topic para alta disponibilidad, Kafka Streams para sweethearting con join KTable de descuentos autorizados, Flink para deteccion de brecha de inventario en tiempo real, Spark Structured Streaming para consolidar ventas por hora en Delta Lake, dashboard ejecutivo actualizando KPIs cada 30 segundos con Grafana, y sistema de notificaciones inteligente (WhatsApp a supervisor de turno, email a gerente de zona, SMS a CTO si las ventas caen > 20% vs mismo dia semana anterior). El sistema debe manejar 10,000 transacciones/minuto en hora pico del viernes por la tarde.
