#!/usr/bin/env node
// load_pilot_fundamentos_s9_12.js
// Sesiones 9-12 de Fundamentos de Programacion

const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';
const SUBJECT_ID = '0df94819-8ccc-499b-ae88-7ed70713295d';

const H = { 'apikey': SKEY, 'Authorization': 'Bearer ' + SKEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' };
const Hmin = { 'apikey': SKEY, 'Authorization': 'Bearer ' + SKEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' };

async function api(method, path, body, minimal = false) {
  const res = await fetch(BASE + path, { method, headers: minimal ? Hmin : H, body: body ? JSON.stringify(body) : undefined });
  if (minimal) return null;
  const data = await res.json();
  if (res.status >= 400) throw new Error(`\${method} \${path} → ${res.status}: \${JSON.stringify(data).substring(0, 200)}`);
  return Array.isArray(data) ? data[0] : data;
}

const SESSIONS = [

// ============================================================
// SESION 9: Funciones II
// ============================================================
{
  number: 9,
  title: 'Funciones II (scope, *args, **kwargs, lambda)',
  video_url: 'https://www.youtube.com/watch?v=Ej_02ICOIgs',
  estimated_duration_minutes: 60,
  theory_markdown: `# Sesión 9: Funciones II — Scope, *args, **kwargs y Lambda

## Scope (ámbito de variables)

El scope define dónde "vive" una variable. Python sigue la regla **LEGB**: Local → Enclosing → Global → Built-in.

\`\`\`python
# Variable GLOBAL: definida fuera de todas las funciones
nombre_empresa = "ITSEIA"

def mostrar_info():
    # Variable LOCAL: solo existe dentro de esta función
    mensaje = "Bienvenido"
    print(f"{mensaje} a {nombre_empresa}")  # Puede leer la global

def cambiar_global():
    global nombre_empresa  # Declarar intención de modificar global
    nombre_empresa = "ITSEIA Academy"

mostrar_info()     # Bienvenido a ITSEIA
cambiar_global()
mostrar_info()     # Bienvenido a ITSEIA Academy

# La variable local NO existe fuera de la función
try:
    print(mensaje)  # NameError: name 'mensaje' is not defined
except NameError as e:
    print(f"Error: {e}")
\`\`\`

**Regla de oro:** Evita usar \`global\`. Es mejor pasar valores como parámetros y retornarlos. Las variables globales hacen el código difícil de mantener.

## *args: argumentos posicionales variables

\`\`\`python
# Cuando no sabes cuántos argumentos recibirás
def sumar_todo(*numeros):
    """Suma cualquier cantidad de números."""
    print(f"Argumentos recibidos: {numeros}")  # Es una tupla
    return sum(numeros)

print(sumar_todo(1, 2))           # 3
print(sumar_todo(1, 2, 3, 4, 5))  # 15
print(sumar_todo())               # 0

# Combinar parámetros normales con *args
def mostrar_reporte(titulo, *datos):
    print(f"\\n=== {titulo} ===")
    for i, dato in enumerate(datos, 1):
        print(f"  {i}. {dato}")

mostrar_reporte("Notas del alumno", 8.5, 9.0, 7.5, 8.0)
mostrar_reporte("Ciudades ITSEIA", "Quito", "Guayaquil", "Cuenca")
\`\`\`

## **kwargs: argumentos nombrados variables

\`\`\`python
# Cuando no sabes qué parámetros nombrados recibirás
def configurar_modelo(**hiperparametros):
    """Acepta cualquier hiperparámetro de modelo."""
    print(f"Configuración recibida: {hiperparametros}")
    for param, valor in hiperparametros.items():
        print(f"  {param}: {valor}")

configurar_modelo(
    learning_rate=0.001,
    epochs=100,
    batch_size=32,
    dropout=0.2
)

# Combinar todo
def crear_experimento(nombre, *datos, **config):
    print(f"Experimento: {nombre}")
    print(f"Datos de entrada: {datos}")
    print(f"Configuración: {config}")

crear_experimento(
    "exp_001",          # nombre
    [1, 2, 3],          # *datos
    [4, 5, 6],
    modelo="ResNet50",  # **config
    precision="float32"
)
\`\`\`

## Funciones Lambda (anónimas)

\`\`\`python
# Función normal vs lambda
def cuadrado(x):
    return x ** 2

cuadrado_lambda = lambda x: x ** 2

print(cuadrado(5))        # 25
print(cuadrado_lambda(5)) # 25

# Lambda es ideal para funciones pequeñas como argumento
numeros = [5, 2, 8, 1, 9, 3]
ordenados = sorted(numeros, key=lambda x: x)           # Ascendente
descendente = sorted(numeros, key=lambda x: -x)        # Descendente

# Ordenar lista de diccionarios (muy común en procesamiento de datos)
estudiantes = [
    {"nombre": "Ana", "nota": 9.0},
    {"nombre": "Carlos", "nota": 7.5},
    {"nombre": "María", "nota": 8.5}
]
por_nota = sorted(estudiantes, key=lambda e: e["nota"], reverse=True)
for est in por_nota:
    print(f"{est['nombre']}: {est['nota']}")

# Lambda con map y filter
temperaturas = [36.5, 38.2, 37.0, 39.5, 36.8]
fiebre = list(filter(lambda t: t > 37.5, temperaturas))
celsius_a_fahrenheit = list(map(lambda c: c * 9/5 + 32, temperaturas))

print(f"Temperaturas con fiebre: {fiebre}")
print(f"En Fahrenheit: {celsius_a_fahrenheit}")
\`\`\`

## Funciones como argumentos (Higher-order functions)

\`\`\`python
# Las funciones en Python son "objetos de primera clase"
# Puedes pasarlas como argumentos

def aplicar_operacion(datos, operacion):
    """Aplica cualquier función a cada elemento."""
    return [operacion(x) for x in datos]

def normalizar(x):
    return x / 100

def a_porcentaje(x):
    return f"{x:.1f}%"

notas = [8.5, 9.0, 7.5, 8.0]
print(aplicar_operacion(notas, normalizar))      # [0.085, 0.09, ...]
print(aplicar_operacion(notas, a_porcentaje))    # ['8.5%', '9.0%', ...]

# En ML: función de pérdida intercambiable
def mse(real, pred):
    return sum((r - p) ** 2 for r, p in zip(real, pred)) / len(real)

def mae(real, pred):
    return sum(abs(r - p) for r, p in zip(real, pred)) / len(real)

def evaluar_modelo(reales, predicciones, metrica=mse):
    """Evalúa con cualquier función de pérdida."""
    return metrica(reales, predicciones)

reales = [3, 5, 2, 8]
preds  = [2.9, 5.2, 1.8, 7.5]
print(f"MSE: {evaluar_modelo(reales, preds, mse):.4f}")
print(f"MAE: {evaluar_modelo(reales, preds, mae):.4f}")
\`\`\`

## Funciones anidadas y closures

\`\`\`python
# Una función que genera otras funciones
def crear_multiplicador(factor):
    """Retorna una función que multiplica por 'factor'."""
    def multiplicar(x):
        return x * factor  # 'factor' viene del scope externo
    return multiplicar

doble = crear_multiplicador(2)
triple = crear_multiplicador(3)
por_diez = crear_multiplicador(10)

print(doble(5))    # 10
print(triple(5))   # 15
print(por_diez(5)) # 50

# Muy útil para crear funciones de preprocesamiento configurables
def crear_normalizador(minimo, maximo):
    def normalizar(valor):
        return (valor - minimo) / (maximo - minimo)
    return normalizar

norm_temperatura = crear_normalizador(35.0, 42.0)
print(norm_temperatura(38.5))  # 0.5 (justo en el medio)
\`\`\``,

  quiz: {
    title: 'Quiz S9 - Funciones II',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Qué son *args en una función de Python?',
        options: JSON.stringify([
          { text: 'Un error de sintaxis: el asterisco no es válido en parámetros', is_correct: false },
          { text: 'Permite recibir cualquier número de argumentos posicionales como una tupla', is_correct: true },
          { text: 'Solo permite argumentos de tipo string', is_correct: false },
          { text: 'Es un argumento requerido especial', is_correct: false }
        ]),
        explanation: '*args (el nombre "args" es convención, el * es lo importante) permite que una función acepte cualquier número de argumentos posicionales. Dentro de la función, *args es una tupla con todos los argumentos recibidos. def f(*args): print(args); f(1,2,3) imprime (1, 2, 3). Es ideal cuando no sabes de antemano cuántos argumentos recibirá la función.'
      },
      {
        question_text: '¿Cuál es la diferencia entre *args y **kwargs?',
        options: JSON.stringify([
          { text: '*args recibe argumentos posicionales (tupla); **kwargs recibe argumentos nombrados (diccionario)', is_correct: true },
          { text: '*args es para strings; **kwargs es para números', is_correct: false },
          { text: '*args es más rápido; **kwargs es más seguro', is_correct: false },
          { text: 'Son idénticos, solo es diferente convención de nombre', is_correct: false }
        ]),
        explanation: '*args captura argumentos posicionales: f(1,2,3) → args=(1,2,3) (tupla). **kwargs captura argumentos nombrados: f(a=1,b=2) → kwargs={\'a\':1,\'b\':2} (diccionario). Pueden usarse juntos: def f(*args, **kwargs). Son fundamentales en frameworks como Flask, Django y librerías ML donde las APIs necesitan flexibilidad.'
      },
      {
        question_text: '¿Cuándo es apropiado usar una función lambda?',
        options: JSON.stringify([
          { text: 'Para funciones complejas con múltiples líneas y documentación', is_correct: false },
          { text: 'Para funciones pequeñas de una expresión, especialmente como argumento de sorted(), map() o filter()', is_correct: true },
          { text: 'Para reemplazar siempre las funciones def en código moderno', is_correct: false },
          { text: 'Solo cuando la función es recursiva', is_correct: false }
        ]),
        explanation: 'Lambda es ideal para funciones de una sola expresión usadas una vez, especialmente como argumentos: sorted(lista, key=lambda x: x["edad"]). Para funciones complejas, reutilizables o que necesitan docstring, usa def. PEP8 desaconseja asignar lambdas a variables (en ese caso, usa def). La legibilidad es el criterio: si la lambda no es inmediatamente clara, usa def con nombre descriptivo.'
      },
      {
        question_text: '¿Qué imprime este código?\n\nx = 10\ndef cambiar():\n    x = 20\n    print("dentro:", x)\n\ncambiar()\nprint("fuera:", x)',
        options: JSON.stringify([
          { text: 'dentro: 20 / fuera: 20', is_correct: false },
          { text: 'dentro: 10 / fuera: 10', is_correct: false },
          { text: 'dentro: 20 / fuera: 10', is_correct: true },
          { text: 'Error: x ya está definida', is_correct: false }
        ]),
        explanation: 'Dentro de cambiar(), "x = 20" crea una NUEVA variable LOCAL x, no modifica la global. La x global sigue siendo 10. Para modificar la global se necesita "global x" antes de la asignación. Este es el concepto de scope local vs global: las funciones tienen su propio espacio de variables que no afecta el exterior (a menos que uses global, lo cual se desaconseja).'
      },
      {
        question_text: '¿Cuál es el resultado de: list(map(lambda x: x**2, [1, 2, 3, 4]))?',
        options: JSON.stringify([
          { text: '[1, 4, 9, 16]', is_correct: true },
          { text: '[2, 4, 6, 8]', is_correct: false },
          { text: '30 (suma de cuadrados)', is_correct: false },
          { text: 'Error: map no acepta lambda', is_correct: false }
        ]),
        explanation: 'map(función, iterable) aplica la función a cada elemento. lambda x: x**2 calcula el cuadrado. Aplicado a [1,2,3,4]: 1²=1, 2²=4, 3²=9, 4²=16. map() retorna un iterador (por eso se envuelve en list() para ver los resultados). Equivalente a la list comprehension: [x**2 for x in [1,2,3,4]]. En Python moderno, las list comprehensions son más legibles y preferidas sobre map().'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 9: Motor de Procesamiento Configurable',
    instructions_markdown: `## Ejercicio Práctico: Motor de Procesamiento de Datos Configurable

### Objetivo
Aplicar *args, **kwargs y lambdas para construir un sistema flexible de procesamiento de datos.

### Código base

\`\`\`python
# ================================================
# MOTOR DE PROCESAMIENTO DE DATOS - ITSEIA
# ================================================

# --- FUNCIÓN 1: Estadísticas flexibles ---
def calcular_stats(*valores, precision=2, incluir_mediana=True):
    """
    Calcula estadísticas de cualquier cantidad de valores.
    Args:
        *valores: Cualquier cantidad de números
        precision (int): Decimales en resultados (default: 2)
        incluir_mediana (bool): Si calcular mediana (default: True)
    Returns:
        dict con estadísticas
    """
    # COMPLETA: calcula media, max, min
    # Si incluir_mediana es True, calcula también la mediana
    pass

# Prueba:
# print(calcular_stats(5, 3, 8, 1, 9))
# print(calcular_stats(100, 200, 300, precision=0, incluir_mediana=False))

# --- FUNCIÓN 2: Pipeline configurable ---
def pipeline_datos(datos, *transformaciones):
    """
    Aplica una serie de transformaciones en orden.
    Args:
        datos: Lista de valores
        *transformaciones: Funciones a aplicar en secuencia
    Returns:
        Datos transformados
    """
    resultado = datos
    for transformacion in transformaciones:
        resultado = [transformacion(x) for x in resultado]
    return resultado

# Transformaciones disponibles (lambdas)
redondear_2 = lambda x: round(x, 2)
a_entero = lambda x: int(x)
normalizar = lambda x: x / 100

# Prueba:
# datos = [12.345, 67.891, 34.567]
# print(pipeline_datos(datos, redondear_2))
# print(pipeline_datos(datos, normalizar, redondear_2))

# --- FUNCIÓN 3: Creador de funciones de umbral ---
def crear_clasificador(umbral_bajo, umbral_alto, **etiquetas):
    """
    Crea una función clasificadora con umbrales configurables.
    Args:
        umbral_bajo: Valor por debajo del cual es 'bajo'
        umbral_alto: Valor por encima del cual es 'alto'
        **etiquetas: Permite personalizar etiquetas
                     (bajo='rojo', normal='verde', alto='amarillo')
    Returns:
        Función clasificadora
    """
    etiqueta_bajo = etiquetas.get('bajo', 'BAJO')
    etiqueta_normal = etiquetas.get('normal', 'NORMAL')
    etiqueta_alto = etiquetas.get('alto', 'ALTO')

    def clasificar(valor):
        # COMPLETA: retorna la etiqueta según el valor
        pass

    return clasificar

# Prueba:
# clasificar_nota = crear_clasificador(5, 8, bajo='Reprobado', normal='Aprobado', alto='Sobresaliente')
# for nota in [3, 6, 9.5]:
#     print(f"Nota {nota}: {clasificar_nota(nota)}")

# --- FUNCIÓN 4: Reporte consolidado ---
def generar_reporte(titulo, **secciones):
    """
    Genera un reporte con secciones variables.
    Cada clave en **secciones es el nombre de una sección,
    cada valor es la información de esa sección.
    """
    print("=" * 50)
    print(f"REPORTE: {titulo.upper()}")
    print("=" * 50)
    for nombre_seccion, contenido in secciones.items():
        print(f"\\n--- {nombre_seccion.upper()} ---")
        if isinstance(contenido, list):
            for item in contenido:
                print(f"  • {item}")
        elif isinstance(contenido, dict):
            for k, v in contenido.items():
                print(f"  {k}: {v}")
        else:
            print(f"  {contenido}")

# Prueba:
# generar_reporte(
#     "Modelo de IA",
#     datos={"registros": 1000, "features": 15, "target": "spam"},
#     metricas={"accuracy": "94.5%", "f1": "0.93"},
#     advertencias=["Dataset desbalanceado", "3 features con valores nulos"]
# )

# ================================================
# PROGRAMA PRINCIPAL
# ================================================
if __name__ == "__main__":
    # Usa todas las funciones creadas aquí
    datos_sensor = [23.456, 45.123, 12.789, 67.234, 34.567, 89.012]

    stats = calcular_stats(*datos_sensor, precision=1)
    print("Estadísticas:", stats)

    datos_procesados = pipeline_datos(datos_sensor, redondear_2, normalizar)
    print("Datos procesados:", datos_procesados)

    clasificar = crear_clasificador(30, 60, bajo='Frio', normal='Templado', alto='Caliente')
    clasificaciones = [(d, clasificar(d)) for d in datos_sensor]
    print("Clasificaciones:", clasificaciones)
\`\`\`

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| calcular_stats con *args y **kwargs | 25 pts |
| pipeline_datos con *transformaciones | 25 pts |
| crear_clasificador retorna función correcta | 30 pts |
| Programa principal ejecuta sin errores | 20 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'Python Scopes - LEGB Rule explicado', url: 'https://realpython.com/python-scope-legb-rule/', type: 'article', description: 'Guía completa de scope en Python' },
    { title: 'Lambda, map, filter - Python oficial', url: 'https://docs.python.org/es/3/tutorial/controlflow.html#lambda-expressions', type: 'documentation', description: 'Documentación oficial de funciones lambda' },
    { title: 'args y kwargs - Brais Moure', url: 'https://www.youtube.com/watch?v=Ej_02ICOIgs', type: 'video', description: 'Tutorial *args y **kwargs en español' },
    { title: 'Functools - Python stdlib', url: 'https://docs.python.org/es/3/library/functools.html', type: 'documentation', description: 'Herramientas para programación funcional en Python' },
    { title: 'Higher-order functions - Real Python', url: 'https://realpython.com/python-functional-programming/', type: 'article', description: 'Programación funcional en Python' }
  ],

  ai_lab_context: 'Sesión 9: el alumno aprendió scope LEGB, global, *args (tupla), **kwargs (diccionario), funciones lambda, map/filter, funciones como argumentos, y closures. Puede crear APIs de funciones flexibles.',
  ai_lab_suggested_prompt: 'Aprendí *args y **kwargs. ¿Puedes mostrarme cómo una librería real como pandas o scikit-learn usa **kwargs en sus funciones? Quiero entender por qué son tan útiles en proyectos de IA reales.'
},

// ============================================================
// SESION 10: Listas
// ============================================================
{
  number: 10,
  title: 'Listas',
  video_url: 'https://www.youtube.com/watch?v=YpXAWNVGOuA',
  estimated_duration_minutes: 60,
  theory_markdown: `# Sesión 10: Listas

## ¿Por qué son fundamentales?

Las listas son la estructura de datos más usada en Python y en IA. Un dataset de 10,000 imágenes, los precios de las últimas 12 semanas, las predicciones de un modelo: todo son listas. NumPy arrays (la base de todo ML) son listas optimizadas.

## Crear y acceder a listas

\`\`\`python
# Crear listas
vacia = []
numeros = [1, 2, 3, 4, 5]
mezclada = [1, "hola", 3.14, True, None]  # Puede mezclar tipos
anidada = [[1, 2], [3, 4], [5, 6]]       # Lista de listas (matriz)

# Acceso por índice (base 0)
frutas = ["manzana", "pera", "uva", "mango", "kiwi"]
print(frutas[0])   # manzana (primero)
print(frutas[-1])  # kiwi (último)
print(frutas[-2])  # mango (penúltimo)

# Slicing (rebanado)
print(frutas[1:3])   # ['pera', 'uva'] (índices 1 y 2)
print(frutas[:3])    # ['manzana', 'pera', 'uva'] (primeros 3)
print(frutas[2:])    # ['uva', 'mango', 'kiwi'] (desde el 3)
print(frutas[::2])   # ['manzana', 'uva', 'kiwi'] (cada 2)
print(frutas[::-1])  # ['kiwi', 'mango', 'uva', 'pera', 'manzana'] (invertir)
\`\`\`

## Modificar listas

\`\`\`python
colores = ["rojo", "verde", "azul"]

# Cambiar un elemento
colores[1] = "amarillo"
print(colores)  # ['rojo', 'amarillo', 'azul']

# append(): agregar al final
colores.append("morado")
print(colores)  # ['rojo', 'amarillo', 'azul', 'morado']

# insert(): insertar en posición específica
colores.insert(1, "naranja")
print(colores)  # ['rojo', 'naranja', 'amarillo', 'azul', 'morado']

# extend(): agregar múltiples elementos
colores.extend(["blanco", "negro"])
print(colores)

# remove(): eliminar por valor (primera ocurrencia)
colores.remove("naranja")

# pop(): eliminar por índice y retornar el valor
ultimo = colores.pop()     # Elimina el último
segundo = colores.pop(1)   # Elimina el de índice 1

# del: eliminar por índice (sin retornar)
del colores[0]
\`\`\`

## Métodos esenciales de lista

\`\`\`python
numeros = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]

print(len(numeros))          # 10 (longitud)
print(numeros.count(1))      # 2 (cuántos 1 hay)
print(numeros.index(9))      # 5 (índice del primer 9)
print(9 in numeros)          # True (¿está 9 en la lista?)

# Ordenar
numeros.sort()               # Ordena en lugar (modifica la lista)
print(numeros)               # [1, 1, 2, 3, 3, 4, 5, 5, 6, 9]

ordenados = sorted(numeros, reverse=True)  # Retorna nueva lista ordenada
print(ordenados)

# Funciones matemáticas
print(sum(numeros))          # Suma
print(max(numeros))          # Máximo
print(min(numeros))          # Mínimo

# Copiar (¡importante no confundir!)
lista_a = [1, 2, 3]
lista_b = lista_a          # NO es copia: ambas apuntan al mismo objeto
lista_c = lista_a.copy()   # SÍ es copia independiente
lista_d = lista_a[:]       # También es copia

lista_a.append(4)
print(lista_b)  # [1, 2, 3, 4] (cambió porque es la misma!)
print(lista_c)  # [1, 2, 3]    (independiente, no cambió)
\`\`\`

## Listas y funciones

\`\`\`python
def procesar_notas(notas):
    """Análisis completo de un conjunto de notas."""
    if not notas:
        return None

    aprobados = [n for n in notas if n >= 7]
    reprobados = [n for n in notas if n < 7]

    return {
        "total": len(notas),
        "aprobados": len(aprobados),
        "reprobados": len(reprobados),
        "promedio": sum(notas) / len(notas),
        "maximo": max(notas),
        "minimo": min(notas),
        "tasa_aprobacion": len(aprobados) / len(notas)
    }

notas_clase = [8.5, 6.0, 9.5, 4.5, 7.0, 8.0, 5.5, 9.0]
resultado = procesar_notas(notas_clase)
print(f"Tasa de aprobación: {resultado['tasa_aprobacion']:.1%}")
\`\`\`

## Listas anidadas (matrices)

\`\`\`python
# Matriz 3x3 (base de álgebra lineal en IA)
matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Acceso: matriz[fila][columna]
print(matriz[1][2])    # 6 (fila 1, columna 2)

# Iterar sobre matriz
for i, fila in enumerate(matriz):
    for j, valor in enumerate(fila):
        print(f"[{i}][{j}]={valor}", end="  ")
    print()

# Transponer una matriz con list comprehension
transpuesta = [[matriz[j][i] for j in range(3)] for i in range(3)]

# En datasets: lista de registros
dataset = [
    {"id": 1, "nombre": "Ana", "nota": 9.0},
    {"id": 2, "nombre": "Carlos", "nota": 7.5},
    {"id": 3, "nombre": "María", "nota": 8.5}
]
mejores = [r for r in dataset if r["nota"] >= 8.0]
print(f"Estudiantes con nota >= 8: {[r['nombre'] for r in mejores]}")
\`\`\`

## Listas en el contexto de IA

\`\`\`python
# Vectores de características (features)
# En ML, cada muestra es un vector de números
imagen_1 = [0.2, 0.8, 0.1, 0.5, 0.9, 0.3]   # 6 píxeles normalizados
imagen_2 = [0.1, 0.7, 0.2, 0.4, 0.8, 0.2]

# Distancia euclidiana entre dos vectores
def distancia_euclidiana(v1, v2):
    return sum((a - b) ** 2 for a, b in zip(v1, v2)) ** 0.5

dist = distancia_euclidiana(imagen_1, imagen_2)
print(f"Distancia entre imágenes: {dist:.4f}")

# One-hot encoding (conversión de categorías a vectores)
clases = ["gato", "perro", "pájaro"]

def one_hot(clase, clases_posibles):
    return [1 if c == clase else 0 for c in clases_posibles]

print(one_hot("perro", clases))  # [0, 1, 0]
print(one_hot("gato", clases))   # [1, 0, 0]
\`\`\``,

  quiz: {
    title: 'Quiz S10 - Listas',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Qué retorna lista[1:4] si lista = [10, 20, 30, 40, 50]?',
        options: JSON.stringify([
          { text: '[20, 30, 40, 50]', is_correct: false },
          { text: '[20, 30, 40]', is_correct: true },
          { text: '[10, 20, 30, 40]', is_correct: false },
          { text: '[20, 30]', is_correct: false }
        ]),
        explanation: 'El slicing [1:4] incluye los índices 1, 2 y 3 (excluye el 4). lista[1]=20, lista[2]=30, lista[3]=40. Resultado: [20, 30, 40]. La regla es siempre: [inicio:fin] donde inicio es inclusivo y fin es exclusivo. Es como un rango matemático: [1, 4).'
      },
      {
        question_text: '¿Cuál es la diferencia entre lista.append(x) y lista.extend([x, y])?',
        options: JSON.stringify([
          { text: 'append agrega una lista dentro de la lista; extend agrega los elementos individualmente', is_correct: true },
          { text: 'Son idénticos, solo diferente nombre', is_correct: false },
          { text: 'extend es más rápido que append', is_correct: false },
          { text: 'append modifica la lista; extend retorna una nueva lista', is_correct: false }
        ]),
        explanation: 'append(x) agrega x como UN SOLO elemento. Si x es una lista, la agrega como sublista: [1,2].append([3,4]) → [1,2,[3,4]]. extend([3,4]) agrega cada elemento individualmente: [1,2].extend([3,4]) → [1,2,3,4]. Para concatenar listas, también puedes usar +: [1,2] + [3,4] → [1,2,3,4] (crea nueva lista).'
      },
      {
        question_text: '¿Por qué es peligroso hacer b = a cuando a es una lista?',
        options: JSON.stringify([
          { text: 'Porque Python no permite asignar listas a variables', is_correct: false },
          { text: 'Porque b y a apuntan al mismo objeto: modificar uno cambia el otro', is_correct: true },
          { text: 'Porque consume el doble de memoria', is_correct: false },
          { text: 'No es peligroso, es la forma correcta de copiar listas', is_correct: false }
        ]),
        explanation: 'Las listas son objetos mutables. b = a no copia la lista, crea una referencia al MISMO objeto en memoria. Si haces b.append(4), también cambia a. Para copiar independientemente: a.copy(), list(a), o a[:]. Este concepto (mutable vs inmutable, referencias vs copias) es fundamental en programación y afecta directamente bugs en código de IA.'
      },
      {
        question_text: '¿Qué hace lista[::-1]?',
        options: JSON.stringify([
          { text: 'Elimina el último elemento', is_correct: false },
          { text: 'Retorna la lista invertida (de atrás hacia adelante)', is_correct: true },
          { text: 'Retorna solo el primer y último elemento', is_correct: false },
          { text: 'Error: sintaxis inválida', is_correct: false }
        ]),
        explanation: '[::paso] en slicing significa: tomar todos los elementos con el paso indicado. Con paso -1, recorre la lista de atrás hacia adelante. [1,2,3,4,5][::-1] → [5,4,3,2,1]. Otros ejemplos: [::2] toma elementos en posiciones 0,2,4... (saltando de 2 en 2). Es una forma muy pythónica de invertir listas sin usar reversed().'
      },
      {
        question_text: '¿Cuál es la forma más eficiente de filtrar solo los números pares de una lista?',
        options: JSON.stringify([
          { text: 'pares = []\nfor n in numeros:\n    if n % 2 == 0:\n        pares.append(n)', is_correct: false },
          { text: 'pares = [n for n in numeros if n % 2 == 0]', is_correct: true },
          { text: 'pares = numeros.filter(lambda x: x % 2 == 0)', is_correct: false },
          { text: 'pares = numeros[n % 2 == 0]', is_correct: false }
        ]),
        explanation: 'La list comprehension con condición es la forma más pythónica: [expresión for elemento in iterable if condición]. Es equivalente al bucle for con append pero más conciso, legible y ligeramente más rápido. La opción C usa .filter() que no existe como método de lista (es la función built-in filter()). La opción D es sintaxis inválida.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 10: Procesador de Dataset de Pacientes',
    instructions_markdown: `## Ejercicio Práctico: Procesador de Dataset de Pacientes

### Objetivo
Manipular listas para procesar un dataset de pacientes, aplicando técnicas reales de preprocesamiento de datos para Machine Learning.

### Código base

\`\`\`python
# ================================================
# PROCESADOR DE DATASET - ITSEIA
# Dataset: mediciones de 15 pacientes
# Formato: [id, edad, peso_kg, altura_m, glucosa, presion_sistolica]
# ================================================

dataset = [
    [1, 45, 78.5, 1.72, 105, 135],
    [2, 32, 65.0, 1.65, 90, 120],
    [3, 58, 92.3, 1.68, 145, 155],
    [4, 28, 70.0, 1.80, 88, 115],
    [5, 67, 85.0, 1.60, 160, 170],
    [6, 41, 58.0, 1.58, 95, 125],
    [7, 55, 110.0, 1.75, 130, 148],
    [8, 23, 62.0, 1.78, 82, 110],
    [9, 49, 75.0, 1.70, 118, 140],
    [10, 61, 88.0, 1.63, 155, 165],
    [11, 35, 72.0, 1.82, 92, 118],
    [12, 52, 95.0, 1.67, 140, 152],
    [13, 29, 55.0, 1.62, 85, 112],
    [14, 44, 80.5, 1.74, 110, 138],
    [15, 38, 68.0, 1.71, 98, 128],
]

# Índices de columnas (para legibilidad)
IDX_ID, IDX_EDAD, IDX_PESO, IDX_ALTURA, IDX_GLUCOSA, IDX_PRESION = 0, 1, 2, 3, 4, 5

# --- PARTE 1: Extraer columnas individuales ---
# COMPLETA: extrae listas individuales usando list comprehension
edades = []           # Lista de todas las edades
glucosas = []         # Lista de todos los niveles de glucosa
presiones = []        # Lista de todas las presiones

# --- PARTE 2: Calcular IMC para cada paciente ---
# IMC = peso / altura^2
# COMPLETA: imc_lista usando list comprehension
imc_lista = []

# --- PARTE 3: Identificar pacientes en riesgo ---
# Alto riesgo: glucosa > 126 O presion > 140
# COMPLETA: lista de IDs de pacientes en alto riesgo
pacientes_riesgo_alto = []

# Moderado riesgo: glucosa > 100 O presion > 130
# COMPLETA: lista de IDs de pacientes en riesgo moderado (pero no alto)
pacientes_riesgo_moderado = []

# --- PARTE 4: Normalización de glucosa al rango [0,1] ---
glucosa_min = min(glucosas)
glucosa_max = max(glucosas)
# COMPLETA: normaliza cada glucosa usando list comprehension
glucosas_norm = []

# --- PARTE 5: Reporte ---
print("=" * 55)
print("REPORTE DE EVALUACION - DATASET PACIENTES")
print("=" * 55)
print(f"Total de pacientes: {len(dataset)}")
print(f"Rango de edades: {min(edades)}-{max(edades)} años")
print(f"Glucosa promedio: {sum(glucosas)/len(glucosas):.1f} mg/dL")
print(f"Presión promedio: {sum(presiones)/len(presiones):.1f} mmHg")
print(f"IMC promedio: {sum(imc_lista)/len(imc_lista):.2f}")

print(f"\\nPacientes alto riesgo: {len(pacientes_riesgo_alto)}")
print(f"  IDs: {pacientes_riesgo_alto}")
print(f"Pacientes riesgo moderado: {len(pacientes_riesgo_moderado)}")
print(f"  IDs: {pacientes_riesgo_moderado}")

print(f"\\nGlucosas normalizadas (primeras 5): {glucosas_norm[:5]}")

# --- PARTE 6 (RETO): ---
# Ordena el dataset por edad (sin modificar el original)
# Imprime los 3 pacientes más jóvenes y los 3 más viejos
\`\`\`

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| Extracción de columnas con list comprehension | 20 pts |
| Cálculo de IMC correcto | 20 pts |
| Identificación de pacientes en riesgo | 25 pts |
| Normalización correcta [0,1] | 20 pts |
| Ordenamiento por edad (reto) | 15 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'Listas Python - Documentación oficial', url: 'https://docs.python.org/es/3/tutorial/datastructures.html#more-on-lists', type: 'documentation', description: 'Tutorial oficial completo de listas' },
    { title: 'NumPy arrays vs Python lists', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html', type: 'article', description: 'Diferencias y por qué NumPy es mejor para ML' },
    { title: 'Listas Python - MitoCode', url: 'https://www.youtube.com/watch?v=YpXAWNVGOuA', type: 'video', description: 'Tutorial completo de listas en español' },
    { title: 'Python List Visualizer', url: 'https://pythontutor.com', type: 'tool', description: 'Visualiza cómo Python almacena listas en memoria' },
    { title: 'Kaggle - Pandas DataFrames (siguiente nivel)', url: 'https://www.kaggle.com/learn/pandas', type: 'tutorial', description: 'Pandas: listas en esteroides para Data Science' }
  ],

  ai_lab_context: 'Sesión 10: el alumno aprendió crear/acceder/modificar listas, slicing, métodos (append, extend, insert, remove, pop, sort), copia de listas (problema de referencias), listas anidadas como matrices, y vectores de features para ML.',
  ai_lab_suggested_prompt: 'Tengo un dataset como lista de listas en Python. Quiero aprender a hacer las operaciones más comunes: filtrar filas, extraer columnas, calcular promedios por columna, y ordenar. ¿Puedes mostrarme con un ejemplo de 5 registros?'
},

// ============================================================
// SESION 11: Tuplas y Diccionarios
// ============================================================
{
  number: 11,
  title: 'Tuplas y Diccionarios',
  video_url: 'https://www.youtube.com/watch?v=XVaN2cFRPDA',
  estimated_duration_minutes: 65,
  theory_markdown: `# Sesión 11: Tuplas y Diccionarios

## Tuplas: listas inmutables

Una tupla es como una lista, pero **no puede modificarse** después de crearse. Usa tuplas cuando los datos no deben cambiar: coordenadas GPS, configuración fija, retorno de múltiples valores.

\`\`\`python
# Crear tuplas
vacia = ()
un_elemento = (42,)      # ¡La coma es obligatoria para tuplas de 1 elemento!
punto = (3.5, 7.2)       # Coordenada
rgb = (255, 128, 0)      # Color naranja
config = ("produccion", "https://api.itseia.ai", 443)

# Acceso igual que listas
print(punto[0])   # 3.5
print(rgb[-1])    # 0

# Desempaquetado (muy pythónico)
x, y = punto
r, g, b = rgb
entorno, url, puerto = config

print(f"Servidor: {url}:{puerto}")  # https://api.itseia.ai:443

# Las tuplas son inmutables
try:
    rgb[0] = 200    # TypeError: 'tuple' object does not support item assignment
except TypeError as e:
    print(f"Error (esperado): {e}")
\`\`\`

### Cuándo usar tupla vs lista

| Situación | Usar |
|-----------|------|
| Datos que NO deben cambiar (coordenadas, colores, configs) | **Tupla** |
| Retornar múltiples valores de función | **Tupla** |
| Colección que crece/decrece | **Lista** |
| Dataset que se procesa | **Lista** |
| Claves de diccionario (deben ser inmutables) | **Tupla** |

\`\`\`python
# Tuplas como claves de diccionario
# (las listas no pueden ser claves porque son mutables)
locaciones = {
    (-0.180653, -78.467838): "ITSEIA Quito",
    (-2.170998, -79.922359): "Campus Guayaquil"
}
print(locaciones[(-0.180653, -78.467838)])
\`\`\`

## Diccionarios: la estructura más poderosa de Python

Un diccionario almacena pares **clave: valor**. Es la estructura ideal para representar objetos del mundo real. En JSON (formato estándar de APIs), todos los datos son diccionarios.

\`\`\`python
# Crear diccionarios
vacio = {}
estudiante = {
    "nombre": "Ana García",
    "edad": 22,
    "carrera": "Inteligencia Artificial",
    "semestre": 1,
    "activo": True,
    "notas": [8.5, 9.0, 7.5]
}

# Acceso
print(estudiante["nombre"])   # Ana García
print(estudiante["notas"])    # [8.5, 9.0, 7.5]
print(estudiante["notas"][0]) # 8.5 (primer elemento de la lista de notas)

# get(): acceso seguro (no da error si la clave no existe)
print(estudiante.get("email"))           # None
print(estudiante.get("email", "No definido"))  # No definido
\`\`\`

## Modificar diccionarios

\`\`\`python
# Agregar o modificar
estudiante["email"] = "ana@itseia.ai"       # Agregar nueva clave
estudiante["semestre"] = 2                   # Modificar existente

# Eliminar
del estudiante["activo"]                     # Eliminar clave
semestre = estudiante.pop("semestre")        # Eliminar y obtener valor
print(f"Era semestre: {semestre}")

# update(): actualizar múltiples claves a la vez
estudiante.update({
    "semestre": 1,
    "ciudad": "Quito",
    "beca": False
})
\`\`\`

## Iterar sobre diccionarios

\`\`\`python
config_modelo = {
    "nombre": "clasificador_spam_v2",
    "algoritmo": "RandomForest",
    "n_estimators": 100,
    "max_depth": 10,
    "accuracy": 0.947
}

# Solo claves
for clave in config_modelo:
    print(clave)

# Solo valores
for valor in config_modelo.values():
    print(valor)

# Claves y valores (lo más común)
print("\\nConfiguración del modelo:")
for clave, valor in config_modelo.items():
    print(f"  {clave}: {valor}")

# Verificar si clave existe
if "accuracy" in config_modelo:
    print(f"Accuracy: {config_modelo['accuracy']:.1%}")
\`\`\`

## Diccionarios anidados

\`\`\`python
# Un "objeto" complejo representado como diccionario anidado
modelo_ia = {
    "id": "model_001",
    "metadata": {
        "nombre": "Detector Spam",
        "version": "2.1.0",
        "fecha_entrenamiento": "2026-03-22"
    },
    "arquitectura": {
        "tipo": "RandomForest",
        "hiperparametros": {
            "n_estimators": 100,
            "max_depth": 15,
            "min_samples_split": 5
        }
    },
    "metricas": {
        "entrenamiento": {"accuracy": 0.985, "f1": 0.984},
        "validacion": {"accuracy": 0.947, "f1": 0.943}
    }
}

# Acceso anidado
print(modelo_ia["metadata"]["version"])
print(modelo_ia["metricas"]["validacion"]["accuracy"])

# Modificar valor anidado
modelo_ia["metadata"]["version"] = "2.2.0"
\`\`\`

## Diccionarios por comprensión

\`\`\`python
# Dict comprehension
nombres = ["Ana", "Carlos", "María"]
notas = [9.0, 7.5, 8.5]

# Crear diccionario nombre → nota
calificaciones = {nombre: nota for nombre, nota in zip(nombres, notas)}
print(calificaciones)
# {'Ana': 9.0, 'Carlos': 7.5, 'María': 8.5}

# Con condición: solo aprobados
aprobados = {k: v for k, v in calificaciones.items() if v >= 8.0}
print(aprobados)  # {'Ana': 9.0, 'María': 8.5}

# Contar frecuencia de palabras (patrón clásico)
texto = "python es genial python aprendo python todos los dias"
frecuencia = {}
for palabra in texto.split():
    frecuencia[palabra] = frecuencia.get(palabra, 0) + 1
print(frecuencia)
# {'python': 3, 'es': 1, 'genial': 1, ...}
\`\`\`

## JSON y Diccionarios (conexión directa)

\`\`\`python
import json

# Diccionario → JSON string (para APIs)
datos = {"nombre": "ITSEIA", "version": "2026", "activo": True}
json_string = json.dumps(datos, indent=2)
print(json_string)

# JSON string → Diccionario (respuesta de API)
respuesta_api = '{"prediccion": "spam", "confianza": 0.94}'
datos_api = json.loads(respuesta_api)
print(datos_api["prediccion"])   # spam
print(datos_api["confianza"])    # 0.94

# En IA real: así se comunica un modelo con el mundo
def predecir_spam(texto_email):
    """Simula llamada a un modelo de IA."""
    # En producción: requests.post("https://api.modelo.com", json={"texto": texto_email})
    resultado = {
        "entrada": texto_email[:50],
        "prediccion": "spam" if "gratis" in texto_email.lower() else "no_spam",
        "confianza": 0.93
    }
    return resultado
\`\`\``,

  quiz: {
    title: 'Quiz S11 - Tuplas y Diccionarios',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Cuál es la diferencia fundamental entre una lista y una tupla?',
        options: JSON.stringify([
          { text: 'Las tuplas solo pueden contener números; las listas cualquier tipo', is_correct: false },
          { text: 'Las tuplas son inmutables (no se modifican); las listas son mutables', is_correct: true },
          { text: 'Las tuplas usan [] y las listas usan ()', is_correct: false },
          { text: 'Las listas son más rápidas que las tuplas', is_correct: false }
        ]),
        explanation: 'La diferencia clave es mutabilidad: las listas pueden modificarse (append, remove, cambiar elementos), las tuplas no. Las tuplas usan () y las listas []. Las tuplas son ligeramente más rápidas y ocupan menos memoria que las listas equivalentes, razón adicional para usarlas cuando los datos son fijos.'
      },
      {
        question_text: '¿Qué retorna d.get("clave_inexistente") si "clave_inexistente" no está en el diccionario d?',
        options: JSON.stringify([
          { text: 'KeyError', is_correct: false },
          { text: '0', is_correct: false },
          { text: 'None', is_correct: true },
          { text: 'False', is_correct: false }
        ]),
        explanation: 'dict.get(clave) retorna None si la clave no existe, en lugar de lanzar KeyError como haría d["clave"]. También puedes especificar un valor por defecto: d.get("clave", "valor_default"). Esto hace el código más seguro cuando no sabes si una clave existe. En APIs de IA, los datos entrantes pueden no tener todos los campos esperados.'
      },
      {
        question_text: '¿Qué hace este código?\nfrec = {}\nfor p in "hola mundo hola".split():\n    frec[p] = frec.get(p, 0) + 1',
        options: JSON.stringify([
          { text: 'Crea una lista con las palabras únicas', is_correct: false },
          { text: 'Cuenta cuántas veces aparece cada palabra: {"hola": 2, "mundo": 1}', is_correct: true },
          { text: 'Error: no se puede usar get() con 0 como default', is_correct: false },
          { text: 'Crea un diccionario con índices: {"hola": 0, "mundo": 1}', is_correct: false }
        ]),
        explanation: 'Patrón clásico de conteo: frec.get(p, 0) retorna el conteo actual o 0 si la palabra no existe aún. Luego suma 1. Para "hola": primera vez → get("hola",0)=0 → frec["hola"]=1. Segunda vez → get("hola",0)=1 → frec["hola"]=2. Resultado: {"hola": 2, "mundo": 1}. Este es el algoritmo básico de bag-of-words usado en NLP.'
      },
      {
        question_text: '¿Cuál es la forma correcta de crear una tupla con un solo elemento?',
        options: JSON.stringify([
          { text: 't = (42)', is_correct: false },
          { text: 't = (42,)', is_correct: true },
          { text: 't = tuple(42)', is_correct: false },
          { text: 't = [42]', is_correct: false }
        ]),
        explanation: '(42) es simplemente 42 entre paréntesis (como en matemáticas), no una tupla. Para crear una tupla de un elemento, la coma final es OBLIGATORIA: (42,). Python la interpreta como (42,) → tupla. Sin la coma, print(type((42))) muestra <class "int">. Alternativa: tuple([42]) crea tupla desde lista.'
      },
      {
        question_text: '¿Qué imprime este código?\n\nd = {"a": 1, "b": 2, "c": 3}\nd2 = {k: v*2 for k, v in d.items() if v > 1}\nprint(d2)',
        options: JSON.stringify([
          { text: '{"a": 2, "b": 4, "c": 6}', is_correct: false },
          { text: '{"b": 4, "c": 6}', is_correct: true },
          { text: '{"a": 1, "b": 2, "c": 3}', is_correct: false },
          { text: 'Error: no existe dict comprehension en Python', is_correct: false }
        ]),
        explanation: 'Dict comprehension: {k: v*2 for k, v in d.items() if v > 1}. Itera sobre pares (clave, valor). Condición: solo si v > 1. Transformación: multiplica el valor por 2. "a":1 → v=1, no pasa la condición. "b":2 → pasa, v*2=4. "c":3 → pasa, v*2=6. Resultado: {"b": 4, "c": 6}.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 11: Sistema de Configuración de Modelos IA',
    instructions_markdown: `## Ejercicio Práctico: Sistema de Configuración de Modelos IA

### Objetivo
Usar diccionarios y tuplas para construir un sistema de registro y comparación de modelos de Machine Learning.

### Código base

\`\`\`python
# ================================================
# REGISTRO DE MODELOS IA - ITSEIA
# ================================================
import json

# --- ESTRUCTURA DEL REGISTRO ---
# Cada modelo es un diccionario con:
# id, nombre, algoritmo, hiperparametros (dict), metricas (dict), estado

registro_modelos = []

# --- FUNCIÓN 1: Registrar modelo ---
def registrar_modelo(nombre, algoritmo, **hiperparametros):
    """Crea y registra un nuevo modelo en el registro."""
    modelo_id = f"model_{len(registro_modelos) + 1:03d}"
    modelo = {
        "id": modelo_id,
        "nombre": nombre,
        "algoritmo": algoritmo,
        "hiperparametros": hiperparametros,
        "metricas": {},
        "estado": "creado"
    }
    registro_modelos.append(modelo)
    print(f"Modelo registrado: {modelo_id} - {nombre}")
    return modelo_id

# --- FUNCIÓN 2: Actualizar métricas ---
def actualizar_metricas(modelo_id, **metricas):
    """Actualiza las métricas de evaluación de un modelo."""
    for modelo in registro_modelos:
        if modelo["id"] == modelo_id:
            modelo["metricas"].update(metricas)
            modelo["estado"] = "evaluado"
            return True
    print(f"Modelo {modelo_id} no encontrado")
    return False

# --- FUNCIÓN 3: Buscar mejor modelo ---
def mejor_modelo(metrica="accuracy"):
    """COMPLETA: retorna el modelo con mejor valor en la métrica dada."""
    evaluados = [m for m in registro_modelos if metrica in m["metricas"]]
    if not evaluados:
        return None
    # COMPLETA: retorna el modelo con mayor valor en 'metrica'
    pass

# --- FUNCIÓN 4: Reporte comparativo ---
def reporte_comparativo():
    """COMPLETA: imprime tabla comparativa de todos los modelos evaluados."""
    evaluados = [m for m in registro_modelos if m["estado"] == "evaluado"]
    if not evaluados:
        print("No hay modelos evaluados")
        return

    print("\\n" + "=" * 70)
    print(f"{'ID':<12} {'NOMBRE':<20} {'ALGORITMO':<15} {'ACCURACY':>10} {'F1':>8}")
    print("=" * 70)

    for modelo in evaluados:
        acc = modelo["metricas"].get("accuracy", 0)
        f1 = modelo["metricas"].get("f1", 0)
        # COMPLETA: imprime la fila del modelo con el formato dado

# --- FUNCIÓN 5: Exportar a JSON ---
def exportar_json(nombre_archivo="registro_modelos.json"):
    """COMPLETA: exporta el registro a un archivo JSON."""
    pass  # Usa json.dumps() con indent=2

# ================================================
# PROGRAMA PRINCIPAL
# ================================================
if __name__ == "__main__":
    # Registrar 4 modelos con diferentes configuraciones
    id1 = registrar_modelo("Detector Spam v1", "RandomForest",
                           n_estimators=100, max_depth=10)
    id2 = registrar_modelo("Detector Spam v2", "GradientBoosting",
                           n_estimators=200, learning_rate=0.01)
    id3 = registrar_modelo("Clasificador Sentimiento", "SVM",
                           C=1.0, kernel="rbf")
    id4 = registrar_modelo("Predictor Fuga", "LogisticRegression",
                           max_iter=1000, C=0.5)

    # Actualizar métricas después de "entrenar"
    actualizar_metricas(id1, accuracy=0.923, f1=0.921, precision=0.930)
    actualizar_metricas(id2, accuracy=0.947, f1=0.945, precision=0.952)
    actualizar_metricas(id3, accuracy=0.891, f1=0.888, precision=0.895)
    actualizar_metricas(id4, accuracy=0.876, f1=0.870, precision=0.880)

    # Mostrar comparativa
    reporte_comparativo()

    # Mejor modelo
    mejor = mejor_modelo("accuracy")
    if mejor:
        print(f"\\nMejor modelo: {mejor['nombre']} (accuracy: {mejor['metricas']['accuracy']:.1%})")

    # Exportar
    exportar_json()
    print("\\nRegistro exportado exitosamente")
\`\`\`

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| mejor_modelo implementada correctamente | 25 pts |
| reporte_comparativo con formato de tabla | 25 pts |
| exportar_json funciona (crea archivo) | 25 pts |
| Programa principal ejecuta sin errores | 25 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'Diccionarios Python - Documentación oficial', url: 'https://docs.python.org/es/3/tutorial/datastructures.html#dictionaries', type: 'documentation', description: 'Tutorial oficial de diccionarios y tuplas' },
    { title: 'JSON en Python - módulo json', url: 'https://docs.python.org/es/3/library/json.html', type: 'documentation', description: 'Cómo trabajar con JSON en Python' },
    { title: 'Diccionarios Python - MitoCode', url: 'https://www.youtube.com/watch?v=XVaN2cFRPDA', type: 'video', description: 'Tutorial diccionarios en español' },
    { title: 'JSONFormatter - validar JSON online', url: 'https://jsonformatter.curiousconcept.com/', type: 'tool', description: 'Validar y formatear JSON en línea' },
    { title: 'Python dicts en DS/ML - Towards Data Science', url: 'https://towardsdatascience.com/python-dictionaries-in-data-science-', type: 'article', description: 'Uso avanzado de diccionarios en Data Science' }
  ],

  ai_lab_context: 'Sesión 11: el alumno aprendió tuplas (inmutables, desempaquetado), diccionarios (clave:valor, get(), items(), keys(), values(), update()), diccionarios anidados, dict comprehension, y JSON. Puede representar "objetos" del mundo real como estructuras de datos.',
  ai_lab_suggested_prompt: 'Estoy aprendiendo diccionarios en Python. Tengo datos de 5 modelos de ML en formato de listas y quiero convertirlos a diccionarios con claves descriptivas. ¿Puedes mostrarme cómo refactorizar código que usa listas a uno que usa diccionarios, y explicar cuándo cada uno es mejor?'
},

// ============================================================
// SESION 12: Cadenas de Texto (Strings)
// ============================================================
{
  number: 12,
  title: 'Cadenas de Texto (Strings)',
  video_url: 'https://www.youtube.com/watch?v=9nfxVBZ6pN4',
  estimated_duration_minutes: 55,
  theory_markdown: `# Sesión 12: Cadenas de Texto (Strings)

## ¿Por qué importan los strings en IA?

El 80% de los datos del mundo son texto: emails, redes sociales, documentos médicos, contratos legales. El **Procesamiento de Lenguaje Natural (NLP)** — ChatGPT, clasificadores de sentimiento, traductores automáticos — comienza con manipulación de strings. Esta sesión es la puerta de entrada al NLP.

## Strings son secuencias inmutables

\`\`\`python
texto = "Hola, Python!"

# Acceso por índice (como listas)
print(texto[0])    # H
print(texto[-1])   # !
print(texto[0:4])  # Hola
print(texto[::-1]) # !nohtyP ,aloH

# Longitud
print(len(texto))  # 13

# Inmutables: no se pueden modificar directamente
# texto[0] = "h"  # TypeError: 'str' does not support item assignment
# Para "modificar": crea un nuevo string
texto_min = texto.lower()  # "hola, python!"
\`\`\`

## Métodos de transformación

\`\`\`python
texto = "  Hola Mundo Python  "

# Mayúsculas y minúsculas
print(texto.upper())      # "  HOLA MUNDO PYTHON  "
print(texto.lower())      # "  hola mundo python  "
print(texto.title())      # "  Hola Mundo Python  "
print(texto.capitalize()) # "  hola mundo python  " (solo primera letra)
print(texto.swapcase())   # "  hOLA mUNDO pYTHON  "

# Limpiar espacios
print(texto.strip())      # "Hola Mundo Python"  (ambos extremos)
print(texto.lstrip())     # "Hola Mundo Python  " (izquierda)
print(texto.rstrip())     # "  Hola Mundo Python"  (derecha)

# Reemplazar
print(texto.replace("Mundo", "ITSEIA"))  # "  Hola ITSEIA Python  "
\`\`\`

## Búsqueda en strings

\`\`\`python
email = "ana.garcia@itseia.ai"

# find(): retorna índice de primera ocurrencia (-1 si no existe)
print(email.find("@"))         # 9
print(email.find("gmail"))     # -1 (no existe)

# in: verificar si existe (más pythónico)
print("@" in email)            # True
print("gmail" in email)        # False

# startswith() y endswith()
print(email.startswith("ana")) # True
print(email.endswith(".ai"))   # True

# count(): cuántas veces aparece
print("banana".count("a"))     # 3

# Validar email básico
def es_email_valido(texto):
    return "@" in texto and "." in texto.split("@")[-1]

print(es_email_valido("ana@itseia.ai"))  # True
print(es_email_valido("no_es_email"))   # False
\`\`\`

## Dividir y unir strings

\`\`\`python
# split(): divide string en lista
csv_line = "Ana,García,22,Quito,IA"
campos = csv_line.split(",")
print(campos)  # ['Ana', 'García', '22', 'Quito', 'IA']

nombre, apellido, edad, ciudad, carrera = campos
print(f"{nombre} {apellido} - {carrera}")

# split por espacios (default)
frase = "Python es el mejor lenguaje"
palabras = frase.split()
print(f"{len(palabras)} palabras")

# join(): une lista en string
partes = ["2026", "03", "22"]
fecha = "-".join(partes)
print(fecha)  # 2026-03-22

# Unir palabras
print(" ".join(["Python", "IA", "ITSEIA"]))  # Python IA ITSEIA
print(", ".join(["Ana", "Carlos", "María"])) # Ana, Carlos, María
\`\`\`

## Formateo avanzado de strings

\`\`\`python
nombre = "Ana"
nota = 9.5
porcentaje = 0.95

# f-strings (recomendado Python 3.6+)
print(f"Estudiante: {nombre}, Nota: {nota:.1f}")
print(f"Accuracy: {porcentaje:.1%}")     # 95.0%
print(f"Precio: \${1234.5:,.2f}")         # $1,234.50
print(f"{'Izquierda':<20}|{'Derecha':>20}")

# format() (compatible con Python 2)
print("Hola, {}! Tu nota es {:.1f}".format(nombre, nota))

# Expresiones dentro de f-strings
print(f"{'Aprobado' if nota >= 7 else 'Reprobado'}")
print(f"Promedio: {sum([8, 9, 7]) / 3:.2f}")
\`\`\`

## Strings multilínea y caracteres especiales

\`\`\`python
# Triple comillas: para texto largo o con comillas internas
reporte = """
=== REPORTE MENSUAL ITSEIA ===
Fecha: 2026-03-22
Estado: Activo
Nota: El "Campus Virtual" está en producción.
"""
print(reporte)

# Caracteres de escape
print("Línea 1\\nLínea 2")           # Salto de línea
print("Columna1\\tColumna2")         # Tab
print("Dice: \\"Hola\\"")              # Comillas dentro de string
print("Ruta: C:\\\\Users\\\\Hector")    # Barra invertida

# Raw strings (ignora escapes): útil para regex y rutas Windows
import re
patron = r"\\d{3}-\\d{4}"  # Sin r, necesitarías \\\\d{3}-\\\\d{4}
print(bool(re.match(patron, "123-4567")))  # True
\`\`\`

## Preprocesamiento de texto para NLP

\`\`\`python
# Pasos estándar de NLP que usarás en semestres 3-5
def preprocesar_texto(texto):
    """Limpieza básica de texto para modelos NLP."""

    # 1. Minúsculas
    texto = texto.lower()

    # 2. Eliminar caracteres especiales (solo letras y espacios)
    import re
    texto = re.sub(r'[^a-záéíóúñü\\s]', '', texto)

    # 3. Eliminar espacios múltiples
    texto = ' '.join(texto.split())

    # 4. Tokenizar (dividir en palabras)
    palabras = texto.split()

    # 5. Eliminar stopwords comunes
    stopwords = {"el", "la", "de", "en", "y", "a", "que", "es", "un", "una"}
    palabras_filtradas = [p for p in palabras if p not in stopwords]

    return palabras_filtradas

# Prueba
email_spam = "¡¡Oferta INCREÍBLE!! Gana dinero FÁCIL en casa. Haz clic AQUÍ."
tokens = preprocesar_texto(email_spam)
print(tokens)
# ['oferta', 'increíble', 'gana', 'dinero', 'fácil', 'casa', 'haz', 'clic', 'aquí']

# Bag of words simple
def bag_of_words(lista_tokens):
    return {token: lista_tokens.count(token) for token in set(lista_tokens)}

bow = bag_of_words(tokens)
print(bow)
\`\`\``,

  quiz: {
    title: 'Quiz S12 - Strings',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Qué retorna "Python ITSEIA 2026".split()?',
        options: JSON.stringify([
          { text: '"Python", "ITSEIA", "2026" (tres strings separados)', is_correct: false },
          { text: '["Python", "ITSEIA", "2026"] (lista de strings)', is_correct: true },
          { text: '("Python", "ITSEIA", "2026") (tupla)', is_correct: false },
          { text: 'Error: split() necesita un delimitador', is_correct: false }
        ]),
        explanation: 'str.split() sin argumentos divide por cualquier espacio en blanco (espacios, tabs, saltos de línea) y retorna una lista de strings. "Python ITSEIA 2026".split() → ["Python", "ITSEIA", "2026"]. Con delimitador: "a,b,c".split(",") → ["a","b","c"]. split() es fundamental en ETL y preprocesamiento de datos.'
      },
      {
        question_text: '¿Cuál es la diferencia entre find() e in?',
        options: JSON.stringify([
          { text: 'find() es más rápido; in es solo para listas', is_correct: false },
          { text: 'find() retorna el índice de la primera ocurrencia (o -1); in retorna True/False', is_correct: true },
          { text: 'in solo funciona con un carácter; find() con cualquier substring', is_correct: false },
          { text: 'Son exactamente equivalentes', is_correct: false }
        ]),
        explanation: '"hola".find("ol") → 1 (índice). "ol" in "hola" → True. Usa find() cuando necesitas la POSICIÓN del substring. Usa in cuando solo necesitas saber si EXISTE (más legible). También existe index() que lanza ValueError en lugar de -1. Para búsquedas complejas, usa el módulo re (expresiones regulares).'
      },
      {
        question_text: '¿Qué hace "-".join(["2026", "03", "22"])?',
        options: JSON.stringify([
          { text: 'Divide "2026-03-22" en una lista', is_correct: false },
          { text: 'Une los elementos de la lista con "-" como separador: "2026-03-22"', is_correct: true },
          { text: 'Error: join() no acepta listas con números', is_correct: false },
          { text: 'Crea una tupla ("2026", "03", "22")', is_correct: false }
        ]),
        explanation: '"separador".join(lista) une los elementos de la lista usando el separador. "-".join(["2026", "03", "22"]) → "2026-03-22". Todos los elementos deben ser strings. Es la operación inversa de split(): texto.split("-") devuelve la lista original. Muy usado para construir CSVs, paths, y formatos de fecha.'
      },
      {
        question_text: '¿Qué imprime: print(f"precio: \${1500.0:,.2f}")?',
        options: JSON.stringify([
          { text: 'precio: $1500.0', is_correct: false },
          { text: 'precio: $1,500.00', is_correct: true },
          { text: 'precio: $1.500,00', is_correct: false },
          { text: 'Error: formato inválido', is_correct: false }
        ]),
        explanation: 'El formato :,.2f tiene dos partes: "," agrega separador de miles (punto en español pero coma en Python), ".2f" muestra 2 decimales con formato float. Resultado: $1,500.00. Este formato es estándar en sistemas financieros. En Ecuador/España se mostraría $1.500,00 pero en código Python el formato interno usa coma para miles y punto para decimales.'
      },
      {
        question_text: 'En el preprocesamiento NLP, ¿para qué sirve convertir el texto a minúsculas (.lower())?',
        options: JSON.stringify([
          { text: 'Para reducir el tamaño del archivo de texto', is_correct: false },
          { text: 'Para que el modelo no trate "Python", "PYTHON" y "python" como palabras diferentes', is_correct: true },
          { text: 'Porque los modelos de ML no pueden procesar mayúsculas', is_correct: false },
          { text: 'Para cumplir con estándares de formato de texto', is_correct: false }
        ]),
        explanation: 'En NLP, "Python", "PYTHON" y "python" son la misma palabra. Sin normalización a minúsculas, el vocabulario del modelo sería 3 veces más grande innecesariamente y el modelo aprendería que son palabras diferentes. .lower() es siempre el primer paso de preprocesamiento de texto. Normalizar el vocabulario es crucial para modelos más eficientes y precisos.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 12: Preprocesador de Texto para NLP',
    instructions_markdown: `## Ejercicio Práctico: Preprocesador de Texto para Clasificador de Spam

### Objetivo
Construir un pipeline de preprocesamiento de texto que sería la primera etapa de un modelo de clasificación de spam, aplicando técnicas reales de NLP.

### Código base

\`\`\`python
# ================================================
# PREPROCESADOR NLP - ITSEIA
# Preparación de textos para clasificador de spam
# ================================================

# Dataset de emails (etiquetados: spam=1, no_spam=0)
emails = [
    (1, "¡GANA $5000 GRATIS! Haz clic AQUÍ ahora. Oferta por tiempo LIMITED."),
    (0, "Hola Ana, te adjunto el reporte de la reunión de ayer."),
    (1, "¡¡URGENTE!! Tu cuenta será BLOQUEADA. Verifica datos AHORA."),
    (0, "¿Confirmamos la reunión del sábado a las 11am?"),
    (1, "Félicidades!! Ha ganado un iPhone 15. Reclamelo GRATIS aquí."),
    (0, "Buenos días, les envío el presupuesto para el proyecto de IA."),
    (1, "INVERSIÓN SEGURA 300% de retorno. Dinero FÁCIL. Sin riesgo."),
    (0, "Recuerda tu cita médica mañana a las 9:00am."),
]

stopwords_es = {
    "el", "la", "los", "las", "de", "del", "en", "y", "a", "que",
    "es", "un", "una", "su", "se", "con", "por", "para", "al"
}

# --- FUNCIÓN 1: Normalizar texto ---
def normalizar(texto):
    """
    Normaliza un texto:
    1. Convierte a minúsculas
    2. Elimina caracteres especiales (deja solo letras, números y espacios)
    3. Elimina espacios múltiples
    Retorna: string normalizado
    """
    import re
    # COMPLETA los 3 pasos
    pass

# --- FUNCIÓN 2: Tokenizar ---
def tokenizar(texto, eliminar_stopwords=True):
    """
    Divide el texto en tokens (palabras).
    Args:
        texto: string ya normalizado
        eliminar_stopwords: si True, elimina palabras vacías
    Retorna: lista de tokens
    """
    # COMPLETA
    pass

# --- FUNCIÓN 3: Extraer características ---
def extraer_features(texto_original):
    """
    Extrae características numéricas de un texto.
    Retorna diccionario con:
    - num_palabras: total de palabras
    - num_mayusculas: palabras completamente en mayúscula
    - num_signos_exclamacion: cantidad de '!'
    - tiene_urgencia: True si contiene palabras urgentes
    - longitud: número de caracteres
    """
    palabras_urgencia = {"urgente", "gratis", "gana", "premio", "bloqueada",
                        "limitado", "ahora", "inmediato", "felicidades"}
    # COMPLETA la extracción de cada feature
    palabras = texto_original.split()
    features = {
        "num_palabras": len(palabras),
        "num_mayusculas": 0,  # COMPLETA
        "num_exclamacion": texto_original.count("!"),
        "tiene_urgencia": False,  # COMPLETA: True si alguna palabra está en palabras_urgencia
        "longitud": len(texto_original)
    }
    return features

# --- FUNCIÓN 4: Calcular puntuación de spam ---
def puntuar_spam(features):
    """
    Regla heurística para estimar probabilidad de spam.
    Retorna float entre 0 y 1.
    """
    puntos = 0
    if features["num_mayusculas"] >= 2:
        puntos += 0.3
    if features["num_exclamacion"] >= 2:
        puntos += 0.3
    if features["tiene_urgencia"]:
        puntos += 0.4
    # COMPLETA: si puntos > 1, limita a 1.0
    return min(puntos, 1.0)

# --- FUNCIÓN 5: Procesar dataset completo ---
def procesar_dataset(emails):
    """Procesa todos los emails y genera reporte."""
    print("=" * 70)
    print(f"{'SPAM':>5} {'SCORE':>7} {'PREDICCIÓN':>12} {'CORRECTO':>9}  EXTRACTO")
    print("=" * 70)

    correctos = 0
    for etiqueta_real, email in emails:
        texto_norm = normalizar(email)
        tokens = tokenizar(texto_norm)
        features = extraer_features(email)
        score = puntuar_spam(features)
        prediccion = 1 if score >= 0.5 else 0
        es_correcto = prediccion == etiqueta_real
        if es_correcto:
            correctos += 1

        extracto = email[:35] + "..." if len(email) > 35 else email
        marca = "OK" if es_correcto else "X"
        print(f"{etiqueta_real:>5} {score:>7.2f} {prediccion:>12} {marca:>9}  {extracto}")

    accuracy = correctos / len(emails)
    print("=" * 70)
    print(f"Accuracy del clasificador heurístico: {accuracy:.1%}")
    print(f"Tokens del primer email: {tokenizar(normalizar(emails[0][1]))[:8]}")

# Ejecutar
procesar_dataset(emails)
\`\`\`

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| normalizar() correcta (lower, re, strip) | 20 pts |
| tokenizar() con stopwords opcional | 20 pts |
| extraer_features() todos los campos | 25 pts |
| puntuar_spam() lógica correcta | 15 pts |
| Accuracy del clasificador >= 75% | 20 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'Python String Methods - Documentación oficial', url: 'https://docs.python.org/es/3/library/stdtypes.html#string-methods', type: 'documentation', description: 'Lista completa de métodos de strings' },
    { title: 'Expresiones regulares en Python - re', url: 'https://docs.python.org/es/3/library/re.html', type: 'documentation', description: 'Módulo re para búsquedas avanzadas en texto' },
    { title: 'NLP con Python - Canal IA', url: 'https://www.youtube.com/watch?v=9nfxVBZ6pN4', type: 'video', description: 'Introducción a NLP en Python en español' },
    { title: 'Regex101 - Constructor visual de regex', url: 'https://regex101.com/', type: 'tool', description: 'Herramienta visual para aprender expresiones regulares' },
    { title: 'Natural Language Toolkit (NLTK)', url: 'https://www.nltk.org/', type: 'documentation', description: 'Librería NLP de Python para procesamiento de texto avanzado' }
  ],

  ai_lab_context: 'Sesión 12: el alumno aprendió métodos de strings (upper/lower/strip/split/join/replace/find), f-strings avanzados, caracteres de escape, strings multilínea, y preprocesamiento básico para NLP (tokenización, normalización, stopwords, bag of words).',
  ai_lab_suggested_prompt: 'Estoy aprendiendo a procesar texto en Python. Tengo 100 tweets en español sobre ITSEIA y quiero analizarlos: ¿Puedes guiarme para: 1) limpiar el texto, 2) contar las palabras más frecuentes, y 3) detectar si son positivos o negativos usando palabras clave? Solo con Python básico, sin librerías ML.'
}

];

async function loadSession(s) {
  const sessionData = await api('POST', '/sessions', {
    subject_id: SUBJECT_ID,
    number: s.number,
    title: s.title,
    description: s.title,
    video_url: s.video_url || null,
    theory_markdown: s.theory_markdown || null,
    ai_lab_context: s.ai_lab_context || null,
    ai_lab_suggested_prompt: s.ai_lab_suggested_prompt || null,
    order_index: s.number,
    estimated_duration_minutes: s.estimated_duration_minutes || 45,
    is_active: true
  });

  const sessionId = sessionData.id;
  let info = `  S\${s.number} "\${s.title.substring(0, 35)}"`;

  if (s.quiz && s.quiz.questions) {
    const quizData = await api('POST', '/quizzes', {
      session_id: sessionId,
      title: s.quiz.title,
      pass_percentage: s.quiz.pass_percentage || 70,
      max_attempts: 3,
      is_active: true
    });
    const quizId = quizData.id;
    for (let i = 0; i < s.quiz.questions.length; i++) {
      const q = s.quiz.questions[i];
      await api('POST', '/quiz_questions', {
        quiz_id: quizId,
        question_text: q.question_text,
        question_type: 'multiple_choice',
        options: q.options,
        explanation: q.explanation || null,
        points: 1,
        order_index: i + 1
      }, true);
    }
    info += ` | Quiz \${s.quiz.questions.length}q`;
  }

  if (s.assignment) {
    await api('POST', '/assignments', {
      session_id: sessionId,
      title: s.assignment.title,
      instructions_markdown: s.assignment.instructions_markdown,
      allowed_file_types: s.assignment.allowed_file_types || ['pdf', 'py'],
      max_grade: 100,
      is_active: true
    }, true);
    info += ` | Ejercicio OK`;
  }

  if (s.resources && s.resources.length > 0) {
    for (let i = 0; i < s.resources.length; i++) {
      const r = s.resources[i];
      await api('POST', '/session_resources', {
        session_id: sessionId,
        title: r.title,
        url: r.url,
        type: r.type || 'link',
        description: r.description || null,
        order_index: i + 1
      }, true);
    }
    info += ` | \${s.resources.length} recursos`;
  }

  console.log(info);
}

async function main() {
  console.log('=== CARGANDO FUNDAMENTOS S9-S12 ===');
  for (const session of SESSIONS) {
    try {
      await loadSession(session);
    } catch (e) {
      console.error(`  ERROR en S${session.number}: \${e.message}`);
    }
  }
  console.log('\n=== COMPLETADO: 4 sesiones cargadas (S9-S12) ===');
  console.log('Ejecuta load_pilot_fundamentos_s13_16.js para continuar');
}

main().catch(e => console.error('Error fatal:', e));
