# Ejercicio Sesion 7: Procesador de Dataset de Provincias Ecuador

**Materia:** Fundamentos de Programacion
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Usar listas y tuplas para almacenar, organizar, filtrar y analizar datos reales de las 24 provincias del Ecuador: poblacion, region y PIB estimado por provincia.

## Contexto

Ecuador tiene 24 provincias organizadas en 4 regiones: Costa, Sierra, Amazonia e Insular. El INEC publica datos demograficos por provincia. Saber manejar estas estructuras de datos con listas y tuplas es fundamental para cualquier analisis de datos geografico.

## Instrucciones

1. Crea un archivo `sesion07_provincias_ecuador.py`.

2. Escribe el programa usando listas y tuplas:

```python
# Procesador de datos provinciales - Ecuador
# Fuente: INEC Censo 2022 (poblacion aproximada)
# Estructuras: listas y tuplas

print("=" * 62)
print("ANALISIS PROVINCIAL - ECUADOR")
print("Fuente: INEC Censo 2022 | Datos aproximados")
print("=" * 62)

# Tuplas: datos inmutables por provincia
# Formato: (nombre, region, poblacion, pib_per_capita_estimado)
provincias = [
    ("Pichincha",       "Sierra",   3228000, 8500),
    ("Guayas",          "Costa",    4387000, 7200),
    ("Manabi",          "Costa",    1563000, 4100),
    ("Los Rios",        "Costa",     921000, 3800),
    ("Azuay",           "Sierra",    881000, 6200),
    ("El Oro",          "Costa",     715000, 5100),
    ("Loja",            "Sierra",    519000, 4400),
    ("Esmeraldas",      "Costa",     620000, 3900),
    ("Chimborazo",      "Sierra",    524000, 3500),
    ("Imbabura",        "Sierra",    476000, 4700),
    ("Tungurahua",      "Sierra",    573000, 5600),
    ("Cotopaxi",        "Sierra",    479000, 4200),
    ("Bolivar",         "Sierra",    198000, 3200),
    ("Canar",           "Sierra",    254000, 3600),
    ("Carchi",          "Sierra",    183000, 3800),
    ("Santo Domingo",   "Sierra",    470000, 4900),
    ("Santa Elena",     "Costa",     380000, 4000),
    ("Napo",            "Amazonia",  130000, 4300),
    ("Pastaza",         "Amazonia",   95000, 5800),
    ("Morona Santiago", "Amazonia",  186000, 3700),
    ("Zamora Chinchipe","Amazonia",  115000, 4500),
    ("Sucumbios",       "Amazonia",  228000, 6100),
    ("Orellana",        "Amazonia",  158000, 5900),
    ("Galapagos",       "Insular",    33000, 12000),
]

# ================================================
# LISTAS: trabajar con datos extraidos
# ================================================
nombres = [p[0] for p in provincias]           # list comprehension
poblaciones = [p[2] for p in provincias]
regiones = [p[1] for p in provincias]
pib_per_capita = [p[3] for p in provincias]

print(f"\nTotal provincias registradas: {len(provincias)}")
print(f"Poblacion total Ecuador: {sum(poblaciones):,}")
print(f"Promedio PIB per capita: ${sum(pib_per_capita)/len(pib_per_capita):,.0f}")

# ================================================
# FILTRAR por region usando listas
# ================================================
print("\n--- ANALISIS POR REGION ---")
regiones_unicas = list(set(regiones))  # set elimina duplicados
regiones_unicas.sort()

for region in regiones_unicas:
    provincias_region = [p for p in provincias if p[1] == region]
    pob_region = sum(p[2] for p in provincias_region)
    pct = (pob_region / sum(poblaciones)) * 100
    print(f"  {region:<12}: {len(provincias_region)} provincias | "
          f"Pob: {pob_region:>9,} ({pct:.1f}%)")

# ================================================
# TOP 5 y BOTTOM 5
# ================================================
provincias_por_pob = sorted(provincias, key=lambda p: p[2], reverse=True)

print("\n--- TOP 5 MAS POBLADAS ---")
for i, p in enumerate(provincias_por_pob[:5], 1):
    print(f"  {i}. {p[0]:<20} {p[2]:>9,} hab.")

print("\n--- TOP 5 MENOS POBLADAS ---")
for i, p in enumerate(provincias_por_pob[-5:], 1):
    print(f"  {i}. {p[0]:<20} {p[2]:>9,} hab.")

# ================================================
# OPERACIONES CON LISTAS: insertar, eliminar, slice
# ================================================
print("\n--- OPERACIONES CON LISTA ---")
lista_trabajo = list(nombres)          # copia de la lista
lista_trabajo.append("Nueva Provincia TEST")
print(f"Despues de append: {len(lista_trabajo)} elementos")

lista_trabajo.remove("Nueva Provincia TEST")
print(f"Despues de remove: {len(lista_trabajo)} elementos")

# Slice: primeras 5 provincias de la Sierra
sierra = [p for p in provincias if p[1] == "Sierra"]
sierra_nombres = [p[0] for p in sierra]
print(f"Primeras 3 de Sierra: {sierra_nombres[:3]}")
print(f"Ultimas 2 de Sierra:  {sierra_nombres[-2:]}")

# ================================================
# TUPLAS: inmutabilidad
# ================================================
print("\n--- DIFERENCIA TUPLA vs LISTA ---")
datos_galapagos = provincias[23]   # tupla inmutable
print(f"Galapagos (tupla): {datos_galapagos}")
print(f"PIB per capita mas alto: ${datos_galapagos[3]:,} (Galapagos)")
# datos_galapagos[0] = "Cambio"  # <-- esto daria error: las tuplas son inmutables

print("\n" + "=" * 62)
```

3. Ejecuta el programa completo.

4. Agrega tu propia provincia natal al analisis: busca su poblacion real en el sitio del INEC (inec.gob.ec) y actualiza la tupla correspondiente si el dato difiere.

5. Crea una nueva lista llamada `provincias_objetivo_itseia` con las 5 provincias donde ITSEIA tiene mayor potencial de captar estudiantes (criterio: poblacion > 400,000 y region Sierra o Costa).

## Usa IA para...

> Abre ChatGPT y escribe:
> "Explica la diferencia entre lista y tupla en Python con 3 ejemplos practicos. ¿Cuando deberia preferir una tupla sobre una lista? Usa como contexto datos de provincias de un pais."

Despues de leer la respuesta:
- ¿Por que usamos tuplas para almacenar los datos de cada provincia en este ejercicio?
- Identifica en tu codigo un lugar donde cambiaste una tupla a lista y por que fue necesario.

## Que aprendiste

- Las listas `[]` son mutables: puedes agregar, eliminar y modificar elementos.
- Las tuplas `()` son inmutables: los datos no cambian una vez definidos.
- List comprehension `[expr for item in lista if condicion]` es potente y conciso.
- `sorted(lista, key=lambda x: x[2])` ordena por cualquier campo.
- `set()` elimina duplicados de una lista.
- `enumerate()` da indice + valor al iterar.

## Reto extra

Calcula el "Indice de Potencial ITSEIA" para cada provincia: una formula que combine poblacion (50%), PIB per capita (30%) y si es Sierra o Costa (20% bonus). Muestra el ranking de las 24 provincias segun este indice y las 5 mas prometedoras para apertura de sedes futuras.
