# Ejercicio Sesion 8: Base de Datos de Estudiantes con Diccionarios

**Materia:** Fundamentos de Programacion
**Nivel:** Basico
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Usar diccionarios y sets para construir y consultar una base de datos de estudiantes ITSEIA, simulando las operaciones basicas de un sistema de gestion academica: agregar, buscar, actualizar y analizar datos.

## Contexto

Todo sistema de gestion academica (SGA) usa estructuras de clave-valor para almacenar expedientes de estudiantes. Un diccionario en Python es el equivalente directo de un registro JSON o una fila de base de datos. Dominar los diccionarios es prerequisito para trabajar con APIs, JSON y MongoDB.

## Instrucciones

1. Crea un archivo `sesion08_base_datos_estudiantes.py`.

2. Construye el sistema de gestion:

```python
# Sistema de Gestion Academica - ITSEIA
# Estructuras: diccionarios y sets
# Semestre 1, Periodo Marzo 2026

print("=" * 60)
print("SISTEMA DE GESTION ACADEMICA - ITSEIA")
print("Periodo: Marzo - Agosto 2026")
print("=" * 60)

# ================================================
# DICCIONARIO PRINCIPAL: base de datos estudiantes
# Clave: numero de cedula | Valor: dict con datos
# ================================================

estudiantes = {
    "1720456789": {
        "nombre": "Maria Fernanda Quispe",
        "edad": 22,
        "ciudad": "Quito",
        "carrera": "IA",
        "semestre": 1,
        "notas": {"Python": 9.2, "Matematicas": 8.5, "Estadistica": 8.8},
        "fraternidad": "Luma",
        "beca": True,
        "pension": 187.00
    },
    "0912345678": {
        "nombre": "Diego Esteban Mora",
        "edad": 24,
        "ciudad": "Guayaquil",
        "carrera": "Big Data",
        "semestre": 1,
        "notas": {"Python": 8.0, "Matematicas": 9.1, "Estadistica": 7.5},
        "fraternidad": "Neo",
        "beca": False,
        "pension": 220.00
    },
    "1802345671": {
        "nombre": "Camila Andrade Torres",
        "edad": 21,
        "ciudad": "Ambato",
        "carrera": "Ciencia de Datos",
        "semestre": 1,
        "notas": {"Python": 9.5, "Matematicas": 9.0, "Estadistica": 9.3},
        "fraternidad": "Luma",
        "beca": True,
        "pension": 187.00
    },
    "0601234567": {
        "nombre": "Luis Miguel Vera",
        "edad": 25,
        "ciudad": "Riobamba",
        "carrera": "IA",
        "semestre": 1,
        "notas": {"Python": 7.2, "Matematicas": 6.8, "Estadistica": 7.5},
        "fraternidad": "Neo",
        "beca": False,
        "pension": 220.00
    },
    "1712345678": {
        "nombre": "Sofia Paola Jara",
        "edad": 23,
        "ciudad": "Quito",
        "carrera": "IA",
        "semestre": 1,
        "notas": {"Python": 8.7, "Matematicas": 8.2, "Estadistica": 8.9},
        "fraternidad": "Luma",
        "beca": False,
        "pension": 220.00
    },
}

# ================================================
# CONSULTAS CON DICCIONARIOS
# ================================================

print("\n--- LISTADO GENERAL ---")
for cedula, datos in estudiantes.items():
    promedio = sum(datos["notas"].values()) / len(datos["notas"])
    estado = "APROBADO" if promedio >= 7.0 else "RIESGO"
    print(f"  {datos['nombre']:<28} | {datos['carrera']:<18} | "
          f"Prom: {promedio:.2f} | {estado}")

# ================================================
# BUSCAR por cedula
# ================================================
print("\n--- BUSQUEDA POR CEDULA ---")
cedula_buscar = "1802345671"
if cedula_buscar in estudiantes:
    est = estudiantes[cedula_buscar]
    print(f"Encontrado: {est['nombre']}")
    print(f"  Ciudad:      {est['ciudad']}")
    print(f"  Carrera:     {est['carrera']}")
    print(f"  Fraternidad: {est['fraternidad']}")
    print(f"  Beca:        {'Si' if est['beca'] else 'No'}")
    print(f"  Pension:     ${est['pension']:.2f}/mes")
    print(f"  Notas:")
    for materia, nota in est["notas"].items():
        print(f"    {materia:<15}: {nota}")
else:
    print(f"Cedula {cedula_buscar} no encontrada.")

# ================================================
# AGREGAR y ACTUALIZAR
# ================================================
print("\n--- AGREGAR NUEVO ESTUDIANTE ---")
nueva_cedula = "0712345678"
estudiantes[nueva_cedula] = {
    "nombre": "Roberto Carlos Paz",
    "edad": 26,
    "ciudad": "Loja",
    "carrera": "Big Data",
    "semestre": 1,
    "notas": {"Python": 8.5, "Matematicas": 7.8, "Estadistica": 8.1},
    "fraternidad": "Neo",
    "beca": False,
    "pension": 220.00
}
print(f"Estudiante agregado. Total: {len(estudiantes)}")

# Actualizar una nota
estudiantes["0601234567"]["notas"]["Matematicas"] = 7.5
print(f"Nota actualizada para Luis Vera (Matematicas): 7.5")

# ================================================
# SETS: ciudades y fraternidades unicas
# ================================================
print("\n--- ANALISIS CON SETS ---")
ciudades = {datos["ciudad"] for datos in estudiantes.values()}
fraternidades = {datos["fraternidad"] for datos in estudiantes.values()}
carreras_set = {datos["carrera"] for datos in estudiantes.values()}

print(f"Ciudades de origen:  {ciudades}")
print(f"Fraternidades:       {fraternidades}")
print(f"Carreras activas:    {carreras_set}")

# Operaciones de conjuntos
quito_set = {ced for ced, d in estudiantes.items() if d["ciudad"] == "Quito"}
luma_set = {ced for ced, d in estudiantes.items() if d["fraternidad"] == "Luma"}
quito_y_luma = quito_set & luma_set   # interseccion
print(f"\nEstudiantes de Quito EN Luma: {len(quito_y_luma)}")

# ================================================
# ESTADISTICAS
# ================================================
print("\n--- ESTADISTICAS GENERALES ---")
total_ingresos = sum(d["pension"] for d in estudiantes.values())
con_beca = sum(1 for d in estudiantes.values() if d["beca"])
print(f"Total estudiantes:   {len(estudiantes)}")
print(f"Con beca:            {con_beca} ({con_beca/len(estudiantes)*100:.0f}%)")
print(f"Ingresos mensuales:  ${total_ingresos:,.2f}")

print("\n" + "=" * 60)
```

3. Ejecuta y analiza las diferencias entre `dict.items()`, `dict.keys()` y `dict.values()`.

4. Agrega una funcion `buscar_por_carrera(bd, carrera)` que reciba el diccionario completo y devuelva solo los estudiantes de una carrera especifica.

5. Agrega TUS propios datos como un nuevo estudiante (puedes inventar la cedula como "9999999999").

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Tengo un diccionario de estudiantes en Python. Explica la diferencia entre dict.get('clave', valor_por_defecto) y dict['clave']. ¿Cual es mas seguro y por que? Dame un ejemplo donde el primero evita un error."

Despues de leer la respuesta:
- Busca en tu codigo un lugar donde usas `datos["clave"]` directamente.
- Reemplazalo por `.get()` con un valor por defecto apropiado.

## Que aprendiste

- Los diccionarios usan pares clave-valor: `{"clave": valor}`.
- `.items()` devuelve clave y valor juntos para iterar.
- `.get(clave, default)` evita errores si la clave no existe.
- Los diccionarios son anidables: puedes tener un dict dentro de otro dict.
- Los sets `{}` almacenan valores unicos sin orden.
- Las operaciones de conjuntos (`&`, `|`, `-`) filtran datos eficientemente.

## Reto extra

Implementa una funcion `generar_reporte_fraternidad(bd, fraternidad)` que muestre: lista de estudiantes, promedio general de notas por materia, total de ingresos por pension, y el estudiante con mejor promedio de esa fraternidad. Ejecutala para Luma y para Neo.
