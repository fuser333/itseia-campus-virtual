# Ejercicio Sesion 1: Data Warehouse vs Database

**Materia:** Data Warehousing y ETL
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 25 min

## Objetivo

Entender las diferencias fundamentales entre una base de datos operacional (OLTP) y un data warehouse (OLAP), y decidir cual usar para cinco escenarios reales de empresas ecuatorianas.

## Contexto

El Banco Pichincha tiene dos sistemas: uno que procesa 500,000 transacciones diarias en tiempo real (OLTP), y otro que almacena 10 anos de historia para analizar tendencias (OLAP/DW). Confundirlos es uno de los errores mas costosos en arquitecturas de datos. Este ejercicio te ensena a distinguirlos y disenar el sistema correcto para cada necesidad.

## Instrucciones

1. Crea el archivo `sesion01_dw_vs_db_ecuador.py`.

2. Ejecuta este codigo comparativo:

```python
# Data Warehouse vs Database - ITSEIA
# OLTP vs OLAP: conceptos y casos Ecuador
# Fuente: arquitecturas empresas Ecuador

print("=" * 65)
print("DATA WAREHOUSE vs DATABASE OPERACIONAL")
print("OLAP vs OLTP — Contexto Ecuador")
print("=" * 65)

# ================================================
# TABLA COMPARATIVA OLTP vs OLAP
# ================================================
print("\n--- COMPARATIVA FUNDAMENTAL ---")

comparativa = {
    "Proposito":         ("Operaciones diarias",        "Analisis e informes"),
    "Tipo consultas":    ("Muchas consultas pequenas",   "Pocas consultas masivas"),
    "Datos":             ("Actuales, operacionales",     "Historicos, integrados"),
    "Actualizacion":     ("Tiempo real (segundos)",      "Batch periodico (horas/dias)"),
    "Esquema":           ("Normalizado (3NF)",           "Desnormalizado (estrella)"),
    "Optimizado para":   ("Escritura rapida",            "Lectura y agregacion"),
    "Usuarios tipicos":  ("Cajeros, sistemas",           "Analistas, gerentes"),
    "Volumen tipico":    ("GB-TB",                       "TB-PB"),
    "Ejemplo Ecuador":   ("Core bancario Pichincha",     "BI/DW Grupo El Rosado"),
    "Tecnologias":       ("MySQL, PostgreSQL, Oracle",   "Redshift, BigQuery, Snowflake"),
}

col1, col2, col3 = 22, 30, 30
print(f"  {'ASPECTO':<{col1}} {'OLTP (Base de datos)':<{col2}} {'OLAP (Data Warehouse)':<{col3}}")
print("  " + "-" * (col1 + col2 + col3))
for aspecto, (oltp, olap) in comparativa.items():
    print(f"  {aspecto:<{col1}} {oltp:<{col2}} {olap:<{col3}}")

# ================================================
# CASO PRACTICO: Banco Ecuador
# ================================================
print("\n--- CASO PRACTICO: BANCO PICHINCHA ECUADOR ---")

# OLTP: tabla transacciones (millones de filas, actualizacion constante)
print("\n  OLTP — Tabla de transacciones (Base de datos operacional):")
print("  Objetivo: procesar cada pago en < 100ms")

transacciones_oltp = [
    ("TXN-20240325-001", "2024-03-25 14:32:01", "cta-001", "cta-002", 150.00, "transferencia", "procesada"),
    ("TXN-20240325-002", "2024-03-25 14:32:15", "cta-003", "cta-001", 45.50,  "pago_servicio",  "procesada"),
    ("TXN-20240325-003", "2024-03-25 14:33:00", "cta-002", "ext-001", 800.00, "retiro_cajero",  "procesada"),
]

print(f"  {'TXN_ID':<25} {'TIMESTAMP':<22} {'MONTO':>10} {'TIPO':<18} {'ESTADO'}")
print("  " + "-" * 90)
for txn in transacciones_oltp:
    print(f"  {txn[0]:<25} {txn[1]:<22} ${txn[4]:>9.2f} {txn[5]:<18} {txn[6]}")

print("\n  OLAP — Tabla de hechos en el Data Warehouse:")
print("  Objetivo: analizar tendencias de 5 anos en segundos")

# DW: tabla de hechos desnormalizada (joins ya aplicados)
hechos_dw = [
    (2024, 3, 25, "Pichincha", "Quito", "transferencia", 45230, 8567450.00),
    (2024, 3, 25, "Guayas",    "Guayaquil", "pago_servicio", 38100, 4231800.00),
    (2024, 3, 24, "Pichincha", "Quito", "retiro_cajero",  22100, 5525000.00),
    (2024, 3, 23, "Azuay",     "Cuenca", "transferencia", 12400, 1860000.00),
]

print(f"\n  {'ANIO'} {'MES'} {'DIA'} {'PROVINCIA':<12} {'CIUDAD':<12} "
      f"{'TIPO_TXN':<18} {'NUM_TXN':>8} {'MONTO_TOTAL':>15}")
print("  " + "-" * 100)
for h in hechos_dw:
    print(f"  {h[0]}  {h[1]:>2}  {h[2]:>3}  {h[3]:<12} {h[4]:<12} {h[5]:<18} "
          f"{h[6]:>8,} ${h[7]:>14,.2f}")

# ================================================
# QUERIES TIPICAS DE CADA SISTEMA
# ================================================
print("\n--- QUERIES TIPICAS ---")

print("\n  OLTP — Query tipico (rapido, pocos registros):")
print("""
  SELECT cuenta_destino, monto, estado, timestamp
  FROM transacciones
  WHERE txn_id = 'TXN-20240325-001';
  -- Tiempo esperado: < 10ms | Resultado: 1 fila
  """)

print("  OLAP — Query tipico (lento pero sobre millones de filas):")
print("""
  SELECT anio, provincia,
         SUM(monto_total) as total_transferencias,
         AVG(monto_total / num_transacciones) as ticket_promedio
  FROM hechos_transacciones
  WHERE tipo_txn = 'transferencia'
    AND anio BETWEEN 2020 AND 2024
  GROUP BY anio, provincia
  ORDER BY anio, total_transferencias DESC;
  -- Tiempo esperado: 2-30 segundos | Resultado: miles de filas
  """)

# ================================================
# ESCENARIOS ECUADOR: decide cual sistema usar
# ================================================
print("\n--- DECIDE EL SISTEMA PARA CADA CASO ---")
escenarios = [
    ("Registrar ventas de farmacia Fybeca en tiempo real",
     "OLTP", "Base de datos operacional", "Cada venta debe procesarse en ms"),
    ("Analizar ventas mensuales de los ultimos 5 anos por provincia",
     "OLAP", "Data Warehouse",            "Analisis historico de grandes volumenes"),
    ("Consultar el saldo actual de una cuenta bancaria",
     "OLTP", "Base de datos operacional", "Dato actual, lectura de 1 fila"),
    ("Calcular el KPI de mortalidad de emprendimientos por sector 2019-2024",
     "OLAP", "Data Warehouse",            "Multiples anios, aggregaciones complejas"),
    ("Sistema de reservas de vuelos Tame/Aerogal",
     "OLTP", "Base de datos operacional", "Transacciones en tiempo real, ACID"),
    ("Dashboard de exportaciones Ecuador para el BCE",
     "OLAP", "Data Warehouse",            "Historico multisectorial para reporting"),
]

for caso, sistema, tipo, razon in escenarios:
    print(f"\n  [{sistema}] {caso}")
    print(f"         Tipo:  {tipo}")
    print(f"         Razon: {razon}")

# ================================================
# ARQUITECTURA MODERNA: OLTP + DW juntos
# ================================================
print("\n--- ARQUITECTURA MODERNA: Los dos juntos ---")
arquitectura = """
  [Fuentes OLTP]              [ETL/Pipeline]         [Data Warehouse]
  ┌──────────────┐            ┌──────────┐           ┌──────────────┐
  │ Core Bancario│──Diario──► │ ETL Job  │──────────►│  BigQuery    │
  │ MySQL/Oracle │            │ (extract,│           │  Redshift    │
  └──────────────┘            │  transf, │           │  Snowflake   │
  ┌──────────────┐            │  load)   │           └──────┬───────┘
  │ ERP SAP      │──Diario──► │          │                  │
  │ PostgreSQL   │            └──────────┘           [Herramientas BI]
  └──────────────┘                                   ┌──────────────┐
  ┌──────────────┐                                   │ Power BI     │
  │ App Movil    │──Streaming►│Kafka/Spark│──────────►│ Looker       │
  │ Firebase     │            │           │           │ Metabase     │
  └──────────────┘            └───────────┘           └──────────────┘
"""
print(arquitectura)

print("=" * 65)
print("REGLA DE ORO:")
print("  OLTP: si preguntas '¿que pasa AHORA?' → base de datos operacional")
print("  OLAP: si preguntas '¿que paso EN LOS ULTIMOS ANIOS?' → data warehouse")
print("=" * 65)
```

3. Ejecuta el codigo. Analiza los queries tipicos de OLTP vs OLAP.

4. Para cada empresa ecuatoriana que conozcas (Supermaxi, CNT, Petroecuador), decide si su sistema principal es OLTP, OLAP o ambos, y justifica con 2 argumentos.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Explica la diferencia entre OLTP y OLAP con un ejemplo de un banco ecuatoriano. ¿Por que no se usa el mismo sistema para los dos? ¿Que pasaria si una empresa usara su base de datos de transacciones en tiempo real para ejecutar reportes anuales?"

Despues de leer la respuesta:
- Identifica los problemas concretos que describe ChatGPT.
- Agrega un bloque de codigo que simule esos problemas: una query OLAP lenta sobre una tabla OLTP.

## Que aprendiste

- OLTP (Online Transaction Processing): optimizado para escritura rapida, transacciones pequenas en tiempo real.
- OLAP (Online Analytical Processing): optimizado para lectura masiva y aggregaciones historicas.
- El esquema normalizado (3NF) de OLTP minimiza redundancia; el desnormalizado del DW optimiza lectura.
- Un data warehouse integra datos de multiples fuentes OLTP mediante procesos ETL.
- Las empresas modernas tienen ambos: OLTP para operaciones, DW para decisiones.
- BigQuery, Redshift y Snowflake son los data warehouses mas usados en la industria.

## Reto extra

Investiga la arquitectura de datos del INEC Ecuador: ¿como pasan los datos de las encuestas ENEMDU desde la captura en campo hasta los reportes publicos que publican? Dibuja el flujo en un diagrama de texto (ASCII art) identificando: sistema de captura, base de datos operacional, proceso ETL, data warehouse y herramienta de reporte final.
