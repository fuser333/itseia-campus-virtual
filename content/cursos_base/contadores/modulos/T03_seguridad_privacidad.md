# T-03: Seguridad y Privacidad de Datos Financieros

**Tipo:** Leccion + Quiz
**Duracion:** 30 minutos
**Semana:** 2
**Herramientas:** Referencia a ChatGPT Enterprise y Claude for Work

---

## Objetivo de Aprendizaje

Al finalizar este modulo, sabras exactamente que informacion financiera puedes y no puedes subir a herramientas de IA publicas, como anonimizar datos de clientes para trabajar con IA sin comprometer la confidencialidad, y que implica la Ley Organica de Proteccion de Datos Personales del Ecuador para tu practica profesional.

---

## 1. El problema que nadie te esta diciendo

Cuando un contador sube el balance general de su cliente a ChatGPT para pedir analisis, ¿donde va esa informacion?

La respuesta depende de la version y la configuracion que uses, pero en el caso del ChatGPT gratuito y ChatGPT Plus sin ajustes de privacidad: tus conversaciones pueden ser revisadas por empleados de OpenAI para mejorar el modelo, y hasta mediados de 2023 el historial se usaba directamente para entrenamiento.

Esto no significa que tu informacion se publique ni que alguien la vea activamente. Pero si significa que no tienes garantias contractuales de confidencialidad sobre los datos que compartes.

Para un contador que maneja informacion financiera de terceros, eso es un riesgo profesional y potencialmente legal.

---

## 2. Que dice cada plataforma sobre tus datos

### OpenAI (ChatGPT)

**Plan gratuito y Plus:**
- Las conversaciones pueden usarse para mejorar los modelos de OpenAI
- Puedes desactivar el historial en Configuracion > Controles de datos > "Mejorar el modelo para todos"
- Con historial desactivado: las conversaciones no se usan para entrenamiento, pero los datos pasan por los servidores de OpenAI

**ChatGPT Enterprise y ChatGPT Team:**
- OpenAI NO usa los datos de estos planes para entrenar modelos
- Hay cifrado en transito y en reposo
- Cumple con SOC 2 Type II
- Precio: Enterprise requiere negociacion directa (generalmente $30-$60/usuario/mes)

**Recomendacion practica:** Si usas ChatGPT Plus personal para trabajo con clientes, activa "No usar mis conversaciones para entrenar modelos" y nunca subas datos con informacion identificable real.

### Anthropic (Claude)

**Claude.ai gratuito y Pro:**
- Anthropic puede revisar conversaciones para seguridad y mejora de modelos
- Politica similar a OpenAI en terminos de uso de datos

**Claude for Work (API y planes empresariales):**
- Anthropic no entrena sus modelos con datos de clientes API
- Acuerdos de procesamiento de datos disponibles para compliance
- GDPR y similar

### Microsoft Copilot (M365)

Si tu empresa tiene Microsoft 365 Business Standard o superior:
- Los datos de Copilot en Excel, Word, Outlook estan cubiertos por el acuerdo de datos empresariales de Microsoft
- No se usan para entrenar modelos de IA
- Permanecen dentro del tenant de tu organizacion
- Esta es la opcion mas segura para trabajo con datos de clientes porque no salen del ecosistema corporativo

---

## 3. Datos que NUNCA debes subir a IA publica

Esta lista es la regla de oro. Imprímela y pegala en tu monitor si hace falta.

**Identificadores directos — PROHIBIDO:**
- RUC de clientes
- Numero de cedula de representantes legales
- Numeros de cuenta bancaria
- Numeros de tarjeta de credito empresarial
- Passwords de sistemas contables o del SRI
- Informacion de acceso al portal SRI del cliente

**Informacion financiera sensible — PROHIBIDO sin anonimizar:**
- Estados financieros con nombre real de empresa
- Libros contables con transacciones identificables
- Declaraciones tributarias (formulario 101, 104, ATS) con datos reales
- Nominas con nombres y cedulas de empleados
- Contratos con valores y contrapartes reales

**Documentacion legal — PROHIBIDO sin anonimizar:**
- Actas de directorio con temas estrategicos confidenciales
- Informes de auditoria sin publicar
- Documentacion de procesos judiciales o fiscalizaciones

---

## 4. Tecnicas de anonimizacion para trabajar con IA

Anonimizar datos no significa que no puedas usar la IA con datos de clientes. Significa que antes de subirlos, reemplazas la informacion identificable con datos ficticios que mantienen la estructura y los valores numericos.

### Tecnica 1: Sustitucion sistematica

Antes de subir un balance:
- Empresa: "Importadora ABC S.A." → "Empresa XYZ S.A."
- RUC: "1792345678001" → "9999999999001"
- Representante legal: "Juan Perez" → "Nombre Representante"
- Banco: "Banco Pichincha" → "Banco A"
- Mantener: todos los valores numericos, fechas de periodo, cuentas contables

La estructura del analisis sera identica, pero no habra datos identificables.

### Tecnica 2: Agregacion de datos

En lugar de subir transacciones individuales con proveedores identificables, sube el resumen por categoria:
- "Transacciones con proveedores nacionales: 245 operaciones, total $1,250,000, promedio $5,102"
- Sin nombres de proveedores, sin RUCs, sin facturas individuales

### Tecnica 3: Datos ficticios estructuralmente correctos

Para practicar o aprender sobre un proceso, crea un set de datos ficticio que tenga la misma estructura que tus datos reales. Esto es especialmente util para entrenar prompts antes de usarlos con datos reales.

### Tecnica 4: Solo preguntar por el proceso, no por los datos

En muchos casos, no necesitas subir datos. Necesitas entender el proceso.

Malo: [sube el ATS completo con datos reales] "¿Este ATS tiene errores?"
Mejor: "¿Cuales son los campos del ATS que mas frecuentemente generan errores de validacion en el portal del SRI? Dame los 5 mas comunes y como corregirlos."

---

## 5. La LOPDP y el contador ecuatoriano

La Ley Organica de Proteccion de Datos Personales (LOPDP) entro en vigencia en Ecuador el 26 de mayo de 2023. Como contador que maneja datos financieros de personas naturales y juridicas, tienes responsabilidades especificas.

### Lo que dice la ley que te afecta

**Articulo relevante:** La LOPDP establece que los datos de personas naturales (empleados, socios, accionistas) son datos personales protegidos. Al procesarlos con terceros (incluidas plataformas de IA), actuas como "responsable del tratamiento".

**Principio de finalidad:** Solo puedes usar los datos personales para el proposito para el que fueron recopilados. Si un empleado dio su cedula para su contrato laboral, esa cedula no puede subirse a una IA para "analisis de datos" sin base legal adicional.

**Principio de minimizacion:** Debes procesar solo los datos estrictamente necesarios. Si para calcular el impuesto a la renta de empleados la IA solo necesita el salario y las deducciones, no hay razon para incluir nombres y cedulas.

**Tu responsabilidad practica:**
1. Si usas plataformas de IA en tu trabajo con clientes, menciona en tu contrato de servicios que puedes usar herramientas de procesamiento digital, especificando que se tomaran medidas de anonimizacion
2. Para datos de empleados (nominas, IESS), prefiere siempre herramientas que esten dentro del ecosistema corporativo del cliente (M365 Copilot) sobre plataformas publicas
3. Nunca subas cedulas de identidad, aunque sean de personas juridicas cuyos representantes conoces

---

## Resumen del Modulo

- Las versiones publicas de ChatGPT y Claude pueden usar tus conversaciones para mejorar sus modelos — activa las opciones de privacidad disponibles
- ChatGPT Enterprise, Claude for Work y Microsoft M365 Copilot ofrecen garantias contractuales de no entrenamiento con tus datos
- Nunca subas: RUC, cedulas, cuentas bancarias, declaraciones tributarias con datos reales
- La anonimizacion sistematica (sustitucion de identificadores + mantener numeros) te permite usar IA de forma segura
- La LOPDP del Ecuador te hace responsable del tratamiento de datos personales al usar plataformas de terceros
- Regla de oro: si no publicarias ese documento en internet, no lo subas a una IA publica sin anonimizar

---

## Ejercicio Rapido

**Actividad — Anonimiza en 5 minutos**

Toma un documento contable corto de tu trabajo (puede ser una nota a estados financieros, un asiento contable, o un resumen de cuentas). Aplica la Tecnica 1 de anonimizacion: sustituye todos los identificadores reales por ficticios. Cronometrate — en 5 minutos o menos deberias poder hacerlo. Esto se vuelve habito rapido con la practica.

Una vez anonimizado, sube el resultado a Claude o ChatGPT y pide un analisis. Comprueba que el analisis es igualmente util sin los datos reales.
