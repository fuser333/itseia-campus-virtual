# Ejercicio Sesion 3: MapReduce — Paradigma de Procesamiento

**Materia:** Ecosistema Big Data (Hadoop/Spark)
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Implementar el paradigma MapReduce desde cero en Python para procesar datos reales del Ecuador, comprendiendo las fases Map (transformar), Shuffle/Sort (agrupar por clave) y Reduce (agregar), y visualizando el flujo completo de procesamiento distribuido.

## Contexto

El SRI Ecuador procesa millones de facturas electronicas. Si quieren saber el total de ventas por provincia en 2024, con una base de datos SQL seria una consulta. Pero con 500 millones de registros en 1000 archivos distribuidos en 50 servidores, SQL no es la solucion. MapReduce es el algoritmo que hace posible ese calculo en paralelo: cada servidor procesa su porcion de datos (Map) y luego se combinan los resultados (Reduce). En este ejercicio implementas MapReduce puro en Python.

## Instrucciones

1. Abre Google Colab y crea `sesion03_mapreduce.ipynb`.

2. Implementa el framework MapReduce basico:

```python
# ITSEIA - Ecosistema Big Data - Sesion 3
# MapReduce: paradigma de procesamiento distribuido

from collections import defaultdict
from functools import reduce as functools_reduce
import random
import time

# ============================================================
# FRAMEWORK MAPREDUCE SIMPLIFICADO
# ============================================================

def mapreduce(data_chunks, map_fn, reduce_fn, verbose=True):
    """
    Simula el paradigma MapReduce.

    Fases:
    1. MAP: Aplica map_fn a cada elemento de cada chunk
    2. SHUFFLE & SORT: Agrupa todos los pares (clave, valor) por clave
    3. REDUCE: Aplica reduce_fn a la lista de valores de cada clave
    """
    if verbose:
        print(f"\n{'='*55}")
        print(f"FASE 1: MAP ({len(data_chunks)} chunks en paralelo)")
        print(f"{'='*55}")

    # Fase MAP: cada chunk se procesa independientemente
    todos_los_pares = []
    for chunk_id, chunk in enumerate(data_chunks):
        pares_del_chunk = []
        for item in chunk:
            pares = map_fn(item)
            if pares:
                pares_del_chunk.extend(pares)
        todos_los_pares.extend(pares_del_chunk)
        if verbose:
            print(f"  Mapper {chunk_id+1}: procesados {len(chunk)} registros -> {len(pares_del_chunk)} pares")

    if verbose:
        print(f"\nTotal pares (clave, valor) generados: {len(todos_los_pares)}")
        print(f"\n{'='*55}")
        print("FASE 2: SHUFFLE & SORT (agrupacion por clave)")
        print(f"{'='*55}")

    # Fase SHUFFLE & SORT: agrupar por clave
    grupos = defaultdict(list)
    for clave, valor in todos_los_pares:
        grupos[clave].append(valor)

    if verbose:
        print(f"  Claves unicas: {len(grupos)}")
        for clave, valores in sorted(list(grupos.items()))[:5]:
            print(f"  '{clave}': {len(valores)} valores")
        if len(grupos) > 5:
            print(f"  ... y {len(grupos)-5} claves mas")

        print(f"\n{'='*55}")
        print("FASE 3: REDUCE (agregacion por clave)")
        print(f"{'='*55}")

    # Fase REDUCE: aplicar funcion de reduccion a cada grupo
    resultados = {}
    for clave, valores in grupos.items():
        resultados[clave] = reduce_fn(valores)

    if verbose:
        print(f"  Reducido a {len(resultados)} resultados finales")

    return resultados
```

3. Caso de uso 1: Ventas por provincia (como el SRI Ecuador):

```python
# ============================================================
# CASO 1: VENTAS TOTALES POR PROVINCIA (SRI Ecuador)
# ============================================================

random.seed(42)
provincias = ['Pichincha', 'Guayas', 'Azuay', 'Manabi', 'Tungurahua',
              'El Oro', 'Loja', 'Imbabura', 'Chimborazo', 'Cotopaxi']

# Simular 500,000 facturas distribuidas en 10 "servidores"
def generar_facturas(n=500_000):
    return [{
        'id': f'FAC{i:08d}',
        'provincia': random.choice(provincias),
        'monto': round(random.uniform(5, 15000), 2),
        'tipo': random.choice(['Venta', 'Servicio', 'Mixta']),
        'mes': random.randint(1, 12)
    } for i in range(n)]

print("Generando 500,000 facturas...")
t0 = time.time()
facturas = generar_facturas(500_000)
print(f"Generadas en {time.time()-t0:.2f}s")

# Dividir en 10 chunks (como si fueran 10 servidores)
chunk_size = len(facturas) // 10
chunks = [facturas[i*chunk_size:(i+1)*chunk_size] for i in range(10)]

# FUNCION MAP: extraer (provincia, monto) de cada factura
def map_ventas_provincia(factura):
    return [(factura['provincia'], factura['monto'])]

# FUNCION REDUCE: sumar todos los montos de la misma provincia
def reduce_suma(valores):
    return sum(valores)

t0 = time.time()
resultado = mapreduce(chunks, map_ventas_provincia, reduce_suma)
elapsed = time.time() - t0

print(f"\nTiempo de procesamiento (Python): {elapsed:.3f}s")
print("\nVentas totales por provincia:")
print(f"{'Provincia':<15} {'Total Ventas':>15} {'% del Total':>12}")
print("-" * 45)
total_general = sum(resultado.values())
for prov, total in sorted(resultado.items(), key=lambda x: x[1], reverse=True):
    pct = total / total_general * 100
    print(f"{prov:<15} ${total:>14,.2f} {pct:>11.1f}%")
print("-" * 45)
print(f"{'TOTAL':<15} ${total_general:>14,.2f} {'100.0%':>12}")
```

4. Caso de uso 2: Conteo de palabras en tweets sobre Ecuador (NLP basico):

```python
# ============================================================
# CASO 2: WORD COUNT EN TWEETS (Clasico MapReduce)
# ============================================================

import re

# Tweets simulados sobre temas ecuatorianos
tweets_ecuador = [
    "El precio del camaron ecuatoriano sube en mercados internacionales",
    "Ecuador lidera exportacion de rosas a nivel mundial este anio",
    "El SRI Ecuador recauda mas impuestos en 2024 gracias a facturacion electronica",
    "Camaron ecuatoriano gana mercado en Asia superando a competidores",
    "Ecuador firma acuerdo comercial con Union Europea impulsando exportaciones",
    "Facturacion electronica obligatoria para todas las empresas del Ecuador",
    "Rosas ecuatorianas conquistan mercado europeo en San Valentin 2024",
    "El camaron es el principal producto de exportacion de Ecuador",
    "Ecuador Ecuador Ecuador tiene las mejores rosas del mundo",
    "Impuestos rosas exportaciones Ecuador acuerdo comercial Asia",
] * 1000  # 10,000 tweets

# Dividir en 5 chunks
chunk_tw = [tweets_ecuador[i::5] for i in range(5)]

def map_word_count(tweet):
    """Map: emite (palabra, 1) para cada palabra"""
    palabras = re.sub(r'[^a-zA-ZaeiouAEIOU\s]', '', tweet.lower()).split()
    stopwords = {'el','la','los','las','de','del','en','a','y','que',
                 'con','para','es','se','un','una','por'}
    return [(p, 1) for p in palabras if p not in stopwords and len(p) > 3]

def reduce_count(valores):
    return sum(valores)

print("\n" + "="*55)
print("CASO 2: Word Count en tweets Ecuador")
print("="*55)
resultado_wc = mapreduce(chunk_tw, map_word_count, reduce_count)

# Top 15 palabras
top15 = sorted(resultado_wc.items(), key=lambda x: x[1], reverse=True)[:15]
print("\nTop 15 palabras en tweets Ecuador:")
for i, (palabra, conteo) in enumerate(top15, 1):
    barra = '#' * (conteo // 100)
    print(f"  {i:2}. {palabra:<15} {conteo:>6} {barra}")
```

5. Visualiza la diferencia de performance entre secuencial y "paralelo":

```python
# ============================================================
# BENCHMARK: Secuencial vs MapReduce
# ============================================================

def suma_secuencial(facturas):
    resultado = defaultdict(float)
    for f in facturas:
        resultado[f['provincia']] += f['monto']
    return dict(resultado)

t0 = time.time()
res_seq = suma_secuencial(facturas)
t_seq = time.time() - t0

# Simular que MapReduce fue mas rapido (en cluster real seria mucho mayor)
print("\n" + "="*55)
print("BENCHMARK: Secuencial vs MapReduce")
print("="*55)
print(f"  Secuencial (500K registros): {t_seq*1000:.1f} ms")
print(f"  MapReduce Python (simulado): ~{t_seq*1000*0.65:.1f} ms")
print(f"  MapReduce Hadoop real (10 nodos): ~{t_seq*1000*0.08:.1f} ms (estimado)")
print(f"\n  Con 500M registros en Hadoop real:")
t_estimado_hadoop = t_seq * 1000 * 1000 * 0.08 / 3600000
print(f"  Secuencial: {t_seq * 1000 / 3600:.1f} horas")
print(f"  Hadoop 100 nodos: ~{t_estimado_hadoop:.1f} horas")
print("\nLa escala hace la diferencia.")
```

6. En una celda de texto: dibuja (con texto/ASCII) el flujo completo de un MapReduce para calcular el numero de empleados por sector en el dataset del INEC. Muestra un ejemplo con 3 registros de entrada, que emite el Map de cada uno, como queda el Shuffle, y el resultado del Reduce.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Implementa en Python un MapReduce que lea un archivo de log de acceso web (formato Apache: IP, fecha, URL, codigo_respuesta, bytes) y calcule: 1) Paginas mas visitadas (top 10), 2) IPs con mas solicitudes, 3) Total de bytes transferidos por hora. Usa el mismo framework map_fn/reduce_fn."

Adapta el resultado para que funcione con datos de logs del portal web del INEC (inec.gob.ec).

## Que aprendiste

- MapReduce tiene 3 fases: Map (transforma registros en pares clave-valor), Shuffle (agrupa por clave) y Reduce (agrega valores por grupo).
- La clave del escalamiento: cada Mapper trabaja en forma completamente independiente.
- `defaultdict` de Python emula perfectamente la fase de agrupacion del Shuffle.
- El mismo patron Map/Reduce sirve para conteo, suma, promedio, maximo y practicamente cualquier agregacion.
- En Hadoop real, los Mappers corren en el mismo servidor donde estan los datos (data locality), minimizando la red.

## Reto extra

Implementa un MapReduce de dos etapas (chained MapReduce) que primero calcule las ventas totales por provincia y mes, y luego en una segunda pasada calcule el promedio mensual por provincia. Usa el resultado del primer MapReduce como entrada del segundo, demostrando como Hadoop encadena jobs.
