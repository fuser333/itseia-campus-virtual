# J-01: Investigacion Jurisprudencial con IA

**Tipo:** Leccion
**Duracion:** 60 minutos
**Semana:** 2 de 4
**Herramientas:** ChatGPT Plus, Claude, SATJE (satje.gob.ec), CNJ, Perplexity AI

---

## Objetivo de Aprendizaje

Al finalizar este modulo, dominaras un flujo de trabajo que combina las herramientas de IA con las fuentes jurisprudenciales oficiales del Ecuador para reducir el tiempo de investigacion legal de horas a minutos, manteniendo la precision y verificabilidad que exige el ejercicio profesional.

---

## Seccion 1: El problema de la investigacion juridica tradicional en Ecuador

Cualquier abogado ecuatoriano con experiencia sabe que la investigacion jurisprudencial es una de las tareas que mas tiempo consume y mas frustracion genera. El sistema SATJE permite buscar causas, pero la busqueda por palabras clave es limitada y los fallos no estan indexados semanticamente. Un abogado que busca precedentes sobre "responsabilidad civil extracontractual en accidentes de transito" puede pasar 3-4 horas revisando fallos irrelevantes antes de encontrar los 2 o 3 que realmente aplican a su caso.

La IA no reemplaza al SATJE ni a la CNJ. Lo que hace es transformar el flujo de trabajo:

**Flujo tradicional:**
1. Definir terminos de busqueda → buscar en SATJE → revisar fallos uno a uno → identificar precedentes → extraer argumentos relevantes → sintetizar para el caso

**Flujo con IA:**
1. Describir el caso a la IA → obtener mapa de categorias juridicas y argumentos relevantes → buscar en SATJE con mayor precision → subir fallos relevantes a IA → obtener sintesis y analisis comparado → usar en el caso

La IA actua como asistente de investigacion que te orienta antes de que entres al sistema oficial y que procesa rapidamente los fallos que encuentras.

---

## Seccion 2: Paso 1 — Mapeo juridico con IA antes de buscar

Antes de abrir el SATJE, usa la IA para obtener un mapa completo del problema juridico. Este paso te ahorrara tiempo de busqueda al ir con mayor precision al sistema oficial.

### Prompt de mapeo juridico

```
Soy abogado en Ecuador. Tengo el siguiente caso juridico:

[DESCRIPCION DEL CASO EN 3-5 ORACIONES — PUEDE SER ANONIMIZADO]

Necesito un mapa completo para preparar la investigacion jurisprudencial:

1. CALIFICACION JURIDICA: Como se denomina tecnicamente este tipo de caso en el derecho ecuatoriano? Cuales son las figuras juridicas aplicables?

2. NORMATIVA APLICABLE: Lista las normas ecuatorianas relevantes (Codigos, Leyes, Reglamentos) con los articulos especificos. Indica cuales son de aplicacion directa y cuales de aplicacion subsidiaria.

3. PALABRAS CLAVE PARA BUSQUEDA: Dame 8-10 terminos juridicos tecnicos que deberia usar para buscar jurisprudencia en el SATJE. Incluye variaciones del mismo concepto.

4. PREGUNTAS JURIDICAS CLAVE: Cuales son las 3-4 preguntas de derecho que la jurisprudencia debe responder para resolver este caso?

5. POSIBLE TENDENCIA JURISPRUDENCIAL: Basandote en tu entrenamiento (con la advertencia de que puede estar desactualizado), cual suele ser la tendencia de los tribunales ecuatorianos en casos similares?

Sé especifico al derecho ecuatoriano. Advierte cuando un concepto puede diferir de otros sistemas juridicos latinoamericanos.
```

### Que obtienes con este prompt

Este prompt te da en 2 minutos lo que normalmente requiere 30-45 minutos de preparacion previa:
- Los terminos exactos para buscar en SATJE (en lugar de adivinar)
- La estructura juridica del problema claramente articulada
- Las preguntas que la jurisprudencia debe contestar
- Un punto de partida para la estrategia del caso

Recuerda: la tendencia jurisprudencial que la IA describe es aproximada y puede estar desactualizada. La verificacion en SATJE es obligatoria.

---

## Seccion 3: Paso 2 — Busqueda eficiente en el SATJE

Con el mapa juridico de la IA en mano, ahora entras al SATJE con mucha mayor precision.

### Como funciona el sistema SATJE para jurisprudencia

El SATJE (Sistema de Administracion de la Funcion Judicial) es el sistema oficial de la Funcion Judicial ecuatoriana. Para buscar jurisprudencia:

1. Ingresa a **satje.gob.ec**
2. Navega a **Movimiento de Causas → Consulta de Causas**
3. Para busqueda por materia: usa **Jurisprudencia** en el menu superior
4. La CNJ tiene su propio buscador en **cortenacional.gob.ec → Jurisprudencia**

### Estrategia de busqueda optimizada

**Usa los terminos de busqueda del mapa IA, pero:**
- Empieza con terminos mas especificos (menor cantidad de resultados pero mas relevantes)
- Si hay pocos resultados, ampliar con terminos relacionados
- Filtra por sala (Sala Civil, Sala Penal, etc.) segun la naturaleza del caso
- Filtra por ano reciente primero (2022-2025) para jurisprudencia vigente

**Indicadores de un fallo relevante (revision rapida):**
- La causa tiene la misma calificacion juridica que tu caso
- Las partes tienen perfiles similares (personas naturales vs juridicas, tipo de contrato, etc.)
- La cuantia o el tipo de bien en disputa es similar
- El tribunal es de la misma jerarquia o superior

**Numero de fallos a buscar:**
- Para un escrito procesal: 5-8 fallos relevantes son suficientes
- Para una opinion juridica completa: 10-15 fallos
- Para litigacion de alto impacto: revision exhaustiva con asistencia de equipo

---

## Seccion 4: Paso 3 — Analisis de fallos con IA

Una vez que tienes los fallos del SATJE, la IA se convierte en tu asistente de analisis. Puedes cargar los fallos completos (en PDF o texto) y trabajar con Claude (por su capacidad de contexto extendido) o ChatGPT.

### Analisis de un fallo individual

```
He encontrado el siguiente fallo de [SALA/TRIBUNAL] dentro del juicio No. [NUMERO] de [AÑO]:
[PEGAR TEXTO DEL FALLO O RESUMEN]

Analiza este fallo e identifica:
1. RATIO DECIDENDI: Cual es el argumento juridico central que determino la decision?
2. HECHOS CLAVE: Cuales son los 3-5 hechos que el tribunal considero determinantes?
3. NORMAS APLICADAS: Que articulos especificos invoco el tribunal y como los interpreto?
4. RELEVANCIA PARA MI CASO: Con base en los hechos de mi caso [DESCRIPCION BREVE ANONIMIZADA], este fallo favorece a mi cliente [ACTOR/DEMANDADO]? En que medida?
5. ARGUMENTOS EXTRAIBLES: Que argumentos especificos de este fallo puedo usar en mi escrito?
```

### Analisis comparado de multiples fallos

Cuando tienes 5 o mas fallos relevantes, el analisis comparado con IA es donde mas tiempo ahorras:

```
Tengo [N] fallos sobre [TEMA JURIDICO] del sistema judicial ecuatoriano.
[PEGAR RESÚMENES O TEXTOS DE LOS FALLOS]

Realiza un analisis comparado:
1. CRITERIO PREDOMINANTE: Cual es la posicion mayoritaria de los tribunales en estos casos?
2. CRITERIOS DIVERGENTES: Hay posiciones contradictorias? En que tipo de casos cada criterio prevalece?
3. EVOLUCION: Si los fallos son de diferentes años, hay alguna evolucion del criterio juridico?
4. FACTORES DECISIVOS: Que factores parecen inclinar la decision hacia el actor versus el demandado?
5. TABLA COMPARADA: Resume en una tabla los casos con columnas: Tribunal | Ano | Decision | Factor determinante
6. CONCLUSION PARA MI CASO: Con base en estos precedentes, cual es la probabilidad de exito para [ACTOR/DEMANDADO] en mi caso especifico?
```

---

## Seccion 5: Aplicacion — Caso de investigacion jurisprudencial en COGEP

Para ilustrar el flujo completo, trabajemos con un caso tipo frecuente en la practica ecuatoriana:

**Caso:** Tu cliente es un propietario de un inmueble que tiene un inquilino moroso con 4 meses de arriendo impago ($1,800 totales). El contrato de arrendamiento esta vigente. Necesitas investigar jurisprudencia sobre desahucio por falta de pago bajo el COGEP y la Ley de Inquilinato.

### Paso 1: Prompt de mapeo

"Soy abogado en Ecuador. Mi cliente es arrendador de un bien inmueble urbano. El arrendatario tiene 4 meses de mora en el pago del canon ($450/mes). Tenemos contrato escrito. Necesito investigar jurisprudencia sobre la accion de desahucio por mora. Dame el mapa completo de investigacion juridica."

**Output esperado de la IA:** Identificara el articulo 829 del COGEP como norma de la accion de desahucio, la Ley de Inquilinato como norma especifica, los plazos y el procedimiento, y te dara terminos como "desahucio por mora", "falta de pago arriendo", "terminacion contrato arriendo COGEP", "restitucion bien arrendado".

### Paso 2: Busqueda en SATJE

Con esos terminos vas al SATJE. Buscas en la Sala Civil y en los Juzgados de lo Civil (primera instancia). Con "desahucio mora" y filtro por los ultimos 3 años encontraras un numero manejable de causas relevantes.

### Paso 3: Analisis

Subes los 4-5 fallos mas relevantes a Claude y pides el analisis comparado. En 10 minutos tienes una sintesis de la posicion jurisprudencial que te tomo 2 horas construir manualmente antes de la IA.

---

## Seccion 6: Herramientas complementarias para investigacion en Ecuador

### Perplexity AI para normativa reciente

Perplexity AI hace busquedas web en tiempo real con citas verificables. Es ideal para:
- Verificar si una ley fue reformada recientemente
- Buscar resoluciones del SENAE, SRI, SBS, SEPS u otros organismos
- Encontrar pronunciamientos recientes del Defensor del Pueblo o la Procuraduria

**Prompt para Perplexity:**
"Busca si hubo reformas a la Ley de Inquilinato o al COGEP en Ecuador durante 2024 o 2025 que afecten el procedimiento de desahucio. Cita las fuentes."

### Google Scholar para doctrina ecuatoriana

Google Scholar indexa articulos academicos y algunos fallos. Util para encontrar articulos de doctrina sobre temas juridicos ecuatorianos que sirven de apoyo argumentativo.

Busca: "[TEMA JURIDICO] Ecuador derecho" + filtra por los ultimos 5 años.

---

## Resumen del Modulo

- El flujo IA + SATJE reduce el tiempo de investigacion jurisprudencial en 70-80% sin sacrificar precision
- El mapa juridico previo (con IA) mejora dramaticamente la eficiencia de la busqueda en SATJE
- Claude es preferible para analisis de fallos extensos por su mayor ventana de contexto
- El analisis comparado de multiples fallos con IA es donde se obtiene mayor ganancia de tiempo
- Perplexity AI complementa con busqueda en tiempo real para normativa reciente
- Toda cita especifica de sentencia sigue requiriendo verificacion en SATJE antes de usar en escritos

---

## Ejercicio Rapido (20 minutos)

Toma un caso real o hipotetico de tu practica y ejecuta los primeros dos pasos del flujo:

1. Usa el prompt de mapeo juridico en Claude o ChatGPT (anonimiza el caso si es real)
2. Toma las palabras clave que genere la IA
3. Entra al SATJE y busca con esas palabras clave
4. Compara: las palabras clave de la IA te llevaron a resultados mas relevantes que las palabras que habrias usado tu de forma intuitiva?

El objetivo no es hacer el analisis completo ahora, sino verificar que el mapa previo de la IA mejora la calidad de tu busqueda en el sistema oficial.

---

**Siguiente modulo:** J-02 — Redaccion y Revision de Contratos con IA
