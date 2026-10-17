# Ejercicio Sesion 4: Arboles de Decision y Random Forest

**Materia:** Machine Learning I
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 50 min

## Objetivo

Entrenar un arbol de decision y un Random Forest para clasificar cultivos agricolas del Ecuador segun condiciones climaticas del suelo, visualizar el arbol y comparar la precision de ambos modelos.

## Contexto

Ecuador es uno de los mayores exportadores de banano, flores y cacao del mundo. El Ministerio de Agricultura y Ganaderia (MAG) busca sistemas de decision para recomendar que cultivo es mas adecuado segun altitud, temperatura, precipitacion y tipo de suelo. Un arbol de decision es interpretable (el agricultor puede seguir la logica), mientras que Random Forest agrega multiples arboles para mayor precision. Ambos son ampliamente usados en agtech ecuatoriana.

## Instrucciones

1. Abre Google Colab y crea `sesion04_cultivos_ecuador.ipynb`.

2. Importa librerias y genera el dataset:

```python
# Machine Learning I - Sesion 4: Decision Tree y Random Forest
# ITSEIA - Periodo 3

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.tree import DecisionTreeClassifier, plot_tree, export_text
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

np.random.seed(2024)
n = 600

# Variables climaticas y de suelo (fuente: INAMHI + MAG Ecuador)
altitud = np.random.randint(0, 3500, n)        # metros sobre nivel del mar
temperatura = np.random.uniform(10, 30, n)      # Celsius
precipitacion = np.random.uniform(500, 4000, n) # mm/año
ph_suelo = np.random.uniform(4.5, 8.0, n)      # pH
humedad = np.random.uniform(40, 95, n)          # porcentaje

# Reglas reales de cultivos en Ecuador:
cultivos = []
for i in range(n):
    if altitud[i] < 500 and temperatura[i] > 22 and precipitacion[i] > 1800:
        cultivos.append("Banano")
    elif altitud[i] > 2500 and temperatura[i] < 16:
        cultivos.append("Papa")
    elif altitud[i] > 1500 and altitud[i] <= 2800 and temperatura[i] < 20:
        cultivos.append("Rosas")
    elif temperatura[i] > 20 and ph_suelo[i] < 6.5 and precipitacion[i] > 1500:
        cultivos.append("Cacao")
    elif temperatura[i] > 18 and precipitacion[i] > 1200:
        cultivos.append("Palma Africana")
    else:
        cultivos.append("Maiz")

df = pd.DataFrame({
    'altitud': altitud,
    'temperatura': temperatura.round(1),
    'precipitacion': precipitacion.round(0),
    'ph_suelo': ph_suelo.round(2),
    'humedad': humedad.round(1),
    'cultivo': cultivos
})

print("Dataset MAG Ecuador - Clasificacion de Cultivos")
print(f"Total registros: {len(df)}")
print("\nDistribucion de cultivos:")
print(df['cultivo'].value_counts())
```

3. Entrena el Arbol de Decision y visualizalo:

```python
X = df.drop('cultivo', axis=1)
y = df['cultivo']
feature_names = X.columns.tolist()

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Arbol de Decision con profundidad limitada (mas interpretable)
arbol = DecisionTreeClassifier(max_depth=4, min_samples_split=10, random_state=42)
arbol.fit(X_train, y_train)

y_pred_arbol = arbol.predict(X_test)
acc_arbol = accuracy_score(y_test, y_pred_arbol)
print(f"Accuracy Arbol de Decision (profundidad=4): {acc_arbol:.4f}")

# Ver las reglas del arbol en texto
print("\nReglas del arbol (primeros niveles):")
reglas = export_text(arbol, feature_names=feature_names, max_depth=3)
print(reglas)

# Visualizar el arbol graficamente
plt.figure(figsize=(18, 8))
plot_tree(arbol, feature_names=feature_names,
          class_names=arbol.classes_,
          filled=True, rounded=True, fontsize=8)
plt.title("Arbol de Decision - Cultivos Ecuador (max_depth=4)", fontsize=12)
plt.tight_layout()
plt.show()
```

4. Entrena Random Forest y compara:

```python
# Random Forest: muchos arboles juntos
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=None,
    min_samples_split=5,
    random_state=42,
    n_jobs=-1
)
rf.fit(X_train, y_train)

y_pred_rf = rf.predict(X_test)
acc_rf = accuracy_score(y_test, y_pred_rf)

print(f"Accuracy Arbol de Decision: {acc_arbol:.4f}")
print(f"Accuracy Random Forest:     {acc_rf:.4f}")
print(f"Mejora: +{(acc_rf - acc_arbol)*100:.2f} puntos porcentuales")

# Importancia de variables en Random Forest
importancias = pd.Series(rf.feature_importances_, index=feature_names).sort_values(ascending=False)

plt.figure(figsize=(9, 5))
colores = ['#1F2F58', '#FBBC0C', '#73B8E7', '#F0846D', '#F9F6E7']
importancias.plot(kind='bar', color=colores)
plt.title('Importancia de Variables - Random Forest\nClasificacion Cultivos Ecuador')
plt.ylabel('Importancia (Gini)')
plt.xlabel('Variable')
plt.xticks(rotation=45)
plt.grid(axis='y', alpha=0.4)
plt.tight_layout()
plt.show()

# Predecir un campo nuevo
campo_nuevo = pd.DataFrame({
    'altitud': [300],
    'temperatura': [25.0],
    'precipitacion': [2200.0],
    'ph_suelo': [6.0],
    'humedad': [80.0]
})
prediccion = rf.predict(campo_nuevo)[0]
proba = rf.predict_proba(campo_nuevo)[0]
print(f"\nCampo nuevo (Costa ecuatoriana baja, calida y humeda):")
print(f"Cultivo recomendado: {prediccion}")
print("Probabilidades por cultivo:")
for cultivo, prob in zip(rf.classes_, proba):
    if prob > 0.01:
        print(f"  {cultivo}: {prob:.1%}")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "¿Por que Random Forest es mas preciso que un solo arbol de decision? Explica el concepto de bagging y como reduce el sobreajuste (overfitting). Dame un ejemplo con datos agricolas."

Despues de leer la respuesta:
- Pregunta: "¿Como interpreto la importancia de variables en Random Forest? Si 'altitud' tiene importancia 0.45 y 'temperatura' tiene 0.30, que significa para el modelo?"
- Documenta la explicacion en una celda de texto Markdown en tu notebook.

## Que aprendiste

- Un **Arbol de Decision** divide el espacio de datos con reglas interpretables (if/else) pero tiende a sobreajustarse.
- `max_depth` controla la complejidad del arbol: arboles mas profundos memorizan, arboles mas superficiales generalizan.
- **Random Forest** entrena N arboles en subconjuntos aleatorios de datos y variables, y promedia sus predicciones (bagging).
- `feature_importances_` revela cuales variables influyen mas en las predicciones del modelo.
- Random Forest generalmente supera al arbol simple en accuracy al costo de perder interpretabilidad directa.

## Reto extra

Prueba diferentes valores de `n_estimators` en Random Forest: [10, 50, 100, 200, 500]. Grafica la curva de accuracy vs numero de arboles. ¿A partir de cuantos arboles el beneficio es marginal? ¿Que implica eso para el tiempo de entrenamiento en un servidor de produccion?
