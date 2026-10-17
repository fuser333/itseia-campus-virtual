# Ejercicio Sesion 3: Deteccion de Objetos con YOLO

**Materia:** Vision Artificial
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 60 min

## Objetivo

Implementar deteccion de objetos en tiempo real usando YOLO (You Only Look Once) v8/v11 con Ultralytics, realizando inference sobre imagenes y video, interpretando las bounding boxes y scores de confianza, y entrenando un modelo personalizado para detectar objetos especificos del contexto ecuatoriano.

## Contexto (Ecuador)

El Municipio de Quito necesita un sistema de gestion de trafico inteligente. Las camaras de las intersecciones deben contar automaticamente vehiculos por tipo (auto, moto, bus, camion), detectar peatones y generar estadisticas en tiempo real para optimizar los semaforos. YOLO es la tecnologia estandar para este tipo de sistemas.

## Instrucciones

1. Abre Google Colab con GPU T4. Instala Ultralytics:
   ```python
   !pip install ultralytics
   from ultralytics import YOLO
   import cv2
   import numpy as np
   from PIL import Image
   import matplotlib.pyplot as plt
   import requests
   from io import BytesIO

   # Verifica GPU
   import torch
   print(f"CUDA: {torch.cuda.is_available()}")
   print(f"GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'No GPU'}")
   ```

2. Carga YOLOv8 pre-entrenado y haz inference en imagenes de trafico de Quito:
   ```python
   # Carga el modelo YOLOv8 nano (mas rapido, menos preciso)
   model = YOLO('yolov8n.pt')  # descarga automaticamente ~6MB

   # Descarga imagen de trafico ecuatoriano
   url_trafico = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Avenida_de_los_Shyris_Quito.jpg/1280px-Avenida_de_los_Shyris_Quito.jpg"
   response = requests.get(url_trafico)
   img = Image.open(BytesIO(response.content))
   img.save('trafico_quito.jpg')

   # Inference
   results = model('trafico_quito.jpg', conf=0.3, iou=0.5)

   # Visualiza
   annotated = results[0].plot()
   plt.figure(figsize=(14, 8))
   plt.imshow(cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB))
   plt.axis('off')
   plt.title('YOLO v8 - Deteccion de Objetos en Quito')
   plt.show()
   ```

3. Analiza los resultados detalladamente:
   ```python
   result = results[0]
   boxes = result.boxes

   print(f"Total detecciones: {len(boxes)}")
   print(f"\nDetecciones por clase:")

   contador = {}
   for box in boxes:
       clase_id = int(box.cls[0])
       clase_nombre = model.names[clase_id]
       confianza = float(box.conf[0])
       x1, y1, x2, y2 = box.xyxy[0].tolist()

       contador[clase_nombre] = contador.get(clase_nombre, 0) + 1
       print(f"  {clase_nombre:<15} conf={confianza:.2f}  bbox=[{x1:.0f},{y1:.0f},{x2:.0f},{y2:.0f}]")

   print(f"\nResumen: {contador}")
   ```

4. Prueba con 5 imagenes de diferentes zonas de Quito/Guayaquil. Para cada una registra:
   - Cuantos vehiculos por tipo
   - Cuantos peatones
   - Deteccion con mayor confianza
   - Deteccion con menor confianza (falsos positivos probables)

5. Comparacion de modelos YOLO:
   ```python
   modelos = {
       'YOLOv8n': YOLO('yolov8n.pt'),   # Nano: 3.2M params
       'YOLOv8s': YOLO('yolov8s.pt'),   # Small: 11.2M params
       'YOLOv8m': YOLO('yolov8m.pt'),   # Medium: 25.9M params
   }

   import time
   for nombre, modelo in modelos.items():
       inicio = time.time()
       results = modelo('trafico_quito.jpg')
       tiempo = time.time() - inicio
       detecciones = len(results[0].boxes)
       print(f"{nombre}: {detecciones} detecciones, {tiempo:.2f}s, "
             f"{detecciones/tiempo:.1f} det/s")
   ```

6. Fine-tuning con dataset personalizado de contexto ecuatoriano. Crea un mini-dataset de 50 imagenes con objetos propios:
   - Caso: detector de "mototaxis" (tipico del Ecuador)
   - Descarga imagenes de dominio publico
   - Crea el archivo YAML de configuracion:
   ```yaml
   # dataset_mototaxi.yaml
   path: /content/dataset_mototaxi
   train: images/train
   val: images/val
   nc: 1
   names: ['mototaxi']
   ```
   - Anota 20 imagenes con el formato YOLO usando Roboflow (gratis)
   - Entrena 10 epocas como demo del proceso:
   ```python
   model_custom = YOLO('yolov8n.pt')
   results = model_custom.train(
       data='dataset_mototaxi.yaml',
       epochs=10,
       imgsz=640,
       batch=16,
       device=0
   )
   ```

## Usa IA para...

- Pedirle a Claude que explique la arquitectura YOLO: que es "You Only Look Once" vs los detectores de 2 etapas como R-CNN
- Preguntar la diferencia entre los parametros `conf` (confianza minima) e `iou` (Non-Maximum Suppression) y como ajustarlos para reducir falsos positivos vs falsos negativos
- Si el modelo detecta objetos que no existen (hallucinations en CV), preguntar como validar si es un problema del modelo o del angulo/iluminacion de la imagen
- Pedir el codigo para procesar un video completo frame a frame y generar estadisticas de trafico por minuto

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Por que YOLO es tan rapido comparado con detectores de dos etapas (R-CNN, Faster R-CNN)
- Que es IoU (Intersection over Union) y como se usa en la evaluacion de detectores
- Que es Non-Maximum Suppression (NMS) y por que es necesario en deteccion de objetos
- Como el tamano del modelo (n/s/m/l/x) impacta en el trade-off velocidad vs precision

## Reto Extra

Implementa un sistema de conteo de aforo en un local comercial ecuatoriano. Usando YOLOv8 con tracking (ByteTrack), cuenta cuantas personas entran y salen de un local. Cada persona que cruza una linea virtual definida en la mitad del frame se cuenta como entrada o salida segun la direccion. Genera un reporte CSV cada 10 segundos con: timestamp, entradas_acumuladas, salidas_acumuladas, aforo_actual. Simula con un video de YouTube de un centro comercial de Quito (CCI, Quicentro, El Recreo).
