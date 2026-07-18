# Ejercicio Sesion 4: Containerizacion con Docker Basico

**Materia:** MLOps y Despliegue de Modelos
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion:** 50 min

## Objetivo

Dominar Docker para containerizar modelos de ML: escribir Dockerfiles eficientes para aplicaciones Python/ML, construir imagenes, ejecutar contenedores con variables de entorno y volumenes, y publicar en Docker Hub para distribucion del modelo como un artefacto portable.

## Contexto (Ecuador)

La startup FinTech ecuatoriana Kushki (procesador de pagos con presencia en 9 paises de Latinoamerica) tiene un modelo de deteccion de fraude que debe desplegarse en 9 paises con infraestructuras diferentes. Docker permite que el mismo contenedor funcione identicamente en AWS, Google Cloud o en un servidor on-premise en Bogota, Lima o Quito. "Works on my machine" desaparece con Docker.

## Instrucciones

1. Prerequisito: Instala Docker Desktop en tu computador (Mac/Windows/Linux). Verifica:
   ```bash
   docker --version
   docker run hello-world
   ```

2. Prepara el modelo a containerizar. Crea la estructura del proyecto:
   ```bash
   mkdir proyecto_kushki_fraude
   cd proyecto_kushki_fraude
   mkdir -p src models data
   ```

3. Entrena y guarda el modelo de fraude:
   ```python
   # src/train.py
   import pickle
   import json
   import numpy as np
   import pandas as pd
   from sklearn.ensemble import IsolationForest
   from sklearn.preprocessing import StandardScaler

   np.random.seed(42)
   n_normal = 9500
   n_fraude = 500

   df = pd.DataFrame({
       'monto': np.concatenate([
           np.random.lognormal(4, 1, n_normal),
           np.random.lognormal(7, 0.5, n_fraude)
       ]),
       'hora': np.concatenate([
           np.random.normal(14, 4, n_normal),
           np.random.uniform(2, 5, n_fraude)  # Fraudes de madrugada
       ]),
       'frecuencia_dia': np.concatenate([
           np.random.poisson(3, n_normal),
           np.random.poisson(15, n_fraude)
       ]),
       'pais_destino_diferente': np.concatenate([
           np.random.binomial(1, 0.1, n_normal),
           np.random.binomial(1, 0.8, n_fraude)
       ])
   })

   scaler = StandardScaler()
   X_scaled = scaler.fit_transform(df)

   modelo = IsolationForest(contamination=0.05, random_state=42)
   modelo.fit(X_scaled)

   with open('models/modelo_fraude.pkl', 'wb') as f:
       pickle.dump({'modelo': modelo, 'scaler': scaler,
                    'features': list(df.columns)}, f)

   print("Modelo guardado en models/modelo_fraude.pkl")
   ```

4. Crea la aplicacion de prediccion:
   ```python
   # src/predict.py
   import pickle
   import numpy as np
   import sys
   import json

   with open('models/modelo_fraude.pkl', 'rb') as f:
       artefactos = pickle.load(f)

   modelo = artefactos['modelo']
   scaler = artefactos['scaler']
   features = artefactos['features']

   def predecir(transaccion: dict) -> dict:
       X = np.array([[transaccion[f] for f in features]])
       X_scaled = scaler.transform(X)
       score = modelo.score_samples(X_scaled)[0]
       es_fraude = score < -0.3  # Umbral ajustable
       return {
           "es_fraude": bool(es_fraude),
           "score_anomalia": float(score),
           "riesgo": "ALTO" if score < -0.5 else "MEDIO" if score < -0.3 else "BAJO"
       }

   if __name__ == "__main__":
       ejemplo = {"monto": 5000, "hora": 3, "frecuencia_dia": 20,
                  "pais_destino_diferente": 1}
       print(json.dumps(predecir(ejemplo), indent=2))
   ```

5. Crea el archivo `requirements.txt`:
   ```
   scikit-learn==1.3.2
   numpy==1.24.4
   pandas==2.1.0
   ```

6. Escribe el `Dockerfile`:
   ```dockerfile
   # Imagen base: Python slim para minimizar tamano
   FROM python:3.11-slim

   # Metadata
   LABEL maintainer="ITSEIA - Proyecto Kushki Fraude"
   LABEL version="1.0"
   LABEL description="Modelo de deteccion de fraude para pagos en Ecuador/LATAM"

   # Variables de entorno
   ENV PYTHONDONTWRITEBYTECODE=1 \
       PYTHONUNBUFFERED=1 \
       MODEL_VERSION=1.0 \
       LOG_LEVEL=INFO

   # Directorio de trabajo en el contenedor
   WORKDIR /app

   # Instala dependencias primero (capa cacheable)
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   # Copia el codigo y el modelo
   COPY src/ ./src/
   COPY models/ ./models/

   # Usuario no-root por seguridad (buena practica en produccion)
   RUN adduser --disabled-password --gecos '' appuser
   USER appuser

   # Comando por defecto
   CMD ["python", "src/predict.py"]
   ```

7. Construye y ejecuta el contenedor:
   ```bash
   # Construye la imagen
   docker build -t kushki-fraude:1.0 .

   # Verifica que se creo
   docker images | grep kushki-fraude

   # Ejecuta el contenedor
   docker run --rm kushki-fraude:1.0

   # Ejecuta con variable de entorno personalizada
   docker run --rm -e MODEL_VERSION=2.0 kushki-fraude:1.0

   # Monta un volumen para leer nuevos datos
   docker run --rm -v $(pwd)/data:/app/data kushki-fraude:1.0

   # Modo interactivo para debug
   docker run -it --rm kushki-fraude:1.0 bash
   ```

8. Analiza el tamano de la imagen y optimizalo:
   ```bash
   docker image inspect kushki-fraude:1.0 --format='{{.Size}}'

   # Prueba con python:3.11-alpine para imagen mas pequena
   # Pero cuidado: Alpine puede tener problemas con numpy/scikit-learn

   # Multi-stage build para separar build de runtime
   ```
   Escribe un `Dockerfile.optimizado` con multi-stage build y compara el tamano.

9. Publica en Docker Hub:
   ```bash
   docker login
   docker tag kushki-fraude:1.0 tu-usuario/kushki-fraude:1.0
   docker push tu-usuario/kushki-fraude:1.0

   # Cualquiera puede descargar y ejecutar:
   docker pull tu-usuario/kushki-fraude:1.0
   ```

## Usa IA para...

- Pedirle a ChatGPT que explique por que los layers de Docker se cachean y en que orden deben ir las instrucciones para maximizar la cache (COPY requirements antes que el codigo)
- Preguntar la diferencia entre `CMD` y `ENTRYPOINT` en un Dockerfile: cual usar para una aplicacion de ML
- Si el contenedor ocupa 2GB, preguntar las tecnicas para reducirlo: imagen slim, --no-cache-dir, multi-stage build, .dockerignore
- Generar el archivo `.dockerignore` correcto para un proyecto de ML con Python (que excluir: __pycache__, .git, data/raw, *.ipynb, venv)

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Que es una "imagen" Docker vs un "contenedor" en ejecucion (analoga a clase vs instancia)
- Por que el orden de las instrucciones en el Dockerfile importa para la cache de layers
- Que es el multi-stage build y como reduce el tamano de la imagen final
- Por que correr el contenedor como usuario no-root es una practica de seguridad critica en produccion

## Reto Extra

Crea un `docker-compose.yml` que levante dos servicios: el modelo de fraude (contenedor 1) y un Redis (contenedor 2) para caching de predicciones. El modelo primero busca en Redis si ya proceso esa transaccion (cache hit), y si no, calcula y guarda el resultado en Redis con TTL de 1 hora. Esto simula un sistema de alta disponibilidad real donde el mismo modelo puede recibir la misma transaccion desde multiples nodos de pago y responder en <1ms gracias al cache.
