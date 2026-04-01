# T-03: Privacidad y Proteccion de Datos del Paciente

**Tipo:** Leccion + Quiz
**Duracion:** 30 minutos
**Semana:** 1 — Modulo 3 de 9
**Curso:** IA para Profesionales de la Salud — ITSEIA Academy

---

> **AVISO IMPORTANTE:** La IA no reemplaza el criterio clinico profesional. Este modulo aborda un tema de responsabilidad legal y etica directa para el profesional de la salud. Su incumplimiento puede derivar en sanciones administrativas, civiles y penales bajo la legislacion ecuatoriana vigente.

---

## Objetivo de Aprendizaje

Al finalizar este modulo seras capaz de:

- Identificar el marco legal ecuatoriano aplicable al tratamiento de datos de salud
- Clasificar que datos son sensibles y cuales no pueden enviarse a herramientas de IA publica
- Aplicar tecnicas practicas de anonimizacion antes de usar IA
- Conocer tu responsabilidad legal como profesional que usa IA con informacion de pacientes

---

## Seccion 1: El Marco Legal Ecuatoriano — Lo que Todo Medico Debe Saber

### Ley Organica de Proteccion de Datos Personales (LOPDP)

Ecuador promulgo la Ley Organica de Proteccion de Datos Personales (LOPDP) en mayo de 2021, con reglamento aprobado en 2023. Esta ley define, protege y regula el tratamiento de datos personales de ciudadanos ecuatorianos.

**Que es un dato personal:**
Cualquier informacion sobre una persona natural identificada o identificable. Un nombre, un numero de cedula, una direccion, un numero de telefono.

**Que son datos sensibles (categoria especial):**
La LOPDP categoria como datos sensibles aquellos que, por su naturaleza, son especialmente protegidos. En el sector salud, esto incluye:

- Estado de salud fisica y mental
- Historia clinica
- Diagnosticos y tratamientos
- Resultados de examenes y laboratorios
- Condicion genetica
- Discapacidades
- Informacion sobre adicciones o enfermedades de alto estigma social

**Implicacion directa:** La historia clinica de un paciente es un dato sensible de primera categoria bajo la LOPDP.

### Obligaciones del profesional de salud bajo la LOPDP

Como medico o profesional de la salud que maneja datos de pacientes, eres considerado un **responsable del tratamiento de datos**. Tus obligaciones incluyen:

1. **Principio de finalidad:** Los datos del paciente solo pueden usarse para la finalidad para la cual fueron recopilados (atencion medica). Usarlos para entrenar IA o para propositos distintos sin consentimiento es una violacion.

2. **Principio de minimizacion:** Solo recopilas y usas los datos estrictamente necesarios para la atencion.

3. **Medidas de seguridad:** Debes implementar medidas tecnicas y organizativas para proteger los datos de acceso no autorizado.

4. **Confidencialidad:** Los datos no pueden compartirse con terceros sin base legal (incluyendo empresas de IA en otros paises).

### Ley Organica de Salud y el Expediente Clinico

La Ley Organica de Salud (LOS) y las normativas del MSP establecen:

- La historia clinica es confidencial
- El acceso esta restringido al equipo de salud tratante y al propio paciente
- El incumplimiento de la confidencialidad puede derivar en sanciones administrativas ante el MSP y el proceso disciplinario correspondiente

### Normativa IESS

Si trabajas en el IESS o atiendes pacientes del IESS, la informacion del expediente electronico del paciente esta sujeta adicionalmente a las politicas de seguridad informatica del IESS y al Reglamento de Atencion Medica del Seguro General de Salud Individual y Familiar.

---

## Seccion 2: El Problema Concreto — Que Pasa Cuando Pegas Datos en ChatGPT

ChatGPT, Claude y la mayoria de herramientas de IA publica son servicios de terceros operados por empresas extranjeras (OpenAI en EEUU, Anthropic en EEUU). Cuando envias texto a estas plataformas:

1. El texto es procesado en servidores fuera de Ecuador
2. En sus politicas de privacidad, estas empresas pueden usar la informacion para mejorar sus modelos (aunque ofrecen opciones para desactivar esto)
3. No hay acuerdo de procesamiento de datos (DPA) entre el medico ecuatoriano y estas empresas que cumpla los requisitos de la LOPDP para transferencia internacional de datos sensibles

**Escenario de riesgo real:**
```
Prompt enviado (INCORRECTO):
"Ana Martinez, CI 1723456789, 45 años, diagnostico VIH positivo confirmado
enero 2025, actualmente en TARV con Tenofovir/Emtricitabina/Dolutegravir.
Redacta una nota de evolucion para su control de marzo."
```

Este prompt envia: nombre completo, numero de cedula, diagnostico de condicion de alto estigma, esquema de tratamiento. Es una violacion directa de la LOPDP y del secreto medico.

---

## Seccion 3: Tecnicas de Anonimizacion — Practica Diaria

La buena noticia: la IA sigue siendo igual de util con datos anonimizados. Aqui estan las tecnicas que debes convertir en habito.

### Regla basica de oro

**NUNCA envies a una IA publica:** nombre completo, numero de cedula, fecha de nacimiento exacta, direccion, numero de telefono, nombre de familiares, o cualquier combinacion que permita identificar al paciente.

### Tecnica 1: Iniciales + Edad Aproximada

En lugar de: `Ana Martinez Roca, 45 años`
Usa: `Paciente A.M., mujer, 40-50 años`

En lugar de: `Carlos Andrade, CI 0912345678`
Usa: `Paciente masculino, 60-70 años`

### Tecnica 2: Despersonalizar el Caso

Transforma el caso en un escenario clinico generico sin perder los datos medicamente relevantes:

**Antes (identificable):**
```
"Mi paciente del IESS Guayaquil, Ana Martinez, quien vive en Duran y trabaja
como profesora, tiene diabetes tipo 2 de 10 años de evolucion..."
```

**Despues (anonimizado):**
```
"Paciente femenino, 45 años, diabetica tipo 2 de 10 años de evolucion..."
```

El dato medicamente relevante (edad, sexo, diagnostico, evolucion) esta intacto. El dato identitario (nombre, lugar, trabajo) ha desaparecido.

### Tecnica 3: Cambiar Datos No Clinicamente Relevantes

Si necesitas incluir contexto social (que si puede ser clinicamente relevante):
- No uses el nombre real: usa "paciente campesino", "paciente empleado de oficina"
- No uses la ubicacion exacta: "zona rural de la Sierra" en lugar de "parroquia X, canton Y"
- No uses fechas exactas: "6 semanas" en lugar de "desde el 15 de febrero de 2025"

### Tecnica 4: Datos Ficticios Equivalentes

Para ejercicios de documentacion, cuando el caso real es muy especifico:
- Crea un paciente ficticio con parametros equivalentes
- "Paciente ficticio con las mismas caracteristicas clinicas"
- Esto te permite entrenar el prompt y luego aplicarlo a casos reales ya anonimizados

### Que datos SÍ puedes incluir (clinicamente necesarios y no identificantes per se)

| Tipo de dato | Se puede incluir | Condicion |
|--------------|-----------------|-----------|
| Edad (rango) | Si | "40-50 años", no fecha exacta |
| Sexo biologico | Si | Relevante clinicamente |
| Diagnostico principal | Si | Sin nombre ni cedula |
| Laboratorios (valores) | Si | Sin fecha exacta ni cabecera identificante |
| Medicacion actual | Si | Sin datos del prescriptor |
| Sintomas y evolucion | Si | En forma clinica, sin detalle identificante |
| Condicion social relevante | Si anonimizado | "rural", "trabajador independiente", no nombre ni lugar |

---

## Seccion 4: Configuracion de Privacidad en las Herramientas

### ChatGPT: Deshabilitar uso de datos para entrenamiento

1. Ir a chatgpt.com → tu perfil (esquina superior derecha)
2. Configuracion → Control de datos
3. **Desactivar** "Mejorar el modelo para todos"
4. Esto evita que OpenAI use tus conversaciones para entrenar modelos futuros

**Nota:** En ChatGPT Team o Enterprise, el uso de datos para entrenamiento esta desactivado por defecto.

### Claude: Politica de privacidad

Anthropic, por politica, no usa las conversaciones de usuarios para entrenar modelos sin consentimiento explicito. Aun asi:
1. Verificar en configuracion de cuenta que no hay opcion de "mejorar con mis datos" activada
2. Para uso institucional, considerar Claude for Work (acuerdos empresariales con terminos mas estrictos)

### Principio de precaucion

Independientemente de la configuracion: si el dato es sensible, anonimizalo siempre antes de enviarlo. No dependas solo de la configuracion de privacidad de la plataforma.

---

## Seccion 5: Responsabilidad Legal — Consecuencias Concretas

### Sanciones bajo la LOPDP

La LOPDP establece infracciones y sanciones aplicables a personas naturales y juridicas:

- **Infracciones leves:** Multa de entre 0.1% y 0.7% del volumen de negocios anual
- **Infracciones graves:** Multa de entre 0.7% y 1% del volumen de negocios anual (o entre 10,000 y 20,000 USD para personas naturales)
- **Infracciones muy graves:** Multa de entre 1% y 2% del volumen de negocios anual

Compartir datos sensibles de salud sin base legal es tipicamente clasificado como infraccion grave o muy grave.

### Sanciones adicionales para profesionales de salud

- Sancion administrativa ante el MSP (suspension temporal de la autorizacion para ejercer)
- Proceso disciplinario ante el Colegio de Medicos provincial
- Responsabilidad civil por daños y perjuicios al paciente
- Responsabilidad penal si el incumplimiento configura delito (violacion de datos privados, Art. 229 COIP)

### El caso IESS

El IESS es especialmente sensible a esto. Si trabajas en el IESS y usas herramientas de IA externas con datos de pacientes del seguro social sin autorizacion institucional, esto puede constituir:
- Violacion de las politicas de seguridad informatica institucional
- Causal de sumario administrativo

---

## Resumen del Modulo

| Concepto | Lo clave |
|----------|----------|
| LOPDP Ecuador | Los datos de salud son sensibles. Su tratamiento inadecuado tiene sanciones concretas |
| Dato sensible en salud | Historia clinica, diagnostico, tratamiento, condicion genetica, discapacidad |
| Regla de oro | NUNCA nombre, cedula ni dato identificante en IA publica |
| Tecnica principal | Anonimizar = quitar nombre, cedula, fecha exacta, lugar; mantener datos clinicos |
| ChatGPT privacidad | Desactivar "mejorar el modelo para todos" en configuracion |
| Responsabilidad | El medico es responsable del tratamiento de datos de su paciente, siempre |

---

## Quiz de este Modulo

Este modulo incluye evaluacion. El quiz cubre T-03 y T-04 (Privacidad + Criterio Clinico). Lo encontraras al finalizar el modulo T-04.

**Puntaje minimo para aprobar:** 70% (6 de 8 preguntas)
**Intentos permitidos:** 2

---

## Ejercicio Rapido (5 minutos)

Toma el siguiente caso y reescribelo de forma correctamente anonimizada para poder enviarlo a una IA sin violar la privacidad del paciente:

**Caso original (como NO debe enviarse):**
```
"Patricia Lema Salgado, cedula 1756234890, 52 años, docente del colegio
Simon Bolivar de Riobamba. Diagnostico: lupus eritematoso sistemico diagnosticado
hace 3 años, actualmente con brote leve. Laboratorios de enero 2025:
ANA positivo 1:320, anti-dsDNA positivo, C3 bajo. Medicacion: hidroxicloroquina
200mg c/12h, prednisona 5mg/dia. Me pide certificado para licencia medica."
```

Reescribe el caso eliminando todos los datos identificantes y conservando los datos clinicamente relevantes.

*(Respuesta modelo disponible al inicio del siguiente modulo)*

---

*Siguiente modulo: T-04 — IA y criterio clinico: cuando NO confiar en la IA*

*Modulo creado por ITSEIA Academy | Marzo 2026 | Revision medica pendiente*
*La IA no reemplaza el criterio clinico profesional.*
