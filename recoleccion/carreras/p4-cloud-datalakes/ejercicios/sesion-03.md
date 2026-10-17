# Ejercicio Sesion 3: Data Lake con Delta Lake y Apache Parquet

**Materia:** Cloud Computing y Data Lakes
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 45 min

## Objetivo

Implementar un data lake moderno con Delta Lake: soporte ACID, time travel, schema evolution, upserts (MERGE), y gestion de versiones sobre datos del SRI Ecuador, resolviendo los problemas de los data lakes tradicionales (datos corruptos, sin transacciones, sin versioning).

## Contexto

Los data lakes tradicionales con solo Parquet en S3 tienen problemas: si el pipeline falla a mitad, los datos quedan corruptos; no hay rollback; no hay forma de hacer updates sin reescribir todo el archivo. Delta Lake (de Databricks, ahora open source) agrega una capa transaccional ACID sobre Parquet — es el estandar de los data lakes modernos en 2024.

## Instrucciones

1. Instala: `pip install deltalake pyarrow pandas`.

2. Crea el archivo `sesion03_delta_lake_ecuador.py`:

```python
# Delta Lake - ITSEIA
# Cloud Computing y Data Lakes
# ACID + Time Travel + Upserts sobre datos SRI Ecuador

import pandas as pd
import numpy as np
import pyarrow as pa
import pyarrow.parquet as pq
import json
import os
import shutil
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("DELTA LAKE — DATOS SRI ECUADOR")
print("=" * 65)

# ================================================
# PROBLEMAS DEL DATA LAKE TRADICIONAL
# ================================================
print("\n--- PROBLEMAS DEL DATA LAKE TRADICIONAL ---")

problemas = {
    "No ACID":          "Pipeline falla a mitad → datos corruptos → sin rollback",
    "No updates":       "Para corregir 1 registro hay que reescribir todo el archivo Parquet",
    "No version":       "Imposible saber que datos tenia el lake hace 2 semanas",
    "Schema drift":     "Un campo cambia de tipo → el pipeline rompe silenciosamente",
    "Small files":      "Streaming crea miles de Parquets de 1KB → consultas lentas",
    "No constraints":   "Duplicados, nulos, rangos invalidos entran sin control",
}
for prob, desc in problemas.items():
    print(f"  {prob:<18}: {desc}")

print("\n--- SOLUCIONES CON DELTA LAKE ---")
soluciones = {
    "ACID":             "Transaction log (_delta_log/) garantiza atomicidad",
    "MERGE (upsert)":   "UPDATE + INSERT en una sola operacion transaccional",
    "Time Travel":      "SELECT * FROM tabla VERSION AS OF 5 (o timestamp)",
    "Schema Evolution": "ALTER TABLE ADD COLUMN sin reescribir datos",
    "Compaction":       "OPTIMIZE + ZORDER compacta small files automaticamente",
    "Constraints":      "CHECK constraints, NOT NULL, UNIQUE en columnas",
}
for sol, desc in soluciones.items():
    print(f"  {sol:<18}: {desc}")

# ================================================
# SIMULACION DELTA LAKE (sin deltalake lib completa)
# Implementamos la logica conceptual manualmente
# ================================================
print("\n--- DELTA LAKE SIMULADO: FACTURAS SRI ECUADOR ---")

DELTA_PATH = "/tmp/delta_facturas_ecuador"
LOG_PATH   = f"{DELTA_PATH}/_delta_log"

# Limpiar si existe
if os.path.exists(DELTA_PATH):
    shutil.rmtree(DELTA_PATH)
os.makedirs(LOG_PATH, exist_ok=True)

class DeltaTableSimulada:
    """Simulacion simplificada de Delta Lake para propositos educativos."""

    def __init__(self, path):
        self.path = path
        self.log_path = f"{path}/_delta_log"
        self.version = 0
        self.history = []
        os.makedirs(self.log_path, exist_ok=True)

    def _escribir_log(self, operacion, stats):
        entrada = {
            "version": self.version,
            "timestamp": datetime.now().isoformat(),
            "operacion": operacion,
            "stats": stats,
        }
        log_file = f"{self.log_path}/{self.version:020d}.json"
        with open(log_file, "w") as f:
            json.dump(entrada, f, indent=2, default=str)
        self.history.append(entrada)
        return entrada

    def write(self, df, mode="overwrite"):
        """Escribe DataFrame al delta table."""
        parquet_file = f"{self.path}/part-{self.version:05d}.parquet"
        df.to_parquet(parquet_file, index=False)

        stats = {
            "num_records": len(df),
            "num_files_added": 1,
            "mode": mode,
        }
        self._escribir_log(f"WRITE ({mode.upper()})", stats)
        print(f"  v{self.version}: WRITE {mode.upper()} — {len(df)} registros → part-{self.version:05d}.parquet")
        self.version += 1
        return self

    def merge(self, df_updates, merge_key):
        """Simula MERGE (upsert): actualiza si existe, inserta si no."""
        # Leer version actual
        df_actual = self._leer_actual()

        if df_actual is not None and len(df_actual) > 0:
            # Separar updates vs inserts
            df_merged = df_actual[~df_actual[merge_key].isin(df_updates[merge_key])].copy()
            df_merged = pd.concat([df_merged, df_updates], ignore_index=True)
            n_updates = len(df_actual[df_actual[merge_key].isin(df_updates[merge_key])])
            n_inserts = len(df_updates) - n_updates
        else:
            df_merged = df_updates
            n_updates = 0
            n_inserts = len(df_updates)

        parquet_file = f"{self.path}/part-{self.version:05d}.parquet"
        df_merged.to_parquet(parquet_file, index=False)

        stats = {"num_rows_updated": n_updates, "num_rows_inserted": n_inserts,
                 "merge_key": merge_key, "total_rows": len(df_merged)}
        self._escribir_log("MERGE (UPSERT)", stats)
        print(f"  v{self.version}: MERGE — {n_updates} actualizados, {n_inserts} insertados | Total: {len(df_merged)}")
        self.version += 1
        return self

    def _leer_actual(self):
        """Lee la version mas reciente."""
        parquets = sorted([f for f in os.listdir(self.path) if f.endswith(".parquet")])
        if not parquets:
            return None
        return pd.read_parquet(f"{self.path}/{parquets[-1]}")

    def read(self):
        """Lee version actual."""
        return self._leer_actual()

    def read_version(self, version):
        """Time travel: lee una version especifica."""
        parquet_file = f"{self.path}/part-{version:05d}.parquet"
        if os.path.exists(parquet_file):
            df = pd.read_parquet(parquet_file)
            print(f"  TIME TRAVEL: leyendo version {version} ({self.history[version]['timestamp']})")
            return df
        print(f"  Version {version} no encontrada")
        return None

    def describe_history(self):
        """Muestra el historial de operaciones."""
        print(f"\n  HISTORIAL DELTA TABLE (path={self.path}):")
        for h in self.history:
            print(f"  v{h['version']} | {h['timestamp'][:19]} | {h['operacion']}")
            for k, v in h['stats'].items():
                print(f"    {k}: {v}")

# ================================================
# DEMO: FACTURAS SRI CON DELTA LAKE
# ================================================

# Lote 1: datos iniciales enero 2024
n_lote1 = 200
facturas_lote1 = pd.DataFrame({
    "numero_factura": [f"001-001-{i:09d}" for i in range(1, n_lote1+1)],
    "ruc_emisor":     [f"17{np.random.randint(10000000, 99999999):08d}001" for _ in range(n_lote1)],
    "fecha":          pd.date_range("2024-01-01", periods=n_lote1, freq="H").strftime("%Y-%m-%d"),
    "total_usd":      np.random.uniform(10, 5000, n_lote1).round(2),
    "estado":         np.random.choice(["activa","anulada"], n_lote1, p=[0.95,0.05]),
    "tipo":           np.random.choice(["venta","compra"], n_lote1, p=[0.7, 0.3]),
})

dt = DeltaTableSimulada(DELTA_PATH)
print("\n  OPERACION 1: Carga inicial facturas enero 2024")
dt.write(facturas_lote1, mode="overwrite")

# Lote 2: nuevas facturas febrero
n_lote2 = 80
facturas_lote2 = pd.DataFrame({
    "numero_factura": [f"001-001-{i:09d}" for i in range(n_lote1+1, n_lote1+n_lote2+1)],
    "ruc_emisor":     [f"17{np.random.randint(10000000, 99999999):08d}001" for _ in range(n_lote2)],
    "fecha":          pd.date_range("2024-02-01", periods=n_lote2, freq="2H").strftime("%Y-%m-%d"),
    "total_usd":      np.random.uniform(10, 5000, n_lote2).round(2),
    "estado":         "activa",
    "tipo":           np.random.choice(["venta","compra"], n_lote2, p=[0.7, 0.3]),
})

print("\n  OPERACION 2: Agregar facturas febrero (append)")
dt.write(facturas_lote2, mode="append")

# Lote 3: correcciones (algunas facturas cambian estado a 'anulada')
print("\n  OPERACION 3: Correccion estado facturas (MERGE/UPSERT)")
facturas_correccion = facturas_lote1.sample(20).copy()
facturas_correccion["estado"] = "anulada"
facturas_correccion["total_usd"] = 0.0
dt.merge(facturas_correccion, merge_key="numero_factura")

# Lote 4: adicion nueva columna (schema evolution)
print("\n  OPERACION 4: Schema evolution — agregar columna 'categoria_sri'")
df_actual = dt.read()
df_actual["categoria_sri"] = np.random.choice(["A","B","C"], len(df_actual), p=[0.6,0.3,0.1])
dt.write(df_actual, mode="overwrite")

# ================================================
# TIME TRAVEL
# ================================================
print("\n--- TIME TRAVEL ---")
df_v0 = dt.read_version(0)
df_vactual = dt.read()

print(f"  Version 0 (estado inicial):  {len(df_v0)} facturas")
print(f"  Version actual:              {len(df_vactual)} facturas")

# Comparar estado de facturas
v0_anuladas = (df_v0["estado"] == "anulada").sum()
vf_anuladas = (df_vactual["estado"] == "anulada").sum()
print(f"  Facturas anuladas v0:        {v0_anuladas}")
print(f"  Facturas anuladas actual:    {vf_anuladas}")
print(f"  Facturas anuladas por merge: {vf_anuladas - v0_anuladas}")

# ================================================
# HISTORIAL
# ================================================
dt.describe_history()

# ================================================
# PARTICION Y COMPACTACION
# ================================================
print("\n--- PARTICION OPTIMA PARA DELTA LAKE ---")

esquema_particion = """
  Data Lake Ecuador — Esquema de particion recomendado:

  delta_facturas/
  ├── anio=2024/
  │   ├── mes=01/
  │   │   └── part-00000.parquet  (datos enero)
  │   ├── mes=02/
  │   │   └── part-00000.parquet  (datos febrero)
  │   └── ...
  └── _delta_log/
      ├── 00000000000000000000.json  (v0: CREATE TABLE)
      ├── 00000000000000000001.json  (v1: INSERT)
      └── ...

  OPTIMIZE: compacta small files dentro de cada particion
  ZORDER BY (ruc_emisor): ordena fisicamente para queries por RUC
  VACUUM (7 dias): elimina archivos de versiones antiguas
"""
print(esquema_particion)

# Limpiar archivos temporales
shutil.rmtree(DELTA_PATH)
print("  Archivos temporales eliminados.")

print("\n" + "=" * 65)
print("DELTA LAKE — CONCEPTOS CLAVE:")
print("  ACID:         Atomicidad, Consistencia, Isolacion, Durabilidad")
print("  Time Travel:  VERSION AS OF 5 — audit trail completo")
print("  MERGE:        upsert atomico — actualiza o inserta segun clave")
print("  Schema evol.: ADD COLUMN sin romper pipelines existentes")
print("  OPTIMIZE:     compacta archivos pequenos → queries rapidas")
print("  VACUUM:       elimina versiones antiguas — libera storage")
print("=" * 65)
```

3. Implementa el `VACUUM` simulado: elimina archivos de versiones con mas de 7 dias de antiguedad.

4. Escribe una funcion `audit_trail(ruc_emisor)` que muestra todos los cambios historicos de las facturas de un contribuyente especifico.

## Usa IA para...

> Abre Gemini y escribe:
> "Tengo un Delta Lake con datos de facturas del SRI Ecuador. Cada noche llegan 50.000 nuevas facturas en lotes CSV. Cada semana el SRI corrige errores (actualizaciones de estado). ¿Como diseño el pipeline completo con Apache Spark + Delta Lake en Databricks para: 1) ingestar el batch nocturno con MERGE, 2) detectar late-arriving data (facturas de hace 30 dias que llegan tarde), 3) mantener el schema evolution automatico con mergeSchema=true, 4) optimizar con OPTIMIZE y ZORDER cada fin de semana? Dame el codigo PySpark completo."

Despues de leer la respuesta:
- Implementa el pipeline conceptual con comentarios explicando cada paso.
- Diseña el schedule de operaciones: cuando correr MERGE, OPTIMIZE, VACUUM.

## Que aprendiste

- Delta Lake agrega transacciones ACID sobre Parquet en S3/GCS/ADLS — el data lake moderno estandar.
- El `_delta_log/` es el transaction log: JSON con cada operacion — base del Time Travel y la auditoria.
- MERGE (upsert) es la operacion mas usada: actualiza registros existentes e inserta los nuevos en una sola transaccion.
- Time Travel (`VERSION AS OF N`) permite auditar quien cambio que dato y cuando — esencial para cumplimiento regulatorio.
- `OPTIMIZE + ZORDER` compacta small files y ordena datos fisicamente para consultas rapidas.
- `VACUUM(7)` elimina archivos de versiones con mas de 7 dias — necesario para no acumular storage innecesario.

## Reto extra

Construye un sistema de auditoria fiscal para el SRI Ecuador con Delta Lake: todas las modificaciones a registros tributarios quedan trazadas con timestamp, usuario que modifico, valor anterior y valor nuevo. Implementa la funcion `generar_reporte_auditoria(ruc, fecha_inicio, fecha_fin)` que devuelve el historial completo de cambios usando Time Travel, y despliega como API REST con FastAPI + autenticacion por API key.
