# Ejercicio Sesion 2: Bag of Words y TF-IDF

**Materia:** Procesamiento de Lenguaje Natural
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion:** 50 min

## Objetivo

Implementar y comparar las representaciones vectoriales clasicas de texto: Bag of Words (BoW) y TF-IDF, entendiendo sus diferencias matematicas y aplicarlas a clasificacion de documentos con modelos de ML tradicionales, evaluando el impacto de cada representacion en la performance.

## Contexto (Ecuador)

El diario El Comercio de Quito tiene 20 años de archivo digital. Su equipo editorial necesita un sistema que clasifique automaticamente noticias en categorias: Politica, Economia, Deportes, Cultura, Tecnologia y Sucesos. Este clasificador automatico ahorra horas de trabajo manual de los editores. Vamos a construirlo.

## Instrucciones

1. Abre Google Colab. Crea el dataset de noticias ecuatorianas:
   ```python
   noticias = {
       'Politica': [
           "El presidente Noboa anuncio nuevas medidas de seguridad en Guayaquil frente al crimen organizado.",
           "La Asamblea Nacional debatio el presupuesto general del Estado para el proximo ano fiscal.",
           "El canciller ecuatoriano participo en la cumbre de la CELAC en Mexico.",
           # ... agrega 15 noticias por categoria (pide a ChatGPT que las genere)
       ],
       'Economia': [...],    # 18 noticias
       'Deportes': [...],    # 18 noticias
       'Cultura': [...],     # 18 noticias
       'Tecnologia': [...],  # 18 noticias
       'Sucesos': [...],     # 18 noticias
   }
   ```

2. Implementa BoW con CountVectorizer:
   ```python
   from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

   # BoW
   bow = CountVectorizer(
       max_features=1000,
       ngram_range=(1,2),   # unigrams + bigrams
       min_df=2,             # aparece en min 2 documentos
       strip_accents='unicode',
       analyzer='word'
   )
   X_bow = bow.fit_transform(corpus_train)

   # TF-IDF
   tfidf = TfidfVectorizer(
       max_features=1000,
       ngram_range=(1,2),
       min_df=2,
       sublinear_tf=True,   # aplica log(1+tf) en lugar de tf puro
       strip_accents='unicode'
   )
   X_tfidf = tfidf.fit_transform(corpus_train)
   ```

3. Para cada representacion, entrena 4 clasificadores:
   - Naive Bayes Multinomial: `MultinomialNB()`
   - Logistic Regression: `LogisticRegression(max_iter=1000, C=1.0)`
   - SVM Lineal: `LinearSVC(C=1.0)`
   - Random Forest: `RandomForestClassifier(n_estimators=100)`

   Usa `cross_val_score(cv=5)` para evaluar con accuracy y F1-macro.

4. Genera una tabla de resultados 4x2 (4 modelos x 2 representaciones). Identifica la combinacion ganadora.

5. Para el mejor modelo, analiza las features mas importantes por categoria:
   ```python
   # Para Logistic Regression, los coeficientes por clase
   for i, categoria in enumerate(clases):
       top_features = np.argsort(clf.coef_[i])[-10:]
       print(f"\n{categoria}: {[vocab[j] for j in top_features]}")
   ```
   Interpreta: tiene sentido que estas palabras sean las mas discriminativas?

6. Visualiza la matriz de confusion del mejor modelo con un heatmap de seaborn. Cuales categorias se confunden mas entre si?

## Usa IA para...

- Pedirle a ChatGPT que genere 108 noticias cortas (18 por categoria) realistas de medios ecuatorianos
- Preguntar que significa `sublinear_tf=True` matematicamente y cuando conviene activarlo
- Si Naive Bayes supera a Random Forest (es comun en NLP con BoW), preguntar por que: el teorema de Bayes + independencia condicional explica su eficiencia
- Pedir que explique la diferencia entre IDF con suavizado (sklearn default) vs IDF sin suavizado

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Por que TF-IDF generalmente supera a BoW simple para clasificacion de documentos
- Que informacion pierde BoW que los word embeddings recuperan
- Por que Naive Bayes es tan competitivo en texto a pesar de su supuesto de independencia
- Que es la "curse of dimensionality" en el contexto de un vocabulario de 50,000 palabras

## Reto Extra

Implementa TF-IDF con caracteres en lugar de palabras (`analyzer='char_wb'`, ngram_range=(3,5)). Este enfoque es robusto ante errores ortograficos y jerga porque trabaja con substrings. Compara su accuracy con el TF-IDF de palabras. En el corpus ecuatoriano con errores tipicos (q, xq, pq, gvn), el modelo de caracteres deberia ser mas robusto. Cuantifica la diferencia con un test con noticias que tienen errores intencionales.
