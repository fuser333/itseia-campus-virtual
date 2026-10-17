# Ejercicio Sesion 6: Agentes de IA — LangChain y Frameworks

**Materia:** IA Generativa y LLMs
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT (via LangChain)
**Duracion:** 60 min

## Objetivo

Construir agentes de IA funcionales usando LangChain, comprender el ciclo ReAct (Reason + Act), implementar herramientas (tools) que el agente puede usar autonomamente, y desarrollar un agente especializado para un caso de uso de investigacion de mercado ecuatoriano.

## Contexto (Ecuador)

Un agente de IA no solo responde preguntas — toma decisiones, usa herramientas, verifica resultados y itera hasta completar una tarea compleja. Una empresa de consultoria en Quito podria tener un agente que investiga automaticamente el mercado de un nuevo sector, busca datos del BCE y INEC, calcula indicadores y redacta un informe. Eso es exactamente lo que construiras hoy.

## Instrucciones

### Parte 1 — Concepto: que es un agente? (10 min)

Diagrama el ciclo ReAct en papel o herramienta digital:

```
[OBJETIVO] → [RAZONAMIENTO] → [SELECCIONAR HERRAMIENTA] → [EJECUTAR]
                    ↑                                            ↓
             [OBSERVAR RESULTADO] ← ← ← ← ← ← ← ← ← ← ← [RESULTADO]
                    ↓
             [OBJETIVO LOGRADO?]
             SI → [RESPUESTA FINAL]
             NO → [RAZONAMIENTO] (siguiente iteracion)
```

Para el objetivo "Cuanto vale el mercado de supermercados en Ecuador y cuales son los 3 lideres?", escribe manualmente como deberia iterar un agente:
- Iteracion 1: Que herramienta usa? Que busca? Que resultado espera?
- Iteracion 2: Con el resultado anterior, que hace a continuacion?
- Iteracion 3: Como sintetiza la respuesta final?

### Parte 2 — Instalar LangChain y construir el primer agente (25 min)

```bash
pip install langchain langchain-openai langchain-community duckduckgo-search wikipedia
```

```python
import os
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_react_agent
from langchain import hub
from langchain.tools import DuckDuckGoSearchRun, WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
from langchain.tools import tool
import json

# Configurar el LLM base
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    api_key=os.getenv("OPENAI_API_KEY")
)

# Herramienta 1: Busqueda web
search_tool = DuckDuckGoSearchRun(
    name="busqueda_web",
    description="Busca informacion actualizada en internet. Util para datos recientes de mercado, noticias y estadisticas. Input: consulta de busqueda en español."
)

# Herramienta 2: Wikipedia
wiki_tool = WikipediaQueryRun(
    api_wrapper=WikipediaAPIWrapper(lang="es", top_k_results=2),
    name="wikipedia",
    description="Busca informacion enciclopedica. Util para contexto historico y definiciones. Input: termino o tema a buscar."
)

# Herramienta 3: Custom — Calculadora financiera
@tool
def calcular_indicadores_financieros(datos_json: str) -> str:
    """
    Calcula indicadores financieros basicos.
    Input: JSON string con campos: 'ventas', 'costos', 'gastos_operativos', 'deuda', 'patrimonio'.
    Output: JSON con margen bruto, margen neto, ROE y nivel de apalancamiento.
    """
    try:
        datos = json.loads(datos_json)
        ventas = datos.get("ventas", 0)
        costos = datos.get("costos", 0)
        gastos_op = datos.get("gastos_operativos", 0)
        deuda = datos.get("deuda", 0)
        patrimonio = datos.get("patrimonio", 1)

        utilidad_bruta = ventas - costos
        utilidad_neta = utilidad_bruta - gastos_op

        resultado = {
            "margen_bruto": round((utilidad_bruta / ventas * 100), 2) if ventas > 0 else 0,
            "margen_neto": round((utilidad_neta / ventas * 100), 2) if ventas > 0 else 0,
            "roe": round((utilidad_neta / patrimonio * 100), 2) if patrimonio > 0 else 0,
            "apalancamiento": round(deuda / patrimonio, 2) if patrimonio > 0 else 0,
            "punto_equilibrio_ventas": round(gastos_op / (1 - costos/ventas), 2) if ventas > 0 else 0,
        }
        return json.dumps(resultado)
    except Exception as e:
        return f"Error en calculo: {str(e)}. Verifica el formato JSON del input."

# Herramienta 4: Custom — Generador de informe
@tool
def generar_informe_ejecutivo(datos_investigacion: str) -> str:
    """
    Genera un informe ejecutivo estructurado con los datos recopilados.
    Input: String con todos los datos e insights de la investigacion.
    Output: Informe formateado en markdown.
    """
    return f"""
## INFORME EJECUTIVO DE INVESTIGACION DE MERCADO

*Generado por Agente IA de ITSEIA*

{datos_investigacion}

---
*Nota: Este informe fue generado automaticamente. Verificar datos criticos con fuentes primarias.*
"""

# Construir el agente
tools = [search_tool, wiki_tool, calcular_indicadores_financieros, generar_informe_ejecutivo]

# Prompt ReAct estandar de LangChain Hub
prompt = hub.pull("hwchase17/react")

agente = create_react_agent(llm, tools, prompt)
agente_executor = AgentExecutor(
    agent=agente,
    tools=tools,
    verbose=True,      # Muestra el razonamiento del agente
    max_iterations=6,
    handle_parsing_errors=True
)

# Ejecutar el agente con una tarea real
tarea = """
Investiga el mercado de comercio electronico en Ecuador:
1. Cual es el tamano actual del mercado (en dolares)?
2. Cuales son las 3 plataformas lideres?
3. Cual es la tasa de crecimiento anual?
Con esa informacion, asume ventas de $50,000/mes, costos del 40% y gastos operativos de $8,000/mes,
y calcula los indicadores financieros para una empresa que quiere entrar a ese mercado.
Finalmente, genera un informe ejecutivo con todos los hallazgos.
"""

print("Ejecutando agente...\n" + "="*60)
resultado = agente_executor.invoke({"input": tarea})
print("\n" + "="*60)
print("RESULTADO FINAL:")
print(resultado["output"])
```

Observa el output verbose: cada iteracion del ciclo ReAct, las herramientas elegidas y el razonamiento.

### Parte 3 — Agente con memoria (15 min)

Los agentes sin memoria olvidan el contexto entre llamadas. Agrega memoria conversacional:

```python
from langchain.memory import ConversationBufferWindowMemory
from langchain.agents import create_react_agent, AgentExecutor
from langchain_core.prompts import PromptTemplate

# Memoria de ventana: recuerda las ultimas 5 interacciones
memoria = ConversationBufferWindowMemory(
    k=5,
    memory_key="chat_history",
    return_messages=True
)

# Sistema de conversacion multiturno
print("Agente de investigacion de mercado Ecuador")
print("Escribe 'salir' para terminar\n")

while True:
    consulta = input("Tu consulta: ").strip()
    if consulta.lower() == "salir":
        break

    resultado = agente_executor.invoke({
        "input": consulta,
        "chat_history": memoria.load_memory_variables({})["chat_history"]
    })

    respuesta = resultado["output"]
    print(f"\nAgente: {respuesta}\n")

    # Guardar en memoria
    memoria.save_context(
        {"input": consulta},
        {"output": respuesta}
    )
```

Prueba con esta secuencia de preguntas (observa como el agente recuerda el contexto):
1. "Que es el mercado de seguros en Ecuador?"
2. "Cual es el principal jugador de ese mercado?"
3. "Y cuanto crecio ese jugador el año pasado?"
4. "Comparado con el mercado general que mencionaste antes, crece mas o menos rapido?"

### Parte 4 — Arquitecturas de agentes (10 min)

Estudia y documenta las diferencias entre estas arquitecturas. Para cada una, nombra un caso de uso ecuatoriano apropiado:

| Arquitectura | Descripcion | Caso de uso Ecuador |
|---|---|---|
| ReAct (Reason + Act) | Alterna razonamiento y accion en un loop | ? |
| Plan-and-Execute | Primero planifica todos los pasos, luego ejecuta | ? |
| Multi-Agent | Varios agentes especializados que colaboran | ? |
| Self-Reflective | El agente critica y mejora su propia respuesta | ? |

## Usa IA para...

- Pedirle a ChatGPT que explique la diferencia entre LangChain, LlamaIndex y AutoGen en terminos de cuando usar cada uno.
- Preguntarle cuales son las limitaciones actuales de los agentes de IA (alucinaciones de herramientas, loops infinitos, etc.).
- Pedirle que diseñe la arquitectura de un agente multi-herramienta para una empresa de exportacion de banano ecuatoriana.

## Que aprendiste

- Que un agente es un LLM mas un loop de decision mas herramientas — no magia.
- Como LangChain abstrae la complejidad del ciclo ReAct en pocas lineas de codigo.
- La importancia del `verbose=True` para entender y depurar el razonamiento del agente.
- Que la memoria conversacional permite construir asistentes con contexto persistente.

## Reto extra

Construye un agente multi-agente usando LangGraph: un agente "investigador" que busca datos, un agente "analista" que procesa los datos, y un agente "redactor" que escribe el informe. Implementa el flujo como un grafo dirigido donde el investigador puede solicitar mas datos al analista antes de pasar al redactor. Usa como caso: analisis de competencia para abrir una cafeteria especializada en Quito.
