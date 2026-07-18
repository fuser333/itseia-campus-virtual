# Ejercicio Sesion 7: Multimodal — Vision + Texto + Audio

**Materia:** IA Generativa y LLMs
**Nivel:** Avanzado
**Herramienta IA:** GPT-4o Vision + Whisper + DALL-E 3
**Duracion:** 55 min

## Objetivo

Implementar un pipeline multimodal completo que procesa imagenes, transcribe audio y genera contenido visual usando las APIs de OpenAI. Construir una aplicacion practica que combina los tres modales para un caso de uso real de empresa ecuatoriana.

## Contexto (Ecuador)

Una cadena de restaurantes en Guayaquil quiere automatizar la verificacion de calidad de sus platos: toman una foto del plato, la IA lo compara con el estandar, genera un reporte. Un periodista de El Universo quiere transcribir entrevistas automaticamente y generar un resumen. Una agencia de publicidad en Quito necesita generar variaciones de imagenes de sus campanas. Estos son casos reales donde la IA multimodal genera ROI inmediato.

## Instrucciones

### Parte 1 — Vision: analizar imagenes con GPT-4o (20 min)

```python
import os
import base64
import httpx
from openai import OpenAI
from pathlib import Path

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analizar_imagen_url(url_imagen: str, pregunta: str) -> dict:
    """Analiza una imagen desde URL publica."""
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": url_imagen, "detail": "high"}
                    },
                    {
                        "type": "text",
                        "text": pregunta
                    }
                ]
            }
        ],
        max_tokens=800
    )
    return {
        "analisis": response.choices[0].message.content,
        "tokens": response.usage.total_tokens
    }

def analizar_imagen_local(ruta_imagen: str, pregunta: str) -> dict:
    """Analiza una imagen local convirtiendola a base64."""
    with open(ruta_imagen, "rb") as f:
        imagen_bytes = f.read()

    # Detectar formato
    extension = Path(ruta_imagen).suffix.lower()
    mime_types = {".jpg": "image/jpeg", ".jpeg": "image/jpeg",
                  ".png": "image/png", ".webp": "image/webp"}
    mime_type = mime_types.get(extension, "image/jpeg")

    imagen_b64 = base64.b64encode(imagen_bytes).decode("utf-8")

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime_type};base64,{imagen_b64}",
                            "detail": "high"
                        }
                    },
                    {"type": "text", "text": pregunta}
                ]
            }
        ],
        max_tokens=800
    )
    return {
        "analisis": response.choices[0].message.content,
        "tokens": response.usage.total_tokens
    }

# CASO 1: Analisis de producto para e-commerce ecuatoriano
# Descarga cualquier imagen de producto de un supermercado ecuatoriano
imagen_producto = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Bitten_pizza.jpg/1200px-Bitten_pizza.jpg"

analisis_producto = analizar_imagen_url(
    imagen_producto,
    """Actua como experto en e-commerce ecuatoriano. Analiza esta imagen de producto y genera:
    1. Titulo optimizado para listing (maximo 80 caracteres)
    2. Descripcion de 3 lineas orientada a comprador ecuatoriano
    3. 5 palabras clave para SEO en Mercado Libre Ecuador
    4. Sugerencia de precio referencial en dolares para el mercado ecuatoriano
    5. Categoria sugerida en Mercado Libre"""
)
print("CASO 1 — Analisis de producto e-commerce:")
print(analisis_producto["analisis"])
print(f"Tokens usados: {analisis_producto['tokens']}\n")

# CASO 2: Lector de facturas ecuatorianas
# Para usar con una factura real, cambia por analizar_imagen_local("mi_factura.jpg", ...)
factura_simulada = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg"

analisis_factura = analizar_imagen_url(
    factura_simulada,
    """Eres un sistema de extraccion de datos de documentos fiscales ecuatorianos.
    Extrae toda la informacion disponible y devuelvela en este JSON exacto:
    {
      "ruc_emisor": "",
      "nombre_emisor": "",
      "numero_factura": "",
      "fecha": "",
      "subtotal": 0,
      "iva_12": 0,
      "total": 0,
      "productos": [{"descripcion": "", "cantidad": 0, "precio_unitario": 0}]
    }
    Si no es una factura, indica: {"error": "No es un documento fiscal"}"""
)
print("CASO 2 — Extraccion de datos de factura:")
print(analisis_factura["analisis"])
```

Prueba con una foto real de una factura o ticket de compra ecuatoriano (del Super, farmacia, etc.).

### Parte 2 — Whisper: transcripcion de audio (15 min)

```python
import io
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def transcribir_audio(ruta_audio: str, idioma: str = "es") -> dict:
    """
    Transcribe audio usando Whisper API de OpenAI.
    Soporta: mp3, mp4, mpeg, mpga, m4a, wav, webm
    Costo: $0.006 por minuto de audio
    """
    with open(ruta_audio, "rb") as archivo_audio:
        transcripcion = client.audio.transcriptions.create(
            model="whisper-1",
            file=archivo_audio,
            language=idioma,
            response_format="verbose_json",  # Incluye timestamps
            timestamp_granularities=["word"]  # Timestamp por palabra
        )

    return {
        "texto": transcripcion.text,
        "duracion_segundos": transcripcion.duration,
        "idioma_detectado": transcripcion.language,
        "palabras_con_tiempo": [
            {"palabra": w.word, "inicio": w.start, "fin": w.end}
            for w in (transcripcion.words or [])
        ]
    }

def transcribir_y_analizar(ruta_audio: str) -> dict:
    """
    Pipeline completo: transcribir + analizar con GPT-4o.
    Caso de uso: entrevista de negocios o reunion de trabajo.
    """
    # Paso 1: Transcribir
    print("Transcribiendo audio...")
    transcripcion = transcribir_audio(ruta_audio)

    # Paso 2: Analizar con GPT
    print("Analizando contenido...")
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Eres un asistente de negocios para empresas ecuatorianas. Analizas reuniones y entrevistas."
            },
            {
                "role": "user",
                "content": f"""Analiza esta transcripcion de una reunion de negocios:

<transcripcion>
{transcripcion['texto']}
</transcripcion>

Genera:
1. RESUMEN EJECUTIVO (3 oraciones)
2. PUNTOS CLAVE (bullets)
3. DECISIONES TOMADAS
4. PROXIMOS PASOS con responsable y fecha si se mencionaron
5. TONO DE LA REUNION (formal/informal, tension/entusiasmo)"""
            }
        ],
        max_tokens=600
    )

    return {
        "transcripcion": transcripcion["texto"],
        "duracion_min": round(transcripcion["duracion_segundos"] / 60, 2),
        "analisis": response.choices[0].message.content,
        "costo_whisper": round(transcripcion["duracion_segundos"] / 60 * 0.006, 4)
    }

# Para probar, graba 30 segundos hablando sobre un proyecto de negocio
# y guarda como audio.mp3
# resultado = transcribir_y_analizar("audio.mp3")
# print(resultado["analisis"])

# Alternativa: descargar audio de muestra
print("Para probar: graba 30 segundos describiendo tu proyecto final de ITSEIA.")
print("Guarda como 'audio.mp3' y descomenta las lineas de arriba.")
```

### Parte 3 — DALL-E 3: generacion de imagenes (10 min)

```python
def generar_imagen_marketing(
    descripcion_producto: str,
    estilo: str = "fotografico profesional",
    tamano: str = "1024x1024"
) -> dict:
    """
    Genera imagen de marketing con DALL-E 3.
    Costo: $0.04 por imagen 1024x1024 con calidad standard
    """
    prompt_optimizado = (
        f"{descripcion_producto}. "
        f"Estilo: {estilo}. "
        f"Contexto visual: Ecuador, Latinoamerica, profesional. "
        f"Alta calidad, iluminacion perfecta, sin texto superpuesto."
    )

    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt_optimizado,
        size=tamano,
        quality="standard",
        n=1,
        style="vivid"
    )

    return {
        "url_imagen": response.data[0].url,
        "prompt_revisado": response.data[0].revised_prompt,
        "costo_usd": 0.04
    }

# Caso de uso: campana publicitaria para empresa ecuatoriana
casos = [
    "Panaderia artesanal en el centro historico de Quito, pan recien horneado, ambiente acogedor, luz de mañana",
    "Aplicacion movil de pagos digitales para el mercado ecuatoriano, telefono con interfaz moderna, colores verde y amarillo",
    "Agricultores ecuatorianos usando tablets para monitorear cultivos de banano con IA, Valle del Chota, amanecer"
]

for descripcion in casos[:1]:  # Prueba con uno primero (cuesta $0.04 por imagen)
    resultado = generar_imagen_marketing(descripcion)
    print(f"Descripcion: {descripcion[:60]}...")
    print(f"URL: {resultado['url_imagen']}")
    print(f"Prompt revisado por DALL-E: {resultado['prompt_revisado'][:100]}...")
    print(f"Costo: ${resultado['costo_usd']}\n")
```

### Parte 4 — Pipeline completo multimodal (10 min)

Diseña en pseudocodigo un pipeline para este caso real:

**Caso: Sistema de verificacion de calidad para restaurante Crispy Chips (Quito)**

```
[CAMARA] → foto del plato
    ↓
[GPT-4o VISION] → analiza: temperatura aparente, cantidad, presentacion, cumple estandar?
    ↓
[REGLA DE NEGOCIO] → si no cumple estandar
    ↓ si falla
[WHISPER] → graba nota de voz del cocinero explicando el problema
    ↓
[GPT-4o TEXTO] → genera ticket de incidencia con: plato, problema, hora, cocinero
    ↓
[DALL-E 3] → genera imagen del "plato ideal" para referencia del cocinero
    ↓
[DASHBOARD] → registra incidencia para QA supervisor
```

Implementa al menos las partes de Vision y generacion del ticket de incidencia.

## Usa IA para...

- Pedirle a ChatGPT que liste los casos de uso industriales mas importantes para vision por computadora en Ecuador (agro, manufactura, retail).
- Preguntarle sobre los limites actuales de DALL-E 3 y Midjourney para generacion de rostros de personas especificas.
- Pedirle que compare Whisper vs Google Speech-to-Text vs AWS Transcribe en precio y precision para español ecuatoriano.

## Que aprendiste

- Como enviar imagenes a GPT-4o tanto por URL como por base64.
- Que Whisper reconoce español ecuatoriano con alta precision y cuesta $0.006/minuto.
- Como DALL-E 3 reescribe automaticamente los prompts para mejorar la imagen (revised_prompt).
- Que un pipeline multimodal combina modelos especializados en secuencia, cada uno haciendo lo que hace mejor.

## Reto extra

Construye una aplicacion Streamlit (una sola pagina) que permita: (1) subir una imagen de un producto, (2) que GPT-4o Vision genere una descripcion de listing de e-commerce optimizada para Mercado Libre Ecuador, (3) que DALL-E 3 genere una version mejorada de la imagen con fondo blanco y mejor iluminacion, (4) que el usuario pueda descargar ambos outputs. Deployla en Streamlit Community Cloud (gratis).
