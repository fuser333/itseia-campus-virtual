# T-02: ChatGPT y Claude para Contadores

**Tipo:** Leccion con demo practico
**Duracion:** 60 minutos
**Semana:** 1
**Herramientas:** ChatGPT Plus o GPT-4o gratuito, Claude (claude.ai)

---

## Objetivo de Aprendizaje

Al finalizar este modulo, podras usar ChatGPT y Claude con precision profesional para las tareas contables mas comunes: redactar notas a estados financieros, consultar normativa tributaria, estructurar informes de auditoria, analizar documentos adjuntos y construir una biblioteca de prompts reutilizables para tu flujo de trabajo diario.

---

## 1. ChatGPT vs Claude: cual usar para cada tarea

Esta es la pregunta que mas hacen los contadores cuando empiezan. La respuesta es: ambos son utiles, con fortalezas diferentes. No tienes que elegir uno — muchos profesionales usan los dos segun la tarea.

### ChatGPT (OpenAI)

**Fortalezas para trabajo contable:**
- Code Interpreter: analiza archivos Excel, CSV y PDF directamente en la conversacion. Puedes subir tu balance y pedirle que calcule ratios financieros
- Generacion de graficos a partir de datos tabulados
- Plugins y GPTs especializados (hay GPTs de NIIF, de tributacion)
- Mas difundido — mas comunidad y ejemplos en espanol latinoamericano

**Plan recomendado:** ChatGPT Plus ($20 USD/mes) da acceso a GPT-4o con capacidad de subir archivos. El plan gratuito tiene limite de mensajes diarios y capacidades reducidas.

**Cuando usarlo:** analisis de datos en Excel, generacion de graficos, cuando necesitas procesar archivos numericos.

### Claude (Anthropic)

**Fortalezas para trabajo contable:**
- Contexto muy largo: puede procesar documentos de hasta 200 paginas (contratos, manuales NIIF, resoluciones SRI completas)
- Razonamiento mas cuidadoso en textos legales y normativos
- Menos propenso a alucinaciones en analisis de documentos que le proporcionas
- Respuestas mas estructuradas y formales (mejor para informes ejecutivos)

**Plan recomendado:** Claude.ai plan gratuito es suficiente para empezar. Claude Pro ($20 USD/mes) da acceso sin limites y capacidad de subir documentos grandes.

**Cuando usarlo:** analisis de contratos, consultas normativas con documentos adjuntos, redaccion de informes formales.

### Tabla de decision rapida

| Tarea | Herramienta Preferida |
|---|---|
| Analizar archivo Excel con transacciones | ChatGPT Plus (Code Interpreter) |
| Redactar nota NIIF con texto de la norma adjunto | Claude |
| Generar grafico de tendencias financieras | ChatGPT Plus |
| Revisar contrato de 50 paginas | Claude |
| Consulta rapida de tratamiento tributario | Cualquiera |
| Generar formula Excel compleja | Cualquiera |
| Analizar resolucion del SRI (PDF adjunto) | Claude |

---

## 2. Prompt Engineering para contadores

Un prompt bien estructurado la diferencia entre una respuesta generica y una respuesta que puedes usar directamente. Estos son los principios que aplican al trabajo contable.

### La estructura de un buen prompt contable

```
ROL + CONTEXTO + TAREA + RESTRICCIONES + FORMATO
```

**Ejemplo malo:**
```
explica la NIC 36
```

**Ejemplo bueno:**
```
Actua como un especialista en NIIF con experiencia en empresas manufactureras
ecuatorianas. Tengo una empresa de alimentos que tiene maquinaria con indicios
de deterioro: el valor en libros es $180,000 y el valor de uso calculado es
$145,000. El valor razonable menos costos de venta es $132,000. Explícame paso
a paso como aplico la NIC 36 para determinar si debo registrar una perdida por
deterioro y cual seria el asiento contable correspondiente.
```

### Elemento 1: Darle ROL especifico

"Actua como auditor externo con experiencia en empresas del sector comercial ecuatoriano"
"Eres un especialista en tributacion ecuatoriana del SRI"
"Actua como un gerente financiero que debe explicar resultados a directorio no financiero"

El rol define el tono, el nivel de tecnicismo y el enfoque de la respuesta.

### Elemento 2: DAR CONTEXTO de Ecuador

La IA por defecto usa contexto internacional. Especifica siempre:
- Que trabajas bajo NIIF vigentes en Ecuador
- Que la autoridad tributaria es el SRI
- Que la moneda es USD (Ecuador dolares)
- Que el marco legal es el Codigo Tributario ecuatoriano

### Elemento 3: ADJUNTAR el documento relevante

En lugar de preguntarle sobre una norma de memoria, sube el PDF de la NIIF, la resolucion del SRI o el reglamento. Luego pregunta sobre ese documento especifico. Esto elimina el riesgo de alucinacion normativa.

### Elemento 4: Pedir FORMATO especifico

"Respondeme en formato de tabla"
"Dame la respuesta en bullet points de maximo 2 lineas cada uno"
"Redacta esto como nota a estados financieros segun NIIF"
"Formato ejecutivo para directorio: maximo 200 palabras"

---

## 3. Casos de uso inmediatos: semana 1

### Caso A: Redaccion de notas a estados financieros

Las notas bajo NIIF consumen horas de trabajo que la IA puede reducir drasticamente. El proceso:

1. Prepara los datos de la cuenta en cuestion (valores, movimientos, criterio contable)
2. Ten a la mano el texto de la NIIF relevante (puedes adjuntarla o copiar el parrafo clave)
3. Usa este prompt base:

```
Redacta la nota de revelacion para los estados financieros de nuestra empresa bajo
NIIF [numero], correspondiente a [nombre de la cuenta]. Los datos son los siguientes:

[Pega aqui tus datos en formato tabla o texto]

El criterio de reconocimiento y medicion que usamos es: [describe brevemente]

La nota debe tener: politica contable, movimiento del periodo, importes al cierre,
y cualquier revelacion requerida por la norma. Formato formal para auditoria externa.
Ecuador, ejercicio fiscal 2025.
```

### Caso B: Consultas tributarias

Para consultas del SRI, el proceso mas seguro es:

1. Descarga el documento oficial del SRI (Reglamento LORTI, resoluciones, circulares)
2. Adjuntalo a la conversacion
3. Pregunta sobre ese documento especifico

Ejemplo de prompt:
```
Adjunto el Reglamento a la LORTI vigente. Segun este documento, ¿cuales son
los requisitos para que un gasto sea deducible para el impuesto a la renta de
una sociedad? Dame los 5 requisitos principales con el articulo que los sustenta.
```

Si no tienes el documento, usa este prompt de proteccion:
```
Responde sobre tributacion ecuatoriana. Si no estas seguro de algun dato especifico
o si puede haber cambiado recientemente, indicalo claramente. Prefiero que me digas
"verifica esto en la fuente oficial" antes de darte informacion incorrecta.
```

### Caso C: Cartas y comunicaciones formales

```
Redacta una carta de representacion de la gerencia dirigida a los auditores externos
de [nombre empresa ficticia], con fecha 31 de diciembre de 2025. La carta debe
confirmar: la responsabilidad de la gerencia sobre los estados financieros, que no
existen hechos posteriores no revelados, que todos los pasivos contingentes han sido
revelados, y que se han aplicado NIIF de forma consistente. Tono formal, membrete
en blanco (lo agrego despues), firma del Representante Legal y del Contador.
```

### Caso D: Analisis de variaciones para directorio

```
Soy contador de una empresa distribuidora. Las ventas netas pasaron de $1,250,000
en Q4 2024 a $980,000 en Q1 2025 (-21.6%). El costo de ventas paso de $875,000 a
$705,600 (margen bruto mejoro de 30% a 28%... espera, eso no cuadra, revisalo).
Los gastos administrativos subieron 8% por ajuste salarial.

Redacta un parrafo ejecutivo explicando estas variaciones para el comite directivo.
Identifica primero si mis calculos de margen son correctos. Tono: profesional pero
claro para directores no financieros.
```

Nota en este prompt: deliberadamente hay un error en el calculo del margen para que la IA lo detecte. Si lo detecta, bien. Si no lo detecta, eso confirma que debes verificar siempre los numeros.

---

## 4. Subir archivos: el cambio de nivel

Cuando subes un archivo a ChatGPT Plus o a Claude Pro, la conversacion pasa de ser una consulta de conocimiento general a ser un analisis de TUS datos. Esta es la funcion mas poderosa para trabajo contable.

### Con ChatGPT Plus (Code Interpreter activado)

Formatos que acepta: Excel (.xlsx), CSV, PDF, texto plano.

Lo que puedes hacer:
- "Analiza este archivo Excel con las transacciones del mes. Identifica las 10 mayores por monto."
- "Calcula los ratios de liquidez, endeudamiento y rentabilidad con estos datos del balance."
- "Genera un grafico de barras con las ventas por mes del año."
- "Este CSV tiene el libro mayor. ¿Cuantas transacciones por encima de $5,000 hay en la cuenta 5101?"

### Con Claude (documentos adjuntos)

Claude es particularmente bueno con documentos largos. Puedes subir:
- El manual de politicas contables de tu empresa (30-40 paginas) y preguntarle sobre casos especificos
- Una resolucion completa del SRI y pedirle que resuma los cambios que te afectan
- Un contrato de arrendamiento de 60 paginas y pedirle que identifique las clausulas financieras relevantes para NIIF 16

---

## 5. Biblioteca de prompts: tu activo profesional

Un contador que construye su propia biblioteca de prompts gana eficiencia que se acumula con el tiempo. A continuacion, prompts probados para las tareas mas comunes.

### Prompts guardados recomendados

**Para inicio de sesion (prompt de sistema):**
```
A partir de ahora en esta conversacion: soy contador certificado en Ecuador,
trabajo con NIIF, el marco tributario es el SRI y la LORTI, la moneda es USD.
Siempre que respondas sobre temas contables o tributarios, usa este contexto.
Si algo es especifico de otro pais, indicamelo.
```

**Para revisar asientos contables:**
```
Revisa los siguientes asientos contables. Verifica que: (1) cuadren debito=credito,
(2) las cuentas sean las correctas segun NIIF, (3) la descripcion sea clara para
auditoria. Si encuentras errores, señalalos y propone la correccion:
[PEGA AQUI TUS ASIENTOS]
```

**Para el ATS (Anexo Transaccional Simplificado):**
```
Explicame que campos del ATS pueden tener problemas si [describe tu situacion especifica].
¿Cuales son los errores mas comunes en el ATS que generan observaciones del SRI?
```

**Para conciliacion tributaria:**
```
Tengo los siguientes datos de mi empresa para la conciliacion tributaria del
ejercicio 2025: [datos]. Ayudame a estructurar la conciliacion entre la utilidad
contable y la base imponible para el calculo del Impuesto a la Renta. Formato:
tabla con columnas Concepto / Valor contable / Ajuste / Base imponible.
```

---

## Resumen del Modulo

- ChatGPT Plus es mejor para analisis de datos en Excel y generacion de graficos
- Claude es mejor para documentos largos, contratos y redaccion formal de informes
- Un buen prompt contiene: rol + contexto ecuatoriano + tarea especifica + restricciones + formato
- Adjuntar documentos transforma la IA de enciclopedia a asistente de TUS datos
- Siempre verifica los numeros y las citas legales que genera la IA
- Construir tu biblioteca de prompts es una inversion profesional que se amortiza desde el primer uso

---

## Ejercicio Rapido

**Actividad 1 — Prueba el prompt de notas NIIF (20 minutos)**

Toma una nota de estados financieros de un cliente tuyo (anonimizada — cambia el nombre de la empresa y los montos). Usa el prompt del Caso A de este modulo para que la IA la redacte desde cero. Compara el resultado con la version que tienes. ¿Que agrego? ¿Que omitio? ¿Cuanto tiempo te ahorro?

**Actividad 2 — Construye tu primer prompt personalizado (10 minutos)**

Elige la tarea contable que mas tiempo te toma cada mes. Construye un prompt siguiendo la estructura ROL + CONTEXTO + TAREA + RESTRICCIONES + FORMATO. Guardalo en un documento de texto como tu primera entrada de biblioteca de prompts. Lo iraras refinando durante el curso.

**Actividad 3 — Detecta el error (5 minutos)**

Usa este prompt en ChatGPT o Claude y observa si la IA detecta el problema:

```
Una empresa tiene activos totales de $500,000, pasivos totales de $320,000 y
patrimonio de $200,000. El ratio de endeudamiento es 64%. ¿Es correcto este
calculo? Explica la formula.
```

(El error: $500,000 - $320,000 = $180,000, no $200,000. El patrimonio no cuadra con el balance. El ratio tampoco es correcto con los datos que se dan.)
