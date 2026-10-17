# Ejercicio Sesion 1: Arrays y Listas Enlazadas

**Materia:** Estructuras de Datos y Algoritmos
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Implementar y comparar arrays (listas de Python) y listas enlazadas simples, comprendiendo cuando cada estructura es optima, aplicados a un sistema de gestion de turnos de un hospital publico ecuatoriano.

## Contexto

El Hospital Metropolitano y el Hospital Eugenio Espejo en Quito atienden miles de pacientes diarios. El sistema de turnos debe manejar colas de pacientes que llegan y se van constantemente. Un array tiene acceso O(1) por indice pero insercion O(n) al inicio; una lista enlazada tiene insercion O(1) al inicio pero acceso O(n) por posicion. Elegir la estructura correcta impacta directamente la velocidad del sistema.

## Instrucciones

1. Crea el archivo `sesion01_arrays_listas.py`.

2. Implementa y compara ambas estructuras:

```python
# Estructuras de Datos - Sesion 1: Arrays y Listas Enlazadas
# ITSEIA - Periodo 2

import time

# ============================================================
# PARTE 1: Array (lista de Python) — acceso directo por indice
# ============================================================

print("=" * 55)
print("PARTE 1: Array — Sistema de Turnos Hospital Ecuador")
print("=" * 55)

# Un array en Python es una lista con indice de acceso O(1)
turnos = []

# Agregar pacientes al final: O(1) amortizado
pacientes_llegada = [
    {"id": "T001", "nombre": "Carlos Benavides", "prioridad": "normal"},
    {"id": "T002", "nombre": "Ana Torres",        "prioridad": "urgente"},
    {"id": "T003", "nombre": "Pedro Sanchez",     "prioridad": "normal"},
    {"id": "T004", "nombre": "Maria Guerrero",    "prioridad": "normal"},
    {"id": "T005", "nombre": "Luis Paucar",       "prioridad": "urgente"},
]

for p in pacientes_llegada:
    turnos.append(p)
    print(f"  Turno asignado: {p['id']} - {p['nombre']}")

print(f"\n  Total en sala: {len(turnos)}")

# Acceso directo por indice: O(1)
print(f"\n  Turno actual (indice 0): {turnos[0]['nombre']}")
print(f"  Tercer paciente       : {turnos[2]['nombre']}")

# Insertar urgente al INICIO: O(n) — esto es costoso en arrays grandes
inicio = time.perf_counter()
turno_urgente = {"id": "T000", "nombre": "Emergencia Infarto", "prioridad": "critico"}
turnos.insert(0, turno_urgente)
fin = time.perf_counter()
print(f"\n  Insercion al inicio: {(fin-inicio)*1000:.4f} ms (desplaza {len(turnos)-1} elementos)")

# Atender (remover del inicio): O(n) — tambien costoso
atendido = turnos.pop(0)
print(f"  Paciente atendido : {atendido['nombre']}")
print(f"  Pacientes restantes: {len(turnos)}")

# Buscar por ID: O(n) — escaneo lineal
def buscar_turno(lista, id_turno):
    for i, turno in enumerate(lista):
        if turno["id"] == id_turno:
            return i, turno
    return -1, None

idx, encontrado = buscar_turno(turnos, "T003")
print(f"\n  Busqueda T003: indice {idx} - {encontrado['nombre']}")

# Slicing: obtener los primeros 3 en espera
print(f"\n  Proximos 3 pacientes: {[t['nombre'] for t in turnos[:3]]}")


# ============================================================
# PARTE 2: Lista Enlazada — insercion O(1) al inicio
# ============================================================

print("\n" + "=" * 55)
print("PARTE 2: Lista Enlazada — Historial de Atenciones")
print("=" * 55)

class Nodo:
    """Nodo de la lista enlazada."""
    def __init__(self, dato):
        self.dato = dato
        self.siguiente = None  # Referencia al proximo nodo

class ListaEnlazada:
    """Lista enlazada simple."""

    def __init__(self):
        self.cabeza = None  # Primer nodo
        self.tamano = 0

    def insertar_al_inicio(self, dato):
        """O(1): solo se actualiza el puntero de cabeza."""
        nuevo = Nodo(dato)
        nuevo.siguiente = self.cabeza
        self.cabeza = nuevo
        self.tamano += 1

    def insertar_al_final(self, dato):
        """O(n): hay que recorrer hasta el final."""
        nuevo = Nodo(dato)
        if self.cabeza is None:
            self.cabeza = nuevo
        else:
            actual = self.cabeza
            while actual.siguiente is not None:
                actual = actual.siguiente
            actual.siguiente = nuevo
        self.tamano += 1

    def eliminar_inicio(self):
        """O(1): solo actualizar cabeza."""
        if self.cabeza is None:
            return None
        dato = self.cabeza.dato
        self.cabeza = self.cabeza.siguiente
        self.tamano -= 1
        return dato

    def buscar(self, cedula):
        """O(n): recorrer hasta encontrar."""
        actual = self.cabeza
        posicion = 0
        while actual is not None:
            if actual.dato.get("cedula") == cedula:
                return posicion, actual.dato
            actual = actual.siguiente
            posicion += 1
        return -1, None

    def mostrar(self):
        """Recorre e imprime toda la lista."""
        actual = self.cabeza
        elementos = []
        while actual is not None:
            elementos.append(actual.dato["nombre"])
            actual = actual.siguiente
        print(f"  Lista ({self.tamano} nodos): {' -> '.join(elementos)} -> NULL")


# Usar la lista enlazada para historial de atenciones
historial = ListaEnlazada()

atenciones = [
    {"cedula": "1712345678", "nombre": "Carlos Benavides", "diagnostico": "Hipertension"},
    {"cedula": "0912345679", "nombre": "Ana Torres",       "diagnostico": "Gripe"},
    {"cedula": "0102345670", "nombre": "Pedro Sanchez",    "diagnostico": "Control"},
]

# Insertar al inicio: O(1) — la mas reciente queda primero
for atencion in atenciones:
    historial.insertar_al_inicio(atencion)
    print(f"  Atencion registrada: {atencion['nombre']}")

historial.mostrar()

# Buscar en el historial
_, resultado = historial.buscar("0912345679")
if resultado:
    print(f"\n  Encontrado: {resultado['nombre']} - {resultado['diagnostico']}")


# ============================================================
# PARTE 3: Comparacion de rendimiento
# ============================================================

print("\n" + "=" * 55)
print("PARTE 3: Comparacion de Rendimiento")
print("=" * 55)

N = 10000

# Array: insercion al inicio N veces
arr = []
t0 = time.perf_counter()
for i in range(N):
    arr.insert(0, i)
t1 = time.perf_counter()
tiempo_array_inicio = (t1 - t0) * 1000

# Lista enlazada: insercion al inicio N veces
ll = ListaEnlazada()
t0 = time.perf_counter()
for i in range(N):
    ll.insertar_al_inicio({"cedula": str(i), "nombre": f"Paciente {i}", "diagnostico": ""})
t1 = time.perf_counter()
tiempo_ll_inicio = (t1 - t0) * 1000

print(f"  {N} inserciones al INICIO:")
print(f"    Array          : {tiempo_array_inicio:.2f} ms  (O(n^2) total)")
print(f"    Lista enlazada : {tiempo_ll_inicio:.2f} ms  (O(n) total)")
print(f"  Factor de diferencia: {tiempo_array_inicio/tiempo_ll_inicio:.1f}x mas rapida la lista enlazada")
```

3. Ejecuta el codigo y anota los tiempos de rendimiento de la Parte 3.

4. Modifica el experimento para N = 50,000 y observa como crece la diferencia.

## Usa IA para...

> Abre ChatGPT y escribe:
> "En Python, ¿cual es la diferencia entre una lista (list) y una lista enlazada (linked list)? ¿En que casos reales usaria una lista enlazada en lugar de una lista de Python? ¿Python tiene lista enlazada en su libreria estandar?"

Despues de leer la respuesta:
- Busca en Python el modulo `collections.deque` y explica en una oracion por que es mas eficiente que `list` para operaciones al inicio.
- Pregunta: "¿Que es una lista doblemente enlazada y cuando la necesito?"

## Que aprendiste

- Un array (lista Python) tiene acceso O(1) por indice pero insercion/eliminacion O(n) al inicio por el desplazamiento de elementos.
- Una lista enlazada tiene insercion/eliminacion O(1) al inicio (solo actualizar punteros) pero acceso O(n) por posicion.
- Las listas enlazadas usan mas memoria por nodo (dato + puntero) que los arrays (solo dato).
- La eleccion de estructura depende del patron de uso: si necesitas acceso frecuente por indice, usa array; si necesitas insertar/borrar frecuentemente al inicio, usa lista enlazada.
- Python implementa listas como arrays dinamicos; para eficiencia en ambos extremos, `collections.deque` usa una lista doblemente enlazada internamente.

## Reto extra

Implementa el metodo `invertir(self)` en la clase `ListaEnlazada` que invierta el orden de todos los nodos sin usar memoria extra (solo actualizando punteros). Prueba que el historial de atenciones se imprime en orden inverso despues de llamar `historial.invertir()`.
