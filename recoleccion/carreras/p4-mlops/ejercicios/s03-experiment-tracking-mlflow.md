# Ejercicio Sesion 3: Experiment Tracking con MLflow

**Materia:** MLOps y Despliegue de Modelos
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 55 min

## Objetivo

Implementar tracking completo de experimentos de ML con MLflow: logging de parametros, metricas, artefactos y modelos, usar la UI de MLflow para comparar experimentos visualmente y registrar el mejor modelo en el Model Registry para gestion del ciclo de vida.

## Contexto (Ecuador)

El equipo de ciencia de datos de CNT (Corporacion Nacional de Telecomunicaciones del Ecuador) esta entrenando modelos para predecir el churn (abandono) de clientes de fibra optica. El equipo tiene 4 data scientists y cada uno prueba diferentes hiperparametros. Sin MLflow, nadie sabe cual fue el mejor experimento, con que parametros y con que datos. Con MLflow, todo queda registrado y es reproducible.

## Instrucciones

1. Instala MLflow en tu entorno LOCAL (o usa Colab):
   ```bash
   pip install mlflow scikit-learn pandas matplotlib seaborn
   ```

2. Genera el dataset de churn de CNT Ecuador:
   ```python
   import numpy as np
   import pandas as pd

   np.random.seed(42)
   n = 3000
   df = pd.DataFrame({
       'meses_contrato': np.random.randint(1, 60, n),
       'plan_fibra': np.random.choice(['100Mbps', '200Mbps', '500Mbps', '1Gbps'], n),
       'llamadas_soporte': np.random.poisson(2, n),
       'facturas_atrasadas': np.random.randint(0, 5, n),
       'velocidad_real_pct': np.random.beta(8, 2, n) * 100,  # % de velocidad contratada
       'precio_mensual': np.random.choice([35, 50, 75, 120], n),
       'cambio_plan_ultimos_6m': np.random.binomial(1, 0.2, n),
       'ciudad': np.random.choice(['Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Manta'], n)
   })
   df['churn'] = (
       (df['facturas_atrasadas'] > 2) |
       (df['llamadas_soporte'] > 4) |
       (df['velocidad_real_pct'] < 50)
   ).astype(int)

   print(f"Dataset: {len(df)} clientes, churn rate: {df['churn'].mean():.1%}")
   df.to_csv('data_cnt_churn.csv', index=False)
   ```

3. Implementa el tracking con MLflow para multiples experimentos:
   ```python
   import mlflow
   import mlflow.sklearn
   from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
   from sklearn.linear_model import LogisticRegression
   from sklearn.model_selection import train_test_split, cross_val_score
   from sklearn.preprocessing import StandardScaler, LabelEncoder
   from sklearn.metrics import (accuracy_score, roc_auc_score,
                                  f1_score, confusion_matrix,
                                  classification_report)
   import matplotlib.pyplot as plt
   import seaborn as sns

   # Preprocesamiento
   df = pd.read_csv('data_cnt_churn.csv')
   le = LabelEncoder()
   df['plan_enc'] = le.fit_transform(df['plan_fibra'])
   df['ciudad_enc'] = le.fit_transform(df['ciudad'])

   feature_cols = ['meses_contrato', 'plan_enc', 'llamadas_soporte',
                   'facturas_atrasadas', 'velocidad_real_pct',
                   'precio_mensual', 'cambio_plan_ultimos_6m', 'ciudad_enc']
   X = df[feature_cols]
   y = df['churn']
   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

   # Define el experimento
   mlflow.set_experiment("CNT_Churn_Prediction")

   # Funcion que trackea un experimento completo
   def run_experiment(model_name, model, params, X_train, X_test, y_train, y_test):
       with mlflow.start_run(run_name=f"{model_name}_v{params.get('n_estimators', 'N/A')}"):
           # Log parametros
           mlflow.log_params(params)
           mlflow.log_param("modelo", model_name)
           mlflow.log_param("n_features", X_train.shape[1])
           mlflow.log_param("n_train", len(X_train))

           # Entrenamiento
           model.fit(X_train, y_train)
           y_pred = model.predict(X_test)
           y_prob = model.predict_proba(X_test)[:, 1]

           # Metricas
           metrics = {
               "accuracy": accuracy_score(y_test, y_pred),
               "roc_auc": roc_auc_score(y_test, y_prob),
               "f1_score": f1_score(y_test, y_pred),
               "churn_precision": classification_report(y_test, y_pred,
                                                         output_dict=True)['1']['precision'],
               "churn_recall": classification_report(y_test, y_pred,
                                                       output_dict=True)['1']['recall']
           }
           mlflow.log_metrics(metrics)

           # Artefacto: confusion matrix como imagen
           fig, ax = plt.subplots(figsize=(6, 5))
           cm = confusion_matrix(y_test, y_pred)
           sns.heatmap(cm, annot=True, fmt='d', ax=ax,
                       xticklabels=['No churn', 'Churn'],
                       yticklabels=['No churn', 'Churn'])
           ax.set_title(f'Confusion Matrix - {model_name}')
           plt.tight_layout()
           plt.savefig('confusion_matrix.png')
           mlflow.log_artifact('confusion_matrix.png')
           plt.close()

           # Registra el modelo
           mlflow.sklearn.log_model(model, "model",
                                     registered_model_name=f"CNT_{model_name}")

           print(f"{model_name}: AUC={metrics['roc_auc']:.4f} F1={metrics['f1_score']:.4f}")
           return metrics['roc_auc']
   ```

4. Ejecuta la grilla de experimentos:
   ```python
   experimentos = [
       ("LogisticRegression", LogisticRegression(C=0.1, max_iter=1000),
        {"C": 0.1, "solver": "lbfgs"}),
       ("LogisticRegression", LogisticRegression(C=1.0, max_iter=1000),
        {"C": 1.0, "solver": "lbfgs"}),
       ("RandomForest_50", RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42),
        {"n_estimators": 50, "max_depth": 5}),
       ("RandomForest_200", RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42),
        {"n_estimators": 200, "max_depth": 10}),
       ("GBM_slow", GradientBoostingClassifier(n_estimators=100, lr=0.1, random_state=42),
        {"n_estimators": 100, "learning_rate": 0.1}),
       ("GBM_fast", GradientBoostingClassifier(n_estimators=200, lr=0.05, random_state=42),
        {"n_estimators": 200, "learning_rate": 0.05}),
   ]

   resultados = []
   for nombre, modelo, params in experimentos:
       auc = run_experiment(nombre, modelo, params, X_train, X_test, y_train, y_test)
       resultados.append((nombre, params, auc))

   # Mejor modelo
   mejor = max(resultados, key=lambda x: x[2])
   print(f"\nMejor modelo: {mejor[0]} | AUC: {mejor[2]:.4f}")
   ```

5. Lanza la UI de MLflow para comparar visualmente:
   ```bash
   mlflow ui --port 5000
   # Abre http://localhost:5000 en el navegador
   ```
   Explora: compara las metricas de los 6 experimentos, revisa los artefactos (confusion matrices), y muestra el historial del modelo registrado.

6. Promueve el mejor modelo al stage "Production":
   ```python
   from mlflow.tracking import MlflowClient

   client = MlflowClient()
   # Lista todas las versiones del modelo
   versiones = client.search_model_versions("name='CNT_GBM_slow'")
   mejor_version = max(versiones, key=lambda v: float(v.tags.get('roc_auc', 0)))

   client.transition_model_version_stage(
       name="CNT_GBM_slow",
       version=mejor_version.version,
       stage="Production",
       archive_existing_versions=True
   )
   print(f"Modelo v{mejor_version.version} promovido a Production")
   ```

## Usa IA para...

- Pedirle a Claude que compare MLflow vs Weights & Biases vs Neptune.ai para un equipo de 5 data scientists en Ecuador (considera costo, curva de aprendizaje, integraciones)
- Preguntar como implementar MLflow en produccion en AWS (MLflow Tracking Server + S3 para artefactos + RDS para metadata)
- Si mlflow.sklearn.log_model falla por dependencias de version, preguntar como solucionar el problema de entorno con MLflow's `conda_env` o `pip_requirements`
- Generar el codigo para hacer hyperparameter tuning con Optuna y loguear cada trial automaticamente en MLflow

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que es un "run" en MLflow y que informacion almacena
- Cual es la diferencia entre el Tracking Server, Model Registry y Artifact Store de MLflow
- Que significa "promover un modelo a Production" en el Model Registry y como protege de regresiones
- Por que MLflow es importante para auditoria y cumplimiento en sectores regulados como banca y salud en Ecuador

## Reto Extra

Implementa hyperparameter optimization automatica con Optuna integrado con MLflow. Define un espacio de busqueda para GradientBoosting (n_estimators: 50-300, learning_rate: 0.01-0.3, max_depth: 3-8) y ejecuta 30 trials. Cada trial se loguea automaticamente en MLflow. Al final, el mejor trial se promueve automaticamente al Model Registry. Genera un grafico de la superficie de hiperparametros (Optuna tiene `plot_contour` y `plot_param_importances` integrados). Cuanto mejora el AUC con optimizacion vs el mejor experimento manual?
