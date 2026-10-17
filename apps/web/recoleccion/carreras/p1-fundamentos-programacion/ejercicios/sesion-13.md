# Ejercicio Sesion 13: Sistema Academico con POO

**Materia:** Fundamentos de Programacion
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Aplicar los conceptos basicos de Programacion Orientada a Objetos (clases, atributos, metodos, herencia simple) para modelar el sistema academico de ITSEIA: estudiantes, cursos y una fraternidad.

## Contexto

La Programacion Orientada a Objetos es el paradigma dominante en desarrollo de software profesional. Los frameworks de IA como TensorFlow y PyTorch se construyen sobre clases. Modelar el mundo real con objetos es una habilidad fundamental para cualquier desarrollador. Vamos a modelar ITSEIA con clases reales.

## Instrucciones

1. Crea el archivo `sesion13_poo_itseia.py`.

2. Construye el sistema paso a paso, agregando una clase a la vez y probando cada una:

```python
# Sistema Academico ITSEIA - Programacion Orientada a Objetos
# Clases: Persona, Estudiante, Docente, Curso, Fraternidad
# Conceptos: __init__, metodos, atributos, herencia, __str__, __repr__

from datetime import datetime

print("=" * 62)
print("SISTEMA ACADEMICO ITSEIA - Modelado con POO")
print("=" * 62)

# ================================================
# CLASE BASE: Persona
# ================================================

class Persona:
    """Clase base con atributos comunes a toda persona en ITSEIA."""

    institucion = "ITSEIA"  # atributo de clase (compartido)

    def __init__(self, nombre, cedula, edad, ciudad):
        # Atributos de instancia
        self.nombre = nombre
        self.cedula = cedula
        self.edad = edad
        self.ciudad = ciudad
        self.fecha_registro = datetime.now().strftime("%Y-%m-%d")

    def saludar(self):
        """Retorna un saludo personalizado."""
        return f"Hola, soy {self.nombre}, de {self.ciudad}. Bienvenido a {self.institucion}."

    def __str__(self):
        """Representacion legible del objeto."""
        return f"{self.nombre} | Cedula: {self.cedula} | {self.ciudad}"

    def __repr__(self):
        return f"Persona('{self.nombre}', '{self.cedula}')"


# ================================================
# CLASE HIJA: Estudiante (hereda de Persona)
# ================================================

class Estudiante(Persona):
    """Estudiante ITSEIA con notas, fraternidad y estado academico."""

    PENSION_LISTA = 220.00
    PENSION_PIONERO = 187.00

    def __init__(self, nombre, cedula, edad, ciudad, carrera, fraternidad):
        super().__init__(nombre, cedula, edad, ciudad)  # llama al __init__ padre
        self.carrera = carrera
        self.fraternidad = fraternidad
        self.semestre = 1
        self.notas = {}          # dict: {materia: nota}
        self.es_pionero = True   # precio especial al inicio
        self.asistencias = {}    # dict: {materia: pct_asistencia}

    @property
    def pension(self):
        """Propiedad calculada: retorna la pension segun si es pionero."""
        return self.PENSION_PIONERO if self.es_pionero else self.PENSION_LISTA

    def agregar_nota(self, materia, nota):
        """Registra o actualiza una nota."""
        if 0 <= nota <= 10:
            self.notas[materia] = nota
        else:
            raise ValueError(f"Nota {nota} fuera de rango (0-10)")

    def calcular_promedio(self):
        """Calcula el promedio de todas las materias."""
        if not self.notas:
            return 0.0
        return round(sum(self.notas.values()) / len(self.notas), 2)

    def estado_academico(self):
        """Retorna el estado basado en el promedio."""
        promedio = self.calcular_promedio()
        if promedio >= 9.0:
            return "SOBRESALIENTE"
        elif promedio >= 7.0:
            return "APROBADO"
        elif promedio > 0:
            return "EN RIESGO"
        else:
            return "SIN NOTAS"

    def __str__(self):
        return (f"{self.nombre} | {self.carrera} | Sem.{self.semestre} | "
                f"Prom:{self.calcular_promedio()} | ${self.pension:.2f}/mes")


# ================================================
# CLASE HIJA: Docente (hereda de Persona)
# ================================================

class Docente(Persona):
    """Docente ITSEIA con especializacion y materias asignadas."""

    def __init__(self, nombre, cedula, edad, ciudad, especializacion, salario):
        super().__init__(nombre, cedula, edad, ciudad)
        self.especializacion = especializacion
        self.salario = salario
        self.materias = []

    def asignar_materia(self, materia):
        if materia not in self.materias:
            self.materias.append(materia)

    def __str__(self):
        return f"Dr. {self.nombre} | {self.especializacion} | {len(self.materias)} materia(s)"


# ================================================
# CLASE INDEPENDIENTE: Curso
# ================================================

class Curso:
    """Modelo de una materia/curso en ITSEIA."""

    def __init__(self, nombre, codigo, creditos, semestre):
        self.nombre = nombre
        self.codigo = codigo
        self.creditos = creditos
        self.semestre = semestre
        self.estudiantes = []
        self.docente = None

    def matricular(self, estudiante):
        """Agrega un estudiante al curso."""
        if isinstance(estudiante, Estudiante):
            self.estudiantes.append(estudiante)
        else:
            raise TypeError("Solo se pueden matricular objetos Estudiante")

    def asignar_docente(self, docente):
        """Asigna el docente responsable del curso."""
        if isinstance(docente, Docente):
            self.docente = docente
            docente.asignar_materia(self.nombre)

    def promedio_clase(self):
        """Calcula el promedio general de la clase en esta materia."""
        notas = [est.notas.get(self.nombre, 0) for est in self.estudiantes
                 if self.nombre in est.notas]
        if not notas:
            return 0.0
        return round(sum(notas) / len(notas), 2)

    def __str__(self):
        docente_nombre = self.docente.nombre if self.docente else "Sin asignar"
        return (f"{self.codigo} | {self.nombre} | {self.creditos} cred. | "
                f"Docente: {docente_nombre} | Matriculados: {len(self.estudiantes)}")


# ================================================
# CLASE: Fraternidad
# ================================================

class Fraternidad:
    """Sistema de fraternidades ITSEIA: Luma y Neo."""

    def __init__(self, nombre, enfoque, valores):
        self.nombre = nombre
        self.enfoque = enfoque
        self.valores = valores
        self.miembros = []

    def admitir(self, estudiante):
        if isinstance(estudiante, Estudiante):
            estudiante.fraternidad = self.nombre
            self.miembros.append(estudiante)

    def promedio_fraternidad(self):
        promedios = [m.calcular_promedio() for m in self.miembros
                     if m.calcular_promedio() > 0]
        return round(sum(promedios) / len(promedios), 2) if promedios else 0.0

    def __str__(self):
        return f"Fraternidad {self.nombre} | {len(self.miembros)} miembros"


# ================================================
# PROGRAMA PRINCIPAL: usar las clases
# ================================================

# Crear estudiantes
est1 = Estudiante("Maria Fernanda Quispe", "1720456789", 22, "Quito", "IA", "Luma")
est2 = Estudiante("Diego Esteban Mora", "0912345678", 24, "Guayaquil", "Big Data", "Neo")
est3 = Estudiante("Camila Andrade Torres", "1802345671", 21, "Ambato", "Ciencia de Datos", "Luma")

# Agregar notas
est1.agregar_nota("Python", 9.2)
est1.agregar_nota("Matematicas", 8.5)
est2.agregar_nota("Python", 8.0)
est2.agregar_nota("Matematicas", 9.1)
est3.agregar_nota("Python", 9.5)
est3.agregar_nota("Matematicas", 9.0)

# Crear docente
doc1 = Docente("Hector Velasco", "1712908597", 46, "Quito", "IA y Machine Learning", 2000.00)

# Crear curso
curso_python = Curso("Python", "CS101", 4, 1)
curso_python.asignar_docente(doc1)
curso_python.matricular(est1)
curso_python.matricular(est2)
curso_python.matricular(est3)

# Crear fraternidades
luma = Fraternidad("Luma", "IA creativa y UX", ["Creatividad", "Arte+Tech", "Innovacion"])
neo = Fraternidad("Neo", "Infraestructura y Big Data", ["Eficiencia", "Escalabilidad"])
luma.admitir(est1)
luma.admitir(est3)
neo.admitir(est2)

# Mostrar informacion
print("\n--- ESTUDIANTES ---")
for est in [est1, est2, est3]:
    print(f"  {est}")
    print(f"    Estado: {est.estado_academico()} | Saludo: {est.saludar()}")

print(f"\n--- CURSO ---")
print(f"  {curso_python}")
print(f"  Promedio de clase: {curso_python.promedio_clase()}")

print(f"\n--- FRATERNIDADES ---")
print(f"  {luma} | Promedio: {luma.promedio_fraternidad()}")
print(f"  {neo} | Promedio: {neo.promedio_fraternidad()}")

print(f"\n--- DOCENTE ---")
print(f"  {doc1}")
print(f"  Materias: {doc1.materias}")

# Verificar herencia
print(f"\n--- HERENCIA ---")
print(f"  est1 es Estudiante: {isinstance(est1, Estudiante)}")
print(f"  est1 es Persona:    {isinstance(est1, Persona)}")
print(f"  doc1 es Estudiante: {isinstance(doc1, Estudiante)}")

print("\n" + "=" * 62)
```

3. Ejecuta el programa y verifica que todas las clases funcionan correctamente.

4. Agrega un metodo `reporte_completo(self)` a la clase `Estudiante` que imprima en un formato bonito: nombre, carrera, semestre, todas las notas, promedio, estado y fraternidad.

5. Crea un objeto `est4` con tus propios datos y agregate a una fraternidad.

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "En Python POO, explica la diferencia entre un atributo de clase y un atributo de instancia con un ejemplo concreto. Tambien explica cuando usar @property en lugar de un metodo normal tipo get_valor()."

Despues de leer la respuesta:
- Identifica en el codigo el atributo de clase `institucion` y el atributo de instancia `nombre`.
- ¿Entiendes por que `pension` usa `@property`?

## Que aprendiste

- Una clase es un molde; un objeto es una instancia de ese molde.
- `__init__(self, ...)` es el constructor que se ejecuta al crear el objeto.
- `self` referencia al objeto actual dentro de sus metodos.
- `super().__init__()` llama al constructor de la clase padre.
- `isinstance(obj, Clase)` verifica si un objeto es de un tipo especifico.
- `@property` convierte un metodo en un atributo de solo lectura calculado.
- `__str__` define como se imprime el objeto con `print()`.

## Reto extra

Implementa una clase `GestionAcademica` que actue como controlador central: tenga listas de estudiantes, docentes y cursos, y un metodo `generar_reporte_semestral()` que muestre el resumen completo del semestre: total matriculados, promedio general por carrera, top 3 estudiantes y estado de cada fraternidad.
