# Ejercicio Sesion 1: Tokenizacion, Stemming y Lematizacion en Espanol

**Materia:** Procesamiento de Lenguaje Natural
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 45 min

## Objetivo

Dominar las tecnicas de preprocesamiento de texto en espanol con NLTK y spaCy: tokenizacion a nivel de palabra y oracion, eliminacion de stopwords, stemming (Porter/Snowball) y lematizacion morfologica, entendiendo las diferencias y cuando aplicar cada tecnica.

## Contexto (Ecuador)

El Consejo Nacional Electoral (CNE) del Ecuador necesita procesar miles de quejas ciudadanas escritas en espanol durante las elecciones. Antes de cualquier analisis automatico, el texto crudo debe normalizarse. Las quejas vienen con jerga ecuatoriana, abreviaturas y errores ortograficos tipicos del lenguaje coloquial de Quito y Guayaquil.

## Instrucciones

1. Abre Google Colab. Instala las dependencias:
   ```python
   !pip install spacy nltk unidecode
   !python -m spacy download es_core_news_sm
   import nltk
   nltk.download('punkt')
   nltk.download('stopwords')
   nltk.download('wordnet')
   ```

2. Crea un corpus de 10 quejas electorales ecuatorianas (texto real o simulado):
   ```python
   quejas = [
       "El vocal de la junta receptora del voto en Quitumbe no me dejo votar pq dice q ya vote.",
       "Habian largas colas desde las 7h00 en el colegio Mejia del Centro Historico de Quito.",
       "Me robaron el voto!!! El delegado del CNE en Guayaquil no hacia nada.",
       "Los testigos del partido Pachakutik fueron expulsados sin motivo alguno segun el acta.",
       "La padron electoral tenia mi nombre mal escrito, me llamo Juan Pilatasig no Pilatazig.",
       # ... agrega 5 mas con jerga ecuatoriana
   ]
   ```

3. Implementa el pipeline de preprocesamiento paso a paso:

   **Paso 1: Normalizacion basica**
   ```python
   import re
   from unidecode import unidecode

   def normalizar(texto):
       texto = texto.lower()
       texto = unidecode(texto)       # Elimina tildes: aérea -> aerea
       texto = re.sub(r'[^a-z\s]', ' ', texto)  # Elimina puntuacion
       texto = re.sub(r'\s+', ' ', texto).strip()
       return texto
   ```

   **Paso 2: Tokenizacion con NLTK y spaCy (compara ambos)**
   ```python
   from nltk.tokenize import word_tokenize, sent_tokenize
   import spacy
   nlp = spacy.load('es_core_news_sm')

   # NLTK
   tokens_nltk = word_tokenize(texto, language='spanish')
   # spaCy
   doc = nlp(texto)
   tokens_spacy = [token.text for token in doc]
   ```

   **Paso 3: Eliminacion de stopwords**
   ```python
   from nltk.corpus import stopwords
   stop_es = set(stopwords.words('spanish'))
   # Agrega stopwords especificas de Ecuador:
   stop_ec = {'pq', 'xq', 'x', 'q', 'segun', 'habian', 'ahi'}
   stop_total = stop_es | stop_ec
   ```

   **Paso 4: Stemming con Snowball (espanol)**
   ```python
   from nltk.stem.snowball import SnowballStemmer
   stemmer = SnowballStemmer('spanish')
   stems = [stemmer.stem(t) for t in tokens_limpios]
   ```

   **Paso 5: Lematizacion con spaCy**
   ```python
   lemmas = [token.lemma_ for token in nlp(texto)
             if not token.is_stop and token.is_alpha]
   ```

4. Crea un DataFrame comparativo para cada queja con columnas: `texto_original`, `tokens`, `sin_stopwords`, `stems`, `lemmas`. Imprimelo con `df.to_string()`.

5. Analiza las diferencias: para la palabra "votando", el stem sera "vot" y el lemma sera "votar". Para "quejas" el stem es "quej" y el lemma es "queja". Identifica 5 casos donde lematizacion es mejor que stemming para este corpus electoral.

## Usa IA para...

- Pedirle a Claude que genere 10 quejas electorales mas realistas con jerga de distintas regiones del Ecuador (Sierra, Costa, Oriente)
- Preguntar cuando usar stemming vs lematizacion en un pipeline de produccion (trade-off velocidad vs precision)
- Si spaCy da lemmas incorrectos para palabras ecuatorianas (es posible con el modelo pequeno), preguntar como agregar vocabulario personalizado
- Pedir que genere una funcion `preprocess_pipeline(texto, nivel)` donde nivel puede ser 'basico', 'intermedio' o 'completo'

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Cual es la diferencia entre tokenizacion por regex, NLTK y spaCy y cuando usar cada una
- Por que el stemming puede generar tokens que no son palabras reales
- En que contextos la lematizacion es imprescindible (busqueda semantica, QA systems)
- Como las particularidades del espanol ecuatoriano (voseo, jerga, anglicismos) afectan el preprocesamiento

## Reto Extra

Descarga las 500 noticias de Ecuador del portal Primicias o El Comercio (o usa el API de News API con `country=ec, language=es`). Aplica el pipeline completo y genera una nube de palabras (WordCloud) de los lemmas mas frecuentes del ultimo mes. Colorea las palabras segun su frecuencia y excluye las 50 palabras mas comunes (que no son informativas). Interpreta: cuales son los temas dominantes en las noticias ecuatorianas del mes?
