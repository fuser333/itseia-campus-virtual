# Ejercicio Sesion 1: NumPy — Arrays y Operaciones Vectorizadas

**Materia:** Python para Ciencia de Datos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Dominar la creacion y manipulacion de arrays NumPy para procesar datos demograficos del Ecuador del INEC, aplicando operaciones vectorizadas, broadcasting y funciones de algebra lineal que son la base de cualquier modelo de ML.

## Contexto

El INEC (Instituto Nacional de Estadistica y Censos) publica el Censo de Poblacion y Vivienda con informacion de las 24 provincias del Ecuador: poblacion, superficie, densidad, indicadores de pobreza y acceso a servicios. Procesar estos datos en Python puro con bucles `for` es lento y poco escalable. NumPy vectoriza esas operaciones: en lugar de iterar provincia por provincia, procesa las 24 al mismo tiempo. Esta diferencia de velocidad se multiplica cuando tienes millones de registros en proyectos reales de Ciencia de Datos.

## Instrucciones

1. Abre Google Colab y crea `sesion01_numpy_provincias.ipynb`.

2. Crea los arrays con datos reales del INEC:

```python
# Python para Ciencia de Datos - Sesion 1: NumPy
# ITSEIA - Periodo 3

import numpy as np
import time

print(f"NumPy version: {np.__version__}")

# Datos reales INEC - Ecuador 24 provincias (Censo 2022 - estimados)
provincias = np.array([
    'Azuay', 'Bolivar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi',
    'El Oro', 'Esmeraldas', 'Galapagos', 'Guayas', 'Imbabura', 'Loja',
    'Los Rios', 'Manabi', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza',
    'Pichincha', 'Santa Elena', 'Santo Domingo', 'Sucumbios', 'Tungurahua', 'Zamora'
])

# Poblacion (miles de personas)
poblacion = np.array([
    838, 192, 243, 183, 534, 464, 637, 648, 33, 4351, 449, 520,
    836, 1436, 167, 120, 155, 100, 3228, 389, 459, 251, 579, 104
], dtype=np.float64)

# Superficie (km2)
superficie = np.array([
    8189, 3254, 3155, 3605, 6569, 6072, 5850, 16087, 8010, 17139,
    4611, 11063, 7203, 19571, 25690, 12542, 22985, 29520, 9960,
    3763, 3523, 18084, 3334, 10556
], dtype=np.float64)

# Porcentaje de acceso a internet (%) - INEC 2022
internet_pct = np.array([
    72, 38, 44, 55, 47, 43, 65, 41, 80, 70, 62, 52,
    44, 48, 30, 34, 33, 38, 82, 51, 58, 36, 65, 32
], dtype=np.float64)

print(f"Datos cargados: {len(provincias)} provincias")
print(f"Tipo de dato poblacion: {poblacion.dtype}")
print(f"Shape de arrays: {poblacion.shape}")
```

3. Operaciones vectorizadas fundamentales:

```python
# DENSIDAD POBLACIONAL (hab/km2) - vectorizado, sin bucles
densidad = (poblacion * 1000) / superficie
print("Top 5 provincias mas densas:")
top5_idx = np.argsort(densidad)[-5:][::-1]
for i in top5_idx:
    print(f"  {provincias[i]:18s}: {densidad[i]:.1f} hab/km2")

# ESTADISTICAS BASICAS con NumPy
print(f"\nPoblacion total Ecuador: {poblacion.sum()*1000:,.0f} habitantes")
print(f"Provincia mas poblada: {provincias[np.argmax(poblacion)]}")
print(f"Provincia menos poblada: {provincias[np.argmin(poblacion)]}")
print(f"Poblacion promedio: {poblacion.mean()*1000:,.0f} hab")
print(f"Desviacion estandar: {poblacion.std()*1000:,.0f} hab")

# INDEXACION BOOLEANA
sierra = np.array([True, True, True, True, True, True, False, False, False, False,
                   True, True, False, False, False, False, False, False, True,
                   False, False, False, True, False])
print(f"\nProvincias de la Sierra: {provincias[sierra].tolist()}")
print(f"Poblacion Sierra: {poblacion[sierra].sum()*1000:,.0f} hab")
print(f"Promedio internet Sierra: {internet_pct[sierra].mean():.1f}%")

# FILTROS CONDICIONALES
sin_internet = provincias[internet_pct < 40]
print(f"\nProvincias con menos del 40% internet: {sin_internet.tolist()}")
```

4. Operaciones matriciales y broadcasting:

```python
# BROADCASTING: calcular la brecha de cada provincia vs el promedio nacional
promedio_internet = internet_pct.mean()
brecha_internet = internet_pct - promedio_internet  # broadcasting automatico
print("Brecha de internet vs promedio nacional:")
print(f"(Promedio: {promedio_internet:.1f}%)")
for i in np.argsort(brecha_internet):
    signo = "+" if brecha_internet[i] >= 0 else ""
    print(f"  {provincias[i]:18s}: {signo}{brecha_internet[i]:.1f} puntos")

# ALGEBRA LINEAL: correlacion entre densidad poblacional e internet
correlacion = np.corrcoef(densidad, internet_pct)[0, 1]
print(f"\nCorrelacion densidad vs internet: {correlacion:.4f}")
print("Interpretacion: a mayor densidad poblacional,",
      "mayor acceso a internet" if correlacion > 0 else "menor acceso a internet")

# COMPARACION: Python puro vs NumPy (velocidad)
n_ops = 1_000_000
datos_gran = np.random.rand(n_ops)

# Python puro
inicio = time.time()
resultado_python = [x ** 2 for x in datos_gran]
tiempo_python = time.time() - inicio

# NumPy
inicio = time.time()
resultado_numpy = datos_gran ** 2
tiempo_numpy = time.time() - inicio

print(f"\n--- COMPARACION DE VELOCIDAD ({n_ops:,} elementos) ---")
print(f"Python puro:   {tiempo_python:.4f}s")
print(f"NumPy:         {tiempo_numpy:.4f}s")
print(f"NumPy es {tiempo_python/tiempo_numpy:.0f}x mas rapido")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "En NumPy explica con ejemplo el concepto de broadcasting. Si tengo un array de forma (24,) y quiero restarle la media para normalizarlo, ¿como funciona eso internamente? ¿Por que NumPy es mas rapido que Python puro para operaciones numericas?"

Despues de leer la respuesta:
- Implementa la normalizacion Min-Max de los datos de internet usando solo NumPy (sin sklearn).
- La formula es: `(x - x.min()) / (x.max() - x.min())`.

## Que aprendiste

- Los **arrays NumPy** son objetos especializados para calculo numerico: tipados, de dimension fija y con operaciones vectorizadas.
- Las **operaciones vectorizadas** procesan todo el array sin bucles: son entre 10x y 100x mas rapidas que Python puro.
- El **broadcasting** permite operar arrays de diferentes formas automaticamente, siguiendo reglas precisas.
- La **indexacion booleana** filtra datos usando condiciones logicas directamente sobre el array.
- `np.corrcoef` calcula la matriz de correlacion entre dos o mas variables en una sola llamada.

## Reto extra

Crea una matriz NumPy de 24x24 donde cada celda [i][j] representa la "similitud demografica" entre la provincia i y la provincia j, calculada como la diferencia absoluta en densidad poblacional normalizada. Luego encuentra las 3 parejas de provincias mas similares entre si segun esa metrica. Pista: usa `np.abs`, broadcasting y `np.fill_diagonal`.
