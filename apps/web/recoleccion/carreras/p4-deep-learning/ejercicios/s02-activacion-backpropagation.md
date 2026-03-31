# Ejercicio Sesion 2: Funciones de Activacion y Backpropagation

**Materia:** Deep Learning y Redes Neuronales
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion:** 55 min

## Objetivo

Entender el rol de las funciones de activacion en el aprendizaje profundo e implementar backpropagation manualmente con NumPy, calculando gradientes por la regla de la cadena y actualizando pesos con descenso de gradiente estocastico (SGD).

## Contexto (Ecuador)

El Ministerio de Salud Publica del Ecuador necesita predecir el nivel de riesgo de dengue en una provincia (bajo/medio/alto) basado en temperatura, humedad y altitud. Es un problema de clasificacion multiclase que require activaciones correctas en la capa de salida. Vas a entrenar la red completa con backprop manual.

## Instrucciones

1. Abre Google Colab. Habilita GPU: `Entorno de ejecucion > Cambiar tipo de entorno de ejecucion > T4 GPU`.

2. Implementa las siguientes funciones de activacion con sus derivadas:
   ```python
   import numpy as np

   def sigmoid(z):       return 1 / (1 + np.exp(-z))
   def sigmoid_d(z):     s = sigmoid(z); return s * (1 - s)

   def relu(z):          return np.maximum(0, z)
   def relu_d(z):        return (z > 0).astype(float)

   def tanh_act(z):      return np.tanh(z)
   def tanh_d(z):        return 1 - np.tanh(z)**2

   def softmax(z):
       exp_z = np.exp(z - np.max(z, axis=1, keepdims=True))
       return exp_z / np.sum(exp_z, axis=1, keepdims=True)
   ```

3. Grafica las 4 funciones (sigmoid, relu, tanh, softmax con 3 clases) en el rango [-5, 5] con matplotlib. Incluye las derivadas en el mismo grafico con linea punteada.

4. Genera datos sinteticos de dengue (300 muestras, 3 features, 3 clases) con `sklearn.datasets.make_classification`.

5. Implementa backpropagation completo para una red 3→8→8→3:
   - **Forward pass:** calcula Z1, A1, Z2, A2, Z3, A3 (softmax en salida)
   - **Loss:** cross-entropy `L = -mean(sum(y_onehot * log(A3)))`
   - **Backward pass:** calcula dL/dW3, dL/dW2, dL/dW1 usando regla de la cadena
   - **Update:** `W -= lr * dW` para cada capa
   - Entrena 500 epocas y grafica la curva de loss

6. Prueba tres variantes: activacion ReLU, Sigmoid y Tanh en capas ocultas. Compara las curvas de loss en el mismo grafico. Cual converge mas rapido?

## Usa IA para...

- Pedirle a ChatGPT que te dibuje (en texto ASCII o describa) el grafo computacional de backpropagation para 2 capas
- Si el gradiente explota (loss = NaN), pregunta como detectarlo y las 3 tecnicas para prevenirlo (gradient clipping, inicializacion He, batch normalization)
- Pedir que te explique la diferencia entre vanishing gradient y exploding gradient con ejemplos numericos simples
- Generar preguntas de examen sobre funciones de activacion para prepararte

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Por que ReLU supera a sigmoid para capas ocultas profundas
- Que es el problema del vanishing gradient y en que tipo de red ocurre mas
- Como funciona la regla de la cadena aplicada a backpropagation (con un ejemplo de 2 capas)
- Cuando usar softmax vs sigmoid en la capa de salida

## Reto Extra

Implementa mini-batch gradient descent (batch size = 32) en lugar de batch completo. Compara la curva de loss con el batch completo. Agrega momentum (beta=0.9) al optimizador: `v = beta*v + (1-beta)*dW`, `W -= lr*v`. Demuestra que converge en menos epocas para el mismo dataset.
