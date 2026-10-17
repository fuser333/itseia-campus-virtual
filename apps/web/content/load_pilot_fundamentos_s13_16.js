#!/usr/bin/env node
// load_pilot_fundamentos_s13_16.js
// Sesiones 13-16 de Fundamentos de Programacion

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
// SESION 13: Manejo de Archivos
// ============================================================
{
  number: 13,
  title: 'Manejo de Archivos',
  video_url: 'https://www.youtube.com/watch?v=aequTxAvQq4',
  estimated_duration_minutes: 55,
  theory_markdown: `# Sesión 13: Manejo de Archivos

## ¿Por qué leer y escribir archivos?

Todo dataset en Data Science comienza como un archivo: CSV, JSON, TXT, Excel. Antes de pandas y numpy, Python puro es el fundamento. Saber trabajar con archivos te permite: cargar datos de entrenamiento, guardar modelos, registrar logs de experimentos, exportar predicciones.

## Abrir y cerrar archivos: open()

\`\`\`python
# Modos de apertura
# 'r'  → leer (default). Error si el archivo no existe
# 'w'  → escribir. CREA el archivo (o SOBRESCRIBE si existe)
# 'a'  → append. Agrega al final (no borra contenido)
# 'r+' → leer Y escribir
# 'rb' → leer en modo binario (imágenes, PDFs)

# Forma manual (debes cerrar explícitamente)
archivo = open("datos.txt", "w")
archivo.write("Hola\\n")
archivo.close()  # IMPORTANTE: siempre cerrar

# Forma recomendada: with statement (cierre automático)
with open("datos.txt", "w") as f:
    f.write("ITSEIA - Registro de Experimentos\\n")
    f.write("Fecha: 2026-03-22\\n")
# El archivo se cierra automáticamente al salir del bloque with
\`\`\`

## Escribir archivos

\`\`\`python
# Escribir líneas
resultados = [
    "Experimento 1: accuracy=0.923",
    "Experimento 2: accuracy=0.947",
    "Experimento 3: accuracy=0.891"
]

with open("resultados.txt", "w", encoding="utf-8") as f:
    f.write("=== RESULTADOS DE MODELOS IA ===\\n")
    f.write(f"Fecha: 2026-03-22\\n\\n")

    for i, resultado in enumerate(resultados, 1):
        f.write(f"  {resultado}\\n")

    f.write(f"\\nTotal experimentos: {len(resultados)}")

print("Archivo creado: resultados.txt")
\`\`\`

## Leer archivos

\`\`\`python
# Leer todo el contenido a la vez
with open("resultados.txt", "r", encoding="utf-8") as f:
    contenido = f.read()
print(contenido)

# Leer línea por línea (eficiente para archivos grandes)
with open("resultados.txt", "r", encoding="utf-8") as f:
    for numero_linea, linea in enumerate(f, 1):
        linea_limpia = linea.strip()  # Eliminar \\n al final
        if linea_limpia:  # Saltar líneas vacías
            print(f"L{numero_linea}: {linea_limpia}")

# Leer todas las líneas como lista
with open("resultados.txt", "r", encoding="utf-8") as f:
    lineas = f.readlines()
print(f"Total líneas: {len(lineas)}")
\`\`\`

## Trabajar con CSV

El formato más común en Data Science:

\`\`\`python
import csv

# Escribir CSV
estudiantes = [
    ["nombre", "edad", "carrera", "nota"],
    ["Ana García", 22, "IA", 9.0],
    ["Carlos López", 25, "Datos", 7.5],
    ["María Torres", 21, "BigData", 8.5],
    ["Pedro Ruiz", 23, "IA", 6.0]
]

with open("estudiantes.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerows(estudiantes)

print("CSV creado: estudiantes.csv")

# Leer CSV
with open("estudiantes.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)  # DictReader convierte cada fila en diccionario
    for fila in reader:
        nombre = fila["nombre"]
        nota = float(fila["nota"])
        estado = "APROBADO" if nota >= 7 else "REPROBADO"
        print(f"{nombre}: {nota} - {estado}")
\`\`\`

## Trabajar con JSON

\`\`\`python
import json

# Guardar configuración de modelo como JSON
config_modelo = {
    "nombre": "clasificador_spam_v2",
    "version": "2.1.0",
    "algoritmo": "RandomForest",
    "hiperparametros": {
        "n_estimators": 200,
        "max_depth": 15,
        "random_state": 42
    },
    "metricas": {
        "accuracy": 0.947,
        "f1": 0.945
    }
}

# Escribir JSON
with open("modelo_config.json", "w", encoding="utf-8") as f:
    json.dump(config_modelo, f, indent=2, ensure_ascii=False)

print("Config guardada: modelo_config.json")

# Leer JSON
with open("modelo_config.json", "r", encoding="utf-8") as f:
    config_cargada = json.load(f)

print(f"Modelo: {config_cargada['nombre']} v{config_cargada['version']}")
print(f"Accuracy: {config_cargada['metricas']['accuracy']:.1%}")
\`\`\`

## Verificar si archivo existe

\`\`\`python
import os

# Verificar existencia antes de leer
ruta = "resultados.txt"
if os.path.exists(ruta):
    with open(ruta, "r") as f:
        print(f.read())
else:
    print(f"El archivo '{ruta}' no existe")

# Tamaño del archivo
if os.path.exists(ruta):
    tamano = os.path.getsize(ruta)
    print(f"Tamaño: {tamano} bytes")

# Listar archivos en directorio
archivos = os.listdir(".")
archivos_py = [a for a in archivos if a.endswith(".py")]
print(f"Archivos Python: {archivos_py}")
\`\`\`

## Logger de experimentos (caso de uso real)

\`\`\`python
import json
from datetime import datetime

def registrar_experimento(nombre, config, metricas, archivo_log="experimentos.json"):
    """Registra los resultados de un experimento en un archivo JSON."""

    # Cargar experimentos existentes (o crear lista vacía)
    if os.path.exists(archivo_log):
        with open(archivo_log, "r", encoding="utf-8") as f:
            experimentos = json.load(f)
    else:
        experimentos = []

    # Agregar nuevo experimento
    experimento = {
        "id": len(experimentos) + 1,
        "nombre": nombre,
        "timestamp": datetime.now().isoformat(),
        "config": config,
        "metricas": metricas
    }
    experimentos.append(experimento)

    # Guardar actualizado
    with open(archivo_log, "w", encoding="utf-8") as f:
        json.dump(experimentos, f, indent=2, ensure_ascii=False)

    print(f"Experimento #{experimento['id']} registrado")
    return experimento["id"]

# Uso
registrar_experimento(
    nombre="RF con 100 árboles",
    config={"n_estimators": 100, "max_depth": 10},
    metricas={"accuracy": 0.923, "f1": 0.921}
)
\`\`\``,

  quiz: {
    title: 'Quiz S13 - Manejo de Archivos',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Cuál es la ventaja de usar "with open()" en lugar de open() manual?',
        options: JSON.stringify([
          { text: 'Es más rápido para leer archivos grandes', is_correct: false },
          { text: 'Cierra el archivo automáticamente al salir del bloque, incluso si hay errores', is_correct: true },
          { text: 'Permite abrir múltiples archivos simultáneamente', is_correct: false },
          { text: 'Solo funciona con archivos de texto, no binarios', is_correct: false }
        ]),
        explanation: '"with" es un context manager. Garantiza que el archivo se cierre al salir del bloque with, incluso si ocurre una excepción. Con open() manual, si hay un error antes del close(), el archivo queda abierto (memory leak, datos corruptos). "with open()" es el estándar en Python profesional.'
      },
      {
        question_text: '¿Qué diferencia hay entre los modos "w" y "a" al abrir un archivo?',
        options: JSON.stringify([
          { text: '"w" crea el archivo; "a" solo abre archivos existentes', is_correct: false },
          { text: '"w" sobrescribe todo el contenido; "a" agrega al final sin borrar lo existente', is_correct: true },
          { text: '"w" es para texto; "a" es para archivos binarios', is_correct: false },
          { text: 'Son iguales, solo cambia el cursor de inicio', is_correct: false }
        ]),
        explanation: '"w" (write): crea el archivo si no existe, o lo VACÍA completamente si ya existe. Peligroso si ya tenías datos. "a" (append): crea el archivo si no existe, o agrega al FINAL si ya existe. Para logs y registros históricos, siempre usa "a". Para reescribir con datos nuevos, usa "w".'
      },
      {
        question_text: '¿Qué hace csv.DictReader() diferente a csv.reader()?',
        options: JSON.stringify([
          { text: 'DictReader es más lento pero ocupa menos memoria', is_correct: false },
          { text: 'DictReader convierte cada fila en un diccionario usando la primera fila como claves', is_correct: true },
          { text: 'reader solo lee archivos separados por comas; DictReader acepta otros delimitadores', is_correct: false },
          { text: 'No hay diferencia, son aliases del mismo objeto', is_correct: false }
        ]),
        explanation: 'csv.reader() retorna cada fila como lista: ["Ana", "22", "IA"]. csv.DictReader() retorna cada fila como diccionario: {"nombre": "Ana", "edad": "22", "carrera": "IA"} usando los nombres de la primera fila como claves. DictReader es más legible y menos propenso a errores de índice.'
      },
      {
        question_text: '¿Por qué es importante especificar encoding="utf-8" al abrir archivos con texto en español?',
        options: JSON.stringify([
          { text: 'No es importante, Python maneja automáticamente cualquier codificación', is_correct: false },
          { text: 'Para que los caracteres especiales (á, é, ñ, ü) se lean y escriban correctamente', is_correct: true },
          { text: 'Solo para archivos creados en Linux, no en Windows', is_correct: false },
          { text: 'utf-8 hace los archivos más pequeños', is_correct: false }
        ]),
        explanation: 'UTF-8 es el estándar moderno que codifica todos los caracteres del mundo (incluyendo á, é, í, ó, ú, ñ, ü). Sin especificar encoding, Python usa el encoding del sistema (que en Windows puede ser cp1252 o latin-1). Sin UTF-8, las tildes y ñ se convierten en caracteres ilegibles. Siempre especifica encoding="utf-8" en código Python.'
      },
      {
        question_text: '¿Qué módulo de Python permite verificar si un archivo existe antes de abrirlo?',
        options: JSON.stringify([
          { text: 'sys', is_correct: false },
          { text: 'os', is_correct: true },
          { text: 'io', is_correct: false },
          { text: 'pathlib (válido) o os (ambos correctos)', is_correct: false }
        ]),
        explanation: 'os.path.exists("archivo.txt") retorna True si el archivo existe, False si no. También puedes usar pathlib: from pathlib import Path; Path("archivo.txt").exists(). pathlib es más moderno y orientado a objetos. os es más tradicional pero igualmente válido. Ambos están en la biblioteca estándar de Python, sin instalación adicional.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 13: Sistema de Logs de Experimentos IA',
    instructions_markdown: `## Ejercicio Práctico: Sistema de Logs para Experimentos de Machine Learning

### Objetivo
Crear un sistema completo de registro de experimentos que guarda y lee datos en CSV y JSON, simulando el workflow real de un Data Scientist.

### Código base

\`\`\`python
# ================================================
# SISTEMA DE LOGS - ITSEIA ML Lab
# ================================================
import csv
import json
import os
from datetime import datetime

# --- FUNCIÓN 1: Crear dataset de entrenamiento ---
def crear_dataset(nombre_archivo="dataset_entrenamiento.csv"):
    """
    Crea un CSV de entrenamiento simulado.
    Columnas: id, edad, ingresos, deuda, historial_credito, aprobado
    """
    datos = [
        [1, 35, 2500, 800, "bueno", 1],
        [2, 28, 1200, 300, "regular", 0],
        [3, 45, 4000, 1200, "excelente", 1],
        [4, 22, 800, 0, "sin_historial", 0],
        [5, 52, 5500, 800, "bueno", 1],
        [6, 31, 1800, 600, "malo", 0],
        [7, 41, 3200, 900, "bueno", 1],
        [8, 27, 1100, 200, "regular", 0],
        [9, 48, 6000, 1500, "excelente", 1],
        [10, 33, 2200, 700, "bueno", 1],
    ]
    encabezados = ["id", "edad", "ingresos", "deuda", "historial_credito", "aprobado"]

    # COMPLETA: escribe el CSV con encabezados y datos
    # Usa csv.writer con newline="" y encoding="utf-8"
    pass

# --- FUNCIÓN 2: Leer y analizar dataset ---
def analizar_dataset(nombre_archivo="dataset_entrenamiento.csv"):
    """
    Lee el CSV y retorna estadísticas básicas.
    Returns: dict con total, aprobados, rechazados, ingreso_promedio
    """
    # COMPLETA: lee con csv.DictReader y calcula estadísticas
    pass

# --- FUNCIÓN 3: Simular entrenamiento y registrar ---
def registrar_experimento(config, metricas, archivo_log="experimentos_ia.json"):
    """
    Agrega un experimento al log JSON.
    config: dict con hiperparámetros
    metricas: dict con accuracy, precision, recall
    """
    # Cargar log existente o inicializar
    if os.path.exists(archivo_log):
        with open(archivo_log, "r", encoding="utf-8") as f:
            log = json.load(f)
    else:
        log = {"experimentos": [], "mejor_accuracy": 0, "total_experimentos": 0}

    # COMPLETA: crea el nuevo experimento con id, timestamp, config, metricas
    # Actualiza mejor_accuracy si el nuevo supera al actual
    # Guarda el log actualizado

    pass

# --- FUNCIÓN 4: Generar reporte final ---
def generar_reporte_final(archivo_log="experimentos_ia.json", archivo_csv="dataset_entrenamiento.csv"):
    """Genera un reporte TXT consolidado."""
    stats = analizar_dataset(archivo_csv)

    with open("reporte_final.txt", "w", encoding="utf-8") as f:
        f.write("=" * 55 + "\\n")
        f.write("REPORTE FINAL - ITSEIA ML Lab\\n")
        f.write(f"Generado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\\n")
        f.write("=" * 55 + "\\n\\n")

        if stats:
            f.write("DATASET:\\n")
            for k, v in stats.items():
                f.write(f"  {k}: {v}\\n")

        # COMPLETA: escribe también el resumen de experimentos desde el JSON
        # Incluye: total_experimentos, mejor_accuracy, tabla de todos los experimentos

    print("Reporte generado: reporte_final.txt")

# ================================================
# PROGRAMA PRINCIPAL
# ================================================
if __name__ == "__main__":
    print("1. Creando dataset...")
    crear_dataset()

    print("2. Analizando dataset...")
    stats = analizar_dataset()
    if stats:
        print(f"   Total registros: {stats['total']}")
        print(f"   Tasa aprobación: {stats['aprobados']/stats['total']:.1%}")

    print("3. Registrando experimentos...")
    registrar_experimento(
        config={"algoritmo": "RandomForest", "n_estimators": 100, "max_depth": 10},
        metricas={"accuracy": 0.80, "precision": 0.82, "recall": 0.78}
    )
    registrar_experimento(
        config={"algoritmo": "GradientBoosting", "n_estimators": 200, "lr": 0.01},
        metricas={"accuracy": 0.90, "precision": 0.91, "recall": 0.89}
    )
    registrar_experimento(
        config={"algoritmo": "LogisticRegression", "C": 1.0, "max_iter": 1000},
        metricas={"accuracy": 0.75, "precision": 0.76, "recall": 0.74}
    )

    print("4. Generando reporte final...")
    generar_reporte_final()

    print("\\nArchivos creados:")
    for archivo in ["dataset_entrenamiento.csv", "experimentos_ia.json", "reporte_final.txt"]:
        if os.path.exists(archivo):
            size = os.path.getsize(archivo)
            print(f"  {archivo}: {size} bytes")
\`\`\`

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| crear_dataset() genera CSV válido | 25 pts |
| analizar_dataset() calcula estadísticas correctas | 25 pts |
| registrar_experimento() acumula en JSON | 30 pts |
| reporte_final.txt generado con contenido completo | 20 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'Manejo de archivos Python - Documentación oficial', url: 'https://docs.python.org/es/3/tutorial/inputoutput.html#reading-and-writing-files', type: 'documentation', description: 'Tutorial oficial de E/S de archivos' },
    { title: 'Módulo CSV Python', url: 'https://docs.python.org/es/3/library/csv.html', type: 'documentation', description: 'Documentación completa del módulo csv' },
    { title: 'Manejo de archivos - Programación ATS', url: 'https://www.youtube.com/watch?v=aequTxAvQq4', type: 'video', description: 'Tutorial archivos en Python en español' },
    { title: 'pathlib - Manejo moderno de rutas', url: 'https://docs.python.org/es/3/library/pathlib.html', type: 'documentation', description: 'pathlib: la forma moderna de trabajar con rutas' },
    { title: 'Pandas read_csv - El siguiente nivel', url: 'https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html', type: 'documentation', description: 'Cómo leer CSVs con pandas en proyectos reales' }
  ],

  ai_lab_context: 'Sesión 13: el alumno aprendió open() con modos r/w/a/rb, with statement, escribir y leer TXT, CSV con csv.writer/DictReader, JSON con json.dump/load, os.path.exists(), y patrón de logger de experimentos para ML.',
  ai_lab_suggested_prompt: 'Tengo un archivo CSV con datos de clientes y quiero: 1) leerlo, 2) filtrar solo los que tienen edad > 30, y 3) guardar el resultado en un nuevo CSV. ¿Puedes mostrarme el código Python sin pandas? Quiero entender las bases antes de usar librerías.'
},

// ============================================================
// SESION 14: Manejo de Errores
// ============================================================
{
  number: 14,
  title: 'Manejo de Errores (try/except)',
  video_url: 'https://www.youtube.com/watch?v=NIWwJbo-9_8',
  estimated_duration_minutes: 50,
  theory_markdown: `# Sesión 14: Manejo de Errores (try/except)

## ¿Por qué manejar errores?

Un programa que no maneja errores falla sin gracia. En producción, un modelo de IA que recibe un dato inesperado no puede simplemente "explotar" y cerrar la aplicación. Debe detectar el problema, registrarlo, y continuar o dar un mensaje claro al usuario.

El manejo de errores es la diferencia entre código de estudiante y código de producción.

## Anatomía de un error en Python

\`\`\`python
# Python tiene una jerarquía de excepciones
# BaseException
#   Exception
#     TypeError     → tipos incompatibles
#     ValueError    → valor inválido para el tipo
#     ZeroDivisionError → división por cero
#     IndexError    → índice fuera de rango
#     KeyError      → clave no existe en diccionario
#     FileNotFoundError → archivo no existe
#     AttributeError → objeto no tiene ese método/atributo
#     ImportError   → módulo no encontrado
#     NameError     → variable no definida
#     RuntimeError  → error en tiempo de ejecución
\`\`\`

## try / except básico

\`\`\`python
# Sin manejo de errores
numero = int(input("Ingresa un número: "))  # Falla si ingresa texto

# Con manejo de errores
try:
    numero = int(input("Ingresa un número: "))
    resultado = 100 / numero
    print(f"100 / {numero} = {resultado:.2f}")
except ValueError:
    print("Error: debes ingresar un número entero")
except ZeroDivisionError:
    print("Error: no se puede dividir por cero")
\`\`\`

## try / except / else / finally

\`\`\`python
def dividir_seguro(a, b):
    """División con manejo completo de errores."""
    try:
        resultado = a / b
    except ZeroDivisionError:
        print("No se puede dividir por cero")
        return None
    except TypeError:
        print(f"Tipos incorrectos: {type(a)} / {type(b)}")
        return None
    else:
        # Se ejecuta SOLO si no hubo excepción
        print(f"Éxito: {a} / {b} = {resultado}")
        return resultado
    finally:
        # Se ejecuta SIEMPRE (con o sin error)
        print("Operación de división finalizada")

dividir_seguro(10, 2)   # Éxito
dividir_seguro(10, 0)   # ZeroDivisionError
dividir_seguro("10", 2) # TypeError
\`\`\`

## Capturar múltiples excepciones

\`\`\`python
def leer_config(archivo):
    """Lee un archivo de configuración JSON de forma segura."""
    import json
    try:
        with open(archivo, "r", encoding="utf-8") as f:
            config = json.load(f)
        return config
    except FileNotFoundError:
        print(f"Archivo '{archivo}' no encontrado")
        return {}
    except json.JSONDecodeError as e:
        print(f"JSON inválido en '{archivo}': {e}")
        return {}
    except PermissionError:
        print(f"Sin permisos para leer '{archivo}'")
        return {}
    except Exception as e:
        # Captura cualquier otro error inesperado
        print(f"Error inesperado: {type(e).__name__}: {e}")
        return {}

config = leer_config("modelo_config.json")
\`\`\`

## Lanzar excepciones: raise

\`\`\`python
def calcular_imc(peso, altura):
    """Calcula IMC con validación."""
    if not isinstance(peso, (int, float)):
        raise TypeError(f"peso debe ser número, recibido: {type(peso)}")
    if peso <= 0:
        raise ValueError(f"peso debe ser positivo, recibido: {peso}")
    if altura <= 0:
        raise ValueError(f"altura debe ser positiva, recibida: {altura}")

    return peso / (altura ** 2)

# Uso con manejo
try:
    imc = calcular_imc(70, 1.75)
    print(f"IMC: {imc:.1f}")
except ValueError as e:
    print(f"Dato inválido: {e}")
except TypeError as e:
    print(f"Tipo incorrecto: {e}")
\`\`\`

## Excepciones personalizadas

\`\`\`python
# Crear tus propias excepciones (muy profesional)
class ErrorModeloIA(Exception):
    """Base para errores del módulo de IA."""
    pass

class ErrorDatosEntrada(ErrorModeloIA):
    """Error cuando los datos de entrada son inválidos."""
    def __init__(self, campo, valor, razon):
        self.campo = campo
        self.valor = valor
        self.razon = razon
        super().__init__(f"Campo '{campo}' inválido (valor={valor}): {razon}")

class ErrorModeloNoEntrenado(ErrorModeloIA):
    """Error cuando se intenta predecir sin entrenar."""
    pass

# Uso
def predecir(datos, modelo_entrenado=False):
    if not modelo_entrenado:
        raise ErrorModeloNoEntrenado("El modelo debe entrenarse antes de predecir")

    if datos is None or len(datos) == 0:
        raise ErrorDatosEntrada("datos", datos, "no puede ser None o vacío")

    return [0.8, 0.2]  # simulación

try:
    resultado = predecir(None, modelo_entrenado=True)
except ErrorDatosEntrada as e:
    print(f"Error datos: {e}")
    print(f"  Campo: {e.campo}, Valor: {e.valor}")
except ErrorModeloNoEntrenado as e:
    print(f"Error modelo: {e}")
\`\`\`

## Patrones de manejo de errores en IA

\`\`\`python
import logging

# Configurar logger (estándar en producción)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("ia_errors.log"),
        logging.StreamHandler()
    ]
)

def procesar_batch(lista_datos):
    """Procesa un lote de datos con manejo robusto de errores."""
    exitosos = []
    fallidos = []

    for i, dato in enumerate(lista_datos):
        try:
            if dato is None:
                raise ValueError("Dato nulo")
            if not isinstance(dato, (int, float)):
                raise TypeError(f"Se esperaba número, recibido {type(dato)}")
            resultado = dato ** 2  # Simulación de procesamiento
            exitosos.append(resultado)

        except (ValueError, TypeError) as e:
            fallidos.append({"indice": i, "dato": dato, "error": str(e)})
            logging.warning(f"Item {i} falló: {e}")

        except Exception as e:
            fallidos.append({"indice": i, "dato": dato, "error": f"Error inesperado: {e}"})
            logging.error(f"Error inesperado en item {i}: {e}")

    logging.info(f"Batch procesado: {len(exitosos)} exitosos, {len(fallidos)} fallidos")
    return exitosos, fallidos

# Prueba con datos mezclados (reales y con errores)
datos = [4, 9, None, "texto", 16, -1, 25, None]
exitos, errores = procesar_batch(datos)
print(f"Exitosos: {exitos}")
print(f"Fallidos: {len(errores)}")
\`\`\``,

  quiz: {
    title: 'Quiz S14 - Manejo de Errores',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Qué bloque en try/except/else/finally siempre se ejecuta, haya error o no?',
        options: JSON.stringify([
          { text: 'try', is_correct: false },
          { text: 'except', is_correct: false },
          { text: 'else', is_correct: false },
          { text: 'finally', is_correct: true }
        ]),
        explanation: '"finally" se ejecuta SIEMPRE, independientemente de si hubo excepción o no. Es ideal para liberar recursos: cerrar archivos, conexiones de base de datos, liberar memoria. "else" se ejecuta solo si NO hubo excepción. "except" solo si SÍ hubo excepción. "try" es el bloque que puede lanzar excepciones.'
      },
      {
        question_text: '¿Qué error lanza int("hola")?',
        options: JSON.stringify([
          { text: 'TypeError: "hola" no es del tipo int', is_correct: false },
          { text: 'ValueError: "hola" no puede convertirse a int', is_correct: true },
          { text: 'NameError: "hola" no está definido', is_correct: false },
          { text: 'SyntaxError: conversión inválida', is_correct: false }
        ]),
        explanation: 'ValueError ocurre cuando una función recibe un argumento del tipo correcto (es un str, y str se puede pasar a int()), pero con un valor inapropiado ("hola" no es un número). TypeError sería si pasaras un tipo completamente incorrecto: int([1,2,3]). La distinción ValueError/TypeError es importante para escribir except específicos.'
      },
      {
        question_text: '¿Por qué es mala práctica usar "except Exception" sin capturar excepciones específicas?',
        options: JSON.stringify([
          { text: 'Porque Exception es una clase abstracta que no puede instanciarse', is_correct: false },
          { text: 'Porque captura todos los errores incluyendo bugs reales que deberías corregir, ocultando problemas', is_correct: true },
          { text: 'Porque es más lento que capturar excepciones específicas', is_correct: false },
          { text: 'No es mala práctica, es lo más recomendado', is_correct: false }
        ]),
        explanation: '"except Exception" captura CUALQUIER error, incluyendo errores de programación (bugs) que deberían corregirse, no silenciarse. Si capturas solo excepciones esperadas (FileNotFoundError, ValueError), los bugs inesperados aparecen claramente. El patrón correcto: captura específico primero, luego "except Exception as e: logging.error(e); raise" para relanzar errores inesperados.'
      },
      {
        question_text: '¿Cuándo deberías usar "raise" en tu código?',
        options: JSON.stringify([
          { text: 'Solo para relanzar excepciones capturadas con except', is_correct: false },
          { text: 'Cuando quieres señalar que una condición inválida fue detectada en tu función', is_correct: true },
          { text: 'raise no se recomienda en Python moderno', is_correct: false },
          { text: 'Solo en el bloque finally', is_correct: false }
        ]),
        explanation: '"raise" se usa para lanzar una excepción intencionalmente cuando detectas una condición inválida. Es la forma de implementar "contratos" en tus funciones: "si los datos de entrada no cumplen X condición, fallo explícitamente con un mensaje claro". Es preferible a retornar None silenciosamente o ignorar el problema.'
      },
      {
        question_text: '¿Cuál es el propósito de crear excepciones personalizadas (clases que heredan de Exception)?',
        options: JSON.stringify([
          { text: 'Son más rápidas que las excepciones built-in de Python', is_correct: false },
          { text: 'Permiten identificar errores específicos de tu dominio con nombres descriptivos y datos extra', is_correct: true },
          { text: 'Son obligatorias en Python 3.10+', is_correct: false },
          { text: 'Solo sirven para mostrar mensajes de error más largos', is_correct: false }
        ]),
        explanation: 'Excepciones personalizadas permiten: 1) Nombres descriptivos del dominio (ErrorModeloNoEntrenado vs RuntimeError genérico). 2) Datos adicionales en el error (qué campo falló, qué valor tenía). 3) Jerarquía: capturar ErrorModeloIA captura todos los errores del módulo. 4) Documentación implícita: el nombre del error explica qué salió mal. Estándar en librerías profesionales.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 14: Pipeline Robusto con Manejo de Errores',
    instructions_markdown: `## Ejercicio Práctico: Pipeline de Datos Robusto

### Objetivo
Construir un pipeline de preprocesamiento de datos que maneje errores de forma profesional, registre problemas en un log, y continúe procesando a pesar de datos incorrectos.

### Código base

\`\`\`python
# ================================================
# PIPELINE ROBUSTO - ITSEIA
# ================================================
import json
import csv
import os

# Excepciones personalizadas
class ErrorPipeline(Exception):
    pass

class ErrorDatoInvalido(ErrorPipeline):
    def __init__(self, campo, valor, razon):
        self.campo = campo
        self.valor = valor
        super().__init__(f"Dato inválido - {campo}='{valor}': {razon}")

class ErrorArchivoEntrada(ErrorPipeline):
    pass

# --- FUNCIÓN 1: Validar registro ---
def validar_registro(registro):
    """
    Valida que un registro tenga todos los campos necesarios y valores válidos.
    Lanza ErrorDatoInvalido si algo falla.
    Campos esperados: id (int), temperatura (float 30-45), presion (int 60-200)
    """
    # COMPLETA: valida cada campo con raise ErrorDatoInvalido si es inválido
    pass

# --- FUNCIÓN 2: Transformar registro ---
def transformar_registro(registro):
    """
    Transforma un registro válido.
    Agrega: imc si hay peso/altura, clasifica temperatura, flag_critico
    """
    try:
        temperatura = float(registro["temperatura"])
        presion = int(registro["presion"])

        if temperatura >= 38.5:
            cat_temp = "fiebre_alta"
        elif temperatura >= 37.5:
            cat_temp = "fiebre_leve"
        else:
            cat_temp = "normal"

        # COMPLETA: agrega categoria_temperatura, flag_critico
        # flag_critico = True si temperatura >= 39 O presion >= 170
        registro["categoria_temperatura"] = cat_temp
        registro["flag_critico"] = False  # COMPLETA
        return registro

    except (ValueError, KeyError) as e:
        raise ErrorDatoInvalido("transformacion", str(registro), str(e))

# --- FUNCIÓN 3: Pipeline principal ---
def ejecutar_pipeline(datos_entrada, archivo_log="pipeline_errors.log"):
    """
    Procesa todos los registros con manejo robusto de errores.
    Returns: (registros_validos, registros_fallidos)
    """
    validos = []
    fallidos = []
    errores_log = []

    for i, registro in enumerate(datos_entrada):
        try:
            validar_registro(registro)
            registro_procesado = transformar_registro(registro)
            validos.append(registro_procesado)

        except ErrorDatoInvalido as e:
            error_info = {"indice": i, "tipo": "DatoInvalido", "mensaje": str(e)}
            fallidos.append(error_info)
            errores_log.append(error_info)

        except ErrorPipeline as e:
            error_info = {"indice": i, "tipo": "ErrorPipeline", "mensaje": str(e)}
            fallidos.append(error_info)
            errores_log.append(error_info)

        except Exception as e:
            error_info = {"indice": i, "tipo": "Inesperado", "mensaje": f"{type(e).__name__}: {e}"}
            fallidos.append(error_info)
            errores_log.append(error_info)

    # COMPLETA: guarda errores_log en archivo_log como JSON

    return validos, fallidos

# --- FUNCIÓN 4: Generar reporte ---
def reporte_pipeline(validos, fallidos):
    """COMPLETA: imprime un reporte claro del pipeline."""
    total = len(validos) + len(fallidos)
    print("\\n" + "=" * 45)
    print("REPORTE PIPELINE")
    print("=" * 45)
    # COMPLETA: total, exitosos (%), fallidos (%), críticos
    criticos = [r for r in validos if r.get("flag_critico")]
    pass

# ================================================
# PROGRAMA PRINCIPAL
# ================================================
datos_prueba = [
    {"id": 1, "temperatura": "36.5", "presion": "120"},
    {"id": 2, "temperatura": "38.8", "presion": "155"},
    {"id": 3, "temperatura": "50.0", "presion": "130"},   # Temp inválida
    {"id": 4, "temperatura": "hola", "presion": "140"},   # No es número
    {"id": 5, "temperatura": "39.5", "presion": "175"},   # Crítico
    {"id": 6, "presion": "120"},                           # Falta temperatura
    {"id": 7, "temperatura": "37.2", "presion": "115"},
    {"id": 8, "temperatura": "40.1", "presion": "180"},   # Crítico
]

validos, fallidos = ejecutar_pipeline(datos_prueba)
reporte_pipeline(validos, fallidos)
\`\`\`

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| validar_registro() con raise correcto | 25 pts |
| transformar_registro() con flag_critico | 20 pts |
| Pipeline captura todos los tipos de error | 30 pts |
| Log guardado en archivo JSON | 15 pts |
| reporte_pipeline() completo | 10 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'Excepciones Python - Documentación oficial', url: 'https://docs.python.org/es/3/tutorial/errors.html', type: 'documentation', description: 'Tutorial oficial de excepciones en Python' },
    { title: 'Jerarquía de excepciones Python', url: 'https://docs.python.org/es/3/library/exceptions.html', type: 'documentation', description: 'Árbol completo de excepciones built-in' },
    { title: 'Manejo de errores Python - MitoCode', url: 'https://www.youtube.com/watch?v=NIWwJbo-9_8', type: 'video', description: 'Tutorial try/except en español' },
    { title: 'Logging module Python', url: 'https://docs.python.org/es/3/library/logging.html', type: 'documentation', description: 'Módulo de logging para producción' },
    { title: 'Python Error Handling Best Practices', url: 'https://realpython.com/python-exceptions/', type: 'article', description: 'Guía completa de buenas prácticas con excepciones' }
  ],

  ai_lab_context: 'Sesión 14: el alumno aprendió try/except/else/finally, tipos de excepciones (ValueError, TypeError, ZeroDivisionError, FileNotFoundError, KeyError), raise, excepciones personalizadas, y patrones de manejo robusto en pipelines de IA.',
  ai_lab_suggested_prompt: 'Tengo este código que procesa datos de usuarios y falla cuando el dato es inválido. ¿Puedes ayudarme a agregar manejo de errores profesional? Quiero que el programa continúe procesando aunque algunos registros fallen, y que registre los errores en un log.'
},

// ============================================================
// SESION 15: Módulos y Librerías
// ============================================================
{
  number: 15,
  title: 'Módulos y Librerías',
  video_url: 'https://www.youtube.com/watch?v=1RuMJ53CKds',
  estimated_duration_minutes: 60,
  theory_markdown: `# Sesión 15: Módulos y Librerías

## ¿Qué es un módulo?

Un módulo es un archivo Python que contiene código reutilizable (funciones, clases, variables). En lugar de reinventar la rueda, importas módulos que alguien ya construyó.

Python tiene tres tipos:
1. **Stdlib**: incluidos con Python (math, os, json, datetime...)
2. **Third-party**: instalados con pip (numpy, pandas, scikit-learn...)
3. **Propios**: tus propios archivos .py

## Importar módulos

\`\`\`python
# Importar módulo completo
import math
print(math.pi)          # 3.141592653589793
print(math.sqrt(16))    # 4.0
print(math.ceil(3.2))   # 4
print(math.floor(3.9))  # 3

# Importar con alias (muy común en Data Science)
import math as m
print(m.pi)

# Importar función específica
from math import sqrt, pi
print(sqrt(25))   # 5.0 (sin prefijo math.)
print(pi)         # 3.14...

# Importar todo (NO recomendado)
from math import *  # Contamina el namespace
\`\`\`

## Módulos de la biblioteca estándar más útiles

### datetime: fechas y horas

\`\`\`python
from datetime import datetime, timedelta, date

# Fecha y hora actual
ahora = datetime.now()
print(ahora)                          # 2026-03-22 14:30:00.123456
print(ahora.strftime("%d/%m/%Y"))     # 22/03/2026
print(ahora.strftime("%H:%M:%S"))     # 14:30:00

# Aritmética de fechas
manana = ahora + timedelta(days=1)
hace_una_semana = ahora - timedelta(weeks=1)

# Diferencia entre fechas
inicio_carrera = date(2026, 3, 1)
hoy = date.today()
dias_estudiando = (hoy - inicio_carrera).days
print(f"Llevas {dias_estudiando} días en ITSEIA")

# Parsear string a fecha
fecha_str = "2026-12-31"
fecha_obj = datetime.strptime(fecha_str, "%Y-%m-%d")
print(fecha_obj.year, fecha_obj.month)  # 2026 12
\`\`\`

### random: números aleatorios (para IA)

\`\`\`python
import random

# Semilla para reproducibilidad (fundamental en ML)
random.seed(42)

print(random.random())          # Float entre 0 y 1
print(random.randint(1, 100))   # Entero entre 1 y 100
print(random.uniform(0.5, 1.5)) # Float entre 0.5 y 1.5

# Operaciones sobre listas
lista = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(random.choice(lista))     # Un elemento aleatorio
random.shuffle(lista)            # Mezclar lista (in place)
muestra = random.sample(lista, 3) # 3 elementos sin repetición
print(muestra)

# En ML: dividir dataset en train/test
def train_test_split(datos, test_size=0.2, seed=42):
    random.seed(seed)
    datos_copia = datos.copy()
    random.shuffle(datos_copia)
    corte = int(len(datos_copia) * (1 - test_size))
    return datos_copia[:corte], datos_copia[corte:]

dataset = list(range(100))
train, test = train_test_split(dataset)
print(f"Train: {len(train)}, Test: {len(test)}")
\`\`\`

### collections: estructuras avanzadas

\`\`\`python
from collections import Counter, defaultdict, OrderedDict

# Counter: contar frecuencias
palabras = "python ia python datos python aprendizaje ia datos".split()
conteo = Counter(palabras)
print(conteo)                    # Counter({'python': 3, 'ia': 2, ...})
print(conteo.most_common(2))     # [('python', 3), ('ia', 2)]

# defaultdict: diccionario con valor default
calificaciones = defaultdict(list)
calificaciones["Ana"].append(9.0)
calificaciones["Ana"].append(8.5)
calificaciones["Carlos"].append(7.0)
print(dict(calificaciones))
\`\`\`

## Crear tus propios módulos

\`\`\`python
# Archivo: utils_ia.py
"""Utilidades para proyectos de IA en ITSEIA."""

PI = 3.141592

def normalizar(datos):
    """Normaliza una lista al rango [0, 1]."""
    minimo, maximo = min(datos), max(datos)
    if maximo == minimo:
        return [0.0] * len(datos)
    return [(x - minimo) / (maximo - minimo) for x in datos]

def accuracy(reales, predicciones):
    """Calcula accuracy de clasificación."""
    if len(reales) != len(predicciones):
        raise ValueError("Las listas deben tener el mismo tamaño")
    correctos = sum(r == p for r, p in zip(reales, predicciones))
    return correctos / len(reales)

class Escalador:
    """Escala datos con media 0 y desviación estándar 1."""
    def __init__(self):
        self.media = None
        self.std = None

    def fit(self, datos):
        n = len(datos)
        self.media = sum(datos) / n
        varianza = sum((x - self.media) ** 2 for x in datos) / n
        self.std = varianza ** 0.5
        return self

    def transform(self, datos):
        if self.media is None:
            raise RuntimeError("Llama fit() antes de transform()")
        return [(x - self.media) / self.std for x in datos]

# ====================================
# En otro archivo: main.py
# import utils_ia
# datos = [10, 20, 30, 40, 50]
# print(utils_ia.normalizar(datos))
# from utils_ia import accuracy, Escalador
\`\`\`

## Pip: instalar librerías de terceros

\`\`\`bash
# Instalar
pip install numpy
pip install pandas
pip install scikit-learn
pip install matplotlib

# Instalar versión específica
pip install numpy==1.26.0

# Ver librerías instaladas
pip list
pip freeze > requirements.txt  # Guardar dependencias

# Instalar desde requirements.txt
pip install -r requirements.txt
\`\`\`

## Preview: Las librerías que usarás en IA

\`\`\`python
# NUMPY: vectores y matrices (base de todo ML)
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print(arr * 2)         # [2 4 6 8 10]
print(arr.mean())      # 3.0
print(arr.std())       # 1.41...

# PANDAS: DataFrames (datos tabulares)
import pandas as pd
df = pd.DataFrame({
    "nombre": ["Ana", "Carlos", "María"],
    "nota": [9.0, 7.5, 8.5]
})
print(df[df["nota"] >= 8])    # Filtrar filas

# SCIKIT-LEARN: Machine Learning
from sklearn.linear_model import LinearRegression
import numpy as np
X = np.array([[1], [2], [3], [4]])
y = np.array([2, 4, 6, 8])
modelo = LinearRegression().fit(X, y)
print(modelo.predict([[5]]))    # [10.]

# MATPLOTLIB: visualizaciones
import matplotlib.pyplot as plt
plt.plot([1, 2, 3], [4, 8, 12])
plt.title("Mi primer gráfico")
plt.savefig("grafico.png")
\`\`\``,

  quiz: {
    title: 'Quiz S15 - Módulos y Librerías',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Cuál es la diferencia entre "import math" y "from math import sqrt"?',
        options: JSON.stringify([
          { text: 'Son idénticos, solo cambia la sintaxis', is_correct: false },
          { text: '"import math" importa el módulo completo (se accede con math.sqrt); "from math import sqrt" importa solo sqrt (se accede directamente como sqrt)', is_correct: true },
          { text: '"from math import sqrt" es más lento porque importa el módulo completo', is_correct: false },
          { text: '"import math" solo funciona en Python 2', is_correct: false }
        ]),
        explanation: '"import math" → carga el módulo completo, accedes con math.sqrt(). "from math import sqrt" → importa solo sqrt al namespace local, accedes directo sqrt(). La convención en Data Science es usar alias: import numpy as np, import pandas as pd. "from módulo import *" no se recomienda porque puede sobrescribir nombres existentes en tu código.'
      },
      {
        question_text: '¿Por qué se usa random.seed(42) al inicio de experimentos de ML?',
        options: JSON.stringify([
          { text: 'Para hacer el programa más rápido', is_correct: false },
          { text: 'Para que los números "aleatorios" sean reproducibles: misma semilla = mismos resultados', is_correct: true },
          { text: '42 es el número más eficiente para generar aleatorios', is_correct: false },
          { text: 'Para evitar que el mismo número aparezca dos veces', is_correct: false }
        ]),
        explanation: 'Los generadores de números "aleatorios" en computadoras son pseudoaleatorios: deterministas dado el mismo estado inicial (semilla). random.seed(42) fija ese estado. Con la misma semilla, obtienes siempre la misma secuencia. Crítico en ML: para que tus experimentos sean reproducibles y comparables. Cualquier número sirve como semilla; 42 es convención de la comunidad.'
      },
      {
        question_text: '¿Qué hace Counter de collections?',
        options: JSON.stringify([
          { text: 'Cuenta el número de elementos de una lista (igual que len())', is_correct: false },
          { text: 'Crea un diccionario que cuenta la frecuencia de cada elemento', is_correct: true },
          { text: 'Es un tipo de bucle for especializado', is_correct: false },
          { text: 'Solo cuenta strings, no números', is_correct: false }
        ]),
        explanation: 'Counter(iterable) crea un diccionario donde las claves son los elementos y los valores son sus frecuencias. Counter(["a","b","a","c","a"]) → Counter({"a": 3, "b": 1, "c": 1}). Tiene métodos útiles como .most_common(n) que retorna los n elementos más frecuentes. Es fundamental en NLP para conteo de palabras (bag of words).'
      },
      {
        question_text: '¿Cuál es el propósito del archivo requirements.txt?',
        options: JSON.stringify([
          { text: 'Es el archivo principal de tu programa Python', is_correct: false },
          { text: 'Lista todas las librerías y versiones del proyecto para que otros puedan instalarlas con pip install -r', is_correct: true },
          { text: 'Contiene la configuración de la base de datos', is_correct: false },
          { text: 'Es un archivo de log generado automáticamente por Python', is_correct: false }
        ]),
        explanation: 'requirements.txt lista las dependencias del proyecto: numpy==1.26.0, pandas==2.1.0, etc. Permite que cualquier persona (o servidor) recree el mismo entorno exacto con "pip install -r requirements.txt". Se genera con "pip freeze > requirements.txt". Es estándar en todos los proyectos Python profesionales y necesario para deploy en producción.'
      },
      {
        question_text: '¿Cuándo debería crear mi propio módulo (.py file) en lugar de escribir todo en un solo archivo?',
        options: JSON.stringify([
          { text: 'Siempre, sin excepción', is_correct: false },
          { text: 'Cuando el código se vuelve reutilizable en múltiples proyectos o el archivo principal supera las 300 líneas', is_correct: true },
          { text: 'Solo cuando el proyecto tiene más de 10 archivos', is_correct: false },
          { text: 'Los módulos propios solo se usan en librerías publicadas en PyPI', is_correct: false }
        ]),
        explanation: 'Crea módulos cuando: 1) Tienes funciones que usarás en múltiples proyectos (utils_ia.py, preprocessing.py). 2) El archivo principal crece demasiado y la organización sufre. 3) Quieres separar responsabilidades (data.py, model.py, evaluation.py). Empezar con un archivo único y refactorizar cuando crezca es el flujo natural. Modularizar prematuramente es tan malo como no modularizar.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 15: Tu Primera Librería IA Propia',
    instructions_markdown: `## Ejercicio Práctico: Crear y Usar Tu Propia Librería Python

### Objetivo
Crear un módulo propio (toolkit_ia.py) con utilidades reutilizables para proyectos de IA, y un programa principal que lo importe y use.

### Archivo 1: toolkit_ia.py

\`\`\`python
# ================================================
# TOOLKIT IA - ITSEIA
# Tu librería personal de utilidades para ML
# ================================================
"""
toolkit_ia.py
Autor: [Tu nombre]
Descripción: Utilidades de preprocesamiento y evaluación para proyectos IA.
"""

import math
import random
from collections import Counter
from datetime import datetime

# === CONSTANTES ===
VERSION = "1.0.0"
AUTOR = "[Tu nombre]"

# === PREPROCESAMIENTO ===

def normalizar_minmax(datos):
    """Normaliza al rango [0, 1]. Retorna lista vacía si datos es vacío."""
    if not datos:
        return []
    minimo, maximo = min(datos), max(datos)
    if maximo == minimo:
        return [0.0] * len(datos)
    return [(x - minimo) / (maximo - minimo) for x in datos]

def estandarizar(datos):
    """Estandarización Z-score: media 0, desviación estándar 1."""
    # COMPLETA: calcula media y std, retorna lista estandarizada
    pass

def eliminar_outliers_iqr(datos):
    """
    Elimina outliers usando el método IQR.
    Retorna datos filtrados y lista de outliers eliminados.
    """
    # COMPLETA: calcula Q1, Q3, IQR; filtra valores fuera del rango aceptable
    pass

def train_test_split(datos, test_size=0.2, seed=42):
    """Divide datos en entrenamiento y prueba."""
    # COMPLETA usando random.seed y random.shuffle
    pass

# === MÉTRICAS ===

def accuracy_score(reales, predicciones):
    """Calcula accuracy de clasificación."""
    if len(reales) != len(predicciones):
        raise ValueError("Las listas deben tener el mismo tamaño")
    correctos = sum(r == p for r, p in zip(reales, predicciones))
    return correctos / len(reales)

def mse_score(reales, predicciones):
    """Mean Squared Error para regresión."""
    # COMPLETA
    pass

def mae_score(reales, predicciones):
    """Mean Absolute Error para regresión."""
    # COMPLETA
    pass

# === ESTADÍSTICAS ===

def estadisticas_descriptivas(datos):
    """Retorna dict con media, mediana, std, min, max, n."""
    # COMPLETA usando math.sqrt para desviación estándar
    pass

# === UTILIDADES ===

def bag_of_words(textos):
    """Cuenta frecuencia de palabras en una lista de textos."""
    todas_palabras = []
    for texto in textos:
        palabras = texto.lower().split()
        todas_palabras.extend(palabras)
    return dict(Counter(todas_palabras).most_common(20))

def log_experimento(nombre, config, metricas):
    """Imprime log formateado de un experimento."""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {nombre}")
    for k, v in config.items():
        print(f"  config.{k}: {v}")
    for k, v in metricas.items():
        if isinstance(v, float):
            print(f"  metric.{k}: {v:.4f}")
        else:
            print(f"  metric.{k}: {v}")
\`\`\`

### Archivo 2: main_proyecto.py

\`\`\`python
# ================================================
# PROYECTO IA USANDO TOOLKIT PROPIO
# ================================================
import toolkit_ia as tk  # Tu librería

print(f"Usando toolkit_ia v{tk.VERSION} por {tk.AUTOR}")

# Dataset de ejemplo
datos_brutos = [23, 45, 12, 67, 34, 89, 11, 250, 56, 78, 42, 35]

# COMPLETA: usa las funciones de tu toolkit para:
# 1. Mostrar estadísticas descriptivas
# 2. Eliminar outliers
# 3. Normalizar datos limpios
# 4. Dividir en train/test
# 5. Calcular MSE entre dos listas de predicciones
# 6. Calcular bag of words de 3 textos sobre IA
# 7. Registrar el experimento completo con log_experimento()
\`\`\`

### Instrucciones
1. Crea ambos archivos en la misma carpeta
2. Completa todas las funciones marcadas con "COMPLETA"
3. Ejecuta main_proyecto.py y verifica que todo funciona

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| estandarizar() correcta | 15 pts |
| eliminar_outliers_iqr() funciona | 20 pts |
| train_test_split() divide correctamente | 15 pts |
| mse_score() y mae_score() correctos | 15 pts |
| estadisticas_descriptivas() completas | 15 pts |
| main_proyecto.py usa todas las funciones | 20 pts |`,
    allowed_file_types: ['pdf', 'py', 'zip', 'txt']
  },

  resources: [
    { title: 'Módulos Python - Documentación oficial', url: 'https://docs.python.org/es/3/tutorial/modules.html', type: 'documentation', description: 'Tutorial oficial de módulos y paquetes' },
    { title: 'PyPI - El repositorio de paquetes Python', url: 'https://pypi.org/', type: 'tool', description: 'Busca e instala cualquier librería Python' },
    { title: 'Módulos Python - Programacion ATS', url: 'https://www.youtube.com/watch?v=1RuMJ53CKds', type: 'video', description: 'Tutorial módulos e import en español' },
    { title: 'NumPy para principiantes', url: 'https://numpy.org/doc/stable/user/absolute_beginners.html', type: 'tutorial', description: 'Guía oficial de NumPy para principiantes' },
    { title: 'Pandas en 10 minutos', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', type: 'tutorial', description: 'Introducción rápida a pandas' }
  ],

  ai_lab_context: 'Sesión 15: el alumno aprendió módulos stdlib (math, datetime, random, collections), importaciones (import, from import, as), crear módulos propios, pip e instalación de librerías, y preview de numpy/pandas/scikit-learn/matplotlib.',
  ai_lab_suggested_prompt: 'Acabo de aprender sobre módulos en Python. Quiero empezar a usar NumPy y Pandas. ¿Puedes mostrarme las 10 operaciones más importantes de cada uno para un principiante en Data Science? Usa ejemplos relacionados con notas de estudiantes o datos médicos.'
},

// ============================================================
// SESION 16: Proyecto Integrador
// ============================================================
{
  number: 16,
  title: 'Proyecto Integrador: Analizador de Dataset Completo',
  video_url: 'https://www.youtube.com/watch?v=vmEHCJofslg',
  estimated_duration_minutes: 120,
  theory_markdown: `# Sesión 16: Proyecto Integrador

## El gran reto final

Esta sesión integra TODO lo aprendido en el módulo. Construirás desde cero un sistema completo de análisis y predicción de datos, aplicando cada concepto de las sesiones 1-15 de forma coherente y profesional.

## Lo que usarás en este proyecto

| Sesión | Concepto | Uso en el proyecto |
|--------|----------|--------------------|
| 1 | Python básico, print | Output formateado |
| 2 | Variables y tipos | Almacenar datos de configuración |
| 3 | input() | Interfaz interactiva |
| 4 | Operadores | Cálculos matemáticos |
| 5 | Condicionales | Clasificación y decisiones |
| 6 | Bucles for | Procesamiento de dataset |
| 7 | Bucles while | Menú interactivo |
| 8 | Funciones I | Modularización básica |
| 9 | Funciones II | *args, **kwargs, lambda |
| 10 | Listas | Dataset como listas |
| 11 | Diccionarios | Configuración y resultados |
| 12 | Strings | Procesamiento de texto |
| 13 | Archivos | I/O CSV y JSON |
| 14 | Errores | Manejo robusto |
| 15 | Módulos | math, csv, json, random |

## El Proyecto: Sistema de Análisis Crediticio

Construirás un sistema que:
1. Carga un dataset CSV de solicitudes de crédito
2. Limpia y valida los datos
3. Calcula un "score crediticio" con reglas propias
4. Clasifica solicitudes (aprobado/rechazado/revisar)
5. Genera estadísticas del portfolio
6. Exporta resultados a JSON
7. Ofrece una interfaz de consulta interactiva

## Estructura del proyecto

\`\`\`
proyecto_credito/
  ├── data/
  │   ├── solicitudes.csv       (generado por el programa)
  │   └── resultados.json       (generado por el programa)
  ├── modulos/
  │   ├── validador.py          (Sesión 14: manejo de errores)
  │   ├── calculadora.py        (Sesiones 4, 8, 9: operadores y funciones)
  │   └── reportes.py           (Sesiones 12, 13: strings y archivos)
  └── main.py                   (programa principal)
\`\`\`

## Código del módulo calculadora.py

\`\`\`python
"""Calculadora de score crediticio."""
import math

def calcular_score(*factores, pesos=None):
    """
    Calcula score crediticio ponderado.
    Args:
        *factores: valores normalizados (0-1) de cada factor
        pesos: dict con pesos para cada factor (default: iguales)
    Returns:
        score entre 0 y 100
    """
    n = len(factores)
    if pesos is None:
        pesos_lista = [1/n] * n
    else:
        pesos_lista = list(pesos.values())

    score = sum(f * p for f, p in zip(factores, pesos_lista)) * 100
    return round(score, 2)

def normalizar_ingreso(ingreso, ingreso_max=10000):
    return min(ingreso / ingreso_max, 1.0)

def normalizar_historial(historial):
    tabla = {"excelente": 1.0, "bueno": 0.8, "regular": 0.5, "malo": 0.2, "sin_historial": 0.3}
    return tabla.get(historial.lower(), 0.0)

def normalizar_ratio_deuda(ingreso, deuda):
    if ingreso <= 0:
        return 0.0
    ratio = deuda / ingreso
    if ratio >= 1.0:
        return 0.0
    elif ratio >= 0.5:
        return 0.3
    elif ratio >= 0.3:
        return 0.6
    else:
        return 1.0

def clasificar_solicitud(score):
    """Clasifica según score."""
    if score >= 75:
        return "APROBADO", "Alto perfil"
    elif score >= 55:
        return "REVISAR", "Perfil moderado, requiere documentación"
    else:
        return "RECHAZADO", "Perfil de riesgo alto"

def calcular_monto_maximo(ingreso, score):
    """Calcula monto máximo según ingreso y score."""
    factor = score / 100
    return round(ingreso * 12 * factor, 2)
\`\`\`

## Programa principal completo

\`\`\`python
"""
main.py — Sistema de Análisis Crediticio
Proyecto Integrador Fundamentos de Programación — ITSEIA 2026
"""

import csv
import json
import os
import random
from datetime import datetime

# ============================================================
# GENERACIÓN DE DATASET (Sesiones 6, 13)
# ============================================================
def generar_dataset(nombre_archivo, num_registros=50):
    """Genera dataset CSV de solicitudes de crédito."""
    os.makedirs("data", exist_ok=True)
    historiales = ["excelente", "bueno", "regular", "malo", "sin_historial"]
    random.seed(2026)

    with open(nombre_archivo, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["id", "nombre", "edad", "ingreso", "deuda", "historial"])
        for i in range(1, num_registros + 1):
            ingreso = random.randint(600, 8000)
            deuda = random.randint(0, int(ingreso * 1.2))
            writer.writerow([
                i,
                f"Cliente_{i:03d}",
                random.randint(20, 70),
                ingreso,
                deuda,
                random.choice(historiales)
            ])
    print(f"Dataset generado: {nombre_archivo} ({num_registros} registros)")

# ============================================================
# CARGA Y PROCESAMIENTO (Sesiones 5, 6, 8, 13, 14)
# ============================================================
def cargar_y_procesar(nombre_archivo):
    """Carga CSV, calcula scores y retorna resultados."""
    from modulos.calculadora import (
        normalizar_ingreso, normalizar_historial, normalizar_ratio_deuda,
        calcular_score, clasificar_solicitud, calcular_monto_maximo
    )

    resultados = []
    errores = []

    with open(nombre_archivo, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for fila in reader:
            try:
                solicitud_id = int(fila["id"])
                ingreso = float(fila["ingreso"])
                deuda = float(fila["deuda"])
                historial = fila["historial"].strip()

                # Normalizar factores
                f_ingreso = normalizar_ingreso(ingreso)
                f_historial = normalizar_historial(historial)
                f_deuda = normalizar_ratio_deuda(ingreso, deuda)

                # Calcular score con pesos
                pesos = {"ingreso": 0.35, "historial": 0.40, "deuda": 0.25}
                score = calcular_score(f_ingreso, f_historial, f_deuda, pesos=pesos)
                decision, razon = clasificar_solicitud(score)
                monto_max = calcular_monto_maximo(ingreso, score)

                resultados.append({
                    "id": solicitud_id,
                    "nombre": fila["nombre"],
                    "score": score,
                    "decision": decision,
                    "razon": razon,
                    "monto_maximo": monto_max,
                    "ingreso": ingreso,
                    "historial": historial
                })

            except (ValueError, KeyError) as e:
                errores.append({"fila": fila.get("id", "?"), "error": str(e)})

    return resultados, errores

# ============================================================
# ANÁLISIS ESTADÍSTICO (Sesiones 6, 10)
# ============================================================
def analizar_portfolio(resultados):
    """Calcula estadísticas del portfolio de crédito."""
    if not resultados:
        return {}

    scores = [r["score"] for r in resultados]
    aprobados = [r for r in resultados if r["decision"] == "APROBADO"]
    rechazados = [r for r in resultados if r["decision"] == "RECHAZADO"]
    revisar = [r for r in resultados if r["decision"] == "REVISAR"]

    return {
        "total_solicitudes": len(resultados),
        "aprobados": len(aprobados),
        "rechazados": len(rechazados),
        "por_revisar": len(revisar),
        "tasa_aprobacion": len(aprobados) / len(resultados),
        "score_promedio": sum(scores) / len(scores),
        "score_max": max(scores),
        "score_min": min(scores),
        "monto_total_aprobado": sum(r["monto_maximo"] for r in aprobados)
    }

# ============================================================
# MENÚ INTERACTIVO (Sesión 7: while)
# ============================================================
def menu_consultas(resultados):
    """Interfaz interactiva para consultas."""
    while True:
        print("\\n=== CONSULTAS ===")
        print("1. Buscar cliente por nombre")
        print("2. Ver top 5 scores")
        print("3. Ver todos los aprobados")
        print("0. Salir")

        opcion = input("Opción: ")
        if opcion == "1":
            busqueda = input("Nombre: ").upper()
            encontrados = [r for r in resultados if busqueda in r["nombre"].upper()]
            if encontrados:
                for r in encontrados:
                    print(f"  {r['nombre']}: Score={r['score']} → {r['decision']}")
            else:
                print("  No encontrado")
        elif opcion == "2":
            top5 = sorted(resultados, key=lambda x: x["score"], reverse=True)[:5]
            for i, r in enumerate(top5, 1):
                print(f"  {i}. {r['nombre']}: {r['score']}")
        elif opcion == "3":
            aprobados = [r for r in resultados if r["decision"] == "APROBADO"]
            for r in aprobados:
                print(f"  {r['nombre']}: \${r['monto_maximo']:,.2f}")
        elif opcion == "0":
            break
        else:
            print("Opción inválida")

# ============================================================
# MAIN
# ============================================================
if __name__ == "__main__":
    print("=" * 55)
    print("SISTEMA DE ANÁLISIS CREDITICIO — ITSEIA 2026")
    print("=" * 55)

    CSV = "data/solicitudes.csv"
    JSON = "data/resultados.json"

    # 1. Generar dataset
    generar_dataset(CSV, 30)

    # 2. Procesar
    resultados, errores = cargar_y_procesar(CSV)
    print(f"Procesadas: {len(resultados)} | Errores: {len(errores)}")

    # 3. Analizar
    stats = analizar_portfolio(resultados)
    print(f"\\nAPROBADOS: {stats['aprobados']} ({stats['tasa_aprobacion']:.1%})")
    print(f"RECHAZADOS: {stats['rechazados']}")
    print(f"POR REVISAR: {stats['por_revisar']}")
    print(f"Score promedio: {stats['score_promedio']:.1f}")
    print(f"Monto total aprobado: \${stats['monto_total_aprobado']:,.2f}")

    # 4. Exportar
    with open(JSON, "w", encoding="utf-8") as f:
        json.dump({"timestamp": datetime.now().isoformat(),
                   "estadisticas": stats,
                   "resultados": resultados}, f, indent=2)
    print(f"\\nResultados exportados: {JSON}")

    # 5. Interfaz interactiva
    respuesta = input("\\n¿Entrar al modo de consultas? (s/n): ").lower()
    if respuesta == "s":
        menu_consultas(resultados)

    print("\\nProyecto completado. ¡Felicitaciones por finalizar el módulo!")
\`\`\``,

  quiz: {
    title: 'Quiz S16 - Integrador',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Cuál es el propósito de os.makedirs("data", exist_ok=True) en el proyecto?',
        options: JSON.stringify([
          { text: 'Crea el directorio "data" solo si no existe (sin error si ya existe)', is_correct: true },
          { text: 'Elimina y recrea el directorio "data"', is_correct: false },
          { text: 'Lista el contenido del directorio "data"', is_correct: false },
          { text: 'Comprime el directorio "data"', is_correct: false }
        ]),
        explanation: 'os.makedirs(path, exist_ok=True) crea el directorio (y todos los subdirectorios necesarios). exist_ok=True evita el error FileExistsError si el directorio ya existe. Sin exist_ok=True, el programa fallaría al ejecutarse por segunda vez. Es el patrón estándar para garantizar que los directorios necesarios existan antes de escribir archivos.'
      },
      {
        question_text: '¿Por qué el sistema usa pesos diferentes para cada factor (ingreso: 0.35, historial: 0.40, deuda: 0.25)?',
        options: JSON.stringify([
          { text: 'Porque Python requiere que los pesos sumen exactamente 1.0', is_correct: false },
          { text: 'Para que el cálculo sea más rápido con números más pequeños', is_correct: false },
          { text: 'Porque diferentes factores tienen diferente importancia predictiva del riesgo crediticio', is_correct: true },
          { text: 'Es solo una convención visual, no afecta el resultado', is_correct: false }
        ]),
        explanation: 'En modelos reales de crédito (y en ML en general), no todos los features tienen la misma importancia. El historial crediticio (0.40) es el predictor más fuerte de comportamiento futuro. Los ingresos (0.35) determinan capacidad de pago. La deuda actual (0.25) muestra compromisos existentes. Los pesos suman 1.0 para que el score esté en escala 0-100. Esto es feature weighting, concepto fundamental en ML.'
      },
      {
        question_text: 'En el proyecto se usa "key=lambda x: x[\'score\']" para ordenar. ¿Cuál es la alternativa más explícita (sin lambda)?',
        options: JSON.stringify([
          { text: 'sorted(resultados, key="score", reverse=True)', is_correct: false },
          { text: 'def obtener_score(r): return r["score"]; sorted(resultados, key=obtener_score, reverse=True)', is_correct: true },
          { text: 'resultados.sort("score")', is_correct: false },
          { text: 'No hay alternativa, lambda es obligatorio en sorted()', is_correct: false }
        ]),
        explanation: 'Lambda y función def son equivalentes. def obtener_score(r): return r["score"] es exactamente lo mismo que lambda r: r["score"]. sorted() acepta cualquier callable (función) como key. La lambda es más concisa para funciones de una línea usadas una sola vez. La función def es mejor si la lógica es compleja o si la reutilizarás en múltiples lugares.'
      },
      {
        question_text: '¿Por qué se usa "from modulos.calculadora import ..." en lugar de "import calculadora"?',
        options: JSON.stringify([
          { text: 'Porque calculadora.py está en un subdirectorio "modulos", y necesitas especificar la ruta', is_correct: true },
          { text: 'Porque "import calculadora" solo funciona en Python 2', is_correct: false },
          { text: 'No hay diferencia, ambas sintaxis son equivalentes siempre', is_correct: false },
          { text: 'Porque "from import" es siempre más eficiente que "import"', is_correct: false }
        ]),
        explanation: 'Cuando el módulo está en un subdirectorio, debes especificar la ruta con puntos: "from modulos.calculadora import func" equivale a "busca el archivo modulos/calculadora.py". "import calculadora" solo funcionaría si calculadora.py estuviera en el mismo directorio que main.py o en el Python path. Para subdirectorios, también necesitas un archivo __init__.py en "modulos/" (o usar importlib en Python 3.3+).'
      },
      {
        question_text: 'Al finalizar este módulo de Fundamentos, ¿cuál es el SIGUIENTE paso natural en el camino de IA?',
        options: JSON.stringify([
          { text: 'Aprender Java o C++ para tener una base más sólida', is_correct: false },
          { text: 'NumPy + Pandas para manipulación eficiente de datos, base de todo Machine Learning en Python', is_correct: true },
          { text: 'Aprender diseño web con HTML/CSS para hacer dashboards', is_correct: false },
          { text: 'Memorizar todos los métodos de Python antes de continuar', is_correct: false }
        ]),
        explanation: 'El camino estándar en IA: Python fundamentals → NumPy (vectores/matrices) → Pandas (DataFrames) → Matplotlib/Seaborn (visualización) → Scikit-learn (ML clásico) → TensorFlow/PyTorch (Deep Learning). NumPy es la base de todo: pandas está construido sobre numpy, scikit-learn usa arrays de numpy. Dominar numpy es el siguiente gran salto. Todo lo que aprendiste en este módulo te prepara para eso.'
      }
    ]
  },

  assignment: {
    title: 'Proyecto Final: Sistema Completo de Análisis de Datos',
    instructions_markdown: `## PROYECTO FINAL INTEGRADOR

### Descripción
Construir un sistema completo de análisis de datos que integre TODOS los conceptos del módulo. Tienes libertad para elegir el dominio (salud, educación, finanzas, marketing, deporte).

### Requerimientos Obligatorios

El proyecto DEBE incluir:

**Datos (Sesiones 10, 11, 13)**
- Dataset de mínimo 20 registros (generado o real)
- Almacenamiento en CSV o JSON
- Exportación de resultados a un archivo

**Procesamiento (Sesiones 5, 6, 7)**
- Al menos 3 reglas de clasificación con condicionales
- Procesamiento iterativo del dataset con bucles
- Interfaz de consulta con while (menú)

**Funciones (Sesiones 8, 9)**
- Mínimo 5 funciones, cada una con docstring
- Al menos una función con *args o **kwargs
- Al menos una lambda para ordenar o filtrar

**Manejo de errores (Sesión 14)**
- try/except en todas las operaciones de archivo
- Al menos una excepción personalizada
- Log de errores

**Módulos (Sesión 15)**
- Usar al menos 3 módulos de la stdlib (csv, json, os, datetime, math, random...)
- El código principal organizado en al menos 2 archivos

### Dominios sugeridos
- Sistema de evaluación médica (IMC, riesgo cardiovascular)
- Análisis de rendimiento académico (notas, asistencia)
- Portfolio de inversiones (acciones, retornos)
- Sistema de recomendación simple (películas, libros)
- Análisis de ventas (productos, clientes, periodos)

### Entregables
1. Carpeta del proyecto con todos los archivos .py
2. README.txt explicando: qué hace el sistema, cómo ejecutarlo, un ejemplo de output
3. Capturas del output de ejecución (puede ser el output copiado a un .txt)

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| Dataset mínimo 20 registros, guardado en archivo | 10 pts |
| Mínimo 5 funciones con docstrings | 15 pts |
| 3+ reglas de clasificación funcionando | 15 pts |
| Menú interactivo con while | 10 pts |
| try/except en operaciones de archivo | 10 pts |
| Excepción personalizada | 10 pts |
| Lambda en al menos una operación | 5 pts |
| *args o **kwargs en al menos una función | 5 pts |
| Exportación de resultados a JSON o CSV | 10 pts |
| README.txt claro y completo | 10 pts |

### Bonus (hasta +10 pts)
- Visualización ASCII de datos (gráfico de barras con caracteres)
- Sistema de búsqueda por múltiples criterios
- Comparación de dos periodos o grupos de datos`,
    allowed_file_types: ['pdf', 'py', 'zip', 'txt']
  },

  resources: [
    { title: 'Python Project Structure Best Practices', url: 'https://realpython.com/python-application-layouts/', type: 'article', description: 'Cómo estructurar proyectos Python profesionales' },
    { title: 'Python Tutorial Completo - freeCodeCamp', url: 'https://www.youtube.com/watch?v=vmEHCJofslg', type: 'video', description: 'Tutorial Python completo en español (proyecto final)' },
    { title: 'GitHub - Subir tu proyecto', url: 'https://docs.github.com/es/get-started/start-your-journey/hello-world', type: 'tutorial', description: 'Aprende a subir tu proyecto a GitHub' },
    { title: 'Kaggle Datasets - Datos reales para tu proyecto', url: 'https://www.kaggle.com/datasets', type: 'tool', description: 'Miles de datasets gratuitos para tu proyecto integrador' },
    { title: 'PEP8 Checker online', url: 'https://pep8ci.herokuapp.com/', type: 'tool', description: 'Verifica que tu código sigue los estándares PEP8' }
  ],

  ai_lab_context: 'Sesión 16 PROYECTO INTEGRADOR: el alumno ha completado todas las sesiones 1-15. Conoce: variables, tipos, input/print, operadores, condicionales, for, while, funciones (def, *args, **kwargs, lambda), listas, tuplas, diccionarios, strings, archivos (CSV, JSON), manejo de errores (try/except, raise, excepciones personalizadas), módulos stdlib, y ha creado módulos propios.',
  ai_lab_suggested_prompt: 'Estoy haciendo mi proyecto integrador de Python. He elegido hacer un sistema de análisis de ventas. Tengo dudas sobre cómo estructurar el código en múltiples archivos y cómo conectarlos. ¿Puedes guiarme en la arquitectura general del proyecto antes de que empiece a codear?'
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
  let info = `  S\${s.number} "\${s.title.substring(0, 40)}"`;

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
  console.log('=== CARGANDO FUNDAMENTOS S13-S16 ===');
  for (const session of SESSIONS) {
    try {
      await loadSession(session);
    } catch (e) {
      console.error(`  ERROR en S${session.number}: \${e.message}`);
    }
  }
  console.log('\n=== COMPLETADO: 4 sesiones cargadas (S13-S16) ===');
  console.log('Las 16 sesiones de Fundamentos de Programacion estan completas.');
}

main().catch(e => console.error('Error fatal:', e));
