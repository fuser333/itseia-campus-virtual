# Ejercicio Sesion 3: ETL — Extract, Transform, Load

**Materia:** Data Warehousing y ETL
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion estimada:** 40 min

## Objetivo

Implementar un proceso ETL completo desde cero: extraer datos de multiples fuentes heterogeneas, transformarlos (limpiar, estandarizar, enriquecer) y cargarlos en un data warehouse, usando datos de empresas ecuatorianas.

## Contexto

ETL es el proceso que alimenta todo data warehouse. Sin ETL no hay DW. En una empresa ecuatoriana de retail, cada noche un proceso ETL extrae ventas del sistema POS, registros de clientes del CRM, y precios del ERP — los limpia, los combina y los carga en el DW para que la gerencia los analice al dia siguiente. Este ejercicio simula exactamente ese proceso.

## Instrucciones

1. Crea el archivo `sesion03_etl_completo_ecuador.py`.

2. Ejecuta el proceso ETL completo:

```python
# ETL Completo - ITSEIA Data Warehousing
# Extract → Transform → Load
# Dataset: ventas retail Ecuador (3 fuentes heterogeneas)

import pandas as pd
import numpy as np
import sqlite3
import json
from datetime import datetime, date
import re

print("=" * 65)
print("PROCESO ETL — VENTAS RETAIL ECUADOR")
print("Extract → Transform → Load")
print("=" * 65)

# ================================================
# PHASE 1: EXTRACT — Extraer de 3 fuentes
# ================================================
print("\n[EXTRACT] Extrayendo de 3 fuentes heterogeneas...")

# Fuente 1: Sistema POS (CSV-like - datos de ventas en tiendas)
print("  Fuente 1: Sistema POS Supermaxi (CSV simulado)")
raw_pos = pd.DataFrame({
    "txn_id":         ["V001","V002","V003","V004","V005","V006","V007","V008"],
    "fecha":          ["25/03/2024","25-03-2024","2024/03/25","25/03/2024",
                       "24/03/2024","24/03/2024","23/03/2024","23/03/2024"],
    "cod_producto":   ["SKU001","SKU-001","sku001","SKU002","SKU001","SKU003","SKU002","SKU003"],
    "cantidad":       ["2","3","abc","1","5","2","3","1"],
    "precio_unit":    ["$1.25","$1.25","$1.25","$3.45","$1.25","$4.20","$3.45","$4.20"],
    "tienda_cod":     ["QN01","QN01","QN01","QS01","QN01","GYE1","QS01","GYE1"],
    "vendedor":       ["Ana Q.","Ana Q.","Ana Q.","Diego M.","Ana Q.","Sofia T.","Diego M.","Sofia T."],
    "cliente_cedula": ["1720001","0912345",None,"1802345","1720001","0601234","0912345",None]
})
print(f"    {len(raw_pos)} registros extraidos")

# Fuente 2: CRM (JSON - datos de clientes)
print("  Fuente 2: CRM Salesforce (JSON simulado)")
raw_crm_json = """[
    {"cedula":"1720001","nombre_completo":"ANA SOFIA QUISPE LEMA","email":"ana.quispe@gmail.com","telefono":"0998765432","ciudad":"Quito","fecha_registro":"2020-03-15","tipo_cliente":"frecuente"},
    {"cedula":"0912345","nombre_completo":"DIEGO  MORA  BELTRAN","email":"dmora@hotmail.com","telefono":"0987654321","ciudad":"GUAYAQUIL","fecha_registro":"2019-07-22","tipo_cliente":"Ocasional"},
    {"cedula":"1802345","nombre_completo":"Sofia Torres","email":"sofia.torres@gmail.com","telefono":null,"ciudad":"Cuenca","fecha_registro":"2022-01-10","tipo_cliente":"frecuente"},
    {"cedula":"0601234","nombre_completo":"LUIS VERA","email":"lv@empresa.ec","telefono":"0976543210","ciudad":"ambato","fecha_registro":"2021-05-20","tipo_cliente":"LEAL"}
]"""
raw_crm = pd.DataFrame(json.loads(raw_crm_json))
print(f"    {len(raw_crm)} clientes extraidos")

# Fuente 3: ERP (tabla SQL - datos de productos)
print("  Fuente 3: ERP SAP (SQL simulado)")
conn_erp = sqlite3.connect(":memory:")
conn_erp.execute("""CREATE TABLE productos_erp (
    sku TEXT, nombre TEXT, categoria TEXT, precio_costo REAL, marca TEXT)""")
conn_erp.executemany("INSERT INTO productos_erp VALUES (?,?,?,?,?)", [
    ("SKU001","ARROZ DIANA 1KG","ABARROTES",0.78,"Diana"),
    ("SKU002","ACEITE LA FAVORITA 1L","ABARROTES",2.10,"La Favorita"),
    ("SKU003","POLLO PRONACA 1KG","CARNES",2.80,"Pronaca"),
])
raw_erp = pd.read_sql("SELECT * FROM productos_erp", conn_erp)
print(f"    {len(raw_erp)} productos extraidos")

# ================================================
# PHASE 2: TRANSFORM — Limpiar y estandarizar
# ================================================
print("\n[TRANSFORM] Transformando datos...")

errores_encontrados = []
errores_corregidos = []

# --- TRANSFORMAR POS ---
df_pos = raw_pos.copy()

# 1. Estandarizar fechas (multiples formatos → YYYY-MM-DD)
def parse_fecha(fecha_str):
    for fmt in ["%d/%m/%Y", "%d-%m-%Y", "%Y/%m/%d", "%Y-%m-%d"]:
        try:
            return datetime.strptime(fecha_str, fmt).strftime("%Y-%m-%d")
        except:
            pass
    return None

fechas_originales = df_pos["fecha"].tolist()
df_pos["fecha"] = df_pos["fecha"].apply(parse_fecha)
fechas_invalidas = df_pos["fecha"].isnull().sum()
errores_encontrados.append(f"Fechas con formato invalido: {fechas_invalidas}")
print(f"  POS: fechas estandarizadas (3 formatos → YYYY-MM-DD)")

# 2. Estandarizar codigos producto (remover guiones, minusculas → mayusculas)
df_pos["cod_producto"] = df_pos["cod_producto"].str.upper().str.replace("-", "")
print(f"  POS: codigos producto normalizados → {df_pos['cod_producto'].unique().tolist()}")

# 3. Limpiar precio (remover $, convertir a float)
df_pos["precio_unit"] = df_pos["precio_unit"].str.replace("$", "").astype(float)

# 4. Validar cantidad (convertir a int, marcar invalidos)
def parse_cantidad(val):
    try:
        return int(val)
    except:
        return None

df_pos["cantidad"] = df_pos["cantidad"].apply(parse_cantidad)
cant_invalidas = df_pos["cantidad"].isnull().sum()
errores_encontrados.append(f"Cantidades invalidas (ej. 'abc'): {cant_invalidas}")
# Estrategia: eliminar filas con cantidad invalida
df_pos_limpio = df_pos.dropna(subset=["cantidad"]).copy()
df_pos_limpio["cantidad"] = df_pos_limpio["cantidad"].astype(int)
errores_corregidos.append(f"Filas con cantidad invalida eliminadas: {cant_invalidas}")
print(f"  POS: {len(raw_pos)} filas → {len(df_pos_limpio)} validas (eliminadas: {cant_invalidas})")

# 5. Calcular monto total
df_pos_limpio["monto_total"] = (df_pos_limpio["cantidad"] * df_pos_limpio["precio_unit"]).round(2)

# --- TRANSFORMAR CRM ---
df_crm = raw_crm.copy()

# Estandarizar nombre: title case, remover espacios multiples
df_crm["nombre_limpio"] = df_crm["nombre_completo"].str.title().str.replace(r"\s+", " ", regex=True).str.strip()

# Estandarizar ciudad: title case
df_crm["ciudad"] = df_crm["ciudad"].str.title()

# Estandarizar tipo_cliente: minusculas
df_crm["tipo_cliente"] = df_crm["tipo_cliente"].str.lower()

# Email: validar formato basico
df_crm["email_valido"] = df_crm["email"].str.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
emails_invalidos = (~df_crm["email_valido"]).sum()
if emails_invalidos:
    errores_encontrados.append(f"Emails con formato invalido: {emails_invalidos}")
print(f"  CRM: nombres y ciudades estandarizados, emails validados")

# --- TRANSFORMAR ERP ---
df_erp = raw_erp.copy()
df_erp["nombre"] = df_erp["nombre"].str.title()
df_erp["categoria"] = df_erp["categoria"].str.title()
print(f"  ERP: nombres y categorias en title case")

# ================================================
# ENRIQUECIMIENTO: JOIN entre fuentes
# ================================================
print("\n[TRANSFORM] Enriqueciendo — JOIN entre fuentes...")

# Join POS + ERP (obtener nombre y categoria del producto)
df_merged = df_pos_limpio.merge(
    df_erp[["sku", "nombre", "categoria", "precio_costo", "marca"]],
    left_on="cod_producto",
    right_on="sku",
    how="left"
)

# Calcular margen
df_merged["margen"] = (df_merged["monto_total"] - df_merged["cantidad"] * df_merged["precio_costo"]).round(2)
df_merged["margen_pct"] = (df_merged["margen"] / df_merged["monto_total"] * 100).round(1)

# Join con CRM (nombre del cliente)
df_final = df_merged.merge(
    df_crm[["cedula", "nombre_limpio", "tipo_cliente", "ciudad"]],
    left_on="cliente_cedula",
    right_on="cedula",
    how="left"
)
df_final["nombre_cliente"] = df_final["nombre_limpio"].fillna("Cliente Anonimo")

print(f"  Dataset enriquecido: {len(df_final)} registros con {len(df_final.columns)} columnas")

# ================================================
# PHASE 3: LOAD — Cargar al Data Warehouse
# ================================================
print("\n[LOAD] Cargando al Data Warehouse...")

conn_dw = sqlite3.connect(":memory:")

# Tabla staging (carga inicial)
df_final.to_sql("staging_ventas", conn_dw, if_exists="replace", index=False)

# Tabla final de hechos (solo columnas del DW)
cols_dw = ["txn_id", "fecha", "cod_producto", "nombre", "categoria",
           "marca", "tienda_cod", "cantidad", "precio_unit", "monto_total",
           "margen", "margen_pct", "nombre_cliente", "tipo_cliente"]
df_dw = df_final[[c for c in cols_dw if c in df_final.columns]].copy()
df_dw["fecha_carga_dw"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

df_dw.to_sql("fact_ventas_dw", conn_dw, if_exists="replace", index=False)

# Verificar carga
count = pd.read_sql("SELECT COUNT(*) as total FROM fact_ventas_dw", conn_dw)
print(f"  Registros cargados al DW: {count.iloc[0]['total']}")

# Query de verificacion
result = pd.read_sql("""
    SELECT fecha, nombre, categoria, cantidad, monto_total, margen_pct, nombre_cliente
    FROM fact_ventas_dw
    ORDER BY monto_total DESC
""", conn_dw)
print(f"\n  DW — Ventas cargadas:")
print(result.to_string(index=False))

# ================================================
# REPORTE ETL
# ================================================
print("\n" + "=" * 65)
print("REPORTE EJECUCION ETL")
print(f"  Timestamp:             {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print(f"  Fuentes procesadas:    3 (POS, CRM, ERP)")
print(f"  Registros extraidos:   {len(raw_pos)} (POS) + {len(raw_crm)} (CRM) + {len(raw_erp)} (ERP)")
print(f"  Errores encontrados:   {len(errores_encontrados)}")
for e in errores_encontrados:
    print(f"    - {e}")
print(f"  Correcciones:          {len(errores_corregidos)}")
for c in errores_corregidos:
    print(f"    - {c}")
print(f"  Registros cargados DW: {count.iloc[0]['total']}")
print(f"  Estado:                COMPLETADO")
print("=" * 65)
```

3. Analiza el reporte ETL y los errores detectados.

4. Agrega una cuarta fuente: un archivo JSON con datos de descuentos especiales (10% Martes de Oferta) y aplica el descuento en el Transform.

## Usa IA para...

> Abre Gemini y escribe:
> "En mi proceso ETL de una cadena de supermercados Ecuador, la fuente POS tiene 3 formatos de fecha distintos y codigos de producto con inconsistencias (guiones, mayusculas). ¿Cuales son las 5 transformaciones mas comunes en ETL? Dame el codigo Python para cada una usando pandas."

Despues de leer la respuesta:
- Identifica cuales de esas 5 transformaciones ya estan en el codigo del ejercicio.
- Implementa las que faltan en la fase TRANSFORM.

## Que aprendiste

- ETL tiene 3 fases: Extract (extraer datos crudos), Transform (limpiar y estandarizar), Load (cargar al DW).
- La fase Extract puede leer de CSV, JSON, SQL, APIs, y mas fuentes heterogeneas.
- Transform incluye: estandarizar fechas, limpiar strings, validar tipos, deduplicar, enriquecer con JOINs.
- La carga puede ser full-load (reemplazar todo) o incremental (solo registros nuevos).
- Un reporte de ejecucion ETL debe incluir: timestamp, registros procesados, errores y estado.
- La calidad de datos en el DW depende 100% de la calidad del proceso ETL.

## Reto extra

Implementa un ETL incremental: en lugar de recargar todos los datos, el proceso debe detectar solo los registros nuevos o modificados desde la ultima ejecucion (usando una columna `fecha_modificacion`). Guarda el "watermark" (ultima fecha de carga exitosa) en una tabla de control. Ejecuta el ETL 3 veces simulando nuevos datos cada vez y verifica que solo procesa los registros nuevos.
