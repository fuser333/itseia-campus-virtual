# Ejercicio Sesion 1: Estimacion Puntual y por Intervalos

**Materia:** Estadistica Inferencial
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 30 min

## Objetivo

Calcular estimaciones puntuales y construir intervalos de confianza para la media poblacional, usando datos reales de sueldos del sector tecnologico en Ecuador y entendiendo como la incertidumbre estadistica impacta decisiones de negocio.

## Contexto

La Camara de Comercio de Quito encargo un estudio sobre sueldos de profesionales de datos en Ecuador. Se encuesto a una muestra aleatoria de 36 profesionales con titulos en tecnologia. Los resultados (sueldos mensuales en USD) son:

**Muestra n=36 — Sueldos Tech Ecuador 2024:**
```
Media muestral (x̄): $1,285
Desviacion estandar muestral (s): $420
Tamano de muestra (n): 36
```

Quieren estimar el sueldo promedio de TODA la poblacion de tecnologos en Ecuador con 95% de confianza.

## Instrucciones

**Parte 1 — Estimacion Puntual**

La estimacion puntual de la media poblacional (μ) es simplemente la media muestral:
- μ̂ = x̄ = $1,285

Es nuestra "mejor apuesta" sobre el promedio real. Pero, ¿con cuanta precision?

**Parte 2 — Error Estandar**

El Error Estandar (SE) mide la variabilidad esperada de la media entre muestras:
```
SE = s / sqrt(n) = 420 / sqrt(36) = 420 / 6 = ?
```
Calcula el resultado.

**Parte 3 — Intervalo de Confianza al 95%**

Con n=36, podemos usar la distribucion normal (z):
- z_95% = 1.96
- IC: x̄ ± z * SE

```
Limite inferior = 1285 - 1.96 * SE = ?
Limite superior = 1285 + 1.96 * SE = ?
```

Calcula los limites. Interpreta: "Con 95% de confianza, el sueldo promedio real de tecnologos en Ecuador esta entre $_____ y $_____."

**Parte 4 — Efecto del Tamano de Muestra**

Calcula el IC para los mismos datos pero con n=100 (si hubieran encuestado a 100 personas):
- SE_nuevo = 420 / sqrt(100) = ?
- IC nuevo: $1,285 ± 1.96 * SE_nuevo

Compara el ancho del intervalo original vs el nuevo. ¿Que aprendes sobre la relacion entre tamano de muestra y precision?

**Parte 5 — Verificacion en Python**

```python
import numpy as np
from scipy import stats

x_bar = 1285
s = 420
n = 36
confianza = 0.95

se = s / np.sqrt(n)
z = stats.norm.ppf((1 + confianza) / 2)

ic_lower = x_bar - z * se
ic_upper = x_bar + z * se

print(f"Error estandar: ${se:.2f}")
print(f"Valor z (95%): {z:.4f}")
print(f"IC 95%: [${ic_lower:.2f}, ${ic_upper:.2f}]")
print(f"Ancho del IC: ${ic_upper - ic_lower:.2f}")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo una muestra de sueldos de 36 tecnologos en Ecuador: media=$1285, desviacion estandar=$420. Construye un intervalo de confianza al 95% explicando cada paso. Luego explicame: ¿que significa exactamente que el intervalo sea 'al 95% de confianza'? No digas que hay 95% de probabilidad de que la media este en ese intervalo — explica la interpretacion correcta frecuentista."

Compara la interpretacion de ChatGPT con lo que calculaste. Presta atencion especial a la interpretacion correcta del IC.

## Que aprendiste

- La **estimacion puntual** da el valor mas probable pero no dice nada sobre la incertidumbre.
- El **error estandar** mide cuanto varia la media muestral de muestra a muestra.
- El **intervalo de confianza** cuantifica la incertidumbre: un IC mas angosto = mas precision = mas informacion.
- Aumentar el tamano de muestra SIEMPRE reduce el ancho del IC (relacion de raiz cuadrada).
- La interpretacion correcta: "Si repitieras el muestreo 100 veces, el 95% de esos ICs contendrian la media real."
- En ML, los intervalos de confianza se usan para reportar la precision de metricas como accuracy y AUC.

## Reto extra

Descarga de la pagina del INEC (ecuadorencifras.gob.ec) la ENEMDU (Encuesta Nacional de Empleo). Encuentra el sueldo promedio reportado para el sector de informacion y comunicaciones. ¿Cae dentro del intervalo de confianza que calculaste ($1,285 ± margen)? ¿Que conclusiones sacas sobre la muestra de la Camara de Comercio?
