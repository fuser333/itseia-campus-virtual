# Ejercicio Sesion 4: Python ETL con Pandas

**Materia:** Data Warehousing y ETL
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Construir un pipeline ETL robusto con pandas, implementando extraccion desde CSV/JSON/API, transformaciones avanzadas (merge, pivot, melt, groupby) y carga a SQLite, procesando datos del sector turistico ecuatoriano.

## Contexto

El Ministerio de Turismo Ecuador publica estadisticas de llegadas de turistas por pais de origen, mes y punto de entrada. Convertir esos datos crudos en un data mart util requiere un ETL bien estructurado con pandas. Este ejercicio simula el pipeline que un analista de datos del Ministerio de Turismo ejecutaria mensualmente.

## Instrucciones

1. Crea el archivo `sesion04_python_etl_pandas_ecuador.py`:

```python
# Python ETL con Pandas - ITSEIA Data Warehousing
# Sector: Turismo Ecuador - Ministerio de Turismo
# Pipeline completo con manejo de errores y logging

import pandas as pd
import numpy as np
import sqlite3
import json
import logging
from datetime import datetime
from io import StringIO

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
log = logging.getLogger("etl_turismo")

print("=" * 65)
print("ETL PANDAS — TURISMO ECUADOR 2024")
print("Ministerio de Turismo del Ecuador")
print("=" * 65)

# ================================================
# EXTRACT: datos de turismo simulados
# ================================================
log.info("EXTRACT: Iniciando extraccion de fuentes...")

# Fuente 1: llegadas mensuales por punto de entrada (CSV simulado)
csv_llegadas = """
mes,punto_entrada,pais_origen,llegadas,modalidad
2024-01,Aeropuerto Quito,Estados Unidos,12450,aereo
2024-01,Aeropuerto Quito,Colombia,3820,aereo
2024-01,Aeropuerto Quito,Peru,2100,aereo
2024-01,Aeropuerto Quito,Espana,1890,aereo
2024-01,Aeropuerto Guayaquil,Estados Unidos,8230,aereo
2024-01,Aeropuerto Guayaquil,Colombia,4100,aereo
2024-01,Rumichaca,Colombia,15600,terrestre
2024-01,Huaquillas,Peru,8400,terrestre
2024-02,Aeropuerto Quito,Estados Unidos,13200,aereo
2024-02,Aeropuerto Quito,Colombia,4100,aereo
2024-02,Aeropuerto Quito,Peru,2300,aereo
2024-02,Aeropuerto Guayaquil,Estados Unidos,8900,aereo
2024-02,Rumichaca,Colombia,16200,terrestre
2024-02,Huaquillas,Peru,9100,terrestre
2024-03,Aeropuerto Quito,Estados Unidos,14800,aereo
2024-03,Aeropuerto Quito,Colombia,4500,aereo
2024-03,Aeropuerto Quito,Espana,2200,aereo
2024-03,Aeropuerto Quito,Alemania,980,aereo
2024-03,Aeropuerto Guayaquil,Estados Unidos,10200,aereo
2024-03,Rumichaca,Colombia,17400,terrestre
2024-03,Huaquillas,Peru,9800,terrestre
"""
df_llegadas = pd.read_csv(StringIO(csv_llegadas))
log.info(f"  Llegadas extraidas: {len(df_llegadas)} registros")

# Fuente 2: gasto promedio por turista (JSON simulado)
gasto_json = """
[
    {"pais": "Estados Unidos", "gasto_usd_dia": 185, "estadia_dias": 8},
    {"pais": "Colombia",       "gasto_usd_dia": 65,  "estadia_dias": 5},
    {"pais": "Peru",           "gasto_usd_dia": 55,  "estadia_dias": 4},
    {"pais": "Espana",         "gasto_usd_dia": 145, "estadia_dias": 12},
    {"pais": "Alemania",       "gasto_usd_dia": 160, "estadia_dias": 14},
    {"pais": "Brasil",         "gasto_usd_dia": 95,  "estadia_dias": 7},
    {"pais": "Argentina",      "gasto_usd_dia": 75,  "estadia_dias": 6}
]
"""
df_gasto = pd.read_json(StringIO(gasto_json))
log.info(f"  Gastos extraidos: {len(df_gasto)} paises")

# Fuente 3: clasificacion de puntos de entrada (dict simulando lookup table)
puntos_entrada = {
    "Aeropuerto Quito":      {"ciudad": "Quito",      "tipo": "aeropuerto", "codigo": "UIO"},
    "Aeropuerto Guayaquil":  {"ciudad": "Guayaquil",  "tipo": "aeropuerto", "codigo": "GYE"},
    "Rumichaca":             {"ciudad": "Tulcan",     "tipo": "terrestre",  "codigo": "RUM"},
    "Huaquillas":            {"ciudad": "Huaquillas", "tipo": "terrestre",  "codigo": "HUQ"},
}
df_puntos = pd.DataFrame(puntos_entrada).T.reset_index()
df_puntos.columns = ["punto_entrada", "ciudad_acceso", "tipo_entrada", "codigo_iata"]
log.info(f"  Puntos entrada: {len(df_puntos)} registros")

# ================================================
# TRANSFORM: 7 transformaciones encadenadas
# ================================================
log.info("TRANSFORM: Aplicando 7 transformaciones...")

# T1: Parsear y enriquecer fechas
df = df_llegadas.copy()
df["fecha"] = pd.to_datetime(df["mes"])
df["anio"] = df["fecha"].dt.year
df["mes_num"] = df["fecha"].dt.month
df["trimestre"] = df["fecha"].dt.quarter
df["mes_nombre"] = df["fecha"].dt.strftime("%B")
log.info("  T1: Fechas enriquecidas con anio, mes, trimestre")

# T2: Estandarizar strings
df["punto_entrada"] = df["punto_entrada"].str.strip()
df["pais_origen"]   = df["pais_origen"].str.strip().str.title()
df["modalidad"]     = df["modalidad"].str.lower()
log.info("  T2: Strings estandarizados")

# T3: Join con gasto promedio
df = df.merge(df_gasto.rename(columns={"pais": "pais_origen"}),
              on="pais_origen", how="left")
df["gasto_usd_dia"]  = df["gasto_usd_dia"].fillna(80)  # default para paises sin dato
df["estadia_dias"]   = df["estadia_dias"].fillna(6)
log.info(f"  T3: Join con gastos ({df['gasto_usd_dia'].isnull().sum()} sin dato, imputados con 80)")

# T4: Join con puntos de entrada
df = df.merge(df_puntos, on="punto_entrada", how="left")
log.info("  T4: Join con clasificacion de puntos de entrada")

# T5: Calcular metricas derivadas
df["ingreso_estimado_usd"] = (df["llegadas"] * df["gasto_usd_dia"] * df["estadia_dias"]).round(0)
df["noches_vendidas"]      = (df["llegadas"] * df["estadia_dias"]).round(0)
log.info("  T5: Metricas calculadas (ingreso_estimado, noches_vendidas)")

# T6: Categorizar turistas por pais (continente)
americalatina = ["Colombia","Peru","Brasil","Argentina","Chile","Venezuela","Bolivia"]
norteamerica  = ["Estados Unidos","Canada","Mexico"]
europa        = ["Espana","Alemania","Francia","Italia","Reino Unido"]

def clasificar_region(pais):
    if pais in americalatina: return "America Latina"
    if pais in norteamerica:  return "Norte America"
    if pais in europa:        return "Europa"
    return "Otros"

df["region_origen"] = df["pais_origen"].apply(clasificar_region)
log.info("  T6: Clasificacion por region de origen aplicada")

# T7: Seleccionar y ordenar columnas finales
columnas_dw = [
    "mes", "anio", "mes_num", "trimestre", "mes_nombre",
    "punto_entrada", "ciudad_acceso", "tipo_entrada", "codigo_iata",
    "pais_origen", "region_origen", "modalidad",
    "llegadas", "gasto_usd_dia", "estadia_dias",
    "ingreso_estimado_usd", "noches_vendidas"
]
df_final = df[columnas_dw].copy()
df_final["fecha_etl"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
log.info(f"  T7: Dataset final: {len(df_final)} registros x {len(df_final.columns)} columnas")

# ================================================
# AGREGACIONES PARA EL DW
# ================================================
log.info("TRANSFORM AGREGACIONES: Creando tablas de resumen...")

# Pivot: llegadas por mes y modalidad
pivot_modalidad = df_final.pivot_table(
    values="llegadas", index="mes", columns="modalidad", aggfunc="sum", fill_value=0
)
print("\n  Llegadas por mes y modalidad:")
print(pivot_modalidad.to_string())

# GroupBy: ingresos por region
ingresos_region = df_final.groupby("region_origen").agg(
    llegadas_total=("llegadas", "sum"),
    ingreso_total=("ingreso_estimado_usd", "sum"),
    gasto_promedio=("gasto_usd_dia", "mean")
).round(2).sort_values("ingreso_total", ascending=False)
print("\n  Ingresos estimados por region de origen:")
print(ingresos_region.to_string())

# ================================================
# LOAD: cargar al Data Warehouse
# ================================================
log.info("LOAD: Cargando al Data Warehouse SQLite...")

conn_dw = sqlite3.connect(":memory:")

# Tabla de hechos
df_final.to_sql("fact_turismo", conn_dw, if_exists="replace", index=False)

# Tabla de agregacion mensual
agg_mensual = df_final.groupby(["mes", "anio", "mes_nombre"]).agg(
    total_llegadas=("llegadas", "sum"),
    total_ingresos=("ingreso_estimado_usd", "sum"),
    total_noches=("noches_vendidas", "sum"),
    paises_distintos=("pais_origen", "nunique")
).reset_index()
agg_mensual.to_sql("dim_turismo_mensual", conn_dw, if_exists="replace", index=False)

# Verificar
cnt = pd.read_sql("SELECT COUNT(*) as n FROM fact_turismo", conn_dw).iloc[0]["n"]
log.info(f"  Registros cargados en fact_turismo: {cnt}")

# Query de verificacion
top_paises = pd.read_sql("""
    SELECT pais_origen, region_origen,
           SUM(llegadas) as total_llegadas,
           SUM(ingreso_estimado_usd) as ingreso_total
    FROM fact_turismo
    GROUP BY pais_origen, region_origen
    ORDER BY total_llegadas DESC
    LIMIT 5
""", conn_dw)
print("\n  Top 5 paises por llegadas (DW cargado):")
print(top_paises.to_string(index=False))

# ================================================
# RESUMEN PIPELINE
# ================================================
print("\n" + "=" * 65)
print("RESUMEN PIPELINE ETL PANDAS")
print(f"  Fuentes:    3 (CSV, JSON, dict)")
print(f"  Registros entrada: {len(df_llegadas) + len(df_gasto) + len(df_puntos)}")
print(f"  Transformaciones:  7 aplicadas")
print(f"  Registros salida:  {len(df_final)}")
print(f"  Tablas DW:         2 (fact_turismo, dim_turismo_mensual)")
print(f"  Tiempo ejecucion:  < 1 segundo (datos simulados)")
print("=" * 65)
```

3. Ejecuta y analiza el pivot_modalidad y el ranking de ingresos por region.

4. Agrega una transformacion T8: calcular la "tasa de crecimiento" de llegadas mes a mes usando `pct_change()`.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un DataFrame pandas con datos de turismo Ecuador: columnas mes, pais_origen, llegadas, gasto_usd. ¿Como calculo la tasa de crecimiento mensual por pais usando pct_change()? ¿Y como creo un pivot_table que muestre las llegadas por mes (filas) y pais (columnas)? Dame el codigo."

Despues de leer la respuesta:
- Implementa ambas operaciones en el pipeline del ejercicio.
- Agrega la tasa de crecimiento al DataFrame final antes de la carga.

## Que aprendiste

- `pd.read_csv(StringIO(...))` permite leer CSV desde strings en memoria.
- `pd.merge()` implementa los JOINs entre DataFrames — clave en ETL.
- `pivot_table()` transpone datos de filas a columnas — ideal para reportes.
- `groupby().agg()` aplica multiples agregaciones en una sola operacion.
- `df.to_sql()` carga el DataFrame directamente a una base de datos.
- El logging estructurado en ETL facilita la depuracion y el monitoreo.

## Reto extra

Automatiza el pipeline con parametrizacion: el script debe aceptar como argumento el mes a procesar (ej: `python etl.py 2024-04`) y solo procesar datos de ese mes. Agrega manejo de errores con try/except para cada fuente: si la Fuente 2 no esta disponible, el pipeline debe continuar con valores por defecto y registrar el error en un log. Genera un archivo `etl_log_YYYY-MM-DD.txt` con el reporte de ejecucion.
