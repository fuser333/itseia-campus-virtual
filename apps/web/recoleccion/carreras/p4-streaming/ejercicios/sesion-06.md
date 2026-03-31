# Ejercicio Sesion 6: Alertas y Monitoreo en Tiempo Real

**Materia:** Streaming y Procesamiento en Tiempo Real
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 40 min

## Objetivo

Construir un sistema de alertas en tiempo real con reglas dinamicas, escalation chains y dashboards — para el monitoreo operacional de la red hospitalaria del MSP Ecuador: alertas de capacidad de camas, medicamentos criticos, tiempos de espera y disponibilidad de especialistas.

## Contexto

El MSP Ecuador opera 6,000 establecimientos de salud. El Centro de Emergencias Sanitarias (CES) recibe datos de ocupacion de camas, stock de medicamentos y tiempos de espera cada 5 minutos. Sin un sistema de alertas inteligente, el coordinador solo se entera de que un hospital esta al 95% de capacidad cuando ya es demasiado tarde para redirigir pacientes. Un sistema de alertas en tiempo real con reglas por umbral, tendencia y correlacion permite actuar antes, no despues.

## Instrucciones

1. Crea el archivo `sesion06_alertas_monitoreo_realtime_ecuador.py`:

```python
# Alertas y Monitoreo Tiempo Real - ITSEIA
# Streaming y Procesamiento en Tiempo Real
# MSP Ecuador — red hospitalaria en tiempo real

import numpy as np
import pandas as pd
import json
import time
import random
from datetime import datetime, timedelta
from collections import defaultdict, deque
from enum import Enum
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
random.seed(2026)

print("=" * 65)
print("ALERTAS Y MONITOREO EN TIEMPO REAL — MSP ECUADOR")
print("Red Hospitalaria: 6,000 establecimientos")
print("=" * 65)

# ================================================
# CONCEPTOS: ARQUITECTURA DE ALERTAS
# ================================================
print("\n--- ARQUITECTURA DE ALERTAS EN TIEMPO REAL ---")

arquitectura = {
    "Fuentes":       ["Sensores IoT camas ocupadas","API sistema de turnos",
                      "Farmacia digital","HIS (Hospital Info System)"],
    "Kafka Topics":  ["msp.camas.ocupacion","msp.farmacia.stock",
                      "msp.emergencias.tiempos","msp.especialistas.disponibilidad"],
    "Motor Alertas": ["Reglas por umbral (camas > 90%)","Tendencia (stock decreciendo)",
                      "Correlacion (brote = camas + medicamentos simultaneos)",
                      "ML anomaly detection (zscore)"],
    "Canal Notif.":  ["Dashboard CES en tiempo real","SMS a coordinador zonal",
                      "WhatsApp medico de guardia","Email Director Hospital",
                      "API ministerial para reporte automatico"],
}

for categoria, items in arquitectura.items():
    print(f"\n  [{categoria}]")
    for item in items:
        print(f"    - {item}")

# ================================================
# GENERADOR DE DATOS HOSPITALES MSP
# ================================================
print("\n--- DATASET: HOSPITALES MSP ECUADOR ---")

class Severidad(Enum):
    INFO     = 1
    WARN     = 2
    CRITICA  = 3
    EMERGENCIA = 4

HOSPITALES = [
    {"id": "HCAM",  "nombre": "Hospital Carlos Andrade Marin", "provincia": "Pichincha",
     "camas_total": 600, "nivel": 3, "especialidades": 25},
    {"id": "HEG",   "nombre": "Hospital Eugenio Espejo", "provincia": "Pichincha",
     "camas_total": 400, "nivel": 3, "especialidades": 20},
    {"id": "HGUE",  "nombre": "Hospital Guayaquil Abel Gilbert", "provincia": "Guayas",
     "camas_total": 500, "nivel": 3, "especialidades": 22},
    {"id": "HGR",   "nombre": "Hospital General Riobamba", "provincia": "Chimborazo",
     "camas_total": 200, "nivel": 2, "especialidades": 12},
    {"id": "HCV",   "nombre": "Hospital Cuenca Vicente Corral", "provincia": "Azuay",
     "camas_total": 350, "nivel": 3, "especialidades": 18},
    {"id": "HIM",   "nombre": "Hospital Ibarra", "provincia": "Imbabura",
     "camas_total": 180, "nivel": 2, "especialidades": 10},
    {"id": "HLO",   "nombre": "Hospital Loja", "provincia": "Loja",
     "camas_total": 160, "nivel": 2, "especialidades": 9},
    {"id": "HMA",   "nombre": "Hospital Manta Rodolfo", "provincia": "Manabi",
     "camas_total": 150, "nivel": 2, "especialidades": 8},
]

MEDICAMENTOS_CRITICOS = [
    "oxigeno_m3", "insulina_unidades", "heparina_mg",
    "adrenalina_mg", "atropina_mg", "hidrocortisona_mg"
]

def generar_estado_hospital(hospital, minuto, con_crisis=False):
    factor_crisis = 1.3 if con_crisis else 1.0

    camas_total   = hospital["camas_total"]
    ocupacion_base = random.uniform(0.65, 0.85)
    ocupacion     = min(1.0, ocupacion_base * factor_crisis + random.uniform(-0.05, 0.05))
    camas_ocupadas = int(camas_total * ocupacion)

    estado = {
        "hospital_id":   hospital["id"],
        "nombre":        hospital["nombre"],
        "provincia":     hospital["provincia"],
        "nivel":         hospital["nivel"],
        "minuto":        minuto,
        "timestamp":     datetime.now().isoformat(),
        "camas_total":   camas_total,
        "camas_ocupadas": camas_ocupadas,
        "ocupacion_pct":  round(ocupacion * 100, 1),
        "pacientes_emergencia": random.randint(5, 30) * (2 if con_crisis else 1),
        "tiempo_espera_min": int(random.uniform(10, 120) * factor_crisis),
        "especialistas_guardia": max(1, hospital["especialidades"] - random.randint(0, 5)),
    }

    # Stock medicamentos criticos
    for med in MEDICAMENTOS_CRITICOS:
        stock_normal = random.uniform(0.3, 1.0)
        estado[f"stock_{med}"] = round(
            stock_normal * (0.5 if con_crisis and med == "oxigeno_m3" else 1.0), 3
        )

    return estado

# Generar 120 minutos de datos
MINUTOS = 120
N_HOSPITALES = len(HOSPITALES)
CRISIS_HOSPITAL = "HCAM"  # Hospital en crisis a partir de minuto 60
CRISIS_INICIO   = 60

stream_hospitales = []
for minuto in range(MINUTOS):
    for hosp in HOSPITALES:
        en_crisis = (hosp["id"] == CRISIS_HOSPITAL and minuto >= CRISIS_INICIO)
        estado = generar_estado_hospital(hosp, minuto, con_crisis=en_crisis)
        stream_hospitales.append(estado)

print(f"  Registros generados: {len(stream_hospitales):,}")
print(f"  Hospitales:          {N_HOSPITALES}")
print(f"  Periodo:             {MINUTOS} minutos")
print(f"  Crisis simulada:     {CRISIS_HOSPITAL} desde minuto {CRISIS_INICIO}")

# ================================================
# MOTOR DE REGLAS DE ALERTA
# ================================================
print("\n--- MOTOR DE REGLAS DE ALERTA ---")

class ReglaAlerta:
    def __init__(self, nombre, condicion, severidad, descripcion, acciones):
        self.nombre      = nombre
        self.condicion   = condicion    # funcion que recibe el estado del hospital
        self.severidad   = severidad
        self.descripcion = descripcion
        self.acciones    = acciones

REGLAS = [
    ReglaAlerta(
        nombre="ocupacion_critica",
        condicion=lambda e: e["ocupacion_pct"] >= 95,
        severidad=Severidad.EMERGENCIA,
        descripcion="Hospital al {:.0f}% de capacidad — redirigir pacientes",
        acciones=["SMS director", "Activar protocolo redistribucion", "Notificar CES nacional"],
    ),
    ReglaAlerta(
        nombre="ocupacion_alta",
        condicion=lambda e: 85 <= e["ocupacion_pct"] < 95,
        severidad=Severidad.CRITICA,
        descripcion="Ocupacion alta {:.0f}% — preparar redireccion",
        acciones=["Email director", "Alertar hospital mas cercano"],
    ),
    ReglaAlerta(
        nombre="stock_oxigeno_critico",
        condicion=lambda e: e.get("stock_oxigeno_m3", 1) < 0.15,
        severidad=Severidad.EMERGENCIA,
        descripcion="Stock oxigeno critico ({:.0%}) — suministro en riesgo",
        acciones=["Llamada emergencia proveedor", "Activar reserva estrategica MSP"],
    ),
    ReglaAlerta(
        nombre="tiempo_espera_alto",
        condicion=lambda e: e["tiempo_espera_min"] > 90,
        severidad=Severidad.WARN,
        descripcion="Tiempo espera {:.0f}min — supera estandar MSP 60min",
        acciones=["Notificar administrador", "Abrir consulta adicional"],
    ),
    ReglaAlerta(
        nombre="especialistas_insuficientes",
        condicion=lambda e: e["especialistas_guardia"] < e["nivel"] * 2,
        severidad=Severidad.CRITICA,
        descripcion="Solo {} especialistas en guardia — nivel {} requiere mas",
        acciones=["Llamar especialista de refuerzo", "Activar lista de espera guardias"],
    ),
]

# ================================================
# PROCESADOR DE ALERTAS
# ================================================

class ProcesadorAlertas:

    def __init__(self, reglas, cooldown_min=10):
        self.reglas      = reglas
        self.cooldown    = cooldown_min * 60  # en segundos simulados
        self.ultima_alerta = defaultdict(lambda: -9999)
        self.alertas_log  = []
        self.estado_por_hospital = {}

    def procesar(self, estado):
        hosp_id = estado["hospital_id"]
        minuto  = estado["minuto"]

        self.estado_por_hospital[hosp_id] = estado
        nuevas_alertas = []

        for regla in self.reglas:
            try:
                if regla.condicion(estado):
                    clave_cooldown = f"{hosp_id}_{regla.nombre}"
                    if minuto - self.ultima_alerta[clave_cooldown] >= self.cooldown:
                        self.ultima_alerta[clave_cooldown] = minuto

                        alerta = {
                            "ts":           datetime.now().isoformat(),
                            "minuto":       minuto,
                            "hospital_id":  hosp_id,
                            "hospital_nom": estado["nombre"],
                            "provincia":    estado["provincia"],
                            "regla":        regla.nombre,
                            "severidad":    regla.severidad.name,
                            "valor_clave":  estado.get("ocupacion_pct", estado.get("tiempo_espera_min", 0)),
                            "acciones":     regla.acciones,
                        }
                        self.alertas_log.append(alerta)
                        nuevas_alertas.append(alerta)
            except Exception:
                pass

        return nuevas_alertas

    def dashboard_summary(self):
        """Resumen ejecutivo del estado actual de la red."""
        if not self.estado_por_hospital:
            return {}

        ocupaciones = [e["ocupacion_pct"] for e in self.estado_por_hospital.values()]
        tiempos     = [e["tiempo_espera_min"] for e in self.estado_por_hospital.values()]

        by_severidad = defaultdict(int)
        for a in self.alertas_log:
            by_severidad[a["severidad"]] += 1

        return {
            "hospitales_monitoreados": len(self.estado_por_hospital),
            "ocupacion_promedio_pct":  round(np.mean(ocupaciones), 1),
            "ocupacion_maxima_pct":    round(max(ocupaciones), 1),
            "tiempo_espera_prom_min":  round(np.mean(tiempos), 0),
            "total_alertas":           len(self.alertas_log),
            "por_severidad":           dict(by_severidad),
            "hospitales_criticos":     [
                e["hospital_id"] for e in self.estado_por_hospital.values()
                if e["ocupacion_pct"] >= 85
            ],
        }


procesador = ProcesadorAlertas(REGLAS, cooldown_min=15)
nuevas_alertas_total = []

for estado in stream_hospitales:
    nuevas = procesador.procesar(estado)
    nuevas_alertas_total.extend(nuevas)

# ================================================
# RESULTADOS Y DASHBOARD
# ================================================
print(f"\n  Total alertas generadas: {len(procesador.alertas_log)}")

# Alertas por severidad
by_sev = defaultdict(int)
for a in procesador.alertas_log:
    by_sev[a["severidad"]] += 1
for sev, cnt in sorted(by_sev.items(), key=lambda x: x[1], reverse=True):
    print(f"  {sev:<12}: {cnt}")

# Top hospitales con mas alertas
by_hosp = defaultdict(int)
for a in procesador.alertas_log:
    by_hosp[a["hospital_id"]] += 1
print(f"\n  Top hospitales con mas alertas:")
for hosp, cnt in sorted(by_hosp.items(), key=lambda x: x[1], reverse=True)[:5]:
    nom = next(h["nombre"] for h in HOSPITALES if h["id"] == hosp)
    print(f"  {hosp:<8} ({nom[:35]:<35}): {cnt} alertas")

# Dashboard ejecutivo
summary = procesador.dashboard_summary()
print(f"\n  === DASHBOARD EJECUTIVO MSP ===")
for k, v in summary.items():
    print(f"  {k:<35}: {v}")

# Muestra de alertas de emergencia
emergencias = [a for a in procesador.alertas_log if a["severidad"] == "EMERGENCIA"]
if emergencias:
    print(f"\n  Alertas EMERGENCIA ({len(emergencias)}):")
    for a in emergencias[:5]:
        print(f"  [Minuto {a['minuto']:>3}] {a['hospital_id']} | {a['regla']:<30} | {a['provincia']}")

# ================================================
# ESCALATION CHAIN
# ================================================
print("\n--- ESCALATION CHAIN ---")

cadena_escalacion = {
    "INFO":      ["Solo log — no notificacion"],
    "WARN":      ["Email administrador del hospital", "Dashboard CES (color amarillo)"],
    "CRITICA":   ["SMS director hospital", "Email coordinador zonal MSP",
                  "Dashboard CES (color naranja)", "Registro en sistema nacional"],
    "EMERGENCIA":["Llamada automatica director + coordinador zonal",
                  "SMS viceministro si > 3 hospitales en emergencia",
                  "Dashboard CES (color rojo parpadeante)",
                  "Activacion automatica protocolo contingencia MSP",
                  "Reporte automatico al COE Nacional si brote"],
}

for nivel, acciones in cadena_escalacion.items():
    print(f"\n  [{nivel}]")
    for a in acciones:
        print(f"    {a}")

print("\n" + "=" * 65)
print("ALERTAS TIEMPO REAL — CONCEPTOS CLAVE:")
print("  Motor reglas:  condicion + severidad + accion — separacion de concerns")
print("  Cooldown:      evitar spam de alertas repetidas — ventana de silencio")
print("  Escalation:    INFO → WARN → CRITICA → EMERGENCIA segun impacto")
print("  Tendencia:     no solo umbral — detectar patron de deterioro continuo")
print("  Correlacion:   multiples metricas simultáneas = brote vs caso aislado")
print("  Dashboard:     estado actual + historico de alertas + KPIs ejecutivos")
print("=" * 65)
```

3. Implementa la deteccion de tendencias: si una metrica sube mas de 5% en cada uno de los ultimos 3 registros consecutivos, emitir alerta de "tendencia peligrosa" aunque aun no llegue al umbral.

4. Agrega la correlacion de alertas: si 3 o mas hospitales de la misma provincia tienen alertas CRITICA en el mismo minuto, elevar automaticamente a EMERGENCIA y notificar al Ministerio.

## Usa IA para...

> Abre Gemini y escribe:
> "Diseño el sistema de alertas en tiempo real para la red hospitalaria del MSP Ecuador (6,000 establecimientos). El problema es el 'alert fatigue': los coordinadores zonales reciben 200+ alertas por turno y dejan de prestarles atencion. Necesito: 1) algoritmo de deduplicacion y agrupacion de alertas correlacionadas (misma causa raiz), 2) scoring de prioridad dinámico que considere contexto (lunes laboral vs domingo, temporada gripal, etc.), 3) auto-resolucion: si la metrica vuelve a normal en 30 minutos, marcar alerta como 'auto-resuelta' sin accion humana. ¿Como implemento un sistema de alertas inteligente que envíe máximo 10 alertas por hora al coordinador pero sin perder ninguna EMERGENCIA?"

Despues de leer la respuesta:
- Implementa el algoritmo de agrupacion de alertas correlacionadas.
- Agrega el scoring de prioridad con contexto temporal (dia, hora, estacionalidad).

## Que aprendiste

- Un motor de reglas separa la logica de deteccion de la logica de notificacion — mantenible y extensible.
- El cooldown previene el alert fatigue — la misma alerta no se dispara mas de una vez cada N minutos.
- La escalation chain define quien recibe que segun la severidad — evita saturar al director con WARN.
- La deteccion de tendencias es mas util que el umbral puntual — anticipa el problema antes de llegar al limite.
- La correlacion de alertas detecta causas raiz — N hospitales con mismos sintomas = brote epidemico.
- La auto-resolucion reduce el ruido — alertas que se resuelven solas no necesitan atencion humana.

## Reto extra

Construye el Sistema Nacional de Monitoreo Sanitario del Ecuador (SNMS): 6,000 establecimientos MSP enviando telemetria cada 5 minutos via Kafka, motor de reglas con 50 condiciones parametrizables en base de datos (sin codigo), algoritmo de deduplicacion que agrupa alertas de la misma causa raiz en las ultimas 2 horas, scoring de prioridad con 12 factores contextuales (temporada, dia, zona geografica, historial de brotes), dashboard ejecutivo del Viceministro con mapa del Ecuador coloreado por nivel de alerta por canton, y reporte diario automatico al PAHO (OPS) con indicadores de capacidad instalada y utilizacion.
