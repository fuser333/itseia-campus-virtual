# Ejercicio Sesion 4: Apache Flink — Stream Processing Avanzado

**Materia:** Streaming y Procesamiento en Tiempo Real
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Aplicar Apache Flink para procesamiento de streams con garantias exactamente-una-vez: event time vs processing time, watermarks, operadores con estado complejo, y CEP (Complex Event Processing) — para la deteccion de patrones de lavado de dinero en el sistema financiero ecuatoriano supervisado por la UAFE.

## Contexto

La UAFE (Unidad de Analisis Financiero y Economico) de Ecuador monitorea transacciones sospechosas para detectar lavado de activos. Los patrones clasicos: "smurfing" (multiples depositos pequenos para evitar el umbral de $10,000), "round tripping" (dinero sale y regresa disfrazado), y transacciones en rapidez inusual. Apache Flink con CEP puede detectar estos patrones en milisegundos — antes de que la transaccion se complete — no horas despues como con batch processing.

## Instrucciones

1. Crea el archivo `sesion04_flink_stream_processing_ecuador.py`:

```python
# Apache Flink Stream Processing - ITSEIA
# Streaming y Procesamiento en Tiempo Real
# UAFE Ecuador — deteccion patrones lavado dinero

import numpy as np
import pandas as pd
import json
import time
import random
from datetime import datetime, timedelta
from collections import defaultdict, deque
from typing import List, Dict, Optional
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
random.seed(2026)

print("=" * 65)
print("APACHE FLINK — CEP: PATRONES LAVADO DINERO UAFE ECUADOR")
print("=" * 65)

# ================================================
# CONCEPTOS FLINK vs KAFKA STREAMS
# ================================================
print("\n--- FLINK vs KAFKA STREAMS ---")

comparacion = {
    "Modelo":          {"Kafka Streams": "Libreria Java/Python",       "Flink": "Framework distribuido"},
    "Deploy":          {"Kafka Streams": "Embebido en la app",         "Flink": "Cluster separado"},
    "Estado":          {"Kafka Streams": "RocksDB local",              "Flink": "RocksDB + checkpoints HDFS/S3"},
    "Exactamente-una": {"Kafka Streams": "Si (con Kafka transactions)", "Flink": "Si (checkpointing atomico)"},
    "Latencia":        {"Kafka Streams": "ms (local)",                  "Flink": "ms-segundos"},
    "CEP":             {"Kafka Streams": "Manual",                      "Flink": "FlinkCEP nativo"},
    "SQL":             {"Kafka Streams": "Limitado (KSQL separado)",    "Flink": "Flink SQL completo"},
    "Casos de uso":    {"Kafka Streams": "Microservicios, pipelines ligeros", "Flink": "Analytics complejos, ML en stream"},
}

print(f"  {'Feature':<20} {'Kafka Streams':<30} {'Flink':<35}")
print(f"  {'-'*85}")
for feat, vals in comparacion.items():
    print(f"  {feat:<20} {vals['Kafka Streams']:<30} {vals['Flink']:<35}")

# ================================================
# CONCEPTOS EVENT TIME vs PROCESSING TIME
# ================================================
print("\n--- EVENT TIME vs PROCESSING TIME ---")

tiempos = {
    "Event Time":     {
        "definicion": "Cuando ocurrio el evento en el mundo real",
        "fuente":     "Timestamp embebido en el mensaje (campo 'timestamp')",
        "ventaja":    "Correcto — no le afecta el delay de red o late arrivals",
        "desventaja": "Necesita watermarks para saber cuando cerrar ventanas",
        "ejemplo":    "Transaccion realizada a las 14:32:07 — ese es el event time",
    },
    "Processing Time":{
        "definicion": "Cuando Flink/Kafka recibe y procesa el evento",
        "fuente":     "Reloj del sistema del worker",
        "ventaja":    "Simple — no requiere watermarks",
        "desventaja": "Incorrecto si hay latencia variable o reorders",
        "ejemplo":    "El sistema lo recibe a las 14:32:45 — 38s de delay de red",
    },
    "Watermark":      {
        "definicion": "Marcador de progreso del event time — 'ningun evento llegara antes de T'",
        "uso":        "Cierra ventanas de event time cuando el watermark avanza",
        "gracia":     "Watermark = max_event_time - gracia — permite late arrivals",
        "ejemplo":    "Watermark T-5min: aceptar eventos hasta 5 minutos tardios",
    },
}

for nombre, info in tiempos.items():
    print(f"\n  [{nombre}]")
    for k, v in info.items():
        print(f"    {k:<12}: {v}")

# ================================================
# STREAM DE TRANSACCIONES FINANCIERAS
# ================================================
print("\n--- GENERANDO STREAM DE TRANSACCIONES ---")

BANCOS     = ["Pichincha","Guayaquil","Pacifico","Internacional","Produbanco"]
N_CUENTAS  = 500
CUENTAS    = [f"EC{random.randint(10000000,99999999):08d}" for _ in range(N_CUENTAS)]

def generar_transaccion_financiera(hora_base=0, con_patron_sospechoso=False,
                                    cuenta_origen=None):
    origen = cuenta_origen or random.choice(CUENTAS)
    destino = random.choice([c for c in CUENTAS if c != origen])

    if con_patron_sospechoso:
        # Smurfing: monto justo debajo del umbral de reporte ($9,999)
        monto = round(random.uniform(8000, 9999), 2)
    else:
        monto = round(np.random.lognormal(5, 1.5), 2)

    delay_segundos = random.randint(0, 300)  # late arrival

    return {
        "txn_id":       f"TXN{random.randint(100000,999999)}",
        "cuenta_origen": origen,
        "cuenta_destino": destino,
        "monto_usd":    monto,
        "banco_origen": random.choice(BANCOS),
        "banco_destino": random.choice(BANCOS),
        "tipo":         random.choice(["transferencia","deposito","retiro","pago"]),
        "event_time":   hora_base,            # segundos desde inicio
        "processing_time": hora_base + delay_segundos,
        "canal":        random.choice(["online","sucursal","ATM","SPI"]),
    }

# Generar stream mixto: normal + patrones sospechosos
N_NORMAL    = 2000
N_SOSPECHOSO = 50

stream_txn = []

# Transacciones normales
for i in range(N_NORMAL):
    hora = random.randint(0, 86400)
    stream_txn.append(generar_transaccion_financiera(hora_base=hora))

# Patron smurfing: misma cuenta, muchas txn < $10K en 1 hora
cuenta_sospechosa = random.choice(CUENTAS)
hora_inicio_smurf = random.randint(0, 80000)
for j in range(15):  # 15 transacciones en 1 hora
    hora = hora_inicio_smurf + j * 200  # cada 3.3 minutos
    txn  = generar_transaccion_financiera(
        hora_base=hora,
        con_patron_sospechoso=True,
        cuenta_origen=cuenta_sospechosa
    )
    stream_txn.append(txn)

# Ordenar por processing time (como llegarian al sistema)
stream_txn.sort(key=lambda x: x["processing_time"])
print(f"  Transacciones generadas: {len(stream_txn):,}")
print(f"  Cuenta sospechosa:       {cuenta_sospechosa}")

# ================================================
# CEP: DETECCION DE SMURFING
# ================================================
print("\n--- CEP: DETECCION SMURFING (UAFE) ---")

class DetectorSmurfing:
    """
    Simula FlinkCEP para deteccion de smurfing.
    Patron: cuenta_origen hace >= 5 transacciones entre $5K-$9.999K
            dentro de una ventana de 1 hora.
    """

    UMBRAL_MIN    = 5_000
    UMBRAL_MAX    = 9_999
    VENTANA_SEG   = 3_600  # 1 hora
    MIN_TXNS      = 5

    def __init__(self):
        self.estado   = defaultdict(deque)  # cuenta → deque de txns
        self.alertas  = []

    def procesar(self, txn):
        cuenta = txn["cuenta_origen"]
        monto  = txn["monto_usd"]
        t      = txn["processing_time"]

        # Solo analizar transacciones en el rango sospechoso
        if self.UMBRAL_MIN <= monto <= self.UMBRAL_MAX:
            # Limpiar transacciones fuera de la ventana
            ventana_txns = self.estado[cuenta]
            while ventana_txns and t - ventana_txns[0]["t"] > self.VENTANA_SEG:
                ventana_txns.popleft()

            ventana_txns.append({"t": t, "monto": monto, "txn_id": txn["txn_id"]})

            # Verificar si se supero el umbral
            if len(ventana_txns) >= self.MIN_TXNS:
                total = sum(v["monto"] for v in ventana_txns)
                self.alertas.append({
                    "tipo":         "SMURFING",
                    "cuenta":       cuenta,
                    "n_txns":       len(ventana_txns),
                    "monto_total":  round(total, 2),
                    "ventana_min":  self.VENTANA_SEG // 60,
                    "severidad":    "ALTA" if len(ventana_txns) >= 8 else "MEDIA",
                    "reportar_uafe": total > 10_000,
                    "txn_ids":      [v["txn_id"] for v in ventana_txns],
                })
                # Reset para evitar alertas duplicadas
                self.estado[cuenta] = deque()

        return len(self.alertas) > 0


detector_smurf = DetectorSmurfing()
for txn in stream_txn:
    detector_smurf.procesar(txn)

print(f"  Transacciones procesadas: {len(stream_txn):,}")
print(f"  Alertas smurfing:         {len(detector_smurf.alertas)}")
for alerta in detector_smurf.alertas:
    print(f"  [{alerta['severidad']}] Cuenta {alerta['cuenta']}: "
          f"{alerta['n_txns']} txns de ${alerta['monto_total']:,.2f} "
          f"en {alerta['ventana_min']}min "
          f"— {'REPORTAR UAFE' if alerta['reportar_uafe'] else 'monitorear'}")

# ================================================
# CEP: DETECCION ROUND TRIPPING
# ================================================
print("\n--- CEP: ROUND TRIPPING ---")

class DetectorRoundTripping:
    """
    Patron round tripping: A → B → C → A (dinero vuelve al origen)
    en menos de 24 horas con montos similares (±10%).
    """

    VENTANA_SEG = 86_400  # 24 horas
    TOLERANCIA  = 0.10    # ±10% del monto

    def __init__(self):
        self.flujos  = defaultdict(list)  # cuenta_origen → lista de txns
        self.alertas = []

    def procesar(self, txn):
        t       = txn["processing_time"]
        origen  = txn["cuenta_origen"]
        destino = txn["cuenta_destino"]
        monto   = txn["monto_usd"]

        # Buscar si hay un flujo que termine en el origen
        for flujo in self.flujos.get(destino, []):
            if (t - flujo["t_inicio"] <= self.VENTANA_SEG and
                abs(monto - flujo["monto_inicial"]) / flujo["monto_inicial"] <= self.TOLERANCIA):

                # Verificar si alguna etapa del flujo es el origen actual
                if origen in flujo["cadena"] or destino == flujo["cuenta_inicial"]:
                    self.alertas.append({
                        "tipo":           "ROUND_TRIPPING",
                        "cuenta_inicial": flujo["cuenta_inicial"],
                        "cadena":         flujo["cadena"] + [destino],
                        "monto_inicial":  flujo["monto_inicial"],
                        "monto_final":    monto,
                        "duracion_min":   round((t - flujo["t_inicio"]) / 60, 1),
                        "severidad":      "MUY ALTA",
                    })

        # Registrar esta txn como inicio de posible cadena
        self.flujos[origen].append({
            "t_inicio":       t,
            "cuenta_inicial": origen,
            "monto_inicial":  monto,
            "cadena":         [origen],
        })

        # Propagar cadenas existentes
        for flujo in self.flujos.get(origen, []):
            if flujo["cadena"][-1] != origen:
                flujo["cadena"].append(origen)

round_detector = DetectorRoundTripping()
for txn in stream_txn:
    round_detector.procesar(txn)

print(f"  Alertas round tripping: {len(round_detector.alertas)}")
if round_detector.alertas:
    for a in round_detector.alertas[:3]:
        print(f"  {' → '.join(a['cadena'][:3])} | ${a['monto_inicial']:,.2f} "
              f"en {a['duracion_min']}min")

# ================================================
# WATERMARKS Y LATE DATA
# ================================================
print("\n--- WATERMARKS Y LATE DATA ---")

class WatermarkManager:
    """Gestiona el progreso del event time con watermarks."""

    def __init__(self, gracia_segundos=300):
        self.gracia      = gracia_segundos
        self.max_event_t = 0
        self.watermark   = 0
        self.late_count  = 0
        self.on_time_count = 0

    def procesar(self, txn):
        event_t = txn["event_time"]

        if event_t > self.max_event_t:
            self.max_event_t = event_t
            self.watermark   = event_t - self.gracia

        if event_t < self.watermark:
            self.late_count += 1
            return "LATE"
        else:
            self.on_time_count += 1
            return "ON_TIME"

wm = WatermarkManager(gracia_segundos=300)
for txn in stream_txn:
    wm.procesar(txn)

total = wm.on_time_count + wm.late_count
print(f"\n  Gracia del watermark: {wm.gracia}s")
print(f"  On-time:  {wm.on_time_count:,} ({wm.on_time_count/total*100:.1f}%)")
print(f"  Late:     {wm.late_count:,}   ({wm.late_count/total*100:.1f}%)")
print(f"  Watermark final: {wm.watermark}s ({wm.max_event_t - wm.watermark}s delay)")

print("\n" + "=" * 65)
print("APACHE FLINK — CONCEPTOS CLAVE:")
print("  Event Time:   cuando ocurrio el evento — correcto para analytics")
print("  Watermark:    progreso del event time — cierra ventanas tardias")
print("  CEP:          patrones complejos sobre secuencias de eventos")
print("  Smurfing:     N txns < umbral en ventana — lavado de activos")
print("  Round tripping: A→B→C→A mismo monto — ciclo de lavado")
print("  Late data:    llegan fuera de la ventana — tratar o descartar")
print("=" * 65)
```

3. Implementa el patron "velocity check" con Flink CEP: si una cuenta hace mas de 20 transacciones en 10 minutos, independientemente del monto, emitir alerta de acceso no autorizado.

4. Agrega el Flink SQL simulado: crea una vista `transacciones_hora` que agrega monto total por banco por hora y detecta bancos con volumen 3x mayor al promedio historico.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Trabajo en la UAFE Ecuador implementando deteccion de lavado de dinero con Apache Flink. Necesito detectar el patron 'structuring' (dividir grandes montos para evitar el umbral de reporte de $10,000): una persona hace multiples transacciones en 24 horas cuya suma supera $10,000 pero ninguna individualmente lo supera. Con Flink CEP: 1) ¿como defino el patron con PatternAPI que capture este comportamiento?, 2) ¿como manejo el caso donde las transacciones llegan con hasta 2 horas de retraso por problemas de conectividad bancaria?, 3) ¿como integro el resultado con el sistema de reportes STR (Suspicious Transaction Report) de la UAFE via REST API? Dame el codigo Java o Python con FlinkCEP."

Despues de leer la respuesta:
- Implementa la version Python del patron structuring.
- Agrega la generacion automatica del reporte STR en formato JSON para la UAFE.

## Que aprendiste

- Flink procesa en event time — correcto para analytics; processing time es simple pero incorrecto con delays.
- Los watermarks permiten a Flink saber cuando cerrar ventanas a pesar de late-arriving data.
- CEP detecta patrones complejos sobre secuencias de eventos — smurfing, round tripping, velocity.
- El estado de los operadores Flink se guarda en RocksDB local con checkpoints en S3 — recovery tras fallos.
- El tradeoff gracia del watermark: mas gracia = menos eventos tardios descartados pero mayor latencia.
- Flink SQL permite queries SQL sobre streams — misma sintaxis que bases de datos pero sobre eventos continuos.

## Reto extra

Construye el sistema completo de deteccion de lavado de dinero para la UAFE Ecuador: Flink con 5 tipos de patrones CEP (smurfing, round tripping, structuring, velocity check, anomalia geografica), watermarks con gracia adaptativa por banco (bancos rurales tienen mayor delay), estado persistido en RocksDB con checkpoints cada 5 minutos en S3, generacion automatica de STR (Suspicious Transaction Report) en formato UAFE 2024, notificacion en tiempo real al analista de turno via Signal, dashboard Grafana con mapa de calor de alertas por provincia, y replay de historico completo desde S3 para investigaciones judiciales retroactivas.
