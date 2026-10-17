# Ejercicio Sesion 3: API de Anthropic (Claude) — Comparacion con OpenAI

**Materia:** IA Generativa y LLMs
**Nivel:** Avanzado
**Herramienta IA:** Claude (Anthropic API)
**Duracion:** 55 min

## Objetivo

Integrar la API de Anthropic en Python, entender las diferencias arquitectonicas y de interfaz con OpenAI, aprovechar las capacidades unicas de Claude (documentos largos, Constitutional AI, vision), y construir un criterio tecnico para elegir entre ambas APIs segun el caso de uso.

## Contexto (Ecuador)

Claude tiene una ventana de contexto de 200,000 tokens — suficiente para procesar documentos completos como el Codigo de Trabajo ecuatoriano (250+ paginas) o el presupuesto general del Estado en una sola llamada. Para empresas legales, contadoras o instituciones publicas en Ecuador, esto cambia completamente lo que es posible hacer con IA. Este ejercicio muestra esa capacidad con casos reales.

## Instrucciones

### Parte 1 — Configuracion (5 min)

```bash
pip install anthropic python-dotenv
```

Agrega al `.env`:
```
ANTHROPIC_API_KEY=sk-ant-TU_CLAVE_AQUI
```

### Parte 2 — Anatomia de la API Anthropic vs OpenAI (20 min)

Analiza las diferencias clave entre ambas APIs:

**OpenAI — estructura del mensaje:**
```python
from openai import OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "Eres un experto legal ecuatoriano."},
        {"role": "user", "content": "Que dice el Art. 185 del Codigo de Trabajo?"}
    ],
    max_tokens=500
)
texto = response.choices[0].message.content
tokens_usados = response.usage.total_tokens
```

**Anthropic — estructura del mensaje:**
```python
import anthropic
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=500,
    system="Eres un experto legal ecuatoriano.",  # <-- system es parametro separado
    messages=[
        # NO hay "system" dentro de messages
        {"role": "user", "content": "Que dice el Art. 185 del Codigo de Trabajo?"}
    ]
)
texto = response.content[0].text   # <-- diferente estructura de respuesta
tokens_usados = response.usage.input_tokens + response.usage.output_tokens
```

Crea una tabla comparativa de las diferencias:

| Aspecto | OpenAI | Anthropic |
|---|---|---|
| System prompt | Dentro de `messages` | Parametro separado `system` |
| Respuesta texto | `response.choices[0].message.content` | `response.content[0].text` |
| Tokens input | `response.usage.prompt_tokens` | `response.usage.input_tokens` |
| Tokens output | `response.usage.completion_tokens` | `response.usage.output_tokens` |
| Streaming | `stream=True` en create | `with client.messages.stream()` |
| Vision | `{"type": "image_url", "image_url": ...}` | `{"type": "image", "source": ...}` |

### Parte 3 — Capacidad de documentos largos (20 min)

Esta es la ventaja mas practica de Claude. Implementa un analizador de documentos legales ecuatorianos:

```python
import anthropic
import os
from pathlib import Path

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Simulacion de un documento legal ecuatoriano largo
DOCUMENTO_LEGAL_SIMULADO = """
CODIGO ORGANICO DEL TRABAJO - REPUBLICA DEL ECUADOR
(Extracto simulado para ejercicio)

TITULO I - DEL CONTRATO INDIVIDUAL DE TRABAJO
Art. 8.- Concepto de trabajo.- El trabajo es un derecho y un deber social...
Art. 9.- Concepto de trabajador.- La persona que se obliga a la prestacion
del servicio o a la ejecucion de la obra se denomina trabajador...

[Imagina aqui 50 paginas de texto legal]

TITULO VI - DE LA REMUNERACION
Art. 80.- Salario y sueldo.- Salario es el estipendio que paga el empleador
al obrero en virtud del contrato de trabajo...
Art. 81.- Estipulacion de sueldos y salarios.- Los sueldos y salarios se
estipularan libremente, pero en ningun caso podran ser inferiores a los
minimos legales...

TITULO XI - DE LA TERMINACION DEL CONTRATO
Art. 169.- Causas para la terminacion del contrato.- El contrato de trabajo
termina por las siguientes causas...
""" * 10  # Repetimos para simular longitud

def analizar_documento_legal(documento: str, preguntas: list[str]) -> dict:
    """
    Analiza un documento legal largo con multiples preguntas en una sola llamada.
    Demuestra la ventaja del context window de 200K tokens de Claude.
    """
    preguntas_formateadas = "\n".join(
        f"{i+1}. {p}" for i, p in enumerate(preguntas)
    )

    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1500,
        system=(
            "Eres un abogado laboralista especializado en derecho ecuatoriano. "
            "Analizas documentos legales con precision y das respuestas claras "
            "con referencias a articulos especificos cuando es posible."
        ),
        messages=[
            {
                "role": "user",
                "content": (
                    f"Analiza el siguiente documento legal:\n\n"
                    f"<documento>\n{documento}\n</documento>\n\n"
                    f"Responde estas preguntas de forma concisa:\n{preguntas_formateadas}"
                )
            }
        ]
    )

    return {
        "respuesta": response.content[0].text,
        "tokens_input": response.usage.input_tokens,
        "tokens_output": response.usage.output_tokens,
        "costo_usd": round(
            (response.usage.input_tokens * 0.003 +
             response.usage.output_tokens * 0.015) / 1000, 4
        )
    }

preguntas = [
    "Cual es la definicion legal de 'trabajador' segun este documento?",
    "Como se determina el salario minimo segun el codigo?",
    "Cuales son las causas de terminacion de contrato mencionadas?"
]

resultado = analizar_documento_legal(DOCUMENTO_LEGAL_SIMULADO, preguntas)
print(f"Tokens usados: {resultado['tokens_input']} input + {resultado['tokens_output']} output")
print(f"Costo estimado: ${resultado['costo_usd']}")
print(f"\nRespuesta:\n{resultado['respuesta']}")
```

### Parte 4 — Wrapper unificado (10 min)

Crea una capa de abstraccion que permite cambiar entre OpenAI y Anthropic con un solo parametro:

```python
from dataclasses import dataclass
from enum import Enum

class Proveedor(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"

@dataclass
class RespuestaLLM:
    texto: str
    tokens_input: int
    tokens_output: int
    modelo: str
    proveedor: str

def llamar_llm(
    mensaje_usuario: str,
    system_prompt: str = "Eres un asistente util.",
    proveedor: Proveedor = Proveedor.ANTHROPIC,
    max_tokens: int = 500
) -> RespuestaLLM:
    """
    Interfaz unificada para llamar a OpenAI o Anthropic.
    Cambia de proveedor sin modificar el codigo que llama a esta funcion.
    """
    if proveedor == Proveedor.ANTHROPIC:
        import anthropic
        c = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        r = c.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": mensaje_usuario}]
        )
        return RespuestaLLM(
            texto=r.content[0].text,
            tokens_input=r.usage.input_tokens,
            tokens_output=r.usage.output_tokens,
            modelo=r.model,
            proveedor="anthropic"
        )
    else:
        from openai import OpenAI
        c = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        r = c.chat.completions.create(
            model="gpt-4o-mini",
            max_tokens=max_tokens,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": mensaje_usuario}
            ]
        )
        return RespuestaLLM(
            texto=r.choices[0].message.content,
            tokens_input=r.usage.prompt_tokens,
            tokens_output=r.usage.completion_tokens,
            modelo=r.model,
            proveedor="openai"
        )

# Prueba con la misma consulta en ambos proveedores
consulta = "Explica en 100 palabras como la IA puede reducir el desempleo en Ecuador."
for prov in [Proveedor.ANTHROPIC, Proveedor.OPENAI]:
    resp = llamar_llm(consulta, proveedor=prov)
    print(f"\n--- {resp.proveedor.upper()} ({resp.modelo}) ---")
    print(f"Tokens: {resp.tokens_input}+{resp.tokens_output}")
    print(resp.texto)
```

## Usa IA para...

- Pedirle a Claude que explique su propio entrenamiento con Constitutional AI y como difiere del RLHF de OpenAI.
- Preguntarle en que escenarios el context window de 200K tokens de Claude tiene ventaja practica sobre GPT-4o (128K).
- Pedirle que sugiera casos de uso especificos para empresas ecuatorianas donde Claude seria la mejor eleccion.

## Que aprendiste

- Las diferencias concretas de interfaz entre las APIs de OpenAI y Anthropic.
- Como Claude maneja documentos largos y por que 200K tokens es transformador para ciertos casos.
- Como construir una capa de abstraccion que permite cambiar de proveedor sin reescribir la logica de negocio.
- Los precios actuales de Claude (Sonnet 3.5: $3/$15 por millon de tokens input/output vs GPT-4o: $5/$15).

## Reto extra

Implementa streaming para ambas APIs en el wrapper unificado. El streaming permite mostrar la respuesta token por token (como ChatGPT lo hace en la web) en lugar de esperar a que termine. Construye un script que imprima la respuesta en tiempo real con un cursor parpadeante en la terminal. Compara la latencia percibida (tiempo al primer token) entre Claude y GPT-4o.
