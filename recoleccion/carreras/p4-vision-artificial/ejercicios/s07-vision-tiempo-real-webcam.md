# Ejercicio Sesion 7: Vision por Computadora en Tiempo Real (Webcam)

**Materia:** Vision Artificial
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion:** 55 min

## Objetivo

Implementar sistemas de vision artificial en tiempo real usando la webcam del computador o camara IP, procesando cada frame con OpenCV y modelos de deteccion, aplicando tecnicas de optimizacion para mantener latencia baja (>15 FPS), con casos de uso de seguridad y experiencia de usuario para Ecuador.

## Contexto (Ecuador)

Corporacion Favorita (dueno de los supermercados AKI, Gran AKI, Mega Santa Maria en Ecuador) quiere implementar sistemas de "checkout sin cajero" (Amazon Go-style) en sus tiendas. El sistema necesita: deteccion de productos tomados del estante, reconocimiento de rostros para identificar al cliente, y deteccion de comportamiento anomalo (robo). Todo en tiempo real desde camaras de seguridad.

## Instrucciones

1. Este ejercicio se ejecuta LOCAL en tu computador (no Colab, para acceder a la webcam). Instala en tu maquina:
   ```bash
   pip install opencv-python ultralytics mediapipe cvzone
   ```

   Si no tienes webcam, usa una camara IP o descarga un video de trafico/personas de YouTube como archivo .mp4.

2. NIVEL 1 — Pipeline basico de video:
   ```python
   import cv2
   import time

   cap = cv2.VideoCapture(0)  # 0 = webcam, o ruta a video .mp4
   cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
   cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

   fps_counter = 0
   fps_start = time.time()
   fps_display = 0

   while True:
       ret, frame = cap.read()
       if not ret: break

       # Calculo de FPS
       fps_counter += 1
       if time.time() - fps_start >= 1.0:
           fps_display = fps_counter
           fps_counter = 0
           fps_start = time.time()

       # Muestra FPS en frame
       cv2.putText(frame, f'FPS: {fps_display}', (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

       cv2.imshow('Vision en Tiempo Real - ITSEIA', frame)
       if cv2.waitKey(1) & 0xFF == ord('q'):
           break

   cap.release()
   cv2.destroyAllWindows()
   ```

3. NIVEL 2 — Deteccion de personas con YOLO en tiempo real:
   ```python
   from ultralytics import YOLO
   import cv2

   model = YOLO('yolov8n.pt')

   cap = cv2.VideoCapture('video_tienda.mp4')

   # Para optimizar: solo procesa 1 de cada 2 frames
   frame_skip = 2
   frame_count = 0

   while True:
       ret, frame = cap.read()
       if not ret: break

       frame_count += 1
       if frame_count % frame_skip != 0:
           continue

       # Deteccion YOLO
       results = model(frame, classes=[0], conf=0.5, verbose=False)  # clase 0 = persona
       annotated = results[0].plot()

       # Cuenta personas en el frame
       n_personas = len(results[0].boxes)
       cv2.putText(annotated, f'Personas en tienda: {n_personas}',
                   (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

       cv2.imshow('Aforo en Tiempo Real', annotated)
       if cv2.waitKey(1) & 0xFF == ord('q'):
           break
   ```

4. NIVEL 3 — Deteccion de maños con MediaPipe:
   ```python
   import mediapipe as mp

   mp_hands = mp.solutions.hands
   mp_drawing = mp.solutions.drawing_utils

   cap = cv2.VideoCapture(0)

   with mp_hands.Hands(max_num_hands=2,
                        min_detection_confidence=0.7,
                        min_tracking_confidence=0.5) as hands:
       while True:
           ret, frame = cap.read()
           if not ret: break

           # MediaPipe requiere RGB
           frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
           results = hands.process(frame_rgb)

           if results.multi_hand_landmarks:
               for hand_landmarks in results.multi_hand_landmarks:
                   mp_drawing.draw_landmarks(frame, hand_landmarks,
                                              mp_hands.HAND_CONNECTIONS)

                   # Detecta si la mano esta "abierta" o "cerrada"
                   # Basado en la posicion de los fingertips vs la palma
                   fingertip_ids = [4, 8, 12, 16, 20]  # IDs de las puntas
                   dedos_extendidos = 0
                   landmarks = hand_landmarks.landmark
                   for tip_id in fingertip_ids[1:]:  # Excluye pulgar
                       if landmarks[tip_id].y < landmarks[tip_id - 2].y:
                           dedos_extendidos += 1

                   gesto = "ABIERTA" if dedos_extendidos >= 4 else "CERRADA"
                   cv2.putText(frame, f'Mano: {gesto}', (10, 70),
                               cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

           cv2.imshow('Detector de Maños - MediaPipe', frame)
           if cv2.waitKey(1) & 0xFF == ord('q'):
               break
   ```

5. NIVEL 4 — Sistema integrado de seguridad para tienda:
   ```python
   # Combina YOLO (personas) + OpenCV (zona prohibida)
   # Define zona de caja/caja fuerte como rectangulo rojo
   # Alerta si una persona entra a la zona fuera de horario

   ZONA_PROHIBIDA = (100, 100, 400, 300)  # x1, y1, x2, y2

   def persona_en_zona(bbox, zona):
       px1, py1, px2, py2 = bbox
       zx1, zy1, zx2, zy2 = zona
       cx, cy = (px1+px2)//2, (py1+py2)//2
       return zx1 < cx < zx2 and zy1 < cy < zy2

   # En el loop de video:
   for box in results[0].boxes:
       x1, y1, x2, y2 = map(int, box.xyxy[0])
       if persona_en_zona((x1,y1,x2,y2), ZONA_PROHIBIDA):
           cv2.rectangle(frame, (x1,y1), (x2,y2), (0,0,255), 3)
           cv2.putText(frame, 'ALERTA: Zona Restringida',
                       (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)
   ```

6. Benchmark de rendimiento: Mide los FPS con diferentes configuraciones:
   - Solo OpenCV sin modelo (baseline)
   - YOLO nano (yolov8n) en CPU
   - YOLO nano en GPU (si aplica)
   - YOLO small en GPU
   Reporta una tabla de FPS y latencia por frame.

## Usa IA para...

- Pedirle a ChatGPT que diseñe la arquitectura completa del sistema de checkout sin cajero: que camaras, que modelos, que pipeline de decision y como integrar con el sistema de pago del supermercado
- Preguntar que es el "tracking" de objetos y como ByteTrack o DeepSORT mantiene la identidad de un objeto entre frames
- Si el sistema cae a menos de 5 FPS con YOLO, preguntar las tecnicas de optimizacion: TensorRT, OpenVINO, ONNX Runtime, reducir resolucion de entrada
- Pedir el codigo para guardar automaticamente un clip de video de 10 segundos cuando se detecta una alerta de zona restringida

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que latencia en milisegundos requiere un sistema de vision en tiempo real para ser "fluido" (>15 FPS = <67ms/frame)
- Que es el "tracking" y por que YOLO solo hace deteccion pero no tracking entre frames
- Como MediaPipe logra velocidades de 30+ FPS en CPU usando grafos de calculo optimizados
- Que trade-off existe entre precision del modelo y FPS en aplicaciones de CV en tiempo real

## Reto Extra

Implementa reconocimiento de emociones en tiempo real usando el modelo `deepface` o `fer`. El sistema debe: 1) Detectar todos los rostros en el frame con MTCNN, 2) Para cada rostro, predecir la emocion predominante (feliz, triste, enojado, sorprendido, neutral), 3) Mostrar la emocion y el porcentaje de confianza sobre cada rostro, 4) Generar una barra de estadisticas en tiempo real: "% de clientes felices en los ultimos 30 segundos". Este sistema es real: varias cadenas de retail en Ecuador lo usan para medir satisfaccion del cliente sin encuestas.
