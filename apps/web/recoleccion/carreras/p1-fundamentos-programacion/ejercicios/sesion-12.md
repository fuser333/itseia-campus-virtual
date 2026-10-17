# Ejercicio Sesion 12: Toolkit de Analisis con Modulos

**Materia:** Fundamentos de Programacion
**Nivel:** Intermedio
**Herramienta IA:** GitHub Copilot
**Duracion estimada:** 40 min

## Objetivo

Organizar codigo en modulos propios y usar modulos de la libreria estandar de Python (`math`, `random`, `datetime`, `collections`, `statistics`, `csv`) para construir un toolkit de analisis academico modular y reutilizable.

## Contexto

En proyectos reales de IA y datos, el codigo se organiza en modulos: un archivo por responsabilidad. Esta es la base de la programacion modular y de los paquetes Python. Vamos a separar el sistema academico de ITSEIA en 3 modulos y un script principal.

## Instrucciones

1. Crea la siguiente estructura de carpetas y archivos:

```
sesion12_toolkit/
    __init__.py          (vacio)
    estadisticas.py      (modulo 1)
    reportes.py          (modulo 2)
    simulacion.py        (modulo 3)
    main.py              (script principal)
```

2. Crea `sesion12_toolkit/estadisticas.py`:

```python
# Modulo 1: Estadisticas con libreria estandar
# Usa: statistics, collections, math

import statistics
import math
from collections import Counter, defaultdict

def resumen_notas(notas_lista, nombre_grupo="Grupo"):
    """Calcula estadisticas completas de una lista de notas."""
    if not notas_lista:
        return {}

    return {
        "grupo": nombre_grupo,
        "n": len(notas_lista),
        "promedio": round(statistics.mean(notas_lista), 2),
        "mediana": statistics.median(notas_lista),
        "moda": statistics.mode(notas_lista) if len(notas_lista) > 1 else notas_lista[0],
        "desv_std": round(statistics.stdev(notas_lista), 2) if len(notas_lista) > 1 else 0,
        "varianza": round(statistics.variance(notas_lista), 2) if len(notas_lista) > 1 else 0,
        "minimo": min(notas_lista),
        "maximo": max(notas_lista),
        "rango": max(notas_lista) - min(notas_lista),
        "aprobados": sum(1 for n in notas_lista if n >= 7.0),
        "reprobados": sum(1 for n in notas_lista if n < 7.0),
        "pct_aprobacion": round(sum(1 for n in notas_lista if n >= 7.0) / len(notas_lista) * 100, 1)
    }

def distribucion_notas(notas_lista):
    """Retorna la distribucion de notas por rangos."""
    rangos = {
        "Sobresaliente (9-10)": 0,
        "Muy bueno (8-8.99)": 0,
        "Bueno (7-7.99)": 0,
        "Regular (5-6.99)": 0,
        "Insuficiente (<5)": 0
    }
    for nota in notas_lista:
        if nota >= 9.0:
            rangos["Sobresaliente (9-10)"] += 1
        elif nota >= 8.0:
            rangos["Muy bueno (8-8.99)"] += 1
        elif nota >= 7.0:
            rangos["Bueno (7-7.99)"] += 1
        elif nota >= 5.0:
            rangos["Regular (5-6.99)"] += 1
        else:
            rangos["Insuficiente (<5)"] += 1
    return rangos

def correlacion_simple(lista_x, lista_y):
    """Calcula correlacion de Pearson entre dos listas."""
    n = len(lista_x)
    if n != len(lista_y) or n < 2:
        return None
    mean_x = statistics.mean(lista_x)
    mean_y = statistics.mean(lista_y)
    numerador = sum((x - mean_x) * (y - mean_y) for x, y in zip(lista_x, lista_y))
    denom_x = math.sqrt(sum((x - mean_x) ** 2 for x in lista_x))
    denom_y = math.sqrt(sum((y - mean_y) ** 2 for y in lista_y))
    if denom_x == 0 or denom_y == 0:
        return 0
    return round(numerador / (denom_x * denom_y), 4)
```

3. Crea `sesion12_toolkit/simulacion.py`:

```python
# Modulo 2: Simulacion de datos con random y datetime

import random
import datetime
from datetime import timedelta

random.seed(42)  # reproducibilidad

NOMBRES = ["Ana", "Carlos", "Maria", "Diego", "Camila", "Luis",
           "Sofia", "Roberto", "Valeria", "Andres", "Paola", "Juan"]
APELLIDOS = ["Quispe", "Mora", "Torres", "Vera", "Jara", "Rosero",
             "Chavez", "Paredes", "Salazar", "Narvaez", "Granda", "Cevallos"]

def generar_estudiante(cedula_base=1000000000):
    """Genera datos de un estudiante aleatorio."""
    nombre = f"{random.choice(NOMBRES)} {random.choice(APELLIDOS)}"
    return {
        "cedula": str(cedula_base + random.randint(0, 999999)),
        "nombre": nombre,
        "edad": random.randint(18, 35),
        "notas": {
            "Python": round(random.uniform(5.0, 10.0), 1),
            "Matematicas": round(random.uniform(5.0, 10.0), 1),
            "Estadistica": round(random.uniform(5.0, 10.0), 1)
        },
        "asistencia_pct": round(random.uniform(60, 100), 1),
        "fraternidad": random.choice(["Luma", "Neo"])
    }

def generar_cohorte(n=30):
    """Genera una cohorte completa de estudiantes."""
    return [generar_estudiante() for _ in range(n)]

def generar_fechas_pago(n_meses=5, inicio="2026-03-01"):
    """Genera fechas de pago mensuales."""
    fecha = datetime.datetime.strptime(inicio, "%Y-%m-%d")
    fechas = []
    for i in range(n_meses):
        fechas.append((fecha + timedelta(days=30 * i)).strftime("%Y-%m-%d"))
    return fechas
```

4. Crea `sesion12_toolkit/reportes.py`:

```python
# Modulo 3: Generacion de reportes
from datetime import datetime

def imprimir_resumen(stats):
    """Imprime un resumen estadistico con formato."""
    print(f"\n{'='*55}")
    print(f"REPORTE: {stats['grupo']}")
    print(f"{'='*55}")
    print(f"  Estudiantes:      {stats['n']}")
    print(f"  Promedio:         {stats['promedio']}")
    print(f"  Mediana:          {stats['mediana']}")
    print(f"  Desv. estandar:   {stats['desv_std']}")
    print(f"  Rango:            {stats['minimo']} - {stats['maximo']}")
    print(f"  Aprobados:        {stats['aprobados']} ({stats['pct_aprobacion']}%)")
    print(f"  Reprobados:       {stats['reprobados']}")

def exportar_csv_reporte(estudiantes, archivo):
    """Exporta lista de estudiantes a CSV."""
    import csv
    with open(archivo, "w", newline="", encoding="utf-8") as f:
        campos = ["cedula", "nombre", "edad", "nota_python",
                  "nota_matematicas", "nota_estadistica",
                  "promedio", "fraternidad", "asistencia_pct"]
        writer = csv.DictWriter(f, fieldnames=campos)
        writer.writeheader()
        for est in estudiantes:
            promedio = sum(est["notas"].values()) / len(est["notas"])
            writer.writerow({
                "cedula": est["cedula"],
                "nombre": est["nombre"],
                "edad": est["edad"],
                "nota_python": est["notas"]["Python"],
                "nota_matematicas": est["notas"]["Matematicas"],
                "nota_estadistica": est["notas"]["Estadistica"],
                "promedio": round(promedio, 2),
                "fraternidad": est["fraternidad"],
                "asistencia_pct": est["asistencia_pct"]
            })
    print(f"  CSV exportado: {archivo}")
```

5. Crea `sesion12_toolkit/main.py`:

```python
# Script principal: usa los 3 modulos
# Importar modulos propios
from estadisticas import resumen_notas, distribucion_notas, correlacion_simple
from simulacion import generar_cohorte, generar_fechas_pago
from reportes import imprimir_resumen, exportar_csv_reporte

# Importar modulos de la libreria estandar
import datetime
import os

print("=" * 60)
print("TOOLKIT ACADEMICO ITSEIA - PERIODO 1")
print(f"Ejecutado: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}")
print("=" * 60)

# 1. Generar datos simulados
print("\nGenerando cohorte de 30 estudiantes...")
cohorte = generar_cohorte(30)

# 2. Extraer notas por materia
notas_python = [est["notas"]["Python"] for est in cohorte]
notas_mat = [est["notas"]["Matematicas"] for est in cohorte]
notas_est = [est["notas"]["Estadistica"] for est in cohorte]

# 3. Analisis estadistico
stats_python = resumen_notas(notas_python, "Python - Grupo 1")
stats_mat = resumen_notas(notas_mat, "Matematicas - Grupo 1")

imprimir_resumen(stats_python)
imprimir_resumen(stats_mat)

# 4. Distribucion
print("\n--- DISTRIBUCION NOTAS PYTHON ---")
dist = distribucion_notas(notas_python)
for rango, cantidad in dist.items():
    barra = "#" * cantidad
    print(f"  {rango:<30}: {barra} ({cantidad})")

# 5. Correlacion
corr = correlacion_simple(notas_python, notas_mat)
print(f"\nCorrelacion Python vs Matematicas: {corr}")
if corr and abs(corr) > 0.5:
    print("  => Correlacion significativa")
else:
    print("  => Correlacion debil")

# 6. Exportar
os.makedirs("salidas", exist_ok=True)
exportar_csv_reporte(cohorte, "salidas/cohorte_periodo1.csv")

# 7. Fechas de pago
fechas = generar_fechas_pago(5)
print(f"\nFechas de pago Periodo 1: {fechas}")

print("\n" + "=" * 60)
print("Toolkit ejecutado correctamente.")
```

6. Ejecuta `main.py` desde la carpeta `sesion12_toolkit/`.

## Usa IA para...

> Abre GitHub Copilot (VS Code) o Claude y escribe:
> "¿Cual es la diferencia entre 'import modulo', 'from modulo import funcion', y 'from modulo import *' en Python? ¿Cual es la mejor practica y por que? ¿Que es __init__.py y cuando se necesita?"

Despues de leer la respuesta:
- ¿Tu `main.py` usa las importaciones de la forma mas legible?
- Prueba cambiar una importacion de estilo a otro y verifica que sigue funcionando.

## Que aprendiste

- Un modulo es cualquier archivo `.py` que puedes importar.
- `import modulo` importa todo; `from modulo import nombre` importa solo lo necesario.
- La libreria estandar de Python tiene modulos poderosos sin instalar nada.
- `statistics` incluye `mean`, `median`, `stdev`, `variance` directamente.
- `random.seed()` hace los resultados reproducibles.
- `csv.DictWriter` simplifica la escritura de archivos CSV con encabezados.

## Reto extra

Agrega un modulo `sesion12_toolkit/visualizacion_texto.py` que contenga una funcion `histograma_ascii(datos, titulo)` que dibuje un histograma horizontal usando caracteres de texto (sin matplotlib). Importa y usa esa funcion en `main.py` para mostrar la distribucion de notas de Python.
