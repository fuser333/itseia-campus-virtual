# Ejercicio Sesion 2: Esquema Estrella y Copo de Nieve

**Materia:** Data Warehousing y ETL
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Disenir e implementar esquemas estrella y copo de nieve para un data warehouse de ventas ecuatoriano, entendiendo tablas de hechos, dimensiones, y las ventajas de cada modelo.

## Contexto

El esquema estrella es el patron de diseno mas importante de un data warehouse. En lugar de normalizar para evitar redundancia (como en OLTP), el DW desnormaliza para acelerar las consultas analiticas. Corporacion El Rosado en Ecuador probablemente tiene un esquema estrella donde la tabla de hechos de ventas se relaciona con dimensiones de tiempo, producto, tienda y cliente. Este ejercicio te ensena a disenarlo.

## Instrucciones

1. Crea el archivo `sesion02_esquema_estrella_ecuador.py`.

2. Ejecuta el siguiente codigo:

```python
# Esquema Estrella y Copo de Nieve - ITSEIA
# Data Warehouse: ventas retail Ecuador
# Implementacion en SQLite (equivalente a cualquier DW)

import sqlite3
import random
from datetime import date, timedelta

random.seed(2026)
print("=" * 65)
print("ESQUEMAS DW — VENTAS RETAIL ECUADOR")
print("Estrella vs Copo de Nieve")
print("=" * 65)

conn = sqlite3.connect(":memory:")
cursor = conn.cursor()

# ================================================
# ESQUEMA ESTRELLA
# Una tabla de hechos central rodeada de dimensiones
# ================================================
print("\n[ESTRELLA] Creando schema de ventas retail Ecuador...")

# DIMENSION TIEMPO
cursor.execute("""
    CREATE TABLE dim_tiempo (
        tiempo_id     INTEGER PRIMARY KEY,
        fecha         TEXT,
        anio          INTEGER,
        trimestre     INTEGER,
        mes           INTEGER,
        mes_nombre    TEXT,
        semana        INTEGER,
        dia_semana    INTEGER,
        dia_nombre    TEXT,
        es_feriado    INTEGER,
        es_fin_semana INTEGER
    )
""")

# DIMENSION PRODUCTO (desnormalizada — incluye categoria y marca)
cursor.execute("""
    CREATE TABLE dim_producto (
        producto_id   INTEGER PRIMARY KEY,
        codigo_sku    TEXT,
        nombre        TEXT,
        categoria     TEXT,
        subcategoria  TEXT,
        marca         TEXT,
        pais_origen   TEXT,
        precio_lista  REAL
    )
""")

# DIMENSION TIENDA
cursor.execute("""
    CREATE TABLE dim_tienda (
        tienda_id     INTEGER PRIMARY KEY,
        codigo_tienda TEXT,
        nombre        TEXT,
        cadena        TEXT,
        provincia     TEXT,
        ciudad        TEXT,
        tipo          TEXT,
        metros2       INTEGER
    )
""")

# DIMENSION CLIENTE (con SCD tipo 1 - overwrite)
cursor.execute("""
    CREATE TABLE dim_cliente (
        cliente_id    INTEGER PRIMARY KEY,
        cedula        TEXT,
        nombre        TEXT,
        segmento      TEXT,
        edad_grupo    TEXT,
        provincia     TEXT,
        canal_adq     TEXT
    )
""")

# TABLA DE HECHOS (centro de la estrella)
cursor.execute("""
    CREATE TABLE fact_ventas (
        venta_id      INTEGER PRIMARY KEY,
        tiempo_id     INTEGER REFERENCES dim_tiempo(tiempo_id),
        producto_id   INTEGER REFERENCES dim_producto(producto_id),
        tienda_id     INTEGER REFERENCES dim_tienda(tienda_id),
        cliente_id    INTEGER REFERENCES dim_cliente(cliente_id),
        -- METRICAS (los numeros que quieres analizar)
        cantidad      INTEGER,
        precio_venta  REAL,
        descuento_pct REAL,
        monto_bruto   REAL,
        monto_neto    REAL,
        costo_producto REAL,
        margen        REAL
    )
""")

print("  Tablas creadas: dim_tiempo, dim_producto, dim_tienda, dim_cliente, fact_ventas")

# ================================================
# POBLAR DIMENSIONES
# ================================================

# Dim Tiempo: 365 dias del 2024
base = date(2024, 1, 1)
meses_nombres = ["","Enero","Febrero","Marzo","Abril","Mayo","Junio",
                 "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
dias_nombres = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"]
feriados_ecuador_2024 = ["2024-01-01","2024-02-12","2024-02-13","2024-04-29",
                          "2024-05-01","2024-05-24","2024-08-10","2024-10-09",
                          "2024-11-02","2024-11-03","2024-12-25"]

for i in range(365):
    d = base + timedelta(days=i)
    fecha_str = d.strftime("%Y-%m-%d")
    dow = d.weekday()
    cursor.execute("INSERT INTO dim_tiempo VALUES (?,?,?,?,?,?,?,?,?,?,?)", (
        i + 1, fecha_str, d.year,
        (d.month - 1) // 3 + 1,
        d.month, meses_nombres[d.month],
        d.isocalendar()[1],
        dow, dias_nombres[dow],
        1 if fecha_str in feriados_ecuador_2024 else 0,
        1 if dow >= 5 else 0
    ))

# Dim Producto
productos_data = [
    (1,"SKU-001","Arroz Diana 1kg","Abarrotes","Graños","Diana","Ecuador",1.25),
    (2,"SKU-002","Aceite Girasol 1L","Abarrotes","Aceites","La Favorita","Ecuador",3.45),
    (3,"SKU-003","Leche Toni 1L","Lacteos","Leche","Toni","Ecuador",1.15),
    (4,"SKU-004","Pollo entero 1kg","Carnes","Pollo","Pronaca","Ecuador",4.20),
    (5,"SKU-005","Shampoo Head&Shoulders","Personal","Cabello","P&G","USA",8.50),
    (6,"SKU-006","Coca-Cola 2L","Bebidas","Gaseosas","The Coca-Cola Co","USA",2.10),
    (7,"SKU-007","Pan de molde","Panaderia","Pan","Bimbo","Mexico",2.30),
    (8,"SKU-008","Detergente Deja 1kg","Limpieza","Ropa","Unilever","Ecuador",2.80),
]
cursor.executemany("INSERT INTO dim_producto VALUES (?,?,?,?,?,?,?,?)", productos_data)

# Dim Tienda
tiendas_data = [
    (1,"TDA-001","Supermaxi Quito Norte","Supermaxi","Pichincha","Quito","supermercado",3500),
    (2,"TDA-002","Supermaxi Guayaquil Sur","Supermaxi","Guayas","Guayaquil","supermercado",2800),
    (3,"TDA-003","Mi Comisariato Kennedy","Mi Comisariato","Guayas","Guayaquil","supermercado",2200),
    (4,"TDA-004","Tia Cuenca","Tia","Azuay","Cuenca","supermercado",1800),
    (5,"TDA-005","Gran Aki Ambato","Gran Aki","Tungurahua","Ambato","hipermercado",4200),
]
cursor.executemany("INSERT INTO dim_tienda VALUES (?,?,?,?,?,?,?,?)", tiendas_data)

# Dim Cliente
clientes_data = [
    (1,"1720001","Ana Quispe","frecuente","25-34","Pichincha","digital"),
    (2,"0912345","Diego Mora","ocasional","35-44","Guayas","fisico"),
    (3,"1802345","Sofia Torres","frecuente","18-24","Azuay","digital"),
    (4,"0601234","Luis Vera","leal","45-54","Tungurahua","fisico"),
    (5,"1712345","Maria Jara","frecuente","25-34","Pichincha","digital"),
]
cursor.executemany("INSERT INTO dim_cliente VALUES (?,?,?,?,?,?,?)", clientes_data)

# Tabla de Hechos: 500 ventas simuladas
ventas = []
for i in range(500):
    prod = random.choice(productos_data)
    cant = random.randint(1, 5)
    desc_pct = random.choice([0, 0, 0, 5, 10, 15])
    precio = prod[7] * random.uniform(0.95, 1.05)
    bruto = cant * precio
    neto = bruto * (1 - desc_pct / 100)
    costo = neto * random.uniform(0.55, 0.75)
    margen = neto - costo
    ventas.append((
        i + 1,
        random.randint(1, 365),    # tiempo_id
        prod[0],                    # producto_id
        random.randint(1, 5),       # tienda_id
        random.randint(1, 5),       # cliente_id
        cant, round(precio, 2), desc_pct,
        round(bruto, 2), round(neto, 2),
        round(costo, 2), round(margen, 2)
    ))
cursor.executemany("INSERT INTO fact_ventas VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", ventas)
conn.commit()
print(f"  Datos insertados: 365 dias, {len(productos_data)} productos, "
      f"{len(tiendas_data)} tiendas, {len(clientes_data)} clientes, 500 ventas")

# ================================================
# QUERIES ANALITICAS (el poder del esquema estrella)
# ================================================
print("\n--- QUERIES ANALITICAS SOBRE ESQUEMA ESTRELLA ---")

# Q1: ventas por mes
print("\n  Q1: Ventas por mes 2024")
cursor.execute("""
    SELECT t.mes, t.mes_nombre,
           COUNT(*)            as num_ventas,
           SUM(f.monto_neto)   as ingresos,
           SUM(f.margen)       as margen_total,
           AVG(f.monto_neto)   as ticket_promedio
    FROM fact_ventas f
    JOIN dim_tiempo t ON f.tiempo_id = t.tiempo_id
    GROUP BY t.mes, t.mes_nombre
    ORDER BY t.mes
""")
print(f"  {'Mes':<12} {'Ventas':>8} {'Ingresos':>12} {'Margen':>12} {'Ticket':>10}")
for row in cursor.fetchall():
    print(f"  {row[1]:<12} {row[2]:>8} ${row[3]:>10,.2f} ${row[4]:>10,.2f} ${row[5]:>8,.2f}")

# Q2: top productos por margen
print("\n  Q2: Top 5 productos por margen total")
cursor.execute("""
    SELECT p.nombre, p.categoria,
           SUM(f.cantidad)   as unidades,
           SUM(f.monto_neto) as ingresos,
           SUM(f.margen)     as margen_total,
           AVG(f.descuento_pct) as desc_promedio
    FROM fact_ventas f
    JOIN dim_producto p ON f.producto_id = p.producto_id
    GROUP BY p.nombre, p.categoria
    ORDER BY margen_total DESC
    LIMIT 5
""")
print(f"  {'Producto':<25} {'Categoria':<12} {'Margen':>12} {'Ingresos':>12}")
for row in cursor.fetchall():
    print(f"  {row[0]:<25} {row[1]:<12} ${row[4]:>10,.2f} ${row[3]:>10,.2f}")

# Q3: rendimiento por tienda y provincia
print("\n  Q3: Rendimiento por tienda")
cursor.execute("""
    SELECT ti.nombre, ti.provincia,
           COUNT(*)          as ventas,
           SUM(f.monto_neto) as ingresos,
           SUM(f.margen)     as margen,
           SUM(f.margen)*100.0/SUM(f.monto_neto) as margen_pct
    FROM fact_ventas f
    JOIN dim_tienda ti ON f.tienda_id = ti.tienda_id
    GROUP BY ti.nombre, ti.provincia
    ORDER BY ingresos DESC
""")
print(f"  {'Tienda':<30} {'Provincia':<12} {'Ventas':>7} {'Ingresos':>12} {'Margen%':>8}")
for row in cursor.fetchall():
    print(f"  {row[0]:<30} {row[1]:<12} {row[2]:>7} ${row[3]:>10,.2f} {row[5]:>7.1f}%")

# ================================================
# COPO DE NIEVE: normalizar dimensiones
# ================================================
print("\n--- ESQUEMA COPO DE NIEVE ---")
print("  Diferencia: las dimensiones se normalizan en subdimensiones")

copo_nieve_sql = """
  -- En lugar de dim_producto con categoria+marca directamente,
  -- el copo de nieve crea tablas separadas:

  CREATE TABLE dim_categoria (
      categoria_id   INT PRIMARY KEY,
      nombre         TEXT,
      departamento   TEXT
  );

  CREATE TABLE dim_marca (
      marca_id       INT PRIMARY KEY,
      nombre         TEXT,
      pais_origen    TEXT
  );

  CREATE TABLE dim_producto_normalizada (
      producto_id    INT PRIMARY KEY,
      codigo_sku     TEXT,
      nombre         TEXT,
      categoria_id   INT REFERENCES dim_categoria,
      marca_id       INT REFERENCES dim_marca,
      precio_lista   REAL
  );

  -- Requiere JOINs adicionales en las queries:
  -- fact_ventas JOIN dim_producto JOIN dim_categoria JOIN dim_marca
"""
print(copo_nieve_sql)

print("--- CUANDO USAR CADA ESQUEMA ---")
print("  ESTRELLA:      Queries mas simples, mejor performance, mas espacio")
print("  COPO DE NIEVE: Menos redundancia, mas complejo, mas JOINs")
print("  REGLA PRACTICA: Empieza con estrella. Normaliza solo si necesitas.")

conn.close()
print("\n" + "=" * 65)
```

3. Ejecuta y analiza los resultados de las 3 queries analiticas.

4. Agrega una query Q4 que calcule las ventas de fin de semana vs dias de semana, filtrando por el campo `es_fin_semana` de `dim_tiempo`.

## Usa IA para...

> Abre Claude y escribe:
> "Soy analista de datos en una cadena de supermercados Ecuador. Tengo una tabla de hechos de ventas con dimensiones de tiempo, producto, tienda y cliente. ¿Como diseño el esquema de dimensiones SCD (Slowly Changing Dimensions) tipo 2 para guardar el historial cuando un cliente cambia de segmento (de 'ocasional' a 'frecuente')? Explica con SQL."

Despues de leer la respuesta:
- Implementa SCD tipo 2 para `dim_cliente` en el ejercicio.
- Agrega columnas `fecha_inicio`, `fecha_fin` y `es_actual` a la dimension.

## Que aprendiste

- El esquema estrella tiene una tabla de hechos central rodeada de dimensiones desnormalizadas.
- La tabla de hechos almacena metricas numericas (cantidad, monto, margen) y claves foraneas.
- Las dimensiones almacenan el contexto descriptivo (quien, que, cuando, donde).
- El esquema copo de nieve normaliza las dimensiones en subdimensiones — menos redundancia pero mas JOINs.
- SCD (Slowly Changing Dimensions): tipo 1 sobreescribe, tipo 2 guarda historial con fechas de vigencia.
- La estrella es el gold standard para data warehouses en la mayoria de empresas ecuatorianas.

## Reto extra

Disena un esquema estrella para el Ministerio de Educacion Ecuador: analizar resultados de las pruebas SER BACHILLER por anio, provincia, tipo de colegio (fiscal/privado/fiscomisional) y area de conocimiento. Define la tabla de hechos con sus metricas y las 4 dimensiones. Implementa en SQLite y crea una query que muestre el top 5 de provincias por puntaje promedio en matematicas en los ultimos 3 anios.
