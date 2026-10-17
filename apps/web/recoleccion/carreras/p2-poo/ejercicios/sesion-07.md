# Ejercicio Sesion 7: Clases Abstractas e Interfaces

**Materia:** Programacion Orientada a Objetos
**Nivel:** Intermedio
**Herramienta IA:** Copilot
**Duracion estimada:** 45 min

## Objetivo

Usar el modulo `abc` de Python para crear clases abstractas e interfaces, modelando un sistema de reportes para diferentes tipos de organismos reguladores ecuatorianos (SUPERCIAS, SRI, IESS).

## Contexto

En Ecuador, las empresas deben presentar reportes obligatorios a distintos organismos: balances a la Superintendencia de Companias (SUPERCIAS), declaraciones de IVA y renta al SRI, y planillas de aportes al IESS. Cada reporte tiene una estructura diferente pero todos comparten el mismo ciclo: generar, validar y enviar. Una clase abstracta garantiza que toda implementacion cumpla con ese contrato.

## Instrucciones

1. Crea el archivo `sesion07_clases_abstractas.py`.

2. Implementa el sistema de reportes:

```python
# POO - Sesion 7: Clases Abstractas e Interfaces
# ITSEIA - Periodo 2

from abc import ABC, abstractmethod
from datetime import date


# ========================================================
# CLASE ABSTRACTA BASE (no se puede instanciar directamente)
# ========================================================
class ReporteRegulatorio(ABC):
    """
    Clase abstracta: define el contrato que todos los reportes
    regulatorios en Ecuador deben cumplir.
    """

    def __init__(self, empresa, periodo):
        self.empresa = empresa
        self.periodo = periodo
        self.fecha_generacion = date.today()
        self._validado = False
        self._enviado = False

    # METODOS ABSTRACTOS: las subclases DEBEN implementarlos
    @abstractmethod
    def generar(self):
        """Genera el contenido del reporte."""
        pass

    @abstractmethod
    def validar(self):
        """Valida que el reporte cumple los requisitos del organismo."""
        pass

    @abstractmethod
    def organismo_regulador(self):
        """Retorna el nombre del organismo al que se envia."""
        pass

    # METODO CONCRETO (compartido por todas las subclases)
    def enviar(self):
        """Flujo estandar: generar -> validar -> enviar."""
        print(f"\n{'=' * 58}")
        print(f"  REPORTE: {self.__class__.__name__}")
        print(f"  Empresa : {self.empresa}")
        print(f"  Periodo : {self.periodo}")
        print(f"  Organo  : {self.organismo_regulador()}")
        print(f"{'=' * 58}")

        contenido = self.generar()
        print(contenido)

        if self.validar():
            self._validado = True
            self._enviado = True
            print(f"\n  ENVIADO exitosamente a {self.organismo_regulador()}")
            print(f"  Fecha de envio: {self.fecha_generacion}")
        else:
            print(f"\n  RECHAZADO: el reporte no paso la validacion.")

        return self._enviado

    def estado(self):
        return {
            "validado": self._validado,
            "enviado": self._enviado,
            "organismo": self.organismo_regulador()
        }


# ========================================================
# INTERFACE adicional: Auditabilidad
# ========================================================
class Auditable(ABC):
    """Interface: los reportes auditables deben poder exportarse."""

    @abstractmethod
    def exportar_xml(self):
        pass

    @abstractmethod
    def codigo_verificacion(self):
        pass


# ========================================================
# IMPLEMENTACIONES CONCRETAS
# ========================================================
class ReporteSUPERCIAS(ReporteRegulatorio, Auditable):
    """Balance General para Superintendencia de Companias, Ecuador."""

    def __init__(self, empresa, periodo, activos, pasivos):
        super().__init__(empresa, periodo)
        self.activos = activos
        self.pasivos = pasivos
        self.patrimonio = activos - pasivos

    def organismo_regulador(self):
        return "SUPERCIAS (Superintendencia de Companias)"

    def generar(self):
        return (
            f"\n  BALANCE GENERAL\n"
            f"  Activos Totales  : ${self.activos:>12,.2f}\n"
            f"  Pasivos Totales  : ${self.pasivos:>12,.2f}\n"
            f"  Patrimonio Neto  : ${self.patrimonio:>12,.2f}"
        )

    def validar(self):
        # Ecuacion contable: Activos = Pasivos + Patrimonio
        if abs(self.activos - (self.pasivos + self.patrimonio)) > 0.01:
            print("  Error: la ecuacion contable no cuadra.")
            return False
        if self.activos <= 0:
            print("  Error: activos deben ser mayores a 0.")
            return False
        return True

    def exportar_xml(self):
        return f"<balance empresa='{self.empresa}' periodo='{self.periodo}' activos='{self.activos}'/>"

    def codigo_verificacion(self):
        return f"SC-{self.empresa[:4].upper()}-{self.periodo}-{int(self.activos)}"


class ReporteSRI(ReporteRegulatorio):
    """Declaracion de IVA mensual para el SRI Ecuador."""

    IVA = 0.15

    def __init__(self, empresa, periodo, ventas_gravadas, compras_gravadas):
        super().__init__(empresa, periodo)
        self.ventas_gravadas = ventas_gravadas
        self.compras_gravadas = compras_gravadas

    def organismo_regulador(self):
        return "SRI (Servicio de Rentas Internas)"

    def generar(self):
        iva_ventas = self.ventas_gravadas * ReporteSRI.IVA
        iva_compras = self.compras_gravadas * ReporteSRI.IVA
        saldo = iva_ventas - iva_compras
        tipo = "A PAGAR" if saldo >= 0 else "CREDITO TRIBUTARIO"
        return (
            f"\n  DECLARACION IVA FORMULARIO 104\n"
            f"  Ventas gravadas  : ${self.ventas_gravadas:>12,.2f}\n"
            f"  IVA en ventas    : ${iva_ventas:>12,.2f}\n"
            f"  Compras gravadas : ${self.compras_gravadas:>12,.2f}\n"
            f"  IVA en compras   : ${iva_compras:>12,.2f}\n"
            f"  Resultado        : ${abs(saldo):>12,.2f} ({tipo})"
        )

    def validar(self):
        if self.ventas_gravadas < 0 or self.compras_gravadas < 0:
            print("  Error: valores negativos no permitidos.")
            return False
        return True


class ReporteIESS(ReporteRegulatorio):
    """Planilla de aportes al IESS Ecuador."""

    APORTE_PATRONAL = 0.1215
    APORTE_PERSONAL = 0.0945

    def __init__(self, empresa, periodo, empleados_data):
        super().__init__(empresa, periodo)
        self.empleados_data = empleados_data  # Lista de (nombre, salario)

    def organismo_regulador(self):
        return "IESS (Instituto Ecuatoriano de Seguridad Social)"

    def generar(self):
        lineas = ["\n  PLANILLA MENSUAL DE APORTES IESS\n"]
        total_patronal = 0
        total_personal = 0
        for nombre, salario in self.empleados_data:
            patronal = salario * self.APORTE_PATRONAL
            personal = salario * self.APORTE_PERSONAL
            total_patronal += patronal
            total_personal += personal
            lineas.append(f"  {nombre:<25} Sueldo: ${salario:>8.2f} | "
                          f"Patron: ${patronal:>7.2f} | Personal: ${personal:>7.2f}")
        lineas.append(f"\n  TOTAL APORTE PATRONAL : ${total_patronal:>10,.2f}")
        lineas.append(f"  TOTAL APORTE PERSONAL : ${total_personal:>10,.2f}")
        lineas.append(f"  TOTAL A DEPOSITAR     : ${total_patronal + total_personal:>10,.2f}")
        return "\n".join(lineas)

    def validar(self):
        if not self.empleados_data:
            print("  Error: no hay empleados en la planilla.")
            return False
        return True


# --- No se puede instanciar la clase abstracta ---
try:
    r = ReporteRegulatorio("Test", "2026-01")
except TypeError as e:
    print(f"Correcto - No se puede instanciar clase abstracta: {e}\n")

# --- Generar y enviar reportes ---
empresa_nombre = "Tech Solutions S.A."

reporte1 = ReporteSUPERCIAS(empresa_nombre, "2025", 850000, 320000)
reporte2 = ReporteSRI(empresa_nombre, "Marzo 2026", 48000, 35000)
reporte3 = ReporteIESS(empresa_nombre, "Marzo 2026", [
    ("Santiago Morales", 3500),
    ("Daniela Chaves", 1800),
    ("Pablo Narvaez", 800),
    ("Rosa Paucar", 950),
])

reportes = [reporte1, reporte2, reporte3]
for reporte in reportes:
    reporte.enviar()

# --- Resumen de estados ---
print("\n\nRESUMEN DE ENVIOS:")
for reporte in reportes:
    estado = reporte.estado()
    simbolo = "OK" if estado["enviado"] else "PENDIENTE"
    print(f"  [{simbolo}] {estado['organismo']}")

# --- Funcionalidad de la interface Auditable ---
print(f"\nXML SUPERCIAS: {reporte1.exportar_xml()}")
print(f"Codigo verificacion: {reporte1.codigo_verificacion()}")
```

3. Ejecuta y verifica que todos los reportes se generan y validan correctamente.

4. Intenta instanciar `ReporteRegulatorio` directamente y observa el `TypeError`.

## Usa IA para...

> Abre GitHub Copilot (en VS Code) y escribe el comentario:
> `# Crear clase abstracta ReporteAnual que herede de ReporteRegulatorio y Auditable`

Observa lo que Copilot sugiere y luego:
- Acepta o modifica la sugerencia para que compile correctamente.
- Pregunta a Copilot via chat: "¿Cual es la diferencia entre una clase abstracta (ABC) y una interface en Python? ¿Python tiene interfaces reales?"

## Que aprendiste

- `ABC` (Abstract Base Class) del modulo `abc` permite definir clases que no se pueden instanciar directamente.
- `@abstractmethod` obliga a las subclases a implementar ese metodo; si no lo hacen, Python lanza `TypeError` al intentar instanciarlas.
- Los metodos concretos en la clase abstracta (como `enviar()`) definen comportamiento reutilizable que todas las subclases heredan.
- Python no tiene interfaces formales; se simulan con clases abstractas que solo tienen metodos abstractos.
- La herencia multiple con ABC permite que una clase cumpla multiples "contratos" al mismo tiempo.

## Reto extra

Crea la clase `ReporteConsolidado` que recibe una lista de reportes ya enviados y genera un unico informe ejecutivo que resume el estado de todos ellos. Esta clase NO necesita heredar de `ReporteRegulatorio` pero si debe validar que todos los reportes fueron enviados antes de consolidar.
