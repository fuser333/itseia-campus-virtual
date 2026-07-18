# Ejercicio Sesion 4: CNNs — Redes Convolucionales para Imagenes

**Materia:** Deep Learning y Redes Neuronales
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 60 min

## Objetivo

Disenar y entrenar una Red Neuronal Convolucional (CNN) desde cero con Keras para clasificacion de imagenes, entendiendo el rol de las capas Conv2D, MaxPooling, Flatten y Dense, y visualizando los feature maps para interpretar lo que la red "ve".

## Contexto (Ecuador)

Las Galapagos son Patrimonio Natural de la Humanidad. El Parque Nacional Galapagos necesita un sistema automatico para identificar especies de aves en imagenes tomadas por drones de vigilancia. Vamos a usar el dataset CIFAR-10 como proxy (10 clases de objetos), con la arquitectura que luego podria adaptarse para aves endemicas ecuatorianas.

## Instrucciones

1. Abre Google Colab con GPU T4. Carga CIFAR-10:
   ```python
   from tensorflow.keras.datasets import cifar10
   (X_train, y_train), (X_test, y_test) = cifar10.load_data()
   X_train = X_train.astype('float32') / 255.0
   X_test  = X_test.astype('float32') / 255.0
   ```

2. Visualiza 25 imagenes del dataset en una grilla 5x5 con sus etiquetas. Las clases son: airplane, automobile, bird, cat, deer, dog, frog, horse, ship, truck.

3. Construye tu CNN desde cero:
   ```python
   model = keras.Sequential([
       layers.Conv2D(32, (3,3), activation='relu', padding='same', input_shape=(32,32,3)),
       layers.BatchNormalization(),
       layers.Conv2D(32, (3,3), activation='relu', padding='same'),
       layers.MaxPooling2D(2,2),
       layers.Dropout(0.25),

       layers.Conv2D(64, (3,3), activation='relu', padding='same'),
       layers.BatchNormalization(),
       layers.Conv2D(64, (3,3), activation='relu', padding='same'),
       layers.MaxPooling2D(2,2),
       layers.Dropout(0.25),

       layers.Flatten(),
       layers.Dense(512, activation='relu'),
       layers.BatchNormalization(),
       layers.Dropout(0.5),
       layers.Dense(10, activation='softmax')
   ])
   model.summary()
   ```

4. Agrega data augmentation:
   ```python
   datagen = keras.preprocessing.image.ImageDataGenerator(
       rotation_range=15,
       width_shift_range=0.1,
       height_shift_range=0.1,
       horizontal_flip=True,
   )
   datagen.fit(X_train)
   ```

5. Entrena con el generador aumentado por 30 epocas (con GPU deberia tomar ~5 min). Target: accuracy > 75% en test.

6. Visualiza los feature maps de la primera capa Conv2D para una imagen de un bird. Crea un modelo intermedio:
   ```python
   intermediate = keras.Model(inputs=model.input,
                               outputs=model.layers[0].output)
   feature_maps = intermediate.predict(imagen[np.newaxis,...])
   # Grafica los primeros 16 feature maps en una grilla 4x4
   ```

7. Reporta la matriz de confusion. Identifica las 3 clases que mas se confunden entre si. Explica por que.

## Usa IA para...

- Pedirle a Claude que explique visualmente que detecta cada capa de una CNN: bordes en Conv1, texturas en Conv2, partes en Conv3, objetos en capas profundas
- Si la accuracy se estanca en <60%, pregunta las 5 causas mas comunes y como diagnosticarlas
- Pedir que compare tu arquitectura con LeNet-5, VGG-16 y ResNet en terminos de profundidad y parametros
- Generar el codigo para calcular el numero de parametros entrenables por capa y explicar de donde viene cada numero

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que aprende cada capa convolucional (jerarquia de caracteristicas)
- Por que MaxPooling reduce overfitting ademas de reducir dimensionalidad
- Como data augmentation simula un dataset mas grande
- Que informacion transmite una matriz de confusion de 10 clases

## Reto Extra

Implementa Grad-CAM (Gradient-weighted Class Activation Mapping) para visualizar que region de la imagen activa la prediccion de tu CNN. Usa la libreria `tf-keras-vis` o implementa manualmente con `tf.GradientTape`. Muestra los heatmaps para 5 imagenes correctamente clasificadas y 5 incorrectamente clasificadas. Concluye: esta mirando el lugar correcto de la imagen?
