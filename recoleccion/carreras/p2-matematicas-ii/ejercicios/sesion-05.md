# Ejercicio Sesion 5: Espacios Vectoriales

**Materia:** Matematicas II (Algebra Lineal)
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Comprender los conceptos de subespacio vectorial, independencia lineal, base y dimension, y ver como estos conceptos explican por que ciertos datasets de ML tienen informacion redundante que se puede comprimir.

## Contexto

El Ministerio de Salud de Ecuador recopila 5 variables por paciente en sus hospitales: peso (kg), talla (cm), IMC (kg/m^2), edad (anos) y presion sistolica (mmHg). Un investigador nota que el IMC = peso / talla^2, es decir, el IMC se puede calcular a partir de peso y talla. Esto significa que el vector IMC es una combinacion lineal de los otros dos vectores — es informacion redundante.

**Muestra de 3 pacientes:**
```
         Peso  Talla  IMC   Edad  P.Sist
P1       70    170    24.2  35    120
P2       85    175    27.8  42    130
P3       60    160    23.4  28    115
```

## Instrucciones

**Parte 1 — Combinacion Lineal**

Dos vectores: v1 = [1, 2, 3] y v2 = [2, 4, 6].
- ¿Es v2 una combinacion lineal de v1? ¿Con que escalar?
- Si v2 = k * v1, entonces son **linealmente dependientes**.

**Parte 2 — Independencia Lineal**

Considera los vectores columna de la siguiente matriz (cada columna es una variable):
```
M = [[1, 0, 1],
     [0, 1, 1],
     [0, 0, 0]]
```
- La tercera columna = primera + segunda. ¿Son las tres columnas linealmente independientes?
- Verifica calculando el determinante. Si det = 0 → dependientes.

**Parte 3 — Rango de una Matriz**

El **rango** de una matriz es el numero de columnas (o filas) linealmente independientes — equivale a la dimension del espacio que "ocupa" la informacion.

```python
import numpy as np

# Dataset con IMC = f(peso, talla) — redundancia
datos = np.array([[70, 170, 24.2, 35, 120],
                  [85, 175, 27.8, 42, 130],
                  [60, 160, 23.4, 28, 115]])

print("Rango del dataset:", np.linalg.matrix_rank(datos))
print("Forma de la matriz:", datos.shape)
```

- ¿El rango es igual al numero de columnas (5)? ¿O es menor? ¿Por que?
- Elimina la columna del IMC y recalcula el rango. ¿Cambia?

**Parte 4 — Concepto de Base**

Una **base** de un espacio vectorial es el conjunto minimo de vectores independientes que pueden generar todos los demas vectores del espacio.
- Si el rango del dataset de salud es R, ¿cuantas variables son realmente necesarias para describir todos los pacientes?
- Anota la diferencia entre dimension del espacio (rango) y numero de variables originales.

**Parte 5 — Conexion con ML**

Responde:
- ¿Por que incluir variables redundantes (como IMC cuando ya tienes peso y talla) puede perjudicar un modelo de regresion?
- ¿Que tecnica de ML aprovecharemos en la sesion 8 para encontrar automaticamente la base optima de un dataset?

## Usa IA para...

> Abre Claude y escribe:
> "Soy estudiante de IA. Explicame con palabras simples: ¿que es un espacio vectorial? ¿que es la independencia lineal? ¿que es el rango de una matriz? Usa como ejemplo un dataset medico ecuatoriano donde el IMC es calculable a partir del peso y la talla. Explica como esto se relaciona con el problema de multicolinealidad en Machine Learning."

Luego pregunta:
> "¿Cuales son las consecuencias practicas de tener variables linealmente dependientes en un dataset cuando entrenas un modelo de regresion logistica?"

## Que aprendiste

- Un **espacio vectorial** es el conjunto de todas las combinaciones lineales posibles de un conjunto de vectores base.
- Dos vectores son **linealmente dependientes** si uno es multiplo del otro — representan la misma informacion.
- El **rango** de una matriz de datos dice cuantas variables son realmente independientes entre si.
- Variables **redundantes** aumentan el costo computacional, generan multicolinealidad y pueden degradar modelos.
- La **reduccion de dimensionalidad** (PCA, que veremos en sesion 8) busca automaticamente la base optima.

## Reto extra

Busca el dataset publico de diabetes del INEC Ecuador o cualquier dataset de salud ecuatoriana en kaggle.com o datos.gob.ec. Cargalo en Python, calcula su rango con numpy.linalg.matrix_rank y compara con el numero de columnas. ¿Cuantas variables son redundantes? ¿Cuales identificas visualmente como candidatas a ser eliminadas?
