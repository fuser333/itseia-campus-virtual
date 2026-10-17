# Ejercicio Sesion 3: Keras/TensorFlow — Tu Primera Red Neuronal

**Materia:** Deep Learning y Redes Neuronales
**Nivel:** Avanzado
**Herramienta IA:** Copilot
**Duracion:** 50 min

## Objetivo

Construir, entrenar y evaluar redes neuronales con la API de alto nivel de Keras/TensorFlow, dominando el ciclo completo: definicion de arquitectura, compilacion con optimizador/loss/metricas, entrenamiento con callbacks y evaluacion con curvas de aprendizaje.

## Contexto (Ecuador)

El INEC (Instituto Nacional de Estadistica y Censos) del Ecuador tiene datos del censo 2022 sobre hogares. Vamos a usar un dataset publico similar (California Housing o un dataset de pobreza sintetico de Ecuador) para predecir el nivel socioeconomico de un hogar. Este tipo de modelo ayuda a focalizar los bonos del gobierno (Bono de Desarrollo Humano).

## Instrucciones

1. Abre Google Colab con GPU T4 habilitada.

2. Instala e importa:
   ```python
   import tensorflow as tf
   from tensorflow import keras
   from tensorflow.keras import layers
   print("TF version:", tf.__version__)
   print("GPU disponible:", tf.config.list_physical_devices('GPU'))
   ```

3. Carga el dataset `fetch_california_housing` de sklearn como proxy. Normaliza los datos con `StandardScaler`. Divide en 70/15/15 (train/val/test).

4. Construye tres arquitecturas con la API Sequential:

   **Modelo A (shallow):** 1 capa oculta de 64 neuronas, ReLU
   **Modelo B (medium):** 3 capas ocultas [128, 64, 32] neuronas, ReLU
   **Modelo C (deep):** 5 capas ocultas [256, 128, 64, 32, 16] neuronas, ReLU

   Para cada modelo:
   ```python
   model.compile(
       optimizer=keras.optimizers.Adam(learning_rate=0.001),
       loss='mse',
       metrics=['mae']
   )
   ```

5. Entrena cada modelo con estos callbacks:
   ```python
   callbacks = [
       keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
       keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5),
       keras.callbacks.ModelCheckpoint('mejor_modelo.h5', save_best_only=True)
   ]
   history = model.fit(X_train, y_train,
                       epochs=100,
                       batch_size=32,
                       validation_data=(X_val, y_val),
                       callbacks=callbacks)
   ```

6. Grafica las curvas de loss (train vs val) para los 3 modelos en el mismo plot. Identifica cual muestra overfitting y cual underfitting.

7. Evalua en test set. Reporta MAE y RMSE para los 3 modelos en una tabla comparativa.

## Usa IA para...

- Pedirle a Copilot que te genere el codigo completo de una funcion `plot_history(history, title)` que grafique loss y mae en subplots
- Si obtienes overfitting en Modelo C, pregunta cuales son las 4 tecnicas principales para reducirlo en Keras
- Pedir que explique la diferencia entre `model.fit()`, `model.evaluate()` y `model.predict()` con ejemplos concretos
- Generar un snippet para exportar los resultados de los 3 modelos a un DataFrame de pandas con las metricas

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que hace `EarlyStopping` y por que `restore_best_weights=True` es importante
- Cual es la diferencia entre loss de regresion (MSE) y clasificacion (CrossEntropy)
- Por que un modelo mas profundo no siempre es mejor
- Como interpretar las curvas de aprendizaje para diagnosticar overfitting vs underfitting

## Reto Extra

Cambia el problema a clasificacion: discretiza el precio de la vivienda en 3 rangos (bajo/medio/alto) y reconstruye el Modelo B para clasificacion multiclase. Cambia la ultima capa a `Dense(3, activation='softmax')` y el loss a `sparse_categorical_crossentropy`. Reporta la confusion matrix y el classification report de sklearn. Interpreta los resultados en el contexto de politica publica ecuatoriana.
