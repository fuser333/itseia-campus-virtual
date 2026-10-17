# Ejercicio Sesion 4: Analisis de Sentimiento con Transformers

**Materia:** Procesamiento de Lenguaje Natural
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion:** 60 min

## Objetivo

Implementar analisis de sentimiento de alta precision usando modelos transformer pre-entrenados en espanol (BETO, RoBERTa-base-spanish) via HuggingFace Transformers, comparando zero-shot, few-shot y fine-tuning sobre datos ecuatorianos reales.

## Contexto (Ecuador)

La empresa SUPERMAXI (mayor cadena de supermercados de Ecuador) quiere monitorear en tiempo real la percepcion de sus clientes en redes sociales. Con 2 millones de clientes en el pais, analizar menciones manualmente es imposible. Un sistema de sentimiento automatico en espanol ecuatoriano les permite actuar en horas, no en semanas. Vamos a construir ese sistema.

## Instrucciones

1. Abre Google Colab con GPU T4. Instala:
   ```python
   !pip install transformers datasets torch accelerate sentencepiece
   from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer
   import torch
   print("GPU:", torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU")
   ```

2. FASE 1 — Zero-shot con pipeline de HuggingFace:
   ```python
   # Modelo pre-entrenado para sentimiento en espanol
   sentimiento = pipeline(
       "sentiment-analysis",
       model="nlptown/bert-base-multilingual-uncased-sentiment",
       device=0  # GPU
   )
   ```
   Crea 50 tweets sobre SUPERMAXI (positivos, negativos, neutros) con contexto ecuatoriano:
   ```python
   tweets_ec = [
       "Excelente atencion en el Supermaxi de la Colon, el cajero fue muy amable #Quito",
       "Subieron los precios del arroz arroz rose again en Supermaxi, que barbaridad #Ecuador",
       "Hoy compre en Supermaxi Kennedy, habia cola pero el autoservicio funciona bien",
       # ... agrega 47 mas con ayuda de ChatGPT
   ]
   ```
   Evalua accuracy vs etiquetas manuales.

3. FASE 2 — Fine-tuning con BETO (BERT en espanol):
   ```python
   model_name = "dccuchile/bert-base-spanish-wwm-cased"
   tokenizer = AutoTokenizer.from_pretrained(model_name)
   model = AutoModelForSequenceClassification.from_pretrained(
       model_name, num_labels=3  # negativo, neutro, positivo
   )
   ```

   Prepara el dataset con HuggingFace Datasets:
   ```python
   from datasets import Dataset
   df_train['label'] = df_train['sentimiento'].map({'negativo':0,'neutro':1,'positivo':2})

   def tokenize_function(examples):
       return tokenizer(examples["texto"], padding="max_length",
                        truncation=True, max_length=128)
   ```

4. Fine-tuning con Trainer API:
   ```python
   from transformers import TrainingArguments, Trainer

   training_args = TrainingArguments(
       output_dir="./beto-supermaxi",
       num_train_epochs=3,
       per_device_train_batch_size=16,
       per_device_eval_batch_size=32,
       warmup_steps=50,
       weight_decay=0.01,
       evaluation_strategy="epoch",
       fp16=True,  # mixed precision con GPU
       load_best_model_at_end=True,
   )
   ```
   Entrena con 40 ejemplos (train) y evalua con 10 (test). Aunque es poco dato, demuestra el proceso.

5. Compara los 3 enfoques en la misma tabla:
   - Zero-shot (sin fine-tuning)
   - BETO fine-tuned (3 epocas)
   - BETO fine-tuned (10 epocas)

   Metricas: Accuracy, F1-macro, tiempo de inferencia por tweet.

6. Analisis cualitativo: Muestra 5 casos donde el modelo se equivoca. Son tweets ironicos, sarcasmos o contextos muy locales (jerga guayaquilena) que el modelo no entiende?

## Usa IA para...

- Pedirle a ChatGPT que genere 50 tweets realistas sobre SUPERMAXI distribuidos 30% positivo, 40% negativo, 30% neutro (el mundo real tiene mas negativos en redes)
- Preguntar que es el mecanismo de "attention" en BERT y por que le permite entender el contexto de una palabra mejor que LSTM
- Si la GPU se queda sin memoria (CUDA OOM), preguntar como reducir el batch size y activar gradient checkpointing
- Pedir el codigo para hacer inferencia en lote (batch inference) de manera eficiente para 10,000 tweets por hora

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Por que BERT/BETO supera a LSTM para tareas de clasificacion de texto corto
- Que es el fine-tuning y como se diferencia de entrenar desde cero
- Que informacion adicional aporta el token [CLS] de BERT para clasificacion
- Como el sarcasmo e ironia son el mayor desafio para cualquier modelo de sentimiento

## Reto Extra

Implementa analisis de sentimiento a nivel de aspecto (Aspect-Based Sentiment Analysis, ABSA). En lugar de "el tweet es negativo", identifica que el aspecto "precio" es negativo pero "atencion" es positivo en el mismo tweet: "Los precios estan por las nubes pero el personal es muy amable en el Supermaxi del norte". Usa el modelo `pysentimiento/robertuito-absa-es` de HuggingFace. Clasifica 20 tweets multi-aspecto y genera un dashboard con la percepcion por aspecto (precio, calidad, servicio, variedad, ubicacion).
