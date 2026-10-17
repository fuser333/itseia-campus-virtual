# Ejercicio Sesion 1: Pipeline de Datos — Concepto

**Materia:** Procesamiento de Datos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 25 min

## Objetivo

Entender el concepto de pipeline de datos, sus componentes (ingesta, procesamiento, almacenamiento, servicio), y construir el primer pipeline funcional que procesa datos publicos ecuatorianos de forma automatizada.

## Contexto

Un pipeline de datos es una secuencia automatizada de pasos que mueve y transforma datos desde su origen hasta su destino. En Ecuador, el BCE (Banco Central) publica estadisticas economicas mensuales. Un pipeline puede extraer esos datos automaticamente, limpiarlos y cargarlos en un dashboard — sin que ningun analista lo haga manualmente cada mes.

## Instrucciones

1. Crea el archivo `sesion01_pipeline_concepto_ecuador.py`:

```python
# Pipeline de Datos - Concepto
# ITSEIA - Procesamiento de Datos
# Primer pipeline funcional: BCE Ecuador

import pandas as pd
import numpy as np
from datetime import datetime
import json

print("=" * 65)
print("PIPELINE DE DATOS — BCE ECUADOR")
print("Concepto y primer pipeline funcional")
print("=" * 65)

# ================================================
# ARQUITECTURA DE UN PIPELINE
# ================================================
print("\n--- COMPONENTES DE UN PIPELINE ---")
componentes = {
    "1. INGESTA":       "Extraer datos de fuentes (API, CSV, DB, web scraping)",
    "2. VALIDACION":    "Verificar calidad, tipos, rangos permitidos",
    "3. TRANSFORMACION":"Limpiar, enriquecer, calcular nuevas variables",
    "4. ALMACENAMIENTO":"Guardar en BD, DW, data lake, archivo",
    "5. SERVICIO":      "Exponer a dashboards, APIs, ML models, reportes",
}
for comp, desc in componentes.items():
    print(f"  {comp:<22}: {desc}")

# ================================================
# TIPOS DE PIPELINE
# ================================================
print("\n--- TIPOS DE PIPELINE ---")
tipos = {
    "Batch":     ("Procesa datos en lotes periodicos","Airflow, cron jobs",   "Reportes nocturnos"),
    "Streaming": ("Procesa eventos en tiempo real",   "Kafka, Spark Streaming","Fraude bancario"),
    "Micro-batch":("Lotes cada pocos minutos",        "Spark, Flink",          "Alertas cuasi-real"),
    "Lambda":    ("Batch + Streaming combinados",     "Arquitectura Lambda",   "Dashboards hibridos"),
}
for tipo, (desc, tech, caso) in tipos.items():
    print(f"  {tipo:<12}: {desc}")
    print(f"            Tech: {tech} | Caso Ecuador: {caso}")

# ================================================
# PIPELINE BATCH: indicadores BCE Ecuador
# ================================================
print("\n--- PIPELINE BATCH: INDICADORES BCE ECUADOR ---")

# --------------------------------
# PASO 1: INGESTA
# --------------------------------
print("\n  [PASO 1] INGESTA — Simular extraccion BCE...")

def ingestar_bce():
    """Simula extraccion de datos del BCE Ecuador."""
    # En produccion: requests.get("https://contenido.bce.fin.ec/...")
    # Aqui simulamos datos reales del BCE
    datos_bce = {
        "indicadores": [
            {"periodo":"2024-01","nombre":"Inflacion mensual","valor":0.42,"unidad":"%"},
            {"periodo":"2024-02","nombre":"Inflacion mensual","valor":0.38,"unidad":"%"},
            {"periodo":"2024-03","nombre":"Inflacion mensual","valor":0.45,"unidad":"%"},
            {"periodo":"2024-04","nombre":"Inflacion mensual","valor":0.51,"unidad":"%"},
            {"periodo":"2024-05","nombre":"Inflacion mensual","valor":0.35,"unidad":"%"},
            {"periodo":"2024-06","nombre":"Inflacion mensual","valor":0.29,"unidad":"%"},
            {"periodo":"2024-01","nombre":"Tasa activa referencial","valor":9.24,"unidad":"%"},
            {"periodo":"2024-02","nombre":"Tasa activa referencial","valor":9.18,"unidad":"%"},
            {"periodo":"2024-03","nombre":"Tasa activa referencial","valor":9.21,"unidad":"%"},
            {"periodo":"2024-04","nombre":"Tasa activa referencial","valor":9.15,"unidad":"%"},
            {"periodo":"2024-05","nombre":"Tasa activa referencial","valor":9.10,"unidad":"%"},
            {"periodo":"2024-06","nombre":"Tasa activa referencial","valor":9.08,"unidad":"%"},
            {"periodo":"2024-01","nombre":"Remesas recibidas M USD","valor":982,"unidad":"millones USD"},
            {"periodo":"2024-02","nombre":"Remesas recibidas M USD","valor":1045,"unidad":"millones USD"},
            {"periodo":"2024-03","nombre":"Remesas recibidas M USD","valor":1120,"unidad":"millones USD"},
            {"periodo":"2024-04","nombre":"Remesas recibidas M USD","valor":1080,"unidad":"millones USD"},
            {"periodo":"2024-05","nombre":"Remesas recibidas M USD","valor":1150,"unidad":"millones USD"},
            {"periodo":"2024-06","nombre":"Remesas recibidas M USD","valor":1210,"unidad":"millones USD"},
        ],
        "metadata": {"fuente":"BCE Ecuador","actualizado":"2024-07-01","version":"1.0"}
    }
    print(f"    Datos recibidos: {len(datos_bce['indicadores'])} registros")
    return datos_bce

raw = ingestar_bce()

# --------------------------------
# PASO 2: VALIDACION
# --------------------------------
print("\n  [PASO 2] VALIDACION...")

def validar_datos(datos_json):
    """Valida estructura y calidad de datos BCE."""
    indicadores = datos_json["indicadores"]
    errores = []

    for i, reg in enumerate(indicadores):
        # Campos requeridos
        for campo in ["periodo","nombre","valor","unidad"]:
            if campo not in reg:
                errores.append(f"Fila {i}: falta campo '{campo}'")

        # Formato periodo YYYY-MM
        if not str(reg.get("periodo","")).startswith("2024-"):
            errores.append(f"Fila {i}: periodo invalido '{reg.get('periodo')}'")

        # Valor numerico
        if not isinstance(reg.get("valor"), (int, float)):
            errores.append(f"Fila {i}: valor no numerico")

    score = (len(indicadores) - len(errores)) / len(indicadores) * 100
    print(f"    Registros: {len(indicadores)} | Errores: {len(errores)} | Score: {score:.0f}%")
    if errores:
        for e in errores[:3]:
            print(f"    ALERTA: {e}")
    return len(errores) == 0, indicadores

valido, datos_validos = validar_datos(raw)

# --------------------------------
# PASO 3: TRANSFORMACION
# --------------------------------
print("\n  [PASO 3] TRANSFORMACION...")

def transformar(datos):
    """Transforma datos BCE a formato estructurado."""
    df = pd.DataFrame(datos)
    df["fecha"]     = pd.to_datetime(df["periodo"])
    df["anio"]      = df["fecha"].dt.year
    df["mes"]       = df["fecha"].dt.month
    df["mes_nombre"]= df["fecha"].dt.strftime("%B")

    # Pivot: indicadores como columnas
    pivot = df.pivot_table(values="valor", index="periodo",
                           columns="nombre", aggfunc="first")
    pivot.columns = [c.replace(" ","_").lower() for c in pivot.columns]
    pivot = pivot.reset_index()

    # Calcular tasa real (tasa activa - inflacion)
    if "tasa_activa_referencial" in pivot.columns and "inflacion_mensual" in pivot.columns:
        pivot["tasa_real"] = (pivot["tasa_activa_referencial"] -
                               pivot["inflacion_mensual"] * 12).round(4)

    print(f"    DataFrame transformado: {pivot.shape}")
    print(f"    Columnas: {pivot.columns.tolist()}")
    return pivot

df_trans = transformar(datos_validos)

# --------------------------------
# PASO 4: ALMACENAMIENTO
# --------------------------------
print("\n  [PASO 4] ALMACENAMIENTO...")
import sqlite3

def almacenar(df):
    """Carga datos al store (SQLite local)."""
    conn = sqlite3.connect(":memory:")
    df.to_sql("indicadores_bce", conn, if_exists="replace", index=False)
    count = pd.read_sql("SELECT COUNT(*) as n FROM indicadores_bce", conn).iloc[0]["n"]
    print(f"    Registros almacenados: {count}")
    return conn

conn_store = almacenar(df_trans)

# --------------------------------
# PASO 5: SERVICIO (consultas)
# --------------------------------
print("\n  [PASO 5] SERVICIO — Consultas disponibles...")

resultado = pd.read_sql("SELECT * FROM indicadores_bce ORDER BY periodo", conn_store)
print(f"\n    Datos listos para servir:")
print(resultado.to_string(index=False))

# ================================================
# METRICAS DEL PIPELINE
# ================================================
print("\n" + "=" * 65)
print("METRICAS DEL PIPELINE")
print(f"  Registros ingestados:     {len(raw['indicadores'])}")
print(f"  Registros validos:        {len(datos_validos)}")
print(f"  Score calidad:            100%")
print(f"  Columnas generadas:       {len(df_trans.columns)}")
print(f"  Estado:                   COMPLETADO")
print("=" * 65)
```

2. Ejecuta el pipeline de 5 pasos y analiza la salida de cada paso.

3. Agrega un sexto paso: "MONITOREO" que registre en un log el timestamp, numero de registros y estado de cada ejecucion.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Explica la diferencia entre un pipeline batch y uno streaming con un ejemplo de empresa financiera ecuatoriana. ¿Cuando elegiria cada uno? ¿Que pasa si necesito ambos (arquitectura Lambda)?"

Despues de leer la respuesta:
- Agrega un diagrama en texto (ASCII) al codigo que ilustre la diferencia.
- Identifica cual tipo de pipeline conviene para los indicadores del BCE.

## Que aprendiste

- Un pipeline de datos tiene 5 etapas: Ingesta, Validacion, Transformacion, Almacenamiento, Servicio.
- Un pipeline batch procesa datos periodicamente en lotes; streaming procesa eventos en tiempo real.
- La validacion entre ingesta y transformacion protege la calidad del dato en el destino.
- `df.pivot_table()` transforma datos de formato largo a formato ancho (ideal para DW).
- Cada paso del pipeline debe reportar metricas: registros procesados, errores, tiempo.
- Un pipeline bien disenado puede ejecutarse sin intervencion humana de forma indefinida.

## Reto extra

Convierte el pipeline a una clase `Pipeline` con metodos `ingestar()`, `validar()`, `transformar()`, `almacenar()` y `ejecutar()`. Agrega un decorador `@timeit` que mida el tiempo de ejecucion de cada metodo. Ejecuta el pipeline 3 veces consecutivas y muestra el tiempo promedio de cada etapa.
