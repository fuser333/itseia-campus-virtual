# Ejercicio Sesion 5: Desarrollo del Modelo y Solucion

**Materia:** Proyecto Integrador (Titulacion)
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 60 min

## Objetivo

Entrenar, comparar y optimizar multiples modelos de ML para el proyecto integrador, implementar busqueda de hiperparametros con validacion cruzada, generar explicaciones con SHAP, y seleccionar el modelo final con criterios tecnicos documentados.

## Contexto (Ecuador)

En investigacion seria, el modelo final no se elige porque "me dio el numero mas alto" — se elige porque tiene el mejor equilibrio entre rendimiento, interpretabilidad, costo computacional en produccion, y robustez ante datos nuevos. Este ejercicio implementa ese proceso completo con codigo profesional y decisiones documentadas.

## Instrucciones

### Parte 1 — Entrenamiento y comparacion base (15 min)

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
from sklearn.metrics import roc_auc_score, f1_score, classification_report
import warnings
warnings.filterwarnings("ignore")

# Cargar dataset limpio (del ejercicio anterior)
df = pd.read_csv("datos_citas_msp_limpio.csv")

# Definir features y target
TARGET = "asistio"
FEATURES_NUMERICAS = ["edad", "dias_anticipacion", "numero_citas_previas",
                       "distancia_km", "dia_semana", "mes"]
FEATURES_CATEGORICAS = ["genero", "provincia"]

X = df[FEATURES_NUMERICAS + FEATURES_CATEGORICAS]
y = df[TARGET]

# Calcular desbalanceo de clases
pct_positivo = y.mean()
print(f"Clase positiva (asistio=1): {pct_positivo:.1%}")
print(f"Clase negativa (asistio=0): {1-pct_positivo:.1%}")
print(f"Ratio desbalanceo: 1:{1/pct_positivo:.1f}")

# Escala para ajuste de pesos de clases
scale_pos_weight = (y == 0).sum() / (y == 1).sum()

# Division train/test con stratify
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

print(f"\nTrain: {X_train.shape[0]:,} | Test: {X_test.shape[0]:,}")

# Preprocesador estandarizado
preprocesador = ColumnTransformer(transformers=[
    ("num", Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ]), FEATURES_NUMERICAS),
    ("cat", Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ]), FEATURES_CATEGORICAS)
])

# Definir modelos a comparar
modelos = {
    "LogReg (baseline)": Pipeline([
        ("prep", preprocesador),
        ("clf", LogisticRegression(class_weight="balanced", max_iter=1000, random_state=42))
    ]),
    "Random Forest": Pipeline([
        ("prep", preprocesador),
        ("clf", RandomForestClassifier(
            n_estimators=200, class_weight="balanced",
            random_state=42, n_jobs=-1
        ))
    ]),
    "Gradient Boosting": Pipeline([
        ("prep", preprocesador),
        ("clf", GradientBoostingClassifier(n_estimators=200, random_state=42))
    ]),
    "XGBoost": Pipeline([
        ("prep", preprocesador),
        ("clf", XGBClassifier(
            n_estimators=200, scale_pos_weight=scale_pos_weight,
            random_state=42, eval_metric="auc", verbosity=0
        ))
    ]),
}

# Evaluacion con cross-validation 5-fold
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
resultados_cv = {}

print("\nEVALUACION CON 5-FOLD CROSS-VALIDATION (sobre train set):")
print("="*70)

for nombre, pipeline in modelos.items():
    scores_auc = cross_val_score(pipeline, X_train, y_train,
                                  cv=cv, scoring="roc_auc", n_jobs=-1)
    scores_f1 = cross_val_score(pipeline, X_train, y_train,
                                 cv=cv, scoring="f1", n_jobs=-1)
    resultados_cv[nombre] = {
        "auc_media": scores_auc.mean(),
        "auc_std": scores_auc.std(),
        "f1_media": scores_f1.mean()
    }
    print(f"{nombre:<25} AUC: {scores_auc.mean():.4f} +/- {scores_auc.std():.4f} | F1: {scores_f1.mean():.4f}")
```

### Parte 2 — Optimizacion de hiperparametros del mejor modelo (20 min)

```python
from sklearn.model_selection import RandomizedSearchCV
import json

# Optimizar el mejor modelo (ajusta segun tus resultados)
# Asumiendo que XGBoost fue el mejor:
mejor_nombre = max(resultados_cv, key=lambda k: resultados_cv[k]["auc_media"])
print(f"\nMejor modelo base: {mejor_nombre}")

# Grid de hiperparametros para XGBoost
param_grid_xgb = {
    "clf__n_estimators": [100, 200, 300, 500],
    "clf__max_depth": [3, 4, 5, 6, 8],
    "clf__learning_rate": [0.01, 0.05, 0.1, 0.2],
    "clf__subsample": [0.6, 0.8, 1.0],
    "clf__colsample_bytree": [0.6, 0.8, 1.0],
    "clf__min_child_weight": [1, 3, 5],
    "clf__gamma": [0, 0.1, 0.2],
}

# RandomizedSearch es mas eficiente que GridSearch para muchos parametros
busqueda = RandomizedSearchCV(
    modelos["XGBoost"],
    param_distributions=param_grid_xgb,
    n_iter=50,      # Prueba 50 combinaciones aleatorias
    cv=5,
    scoring="roc_auc",
    n_jobs=-1,
    random_state=42,
    verbose=1
)

print("\nOptimizando hiperparametros (puede tomar 2-5 min)...")
busqueda.fit(X_train, y_train)

print(f"\nMejores hiperparametros:")
for param, valor in busqueda.best_params_.items():
    print(f"  {param}: {valor}")
print(f"AUC CV con mejores params: {busqueda.best_score_:.4f}")

# Guardar los mejores hiperparametros
with open("mejores_hiperparametros.json", "w") as f:
    json.dump(busqueda.best_params_, f, indent=2)
```

### Parte 3 — Evaluacion final y SHAP (15 min)

```python
# Evaluacion en test set (solo se hace UNA vez al final)
mejor_modelo = busqueda.best_estimator_
mejor_modelo.fit(X_train, y_train)

y_pred = mejor_modelo.predict(X_test)
y_proba = mejor_modelo.predict_proba(X_test)[:, 1]

auc_final = roc_auc_score(y_test, y_proba)
print(f"\nRESULTADO FINAL EN TEST SET:")
print(f"AUC-ROC: {auc_final:.4f}")
print(f"\nReporte de clasificacion:")
print(classification_report(y_test, y_pred, target_names=["No asistio", "Si asistio"]))

# SHAP para explicabilidad
try:
    import shap

    # Extraer el clasificador XGBoost del pipeline
    clasificador = mejor_modelo.named_steps["clf"]
    preprocesador_fit = mejor_modelo.named_steps["prep"]
    X_test_prep = preprocesador_fit.transform(X_test)

    # Nombres de features despues del preprocesamiento
    feature_names_cat = mejor_modelo.named_steps["prep"].named_transformers_["cat"].named_steps["encoder"].get_feature_names_out(FEATURES_CATEGORICAS)
    feature_names_all = FEATURES_NUMERICAS + list(feature_names_cat)

    explainer = shap.TreeExplainer(clasificador)
    shap_values = explainer.shap_values(X_test_prep)

    print("\nTOP 10 FEATURES MAS IMPORTANTES (SHAP):")
    importancias_shap = pd.DataFrame({
        "feature": feature_names_all,
        "importancia_shap": np.abs(shap_values).mean(axis=0)
    }).sort_values("importancia_shap", ascending=False)
    print(importancias_shap.head(10).to_string(index=False))

    # Guardar grafico SHAP
    import matplotlib.pyplot as plt
    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_values, X_test_prep,
                      feature_names=feature_names_all, show=False)
    plt.title("SHAP Feature Importance — Prediccion Ausentismo MSP")
    plt.tight_layout()
    plt.savefig("shap_importance.png", dpi=150, bbox_inches="tight")
    print("Grafico SHAP guardado.")

except ImportError:
    print("Instala shap con: pip install shap")
```

### Parte 4 — Seleccion y justificacion del modelo final (10 min)

Completa esta tabla de decision para el modelo final:

```python
# Tabla de comparacion final de modelos
comparacion = {
    "LogReg (baseline)": {
        "auc_cv": resultados_cv["LogReg (baseline)"]["auc_media"],
        "tiempo_inferencia_ms": 0.1,
        "interpretable": True,
        "requisitos_ram_mb": 1,
        "mantenimiento_futuro": "Bajo"
    },
    "Random Forest": {
        "auc_cv": resultados_cv["Random Forest"]["auc_media"],
        "tiempo_inferencia_ms": 5,
        "interpretable": False,
        "requisitos_ram_mb": 50,
        "mantenimiento_futuro": "Bajo"
    },
    "XGBoost Optimizado": {
        "auc_cv": busqueda.best_score_,
        "tiempo_inferencia_ms": 2,
        "interpretable": False,  # pero tiene SHAP
        "requisitos_ram_mb": 30,
        "mantenimiento_futuro": "Medio"
    },
}

print("\nTABLA DE DECISION — MODELO FINAL")
print("="*70)
print(f"{'Modelo':<25} {'AUC CV':<10} {'Inf (ms)':<10} {'RAM':<8} {'Interpret.'}")
print("-"*70)
for nombre, datos in sorted(comparacion.items(), key=lambda x: x[1]["auc_cv"], reverse=True):
    print(f"{nombre:<25} {datos['auc_cv']:<10.4f} {datos['tiempo_inferencia_ms']:<10} "
          f"{datos['requisitos_ram_mb']}MB{'':<3} {'Si' if datos['interpretable'] else 'Con SHAP'}")

print("\nMODELO ELEGIDO: XGBoost Optimizado")
print("JUSTIFICACION: Mejor AUC en CV con diferencia estadisticamente")
print("significativa sobre el baseline (+X puntos). SHAP provee")
print("interpretabilidad suficiente para el usuario final (medico/administrador).")
print("El tiempo de inferencia de 2ms es adecuado para uso en tiempo real.")
```

## Usa IA para...

- Pedirle a Claude que explique intuitivamente que significa cada valor SHAP para un medico que no sabe de ML.
- Preguntarle como hacer una prueba de significancia estadistica para comparar dos modelos con los resultados de CV (Wilcoxon signed-rank test).
- Pedirle que sugiera 3 features adicionales que podrian mejorar el modelo y como se calcularian con los datos disponibles.

## Que aprendiste

- Que la evaluacion con cross-validation en el train set es mas confiable que en un solo split.
- Que la busqueda de hiperparametros aleatoria (RandomizedSearchCV) es suficientemente buena y mucho mas eficiente que la exhaustiva.
- Que SHAP permite explicar las predicciones de cualquier modelo de "caja negra" de forma comprensible.
- Que la eleccion del modelo final no es solo el mayor AUC — tambien considera interpretabilidad, costo de inferencia y facilidad de mantenimiento.

## Reto extra

Implementa un "model card" completo para tu modelo final siguiendo el estandar de Google: documento de 1-2 paginas que describe el modelo, su rendimiento en diferentes subgrupos (por genero, por provincia, por rango de edad), sus limitaciones conocidas, el uso recomendado y el uso que deberia evitarse. Este documento es cada vez mas requerido por reguladores y empresas responsables de IA.
