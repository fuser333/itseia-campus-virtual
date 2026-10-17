# Ejercicio Sesion 4: Segmentacion de Imagenes

**Materia:** Vision Artificial
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion:** 55 min

## Objetivo

Implementar tecnicas de segmentacion de imagenes a tres niveles: segmentacion semantica (que clase es cada pixel), segmentacion de instancias (que objeto especifico es cada pixel) y segmentacion con prompts (SAM - Segment Anything Model), aplicadas a imagenes medicas y satelitales de Ecuador.

## Contexto (Ecuador)

ImagenIA (empresa ecuatoriana de IA medica) necesita segmentar automaticamente tumores en imagenes de resonancia magnetica. Adicionalmente, el Ministerio de Agricultura requiere segmentar parcelas agricolas en imagenes satelitales para calcular areas sembradas de cacao, banano y flores en la Costa ecuatoriana. Ambas son aplicaciones reales de segmentacion.

## Instrucciones

1. Abre Google Colab con GPU T4. Instala las dependencias:
   ```python
   !pip install segmentation-models-pytorch albumentations
   !pip install git+https://github.com/facebookresearch/segment-anything.git
   import torch
   import numpy as np
   import cv2
   import matplotlib.pyplot as plt
   import segmentation_models_pytorch as smp
   ```

2. NIVEL 1 — Segmentacion con umbral (Otsu):
   ```python
   # Descarga imagen de campo agricola ecuatoriano
   !wget -O campo_ecuador.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Banana_plantation_Ecuador.jpg/1280px-Banana_plantation_Ecuador.jpg"
   img = cv2.imread('campo_ecuador.jpg')
   gris = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

   # Umbral de Otsu (automatico)
   _, thresh_otsu = cv2.threshold(gris, 0, 255,
                                   cv2.THRESH_BINARY + cv2.THRESH_OTSU)

   # Umbral adaptativo (mejor para iluminacion no uniforme)
   thresh_adapt = cv2.adaptiveThreshold(gris, 255,
                                         cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                         cv2.THRESH_BINARY, 11, 2)

   # K-means para segmentacion por color (k=3 regiones)
   pixels = img.reshape(-1, 3).astype(np.float32)
   criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
   _, labels, centers = cv2.kmeans(pixels, 3, None, criteria, 10,
                                    cv2.KMEANS_RANDOM_CENTERS)
   segmentado = centers[labels.flatten()].reshape(img.shape).astype(np.uint8)
   ```

3. NIVEL 2 — Segmentacion semantica con U-Net pre-entrenada:
   ```python
   # Usa U-Net con encoder ResNet34 pre-entrenado en ImageNet
   model_unet = smp.Unet(
       encoder_name="resnet34",
       encoder_weights="imagenet",
       in_channels=3,
       classes=1,          # segmentacion binaria: cultivo vs no-cultivo
       activation='sigmoid'
   )
   model_unet.eval()

   # Preprocesa la imagen para U-Net
   from torchvision import transforms
   transform = transforms.Compose([
       transforms.Resize((256, 256)),
       transforms.ToTensor(),
       transforms.Normalize(mean=[0.485,0.456,0.406],
                            std=[0.229,0.224,0.225])
   ])

   from PIL import Image
   img_pil = Image.open('campo_ecuador.jpg')
   tensor = transform(img_pil).unsqueeze(0)

   with torch.no_grad():
       mask_pred = model_unet(tensor)
       mask_np = mask_pred.squeeze().numpy()

   # Visualiza imagen original + mascara predicha
   fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15, 5))
   ax1.imshow(img_pil)
   ax1.set_title('Imagen Original')
   ax2.imshow(mask_np, cmap='RdYlGn')
   ax2.set_title('Mascara U-Net (sin entrenar)')
   # Superpone mascara en imagen original
   mask_resized = cv2.resize(mask_np, (img_pil.width, img_pil.height))
   overlay = np.array(img_pil.copy())
   overlay[mask_resized > 0.5] = [0, 255, 0]  # Verde = cultivo
   ax3.imshow(overlay)
   ax3.set_title('Overlay')
   ```

4. NIVEL 3 — Segment Anything Model (SAM) con prompts:
   ```python
   from segment_anything import sam_model_registry, SamPredictor

   # Descarga el checkpoint del modelo SAM
   !wget -q https://dl.fbaipublicfiles.com/segment_anything/sam_vit_b_01ec64.pth

   sam = sam_model_registry["vit_b"](checkpoint="sam_vit_b_01ec64.pth")
   sam.to(device='cuda' if torch.cuda.is_available() else 'cpu')
   predictor = SamPredictor(sam)

   # Carga imagen y genera embeddings
   image_rgb = cv2.cvtColor(cv2.imread('campo_ecuador.jpg'), cv2.COLOR_BGR2RGB)
   predictor.set_image(image_rgb)

   # Segmenta con un punto de click (coordenada en la imagen)
   input_point = np.array([[300, 200]])  # Punto en zona de cultivo
   input_label = np.array([1])          # 1 = foreground

   masks, scores, logits = predictor.predict(
       point_coords=input_point,
       point_labels=input_label,
       multimask_output=True  # devuelve 3 mascaras con diferente granularidad
   )

   # Muestra las 3 mascaras generadas por SAM
   fig, axes = plt.subplots(1, 4, figsize=(20, 5))
   axes[0].imshow(image_rgb)
   axes[0].plot(*input_point[0], 'r*', markersize=15)
   axes[0].set_title('Imagen + Click')
   for i, (mask, score) in enumerate(zip(masks, scores)):
       axes[i+1].imshow(image_rgb)
       axes[i+1].imshow(mask, alpha=0.5, cmap='Blues')
       axes[i+1].set_title(f'Mascara {i+1}\nScore: {score:.3f}')
   ```

5. Calcula metricas de segmentacion: Dado un ground truth manual (dibuja una mascara en Paint o usa OpenCV), calcula IoU (Jaccard Index) y Dice Coefficient para tu mejor mascara.

## Usa IA para...

- Pedirle a ChatGPT que compare U-Net, DeepLab y SAM: para cual aplicacion es mejor cada uno (medica, satelital, general)
- Preguntar que es la "binary cross-entropy + Dice loss" combinada y por que es popular en segmentacion medica
- Si SAM genera mascaras incorrectas con un solo punto, preguntar como mejorar con multiples puntos de prompt o bounding box prompts
- Pedir el codigo para calcular el area en hectareas de una parcela detectada, dado que cada pixel representa N metros cuadrados (segun la resolucion satelital)

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Cual es la diferencia entre segmentacion semantica, de instancias y panoptica
- Por que U-Net tiene una arquitectura "encoder-decoder" con skip connections y que problema resuelven las skip connections
- Que hace SAM diferente a los modelos anteriores (foundation model + prompting para vision)
- Como el IoU y el Dice Coefficient se diferencian matematicamente y cual es mas usado en imagenes medicas

## Reto Extra

Entrena tu propia U-Net para segmentar zonas urbanas vs rurales en imagenes satelitales del Ecuador. Descarga 50 imagenes de Sentinel-2 (gratis via Copernicus Open Access Hub) de la provincia de Pichincha. Crea las mascaras binarias manualmente anotando 10 imagenes con CVAT o Roboflow. Entrena 5 epocas y evalua con IoU. El objetivo no es accuracy perfecta sino demostrar el pipeline completo de entrenamiento de un modelo de segmentacion desde datos reales.
