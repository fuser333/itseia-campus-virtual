# Ejercicio Sesion 1: Vectores y Operaciones Basicas

**Materia:** Matematicas II (Algebra Lineal)
**Nivel:** Basico
**Herramienta IA:** Claude
**Duracion estimada:** 30 min

## Objetivo

Representar datos reales de Ecuador como vectores y realizar operaciones basicas (suma, resta, producto escalar) para entender como el algebra lineal modela informacion del mundo real antes de aplicarla en ML.

## Contexto

En Machine Learning, cada observacion (un cliente, un paciente, un estudiante) se representa como un vector de caracteristicas. Por ejemplo, el Banco Central del Ecuador (BCE) reporta datos macroeconomicos mensuales: inflacion, desempleo y variacion del PIB. Cada mes es un vector en R^3.

**Dataset — Indicadores macroeconomicos Ecuador (BCE, 2024):**

| Mes       | Inflacion (%) | Desempleo (%) | Variacion PIB (%) |
|-----------|--------------|---------------|-------------------|
| Enero     | 1.2          | 3.8           | 2.1               |
| Febrero   | 1.4          | 3.6           | 2.3               |
| Marzo     | 1.1          | 4.0           | 1.9               |

Representacion vectorial:
- v_enero = [1.2, 3.8, 2.1]
- v_febrero = [1.4, 3.6, 2.3]
- v_marzo = [1.1, 4.0, 1.9]

## Instrucciones

1. Escribe los tres vectores claramente en tu cuaderno con notacion de columna.

2. Calcula **v_enero + v_febrero** sumando componente a componente:
   - Resultado[0] = 1.2 + 1.4
   - Resultado[1] = 3.8 + 3.6
   - Resultado[2] = 2.1 + 2.3

3. Calcula el **promedio vectorial** de los tres meses (suma los tres y divide cada componente entre 3). Este vector representa el trimestre promedio.

4. Calcula el **producto escalar** (dot product) de v_enero y v_febrero:
   - dot(v1, v2) = v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2]
   - Interpreta: un dot product alto indica que los dos meses se comportaron de forma similar.

5. Calcula la **magnitud (norma)** de v_enero:
   - ||v|| = sqrt(1.2^2 + 3.8^2 + 2.1^2)
   - Usa calculadora o Python para la raiz cuadrada.

6. Responde:
   - ¿Que significa geometricamente la magnitud de un vector de indicadores economicos?
   - Si un modelo de ML recibe este vector como entrada, ¿que "aprende" con el dot product?

## Usa IA para...

> Abre Claude y escribe:
> "Tengo vectores de indicadores economicos de Ecuador: v_enero = [1.2, 3.8, 2.1], v_febrero = [1.4, 3.6, 2.3]. Calcula: (1) su suma, (2) el promedio vectorial, (3) el producto escalar, (4) la magnitud de cada uno. Luego explicame en que parte de un modelo de Machine Learning se usan estas operaciones de vectores. Dame un ejemplo concreto."

Compara:
- ¿Coinciden los numeros con los tuyos?
- ¿La explicacion de ML tiene sentido?
- Pide a Claude que explique la diferencia entre suma vectorial y producto escalar con una analogia simple.

## Que aprendiste

- Un **vector** es simplemente una lista ordenada de numeros que representa un objeto del mundo real.
- La **suma vectorial** combina dos observaciones — en ML, puede representar la union de caracteristicas.
- El **producto escalar** mide similitud entre vectores — base de algoritmos como KNN y redes neuronales.
- La **magnitud** mide el "tamano" de un vector — base de la normalizacion de datos antes del entrenamiento.
- Cada fila de tu dataset de entrenamiento ES un vector. El algebra lineal es el lenguaje nativo del ML.

## Reto extra

Descarga del BCE (bce.fin.ec/estadisticas) los datos reales de inflacion y desempleo de los ultimos 6 meses de 2024. Crea 6 vectores y calcula la magnitud de cada uno. ¿En que mes Ecuador tuvo el vector de mayor magnitud? ¿Que significaria eso para un modelo predictivo?
