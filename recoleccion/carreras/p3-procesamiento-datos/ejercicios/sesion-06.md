# Ejercicio Sesion 6: Procesamiento de Texto y NLP Basico

**Materia:** Procesamiento de Datos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Aplicar tecnicas basicas de procesamiento de lenguaje natural (NLP) para analizar texto no estructurado: tokenizacion, stopwords, frecuencia de terminos, TF-IDF, analisis de sentimientos con VADER, y extraccion de entidades, sobre noticias economicas y redes sociales ecuatorianas.

## Contexto

El 80% de los datos del mundo son no estructurados (texto, audio, imagen). En Ecuador, el SRI recibe solicitudes en texto libre, los bancos procesan contratos en PDF, y las redes sociales generan millones de opiniones sobre productos. NLP permite convertir ese texto en datos estructurados analizables.

## Instrucciones

1. Instala: `pip install nltk textblob vaderSentiment scikit-learn`.

2. Crea el archivo `sesion06_nlp_basico_ecuador.py`:

```python
# NLP Basico - ITSEIA Procesamiento de Datos
# Tokenizacion, TF-IDF, Sentimientos, Entidades
# Corpus: noticias economicas Ecuador

import pandas as pd
import numpy as np
import re
from collections import Counter
import warnings
warnings.filterwarnings("ignore")

print("=" * 65)
print("NLP BASICO — NOTICIAS ECONOMICAS ECUADOR")
print("=" * 65)

# ================================================
# CORPUS: NOTICIAS ECONOMICAS ECUADOR
# ================================================
noticias = [
    {
        "id": 1, "fecha": "2024-03-01",
        "titulo": "Exportaciones de banano ecuatoriano crecen 12% en 2024",
        "cuerpo": "Ecuador incremento sus exportaciones de banano a un precio record. "
                  "El Ministerio de Agricultura reporto que las ventas al exterior "
                  "alcanzaron 380 millones de cajas, generando 2.800 millones de dolares. "
                  "Los principales destinos son Europa, Rusia y China. "
                  "Los productores de Los Rios y El Oro lideraron el crecimiento.",
        "fuente": "El Comercio", "categoria": "exportaciones"
    },
    {
        "id": 2, "fecha": "2024-03-05",
        "titulo": "Banco Pichincha lanza credito hipotecario al 8.5% para jovenes",
        "cuerpo": "El Banco Pichincha presento su nuevo producto financiero para personas "
                  "entre 25 y 35 anos. La tasa del 8.5% anual es la mas baja del mercado "
                  "ecuatoriano. Los prestamos van desde 50.000 hasta 150.000 dolares "
                  "con un plazo de hasta 20 anos. Los clientes deben tener ingresos "
                  "demostrables y buen historial crediticio en el buro de credito.",
        "fuente": "Primicias", "categoria": "finanzas"
    },
    {
        "id": 3, "fecha": "2024-03-10",
        "titulo": "INEC reporta desempleo de 3.9% en Ecuador — minimo historico",
        "cuerpo": "El Instituto Nacional de Estadistica y Censos publico la Encuesta "
                  "Nacional de Empleo. La tasa de desempleo bajo al 3.9%, el nivel mas "
                  "bajo desde 2014. Sin embargo, el subempleo afecta al 18.3% de la "
                  "poblacion economicamente activa. Quito y Guayaquil concentran el "
                  "mayor porcentaje de empleados adecuados. El sector tecnologia "
                  "y servicios lidera la generacion de empleo formal.",
        "fuente": "El Universo", "categoria": "empleo"
    },
    {
        "id": 4, "fecha": "2024-03-15",
        "titulo": "Petroecuador reduce produccion por conflicto social en Amazonia",
        "cuerpo": "Petroecuador anuncio una reduccion del 15% en la produccion de "
                  "petroleo crudo debido a bloqueos en la provincia de Orellana. "
                  "Comunidades indigenas exigen mejoras en infraestructura y "
                  "compensaciones ambientales. El gobierno declaro estado de emergencia "
                  "en el sector hidrocarburifero. La produccion bajo de 510.000 a "
                  "433.000 barriles diarios. El precio del crudo Oriente se ubica en $72.",
        "fuente": "Ecuavisa", "categoria": "energia"
    },
    {
        "id": 5, "fecha": "2024-03-20",
        "titulo": "Startup ecuatoriana de inteligencia artificial recauda 2 millones",
        "cuerpo": "Una startup de Quito dedicada a inteligencia artificial para el "
                  "sector salud recaudo 2 millones de dolares en ronda seed. "
                  "La empresa desarrolla algoritmos de diagnostico medico usando "
                  "machine learning y redes neuronales. Ya tiene contratos con "
                  "clinicas en Quito, Guayaquil y Cuenca. El CEO manifesto que "
                  "el dinero se usara para contratar ingenieros y expandirse a Colombia y Peru.",
        "fuente": "Primicias", "categoria": "tecnologia"
    },
    {
        "id": 6, "fecha": "2024-03-22",
        "titulo": "El PIB ecuatoriano crecera 2.4% segun proyecciones del BCE",
        "cuerpo": "El Banco Central del Ecuador actualizo sus proyecciones de crecimiento "
                  "economico. El PIB crecera 2.4% en 2024, impulsado por exportaciones "
                  "de petroleo, banano y camaron. La inflacion anual se mantiene en 1.82%, "
                  "una de las mas bajas de America Latina. Sin embargo, la deuda publica "
                  "representa el 58% del PIB, lo que limita el gasto fiscal del gobierno.",
        "fuente": "El Comercio", "categoria": "macroeconomia"
    },
]

df = pd.DataFrame(noticias)
print(f"Corpus: {len(df)} noticias | Fuentes: {df['fuente'].nunique()} | Categorias: {df['categoria'].nunique()}")

# ================================================
# LIMPIEZA Y TOKENIZACION
# ================================================
print("\n--- TOKENIZACION Y LIMPIEZA ---")

STOPWORDS_ES = {
    "de","la","el","en","y","a","los","del","las","un","por","con","una",
    "su","es","se","que","al","lo","le","da","que","para","como","pero",
    "sus","sin","sobre","entre","ha","ya","fue","son","mas","hay","todo",
    "esta","este","han","les","nos","etc","si","no","o","e"
}

def limpiar_texto(texto):
    """Normaliza texto para NLP."""
    texto = texto.lower()
    texto = re.sub(r'[^a-zñáéíóú\s]', ' ', texto)
    texto = re.sub(r'\s+', ' ', texto).strip()
    return texto

def tokenizar(texto, quitar_stopwords=True):
    """Tokeniza y filtra stopwords."""
    tokens = limpiar_texto(texto).split()
    if quitar_stopwords:
        tokens = [t for t in tokens if t not in STOPWORDS_ES and len(t) > 2]
    return tokens

df["texto_completo"] = df["titulo"] + " " + df["cuerpo"]
df["tokens"] = df["texto_completo"].apply(tokenizar)
df["num_tokens"] = df["tokens"].apply(len)

print("  Tokens por noticia:")
for _, row in df.iterrows():
    print(f"  [{row['id']}] {row['titulo'][:50]:<50} | {row['num_tokens']} tokens")

# ================================================
# FRECUENCIA DE TERMINOS
# ================================================
print("\n--- TERMINOS MAS FRECUENTES ---")

todos_tokens = [t for tokens in df["tokens"] for t in tokens]
frecuencia = Counter(todos_tokens)
print("  Top 20 terminos en el corpus:")
for termino, freq in frecuencia.most_common(20):
    barra = "#" * freq
    print(f"  {termino:<20}: {barra} ({freq})")

# Por categoria
print("\n  Top 5 terminos por categoria:")
for cat in df["categoria"].unique():
    tokens_cat = [t for tokens in df[df["categoria"]==cat]["tokens"] for t in tokens]
    top5 = Counter(tokens_cat).most_common(5)
    print(f"  {cat:<16}: {[t for t,_ in top5]}")

# ================================================
# TF-IDF CON SKLEARN
# ================================================
print("\n--- TF-IDF: TERMINOS DISCRIMINANTES ---")
from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer(
    max_features=30,
    stop_words=list(STOPWORDS_ES),
    ngram_range=(1, 2),      # unigramas y bigramas
    min_df=1
)

corpus_limpio = df["texto_completo"].apply(limpiar_texto).tolist()
tfidf_matrix = vectorizer.fit_transform(corpus_limpio)
feature_names = vectorizer.get_feature_names_out()

df_tfidf = pd.DataFrame(
    tfidf_matrix.toarray(),
    columns=feature_names,
    index=df["titulo"].str[:40]
)

print(f"  Matriz TF-IDF: {tfidf_matrix.shape} (docs x terminos)")
print("\n  Terminos mas discriminantes por documento:")
for i, titulo in enumerate(df["titulo"]):
    scores = tfidf_matrix[i].toarray()[0]
    top3_idx = scores.argsort()[-3:][::-1]
    top3 = [(feature_names[j], round(scores[j], 3)) for j in top3_idx if scores[j] > 0]
    print(f"  [{i+1}] {titulo[:45]:<45}: {top3}")

# ================================================
# ANALISIS DE SENTIMIENTOS (VADER adaptado)
# ================================================
print("\n--- ANALISIS DE SENTIMIENTOS ---")

# Diccionario de sentimientos en espanol (simplificado)
POSITIVOS = {"crecen","crecera","record","bajo","lidera","lanza","recauda",
             "minimo","expansion","mejoras","lidera","incremento","mas baja",
             "gana","logra","exito","positivo","bueno","favorable","crece"}
NEGATIVOS = {"reduce","conflicto","bloqueos","emergencia","deuda","limita",
             "bajo","problemas","crisis","cae","disminuye","negativo","malo",
             "desempleo","subempleo","reduccion","baja"}

def analizar_sentimiento_simple(texto):
    """Clasificador de sentimiento basico por lexicon."""
    tokens = set(limpiar_texto(texto).split())
    pos = sum(1 for t in tokens if any(p in t for p in POSITIVOS))
    neg = sum(1 for t in tokens if any(n in t for n in NEGATIVOS))

    if pos > neg + 1:
        return "positivo", pos - neg
    elif neg > pos + 1:
        return "negativo", neg - pos
    else:
        return "neutral", 0

df[["sentimiento","score"]] = df["texto_completo"].apply(
    lambda x: pd.Series(analizar_sentimiento_simple(x))
)

print("  Sentimiento por noticia:")
for _, row in df.iterrows():
    emoji = "+" if row["sentimiento"]=="positivo" else ("-" if row["sentimiento"]=="negativo" else "=")
    print(f"  [{emoji}] {row['titulo'][:50]:<50} | {row['sentimiento']} (score: {row['score']})")

conteo_sent = df["sentimiento"].value_counts()
print(f"\n  Distribucion: {dict(conteo_sent)}")

# ================================================
# EXTRACCION DE ENTIDADES (NER SIMPLE)
# ================================================
print("\n--- EXTRACCION DE ENTIDADES (NER) ---")

ORGANIZACIONES = [
    "Banco Pichincha","BCE","INEC","Petroecuador","Banco Central",
    "Ministerio de Agricultura","MAGAP","SRI","Ecuavisa","El Comercio"
]
PROVINCIAS_EC = [
    "Pichincha","Guayas","Manabi","Los Rios","El Oro","Orellana",
    "Tungurahua","Azuay","Imbabura","Chimborazo"
]
CIUDADES_EC = ["Quito","Guayaquil","Cuenca","Ambato","Manta","Loja"]

def extraer_entidades(texto):
    """Extrae organizaciones, provincias y ciudades."""
    orgs      = [o for o in ORGANIZACIONES if o.lower() in texto.lower()]
    provincias = [p for p in PROVINCIAS_EC if p in texto]
    ciudades   = [c for c in CIUDADES_EC if c in texto]
    return {
        "organizaciones": orgs,
        "provincias": provincias,
        "ciudades": ciudades
    }

print("  Entidades extraidas por noticia:")
for _, row in df.iterrows():
    ent = extraer_entidades(row["texto_completo"])
    tiene = {k: v for k, v in ent.items() if v}
    if tiene:
        print(f"  [{row['id']}] {row['titulo'][:45]}")
        for tipo, vals in tiene.items():
            print(f"       {tipo}: {vals}")

# ================================================
# GUARDAR RESULTADOS
# ================================================
cols_guardar = ["id","fecha","fuente","categoria","titulo","num_tokens","sentimiento","score"]
df[cols_guardar].to_csv("noticias_nlp_procesadas.csv", index=False)
print(f"\n  Guardado: noticias_nlp_procesadas.csv")

print("\n" + "=" * 65)
print("NLP BASICO — TECNICAS DOMINADAS:")
print("  Tokenizacion:    texto → lista de tokens limpios")
print("  Stopwords:       eliminar palabras sin significado")
print("  TF-IDF:          pesar terminos por rareza en corpus")
print("  Sentimientos:    positivo/negativo/neutral por lexicon")
print("  NER simple:      extraer organizaciones y lugares")
print("=" * 65)
```

3. Amplía el corpus con 3 noticias adicionales sobre tecnologia en Ecuador extraidas de Primicias.ec o El Comercio.

4. Implementa la similitud coseno entre documentos usando la matriz TF-IDF para encontrar las 2 noticias mas similares entre si.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un corpus de noticias economicas de Ecuador en espanol. Necesito hacer analisis de sentimientos mas preciso que un simple lexicon. ¿Cual es la diferencia entre: 1) lexicon-based (VADER, SentimentIntensityAnalyzer), 2) modelo pre-entrenado en espanol (pysentimiento), y 3) zero-shot con GPT? Dame el codigo Python para los tres enfoques y compara los resultados en este texto: 'El Banco Central reporto inflacion de 1.82%, por debajo del promedio regional, pero la deuda publica limita el crecimiento'"

Despues de leer la respuesta:
- Implementa el enfoque con `pysentimiento` o similar.
- Compara los 3 resultados en las 6 noticias del ejercicio.

## Que aprendiste

- La tokenizacion convierte texto en unidades analizables; las stopwords son palabras sin valor semantico.
- TF-IDF pondera los terminos: alta frecuencia en documento + baja frecuencia en corpus = alta relevancia.
- `TfidfVectorizer(ngram_range=(1,2))` captura bigramas como "banco central" o "tasa activa".
- El NER (Named Entity Recognition) extrae nombres de personas, organizaciones y lugares del texto.
- El analisis de sentimientos por lexicon es rapido pero limitado; los modelos de ML son mas precisos.
- La similitud coseno entre vectores TF-IDF mide que tan semanticamente similares son dos documentos.

## Reto extra

Construye un monitor de noticias economicas Ecuador: ingesta el RSS de El Comercio y Primicias cada hora, aplica NLP (sentimiento + entidades + TF-IDF) a cada noticia nueva, y genera una alerta si detecta mas de 3 noticias negativas sobre el mismo sector en menos de 24 horas. Guarda el historial en SQLite y visualiza las tendencias de sentimiento por categoria con matplotlib.
