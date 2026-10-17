# Ejercicio Sesion 6: Libreria de Funciones para Analisis de Datos

**Materia:** Fundamentos de Programacion
**Nivel:** Basico
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Crear una libreria de funciones reutilizables para calcular estadisticas basicas (promedio, mediana, moda, desviacion estandar) sin usar librerias externas, aplicadas a datos reales de salarios del sector tech en Ecuador.

## Contexto

Antes de usar pandas o numpy, un buen programador debe entender como funcionan las estadisticas basicas desde cero. Vamos a construir nuestras propias funciones y aplicarlas a un dataset real de salarios publicados en ofertas de empleo ecuatorianas (LinkedIn, Computrabajo, Indeed Ecuador 2025).

## Instrucciones

1. Crea un archivo `sesion06_libreria_estadisticas.py`.

2. Construye las funciones una a una y pruebalas:

```python
# Libreria de funciones estadisticas - Sin librerias externas
# Aplicado a: Salarios Tech Ecuador 2025

# ================================================
# DEFINICION DE FUNCIONES
# ================================================

def calcular_promedio(datos):
    """Calcula el promedio aritmetico de una lista de numeros."""
    if len(datos) == 0:
        return 0
    return sum(datos) / len(datos)


def calcular_mediana(datos):
    """Calcula el valor central de una lista ordenada."""
    datos_ordenados = sorted(datos)
    n = len(datos_ordenados)
    mitad = n // 2
    if n % 2 == 0:
        return (datos_ordenados[mitad - 1] + datos_ordenados[mitad]) / 2
    else:
        return datos_ordenados[mitad]


def calcular_moda(datos):
    """Devuelve el valor que mas se repite."""
    frecuencias = {}
    for valor in datos:
        frecuencias[valor] = frecuencias.get(valor, 0) + 1
    return max(frecuencias, key=frecuencias.get)


def calcular_varianza(datos):
    """Calcula la varianza de la poblacion."""
    prom = calcular_promedio(datos)
    suma_cuadrados = sum((x - prom) ** 2 for x in datos)
    return suma_cuadrados / len(datos)


def calcular_desviacion_estandar(datos):
    """Calcula la desviacion estandar (raiz de la varianza)."""
    return calcular_varianza(datos) ** 0.5


def clasificar_salario(salario, promedio, desviacion):
    """Clasifica un salario respecto al promedio del mercado."""
    if salario > promedio + desviacion:
        return "SOBRE el mercado"
    elif salario < promedio - desviacion:
        return "BAJO el mercado"
    else:
        return "EN el mercado"


def resumen_estadistico(nombre_dataset, datos):
    """Genera un resumen estadistico completo de un dataset."""
    print(f"\n{'=' * 55}")
    print(f"ANALISIS: {nombre_dataset}")
    print(f"{'=' * 55}")
    print(f"N registros:       {len(datos)}")
    print(f"Minimo:            ${min(datos):,.2f}")
    print(f"Maximo:            ${max(datos):,.2f}")
    print(f"Promedio:          ${calcular_promedio(datos):,.2f}")
    print(f"Mediana:           ${calcular_mediana(datos):,.2f}")
    print(f"Desv. estandar:    ${calcular_desviacion_estandar(datos):,.2f}")
    rango = max(datos) - min(datos)
    print(f"Rango:             ${rango:,.2f}")


# ================================================
# DATASET REAL: Salarios ofertas Ecuador 2025
# Fuente: LinkedIn Ecuador / Computrabajo Feb 2025
# ================================================

salarios_data_analyst = [
    700, 750, 800, 850, 800, 900, 750, 1100, 1200, 950,
    800, 700, 850, 1000, 750, 900, 800, 850, 700, 900
]

salarios_ml_engineer = [
    1200, 1400, 1500, 1300, 1600, 1200, 1800, 1400, 1350,
    1500, 1200, 1700, 1450, 1300, 1600, 1400, 1250, 1500
]

salarios_software_dev = [
    600, 700, 750, 800, 650, 700, 900, 800, 750, 600,
    700, 850, 800, 750, 700, 600, 900, 800, 700, 750
]

# ================================================
# EJECUTAR ANALISIS
# ================================================

resumen_estadistico("Data Analyst Junior - Ecuador", salarios_data_analyst)
resumen_estadistico("ML Engineer Junior - Ecuador", salarios_ml_engineer)
resumen_estadistico("Software Developer Junior - Ecuador", salarios_software_dev)

# ================================================
# CLASIFICAR UN SALARIO ESPECIFICO
# ================================================
print("\n--- CLASIFICACION DE SALARIO ---")
mi_salario = 950
prom = calcular_promedio(salarios_data_analyst)
desv = calcular_desviacion_estandar(salarios_data_analyst)
clasificacion = clasificar_salario(mi_salario, prom, desv)
print(f"Mi salario ofertado: ${mi_salario}")
print(f"Promedio mercado:    ${prom:.2f}")
print(f"Desviacion:          ${desv:.2f}")
print(f"Clasificacion:       {clasificacion}")
```

3. Ejecuta el programa y verifica que todas las funciones retornan valores coherentes.

4. Agrega una nueva funcion llamada `calcular_percentil(datos, percentil)` que reciba una lista y un numero entre 0-100, y devuelva el valor en ese percentil. Proba con `calcular_percentil(salarios_data_analyst, 75)`.

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Tengo estas funciones estadisticas en Python escritas desde cero. Revisa mi funcion calcular_mediana y dime si hay algun caso borde donde podria fallar. ¿Como la mejorarias?"

Copia tu funcion `calcular_mediana` en el mensaje.

Despues de leer la respuesta:
- ¿Encontro algun bug o caso borde?
- Aplica las mejoras sugeridas si son validas.

## Que aprendiste

- Una funcion en Python se define con `def nombre(parametros):`.
- `return` devuelve el resultado; sin `return` la funcion devuelve `None`.
- Los docstrings (`"""texto"""`) documentan que hace cada funcion.
- Funciones pequenas y bien nombradas hacen el codigo reutilizable.
- La desviacion estandar mide que tan dispersos estan los datos respecto al promedio.

## Reto extra

Crea una funcion `detectar_outliers(datos)` que use la regla IQR (rango intercuartilico): un dato es outlier si esta por debajo de Q1 - 1.5*IQR o por encima de Q3 + 1.5*IQR. Aplica esta funcion a los tres datasets de salarios y reporta cuales salarios son outliers.
