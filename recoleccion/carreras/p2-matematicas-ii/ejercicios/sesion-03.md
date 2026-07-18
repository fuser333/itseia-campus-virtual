# Ejercicio Sesion 3: Determinantes e Inversa de Matrices

**Materia:** Matematicas II (Algebra Lineal)
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Calcular determinantes e inversas de matrices 2x2 y 3x3, y entender su relacion con la solucion de sistemas de ecuaciones que aparecen en la regresion lineal y otros algoritmos de ML.

## Contexto

El INEC Ecuador realizó una encuesta sobre tres factores que predicen el ingreso mensual de un hogar en Quito: años de educacion (X1), años de experiencia laboral (X2) y horas trabajadas por semana (X3). Para resolver el sistema de ecuaciones que encuentra los coeficientes del modelo predictivo, necesitamos calcular inversas de matrices.

**Matriz de correlaciones entre variables (simplificada):**
```
M = [[2,  1, -1],
     [1,  3,  1],
     [-1, 1,  4]]
```

Esta matriz aparece en el calculo de (X^T X)^-1 de la regresion lineal ordinaria (OLS).

## Instrucciones

**Parte 1 — Determinante de una matriz 2x2**

Dada la submatriz:
```
A = [[2, 1],
     [1, 3]]
```
- Formula: det(A) = a*d - b*c = 2*3 - 1*1 = ?
- Calcula el resultado. Si det != 0, la matriz tiene inversa.

**Parte 2 — Inversa de una matriz 2x2**

Formula para A^-1:
```
A^-1 = (1/det(A)) * [[d, -b], [-c, a]]
```
- Calcula A^-1 manualmente.
- Verifica: A * A^-1 debe dar la matriz identidad I = [[1,0],[0,1]].

**Parte 3 — Determinante de M (3x3)**

Expande por la primera fila usando cofactores:
```
det(M) = 2 * det([[3,1],[1,4]]) - 1 * det([[1,1],[-1,4]]) + (-1) * det([[1,3],[-1,1]])
```
- Calcula cada subdeterminante 2x2.
- Suma con los signos correctos.
- Verifica con Python:
```python
import numpy as np
M = np.array([[2,1,-1],[1,3,1],[-1,1,4]])
print("det(M) =", np.linalg.det(M))
print("M inversa =", np.linalg.inv(M))
```

**Parte 4 — Interpretacion ML**

Responde:
- ¿Que ocurre si el determinante de una matriz es 0? ¿Puedes invertirla?
- En regresion lineal, si dos variables predictoras (X1 y X2) son perfectamente correlacionadas, ¿que le pasa al determinante de X^T * X?
- ¿Que es la multicolinealidad y por que es un problema?

## Usa IA para...

> Abre Claude y escribe:
> "Soy estudiante de IA en Ecuador. Tengo la matriz M = [[2,1,-1],[1,3,1],[-1,1,4]]. Calcula su determinante e inversa paso a paso. Luego explicame: ¿por que en regresion lineal necesitamos invertir la matriz X^T*X? ¿Que pasa si esa matriz no es invertible? Dame un ejemplo con datos reales."

Compara:
- ¿El determinante que calculaste a mano coincide con el de Claude y con NumPy?
- ¿La explicacion sobre regresion lineal es clara? Pide que la simplifique si no.

## Que aprendiste

- El **determinante** indica si una matriz es invertible: det != 0 → invertible; det = 0 → singular (no invertible).
- La **inversa** de una matriz es el equivalente matricial de "dividir": A * A^-1 = I.
- En **regresion lineal OLS**, la solucion exacta es β = (X^T X)^-1 X^T y — requiere invertir una matriz.
- Si las variables estan **altamente correlacionadas** (multicolinealidad), X^T X se vuelve casi singular y los coeficientes se vuelven inestables o infinitos.
- Por eso scikit-learn usa metodos numericamente estables (descomposicion QR o SVD) en lugar de invertir directamente.

## Reto extra

Crea una matriz 2x2 donde las dos filas sean identicas (por ejemplo [[1,2],[1,2]]). Calcula su determinante. ¿Por que es 0? ¿Que significa esto en terminos de datos: si dos filas de una matriz de datos son identicas, que problema representa para el modelo?
