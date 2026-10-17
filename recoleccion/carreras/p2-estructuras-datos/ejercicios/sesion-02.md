# Ejercicio Sesion 2: Pilas (Stacks) y Colas (Queues)

**Materia:** Estructuras de Datos y Algoritmos
**Nivel:** Basico
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Implementar pilas (LIFO) y colas (FIFO) desde cero y usando `collections.deque`, aplicandolas a sistemas reales: un validador de expresiones matematicas del SRI y un sistema de procesamiento de cobros electronicos del BCE.

## Contexto

El Banco Central del Ecuador (BCE) procesa pagos interbancarios usando el Sistema de Pagos Interbancarios (SPI). Las transacciones entran en una cola FIFO (el primero en llegar es el primero en procesarse). Al mismo tiempo, el sistema de auditoria del SRI usa pilas para validar que los parentesis, corchetes y llaves de las expresiones de calculo tributario esten correctamente balanceados. Ambas estructuras tienen usos criticos en sistemas financieros reales.

## Instrucciones

1. Crea el archivo `sesion02_pilas_colas.py`.

2. Implementa pilas y colas:

```python
# Estructuras de Datos - Sesion 2: Pilas y Colas
# ITSEIA - Periodo 2

from collections import deque
import time

# ============================================================
# PARTE 1: PILA (Stack) — LIFO: Last In, First Out
# ============================================================

print("=" * 58)
print("PILA: Validador de Expresiones - SRI Ecuador")
print("=" * 58)

class Pila:
    """Implementacion de pila usando lista Python."""

    def __init__(self):
        self._datos = []

    def push(self, elemento):
        """Agregar elemento al tope. O(1)."""
        self._datos.append(elemento)

    def pop(self):
        """Remover y retornar el tope. O(1)."""
        if self.esta_vacia():
            raise IndexError("La pila esta vacia.")
        return self._datos.pop()

    def peek(self):
        """Ver el tope sin removerlo. O(1)."""
        if self.esta_vacia():
            return None
        return self._datos[-1]

    def esta_vacia(self):
        return len(self._datos) == 0

    def tamano(self):
        return len(self._datos)

    def __str__(self):
        return f"Pila{self._datos} <- tope"


def validar_expresion(expresion):
    """
    Usa una pila para validar que los delimitadores
    esten balanceados en una expresion del SRI.
    """
    pila = Pila()
    pares = {')': '(', ']': '[', '}': '{'}
    abre = set('([{')
    cierra = set(')]}')

    for i, char in enumerate(expresion):
        if char in abre:
            pila.push((char, i))
        elif char in cierra:
            if pila.esta_vacia():
                return False, f"Caracter '{char}' en posicion {i} sin apertura correspondiente"
            tope_char, tope_pos = pila.pop()
            if tope_char != pares[char]:
                return False, f"Cierre '{char}' en posicion {i} no coincide con apertura '{tope_char}' en posicion {tope_pos}"

    if not pila.esta_vacia():
        char, pos = pila.peek()
        return False, f"Apertura '{char}' en posicion {pos} nunca fue cerrada"

    return True, "Expresion valida"


# Formulas tipicas de calculo tributario Ecuador
expresiones = [
    ("(ingresos - gastos) * 0.25",                    "Impuesto renta"),
    ("(ventas * 0.15) - (compras * 0.15]",            "IVA [ERROR]"),
    "((base_imponible + otros_ingresos) / 12) * 0.05",
    "{[credito_tributario + (IVA_ventas - IVA_compras)]}",
    "((a + b) * (c - d)",                             "Parentesis sin cerrar [ERROR]",
]

for exp in expresiones:
    if isinstance(exp, tuple):
        formula, etiqueta = exp
    else:
        formula, etiqueta = exp, ""
    valida, mensaje = validar_expresion(formula)
    estado = "OK" if valida else "ERROR"
    print(f"  [{estado}] {etiqueta}")
    print(f"         {formula[:55]}")
    print(f"         -> {mensaje}\n")


# ============================================================
# PARTE 2: COLA (Queue) — FIFO: First In, First Out
# ============================================================

print("=" * 58)
print("COLA: Sistema de Pagos BCE Ecuador")
print("=" * 58)

class Cola:
    """Implementacion de cola usando deque para O(1) en ambos extremos."""

    def __init__(self, capacidad_maxima=None):
        self._datos = deque()
        self.capacidad_maxima = capacidad_maxima
        self.total_procesados = 0

    def encolar(self, elemento):
        """Agregar al final de la cola. O(1)."""
        if self.capacidad_maxima and len(self._datos) >= self.capacidad_maxima:
            raise OverflowError(f"Cola llena (max {self.capacidad_maxima})")
        self._datos.append(elemento)

    def desencolar(self):
        """Remover y retornar el frente. O(1)."""
        if self.esta_vacia():
            raise IndexError("La cola esta vacia.")
        self.total_procesados += 1
        return self._datos.popleft()

    def frente(self):
        """Ver el frente sin removerlo. O(1)."""
        if self.esta_vacia():
            return None
        return self._datos[0]

    def esta_vacia(self):
        return len(self._datos) == 0

    def tamano(self):
        return len(self._datos)

    def __str__(self):
        return f"FRENTE -> {list(self._datos)} <- FINAL"


# Simulacion del Sistema de Pagos Interbancarios BCE
cola_spi = Cola(capacidad_maxima=100)

# Transacciones que llegan en orden
transacciones_pendientes = [
    {"id": "SPI-001", "origen": "Banco Pichincha",     "destino": "Produbanco",       "monto": 15000.00, "tipo": "transferencia"},
    {"id": "SPI-002", "origen": "Banco Guayaquil",     "destino": "Banco Pichincha",  "monto":  8500.00, "tipo": "pago_nomina"},
    {"id": "SPI-003", "origen": "Produbanco",          "destino": "BCE",              "monto": 250000.00,"tipo": "encaje"},
    {"id": "SPI-004", "origen": "Banco Internacional", "destino": "Banco Guayaquil",  "monto":  3200.00, "tipo": "transferencia"},
    {"id": "SPI-005", "origen": "BCE",                 "destino": "Banco Pichincha",  "monto":  95000.00,"tipo": "liquidez"},
]

print("\n  INGRESANDO transacciones a la cola SPI:")
for tx in transacciones_pendientes:
    cola_spi.encolar(tx)
    print(f"    Encolada: {tx['id']} | ${tx['monto']:>12,.2f} | {tx['tipo']}")

print(f"\n  Transacciones en cola: {cola_spi.tamano()}")
print(f"  Siguiente a procesar: {cola_spi.frente()['id']}")

# Procesar la cola (ventana de liquidacion 17:00 BCE)
print("\n  PROCESANDO liquidacion diaria BCE:")
while not cola_spi.esta_vacia():
    tx = cola_spi.desencolar()
    print(f"    Procesada: {tx['id']} | {tx['origen']} -> {tx['destino']} | ${tx['monto']:>12,.2f}")
    time.sleep(0.05)  # Simular tiempo de procesamiento

print(f"\n  Total procesadas: {cola_spi.total_procesados}")
print(f"  Cola vacia: {cola_spi.esta_vacia()}")


# ============================================================
# PARTE 3: Cola de Prioridad simple (sin heapq)
# ============================================================

print("\n" + "=" * 58)
print("COLA DE PRIORIDAD: Atencion medica urgencias")
print("=" * 58)

class ColaPrioridad:
    """
    Cola donde los elementos de mayor prioridad salen primero.
    Prioridad: 1=critico, 2=urgente, 3=normal
    (Implementacion simple O(n) para aprendizaje)
    """
    def __init__(self):
        self._datos = []

    def encolar(self, elemento, prioridad):
        self._datos.append((prioridad, elemento))
        self._datos.sort(key=lambda x: x[0])  # Ordenar por prioridad

    def desencolar(self):
        if not self._datos:
            return None
        prioridad, elemento = self._datos.pop(0)
        return elemento

    def tamano(self):
        return len(self._datos)


urgencias = ColaPrioridad()
urgencias.encolar({"nombre": "Carlos, 45a", "motivo": "Dolor de cabeza"}, 3)
urgencias.encolar({"nombre": "Ana, 8a",     "motivo": "Fiebre alta"    }, 2)
urgencias.encolar({"nombre": "Luis, 62a",   "motivo": "Infarto"        }, 1)
urgencias.encolar({"nombre": "Sofia, 28a",  "motivo": "Fractura"       }, 2)
urgencias.encolar({"nombre": "Pedro, 35a",  "motivo": "Chequeo"        }, 3)

print("\n  Orden de atencion (prioridad 1=critico):")
orden = 1
while urgencias.tamano() > 0:
    paciente = urgencias.desencolar()
    print(f"  {orden}. {paciente['nombre']} — {paciente['motivo']}")
    orden += 1
```

3. Ejecuta y verifica que la pila detecta correctamente los errores de parentesis y que la cola procesa en orden FIFO.

4. Agrega 2 transacciones mas a `cola_spi` y vuelve a ejecutar el procesamiento.

## Usa IA para...

> Abre Claude y escribe:
> "En Python, ¿cual es la diferencia entre usar una lista (list) y un deque (collections.deque) para implementar una cola? ¿Por que list.pop(0) es O(n) y deque.popleft() es O(1)? Explica con la estructura interna de cada uno."

Despues de leer la respuesta:
- Verifica midiendo tiempos: `list.pop(0)` vs `deque.popleft()` con 100,000 elementos.
- Pregunta a Claude: "¿Que es una cola de prioridad y como la implementa Python con el modulo `heapq`?"

## Que aprendiste

- Una pila (Stack) es LIFO: el ultimo en entrar es el primero en salir. Se implementa con `append` y `pop` de una lista.
- Una cola (Queue) es FIFO: el primero en entrar es el primero en salir. Se implementa eficientemente con `deque`.
- Las pilas son ideales para: deshacer acciones, validar expresiones, llamadas recursivas, navegacion de historial.
- Las colas son ideales para: procesamiento por turnos, sistemas de mensajeria, BFS en grafos, colas de impresion.
- `collections.deque` es la implementacion correcta para colas en Python: O(1) para agregar/remover en ambos extremos.

## Reto extra

Implementa una funcion `evaluar_ruc(ruc)` que use una pila para verificar si un RUC ecuatoriano de 13 digitos es valido segun el algoritmo del modulo 10 (busca el algoritmo en internet o pregunta a Claude). Prueba con el RUC `1792012345001` (valido) y `1700000001001` (verificar si es valido).
