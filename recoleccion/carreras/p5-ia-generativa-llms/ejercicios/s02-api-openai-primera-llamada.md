# Ejercicio Sesion 2: API de OpenAI — Tu Primera Llamada Programatica

**Materia:** IA Generativa y LLMs
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT / OpenAI API
**Duracion:** 55 min

## Objetivo

Realizar llamadas reales a la API de OpenAI desde Python, comprender el modelo de precios por tokens, manejar errores de API, y construir una funcion reutilizable que cualquier aplicacion puede consumir.

## Contexto (Ecuador)

La mayoria de desarrolladores ecuatorianos que conocen IA la usan solo desde la interfaz web de ChatGPT. Saber consumir la API programaticamente es lo que separa a un usuario de un constructor. Este ejercicio te convierte en constructor: podras integrar GPT en cualquier sistema — desde una app de atencion al cliente para una empresa en Cuenca hasta un bot de analisis tributario para el SRI.

## Instrucciones

### Parte 1 — Configuracion del entorno (10 min)

1. Crea un entorno virtual Python:
```bash
python -m venv venv_openai
source venv_openai/bin/activate  # Linux/Mac
# venv_openai\Scripts\activate   # Windows
pip install openai python-dotenv tiktoken
```

2. Crea un archivo `.env` en la raiz de tu proyecto:
```
OPENAI_API_KEY=sk-proj-TU_CLAVE_AQUI
```

3. Crea `config.py`:
```python
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY no encontrada en .env")
```

4. Agrega `.env` a tu `.gitignore`. NUNCA subas claves a GitHub.

### Parte 2 — Primera llamada real (15 min)

Crea `primera_llamada.py`:

```python
from openai import OpenAI
from config import OPENAI_API_KEY
import time

client = OpenAI(api_key=OPENAI_API_KEY)

def analizar_empresa_ecuatoriana(nombre_empresa: str, sector: str) -> dict:
    """
    Genera un analisis rapido de una empresa ecuatoriana usando GPT-4o-mini.
    Retorna dict con el analisis y metadata de tokens usados.
    """
    inicio = time.time()

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Eres un analista de negocios especializado en el mercado ecuatoriano. "
                    "Tus respuestas son concisas, especificas y basadas en el contexto "
                    "de la economia, regulaciones y cultura empresarial de Ecuador. "
                    "Siempre menciona datos o tendencias locales relevantes."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Analiza brevemente las oportunidades y riesgos de usar IA "
                    f"para la empresa '{nombre_empresa}' del sector '{sector}' en Ecuador. "
                    f"Maximo 150 palabras. Sé especifico."
                )
            }
        ],
        max_tokens=300,
        temperature=0.7,
    )

    duracion = time.time() - inicio

    return {
        "empresa": nombre_empresa,
        "sector": sector,
        "analisis": response.choices[0].message.content,
        "tokens_input": response.usage.prompt_tokens,
        "tokens_output": response.usage.completion_tokens,
        "tokens_total": response.usage.total_tokens,
        "modelo": response.model,
        "duracion_segundos": round(duracion, 2),
        "costo_estimado_usd": round(
            (response.usage.prompt_tokens * 0.00015 +
             response.usage.completion_tokens * 0.0006) / 1000, 6
        )
    }


# Prueba con empresas reales del Ecuador
empresas = [
    ("Supermaxi", "retail y supermercados"),
    ("Banco Pichincha", "banca y finanzas"),
    ("CNT", "telecomunicaciones"),
]

for empresa, sector in empresas:
    resultado = analizar_empresa_ecuatoriana(empresa, sector)
    print(f"\n{'='*60}")
    print(f"Empresa: {resultado['empresa']} | Sector: {resultado['sector']}")
    print(f"Modelo: {resultado['modelo']} | Duracion: {resultado['duracion_segundos']}s")
    print(f"Tokens: {resultado['tokens_total']} | Costo: ${resultado['costo_estimado_usd']}")
    print(f"\nAnalisis:\n{resultado['analisis']}")
```

Ejecuta el script y verifica que las 3 respuestas tienen coherencia con el contexto ecuatoriano.

### Parte 3 — Manejo robusto de errores (20 min)

En produccion, las APIs fallan. Crea `cliente_robusto.py`:

```python
from openai import OpenAI, RateLimitError, APITimeoutError, APIConnectionError
from openai import BadRequestError, AuthenticationError
import time
import logging
from config import OPENAI_API_KEY

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

client = OpenAI(api_key=OPENAI_API_KEY)

def llamada_con_retry(
    messages: list,
    model: str = "gpt-4o-mini",
    max_tokens: int = 500,
    max_intentos: int = 3,
    backoff_base: float = 2.0
) -> str | None:
    """
    Llama a la API de OpenAI con reintentos exponenciales.
    Retorna el texto de respuesta o None si falla despues de todos los intentos.
    """
    for intento in range(1, max_intentos + 1):
        try:
            logger.info(f"Intento {intento}/{max_intentos} - Modelo: {model}")

            response = client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=max_tokens,
                timeout=30.0
            )
            logger.info(f"Exito - {response.usage.total_tokens} tokens usados")
            return response.choices[0].message.content

        except RateLimitError as e:
            espera = backoff_base ** intento
            logger.warning(f"Rate limit alcanzado. Esperando {espera}s...")
            time.sleep(espera)

        except APITimeoutError:
            logger.error(f"Timeout en intento {intento}. Reintentando...")
            time.sleep(1.0)

        except APIConnectionError as e:
            logger.error(f"Error de conexion: {e}. Verificar internet.")
            time.sleep(2.0)

        except AuthenticationError:
            logger.critical("API key invalida. Verificar .env")
            return None  # No reintentar

        except BadRequestError as e:
            logger.error(f"Request invalida: {e}")
            return None  # No reintentar

    logger.error(f"Fallo despues de {max_intentos} intentos")
    return None


# Prueba el cliente robusto
messages = [
    {"role": "system", "content": "Eres un experto en legislacion ecuatoriana."},
    {"role": "user", "content": "Que leyes regulan el uso de IA en Ecuador actualmente?"}
]

respuesta = llamada_con_retry(messages, max_tokens=400)
if respuesta:
    print("\nRespuesta obtenida:")
    print(respuesta)
else:
    print("La llamada fallo despues de todos los reintentos.")
```

### Parte 4 — Calculo de costos (10 min)

Usa la libreria `tiktoken` para contar tokens ANTES de hacer la llamada (y estimar el costo):

```python
import tiktoken

def contar_tokens(texto: str, modelo: str = "gpt-4o-mini") -> int:
    """Cuenta tokens sin hacer una llamada a la API."""
    encoding = tiktoken.encoding_for_model(modelo)
    return len(encoding.encode(texto))

# Practica: estima el costo de procesar 1000 contratos de 2 paginas c/u
texto_contrato_ejemplo = """
CONTRATO DE SERVICIOS PROFESIONALES
Entre la empresa XYZ S.A. domiciliada en Quito, Ecuador...
[simula 500 palabras de contrato ecuatoriano aqui]
""" * 50  # Aprox 2 paginas

tokens = contar_tokens(texto_contrato_ejemplo)
costo_input = (tokens * 0.00015) / 1000
print(f"Tokens por contrato: {tokens}")
print(f"Costo por contrato (input): ${costo_input:.4f}")
print(f"Costo por 1000 contratos: ${costo_input * 1000:.2f}")
print(f"Costo por 1000 contratos GPT-4o (mas caro): ${costo_input * 1000 * 33:.2f}")
```

## Usa IA para...

- Pedirle a ChatGPT que te explique la diferencia entre `temperature=0` y `temperature=1` con ejemplos concretos de cuando usar cada uno.
- Preguntarle como funciona el parametro `top_p` y como interactua con `temperature`.
- Pedirle que genere 5 casos de uso reales para empresas ecuatorianas donde `gpt-4o-mini` seria suficiente vs cuando necesitarias `gpt-4o`.

## Que aprendiste

- Como autenticar y llamar a la API de OpenAI desde Python de forma segura.
- Que es un token y como calcularlo antes de hacer la llamada (para presupuestar).
- Como implementar reintentos exponenciales para APIs en produccion.
- La diferencia de costo entre gpt-4o-mini (~$0.15/1M tokens input) y gpt-4o (~$5/1M tokens input).
- Por que NUNCA se debe hardcodear una API key en el codigo fuente.

## Reto extra

Construye un `analizador_batch.py` que lea un archivo CSV con 20 nombres de empresas ecuatorianas (con su sector) y genere un reporte de analisis para cada una usando llamadas en paralelo con `asyncio` y `openai` en modo asincrono. Mide el tiempo total vs llamadas secuenciales y calcula el ahorro de tiempo.
