# Ejercicio Sesion 8: Proyecto — Clasificador de Imagenes Ecuador (Flora y Fauna)

**Materia:** Deep Learning y Redes Neuronales
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 60 min

## Objetivo

Construir un clasificador de imagenes de extremo a extremo (end-to-end) aplicando todas las tecnicas del periodo: CNN personalizada o transfer learning, regularizacion, data augmentation y evaluacion rigurosa. El clasificador identificara especies endemicas de Ecuador relevantes para conservacion ambiental y turismo.

## Contexto (Ecuador)

Ecuador es uno de los 17 paises megadiversos del mundo: 1,600 especies de aves, 450 anfibios, 350 reptiles. El Ministerio del Ambiente necesita un sistema automatico para identificar especies en imagenes de camaras trampa instaladas en reservas como el Yasuni, Mache-Chindul o la Reserva Cayapas-Mataje. Este proyecto simula ese sistema real.

## Instrucciones

### Parte 1: Recoleccion y Preparacion de Datos (15 min)

1. Crea un dataset de 5 categorias ecuatorianas usando iNaturalist o imagenes de dominio publico. Si no tienes acceso directo, usa el dataset `Oxford 102 Flowers` o `Caltech-UCSD Birds` como proxy y renombra las clases.

   Categorias sugeridas (o su equivalente en el dataset proxy):
   - Condor Andino
   - Tortuga Galapagos
   - Mono Aullador
   - Bromelia/Orquidea
   - Iguana Marina

2. Organiza la estructura de carpetas:
   ```
   dataset_ecuador/
   ├── train/
   │   ├── condor/       (min 80 imagenes)
   │   ├── tortuga/      (min 80 imagenes)
   │   ├── mono/         (min 80 imagenes)
   │   ├── bromelia/     (min 80 imagenes)
   │   └── iguana/       (min 80 imagenes)
   ├── val/              (20% de cada clase)
   └── test/             (10% de cada clase)
   ```

3. Usa `ImageDataGenerator` con `flow_from_directory` para cargar los datos:
   ```python
   train_gen = ImageDataGenerator(
       rescale=1./255,
       rotation_range=20,
       zoom_range=0.2,
       horizontal_flip=True,
       width_shift_range=0.1,
       height_shift_range=0.1,
       shear_range=0.1
   ).flow_from_directory('dataset_ecuador/train', target_size=(224,224), batch_size=32)
   ```

### Parte 2: Arquitectura y Entrenamiento (25 min)

4. Elige y justifica tu arquitectura. Opciones:
   - CNN desde cero (si tienes 500+ imagenes por clase)
   - MobileNetV2 fine-tuned (recomendado para 80-200 imagenes por clase)
   - EfficientNetB2 (mayor accuracy, mas lento)

5. Implementa el entrenamiento en 2 fases (feature extraction 20 epocas + fine-tuning 20 epocas) con todos los callbacks: EarlyStopping, ReduceLROnPlateau, ModelCheckpoint.

6. Documenta en el notebook:
   - Arquitectura elegida y justificacion
   - Total de parametros vs parametros entrenables por fase
   - Curvas de loss y accuracy de ambas fases en el mismo grafico

### Parte 3: Evaluacion y Despliegue (20 min)

7. Evaluacion completa en test set:
   ```python
   from sklearn.metrics import classification_report, confusion_matrix
   import seaborn as sns

   y_pred = model.predict(test_gen)
   y_pred_classes = np.argmax(y_pred, axis=1)

   print(classification_report(y_test, y_pred_classes,
                                target_names=clases))
   # Confusion matrix heatmap con seaborn
   ```

8. Analisis de errores: muestra las 10 predicciones con MENOR confianza (las que el modelo duda mas). Son casos ambiguos o errores claros?

9. Exporta el modelo para produccion:
   ```python
   # Formato SavedModel (para TF Serving)
   model.save('clasificador_ecuador_v1')

   # Formato TFLite (para apps moviles en campo)
   converter = tf.lite.TFLiteConverter.from_saved_model('clasificador_ecuador_v1')
   tflite_model = converter.convert()
   with open('clasificador_ecuador.tflite', 'wb') as f:
       f.write(tflite_model)
   print(f"Tamano modelo TFLite: {len(tflite_model)/1024:.1f} KB")
   ```

10. Escribe un mini-reporte (en el notebook, celda Markdown) con:
    - Accuracy por clase y overall
    - Que clase fue mas dificil de clasificar y por que
    - Limitaciones del modelo y datos necesarios para mejorarlo
    - Costo estimado de entrenar este modelo en AWS SageMaker vs Google Colab

## Usa IA para...

- Pedirle a Claude que revise tu reporte y sugiera mejoras tecnicas y de presentacion
- Pedirle a ChatGPT que genere el codigo para convertir el modelo a ONNX (formato universal para produccion)
- Pedir un prompt de imagen para generar imagenes sinteticas de las especies con Midjourney o Stable Diffusion (data augmentation generativa)
- Preguntar como calcular el costo de inferencia en produccion si el sistema procesa 10,000 imagenes por dia en AWS Lambda

## Que aprendiste

Al terminar este proyecto integrador debes poder:
- Construir un pipeline de vision por computadora completo desde datos hasta modelo exportado
- Diagnosticar y resolver problemas de dataset desbalanceado, overfitting y baja accuracy
- Comunicar resultados tecnicos a una audiencia no tecnica (directores del Ministerio)
- Estimar el costo y viabilidad operativa de desplegar el modelo en produccion

## Reto Extra

Construye una interfaz web minima usando Gradio para que funcionarios del Ministerio puedan subir una foto desde su celular y obtener la clasificacion en tiempo real. Despliega la app en Hugging Face Spaces (gratis):
```python
import gradio as gr

def clasificar(imagen):
    # Preprocesa, predice y retorna clase + confianza
    pass

demo = gr.Interface(fn=clasificar,
                    inputs=gr.Image(type="pil"),
                    outputs=gr.Label(num_top_classes=3),
                    title="Clasificador de Especies Ecuador")
demo.launch(share=True)
```
Comparte el link publico con tu instructor. Este ejercicio simula un MVP real de producto de IA.
