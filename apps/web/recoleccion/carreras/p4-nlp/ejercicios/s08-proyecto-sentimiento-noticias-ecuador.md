# Ejercicio Sesion 8: Proyecto — Analizar Sentimiento de Noticias Ecuador

**Materia:** Procesamiento de Lenguaje Natural
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 60 min

## Objetivo

Construir un pipeline NLP completo de extremo a extremo que recolecte noticias ecuatorianas en tiempo real, aplique analisis de sentimiento con transformers, identifique entidades nombradas y genere un dashboard interactivo de "pulso informativo" del Ecuador. Este es un producto de inteligencia de medios real.

## Contexto (Ecuador)

Una consultora politica necesita monitorear la percepcion mediatica del gobierno ecuatoriano en tiempo real. Medios como El Comercio, Primicias, La Hora y GK publican decenas de noticias diarias. El sistema debe responder: Cual es el tono predominante del dia? Que actores (personas, instituciones) generan noticias negativas? Que temas dominan? Este es el producto final del periodo NLP.

## Instrucciones

### Parte 1: Recoleccion de Datos (15 min)

1. Abre Google Colab. Configura la recoleccion de noticias con NewsAPI (gratis hasta 100 req/dia):
   ```python
   !pip install newsapi-python requests beautifulsoup4 plotly wordcloud
   from newsapi import NewsApiClient

   # Crea cuenta gratuita en newsapi.org
   api = NewsApiClient(api_key='tu-api-key-gratuita')

   # Busca noticias de Ecuador en espanol
   noticias_raw = api.get_everything(
       q='Ecuador',
       language='es',
       from_param='2025-03-01',
       to='2025-03-25',
       sort_by='publishedAt',
       page_size=100
   )
   ```

   Si no tienes NewsAPI, usa el dataset alternativo: crea 80 noticias sinteticas clasificadas manualmente distribuidas en 8 temas (politica, economia, seguridad, salud, deportes, cultura, tecnologia, ambiente).

2. Extrae y limpia los datos:
   ```python
   import pandas as pd

   df = pd.DataFrame([{
       'titulo': n['title'],
       'descripcion': n['description'],
       'fuente': n['source']['name'],
       'fecha': n['publishedAt'],
       'url': n['url'],
       'texto': f"{n['title']}. {n['description'] or ''}"
   } for n in noticias_raw['articles'] if n['title'] and n['description']])

   df['fecha'] = pd.to_datetime(df['fecha'])
   df = df.dropna(subset=['texto']).reset_index(drop=True)
   print(f"Noticias recolectadas: {len(df)}")
   ```

### Parte 2: Analisis NLP (25 min)

3. Analisis de sentimiento con transformers:
   ```python
   from transformers import pipeline
   import torch

   sentiment_pipe = pipeline(
       "sentiment-analysis",
       model="nlptown/bert-base-multilingual-uncased-sentiment",
       device=0 if torch.cuda.is_available() else -1,
       truncation=True, max_length=512
   )

   # Procesa en lotes para eficiencia
   def get_sentiment_batch(textos, batch_size=16):
       results = []
       for i in range(0, len(textos), batch_size):
           batch = textos[i:i+batch_size]
           preds = sentiment_pipe(batch)
           results.extend(preds)
       return results

   predictions = get_sentiment_batch(df['texto'].tolist())

   # Convierte estrellas (1-5) a categorias
   def stars_to_sentiment(label):
       stars = int(label[0])
       if stars <= 2: return 'negativo'
       elif stars == 3: return 'neutro'
       else: return 'positivo'

   df['sentimiento'] = [stars_to_sentiment(p['label']) for p in predictions]
   df['confianza'] = [p['score'] for p in predictions]
   ```

4. NER para extraer actores:
   ```python
   import spacy
   nlp = spacy.load('es_core_news_lg')

   def extraer_entidades(texto):
       doc = nlp(texto[:500])
       return {
           'personas': [e.text for e in doc.ents if e.label_ == 'PER'],
           'organizaciones': [e.text for e in doc.ents if e.label_ == 'ORG'],
           'lugares': [e.text for e in doc.ents if e.label_ == 'LOC']
       }

   df['entidades'] = df['texto'].apply(extraer_entidades)
   ```

5. Clasificacion de temas con zero-shot:
   ```python
   clasificador = pipeline("zero-shot-classification",
                            model="facebook/bart-large-mnli",
                            device=0)
   temas = ['politica', 'economia', 'seguridad', 'salud',
            'deportes', 'cultura', 'tecnologia', 'ambiente']

   def clasificar_tema(texto):
       resultado = clasificador(texto[:200], temas, multi_label=False)
       return resultado['labels'][0]

   df['tema'] = df['texto'].apply(clasificar_tema)
   ```

### Parte 3: Dashboard Interactivo (20 min)

6. Construye el dashboard con Plotly:
   ```python
   import plotly.express as px
   import plotly.graph_objects as go
   from plotly.subplots import make_subplots

   fig = make_subplots(
       rows=2, cols=2,
       subplot_titles=["Sentimiento por Tema", "Evolucion Temporal",
                       "Top Personas Mencionadas", "Top Organizaciones"]
   )

   # Grafico 1: Sentimiento por tema (barra apilada)
   sent_tema = df.groupby(['tema','sentimiento']).size().reset_index(name='count')
   # ...

   # Grafico 2: Evolucion del sentimiento por dia
   df['dia'] = df['fecha'].dt.date
   sent_dia = df.groupby(['dia','sentimiento']).size().reset_index(name='count')
   # ...

   # Grafico 3: Personas mas mencionadas con sentimiento promedio
   # Explota la columna de personas y agrupa
   # ...

   fig.update_layout(title="Pulso Informativo Ecuador - Dashboard NLP",
                     height=800, template="plotly_dark")
   fig.show()
   ```

7. Genera un resumen ejecutivo automatico con el LLM:
   ```python
   from langchain_google_genai import ChatGoogleGenerativeAI

   llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.5)

   stats = f"""
   Total noticias analizadas: {len(df)}
   Distribucion sentimiento: {df['sentimiento'].value_counts().to_dict()}
   Tema mas negativo: {df[df['sentimiento']=='negativo']['tema'].mode()[0]}
   Persona mas mencionada: [extraer del analisis NER]
   """

   resumen = llm.invoke(f"""Eres analista politico ecuatoriano. Basado en estas estadisticas
   de noticias del periodo {df['dia'].min()} al {df['dia'].max()}, escribe un resumen ejecutivo
   de 150 palabras para presentar a directivos:

   {stats}

   Resumen ejecutivo:""")
   print(resumen.content)
   ```

## Usa IA para...

- Pedirle a Claude que revise el pipeline completo y sugiera 3 mejoras tecnicas para produccion (manejo de errores, escalabilidad, actualizacion incremental)
- Pedirle a ChatGPT que escriba la narrativa del dashboard: como presentar estos resultados a un cliente no tecnico de consultoria politica
- Preguntar como convertir este proyecto en un producto SaaS: arquitectura, costos estimados, y cuanto cobrar por el servicio en el mercado ecuatoriano
- Generar el pitch de 1 minuto para presentar este producto a potenciales clientes (medios de comunicacion, partidos politicos, empresas)

## Que aprendiste

Al terminar este proyecto integrador debes poder:
- Construir un pipeline NLP de produccion que va de datos crudos a insights accionables
- Combinar multiples tecnicas (tokenizacion, embeddings, transformers, NER, clasificacion) en un flujo coherente
- Visualizar resultados NLP de manera que sean comprensibles para decision-makers no tecnicos
- Estimar el costo y arquitectura de escalar este sistema a 10,000 noticias/dia en produccion

## Reto Extra

Agrega un modulo de "deteccion de fake news" usando el modelo `mrm8488/bert-tiny-finetuned-fake-news-detection`. Para cada noticia, calcula la probabilidad de ser fake y agrega una columna `riesgo_desinformacion`. Implementa un sistema de alertas: si una noticia tiene >70% de probabilidad de ser falsa Y tiene sentimiento muy negativo Y menciona al presidente, genera una alerta automatica por email usando `smtplib`. Este modulo simula un sistema de monitoreo de desinformacion para sala de situacion gubernamental.
