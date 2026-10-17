# Ejercicio Sesion 8: Proyecto — Pipeline Datos Publicos Ecuador

**Materia:** Procesamiento de Datos
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 90 min

## Objetivo

Construir un pipeline de datos end-to-end que integra todas las tecnicas de la materia: ingesta desde multiples fuentes (API simulada, web scraping, RSS, CSV), limpieza con regex, transformaciones pandas avanzadas, NLP basico, datos geoespaciales, almacenamiento en SQLite, y generacion de reporte automatico con visualizaciones.

## Contexto

Este es el proyecto integrador de Procesamiento de Datos. Simulamos ser el unico data engineer del Observatorio Economico de Ecuador, un organismo ficticio que consolida indicadores de BCE, INEC, MAGAP y ARCOTEL en un unico repositorio actualizado semanalmente. Tu pipeline reemplaza el trabajo manual de 3 analistas que hoy descargan CSVs, limpian en Excel y hacen copy-paste en PowerPoint.

## Instrucciones

1. Crea el archivo `sesion08_proyecto_pipeline_ecuador.py`:

```python
# PROYECTO: Pipeline Datos Publicos Ecuador
# Pipeline end-to-end: ingesta → limpieza → transformacion → NLP → geodatos → reporte
# ITSEIA - Procesamiento de Datos - Sesion 8

import pandas as pd
import numpy as np
import sqlite3
import json
import re
import math
import time
from datetime import datetime
from collections import Counter
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)

print("=" * 70)
print("PIPELINE DATOS PUBLICOS ECUADOR")
print("Observatorio Economico — Sistema de Consolidacion")
print(f"Ejecucion: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
print("=" * 70)

# ================================================
# CONFIGURACION DEL PIPELINE
# ================================================
CONFIG = {
    "nombre":         "Pipeline Ecuador Observatorio",
    "version":        "1.0.0",
    "periodo":        "2024-Q1",
    "fuentes":        ["BCE-API", "INEC-CSV", "MAGAP-Scraping", "ARCOTEL-RSS"],
    "db_path":        ":memory:",   # SQLite en memoria para demo
    "delay_entre_fuentes": 0.1,    # segundos (en prod seria 2-3s)
}

metricas_pipeline = {
    "inicio": datetime.now(),
    "registros_por_fuente": {},
    "errores": [],
    "advertencias": [],
}

def log(paso, mensaje, nivel="INFO"):
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"  [{ts}] [{nivel}] [{paso}] {mensaje}")

# ================================================
# PASO 1: INGESTA MULTI-FUENTE
# ================================================
print("\n[PASO 1] INGESTA MULTI-FUENTE")
print("-" * 40)

# --- Fuente 1: BCE API (simulada) ---
log("INGESTA", "Consumiendo API BCE Ecuador...")

def ingestar_bce_api():
    indicadores = []
    for mes in range(1, 13):
        periodo = f"2024-{mes:02d}"
        indicadores.extend([
            {"periodo": periodo, "indicador": "inflacion_mensual",
             "valor": round(np.random.uniform(0.25, 0.65), 3), "unidad": "%",
             "fuente": "BCE-API"},
            {"periodo": periodo, "indicador": "tasa_activa",
             "valor": round(np.random.uniform(8.9, 9.5), 3), "unidad": "%",
             "fuente": "BCE-API"},
            {"periodo": periodo, "indicador": "remesas_musd",
             "valor": round(np.random.uniform(920, 1280), 1), "unidad": "MUSD",
             "fuente": "BCE-API"},
        ])
    time.sleep(CONFIG["delay_entre_fuentes"])
    return pd.DataFrame(indicadores)

df_bce = ingestar_bce_api()
metricas_pipeline["registros_por_fuente"]["BCE-API"] = len(df_bce)
log("INGESTA", f"BCE: {len(df_bce)} registros obtenidos")

# --- Fuente 2: INEC CSV (simulado) ---
log("INGESTA", "Leyendo CSV INEC ENEMDU...")

def ingestar_inec_csv():
    provincias = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua",
                  "Los Rios","Chimborazo","El Oro","Imbabura","Loja"]
    registros = []
    for prov in provincias:
        for trim in [1, 2, 3, 4]:
            registros.append({
                "provincia": prov,
                "trimestre": f"2024-Q{trim}",
                "desempleo_pct": round(np.random.uniform(2.5, 6.5), 2),
                "subempleo_pct": round(np.random.uniform(15, 28), 2),
                "empleo_adecuado_pct": round(np.random.uniform(35, 60), 2),
                "poblacion_pea": np.random.randint(150000, 900000),
                "fuente": "INEC-CSV"
            })
    time.sleep(CONFIG["delay_entre_fuentes"])
    return pd.DataFrame(registros)

df_inec = ingestar_inec_csv()
metricas_pipeline["registros_por_fuente"]["INEC-CSV"] = len(df_inec)
log("INGESTA", f"INEC: {len(df_inec)} registros obtenidos")

# --- Fuente 3: MAGAP Scraping (HTML simulado) ---
log("INGESTA", "Scrapeando precios MAGAP...")

def ingestar_magap_scraping():
    productos = ["Arroz","Papa","Tomate","Cebolla","Banano",
                 "Naranja","Maiz","Camaron","Cacao","Cafe"]
    fechas = pd.date_range("2024-01-01","2024-03-31", freq="W")
    registros = []
    precios_base = {"Arroz": 24.5,"Papa": 13.0,"Tomate": 10.0,"Cebolla": 20.0,
                    "Banano": 7.2,"Naranja": 8.5,"Maiz": 15.0,"Camaron": 85.0,
                    "Cacao": 180.0,"Cafe": 95.0}
    for fecha in fechas:
        for prod in productos:
            base = precios_base[prod]
            ruido = np.random.uniform(-0.10, 0.15)
            precio = round(base * (1 + ruido), 2)
            registros.append({
                "fecha": fecha.strftime("%Y-%m-%d"),
                "producto": prod,
                "precio_saco_qq": precio,
                "mercado": "Mercado Mayorista Quito",
                "fuente": "MAGAP-Scraping"
            })
    time.sleep(CONFIG["delay_entre_fuentes"])
    return pd.DataFrame(registros)

df_magap = ingestar_magap_scraping()
metricas_pipeline["registros_por_fuente"]["MAGAP-Scraping"] = len(df_magap)
log("INGESTA", f"MAGAP: {len(df_magap)} registros obtenidos")

# --- Fuente 4: ARCOTEL RSS (noticias cobertura) ---
log("INGESTA", "Parseando RSS ARCOTEL...")

def ingestar_arcotel_rss():
    cantones = ["Quito","Guayaquil","Cuenca","Manta","Ambato",
                "Loja","Riobamba","Ibarra","Esmeraldas","Orellana"]
    registros = []
    for canton in cantones:
        penetracion = round(np.random.uniform(30, 85), 1)
        registros.append({
            "canton": canton,
            "internet_fijo_pct": penetracion,
            "internet_movil_pct": round(penetracion + np.random.uniform(5, 20), 1),
            "tipo_conexion": np.random.choice(["fibra","cable","adsl","satelite"],
                                               p=[0.4, 0.3, 0.2, 0.1]),
            "anio": 2024,
            "fuente": "ARCOTEL-RSS"
        })
    time.sleep(CONFIG["delay_entre_fuentes"])
    return pd.DataFrame(registros)

df_arcotel = ingestar_arcotel_rss()
metricas_pipeline["registros_por_fuente"]["ARCOTEL-RSS"] = len(df_arcotel)
log("INGESTA", f"ARCOTEL: {len(df_arcotel)} registros obtenidos")

total_ingestado = sum(metricas_pipeline["registros_por_fuente"].values())
log("INGESTA", f"TOTAL INGESTADO: {total_ingestado} registros de {len(CONFIG['fuentes'])} fuentes")

# ================================================
# PASO 2: VALIDACION DE CALIDAD
# ================================================
print("\n[PASO 2] VALIDACION DE CALIDAD")
print("-" * 40)

def validar_dataframe(df, nombre, reglas):
    """
    Valida un DataFrame contra un dict de reglas.
    reglas = {"campo": {"tipo": type, "min": num, "max": num, "no_nulos": bool}}
    """
    errores = []
    advertencias = []

    for campo, regla in reglas.items():
        if campo not in df.columns:
            errores.append(f"{nombre}.{campo}: columna faltante")
            continue

        # No nulos
        n_nulos = df[campo].isna().sum()
        if regla.get("no_nulos") and n_nulos > 0:
            errores.append(f"{nombre}.{campo}: {n_nulos} valores nulos")
        elif n_nulos > 0:
            advertencias.append(f"{nombre}.{campo}: {n_nulos} nulos (tolerado)")

        # Rango numerico
        if "min" in regla and pd.api.types.is_numeric_dtype(df[campo]):
            fuera_rango = df[campo].dropna()
            fuera_rango = fuera_rango[(fuera_rango < regla["min"]) | (fuera_rango > regla["max"])]
            if len(fuera_rango) > 0:
                advertencias.append(f"{nombre}.{campo}: {len(fuera_rango)} valores fuera de [{regla['min']},{regla['max']}]")

    score = max(0, 100 - len(errores)*20 - len(advertencias)*5)
    return {"errores": errores, "advertencias": advertencias, "score": score}

validaciones = {
    "BCE":     validar_dataframe(df_bce, "BCE",
                   {"indicador":{"no_nulos":True}, "valor":{"no_nulos":True,"min":-10,"max":9999}}),
    "INEC":    validar_dataframe(df_inec, "INEC",
                   {"desempleo_pct":{"no_nulos":True,"min":0,"max":30},
                    "subempleo_pct":{"no_nulos":True,"min":0,"max":50}}),
    "MAGAP":   validar_dataframe(df_magap, "MAGAP",
                   {"precio_saco_qq":{"no_nulos":True,"min":0.1,"max":500}}),
    "ARCOTEL": validar_dataframe(df_arcotel, "ARCOTEL",
                   {"internet_fijo_pct":{"no_nulos":True,"min":0,"max":100}}),
}

for fuente, val in validaciones.items():
    estado = "OK" if val["score"] >= 80 else "ALERTA"
    log("VALIDACION", f"{fuente}: score={val['score']}% [{estado}] | "
        f"Errores={len(val['errores'])} | Advertencias={len(val['advertencias'])}")
    metricas_pipeline["errores"].extend(val["errores"])
    metricas_pipeline["advertencias"].extend(val["advertencias"])

# ================================================
# PASO 3: TRANSFORMACION
# ================================================
print("\n[PASO 3] TRANSFORMACION")
print("-" * 40)

# BCE: pivot largo → ancho
df_bce["fecha"] = pd.to_datetime(df_bce["periodo"])
pivot_bce = df_bce.pivot_table(
    values="valor", index="periodo", columns="indicador", aggfunc="mean"
).reset_index()
pivot_bce.columns.name = None
pivot_bce["tasa_real_pct"] = (pivot_bce["tasa_activa"] -
                               pivot_bce["inflacion_mensual"] * 12).round(4)
log("TRANSFORM", f"BCE pivot: {pivot_bce.shape}")

# INEC: calcular tasa desempleo promedio anual por provincia
df_inec_anual = df_inec.groupby("provincia").agg(
    desempleo_prom=("desempleo_pct","mean"),
    subempleo_prom=("subempleo_pct","mean"),
    empleo_adecuado_prom=("empleo_adecuado_pct","mean"),
    pea_total=("poblacion_pea","sum")
).round(2).reset_index()
df_inec_anual["vulnerabilidad_laboral"] = (
    df_inec_anual["desempleo_prom"] + df_inec_anual["subempleo_prom"] * 0.5
).round(2)
log("TRANSFORM", f"INEC anualizado: {df_inec_anual.shape}")

# MAGAP: calcular variacion semanal de precios
df_magap["fecha"] = pd.to_datetime(df_magap["fecha"])
df_magap = df_magap.sort_values(["producto","fecha"])
df_magap["precio_anterior"] = df_magap.groupby("producto")["precio_saco_qq"].shift(1)
df_magap["variacion_pct"] = (
    (df_magap["precio_saco_qq"] - df_magap["precio_anterior"]) /
    df_magap["precio_anterior"] * 100
).round(2)

# Resumen MAGAP trimestral
magap_trim = df_magap.groupby("producto").agg(
    precio_promedio=("precio_saco_qq","mean"),
    precio_max=("precio_saco_qq","max"),
    precio_min=("precio_saco_qq","min"),
    volatilidad=("variacion_pct","std")
).round(2).reset_index()
log("TRANSFORM", f"MAGAP trimestral: {magap_trim.shape}")

# ARCOTEL: clasificar brecha digital
df_arcotel["brecha_digital"] = df_arcotel["internet_fijo_pct"].apply(
    lambda x: "Alta" if x < 40 else ("Media" if x < 65 else "Baja")
)
log("TRANSFORM", f"ARCOTEL clasificado: {df_arcotel.shape}")

# ================================================
# PASO 4: NLP EN TITULARES
# ================================================
print("\n[PASO 4] NLP — ANALISIS TITULARES")
print("-" * 40)

titulares_observatorio = [
    "Exportaciones banano Ecuador crecen 12% primer trimestre 2024",
    "Banco Central actualiza proyeccion PIB Ecuador 2.4% para 2024",
    "INEC reporta desempleo 3.9% Ecuador cifra historica positiva",
    "Petroleo Oriente Ecuador baja precio impacta presupuesto gobierno",
    "Remesas Ecuador primer trimestre superan 1.200 millones dolares",
    "Internet rural Ecuador cobertura mejora regiones amazonia sierra",
    "Precios canasta basica Ecuador suben inflacion trimestral 0.45%",
    "Startup tecnologia Quito levanta capital expansion regional",
]

STOPWORDS = {"de","la","el","en","y","a","los","del","las","para","con","una",
             "un","su","es","al","lo","por","que","se","ha","si","o","e"}

SENT_POS = {"crecen","crecimiento","sube","mejora","positiva","supera",
            "levanta","historica","expansion","record","primer"}
SENT_NEG = {"baja","impacta","suben","inflacion","reduccion","bajo","cae","crisis"}

resultados_nlp = []
for titular in titulares_observatorio:
    tokens = [t for t in re.sub(r'[^a-z\s]','', titular.lower()).split()
              if t not in STOPWORDS and len(t) > 2]
    pos = sum(1 for t in tokens if t in SENT_POS)
    neg = sum(1 for t in tokens if t in SENT_NEG)
    sentimiento = "positivo" if pos > neg else ("negativo" if neg > pos else "neutral")
    resultados_nlp.append({
        "titular": titular[:60],
        "tokens_clave": tokens[:5],
        "sentimiento": sentimiento,
        "score": pos - neg
    })

df_nlp = pd.DataFrame(resultados_nlp)
log("NLP", f"Titulares procesados: {len(df_nlp)}")
distrib = df_nlp["sentimiento"].value_counts().to_dict()
log("NLP", f"Distribucion sentimientos: {distrib}")

# ================================================
# PASO 5: ENRIQUECIMIENTO GEOESPACIAL
# ================================================
print("\n[PASO 5] ENRIQUECIMIENTO GEOESPACIAL")
print("-" * 40)

coords_provincias = {
    "Pichincha": (-0.23, -78.52), "Guayas": (-2.19, -79.89),
    "Azuay": (-2.90, -78.99),    "Manabi": (-1.05, -80.45),
    "Tungurahua": (-1.25, -78.62),"Los Rios": (-1.80, -79.49),
    "Chimborazo": (-1.66, -78.65),"El Oro": (-3.26, -79.96),
    "Imbabura": (0.35, -78.12),   "Loja": (-3.99, -79.20),
}

def dist_haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlon/2)**2
    return round(R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a)), 1)

QUITO_COORDS = (-0.23, -78.52)

df_inec_anual["lat"] = df_inec_anual["provincia"].map(
    lambda p: coords_provincias.get(p, (0, 0))[0]
)
df_inec_anual["lon"] = df_inec_anual["provincia"].map(
    lambda p: coords_provincias.get(p, (0, 0))[1]
)
df_inec_anual["dist_quito_km"] = df_inec_anual.apply(
    lambda r: dist_haversine(r["lat"], r["lon"], *QUITO_COORDS), axis=1
)
log("GEO", f"Provincias geocodificadas: {df_inec_anual['lat'].notna().sum()}/{len(df_inec_anual)}")

# Correlacion distancia-vulnerabilidad
corr = df_inec_anual[["dist_quito_km","vulnerabilidad_laboral"]].corr().iloc[0,1]
log("GEO", f"Correlacion distancia-Quito vs vulnerabilidad: {corr:.3f}")

# ================================================
# PASO 6: ALMACENAMIENTO EN SQLITE
# ================================================
print("\n[PASO 6] ALMACENAMIENTO SQLite")
print("-" * 40)

conn = sqlite3.connect(CONFIG["db_path"])

tablas = {
    "indicadores_bce":   pivot_bce,
    "empleo_inec":       df_inec_anual,
    "precios_magap":     magap_trim,
    "cobertura_arcotel": df_arcotel,
    "sentimientos_nlp":  df_nlp[["titular","sentimiento","score"]],
}

for tabla, df in tablas.items():
    df.to_sql(tabla, conn, if_exists="replace", index=False)
    count = pd.read_sql(f"SELECT COUNT(*) as n FROM {tabla}", conn).iloc[0]["n"]
    log("ALMACEN", f"Tabla '{tabla}': {count} registros guardados")

# Verificar con query cross-tabla
provincias_alta_brecha = pd.read_sql("""
    SELECT e.provincia, e.desempleo_prom, e.vulnerabilidad_laboral, e.dist_quito_km
    FROM empleo_inec e
    WHERE e.vulnerabilidad_laboral > 20
    ORDER BY e.vulnerabilidad_laboral DESC
""", conn)
log("ALMACEN", f"Provincias alta vulnerabilidad: {len(provincias_alta_brecha)}")

# ================================================
# PASO 7: REPORTE EJECUTIVO
# ================================================
print("\n[PASO 7] REPORTE EJECUTIVO")
print("=" * 70)
print("OBSERVATORIO ECONOMICO ECUADOR — Q1 2024")
print("=" * 70)

# KPIs principales
inflacion_prom = pivot_bce["inflacion_mensual"].mean()
tasa_act_prom = pivot_bce["tasa_activa"].mean()
remesas_q1 = pivot_bce[pivot_bce["periodo"].str.startswith("2024-0")]["remesas_musd"].sum()
desempleo_nac = df_inec_anual["desempleo_prom"].mean()
precio_banano = magap_trim[magap_trim["producto"]=="Banano"]["precio_promedio"].values[0]
cobertura_prom = df_arcotel["internet_fijo_pct"].mean()

print(f"\n  INDICADORES MACROECONOMICOS:")
print(f"  Inflacion promedio Q1:    {inflacion_prom:.3f}% mensual ({inflacion_prom*12:.2f}% anualizada)")
print(f"  Tasa activa referencial:  {tasa_act_prom:.2f}%")
print(f"  Tasa real:                {(tasa_act_prom - inflacion_prom*12):.2f}%")
print(f"  Remesas Q1 2024:          ${remesas_q1:.0f} millones USD")

print(f"\n  EMPLEO (promedio nacional):")
print(f"  Desempleo:                {desempleo_nac:.1f}%")
worst = provincias_alta_brecha.iloc[0] if len(provincias_alta_brecha) > 0 else None
if worst is not None:
    print(f"  Provincia mas vulnerable: {worst['provincia']} (score: {worst['vulnerabilidad_laboral']:.1f})")

print(f"\n  PRECIOS AGRICOLAS:")
print(f"  Banano (precio prom.):    ${precio_banano:.2f}/quintal")
top_volatil = magap_trim.sort_values("volatilidad", ascending=False).iloc[0]
print(f"  Producto mas volatil:     {top_volatil['producto']} (std: {top_volatil['volatilidad']:.2f}%)")

print(f"\n  CONECTIVIDAD:")
print(f"  Cobertura internet fijo:  {cobertura_prom:.1f}% promedio cantones")
sin_cobertura = df_arcotel[df_arcotel["brecha_digital"]=="Alta"]
print(f"  Cantones brecha alta:     {len(sin_cobertura)} ({', '.join(sin_cobertura['canton'].tolist())})")

print(f"\n  SENTIMIENTO NOTICIAS Q1:")
for sent, count in df_nlp["sentimiento"].value_counts().items():
    print(f"  {sent:<12}: {count} titulares")

# ================================================
# PASO 8: METRICAS FINALES PIPELINE
# ================================================
print("\n" + "=" * 70)
print("METRICAS PIPELINE")
duracion = (datetime.now() - metricas_pipeline["inicio"]).total_seconds()
print(f"  Duracion total:    {duracion:.2f} segundos")
print(f"  Registros totales: {total_ingestado}")
print(f"  Fuentes:           {len(CONFIG['fuentes'])}")
print(f"  Tablas SQLite:     {len(tablas)}")
print(f"  Errores criticos:  {len(metricas_pipeline['errores'])}")
print(f"  Advertencias:      {len(metricas_pipeline['advertencias'])}")
estado = "EXITOSO" if len(metricas_pipeline["errores"]) == 0 else "CON ERRORES"
print(f"  Estado:            {estado}")
print("=" * 70)

# Guardar log de ejecucion
log_ejecucion = {
    "pipeline": CONFIG["nombre"],
    "version": CONFIG["version"],
    "periodo": CONFIG["periodo"],
    "timestamp": datetime.now().isoformat(),
    "duracion_seg": round(duracion, 2),
    "registros_por_fuente": metricas_pipeline["registros_por_fuente"],
    "errores": metricas_pipeline["errores"],
    "advertencias": metricas_pipeline["advertencias"],
    "estado": estado
}
with open("pipeline_log.json", "w", encoding="utf-8") as f:
    json.dump(log_ejecucion, f, ensure_ascii=False, indent=2)

print(f"\n  Log guardado: pipeline_log.json")
print("  Pipeline completado exitosamente.")
```

2. Ejecuta el pipeline completo y analiza las metricas finales.

3. Agrega un paso de "monitoreo de anomalias": detecta si algun precio del MAGAP subio mas del 20% en una semana y genera una alerta en el log.

4. Convierte el pipeline en una clase `ObservatorioEcuadorPipeline` con metodo `ejecutar(periodo)`.

## Usa IA para...

> Abre Gemini y escribe:
> "Tengo un pipeline de datos en Python que consolida indicadores del BCE, INEC, MAGAP y ARCOTEL de Ecuador. ¿Como lo conviero en un pipeline de produccion con Apache Airflow? Necesito: 1) un DAG que ejecute cada lunes a las 6am, 2) que si falla una fuente el pipeline continue con las demas, 3) que al final envie un email de reporte con los KPIs. Dame la estructura del DAG y el codigo de los operadores principales."

Despues de leer la respuesta:
- Diseña en papel (o markdown) la estructura del DAG de Airflow para este pipeline.
- Implementa al menos el esqueleto del DAG con 4 tasks (una por fuente) y 1 task de consolidacion.

## Que aprendiste

- Un pipeline de produccion tiene pasos bien definidos: Ingesta → Validacion → Transformacion → Almacenamiento → Reporte.
- Las metricas del pipeline (duracion, registros, errores) son tan importantes como los datos mismos.
- Un `log.json` al final de cada ejecucion permite auditar el comportamiento historico del pipeline.
- La validacion entre ingesta y transformacion protege la calidad: nunca transformar datos sin validar primero.
- Apache Airflow es el orquestador estandar para pipelines en produccion: permite retries, alertas y dependencias entre tareas.
- Un pipeline bien disenado puede ejecutarse sin intervencion humana y notificar solo cuando algo falla.

## Reto extra

Despliega este pipeline como un microservicio usando FastAPI: endpoint `POST /pipeline/ejecutar` que lanza el pipeline asincronamente, endpoint `GET /pipeline/estado/{run_id}` que devuelve el progreso en tiempo real via Server-Sent Events, y endpoint `GET /pipeline/ultimo-reporte` que devuelve el JSON del ultimo reporte ejecutado. Agrega autenticacion con API key. Despliega en Railway o Render gratis y comparte la documentacion Swagger con el docente.
