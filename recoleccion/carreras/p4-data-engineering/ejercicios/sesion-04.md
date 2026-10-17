# Ejercicio Sesion 4: APIs y Microservicios de Datos

**Materia:** Data Engineering Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 45 min

## Objetivo

Construir APIs de datos con FastAPI: endpoints REST para consultar el data warehouse, autenticacion con JWT, rate limiting, caching con Redis, versionado de API, y patrones de diseño (CQRS, Event Sourcing) aplicados a la arquitectura de datos del BCE Ecuador.

## Contexto

El BCE Ecuador expone algunos indicadores economicos por API publica. Los desarrolladores de startups ecuatorianas necesitan APIs confiables, versionadas y bien documentadas para consumir datos del INEC, SRI y MSP. Construir una API de datos requiere pensar en autenticacion, performance (cache), limites de uso, y como versionar sin romper a los consumidores existentes.

## Instrucciones

1. Instala: `pip install fastapi uvicorn redis pyjwt`.

2. Crea el archivo `sesion04_api_datos_ecuador.py`:

```python
# APIs de Datos + FastAPI - ITSEIA
# Data Engineering Avanzado
# API BCE Ecuador: JWT + cache + rate limit + versionado

import pandas as pd
import numpy as np
import json
import time
import hashlib
from datetime import datetime, timedelta
from functools import wraps
from collections import defaultdict
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("APIs DE DATOS + FASTAPI — BCE ECUADOR")
print("=" * 65)

# ================================================
# DATOS: INDICADORES BCE ECUADOR
# ================================================
print("\n--- DATOS BASE: INDICADORES BCE ---")

fechas = pd.date_range("2020-01", "2024-12", freq="MS")
n = len(fechas)

db_indicadores = pd.DataFrame({
    "periodo":        [f.strftime("%Y-%m") for f in fechas],
    "inflacion":      np.cumsum(np.random.normal(0.03, 0.02, n)).clip(-2, 8).round(3),
    "tasa_activa":    np.random.uniform(8.5, 10.0, n).round(3),
    "tasa_pasiva":    np.random.uniform(3.5, 6.0, n).round(3),
    "remesas_musd":   np.random.uniform(800, 1400, n).round(1),
    "pib_var_pct":    np.random.uniform(-5, 5, n).round(2),
    "desempleo_pct":  np.random.uniform(3.5, 8.0, n).round(2),
})

print(f"  Dataset: {len(db_indicadores)} periodos de indicadores BCE")

# ================================================
# AUTENTICACION JWT (simulada)
# ================================================
print("\n--- AUTENTICACION JWT ---")

SECRET_KEY = "itseia_bce_api_secret_2024"

def crear_token(usuario, rol, duracion_horas=24):
    """Crea JWT token simulado."""
    payload = {
        "sub":   usuario,
        "rol":   rol,
        "iat":   datetime.now().isoformat(),
        "exp":   (datetime.now() + timedelta(hours=duracion_horas)).isoformat(),
        "jti":   hashlib.md5(f"{usuario}{time.time()}".encode()).hexdigest()
    }
    # En prod: jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    token = f"eyJ.{hashlib.sha256(json.dumps(payload).encode()).hexdigest()[:32]}.sig"
    return token, payload

def verificar_token_y_rol(token, rol_requerido, tokens_activos):
    """Verifica el token y el rol del usuario."""
    if token not in tokens_activos:
        return False, "Token invalido o expirado"
    payload = tokens_activos[token]
    if payload["rol"] not in (rol_requerido if isinstance(rol_requerido, list) else [rol_requerido]):
        return False, f"Rol insuficiente. Requiere: {rol_requerido}, tienes: {payload['rol']}"
    return True, payload

# Simular registro de usuarios
tokens_activos = {}
usuarios = [
    ("dev_startup_itseia", "developer"),
    ("analista_bce",       "analyst"),
    ("admin_api",          "admin"),
]
for usuario, rol in usuarios:
    token, payload = crear_token(usuario, rol)
    tokens_activos[token] = payload

print("  Tokens generados:")
for token, payload in list(tokens_activos.items()):
    print(f"  {payload['sub']:<25} | rol: {payload['rol']:<12} | token: {token[:30]}...")

# ================================================
# RATE LIMITING
# ================================================
print("\n--- RATE LIMITING ---")

class RateLimiter:
    """Rate limiter por ventana deslizante."""
    def __init__(self, max_requests, window_seconds):
        self.max_requests = max_requests
        self.window = window_seconds
        self.requests = defaultdict(list)

    def is_allowed(self, identifier):
        now = time.time()
        self.requests[identifier] = [
            ts for ts in self.requests[identifier]
            if ts > now - self.window
        ]
        if len(self.requests[identifier]) >= self.max_requests:
            return False, len(self.requests[identifier])
        self.requests[identifier].append(now)
        return True, len(self.requests[identifier])

limiter_free = RateLimiter(max_requests=100, window_seconds=3600)  # 100/hora
limiter_pro  = RateLimiter(max_requests=5000, window_seconds=3600) # 5000/hora

print("  Planes de rate limiting:")
planes = {
    "free":       "100 requests/hora | Solo indicadores publicos",
    "developer":  "5.000 requests/hora | Todos los endpoints",
    "enterprise": "Ilimitado | SLA 99.9% | soporte 24/7",
}
for plan, desc in planes.items():
    print(f"  {plan:<12}: {desc}")

# ================================================
# CACHE (simulado sin Redis)
# ================================================
print("\n--- CACHE EN MEMORIA ---")

cache = {}
CACHE_TTL = 300  # 5 minutos

def obtener_cache(key):
    if key in cache:
        valor, expira = cache[key]
        if time.time() < expira:
            return valor
        del cache[key]
    return None

def guardar_cache(key, valor, ttl=CACHE_TTL):
    cache[key] = (valor, time.time() + ttl)

# ================================================
# ENDPOINTS API (simulados)
# ================================================
print("\n--- ENDPOINTS API BCE ECUADOR ---")

class BceAPI:
    """Simula FastAPI con endpoints de datos BCE."""

    VERSION = "v1"

    def __init__(self, db, tokens, limiter):
        self.db = db
        self.tokens = tokens
        self.limiter = limiter
        self.request_log = []

    def _log_request(self, endpoint, usuario, status, tiempo_ms):
        self.request_log.append({
            "timestamp":  datetime.now().isoformat(),
            "endpoint":   endpoint,
            "usuario":    usuario,
            "status":     status,
            "tiempo_ms":  tiempo_ms,
        })

    def get_indicadores(self, token, periodo_inicio=None, periodo_fin=None,
                        indicadores=None, limite=12):
        """GET /api/v1/indicadores"""
        t0 = time.time()
        ok, payload = verificar_token_y_rol(token, ["developer","analyst","admin"],
                                             self.tokens)
        if not ok:
            self._log_request("/indicadores", "unknown", 401, 0)
            return {"status": 401, "error": payload}

        usuario = payload["sub"]
        permitido, cnt = self.limiter.is_allowed(usuario)
        if not permitido:
            self._log_request("/indicadores", usuario, 429, 0)
            return {"status": 429, "error": "Rate limit excedido", "requests_hora": cnt}

        # Cache check
        cache_key = f"indicadores_{periodo_inicio}_{periodo_fin}_{indicadores}_{limite}"
        cached = obtener_cache(cache_key)
        cache_hit = cached is not None
        if cached:
            self._log_request("/indicadores", usuario, 200, round((time.time()-t0)*1000,1))
            return {"status": 200, "data": cached, "from_cache": True}

        # Query
        df = self.db.copy()
        if periodo_inicio:
            df = df[df["periodo"] >= periodo_inicio]
        if periodo_fin:
            df = df[df["periodo"] <= periodo_fin]
        if indicadores:
            cols = ["periodo"] + [c for c in indicadores if c in df.columns]
            df = df[cols]
        df = df.tail(limite)

        resultado = df.to_dict(orient="records")
        guardar_cache(cache_key, resultado)

        tiempo = round((time.time()-t0)*1000, 1)
        self._log_request("/indicadores", usuario, 200, tiempo)
        return {
            "status": 200,
            "data": resultado,
            "meta": {"total": len(resultado), "periodo": f"{df['periodo'].min()} → {df['periodo'].max()}"},
            "from_cache": False,
            "latencia_ms": tiempo,
        }

    def get_indicador_especifico(self, token, indicador, periodo_inicio="2024-01"):
        """GET /api/v1/indicadores/{indicador}"""
        ok, payload = verificar_token_y_rol(token, ["developer","analyst","admin"],
                                             self.tokens)
        if not ok:
            return {"status": 401, "error": payload}

        if indicador not in self.db.columns:
            return {"status": 404, "error": f"Indicador '{indicador}' no existe",
                    "indicadores_disponibles": list(self.db.columns[1:])}

        df = self.db[self.db["periodo"] >= periodo_inicio][["periodo", indicador]]
        return {
            "status": 200,
            "indicador": indicador,
            "data": df.to_dict(orient="records"),
            "stats": {
                "min": float(df[indicador].min()),
                "max": float(df[indicador].max()),
                "mean": round(float(df[indicador].mean()), 3),
                "ultimo": float(df[indicador].iloc[-1])
            }
        }

    def get_metricas_api(self):
        """GET /api/v1/admin/metricas"""
        df_log = pd.DataFrame(self.request_log)
        if df_log.empty:
            return {"total_requests": 0}
        return {
            "total_requests": len(df_log),
            "status_codes":   df_log["status"].value_counts().to_dict(),
            "latencia_prom_ms": round(df_log["tiempo_ms"].mean(), 1),
            "endpoints":      df_log["endpoint"].value_counts().to_dict(),
        }

# Usar la API
api = BceAPI(db_indicadores, tokens_activos, limiter_pro)
tokens_lista = list(tokens_activos.keys())

print("\n  Llamadas a la API:")
resp = api.get_indicadores(tokens_lista[0], periodo_inicio="2024-01", limite=6)
print(f"  GET /indicadores?desde=2024-01&limite=6 → status={resp['status']} | cache={resp.get('from_cache')} | {resp['meta']}")

resp2 = api.get_indicador_especifico(tokens_lista[1], "inflacion", "2024-01")
print(f"  GET /indicadores/inflacion → status={resp2['status']} | ultimo={resp2['stats']['ultimo']}")

# 2da llamada — debe venir del cache
resp3 = api.get_indicadores(tokens_lista[0], periodo_inicio="2024-01", limite=6)
print(f"  GET /indicadores (repetida) → status={resp3['status']} | from_cache={resp3.get('from_cache')}")

metricas_api = api.get_metricas_api()
print(f"\n  Metricas API: {metricas_api}")

# ================================================
# DOCUMENTACION OPENAPI (estructura)
# ================================================
print("\n--- OPENAPI SPEC (estructura) ---")

openapi_spec = {
    "openapi": "3.0.3",
    "info": {"title": "BCE Ecuador API", "version": "1.0.0",
             "description": "Indicadores macroeconomicos del Banco Central del Ecuador"},
    "servers": [{"url": "https://api.bce.fin.ec/v1"}],
    "paths": {
        "/indicadores": {"get": {"summary": "Listar indicadores", "parameters": [
            {"name": "periodo_inicio", "in": "query", "schema": {"type": "string"}},
            {"name": "limite", "in": "query", "schema": {"type": "integer", "default": 12}},
        ]}},
        "/indicadores/{nombre}": {"get": {"summary": "Indicador especifico"}},
        "/health": {"get": {"summary": "Estado del servicio"}},
    },
    "components": {"securitySchemes": {
        "BearerAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}
    }}
}
print(json.dumps(openapi_spec, indent=2)[:600] + "\n  ...")

print("\n" + "=" * 65)
print("APIs DE DATOS — CONCEPTOS CLAVE:")
print("  JWT:          token de autenticacion stateless — escala horizontalmente")
print("  Rate limit:   ventana deslizante — previene abuso y garantiza SLA")
print("  Cache Redis:  respuesta en microsegundos para queries repetidas")
print("  Versionado:   /api/v1/ — cambios sin romper clientes existentes")
print("  OpenAPI:      documentacion automatica con Swagger UI")
print("  CQRS:         separar reads (API) de writes (pipeline) — mejor escala")
print("=" * 65)
```

3. Implementa el endpoint `GET /api/v1/indicadores/comparar?paises=EC,PE,CO` que devuelve una comparacion de indicadores con datos simulados de Peru y Colombia.

4. Agrega el patron Circuit Breaker al cliente de la API: si el servidor responde con 5xx tres veces seguidas, esperar 60 segundos antes de reintentar.

## Usa IA para...

> Abre Gemini y escribe:
> "Tengo una API FastAPI que sirve indicadores economicos del BCE Ecuador. Necesito implementar: 1) WebSocket para actualizaciones en tiempo real cuando hay nuevo dato publicado, 2) GraphQL endpoint para que los clientes pidan exactamente las columnas que necesitan (evitar over-fetching), 3) paginacion con cursor (no con offset) para datasets grandes. ¿Cual de los tres aporta mas valor para una API de datos economicos? Dame el codigo del que recomiendas."

Despues de leer la respuesta:
- Implementa la paginacion por cursor para el endpoint de indicadores.
- Compara la paginacion por cursor vs por offset en terminos de consistencia y rendimiento.

## Que aprendiste

- JWT permite autenticacion stateless: el servidor no necesita guardar sesiones — escala horizontalmente.
- El rate limiting protege la API de abuso y garantiza SLA equitativo entre clientes.
- Cache en Redis reduce latencia de 200ms a 1ms para queries repetidas — esencial para APIs publicas.
- El versionado `/v1/` permite evolucionar la API sin romper integraciones existentes.
- OpenAPI/Swagger genera documentacion interactiva automaticamente desde el codigo FastAPI.
- CQRS separa las lecturas (API REST) de las escrituras (pipelines) — permite optimizar cada uno independientemente.

## Reto extra

Construye una API publica de datos abiertos del Ecuador: datos del INEC (censo), BCE (indicadores), MAGAP (precios agricolas) y MSP (salud). Autenticacion OAuth2 con registro publico, rate limiting diferenciado por plan (free/developer/enterprise), cache Redis con invalidacion automatica cuando hay datos nuevos, documentacion Swagger con ejemplos reales, y SDK Python open source para consumirla. Despliega en AWS API Gateway + Lambda para costo cero con baja demanda.
