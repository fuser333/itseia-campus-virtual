# Modulo T-01: Fundamentos de IA sin tecnicismos
**Duracion:** 3h | **Nivel:** Todos | **Prerequisitos:** Ninguno

---

## Objetivos de aprendizaje
Al finalizar este modulo, el profesional sera capaz de:
1. Explicar que es la inteligencia artificial usando lenguaje cotidiano, sin depender de definiciones tecnicas
2. Distinguir los tres tipos principales de IA (generativa, predictiva, clasificacion) y reconocer cuales ya usa en su vida diaria
3. Separar los mitos mas comunes sobre la IA de la realidad documentada, con criterio propio
4. Identificar al menos tres casos de uso de IA relevantes para su sector en Ecuador o Latinoamerica
5. Completar su primera conversacion profesional con ChatGPT para resolver un problema concreto

---

## Sesion 1: Que es la IA realmente (45 min)

### Teoria

Antes de aprender a usar inteligencia artificial, hay que quitarle el miedo y la magia que le pone el marketing. La IA no es un robot que piensa como humano, no es un oraculo que sabe todo, y tampoco es la amenaza apocaliptica que muestran las peliculas. Es una herramienta. Una herramienta muy poderosa, pero herramienta al fin.

**La definicion honesta**

La inteligencia artificial es software que aprende de datos para realizar tareas que antes requerían intervención humana directa. Eso es todo. Un sistema de IA analiza enormes cantidades de ejemplos, encuentra patrones en esos ejemplos, y luego aplica esos patrones a situaciones nuevas.

Piensa en como aprendiste a reconocer un fraude bancario. Al principio, tu jefe te mostro ejemplos: esta transaccion tiene estas caracteristicas y resulto ser fraude, esta otra tiene estas otras y fue legítima. Con el tiempo, tu cerebro formo patrones. Cuando ves una transaccion nueva, la compara con esos patrones automaticamente. Un sistema de IA hace exactamente lo mismo, pero procesando millones de ejemplos en lugar de decenas, y en milisegundos en lugar de años.

**Por que ahora y no antes**

La inteligencia artificial no es nueva. Los conceptos matematicos detras existen desde los años 50. Lo que cambio en la ultima decada son tres cosas que llegaron al mismo tiempo:

Primero, la cantidad de datos disponibles exploto. Cada vez que usas una aplicacion, cada busqueda de Google, cada transaccion bancaria, cada foto que subes genera datos. Ecuador tiene hoy mas datos digitales que todos los archivos fisicos acumulados en su historia.

Segundo, el costo del procesamiento computacional bajo mas del 99% en 20 años. Lo que antes requeria un supercomputador del tamaño de un edificio, hoy lo hace tu telefono.

Tercero, los algoritmos mejoraron. Los investigadores encontraron arquitecturas matematicas (las redes neuronales profundas) que son especialmente buenas aprendiendo de datos no estructurados: texto, imagenes, voz.

Cuando estas tres cosas se alinearon, la IA paso de ser un tema academico a ser un producto que cualquiera puede usar desde su navegador.

**La IA que ya usas sin saberlo**

Aqui hay algo importante: probablemente ya usas inteligencia artificial todos los dias. Solo que no lo sabes porque nadie puso un cartel que diga "IA".

Cuando Spotify te sugiere una cancion que no conocias y resulta ser perfecta para tu gusto, eso es IA. Cuando Gmail detecta automaticamente que un correo es spam antes de que lo abras, eso es IA. Cuando en Banco Pichincha o Produbanco te llaman para verificar una transaccion inusual antes de que notes el problema, eso es IA. Cuando Netflix te recomienda una serie y aciertas al primer intento, eso es IA.

En Ecuador, el sistema de deteccion de fraude del Servicio de Rentas Internas (SRI) usa algoritmos de machine learning para identificar patrones de evasion fiscal. La empresa de telecomunicaciones Claro Ecuador usa IA para predecir que clientes estan por cancelar su contrato y actuar antes. El Hospital Metropolitano de Quito ha piloteado herramientas de IA para analizar imagenes radiologicas.

Entonces no es una tecnologia del futuro. Es presente. Lo que esta cambiando ahora es que paso de ser invisible (integrada en sistemas de empresas grandes) a ser accesible directamente para cualquier profesional desde una pantalla.

**Como "aprende" una IA: la version sin matematicas**

Imaginemos que quieres ensenarle a una persona que nunca ha visto un perro ni un gato a distinguirlos. Le muestras 10,000 fotos etiquetadas: "esto es perro", "esto es gato". Despues de ver suficientes ejemplos, esa persona empieza a notar caracteristicas: forma de las orejas, tamano, postura, textura del pelo. Cuando le muestras una foto nueva, puede decir con bastante confianza si es perro o gato.

Un sistema de IA hace lo mismo con numeros. Convierte cada imagen en miles de numeros (el valor de cada pixel), analiza cuales combinaciones de numeros aparecen mas frecuentemente en imagenes de perros versus gatos, y construye una funcion matematica que distingue entre los dos. Esa funcion matematica es el "modelo entrenado".

Lo que hace diferente a los modelos actuales como GPT-4 o Claude es que fueron entrenados con cantidades de texto inimaginables: una fraccion significativa de todo el texto escrito en internet, libros digitalizados, articulos cientificos, codigo de programacion. De ahi viene su capacidad de conversar, redactar, analizar y explicar. No porque "entiendan" en el sentido humano, sino porque aprendieron patrones del lenguaje a una escala sin precedentes.

**La diferencia entre reglas y aprendizaje**

Durante decadas, los programas de computadora funcionaron con reglas explicitas escritas por humanos. Si el saldo es menor que cero, mostrar alerta roja. Si el cliente lleva mas de 3 años sin comprar, enviar correo de reactivacion. Las reglas funcionaban bien para situaciones predecibles.

El problema era que la realidad es mas complicada que cualquier conjunto de reglas que puedas escribir. El mundo tiene millones de excepciones, contextos, matices. Un sistema de reglas para detectar fraude financiero tenia que ser actualizado manualmente cada vez que los estafadores inventaban un nuevo metodo.

La IA cambio el paradigma: en lugar de escribir las reglas, le das al sistema ejemplos de lo correcto y lo incorrecto, y el sistema descubre las reglas por si mismo. Cuando aparecen nuevos patrones de fraude, el sistema se puede reentrenar con los nuevos datos sin que nadie tenga que reescribir el codigo manualmente.

Esa diferencia, de reglas manuales a aprendizaje automatico, es la revolucion tecnologica real detras de todo lo que llamamos IA hoy.

---

### Ejercicio practico

**Ejercicio 1.1: Mapa de IA en tu vida diaria**

Tiempo: 15 minutos

Abre una hoja en blanco (papel o documento digital) y sigue estos pasos:

Paso 1. Escribe el nombre de las cinco aplicaciones o servicios digitales que mas usas en tu trabajo o vida personal (ejemplos: WhatsApp, Gmail, Google Maps, Spotify, la app de tu banco, el sistema de tu empresa).

Paso 2. Para cada una, escribe si crees que usa IA y para que. No necesitas estar seguro. Solo especula basandote en lo que acabas de aprender.

Paso 3. Busca en Google "[nombre de la app] inteligencia artificial" y compara con tu suposicion. Anota si acertaste o no y que encontraste.

Paso 4. Escribe una sola frase que resuma como la IA ya esta presente en tu vida profesional antes de este curso.

Este ejercicio te da un punto de partida real, no abstracto. Cuando mas adelante aprendas a usar herramientas de IA activamente, recordaras que ya tenias experiencia pasiva con ella.

---

### Verificacion

1. Un companero de trabajo te dice "la IA es solo una moda tecnologica, igual que el blockchain". Con lo que aprendiste en esta sesion, como le responderas en dos o tres oraciones?

2. Describe con tus propias palabras la diferencia entre un sistema que sigue reglas programadas y un sistema que aprende de datos. Usa un ejemplo de tu sector.

3. Nombra dos servicios o aplicaciones que ya usas que probablemente incorporan IA, y explica brevemente para que crees que la usan.

---

## Sesion 2: Tipos de IA y casos reales en Ecuador (45 min)

### Teoria

No toda la inteligencia artificial es lo mismo. Hablar de "IA" como si fuera una sola tecnologia es como hablar de "vehiculos" sin distinguir entre una bicicleta, un camion de carga y un avion. Todos se mueven, pero son muy distintos en como funcionan y para que sirven.

Para el profesional practico, lo mas util es entender tres categorias: IA generativa, IA predictiva e IA de clasificacion. Cada una resuelve tipos de problemas distintos y tiene usos muy especificos.

**IA Generativa: el que crea**

La IA generativa es la que produce contenido nuevo: texto, imagenes, audio, video, codigo. Es el tipo mas visible en los ultimos años porque ChatGPT, DALL-E, Midjourney y Claude pertenecen a esta categoria.

Como funciona (sin matematicas): aprende los patrones de como se construyen textos o imagenes validos, y luego genera nuevos contenidos que siguen esos mismos patrones. No copia. Crea. Pero crea basandose en lo que aprendio, no en comprension real.

Casos de uso practicos en Ecuador:

Un contador en Quito puede pedirle a ChatGPT que le redacte la explicacion de una diferencia tributaria para enviarle a un cliente, usando lenguaje simple. Le da el contexto tecnico y el modelo lo convierte en prosa clara. Ahorra 30 minutos de redaccion.

Un abogado en Guayaquil puede pedirle que genere un primer borrador de clausulas contractuales estandar para un contrato de arrendamiento, especificando que se rija por el Codigo Civil ecuatoriano. Le da una base que el luego revisa y ajusta. No reemplaza su criterio, le da un punto de partida.

Un gerente de recursos humanos puede pedirle que redacte cinco variaciones de una descripcion de cargo para publicar en diferentes plataformas. En cinco minutos tiene opciones que antes le tomaban una hora.

La clave de la IA generativa es que te ayuda con la primera version, con la estructura, con el volumen. El criterio profesional sigue siendo tuyo.

**IA Predictiva: el que anticipa**

La IA predictiva analiza datos historicos para proyectar que va a pasar en el futuro, o que es probable dado un conjunto de condiciones presentes. Es la IA que mas dinero genera para las empresas porque convierte datos en decisiones.

Casos reales en Ecuador y LatAm:

Banco Guayaquil y otras instituciones financieras ecuatorianas usan modelos predictivos para calcular el score crediticio en segundos. El modelo analiza cientos de variables (historial de pagos, nivel de ingresos declarado, comportamiento de consumo, zona geografica) y predice la probabilidad de que ese cliente pague o no. Lo que antes requeria dias de analisis manual ahora ocurre en el tiempo que tarda el oficial de credito en hacer el cafe.

Las cadenas de supermercados como Supermaxi o Tia usan IA predictiva para gestion de inventario. El modelo predice cuantas unidades de cada producto se van a vender la proxima semana, considerando dia de la semana, estacionalidad, dias festivos, clima, campanas promocionales activas. Esto reduce el desperdicio de perecederos y evita los desabastecimientos.

En salud publica, el Ministerio de Salud de Ecuador ha explorado modelos para predecir brotes de dengue y otras enfermedades vectoriales cruzando datos de temperatura, humedad, reportes previos y movimiento de poblacion. La prediccion temprana permite preventivo antes del brote, no respuesta reactiva despues.

**IA de Clasificacion: el que organiza**

La clasificacion es probablemente el tipo de IA mas antiguo y mas ampliamente desplegado. Un clasificador toma un elemento (un correo, una imagen, un texto, una transaccion) y lo asigna a una categoria predefinida.

El filtro de spam de tu correo electronico es un clasificador: toma cada correo entrante y decide si es legitimo o spam. El sistema de reconocimiento facial de tu banco movil es un clasificador: toma tu foto y decide si eres tu o no. La herramienta que detecta tumores en radiografias es un clasificador: toma una imagen medica y decide si hay anomalia o no.

Casos en Ecuador:

El sistema de gestion documental de varias entidades publicas ecuatorianas (incluyendo algunos procesos del Registro Civil) usa clasificacion automatica para asignar documentos entrantes al departamento correcto sin que un funcionario tenga que leer cada uno manualmente.

Empresas de e-commerce como DeUna o plataformas de marketplace usan clasificacion para moderar automaticamente los listados de productos, identificando aquellos que violan politicas de uso (productos prohibidos, fotos inapropiadas, precios sospechosos).

**Historia rapida: de Turing a ChatGPT en 5 minutos**

1950: Alan Turing, matematico britanico, propone la pregunta "puede una maquina pensar?" y disena el Test de Turing, una prueba conceptual para evaluar si una maquina puede conversar de forma indistinguible de un humano. Es el punto de partida filosofico del campo.

1956: Se acuna oficialmente el termino "inteligencia artificial" en una conferencia en Dartmouth College. Comienza la primera ola de entusiasmo, con promesas de que en 20 años habra maquinas tan inteligentes como humanos.

1970s-1980s: Los "inviernos de la IA". La tecnologia no avanza tan rapido como se prometio. Los fondos se cortan. El campo casi desaparece del mapa publico.

1997: La computadora Deep Blue de IBM derrota al campeon mundial de ajedrez Garry Kasparov. La noticia sacude al mundo pero el impacto practico es limitado porque el sistema solo sabe jugar ajedrez.

2012: Un hito tecnico silencioso pero crucial. Un equipo de la Universidad de Toronto gana una competencia de reconocimiento de imagenes con un margen tan amplio que redefine lo que es posible. Usan una red neuronal profunda entrenada en GPUs. Este momento marca el inicio de la era moderna de la IA.

2016: AlphaGo de DeepMind derrota al campeon mundial de Go, un juego considerado mucho mas complejo que el ajedrez y que se creia inaccesible para las maquinas durante decadas. Lo logra con aprendizaje por refuerzo, una tecnica donde el sistema aprende jugando contra si mismo millones de veces.

2017: Google publica el paper "Attention is All You Need" describiendo la arquitectura Transformer. Este paper, que pocos fuera del mundo academico leyeron, es la base tecnologica de practicamente todos los modelos de lenguaje modernos, incluyendo GPT y Claude.

2020: OpenAI lanza GPT-3. Por primera vez, un modelo de lenguaje puede mantener conversaciones coherentes, redactar textos convincentes y resolver problemas complejos con instrucciones en lenguaje natural. Los investigadores quedan impresionados. El publico general todavia no lo conoce.

2022, noviembre: OpenAI lanza ChatGPT al publico general. En 5 dias tiene 1 millon de usuarios. En 2 meses, 100 millones. Es el producto de mas rapido crecimiento en la historia de internet. El mundo se divide entre los que lo prueban ese mes y los que lo ignoran pensando que es "otro chatbot".

2023-2024: La competencia explota. Google lanza Gemini. Anthropic lanza Claude. Meta abre sus modelos. Microsoft integra IA en toda la suite de Office. La IA pasa de ser una curiosidad tecnica a ser una herramienta de trabajo cotidiana para millones de profesionales.

2025-2026: Los modelos de razonamiento aparecen. La IA ya no solo responde, sino que "piensa" paso a paso antes de dar una respuesta, con resultados dramaticamente mejores en problemas complejos. Comienzan los agentes: sistemas de IA que no solo responden sino que toman acciones, navegan internet, escriben codigo y lo ejecutan, envian correos. La curva de adopcion profesional se acelera.

---

### Ejercicio practico

**Ejercicio 1.2: Clasifica los casos de IA de tu sector**

Tiempo: 15 minutos

Paso 1. Escribe el nombre de tu profesion o sector (contador, medico, abogado, arquitecto, gerente de ventas, etc.)

Paso 2. Piensa en tres tareas repetitivas que realizas cada semana. No tienen que ser las mas complejas. Pueden ser las mas aburridas: redactar correos de seguimiento, buscar jurisprudencia, preparar resumenes, actualizar reportes, responder preguntas frecuentes de clientes.

Paso 3. Para cada tarea, decide a que tipo de IA perteneceria una solucion: generativa (crear contenido), predictiva (anticipar resultados) o clasificacion (organizar informacion).

Paso 4. Escribe una sola frase describiendo como cada tipo de IA podria ayudarte en esa tarea especifica.

Este ejercicio es la base de todo el curso. Los modulos especificos de tu profesion profundizaran exactamente en estas areas.

---

### Verificacion

1. Un medico de un hospital publico en Cuenca dice que en la salud "la IA no sirve porque cada paciente es diferente y no se puede generalizar". Usando lo que aprendiste sobre los tipos de IA, como responderas?

2. Describe un ejemplo de IA predictiva que podria ser util en tu sector, que no haya sido mencionado en la clase.

3. Cual es la diferencia principal entre IA generativa e IA de clasificacion? Da un ejemplo de cada una.

---

## Sesion 3: Mitos vs realidad y tu primera conversacion con IA (90 min)

### Teoria

Hay pocos temas donde la brecha entre lo que la gente cree y lo que realmente ocurre sea tan amplia como en inteligencia artificial. Esa brecha viene de dos fuentes: el hype del marketing tecnologico, que exagera capacidades para vender, y el miedo mediatico, que exagera riesgos para generar clics. Ninguno de los dos te sirve para tomar decisiones profesionales buenas.

Vamos a revisar los seis mitos mas comunes y lo que la evidencia real dice sobre cada uno.

**Mito 1: "La IA va a reemplazar mi trabajo"**

La version extrema de este mito dice que en diez años no va a haber contadores, abogados, medicos ni profesores porque la IA lo hara todo. Esta version es falsa.

La version honesta es mas matizada y mas importante: la IA va a cambiar lo que hacen los profesionales, igual que la computadora personal cambio lo que hacia un contador en los años 90, o como el correo electronico cambio lo que hacia una secretaria. Algunos tipos de trabajo van a desaparecer o reducirse significativamente. Otros tipos de trabajo van a surgir. Y muchos trabajos van a cambiar en su contenido sin desaparecer.

Lo que la evidencia muestra hasta ahora es que la IA esta automatizando tareas especificas dentro de los trabajos, no los trabajos completos. Un contador todavia necesita criterio para interpretar una situacion tributaria compleja, negociar con el SRI, entender el contexto del cliente y asumir responsabilidad legal. Lo que puede automatizar son las partes del trabajo que implican procesar documentos repetitivos, generar borradores estandar y buscar informacion en bases de datos.

El riesgo real no es que la IA reemplace a los profesionales. Es que los profesionales que saben usar IA reemplacen a los que no saben. Esa es la tension correcta.

**Mito 2: "La IA lo sabe todo y siempre tiene razon"**

Este mito es peligroso porque lleva a profesionales a usar resultados de IA sin verificarlos. Los modelos de lenguaje como ChatGPT o Claude tienen una limitacion estructural llamada "alucinacion": el sistema genera texto que suena correcto y confiado, pero que puede ser completamente inventado.

Un medico en Buenos Aires uso ChatGPT para buscar referencias de un medicamento y recibio citas de estudios cientificos que no existian: autores reales, revistas reales, años reales, pero titulos y contenidos completamente inventados. Por suerte verifico antes de usarlos.

Un abogado en Colombia pidio a ChatGPT jurisprudencia de la Corte Suprema y recibio numeros de sentencias que no existian. Los presento en un escrito y el juez los encontro todos falsos.

La IA no sabe cuando no sabe. No dice "no tengo informacion sobre esto". Dice algo. Y lo dice con el mismo tono confiado con el que dice algo correcto. Este es el riesgo mas importante para el uso profesional y lo trabajaremos en detalle en los modulos T-03 y T-04.

**Mito 3: "La IA entiende y razona como un humano"**

Los modelos de lenguaje son extraordinariamente buenos imitando el razonamiento humano, pero no razonan de la misma manera. No tienen experiencias, emociones, cuerpo, contexto vital. No "entienden" en el sentido filosofico. Producen texto estadisticamente probable dado el contexto de la conversacion.

Esta distincion importa porque hay cosas que un humano hace naturalmente y que a la IA le cuesta: sentido comun basico sobre el mundo fisico, razonamiento causal en situaciones nuevas, juicio moral en contextos ambiguos, creatividad genuinamente original (no recombinacion de patrones).

Lo que la IA hace extraordinariamente bien es diferente: procesar grandes cantidades de texto rapidamente, mantener consistencia de estilo y estructura, generar multiples variaciones, sintetizar informacion de muchas fuentes, traducir entre registros (de tecnico a simple, de espanol a ingles, de formal a casual).

**Mito 4: "Usar IA es hacer trampa"**

Este mito viene principalmente del mundo educativo, donde hay debate legitimo sobre el uso de IA en evaluaciones. Pero en el contexto profesional, la logica es diferente.

Ningun profesional considera "trampa" usar Excel para calcular en lugar de hacerlo a mano. Nadie considera "trampa" usar Google Maps en lugar de memorizar las calles. Nadie considera "trampa" usar un procesador de texto con corrector ortografico en lugar de escribir a mano.

La IA es otra herramienta. El criterio de si su uso es etico en un contexto profesional depende de la transparencia (declarar cuando un documento fue asistido por IA cuando eso es relevante) y de la responsabilidad (quien firma el trabajo sigue siendo responsable de su contenido).

Lo que si puede considerarse problematico es presentar trabajo de IA como si fuera tuyo en contextos donde eso no es aceptable, o delegar a la IA decisiones que requieren responsabilidad profesional que no se puede transferir.

**Mito 5: "La IA es solo para gente de tecnologia"**

Este es quizas el mito mas limitante porque es el que impide a los profesionales no tecnicos empezar. La realidad es que ChatGPT y herramientas similares fueron especificamente disenadas para ser usadas en lenguaje natural, sin necesidad de saber programacion.

Si puedes escribir un correo electronico, puedes usar ChatGPT. Si puedes formular una pregunta, puedes obtener valor de estas herramientas. La curva de aprendizaje es real pero es mucho mas corta de lo que la mayoria imagina.

Este curso existe precisamente para demostrar ese punto.

**Mito 6: "La IA es siempre objetiva porque es una maquina"**

Este es el mito mas peligroso para la sociedad, aunque el menos intuitivo. La IA aprende de datos humanos, y los datos humanos contienen todos los sesgos de la sociedad que los genero.

Un sistema de IA entrenado para predecir reincidencia criminal en Estados Unidos aprendo que la raza era un predictor, reflejando las desigualdades del sistema judicial en los datos historicos. El resultado: recomendaba penas mas largas para personas de ciertas etnias, perpetuando la misma desigualdad que estaba en los datos.

Un sistema de reclutamiento automatico de una empresa tecnologica grande fue entrenado con los CVs de sus empleados historicos, que eran mayoritariamente hombres. Aprendio a penalizar CVs que mencionaban palabras asociadas con mujeres. La empresa tuvo que desactivarlo.

Estos no son casos teoricos. Son documentados. La IA amplifica los patrones que encuentra en los datos, buenos y malos. El criterio humano es necesario para detectar cuando esos patrones son injustos.

---

### Tu primera conversacion con ChatGPT

Ahora vamos a pasar de la teoria a la practica. Si aun no tienes cuenta en ChatGPT, el ejercicio te guia paso a paso para crearla.

**Ejercicio 1.3: Primera conversacion profesional**

Tiempo: 30 minutos

**Parte A: Configuracion (5 min)**

1. Ve a chat.openai.com desde tu navegador
2. Haz clic en "Sign up" (registrarse)
3. Puedes registrarte con tu correo de Gmail o con cualquier correo electronico
4. La cuenta gratuita es suficiente para este ejercicio
5. Una vez dentro, veras una pantalla simple con un campo de texto en la parte inferior. Ahi escribiras tus mensajes.

**Parte B: La primera prueba (5 min)**

Escribe este mensaje exactamente:

"Hola. Soy [tu profesion] en Ecuador. Necesito que me expliques, en terminos simples que yo pueda compartir con mis clientes, que es la inteligencia artificial y como puede beneficiarme en mi trabajo. Usa un tono profesional pero accesible, sin jerga tecnica. Maximo tres parrafos."

Lee la respuesta. Observa:
- Como adapto el tono a la instruccion que le diste
- Que tan especifica fue con tu profesion
- Si hay algo incorrecto o que no se aplica a Ecuador

**Parte C: El refinamiento (10 min)**

Ahora escribe un mensaje de seguimiento. No empieces una conversacion nueva. Responde en la misma ventana:

"Gracias. Ahora necesito algo mas especifico. Dame tres ejemplos de tareas concretas de [tu profesion] que se puedan hacer mas rapido con herramientas de IA como la tuya. Que sean ejemplos realistas para Ecuador, no para Estados Unidos o Europa."

Observa como el sistema recuerda el contexto de la conversacion anterior y como ajusta la respuesta.

**Parte D: La reflexion (10 min)**

Escribe en papel o en un documento:
- Que te sorprendio de la respuesta?
- Que estuvo bien?
- Que estuvo mal o inexacto?
- Que pregunta adicional tienes sobre tu profesion especifica que quisieras explorar?

Este documento de reflexion te sera util como punto de comparacion cuando termines el curso.

---

### Verificacion

1. Un colega te dice que no va a aprender IA porque "en cinco años va a hacer todo el trabajo por nosotros de todas formas, asi que para que molestarse". Identificas al menos dos mitos en esa afirmacion. Cuales son y como los refutarias?

2. Describe en una sola oracion la diferencia mas importante entre lo que la IA puede hacer bien y lo que todavia requiere criterio humano, segun lo que aprendiste hoy.

3. Despues de tu primera conversacion con ChatGPT, escribe una sola cosa que te llamo la atencion, positiva o negativa.

---

## Recursos adicionales

**Herramientas para explorar:**
- ChatGPT: https://chat.openai.com (cuenta gratuita disponible)
- Claude: https://claude.ai (cuenta gratuita disponible)
- Gemini: https://gemini.google.com (integrado con cuenta Google)

**Lecturas en espanol:**
- "Inteligencia Artificial: Una Guia para Seres Pensantes" - Melanie Mitchell (traduccion disponible)
- Blog de IA del MIT Technology Review en espanol: https://www.technologyreview.es/
- Reportes de CEPAL sobre IA en America Latina: https://www.cepal.org (buscar "inteligencia artificial")

**Videos recomendados (subtitulos en espanol):**
- "But what is a neural network?" - 3Blue1Brown (YouTube, subtitulos disponibles)
- "The A.I. Dilemma" - Center for Humane Technology (YouTube)

**Contexto Ecuador:**
- Resolucion de la Superintendencia de Bancos sobre uso de IA en servicios financieros (SB-DTL-2023)
- Plan Nacional de Gobierno Digital Ecuador 2025-2027 (Ministerio de Telecomunicaciones)
- SENESCYT: oferta academica en tecnologias emergentes en Ecuador

---

*Modulo T-01 completado. Siguiente: T-02 - ChatGPT y Claude: uso profesional (4 horas)*
