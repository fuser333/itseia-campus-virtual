# Ejercicio Sesion 8: Proyecto — Pipeline ETL Datos Ecuador

**Materia:** Data Warehousing y ETL
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 90 min

## Objetivo

Construir un pipeline ETL de produccion completo: extraer datos de 4 fuentes del sector agropecuario ecuatoriano, implementar schema estrella, calidad de datos, transformaciones avanzadas y carga incremental al DW, generando un reporte ejecutivo para el Ministerio de Agricultura.

## Contexto

El MAGAP (Ministerio de Agricultura, Ganaderia, Acuacultura y Pesca) Ecuador necesita un DW que consolide: produccion agricola por cultivo y provincia, precios en mercados mayoristas, exportaciones e importaciones agropecuarias. Tu construyes ese pipeline de principio a fin.

## Instrucciones

1. Crea el archivo `sesion08_proyecto_etl_magap_ecuador.py`:

```python
# PROYECTO ETL COMPLETO — MAGAP Ecuador
# Pipeline: extraccion, calidad, transformacion, DW, reporte
# ITSEIA - Data Warehousing - Sesion 8 (Proyecto Integrador)

import pandas as pd
import numpy as np
import sqlite3
import json
import logging
from datetime import datetime, date, timedelta
from io import StringIO

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s [%(levelname)s] %(message)s",
                    datefmt="%H:%M:%S")
log = logging.getLogger("etl_magap")

np.random.seed(2026)
print("=" * 70)
print("PROYECTO ETL — DW SECTOR AGROPECUARIO ECUADOR")
print("Ministerio de Agricultura y Ganaderia (MAGAP)")
print("=" * 70)

# ================================================
# PHASE 1: EXTRACT (4 fuentes)
# ================================================
log.info("EXTRACT: Extrayendo 4 fuentes...")

provincias = ["Pichincha","Guayas","Manabi","Los Rios","Imbabura",
              "Tungurahua","Cotopaxi","Chimborazo","Azuay","Loja",
              "Esmeraldas","El Oro","Carchi","Bolivar","Napo"]
cultivos = ["maiz","arroz","papa","cacao","banano","brocolí","tomate","cebolla",
            "platano","naranja","cafe","palma"]
meses = pd.date_range("2022-01", "2024-12", freq="MS")

n_prod = 360  # produccion mensual por cultivo-provincia

# Fuente 1: Produccion agricola (ESPAC INEC)
produccion_rows = []
for i in range(n_prod):
    cult = np.random.choice(cultivos)
    prov = np.random.choice(provincias)
    mes  = np.random.choice(meses)
    area = np.random.uniform(50, 5000)    # hectareas
    rend = np.random.uniform(1.5, 45)    # tm/ha segun cultivo
    produccion_rows.append({
        "periodo": mes.strftime("%Y-%m"),
        "provincia": prov,
        "cultivo": cult,
        "area_hectareas": round(area, 1),
        "rendimiento_tm_ha": round(rend, 2),
        "produccion_tm": round(area * rend, 1),
        "agricultores": int(area / 3.5)
    })
df_produccion = pd.DataFrame(produccion_rows)
log.info(f"  F1 Produccion ESPAC: {len(df_produccion)} registros")

# Fuente 2: Precios mercados mayoristas (Sipae)
n_precios = 200
df_precios = pd.DataFrame({
    "periodo":  [np.random.choice(meses).strftime("%Y-%m") for _ in range(n_precios)],
    "mercado":  np.random.choice(["Mercado Mayorista Quito","Mercado Central GYE",
                                   "Feria Ambato","Mercado Cuenca"], n_precios),
    "cultivo":  np.random.choice(cultivos, n_precios),
    "precio_min_kg": np.random.uniform(0.15, 2.50, n_precios).round(3),
    "precio_max_kg": np.random.uniform(0.30, 4.00, n_precios).round(3),
    "precio_prom_kg": np.random.uniform(0.20, 3.00, n_precios).round(3),
    "volumen_tm": np.random.uniform(5, 500, n_precios).round(1)
})
log.info(f"  F2 Precios Sipae: {len(df_precios)} registros")

# Fuente 3: Exportaciones (BCE Ecuador)
df_exportaciones = pd.DataFrame({
    "periodo":         [np.random.choice(meses).strftime("%Y-%m") for _ in range(100)],
    "producto":        np.random.choice(["banano","cacao","cafe","flores","camaron",
                                          "atun","palma"], 100),
    "pais_destino":    np.random.choice(["Estados Unidos","Alemania","Colombia",
                                          "Peru","China","Italia"], 100),
    "toneladas_metricas": np.random.uniform(100, 50000, 100).round(1),
    "valor_fob_miles_usd": np.random.uniform(50, 20000, 100).round(2)
})
log.info(f"  F3 Exportaciones BCE: {len(df_exportaciones)} registros")

# Fuente 4: Lookup de cultivos (dimension)
cultivos_dim = {
    "maiz":    {"familia":"Gramineas",  "ciclo_meses":4, "requiere_riego":False, "exportable":False},
    "arroz":   {"familia":"Gramineas",  "ciclo_meses":4, "requiere_riego":True,  "exportable":False},
    "papa":    {"familia":"Solanaceas", "ciclo_meses":4, "requiere_riego":True,  "exportable":False},
    "cacao":   {"familia":"Malvaceas",  "ciclo_meses":24,"requiere_riego":False, "exportable":True},
    "banano":  {"familia":"Musaceas",   "ciclo_meses":12,"requiere_riego":True,  "exportable":True},
    "brocolí": {"familia":"Cruciferas", "ciclo_meses":3, "requiere_riego":True,  "exportable":True},
    "tomate":  {"familia":"Solanaceas", "ciclo_meses":3, "requiere_riego":True,  "exportable":False},
    "cebolla": {"familia":"Liliaceas",  "ciclo_meses":4, "requiere_riego":True,  "exportable":False},
    "platano": {"familia":"Musaceas",   "ciclo_meses":12,"requiere_riego":False, "exportable":True},
    "naranja": {"familia":"Rutaceas",   "ciclo_meses":12,"requiere_riego":False, "exportable":False},
    "cafe":    {"familia":"Rubiaceas",  "ciclo_meses":12,"requiere_riego":False, "exportable":True},
    "palma":   {"familia":"Arecaceas",  "ciclo_meses":36,"requiere_riego":False, "exportable":True},
}
df_cultivos_dim = pd.DataFrame(cultivos_dim).T.reset_index()
df_cultivos_dim.columns = ["cultivo","familia","ciclo_meses","requiere_riego","exportable"]
log.info(f"  F4 Dimension cultivos: {len(df_cultivos_dim)} registros")

# ================================================
# PHASE 2: DATA QUALITY
# ================================================
log.info("VALIDACION: Aplicando reglas de calidad...")
errores_dq = []

# DQ1: produccion no negativa
neg_prod = (df_produccion["produccion_tm"] < 0).sum()
if neg_prod:
    errores_dq.append(f"Produccion negativa: {neg_prod}")
    df_produccion = df_produccion[df_produccion["produccion_tm"] >= 0]

# DQ2: precio min <= precio max
precios_inv = (df_precios["precio_min_kg"] > df_precios["precio_max_kg"]).sum()
if precios_inv:
    errores_dq.append(f"Precio min > max: {precios_inv}")
    df_precios.loc[df_precios["precio_min_kg"] > df_precios["precio_max_kg"],
                   ["precio_min_kg","precio_max_kg"]] = df_precios.loc[
        df_precios["precio_min_kg"] > df_precios["precio_max_kg"],
        ["precio_max_kg","precio_min_kg"]
    ].values

# DQ3: cultivos validos
cultivos_validos = set(cultivos)
inv_cult = (~df_produccion["cultivo"].isin(cultivos_validos)).sum()
if inv_cult:
    errores_dq.append(f"Cultivos invalidos: {inv_cult}")

score_dq = max(0, 100 - len(errores_dq) * 10)
log.info(f"  Score calidad: {score_dq}% | Alertas: {len(errores_dq)}")

# ================================================
# PHASE 3: TRANSFORM
# ================================================
log.info("TRANSFORM: 6 transformaciones aplicadas...")

# T1: Fechas
for df_t in [df_produccion, df_precios, df_exportaciones]:
    df_t["fecha"] = pd.to_datetime(df_t["periodo"])
    df_t["anio"] = df_t["fecha"].dt.year
    df_t["mes"] = df_t["fecha"].dt.month
    df_t["trimestre"] = df_t["fecha"].dt.quarter

# T2: Join produccion con dimension cultivos
df_produccion = df_produccion.merge(df_cultivos_dim, on="cultivo", how="left")

# T3: Join produccion con precios promedio del mes
precios_agg = df_precios.groupby(["periodo","cultivo"])["precio_prom_kg"].mean().reset_index()
precios_agg.columns = ["periodo","cultivo","precio_prom_mercado"]
df_produccion = df_produccion.merge(precios_agg, on=["periodo","cultivo"], how="left")
df_produccion["precio_prom_mercado"] = df_produccion["precio_prom_mercado"].fillna(
    df_produccion.groupby("cultivo")["precio_prom_mercado"].transform("median")
)

# T4: Calcular valor de produccion
df_produccion["valor_produccion_usd"] = (
    df_produccion["produccion_tm"] * 1000 * df_produccion["precio_prom_mercado"]
).round(2)

# T5: Segmentar provincias por region
sierra = ["Pichincha","Tungurahua","Cotopaxi","Chimborazo","Azuay","Loja","Carchi","Bolivar","Imbabura"]
costa  = ["Guayas","Manabi","Los Rios","Esmeraldas","El Oro"]
oriente = ["Napo","Sucumbios","Orellana","Morona","Zamora","Pastaza"]
def region(prov):
    if prov in sierra:  return "Sierra"
    if prov in costa:   return "Costa"
    if prov in oriente: return "Oriente"
    return "Galapagos"

df_produccion["region"] = df_produccion["provincia"].apply(region)

# T6: Columna de fecha ETL
df_produccion["fecha_etl"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
log.info(f"  Transform completo: {len(df_produccion)} registros, {len(df_produccion.columns)} columnas")

# ================================================
# PHASE 4: LOAD — Schema Estrella
# ================================================
log.info("LOAD: Construyendo schema estrella...")
conn_dw = sqlite3.connect(":memory:")

# Dimensiones
dim_tiempo = df_produccion[["anio","mes","trimestre","periodo"]].drop_duplicates()
dim_tiempo["tiempo_id"] = range(1, len(dim_tiempo) + 1)
dim_tiempo.to_sql("dim_tiempo", conn_dw, index=False)

dim_cultivo = df_cultivos_dim.copy()
dim_cultivo["cultivo_id"] = range(1, len(dim_cultivo) + 1)
dim_cultivo.to_sql("dim_cultivo", conn_dw, index=False)

dim_geo = df_produccion[["provincia","region"]].drop_duplicates().reset_index(drop=True)
dim_geo["geo_id"] = range(1, len(dim_geo) + 1)
dim_geo.to_sql("dim_geografia", conn_dw, index=False)

# Tabla de hechos
df_fact = df_produccion.merge(dim_tiempo, on=["anio","mes","trimestre","periodo"]) \
                        .merge(dim_geo, on=["provincia","region"])
df_fact = df_fact.rename(columns={"cultivo_id": "cultivo_id_orig"})
df_fact = df_fact.merge(dim_cultivo[["cultivo","cultivo_id"]], on="cultivo")

cols_fact = ["tiempo_id","cultivo_id","geo_id","area_hectareas",
             "rendimiento_tm_ha","produccion_tm","agricultores",
             "precio_prom_mercado","valor_produccion_usd","fecha_etl"]
df_fact[[c for c in cols_fact if c in df_fact.columns]].to_sql(
    "fact_produccion_agropecuaria", conn_dw, index=False)

cnt = pd.read_sql("SELECT COUNT(*) as n FROM fact_produccion_agropecuaria", conn_dw).iloc[0]["n"]
log.info(f"  DW cargado: {cnt} hechos en fact_produccion_agropecuaria")

# Exportaciones a tabla separada
df_exportaciones.to_sql("fact_exportaciones", conn_dw, index=False)

# ================================================
# PHASE 5: REPORTES EJECUTIVOS
# ================================================
print("\n[REPORTES] Generando reportes ejecutivos...")

# R1: Produccion por region
print("\n  R1: Produccion total por region (TM)")
r1 = pd.read_sql("""
    SELECT g.region,
           SUM(f.produccion_tm) as produccion_total,
           SUM(f.valor_produccion_usd) as valor_total_usd,
           COUNT(DISTINCT f.cultivo_id) as cultivos
    FROM fact_produccion_agropecuaria f
    JOIN dim_geografia g ON f.geo_id = g.geo_id
    GROUP BY g.region ORDER BY produccion_total DESC
""", conn_dw)
print(r1.to_string(index=False))

# R2: Top 5 cultivos por valor
print("\n  R2: Top 5 cultivos por valor de produccion")
r2 = pd.read_sql("""
    SELECT c.cultivo, c.exportable,
           SUM(f.produccion_tm) as produccion_tm,
           SUM(f.valor_produccion_usd) as valor_usd,
           AVG(f.rendimiento_tm_ha) as rendimiento_prom
    FROM fact_produccion_agropecuaria f
    JOIN dim_cultivo c ON f.cultivo_id = c.cultivo_id
    GROUP BY c.cultivo, c.exportable
    ORDER BY valor_usd DESC LIMIT 5
""", conn_dw)
print(r2.to_string(index=False))

# R3: Evolucion anual
print("\n  R3: Produccion total por anio")
r3 = pd.read_sql("""
    SELECT t.anio,
           SUM(f.produccion_tm) as produccion_tm,
           SUM(f.valor_produccion_usd) as valor_usd,
           SUM(f.agricultores) as agricultores
    FROM fact_produccion_agropecuaria f
    JOIN dim_tiempo t ON f.tiempo_id = t.tiempo_id
    GROUP BY t.anio ORDER BY t.anio
""", conn_dw)
print(r3.to_string(index=False))

conn_dw.close()

print("\n" + "=" * 70)
print("RESUMEN PROYECTO ETL MAGAP ECUADOR")
print(f"  Fuentes procesadas:    4 (ESPAC, Sipae, BCE, Dim Cultivos)")
print(f"  Score calidad datos:   {score_dq}%")
print(f"  Alertas DQ:            {len(errores_dq)}")
print(f"  Transformaciones:      6")
print(f"  Schema DW:             4 tablas (1 hechos, 3 dims)")
print(f"  Registros en DW:       {cnt}")
print(f"  Reportes generados:    3")
print("=" * 70)
```

3. Ejecuta el proyecto completo. Analiza los 3 reportes ejecutivos.

4. Agrega un cuarto reporte: "Valor de exportacion por producto y anio" usando la tabla `fact_exportaciones`.

## Usa IA para...

> Abre Claude y escribe:
> "Construi un DW para el sector agropecuario Ecuador. El schema estrella tiene: fact_produccion con dimensiones de tiempo, cultivo y geografia. ¿Que KPIs de negocio adicionales deberia calcular? Dame 5 con la formula en SQL y su interpretacion para el Ministerio de Agricultura."

Despues de leer la respuesta:
- Implementa los 5 KPIs como queries SQL en el DW del ejercicio.
- Agrega un reporte R5 que muestre los KPIs en formato de resumen ejecutivo.

## Que aprendiste

- Un proyecto ETL completo tiene 5 fases: Extract, Validate, Transform, Load, Report.
- El schema estrella del DW separa metricas (hechos) de contexto (dimensiones).
- La calidad de datos debe verificarse entre Extract y Transform, no despues de Load.
- Las transformaciones de enriquecimiento (joins con dimensiones, calculos) agregan valor analítico.
- Los reportes ejecutivos convierten los datos del DW en conocimiento para toma de decisiones.
- La carga incremental (`if_exists="append"`) es mas eficiente que la carga total (`replace`).

## Reto extra

Implementa una version de produccion del pipeline: usa PostgreSQL real (en lugar de SQLite), Airflow para orquestar, y genera un PDF del reporte ejecutivo usando reportlab. El pipeline debe ejecutarse automaticamente el primer dia de cada mes con los datos del mes anterior, y enviar el PDF por email al equipo del MAGAP.
