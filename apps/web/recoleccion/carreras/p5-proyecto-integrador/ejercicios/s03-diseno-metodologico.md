# Ejercicio Sesion 3: Diseño Metodologico — Datos, Modelo y Metricas

**Materia:** Proyecto Integrador (Titulacion)
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 55 min

## Objetivo

Disenar la metodologia completa del proyecto integrador: seleccionar el dataset correcto, elegir y justificar los algoritmos a comparar, definir las metricas de evaluacion apropiadas para el problema, y documentar el pipeline experimental de forma reproducible.

## Contexto (Ecuador)

La metodologia es el capitulo que el jurado lee mas detenidamente — es donde verifican si el investigador sabe lo que hace. Un diseño metodologico solido no solo describe lo que hiciste, sino por que elegiste esa aproximacion sobre las alternativas, cuales son sus limitaciones, y como garantizas que los resultados son reproducibles. Este ejercicio construye esa solidez.

## Instrucciones

### Parte 1 — Seleccion y justificacion del dataset (15 min)

Documenta el dataset que usaras con esta ficha tecnica:

```
FICHA TECNICA DEL DATASET

NOMBRE OFICIAL: _______________
FUENTE/PROVEEDOR: _______________
URL O PROCESO DE ACCESO: _______________
FECHA DE RECOLECCION: _______________
COBERTURA TEMPORAL: _______________
COBERTURA GEOGRAFICA: _______________

DESCRIPCION:
- Numero de filas (observaciones): _______________
- Numero de columnas (variables): _______________
- Variable objetivo (target): _______________
- Tipo de problema: [clasificacion / regresion / clustering / otro]

VARIABLES DISPONIBLES:
| Variable | Tipo | Descripcion | % Valores nulos |
|---|---|---|---|
| [nombre] | [num/cat/bool] | [descripcion] | [%] |
| ... | | | |

LIMITACIONES CONOCIDAS:
1. _______________
2. _______________
3. _______________

CONSIDERACIONES ETICAS:
- Datos sensibles: [si/no] — Que tipo?
- Anonimizacion: [como se garantiza]
- Sesgo conocido: [existe sesgo demografico, temporal, geografico?]

ALTERNATIVAS CONSIDERADAS Y DESCARTADAS:
| Dataset alternativo | Por que se descarto |
|---|---|
| | |
```

### Parte 2 — Arquitectura del pipeline de ML (20 min)

Diseña el pipeline experimental completo con codigo esquematico:

```python
"""
PIPELINE METODOLOGICO DEL PROYECTO INTEGRADOR
Proyecto: [NOMBRE DE TU PROYECTO]
Autor: [TU NOMBRE]
Fecha: [FECHA]
"""

# ============================================================
# FASE 1: CARGA Y EXPLORACION DE DATOS (EDA)
# ============================================================
# Que incluiras:
# - Distribucion de la variable objetivo (balanceada?)
# - Estadisticas descriptivas por categoria
# - Correlaciones entre variables
# - Deteccion de outliers (IQR o Z-score)
# - Analisis de valores nulos por columna
# Herramienta: pandas, seaborn, matplotlib

# ============================================================
# FASE 2: PREPROCESAMIENTO
# ============================================================
# Que incluiras (justifica cada decision):
# - Imputacion de valores nulos: [estrategia: media/mediana/moda/modelo]
# - Encoding de categoricas: [OneHot / Ordinal / Target / Embeddings]
#   Justificacion: _______________
# - Escalado de numericas: [StandardScaler / MinMax / RobustScaler]
#   Justificacion: _______________
# - Tratamiento de desbalanceo: [SMOTE / class_weight / undersample]
#   Justificacion: _______________

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer

# Define tus columnas
columnas_numericas = ["variable_1", "variable_2"]  # REEMPLAZA
columnas_categoricas = ["variable_3", "variable_4"]  # REEMPLAZA

# Pipeline de preprocesamiento
preprocesador = ColumnTransformer(transformers=[
    ("num", Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ]), columnas_numericas),
    ("cat", Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ]), columnas_categoricas)
])

# ============================================================
# FASE 3: DIVISION DE DATOS
# ============================================================
from sklearn.model_selection import train_test_split, StratifiedKFold

# Division estratificada para preservar proporciones de la clase objetivo
# JUSTIFICACION: La division estratificada es necesaria porque el dataset
# tiene [X%] de instancias de la clase positiva, y queremos que esa
# proporcion se mantenga en train y test.

# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.20, random_state=42, stratify=y
# )

# Cross-validation para evaluacion robusta
# JUSTIFICACION: Usamos 5-fold estratificado porque [RAZON]
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# ============================================================
# FASE 4: SELECCION Y ENTRENAMIENTO DE MODELOS
# ============================================================
# JUSTIFICACION DE MODELOS ELEGIDOS:
# Se comparan 4 algoritmos cubriendo diferentes familias:
# - Logistic Regression: baseline lineal, interpretable
# - Random Forest: ensemble bagging, robusto a outliers
# - XGBoost: ensemble boosting, estado del arte tabular
# - MLP Neural Network: para capturar interacciones no lineales complejas

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.neural_network import MLPClassifier

modelos = {
    "Logistic Regression (baseline)": LogisticRegression(
        max_iter=1000, class_weight="balanced", random_state=42
    ),
    "Random Forest": RandomForestClassifier(
        n_estimators=200, class_weight="balanced", random_state=42, n_jobs=-1
    ),
    "XGBoost": XGBClassifier(
        n_estimators=200, scale_pos_weight=None,  # calcular segun desbalanceo
        random_state=42, eval_metric="auc"
    ),
    "MLP": MLPClassifier(
        hidden_layer_sizes=(128, 64, 32), max_iter=500, random_state=42
    ),
}

# ============================================================
# FASE 5: EVALUACION
# ============================================================
# METRICAS Y JUSTIFICACION:
# Para este problema de [CLASIFICACION BINARIA/MULTICLASE]:
# - AUC-ROC: metrica principal porque [RAZON]
# - Precision: importante porque [RAZON]
# - Recall: importante porque [RAZON — cual es el costo del falso negativo?]
# - F1-Score: balance precision-recall cuando [CONDICION]
# - Confusion Matrix: para analisis de errores especificos

from sklearn.metrics import (
    roc_auc_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report
)

def evaluar_modelo_completo(modelo, X_train, X_test, y_train, y_test, nombre):
    """Evaluacion estandarizada de un modelo con todas las metricas."""
    modelo.fit(X_train, y_train)
    y_pred = modelo.predict(X_test)
    y_proba = modelo.predict_proba(X_test)[:, 1] if hasattr(modelo, 'predict_proba') else y_pred

    return {
        "nombre": nombre,
        "auc_roc": round(roc_auc_score(y_test, y_proba), 4),
        "precision": round(precision_score(y_test, y_pred), 4),
        "recall": round(recall_score(y_test, y_pred), 4),
        "f1": round(f1_score(y_test, y_pred), 4),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist()
    }
```

### Parte 3 — Definicion de metricas y umbral de exito (10 min)

Esta es una de las decisiones mas importantes: antes de entrenar cualquier modelo, define que resultado consideraras exitoso.

**Plantilla de criterios de exito:**

```
CRITERIOS DE EXITO DEL PROYECTO

METRICA PRINCIPAL: AUC-ROC
UMBRAL DE EXITO: >= [VALOR BASADO EN LITERATURA]
JUSTIFICACION: Los papers revisados reportan AUC entre [MIN] y [MAX].
Un AUC de [UMBRAL] representaria un resultado en el top [%] de la literatura.

METRICAS SECUNDARIAS:
- Precision >= [VALOR]: Porque en este problema, un falso positivo significa [COSTO]
- Recall >= [VALOR]: Porque en este problema, un falso negativo significa [COSTO]

CRITERIO DE FRACASO (si esto ocurre, hay que replantear):
- Si el mejor modelo alcanza AUC < [VALOR MINIMO]
- Causa probable: [datos insuficientes / features incorrectas / problema irresoluble con estos datos]

INTERPRETABILIDAD REQUERIDA: [si/no]
JUSTIFICACION: [Los usuarios finales necesitan entender por que el modelo predice X?]
Si SI: usar SHAP values para explicabilidad
```

### Parte 4 — Tabla de comparacion de algoritmos (10 min)

Completa esta tabla ANTES de entrenar (prediccion teorica basada en la literatura):

| Algoritmo | Fortaleza principal | Debilidad principal | AUC esperado | Tiempo de entrenamiento | Interpretable? |
|---|---|---|---|---|---|
| Logistic Regression | Alta interpretabilidad, rapido | No captura no-linealidades | 0.68-0.72 | Segundos | Si |
| Random Forest | Robusto, buen baseline | Lento en prediccion | 0.76-0.82 | Minutos | Parcial (feature importance) |
| XGBoost | Mejor precision tabular | Muchos hiperparametros | 0.78-0.85 | Minutos | Parcial (SHAP) |
| MLP | Captura patrones complejos | Requiere mas datos, caja negra | 0.74-0.80 | Minutos | No |

Despues de entrenar, completa la columna "AUC real obtenido" y analiza las diferencias con la prediccion teorica.

## Usa IA para...

- Pedirle a Claude que justifique la eleccion de cada metrica segun el tipo de problema y los costos de cada tipo de error en tu caso especifico.
- Preguntarle como tratar el desbalanceo de clases cuando la clase positiva representa menos del 10% del dataset — cual es la mejor estrategia para tu caso?
- Pedirle que revise tu pipeline y señale pasos que podrian causar data leakage (filtracion de informacion del test al train).

## Que aprendiste

- Que la metodologia bien documentada permite que cualquier otro investigador replique tus resultados.
- Que definir el umbral de exito antes de entrenar evita el "HARKing" (Hypothesizing After Results are Known).
- Que el pipeline de sklearn permite construir el preprocesamiento de forma limpia y reproducible.
- Que la metrica correcta depende del costo de cada tipo de error en el contexto real del problema.

## Reto extra

Implementa un experimento de ablacion: entrena el modelo con diferentes subconjuntos de features y mide el impacto en el AUC. Graficara el "learning curve" de features: como cambia el rendimiento al agregar o quitar cada variable. Identifica el conjunto minimo de variables que alcanza el 95% del rendimiento maximo — ese es el modelo que deberia ir a produccion.
