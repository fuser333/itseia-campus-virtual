# Ejercicio Sesion 10: Logger de Transacciones Financieras

**Materia:** Fundamentos de Programacion
**Nivel:** Basico - Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Usar lectura y escritura de archivos en Python para crear un sistema de registro de transacciones que guarda, lee y analiza pagos de estudiantes ITSEIA en formato CSV y TXT.

## Contexto

Todo sistema financiero genera logs de transacciones. El SRI (Servicio de Rentas Internas) de Ecuador exige registros digitales de todas las transacciones comerciales. Un data engineer debe saber leer y escribir archivos de datos para procesar esos logs. Vamos a construir el sistema de registro de pagos de ITSEIA.

## Instrucciones

1. Crea una carpeta `sesion10_archivos/` dentro de tu carpeta de ejercicios.

2. Crea el archivo `sesion10_logger_pagos.py` en esa carpeta:

```python
# Logger de Pagos - Sistema Financiero ITSEIA
# Manejo de archivos: escritura, lectura, append
# Formatos: TXT y CSV

import os
from datetime import datetime

print("=" * 60)
print("SISTEMA DE REGISTRO DE PAGOS - ITSEIA")
print("Periodo: Marzo 2026")
print("=" * 60)

# Directorio de trabajo (ajusta si es necesario)
DIR_BASE = "sesion10_archivos"
ARCHIVO_LOG = os.path.join(DIR_BASE, "pagos_marzo2026.txt")
ARCHIVO_CSV = os.path.join(DIR_BASE, "pagos_marzo2026.csv")
ARCHIVO_REPORTE = os.path.join(DIR_BASE, "reporte_mensual.txt")

os.makedirs(DIR_BASE, exist_ok=True)

# ================================================
# ESCRITURA: crear archivo de transacciones
# ================================================

# Datos de transacciones del mes
transacciones = [
    ("2026-03-01", "1720456789", "Maria Fernanda Quispe",    "Pension",     187.00, "Transferencia"),
    ("2026-03-01", "0912345678", "Diego Esteban Mora",        "Pension",     220.00, "Deposito"),
    ("2026-03-01", "1802345671", "Camila Andrade Torres",     "Pension",     187.00, "Transferencia"),
    ("2026-03-02", "0601234567", "Luis Miguel Vera",          "Pension",     220.00, "Efectivo"),
    ("2026-03-02", "1712345678", "Sofia Paola Jara",          "Pension",     220.00, "Transferencia"),
    ("2026-03-05", "0712345678", "Roberto Carlos Paz",        "Pension",     220.00, "Deposito"),
    ("2026-03-01", "1720456789", "Maria Fernanda Quispe",     "Material",     45.00, "Transferencia"),
    ("2026-03-03", "1802345671", "Camila Andrade Torres",     "Certificado",  25.00, "Efectivo"),
    ("2026-03-10", "0912345678", "Diego Esteban Mora",        "Material",     45.00, "Deposito"),
    ("2026-03-15", "9999999999", "TEST - Transaccion Error",  "Pension",       0.00, "ERROR"),
]

# Escribir archivo TXT con formato legible
print(f"\nEscribiendo log de pagos en: {ARCHIVO_LOG}")
with open(ARCHIVO_LOG, "w", encoding="utf-8") as f:
    f.write("=" * 70 + "\n")
    f.write("LOG DE PAGOS - ITSEIA\n")
    f.write(f"Generado: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    f.write("=" * 70 + "\n\n")

    for fecha, cedula, nombre, concepto, monto, metodo in transacciones:
        linea = (f"[{fecha}] | {cedula} | {nombre:<28} | "
                 f"{concepto:<12} | ${monto:>7.2f} | {metodo}\n")
        f.write(linea)

    f.write(f"\nTotal registros: {len(transacciones)}\n")
print(f"  Archivo TXT creado: {os.path.getsize(ARCHIVO_LOG)} bytes")

# Escribir archivo CSV
print(f"Escribiendo CSV en: {ARCHIVO_CSV}")
with open(ARCHIVO_CSV, "w", encoding="utf-8") as f:
    # Encabezado
    f.write("fecha,cedula,nombre,concepto,monto,metodo\n")
    for fecha, cedula, nombre, concepto, monto, metodo in transacciones:
        f.write(f"{fecha},{cedula},{nombre},{concepto},{monto},{metodo}\n")
print(f"  Archivo CSV creado: {os.path.getsize(ARCHIVO_CSV)} bytes")

# ================================================
# LECTURA: leer y procesar el CSV
# ================================================
print("\n--- LECTURA Y ANALISIS DEL CSV ---")

registros_leidos = []
with open(ARCHIVO_CSV, "r", encoding="utf-8") as f:
    encabezado = f.readline()  # saltar primera linea
    for linea in f:
        linea = linea.strip()
        if linea:
            campos = linea.split(",")
            registros_leidos.append({
                "fecha": campos[0],
                "cedula": campos[1],
                "nombre": campos[2],
                "concepto": campos[3],
                "monto": float(campos[4]),
                "metodo": campos[5]
            })

print(f"Registros leidos: {len(registros_leidos)}")

# Calcular totales por concepto
totales = {}
for r in registros_leidos:
    concepto = r["concepto"]
    totales[concepto] = totales.get(concepto, 0) + r["monto"]

print("\nTotales por concepto:")
for concepto, total in sorted(totales.items()):
    print(f"  {concepto:<15}: ${total:>8.2f}")

gran_total = sum(r["monto"] for r in registros_leidos)
print(f"\nGran total recaudado: ${gran_total:,.2f}")

# Detectar transacciones ERROR
errores = [r for r in registros_leidos if r["metodo"] == "ERROR"]
print(f"Transacciones con ERROR: {len(errores)}")

# ================================================
# APPEND: agregar nuevos pagos al log existente
# ================================================
print("\n--- AGREGAR PAGO NUEVO ---")
nuevo_pago = ("2026-03-20", "0512345670", "Ana Lucia Rosero",
              "Pension", 220.00, "Transferencia")

with open(ARCHIVO_LOG, "a", encoding="utf-8") as f:
    fecha, cedula, nombre, concepto, monto, metodo = nuevo_pago
    linea = (f"[{fecha}] | {cedula} | {nombre:<28} | "
             f"{concepto:<12} | ${monto:>7.2f} | {metodo}\n")
    f.write(linea)
print(f"Pago de {nuevo_pago[2]} agregado al log.")

# ================================================
# GENERAR REPORTE
# ================================================
print(f"\nGenerando reporte en: {ARCHIVO_REPORTE}")
with open(ARCHIVO_REPORTE, "w", encoding="utf-8") as f:
    f.write("REPORTE MENSUAL DE INGRESOS - ITSEIA\n")
    f.write(f"Periodo: Marzo 2026\n")
    f.write(f"Generado: {datetime.now().strftime('%Y-%m-%d')}\n")
    f.write("=" * 40 + "\n")
    for concepto, total in sorted(totales.items()):
        f.write(f"{concepto}: ${total:.2f}\n")
    f.write("=" * 40 + "\n")
    f.write(f"TOTAL: ${gran_total:.2f}\n")

# Leer y mostrar reporte
print("\nContenido del reporte:")
with open(ARCHIVO_REPORTE, "r", encoding="utf-8") as f:
    print(f.read())

print("=" * 60)
```

3. Ejecuta el programa. Verifica que se crean los 3 archivos en `sesion10_archivos/`.

4. Abre los archivos con un editor de texto y verifica que el contenido es correcto.

5. Agrega una funcion `buscar_pagos_por_cedula(archivo_csv, cedula)` que lea el CSV y devuelva todos los pagos de un estudiante especifico.

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "En Python, ¿cual es la diferencia entre abrir un archivo con modo 'w', 'a', 'r', y 'r+'? ¿Que pasa si abro un archivo existente con 'w'? ¿Por que se recomienda usar 'with open()' en lugar de open() / close() por separado?"

Despues de leer la respuesta:
- Verifica que tu codigo siempre usa `with open()`.
- ¿Que pasaria si usaras `"w"` en lugar de `"a"` al agregar el nuevo pago?

## Que aprendiste

- `open(archivo, "w")` crea o sobreescribe; `"a"` agrega al final; `"r"` solo lee.
- `with open() as f:` cierra el archivo automaticamente aunque haya errores.
- `.readline()` lee una linea; `.readlines()` devuelve lista; iteracion `for linea in f` es eficiente.
- `.write(texto)` escribe sin newline; debes agregar `"\n"` tu mismo.
- `os.makedirs(dir, exist_ok=True)` crea carpetas sin error si ya existen.
- El formato CSV es texto plano con campos separados por comas.

## Reto extra

Implementa una funcion `detectar_duplicados(archivo_csv)` que lea el CSV y detecte si hay pagos del mismo concepto para la misma cedula en el mismo mes. Lista los duplicados encontrados y calcula el monto total duplicado. Usa los datos del ejercicio como prueba.
