# Ejercicio Sesion 5: APIs de ML con FastAPI

**Materia:** MLOps y Despliegue de Modelos
**Nivel:** Avanzado
**Herramienta IA:** Copilot
**Duracion:** 55 min

## Objetivo

Construir APIs de machine learning de nivel produccion con FastAPI: endpoints de prediccion con validacion de entrada (Pydantic), documentacion automatica (Swagger), health checks, versionado de API, manejo de errores, autenticacion con API keys y tests automatizados.

## Contexto (Ecuador)

La empresa de seguros Seguros Equinoccial del Ecuador quiere exponer su modelo de calculo de prima de seguro vehicular como una API que consuman: el portal web de cotizacion, la app movil y 300 agentes de seguros en todo el pais. Necesitan una API robusta, documentada y con autenticacion que soporte 1,000 peticiones por minuto en temporada alta (renovaciones de enero).

## Instrucciones

1. Instala en tu entorno local:
   ```bash
   pip install fastapi uvicorn pydantic scikit-learn pandas pytest httpx
   ```

2. Entrena y guarda el modelo de prima de seguro:
   ```python
   # scripts/train_seguro.py
   import pickle
   import numpy as np
   import pandas as pd
   from sklearn.ensemble import GradientBoostingRegressor
   from sklearn.preprocessing import LabelEncoder

   np.random.seed(42)
   n = 5000
   marcas = ['Toyota', 'Chevrolet', 'Kia', 'Hyundai', 'Mazda', 'Ford']
   provincias = ['Pichincha', 'Guayas', 'Azuay', 'Manabi', 'Tungurahua']

   df = pd.DataFrame({
       'anio_vehiculo': np.random.randint(2010, 2025, n),
       'cilindrada': np.random.choice([1000, 1400, 1600, 1800, 2000, 2500], n),
       'edad_conductor': np.random.randint(18, 70, n),
       'anios_licencia': np.random.randint(0, 40, n),
       'siniestros_prev': np.random.poisson(0.5, n),
       'marca': np.random.choice(marcas, n),
       'provincia': np.random.choice(provincias, n),
   })

   le_marca = LabelEncoder().fit(marcas)
   le_prov  = LabelEncoder().fit(provincias)
   df['marca_enc'] = le_marca.transform(df['marca'])
   df['prov_enc']  = le_prov.transform(df['provincia'])

   # Prima simulada (USD/año)
   df['prima'] = (
       (2025 - df['anio_vehiculo']) * 15 +
       df['cilindrada'] * 0.1 +
       np.where(df['edad_conductor'] < 25, 200, 0) +
       df['siniestros_prev'] * 150 +
       np.random.normal(0, 50, n)
   ).clip(200, 2000)

   features = ['anio_vehiculo', 'cilindrada', 'edad_conductor',
               'anios_licencia', 'siniestros_prev', 'marca_enc', 'prov_enc']
   X = df[features]
   y = df['prima']

   model = GradientBoostingRegressor(n_estimators=200, random_state=42)
   model.fit(X, y)

   with open('models/modelo_prima.pkl', 'wb') as f:
       pickle.dump({
           'model': model, 'features': features,
           'le_marca': le_marca, 'le_prov': le_prov,
           'marcas': marcas, 'provincias': provincias
       }, f)
   print("Modelo prima guardado.")
   ```

3. Construye la API con FastAPI:
   ```python
   # app/main.py
   from fastapi import FastAPI, HTTPException, Depends, status
   from fastapi.security.api_key import APIKeyHeader
   from pydantic import BaseModel, Field, validator
   from typing import Optional, List
   import pickle
   import numpy as np
   import time
   import os

   # Carga el modelo al iniciar (no en cada peticion)
   with open('models/modelo_prima.pkl', 'rb') as f:
       artefactos = pickle.load(f)

   model    = artefactos['model']
   features = artefactos['features']
   le_marca = artefactos['le_marca']
   le_prov  = artefactos['le_prov']

   # Configuracion de la API
   app = FastAPI(
       title="API de Prima de Seguro Vehicular - Seguros Equinoccial Ecuador",
       description="Calcula la prima anual de seguro vehicular basada en modelo ML",
       version="1.0.0",
       contact={"name": "Equipo Data Science", "email": "ds@segurosequinoccial.com.ec"}
   )

   # Autenticacion con API Key
   API_KEY_HEADER = APIKeyHeader(name="X-API-Key")
   VALID_KEYS = {"sk-agente-001", "sk-agente-002", "sk-portal-web", "sk-app-movil"}

   def verificar_api_key(api_key: str = Depends(API_KEY_HEADER)):
       if api_key not in VALID_KEYS:
           raise HTTPException(status_code=403, detail="API Key invalida")
       return api_key

   # Modelos Pydantic para validacion
   class VehiculoInput(BaseModel):
       anio_vehiculo: int = Field(..., ge=2000, le=2025,
                                   description="Anio de fabricacion del vehiculo")
       cilindrada: int = Field(..., ge=600, le=5000,
                               description="Cilindrada en cc")
       edad_conductor: int = Field(..., ge=18, le=100,
                                    description="Edad del conductor principal")
       anios_licencia: int = Field(..., ge=0, le=60,
                                    description="Anos con licencia de conducir")
       siniestros_prev: int = Field(0, ge=0, le=10,
                                     description="Siniestros en los ultimos 3 años")
       marca: str = Field(..., description="Marca del vehiculo")
       provincia: str = Field(..., description="Provincia de circulacion")

       @validator('marca')
       def marca_valida(cls, v):
           marcas_validas = ['Toyota','Chevrolet','Kia','Hyundai','Mazda','Ford']
           if v not in marcas_validas:
               raise ValueError(f"Marca no reconocida. Validas: {marcas_validas}")
           return v

   class PrimaResponse(BaseModel):
       prima_anual_usd: float
       prima_mensual_usd: float
       nivel_riesgo: str
       modelo_version: str = "1.0"
       tiempo_inferencia_ms: float

   # Endpoints
   @app.get("/health", tags=["Sistema"])
   def health_check():
       return {"status": "healthy", "modelo_cargado": model is not None,
               "timestamp": time.time()}

   @app.get("/v1/marcas", tags=["Catalogo"])
   def listar_marcas():
       return {"marcas": artefactos['marcas']}

   @app.post("/v1/cotizar", response_model=PrimaResponse, tags=["Prediccion"])
   def cotizar_prima(vehiculo: VehiculoInput,
                     api_key: str = Depends(verificar_api_key)):
       inicio = time.time()

       try:
           marca_enc = le_marca.transform([vehiculo.marca])[0]
           prov_enc  = le_prov.transform([vehiculo.provincia])[0]
       except Exception:
           raise HTTPException(status_code=422, detail="Marca o provincia no valida")

       X = np.array([[vehiculo.anio_vehiculo, vehiculo.cilindrada,
                      vehiculo.edad_conductor, vehiculo.anios_licencia,
                      vehiculo.siniestros_prev, marca_enc, prov_enc]])

       prima = float(model.predict(X)[0])
       tiempo_ms = (time.time() - inicio) * 1000

       return PrimaResponse(
           prima_anual_usd=round(prima, 2),
           prima_mensual_usd=round(prima / 12, 2),
           nivel_riesgo="ALTO" if prima > 1000 else "MEDIO" if prima > 500 else "BAJO",
           tiempo_inferencia_ms=round(tiempo_ms, 2)
       )

   @app.post("/v1/cotizar/batch", tags=["Prediccion"])
   def cotizar_batch(vehiculos: List[VehiculoInput],
                     api_key: str = Depends(verificar_api_key)):
       if len(vehiculos) > 100:
           raise HTTPException(status_code=400, detail="Maximo 100 vehiculos por batch")
       return [cotizar_prima(v, api_key) for v in vehiculos]
   ```

4. Levanta la API y prueba:
   ```bash
   uvicorn app.main:app --reload --port 8000
   # Abre http://localhost:8000/docs -> Swagger UI automatico
   ```

   Prueba con curl:
   ```bash
   curl -X POST "http://localhost:8000/v1/cotizar" \
        -H "X-API-Key: sk-portal-web" \
        -H "Content-Type: application/json" \
        -d '{"anio_vehiculo":2020,"cilindrada":1600,"edad_conductor":30,
             "anios_licencia":8,"siniestros_prev":0,"marca":"Toyota",
             "provincia":"Pichincha"}'
   ```

5. Escribe tests automatizados:
   ```python
   # tests/test_api.py
   from fastapi.testclient import TestClient
   from app.main import app

   client = TestClient(app)
   HEADERS = {"X-API-Key": "sk-portal-web"}

   def test_health():
       r = client.get("/health")
       assert r.status_code == 200
       assert r.json()["status"] == "healthy"

   def test_cotizar_valido():
       payload = {"anio_vehiculo": 2020, "cilindrada": 1600,
                  "edad_conductor": 30, "anios_licencia": 8,
                  "siniestros_prev": 0, "marca": "Toyota", "provincia": "Pichincha"}
       r = client.post("/v1/cotizar", json=payload, headers=HEADERS)
       assert r.status_code == 200
       assert r.json()["prima_anual_usd"] > 0

   def test_api_key_invalida():
       r = client.post("/v1/cotizar", json={}, headers={"X-API-Key": "fake"})
       assert r.status_code == 403

   def test_marca_invalida():
       payload = {"anio_vehiculo": 2020, "cilindrada": 1600,
                  "edad_conductor": 30, "anios_licencia": 8,
                  "siniestros_prev": 0, "marca": "Ferrari", "provincia": "Pichincha"}
       r = client.post("/v1/cotizar", json=payload, headers=HEADERS)
       assert r.status_code == 422  # Validacion Pydantic
   ```
   ```bash
   pytest tests/ -v
   ```

## Usa IA para...

- Pedirle a Copilot que genere el endpoint de batch processing con manejo de errores parciales (si 1 de 50 vehiculos falla, retorna error para ese y exito para los demas)
- Preguntar como agregar rate limiting (max 1000 req/min) a FastAPI usando `slowapi` para proteger la API en produccion
- Si la API es lenta en cargar el modelo (>2 segundos de startup), preguntar como pre-cargar el modelo usando `@app.on_event("startup")` y el patron de dependency injection de FastAPI
- Pedir el codigo para agregar logging estructurado (JSON) a cada peticion, incluyendo: api_key, latencia, input_hash y output, para auditoria del regulador de seguros

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Por que FastAPI es preferible a Flask para APIs de ML en produccion (async, validacion automatica, OpenAPI docs)
- Que hace Pydantic con los datos de entrada antes de que lleguen a tu funcion de prediccion
- Por que el modelo debe cargarse al iniciar la app y no en cada peticion (latencia vs memoria)
- Que es el principio "fail fast" y como los validators de Pydantic lo implementan para tu API

## Reto Extra

Implementa versionado de API real: agrega `/v2/cotizar` que usa un segundo modelo (XGBoost) y devuelve ademas la distribucion de incertidumbre (percentil 10, 50 y 90 de la prima). El endpoint v1 continua funcionando sin cambios. Usa `APIRouter` de FastAPI para organizar las versiones en archivos separados. Agrega un endpoint `/v1/compare-with-v2` que llama a ambos modelos y retorna ambas predicciones para que el usuario decida. Documenta las diferencias en el Swagger con `deprecated=True` para v1.
