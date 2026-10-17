# Ejercicio Sesion 1: Clases y Objetos en Python

**Materia:** Programacion Orientada a Objetos
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 30 min

## Objetivo

Comprender la diferencia entre clase y objeto creando un modelo de datos para una tienda de tecnologia en Ecuador, definiendo la estructura basica con `class` e instanciando objetos reales.

## Contexto

En Ecuador, el sector de comercio electronico crece un 35% anual segun la Camara Ecuatoriana de Comercio Electronico (CECE). Tiendas como Comandato, Almacenes Juan Elia y TIA manejan miles de productos. Para sistematizar ese catalogo con Python, necesitamos entender clases y objetos: la clase es el molde (el plano del producto), el objeto es el producto concreto en el inventario.

## Instrucciones

1. Abre VS Code o Google Colab y crea el archivo `sesion01_clases_objetos.py`.

2. Escribe la siguiente clase que modela un producto de una tienda ecuatoriana:

```python
# Programacion Orientada a Objetos - Sesion 1
# ITSEIA - Periodo 2
# Estudiante: [Tu nombre]

class Producto:
    # Atributo de clase (compartido por todos los objetos)
    pais_origen_tienda = "Ecuador"

    # Definicion minima: clase sin metodos todavia
    pass


# Crear objetos (instancias) de la clase Producto
laptop = Producto()
celular = Producto()
tablet = Producto()

# Asignar atributos directamente al objeto (atributos de instancia dinamicos)
laptop.nombre = "Laptop HP 14"
laptop.precio = 650.00
laptop.stock = 12

celular.nombre = "Samsung Galaxy A34"
celular.precio = 320.00
celular.stock = 45

tablet.nombre = "iPad 9na generacion"
tablet.precio = 480.00
tablet.stock = 8

# Mostrar la informacion
print("=" * 55)
print("INVENTARIO - TIENDA TECH QUITO")
print("Pais:", Producto.pais_origen_tienda)
print("=" * 55)

productos = [laptop, celular, tablet]
for p in productos:
    print(f"Producto : {p.nombre}")
    print(f"Precio   : ${p.precio:.2f}")
    print(f"Stock    : {p.stock} unidades")
    print("-" * 40)

# Verificar que son objetos distintos de la misma clase
print(type(laptop))
print(isinstance(celular, Producto))
```

3. Ejecuta el codigo y verifica la salida.

4. Agrega un cuarto producto: una cafetera Oster ($89.00, 30 unidades). Imprimelo dentro del mismo bucle.

5. Cambia el atributo de clase `pais_origen_tienda` a `"Ecuador - Quito"` usando `Producto.pais_origen_tienda = "Ecuador - Quito"` y observa como afecta a todos los objetos.

## Usa IA para...

> Abre ChatGPT y escribe:
> "En Python orientado a objetos, explica con un ejemplo simple la diferencia entre un atributo de clase y un atributo de instancia. Muestra que pasa si modifico el atributo de clase despues de crear objetos."

Despues de leer la respuesta:
- Compara la explicacion con lo que observaste en el paso 5 del ejercicio.
- Pregunta a ChatGPT: "Dame 3 ejemplos de clases utiles para modelar datos de una empresa ecuatoriana."

## Que aprendiste

- Una `class` en Python es un molde que define la estructura de un tipo de dato.
- Un objeto es una instancia concreta de esa clase, con sus propios valores.
- Los atributos de clase son compartidos por todos los objetos; los de instancia son individuales.
- `type()` e `isinstance()` permiten inspeccionar el tipo de un objeto en tiempo de ejecucion.
- La POO permite organizar datos del mundo real (productos, clientes, transacciones) como entidades con estructura clara.

## Reto extra

Crea una segunda clase llamada `Categoria` con un atributo de clase `iva = 0.15` (IVA Ecuador). Asigna a cada producto una categoria (`laptop.categoria = "Computacion"`) y muestra en el inventario el precio con IVA incluido calculado como `precio * (1 + Categoria.iva)`.
