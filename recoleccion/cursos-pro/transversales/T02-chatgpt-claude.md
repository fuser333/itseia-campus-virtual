# Modulo T-02: ChatGPT y Claude: uso profesional
**Duracion:** 4h | **Nivel:** Todos | **Prerequisitos:** T-01

---

## Objetivos de aprendizaje
Al finalizar este modulo, el profesional sera capaz de:
1. Elegir la herramienta correcta (ChatGPT, Claude o Gemini) segun la tarea especifica y el contexto
2. Aplicar al menos cinco formulas de prompt engineering para obtener respuestas profesionalmente utiles
3. Usar tecnicas avanzadas de prompting (cadena de pensamiento, roles) en situaciones complejas
4. Identificar cuando una respuesta de IA tiene alucinaciones o informacion no confiable
5. Aplicar un protocolo de privacidad antes de subir cualquier informacion a herramientas de IA
6. Construir un workflow personal que integre IA en sus actividades profesionales diarias

---

## Sesion 1: ChatGPT vs Claude vs Gemini - diferencias reales (45 min)

### Teoria

En el mercado de herramientas de IA conversacional hay varios jugadores, pero tres dominan el uso profesional: ChatGPT de OpenAI, Claude de Anthropic y Gemini de Google. No son iguales. Cada uno tiene fortalezas especificas, limitaciones propias y casos de uso donde destaca. Elegir la herramienta correcta para cada tarea te da mejores resultados.

**La pregunta correcta no es cual es el mejor, sino cual es el mejor para esta tarea**

Esta distincion es importante. No existe una herramienta universalmente superior. Los tres modelos son competentes en tareas generales, pero tienen diferencias notables en areas especificas. Un profesional que entiende estas diferencias obtiene resultados consistentemente mejores que uno que usa siempre el mismo modelo para todo.

**ChatGPT (OpenAI)**

ChatGPT fue el primero en llegar masivamente al publico y sigue siendo el mas reconocido. La version gratuita (GPT-4o mini) es suficiente para muchas tareas. La version de pago (ChatGPT Plus, $20/mes) da acceso a GPT-4o, el modelo mas capaz de la linea.

Fortalezas documentadas:
- Generacion de codigo: es probablemente el mas solicitado para tareas de programacion
- Integraciones: tiene un ecosistema de plugins y GPTs personalizados muy amplio
- Analisis de imagenes: puede ver y analizar fotos, graficos, documentos escaneados
- DALL-E integrado: puede generar imagenes desde la misma interfaz
- Busqueda web en tiempo real (version Plus): puede consultar internet para informacion actual

Limitaciones a considerar:
- Tiende a ser mas "complaciente", es decir, a estar de acuerdo contigo aunque estes equivocado
- Sus respuestas a veces priorizan sonar convincente sobre ser precisas
- La memoria entre conversaciones es limitada en la version gratuita

Mejor para: primeros borradores de contenido, codigo, analisis de imagenes, cuando necesitas acceder a informacion reciente.

**Claude (Anthropic)**

Claude es desarrollado por Anthropic, una empresa fundada con un enfoque explicito en seguridad de la IA. Su modelo actual (Claude 3.5 Sonnet y Claude 3.7) es considerado por muchos profesionales como el mejor para tareas de redaccion larga y analisis de texto complejo.

Fortalezas documentadas:
- Analisis de documentos largos: puede procesar documentos de hasta 200,000 palabras (contratos, informes, libros completos) en una sola conversacion
- Calidad de redaccion: produce prosa mas natural y menos formulaica que los competidores
- Menor tendencia a alucinaciones en texto (aunque las tiene): es mas probable que diga "no se" en lugar de inventar
- Razonamiento estructurado: excele en analisis paso a paso y en seguir instrucciones complejas
- Tono: mantiene mejor el tono y el estilo que le especificas

Limitaciones a considerar:
- No genera imagenes
- Busqueda web disponible solo en algunos planes
- Puede ser mas cauto (a veces excesivamente) en temas sensibles

Mejor para: analisis de contratos y documentos largos, redaccion que requiere estilo especifico, tareas que requieren razonamiento cuidadoso, cuando la precision es mas importante que la velocidad.

**Gemini (Google)**

Gemini es el modelo de Google, con la ventaja unica de estar profundamente integrado con el ecosistema de Google (Gmail, Drive, Docs, Sheets). Esto lo hace especialmente valioso si tu flujo de trabajo vive en las herramientas de Google.

Fortalezas documentadas:
- Integracion con Google Workspace: puede leer y escribir en tus documentos, hojas de calculo y correos de Google directamente
- Acceso a informacion actual: por su integracion con la busqueda de Google, tiene acceso mas natural a informacion reciente
- Multimodalidad avanzada: maneja texto, imagenes, audio y video en una sola interfaz
- Google NotebookLM (complementario): herramienta de investigacion y sintesis de documentos excepcional

Limitaciones a considerar:
- En tareas puramente de razonamiento de texto, algunos usuarios lo encuentran menos preciso que Claude
- Menos maduro en el ecosistema de integraciones de terceros comparado con ChatGPT

Mejor para: cuando tu trabajo vive en Google (Gmail, Docs, Sheets), busqueda de informacion actual, cuando necesitas procesar multiples tipos de contenido (texto + imagenes + audio).

**Tabla de decision rapida**

| Tarea | Herramienta recomendada |
|---|---|
| Redactar un contrato o informe largo | Claude |
| Analizar un documento PDF extenso | Claude |
| Generar codigo o scripts | ChatGPT |
| Buscar informacion reciente (2025-2026) | ChatGPT Plus o Gemini |
| Resumir correos de Gmail | Gemini |
| Crear una imagen o grafico | ChatGPT (DALL-E) |
| Analizar una foto o captura de pantalla | ChatGPT o Gemini |
| Primer borrador de contenido general | Cualquiera de los tres |
| Razonamiento complejo paso a paso | Claude |
| Integracion con Google Sheets | Gemini |

**Costos actuales (referencia 2026)**

- ChatGPT gratuito: GPT-4o mini, suficiente para usos basicos
- ChatGPT Plus: $20/mes, acceso a GPT-4o completo, busqueda web, analisis de archivos
- Claude gratuito: Claude 3.5 Haiku con limites de uso diario
- Claude Pro: $20/mes, acceso a Claude 3.7, mayor limite de mensajes, documentos largos
- Gemini gratuito: funcional para tareas basicas
- Gemini Advanced: $19.99/mes (incluido en Google One AI Premium), integracion total con Workspace

Para un profesional ecuatoriano que recien empieza, la recomendacion es: comienza con las versiones gratuitas de ChatGPT y Claude. Experimenta con ambas por dos semanas. Cuando identifiques que tareas son criticas para tu trabajo, considera pagar una sola (la que mejor resuelve esas tareas especificas).

---

### Ejercicio practico

**Ejercicio 2.1: La misma pregunta en tres herramientas**

Tiempo: 20 minutos

Paso 1. Abre las tres herramientas en pestanas separadas: chat.openai.com, claude.ai, gemini.google.com (registrate donde sea necesario)

Paso 2. Escribe exactamente la misma consulta en las tres. Usa algo relevante para tu trabajo. Si eres contador: "Explica en tres parrafos como la conciliacion bancaria se beneficia del uso de inteligencia artificial. Usa ejemplos practicos para Ecuador." Si eres abogado: "Cuales son los tres principales riesgos legales del uso de herramientas de IA en una firma juridica ecuatoriana?" Adapta la pregunta a tu profesion.

Paso 3. Compara las tres respuestas. Anota:
- Cual fue mas precisa?
- Cual fue mas facil de leer?
- Cual incluyó ejemplos mas relevantes?
- Cual fue mas larga o mas corta? Fue esa diferencia un problema o una ventaja?

Paso 4. Escribe una conclusion de una frase: para este tipo de consulta, que herramienta preferirias y por que?

---

### Verificacion

1. Un gerente de ventas necesita analizar un contrato de 80 paginas con un proveedor para identificar clausulas de penalizacion. Cual herramienta recomendarias y por que?

2. Cuales son las dos diferencias mas importantes entre ChatGPT y Claude para uso profesional?

3. Por que no tiene sentido preguntarse "cual es el mejor modelo de IA" sin especificar la tarea?

---

## Sesion 2: Prompt engineering basico (45 min)

### Teoria

Un prompt es el mensaje que le envias a una herramienta de IA. La calidad del prompt determina en gran medida la calidad de la respuesta. Esto no es una opinion, es sistematicamente documentado: el mismo modelo, con prompts distintos sobre el mismo tema, puede dar respuestas que van desde inutils hasta excelentes.

Prompt engineering es el arte y la ciencia de formular solicitudes que producen resultados utiles. No necesitas ser experto. Con cinco formulas basicas puedes mejorar dramaticamente tus resultados desde hoy.

**Por que importa la forma en que preguntas**

Los modelos de lenguaje son sistemas de prediccion estadistica. Generan el texto que es mas probable dada la secuencia de texto que recibieron (tu prompt). Si tu prompt es vago, el modelo genera texto que es probable dado un contexto vago, lo que produce respuestas genericas. Si tu prompt es especifico, el modelo genera texto que es probable dado un contexto especifico, lo que produce respuestas relevantes.

En terminos simples: si le preguntas poco, te da poco. Si le preguntas bien, te da mucho.

**Formula 1: Rol + Tarea + Formato**

Esta es la formula mas basica y la que mas mejora los resultados para uso profesional.

Estructura: "Actua como [ROL ESPECIFICO]. Tu tarea es [TAREA CONCRETA]. La respuesta debe estar en formato [FORMATO ESPECIFICO]."

Ejemplo sin formula (resultado generico):
"Dame informacion sobre el impuesto a la renta en Ecuador"

Ejemplo con formula (resultado especifico):
"Actua como un contador tributario con 10 años de experiencia en Ecuador. Tu tarea es explicarle a un empresario PYME con escasa formacion financiera como funciona el impuesto a la renta para personas naturales obligadas a llevar contabilidad. La respuesta debe estar en formato de lista numerada con ejemplos numericos concretos, maximo 5 puntos."

La diferencia en calidad es consistente y significativa.

**Formula 2: Contexto detallado**

Los modelos generan mejores respuestas cuando tienen mas contexto sobre quien pregunta, para que y bajo que condiciones.

Estructura: "Contexto: [descripcion de la situacion]. Objetivo: [que quieres lograr]. Restricciones: [limitaciones importantes]."

Ejemplo:
"Contexto: Soy abogado en una firma mediana de Quito y necesito redactar un correo para un cliente que se molesto porque el proceso judicial tomo mas tiempo del estimado. El cliente es empresario, comunicacion directa pero respetuosa. Objetivo: reconocer el retraso, explicar brevemente las razones sin excusarme en exceso y mantener la relacion comercial. Restricciones: maximo 150 palabras, tono profesional pero calido, sin jerga legal."

**Formula 3: Ejemplos de lo que quieres (Few-shot prompting)**

Si tienes un ejemplo del estilo o formato que quieres, incluirlo en el prompt mejora dramaticamente el resultado.

Estructura: "Quiero que generes [COSA] siguiendo este estilo: [EJEMPLO]. Ahora genera [COSA NUEVA] sobre [TEMA]."

Ejemplo:
"Quiero que generes titulos de presentacion ejecutiva siguiendo este estilo: 'Oportunidad de reduccion de costos operativos: analisis Q1 2026'. Ahora genera 5 titulos similares para una presentacion sobre los resultados de adopcion de herramientas de IA en el equipo contable durante el primer semestre."

**Formula 4: Restricciones explicitas**

Decirle al modelo lo que NO debe hacer es tan importante como decirle lo que debe hacer.

Ejemplos de restricciones utiles:
- "Sin jerga tecnica"
- "Sin mencionar legislacion de otros paises, solo Ecuador"
- "Sin introduccion ni conclusion, solo el contenido solicitado"
- "Maximo 200 palabras"
- "En tono formal, no uses tuteo"
- "No uses viñetas, solo parrafos"
- "No incluyas citas de fuentes que no puedas verificar"

**Formula 5: Pedir revision y autocritica**

Al final de un prompt, puedes pedirle al modelo que revise su propia respuesta.

Ejemplos:
- "Antes de finalizar, revisa si la respuesta es precisa para el contexto ecuatoriano y ajusta lo que sea necesario."
- "Una vez que hayas respondido, identifica la parte de tu respuesta de la que estes menos seguro y marcala con [VERIFICAR]."
- "Al final de tu respuesta, agrega una seccion 'Limitaciones' donde indiques que aspectos de esta respuesta debo verificar con una fuente oficial."

Esta ultima formula es particularmente valiosa para uso profesional porque te recuerda que la respuesta de IA es un punto de partida, no un documento final firmable.

**Los errores mas comunes en prompting**

Error 1: Prompts demasiado cortos. "Haz un contrato de trabajo" no le da al modelo informacion suficiente para saber que tipo de contrato, bajo que legislacion, para que tipo de empleado, con que clausulas especiales.

Error 2: Preguntas ambiguas. "Dame algo para el cliente" no dice quien es el cliente, que necesita, en que formato, con que tono.

Error 3: Solicitar todo en un solo prompt. Si necesitas un informe complejo, es mejor construirlo en partes: primero la estructura, luego cada seccion. Los modelos generan mejor en etapas que todo de golpe.

Error 4: Aceptar la primera respuesta sin refinar. Casi siempre la segunda o tercera vuelta mejora el resultado. "Bien, pero hazlo mas conciso" o "Bien, pero agrega un ejemplo especifico de Ecuador" son continuaciones validas.

Error 5: No indicar el nivel de la audiencia. Un texto para un cliente sin formacion financiera debe ser radicalmente distinto a uno para una junta directiva. Si no lo especificas, el modelo elige un nivel arbitrario.

---

### Ejercicio practico

**Ejercicio 2.2: La cadena de refinamiento**

Tiempo: 25 minutos

Tarea: generar un email profesional de seguimiento para un cliente o contraparte usando las cinco formulas.

Paso 1. Escribe un prompt sin ninguna formula. Solo describe lo que necesitas en una oracion. Envia. Lee la respuesta.

Paso 2. Reescribe el mismo prompt aplicando Formula 1 (Rol + Tarea + Formato). Envia en una conversacion nueva. Lee la diferencia.

Paso 3. A esa respuesta, agrega un mensaje de refinamiento aplicando Formula 4 (restricciones): "Bien. Ahora ajusta para que tenga maximo 120 palabras, tono formal, y sin referencias a legislacion de otros paises."

Paso 4. Aplica Formula 5: "Antes de darme la version final, indica cual parte podria necesitar revision segun el contexto ecuatoriano."

Paso 5. Guarda los tres versiones (sin formula, con formula basica, refinada) y compara. Este ejercicio hace visible la diferencia de forma directa.

---

### Verificacion

1. Escribe un prompt usando la Formula 1 (Rol + Tarea + Formato) para pedir ayuda con una tarea especifica de tu trabajo. El prompt debe tener al menos 3 elementos claros.

2. Por que es util incluir restricciones explicitas en un prompt? Da un ejemplo de una restriccion importante para tu profesion.

3. Cual es el error de prompting mas comun y como se evita?

---

## Sesion 3: Prompt engineering intermedio (45 min)

### Teoria

Una vez que dominas las cinco formulas basicas, el siguiente nivel es aprender tecnicas que permiten resolver problemas mas complejos: situaciones que requieren razonamiento largo, analisis de multiples perspectivas o tareas que se dividen en pasos.

**Tecnica 1: Cadena de pensamiento (Chain of Thought)**

Esta tecnica, documentada cientificamente por investigadores de Google en 2022, consiste en pedirle al modelo que muestre su razonamiento paso a paso antes de dar la respuesta final. El resultado es significativamente mas preciso para problemas que requieren razonamiento logico.

Como activarla:

Version explicita: "Resuelve este problema paso a paso, mostrando tu razonamiento en cada etapa antes de llegar a la conclusion final."

Version implicita: "Piensa en voz alta mientras analizas esta situacion."

Ejemplo de diferencia:

Sin cadena de pensamiento:
Prompt: "Un cliente debe $5,400 en impuestos atrasados con multa del 10% mensual por 3 meses. Cuanto debe ahora?"
Respuesta: "$7,074" (puede ser correcta o incorrecta)

Con cadena de pensamiento:
Prompt: "Resuelve paso a paso: Un cliente debe $5,400 en impuestos atrasados con multa del 10% mensual por 3 meses. Muestra cada calculo antes de la respuesta final."
Respuesta: "Mes 1: $5,400 × 1.10 = $5,940. Mes 2: $5,940 × 1.10 = $6,534. Mes 3: $6,534 × 1.10 = $7,187.40. Total: $7,187.40."

El resultado es diferente (el primero era incorrecto) y puedes verificar cada paso.

Esta tecnica es especialmente valiosa para: calculos financieros, analisis de riesgo legal, interpretacion de clausulas contractuales, diagnosticos diferenciales en medicina, y cualquier situacion donde el proceso importa tanto como el resultado.

**Tecnica 2: Asignacion de roles especificos**

Asignarle al modelo un rol especifico no es solo decorativo. Activa patrones de lenguaje, vocabulario y enfoque que el modelo asocia con ese rol. La diferencia entre "explica X" y "actua como un [experto especifico] y explica X" es sistematicamente mesurable.

Roles de alto impacto para profesionales:

Para analisis critico: "Actua como un abogado del diablo. Tu trabajo es encontrar todos los puntos debiles, riesgos y fallas en el siguiente argumento/contrato/plan."

Para comunicacion con clientes: "Actua como un comunicador especializado en explicar temas complejos de [tu area] a personas sin formacion tecnica. Tu objetivo es claridad, no precision tecnica."

Para perspectivas multiples: "Analiza esta situacion desde tres perspectivas: la del cliente, la del proveedor y la de un regulador. Separa claramente cada perspectiva."

Para revision de documentos: "Actua como un revisor editorial senior. Lee el siguiente texto e identifica: inconsistencias logicas, afirmaciones sin respaldo, lenguaje ambiguo y oportunidades de mejora."

**Tecnica 3: Prompts de sistema y personalizacion**

En ChatGPT existe la funcion de "instrucciones personalizadas" que te permite configurar un contexto permanente para todas tus conversaciones. Esta configuracion es extremadamente util para uso profesional continuo.

Como configurarla en ChatGPT:
1. Haz clic en tu perfil (esquina inferior izquierda)
2. Selecciona "Personalizar ChatGPT" o "Custom instructions"
3. En el primer campo ("Que quieres que ChatGPT sepa sobre ti"): describe tu profesion, pais, tipo de trabajo y necesidades recurrentes
4. En el segundo campo ("Como quieres que responda"): define tono, formato preferido, idioma, restricciones permanentes

Ejemplo de configuracion para un contador ecuatoriano:

Campo 1: "Soy contador publico con CPA en Ecuador, especializado en tributacion para PYMEs. Trabajo en Quito. Mis clientes son empresas medianas del sector comercial y de servicios. Conozco bien la normativa del SRI pero necesito ayuda con redaccion y comunicacion."

Campo 2: "Responde siempre en espanol latinoamericano formal. Cuando trates temas tributarios, basa la informacion en la legislacion ecuatoriana vigente (Codigo Tributario, LORTI, reglamentos SRI). Si algo no aplica a Ecuador o no estas seguro, dilo explicitamente. Formatos preferidos: listas numeradas para procesos, parrafos cortos para explicaciones. Maximo 300 palabras por respuesta a menos que te pida mas."

Con esta configuracion, cada conversacion nueva ya empieza con ese contexto sin tener que repetirlo.

**Tecnica 4: Desglose de tareas complejas**

Para tareas complejas, el enfoque mas efectivo es dividir el trabajo en prompts sucesivos, donde cada respuesta alimenta al siguiente prompt.

Ejemplo para redactar un informe de riesgo:

Prompt 1: "Dame la estructura (solo titulos de secciones) para un informe de evaluacion de riesgo crediticio de una PYME comercial ecuatoriana que solicita un prestamo de $50,000. Sin contenido, solo la estructura."

[Revisar y ajustar la estructura]

Prompt 2: "Perfecto. Ahora desarrolla la seccion 'Analisis de capacidad de pago' con al menos 200 palabras. Usa como datos ficticios pero realistas: ventas anuales $180,000, costos operativos $120,000, deudas existentes $15,000."

[Revisar y ajustar esa seccion]

Prompt 3: "Bien. Ahora la seccion 'Analisis de garantias' siguiendo el mismo estilo que la seccion anterior."

Este enfoque produce resultados mas consistentes y controlados que pedir el informe completo en un solo prompt.

**Tecnica 5: Solicitar formato estructurado**

Para trabajar con datos o informacion que necesitas procesar despues, pedir formato estructurado es mas eficiente.

Formatos utiles:
- "Responde en formato JSON" (para datos que vas a importar a un sistema)
- "Responde en formato de tabla markdown con columnas: [columna 1, columna 2, columna 3]"
- "Responde como lista de viñetas con exactamente este formato: [Accion] - [Razon] - [Prioridad: Alta/Media/Baja]"
- "Responde como un template que yo pueda reutilizar, con [VARIABLE] para las partes que cambian"

---

### Ejercicio practico

**Ejercicio 2.3: Construir tu prompt maestro**

Tiempo: 25 minutos

Este ejercicio te lleva a crear un "prompt maestro" personalizado para la tarea mas repetitiva de tu trabajo que podria beneficiarse de IA.

Paso 1. Identifica la tarea. Escribe en papel la tarea profesional repetitiva que mas tiempo te consume cada semana. Debe ser algo que involucra texto: redactar, analizar, resumir, explicar, responder.

Paso 2. Construye el prompt aplicando todas las tecnicas aprendidas:
- Formula 1: Define el rol, la tarea y el formato
- Formula 2: Agrega contexto relevante (tu empresa, tu cliente tipo, el pais)
- Formula 3: Si tienes un ejemplo de buen resultado previo, incluyelo
- Formula 4: Define al menos 3 restricciones explicitas
- Formula 5: Pide que marque lo que requiere verificacion
- Tecnica 2: Asigna el rol especifico mas util para esta tarea

Paso 3. Prueba el prompt con datos ficticios pero realistas. Evalua el resultado.

Paso 4. Refina el prompt basandote en lo que no estuvo bien. Prueba de nuevo.

Paso 5. Guarda tu prompt maestro en un documento. Este es el inicio de tu biblioteca personal de prompts.

---

### Verificacion

1. Describe la diferencia entre un prompt sin cadena de pensamiento y uno con cadena de pensamiento. Por que produce mejores resultados el segundo?

2. Escribe un ejemplo de instruccion personalizada (Custom instruction) que configurarias en ChatGPT para tu profesion especifica. Debe incluir informacion sobre tu contexto y tus preferencias de respuesta.

3. Para una tarea compleja como preparar un informe de auditoria de 20 paginas, por que es mejor desglosarla en multiples prompts en lugar de pedir todo en uno?

---

## Sesion 4: Limitaciones, privacidad y workflow profesional (45 min)

### Teoria

Usar herramientas de IA de forma efectiva no solo significa saber como obtener buenas respuestas. Significa saber cuales son los limites de estas herramientas, que informacion es seguro compartir y como integrar la IA en tu flujo de trabajo sin crear riesgos.

**Las tres limitaciones criticas**

Limitacion 1: Corte de conocimiento

Los modelos de lenguaje son entrenados con datos hasta una fecha especifica (llamada "fecha de corte"). Todo lo que ocurrio despues de esa fecha no existe para el modelo, a menos que tenga acceso a busqueda web en tiempo real.

GPT-4o tiene corte de conocimiento en abril 2024.
Claude 3.7 tiene corte en principios de 2025.
Gemini tiene acceso mas actualizado gracias a su integracion con Google Search.

Implicacion practica: si le preguntas a ChatGPT (sin busqueda web) por la reforma tributaria del SRI de 2026, podria darte informacion de reformas anteriores presentadas como si fueran la actual, o podria inventar detalles. Siempre verifica informacion reciente en fuentes oficiales.

Para temas regulatorios en Ecuador, la fuente de verdad sigue siendo:
- SRI (sri.gob.ec) para tributacion
- Superintendencia de Bancos (superbancos.gob.ec) para sector financiero
- Ministerio de Trabajo (trabajo.gob.ec) para laboral
- SENESCYT para educacion y titulos

Limitacion 2: Alucinaciones

El termino "alucinacion" en IA se refiere a cuando el modelo genera informacion plausible pero falsa con total confianza. No es un error que el modelo detecte. Lo presenta como si fuera verdad.

Tipos comunes de alucinaciones:
- Citas bibliograficas inventadas (autores reales + titulos falsos)
- Estadisticas sin fuente o con fuente inventada
- Numeros de leyes, articulos o sentencias que no existen
- Hechos historicos con detalles incorrectos
- Nombres de personas, empresas o instituciones levemente alterados

Como detectar posibles alucinaciones:
- Desconfia de cualquier dato muy especifico (porcentaje exacto, ano exacto, numero de articulo) que no conozcas de antemano
- Siempre busca la fuente primaria cuando uses estadisticas en documentos profesionales
- Para legislacion ecuatoriana, verifica siempre en Lexis o en el registro oficial
- Cuando algo "suene demasiado conveniente" para tu argumento, verifica

Limitacion 3: Sesgos heredados

Los modelos aprenden de texto producido por humanos, que contiene todos los sesgos culturales, economicos, de genero y geograficos de las personas que lo escribieron. Esto se manifiesta de varias formas:

- Sesgo geografico: los modelos conocen mucho mejor el contexto de Estados Unidos y Europa que de Ecuador y LatAm. Sus ejemplos "por defecto" tienden a ser del contexto anglosajón.
- Sesgo de recencia: informacion reciente esta sobre-representada respecto a conocimiento historico menos digitalizado
- Sesgo de confirmacion: si tu prompt implica una conclusion, el modelo tiende a generar argumentos que la apoyan en lugar de evaluarla imparcialmente

**Privacidad: que NUNCA debes subir**

Esta es la seccion mas critica para uso profesional. Cuando subes informacion a ChatGPT, Claude o Gemini en sus versiones gratuitas o estandar, esa informacion puede ser usada para entrenar futuros modelos, dependiendo de la configuracion y los terminos del servicio vigentes.

Nunca subas a herramientas de IA comerciales sin configuracion de privacidad empresarial:

Datos personales de terceros:
- Nombres completos + cedulas de identidad de clientes
- Informacion medica de pacientes (aunque sea anonimizada parcialmente)
- Datos financieros con identificadores personales
- Informacion laboral de empleados (salarios, evaluaciones, razones de despido)
- Informacion de menores de edad

Informacion empresarial confidencial:
- Contratos con clausulas de confidencialidad vigentes
- Informacion de adquisiciones o fusiones antes de anuncio publico
- Estrategias comerciales no publicas
- Base de datos de clientes
- Informacion de precios no publica o descuentos especificos por cliente
- Codigo fuente propietario

Informacion regulada:
- Secreto profesional (medicos, abogados, psicologos)
- Informacion bancaria cubierta por sigilo bancario
- Datos de investigaciones penales en curso

La regla practica: si necesitas permiso para compartir esa informacion con un colega fuera de tu empresa, necesitas ese mismo permiso (o mas) para subirla a una herramienta de IA comercial.

**Como configurar privacidad en las herramientas**

ChatGPT:
- Ve a Configuracion > Controles de datos
- Activa "Mejorar el modelo para todos" como DESACTIVADO si no quieres que tus conversaciones se usen para entrenamiento
- Las cuentas de ChatGPT Team y Enterprise tienen protecciones adicionales

Claude:
- Ve a Configuracion > Privacidad
- Anthropic permite optar por salir del entrenamiento de modelos con datos de tus conversaciones
- Las cuentas Claude for Business tienen mayor proteccion

Gemini:
- Ve a myaccount.google.com > Datos y privacidad > Actividad en aplicaciones y web
- Busca la actividad de Gemini y puedes pausar el registro

**Workflow profesional: integrando IA en tu dia a dia**

La trampa mas comun es usar la IA de forma reactiva: cuando tienes un problema especifico, buscas si la IA puede ayudar. El enfoque mas productivo es proactivo: definir en que partes de tu flujo de trabajo rutinario la IA puede agregar valor de forma consistente.

Un framework de tres zonas:

Zona verde (IA con supervision minima):
Tareas donde el costo de un error es bajo y la verificacion es facil. Primer borrador de comunicaciones internas, resumenes de reuniones, formateo de datos, traducciones de referencia, generacion de ideas para brainstorming.

Zona amarilla (IA con revision obligatoria):
Tareas donde el error es posible y el impacto es moderado. Borradores de comunicaciones externas, analisis de documentos, explicaciones tecnicas para clientes, preparacion de presentaciones.

Zona roja (IA como apoyo, decision siempre humana):
Tareas donde el error tiene consecuencias legales, financieras o de salud significativas. Dictamenes legales, diagnósticos medicos, declaraciones tributarias finales, contratos firmables, informes con responsabilidad profesional.

La IA nunca debe estar en la zona roja como decision final. Puede estar como apoyo (analizar, sugerir, resumir opciones) pero el juicio y la firma son siempre del profesional.

---

### Ejercicio practico

**Ejercicio 2.4: Tu workflow de IA personal**

Tiempo: 20 minutos

Parte A: Mapa de tareas (10 min)
Haz una lista de 10 tareas tipicas de tu semana de trabajo. Para cada una, asignala a zona verde, amarilla o roja segun el framework anterior.

Parte B: Checklist de privacidad (5 min)
Para las tareas en zona verde y amarilla, revisa si alguna involucra datos que no deberias subir a herramientas de IA. Modifica el proceso para esas tareas (usar datos ficticios de ejemplo, anonimizar antes de subir, usar version empresarial con mayor proteccion).

Parte C: Plan de implementacion (5 min)
Elige las tres tareas de zona verde que empezaras a hacer con asistencia de IA esta semana. Para cada una, escribe el tipo de prompt que usaras (no el prompt completo, solo el tipo: "rol + tarea", "cadena de pensamiento", etc.)

---

### Verificacion

1. Describes tres situaciones donde la fecha de corte de conocimiento de un modelo de IA podria causarte un problema profesional serio. Como lo evitarias en cada caso?

2. Un cliente te pide que analices su contrato usando ChatGPT. El contrato tiene clausula de confidencialidad. Que haces?

3. Describe con tus palabras la diferencia entre zona verde y zona roja en el framework de uso de IA. Da un ejemplo de cada una para tu profesion.

---

## Recursos adicionales

**Herramientas:**
- ChatGPT: https://chat.openai.com
- Claude: https://claude.ai
- Gemini: https://gemini.google.com
- Google NotebookLM (sintesis de documentos): https://notebooklm.google.com
- Perplexity AI (busqueda con IA): https://www.perplexity.ai

**Para aprender mas sobre prompt engineering:**
- Guia oficial de OpenAI sobre prompts: https://platform.openai.com/docs/guides/prompt-engineering
- Prompt Engineering Guide (en espanol parcialmente): https://www.promptingguide.ai/es
- Curso gratuito de DeepLearning.AI: "ChatGPT Prompt Engineering for Developers" (YouTube)

**Privacidad y terminos de uso:**
- Politica de privacidad ChatGPT: https://openai.com/policies/privacy-policy
- Politica de privacidad Claude: https://www.anthropic.com/privacy
- Configuracion de privacidad Google: https://myaccount.google.com

**Bibliotecas de prompts en espanol:**
- https://prompts.chat (filtrar por idioma espanol)
- Comunidad de Reddit r/PromptEngineering (mayormente ingles pero util)

**Para Ecuador especificamente:**
- SRI (fuente de verdad tributaria): https://www.sri.gob.ec
- Registro Oficial de Ecuador (legislacion vigente): https://www.registroficial.gob.ec
- Lexis (base de datos juridica ecuatoriana): https://www.lexis.com.ec

---

*Modulo T-02 completado. Siguiente: T-03 - Seguridad y privacidad de datos (2 horas)*
