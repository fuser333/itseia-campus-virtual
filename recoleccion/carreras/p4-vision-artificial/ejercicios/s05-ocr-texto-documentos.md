# Ejercicio Sesion 5: OCR — Extraer Texto de Imagenes y Documentos

**Materia:** Vision Artificial
**Nivel:** Avanzado
**Herramienta IA:** Copilot
**Duracion:** 50 min

## Objetivo

Implementar sistemas OCR (Optical Character Recognition) de alto rendimiento usando Tesseract, EasyOCR y PaddleOCR para extraer texto de documentos ecuatorianos (cedulas, facturas, contratos), comparar su precision en espanol y construir un pipeline de digitalizacion de documentos.

## Contexto (Ecuador)

El Registro Civil del Ecuador tiene millones de documentos fisicos sin digitalizar: actas de nacimiento, matrimonio y defuncion desde 1900. El SRI procesa 500,000 facturas fisicas mensuales. La digitalizacion automatica mediante OCR ahorra millones en trabajo manual y hace los datos accesibles para analytics. Vamos a construir ese pipeline.

## Instrucciones

1. Abre Google Colab. Instala las tres librerias de OCR:
   ```python
   !apt-get install -y tesseract-ocr tesseract-ocr-spa  # Tesseract con idioma espanol
   !pip install pytesseract easyocr paddlepaddle paddleocr pdf2image Pillow

   import pytesseract
   import easyocr
   from paddleocr import PaddleOCR
   import cv2
   import numpy as np
   from PIL import Image
   import matplotlib.pyplot as plt
   ```

2. Crea imagenes de prueba con texto ecuatoriano. Genera 3 imagenes sinteticas con PIL:
   ```python
   from PIL import Image, ImageDraw, ImageFont

   def crear_documento_sintetico(tipo):
       img = Image.new('RGB', (600, 400), color='white')
       draw = ImageDraw.Draw(img)

       if tipo == 'factura':
           texto = """FACTURA No. 001-001-000123456
   RUC: 1791234567001
   Razon Social: DISTRIBUIDORA EL PACIFICO S.A.
   Direccion: Av. 6 de Diciembre N45-120, Quito
   Fecha: 15/03/2025

   DETALLE:
   Cacao fino de aroma 50kg    $125.00
   Banano de exportacion 100kg  $45.00
   SUBTOTAL:                   $170.00
   IVA 15%:                     $25.50
   TOTAL:                      $195.50"""

       elif tipo == 'cedula':
           texto = """REPUBLICA DEL ECUADOR
   CEDULA DE CIUDADANIA
   Nombre: PILATASIG TOAPANTA
   Apellido: JUAN CARLOS
   Cedula: 1712345678
   Fecha Nac: 15/06/1985
   Lugar Nac: LATACUNGA"""

       draw.text((20, 20), texto, fill='black')
       img.save(f'{tipo}_prueba.png')
       return img

   factura = crear_documento_sintetico('factura')
   cedula  = crear_documento_sintetico('cedula')
   ```

3. Aplica los tres OCR a cada imagen y compara:

   **Tesseract:**
   ```python
   config_es = '--oem 3 --psm 6 -l spa'  # OEM3=LSTM, PSM6=bloque texto uniforme

   texto_tesseract = pytesseract.image_to_string(
       Image.open('factura_prueba.png'), config=config_es
   )
   # Obtener datos con posicion (bounding boxes)
   datos = pytesseract.image_to_data(Image.open('factura_prueba.png'),
                                      config=config_es,
                                      output_type=pytesseract.Output.DATAFRAME)
   datos_validos = datos[datos.conf > 50]  # Solo con confianza > 50%
   ```

   **EasyOCR:**
   ```python
   reader = easyocr.Reader(['es', 'en'], gpu=True)
   resultados_easy = reader.readtext('factura_prueba.png')
   for (bbox, texto, prob) in resultados_easy:
       print(f"Texto: {texto:<30} Confianza: {prob:.2f}")
   ```

   **PaddleOCR:**
   ```python
   ocr = PaddleOCR(use_angle_cls=True, lang='es', use_gpu=True)
   result = ocr.ocr('factura_prueba.png', cls=True)
   for linea in result[0]:
       bbox, (texto, conf) = linea
       print(f"Texto: {texto:<30} Confianza: {conf:.2f}")
   ```

4. Preprocesamiento para mejorar OCR en documentos reales con ruido:
   ```python
   def mejorar_para_ocr(ruta_imagen):
       img = cv2.imread(ruta_imagen)

       # 1. Escala de grises
       gris = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

       # 2. Correccion de sesgo (deskew)
       coords = np.column_stack(np.where(gris > 0))
       angulo = cv2.minAreaRect(coords)[-1]
       if angulo < -45: angulo = -(90 + angulo)
       else: angulo = -angulo
       (h, w) = gris.shape
       M = cv2.getRotationMatrix2D((w//2, h//2), angulo, 1.0)
       corregida = cv2.warpAffine(gris, M, (w, h))

       # 3. Umbral adaptativo
       binarizada = cv2.adaptiveThreshold(
           corregida, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
           cv2.THRESH_BINARY, 11, 2
       )

       # 4. Eliminacion de ruido
       limpia = cv2.medianBlur(binarizada, 3)

       return limpia
   ```

5. Pipeline completo para extraer datos estructurados de una factura:
   ```python
   import re

   def extraer_datos_factura(texto_ocr):
       datos = {}
       # Extrae RUC con regex
       ruc = re.search(r'RUC[:\s]+(\d{13})', texto_ocr)
       if ruc: datos['ruc'] = ruc.group(1)

       # Extrae total
       total = re.search(r'TOTAL[:\s]+\$?([\d,\.]+)', texto_ocr, re.IGNORECASE)
       if total: datos['total'] = float(total.group(1).replace(',',''))

       # Extrae fecha
       fecha = re.search(r'(\d{2}/\d{2}/\d{4})', texto_ocr)
       if fecha: datos['fecha'] = fecha.group(1)

       return datos

   texto_extraido = pytesseract.image_to_string(factura, config=config_es)
   print(extraer_datos_factura(texto_extraido))
   ```

6. Evalua Character Error Rate (CER) y Word Error Rate (WER) para cada motor OCR:
   ```python
   !pip install jiwer
   from jiwer import wer, cer

   texto_real = "FACTURA No. 001-001-000123456\nRUC: 1791234567001..."

   for motor, texto in [("Tesseract", texto_tesseract),
                         ("EasyOCR", texto_easyocr),
                         ("PaddleOCR", texto_paddle)]:
       print(f"{motor}: WER={wer(texto_real, texto):.2%}  CER={cer(texto_real, texto):.2%}")
   ```

## Usa IA para...

- Pedirle a Copilot que genere el codigo completo para procesar un PDF de multiples paginas y extraer todos los numeros de factura en una lista
- Preguntar como mejorar el OCR para manuscritos (letras de mano) vs texto impreso: son problemas completamente distintos
- Si el OCR falla en texto con fuentes decorativas (facturas de restaurantes), preguntar si fine-tuning de Tesseract es la solucion correcta o si CLIP/LLM con vision es mejor opcion
- Pedir el codigo para anonimizar automaticamente los datos personales detectados (nombres, cedulas) en el texto extraido

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Cual es la diferencia entre OCR tradicional (Tesseract) y OCR con deep learning (EasyOCR, PaddleOCR)
- Por que el preprocesamiento (deskew, binarizacion) es critico para la calidad del OCR
- Que significa PSM (Page Segmentation Mode) en Tesseract y cuando cambiar el modo por defecto
- Como combinar OCR con regex para extraer informacion estructurada de documentos semiestructurados

## Reto Extra

Construye un sistema de digitalizacion de recetas medicas del IESS. Las recetas tienen: nombre del medico, cedula del paciente, medicamento, dosis y fecha. Usa EasyOCR para extraer el texto y luego un LLM (Gemini) para estructurar la informacion en JSON aunque el OCR cometa errores:
```python
prompt = f"""Del siguiente texto OCR (puede tener errores), extrae en JSON:
{{'medico': ..., 'cedula_paciente': ..., 'medicamento': ..., 'dosis': ..., 'fecha': ...}}

Texto OCR: {texto_ocr}
JSON:"""
```
Prueba con 5 recetas fotografiadas con celular (iluminacion variable). El sistema debe ser robusto a OCR imperfecto usando el LLM como "corrector inteligente".
