# Ejercicio Sesion 9: Procesador de Texto para Analisis de CVs

**Materia:** Fundamentos de Programacion
**Nivel:** Basico - Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Usar los metodos de strings en Python para construir un analizador de CVs que extrae, limpia, clasifica y puntua habilidades tecnicas mencionadas en descripciones de trabajo reales del sector tech en Ecuador.

## Contexto

Los sistemas de ATS (Applicant Tracking System) que usan las empresas ecuatorianas como H3L, Banco Pichincha, Grupo Pronaca y otras, analizan CVs automaticamente buscando palabras clave. Vamos a construir una version simplificada de ese sistema usando solo metodos de strings de Python.

## Instrucciones

1. Crea un archivo `sesion09_analizador_cvs.py`.

2. Construye el analizador paso a paso:

```python
# Analizador de CVs - Sector Tech Ecuador
# Tecnicas: metodos de strings, split, join, replace, find
# Simulacion de ATS (Applicant Tracking System)

print("=" * 62)
print("ANALIZADOR DE CVS - ITSEIA CAREER CENTER")
print("Busqueda de habilidades en descripciones de perfil")
print("=" * 62)

# ================================================
# DATOS: CV real de un candidato (texto sucio)
# ================================================

cv_candidato = """
   PERFIL PROFESIONAL

   Desarrollador con 2 años de experiencia en Python,
   machine learning y análisis de datos. Manejo de
   PANDAS, NumPy y scikit-learn. Experiencia con SQL
   y bases de datos PostgreSQL. Trabajo con AWS y
   despliegue de modelos en produccion. Conocimientos
   de docker  y  kubernetes.   Ingles  intermedio B2.
   Github activo con proyectos de NLP y Vision por Computadora.
   Salario esperado: $1500 usd mensuales.
"""

# ================================================
# LIMPIEZA DE STRINGS
# ================================================
print("\n--- LIMPIEZA DEL CV ---")

# strip: eliminar espacios al inicio y final
cv_limpio = cv_candidato.strip()

# Normalizar espacios multiples
import re  # solo para este paso
cv_limpio = re.sub(r'\s+', ' ', cv_limpio)

print(f"Caracteres originales:  {len(cv_candidato)}")
print(f"Caracteres limpios:     {len(cv_limpio)}")
print(f"Primeros 120 chars:     {cv_limpio[:120]}...")

# ================================================
# ANALISIS DE HABILIDADES
# ================================================
print("\n--- DETECCION DE HABILIDADES ---")

# Habilidades buscadas (lowercase para comparar)
habilidades_ia = ["python", "machine learning", "deep learning", "tensorflow",
                   "pytorch", "scikit-learn", "pandas", "numpy", "nlp"]
habilidades_datos = ["sql", "postgresql", "mongodb", "spark", "kafka",
                      "etl", "tableau", "power bi"]
habilidades_cloud = ["aws", "google cloud", "azure", "docker", "kubernetes",
                      "mlops", "ci/cd"]
habilidades_soft = ["ingles", "agil", "scrum", "liderazgo", "comunicacion"]

cv_lower = cv_limpio.lower()

def analizar_habilidades(cv_texto, lista_habilidades, categoria):
    """Busca habilidades en el texto del CV."""
    encontradas = []
    for habilidad in lista_habilidades:
        if habilidad in cv_texto:
            encontradas.append(habilidad)
    print(f"\n{categoria} ({len(encontradas)}/{len(lista_habilidades)}):")
    for h in encontradas:
        print(f"  + {h.title()}")
    if not encontradas:
        print("  (ninguna detectada)")
    return encontradas

ia_ok = analizar_habilidades(cv_lower, habilidades_ia, "INTELIGENCIA ARTIFICIAL")
datos_ok = analizar_habilidades(cv_lower, habilidades_datos, "DATOS / SQL")
cloud_ok = analizar_habilidades(cv_lower, habilidades_cloud, "CLOUD / DEVOPS")
soft_ok = analizar_habilidades(cv_lower, habilidades_soft, "SOFT SKILLS")

# ================================================
# PUNTUACION DEL CV
# ================================================
print("\n--- PUNTUACION ATS ---")
total_habilidades = len(habilidades_ia) + len(habilidades_datos) + \
                    len(habilidades_cloud) + len(habilidades_soft)
encontradas_total = len(ia_ok) + len(datos_ok) + len(cloud_ok) + len(soft_ok)
score = (encontradas_total / total_habilidades) * 100

print(f"Habilidades detectadas: {encontradas_total}/{total_habilidades}")
print(f"Score ATS:              {score:.1f}%")

if score >= 70:
    clasificacion = "CANDIDATO FUERTE - Llamar a entrevista"
elif score >= 40:
    clasificacion = "CANDIDATO MEDIO - Revision manual"
else:
    clasificacion = "CANDIDATO DEBIL - No cumple perfil"
print(f"Clasificacion:          {clasificacion}")

# ================================================
# OPERACIONES DE STRINGS
# ================================================
print("\n--- OPERACIONES DE STRINGS ---")

# Extraer salario con find y slice
idx_salario = cv_lower.find("salario")
if idx_salario != -1:
    fragmento = cv_limpio[idx_salario:idx_salario + 40]
    print(f"Fragmento salario: '{fragmento}'")

# split: contar palabras
palabras = cv_limpio.split()
print(f"Total palabras en CV:   {len(palabras)}")
print(f"Total lineas:           {cv_limpio.count(chr(10)) + 1}")

# replace: anonimizar datos
cv_anonimo = cv_limpio.replace("$1500", "$XXX").replace("B2", "XX")
print(f"\nCV anonimizado (primeros 200 chars):")
print(f"{cv_anonimo[:200]}...")

# upper, lower, title
nombre_candidato = "  diego ESTEBAN mora  "
nombre_formateado = nombre_candidato.strip().title()
print(f"\nNombre original:  '{nombre_candidato}'")
print(f"Nombre limpio:    '{nombre_formateado}'")

# join: reconstruir lista de habilidades como texto
todas_encontradas = ia_ok + datos_ok + cloud_ok + soft_ok
resumen_habilidades = ", ".join([h.title() for h in todas_encontradas])
print(f"\nHabilidades (texto): {resumen_habilidades}")

# startswith / endswith
palabras_python = [p for p in palabras if p.lower().startswith("py")]
print(f"\nPalabras que empiezan con 'py': {palabras_python}")

print("\n" + "=" * 62)
```

3. Ejecuta el programa y verifica que detecta correctamente las habilidades.

4. Modifica el `cv_candidato` para que sea el tuyo propio o de un perfil que quisieras tener en 3 años. Observa que score obtienes.

5. Agrega una nueva categoria de habilidades llamada `habilidades_negocio` con: "finanzas", "marketing", "gestion de proyectos", "excel", "presentaciones". Analiza cuantas tiene el candidato.

## Usa IA para...

> Abre ChatGPT y escribe:
> "En Python, ¿cual es la diferencia entre str.find() y str.index()? ¿Cuando deberia usar cada uno? Ademas, explica str.split() con delimiter vs sin delimiter. Dame ejemplos con texto en espanol."

Despues de leer la respuesta:
- Identifica un lugar en tu codigo donde `find()` podria causar un problema si no encuentra el texto.
- Agrega un `if idx != -1:` para proteger ese caso.

## Que aprendiste

- `strip()`, `lstrip()`, `rstrip()` limpian espacios (o caracteres especificados).
- `lower()` / `upper()` / `title()` cambian la capitalizacion.
- `find(sub)` devuelve el indice o -1 si no encuentra; `index()` lanza error.
- `split(sep)` divide un string en lista; sin argumento divide por espacios.
- `join(lista)` une una lista en un string con un separador.
- `replace(viejo, nuevo)` reemplaza todas las ocurrencias.
- `count(sub)` cuenta cuantas veces aparece un substring.
- `startswith()` / `endswith()` verifican el inicio o fin del string.

## Reto extra

Implementa un detector de idioma simplificado: cuenta la frecuencia de las palabras mas comunes en espanol ("de", "la", "el", "en", "que") vs en ingles ("the", "of", "and", "in", "to") en el CV. Si hay mas palabras en espanol que en ingles, reporta "CV en Espanol", si no, "CV en Ingles". Prueba con el CV del ejercicio y con un fragmento en ingles que escribas tu.
