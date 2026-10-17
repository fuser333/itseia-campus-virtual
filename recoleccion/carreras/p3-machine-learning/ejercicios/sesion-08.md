# Ejercicio Sesion 8: Proyecto — Predecir Desercion Estudiantil en Ecuador

**Materia:** Machine Learning I
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT + Claude
**Duracion estimada:** 50 min

## Objetivo

Desarrollar un modelo completo de ML (desde la exploracion hasta la prediccion) para identificar estudiantes universitarios ecuatorianos con alta probabilidad de desertar, aplicando todo lo aprendido en el Periodo 3: preprocesamiento, feature engineering, validacion cruzada y metricas adecuadas.

## Contexto

La SENESCYT reporta que la tasa de desercion universitaria en Ecuador alcanza el 26% en el primer año y el 40% en los dos primeros años. Cada estudiante que deserta representa aproximadamente $2,400 de inversion publica perdida. La Universidad Central del Ecuador, la ESPOL y la PUCE han iniciado proyectos piloto de analisis predictivo para identificar estudiantes en riesgo antes de que abandonen. Para ITSEIA, un modelo de este tipo tiene aplicacion directa desde el primer semestre.

## Instrucciones

1. Abre Google Colab y crea `sesion08_proyecto_desercion.ipynb`. Este es el proyecto integrador del Periodo 3.

2. Construye el dataset con todas las variables relevantes:

```python
# Machine Learning I - Sesion 8: PROYECTO INTEGRADOR
# Prediccion de Desercion Estudiantil - Ecuador
# ITSEIA - Periodo 3

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import (train_test_split, cross_validate,
                                      StratifiedKFold, GridSearchCV)
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                              f1_score, roc_auc_score, confusion_matrix,
                              classification_report)
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

np.random.seed(2024)
n = 1200

# Variables del estudiante (basadas en estudios SENESCYT, FLACSO Ecuador)
edad_ingreso = np.random.randint(17, 30, n)
genero = np.random.choice(['M', 'F'], n, p=[0.48, 0.52])
provincia_origen = np.random.choice(
    ['Pichincha', 'Guayas', 'Azuay', 'Manabi', 'Loja', 'Otra'], n,
    p=[0.28, 0.22, 0.10, 0.12, 0.08, 0.20]
)
vive_con_familia = np.random.choice([0, 1], n, p=[0.35, 0.65])
trabaja = np.random.choice([0, 1], n, p=[0.55, 0.45])
horas_trabajo = np.where(
    np.array([trabaja[i] == 1 for i in range(n)]),
    np.random.randint(20, 48, n), 0
)
beca = np.random.choice([0, 1], n, p=[0.70, 0.30])
ingreso_familiar = np.random.choice([1, 2, 3, 4], n, p=[0.20, 0.35, 0.30, 0.15])
nota_bachillerato = np.random.normal(7.8, 1.2, n).clip(4, 10)
primera_matricula = np.random.choice([0, 1], n, p=[0.30, 0.70])
carrera_vocacional = np.random.randint(1, 5, n)  # 1=nada, 4=mucho

# Variables academicas primer semestre
promedio_sem1 = np.random.normal(7.2, 1.8, n).clip(0, 10)
materias_reprobadas_sem1 = np.random.choice([0, 1, 2, 3], n, p=[0.50, 0.25, 0.15, 0.10])
asistencia_pct = np.random.uniform(50, 100, n)
participacion_extracurricular = np.random.choice([0, 1, 2], n, p=[0.50, 0.35, 0.15])

# Introducir valores faltantes realistas (como en datos reales)
for col_arr, pct in [(horas_trabajo, 0.05), (ingreso_familiar, 0.08), (asistencia_pct, 0.03)]:
    indices = np.random.choice(n, size=int(n * pct), replace=False)
    col_arr[indices] = np.nan if hasattr(col_arr[indices], '__iter__') else col_arr[indices]

# Variable objetivo: desercion en primer año
prob_desercion = (
    -2.0
    + 0.05 * horas_trabajo
    - 0.3 * promedio_sem1
    + 0.4 * materias_reprobadas_sem1
    - 0.015 * asistencia_pct
    - 0.5 * beca
    + 0.3 * trabaja
    - 0.2 * vive_con_familia
    - 0.1 * ingreso_familiar
    + 0.05 * np.random.randn(n)
)
prob_desercion = 1 / (1 + np.exp(-prob_desercion))
deserto = (np.random.rand(n) < prob_desercion).astype(int)

df = pd.DataFrame({
    'edad_ingreso': edad_ingreso,
    'genero': genero,
    'provincia_origen': provincia_origen,
    'vive_con_familia': vive_con_familia,
    'trabaja': trabaja,
    'horas_trabajo': horas_trabajo,
    'beca': beca,
    'ingreso_familiar': ingreso_familiar.astype(float),
    'nota_bachillerato': nota_bachillerato.round(2),
    'primera_matricula': primera_matricula,
    'carrera_vocacional': carrera_vocacional,
    'promedio_sem1': promedio_sem1.round(2),
    'materias_reprobadas_sem1': materias_reprobadas_sem1,
    'asistencia_pct': asistencia_pct.round(1),
    'participacion_extracurricular': participacion_extracurricular,
    'deserto': deserto
})

print("PROYECTO: Prediccion de Desercion Estudiantil")
print(f"Dataset SENESCYT/ITSEIA - {n} registros")
print(f"\nDesercion: {deserto.sum()} estudiantes ({deserto.mean()*100:.1f}%)")
print(f"Valores nulos: {df.isnull().sum().sum()} en total")
```

3. Exploracion de datos (EDA):

```python
# EDA rapido
fig, axes = plt.subplots(2, 3, figsize=(15, 9))
axes = axes.flatten()

# Desercion por variables clave
variables_eda = [
    ('promedio_sem1', 'Promedio Semestre 1'),
    ('materias_reprobadas_sem1', 'Materias Reprobadas'),
    ('asistencia_pct', 'Asistencia %'),
    ('horas_trabajo', 'Horas Trabajo Semanal'),
    ('beca', 'Tiene Beca'),
    ('trabaja', 'Trabaja')
]

for ax, (var, titulo) in zip(axes, variables_eda):
    df_plot = df.dropna(subset=[var])
    df_plot.groupby('deserto')[var].plot(
        kind='hist', alpha=0.6, bins=20, ax=ax,
        color=['#1F2F58', '#F0846D'], legend=True
    )
    ax.set_title(titulo)
    ax.set_xlabel(var)
    ax.legend(['No deserto (0)', 'Deserto (1)'])
    ax.grid(True, alpha=0.3)

plt.suptitle('EDA - Distribucion de Variables por Desercion | ITSEIA P3', fontsize=12)
plt.tight_layout()
plt.show()
```

4. Pipeline completo: preprocesamiento + modelo + evaluacion:

```python
# Codificacion de categoricas
df_model = df.copy()
le_genero = LabelEncoder()
le_provincia = LabelEncoder()
df_model['genero_cod'] = le_genero.fit_transform(df_model['genero'])
df_model['provincia_cod'] = le_provincia.fit_transform(df_model['provincia_origen'])

# Feature engineering
df_model['nota_x_asistencia'] = df_model['nota_bachillerato'] * df_model['asistencia_pct'] / 100
df_model['carga_laboral'] = df_model['horas_trabajo'].fillna(0) * df_model['trabaja']
df_model['indice_riesgo_acad'] = (
    df_model['materias_reprobadas_sem1'] * 2
    - df_model['promedio_sem1']
    + df_model['asistencia_pct'].fillna(75) / (-10)
)

features = ['edad_ingreso', 'genero_cod', 'provincia_cod', 'vive_con_familia',
            'trabaja', 'beca', 'nota_bachillerato', 'primera_matricula',
            'carrera_vocacional', 'promedio_sem1', 'materias_reprobadas_sem1',
            'participacion_extracurricular', 'nota_x_asistencia',
            'carga_laboral', 'indice_riesgo_acad']

X = df_model[features]
y = df_model['deserto']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Pipeline con imputer + scaler + modelo
pipeline_rf = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
    ('modelo', RandomForestClassifier(n_estimators=150, max_depth=10,
                                       class_weight='balanced', random_state=42))
])

# Validacion cruzada final
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
resultados_cv = cross_validate(
    pipeline_rf, X, y, cv=cv,
    scoring={'accuracy': 'accuracy',
             'recall': 'recall',
             'f1': 'f1',
             'roc_auc': 'roc_auc'}
)

print("RESULTADOS VALIDACION CRUZADA 5-FOLD:")
for metrica in ['accuracy', 'recall', 'f1', 'roc_auc']:
    scores = resultados_cv[f'test_{metrica}']
    print(f"  {metrica:12s}: {scores.mean():.4f} (± {scores.std():.4f})")

# Modelo final entrenado
pipeline_rf.fit(X_train, y_train)
y_pred = pipeline_rf.predict(X_test)
y_prob = pipeline_rf.predict_proba(X_test)[:, 1]

print(f"\nAUC-ROC Test: {roc_auc_score(y_test, y_prob):.4f}")
print("\nReporte de clasificacion:")
print(classification_report(y_test, y_pred, target_names=['No deserto', 'Deserto']))

# Simulacion de uso real
print("\n--- SIMULACION: ALERTA TEMPRANA ---")
nuevos_estudiantes = X_test.iloc[:5].copy()
probs = pipeline_rf.predict_proba(nuevos_estudiantes)[:, 1]
for i, prob in enumerate(probs):
    alerta = "ALTO RIESGO - Requiere tutoria urgente" if prob > 0.6 else \
             "RIESGO MEDIO - Seguimiento mensual" if prob > 0.35 else \
             "Bajo riesgo"
    print(f"  Estudiante {i+1}: {prob:.1%} prob. desercion -> {alerta}")
```

## Usa IA para...

> Primero pregunta a ChatGPT:
> "¿Que variables adicionales deberia incluir un modelo de desercion universitaria en Ecuador que no estan en el dataset actual? Investiga que factores menciona la literatura SENESCYT o UNESCO para desercion en paises latinoamericanos."

> Luego pregunta a Claude:
> "Tengo un modelo de ML para detectar desercion universitaria con AUC=0.82 y Recall=0.75. La universidad quiere implementarlo. ¿Qué consideraciones eticas debo tener al usar este modelo para asignar tutorias? ¿Podria el modelo perpetuar desigualdades?"

Documenta ambas respuestas en celdas de Markdown en tu notebook.

## Que aprendiste

- Un proyecto real de ML no empieza con el modelo: el EDA y el feature engineering consumen el 70% del tiempo.
- `Pipeline` de scikit-learn encadena preprocesamiento + modelo en un solo objeto, evitando fuga de datos (data leakage).
- `SimpleImputer` maneja valores nulos antes del modelo: la estrategia de imputacion (media, mediana, moda) afecta los resultados.
- `class_weight='balanced'` compensa el desbalance de clases ajustando el peso de cada clase automaticamente.
- Los modelos de ML en contextos de alto impacto (educacion, salud, credito) requieren consideracion etica, no solo tecnica.

## Reto extra

Optimiza los hiperparametros del Random Forest usando `GridSearchCV` con los parametros `n_estimators=[100, 200]`, `max_depth=[5, 10, None]` y `min_samples_split=[5, 10]`. Reporta el mejor conjunto de hiperparametros y el AUC-ROC obtenido. ¿Cuanto mejoro respecto al modelo sin optimizar? Luego exporta el modelo con `joblib.dump()` para simularlo en produccion.
