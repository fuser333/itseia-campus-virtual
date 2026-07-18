# Ejercicio Sesion 5: Transfer Learning con Modelos Pre-entrenados

**Materia:** Deep Learning y Redes Neuronales
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion:** 60 min

## Objetivo

Aplicar transfer learning usando modelos pre-entrenados en ImageNet (MobileNetV2, EfficientNetB0) para resolver un problema de clasificacion de imagenes con datos limitados, dominando las tecnicas de feature extraction y fine-tuning.

## Contexto (Ecuador)

Una startup agrotecnologica de Cuenca quiere detectar enfermedades en plantas de cacao (Ecuador es el tercer exportador mundial de cacao fino). Con solo 200-300 fotos por clase, entrenar una CNN desde cero seria inviable. Transfer learning permite usar el conocimiento de millones de imagenes para resolver este problema con pocos datos. Usaremos el dataset `tf_flowers` como proxy (5 clases de flores).

## Instrucciones

1. Abre Google Colab con GPU T4. Carga el dataset:
   ```python
   import tensorflow_datasets as tfds
   (ds_train, ds_val, ds_test), info = tfds.load(
       'tf_flowers',
       split=['train[:70%]', 'train[70%:85%]', 'train[85%:]'],
       with_info=True,
       as_supervised=True
   )
   NUM_CLASSES = info.features['label'].num_classes  # 5
   ```

2. Preprocesa las imagenes a 224x224 y aplica augmentation:
   ```python
   def preprocess(image, label):
       image = tf.image.resize(image, [224, 224])
       image = tf.cast(image, tf.float32) / 255.0
       return image, label

   augment_layer = keras.Sequential([
       layers.RandomFlip('horizontal'),
       layers.RandomRotation(0.2),
       layers.RandomZoom(0.2),
   ])
   ```

3. FASE 1 — Feature Extraction (base congelada):
   ```python
   base_model = keras.applications.MobileNetV2(
       input_shape=(224, 224, 3),
       include_top=False,
       weights='imagenet'
   )
   base_model.trainable = False  # Congela todos los pesos

   inputs = keras.Input(shape=(224, 224, 3))
   x = augment_layer(inputs)
   x = keras.applications.mobilenet_v2.preprocess_input(x)
   x = base_model(x, training=False)
   x = layers.GlobalAveragePooling2D()(x)
   x = layers.Dropout(0.2)(x)
   outputs = layers.Dense(NUM_CLASSES, activation='softmax')(x)
   model = keras.Model(inputs, outputs)
   ```
   Entrena 10 epocas con lr=0.001. Registra la accuracy de validacion.

4. FASE 2 — Fine-tuning (descongelar ultimas capas):
   ```python
   base_model.trainable = True
   # Congela todo excepto los ultimos 30 layers
   for layer in base_model.layers[:-30]:
       layer.trainable = False

   model.compile(
       optimizer=keras.optimizers.Adam(1e-5),  # LR muy pequeno
       loss='sparse_categorical_crossentropy',
       metrics=['accuracy']
   )
   ```
   Entrena 10 epocas mas. Compara accuracy antes y despues del fine-tuning.

5. Repite el experimento completo con EfficientNetB0 en lugar de MobileNetV2. Compara:
   - Accuracy final en test set
   - Tiempo de entrenamiento por epoca
   - Numero de parametros totales vs entrenables

   Presenta los resultados en una tabla comparativa.

6. Para el mejor modelo, muestra 10 predicciones con la imagen, la etiqueta real y la etiqueta predicha. Distingue visualmente los aciertos (verde) y errores (rojo).

## Usa IA para...

- Pedirle a ChatGPT que explique por que se usa un learning rate 10x menor en fine-tuning (concepto de "catastrophic forgetting")
- Pedir la lista completa de modelos disponibles en `keras.applications` con sus caracteristicas (parametros, accuracy ImageNet, velocidad)
- Si el modelo no mejora en fine-tuning, preguntar el diagnostico: puede ser LR muy alto, capas mal descongeladas, o preprocesamiento incorrecto
- Generar el codigo para hacer una prediccion con una imagen nueva descargada de internet (planta de cacao)

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que es el "catastrophic forgetting" y como el fine-tuning lo previene
- Por que se usa un learning rate mas pequeno en fine-tuning que en feature extraction
- En que casos transfer learning NO es la solucion correcta
- Como decidir cuantas capas descongelar durante fine-tuning

## Reto Extra

Implementa la tecnica de "progressive unfreezing": desbloquea las capas de atras hacia adelante en 5 etapas (6 capas por vez), entrenando 3 epocas por etapa con lr decreciente (1e-4, 5e-5, 2e-5, 1e-5, 5e-6). Grafica como cambia la accuracy de validacion a lo largo de las 5 etapas. Concluye si esta tecnica supera al fine-tuning simple en tu dataset.
