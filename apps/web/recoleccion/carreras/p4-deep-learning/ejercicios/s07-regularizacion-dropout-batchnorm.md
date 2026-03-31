# Ejercicio Sesion 7: Regularizacion — Dropout y Batch Normalization

**Materia:** Deep Learning y Redes Neuronales
**Nivel:** Avanzado
**Herramienta IA:** Copilot
**Duracion:** 50 min

## Objetivo

Dominar las tecnicas de regularizacion en redes profundas: Dropout, Batch Normalization, L1/L2 weight decay y data augmentation, comprendiendo como cada una combate el overfitting desde mecanismos distintos y aprendiendo a diagnosticar overfitting con curvas de aprendizaje.

## Contexto (Ecuador)

La Superintendencia de Bancos del Ecuador necesita un modelo para predecir incumplimiento de creditos (default) de PYMES. El dataset es pequeno (~500 registros) con muchas variables financieras. Con pocos datos y muchas features, el overfitting es el problema numero uno. Esta sesion te da las herramientas para combatirlo.

## Instrucciones

1. Abre Google Colab. Genera un dataset de credito sintetico con overfitting intencional:
   ```python
   from sklearn.datasets import make_classification
   from sklearn.model_selection import train_test_split

   X, y = make_classification(
       n_samples=500,       # Pocos datos -> overfitting probable
       n_features=50,       # Muchas features
       n_informative=10,    # Solo 10 son utiles
       n_redundant=20,      # 20 redundantes
       random_state=42
   )
   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
   ```

2. Construye el "modelo base" (sin regularizacion) — debe hacer overfitting visible:
   ```python
   def build_base_model():
       return keras.Sequential([
           layers.Dense(512, activation='relu', input_shape=(50,)),
           layers.Dense(512, activation='relu'),
           layers.Dense(256, activation='relu'),
           layers.Dense(256, activation='relu'),
           layers.Dense(1, activation='sigmoid')
       ])
   ```
   Entrena 200 epocas. Grafica train vs val loss. Confirma overfitting (val_loss sube mientras train_loss baja).

3. Ahora aplica cada tecnica de regularizacion individualmente y compara:

   **Variante A — Solo Dropout:**
   ```python
   layers.Dense(512, activation='relu'),
   layers.Dropout(0.5),
   ```

   **Variante B — Solo Batch Normalization:**
   ```python
   layers.Dense(512, activation='relu'),
   layers.BatchNormalization(),
   ```

   **Variante C — Solo L2 Regularization:**
   ```python
   layers.Dense(512, activation='relu',
                kernel_regularizer=keras.regularizers.l2(0.01)),
   ```

   **Variante D — Combinacion optima (Dropout + BatchNorm + L2):**
   Combina las tres tecnicas. Este modelo debe dar la mejor generalizacion.

4. Para cada variante registra:
   - Train accuracy (epoca final)
   - Val accuracy (mejor epoca)
   - Gap (diferencia entre ambas)
   - Epocas hasta convergencia con EarlyStopping

5. Presenta una tabla comparativa de los 5 modelos (base + 4 variantes). Identifica el mejor balance entre accuracy y generalizacion.

6. Para el modelo base, grafica el histograma de los pesos de la primera capa antes y despues de L2 regularization. Observa como L2 "empuja" los pesos hacia cero.

## Usa IA para...

- Pedirle a Copilot que explique por que Dropout funciona como un ensemble de multiples redes (ensemble interpretation)
- Preguntar cuando aplicar BatchNorm antes de la activacion vs despues (hay debate en la literatura)
- Si la Variante D tiene peor accuracy que la Variante A, pedir diagnostico: puede ser que demasiada regularizacion cause underfitting
- Generar codigo para visualizar el efecto de Dropout con diferentes tasas (0.1, 0.3, 0.5, 0.7) en la misma arquitectura

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que hace Dropout durante entrenamiento vs durante inferencia (prediccion)
- Por que Batch Normalization acelera el entrenamiento ademas de regularizar
- Cual es la diferencia entre L1 (sparsity) y L2 (small weights) regularization
- Como el "gap" entre train y val accuracy diagnostica el nivel de overfitting

## Reto Extra

Implementa la tecnica de "label smoothing" en el problema de clasificacion binaria. En lugar de etiquetas duras (0 y 1), usa etiquetas suavizadas (0.05 y 0.95). Esto evita que la red sea "demasiado confiada". Compara el calibration plot (confianza predicha vs accuracy real) del modelo sin y con label smoothing usando `sklearn.calibration.CalibrationDisplay`. Un modelo bien calibrado es critico para decisiones de riesgo crediticio.
