# Ejercicio Sesion 2: NLP Avanzado con Transformers

**Materia:** Machine Learning Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Aplicar modelos Transformer pre-entrenados con Hugging Face para NLP en espanol: clasificacion de sentimientos en redes sociales ecuatorianas, extraccion de entidades NER en noticias economicas, y resumen automatico de informes de la Superintendencia de Companias — sin entrenar desde cero.

## Contexto

El BCE Ecuador monitorea el sentimiento en redes sociales para anticipar cambios en confianza del consumidor. La Superintendencia de Companias recibe 1,200 informes anuales de 50+ paginas — imposibles de leer manualmente. Los Transformers (BERT, RoBERTa, T5) en espanol permiten clasificar, extraer y resumir texto con precision de nivel humano usando modelos pre-entrenados en minutos, no semanas de entrenamiento.

## Instrucciones

1. Instala: `pip install transformers torch`.

2. Crea el archivo `sesion02_nlp_transformers_ecuador.py`:

```python
# NLP Avanzado + Transformers - ITSEIA
# Machine Learning Avanzado
# Texto economico Ecuador: sentimiento, NER, resumen

import pandas as pd
import numpy as np
import json
import re
from datetime import datetime
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("NLP AVANZADO + TRANSFORMERS — TEXTO ECONOMICO ECUADOR")
print("=" * 65)

# ================================================
# SECCION 1: PIPELINE HUGGING FACE (CONCEPTOS)
# ================================================
print("\n--- ARQUITECTURA TRANSFORMER ---")

arquitectura = {
    "Tokenizer":    "Divide texto en tokens — wordpiece o BPE. 'inflacion' → ['in','##fla','##cion']",
    "Embeddings":   "Token + posicion + segmento → vector 768 dims (BERT-base)",
    "Attention":    "Calcula relevancia entre todos los tokens en paralelo — O(n^2)",
    "BERT":         "Bidireccional — lee contexto izquierda Y derecha simultaneamente",
    "GPT":          "Autoregresivo — solo lee contexto izquierdo (causal)",
    "Fine-tuning":  "Agregar capa de clasificacion + entrenar con tus datos (pocos ejemplos bastan)",
    "Zero-shot":    "Clasificar sin ejemplos propios — usando modelos de lenguaje masivos",
}

for k, v in arquitectura.items():
    print(f"  {k:<14}: {v}")

# ================================================
# SECCION 2: DATOS DE TEXTO ECUADOR
# ================================================
print("\n--- DATASET: TEXTOS ECONOMICOS ECUADOR ---")

tweets_economia = [
    ("El precio del banano sube 15% en mercados mayoristas de Guayas — exportadores contentos", "positivo"),
    ("IESS no tiene fondos para pagar pensiones en diciembre segun informe actuarial filtrado", "negativo"),
    ("BCE baja tasa de referencia a 8.5% para estimular credito productivo en PYMES", "positivo"),
    ("Supermaxi y TIA reportan escasez de productos basicos por paro transportistas", "negativo"),
    ("Ecuador firma TLC con Union Europea — 800 empresas beneficiadas con cero arancel", "positivo"),
    ("SRI recauda $12.3 millones adicionales por operativo contra evasion en Pichincha", "neutro"),
    ("Quiebra de Banco XYZ genera panico entre ahorristas en Quito y Guayaquil", "negativo"),
    ("Nuevo parque industrial en Yachay generara 5,000 empleos directos en sector tech", "positivo"),
    ("Remesas caen 8% en Q3 por desaceleracion economia EEUU segun datos BCE", "negativo"),
    ("INEC reporta inflacion de 0.3% en octubre — estabilidad de precios continua", "neutro"),
    ("Inversiones en petroleo del Bloque 43-ITT suspendidas por fallo constitucional", "negativo"),
    ("Exportaciones no petroleras crecen 12% gracias a acuerdo comercial con China", "positivo"),
    ("Desempleo juvenil alcanza 18% segun ENEMDU — peor dato desde pandemia", "negativo"),
    ("Dolares de remesas impulsan consumo en provincias costeras: comercio crece 9%", "positivo"),
    ("Correa impugna acuerdo con FMI: dice que condiciones atentan contra soberania", "negativo"),
]

noticias_supercias = [
    {
        "empresa": "Corporacion Favorita C.A.",
        "texto": """La empresa reporto ingresos por USD 2.8 billones en el ejercicio fiscal 2024,
        representando un crecimiento del 7.3% respecto al ano anterior. El margen EBITDA
        se mantuvo en 8.2%. Se realizaron inversiones en infraestructura logistica por
        USD 45 millones en los centros de distribucion de Quito y Guayaquil.
        El directorio aprobo la distribucion de dividendos de USD 0.85 por accion.
        La compania emplea a 18,500 personas a nivel nacional.""",
    },
    {
        "empresa": "Banco Pichincha C.A.",
        "texto": """Los activos totales del banco alcanzaron USD 12.4 billones al cierre de 2024,
        con una cartera de credito de USD 8.1 billones. El indice de morosidad se situo en
        3.2%, por debajo del promedio del sistema financiero nacional de 3.8%.
        El ROE fue de 12.4% y el ROA de 1.1%. Se abrieron 35 nuevas agencias en zonas rurales
        como parte del programa de inclusion financiera. La calificacion de riesgo
        se mantiene en A+ segun Fitch Ratings.""",
    },
]

print(f"  Tweets economia Ecuador: {len(tweets_economia)}")
print(f"  Informes Supercias:      {len(noticias_supercias)}")

# ================================================
# SECCION 3: CLASIFICACION SENTIMIENTOS (SIMULADO)
# ================================================
print("\n--- CLASIFICACION DE SENTIMIENTOS (Transformer simulado) ---")

class SimuladorTransformerSentimiento:
    """
    Simula pysentimiento o roberta-base-sentiment-analysis.
    En produccion: pipeline('sentiment-analysis', model='pysentimiento/robertuito-sentiment-analysis')
    """
    PALABRAS_POS = ["sube","crece","mejora","firma","genera","impulsa",
                    "crecimiento","beneficiada","estimular","adicionales"]
    PALABRAS_NEG = ["cae","quiebra","escasez","panico","filtrado","impugna",
                    "suspendidas","desempleo","caen","fondos"]

    def __init__(self):
        self.modelo = "pysentimiento/robertuito-sentiment-analysis"

    def predecir(self, texto):
        texto_lower = texto.lower()
        score_pos = sum(1 for p in self.PALABRAS_POS if p in texto_lower)
        score_neg = sum(1 for p in self.PALABRAS_NEG if p in texto_lower)

        if score_pos > score_neg:
            return {"label": "POS", "score": 0.70 + score_pos * 0.05}
        elif score_neg > score_pos:
            return {"label": "NEG", "score": 0.70 + score_neg * 0.05}
        else:
            return {"label": "NEU", "score": 0.65}

    def batch_predecir(self, textos):
        return [self.predecir(t) for t in textos]

modelo_sentimiento = SimuladorTransformerSentimiento()

print(f"\n  Modelo: {modelo_sentimiento.modelo}")
print(f"  {'Texto (primeros 60 chars)':<62} {'Pred':>5} {'Score':>7} {'Real':>10}")
print(f"  {'-'*88}")

resultados = []
for texto, label_real in tweets_economia:
    pred = modelo_sentimiento.predecir(texto)
    correcto = (
        (pred["label"] == "POS" and label_real == "positivo") or
        (pred["label"] == "NEG" and label_real == "negativo") or
        (pred["label"] == "NEU" and label_real == "neutro")
    )
    resultados.append({
        "texto": texto[:60],
        "pred": pred["label"],
        "score": pred["score"],
        "real": label_real,
        "correcto": correcto,
    })
    icono = "OK" if correcto else "!!"
    print(f"  [{icono}] {texto[:60]:<62} {pred['label']:>5} {pred['score']:>7.3f} {label_real:>10}")

accuracy = sum(r["correcto"] for r in resultados) / len(resultados)
print(f"\n  Accuracy:  {accuracy*100:.0f}%")

# ================================================
# SECCION 4: NER — EXTRACCION DE ENTIDADES
# ================================================
print("\n--- NER: EXTRACCION DE ENTIDADES ECONOMICAS ---")

class SimuladorNER:
    """
    Simula dslim/bert-base-NER o modelo NER en espanol.
    En produccion: pipeline('ner', model='dslim/bert-base-NER', grouped_entities=True)
    """
    ORGANIZACIONES = ["BCE","INEC","SRI","IESS","MSP","Supermaxi","Banco Pichincha",
                       "Corporacion Favorita","BancoEstado","CNT","ENAMI"]
    PERSONAS = ["Noboa","Correa","Lasso","Arauz","Herrera"]
    LUGARES  = ["Ecuador","Quito","Guayaquil","Pichincha","Guayas","Azuay",
                "Cuenca","Manabi","Loja","Esmeraldas"]
    VALORES  = re.compile(r"USD?\s*[\d,]+\.?\d*\s*(millones|billones|mil)?|[\d,]+%|\d+\.\d+%")

    def extraer(self, texto):
        entidades = []
        for org in self.ORGANIZACIONES:
            if org.lower() in texto.lower():
                entidades.append({"entidad": org, "tipo": "ORG", "confianza": 0.95})
        for per in self.PERSONAS:
            if per.lower() in texto.lower():
                entidades.append({"entidad": per, "tipo": "PER", "confianza": 0.92})
        for loc in self.LUGARES:
            if loc.lower() in texto.lower():
                entidades.append({"entidad": loc, "tipo": "LOC", "confianza": 0.93})
        for match in self.VALORES.findall(texto):
            entidades.append({"entidad": match.strip(), "tipo": "VALOR", "confianza": 0.98})
        return entidades

ner = SimuladorNER()

texto_noticia = """El Banco Central del Ecuador (BCE) reporto que las remesas enviadas
por ecuatorianos en EEUU alcanzaron USD 1.210 millones en Q1 2024, un crecimiento del 3.2%
frente al mismo periodo de 2023. El Ministro Herrera anuncio que Quito recibirá inversiones
por USD 45 millones en infraestructura digital."""

entidades = ner.extraer(texto_noticia)
print(f"\n  Texto analizado: '{texto_noticia[:80]}...'")
print(f"\n  Entidades extraidas:")
for e in entidades:
    print(f"    [{e['tipo']:<6}] {e['entidad']:<30} confianza: {e['confianza']}")

# ================================================
# SECCION 5: RESUMEN AUTOMATICO (Extractivo)
# ================================================
print("\n--- RESUMEN AUTOMATICO DE INFORMES ---")

class ResumenExtractivo:
    """
    Simula modelo T5/BART para resumen.
    En produccion: pipeline('summarization', model='mrm8488/bert2bert_shared-spanish-finetuned-summarization')
    Aqui implementamos resumen extractivo con TF-IDF.
    """
    STOP_WORDS = {"el","la","los","las","un","una","de","del","en","y","a","que",
                  "por","con","su","sus","se","al","fue","es","son","ha","han"}

    def puntuar_oracion(self, oracion, freq_palabras):
        palabras = re.findall(r'\w+', oracion.lower())
        palabras_content = [p for p in palabras if p not in self.STOP_WORDS and len(p) > 3]
        if not palabras_content:
            return 0
        return sum(freq_palabras.get(p, 0) for p in palabras_content) / len(palabras_content)

    def resumir(self, texto, n_oraciones=3):
        oraciones = re.split(r'[.!?]\s+', texto.strip())
        oraciones = [o.strip() for o in oraciones if len(o) > 20]

        # Frecuencia de palabras
        todas = re.findall(r'\w+', texto.lower())
        freq = {}
        for p in todas:
            if p not in self.STOP_WORDS and len(p) > 3:
                freq[p] = freq.get(p, 0) + 1

        puntuaciones = [(o, self.puntuar_oracion(o, freq)) for o in oraciones]
        ordenadas    = sorted(puntuaciones, key=lambda x: x[1], reverse=True)
        seleccionadas = [o for o, _ in ordenadas[:n_oraciones]]

        return ". ".join(seleccionadas) + "."

resumidor = ResumenExtractivo()

for informe in noticias_supercias:
    resumen = resumidor.resumir(informe["texto"], n_oraciones=2)
    n_original = len(informe["texto"].split())
    n_resumen  = len(resumen.split())
    print(f"\n  Empresa: {informe['empresa']}")
    print(f"  Reduccion: {n_original} palabras → {n_resumen} palabras ({n_resumen/n_original*100:.0f}%)")
    print(f"  Resumen: {resumen}")

# ================================================
# SECCION 6: ZERO-SHOT CLASSIFICATION
# ================================================
print("\n--- ZERO-SHOT CLASSIFICATION ---")
print("  Clasifica sin ejemplos de entrenamiento propios")
print("  En produccion: pipeline('zero-shot-classification', model='facebook/bart-large-mnli')")

class SimuladorZeroShot:
    """Simula zero-shot con palabras clave por clase."""

    def clasificar(self, texto, clases):
        scores = {}
        for clase in clases:
            palabras_clase = clase.lower().replace("_"," ").split()
            score = sum(1 for p in palabras_clase if p in texto.lower()) / len(palabras_clase)
            score += np.random.uniform(0, 0.3)
            scores[clase] = round(score, 3)

        total = sum(scores.values()) + 1e-9
        return {k: round(v/total, 3) for k, v in sorted(scores.items(),
                                                          key=lambda x: x[1], reverse=True)}

zs = SimuladorZeroShot()
clases_noticia = ["politica_economica","mercado_laboral","sector_financiero",
                   "comercio_exterior","sector_agricola"]

print(f"\n  Noticias → categorias automaticas (sin entrenamiento):")
for texto, _ in tweets_economia[:5]:
    clasificacion = zs.clasificar(texto, clases_noticia)
    mejor_clase = list(clasificacion.keys())[0]
    mejor_score = list(clasificacion.values())[0]
    print(f"  {texto[:55]:<55} → {mejor_clase} ({mejor_score:.2f})")

print("\n" + "=" * 65)
print("NLP TRANSFORMERS — CONCEPTOS CLAVE:")
print("  Transformer:    atencion multi-cabeza — captura dependencias largas")
print("  BERT:           bidireccional — entiende contexto completo")
print("  Fine-tuning:    adaptar modelo pre-entrenado con pocos ejemplos")
print("  Zero-shot:      clasificar sin datos etiquetados propios")
print("  NER:            extraer entidades nombradas — ORG, PER, LOC, VALOR")
print("  Resumen:        extractivo (selecciona) vs abstractivo (genera)")
print("=" * 65)
```

3. Implementa la busqueda semantica: dado "quiero invertir en Ecuador", encuentra los 3 tweets mas similares usando embeddings de oraciones (sentence-transformers) con similitud coseno.

4. Agrega el detector de fake news economicas: clasifica si un titular es verdadero o falso usando un conjunto de reglas heuristicas sobre montos, porcentajes y entidades conocidas.

## Usa IA para...

> Abre Claude y escribe:
> "Trabajo en el BCE Ecuador y quiero construir un sistema de monitoreo de sentimiento economico en tiempo real. Tenemos 10,000 tweets diarios en espanol sobre economia ecuatoriana. ¿Como implemento: 1) un pipeline de clasificacion con pysentimiento/robertuito que corra en AWS Lambda (< 500ms por tweet), 2) fine-tuning del modelo con 500 tweets etiquetados propios del BCE para mejorar precision en jerga financiera ecuatoriana ('riesgo pais', 'bonos soberaños', 'dolarizacion'), 3) dashboard en tiempo real con el indice de sentimiento agregado por hora? Dame el codigo de fine-tuning con Trainer de Hugging Face y las metricas de evaluacion correctas para clasificacion de 3 clases."

Despues de leer la respuesta:
- Implementa el loop de fine-tuning simplificado con los datos del BCE.
- Calcula el macro F1 antes y despues del fine-tuning.

## Que aprendiste

- Los Transformers usan atencion multi-cabeza para capturar dependencias entre palabras a cualquier distancia.
- BERT pre-entrenado en espanol (BETO, RoBERTuito) ya entiende jerga economica latinoamericana.
- Fine-tuning con 500-1000 ejemplos propios supera modelos entrenados desde cero con 50,000.
- Zero-shot classification permite categorizar texto sin datos de entrenamiento — valioso para casos nuevos.
- NER extrae automaticamente entidades economicas (montos, organizaciones, paises) de noticias.
- El resumen extractivo selecciona oraciones clave; el abstractivo las genera — T5/BART para el segundo.

## Reto extra

Construye el observatorio de opinion economica del Ecuador para el BCE: pipeline Kafka que ingesta 10,000 tweets/dia en tiempo real, clasificacion de sentimiento con RoBERTuito en GPU (AWS g4dn.xlarge), NER para extraer entidades y montos, agregacion por hora del indice de sentimiento (0-100), correlacion semanal con indicadores reales (inflacion, tipo de cambio Colombia, precio petroleo), y dashboard Streamlit con mapa de calor por provincia del sentimiento economico. Alerta automatica cuando el sentimiento cae > 2 desviaciones estandar.
