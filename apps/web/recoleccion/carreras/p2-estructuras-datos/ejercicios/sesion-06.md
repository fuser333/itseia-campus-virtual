# Ejercicio Sesion 6: Algoritmos de Busqueda

**Materia:** Estructuras de Datos y Algoritmos
**Nivel:** Intermedio
**Herramienta IA:** Copilot
**Duracion estimada:** 35 min

## Objetivo

Implementar busqueda lineal y busqueda binaria con medicion de rendimiento, aplicadas a un sistema de consulta de precios del mercado mayorista de Quito (EMMSA), evidenciando la diferencia entre O(n) y O(log n) con datos reales.

## Contexto

La Empresa Publica Metropolitana de Rastro y Plataformas (EMMSA) de Quito registra los precios de cientos de productos agricolas cada dia: papa, cebolla, tomate, platano, yuca y mas. Un comerciante necesita consultar el precio actual de un producto en milisegundos. Con 500 productos y busqueda lineal son hasta 500 comparaciones; con busqueda binaria son maximo 9 comparaciones (log2 500 ≈ 9). Con 1,000,000 de registros historicos, la diferencia es 1,000,000 vs 20 comparaciones.

## Instrucciones

1. Crea el archivo `sesion06_busqueda.py`.

2. Implementa y compara ambos algoritmos:

```python
# Estructuras de Datos - Sesion 6: Algoritmos de Busqueda
# ITSEIA - Periodo 2

import time
import random
import math

# ============================================================
# DATOS: Precios del Mercado Mayorista EMMSA Quito
# ============================================================

def generar_catalogo_productos(n, seed=42):
    """Genera un catalogo de n productos agricolas con precios."""
    random.seed(seed)
    nombres_base = [
        "Papa chola", "Papa cecilio", "Tomate rinon", "Tomate cherry",
        "Cebolla paiteña", "Cebolla blanca", "Platano macho", "Platano seda",
        "Yuca", "Zanahoria", "Brocoli", "Coliflor", "Lechuga", "Espinaca",
        "Aji", "Pimiento", "Pepinillo", "Aguacate", "Mango", "Naranja",
        "Limon", "Piña", "Sandia", "Melon", "Fresa", "Mora", "Maracuya",
    ]
    productos = []
    for i in range(n):
        nombre = f"{random.choice(nombres_base)} Lote-{i:04d}"
        productos.append({
            "codigo": f"EMMSA-{i:06d}",
            "nombre": nombre,
            "precio_kg": round(random.uniform(0.30, 8.50), 2),
            "origen": random.choice(["Carchi", "Tungurahua", "Cotopaxi", "Azuay", "Manabi", "Loja"]),
            "disponible": random.choice([True, True, True, False])
        })
    # Ordenar por codigo para que la busqueda binaria funcione
    productos.sort(key=lambda p: p["codigo"])
    return productos


# ============================================================
# BUSQUEDA LINEAL — O(n): revisa uno por uno
# ============================================================

def busqueda_lineal(lista, clave, campo="codigo"):
    """
    Recorre la lista de inicio a fin hasta encontrar la clave.
    Funciona con listas ordenadas Y desordenadas.
    Complejidad: O(n) tiempo, O(1) espacio.
    """
    comparaciones = 0
    for i, elemento in enumerate(lista):
        comparaciones += 1
        if elemento[campo] == clave:
            return i, elemento, comparaciones
    return -1, None, comparaciones


def busqueda_lineal_multiple(lista, valor, campo="origen"):
    """
    Busca TODOS los elementos que cumplan la condicion.
    Siempre O(n) porque debe recorrer toda la lista.
    """
    resultados = []
    comparaciones = 0
    for elemento in lista:
        comparaciones += 1
        if elemento[campo] == valor:
            resultados.append(elemento)
    return resultados, comparaciones


# ============================================================
# BUSQUEDA BINARIA — O(log n): requiere lista ORDENADA
# ============================================================

def busqueda_binaria(lista, clave, campo="codigo"):
    """
    Divide el espacio de busqueda a la mitad en cada paso.
    REQUISITO: la lista debe estar ordenada por el campo buscado.
    Complejidad: O(log n) tiempo, O(1) espacio.
    """
    izquierda, derecha = 0, len(lista) - 1
    comparaciones = 0

    while izquierda <= derecha:
        medio = (izquierda + derecha) // 2
        comparaciones += 1

        if lista[medio][campo] == clave:
            return medio, lista[medio], comparaciones
        elif lista[medio][campo] < clave:
            izquierda = medio + 1  # Buscar en la mitad derecha
        else:
            derecha = medio - 1   # Buscar en la mitad izquierda

    return -1, None, comparaciones


def busqueda_binaria_recursiva(lista, clave, campo="codigo", izq=None, der=None, comps=0):
    """Version recursiva de la busqueda binaria."""
    if izq is None:
        izq, der = 0, len(lista) - 1

    comps += 1
    if izq > der:
        return -1, None, comps

    medio = (izq + der) // 2

    if lista[medio][campo] == clave:
        return medio, lista[medio], comps
    elif lista[medio][campo] < clave:
        return busqueda_binaria_recursiva(lista, clave, campo, medio + 1, der, comps)
    else:
        return busqueda_binaria_recursiva(lista, clave, campo, izq, medio - 1, comps)


# ============================================================
# DEMO CON 10 PRODUCTOS
# ============================================================

print("=" * 62)
print("CATALOGO EMMSA QUITO - Demo con 10 productos")
print("=" * 62)

catalogo_demo = generar_catalogo_productos(10)
print("\nProductos (ordenados por codigo):")
for p in catalogo_demo:
    print(f"  {p['codigo']} | {p['nombre']:<30} | ${p['precio_kg']:.2f}/kg | {p['origen']}")

# Buscar el primer y ultimo producto
objetivo_primero = catalogo_demo[0]["codigo"]
objetivo_ultimo = catalogo_demo[-1]["codigo"]
objetivo_inexistente = "EMMSA-999999"

print(f"\nBusqueda del PRIMER producto ({objetivo_primero}):")
idx_l, prod_l, comp_l = busqueda_lineal(catalogo_demo, objetivo_primero)
idx_b, prod_b, comp_b = busqueda_binaria(catalogo_demo, objetivo_primero)
print(f"  Lineal : {comp_l} comparaciones - indice {idx_l}")
print(f"  Binaria: {comp_b} comparaciones - indice {idx_b}")

print(f"\nBusqueda del ULTIMO producto ({objetivo_ultimo}):")
idx_l, prod_l, comp_l = busqueda_lineal(catalogo_demo, objetivo_ultimo)
idx_b, prod_b, comp_b = busqueda_binaria(catalogo_demo, objetivo_ultimo)
print(f"  Lineal : {comp_l} comparaciones (peor caso para lineal)")
print(f"  Binaria: {comp_b} comparaciones (maximo log2(10) ≈ 3-4)")

print(f"\nBusqueda INEXISTENTE ({objetivo_inexistente}):")
idx_l, prod_l, comp_l = busqueda_lineal(catalogo_demo, objetivo_inexistente)
idx_b, prod_b, comp_b = busqueda_binaria(catalogo_demo, objetivo_inexistente)
print(f"  Lineal : {comp_l} comparaciones (recorre TODO)")
print(f"  Binaria: {comp_b} comparaciones (descarta mitades)")


# ============================================================
# BENCHMARK: comparar por tamano
# ============================================================

print("\n" + "=" * 62)
print("BENCHMARK: Comparaciones en el PEOR CASO")
print("=" * 62)
print(f"{'N':>10} | {'Lineal (max)':>14} | {'Binaria (max)':>15} | {'Ratio':>8} | {'log2(N)':>8}")
print("-" * 62)

for n in [10, 100, 1000, 10000, 100000, 1000000]:
    lineal_max = n
    binaria_max = math.ceil(math.log2(n))
    ratio = n / binaria_max
    print(f"{n:>10,} | {lineal_max:>14,} | {binaria_max:>15} | {ratio:>8,.0f}x | {math.log2(n):>8.1f}")

print("\n  Interpretacion:")
print("  Con 1,000,000 productos, busqueda lineal puede tomar 1,000,000 comparaciones.")
print("  Busqueda binaria necesita maximo 20 comparaciones.")
print("  La binaria es 50,000x mas eficiente en el peor caso.")


# ============================================================
# BUSQUEDA MULTIPLE: todos los productos de una provincia
# ============================================================

catalogo = generar_catalogo_productos(500)

print("\n" + "=" * 62)
print("BUSQUEDA MULTIPLE: Productos de Tungurahua")
print("(Busqueda lineal — la binaria no aplica para busqueda multiple)")
print("=" * 62)

resultados, comps = busqueda_lineal_multiple(catalogo, "Tungurahua", campo="origen")
print(f"\n  Productos encontrados: {len(resultados)}")
print(f"  Comparaciones realizadas: {comps}")
print(f"  Primeros 5 resultados:")
for p in resultados[:5]:
    print(f"    {p['codigo']} | {p['nombre']:<35} | ${p['precio_kg']:.2f}/kg")


# ============================================================
# TIEMPO REAL: medir en catalogo de 100,000 productos
# ============================================================

print("\n" + "=" * 62)
print("TIEMPO REAL: Catalogo de 100,000 productos")
print("=" * 62)

catalogo_grande = generar_catalogo_productos(100000)

# Buscar el ultimo elemento (peor caso para lineal)
clave_peor_caso = catalogo_grande[-1]["codigo"]

t0 = time.perf_counter()
idx_l, _, comp_l = busqueda_lineal(catalogo_grande, clave_peor_caso)
t_lineal = (time.perf_counter() - t0) * 1000

t0 = time.perf_counter()
idx_b, _, comp_b = busqueda_binaria(catalogo_grande, clave_peor_caso)
t_binaria = (time.perf_counter() - t0) * 1000

print(f"\n  Busqueda lineal : {comp_l:>7,} comparaciones | {t_lineal:.4f} ms")
print(f"  Busqueda binaria: {comp_b:>7,} comparaciones | {t_binaria:.6f} ms")
if t_lineal > 0:
    print(f"  La binaria es {t_lineal/t_binaria:.0f}x mas rapida en este caso")
```

3. Ejecuta y registra en tu cuaderno la tabla de comparaciones del benchmark.

4. Modifica la busqueda para encontrar un producto por `nombre` exacto. ¿Puedes usar busqueda binaria? ¿Por que si o por que no?

## Usa IA para...

> Abre GitHub Copilot en VS Code, crea un archivo `busqueda_test.py` y escribe este comentario:
> `# Funcion que busca un producto por rango de precios usando busqueda binaria en lista ordenada por precio`

Observa lo que Copilot genera y luego:
- Evalua si el codigo es correcto para un rango (hay que encontrar el inicio y el fin del rango).
- Pregunta via Copilot Chat: "¿Existe un modulo de Python que implemente busqueda binaria sin tener que programarla desde cero?"

## Que aprendiste

- La busqueda lineal O(n) recorre todos los elementos; funciona en listas desordenadas y es ideal para buscar multiples resultados.
- La busqueda binaria O(log n) descarta la mitad del espacio en cada paso; REQUIERE que la lista este ordenada por el campo de busqueda.
- Con n=1,000,000, la diferencia es 1,000,000 comparaciones vs 20 comparaciones: 50,000 veces mas eficiente.
- Python tiene el modulo `bisect` que implementa busqueda binaria de forma optima y es parte de la libreria estandar.
- La busqueda binaria no sirve para buscar multiples resultados con el mismo valor; para eso siempre se necesita busqueda lineal (o un indice especializado).

## Reto extra

Usa el modulo `bisect` de Python para implementar una funcion `buscar_rango_precios(catalogo_ordenado_por_precio, precio_min, precio_max)` que retorne todos los productos dentro del rango de precio en O(log n + k) donde k es el numero de resultados. Compara con hacer un filtro lineal `[p for p in catalogo if precio_min <= p['precio_kg'] <= precio_max]`.
