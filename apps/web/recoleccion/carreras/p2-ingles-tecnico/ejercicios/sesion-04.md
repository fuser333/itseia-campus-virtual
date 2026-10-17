# Ejercicio Sesion 4: Entender Papers de IA — Abstract, Methodology, Results

**Materia:** Ingles Tecnico I
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Desarrollar la habilidad de leer y extraer informacion clave de papers academicos de IA en ingles, identificando la estructura estandar (abstract, introduction, methodology, results, conclusion) y usando Claude estrategicamente para desbloquear parrafos tecnicamente densos.

## Contexto

arXiv.org publica diariamente cientos de papers de IA. Los investigadores de Google, Meta, OpenAI, DeepMind y universidades del mundo publican ahi antes que en cualquier otra parte. Un profesional de IA que sabe leer papers tiene acceso a la frontera del conocimiento — no espera que alguien lo traduzca o explique en YouTube meses despues.

## Instrucciones

**Parte 1 — Estructura de un Paper Cientifico de IA**

Todo paper de ML/IA sigue esta estructura:

| Seccion | Que contiene | Tiempo de lectura recomendado |
|---------|-------------|-------------------------------|
| **Abstract** | Resumen completo: problema, metodo, resultado principal | 100% de atencion — siempre leer |
| **Introduction** | Motivacion, problema, contribuciones del paper | 50% — leer primer parrafo y bullet points |
| **Related Work** | Papers anteriores relacionados | 20% — hojear para contexto |
| **Methodology** | Como funciona el modelo/algoritmo | 100% — el corazon del paper |
| **Experiments** | Datasets usados, metricas, comparacion con baselines | 100% — resultados concretos |
| **Conclusion** | Resumen y trabajo futuro | 100% — leer siempre |
| **References** | Fuentes citadas | 10% — solo si necesitas profundizar |

**Parte 2 — Lee este Abstract real (simplificado)**

El siguiente es el abstract de "Attention Is All You Need" (Vaswani et al., 2017) — el paper que introdujo la arquitectura Transformer, base de GPT, BERT y todos los LLMs modernos:

---

*"The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show the model to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.0 after training for 3.5 days on eight GPUs."*

---

**Preguntas de comprension (responde sin IA primero):**

1. ¿Que problema existia antes de este paper? (1 oracion)
2. ¿Cual es la contribucion principal ("We propose...")?
3. ¿En que tarea evaluaron el modelo?
4. ¿Que metrica usan para comparar? ¿Que significa BLEU?
5. ¿Que ventajas menciona sobre los modelos anteriores? (al menos 2)

**Vocabulario del abstract — traduce estas frases:**

| Frase en ingles | Tu traduccion |
|-----------------|--------------|
| "dominant sequence transduction models" | ____________ |
| "recurrent or convolutional neural networks" | ____________ |
| "dispensing with recurrence and convolutions entirely" | ____________ |
| "more parallelizable" | ____________ |
| "state-of-the-art" | ____________ |

**Parte 3 — Lee este fragmento de Methodology**

Del mismo paper, un extracto simplificado de la seccion de arquitectura:

---

*"The Transformer follows an encoder-decoder structure. The encoder maps an input sequence of symbol representations (x1,...,xn) to a sequence of continuous representations z=(z1,...,zn). Given z, the decoder then generates an output sequence (y1,...,ym) of symbols one element at a time.*

*The encoder is composed of a stack of N=6 identical layers. Each layer has two sub-layers. The first is a multi-head self-attention mechanism, and the second is a simple, position-wise fully connected feed-forward network. We employ a residual connection around each of the two sub-layers, followed by layer normalization.*

*The multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions."*

---

**Preguntas:**

1. ¿Cuantas capas tiene el encoder?
2. ¿Cuales son los dos sub-layers de cada capa?
3. ¿Que es una "residual connection"? (Si no lo sabes, es valido decirlo — para eso usamos IA despues)
4. ¿Que significa "multi-head attention" en tus propias palabras?

**Parte 4 — Frases Formulaicas de Papers**

Los papers usan frases recurrentes. Aprende estas:

| Frase de paper | Significado |
|----------------|------------|
| "We propose / We introduce..." | Presentamos nuestro metodo nuevo |
| "State-of-the-art results on..." | Mejor resultado reportado hasta ahora en... |
| "Outperforms baselines by X%" | Supera a los metodos de comparacion en X% |
| "We evaluate on [dataset]" | Probamos en el dataset [nombre] |
| "This is consistent with..." | Este resultado confirma lo que ya sabiamos sobre... |
| "Future work includes..." | Trabajo pendiente o limitaciones actuales |
| "To the best of our knowledge..." | Hasta donde sabemos (no encontramos otro igual) |
| "We ablate..." | Quitamos partes del modelo para ver que importa |

## Usa IA para...

> Abre Claude y escribe:
> "Estoy leyendo el paper 'Attention Is All You Need'. No entiendo bien: (1) que es exactamente 'self-attention mechanism' y como funciona, (2) que es 'residual connection' y por que ayuda al entrenamiento, (3) que significa la metrica BLEU en traduccion automatica. Explicame cada uno con una analogia simple, sin formulas matematicas por ahora."

Luego:
> "¿Cuales son los 3-5 papers de IA mas importantes que todo estudiante de Inteligencia Artificial deberia leer? Dame el titulo, los autores, el ano y por que es importante cada uno."

## Que aprendiste

- Un paper de IA tiene **estructura predecible** — saber donde buscar cada tipo de informacion acelera la lectura 3x.
- El **abstract** es el resumen completo del paper — si no entiende el abstract, el resto sera muy dificil.
- Los **"state-of-the-art results"** y las tablas de resultados son la clave de la seccion de experimentos.
- No necesitas entender el 100% de un paper — apunta al 60-70% en primera lectura.
- Claude es efectivo para **desbloquear parrafos especificos** que son densos tecnicamente.

## Reto extra

Ve a arxiv.org y busca un paper publicado en los ultimos 3 meses sobre un tema que te interese (busca en cs.LG para Machine Learning o cs.AI para IA general). Lee solo el abstract y la conclusion. Escribe en 5 oraciones en espanol: (1) el problema que resuelven, (2) el metodo que proponen, (3) el resultado principal, (4) una pregunta que te genera el paper. Trae esto a la siguiente clase.
