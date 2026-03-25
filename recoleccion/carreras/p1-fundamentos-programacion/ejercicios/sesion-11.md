# Ejercicio Sesion 11: API Scraper Resistente a Errores

**Materia:** Fundamentos de Programacion
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Usar `try / except / finally` para construir un sistema robusto que consume una API publica, maneja multiples tipos de errores y registra los fallos en un log, sin que el programa se caiga ante datos inesperados.

## Contexto

En produccion, un sistema que consume datos de APIs (Banco Central del Ecuador, INEC, APIs meteorologicas, etc.) SIEMPRE puede fallar: la API puede estar caida, los datos pueden venir corruptos, puede haber problemas de red. Un Data Engineer profesional escribe codigo defensivo que maneja estos errores elegantemente y sigue funcionando.

## Instrucciones

1. Instala la libreria necesaria si no la tienes:
```
pip install requests
```

2. Crea el archivo `sesion11_api_resiliente.py`:

```python
# API Scraper Resistente a Errores
# Fuente de datos: Open Exchange Rates (API publica, sin clave)
# y datos simulados del Banco Central del Ecuador
# Manejo de errores: try / except / finally

import json
import os
from datetime import datetime

# requests es opcional - usamos datos simulados si no esta disponible
try:
    import requests
    REQUESTS_DISPONIBLE = True
except ImportError:
    REQUESTS_DISPONIBLE = False
    print("AVISO: 'requests' no instalado. Usando datos simulados.")

print("=" * 62)
print("SISTEMA DE TASAS Y ESTADISTICAS - ECUADOR")
print("Manejo robusto de errores y fuentes de datos")
print("=" * 62)

LOG_FILE = "sesion11_errores.log"

def registrar_error(contexto, error):
    """Escribe el error en un archivo de log."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    mensaje = f"[{timestamp}] ERROR en {contexto}: {type(error).__name__}: {error}\n"
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(mensaje)
    except Exception as e:
        print(f"  No se pudo escribir el log: {e}")

# ================================================
# FUNCION 1: consumir API real (con manejo de errores)
# ================================================

def obtener_tasa_cambio(moneda_origen="USD", moneda_destino="EUR"):
    """
    Intenta obtener la tasa de cambio desde una API publica.
    Si falla, usa un valor de respaldo (fallback).
    """
    url = f"https://api.exchangerate-api.com/v4/latest/{moneda_origen}"
    tasa_fallback = {"EUR": 0.92, "GBP": 0.79, "COP": 4200.0, "PEN": 3.75, "BRL": 5.10}

    try:
        if not REQUESTS_DISPONIBLE:
            raise ImportError("requests no disponible")

        print(f"\nConsultando API: {url}")
        respuesta = requests.get(url, timeout=5)
        respuesta.raise_for_status()   # lanza error si status >= 400

        datos = respuesta.json()
        tasa = datos["rates"][moneda_destino]
        print(f"  Tasa {moneda_origen}/{moneda_destino}: {tasa} (DATOS REALES)")
        return tasa

    except ImportError:
        print(f"  Usando tasa de respaldo: {tasa_fallback.get(moneda_destino, 1.0)}")
        return tasa_fallback.get(moneda_destino, 1.0)

    except KeyError as e:
        registrar_error("obtener_tasa_cambio", e)
        print(f"  ERROR: Moneda '{moneda_destino}' no encontrada en la API.")
        return tasa_fallback.get(moneda_destino, 1.0)

    except Exception as e:
        registrar_error("obtener_tasa_cambio", e)
        print(f"  ERROR de conexion: {type(e).__name__}. Usando respaldo.")
        return tasa_fallback.get(moneda_destino, 1.0)

    finally:
        print("  Consulta de tasa finalizada.")   # siempre se ejecuta


# ================================================
# FUNCION 2: procesar datos con posibles errores
# ================================================

# Dataset con datos intencionalmente "sucios"
datos_indicadores_bce = [
    {"indicador": "PIB 2024",        "valor": "115.4",   "unidad": "miles_millones_usd"},
    {"indicador": "Inflacion Dic",   "valor": "1.34",    "unidad": "porcentaje"},
    {"indicador": "Desempleo Q4",    "valor": "3.8",     "unidad": "porcentaje"},
    {"indicador": "Exportaciones",   "valor": "N/D",     "unidad": "miles_millones_usd"},  # dato faltante
    {"indicador": "Remesas 2024",    "valor": "4.3",     "unidad": "miles_millones_usd"},
    {"indicador": "Deuda/PIB",       "valor": "57.2",    "unidad": "porcentaje"},
    {"indicador": "Reservas BCE",    "valor": "None",    "unidad": "miles_millones_usd"},  # dato nulo
    {"indicador": "SBU 2025",        "valor": "550",     "unidad": "usd_mensuales"},
    {"indicador": "Tasa activa",     "valor": "abc",     "unidad": "porcentaje"},          # dato corrupto
    {"indicador": "Tasa pasiva",     "valor": "5.25",    "unidad": "porcentaje"},
]

def procesar_indicadores(datos):
    """Procesa una lista de indicadores economicos con manejo de errores."""
    print("\n--- INDICADORES ECONOMICOS ECUADOR (BCE) ---")
    exitosos = []
    fallidos = []

    for item in datos:
        indicador = item["indicador"]
        valor_raw = item["valor"]
        unidad = item["unidad"]

        try:
            # Intentar convertir a float
            if valor_raw in ("N/D", "None", None, ""):
                raise ValueError(f"Dato faltante o nulo: '{valor_raw}'")

            valor = float(valor_raw)

            # Validar rango razonable
            if unidad == "porcentaje" and not (0 <= valor <= 100):
                raise ValueError(f"Porcentaje fuera de rango: {valor}")

            exitosos.append({"indicador": indicador, "valor": valor, "unidad": unidad})
            print(f"  OK  {indicador:<20}: {valor:>8.2f} {unidad}")

        except ValueError as e:
            fallidos.append(indicador)
            registrar_error(f"indicador:{indicador}", e)
            print(f"  ERR {indicador:<20}: {str(e)[:40]}")

        except Exception as e:
            fallidos.append(indicador)
            registrar_error(f"indicador:{indicador}", e)
            print(f"  ERR {indicador:<20}: Error inesperado")

    print(f"\n  Procesados exitosamente: {len(exitosos)}/{len(datos)}")
    print(f"  Con errores:             {len(fallidos)} - Ver {LOG_FILE}")
    return exitosos

# ================================================
# EJECUTAR
# ================================================

# Tasas de cambio
tasa_eur = obtener_tasa_cambio("USD", "EUR")
tasa_cop = obtener_tasa_cambio("USD", "COP")
tasa_desconocida = obtener_tasa_cambio("USD", "XYZ")  # moneda inexistente

# Indicadores
indicadores_ok = procesar_indicadores(datos_indicadores_bce)

# ================================================
# USAR los datos exitosos para calcular
# ================================================
print("\n--- CALCULOS CON DATOS VALIDADOS ---")

try:
    pib = next(i["valor"] for i in indicadores_ok if "PIB" in i["indicador"])
    sbu = next(i["valor"] for i in indicadores_ok if "SBU" in i["indicador"])
    remesas = next(i["valor"] for i in indicadores_ok if "Remesas" in i["indicador"])

    print(f"PIB Ecuador 2024:     ${pib:.1f}B")
    print(f"SBU mensual:          ${sbu:.2f}")
    print(f"Remesas / PIB:        {(remesas / pib) * 100:.1f}%")
    print(f"SBU anual:            ${sbu * 12:,.2f}")

    # Conversion a otras monedas
    pib_eur = pib * tasa_eur
    print(f"PIB en euros:         {pib_eur:.1f}B EUR")

except StopIteration as e:
    print(f"ERROR: No se encontro un indicador esperado. {e}")
    registrar_error("calculos_finales", e)

# ================================================
# VERIFICAR EL LOG
# ================================================
print(f"\n--- LOG DE ERRORES ({LOG_FILE}) ---")
try:
    with open(LOG_FILE, "r", encoding="utf-8") as f:
        contenido = f.read()
        if contenido:
            print(contenido)
        else:
            print("  Log vacio (sin errores!)")
except FileNotFoundError:
    print("  No se generaron errores.")

print("\n" + "=" * 62)
```

3. Ejecuta el programa. Observa como los errores no detienen el programa.

4. Abre `sesion11_errores.log` y lee los errores registrados. Verifica que coinciden con los datos sucios del dataset.

5. Agrega una nueva funcion `validar_cedula_ecuador(cedula)` que verifique si una cadena es una cedula ecuatoriana valida (10 digitos numericos). Si no es valida, lanza un `ValueError` con un mensaje descriptivo. Prueba con cedulas validas e invalidas.

## Usa IA para...

> Abre ChatGPT y escribe:
> "En Python, ¿cual es la diferencia entre except Exception as e, except ValueError, y except (ValueError, TypeError)? ¿Cuando debo usar cada uno? ¿Por que es mala practica usar solo 'except:' sin especificar el tipo de error?"

Despues de leer la respuesta:
- Revisa tu codigo y verifica que cada `except` captura el error mas especifico posible.
- ¿Hay algun `except Exception` que podrias reemplazar por algo mas especifico?

## Que aprendiste

- `try / except` captura errores sin detener el programa.
- `except TipoError as e` captura el error especifico y lo guarda en `e`.
- `finally` siempre se ejecuta, haya error o no (ideal para cerrar conexiones).
- Es mejor capturar errores especificos que `except Exception` generico.
- Un sistema robusto registra los errores en un log para poder analizarlos despues.
- `raise_for_status()` de requests lanza error si el HTTP status es 4xx o 5xx.

## Reto extra

Implementa un sistema de reintentos: si la API falla, intenta hasta 3 veces con una espera de 1 segundo entre intentos (`import time; time.sleep(1)`). Usa un bucle `while` con contador de intentos. Si los 3 intentos fallan, registra en el log "MAX REINTENTOS ALCANZADO" y usa el valor de respaldo.
