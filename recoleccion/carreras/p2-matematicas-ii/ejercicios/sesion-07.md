# Ejercicio Sesion 7: Valores y Vectores Propios (Eigenvalues y Eigenvectors)

**Materia:** Matematicas II (Algebra Lineal)
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Calcular eigenvalues y eigenvectors de una matriz, entender su significado geometrico, y comprender por que son la base matematica de PCA, el algoritmo de reduccion de dimensionalidad mas importante del ML.

## Contexto

La empresa ImagemIA (imagemia.com, Quito) analiza imagenes de radiografias. Cada imagen es una matriz de pixeles de alta dimension. Para identificar las "direcciones" mas importantes de variacion en un conjunto de 10,000 radiografias, se calcula la descomposicion espectral de la matriz de covarianza. Los eigenvectors son esas direcciones importantes — los "ejes principales" de los datos.

**Intuicion:** Si aplicas una transformacion lineal A a un vector v y el resultado es simplemente v escalado (no rotado), entonces v es un eigenvector y el factor de escala es el eigenvalue:

```
A * v = λ * v
```

## Instrucciones

**Parte 1 — Calculo Manual para Matriz 2x2**

```
A = [[3, 1],
     [0, 2]]
```

Paso 1: Encuentra los eigenvalues resolviendo det(A - λI) = 0
```
det([[3-λ, 1  ],
     [0,   2-λ]]) = 0

(3-λ)(2-λ) - 0 = 0
λ^2 - 5λ + 6 = 0
```
Factoriza y encuentra los dos valores de λ.

Paso 2: Para cada eigenvalue λ, encuentra el eigenvector resolviendo (A - λI)v = 0.
- Para λ1: sustituye en el sistema y encuentra v1 = [a, b] (vector columna no nulo).
- Para λ2: repite el proceso.

**Parte 2 — Verificacion con NumPy**

```python
import numpy as np

A = np.array([[3, 1],
              [0, 2]], dtype=float)

eigenvalues, eigenvectors = np.linalg.eig(A)
print("Eigenvalues:", eigenvalues)
print("Eigenvectors (columnas):")
print(eigenvectors)

# Verificacion: A*v = lambda*v
for i in range(len(eigenvalues)):
    lam = eigenvalues[i]
    v = eigenvectors[:, i]
    print(f"\nλ={lam:.2f}: A*v = {A @ v}, λ*v = {lam * v}")
```

**Parte 3 — Matriz de Covarianza de Datos Reales**

```python
import numpy as np

# Datos: 10 empleados tech Quito (anos experiencia, sueldo en miles)
experiencia = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
sueldo =      [0.8, 1.1, 1.4, 1.8, 2.2, 2.5, 2.9, 3.4, 3.8, 4.2]

X = np.array([experiencia, sueldo])

# Matriz de covarianza
cov_matrix = np.cov(X)
print("Matriz de covarianza:")
print(cov_matrix)

# Eigenvalues y eigenvectors de la covarianza
eigenvalues, eigenvectors = np.linalg.eig(cov_matrix)
print("\nEigenvalues:", eigenvalues)
print("Eigenvectors:", eigenvectors)

# El mayor eigenvalue indica la direccion de mayor varianza
idx_max = np.argmax(eigenvalues)
print(f"\nPrincipal direction (PC1): {eigenvectors[:, idx_max]}")
print(f"Explains {eigenvalues[idx_max]/sum(eigenvalues)*100:.1f}% of variance")
```

**Parte 4 — Interpretacion**

- ¿Cual eigenvalue es mayor? ¿Que significa que sea mayor?
- El eigenvector asociado al mayor eigenvalue, ¿en que direccion apunta en el espacio experiencia-sueldo?
- ¿Que porcentaje de la varianza total captura el primer componente principal?

## Usa IA para...

> Abre Claude y escribe:
> "Soy estudiante de IA en Ecuador. Necesito entender eigenvalues y eigenvectors. Tengo la matriz A = [[3,1],[0,2]]. Calcula sus eigenvalues y eigenvectors paso a paso. Luego, con una analogia visual, explicame que significan geometricamente los eigenvectors de una matriz de covarianza de datos. ¿Por que el eigenvector con mayor eigenvalue es la 'direccion mas importante' de los datos?"

Pide ademas:
> "¿Como se relacionan los eigenvalues y eigenvectors con la descomposicion SVD (Singular Value Decomposition) que usan modelos de lenguaje como ChatGPT?"

## Que aprendiste

- Un **eigenvector** es una direccion especial que una transformacion lineal no rota, solo escala.
- El **eigenvalue** es el factor de escala correspondiente — mide cuanto "estira" la transformacion en esa direccion.
- La **descomposicion espectral** de una matriz de covarianza da los ejes principales de variacion de los datos.
- El eigenvector con el mayor eigenvalue captura la mayor cantidad de informacion del dataset.
- PCA (siguiente sesion) usa directamente estos calculos para comprimir datos de miles de dimensiones a 2 o 3.

## Reto extra

Investiga la "ecuacion caracteristica" de una matriz 3x3. ¿Por que una matriz NxN siempre tiene exactamente N eigenvalues (contando multiplicidades y valores complejos)? Busca en Wikipedia "Teorema espectral" y discute: ¿para que tipo de matrices estan garantizados los eigenvalues reales (no complejos)? Pista: matrices simetricas. ¿Y la matriz de covarianza es simetrica? ¿Por que?
