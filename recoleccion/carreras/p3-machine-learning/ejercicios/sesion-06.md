# Ejercicio Sesion 6: Validacion Cruzada y Metricas

**Materia:** Machine Learning I
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Aplicar validacion cruzada K-Fold sobre modelos de clasificacion de enfermedades en Ecuador, calcular e interpretar accuracy, precision, recall y F1-score, y entender por que estas metricas importan diferente segun el problema de negocio.

## Contexto

El Ministerio de Salud Publica del Ecuador reporta que la diabetes afecta al 10.3% de la poblacion adulta, siendo la segunda causa de muerte en el pais. Detectar correctamente quienes tienen diabetes (recall alto) es mas critico que evitar falsos alarmas (precision alta): un falso negativo puede costar una vida, un falso positivo solo genera un examen adicional. Este ejercicio enseña a elegir la metrica correcta segun el impacto real del error.

## Instrucciones

1. Abre Google Colab y crea `sesion06_diabetes_ecuador.ipynb`.

2. Genera el dataset y compara tres modelos con validacion cruzada:

```python
# Machine Learning I - Sesion 6: Validacion Cruzada y Metricas
# ITSEIA - Periodo 3

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import (train_test_split, cross_val_score,
                                      StratifiedKFold, cross_validate)
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                              f1_score, make_scorer)
from sklearn.preprocessing import StandardScaler

np.random.seed(2024)
n = 700

# Variables clinicas (basadas en distribucion de diabetes en Ecuador MSP)
edad = np.random.randint(25, 75, n)
imc = np.random.normal(27.5, 5.5, n).clip(17, 48)
glucosa_ayunas = np.random.normal(110, 40, n).clip(60, 400)
presion_arterial = np.random.normal(80, 15, n).clip(50, 130)
insulina = np.random.normal(120, 80, n).clip(0, 600)
antecedentes_familiares = np.random.choice([0, 1], n, p=[0.6, 0.4])
actividad_fisica = np.random.choice([0, 1, 2], n, p=[0.3, 0.45, 0.25])

# Variable objetivo: diabetes diagnosticada
prob_diabetes = (
    -4.5
    + 0.03 * edad
    + 0.07 * imc
    + 0.015 * glucosa_ayunas
    + 0.004 * insulina
    + 0.8 * antecedentes_familiares
    - 0.4 * actividad_fisica
)
prob_diabetes = 1 / (1 + np.exp(-prob_diabetes))
diabetes = (np.random.rand(n) < prob_diabetes).astype(int)

df = pd.DataFrame({
    'edad': edad, 'imc': imc.round(1),
    'glucosa_ayunas': glucosa_ayunas.round(1),
    'presion_arterial': presion_arterial.round(1),
    'insulina': insulina.round(1),
    'antecedentes_familiares': antecedentes_familiares,
    'actividad_fisica': actividad_fisica,
    'diabetes': diabetes
})

print("Dataset Diabetes - Ecuador (MSP simulado)")
print(f"Con diabetes (1):    {diabetes.sum()} ({diabetes.mean()*100:.1f}%)")
print(f"Sin diabetes (0):    {(diabetes==0).sum()} ({(diabetes==0).mean()*100:.1f}%)")
print(df.describe().round(2))
```

3. Compara tres modelos con validacion cruzada:

```python
X = df.drop('diabetes', axis=1)
y = df['diabetes']

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Definir 3 modelos
modelos = {
    'Regresion Logistica': LogisticRegression(max_iter=1000, random_state=42),
    'Arbol Decision':      DecisionTreeClassifier(max_depth=5, random_state=42),
    'Random Forest':       RandomForestClassifier(n_estimators=100, random_state=42)
}

# Validacion cruzada estratificada 5-Fold
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# Metricas a calcular
scoring = {
    'accuracy':  'accuracy',
    'precision': make_scorer(precision_score, zero_division=0),
    'recall':    make_scorer(recall_score),
    'f1':        make_scorer(f1_score)
}

print("VALIDACION CRUZADA 5-FOLD - Deteccion Diabetes Ecuador")
print("=" * 65)

resumen = {}
for nombre, modelo in modelos.items():
    resultados = cross_validate(modelo, X_scaled, y, cv=cv,
                                scoring=scoring, return_train_score=False)
    resumen[nombre] = {
        'Accuracy':  resultados['test_accuracy'].mean(),
        'Precision': resultados['test_precision'].mean(),
        'Recall':    resultados['test_recall'].mean(),
        'F1':        resultados['test_f1'].mean()
    }
    print(f"\n{nombre}:")
    for metrica, valor in resumen[nombre].items():
        print(f"  {metrica:12s}: {valor:.4f}")
```

4. Visualiza las metricas y explica cual usar:

```python
# Tabla comparativa visual
df_resumen = pd.DataFrame(resumen).T
print("\nTabla comparativa:")
print(df_resumen.round(4).to_string())

# Grafico de barras agrupadas
fig, ax = plt.subplots(figsize=(12, 6))
x = np.arange(len(df_resumen))
width = 0.2
colores = ['#1F2F58', '#FBBC0C', '#73B8E7', '#F0846D']
metricas = ['Accuracy', 'Precision', 'Recall', 'F1']

for i, (metrica, color) in enumerate(zip(metricas, colores)):
    bars = ax.bar(x + i * width, df_resumen[metrica],
                  width, label=metrica, color=color, alpha=0.85)
    for bar in bars:
        ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.005,
                f'{bar.get_height():.3f}', ha='center', va='bottom', fontsize=7)

ax.set_xticks(x + width * 1.5)
ax.set_xticklabels(df_resumen.index, rotation=10)
ax.set_ylabel('Score (0 a 1)')
ax.set_title('Comparacion de Metricas por Modelo\nDeteccion Diabetes Ecuador | ITSEIA P3')
ax.legend()
ax.set_ylim(0, 1.05)
ax.grid(axis='y', alpha=0.4)
plt.tight_layout()
plt.show()

# Explicacion de metricas en contexto medico
print("\nINTERPRETACION PARA DETECCION DE DIABETES:")
print("-" * 55)
print("Recall (Sensibilidad) = TP / (TP + FN)")
print("  -> De todos los enfermos, cuantos detectamos")
print("  -> CRITICO: un falso negativo = paciente sin diagnostico")
print()
print("Precision = TP / (TP + FP)")
print("  -> De los que clasificamos como enfermos, cuantos lo son realmente")
print("  -> Un falso positivo = examen adicional innecesario (costo bajo)")
print()
print("Para este problema medico: RECALL > PRECISION")
mejor_recall = df_resumen['Recall'].idxmax()
print(f"Modelo recomendado por Recall: {mejor_recall} ({df_resumen.loc[mejor_recall, 'Recall']:.4f})")
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Tengo un modelo de deteccion de diabetes con Precision=0.72 y Recall=0.89. Explica el trade-off entre estas dos metricas. Si el medico quiere reducir al maximo los falsos negativos, ¿como ajusto el umbral de decision? ¿Que metrica uso para comparar modelos cuando el dataset esta desbalanceado?"

Despues de leer la respuesta:
- Implementa lo que Claude sugiera sobre umbral de decision en tu notebook.
- Calcula el F1-score con el umbral ajustado y compara con el umbral 0.5 por defecto.

## Que aprendiste

- La **validacion cruzada K-Fold** estima el rendimiento real del modelo usando todos los datos tanto para entrenamiento como para validacion.
- **StratifiedKFold** preserva la proporcion de clases en cada fold, critico con datasets desbalanceados.
- **Accuracy** puede ser engañosa con clases desbalanceadas (si el 90% no tiene diabetes, predecir siempre "no" da 90% de accuracy).
- **Recall** es la metrica critica en medicina: mide cuantos enfermos detectamos correctamente.
- **F1-score** es la media armonica de Precision y Recall: util cuando ambas importan por igual.

## Reto extra

Usa `cross_val_score` con `scoring='roc_auc'` para los tres modelos. El AUC-ROC es la metrica mas completa para clasificacion binaria con desbalance. Reporta cual modelo tiene mejor AUC, luego grafica las 5 curvas ROC del fold de Random Forest sobreponiendo cada fold en un mismo grafico para visualizar la estabilidad del modelo.
