# Ejercicio Sesion 5: Regresion Lineal Multiple

**Materia:** Estadistica Inferencial
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Construir e interpretar un modelo de regresion lineal multiple para predecir el sueldo de un profesional tech en Ecuador en funcion de multiples variables, evaluando la bondad de ajuste, los coeficientes y los supuestos del modelo.

## Contexto

El Ministerio de Telecomunicaciones de Ecuador (MINTEL) recopilo datos de 20 profesionales del sector tecnologico. Las variables son:
- **Y (objetivo):** Sueldo mensual en USD
- **X1:** Anos de experiencia
- **X2:** Nivel de instruccion (1=Bachiller, 2=Tecnologo, 3=Universitario, 4=Master)
- **X3:** Horas de capacitacion en IA en el ultimo ano
- **X4:** Maneja al menos un lenguaje de programacion (0=No, 1=Si)

**Dataset MINTEL 2024 (20 observaciones):**

```python
datos = {
    'sueldo':        [650, 820, 1100, 1350, 1600, 750, 950, 1200, 1450, 1800,
                      700, 880, 1150, 1400, 1700, 800, 1050, 1300, 1550, 2100],
    'experiencia':   [1,   2,   3,    5,    7,    1,   3,   4,    6,    9,
                      2,   2,   4,    5,    8,    1,   3,   5,    7,    10],
    'instruccion':   [1,   2,   2,    3,    3,    1,   2,   3,    3,    4,
                      1,   2,   2,    3,    4,    2,   3,   3,    4,    4],
    'horas_ia':      [0,  20,  40,   80,  120,   10,  30,  60,  100,  200,
                      5,  25,  50,   90,  150,   15,  45,  75,  110,  180],
    'prog':          [0,   0,   1,    1,    1,    0,   1,   1,    1,    1,
                      0,   1,   1,    1,    1,    0,   1,   1,    1,    1]
}
```

## Instrucciones

**Parte 1 — Analisis exploratorio**

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

df = pd.DataFrame(datos)
print(df.describe().round(2))
print("\nCorrelaciones con sueldo:")
print(df.corr()['sueldo'].sort_values(ascending=False).round(3))
```

¿Que variable tiene mayor correlacion con el sueldo? ¿Es el resultado intuitivo?

**Parte 2 — Modelo de Regresion con statsmodels**

```python
import statsmodels.api as sm

X = df[['experiencia', 'instruccion', 'horas_ia', 'prog']]
y = df['sueldo']

X_const = sm.add_constant(X)
modelo = sm.OLS(y, X_const).fit()
print(modelo.summary())
```

Del summary, extrae y registra:
| Coeficiente | Valor | P-valor | Significativo? |
|-------------|-------|---------|----------------|
| Constante (β0) | ? | ? | ? |
| Experiencia (β1) | ? | ? | ? |
| Instruccion (β2) | ? | ? | ? |
| Horas IA (β3) | ? | ? | ? |
| Prog (β4) | ? | ? | ? |

**Parte 3 — Interpretacion de Coeficientes**

Interpreta en lenguaje de negocios:
- "Manteniendo lo demas constante, cada ano adicional de experiencia agrega $_____ al sueldo."
- "Un profesional que programa vs uno que no, gana en promedio $_____ mas."
- "El R-cuadrado de _____ indica que el modelo explica el _____% de la variacion en sueldos."

**Parte 4 — Prediccion**

Un egresado de ITSEIA tiene: 0 años experiencia, instruccion nivel 2 (Tecnologo), 80 horas de capacitacion IA durante el programa, y si maneja Python (prog=1).

```python
nuevo = pd.DataFrame({
    'const': [1],
    'experiencia': [0],
    'instruccion': [2],
    'horas_ia': [80],
    'prog': [1]
})
prediccion = modelo.predict(nuevo)
print(f"Sueldo predicho para egresado ITSEIA: ${prediccion[0]:.2f}")
```

¿El resultado es razonable comparado con los datos de mercado?

**Parte 5 — Verificacion de Supuestos**

```python
residuos = modelo.resid
predichos = modelo.fittedvalues

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Residuos vs predichos (homocedasticidad)
axes[0].scatter(predichos, residuos, alpha=0.7)
axes[0].axhline(y=0, color='red', linestyle='--')
axes[0].set_xlabel('Valores predichos')
axes[0].set_ylabel('Residuos')
axes[0].set_title('Residuos vs Predichos')

# Q-Q plot (normalidad de residuos)
stats.probplot(residuos, dist="norm", plot=axes[1])
axes[1].set_title('Q-Q Plot de Residuos')

plt.tight_layout()
plt.savefig('supuestos_regresion.png', dpi=150)
plt.show()
```

## Usa IA para...

> Abre ChatGPT con el summary del modelo y escribe:
> "Este es el summary de un modelo de regresion lineal multiple que predice sueldos tech en Ecuador. [Pega el summary]. Ayudame a: (1) interpretar cada coeficiente en lenguaje de negocios, (2) explicar si los supuestos de la regresion se cumplen segun los graficos, (3) decirme si hay variables que podria eliminar para simplificar el modelo sin perder mucho poder predictivo."

## Que aprendiste

- La **regresion lineal multiple** modela la relacion entre una variable dependiente y varias independientes simultaneamente.
- Cada **coeficiente β** mide el efecto de una variable manteniendo las demas constantes (ceteris paribus).
- El **R-cuadrado** mide la proporcion de varianza explicada; el R-cuadrado ajustado penaliza por numero de variables.
- El **p-valor de cada coeficiente** indica si esa variable contribuye significativamente al modelo.
- Esta es la base matematica de modelos de ML como regresion Ridge y Lasso.

## Reto extra

Aplica **regularizacion Ridge (L2)** al mismo dataset con sklearn:
```python
from sklearn.linear_model import Ridge
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score

scaler = StandardScaler()
X_sc = scaler.fit_transform(X)
ridge = Ridge(alpha=1.0)
scores = cross_val_score(ridge, X_sc, y, cv=5, scoring='r2')
print(f"R2 medio con Ridge: {scores.mean():.3f}")
```
¿En que difiere Ridge de la regresion OLS? ¿Por que ayuda cuando hay multicolinealidad?
