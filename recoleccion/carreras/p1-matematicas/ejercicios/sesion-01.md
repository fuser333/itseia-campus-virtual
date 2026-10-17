# Ejercicio Sesion 1: Estadistica Descriptiva con Datos de Sueldos

**Materia:** Matematicas I (Estadistica)
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 30 min

## Objetivo

Calcular media, mediana y moda de un dataset real de sueldos en Ecuador para entender como resumir un conjunto de datos con una sola cifra representativa.

## Contexto

Segun la Encuesta Nacional de Empleo, Desempleo y Subempleo (ENEMDU) del INEC 2024, el salario promedio en Ecuador varia mucho segun el sector. Los siguientes datos son salarios mensuales reales (en USD) de 15 trabajadores del sector tecnologico en Quito:

**Dataset — Sueldos Tecnologia Quito 2024 (USD/mes):**
```
850, 1200, 950, 2800, 1100, 1350, 950, 4500, 1050, 1200,
880, 1600, 950, 1750, 2200
```

Salario basico unificado Ecuador 2024: **$460/mes**
Salario promedio nacional (INEC): **$612/mes**

## Instrucciones

1. Abre una hoja en blanco (papel o Google Sheets).

2. Ordena los 15 salarios de menor a mayor. Escribe la lista ordenada.

3. Calcula la **media aritmetica**:
   - Suma todos los valores
   - Divide entre 15
   - Formula: Media = (Suma de todos los valores) / N

4. Encuentra la **mediana**:
   - En una lista ordenada de 15 datos, la mediana es el valor en la posicion 8
   - Cuenta desde el primero hasta llegar al octavo valor

5. Encuentra la **moda**:
   - Identifica que valor se repite mas veces en el dataset
   - Puede haber mas de una moda (dataset bimodal o multimodal)

6. Completa esta tabla de resultados:

| Medida | Valor calculado |
|--------|----------------|
| Media  | $____________ |
| Mediana| $____________ |
| Moda   | $____________ |

7. Responde estas preguntas de analisis:
   - ¿La media es mayor o menor que la mediana? ¿Por que?
   - ¿El sueldo de $4,500 como afecta el calculo de la media?
   - ¿Cual medida representa mejor "el sueldo tipico" de este grupo?

## Usa IA para...

> Abre ChatGPT y escribe exactamente esto:
> "Tengo estos 15 sueldos en USD de trabajadores tech en Ecuador: 850, 1200, 950, 2800, 1100, 1350, 950, 4500, 1050, 1200, 880, 1600, 950, 1750, 2200. Calcula la media, mediana y moda paso a paso. Explica con palabras simples que significa cada resultado y cual usarias para describir el sueldo tipico del grupo."

Compara la respuesta de ChatGPT con tus calculos manuales:
- ¿Coinciden los numeros?
- ¿La explicacion de ChatGPT tiene sentido con lo que calculaste?
- Si hay diferencia, ¿donde te equivocaste tu o se equivoco la IA?

## Que aprendiste

- La **media** suma todo y divide: es sensible a valores extremos (como el sueldo de $4,500).
- La **mediana** es el valor del centro cuando ordenas los datos: no la afectan los extremos.
- La **moda** es el valor mas frecuente: util cuando hay categorias que se repiten.
- Cuando la media es muy diferente a la mediana, hay **sesgo** en los datos (valores atipicos).
- En distribuciones de ingresos, la mediana suele ser mas representativa que la media.

## Reto extra

Busca en datos.gob.ec o en la pagina del INEC (ecuadorencifras.gob.ec) el sueldo promedio real del sector tecnologico en Ecuador. Agrega ese dato a tu dataset como un elemento 16 y recalcula las tres medidas. ¿Cambian mucho? ¿Por que si o por que no?
