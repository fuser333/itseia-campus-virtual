# Ejercicio Sesion 5: K-Nearest Neighbors (KNN)

**Materia:** Machine Learning I
**Nivel:** Intermedio
**Herramienta IA:** Copilot
**Duracion estimada:** 40 min

## Objetivo

Implementar KNN para clasificar zonas de Quito por nivel de riesgo sismico usando coordenadas geograficas y caracteristicas del suelo, explorando como el valor de K afecta la precision y el sobreajuste.

## Contexto

Quito esta entre las ciudades mas sismicamente activas de America Latina. El Instituto Geofisico de la EPN (Escuela Politecnica Nacional) monitorea mas de 200 estaciones sismicas en Ecuador. El Municipio de Quito necesita clasificar sectores por riesgo (alto, medio, bajo) para planificar obras de refuerzo estructural. KNN es ideal para este caso porque zonas geograficamente proximas tienden a tener condiciones de suelo similares: el algoritmo literalmente pregunta "¿a que zonas conocidas se parece mas este nuevo punto?"

## Instrucciones

1. Abre Google Colab y crea `sesion05_riesgo_sismico_quito.ipynb`.

2. Crea el dataset y visualiza las zonas:

```python
# Machine Learning I - Sesion 5: K-Nearest Neighbors
# ITSEIA - Periodo 3

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report

np.random.seed(42)
n = 500

# Coordenadas simplificadas de Quito (latitud/longitud aproximada)
# Rango: Quito va de -0.35 a 0.10 lat, -78.70 a -78.40 lon
latitud = np.random.uniform(-0.35, 0.10, n)
longitud = np.random.uniform(-78.70, -78.40, n)

# Variables del suelo
densidad_suelo = np.random.uniform(1.2, 2.8, n)  # g/cm3
profundidad_roca = np.random.uniform(2, 80, n)    # metros
nivel_freatico = np.random.uniform(1, 20, n)      # metros
pendiente = np.random.uniform(0, 45, n)           # grados

# Reglas de riesgo sismico simplificadas (fuente: MDMQ, EPN)
riesgo = []
for i in range(n):
    score = 0
    # Suelo blando cerca del nivel freatico = mayor riesgo
    if nivel_freatico[i] < 5: score += 2
    if densidad_suelo[i] < 1.6: score += 2
    if profundidad_roca[i] > 40: score += 1
    if pendiente[i] > 25: score += 1
    # Zona norte de Quito historicamente mas estable
    if latitud[i] > -0.05: score -= 1

    if score >= 4:
        riesgo.append("Alto")
    elif score >= 2:
        riesgo.append("Medio")
    else:
        riesgo.append("Bajo")

df = pd.DataFrame({
    'latitud': latitud.round(5),
    'longitud': longitud.round(5),
    'densidad_suelo': densidad_suelo.round(3),
    'profundidad_roca': profundidad_roca.round(1),
    'nivel_freatico': nivel_freatico.round(1),
    'pendiente': pendiente.round(1),
    'riesgo': riesgo
})

print("Dataset Riesgo Sismico - Quito")
print(df['riesgo'].value_counts())

# Mapa de zonas de riesgo
colores = {'Alto': '#F0846D', 'Medio': '#FBBC0C', 'Bajo': '#73B8E7'}
plt.figure(figsize=(10, 8))
for nivel, color in colores.items():
    mask = df['riesgo'] == nivel
    plt.scatter(df[mask]['longitud'], df[mask]['latitud'],
                c=color, label=nivel, alpha=0.6, s=20)
plt.title('Zonas de Riesgo Sismico - Quito (datos simulados)')
plt.xlabel('Longitud')
plt.ylabel('Latitud')
plt.legend(title='Nivel de Riesgo')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

3. Entrena KNN y explora el efecto de K:

```python
X = df.drop('riesgo', axis=1)
y = df['riesgo']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Escalar (KNN depende de distancias, la escala importa muchisimo)
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

# Probar diferentes valores de K
valores_k = [1, 3, 5, 7, 9, 11, 15, 21, 31]
resultados = []

for k in valores_k:
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train_s, y_train)
    acc_train = knn.score(X_train_s, y_train)
    acc_test = knn.score(X_test_s, y_test)
    resultados.append({'k': k, 'acc_train': acc_train, 'acc_test': acc_test})
    print(f"K={k:2d} | Train: {acc_train:.3f} | Test: {acc_test:.3f}")

# Encontrar el mejor K
df_resultados = pd.DataFrame(resultados)
mejor_k = df_resultados.loc[df_resultados['acc_test'].idxmax(), 'k']
print(f"\nMejor K segun accuracy en test: K={int(mejor_k)}")
```

4. Visualiza sobreajuste y predice zonas nuevas:

```python
# Grafico sobreajuste
plt.figure(figsize=(9, 5))
plt.plot(df_resultados['k'], df_resultados['acc_train'],
         'o-', color='#1F2F58', label='Train', linewidth=2)
plt.plot(df_resultados['k'], df_resultados['acc_test'],
         's-', color='#FBBC0C', label='Test', linewidth=2)
plt.axvline(x=mejor_k, color='#F0846D', linestyle='--', label=f'Mejor K={int(mejor_k)}')
plt.xlabel('Valor de K (numero de vecinos)')
plt.ylabel('Accuracy')
plt.title('Efecto de K en KNN - Sobreajuste vs Sesgo\nRiesgo Sismico Quito | ITSEIA P3')
plt.legend()
plt.grid(True, alpha=0.4)
plt.tight_layout()
plt.show()

# Modelo final con mejor K
knn_final = KNeighborsClassifier(n_neighbors=int(mejor_k))
knn_final.fit(X_train_s, y_train)

print("\nReporte final (K optimo):")
y_pred = knn_final.predict(X_test_s)
print(classification_report(y_test, y_pred))

# Clasificar 3 nuevas zonas de Quito
nuevas_zonas = pd.DataFrame({
    'latitud':          [-0.20, -0.02, -0.30],
    'longitud':         [-78.55, -78.48, -78.62],
    'densidad_suelo':   [1.4, 2.5, 1.8],
    'profundidad_roca': [55.0, 12.0, 35.0],
    'nivel_freatico':   [3.0, 15.0, 8.0],
    'pendiente':        [30.0, 5.0, 15.0]
})
nuevas_s = scaler.transform(nuevas_zonas)
predicciones = knn_final.predict(nuevas_s)
nombres = ['La Marin (centro)', 'Iñaquito (norte)', 'La Magdalena (sur)']

print("\nPredicciones para zonas especificas de Quito:")
for zona, pred in zip(nombres, predicciones):
    print(f"  {zona:30s} -> Riesgo {pred}")
```

## Usa IA para...

> Abre GitHub Copilot (en VS Code o Copilot Chat) y escribe:
> "Explain why StandardScaler is mandatory before KNN but not before Decision Trees. Give a numerical example showing what happens to distance calculations with and without scaling."

Despues de leer la respuesta:
- Pide a Copilot que genere codigo que compare KNN sin escalar vs con escalar y muestre la diferencia en accuracy.
- Agrega ese codigo como una celda adicional en tu notebook.

## Que aprendiste

- KNN clasifica un nuevo punto buscando sus K vecinos mas cercanos en el espacio de features.
- **K pequeño (K=1):** el modelo memoriza el entrenamiento (sobreajuste), alta varianza.
- **K grande:** el modelo generaliza mas pero puede perder detalles locales (sesgo).
- La curva train/test vs K es una herramienta visual para elegir el K optimo.
- **Escalar con StandardScaler es obligatorio** en KNN porque la distancia euclidiana es sensible a la magnitud de cada variable.

## Reto extra

Implementa KNN con la distancia de Manhattan (`metric='manhattan'`) en lugar de la euclidiana (por defecto). Compara la accuracy con el mismo K optimo encontrado. Luego usa validacion cruzada (`cross_val_score` con cv=5) en lugar de train/test split para evaluar ambas metricas de distancia de forma mas robusta.
