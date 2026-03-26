# Ejercicio Sesion 2: Limpieza Avanzada con Regex

**Materia:** Procesamiento de Datos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Dominar expresiones regulares (regex) para limpiar datos de texto no estructurado: extraer RUCs, estandarizar telefonos ecuatorianos, limpiar nombres, validar emails y parsear descripciones de productos.

## Contexto

Los datos del mundo real vienen sucios: telefonos escritos como "0998-765-432", "(09)98765432", "09 98 765 432" o "+593998765432" — todos el mismo numero pero 4 formatos distintos. Regex permite limpiar todos en una linea de codigo. El SRI Ecuador tiene millones de registros con este tipo de inconsistencias que deben estandarizarse antes de cualquier analisis.

## Instrucciones

1. Crea el archivo `sesion02_limpieza_regex_ecuador.py`:

```python
# Limpieza con Regex - ITSEIA Procesamiento de Datos
# Estandarizacion de datos textuales Ecuador
# RUC, telefonos, emails, nombres, productos

import pandas as pd
import numpy as np
import re
from datetime import datetime

print("=" * 65)
print("LIMPIEZA AVANZADA CON REGEX — DATOS ECUADOR")
print("=" * 65)

# ================================================
# DATASET: registros empresas con datos sucios
# ================================================
registros_sucios = [
    {"razon_social": "  QUISPE LEMA, maria fernanda  ",
     "ruc": "1720456789001",
     "telefono": "0998-765-432",
     "email": "mquispe@gmail.com",
     "descripcion": "Vende  arroz diana 1kg y aceite la  favorita"},
    {"razon_social": "MORA  BELTRAN DIEGO ESTEBAN",
     "ruc": "09-1234567-8001",
     "telefono": "(09)98765432",
     "email": "DMORA@HOTMAIL.COM",
     "descripcion": "Distribuye  productos  lacteos  y  carnes"},
    {"razon_social": "ana TORRES s.a.",
     "ruc": "1802345671  001",
     "telefono": "09 97 654 321",
     "email": "ana.torres@empresa",  # invalido
     "descripcion": "Exporta banano   orgánico y cacao fino"},
    {"razon_social": "VERA & CIA LTDA.",
     "ruc": "0601234567001",
     "telefono": "+593-99-765-4321",
     "email": "vera.cia@yahoo.com.ec",
     "descripcion": "Importa equipos medicos y reactivos"},
    {"razon_social": "JARA Sofia Paola",
     "ruc": "17-12345-678-001",  # formato incorrecto
     "telefono": "99 876 54 32",  # falta el 0
     "email": "sjara@",  # invalido
     "descripcion": "Presta servicios de consultoria   en tecnología"},
]

df = pd.DataFrame(registros_sucios)
print(f"Registros con datos sucios: {len(df)}")
print(f"Datos originales:")
for i, row in df.iterrows():
    print(f"  [{i}] {row['razon_social'][:30]} | {row['ruc']} | {row['telefono']}")

# ================================================
# LIMPIEZA 1: RAZON SOCIAL
# ================================================
print("\n--- LIMPIEZA RAZON SOCIAL ---")

def limpiar_razon_social(nombre):
    """Estandariza nombre de empresa a Title Case."""
    if not isinstance(nombre, str):
        return nombre
    # Quitar espacios multiples
    nombre = re.sub(r'\s+', ' ', nombre.strip())
    # Title case pero mantener siglas SA, CIA, LTDA
    palabras = nombre.split()
    siglas = {'SA', 'CIA', 'LTDA', 'SRL', 'EP', 'EP', 'CIA.', 'S.A.'}
    resultado = []
    for p in palabras:
        if p.upper() in siglas or re.match(r'^[A-Z]+\.$', p):
            resultado.append(p.upper())
        else:
            resultado.append(p.title())
    return ' '.join(resultado)

df['razon_social_limpia'] = df['razon_social'].apply(limpiar_razon_social)
for orig, limpio in zip(df['razon_social'], df['razon_social_limpia']):
    print(f"  '{orig.strip()}' → '{limpio}'")

# ================================================
# LIMPIEZA 2: RUC Ecuador (13 digitos)
# ================================================
print("\n--- VALIDACION Y LIMPIEZA RUC ---")

def limpiar_ruc(ruc):
    """Limpia RUC: solo digitos, debe tener 13."""
    if not isinstance(ruc, str):
        return None, False
    limpio = re.sub(r'[^0-9]', '', ruc)  # solo numeros
    valido = len(limpio) == 13
    return limpio, valido

df[['ruc_limpio','ruc_valido']] = df['ruc'].apply(
    lambda x: pd.Series(limpiar_ruc(x))
)
for orig, limpio, valido in zip(df['ruc'], df['ruc_limpio'], df['ruc_valido']):
    estado = "VALIDO" if valido else "INVALIDO"
    print(f"  '{orig}' → '{limpio}' [{estado}]")

# ================================================
# LIMPIEZA 3: TELEFONOS Ecuador
# ================================================
print("\n--- ESTANDARIZACION TELEFONOS ECUADOR ---")

def estandarizar_telefono(tel):
    """
    Estandariza telefonos Ecuador a formato: 09XXXXXXXX (10 digitos)
    Acepta: 0998765432, (09)98765432, 09-987-654-32,
            09 98 765 432, +593998765432, 99 876 54 32
    """
    if not isinstance(tel, str):
        return None

    # Solo digitos
    solo_digits = re.sub(r'[^0-9]', '', tel)

    # Eliminar codigo pais Ecuador (+593 → 593)
    if solo_digits.startswith('593'):
        solo_digits = '0' + solo_digits[3:]

    # Si tiene 9 digitos y empieza con 9, agregar 0 al inicio
    if len(solo_digits) == 9 and solo_digits.startswith('9'):
        solo_digits = '0' + solo_digits

    # Validar: debe ser 10 digitos, empezar con 09 (movil) o 02-07 (fijo)
    if len(solo_digits) == 10:
        if re.match(r'^09\d{8}$', solo_digits):
            return solo_digits  # movil valido
        if re.match(r'^0[2-7]\d{7}$', solo_digits):
            return solo_digits  # fijo valido

    return None  # invalido

df['telefono_limpio'] = df['telefono'].apply(estandarizar_telefono)
for orig, limpio in zip(df['telefono'], df['telefono_limpio']):
    valido = "OK" if limpio else "INVALIDO"
    print(f"  '{orig}' → '{limpio}' [{valido}]")

# ================================================
# LIMPIEZA 4: EMAILS
# ================================================
print("\n--- VALIDACION EMAILS ---")

PATRON_EMAIL = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'

def validar_email(email):
    if not isinstance(email, str):
        return None, False
    email_lower = email.lower().strip()
    valido = bool(re.match(PATRON_EMAIL, email_lower))
    return email_lower, valido

df[['email_limpio','email_valido']] = df['email'].apply(
    lambda x: pd.Series(validar_email(x))
)
for orig, limpio, valido in zip(df['email'], df['email_limpio'], df['email_valido']):
    estado = "OK" if valido else "INVALIDO"
    print(f"  '{orig}' → '{limpio}' [{estado}]")

# ================================================
# LIMPIEZA 5: TEXTO DESCRIPCION
# ================================================
print("\n--- LIMPIEZA TEXTO DESCRIPCION ---")

def limpiar_descripcion(texto):
    if not isinstance(texto, str):
        return texto
    # Quitar espacios multiples
    texto = re.sub(r'\s+', ' ', texto.strip())
    # Quitar caracteres especiales no deseados (mantener letras, numeros, acentos, puntuacion basica)
    texto = re.sub(r'[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9 .,%-]', '', texto)
    # Primera letra en mayuscula
    return texto[0].upper() + texto[1:] if texto else texto

df['descripcion_limpia'] = df['descripcion'].apply(limpiar_descripcion)
for orig, limpio in zip(df['descripcion'], df['descripcion_limpia']):
    print(f"  '{orig}' → '{limpio}'")

# ================================================
# EXTRACCION: PATRONES CON REGEX
# ================================================
print("\n--- EXTRACCION DE PATRONES ---")

textos_facturas = [
    "Factura #001-001-000045231 emitida el 25/03/2024 por $1,234.56",
    "RUC: 1720456789001 | Factura: 002-001-000012345 | Fecha: 15-01-2024",
    "Pago pendiente $456.78 segun factura 003001000067890 del 2024/02/28",
]

print("  Extraccion de numeros de factura:")
patron_factura = r'\b0{3}-\d{3}-\d{9}\b|\b\d{15}\b'
for texto in textos_facturas:
    facturas = re.findall(patron_factura, texto)
    fechas   = re.findall(r'\d{2}[/\-]\d{2}[/\-]\d{4}|\d{4}[/\-]\d{2}[/\-]\d{2}', texto)
    montos   = re.findall(r'\$[\d,]+\.?\d*', texto)
    print(f"  Texto: {texto[:50]}...")
    print(f"    Facturas: {facturas} | Fechas: {fechas} | Montos: {montos}")

# ================================================
# RESUMEN CALIDAD
# ================================================
print("\n" + "=" * 65)
print("RESUMEN LIMPIEZA CON REGEX")
print(f"  Razon social:  5/5 estandarizadas")
print(f"  RUC validos:   {df['ruc_valido'].sum()}/5")
print(f"  Telefonos OK:  {df['telefono_limpio'].notna().sum()}/5")
print(f"  Emails validos:{df['email_valido'].sum()}/5")
print("=" * 65)
```

2. Ejecuta el codigo. Identifica cuantos registros tienen todos los campos validos.

3. Agrega una funcion `validar_cedula_ecuador(cedula)` que implemente el algoritmo de validacion de cedula ecuatoriana (digito verificador).

## Usa IA para...

> Abre Claude y escribe:
> "En Python, ¿como valido una cedula de identidad ecuatoriana usando regex y el algoritmo del digito verificador? La cedula tiene 10 digitos y el ultimo es el digito de control calculado con el algoritmo modulo 10. Dame el codigo completo con casos de prueba."

Despues de leer la respuesta:
- Implementa la funcion en el codigo del ejercicio.
- Prueba con 5 cedulas validas reales de Ecuador (de datos publicos o inventadas).

## Que aprendiste

- `re.sub(r'patron', reemplazo, texto)` reemplaza patrones en strings.
- `re.findall(r'patron', texto)` extrae todas las coincidencias.
- `re.match(r'patron', texto)` verifica si el texto EMPIEZA con el patron.
- `\d` = digito, `\s` = espacio, `\w` = alfanumerico, `+` = uno o mas, `*` = cero o mas.
- Las expresiones regulares son la herramienta mas potente para limpiar datos textuales.
- `[^0-9]` es una clase de caracteres negada: todo excepto digitos del 0 al 9.

## Reto extra

Construye un "validador de datos tributarios Ecuador" que reciba un archivo CSV con columnas RUC, cedula, telefono, email y genere un reporte de calidad con: porcentaje valido de cada campo, lista de registros invalidos con el motivo especifico, y un score general. Usa los patrones regex del ejercicio.
