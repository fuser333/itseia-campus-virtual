# Ejercicio Sesion 4: Prompt Engineering Avanzado — System Prompts, Few-Shot y Chain-of-Thought

**Materia:** IA Generativa y LLMs
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 60 min

## Objetivo

Dominar las tres tecnicas mas poderosas de prompt engineering — system prompts robustos, few-shot learning y chain-of-thought prompting — y demostrar empiricamente como cada tecnica mejora la calidad y consistencia de las respuestas de los LLMs en casos de uso empresariales ecuatorianos.

## Contexto (Ecuador)

El 80% de los proyectos de IA que fallan en empresas ecuatorianas no fallan por el modelo — fallan por prompts mal diseñados. Un system prompt debil hace que GPT-4o se comporte igual que GPT-3.5. Un prompt bien estructurado puede reemplazar semanas de fine-tuning. Este ejercicio es probablemente la habilidad tecnica con mejor ROI en todo el programa.

## Instrucciones

### Parte 1 — System Prompts: del malo al excelente (15 min)

Compara estos tres niveles de system prompt para el mismo caso de uso (asistente de recursos humanos para empresa ecuatoriana):

**Nivel 1 — Basico (malo):**
```
Eres un asistente de RRHH.
```

**Nivel 2 — Intermedio (mejor):**
```
Eres un asistente especializado en recursos humanos para empresas ecuatorianas.
Conoces el Codigo de Trabajo ecuatoriano y las normativas del IESS.
Responde preguntas de empleados y empleadores.
```

**Nivel 3 — Avanzado (excelente):**
```
Eres AsesorRRHH, el asistente especializado en recursos humanos de [Empresa].

ROL Y EXPERTISE:
- Experto en Codigo Organico del Trabajo de Ecuador (2022)
- Conocimiento profundo de normativas IESS, SENAE y SRI relevantes para nomina
- Experiencia en contratos: indefinidos, plazo fijo, servicios especificos, obra cierta
- Calculo de beneficios sociales: decimos, fondos de reserva, utilidades

TONO Y FORMATO:
- Profesional pero accesible, sin jerga legal innecesaria
- Respuestas estructuradas con puntos clave primero
- Siempre citar el articulo legal relevante cuando aplique
- Si hay ambiguedad legal, mencionar ambas interpretaciones

LIMITACIONES CLARAS:
- No das consejo legal vinculante (recomienda consultar abogado para casos complejos)
- No calculas valores exactos sin tener todos los datos del empleado
- No sabes sobre casos posteriores a tu fecha de entrenamiento

FORMATO DE RESPUESTA:
1. Respuesta directa en 2-3 oraciones
2. Fundamento legal (si aplica)
3. Pasos practicos o recomendaciones
4. Alerta si el caso requiere asesoria profesional
```

**Ejercicio empirico:** Usa el mismo prompt de usuario con los tres system prompts y compara:
```
Usuario: "Me despidieron hoy despues de 3 años y 2 meses trabajando.
Tengo contrato indefinido. Cuanto me deben pagar?"
```

Evalua las respuestas en: precision legal, estructura, utilidad practica, y menciones a limitaciones.

### Parte 2 — Few-Shot Learning: ensenar con ejemplos (20 min)

Few-shot consiste en incluir ejemplos del formato de respuesta deseado dentro del prompt. Es especialmente poderoso para tareas de clasificacion, extraccion o generacion con formato especifico.

**Caso de uso:** Clasificador de reclamos de clientes para empresa de telecomunicaciones ecuatoriana.

```python
import anthropic
import json

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_ZERO_SHOT = """
Clasifica el reclamo del cliente en una categoria y asigna prioridad (1-5).
Responde en JSON con campos: categoria, prioridad, accion_inmediata.
"""

SYSTEM_FEW_SHOT = """
Clasifica reclamos de clientes de una empresa de telecomunicaciones ecuatoriana.
Responde SIEMPRE en JSON valido con este formato exacto.

EJEMPLOS:

Input: "Mi internet lleva 3 dias sin funcionar y tengo reunion de trabajo manana"
Output: {"categoria": "FALLA_SERVICIO", "prioridad": 5, "accion_inmediata": "Escalar a tecnico en 2h, ofrecer compensacion dia de servicio"}

Input: "Quiero cambiar mi plan a uno con mas megas"
Output: {"categoria": "CAMBIO_PLAN", "prioridad": 2, "accion_inmediata": "Enviar catalogo de planes, consultar si hay promocion vigente"}

Input: "Me cobraron $45 de mas en mi factura de este mes"
Output: {"categoria": "COBRO_INDEBIDO", "prioridad": 4, "accion_inmediata": "Solicitar numero de cuenta, iniciar proceso de devolucion en 48h"}

Input: "Necesito cancelar mi servicio porque me mudo a otra ciudad"
Output: {"categoria": "CANCELACION", "prioridad": 3, "accion_inmediata": "Verificar penalidad contractual, ofrecer suspension temporal como alternativa"}

Ahora clasifica el siguiente reclamo:
"""

reclamos_prueba = [
    "Llevo una semana llamando y nadie me atiende. Quiero hablar con el gerente.",
    "El tecnico que vino hoy a instalar daño la pared de mi casa en Guayaquil.",
    "Mi hija usa el internet para estudiar y ahora se corta cada 30 minutos.",
    "Me prometieron velocidad de 100 megas y la prueba dice 8 megas.",
]

print("COMPARACION ZERO-SHOT vs FEW-SHOT:\n")
for reclamo in reclamos_prueba:
    print(f"Reclamo: {reclamo}")

    # Zero-shot
    r_zero = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=150,
        system=SYSTEM_ZERO_SHOT,
        messages=[{"role": "user", "content": reclamo}]
    )

    # Few-shot
    r_few = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=150,
        system=SYSTEM_FEW_SHOT,
        messages=[{"role": "user", "content": reclamo}]
    )

    print(f"  Zero-shot: {r_zero.content[0].text}")
    print(f"  Few-shot:  {r_few.content[0].text}")
    print()
```

Analiza: en cuales reclamos el few-shot produce JSON mas consistente y accionable?

### Parte 3 — Chain-of-Thought: hacer razonar al modelo (15 min)

Chain-of-Thought (CoT) fuerza al modelo a "pensar en voz alta" antes de dar la respuesta. Reduce drasticamente los errores en razonamiento matematico, logico y causal.

**Caso:** Analisis de viabilidad de apertura de un local en Ecuador.

```python
PROMPT_SIN_COT = """
Una emprendedora en Quito quiere abrir una tienda de productos organicos.
Tiene $15,000 de capital inicial. El arriendo es $800/mes, empleado $500/mes,
servicios $150/mes, inventario inicial $5,000. Ventas estimadas mes 1: $2,000,
crecimiento mensual: 15%. Es viable? SI o NO.
"""

PROMPT_CON_COT = """
Una emprendedora en Quito quiere abrir una tienda de productos organicos.
Tiene $15,000 de capital inicial. El arriendo es $800/mes, empleado $500/mes,
servicios $150/mes, inventario inicial $5,000. Ventas estimadas mes 1: $2,000,
crecimiento mensual: 15%. Es viable?

Piensa paso a paso:
1. Primero calcula la inversion inicial total
2. Calcula el capital de trabajo restante
3. Calcula los costos fijos mensuales
4. Proyecta las ventas para los primeros 6 meses con crecimiento del 15%
5. Calcula cuando alcanza el punto de equilibrio
6. Determina cuantos meses puede operar con el capital restante
7. Concluye si es viable y que ajustes recomiendas

Muestra todos los calculos.
"""

# Compara ambos prompts con Claude
for label, prompt in [("SIN CoT", PROMPT_SIN_COT), ("CON CoT", PROMPT_CON_COT)]:
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=800,
        messages=[{"role": "user", "content": prompt}]
    )
    print(f"\n=== {label} ===")
    print(response.content[0].text)
    print(f"Tokens output: {response.usage.output_tokens}")
```

Responde: El CoT usa mas tokens (y cuesta mas) pero da mejores resultados? En que tipos de problemas vale la pena?

### Parte 4 — Combinar las tres tecnicas (10 min)

Diseña un prompt avanzado que combine las tres tecnicas para un asistente de analisis financiero para pymes ecuatorianas. Debe:
- Tener un system prompt de nivel 3 con rol, tono y limitaciones
- Incluir 2 ejemplos few-shot de analisis financiero
- Activar CoT con la frase "Analiza metodicamente considerando..."

Escribe el prompt completo y pruebalo con este caso: "Fabrica de calzado en Ambato, ventas $45K/mes, costos directos 60%, gastos fijos $8K/mes, deuda $120K al 18% anual. Como esta la salud financiera?"

## Usa IA para...

- Pedirle a Claude que critice y mejore uno de tus prompts (usa el meta-prompt: "Actua como experto en prompt engineering y mejora este prompt: [tu prompt]").
- Preguntarle cuando usar few-shot vs fine-tuning — cual es mas economico para un caso de uso con 1000 solicitudes/dia?
- Pedirle que genere 5 ejemplos few-shot adicionales para el clasificador de reclamos con categorias que tu no hayas considerado.

## Que aprendiste

- Como la calidad del system prompt impacta directamente la calidad de las respuestas.
- Que few-shot reduce la variabilidad de formato y aumenta la precision en tareas estructuradas.
- Que CoT mejora el razonamiento pero aumenta el costo por mayor numero de tokens de output.
- La regla practica: usar CoT para problemas con multiples pasos logicos; few-shot para tareas con formato rigido.

## Reto extra

Construye un "prompt optimizer" automatico: un script que recibe un prompt inicial y 10 pares (input, output_esperado), llama a Claude para que evalue el prompt y sugiera mejoras, aplica las mejoras, y mide si la tasa de aciertos mejora en esos 10 casos. Implementa 3 iteraciones de optimizacion y reporta la mejora porcentual.
