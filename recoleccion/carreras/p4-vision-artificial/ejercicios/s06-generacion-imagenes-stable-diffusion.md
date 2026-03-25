# Ejercicio Sesion 6: Generacion de Imagenes con Stable Diffusion

**Materia:** Vision Artificial
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 55 min

## Objetivo

Implementar generacion de imagenes con Stable Diffusion usando HuggingFace Diffusers, dominando la ingenieria de prompts (text-to-image), la tecnica img2img (imagen a imagen), inpainting (rellenado de regiones) y ControlNet (control de estructura), aplicados a casos de uso de marketing y creatividad para empresas ecuatorianas.

## Contexto (Ecuador)

La agencia de publicidad Norlop JWT (la mas grande de Ecuador, con clientes como Nestlé, Pronaca, Claro) necesita generar multiples variantes visuales de sus campanas en horas, no en semanas. Un diseñador potenciado con Stable Diffusion puede generar 50 conceptos visuales por hora. Vamos a dominar esta herramienta y entender su tecnologia subyacente.

## Instrucciones

1. Abre Google Colab con GPU T4 o A100 (recomendado). Instala:
   ```python
   !pip install diffusers transformers accelerate xformers
   import torch
   from diffusers import (StableDiffusionPipeline,
                           StableDiffusionImg2ImgPipeline,
                           StableDiffusionInpaintPipeline,
                           StableDiffusionControlNetPipeline,
                           ControlNetModel)
   from PIL import Image
   import numpy as np
   import matplotlib.pyplot as plt

   print(f"GPU: {torch.cuda.get_device_name(0)}")
   print(f"VRAM: {torch.cuda.get_device_properties(0).total_memory/1e9:.1f} GB")
   ```

2. NIVEL 1 — Text-to-Image basico:
   ```python
   pipe = StableDiffusionPipeline.from_pretrained(
       "runwayml/stable-diffusion-v1-5",
       torch_dtype=torch.float16,
       safety_checker=None
   ).to("cuda")
   pipe.enable_xformers_memory_efficient_attention()

   # Genera imagenes con contexto ecuatoriano
   prompts_ecuador = [
       "professional product photo of Ecuadorian cacao beans, golden hour lighting, luxury packaging, photorealistic, 8k",
       "Quito historical center at sunset, colorful houses, Pichincha volcano in background, cinematic photography, vibrant colors",
       "Ecuadorian woman entrepreneur in tech office, natural lighting, professional headshot, diverse, confident",
       "Galapagos giant tortoise close-up, National Geographic style, shallow depth of field, ultra detailed",
   ]

   negative_prompt = "blurry, low quality, distorted, watermark, text, ugly, deformed"

   for prompt in prompts_ecuador:
       imagen = pipe(
           prompt=prompt,
           negative_prompt=negative_prompt,
           num_inference_steps=30,
           guidance_scale=7.5,
           height=512, width=512,
           generator=torch.Generator("cuda").manual_seed(42)
       ).images[0]
       imagen.save(f"gen_{prompts_ecuador.index(prompt)}.png")
   ```

3. NIVEL 2 — Exploracion de parametros:
   ```python
   # Compara guidance_scale (adherencia al prompt vs creatividad)
   fig, axes = plt.subplots(1, 5, figsize=(20, 5))
   prompt_base = "Ecuadorian cacao plantation, aerial view, lush green, sunrise"

   for i, guidance in enumerate([1, 3, 7, 12, 20]):
       img = pipe(prompt_base, guidance_scale=guidance,
                  num_inference_steps=25,
                  generator=torch.Generator("cuda").manual_seed(42)).images[0]
       axes[i].imshow(img)
       axes[i].set_title(f'CFG={guidance}')
       axes[i].axis('off')
   ```

4. NIVEL 3 — Image-to-Image (variaciones de una imagen existente):
   ```python
   pipe_img2img = StableDiffusionImg2ImgPipeline.from_pretrained(
       "runwayml/stable-diffusion-v1-5",
       torch_dtype=torch.float16
   ).to("cuda")

   # Toma una foto de producto y genera variantes
   imagen_base = Image.open('producto_ecuador.jpg').resize((512, 512))

   variante = pipe_img2img(
       prompt="professional product photography, studio lighting, white background, commercial quality",
       image=imagen_base,
       strength=0.6,    # 0=sin cambios, 1=imagen completamente nueva
       guidance_scale=8,
       num_inference_steps=30
   ).images[0]

   # Muestra original vs variante
   fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
   ax1.imshow(imagen_base); ax1.set_title('Original')
   ax2.imshow(variante);    ax2.set_title('Variante AI')
   ```

5. NIVEL 4 — Inpainting (edicion de regiones especificas):
   ```python
   pipe_inpaint = StableDiffusionInpaintPipeline.from_pretrained(
       "runwayml/stable-diffusion-inpainting",
       torch_dtype=torch.float16
   ).to("cuda")

   # Imagen original + mascara de la region a editar
   imagen_original = Image.open('quito_plaza.jpg').resize((512, 512))
   # Crea mascara blanca en la region del cielo
   mascara = Image.new('L', (512, 512), 0)
   from PIL import ImageDraw
   d = ImageDraw.Draw(mascara)
   d.rectangle([0, 0, 512, 150], fill=255)  # Primeros 150px = cielo

   resultado = pipe_inpaint(
       prompt="dramatic storm clouds over Andes mountains, cinematic sky, Ecuador",
       image=imagen_original,
       mask_image=mascara,
       num_inference_steps=30,
       guidance_scale=8
   ).images[0]
   ```

6. Analisis tecnico: Explica en tu notebook el funcionamiento del proceso de difusion:
   - Que es el "noise schedule" y como se agrega/elimina ruido progresivamente
   - Que hace el texto embedding (CLIP) y como guia la generacion
   - Por que aumentar `num_inference_steps` mejora la calidad pero aumenta el tiempo

## Usa IA para...

- Pedirle a Claude que explique la arquitectura U-Net del denoiser de Stable Diffusion y su relacion con las U-Nets de segmentacion
- Preguntar el concepto de "classifier-free guidance" (CFG) matematicamente: como el guidance_scale amplifica la diferencia entre condicionado e incondicionado
- Si la GPU se queda sin VRAM, preguntar como activar `attention_slicing`, `vae_slicing` y `sequential_cpu_offload` para reducir uso de memoria
- Generar 10 prompts en ingles para campana publicitaria de ITSEIA: estudiantes jovenes usando IA, ambiente moderno de aula, contexto ecuatoriano

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que es el proceso de "forward diffusion" (agregar ruido) y "reverse diffusion" (eliminar ruido)
- Por que los modelos de difusion generan imagenes de mayor calidad que las GANs a pesar de ser mas lentos
- Que es CFG (Classifier-Free Guidance) y como el guidance_scale controla creatividad vs fidelidad al prompt
- Como el parametro `strength` en img2img controla el nivel de modificacion de la imagen original

## Reto Extra

Implementa ControlNet para generacion controlada por estructura. Usa el controlnet de bordes (Canny) para generar multiples variantes visuales de un edificio ecuatoriano manteniendo exactamente la misma arquitectura/estructura:
```python
from controlnet_aux import CannyDetector
controlnet = ControlNetModel.from_pretrained(
    "lllyasviel/sd-controlnet-canny", torch_dtype=torch.float16
)
```
Genera 4 variantes del mismo edificio de Quito con diferentes estilos: fotorealista, acuarela, arquitectura futurista, al atardecer. Todas deben mantener la misma forma y disposicion de ventanas/puertas. Este ejercicio demuestra el uso profesional de ControlNet para arquitectura y diseño.
