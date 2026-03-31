# Ejercicio Sesion 2: OpenCV — Filtros, Bordes y Transformaciones

**Materia:** Vision Artificial
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion:** 50 min

## Objetivo

Dominar las operaciones fundamentales de procesamiento de imagen con OpenCV: filtros espaciales (blur, sharpen), deteccion de bordes (Canny, Sobel, Laplaciano), transformaciones geometricas (perspectiva, homografia) y operaciones morfologicas (erosion, dilatacion, apertura, cierre).

## Contexto (Ecuador)

La Agencia de Regulacion y Control de Electricidad (ARCONEL) necesita detectar anomalias en torres de alta tension a partir de imagenes aereas tomadas con drones. Grietas, oxido y deformaciones son los defectos a detectar. La deteccion de bordes y filtros especializados son el paso previo indispensable antes de aplicar modelos de deep learning.

## Instrucciones

1. Abre Google Colab. Importa y carga una imagen de infraestructura:
   ```python
   import cv2
   import numpy as np
   import matplotlib.pyplot as plt
   from google.colab.patches import cv2_imshow

   # Funcion helper para mostrar multiples imagenes
   def mostrar_grid(imagenes, titulos, figsize=(16,8), cmap=None):
       fig, axes = plt.subplots(1, len(imagenes), figsize=figsize)
       for ax, img, titulo in zip(axes, imagenes, titulos):
           if len(img.shape) == 2:
               ax.imshow(img, cmap='gray')
           else:
               ax.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
           ax.set_title(titulo, fontsize=10)
           ax.axis('off')
       plt.tight_layout()
       plt.show()
   ```

2. Descarga y convierte una imagen a escala de grises:
   ```python
   !wget -O torre.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Electrical_tower.jpg/800px-Electrical_tower.jpg"
   img = cv2.imread('torre.jpg')
   gris = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
   ```

3. Filtros de suavizado (ruido):
   ```python
   # Gaussian blur (mas natural)
   blur_gaussian = cv2.GaussianBlur(gris, (5,5), sigmaX=1.5)

   # Median blur (excelente para ruido sal y pimienta)
   blur_median = cv2.medianBlur(gris, 5)

   # Bilateral filter (suaviza pero preserva bordes)
   blur_bilateral = cv2.bilateralFilter(img, d=9, sigmaColor=75, sigmaSpace=75)

   mostrar_grid([gris, blur_gaussian, blur_median, cv2.cvtColor(blur_bilateral, cv2.COLOR_BGR2GRAY)],
                ['Original', 'Gaussian', 'Median', 'Bilateral'])
   ```

4. Deteccion de bordes:
   ```python
   # Operador Sobel (gradientes en X e Y)
   sobel_x = cv2.Sobel(gris, cv2.CV_64F, 1, 0, ksize=3)
   sobel_y = cv2.Sobel(gris, cv2.CV_64F, 0, 1, ksize=3)
   sobel_mag = np.sqrt(sobel_x**2 + sobel_y**2).astype(np.uint8)

   # Operador Laplaciano
   laplaciano = cv2.Laplacian(blur_gaussian, cv2.CV_64F)
   laplaciano_abs = np.uint8(np.absolute(laplaciano))

   # Canny (el mas usado en CV)
   canny_bajo = cv2.Canny(gris, threshold1=50, threshold2=150)
   canny_alto = cv2.Canny(gris, threshold1=100, threshold2=200)

   mostrar_grid([sobel_mag, laplaciano_abs, canny_bajo, canny_alto],
                ['Sobel', 'Laplaciano', 'Canny (50/150)', 'Canny (100/200)'])
   ```

5. Morfologia matematica:
   ```python
   # Kernel (elemento estructurante)
   kernel_3x3 = np.ones((3,3), np.uint8)
   kernel_5x5 = np.ones((5,5), np.uint8)

   # Erosion: elimina pequenos objetos blancos
   erosion = cv2.erode(canny_bajo, kernel_3x3, iterations=1)

   # Dilatacion: engruesa los bordes
   dilatacion = cv2.dilate(canny_bajo, kernel_3x3, iterations=1)

   # Apertura = erosion + dilatacion (elimina ruido)
   apertura = cv2.morphologyEx(canny_bajo, cv2.MORPH_OPEN, kernel_5x5)

   # Cierre = dilatacion + erosion (rellena huecos en objetos)
   cierre = cv2.morphologyEx(canny_bajo, cv2.MORPH_CLOSE, kernel_5x5)
   ```

6. Transformacion de perspectiva (correccion de angulo de camara):
   ```python
   # Define 4 puntos de la imagen original y sus destinos corregidos
   pts_origen = np.float32([[50,50],[400,50],[50,400],[400,400]])
   pts_destino = np.float32([[0,0],[450,0],[0,450],[450,450]])

   M = cv2.getPerspectiveTransform(pts_origen, pts_destino)
   img_perspectiva = cv2.warpPerspective(img, M, (450, 450))
   ```

7. Deteccion de contornos en la imagen de la torre:
   ```python
   contornos, jerarquia = cv2.findContours(canny_bajo, cv2.RETR_EXTERNAL,
                                             cv2.CHAIN_APPROX_SIMPLE)
   img_contornos = img.copy()
   cv2.drawContours(img_contornos, contornos, -1, (0, 255, 0), 2)
   print(f"Contornos detectados: {len(contornos)}")

   # Filtra solo los contornos grandes (estructuras principales)
   contornos_grandes = [c for c in contornos if cv2.contourArea(c) > 100]
   ```

## Usa IA para...

- Pedirle a ChatGPT que explique la diferencia matematica entre el filtro Gaussiano y el filtro de mediana: por que el de mediana es mejor para ruido impulsivo?
- Preguntar cuando usar Canny vs Sobel vs Laplaciano en aplicaciones industriales (deteccion de defectos)
- Si Canny genera demasiados bordes falsos, preguntar como optimizar los umbrales automaticamente con el metodo de Otsu
- Pedir el codigo para aplicar la transformada de Hough para detectar lineas rectas en la torre de alta tension

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Por que aplicar blur antes de Canny mejora la deteccion de bordes
- Que es la "apertura morfologica" y como elimina el ruido en imagenes binarias
- Que es la transformacion de perspectiva y en que aplicaciones es necesaria (documentos, placas de carros)
- Por que Canny es superior a Sobel/Laplaciano para aplicaciones de CV modernas

## Reto Extra

Implementa un detector de placas de carros ecuatorianas (formato ABC-1234) usando solo OpenCV, sin deep learning. El pipeline: 1) Convertir a escala de grises, 2) Gaussian blur, 3) Canny, 4) Detectar contornos rectangulares con relacion de aspecto 2:1 a 4:1, 5) Correccion de perspectiva del rectangulo encontrado, 6) Binarizacion adaptativa del area de la placa. Prueba con 5 fotos de carros ecuatorianos. No necesita ser perfecto, pero debe detectar correctamente la region de la placa en al menos 3 de 5 casos.
