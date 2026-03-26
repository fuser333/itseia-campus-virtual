# Ejercicio Sesion 8: Proyecto Data Platform Enterprise

**Materia:** Data Engineering Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 90 min

## Objetivo

Construir una data platform enterprise completa para el Banco del Estado de Ecuador: arquitectura Medallion (raw → curated → analytics), pipeline orquestado con dependencias, catalogo de datos, API de exposicion, calidad automatica con checkpoints, y dashboard de observabilidad — integrando todos los conceptos del curso en un sistema productivo.

## Contexto

El Banco del Estado de Ecuador otorga creditos de infraestructura a municipios, empresas publicas y entidades gubernamentales. Su data platform actual es un conjunto de scripts Excel y consultas ad hoc — sin linaje, sin calidad, sin version control. El equipo de data engineering necesita una plataforma que procese diariamente: cartera de creditos (50K registros), recuperacion de cartera (200K transacciones), calificacion de deudores (12K entidades), e indicadores macroeconomicos del BCE. Esta es la arquitectura target.

## Instrucciones

1. Crea el archivo `sesion08_data_platform_banco_estado.py`:

```python
# Proyecto Data Platform Enterprise - ITSEIA
# Data Engineering Avanzado
# Banco del Estado Ecuador — Arquitectura Medallion completa

import pandas as pd
import numpy as np
import sqlite3
import json
import time
import hashlib
import gzip
import io
from datetime import datetime, timedelta
from collections import defaultdict
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
TIMESTAMP = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

print("=" * 70)
print("DATA PLATFORM ENTERPRISE — BANCO DEL ESTADO ECUADOR")
print(f"Ejecucion: {TIMESTAMP}")
print("=" * 70)

# ================================================
# SECCION 0: ARQUITECTURA DE LA PLATAFORMA
# ================================================
print("\n--- ARQUITECTURA MEDALLION: BANCO DEL ESTADO ---")

arquitectura = {
    "Bronze (Raw)": {
        "descripcion": "Datos crudos sin modificar — inmutables, append-only",
        "fuentes":     ["core_bancario_creditos.csv","bce_indicadores_api.json",
                        "calificacion_deudores.xlsx","transacciones_recuperacion.parquet"],
        "storage":     "S3 raw/ — Parquet snappy particionado por fecha_carga",
        "retencion":   "7 anos (cumplimiento COSEDE/SBS Ecuador)",
    },
    "Silver (Curated)": {
        "descripcion": "Datos limpios, tipados, sin duplicados — calidad validada",
        "tablas":      ["stg_creditos","stg_transacciones","stg_deudores","stg_indicadores"],
        "storage":     "S3 curated/ — Delta Lake, ACID, time travel 90 dias",
        "calidad":     "Great Expectations checkpoint — bloquea si score < 80%",
    },
    "Gold (Analytics)": {
        "descripcion": "Marts agregados listos para BI y APIs",
        "marts":       ["mart_cartera_riesgo","mart_recuperacion","mart_kpis_ejecutivo",
                        "mart_alertas_mora"],
        "storage":     "Redshift Serverless — optimizado para queries analiticos",
        "sla":         "Disponible antes de 07:00 AM para reportes ejecutivos",
    },
}

for zona, config in arquitectura.items():
    print(f"\n  [{zona}]")
    for k, v in config.items():
        val = v if isinstance(v, str) else ", ".join(v[:3]) + ("..." if len(v) > 3 else "")
        print(f"    {k:<12}: {val}")

# ================================================
# SECCION 1: INGESTA BRONZE
# ================================================
print("\n\n--- ETAPA 1: INGESTA BRONZE (RAW) ---")

N_CREDITOS     = 5_000
N_TRANSACC     = 15_000
N_DEUDORES     = 1_200
N_INDICADORES  = 60

tipos_entidad = ["Municipio","Empresa Publica","Gobierno Provincial",
                 "Junta Parroquial","Empresa Mixta"]
provincias    = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua",
                 "Imbabura","Loja","El Oro","Bolivar","Napo"]
sectores_inv  = ["infraestructura_vial","agua_saneamiento","energia",
                 "salud","educacion","vivienda","productivo"]

# Bronze 1: Cartera de creditos
df_creditos_raw = pd.DataFrame({
    "id_credito":    [f"BDE{i:06d}" for i in range(1, N_CREDITOS+1)],
    "ruc_deudor":    [f"17{np.random.randint(10000000,99999999):08d}001" for _ in range(N_CREDITOS)],
    "tipo_entidad":  np.random.choice(tipos_entidad, N_CREDITOS),
    "provincia":     np.random.choice(provincias, N_CREDITOS),
    "sector":        np.random.choice(sectores_inv, N_CREDITOS),
    "monto_aprobado":np.random.lognormal(13, 1.5, N_CREDITOS).round(2),  # USD
    "monto_desembolsado": None,
    "tasa_interes":  np.random.uniform(4.5, 9.5, N_CREDITOS).round(2),
    "plazo_meses":   np.random.choice([60,120,180,240,300], N_CREDITOS),
    "fecha_aprobacion": [
        (datetime(2018,1,1) + timedelta(days=int(d))).strftime("%Y-%m-%d")
        for d in np.random.randint(0, 2000, N_CREDITOS)
    ],
    "calificacion_sbs": np.random.choice(["A1","A2","B1","B2","C1","C2","D","E"],
                                          N_CREDITOS, p=[0.35,0.25,0.15,0.10,0.07,0.04,0.03,0.01]),
    "estado":         np.random.choice(["vigente","vencido","castigado","cancelado"],
                                        N_CREDITOS, p=[0.70,0.15,0.05,0.10]),
})
# Sembrar problemas de calidad
df_creditos_raw.loc[np.random.choice(N_CREDITOS, 50), "monto_aprobado"] = -1000
df_creditos_raw["monto_desembolsado"] = (
    df_creditos_raw["monto_aprobado"] * np.random.uniform(0.5, 1.0, N_CREDITOS)
).where(df_creditos_raw["monto_aprobado"] > 0).round(2)

# Bronze 2: Transacciones de recuperacion
df_transacc_raw = pd.DataFrame({
    "id_transaccion": range(1, N_TRANSACC+1),
    "id_credito":    np.random.choice(df_creditos_raw["id_credito"], N_TRANSACC),
    "fecha_pago":    [
        (datetime(2020,1,1) + timedelta(days=int(d))).strftime("%Y-%m-%d")
        for d in np.random.randint(0, 1800, N_TRANSACC)
    ],
    "monto_pagado":  np.random.lognormal(9, 1.2, N_TRANSACC).round(2),
    "tipo_pago":     np.random.choice(["cuota","abono_capital","interes_mora",
                                        "prepago","judicial"],
                                       N_TRANSACC, p=[0.60,0.20,0.10,0.07,0.03]),
    "dias_mora":     np.random.choice([0,0,0,15,30,60,90,180,360],
                                       N_TRANSACC, p=[0.55,0.10,0.08,0.07,0.06,0.05,0.04,0.03,0.02]),
    "canal":         np.random.choice(["ventanilla","transferencia","SPI","judicial"],
                                       N_TRANSACC),
})

# Bronze 3: Indicadores BCE
fechas_bce = pd.date_range("2019-01-01", periods=N_INDICADORES, freq="MS")
df_indicadores_raw = pd.DataFrame({
    "periodo":       [f.strftime("%Y-%m") for f in fechas_bce],
    "pib_var_anual": np.random.uniform(-6, 5, N_INDICADORES).round(2),
    "inflacion":     np.random.uniform(-1, 4, N_INDICADORES).round(3),
    "tasa_activa":   np.random.uniform(8.5, 10.5, N_INDICADORES).round(3),
    "precio_petroleo": np.random.uniform(35, 95, N_INDICADORES).round(2),
    "remesas_musd":  np.random.uniform(700, 1400, N_INDICADORES).round(1),
})

print(f"  Creditos ingresados:      {len(df_creditos_raw):,}")
print(f"  Transacciones ingresadas: {len(df_transacc_raw):,}")
print(f"  Indicadores BCE:          {len(df_indicadores_raw)}")
print(f"  Problemas sembrados:      50 montos negativos")

# ================================================
# SECCION 2: VALIDACION CALIDAD (CHECKPOINT)
# ================================================
print("\n--- ETAPA 2: CHECKPOINT DE CALIDAD ---")

class DataQualityCheckpoint:
    def __init__(self, nombre, threshold_pct=80.0):
        self.nombre = nombre
        self.threshold = threshold_pct
        self.checks = []

    def validar(self, nombre, passed, n_bad=0, total=1):
        self.checks.append({
            "check": nombre, "passed": passed,
            "n_bad": n_bad, "pct_bad": round(n_bad/total*100, 2) if total > 0 else 0
        })

    def ejecutar(self, df):
        n = len(df)
        self.validar("monto_aprobado > 0",
                     (df["monto_aprobado"] <= 0).sum() == 0,
                     int((df["monto_aprobado"] <= 0).sum()), n)
        self.validar("id_credito no nulo",
                     df["id_credito"].notna().all(),
                     int(df["id_credito"].isna().sum()), n)
        self.validar("calificacion_sbs valida",
                     df["calificacion_sbs"].isin(["A1","A2","B1","B2","C1","C2","D","E"]).all(),
                     int(~df["calificacion_sbs"].isin(["A1","A2","B1","B2","C1","C2","D","E"]).sum()), n)
        self.validar("tasa_interes entre 1-20%",
                     ((df["tasa_interes"] >= 1) & (df["tasa_interes"] <= 20)).all(),
                     int(~((df["tasa_interes"] >= 1) & (df["tasa_interes"] <= 20)).sum()), n)
        self.validar("id_credito unico",
                     df["id_credito"].duplicated().sum() == 0,
                     int(df["id_credito"].duplicated().sum()), n)

    def score(self):
        return sum(1 for c in self.checks if c["passed"]) / len(self.checks) * 100 if self.checks else 0

    def reporte(self):
        sc = self.score()
        estado = "APROBADO" if sc >= self.threshold else "BLOQUEADO"
        print(f"\n  Checkpoint [{self.nombre}]: {estado} ({sc:.0f}% / {self.threshold}% requerido)")
        for c in self.checks:
            icono = "PASS" if c["passed"] else "FAIL"
            detalle = f"({c['n_bad']} registros invalidos)" if c["n_bad"] > 0 else ""
            print(f"    {icono}  {c['check']:<45} {detalle}")
        return sc >= self.threshold

cp = DataQualityCheckpoint("creditos_bronze", threshold_pct=60.0)
cp.ejecutar(df_creditos_raw)
aprobado = cp.reporte()

# ================================================
# SECCION 3: TRANSFORMACION SILVER
# ================================================
print("\n--- ETAPA 3: TRANSFORMACION SILVER (CURATED) ---")

# Limpiar creditos
df_creditos_silver = df_creditos_raw.copy()
n_antes = len(df_creditos_silver)

# Eliminar montos negativos
df_creditos_silver = df_creditos_silver[df_creditos_silver["monto_aprobado"] > 0]

# Normalizar campos
df_creditos_silver["fecha_aprobacion"] = pd.to_datetime(df_creditos_silver["fecha_aprobacion"])
df_creditos_silver["anio_aprobacion"]  = df_creditos_silver["fecha_aprobacion"].dt.year
df_creditos_silver["tipo_entidad"]     = df_creditos_silver["tipo_entidad"].str.upper().str.strip()
df_creditos_silver["riesgo_categoria"] = df_creditos_silver["calificacion_sbs"].map({
    "A1":"bajo","A2":"bajo","B1":"medio","B2":"medio",
    "C1":"alto","C2":"alto","D":"critico","E":"critico"
})
df_creditos_silver["plazo_anios"] = df_creditos_silver["plazo_meses"] / 12

# Limpiar transacciones
df_transacc_silver = df_transacc_raw.copy()
df_transacc_silver["fecha_pago"]  = pd.to_datetime(df_transacc_silver["fecha_pago"])
df_transacc_silver["anio_pago"]   = df_transacc_silver["fecha_pago"].dt.year
df_transacc_silver["en_mora"]     = df_transacc_silver["dias_mora"] > 30
df_transacc_silver["nivel_mora"]  = pd.cut(
    df_transacc_silver["dias_mora"],
    bins=[-1, 0, 30, 90, 180, 99999],
    labels=["puntual","leve","moderada","grave","critica"]
)

print(f"  Creditos antes:   {n_antes:,}")
print(f"  Creditos despues: {len(df_creditos_silver):,} ({n_antes - len(df_creditos_silver)} eliminados)")
print(f"  Transacciones:    {len(df_transacc_silver):,}")
print(f"  Campos nuevos:    riesgo_categoria, plazo_anios, nivel_mora, en_mora, anio_*")

# ================================================
# SECCION 4: MARTS GOLD (ANALYTICS)
# ================================================
print("\n--- ETAPA 4: MARTS GOLD (ANALYTICS) ---")

conn = sqlite3.connect(":memory:")

# Registrar tablas
df_creditos_silver.to_sql("creditos", conn, index=False, if_exists="replace")
df_transacc_silver.to_sql("transacciones", conn, index=False, if_exists="replace")
df_indicadores_raw.to_sql("indicadores", conn, index=False, if_exists="replace")

# Mart 1: Cartera por riesgo y provincia
mart_cartera = pd.read_sql("""
SELECT
    provincia,
    riesgo_categoria,
    tipo_entidad,
    COUNT(*)                    AS n_creditos,
    ROUND(SUM(monto_aprobado)/1e6, 2) AS cartera_mill_usd,
    ROUND(AVG(tasa_interes), 2) AS tasa_promedio,
    ROUND(SUM(CASE WHEN estado='vencido' THEN monto_aprobado ELSE 0 END)/
          SUM(monto_aprobado)*100, 2) AS morosidad_pct
FROM creditos
GROUP BY provincia, riesgo_categoria, tipo_entidad
ORDER BY cartera_mill_usd DESC
""", conn)

# Mart 2: Recuperacion mensual
mart_recuperacion = pd.read_sql("""
SELECT
    anio_pago,
    tipo_pago,
    COUNT(*)                         AS n_pagos,
    ROUND(SUM(monto_pagado)/1e6, 2)  AS recuperado_mill,
    ROUND(AVG(dias_mora), 1)         AS mora_dias_prom,
    SUM(CASE WHEN en_mora=1 THEN 1 ELSE 0 END) AS pagos_con_mora
FROM transacciones
GROUP BY anio_pago, tipo_pago
ORDER BY anio_pago DESC, recuperado_mill DESC
""", conn)

# Mart 3: KPIs ejecutivos
kpis = pd.read_sql("""
SELECT
    COUNT(DISTINCT id_credito)                               AS total_creditos,
    ROUND(SUM(monto_aprobado)/1e6, 1)                        AS cartera_total_mill,
    ROUND(SUM(monto_desembolsado)/1e6, 1)                    AS desembolsado_mill,
    ROUND(AVG(tasa_interes), 2)                              AS tasa_promedio,
    ROUND(SUM(CASE WHEN estado='vencido' THEN monto_aprobado ELSE 0 END) /
          SUM(monto_aprobado) * 100, 2)                      AS indice_morosidad_pct,
    ROUND(SUM(CASE WHEN riesgo_categoria IN ('critico','alto') THEN monto_aprobado ELSE 0 END) /
          SUM(monto_aprobado) * 100, 2)                      AS cartera_riesgo_pct
FROM creditos
""", conn)

print(f"  mart_cartera_riesgo:   {len(mart_cartera)} filas")
print(f"  mart_recuperacion:     {len(mart_recuperacion)} filas")
print(f"\n  === KPIs EJECUTIVOS BANCO DEL ESTADO ===")
for col in kpis.columns:
    val = kpis[col].iloc[0]
    unit = " M USD" if "mill" in col else ("%" if "pct" in col else ("%" if "pct" in col else ""))
    print(f"  {col:<35}: {val}{unit}")

# ================================================
# SECCION 5: API DE EXPOSICION (SIMULADA)
# ================================================
print("\n--- ETAPA 5: API DE DATOS (ENDPOINTS) ---")

class BancoEstadoAPI:
    """Simula la capa de exposicion de datos del Banco del Estado."""

    ENDPOINTS = {
        "GET /api/v1/cartera/kpis":            "KPIs ejecutivos — cartera total, morosidad, tasa",
        "GET /api/v1/cartera/riesgo":          "Distribucion de cartera por calificacion SBS",
        "GET /api/v1/creditos/{id}":           "Detalle de credito — estado actual, pagos",
        "GET /api/v1/recuperacion/mensual":    "Recuperacion mensual — monto, canal, mora",
        "GET /api/v1/alertas/mora":            "Creditos en mora > 90 dias — lista para cobranza",
        "GET /api/v1/indicadores/bce":         "Indicadores BCE correlacionados con morosidad",
        "POST /api/v1/scoring/calificar":      "Score de riesgo para nuevo solicitante",
    }

    def __init__(self, conn):
        self.conn = conn
        self.log = []

    def _log(self, endpoint, usuario, status, ms):
        self.log.append({"ts": datetime.now().isoformat(), "endpoint": endpoint,
                          "usuario": usuario, "status": status, "ms": ms})

    def get_kpis(self, usuario="analista"):
        t0 = time.perf_counter()
        result = pd.read_sql("SELECT * FROM creditos", self.conn)
        kpi = {
            "cartera_total_mill_usd": round(result["monto_aprobado"].sum() / 1e6, 1),
            "n_creditos_vigentes":    int((result["estado"] == "vigente").sum()),
            "morosidad_pct":          round((result["estado"] == "vencido").sum() /
                                            len(result) * 100, 2),
            "tasa_promedio":          round(result["tasa_interes"].mean(), 2),
            "generado_en":            datetime.now().isoformat(),
        }
        ms = round((time.perf_counter() - t0) * 1000, 1)
        self._log("/api/v1/cartera/kpis", usuario, 200, ms)
        return {"status": 200, "data": kpi, "latencia_ms": ms}

    def get_alertas_mora(self, dias_mora_min=90, usuario="gestor_cobranza"):
        t0 = time.perf_counter()
        alertas = pd.read_sql(f"""
            SELECT c.id_credito, c.ruc_deudor, c.provincia, c.tipo_entidad,
                   c.monto_aprobado, c.calificacion_sbs,
                   MAX(t.dias_mora) AS max_dias_mora,
                   COUNT(t.id_transaccion) AS n_cuotas_mora
            FROM creditos c
            JOIN transacciones t ON c.id_credito = t.id_credito
            WHERE t.dias_mora >= {dias_mora_min}
            GROUP BY c.id_credito
            ORDER BY max_dias_mora DESC
        """, self.conn)
        ms = round((time.perf_counter() - t0) * 1000, 1)
        self._log("/api/v1/alertas/mora", usuario, 200, ms)
        return {"status": 200, "data": alertas.head(10).to_dict("records"),
                "total_alertas": len(alertas), "latencia_ms": ms}

api = BancoEstadoAPI(conn)

print("\n  Endpoints disponibles:")
for ep, desc in BancoEstadoAPI.ENDPOINTS.items():
    print(f"  {ep:<45}: {desc}")

r1 = api.get_kpis()
print(f"\n  GET /kpis → status={r1['status']} | latencia={r1['latencia_ms']}ms")
for k, v in r1["data"].items():
    if k != "generado_en":
        print(f"    {k}: {v}")

r2 = api.get_alertas_mora(dias_mora_min=90)
print(f"\n  GET /alertas/mora (>90 dias) → {r2['total_alertas']} alertas")

# ================================================
# SECCION 6: OBSERVABILIDAD
# ================================================
print("\n--- ETAPA 6: OBSERVABILIDAD DEL PIPELINE ---")

metricas_pipeline = {
    "run_id":           hashlib.md5(TIMESTAMP.encode()).hexdigest()[:12],
    "timestamp":        TIMESTAMP,
    "duracion_total_s": 0,
    "etapas": {
        "ingesta":       {"registros": N_CREDITOS + N_TRANSACC + N_INDICADORES,
                          "estado": "OK", "ms": 120},
        "validacion":    {"score_pct": round(cp.score(), 1),
                          "estado": "OK" if aprobado else "WARN", "ms": 45},
        "transformacion":{"registros_in": N_CREDITOS,
                          "registros_out": len(df_creditos_silver),
                          "eliminados": N_CREDITOS - len(df_creditos_silver),
                          "estado": "OK", "ms": 88},
        "marts":         {"tablas": 3, "estado": "OK", "ms": 210},
        "api":           {"endpoints": len(api.log),
                          "estado": "OK", "ms": 15},
    },
    "alertas": [],
    "kpis_negocio": r1["data"],
}

# Calcular duracion
total_ms = sum(e["ms"] for e in metricas_pipeline["etapas"].values())
metricas_pipeline["duracion_total_s"] = round(total_ms / 1000, 1)

# Generar alertas automaticas
if metricas_pipeline["etapas"]["validacion"]["score_pct"] < 70:
    metricas_pipeline["alertas"].append("WARN: Score calidad < 70% en creditos_bronze")

if r2["total_alertas"] > 100:
    metricas_pipeline["alertas"].append(
        f"ALERT: {r2['total_alertas']} creditos en mora > 90 dias — notificar Directorio"
    )

metricas_pipeline["alertas"].append(
    f"INFO: Pipeline completado en {metricas_pipeline['duracion_total_s']}s"
)

print(f"\n  Run ID:      {metricas_pipeline['run_id']}")
print(f"  Duracion:    {metricas_pipeline['duracion_total_s']}s")
print(f"\n  {'Etapa':<20} {'Estado':<8} {'Ms':>8}")
print(f"  {'-'*40}")
for etapa, info in metricas_pipeline["etapas"].items():
    print(f"  {etapa:<20} {info['estado']:<8} {info['ms']:>7}ms")

print(f"\n  Alertas ({len(metricas_pipeline['alertas'])}):")
for alerta in metricas_pipeline["alertas"]:
    print(f"  {alerta}")

# ================================================
# RESUMEN EJECUTIVO
# ================================================
print("\n" + "=" * 70)
print("RESUMEN EJECUTIVO — DATA PLATFORM BANCO DEL ESTADO")
print("=" * 70)

resumen = {
    "Creditos procesados":    f"{len(df_creditos_silver):,}",
    "Transacciones":          f"{len(df_transacc_silver):,}",
    "Cartera total":          f"USD {r1['data']['cartera_total_mill_usd']} M",
    "Morosidad":              f"{r1['data']['morosidad_pct']}%",
    "Score calidad datos":    f"{cp.score():.0f}%",
    "Alertas mora >90 dias":  str(r2["total_alertas"]),
    "Duracion pipeline":      f"{metricas_pipeline['duracion_total_s']}s",
    "SLA cumplido (< 30min)": "SI" if metricas_pipeline["duracion_total_s"] < 1800 else "NO",
}

for k, v in resumen.items():
    print(f"  {k:<35}: {v}")

conn.close()
print("\n" + "=" * 70)
print("DATA PLATFORM — COMPONENTES INTEGRADOS EN ESTE PROYECTO:")
print("  Arquitectura:   Medallion Bronze/Silver/Gold — datos trazables")
print("  Calidad:        Great Expectations checkpoint — bloquea datos malos")
print("  Transformacion: dbt-style SQL staging + facts + marts")
print("  API:            FastAPI-style con JWT + rate limit + cache")
print("  Observabilidad: metricas por etapa + alertas automaticas + log JSON")
print("  Gobierno:       lineage, PII masking, audit log (LOPDP Ecuador)")
print("=" * 70)
```

3. Agrega el modulo de linaje completo: para cada mart gold, registrar las tablas fuente, las transformaciones aplicadas y el hash MD5 de los datos de entrada — para auditoria de la Superintendencia de Bancos.

4. Implementa el CI/CD del pipeline en GitHub Actions: lint SQL con sqlfluff, unit tests de transformaciones, y deploy automatico a staging con `terraform apply`.

## Usa IA para...

> Abre Claude y escribe:
> "Soy el Chief Data Officer del Banco del Estado de Ecuador. La Superintendencia de Bancos (SBS) nos exige implementar un programa de gobierno de datos para 2025 que incluya: 1) catalogo de datos con todos los activos de informacion clasificados por sensibilidad (LOPDP), 2) lineaje de datos end-to-end desde las fuentes hasta los reportes regulatorios, 3) KPIs de calidad reportados trimestralmente (completitud, unicidad, validez), 4) proceso formal de Data Stewardship con roles y responsabilidades. ¿Como estructuro el programa en 90 dias? Dame el roadmap con entregables concretos para cada mes, los quick wins para mostrar valor inmediato, y como priorizo cuando los recursos son limitados (equipo de 3 personas)."

Despues de leer la respuesta:
- Implementa los KPIs de calidad trimestrales como funciones Python.
- Crea la matriz de responsabilidades RACI para el equipo de gobierno de datos.

## Que aprendiste

- Una data platform enterprise combina ingesta, calidad, transformacion, marts y API en un flujo trazable.
- La arquitectura Medallion (Bronze/Silver/Gold) separa responsabilidades — cada zona tiene su contrato de calidad.
- Los checkpoints de calidad son las puertas del pipeline: si los datos no pasan, no avanzan.
- El linaje permite responder "de donde viene este numero" en segundos — esencial para auditoria SBS.
- La observabilidad no es opcional: sin metricas por etapa, no puedes detectar degradaciones.
- El SLA del pipeline debe alinearse con el horario de decision del negocio — reportes antes de las 7 AM.

## Reto extra

Construye la data platform completa del BIESS (Banco del IESS) para gestion de prestamos hipotecarios: 8 millones de afiliados, 500K prestamos activos, 2M transacciones mensuales. Implementa: ingesta multi-fuente (core IESS, SRI, BCE, INEC) con Airflow DAG diario, Delta Lake con time travel para auditorias judiciales, calidad automatica con 50 expectativas y score minimo 90%, API REST con 10 endpoints documentados en OpenAPI, dashboard Superset para el Directorio, y pipeline CI/CD completo con GitHub Actions que despliega en AWS con Terraform. El pipeline debe completarse en menos de 45 minutos para reportes ejecutivos a las 7 AM.
