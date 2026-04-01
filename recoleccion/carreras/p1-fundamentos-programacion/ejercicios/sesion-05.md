# Ejercicio Sesion 5: Analizador de Precios de Mercado

**Materia:** Fundamentos de Programacion
**Nivel:** Basico
**Herramienta IA:** GitHub Copilot
**Duracion estimada:** 35 min

## Objetivo

Usar bucles `for` y `while` para procesar una lista de precios reales de productos ecuatorianos, calcular estadisticas basicas y detectar anomalias de precio automaticamente.

## Contexto

El INEC publica mensualmente el Indice de Precios al Consumidor (IPC) de Ecuador. Los precios de la canasta basica familiar son datos publicos que cualquier analista de datos debe saber procesar. Vamos a simular un mini-analizador de precios usando datos reales del mercado de Quito (febrero 2026).

## Instrucciones

1. Crea un archivo `sesion05_analizador_precios.py`.

2. Escribe el programa con ambos tipos de bucle:

```python
# Analizador de Precios - Mercado Ecuador
# Fuente: INEC IPC / precios mercados Quito Feb 2026
# Bucles: for y while

print("=" * 58)
print("ANALIZADOR DE PRECIOS - MERCADO QUITO")
print("Datos: INEC / Febrero 2026")
print("=" * 58)

# Dataset real: precios promedio en dolares (USD)
productos = [
    "Arroz 5kg",
    "Aceite 1L",
    "Azucar 2kg",
    "Leche 1L",
    "Pan de molde",
    "Huevos (30)",
    "Pollo entero kg",
    "Papa 5kg",
    "Tomate kg",
    "Platano kg"
]

precios = [3.85, 2.20, 1.75, 0.85, 2.10, 3.90, 3.25, 2.40, 1.20, 0.65]

# ================================================
# BUCLE FOR: procesar todos los items del dataset
# ================================================
print("\n--- LISTADO DE PRECIOS ---")
total = 0
precio_mas_alto = precios[0]
precio_mas_bajo = precios[0]
producto_caro = productos[0]
producto_barato = productos[0]

for i in range(len(productos)):
    producto = productos[i]
    precio = precios[i]
    total += precio

    # Detectar maximo y minimo
    if precio > precio_mas_alto:
        precio_mas_alto = precio
        producto_caro = producto
    if precio < precio_mas_bajo:
        precio_mas_bajo = precio
        producto_barato = producto

    # Marcar productos costosos
    alerta = "  <-- CARO" if precio > 3.00 else ""
    print(f"  {producto:<20} ${precio:.2f}{alerta}")

promedio = total / len(precios)
print(f"\nTotal canasta basica:  ${total:.2f}")
print(f"Promedio por item:     ${promedio:.2f}")
print(f"Producto mas caro:     {producto_caro} (${precio_mas_alto:.2f})")
print(f"Producto mas barato:   {producto_barato} (${precio_mas_bajo:.2f})")

# ================================================
# BUCLE FOR con enumerate: imprimir con indices
# ================================================
print("\n--- RANKING DE PRECIOS (mas caro a mas barato) ---")
# Crear lista de tuplas (precio, producto) y ordenar
ranking = sorted(zip(precios, productos), reverse=True)
for posicion, (precio, producto) in enumerate(ranking, start=1):
    print(f"  {posicion}. {producto:<20} ${precio:.2f}")

# ================================================
# BUCLE WHILE: simulacion de inflacion mensual
# ================================================
print("\n--- SIMULACION DE INFLACION ---")
print("Inflacion mensual Ecuador: 0.3% (dato INEC)")
inflacion = 0.003   # 0.3% mensual
precio_referencia = total
mes = 0
limite_alerta = total * 1.05  # Alerta si supera 5% de incremento

print(f"Canasta inicial: ${total:.2f}")
print(f"Alerta en:       ${limite_alerta:.2f} (+5%)")

while precio_referencia < limite_alerta:
    mes += 1
    precio_referencia *= (1 + inflacion)

print(f"Meses para superar +5%: {mes} meses")
print(f"Precio en mes {mes}:      ${precio_referencia:.2f}")

# ================================================
# BUCLE FOR con range: tabla de descuentos
# ================================================
print("\n--- TABLA DE DESCUENTOS TIENDA COMUNITARIA ---")
print(f"{'Descuento':<15} {'Ahorro':<15} {'Total a pagar'}")
print("-" * 45)
for descuento_pct in range(5, 25, 5):  # 5%, 10%, 15%, 20%
    ahorro = total * (descuento_pct / 100)
    precio_final = total - ahorro
    print(f"{descuento_pct}%{'':<13} ${ahorro:.2f}{'':<9} ${precio_final:.2f}")

print("\n" + "=" * 58)
print("Analisis completado. Datos procesados con Python.")
print("=" * 58)
```

3. Ejecuta y estudia la diferencia entre el bucle `for` con `range(len(...))` y con `enumerate`.

4. Modifica el dataset: agrega 3 productos mas (con sus precios reales del supermercado de tu ciudad) y vuelve a ejecutar. Observa como todos los calculos se actualizan automaticamente.

5. Cambia el porcentaje de inflacion a 0.5% y observa cuanto cambia el resultado del `while`.

## Usa IA para...

> Abre GitHub Copilot (en VS Code) o usa Claude, y escribe:
> "En Python, ¿cual es la diferencia practica entre for con range(len(lista)) vs for item in lista vs for i, item in enumerate(lista)? Dame una regla simple de cuando usar cada uno."

Despues de leer la respuesta:
- Identifica en tu codigo 3 usos de bucle `for` distintos.
- ¿Podrias reemplazar el `while` de inflacion por un `for`? ¿Por que si o no?

## Que aprendiste

- `for i in range(len(lista))` da acceso al indice y al valor con `lista[i]`.
- `for item in lista` es mas limpio cuando solo necesitas el valor.
- `enumerate(lista)` da indice y valor al mismo tiempo.
- `zip(lista1, lista2)` une dos listas para iterar en paralelo.
- `while` es ideal cuando no sabes cuantas veces se repetira el bucle.
- `sorted()` ordena listas; `reverse=True` ordena de mayor a menor.

## Reto extra

Agrega un bucle que calcule cuantos meses de salario minimo ($550) necesita una familia ecuatoriana para comprar exactamente 10 canastas basicas (asumiendo que destina el 40% del salario a alimentacion). Muestra el resultado en meses y en años.
