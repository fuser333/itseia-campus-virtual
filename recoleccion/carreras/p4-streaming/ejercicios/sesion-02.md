# Ejercicio Sesion 2: Kafka Producers y Consumers

**Materia:** Streaming y Procesamiento en Tiempo Real
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Implementar Kafka Producers y Consumers con patrones de produccion avanzados: particionamiento por clave, batching, compresion, idempotencia, y patrones de consumo (at-least-once, exactly-once) — aplicados al pipeline de datos en tiempo real del sistema tributario SRI Ecuador.

## Contexto

El SRI Ecuador necesita procesar declaraciones de IVA en tiempo real durante el mes de cierre: 50,000 declaraciones en las ultimas 2 horas del plazo. Sin Kafka, el sistema web colapsa. Con Kafka como buffer, las declaraciones se reciben a velocidad maxima y se procesan con backpressure controlado. Los patrones de idempotencia garantizan que ninguna declaracion se procese dos veces — critico para sistemas tributarios.

## Instrucciones

1. Crea el archivo `sesion02_kafka_producers_consumers_ecuador.py`:

```python
# Kafka Producers + Consumers - ITSEIA
# Streaming y Procesamiento en Tiempo Real
# SRI Ecuador — declaraciones IVA tiempo real

import json
import time
import hashlib
import random
import threading
from datetime import datetime
from collections import defaultdict, deque
from queue import Queue, Empty
import numpy as np
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
random.seed(2026)

print("=" * 65)
print("KAFKA PRODUCERS + CONSUMERS — SRI ECUADOR")
print("Declaraciones IVA: 50,000 en 2 horas de cierre")
print("=" * 65)

# ================================================
# CONFIGURACION PRODUCER
# ================================================
print("\n--- CONFIGURACION PRODUCER ---")

config_producer = {
    "bootstrap.servers":  "broker1:9092,broker2:9093,broker3:9094",
    "acks":               "all",      # esperar confirmacion de todos los replicas
    "retries":            5,
    "retry.backoff.ms":   100,
    "linger.ms":          10,         # esperar 10ms para hacer batch
    "batch.size":         65536,      # 64KB por batch
    "compression.type":   "snappy",   # 40-50% reduccion
    "max.in.flight.requests.per.connection": 1,  # idempotencia
    "enable.idempotence": True,       # exactamente una vez por particion
    "buffer.memory":      33554432,   # 32MB buffer local
}

config_consumer = {
    "bootstrap.servers":  "broker1:9092,broker2:9093,broker3:9094",
    "group.id":           "sri-procesador-iva",
    "auto.offset.reset":  "earliest",
    "enable.auto.commit": False,      # commit manual para at-least-once
    "max.poll.records":   500,        # 500 mensajes por batch
    "fetch.min.bytes":    1024,       # esperar al menos 1KB
    "fetch.max.wait.ms":  500,
    "session.timeout.ms": 30000,
    "heartbeat.interval.ms": 3000,
}

print("  Producer config:")
for k, v in config_producer.items():
    print(f"    {k:<45}: {v}")

# ================================================
# PRODUCTOR SIMULADO — DECLARACIONES SRI
# ================================================
print("\n--- PRODUCTOR DE DECLARACIONES IVA ---")

class KafkaBrokerSimulado:
    """Broker Kafka minimal para simular producers y consumers."""

    def __init__(self):
        self.topics    = {}
        self.sequencia = defaultdict(lambda: defaultdict(int))

    def ensure_topic(self, nombre, n_parts=12):
        if nombre not in self.topics:
            self.topics[nombre] = [deque() for _ in range(n_parts)]
        return n_parts

    def producir(self, topic, key, value, n_parts=12):
        self.ensure_topic(topic, n_parts)
        part   = abs(hash(str(key))) % n_parts
        offset = self.sequencia[topic][part]
        self.topics[topic][part].append({
            "offset": offset, "key": key, "value": value,
            "timestamp": datetime.now().isoformat(),
        })
        self.sequencia[topic][part] += 1
        return part, offset

    def consumir_batch(self, topic, group, n_parts, batch_size=500):
        if f"{topic}_{group}_offsets" not in self.__dict__:
            setattr(self, f"{topic}_{group}_offsets", defaultdict(int))
        offsets = getattr(self, f"{topic}_{group}_offsets")

        mensajes = []
        for p in range(n_parts):
            offset_actual = offsets[p]
            particion     = self.topics.get(topic, [deque() for _ in range(n_parts)])[p]
            parte          = list(particion)[offset_actual:offset_actual+batch_size//n_parts]
            mensajes.extend(parte)

        return mensajes

    def stats_topic(self, topic):
        if topic not in self.topics:
            return {}
        return {p: len(q) for p, q in enumerate(self.topics[topic])}


BROKER = KafkaBrokerSimulado()

class ProductorDeclaracionesSRI:
    """
    Produce declaraciones de IVA al topic Kafka.
    Patrones: batching, retry con backoff, idempotencia via idempotency_key.
    """

    TOPIC       = "sri.declaraciones.iva"
    N_PARTES    = 12
    BATCH_SIZE  = 100
    LINGER_MS   = 10

    TIPOS_CONTRIBUYENTE = ["natural","sociedad","rimpe"]
    TIPOS_DECL         = ["mensual","semestral","anual"]

    def __init__(self, broker):
        self.broker       = broker
        self.buffer       = []
        self.n_producidos = 0
        self.n_reintentos = 0
        self.errores      = 0

    def _generar_ruc(self):
        base = f"17{random.randint(10000000,99999999):08d}"
        return base + "001"

    def generar_declaracion(self):
        ruc = self._generar_ruc()
        monto_ventas = round(np.random.lognormal(7, 1.5), 2)
        iva_cobrado  = round(monto_ventas * 0.15, 2)
        iva_pagado   = round(monto_ventas * 0.08, 2)
        return {
            "idempotency_key":  hashlib.md5(f"{ruc}{time.time_ns()}".encode()).hexdigest(),
            "ruc":              ruc,
            "periodo":          "2024-12",
            "tipo_contribuyente": random.choice(self.TIPOS_CONTRIBUYENTE),
            "monto_ventas":     monto_ventas,
            "iva_cobrado":      iva_cobrado,
            "iva_pagado":       iva_pagado,
            "iva_neto":         round(iva_cobrado - iva_pagado, 2),
            "tipo_declaracion": random.choice(self.TIPOS_DECL),
            "timestamp_envio":  datetime.now().isoformat(),
            "canal":            random.choice(["web_sri","app_movil","api_contador"]),
        }

    def enviar_batch(self, declaraciones):
        """Envia un batch de declaraciones con retry."""
        enviados = 0
        for decl in declaraciones:
            max_reintentos = 3
            for intento in range(max_reintentos):
                try:
                    # Simular fallo ocasional (2%)
                    if random.random() < 0.02:
                        raise ConnectionError("Timeout broker")

                    self.broker.producir(
                        self.TOPIC,
                        key=decl["ruc"],
                        value=decl,
                        n_parts=self.N_PARTES
                    )
                    enviados += 1
                    break
                except Exception:
                    self.n_reintentos += 1
                    if intento == max_reintentos - 1:
                        self.errores += 1

        self.n_producidos += enviados
        return enviados

    def producir_cierre_mes(self, n_declaraciones):
        """Simula el cierre de mes: N declaraciones en rafaga."""
        print(f"  Iniciando rafaga: {n_declaraciones:,} declaraciones...")
        t0 = time.perf_counter()

        batches_totales = n_declaraciones // self.BATCH_SIZE
        for batch_i in range(batches_totales):
            batch = [self.generar_declaracion() for _ in range(self.BATCH_SIZE)]
            self.enviar_batch(batch)

            if (batch_i + 1) % 20 == 0:
                elapsed = time.perf_counter() - t0
                tps = self.n_producidos / elapsed
                print(f"    Batch {batch_i+1:>4}/{batches_totales} | "
                      f"{self.n_producidos:>6,} producidos | {tps:.0f} TPS")

        elapsed = time.perf_counter() - t0
        return {
            "total_producidos": self.n_producidos,
            "errores":         self.errores,
            "reintentos":      self.n_reintentos,
            "tiempo_s":        round(elapsed, 2),
            "tps_promedio":    round(self.n_producidos / elapsed),
        }


productor = ProductorDeclaracionesSRI(BROKER)
stats_prod = productor.producir_cierre_mes(n_declaraciones=2000)

print(f"\n  Resultado produccion:")
for k, v in stats_prod.items():
    print(f"  {k:<22}: {v}")

# Distribucion por particion
dist_parts = BROKER.stats_topic(ProductorDeclaracionesSRI.TOPIC)
print(f"\n  Distribucion por particion:")
for p, cnt in sorted(dist_parts.items()):
    barra = "#" * (cnt // 10)
    print(f"  Particion {p:>2}: {barra} {cnt}")

# ================================================
# CONSUMIDOR SIMULADO — PROCESADOR IVA
# ================================================
print("\n--- CONSUMIDOR: PROCESADOR IVA SRI ---")

class ConsumidorProcesadorIVA:
    """
    Consumes declaraciones IVA y aplica validaciones.
    Patron: at-least-once con manual commit.
    """

    def __init__(self, broker, group_id, n_workers=3):
        self.broker    = broker
        self.group_id  = group_id
        self.n_workers = n_workers
        self.offsets   = defaultdict(int)
        self.procesados = 0
        self.rechazados = 0
        self.pendientes_commit = []

    def validar(self, declaracion):
        """Validaciones de negocio SRI."""
        errores = []
        if declaracion.get("iva_neto", 0) < 0:
            errores.append("iva_neto_negativo")
        if declaracion.get("monto_ventas", 0) <= 0:
            errores.append("ventas_invalidas")
        if not declaracion.get("ruc", "").endswith("001"):
            errores.append("ruc_formato_invalido")
        return len(errores) == 0, errores

    def procesar_mensaje(self, msg):
        """Procesa un mensaje individual."""
        decl = msg["value"]
        valido, errores = self.validar(decl)

        if valido:
            self.procesados += 1
            return {"status": "OK", "iva_neto": decl["iva_neto"]}
        else:
            self.rechazados += 1
            return {"status": "RECHAZADO", "errores": errores}

    def consumir_y_procesar(self, topic, n_parts, max_mensajes=500):
        """Loop de consumo con commit manual."""
        all_messages = []
        for p in range(n_parts):
            offset   = self.offsets[p]
            particion = list(self.broker.topics.get(topic, [deque()]*n_parts)[p])
            msgs      = particion[offset:offset + max_mensajes//n_parts]
            all_messages.extend(msgs)

        resultados = []
        for msg in all_messages:
            resultado = self.procesar_mensaje(msg)
            resultados.append(resultado)
            self.pendientes_commit.append((msg["offset"], msg.get("particion", 0)))

        # Commit de offsets (manual)
        for p in range(n_parts):
            msgs_en_p = [m for m in all_messages if m.get("particion", 0) == p]
            if msgs_en_p:
                self.offsets[p] = max(m["offset"] for m in msgs_en_p) + 1

        self.pendientes_commit = []
        return resultados

    def stats(self):
        total = self.procesados + self.rechazados
        return {
            "procesados": self.procesados,
            "rechazados": self.rechazados,
            "tasa_rechazo_pct": round(self.rechazados / total * 100, 2) if total > 0 else 0,
        }


consumidor = ConsumidorProcesadorIVA(BROKER, group_id="sri-procesador-iva")
resultados = consumidor.consumir_y_procesar(
    ProductorDeclaracionesSRI.TOPIC,
    n_parts=12,
    max_mensajes=1000
)

print(f"  Mensajes consumidos:  {len(resultados)}")
stats_cons = consumidor.stats()
for k, v in stats_cons.items():
    print(f"  {k:<25}: {v}")

iva_total = sum(r["iva_neto"] for r in resultados if r["status"] == "OK")
print(f"\n  IVA neto total procesado: ${iva_total:,.2f}")

# ================================================
# PATRONES DE ENTREGA
# ================================================
print("\n--- PATRONES DE ENTREGA DE MENSAJES ---")

patrones = {
    "At-most-once": {
        "descripcion": "Commit ANTES de procesar — puede perder mensajes si falla el proceso",
        "uso":         "Logs no criticos, metricas de telemetria",
        "riesgo":      "Perdida de datos — no para transacciones SRI",
        "codigo":      "consumer.commit() → procesar(msg)",
    },
    "At-least-once": {
        "descripcion": "Commit DESPUES de procesar — puede duplicar si falla el commit",
        "uso":         "La mayoria de pipelines con logica idempotente",
        "riesgo":      "Duplicados — manejar con idempotency_key en la BD",
        "codigo":      "procesar(msg) → consumer.commit()",
    },
    "Exactly-once": {
        "descripcion": "Transaccion atomica Kafka + BD — ni perdidas ni duplicados",
        "uso":         "Pagos SPI, declaraciones SRI, operaciones financieras",
        "riesgo":      "Mayor latencia y complejidad",
        "codigo":      "kafka_transaction + db_transaction atomica",
    },
}

for patron, info in patrones.items():
    print(f"\n  [{patron}]")
    for k, v in info.items():
        print(f"    {k:<12}: {v}")

print("\n" + "=" * 65)
print("PRODUCERS/CONSUMERS — CONCEPTOS CLAVE:")
print("  acks=all:      esperar todos los replicas — no perder datos")
print("  idempotencia:  mismo mensaje no se escribe dos veces por producer")
print("  linger.ms:     batching — mas throughput a costa de latencia")
print("  manual commit: at-least-once — control total del offset")
print("  batch.size:    agrupar mensajes — reduce overhead de red")
print("  compression:   snappy/lz4/zstd — 40-70% menos bytes en red")
print("=" * 65)
```

3. Implementa el patron Dead Letter Queue (DLQ): mensajes que fallan 3 veces van al topic `sri.declaraciones.dlq` con el error adjunto para revision manual.

4. Agrega el calculo del lag del consumer group en tiempo real: cada 5 segundos imprime el lag de cada particion y una alerta si el lag total supera 10,000 mensajes.

## Usa IA para...

> Abre Claude y escribe:
> "Implemento un consumer Kafka para procesar declaraciones de IVA del SRI Ecuador. El sistema procesa 500 mensajes/segundo en condiciones normales pero en el cierre de mes baja a 50/segundo porque la BD Oracle se satura. Necesito: 1) backpressure pattern — el consumer detecta que la BD esta lenta y reduce la velocidad de consumo para no acumular mensajes en memoria, 2) circuit breaker — si la BD falla completamente, parar el consumer y enviar alerta, no seguir acumulando en la cola de reintentos, 3) timeout por mensaje — si procesar un mensaje tarda > 2 segundos, marcarlo como fallido y enviarlo al DLQ. Dame el patron con codigo Python usando confluent-kafka."

Despues de leer la respuesta:
- Implementa el backpressure simulado: si el tiempo de procesamiento promedio > 100ms, reducir batch_size a la mitad.
- Agrega el circuit breaker con estados: CLOSED, OPEN, HALF-OPEN.

## Que aprendiste

- `acks=all` con `enable.idempotence=True` garantiza exactamente-una-escritura por producer.
- El `linger.ms` y `batch.size` controlan el tradeoff throughput vs latencia en el producer.
- El commit manual de offsets permite at-least-once — si el proceso falla, re-lee desde el ultimo offset.
- El Dead Letter Queue captura mensajes que no pueden procesarse — evita bloquear el pipeline principal.
- El backpressure evita acumular mensajes en memoria cuando el consumidor es mas lento que el productor.
- El circuit breaker protege el sistema downstream cuando hay fallos — evita cascada de errores.

## Reto extra

Construye el sistema de procesamiento de declaraciones del SRI Ecuador para el cierre de mes: producer con rate limiting (max 1,000 TPS configurable), consumer group con 6 instancias paralelas, validacion de cedula/RUC ecuatoriana con digito verificador, DLQ con reintentos exponenciales (1s, 2s, 4s, 8s), exactamente-once semantics usando transacciones Kafka + PostgreSQL, monitor de lag con alerta SMS via Twilio cuando lag > 5,000 mensajes, y dashboard en tiempo real mostrando TPS, lag, tasa de error y suma del IVA procesado por minuto.
