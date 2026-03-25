# T-04: Evaluacion Critica — Cuando NO Confiar en la IA

**Tipo:** Leccion + Quiz
**Duracion:** 30 minutos
**Semana:** 2 de 4
**Herramientas:** ChatGPT Plus, Claude (para verificacion cruzada)
**Quiz:** Quiz T-03/T-04 (se activa despues de completar este modulo)

---

## Objetivo de Aprendizaje

Al finalizar este modulo, tendras un protocolo de verificacion interiorizado para cualquier output juridico de IA, identificaras los patrones de error mas comunes en contextos legales, y podras evaluar con criterio profesional cuando la IA es confiable y cuando no.

---

## Advertencia Etica — Responsabilidad Profesional

La Ley Organica del Consejo de la Judicatura y el Codigo de Etica de la Abogacia no contemplan la IA como eximente de responsabilidad. Si presentas ante un tribunal una cita legal inventada por IA, la responsabilidad es tuya, no de OpenAI ni de Anthropic. Esta seccion no es opcional: es la diferencia entre usar IA como palanca profesional o como riesgo disciplinario.

---

## Seccion 1: El fenomeno de la alucinacion en contextos juridicos

La alucinacion es el termino tecnico para cuando un modelo de IA genera informacion factualmente incorrecta con total confianza. No es un error de software ni un bug que vayan a corregir: es una consecuencia matematica de como funcionan los modelos de lenguaje.

Los modelos predicen el token mas probable. En un texto juridico, si el modelo tiene alta probabilidad de que despues de "Gaceta Judicial Serie XX, No." venga un numero, lo genera aunque ese numero sea inventado. El problema es que lo hace con el mismo tono confiado con el que da respuestas correctas.

### Por que el derecho es especialmente vulnerable a alucinaciones

1. **Alta densidad de datos verificables:** El derecho tiene articulos especificos, fechas, numeros de sentencia, plazos exactos. La IA puede inventar cualquiera de estos datos con precision aparente.

2. **Terminologia especializada que suena correcta:** "Sentencia de la Primera Sala de lo Civil de la Corte Nacional de Justicia, dentro del juicio N. 09801-2019-03421" suena completamente plausible, aunque sea inventado en su totalidad.

3. **Reformas frecuentes:** La normativa cambia. La IA puede citar correctamente un articulo que fue reformado o derogado despues de su fecha de entrenamiento.

4. **Variaciones jurisdiccionales:** La IA puede mezclar normativa de diferentes paises. Si preguntas sobre prescripcion de accion civil, puede darte datos del Codigo Civil chileno o argentino que no aplican en Ecuador.

---

## Seccion 2: El caso Schwartz — La leccion mas cara de la historia de la IA juridica

En mayo de 2023, el abogado neoyorkino Steven Schwartz presento ante el Tribunal de Distrito del Distrito Sur de Nueva York una pieza juridica en un caso de lesiones contra Avianca Airlines. El documento contenia seis citas de sentencias de apoyo a su argumento.

El problema: ninguna de las seis sentencias existia. ChatGPT las habia inventado completamente, con nombres de casos, fechas de decision, tribunales emisores y extractos de texto que sonaban completamente autenticos.

Cuando el juez P. Kevin Castel le pidio copias de las sentencias, Schwartz no pudo proveerlas porque no existian. La investigacion revelo que Schwartz habia preguntado a ChatGPT si las sentencias eran reales, y ChatGPT respondio que si. Incluso cuando se le presionaba, ChatGPT reafirmaba la existencia de casos inexistentes.

**Consecuencias:**
- Multa de $5,000 al abogado y su firma
- Sancion disciplinaria condicional
- Cobertura de prensa internacional negativa para la firma
- El juicio de fondo se complico significativamente

**La leccion central:** La IA puede reafirmar sus propios errores cuando se le pregunta si son correctos. No puedes verificar una cita de IA preguntandole a la misma IA si es correcta.

---

## Seccion 3: Mapa de riesgos de alucinacion por tipo de tarea

No todas las tareas juridicas tienen el mismo riesgo de alucinacion. Este mapa te permite calibrar cuanto tiempo dedicar a verificacion segun la tarea:

### Riesgo ALTO — Verificacion obligatoria antes de usar

- Citas de sentencias especificas (numero de causa, fecha, sala)
- Numeracion exacta de articulos de leyes y codigos
- Plazos procesales en dias (estos cambian con reformas)
- Cuantias y valores de multas o indemnizaciones tasadas
- Fechas de entrada en vigencia de normas
- Nombres correctos de leyes y su estado (vigente, reformada, derogada)
- Datos de registros publicos (inscripcion, escritura, partida)

**Protocolo:** SIEMPRE verificar en la fuente primaria antes de usar en documento formal.

### Riesgo MEDIO — Verificacion recomendable

- Principios juridicos generales atribuidos a doctrina especifica
- Interpretaciones jurisprudenciales sin cita especifica de caso
- Conceptos de derecho comparado aplicados a derecho ecuatoriano
- Referencias a resoluciones de organos reguladores
- Procedimientos administrativos ante entidades publicas

**Protocolo:** Verificar en fuente primaria cuando el documento va a presentarse ante un tercero.

### Riesgo BAJO — Revision critica suficiente

- Redaccion y estructura de documentos juridicos propios
- Explicacion de conceptos juridicos generales al cliente
- Borradores iniciales de contratos tipo
- Brainstorming de argumentos juridicos
- Revision de coherencia interna de documentos propios
- Traduccion de terminologia juridica

**Protocolo:** Revision critica con criterio profesional, sin verificacion en fuente primaria obligatoria.

---

## Seccion 4: Protocolo de verificacion en 4 niveles

Este protocolo debe ser tu proceso estandar para cualquier output de IA que vayas a usar en documentos formales:

### Nivel 1: Verificacion automatica (30 segundos)

Antes de leer el output en detalle, ejecuta una verificacion visual rapida:
- Hay numeros de articulos citados? Marcalos
- Hay nombres de sentencias o causas especificas? Marcalos
- Hay fechas de vigencia de normas? Marcalos
- Hay referencias a jurisprudencia especifica? Marcalos

Todo elemento marcado entra en el protocolo de verificacion.

### Nivel 2: Verificacion en fuentes primarias ecuatorianas

Para cada elemento marcado, verifica en:

**Para normas y leyes:**
- Registro Oficial de Ecuador (registroficial.gob.ec)
- Lexis Finder (consultas.lexis.com.ec) — base de datos de legislacion ecuatoriana
- SERCOP para normativa de contratacion publica

**Para jurisprudencia:**
- SATJE — Sistema de Administracion de la Funcion Judicial (satje.gob.ec)
- Buscador de la CNJ — Corte Nacional de Justicia
- Gaceta Judicial digital

**Para normativa administrativa:**
- Sitios web oficiales de cada entidad reguladora (SRI, Superintendencias, Ministerios)

### Nivel 3: Verificacion cruzada con segunda herramienta IA

Si no puedes verificar en fuente primaria de inmediato, usa una segunda herramienta de IA para contrastar:

"Claude, ChatGPT me genero este texto con estas citas legales: [TEXTO]. Puedes verificar si estas normas y articulos existen y si la descripcion es correcta? Sé explicito sobre tu nivel de certeza."

Si la segunda herramienta tiene dudas o contradice a la primera, la verificacion en fuente primaria es obligatoria.

### Nivel 4: Criterio profesional final

Incluso si la informacion se verifica como correcta, aplica tu criterio:
- Es el articulo correcto para este caso especifico?
- La interpretacion que hace la IA es la prevalente en la jurisprudencia ecuatoriana?
- Hay contexto local (practicas del juzgado, criterio del juez) que la IA no puede conocer?

---

## Seccion 5: Senas de alerta — Como detectar alucinaciones antes de verificar

Con practica, desarrollaras un instinto para detectar cuando un output de IA tiene mayor probabilidad de contener errores. Estos son los patrones a vigilar:

**Senal 1: Exceso de precision sin solicitud**
Si le preguntas algo general y la IA responde con numeros de causa, fechas exactas y nombres de sala sin que los hayas pedido, hay alta probabilidad de inventar detalles.

**Senal 2: Coherencia perfecta sospechosa**
Si el output encaja demasiado bien con exactamente lo que necesitas (el articulo perfecto, la sentencia perfecta para tu argumento), verifica. La realidad juridica raramente es tan conveniente.

**Senal 3: Terminologia hibrida**
Si en un texto sobre derecho ecuatoriano aparece terminologia de otros sistemas (por ejemplo, "tutela cautelar" en lugar de "medida cautelar", o referencias a figuras del derecho espanol sin contexto), puede indicar mezcla de sistemas juridicos.

**Senal 4: Fechas improbables**
Si la IA cita una sentencia de 2024 o 2025, ten especial cuidado. Las fechas recientes cercanas a la fecha de corte del modelo tienen mayor probabilidad de error.

**Senal 5: La IA dice "segun establece la jurisprudencia..."**
Sin citar una sentencia especifica verificable, esta frase puede ser inventada. La jurisprudencia se verifica caso por caso.

---

## Resumen del Modulo

- La alucinacion es una consecuencia matematica del funcionamiento de la IA, no un bug corregible
- El caso Schwartz (2023) es el recordatorio mas grafico de las consecuencias profesionales de usar citas de IA sin verificar
- El mapa de riesgos te permite calibrar el nivel de verificacion necesario por tipo de tarea
- El protocolo de 4 niveles garantiza que nunca uses informacion inventada en documentos formales
- Las 5 senales de alerta te permiten detectar alucinaciones potenciales antes de verificar

---

## Ejercicio Rapido (10 minutos)

Prueba esto ahora mismo como ejercicio de aprendizaje:

1. Abre ChatGPT y pregunta: "Cita 3 sentencias de la Corte Nacional de Justicia de Ecuador sobre prescripcion de accion civil. Incluye numero de causa, fecha y sala."

2. Toma los 3 resultados que te de.

3. Ingresa al buscador del SATJE (satje.gob.ec) e intenta encontrar cada causa por su numero.

4. Observa cuantas existen realmente.

Este ejercicio no tiene trampa: puede que algunas existan y otras no. El objetivo es que experimentes de primera mano el riesgo de la alucinacion y entiendas por que el protocolo de verificacion no es burocracia sino proteccion profesional.

---

**Siguiente modulo:** J-01 — Investigacion Jurisprudencial con IA
**Quiz activo:** Quiz T-03/T-04 disponible en la plataforma
