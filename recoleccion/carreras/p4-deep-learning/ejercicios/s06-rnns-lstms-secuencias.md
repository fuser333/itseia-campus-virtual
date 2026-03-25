# Ejercicio Sesion 6: RNNs y LSTMs para Secuencias

**Materia:** Deep Learning y Redes Neuronales
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 60 min

## Objetivo

Implementar redes recurrentes (SimpleRNN, LSTM, GRU) con Keras para modelar datos secuenciales temporales, comparando su capacidad para capturar dependencias de largo plazo y aplicarlos a prediccion de series de tiempo economicas del Ecuador.

## Contexto (Ecuador)

El Banco Central del Ecuador publica mensualmente el Indice de Precios al Consumidor (IPC). Un modelo LSTM que prediga la inflacion mensual ayuda a las empresas ecuatorianas a planificar precios, salarios y presupuestos. Vamos a usar datos reales de inflacion mensual del Ecuador 2000-2024 (o series sinteticas similares) para construir este modelo predictivo.

## Instrucciones

1. Abre Google Colab con GPU T4.

2. Crea o descarga la serie temporal. Si no tienes acceso a los datos reales, genera una serie sintetica con componentes reales:
   ```python
   import numpy as np
   import pandas as pd

   np.random.seed(42)
   t = np.arange(288)  # 288 meses = 24 anos
   # Serie con tendencia, estacionalidad y ruido
   serie = (2.5 + 0.005*t +           # tendencia
            1.2*np.sin(2*np.pi*t/12) + # estacionalidad anual
            0.5*np.sin(2*np.pi*t/3) +  # estacionalidad trimestral
            np.random.normal(0, 0.3, 288))  # ruido

   df = pd.DataFrame({'mes': pd.date_range('2000-01', periods=288, freq='ME'),
                      'inflacion': serie})
   ```

3. Prepara las secuencias con ventana deslizante (window=12 meses, predice mes 13):
   ```python
   def create_sequences(data, window_size):
       X, y = [], []
       for i in range(len(data) - window_size):
           X.append(data[i:i+window_size])
           y.append(data[i+window_size])
       return np.array(X), np.array(y)

   # Normaliza primero con MinMaxScaler
   # Divide 80% train, 20% test (sin shuffle, es serie temporal)
   ```

4. Implementa y compara 4 arquitecturas:

   **Modelo 1 — SimpleRNN:**
   ```python
   keras.Sequential([
       layers.SimpleRNN(64, input_shape=(12,1)),
       layers.Dense(1)
   ])
   ```

   **Modelo 2 — LSTM:**
   ```python
   keras.Sequential([
       layers.LSTM(64, input_shape=(12,1)),
       layers.Dense(1)
   ])
   ```

   **Modelo 3 — GRU:**
   ```python
   keras.Sequential([
       layers.GRU(64, input_shape=(12,1)),
       layers.Dense(1)
   ])
   ```

   **Modelo 4 — LSTM apilado (Stacked LSTM):**
   ```python
   keras.Sequential([
       layers.LSTM(128, return_sequences=True, input_shape=(12,1)),
       layers.LSTM(64),
       layers.Dense(32, activation='relu'),
       layers.Dense(1)
   ])
   ```

5. Entrena cada modelo 100 epocas con EarlyStopping. Registra MAE y RMSE en el test set.

6. Grafica: valores reales vs predicciones de los 4 modelos en el periodo de test. Cual sigue mejor la tendencia? Cual captura mejor los picos?

## Usa IA para...

- Pedirle a Claude que dibuje el diagrama de celda LSTM (forget gate, input gate, output gate, cell state) y explique cada compuerta con una analogia sencilla
- Preguntar por que `return_sequences=True` es necesario cuando apilas dos LSTMs
- Si el modelo converge pero predice una linea plana (no captura variaciones), preguntar las causas y soluciones
- Pedir que explique la diferencia matematica entre LSTM y GRU: cual es mas rapido de entrenar y cuando preferir cada uno

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que resuelve la celda LSTM que un SimpleRNN no puede resolver (vanishing gradient en secuencias largas)
- Que diferencia hay entre `return_sequences=True` y `return_sequences=False`
- Por que NO se hace shuffle en el split de series temporales
- Como interpretar el MAE de prediccion de inflacion en terminos de puntos porcentuales

## Reto Extra

Implementa prediccion multistep: en lugar de predecir solo el siguiente mes, predice los proximos 6 meses de una vez. Cambia la salida del modelo a `Dense(6)` y ajusta la funcion `create_sequences` para que `y` sea un vector de 6 valores. Compara el error acumulado a 1, 3 y 6 meses hacia adelante. Discute si el modelo es util para planificacion empresarial en Ecuador.
