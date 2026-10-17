# Ejercicio Sesion 5: Apache Airflow — Intro

**Materia:** Data Warehousing y ETL
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Entender la arquitectura de Apache Airflow, crear tu primer DAG (Directed Acyclic Graph) con tareas dependientes, y orquestar un pipeline ETL de datos ecuatorianos con scheduling automatico.

## Contexto

Apache Airflow es el orquestador de pipelines de datos mas usado en la industria. En lugar de ejecutar scripts ETL manualmente, Airflow los programa, monitorea y reintenta automaticamente. El Banco Central del Ecuador, si usara Airflow, tendria un DAG que cada noche a las 2am extrae datos del SRI, los transforma y los carga al DW — sin intervencion humana.

## Instrucciones

1. Instala Airflow: `pip install apache-airflow` (requiere Python 3.8+).

2. Inicializa: `airflow db init` y luego `airflow standalone` para levantar la UI.

3. Accede a http://localhost:8080 con usuario `admin`.

4. Crea el archivo en la carpeta de DAGs (tipicamente `~/airflow/dags/`):

```python
# DAG Airflow: Pipeline ETL INEC Ecuador
# Archivo: ~/airflow/dags/etl_inec_ecuador.py
# ITSEIA - Data Warehousing - Sesion 5

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta
import pandas as pd
import sqlite3
import logging

# ================================================
# CONFIGURACION DEL DAG
# ================================================
default_args = {
    "owner": "itseia_data_team",
    "depends_on_past": False,
    "email": ["administracion@itseia.ai"],
    "email_on_failure": True,
    "email_on_retry": False,
    "retries": 2,
    "retry_delay": timedelta(minutes=5),
}

dag = DAG(
    dag_id="etl_inec_ecuador_diario",
    description="Pipeline ETL diario: extrae datos INEC, transforma y carga al DW",
    schedule_interval="0 2 * * *",     # Ejecutar cada dia a las 2:00 AM
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=["etl", "inec", "ecuador", "produccion"],
    default_args=default_args,
    doc_md="""
    ## Pipeline ETL INEC Ecuador
    Extrae datos de empleo (ENEMDU), los transforma y los carga al DW.

    **Frecuencia:** Diaria (2:00 AM)
    **Fuente:** INEC Ecuador API y archivos CSV
    **Destino:** PostgreSQL DW (en produccion) / SQLite (en desarrollo)
    **Responsable:** Equipo de Datos ITSEIA
    """
)

# ================================================
# TAREA 1: VERIFICAR DISPONIBILIDAD DE FUENTE
# ================================================
def verificar_fuente(**kwargs):
    """Verifica que la fuente de datos esta disponible antes de proceder."""
    log = logging.getLogger(__name__)
    log.info("Verificando disponibilidad de fuente INEC...")

    # En produccion: verificar API o archivo FTP del INEC
    # Aqui simulamos la verificacion
    import random
    disponible = True  # random.random() > 0.1  # 90% de disponibilidad

    if not disponible:
        raise Exception("Fuente INEC no disponible. Reintentando en 5 minutos.")

    log.info("Fuente disponible. Procediendo con ETL.")
    # Pasar metadata al siguiente task via XCom
    kwargs["ti"].xcom_push(key="fuente_disponible", value=True)
    kwargs["ti"].xcom_push(key="timestamp_verificacion", value=datetime.now().isoformat())
    return "OK"

# ================================================
# TAREA 2: EXTRACT
# ================================================
def extract_datos(**kwargs):
    """Extrae datos de ENEMDU INEC Ecuador."""
    log = logging.getLogger(__name__)
    log.info("Iniciando extraccion de datos ENEMDU...")

    # Simular extraccion (en prod: leer de API INEC o S3)
    import numpy as np
    np.random.seed(int(datetime.now().strftime("%Y%m%d")) % 1000)
    n = 100

    datos = {
        "cedula": [f"17{str(i).zfill(8)}" for i in range(n)],
        "provincia": np.random.choice(["Pichincha","Guayas","Azuay","Manabi"], n),
        "edad": np.random.randint(18, 65, n),
        "ingreso": np.random.normal(750, 300, n).clip(400, 4000).round(2),
        "sector": np.random.choice(["formal","informal"], p=[0.55, 0.45], size=n),
        "horas_semana": np.random.normal(42, 10, n).clip(1, 80).round(0),
        "fecha_encuesta": datetime.now().strftime("%Y-%m-%d")
    }
    df = pd.DataFrame(datos)

    # Guardar en archivo temporal (XCom no puede manejar DataFrames grandes)
    ruta = "/tmp/etl_extract_raw.csv"
    df.to_csv(ruta, index=False)
    log.info(f"Extraidos {len(df)} registros → {ruta}")

    kwargs["ti"].xcom_push(key="ruta_raw", value=ruta)
    kwargs["ti"].xcom_push(key="num_registros_extraidos", value=len(df))
    return len(df)

# ================================================
# TAREA 3: VALIDATE
# ================================================
def validar_datos(**kwargs):
    """Valida calidad de datos antes de transformar."""
    log = logging.getLogger(__name__)
    ruta = kwargs["ti"].xcom_pull(key="ruta_raw", task_ids="extract")
    df = pd.read_csv(ruta)
    log.info(f"Validando {len(df)} registros...")

    errores = []

    # Validacion 1: no debe haber valores nulos
    nulos = df.isnull().sum().sum()
    if nulos > 0:
        errores.append(f"Valores nulos encontrados: {nulos}")

    # Validacion 2: ingresos dentro de rango razonable Ecuador
    fuera_rango = ((df["ingreso"] < 400) | (df["ingreso"] > 10000)).sum()
    if fuera_rango > 0:
        errores.append(f"Ingresos fuera de rango: {fuera_rango}")

    # Validacion 3: edad dentro de PEA (15-65)
    edad_invalida = ((df["edad"] < 15) | (df["edad"] > 65)).sum()
    if edad_invalida > 0:
        errores.append(f"Edades fuera de PEA: {edad_invalida}")

    # Umbral: si mas del 5% tiene errores, falla la tarea
    pct_errores = len(errores) / len(df) * 100 if errores else 0
    log.info(f"Errores encontrados: {len(errores)}")

    if pct_errores > 5:
        raise ValueError(f"Calidad insuficiente: {pct_errores:.1f}% errores. Umbral: 5%")

    kwargs["ti"].xcom_push(key="errores_validacion", value=errores)
    return f"OK - {len(errores)} alertas"

# ================================================
# TAREA 4: TRANSFORM
# ================================================
def transform_datos(**kwargs):
    """Transforma y enriquece los datos."""
    log = logging.getLogger(__name__)
    ruta = kwargs["ti"].xcom_pull(key="ruta_raw", task_ids="extract")
    df = pd.read_csv(ruta)
    log.info(f"Transformando {len(df)} registros...")

    # Transformaciones
    df["log_ingreso"] = df["ingreso"].apply(lambda x: round(__import__("math").log(x), 4))
    df["es_sector_formal"] = (df["sector"] == "formal").astype(int)

    sbu = 460
    df["segmento"] = pd.cut(df["ingreso"],
        bins=[0, sbu, 1000, 2500, 999999],
        labels=["bajo", "basico", "medio", "premium"])

    df["ingreso_hora"] = (df["ingreso"] / (df["horas_semana"] * 4.33)).round(3)
    df["fecha_etl"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    ruta_transformed = "/tmp/etl_transformed.csv"
    df.to_csv(ruta_transformed, index=False)
    log.info(f"Transformacion completada → {ruta_transformed}")

    kwargs["ti"].xcom_push(key="ruta_transformed", value=ruta_transformed)
    return len(df)

# ================================================
# TAREA 5: LOAD
# ================================================
def load_dw(**kwargs):
    """Carga datos transformados al Data Warehouse."""
    log = logging.getLogger(__name__)
    ruta = kwargs["ti"].xcom_pull(key="ruta_transformed", task_ids="transform")
    df = pd.read_csv(ruta)
    log.info(f"Cargando {len(df)} registros al DW...")

    # En produccion: PostgreSQL / BigQuery / Redshift
    # En desarrollo: SQLite
    conn = sqlite3.connect("/tmp/dw_inec_ecuador.db")
    df.to_sql("fact_enemdu_diario", conn,
              if_exists="append",   # incremental: append, no replace
              index=False)

    total = pd.read_sql("SELECT COUNT(*) as n FROM fact_enemdu_diario", conn).iloc[0]["n"]
    log.info(f"Carga completada. Total acumulado en DW: {total}")
    conn.close()

    kwargs["ti"].xcom_push(key="registros_en_dw", value=total)
    return total

# ================================================
# TAREA 6: NOTIFICACION
# ================================================
def notificar_exito(**kwargs):
    """Envia notificacion de exito al equipo."""
    extraidos  = kwargs["ti"].xcom_pull(key="num_registros_extraidos", task_ids="extract")
    en_dw      = kwargs["ti"].xcom_pull(key="registros_en_dw", task_ids="load")
    errores    = kwargs["ti"].xcom_pull(key="errores_validacion", task_ids="validate") or []

    mensaje = f"""
    PIPELINE ETL COMPLETADO
    Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M')}
    Registros extraidos: {extraidos}
    Registros en DW:     {en_dw}
    Alertas validacion:  {len(errores)}
    Estado: EXITO
    """
    print(mensaje)
    # En produccion: enviar por email, Slack o WhatsApp
    return "Notificacion enviada"

# ================================================
# DEFINICION DEL GRAFO DE TAREAS (DAG)
# ================================================

# Crear instancias de tareas
t_verificar = PythonOperator(
    task_id="verificar_fuente",
    python_callable=verificar_fuente,
    dag=dag
)

t_extract = PythonOperator(
    task_id="extract",
    python_callable=extract_datos,
    dag=dag
)

t_validate = PythonOperator(
    task_id="validate",
    python_callable=validar_datos,
    dag=dag
)

t_transform = PythonOperator(
    task_id="transform",
    python_callable=transform_datos,
    dag=dag
)

t_load = PythonOperator(
    task_id="load",
    python_callable=load_dw,
    dag=dag
)

t_notify = PythonOperator(
    task_id="notify",
    python_callable=notificar_exito,
    dag=dag
)

# Limpieza de temporales (BashOperator)
t_cleanup = BashOperator(
    task_id="cleanup_temp",
    bash_command="echo 'Limpiando archivos temporales /tmp/etl_*.csv'",
    dag=dag
)

# ================================================
# DEPENDENCIAS: define el orden de ejecucion
# ================================================
# Flujo: verificar → extract → validate → transform → load → notify → cleanup
t_verificar >> t_extract >> t_validate >> t_transform >> t_load >> t_notify >> t_cleanup
```

5. Sube el archivo a la carpeta de DAGs de Airflow y activa el DAG en la UI.

6. Ejecuta manualmente el DAG con "Trigger DAG" y observa el grafo de ejecucion.

## Usa IA para...

> Abre Claude y escribe:
> "Soy nuevo en Apache Airflow. Explica que es un DAG, que es una tarea, y que son los XComs con un ejemplo simple. ¿Cual es la diferencia entre PythonOperator, BashOperator y el nuevo TaskFlow API? Dame un ejemplo de cada uno."

Despues de leer la respuesta:
- Convierte la funcion `extract_datos` al nuevo estilo TaskFlow API usando el decorador `@task`.
- Compara: cual version es mas legible?

## Que aprendiste

- Airflow es un orquestador de workflows: programa, ejecuta y monitorea pipelines.
- Un DAG (Directed Acyclic Graph) define tareas y sus dependencias en forma de grafo.
- `PythonOperator` ejecuta funciones Python como tareas del DAG.
- `BashOperator` ejecuta comandos de shell — util para scripts legacy.
- XComs permiten pasar datos entre tareas del mismo DAG.
- `>>` define dependencias: `t1 >> t2` significa "t2 se ejecuta despues de t1".
- `schedule_interval` acepta cron expressions: `"0 2 * * *"` = cada dia a las 2am.

## Reto extra

Implementa un DAG con bifurcacion condicional: despues de `validate`, si el porcentaje de errores es mayor al 3% redirige a una tarea `notificar_calidad_baja` (no hace ETL). Si es menor al 3%, continua con el flujo normal. Usa `BranchPythonOperator` para implementar la bifurcacion.
