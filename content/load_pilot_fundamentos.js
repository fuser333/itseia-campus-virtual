#!/usr/bin/env node
// load_pilot_fundamentos.js
// Carga 16 sesiones de "Fundamentos de Programacion" en Supabase
// Subject ID: 0df94819-8ccc-499b-ae88-7ed70713295d

const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';
const SUBJECT_ID = '0df94819-8ccc-499b-ae88-7ed70713295d';

const H = {
  'apikey': SKEY,
  'Authorization': 'Bearer ' + SKEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};
const Hmin = {
  'apikey': SKEY,
  'Authorization': 'Bearer ' + SKEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
};

async function api(method, path, body, minimal = false) {
  const res = await fetch(BASE + path, {
    method,
    headers: minimal ? Hmin : H,
    body: body ? JSON.stringify(body) : undefined
  });
  if (minimal) return null;
  const data = await res.json();
  if (res.status >= 400) throw new Error(`\${method} \${path} → ${res.status}: \${JSON.stringify(data).substring(0, 200)}`);
  return Array.isArray(data) ? data[0] : data;
}

// ============================================================
// CONTENIDO DE LAS 16 SESIONES
// ============================================================

const SESSIONS = [

// ============================================================
// SESION 1: Introduccion a la Programacion y Python
// ============================================================
{
  number: 1,
  title: 'Introducción a la Programación y Python',
  video_url: 'https://www.youtube.com/watch?v=G2FCfQj-9ig',
  estimated_duration_minutes: 45,
  theory_markdown: `# Sesión 1: Introducción a la Programación y Python

## ¿Qué es programar?

Programar es dar instrucciones precisas a una computadora para que resuelva un problema. Una computadora no piensa: ejecuta exactamente lo que le dices, en el orden que se lo dices. Tu trabajo como programador es traducir un problema del mundo real a un lenguaje que la máquina entienda.

Piénsalo así: cuando preparas una receta de cocina, sigues pasos en orden, tomas decisiones ("si el agua hierve, agrega la pasta") y repites acciones ("revuelve durante 5 minutos"). Eso es exactamente lo que hace un programa.

## ¿Por qué Python?

Python es el lenguaje más usado en Inteligencia Artificial por tres razones principales:

| Razón | Explicación |
|-------|-------------|
| **Legibilidad** | Su sintaxis se parece al inglés. Se lee casi como pseudocódigo |
| **Ecosistema IA** | TensorFlow, PyTorch, scikit-learn, pandas: todas las librerías de IA son Python |
| **Comunidad** | Es el lenguaje #1 del mundo según el índice TIOBE (2026) |

Python fue creado por Guido van Rossum en 1991. Su filosofia se resume en el "Zen de Python": bello es mejor que feo, explícito es mejor que implícito, simple es mejor que complejo.

## Instalación y entorno

Para esta sesión usaremos **Google Colab** (colab.research.google.com), que no requiere instalación. Es un notebook de Jupyter en la nube, gratuito, con GPU incluida. Ideal para IA.

Si quieres instalar Python localmente:
1. Descarga Python 3.12+ desde python.org
2. Instala Visual Studio Code (code.visualstudio.com)
3. Instala la extensión Python de Microsoft en VS Code

## Tu primer programa

El ritual de todo programador: imprimir "Hola, mundo".

\`\`\`python
# Este es un comentario: Python lo ignora al ejecutar
# Los comentarios son para humanos, no para la máquina

print("Hola, mundo!")
print("Bienvenido a Python y a ITSEIA")
\`\`\`

**Salida esperada:**
\`\`\`
Hola, mundo!
Bienvenido a Python y a ITSEIA
\`\`\`

La función \`print()\` muestra texto en pantalla. Los textos (cadenas de caracteres) van entre comillas dobles \`"\` o simples \`'\`.

## Cómo funciona Python por dentro

Python es un lenguaje **interpretado**: el intérprete lee tu código línea por línea y lo ejecuta inmediatamente. No necesitas compilarlo antes de correrlo (a diferencia de C++ o Java).

\`\`\`
Tu código Python → Intérprete Python → Resultado
\`\`\`

Esto lo hace perfecto para aprender: puedes probar una línea y ver el resultado al instante.

## Errores: tu mejor maestro

Los errores no son fracasos. Son el compilador diciéndote exactamente qué salió mal. Aprende a leerlos:

\`\`\`python
# Este código tiene un error intencional
print("Hola mundo"   # Falta el paréntesis de cierre
\`\`\`

**Error que verás:**
\`\`\`
SyntaxError: '(' was never closed
\`\`\`

Python te dice: tipo de error (SyntaxError), línea del error, y a veces hasta te señala exactamente el problema con un \`^\`.

### Tipos de errores más comunes

| Error | Causa | Ejemplo |
|-------|-------|---------|
| \`SyntaxError\` | Código mal escrito | Falta \`)\` o \`:\` |
| \`NameError\` | Usar variable no definida | \`print(x)\` sin definir \`x\` |
| \`TypeError\` | Operación inválida entre tipos | \`"2" + 2\` |
| \`IndentationError\` | Indentación incorrecta | Mala sangría en bloques |

## Python en el mundo de la IA

Cuando entrenas un modelo de machine learning, escribes algo como esto:

\`\`\`python
# Esto es Python real usado en IA (lo aprenderás en semestres 2-3)
from sklearn.linear_model import LinearRegression
import numpy as np

# Datos de entrenamiento
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

# Crear y entrenar el modelo
modelo = LinearRegression()
modelo.fit(X, y)

# Predecir
prediccion = modelo.predict([[6]])
print(f"Predicción para 6: {prediccion[0]}")  # → 12.0
\`\`\`

Hoy no entiendes todo esto. Al final de este módulo, sí lo entenderás.

## Buenas prácticas desde el día 1

1. **Comenta tu código**: explica el "por qué", no el "qué"
2. **Nombres descriptivos**: \`edad_usuario\` es mejor que \`e\`
3. **Una línea, una idea**: no sobrecargues líneas
4. **Prueba constantemente**: ejecuta después de cada cambio

## Resumen

- Python es el lenguaje #1 para IA por su legibilidad y ecosistema
- \`print()\` muestra valores en pantalla
- Los comentarios empiezan con \`#\`
- Los errores tienen tipo, línea y descripción: léelos con calma
- Google Colab es tu entorno de práctica inmediato`,

  quiz: {
    title: 'Quiz S1 - Introducción a Python',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Cuál de las siguientes afirmaciones describe mejor a Python?',
        options: JSON.stringify([
          { text: 'Es un lenguaje compilado que necesita ser convertido a código máquina antes de ejecutarse', is_correct: false },
          { text: 'Es un lenguaje interpretado, de alto nivel, conocido por su legibilidad y amplio ecosistema para IA', is_correct: true },
          { text: 'Es un lenguaje exclusivo para desarrollo web y no tiene aplicaciones en ciencia de datos', is_correct: false },
          { text: 'Fue creado por Microsoft en 2010 como alternativa a Java', is_correct: false }
        ]),
        explanation: 'Python es interpretado (el intérprete ejecuta línea por línea sin compilación previa), de alto nivel (abstrae detalles del hardware), fue creado por Guido van Rossum en 1991, y es el lenguaje dominante en IA/ML gracias a librerías como TensorFlow, PyTorch y scikit-learn.'
      },
      {
        question_text: '¿Qué imprime el siguiente código?\n\nprint("Python")\nprint("es")\nprint("increíble")',
        options: JSON.stringify([
          { text: 'Python es increíble (en una sola línea)', is_correct: false },
          { text: 'Error: no se pueden usar tres print seguidos', is_correct: false },
          { text: 'Python\nes\nincreíble (cada palabra en una línea diferente)', is_correct: true },
          { text: 'Solo imprime la última línea: increíble', is_correct: false }
        ]),
        explanation: 'Cada llamada a print() imprime su contenido y agrega automáticamente un salto de línea al final. Por eso, tres print() consecutivos producen tres líneas de salida independientes.'
      },
      {
        question_text: '¿Qué tipo de error produce este código?\n\nprint("Hola mundo"',
        options: JSON.stringify([
          { text: 'NameError: el nombre "Hola mundo" no está definido', is_correct: false },
          { text: 'SyntaxError: el paréntesis de apertura nunca fue cerrado', is_correct: true },
          { text: 'TypeError: no se puede imprimir texto', is_correct: false },
          { text: 'El código funciona correctamente sin errores', is_correct: false }
        ]),
        explanation: 'SyntaxError ocurre cuando el código no sigue las reglas gramaticales de Python. En este caso, el paréntesis de apertura de print( nunca fue cerrado con ). Python detecta esto antes de ejecutar una sola línea.'
      },
      {
        question_text: '¿Cuál es la forma correcta de escribir un comentario en Python?',
        options: JSON.stringify([
          { text: '// Este es un comentario', is_correct: false },
          { text: '/* Este es un comentario */', is_correct: false },
          { text: '# Este es un comentario', is_correct: true },
          { text: '-- Este es un comentario', is_correct: false }
        ]),
        explanation: 'En Python los comentarios de una línea empiezan con #. La sintaxis // es de JavaScript/C++, /* */ es de C/Java/CSS, y -- es de SQL. Para comentarios multilínea en Python se usan triple comillas: """comentario""".'
      },
      {
        question_text: '¿Por qué Python es el lenguaje preferido para Inteligencia Artificial?',
        options: JSON.stringify([
          { text: 'Porque es el único lenguaje que puede ejecutarse en GPUs', is_correct: false },
          { text: 'Porque fue diseñado específicamente para IA en los años 2000', is_correct: false },
          { text: 'Por su combinación de sintaxis legible, ecosistema de librerías IA (TensorFlow, PyTorch, scikit-learn) y enorme comunidad', is_correct: true },
          { text: 'Porque corre 10 veces más rápido que otros lenguajes en cálculos matemáticos', is_correct: false }
        ]),
        explanation: 'Python domina IA no por velocidad (C++ es más rápido), sino por su ecosistema: las mejores librerías de ML/DL están escritas para Python. Su legibilidad permite a científicos e ingenieros colaborar fácilmente, y su comunidad es la más grande del mundo.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 1: Mi Primera Sesión Python',
    instructions_markdown: `## Ejercicio Práctico: Mi Primera Sesión Python

### Objetivo
Escribir tu primer programa Python real que muestre información personal y practique el uso de print() con diferentes formatos.

### Instrucciones paso a paso

**Paso 1:** Abre Google Colab en colab.research.google.com y crea un nuevo notebook.

**Paso 2:** En la primera celda, copia este código base y completa las partes indicadas:

\`\`\`python
# ================================================
# MI PRIMER PROGRAMA PYTHON - [Tu nombre aquí]
# Fecha: [fecha de hoy]
# Materia: Fundamentos de Programación - ITSEIA
# ================================================

# Parte 1: Presentación personal
print("=" * 40)           # Imprime 40 signos de igual
print("MI PRESENTACIÓN")
print("=" * 40)

print("Nombre: ")         # Completa con tu nombre
print("Edad: ")           # Completa con tu edad
print("Ciudad: ")         # Completa con tu ciudad

# Parte 2: Por qué quiero aprender IA
print()                   # Línea en blanco
print("-" * 40)
print("¿POR QUÉ QUIERO APRENDER IA?")
print("-" * 40)
print("")  # Escribe tu razón aquí entre las comillas

# Parte 3: Mi meta con Python
print()
print("Mi meta al finalizar este módulo:")
print("")  # Escribe tu meta aquí

# Parte 4: Practica matemáticas con print
print()
print("OPERACIONES BÁSICAS:")
print("2 + 3 =", 2 + 3)
print("10 - 4 =", 10 - 4)
print("5 * 6 =", 5 * 6)
print("15 / 4 =", 15 / 4)
print("15 // 4 =", 15 // 4)   # División entera
print("15 % 4 =", 15 % 4)     # Módulo (residuo)
\`\`\`

**Paso 3:** Ejecuta el código y verifica que no haya errores.

**Paso 4:** Agrega al final al menos 3 prints adicionales con información que consideres interesante (tu carrera anterior, un hobby, etc.).

### Resultado esperado
El programa debe imprimir un bloque ordenado con tu presentación completa, sin errores, con todas las secciones completadas.

### Rúbrica de evaluación (100 puntos)

| Criterio | Puntos |
|----------|--------|
| Programa ejecuta sin errores | 30 pts |
| Nombre, edad y ciudad completos | 20 pts |
| Razón y meta escritas (no vacías) | 20 pts |
| Operaciones matemáticas correctas | 15 pts |
| Mínimo 3 prints adicionales propios | 15 pts |

### Cómo entregar
Comparte el link de tu Colab con permiso de "Cualquiera con el enlace puede ver" y súbelo en el campo de entrega.`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'Documentación oficial Python 3.12 en español', url: 'https://docs.python.org/es/3/', type: 'documentation', description: 'Referencia oficial completa de Python' },
    { title: 'Google Colab - Guía de inicio', url: 'https://colab.research.google.com/notebooks/intro.ipynb', type: 'tool', description: 'Tutorial oficial de Google Colab' },
    { title: 'Python para principiantes - MitoCode', url: 'https://www.youtube.com/watch?v=chPhlsHoEPo', type: 'video', description: 'Curso completo Python desde cero en español' },
    { title: 'Visualizador de código Python - PythonTutor', url: 'https://pythontutor.com/python-debugger.html', type: 'tool', description: 'Visualiza paso a paso cómo Python ejecuta tu código' },
    { title: 'El Zen de Python - Filosofía del lenguaje', url: 'https://peps.python.org/pep-0020/', type: 'article', description: 'Los 19 principios que guían el diseño de Python' }
  ],

  ai_lab_context: 'El alumno está en la Sesión 1 de Fundamentos de Programación. Acaba de aprender qué es programar, por qué se usa Python para IA, cómo usar print(), comentarios con #, y los tipos de errores básicos (SyntaxError, NameError, TypeError). No conoce aún variables, condicionales ni bucles.',
  ai_lab_suggested_prompt: 'Soy nuevo en Python y acabo de aprender print() y comentarios. ¿Puedes darme 5 ejercicios creativos usando solo print() y operaciones matemáticas básicas? Quiero practicar antes de pasar a variables.'
},

// ============================================================
// SESION 2: Variables y Tipos de Datos
// ============================================================
{
  number: 2,
  title: 'Variables y Tipos de Datos',
  video_url: 'https://www.youtube.com/watch?v=TbcEqkabAWU',
  estimated_duration_minutes: 50,
  theory_markdown: `# Sesión 2: Variables y Tipos de Datos

## ¿Qué es una variable?

Una variable es una caja con nombre donde guardas información. Cuando dices \`edad = 25\`, estás diciéndole a Python: "crea una caja llamada 'edad' y guarda el número 25 dentro".

En IA, trabajarás constantemente con variables: temperatura de un sensor, nombre de un paciente, precio de una acción, resultado de una predicción. Entender variables es la base de todo lo demás.

\`\`\`python
# Crear variables (asignación)
nombre = "María García"
edad = 28
salario = 1850.50
es_activo = True

# Usar variables
print(nombre)   # María García
print(edad)     # 28
print(salario)  # 1850.5
print(es_activo) # True
\`\`\`

## Reglas para nombrar variables

| Regla | Correcto | Incorrecto |
|-------|----------|------------|
| Empezar con letra o _ | \`nombre\`, \`_privado\` | \`1nombre\`, \`@variable\` |
| Solo letras, números y _ | \`mi_variable\`, \`x1\` | \`mi-variable\`, \`mi variable\` |
| Case-sensitive | \`edad\` ≠ \`Edad\` ≠ \`EDAD\` | — |
| No usar palabras reservadas | \`mi_list\` | \`list\`, \`if\`, \`for\` |

**Convención Python (PEP 8):** usar \`snake_case\` para variables: \`precio_producto\`, \`nombre_cliente\`, \`total_ventas\`.

## Los 4 tipos de datos fundamentales

### 1. int — Números enteros

\`\`\`python
edad = 25
cantidad_estudiantes = 150
temperatura_celsius = -8
año_fundacion = 2024

# Operaciones
print(edad + 5)       # 30
print(cantidad_estudiantes * 2)  # 300
print(10 // 3)        # 3 (división entera)
print(10 % 3)         # 1 (módulo: residuo)
print(2 ** 10)        # 1024 (potencia)
\`\`\`

### 2. float — Números decimales

\`\`\`python
precio = 19.99
pi = 3.14159
porcentaje_precision = 0.94  # 94% de precisión del modelo

# Atención: precisión flotante
print(0.1 + 0.2)  # 0.30000000000000004 (¡no es 0.3!)
# Esto es normal en todos los lenguajes de programación
# Solución para dinero:
from decimal import Decimal
precio1 = Decimal('0.10')
precio2 = Decimal('0.20')
print(precio1 + precio2)  # 0.30 (exacto)
\`\`\`

### 3. str — Cadenas de texto

\`\`\`python
nombre = "Carlos"
apellido = 'Rodríguez'
mensaje = "Hola, ¿cómo estás?"
texto_largo = """Este texto
puede ocupar
múltiples líneas"""

# Concatenación (unir strings)
nombre_completo = nombre + " " + apellido
print(nombre_completo)  # Carlos Rodríguez

# f-strings: la forma moderna y preferida
print(f"Bienvenido, {nombre}. Tienes {edad} años.")
# Bienvenido, Carlos. Tienes 25 años.

# Longitud
print(len(nombre))  # 6
\`\`\`

### 4. bool — Valores lógicos

\`\`\`python
modelo_entrenado = True
tiene_error = False
es_mayor_de_edad = True

# Los booleanos son el resultado de comparaciones
print(5 > 3)     # True
print(10 == 10)  # True
print(7 < 2)     # False
print(5 != 3)    # True (distinto)
\`\`\`

## La función type()

Python te dice qué tipo tiene cualquier valor:

\`\`\`python
print(type(42))          # <class 'int'>
print(type(3.14))        # <class 'float'>
print(type("hola"))      # <class 'str'>
print(type(True))        # <class 'bool'>
print(type(None))        # <class 'NoneType'>
\`\`\`

**None** es especial: representa la ausencia de valor. Muy usado en IA cuando un dato no está disponible.

## Conversión de tipos (casting)

\`\`\`python
# String a número
edad_texto = "25"
edad_numero = int(edad_texto)
print(edad_numero + 5)  # 30

# Número a string
precio = 19.99
mensaje = "El precio es: " + str(precio)
print(mensaje)  # El precio es: 19.99

# int a float y viceversa
numero = 7
decimal = float(numero)   # 7.0
entero = int(3.9)         # 3 (¡trunca, no redondea!)
redondeado = round(3.9)   # 4

# Peligro: conversión inválida
# int("hola")  → ValueError: invalid literal
\`\`\`

## Variables múltiples y asignación

\`\`\`python
# Asignación múltiple en una línea
x, y, z = 1, 2, 3
print(x, y, z)  # 1 2 3

# Mismo valor a múltiples variables
a = b = c = 0

# Intercambiar valores (Python lo hace elegantemente)
a, b = 10, 20
a, b = b, a  # ¡Sin variable temporal!
print(a, b)   # 20 10
\`\`\`

## Variables en el contexto de IA

En un proyecto real de machine learning, tus variables se ven así:

\`\`\`python
# Configuración de un modelo de IA
nombre_modelo = "clasificador_spam"
version = "1.3.2"
tasa_aprendizaje = 0.001        # learning rate
num_epocas = 100                 # epochs
precision_entrenamiento = 0.956  # 95.6% accuracy
esta_entrenado = False           # aún no

print(f"Modelo: {nombre_modelo} v{version}")
print(f"Configuración: lr={tasa_aprendizaje}, épocas={num_epocas}")
print(f"Estado: {'Listo' if esta_entrenado else 'Pendiente de entrenamiento'}")
\`\`\`

## Errores comunes con variables

\`\`\`python
# Error 1: Usar variable antes de definirla
print(x)  # NameError: name 'x' is not defined

# Error 2: Olvidar que strings y números no se suman directamente
edad = 25
print("Tengo " + edad + " años")  # TypeError
# Corrección:
print("Tengo " + str(edad) + " años")  # OK
print(f"Tengo {edad} años")             # Mejor aún

# Error 3: Confundir = (asignación) con == (comparación)
x = 5      # Asigna 5 a x
x == 5     # Compara x con 5 (retorna True, pero no hace nada solo)
\`\`\`

## Buenas prácticas

1. **Nombres descriptivos**: \`precio_producto\` es mejor que \`p\`
2. **Una variable = un concepto**: no reutilices la misma variable para cosas distintas
3. **Constantes en MAYÚSCULAS**: \`PI = 3.14159\`, \`MAX_INTENTOS = 3\`
4. **Evita nombres de un solo carácter** (excepto en bucles: \`i\`, \`j\`, \`k\`)`,

  quiz: {
    title: 'Quiz S2 - Variables y Tipos de Datos',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Qué imprime este código?\n\nx = 10\ny = 3\nprint(x // y)\nprint(x % y)',
        options: JSON.stringify([
          { text: '3.33 y 1', is_correct: false },
          { text: '3 y 1', is_correct: true },
          { text: '4 y 1', is_correct: false },
          { text: '3 y 0', is_correct: false }
        ]),
        explanation: '// es división entera (floor division): 10 // 3 = 3 (descarta el decimal). % es el operador módulo que retorna el residuo: 10 % 3 = 1 (porque 10 = 3×3 + 1). Estos operadores son fundamentales en programación para iterar, paginar datos, y detectar números pares/impares.'
      },
      {
        question_text: '¿Cuál es el tipo de dato de la variable resultado?\n\nresultado = 7 > 3',
        options: JSON.stringify([
          { text: 'int, porque involucra números', is_correct: false },
          { text: 'str, porque el resultado es "True"', is_correct: false },
          { text: 'bool, porque es el resultado de una comparación', is_correct: true },
          { text: 'float, porque 7/3 da un decimal', is_correct: false }
        ]),
        explanation: 'Las comparaciones (>, <, ==, !=, >=, <=) siempre retornan un valor booleano: True o False. En este caso 7 > 3 es True. El tipo de "resultado" es bool. Esto es fundamental para las estructuras condicionales que veremos en la Sesión 5.'
      },
      {
        question_text: '¿Qué error produce este código y cómo se corrige?\n\nnombre = "Ana"\nedad = 30\nprint("Hola " + nombre + " tienes " + edad + " años")',
        options: JSON.stringify([
          { text: 'SyntaxError. Se corrige quitando las comillas del print', is_correct: false },
          { text: 'TypeError. Se corrige usando str(edad) o un f-string: f"Hola {nombre} tienes {edad} años"', is_correct: true },
          { text: 'NameError. La variable edad no está definida correctamente', is_correct: false },
          { text: 'No hay error, el código funciona correctamente', is_correct: false }
        ]),
        explanation: 'No puedes concatenar (sumar) un string con un int usando el operador +. Python no hace conversión automática. El TypeError dice: "can only concatenate str (not int) to str". La solución es str(edad) para convertir explícitamente, o mejor aún, usar f-strings: f"Hola {nombre} tienes {edad} años".'
      },
      {
        question_text: '¿Cuál de estos nombres de variable es INCORRECTO según las reglas de Python?',
        options: JSON.stringify([
          { text: '_variable_privada', is_correct: false },
          { text: 'mi_variable_1', is_correct: false },
          { text: '2da_variable', is_correct: true },
          { text: 'nombreCompleto', is_correct: false }
        ]),
        explanation: 'Los nombres de variables NO pueden empezar con un número. "2da_variable" es inválido porque empieza con "2". Los demás son válidos: _variable_privada empieza con guión bajo (válido), mi_variable_1 empieza con letra (válido), nombreCompleto usa camelCase (válido aunque en Python se prefiere snake_case).'
      },
      {
        question_text: '¿Qué valor tiene "x" al final de este código?\n\nx = 5\nx = x + 3\nx = x * 2',
        options: JSON.stringify([
          { text: '5', is_correct: false },
          { text: '16', is_correct: true },
          { text: '13', is_correct: false },
          { text: 'Error: no se puede reasignar una variable', is_correct: false }
        ]),
        explanation: 'Las variables en Python son reasignables. El proceso es: x comienza en 5 → x = 5 + 3 = 8 → x = 8 * 2 = 16. En cada línea, Python evalúa el lado derecho del = primero, luego asigna el resultado a x. Esto se llama "reasignación" y es completamente válido.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 2: Calculadora de Perfil IA',
    instructions_markdown: `## Ejercicio Práctico: Calculadora de Perfil IA

### Objetivo
Crear un programa que almacene datos de un "perfil de estudiante de IA" y calcule estadísticas básicas usando variables de diferentes tipos.

### Código base (completa las partes indicadas)

\`\`\`python
# ================================================
# CALCULADORA DE PERFIL IA
# ================================================

# --- PARTE 1: Define tus variables de perfil ---
nombre = ""           # Tu nombre (string)
edad = 0              # Tu edad (int)
ciudad = ""           # Tu ciudad (string)
horas_estudio = 0.0  # Horas de estudio por día (float)
tiene_experiencia = False  # ¿Tienes experiencia previa en programación? (bool)

# --- PARTE 2: Cálculos automáticos ---
horas_semana = horas_estudio * 7
horas_mes = horas_semana * 4
horas_para_graduar = 2400  # Estimado para dominar Python + IA básica

# Calcula cuántos meses faltan para graduarte
meses_restantes = horas_para_graduar / horas_mes  # Completa esta operación

# --- PARTE 3: Muestra el perfil ---
print("=" * 50)
print("PERFIL DE ESTUDIANTE IA - ITSEIA")
print("=" * 50)
print(f"Nombre: {nombre}")
print(f"Edad: {edad} años")
print(f"Ciudad: {ciudad}")
print(f"Tipo de nombre: {type(nombre)}")  # Verifica el tipo
print(f"Tipo de edad: {type(edad)}")

print()
print("--- PROYECCIÓN DE ESTUDIO ---")
print(f"Horas por día: {horas_estudio}")
print(f"Horas por semana: {horas_semana}")
print(f"Horas por mes: {horas_mes}")
print(f"Meses estimados para dominar el programa: {round(meses_restantes, 1)}")

print()
print("--- ESTADO ---")
nivel = "Intermedio" if tiene_experiencia else "Principiante"
print(f"Nivel de entrada: {nivel}")
print(f"¿Experiencia previa?: {tiene_experiencia}")

# --- PARTE 4 (RETO): Agrega 3 variables propias y muéstralas ---
# Ejemplo: lenguajes_previos, meta_profesional, empresa_objetivo
\`\`\`

### Requerimientos
- Completar TODOS los campos del perfil con datos reales tuyos
- Verificar que meses_restantes se calcule correctamente
- Añadir 3 variables propias en la Parte 4
- El programa debe ejecutar sin errores

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| Todos los campos del perfil completados | 25 pts |
| Cálculo de meses_restantes correcto | 25 pts |
| Tipos de datos correctos (int, float, str, bool) | 25 pts |
| 3 variables propias en Parte 4 | 25 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'Python Built-in Types - Documentación oficial', url: 'https://docs.python.org/es/3/library/stdtypes.html', type: 'documentation', description: 'Referencia completa de tipos de datos en Python' },
    { title: 'f-strings en Python - Tutorial PEP 498', url: 'https://peps.python.org/pep-0498/', type: 'article', description: 'Todo sobre f-strings, la forma moderna de formatear texto' },
    { title: 'Variables en Python - Píldoras Informáticas', url: 'https://www.youtube.com/watch?v=Mjfb5TuKUXo', type: 'video', description: 'Explicación visual de variables y tipos en español' },
    { title: 'Python Type Checker - mypy', url: 'https://mypy-lang.org/', type: 'tool', description: 'Herramienta para verificar tipos en Python' },
    { title: 'W3Schools Python Variables', url: 'https://www.w3schools.com/python/python_variables.asp', type: 'tutorial', description: 'Ejercicios interactivos sobre variables' }
  ],

  ai_lab_context: 'El alumno estudia variables y tipos de datos en Python. Conoce int, float, str, bool, None. Sabe usar print() y f-strings. Conoce type(), int(), str(), float(). Aún no conoce listas, diccionarios, condicionales ni bucles.',
  ai_lab_suggested_prompt: 'Estoy aprendiendo variables y tipos de datos en Python. Tengo este código: [pega tu código]. ¿Puedes explicarme qué tipo de dato tiene cada variable y si hay alguna forma de hacerlo más eficiente?'
},

// ============================================================
// SESION 3: Entrada y Salida de Datos
// ============================================================
{
  number: 3,
  title: 'Entrada y Salida de Datos (input/print)',
  video_url: 'https://www.youtube.com/watch?v=HGOBQPFzWKo',
  estimated_duration_minutes: 45,
  theory_markdown: `# Sesión 3: Entrada y Salida de Datos

## ¿Por qué es importante la E/S?

Todo programa útil hace dos cosas: recibe información del mundo exterior (entrada) y comunica resultados (salida). Sin E/S, un programa vive en una burbuja. En IA, los datos de entrada son el combustible del modelo: imágenes, textos, números de sensores. La salida es la predicción, clasificación o respuesta del modelo.

## La función input()

\`input()\` detiene el programa y espera a que el usuario escriba algo. Lo que escribe se guarda como **string**.

\`\`\`python
# Forma básica
nombre = input("¿Cuál es tu nombre? ")
print(f"Hola, {nombre}!")

# IMPORTANTE: input() SIEMPRE retorna un string
edad = input("¿Cuántos años tienes? ")
print(type(edad))   # <class 'str'>  ← es texto, no número
\`\`\`

## Conversión de input a números

Cuando necesitas hacer operaciones matemáticas con lo que ingresa el usuario, debes convertirlo:

\`\`\`python
# Sin conversión (ERROR)
edad = input("Edad: ")
año_nacimiento = 2025 - edad  # TypeError!

# Con conversión correcta
edad = int(input("Edad: "))
año_nacimiento = 2025 - edad  # Funciona
print(f"Naciste en {año_nacimiento}")

# Para decimales
precio = float(input("Precio del producto: $"))
iva = precio * 0.12
print(f"IVA (12%): \${iva:.2f}")
print(f"Total: \${precio + iva:.2f}")
\`\`\`

## Formatos avanzados de print()

### El operador :.2f (formato de decimales)

\`\`\`python
pi = 3.14159265
print(f"{pi:.2f}")   # 3.14  (2 decimales)
print(f"{pi:.4f}")   # 3.1416 (4 decimales)
print(f"{pi:.0f}")   # 3  (sin decimales)

precio = 1500.0
print(f"\${precio:,.2f}")   # $1,500.00 (con separador de miles)
\`\`\`

### Alineación y relleno

\`\`\`python
# Tabla bien alineada
productos = [("Laptop", 1200), ("Mouse", 25), ("Teclado", 45)]
print(f"{'Producto':<15} {'Precio':>10}")
print("-" * 26)
for nombre, precio in productos:
    print(f"{nombre:<15} \${precio:>9.2f}")

# Salida:
# Producto             Precio
# --------------------------
# Laptop           $1200.00
# Mouse              $25.00
# Teclado            $45.00
\`\`\`

### sep y end en print()

\`\`\`python
# sep: separador entre argumentos (default: espacio)
print("Python", "es", "genial", sep="-")  # Python-es-genial
print("A", "B", "C", sep=", ")            # A, B, C

# end: qué poner al final (default: salto de línea)
print("Cargando", end="")
print("...", end="")
print(" Listo!")
# Salida: Cargando... Listo!  (todo en una línea)
\`\`\`

## Validación básica de entrada

En IA y software real, los datos de entrada son sucios. Aprende a validar desde el principio:

\`\`\`python
# Validación simple con try/except (adelanto de Sesión 14)
while True:
    try:
        edad = int(input("Ingresa tu edad (número entero): "))
        if edad < 0 or edad > 120:
            print("Por favor ingresa una edad válida (0-120)")
        else:
            break  # Salir del bucle si el dato es válido
    except ValueError:
        print("Error: debes ingresar un número, no texto")

print(f"Edad registrada: {edad} años")
\`\`\`

## Múltiples datos en una línea

\`\`\`python
# El usuario ingresa: "10 20 30"
numeros = input("Ingresa 3 números separados por espacio: ")
lista = numeros.split()  # ["10", "20", "30"]
a, b, c = int(lista[0]), int(lista[1]), int(lista[2])
print(f"Suma: {a + b + c}")

# Forma más elegante con map()
a, b, c = map(int, input("Ingresa 3 números: ").split())
print(f"Promedio: {(a + b + c) / 3:.2f}")
\`\`\`

## Programa completo: Calculadora IMC

\`\`\`python
# Índice de Masa Corporal - programa real de salud
print("=== CALCULADORA DE IMC ===")
print()

nombre = input("Nombre del paciente: ")
peso = float(input("Peso en kg: "))
altura = float(input("Altura en metros (ej: 1.75): "))

# Cálculo
imc = peso / (altura ** 2)

# Clasificación
if imc < 18.5:
    categoria = "Bajo peso"
elif imc < 25:
    categoria = "Peso normal"
elif imc < 30:
    categoria = "Sobrepeso"
else:
    categoria = "Obesidad"

# Reporte
print()
print("=" * 35)
print(f"REPORTE DE SALUD - {nombre.upper()}")
print("=" * 35)
print(f"Peso: {peso} kg")
print(f"Altura: {altura} m")
print(f"IMC: {imc:.1f}")
print(f"Categoría: {categoria}")
\`\`\`

## Errores comunes con input

\`\`\`python
# Error 1: Olvidar convertir el tipo
nota = input("Nota: ")
if nota >= 7:  # TypeError: '>=' not supported between 'str' and 'int'
    print("Aprobado")
# Corrección: nota = float(input("Nota: "))

# Error 2: No manejar cuando el usuario ingresa texto donde se espera número
# Solución: usar try/except (Sesión 14)

# Error 3: Concatenar en lugar de sumar
a = int(input("Primer número: "))
b = int(input("Segundo número: "))
# NUNCA hagas: input1 + input2 sin convertir primero
\`\`\`

## E/S en el contexto de IA

En proyectos reales de IA, los datos no vienen de \`input()\` sino de archivos, APIs y bases de datos. Pero el concepto es el mismo:

\`\`\`python
# En producción, así se "ingresa" data a un modelo
import json

# Entrada: datos de un paciente (simula una API)
datos_paciente = {
    "nombre": "Ana López",
    "edad": 45,
    "presion_sistolica": 145,
    "colesterol": 210
}

# El modelo procesa y "sale" una predicción
riesgo_cardiovascular = datos_paciente["presion_sistolica"] / 120 * 0.6
print(f"Riesgo estimado para {datos_paciente['nombre']}: {riesgo_cardiovascular:.1%}")
\`\`\``,

  quiz: {
    title: 'Quiz S3 - Entrada y Salida de Datos',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Cuál es la salida de este código si el usuario escribe "25"?\n\nvalor = input("Número: ")\nprint(type(valor))',
        options: JSON.stringify([
          { text: "<class 'int'>", is_correct: false },
          { text: "<class 'str'>", is_correct: true },
          { text: "<class 'float'>", is_correct: false },
          { text: "<class 'number'>", is_correct: false }
        ]),
        explanation: 'input() SIEMPRE retorna un string, sin importar qué escriba el usuario. Aunque el usuario escriba "25", Python lo guarda como la cadena de texto "25", no como el número 25. Para usarlo como número debes convertirlo: int(input("Número: ")) o float(input("Número: ")).'
      },
      {
        question_text: '¿Qué imprime este código?\n\npi = 3.14159\nprint(f"{pi:.2f}")',
        options: JSON.stringify([
          { text: '3.14159', is_correct: false },
          { text: '3.14', is_correct: true },
          { text: '3.1', is_correct: false },
          { text: 'Error de formato', is_correct: false }
        ]),
        explanation: 'El especificador de formato :.2f dentro de un f-string significa: mostrar el número con exactamente 2 decimales. pi = 3.14159 se redondea a 2 decimales → 3.14. El "f" en :.2f indica formato flotante (float). Este formato es esencial para mostrar precios, porcentajes y métricas de modelos IA.'
      },
      {
        question_text: '¿Qué hace print("A", "B", "C", sep="-")?',
        options: JSON.stringify([
          { text: 'Imprime "A-B-C" en una sola línea', is_correct: true },
          { text: 'Imprime "A", "B", "C" en líneas separadas', is_correct: false },
          { text: 'Error: sep no es un parámetro válido de print', is_correct: false },
          { text: 'Imprime "ABC" sin separadores', is_correct: false }
        ]),
        explanation: 'El parámetro sep en print() define el separador entre los argumentos. Por defecto es un espacio. Con sep="-", Python pone un guión entre cada argumento. El resultado es "A-B-C". Útil para generar CSVs, códigos separados, fechas en formato "2024-03-15", etc.'
      },
      {
        question_text: 'Un usuario escribe "abc" cuando el programa espera un número entero con int(input()). ¿Qué ocurre?',
        options: JSON.stringify([
          { text: 'Python convierte "abc" a 0 automáticamente', is_correct: false },
          { text: 'Python ignora el input y continúa', is_correct: false },
          { text: 'Se lanza un ValueError porque "abc" no puede convertirse a int', is_correct: true },
          { text: 'Se lanza un TypeError porque input devuelve string', is_correct: false }
        ]),
        explanation: 'Cuando intentas convertir un string no numérico a int, Python lanza ValueError: "invalid literal for int() with base 10: \'abc\'". Esto es diferente a TypeError (que sería tipos incompatibles). Para manejar esto correctamente se usa try/except ValueError, que aprenderemos en la Sesión 14.'
      },
      {
        question_text: 'El usuario escribe "10 20 30". ¿Qué valor tiene "b" después de:\na, b, c = map(int, input().split())',
        options: JSON.stringify([
          { text: '"20" (string)', is_correct: false },
          { text: '20 (int)', is_correct: true },
          { text: 'Error: no se puede usar map con input', is_correct: false },
          { text: '[10, 20, 30] (lista)', is_correct: false }
        ]),
        explanation: 'Aquí pasan 3 cosas en cadena: 1) input() recibe "10 20 30" como string. 2) .split() divide por espacios → ["10", "20", "30"]. 3) map(int, ...) aplica int() a cada elemento → [10, 20, 30]. 4) a, b, c = desempaqueta los valores. b recibe el segundo: 20 (int). Línea muy usada en programación competitiva y scripts de IA.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 3: Mini-Sistema de Registro',
    instructions_markdown: `## Ejercicio Práctico: Mini-Sistema de Registro de Estudiantes

### Objetivo
Construir un programa interactivo que reciba datos de un estudiante, los procese y genere un reporte formateado profesionalmente.

### Código base

\`\`\`python
# ================================================
# SISTEMA DE REGISTRO - ITSEIA
# ================================================

print("=" * 45)
print("    REGISTRO DE NUEVO ESTUDIANTE - ITSEIA")
print("=" * 45)
print()

# --- PARTE 1: Captura de datos ---
nombre = input("Nombre completo: ")
cedula = input("Número de cédula: ")
email = input("Correo electrónico: ")

# Convierte correctamente (agrega conversión de tipo donde sea necesario)
edad = input("Edad: ")           # ← Convierte a int
# COMPLETA: captura ciudad, carrera elegida, y horas disponibles por semana (float)

# --- PARTE 2: Cálculos ---
# Semestres en la carrera
num_semestres = 5
horas_por_semana = 0  # Usa la variable que capturaste
# COMPLETA: calcula total_horas_carrera = horas_por_semana * 20 semanas * num_semestres

# --- PARTE 3: Reporte formateado ---
print()
print("=" * 45)
print("        COMPROBANTE DE REGISTRO")
print("=" * 45)
print(f"{'Nombre:':<20} {nombre}")
print(f"{'Cédula:':<20} {cedula}")
print(f"{'Email:':<20} {email}")
print(f"{'Edad:':<20} {edad} años")
# COMPLETA: imprime ciudad y carrera con el mismo formato alineado

print()
print("--- PROYECCIÓN ACADÉMICA ---")
# COMPLETA: imprime horas por semana, total de horas en la carrera
print(f"Inversión estimada:  \${num_semestres * 220:,.2f}")  # $220/mes por 5 meses

print()
print("Registro completado exitosamente.")
print(f"Bienvenido/a al futuro, {nombre.split()[0]}!")
\`\`\`

### Requerimientos adicionales
1. Agrega validación: si la edad ingresada es menor a 15 o mayor a 80, muestra "Edad fuera del rango permitido"
2. Muestra el nombre en mayúsculas en el comprobante
3. El email debe contener "@" — agrega una verificación con: if "@" in email

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| Conversiones de tipo correctas | 20 pts |
| Captura de todos los campos requeridos | 20 pts |
| Cálculo de total_horas_carrera correcto | 20 pts |
| Reporte formateado y alineado | 20 pts |
| Validaciones de edad y email | 20 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'input() - Documentación Python oficial', url: 'https://docs.python.org/es/3/library/functions.html#input', type: 'documentation', description: 'Referencia completa de la función input()' },
    { title: 'Formateo de strings en Python - PyFormat', url: 'https://pyformat.info/', type: 'tutorial', description: 'Guía visual completa de formatos de string' },
    { title: 'Tutorial input y print - Programación ATS', url: 'https://www.youtube.com/watch?v=I6J_KJe2wGo', type: 'video', description: 'Video tutorial en español sobre E/S en Python' },
    { title: 'Replit - Editor Python online', url: 'https://replit.com/languages/python3', type: 'tool', description: 'Editor online para practicar Python con input()' },
    { title: 'Python String Formatting - Real Python', url: 'https://realpython.com/python-f-strings/', type: 'article', description: 'Guía completa de f-strings con ejemplos' }
  ],

  ai_lab_context: 'Sesión 3: el alumno aprendió input() (siempre retorna str), conversión de tipos con int()/float(), formatos de print con f-strings y :.2f, parámetros sep y end, y validación básica. Puede crear programas interactivos simples.',
  ai_lab_suggested_prompt: 'Estoy aprendiendo input() y print() en Python. ¿Puedes ayudarme a crear un programa que pida 5 calificaciones al usuario, calcule el promedio, y diga si aprobó o no? Quiero que el output sea bonito y bien formateado.'
},

// ============================================================
// SESION 4: Operadores y Expresiones
// ============================================================
{
  number: 4,
  title: 'Operadores y Expresiones',
  video_url: 'https://www.youtube.com/watch?v=XKHEtdqhLK8',
  estimated_duration_minutes: 50,
  theory_markdown: `# Sesión 4: Operadores y Expresiones

## ¿Qué es un operador?

Un operador es un símbolo que le dice a Python qué operación realizar. Las expresiones combinan valores, variables y operadores para producir un resultado. En IA, los operadores matemáticos calculan pérdidas, tasas de aprendizaje, distancias entre vectores y mucho más.

## Operadores Aritméticos

| Operador | Nombre | Ejemplo | Resultado |
|----------|--------|---------|-----------|
| \`+\` | Suma | \`7 + 3\` | \`10\` |
| \`-\` | Resta | \`7 - 3\` | \`4\` |
| \`*\` | Multiplicación | \`7 * 3\` | \`21\` |
| \`/\` | División (float) | \`7 / 3\` | \`2.333...\` |
| \`//\` | División entera | \`7 // 3\` | \`2\` |
| \`%\` | Módulo (residuo) | \`7 % 3\` | \`1\` |
| \`**\` | Potencia | \`7 ** 2\` | \`49\` |

\`\`\`python
# Ejemplos prácticos
precio = 150.00
descuento = 0.20
precio_final = precio * (1 - descuento)
print(f"Precio con 20% descuento: \${precio_final:.2f}")  # $120.00

# Verificar si un número es par o impar (módulo)
for numero in [1, 2, 3, 4, 5]:
    if numero % 2 == 0:
        print(f"{numero} es par")
    else:
        print(f"{numero} es impar")

# Potencias en IA: función de activación ReLU simple
x = -3
relu = max(0, x)   # max() retorna el mayor de dos valores
print(f"ReLU({x}) = {relu}")   # 0
\`\`\`

## Operadores de Comparación

Retornan siempre True o False:

\`\`\`python
a, b = 10, 20

print(a == b)   # False (igualdad)
print(a != b)   # True (desigualdad)
print(a < b)    # True (menor que)
print(a > b)    # False (mayor que)
print(a <= 10)  # True (menor o igual)
print(a >= 10)  # True (mayor o igual)

# Comparación de strings (lexicográfica)
print("apple" < "banana")  # True (a antes que b en alfabeto)
print("Python" == "python") # False (case-sensitive)
\`\`\`

## Operadores Lógicos

Combinan condiciones:

\`\`\`python
edad = 22
tiene_diploma = True
tiene_trabajo = False

# and: ambas condiciones deben ser True
puede_postular = (edad >= 18) and tiene_diploma
print(puede_postular)  # True

# or: al menos una condición debe ser True
necesita_apoyo = not tiene_diploma or not tiene_trabajo
print(necesita_apoyo)  # True

# not: invierte el valor
print(not True)   # False
print(not False)  # True

# Ejemplo real de IA: ¿el dato es válido para el modelo?
temperatura = 36.5
es_valido = (temperatura >= 35.0) and (temperatura <= 42.0)
print(f"Temperatura válida para el modelo: {es_valido}")
\`\`\`

## Tabla de verdad

| A | B | A and B | A or B | not A |
|---|---|---------|--------|-------|
| True | True | True | True | False |
| True | False | False | True | False |
| False | True | False | True | True |
| False | False | False | False | True |

## Operadores de Asignación Compuesta

Shortcuts para operaciones comunes:

\`\`\`python
# Forma larga vs. corta
x = 10

x = x + 5    # igual a:   x += 5     → x = 15
x = x - 3    # igual a:   x -= 3     → x = 12
x = x * 2    # igual a:   x *= 2     → x = 24
x = x / 4    # igual a:   x /= 4     → x = 6.0
x = x ** 2   # igual a:   x **= 2    → x = 36.0
x = x % 7   # igual a:   x %= 7     → x = 1.0

# Uso común: acumuladores
total = 0
for venta in [100, 250, 75, 320]:
    total += venta   # Mucho más limpio que: total = total + venta
print(f"Total ventas: \${total}")  # $745
\`\`\`

## Precedencia de operadores

Python sigue las mismas reglas que matemáticas (PEMDAS/BODMAS):

\`\`\`python
# Sin paréntesis: Python aplica precedencia
resultado = 2 + 3 * 4    # 14 (no 20)
resultado = (2 + 3) * 4  # 20 (paréntesis primero)

# Orden: () → ** → * / // % → + -
print(2 + 3 * 4 ** 2)    # 2 + 3 * 16 = 2 + 48 = 50
print((2 + 3) * 4 ** 2)  # 5 * 16 = 80

# Regla de oro: ante la duda, usa paréntesis
# Hacen el código más legible Y evitan errores
imc = peso / (altura ** 2)  # Correcto
imc = peso / altura ** 2    # Mismo resultado, pero menos claro
\`\`\`

## Operadores de Identidad y Membresía

\`\`\`python
# is: verifica si son el MISMO objeto en memoria (no solo igual valor)
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)   # True (mismo contenido)
print(a is b)   # False (objetos diferentes en memoria)
print(a is c)   # True (c apunta al mismo objeto que a)

# Regla: usa == para comparar valores, is solo para None
resultado = None
if resultado is None:
    print("No hay resultado todavía")

# in: verifica si un elemento está en una secuencia
frutas = ["manzana", "pera", "uva"]
print("pera" in frutas)      # True
print("piña" in frutas)      # False
print("piña" not in frutas)  # True

# Muy útil en IA para verificar categorías
categorias_validas = ["spam", "no_spam"]
prediccion = "spam"
if prediccion in categorias_validas:
    print(f"Predicción válida: {prediccion}")
\`\`\`

## Expresiones complejas en IA

\`\`\`python
# Error cuadrático medio (MSE) - métrica fundamental en ML
predicciones = [3.5, 4.2, 2.8, 5.1]
valores_reales = [3.0, 4.5, 3.0, 5.0]

# Calcula MSE manualmente
n = len(predicciones)
suma_errores = 0
for i in range(n):
    error = predicciones[i] - valores_reales[i]
    suma_errores += error ** 2

mse = suma_errores / n
print(f"Error cuadrático medio: {mse:.4f}")

# Precisión de un modelo (accuracy)
predicciones_ok = 85
total_predicciones = 100
accuracy = predicciones_ok / total_predicciones
print(f"Accuracy del modelo: {accuracy:.1%}")  # 85.0%
\`\`\`

## Errores comunes con operadores

\`\`\`python
# Error 1: Confundir = con ==
x = 5
if x = 5:      # SyntaxError: invalid syntax
    print("cinco")
# Correcto: if x == 5:

# Error 2: División entre cero
denominador = 0
resultado = 10 / denominador  # ZeroDivisionError

# Error 3: Concatenar string con número
print("Total: " + 100)  # TypeError
# Correcto: print("Total: " + str(100)) o print(f"Total: {100}")

# Error 4: Comparar tipos incompatibles
print("5" == 5)   # False (string vs int, no da error pero nunca será True)
print("5" > 3)    # TypeError en Python 3
\`\`\``,

  quiz: {
    title: 'Quiz S4 - Operadores y Expresiones',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Cuál es el resultado de: 2 + 3 * 4 ** 2 - 1?',
        options: JSON.stringify([
          { text: '97', is_correct: false },
          { text: '49', is_correct: true },
          { text: '51', is_correct: false },
          { text: '23', is_correct: false }
        ]),
        explanation: 'Se aplica la precedencia: primero ** → 4**2 = 16. Luego * → 3*16 = 48. Luego de izquierda a derecha: + → 2+48 = 50. Finalmente - → 50-1 = 49. La precedencia es: ** > * / // % > + -. Siempre que tengas dudas, usa paréntesis para aclarar tu intención.'
      },
      {
        question_text: '¿Qué operador usarías para verificar si un número es divisible por 5?',
        options: JSON.stringify([
          { text: 'numero // 5 == 0', is_correct: false },
          { text: 'numero % 5 == 0', is_correct: true },
          { text: 'numero / 5 == 0', is_correct: false },
          { text: 'numero ** 5 == 0', is_correct: false }
        ]),
        explanation: 'El operador módulo % retorna el residuo de la división. Si numero % 5 == 0, no hay residuo, lo que significa que numero es exactamente divisible por 5. Ejemplos: 10 % 5 = 0 (sí), 7 % 5 = 2 (no). Este patrón es fundamental: número % n == 0 verifica divisibilidad por n.'
      },
      {
        question_text: '¿Cuál es el resultado de: True and False or True?',
        options: JSON.stringify([
          { text: 'False', is_correct: false },
          { text: 'True', is_correct: true },
          { text: 'Error de sintaxis', is_correct: false },
          { text: 'None', is_correct: false }
        ]),
        explanation: 'Precedencia lógica: "not" > "and" > "or". Primero se evalúa "and": True and False = False. Luego "or": False or True = True. Resultado: True. Para evitar confusiones, escríbelo con paréntesis: (True and False) or True, que deja claro el orden de evaluación.'
      },
      {
        question_text: '¿Qué hace x += 5 cuando x = 10?',
        options: JSON.stringify([
          { text: 'Crea una nueva variable x con valor 5', is_correct: false },
          { text: 'Compara x con 5 y retorna True', is_correct: false },
          { text: 'Equivale a x = x + 5, dejando x en 15', is_correct: true },
          { text: 'Error: += no es un operador válido en Python', is_correct: false }
        ]),
        explanation: '+= es el operador de asignación aumentada. x += 5 es exactamente igual a x = x + 5. Python evalúa el lado derecho (x + 5 = 10 + 5 = 15) y lo asigna a x. Los operadores de asignación compuesta (+=, -=, *=, /=, **=, %=) son atajos que hacen el código más legible y son estándar en Python profesional.'
      },
      {
        question_text: '¿Cuándo se debe usar "is" en lugar de "==" para comparar?',
        options: JSON.stringify([
          { text: 'Siempre, porque "is" es más rápido que "=="', is_correct: false },
          { text: 'Para comparar números grandes con más precisión', is_correct: false },
          { text: 'Principalmente para verificar si un valor es None (if resultado is None)', is_correct: true },
          { text: 'Para comparar strings que pueden ser iguales', is_correct: false }
        ]),
        explanation: '"is" verifica identidad de objeto (mismo lugar en memoria), no igualdad de valor. Dos listas [1,2,3] == [1,2,3] es True, pero [1,2,3] is [1,2,3] es False (objetos distintos). La única excepción recomendada es comparar con None: if x is None (nunca if x == None). Python garantiza que None es un singleton (único objeto en memoria).'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 4: Calculadora de Métricas IA',
    instructions_markdown: `## Ejercicio Práctico: Calculadora de Métricas de Modelo IA

### Objetivo
Aplicar operadores matemáticos y lógicos para calcular las métricas más importantes de evaluación de modelos de Machine Learning.

### Contexto
En IA, después de entrenar un modelo, necesitamos medir qué tan bien funciona. Las métricas más comunes son: Accuracy, Precisión, Recall y F1-Score. Hoy las calcularás usando solo operadores aritméticos.

### Código base

\`\`\`python
# ================================================
# CALCULADORA DE MÉTRICAS DE MODELO IA
# ================================================

print("Ingresa los resultados de tu modelo:")
print()

# Matriz de confusión (conceptos de ML)
# VP = Verdaderos Positivos (predijo spam, era spam)
# VN = Verdaderos Negativos (predijo no-spam, no era spam)
# FP = Falsos Positivos (predijo spam, pero NO era spam)
# FN = Falsos Negativos (predijo no-spam, pero SÍ era spam)

vp = int(input("Verdaderos Positivos (VP): "))
vn = int(input("Verdaderos Negativos (VN): "))
fp = int(input("Falsos Positivos (FP): "))
fn = int(input("Falsos Negativos (FN): "))

# --- PARTE 1: Calcula las métricas ---
total = vp + vn + fp + fn

# COMPLETA: accuracy = (vp + vn) / total
accuracy = 0  # ← Completa aquí

# COMPLETA: precision = vp / (vp + fp)
# Ojo: si vp + fp == 0, precision = 0 (evita división por cero)
precision = 0  # ← Completa aquí

# COMPLETA: recall = vp / (vp + fn)
recall = 0  # ← Completa aquí

# COMPLETA: f1 = 2 * (precision * recall) / (precision + recall)
# Ojo: si precision + recall == 0, f1 = 0
f1 = 0  # ← Completa aquí

# --- PARTE 2: Reporte ---
print()
print("=" * 40)
print("   REPORTE DE EVALUACIÓN DEL MODELO")
print("=" * 40)
print(f"{'Total de predicciones:':<25} {total}")
print(f"{'Accuracy:':<25} {accuracy:.1%}")
print(f"{'Precisión:':<25} {precision:.1%}")
print(f"{'Recall:':<25} {recall:.1%}")
print(f"{'F1-Score:':<25} {f1:.1%}")

# --- PARTE 3: Evaluación automática ---
print()
if accuracy >= 0.90:
    calidad = "EXCELENTE"
elif accuracy >= 0.80:
    calidad = "BUENO"
elif accuracy >= 0.70:
    calidad = "ACEPTABLE"
else:
    calidad = "NECESITA MEJORA"

print(f"Evaluación del modelo: {calidad}")
print(f"¿Listo para producción?: {'SÍ' if accuracy >= 0.85 and f1 >= 0.80 else 'NO'}")
\`\`\`

### Datos de prueba para verificar
Usa: VP=85, VN=90, FP=10, FN=15
- Accuracy esperado: 87.5%
- Precisión esperada: 89.5%
- Recall esperado: 85.0%
- F1 esperado: 87.2%

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| Las 4 métricas calculadas correctamente | 40 pts |
| Manejo de división por cero | 20 pts |
| Formato de reporte correcto con % | 20 pts |
| Evaluación automática funciona | 20 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'Operadores Python - Documentación oficial', url: 'https://docs.python.org/es/3/reference/expressions.html#operator-precedence', type: 'documentation', description: 'Tabla completa de precedencia de operadores' },
    { title: 'Métricas de evaluación ML - Google ML Course', url: 'https://developers.google.com/machine-learning/crash-course/classification/accuracy', type: 'article', description: 'Accuracy, Precision, Recall explicados por Google' },
    { title: 'Operadores Python - MitoCode', url: 'https://www.youtube.com/watch?v=XKHEtdqhLK8', type: 'video', description: 'Tutorial completo de operadores en español' },
    { title: 'Python Calculator - Online', url: 'https://www.online-python.com/', type: 'tool', description: 'Consola Python online para probar expresiones' },
    { title: 'Precision y Recall explicados visualmente', url: 'https://mlu-explain.github.io/precision-recall/', type: 'article', description: 'Visualización interactiva de métricas ML' }
  ],

  ai_lab_context: 'Sesión 4: el alumno aprendió operadores aritméticos (+,-,*,/,//,%,**), de comparación (==,!=,<,>,<=,>=), lógicos (and, or, not), de asignación compuesta (+=,-=,*=,/=), de identidad (is, is not) y membresía (in, not in). Conoce la precedencia de operadores.',
  ai_lab_suggested_prompt: 'Aprendí los operadores de Python. ¿Puedes darme 3 problemas matemáticos que involucren al menos 4 operadores diferentes cada uno, con su solución paso a paso? Quiero practicar la precedencia de operadores.'
},

];

// ============================================================
// FUNCION PARA ELIMINAR SESIONES EXISTENTES Y CARGAR NUEVAS
// ============================================================

async function deleteExistingSessions() {
  console.log('Eliminando sesiones existentes del subject...');

  // Obtener sesiones existentes
  const res = await fetch(`${BASE}/sessions?subject_id=eq.${SUBJECT_ID}&select=id`, {
    headers: H
  });
  const sessions = await res.json();

  if (!Array.isArray(sessions) || sessions.length === 0) {
    console.log('No hay sesiones existentes para eliminar.');
    return;
  }

  console.log(`Encontradas \${sessions.length} sesiones para eliminar.`);

  for (const session of sessions) {
    const delRes = await fetch(`${BASE}/sessions?id=eq.${session.id}`, {
      method: 'DELETE',
      headers: Hmin
    });
    if (delRes.status >= 200 && delRes.status < 300) {
      process.stdout.write('.');
    } else {
      const err = await delRes.text();
      console.log(`\nError eliminando sesion ${session.id}: \${err.substring(0, 100)}`);
    }
  }
  console.log('\nSesiones eliminadas.');
}

async function loadSession(s) {
  // 1. Crear sesion
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
  let info = `  S\${s.number} "\${s.title.substring(0, 30)}"`;

  // 2. Quiz
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

  // 3. Assignment
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

  // 4. Resources
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

async function runFile(filename) {
  const { execSync } = require('child_process');
  const path = require('path');
  const fullPath = path.join(__dirname, filename);
  console.log(`\n--- Ejecutando \${filename} ---`);
  execSync(`node "\${fullPath}"`, { stdio: 'inherit' });
}

async function main() {
  console.log('=== CARGANDO FUNDAMENTOS DE PROGRAMACION (16 SESIONES) ===');
  console.log(`Subject ID: ${SUBJECT_ID}`);
  console.log();

  await deleteExistingSessions();

  console.log('\nCargando sesiones 1-4...');
  for (const session of SESSIONS) {
    try {
      await loadSession(session);
    } catch (e) {
      console.error(`  ERROR en S${session.number}: \${e.message}`);
    }
  }
  console.log('Sesiones 1-4 cargadas.');

  await runFile('load_pilot_fundamentos_s5_8.js');
  await runFile('load_pilot_fundamentos_s9_12.js');
  await runFile('load_pilot_fundamentos_s13_16.js');

  console.log('\n=== COMPLETADO: 16 sesiones de Fundamentos cargadas ===');
}

main().catch(e => console.error('Error fatal:', e));
