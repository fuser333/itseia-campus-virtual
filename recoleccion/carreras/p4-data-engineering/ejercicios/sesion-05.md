# Ejercicio Sesion 5: Catalogos de Datos y Metadata

**Materia:** Data Engineering Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Construir un catalogo de datos: schema registry, lineage de datos, business glossary, clasificacion de datos segun LOPDP Ecuador, y discovery portal — usando Apache Atlas conceptos implementados con SQLite y Python para el ecosistema de datos del gobierno ecuatoriano.

## Contexto

El gobierno de Ecuador tiene mas de 200 datasets distribuidos en INEC, BCE, SRI, MSP, MAGAP y ministerios. Un analista pierde 2.5 horas buscando el dataset correcto y entendiendo que significa cada columna. Un catalogo de datos resuelve esto: permite buscar, descubrir, entender el linaje y saber quien es el dueno de cada dataset — en menos de 5 minutos.

## Instrucciones

1. Crea el archivo `sesion05_catalogo_datos_ecuador.py`:

```python
# Catalogo de Datos - ITSEIA
# Data Engineering Avanzado
# Glosario + Lineage + Discovery — Gobierno Ecuador

import pandas as pd
import numpy as np
import sqlite3
import json
from datetime import datetime
import warnings
warnings.filterwarnings("ignore")

print("=" * 65)
print("CATALOGO DE DATOS — GOBIERNO ECUADOR")
print("=" * 65)

# ================================================
# SCHEMA DEL CATALOGO
# ================================================
conn = sqlite3.connect(":memory:")

conn.executescript("""
CREATE TABLE datasets (
    id              TEXT PRIMARY KEY,
    nombre          TEXT NOT NULL,
    descripcion     TEXT,
    fuente          TEXT,
    owner_equipo    TEXT,
    owner_email     TEXT,
    dominio         TEXT,
    clasificacion   TEXT,   -- publico/privado/confidencial/sensible
    formato         TEXT,
    actualizacion   TEXT,   -- diaria/semanal/mensual
    filas_estimadas INTEGER,
    columnas_num    INTEGER,
    ruta            TEXT,
    tags            TEXT,   -- JSON array
    fecha_creacion  TEXT,
    fecha_actualizacion TEXT
);

CREATE TABLE columnas (
    dataset_id  TEXT,
    nombre      TEXT,
    tipo_dato   TEXT,
    descripcion TEXT,
    es_pii      INTEGER DEFAULT 0,
    es_pk       INTEGER DEFAULT 0,
    ejemplo     TEXT,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id)
);

CREATE TABLE lineage (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    origen_id   TEXT,
    destino_id  TEXT,
    transformacion TEXT,
    pipeline    TEXT,
    timestamp   TEXT
);

CREATE TABLE glosario (
    termino     TEXT PRIMARY KEY,
    definicion  TEXT,
    sinonimos   TEXT,
    dominio     TEXT,
    ejemplos    TEXT
);
""")

# ================================================
# REGISTRAR DATASETS GOBIERNO ECUADOR
# ================================================
print("\n--- REGISTRANDO DATASETS ---")

datasets = [
    ("INEC_CENSO_2022",     "Censo de Poblacion y Vivienda 2022",
     "Resultados del VII Censo Nacional de Poblacion", "INEC",
     "Estadisticas Sociales INEC", "estadisticas@inec.gob.ec",
     "Demografico", "publico", "CSV/XLSX", "quinquenal", 17773000, 45,
     "s3://inec-datos/censo_2022/",
     '["censo","poblacion","demografia","vivienda"]'),

    ("BCE_INDICADORES",     "Indicadores Macroeconomicos BCE",
     "Series historicas de inflacion, tasas, remesas y PIB", "BCE",
     "Estadisticas BCE", "estadisticas@bce.fin.ec",
     "Macroeconomico", "publico", "JSON/CSV", "mensual", 5000, 12,
     "https://contenido.bce.fin.ec/api/v1/",
     '["bce","inflacion","tasas","economia","remesas"]'),

    ("SRI_RECAUDACION",     "Recaudacion Tributaria Mensual",
     "Datos de recaudacion por tipo de impuesto y sector", "SRI",
     "Estadisticas SRI", "datos@sri.gob.ec",
     "Tributario", "publico", "XLSX", "mensual", 1200, 18,
     "https://www.sri.gob.ec/estadisticas/",
     '["sri","impuestos","iva","renta","recaudacion"]'),

    ("MSP_ESTABLECIMIENTOS", "Registro Establecimientos de Salud",
     "Directorio de establecimientos salud Ecuador con coordenadas", "MSP",
     "RIPS MSP", "registro@msp.gob.ec",
     "Salud", "publico", "CSV", "anual", 4000, 22,
     "s3://msp-datos/establecimientos/",
     '["msp","salud","hospitales","coordinadas"]'),

    ("IESS_AFILIADOS",      "Base Afiliados IESS (anonimizada)",
     "Estadisticas de afiliacion al IESS por sector y provincia", "IESS",
     "Actuaria IESS", "actuaria@iess.gob.ec",
     "Seguridad Social", "privado", "Parquet", "mensual", 8000000, 35,
     "s3://iess-datos/afiliados_anon/",
     '["iess","afiliacion","empleo","seguridad_social"]'),

    ("MAGAP_PRECIOS",        "Precios Mercados Mayoristas Ecuador",
     "Precios semanales de productos agricolas en mercados mayoristas", "MAGAP",
     "MAGAP", "precios@agricultura.gob.ec",
     "Agricola", "publico", "CSV", "semanal", 50000, 8,
     "s3://magap-datos/precios/",
     '["magap","precios","agro","mercado","canasta"]'),
]

for d in datasets:
    conn.execute("""
    INSERT INTO datasets VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, d + (datetime.now().strftime("%Y-%m-%d"),
               datetime.now().strftime("%Y-%m-%d")))

print(f"  {len(datasets)} datasets registrados")

# Registrar columnas para BCE_INDICADORES
columnas_bce = [
    ("BCE_INDICADORES","periodo","STRING","Periodo en formato YYYY-MM",0,1,"2024-03"),
    ("BCE_INDICADORES","inflacion","FLOAT","Tasa inflacion mensual en %",0,0,"0.45"),
    ("BCE_INDICADORES","tasa_activa","FLOAT","Tasa activa referencial anual %",0,0,"9.21"),
    ("BCE_INDICADORES","remesas_musd","FLOAT","Remesas recibidas en millones USD",0,0,"1210"),
]
for c in columnas_bce:
    conn.execute("INSERT INTO columnas VALUES (?,?,?,?,?,?,?)", c)

# Registrar lineage
lineage_entries = [
    ("MSP_ESTABLECIMIENTOS","ANALYTICS_COBERTURA","JOIN con poblacion provincial","pipeline_salud"),
    ("INEC_CENSO_2022","ANALYTICS_COBERTURA","SELECT provincia, SUM(poblacion)","pipeline_salud"),
    ("BCE_INDICADORES","DWH_MACROECONOMICO","ETL indicadores historicos","pipeline_bce"),
    ("SRI_RECAUDACION","DWH_TRIBUTARIO","Merge mensual por sector","pipeline_sri"),
    ("IESS_AFILIADOS","DWH_EMPLEO","Anonimizar + agregar por canton","pipeline_iess"),
]
for l in lineage_entries:
    conn.execute("INSERT INTO lineage (origen_id,destino_id,transformacion,pipeline,timestamp) VALUES (?,?,?,?,?)",
                  l + (datetime.now().isoformat(),))

# Glosario de negocio
terminos = [
    ("PIB","Producto Interno Bruto — valor total de bienes y servicios producidos en Ecuador","GDP,PBI",
     "Macroeconomico","PIB 2024: $118.845 millones USD"),
    ("PEA","Poblacion Economicamente Activa — personas en edad de trabajar que tienen o buscan empleo",
     "Fuerza laboral","Empleo","PEA Ecuador 2024: ~8.5 millones"),
    ("IVA","Impuesto al Valor Agregado — impuesto indirecto de consumo","IGV","Tributario",
     "IVA Ecuador: 15% (2024)"),
    ("RUC","Registro Unico de Contribuyente — identificador tributario de 13 digitos","NIF","Tributario",
     "RUC persona natural: inicia con cedula + 001"),
    ("REMESAS","Envios de dinero de migrantes ecuatorianos en el exterior al pais",
     "Transferencias","Macroeconomico","Remesas Q1 2024: $1.210 millones USD"),
]
for t in terminos:
    conn.execute("INSERT INTO glosario VALUES (?,?,?,?,?)", t)

conn.commit()

# ================================================
# BUSQUEDA EN EL CATALOGO
# ================================================
print("\n--- BUSQUEDA DE DATASETS ---")

def buscar_datasets(query, conn, clasificacion=None):
    sql = """
    SELECT id, nombre, fuente, dominio, clasificacion, actualizacion,
           filas_estimadas, tags
    FROM datasets
    WHERE (LOWER(nombre) LIKE ? OR LOWER(descripcion) LIKE ?
           OR LOWER(tags) LIKE ?)
    """
    params = [f"%{query.lower()}%"] * 3
    if clasificacion:
        sql += " AND clasificacion = ?"
        params.append(clasificacion)
    return pd.read_sql(sql, conn, params=params)

print("  Busqueda: 'precio'")
res = buscar_datasets("precio", conn)
print(res[["id","nombre","fuente","actualizacion"]].to_string(index=False))

print("\n  Busqueda: 'salud' (solo publicos)")
res2 = buscar_datasets("salud", conn, clasificacion="publico")
print(res2[["id","nombre","fuente","clasificacion"]].to_string(index=False))

# ================================================
# LINEAGE VISUAL
# ================================================
print("\n--- LINEAGE DE DATOS ---")

lineage_df = pd.read_sql("SELECT * FROM lineage", conn)
print("  Grafo de linaje:")
for _, row in lineage_df.iterrows():
    print(f"  [{row['origen_id']}] ──({row['transformacion'][:30]})──▶ [{row['destino_id']}]")

# ================================================
# GLOSARIO
# ================================================
print("\n--- GLOSARIO DE NEGOCIO ---")
glosario_df = pd.read_sql("SELECT * FROM glosario", conn)
for _, row in glosario_df.iterrows():
    print(f"  [{row['termino']}]: {row['definicion'][:80]}...")

# ================================================
# REPORTE DE CALIDAD DEL CATALOGO
# ================================================
print("\n--- REPORTE DE COMPLETITUD DEL CATALOGO ---")
total_ds = conn.execute("SELECT COUNT(*) FROM datasets").fetchone()[0]
con_cols  = conn.execute("SELECT COUNT(DISTINCT dataset_id) FROM columnas").fetchone()[0]
con_tags  = conn.execute("SELECT COUNT(*) FROM datasets WHERE tags != '[]'").fetchone()[0]

print(f"  Total datasets:         {total_ds}")
print(f"  Con columnas doc.:      {con_cols}/{total_ds} ({con_cols/total_ds*100:.0f}%)")
print(f"  Con tags:               {con_tags}/{total_ds} ({con_tags/total_ds*100:.0f}%)")
print(f"  Terminos en glosario:   {len(glosario_df)}")
print(f"  Entradas de lineage:    {len(lineage_df)}")

conn.close()
print("\n" + "=" * 65)
print("CATALOGO DE DATOS — CONCEPTOS CLAVE:")
print("  Dataset registry:  inventario centralizado de todos los datasets")
print("  Schema docs:       descripcion de columnas + PII + tipo + ejemplos")
print("  Lineage:           de donde viene cada dato y adonde va")
print("  Glosario:          definiciones de negocio compartidas por todos")
print("  Discovery:         busqueda por nombre, etiqueta, dominio o propietario")
print("  Data Steward:      responsable de mantener la calidad del catalogo")
print("=" * 65)
```

3. Implementa el "Impact Analysis": dado un dataset origen, mostrar todos los datasets downstream que se veran afectados si cambia su schema.

4. Agrega la clasificacion automatica de PII usando los patrones regex del ejercicio de limpieza (cedula, RUC, telefono).

## Usa IA para...

> Abre ChatGPT y escribe:
> "El gobierno de Ecuador quiere construir un portal de datos abiertos similar a data.gov o datos.gob.ec. Tienen 200+ datasets en distintos formatos y sistemas. ¿Como disenan el catalogo de datos con Apache Atlas o DataHub? Necesitan: 1) ingestion automatica de metadatos desde BigQuery, S3 y PostgreSQL, 2) busqueda por tag, propietario y dominio, 3) lineage automatico de pipelines dbt, 4) clasificacion automatica PII con NLP. Dame la arquitectura de referencia y como implementan el 'data stewardship' en un equipo de gobierno."

## Que aprendiste

- Un catalogo de datos resuelve el problema de "no se que datos existen ni que significa cada campo".
- El lineage registra la trayectoria de los datos: de la fuente cruda hasta el dashboard ejecutivo.
- El glosario de negocio garantiza que "PEA" significa lo mismo para INEC, BCE y el equipo de datos.
- La clasificacion LOPDP (publico/privado/confidencial/sensible) determina quien puede acceder a cada dataset.
- El Data Steward es el responsable de mantener la calidad del catalogo — no solo el equipo tecnico.
- Apache Atlas y DataHub son las herramientas open source lideres para catalogos empresariales.

## Reto extra

Construye el portal de datos abiertos del Ecuador con FastAPI + React: ingesta automatica de metadatos via API del INEC, BCE, SRI y MSP, busqueda full-text con Elasticsearch, visualizacion del lineage con D3.js, y descarga directa de datasets en CSV/Parquet/JSON. El portal debe ser accesible publicamente en datos.gov.ec (despliega en AWS con dominio real) y cumplir con los estandares DCAT (Data Catalog Vocabulary) de la W3C.
