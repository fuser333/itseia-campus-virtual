# Ejercicio Sesion 1: SQL vs NoSQL — Cuando Usar Cual

**Materia:** Bases de Datos NoSQL
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 25 min

## Objetivo

Entender las diferencias fundamentales entre bases de datos SQL y NoSQL, identificar los casos de uso de cada tipo, y decidir cual usar para cinco escenarios reales de empresas ecuatorianas.

## Contexto

En Ecuador, el 85% de las empresas que digitalizan sus operaciones enfrenta la misma pregunta: MySQL o MongoDB? La respuesta no es universal — depende del tipo de datos, la velocidad de cambio del esquema y la escala. Una farmacia en Quito que lleva inventario necesita SQL. Una app de delivery que guarda pedidos con estructuras variables necesita NoSQL.

## Instrucciones

1. Crea el archivo `sesion01_sql_vs_nosql_ecuador.py`.

2. Ejecuta este codigo comparativo:

```python
# SQL vs NoSQL - ITSEIA Bases de Datos
# Comparacion practica con simulaciones Python
# Contexto: empresas Ecuador 2024

import json
import sqlite3
import os
from datetime import datetime

print("=" * 65)
print("SQL vs NoSQL — CUANDO USAR CUAL")
print("Contexto: Sistemas de informacion Ecuador")
print("=" * 65)

# ================================================
# CASO 1: SISTEMA DE NOMINA (SQL — estructura fija)
# Empresa: Corporacion el Rosado Ecuador
# ================================================
print("\n--- CASO 1: NOMINA CORPORACION EL ROSADO (SQL) ---")

conn = sqlite3.connect(":memory:")
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE empleados (
        id INTEGER PRIMARY KEY,
        cedula TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        departamento TEXT,
        salario REAL,
        fecha_ingreso TEXT
    )
""")

empleados = [
    (1, "1720001001", "Maria Quispe", "Ventas",        620.00, "2022-03-15"),
    (2, "0912345678", "Diego Mora",   "Tecnologia",    1850.00, "2021-07-01"),
    (3, "1802345671", "Ana Torres",   "RRHH",           720.00, "2023-01-10"),
    (4, "0601234567", "Luis Vera",    "Contabilidad",   850.00, "2020-05-20"),
    (5, "1712345678", "Sofia Jara",   "Ventas",         620.00, "2024-02-01"),
]
cursor.executemany("INSERT INTO empleados VALUES (?,?,?,?,?,?)", empleados)
conn.commit()

# Consulta SQL tipica
cursor.execute("""
    SELECT departamento, COUNT(*) as total, AVG(salario) as promedio_salario
    FROM empleados
    GROUP BY departamento
    ORDER BY promedio_salario DESC
""")
print("  Nomina por departamento:")
for row in cursor.fetchall():
    print(f"    {row[0]:<15}: {row[1]} empleados | Promedio: ${row[2]:,.2f}")

print("\n  Por que SQL para nomina?")
print("  + Schema fijo: cada empleado tiene EXACTAMENTE los mismos campos")
print("  + ACID: las transacciones de pago deben ser exactas")
print("  + JOINs: relacionar empleados con roles, departamentos, pagos")
print("  + Reportes regulatorios (IESS, SRI) requieren estructura predecible")

conn.close()

# ================================================
# CASO 2: CATALOGO PRODUCTOS (NoSQL — esquema flexible)
# Empresa: tienda online Ecuador (tipo Promart)
# ================================================
print("\n--- CASO 2: CATALOGO PRODUCTOS TIENDA ONLINE (NoSQL) ---")

# Simulacion de documentos MongoDB-style en Python dicts
catalogo = [
    {
        "_id": "PROD001",
        "nombre": "Laptop HP 15",
        "categoria": "tecnologia",
        "precio": 850.00,
        "marca": "HP",
        "especificaciones": {
            "procesador": "Intel Core i5",
            "ram": "8GB",
            "almacenamiento": "512GB SSD",
            "pantalla": "15.6 pulgadas"
        },
        "stock": {"Quito": 12, "Guayaquil": 8, "Cuenca": 3},
        "tags": ["laptop", "trabajo", "estudiantes"],
        "activo": True
    },
    {
        "_id": "PROD002",
        "nombre": "Camiseta Nike Dri-FIT",
        "categoria": "ropa_deportiva",
        "precio": 45.00,
        "marca": "Nike",
        "especificaciones": {
            "tallas_disponibles": ["S", "M", "L", "XL"],
            "colores": ["azul marino", "negro", "blanco"],
            "material": "92% poliester, 8% elastano"
        },
        "stock": {"Quito": 45, "Guayaquil": 30},
        "tags": ["deporte", "gym", "casual"],
        "activo": True
    },
    {
        "_id": "PROD003",
        "nombre": "Saco de Papa 100lb",
        "categoria": "abarrotes",
        "precio": 28.00,
        "origen": "Carchi, Ecuador",
        "especificaciones": {
            "peso_neto_lb": 100,
            "variedad": "superchola",
            "cosecha": "2024"
        },
        "stock": {"Quito": 200, "Ambato": 350},
        "activo": True
    }
]

print("  Productos en catalogo (JSON-style):")
for prod in catalogo:
    specs_keys = list(prod["especificaciones"].keys())
    print(f"  [{prod['_id']}] {prod['nombre']:<30} | specs: {specs_keys}")

print("\n  Por que NoSQL para catalogo?")
print("  + Cada producto tiene DISTINTOS atributos (laptop vs ropa vs papa)")
print("  + Schema-less: puedes agregar campos sin ALTER TABLE")
print("  + Arrays y objetos anidados nativos: stock por ciudad, tags")
print("  + Escala horizontal para millones de productos")

# ================================================
# TABLA COMPARATIVA
# ================================================
print("\n--- TABLA COMPARATIVA SQL vs NoSQL ---")
comparativa = [
    ("Aspecto",           "SQL (PostgreSQL/MySQL)",    "NoSQL (MongoDB/Redis)"),
    ("Estructura",        "Tablas + columnas fijas",   "Documentos/clave-valor"),
    ("Schema",            "Rigido (define antes)",     "Flexible (schema-less)"),
    ("Consultas",         "SQL estandar",              "Query language propio"),
    ("ACID",              "Si (transacciones)",        "BASE (eventual consist.)"),
    ("Escalabilidad",     "Vertical (mas RAM/CPU)",    "Horizontal (mas nodos)"),
    ("Relaciones",        "JOINs nativos",             "Embebido o referencia"),
    ("Mejor para",        "Finanzas, RRHH, ERP",       "Catalogo, IoT, social"),
    ("Ejemplos Ecuador",  "SRI, IESS, nominas",        "Apps delivery, ecommerce"),
]

col1, col2, col3 = 22, 28, 28
print(f"  {'ASPECTO':<{col1}} {'SQL':<{col2}} {'NoSQL':<{col3}}")
print("  " + "-" * (col1 + col2 + col3))
for row in comparativa[1:]:
    print(f"  {row[0]:<{col1}} {row[1]:<{col2}} {row[2]:<{col3}}")

# ================================================
# ESCENARIOS ECUADOR: decide cual usar
# ================================================
print("\n--- EJERCICIO: DECIDE PARA CADA ESCENARIO ECUADOR ---")
escenarios = [
    ("Sistema de declaraciones SRI",           "SQL",   "Transacciones ACID, schema fijo"),
    ("App de pedidos a domicilio",             "NoSQL", "Pedidos con items variables"),
    ("Red social universitaria ITSEIA",        "NoSQL", "Perfiles y posts heterogeneos"),
    ("Banco Pichincha: cuentas y transferen.", "SQL",   "ACID obligatorio en finanzas"),
    ("Sistema de alertas sismos IGM Ecuador",  "NoSQL", "Series de tiempo, alta velocidad"),
]
for nombre, decision, razon in escenarios:
    print(f"  [{decision}] {nombre}")
    print(f"         Razon: {razon}")
```

3. Ejecuta el codigo. Analiza los resultados.

4. Agrega un sexto escenario propio: una empresa ecuatoriana real que conozcas, decide si usaria SQL o NoSQL y justifica con 2 argumentos.

## Usa IA para...

> Abre ChatGPT y escribe exactamente esto:
> "Dame 3 escenarios de empresas ecuatorianas reales donde claramente usaria MongoDB en lugar de PostgreSQL. Para cada uno explica: el tipo de dato que manejan, por que el esquema flexible es necesario, y que perderian si usaran SQL."

Despues de leer la respuesta:
- Evalua si los escenarios son realistas para Ecuador.
- Agrega uno de esos escenarios al codigo como un nuevo caso.

## Que aprendiste

- SQL es ACID: Atomicity, Consistency, Isolation, Durability — critico para datos financieros.
- NoSQL es BASE: Basically Available, Soft state, Eventual consistency — mejor para escala.
- El tipo de estructura de datos (fija vs variable) es el criterio principal de decision.
- MongoDB almacena documentos JSON anidados — ideal cuando un registro puede tener campos distintos.
- No existe "mejor" — existe "correcto para el caso de uso".
- En la practica muchos sistemas usan ambos: SQL para transacciones + NoSQL para cache y logs.

## Reto extra

Investiga el concepto de "NewSQL" (CockroachDB, Google Spanner). ¿Resuelve el dilema SQL vs NoSQL? Encuentra un caso de uso real en una empresa latinoamericana que use NewSQL y explica por que eligieron esa opcion en lugar de PostgreSQL o MongoDB.
