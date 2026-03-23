# T-02: ChatGPT y Claude en la Practica Clinica

**Tipo:** Leccion
**Duracion:** 60 minutos
**Semana:** 1 — Modulo 2 de 9
**Curso:** IA para Profesionales de la Salud — ITSEIA Academy

---

> **AVISO IMPORTANTE:** La IA no reemplaza el criterio clinico profesional. Los ejemplos y prompts de este modulo son herramientas de apoyo. Todo resultado generado por IA debe ser revisado y validado por el profesional de salud responsable antes de aplicarse en atencion de pacientes reales.

---

## Objetivo de Aprendizaje

Al finalizar este modulo seras capaz de:

- Distinguir las caracteristicas practicas de ChatGPT y Claude para uso clinico
- Escribir prompts medicos efectivos que generen resultados utiles y seguros
- Aplicar IA a al menos 5 tareas clinicas cotidianas con una tecnica estructurada
- Identificar cuando un resultado de IA requiere verificacion antes de usarlo

---

## Seccion 1: ChatGPT vs Claude — Diferencias que Importan en Clinica

Ambos son excelentes herramientas. La diferencia practica para un medico es sutil pero importante.

### ChatGPT (OpenAI)

**Version gratuita (GPT-3.5):** Util para tareas basicas. Limitada en razonamiento clinico complejo.

**ChatGPT Plus (GPT-4o, $20/mes):** La version que recomendamos. Tiene acceso a navegacion web, puede analizar documentos PDF y tiene memoria de conversacion. Para medicos es notablemente mejor.

**Fortalezas clinicas:**
- Muy bueno generando borradores de documentos estructurados (SOAP, epicrisis)
- Explica conceptos medicos con claridad variable segun el prompt
- Puede analizar un PDF de guia clinica y responder preguntas sobre ella
- Tiene una base de conocimiento medico amplia y actualizada a 2024

**Debilidades clinicas:**
- Tendencia a generar informacion con exceso de confianza ("alucinaciones")
- Puede inventar referencias bibliograficas que no existen
- Sus respuestas de dosis y protocolos deben verificarse siempre
- No conoce protocolos especificos del MSP o IESS por defecto

### Claude (Anthropic)

**Version gratuita (Claude 3.5 Haiku):** Accesible y util para tareas cotidianas.

**Claude Pro (Claude Sonnet/Opus, $20/mes):** Mayor capacidad de razonamiento y menor tendencia a alucinaciones.

**Fortalezas clinicas:**
- Mayor precisión siguiendo instrucciones estructuradas
- Menor tendencia a inventar informacion — tiende a decir "no lo se" o "verificar"
- Excelente para analizar documentos largos (historia clinica, articulos)
- Respuestas mas cuidadosas en temas de alto riesgo

**Debilidades clinicas:**
- Puede ser mas conservador (a veces excesivamente cauteloso)
- La version gratuita tiene limites de uso mas estrictos en horas de alta demanda
- Menos capacidad de busqueda web en tiempo real que ChatGPT Plus

### Recomendacion practica

Usa **ChatGPT Plus** si tienes el presupuesto y necesitas analizar documentos PDF o busqueda web en tiempo real.

Usa **Claude** (gratuito o Pro) si buscas respuestas mas cuidadosas y precisas, especialmente para razonamiento clinico y analisis de historias clinicas largas.

En la practica, muchos medicos usan ambos y comparan respuestas en decisiones importantes. No es redundante — es criterio.

---

## Seccion 2: Prompting Medico — La Tecnica que Marca la Diferencia

La calidad de lo que obtienes de una IA depende casi completamente de como formulas la pregunta. Esto se llama "prompting" y tiene tecnicas especificas para uso clinico.

### La estructura de un buen prompt medico

Un prompt medico efectivo tiene 4 componentes:

```
[ROL] + [CONTEXTO CLINICO] + [TAREA ESPECIFICA] + [FORMATO DE SALIDA]
```

**Ejemplo malo:**
```
Que hago con un paciente diabetico?
```

**Ejemplo bueno:**
```
Eres un internista con experiencia en medicina familiar.
Tengo un paciente de 58 anos, diabetico tipo 2 de 10 anos de evolucion,
en metformina 1g c/12h, con HbA1c de 8.9% en control reciente.
Genera una lista de diagnosticos diferenciales para fatiga cronica de 6 semanas,
considerando complicaciones de diabetes y comorbilidades frecuentes.
Formato: lista numerada, maximo 8 items, ordenados por probabilidad.
```

### Los 5 elementos de un prompt clinico de calidad

**1. Define el rol de la IA**
Indicar que actue como un especialista especifico mejora drasticamente la calidad de la respuesta.

```
"Actua como internista con experiencia en diabetologia..."
"Eres un farmacologico clínico revisando una prescripcion..."
"Eres una enfermera experta en cuidados paliativos..."
```

**2. Entrega contexto clinico especifico**
La IA responde mejor con mas informacion del caso. No es necesario que sea identificable (de hecho, no debe serlo — ver modulo T-03).

```
"Paciente femenino, 45 anos, IMC 32, HTA controlada con losartan,
sin antecedentes oncologicos, consulta por cefalea persistente 3 semanas..."
```

**3. Formula la tarea de manera exacta**
Que quieres exactamente: un diagnostico diferencial, un borrador de nota, una explicacion para el paciente, una revision de interacciones?

**4. Especifica el formato de salida**
Lista, tabla, parrafo, esquema SOAP, en que idioma, a que nivel educativo.

**5. Indica las limitaciones**
Di explicitamente que NO quieres: "no inventes referencias", "no incluyas patologias raras sin justificacion", "solo opciones disponibles en Ecuador".

---

## Seccion 3: Casos de Uso Practicos — Los 6 que Mas Valor Generan

### Caso de uso 1: Diagnostico diferencial

**Cuando usarlo:** Al inicio de la evaluacion de un caso complejo o poco claro.

**Prompt tipo:**
```
Actua como internista con experiencia clinica.
Paciente: hombre, 42 anos, empleado de oficina.
Motivo de consulta: fatiga progresiva 8 semanas, sudoracion nocturna ocasional,
perdida de peso ~4kg, sin fiebre documentada.
Antecedentes: fumador activo 1 paquete/dia por 15 anos. Sin otros antecedentes relevantes.
Genera un diagnostico diferencial ordenado por probabilidad.
Incluye para cada uno: probabilidad estimada (alta/media/baja), examenes clave para confirmar,
y una bandera roja si aplica.
No incluyas mas de 8 diagnosticos.
```

**Lo que obtienes:** Una lista estructurada como punto de partida para tu razonamiento. Tu criterio clinico decide cuales explorar primero.

**Lo que NO debes hacer:** Copiar la lista sin evaluacion propia y ordenar todos los examenes que sugiere.

---

### Caso de uso 2: Nota clinica SOAP

**Cuando usarlo:** Al finalizar la consulta, dictando o escribiendo un resumen y pidiendo que lo estructure.

**Prompt tipo:**
```
Convierte este resumen de consulta en una nota clinica formato SOAP.
Sé conciso y clinicamente preciso.
No inventes datos que no mencione.

Resumen: "Paciente Carmen T., 38 anos, viene por cuadro de 3 dias de tos seca,
rinorrea clara, febricula 37.5C, sin disnea. Examen: faringe congestiva,
sin exudados. Pulmones limpios. Diagnostico: IVRS viral. Plan: paracetamol
500mg c/8h por 3 dias, loratadina 10mg/dia, hidratacion, reposo relativo.
Control si no mejora en 72 horas o aparece disnea."

Formato: nota SOAP, lenguaje tecnico medico, tercera persona, maximo 150 palabras.
```

**Consejo practico:** Graba un audio de 60 segundos con el resumen de la consulta, transcribelo con cualquier app, pega el texto y genera la nota SOAP. En clinicas con buen internet, esto funciona en menos de 2 minutos.

---

### Caso de uso 3: Educacion al paciente

**Cuando usarlo:** Cuando necesitas explicar un diagnostico, un medicamento o un procedimiento a un paciente con nivel educativo bajo o que consulta desde una zona rural.

**Prompt tipo:**
```
Explica la hipertension arterial para un paciente de 65 anos, campesino,
con educacion primaria, de la Sierra ecuatoriana.
Usa lenguaje simple, sin terminos tecnicos.
Incluye: que es la enfermedad, por que es peligrosa, como se controla con pastillas,
cambios de habitos (comida, sal, ejercicio), y cuando ir de urgencia.
Tono: amable, sin asustar. Longitud: 200 palabras.
```

**Variante util:** Pide que lo genere como "instrucciones de alta" o "hoja de informacion para el paciente" — puedes imprimirla o enviarla por WhatsApp.

---

### Caso de uso 4: Revision de interacciones medicamentosas

**Cuando usarlo:** Antes de prescribir un nuevo medicamento a un paciente polimedicado.

**Prompt tipo:**
```
Revisa posibles interacciones medicamentosas para un paciente de 70 anos
con la siguiente medicacion actual:
- Metformina 1g c/12h
- Losartan 50mg/dia
- Atorvastatina 20mg noche
- Aspirina 100mg/dia
- Omeprazol 20mg/dia

Voy a agregar: Ciprofloxacino 500mg c/12h por 7 dias por ITU.

Identifica: interacciones relevantes, nivel de riesgo (mayor/moderada/menor),
y que accion tomar. Sé breve y clinicamente util.
IMPORTANTE: Esta informacion es de apoyo. Verificar en fuente farmacologica
primaria antes de prescribir.
```

**Advertencia critica:** Siempre verifica con Micromedex, UpToDate o vademecum oficial. La IA puede omitir interacciones importantes o exagerar otras. Usala como primer filtro, no como ultima palabra.

---

### Caso de uso 5: Resumen de articulo o guia clinica

**Cuando usarlo:** Cuando tienes un PDF de guia clinica o articulo y necesitas extraer puntos clave rapidamente. (Requiere ChatGPT Plus con capacidad de subir documentos, o pegar el texto.)

**Prompt tipo:**
```
Analiza este fragmento de la guia ADA 2025 de diabetes y responde:
1. Cual es el objetivo de HbA1c para adultos mayores de 65 anos segun esta guia?
2. Cuando se recomienda agregar GLP-1 al esquema de metformina?
3. Hay alguna recomendacion especifica sobre enfermedad renal cronica estadio 3?

[Pegar texto del fragmento relevante]

Responde solo con informacion del texto que te di. Si no esta en el texto, dilo.
```

**Regla de oro:** Cuando pides resumen de un documento especifico y le pasas el texto, la IA tiene mucho menos margen para inventar. Siempre pega el texto fuente cuando puedas.

---

### Caso de uso 6: Informes para aseguradoras e IESS

**Cuando usarlo:** Al redactar informes de referencia, justificacion de procedimientos, o respuestas a auditoria.

**Prompt tipo:**
```
Redacta un informe de referencia al segundo nivel para el siguiente caso,
en formato exigido por el MSP Ecuador (datos del paciente anonimizados):

Paciente femenino, 34 anos. Diagnostico: colecistitis cronica litiasica
confirmada por ecografia (calculos multiples, mayor 12mm).
Sintomas: dolor en hipocondrio derecho posiprandial recurrente por 6 meses.
Fallo de tratamiento medico (dieta, espasmoliticos).
Solicito: valoracion por cirugia general para colecistectomia laparoscopica.

Formato: formal, tercero, sin abreviaturas no estandar.
Incluye: motivo de referencia, resumen clinico, examenes relevantes, solicitud especifica.
Maximo 250 palabras.
```

---

## Seccion 4: Limitaciones que Todo Medico Debe Conocer

### Las "alucinaciones": el riesgo mas serio

Los LLMs generan texto plausible — no necesariamente verdadero. Pueden:

- Citar estudios que no existen con detalles convincentes (autores, revista, ano, resultados)
- Dar dosis incorrectas de medicamentos con total confianza
- Mezclar informacion de guias de diferentes anos o regiones
- Describir protocolos de tratamiento que son una mezcla de fuentes distintas

**Como detectarlos:**
- Si cita un estudio especifico: verificalo en PubMed antes de usarlo
- Si da dosis: verificalas en vademecum o formulario nacional
- Si describe un protocolo: contrasta con la guia MSP o referencia reconocida

### Sesgo de poblacion

La mayoria de los LLMs fueron entrenados con texto medico en ingles, de poblaciones norteamericanas y europeas. Esto significa:

- Prevalencias de enfermedades pueden no reflejar la realidad ecuatoriana
- Algunos protocolos recomendados no estan disponibles en el sistema de salud publico del Ecuador
- Medicamentos sugeridos pueden no estar en el Cuadro Nacional de Medicamentos Basicos

**Practica recomendada:** Siempre contrastalo con guias del MSP y con tu experiencia en la poblacion que atiendes.

### No es una base de datos en tiempo real

El conocimiento de ChatGPT y Claude tiene un corte temporal (generalmente 2024). Para:

- Brotes activos de enfermedades
- Alerta sanitaria del MSP/OPS
- Cambios regulatorios recientes de ARCSA

Consulta directamente las fuentes oficiales actualizadas.

---

## Seccion 5: Flujo de Trabajo Recomendado

Aqui esta el protocolo que proponemos para integrar IA en tu consulta de manera responsable:

```
ANTES de la consulta:
  └─ Revisar historia clinica previa (manual)
  └─ Si es caso complejo: pedir a IA diagnostico diferencial preliminar

DURANTE la consulta:
  └─ Consulta medico-paciente sin pantalla de IA (atencion plena)
  └─ Al final: dictar resumen de 60-90 segundos

DESPUES de la consulta (3-5 min):
  └─ Transcribir audio o dictar resumen en texto
  └─ Generar nota SOAP con IA
  └─ Revisar y corregir (siempre — no copiar-pegar sin leer)
  └─ Guardar en sistema clinico oficial (HCU, sistema del IESS, etc.)

CUANDO NECESITAS APOYO:
  └─ Diagnostico diferencial: IA como segunda opinion, tu como juez final
  └─ Interacciones medicamentosas: IA como primer filtro, fuente farmacologica como cierre
  └─ Educacion al paciente: IA genera el borrador, tu lo adaptas

NUNCA:
  └─ Mostrar datos identificables del paciente en IA publica
  └─ Copiar resultado de IA en expediente sin revision
  └─ Usar IA como unica fuente en decisiones de alto riesgo
```

---

## Resumen del Modulo

| Elemento | ChatGPT Plus | Claude |
|----------|-------------|--------|
| Costo | $20/mes | Gratuito / $20 Pro |
| Documentos PDF | Si | Si (Pro) |
| Busqueda web | Si | Limitada |
| Precision clinica | Buena | Muy buena |
| Riesgo alucinacion | Moderado | Menor |
| Recomendado para | Documentacion, diferencial, educacion | Razonamiento clinico, analisis documentos |

**Estructura de prompt clinico:** [Rol] + [Contexto] + [Tarea] + [Formato]

**Regla de oro:** La IA genera el borrador. Tu eres el autor firmante.

---

## Ejercicio Rapido (15 minutos)

Elige uno de estos tres ejercicios segun lo que mas necesites en tu practica:

**Opcion A — Nota SOAP:**
Recuerda un caso de tu ultima semana de consulta (datos anonimizados). Usa el prompt de Caso de Uso 2 para generar la nota SOAP. Compara con tu nota real. Nota las diferencias.

**Opcion B — Educacion al paciente:**
Piensa en la condicion que mas explicas a tus pacientes. Usa el prompt de Caso de Uso 3. Evalua si el resultado es util, si lo adaptarias, y si podria mejorar la comprension de tus pacientes.

**Opcion C — Diagnostico diferencial:**
Toma un caso de los ultimos dias que te genero duda diagnostica (anonimizado). Usa el prompt de Caso de Uso 1. Compara el diagnostico diferencial que hizo la IA con tu propio razonamiento. Hay algo que no consideraste?

---

*Siguiente modulo: T-03 — Privacidad y proteccion de datos del paciente*

*Modulo creado por ITSEIA Academy | Marzo 2026 | Revision medica pendiente*
*La IA no reemplaza el criterio clinico profesional.*
