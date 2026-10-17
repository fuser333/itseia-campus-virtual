# Ejercicio Sesion 6: Spark SQL — Consultas sobre Datos Masivos

**Materia:** Ecosistema Big Data (Hadoop/Spark)
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Usar Spark SQL para ejecutar consultas SQL estandar sobre DataFrames distribuidos, crear vistas temporales y tablas Hive, y demostrar que el mismo SQL que usas en PostgreSQL funciona en Spark sobre cientos de millones de registros con datos del sistema tributario ecuatoriano.

## Contexto

La mayoria de analistas de datos en Ecuador ya saben SQL. Spark SQL permite usar ese conocimiento directamente sobre datasets de Big Data: el mismo `SELECT`, `JOIN`, `GROUP BY` y `HAVING` que usas en una base de datos relacional, pero ahora corriendo en paralelo sobre un cluster de 50 servidores con terabytes de datos. En este ejercicio analizas el sistema tributario del Ecuador como si fueras analista del SRI.

## Instrucciones

1. Abre Google Colab y crea `sesion06_spark_sql.ipynb`:

```python
# ITSEIA - Ecosistema Big Data - Sesion 6
# Spark SQL: consultas sobre datos masivos

from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import *
import pandas as pd
import numpy as np
import random
from datetime import date, timedelta

spark = SparkSession.builder \
    .appName("ITSEIA-SparkSQL-Sesion6") \
    .config("spark.sql.shuffle.partitions", "4") \
    .enableHiveSupport() if False else \
    SparkSession.builder \
    .appName("ITSEIA-SparkSQL-Sesion6") \
    .config("spark.sql.shuffle.partitions", "4") \
    .getOrCreate()

print(f"SparkSQL listo. Version: {spark.version}")
```

2. Genera el dataset del sistema tributario SRI Ecuador:

```python
# ============================================================
# DATASET SRI ECUADOR (simulado)
# ============================================================

random.seed(2024)
n_facturas = 300_000
n_contribuyentes = 5_000

# Tabla: CONTRIBUYENTES
tipos_contribuyente = ['Persona Natural', 'Sociedad', 'RISE', 'RIMPE']
sectores = ['Comercio', 'Manufactura', 'Servicios', 'Agricultura',
            'Construccion', 'Transporte', 'Salud', 'Educacion']
provincias = ['Pichincha','Guayas','Azuay','Manabi','El Oro',
              'Tungurahua','Loja','Imbabura','Esmeraldas','Otras']

contribuyentes_data = pd.DataFrame({
    'ruc': [f"{random.randint(1000000000,9999999999):010d}001" for _ in range(n_contribuyentes)],
    'tipo': random.choices(tipos_contribuyente, weights=[0.55,0.25,0.15,0.05], k=n_contribuyentes),
    'sector': random.choices(sectores, k=n_contribuyentes),
    'provincia': random.choices(provincias,
                                weights=[0.25,0.28,0.08,0.09,0.05,0.06,0.05,0.05,0.04,0.05],
                                k=n_contribuyentes),
    'factura_desde': [date(random.randint(2015,2022), 1, 1) for _ in range(n_contribuyentes)],
    'activo': random.choices([1, 0], weights=[0.85, 0.15], k=n_contribuyentes)
})

# Tabla: FACTURAS (300K registros)
tipos_comprobante = ['Factura', 'Nota_Credito', 'Liquidacion_Compra', 'Retencion']
fechas_base = [date(2024, 1, 1) + timedelta(days=random.randint(0, 364))
               for _ in range(n_facturas)]

rucs_lista = contribuyentes_data['ruc'].tolist()

facturas_data = pd.DataFrame({
    'clave_acceso': [f"2024{random.randint(10000000,99999999):08d}" for _ in range(n_facturas)],
    'ruc_emisor': random.choices(rucs_lista, k=n_facturas),
    'tipo_comprobante': random.choices(tipos_comprobante, weights=[0.75,0.10,0.08,0.07], k=n_facturas),
    'fecha_emision': fechas_base,
    'mes': [f.month for f in fechas_base],
    'trimestre': [(f.month-1)//3+1 for f in fechas_base],
    'subtotal': [round(max(1, np.random.lognormal(5.5, 1.2)), 2) for _ in range(n_facturas)],
    'iva': 0.0,
    'total': 0.0,
    'estado': random.choices(['Autorizada','Anulada','Devuelta'], weights=[0.92,0.06,0.02], k=n_facturas)
})
facturas_data['iva'] = (facturas_data['subtotal'] * 0.15).round(2)
facturas_data['total'] = (facturas_data['subtotal'] + facturas_data['iva']).round(2)

# Crear DataFrames Spark
df_contribuyentes = spark.createDataFrame(contribuyentes_data)
df_facturas = spark.createDataFrame(facturas_data)

# REGISTRAR COMO VISTAS TEMPORALES SQL
df_contribuyentes.createOrReplaceTempView("contribuyentes")
df_facturas.createOrReplaceTempView("facturas")

print("Vistas SQL registradas:")
print(f"  contribuyentes: {df_contribuyentes.count():,} registros")
print(f"  facturas: {df_facturas.count():,} registros")
```

3. Ejecuta consultas SQL de complejidad creciente:

```python
# ============================================================
# CONSULTAS SPARK SQL
# ============================================================

# --- CONSULTA 1: Basica ---
print("\n=== CONSULTA 1: Facturacion total por mes 2024 ===")
spark.sql("""
    SELECT
        mes,
        COUNT(*) AS num_facturas,
        ROUND(SUM(subtotal), 2) AS subtotal_total,
        ROUND(SUM(iva), 2) AS iva_total,
        ROUND(SUM(total), 2) AS total_recaudado
    FROM facturas
    WHERE tipo_comprobante = 'Factura'
      AND estado = 'Autorizada'
    GROUP BY mes
    ORDER BY mes
""").show(12)

# --- CONSULTA 2: JOIN con contribuyentes ---
print("\n=== CONSULTA 2: Top 10 sectores por facturacion ===")
spark.sql("""
    SELECT
        c.sector,
        COUNT(DISTINCT f.ruc_emisor) AS num_contribuyentes,
        COUNT(f.clave_acceso) AS num_facturas,
        ROUND(SUM(f.total), 0) AS facturacion_total,
        ROUND(AVG(f.total), 2) AS ticket_promedio
    FROM facturas f
    INNER JOIN contribuyentes c ON f.ruc_emisor = c.ruc
    WHERE f.tipo_comprobante = 'Factura'
      AND f.estado = 'Autorizada'
      AND c.activo = 1
    GROUP BY c.sector
    ORDER BY facturacion_total DESC
    LIMIT 10
""").show()

# --- CONSULTA 3: Subquery y HAVING ---
print("\n=== CONSULTA 3: Grandes contribuyentes (facturacion > promedio sectorial) ===")
spark.sql("""
    WITH facturacion_por_sector AS (
        SELECT
            c.sector,
            ROUND(AVG(f.total), 2) AS promedio_sector
        FROM facturas f
        JOIN contribuyentes c ON f.ruc_emisor = c.ruc
        WHERE f.estado = 'Autorizada'
        GROUP BY c.sector
    ),
    facturacion_por_ruc AS (
        SELECT
            f.ruc_emisor,
            c.sector,
            c.provincia,
            c.tipo,
            ROUND(SUM(f.total), 2) AS total_facturado,
            COUNT(f.clave_acceso) AS num_facturas
        FROM facturas f
        JOIN contribuyentes c ON f.ruc_emisor = c.ruc
        WHERE f.estado = 'Autorizada'
        GROUP BY f.ruc_emisor, c.sector, c.provincia, c.tipo
    )
    SELECT
        r.ruc_emisor,
        r.sector,
        r.provincia,
        r.tipo,
        r.total_facturado,
        r.num_facturas,
        s.promedio_sector,
        ROUND(r.total_facturado / s.promedio_sector, 1) AS veces_sobre_promedio
    FROM facturacion_por_ruc r
    JOIN facturacion_por_sector s ON r.sector = s.sector
    WHERE r.total_facturado > s.promedio_sector * 10
    ORDER BY veces_sobre_promedio DESC
    LIMIT 15
""").show()

# --- CONSULTA 4: Window functions en SQL ---
print("\n=== CONSULTA 4: Ranking trimestral por provincia ===")
spark.sql("""
    SELECT
        c.provincia,
        f.trimestre,
        ROUND(SUM(f.total), 0) AS total_trimestral,
        RANK() OVER (PARTITION BY f.trimestre ORDER BY SUM(f.total) DESC) AS ranking_trimestre,
        ROUND(SUM(f.total) / SUM(SUM(f.total)) OVER (PARTITION BY f.trimestre) * 100, 1) AS pct_participacion
    FROM facturas f
    JOIN contribuyentes c ON f.ruc_emisor = c.ruc
    WHERE f.estado = 'Autorizada'
    GROUP BY c.provincia, f.trimestre
    ORDER BY f.trimestre, ranking_trimestre
""").show(20)

# --- CONSULTA 5: Deteccion de anomalias (posible evasion) ---
print("\n=== CONSULTA 5: Contribuyentes con patron anomalo (posible evasion) ===")
spark.sql("""
    SELECT
        ruc_emisor,
        COUNT(*) AS total_facturas,
        COUNT(CASE WHEN estado = 'Anulada' THEN 1 END) AS facturas_anuladas,
        ROUND(COUNT(CASE WHEN estado = 'Anulada' THEN 1 END) * 100.0 / COUNT(*), 1) AS pct_anulacion,
        ROUND(SUM(CASE WHEN estado = 'Autorizada' THEN total ELSE 0 END), 2) AS monto_autorizado,
        ROUND(AVG(CASE WHEN estado = 'Autorizada' THEN total ELSE NULL END), 2) AS ticket_promedio
    FROM facturas
    GROUP BY ruc_emisor
    HAVING pct_anulacion > 15
       AND total_facturas > 10
    ORDER BY pct_anulacion DESC
    LIMIT 10
""").show()

spark.stop()
```

4. Escribe en una celda de texto: ¿Que es una Vista Temporal en Spark SQL y en que se diferencia de una tabla real? ¿Que ventaja tiene usar `createOrReplaceTempView` sobre trabajar solo con DataFrames para un equipo de analistas?

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy analista del SRI Ecuador. Tengo una tabla 'facturas' con columnas: ruc_emisor, fecha_emision, total, estado. Necesito una consulta Spark SQL que detecte contribuyentes que emiten facturas el mismo dia del mes durante 3 meses consecutivos exactamente por el mismo monto (patron de evasion fiscal). Dame la consulta SQL con comentarios."

Prueba la consulta en tu notebook adaptandola al dataset del ejercicio.

## Que aprendiste

- `createOrReplaceTempView()` expone un DataFrame como tabla SQL sin persistirlo en disco.
- Spark SQL acepta SQL ANSI estandar: `SELECT`, `JOIN`, `GROUP BY`, `HAVING`, `CTE (WITH)`, `WINDOW`.
- Las CTEs (`WITH nombre AS (...)`) hacen las consultas complejas mas legibles y reutilizables.
- Las funciones de ventana (`RANK() OVER (PARTITION BY ... ORDER BY ...)`) estan disponibles directamente en SQL.
- El mismo SQL funciona en Spark sobre 300K o 300M registros: solo cambia el tiempo de ejecucion.

## Reto extra

Crea una consulta Spark SQL que detecte "empresas fantasma": contribuyentes que tienen mas de 100 facturas autorizadas pero cuya facturacion total es menor al 10% del promedio de su sector. Usa una CTE para calcular el promedio sectorial y luego filtra con HAVING. Exporta el resultado como CSV usando `df.coalesce(1).write.csv('/tmp/empresas_fantasma')`.
