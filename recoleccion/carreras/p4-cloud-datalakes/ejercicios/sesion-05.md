# Ejercicio Sesion 5: Orchestracion con Airflow

**Materia:** Cloud Computing y Data Lakes
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Disenar y construir DAGs de Apache Airflow para orquestar pipelines de datos: tasks, dependencias, sensores, variables, conexiones, SLAs y alertas, aplicados a la automatizacion de pipelines de datos del INEC, BCE y MAGAP Ecuador.

## Contexto

El Observatorio Economico de Ecuador necesita actualizar sus datos cada lunes a las 6am: descargar datos del BCE, limpiarlos, cargarlos a BigQuery, y enviar el reporte al directorio. Hacerlo manualmente lleva 2 horas semanales. Airflow lo hace automaticamente con manejo de fallos, reintentos y alertas por email — el estandar de la industria para orquestacion de pipelines de datos.

## Instrucciones

1. Instala: `pip install apache-airflow`.

2. Crea el archivo `sesion05_airflow_dags_ecuador.py`:

```python
# Apache Airflow DAGs - ITSEIA
# Cloud Computing y Data Lakes
# Orquestacion de pipelines datos Ecuador

# NOTA: Este archivo es para entender la estructura de Airflow.
# En produccion, los archivos .py se colocan en la carpeta dags/ de Airflow.
# Aqui simulamos la logica y mostramos el codigo de los DAGs.

import json
from datetime import datetime, timedelta

print("=" * 65)
print("APACHE AIRFLOW — ORQUESTACION PIPELINES ECUADOR")
print("=" * 65)

# ================================================
# CONCEPTOS AIRFLOW
# ================================================
print("\n--- CONCEPTOS CLAVE AIRFLOW ---")
conceptos = {
    "DAG":       "Directed Acyclic Graph — el pipeline completo",
    "Task":      "Unidad de trabajo: PythonOperator, BashOperator, etc.",
    "Operator":  "Tipo de tarea: Python, Bash, SQL, HTTP, S3, BigQuery, etc.",
    "Sensor":    "Task que espera condicion: archivo en S3, hora, API response",
    "Schedule":  "Cron expression: '0 6 * * 1' = lunes 6am",
    "XCom":      "Inter-task communication — pasar datos entre tasks",
    "Variable":  "Configuracion global en Airflow UI (ej: URL de la API)",
    "Connection":"Credenciales guardadas de forma segura (DB, S3, API keys)",
    "SLA":       "Service Level Agreement — alerta si la task tarda mas de N horas",
    "Backfill":  "Ejecutar DAG retroactivamente para fechas pasadas",
}
for k, v in conceptos.items():
    print(f"  {k:<12}: {v}")

# ================================================
# DAG 1: PIPELINE DATOS BCE ECUADOR (semanal)
# ================================================
print("\n--- DAG 1: PIPELINE SEMANAL BCE ECUADOR ---")

codigo_dag_bce = '''
# dags/pipeline_bce_ecuador.py

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.email import EmailOperator
from airflow.sensors.filesystem import FileSensor
from airflow.models import Variable
from datetime import datetime, timedelta
import requests, pandas as pd, logging

# Configuracion del DAG
DEFAULT_ARGS = {
    "owner":            "data-team-itseia",
    "depends_on_past":  False,
    "start_date":       datetime(2024, 1, 1),
    "email":            ["data-team@itseia.ai"],
    "email_on_failure": True,
    "email_on_retry":   False,
    "retries":          3,
    "retry_delay":      timedelta(minutes=5),
    "retry_exponential_backoff": True,
    "max_retry_delay":  timedelta(hours=1),
    "sla":              timedelta(hours=2),  # alerta si tarda mas de 2h
}

with DAG(
    dag_id="pipeline_bce_ecuador_semanal",
    default_args=DEFAULT_ARGS,
    description="Pipeline semanal: BCE → limpieza → BigQuery → reporte",
    schedule_interval="0 6 * * 1",   # Lunes 6:00 AM
    catchup=False,
    max_active_runs=1,
    tags=["ecuador","bce","produccion"],
) as dag:

    # Task 1: Extraer datos del BCE API
    def extraer_bce(**context):
        """Descarga indicadores del BCE y los guarda en /tmp."""
        logging.info("Extrayendo datos BCE Ecuador...")
        api_url = Variable.get("BCE_API_URL",
                               default_var="https://contenido.bce.fin.ec/api/v1")
        # En prod: requests.get(api_url + "/indicadores")
        # Simulamos la descarga:
        datos = {
            "inflacion": [{"periodo": "2024-03", "valor": 0.45}],
            "remesas":   [{"periodo": "2024-03", "valor": 1210}],
        }
        output_path = f"/tmp/bce_raw_{context['ds']}.json"
        import json
        with open(output_path, "w") as f:
            json.dump(datos, f)
        logging.info(f"Datos guardados en {output_path}")
        context["ti"].xcom_push(key="raw_path", value=output_path)
        return output_path

    # Task 2: Validar y limpiar datos
    def validar_limpiar(**context):
        """Valida schema y limpia datos BCE."""
        raw_path = context["ti"].xcom_pull(key="raw_path", task_ids="extraer_bce")
        import json
        with open(raw_path) as f:
            datos = json.load(f)
        errores = []
        for indicador, registros in datos.items():
            for r in registros:
                if "valor" not in r or not isinstance(r["valor"], (int, float)):
                    errores.append(f"{indicador}: valor invalido")
        if errores:
            raise ValueError(f"Errores de validacion: {errores}")
        curated_path = raw_path.replace("_raw_", "_curated_")
        with open(curated_path, "w") as f:
            json.dump(datos, f)
        context["ti"].xcom_push(key="curated_path", value=curated_path)
        logging.info(f"Validacion OK: {len(datos)} indicadores")
        return curated_path

    # Task 3: Cargar a BigQuery
    def cargar_bigquery(**context):
        """Carga datos curated a BigQuery."""
        curated_path = context["ti"].xcom_pull(key="curated_path",
                                                task_ids="validar_limpiar")
        # En prod: bigquery.Client().load_table_from_dataframe(df, table_id)
        logging.info(f"Cargando {curated_path} a BigQuery ecuador_gov.bce.indicadores")
        return "OK: 36 registros cargados"

    # Task 4: Generar reporte PDF
    def generar_reporte(**context):
        """Genera reporte ejecutivo."""
        logging.info("Generando reporte PDF semanal BCE...")
        # En prod: reportlab / WeasyPrint
        report_path = f"/tmp/reporte_bce_{context['ds']}.pdf"
        logging.info(f"Reporte guardado: {report_path}")
        context["ti"].xcom_push(key="report_path", value=report_path)
        return report_path

    # Definir tasks
    t1_extraer   = PythonOperator(task_id="extraer_bce",     python_callable=extraer_bce)
    t2_validar   = PythonOperator(task_id="validar_limpiar", python_callable=validar_limpiar)
    t3_bigquery  = PythonOperator(task_id="cargar_bigquery", python_callable=cargar_bigquery)
    t4_reporte   = PythonOperator(task_id="generar_reporte", python_callable=generar_reporte)
    t5_email     = EmailOperator(
        task_id="enviar_reporte",
        to=["directorio@itseia.ai","data-team@itseia.ai"],
        subject="Reporte Semanal BCE Ecuador — {{ ds }}",
        html_content="""
        <h2>Reporte BCE Ecuador</h2>
        <p>El pipeline semanal se ejecuto exitosamente el {{ ds }}.</p>
        <p>Proxima actualizacion: {{ next_ds }}</p>
        """
    )

    # Dependencias (flujo del DAG)
    t1_extraer >> t2_validar >> t3_bigquery >> t4_reporte >> t5_email
'''

print("  DAG pipeline_bce_ecuador_semanal:")
print("  " + " >> ".join(["extraer_bce","validar_limpiar","cargar_bigquery",
                           "generar_reporte","enviar_reporte"]))
print("\n  Codigo del DAG:")
# Mostrar solo la parte de configuracion
lineas_relevantes = [l for l in codigo_dag_bce.split("\n")
                      if any(k in l for k in ["dag_id","schedule","retries","sla","owner","tags"])]
for l in lineas_relevantes:
    print(f"  {l.strip()}")

# ================================================
# DAG 2: MULTI-FUENTE CON BRANCHES
# ================================================
print("\n--- DAG 2: PIPELINE MULTI-FUENTE (INEC+MAGAP+BCE) ---")

codigo_dag_multi = '''
# Patron Branch: si hay datos nuevos → procesar, si no → skip

from airflow.operators.python import BranchPythonOperator
from airflow.operators.empty import EmptyOperator

def verificar_datos_nuevos(**context):
    """Verifica si hay datos nuevos en cada fuente."""
    # Revisar S3/GCS por archivos de la semana
    hay_bce   = True   # En prod: S3 sensor
    hay_inec  = False  # Esta semana INEC no publico
    hay_magap = True

    tasks_a_ejecutar = []
    if hay_bce:   tasks_a_ejecutar.append("procesar_bce")
    if hay_inec:  tasks_a_ejecutar.append("procesar_inec")
    if hay_magap: tasks_a_ejecutar.append("procesar_magap")

    return tasks_a_ejecutar if tasks_a_ejecutar else "skip_all"

# Dependencias con join
branch_task       >> [procesar_bce, procesar_inec, procesar_magap]
procesar_bce      >> consolidar_datos
procesar_inec     >> consolidar_datos
procesar_magap    >> consolidar_datos
consolidar_datos  >> actualizar_dashboard
'''

print("  DAG estructura con BranchOperator:")
print("""
  verificar_datos_nuevos
       ├── procesar_bce ─────┐
       ├── procesar_inec ────┼── consolidar_datos → actualizar_dashboard
       └── procesar_magap ───┘
""")

# ================================================
# VARIABLES Y CONEXIONES AIRFLOW
# ================================================
print("--- VARIABLES Y CONEXIONES EN AIRFLOW ---")

variables_ejemplo = {
    "BCE_API_URL":       "https://contenido.bce.fin.ec/api/v1",
    "GCS_BUCKET":        "gs://ecuador-datos-gov",
    "BIGQUERY_PROJECT":  "ecuador-gov",
    "SLACK_WEBHOOK":     "https://hooks.slack.com/...",
    "SMTP_HOST":         "smtp.gmail.com",
    "EQUIPO_EMAIL":      "data-team@itseia.ai",
    "UMBRAL_ALERTAS":    "0.95",  # score minimo calidad datos
}

print("\n  Variables (Airflow Variables UI o CLI):")
for k, v in variables_ejemplo.items():
    print(f"  {k:<25}: {v}")

conexiones_ejemplo = [
    ("google_cloud_default",  "GoogleCloudHook",   "Project: ecuador-gov"),
    ("aws_default",           "AwsHook",           "IAM Role: arn:aws:iam::..."),
    ("postgres_default",      "PostgresHook",      "Host: db.itseia.ai:5432"),
    ("bce_api",               "HttpHook",          "Base URL: bce.fin.ec"),
    ("smtp_default",          "EmailHook",         "SMTP: smtp.gmail.com:587"),
]

print("\n  Conexiones (guardadas cifradas en Airflow):")
for conn_id, hook, desc in conexiones_ejemplo:
    print(f"  {conn_id:<25}: {hook:<20} ({desc})")

# ================================================
# MONITOREO Y SLA MISS
# ================================================
print("\n--- MONITOREO Y ALERTAS ---")

print("""
  Estrategia de monitoreo pipelines Ecuador:

  1. SLA Miss: si pipeline tarde mas de 2h → email automatico
     sla=timedelta(hours=2) en default_args

  2. Callback en fallo:
     on_failure_callback = lambda ctx: enviar_slack(f"FALLO: {ctx['task_id']}")

  3. Retry exponencial:
     retries=3, retry_delay=5min, retry_exponential_backoff=True
     → reintentos a los 5min, 10min, 20min

  4. Dead Letter Queue:
     registros_invalidos → s3://dead-letter/fecha/ para analisis posterior

  5. Data Quality Gate (tarea de validacion):
     if score_calidad < 0.95: raise AirflowSkipException("Datos insuficientes")

  6. Alertas Slack/Teams:
     from airflow.providers.slack.operators.slack_webhook import SlackWebhookOperator
""")

# ================================================
# COMANDOS AIRFLOW CLI
# ================================================
print("--- COMANDOS AIRFLOW UTILES ---")
comandos = [
    ("airflow dags list",                        "Listar todos los DAGs"),
    ("airflow dags trigger pipeline_bce_ecuador", "Disparar DAG manualmente"),
    ("airflow tasks test pipeline_bce_ecuador extraer_bce 2024-03-25",
     "Probar una task especifica"),
    ("airflow dags backfill -s 2024-01-01 -e 2024-03-01 pipeline_bce_ecuador",
     "Backfill historico"),
    ("airflow variables set BCE_API_URL https://...",
     "Configurar variable desde CLI"),
    ("airflow dags pause pipeline_bce_ecuador",  "Pausar un DAG"),
]
for cmd, desc in comandos:
    print(f"  $ {cmd}")
    print(f"    → {desc}")

print("\n" + "=" * 65)
print("AIRFLOW — CONCEPTOS CLAVE:")
print("  DAG:       el pipeline completo como grafo de dependencias")
print("  Operator:  cada tipo de tarea (Python, SQL, Email, GCS...)")
print("  XCom:      pasar datos entre tasks via metadata store")
print("  Branch:    decision en runtime — ejecutar sub-ramas distintas")
print("  SLA:       alerta automatica si el pipeline se retrasa")
print("  Backfill:  ejecutar el DAG retroactivamente para fechas pasadas")
print("=" * 65)
```

3. Implementa un sensor `FileSensor` que espera a que el archivo del BCE aparezca en S3 antes de continuar con el pipeline.

4. Agrega una tarea de validacion de calidad de datos entre `extraer_bce` y `validar_limpiar` que rechace el lote si tiene mas del 5% de nulos.

## Usa IA para...

> Abre Claude y escribe:
> "Tengo un DAG de Airflow que procesa datos del BCE Ecuador. Necesito implementar un patron 'Circuit Breaker': si el BCE API falla 3 veces consecutivas en 24 horas, el DAG debe dejar de reintentar y notificar al equipo de datos que la API esta caida. ¿Como implemento esto con Airflow Variables para contar fallos consecutivos y un callback que active el circuit breaker? Dame el codigo completo del DAG con este patron."

Despues de leer la respuesta:
- Implementa el contador de fallos con Airflow Variables.
- Agrega el callback `on_failure_callback` que incrementa el contador.

## Que aprendiste

- Un DAG en Airflow define el flujo de un pipeline como un grafo de dependencias `t1 >> t2 >> t3`.
- `retry_exponential_backoff=True` reintenta con delay creciente — evita saturar APIs externas.
- XCom permite pasar datos entre tasks usando `xcom_push` y `xcom_pull` — ideal para paths de archivos.
- `BranchPythonOperator` permite tomar decisiones en runtime: ejecutar distintas ramas segun condicion.
- Las Variables y Conexiones en Airflow guardan configuracion sensible de forma segura y centralizada.
- El SLA miss notifica al equipo si un pipeline critico se retrasa — esencial en ambientes productivos.

## Reto extra

Construye un sistema de orquestacion completo para el Observatorio Nacional Ecuador: 5 DAGs separados (BCE, INEC, MAGAP, SRI, MSP), cada uno con su propio schedule, todos convergen en un DAG maestro "consolidador" que espera a que los 5 terminen exitosamente antes de actualizar el dashboard ejecutivo. Implementa alertas en Slack, circuit breakers por fuente, y un endpoint de monitoreo `/pipeline/status` que muestra el estado de todos los DAGs en tiempo real.
