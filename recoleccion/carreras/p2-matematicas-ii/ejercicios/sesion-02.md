# Ejercicio Sesion 2: Matrices — Suma, Producto y Transpuesta

**Materia:** Matematicas II (Algebra Lineal)
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Operar matrices (suma, producto, transpuesta) con un dataset real de ventas por region en Ecuador, y entender por que el producto de matrices es la operacion central de las redes neuronales.

## Contexto

Una empresa ecuatoriana de tecnologia tiene ventas en 3 ciudades (Quito, Guayaquil, Cuenca) para 2 productos (Software IA, Consultoria). Los datos de Q1 y Q2 2024 se representan como matrices:

**Matriz A — Ventas Q1 2024 (miles USD):**
```
         Quito   GYE   Cuenca
Prod IA  [ 45     32     18  ]
Consult  [ 28     51     12  ]
```
A = [[45, 32, 18], [28, 51, 12]]

**Matriz B — Ventas Q2 2024 (miles USD):**
```
         Quito   GYE   Cuenca
Prod IA  [ 52     41     22  ]
Consult  [ 35     48     19  ]
```
B = [[52, 41, 22], [35, 48, 19]]

## Instrucciones

1. Calcula **A + B** (suma elemento a elemento). El resultado muestra ventas totales del semestre por ciudad y producto.

2. Calcula la **transpuesta de A** (A^T):
   - Las filas se convierten en columnas y viceversa.
   - A es 2x3, por lo tanto A^T es 3x2.
   - Escribe el resultado claramente.

3. Calcula el **producto matricial A^T * A**:
   - A^T es 3x2, A es 2x3 → el resultado es 3x3.
   - Para cada elemento (i,j) del resultado: multiplica la fila i de A^T por la columna j de A y suma.
   - Este calculo puede ser tedioso a mano — hazlo para la primera fila del resultado y el resto con Python.

4. Escribe el codigo Python para verificar todo:
```python
import numpy as np
A = np.array([[45, 32, 18], [28, 51, 12]])
B = np.array([[52, 41, 22], [35, 48, 19]])
print("A + B =", A + B)
print("A transpuesta =", A.T)
print("A^T * A =", A.T @ A)
```

5. Responde:
   - ¿Que dimension tiene A^T * A? ¿Y A * A^T?
   - En una red neuronal, si la capa de entrada tiene 3 neuronas y la capa oculta tiene 2, ¿de que tamano es la matriz de pesos?

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo la matriz A = [[45,32,18],[28,51,12]] que representa ventas de una empresa ecuatoriana. Calcula: (1) A transpuesta, (2) A^T multiplicado por A. Luego explicame por que en una red neuronal cada capa es basicamente una multiplicacion de matrices. Usa una red simple de 3 entradas y 2 neuronas como ejemplo."

Compara:
- ¿Los numeros de A^T * A coinciden con tu calculo manual de la primera fila?
- ¿La explicacion de redes neuronales tiene sentido con lo que ves en el codigo?

## Que aprendiste

- Una **matriz** es la forma natural de organizar datos tabulares: filas = observaciones, columnas = caracteristicas.
- La **suma de matrices** combina datasets del mismo tamano — como acumular datos de varios periodos.
- La **transpuesta** reorganiza la informacion — necesaria para alinear dimensiones en operaciones de ML.
- El **producto matricial** es la operacion mas importante del deep learning: cada capa de una red neuronal ES una multiplicacion de matrices seguida de una funcion de activacion.
- NumPy hace todas estas operaciones en microsegundos para matrices de millones de elementos.

## Reto extra

Imagina que agregas una tercera region (Loja) con ventas Q1 = [9, 7] (Prod IA y Consultoria). Modifica la matriz A para que sea 2x4 e intenta calcular de nuevo A^T * A. ¿Cambia la dimension del resultado? ¿Por que? Verifica con NumPy.
