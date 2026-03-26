# Ejercicio Sesion 5: Redis — Cache y Sesiones

**Materia:** Bases de Datos NoSQL
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Entender el modelo clave-valor de Redis, implementar patrones de cache, manejo de sesiones de usuario y colas de trabajo, aplicados a una plataforma educativa ecuatoriana.

## Contexto

Redis es la base de datos mas rapida del mundo: vive en memoria RAM y puede ejecutar millones de operaciones por segundo. Se usa principalmente como cache (para no consultar la BD principal en cada request) y para manejar sesiones de usuario. La plataforma Academy de ITSEIA usa exactamente este patron: guardar la sesion del estudiante en Redis durante 30 minutos, y cachear el contenido del curso para que no tenga que ir a la base de datos en cada pagina.

## Instrucciones

1. Instala redis-py: `pip install redis`.

2. Para ejecutar Redis localmente: descarga desde https://redis.io/downloads/ o usa Docker: `docker run -d -p 6379:6379 redis:alpine`.

3. Crea el archivo `sesion05_redis_cache_sesiones.py`:

```python
# Redis: Cache y Sesiones - ITSEIA
# Patrones: cache, sesiones, contadores, TTL
# Caso de uso: plataforma academica ITSEIA Academy

import time
import json
import hashlib
from datetime import datetime

print("=" * 65)
print("REDIS — CACHE Y SESIONES ITSEIA ACADEMY")
print("=" * 65)

# ================================================
# CONEXION (descomenta para usar Redis real)
# ================================================
# import redis
# r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
# print(f"Redis conectado: {r.ping()}")

# MODO SIMULACION: diccionario con TTL simulado
class RedisSimulado:
    """Simula Redis con TTL para practica sin servidor."""
    def __init__(self):
        self._store = {}
        self._expiry = {}

    def set(self, key, value, ex=None):
        self._store[key] = value
        if ex:
            self._expiry[key] = time.time() + ex
        return "OK"

    def get(self, key):
        if key in self._expiry and time.time() > self._expiry[key]:
            del self._store[key]
            del self._expiry[key]
            return None
        return self._store.get(key)

    def setex(self, key, seconds, value):
        return self.set(key, value, ex=seconds)

    def exists(self, *keys):
        return sum(1 for k in keys if k in self._store)

    def delete(self, *keys):
        count = 0
        for k in keys:
            if k in self._store:
                del self._store[k]
                count += 1
        return count

    def incr(self, key, amount=1):
        val = int(self._store.get(key, 0)) + amount
        self._store[key] = str(val)
        return val

    def expire(self, key, seconds):
        if key in self._store:
            self._expiry[key] = time.time() + seconds
            return 1
        return 0

    def ttl(self, key):
        if key not in self._store:
            return -2
        if key not in self._expiry:
            return -1
        remaining = int(self._expiry[key] - time.time())
        return max(0, remaining)

    def hset(self, name, mapping=None, **kwargs):
        if name not in self._store:
            self._store[name] = {}
        if mapping:
            self._store[name].update(mapping)
        self._store[name].update(kwargs)

    def hget(self, name, key):
        return self._store.get(name, {}).get(key)

    def hgetall(self, name):
        return self._store.get(name, {})

    def lpush(self, key, *values):
        if key not in self._store:
            self._store[key] = []
        for v in values:
            self._store[key].insert(0, v)
        return len(self._store[key])

    def rpop(self, key):
        lst = self._store.get(key, [])
        if lst:
            return self._store[key].pop()
        return None

    def llen(self, key):
        return len(self._store.get(key, []))

    def keys(self, pattern="*"):
        return list(self._store.keys())

r = RedisSimulado()
print("Redis simulado listo (para Redis real: descomenta la conexion)\n")

# ================================================
# PATRON 1: CACHE DE CONTENIDO
# ================================================
print("--- PATRON 1: CACHE DE CONTENIDO DE CURSO ---")

def obtener_modulo_bd(modulo_id):
    """Simula consulta a base de datos (lenta: 200ms en prod)."""
    time.sleep(0.01)  # simula latencia
    return {
        "id": modulo_id,
        "titulo": f"Modulo {modulo_id}: Machine Learning Basico",
        "contenido": "Contenido completo del modulo...",
        "video_url": "https://cdn.itseia.ai/videos/ml-basico.mp4",
        "duracion_min": 45,
        "quiz_preguntas": 8,
        "fecha_actualizacion": "2026-03-01"
    }

def obtener_modulo(modulo_id, cache_ttl=3600):
    """Cache-aside pattern: busca en Redis, si no esta va a la BD."""
    cache_key = f"modulo:{modulo_id}"

    # 1. Buscar en cache
    cached = r.get(cache_key)
    if cached:
        print(f"  [CACHE HIT]  modulo:{modulo_id} — desde Redis (rapido)")
        return json.loads(cached)

    # 2. No esta en cache: ir a la BD
    print(f"  [CACHE MISS] modulo:{modulo_id} — consultando BD...")
    datos = obtener_modulo_bd(modulo_id)

    # 3. Guardar en cache por 1 hora
    r.setex(cache_key, cache_ttl, json.dumps(datos))
    print(f"  [CACHE SET]  modulo:{modulo_id} guardado por {cache_ttl}s")
    return datos

# Primer acceso: va a BD
modulo = obtener_modulo("MOD-001")
print(f"  Titulo: {modulo['titulo']}")

# Segundo acceso: desde cache
modulo = obtener_modulo("MOD-001")
print(f"  TTL restante: {r.ttl('modulo:MOD-001')}s")

# ================================================
# PATRON 2: SESIONES DE USUARIO
# ================================================
print("\n--- PATRON 2: SESIONES ESTUDIANTES ITSEIA ---")

def crear_sesion(estudiante_id, carrera, datos_extra=None):
    """Crea sesion con TTL de 30 minutos."""
    session_id = hashlib.md5(f"{estudiante_id}{time.time()}".encode()).hexdigest()
    sesion = {
        "estudiante_id": estudiante_id,
        "carrera": carrera,
        "login_at": datetime.now().isoformat(),
        "ultima_actividad": datetime.now().isoformat(),
        "modulo_actual": "MOD-001",
        "progreso_pct": "0"
    }
    if datos_extra:
        sesion.update(datos_extra)

    r.hset(f"sesion:{session_id}", mapping=sesion)
    r.expire(f"sesion:{session_id}", 1800)  # 30 minutos
    print(f"  Sesion creada: {session_id[:16]}... TTL: 30min")
    return session_id

def validar_sesion(session_id):
    sesion = r.hgetall(f"sesion:{session_id}")
    if sesion:
        r.expire(f"sesion:{session_id}", 1800)  # renovar TTL
        return sesion
    return None

# Crear sesiones para estudiantes
ses1 = crear_sesion("EST-001", "IA",
                    {"fraternidad": "Luma", "progreso_pct": "35"})
ses2 = crear_sesion("EST-002", "Big Data",
                    {"fraternidad": "Neo", "progreso_pct": "67"})

# Validar sesion
sesion_activa = validar_sesion(ses1)
if sesion_activa:
    print(f"  Sesion valida: estudiante {sesion_activa['estudiante_id']}, "
          f"progreso {sesion_activa.get('progreso_pct', '0')}%")

# ================================================
# PATRON 3: CONTADORES EN TIEMPO REAL
# ================================================
print("\n--- PATRON 3: CONTADORES PLATAFORMA ACADEMY ---")

# Visitas a modulos
r.incr("stats:visitas:MOD-001")
r.incr("stats:visitas:MOD-001")
r.incr("stats:visitas:MOD-002")
r.incr("stats:visitas:MOD-001")
r.incr("stats:visitas:MOD-003")

# Quizzes completados hoy
r.incr("stats:quizzes:2026-03-25")
r.incr("stats:quizzes:2026-03-25")
r.incr("stats:quizzes:2026-03-25")

print(f"  Visitas MOD-001: {r.get('stats:visitas:MOD-001')}")
print(f"  Visitas MOD-002: {r.get('stats:visitas:MOD-002')}")
print(f"  Quizzes hoy:     {r.get('stats:quizzes:2026-03-25')}")

# ================================================
# PATRON 4: COLA DE TRABAJOS (Queue)
# ================================================
print("\n--- PATRON 4: COLA DE EMAILS BIENVENIDA ---")

def encolar_email(destinatario, tipo, datos):
    """Encola un email para procesamiento asincrono."""
    tarea = json.dumps({"destinatario": destinatario, "tipo": tipo,
                        "datos": datos, "encolado_at": datetime.now().isoformat()})
    r.lpush("queue:emails", tarea)
    print(f"  [ENCOLADO] Email {tipo} para {destinatario}")

def procesar_email():
    """Worker que procesa emails de la cola."""
    tarea_json = r.rpop("queue:emails")
    if tarea_json:
        tarea = json.loads(tarea_json)
        print(f"  [PROCESADO] {tarea['tipo']} → {tarea['destinatario']}")
        return tarea
    return None

# Encolar emails de bienvenida
encolar_email("mquispe@itseia.ai", "bienvenida", {"carrera": "IA", "periodo": 1})
encolar_email("dmora@itseia.ai",   "bienvenida", {"carrera": "Big Data"})
encolar_email("admin@itseia.ai",   "reporte_semanal", {"semana": "2026-W13"})

print(f"  Emails en cola: {r.llen('queue:emails')}")

# Procesar uno
procesar_email()
print(f"  Emails restantes: {r.llen('queue:emails')}")

# ================================================
# RESUMEN PATRONES REDIS
# ================================================
print("\n" + "=" * 65)
print("PATRONES REDIS EN PRODUCCION:")
patrones = [
    ("Cache-aside",      "Consulta Redis primero, si no hay va a BD y cachea"),
    ("Session store",    "Sesiones con TTL: autologout automatico"),
    ("Contadores",       "incr() atomico: visitas, clicks, descargas"),
    ("Queue",            "lpush/rpop: cola de tareas asincronas"),
    ("Rate limiting",    "incr + expire: limitar 100 requests/minuto"),
    ("Pub/Sub",          "Mensajes en tiempo real entre servicios"),
    ("Leaderboard",      "Sorted Sets: ranking de estudiantes por puntaje"),
]
for patron, descripcion in patrones:
    print(f"  {patron:<18}: {descripcion}")
print("=" * 65)
```

4. Conecta el script con Redis real (local o Atlas Redis). Verifica con `redis-cli monitor` que las operaciones se ejecutan.

5. Implementa el patron "Rate Limiting": un estudiante no puede enviar mas de 5 respuestas de quiz por minuto.

## Usa IA para...

> Abre Claude y escribe:
> "Soy desarrollador de una plataforma educativa en Ecuador. Tengo Redis disponible. ¿Como implemento un leaderboard (ranking) de estudiantes por puntaje de quizzes usando Redis Sorted Sets? Dame el codigo Python completo con zadd, zrevrange y zscore."

Despues de leer la respuesta:
- Implementa el leaderboard con los estudiantes del ejercicio.
- Agrega 10 estudiantes con puntajes aleatorios y muestra el top 5.

## Que aprendiste

- Redis es una base de datos clave-valor en memoria: extremadamente rapida.
- `SET key value EX segundos` guarda con tiempo de expiracion (TTL).
- `GET key` devuelve el valor o `None` si no existe o expiro.
- El cache-aside pattern reduce carga en la BD principal hasta 90%.
- `INCR` es atomico: seguro para contadores en sistemas con multiples workers.
- Las colas con `LPUSH/RPOP` implementan trabajo asincrono sin un broker externo.
- `HSET/HGETALL` almacenan objetos como hash maps — ideal para sesiones.

## Reto extra

Implementa un sistema de "progreso en tiempo real" para ITSEIA Academy: cada vez que un estudiante completa un modulo, actualiza su progreso en Redis. Crea un endpoint simulado que devuelva el progreso de todos los estudiantes activos (los que tienen sesion en Redis). Usa Redis Sorted Sets para rankear estudiantes por progreso.
