# Ejercicio Sesion 1: Introduccion a Cloud y Servicios AWS

**Materia:** Cloud Computing y Data Lakes
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Comprender la arquitectura de servicios cloud para datos en AWS: S3 (almacenamiento), IAM (permisos), boto3 (SDK Python), carga y descarga de datos, y diseno de un data lake de tres zonas (raw, curated, analytics) para una empresa ecuatoriana.

## Contexto

El 78% de las empresas grandes de Ecuador ya usan alguna nube publica (Amazon, Google o Microsoft). El BCE, el MSP y varias cooperativas ecuatorianas procesan sus datos en AWS. Entender S3 + boto3 es el punto de entrada al ecosistema de datos en la nube — desde donde se construyen pipelines escalables a millones de registros sin preocuparse por servidores.

## Instrucciones

1. Instala: `pip install boto3 moto`.

2. Crea el archivo `sesion01_aws_s3_datalake_ecuador.py`:

```python
# AWS S3 y Data Lake - ITSEIA
# Cloud Computing y Data Lakes
# Data lake 3 zonas para empresa ecuatoriana

import boto3
import json
import io
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings("ignore")

# Usamos moto para simular AWS localmente (sin cuenta real)
try:
    from moto import mock_s3
    USAR_MOCK = True
    print("  Usando moto (AWS simulado localmente)")
except ImportError:
    USAR_MOCK = False
    print("  moto no instalado. Instala con: pip install moto[s3]")

print("=" * 65)
print("AWS S3 + DATA LAKE — EMPRESA ECUATORIANA")
print("=" * 65)

# ================================================
# ARQUITECTURA DATA LAKE 3 ZONAS
# ================================================
print("\n--- ARQUITECTURA DATA LAKE ITSEIA-CORP ---")

arquitectura = {
    "raw-zone":       {
        "descripcion": "Datos tal como llegan de la fuente",
        "formato":     "CSV, JSON, XML, Parquet sin transformar",
        "retencion":   "7 anos (cumplimiento SRI Ecuador)",
        "acceso":      "Solo ingestion pipelines (escritura)",
        "path":        "s3://itseia-corp-datalake/raw/",
    },
    "curated-zone":   {
        "descripcion": "Datos limpios, validados y tipados",
        "formato":     "Parquet particionado por fecha",
        "retencion":   "5 anos",
        "acceso":      "Data engineers, pipelines ETL",
        "path":        "s3://itseia-corp-datalake/curated/",
    },
    "analytics-zone": {
        "descripcion": "Datos agregados listos para analisis",
        "formato":     "Parquet / Delta Lake / tablas Athena",
        "retencion":   "2 anos (rolling)",
        "acceso":      "Analistas, data scientists, BI",
        "path":        "s3://itseia-corp-datalake/analytics/",
    },
}

for zona, info in arquitectura.items():
    print(f"\n  [{zona.upper()}]")
    for k, v in info.items():
        print(f"    {k:<12}: {v}")

# ================================================
# SERVICIOS AWS PARA DATA
# ================================================
print("\n--- SERVICIOS AWS PARA DATA ---")

servicios_aws = {
    "S3":           "Almacenamiento de objetos — backbone del data lake",
    "Glue":         "ETL serverless — transforma datos entre zonas",
    "Athena":       "SQL sobre S3 — query sin mover datos ($5/TB escaneado)",
    "Lambda":       "Funciones event-driven — trigger al llegar archivo",
    "Kinesis":      "Streaming de datos en tiempo real",
    "Redshift":     "Data warehouse columnar — analitica a escala",
    "SageMaker":    "ML platform — entrenar y desplegar modelos",
    "IAM":          "Gestion de identidades y permisos",
    "CloudWatch":   "Monitoreo y alarmas de pipelines",
    "Step Functions": "Orquestacion de pipelines como maquina de estados",
}
for svc, desc in servicios_aws.items():
    print(f"  {svc:<20}: {desc}")

# ================================================
# OPERACIONES S3 CON BOTO3 (simulado con moto)
# ================================================

BUCKET_NAME = "itseia-corp-datalake"
REGION = "us-east-1"

def demo_s3_operations():
    """Demuestra operaciones basicas de S3 con boto3."""

    s3 = boto3.client("s3", region_name=REGION)

    # 1. Crear bucket
    s3.create_bucket(Bucket=BUCKET_NAME)
    print(f"\n  Bucket creado: s3://{BUCKET_NAME}/")

    # 2. Generar datos de prueba (ventas PYME Ecuador)
    np.random.seed(2026)
    n = 500
    df_ventas = pd.DataFrame({
        "fecha":      pd.date_range("2024-01-01", periods=n, freq="H").strftime("%Y-%m-%d %H:%M:%S"),
        "empresa_ruc": [f"{np.random.randint(1700000000, 1799999999):010d}001" for _ in range(n)],
        "producto":    np.random.choice(["arroz","azucar","aceite","harina","leche"], n),
        "cantidad_kg": np.random.uniform(10, 500, n).round(2),
        "precio_unit": np.random.uniform(0.50, 3.50, n).round(4),
        "ciudad":      np.random.choice(["Quito","Guayaquil","Cuenca","Manta"], n),
    })
    df_ventas["total_usd"] = (df_ventas["cantidad_kg"] * df_ventas["precio_unit"]).round(2)

    # 3. Subir a raw zone (CSV)
    csv_buffer = io.StringIO()
    df_ventas.to_csv(csv_buffer, index=False)
    fecha_hoy = datetime.now().strftime("%Y/%m/%d")
    raw_key = f"raw/ventas/{fecha_hoy}/ventas_magap_{datetime.now().strftime('%H%M%S')}.csv"
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=raw_key,
        Body=csv_buffer.getvalue().encode("utf-8"),
        ContentType="text/csv",
        Metadata={"fuente": "MAGAP", "version": "1.0", "registros": str(n)}
    )
    print(f"  Upload raw: s3://{BUCKET_NAME}/{raw_key}")

    # 4. Procesar y subir a curated zone (Parquet)
    df_curated = df_ventas.copy()
    df_curated["fecha"] = pd.to_datetime(df_curated["fecha"])
    df_curated["anio"] = df_curated["fecha"].dt.year
    df_curated["mes"]  = df_curated["fecha"].dt.month
    df_curated["dia"]  = df_curated["fecha"].dt.day

    parquet_buffer = io.BytesIO()
    df_curated.to_parquet(parquet_buffer, index=False, engine="pyarrow")
    curated_key = f"curated/ventas/anio={df_curated['anio'].iloc[0]}/mes={df_curated['mes'].iloc[0]:02d}/ventas.parquet"
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=curated_key,
        Body=parquet_buffer.getvalue(),
        ContentType="application/octet-stream"
    )
    print(f"  Upload curated: s3://{BUCKET_NAME}/{curated_key}")

    # 5. Agregar y subir a analytics zone
    df_analytics = df_curated.groupby(["ciudad","producto"]).agg(
        total_kg=("cantidad_kg","sum"),
        total_usd=("total_usd","sum"),
        num_transacciones=("empresa_ruc","count"),
        precio_prom=("precio_unit","mean")
    ).round(2).reset_index()

    analytics_buffer = io.BytesIO()
    df_analytics.to_parquet(analytics_buffer, index=False)
    analytics_key = f"analytics/ventas_resumen/{fecha_hoy}/resumen_ciudad_producto.parquet"
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=analytics_key,
        Body=analytics_buffer.getvalue()
    )
    print(f"  Upload analytics: s3://{BUCKET_NAME}/{analytics_key}")

    # 6. Listar objetos en el bucket
    print("\n  Contenido del data lake:")
    response = s3.list_objects_v2(Bucket=BUCKET_NAME)
    total_size = 0
    for obj in response.get("Contents", []):
        total_size += obj["Size"]
        print(f"    {obj['Key']:<70} {obj['Size']:>8} bytes")
    print(f"  Total: {len(response.get('Contents',[]))} objetos | {total_size/1024:.1f} KB")

    # 7. Descargar y leer datos
    print("\n  Leyendo desde analytics zone:")
    response = s3.get_object(Bucket=BUCKET_NAME, Key=analytics_key)
    df_leido = pd.read_parquet(io.BytesIO(response["Body"].read()))
    print(f"  Registros leidos: {len(df_leido)}")
    print(df_leido.head(8).to_string(index=False))

    # 8. Metadata del bucket
    print("\n  Resumen data lake:")
    print(f"  Raw zone:      1 archivo CSV ({n} registros)")
    print(f"  Curated zone:  1 archivo Parquet (schema tipado)")
    print(f"  Analytics zone: {len(df_analytics)} agregaciones ciudad-producto")

if USAR_MOCK:
    @mock_s3
    def run_demo():
        demo_s3_operations()
    run_demo()
else:
    print("\n  Demo simulada (sin moto/boto3 real):")
    print("  Para ejecutar: pip install moto[s3] boto3 pyarrow")
    print("  Con cuenta AWS real: configura ~/.aws/credentials")

# ================================================
# POLITICA IAM MINIMA PRIVILEGIO
# ================================================
print("\n--- IAM: POLITICA MINIMO PRIVILEGIO ---")

politica_iam = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "IngestionPipeline",
            "Effect": "Allow",
            "Action": ["s3:PutObject"],
            "Resource": f"arn:aws:s3:::{BUCKET_NAME}/raw/*",
            "Condition": {"StringEquals": {"s3:prefix": "raw/"}}
        },
        {
            "Sid": "DataEngineers",
            "Effect": "Allow",
            "Action": ["s3:GetObject","s3:ListBucket"],
            "Resource": [
                f"arn:aws:s3:::{BUCKET_NAME}/raw/*",
                f"arn:aws:s3:::{BUCKET_NAME}/curated/*"
            ]
        },
        {
            "Sid": "Analysts",
            "Effect": "Allow",
            "Action": ["s3:GetObject"],
            "Resource": f"arn:aws:s3:::{BUCKET_NAME}/analytics/*"
        },
    ]
}
print(json.dumps(politica_iam, indent=2))

# ================================================
# COSTOS ESTIMADOS
# ================================================
print("\n--- COSTOS ESTIMADOS AWS S3 (Ecuador PYME) ---")
costos = [
    ("Almacenamiento 1TB/mes (S3 Standard)", "$23.00"),
    ("Almacenamiento 5TB/mes (S3 Standard)", "$115.00"),
    ("GET requests (1M/mes)",                "$0.40"),
    ("PUT requests (100K/mes)",              "$0.50"),
    ("Athena queries (10TB escaneado/mes)",  "$50.00"),
    ("Lambda 1M invocaciones/mes",           "$0.20"),
    ("TOTAL estimado PYME (1TB + queries)",  "~$75/mes"),
]
for item, costo in costos:
    print(f"  {item:<45}: {costo}")
print("  Comparacion: servidor propio 1TB = $200-400/mes + mantenimiento")

print("\n" + "=" * 65)
print("AWS S3 DATA LAKE — CONCEPTOS CLAVE:")
print("  3 zonas:    raw (origen) → curated (limpio) → analytics (agregado)")
print("  Parquet:    formato columnar comprimido — 10x menos que CSV en S3")
print("  boto3:      SDK Python para todos los servicios AWS")
print("  IAM:        minimo privilegio — cada rol solo accede a lo necesario")
print("  Particion:  year=/month=/day/ → Athena escanea solo particiones necesarias")
print("=" * 65)
```

3. Implementa la particion de datos por `anio/mes/dia` en la curated zone y verifica que el tamano del Parquet es menor que el CSV equivalente.

4. Escribe una funcion `mover_raw_a_curated(bucket, raw_key)` que lea el CSV de la raw zone, lo transforme y lo suba a la curated zone en Parquet.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy data engineer en una empresa ecuatoriana y quiero construir un data lake en AWS S3 con 3 zonas (raw, curated, analytics). Los datos vienen del SRI Ecuador (facturas) en CSV cada noche. ¿Como automatifico el pipeline completo con: 1) Lambda que se dispara cuando llega un archivo a raw/, 2) Glue Job que convierte CSV a Parquet y lo sube a curated/, 3) Glue Crawler que actualiza el catalogo de datos en Glue, 4) Athena para queries SQL sobre curated/? Dame la arquitectura en diagrama ASCII y el codigo del Lambda handler."

Despues de leer la respuesta:
- Diseña el diagrama de arquitectura del pipeline event-driven.
- Implementa el Lambda handler (funcion Python) que procesa el evento S3.

## Que aprendiste

- Un data lake tiene 3 zonas: raw (datos crudos sin modificar), curated (limpios y tipados), analytics (agregados para consumo).
- S3 es almacenamiento de objetos: no es un filesystem, se accede por key (path) y los datos son inmutables.
- Parquet es el formato estandar para data lakes: compresion columnar, 5-10x menor que CSV, schema embebido.
- IAM con minimo privilegio: cada pipeline/usuario tiene permisos solo para lo que necesita.
- La particion por fecha (`year=2024/month=01/day=15/`) permite a Athena escanear solo los datos necesarios.
- boto3 es el SDK oficial de AWS para Python — con el puedes controlar cualquier servicio AWS desde codigo.

## Reto extra

Construye un data lake completo para el INEC Ecuador: diseña el schema de particion para el Censo de Poblacion 2022 (por provincia, canton, parroquia), crea los scripts de ingestion que convierten los CSVs del INEC a Parquet particionado, implementa un Glue Crawler automatico que detecta el schema, y crea una vista Athena que permite hacer queries SQL del tipo `SELECT provincia, SUM(poblacion) FROM censo_2022 WHERE canton='Quito'` en menos de 5 segundos.
