# T-02: ChatGPT y Claude para Abogados — Uso Profesional

**Tipo:** Leccion
**Duracion:** 60 minutos
**Semana:** 1 de 4
**Herramientas:** ChatGPT Plus (GPT-4o), Claude Pro

---

## Objetivo de Aprendizaje

Al finalizar este modulo, dominaras las tecnicas de prompting especificas para tareas juridicas, sabras cuando usar ChatGPT versus Claude segun la naturaleza de la tarea, y tendras un repertorio de prompts probados que podras usar desde hoy en tu practica.

---

## Seccion 1: Anatomia de un prompt juridico efectivo

Un prompt es la instruccion que le das a la IA. La diferencia entre un prompt mediocre y uno excelente puede ser la diferencia entre un output que desechas en 30 segundos y uno que usas como base de un documento real.

Los prompts juridicos efectivos tienen cinco componentes:

**1. Rol (quien eres y quien es la IA)**
"Eres un abogado senior con 20 anos de experiencia en derecho civil ecuatoriano..."

**2. Contexto (el marco del problema)**
"Tengo un caso de incumplimiento contractual entre dos empresas. El contrato es de prestacion de servicios de construccion por $200,000..."

**3. Tarea especifica (exactamente que necesitas)**
"Necesito que redactes la seccion de fundamentos de derecho de una demanda ordinaria..."

**4. Restricciones y parametros (como debe ser el output)**
"El documento debe seguir el formato del COGEP. Usa lenguaje juridico formal. Maximo 3 paginas."

**5. Normativa aplicable (ancla el razonamiento)**
"Aplica el Codigo Civil ecuatoriano, el COGEP y la Ley de Arbitraje y Mediacion."

### Ejemplo: prompt basico vs prompt profesional

**Prompt basico (no hagas esto):**
"Redactame un contrato de arrendamiento"

**Prompt profesional:**
"Actua como abogado especialista en derecho inmobiliario ecuatoriano. Necesito redactar un contrato de arrendamiento de bien inmueble para uso comercial (local en Quito, $1,200/mes) entre un arrendador persona natural y un arrendatario persona juridica (SAS). El contrato debe:
- Cumplir con la Ley de Inquilinato y el Codigo Civil ecuatoriano
- Incluir clausulas de: objeto, canon, duracion (2 anos), deposito de garantia (1 mes), prohibicion de subarrendamiento, causas de terminacion anticipada, y obligaciones de cada parte
- Tener un tono formal y estilo de contratos ecuatorianos
- Incluir espacios para datos que deberan completarse [NOMBRE], [CI], [DIRECCION]
Redacta el contrato completo."

El segundo prompt genera un borrador util. El primero genera algo generico que no sirve sin rehacer todo.

---

## Seccion 2: ChatGPT — Fortalezas y casos de uso para abogados

ChatGPT con GPT-4o es la herramienta mas versatil del ecosistema. Para un abogado ecuatoriano, tiene ventajas especificas:

### Fortaleza 1: Busqueda web en tiempo real

ChatGPT Plus puede buscar en internet, lo que lo hace util para:
- Encontrar normativa publicada recientemente en el Registro Oficial
- Verificar si una ley fue reformada o derogada
- Buscar noticias sobre precedentes relevantes

**Prompt para investigacion con busqueda:**
"Busca en internet si hubo reformas al Codigo Organico Integral Penal (COIP) de Ecuador en 2025. Enlista las reformas mas recientes con fecha de publicacion en el Registro Oficial."

### Fortaleza 2: Analisis de documentos adjuntos

Con ChatGPT Plus puedes subir archivos PDF, Word y Excel directamente a la conversacion.

**Casos de uso practicos:**
- Sube un contrato y pide: "Identifica todas las clausulas que podrian ser problematicas para mi cliente y explica por que"
- Sube un fallo y pide: "Resume este fallo en 200 palabras destacando el ratio decidendi y los argumentos clave"
- Sube un estado de cuenta y pide: "Identifica las transacciones que podrian ser relevantes para un proceso de impugnacion de socio"

### Fortaleza 3: Generacion de comunicaciones con clientes

ChatGPT es excelente para transformar lenguaje juridico complejo en comunicacion clara para clientes no especializados.

**Prompt:**
"Tengo que explicarle a mi cliente (persona no abogada) el proceso de una demanda ordinaria en Ecuador desde la presentacion hasta la sentencia. Explica el proceso en lenguaje simple, sin terminos tecnicos, como si le hablaras directamente a alguien que nunca ha estado en un juicio. Maximo 300 palabras."

### Fortaleza 4: Brainstorming juridico

Para generar lineas de argumentacion que podrias no haber considerado.

**Prompt:**
"Estoy preparando la defensa de un empleado que fue despedido intempestivamente. El empleador alega que el empleado incurrio en falta grave por 'abandono del trabajo'. El empleado dice que pidio permiso verbal que el supervisor aprobó pero no quedo documentado. Dame 7 argumentos de defensa que podria usar bajo el Codigo de Trabajo ecuatoriano, de mayor a menor fortaleza juridica."

---

## Seccion 3: Claude — Fortalezas y casos de uso para abogados

Claude de Anthropic tiene caracteristicas que lo hacen preferible a ChatGPT para ciertos tipos de trabajo juridico de alto volumen o alta complejidad.

### Fortaleza 1: Ventana de contexto extendida

Claude puede procesar hasta 200,000 tokens en una sola conversacion, equivalente a aproximadamente 150,000 palabras. Esto significa que puedes:
- Pegar contratos de 100+ paginas completos y pedir analisis
- Cargar un expediente complejo de varias decenas de folios
- Trabajar con multiples documentos relacionados en la misma conversacion sin perder contexto

**Caso practico:** Un contrato de concesion minera de 120 paginas puede cargarse completo y Claude mantiene coherencia a lo largo de todo el analisis.

### Fortaleza 2: Razonamiento mas cauteloso y explicito

Claude tiende a reconocer sus limitaciones y a razonar en voz alta sobre la incertidumbre, lo cual es valioso en derecho. Cuando no sabe algo o cuando su informacion podria estar desactualizada, suele decirlo.

**Prompt para aprovechar esto:**
"Analiza el siguiente contrato de prestacion de servicios. Para cada clausula, indica: (1) si es conforme al Codigo Civil ecuatoriano, (2) si hay riesgos para mi cliente que es el prestador, y (3) si tienes dudas sobre la vigencia actual de algun articulo que deberia verificar. Se explicito cuando hay incertidumbre."

### Fortaleza 3: Instrucciones de sistema (modo de comportamiento)

Con Claude puedes establecer un "rol" al inicio de la conversacion que persiste a lo largo de toda la sesion.

**Instruccion de sistema al inicio:**
"Durante toda esta conversacion eres mi asistente legal especializado en derecho ecuatoriano. Cada vez que cites una norma, incluye el articulo especifico. Siempre que el resultado tenga consecuencias procesales, incluye un recordatorio de que debo verificar plazos actuales. Usa lenguaje juridico formal. Si no conoces la respuesta con certeza, dilo explicitamente."

Este tipo de instruccion al inicio mejora todos los outputs subsiguientes en esa sesion.

### Fortaleza 4: Analisis critico de documentos propios

Claude es excelente para revisar documentos que tu mismo redactaste, identificando inconsistencias internas, vacios y debilidades.

**Prompt:**
"He redactado el siguiente escrito de contestacion a la demanda. Actua como un juez o como el abogado contrario y dime: (1) cuales son las tres debilidades mas grandes de este escrito, (2) que argumentos podria usar la contraparte para rebatirlo, y (3) como sugeries fortalecer cada debilidad identificada."

---

## Seccion 4: Prompts probados para tareas juridicas frecuentes

Esta seccion es tu biblioteca de referencia rapida. Copia, adapta y usa estos prompts desde hoy.

### Para investigacion

**Busqueda de normativa aplicable:**
```
Soy abogado en Ecuador. Tengo el siguiente caso: [DESCRIBE EL CASO EN 3 LINEAS].
Lista las normas legales ecuatorianas aplicables (Codigos, Leyes Organicas, Reglamentos).
Para cada norma indica: (1) nombre exacto, (2) articulos mas relevantes, (3) por que aplica a este caso.
Ordena de mayor a menor relevancia. Incluye advertencia si alguna norma pudo haber sido reformada recientemente.
```

**Analisis de jurisprudencia (cuando le provees los fallos):**
```
Tengo los siguientes [N] fallos de la Corte Nacional de Justicia / Corte Provincial de [CIUDAD].
[PEGAR TEXTO O RESUMEN DE FALLOS]
Analiza estos fallos e identifica:
1. El criterio juridico predominante en el tribunal
2. Las condiciones bajo las cuales se ha decidido a favor del demandante / demandado
3. Argumentos que han resultado mas persuasivos
4. Tendencias entre los fallos mas recientes versus los mas antiguos
```

### Para redaccion de documentos

**Borrador de demanda ordinaria:**
```
Redacta el cuerpo de una demanda ordinaria bajo el COGEP ecuatoriano para el siguiente caso:
- Actor: [NOMBRE O "persona juridica denominada X"]
- Demandado: [NOMBRE]
- Juzgado: [TIPO] de [CIUDAD]
- Pretension: [QUE SE PIDE]
- Hechos resumidos: [3-5 HECHOS CLAVE]
- Normas aplicables: [ARTICULOS]

Incluye: encabezado formal, antecedentes de hecho, fundamentos de derecho, pretensiones y firma.
Usa el estilo formal de los escritos procesales ecuatorianos.
```

**Revision de contrato:**
```
Revisa el siguiente contrato [TIPO DE CONTRATO] desde la perspectiva de [EL CONTRATANTE / EL PRESTADOR / EL ARRENDADOR]:
[PEGAR TEXTO DEL CONTRATO]

Identifica y clasifica en una tabla:
| # | Clausula | Riesgo (Alto/Medio/Bajo) | Por que es riesgosa | Redaccion alternativa sugerida |
```

**Carta notarial o de requerimiento:**
```
Redacta una carta notarial de requerimiento de pago para el siguiente caso:
- Acreedor: [NOMBRE]
- Deudor: [NOMBRE]
- Obligacion: [DESCRIPCION]
- Monto: $[MONTO] USD
- Fecha de vencimiento original: [FECHA]
- Dias de mora a la fecha: [N DIAS]
- Fundamento: [CLAUSULA DEL CONTRATO O NORMA]
- Plazo para pago: [N DIAS]
- Consecuencias si no paga: [ACCION LEGAL A SEGUIR]

Usa tono formal y lenguaje notarial ecuatoriano.
```

### Para analisis estrategico

**Analisis de viabilidad de accion legal:**
```
Tengo el siguiente caso potencial. Evalualo con criterio critico:
[DESCRIPCION DEL CASO]

Dime:
1. Viabilidad juridica (Alta / Media / Baja) y justificacion
2. Normas que amparan la pretension
3. Principales riesgos del caso
4. Tiempo estimado del proceso en Ecuador (primera y segunda instancia)
5. Posibilidades de solucion extrajudicial
6. Que informacion adicional necesitaria para dar una opinion definitiva

Sé honesto sobre las debilidades. No exageres el optimismo.
```

---

## Seccion 5: Tecnicas avanzadas de prompting para abogados

### Tecnica 1: Cadena de razonamiento (Chain of Thought)

Para analisis complejos, pide a la IA que explique su razonamiento paso a paso.

"Antes de responder, razona en voz alta: (1) cuales normas aplican, (2) como se relacionan entre si, (3) que interpretacion prevalece en doctrina, y luego (4) da tu conclusion."

Esta tecnica mejora significativamente la calidad del razonamiento juridico en outputs complejos.

### Tecnica 2: Perspectivas multiples

Para preparacion de juicio o negociacion, pide a la IA que adopte diferentes roles.

"Analiza este caso desde tres perspectivas:
- Como abogado del actor: cuales son los mejores argumentos
- Como abogado del demandado: cuales son los mejores argumentos
- Como juez: como probablemente resolveria este caso y por que"

### Tecnica 3: Iteracion progresiva

No intentes obtener el documento final en un solo prompt. Trabaja en capas:

1. Primer prompt: "Dame la estructura general de una demanda para este caso"
2. Segundo prompt: "Desarrolla la seccion de antecedentes de hecho en detalle"
3. Tercer prompt: "Ahora escribe los fundamentos de derecho citando los articulos especificos que indique"
4. Cuarto prompt: "Revisa la coherencia interna del documento completo que te comparto"

Este metodo produce documentos de mayor calidad que intentar hacerlo todo de una vez.

### Tecnica 4: Control de calidad integrado

Al final de cualquier tarea de redaccion, siempre cierra con este prompt:

"Revisa el documento que acabas de generar y lista:
1. Cualquier inconsistencia interna que encuentres
2. Cualquier afirmacion juridica que deberia ser verificada en fuentes primarias
3. Lo que falta para que este documento sea utilizable en un proceso real
4. Las 3 cosas mas importantes que yo como abogado debo verificar antes de usar esto"

---

## Resumen del Modulo

- Los prompts juridicos efectivos incluyen: rol, contexto, tarea especifica, restricciones y normativa aplicable
- ChatGPT es preferible para: busqueda web en tiempo real, analisis de archivos adjuntos, comunicacion con clientes, brainstorming
- Claude es preferible para: documentos muy largos, razonamiento cauteloso, instrucciones de sistema persistentes, analisis critico
- La biblioteca de prompts de este modulo esta lista para usar desde hoy en tu practica
- La iteracion progresiva produce mejores documentos que intentar todo en un solo prompt

---

## Ejercicio Rapido (15 minutos)

Realiza el siguiente ejercicio con un caso real (o ficticio si prefieres) de tu practica:

1. Selecciona una tarea juridica que tengas pendiente esta semana (revisar un contrato, redactar una carta, investigar una norma).

2. Escribe el prompt siguiendo la estructura de 5 componentes: rol + contexto + tarea + restricciones + normativa.

3. Ejecuta el prompt en ChatGPT O Claude.

4. Evalua el resultado: cuanto tiempo te habria tomado hacer esto manualmente? El output es usable como borrador? Que tendrias que ajustar?

5. Si el primer resultado no es satisfactorio, ajusta el prompt y vuelve a intentarlo. El 80% de las mejoras vienen de prompts mas precisos.

---

**Siguiente modulo:** T-03 — Seguridad y Confidencialidad de Informacion Legal
