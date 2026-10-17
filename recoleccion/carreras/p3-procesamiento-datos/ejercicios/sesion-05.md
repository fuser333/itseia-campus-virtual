# Ejercicio Sesion 5: APIs — Consumir Datos

**Materia:** Procesamiento de Datos
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion estimada:** 40 min

## Objetivo

Consumir APIs REST publicas y privadas para ingestar datos en pipelines: autenticacion (API keys, Bearer tokens, OAuth2), manejo de paginacion, rate limits, errores HTTP, y transformacion de respuestas JSON a DataFrames listos para analisis.

## Contexto

El BCE, INEC y organismos internacionales exponen datos de Ecuador a traves de APIs REST. En lugar de descargar CSVs manualmente cada mes, un pipeline puede llamar la API automaticamente, paginar resultados, manejar errores de red y guardar datos estructurados. Las APIs son la fuente de datos mas confiable para pipelines productivos.

## Instrucciones

1. Crea el archivo `sesion05_apis_datos_ecuador.py`:

```python
# APIs REST — Consumir Datos
# ITSEIA - Procesamiento de Datos
# Autenticacion, paginacion, errores, transformacion

import requests
import pandas as pd
import numpy as np
import json
import time
from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

print("=" * 65)
print("APIs REST — CONSUMO DE DATOS PUBLICOS ECUADOR")
print("=" * 65)

# ================================================
# CONCEPTOS CLAVE DE APIs REST
# ================================================
print("\n--- CONCEPTOS API REST ---")
conceptos = {
    "Endpoint":      "URL del recurso: GET /api/v1/indicadores",
    "HTTP Methods":  "GET (leer), POST (crear), PUT (actualizar), DELETE",
    "Status Codes":  "200 OK, 201 Created, 400 Bad Request, 401 Unauth, 429 Rate Limit",
    "Headers":       "Authorization, Content-Type, Accept, X-API-Key",
    "Query Params":  "?fecha_inicio=2024-01&limite=100&pagina=2",
    "Rate Limit":    "Max requests/hora — respetar para no ser bloqueado",
    "Paginacion":    "next_page, total_pages, offset/limit para datasets grandes",
}
for k, v in conceptos.items():
    print(f"  {k:<18}: {v}")

# ================================================
# SIMULADOR DE API BCE ECUADOR
# ================================================
print("\n--- SIMULADOR: API BCE ECUADOR ---")

class ApiBCESimulada:
    """Simula la API del Banco Central del Ecuador."""

    BASE_URL = "https://contenido.bce.fin.ec/api/v1"
    RATE_LIMIT = 60  # requests por minuto

    DATOS_INFLACION = [
        {"periodo": f"2024-{m:02d}", "indicador": "inflacion_mensual",
         "valor": round(np.random.uniform(0.2, 0.7), 2), "unidad": "%"}
        for m in range(1, 13)
    ]
    DATOS_TASAS = [
        {"periodo": f"2024-{m:02d}", "indicador": "tasa_activa",
         "valor": round(np.random.uniform(8.8, 9.5), 2), "unidad": "%"}
        for m in range(1, 13)
    ]
    DATOS_REMESAS = [
        {"periodo": f"2024-{m:02d}", "indicador": "remesas_millones_usd",
         "valor": round(np.random.uniform(900, 1300), 1), "unidad": "MUSD"}
        for m in range(1, 13)
    ]

    def get(self, endpoint, params=None, headers=None):
        """Simula request GET con validaciones."""
        params = params or {}
        headers = headers or {}

        # Validar API key
        api_key = headers.get("X-API-Key", "")
        if not api_key.startswith("bce_"):
            return {"status": 401, "error": "API key invalida o ausente"}

        # Enrutamiento
        if endpoint == "/indicadores/inflacion":
            datos = self.DATOS_INFLACION
        elif endpoint == "/indicadores/tasas":
            datos = self.DATOS_TASAS
        elif endpoint == "/indicadores/remesas":
            datos = self.DATOS_REMESAS
        else:
            return {"status": 404, "error": f"Endpoint {endpoint} no encontrado"}

        # Paginacion
        limite = int(params.get("limite", 10))
        pagina = int(params.get("pagina", 1))
        inicio = (pagina - 1) * limite
        fin = inicio + limite
        pagina_datos = datos[inicio:fin]
        total_paginas = (len(datos) + limite - 1) // limite

        return {
            "status": 200,
            "data": pagina_datos,
            "meta": {
                "total": len(datos),
                "pagina": pagina,
                "total_paginas": total_paginas,
                "limite": limite,
                "next_page": pagina + 1 if pagina < total_paginas else None
            }
        }

np.random.seed(2026)
api_bce = ApiBCESimulada()

# ================================================
# CLIENTE API CON AUTENTICACION
# ================================================
print("\n--- CLIENTE API CON AUTENTICACION ---")

class ClienteAPIEcuador:
    """
    Cliente generico para APIs publicas Ecuador.
    Maneja: autenticacion, paginacion, errores, reintentos.
    """

    def __init__(self, api_key, max_retries=3, delay=1.0):
        self.api_key = api_key
        self.max_retries = max_retries
        self.delay = delay
        self.headers = {
            "X-API-Key": api_key,
            "Accept": "application/json",
            "User-Agent": "ITSEIA-DataPipeline/1.0"
        }
        self._request_count = 0

    def get_paginated(self, api_sim, endpoint, params=None):
        """Obtiene todos los datos con paginacion automatica."""
        params = params or {}
        params["pagina"] = 1
        params["limite"] = 4  # limite pequeno para demo

        todos_datos = []
        pagina_actual = 1

        while True:
            params["pagina"] = pagina_actual
            respuesta = self._request_con_reintento(api_sim, endpoint, params)

            if respuesta is None:
                print(f"  ERROR: No se pudo obtener pagina {pagina_actual}")
                break

            todos_datos.extend(respuesta["data"])
            meta = respuesta["meta"]

            print(f"  Pagina {meta['pagina']}/{meta['total_paginas']} "
                  f"| {len(respuesta['data'])} registros | "
                  f"Total acumulado: {len(todos_datos)}")

            if meta["next_page"] is None:
                break
            pagina_actual = meta["next_page"]
            time.sleep(self.delay * 0.1)  # delay reducido para demo

        return todos_datos

    def _request_con_reintento(self, api_sim, endpoint, params):
        """Request con backoff exponencial en errores."""
        for intento in range(self.max_retries):
            respuesta = api_sim.get(endpoint, params=params, headers=self.headers)
            self._request_count += 1

            if respuesta["status"] == 200:
                return respuesta
            elif respuesta["status"] == 429:
                wait = 2 ** intento
                print(f"  Rate limit. Esperando {wait}s...")
                time.sleep(wait * 0.01)  # reducido para demo
            elif respuesta["status"] == 401:
                print(f"  Error autenticacion: {respuesta['error']}")
                return None
            elif respuesta["status"] >= 500:
                print(f"  Error servidor (intento {intento+1}): {respuesta['error']}")
                time.sleep(0.5)
            else:
                print(f"  Error {respuesta['status']}: {respuesta.get('error')}")
                return None

        return None

# Uso del cliente
cliente = ClienteAPIEcuador(api_key="bce_demo_key_2024")
print("\n  Descargando datos de inflacion (paginado):")
datos_inflacion = cliente.get_paginated(api_bce, "/indicadores/inflacion")
print(f"  Total descargado: {len(datos_inflacion)} registros")

print("\n  Descargando tasas de interes:")
datos_tasas = cliente.get_paginated(api_bce, "/indicadores/tasas")

print("\n  Descargando remesas:")
datos_remesas = cliente.get_paginated(api_bce, "/indicadores/remesas")

print(f"\n  Total requests realizados: {cliente._request_count}")

# ================================================
# TRANSFORMACION JSON → DATAFRAME
# ================================================
print("\n--- TRANSFORMACION JSON → DATAFRAME ---")

def json_a_dataframe(datos_lista, nombre_fuente):
    """Convierte lista de dicts JSON a DataFrame estructurado."""
    df = pd.DataFrame(datos_lista)
    df["fecha"] = pd.to_datetime(df["periodo"])
    df["anio"] = df["fecha"].dt.year
    df["mes"] = df["fecha"].dt.month
    df["fuente"] = nombre_fuente
    df["procesado_en"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    return df.drop(columns=["fecha"])

df_inflacion = json_a_dataframe(datos_inflacion, "BCE-API")
df_tasas     = json_a_dataframe(datos_tasas,     "BCE-API")
df_remesas   = json_a_dataframe(datos_remesas,   "BCE-API")

print(f"\n  DataFrames creados:")
print(f"  Inflacion: {df_inflacion.shape} | Tasas: {df_tasas.shape} | Remesas: {df_remesas.shape}")
print(f"\n  Muestra inflacion:")
print(df_inflacion[["periodo","indicador","valor","unidad"]].head(6).to_string(index=False))

# ================================================
# MERGE DE MULTIPLES ENDPOINTS
# ================================================
print("\n--- MERGE: CONSOLIDAR ENDPOINTS ---")

df_pivot_inflacion = df_inflacion.set_index("periodo")["valor"].rename("inflacion_%")
df_pivot_tasas     = df_tasas.set_index("periodo")["valor"].rename("tasa_activa_%")
df_pivot_remesas   = df_remesas.set_index("periodo")["valor"].rename("remesas_MUSD")

df_consolidado = pd.concat([df_pivot_inflacion, df_pivot_tasas, df_pivot_remesas], axis=1).reset_index()
df_consolidado["tasa_real_%"] = (df_consolidado["tasa_activa_%"] -
                                  df_consolidado["inflacion_%"] * 12).round(3)
print("  Dashboard consolidado BCE 2024:")
print(df_consolidado.to_string(index=False))

# ================================================
# API CON AUTENTICACION BEARER TOKEN
# ================================================
print("\n--- EJEMPLO: BEARER TOKEN (OAuth2) ---")
print("  Patron para APIs que requieren Bearer token:")
print("""
  # 1. Obtener token
  resp_token = requests.post(
      "https://api.ejemplo.ec/oauth/token",
      data={"grant_type": "client_credentials",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET}
  )
  token = resp_token.json()["access_token"]
  expires_in = resp_token.json()["expires_in"]  # segundos

  # 2. Usar token en requests
  headers = {"Authorization": f"Bearer {token}"}
  datos = requests.get("https://api.ejemplo.ec/v1/datos", headers=headers)

  # 3. Renovar cuando expire
  if time.time() > token_expiry:
      token = renovar_token()
""")

# ================================================
# GUARDAR RESULTADO
# ================================================
df_consolidado.to_csv("indicadores_bce_api.csv", index=False)
print(f"  Guardado: indicadores_bce_api.csv ({len(df_consolidado)} periodos)")

print("\n" + "=" * 65)
print("APIs — PATRONES APRENDIDOS:")
print("  Autenticacion:  X-API-Key en headers o Bearer token OAuth2")
print("  Paginacion:     while next_page is not None: pagina += 1")
print("  Reintentos:     backoff exponencial (2^intento segundos)")
print("  Rate limit:     429 status — esperar y reintentar")
print("  Transformacion: json → DataFrame → pivot → merge")
print("=" * 65)
```

2. Implementa un cliente que consuma la API publica de la Reserva Federal de EE.UU. (`https://fred.stlouisfed.org/graph/fredgraph.csv?id=DEXUSNB`) que publica el tipo de cambio EUR/USD — util para Ecuador por su dolarizacion.

3. Agrega manejo de cache: si el archivo `cache_bce_{fecha}.json` ya existe, no hacer la request y usar el cache.

## Usa IA para...

> Abre Gemini y escribe:
> "Quiero consumir la API del Banco Mundial que publica indicadores de Ecuador (endpoint: https://api.worldbank.org/v2/country/EC/indicator/NY.GDP.MKTP.CD?format=json). La respuesta viene paginada con 'pages' y 'total'. ¿Como escribo un cliente Python que: 1) descargue todas las paginas, 2) maneje errores de red con reintentos, 3) transforme la respuesta en un DataFrame con columnas anio, pib_usd, pais? Dame el codigo completo."

Despues de leer la respuesta:
- Implementa el cliente para la API del Banco Mundial.
- Verifica que el GDP de Ecuador 2023 coincide con datos oficiales.

## Que aprendiste

- Los headers `X-API-Key` y `Authorization: Bearer TOKEN` son los dos metodos mas comunes de autenticacion en APIs REST.
- La paginacion se maneja iterando mientras `next_page` no sea `None` o mientras `pagina <= total_paginas`.
- El backoff exponencial (esperar `2^intento` segundos) evita saturar el servidor en errores temporales.
- El status code 429 significa "Too Many Requests" — siempre respetar el rate limit.
- `pd.concat([serie1, serie2], axis=1)` consolida multiples endpoints en un unico DataFrame.
- Cachear respuestas en JSON local evita re-consumir la API innecesariamente.

## Reto extra

Construye un pipeline de ingesta multi-fuente que consuma en paralelo (usando `concurrent.futures.ThreadPoolExecutor`) las APIs del BCE, Banco Mundial y CEPAL para Ecuador. Consolida todos los indicadores en un unico DataFrame, detecta inconsistencias entre fuentes (mismo indicador con valores diferentes) y genera un reporte de calidad. Guarda el resultado en Parquet para acceso eficiente posterior.
