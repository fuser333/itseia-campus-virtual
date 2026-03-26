# Ejercicio Sesion 5: AutoML y Optimizacion de Hiperparametros

**Materia:** Machine Learning Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Aplicar AutoML y optimizacion sistematica de hiperparametros: Optuna para Bayesian optimization, comparacion automatica de algoritmos, y pipelines AutoML completos — para acelerar el ciclo de desarrollo de modelos en el contexto de prediccion de incumplimiento crediticio en cooperativas de ahorro del Ecuador (COAC).

## Contexto

Un data scientist en una COAC ecuatoriana tipicamente prueba 3-5 modelos con parametros por defecto. Optuna con 50 trials automaticos explora cientos de combinaciones y encuentra hiperparametros que mejoran el AUC en 5-15 puntos porcentuales — en menos de 1 hora de computo. AutoML democratiza el ML: un analista sin experiencia avanzada puede obtener modelos de calidad comparable a un experto con anos de experiencia.

## Instrucciones

1. Instala: `pip install optuna`.

2. Crea el archivo `sesion05_automl_optimizacion_ecuador.py`:

```python
# AutoML + Optimizacion Hiperparametros - ITSEIA
# Machine Learning Avanzado
# Optuna para credito COAC Ecuador

import numpy as np
import pandas as pd
import optuna
import json
import time
import warnings
from sklearn.ensemble import (RandomForestClassifier, GradientBoostingClassifier,
                               ExtraTreesClassifier)
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import cross_val_score, StratifiedKFold, train_test_split
from sklearn.metrics import roc_auc_score, f1_score, classification_report
from sklearn.pipeline import Pipeline

optuna.logging.set_verbosity(optuna.logging.WARNING)
warnings.filterwarnings("ignore")
np.random.seed(2026)

print("=" * 65)
print("AUTOML + OPTUNA — CREDITO COAC ECUADOR")
print("=" * 65)

# ================================================
# CONCEPTOS: BUSQUEDA DE HIPERPARAMETROS
# ================================================
print("\n--- ESTRATEGIAS DE BUSQUEDA ---")

estrategias = {
    "Grid Search":    {
        "descripcion": "Evalua todas las combinaciones posibles",
        "complejidad": "O(n^k) — exponencial con el numero de params",
        "ejemplo":     "5 LR x 5 depth x 5 estimators = 125 evaluaciones",
        "cuando":      "Espacio pequeno, < 4 hiperparametros",
    },
    "Random Search":  {
        "descripcion": "Muestrea aleatoriamente el espacio",
        "complejidad": "N trials — controlable",
        "ventaja":     "En 10 trials cubre mas espacio que GridSearch en muchos casos",
        "cuando":      "Baseline rapido, > 4 hiperparametros",
    },
    "Bayesian (Optuna)":{
        "descripcion": "Modelo probabilistico guia la busqueda hacia zonas prometedoras",
        "algoritmo":   "TPE (Tree-structured Parzen Estimator)",
        "ventaja":     "50 trials = calidad de GridSearch con 500 trials",
        "cuando":      "Siempre — es el estandar de la industria",
    },
    "Halving Search": {
        "descripcion": "Arranca con muchos candidatos, elimina los peores progresivamente",
        "algoritmo":   "Successive Halving — similar a torneo eliminatorio",
        "ventaja":     "10x mas rapido que GridSearch",
        "cuando":      "Datasets grandes donde cada evaluacion es cara",
    },
}

for metodo, info in estrategias.items():
    print(f"\n  [{metodo}]")
    for k, v in info.items():
        print(f"    {k:<14}: {v}")

# ================================================
# DATASET: SOLICITUDES COAC ECUADOR
# ================================================
print("\n--- DATASET: CREDITO COAC ECUADOR ---")

N = 4_000
tipos_credito = ["consumo","vivienda","microempresa","educacion","emergencia"]

df = pd.DataFrame({
    "edad":              np.random.normal(38, 10, N).clip(18, 70).round(0),
    "ingreso_mensual":   np.random.lognormal(6.8, 0.6, N).round(2),
    "monto_solicitado":  np.random.lognormal(8.5, 1.0, N).round(2),
    "plazo_meses":       np.random.choice([12,24,36,48,60,72], N),
    "score_buro":        np.random.normal(650, 100, N).clip(300, 900).round(0),
    "n_creditos_activos":np.random.choice([0,1,2,3,4], N, p=[0.3,0.35,0.2,0.1,0.05]),
    "anos_cliente":      np.random.exponential(3, N).clip(0, 20).round(1),
    "ahorro_mensual":    np.random.lognormal(5.5, 0.8, N).round(2),
    "tiene_garante":     np.random.binomial(1, 0.45, N),
    "tipo_credito":      np.random.choice(range(len(tipos_credito)), N),
    "mora_historica_dias": np.random.choice([0,0,15,30,60,90], N, p=[0.55,0.20,0.10,0.07,0.05,0.03]),
    "n_cuentas_bancarias": np.random.choice([0,1,2,3], N, p=[0.15,0.50,0.25,0.10]),
    "zona_urbana":        np.random.binomial(1, 0.65, N),
    "dependientes":       np.random.choice([0,1,2,3,4], N, p=[0.25,0.30,0.25,0.12,0.08]),
})

# Variable objetivo: incumplimiento
ratio_deuda   = df["monto_solicitado"] / (df["ingreso_mensual"] * df["plazo_meses"])
prob_incumpl  = (
    0.15
    + 0.20 * (ratio_deuda > 0.3).astype(float)
    + 0.15 * (df["score_buro"] < 550).astype(float)
    + 0.10 * (df["mora_historica_dias"] > 30).astype(float)
    - 0.08 * df["tiene_garante"]
    - 0.05 * (df["anos_cliente"] > 3).astype(float)
    + np.random.normal(0, 0.05, N)
).clip(0.01, 0.99)

df["incumplimiento"] = (np.random.random(N) < prob_incumpl).astype(int)

print(f"  Dataset: {df.shape}")
print(f"  Tasa de incumplimiento: {df['incumplimiento'].mean()*100:.1f}%")

X = df.drop("incumplimiento", axis=1).values
y = df["incumplimiento"].values

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                      stratify=y, random_state=42)

# ================================================
# BASELINE: MODELOS DEFAULT
# ================================================
print("\n--- BASELINE: MODELOS CON PARAMETROS DEFAULT ---")

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scaler = StandardScaler()
X_train_sc = scaler.fit_transform(X_train)

modelos_base = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Random Forest":       RandomForestClassifier(n_estimators=100, random_state=42),
    "Gradient Boosting":   GradientBoostingClassifier(n_estimators=100, random_state=42),
    "Extra Trees":         ExtraTreesClassifier(n_estimators=100, random_state=42),
}

resultados_base = {}
for nombre, modelo in modelos_base.items():
    t0 = time.perf_counter()
    aucs = cross_val_score(modelo, X_train_sc, y_train, cv=cv,
                            scoring="roc_auc", n_jobs=-1)
    t_s = time.perf_counter() - t0
    resultados_base[nombre] = {"auc_mean": aucs.mean(), "auc_std": aucs.std(), "tiempo_s": t_s}
    print(f"  {nombre:<25}: AUC = {aucs.mean():.4f} ± {aucs.std():.4f}  ({t_s:.1f}s)")

mejor_base    = max(resultados_base, key=lambda k: resultados_base[k]["auc_mean"])
mejor_auc_base = resultados_base[mejor_base]["auc_mean"]

# ================================================
# OPTUNA: BAYESIAN OPTIMIZATION
# ================================================
print(f"\n--- OPTUNA: BAYESIAN OPTIMIZATION ---")
print(f"  Objetivo: superar AUC base de {mejor_auc_base:.4f} ({mejor_base})")

def objective(trial):
    """Funcion objetivo para Optuna — evalua una combinacion de hiperparametros."""

    algoritmo = trial.suggest_categorical("algoritmo",
                                           ["RandomForest","GradientBoosting","ExtraTrees"])

    if algoritmo == "RandomForest":
        modelo = RandomForestClassifier(
            n_estimators=trial.suggest_int("n_estimators", 50, 300),
            max_depth=trial.suggest_int("max_depth", 3, 15),
            min_samples_split=trial.suggest_int("min_samples_split", 2, 20),
            min_samples_leaf=trial.suggest_int("min_samples_leaf", 1, 10),
            max_features=trial.suggest_categorical("max_features",
                                                    ["sqrt","log2",0.5,0.8]),
            random_state=42,
        )
    elif algoritmo == "GradientBoosting":
        modelo = GradientBoostingClassifier(
            n_estimators=trial.suggest_int("n_estimators", 50, 300),
            learning_rate=trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
            max_depth=trial.suggest_int("max_depth", 2, 8),
            subsample=trial.suggest_float("subsample", 0.6, 1.0),
            min_samples_split=trial.suggest_int("min_samples_split", 2, 20),
            random_state=42,
        )
    else:
        modelo = ExtraTreesClassifier(
            n_estimators=trial.suggest_int("n_estimators", 50, 300),
            max_depth=trial.suggest_int("max_depth", 3, 20),
            min_samples_split=trial.suggest_int("min_samples_split", 2, 20),
            random_state=42,
        )

    aucs = cross_val_score(modelo, X_train_sc, y_train, cv=cv,
                            scoring="roc_auc", n_jobs=-1)
    return aucs.mean()

# Ejecutar estudio Optuna
N_TRIALS = 40
study = optuna.create_study(direction="maximize",
                             sampler=optuna.samplers.TPESampler(seed=42))
study.optimize(objective, n_trials=N_TRIALS, show_progress_bar=False)

best_trial  = study.best_trial
best_params = best_trial.params
best_auc    = best_trial.value

print(f"\n  Optuna completado: {N_TRIALS} trials")
print(f"  Mejor AUC:         {best_auc:.4f} (+{(best_auc-mejor_auc_base)*100:.1f} puntos vs baseline)")
print(f"  Mejor algoritmo:   {best_params.get('algoritmo','N/A')}")
print(f"  Parametros clave:")
for k, v in best_params.items():
    if k != "algoritmo":
        print(f"    {k}: {v}")

# ================================================
# EVALUACION FINAL DEL MEJOR MODELO
# ================================================
print("\n--- EVALUACION FINAL (TEST) ---")

# Reconstruir mejor modelo
algoritmo_opt = best_params.get("algoritmo", "RandomForest")
if algoritmo_opt == "RandomForest":
    modelo_opt = RandomForestClassifier(
        n_estimators=best_params.get("n_estimators", 100),
        max_depth=best_params.get("max_depth", 10),
        min_samples_split=best_params.get("min_samples_split", 2),
        min_samples_leaf=best_params.get("min_samples_leaf", 1),
        random_state=42,
    )
elif algoritmo_opt == "GradientBoosting":
    modelo_opt = GradientBoostingClassifier(
        n_estimators=best_params.get("n_estimators", 100),
        learning_rate=best_params.get("learning_rate", 0.1),
        max_depth=best_params.get("max_depth", 3),
        random_state=42,
    )
else:
    modelo_opt = ExtraTreesClassifier(
        n_estimators=best_params.get("n_estimators", 100),
        max_depth=best_params.get("max_depth", 10),
        random_state=42,
    )

X_test_sc = scaler.transform(X_test)
modelo_opt.fit(X_train_sc, y_train)
probs_test = modelo_opt.predict_proba(X_test_sc)[:, 1]
preds_test = (probs_test > 0.5).astype(int)

auc_test = roc_auc_score(y_test, probs_test)
print(f"  AUC test: {auc_test:.4f}")
print(classification_report(y_test, preds_test,
                             target_names=["Cumple","Incumple"], digits=3))

# ================================================
# OPTUNA: VISUALIZACION DEL PROCESO
# ================================================
print("--- ANALISIS DEL PROCESO DE OPTIMIZACION ---")

# Importancia de hiperparametros
importancias = optuna.importance.get_param_importances(study)
print("\n  Importancia de hiperparametros:")
for param, imp in list(importancias.items())[:6]:
    barra = "#" * int(imp * 40)
    print(f"  {param:<25}: {barra:<40} {imp:.3f}")

# Convergencia del estudio
valores_trial = [t.value for t in study.trials]
mejores_hasta = [max(valores_trial[:i+1]) for i in range(len(valores_trial))]
print(f"\n  Convergencia:")
for i in [0, 9, 19, 29, 39]:
    if i < len(mejores_hasta):
        print(f"  Trial {i+1:>3}: mejor AUC acumulado = {mejores_hasta[i]:.4f}")

print("\n" + "=" * 65)
print("AUTOML + OPTUNA — CONCEPTOS CLAVE:")
print("  TPE:           modelo probabilistico — aprende de trials anteriores")
print("  suggest_int:   hiperparametro entero — n_estimators, max_depth")
print("  suggest_float: hiperparametro continuo — learning_rate (log=True)")
print("  suggest_categorical: eleccion entre opciones — algoritmo, max_features")
print("  Pruning:       detener trials poco prometedores antes de terminar")
print("  Importancia:   que hiperparametros importan mas — focalizar la busqueda")
print("=" * 65)
```

3. Implementa el Optuna con pruning: agrega `trial.report()` y `trial.should_prune()` para detener trials que claramente no van a ganar.

4. Agrega la busqueda de arquitectura de red neuronal como hiperparametro en Optuna: numero de capas (2-5), neuronas por capa (16-256), dropout (0.1-0.5), optimizador (Adam/SGD/RMSprop).

## Usa IA para...

> Abre Claude y escribe:
> "Estoy usando Optuna para optimizar un modelo de scoring crediticio para cooperativas de ahorro del Ecuador. Tengo 50 trials completados con AUC maximo de 0.82. Quiero llegar a 0.85+. Las opciones son: 1) aumentar a 200 trials (mas computo), 2) agregar XGBoost y LightGBM al espacio de busqueda (mas algoritmos), 3) agregar feature engineering automatico como hiperparametro (con/sin log transform, con/sin interacciones). ¿Cual de las tres estrategias tiene mayor impacto marginal? ¿Como configuro Optuna para buscar en el espacio combinado de algoritmo + feature engineering? Dame el codigo con la integracion de LightGBM en el objective de Optuna."

Despues de leer la respuesta:
- Agrega LightGBM al espacio de busqueda de Optuna.
- Compara el AUC final vs la version sin LightGBM.

## Que aprendiste

- Bayesian optimization (Optuna TPE) encuentra mejores hiperparametros en 50 trials que Grid Search en 500.
- `suggest_float(log=True)` es esencial para learning rate — la escala logaritmica tiene mas sentido que lineal.
- La importancia de hiperparametros revela que ajustar — n_estimators suele importar menos que max_depth.
- Pruning detecta trials perdedores temprano — ahorra 30-50% del tiempo de optimizacion.
- El espacio de busqueda debe incluir el algoritmo como categorica — Optuna encuentra el mejor tipo de modelo.
- AutoML no reemplaza al data scientist — requiere definir el espacio de busqueda, las metricas y el contexto.

## Reto extra

Construye el sistema AutoML completo para las 23 COAC reguladas por la SEPS Ecuador: pipeline automatico que recibe cualquier dataset de credito (variable objetivo + features), ejecuta Optuna con 100 trials comparando 5 algoritmos (LR, RF, GBM, XGB, LightGBM), feature engineering automatico (log transform + interacciones + target encoding), seleccion de umbral optimo por tipo de COAC (minorista vs ampliada), generacion de reporte PDF con curvas ROC, importancia de features y calibracion de probabilidades. El sistema debe correr sin intervencion humana y generar un modelo en produccion en menos de 30 minutos.
