# Ejercicio Sesion 8: Proyecto — Data Lake Empresarial Ecuador

**Materia:** Cloud Computing y Data Lakes
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 90 min

## Objetivo

Construir un data lake empresarial completo para una empresa ecuatoriana: arquitectura multi-zona (raw/curated/analytics), ingestion multi-fuente, transformaciones Parquet, modelo de gobierno de datos, API de consulta, y dashboard ejecutivo — integrando todos los conceptos de la materia.

## Contexto

Este es el proyecto integrador de Cloud y Data Lakes. Simulamos ser el equipo de arquitectura de datos de Corporacion Favorita (Supermaxi, Akí, Gran Akí) — la cadena de supermercados mas grande de Ecuador con 90+ tiendas, 10M+ transacciones mensuales. El directorio pide un data lake moderno que reemplace el DW heredado de Oracle que cuesta $400K/ano por AWS + BigQuery a $30K/ano con el triple de capacidad.

## Instrucciones

1. Crea el archivo `sesion08_proyecto_datalake_favorita_ecuador.py`:

```python
# PROYECTO: Data Lake Corporacion Favorita Ecuador
# Data Lake completo: raw → curated → analytics → API → dashboard
# ITSEIA - Cloud Computing y Data Lakes - Sesion 8

import pandas as pd
import numpy as np
import pyarrow as pa
import pyarrow.parquet as pq
import sqlite3
import json
import os
import shutil
import hashlib
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 70)
print("PROYECTO: DATA LAKE CORPORACION FAVORITA ECUADOR")
print("Arquitectura cloud-native: S3 → Glue → BigQuery → Looker")
print(f"Ejecucion: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
print("=" * 70)

# ================================================
# CONFIGURACION DEL DATA LAKE
# ================================================
LAKE_ROOT = "/tmp/favorita_datalake"
ZONAS = {
    "raw":       f"{LAKE_ROOT}/raw",
    "curated":   f"{LAKE_ROOT}/curated",
    "analytics": f"{LAKE_ROOT}/analytics",
    "rejected":  f"{LAKE_ROOT}/rejected",
}

for zona, path in ZONAS.items():
    os.makedirs(path, exist_ok=True)

catalog = {"tablas": {}, "linaje": [], "runs": []}
metricas = {"inicio": datetime.now(), "errores": [], "registros": {}}

def log_linaje(fuente, destino, operacion, n_registros):
    catalog["linaje"].append({
        "timestamp": datetime.now().isoformat(),
        "fuente": fuente, "destino": destino,
        "operacion": operacion, "n_registros": n_registros
    })
    print(f"  [{datetime.now().strftime('%H:%M:%S')}] {operacion}: {fuente} → {destino} ({n_registros:,} registros)")

# ================================================
# GENERACION DATOS OPERACIONALES FAVORITA
# ================================================
print("\n[DATOS] Generando datos operacionales Corporacion Favorita...")

TIENDAS = {
    "T001": ("Supermaxi CCI",   "Quito",     "Pichincha",  "grande"),
    "T002": ("Supermaxi El Jardin","Quito",   "Pichincha",  "grande"),
    "T003": ("AKI Sur Quito",   "Quito",     "Pichincha",  "mediana"),
    "T004": ("Gran AKI Guayaquil","Guayaquil","Guayas",     "grande"),
    "T005": ("Supermaxi Samborondon","Guayaquil","Guayas",  "grande"),
    "T006": ("AKI Cuenca",      "Cuenca",    "Azuay",      "mediana"),
    "T007": ("AKI Ambato",      "Ambato",    "Tungurahua", "mediana"),
    "T008": ("AKI Manta",       "Manta",     "Manabi",     "pequena"),
    "T009": ("AKI Loja",        "Loja",      "Loja",       "pequena"),
    "T010": ("Gran AKI Sto Domingo","Santo Domingo","Santo Domingo","mediana"),
}

CATEGORIAS = {
    "GRA": ("Granos y Harinas",    [0.40, 1.80]),
    "LAC": ("Lacteos",             [0.50, 4.50]),
    "CAR": ("Carnes y Embutidos",  [1.20, 12.00]),
    "FRV": ("Frutas y Verduras",   [0.30, 3.50]),
    "LIM": ("Limpieza",            [0.80, 8.00]),
    "PER": ("Cuidado Personal",    [0.60, 15.00]),
    "BEB": ("Bebidas",             [0.35, 5.00]),
    "CON": ("Conservas",           [0.90, 6.00]),
}

# Tabla dimension: tiendas
df_tiendas = pd.DataFrame([
    {"tienda_id": k, "nombre": v[0], "ciudad": v[1],
     "provincia": v[2], "tipo": v[3]}
    for k, v in TIENDAS.items()
])

# Tabla dimension: productos (500 SKUs)
n_prod = 500
df_productos = pd.DataFrame({
    "producto_id": [f"SKU{i:05d}" for i in range(1, n_prod+1)],
    "nombre":      [f"Producto_{i}" for i in range(1, n_prod+1)],
    "categoria_id": np.random.choice(list(CATEGORIAS.keys()), n_prod),
    "marca":       np.random.choice(["Supermaxi","La Favorita","Nestlé","Unilever",
                                      "Danec","Quifatex","Tony","Dipac"], n_prod),
    "precio_venta":np.random.uniform(0.5, 20, n_prod).round(2),
    "costo":       np.random.uniform(0.3, 15, n_prod).round(2),
})

# Tabla fact: ventas (2 meses simulados)
n_ventas = 200000
fechas = pd.date_range("2024-01-01", "2024-02-29", freq="H")
df_ventas_raw = pd.DataFrame({
    "transaccion_id": [f"TXN{i:010d}" for i in range(1, n_ventas+1)],
    "fecha_hora":     np.random.choice(fechas, n_ventas),
    "tienda_id":      np.random.choice(list(TIENDAS.keys()), n_ventas,
                                         p=[0.15,0.15,0.10,0.12,0.10,0.08,0.08,0.07,0.07,0.08]),
    "producto_id":    np.random.choice(df_productos["producto_id"], n_ventas),
    "cantidad":       np.random.randint(1, 20, n_ventas),
    "precio_unitario": np.random.uniform(0.5, 20, n_ventas).round(2),
    "metodo_pago":    np.random.choice(["efectivo","tarjeta_credito","tarjeta_debito","app"],
                                        n_ventas, p=[0.45,0.28,0.20,0.07]),
    "canal":          np.random.choice(["tienda","online"], n_ventas, p=[0.88,0.12]),
    # 3% de filas con datos sucios (realismo)
    "total_venta":    np.where(np.random.random(n_ventas) < 0.03,
                               -999,  # error de sistema
                               (np.random.randint(1, 20, n_ventas) *
                                np.random.uniform(0.5, 20, n_ventas)).round(2)),
})

print(f"  Tiendas: {len(df_tiendas)} | Productos: {len(df_productos)} | Transacciones: {len(df_ventas_raw):,}")

# ================================================
# ZONA RAW: INGESTION
# ================================================
print("\n[RAW] Ingestion a zona raw...")

fecha_hoy = datetime.now().strftime("%Y/%m/%d")

# Guardar CSV en raw (formato original de los sistemas POS)
for nombre, df in [("ventas", df_ventas_raw), ("tiendas", df_tiendas), ("productos", df_productos)]:
    path = f"{ZONAS['raw']}/{nombre}/{fecha_hoy}/"
    os.makedirs(path, exist_ok=True)
    filepath = f"{path}/{nombre}_raw.csv"
    df.to_csv(filepath, index=False)
    log_linaje(f"sistema_pos/{nombre}", filepath, "INGESTION_RAW", len(df))
    metricas["registros"][f"raw_{nombre}"] = len(df)

# ================================================
# VALIDACION DE CALIDAD
# ================================================
print("\n[VALIDACION] Verificando calidad de datos...")

def validar_ventas(df):
    errores = []
    rechazados_idx = []

    # Total venta negativo (error de sistema)
    mask_neg = df["total_venta"] < 0
    if mask_neg.sum() > 0:
        errores.append(f"{mask_neg.sum()} registros con total_venta negativo")
        rechazados_idx.extend(df[mask_neg].index.tolist())

    # Precio unitario fuera de rango
    mask_precio = (df["precio_unitario"] > 500) | (df["precio_unitario"] < 0)
    if mask_precio.sum() > 0:
        errores.append(f"{mask_precio.sum()} registros con precio fuera de rango")
        rechazados_idx.extend(df[mask_precio].index.tolist())

    rechazados_idx = list(set(rechazados_idx))
    df_valido = df.drop(index=rechazados_idx)
    df_rechazado = df.loc[rechazados_idx]

    score = len(df_valido) / len(df) * 100
    return df_valido, df_rechazado, errores, score

df_ventas_valido, df_rechazado, errores_val, score_calidad = validar_ventas(df_ventas_raw)

print(f"  Score calidad: {score_calidad:.2f}%")
print(f"  Registros validos: {len(df_ventas_valido):,} | Rechazados: {len(df_rechazado):,}")
for e in errores_val:
    print(f"  ALERTA: {e}")

# Guardar rechazados en dead letter zone
path_rechazado = f"{ZONAS['rejected']}/ventas/{fecha_hoy}/rechazados.parquet"
os.makedirs(os.path.dirname(path_rechazado), exist_ok=True)
df_rechazado.to_parquet(path_rechazado, index=False)
log_linaje("raw/ventas", path_rechazado, "REJECTED_RECORDS", len(df_rechazado))

# ================================================
# ZONA CURATED: TRANSFORMACION
# ================================================
print("\n[CURATED] Transformando a zona curated...")

df_curated = df_ventas_valido.copy()

# Parsear fecha
df_curated["fecha_hora"] = pd.to_datetime(df_curated["fecha_hora"])
df_curated["fecha"]      = df_curated["fecha_hora"].dt.date.astype(str)
df_curated["anio"]       = df_curated["fecha_hora"].dt.year
df_curated["mes"]        = df_curated["fecha_hora"].dt.month
df_curated["dia"]        = df_curated["fecha_hora"].dt.day
df_curated["hora"]       = df_curated["fecha_hora"].dt.hour
df_curated["dia_semana"] = df_curated["fecha_hora"].dt.dayofweek  # 0=lun
df_curated["es_fin_semana"] = (df_curated["dia_semana"] >= 5).astype(int)
df_curated["es_quincena"]   = df_curated["dia"].isin([15, 16, 30, 31, 1]).astype(int)

# Recalcular total correcto
df_curated["total_calculado"] = (df_curated["cantidad"] * df_curated["precio_unitario"]).round(2)

# Enriquecer con join dimensiones
df_curated = df_curated.merge(
    df_productos[["producto_id","categoria_id","marca","costo"]],
    on="producto_id", how="left"
)
df_curated = df_curated.merge(
    df_tiendas[["tienda_id","ciudad","provincia","tipo"]],
    on="tienda_id", how="left"
)

# Margen bruto
df_curated["margen_bruto"] = (df_curated["total_calculado"] -
                               df_curated["cantidad"] * df_curated["costo"]).round(2)
df_curated["pct_margen"]   = (df_curated["margen_bruto"] / df_curated["total_calculado"] * 100).round(2)

# Guardar en Parquet particionado
curated_path = f"{ZONAS['curated']}/ventas/anio={df_curated['anio'].iloc[0]}"
os.makedirs(curated_path, exist_ok=True)
for mes, grupo in df_curated.groupby("mes"):
    mes_path = f"{curated_path}/mes={mes:02d}/"
    os.makedirs(mes_path, exist_ok=True)
    grupo.to_parquet(f"{mes_path}/ventas.parquet", index=False)
    log_linaje("raw/ventas", mes_path, "ETL_CURATED", len(grupo))

metricas["registros"]["curated_ventas"] = len(df_curated)

# ================================================
# ZONA ANALYTICS: AGREGACIONES
# ================================================
print("\n[ANALYTICS] Construyendo capa analytics...")

# 1. Ventas por tienda y dia
ventas_tienda = df_curated.groupby(["tienda_id","ciudad","provincia","tipo","fecha"]).agg(
    transacciones=("transaccion_id","count"),
    total_ventas=("total_calculado","sum"),
    margen_total=("margen_bruto","sum"),
    items_vendidos=("cantidad","sum"),
    ticket_promedio=("total_calculado","mean")
).round(2).reset_index()
ventas_tienda.to_parquet(f"{ZONAS['analytics']}/ventas_por_tienda_dia.parquet", index=False)
log_linaje("curated/ventas", "analytics/ventas_por_tienda_dia", "AGREGACION", len(ventas_tienda))

# 2. Top productos por categoria
top_productos = (df_curated.groupby(["categoria_id","producto_id","marca"])
                 .agg(cantidad_total=("cantidad","sum"),
                      ventas_total=("total_calculado","sum"),
                      margen_total=("margen_bruto","sum"))
                 .round(2).reset_index()
                 .sort_values("ventas_total", ascending=False))
top_productos["rank_categoria"] = (top_productos.groupby("categoria_id")["ventas_total"]
                                    .rank(ascending=False).astype(int))
top_productos.to_parquet(f"{ZONAS['analytics']}/top_productos.parquet", index=False)
log_linaje("curated/ventas", "analytics/top_productos", "RANKING", len(top_productos))

# 3. KPIs ejecutivos
kpis = {
    "total_ventas_2m": round(df_curated["total_calculado"].sum(), 2),
    "total_margen_2m": round(df_curated["margen_bruto"].sum(), 2),
    "pct_margen_global": round(df_curated["margen_bruto"].sum() / df_curated["total_calculado"].sum() * 100, 2),
    "num_transacciones": len(df_curated),
    "ticket_promedio_global": round(df_curated["total_calculado"].mean(), 2),
    "tiendas_activas": df_curated["tienda_id"].nunique(),
    "skus_vendidos": df_curated["producto_id"].nunique(),
    "pct_ventas_online": round((df_curated["canal"]=="online").mean()*100, 2),
    "pct_tarjeta": round((df_curated["metodo_pago"].str.contains("tarjeta")).mean()*100, 2),
}
pd.DataFrame([kpis]).to_parquet(f"{ZONAS['analytics']}/kpis_ejecutivos.parquet", index=False)
log_linaje("curated/ventas", "analytics/kpis_ejecutivos", "KPIS", 1)

metricas["registros"]["analytics_tablas"] = 3

# ================================================
# CATALOGO DE DATOS
# ================================================
print("\n[CATALOGO] Actualizando catalogo de datos...")

catalog["tablas"] = {
    "raw.ventas":           {"registros": len(df_ventas_raw), "formato": "CSV", "zona": "raw"},
    "curated.ventas":       {"registros": len(df_curated), "formato": "Parquet", "zona": "curated",
                             "particionado_por": ["anio","mes"]},
    "analytics.ventas_tienda": {"registros": len(ventas_tienda), "formato": "Parquet",
                                "zona": "analytics"},
    "analytics.top_productos": {"registros": len(top_productos), "formato": "Parquet",
                                 "zona": "analytics"},
    "analytics.kpis":          {"registros": 1, "formato": "Parquet", "zona": "analytics"},
}

with open(f"{LAKE_ROOT}/catalogo.json", "w") as f:
    json.dump(catalog, f, indent=2, default=str)
print(f"  Catalogo guardado: {LAKE_ROOT}/catalogo.json")

# ================================================
# REPORTE EJECUTIVO FINAL
# ================================================
print("\n" + "=" * 70)
print("REPORTE EJECUTIVO — CORPORACION FAVORITA ECUADOR")
print("=" * 70)
print(f"  Periodo analizado:     Enero - Febrero 2024")
print(f"\n  PERFORMANCE OPERACIONAL:")
print(f"  Transacciones totales: {kpis['num_transacciones']:,}")
print(f"  Ventas totales:        ${kpis['total_ventas_2m']:,.2f}")
print(f"  Margen total:          ${kpis['total_margen_2m']:,.2f} ({kpis['pct_margen_global']}%)")
print(f"  Ticket promedio:       ${kpis['ticket_promedio_global']:.2f}")

# Top tiendas
print(f"\n  TOP 5 TIENDAS POR VENTAS:")
top_tiendas = (ventas_tienda.groupby(["tienda_id","ciudad"])["total_ventas"].sum()
               .sort_values(ascending=False).head(5).reset_index())
for _, r in top_tiendas.iterrows():
    nombre = TIENDAS[r["tienda_id"]][0]
    print(f"    {nombre:<30}: ${r['total_ventas']:>12,.2f}")

# Top categorias
print(f"\n  TOP 5 CATEGORIAS POR MARGEN:")
top_cat = (df_curated.groupby("categoria_id")["margen_bruto"].sum()
           .sort_values(ascending=False).head(5))
for cat_id, margen in top_cat.items():
    nombre_cat = CATEGORIAS.get(cat_id, (cat_id,))[0]
    print(f"    {nombre_cat:<25}: ${margen:>10,.2f}")

print(f"\n  DIGITAL:")
print(f"  Ventas online:         {kpis['pct_ventas_online']}%")
print(f"  Pago con tarjeta:      {kpis['pct_tarjeta']}%")

# Metricas del pipeline
duracion = (datetime.now() - metricas["inicio"]).total_seconds()
print(f"\n  PIPELINE METRICAS:")
print(f"  Duracion total:        {duracion:.2f} segundos")
print(f"  Registros procesados:  {metricas['registros']['raw_ventas']:,}")
print(f"  Tasa aceptacion:       {score_calidad:.2f}%")
print(f"  Tablas analytics:      {metricas['registros']['analytics_tablas']}")
print(f"  Archivos generados:    raw(3) + curated(2 meses) + analytics(3)")

# ================================================
# ARQUITECTURA PRODUCCION RECOMENDADA
# ================================================
print(f"\n  ARQUITECTURA PRODUCCION RECOMENDADA:")
arq = """
  CORPORACION FAVORITA — DATA LAKE CLOUD

  [Tiendas POS] → [Kinesis Firehose] → [S3 raw/]
                                           ↓
                                    [Glue ETL Job]
                                           ↓
                                    [S3 curated/] (Parquet + Delta)
                                           ↓
                                    [Athena / Redshift]
                                           ↓
                                    [S3 analytics/]
                                           ↓
                            ┌──────────────┴──────────────┐
                       [Looker Studio]              [API FastAPI]
                       (dashboard gerencia)         (app movil)

  Costo estimado: $8,000/mes (vs $400,000/ano Oracle) → ROI 12 meses
  Escala:         10M transacciones/mes sin redimensionar
  SLA:            99.9% uptime (AWS SLA)
  """
print(arq)

# Limpiar archivos temporales
shutil.rmtree(LAKE_ROOT)
print("  Archivos temporales eliminados.")
print("=" * 70)
```

2. Ejecuta el pipeline completo y analiza el reporte ejecutivo de Corporacion Favorita.

3. Implementa una funcion `calcular_abc_inventario()` que clasifique los SKUs en categorias A (top 20% ventas), B (20-50%) y C (resto) usando la curva de Pareto.

4. Agrega el calculo de `Net Promoter Score` simulado: los clientes que pagan con la app movil tienen 5 puntos mas de NPS que los que pagan en efectivo.

## Usa IA para...

> Abre Claude y escribe:
> "Soy el arquitecto de datos de Corporacion Favorita Ecuador. Tengo el data lake en S3 con Parquet particionado. El equipo de BI necesita actualizar los dashboards de Looker Studio en tiempo real (< 5 minutos de latencia) en lugar de una vez al dia. ¿Como migro de batch a near-realtime sin reescribir todo? Opciones: 1) Kinesis Firehose → S3 + Athena, 2) Kafka → Spark Streaming → Delta Lake, 3) DynamoDB Streams → Lambda → S3. Analiza costo, latencia y complejidad para decidir la mejor opcion para Ecuador."

Despues de leer la respuesta:
- Documenta la decision tecnica con pros/contras de cada opcion.
- Diseña la arquitectura near-realtime para las ventas de Favorita.

## Que aprendiste

- Un data lake empresarial tiene zonas bien definidas: raw (inmutable), curated (limpio y tipado), analytics (agregado), rejected (errores).
- El linaje de datos registra la trayectoria de cada registro desde la fuente hasta el destino — esencial para auditoria.
- Las dimensiones (tiendas, productos) se unen a las facts (ventas) en la zona curated — modelo estrella.
- Parquet particionado por fecha hace que las queries de Athena escaneen solo los datos necesarios.
- El catalogo de datos registra schema, tamano, formato y particionamiento de cada tabla.
- La migracion de Oracle a cloud reduce costos 10-50x manteniendo o mejorando capacidad analitica.

## Reto extra

Despliega el data lake de Favorita como servicio gestionado en AWS: S3 con versioning + lifecycle policies (raw 7 anos, curated 5 anos, analytics 2 anos), Glue Catalog con crawler automatico, Athena workgroup con limite de costo $100/mes, QuickSight dashboard con alertas cuando el margen de alguna categoria cae mas del 2% semana a semana, y presupuesto AWS Budget que alerta cuando el costo mensual supera $10,000. Presenta el ROI al directorio de Favorita.
