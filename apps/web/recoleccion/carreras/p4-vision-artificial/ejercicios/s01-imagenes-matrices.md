# Ejercicio Sesion 1: Imagenes como Matrices — Carga y Manipulacion

**Materia:** Vision Artificial
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 45 min

## Objetivo

Comprender la representacion numerica de imagenes digitales (matrices de pixeles, canales RGB, espacios de color), manipular imagenes con NumPy y PIL/Pillow a nivel de array, y realizar operaciones de preprocesamiento basicas que son la base de todo pipeline de vision artificial.

## Contexto (Ecuador)

El Instituto Geografico Militar (IGM) del Ecuador produce cartografia y fotografias aereas del territorio nacional. Para procesar estas imagenes satelitales y detectar cambios en uso del suelo (deforestacion en la Amazonia, expansion urbana en Quito), primero es necesario dominar la representacion y manipulacion de imagenes como datos numericos.

## Instrucciones

1. Abre Google Colab. Importa las librerias:
   ```python
   import numpy as np
   import matplotlib.pyplot as plt
   from PIL import Image, ImageEnhance, ImageFilter
   import requests
   from io import BytesIO

   # Descarga imagenes de Ecuador de dominio publico
   urls_ecuador = {
       'quito': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Quito_centro_hist%C3%B3rico.jpg/1280px-Quito_centro_hist%C3%B3rico.jpg',
       'galapagos': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Galapagos_Islands_-_Isabela_Island.jpg/1280px-Galapagos_Islands_-_Isabela_Island.jpg',
   }

   def load_image(url):
       response = requests.get(url)
       img = Image.open(BytesIO(response.content)).convert('RGB')
       return img, np.array(img)

   img_quito, arr_quito = load_image(urls_ecuador['quito'])
   ```

2. Explora la estructura de datos:
   ```python
   print(f"Shape: {arr_quito.shape}")       # (height, width, channels)
   print(f"Dtype: {arr_quito.dtype}")        # uint8
   print(f"Min/Max: {arr_quito.min()}/{arr_quito.max()}")  # 0-255
   print(f"Tamano en MB: {arr_quito.nbytes / 1024**2:.2f} MB")

   # Visualiza los 3 canales RGB por separado
   fig, axes = plt.subplots(1, 4, figsize=(16, 4))
   axes[0].imshow(arr_quito)
   axes[0].set_title('Original RGB')
   for i, (canal, color) in enumerate(zip([0,1,2], ['Reds','Greens','Blues'])):
       axes[i+1].imshow(arr_quito[:,:,canal], cmap=color)
       axes[i+1].set_title(f'Canal {"RGB"[canal]}')
   plt.tight_layout()
   ```

3. Operaciones de manipulacion con NumPy:
   ```python
   # Recorte (crop) de region de interes
   roi = arr_quito[100:400, 200:600, :]
   print(f"ROI shape: {roi.shape}")

   # Redimensionar a tamano fijo para ML (sin PIL)
   from skimage.transform import resize
   resized = resize(arr_quito, (224, 224), anti_aliasing=True)

   # Normalizacion
   norm_01   = arr_quito / 255.0              # [0, 1]
   norm_zscore = (arr_quito - arr_quito.mean()) / arr_quito.std()  # z-score
   imagenet_norm = (arr_quito/255.0 - [0.485,0.456,0.406]) / [0.229,0.224,0.225]  # ImageNet

   # Flip horizontal y vertical
   flip_h = arr_quito[:, ::-1, :]    # espejo horizontal
   flip_v = arr_quito[::-1, :, :]    # espejo vertical

   # Rotar 90 grados
   rotado = np.rot90(arr_quito)
   ```

4. Conversion de espacios de color:
   ```python
   import cv2

   # RGB -> Grayscale
   gris = cv2.cvtColor(arr_quito, cv2.COLOR_RGB2GRAY)

   # RGB -> HSV (util para segmentacion por color)
   hsv = cv2.cvtColor(arr_quito, cv2.COLOR_RGB2HSV)
   print(f"Rango H: {hsv[:,:,0].min()}-{hsv[:,:,0].max()}")   # 0-179
   print(f"Rango S: {hsv[:,:,1].min()}-{hsv[:,:,1].max()}")   # 0-255

   # RGB -> LAB (perceptualmente uniforme, bueno para comparacion de colores)
   lab = cv2.cvtColor(arr_quito, cv2.COLOR_RGB2LAB)
   ```

5. Analisis del histograma:
   ```python
   # Histograma por canal
   fig, axes = plt.subplots(1, 3, figsize=(15, 4))
   for i, (canal, color) in enumerate(zip([0,1,2], ['red','green','blue'])):
       axes[i].hist(arr_quito[:,:,canal].ravel(), bins=256, color=color, alpha=0.7)
       axes[i].set_title(f'Histograma canal {"RGB"[canal]}')
       axes[i].set_xlim([0, 255])

   # Ecualizacion de histograma para mejorar contraste
   from PIL import ImageOps
   img_ecualizada = ImageOps.equalize(Image.fromarray(arr_quito))
   ```

6. Calcula y grafica la diferencia entre la imagen original y la ecualizada. Que zonas de la imagen de Quito cambiaron mas?

## Usa IA para...

- Pedirle a Claude que explique visualmente por que una imagen a color requiere 3 veces mas espacio que una en escala de grises
- Preguntar la diferencia entre interpolacion bilineal y bicubica al redimensionar imagenes para ML
- Si los canales RGB aparecen en orden incorrecto (imagen con tonos extranas), preguntar la diferencia entre BGR (OpenCV default) y RGB (PIL/matplotlib)
- Pedir que genere codigo para calcular el PSNR (Peak Signal-to-Noise Ratio) entre la imagen original y la comprimida al 50%

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Por que una imagen de 1280x720 RGB tiene exactamente 2,764,800 bytes sin comprimir
- Que ventaja ofrece el espacio HSV sobre RGB para segmentar objetos por color
- Como afecta la normalizacion ImageNet al entrenamiento de modelos pre-entrenados
- Que informacion provee el histograma de una imagen y como la ecualizacion mejora el contraste

## Reto Extra

Implementa un "difference detector" para imagenes de la misma zona geografica tomadas en fechas distintas (deforestacion en el Yasuni). Descarga dos imagenes satelitales de la misma region con anos de diferencia (NASA EarthData o Google Earth Engine). Calcula la diferencia absoluta pixel a pixel en el canal verde (Green = vegetacion), aplica un umbral para detectar zonas de cambio y genera un mapa de calor de las areas afectadas. Cuantifica el porcentaje de cobertura vegetal perdida.
