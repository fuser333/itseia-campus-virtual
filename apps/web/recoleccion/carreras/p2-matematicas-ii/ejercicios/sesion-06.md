# Ejercicio Sesion 6: Transformaciones Lineales

**Materia:** Matematicas II (Algebra Lineal)
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Entender las transformaciones lineales como funciones entre espacios vectoriales, visualizarlas geometricamente, y conectarlas con operaciones fundamentales en redes neuronales: rotacion, escalado, proyeccion y la capa densa (fully connected layer).

## Contexto

Cuando un modelo de vision por computadora del Hospital Metropolitano de Quito analiza una imagen medica, cada capa de la red neuronal aplica una transformacion lineal seguida de una funcion de activacion. La imagen de entrada (por ejemplo, 224x224 pixeles = 50,176 valores) se transforma progresivamente en una representacion abstracta que el modelo usa para diagnosticar.

Las transformaciones lineales son estas capas: T(v) = Av donde A es la matriz de pesos de la red.

## Instrucciones

**Parte 1 — Verificar si una funcion es una Transformacion Lineal**

Una transformacion T es lineal si cumple:
1. T(u + v) = T(u) + T(v) — preserva la suma
2. T(cu) = cT(u) — preserva el escalado

Prueba si las siguientes transformaciones son lineales:
- T1(x, y) = (2x, 3y) → multiplicar cada componente por una constante
- T2(x, y) = (x + 1, y) → trasladar en x
- T3(x, y) = (x^2, y) → elevar al cuadrado

Para T1: comprueba T1([1,0] + [0,1]) = T1([1,0]) + T1([0,1])
Para T2: ¿por que agregar una constante rompe la linealidad?

**Parte 2 — Matrices de Transformacion Comunes**

Calcula la imagen de los puntos v1=[1,0], v2=[0,1] y v3=[1,1] bajo cada transformacion:

a) **Escalado** (duplicar en x, triplicar en y):
```
S = [[2, 0],
     [0, 3]]
```

b) **Rotacion 90 grados**:
```
R = [[0, -1],
     [1,  0]]
```

c) **Proyeccion sobre el eje x**:
```
P = [[1, 0],
     [0, 0]]
```

Para cada una: calcula S*v1, S*v2, S*v3, R*v1, etc.

**Parte 3 — Composicion de Transformaciones**

En una red neuronal, aplicamos varias transformaciones en secuencia:
T_total(v) = T3(T2(T1(v))) = A3 * A2 * A1 * v

Calcula la transformacion compuesta C = R * S (primero escalar, luego rotar):
```python
import numpy as np
import matplotlib.pyplot as plt

S = np.array([[2, 0], [0, 3]])
R = np.array([[0, -1], [1, 0]])
C = R @ S

# Puntos originales
puntos = np.array([[1, 0], [0, 1], [1, 1], [0, 0]]).T

# Transformados
puntos_S = S @ puntos
puntos_C = C @ puntos

print("Original:", puntos.T)
print("Escalado:", puntos_S.T)
print("Escalado+Rotado:", puntos_C.T)
```

**Parte 4 — Conexion con Redes Neuronales**

Una capa densa (fully connected) realiza: salida = activacion(W * entrada + b)
- W es la matriz de pesos → transformacion lineal
- b es el vector de bias → traslacion (que rompe la linealidad pura)
- activacion (ReLU, sigmoid) → introduce no-linealidad

Responde:
- ¿Por que las redes neuronales necesitan funciones de activacion no lineales si cada capa es lineal?
- ¿Que pasaria si una red de 10 capas solo tuviera transformaciones lineales (sin activacion)?

## Usa IA para...

> Abre ChatGPT y escribe:
> "Explica las transformaciones lineales con animaciones mentales: si tengo un cuadrado de puntos en 2D y aplico la matriz de rotacion 45 grados y luego una de escalado, ¿que le pasa geometricamente? Luego conecta esto con lo que pasa en cada capa de una red neuronal convolucional que analiza imagenes medicas. ¿Por que necesitamos activaciones no lineales como ReLU?"

Pide ademas:
> "Dame el codigo Python con matplotlib para visualizar como la matriz [[2,1],[0,1]] transforma un cuadrado unitario."

## Que aprendiste

- Una **transformacion lineal** es una funcion entre espacios vectoriales que preserva suma y escalado.
- Geometricamente, las transformaciones lineales pueden: rotar, escalar, proyectar, reflejar y distorsionar espacios.
- La composicion de transformaciones = multiplicacion de sus matrices en orden.
- Cada **capa densa** de una red neuronal ES una transformacion lineal. Sin activaciones no lineales, toda la red colapsaria a una sola transformacion lineal.
- **ReLU, sigmoid, tanh** son las funciones de activacion que dan a las redes su capacidad de aprender patrones complejos.

## Reto extra

Investiga la transformacion de "corte" (shear en ingles): S = [[1, k], [0, 1]]. Prueba con k=0.5 y k=2. ¿Como se transforma geometricamente un cuadrado? ¿Esta transformacion es lineal? Visualizala con matplotlib y explica en que aplicaciones de procesamiento de imagenes o de texto podria ser util este tipo de transformacion.
