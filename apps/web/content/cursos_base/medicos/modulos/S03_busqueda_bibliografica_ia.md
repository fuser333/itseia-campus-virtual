# S-03: Busqueda Bibliografica con IA

**Tipo:** Leccion + Quiz
**Duracion:** 30 minutos
**Semana:** 3 — Modulo 7 de 9
**Curso:** IA para Profesionales de la Salud — ITSEIA Academy

---

> **AVISO IMPORTANTE:** La IA no reemplaza el criterio clinico profesional. Las herramientas de busqueda bibliografica con IA son apoyo para encontrar y sintetizar evidencia — no reemplazan la lectura critica de los articulos originales ni el juicio del profesional para aplicar esa evidencia a su paciente especifico.

---

## Objetivo de Aprendizaje

Al finalizar este modulo seras capaz de:

- Usar Elicit y Consensus para encontrar y sintetizar evidencia cientifica de manera eficiente
- Combinar PubMed con tecnicas de IA para potenciar la busqueda bibliografica
- Evaluar criticamente si las referencias que proporciona la IA son reales y relevantes
- Distinguir cuando usar cada herramienta segun el tipo de pregunta clinica

---

## Seccion 1: El Problema de la Sobrecarga de Informacion en Medicina

### La realidad del medico y la literatura cientifica

Cada ano se publican mas de 1 millon de articulos medicos en PubMed. En el campo de la diabetes tipo 2 solamente, se publican mas de 20,000 articulos anuales. Ninguna persona puede leer eso.

El resultado es una paradoja: hay mas evidencia disponible que nunca, pero el medico promedio tiene menos tiempo para leerla. Esto genera:

- Practica clinica basada en lo aprendido en la carrera (que puede tener 10-20 anos de antiguedad)
- Uso de guias de practica clinica que se revisan cada 2-5 anos (y entre revisiones, la evidencia avanza)
- Decision de prescribir lo conocido sobre lo mejor para el paciente especifico

### Lo que la IA puede hacer aqui

Las nuevas herramientas de busqueda bibliografica con IA no solo buscan — analizan, sintetizan y responden preguntas directas con citas verificables. Esto transforma la busqueda de evidencia de "30 minutos en PubMed" a "5 minutos con respuesta estructurada".

---

## Seccion 2: Elicit — Busqueda Semantica en Literatura Cientifica

### Que es Elicit

Elicit (elicit.com) es una herramienta de IA para investigacion academica desarrollada por Ought. Permite hacer preguntas en lenguaje natural y obtener respuestas sintetizadas con citas de la literatura cientifica.

**Acceso desde Ecuador:** Si, via web. Version gratuita con limite de consultas. Plan de pago $10/mes para uso intensivo.

**Lo que hace diferente:** No busca por palabras clave — busca por significado semantico. Esto significa que si preguntas "cuanto reduce la HbA1c el semaglutide en diabeticos tipo 2 con enfermedad renal?", Elicit entiende la pregunta clinica y busca estudios especificos sobre esa combinacion.

### Como usar Elicit paso a paso

1. Ir a elicit.com y crear cuenta gratuita
2. En la barra de busqueda, escribe tu pregunta clinica en ingles (Elicit funciona mejor en ingles)
3. Elicit muestra:
   - Lista de articulos relevantes
   - Para cada articulo: titulo, autores, revista, ano, abstract resumido
   - Columnas personalizables: tipo de estudio, n de pacientes, resultados clave, limitaciones
4. Puedes exportar la tabla a CSV para guardar tus busquedas

### Tipos de preguntas para las que Elicit es ideal

**Preguntas de eficacia terapeutica:**
```
"What is the effect of empagliflozin on cardiovascular outcomes in
type 2 diabetes patients with chronic kidney disease?"

"Does metformin reduce all-cause mortality in type 2 diabetes beyond
its glycemic effects?"
```

**Preguntas de diagnostico:**
```
"What is the sensitivity and specificity of D-dimer for pulmonary
embolism diagnosis in outpatient settings?"

"How accurate is point-of-care troponin for ruling out acute MI in
low-risk chest pain?"
```

**Preguntas de screening y prevencion:**
```
"What is the evidence for colorectal cancer screening in average-risk
adults starting at age 45?"
```

### Verificacion de resultados en Elicit

Elicit es mas confiable que ChatGPT en no inventar referencias, pero aun asi:
- Haz click en el DOI de cualquier articulo que vayas a citar
- Verifica que el abstract que muestra Elicit coincide con el abstract original en PubMed
- Si el articulo es de acceso abierto, lee al menos el abstract y la seccion de resultados originales

---

## Seccion 3: Consensus — Encontrar el Consenso Cientifico

### Que es Consensus

Consensus (consensus.app) tiene un enfoque diferente a Elicit: no solo lista articulos, sino que sintetiza el "consenso" de la literatura sobre una pregunta especifica. Muestra un semaforo de evidencia: ¿la mayoria de estudios dice si, no, o hay resultados mixtos?

**Acceso desde Ecuador:** Si, via web. Freemium.

**Su diferencial:** Es particularmente util cuando quieres saber rapidamente si "la evidencia apoya o no" una intervencion, antes de profundizar.

### Ejemplo de uso en Consensus

**Pregunta:** "Does low-dose aspirin reduce cardiovascular events in primary prevention?"

**Lo que Consensus muestra:**
- Numero de estudios encontrados sobre el tema
- Distribucion de resultados: X% dicen si, Y% dicen no, Z% son mixtos
- Resumen de los estudios mas citados con sus conclusiones
- Extraccion de "claims" clave de la literatura

**Cuando usar Consensus vs Elicit:**

| Necesidad | Mejor herramienta |
|-----------|------------------|
| Pregunta clinica especifica con datos numericos | Elicit |
| Ver si la evidencia general apoya una decision | Consensus |
| Revision sistematica de un tema nuevo | Elicit (mas detallado) |
| Respuesta rapida para decisiones en consulta | Consensus (mas sintetico) |

---

## Seccion 4: PubMed Potenciado con IA

PubMed sigue siendo la fuente primaria de evidencia medica. La IA no lo reemplaza — lo potencia.

### Tecnica 1: Usar ChatGPT para construir la busqueda de PubMed

Muchos medicos no usan los operadores booleanos de PubMed, lo que limita la calidad de los resultados. ChatGPT puede construir la estrategia de busqueda por ti.

**Prompt:**
```
Necesito buscar en PubMed todos los ensayos clinicos randomizados de los
ultimos 5 anos sobre el uso de GLP-1 agonistas en pacientes diabeticos
tipo 2 con obesidad e insuficiencia cardiaca con fraccion de eyeccion reducida.

Genera la estrategia de busqueda completa con operadores booleanos MeSH
para copiar y pegar en PubMed. Incluye filtros de fecha y tipo de estudio.
```

**Resultado tipico:**
```
("glucagon-like peptide 1"[MeSH Terms] OR "GLP-1 receptor agonists"[tiab]
OR "semaglutide"[tiab] OR "liraglutide"[tiab] OR "dulaglutide"[tiab])
AND ("diabetes mellitus, type 2"[MeSH Terms])
AND ("heart failure"[MeSH Terms] OR "heart failure with reduced ejection"[tiab])
AND ("randomized controlled trial"[pt])
AND ("2020"[pdat]:"2025"[pdat])
```

### Tecnica 2: Subir el PDF del articulo a ChatGPT Plus para analisis

Si tienes un articulo de acceso abierto (o tienes acceso por la universidad o el IESS):

1. Descarga el PDF del articulo
2. Subelo a ChatGPT Plus (boton de adjunto)
3. Pregunta lo que necesitas:

```
Lee este articulo y responde:
1. Cual fue el objetivo principal del estudio?
2. Cual fue el resultado primario y cuanto fue la diferencia entre grupos?
3. Cuales son las limitaciones principales que los autores mencionan?
4. Es aplicable a mi practica en Ecuador? Por que si o por que no?
5. Cual es el nivel de evidencia segun la clasificacion Oxford?
```

### Tecnica 3: Semantic Scholar como alternativa gratuita de Elicit

Semantic Scholar (semanticscholar.org) es una herramienta gratuita de la Allen Institute for AI que permite busqueda semantica en literatura cientifica. Es menos intuitiva que Elicit pero completamente gratuita y sin limite de busquedas.

**Acceso desde Ecuador:** Si, sin restricciones, completamente gratuito.

---

## Seccion 5: El Error mas Comun — Las Referencias Inventadas

Este es el peligro especifico de usar ChatGPT directamente para busqueda bibliografica (a diferencia de Elicit o Consensus).

### El escenario de riesgo

```
Pregunta a ChatGPT:
"Dame 5 estudios recientes que soporten el uso de metformina en pacientes
diabeticos con enfermedad renal cronica estadio 3."

Respuesta de ChatGPT (POTENCIALMENTE PELIGROSA):
"Aqui tienes 5 estudios relevantes:
1. Zhang et al. (2023). "Metformin safety in CKD stage 3: a meta-analysis."
   New England Journal of Medicine, 388(4), 312-324.
2. Johnson & Williams (2022). "Renal outcomes with metformin continuation..."
   ..."
```

El problema: estos estudios pueden ser completamente ficticios. Los nombres, la revista, el volumen, las paginas — todo puede ser inventado. ChatGPT genera texto plausible, no referencias verificadas.

### Regla absoluta sobre referencias bibliograficas y IA

**Nunca uses una referencia bibliografica generada por ChatGPT (o cualquier LLM) sin verificarla en PubMed primero.**

El flujo correcto:
1. Pide a ChatGPT que te ayude a formular la busqueda de PubMed (tecnica del prompt anterior)
2. Ejecuta la busqueda en PubMed tu mismo
3. Lee los abstracts en PubMed directamente
4. Usa Elicit o Consensus si quieres sintesis automatica con citas verificadas

### Como verificar una referencia en 30 segundos

1. Ir a pubmed.ncbi.nlm.nih.gov
2. Copiar el titulo del articulo en la barra de busqueda
3. Si el articulo existe: aparece exactamente con esos autores, revista y ano
4. Si no aparece: es inventada o tiene datos incorrectos — no la uses

---

## Resumen del Modulo

| Herramienta | Mejor uso | Costo | Verificacion requerida |
|-------------|-----------|-------|----------------------|
| Elicit | Preguntas clinicas especificas con datos | Freemium | Si, verificar DOI |
| Consensus | Consenso rapido de la evidencia | Freemium | Si, para citas formales |
| PubMed | Fuente primaria — siempre verificar aqui | Gratuito | Es la fuente de verificacion |
| Semantic Scholar | Busqueda semantica gratuita | Gratuito | Si, para citas formales |
| ChatGPT | Construir estrategia de busqueda, analizar PDF | $20/mes Plus | NUNCA usar como fuente directa |

**Regla de oro:** Elicit y Consensus buscan y sintetizan con citas verificables. ChatGPT ayuda a buscar y analizar, pero nunca es la fuente de las referencias.

---

## Quiz de este Modulo

Este modulo incluye evaluacion. El quiz cubre S-03 (Busqueda Bibliografica).

**8 preguntas | 6 multiple choice + 2 texto corto**
**Puntaje minimo para aprobar:** 70% (6 de 8 preguntas)
**Intentos permitidos:** 2

Accede al quiz desde la plataforma como "Quiz S-03: Busqueda Bibliografica con IA".

---

## Ejercicio Rapido (10 minutos)

Practica el siguiente flujo:

**Pregunta clinica:** "En pacientes adultos con infeccion urinaria no complicada en mujeres jovenes, es la fosfomicina trometamol de dosis unica equivalente en eficacia a la nitrofurantoina por 5 dias?"

**Tarea:**
1. Busca esta pregunta en Elicit (en ingles: "fosfomycin vs nitrofurantoin uncomplicated UTI women")
2. Revisa los 3 primeros estudios que aparecen
3. Haz click en el DOI de al menos uno y verifica que el abstract coincide
4. Responde: segun la evidencia que encontraste, cual de los dos antibioticos recomendarias y por que?

Tiempo estimado: 8-10 minutos.

---

*Siguiente modulo: S-04 — Analisis de imagenes medicas con IA*

*Modulo creado por ITSEIA Academy | Marzo 2026 | Revision medica pendiente*
*La IA no reemplaza el criterio clinico profesional.*
