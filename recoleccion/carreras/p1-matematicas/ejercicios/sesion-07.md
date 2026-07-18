# Ejercicio Sesion 7: Pruebas de Hipotesis — Eficacia de un Programa de Capacitacion

**Materia:** Matematicas I (Estadistica)
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Formular y ejecutar una prueba de hipotesis estadistica completa para determinar si un programa de capacitacion en IA realmente mejora la productividad de empleados en una empresa ecuatoriana.

## Contexto

Una empresa de contabilidad en Quito con 200 empleados implemento un programa de capacitacion en herramientas de IA (ChatGPT para reportes, automatizacion con Zapier). El departamento de RRHH quiere saber si la capacitacion **realmente mejoro la productividad** o si la mejora observada es simplemente por azar.

**Datos del experimento:**

Antes de la capacitacion, el numero promedio de reportes completados por semana era **18 reportes/semana** (media poblacional conocida, μ₀ = 18).

Despues de la capacitacion, se evaluo una muestra aleatoria de **n = 36 empleados** y se obtuvo:
- Media muestral post-capacitacion: x̄ = 20.4 reportes/semana
- Desviacion estandar muestral: s = 6.0 reportes/semana

El nivel de significancia es α = 0.05.

## Instrucciones

### Paso 1 — Formular las hipotesis

Escribe en lenguaje estadistico:
```
H₀ (hipotesis nula):     μ = 18  (la capacitacion no cambio nada)
H₁ (hipotesis alternativa): μ > 18  (la capacitacion mejoro la productividad)
```
Esta es una prueba **unilateral a la derecha** porque esperamos mejora, no simplemente un cambio.

### Paso 2 — Definir el estadistico de prueba

Usamos el estadistico Z (porque n=36 ≥ 30):
```
Z = (x̄ - μ₀) / (s / sqrt(n))
Z = (20.4 - 18) / (6.0 / sqrt(36))
```

1. Calcula sqrt(36)
2. Calcula s / sqrt(n) = 6.0 / 6 (error estandar)
3. Calcula el numerador: 20.4 - 18
4. Divide para obtener Z calculado

### Paso 3 — Valor critico y region de rechazo

Para una prueba unilateral derecha con α = 0.05:
- Valor critico: Z_critico = 1.645
- Region de rechazo: Z_calculado > 1.645

1. Compara tu Z calculado con 1.645
2. ¿Cae en la region de rechazo?

### Paso 4 — Decision estadistica

Completa estas frases:
- "Como Z_calculado = _____ [es/no es] mayor que Z_critico = 1.645..."
- "Se [rechaza/no rechaza] la hipotesis nula H₀"
- "Con α = 0.05, [hay/no hay] evidencia estadistica suficiente para concluir que la capacitacion mejoro la productividad."

### Paso 5 — Valor p (p-value) — interpretacion

El p-value es la probabilidad de obtener un resultado tan extremo como el observado si H₀ fuera verdadera.
- Si Z_calculado = 2.4, el p-value ≈ 0.0082 (menos del 1%)
- Interpretacion: hay menos del 1% de probabilidad de ver este resultado si la capacitacion no hubiera tenido efecto

Pregunta final: ¿Le recomendarias al gerente de RRHH escalar el programa de capacitacion? Justifica con los numeros.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy analista en una empresa en Quito. Antes de capacitar en IA, los empleados hacian 18 reportes/semana (promedio poblacional). Despues de capacitar, una muestra de 36 empleados tiene media 20.4 y desviacion estandar 6.0. Realiza la prueba de hipotesis Z completa con nivel de significancia 0.05. Muestra: 1) Hipotesis H0 y H1, 2) Calculo del estadistico Z, 3) Valor critico, 4) Decision, 5) Interpretacion de negocio. ¿Que le dirias al gerente sobre el ROI de la capacitacion?"

Despues pregunta:
> "¿Que diferencia hay entre error tipo I y error tipo II en esta prueba? ¿Cual seria mas costoso para la empresa en este caso?"

## Que aprendiste

- La **hipotesis nula (H₀)** siempre asume que no hay efecto: la carga de la prueba recae en los datos.
- El **estadistico Z** mide cuantas desviaciones estandar esta la media muestral de la media esperada bajo H₀.
- El **nivel de significancia α** define que tan exigente eres: α=0.05 significa que aceptas 5% de probabilidad de equivocarte al rechazar H₀.
- El **p-value** es mas informativo que solo "rechaza/no rechaza": un p=0.001 es mucho mas convincente que un p=0.049.
- **Error tipo I** = rechazar H₀ cuando es verdadera (falso positivo). **Error tipo II** = no rechazar H₀ cuando es falsa (falso negativo).

## Reto extra

El mismo programa de capacitacion se implemento en Guayaquil con una muestra de solo n=16 empleados (media=19.8, s=5.5). Ahora debes usar la **distribucion t de Student** (porque n < 30) con grados de libertad df = n-1 = 15. El t_critico para α=0.05 unilateral con 15 df es 1.753. ¿Que concluyes para Guayaquil? ¿Es diferente al resultado de Quito? ¿Por que importa el tamano de muestra?
