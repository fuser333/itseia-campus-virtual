# Ejercicio Sesion 4: Sistemas de Ecuaciones Lineales

**Materia:** Matematicas II (Algebra Lineal)
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Resolver sistemas de ecuaciones lineales con eliminacion gaussiana y con NumPy, aplicando el concepto a un problema real de asignacion de recursos en una empresa ecuatoriana de tecnologia.

## Contexto

La empresa H3L (h3l.ai, Quito) tiene tres equipos: Desarrollo (D), Datos (Da) y Consultoria (C). Cada proyecto requiere horas de los tres equipos. En marzo 2024 completaron tres proyectos con los siguientes requerimientos:

- Proyecto Banco Pichincha: 4D + 2Da + 1C = 320 horas totales
- Proyecto CNT: 2D + 5Da + 3C = 410 horas totales
- Proyecto Municipio Quito: 1D + 1Da + 4C = 230 horas totales

Queremos saber cuantas horas dedico CADA equipo a los proyectos (horas base por unidad de cada tipo de proyecto).

**Sistema en forma matricial Ax = b:**
```
A = [[4, 2, 1],      b = [[320],
     [2, 5, 3],           [410],
     [1, 1, 4]]           [230]]
```

## Instrucciones

**Parte 1 — Eliminacion Gaussiana Manual (sistema simplificado)**

Primero resuelve un sistema 2x2 para practicar el metodo:
```
2x + y = 14
x + 3y = 17
```
- Paso 1: Multiplica la segunda ecuacion por 2: 2x + 6y = 34
- Paso 2: Resta la primera: 5y = 20 → y = 4
- Paso 3: Sustituye y = 4 en la primera ecuacion: x = ?

**Parte 2 — Sistema 3x3 con Python**

Resuelve el sistema principal Ax = b:
```python
import numpy as np

A = np.array([[4, 2, 1],
              [2, 5, 3],
              [1, 1, 4]], dtype=float)

b = np.array([320, 410, 230], dtype=float)

# Metodo 1: usando la inversa
x_inv = np.linalg.inv(A) @ b
print("Solucion con inversa:", x_inv)

# Metodo 2: usando solve (mas estable numericamente)
x_solve = np.linalg.solve(A, b)
print("Solucion con solve:", x_solve)

# Verificacion
print("Verificacion A*x =", A @ x_solve)
print("b original =", b)
```

**Parte 3 — Interpretacion**

Con los valores de x = [D, Da, C] que obtuviste:
- ¿Cuantas horas dedico el equipo de Desarrollo (D)?
- ¿Cuantas el equipo de Datos (Da)?
- ¿Cuantas el equipo de Consultoria (C)?
- ¿El resultado tiene sentido? ¿Son numeros positivos y razonables?

**Parte 4 — Tipos de soluciones**

Modifica el sistema: cambia la tercera ecuacion por 2D + 4Da + 6C = 640 (exactamente el doble de la segunda). Corre el codigo. ¿Que error aparece? ¿Por que?

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un sistema de 3 ecuaciones que modela la asignacion de recursos de una empresa tech ecuatoriana: 4D + 2Da + 1C = 320, 2D + 5Da + 3C = 410, 1D + 1Da + 4C = 230. Resolvelo paso a paso usando eliminacion gaussiana. Luego explicame: ¿cuales son los tres posibles casos de un sistema de ecuaciones lineales (solucion unica, infinitas soluciones, sin solucion) y cuando aparece cada caso en problemas de Machine Learning?"

Compara:
- ¿La solucion de ChatGPT coincide con numpy.linalg.solve?
- Pide a ChatGPT que explique la diferencia entre usar la inversa directamente vs np.linalg.solve en terminos de precision numerica.

## Que aprendiste

- Un **sistema de ecuaciones lineal** modela situaciones donde multiples variables se relacionan entre si con restricciones.
- La **eliminacion gaussiana** es el algoritmo clasico para resolver estos sistemas — base de muchos solvers numericos.
- `np.linalg.solve` es mas estable que `inv(A) @ b` porque evita calcular la inversa explicita.
- En ML, los sistemas de ecuaciones aparecen en: regresion lineal (OLS), regularizacion (Ridge), redes de flujo y programacion lineal.
- Un sistema **inconsistente** (sin solucion) aparece cuando los datos son contradictorios — en ML, nunca hay solucion exacta, por eso minimizamos el error.

## Reto extra

Agrega un cuarto proyecto: "Proyecto SRI Ecuador: 3D + 3Da + 3C = 360 horas". Ahora tienes 4 ecuaciones y 3 incognitas — el sistema esta sobre-determinado. ¿Que pasa cuando corres numpy.linalg.solve? Investiga como usar numpy.linalg.lstsq para encontrar la solucion de minimos cuadrados (la que minimiza el error). Esto es exactamente lo que hace la regresion lineal.
