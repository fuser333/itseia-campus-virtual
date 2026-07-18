# Ejercicio Sesion 6: Regresion Logistica — Clasificacion

**Materia:** Estadistica Inferencial
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Construir un modelo de regresion logistica para predecir una variable binaria, interpretar los odds ratios, evaluar con metricas de clasificacion (accuracy, precision, recall, AUC) y entender por que la regresion logistica es la base estadistica de muchos clasificadores de ML.

## Contexto

El equipo de admisiones de ITSEIA quiere predecir si un estudiante que aplica al preuniversitario va a MATRICULARSE en la carrera (1) o NO (0), basado en sus caracteristicas iniciales. Se tienen datos de 80 aplicantes de la primera cohorte.

**Variables:**
- **Y (objetivo):** Matriculo (1=Si, 0=No)
- **X1:** Edad (años)
- **X2:** Nota Ser Bachiller (puntos)
- **X3:** Horas de estudio autodidacta de programacion antes de ITSEIA
- **X4:** Trabaja actualmente (1=Si, 0=No) — variable de riesgo

## Instrucciones

**Parte 1 — Dataset y Exploracion**

```python
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

np.random.seed(42)
n = 80

edad = np.random.randint(17, 30, n)
ser_bachiller = np.random.normal(820, 80, n).clip(500, 1000)
horas_prog = np.random.exponential(30, n).clip(0, 200)
trabaja = np.random.binomial(1, 0.4, n)

# Probabilidad de matricularse (modelo generador)
logit = -3 + 0.05*ser_bachiller + 0.02*horas_prog - 0.5*trabaja - 0.05*edad
prob = 1 / (1 + np.exp(-logit))
matriculo = np.random.binomial(1, prob)

df = pd.DataFrame({
    'edad': edad,
    'ser_bachiller': ser_bachiller.round(0),
    'horas_prog': horas_prog.round(0),
    'trabaja': trabaja,
    'matriculo': matriculo
})

print("Distribucion de la variable objetivo:")
print(df['matriculo'].value_counts())
print(f"\nTasa de matriculacion: {df['matriculo'].mean():.1%}")
print("\nEstadisticas por grupo:")
print(df.groupby('matriculo')[['ser_bachiller', 'horas_prog', 'trabaja']].mean().round(2))
```

**Parte 2 — Modelo de Regresion Logistica**

```python
X = df[['edad', 'ser_bachiller', 'horas_prog', 'trabaja']]
y = df['matriculo']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

scaler = StandardScaler()
X_train_sc = scaler.fit_transform(X_train)
X_test_sc = scaler.transform(X_test)

modelo = LogisticRegression(random_state=42)
modelo.fit(X_train_sc, y_train)

# Coeficientes
coef_df = pd.DataFrame({
    'Variable': X.columns,
    'Coeficiente': modelo.coef_[0],
    'Odds_Ratio': np.exp(modelo.coef_[0])
}).sort_values('Odds_Ratio', ascending=False)

print("Coeficientes del modelo:")
print(coef_df.round(4))
```

**Parte 3 — Interpretacion de Odds Ratios**

El **Odds Ratio** de una variable dice:
- OR > 1: esa variable aumenta la probabilidad de matricularse
- OR < 1: esa variable reduce la probabilidad
- OR = 2: tener ese factor duplica las probabilidades (odds)

Completa:
- "Cada hora adicional de programacion autodidacta [aumenta/reduce] las probabilidades de matricularse por un factor de ___."
- "Los estudiantes que trabajan tienen ___% [mas/menos] odds de matricularse que los que no trabajan."
- ¿Cual variable es la mas importante para predecir la matriculacion?

**Parte 4 — Evaluacion del Modelo**

```python
y_pred = modelo.predict(X_test_sc)
y_prob = modelo.predict_proba(X_test_sc)[:, 1]

print("Reporte de Clasificacion:")
print(classification_report(y_test, y_pred))

print("Matriz de Confusion:")
cm = confusion_matrix(y_test, y_pred)
print(cm)
print(f"  Verdaderos Negativos (correctamente predijo NO matricula): {cm[0,0]}")
print(f"  Falsos Positivos (predijo matricula, pero no se matriculo): {cm[0,1]}")
print(f"  Falsos Negativos (predijo NO matricula, pero si se matriculo): {cm[1,0]}")
print(f"  Verdaderos Positivos (correctamente predijo matricula): {cm[1,1]}")

auc = roc_auc_score(y_test, y_prob)
print(f"\nAUC-ROC: {auc:.4f}")
```

Responde:
- ¿Cual es mas costoso para ITSEIA: un Falso Positivo o un Falso Negativo? ¿Por que?
- Con AUC = [valor], ¿el modelo es util o es basura?

**Parte 5 — Prediccion para un Nuevo Aplicante**

```python
nuevo_estudiante = pd.DataFrame({
    'edad': [19],
    'ser_bachiller': [870],
    'horas_prog': [45],
    'trabaja': [0]
})
nuevo_sc = scaler.transform(nuevo_estudiante)
prob_matricula = modelo.predict_proba(nuevo_sc)[0, 1]
print(f"Probabilidad de matricularse: {prob_matricula:.1%}")
```

## Usa IA para...

> Abre Claude y escribe:
> "Construi un modelo de regresion logistica para predecir si un estudiante se matricula en ITSEIA (instituto de IA en Ecuador). Los odds ratios son: ser_bachiller=1.35, horas_prog=1.18, trabaja=0.62, edad=0.92. El AUC es [valor]. Ayudame a: (1) interpretar cada odds ratio en lenguaje para el equipo de admisiones, (2) decidir si usar precision o recall como metrica principal para este problema, (3) sugerir como mejorar el modelo."

## Que aprendiste

- La **regresion logistica** modela la probabilidad de un evento binario, no el evento directamente.
- La **funcion sigmoide** convierte cualquier valor en una probabilidad entre 0 y 1.
- Los **odds ratios** son el lenguaje de interpretacion de la regresion logistica.
- **Precision** (de los que predije positivo, cuantos lo son) vs **Recall** (de los que son positivos, cuantos identifique).
- **AUC-ROC** mide la capacidad discriminativa del modelo independientemente del umbral de decision.

## Reto extra

Ajusta el **umbral de decision** del modelo. Por defecto es 0.5, pero puedes cambiarlo:
```python
umbral = 0.35
y_pred_custom = (y_prob >= umbral).astype(int)
print(classification_report(y_test, y_pred_custom))
```
¿Que ocurre con precision y recall al bajar el umbral a 0.35? ¿Para el equipo de admisiones de ITSEIA, que umbral recomendarias y por que?
