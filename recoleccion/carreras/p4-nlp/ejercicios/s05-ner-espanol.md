# Ejercicio Sesion 5: Named Entity Recognition (NER) en Espanol

**Materia:** Procesamiento de Lenguaje Natural
**Nivel:** Avanzado
**Herramienta IA:** Copilot
**Duracion:** 55 min

## Objetivo

Implementar reconocimiento de entidades nombradas (NER) en espanol con spaCy y modelos pre-entrenados de HuggingFace, identificando personas, organizaciones, lugares y fechas en textos ecuatorianos. Comparar el modelo generico con un modelo fine-tuneado para el dominio juridico ecuatoriano.

## Contexto (Ecuador)

La Fiscalia General del Estado del Ecuador procesa miles de documentos juridicos (denuncias, actas, resoluciones) al dia. Extraer automaticamente los nombres de personas involucradas, instituciones, fechas de hechos y lugares del delito acelera drasticamente el trabajo de los fiscales. NER es la tecnologia base de este sistema.

## Instrucciones

1. Abre Google Colab. Instala las dependencias:
   ```python
   !pip install spacy transformers seqeval
   !python -m spacy download es_core_news_lg  # modelo grande con NER
   from transformers import pipeline
   import spacy
   ```

2. Crea el corpus de textos juridicos y noticias ecuatorianas:
   ```python
   textos_ec = [
       """El ciudadano Carlos Paucar Toapanta, residente en la ciudadela
          Kennedy Norte de Guayaquil, presento una denuncia ante la Fiscalia
          del Guayas el 15 de marzo de 2024 contra la empresa CONSTRUMAX S.A.""",

       """La Asamblea Nacional del Ecuador aprobo el 8 de enero de 2025
          la Ley de Desarrollo Economico propuesta por el Ejecutivo.
          El presidente Daniel Noboa promulgo el decreto ejecutivo 120.""",

       """El volcan Cotopaxi registro actividad el pasado lunes segun el
          Instituto Geofisico de la Escuela Politecnica Nacional. El alcalde
          de Latacunga, Byron Calahorrano, activo el COE cantonal.""",

       # ... agrega 7 textos mas con: contratos comerciales, noticias policiales,
       # actas municipales de Cuenca/Ambato/Loja
   ]
   ```

3. Aplica NER con spaCy (modelo es_core_news_lg):
   ```python
   nlp = spacy.load('es_core_news_lg')

   for texto in textos_ec:
       doc = nlp(texto)
       print(f"\nTexto: {texto[:60]}...")
       for ent in doc.ents:
           print(f"  {ent.text:<30} -> {ent.label_} ({spacy.explain(ent.label_)})")
   ```

4. Visualiza las entidades con displacy:
   ```python
   from spacy import displacy
   doc = nlp(textos_ec[0])
   displacy.render(doc, style='ent', jupyter=True)
   ```

5. Aplica NER con transformer pre-entrenado para espanol:
   ```python
   ner_transformer = pipeline(
       "ner",
       model="mrm8488/bert-spanish-cased-finetuned-ner",
       aggregation_strategy="simple",
       device=0
   )
   resultados = ner_transformer(textos_ec[0])
   for r in resultados:
       print(f"{r['word']:<25} {r['entity_group']:<10} {r['score']:.3f}")
   ```

6. Evaluacion comparativa: crea un gold standard manual (etiquetas correctas) para 5 textos. Calcula precision, recall y F1 para ambos modelos usando `seqeval`:
   ```python
   from seqeval.metrics import classification_report

   # Formato BIO: B-PER, I-PER, B-ORG, I-ORG, B-LOC, I-LOC, B-DATE, O
   y_true = [['B-PER', 'I-PER', 'O', 'B-ORG', 'O', 'B-LOC', 'O', 'B-DATE']]
   y_pred_spacy = [...]     # Predicciones de spaCy en formato BIO
   y_pred_bert  = [...]     # Predicciones de BERT en formato BIO

   print(classification_report(y_true, y_pred_spacy))
   ```

7. Analiza los errores: En textos ecuatorianos, ambos modelos probablemente fallen con:
   - Apellidos indigenas (Toapanta, Pilatasig, Chuquipata)
   - Nombres de instituciones locales (IESS, SENESCYT, CONELEC)
   - Toponimos locales (parroquia Calacali, ciudadela Alborada)

   Documenta 5 errores sistematicos y propone como corregirlos.

## Usa IA para...

- Pedirle a Copilot que genere 10 textos juridicos ecuatorianos ficticios pero realistas con nombres de personas, organizaciones y fechas claramente identificables
- Preguntar la diferencia entre el formato BIO (Begin-Inside-Outside) y el formato BIOES (Begin-Inside-Outside-End-Single)
- Si el modelo comete errores en apellidos quechuas, preguntar como agregar un "gazetteer" (lista de nombres conocidos) para mejorar el recall de PER
- Pedir el codigo para exportar todas las entidades extraidas de un corpus a un DataFrame con columnas: texto_fuente, entidad, tipo, posicion_inicio, posicion_fin

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que es el formato BIO y por que es el estandar para NER
- Por que el F1-score es mas apropiado que accuracy para evaluar NER (clases desbalanceadas)
- Como el modelo transformer mejora sobre el modelo de reglas de spaCy para entidades no vistas antes
- Que es un "gazetteer" y como se integra en un pipeline NER

## Reto Extra

Fine-tunea BERT para NER en el dominio juridico ecuatoriano. Crea un dataset de 100 oraciones anotadas manualmente en formato BIO (puedes usar el anotador Doccano o anotar directamente en un CSV). Usa el `Trainer` de HuggingFace con `bert-base-multilingual-cased` como base. Compara el F1 del modelo fine-tuneado vs el modelo generico en un test set de 20 oraciones. Objetivo: superar F1 > 0.80 en la categoria PER (personas), que es la mas critica para la Fiscalia.
