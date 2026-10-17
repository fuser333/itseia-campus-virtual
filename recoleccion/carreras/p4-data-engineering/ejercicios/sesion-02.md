# Ejercicio Sesion 2: ETL vs ELT y dbt

**Materia:** Data Engineering Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Entender la diferencia entre ETL y ELT, implementar transformaciones con dbt (data build tool), crear modelos, tests y documentacion automatica, aplicados a datos del SRI Ecuador cargados en un data warehouse.

## Contexto

El SRI Ecuador procesa millones de declaraciones anuales. Con ETL clasico, los datos se transforman antes de cargar — bottleneck en el servidor ETL. Con ELT moderno (BigQuery + dbt), se cargan los datos crudos primero y se transforman dentro del DW con SQL — aprovechando el poder de computo del cloud. dbt es el estandar de la industria para la capa de transformacion.

## Instrucciones

1. Instala: `pip install dbt-core dbt-duckdb duckdb`.

2. Crea el archivo `sesion02_etl_elt_dbt_ecuador.py`:

```python
# ETL vs ELT + dbt - ITSEIA
# Data Engineering Avanzado
# SRI Ecuador: pipeline moderno con dbt

import pandas as pd
import numpy as np
import duckdb
import json
import os
from datetime import datetime
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("ETL vs ELT + dbt — SRI ECUADOR")
print("=" * 65)

# ================================================
# ETL vs ELT: COMPARACION
# ================================================
print("\n--- ETL vs ELT ---")

comparacion = {
    "ETL (clasico)": {
        "flujo":      "Extract → Transform (servidor) → Load al DW",
        "donde":      "Transformacion en servidor externo (Informatica, Talend)",
        "cuando_usar":"DW on-premise, datos sensibles que no pueden ir al cloud",
        "desventaja": "Bottleneck en servidor ETL, difícil escalar, transformaciones ocultas",
        "ejemplo_ec": "Oracle + Informatica PowerCenter en bancos ecuatorianos legacy",
    },
    "ELT (moderno)": {
        "flujo":      "Extract → Load al DW (raw) → Transform dentro del DW",
        "donde":      "Transformacion en BigQuery / Redshift / Snowflake / DuckDB",
        "cuando_usar":"Cloud DW con poder de computo elastic — la mayoria de casos hoy",
        "ventaja":    "El DW hace el computo, SQL estandar, facil debug, dbt la herramienta",
        "ejemplo_ec": "Glue/Airbyte carga raw a Redshift → dbt transforma → QuickSight",
    },
}

for tipo, info in comparacion.items():
    print(f"\n  [{tipo}]")
    for k, v in info.items():
        print(f"    {k:<15}: {v}")

# ================================================
# DUCKDB: DW LOCAL PARA DEMO
# ================================================
print("\n--- DUCKDB: DW PARA DEMO ---")
print("  DuckDB = SQLite para analitica — perfecto para desarrollo local")

conn = duckdb.connect(":memory:")

# ================================================
# CAPA RAW: CARGAR DATOS SRI Ecuador
# ================================================
print("\n--- CAPA RAW: DATOS SRI ---")

n = 3000

# Tabla raw: contribuyentes
contribuyentes_raw = pd.DataFrame({
    "ruc":             [f"17{np.random.randint(10000000,99999999):08d}001" for _ in range(500)],
    "razon_social":    [f"Empresa_{i}" for i in range(500)],
    "tipo_contribuyente": np.random.choice(["natural","sociedad","regimen_rimpe"],
                                             500, p=[0.55,0.35,0.10]),
    "provincia":       np.random.choice(["Pichincha","Guayas","Azuay","Manabi"], 500),
    "activo":          np.random.binomial(1, 0.90, 500),
    "fecha_registro":  pd.date_range("2010-01-01", periods=500, freq="W").strftime("%Y-%m-%d"),
})

# Tabla raw: declaraciones IVA
declaraciones_raw = pd.DataFrame({
    "id_declaracion": range(1, n+1),
    "ruc":            np.random.choice(contribuyentes_raw["ruc"], n),
    "periodo":        [f"2024-{np.random.randint(1,13):02d}" for _ in range(n)],
    "iva_cobrado":    np.random.lognormal(7, 1.5, n).round(2),
    "iva_pagado":     np.random.lognormal(6.5, 1.5, n).round(2),
    "fecha_declaracion": pd.date_range("2024-01-01", periods=n, freq="H").strftime("%Y-%m-%d"),
    "estado":         np.random.choice(["presentada","tardía","no_presentada","rectificada"],
                                        n, p=[0.75,0.10,0.08,0.07]),
    "dias_mora":      np.random.choice([0,0,0,15,30,60,90], n),
})

conn.execute("CREATE TABLE raw_contribuyentes AS SELECT * FROM contribuyentes_raw")
conn.execute("CREATE TABLE raw_declaraciones AS SELECT * FROM declaraciones_raw")
print(f"  raw_contribuyentes: {conn.execute('SELECT COUNT(*) FROM raw_contribuyentes').fetchone()[0]} registros")
print(f"  raw_declaraciones:  {conn.execute('SELECT COUNT(*) FROM raw_declaraciones').fetchone()[0]} registros")

# ================================================
# MODELOS DBT (SQL puro — simulado aqui)
# ================================================
print("\n--- MODELOS DBT (ELT: transformar dentro del DW) ---")

# stg_contribuyentes: staging model (limpieza basica)
conn.execute("""
CREATE TABLE stg_contribuyentes AS
SELECT
    TRIM(ruc) AS ruc,
    TRIM(UPPER(razon_social)) AS razon_social,
    tipo_contribuyente,
    provincia,
    activo::BOOLEAN AS es_activo,
    TRY_CAST(fecha_registro AS DATE) AS fecha_registro,
    DATE_DIFF('year', TRY_CAST(fecha_registro AS DATE), CURRENT_DATE) AS anios_registrado
FROM raw_contribuyentes
WHERE ruc IS NOT NULL
  AND LENGTH(ruc) = 13
""")

# stg_declaraciones: staging declaraciones
conn.execute("""
CREATE TABLE stg_declaraciones AS
SELECT
    id_declaracion,
    ruc,
    periodo,
    ROUND(iva_cobrado, 2) AS iva_cobrado,
    ROUND(iva_pagado, 2)  AS iva_pagado,
    ROUND(iva_cobrado - iva_pagado, 2) AS iva_neto,
    TRY_CAST(fecha_declaracion AS DATE) AS fecha_declaracion,
    estado,
    dias_mora,
    CASE WHEN dias_mora = 0 THEN 'puntual'
         WHEN dias_mora <= 30 THEN 'leve'
         WHEN dias_mora <= 90 THEN 'moderada'
         ELSE 'grave' END AS nivel_mora
FROM raw_declaraciones
WHERE id_declaracion IS NOT NULL
""")

# fct_declaraciones: modelo fact con joins
conn.execute("""
CREATE TABLE fct_declaraciones AS
SELECT
    d.id_declaracion,
    d.ruc,
    c.razon_social,
    c.tipo_contribuyente,
    c.provincia,
    d.periodo,
    CAST(d.periodo || '-01' AS DATE) AS fecha_periodo,
    EXTRACT(YEAR FROM CAST(d.periodo || '-01' AS DATE)) AS anio,
    EXTRACT(MONTH FROM CAST(d.periodo || '-01' AS DATE)) AS mes,
    d.iva_cobrado,
    d.iva_pagado,
    d.iva_neto,
    d.estado,
    d.dias_mora,
    d.nivel_mora,
    CASE WHEN d.iva_neto > 0 THEN d.iva_neto * 0.12 ELSE 0 END AS impuesto_estimado
FROM stg_declaraciones d
JOIN stg_contribuyentes c ON d.ruc = c.ruc
""")

print("  Modelos creados:")
for tabla in ["stg_contribuyentes","stg_declaraciones","fct_declaraciones"]:
    cnt = conn.execute(f"SELECT COUNT(*) FROM {tabla}").fetchone()[0]
    print(f"  {tabla}: {cnt} registros")

# ================================================
# DBT TESTS (data quality tests)
# ================================================
print("\n--- DBT TESTS (VALIDACION DE CALIDAD) ---")

tests = [
    ("not_null_ruc",         "SELECT COUNT(*) FROM fct_declaraciones WHERE ruc IS NULL"),
    ("unique_declaraciones",  "SELECT COUNT(*) - COUNT(DISTINCT id_declaracion) FROM fct_declaraciones"),
    ("iva_no_negativo",       "SELECT COUNT(*) FROM fct_declaraciones WHERE iva_cobrado < 0"),
    ("periodo_valido",        "SELECT COUNT(*) FROM fct_declaraciones WHERE anio NOT BETWEEN 2020 AND 2025"),
    ("estado_values",         "SELECT COUNT(*) FROM fct_declaraciones WHERE estado NOT IN ('presentada','tardía','no_presentada','rectificada')"),
]

print("  Resultados tests dbt:")
todos_ok = True
for nombre_test, sql in tests:
    resultado = conn.execute(sql).fetchone()[0]
    estado = "PASS" if resultado == 0 else f"FAIL ({resultado} errores)"
    print(f"  {nombre_test:<30}: {estado}")
    if resultado > 0:
        todos_ok = False

print(f"\n  Estado general tests: {'TODOS PASARON' if todos_ok else 'HAY FALLOS'}")

# ================================================
# MARTS: MODELOS FINALES PARA BI
# ================================================
print("\n--- MARTS (CAPA FINAL PARA BI) ---")

# mart_recaudacion_provincial
mart_recaudacion = conn.execute("""
SELECT
    provincia,
    anio,
    mes,
    COUNT(DISTINCT ruc) AS contribuyentes_activos,
    SUM(iva_cobrado) AS total_iva_cobrado,
    SUM(iva_neto) AS total_iva_neto,
    AVG(iva_neto) AS iva_neto_promedio,
    SUM(CASE WHEN nivel_mora = 'grave' THEN 1 ELSE 0 END) AS en_mora_grave,
    ROUND(
        SUM(CASE WHEN estado != 'no_presentada' THEN 1 ELSE 0 END)::FLOAT /
        COUNT(*) * 100, 2
    ) AS tasa_cumplimiento_pct
FROM fct_declaraciones
GROUP BY 1, 2, 3
ORDER BY total_iva_neto DESC
""").df()

print(f"  mart_recaudacion_provincial: {len(mart_recaudacion)} filas")
print(mart_recaudacion.head(8).to_string(index=False))

# ================================================
# ESTRUCTURA DBT PROJECT
# ================================================
print("\n--- ESTRUCTURA PROYECTO DBT ---")

estructura_dbt = """
  sri_ecuador_dbt/
  ├── dbt_project.yml           # Configuracion del proyecto
  ├── profiles.yml              # Conexion al DW (BigQuery/Redshift/DuckDB)
  ├── models/
  │   ├── staging/              # Limpieza basica de tablas raw
  │   │   ├── stg_contribuyentes.sql
  │   │   ├── stg_declaraciones.sql
  │   │   └── schema.yml        # Tests + documentacion
  │   ├── intermediate/         # Modelos de negocio
  │   │   └── int_declaraciones_enriquecidas.sql
  │   └── marts/                # Tablas finales para BI
  │       ├── mart_recaudacion.sql
  │       ├── mart_evasores.sql
  │       └── schema.yml
  ├── tests/                    # Tests personalizados SQL
  │   └── assert_iva_no_negativo.sql
  ├── macros/                   # Funciones SQL reutilizables
  │   └── utils.sql
  └── snapshots/                # SCD Tipo 2 para datos historicos
      └── snap_contribuyentes.sql
"""
print(estructura_dbt)

conn.close()
print("\n" + "=" * 65)
print("ETL/ELT + dbt — CONCEPTOS CLAVE:")
print("  ELT:       cargar raw primero, transformar en el DW — mas eficiente")
print("  dbt:       SQL + jinja + git para transformaciones mantenibles")
print("  Staging:   limpieza basica, cambio de nombres, tipos")
print("  Facts:     joins y calculos de negocio")
print("  Marts:     agregaciones para cada equipo (ventas, finanzas)")
print("  dbt test:  not_null, unique, accepted_values, relationships")
print("  dbt docs:  documentacion automatica del lineage de datos")
print("=" * 65)
```

3. Implementa el snapshot dbt para trackear cambios en el estado de contribuyentes (Slowly Changing Dimension Tipo 2).

4. Agrega una macro dbt `calcular_mora(dias)` que retorna el nivel de mora y usala en los modelos de staging.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Estoy migrando el DW del SRI Ecuador de Oracle a BigQuery con dbt. Tengo 15 tablas raw que ya estan en BigQuery (cargadas con Airbyte). Necesito disenar el dag de dependencias dbt para: stg_* (staging) → int_* (intermediate joins) → fct_* (facts con calculos) → mart_* (agregaciones por dominio). ¿Como organizo las capas? ¿Como evito que un cambio en staging rompa los marts? Dame el schema.yml completo con tests automaticos para las tablas del SRI."

Despues de leer la respuesta:
- Crea el schema.yml con los tests para las tablas del ejercicio.
- Implementa el `ref()` de dbt para conectar modelos entre capas.

## Que aprendiste

- ELT es mas eficiente que ETL en entornos cloud: el DW hace el computo con recursos elasticos.
- dbt es la herramienta estandar para la capa de transformacion: SQL + version control + tests + docs.
- El staging layer limpia los datos crudos: tipos correctos, nombres consistentes, nulos manejados.
- Los marts son el "producto final" del pipeline: agregaciones especificas para cada equipo de negocio.
- `dbt test` valida la calidad automaticamente: `not_null`, `unique`, `accepted_values`, `relationships`.
- La documentacion automatica de dbt genera el lineage completo: de donde viene cada columna.

## Reto extra

Construye un proyecto dbt completo para el IESS Ecuador: staging de tablas de afiliados, empresas, aportes y prestamos; facts de aportes mensuales y saldos de prestamos; marts de cobertura por provincia (% afiliados sobre PEA), KPIs de morosidad patronal, y analisis actuarial simplificado. Implementa SCD Tipo 2 con snapshots para trackear cambios en categorias de afiliacion. Conecta con Looker Studio para el dashboard ejecutivo del IESS.
