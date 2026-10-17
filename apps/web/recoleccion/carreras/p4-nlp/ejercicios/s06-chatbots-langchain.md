# Ejercicio Sesion 6: Chatbots con LangChain

**Materia:** Procesamiento de Lenguaje Natural
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 60 min

## Objetivo

Construir chatbots conversacionales con memoria y personalidad usando LangChain, integrando modelos de lenguaje (OpenAI GPT o Google Gemini) con templates de prompts, cadenas (chains), memoria de conversacion y herramientas externas. El chatbot tendra identidad institucional ecuatoriana.

## Contexto (Ecuador)

El IESS (Instituto Ecuatoriano de Seguridad Social) atiende a 4 millones de afiliados. Su call center recibe 80,000 llamadas mensuales sobre tramites: consulta de aportes, turnos medicos, prestaciones, jubilacion. Un chatbot que responda el 70% de las consultas rutinarias ahorraria al IESS $2M anuales. Vamos a construir ese chatbot con LangChain.

## Instrucciones

1. Abre Google Colab. Instala y configura:
   ```python
   !pip install langchain langchain-google-genai python-dotenv
   from langchain_google_genai import ChatGoogleGenerativeAI
   from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
   from langchain.memory import ConversationBufferWindowMemory
   from langchain.chains import ConversationChain, LLMChain
   import os

   # Usa el API key de Google Gemini (gratuito)
   os.environ["GOOGLE_API_KEY"] = "tu-api-key-aqui"
   llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
   ```

2. NIVEL 1 — Chatbot basico con prompt template:
   ```python
   from langchain.prompts import PromptTemplate

   template = """Eres Sofia, asistente virtual del IESS Ecuador.
   Eres amable, profesional y hablas en espanol ecuatoriano formal.
   Conoces todos los tramites del IESS: aportes, turnos, jubilacion,
   prestamos, fondos de reserva.

   Si el usuario pregunta algo fuera del alcance del IESS, di amablemente
   que no puedes ayudar con eso y redirige a los tramites del IESS.

   Pregunta del afiliado: {pregunta}
   Respuesta de Sofia:"""

   prompt = PromptTemplate(template=template, input_variables=["pregunta"])
   chain = LLMChain(llm=llm, prompt=prompt)

   # Prueba con 5 preguntas reales del IESS
   preguntas = [
       "Cuantos aportes tengo acumulados?",
       "Como saco un turno para el dentista en el IESS?",
       "Tengo 30 años de aportes, puedo jubilarme?",
       "Cual es el monto maximo del prestamo quirografario?",
       "Como actualizo mi cuenta bancaria para recibir el fondo de reserva?"
   ]
   for p in preguntas:
       print(f"Usuario: {p}")
       print(f"Sofia: {chain.run(p)}\n")
   ```

3. NIVEL 2 — Chatbot con memoria de conversacion:
   ```python
   memory = ConversationBufferWindowMemory(
       k=5,  # recuerda ultimas 5 interacciones
       memory_key="chat_history",
       return_messages=True
   )

   template_memoria = """Eres Sofia, asistente del IESS Ecuador.
   Recuerda el contexto de la conversacion y si el usuario ya se identifico,
   usa su nombre. Sé concisa y util.

   Historial:
   {chat_history}

   Afiliado: {input}
   Sofia:"""

   conversacion = ConversationChain(llm=llm, memory=memory,
                                     prompt=ChatPromptTemplate.from_template(template_memoria))

   # Simula una conversacion de 8 turnos con contexto acumulado
   turnos = [
       "Hola, soy Juan Pilatasig, quiero consultar mis aportes",
       "Cuantos años me faltan para jubilarme? Tengo 52 años",
       "Y si aporto como voluntario los meses que faltan, funciona?",
       "Cual es el monto minimo de aporte voluntario?",
       "Gracias Juan... espera, yo me llamo Juan, no tu",
       # Turnos que prueban la memoria: el bot debe recordar el nombre y los 52 años
   ]
   ```

4. NIVEL 3 — Chatbot con herramientas (Tools):
   ```python
   from langchain.tools import tool
   from langchain.agents import initialize_agent, AgentType

   @tool
   def consultar_aportes(cedula: str) -> str:
       """Consulta el numero de aportes de un afiliado por cedula."""
       # Simulacion de base de datos
       db = {"1712345678": 156, "0912345678": 89, "1712345679": 240}
       aportes = db.get(cedula, None)
       if aportes:
           return f"El afiliado con cedula {cedula} tiene {aportes} aportes registrados."
       return "Cedula no encontrada en el sistema. Verificar numero."

   @tool
   def calcular_jubilacion(aportes: int, edad: int) -> str:
       """Calcula si un afiliado puede jubilarse."""
       if aportes >= 360 and edad >= 60:
           return "Cumple requisitos de jubilacion por vejez (360 aportes y 60 años)."
       elif aportes >= 480:
           return "Puede jubilarse por aportes (480 aportes sin limite de edad)."
       else:
           faltantes = max(360-aportes, 0)
           return f"Faltan {faltantes} aportes para jubilacion minima."

   agente = initialize_agent(
       tools=[consultar_aportes, calcular_jubilacion],
       llm=llm,
       agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
       verbose=True  # Muestra el razonamiento del agente
   )
   ```

5. Prueba el agente con preguntas que requieran usar herramientas:
   - "Con cedula 1712345678, puedo jubilarme? Tengo 61 años."
   - "Cuantos aportes tiene la cedula 0912345678 y cuanto le falta?"

6. Implementa una interfaz simple con `input()` en Colab para chatear en tiempo real:
   ```python
   print("Sofia IESS: Hola! Soy Sofia, asistente virtual del IESS. ?Como puedo ayudarte?")
   while True:
       usuario = input("Tu: ")
       if usuario.lower() in ['salir', 'exit', 'bye']:
           print("Sofia IESS: Hasta luego! Que tenga un buen dia."); break
       respuesta = conversacion.predict(input=usuario)
       print(f"Sofia IESS: {respuesta}\n")
   ```

## Usa IA para...

- Pedirle a Claude que genere 20 preguntas frecuentes reales del IESS con sus respuestas correctas para usar como datos de evaluacion
- Preguntar la diferencia entre `ConversationBufferMemory`, `ConversationBufferWindowMemory` y `ConversationSummaryMemory`: cual usar segun el caso
- Si el chatbot "alucina" informacion del IESS (inventa montos, plazos), preguntar como agregar un step de "grounding" con informacion factual real via RAG
- Pedir el codigo para registrar cada conversacion en un archivo JSON para auditoria posterior

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que es una "chain" en LangChain y como se diferencia de un "agent"
- Por que la memoria con ventana (window) es mejor que memoria ilimitada en produccion (costo de tokens)
- Que es el patron ReAct (Reasoning + Acting) que usa el agente con herramientas
- Como el "temperature" del LLM afecta la consistencia de las respuestas de un chatbot de soporte

## Reto Extra

Agrega una herramienta de busqueda en la pagina web real del IESS. Usa `langchain_community.tools.DuckDuckGoSearchRun` para buscar informacion actualizada cuando el usuario pregunta sobre montos o requisitos que cambian anualmente. El agente debe decidir automaticamente cuando buscar en web vs responder desde su conocimiento base. Implementa logging de las busquedas realizadas para auditar el comportamiento del agente.
