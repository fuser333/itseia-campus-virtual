# Ejercicio Sesion 6: Encapsulamiento — public, private, protected

**Materia:** Programacion Orientada a Objetos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Aplicar los tres niveles de encapsulamiento en Python modelando un sistema de calificaciones del SRI Ecuador, protegiendo datos sensibles con atributos privados y controlando el acceso mediante getters y setters.

## Contexto

El Servicio de Rentas Internas (SRI) de Ecuador gestiona la informacion tributaria de mas de 8 millones de contribuyentes. Los datos fiscales (NIT, declaraciones, deudas) son altamente sensibles y solo pueden ser modificados por metodos validados, nunca directamente. Este ejercicio modela una `CuentaTributaria` con encapsulamiento correcto: el ruc es privado, el historial es protegido, y solo los totales son publicos.

## Instrucciones

1. Crea el archivo `sesion06_encapsulamiento.py`.

2. Implementa la clase con los tres niveles:

```python
# POO - Sesion 6: Encapsulamiento
# ITSEIA - Periodo 2

class CuentaTributaria:
    """
    Niveles de encapsulamiento en Python:
    - Publico     : atributo      -> accesible desde cualquier lugar
    - Protegido   : _atributo     -> convencion: solo clase y subclases
    - Privado     : __atributo    -> name mangling, solo la clase misma
    """

    IVA_ECUADOR = 0.15  # 15% vigente desde 2024

    def __init__(self, ruc, razon_social, tipo):
        # PUBLICO: informacion general accesible
        self.razon_social = razon_social
        self.tipo = tipo  # "PERSONA_NATURAL" o "SOCIEDAD"
        self.activo = True

        # PROTEGIDO: solo uso interno y subclases
        self._historial_declaraciones = []
        self._credito_tributario = 0.0

        # PRIVADO: altamente sensible, solo esta clase
        self.__ruc = ruc
        self.__deuda_total = 0.0
        self.__clave_acceso = None

    # --- Getters (propiedades) para atributos privados ---

    @property
    def ruc(self):
        """Getter: retorna RUC enmascarado."""
        ruc_str = str(self.__ruc)
        return ruc_str[:4] + "****" + ruc_str[-3:]

    @property
    def deuda_total(self):
        """Getter: retorna la deuda total."""
        return self.__deuda_total

    # --- Setter con validacion ---

    @deuda_total.setter
    def deuda_total(self, valor):
        """Setter: no permite deuda negativa."""
        if valor < 0:
            raise ValueError("La deuda no puede ser negativa.")
        self.__deuda_total = valor

    # --- Metodos publicos ---

    def registrar_declaracion(self, periodo, ingresos, gastos):
        """Calcula y registra una declaracion de IVA."""
        iva_cobrado = round(ingresos * CuentaTributaria.IVA_ECUADOR, 2)
        iva_pagado = round(gastos * CuentaTributaria.IVA_ECUADOR, 2)
        saldo_iva = iva_cobrado - iva_pagado

        declaracion = {
            "periodo": periodo,
            "ingresos": ingresos,
            "gastos": gastos,
            "iva_cobrado": iva_cobrado,
            "iva_pagado": iva_pagado,
            "saldo_a_pagar": max(saldo_iva, 0),
            "credito_generado": abs(min(saldo_iva, 0))
        }

        # Actualizar estado interno
        self._historial_declaraciones.append(declaracion)
        self.__deuda_total += declaracion["saldo_a_pagar"]
        self._credito_tributario += declaracion["credito_generado"]

        return declaracion

    def pagar_deuda(self, monto):
        """Reduce la deuda con validacion."""
        if monto <= 0:
            raise ValueError("El monto de pago debe ser positivo.")
        if monto > self.__deuda_total:
            print(f"  Aviso: pago ${monto:.2f} excede deuda ${self.__deuda_total:.2f}. Se acepta por el total.")
            monto = self.__deuda_total
        self.__deuda_total -= monto
        print(f"  Pago registrado: ${monto:.2f}. Deuda restante: ${self.__deuda_total:.2f}")

    def mostrar_estado_cuenta(self):
        print(f"\n{'=' * 56}")
        print(f"  ESTADO DE CUENTA - SRI ECUADOR")
        print(f"{'=' * 56}")
        print(f"  RUC             : {self.ruc}")
        print(f"  Razon Social    : {self.razon_social}")
        print(f"  Tipo            : {self.tipo}")
        print(f"  Deuda Total     : ${self.__deuda_total:.2f}")
        print(f"  Credito Tribut. : ${self._credito_tributario:.2f}")
        print(f"\n  Declaraciones registradas: {len(self._historial_declaraciones)}")
        for i, d in enumerate(self._historial_declaraciones, 1):
            print(f"  [{i}] {d['periodo']} | Ingresos: ${d['ingresos']:,.2f} | "
                  f"IVA a pagar: ${d['saldo_a_pagar']:.2f} | "
                  f"Credito: ${d['credito_generado']:.2f}")
        print(f"{'=' * 56}")


# --- Uso del sistema ---
empresa = CuentaTributaria("1792012345001", "Tech Solutions S.A.", "SOCIEDAD")
freelancer = CuentaTributaria("1712345678001", "Maria Fernanda Salas", "PERSONA_NATURAL")

# Registrar declaraciones mensuales
empresa.registrar_declaracion("Enero 2026", ingresos=45000, gastos=32000)
empresa.registrar_declaracion("Febrero 2026", ingresos=52000, gastos=60000)  # Genera credito
empresa.registrar_declaracion("Marzo 2026", ingresos=48000, gastos=41000)

freelancer.registrar_declaracion("Enero 2026", ingresos=3200, gastos=1800)
freelancer.registrar_declaracion("Febrero 2026", ingresos=2900, gastos=3100)

empresa.mostrar_estado_cuenta()
freelancer.mostrar_estado_cuenta()

# Pagar parte de la deuda
empresa.pagar_deuda(500.00)

# Demostrar encapsulamiento: acceso al RUC enmascarado
print(f"\nRUC publico (enmascarado): {empresa.ruc}")

# Intentar acceso directo al privado: esto fallaria
try:
    print(empresa.__ruc)  # AttributeError
except AttributeError as e:
    print(f"Acceso directo bloqueado: {e}")

# Pero Python usa name mangling (no es acceso imposible, sino convencional)
print(f"Name mangling (solo para estudio): {empresa._CuentaTributaria__ruc}")

# Usar setter con validacion
try:
    empresa.deuda_total = -100  # ValueError
except ValueError as e:
    print(f"Setter rechazado: {e}")
```

3. Ejecuta y observa la diferencia entre acceso directo, enmascarado y name mangling.

4. Agrega un setter para `razon_social` que valide que la cadena tenga al menos 3 caracteres y no sea solo numeros.

## Usa IA para...

> Abre Claude y escribe:
> "En Python, ¿el encapsulamiento privado con __ es realmente privado? ¿Que es el name mangling y por que Python lo implementa asi en lugar de prohibir el acceso completamente? ¿Como se compara con Java o C++?"

Despues de leer la respuesta:
- Prueba el name mangling en tu codigo (`empresa._CuentaTributaria__ruc`).
- Pregunta: "¿Cuando debo usar @property en Python en lugar de simplemente hacer el atributo publico? Dame criterios de decision."

## Que aprendiste

- En Python, la privacidad es convencional: `_attr` (protegido) y `__attr` (privado con name mangling).
- El decorador `@property` permite crear getters que se usan como atributos, manteniendo la interfaz limpia.
- Los setters con `@atributo.setter` permiten validar los datos antes de asignarlos, protegiendo el estado interno.
- El encapsulamiento no es solo seguridad: es tambien organizacion, mantenibilidad y control de invariantes.
- El name mangling en Python es `_NombreClase__atributo`; no impide el acceso, pero lo hace explicito e inconveniente.

## Reto extra

Crea una subclase `CuentaTributariaExenta` que herede de `CuentaTributaria`. Sobreescribe `registrar_declaracion` para que aplique IVA 0 en todos los calculos (ciertas actividades en Ecuador tienen IVA 0: canasta basica, medicamentos, etc.). Usa `self._historial_declaraciones` del padre para guardar el registro.
