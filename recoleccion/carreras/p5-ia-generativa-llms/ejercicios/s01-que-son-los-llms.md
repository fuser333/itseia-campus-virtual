# Ejercicio Sesion 1: Que son los LLMs — GPT, Claude, Gemini y Llama por dentro

**Materia:** IA Generativa y LLMs
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT + Claude + Gemini (comparacion simultanea)
**Duracion:** 50 min

## Objetivo

Comprender la arquitectura Transformer que subyace a todos los LLMs modernos, identificar las diferencias tecnicas y filosoficas entre los cuatro modelos lideres, y desarrollar criterio propio para elegir el modelo correcto segun el caso de uso.

## Contexto (Ecuador)

Las empresas ecuatorianas que adoptan IA enfrentan la pregunta: que modelo usar? Usar GPT-4o cuesta diferente a usar Claude 3.5 Sonnet o Gemini 1.5 Pro. Para un analista de datos en una empresa de Guayaquil o un desarrollador en Quito, elegir mal el modelo puede significar costos innecesarios o resultados inferiores. Este ejercicio te da el criterio tecnico para decidir con fundamento.

## Instrucciones

### Parte 1 — Diseccion del Transformer (15 min)

1. Dibuja en papel o en una herramienta digital (Excalidraw, Miro) el diagrama de un bloque Transformer con:
   - Capa de embeddings
   - Multi-head self-attention
   - Feed-forward network
   - Layer normalization
   - Residual connections

2. Anota en cada componente su funcion en una frase. Ejemplo: "Self-attention: cada token mira a todos los demas tokens y decide cuanto peso darles."

3. Explica con tus propias palabras por que los LLMs predicen "el siguiente token" y como eso genera texto coherente.

### Parte 2 — Benchmark comparativo (20 min)

Ejecuta el mismo conjunto de prompts en ChatGPT (GPT-4o), Claude (claude-3-5-sonnet), y Gemini (gemini-1.5-pro). Usa las interfaces web gratuitas si no tienes API keys aun.

**Prompt 1 — Razonamiento logico:**
```
Hay 5 casas de colores diferentes. El dueno de la casa roja bebe cafe.
El dueno de la casa verde bebe te. La casa verde esta a la derecha de la
casa blanca. El noruego vive en la primera casa. El dueno de la casa azul
tiene un gato. Quien tiene el pez?
```

**Prompt 2 — Codigo Python:**
```
Escribe una funcion Python que reciba una lista de strings con nombres de
ciudades ecuatorianas y retorne un diccionario con la frecuencia de cada
letra inicial, ordenado de mayor a menor frecuencia.
```

**Prompt 3 — Analisis critico:**
```
Dame 3 razones por las que la IA podria ser perjudicial para la economia
ecuatoriana y 3 razones por las que podria beneficiarla. Se especifico
con datos del contexto local.
```

Completa esta tabla de evaluacion:

| Criterio | GPT-4o | Claude 3.5 | Gemini 1.5 |
|---|---|---|---|
| Precision razonamiento logico | | | |
| Calidad del codigo (ejecuta sin errores?) | | | |
| Profundidad analisis Ecuador | | | |
| Velocidad de respuesta | | | |
| Claridad y estructura | | | |
| Costo estimado por 1M tokens (input) | | | |

### Parte 3 — Llama: el modelo open source (15 min)

Llama 3.1 de Meta es open source y se puede correr localmente. Responde:

1. Que significa que un modelo sea "open source" en el contexto de LLMs? Diferencia entre pesos abiertos y codigo abierto.
2. Usa Groq (groq.com — gratis) para hacer una llamada a llama-3.1-70b-versatile con el Prompt 2 de arriba. Compara el resultado.
3. Nombra dos casos de uso donde preferirías Llama sobre GPT-4o y justifica tu respuesta.

## Usa IA para...

- Pedirle a Claude que te explique la diferencia entre RLHF y Constitutional AI (el metodo de entrenamiento de Claude) en terminos simples.
- Preguntarle a ChatGPT que es un "context window" y como afecta a los casos de uso empresariales.
- Pedirle a Gemini que compare sus capacidades multimodales con las de GPT-4o Vision.

## Que aprendiste

Al terminar este ejercicio debes poder responder sin dudar:

- Que es un token y por que importa para el costo de las APIs?
- Cual modelo elegirias para una tarea de analisis de documentos legales ecuatorianos de 200 paginas y por que?
- Cual es la diferencia fundamental entre un modelo propietario y uno open source en terminos de privacidad de datos?
- Por que todos los LLMs pueden "alucinar" y que estrategias reducen ese riesgo?

## Reto extra

Instala Ollama (ollama.ai) en tu computadora y corre llama3.2:3b localmente. Ejecuta el Prompt 2 y mide el tiempo de respuesta. Calcula cuanto costaría la misma llamada en GPT-4o a $5 por millon de tokens. Redacta una recomendacion de 150 palabras para una pyme ecuatoriana sobre si deberia usar modelos locales o APIs en la nube.
