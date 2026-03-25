# Ejercicio Sesion 4: Documentacion de Codigo y Proyectos de Software

**Materia:** Comunicacion Academica y Tecnica
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion:** 40 min

## Objetivo
Escribir documentacion tecnica efectiva para codigo Python y proyectos de software, usando los estandares profesionales de docstrings, README y comentarios inline que usan las empresas de tecnologia en Ecuador y el mundo.

## Contexto (Ecuador)
Empresas tecnologicas en Ecuador como Tata Consultancy Services Ecuador, Accenture Ecuador y Kruger Corp exigen que todo codigo entregado tenga documentacion. Un codigo sin documentar no puede ser mantenido por otra persona. En proyectos del gobierno ecuatoriano (contratos SERCOP), la documentacion es requisito legal del contrato. El codigo indocumentado es codigo desechable.

## Instrucciones (paso a paso)

**Paso 1 — Analiza codigo sin documentar (5 min)**
Lee este fragmento de codigo Python real (sin documentacion):

```python
def calcular(s, h, d):
    base = s * h / 160
    extra = 0
    if h > 160:
        extra = (h - 160) * (s / 160) * 1.5
    total = base + extra
    if d == True:
        total = total - (total * 0.0945)
    return round(total, 2)
```

Preguntas:
- Que hace esta funcion? Puedes adivinarlo?
- Que significan s, h, d?
- Por que 160? Por que 0.0945? Por que 1.5?
- Si esta funcion falla en produccion a las 3am, podrias arreglarla en 5 minutos?

**Paso 2 — Documenta el codigo correctamente (20 min)**
Reescribe la funcion con documentacion profesional que incluya:

**a) Docstring completo (formato Google Style):**
```python
def calcular_sueldo_neto(sueldo_base: float, horas_trabajadas: int, aplicar_iess: bool) -> float:
    """
    Calcula el sueldo neto de un empleado ecuatoriano.

    Considera horas extras al 150% segun el Codigo del Trabajo ecuatoriano.
    El descuento del IESS personal es del 9.45% segun normativa vigente 2024.

    Args:
        sueldo_base: Sueldo mensual base en dolares USD.
        horas_trabajadas: Total de horas trabajadas en el mes.
        aplicar_iess: Si True, aplica descuento de aporte personal IESS (9.45%).

    Returns:
        Sueldo neto en dolares USD redondeado a 2 decimales.

    Example:
        >>> calcular_sueldo_neto(500, 180, True)
        462.78
    """
```

**b) Comentarios inline para la logica:** Agrega comentarios en cada linea que no sea obvia.

**c) README.md del proyecto:** Escribe un README de minimo 15 lineas para el proyecto "Sistema de Nomina ITSEIA" que contenga: descripcion, requisitos, instalacion, uso, ejemplo de entrada/salida, y autor.

**Paso 3 — Revision con Claude (15 min)**
Comparte tu documentacion:

```
Soy estudiante de programacion en Ecuador. Documente esta funcion Python:
[pega tu funcion documentada]
Y escribi este README:
[pega tu README]
Por favor:
1. El docstring sigue el formato Google Style correctamente?
2. Los comentarios inline son utiles o son obvios (redundantes)?
3. El README es suficiente para que alguien instale y use el proyecto sin preguntarme nada?
4. Que falta para que este README sea de nivel profesional en GitHub?
5. Hay terminos tecnicos en la documentacion que deberian explicarse mas?
```

## Usa IA para...
Auditar si la documentacion es suficientemente clara para que un desarrollador externo pueda usar el codigo sin contactar al autor.

## Que aprendiste
- Un codigo bien documentado se puede mantener anos despues, incluso por otra persona
- Los docstrings son la primera linea de defensa contra bugs de mantenimiento
- Un README excelente en GitHub aumenta la visibilidad de un proyecto y es parte del portafolio profesional

## Reto extra
Toma el pseudocodigo que escribiste en la sesion 5 de Logica (calculo de sueldo ecuatoriano) y convierte solo el modulo principal a Python real. Documenta cada linea segun lo aprendido hoy. Sube el archivo a un repositorio de GitHub (gratuito) y comparte el enlace.
