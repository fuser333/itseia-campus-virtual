# Ejercicio Sesion 4: Tablas Hash (Diccionarios)

**Materia:** Estructuras de Datos y Algoritmos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Implementar una tabla hash desde cero con manejo de colisiones, y comparar su rendimiento con un diccionario nativo de Python, aplicado a un sistema de cache de consultas del sistema QUIPUX (gestion documental del gobierno ecuatoriano).

## Contexto

El sistema QUIPUX del gobierno ecuatoriano gestiona millones de documentos oficiales. Cada vez que un funcionario busca un expediente, el sistema debe responder en milisegundos. Una tabla hash permite buscar cualquier expediente en O(1) promedio, sin importar cuantos millones de registros haya. Los mismos principios se usan en cachés de Redis y Memcached que alimentan aplicaciones como la plataforma de tramites en linea del gobierno.

## Instrucciones

1. Crea el archivo `sesion04_tablas_hash.py`.

2. Implementa la tabla hash con manejo de colisiones:

```python
# Estructuras de Datos - Sesion 4: Tablas Hash
# ITSEIA - Periodo 2

import time
import random
import string

# ============================================================
# PARTE 1: Implementacion propia de Tabla Hash
# ============================================================

print("=" * 60)
print("TABLA HASH: Cache de expedientes QUIPUX Ecuador")
print("=" * 60)

class TablaHash:
    """
    Tabla hash con encadenamiento (chaining) para manejo de colisiones.
    Cada bucket es una lista de pares (clave, valor).
    """

    def __init__(self, capacidad=16):
        self.capacidad = capacidad
        self.buckets = [[] for _ in range(capacidad)]
        self.total_elementos = 0
        self.total_colisiones = 0

    def _funcion_hash(self, clave):
        """
        Funcion hash: convierte una clave string a un indice.
        Usa la suma ponderada de codigos ASCII.
        """
        hash_val = 0
        for i, char in enumerate(str(clave)):
            hash_val += ord(char) * (31 ** i)
        return hash_val % self.capacidad

    def insertar(self, clave, valor):
        """O(1) promedio, O(n) peor caso."""
        indice = self._funcion_hash(clave)
        bucket = self.buckets[indice]

        # Actualizar si ya existe la clave
        for i, (k, v) in enumerate(bucket):
            if k == clave:
                bucket[i] = (clave, valor)
                return

        # Insertar nuevo par
        if len(bucket) > 0:
            self.total_colisiones += 1

        bucket.append((clave, valor))
        self.total_elementos += 1

        # Redimensionar si el factor de carga supera 0.75
        if self.total_elementos / self.capacidad > 0.75:
            self._redimensionar()

    def buscar(self, clave):
        """O(1) promedio."""
        indice = self._funcion_hash(clave)
        for k, v in self.buckets[indice]:
            if k == clave:
                return v
        return None

    def eliminar(self, clave):
        """O(1) promedio."""
        indice = self._funcion_hash(clave)
        bucket = self.buckets[indice]
        for i, (k, v) in enumerate(bucket):
            if k == clave:
                bucket.pop(i)
                self.total_elementos -= 1
                return True
        return False

    def _redimensionar(self):
        """Duplicar capacidad y reinsertar todos los elementos."""
        vieja_capacidad = self.capacidad
        self.capacidad *= 2
        nuevos_buckets = [[] for _ in range(self.capacidad)]
        for bucket in self.buckets:
            for clave, valor in bucket:
                nuevo_indice = self._funcion_hash(clave)
                nuevos_buckets[nuevo_indice].append((clave, valor))
        self.buckets = nuevos_buckets
        print(f"  [Redimension] {vieja_capacidad} -> {self.capacidad} buckets")

    def factor_carga(self):
        return self.total_elementos / self.capacidad

    def estadisticas(self):
        ocupados = sum(1 for b in self.buckets if b)
        buckets_con_colision = sum(1 for b in self.buckets if len(b) > 1)
        max_cadena = max(len(b) for b in self.buckets)
        return {
            "total_elementos": self.total_elementos,
            "capacidad": self.capacidad,
            "factor_carga": round(self.factor_carga(), 3),
            "buckets_ocupados": ocupados,
            "buckets_con_colision": buckets_con_colision,
            "cadena_maxima": max_cadena,
            "total_colisiones": self.total_colisiones
        }

    def __len__(self):
        return self.total_elementos


# ============================================================
# USO: Cache de expedientes del sistema QUIPUX
# ============================================================

cache_quipux = TablaHash(capacidad=8)  # Pequena para observar redimension

# Expedientes del gobierno ecuatoriano (codigos ficticios pero realistas)
expedientes = [
    ("QUIPUX-2026-001234", {"asunto": "Contrato adquisicion equipos TI",      "ministerio": "MINTEL",     "estado": "activo"}),
    ("QUIPUX-2026-001235", {"asunto": "Informe auditoria SRI region sierra",   "ministerio": "SRI",        "estado": "archivado"}),
    ("QUIPUX-2026-001236", {"asunto": "Resolucion nombramiento director",      "ministerio": "MDT",        "estado": "activo"}),
    ("QUIPUX-2026-001237", {"asunto": "Convenio cooperacion universidades",    "ministerio": "SENESCYT",   "estado": "activo"}),
    ("QUIPUX-2026-001238", {"asunto": "Plan anual de inversiones 2026",        "ministerio": "MEF",        "estado": "revision"}),
    ("QUIPUX-2026-001239", {"asunto": "Reglamento nuevo sistema de salud",     "ministerio": "MSP",        "estado": "activo"}),
    ("QUIPUX-2026-001240", {"asunto": "Acuerdo ministerial educacion tecnica", "ministerio": "MINEDUC",    "estado": "activo"}),
    ("QUIPUX-2026-001241", {"asunto": "Informe brecha digital Ecuador 2025",   "ministerio": "MINTEL",     "estado": "archivado"}),
    ("QUIPUX-2026-001242", {"asunto": "Proyecto ITSEIA aprobacion",            "ministerio": "SENESCYT",   "estado": "activo"}),
]

print("\nCargando expedientes en cache:")
for codigo, datos in expedientes:
    cache_quipux.insertar(codigo, datos)
    print(f"  Insertado: {codigo}")

print(f"\nEstadisticas del cache:")
for k, v in cache_quipux.estadisticas().items():
    print(f"  {k:<25}: {v}")

# BUSQUEDAS
print("\n" + "=" * 60)
print("BUSQUEDAS (O(1) promedio):")
claves_buscar = ["QUIPUX-2026-001237", "QUIPUX-2026-001242", "QUIPUX-2026-999999"]
for codigo in claves_buscar:
    resultado = cache_quipux.buscar(codigo)
    if resultado:
        print(f"  Encontrado [{codigo}]: {resultado['asunto'][:40]} ({resultado['ministerio']})")
    else:
        print(f"  No encontrado: {codigo}")

# ACTUALIZAR un expediente
cache_quipux.insertar("QUIPUX-2026-001238", {"asunto": "Plan anual de inversiones 2026 (APROBADO)", "ministerio": "MEF", "estado": "activo"})
print(f"\n  Actualizado: {cache_quipux.buscar('QUIPUX-2026-001238')['estado']}")

# ELIMINAR
cache_quipux.eliminar("QUIPUX-2026-001235")
print(f"  Eliminado QUIPUX-2026-001235: {cache_quipux.buscar('QUIPUX-2026-001235')}")


# ============================================================
# PARTE 2: Comparacion con dict nativo de Python
# ============================================================

print("\n" + "=" * 60)
print("COMPARACION: Hash propio vs dict de Python")
print("=" * 60)

N = 100000

# Generar claves aleatorias
claves = [f"EXP-{i:08d}" for i in range(N)]
valores = [{"dato": f"valor_{i}"} for i in range(N)]

# Test con dict nativo (altamente optimizado en C)
dict_nativo = {}
t0 = time.perf_counter()
for k, v in zip(claves, valores):
    dict_nativo[k] = v
t1 = time.perf_counter()
tiempo_dict_insert = (t1 - t0) * 1000

t0 = time.perf_counter()
for k in claves[:1000]:
    _ = dict_nativo[k]
t1 = time.perf_counter()
tiempo_dict_buscar = (t1 - t0) * 1000

print(f"  dict Python  - Insertar {N:,}: {tiempo_dict_insert:.1f} ms")
print(f"  dict Python  - Buscar 1,000 : {tiempo_dict_buscar:.4f} ms")

# Test con nuestra implementacion (solo 1000 para no tomar mucho tiempo)
mi_tabla = TablaHash(capacidad=32)
t0 = time.perf_counter()
for k, v in zip(claves[:1000], valores[:1000]):
    mi_tabla.insertar(k, v)
t1 = time.perf_counter()
tiempo_propio_insert = (t1 - t0) * 1000

t0 = time.perf_counter()
for k in claves[:100]:
    _ = mi_tabla.buscar(k)
t1 = time.perf_counter()
tiempo_propio_buscar = (t1 - t0) * 1000

print(f"\n  TablaHash    - Insertar 1,000: {tiempo_propio_insert:.1f} ms")
print(f"  TablaHash    - Buscar 100    : {tiempo_propio_buscar:.4f} ms")
print(f"\n  El dict nativo de Python es mas rapido porque esta implementado en C.")
print(f"  La logica es identica: nuestra version demuestra el concepto.")


# ============================================================
# PARTE 3: Analisis de colisiones con distintas funciones hash
# ============================================================

print("\n" + "=" * 60)
print("ANALISIS: Distribucion de la funcion hash")
print("=" * 60)

distribucion = [0] * 16
for clave in claves[:500]:
    idx = 0
    for i, c in enumerate(clave):
        idx += ord(c) * (31 ** i)
    distribucion[idx % 16] += 1

print("  Distribucion en 16 buckets (primeras 500 claves):")
for i, count in enumerate(distribucion):
    barra = "#" * (count // 2)
    print(f"  Bucket {i:02d}: {barra} ({count})")
```

3. Ejecuta y observa las estadisticas de colisiones y la distribucion de buckets.

4. Cambia la capacidad inicial a `4` y observa cuantas redimensiones ocurren al insertar los 9 expedientes.

## Usa IA para...

> Abre Claude y escribe:
> "Explica que es una colision en una tabla hash y los dos metodos principales para manejarla: encadenamiento (chaining) y direccionamiento abierto (open addressing). ¿Cual usa Python en su implementacion interna de dict? ¿Como afecta el factor de carga al rendimiento?"

Despues de leer la respuesta:
- Prueba el factor de carga que observaste en tus estadisticas.
- Pregunta: "¿Que es el hash de un objeto en Python? ¿Por que las listas no son hashables pero las tuplas si?"

## Que aprendiste

- Una tabla hash mapea claves a indices de un array usando una funcion hash, logrando acceso O(1) promedio.
- Las colisiones ocurren cuando dos claves distintas producen el mismo indice; se manejan con encadenamiento (lista en cada bucket) o direccionamiento abierto.
- El factor de carga (elementos / capacidad) debe mantenerse bajo (tipicamente 0.75) para garantizar rendimiento O(1).
- Cuando el factor de carga supera el umbral, la tabla se redimensiona (duplica la capacidad) y todos los elementos se reinsertan.
- El `dict` de Python es una implementacion de tabla hash altamente optimizada en C; usarla directamente es siempre mas eficiente que implementar una propia en produccion.

## Reto extra

Implementa un sistema de cache LRU (Least Recently Used) usando un dict de Python mas una lista doblemente enlazada. El cache debe tener una capacidad maxima de 5 expedientes; cuando esta lleno y llega uno nuevo, elimina el menos recientemente consultado. Prueba que funciona buscando expedientes y verificando cual se expulsa.
