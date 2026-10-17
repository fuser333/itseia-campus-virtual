# Ejercicio Sesion 2: Tablas de Verdad para Validar Decisiones

**Materia:** Logica y Pensamiento Analitico
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion:** 30 min

## Objetivo
Construir tablas de verdad para proposiciones compuestas y usarlas para validar si decisiones del mundo real son logicamente correctas.

## Contexto (Ecuador)
Las empresas ecuatorianas y el mismo gobierno toman decisiones que pueden analizarse con logica formal. Por ejemplo, el sistema de validacion del SRI para declaraciones de impuestos usa reglas logicas tipo "si (ingresos > limite) Y (no declaro), entonces multa". Aprender tablas de verdad es aprender el lenguaje de los sistemas de decision automatizados.

## Instrucciones (paso a paso)

**Paso 1 — Repaso rapido (5 min)**
Completa mentalmente estas mini-tablas (solo V/F, sin calcular):
- NOT V = ?
- V AND F = ?
- F OR F = ?
- Si V ENTONCES F = ?

**Paso 2 — Construye 3 tablas de verdad (15 min)**
Construye la tabla de verdad completa para cada proposicion. Recuerda: con 2 variables hay 4 filas, con 3 variables hay 8 filas.

**Proposicion A:** "Tengo CEDULA vigente Y tengo PASAPORTE" (para viajar)
Variables: C = tengo cedula, P = tengo pasaporte
Conector: Y (AND)

**Proposicion B:** "El sistema falla O el internet esta cortado"
Variables: F = sistema falla, I = internet cortado
Conector: O (OR)

**Proposicion C:** "Si estudio Y practico, entonces apruebo el modulo"
Variables: E = estudio, P = practico, A = apruebo
(Sugerencia: primero evalua E AND P, luego el condicional)

**Paso 3 — Analiza con ChatGPT (10 min)**
Fotografia o escribe tus tablas y usa este prompt:

```
Soy estudiante de logica. Construi estas tablas de verdad:
[describe o pega tus tablas]
Por favor:
1. Verifica si las tablas estan correctas
2. Para la Proposicion C, en que combinaciones de E y P falla el condicional?
3. Explica en lenguaje simple (sin simbolos) que significa cada fila de la tabla C
4. Da un ejemplo real en Ecuador donde este tipo de logica condicional se use en software
```

**Paso 4 — Reflexion (5 min)**
Responde en tu cuaderno:
- En que fila de la tabla C un estudiante estudia pero NO practica? Que resultado da?
- Por que el condicional "si P entonces Q" solo es FALSO cuando P es V y Q es F?

## Usa IA para...
Verificar el calculo de tus tablas y conectar el concepto abstracto con aplicaciones reales en sistemas informaticos del Ecuador.

## Que aprendiste
- Las tablas de verdad permiten analizar TODAS las combinaciones posibles de una decision
- El condicional logico es la base de los IF/ELSE en programacion
- Un sistema de validacion de software es, en esencia, una tabla de verdad gigante

## Reto extra
Investiga con ChatGPT: "Como usa el Banco Central del Ecuador reglas logicas en su sistema de transferencias? Describe la logica condicional que podria tener." Escribe al menos 3 reglas en formato SI...ENTONCES basadas en la respuesta.
