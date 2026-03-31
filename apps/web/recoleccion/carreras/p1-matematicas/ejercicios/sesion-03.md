# Ejercicio Sesion 3: Distribuciones de Probabilidad — Demanda de Taxis en Quito

**Materia:** Matematicas I (Estadistica)
**Nivel:** Basico
**Herramienta IA:** Gemini
**Duracion estimada:** 40 min

## Objetivo

Identificar y aplicar distribuciones de probabilidad (binomial y normal) usando datos reales de transporte urbano en Quito para estimar probabilidades de eventos de negocio.

## Contexto

InDrive opera en Quito y Guayaquil con una flota activa de conductores. Segun datos publicos de 2024, en una zona tipica del norte de Quito, la probabilidad de que un viaje solicitado sea aceptado en menos de 3 minutos es del **70%** (p = 0.70).

Un supervisor analiza grupos de 10 solicitudes consecutivas para medir la eficiencia de su zona.

**Adicionalmente:** El tiempo de espera total (en minutos) de los usuarios sigue una distribucion aproximadamente normal con media = 5.2 minutos y desviacion estandar = 1.8 minutos, segun registros internos.

## Instrucciones

### Parte A — Distribucion Binomial

La formula de probabilidad binomial es:
```
P(X = k) = C(n,k) * p^k * (1-p)^(n-k)
```
Donde:
- n = numero de intentos (10 solicitudes)
- k = numero de exitos deseados
- p = probabilidad de exito (0.70)
- C(n,k) = n! / [k! * (n-k)!]  (combinaciones)

1. Calcula la probabilidad de que **exactamente 7** de 10 solicitudes sean aceptadas en menos de 3 min.
   - P(X = 7): n=10, k=7, p=0.70

2. Calcula C(10,7):
   - C(10,7) = 10! / (7! * 3!) = (10 x 9 x 8) / (3 x 2 x 1)

3. Calcula 0.70^7 y 0.30^3 por separado, luego multiplica todo.

4. Interpreta el resultado en palabras de negocio.

### Parte B — Distribucion Normal (analisis cualitativo)

Para la distribucion normal del tiempo de espera (media=5.2 min, SD=1.8 min):

1. Calcula el **intervalo de 1 desviacion estandar**: de (5.2 - 1.8) a (5.2 + 1.8)
   - ¿Que porcentaje de esperas caen en ese rango? (Regla empirica 68-95-99.7)

2. Calcula el intervalo de **2 desviaciones estandar**.

3. ¿Que porcentaje de usuarios espera MAS de 8.8 minutos? Usa la regla 68-95-99.7.

4. Si InDrive promete "espera maxima de 9 minutos" en su publicidad, ¿que tan seguido incumple?

## Usa IA para...

> Abre Gemini (gemini.google.com) y escribe:
> "Ayudame a entender la distribucion binomial con un ejemplo real. Tengo una app de transporte en Quito donde cada viaje tiene 70% de probabilidad de ser aceptado en menos de 3 minutos. Si analizo grupos de 10 solicitudes: 1) ¿Cual es la probabilidad de exactamente 7 exitos? 2) ¿Cual es la probabilidad de AL MENOS 7 exitos? 3) ¿Cual es el numero esperado de exitos en 10 intentos? Muestra la formula y el calculo completo."

Despues pregunta:
> "Ahora explica la diferencia entre distribucion binomial y distribucion normal. ¿Cuando uso cada una? Dame un ejemplo de cada una con datos de Ecuador."

## Que aprendiste

- La **distribucion binomial** modela el numero de exitos en N intentos independientes con probabilidad p constante.
- La **distribucion normal** es continua, simetrica, y aparece naturalmente en muchos fenomenos (tiempos, pesos, errores).
- La **regla 68-95-99.7**: el 68% de datos cae dentro de 1 SD, el 95% dentro de 2 SD, el 99.7% dentro de 3 SD.
- El **valor esperado** de una binomial es simplemente n x p.
- En negocios de plataforma (Uber, InDrive, Rappi), las distribuciones de probabilidad guian decisiones operativas.

## Reto extra

InDrive quiere mejorar su SLA (acuerdo de nivel de servicio). Si cambia la operacion para que p suba de 0.70 a 0.85, ¿como cambia la probabilidad de tener exactamente 7 exitos en 10? ¿Y al menos 8 exitos? Calcula ambos escenarios y construye una tabla comparativa p=0.70 vs p=0.85.
