# Ejercicio Sesion 6: APIs de IA en la Nube — OpenAI, Google AI y Anthropic

**Materia:** Cloud Computing para IA
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT + Claude
**Duracion estimada:** 50 min

## Objetivo

Consumir las tres principales APIs de IA generativa (OpenAI, Google Gemini y Anthropic Claude) desde Python para construir un asistente automatizado que analiza datos economicos de Ecuador y genera reportes en lenguaje natural, comparando capacidades, costos y tiempos de respuesta.

## Contexto

Las APIs de IA son el SaaS mas transformador del siglo XXI. En Ecuador, empresas como H3L usan la API de OpenAI para su producto Strata (cerebro digital profesional), ImagemIA usa Google Cloud Vision para procesar imagenes medicas, y varias fintechs ecuatorianas integran Claude de Anthropic para atender clientes 24/7. Para un egresado de ITSEIA, saber integrar estas APIs es tan fundamental como saber SQL: el 70% de las empresas que contratan Data Scientists o Ingenieros IA exigen experiencia con al menos una de estas APIs.

## Instrucciones

1. Abre Google Colab y crea `sesion06_apis_ia.ipynb`.

2. Configura las tres APIs:

```python
# Cloud Computing para IA - Sesion 6: APIs de IA
# ITSEIA - Periodo 3

!pip install -q openai anthropic google-generativeai

import openai
import anthropic
import google.generativeai as genai
import time
import json

# CONFIGURAR CLAVES (usa Secrets de Colab - Tools -> Secrets)
# from google.colab import userdata
# OPENAI_KEY = userdata.get('OPENAI_API_KEY')
# ANTHROPIC_KEY = userdata.get('ANTHROPIC_API_KEY')
# GEMINI_KEY = userdata.get('GEMINI_API_KEY')

print("SDKs instalados:")
print(f"  openai: {openai.__version__}")
print(f"  anthropic: {anthropic.__version__}")
print(f"  google-generativeai: {genai.__version__}")
```

3. Datos de Ecuador para el analisis:

```python
# DATOS ECONOMICOS ECUADOR - Contexto para las APIs
datos_ecuador = {
    "indicadores_macroeconomicos_2024": {
        "PIB": "$121,200 millones USD",
        "crecimiento_pib": "1.8%",
        "inflacion": "1.55% anual",
        "desempleo": "3.9%",
        "subempleo": "21.8%",
        "pobreza_extrema": "8.7% de la poblacion"
    },
    "exportaciones_principales": {
        "petroleo": "$8,200M (30.3%)",
        "camaron": "$5,800M (21.4%)",
        "banano": "$4,100M (15.1%)",
        "cacao": "$1,200M (4.4%)",
        "flores": "$1,000M (3.7%)"
    },
    "tecnologia_ia": {
        "profesionales_tecnologia_necesarios": 30000,
        "graduados_tecnologia_por_anio": 3000,
        "deficit": "27,000 profesionales",
        "empleabilidad_ciencia_datos": "88%",
        "salario_promedio_data_scientist": "$1,200-$2,800 USD/mes"
    },
    "contexto_educativo": {
        "tasa_desercion_universitaria_1er_anio": "26%",
        "inversion_perdida_por_desercion": "$2,400 por estudiante",
        "acceso_internet": "55% de hogares",
        "uso_smartphone": "78% de la poblacion"
    }
}

datos_texto = json.dumps(datos_ecuador, ensure_ascii=False, indent=2)
print("Datos Ecuador preparados para las APIs")
print(f"Longitud del contexto: {len(datos_texto)} caracteres")
```

4. Llama a las tres APIs y compara respuestas:

```python
# PROMPT BASE: Analisis economico Ecuador
prompt_analisis = f"""
Eres un analista economico senior especializado en Ecuador y America Latina.
Con los siguientes datos reales del Ecuador 2024, genera un reporte ejecutivo de 3 parrafos que:
1. Identifique las 2 mayores oportunidades economicas para Ecuador
2. Analice el deficit de talento tecnologico y su impacto
3. Proponga 3 recomendaciones concretas para el sector publico ecuatoriano

DATOS:
{datos_texto}

El reporte debe ser profesional, usar datos especificos del contexto y citar cifras concretas.
"""

# FUNCION GENERICA DE LLAMADA A API CON MEDICION DE TIEMPO
def llamar_api(nombre, funcion_api):
    inicio = time.time()
    try:
        respuesta = funcion_api()
        tiempo = time.time() - inicio
        return {'nombre': nombre, 'respuesta': respuesta,
                'tiempo_seg': round(tiempo, 2), 'error': None}
    except Exception as e:
        return {'nombre': nombre, 'respuesta': None,
                'tiempo_seg': round(time.time() - inicio, 2), 'error': str(e)}

# API 1: OPENAI GPT-4o-mini (costo-eficiente)
def llamar_openai():
    client = openai.OpenAI(api_key=OPENAI_KEY)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt_analisis}],
        max_tokens=600,
        temperature=0.3
    )
    return response.choices[0].message.content

# API 2: ANTHROPIC CLAUDE (Haiku - costo-eficiente)
def llamar_claude():
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    message = client.messages.create(
        model="claude-haiku-20240307",
        max_tokens=600,
        messages=[{"role": "user", "content": prompt_analisis}]
    )
    return message.content[0].text

# API 3: GOOGLE GEMINI FLASH (mas economico de los tres)
def llamar_gemini():
    genai.configure(api_key=GEMINI_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(prompt_analisis)
    return response.text

# Ejecutar las tres APIs
print("Llamando a las tres APIs de IA...")
print("(requiere credenciales validas en Secrets de Colab)\n")
print(prompt_analisis[:200] + "...\n")

# En produccion con credenciales reales:
# resultados = []
# for nombre, func in [('OpenAI GPT-4o-mini', llamar_openai),
#                      ('Anthropic Claude Haiku', llamar_claude),
#                      ('Google Gemini Flash', llamar_gemini)]:
#     print(f"Llamando {nombre}...")
#     r = llamar_api(nombre, func)
#     resultados.append(r)

# Simulacion de resultados para el ejercicio
print("RESPUESTA SIMULADA (estructura real de las APIs):")
print("="*60)
```

5. Comparacion de costos y casos de uso:

```python
# COMPARACION COMPLETA DE LAS TRES APIs
print("\n" + "="*65)
print("COMPARACION: OpenAI vs Claude vs Gemini")
print("="*65)

apis = {
    "OpenAI GPT-4o-mini": {
        "proveedor": "OpenAI (Sam Altman)",
        "modelo_economico": "gpt-4o-mini",
        "modelo_potente": "gpt-4o",
        "costo_input": "$0.15 / 1M tokens",
        "costo_output": "$0.60 / 1M tokens",
        "contexto_tokens": "128,000 tokens (~96,000 palabras)",
        "fortalezas": ["Ecosistema mas maduro", "Mejor para codigo", "GPTs personalizados", "Embeddings"],
        "debilidades": ["Costo mas alto en GPT-4o", "Sin multimodal en mini"],
        "caso_uso_ecuador": "Asistente legal para contratos en SRI/SB, generacion de codigo"
    },
    "Anthropic Claude Haiku": {
        "proveedor": "Anthropic (ex-OpenAI)",
        "modelo_economico": "claude-haiku-20240307",
        "modelo_potente": "claude-opus-4",
        "costo_input": "$0.25 / 1M tokens (Haiku)",
        "costo_output": "$1.25 / 1M tokens (Haiku)",
        "contexto_tokens": "200,000 tokens (~150,000 palabras)",
        "fortalezas": ["Mejor razonamiento largo", "Contexto mas largo", "Menos alucinaciones", "Seguro por diseno"],
        "debilidades": ["Ecosystem menos integrado", "API mas nueva"],
        "caso_uso_ecuador": "Analisis de documentos legales del registro civil, reportes financieros BCE"
    },
    "Google Gemini Flash": {
        "proveedor": "Google DeepMind",
        "modelo_economico": "gemini-1.5-flash",
        "modelo_potente": "gemini-1.5-pro",
        "costo_input": "$0.075 / 1M tokens (flash)",
        "costo_output": "$0.30 / 1M tokens (flash)",
        "contexto_tokens": "1,000,000 tokens (~750,000 palabras)",
        "fortalezas": ["Mas barato", "Contexto enorme", "Multimodal (texto+imagen+video)", "Integrado con Google Workspace"],
        "debilidades": ["Menos maduro en codigo", "Variable en calidad vs OpenAI"],
        "caso_uso_ecuador": "Analisis de imagenes satelitales para MAG, procesamiento de documentos del INEC"
    }
}

for api, info in apis.items():
    print(f"\n{api}")
    print(f"  Costo input:  {info['costo_input']}")
    print(f"  Costo output: {info['costo_output']}")
    print(f"  Contexto:     {info['contexto_tokens']}")
    print(f"  Fortalezas:   {', '.join(info['fortalezas'][:2])}")
    print(f"  Ecuador:      {info['caso_uso_ecuador']}")

# CALCULADORA DE COSTOS
print("\n\nCALCULADORA DE COSTOS:")
print("-"*50)
tokens_por_llamada = 1000  # input + output
llamadas_por_dia = 100
dias = 30

for api_nombre, info in apis.items():
    costo_input = float(info['costo_input'].split('$')[1].split('/')[0])
    costo_output = float(info['costo_output'].split('$')[1].split('/')[0])
    costo_promedio = (costo_input + costo_output) / 2
    costo_mensual = (tokens_por_llamada * llamadas_por_dia * dias * costo_promedio) / 1_000_000
    print(f"  {api_nombre:30s}: ${costo_mensual:.4f}/mes")
    print(f"    ({llamadas_por_dia} llamadas/dia, {tokens_por_llamada} tokens c/u)")
```

## Usa IA para...

> Primero, usa ChatGPT para disenar el prompt:
> "Necesito un prompt optimizado para que GPT-4o-mini analice indicadores economicos de Ecuador y genere recomendaciones para SENPLADES. El modelo tiene tendencia a ser muy generico. ¿Como redacto el prompt con tecnicas de prompt engineering (rol, contexto, formato de salida, ejemplos) para obtener recomendaciones especificas y accionables?"

> Luego, usa Claude para el analisis critico:
> "Tengo respuestas de tres APIs de IA (OpenAI, Gemini, Claude) sobre la economia ecuatoriana. ¿Que criterios uso para evaluar cual es mejor para un proyecto de analisis economico gubernamental? ¿Consideraciones de privacidad de datos para el sector publico ecuatoriano?"

Documenta los prompts optimizados y el criterio de evaluacion en tu notebook.

## Que aprendiste

- Las tres APIs tienen SDKs Python con sintaxis similar: configurar cliente, llamar con modelo + mensajes, recibir texto.
- **Gemini Flash** es el mas economico ($0.075/1M tokens input); **OpenAI GPT-4o** es el mas caro pero el mas usado.
- El **contexto disponible** importa para proyectos con documentos largos: Gemini tiene 1M tokens vs 128K de OpenAI.
- La **temperatura** controla la aleatoriedad: 0.0 para analisis facticos, 0.7-1.0 para contenido creativo.
- Para el sector publico ecuatoriano, la privacidad de datos es critica: revisar los terminos de servicio antes de enviar datos sensibles a APIs externas.

## Reto extra

Construye un script Python que: (1) tome un CSV del INEC, (2) calcule estadisticas descriptivas, (3) formatee esas estadisticas como prompt, (4) llame a Gemini Flash para generar un parrafo de interpretacion en espanol, y (5) guarde el resultado en un archivo de texto. El objetivo es automatizar la narrativa de reportes estadisticos como hace el INEC en sus boletines mensuales.
