# Ejercicio Sesion 3: Power BI — Conectar Datos

**Materia:** Inteligencia de Negocio y Reporting
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion estimada:** 35 min

## Objetivo

Preparar datos estructurados para Power BI, exportarlos en los formatos correctos, y crear las relaciones de un modelo de datos estrella listo para ser importado y analizado en Power BI Desktop.

## Contexto

Power BI es la herramienta BI mas usada en Ecuador por precio (gratis para Desktop) y facilidad. Las empresas ecuatorianas que lo adoptan reportan reducir el tiempo de generacion de reportes de 8 horas a 15 minutos. Este ejercicio prepara los datos del lado Python para que Power BI los consuma correctamente.

## Instrucciones

1. Instala: `pip install pandas openpyxl`.

2. Descarga Power BI Desktop gratis desde https://powerbi.microsoft.com/es-es/desktop/.

3. Crea el archivo `sesion03_powerbi_datos_ecuador.py`:

```python
# Power BI - Preparacion de Datos Ecuador
# Exportar tablas en formato listo para Power BI
# Dataset: ventas distribuidor alimentos Ecuador

import pandas as pd
import numpy as np
from datetime import datetime, date, timedelta
import os

np.random.seed(2026)
print("=" * 65)
print("PREPARACION DATOS PARA POWER BI")
print("Distribuidor Alimentos Ecuador 2024")
print("=" * 65)

# ================================================
# GENERAR TABLAS (modelo estrella para Power BI)
# ================================================

# DIMENSION FECHA (requerida en casi todo DW Power BI)
print("\n[1] Generando tabla de fechas...")
fechas = pd.date_range("2024-01-01", "2024-12-31")
feriados_ec = ["2024-01-01","2024-02-12","2024-02-13","2024-04-29",
               "2024-05-01","2024-05-24","2024-08-10","2024-10-09",
               "2024-11-02","2024-11-03","2024-12-25"]
dim_fecha = pd.DataFrame({
    "FechaKey":         fechas.strftime("%Y%m%d").astype(int),
    "Fecha":            fechas,
    "Anio":             fechas.year,
    "Semestre":         ((fechas.month - 1) // 6 + 1),
    "Trimestre":        fechas.quarter,
    "Mes":              fechas.month,
    "MesNombre":        fechas.strftime("%B"),
    "MesNombreCorto":   fechas.strftime("%b"),
    "Semana":           fechas.isocalendar().week,
    "DiaSemana":        fechas.day_of_week + 1,
    "DiaNombre":        fechas.strftime("%A"),
    "EsFeriado":        fechas.strftime("%Y-%m-%d").isin(feriados_ec).astype(int),
    "EsFinSemana":      (fechas.weekday >= 5).astype(int),
    "EsDiaHabil":       ((~(fechas.weekday >= 5)) & (~fechas.strftime("%Y-%m-%d").isin(feriados_ec))).astype(int)
})
print(f"  dim_fecha: {len(dim_fecha)} filas x {len(dim_fecha.columns)} columnas")

# DIMENSION PRODUCTO
categorias = {
    "Abarrotes":  ["Arroz Diana 1kg","Aceite La Favorita","Azucar San Carlos","Harina Selecta"],
    "Lacteos":    ["Leche Toni 1L","Queso fresco 500g","Yogurt Tony 1L"],
    "Carnes":     ["Pollo Pronaca 1kg","Carne molida 1lb","Salchicha Juris"],
    "Bebidas":    ["Agua Tesalia 1L","Coca-Cola 2L","Jugo Del Valle 1L"],
    "Cuidado":    ["Shampoo H&S 400ml","Detergente Deja 1kg","Jabón Protex"],
}
prod_rows = []
pid = 1
for cat, prods in categorias.items():
    for prod in prods:
        prod_rows.append({
            "ProductoKey": pid,
            "CodigoSKU": f"SKU-{pid:04d}",
            "Nombre": prod,
            "Categoria": cat,
            "PrecioLista": round(np.random.uniform(1.0, 12.0), 2),
            "PrecioCosto": round(np.random.uniform(0.6, 8.0), 2),
            "Activo": 1
        })
        pid += 1
dim_producto = pd.DataFrame(prod_rows)
print(f"  dim_producto: {len(dim_producto)} filas")

# DIMENSION CLIENTE (distribuidores)
provincias = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua",
              "Loja","Imbabura","El Oro","Chimborazo","Cotopaxi"]
clientes_rows = []
for i in range(1, 51):
    prov = np.random.choice(provincias)
    clientes_rows.append({
        "ClienteKey": i,
        "CodigoCliente": f"CLI-{i:04d}",
        "RazonSocial": f"Distribuidor_{prov}_{i:02d}",
        "RUC": f"17{str(i).zfill(8)}001",
        "Provincia": prov,
        "TipoCliente": np.random.choice(["mayorista","minorista","supermercado"],
                                         p=[0.4, 0.4, 0.2]),
        "LimiteCredito": np.random.choice([5000, 10000, 25000, 50000]),
        "Activo": 1
    })
dim_cliente = pd.DataFrame(clientes_rows)
print(f"  dim_cliente: {len(dim_cliente)} filas")

# DIMENSION VENDEDOR
dim_vendedor = pd.DataFrame({
    "VendedorKey": range(1, 11),
    "Nombre": [f"Vendedor_{i}" for i in range(1, 11)],
    "Region": np.random.choice(["Sierra Norte","Sierra Sur","Costa Norte",
                                  "Costa Sur","Oriente"], 10),
    "Meta_Mensual_USD": np.random.choice([15000, 20000, 25000, 30000], 10),
    "Activo": 1
})
print(f"  dim_vendedor: {len(dim_vendedor)} filas")

# TABLA DE HECHOS
n_fact = 3000
hecho_rows = []
for i in range(n_fact):
    prod = dim_producto.sample(1).iloc[0]
    cliente = dim_cliente.sample(1).iloc[0]
    vendedor = dim_vendedor.sample(1).iloc[0]
    fecha = np.random.choice(fechas)
    cant = np.random.randint(5, 200)
    precio = prod["PrecioLista"] * np.random.uniform(0.90, 1.05)
    costo = prod["PrecioCosto"]
    desc = np.random.choice([0, 0, 0, 5, 10], p=[0.5, 0.2, 0.1, 0.1, 0.1])
    monto_neto = cant * precio * (1 - desc/100)
    hecho_rows.append({
        "FactKey":        i + 1,
        "FechaKey":       int(fecha.strftime("%Y%m%d")),
        "ProductoKey":    int(prod["ProductoKey"]),
        "ClienteKey":     int(cliente["ClienteKey"]),
        "VendedorKey":    int(vendedor["VendedorKey"]),
        "Cantidad":       cant,
        "PrecioUnitario": round(precio, 4),
        "DescuentoPct":   desc,
        "MontoNeto":      round(monto_neto, 2),
        "CostoTotal":     round(costo * cant, 2),
        "Margen":         round(monto_neto - costo * cant, 2),
        "NumeroFactura":  f"FAC-2024-{i+1:06d}"
    })
fact_ventas = pd.DataFrame(hecho_rows)
print(f"  fact_ventas: {len(fact_ventas)} filas")

# ================================================
# EXPORTAR A EXCEL MULTI-HOJA
# ================================================
output_file = "datos_powerbi_ecuador.xlsx"
print(f"\n[2] Exportando a Excel: {output_file}")
with pd.ExcelWriter(output_file, engine="openpyxl") as writer:
    dim_fecha.to_excel(writer, sheet_name="dim_Fecha", index=False)
    dim_producto.to_excel(writer, sheet_name="dim_Producto", index=False)
    dim_cliente.to_excel(writer, sheet_name="dim_Cliente", index=False)
    dim_vendedor.to_excel(writer, sheet_name="dim_Vendedor", index=False)
    fact_ventas.to_excel(writer, sheet_name="fact_Ventas", index=False)

print(f"  Archivo creado: {output_file}")
print(f"  Hojas: 5 (4 dimensiones + 1 tabla de hechos)")

# ================================================
# EXPORTAR CSVs INDIVIDUALES
# ================================================
os.makedirs("powerbi_csvs", exist_ok=True)
for nombre, tabla in [("dim_Fecha", dim_fecha), ("dim_Producto", dim_producto),
                       ("dim_Cliente", dim_cliente), ("dim_Vendedor", dim_vendedor),
                       ("fact_Ventas", fact_ventas)]:
    tabla.to_csv(f"powerbi_csvs/{nombre}.csv", index=False)
print(f"\n  CSVs exportados a: powerbi_csvs/")

# ================================================
# INSTRUCCIONES POWER BI
# ================================================
print("\n--- INSTRUCCIONES PARA IMPORTAR EN POWER BI ---")
instrucciones = """
  1. Abrir Power BI Desktop
  2. Inicio → Obtener Datos → Excel/CSV
  3. Navegar a: datos_powerbi_ecuador.xlsx
  4. Seleccionar TODAS las hojas y cargar

  5. Vista de Modelo → Crear relaciones:
     fact_Ventas[FechaKey]     → dim_Fecha[FechaKey]     (Muchos a 1)
     fact_Ventas[ProductoKey]  → dim_Producto[ProductoKey] (Muchos a 1)
     fact_Ventas[ClienteKey]   → dim_Cliente[ClienteKey]  (Muchos a 1)
     fact_Ventas[VendedorKey]  → dim_Vendedor[VendedorKey](Muchos a 1)

  6. Crear medidas DAX:
     Total Ventas = SUM(fact_Ventas[MontoNeto])
     Total Margen = SUM(fact_Ventas[Margen])
     % Margen = DIVIDE([Total Margen], [Total Ventas])
     AOV = DIVIDE([Total Ventas], COUNTROWS(fact_Ventas))

  7. Crear visualizaciones:
     - Tarjeta: Total Ventas
     - Grafico lineas: Ventas por Mes (usar dim_Fecha[MesNombre])
     - Grafico barras: Ventas por Categoria
     - Mapa: Ventas por Provincia
     - Tabla: Top 10 Clientes
"""
print(instrucciones)

# ================================================
# MEDIDAS DAX PARA POWER BI
# ================================================
print("--- MEDIDAS DAX ESENCIALES ---")
medidas_dax = {
    "Total Ventas":        "Total Ventas = SUM(fact_Ventas[MontoNeto])",
    "Total Margen":        "Total Margen = SUM(fact_Ventas[Margen])",
    "% Margen":            "% Margen = DIVIDE([Total Margen], [Total Ventas], 0)",
    "AOV":                 "AOV = DIVIDE([Total Ventas], COUNTROWS(fact_Ventas), 0)",
    "Vs Mes Anterior":     "Ventas MoM = [Total Ventas] - CALCULATE([Total Ventas], PREVIOUSMONTH(dim_Fecha[Fecha]))",
    "% Cambio MoM":        "% MoM = DIVIDE([Ventas MoM], CALCULATE([Total Ventas], PREVIOUSMONTH(dim_Fecha[Fecha])))",
    "Ventas YTD":          "Ventas YTD = TOTALYTD([Total Ventas], dim_Fecha[Fecha])",
    "Ranking Producto":    "Rank Producto = RANKX(ALL(dim_Producto[Nombre]), [Total Ventas],,DESC)",
}
for nombre, formula in medidas_dax.items():
    print(f"  {nombre:<20}: {formula}")

print("\n" + "=" * 65)
print(f"  Archivos generados: {output_file} y carpeta powerbi_csvs/")
print(f"  Modelo estrella: 4 dims + 1 fact = {len(fact_ventas):,} hechos")
print("=" * 65)
```

4. Importa el archivo `datos_powerbi_ecuador.xlsx` en Power BI Desktop.

5. Crea las relaciones del modelo estrella segun las instrucciones.

6. Implementa las 4 medidas DAX basicas y crea un dashboard con al menos 5 visualizaciones.

## Usa IA para...

> Abre Gemini y escribe:
> "Tengo un modelo estrella en Power BI con ventas de distribuidor Ecuador. ¿Como escribo una medida DAX que calcule las ventas del mes actual vs el mismo mes del anio anterior (YoY)? ¿Y como creo una tabla de top 10 clientes que cambie segun los filtros del dashboard?"

Despues de leer la respuesta:
- Implementa la medida YoY en Power BI.
- Crea la tabla de top 10 clientes dinamica.

## Que aprendiste

- Power BI requiere un modelo de datos estrella con claves (Keys) para crear relaciones.
- La tabla de fechas (dim_Fecha) es fundamental y debe tener todos los atributos temporales.
- DAX (Data Analysis Expressions) es el lenguaje de formulas de Power BI.
- `pd.ExcelWriter` exporta multiples DataFrames a distintas hojas de un mismo archivo Excel.
- Las medidas DAX calculan KPIs de forma dinamica segun los filtros del dashboard.
- `PREVIOUSMONTH`, `TOTALYTD` y `RANKX` son funciones DAX de tiempo y clasificacion clave.

## Reto extra

Crea un dashboard Power BI completo con: 1) pagina de resumen ejecutivo con 6 KPIs, 2) pagina de analisis de ventas con drill-through por fecha/categoria/provincia, 3) pagina de rendimiento de vendedores con semaforo RAG segun cumplimiento de meta. Publica el reporte en Power BI Service (gratis hasta 1GB) y comparte el link.
