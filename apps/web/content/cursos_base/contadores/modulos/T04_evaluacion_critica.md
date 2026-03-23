# T-04: Evaluacion Critica de Resultados de IA

**Tipo:** Leccion + Quiz
**Duracion:** 30 minutos
**Semana:** 2
**Herramientas:** ChatGPT con Chain-of-Thought prompting, Claude

---

## Objetivo de Aprendizaje

Al finalizar este modulo, tendras criterios profesionales concretos para evaluar si el output de una herramienta de IA es confiable, correcto y usable antes de incorporarlo a cualquier documento contable o financiero. Sabras cuando confiar, cuando verificar y cuando desechar el resultado de la IA.

---

## 1. El problema de la confianza mal puesta

Existe un sesgo psicologico bien documentado llamado "automation bias": la tendencia humana a confiar en los sistemas automatizados mas de lo que deberiamos, especialmente cuando el output parece profesional y bien estructurado.

La IA tiene este problema amplificado. Genera respuestas que suenan autoritativas, con estructura impecable, en un tono que parece experto. Pero puede estar completamente equivocada.

El caso mas famoso: en 2023, dos abogados en Nueva York usaron ChatGPT para investigacion juridica. La IA cito seis casos precedentes con nombres reales, numeros de expediente y extractos de sentencias. Todos eran inventados. Los abogados los presentaron al juez sin verificar. Resultado: sanciones y escandalo publico.

Para un contador, el riesgo es distinto pero igualmente serio: un articulo de ley que no existe, un porcentaje de depreciacion incorrecto, un calculo de IVA erroneo, o una NIIF mal citada pueden generar problemas en una auditoria o una fiscalizacion del SRI.

---

## 2. Que es la alucinacion y por que ocurre con datos numericos

### La alucinacion en lenguaje natural

Un LLM predice cual es la siguiente palabra mas probable en una secuencia. Cuando no tiene datos reales para fundamentar una respuesta, en lugar de decir "no se", genera la respuesta que estadisticamente suena mas correcta en ese contexto. El resultado es texto falso pero convincente.

### La alucinacion con numeros es especialmente peligrosa

Los modelos de lenguaje no son calculadoras. Manejan los numeros como tokens de texto, no como cantidades matematicas. Esto significa:
- Pueden redondear incorrectamente
- Pueden cometer errores aritmeticos en calculos de varios pasos
- Pueden inventar cifras que "encajan" en el contexto
- Pueden mezclar informacion de periodos diferentes

**Ejemplo real de alucinacion numerica:** Preguntas "¿Cual es la tasa de retencion en la fuente para honorarios profesionales en Ecuador?" La IA responde "8%" con total confianza. La tasa vigente es 10% para honorarios profesionales segun el Art. 86 del RLORTI. Si usas ese dato en tu retencion, tienes un problema con el SRI.

### Cuando la IA tiene mas probabilidad de alucinacion

- Informacion normativa especifica y reciente (reformas, resoluciones, circulares)
- Calculos con multiples pasos o porcentajes encadenados
- Citas de articulos de ley especificos
- Estadisticas y datos de mercado
- Informacion de empresas o personas especificas

### Cuando la IA es generalmente confiable

- Explicar conceptos contables establecidos (que es el devengado, como funciona el leasing)
- Estructurar documentos (redaccion de notas, cartas, informes)
- Analizar documentos que tu le proporcionas (en este caso habla de TUS datos)
- Generar formulas Excel o instrucciones de proceso

---

## 3. Lista de verificacion de 5 puntos

Antes de usar cualquier output de IA en un documento profesional, aplica este checklist:

### Punto 1: ¿Hay cifras especificas? Verificalas

Si la IA menciona una tasa, un porcentaje, un monto o un plazo especifico, esa cifra debe verificarse en la fuente primaria. No hay excepcion.

Fuentes primarias en Ecuador:
- Tasas tributarias: portal.sri.gob.ec
- Tasas de interes BCE: bce.fin.ec/tasas
- Tablas IESS: iess.gob.ec
- NIIF vigentes: contabilidad.juntaregulatoria.gob.ec
- Codigo Tributario: lexis.com.ec

### Punto 2: ¿Cita normativa? Verifica que exista

Si la IA cita "segun el Art. 23 del Reglamento LORTI..." busca ese articulo y confirma que dice lo que la IA dice que dice. Los articulos existen pero su contenido puede estar mal citado o corresponder a una version anterior.

### Punto 3: ¿El calculo matematico cuadra?

Para cualquier calculo relevante, hazlo de nuevo tu o con la calculadora de Excel. No delegar el calculo a la IA en documentos que firmeras.

### Punto 4: ¿Es consistente internamente?

Lee el output completo antes de usarlo. ¿Hay contradicciones entre parrafos? ¿Los numeros en el texto coinciden con los de las tablas? ¿Se cambia de criterio a mitad de la respuesta?

### Punto 5: ¿Corresponde al contexto ecuatoriano?

La IA por defecto tiene sesgos hacia el contexto de Estados Unidos, España o Mexico en temas contables y tributarios. Verifica que la respuesta no este usando tasas, normas o procedimientos de otro pais.

---

## 4. Como pedir a la IA que explique su razonamiento

El Chain-of-Thought prompting es una tecnica que obliga a la IA a mostrar su razonamiento paso a paso en lugar de saltar directo a la conclusion. Esto te permite detectar el error en el proceso antes de que llegue al resultado.

### Prompt estandar sin CoT:
```
¿Cual es el impuesto a la renta de una sociedad con utilidad gravable de $85,000?
```
Respuesta tipica: "El impuesto a la renta seria $21,250" (sin explicacion del calculo)

### Prompt con Chain-of-Thought:
```
¿Cual es el impuesto a la renta de una sociedad ecuatoriana con utilidad gravable
de $85,000 correspondiente al ejercicio fiscal 2025? Muestra cada paso del calculo
incluyendo la tasa vigente, la base imponible y el monto final. Si hay algun
aspecto que debes verificar en la normativa antes de confirmar, indicalo.
```
Respuesta con CoT: "La tasa del impuesto a la renta para sociedades en Ecuador es del 25% segun el Art. 37 de la LORTI [verifica que este porcentaje siga vigente para 2025]. Calculo: $85,000 x 25% = $21,250. NOTA: Si la empresa es una PYME calificada, puede aplicar tasa diferencial. Verificar en caso de aplicar."

Con el segundo prompt, puedes ver exactamente donde esta basando su calculo y donde te pide que verifiques. Eso te da control.

### Otras formulas de CoT para trabajo contable:

"Explica tu razonamiento paso a paso antes de dar la respuesta final."
"¿En que normativa especifica te basas para esta respuesta?"
"Antes de responder, indica si hay algun dato que necesitas verificar en la normativa actual."
"Dame la respuesta y luego explica como llegaste a ella."

---

## 5. Responsabilidad profesional: la IA no firma

Este punto es conceptual pero fundamental. En Ecuador, la firma de un contador publico en un estado financiero, una declaracion tributaria o un informe de auditoria implica responsabilidad civil y penal. La IA no asume responsabilidad. Tu si.

La Ley de Contadores Publicos del Ecuador (Decreto Supremo 3245) establece responsabilidades especificas del contador. El hecho de que "la IA lo genero" no es defensa valida ante el SRI, ante un tribunal, ni ante el Directorio Nacional de Contadores.

Regla de trabajo: Usa la IA para generar borradores. Tu proceso de revision y validacion debe ser igual de riguroso que si lo hubiera escrito un asistente junior. La firma final implica que tu revisaste, entendiste y estas de acuerdo con cada cifra y cada afirmacion del documento.

---

## Resumen del Modulo

- La alucinacion es la tendencia de la IA a generar informacion falsa pero convincente — especialmente peligrosa con cifras, tasas y citas normativas
- Los numeros que genera la IA son especialmente propensos a error porque los LLM no son calculadoras matematicas
- Checklist de 5 puntos: verifica cifras, verifica normativa citada, recalcula, revisa consistencia interna, confirma contexto ecuatoriano
- El Chain-of-Thought prompting ("muestra tu razonamiento") te permite detectar errores en el proceso antes del resultado
- La responsabilidad legal del contador no se delega a la IA
- Regla de oro: la IA genera borradores de calidad, tu aportas el juicio profesional y la firma

---

## Ejercicio Rapido

**Actividad — Atrapa el error (10 minutos)**

Usa este prompt en ChatGPT o Claude y evalua si la respuesta supera tu checklist de 5 puntos:

```
Una empresa ecuatoriana tiene los siguientes datos del ejercicio 2025:
- Ingresos operacionales: $420,000
- Costo de ventas: $285,000
- Gastos administrativos: $67,000
- Gastos de ventas: $38,000
- Ingresos por intereses (no operacionales): $4,200

Calcula: utilidad bruta, utilidad operacional, utilidad antes de impuestos e
impuesto a la renta de sociedades. Muestra cada paso del calculo.
```

Revisa: ¿Cuadran los calculos? ¿La tasa de impuesto usada es correcta para Ecuador 2025? ¿Hay algun comentario sobre participacion de trabajadores (15%) que deberia aparecer antes del impuesto a la renta? Si la IA omitio la participacion de trabajadores, ese es exactamente el tipo de error que podria costarte una observacion del SRI.
