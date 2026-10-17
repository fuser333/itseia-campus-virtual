# Ejercicio Sesion 5: Muestreo y Estimacion — Encuesta de Empleabilidad en Guayaquil

**Materia:** Matematicas I (Estadistica)
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Disenar un plan de muestreo estadistico correcto y calcular el tamano de muestra necesario para estimar la empleabilidad del sector tecnologico en Guayaquil con un nivel de confianza definido.

## Contexto

ITSEIA quiere demostrar con datos propios que sus graduados tienen alta empleabilidad. Para eso necesita hacer una encuesta a empresas tecnologicas en Guayaquil que indique si **estan dispuestas a contratar tecnologos en IA**. El departamento de investigacion no conoce la proporcion real (p desconocida), por lo que usara la estimacion conservadora de p = 0.5.

**Datos del contexto:**
- Poblacion objetivo: empresas del sector TIC en Guayaquil
- Segun la Superintendencia de Companias 2024: aproximadamente **2,400 empresas TIC** activas en Guayaquil
- Se quiere un **nivel de confianza del 95%** (Z = 1.96)
- Se acepta un **margen de error del 5%** (E = 0.05)

## Instrucciones

### Parte A — Calcular tamano de muestra (poblacion infinita)

La formula base para proporciones con poblacion grande es:
```
n0 = Z^2 * p * (1-p) / E^2
```
Donde:
- Z = 1.96 (nivel de confianza 95%)
- p = 0.50 (proporcion estimada conservadora)
- E = 0.05 (margen de error)

1. Calcula Z^2 = 1.96^2
2. Calcula p * (1-p) = 0.5 * 0.5
3. Calcula E^2 = 0.05^2
4. Divide y obtiene n0

### Parte B — Correccion por poblacion finita

Cuando la poblacion (N=2400) no es "infinita", se aplica la correccion:
```
n = n0 / [1 + (n0 - 1) / N]
```

1. Sustituye n0 del Paso A y N = 2400
2. Calcula el denominador: 1 + (n0 - 1) / 2400
3. Divide n0 entre ese denominador
4. Redondea hacia arriba (siempre se redondea al entero mayor)

### Parte C — Disenar el plan de muestreo

Responde las siguientes preguntas sobre la metodologia:

1. **Tipo de muestreo elegido:** ITSEIA decide usar muestreo **aleatorio estratificado** por tamano de empresa (pequena <10 empleados, mediana 10-50, grande >50). Si hay 60% pequenas, 30% medianas y 10% grandes de las 2,400 empresas, ¿cuantas empresas de cada tipo entrarian en la muestra final?

2. **Sesgo de seleccion:** ¿Que pasaria si ITSEIA encuesta solo a empresas que ya conoce o que han asistido a sus eventos? ¿Como se llama ese error?

3. **Tamanio vs. precision:** Si se reduce el margen de error a 3%, ¿como cambia el tamano de muestra? Usa la formula del Paso A.

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Soy investigador de ITSEIA en Ecuador. Necesito encuestar empresas TIC en Guayaquil (N=2400 empresas) para estimar la proporcion que contrataria tecnologos en IA. Con nivel de confianza 95% y margen de error 5%, ¿cuantas empresas debo encuestar? Muestra el calculo con y sin correccion por poblacion finita. Luego explica que diferencia hay entre muestreo aleatorio simple, estratificado y por conveniencia, y cual recomendarias para este estudio."

Pide ademas:
> "Que riesgos de sesgo debo controlar en una encuesta de empleabilidad? Dame 3 ejemplos especificos."

## Que aprendiste

- El **tamano de muestra** depende del nivel de confianza, margen de error y variabilidad estimada: no de la poblacion total (excepto para correcciones menores).
- Usar **p = 0.5** cuando no se conoce la proporcion real es la opcion mas conservadora (maximiza el tamano necesario).
- La **correccion por poblacion finita** reduce el tamano de muestra cuando N es pequena en relacion a n0.
- El **muestreo estratificado** garantiza representacion de todos los subgrupos importantes.
- El **sesgo de seleccion** es el error mas comun en encuestas y puede invalidar todos los resultados.

## Reto extra

ITSEIA logra obtener respuestas de su muestra. De las empresas encuestadas, el 78% dice que Si contrataria un tecnologo en IA. Calcula el **intervalo de confianza del 95%** para esta proporcion usando la formula:
```
IC = p_muestral +/- Z * sqrt[p*(1-p)/n]
```
Interpreta el resultado: ¿que le dirias al directorio de ITSEIA sobre el mercado laboral en Guayaquil?
