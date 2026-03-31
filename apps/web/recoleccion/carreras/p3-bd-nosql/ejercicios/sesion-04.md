# Ejercicio Sesion 4: Queries Avanzados MongoDB

**Materia:** Bases de Datos NoSQL
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Dominar los operadores de consulta avanzados de MongoDB: comparacion, logicos, arrays, expresiones regulares, aggregation pipeline, y proyecciones, aplicados a datos de ventas de una empresa ecuatoriana.

## Contexto

Las consultas basicas `find({campo: valor})` solo cubren el 20% de los casos reales. El otro 80% requiere operadores como `$gte`, `$in`, `$or`, `$regex` y el potente aggregation pipeline — equivalente a GROUP BY + JOINs de SQL pero en MongoDB. Una empresa ecuatoriana de retail como Fybeca necesita: "ventas del mes, por categoria, en Pichincha, donde el monto > $50". Eso es aggregation pipeline.

## Instrucciones

1. Crea el archivo `sesion04_queries_avanzados_mongodb.py`:

```python
# Queries Avanzados MongoDB - ITSEIA
# Dataset: Ventas farmacias Ecuador 2024
# Operadores: comparacion, logicos, arrays, regex, aggregation

print("=" * 65)
print("QUERIES AVANZADOS MONGODB — VENTAS FYBECA ECUADOR")
print("=" * 65)

# ================================================
# DATOS SIMULADOS: documentos de ventas
# (Estructura identica a MongoDB real)
# ================================================
import json
from datetime import datetime, timedelta
import random

random.seed(2026)

meses = ["2024-01","2024-02","2024-03","2024-04","2024-05","2024-06"]
provincias = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua"]
categorias = ["antibioticos","analgesicos","vitaminas","dermatologia","cardiologia"]
farmacias = ["Fybeca","Cruz Azul","Sana Sana","Pharmacys","Medicity"]

ventas_raw = []
for i in range(200):
    fecha = datetime(2024, random.randint(1,6), random.randint(1,28))
    cat = random.choice(categorias)
    prov = random.choice(provincias)
    ventas_raw.append({
        "_id": f"VTA-{i:04d}",
        "fecha": fecha.strftime("%Y-%m-%d"),
        "mes": fecha.strftime("%Y-%m"),
        "provincia": prov,
        "farmacia_cadena": random.choice(farmacias),
        "producto": {
            "codigo": f"MED{random.randint(1000,9999)}",
            "nombre": f"Medicamento_{i}",
            "categoria": cat,
            "requiere_receta": cat in ["antibioticos","cardiologia"]
        },
        "cantidad": random.randint(1, 10),
        "precio_unitario": round(random.uniform(2.5, 85.0), 2),
        "monto_total": 0,  # calculado abajo
        "metodo_pago": random.choice(["efectivo","tarjeta","transferencia"]),
        "descuento_pct": random.choice([0, 0, 0, 5, 10, 15]),
        "empleado_id": f"EMP{random.randint(100, 150):03d}",
        "calificacion_cliente": random.randint(3, 5) if random.random() > 0.3 else None
    })
    v = ventas_raw[-1]
    bruto = v["cantidad"] * v["precio_unitario"]
    v["monto_total"] = round(bruto * (1 - v["descuento_pct"] / 100), 2)

print(f"Dataset generado: {len(ventas_raw)} ventas\n")

# ================================================
# FUNCION HELPER: simula find() con operadores MongoDB
# ================================================
def mongo_find(coleccion, filtro=None, proyeccion=None, sort=None, limit=None):
    """Simula consultas MongoDB con operadores basicos."""
    result = list(coleccion)
    if filtro:
        def coincide(doc):
            for campo, condicion in filtro.items():
                if campo == "$or":
                    if not any(coincide_simple(doc, sub) for sub in condicion):
                        return False
                elif campo == "$and":
                    if not all(coincide(doc) for doc in [doc]):
                        pass  # simplificado
                elif isinstance(condicion, dict):
                    val = doc
                    for part in campo.split("."):
                        if isinstance(val, dict):
                            val = val.get(part)
                        else:
                            val = None
                    for op, v in condicion.items():
                        if op == "$gte" and not (val is not None and val >= v): return False
                        if op == "$lte" and not (val is not None and val <= v): return False
                        if op == "$gt"  and not (val is not None and val > v):  return False
                        if op == "$lt"  and not (val is not None and val < v):  return False
                        if op == "$ne"  and not (val != v): return False
                        if op == "$in"  and not (val in v): return False
                        if op == "$nin" and val in v:       return False
                        if op == "$exists" and (val is None) == v: return False
                else:
                    val = doc
                    for part in campo.split("."):
                        if isinstance(val, dict):
                            val = val.get(part)
                        else:
                            val = None
                    if val != condicion:
                        return False
            return True

        def coincide_simple(doc, filtro_simple):
            for campo, condicion in filtro_simple.items():
                val = doc.get(campo)
                if isinstance(condicion, dict):
                    for op, v in condicion.items():
                        if op == "$gte" and not (val is not None and val >= v): return False
                else:
                    if val != condicion:
                        return False
            return True

        result = [doc for doc in result if coincide(doc)]
    if sort:
        campo_sort, orden = list(sort.items())[0]
        result = sorted(result, key=lambda x: x.get(campo_sort) or 0, reverse=(orden == -1))
    if limit:
        result = result[:limit]
    return result

# ================================================
# OPERADORES DE COMPARACION
# ================================================
print("--- OPERADORES DE COMPARACION ---")

# $gte: ventas con monto >= $50
altas = mongo_find(ventas_raw, {"monto_total": {"$gte": 50}})
print(f"  $gte 50: {len(altas)} ventas con monto >= $50")
print(f"  Sintaxis: db.ventas.find({{monto_total: {{$gte: 50}}}})")

# $in: solo antibioticos o cardiologia
receta = mongo_find(ventas_raw, {"producto.categoria": {"$in": ["antibioticos","cardiologia"]}})
print(f"\n  $in categorias con receta: {len(receta)} ventas")
print(f"  Sintaxis: db.ventas.find({{\"producto.categoria\": {{$in: ['antibioticos','cardiologia']}}}})")

# Rango: monto entre 20 y 60
rango = mongo_find(ventas_raw, {"monto_total": {"$gte": 20, "$lte": 60}})
print(f"\n  $gte AND $lte (rango $20-$60): {len(rango)} ventas")

# ================================================
# OPERADORES LOGICOS
# ================================================
print("\n--- OPERADORES LOGICOS ---")

# $or: Pichincha O monto > $80
or_filtro = [
    {"provincia": "Pichincha"},
    {"monto_total": {"$gte": 80}}
]
print(f"  $or Pichincha o monto>80: (ver db.ventas.find({{$or: [...]}}))")

# Combinar: Guayas Y vitaminas
guayas_vit = [v for v in ventas_raw
              if v["provincia"] == "Guayas" and v["producto"]["categoria"] == "vitaminas"]
print(f"  Guayas Y vitaminas: {len(guayas_vit)} ventas")
print(f"  Sintaxis: db.ventas.find({{provincia:'Guayas', 'producto.categoria':'vitaminas'}})")

# ================================================
# AGGREGATION PIPELINE
# ================================================
print("\n--- AGGREGATION PIPELINE ---")
print("  Equivalente a: SELECT mes, SUM(monto), COUNT(*) FROM ventas GROUP BY mes")

# Simulacion de $group + $sum + $avg
from collections import defaultdict

# Pipeline 1: ventas totales por mes
ventas_por_mes = defaultdict(lambda: {"total": 0, "count": 0})
for v in ventas_raw:
    ventas_por_mes[v["mes"]]["total"] += v["monto_total"]
    ventas_por_mes[v["mes"]]["count"] += 1

print("\n  Pipeline 1: Ventas por mes")
print("""
  db.ventas.aggregate([
    {$group: {_id: "$mes", total_ventas: {$sum: "$monto_total"}, num_ventas: {$sum: 1}}},
    {$sort: {_id: 1}}
  ])
  """)
for mes in sorted(ventas_por_mes.keys()):
    d = ventas_por_mes[mes]
    print(f"    {mes}: ${d['total']:,.2f} en {d['count']} ventas")

# Pipeline 2: promedio por categoria
ventas_cat = defaultdict(lambda: {"total": 0, "count": 0})
for v in ventas_raw:
    cat = v["producto"]["categoria"]
    ventas_cat[cat]["total"] += v["monto_total"]
    ventas_cat[cat]["count"] += 1

print("\n  Pipeline 2: Promedio ticket por categoria")
print("""
  db.ventas.aggregate([
    {$group: {_id: "$producto.categoria", promedio: {$avg: "$monto_total"}, total: {$sum: "$monto_total"}}},
    {$sort: {promedio: -1}}
  ])
  """)
for cat, d in sorted(ventas_cat.items(), key=lambda x: x[1]["total"]/x[1]["count"], reverse=True):
    prom = d["total"] / d["count"]
    print(f"    {cat:<18}: promedio ${prom:,.2f} | total ${d['total']:,.2f}")

# Pipeline 3: provincia con mas ventas
ventas_prov = defaultdict(float)
for v in ventas_raw:
    ventas_prov[v["provincia"]] += v["monto_total"]

print("\n  Pipeline 3: Ranking provincias por ingresos")
for prov, total in sorted(ventas_prov.items(), key=lambda x: x[1], reverse=True):
    barra = "#" * int(total / 500)
    print(f"    {prov:<15}: ${total:,.2f} {barra}")

# ================================================
# PROYECCIONES: seleccionar campos especificos
# ================================================
print("\n--- PROYECCIONES (equivale a SELECT columnas) ---")
print("  Solo nombre del producto, monto y provincia:")
print("  db.ventas.find({}, {_id:0, 'producto.nombre':1, monto_total:1, provincia:1})")
for v in ventas_raw[:3]:
    print(f"    {v['producto']['nombre']} | ${v['monto_total']} | {v['provincia']}")

print("\n" + "=" * 65)
print("OPERADORES MONGODB CLAVE:")
ops = [("$eq/$ne","igual / distinto"),("$gt/$gte","mayor / mayor-igual"),
       ("$lt/$lte","menor / menor-igual"),("$in/$nin","en lista / no en lista"),
       ("$or/$and","OR logico / AND logico"),("$exists","campo existe"),
       ("$regex","patron texto"),("$group","agrupar (aggregation)"),
       ("$match","filtrar (aggregation)"),("$sort","ordenar"),("$limit","limitar resultados")]
for op, desc in ops:
    print(f"  {op:<15}: {desc}")
print("=" * 65)
```

2. Ejecuta el codigo y analiza los resultados del aggregation pipeline.

3. Implementa un query adicional: "Top 3 empleados con mayor monto de ventas en el mes de Marzo 2024".

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo una coleccion MongoDB de ventas de farmacia Ecuador con campos: provincia, producto.categoria, monto_total, fecha, empleado_id. Escribe un aggregation pipeline que muestre: por provincia, el mes con mas ventas, el promedio de descuento aplicado, y el top producto. Explica cada etapa del pipeline."

Despues de leer la respuesta:
- Implementa el pipeline en Python simulado del ejercicio.
- Identifica las etapas `$match`, `$group`, `$sort` y `$project` en el codigo.

## Que aprendiste

- Los operadores de comparacion usan prefijo `$`: `$gte`, `$lte`, `$in`, `$ne`.
- `$or` y `$and` combinan condiciones logicas.
- La notacion de punto `"campo.subcampo"` accede a documentos anidados.
- El aggregation pipeline procesa documentos en etapas secuenciales: `$match` → `$group` → `$sort`.
- Las proyecciones usan 1 para incluir y 0 para excluir campos en el resultado.
- `$group` con `$sum` y `$avg` son los equivalentes de SUM() y AVG() de SQL.

## Reto extra

Implementa un query de "cohort analysis": agrupa los clientes por su mes de primera compra (cohorte) y calcula el ticket promedio y la frecuencia de compra de cada cohorte. Este analisis es clave para equipos de marketing en empresas ecuatorianas de retail. Usa el aggregation pipeline real de MongoDB Atlas para ejecutarlo.
