# Ejercicio Sesion 7: Recomendacion en Produccion — A/B Testing y Cache

**Materia:** Sistemas de Recomendacion
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 55 min

## Objetivo

Disenar e implementar la arquitectura de un sistema de recomendacion listo para produccion, con A/B testing estadisticamente valido para comparar modelos, estrategia de cache con Redis para latencia sub-50ms, y un pipeline de reentrenamiento continuo aplicado a un caso ecuatoriano real.

## Contexto

Un sistema de recomendacion que funciona en Jupyter no es lo mismo que uno en produccion. Los retos reales son: latencia (el usuario no espera mas de 100ms), escala (10,000 solicitudes por segundo en Black Friday), frescura (las recomendaciones deben actualizarse con el comportamiento reciente) y validacion (¿como sabes que el modelo nuevo es mejor que el viejo sin afectar a todos los usuarios?). Empresas ecuatorianas como Grupo El Comercio, El Universo digital o plataformas de la banca privada (Pichincha App, Produbanco) necesitan exactamente estas capacidades.

## Instrucciones

1. Abre Google Colab y crea `sesion07_produccion_ab_testing.ipynb`.

2. Diseña la arquitectura de produccion:

```python
# Sistemas de Recomendacion - Sesion 7: Produccion y A/B Testing
# ITSEIA - Periodo 5
# Estudiante: [Tu nombre]

import numpy as np
import pandas as pd
import hashlib
import time
import matplotlib.pyplot as plt
from scipy import stats
from collections import defaultdict

# ========================================================
# PARTE 1: Arquitectura de Produccion
# ========================================================

print("ARQUITECTURA - Sistema Recomendacion Produccion")
print("=" * 65)

arquitectura = """
SOLICITUD DE USUARIO
        |
        v
[API GATEWAY] - Rate limiting, autenticacion, logging
        |
        v
[FEATURE STORE] - Recupera features del usuario (pre-calculados)
  * Historial reciente (Redis, TTL 1 hora)
  * Perfil latente SVD (Redis, TTL 24 horas)
  * Datos demograficos (PostgreSQL)
        |
        v
[CANDIDATE GENERATION] - Reducir de 1M items a ~1,000 candidatos
  * ANN (Approximate Nearest Neighbors) con FAISS o ScaNN
  * Filtros de negocio (stock disponible, geo-restriccion)
        |
        v
[RANKING MODEL] - Ordenar los 1,000 candidatos
  * LightGBM / XGBoost o Two-Tower Neural Network
  * Features cruzadas usuario-item
        |
        v
[POST-FILTERING] - Reglas de negocio post-modelo
  * Diversidad (no poner 5 items de la misma categoria)
  * Promociones forzadas (items que el negocio quiere destacar)
  * Filtros de contenido (COPPA, restricciones de edad)
        |
        v
[CACHE LAYER] - Redis con TTL configurable
  * Cache de resultados finales por user_id
  * Invalidar al detectar nueva interaccion significativa
        |
        v
RESPUESTA al usuario (< 100ms objetivo)
"""
print(arquitectura)
```

3. Implementa el sistema de cache simulado:

```python
# ========================================================
# PARTE 2: Cache Strategy con TTL
# ========================================================

class CacheRecomendaciones:
    """
    Simula un cache tipo Redis para recomendaciones.
    En produccion usarias: import redis; r = redis.Redis(...)
    """

    def __init__(self, ttl_segundos=3600):
        self._cache = {}
        self._timestamps = {}
        self._hits = 0
        self._misses = 0
        self.ttl = ttl_segundos

    def _key(self, user_id, contexto="default"):
        return f"recs:{user_id}:{contexto}"

    def get(self, user_id, contexto="default"):
        key = self._key(user_id, contexto)
        if key in self._cache:
            edad = time.time() - self._timestamps[key]
            if edad < self.ttl:
                self._hits += 1
                return self._cache[key]
            else:
                del self._cache[key]
                del self._timestamps[key]
        self._misses += 1
        return None

    def set(self, user_id, recomendaciones, contexto="default"):
        key = self._key(user_id, contexto)
        self._cache[key] = recomendaciones
        self._timestamps[key] = time.time()

    def invalidar(self, user_id):
        """Llamar cuando el usuario hace una nueva compra importante."""
        keys_a_borrar = [k for k in self._cache if f"recs:{user_id}:" in k]
        for k in keys_a_borrar:
            del self._cache[k]
            del self._timestamps[k]
        print(f"Cache invalidado para usuario {user_id}: {len(keys_a_borrar)} entradas borradas")

    def stats(self):
        total = self._hits + self._misses
        hit_rate = self._hits / total if total > 0 else 0
        return {
            'hits': self._hits,
            'misses': self._misses,
            'hit_rate': hit_rate,
            'cached_users': len(self._cache)
        }

# Simular un modelo de recomendacion lento (200ms sin cache)
def modelo_recomendacion_lento(user_id, n_items=300, k=10):
    """Simula calculo costoso del modelo."""
    time.sleep(0.05)  # 50ms simulado (en produccion seria 200ms+ con deep learning)
    np.random.seed(user_id)
    return list(np.random.choice(n_items, k, replace=False))

# Probar hit rate del cache
cache = CacheRecomendaciones(ttl_segundos=300)
n_solicitudes = 200
n_usuarios_activos = 50  # Solo 50 usuarios distintos (muchos usuarios repiten)

tiempos = []
for i in range(n_solicitudes):
    user_id = np.random.randint(0, n_usuarios_activos)
    t0 = time.time()
    recs = cache.get(user_id)
    if recs is None:
        recs = modelo_recomendacion_lento(user_id)
        cache.set(user_id, recs)
    tiempos.append((time.time() - t0) * 1000)  # En ms

stats = cache.stats()
print(f"Simulacion Cache - {n_solicitudes} solicitudes, {n_usuarios_activos} usuarios")
print(f"  Cache Hits     : {stats['hits']} ({stats['hit_rate']:.1%})")
print(f"  Cache Misses   : {stats['misses']}")
print(f"  Latencia media : {np.mean(tiempos):.1f} ms")
print(f"  Latencia P95   : {np.percentile(tiempos, 95):.1f} ms")
print(f"  Latencia max   : {np.max(tiempos):.1f} ms")
```

4. Implementa A/B Testing estadisticamente correcto:

```python
# ========================================================
# PARTE 3: A/B Testing para Comparar Modelos
# ========================================================

class ABTesting:
    """
    Sistema de A/B testing basado en hash deterministico del user_id.
    Garantiza que el mismo usuario siempre ve el mismo modelo.
    """

    def __init__(self, porcentaje_b=50):
        """porcentaje_b: % de usuarios asignados al modelo B."""
        self.porcentaje_b = porcentaje_b
        self.metricas = defaultdict(lambda: {'clics': 0, 'impresiones': 0,
                                              'compras': 0, 'revenue': 0.0})

    def asignar_grupo(self, user_id):
        """Asignacion deterministica: el mismo user_id siempre va al mismo grupo."""
        hash_num = int(hashlib.md5(str(user_id).encode()).hexdigest(), 16)
        porcentaje_usuario = hash_num % 100
        return 'B' if porcentaje_usuario < self.porcentaje_b else 'A'

    def registrar_evento(self, user_id, tipo_evento, valor=0):
        grupo = self.asignar_grupo(user_id)
        self.metricas[grupo]['impresiones'] += 1
        if tipo_evento == 'clic':
            self.metricas[grupo]['clics'] += 1
        elif tipo_evento == 'compra':
            self.metricas[grupo]['compras'] += 1
            self.metricas[grupo]['revenue'] += valor

    def ctr(self, grupo):
        m = self.metricas[grupo]
        return m['clics'] / m['impresiones'] if m['impresiones'] > 0 else 0

    def conversion(self, grupo):
        m = self.metricas[grupo]
        return m['compras'] / m['impresiones'] if m['impresiones'] > 0 else 0

    def test_estadistico(self):
        """Chi-cuadrado para comparar conversion entre A y B."""
        ma = self.metricas['A']
        mb = self.metricas['B']
        tabla_contingencia = np.array([
            [ma['compras'], ma['impresiones'] - ma['compras']],
            [mb['compras'], mb['impresiones'] - mb['compras']]
        ])
        chi2, p_valor, dof, _ = stats.chi2_contingency(tabla_contingencia)
        return {'chi2': chi2, 'p_valor': p_valor, 'significativo': p_valor < 0.05}

# Simular experimento A/B en el portal de El Comercio Digital Ecuador
# Modelo A: SVD clasico | Modelo B: NCF con deep learning
np.random.seed(2025)
n_usuarios_experimento = 2000
ab = ABTesting(porcentaje_b=50)

# Simular comportamiento diferenciado entre modelos
for _ in range(n_usuarios_experimento * 5):  # 5 solicitudes por usuario promedio
    user_id = np.random.randint(1, n_usuarios_experimento)
    grupo = ab.asignar_grupo(user_id)

    # Modelo A (SVD): CTR base 8%, conversion 2.5%
    # Modelo B (NCF): CTR base 11%, conversion 3.8% (nuevo modelo es mejor)
    ctr_base = 0.08 if grupo == 'A' else 0.11
    conv_base = 0.025 if grupo == 'A' else 0.038

    ab.metricas[grupo]['impresiones'] += 1
    if np.random.random() < ctr_base:
        ab.metricas[grupo]['clics'] += 1
    if np.random.random() < conv_base:
        ab.metricas[grupo]['compras'] += 1
        precio = np.random.uniform(5, 80)
        ab.metricas[grupo]['revenue'] += precio

# Resultados
print("RESULTADOS A/B TEST - El Comercio Digital Ecuador")
print("Modelo A: SVD clasico | Modelo B: NCF Deep Learning")
print("=" * 60)
for grupo in ['A', 'B']:
    m = ab.metricas[grupo]
    print(f"\nGrupo {grupo}:")
    print(f"  Impresiones : {m['impresiones']:,}")
    print(f"  Clics       : {m['clics']:,}")
    print(f"  Compras     : {m['compras']:,}")
    print(f"  CTR         : {ab.ctr(grupo):.2%}")
    print(f"  Conversion  : {ab.conversion(grupo):.2%}")
    print(f"  Revenue     : ${m['revenue']:,.2f}")

resultado = ab.test_estadistico()
print(f"\nPRUEBA ESTADISTICA (Chi-cuadrado):")
print(f"  Chi2    : {resultado['chi2']:.4f}")
print(f"  P-valor : {resultado['p_valor']:.6f}")
print(f"  ¿Diferencia significativa? {'SI (p < 0.05)' if resultado['significativo'] else 'NO (p >= 0.05)'}")

if resultado['significativo']:
    lift = (ab.conversion('B') - ab.conversion('A')) / ab.conversion('A')
    print(f"\n  LIFT modelo B sobre A: +{lift:.1%}")
    print(f"  DECISION: DESPLEGAR modelo B a produccion completa")
else:
    print(f"\n  DECISION: Continuar experimento, no hay suficiente evidencia")
```

5. Visualiza los resultados del A/B test:

```python
# ========================================================
# PARTE 4: Dashboard de Resultados
# ========================================================

fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Metrica 1: CTR
grupos = ['A (SVD)', 'B (NCF)']
ctrs = [ab.ctr('A') * 100, ab.ctr('B') * 100]
bars1 = axes[0].bar(grupos, ctrs, color=['#1F2F58', '#FBBC0C'], width=0.5)
axes[0].set_ylabel('CTR (%)')
axes[0].set_title('Click-Through Rate')
for bar, val in zip(bars1, ctrs):
    axes[0].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
                 f'{val:.2f}%', ha='center', fontweight='bold')
axes[0].set_ylim(0, max(ctrs) * 1.3)
axes[0].grid(True, alpha=0.3, axis='y')

# Metrica 2: Conversion
convs = [ab.conversion('A') * 100, ab.conversion('B') * 100]
bars2 = axes[1].bar(grupos, convs, color=['#1F2F58', '#FBBC0C'], width=0.5)
axes[1].set_ylabel('Conversion (%)')
axes[1].set_title('Tasa de Conversion')
for bar, val in zip(bars2, convs):
    axes[1].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.05,
                 f'{val:.2f}%', ha='center', fontweight='bold')
axes[1].set_ylim(0, max(convs) * 1.3)
axes[1].grid(True, alpha=0.3, axis='y')

# Metrica 3: Revenue
revs = [ab.metricas['A']['revenue'], ab.metricas['B']['revenue']]
bars3 = axes[2].bar(grupos, revs, color=['#1F2F58', '#FBBC0C'], width=0.5)
axes[2].set_ylabel('Revenue USD')
axes[2].set_title('Revenue Total')
for bar, val in zip(bars3, revs):
    axes[2].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 50,
                 f'${val:,.0f}', ha='center', fontweight='bold')
axes[2].set_ylim(0, max(revs) * 1.3)
axes[2].grid(True, alpha=0.3, axis='y')

p_str = f"p={resultado['p_valor']:.4f} {'(sig.)' if resultado['significativo'] else '(no sig.)'}"
plt.suptitle(f'A/B Test: SVD vs NCF | El Comercio Digital Ecuador | {p_str}', color='gray')
plt.tight_layout()
plt.show()
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Voy a desplegar un nuevo modelo de recomendacion en Produbanco Ecuador. El banco tiene 500,000 usuarios activos. Mi A/B test muestra +1.2% de conversion con p-valor = 0.04. El jefe de producto me pregunta: ¿cuanto tiempo necesito correr el experimento antes de decidir? ¿Que es el 'peeking problem' en A/B testing y como lo evito? ¿Como hago el rollout progresivo del nuevo modelo si decido desplegarlo?"

Despues de leer la respuesta:
- Calcula en tu notebook el tamano de muestra minimo necesario usando scipy.stats.power_analysis (o explicado por Claude).
- Agrega una celda markdown con tu plan de rollout progresivo en 3 fases.

## Que aprendiste

- La **arquitectura de produccion** separa candidate generation (escala), ranking (precision) y post-filtering (negocio).
- El **cache con TTL** es critico para latencia: un hit de cache tarda microsegundos vs 200ms del modelo.
- La **asignacion deterministicia** (hash del user_id) garantiza que el mismo usuario siempre vea el mismo modelo durante el experimento.
- El **Chi-cuadrado** valida si la diferencia en conversion entre grupos A y B es estadisticamente significativa (p < 0.05) o producto del azar.
- El **peeking problem** ocurre cuando revisas resultados antes del tamano de muestra objetivo: infla la tasa de falsos positivos.

## Reto extra

Implementa **Multi-Armed Bandit con Thompson Sampling** como alternativa al A/B testing clasico. Simula 10,000 usuarios y compara: (a) cuanto revenue genera el bandit vs el A/B testing clasico que espera N semanas para decidir, y (b) cuantos usuarios fueron "perjudicados" por el modelo peor en cada enfoque. Explica en una celda markdown cuando usarias bandit vs A/B testing en el contexto de una empresa ecuatoriana con pocos usuarios.
