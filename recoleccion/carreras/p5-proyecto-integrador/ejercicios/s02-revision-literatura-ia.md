# Ejercicio Sesion 2: Revision de Literatura con IA — Elicit, Consensus y Scholar

**Materia:** Proyecto Integrador (Titulacion)
**Nivel:** Avanzado
**Herramienta IA:** Elicit.org + Consensus.app + Google Scholar + Claude
**Duracion:** 55 min

## Objetivo

Realizar una revision de literatura sistematica y eficiente usando herramientas IA especializadas en investigacion academica, identificar los papers mas relevantes para el proyecto integrador, extraer los hallazgos clave de forma automatizada, y construir una base teorica solida en una fraccion del tiempo que tomaria con metodos tradicionales.

## Contexto (Ecuador)

La revision de literatura es el paso que la mayoria de estudiantes saltean o hacen superficialmente, y luego el jurado lo detecta inmediatamente. Con herramientas como Elicit y Consensus, lo que antes tomaba 2 semanas de busqueda y lectura se puede hacer en 2 horas con mayor profundidad. Este ejercicio te convierte en investigador sistematico usando IA como copiloto.

## Instrucciones

### Parte 1 — Busqueda sistematica con Elicit.org (20 min)

Elicit (elicit.org) usa IA para buscar papers cientificos y extraer informacion clave automaticamente.

1. Ve a elicit.org y crea una cuenta gratuita.

2. Para tu problema de investigacion, construye queries de busqueda progresivas:

**Query 1 — Amplia (para encontrar el campo):**
```
"machine learning healthcare no-show prediction"
```

**Query 2 — Especifica con region:**
```
"appointment no-show prediction Latin America health system"
```

**Query 3 — Con metodologia:**
```
"random forest gradient boosting hospital appointment prediction accuracy"
```

**Query 4 — Muy especifica (para encontrar trabajo relacionado exacto):**
```
"[TU PROBLEMA ESPECIFICO] [TU PAIS O REGION] [TU METODOLOGIA]"
```

Para cada query, Elicit extrae automaticamente:
- Titulo y autores
- Año y journal
- Tamaño de muestra
- Metodologia usada
- Metricas de resultado
- Conclusion principal

3. Completa esta tabla con los 10 papers mas relevantes encontrados:

| # | Titulo (abreviado) | Año | Pais/Region | Metodologia | Metrica clave | Resultado |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| ... | | | | | | |
| 10 | | | | | | |

### Parte 2 — Consenso cientifico con Consensus.app (15 min)

Consensus.app es especializado en preguntas de investigacion: busca el consenso de la literatura sobre una pregunta especifica.

1. Ve a consensus.app y busca estas preguntas relacionadas con tu proyecto:

**Para proyecto de prediccion de ausentismo en salud:**
- "Does machine learning improve no-show prediction in healthcare?"
- "What features are most predictive of patient no-show?"
- "Is random forest better than logistic regression for appointment prediction?"

**Para proyecto de deteccion de plagas en agricultura:**
- "Does deep learning improve crop disease detection accuracy?"
- "What image resolution is needed for plant disease detection?"

Para cada pregunta, Consensus da:
- Porcentaje de papers que dicen SI vs NO
- Los estudios mas citados con sus respuestas
- El nivel de evidencia (fuerte, moderado, limitado)

2. Documenta el consenso para las 3 preguntas mas relevantes a tu proyecto.

### Parte 3 — Analisis de papers con Claude (15 min)

Una vez que tienes los 10 papers, usa Claude para analizarlos sistematicamente. Si tienes acceso al PDF, sube el texto. Si no, usa el abstract.

```
PROMPT PARA CLAUDE (usa para cada paper importante):
"Analiza este abstract/paper de investigacion para mi proyecto de titulacion:

<paper>
[PEGA EL ABSTRACT O TEXTO DEL PAPER]
</paper>

Mi proyecto es: [TU PROBLEMA DE INVESTIGACION EN 2 ORACIONES]

Dame:
1. RELEVANCIA para mi proyecto (1-5 y justificacion en 2 oraciones)
2. METODOLOGIA: que tecnica de ML usaron, con que dataset, cuantas muestras
3. RESULTADOS: las metricas mas importantes con sus valores exactos
4. LIMITACIONES que los autores mismos reconocen
5. APORTE POTENCIAL: como este paper informaria mi metodologia
6. CITA en formato APA"
```

Con los analisis de los 10 papers, construye la "Tabla Comparativa de Literatura":

```python
# Script para organizar tu revision de literatura

papers = [
    {
        "id": 1,
        "autores": "Garcia et al.",
        "año": 2023,
        "titulo": "Predicting patient no-show using XGBoost in Colombian hospitals",
        "pais": "Colombia",
        "tamaño_muestra": 45000,
        "mejor_modelo": "XGBoost",
        "auc_roc": 0.81,
        "precision": 0.73,
        "recall": 0.68,
        "variables_clave": ["distancia_hospital", "historial_ausentismo", "dia_semana"],
        "limitacion_principal": "No incluye datos socioeconomicos del paciente",
        "relevancia_para_mi_proyecto": 5
    },
    # Agrega los 9 papers restantes con la misma estructura
]

# Generar tabla resumen
print("REVISION DE LITERATURA — TABLA COMPARATIVA")
print("="*80)
print(f"{'ID':<3} {'Autores':<15} {'Año':<5} {'Pais':<12} {'Modelo':<12} {'AUC-ROC':<8} {'Relevancia'}")
print("-"*80)

for p in sorted(papers, key=lambda x: x['relevancia_para_mi_proyecto'], reverse=True):
    print(f"{p['id']:<3} {p['autores']:<15} {p['año']:<5} {p['pais']:<12} "
          f"{p['mejor_modelo']:<12} {p['auc_roc']:<8.2f} {p['relevancia_para_mi_proyecto']}/5")

# Estadisticas del campo
aucs = [p['auc_roc'] for p in papers]
print(f"\nRango de AUC-ROC en la literatura: {min(aucs):.2f} - {max(aucs):.2f}")
print(f"AUC-ROC promedio: {sum(aucs)/len(aucs):.2f}")
print(f"Tu objetivo: >= {max(aucs) - 0.03:.2f} (top 25% del campo)")
```

### Parte 4 — Identificar el gap de investigacion (5 min)

El gap de investigacion es la razon de existir de tu proyecto: que pregunta NO ha sido respondida por la literatura existente?

Con Claude:
```
PROMPT:
"He revisado 10 papers sobre [TU TEMA]. Los principales hallazgos son:
[PEGA RESUMEN DE TUS 10 PAPERS EN 5 PUNTOS]

Ayudame a identificar:
1. El GAP DE INVESTIGACION mas importante: que aspecto no ha sido estudiado
   o ha sido estudiado insuficientemente, especialmente en el contexto ecuatoriano?
2. Como mi proyecto puede llenar ese gap de forma unica?
3. La contribucion original de mi trabajo a la literatura existente?

Redacta un parrafo de 100 palabras para la seccion 'Justificacion'
que articule claramente el gap que mi investigacion llena."
```

## Usa IA para...

- Usar Elicit para hacer la busqueda en ingles (la literatura tecnica es mayoritariamente en ingles) y pedirle a Claude que traduzca y adapte los hallazgos al contexto ecuatoriano.
- Preguntarle a Claude como citar correctamente un paper de arXiv vs un journal indexado en Scopus en formato APA 7ma edicion.
- Pedirle que identifique si hay contradiccion entre dos papers de tu lista y como manejar esa contradiccion en tu marco teorico.

## Que aprendiste

- Que la revision de literatura con IA no reemplaza la lectura critica — la hace mas eficiente.
- Que Elicit extrae informacion estructurada de papers en segundos, lo que antes tomaba horas de lectura.
- Que el "gap de investigacion" no es una frase de relleno — es la justificacion tecnica de por que tu proyecto necesita existir.
- Como organizar la literatura de forma que puedas comparar metodologias, resultados y limitaciones de forma sistematica.

## Reto extra

Construye un "mapa de la literatura" visual usando Obsidian o Miro: un grafo donde cada nodo es un paper y las conexiones muestran relaciones (mismo dataset, misma metodologia, mismos autores, mismo resultado). El grafo debe mostrar claramente donde esta el cluster de investigacion existente y donde esta el gap que tu proyecto llena. Exporta el grafo como imagen e incorpóralo en tu marco teorico.
