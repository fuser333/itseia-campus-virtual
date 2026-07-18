# Ejercicio Sesion 4: Probabilidad Condicional y Teorema de Bayes — Diagnostico Medico

**Materia:** Matematicas I (Estadistica)
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Aplicar probabilidad condicional y el Teorema de Bayes para actualizar creencias con nueva evidencia, usando un caso real del sistema de salud ecuatoriano.

## Contexto

El IESS (Instituto Ecuatoriano de Seguridad Social) reporta que en Ecuador la **tasa de diabetes tipo 2** en adultos mayores de 40 años es del **12%** (dato ENSANUT 2024). Una clinica privada en Cuenca implemento un test de glucosa rapido con las siguientes caracteristicas conocidas:

- **Sensibilidad** (probabilidad de test positivo dado que tiene diabetes): 92%
- **Especificidad** (probabilidad de test negativo dado que NO tiene diabetes): 87%

Un paciente de 45 años llega a la clinica. El test da **positivo**. ¿Cual es la probabilidad REAL de que tenga diabetes?

## Instrucciones

### Definir los eventos

```
D  = El paciente TIENE diabetes
D' = El paciente NO tiene diabetes
T+ = El test da positivo
T- = El test da negativo
```

### Probabilidades conocidas (datos del problema)

```
P(D)  = 0.12   (prevalencia en poblacion)
P(D') = 0.88   (complemento)
P(T+ | D)  = 0.92  (sensibilidad)
P(T- | D)  = 0.08  (falso negativo)
P(T- | D') = 0.87  (especificidad)
P(T+ | D') = 0.13  (falso positivo)
```

### Paso 1 — Probabilidad total de test positivo

Usando la ley de probabilidad total:
```
P(T+) = P(T+ | D) x P(D)  +  P(T+ | D') x P(D')
P(T+) = 0.92 x 0.12  +  0.13 x 0.88
```
Calcula cada termino y suma.

### Paso 2 — Aplicar Teorema de Bayes

```
P(D | T+) = [P(T+ | D) x P(D)] / P(T+)
```
Sustituye los valores que calculaste en el Paso 1.

### Paso 3 — Interpretar el resultado

1. ¿Que tan probable es que el paciente realmente tenga diabetes dado que el test fue positivo?
2. ¿Es ese porcentaje alto o bajo? ¿Te sorprende?
3. La clinica decide repetir el test a pacientes con resultado positivo. Si el segundo test tambien da positivo, ¿como cambia la probabilidad? (Pista: ahora la probabilidad previa ya no es 0.12, ¿que es?)

## Usa IA para...

> Abre ChatGPT y escribe:
> "Explica el Teorema de Bayes con el siguiente caso real de Ecuador: la prevalencia de diabetes tipo 2 es 12%. Un test tiene sensibilidad 92% y especificidad 87%. Un paciente da positivo. ¿Cual es la probabilidad de que realmente tenga diabetes? Muestra el calculo con la formula de Bayes paso a paso y dibuja una tabla de frecuencias con 1000 pacientes hipoteticos para visualizarlo mejor."

Analiza si ChatGPT usa la tabla de frecuencias para visualizar el problema (esto se llama "razonamiento de frecuencias naturales" y es mucho mas intuitivo que las formulas puras).

Pregunta de seguimiento:
> "¿Por que aunque el test sea bastante bueno, la probabilidad post-test no es tan alta como se esperaria? ¿Que rol juega la prevalencia de la enfermedad en el resultado?"

## Que aprendiste

- **P(A|B)** se lee "probabilidad de A dado que B ocurrio": es condicional, no independiente.
- El **Teorema de Bayes** permite actualizar una probabilidad inicial (prior) con nueva evidencia (test, dato nuevo).
- La **prevalencia** de la enfermedad importa enormemente: un test excelente en una enfermedad rara sigue dando muchos falsos positivos.
- Este mismo principio se usa en **spam filters**, **sistemas de recomendacion**, y **modelos de IA** (Naive Bayes).
- Un segundo test independiente mejora drasticamente la certeza del diagnostico.

## Reto extra

Ecuador tiene una tasa de tuberculosis de aproximadamente 30 casos por 100,000 habitantes (0.03%). Investiga la sensibilidad y especificidad de la prueba Mantoux (TST) en Google o pide a ChatGPT los datos. Aplica Bayes: si un paciente da positivo en TST, ¿que tan probable es que realmente tenga TB activa? Compara este resultado con el caso de la diabetes. ¿Por que son tan diferentes?
