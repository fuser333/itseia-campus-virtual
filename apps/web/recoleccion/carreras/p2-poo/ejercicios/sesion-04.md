# Ejercicio Sesion 4: Herencia Simple

**Materia:** Programacion Orientada a Objetos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 40 min

## Objetivo

Aplicar herencia simple para modelar un sistema de empleados de una empresa ecuatoriana, reutilizando codigo de la clase base y especializando comportamientos en clases hijas.

## Contexto

En Ecuador, una empresa de tamano mediano puede tener empleados de diferentes tipos: administrativos, tecnicos y comerciales. Todos comparten datos comunes (cedula, nombre, salario base) pero cada tipo tiene su propio calculo de bonificaciones. El IESS establece que toda empresa con mas de 10 empleados debe aportar al seguro social. Usaremos herencia para modelar esta jerarquia sin repetir codigo.

## Instrucciones

1. Crea el archivo `sesion04_herencia_simple.py`.

2. Implementa la jerarquia de clases:

```python
# POO - Sesion 4: Herencia Simple
# ITSEIA - Periodo 2

class Empleado:
    """Clase base: todo empleado de una empresa ecuatoriana."""

    APORTE_IESS = 0.0945   # 9.45% aporte personal empleado Ecuador
    DECIMO_TERCER = 1 / 12  # Un doceavo del sueldo por mes

    def __init__(self, cedula, nombre, departamento, salario_base):
        self.cedula = cedula
        self.nombre = nombre
        self.departamento = departamento
        self.salario_base = salario_base
        self.activo = True

    def calcular_aporte_iess(self):
        return round(self.salario_base * Empleado.APORTE_IESS, 2)

    def calcular_decimo_tercero(self):
        """Un doceavo mensual del sueldo (provision)."""
        return round(self.salario_base * Empleado.DECIMO_TERCER, 2)

    def calcular_bonificacion(self):
        """La clase base no tiene bonificacion por defecto."""
        return 0.0

    def calcular_sueldo_neto(self):
        neto = self.salario_base + self.calcular_bonificacion() - self.calcular_aporte_iess()
        return round(neto, 2)

    def mostrar_rol(self):
        return self.departamento

    def mostrar_liquidacion(self):
        print(f"\n--- Liquidacion: {self.nombre} ({self.mostrar_rol()}) ---")
        print(f"  Salario base      : ${self.salario_base:.2f}")
        print(f"  Bonificacion      : ${self.calcular_bonificacion():.2f}")
        print(f"  Aporte IESS       : -${self.calcular_aporte_iess():.2f}")
        print(f"  Sueldo neto       : ${self.calcular_sueldo_neto():.2f}")
        print(f"  Prov. 13vo sueldo : ${self.calcular_decimo_tercero():.2f}")


class EmpleadoVentas(Empleado):
    """Hereda de Empleado. Tiene comision por ventas."""

    COMISION_PORCENTAJE = 0.05  # 5% de las ventas del mes

    def __init__(self, cedula, nombre, salario_base, ventas_mes):
        # Llamar al constructor de la clase padre
        super().__init__(cedula, nombre, "Ventas", salario_base)
        self.ventas_mes = ventas_mes  # Atributo propio de esta clase

    def calcular_bonificacion(self):
        """Sobreescribe el metodo del padre."""
        return round(self.ventas_mes * EmpleadoVentas.COMISION_PORCENTAJE, 2)

    def mostrar_rol(self):
        return f"Ejecutivo de Ventas - Ventas del mes: ${self.ventas_mes:.2f}"


class EmpleadoTI(Empleado):
    """Hereda de Empleado. Tiene bono por certificaciones."""

    BONO_CERTIFICACION = 150.00  # USD por certificacion activa

    def __init__(self, cedula, nombre, salario_base, certificaciones):
        super().__init__(cedula, nombre, "Tecnologia", salario_base)
        self.certificaciones = certificaciones  # Lista de certificaciones

    def calcular_bonificacion(self):
        """Bono fijo por cada certificacion activa."""
        return len(self.certificaciones) * EmpleadoTI.BONO_CERTIFICACION

    def mostrar_rol(self):
        certs = ", ".join(self.certificaciones) if self.certificaciones else "Ninguna"
        return f"Tecnico TI - Certs: {certs}"


class Gerente(Empleado):
    """Hereda de Empleado. Tiene bono ejecutivo por porcentaje."""

    def __init__(self, cedula, nombre, area, salario_base, porcentaje_bono):
        super().__init__(cedula, nombre, area, salario_base)
        self.porcentaje_bono = porcentaje_bono

    def calcular_bonificacion(self):
        return round(self.salario_base * self.porcentaje_bono, 2)

    def mostrar_rol(self):
        return f"Gerente de {self.departamento}"


# --- Nomina de la empresa H3L Ecuador ---
empleados = [
    Gerente("1700001111", "Santiago Morales", "Operaciones", 3500.00, 0.20),
    EmpleadoVentas("1700002222", "Valentina Ruiz", 800.00, 12000.00),
    EmpleadoVentas("1700003333", "Pablo Narvaez", 800.00, 8500.00),
    EmpleadoTI("1700004444", "Daniela Chaves", 1800.00, ["AWS Solutions Architect", "Python Institute"]),
    EmpleadoTI("1700005555", "Rodrigo Espinosa", 1600.00, ["Azure AI"]),
    Empleado("1700006666", "Rosa Paucar", "Contabilidad", 950.00),
]

print("=" * 60)
print("  NOMINA MENSUAL - H3L ECUADOR")
print("=" * 60)

total_nomina = 0
for emp in empleados:
    emp.mostrar_liquidacion()
    total_nomina += emp.calcular_sueldo_neto()

print(f"\n{'=' * 60}")
print(f"  TOTAL NOMINA NETA: ${total_nomina:.2f}")
print(f"{'=' * 60}")
```

3. Ejecuta y verifica que cada tipo de empleado calcula su bonificacion correctamente.

4. Agrega un empleado de tipo `EmpleadoTI` con 3 certificaciones (AWS, Google Cloud, OpenAI) y verifica su bono.

## Usa IA para...

> Abre Claude y escribe:
> "En Python, ¿que hace exactamente super().__init__() en una clase hija? ¿Que pasa si no lo llamo? ¿Hay casos donde NO debo llamarlo? Explica con ejemplos."

Despues de leer la respuesta:
- Elimina temporalmente el `super().__init__()` de una clase hija y observa el error.
- Pregunta a Claude: "¿Cual es la diferencia entre sobreescribir un metodo (override) y extenderlo en Python?"

## Que aprendiste

- La herencia permite que una clase hija (`EmpleadoVentas`) reutilice el codigo de la clase padre (`Empleado`) sin repetirlo.
- `super().__init__()` llama al constructor del padre para inicializar los atributos heredados.
- Sobreescribir un metodo en la clase hija reemplaza el comportamiento del padre para ese metodo especifico.
- Una lista de objetos puede contener instancias de diferentes clases hijas; Python ejecuta el metodo correcto segun el tipo real de cada objeto.
- Este patron es fundamental en sistemas de nomina, inventarios y cualquier dominio con jerarquias.

## Reto extra

Agrega el metodo `__str__` a la clase base `Empleado` que retorne `"Empleado: [nombre] | Neto: $[sueldo_neto]"`. Luego crea una lista de todos los empleados y usa una comprension de lista para imprimirlos: `[print(e) for e in empleados]`.
