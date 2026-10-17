# Ejercicio Sesion 3: Tu Primera Interaccion con ChatGPT y Claude

**Materia:** Introduccion a la Inteligencia Artificial
**Nivel:** Basico
**Herramienta IA:** ChatGPT + Claude
**Duracion estimada:** 30 min

## Objetivo

Interactuar por primera vez con dos modelos de lenguaje (ChatGPT y Claude), entender como funcionan a nivel basico, y documentar las diferencias en estilo, precision y comportamiento de cada uno.

## Contexto

En Ecuador, el uso de ChatGPT crecio un **340% entre 2023 y 2024** segun datos de SimilarWeb. Sin embargo, la mayoria de usuarios solo lo usa para "preguntas simples" perdiendo el 90% de su potencial. En esta sesion vas a ir mas alla: vas a comparar dos de los modelos mas importantes del mundo con una tarea real de negocio ecuatoriano.

## Instrucciones

### Parte A — Configuracion inicial (5 min)

1. Crea una cuenta gratuita en **chat.openai.com** si no tienes una (correo + verificacion)
2. Crea una cuenta gratuita en **claude.ai** si no tienes una
3. Abre ambas en tabs separados del navegador

### Parte B — La misma tarea, dos modelos

Vas a dar exactamente el mismo prompt a los dos modelos. Copia y pega esto:

```
Soy emprendedor en Quito, Ecuador. Tengo una tienda de ropa de $50,000 al ano
en ventas. Quiero implementar IA para mejorar mi negocio pero no se por donde
empezar. Dame un plan de 3 pasos concretos y practicos que pueda ejecutar en
los proximos 30 dias con herramientas gratuitas o de bajo costo. Incluye los
nombres exactos de las herramientas y cuanto cuesta cada una en dolares.
```

### Parte C — Tabla comparativa

Despues de leer ambas respuestas, llena esta tabla:

| Criterio | ChatGPT | Claude |
|----------|---------|--------|
| Longitud de respuesta | | |
| Nombra herramientas especificas | Si / No | Si / No |
| Menciona precios reales en USD | Si / No | Si / No |
| Tono de la respuesta | | |
| Paso que mas te convencio | | |
| Algo que dijo que te parecio inventado | | |
| Calificacion general (1-10) | | |

### Parte D — Segunda vuelta: pregunta de seguimiento

Al modelo que te dio mejor respuesta, escribe esto (adaptado a su respuesta):

```
Profundiza en el paso [N] que mencionaste. Dame el tutorial paso a paso
de como configurar [la herramienta que menciono] para una tienda de ropa
en Quito. Incluye configuracion especifica para Ecuador (idioma espanol,
moneda dolares, horario GMT-5).
```

Documenta si la respuesta de seguimiento es coherente con la primera o si el modelo "olvido" el contexto.

### Parte E — Limite del modelo

Escribe esto a cualquiera de los dos:

```
¿Cuanto vendio Zara Ecuador en 2024? Dame el numero exacto de ventas
anuales en dolares.
```

¿Que responde? ¿Por que el modelo no puede darte ese dato? Escribe una hipotesis de 2 lineas.

## Usa IA para...

(Este ejercicio ES el uso de IA. El prompt adicional es este:)

> Despues de hacer la comparacion, abre Claude y escribe:
> "Acabas de competir con ChatGPT en una tarea de consultoria para un emprendedor en Quito. ¿En que crees que eres mejor que ChatGPT? ¿En que crees que ChatGPT es mejor que tu? Se honesto."

Esta respuesta te dara una perspectiva metacognitiva muy interesante sobre los limites de los modelos de lenguaje.

## Que aprendiste

- Los **LLMs (Large Language Models)** generan texto prediciendo la siguiente palabra mas probable segun su entrenamiento.
- Tienen una **fecha de corte de conocimiento**: no saben nada que ocurrio despues de esa fecha.
- **ChatGPT y Claude son diferentes** en estilo, longitud, tono y en como manejan la incertidumbre.
- La misma pregunta puede dar respuestas muy distintas: esto no significa que uno "tiene razon y el otro no".
- Los modelos pueden **alucinar** (inventar datos que suenan reales): siempre verifica precios, estadisticas y nombres con fuentes primarias.
- El **contexto de conversacion** importa: los modelos recuerdan la conversacion actual pero no conversaciones previas.

## Reto extra

Abre una nueva conversacion en ChatGPT y en Claude. Describe un problema de negocio ecuatoriano muy especifico que te interese (tu carrera, tu familia, tu ciudad). Pide a cada modelo un plan de accion. Comparte las respuestas con un companero de clase. ¿Sus modelos dieron respuestas similares o muy diferentes al mismo problema? Discutan por que podrian diferir.
