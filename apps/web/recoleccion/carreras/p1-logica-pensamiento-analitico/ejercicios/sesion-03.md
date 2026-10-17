# Ejercicio Sesion 3: Algoritmos para Resolver Problemas Ecuatorianos

**Materia:** Logica y Pensamiento Analitico
**Nivel:** Basico
**Herramienta IA:** Gemini
**Duracion:** 35 min

## Objetivo
Disenar algoritmos con las tres estructuras basicas (secuencia, decision, repeticion) aplicados a problemas reales del contexto ecuatoriano.

## Contexto (Ecuador)
Un algoritmo no es exclusivo de la computacion. La receta de las llapingachos es un algoritmo (secuencia de pasos). El proceso de renovar tu cedula en el Registro Civil tiene decisiones (si tienes cita, entonces pasa; si no, saca turno). El cobro de planillas del IESS repite el calculo por cada empleado. En esta sesion formalizas esa logica.

## Instrucciones (paso a paso)

**Paso 1 — Analiza los tres tipos de estructura (5 min)**
Lee estos ejemplos y clasifica cada uno:

| Ejemplo | Tipo (secuencia/decision/repeticion) |
|---------|--------------------------------------|
| Hervir agua: calentar -> esperar -> retirar | ? |
| Si el ticket tiene error, devolver; si no, procesar | ? |
| Calcular sueldo para cada empleado de la nomina | ? |

**Paso 2 — Escribe 3 algoritmos en lenguaje natural (15 min)**

**Algoritmo 1 — Secuencia:** Proceso para recargar saldo en una operadora ecuatoriana (Claro/Movistar/CNT) desde una app.
- Escribe los pasos en orden, numerados, sin saltar ninguno

**Algoritmo 2 — Decision:** Sistema de aprobacion de un prestamo en una cooperativa de ahorro del Ecuador.
- Usa la estructura: SI (condicion) ENTONCES (accion) SINO (otra accion)
- Considera al menos 2 condiciones (score crediticio, ingresos mensuales)

**Algoritmo 3 — Repeticion:** Calculo del total de una factura electronica del SRI con multiples productos.
- Usa la estructura: MIENTRAS (haya productos) HACER (sumar precio)
- Incluye donde empieza y donde termina la repeticion

**Paso 3 — Mejora con Gemini (15 min)**
Abre Gemini y usa este prompt:

```
Soy estudiante de logica computacional en Ecuador. Escribi estos 3 algoritmos en lenguaje natural:
[pega tus 3 algoritmos]
Por favor:
1. Identifica si cada uno usa correctamente la estructura que intente (secuencia, decision, repeticion)
2. Senala pasos que faltan o que estan en orden incorrecto
3. Para el algoritmo de decision, hay algun caso que no estoy considerando?
4. Reescribe el algoritmo de repeticion en pseudocodigo simple (sin codigo Python, solo palabras)
```

**Paso 4 — Correccion (5 min)**
Actualiza tus algoritmos con el feedback de Gemini. Marca en rojo los cambios que hiciste.

## Usa IA para...
Detectar pasos faltantes y casos borde que no consideraste, y obtener una version mejorada en pseudocodigo.

## Que aprendiste
- Todo proceso real puede modelarse con 3 estructuras: secuencia, decision y repeticion
- Los algoritmos deben ser completos (sin pasos implicitos) y sin ambiguedad
- La diferencia entre MIENTRAS y PARA (bucles con condicion vs bucles con contador)

## Reto extra
Elige un tramite del gobierno ecuatoriano (turno en el IESS, matricula vehicular, declaracion de impuestos en el SRI). Escribe su algoritmo completo usando las 3 estructuras. Deberia tener al menos 15 pasos.
