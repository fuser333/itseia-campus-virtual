# Ejercicio Sesion 8: Proyecto — App con MongoDB, Datos Ecuador

**Materia:** Bases de Datos NoSQL
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 90 min

## Objetivo

Construir una aplicacion completa de gestion de emprendimientos ecuatorianos usando MongoDB como base de datos: schema design, CRUD completo, aggregation pipelines, indices y reportes ejecutivos.

## Contexto

Ecuador tiene mas de 800,000 emprendimientos registrados segun el MIPRO. Este proyecto simula el backend de una plataforma nacional de emprendimientos — tipo "LinkedIn para emprendedores ecuatorianos" — que el Ministerio de Produccion podria usar para mapear el ecosistema emprendedor del pais. Tu construyes la capa de datos completa con MongoDB.

## Instrucciones

1. Crea el archivo `sesion08_proyecto_mongodb_ecuador.py`.

2. Ejecuta el proyecto completo:

```python
# PROYECTO: Plataforma Emprendimientos Ecuador
# MongoDB + pymongo (o simulacion)
# Dataset: 50 emprendimientos reales de 10 provincias
# ITSEIA - Bases de Datos NoSQL - Sesion 8

import json
import random
from datetime import datetime, timedelta
from collections import defaultdict

random.seed(2026)
print("=" * 70)
print("PROYECTO — PLATAFORMA EMPRENDIMIENTOS ECUADOR")
print("Sistema de gestion con MongoDB")
print("=" * 70)

# ================================================
# SCHEMA DESIGN: colecciones del sistema
# ================================================
print("\n[SCHEMA] Colecciones MongoDB:")
schema = {
    "emprendimientos": "Perfil completo de cada empresa (doc principal)",
    "emprendedores": "Perfiles de fundadores con CV y habilidades",
    "inversiones": "Rondas de inversion y montos",
    "eventos": "Eventos del ecosistema (hackathons, ferias)",
    "postulaciones": "Emprendedores que aplican a convocatorias"
}
for col, desc in schema.items():
    print(f"  {col:<20}: {desc}")

# ================================================
# GENERADOR: 50 emprendimientos Ecuador
# ================================================
provincias = ["Pichincha", "Guayas", "Azuay", "Manabi", "Tungurahua",
              "Imbabura", "Loja", "El Oro", "Chimborazo", "Esmeraldas"]
sectores = ["fintech", "edtech", "healthtech", "agritech", "ecommerce",
            "logistica", "turismo", "manufactura", "servicios", "cleantech"]
etapas = ["idea", "mvp", "traccion", "crecimiento", "expansion"]
estados = ["activo", "activo", "activo", "activo", "en_pausa", "cerrado"]

def generar_emprendimiento(idx):
    provincia = random.choice(provincias)
    sector = random.choice(sectores)
    etapa = random.choices(etapas, weights=[10, 25, 30, 25, 10])[0]
    anio_fundacion = random.randint(2018, 2025)
    empleados = {"idea": 1, "mvp": 3, "traccion": 8, "crecimiento": 25, "expansion": 60}[etapa]
    revenue_map = {"idea": 0, "mvp": random.randint(0, 5000),
                   "traccion": random.randint(5000, 50000),
                   "crecimiento": random.randint(50000, 500000),
                   "expansion": random.randint(500000, 2000000)}

    return {
        "_id": f"EMP-{idx:04d}",
        "nombre": f"Startup_{sector.title()}_{idx}",
        "ruc": f"17{random.randint(10000000, 99999999)}001",
        "sector": sector,
        "provincia": provincia,
        "ciudad": f"Ciudad_{provincia}",
        "etapa": etapa,
        "anio_fundacion": anio_fundacion,
        "equipo": {
            "fundadores": random.randint(1, 3),
            "empleados_full": empleados,
            "empleados_part": random.randint(0, empleados // 2)
        },
        "financiero": {
            "revenue_anual_usd": revenue_map[etapa],
            "busca_inversion": etapa in ["mvp", "traccion"],
            "inversion_recibida_usd": random.randint(0, 500000) if etapa in ["traccion","crecimiento","expansion"] else 0,
            "bootstrap": random.choice([True, False])
        },
        "tecnologia": {
            "stack": random.sample(["Python", "React", "Node.js", "MongoDB",
                                     "AWS", "Flutter", "PostgreSQL", "FastAPI"], random.randint(2, 5)),
            "tiene_app_movil": random.choice([True, False]),
            "usa_ia": random.choice([True, True, False])
        },
        "redes_sociales": {
            "instagram_followers": random.randint(100, 50000) if random.random() > 0.2 else None,
            "linkedin": random.choice([True, False])
        },
        "estado": random.choices(estados, weights=[60, 0, 0, 0, 25, 15])[0],
        "tags": random.sample(["b2b","b2c","saas","marketplace","hardware",
                                "ia","sostenible","exportacion"], random.randint(1, 4)),
        "fecha_registro": (datetime.now() - timedelta(days=random.randint(10, 1000))).isoformat(),
        "fecha_actualizacion": datetime.now().isoformat()
    }

emprendimientos = [generar_emprendimiento(i) for i in range(1, 51)]
activos = [e for e in emprendimientos if e["estado"] == "activo"]
print(f"\nDataset generado: {len(emprendimientos)} emprendimientos "
      f"({len(activos)} activos, {len(emprendimientos)-len(activos)} inactivos)")

# ================================================
# CRUD COMPLETO
# ================================================
print("\n[CREATE] Insertar emprendimientos")
print(f"  db.emprendimientos.insertMany([...50 documentos...])")
print(f"  {len(emprendimientos)} documentos insertados")

print("\n[READ] Consultas con filtros")

# Query 1: emprendimientos activos en Pichincha
pichincha = [e for e in emprendimientos
             if e["provincia"] == "Pichincha" and e["estado"] == "activo"]
print(f"\n  1. Activos en Pichincha: {len(pichincha)}")
print(f"     db.emprendimientos.find({{provincia:'Pichincha', estado:'activo'}})")

# Query 2: startups IA en etapa traccion+
con_ia = [e for e in emprendimientos
          if e["tecnologia"]["usa_ia"] and e["etapa"] in ["traccion","crecimiento","expansion"]]
print(f"\n  2. Con IA en traccion+: {len(con_ia)}")
print(f"     db.emprendimientos.find({{\"tecnologia.usa_ia\":true, etapa:{{$in:['traccion','crecimiento','expansion']}}}}})")

# Query 3: mayor revenue
top_revenue = sorted(emprendimientos, key=lambda x: x["financiero"]["revenue_anual_usd"], reverse=True)[:5]
print(f"\n  3. Top 5 por revenue anual:")
for e in top_revenue:
    rev = e["financiero"]["revenue_anual_usd"]
    print(f"     {e['nombre']:<25} | {e['etapa']:<12} | ${rev:>10,.0f}")

print("\n[UPDATE] Actualizar documentos")
# Marcar como buscando inversion
buscan = [e for e in emprendimientos if e["etapa"] == "mvp"]
print(f"  db.emprendimientos.updateMany({{etapa:'mvp'}}, {{$set:{{\"financiero.busca_inversion\":true}}}})")
print(f"  {len(buscan)} emprendimientos en MVP marcados como buscando inversion")

print("\n[DELETE] Eliminar/desactivar")
cerrados_count = sum(1 for e in emprendimientos if e["estado"] == "cerrado")
print(f"  db.emprendimientos.deleteMany({{estado:'cerrado'}})  → {cerrados_count} eliminados")

# ================================================
# AGGREGATION PIPELINES
# ================================================
print("\n[AGGREGATION] Reportes ejecutivos")

# Pipeline 1: por sector
print("\n  Pipeline 1: Revenue total por sector")
print("  db.emprendimientos.aggregate([{$group:{_id:'$sector', revenue_total:{$sum:'$financiero.revenue_anual_usd'}, count:{$sum:1}}}])")
por_sector = defaultdict(lambda: {"revenue": 0, "count": 0, "empleados": 0})
for e in activos:
    s = e["sector"]
    por_sector[s]["revenue"] += e["financiero"]["revenue_anual_usd"]
    por_sector[s]["count"] += 1
    por_sector[s]["empleados"] += e["equipo"]["empleados_full"]

for sector, d in sorted(por_sector.items(), key=lambda x: x[1]["revenue"], reverse=True):
    print(f"  {sector:<12}: {d['count']:>3} startups | ${d['revenue']:>10,.0f} revenue | {d['empleados']:>4} empleos")

# Pipeline 2: por provincia
print("\n  Pipeline 2: Ecosistema por provincia")
por_prov = defaultdict(lambda: {"count": 0, "ia": 0, "inversion": 0})
for e in activos:
    p = e["provincia"]
    por_prov[p]["count"] += 1
    if e["tecnologia"]["usa_ia"]:
        por_prov[p]["ia"] += 1
    por_prov[p]["inversion"] += e["financiero"]["inversion_recibida_usd"]

for prov, d in sorted(por_prov.items(), key=lambda x: x[1]["count"], reverse=True):
    pct_ia = d["ia"] / d["count"] * 100 if d["count"] else 0
    print(f"  {prov:<15}: {d['count']:>3} startups | {pct_ia:.0f}% usan IA | ${d['inversion']:>10,.0f} inversion")

# Pipeline 3: distribucion etapas
print("\n  Pipeline 3: Distribucion del funnel")
por_etapa = defaultdict(int)
for e in activos:
    por_etapa[e["etapa"]] += 1
total_act = len(activos)
for etapa in ["idea", "mvp", "traccion", "crecimiento", "expansion"]:
    cnt = por_etapa.get(etapa, 0)
    pct = cnt / total_act * 100 if total_act else 0
    barra = "#" * int(pct / 2)
    print(f"  {etapa:<12}: {cnt:>3} ({pct:.1f}%) {barra}")

# ================================================
# INDICES RECOMENDADOS
# ================================================
print("\n[INDICES] Para performance en produccion")
indices = [
    ("provincia + estado",    "db.emprendimientos.createIndex({provincia:1, estado:1})"),
    ("sector",                "db.emprendimientos.createIndex({sector:1})"),
    ("usa_ia",                "db.emprendimientos.createIndex({'tecnologia.usa_ia':1})"),
    ("revenue",               "db.emprendimientos.createIndex({'financiero.revenue_anual_usd':-1})"),
    ("texto libre",           "db.emprendimientos.createIndex({nombre:'text', sector:'text'})"),
]
for nombre, comando in indices:
    print(f"  {nombre:<25}: {comando}")

# ================================================
# REPORTE EJECUTIVO
# ================================================
total_empleos = sum(e["equipo"]["empleados_full"] for e in activos)
total_revenue = sum(e["financiero"]["revenue_anual_usd"] for e in activos)
total_inversion = sum(e["financiero"]["inversion_recibida_usd"] for e in activos)
usan_ia = sum(1 for e in activos if e["tecnologia"]["usa_ia"])

print("\n" + "=" * 70)
print("REPORTE EJECUTIVO — ECOSISTEMA EMPRENDEDOR ECUADOR")
print("=" * 70)
print(f"  Emprendimientos activos:    {len(activos)}")
print(f"  Empleos generados:          {total_empleos:,}")
print(f"  Revenue total anual:        ${total_revenue:,.0f}")
print(f"  Inversion total recibida:   ${total_inversion:,.0f}")
print(f"  Usan IA:                    {usan_ia} ({usan_ia/len(activos)*100:.0f}%)")
print(f"  Sector lider (revenue):     {max(por_sector.items(), key=lambda x: x[1]['revenue'])[0]}")
print(f"  Provincia lider (cantidad): {max(por_prov.items(), key=lambda x: x[1]['count'])[0]}")
print("=" * 70)
```

3. Conecta con MongoDB Atlas real e inserta los 50 documentos.

4. Ejecuta los 3 aggregation pipelines en MongoDB Compass o Atlas Data Explorer.

5. Crea un indice compuesto sobre `{provincia, sector, etapa}` y mide el tiempo de una consulta antes y despues.

## Usa IA para...

> Abre Claude y escribe:
> "Tengo una coleccion MongoDB con 50 emprendimientos ecuatorianos. Quiero un aggregation pipeline que: 1) filtre solo activos, 2) agrupe por sector y etapa, 3) calcule revenue promedio, total empleados y porcentaje que usa IA. Escribe el pipeline completo con explicacion de cada etapa."

Despues de leer la respuesta:
- Implementa el pipeline en MongoDB Compass o Playground.
- Adapta el codigo Python para ejecutar el mismo pipeline con `aggregate()`.

## Que aprendiste

- El schema design en MongoDB debe optimizarse para las queries mas frecuentes.
- Los documentos anidados (objetos y arrays) evitan JOINs a costo de redundancia controlada.
- El aggregation pipeline en MongoDB equivale a GROUP BY + filtros + ordenacion de SQL.
- Los indices mejoran drasticamente el rendimiento en colecciones grandes.
- `$group + $sum + $avg` son las operaciones de agregacion mas comunes.
- Un proyecto MongoDB completo requiere: schema design, CRUD, aggregations e indices.

## Reto extra

Implementa un sistema de "matching" entre emprendimientos que buscan inversion y criterios del inversor: sector, etapa, revenue minimo, uso de IA, provincia. Usa una funcion que reciba los criterios del inversor y devuelva los top 5 emprendimientos compatibles ordenados por score de compatibilidad. Calcula el score con ponderaciones: 30% sector, 25% etapa, 20% revenue, 15% IA, 10% provincia.
