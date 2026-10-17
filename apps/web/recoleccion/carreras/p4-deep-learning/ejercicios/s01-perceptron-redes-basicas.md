# Ejercicio Sesion 1: Perceptron y Redes Neuronales Basicas

**Materia:** Deep Learning y Redes Neuronales
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 50 min

## Objetivo

Construir un perceptron desde cero en Python puro (sin frameworks) y luego escalar a una red neuronal de dos capas usando solo NumPy, comprendiendo el flujo de informacion hacia adelante (forward pass) y la logica del umbral de activacion.

## Contexto (Ecuador)

El Banco Pichincha necesita un sistema que clasifique transacciones como "aprobadas" o "rechazadas" segun dos variables: monto y hora. Vamos a simular este problema binario con datos sinteticos y resolverlo con un perceptron, igual que hacen los sistemas de scoring crediticio en la banca ecuatoriana.

## Instrucciones

1. Abre Google Colab (no requiere GPU para esta sesion).

2. Crea datos sinteticos de transacciones bancarias:
   - 200 transacciones con dos features: `monto_normalizado` (0-1) y `hora_normalizada` (0-1)
   - Etiqueta: 1 = aprobada, 0 = rechazada
   - Usa una regla lineal con ruido: aprobada si `0.6*monto + 0.4*hora > 0.5`

3. Implementa el perceptron de Rosenblatt en Python puro:
   ```python
   class Perceptron:
       def __init__(self, lr=0.1, epochs=100):
           self.lr = lr
           self.epochs = epochs
           self.weights = None
           self.bias = None

       def fit(self, X, y):
           # Inicializa pesos en cero
           # Itera por epocas
           # Aplica regla de actualizacion: w = w + lr*(y-y_hat)*x
           pass

       def predict(self, X):
           # Calcula producto punto + bias
           # Aplica funcion escalon
           pass
   ```

4. Entrena el perceptron y grafica la frontera de decision con matplotlib.

5. Extiende a una red de dos capas (capa oculta de 4 neuronas):
   - Implementa con NumPy: `Z1 = X @ W1 + b1`, `A1 = sigmoid(Z1)`, `Z2 = A1 @ W2 + b2`
   - Funcion sigmoid: `1 / (1 + np.exp(-z))`
   - Imprime la accuracy en train y test (80/20 split)

6. Compara la accuracy del perceptron vs la red de dos capas. Documenta la diferencia.

## Usa IA para...

- Pedirle a Claude que te explique por que el perceptron no puede resolver el problema XOR y como una red multicapa lo soluciona (pide el diagrama logico)
- Pedirle que te genere 5 preguntas de comprension sobre el algoritmo de actualizacion de pesos
- Si tu implementacion numpy tiene errores de dimension (shape mismatch), pega el traceback completo y pide diagnostico
- Pedir que te explique la diferencia entre un perceptron y una neurona biologica en lenguaje simple

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que es un hiperplano de separacion y por que el perceptron lo aprende
- Por que necesitamos multiples capas para problemas no linealmente separables
- Que significa que un modelo "converge" durante el entrenamiento
- Cual es la relacion entre el learning rate y la velocidad de convergencia

## Reto Extra

Implementa el problema XOR con tu red de dos capas. El XOR no es linealmente separable, por lo que el perceptron simple fallara (accuracy ~50%). Demuestra que tu red de dos capas lo resuelve con accuracy >= 95% despues de 1000 epocas. Visualiza como la capa oculta transforma el espacio de entrada para hacerlo separable.
