# Ejercicio Sesion 2: Google Cloud Platform y BigQuery

**Materia:** Cloud Computing y Data Lakes
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Usar Google Cloud Platform (GCP) para analisis de datos a escala: BigQuery para SQL analítico, Cloud Storage para data lake, el SDK de Python `google-cloud-bigquery`, y disenar un data warehouse en GCP para datos gubernamentales de Ecuador.

## Contexto

El gobierno de Ecuador usa GCP para procesos del MSP y del MINEDUC. Banco del Pichincha y Produbanco tienen acuerdos con Google Cloud. BigQuery puede analizar 1 BILLON de filas en segundos con SQL estandar — sin configurar servidores, sin tuning de indices. Para datos del INEC (Censo), SRI (facturas) o MSP (salud), BigQuery es la solucion mas sencilla y rapida.

## Instrucciones

1. Instala: `pip install google-cloud-bigquery google-cloud-storage db-dtypes`.

2. Crea el archivo `sesion02_gcp_bigquery_ecuador.py`:

```python
# GCP + BigQuery - ITSEIA
# Cloud Computing y Data Lakes
# Data warehouse GCP para Ecuador

import pandas as pd
import numpy as np
from datetime import datetime, date, timedelta
import json
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("GCP + BIGQUERY — DATOS GUBERNAMENTALES ECUADOR")
print("=" * 65)

# ================================================
# ARQUITECTURA GCP PARA DATOS ECUADOR
# ================================================
print("\n--- ARQUITECTURA GCP DATA WAREHOUSE ---")

arquitectura_gcp = {
    "Cloud Storage (GCS)": {
        "rol":      "Data Lake (equivalente a AWS S3)",
        "bucket":   "gs://ecuador-datos-gov/",
        "zonas":    ["raw/","curated/","analytics/"],
        "formato":  "CSV/JSON en raw, Parquet en curated/analytics"
    },
    "BigQuery": {
        "rol":      "Data Warehouse analítico serverless",
        "datasets": ["raw_ingest","dwh_staging","dwh_core","dwh_analytics"],
        "precios":  "$5 por TB escaneado en queries (primeros 1TB gratis/mes)",
        "escala":   "Petabytes sin configuracion"
    },
    "Cloud Dataflow": {
        "rol":      "ETL batch y streaming (Apache Beam managed)",
        "caso_uso": "Transformar raw → curated a escala"
    },
    "Looker Studio": {
        "rol":      "BI y dashboards conectado directo a BigQuery",
        "costo":    "Gratis para visualizacion"
    },
    "Cloud Functions": {
        "rol":      "Triggers event-driven (equivalente a AWS Lambda)",
        "caso_uso": "Procesar archivo al llegar a GCS"
    }
}

for servicio, info in arquitectura_gcp.items():
    print(f"\n  [{servicio}]")
    for k, v in info.items():
        print(f"    {k}: {v}")

# ================================================
# SIMULACION BIGQUERY CON PANDAS (sin cuenta GCP)
# ================================================
print("\n--- SIMULACION: DATASET SALUD MSP ECUADOR ---")

# En produccion real, reemplazar con:
#   from google.cloud import bigquery
#   client = bigquery.Client(project="ecuador-gov")
#   df = client.query(QUERY).to_dataframe()
# Aqui simulamos el resultado de BigQuery

def simular_bigquery(query, descripcion):
    """Simula resultado de query BigQuery."""
    print(f"\n  BQ Query: {descripcion}")
    print(f"  SQL: {query[:80]}...")
    return True

# Dataset simulado: establecimientos de salud MSP
n_establecimientos = 300
df_salud = pd.DataFrame({
    "id_establecimiento": [f"EC-{i:05d}" for i in range(1, n_establecimientos+1)],
    "nombre":   [f"CS_{i}" for i in range(1, n_establecimientos+1)],
    "tipo":     np.random.choice(["Hospital","Centro Salud","Subcentro","IESS"],
                                  n_establecimientos, p=[0.08,0.35,0.47,0.10]),
    "provincia": np.random.choice(
        ["Pichincha","Guayas","Azuay","Manabi","Tungurahua",
         "Chimborazo","El Oro","Imbabura","Loja","Los Rios"],
        n_establecimientos, p=[0.22,0.20,0.10,0.10,0.07,0.07,0.07,0.07,0.06,0.04]
    ),
    "camas":    np.random.randint(0, 200, n_establecimientos),
    "medicos":  np.random.randint(1, 50, n_establecimientos),
    "lat":      np.random.uniform(-5.0, 1.5, n_establecimientos).round(6),
    "lon":      np.random.uniform(-81.0, -75.0, n_establecimientos).round(6),
    "anio_inauguracion": np.random.randint(1950, 2024, n_establecimientos),
})

# Tabla de atenciones (fact table)
n_atenciones = 5000
atenciones = pd.DataFrame({
    "id_atencion":   range(1, n_atenciones+1),
    "fecha":         pd.date_range("2024-01-01", periods=n_atenciones, freq="H").strftime("%Y-%m-%d"),
    "id_establecimiento": np.random.choice(df_salud["id_establecimiento"], n_atenciones),
    "tipo_atencion": np.random.choice(["consulta","emergencia","hospitalizacion","vacuna"],
                                       n_atenciones, p=[0.55,0.20,0.10,0.15]),
    "especialidad":  np.random.choice(["medicina_general","pediatria","ginecologia",
                                        "medicina_interna","cirugia"],
                                       n_atenciones),
    "duracion_min":  np.random.randint(5, 60, n_atenciones),
    "costo_usd":     np.random.uniform(0, 150, n_atenciones).round(2),
    "resultado":     np.random.choice(["alta","hospitalizacion","referencia","fallecimiento"],
                                       n_atenciones, p=[0.82,0.12,0.05,0.01]),
})
atenciones["fecha"] = pd.to_datetime(atenciones["fecha"])
atenciones["mes"] = atenciones["fecha"].dt.month
atenciones["trimestre"] = atenciones["fecha"].dt.quarter

print(f"  {len(df_salud)} establecimientos de salud")
print(f"  {len(atenciones)} atenciones medicas")

# ================================================
# CONSULTAS SQL BIGQUERY
# ================================================
print("\n--- CONSULTAS SQL ANALITICAS (BigQuery style) ---")

# Query 1: Atenciones por tipo y provincia
print("\n  [QUERY 1] Atenciones por tipo y provincia")
q1 = """
SELECT
    e.provincia,
    a.tipo_atencion,
    COUNT(*) as total_atenciones,
    AVG(a.costo_usd) as costo_promedio,
    SUM(a.costo_usd) as costo_total
FROM `ecuador_gov.msp.atenciones` a
JOIN `ecuador_gov.msp.establecimientos` e
    ON a.id_establecimiento = e.id_establecimiento
GROUP BY 1, 2
ORDER BY total_atenciones DESC
LIMIT 20
"""
simular_bigquery(q1, "Atenciones por tipo y provincia")
# Ejecutar localmente
df_q1 = (atenciones.merge(df_salud[["id_establecimiento","provincia"]],
                           on="id_establecimiento")
         .groupby(["provincia","tipo_atencion"])
         .agg(total=("id_atencion","count"),
              costo_prom=("costo_usd","mean"),
              costo_total=("costo_usd","sum"))
         .round(2).sort_values("total", ascending=False).head(15))
print(df_q1.to_string())

# Query 2: Ranking hospitales por volumen (Window Functions)
print("\n  [QUERY 2] Ranking establecimientos con Window Functions")
q2 = """
SELECT
    id_establecimiento,
    tipo_atencion,
    total_mes,
    RANK() OVER (PARTITION BY tipo_atencion ORDER BY total_mes DESC) as ranking,
    SUM(total_mes) OVER (PARTITION BY tipo_atencion) as total_tipo
FROM (
    SELECT id_establecimiento, tipo_atencion,
           COUNT(*) as total_mes
    FROM `ecuador_gov.msp.atenciones`
    WHERE EXTRACT(MONTH FROM fecha) = 3
    GROUP BY 1, 2
)
"""
simular_bigquery(q2, "Ranking con RANK() OVER PARTITION BY")
atenciones_marzo = atenciones[atenciones["mes"]==3]
df_q2 = (atenciones_marzo.groupby(["id_establecimiento","tipo_atencion"])
         .size().reset_index(name="total_mes"))
df_q2["ranking"] = df_q2.groupby("tipo_atencion")["total_mes"].rank(ascending=False).astype(int)
df_q2["total_tipo"] = df_q2.groupby("tipo_atencion")["total_mes"].transform("sum")
print(df_q2.sort_values(["tipo_atencion","ranking"]).head(12).to_string(index=False))

# Query 3: Analisis de tendencia temporal (DATE_TRUNC)
print("\n  [QUERY 3] Tendencia mensual 2024")
q3 = """
SELECT
    DATE_TRUNC(fecha, MONTH) as mes,
    tipo_atencion,
    COUNT(*) as atenciones,
    AVG(duracion_min) as duracion_prom,
    SUM(CASE WHEN resultado = 'hospitalizacion' THEN 1 ELSE 0 END) as hospitalizaciones
FROM `ecuador_gov.msp.atenciones`
GROUP BY 1, 2
ORDER BY mes, tipo_atencion
"""
simular_bigquery(q3, "Tendencia mensual con DATE_TRUNC")
df_q3 = (atenciones.groupby([atenciones["fecha"].dt.to_period("M"), "tipo_atencion"])
         .agg(atenciones_cnt=("id_atencion","count"),
              duracion_prom=("duracion_min","mean"),
              hospitalizaciones=("resultado",lambda x: (x=="hospitalizacion").sum()))
         .round(2))
print(df_q3.head(12).to_string())

# Query 4: Analisis geografico
print("\n  [QUERY 4] Cobertura por provincia (KPIs salud)")
df_q4 = df_salud.groupby("provincia").agg(
    establecimientos=("id_establecimiento","count"),
    camas_total=("camas","sum"),
    medicos_total=("medicos","sum"),
    tipo_hospital=("tipo",lambda x: (x=="Hospital").sum())
).reset_index()

# Poblacion aproximada por provincia
poblacion_prov = {
    "Pichincha": 3236000, "Guayas": 4400000, "Azuay": 813000,
    "Manabi": 1461000, "Tungurahua": 530000, "Chimborazo": 524000,
    "El Oro": 638000, "Imbabura": 476000, "Loja": 510000, "Los Rios": 908000
}
df_q4["poblacion"] = df_q4["provincia"].map(poblacion_prov).fillna(200000)
df_q4["camas_por_1000hab"] = (df_q4["camas_total"] / df_q4["poblacion"] * 1000).round(2)
df_q4["medicos_por_1000hab"] = (df_q4["medicos_total"] / df_q4["poblacion"] * 1000).round(2)
print(df_q4[["provincia","establecimientos","camas_por_1000hab","medicos_por_1000hab"]].to_string(index=False))

print("\n  OMS recomienda: 2.5 medicos/1000 hab | 3.0 camas/1000 hab")
bajo_estandar_medicos = df_q4[df_q4["medicos_por_1000hab"] < 2.5]["provincia"].tolist()
print(f"  Provincias bajo estandar medicos: {bajo_estandar_medicos}")

# ================================================
# MODELO ESTRELLA BIGQUERY
# ================================================
print("\n--- MODELO ESTRELLA PARA BIGQUERY ---")

schema_bq = {
    "FACT_ATENCIONES": [
        "id_atencion INT64 PRIMARY KEY",
        "fecha DATE",
        "id_establecimiento STRING",
        "tipo_atencion STRING",
        "duracion_min INT64",
        "costo_usd FLOAT64",
        "resultado STRING",
    ],
    "DIM_ESTABLECIMIENTO": [
        "id_establecimiento STRING PRIMARY KEY",
        "nombre STRING",
        "tipo STRING",
        "provincia STRING",
        "lat FLOAT64",
        "lon FLOAT64",
        "anio_inauguracion INT64",
    ],
    "DIM_FECHA": [
        "fecha DATE PRIMARY KEY",
        "anio INT64",
        "mes INT64",
        "trimestre INT64",
        "nombre_mes STRING",
        "es_feriado BOOL",
    ],
    "DIM_ESPECIALIDAD": [
        "id_especialidad STRING",
        "nombre STRING",
        "area STRING",
    ],
}

for tabla, campos in schema_bq.items():
    print(f"\n  {tabla}:")
    for campo in campos:
        print(f"    {campo}")

print("\n" + "=" * 65)
print("GCP + BIGQUERY — CONCEPTOS CLAVE:")
print("  BigQuery:   SQL analitico serverless — petabytes en segundos")
print("  DATE_TRUNC: truncar fechas a mes/trimestre para agregaciones")
print("  WINDOW FN:  RANK/ROW_NUMBER OVER PARTITION BY — ranking por grupo")
print("  Modelo estrella: fact + dimensions — schema optimo para BQ")
print("  Particion:  por fecha en BQ reduce costo (solo escanea lo necesario)")
print("  Clustering: ordena datos fisicamente — queries 10x mas rapidas")
print("=" * 65)
```

3. Diseña las queries de BigQuery para calcular el "indice de calidad hospitalaria" por provincia: promedio de (camas_por_1000hab + medicos_por_1000hab + % hospitales nivel 3).

4. Implementa un Scheduled Query simulado que corra cada lunes y actualice la tabla de resumen mensual.

## Usa IA para...

> Abre Claude y escribe:
> "Tengo datos del MSP Ecuador en BigQuery: tabla de atenciones medicas con 50 millones de filas y tabla de establecimientos con 4.000 filas. La query de Looker Studio tarda 45 segundos. ¿Como optimizo? Necesito: 1) particion por fecha (DATE), 2) clustering por provincia y tipo_atencion, 3) materialized views para los KPIs mas consultados, 4) estimacion del ahorro en costo ($/TB). Dame las DDL de BigQuery para cada optimizacion."

Despues de leer la respuesta:
- Implementa las DDL de particion y clustering para la tabla de atenciones.
- Calcula el ahorro estimado en costo con las optimizaciones.

## Que aprendiste

- BigQuery es un Data Warehouse serverless: no hay servidores que gestionar, escala automaticamente.
- `DATE_TRUNC(fecha, MONTH)` agrupa datos por mes — equivalente al `YEAR/MONTH` en particiones de S3.
- Las Window Functions (`RANK OVER PARTITION BY`) calculan rankings dentro de grupos sin subqueries complejos.
- La particion por `DATE` en BigQuery reduce el costo: solo escanea las particiones que satisfacen el WHERE.
- El modelo estrella (fact + dimensions) es el schema optimo para BigQuery — las JOINs son eficientes.
- Looker Studio conecta directo a BigQuery para dashboards interactivos sin mover datos.

## Reto extra

Construye un data warehouse completo del Ministerio de Educacion Ecuador en BigQuery: ingesta los datos del AMIE (Archivo Maestro de Instituciones Educativas) con 25.000 escuelas, crea el modelo estrella (fact_matriculas, dim_escuela, dim_canton, dim_periodo), implementa 10 KPIs educativos (tasa neta matricula, ratio alumno/docente, % desercion), y conecta con Looker Studio para crear un dashboard publico con filtros por provincia y nivel educativo.
