# Ejercicio Sesion 3: Kafka Streams — Procesamiento con Estado

**Materia:** Streaming y Procesamiento en Tiempo Real
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 45 min

## Objetivo

Implementar procesamiento stateful de streams con Kafka Streams: ventanas temporales (tumbling, hopping, session), joins de streams, agregaciones con estado, tablas KTable — aplicados a la deteccion de anomalias en el consumo electrico de CELEC Ecuador y el monitoreo de transacciones del SPI en tiempo real.

## Contexto

CELEC EP opera la red electrica del Ecuador con 5 millones de medidores inteligentes que envian lecturas cada 15 minutos. Kafka Streams permite detectar anomalias de consumo en tiempo real: un medidor que normalmente consume 200kWh/mes y de repente reporta 2,000kWh en una hora es probablemente un fraude o un error de lectura. El procesamiento con ventanas temporales agrega lecturas por periodo y compara contra el historico del usuario — sin mover datos a una base de datos externa.

## Instrucciones

1. Crea el archivo `sesion03_kafka_streams_ecuador.py`:

```python
# Kafka Streams — Procesamiento Stateful - ITSEIA
# Streaming y Procesamiento en Tiempo Real
# CELEC Ecuador: anomalias consumo electrico + SPI

import numpy as np
import pandas as pd
import json
import time
import random
from datetime import datetime, timedelta
from collections import defaultdict, deque
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
random.seed(2026)

print("=" * 65)
print("KAFKA STREAMS — PROCESAMIENTO STATEFUL")
print("CELEC Ecuador: anomalias consumo electrico")
print("=" * 65)

# ================================================
# CONCEPTOS KAFKA STREAMS
# ================================================
print("\n--- CONCEPTOS KAFKA STREAMS ---")

conceptos = {
    "KStream":        "Stream continuo e inmutable — cada registro es un evento",
    "KTable":         "Tabla materializada con estado — ultima version por key",
    "GlobalKTable":   "Tabla replicada en TODOS los nodos — joins sin reparticion",
    "Tumbling Window":"Ventanas fijas sin solapamiento — 15min, 1h, 1dia",
    "Hopping Window": "Ventanas con avance y solapamiento — ventana 1h, avance 5min",
    "Session Window": "Ventana por actividad — cierra con N minutos de inactividad",
    "Reparticion":    "Re-agrupar por nueva key — costoso (shuffle)",
    "State Store":    "RocksDB local por particion — almacena agregaciones",
    "Changelog Topic":"Backup del state store en Kafka — recovery tras fallo",
    "Punctuator":     "Callback periodico — emitir resultados cada N segundos",
}

for k, v in conceptos.items():
    print(f"  {k:<20}: {v}")

# ================================================
# GENERADOR DE LECTURAS DE MEDIDORES CELEC
# ================================================
print("\n--- GENERANDO STREAM DE MEDIDORES CELEC ---")

PROVINCIAS    = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua"]
TIPOS_CLIENTE = ["residencial","comercial","industrial","oficial"]

def perfil_consumo(tipo_cliente):
    """Perfil tipico de consumo por tipo de cliente."""
    if tipo_cliente == "residencial":
        return {"base_kwh": 150, "variacion": 0.20, "pico_hora": [18,19,20]}
    elif tipo_cliente == "comercial":
        return {"base_kwh": 800, "variacion": 0.30, "pico_hora": [11,12,14,15]}
    elif tipo_cliente == "industrial":
        return {"base_kwh": 5000, "variacion": 0.15, "pico_hora": [8,9,10,14,15,16]}
    else:
        return {"base_kwh": 300, "variacion": 0.25, "pico_hora": [9,10,11]}

def generar_lectura(medidor_id, tipo_cliente, provincia, hora, con_anomalia=False):
    perfil = perfil_consumo(tipo_cliente)
    base   = perfil["base_kwh"] / 30 / 24  # kWh por hora

    # Factor hora pico
    factor_hora = 1.3 if hora in perfil["pico_hora"] else 1.0

    kwh = base * factor_hora * (1 + np.random.normal(0, perfil["variacion"]))
    kwh = max(0, kwh)

    # Anomalia: 10x el consumo normal
    if con_anomalia:
        kwh *= 10

    return {
        "medidor_id":   medidor_id,
        "tipo_cliente": tipo_cliente,
        "provincia":    provincia,
        "hora":         hora,
        "kwh":          round(kwh, 4),
        "timestamp":    datetime.now().isoformat(),
        "voltaje":      round(np.random.normal(220, 2), 1),
        "corriente":    round(kwh / 220, 3),
    }

# Generar stream de 1,000 medidores x 24 horas
N_MEDIDORES = 200
HORAS       = 24
TASA_ANOMALIA = 0.01  # 1% de medidores con anomalia

medidores = [
    {
        "id":       f"MED{i:05d}",
        "tipo":     random.choice(TIPOS_CLIENTE),
        "prov":     random.choice(PROVINCIAS),
        "anomalia": random.random() < TASA_ANOMALIA,
    }
    for i in range(N_MEDIDORES)
]

stream_lecturas = []
for med in medidores:
    for hora in range(HORAS):
        lectura = generar_lectura(
            med["id"], med["tipo"], med["prov"], hora,
            con_anomalia=(med["anomalia"] and hora in [2, 3])  # anomalia de madrugada
        )
        lectura["medidor_idx"] = medidores.index(med)
        stream_lecturas.append(lectura)

random.shuffle(stream_lecturas)
print(f"  Lecturas generadas:  {len(stream_lecturas):,}")
print(f"  Medidores:           {N_MEDIDORES}")
print(f"  Con anomalia:        {sum(1 for m in medidores if m['anomalia'])}")

# ================================================
# TUMBLING WINDOW: AGREGACION POR HORA
# ================================================
print("\n--- TUMBLING WINDOW (1 hora) ---")

class TumblingWindow:
    """Ventana temporal tumbling — agrega sin solapamiento."""

    def __init__(self, window_hours=1):
        self.window_hours = window_hours
        self.ventanas     = defaultdict(lambda: {"kwh": 0.0, "count": 0, "max": 0.0})

    def agregar(self, medidor_id, hora, kwh):
        ventana_key = (medidor_id, hora // self.window_hours)
        self.ventanas[ventana_key]["kwh"]   += kwh
        self.ventanas[ventana_key]["count"] += 1
        self.ventanas[ventana_key]["max"]    = max(self.ventanas[ventana_key]["max"], kwh)

    def emitir(self, ventana_clave):
        key = ventana_clave
        if key in self.ventanas:
            med_id, v_idx = key
            return {
                "medidor_id": med_id,
                "ventana_inicio": v_idx * self.window_hours,
                "ventana_fin":    (v_idx + 1) * self.window_hours,
                **self.ventanas[key]
            }
        return None


tw_1h = TumblingWindow(window_hours=1)
for lectura in stream_lecturas:
    tw_1h.agregar(lectura["medidor_id"], lectura["hora"], lectura["kwh"])

# Top 5 medidores por consumo total (24h)
consumo_total = defaultdict(float)
for (med_id, v_idx), datos in tw_1h.ventanas.items():
    consumo_total[med_id] += datos["kwh"]

top5 = sorted(consumo_total.items(), key=lambda x: x[1], reverse=True)[:5]
print(f"\n  Top 5 medidores por consumo 24h:")
for med_id, kwh in top5:
    tipo = next(m["tipo"] for m in medidores if m["id"] == med_id)
    print(f"  {med_id} ({tipo:<12}): {kwh:>10.2f} kWh")

# ================================================
# DETECCION DE ANOMALIAS — ZSCORE EN STREAM
# ================================================
print("\n--- DETECCION DE ANOMALIAS EN STREAM ---")

class DetectorAnomalias:
    """
    Detecta anomalias de consumo comparando contra el historial del medidor.
    Estado: media y varianza actualizadas con Welford's algorithm (online).
    """

    def __init__(self, zscore_threshold=3.5, min_observaciones=5):
        self.threshold  = zscore_threshold
        self.min_obs    = min_observaciones
        self.estado     = {}  # medidor_id → {n, mean, M2}

    def _actualizar_stats(self, medidor_id, kwh):
        if medidor_id not in self.estado:
            self.estado[medidor_id] = {"n": 0, "mean": 0.0, "M2": 0.0}

        s = self.estado[medidor_id]
        s["n"] += 1
        delta  = kwh - s["mean"]
        s["mean"] += delta / s["n"]
        s["M2"]   += delta * (kwh - s["mean"])

    def procesar(self, lectura):
        med_id = lectura["medidor_id"]
        kwh    = lectura["kwh"]

        stats = self.estado.get(med_id, {"n": 0, "mean": 0, "M2": 0})

        # Solo detectar si hay suficiente historial
        if stats["n"] >= self.min_obs and stats["M2"] > 0:
            varianza = stats["M2"] / (stats["n"] - 1)
            std      = varianza ** 0.5
            zscore   = (kwh - stats["mean"]) / std if std > 0 else 0

            es_anomalia = abs(zscore) > self.threshold
        else:
            zscore      = 0
            es_anomalia = False

        # Actualizar estadisticas con el nuevo valor
        self._actualizar_stats(med_id, kwh)

        if es_anomalia:
            return {
                "tipo":       "ANOMALIA_CONSUMO",
                "medidor_id": med_id,
                "kwh":        kwh,
                "media_hist": round(stats["mean"], 4),
                "zscore":     round(zscore, 2),
                "hora":       lectura["hora"],
                "provincia":  lectura["provincia"],
                "severidad":  "CRITICA" if abs(zscore) > 6 else "ALTA",
            }
        return None

detector = DetectorAnomalias(zscore_threshold=3.5)
alertas  = []

# Procesar stream en orden de hora para simular tiempo real
stream_ordenado = sorted(stream_lecturas, key=lambda x: (x["hora"], x["medidor_id"]))

for lectura in stream_ordenado:
    alerta = detector.procesar(lectura)
    if alerta:
        alertas.append(alerta)

print(f"  Lecturas procesadas:  {len(stream_lecturas):,}")
print(f"  Alertas detectadas:   {len(alertas)}")

if alertas:
    print(f"\n  Primeras alertas:")
    for a in alertas[:5]:
        print(f"  {a['medidor_id']} | hora={a['hora']} | kwh={a['kwh']:.2f} | "
              f"z={a['zscore']:+.1f} | {a['severidad']}")

# ================================================
# SESSION WINDOW: ACTIVIDAD DE USUARIO
# ================================================
print("\n--- SESSION WINDOW: PATRONES DE USO ---")

class SessionWindowProcessor:
    """
    Agrupa eventos por sesion de actividad.
    Session gap: si no hay actividad en > gap_horas, cierra la sesion.
    """

    def __init__(self, gap_hours=3):
        self.gap_hours = gap_hours
        self.sesiones  = {}  # medidor_id → {inicio, ultimo, eventos, kwh_total}
        self.sesiones_cerradas = []

    def procesar(self, medidor_id, hora, kwh):
        if medidor_id not in self.sesiones:
            self.sesiones[medidor_id] = {
                "inicio": hora, "ultimo": hora,
                "eventos": 1, "kwh_total": kwh
            }
        else:
            sesion = self.sesiones[medidor_id]
            if hora - sesion["ultimo"] > self.gap_hours:
                # Cerrar sesion anterior
                self.sesiones_cerradas.append({
                    "medidor_id": medidor_id,
                    "inicio_h":   sesion["inicio"],
                    "fin_h":      sesion["ultimo"],
                    "duracion_h": sesion["ultimo"] - sesion["inicio"] + 1,
                    "eventos":    sesion["eventos"],
                    "kwh_total":  round(sesion["kwh_total"], 4),
                })
                # Nueva sesion
                self.sesiones[medidor_id] = {
                    "inicio": hora, "ultimo": hora,
                    "eventos": 1, "kwh_total": kwh
                }
            else:
                sesion["ultimo"]    = hora
                sesion["eventos"]  += 1
                sesion["kwh_total"] += kwh

sess_proc = SessionWindowProcessor(gap_hours=4)
for lectura in stream_ordenado:
    sess_proc.procesar(lectura["medidor_id"], lectura["hora"], lectura["kwh"])

print(f"  Sesiones detectadas: {len(sess_proc.sesiones_cerradas)}")
if sess_proc.sesiones_cerradas:
    df_sess = pd.DataFrame(sess_proc.sesiones_cerradas)
    print(f"  Duracion promedio:   {df_sess['duracion_h'].mean():.1f} horas")
    print(f"  kWh/sesion prom:     {df_sess['kwh_total'].mean():.3f}")

# ================================================
# KTABLE: ESTADO ACUMULADO POR MEDIDOR
# ================================================
print("\n--- KTABLE: ESTADO ACUMULADO ---")

class KTableMedidores:
    """
    Simula una KTable — ultima lectura por medidor como estado materializado.
    Actualiza el estado con cada nueva lectura.
    """

    def __init__(self):
        self.tabla = {}

    def upsert(self, medidor_id, lectura):
        if medidor_id not in self.tabla:
            self.tabla[medidor_id] = {
                "kwh_acumulado": 0, "n_lecturas": 0, "ultima_hora": -1,
                "tipo": lectura["tipo_cliente"], "provincia": lectura["provincia"]
            }
        self.tabla[medidor_id]["kwh_acumulado"] += lectura["kwh"]
        self.tabla[medidor_id]["n_lecturas"]    += 1
        self.tabla[medidor_id]["ultima_hora"]    = lectura["hora"]

    def query(self, medidor_id):
        return self.tabla.get(medidor_id)

ktable = KTableMedidores()
for lectura in stream_lecturas:
    ktable.upsert(lectura["medidor_id"], lectura)

# Resumen por tipo de cliente
resumen = defaultdict(lambda: {"medidores": 0, "kwh_total": 0.0})
for med_id, estado in ktable.tabla.items():
    resumen[estado["tipo"]]["medidores"]  += 1
    resumen[estado["tipo"]]["kwh_total"]  += estado["kwh_acumulado"]

print(f"\n  KTable resumen por tipo de cliente:")
for tipo, datos in resumen.items():
    kwh_prom = datos["kwh_total"] / datos["medidores"]
    print(f"  {tipo:<15}: {datos['medidores']:>4} medidores | "
          f"{datos['kwh_total']:>10.2f} kWh total | {kwh_prom:>8.2f} kWh/med")

print("\n" + "=" * 65)
print("KAFKA STREAMS — CONCEPTOS CLAVE:")
print("  KStream:      stream inmutable — cada evento es un hecho")
print("  KTable:       tabla con estado — ultima version por key")
print("  Tumbling:     ventanas fijas — 1h sin solapamiento")
print("  Hopping:      ventanas con avance — overlapping")
print("  Session:      cierra con inactividad — duracion variable")
print("  State Store:  RocksDB local — no necesita BD externa para agregar")
print("  Zscore:       n desviaciones del historial — deteccion anomalias")
print("=" * 65)
```

3. Implementa el join entre el KStream de lecturas de medidores y la KTable de tarifas eléctricas (categoria del medidor → precio/kWh) para calcular el costo en tiempo real.

4. Agrega el Hopping Window de 6 horas con avance de 1 hora: calcula el consumo promedio en ventana deslizante y detecta tendencias de aumento sostenido.

## Usa IA para...

> Abre Gemini y escribe:
> "CELEC Ecuador tiene 5 millones de medidores inteligentes enviando lecturas cada 15 minutos a Kafka. Necesito procesar este stream con Kafka Streams para: 1) calcular el consumo total nacional en tiempo real por tipo de cliente (residencial/comercial/industrial) con una ventana tumbling de 15 minutos, 2) detectar medidores en blackout (sin lectura en 30 minutos), 3) agregar por canton y comparar contra el presupuesto de demanda del CENACE. El throughput es 333,000 eventos/segundo en hora pico. ¿Como diseño la topologia de Kafka Streams? ¿Cuantas particiones necesito? ¿Como manejo el problema de late-arriving data (lecturas que llegan 30 minutos tarde por problemas de conectividad en areas rurales)?"

Despues de leer la respuesta:
- Implementa el manejo de late-arriving data con una gracia de 30 minutos.
- Agrega el detector de blackout: si un medidor no reporta en 30 minutos, emite alerta a CELEC.

## Que aprendiste

- KStream es un log inmutable de eventos; KTable es el estado actual materializado por key.
- Las ventanas tumbling agregadas en el state store local — sin necesitar una BD externa.
- El Welford's algorithm permite calcular media y varianza online (sin guardar todos los datos).
- La session window se adapta a la actividad real — duración variable segun el comportamiento.
- Los joins KStream-KTable enriquecen eventos en tiempo real con datos de referencia.
- El late-arriving data (datos tardios) es el mayor reto del streaming — las ventanas de gracia lo manejan.

## Reto extra

Construye el sistema de deteccion de fraude electrico en tiempo real para CELEC Ecuador: 5 millones de medidores, Kafka Streams con 3 tipos de anomalia (zscore > 4, consumo nocturno > 3x historico, variacion abrupta > 200% en 15 minutos), join con KTable de historial de fraude (reincidentes detectados antes), alerta inmediata al equipo de inspeccion via WhatsApp con coordenadas GPS del medidor, mapa calor de anomalias por canton actualizado cada 5 minutos en dashboard Grafana, y reporte automatico para ARCOTEL con formato regulatorio estándar.
