# Ejercicio Sesion 7: Change Data Capture (CDC)

**Materia:** Streaming y Procesamiento en Tiempo Real
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Implementar Change Data Capture (CDC) con Debezium para capturar cambios de bases de datos relacionales en tiempo real — propagando cambios del sistema core bancario de Banco del Pacifico Ecuador hacia el data warehouse, sistema antifraude y CRM sin impacto en la BD de produccion.

## Contexto

Banco del Pacifico Ecuador tiene su core bancario en Oracle. Cada 24 horas corre un batch ETL nocturno para sincronizar el data warehouse — lo que significa que el equipo de analitica trabaja siempre con datos del dia anterior. Con Debezium CDC, cada INSERT/UPDATE/DELETE en Oracle se captura del transaction log (redo log) y se publica en Kafka en milisegundos — el data warehouse tiene datos en tiempo real sin modificar el core bancario.

## Instrucciones

1. Crea el archivo `sesion07_cdc_debezium_ecuador.py`:

```python
# Change Data Capture (CDC) - ITSEIA
# Streaming y Procesamiento en Tiempo Real
# Banco del Pacifico Ecuador — CDC tiempo real

import numpy as np
import pandas as pd
import json
import time
import random
import hashlib
import sqlite3
from datetime import datetime, timedelta
from collections import defaultdict, deque
from enum import Enum
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
random.seed(2026)

print("=" * 65)
print("CHANGE DATA CAPTURE (CDC) — BANCO DEL PACIFICO ECUADOR")
print("Debezium: Oracle CDC → Kafka → DW + Antifraude + CRM")
print("=" * 65)

# ================================================
# CONCEPTOS CDC
# ================================================
print("\n--- CONCEPTOS CDC ---")

conceptos = {
    "CDC":          "Change Data Capture — capturar cada cambio (INSERT/UPDATE/DELETE) en la BD",
    "Transaction Log": "Registro inmutable de todas las operaciones SQL — redo log Oracle, WAL Postgres",
    "Debezium":     "Conector Kafka que lee el transaction log y publica eventos de cambio",
    "Outbox Pattern": "Tabla 'outbox' intermedia para garantizar exactamente-una-vez en CDC",
    "Snapshot":     "Carga inicial completa de la tabla antes de empezar a capturar cambios delta",
    "Tombstone":    "Evento DELETE en Kafka — key con value=null para log compaction",
    "Schema Registry": "Registro de esquemas Avro — garantiza compatibilidad entre productor y consumidor",
    "SAGA Pattern": "Transacciones distribuidas via eventos CDC — alternativa a 2-phase commit",
}

for k, v in conceptos.items():
    print(f"  {k:<20}: {v}")

print("\n  Metodos de CDC:")
metodos_cdc = {
    "Log-based (mejor)":  "Lee transaction log directamente — cero impacto en BD produccion",
    "Trigger-based":      "Triggers SQL capturan cambios — overhead en BD, dificil de mantener",
    "Timestamp-based":    "Consulta periodica WHERE updated_at > last_run — pierde DELETEs",
    "Full snapshot":      "Copia completa periodica — costoso, ventana de datos desactualizados",
}
for metodo, desc in metodos_cdc.items():
    print(f"  {metodo:<22}: {desc}")

# ================================================
# SIMULADOR DE BASE DE DATOS CORE BANCARIO
# ================================================
print("\n--- SIMULADOR: CORE BANCARIO ORACLE ---")

class CoreBancarioBDP:
    """
    Simula el core bancario de Banco del Pacifico en SQLite.
    Cada operacion SQL genera un evento de cambio (como el redo log de Oracle).
    """

    def __init__(self):
        self.conn = sqlite3.connect(":memory:")
        self._crear_tablas()
        self.transaction_log = []  # Simula el redo log
        self.lsn = 0  # Log Sequence Number

    def _crear_tablas(self):
        self.conn.executescript("""
        CREATE TABLE cuentas (
            cuenta_id TEXT PRIMARY KEY,
            titular_ruc TEXT NOT NULL,
            tipo_cuenta TEXT,
            saldo REAL DEFAULT 0,
            estado TEXT DEFAULT 'activa',
            fecha_apertura TEXT,
            ultimo_movimiento TEXT
        );
        CREATE TABLE transacciones (
            txn_id TEXT PRIMARY KEY,
            cuenta_origen TEXT,
            cuenta_destino TEXT,
            monto REAL,
            tipo TEXT,
            estado TEXT DEFAULT 'pendiente',
            timestamp TEXT,
            canal TEXT
        );
        """)

    def _log_operacion(self, operacion, tabla, before, after):
        """Registra la operacion en el transaction log (como Oracle redo log)."""
        self.lsn += 1
        evento = {
            "lsn":       self.lsn,
            "operacion": operacion,   # INSERT, UPDATE, DELETE
            "tabla":     tabla,
            "before":    before,
            "after":     after,
            "ts_ms":     int(time.time() * 1000),
            "txn_id":    hashlib.md5(f"{self.lsn}{time.time()}".encode()).hexdigest()[:8],
        }
        self.transaction_log.append(evento)
        return evento

    def abrir_cuenta(self, cuenta_id, titular_ruc, tipo_cuenta, saldo_inicial=0):
        fecha = datetime.now().strftime("%Y-%m-%d")
        self.conn.execute("""
            INSERT INTO cuentas VALUES (?,?,?,?,?,?,?)
        """, (cuenta_id, titular_ruc, tipo_cuenta, saldo_inicial, "activa", fecha, fecha))
        self.conn.commit()
        return self._log_operacion("INSERT", "cuentas", None, {
            "cuenta_id": cuenta_id, "saldo": saldo_inicial, "estado": "activa"
        })

    def actualizar_saldo(self, cuenta_id, nuevo_saldo):
        old = self.conn.execute("SELECT saldo FROM cuentas WHERE cuenta_id=?",
                                  (cuenta_id,)).fetchone()
        if old:
            self.conn.execute("UPDATE cuentas SET saldo=?, ultimo_movimiento=? WHERE cuenta_id=?",
                               (nuevo_saldo, datetime.now().strftime("%Y-%m-%d"), cuenta_id))
            self.conn.commit()
            return self._log_operacion("UPDATE", "cuentas",
                                         {"saldo": old[0]}, {"saldo": nuevo_saldo, "cuenta_id": cuenta_id})

    def registrar_transaccion(self, txn_id, origen, destino, monto, tipo, canal):
        ts = datetime.now().isoformat()
        self.conn.execute("INSERT INTO transacciones VALUES (?,?,?,?,?,?,?,?)",
                           (txn_id, origen, destino, monto, tipo, "completada", ts, canal))
        self.conn.commit()
        return self._log_operacion("INSERT", "transacciones", None, {
            "txn_id": txn_id, "monto": monto, "tipo": tipo, "origen": origen
        })

    def cerrar_cuenta(self, cuenta_id):
        old = self.conn.execute("SELECT * FROM cuentas WHERE cuenta_id=?",
                                  (cuenta_id,)).fetchone()
        self.conn.execute("UPDATE cuentas SET estado='cerrada' WHERE cuenta_id=?", (cuenta_id,))
        self.conn.commit()
        return self._log_operacion("UPDATE", "cuentas",
                                     {"estado": "activa"}, {"estado": "cerrada", "cuenta_id": cuenta_id})

# Inicializar core bancario
core = CoreBancarioBDP()

# Simular operaciones del dia
CUENTAS_BDP = [f"BDP{i:07d}" for i in range(1, 101)]
RUCS        = [f"17{random.randint(10000000,99999999):08d}001" for _ in range(80)]

# Apertura de cuentas
for i, cuenta in enumerate(CUENTAS_BDP[:50]):
    core.abrir_cuenta(cuenta, RUCS[i % len(RUCS)],
                       random.choice(["corriente","ahorros","plazo_fijo"]),
                       saldo_inicial=random.uniform(100, 50000))

# Transacciones
for _ in range(200):
    origen  = random.choice(CUENTAS_BDP[:50])
    destino = random.choice([c for c in CUENTAS_BDP[:50] if c != origen])
    monto   = round(random.uniform(50, 5000), 2)
    txn_id  = f"TXN{random.randint(100000, 999999)}"

    core.registrar_transaccion(
        txn_id, origen, destino, monto,
        random.choice(["transferencia","pago","nomina"]),
        random.choice(["online","sucursal","ATM"])
    )

    # Actualizar saldos
    saldo_orig = random.uniform(100, 20000)
    core.actualizar_saldo(origen, round(saldo_orig - monto, 2))
    core.actualizar_saldo(destino, round(saldo_orig * 0.8 + monto, 2))

# Cerrar algunas cuentas
for c in CUENTAS_BDP[:3]:
    core.cerrar_cuenta(c)

print(f"  Transaction log entries: {len(core.transaction_log)}")
ops = defaultdict(int)
for e in core.transaction_log:
    ops[e["operacion"]] += 1
for op, cnt in ops.items():
    print(f"  {op:<10}: {cnt}")

# ================================================
# DEBEZIUM CDC CONNECTOR (SIMULADO)
# ================================================
print("\n--- DEBEZIUM CDC: CAPTURA DE CAMBIOS ---")

class DebeziumSimulado:
    """
    Simula el conector Debezium Oracle CDC.
    Lee el transaction log y publica eventos en formato Debezium a Kafka.
    """

    TOPIC_MAP = {
        "cuentas":       "bdp.core.cuentas",
        "transacciones": "bdp.core.transacciones",
    }

    def __init__(self, connector_name="bdp-oracle-cdc", lsn_inicial=0):
        self.connector_name = connector_name
        self.lsn_checkpoint = lsn_inicial
        self.eventos_publicados = defaultdict(list)
        self.stats = defaultdict(int)

    def _formato_debezium(self, log_entry):
        """Convierte entrada del log al formato Debezium Kafka message."""
        return {
            "schema": {
                "type": "struct",
                "name": f"{self.connector_name}.{log_entry['tabla']}.Envelope"
            },
            "payload": {
                "before": log_entry["before"],
                "after":  log_entry["after"],
                "source": {
                    "version":   "2.4.0",
                    "connector": "oracle",
                    "name":      self.connector_name,
                    "ts_ms":     log_entry["ts_ms"],
                    "snapshot":  "false",
                    "db":        "COREBANK",
                    "schema":    "BDP",
                    "table":     log_entry["tabla"].upper(),
                    "txId":      log_entry["txn_id"],
                    "scn":       log_entry["lsn"],  # System Change Number en Oracle
                },
                "op":    log_entry["operacion"][0].lower(),  # i=insert, u=update, d=delete
                "ts_ms": log_entry["ts_ms"],
            }
        }

    def procesar_log(self, transaction_log, desde_lsn=None):
        """Procesa el transaction log y publica en Kafka topics."""
        lsn_desde = desde_lsn or self.lsn_checkpoint

        for entry in transaction_log:
            if entry["lsn"] <= lsn_desde:
                continue

            topic = self.TOPIC_MAP.get(entry["tabla"], f"bdp.{entry['tabla']}")
            evento = self._formato_debezium(entry)

            self.eventos_publicados[topic].append(evento)
            self.stats[f"{entry['tabla']}.{entry['operacion']}"] += 1
            self.lsn_checkpoint = entry["lsn"]

        return self.eventos_publicados

    def checkpoint(self):
        return {"lsn": self.lsn_checkpoint, "connector": self.connector_name}


debezium = DebeziumSimulado("bdp-oracle-cdc")
eventos_kafka = debezium.procesar_log(core.transaction_log)

print(f"\n  Topics publicados:")
for topic, eventos in eventos_kafka.items():
    print(f"  {topic:<35}: {len(eventos)} eventos")

print(f"\n  Stats por operacion:")
for op_tabla, cnt in sorted(debezium.stats.items()):
    print(f"  {op_tabla:<40}: {cnt}")

# ================================================
# CONSUMIDORES CDC: DW + ANTIFRAUDE + CRM
# ================================================
print("\n--- CONSUMIDORES CDC: 3 SISTEMAS ---")

class ConsumidorDW:
    """Replica cambios al Data Warehouse — tabla por tabla."""
    def __init__(self):
        self.dw = {"cuentas": {}, "transacciones": {}}
        self.procesados = 0

    def procesar(self, evento):
        tabla = evento["payload"]["source"]["table"].lower()
        op    = evento["payload"]["op"]
        after = evento["payload"]["after"]
        if after and tabla in self.dw:
            key = after.get("cuenta_id") or after.get("txn_id") or str(self.procesados)
            if op == "d":
                self.dw[tabla].pop(key, None)
            else:
                self.dw[tabla][key] = after
            self.procesados += 1

class ConsumidorAntifraude:
    """Solo recibe transacciones > $5,000 para scoring inmediato."""
    def __init__(self):
        self.txns_revisadas = []

    def procesar(self, evento):
        tabla = evento["payload"]["source"]["table"].lower()
        op    = evento["payload"]["op"]
        after = evento["payload"]["after"]
        if tabla == "transacciones" and op == "i" and after:
            if after.get("monto", 0) > 5000:
                self.txns_revisadas.append({
                    "txn_id": after.get("txn_id"),
                    "monto":  after.get("monto"),
                    "tipo":   after.get("tipo"),
                    "alerta": "REVISION_REQUERIDA",
                })

class ConsumidorCRM:
    """Detecta aperturas y cierres de cuenta para journey del cliente."""
    def __init__(self):
        self.eventos_crm = []

    def procesar(self, evento):
        tabla = evento["payload"]["source"]["table"].lower()
        op    = evento["payload"]["op"]
        after = evento["payload"]["after"]
        if tabla == "cuentas":
            if op == "i":
                self.eventos_crm.append({"tipo": "CUENTA_APERTURA", "cuenta": after})
            elif op == "u" and after and after.get("estado") == "cerrada":
                self.eventos_crm.append({"tipo": "CUENTA_CIERRE", "cuenta": after})

# Consumir todos los eventos
dw_consumer   = ConsumidorDW()
fraud_consumer = ConsumidorAntifraude()
crm_consumer  = ConsumidorCRM()

todos_eventos = []
for topic, evts in eventos_kafka.items():
    todos_eventos.extend(evts)

for evento in todos_eventos:
    dw_consumer.procesar(evento)
    fraud_consumer.procesar(evento)
    crm_consumer.procesar(evento)

print(f"\n  Data Warehouse:")
print(f"    cuentas sincronizadas:      {len(dw_consumer.dw['cuentas'])}")
print(f"    transacciones sincronizadas: {len(dw_consumer.dw['transacciones'])}")

print(f"\n  Antifraude:")
print(f"    Txns > $5,000 para revision: {len(fraud_consumer.txns_revisadas)}")
if fraud_consumer.txns_revisadas:
    for t in fraud_consumer.txns_revisadas[:3]:
        print(f"    {t['txn_id']}: ${t['monto']:,.2f}")

print(f"\n  CRM:")
print(f"    Aperturas de cuenta:  {sum(1 for e in crm_consumer.eventos_crm if e['tipo']=='CUENTA_APERTURA')}")
print(f"    Cierres de cuenta:    {sum(1 for e in crm_consumer.eventos_crm if e['tipo']=='CUENTA_CIERRE')}")

print(f"\n  Checkpoint Debezium: LSN {debezium.checkpoint()['lsn']}")

print("\n" + "=" * 65)
print("CDC — CONCEPTOS CLAVE:")
print("  Log-based CDC:    lee redo log/WAL — cero impacto en produccion")
print("  Debezium:         conector open source — Oracle, Postgres, MySQL, MongoDB")
print("  Formato envelope: before/after/op/source — historia completa del cambio")
print("  LSN/SCN:          posicion en el log — checkpoint para recovery")
print("  Fan-out:          un cambio → multiples consumidores (DW, fraude, CRM)")
print("  Tombstone:        DELETE → key con value null — log compaction correcto")
print("=" * 65)
```

3. Implementa el Outbox Pattern: en lugar de leer directamente el redo log, la aplicacion escribe en una tabla `outbox` y Debezium lee solo esa tabla — garantiza exactamente-una-vez semantics.

4. Agrega el schema evolution handler: cuando la tabla `transacciones` agrega una columna nueva, el consumidor del DW no se rompe — detecta el cambio y aplica un valor por defecto.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Implemento CDC con Debezium para replicar el core bancario de Banco del Pacifico (Oracle 19c) al data warehouse en tiempo real. Los problemas que enfrento: 1) el Oracle redo log rota cada 2 horas y Debezium pierde el offset si no lo lee a tiempo — ¿como configuro el archiving y el supplement log correctamente?, 2) tenemos tablas con LOB columns (PDFs de contratos en BLOB) que no quiero replicar al DW — ¿como excluyo columnas en Debezium?, 3) cuando hay un TRUNCATE TABLE en produccion (mantenimiento mensual), Debezium no lo captura en Oracle — ¿cual es el workaround? Dame la configuracion JSON del conector Debezium para Oracle con estas 3 soluciones."

Despues de leer la respuesta:
- Implementa el filtro de columnas LOB en el procesador de eventos CDC.
- Agrega el manejador de TRUNCATE simulado: si se detecta un gap en el LSN, emitir alerta de posible TRUNCATE.

## Que aprendiste

- CDC log-based no toca la BD de produccion — lee el transaction log directamente sin overhead.
- Debezium formatea cada cambio como evento con before/after/op — historia completa de cada modificacion.
- El LSN (Log Sequence Number) es el checkpoint — permite recuperar exactamente donde se quedo.
- Fan-out de CDC: un cambio en el core bancario se propaga simultaneamente a DW, antifraude y CRM.
- El Outbox Pattern garantiza exactamente-una-vez — la aplicacion controla cuando publicar el evento.
- El schema evolution es inevitable en sistemas vivos — los consumidores deben manejar columnas nuevas sin romperse.

## Reto extra

Construye el sistema de sincronizacion en tiempo real para los 23 bancos privados del Ecuador supervisados por la SBS: CDC Debezium de cada banco (Oracle/Postgres/MySQL) a un Kafka central del BCE, replicacion a data warehouse Redshift para supervision bancaria en tiempo real, deteccion de discrepancias contables (posicion activo/pasivo cuadra en cada banco), generacion automatica del reporte de encaje bancario diario a las 6 AM, y alerta inmediata a la SBS si algún banco tiene ratio de liquidez bajo el limite legal (14%). Todo el pipeline auditado con LSN checkpoints y replay capability de 30 dias.
