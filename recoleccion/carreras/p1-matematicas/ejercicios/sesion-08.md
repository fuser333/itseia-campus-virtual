# Ejercicio Sesion 8: Correlacion y Regresion Lineal — Prediccion de Precios de Vivienda

**Materia:** Matematicas I (Estadistica)
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Calcular el coeficiente de correlacion de Pearson y construir un modelo de regresion lineal simple para predecir precios de vivienda en Quito usando datos reales del mercado inmobiliario ecuatoriano.

## Contexto

Properati y Plusvalia.com son los portales inmobiliarios mas grandes de Ecuador. Segun sus datos publicos de 2024, existe una relacion entre el area en m2 y el precio de departamentos en el norte de Quito. Los siguientes datos son una muestra representativa:

**Dataset — Departamentos Norte de Quito 2024:**

| # | Area (m2) | Precio (USD) |
|---|-----------|--------------|
| 1 | 45 | 72,000 |
| 2 | 62 | 95,000 |
| 3 | 78 | 118,000 |
| 4 | 55 | 88,000 |
| 5 | 90 | 142,000 |
| 6 | 68 | 105,000 |
| 7 | 105 | 168,000 |
| 8 | 50 | 81,000 |
| 9 | 82 | 130,000 |
| 10 | 120 | 195,000 |

**Variable independiente (X):** Area en m2
**Variable dependiente (Y):** Precio en USD

## Instrucciones

### Paso 1 — Estadisticas basicas

Calcula para X (area) y para Y (precio):
- Media de X: x̄ = suma(X) / 10
- Media de Y: ȳ = suma(Y) / 10

### Paso 2 — Coeficiente de correlacion de Pearson

Formula:
```
r = suma[(xi - x̄)(yi - ȳ)] / sqrt{suma[(xi-x̄)^2] * suma[(yi-ȳ)^2]}
```

Construye esta tabla de calculos:

| xi | yi | (xi-x̄) | (yi-ȳ) | (xi-x̄)(yi-ȳ) | (xi-x̄)^2 | (yi-ȳ)^2 |
|----|-----|---------|---------|--------------|-----------|----------|
| 45 | 72000 | | | | | |
| 62 | 95000 | | | | | |
| ... | ... | | | | | |
| **Suma** | | | | **SC_xy** | **SC_xx** | **SC_yy** |

Calcula r = SC_xy / sqrt(SC_xx * SC_yy)

Interpreta: ¿Que tan fuerte y en que direccion es la relacion?
- r cercano a +1: correlacion positiva fuerte
- r cercano a 0: sin correlacion
- r cercano a -1: correlacion negativa fuerte

### Paso 3 — Regresion lineal simple

Calcula los coeficientes de la recta Y = b0 + b1*X:

```
b1 (pendiente) = SC_xy / SC_xx

b0 (intercepto) = ȳ - b1 * x̄
```

### Paso 4 — Predicciones

Con la ecuacion de regresion que obtuviste:

1. ¿Cuanto costaria un departamento de **72 m2** segun tu modelo?
2. ¿Cuanto costaria uno de **150 m2**?
3. ¿El valor de b1 tiene sentido economico? ¿Cuanto cuesta cada metro cuadrado adicional segun el modelo?

### Paso 5 — Coeficiente de determinacion R²

```
R² = r^2
```
Calcula R² e interpreta: "El ___% de la variacion en el precio se explica por el area del departamento."

## Usa IA para...

> Abre Claude y escribe:
> "Tengo datos de 10 departamentos en el norte de Quito con su area (m2) y precio (USD): [(45,72000), (62,95000), (78,118000), (55,88000), (90,142000), (68,105000), (105,168000), (50,81000), (82,130000), (120,195000)]. Calcula: 1) Coeficiente de correlacion de Pearson r, 2) Ecuacion de regresion lineal Y = b0 + b1*X, 3) R cuadrado. Interpreta cada resultado. Luego predice el precio de un departamento de 95 m2 y de 200 m2. ¿Cual prediccion es mas confiable y por que?"

Despues pregunta:
> "¿Que otras variables ademas del area podrian incluirse en un modelo para predecir mejor el precio de un departamento en Quito? ¿Como se llamaria ese modelo con multiples variables?"

## Que aprendiste

- El **coeficiente de correlacion r** mide la fuerza y direccion de la relacion lineal entre dos variables: va de -1 a +1.
- La **regresion lineal** construye la "mejor recta" que minimiza la suma de errores al cuadrado (minimos cuadrados).
- La **pendiente b1** indica cuanto cambia Y por cada unidad que aumenta X (precio por metro cuadrado adicional).
- **R²** indica que porcentaje de la variacion en Y se explica por X: R²=0.95 es excelente, R²=0.40 es pobre.
- La **extrapolacion** (predecir fuera del rango de los datos) es riesgosa: la prediccion para 200 m2 es menos confiable que para 95 m2.
- Este modelo es la base matematica de los **algoritmos de machine learning** de regresion que estudiaras en semestres siguientes.

## Reto extra

Este fue tu primer modelo predictivo con datos reales de Ecuador. Ahora lleva el analisis un paso mas lejos: busca en Plusvalia.com o Properati Ecuador 5 departamentos reales del sector que te interese (La Carolina, Cumbaya, La Floresta). Registra area y precio. Aplica tu ecuacion de regresion: ¿el modelo predice bien esos precios reales? Calcula el **error promedio absoluto** entre prediccion y precio real. ¿Que factores que el modelo ignora podrian explicar las diferencias?
