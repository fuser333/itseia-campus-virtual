# Ejercicio Sesion 7: Traduccion Tecnica con Claude/ChatGPT — Precision vs Creatividad

**Materia:** Ingles Tecnico I
**Nivel:** Intermedio
**Herramienta IA:** Claude + ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Entender las diferencias entre traduccion literal, tecnica y creativa en el contexto de documentacion de IA; desarrollar criterio propio para evaluar la calidad de traducciones generadas por IA, y aprender cuando usar cada herramienta para diferentes tipos de texto.

## Contexto

Un emprendedor ecuatoriano quiere lanzar su startup de IA al mercado latinoamericano. Necesita traducir tres tipos de documentos de ingles a espanol (Ecuador):
1. El docstring de una funcion Python (precision maxima, 0% creatividad)
2. El abstract de su paper tecnico (precision alta, algo de fluidez)
3. El copy de marketing de su producto de IA (creatividad maxima, impacto emocional)

Cada tipo requiere una estrategia de traduccion diferente — y una forma diferente de usar la IA.

## Instrucciones

**Parte 1 — Los 3 Tipos de Traduccion**

| Tipo | Cuando usarlo | Prioridad | Error mas costoso |
|------|--------------|-----------|-------------------|
| **Tecnica-literal** | Docstrings, especificaciones, contratos | Precision exacta | Cambiar el significado tecnico |
| **Tecnica-fluida** | Papers, manuales de usuario, tutoriales | Precision + legibilidad | Perder matices o ser demasiado rigido |
| **Creativa-localizada** | Marketing, pitches, comunicacion de marca | Impacto en la audiencia | Sonar extranjero o "traducido" |

**Parte 2 — Ejercicio de Traduccion: el Mismo Texto, 3 Versiones**

**Texto original (docstring de funcion):**

```
detect_fraud(transaction: pd.DataFrame, threshold: float = 0.85,
             return_proba: bool = False) -> Union[pd.Series, pd.DataFrame]

Detect potentially fraudulent transactions using a pre-trained gradient
boosting model. Applies feature engineering and model inference in a
single pipeline.

Args:
    transaction: DataFrame with columns ['amount', 'merchant_category',
                 'hour', 'day_of_week', 'user_velocity_24h'].
    threshold: Decision threshold for classifying a transaction as
               fraudulent. Higher values reduce false positives but
               may miss actual fraud. Defaults to 0.85.
    return_proba: If True, returns fraud probability scores instead
                  of binary labels. Useful for downstream ranking.

Returns:
    If return_proba is False: pd.Series of binary labels (1=fraud, 0=legit).
    If return_proba is True: pd.DataFrame with columns ['label', 'fraud_score'].

Raises:
    ValueError: If required columns are missing from the input DataFrame.
    ModelNotLoadedError: If the model has not been initialized.
```

**Tarea A — Traduccion Tecnica-Literal:**
Traduce el docstring completo al espanol (Ecuador). Reglas:
- Los terminos tecnicos que NO tienen equivalente en espanol se dejan en ingles (DataFrame, gradient boosting, pipeline, threshold)
- Los que tienen equivalente tecnico aceptado en Ecuador se traducen (returns → retorna, raises → lanza/genera)
- Cero creatividad — precision maxima

**Tarea B — Resumen tecnico-fluido:**
Escribe un parrafo de 4-5 oraciones en espanol que explique lo que hace esta funcion para un manual de usuario de nivel intermedio. No es docstring — es prosa legible.

**Tarea C — Pitch de marketing:**
Escribe 2 oraciones impactantes en espanol ecuatoriano para un flyer que describe el sistema de deteccion de fraude. Target: gerente de un banco en Quito. Prohibido usar jerga tecnica.

**Parte 3 — Compara Claude vs ChatGPT en Traduccion Tecnica**

Abre ambas herramientas y da el mismo prompt a cada una:

**Prompt A (para la traduccion del docstring):**
> "Traduce este docstring de Python al espanol tecnico. Los terminos sin equivalente en espanol deben quedarse en ingles. Los terminos con equivalente tecnico aceptado se traducen. Mantén la estructura y el formato exactos: [pega el docstring]"

**Prompt B (para el pitch de marketing):**
> "Eres experto en marketing de tecnologia para Ecuador. Adapta (no traduce literalmente) este texto tecnico a un mensaje de ventas de 2 oraciones para gerentes de banca en Quito. Debe sonar local, urgente y sin jerga: [pega el docstring simplificado]"

**Tabla de evaluacion:**

| Criterio | Claude | ChatGPT |
|----------|--------|---------|
| Precision tecnica (docstring) | /5 | /5 |
| Naturalidad del espanol | /5 | /5 |
| Mantuvo terminos en ingles correctamente | Si/No | Si/No |
| Impacto del pitch de marketing | /5 | /5 |
| ¿Cual usarias para cada tarea? | | |

**Parte 4 — Errores de Traduccion Automatica que Debes Detectar**

Los modelos de IA cometen estos errores en traducciones tecnicas. Identifica y corrige el error en cada oracion:

1. "El modelo *aprende* del conjunto de entrenamiento y *adivina* nuevos valores." (problema: "adivina" es incorrecto)
2. "La *tasa de aprendizaje* controla que tan *rapido* el modelo *olvida* los datos viejos." (problema: ?)
3. "El *umbral de decision* es la *puerta* que separa *fraudes* de *no-fraudes*." (problema: ?)
4. "Este parametro *sube* la *sensibilidad* del modelo." (problema: ?)

## Usa IA para...

> Con Claude: traducciones tecnicas donde la precision es critica (docstrings, especificaciones, reportes tecnicos).
> Con ChatGPT: traducciones creativas o adaptaciones de marketing donde el impacto es mas importante.

Prueba este prompt de "traduccion critica" con Claude:
> "Traduce este parrafo tecnico del paper de IA al espanol. Despues de la traduccion, dame una lista de los 5 terminos donde la traduccion es mas ambigua o controvertida, y explica por que optaste por esa traduccion en lugar de las alternativas."

## Que aprendiste

- No existe "la traduccion" — existen traducciones mas o menos adecuadas para cada **contexto y audiencia**.
- Los terminos tecnicos de ML/IA generalmente se dejan en ingles en el espanol tecnico latinoamericano.
- **Prompt de critica** (pedir que explique sus decisiones de traduccion) es mas util que aceptar ciegamente el resultado.
- Claude tiende a ser mas cuidadoso con precision; ChatGPT tiende a ser mas fluido y creativo — ambos tienen su lugar.
- El criterio profesional para evaluar una traduccion solo se desarrolla con practica activa y comparacion.

## Reto extra

Busca en Hugging Face (huggingface.co/spaces) un paper o README de un modelo publicado en ingles en los ultimos 3 meses. Traduce el abstract al espanol tecnico con Claude. Luego toma la misma informacion y escribe un post de LinkedIn en espanol latinoamericano para anunciar el modelo a una audiencia no tecnica. Publica el post y mide engagement. La capacidad de traducir entre "ingles tecnico" y "espanol para negocios" es una habilidad muy escasa y muy valorada en Ecuador.
