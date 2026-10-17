# Ejercicio Sesion 2: Atributos y Metodos

**Materia:** Programacion Orientada a Objetos
**Nivel:** Basico
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Definir atributos de instancia y metodos dentro de una clase que modela una cuenta bancaria ecuatoriana, comprendiendo como los metodos operan sobre los datos del objeto.

## Contexto

El sistema financiero ecuatoriano cuenta con bancos como Produbanco, Banco Pichincha y Banco Guayaquil, que en conjunto manejan millones de cuentas. Cada cuenta tiene datos propios (numero, saldo, titular) y acciones que puede realizar (depositar, retirar, consultar). Modelar esto con POO es el primer paso para entender como los sistemas bancarios reales estan construidos.

## Instrucciones

1. Crea el archivo `sesion02_atributos_metodos.py`.

2. Implementa la clase `CuentaBancaria`:

```python
# POO - Sesion 2: Atributos y Metodos
# ITSEIA - Periodo 2

class CuentaBancaria:
    # Atributo de clase
    banco = "Banco Pichincha"
    tasa_mantenimiento_mensual = 3.50  # USD

    # Metodo constructor (lo veremos en detalle en sesion 3)
    def __init__(self, numero, titular, saldo_inicial):
        # Atributos de instancia
        self.numero = numero
        self.titular = titular
        self.saldo = saldo_inicial
        self.activa = True
        self.historial = []

    # Metodo: depositar
    def depositar(self, monto):
        if monto <= 0:
            print("Error: el monto debe ser mayor a 0.")
            return
        self.saldo += monto
        self.historial.append(f"Deposito: +${monto:.2f}")
        print(f"Deposito exitoso. Nuevo saldo: ${self.saldo:.2f}")

    # Metodo: retirar
    def retirar(self, monto):
        if monto <= 0:
            print("Error: monto invalido.")
            return
        if monto > self.saldo:
            print(f"Fondos insuficientes. Saldo disponible: ${self.saldo:.2f}")
            return
        self.saldo -= monto
        self.historial.append(f"Retiro  : -${monto:.2f}")
        print(f"Retiro exitoso. Nuevo saldo: ${self.saldo:.2f}")

    # Metodo: mostrar informacion
    def mostrar_estado(self):
        print("=" * 50)
        print(f"Banco   : {CuentaBancaria.banco}")
        print(f"Cuenta  : {self.numero}")
        print(f"Titular : {self.titular}")
        print(f"Saldo   : ${self.saldo:.2f}")
        print(f"Estado  : {'Activa' if self.activa else 'Inactiva'}")
        print("Historial de movimientos:")
        for movimiento in self.historial:
            print(f"  {movimiento}")
        print("=" * 50)

    # Metodo: cobrar mantenimiento
    def cobrar_mantenimiento(self):
        self.retirar(CuentaBancaria.tasa_mantenimiento_mensual)
        self.historial[-1] += " (mantenimiento)"


# --- Uso del modelo ---
cuenta1 = CuentaBancaria("2705914571", "Hector Velasco", 500.00)
cuenta2 = CuentaBancaria("1890345678", "Maria Andrade", 1200.00)

cuenta1.depositar(300.00)
cuenta1.retirar(150.00)
cuenta1.cobrar_mantenimiento()
cuenta1.mostrar_estado()

print()

cuenta2.depositar(500.00)
cuenta2.retirar(2000.00)  # Debe fallar
cuenta2.mostrar_estado()
```

3. Ejecuta el codigo y observa los mensajes de error controlados.

4. Agrega un metodo `transferir(self, cuenta_destino, monto)` que retire de la cuenta origen y deposite en la cuenta destino. Prueba `cuenta1.transferir(cuenta2, 100.00)`.

## Usa IA para...

> Abre Claude y escribe:
> "Tengo una clase CuentaBancaria en Python con metodos depositar() y retirar(). ¿Que otros metodos deberia tener una cuenta bancaria real? Dame 5 metodos con su firma (def nombre(self, parametros)) y una descripcion de que hace cada uno."

Despues de leer la respuesta:
- Elige uno de los metodos sugeridos e implementalo en tu clase.
- Pregunta a Claude: "¿Por que en Python los metodos de instancia siempre reciben `self` como primer parametro?"

## Que aprendiste

- Los metodos son funciones definidas dentro de una clase que operan sobre los atributos del objeto via `self`.
- `self` es la referencia al objeto actual; permite que cada instancia tenga su propio estado.
- Los metodos pueden incluir validaciones para proteger el estado del objeto.
- Una lista como `self.historial` permite registrar el historial de operaciones de cada instancia individualmente.
- La POO agrupa datos y comportamiento en una sola unidad cohesiva.

## Reto extra

Agrega un atributo de clase `total_cuentas = 0` que se incremente cada vez que se crea una cuenta nueva. Luego imprime cuantas cuentas existen al final del programa con `print(CuentaBancaria.total_cuentas)`. (Pista: modifica el `__init__` para incrementar el contador.)
