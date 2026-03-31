# Ejercicio Sesion 3: Chi-Cuadrado — Pruebas de Independencia

**Materia:** Estadistica Inferencial
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Aplicar la prueba Chi-cuadrado de independencia para determinar si dos variables categoricas estan relacionadas, usando datos reales de empleo y educacion en Ecuador, y conectar este test con la seleccion de features en modelos de clasificacion.

## Contexto

El Ministerio de Trabajo del Ecuador recopilo datos sobre 400 profesionales de tecnologia para entender si existe relacion entre el tipo de institucion educativa (publica vs privada) y el nivel salarial alcanzado (bajo: <$800, medio: $800-$1500, alto: >$1500).

**Tabla de contingencia observada:**

|                  | Sueldo Bajo | Sueldo Medio | Sueldo Alto | TOTAL |
|------------------|-------------|--------------|-------------|-------|
| Inst. Publica    | 85          | 72           | 43          | 200   |
| Inst. Privada    | 52          | 81           | 67          | 200   |
| **TOTAL**        | **137**     | **153**      | **110**     | **400**|

**Pregunta:** ¿El tipo de institucion educativa es independiente del nivel salarial, o existe una asociacion estadisticamente significativa?

## Instrucciones

**Parte 1 — Hipotesis**

- H0: El tipo de institucion y el nivel salarial son **independientes** (no hay relacion)
- H1: Existe una **asociacion** entre tipo de institucion y nivel salarial

**Parte 2 — Frecuencias Esperadas bajo H0**

Si fueran independientes, los valores esperados serian:
```
E(i,j) = (Total fila i × Total columna j) / Total general
```

Calcula las 6 frecuencias esperadas:
- E(Publica, Bajo) = (200 × 137) / 400 = ?
- E(Publica, Medio) = (200 × 153) / 400 = ?
- E(Publica, Alto) = (200 × 110) / 400 = ?
- E(Privada, Bajo) = (200 × 137) / 400 = ?
- (Repite para Medio y Alto)

**Parte 3 — Estadistico Chi-Cuadrado**

```
χ² = Σ (O - E)² / E
```

Calcula la contribucion de cada celda:
| Celda           | O  | E   | (O-E)²/E |
|-----------------|----|----- |----------|
| Publica-Bajo    | 85 | ?   | ?        |
| Publica-Medio   | 72 | ?   | ?        |
| Publica-Alto    | 43 | ?   | ?        |
| Privada-Bajo    | 52 | ?   | ?        |
| Privada-Medio   | 81 | ?   | ?        |
| Privada-Alto    | 67 | ?   | ?        |
| **χ² total**    |    |     | **?**    |

**Parte 4 — Decision con Python**

```python
import numpy as np
from scipy.stats import chi2_contingency

# Tabla de contingencia observada
tabla = np.array([[85, 72, 43],
                  [52, 81, 67]])

chi2, p_value, dof, expected = chi2_contingency(tabla)

print(f"Chi-cuadrado: {chi2:.4f}")
print(f"P-valor: {p_value:.6f}")
print(f"Grados de libertad: {dof}")
print(f"\nFrecuencias esperadas:")
print(expected.round(2))

alpha = 0.05
if p_value < alpha:
    print(f"\nSe RECHAZA independencia (p={p_value:.4f} < {alpha})")
    print("Hay asociacion significativa entre tipo de institucion y sueldo.")
else:
    print(f"\nNo se rechaza H0 (p={p_value:.4f})")
```

**Parte 5 — Interpretacion**

- ¿Se rechaza H0? ¿Que concluyes?
- Mirando las frecuencias observadas vs esperadas: ¿que grupo tiene mas graduados de altos sueldos de lo esperado (publicos o privados)?
- ¿Que implicaciones tiene este resultado para las politicas de educacion en Ecuador?
- ¿Este resultado implica causalidad (institucion privada CAUSA sueldos altos) o solo asociacion?

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo una tabla de contingencia con datos de 400 profesionales de tecnologia en Ecuador: institucion educativa (publica/privada) vs nivel salarial (bajo/medio/alto). Los datos son: Publica=[85,72,43], Privada=[52,81,67]. Aplica la prueba chi-cuadrado explicando cada paso. Luego dime: ¿como se usa la prueba chi-cuadrado en Machine Learning para seleccionar features categoricas? ¿Que es el 'chi2 feature selection' de sklearn?"

Investigacion adicional:
> "¿Cuales son los supuestos que debo verificar para que la prueba chi-cuadrado sea valida? (frecuencias esperadas minimas, etc.)"

## Que aprendiste

- La prueba **Chi-cuadrado** compara frecuencias observadas vs las esperadas bajo independencia.
- Un **p-valor bajo** (< 0.05) indica asociacion estadistica entre las variables categoricas.
- La prueba NO dice la direccion ni la magnitud de la asociacion — solo si existe o no.
- **Asociacion ≠ Causalidad**: otros factores podrian explicar la relacion (sesgo de seleccion, NSE familiar, etc.).
- En **feature selection de ML**: sklearn.feature_selection.chi2 usa este test para rankear la importancia de variables categoricas en modelos de clasificacion.

## Reto extra

Busca los microdatos de la ENEMDU Ecuador en ecuadorencifras.gob.ec. Crea tu propia tabla de contingencia: nivel de instruccion (bachillerato, superior no universitario, universitario) vs condicion de empleo (empleado pleno, subempleado, desempleado). Aplica chi-cuadrado y reporta: (1) el estadistico, (2) el p-valor, (3) tu conclusion en lenguaje no tecnico para una audiencia de funcionarios del Ministerio de Trabajo.
