# Ejercicio Sesion 8: Proyecto — Sistema de Gestion con POO

**Materia:** Programacion Orientada a Objetos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Integrar todos los conceptos de POO (clases, herencia, encapsulamiento, polimorfismo, clases abstractas) construyendo un sistema de gestion de matriculas para ITSEIA, aplicando cada concepto en un contexto real.

## Contexto

ITSEIA necesita un sistema para gestionar el proceso de matricula: registrar aspirantes, procesar pagos, asignar a carreras y generar reportes. Este sistema debe ser escalable (puede agregar nuevas carreras) y robusto (valida todos los datos antes de procesar). Es el tipo de sistema que una empresa tecnologica ecuatoriana como H3L construiria para un cliente del sector educativo.

## Instrucciones

1. Crea el archivo `sesion08_proyecto_itseia.py`.

2. Construye el sistema completo:

```python
# POO - Sesion 8: Proyecto Sistema de Matriculas ITSEIA
# ITSEIA - Periodo 2
# Estudiante: [Tu nombre]

from abc import ABC, abstractmethod
from datetime import date


# ==========================================================
# CLASES BASE Y ABSTRACTAS
# ==========================================================

class Persona(ABC):
    """Clase abstracta base para toda persona en el sistema."""

    def __init__(self, cedula, nombre, apellido, email, telefono):
        if not self._validar_cedula(cedula):
            raise ValueError(f"Cedula invalida: {cedula}")
        self.__cedula = str(cedula)
        self.nombre = nombre.strip().title()
        self.apellido = apellido.strip().title()
        self.email = email.lower().strip()
        self.telefono = telefono
        self.fecha_registro = date.today()

    @staticmethod
    def _validar_cedula(cedula):
        return len(str(cedula)) == 10 and str(cedula).isdigit()

    @property
    def cedula(self):
        return self.__cedula

    def nombre_completo(self):
        return f"{self.nombre} {self.apellido}"

    @abstractmethod
    def tipo_persona(self):
        pass

    def __str__(self):
        return f"{self.tipo_persona()}: {self.nombre_completo()} | {self.email}"


class PagoBase(ABC):
    """Interface abstracta para todos los metodos de pago."""

    @abstractmethod
    def procesar(self, monto, descripcion):
        pass

    @abstractmethod
    def nombre_metodo(self):
        pass


# ==========================================================
# CLASES CONCRETAS — PERSONAS
# ==========================================================

class Aspirante(Persona):
    """Persona que solicita matricula en ITSEIA."""

    _contador = 0

    def __init__(self, cedula, nombre, apellido, email, telefono, ciudad, carrera_deseada):
        super().__init__(cedula, nombre, apellido, email, telefono)
        Aspirante._contador += 1
        self.id_aspirante = f"ASP-{Aspirante._contador:04d}"
        self.ciudad = ciudad
        self.carrera_deseada = carrera_deseada
        self.estado = "PENDIENTE"  # PENDIENTE -> APROBADO -> MATRICULADO -> RECHAZADO
        self._documentos = []

    def tipo_persona(self):
        return "Aspirante"

    def agregar_documento(self, doc):
        self._documentos.append(doc)
        print(f"  Documento '{doc}' agregado para {self.nombre_completo()}")

    def tiene_documentos_completos(self):
        requeridos = {"cedula", "bachillerato", "foto"}
        entregados = {d.lower() for d in self._documentos}
        faltantes = requeridos - entregados
        if faltantes:
            print(f"  Faltan documentos: {', '.join(faltantes)}")
            return False
        return True

    def aprobar(self):
        if self.tiene_documentos_completos():
            self.estado = "APROBADO"
            print(f"  {self.nombre_completo()} APROBADO para matricula.")
            return True
        return False


class Estudiante(Persona):
    """Persona ya matriculada en ITSEIA. Hereda de Persona."""

    def __init__(self, aspirante, carrera, numero_matricula):
        super().__init__(
            aspirante.cedula, aspirante.nombre, aspirante.apellido,
            aspirante.email, aspirante.telefono
        )
        self.numero_matricula = numero_matricula
        self.carrera = carrera
        self.periodo_actual = 1
        self.calificaciones = {}
        self.activo = True
        self.ciudad = aspirante.ciudad

    def tipo_persona(self):
        return "Estudiante"

    def registrar_calificacion(self, materia, nota):
        if not (0 <= nota <= 10):
            raise ValueError(f"Nota invalida: {nota}. Rango 0-10.")
        self.calificaciones[materia] = nota
        estado = "Aprobado" if nota >= 7 else "Reprobado"
        print(f"  {self.nombre_completo()} | {materia}: {nota:.1f} ({estado})")

    def promedio(self):
        if not self.calificaciones:
            return 0.0
        return round(sum(self.calificaciones.values()) / len(self.calificaciones), 2)

    def mostrar_boletin(self):
        print(f"\n  {'=' * 48}")
        print(f"  BOLETIN ACADEMICO - {self.numero_matricula}")
        print(f"  {'=' * 48}")
        print(f"  Nombre   : {self.nombre_completo()}")
        print(f"  Carrera  : {self.carrera}")
        print(f"  Periodo  : {self.periodo_actual}")
        for materia, nota in self.calificaciones.items():
            estado = "OK" if nota >= 7 else "REPROBADO"
            print(f"  {materia:<35} {nota:.1f}  {estado}")
        print(f"  {'─' * 48}")
        print(f"  PROMEDIO GENERAL: {self.promedio():.2f}")
        print(f"  {'=' * 48}")


# ==========================================================
# METODOS DE PAGO (Polimorfismo)
# ==========================================================

class PagoTarjeta(PagoBase):
    def __init__(self, numero_masked, banco):
        self._numero_masked = numero_masked
        self._banco = banco

    def nombre_metodo(self):
        return f"Tarjeta {self._banco} ({self._numero_masked})"

    def procesar(self, monto, descripcion):
        print(f"  Procesando tarjeta {self._banco}...")
        print(f"  Cargo: ${monto:.2f} | {descripcion}")
        return True


class PagoTransferencia(PagoBase):
    def __init__(self, numero_cuenta, banco):
        self._numero_cuenta = numero_cuenta
        self._banco = banco

    def nombre_metodo(self):
        return f"Transferencia {self._banco}"

    def procesar(self, monto, descripcion):
        print(f"  Verificando transferencia a cuenta {self._numero_cuenta}...")
        print(f"  Monto confirmado: ${monto:.2f} | {descripcion}")
        return True


# ==========================================================
# SISTEMA DE MATRICULAS (clase principal)
# ==========================================================

class SistemaMatriculas:
    """Clase gestora principal del proceso de matricula ITSEIA."""

    CARRERAS_DISPONIBLES = [
        "Tecnologia Superior en Inteligencia Artificial",
        "Tecnologia Superior en Ciencia de Datos",
        "Tecnologia Superior en Big Data e Ingenieria de Datos"
    ]

    PRECIOS = {
        "inscripcion": 180.00,
        "pension_mensual": 220.00,
        "preuniversitario": 399.00
    }

    def __init__(self):
        self._aspirantes = {}
        self._estudiantes = {}
        self._contador_matricula = 0
        self._ingresos_total = 0.0

    def registrar_aspirante(self, cedula, nombre, apellido, email, telefono, ciudad, carrera):
        if carrera not in self.CARRERAS_DISPONIBLES:
            print(f"  Carrera no valida: {carrera}")
            return None
        aspirante = Aspirante(cedula, nombre, apellido, email, telefono, ciudad, carrera)
        self._aspirantes[aspirante.id_aspirante] = aspirante
        print(f"  Aspirante registrado: {aspirante.id_aspirante} - {aspirante.nombre_completo()}")
        return aspirante

    def matricular(self, aspirante, metodo_pago: PagoBase):
        if aspirante.estado != "APROBADO":
            print(f"  Error: {aspirante.nombre_completo()} no esta aprobado para matricula.")
            return None

        monto = self.PRECIOS["inscripcion"]
        descripcion = f"Inscripcion ITSEIA - {aspirante.carrera_deseada[:30]}"

        print(f"\n  --- Procesando matricula: {aspirante.nombre_completo()} ---")
        exito = metodo_pago.procesar(monto, descripcion)

        if not exito:
            print("  Pago fallido. Matricula no procesada.")
            return None

        self._contador_matricula += 1
        numero = f"ITSEIA-2026-{self._contador_matricula:04d}"
        estudiante = Estudiante(aspirante, aspirante.carrera_deseada, numero)
        self._estudiantes[numero] = estudiante
        self._ingresos_total += monto
        aspirante.estado = "MATRICULADO"

        print(f"  Matricula exitosa: {numero}")
        print(f"  Via: {metodo_pago.nombre_metodo()}")
        return estudiante

    def reporte_general(self):
        print(f"\n{'=' * 58}")
        print(f"  REPORTE EJECUTIVO - SISTEMA MATRICULAS ITSEIA")
        print(f"  Fecha: {date.today()}")
        print(f"{'=' * 58}")
        print(f"  Total aspirantes  : {len(self._aspirantes)}")
        print(f"  Total matriculados: {len(self._estudiantes)}")
        print(f"  Ingresos cobrados : ${self._ingresos_total:,.2f}")
        print(f"\n  Distribucion por carrera:")
        conteo = {}
        for est in self._estudiantes.values():
            conteo[est.carrera] = conteo.get(est.carrera, 0) + 1
        for carrera, total in conteo.items():
            print(f"    {carrera[:45]:<45} {total} estudiantes")
        print(f"{'=' * 58}")


# ==========================================================
# EJECUCION DEL SISTEMA
# ==========================================================

sistema = SistemaMatriculas()

# Registrar aspirantes
a1 = sistema.registrar_aspirante(
    "1712345678", "Ana", "Guerrero", "ana.guerrero@gmail.com", "0991234567",
    "Quito", "Tecnologia Superior en Inteligencia Artificial"
)
a2 = sistema.registrar_aspirante(
    "0912345678", "Luis", "Cevallos", "luis.c@hotmail.com", "0987654321",
    "Guayaquil", "Tecnologia Superior en Ciencia de Datos"
)
a3 = sistema.registrar_aspirante(
    "1001234567", "Sofía", "Ponce", "sofia.ponce@gmail.com", "0993456789",
    "Quito", "Tecnologia Superior en Big Data e Ingenieria de Datos"
)

# Agregar documentos y aprobar
for aspirante, docs in [
    (a1, ["cedula", "bachillerato", "foto"]),
    (a2, ["cedula", "bachillerato", "foto"]),
    (a3, ["cedula"]),  # Le falta documentacion
]:
    print(f"\nDocumentos para {aspirante.nombre_completo()}:")
    for doc in docs:
        aspirante.agregar_documento(doc)
    aspirante.aprobar()

# Matricular con distintos metodos de pago
pago1 = PagoTarjeta("****4521", "Banco Pichincha")
pago2 = PagoTransferencia("2705914571", "Produbanco")

print("\n--- PROCESO DE MATRICULA ---")
est1 = sistema.matricular(a1, pago1)
est2 = sistema.matricular(a2, pago2)
sistema.matricular(a3, pago1)  # Debe fallar: no aprobado

# Registrar calificaciones
if est1:
    print()
    est1.registrar_calificacion("Matematicas para IA", 8.5)
    est1.registrar_calificacion("Python Fundamentos", 9.2)
    est1.registrar_calificacion("Logica Computacional", 7.8)
    est1.mostrar_boletin()

if est2:
    print()
    est2.registrar_calificacion("Estadistica Descriptiva", 6.5)
    est2.registrar_calificacion("Python Fundamentos", 8.0)
    est2.mostrar_boletin()

# Reporte final
sistema.reporte_general()
```

3. Ejecuta el sistema completo y verifica que todos los flujos funcionan.

4. Agrega un metodo `buscar_estudiante(numero_matricula)` al sistema que retorne el objeto `Estudiante` o `None` si no existe.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un sistema de matriculas en Python con POO. ¿Que mejoras de diseno le agregarias? Pienso en: persistencia de datos, autenticacion, historial de cambios. Sugiere 3 mejoras concretas con el patron de diseno que usarias para cada una."

Despues de leer la respuesta:
- Escoge una mejora y pregunta como implementarla con un ejemplo minimo.
- Reflexiona: ¿que piezas de este sistema ya estan en aplicaciones reales que usas?

## Que aprendiste

- Un sistema real integra multiples clases relacionadas: cada una con responsabilidad unica (Single Responsibility Principle).
- Las clases abstractas (`Persona`, `PagoBase`) garantizan que todas las subclases cumplan el mismo contrato.
- El polimorfismo permite cambiar el metodo de pago sin modificar la logica de matricula.
- El encapsulamiento protege datos sensibles (cedula) y controla el flujo de estados (PENDIENTE -> APROBADO -> MATRICULADO).
- La POO escala bien: agregar una nueva carrera o un nuevo metodo de pago requiere cambios minimos.

## Reto extra

Implementa el metodo `exportar_reporte_csv(nombre_archivo)` en `SistemaMatriculas` que escriba un archivo `.csv` con los datos de todos los estudiantes matriculados (numero, nombre, carrera, promedio). Usa el modulo `csv` de Python. Verifica abriendo el archivo en una hoja de calculo.
