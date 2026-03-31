# Ejercicio Sesion 2: El Perfil del Estudiante ITSEIA

**Materia:** Fundamentos de Programacion
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 25 min

## Objetivo

Declarar variables de distintos tipos de datos para almacenar informacion real de un estudiante y mostrarla con formato usando `type()` y f-strings.

## Contexto

Todo sistema de gestion academica almacena datos de estudiantes: nombre, edad, ciudad, promedio, si esta becado, etc. Cada dato tiene un tipo especifico en Python. Vamos a construir el perfil digital de un estudiante ficticio de ITSEIA usando los 4 tipos de datos fundamentales.

## Instrucciones

1. Crea un archivo `sesion02_perfil_estudiante.py`.

2. Declara las siguientes variables con los tipos indicados:

```python
# Perfil del Estudiante ITSEIA
# Tipos de datos: str, int, float, bool

# Datos personales (str = texto)
nombre = "Maria Fernanda Quispe"
ciudad = "Quito"
carrera = "Tecnologia Superior en Inteligencia Artificial"
provincia = "Pichincha"

# Datos numericos enteros (int)
edad = 22
semestre = 1
creditos_aprobados = 0

# Datos numericos decimales (float)
pension_mensual = 220.00
promedio = 0.0
beca_porcentaje = 0.15  # 15% de descuento pionero

# Datos booleanos (bool)
es_estudiante_activo = True
tiene_beca = True
trabaja = False

# Mostrar el perfil
print("=" * 55)
print("PERFIL ESTUDIANTE ITSEIA - PERIODO 1")
print("=" * 55)

print(f"Nombre:          {nombre}")
print(f"Ciudad:          {ciudad}, {provincia}")
print(f"Edad:            {edad} años")
print(f"Carrera:         {carrera}")
print(f"Semestre:        {semestre}")
print(f"Activo:          {es_estudiante_activo}")
print(f"Tiene beca:      {tiene_beca}")
print(f"Trabaja:         {trabaja}")

print("")
print("INFORMACION FINANCIERA:")
pension_con_descuento = pension_mensual * (1 - beca_porcentaje)
print(f"Pension lista:   ${pension_mensual:.2f}/mes")
print(f"Descuento beca:  {beca_porcentaje * 100:.0f}%")
print(f"Pension final:   ${pension_con_descuento:.2f}/mes")

print("")
print("TIPOS DE DATOS USADOS:")
print(f"nombre es tipo:  {type(nombre)}")
print(f"edad es tipo:    {type(edad)}")
print(f"pension es tipo: {type(pension_mensual)}")
print(f"activo es tipo:  {type(es_estudiante_activo)}")
```

3. Ejecuta el programa y verifica la salida.

4. Cambia los valores de las variables por TUS propios datos reales (nombre, ciudad, edad). Mantener la estructura del codigo.

5. Agrega dos variables nuevas: `numero_cedula` (str, no int — por que?) y `fecha_ingreso` (str con formato "Marzo 2026").

## Usa IA para...

> Abre ChatGPT y escribe:
> "En Python, tengo un numero de cedula ecuatoriana como 1720456789. ¿Debo guardarlo como int o como str? Explica por que con 2 razones concretas. Tambien explica la diferencia entre int y float con un ejemplo de precios en dolares."

Despues de leer la respuesta:
- Verifica si tu codigo usa `numero_cedula` correctamente.
- ¿Entiendes ahora por que `0.15` es float y `15` seria int?

## Que aprendiste

- Python tiene 4 tipos basicos: `str`, `int`, `float`, `bool`.
- Las f-strings (f"texto {variable}") permiten insertar variables dentro de texto.
- `type()` revela el tipo de cualquier variable.
- `:.2f` dentro de una f-string formatea un float con 2 decimales.
- El tipo correcto importa: una cedula guardada como `int` perderia el cero inicial si lo tuviera.

## Reto extra

Calcula e imprime el costo total de los 5 semestres de la carrera en ITSEIA. Usa variables para: numero de semestres (5), meses por semestre (5), pension mensual con descuento. Muestra el desglose semestral y el total final.
