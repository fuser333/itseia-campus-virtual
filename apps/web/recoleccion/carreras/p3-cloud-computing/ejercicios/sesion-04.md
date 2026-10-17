# Ejercicio Sesion 4: Almacenamiento en la Nube — S3 y Google Cloud Storage

**Materia:** Cloud Computing para IA
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Usar AWS S3 y Google Cloud Storage como sistemas de almacenamiento de objetos para proyectos de IA: subir datasets del INEC, guardar modelos entrenados, generar URLs publicas y configurar politicas de acceso, todo desde Python con boto3 y google-cloud-storage.

## Contexto

El almacenamiento de objetos en la nube es la columna vertebral de cualquier proyecto de Ciencia de Datos en produccion. ImagemIA (startup ecuatoriana de IA medica) almacena miles de imagenes DICOM en S3 para su modelo de imagenologia. H3L guarda los reportes de auditoria de sus clientes en Cloud Storage. En Ecuador, la SENESCYT podria almacenar los datos del Registro Unico de Titulos en S3 para analisis. La diferencia entre un disco duro local y el almacenamiento cloud es: escalabilidad infinita, acceso desde cualquier lugar y durabilidad del 99.999999999% (11 nueves).

## Instrucciones

1. Abre Google Colab y crea `sesion04_almacenamiento_cloud.ipynb`.

2. Instala las dependencias:

```python
# Cloud Computing para IA - Sesion 4: Almacenamiento Cloud
# ITSEIA - Periodo 3

# Instalar SDKs de cloud storage
!pip install -q boto3 google-cloud-storage

import boto3
import json
import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification
import io

print("SDKs de almacenamiento cloud instalados")
```

3. Parte A: Trabajar con AWS S3 (con boto3):

```python
# ======================================================
# PARTE A: AWS S3 - Almacenamiento de Objetos
# ======================================================

# CONFIGURACION S3
# (En produccion usa: from google.colab import userdata)
# aws_access_key = userdata.get('AWS_ACCESS_KEY_ID')
# aws_secret_key = userdata.get('AWS_SECRET_ACCESS_KEY')

# Para el ejercicio usamos el cliente S3
# s3_client = boto3.client(
#     's3',
#     aws_access_key_id=aws_access_key,
#     aws_secret_access_key=aws_secret_key,
#     region_name='us-east-1'  # usar sa-east-1 (Sao Paulo) para menor latencia en Ecuador
# )

# SIMULACION (para cuando tengas credenciales reales):
print("OPERACIONES S3 - Referencia de Codigo:")

codigo_s3 = """
import boto3
import json

s3 = boto3.client('s3', region_name='sa-east-1')

# 1. CREAR UN BUCKET (una sola vez)
bucket_name = 'itseia-proyectos-2024'
s3.create_bucket(
    Bucket=bucket_name,
    CreateBucketConfiguration={'LocationConstraint': 'sa-east-1'}
)
print(f"Bucket creado: {bucket_name}")

# 2. SUBIR UN ARCHIVO (dataset CSV)
s3.upload_file(
    'datos_inec_2024.csv',          # archivo local
    bucket_name,                     # nombre del bucket
    'datasets/datos_inec_2024.csv'   # path en S3
)

# 3. SUBIR CONTENIDO EN MEMORIA (sin archivo local)
df = pd.DataFrame({'col1': [1,2,3], 'col2': ['a','b','c']})
csv_buffer = df.to_csv(index=False).encode()
s3.put_object(
    Bucket=bucket_name,
    Key='datasets/en_memoria.csv',
    Body=csv_buffer
)

# 4. SUBIR UN MODELO ENTRENADO
import joblib
import io
buffer = io.BytesIO()
joblib.dump(modelo_rf, buffer)
buffer.seek(0)
s3.put_object(
    Bucket=bucket_name,
    Key='modelos/random_forest_v1.pkl',
    Body=buffer.getvalue()
)

# 5. DESCARGAR ARCHIVO DE S3
s3.download_file(bucket_name, 'datasets/datos_inec_2024.csv', '/tmp/datos_descargados.csv')
df_descargado = pd.read_csv('/tmp/datos_descargados.csv')

# 6. LISTAR ARCHIVOS DEL BUCKET
response = s3.list_objects_v2(Bucket=bucket_name, Prefix='datasets/')
for obj in response.get('Contents', []):
    print(f"  {obj['Key']} - {obj['Size']/1024:.1f} KB")

# 7. GENERAR URL PUBLICA TEMPORAL (expira en 1 hora)
url_temporal = s3.generate_presigned_url(
    'get_object',
    Params={'Bucket': bucket_name, 'Key': 'datasets/datos_inec_2024.csv'},
    ExpiresIn=3600  # segundos
)
print(f"URL temporal (1h): {url_temporal[:80]}...")

# 8. ELIMINAR UN ARCHIVO
s3.delete_object(Bucket=bucket_name, Key='datasets/en_memoria.csv')

# 9. HACER UN ARCHIVO PUBLICO (lectura sin autenticacion)
s3.put_object_acl(
    ACL='public-read',
    Bucket=bucket_name,
    Key='datasets/datos_inec_2024.csv'
)
url_publica = f"https://{bucket_name}.s3.sa-east-1.amazonaws.com/datasets/datos_inec_2024.csv"
"""
print(codigo_s3)
```

4. Parte B: Google Cloud Storage (alternativa gratis con Google Colab):

```python
# ======================================================
# PARTE B: GOOGLE CLOUD STORAGE (se integra con Colab)
# ======================================================

# GCS tiene una ventaja sobre S3 para estudiantes:
# Se puede autenticar con la misma cuenta de Google de Colab

print("AUTENTICACION GCS CON GOOGLE COLAB:")
print("""
from google.colab import auth
auth.authenticate_user()
print("Autenticado con Google")
""")

codigo_gcs = """
from google.cloud import storage

# CREAR CLIENTE (autenticado con Google Colab)
client = storage.Client(project='TU-PROJECT-ID')

# 1. CREAR BUCKET
bucket_name = 'itseia-datos-ecuador'
bucket = client.create_bucket(bucket_name, location='SOUTHAMERICA-EAST1')  # Sao Paulo

# 2. SUBIR ARCHIVO
bucket = client.bucket(bucket_name)
blob = bucket.blob('datasets/datos_msp.csv')
blob.upload_from_filename('datos_msp.csv')
print(f"Subido: gs://{bucket_name}/datasets/datos_msp.csv")

# 3. SUBIR DESDE MEMORIA (DataFrame -> GCS)
import io
csv_data = df.to_csv(index=False)
blob = bucket.blob('analisis/resultado_eda.csv')
blob.upload_from_string(csv_data, content_type='text/csv')

# 4. DESCARGAR ARCHIVO
blob = bucket.blob('datasets/datos_msp.csv')
blob.download_to_filename('/tmp/datos_msp_local.csv')

# 5. LEER DIRECTAMENTE A PANDAS (sin descargar)
from io import BytesIO
blob = bucket.blob('datasets/datos_msp.csv')
content = blob.download_as_bytes()
df_nube = pd.read_csv(BytesIO(content))

# 6. LISTAR ARCHIVOS
blobs = client.list_blobs(bucket_name, prefix='datasets/')
for blob in blobs:
    print(f"  {blob.name} - {blob.size/1024:.1f} KB - {blob.updated}")

# 7. URL PUBLICA (hace publico el blob)
blob.make_public()
print(f"URL publica: {blob.public_url}")

# 8. URL TEMPORAL FIRMADA (expira en 15 min)
from datetime import timedelta
url_firmada = blob.generate_signed_url(expiration=timedelta(minutes=15))
"""
print(codigo_gcs)
```

5. Comparacion S3 vs GCS y patrones de diseno:

```python
# COMPARACION S3 vs GCS
print("\n" + "="*60)
print("COMPARACION: AWS S3 vs GOOGLE CLOUD STORAGE")
print("="*60)

comparacion = {
    "Costo almacenamiento": {
        "S3 Standard": "$0.023/GB/mes",
        "GCS Standard": "$0.020/GB/mes",
        "Free Tier": "S3: 5GB/12 meses | GCS: No tiene free tier propio (Colab si)"
    },
    "Durabilidad": {
        "S3 Standard": "99.999999999% (11 nueves)",
        "GCS Standard": "99.999999999% (11 nueves)",
        "Free Tier": "Igual"
    },
    "Latencia desde Ecuador": {
        "S3 Standard": "Region sa-east-1 (Sao Paulo) ~80ms",
        "GCS Standard": "Region southamerica-east1 (Sao Paulo) ~80ms",
        "Free Tier": "Similar latencia desde Ecuador"
    },
    "Integracion con IA": {
        "S3 Standard": "Perfecto con SageMaker, Lambda, Bedrock",
        "GCS Standard": "Perfecto con Vertex AI, BigQuery, Colab",
        "Free Tier": "Depende del ecosistema que uses"
    },
    "SDK Python": {
        "S3 Standard": "boto3 (maduro, documentacion excelente)",
        "GCS Standard": "google-cloud-storage (simple, integra con Colab)",
        "Free Tier": "Ambos excelentes"
    }
}

for categoria, servicios in comparacion.items():
    print(f"\n{categoria}:")
    for servicio, valor in servicios.items():
        print(f"  {servicio:15s}: {valor}")

# PATRON DE DISENO: Pipeline de datos con almacenamiento cloud
print("\n\nPATRON: Pipeline ML con Almacenamiento Cloud")
print("-"*50)
pipeline = [
    ("1. Fuente de datos", "INEC CSV descargado / Scraping / API"),
    ("2. Almacenamiento raw", "S3/GCS: datos crudos sin modificar"),
    ("3. Procesamiento", "Google Colab / EC2: limpieza + EDA"),
    ("4. Almacenamiento clean", "S3/GCS: datos limpios para modelos"),
    ("5. Entrenamiento", "Colab / SageMaker: train + validacion"),
    ("6. Almacenamiento modelo", "S3/GCS: .pkl o .joblib del modelo"),
    ("7. Servicio prediccion", "Lambda / EC2: API que carga el modelo"),
    ("8. Predicciones", "S3/GCS o DB: guardar resultados")
]
for paso, descripcion in pipeline:
    print(f"  {paso}: {descripcion}")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un proyecto de ML con datos del INEC Ecuador. Los datos son 500 MB de CSVs. Quiero almacenarlos en la nube de forma organizada para que todo el equipo pueda acceder. ¿Como estructuro las carpetas en S3? ¿Que convenciones de nombres uso para versionar datasets y modelos? Dame un ejemplo de estructura de carpetas para un proyecto de ciencia de datos."

Despues de leer la respuesta:
- Crea esa estructura de carpetas en tu Google Drive del Colab.
- Documenta la convencion de nombres elegida en un archivo README.md.

## Que aprendiste

- S3 y GCS son servicios de almacenamiento de **objetos** (no bloques ni archivos): organizan datos en buckets y blobs.
- `boto3.client('s3')` y `storage.Client()` son los puntos de entrada de Python para S3 y GCS respectivamente.
- Las **URLs firmadas temporales** permiten compartir archivos privados sin hacerlos publicos permanentemente.
- Un bucket S3 en `sa-east-1` (Sao Paulo) tiene menor latencia desde Ecuador que uno en `us-east-1` (Virginia).
- El patron data lake (raw -> clean -> curated) es estandar en proyectos de Ciencia de Datos: nunca sobreescribas los datos crudos.

## Reto extra

Crea un script Python que automatice la limpieza del dataset MSP del ejercicio anterior y guarde el resultado en S3 o GCS con un nombre que incluya la fecha (ej: `datos_msp_limpio_20240315.csv`). Luego genera una URL firmada de 24 horas y simula como se la envias a un colega por correo para que descargue el dataset sin necesidad de credenciales AWS.
