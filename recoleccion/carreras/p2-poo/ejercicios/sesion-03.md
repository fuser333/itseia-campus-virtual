# Ejercicio Sesion 3: Constructor __init__ y self

**Materia:** Programacion Orientada a Objetos
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Dominar el metodo constructor `__init__` y el parametro `self` creando un sistema de registro de pacientes para una clinica ecuatoriana, con validaciones en la inicializacion.

## Contexto

El Ministerio de Salud Publica del Ecuador (MSP) administra mas de 1,700 establecimientos de salud. Cada uno gestiona miles de historias clinicas. En este ejercicio modelamos el registro de un paciente: al momento de crearlo ya se validan datos obligatorios (cedula, nombre, fecha de nacimiento), tal como lo haría un sistema real de HIS (Health Information System).

## Instrucciones

1. Crea el archivo `sesion03_constructor_self.py`.

2. Implementa la clase `Paciente` con constructor completo:

```python
# POO - Sesion 3: Constructor __init__ y self
# ITSEIA - Periodo 2

from datetime import date

class Paciente:
    """Modelo de paciente para clinica ecuatoriana."""

    # Atributo de clase
    sistema = "MSP Ecuador"
    _contador_id = 0  # Para generar IDs automaticos

    def __init__(self, cedula, nombre, apellido, fecha_nacimiento, ciudad="Quito"):
        """
        Constructor: se ejecuta automaticamente al crear el objeto.
        Parametros obligatorios: cedula, nombre, apellido, fecha_nacimiento
        Parametro opcional: ciudad (por defecto Quito)
        """
        # Validacion de cedula ecuatoriana (10 digitos)
        if len(str(cedula)) != 10 or not str(cedula).isdigit():
            raise ValueError(f"Cedula invalida: {cedula}. Debe tener 10 digitos numericos.")

        # Incrementar contador y asignar ID
        Paciente._contador_id += 1

        # Inicializar atributos de instancia con self
        self.id_paciente = Paciente._contador_id
        self.cedula = str(cedula)
        self.nombre = nombre.strip().title()
        self.apellido = apellido.strip().title()
        self.fecha_nacimiento = fecha_nacimiento
        self.ciudad = ciudad
        self.activo = True
        self.consultas = 0

        # Calcular edad automaticamente
        hoy = date.today()
        self.edad = hoy.year - fecha_nacimiento.year - (
            (hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day)
        )

        print(f"Paciente registrado: {self.nombre} {self.apellido} (ID: {self.id_paciente})")

    def nombre_completo(self):
        """Metodo que combina nombre y apellido."""
        return f"{self.nombre} {self.apellido}"

    def registrar_consulta(self):
        """Incrementa el contador de consultas."""
        self.consultas += 1
        print(f"{self.nombre_completo()} - Consulta #{self.consultas} registrada.")

    def mostrar_ficha(self):
        """Muestra la ficha completa del paciente."""
        print("\n" + "=" * 50)
        print(f"  FICHA MEDICA - {Paciente.sistema}")
        print("=" * 50)
        print(f"  ID           : {self.id_paciente:04d}")
        print(f"  Cedula       : {self.cedula}")
        print(f"  Nombre       : {self.nombre_completo()}")
        print(f"  Edad         : {self.edad} anios")
        print(f"  Ciudad       : {self.ciudad}")
        print(f"  Consultas    : {self.consultas}")
        print(f"  Estado       : {'Activo' if self.activo else 'Inactivo'}")
        print("=" * 50)


# --- Crear pacientes ---
p1 = Paciente("1712345678", "carlos", "benavides", date(1990, 6, 15), "Quito")
p2 = Paciente("0912345678", "ana lucia", "torres", date(1985, 3, 22), "Guayaquil")
p3 = Paciente("1001234567", "diego", "proano", date(2000, 11, 5))  # Ciudad por defecto

p1.registrar_consulta()
p1.registrar_consulta()
p2.registrar_consulta()

p1.mostrar_ficha()
p2.mostrar_ficha()
p3.mostrar_ficha()

print(f"\nTotal pacientes registrados: {Paciente._contador_id}")

# Probar validacion: debe lanzar ValueError
try:
    p_invalido = Paciente("123", "nombre", "apellido", date(1990, 1, 1))
except ValueError as e:
    print(f"\nError capturado: {e}")
```

3. Ejecuta y verifica que las fichas se muestran correctamente y que el error de cedula invalida se captura.

4. Agrega un parametro `tipo_sangre` al constructor (opcional, por defecto `"Desconocido"`) y muéstralo en la ficha.

## Usa IA para...

> Abre ChatGPT y escribe:
> "En Python, ¿para que sirve el metodo especial __init__? ¿Puedo tener multiples constructores en una clase? ¿Que diferencia hay entre __init__ y __new__? Dame ejemplos simples."

Despues de leer la respuesta:
- Compara el concepto de "constructor" con lo que implementaste.
- Pregunta: "¿Que otros metodos especiales (dunder methods) deberia conocer un programador Python principiante? Lista los 5 mas importantes."

## Que aprendiste

- `__init__` es el constructor: se ejecuta automaticamente cuando se crea un objeto con `MiClase()`.
- `self` siempre es el primer parametro de cualquier metodo de instancia y referencia al objeto actual.
- Los parametros del constructor pueden tener valores por defecto para hacerlos opcionales.
- Podemos incluir validaciones dentro del constructor para garantizar que el objeto nazca en un estado valido.
- Los metodos dentro de la clase acceden a los atributos del objeto usando `self.atributo`.

## Reto extra

Agrega el metodo `__str__(self)` a la clase `Paciente` que retorne una cadena con el formato: `"[ID:0001] Carlos Benavides - 33 años - Quito"`. Luego prueba que al hacer `print(p1)` muestra ese formato automaticamente, sin llamar a ningun otro metodo.
