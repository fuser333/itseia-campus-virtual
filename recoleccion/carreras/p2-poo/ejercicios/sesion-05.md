# Ejercicio Sesion 5: Herencia Multiple y Polimorfismo

**Materia:** Programacion Orientada a Objetos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Implementar herencia multiple y polimorfismo modelando un sistema de medios de pago digital para un e-commerce ecuatoriano, donde distintos objetos responden de forma diferente al mismo mensaje.

## Contexto

En Ecuador, las plataformas de e-commerce como Mercado Libre Ecuador, Linio y Supermaxi Online aceptan multiples formas de pago: tarjeta de credito, transferencia bancaria, billeteras digitales (Deuna!, Tu Cashback) y pago en efectivo en puntos de recaudacion. Cada medio de pago comparte la misma interfaz (`procesar_pago`, `verificar_disponibilidad`) pero se comporta de forma distinta internamente: polimorfismo en accion.

## Instrucciones

1. Crea el archivo `sesion05_herencia_polimorfismo.py`.

2. Implementa el sistema de pagos con herencia multiple:

```python
# POO - Sesion 5: Herencia Multiple y Polimorfismo
# ITSEIA - Periodo 2

class Registrable:
    """Mixin: capacidad de registrar operaciones en un log."""

    def __init__(self):
        self.log = []

    def registrar(self, mensaje):
        self.log.append(mensaje)

    def mostrar_log(self):
        print(f"\n  Log de {self.__class__.__name__}:")
        for entrada in self.log:
            print(f"    - {entrada}")


class Notificable:
    """Mixin: capacidad de enviar notificaciones."""

    def notificar(self, mensaje):
        print(f"  [NOTIFICACION] {mensaje}")


class MedioPago:
    """Clase base abstracta para todos los medios de pago."""

    COMISION_SRI = 0.0  # El SRI Ecuador puede aplicar ICE en algunos medios

    def __init__(self, nombre, titular):
        self.nombre = nombre
        self.titular = titular
        self.activo = True

    def verificar_disponibilidad(self, monto):
        """Cada medio implementa su propia verificacion."""
        raise NotImplementedError("Cada medio de pago debe implementar verificar_disponibilidad()")

    def procesar_pago(self, monto, descripcion):
        """Flujo general de pago; usa verificar_disponibilidad de cada clase."""
        print(f"\n{'=' * 52}")
        print(f"  Procesando pago via {self.nombre}")
        print(f"  Titular : {self.titular}")
        print(f"  Monto   : ${monto:.2f}")
        print(f"  Detalle : {descripcion}")

        if not self.activo:
            print("  RECHAZADO: medio de pago inactivo.")
            return False

        if not self.verificar_disponibilidad(monto):
            print("  RECHAZADO: fondos o limite insuficiente.")
            return False

        print("  APROBADO")
        return True

    def comision(self, monto):
        return 0.0


class TarjetaCredito(MedioPago, Registrable, Notificable):
    """Herencia multiple: MedioPago + Registrable + Notificable."""

    COMISION_PORCENTAJE = 0.035  # 3.5% tipico en Ecuador

    def __init__(self, numero_masked, titular, limite, banco_emisor):
        MedioPago.__init__(self, "Tarjeta de Credito", titular)
        Registrable.__init__(self)
        self.numero_masked = numero_masked
        self.limite = limite
        self.usado = 0.0
        self.banco_emisor = banco_emisor

    def verificar_disponibilidad(self, monto):
        disponible = self.limite - self.usado
        return monto <= disponible

    def comision(self, monto):
        return round(monto * TarjetaCredito.COMISION_PORCENTAJE, 2)

    def procesar_pago(self, monto, descripcion):
        aprobado = super().procesar_pago(monto + self.comision(monto), descripcion)
        if aprobado:
            self.usado += monto
            self.registrar(f"Cargo: ${monto:.2f} - {descripcion}")
            self.notificar(f"Cargo de ${monto:.2f} en tu tarjeta {self.numero_masked} ({self.banco_emisor})")
        return aprobado


class TransferenciaBancaria(MedioPago, Registrable):
    """Herencia multiple: MedioPago + Registrable."""

    def __init__(self, numero_cuenta, titular, banco, saldo):
        MedioPago.__init__(self, "Transferencia Bancaria", titular)
        Registrable.__init__(self)
        self.numero_cuenta = numero_cuenta
        self.banco = banco
        self.saldo = saldo

    def verificar_disponibilidad(self, monto):
        return self.saldo >= monto

    def procesar_pago(self, monto, descripcion):
        aprobado = super().procesar_pago(monto, descripcion)
        if aprobado:
            self.saldo -= monto
            self.registrar(f"Transferencia: -${monto:.2f} - {descripcion}")
        return aprobado


class BilleteraDigital(MedioPago, Notificable):
    """Herencia multiple: MedioPago + Notificable."""

    LIMITE_DIARIO = 500.00  # Deuna! limita $500 diarios en Ecuador

    def __init__(self, celular, titular, saldo):
        MedioPago.__init__(self, "Billetera Digital (Deuna!)", titular)
        self.celular = celular
        self.saldo = saldo
        self.pagado_hoy = 0.0

    def verificar_disponibilidad(self, monto):
        if self.pagado_hoy + monto > BilleteraDigital.LIMITE_DIARIO:
            print(f"  Limite diario alcanzado (${BilleteraDigital.LIMITE_DIARIO:.2f})")
            return False
        return self.saldo >= monto

    def procesar_pago(self, monto, descripcion):
        aprobado = super().procesar_pago(monto, descripcion)
        if aprobado:
            self.saldo -= monto
            self.pagado_hoy += monto
            self.notificar(f"Pago de ${monto:.2f} procesado desde tu Deuna! ({self.celular})")
        return aprobado


# --- Polimorfismo en accion ---
medios = [
    TarjetaCredito("****-****-****-4521", "Carlos Brito", 2000.00, "Banco Pichincha"),
    TransferenciaBancaria("2705914571", "Ana Torres", "Produbanco", 1500.00),
    BilleteraDigital("0991234567", "Luis Mendez", 300.00),
]

carrito = [
    ("Laptop HP 14", 650.00),
    ("Auriculares Sony", 85.00),
    ("Suscripcion Netflix", 12.00),
]

# Polimorfismo: el mismo metodo procesar_pago() se comporta diferente segun el objeto
for producto, precio in carrito:
    print(f"\n--- Comprando: {producto} (${precio:.2f}) ---")
    for medio in medios:
        resultado = medio.procesar_pago(precio, producto)
        if resultado:
            break  # Pago exitoso, no intentar con el siguiente medio

# Mostrar logs
print("\n" + "=" * 52)
for medio in medios:
    if isinstance(medio, Registrable):
        medio.mostrar_log()
```

3. Ejecuta y observa como cada medio de pago responde diferente al mismo `procesar_pago()`.

4. Agrega un cuarto medio: `PagoEfectivo` (hereda solo de `MedioPago`) donde `verificar_disponibilidad` siempre retorna `True` (el cliente paga en efectivo en un Servipagos).

## Usa IA para...

> Abre ChatGPT y escribe:
> "Explica el polimorfismo en Python con un ejemplo del mundo real distinto a los animales. ¿Que es el MRO (Method Resolution Order) en Python y como afecta a la herencia multiple? Muestra el resultado de .__mro__ para una clase con herencia multiple."

Despues de leer la respuesta:
- Ejecuta `print(TarjetaCredito.__mro__)` en tu codigo y compara con la explicacion.
- Pregunta: "¿Que problemas puede causar la herencia multiple? ¿Cuando es mejor usar composicion en su lugar?"

## Que aprendiste

- La herencia multiple permite que una clase herede comportamiento de varias clases base simultaneamente.
- Los mixins son clases disenadas para agregar funcionalidad especifica (`Registrable`, `Notificable`) sin ser clases completas.
- El polimorfismo permite llamar el mismo metodo en objetos distintos y obtener comportamientos diferentes segun la clase real del objeto.
- `isinstance()` permite verificar el tipo de un objeto en tiempo de ejecucion, util para saber si un objeto tiene ciertas capacidades.
- El MRO (Method Resolution Order) determina el orden en que Python busca metodos en la jerarquia de herencia.

## Reto extra

Implementa una funcion `procesar_orden_completa(medios_disponibles, items)` que intente procesar cada item con el primer medio disponible que tenga fondos suficientes, mostrando un resumen final: cuantos items se pagaron, con cual medio, y el total cobrado por cada uno.
