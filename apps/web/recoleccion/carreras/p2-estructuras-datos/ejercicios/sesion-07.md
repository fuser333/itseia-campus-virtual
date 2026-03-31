# Ejercicio Sesion 7: Complejidad Algoritmica — Big O

**Materia:** Estructuras de Datos y Algoritmos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Identificar, medir y comparar la complejidad temporal de O(1), O(log n), O(n), O(n log n) y O(n^2) usando ejemplos concretos del sistema de gestion de datos del INEC Ecuador, desarrollando intuicion practica para elegir algoritmos eficientes.

## Contexto

El INEC Ecuador procesa datos del Censo Nacional (aproximadamente 17 millones de personas), encuestas de empleo trimestrales (50,000 hogares), y el directorio de empresas (800,000 registros). Un analista de datos del INEC que no entiende Big O puede escribir un script que tarde 3 dias cuando deberia tardar 3 segundos. Esta sesion convierte la teoria abstracta de complejidad en experimentos medibles con datos reales.

## Instrucciones

1. Crea el archivo `sesion07_big_o.py`.

2. Implementa y mide cada clase de complejidad:

```python
# Estructuras de Datos - Sesion 7: Complejidad Big O
# ITSEIA - Periodo 2

import time
import math
import random

# ============================================================
# GENERADOR DE DATOS INEC
# ============================================================

def generar_datos_inec(n, seed=42):
    """Simula n registros de personas del censo INEC."""
    random.seed(seed)
    provincias = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua",
                  "Imbabura","Loja","El Oro","Los Rios","Chimborazo"]
    return [
        {
            "cedula": f"{random.randint(1000000000, 1999999999)}",
            "edad": random.randint(0, 95),
            "provincia": random.choice(provincias),
            "ingreso": round(random.uniform(0, 8000), 2),
            "educacion": random.choice(["ninguna","primaria","secundaria","superior","posgrado"])
        }
        for _ in range(n)
    ]

# ============================================================
# O(1) — Tiempo CONSTANTE
# Independiente del tamano de la entrada
# ============================================================

def obtener_primer_registro(lista):
    """O(1): acceso directo por indice."""
    return lista[0]

def verificar_cedula_en_hash(tabla_hash, cedula):
    """O(1): busqueda en diccionario Python."""
    return tabla_hash.get(cedula)

def calcular_iva(monto):
    """O(1): calculo matematico puro."""
    return round(monto * 0.15, 2)


# ============================================================
# O(log n) — Tiempo LOGARITMICO
# Divide el espacio a la mitad en cada paso
# ============================================================

def busqueda_binaria_edad(lista_ordenada, edad_objetivo):
    """O(log n): lista debe estar ordenada por edad."""
    izq, der = 0, len(lista_ordenada) - 1
    while izq <= der:
        mid = (izq + der) // 2
        if lista_ordenada[mid]["edad"] == edad_objetivo:
            return mid
        elif lista_ordenada[mid]["edad"] < edad_objetivo:
            izq = mid + 1
        else:
            der = mid - 1
    return -1


# ============================================================
# O(n) — Tiempo LINEAL
# Recorre cada elemento exactamente una vez
# ============================================================

def contar_personas_quito(lista):
    """O(n): revisar todos para contar los de Pichincha."""
    return sum(1 for p in lista if p["provincia"] == "Pichincha")

def calcular_ingreso_promedio(lista):
    """O(n): sumar todos los ingresos."""
    if not lista:
        return 0
    return sum(p["ingreso"] for p in lista) / len(lista)

def encontrar_persona_mayor(lista):
    """O(n): recorrer buscando el maximo."""
    return max(lista, key=lambda p: p["edad"])


# ============================================================
# O(n log n) — LINEAL-LOGARITMICO
# El algoritmo optimo para ordenamiento por comparacion
# ============================================================

def ordenar_por_ingreso(lista):
    """O(n log n): Timsort de Python."""
    return sorted(lista, key=lambda p: p["ingreso"])

def ordenar_por_edad_y_provincia(lista):
    """O(n log n): ordenamiento multiple."""
    return sorted(lista, key=lambda p: (p["provincia"], p["edad"]))


# ============================================================
# O(n^2) — CUADRATICO
# Un bucle dentro de otro bucle
# ============================================================

def encontrar_personas_mismo_ingreso_aprox(lista, tolerancia=0.50):
    """
    O(n^2): para cada persona, compara con todas las demas.
    Simula el problema de 'encontrar duplicados' sin hash.
    """
    pares = []
    for i in range(len(lista)):
        for j in range(i + 1, len(lista)):
            if abs(lista[i]["ingreso"] - lista[j]["ingreso"]) <= tolerancia:
                pares.append((i, j))
                if len(pares) >= 5:  # Solo primeros 5 para no tardar demasiado
                    return pares
    return pares

def seleccion_sort_ingresos(lista):
    """O(n^2): Selection sort para ilustrar cuadratico."""
    datos = lista.copy()
    n = len(datos)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if datos[j]["ingreso"] < datos[min_idx]["ingreso"]:
                min_idx = j
        datos[i], datos[min_idx] = datos[min_idx], datos[i]
    return datos


# ============================================================
# MEDICION Y COMPARACION
# ============================================================

print("=" * 65)
print("ANALISIS BIG O — Datos INEC Ecuador")
print("=" * 65)

tamanos = [100, 500, 1000, 5000, 10000]
# Para O(n^2) solo hasta 2000 para no tardar demasiado
tamanos_cuadratico = [50, 100, 200, 500, 1000]

resultados = {clase: {} for clase in ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n^2)"]}

for n in tamanos:
    datos = generar_datos_inec(n)
    datos_ordenados = sorted(datos, key=lambda p: p["edad"])
    tabla = {p["cedula"]: p for p in datos}

    # O(1)
    t0 = time.perf_counter()
    for _ in range(1000):  # Repetir 1000x para medir mejor
        obtener_primer_registro(datos)
    resultados["O(1)"][n] = (time.perf_counter() - t0) * 1000 / 1000

    # O(log n)
    t0 = time.perf_counter()
    for _ in range(100):
        busqueda_binaria_edad(datos_ordenados, 35)
    resultados["O(log n)"][n] = (time.perf_counter() - t0) * 1000 / 100

    # O(n)
    t0 = time.perf_counter()
    contar_personas_quito(datos)
    resultados["O(n)"][n] = (time.perf_counter() - t0) * 1000

    # O(n log n)
    t0 = time.perf_counter()
    ordenar_por_ingreso(datos)
    resultados["O(n log n)"][n] = (time.perf_counter() - t0) * 1000

for n in tamanos_cuadratico:
    datos = generar_datos_inec(n)
    t0 = time.perf_counter()
    seleccion_sort_ingresos(datos)
    resultados["O(n^2)"][n] = (time.perf_counter() - t0) * 1000

# ============================================================
# TABLA DE RESULTADOS
# ============================================================

print(f"\n{'Complejidad':<15} {'100':>10} {'500':>10} {'1000':>10} {'5000':>10} {'10000':>10}")
print("-" * 60)

for clase in ["O(1)", "O(log n)", "O(n)", "O(n log n)"]:
    fila = f"{clase:<15}"
    for n in tamanos:
        val = resultados[clase].get(n, 0)
        fila += f"{val:>9.4f}ms"
    print(fila)

print(f"\n{'Complejidad':<15} {'50':>10} {'100':>10} {'200':>10} {'500':>10} {'1000':>10}")
print("-" * 60)
fila = f"{'O(n^2)':<15}"
for n in tamanos_cuadratico:
    val = resultados["O(n^2)"].get(n, 0)
    fila += f"{val:>9.3f}ms"
print(fila)

# ============================================================
# VISUALIZACION: crecimiento teorico
# ============================================================

print("\n" + "=" * 65)
print("CRECIMIENTO TEORICO: operaciones necesarias para cada N")
print("=" * 65)

print(f"\n{'N':>12} | {'O(1)':>8} | {'O(log n)':>10} | {'O(n)':>10} | {'O(n log n)':>12} | {'O(n^2)':>14}")
print("-" * 72)

for n in [10, 100, 1000, 10000, 100000, 1000000]:
    o1 = 1
    ologn = math.ceil(math.log2(n))
    on = n
    onlogn = n * math.ceil(math.log2(n))
    on2 = n * n
    print(f"{n:>12,} | {o1:>8} | {ologn:>10} | {on:>10,} | {onlogn:>12,} | {on2:>14,}")

# ============================================================
# REGLA PRACTICA: "la regla del segundo"
# ============================================================

print("\n" + "=" * 65)
print("REGLA PRACTICA para el analista de datos INEC:")
print("(asumiendo ~100 millones de operaciones/segundo)")
print("=" * 65)

velocidad = 100_000_000  # operaciones/segundo (computadora moderna)
n = 1_000_000  # 1 millon de registros

estimados = {
    "O(1)": 1,
    "O(log n)": math.log2(n),
    "O(n)": n,
    "O(n log n)": n * math.log2(n),
    "O(n^2)": n ** 2,
}

print(f"\n  N = {n:,} registros:")
for clase, ops in estimados.items():
    segundos = ops / velocidad
    if segundos < 0.001:
        tiempo_str = f"{segundos*1000:.4f} ms"
    elif segundos < 1:
        tiempo_str = f"{segundos:.2f} segundos"
    elif segundos < 3600:
        tiempo_str = f"{segundos/60:.1f} minutos"
    elif segundos < 86400:
        tiempo_str = f"{segundos/3600:.1f} horas"
    else:
        tiempo_str = f"{segundos/86400:.0f} dias"
    print(f"  {clase:<15}: {ops:>20,.0f} ops -> {tiempo_str}")
```

3. Ejecuta y analiza la tabla de resultados. ¿Corresponden los tiempos medidos con el crecimiento teorico?

4. Para O(n^2), duplica N de 500 a 1000. ¿El tiempo se multiplica por ~4? ¿Por que?

## Usa IA para...

> Abre Claude y escribe:
> "Soy estudiante de programacion. Explica Big O notation con ejemplos del mundo real de Ecuador (censo, banco, SRI). ¿Que significa que un algoritmo sea O(n^2) vs O(n log n) en terminos practicos si proceso 1 millon de registros del INEC?"

Despues de leer la respuesta:
- Verifica los estimados de tiempo con tu tabla de la seccion "Regla practica".
- Pregunta a Claude: "¿Que es la complejidad espacial (space complexity) y por que importa en procesamiento de datos masivos?"

## Que aprendiste

- Big O describe como crece el tiempo de ejecucion en funcion del tamano de la entrada (n), no el tiempo exacto.
- O(1) (constante) es ideal: acceso a indice, lectura de diccionario.
- O(log n) (logaritmico) es excelente: busqueda binaria, indices de BD.
- O(n) (lineal) es aceptable: recorrer una lista una vez.
- O(n log n) es el limite optimo para ordenamiento por comparacion: Merge Sort, Quick Sort, Timsort.
- O(n^2) (cuadratico) es problematico con n grande: dos bucles anidados que dependen de n.
- Con 1 millon de registros: O(n log n) tarda <1 segundo; O(n^2) tardaria 2+ horas.

## Reto extra

Escribe una funcion `analizar_distribucion_ingresos(datos)` que calcule los percentiles 25, 50, 75 y 90 del ingreso. Analiza su complejidad Big O. ¿Es posible calcularlo en O(n) en lugar de O(n log n)? (Pista: investiga el algoritmo de seleccion de k-esimo elemento de Quickselect).
