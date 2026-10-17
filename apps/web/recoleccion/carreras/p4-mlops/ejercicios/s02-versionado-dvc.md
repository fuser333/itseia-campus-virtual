# Ejercicio Sesion 2: Versionado de Datos y Modelos con DVC

**Materia:** MLOps y Despliegue de Modelos
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion:** 50 min

## Objetivo

Implementar versionado de datos y modelos con DVC (Data Version Control) integrado con Git, creando un pipeline reproducible donde cada version del modelo esta ligada a los datos exactos con los que fue entrenada, permitiendo reproducir cualquier experimento pasado en el contexto de un proyecto de ML ecuatoriano.

## Contexto (Ecuador)

La empresa Pronaca (el mayor productor de alimentos del Ecuador: Mr. Pollo, Mr. Cook, Gustadina) tiene un modelo de prediccion de demanda de productos que alimenta su sistema de logistica. El equipo de data science tiene 5 cientificos de datos, todos trabajando en el mismo modelo. Sin versionado de datos, nadie sabe con que datos se enteno cada version del modelo. DVC resuelve este caos.

## Instrucciones

1. Este ejercicio se realiza LOCAL (usa tu terminal, no Colab). Prerequisito: tener Git y Python instalados.
   ```bash
   pip install dvc dvc-gdrive scikit-learn pandas matplotlib
   ```

2. Crea el proyecto desde cero:
   ```bash
   mkdir proyecto_pronaca_demanda
   cd proyecto_pronaca_demanda
   git init
   git config user.email "tu@email.com"
   git config user.name "Tu Nombre"
   dvc init
   git status  # Ver los archivos que DVC creo
   git add .
   git commit -m "feat: inicializa DVC en proyecto Pronaca"
   ```

3. Crea el dataset inicial (demanda historica de productos):
   ```python
   # scripts/generar_datos.py
   import pandas as pd
   import numpy as np

   np.random.seed(42)
   fechas = pd.date_range('2020-01-01', '2024-12-31', freq='D')
   productos = ['Pollo_Entero', 'Pechuga', 'Muslo', 'Carne_Molida', 'Salchicha']

   rows = []
   for producto in productos:
       base_demand = np.random.randint(500, 2000)
       for fecha in fechas:
           # Tendencia + estacionalidad + ruido
           tendencia = base_demand * (1 + 0.0002 * (fecha - fechas[0]).days)
           estacional = 1.2 if fecha.month in [12, 1] else 0.9 if fecha.month in [6,7] else 1.0
           demanda = int(tendencia * estacional + np.random.normal(0, 50))
           rows.append({'fecha': fecha, 'producto': producto, 'demanda': max(0, demanda)})

   df = pd.DataFrame(rows)
   df.to_csv('data/raw/demanda_pronaca.csv', index=False)
   print(f"Dataset creado: {len(df)} registros")
   ```

   ```bash
   mkdir -p data/raw data/processed models
   python scripts/generar_datos.py
   ```

4. Agrega los datos a DVC (NO a Git):
   ```bash
   # Agrega el archivo de datos a DVC
   dvc add data/raw/demanda_pronaca.csv

   # Esto crea demanda_pronaca.csv.dvc (el puntero que SI va a Git)
   git add data/raw/demanda_pronaca.csv.dvc data/.gitignore
   git commit -m "data: agrega dataset inicial demanda 2020-2024"

   # Configura remote storage (usa Google Drive gratis o directorio local)
   dvc remote add -d myremote gdrive://TU_FOLDER_ID
   # O para prueba local:
   dvc remote add -d localremote /tmp/dvc_storage
   dvc push  # Sube los datos al storage
   ```

5. Crea el pipeline de ML con DVC:
   ```bash
   # dvc.yaml define el pipeline completo
   ```
   ```yaml
   # dvc.yaml
   stages:
     preprocesar:
       cmd: python scripts/preprocesar.py
       deps:
         - data/raw/demanda_pronaca.csv
         - scripts/preprocesar.py
       outs:
         - data/processed/features.csv
         - data/processed/targets.csv

     entrenar:
       cmd: python scripts/entrenar.py
       deps:
         - data/processed/features.csv
         - data/processed/targets.csv
         - scripts/entrenar.py
       outs:
         - models/modelo_demanda.pkl
       metrics:
         - metrics/scores.json:
             cache: false
       plots:
         - metrics/feature_importance.csv:
             cache: false
   ```

6. Implementa los scripts del pipeline:
   ```python
   # scripts/preprocesar.py
   import pandas as pd
   import numpy as np
   from sklearn.preprocessing import LabelEncoder

   df = pd.read_csv('data/raw/demanda_pronaca.csv')
   df['fecha'] = pd.to_datetime(df['fecha'])
   df['mes'] = df['fecha'].dt.month
   df['dia_semana'] = df['fecha'].dt.dayofweek
   df['trimestre'] = df['fecha'].dt.quarter
   df['es_fin_de_año'] = (df['mes'] == 12).astype(int)

   le = LabelEncoder()
   df['producto_enc'] = le.fit_transform(df['producto'])

   features = df[['mes', 'dia_semana', 'trimestre', 'es_fin_de_año', 'producto_enc']]
   targets = df['demanda']

   features.to_csv('data/processed/features.csv', index=False)
   targets.to_csv('data/processed/targets.csv', index=False)
   ```

   ```python
   # scripts/entrenar.py
   import pandas as pd
   import pickle
   import json
   from sklearn.ensemble import RandomForestRegressor
   from sklearn.model_selection import train_test_split
   from sklearn.metrics import mean_absolute_error, r2_score

   X = pd.read_csv('data/processed/features.csv')
   y = pd.read_csv('data/processed/targets.csv').squeeze()

   X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
   modelo = RandomForestRegressor(n_estimators=100, random_state=42)
   modelo.fit(X_train, y_train)

   mae = mean_absolute_error(y_test, modelo.predict(X_test))
   r2  = r2_score(y_test, modelo.predict(X_test))

   with open('metrics/scores.json', 'w') as f:
       json.dump({'mae': mae, 'r2': r2}, f, indent=2)
   with open('models/modelo_demanda.pkl', 'wb') as f:
       pickle.dump(modelo, f)

   print(f"MAE: {mae:.1f} unidades | R2: {r2:.4f}")
   ```

7. Ejecuta el pipeline y versiona:
   ```bash
   dvc repro                  # Ejecuta solo los stages que cambiaron
   git add dvc.lock metrics/
   git commit -m "model: v1.0 RandomForest MAE=X R2=Y"
   git tag v1.0
   ```

8. Simula un segundo experimento con nuevos datos (agrega 2025) y nuevo modelo:
   - Regenera datos incluyendo 2025
   - Cambia el modelo a GradientBoosting
   - Ejecuta `dvc repro`
   - Compara metricas: `dvc metrics diff v1.0`
   - Commit y tag v2.0

## Usa IA para...

- Pedirle a ChatGPT que explique la diferencia entre DVC y Git LFS para versionado de datos grandes
- Preguntar como DVC maneja datasets de 10GB+ (ej: imagenes satelitales del Ecuador para deteccion deforestacion)
- Si `dvc repro` falla por dependencias circulares, pedir como diagnosticar el grafo DAG del pipeline
- Pedir el comando para ver el historial completo de experimentos y comparar las metricas de todas las versiones

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Por que Git no es suficiente para versionar datos de ML (tamano de archivos, binarios)
- Que es un "pipeline DAG" en DVC y como garantiza la reproducibilidad
- Como `dvc repro` decide cuales stages re-ejecutar (checksum de dependencias)
- Como recuperar exactamente la version v1.0 del modelo con sus datos originales desde cualquier maquina

## Reto Extra

Implementa DVC con remote storage en AWS S3. Crea un bucket S3 gratuito (12 meses free tier) y configura DVC para sincronizar los datos ahi: `dvc remote add -d s3remote s3://tu-bucket-pronaca`. Agrega un archivo `.github/workflows/dvc_check.yml` para que GitHub Actions ejecute automaticamente `dvc repro` cuando hay un push al repositorio. Esto cierra el loop de CI/CD para datos y modelos de ML.
