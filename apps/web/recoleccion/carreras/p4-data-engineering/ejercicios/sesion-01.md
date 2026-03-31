# Ejercicio Sesion 1: Arquitectura de Datos Moderna

**Materia:** Data Engineering Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 40 min

## Objetivo

Comprender y disenar arquitecturas modernas de datos: Medallion Architecture, Data Mesh, Lakehouse, y arquitecturas Lambda/Kappa, aplicadas al contexto de empresas ecuatorianas medianas y grandes con multiples fuentes de datos heterogeneas.

## Contexto

El 65% de las empresas ecuatorianas con mas de 100 empleados tienen "data silos" — cada departamento guarda sus datos en sistemas distintos e incompatibles. Un gerente de ventas de Pronaca o Aje Ecuador no puede cruzar datos de produccion, logistica y ventas en una sola vista. La arquitectura de datos moderna resuelve esto con patrones probados a escala global.

## Instrucciones

1. Crea el archivo `sesion01_arquitecturas_datos_ecuador.py`:

```python
# Arquitecturas de Datos Modernas - ITSEIA
# Data Engineering Avanzado
# Medallion, Data Mesh, Lakehouse, Lambda/Kappa

import pandas as pd
import numpy as np
import json
from datetime import datetime
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("ARQUITECTURAS DE DATOS MODERNAS — ECUADOR")
print("=" * 65)

# ================================================
# ARQUITECTURA 1: MEDALLION (Bronze/Silver/Gold)
# ================================================
print("\n--- MEDALLION ARCHITECTURE ---")
print("  Popularizada por Databricks — el estandar del Lakehouse moderno")

medallion = {
    "BRONZE (Raw)": {
        "descripcion":  "Datos tal como llegan — sin modificar",
        "formato":      "CSV/JSON/Parquet sin transformar",
        "retencion":    "Permanente (fuente de verdad)",
        "acceso":       "Solo ingestion pipelines",
        "ejemplo_ec":   "Facturas SRI en CSV tal como las genera el sistema ERP"
    },
    "SILVER (Curated)": {
        "descripcion":  "Datos limpios, validados, tipados y deduplicados",
        "formato":      "Delta Lake / Parquet particionado",
        "retencion":    "5-7 anos",
        "acceso":       "Data Engineers, ML Engineers",
        "ejemplo_ec":   "Facturas SRI normalizadas: fechas parseadas, RUC validado, nulos imputados"
    },
    "GOLD (Analytics)": {
        "descripcion":  "Datos agregados listos para consumo de negocio",
        "formato":      "Delta Lake / tablas BigQuery / Redshift",
        "retencion":    "2 anos rolling",
        "acceso":       "Analistas BI, Data Scientists, APIs",
        "ejemplo_ec":   "Ventas mensuales por categoria y region — dashboard ejecutivo SRI"
    },
}

for capa, info in medallion.items():
    print(f"\n  [{capa}]")
    for k, v in info.items():
        print(f"    {k:<15}: {v}")

# ================================================
# ARQUITECTURA 2: DATA MESH
# ================================================
print("\n--- DATA MESH ---")
print("  Propuesta por Zhamak Dehghani (2019) — descentralizacion de datos")

principios_mesh = {
    "Domain Ownership":     "Cada dominio es dueno y responsable de sus datos",
    "Data as Product":      "Los datos se tratan como productos con SLA, docs, tests",
    "Self-serve Platform":  "Plataforma comun que reduce friccion para publicar datos",
    "Federated Governance": "Politicas globales, implementacion local por dominio",
}

dominios_pronaca = {
    "Produccion":   {"datos": ["inventario_granjas","costos_produccion","calidad_product"],
                     "owner": "Dir. Produccion", "sla": "< 4h latencia"},
    "Logistica":    {"datos": ["rutas_distribucion","despachos","devoluciones"],
                     "owner": "Dir. Logistica", "sla": "< 1h latencia"},
    "Ventas":       {"datos": ["pedidos","clientes","precios_canal"],
                     "owner": "Dir. Ventas", "sla": "< 15min latencia"},
    "Finanzas":     {"datos": ["cuentas_cobrar","caja","costos_financieros"],
                     "owner": "CFO", "sla": "< 24h latencia"},
}

print("\n  Principios Data Mesh:")
for p, desc in principios_mesh.items():
    print(f"  {p:<25}: {desc}")

print("\n  Aplicacion en Pronaca Ecuador:")
for dominio, info in dominios_pronaca.items():
    print(f"  [{dominio}] Owner: {info['owner']} | SLA: {info['sla']}")
    print(f"    Datos: {', '.join(info['datos'])}")

# ================================================
# ARQUITECTURA 3: LAKEHOUSE
# ================================================
print("\n--- LAKEHOUSE (Delta Lake / Apache Iceberg) ---")

lakehouse_features = {
    "ACID transactions":  "Consistencia garantizada — no datos corruptos en fallos",
    "Schema evolution":   "Agregar columnas sin reescribir datos historicos",
    "Time travel":        "SELECT * FROM tabla VERSION AS OF 30 dias atras",
    "Streaming+Batch":    "Un solo sistema para datos en reposo y en movimiento",
    "BI + ML":            "Mismo dataset para dashboards y entrenamiento de modelos",
    "Open format":        "Parquet + metadatos abiertos — no lock-in de proveedor",
}

print("  El Lakehouse combina lo mejor del Data Lake y el Data Warehouse:")
for feat, desc in lakehouse_features.items():
    print(f"  {feat:<25}: {desc}")

# ================================================
# ARQUITECTURA 4: LAMBDA vs KAPPA
# ================================================
print("\n--- LAMBDA vs KAPPA ARCHITECTURE ---")

comparacion = pd.DataFrame({
    "Aspecto":         ["Procesamiento", "Latencia datos", "Complejidad", "Uso ideal",
                        "Ejemplo Ecuador"],
    "Lambda":          ["Batch + Streaming por separado",
                        "Batch: horas; Stream: segundos",
                        "Alta (2 codebases, 2 sistemas)",
                        "Reportes historicos + alertas tiempo real",
                        "Ventas diarias + alertas fraude BCE"],
    "Kappa":           ["Solo Streaming (reprocess desde log)",
                        "Segundos en todo",
                        "Menor (1 codebase, 1 sistema)",
                        "Todo en tiempo real con replay",
                        "Kafka para todo: SRI transacciones"],
})
print(comparacion.to_string(index=False))

# ================================================
# DECISION DE ARQUITECTURA: CASO PRONACA
# ================================================
print("\n--- DECISION: ARQUITECTURA PARA PRONACA ECUADOR ---")

requisitos = {
    "Ventas en tiempo real (alertas pedidos)":     "STREAMING",
    "Inventario granjas (batch diario)":            "BATCH",
    "Costos de produccion (mensual)":               "BATCH",
    "Dashboard ejecutivo (horas)":                  "BATCH",
    "Deteccion anomalias calidad (minutos)":         "STREAMING",
    "Reportes regulatorios SRI (diario)":           "BATCH",
    "App movil vendedores (tiempo real)":            "STREAMING",
}

print("  Analisis de requisitos Pronaca:")
batch_reqs = sum(1 for v in requisitos.values() if v == "BATCH")
stream_reqs = sum(1 for v in requisitos.values() if v == "STREAMING")

for req, tipo in requisitos.items():
    icono = "STREAM" if tipo == "STREAMING" else "BATCH "
    print(f"  [{icono}] {req}")

print(f"\n  Batch: {batch_reqs} casos | Streaming: {stream_reqs} casos")
print(f"  Recomendacion: ARQUITECTURA LAMBDA")
print(f"  Razon: Mix de requisitos. Batch para historico + Kafka para alertas tiempo real")

# ================================================
# DECISION MATRIZ ARQUITECTURA
# ================================================
print("\n--- MATRIZ DE DECISION ARQUITECTURA ---")

matriz = pd.DataFrame({
    "Criterio":        ["Volumen datos", "Latencia req.", "Complejidad equipo",
                        "Presupuesto", "Casos streaming", "Resultado"],
    "Medalion+Lambda": ["Alto",  "Mixto", "Media",  "Medio",   "Si", "RECOMENDADO"],
    "Data Mesh":       ["Alto",  "Bajo",  "Alta",   "Alto",    "Si", "Empresas >500 emp"],
    "Solo Batch":      ["Medio", "Horas", "Baja",   "Bajo",    "No", "PYME Ecuador"],
    "Solo Streaming":  ["Alto",  "Bajo",  "Alta",   "Alto",    "Si", "Fintech/Telco"],
})
print(matriz.to_string(index=False))

print("\n" + "=" * 65)
print("ARQUITECTURAS — RESUMEN:")
print("  Medallion: bronze→silver→gold — estandar para la mayoria de casos")
print("  Data Mesh: para empresas grandes con multiples dominios autonomos")
print("  Lakehouse: ACID + time travel + unifica BI y ML — reemplaza DW clasico")
print("  Lambda:    batch + streaming separados — cuando se necesitan los dos")
print("  Kappa:     solo streaming con replay — max simplicidad operacional")
print("=" * 65)
```

2. Diseña la arquitectura Medallion para el IESS Ecuador: identifica las fuentes de datos (afiliados, aportes, prestamos), define las transformaciones de Bronze a Silver, y los KPIs de Gold.

3. Escribe el "contrato de datos" (Data Contract) para el dominio de Ventas de Pronaca: schema, SLA, ownership, versioning.

## Usa IA para...

> Abre Gemini y escribe:
> "Soy el Head of Data de Banco Guayaquil Ecuador. Tenemos: 1 DW Oracle legacy, datos en 3 sistemas core bancarios distintos, 12 silos departamentales en Excel, y la necesidad de GDPR/LOPDP compliance. El presupuesto para modernizacion es $500K en 2 anos. ¿Que arquitectura recomiendan: migrar a Snowflake, construir Data Mesh en AWS, o adoptar Databricks Lakehouse? Analiza costo, tiempo de implementacion, riesgo y capacidad del equipo actual (5 data engineers, 3 analistas)."

Despues de leer la respuesta:
- Documenta la recomendacion con justificacion tecnica y financiera.
- Crea el roadmap de 8 semanas para la primera fase de implementacion.

## Que aprendiste

- La arquitectura Medallion (Bronze/Silver/Gold) es el patron mas adoptado para data lakes modernos.
- Data Mesh es para empresas grandes con dominios autonomos — no recomendable para PYME.
- El Lakehouse combina ACID, time travel y schema evolution sobre Parquet — reemplaza DW clasicos.
- Lambda Architecture usa dos capas (batch + streaming) para satisfacer tanto reportes historicos como alertas en tiempo real.
- La eleccion de arquitectura depende del volumen, latencia requerida, complejidad del equipo y presupuesto.
- Los "Data Contracts" formalizan las promesas entre dominios: schema, SLA, versionado y ownership.

## Reto extra

Diseña e implementa un prototipo de Data Mesh para el gobierno de Ecuador: los dominios son INEC (demografia), BCE (macroeconomia), SRI (tributario) y MSP (salud). Cada dominio publica sus datos como "producto de datos" con schema documentado, tests de calidad y endpoint de acceso. El portal de busqueda permite descubrir datasets disponibles y solicitar acceso. Implementa con FastAPI + SQLite como catalogo + Parquet como formato de intercambio.
