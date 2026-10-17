# Ejercicio Sesion 1: Principios de Narrativa con Datos

**Materia:** Storytelling con Datos
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 50 min

## Objetivo

Dominar los principios fundamentales del storytelling con datos: el ciclo de empatia-insight-narrativa, la diferencia entre visualizacion informativa y narrativa convincente, y como estructurar una historia de datos que cambia la forma en que una audiencia piensa y actua.

## Contexto (Ecuador)

El 80% de los analistas de datos en Ecuador saben hacer graficos. El 5% sabe contar historias con esos graficos que provocan accion. La diferencia no es tecnica — es narrativa. Un informe con 40 tablas perfectas que ningun gerente lee tiene cero impacto. Un dashboard de 3 numeros bien elegidos que provoca una decision inmediata puede salvar un negocio. Este ejercicio enseña la diferencia.

## Instrucciones

### Parte 1 — Diagnoticar: informacion vs historia (15 min)

Analiza estos dos tratamientos del mismo dato de Ecuador y determina cual es informacion y cual es historia:

**VERSION A (Informacion):**
```
Tabla 1: Tasa de desempleo juvenil por provincia Ecuador 2024
Provincia        | Tasa (%)
Guayas           | 18.4
Pichincha        | 15.2
Manabi           | 21.7
Azuay            | 12.8
...
Promedio nacional| 17.1
Fuente: INEC - ENEMDU 2024
```

**VERSION B (Historia):**
```
"En Ecuador, 1 de cada 6 jovenes entre 18 y 25 años que busca trabajo
no lo encuentra. En Manabi, esa cifra sube a 1 de cada 5.
Mientras tanto, el sector tecnologico tiene 30,000 vacantes sin llenar.
La brecha no es falta de empleo. Es falta de habilidades del futuro."
```

Responde:
1. Cual version genera empatia? Por que?
2. Cual version provoca accion? Por que?
3. Que elementos narrativos tiene la Version B que la Version A no tiene?
4. Que se perdio al convertir de A a B? Era importante esa informacion?
5. Como se podria combinar la precision de A con la narrativa de B?

### Parte 2 — Los 5 principios del storytelling con datos (15 min)

Estudia y aplica cada principio al contexto ecuatoriano:

**PRINCIPIO 1 — UN PUNTO PRINCIPAL:**
Cada historia de datos debe tener UNA idea central que el oyente recuerda 24 horas despues.

Ejercicio: Tienes estos datos del INEC sobre educacion en Ecuador:
- 62% de bachilleres no accede a educacion superior
- Solo 12% de universidades tienen programas de tecnologia
- El ingreso promedio de un profesional tech es 3.4x el promedio nacional
- La tasa de retorno de la educacion superior en tech es del 340%

Escribe el UN punto principal de esta historia en maximo 12 palabras.

**PRINCIPIO 2 — EL DATO COMO EVIDENCIA, NO COMO PROTAGONISTA:**
El dato no es la historia — es la prueba de la historia. La historia es humana.

Ejercicio: Reescribe esta frase centrada en datos para hacerla centrada en personas:
"La tasa de mortalidad infantil en zonas rurales de Ecuador es 18.3 por cada 1,000 nacidos vivos, 2.4 veces mayor que en zonas urbanas (7.6 por 1,000)."

**PRINCIPIO 3 — TENSION Y RESOLUCION:**
Toda buena historia necesita tension (el problema) y apunta a resolucion (la solucion).
El dato mas importante es el que crea la tension.

Ejercicio: Con estos datos del BCE (Banco Central del Ecuador):
- Exportaciones no petroleras crecieron 8.2% en 2024
- Pero el sector de servicios tecnologicos represent solo 0.3% del PIB
- En Colombia representa 4.1%, en Peru 2.8%

Identifica el dato de tension y el dato que apunta a la resolucion posible.

**PRINCIPIO 4 — CONTRASTE:**
El cerebro humano no procesa numeros absolutos bien — procesa comparaciones excelentemente.

Ejercicio: $450 millones perdidos en fraude electronico en Ecuador en 2024.
Convierte ese numero en comparaciones memorables con otros datos conocidos:
- Es equivalente a [X] presupuestos anuales de [MINISTERIO]
- Es suficiente para [Y] becas universitarias
- Es [Z] veces el presupuesto del [PROGRAMA CONOCIDO]

**PRINCIPIO 5 — LLAMADO A LA ACCION:**
Una historia de datos sin conclusion accionable es entretenimiento, no comunicacion.

Ejercicio: Termina esta historia de datos con un CTA especifico:
"La deforestacion en la Amazonia ecuatoriana alcanzo 250,000 hectareas en 2023, el mayor nivel en 15 años. El 73% ocurrio en areas con presencia minera informal..."

### Parte 3 — Aplicar los 5 principios juntos (15 min)

Usa Claude para construir una historia de datos completa:

```
PROMPT PARA CLAUDE:
"Soy analista de datos en Ecuador. Tengo estos datos del INEC 2024:
- Poblacion con acceso a internet en hogares: 52% urbano, 18% rural
- Numero de ecuatorianos que compran online: 3.2 millones (18% de la poblacion)
- Valor del e-commerce en Ecuador 2024: $1.8 mil millones
- Crecimiento anual del e-commerce: 35%
- Penetracion de smartphones: 78% de la poblacion

Construye una historia de datos de 200 palabras siguiendo los 5 principios:
1. Un punto principal claro y memorable
2. El dato como evidencia de una historia humana
3. Tension identificable (oportunidad vs barrera)
4. Contraste con referentes comprensibles
5. Llamado a la accion especifico para un empresario ecuatoriano

La audiencia es: gerentes de pymes ecuatorianas considerando vender online."
```

Evalua el output de Claude contra cada uno de los 5 principios y califica /5 cada uno.

### Parte 4 — Identificar la audiencia y el objetivo (5 min)

Para cada historia de datos, define antes de escribir una sola palabra:

**FICHA DE AUDIENCIA Y OBJETIVO:**
```
AUDIENCIA:
  Quien es: [rol, nivel de seniority, conocimiento tecnico]
  Que ya sabe: [que no necesitas explicar]
  Que le importa: [su motivacion principal]
  Que teme: [su resistencia a la historia]

OBJETIVO DE LA HISTORIA:
  Al terminar de ver/leer, quiero que mi audiencia: [ACCION ESPECIFICA]
  La metrica de exito es: [como sabre si funciono]

DATOS CLAVE (maximo 3):
  1. [EL MAS IMPACTANTE]
  2. [EL MAS RELEVANTE PARA LA AUDIENCIA]
  3. [EL QUE PROVOCA LA ACCION]
```

Completa esta ficha para TU proyecto integrador: si tuvieras que presentar tus resultados al Director Nacional de Salud del MSP, como completarias la ficha?

## Usa IA para...

- Pedirle a Claude que evalúe una historia de datos que hayas escrito y señale en que principio falla mas.
- Preguntarle a ChatGPT ejemplos de las 5 mejores historias de datos contadas por periodistas o analistas latinoamericanos en 2024-2025.
- Pedirle que convierta un parrafo de tu documento de titulacion en una historia de 3 oraciones que un gerente no tecnico entenderia en 30 segundos.

## Que aprendiste

- Que la diferencia entre datos e historia es la presencia de tension, contraste y llamado a la accion.
- Que el dato mas importante no es el mas preciso — es el que genera la accion deseada.
- Que definir la audiencia y el objetivo antes de crear cualquier visualizacion o narrativa es el paso mas importante.
- Que los 5 principios se pueden aplicar a cualquier conjunto de datos, incluyendo los de tu proyecto integrador.

## Reto extra

Encuentra una historia de datos contada por un medio ecuatoriano (El Universo, Plan V, GK) o latinoamericano (El Pais, La Nacion Data). Analiza esa historia aplicando los 5 principios y determina cuales aplica bien y cuales no. Reescribe el titular y el primer parrafo para mejorar los principios mas debiles. Compara tu version con la original.
