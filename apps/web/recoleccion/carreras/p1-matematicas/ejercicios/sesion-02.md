# Ejercicio Sesion 2: Varianza y Desviacion Estandar en Precios de Mercado

**Materia:** Matematicas I (Estadistica)
**Nivel:** Basico
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Calcular varianza y desviacion estandar para entender la dispersion de precios en el mercado ecuatoriano y decidir cual proveedor es mas consistente.

## Contexto

Una empresa de logistica en Guayaquil necesita contratar servicios de internet corporativo para sus 3 oficinas. Recibio cotizaciones mensuales (en USD) de 8 proveedores distintos durante los ultimos 6 meses. La consistencia del precio importa tanto como el precio en si: un proveedor que cambia mucho de precio es riesgo operativo.

**Dataset — Precios mensuales de internet corporativo (USD) — 6 meses:**

| Mes | Proveedor A (CNT) | Proveedor B (Netlife) |
|-----|-------------------|-----------------------|
| Enero | 180 | 165 |
| Febrero | 175 | 210 |
| Marzo | 182 | 155 |
| Abril | 178 | 225 |
| Mayo | 181 | 160 |
| Junio | 184 | 185 |

## Instrucciones

1. Calcula la **media** de cada proveedor por separado.
   - Media A = (180+175+182+178+181+184) / 6
   - Media B = (165+210+155+225+160+185) / 6

2. Calcula la **varianza** del Proveedor A:
   - Resta la media a cada valor: (xi - media)
   - Eleva al cuadrado cada diferencia: (xi - media)^2
   - Suma todos los cuadrados
   - Divide entre N (6 datos)
   - Formula: Varianza = [suma de (xi - media)^2] / N

3. Repite el mismo proceso para el **Proveedor B**.

4. Calcula la **desviacion estandar** de cada proveedor:
   - Desviacion Estandar = raiz cuadrada de la Varianza
   - Usa calculadora o el hecho de que raiz(x) se puede escribir como x^0.5

5. Completa esta tabla comparativa:

| Medida | Proveedor A (CNT) | Proveedor B (Netlife) |
|--------|-------------------|-----------------------|
| Media ($) | | |
| Varianza | | |
| Desv. Estandar ($) | | |

6. Responde:
   - ¿Cual proveedor tiene precios mas consistentes? ¿Como lo sabes?
   - Si tuvieras que elegir solo por precio promedio, ¿cual elegirías?
   - ¿Y si consideras consistencia + precio promedio juntos?

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Soy estudiante de estadistica. Tengo los precios mensuales de 2 proveedores de internet en Ecuador durante 6 meses. Proveedor A: 180, 175, 182, 178, 181, 184. Proveedor B: 165, 210, 155, 225, 160, 185. Calcula la varianza y desviacion estandar de cada uno paso a paso mostrando cada operacion. Luego explica cual proveedor recomendarias para una empresa que valora la estabilidad de costos."

Analiza la respuesta:
- ¿Claude muestra cada paso del calculo o solo el resultado?
- ¿Su recomendacion coincide con la tuya?
- Pregunta de seguimiento: "¿Que significa que la desviacion estandar sea mas grande que el 10% de la media?"

## Que aprendiste

- La **varianza** mide el promedio de las diferencias al cuadrado respecto a la media: penaliza los alejamientos grandes.
- La **desviacion estandar** esta en las mismas unidades que los datos originales (dolares), lo que la hace mas interpretable.
- Una desviacion estandar baja significa datos **concentrados** cerca de la media (consistencia).
- Una desviacion estandar alta significa datos **dispersos** (volatilidad, riesgo).
- En negocios, la dispersion es tan importante como el promedio para tomar decisiones.

## Reto extra

Calcula el **coeficiente de variacion (CV)** de cada proveedor: CV = (Desviacion Estandar / Media) x 100. Este porcentaje permite comparar variabilidad entre datasets con diferentes escalas. ¿Que CV tiene cada proveedor? ¿Cambia tu decision de cual elegir?
