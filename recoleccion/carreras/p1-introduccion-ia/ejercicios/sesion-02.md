# Ejercicio Sesion 2: Machine Learning vs Deep Learning vs IA Generativa

**Materia:** Introduccion a la Inteligencia Artificial
**Nivel:** Basico
**Herramienta IA:** Gemini
**Duracion estimada:** 30 min

## Objetivo

Distinguir con claridad las tres grandes ramas de la IA moderna (ML, DL, GenAI) y mapear que tipo de problemas reales del Ecuador puede resolver cada una.

## Contexto

Cuando una empresa ecuatoriana dice que "usa IA", puede estar hablando de cosas muy diferentes:
- **Mastercard Ecuador** usa Machine Learning para detectar fraude en tiempo real
- **ImagemIA** (empresa ecuatoriana) usa Deep Learning para analizar radiografias
- **Decameron Hotels Ecuador** usa IA Generativa para personalizar correos de bienvenida

Son tres tecnologias distintas con principios distintos. Confundirlas genera malas decisiones de negocio.

## Instrucciones

### Parte A — El mapa mental de las tres ramas

Completa esta tabla comparativa en tu cuaderno:

| Caracteristica | Machine Learning | Deep Learning | IA Generativa |
|----------------|-----------------|---------------|---------------|
| Definicion simple | | | |
| Requiere muchos datos | Mediano | Masivo | Masivo |
| Aprende caracteristicas solo | No (humano las define) | Si (redes neuronales) | Si |
| Resultado tipico | Prediccion/clasificacion | Clasificacion compleja | Contenido nuevo |
| Ejemplo en Ecuador | | | |
| Herramienta popular | scikit-learn | TensorFlow/PyTorch | GPT-4, Gemini |

Rellena las celdas vacias con tus propias palabras.

### Parte B — Diagrama de capas (IA > ML > DL)

La relacion entre las tres es jerarquica. Dibuja tres circulos concentricos:
- Circulo exterior: **Inteligencia Artificial** (todo)
- Circulo medio: **Machine Learning** (subset de IA)
- Circulo interior: **Deep Learning** (subset de ML)
- La **IA Generativa** es una aplicacion que puede usar DL, ML, o ambos

¿Donde colocarias ChatGPT en este diagrama? ¿Y un sistema de recomendacion de Spotify? ¿Y un detector de spam?

### Parte C — Mapa de problemas ecuatorianos

Para cada tipo de problema, indica que rama usarias y por que:

1. Una cooperativa de ahorro en Riobamba quiere predecir que socios tienen riesgo de no pagar su credito. → **¿ML, DL o GenAI?**

2. El Hospital Metropolitano de Quito quiere detectar tumores en imagenes de tomografia. → **¿ML, DL o GenAI?**

3. El Ministerio de Turismo quiere crear automaticamente descripciones de destinos turisticos en 5 idiomas. → **¿ML, DL o GenAI?**

4. Una empresa floricultura en Cayambe quiere predecir el precio de rosas segun temperatura y demanda historica. → **¿ML, DL o GenAI?**

5. CNT Ecuador quiere identificar clientes que van a cancelar su contrato en los proximos 30 dias. → **¿ML, DL o GenAI?**

Justifica cada respuesta con 1-2 lineas.

## Usa IA para...

> Abre Gemini (gemini.google.com) y escribe:
> "Explica la diferencia entre Machine Learning, Deep Learning e IA Generativa usando una analogia con un negocio ecuatoriano. Luego dame un ejemplo concreto de cada uno que ya este funcionando en Ecuador o Latinoamerica en 2024. Finalmente, explica por que ChatGPT es IA Generativa y no 'simplemente Machine Learning'."

Compara la analogia que usa Gemini con tu propia comprension:
- ¿La analogia te ayudo a entender mejor?
- ¿Cambiaste alguna respuesta de la Parte C despues de leer a Gemini?

Pregunta de seguimiento:
> "¿Que es un LLM (Large Language Model)? ¿Como se relaciona con Deep Learning y con IA Generativa?"

## Que aprendiste

- **Machine Learning**: el sistema aprende patrones de datos historicos para predecir o clasificar casos nuevos. El humano define las variables importantes.
- **Deep Learning**: redes neuronales con muchas capas aprenden sus propias representaciones automaticamente. Ideal para imagenes, audio, texto.
- **IA Generativa**: crea contenido nuevo (texto, imagenes, codigo, audio) que no existia antes. Usa modelos de lenguaje o difusion entrenados con enormes datasets.
- El **DL es un subconjunto del ML**: todo Deep Learning es Machine Learning, pero no todo ML es Deep Learning.
- Los **LLMs** (como GPT-4, Claude, Gemini) son modelos de DL aplicados a lenguaje natural que impulsan la mayoria de IA Generativa actual.

## Reto extra

Busca en LinkedIn Ecuador perfiles de personas con el titulo "Machine Learning Engineer", "Data Scientist" o "AI Engineer". Elige 3 perfiles. Para cada uno identifica: ¿que rama de IA usa mas en su trabajo segun su descripcion? ¿Que herramientas menciona? ¿En que empresa trabaja? ¿Cual es su sueldo estimado segun Glassdoor o LinkedIn Salary? Resume los hallazgos en una tabla.
