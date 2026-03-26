# Ejercicio Sesion 7: Optimizacion y Performance de Pipelines

**Materia:** Data Engineering Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Optimizar pipelines de datos para procesar los datasets del gobierno ecuatoriano con maxima eficiencia: particionamiento inteligente, compresion de datos, indices, query optimization con EXPLAIN, paralelismo y tecnicas de profiling para identificar y eliminar cuellos de botella.

## Contexto

El Ministerio de Economia de Ecuador tiene un pipeline que procesa 50 millones de registros diarios del SRI, BCE y INEC. El pipeline tarda 4 horas — demasiado para reportes ejecutivos matutinos. Con las tecnicas correctas de optimizacion (particionamiento por provincia/fecha, columnar storage, indices selectivos, paralelismo), el mismo pipeline puede correr en 18 minutos. La diferencia entre un pipeline que corre a las 8 AM y uno que termina al mediodia es la diferencia entre decisiones basadas en datos y decisiones basadas en intuicion.

## Instrucciones

1. Crea el archivo `sesion07_optimizacion_pipelines_ecuador.py`:

```python
# Optimizacion Performance Pipelines - ITSEIA
# Data Engineering Avanzado
# Tecnicas de optimizacion para datos Ecuador

import pandas as pd
import numpy as np
import duckdb
import time
import json
import os
import io
import gzip
import pickle
from datetime import datetime
from functools import wraps
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("OPTIMIZACION DE PIPELINES — DATOS ECUADOR")
print("=" * 65)

# ================================================
# UTILIDAD: TIMER DECORATOR
# ================================================
def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        resultado = func(*args, **kwargs)
        elapsed = (time.perf_counter() - t0) * 1000
        print(f"  [{func.__name__}] {elapsed:.1f} ms")
        return resultado, elapsed
    return wrapper

# ================================================
# DATOS: DECLARACIONES SRI (simulado 100K)
# ================================================
print("\n--- GENERANDO DATASET: SRI ECUADOR 100K ---")

N = 100_000
provincias = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua",
              "Imbabura","Loja","El Oro","Chimborazo","Cotopaxi"]
sectores   = ["comercio","manufactura","servicios","construccion",
              "agricultura","transporte","mineria","educacion"]

df_sri = pd.DataFrame({
    "id":           range(1, N+1),
    "ruc":          [f"17{np.random.randint(10000000,99999999):08d}001" for _ in range(N)],
    "periodo":      pd.date_range("2022-01-01", periods=N, freq="H").strftime("%Y-%m"),
    "provincia":    np.random.choice(provincias, N),
    "sector":       np.random.choice(sectores, N),
    "iva_cobrado":  np.random.lognormal(7, 1.5, N).round(2),
    "iva_pagado":   np.random.lognormal(6.5, 1.5, N).round(2),
    "renta_gravable": np.random.lognormal(8, 2, N).round(2),
    "estado":       np.random.choice(["presentada","tardia","omisa","rectificada"],
                                      N, p=[0.75, 0.10, 0.08, 0.07]),
    "tipo":         np.random.choice(["natural","sociedad","rimpe"], N, p=[0.55,0.35,0.10]),
})
df_sri["iva_neto"]     = (df_sri["iva_cobrado"] - df_sri["iva_pagado"]).round(2)
df_sri["anio"]         = df_sri["periodo"].str[:4].astype(int)
df_sri["mes"]          = df_sri["periodo"].str[5:7].astype(int)

print(f"  Dataset: {df_sri.shape} | Memoria: {df_sri.memory_usage(deep=True).sum()/1024**2:.1f} MB")

# ================================================
# 1. PARTICIONAMIENTO
# ================================================
print("\n--- TECNICA 1: PARTICIONAMIENTO ---")

@timer
def query_sin_particion(df, provincia):
    """Scan completo — O(N)."""
    return df[df["provincia"] == provincia].groupby("sector")["iva_neto"].sum()

@timer
def query_con_particion(particiones, provincia):
    """Solo lee la particion relevante — O(N/P)."""
    if provincia in particiones:
        p = particiones[provincia]
        return p.groupby("sector")["iva_neto"].sum()
    return pd.Series()

# Crear particiones por provincia (simula Hive-style partitioning)
print("  Creando particiones por provincia...")
particiones = {prov: grp.reset_index(drop=True)
               for prov, grp in df_sri.groupby("provincia")}

_, t_sin = query_sin_particion(df_sri, "Pichincha")
_, t_con = query_con_particion(particiones, "Pichincha")

print(f"\n  Sin particion:  {t_sin:.1f} ms (scan {N:,} filas)")
print(f"  Con particion:  {t_con:.1f} ms (scan ~{N//len(provincias):,} filas)")
print(f"  Speedup:        {t_sin/t_con:.1f}x")

# Estrategias de particionamiento
estrategias = {
    "Por fecha (anio/mes)":   "Ideal para series de tiempo — SRI mensual, BCE indicadores",
    "Por provincia":          "Ideal para queries geograficas — INEC, MSP, MAGAP",
    "Por tipo contribuyente": "Ideal para segmentaciones — natural/sociedad/RIMPE",
    "Hash partitioning":      "Distribucion uniforme — evita skew en grandes joins",
}
print("\n  Estrategias de particionamiento:")
for k, v in estrategias.items():
    print(f"  {k:<35}: {v}")

# ================================================
# 2. COMPRESION Y FORMATOS COLUMNAR
# ================================================
print("\n--- TECNICA 2: COMPRESION Y FORMATOS ---")

# Comparar CSV vs Parquet vs Compressed
def medir_formato(df, nombre):
    resultados = {}

    # CSV sin comprimir
    buf_csv = io.StringIO()
    df.to_csv(buf_csv, index=False)
    size_csv = len(buf_csv.getvalue().encode("utf-8"))

    # CSV gzip
    buf_gz = io.BytesIO()
    with gzip.GzipFile(fileobj=buf_gz, mode="wb") as f:
        f.write(buf_csv.getvalue().encode("utf-8"))
    size_gz = buf_gz.tell()

    # Parquet (via pyarrow)
    buf_parquet = io.BytesIO()
    df.to_parquet(buf_parquet, index=False, compression="snappy")
    size_parquet = buf_parquet.tell()

    resultados = {
        "CSV":           size_csv,
        "CSV + gzip":    size_gz,
        "Parquet Snappy": size_parquet,
    }
    return resultados

# Medir con muestra 10K
df_muestra = df_sri.head(10_000)
formatos = medir_formato(df_muestra, "sri_10k")

print(f"  Comparacion de formatos (10,000 filas):")
baseline = formatos["CSV"]
for fmt, size in formatos.items():
    ratio = size / baseline * 100
    print(f"  {fmt:<20}: {size/1024:.0f} KB  ({ratio:.0f}% del CSV)")

print("\n  Regla practica:")
print("  Raw zone:      CSV/JSON — legibilidad humana, debugging")
print("  Curated zone:  Parquet Snappy — 3-5x mas pequeno, 10x mas rapido en queries")
print("  Analytics:     Parquet ZSTD — mejor compresion, ideal para archivado")

# ================================================
# 3. QUERY OPTIMIZATION CON DUCKDB
# ================================================
print("\n--- TECNICA 3: QUERY OPTIMIZATION (DuckDB) ---")

conn = duckdb.connect(":memory:")
conn.execute("CREATE TABLE sri AS SELECT * FROM df_sri")

# Query sin optimizar
t0 = time.perf_counter()
res_lento = conn.execute("""
    SELECT provincia, sector, COUNT(*), SUM(iva_neto)
    FROM sri
    WHERE CAST(LEFT(periodo, 4) AS INTEGER) = 2023
    GROUP BY provincia, sector
    ORDER BY SUM(iva_neto) DESC
""").df()
t_lento = (time.perf_counter() - t0) * 1000

# Query optimizado (columnas pre-calculadas, filtro en columna indexable)
t0 = time.perf_counter()
res_rapido = conn.execute("""
    SELECT provincia, sector, COUNT(*) AS declaraciones, SUM(iva_neto) AS total_neto
    FROM sri
    WHERE anio = 2023
    GROUP BY provincia, sector
    ORDER BY total_neto DESC
""").df()
t_rapido = (time.perf_counter() - t0) * 1000

print(f"  Query con funcion en WHERE:  {t_lento:.1f} ms (impide uso de indice)")
print(f"  Query con columna directa:   {t_rapido:.1f} ms (usa columna pre-calculada)")
print(f"  Speedup:                     {t_lento/t_rapido:.1f}x")

# EXPLAIN para ver el plan
print("\n  Plan de ejecucion (DuckDB EXPLAIN):")
plan = conn.execute("EXPLAIN SELECT provincia, SUM(iva_neto) FROM sri WHERE anio=2023 GROUP BY 1").df()
# Mostrar primeras lineas del plan
plan_str = str(plan.iloc[0,1]) if len(plan) > 0 else ""
for linea in plan_str.split("\n")[:8]:
    if linea.strip():
        print(f"    {linea}")

# Top resultados
print(f"\n  Top 5 provincias IVA neto 2023:")
print(res_rapido.head(5)[["provincia","sector","declaraciones","total_neto"]].to_string(index=False))

# ================================================
# 4. INDICES Y ESTADISTICAS
# ================================================
print("\n--- TECNICA 4: INDICES SELECTIVOS ---")

import sqlite3
conn_sqlite = sqlite3.connect(":memory:")
conn_sqlite.execute("""
    CREATE TABLE declaraciones (
        id INTEGER PRIMARY KEY,
        ruc TEXT,
        provincia TEXT,
        anio INTEGER,
        mes INTEGER,
        iva_neto REAL,
        estado TEXT
    )
""")

# Insertar muestra 50K
df_sample = df_sri[["id","ruc","provincia","anio","mes","iva_neto","estado"]].head(50_000)
df_sample.to_sql("declaraciones", conn_sqlite, if_exists="replace", index=False)

# Query SIN indice
t0 = time.perf_counter()
conn_sqlite.execute("SELECT COUNT(*), SUM(iva_neto) FROM declaraciones WHERE provincia='Pichincha' AND anio=2023").fetchone()
t_sin_idx = (time.perf_counter() - t0) * 1000

# Crear indice compuesto
conn_sqlite.execute("CREATE INDEX idx_prov_anio ON declaraciones(provincia, anio)")

# Query CON indice
t0 = time.perf_counter()
conn_sqlite.execute("SELECT COUNT(*), SUM(iva_neto) FROM declaraciones WHERE provincia='Pichincha' AND anio=2023").fetchone()
t_con_idx = (time.perf_counter() - t0) * 1000

print(f"  Sin indice:  {t_sin_idx:.2f} ms (full scan)")
print(f"  Con indice:  {t_con_idx:.2f} ms (index scan)")

guia_indices = {
    "Columnas en WHERE frecuentes":    "Siempre indexar — provincia, fecha, ruc, estado",
    "Columnas en JOIN":                "Indice en la FK — declaraciones.ruc → contribuyentes.ruc",
    "Cardinalidad alta":               "Buenos candidatos — RUC (unico), fecha (many values)",
    "Cardinalidad baja":               "Malos candidatos — estado (5 valores), tipo (3 valores)",
    "Indices compuestos":              "El orden importa — (provincia, anio) sirve para solo provincia",
    "Covering index":                  "Incluye todas las columnas del SELECT — evita heap access",
}
print("\n  Guia de indices:")
for k, v in guia_indices.items():
    print(f"  {k:<35}: {v}")

conn_sqlite.close()

# ================================================
# 5. PARALELISMO Y CONCURRENCIA
# ================================================
print("\n--- TECNICA 5: PARALELISMO ---")

def procesar_provincia(args):
    """Funcion que simula procesamiento pesado de una provincia."""
    provincia, df_prov = args
    tiempo_proceso = len(df_prov) * 0.000005  # Simular trabajo
    time.sleep(tiempo_proceso * 0.001)
    return {
        "provincia": provincia,
        "declaraciones": len(df_prov),
        "iva_total":    float(df_prov["iva_neto"].sum()),
        "mora_pct":     float((df_prov["estado"] == "tardia").mean() * 100),
    }

args_list = list(particiones.items())

# Secuencial
t0 = time.perf_counter()
resultados_seq = [procesar_provincia(args) for args in args_list]
t_seq = (time.perf_counter() - t0) * 1000

# Paralelo con ThreadPoolExecutor
t0 = time.perf_counter()
with ThreadPoolExecutor(max_workers=4) as executor:
    resultados_par = list(executor.map(procesar_provincia, args_list))
t_par = (time.perf_counter() - t0) * 1000

print(f"  Procesando {len(args_list)} provincias:")
print(f"  Secuencial:    {t_seq:.1f} ms")
print(f"  Paralelo (4):  {t_par:.1f} ms")

df_resultado = pd.DataFrame(resultados_seq).sort_values("iva_total", ascending=False)
print(f"\n  Resultados por provincia:")
print(df_resultado[["provincia","declaraciones","iva_total","mora_pct"]].to_string(index=False))

# ================================================
# 6. PROFILING Y BOTTLENECK DETECTION
# ================================================
print("\n--- TECNICA 6: PROFILING DE PIPELINE ---")

class PipelineProfiler:
    """Mide el tiempo de cada etapa del pipeline."""

    def __init__(self, nombre):
        self.nombre = nombre
        self.etapas = []
        self._t_inicio = None

    def iniciar_etapa(self, nombre_etapa):
        self._t_inicio = time.perf_counter()
        self._etapa_actual = nombre_etapa

    def finalizar_etapa(self, registros_procesados=0):
        elapsed_ms = (time.perf_counter() - self._t_inicio) * 1000
        self.etapas.append({
            "etapa":       self._etapa_actual,
            "tiempo_ms":   round(elapsed_ms, 1),
            "registros":   registros_procesados,
            "throughput":  round(registros_procesados / (elapsed_ms/1000) if elapsed_ms > 0 else 0),
        })

    def reporte(self):
        total = sum(e["tiempo_ms"] for e in self.etapas)
        print(f"\n  === PROFILING: {self.nombre} ===")
        print(f"  {'Etapa':<30} {'Tiempo':>10} {'%':>6} {'Registros':>12} {'Throughput/s':>14}")
        print(f"  {'-'*75}")
        for e in self.etapas:
            pct = e["tiempo_ms"] / total * 100 if total > 0 else 0
            cuello = " << BOTTLENECK" if pct > 40 else ""
            print(f"  {e['etapa']:<30} {e['tiempo_ms']:>9.1f}ms {pct:>5.1f}% "
                  f"{e['registros']:>12,} {e['throughput']:>13,}/s{cuello}")
        print(f"  {'TOTAL':<30} {total:>9.1f}ms")
        return {"total_ms": total, "etapas": self.etapas}

# Simular pipeline con profiling
profiler = PipelineProfiler("Pipeline Recaudacion Ecuador")

profiler.iniciar_etapa("1. Ingesta CSV SRI")
time.sleep(0.015)
df_raw = df_sri.head(50_000).copy()
profiler.finalizar_etapa(len(df_raw))

profiler.iniciar_etapa("2. Validacion calidad")
time.sleep(0.008)
df_valido = df_raw[df_raw["iva_cobrado"] > 0].copy()
profiler.finalizar_etapa(len(df_valido))

profiler.iniciar_etapa("3. Transformaciones SQL")
time.sleep(0.025)
df_valido["iva_neto_ajustado"] = df_valido["iva_neto"] * 1.002
profiler.finalizar_etapa(len(df_valido))

profiler.iniciar_etapa("4. Join con contribuyentes")
time.sleep(0.045)  # Bottleneck simulado — join sin indice
profiler.finalizar_etapa(len(df_valido))

profiler.iniciar_etapa("5. Agregacion provincial")
time.sleep(0.012)
mart = df_valido.groupby(["provincia","anio"])["iva_neto"].sum().reset_index()
profiler.finalizar_etapa(len(mart))

profiler.iniciar_etapa("6. Escribir Parquet S3")
time.sleep(0.010)
profiler.finalizar_etapa(len(mart))

reporte_profiling = profiler.reporte()

# ================================================
# 7. ESTRATEGIAS DE OPTIMIZACION
# ================================================
print("\n--- ESTRATEGIAS DE OPTIMIZACION ---")

estrategias_opt = {
    "Particionamiento":    ("Alto", "Particionar por (fecha, provincia) — reduce scan 10-100x"),
    "Columnar (Parquet)":  ("Alto", "3-5x menos storage, 10x mas rapido en queries analiticos"),
    "Indices selectivos":  ("Alto", "Solo en columnas de alta cardinalidad + frecuentes en WHERE"),
    "Paralelismo":         ("Alto", "ThreadPool para I/O bound, ProcessPool para CPU bound"),
    "Broadcast join":      ("Alto", "Tablas pequenas (<100MB) como dimensiones en Spark"),
    "Predicado pushdown":  ("Medio", "Filtros antes del JOIN, no despues — reduce datos en red"),
    "Materialization":     ("Medio", "Pre-calcular agregaciones costosas como tablas fisicas"),
    "Cache caliente":      ("Medio", "Redis para queries repetidas — BCE indicadores, MSP beds"),
    "Compresion ZSTD":     ("Bajo",  "Para archivado historico — mejor ratio que Snappy"),
    "Connection pooling":  ("Bajo",  "Reutilizar conexiones DB — evita overhead de handshake"),
}

print(f"\n  {'Tecnica':<25} {'Impacto':<10} {'Descripcion'}")
print(f"  {'-'*80}")
for tecnica, (impacto, desc) in estrategias_opt.items():
    print(f"  {tecnica:<25} {impacto:<10} {desc}")

conn.close()

print("\n" + "=" * 65)
print("OPTIMIZACION PIPELINES — CONCEPTOS CLAVE:")
print("  Particionamiento:  divide los datos por clave — reduce el scan N/P veces")
print("  Parquet Snappy:    3-5x compresion + predicate pushdown nativo")
print("  EXPLAIN/profiling: mide antes de optimizar — encuentra el bottleneck real")
print("  Indices:           alta cardinalidad + consulta frecuente = buen candidato")
print("  Paralelismo:       divide y conquista — N workers para N particiones")
print("  Predicate pushdown: filtrar lo antes posible en el plan de ejecucion")
print("=" * 65)
```

3. Implementa el benchmark completo comparando pandas vs DuckDB vs PySpark para una query de agregacion sobre 1 millon de filas: `GROUP BY provincia, anio, sector`.

4. Agrega el calculo de skew de datos: detecta cuando una particion tiene 5x mas datos que el promedio y re-particiona automaticamente con hash.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un pipeline Spark que procesa 50 millones de declaraciones del SRI Ecuador. El job tarda 4 horas por un data skew — la provincia Pichincha tiene 35% de los datos. El stage 'join contribuyentes' tarda 180 minutos de las 4 horas totales. ¿Como resuelvo el skew? Necesito: 1) detectar skew con df.groupBy().count() y coeficiente de variacion, 2) aplicar salting technique al join (agregar columna aleatoria 0-9 para distribuir), 3) configurar spark.sql.adaptive.enabled y spark.sql.adaptive.skewJoin.enabled. Dame el codigo PySpark completo con el antes y despues del tiempo de ejecucion estimado."

Despues de leer la respuesta:
- Implementa la tecnica de salting para el join de contribuyentes.
- Compara el plan de ejecucion con `explain(True)` antes y despues del salting.

## Que aprendiste

- El particionamiento reduce el scan de O(N) a O(N/P) — el impacto mas alto con menos codigo.
- Parquet Snappy es el formato estandar para data lakes: 3-5x compresion y predicate pushdown nativo.
- EXPLAIN y profiling revelan el bottleneck real — optimizar sin medir es adivinar.
- Los indices solo ayudan en columnas de alta cardinalidad que aparecen frecuentemente en WHERE.
- El data skew es el enemigo del paralelismo: una particion lenta determina el tiempo total del job.
- El orden de las operaciones importa: filtrar antes de JOIN reduce drasticamente los datos en memoria.

## Reto extra

Construye el benchmark comparativo de pipelines para el Data Lake del INEC Ecuador (Censo 2022, 17 millones de registros): compara pandas, DuckDB, PySpark y Polars para 5 queries tipicas (filtro simple, GROUP BY multidimensional, JOIN con tabla de provincias, window function de ranking, y agregacion con HAVING). Mide: tiempo de ejecucion, memoria pico, throughput (filas/segundo) y costo estimado en AWS (instancia r5.xlarge por hora). Genera el reporte comparativo en HTML con graficos interactivos Plotly y la recomendacion de herramienta por caso de uso.
