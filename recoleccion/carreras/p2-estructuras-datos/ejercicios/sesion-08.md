# Ejercicio Sesion 8: Proyecto — Resolver Problema Real con Estructura Optima

**Materia:** Estructuras de Datos y Algoritmos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Disenar e implementar un sistema completo de gestion de rutas de reparto para una empresa de logistica ecuatoriana, eligiendo la estructura de datos optima para cada componente del problema: cola de prioridad para pedidos urgentes, tabla hash para cache de clientes, lista enlazada para rutas dinamicas, y arbol para busqueda geografica.

## Contexto

Servientrega, Laar Courier y Urbano Express son las principales empresas de logistica en Ecuador, con operaciones en las 24 provincias. Cada dia procesan miles de pedidos con distintas prioridades: urgentes (medicos, juridicos), express (24h) y estandar (48-72h). El sistema de asignacion de rutas debe: recibir pedidos en tiempo real, asignarlos al repartidor mas cercano disponible, calcular rutas eficientes, y generar reportes de cumplimiento. Este proyecto integra TODAS las estructuras del periodo.

## Instrucciones

1. Crea el archivo `sesion08_proyecto_logistica.py`.

2. Implementa el sistema completo:

```python
# Estructuras de Datos - Sesion 8: Proyecto Sistema Logistico Ecuador
# ITSEIA - Periodo 2
# Estudiante: [Tu nombre]

import heapq
import time
from collections import deque
from datetime import datetime, timedelta
import random

# ============================================================
# ESTRUCTURA 1: COLA DE PRIORIDAD (heap) — O(log n) insert/extract
# Para pedidos con diferentes niveles de urgencia
# ============================================================

class ColaPedidosPrioridad:
    """
    Min-heap: el pedido con MAYOR prioridad (numero menor) sale primero.
    Prioridad: 1=medico/urgente, 2=express, 3=estandar, 4=economico
    """

    def __init__(self):
        self._heap = []
        self._contador = 0  # Para desempatar pedidos de igual prioridad (FIFO)

    def agregar_pedido(self, pedido):
        """O(log n): insertar manteniendo la propiedad del heap."""
        prioridad = pedido["prioridad"]
        self._contador += 1
        # Tupla: (prioridad, contador_fifo, pedido)
        heapq.heappush(self._heap, (prioridad, self._contador, pedido))

    def atender_siguiente(self):
        """O(log n): extraer el pedido de mayor prioridad."""
        if self.esta_vacio():
            return None
        prioridad, _, pedido = heapq.heappop(self._heap)
        return pedido

    def ver_siguiente(self):
        """O(1): ver sin extraer."""
        if self.esta_vacio():
            return None
        return self._heap[0][2]

    def esta_vacio(self):
        return len(self._heap) == 0

    def tamano(self):
        return len(self._heap)

    def listar_por_prioridad(self):
        """Retorna copia ordenada por prioridad."""
        return [item[2] for item in sorted(self._heap)]


# ============================================================
# ESTRUCTURA 2: TABLA HASH (dict) — O(1) lookup
# Cache de clientes frecuentes para evitar reconsultar la BD
# ============================================================

class CacheClientes:
    """
    Cache LRU implementado con dict + deque.
    Maximo N clientes en memoria.
    """

    def __init__(self, capacidad=100):
        self.capacidad = capacidad
        self._cache = {}        # cedula -> datos_cliente
        self._orden = deque()   # orden de uso (el mas reciente al frente)
        self.hits = 0
        self.misses = 0

    def obtener(self, cedula):
        """O(1): verificar si el cliente esta en cache."""
        if cedula in self._cache:
            self.hits += 1
            # Mover al frente (mas reciente)
            self._orden.remove(cedula)
            self._orden.appendleft(cedula)
            return self._cache[cedula]
        self.misses += 1
        return None

    def guardar(self, cedula, datos):
        """O(1): agregar o actualizar cliente en cache."""
        if cedula in self._cache:
            self._orden.remove(cedula)
        elif len(self._cache) >= self.capacidad:
            # Expulsar el menos recientemente usado
            expulsado = self._orden.pop()
            del self._cache[expulsado]
        self._cache[cedula] = datos
        self._orden.appendleft(cedula)

    def estadisticas(self):
        total = self.hits + self.misses
        hit_rate = (self.hits / total * 100) if total > 0 else 0
        return {"hits": self.hits, "misses": self.misses, "hit_rate": f"{hit_rate:.1f}%", "en_cache": len(self._cache)}


# ============================================================
# ESTRUCTURA 3: LISTA ENLAZADA — O(1) insercion/eliminacion
# Ruta dinamica del repartidor (se modifica constantemente)
# ============================================================

class NodoParada:
    def __init__(self, pedido_id, direccion, lat, lon):
        self.pedido_id = pedido_id
        self.direccion = direccion
        self.lat = lat
        self.lon = lon
        self.entregado = False
        self.siguiente = None

class RutaRepartidor:
    """Lista enlazada de paradas ordenadas por proximidad."""

    def __init__(self, repartidor_id, nombre):
        self.repartidor_id = repartidor_id
        self.nombre = nombre
        self.cabeza = None
        self.total_paradas = 0

    def agregar_parada(self, pedido_id, direccion, lat, lon):
        """O(1): agregar al final de la ruta."""
        nueva = NodoParada(pedido_id, direccion, lat, lon)
        if self.cabeza is None:
            self.cabeza = nueva
        else:
            actual = self.cabeza
            while actual.siguiente:
                actual = actual.siguiente
            actual.siguiente = nueva
        self.total_paradas += 1

    def completar_siguiente_entrega(self):
        """O(1): marcar la primera parada como entregada."""
        if self.cabeza is None:
            return None
        parada = self.cabeza
        parada.entregado = True
        self.cabeza = self.cabeza.siguiente
        self.total_paradas -= 1
        return parada

    def paradas_pendientes(self):
        paradas = []
        actual = self.cabeza
        while actual:
            paradas.append(actual)
            actual = actual.siguiente
        return paradas

    def mostrar_ruta(self):
        print(f"\n  Ruta de {self.nombre} ({self.total_paradas} paradas):")
        actual = self.cabeza
        i = 1
        while actual:
            print(f"    {i}. [{actual.pedido_id}] {actual.direccion}")
            actual = actual.siguiente
            i += 1


# ============================================================
# ESTRUCTURA 4: DICCIONARIO ORDENADO (BST simulado con sorted)
# Indice de repartidores por zona para asignacion rapida
# ============================================================

class IndiceRepartidoresPorZona:
    """
    Organiza repartidores disponibles por zona geografica.
    Busqueda O(1) por zona, listado O(k) donde k = repartidores en zona.
    """

    def __init__(self):
        self._zonas = {}  # zona -> lista de repartidores disponibles

    def registrar_repartidor(self, repartidor_id, nombre, zona):
        if zona not in self._zonas:
            self._zonas[zona] = []
        self._zonas[zona].append({"id": repartidor_id, "nombre": nombre, "pedidos_hoy": 0})

    def obtener_disponible(self, zona):
        """Retorna el repartidor con menos pedidos en la zona."""
        if zona not in self._zonas or not self._zonas[zona]:
            return None
        return min(self._zonas[zona], key=lambda r: r["pedidos_hoy"])

    def incrementar_carga(self, zona, repartidor_id):
        for r in self._zonas.get(zona, []):
            if r["id"] == repartidor_id:
                r["pedidos_hoy"] += 1
                break

    def reporte_carga(self):
        print("\n  CARGA POR ZONA Y REPARTIDOR:")
        for zona, reps in sorted(self._zonas.items()):
            print(f"  Zona {zona}:")
            for r in sorted(reps, key=lambda r: r["pedidos_hoy"], reverse=True):
                barra = "#" * r["pedidos_hoy"]
                print(f"    {r['nombre']:<20} {barra} ({r['pedidos_hoy']} pedidos)")


# ============================================================
# SISTEMA CENTRAL DE LOGISTICA
# ============================================================

class SistemaLogistica:
    """Integra todas las estructuras para operar la empresa de logistica."""

    NOMBRES_PRIORIDAD = {1: "MEDICO/URGENTE", 2: "EXPRESS 24h", 3: "ESTANDAR 48h", 4: "ECONOMICO 72h"}

    def __init__(self):
        self.cola_pedidos = ColaPedidosPrioridad()
        self.cache_clientes = CacheClientes(capacidad=50)
        self.indice_zonas = IndiceRepartidoresPorZona()
        self.rutas = {}         # repartidor_id -> RutaRepartidor
        self.pedidos_log = []   # Historial
        self._id_pedido = 0

    def registrar_repartidor(self, rep_id, nombre, zona):
        self.indice_zonas.registrar_repartidor(rep_id, nombre, zona)
        self.rutas[rep_id] = RutaRepartidor(rep_id, nombre)
        print(f"  Repartidor registrado: {nombre} (Zona {zona})")

    def recibir_pedido(self, cedula_cliente, nombre_cliente, zona, direccion, prioridad, descripcion):
        """Recibe un nuevo pedido y lo encola segun prioridad."""
        self._id_pedido += 1
        pedido_id = f"SRV-{self._id_pedido:05d}"

        # Buscar en cache primero; si no, simular consulta a BD
        cliente = self.cache_clientes.obtener(cedula_cliente)
        if cliente is None:
            cliente = {"cedula": cedula_cliente, "nombre": nombre_cliente, "zona": zona, "pedidos_hist": 0}
            self.cache_clientes.guardar(cedula_cliente, cliente)

        pedido = {
            "id": pedido_id,
            "cedula": cedula_cliente,
            "nombre_cliente": nombre_cliente,
            "zona": zona,
            "direccion": direccion,
            "prioridad": prioridad,
            "tipo": self.NOMBRES_PRIORIDAD[prioridad],
            "descripcion": descripcion,
            "hora_recepcion": datetime.now().strftime("%H:%M:%S"),
            "estado": "en_cola"
        }

        self.cola_pedidos.agregar_pedido(pedido)
        print(f"  [{pedido_id}] {self.NOMBRES_PRIORIDAD[prioridad]}: {nombre_cliente} - {descripcion[:40]}")
        return pedido_id

    def asignar_y_despachar(self):
        """Procesa la cola y asigna pedidos a repartidores."""
        if self.cola_pedidos.esta_vacio():
            print("  No hay pedidos en cola.")
            return

        pedido = self.cola_pedidos.atender_siguiente()
        zona = pedido["zona"]

        repartidor = self.indice_zonas.obtener_disponible(zona)
        if repartidor is None:
            print(f"  Sin repartidores disponibles en zona {zona}. Pedido {pedido['id']} en espera.")
            self.cola_pedidos.agregar_pedido(pedido)  # Devolver a la cola
            return

        # Asignar a la ruta del repartidor
        lat = round(random.uniform(-0.25, -0.18), 6)
        lon = round(random.uniform(-78.55, -78.48), 6)
        self.rutas[repartidor["id"]].agregar_parada(pedido["id"], pedido["direccion"], lat, lon)
        self.indice_zonas.incrementar_carga(zona, repartidor["id"])
        pedido["estado"] = "asignado"
        pedido["repartidor"] = repartidor["nombre"]
        self.pedidos_log.append(pedido)

        print(f"  {pedido['id']} ASIGNADO a {repartidor['nombre']} (zona {zona})")

    def procesar_cola_completa(self):
        """Despacha todos los pedidos en cola."""
        print(f"\n  Procesando {self.cola_pedidos.tamano()} pedidos:")
        while not self.cola_pedidos.esta_vacio():
            self.asignar_y_despachar()

    def reporte_final(self):
        print("\n" + "=" * 62)
        print("  REPORTE OPERACIONAL DIARIO - LOGISTICA ECUADOR")
        print("=" * 62)
        print(f"\n  Total pedidos recibidos : {self._id_pedido}")
        print(f"  Total pedidos asignados : {len(self.pedidos_log)}")
        print(f"  Pedidos en cola aun     : {self.cola_pedidos.tamano()}")

        # Distribucion por prioridad
        from collections import Counter
        conteo = Counter(p["tipo"] for p in self.pedidos_log)
        print("\n  Por tipo de servicio:")
        for tipo, total in conteo.most_common():
            print(f"    {tipo:<25}: {total}")

        # Cache stats
        stats = self.cache_clientes.estadisticas()
        print(f"\n  Cache clientes: {stats['hits']} hits / {stats['misses']} misses (hit rate: {stats['hit_rate']})")

        # Rutas
        for rep_id, ruta in self.rutas.items():
            ruta.mostrar_ruta()

        # Carga por zona
        self.indice_zonas.reporte_carga()


# ============================================================
# SIMULACION: Dia operativo de la empresa de logistica
# ============================================================

print("=" * 62)
print("SISTEMA LOGISTICO - SERVIENTREGA ECUADOR")
print("Inicializando...")
print("=" * 62)

sistema = SistemaLogistica()

# Registrar repartidores por zona de Quito
print("\nREGISTRANDO REPARTIDORES:")
sistema.registrar_repartidor("REP-001", "Diego Vega",    "Norte")
sistema.registrar_repartidor("REP-002", "Marco Castro",  "Norte")
sistema.registrar_repartidor("REP-003", "Ana Herrera",   "Sur")
sistema.registrar_repartidor("REP-004", "Luis Moreira",  "Centro")
sistema.registrar_repartidor("REP-005", "Sofia Davalos", "Sur")

# Recibir pedidos con distintas prioridades (llegan en orden aleatorio)
print("\nRECIBIENDO PEDIDOS (orden de llegada):")
sistema.recibir_pedido("1712345678", "Carlos Benavides", "Norte", "Av. Republica 456", 3, "Documentos legales")
sistema.recibir_pedido("0912345679", "Ana Torres",       "Sur",   "Av. Maldonado 123", 1, "Medicamentos insulina - URGENTE")
sistema.recibir_pedido("1001234567", "Pedro Sanchez",    "Norte", "Av. Shyris 789",    2, "Laptop reparada express")
sistema.recibir_pedido("1802345678", "Maria Guerrero",   "Centro","Calle Benalcazar 1", 4, "Ropa online")
sistema.recibir_pedido("0612345676", "Miguel Narvaez",   "Sur",   "Av. Napo 567",      1, "Sentencia judicial - URGENTE")
sistema.recibir_pedido("1712345678", "Carlos Benavides", "Norte", "Av. Republica 456", 3, "Segundo envio - documentos")
sistema.recibir_pedido("1300123456", "Jorge Cifuentes",  "Centro","Mejia 234",         2, "Repuestos maquinaria")
sistema.recibir_pedido("0912345679", "Ana Torres",       "Sur",   "Av. Maldonado 123", 2, "Segundo pedido de Ana")

print(f"\n  Cola de prioridad tiene: {sistema.cola_pedidos.tamano()} pedidos")
print(f"  Siguiente (mayor prioridad): {sistema.cola_pedidos.ver_siguiente()['descripcion']}")

# Despachar todos
print("\nDESPACHANDO PEDIDOS (en orden de prioridad, no de llegada):")
sistema.procesar_cola_completa()

# Reporte final
sistema.reporte_final()

# Analisis Big O del sistema
print("\n" + "=" * 62)
print("ANALISIS BIG O DEL SISTEMA:")
print("=" * 62)
operaciones = [
    ("Recibir pedido (heap insert)", "O(log n)", "n = pedidos en cola"),
    ("Despachar pedido (heap extract)", "O(log n)", "n = pedidos en cola"),
    ("Buscar cliente en cache (dict)", "O(1)", "siempre constante"),
    ("Asignar repartidor por zona", "O(k)", "k = repartidores en zona"),
    ("Agregar parada a ruta", "O(m)", "m = paradas en la ruta"),
    ("Reporte final (recorrer logs)", "O(p)", "p = total pedidos"),
]
for operacion, complejidad, nota in operaciones:
    print(f"  {operacion:<40} {complejidad:<12} ({nota})")
```

3. Ejecuta el sistema completo y verifica que los pedidos URGENTES (prioridad 1) se despachan primero aunque llegaron despues.

4. Agrega 3 pedidos mas: uno urgente, uno express, uno estandar. Verifica el orden de despacho.

5. Responde por escrito: ¿por que elegiste cola de prioridad y no un array ordenado para la cola de pedidos?

## Usa IA para...

> Abre ChatGPT y escribe:
> "Diseñe un sistema de logistica en Python con: cola de prioridad para pedidos, tabla hash para cache de clientes, lista enlazada para rutas. ¿Que mejoras de escalabilidad le agregaria para manejar 100,000 pedidos diarios? Considera: particionamiento por zona, workers paralelos, persistencia en Redis."

Despues de leer la respuesta:
- Identifica cual de las mejoras sugeridas cambiaria la complejidad del sistema.
- Pregunta: "¿Como implementaria el sistema de notificaciones en tiempo real para los clientes usando una cola de mensajes?"

## Que aprendiste

- Un problema real requiere multiples estructuras: no existe una "mejor estructura universal".
- La cola de prioridad (heap) garantiza que los pedidos urgentes se atiendan primero, independientemente del orden de llegada.
- La tabla hash (dict) como cache reduce las consultas repetidas a la base de datos de O(n) a O(1).
- La lista enlazada es ideal para rutas que se modifican constantemente (agregar/eliminar paradas).
- El analisis Big O del sistema completo permite identificar los cuellos de botella antes de que el sistema entre en produccion.

## Reto extra

Implementa el metodo `optimizar_ruta(ruta)` que use el algoritmo del vecino mas cercano (greedy) para reordenar las paradas de un repartidor minimizando la distancia total. Usa la formula de distancia Euclidea entre coordenadas (lat, lon). Este es un caso simplificado del famoso "Problema del Viajante" (TSP). Mide cuanto mejora la distancia total antes y despues de optimizar.
