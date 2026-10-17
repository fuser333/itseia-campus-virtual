# Ejercicio Sesion 3: Word Embeddings — Word2Vec y GloVe

**Materia:** Procesamiento de Lenguaje Natural
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 55 min

## Objetivo

Entrenar embeddings Word2Vec desde cero sobre corpus ecuatoriano y usar embeddings pre-entrenados en espanol (GloVe, FastText), visualizando el espacio semantico con t-SNE y realizando operaciones algebraicas de analogias para demostrar que los vectores capturan significado.

## Contexto (Ecuador)

Imaginemos que el Banco Central del Ecuador quiere construir un motor de busqueda semantica para su biblioteca de documentos economicos. Necesita que "inflacion" y "precio" sean considerados similares aunque no aparezcan juntos. Los word embeddings resuelven esto. Vamos a entrenar embeddings sobre textos economicos ecuatorianos y explorar la geometria del significado.

## Instrucciones

1. Abre Google Colab con GPU T4. Instala gensim:
   ```python
   !pip install gensim
   from gensim.models import Word2Vec, FastText
   from gensim.models.keyedvectors import KeyedVectors
   ```

2. Construye el corpus. Opcion A (recomendada): usa Wikipedia en espanol (subset Ecuador) con el dataset `datasets` de HuggingFace:
   ```python
   from datasets import load_dataset
   wiki_es = load_dataset("wikipedia", "20220301.es", split="train",
                          streaming=True)
   # Filtra articulos que mencionen Ecuador
   corpus_ec = [art['text'] for art in wiki_es
                if 'Ecuador' in art['text']][:500]
   ```
   Opcion B: usa un corpus sintetico de 200 parrafos de economia ecuatoriana (generados con IA).

3. Preprocesa el corpus: tokeniza, elimina stopwords y normaliza. Genera la lista de listas para gensim:
   ```python
   sentences = [[w for w in word_tokenize(doc.lower(), language='spanish')
                 if w.isalpha() and w not in stop_es]
                for doc in corpus_ec]
   ```

4. Entrena Word2Vec en dos variantes:
   ```python
   # CBOW (Continuous Bag of Words)
   modelo_cbow = Word2Vec(sentences, vector_size=100, window=5,
                          min_count=3, workers=4, sg=0, epochs=20)

   # Skip-gram
   modelo_sg = Word2Vec(sentences, vector_size=100, window=5,
                        min_count=3, workers=4, sg=1, epochs=20)
   ```

5. Explora el espacio semantico:
   ```python
   # Palabras mas similares
   print(modelo_sg.wv.most_similar('ecuador', topn=10))
   print(modelo_sg.wv.most_similar('banco', topn=10))

   # Analogia: Quito es a Ecuador como Paris es a ___?
   resultado = modelo_sg.wv.most_similar(
       positive=['paris', 'ecuador'],
       negative=['quito'], topn=3
   )

   # Similitud coseno entre pares
   print(modelo_sg.wv.similarity('inflacion', 'precios'))
   print(modelo_sg.wv.similarity('rio', 'montana'))
   ```

6. Carga los embeddings FastText pre-entrenados en espanol (300d) desde el sitio oficial:
   ```python
   # Descarga solo los primeros 100K vectores para no saturar RAM
   !wget https://dl.fbaipublicfiles.com/fasttext/vectors-crawl/cc.es.300.vec.gz
   ft_vectors = KeyedVectors.load_word2vec_format(
       'cc.es.300.vec.gz', binary=False, limit=100000
   )
   ```

7. Visualiza con t-SNE los 200 vectores mas frecuentes del vocabulario ecuatoriano:
   ```python
   from sklearn.manifold import TSNE
   import matplotlib.pyplot as plt

   # Selecciona palabras de economia, politica, geografia Ecuador
   palabras_ec = ['quito', 'guayaquil', 'cuenca', 'petroleo', 'banana',
                  'sucre', 'dolar', 'banco', 'presidente', 'asamblea',
                  'galapagos', 'andino', 'amazonia', 'volcan', 'cacao', ...]

   vectors = np.array([modelo_sg.wv[w] for w in palabras_ec
                       if w in modelo_sg.wv])
   tsne = TSNE(n_components=2, perplexity=15, random_state=42)
   coords = tsne.fit_transform(vectors)
   # Grafica con scatter plot y anotaciones por categoria (color distinto)
   ```

## Usa IA para...

- Pedirle a Claude que explique intuitivamente (con analogia no matematica) por que `rey - hombre + mujer = reina` funciona en el espacio vectorial
- Preguntar la diferencia entre Word2Vec, GloVe y FastText: FastText maneja palabras fuera del vocabulario con subwords (crucial para el espanol con su morfologia rica)
- Si el corpus es pequeno y las analogias fallan, preguntar cuantos tokens minimos se recomiendan para entrenar embeddings de calidad (regla general: 1M tokens)
- Generar el codigo para calcular la similitud entre dos documentos completos usando el promedio de sus embeddings de palabras (document embedding by averaging)

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Por que los embeddings capturan significado que BoW/TF-IDF no puede capturar
- Cual es la diferencia arquitectonica entre CBOW y Skip-gram y para que corpus conviene cada uno
- Por que FastText es superior a Word2Vec para idiomas morfologicamente ricos (espanol, quechua)
- Que limitacion fundamental tienen todos los embeddings de palabra estaticos (Word2Vec, GloVe): no manejan polisemia (banco = institucion financiera vs banco = mueble)

## Reto Extra

Entrena embeddings Word2Vec sobre un corpus de tweets ecuatorianos (descarga con `snscrape` o usa un dataset de Kaggle de tweets en espanol). Compara las palabras mas similares a 'gobierno', 'economia' y 'futbol' en tu modelo vs en los embeddings pre-entrenados de FastText. Cuales diferencias ves? El corpus de Twitter refleja un registro informal (abreviaciones, emojis, jerga) que los modelos generales no capturan bien. Implementa una heuristica para mapear emojis a texto antes de entrenar.
