# Ejercicio Sesion 3: Arboles Binarios

**Materia:** Estructuras de Datos y Algoritmos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Implementar un Arbol Binario de Busqueda (BST) y sus recorridos, aplicado a un sistema de indexado de contribuyentes del SRI para busquedas eficientes por RUC en grandes volumenes de datos.

## Contexto

El SRI Ecuador mantiene el Registro Unico de Contribuyentes con mas de 8 millones de registros activos. Las consultas por RUC deben ser instantaneas. Un arbol binario de busqueda permite buscar en O(log n) operaciones en promedio frente a O(n) de un array desordenado. Con 8 millones de registros, eso es la diferencia entre 23 comparaciones (log2 de 8M) y 8,000,000 comparaciones en el peor caso. Este es el fundamento de como los indices de bases de datos funcionan internamente.

## Instrucciones

1. Crea el archivo `sesion03_arboles_binarios.py`.

2. Implementa el BST completo:

```python
# Estructuras de Datos - Sesion 3: Arboles Binarios
# ITSEIA - Periodo 2

class NodoContribuyente:
    """Nodo del arbol: almacena un contribuyente del SRI."""

    def __init__(self, ruc, nombre, tipo, ingresos_anuales):
        self.ruc = ruc                        # Clave de ordenamiento
        self.nombre = nombre
        self.tipo = tipo                      # PERSONA_NATURAL o SOCIEDAD
        self.ingresos_anuales = ingresos_anuales
        self.izquierdo = None                 # Subtree con RUCs menores
        self.derecho = None                   # Subtree con RUCs mayores

    def __str__(self):
        return f"[{self.ruc}] {self.nombre} ({self.tipo}) - ${self.ingresos_anuales:>12,.2f}"


class BST:
    """
    Arbol Binario de Busqueda para contribuyentes SRI Ecuador.
    Ordenado por RUC (numero de 10 o 13 digitos).
    """

    def __init__(self):
        self.raiz = None
        self._total_nodos = 0

    # --------------------------------------------------------
    # INSERCION
    # --------------------------------------------------------
    def insertar(self, ruc, nombre, tipo, ingresos):
        nuevo = NodoContribuyente(ruc, nombre, tipo, ingresos)
        if self.raiz is None:
            self.raiz = nuevo
        else:
            self._insertar_recursivo(self.raiz, nuevo)
        self._total_nodos += 1

    def _insertar_recursivo(self, actual, nuevo):
        if nuevo.ruc < actual.ruc:
            if actual.izquierdo is None:
                actual.izquierdo = nuevo
            else:
                self._insertar_recursivo(actual.izquierdo, nuevo)
        elif nuevo.ruc > actual.ruc:
            if actual.derecho is None:
                actual.derecho = nuevo
            else:
                self._insertar_recursivo(actual.derecho, nuevo)
        # Si ruc == actual.ruc: duplicado, no se inserta

    # --------------------------------------------------------
    # BUSQUEDA: O(log n) promedio
    # --------------------------------------------------------
    def buscar(self, ruc):
        """Retorna el nodo y el numero de comparaciones realizadas."""
        return self._buscar_recursivo(self.raiz, ruc, 0)

    def _buscar_recursivo(self, nodo, ruc, comparaciones):
        comparaciones += 1
        if nodo is None:
            return None, comparaciones
        if ruc == nodo.ruc:
            return nodo, comparaciones
        elif ruc < nodo.ruc:
            return self._buscar_recursivo(nodo.izquierdo, ruc, comparaciones)
        else:
            return self._buscar_recursivo(nodo.derecho, ruc, comparaciones)

    # --------------------------------------------------------
    # RECORRIDOS (Traversals)
    # --------------------------------------------------------
    def inorden(self):
        """
        Recorrido In-Order: izquierdo -> raiz -> derecho
        Resultado: lista ORDENADA de contribuyentes por RUC
        """
        resultado = []
        self._inorden_recursivo(self.raiz, resultado)
        return resultado

    def _inorden_recursivo(self, nodo, resultado):
        if nodo is not None:
            self._inorden_recursivo(nodo.izquierdo, resultado)
            resultado.append(nodo)
            self._inorden_recursivo(nodo.derecho, resultado)

    def preorden(self):
        """
        Recorrido Pre-Order: raiz -> izquierdo -> derecho
        Util para serializar/guardar el arbol
        """
        resultado = []
        self._preorden_recursivo(self.raiz, resultado)
        return resultado

    def _preorden_recursivo(self, nodo, resultado):
        if nodo is not None:
            resultado.append(nodo)
            self._preorden_recursivo(nodo.izquierdo, resultado)
            self._preorden_recursivo(nodo.derecho, resultado)

    def postorden(self):
        """
        Recorrido Post-Order: izquierdo -> derecho -> raiz
        Util para eliminar el arbol o calcular expresiones
        """
        resultado = []
        self._postorden_recursivo(self.raiz, resultado)
        return resultado

    def _postorden_recursivo(self, nodo, resultado):
        if nodo is not None:
            self._postorden_recursivo(nodo.izquierdo, resultado)
            self._postorden_recursivo(nodo.derecho, resultado)
            resultado.append(nodo)

    # --------------------------------------------------------
    # UTILIDADES
    # --------------------------------------------------------
    def altura(self):
        """Altura del arbol: numero de niveles."""
        return self._altura_recursiva(self.raiz)

    def _altura_recursiva(self, nodo):
        if nodo is None:
            return 0
        return 1 + max(self._altura_recursiva(nodo.izquierdo),
                       self._altura_recursiva(nodo.derecho))

    def minimo(self):
        """El nodo mas a la izquierda tiene el RUC menor."""
        if self.raiz is None:
            return None
        actual = self.raiz
        while actual.izquierdo is not None:
            actual = actual.izquierdo
        return actual

    def maximo(self):
        """El nodo mas a la derecha tiene el RUC mayor."""
        if self.raiz is None:
            return None
        actual = self.raiz
        while actual.derecho is not None:
            actual = actual.derecho
        return actual

    def rango(self, ruc_min, ruc_max):
        """Buscar todos los contribuyentes en un rango de RUCs."""
        resultado = []
        self._rango_recursivo(self.raiz, ruc_min, ruc_max, resultado)
        return resultado

    def _rango_recursivo(self, nodo, ruc_min, ruc_max, resultado):
        if nodo is None:
            return
        if ruc_min < nodo.ruc:
            self._rango_recursivo(nodo.izquierdo, ruc_min, ruc_max, resultado)
        if ruc_min <= nodo.ruc <= ruc_max:
            resultado.append(nodo)
        if nodo.ruc < ruc_max:
            self._rango_recursivo(nodo.derecho, ruc_min, ruc_max, resultado)

    def visualizar(self, nodo=None, prefijo="", es_derecho=True):
        """Visualizacion ASCII del arbol."""
        if nodo is None:
            nodo = self.raiz
        if nodo is None:
            print("  (arbol vacio)")
            return
        print(prefijo + ("L-- " if not es_derecho else "R-- ") + str(nodo.ruc))
        if nodo.izquierdo or nodo.derecho:
            if nodo.derecho:
                self.visualizar(nodo.derecho, prefijo + ("    " if not es_derecho else "    "), True)
            if nodo.izquierdo:
                self.visualizar(nodo.izquierdo, prefijo + ("    " if not es_derecho else "    "), False)


# ============================================================
# POBLAR EL BST CON CONTRIBUYENTES SRI ECUADOR
# ============================================================

sri = BST()

contribuyentes = [
    ("1792012345001", "Tech Solutions S.A.",      "SOCIEDAD",       450000),
    ("1712345678001", "Carlos Benavides",          "PERSONA_NATURAL",  28000),
    ("0912345679001", "Maria Torres",              "PERSONA_NATURAL",  15000),
    ("1001234567001", "Ferreteria Nacional Cia.",  "SOCIEDAD",        180000),
    ("1792099999001", "ImagemIA S.A.",             "SOCIEDAD",        220000),
    ("1300012345001", "Pedro Sanchez",             "PERSONA_NATURAL",   9500),
    ("0601234567001", "Cooperativa Chimborazo",    "SOCIEDAD",        350000),
    ("1802345678001", "Ana Guerrero",              "PERSONA_NATURAL",  32000),
    ("1400123456001", "Agricola Amazonica S.A.",   "SOCIEDAD",         95000),
    ("1712000001001", "H3L Ecuador S.A.",          "SOCIEDAD",        680000),
]

print("Insertando contribuyentes en el BST SRI:")
for ruc, nombre, tipo, ingresos in contribuyentes:
    sri.insertar(ruc, nombre, tipo, ingresos)
    print(f"  Insertado: {ruc} - {nombre}")

print(f"\nTotal nodos: {sri._total_nodos}")
print(f"Altura del arbol: {sri.altura()} niveles")
print(f"Comparaciones teoricas max: ~{sri.altura()} (vs {sri._total_nodos} en lista lineal)")

# VISUALIZAR el arbol
print("\nESTRUCTURA DEL ARBOL (RUCs):")
sri.visualizar(sri.raiz, "", False)

# BUSQUEDAS
print("\n" + "=" * 58)
print("BUSQUEDAS EN EL BST:")
rucs_buscar = ["1712345678001", "0912345679001", "9999999999001"]
for ruc in rucs_buscar:
    nodo, comps = sri.buscar(ruc)
    if nodo:
        print(f"  Encontrado en {comps} comparaciones: {nodo}")
    else:
        print(f"  '{ruc}' no encontrado ({comps} comparaciones)")

# RECORRIDOS
print("\n" + "=" * 58)
print("RECORRIDO INORDEN (contribuyentes ordenados por RUC):")
for n in sri.inorden():
    print(f"  {n}")

# ESTADISTICAS
print("\n" + "=" * 58)
print("ESTADISTICAS SRI:")
print(f"  RUC menor : {sri.minimo()}")
print(f"  RUC mayor : {sri.maximo()}")

# RANGO: contribuyentes en un rango de RUC
print("\nContribuyentes RUC entre 1300000000000 y 1800000000000:")
en_rango = sri.rango("1300000000000", "1800000000000")
for n in en_rango:
    print(f"  {n}")

# INGRESOS TOTALES (recorrer todo el arbol)
total_ingresos = sum(n.ingresos_anuales for n in sri.inorden())
print(f"\nTotal ingresos anuales en el BST: ${total_ingresos:,.2f}")
```

3. Ejecuta y observa el recorrido inorden: ¿estan los RUCs en orden ascendente?

4. Inserta un nuevo contribuyente con RUC `1500000001001` y observa donde queda en el arbol.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Explica visualmente con texto como un Arbol Binario de Busqueda ordena sus nodos. Si inserto los valores: 50, 30, 70, 20, 40, 60, 80 en ese orden, ¿como queda el arbol? Dibuja el resultado en ASCII."

Despues de leer la respuesta:
- Verifica el resultado creando un BST con esos valores y usando `visualizar()`.
- Pregunta: "¿Que es un arbol AVL y por que mejora el rendimiento del BST en el peor caso?"

## Que aprendiste

- Un BST organiza los datos de forma que el subarbol izquierdo siempre tiene valores menores y el derecho mayores que la raiz.
- La busqueda en un BST balanceado es O(log n); en el peor caso (arbol degenerado, lista) es O(n).
- El recorrido inorden de un BST siempre produce los elementos en orden ascendente.
- Los tres recorridos (inorden, preorden, postorden) tienen usos diferentes: inorden para ordenar, preorden para serializar, postorden para eliminar.
- Los indices de bases de datos usan variantes de arboles balanceados (B-trees) para garantizar O(log n) siempre.

## Reto extra

Implementa el metodo `eliminar(ruc)` en el BST que borre un nodo manteniendo la propiedad del arbol. Este es uno de los algoritmos mas complejos del BST: si el nodo tiene dos hijos, debe ser reemplazado por su sucesor inorden (el minimo de su subarbol derecho). Prueba eliminar `1712345678001` y verifica con `inorden()` que el arbol sigue correcto.
