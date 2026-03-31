# Ejercicio Sesion 4: Clasificador de Notas ITSEIA

**Materia:** Fundamentos de Programacion
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 30 min

## Objetivo

Usar estructuras `if / elif / else` para construir un sistema de clasificacion de notas que siga el reglamento academico ecuatoriano (SENESCYT), con mensajes de retroalimentacion personalizados.

## Contexto

El sistema de calificaciones en Ecuador para educacion superior usa una escala de 0 a 10. Segun el Reglamento de Regimen Academico del CES:
- Aprobado: 7.0 o superior
- Reprobado: menos de 7.0
- Sobresaliente: 9.0 - 10.0
- Muy bueno: 8.0 - 8.99
- Bueno: 7.0 - 7.99

En ITSEIA ademas aplicamos reglas especiales: si el estudiante aprueba con 9.0+ en el proyecto final, obtiene una mencion de honor.

## Instrucciones

1. Crea un archivo `sesion04_clasificador_notas.py`.

2. Escribe el programa:

```python
# Clasificador de Notas - Sistema ITSEIA / SENESCYT
# Estructuras condicionales: if / elif / else

print("=" * 55)
print("SISTEMA DE CALIFICACIONES ITSEIA")
print("Escala: 0 - 10 | Aprobacion: 7.0")
print("=" * 55)

# Notas del estudiante (puedes cambiarlas)
nombre_estudiante = "Carlos Andres Mena"
nota_teoria = 8.5       # 40% del total
nota_practica = 9.2     # 40% del total
nota_proyecto = 9.0     # 20% del total

# Calcular nota final ponderada
nota_final = (nota_teoria * 0.40) + (nota_practica * 0.40) + (nota_proyecto * 0.20)

print(f"\nEstudiante:      {nombre_estudiante}")
print(f"Teoria (40%):    {nota_teoria}")
print(f"Practica (40%):  {nota_practica}")
print(f"Proyecto (20%):  {nota_proyecto}")
print(f"Nota final:      {nota_final:.2f}")
print("-" * 55)

# --- CLASIFICACION PRINCIPAL ---
if nota_final >= 9.0:
    calificacion = "SOBRESALIENTE"
    mensaje = "Rendimiento excepcional. Eres candidato a beca."
elif nota_final >= 8.0:
    calificacion = "MUY BUENO"
    mensaje = "Excelente rendimiento. Sigue asi."
elif nota_final >= 7.0:
    calificacion = "BUENO"
    mensaje = "Aprobado. Puedes mejorar en practica."
elif nota_final >= 5.0:
    calificacion = "REGULAR - REPROBADO"
    mensaje = "No alcanzaste el minimo. Debes rendir supletorio."
else:
    calificacion = "INSUFICIENTE - REPROBADO"
    mensaje = "Rendimiento muy bajo. Se recomienda consejeria academica."

print(f"Calificacion:    {calificacion}")
print(f"Estado:          {'APROBADO' if nota_final >= 7.0 else 'REPROBADO'}")
print(f"Mensaje:         {mensaje}")

# --- CONDICION ANIDADA: mencion de honor ---
print("\n--- RECONOCIMIENTOS ESPECIALES ---")
if nota_final >= 9.0:
    if nota_proyecto >= 9.0:
        print("MENCION DE HONOR en proyecto final.")
    else:
        print("Sobresaliente general, sin mencion en proyecto.")
elif nota_final >= 8.5:
    print("Candidato a mencion en el proximo semestre.")
else:
    print("Sin reconocimientos especiales este semestre.")

# --- CONDICION CON OPERADORES LOGICOS ---
print("\n--- ELEGIBILIDAD BECA MERITO ---")
if nota_final >= 9.0 and nota_practica >= 9.0:
    print("ELEGIBLE para beca de merito ITSEIA (10% descuento).")
elif nota_final >= 8.5 or nota_proyecto >= 9.5:
    print("EN LISTA DE ESPERA para beca de merito.")
else:
    print("No cumple criterios de beca de merito este semestre.")

print("\n" + "=" * 55)
```

3. Cambia las notas para probar todos los casos posibles: una nota bajo 5, una entre 5-7, una entre 7-8, y una mayor a 9.

4. Verifica que cada caso muestre el mensaje correcto.

5. Agrega una condicion adicional: si `nota_teoria < 6.0` y `nota_practica >= 8.0`, mostrar un mensaje de "Debe reforzar teoria en el siguiente semestre".

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un programa Python que clasifica notas con if/elif/else. Explica la diferencia entre usar 'if anidado' (if dentro de if) vs usar 'and' en una sola condicion. ¿Cuando conviene cada uno? Dame un ejemplo de notas escolares."

Despues de leer la respuesta:
- Revisa tu codigo: ¿tienes un lugar donde podrias reemplazar un `if` anidado por `and`?
- Prueba el cambio y verifica que el resultado sea identico.

## Que aprendiste

- `if / elif / else` evalua condiciones en orden: la primera verdadera se ejecuta.
- Solo un bloque se ejecuta aunque varias condiciones sean verdaderas.
- Los `if` anidados permiten condiciones dentro de condiciones.
- Combinar `and` / `or` hace condiciones compuestas en una sola linea.
- El operador ternario `'A' if condicion else 'B'` es util para asignaciones simples.

## Reto extra

Agrega un modulo de "prediccion": si el estudiante reprueba (nota < 7.0), calcula cuantos puntos adicionales necesita en teoria y practica (manteniendo el proyecto igual) para aprobar con exactamente 7.0. Muestra los valores exactos necesarios.
