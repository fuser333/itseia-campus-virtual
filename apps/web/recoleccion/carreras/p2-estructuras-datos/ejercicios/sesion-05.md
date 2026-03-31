# Ejercicio Sesion 5: Algoritmos de Ordenamiento

**Materia:** Estructuras de Datos y Algoritmos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Implementar y comparar Bubble Sort, Merge Sort y Quick Sort midiendo tiempos reales sobre datos del INEC Ecuador, entendiendo intuitivamente por que la complejidad algorítmica importa cuando los datos crecen.

## Contexto

El INEC Ecuador publica el Directorio de Empresas con mas de 800,000 empresas registradas. Si el equipo de estadisticas necesita ordenar ese directorio por ingresos para encontrar las top 100, un Bubble Sort tardaria horas; Quick Sort lo haria en segundos. Esta diferencia no es teorica: los sistemas de reportes del BCE, del SRI y de la SUPERCIAS ordenan millones de registros diariamente. Elegir el algoritmo incorrecto puede hacer inutilizable un sistema.

## Instrucciones

1. Crea el archivo `sesion05_ordenamiento.py`.

2. Implementa los tres algoritmos con visualizacion de pasos:

```python
# Estructuras de Datos - Sesion 5: Algoritmos de Ordenamiento
# ITSEIA - Periodo 2

import time
import random
import copy

def generar_empresas(n, seed=42):
    """Genera n empresas con ingresos aleatorios (datos tipo INEC)."""
    random.seed(seed)
    sectores = ["Comercio", "Manufactura", "Servicios", "Agricultura", "Tecnologia"]
    ciudades = ["Quito", "Guayaquil", "Cuenca", "Ambato", "Manta"]
    empresas = []
    for i in range(n):
        empresas.append({
            "ruc": f"{random.randint(1000000000, 1999999999)}001",
            "nombre": f"Empresa_{i:04d}",
            "sector": random.choice(sectores),
            "ciudad": random.choice(ciudades),
            "ingresos": round(random.uniform(10000, 5000000), 2)
        })
    return empresas


# ============================================================
# BUBBLE SORT — O(n^2): simple pero lento
# ============================================================

def bubble_sort(arr, key=None, verbose=False):
    """
    Compara pares adyacentes e intercambia si estan en orden incorrecto.
    Como burbujas: los valores grandes 'flotan' al final.
    Complejidad: O(n^2) tiempo, O(1) espacio
    """
    datos = copy.deepcopy(arr)
    n = len(datos)
    comparaciones = 0
    intercambios = 0

    for i in range(n):
        intercambio_en_esta_pasada = False
        for j in range(0, n - i - 1):
            comparaciones += 1
            val_j = datos[j][key] if key else datos[j]
            val_j1 = datos[j + 1][key] if key else datos[j + 1]
            if val_j > val_j1:
                datos[j], datos[j + 1] = datos[j + 1], datos[j]
                intercambios += 1
                intercambio_en_esta_pasada = True
        # Optimizacion: si no hubo intercambios, ya esta ordenado
        if not intercambio_en_esta_pasada:
            break
        if verbose and i < 3:
            vals = [d[key] if key else d for d in datos[:5]]
            print(f"    Pasada {i+1}: {vals}...")

    return datos, comparaciones, intercambios


# ============================================================
# MERGE SORT — O(n log n): divide y conquista
# ============================================================

def merge_sort(arr, key=None):
    """
    Divide el array a la mitad recursivamente, luego fusiona ordenando.
    Como un torneo de doble eliminacion.
    Complejidad: O(n log n) tiempo, O(n) espacio
    """
    if len(arr) <= 1:
        return arr

    medio = len(arr) // 2
    izquierda = merge_sort(arr[:medio], key)
    derecha = merge_sort(arr[medio:], key)
    return _merge(izquierda, derecha, key)


def _merge(izq, der, key):
    """Fusion de dos arrays ordenados en uno ordenado."""
    resultado = []
    i = j = 0
    while i < len(izq) and j < len(der):
        val_i = izq[i][key] if key else izq[i]
        val_j = der[j][key] if key else der[j]
        if val_i <= val_j:
            resultado.append(izq[i])
            i += 1
        else:
            resultado.append(der[j])
            j += 1
    resultado.extend(izq[i:])
    resultado.extend(der[j:])
    return resultado


# ============================================================
# QUICK SORT — O(n log n) promedio: el mas usado en practica
# ============================================================

def quick_sort(arr, key=None, low=None, high=None):
    """
    Elige un pivote, coloca menores a la izquierda y mayores a la derecha.
    Recursivo sobre cada mitad.
    Complejidad: O(n log n) promedio, O(n^2) peor caso (pivote mal elegido)
    """
    datos = copy.deepcopy(arr) if low is None else arr
    if low is None:
        low, high = 0, len(datos) - 1

    if low < high:
        pivot_idx = _partition(datos, low, high, key)
        quick_sort(datos, key, low, pivot_idx - 1)
        quick_sort(datos, key, pivot_idx + 1, high)

    return datos


def _partition(arr, low, high, key):
    """Coloca el pivote en su posicion correcta."""
    pivot_val = arr[high][key] if key else arr[high]
    i = low - 1
    for j in range(low, high):
        val_j = arr[j][key] if key else arr[j]
        if val_j <= pivot_val:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1


# ============================================================
# COMPARACION CON DATOS TIPO INEC ECUADOR
# ============================================================

print("=" * 62)
print("COMPARACION: Ordenar directorio de empresas Ecuador (INEC)")
print("=" * 62)

# Demo con datos pequenos (visualizar pasos)
empresas_demo = generar_empresas(10)
print("\nDatos originales (10 empresas, ingresos):")
print([round(e["ingresos"]) for e in empresas_demo])

print("\nBubble Sort (con pasos):")
ordenado_bs, comps, intercambios = bubble_sort(empresas_demo, key="ingresos", verbose=True)
print(f"  Resultado: {[round(e['ingresos']) for e in ordenado_bs]}")
print(f"  Comparaciones: {comps} | Intercambios: {intercambios}")

ordenado_ms = merge_sort(copy.deepcopy(empresas_demo), key="ingresos")
print(f"\nMerge Sort:")
print(f"  Resultado: {[round(e['ingresos']) for e in ordenado_ms]}")

ordenado_qs = quick_sort(copy.deepcopy(empresas_demo), key="ingresos")
print(f"\nQuick Sort:")
print(f"  Resultado: {[round(e['ingresos']) for e in ordenado_qs]}")

# Verificar que todos dan el mismo resultado
assert [e["ingresos"] for e in ordenado_bs] == [e["ingresos"] for e in ordenado_ms] == [e["ingresos"] for e in ordenado_qs]
print("\nVerificacion: los 3 algoritmos producen el mismo resultado.")

# ============================================================
# BENCHMARK: comparar rendimiento por tamano
# ============================================================

print("\n" + "=" * 62)
print("BENCHMARK: Tiempo por tamano del dataset")
print("=" * 62)
print(f"{'Tamanio':>10} | {'Bubble Sort':>14} | {'Merge Sort':>12} | {'Quick Sort':>12} | {'Python sort':>13}")
print("-" * 70)

tamanos = [100, 500, 1000, 5000, 10000]

for n in tamanos:
    datos = generar_empresas(n)

    # Bubble Sort (solo para n pequenos)
    if n <= 1000:
        t0 = time.perf_counter()
        bubble_sort(copy.deepcopy(datos), key="ingresos")
        t_bubble = (time.perf_counter() - t0) * 1000
        str_bubble = f"{t_bubble:>10.2f} ms"
    else:
        str_bubble = f"{'muy lento':>14}"

    # Merge Sort
    t0 = time.perf_counter()
    merge_sort(copy.deepcopy(datos), key="ingresos")
    t_merge = (time.perf_counter() - t0) * 1000

    # Quick Sort
    t0 = time.perf_counter()
    quick_sort(copy.deepcopy(datos), key="ingresos")
    t_quick = (time.perf_counter() - t0) * 1000

    # Python sort (Timsort, altamente optimizado)
    t0 = time.perf_counter()
    sorted(datos, key=lambda e: e["ingresos"])
    t_python = (time.perf_counter() - t0) * 1000

    print(f"{n:>10,} | {str_bubble:>14} | {t_merge:>8.2f} ms | {t_quick:>8.2f} ms | {t_python:>9.2f} ms")

# ============================================================
# RESULTADO DE NEGOCIO
# ============================================================

print("\n" + "=" * 62)
print("TOP 10 EMPRESAS por ingresos (usando Merge Sort):")
print("=" * 62)
empresas_inec = generar_empresas(1000)
ordenadas = merge_sort(empresas_inec, key="ingresos")
for i, emp in enumerate(reversed(ordenadas[-10:]), 1):
    print(f"  {i:2}. {emp['nombre']} | {emp['ciudad']:<12} | ${emp['ingresos']:>12,.2f}")
```

3. Ejecuta y registra los tiempos del benchmark en tu cuaderno.

4. Responde: cuando n pasa de 1,000 a 10,000 (10x), ¿cuanto aumenta el tiempo de Bubble Sort? ¿Y el de Merge Sort?

## Usa IA para...

> Abre ChatGPT y escribe:
> "Explica visualmente Bubble Sort, Merge Sort y Quick Sort con un ejemplo de 6 numeros: [64, 25, 12, 22, 11, 90]. Muestra cada paso de cada algoritmo. ¿Por que Merge Sort usa mas memoria que Quick Sort si ambos son O(n log n)?"

Despues de leer la respuesta:
- Verifica los pasos con el modo `verbose=True` del Bubble Sort.
- Pregunta: "¿Que es Timsort y por que Python lo usa en lugar de Quick Sort para su sorted() nativo?"

## Que aprendiste

- Bubble Sort compara pares adyacentes: simple de entender pero O(n^2), impractico para grandes datos.
- Merge Sort divide el problema a la mitad recursivamente y fusiona: siempre O(n log n) pero necesita O(n) memoria extra.
- Quick Sort usa un pivote para particionar: O(n log n) promedio, muy eficiente en la practica pero O(n^2) en el peor caso con un mal pivote.
- Python usa Timsort (hibrido Merge Sort + Insertion Sort) que es O(n log n) garantizado y O(n) en datos casi-ordenados.
- La diferencia entre O(n^2) y O(n log n) es dramatica: con n=1,000,000, O(n^2) requiere 10^12 operaciones; O(n log n) solo 20,000,000.

## Reto extra

Modifica `quick_sort` para que use el "pivote de mediana de tres": toma el primero, el del medio y el ultimo elemento, y usa la mediana como pivote. Mide si esto mejora el rendimiento en datos casi-ordenados (genera los datos con `sorted(generar_empresas(5000), key=lambda e: e['ingresos'])` antes de ordenar).
