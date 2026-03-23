#!/usr/bin/env node
// load_pilot_fundamentos_s5_8.js
// Sesiones 5-8 de Fundamentos de Programacion

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
// SESION 5: Estructuras Condicionales
// ============================================================
{
  number: 5,
  title: 'Estructuras Condicionales (if/elif/else)',
  video_url: 'https://www.youtube.com/watch?v=7RnqxUKMUdY',
  estimated_duration_minutes: 55,
  theory_markdown: `# Sesión 5: Estructuras Condicionales (if/elif/else)

## ¿Qué son las condicionales?

Las condicionales permiten que tu programa tome decisiones. "Si el cliente tiene más de 1000 puntos, aplica descuento. Si no, cobra precio normal." Esta capacidad de bifurcar la ejecución es lo que da inteligencia a los programas.

En IA, los árboles de decisión (Decision Trees) son literalmente una cadena de condicionales. Cada nodo del árbol es un "if/else". Dominar las condicionales es dominar la lógica de la IA.

## Sintaxis básica

\`\`\`python
# REGLA CRÍTICA: Python usa INDENTACIÓN (sangría) para definir bloques
# 4 espacios es el estándar (nunca mezcles tabs y espacios)

temperatura = 38.5

if temperatura > 37.5:
    print("Fiebre detectada")
    print("Consultar médico")

# Si la condición es False, el bloque se salta completamente
\`\`\`

## if / else

\`\`\`python
nota = float(input("Ingresa tu nota (0-10): "))

if nota >= 7:
    print("APROBADO")
    print(f"Tu nota fue: {nota}")
else:
    print("REPROBADO")
    print(f"Necesitas al menos 7. Obtuviste: {nota}")

# Siempre se ejecuta uno u otro, nunca ambos
\`\`\`

## if / elif / else (múltiples condiciones)

\`\`\`python
calificacion = float(input("Calificación (0-100): "))

if calificacion >= 90:
    letra = "A"
    mensaje = "Excelente"
elif calificacion >= 80:
    letra = "B"
    mensaje = "Muy bueno"
elif calificacion >= 70:
    letra = "C"
    mensaje = "Bueno"
elif calificacion >= 60:
    letra = "D"
    mensaje = "Suficiente"
else:
    letra = "F"
    mensaje = "Insuficiente"

print(f"Calificación: {letra} - {mensaje}")
\`\`\`

**IMPORTANTE:** Python evalúa las condiciones en orden. Cuando una es True, ejecuta ese bloque y salta el resto. El orden importa.

## Condicionales anidadas

\`\`\`python
# Un sistema de acceso con doble verificación
usuario = input("Usuario: ")
clave = input("Contraseña: ")

if usuario == "admin":
    if clave == "python123":
        print("Acceso completo concedido")
        print("Bienvenido al panel de administración")
    else:
        print("Contraseña incorrecta para admin")
elif usuario == "estudiante":
    if clave == "itseia2026":
        print("Acceso de estudiante concedido")
    else:
        print("Contraseña incorrecta")
else:
    print(f"Usuario '{usuario}' no existe")
\`\`\`

## El operador ternario (condicional en una línea)

\`\`\`python
# Forma larga
if edad >= 18:
    estado = "mayor de edad"
else:
    estado = "menor de edad"

# Forma corta (ternario): valor_si_true if condicion else valor_si_false
estado = "mayor de edad" if edad >= 18 else "menor de edad"
print(estado)

# Muy usado en IA para etiquetas
prediccion = 0.73
etiqueta = "SPAM" if prediccion > 0.5 else "NO SPAM"
print(f"Predicción: {prediccion:.0%} → {etiqueta}")
\`\`\`

## Condiciones compuestas con and / or

\`\`\`python
# Sistema de préstamo bancario
ingresos = float(input("Ingresos mensuales: $"))
historial = input("Historial crediticio (bueno/malo): ").lower()
edad = int(input("Edad: "))

# Puede obtener el préstamo si:
# - Ingresos > $800 Y historial bueno Y entre 18-65 años
puede_prestamo = (
    ingresos > 800 and
    historial == "bueno" and
    18 <= edad <= 65  # ¡Python permite este encadenamiento!
)

if puede_prestamo:
    monto_max = ingresos * 10
    print(f"APROBADO. Monto máximo: \${monto_max:,.2f}")
else:
    print("No califica en este momento")

    # Diagnóstico específico
    if ingresos <= 800:
        print("→ Ingresos insuficientes (mínimo $800)")
    if historial != "bueno":
        print("→ Mejorar historial crediticio")
    if not (18 <= edad <= 65):
        print("→ Fuera del rango de edad (18-65)")
\`\`\`

## Condicionales con strings y listas

\`\`\`python
# Verificar membresía con 'in'
email = input("Email: ").lower()
dominios_permitidos = ["gmail.com", "hotmail.com", "itseia.ai"]

# Obtener el dominio
dominio = email.split("@")[-1] if "@" in email else ""

if dominio in dominios_permitidos:
    print("Email válido")
elif dominio == "":
    print("Email inválido: falta el símbolo @")
else:
    print(f"Dominio '{dominio}' no permitido")
\`\`\`

## Condicionales en IA: Árbol de decisión simple

\`\`\`python
# Clasificador de riesgo de diabetes (simplificado)
edad = int(input("Edad: "))
imc = float(input("IMC: "))
glucosa = int(input("Glucosa en ayunas (mg/dL): "))
historial_familiar = input("Historial familiar diabetes (s/n): ").lower() == "s"

# Árbol de decisión manual
if glucosa >= 126:
    riesgo = "ALTO"
    razon = "Glucosa en rango diabético"
elif glucosa >= 100:
    if imc >= 30 or historial_familiar:
        riesgo = "ALTO"
        razon = "Prediabetes + factores de riesgo"
    else:
        riesgo = "MODERADO"
        razon = "Glucosa elevada, monitorear"
elif imc >= 30 and edad >= 45:
    riesgo = "MODERADO"
    razon = "Obesidad + edad avanzada"
else:
    riesgo = "BAJO"
    razon = "Sin factores de riesgo significativos"

print(f"\\nEvaluación de riesgo: {riesgo}")
print(f"Razón: {razon}")
print("(Este es solo un ejercicio educativo, no diagnóstico médico)")
\`\`\`

## Errores comunes con condicionales

\`\`\`python
# Error 1: Olvidar el ':' al final del if
if x > 5      # SyntaxError: expected ':'
    print(x)

# Error 2: Indentación incorrecta
if x > 5:
print(x)     # IndentationError: expected an indented block

# Error 3: Comparar con = en lugar de ==
if x = 5:    # SyntaxError
    print(x)

# Error 4: Comparar strings con mayúsculas incorrectas
respuesta = input("¿Continuar? (s/n): ")
if respuesta == "S" or respuesta == "s":  # Funciona pero es repetitivo
    pass
# Mejor:
if respuesta.lower() == "s":
    pass

# Error 5: Else sin if correspondiente
else:         # SyntaxError: invalid syntax
    print("x")
\`\`\`

## Buenas prácticas

\`\`\`python
# MALO: condición negada innecesariamente
if not (edad < 18):
    print("Mayor de edad")

# BUENO: más legible
if edad >= 18:
    print("Mayor de edad")

# MALO: comparar booleano con True/False
if es_activo == True:
    print("Activo")

# BUENO: los booleanos son condiciones por sí mismos
if es_activo:
    print("Activo")
\`\`\``,

  quiz: {
    title: 'Quiz S5 - Condicionales',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Qué imprime este código si x = 15?\n\nif x > 20:\n    print("grande")\nelif x > 10:\n    print("mediano")\nelif x > 5:\n    print("pequeño")\nelse:\n    print("muy pequeño")',
        options: JSON.stringify([
          { text: 'grande', is_correct: false },
          { text: 'mediano', is_correct: true },
          { text: 'pequeño', is_correct: false },
          { text: 'mediano y pequeño', is_correct: false }
        ]),
        explanation: 'Python evalúa las condiciones en orden. x=15: ¿15>20? No. ¿15>10? SÍ → imprime "mediano" y sale del bloque. Aunque x>5 también es True, nunca se evalúa porque ya encontró la primera condición verdadera y ejecutó ese bloque. Solo se imprime UNA sección en un if/elif/else.'
      },
      {
        question_text: '¿Qué error produce este código?\n\nedge = 8\nif edge > 5:\nprint("mayor")',
        options: JSON.stringify([
          { text: 'SyntaxError por falta de ":"', is_correct: false },
          { text: 'IndentationError: el print debe estar indentado dentro del if', is_correct: true },
          { text: 'NameError: edge no está definida', is_correct: false },
          { text: 'No hay error, funciona correctamente', is_correct: false }
        ]),
        explanation: 'En Python, la indentación (sangría) NO es opcional: define la estructura del código. Después de un if:, todo el bloque que pertenece a ese if debe estar indentado (4 espacios). El print sin indentación genera IndentationError: "expected an indented block after if statement".'
      },
      {
        question_text: '¿Cuál es la forma más correcta de escribir esto en Python?\n\nif es_premium == True:\n    aplicar_descuento()',
        options: JSON.stringify([
          { text: 'if es_premium == True: (está bien así)', is_correct: false },
          { text: 'if es_premium is True: (usar is para booleanos)', is_correct: false },
          { text: 'if es_premium: (los booleanos son condiciones por sí mismos)', is_correct: true },
          { text: 'if bool(es_premium) == True: (conversión explícita)', is_correct: false }
        ]),
        explanation: 'En Python, comparar un booleano con == True es redundante. Una variable booleana ya ES una condición: if es_premium: es equivalente y más limpio. Las guías de estilo PEP8 de Python prohíben explícitamente comparar booleanos con True/False usando ==.'
      },
      {
        question_text: '¿Qué hace este operador ternario?\nresultado = "aprobado" if nota >= 7 else "reprobado"',
        options: JSON.stringify([
          { text: 'Asigna "aprobado" a resultado siempre', is_correct: false },
          { text: 'Asigna "aprobado" si nota >= 7, "reprobado" en caso contrario', is_correct: true },
          { text: 'Imprime "aprobado" o "reprobado" según la nota', is_correct: false },
          { text: 'Error: no es sintaxis válida de Python', is_correct: false }
        ]),
        explanation: 'El operador ternario tiene la forma: valor_si_true if condicion else valor_si_false. Si nota >= 7 es True, resultado = "aprobado". Si es False, resultado = "reprobado". No imprime nada por sí solo, solo asigna. Es equivalente a un if/else completo pero en una sola línea.'
      },
      {
        question_text: '¿Cuántas veces se imprime algo con este código si edad = 17?\n\nif edad >= 18:\n    print("mayor")\nif edad < 20:\n    print("joven")\nif edad > 15:\n    print("adolescente")',
        options: JSON.stringify([
          { text: '0 veces', is_correct: false },
          { text: '1 vez', is_correct: false },
          { text: '2 veces', is_correct: true },
          { text: '3 veces', is_correct: false }
        ]),
        explanation: 'Son 3 declaraciones if INDEPENDIENTES (no elif). Python evalúa CADA una. edad=17: ¿17>=18? No → no imprime. ¿17<20? Sí → imprime "joven". ¿17>15? Sí → imprime "adolescente". Resultado: 2 impresiones. Si fueran elif, solo imprimiría la primera verdadera. La diferencia entre if/if/if y if/elif/elif es crucial.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 5: Sistema de Admisión ITSEIA',
    instructions_markdown: `## Ejercicio Práctico: Sistema de Admisión ITSEIA

### Objetivo
Construir un sistema de evaluación de postulantes que use condicionales para determinar admisión, beca, y carrera recomendada.

### Código base

\`\`\`python
# ================================================
# SISTEMA DE ADMISION ITSEIA 2026
# ================================================

print("=" * 50)
print("   EVALUACION DE POSTULANTE - ITSEIA 2026")
print("=" * 50)
print()

# --- Captura de datos ---
nombre = input("Nombre completo: ")
nota_bachillerato = float(input("Promedio bachillerato (0-10): "))
nota_examen = float(input("Puntaje examen de admisión (0-100): "))
carrera_elegida = input("Carrera elegida (IA/Datos/BigData): ").upper()
anios_experiencia = int(input("Años de experiencia en tecnología (0 si ninguna): "))
necesita_beca = input("¿Solicita beca? (s/n): ").lower() == "s"
ingresos_familia = float(input("Ingreso familiar mensual ($): ")) if necesita_beca else 0

# --- PARTE 1: Calcular puntaje total ---
# Puntaje = nota_bachillerato*20% + nota_examen*60% + experiencia_bonus*20%
# experiencia_bonus: 0 años = 0, 1-2 años = 50, 3+ años = 100
# COMPLETA el cálculo de experiencia_bonus y puntaje_total
experiencia_bonus = 0  # Completa con condicional
puntaje_total = 0      # Completa la fórmula

# --- PARTE 2: Decisión de admisión ---
# Aprobado si puntaje_total >= 60 Y nota_bachillerato >= 6
# COMPLETA la lógica de admision, mensaje_admision

# --- PARTE 3: Carrera válida ---
carreras_validas = ["IA", "DATOS", "BIGDATA"]
if carrera_elegida not in carreras_validas:
    print(f"Carrera '{carrera_elegida}' no existe. Opciones: {carreras_validas}")
    exit()

# Requisito especial por carrera
if carrera_elegida == "IA":
    requisito_minimo = 70
elif carrera_elegida == "DATOS":
    requisito_minimo = 65
else:  # BIGDATA
    requisito_minimo = 60

cumple_carrera = puntaje_total >= requisito_minimo

# --- PARTE 4: Beca ---
# Beca completa: necesita_beca Y ingresos < $500 Y puntaje >= 75
# Beca parcial 50%: necesita_beca Y ingresos < $1000 Y puntaje >= 65
# COMPLETA la lógica de beca
tipo_beca = "Sin beca"  # Completa con condicionales

# --- PARTE 5: Reporte final ---
print()
print("=" * 50)
print("        RESULTADO DE ADMISIÓN")
print("=" * 50)
print(f"Postulante: {nombre}")
print(f"Carrera: {carrera_elegida}")
print(f"Puntaje total: {puntaje_total:.1f}/100")
print()
# COMPLETA: imprime admisión, cumplimiento requisito carrera, y beca
\`\`\`

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| experiencia_bonus calculado correctamente | 15 pts |
| puntaje_total con fórmula correcta | 15 pts |
| Lógica de admisión con and | 20 pts |
| Requisito mínimo por carrera | 20 pts |
| Lógica de beca (dos niveles) | 20 pts |
| Reporte final completo y formateado | 10 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'Control flow Python - Documentación oficial', url: 'https://docs.python.org/es/3/tutorial/controlflow.html', type: 'documentation', description: 'Tutorial oficial de if/elif/else' },
    { title: 'Decision Trees en IA - Google ML', url: 'https://developers.google.com/machine-learning/decision-forests/decision-trees', type: 'article', description: 'Cómo los condicionales se convierten en árboles de decisión' },
    { title: 'Condicionales Python - Programacion ATS', url: 'https://www.youtube.com/watch?v=7RnqxUKMUdY', type: 'video', description: 'Tutorial if/elif/else en español' },
    { title: 'Python Visualizer - indentación', url: 'https://pythontutor.com', type: 'tool', description: 'Visualiza cómo Python navega los bloques condicionales' },
    { title: 'PEP8 - Guía de estilo Python', url: 'https://peps.python.org/pep-0008/', type: 'article', description: 'Guía oficial de buenas prácticas de código Python' }
  ],

  ai_lab_context: 'Sesión 5: el alumno aprendió if/elif/else, condicionales anidadas, operador ternario, condiciones compuestas con and/or/not, y operadores in/not in. Puede tomar decisiones en sus programas. Conoce indentación obligatoria de Python.',
  ai_lab_suggested_prompt: 'Estoy aprendiendo condicionales en Python. Quiero hacer un sistema de clasificación de datos para un modelo IA. ¿Puedes ayudarme a crear un clasificador simple que tome un número y determine en qué "rango" cae (muy bajo, bajo, normal, alto, muy alto)? Quiero entender cuándo usar elif vs múltiples if.'
},

// ============================================================
// SESION 6: Bucles For
// ============================================================
{
  number: 6,
  title: 'Bucles For',
  video_url: 'https://www.youtube.com/watch?v=G8jBOhSZpTk',
  estimated_duration_minutes: 55,
  theory_markdown: `# Sesión 6: Bucles For

## ¿Qué es un bucle?

Un bucle repite un bloque de código. Sin bucles, procesar 1 millón de datos requeriría 1 millón de líneas de código. Con un bucle, requiere 3. En Machine Learning, los bucles iteran sobre epochs de entrenamiento, lotes de datos (batches) y capas de redes neuronales.

## El bucle for con range()

\`\`\`python
# range(n): genera números de 0 a n-1
for i in range(5):
    print(i)
# Imprime: 0 1 2 3 4

# range(inicio, fin): de inicio a fin-1
for i in range(1, 6):
    print(i)
# Imprime: 1 2 3 4 5

# range(inicio, fin, paso): con incremento personalizado
for i in range(0, 20, 5):
    print(i)
# Imprime: 0 5 10 15

# Countdown (paso negativo)
for i in range(5, 0, -1):
    print(i)
# Imprime: 5 4 3 2 1
\`\`\`

## Iterar sobre listas y strings

\`\`\`python
# Lista de frutas
frutas = ["manzana", "pera", "uva", "mango"]
for fruta in frutas:
    print(f"Fruta: {fruta.upper()}")

# String carácter por carácter
palabra = "Python"
for letra in palabra:
    print(letra, end="-")
# P-y-t-h-o-n-

# Iterar con índice usando enumerate()
for indice, fruta in enumerate(frutas):
    print(f"{indice}: {fruta}")
# 0: manzana
# 1: pera
# ...

# enumerate con inicio personalizado
for num, fruta in enumerate(frutas, start=1):
    print(f"{num}. {fruta}")
\`\`\`

## Acumuladores: el patrón más importante

\`\`\`python
# Suma acumulativa (patrón fundamental)
ventas = [1200, 850, 2100, 600, 1800, 950]
total = 0
maximo = ventas[0]
minimo = ventas[0]

for venta in ventas:
    total += venta
    if venta > maximo:
        maximo = venta
    if venta < minimo:
        minimo = venta

promedio = total / len(ventas)
print(f"Total: \${total:,}")
print(f"Promedio: \${promedio:,.2f}")
print(f"Máximo: \${maximo:,}")
print(f"Mínimo: \${minimo:,}")
\`\`\`

## break y continue

\`\`\`python
# break: detiene el bucle completamente
print("Buscando primer número negativo:")
datos = [5, 12, 3, -4, 8, -1, 7]
for dato in datos:
    if dato < 0:
        print(f"Encontrado: {dato}")
        break
    print(f"  {dato} es positivo")

# continue: salta la iteración actual y continúa
print("\\nSolo números pares:")
for n in range(1, 11):
    if n % 2 != 0:
        continue  # Salta impares
    print(n)

# else en for: se ejecuta si el bucle terminó SIN break
for n in range(2, 10):
    if 10 % n == 0 and n != 10:
        print(f"10 es divisible por {n}")
        break
else:
    print("No se encontró divisor")
\`\`\`

## List comprehensions: Python elegante

\`\`\`python
# Forma tradicional
cuadrados = []
for n in range(1, 6):
    cuadrados.append(n ** 2)
# [1, 4, 9, 16, 25]

# List comprehension (mucho más pythónico)
cuadrados = [n ** 2 for n in range(1, 6)]
print(cuadrados)  # [1, 4, 9, 16, 25]

# Con condicional
pares = [n for n in range(1, 20) if n % 2 == 0]
print(pares)  # [2, 4, 6, 8, 10, 12, 14, 16, 18]

# Transformar lista de strings
nombres = ["  ana  ", "  CARLOS  ", "  maría  "]
limpios = [n.strip().title() for n in nombres]
print(limpios)  # ['Ana', 'Carlos', 'María']

# En IA: normalizar datos
datos_raw = [150, 80, 200, 50, 175]
dato_max = max(datos_raw)
dato_min = min(datos_raw)
normalizados = [(x - dato_min) / (dato_max - dato_min) for x in datos_raw]
print(normalizados)  # Valores entre 0 y 1
\`\`\`

## Bucles for anidados

\`\`\`python
# Tabla de multiplicar
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i*j:3}", end="")
    print()  # Nueva línea

# Matriz (lista de listas) - base de álgebra lineal en IA
matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for fila in matriz:
    for elemento in fila:
        print(f"{elemento:3}", end="")
    print()
\`\`\`

## Bucle for en IA: epoch de entrenamiento

\`\`\`python
# Simulación de entrenamiento de un modelo
import random
random.seed(42)

print("Simulando entrenamiento de red neuronal...")
print("-" * 40)

perdida = 2.5      # Loss inicial alta
precision = 0.40   # Accuracy inicial baja

for epoch in range(1, 11):  # 10 epochs
    # Simulación de mejora gradual con ruido
    mejora_perdida = random.uniform(0.1, 0.3)
    mejora_precision = random.uniform(0.03, 0.07)

    perdida = max(0.01, perdida - mejora_perdida)
    precision = min(0.99, precision + mejora_precision)

    print(f"Epoch {epoch:2}/10 | Loss: {perdida:.4f} | Accuracy: {precision:.1%}")

    if precision >= 0.95:
        print(f"\\n¡Convergencia alcanzada en epoch {epoch}!")
        break
else:
    print("\\nEntrenamiento completado (10 epochs)")

print(f"\\nModelo final: Loss={perdida:.4f}, Accuracy={precision:.1%}")
\`\`\`

## Errores comunes con for

\`\`\`python
# Error 1: Modificar una lista mientras la iteras
lista = [1, 2, 3, 4, 5]
for x in lista:
    if x % 2 == 0:
        lista.remove(x)  # ¡PELIGROSO! Comportamiento inesperado
# Correcto: itera sobre una copia
for x in lista[:]:
    if x % 2 == 0:
        lista.remove(x)

# Error 2: Confundir el índice con el valor
frutas = ["manzana", "pera"]
for i in frutas:  # i es la fruta, no el índice
    print(frutas[i])  # TypeError: list indices must be integers

# Error 3: range() no incluye el último número
for i in range(5):
    pass  # i llega hasta 4, no hasta 5
\`\`\``,

  quiz: {
    title: 'Quiz S6 - Bucles For',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Cuántas veces se ejecuta el print en este código?\n\nfor i in range(2, 10, 3):\n    print(i)',
        options: JSON.stringify([
          { text: '8 veces', is_correct: false },
          { text: '3 veces (imprime 2, 5, 8)', is_correct: true },
          { text: '4 veces (imprime 2, 5, 8, 11)', is_correct: false },
          { text: '2 veces', is_correct: false }
        ]),
        explanation: 'range(2, 10, 3) genera: comienza en 2, avanza de 3 en 3, se detiene ANTES de llegar a 10. Los valores son: 2 (2+3=5), 5 (5+3=8), 8 (8+3=11, ya >= 10, para). Total: 3 iteraciones imprimiendo 2, 5, 8. El valor 10 nunca se incluye porque range siempre excluye el límite superior.'
      },
      {
        question_text: '¿Qué hace "continue" dentro de un bucle for?',
        options: JSON.stringify([
          { text: 'Detiene completamente el bucle', is_correct: false },
          { text: 'Salta el resto de la iteración actual y pasa a la siguiente', is_correct: true },
          { text: 'Sale de la función donde está el bucle', is_correct: false },
          { text: 'Reinicia el bucle desde el principio', is_correct: false }
        ]),
        explanation: '"continue" salta el resto del bloque de la iteración ACTUAL y avanza a la siguiente iteración. "break" es quien detiene el bucle completamente. Ejemplo: en un for de 1 a 10, si en i=5 ejecutas continue, el código después del continue no corre para i=5, pero el bucle continúa con i=6, 7, 8, 9, 10.'
      },
      {
        question_text: '¿Qué contiene la lista "resultado" después de ejecutar esto?\n\nresultado = [x**2 for x in range(4)]',
        options: JSON.stringify([
          { text: '[1, 4, 9, 16]', is_correct: false },
          { text: '[0, 1, 4, 9]', is_correct: true },
          { text: '[0, 1, 2, 3]', is_correct: false },
          { text: '[1, 2, 3, 4]', is_correct: false }
        ]),
        explanation: 'range(4) genera [0, 1, 2, 3]. La list comprehension aplica x**2 a cada elemento: 0²=0, 1²=1, 2²=4, 3²=9. Resultado: [0, 1, 4, 9]. Nota: range(4) va de 0 a 3, NO de 1 a 4. Esta es una confusión muy común: range(n) genera n números empezando en 0.'
      },
      {
        question_text: '¿Qué hace enumerate(lista) en un for?',
        options: JSON.stringify([
          { text: 'Ordena la lista antes de iterar', is_correct: false },
          { text: 'Convierte la lista en un diccionario', is_correct: false },
          { text: 'Permite acceder al índice Y al valor en cada iteración', is_correct: true },
          { text: 'Cuenta el número de elementos de la lista', is_correct: false }
        ]),
        explanation: 'enumerate() transforma la lista en pares (índice, valor). Con "for i, valor in enumerate(lista):", i es el índice (0, 1, 2...) y valor es el elemento. Es la forma correcta cuando necesitas AMBOS. Alternativa incorrecta: "for i in range(len(lista)): valor = lista[i]" funciona pero es menos pythónico.'
      },
      {
        question_text: 'Un modelo necesita procesar 1000 imágenes. ¿Cuál es el código correcto para procesar solo las primeras 5 para prueba?',
        options: JSON.stringify([
          { text: 'for imagen in imagenes[0:5]:', is_correct: true },
          { text: 'for imagen in imagenes until 5:', is_correct: false },
          { text: 'for imagen in imagenes where count < 5:', is_correct: false },
          { text: 'for imagen in imagenes, limit=5:', is_correct: false }
        ]),
        explanation: 'Python usa slicing (rebanado) para tomar una porción de una lista: lista[inicio:fin]. imagenes[0:5] retorna los primeros 5 elementos (índices 0,1,2,3,4). También puedes escribirlo como imagenes[:5] (el 0 es implícito). No existe "until", "where" ni "limit" como palabras clave en el bucle for de Python.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 6: Analizador de Dataset',
    instructions_markdown: `## Ejercicio Práctico: Analizador de Dataset con Bucles For

### Objetivo
Usar bucles for para analizar un conjunto de datos de estudiantes y calcular estadísticas que se usarían en un sistema de IA educativa.

### Código base

\`\`\`python
# ================================================
# ANALIZADOR DE DATASET - ITSEIA
# ================================================

# Dataset: notas de 10 estudiantes en 3 materias
# [nombre, nota_python, nota_matematicas, nota_estadistica]
estudiantes = [
    ["Ana García", 8.5, 9.0, 7.5],
    ["Carlos López", 6.0, 5.5, 6.5],
    ["María Torres", 9.5, 8.5, 9.0],
    ["Pedro Ruiz", 7.0, 7.5, 8.0],
    ["Sofía Mendoza", 5.5, 6.0, 5.0],
    ["Luis Herrera", 8.0, 8.5, 7.0],
    ["Carmen Vega", 4.5, 5.0, 4.0],
    ["Diego Castro", 9.0, 7.0, 8.5],
    ["Valeria Mora", 7.5, 9.5, 8.0],
    ["Andrés Silva", 6.5, 6.0, 7.0],
]

# --- PARTE 1: Calcular promedio de cada estudiante ---
print("=" * 60)
print(f"{'NOMBRE':<20} {'PYTHON':>8} {'MATE':>8} {'EST':>8} {'PROM':>8} {'ESTADO':>10}")
print("=" * 60)

aprobados = 0
reprobados = 0
suma_promedios = 0

for nombre, python, mate, estadistica in estudiantes:
    # COMPLETA: calcula el promedio del estudiante
    promedio = 0  # promedio de las 3 notas
    estado = "Aprobado" if promedio >= 7 else "Reprobado"

    # COMPLETA: actualiza los contadores
    # suma_promedios += promedio
    # aprobados o reprobados += 1

    print(f"{nombre:<20} {python:>8.1f} {mate:>8.1f} {estadistica:>8.1f} {promedio:>8.2f} {estado:>10}")

# --- PARTE 2: Estadísticas generales ---
# COMPLETA el cálculo
promedio_clase = 0  # suma_promedios / total_estudiantes

print("=" * 60)
print(f"Promedio de la clase: {promedio_clase:.2f}")
print(f"Aprobados: {aprobados} | Reprobados: {reprobados}")

# --- PARTE 3: Top 3 estudiantes (con list comprehension) ---
# Crea una lista de (promedio, nombre) para poder ordenar
promedios_lista = []
for nombre, python, mate, estadistica in estudiantes:
    prom = (python + mate + estadistica) / 3
    promedios_lista.append((prom, nombre))

# Ordena de mayor a menor
promedios_lista.sort(reverse=True)

print("\\nTOP 3 ESTUDIANTES:")
for posicion, (prom, nombre) in enumerate(promedios_lista[:3], start=1):
    print(f"  {posicion}. {nombre}: {prom:.2f}")

# --- PARTE 4 (RETO): Usa list comprehension ---
# Crea una lista con solo los nombres de estudiantes con promedio >= 8
# COMPLETA: destacados = [...]
\`\`\`

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| Cálculo de promedio individual correcto | 25 pts |
| Contadores aprobados/reprobados funcionan | 20 pts |
| Promedio de la clase correcto | 20 pts |
| Top 3 ordenado correctamente | 20 pts |
| List comprehension de destacados (reto) | 15 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'For loops - Python oficial', url: 'https://docs.python.org/es/3/tutorial/controlflow.html#for-statements', type: 'documentation', description: 'Documentación oficial del bucle for' },
    { title: 'List Comprehensions - Real Python', url: 'https://realpython.com/list-comprehension-python/', type: 'article', description: 'Guía completa de list comprehensions' },
    { title: 'Bucle for Python - Brais Moure', url: 'https://www.youtube.com/watch?v=G8jBOhSZpTk', type: 'video', description: 'Tutorial for loops en español con ejemplos' },
    { title: 'Visualizador de bucles - PythonTutor', url: 'https://pythontutor.com/python-debugger.html', type: 'tool', description: 'Visualiza paso a paso la ejecución de bucles' },
    { title: 'Kaggle Python Course - Loops', url: 'https://www.kaggle.com/learn/python', type: 'tutorial', description: 'Curso gratuito de Python con datasets reales' }
  ],

  ai_lab_context: 'Sesión 6: el alumno aprendió bucles for con range(), iteración sobre listas y strings, enumerate(), acumuladores, break/continue, list comprehensions, bucles anidados, y la conexión con epochs de entrenamiento en ML.',
  ai_lab_suggested_prompt: 'Tengo una lista de 20 temperaturas de un sensor. Quiero usar un bucle for para: 1) calcular el promedio, 2) encontrar la temperatura máxima y mínima, y 3) contar cuántas están por encima del promedio. ¿Puedes guiarme paso a paso?'
},

// ============================================================
// SESION 7: Bucles While
// ============================================================
{
  number: 7,
  title: 'Bucles While',
  video_url: 'https://www.youtube.com/watch?v=cOS1Lnjb4Fo',
  estimated_duration_minutes: 50,
  theory_markdown: `# Sesión 7: Bucles While

## While vs For: ¿cuándo usar cada uno?

| Bucle | Cuándo usarlo | Ejemplo |
|-------|---------------|---------|
| \`for\` | Sabes exactamente cuántas iteraciones necesitas | Procesar 100 imágenes |
| \`while\` | Iteras hasta que se cumpla una condición | Esperar hasta que el modelo converja |

En IA, el \`while\` es fundamental para el entrenamiento: "sigue entrenando MIENTRAS la pérdida no converja".

## Sintaxis básica

\`\`\`python
# while condicion:
#     bloque (se repite mientras condicion sea True)

contador = 0
while contador < 5:
    print(f"Vuelta {contador}")
    contador += 1  # ¡CRÍTICO! Sin esto → bucle infinito

print("Terminado")
# Vuelta 0, Vuelta 1, Vuelta 2, Vuelta 3, Vuelta 4
\`\`\`

## Validación de entrada con while

El caso de uso más común en programas interactivos:

\`\`\`python
# Repetir hasta que el usuario ingrese un dato válido
while True:
    nota = float(input("Ingresa nota (0-10): "))
    if 0 <= nota <= 10:
        break  # Dato válido, salir del bucle
    print("Error: la nota debe estar entre 0 y 10")

print(f"Nota registrada: {nota}")

# Menú interactivo
print("\\n=== MENÚ ITSEIA ===")
while True:
    print("\\n1. Ver cursos")
    print("2. Ver precios")
    print("3. Contactar")
    print("0. Salir")

    opcion = input("Opción: ")

    if opcion == "1":
        print("Cursos: IA, Ciencia de Datos, Big Data")
    elif opcion == "2":
        print("Matrícula: $180 | Pensión: $220/mes")
    elif opcion == "3":
        print("WhatsApp: +593 95 989 2034")
    elif opcion == "0":
        print("¡Hasta luego!")
        break
    else:
        print("Opción no válida")
\`\`\`

## While con contador manual

\`\`\`python
# Contador de intentos (muy usado en seguridad y IA)
MAX_INTENTOS = 3
intentos = 0
clave_correcta = "python2026"

while intentos < MAX_INTENTOS:
    clave = input(f"Contraseña (intento {intentos+1}/{MAX_INTENTOS}): ")

    if clave == clave_correcta:
        print("Acceso concedido")
        break
    else:
        intentos += 1
        restantes = MAX_INTENTOS - intentos
        if restantes > 0:
            print(f"Incorrecto. {restantes} intento(s) restante(s).")
else:
    print("Cuenta bloqueada. Demasiados intentos fallidos.")
\`\`\`

## Bucle while en algoritmos numéricos

\`\`\`python
# Algoritmo de descenso por gradiente (concepto fundamental de ML)
# Encuentra el mínimo de la función f(x) = (x - 3)^2

def f(x):
    return (x - 3) ** 2

def derivada_f(x):
    return 2 * (x - 3)

# Parámetros
x = 10.0            # Punto inicial
tasa_aprendizaje = 0.1  # Learning rate
tolerancia = 0.0001  # Convergencia cuando cambio < tolerancia
iteracion = 0
max_iter = 1000

print("Descenso por Gradiente:")
print(f"{'Iter':>5} {'x':>10} {'f(x)':>10}")

while iteracion < max_iter:
    x_anterior = x
    gradiente = derivada_f(x)
    x = x - tasa_aprendizaje * gradiente

    if iteracion % 10 == 0:  # Imprimir cada 10 iteraciones
        print(f"{iteracion:>5} {x:>10.4f} {f(x):>10.6f}")

    if abs(x - x_anterior) < tolerancia:
        print(f"\\nConvergencia en iteración {iteracion}")
        print(f"Mínimo encontrado: x = {x:.4f}, f(x) = {f(x):.6f}")
        break
    iteracion += 1
else:
    print("No convergió en el máximo de iteraciones")
\`\`\`

## Do-while en Python (no existe, pero se simula)

\`\`\`python
# Python no tiene do-while, pero se puede simular
# El bloque se ejecuta AL MENOS una vez

while True:
    respuesta = input("¿Continuar? (s/n): ").lower()
    if respuesta in ["s", "n"]:
        break
    print("Solo escribe 's' o 'n'")

if respuesta == "s":
    print("Continuando...")
else:
    print("Hasta luego")
\`\`\`

## Bucle infinito controlado con flag

\`\`\`python
# Flag (bandera): variable booleana que controla el bucle
sistema_activo = True
ciclos = 0

while sistema_activo:
    ciclos += 1
    print(f"Ciclo {ciclos}: procesando datos del sensor...")

    # Simular condición de parada
    if ciclos >= 5:
        print("Límite de ciclos alcanzado")
        sistema_activo = False  # Desactiva el flag

print(f"Sistema detenido después de {ciclos} ciclos")
\`\`\`

## While vs For: comparación directa

\`\`\`python
# La misma tarea con for y con while
numeros = [3, 7, 1, 9, 4, 6]

# CON FOR (cuando sabes cuántos elementos hay)
suma_for = 0
for n in numeros:
    suma_for += n
print(f"Suma (for): {suma_for}")

# CON WHILE (mismo resultado, pero más verboso)
suma_while = 0
i = 0
while i < len(numeros):
    suma_while += numeros[i]
    i += 1
print(f"Suma (while): {suma_while}")

# CONCLUSIÓN: para iterar listas, usa for. Para condiciones
# indefinidas (hasta que converja, hasta que el usuario salga), usa while.
\`\`\`

## Errores comunes con while

\`\`\`python
# Error 1: Bucle infinito (el más frecuente)
x = 0
while x < 10:
    print(x)
    # Olvidaste: x += 1  → corre para siempre

# Error 2: Condición que nunca es True
x = 15
while x < 10:  # Nunca se ejecuta
    print("esto nunca se imprime")

# Error 3: Usar break sin condición de salida
while True:
    dato = input("Dato: ")
    procesar(dato)
    # Olvidaste el break → bucle infinito

# Siempre pregúntate: ¿cómo termina este while?
\`\`\``,

  quiz: {
    title: 'Quiz S7 - Bucles While',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Qué imprime este código?\n\nx = 1\nwhile x < 50:\n    x *= 2\nprint(x)',
        options: JSON.stringify([
          { text: '32', is_correct: false },
          { text: '50', is_correct: false },
          { text: '64', is_correct: true },
          { text: 'Bucle infinito', is_correct: false }
        ]),
        explanation: 'x empieza en 1 y se duplica cada iteración: 1→2→4→8→16→32→64. Cuando x=32, ¿32<50? Sí, continúa. x=64. ¿64<50? No, sale del while. Imprime 64. El while se ejecuta mientras la condición sea True; cuando x llega a 64, la condición 64<50 es False y el bucle termina.'
      },
      {
        question_text: '¿Cuándo deberías preferir "while" sobre "for"?',
        options: JSON.stringify([
          { text: 'Siempre, porque while es más eficiente', is_correct: false },
          { text: 'Cuando no sabes de antemano cuántas iteraciones necesitas (ej: hasta que el usuario ingrese dato válido)', is_correct: true },
          { text: 'Solo cuando iteras listas de más de 100 elementos', is_correct: false },
          { text: 'Cuando necesitas el índice de cada elemento', is_correct: false }
        ]),
        explanation: '"for" es ideal cuando conoces el número de iteraciones (rango definido, lista con longitud conocida). "while" es ideal cuando la condición de parada depende de algo que ocurre durante la ejecución: input del usuario, convergencia de un modelo, tiempo transcurrido, estado de una conexión. No hay diferencia de eficiencia, es cuestión de legibilidad y corrección.'
      },
      {
        question_text: '¿Qué ocurre si olvidas incrementar el contador en un while?',
        options: JSON.stringify([
          { text: 'Python incrementa automáticamente el contador', is_correct: false },
          { text: 'El programa termina con un error de timeout', is_correct: false },
          { text: 'Se produce un bucle infinito que nunca termina', is_correct: true },
          { text: 'El while se ejecuta exactamente una vez', is_correct: false }
        ]),
        explanation: 'Si el contador nunca cambia, la condición del while siempre será True y el bucle nunca terminará: bucle infinito. En Jupyter/Colab puedes detenerlo con el botón Stop o Interrupt Kernel. En terminal: Ctrl+C. Esta es la causa #1 de programas "colgados" para principiantes. Siempre verifica: ¿qué modifica la condición del while?'
      },
      {
        question_text: '¿Qué hace el bloque "else" de un while?\n\nwhile condicion:\n    ...\nelse:\n    print("terminó")',
        options: JSON.stringify([
          { text: 'Se ejecuta cuando la condición del while es False desde el inicio', is_correct: false },
          { text: 'Se ejecuta siempre que el while termine normalmente (sin break)', is_correct: true },
          { text: 'Se ejecuta en caso de error dentro del while', is_correct: false },
          { text: 'Es inválido: while no puede tener else', is_correct: false }
        ]),
        explanation: 'En Python, tanto while como for pueden tener un bloque else. El else se ejecuta cuando el bucle termina SIN ser interrumpido por break. Si el bucle termina por break, el else NO se ejecuta. Es útil para búsquedas: if found → break (no ejecuta else), if not found → completa el bucle (ejecuta else que maneja "no encontrado").'
      },
      {
        question_text: '¿Cuál es la forma correcta de crear un menú que se repita hasta que el usuario elija "salir"?',
        options: JSON.stringify([
          { text: 'while opcion != "0": opcion = input("Opción: ")', is_correct: false },
          { text: 'while True: ... if opcion == "0": break', is_correct: true },
          { text: 'for opcion in menu: if opcion == "0": stop', is_correct: false },
          { text: 'repeat: ... until opcion == "0"', is_correct: false }
        ]),
        explanation: 'El patrón estándar para menús en Python es "while True: ... if condicion_salida: break". "while True" crea un bucle que solo termina con break. La opción incorrecta "while opcion != 0" fallaría porque opcion no está definida antes del while. Python no tiene "repeat/until" ni "stop". Este es el patrón que verás en producción.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 7: Simulador de Entrenamiento IA',
    instructions_markdown: `## Ejercicio Práctico: Simulador de Entrenamiento de Modelo IA

### Objetivo
Simular el proceso de entrenamiento de un modelo de Machine Learning usando bucle while, replicando conceptos reales como loss, accuracy, learning rate y convergencia.

### Código base

\`\`\`python
# ================================================
# SIMULADOR DE ENTRENAMIENTO - ITSEIA
# ================================================
import random
random.seed(42)

print("=" * 55)
print("   SIMULADOR DE ENTRENAMIENTO DE RED NEURONAL")
print("=" * 55)

# Configuración del entrenamiento
nombre_modelo = input("Nombre del modelo: ")
max_epochs = int(input("Máximo de epochs (ej: 50): "))
objetivo_accuracy = float(input("Accuracy objetivo (ej: 0.95): "))

# Valores iniciales
loss = random.uniform(2.0, 3.0)      # Loss inicial alta
accuracy = random.uniform(0.2, 0.4)  # Accuracy inicial baja
learning_rate = 0.1
epoch = 0
historial_loss = []
historial_acc = []

print(f"\\nIniciando entrenamiento de '{nombre_modelo}'...")
print(f"{'Epoch':>7} {'Loss':>10} {'Accuracy':>10} {'LR':>8} {'Estado':>12}")
print("-" * 55)

# --- PARTE 1: Bucle de entrenamiento ---
# Continúa mientras: epoch < max_epochs Y accuracy < objetivo
while epoch < max_epochs and accuracy < objetivo_accuracy:
    epoch += 1

    # Simular una epoch de entrenamiento (mejora con ruido)
    mejora_loss = random.uniform(0.05, 0.25) * learning_rate * 10
    mejora_acc = random.uniform(0.01, 0.05) * learning_rate * 10

    loss = max(0.001, loss - mejora_loss)
    accuracy = min(0.999, accuracy + mejora_acc)

    # Guardar historial
    historial_loss.append(round(loss, 4))
    historial_acc.append(round(accuracy, 4))

    # COMPLETA: cada 5 epochs, reduce el learning_rate a la mitad
    # if epoch % 5 == 0:
    #     learning_rate ...

    # Estado de la epoch
    if loss < 0.5:
        estado = "Excelente"
    elif loss < 1.0:
        estado = "Bueno"
    elif loss < 1.5:
        estado = "Regular"
    else:
        estado = "Inicial"

    print(f"{epoch:>7} {loss:>10.4f} {accuracy:>10.1%} {learning_rate:>8.4f} {estado:>12}")

# --- PARTE 2: Diagnóstico final ---
print("\\n" + "=" * 55)
if accuracy >= objetivo_accuracy:
    print(f"CONVERGENCIA ALCANZADA en epoch {epoch}")
else:
    print(f"NO CONVERGIÓ en {max_epochs} epochs")

print(f"\\nResumen del modelo '{nombre_modelo}':")
print(f"  Epochs ejecutadas: {epoch}")
print(f"  Loss final: {loss:.4f}")
print(f"  Accuracy final: {accuracy:.1%}")
print(f"  Accuracy objetivo: {objetivo_accuracy:.1%}")
print(f"  ¿Listo para deploy?: {'SÍ' if accuracy >= objetivo_accuracy else 'NO'}")

# --- PARTE 3 (RETO): Análisis del historial ---
# COMPLETA: calcula con bucle while o for
# - loss promedio de las últimas 5 epochs
# - mejor accuracy alcanzado
# - epoch en que se superó el 80% de accuracy por primera vez
\`\`\`

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| While con doble condición funciona | 20 pts |
| Historial guardado correctamente | 20 pts |
| Learning rate decay cada 5 epochs | 20 pts |
| Diagnóstico final correcto | 20 pts |
| Análisis del historial (reto) | 20 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'While loops - Python oficial', url: 'https://docs.python.org/es/3/reference/compound_stmts.html#while', type: 'documentation', description: 'Referencia oficial del bucle while' },
    { title: 'Gradient Descent explicado - 3Blue1Brown', url: 'https://www.youtube.com/watch?v=IHZwWFHWa-w', type: 'video', description: 'Visualización del descenso por gradiente' },
    { title: 'While loops Python - MitoCode', url: 'https://www.youtube.com/watch?v=cOS1Lnjb4Fo', type: 'video', description: 'Tutorial while en español' },
    { title: 'Jupyter Notebook - Interrumpir bucles infinitos', url: 'https://jupyter-notebook.readthedocs.io/en/stable/notebook.html#keyboard-shortcuts', type: 'article', description: 'Cómo detener un bucle infinito en Colab/Jupyter' },
    { title: 'Kaggle - Intro to ML', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', type: 'tutorial', description: 'Curso intro ML donde usarás bucles reales' }
  ],

  ai_lab_context: 'Sesión 7: el alumno aprendió while, diferencia con for, validación de entrada con while True/break, contador de intentos, descenso por gradiente simplificado, flag booleano, y el else del while. Puede crear menús y simulaciones.',
  ai_lab_suggested_prompt: 'Aprendí while en Python. ¿Puedes explicarme la diferencia entre un bucle infinito intencionado (while True con break) y uno accidental (bug)? Dame ejemplos de cuándo cada uno es apropiado en proyectos de IA.'
},

// ============================================================
// SESION 8: Funciones I
// ============================================================
{
  number: 8,
  title: 'Funciones I (def, parámetros, return)',
  video_url: 'https://www.youtube.com/watch?v=3Hs2bBd9Zy4',
  estimated_duration_minutes: 60,
  theory_markdown: `# Sesión 8: Funciones I — def, parámetros, return

## ¿Por qué usar funciones?

Una función es un bloque de código reutilizable con nombre. Sin funciones, copiarías el mismo código 50 veces. Con funciones, lo escribes una vez y lo llamas 50 veces.

En IA, cada paso del pipeline es una función: \`cargar_datos()\`, \`limpiar_datos()\`, \`entrenar_modelo()\`, \`evaluar_modelo()\`, \`predecir()\`. Las funciones son la arquitectura del software.

Beneficios:
- **DRY** (Don't Repeat Yourself): escribe una vez, usa siempre
- **Legibilidad**: un nombre de función comunica intención
- **Testabilidad**: puedes probar cada función independientemente
- **Mantenibilidad**: cambias la función y el cambio aplica en todos lados

## Definición básica

\`\`\`python
# def nombre_funcion(parametros):
#     """docstring: descripción de la función"""
#     bloque de código
#     return valor  (opcional)

def saludar():
    """Imprime un saludo simple."""
    print("¡Hola desde la función!")

# Llamar (invocar) la función
saludar()          # ¡Hola desde la función!
saludar()          # Puedes llamarla cuantas veces quieras
saludar()
\`\`\`

## Funciones con parámetros

\`\`\`python
def saludar_persona(nombre):
    """Saluda a una persona específica."""
    print(f"Hola, {nombre}! Bienvenido a ITSEIA.")

saludar_persona("Ana")     # Hola, Ana! ...
saludar_persona("Carlos")  # Hola, Carlos! ...

# Múltiples parámetros
def calcular_area_rectangulo(base, altura):
    """Calcula el área de un rectángulo."""
    area = base * altura
    return area  # La función devuelve el resultado

area = calcular_area_rectangulo(5, 3)
print(f"Área: {area} m²")   # Área: 15 m²

# También puedes usar el resultado directamente
print(calcular_area_rectangulo(10, 4))  # 40
\`\`\`

## La instrucción return

\`\`\`python
# return termina la función y devuelve un valor al llamador
def dividir(a, b):
    if b == 0:
        return None  # Retorna None si división por cero
    return a / b     # Retorna el resultado

resultado = dividir(10, 2)
print(resultado)     # 5.0

resultado = dividir(10, 0)
print(resultado)     # None

# Múltiples returns
def clasificar_temperatura(temp):
    """Clasifica temperatura corporal."""
    if temp < 35:
        return "hipotermia"
    elif temp < 37:
        return "normal"
    elif temp < 38.5:
        return "fiebre leve"
    else:
        return "fiebre alta"

for t in [34.5, 36.8, 38.0, 39.5]:
    print(f"{t}°C → {clasificar_temperatura(t)}")
\`\`\`

## Retornar múltiples valores

\`\`\`python
# Python puede retornar múltiples valores (como tupla)
def calcular_estadisticas(numeros):
    """Calcula estadísticas básicas de una lista."""
    if not numeros:
        return None, None, None

    total = sum(numeros)
    promedio = total / len(numeros)
    maximo = max(numeros)
    minimo = min(numeros)

    return promedio, maximo, minimo

datos = [85, 92, 78, 96, 88, 74, 91]
prom, maxi, mini = calcular_estadisticas(datos)
print(f"Promedio: {prom:.1f}")
print(f"Máximo: {maxi} | Mínimo: {mini}")
\`\`\`

## Parámetros con valores por defecto

\`\`\`python
def calcular_descuento(precio, descuento=0.10):
    """Calcula precio con descuento. Default: 10%."""
    return precio * (1 - descuento)

# Sin especificar descuento → usa el default (10%)
print(calcular_descuento(100))        # 90.0
print(calcular_descuento(100, 0.20))  # 80.0 (20%)
print(calcular_descuento(100, 0.50))  # 50.0 (50%)

# En IA: función con hiperparámetros default
def crear_red_neuronal(capas=3, neuronas=64, activacion="relu", dropout=0.2):
    """Configura una red neuronal con parámetros default razonables."""
    print(f"Red: {capas} capas, {neuronas} neuronas/capa")
    print(f"Activación: {activacion}, Dropout: {dropout}")
    return {"capas": capas, "neuronas": neuronas}

# Uso simple
crear_red_neuronal()                    # Usa todos los defaults
crear_red_neuronal(capas=5)             # Solo cambia capas
crear_red_neuronal(capas=4, dropout=0.3)  # Cambia dos
\`\`\`

## Docstrings: documenta tu código

\`\`\`python
def calcular_imc(peso_kg, altura_m):
    """
    Calcula el Índice de Masa Corporal (IMC).

    Args:
        peso_kg (float): Peso en kilogramos
        altura_m (float): Altura en metros

    Returns:
        float: IMC calculado. None si parámetros inválidos.

    Example:
        >>> calcular_imc(70, 1.75)
        22.857142857142858
    """
    if peso_kg <= 0 or altura_m <= 0:
        return None
    return peso_kg / (altura_m ** 2)

# Acceder al docstring
help(calcular_imc)
# o
print(calcular_imc.__doc__)
\`\`\`

## Pipeline de IA con funciones

\`\`\`python
# Así se estructura un proyecto real de ML
def cargar_datos(ruta_archivo):
    """Simula carga de dataset."""
    # En producción: pd.read_csv(ruta_archivo)
    return [23, 45, 12, 67, 34, 89, 11, 56]

def limpiar_datos(datos):
    """Elimina valores fuera de rango."""
    return [d for d in datos if 0 <= d <= 100]

def normalizar_datos(datos):
    """Escala datos al rango [0, 1]."""
    minimo = min(datos)
    maximo = max(datos)
    return [(d - minimo) / (maximo - minimo) for d in datos]

def calcular_estadisticas(datos):
    """Retorna estadísticas descriptivas."""
    n = len(datos)
    media = sum(datos) / n
    varianza = sum((x - media) ** 2 for x in datos) / n
    return {"n": n, "media": round(media, 4), "varianza": round(varianza, 4)}

# Pipeline completo
datos_raw = cargar_datos("dataset.csv")
datos_limpios = limpiar_datos(datos_raw)
datos_norm = normalizar_datos(datos_limpios)
stats = calcular_estadisticas(datos_norm)

print(f"Dataset procesado: {len(datos_raw)} → {len(datos_limpios)} registros")
print(f"Estadísticas: {stats}")
\`\`\`

## Errores comunes con funciones

\`\`\`python
# Error 1: Usar resultado de función que no retorna nada
def imprimir_doble(n):
    print(n * 2)  # Sin return

resultado = imprimir_doble(5)  # Ejecuta e imprime 10
print(resultado)                # None (porque no hay return)

# Error 2: Olvidar llamar la función
def calcular():
    return 42

resultado = calcular   # Esto asigna la FUNCIÓN, no la ejecuta
resultado = calcular() # Esto SÍ la ejecuta y retorna 42

# Error 3: Número incorrecto de argumentos
def sumar(a, b):
    return a + b

sumar(1, 2, 3)  # TypeError: takes 2 positional arguments but 3 were given

# Error 4: Modificar lista global dentro de función (efecto colateral)
datos = [1, 2, 3]
def agregar(lista, valor):
    lista.append(valor)  # Modifica la lista original
agregar(datos, 4)
print(datos)  # [1, 2, 3, 4] — fue modificada
\`\`\`

## Principio SOLID: Single Responsibility

\`\`\`python
# MALO: función que hace demasiado
def procesar_todo(datos, modelo, archivo_salida):
    datos_limpios = [d for d in datos if d is not None]
    resultado = modelo.predecir(datos_limpios)
    with open(archivo_salida, "w") as f:
        f.write(str(resultado))
    print("Proceso completado")

# BUENO: cada función tiene una responsabilidad
def limpiar(datos): ...
def predecir(datos, modelo): ...
def guardar(resultado, archivo): ...
def reportar(mensaje): ...
\`\`\``,

  quiz: {
    title: 'Quiz S8 - Funciones I',
    pass_percentage: 70,
    questions: [
      {
        question_text: '¿Qué retorna una función que no tiene instrucción "return"?',
        options: JSON.stringify([
          { text: '0', is_correct: false },
          { text: 'False', is_correct: false },
          { text: 'None', is_correct: true },
          { text: 'Error: toda función debe tener return', is_correct: false }
        ]),
        explanation: 'En Python, si una función no tiene return (o tiene "return" sin valor), implícitamente retorna None. None es el valor que representa "ausencia de valor". Esto es válido y útil: funciones que solo hacen acciones (print, escribir archivo) no necesitan retornar nada. Si intentas usar el resultado de esa función en una operación matemática, obtendrás TypeError porque no puedes operar con None.'
      },
      {
        question_text: '¿Cuál es la diferencia entre "parámetro" y "argumento"?',
        options: JSON.stringify([
          { text: 'Son sinónimos, no hay diferencia', is_correct: false },
          { text: 'Parámetro es la variable en la definición de la función; argumento es el valor que se pasa al llamarla', is_correct: true },
          { text: 'Parámetro es el valor que retorna la función; argumento es lo que se le pasa', is_correct: false },
          { text: 'Parámetro es obligatorio; argumento es opcional', is_correct: false }
        ]),
        explanation: 'Terminología precisa: def sumar(a, b): → a y b son PARÁMETROS (variables en la definición). sumar(3, 5) → 3 y 5 son ARGUMENTOS (valores al llamar). En el lenguaje cotidiano se usan como sinónimos, pero en documentación técnica y entrevistas de trabajo esta distinción importa.'
      },
      {
        question_text: '¿Qué imprime este código?\n\ndef f(x, y=10):\n    return x + y\n\nprint(f(5))\nprint(f(5, 3))',
        options: JSON.stringify([
          { text: 'Error: y es obligatorio', is_correct: false },
          { text: '15 y 8', is_correct: true },
          { text: '10 y 8', is_correct: false },
          { text: '5 y 8', is_correct: false }
        ]),
        explanation: 'y=10 define un valor por defecto. f(5): x=5, y usa su default=10 → retorna 15. f(5, 3): x=5, y=3 (sobreescribe el default) → retorna 8. Los parámetros con default permiten que la función sea flexible: puede llamarse con o sin ese argumento. Los parámetros sin default son obligatorios; con default son opcionales.'
      },
      {
        question_text: 'Una función retorna: return promedio, maximo, minimo. ¿Cómo se capturan los tres valores?',
        options: JSON.stringify([
          { text: 'resultado = f(); promedio=resultado[0]; maximo=resultado[1]; minimo=resultado[2]', is_correct: false },
          { text: 'promedio, maximo, minimo = f()', is_correct: true },
          { text: 'No es posible retornar múltiples valores en Python', is_correct: false },
          { text: 'resultado = f(); print(resultado.promedio)', is_correct: false }
        ]),
        explanation: 'Python permite retornar múltiples valores que se empaquetan automáticamente en una tupla. Se pueden desempaquetar con: a, b, c = funcion(). Opción A también funciona pero es menos elegante. Si no quieres desempaquetar: resultado = funcion() retorna una tupla y accedes con resultado[0], resultado[1], etc. El desempaquetamiento directo es el estilo pythónico preferido.'
      },
      {
        question_text: '¿Por qué es importante el principio DRY (Don\'t Repeat Yourself) en el contexto de funciones?',
        options: JSON.stringify([
          { text: 'Porque Python no permite copiar y pegar código', is_correct: false },
          { text: 'Para reducir el tiempo de ejecución del programa', is_correct: false },
          { text: 'Para que un cambio en la lógica se aplique en un solo lugar, reduciendo errores y esfuerzo de mantenimiento', is_correct: true },
          { text: 'Porque las funciones ocupan menos memoria que el código repetido', is_correct: false }
        ]),
        explanation: 'DRY es un principio de ingeniería de software: si tienes el mismo código en 10 lugares y necesitas cambiar algo, debes cambiarlo en 10 lugares (riesgo de olvidar alguno → bugs). Con una función, el cambio está en UN lugar y aplica en todos lados. Esto es fundamental en IA donde los pipelines de procesamiento se llaman cientos de veces.'
      }
    ]
  },

  assignment: {
    title: 'Ejercicio 8: Librería de Funciones para Análisis de Datos',
    instructions_markdown: `## Ejercicio Práctico: Tu Primera Librería de Funciones

### Objetivo
Crear una colección de funciones reutilizables para análisis de datos, replicando el tipo de código que usarías en un proyecto real de Data Science.

### Código base

\`\`\`python
# ================================================
# MI LIBRERIA DE ANALISIS DE DATOS v1.0
# Autor: [Tu nombre]
# ================================================

# --- FUNCIÓN 1: Estadísticas descriptivas ---
def estadisticas(datos, nombre_variable="datos"):
    """
    Calcula estadísticas descriptivas básicas.

    Args:
        datos (list): Lista de números
        nombre_variable (str): Nombre para el reporte

    Returns:
        dict: Diccionario con n, media, mediana, min, max, rango
    """
    if not datos:
        return None

    n = len(datos)
    media = sum(datos) / n

    # Mediana
    ordenados = sorted(datos)
    if n % 2 == 0:
        mediana = (ordenados[n//2 - 1] + ordenados[n//2]) / 2
    else:
        mediana = ordenados[n//2]

    minimo = min(datos)
    maximo = max(datos)
    rango = maximo - minimo

    return {
        "variable": nombre_variable,
        "n": n,
        "media": round(media, 2),
        "mediana": round(mediana, 2),
        "minimo": minimo,
        "maximo": maximo,
        "rango": rango
    }

# --- FUNCIÓN 2: Normalización Min-Max ---
def normalizar_minmax(datos):
    """COMPLETA: normaliza datos al rango [0, 1]"""
    pass  # Implementa aquí

# --- FUNCIÓN 3: Detectar outliers (valores atípicos) ---
def detectar_outliers(datos, factor=1.5):
    """
    Detecta outliers usando el método IQR.
    Un outlier es un valor más allá de Q1-1.5*IQR o Q3+1.5*IQR
    COMPLETA esta función.
    """
    pass  # Implementa aquí

# --- FUNCIÓN 4: Reporte de datos faltantes ---
def analizar_calidad(dataset):
    """
    Analiza la calidad de un dataset con posibles None.

    Args:
        dataset (list): Lista que puede contener None

    Returns:
        dict: total, validos, faltantes, porcentaje_completitud
    """
    # COMPLETA: cuenta totales, válidos, faltantes
    pass

# --- FUNCIÓN 5: Formatear reporte ---
def imprimir_reporte(stats):
    """Imprime estadísticas en formato de tabla."""
    if stats is None:
        print("Sin datos para reportar")
        return

    print("=" * 40)
    print(f"REPORTE: {stats['variable'].upper()}")
    print("=" * 40)
    print(f"{'N (registros):':<20} {stats['n']}")
    print(f"{'Media:':<20} {stats['media']}")
    print(f"{'Mediana:':<20} {stats['mediana']}")
    print(f"{'Mínimo:':<20} {stats['minimo']}")
    print(f"{'Máximo:':<20} {stats['maximo']}")
    print(f"{'Rango:':<20} {stats['rango']}")

# ================================================
# PROGRAMA PRINCIPAL: usa las funciones
# ================================================
if __name__ == "__main__":
    # Dataset de edades de 20 pacientes
    edades = [23, 45, 31, 67, None, 29, 52, 38, None, 44,
              19, 71, 33, 28, 56, 42, None, 35, 48, 39]

    # Dataset con outlier
    pesos = [65, 70, 72, 68, 250, 71, 69, 73, 67, 70]

    # 1. Análisis de calidad
    calidad = analizar_calidad(edades)
    print(f"Calidad del dataset: {calidad}")

    # 2. Limpiar datos (eliminar None)
    edades_limpias = [e for e in edades if e is not None]

    # 3. Estadísticas
    stats_edades = estadisticas(edades_limpias, "edades_pacientes")
    imprimir_reporte(stats_edades)

    # 4. Normalización
    edades_norm = normalizar_minmax(edades_limpias)
    print(f"\\nEdades normalizadas (primeras 5): {edades_norm[:5]}")

    # 5. Outliers
    outliers_pesos = detectar_outliers(pesos)
    print(f"\\nOutliers en pesos: {outliers_pesos}")
\`\`\`

### Rúbrica (100 puntos)

| Criterio | Puntos |
|----------|--------|
| normalizar_minmax implementada correctamente | 25 pts |
| detectar_outliers con IQR funcionando | 25 pts |
| analizar_calidad contando None correctamente | 25 pts |
| Todas las funciones tienen docstring | 15 pts |
| El programa principal ejecuta sin errores | 10 pts |`,
    allowed_file_types: ['pdf', 'py', 'txt']
  },

  resources: [
    { title: 'Funciones Python - Documentación oficial', url: 'https://docs.python.org/es/3/tutorial/controlflow.html#defining-functions', type: 'documentation', description: 'Tutorial oficial de definición de funciones' },
    { title: 'Google Python Style Guide - Funciones', url: 'https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings', type: 'article', description: 'Guía de estilo de Google para docstrings' },
    { title: 'Funciones Python - Píldoras Informáticas', url: 'https://www.youtube.com/watch?v=3Hs2bBd9Zy4', type: 'video', description: 'Tutorial completo de funciones en español' },
    { title: 'Python Tutor - Visualiza scope de funciones', url: 'https://pythontutor.com', type: 'tool', description: 'Visualiza variables locales y globales en funciones' },
    { title: 'Real Python - Define Your Own Functions', url: 'https://realpython.com/defining-your-own-python-function/', type: 'article', description: 'Guía completa de funciones con ejemplos avanzados' }
  ],

  ai_lab_context: 'Sesión 8: el alumno aprendió def, parámetros, return (simple y múltiple), valores por defecto, docstrings, DRY, principio de responsabilidad única. Puede crear funciones propias y estructurar código en pipeline de IA.',
  ai_lab_suggested_prompt: 'Estoy aprendiendo funciones en Python. Tengo este código sin funciones: [pega tu código con código repetido]. ¿Puedes ayudarme a refactorizarlo creando funciones apropiadas? Explica por qué cada función tiene sentido y cómo nombraste los parámetros.'
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
  console.log('=== CARGANDO FUNDAMENTOS S5-S8 ===');
  for (const session of SESSIONS) {
    try {
      await loadSession(session);
    } catch (e) {
      console.error(`  ERROR en S${session.number}: \${e.message}`);
    }
  }
  console.log('\n=== COMPLETADO: 4 sesiones cargadas (S5-S8) ===');
  console.log('Ejecuta load_pilot_fundamentos_s9_12.js para continuar');
}

main().catch(e => console.error('Error fatal:', e));
