# Ejercicio Sesion 16: Mini App - Asistente de Orientacion Vocacional con IA

**Materia:** Fundamentos de Programacion
**Nivel:** Intermedio
**Herramienta IA:** Claude API / Gemini API
**Duracion estimada:** 45 min

## Objetivo

Construir una mini aplicacion de consola que combina todo lo aprendido en el periodo: POO, manejo de archivos, manejo de errores, strings, listas/diccionarios y llamadas a una API de IA real para generar recomendaciones de carrera personalizadas.

## Contexto

Este es el proyecto integrador del Periodo 1. El mundo real de IA no es solo modelos; es sistemas completos: entrada de datos, procesamiento, llamada a un modelo, manejo de errores y salida estructurada. Vas a construir un Asistente de Orientacion Vocacional que usa Gemini (Google) o una IA de respaldo para recomendar cual carrera de ITSEIA es ideal para cada estudiante segun su perfil.

## Instrucciones

1. Instala las librerias necesarias:
```
pip install requests
```

2. Crea la estructura del proyecto:
```
sesion16_mini_app/
    config.py
    modelos.py
    asistente_ia.py
    main.py
    resultados/
```

3. Crea `sesion16_mini_app/config.py`:

```python
# Configuracion de la aplicacion
# IMPORTANTE: en proyectos reales, usar variables de entorno

APP_NOMBRE = "Orientador Vocacional ITSEIA"
APP_VERSION = "1.0.0"

# Carreras ITSEIA
CARRERAS = {
    "IA": {
        "nombre": "Tecnologia Superior en Inteligencia Artificial",
        "duracion": "2.5 años (5 semestres)",
        "empleabilidad": "92%",
        "salario_junior": "$900-$1,200/mes",
        "perfil": "Creativo, matematico, le gusta resolver problemas complejos"
    },
    "DATOS": {
        "nombre": "Tecnologia Superior en Ciencia de Datos",
        "duracion": "2.5 años (5 semestres)",
        "empleabilidad": "88%",
        "salario_junior": "$800-$1,100/mes",
        "perfil": "Analitico, curioso, le gustan los patrones y estadisticas"
    },
    "BIGDATA": {
        "nombre": "Tecnologia Superior en Big Data e Ingenieria de Datos",
        "duracion": "2.5 años (5 semestres)",
        "empleabilidad": "85%",
        "salario_junior": "$750-$1,000/mes",
        "perfil": "Sistematico, le gustan los sistemas, bases de datos y arquitectura"
    }
}

# API de IA (Gemini gratuito - obtener en aistudio.google.com)
# Para este ejercicio se puede dejar vacia y usar el modo simulado
GEMINI_API_KEY = ""   # Pegar tu API key aqui si tienes una
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
```

4. Crea `sesion16_mini_app/modelos.py`:

```python
# Modelos de datos: Perfil del aspirante y Resultado

from datetime import datetime

class PerfilAspirante:
    """Almacena y valida el perfil de un aspirante."""

    def __init__(self):
        self.nombre = ""
        self.edad = 0
        self.ciudad = ""
        self.trabaja = False
        self.nivel_matematicas = 0   # 1-5
        self.le_gusta_programar = False
        self.le_gustan_datos = False
        self.le_gusta_arquitectura = False
        self.objetivo_principal = ""
        self.habilidades_actuales = []
        self.fecha_registro = datetime.now().strftime("%Y-%m-%d %H:%M")

    def es_valido(self):
        """Verifica que el perfil tiene los datos minimos."""
        return (
            len(self.nombre) >= 2 and
            18 <= self.edad <= 65 and
            1 <= self.nivel_matematicas <= 5
        )

    def como_texto(self):
        """Convierte el perfil a texto para enviarlo a la IA."""
        habilidades = ", ".join(self.habilidades_actuales) if self.habilidades_actuales else "ninguna aun"
        return (
            f"Aspirante: {self.nombre}, {self.edad} años, de {self.ciudad}. "
            f"{'Trabaja actualmente.' if self.trabaja else 'No trabaja actualmente.'} "
            f"Nivel de matematicas: {self.nivel_matematicas}/5. "
            f"Le gusta programar: {'si' if self.le_gusta_programar else 'no'}. "
            f"Le gustan los datos/estadisticas: {'si' if self.le_gustan_datos else 'no'}. "
            f"Le gusta la arquitectura de sistemas: {'si' if self.le_gusta_arquitectura else 'no'}. "
            f"Objetivo principal: {self.objetivo_principal}. "
            f"Habilidades actuales: {habilidades}."
        )

    def __str__(self):
        return f"Perfil: {self.nombre} | {self.edad} años | {self.ciudad}"


class ResultadoOrientacion:
    """Almacena el resultado de la orientacion vocacional."""

    def __init__(self, perfil, carrera_recomendada, justificacion, generado_por_ia):
        self.perfil = perfil
        self.carrera_recomendada = carrera_recomendada
        self.justificacion = justificacion
        self.generado_por_ia = generado_por_ia
        self.fecha = datetime.now().strftime("%Y-%m-%d %H:%M")

    def __str__(self):
        fuente = "IA (Gemini)" if self.generado_por_ia else "Sistema de reglas"
        return (
            f"[{self.fecha}] {self.perfil.nombre} -> "
            f"{self.carrera_recomendada} (Fuente: {fuente})"
        )
```

5. Crea `sesion16_mini_app/asistente_ia.py`:

```python
# Modulo de IA: llama a Gemini o usa reglas de respaldo

import json
from config import CARRERAS, GEMINI_API_KEY, GEMINI_URL

try:
    import requests
    REQUESTS_OK = True
except ImportError:
    REQUESTS_OK = False


def recomendar_con_gemini(perfil_texto):
    """
    Envia el perfil a Gemini y pide una recomendacion de carrera.
    Retorna (carrera_key, justificacion) o None si falla.
    """
    if not GEMINI_API_KEY or not REQUESTS_OK:
        return None

    prompt = f"""Eres el orientador vocacional del Instituto Ecuatoriano de Inteligencia Artificial (ITSEIA).
Tienes 3 carreras disponibles:
- IA: Tecnologia Superior en Inteligencia Artificial (perfil creativo, matematico, ML/Deep Learning)
- DATOS: Tecnologia Superior en Ciencia de Datos (perfil analitico, estadisticas, visualizacion)
- BIGDATA: Tecnologia Superior en Big Data (perfil sistematico, bases de datos, arquitectura)

Perfil del aspirante:
{perfil_texto}

Responde UNICAMENTE en este formato JSON exacto (sin explicaciones adicionales):
{{"carrera": "IA|DATOS|BIGDATA", "justificacion": "Explicacion en 2-3 oraciones en espanol"}}"""

    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    headers = {"Content-Type": "application/json"}
    url = f"{GEMINI_URL}?key={GEMINI_API_KEY}"

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=10)
        resp.raise_for_status()
        texto = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        # Limpiar posibles bloques de codigo markdown
        texto = texto.strip().strip("```json").strip("```").strip()
        resultado = json.loads(texto)
        return resultado.get("carrera"), resultado.get("justificacion")
    except Exception as e:
        print(f"  (Gemini no disponible: {type(e).__name__}. Usando sistema de reglas.)")
        return None


def recomendar_por_reglas(perfil):
    """
    Sistema de reglas de respaldo cuando la IA no esta disponible.
    Puntua cada carrera segun el perfil y elige la de mayor puntaje.
    """
    puntajes = {"IA": 0, "DATOS": 0, "BIGDATA": 0}

    # Matematicas altas favorecen IA
    if perfil.nivel_matematicas >= 4:
        puntajes["IA"] += 2
        puntajes["DATOS"] += 1
    elif perfil.nivel_matematicas >= 3:
        puntajes["DATOS"] += 2
        puntajes["BIGDATA"] += 1

    # Preferencias directas
    if perfil.le_gusta_programar:
        puntajes["IA"] += 2
    if perfil.le_gustan_datos:
        puntajes["DATOS"] += 3
    if perfil.le_gusta_arquitectura:
        puntajes["BIGDATA"] += 3

    # Objetivo principal
    objetivo = perfil.objetivo_principal.lower()
    if any(w in objetivo for w in ["crear", "innovar", "robot", "ia", "inteligencia"]):
        puntajes["IA"] += 2
    if any(w in objetivo for w in ["analizar", "datos", "estadistica", "prediccion"]):
        puntajes["DATOS"] += 2
    if any(w in objetivo for w in ["sistema", "empresa", "infraestructura", "base de datos"]):
        puntajes["BIGDATA"] += 2

    # Elegir la de mayor puntaje
    carrera = max(puntajes, key=puntajes.get)
    justificacion = (
        f"Segun tu perfil, tu fortaleza en "
        f"{'programacion y matematicas' if carrera == 'IA' else 'analisis de datos' if carrera == 'DATOS' else 'sistemas y arquitectura'} "
        f"te hace ideal para {CARRERAS[carrera]['nombre']}. "
        f"El mercado ecuatoriano ofrece empleabilidad del {CARRERAS[carrera]['empleabilidad']} en este campo."
    )
    return carrera, justificacion
```

6. Crea `sesion16_mini_app/main.py`:

```python
# Aplicacion Principal: Orientador Vocacional ITSEIA
# Integra POO, archivos, errores, strings, listas, IA

import os
import json
from datetime import datetime
from modelos import PerfilAspirante, ResultadoOrientacion
from asistente_ia import recomendar_con_gemini, recomendar_por_reglas
from config import APP_NOMBRE, APP_VERSION, CARRERAS

os.makedirs("resultados", exist_ok=True)
HISTORIAL_FILE = "resultados/historial.json"

def cargar_historial():
    if os.path.exists(HISTORIAL_FILE):
        try:
            with open(HISTORIAL_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def guardar_historial(historial):
    with open(HISTORIAL_FILE, "w", encoding="utf-8") as f:
        json.dump(historial, f, ensure_ascii=False, indent=2)

def obtener_input_validado(prompt, tipo, min_val=None, max_val=None):
    """Solicita input al usuario con validacion de tipo y rango."""
    while True:
        try:
            valor_raw = input(prompt).strip()
            if tipo == "str":
                if len(valor_raw) < 2:
                    raise ValueError("Minimo 2 caracteres.")
                return valor_raw
            elif tipo == "int":
                valor = int(valor_raw)
                if min_val is not None and valor < min_val:
                    raise ValueError(f"Minimo {min_val}.")
                if max_val is not None and valor > max_val:
                    raise ValueError(f"Maximo {max_val}.")
                return valor
            elif tipo == "bool":
                if valor_raw.lower() in ["s", "si", "y", "yes", "1"]:
                    return True
                elif valor_raw.lower() in ["n", "no", "0"]:
                    return False
                raise ValueError("Responde s/n")
        except ValueError as e:
            print(f"  Entrada invalida: {e} Intenta de nuevo.")

def mostrar_carrera(carrera_key):
    """Muestra los detalles de una carrera."""
    c = CARRERAS[carrera_key]
    print(f"\n{'='*55}")
    print(f"  CARRERA RECOMENDADA: {c['nombre']}")
    print(f"{'='*55}")
    print(f"  Duracion:        {c['duracion']}")
    print(f"  Empleabilidad:   {c['empleabilidad']}")
    print(f"  Salario junior:  {c['salario_junior']}")
    print(f"  Perfil ideal:    {c['perfil']}")
    print(f"  Pension pionero: $187/mes (lista: $220)")
    print(f"  Contacto:        administracion@itseia.ai")
    print(f"  WhatsApp:        +593 95 989 2034")

def ejecutar_orientacion():
    """Flujo principal de orientacion."""
    print(f"\n{'='*55}")
    print(f"  {APP_NOMBRE} v{APP_VERSION}")
    print(f"  Instituto Ecuatoriano de Inteligencia Artificial")
    print(f"{'='*55}")
    print("\nResponde las siguientes preguntas para recibir tu recomendacion personalizada.\n")

    perfil = PerfilAspirante()

    # Recopilar datos con validacion
    perfil.nombre = obtener_input_validado("Tu nombre completo: ", "str")
    perfil.edad = obtener_input_validado("Tu edad: ", "int", 16, 65)
    perfil.ciudad = obtener_input_validado("Tu ciudad: ", "str")
    perfil.trabaja = obtener_input_validado("¿Trabajas actualmente? (s/n): ", "bool")
    perfil.nivel_matematicas = obtener_input_validado(
        "Nivel en matematicas del 1 al 5 (1=basico, 5=avanzado): ", "int", 1, 5)
    perfil.le_gusta_programar = obtener_input_validado(
        "¿Te gusta o te gustaria programar? (s/n): ", "bool")
    perfil.le_gustan_datos = obtener_input_validado(
        "¿Te gustan los datos, estadisticas y analisis? (s/n): ", "bool")
    perfil.le_gusta_arquitectura = obtener_input_validado(
        "¿Te gustan los sistemas, bases de datos, infraestructura? (s/n): ", "bool")
    perfil.objetivo_principal = obtener_input_validado(
        "¿Cual es tu objetivo profesional principal? (escribe libremente): ", "str")

    habilidades_raw = input("Habilidades actuales (separadas por coma, o ENTER si ninguna): ").strip()
    if habilidades_raw:
        perfil.habilidades_actuales = [h.strip() for h in habilidades_raw.split(",")]

    if not perfil.es_valido():
        print("El perfil no tiene datos suficientes. Intenta de nuevo.")
        return

    # Obtener recomendacion
    print("\nAnalizando tu perfil con IA...")
    carrera_key = None
    justificacion = None
    uso_ia = False

    resultado_ia = recomendar_con_gemini(perfil.como_texto())
    if resultado_ia and resultado_ia[0] in CARRERAS:
        carrera_key, justificacion = resultado_ia
        uso_ia = True
        print("  Recomendacion generada con Gemini AI.")
    else:
        carrera_key, justificacion = recomendar_por_reglas(perfil)
        print("  Recomendacion generada con sistema de reglas.")

    # Mostrar resultado
    resultado = ResultadoOrientacion(perfil, carrera_key, justificacion, uso_ia)
    mostrar_carrera(carrera_key)
    print(f"\n  Justificacion:")
    print(f"  {justificacion}")

    # Guardar en historial
    historial = cargar_historial()
    historial.append({
        "fecha": resultado.fecha,
        "nombre": perfil.nombre,
        "ciudad": perfil.ciudad,
        "carrera_recomendada": carrera_key,
        "uso_ia": uso_ia,
        "objetivo": perfil.objetivo_principal
    })
    guardar_historial(historial)
    print(f"\n  Resultado guardado en {HISTORIAL_FILE}")
    print(f"  Total consultas previas: {len(historial)}")

    # Guardar reporte individual
    reporte_path = f"resultados/orientacion_{perfil.nombre.replace(' ', '_').lower()}.txt"
    with open(reporte_path, "w", encoding="utf-8") as f:
        f.write(f"REPORTE DE ORIENTACION VOCACIONAL - ITSEIA\n")
        f.write(f"Fecha: {resultado.fecha}\n")
        f.write(f"{'='*50}\n")
        f.write(f"Nombre: {perfil.nombre}\n")
        f.write(f"Ciudad: {perfil.ciudad}\n")
        f.write(f"Edad: {perfil.edad}\n")
        f.write(f"{'='*50}\n")
        f.write(f"Carrera recomendada: {CARRERAS[carrera_key]['nombre']}\n")
        f.write(f"Justificacion: {justificacion}\n")
        f.write(f"Fuente: {'Gemini AI' if uso_ia else 'Sistema de reglas'}\n")
    print(f"  Reporte guardado en: {reporte_path}")
    print(f"\n{'='*55}")


if __name__ == "__main__":
    while True:
        ejecutar_orientacion()
        continuar = input("\n¿Orientar a otro aspirante? (s/n): ").strip().lower()
        if continuar not in ["s", "si", "y"]:
            print("\nGracias por usar el Orientador Vocacional ITSEIA.")
            print("El futuro no se espera. Se construye. - Hector Velasco")
            break
```

7. Ejecuta `main.py` desde la carpeta `sesion16_mini_app/`.

8. Completa el flujo con tus propios datos y con los datos de 2 personas diferentes. Verifica que el historial se guarda correctamente.

9. Si tienes una API Key de Gemini (gratis en aistudio.google.com), pegala en `config.py` y prueba con la IA real.

## Usa IA para...

> Abre Claude o ChatGPT y describe tu aplicacion:
> "Tengo una mini app en Python de orientacion vocacional. Usa POO, archivos JSON, manejo de errores, y llama a la API de Gemini. Revisa esta funcion 'obtener_input_validado' y sugiere como mejorarla para manejar el caso donde el usuario presiona Ctrl+C para salir. ¿Como capturo ese evento?"

Copia la funcion en el mensaje.

Despues de leer la respuesta:
- Agrega el manejo de `KeyboardInterrupt` en el lugar correcto.
- ¿En que parte del codigo seria mas importante capturar ese error?

## Que aprendiste

- Un proyecto real combina TODOS los conceptos del periodo: clases, archivos, errores, strings, APIs.
- La separacion en modulos (config, modelos, logica, main) hace el codigo mantenible.
- Un sistema robusto siempre tiene un mecanismo de respaldo cuando la IA falla.
- JSON es el formato universal para guardar y compartir datos estructurados.
- La validacion de inputs protege el programa de datos incorrectos del usuario.
- Una API de IA es solo una llamada HTTP: `requests.post(url, json=payload)`.

## Reto extra

Agrega una pantalla de "Estadisticas del Orientador" que se muestre al final: cuantas consultas totales se han hecho, que carrera fue la mas recomendada, que ciudad tiene mas aspirantes, y el porcentaje de consultas que usaron IA real vs sistema de reglas. Lee estos datos del historial JSON y presentalos con formato.
