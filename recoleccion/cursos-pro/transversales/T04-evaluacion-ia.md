# Modulo T-04: Evaluacion critica de resultados de IA
**Duracion:** 2h | **Nivel:** Todos | **Prerequisitos:** T-01, T-02, T-03

---

## Objetivos de aprendizaje
Al finalizar este modulo, el profesional sera capaz de:
1. Explicar que son las alucinaciones en IA y por que ocurren estructuralmente, no como fallas aleatorias
2. Aplicar al menos tres tecnicas concretas para verificar informacion generada por IA antes de usarla profesionalmente
3. Reconocer el sesgo algoritmico en ejemplos reales de contratacion, credito y salud, y detectar cuando podria estar presente en sus herramientas
4. Aplicar el Framework CRITICO (5 preguntas) como protocolo de evaluacion estandar antes de usar cualquier resultado de IA
5. Articular con claridad su responsabilidad profesional como firmante de documentos asistidos por IA

---

## Sesion 1: Alucinaciones, sesgo y como verificar (60 min)

### Teoria

El modulo anterior te enseno a proteger los datos que entran a la IA. Este modulo te enseña a evaluar lo que sale. Son dos caras de la misma moneda. Un profesional que alimenta a la IA con datos seguros pero usa sus respuestas sin criterio esta expuesto a riesgos igualmente serios.

**Que son las alucinaciones y por que ocurren**

El termino "alucinacion" en el contexto de IA describe cuando un modelo genera informacion falsa o fabricada, presentada con el mismo nivel de confianza que la informacion correcta. No es una metafora exagerada. El modelo literalmente "ve" algo que no esta ahi, lo describe con detalle y no puede distinguir por si mismo que lo que describe no existe.

Para entender por que ocurre, recuerda como funciona un modelo de lenguaje: predice cual es el texto mas probable que sigue dado el texto que recibio. El modelo no tiene una base de datos de hechos verificados que consulta. Genera el siguiente token (fragmento de palabra) basado en patrones estadisticos de lo que suele seguir a los tokens anteriores en su entrenamiento.

Cuando el modelo no tiene informacion real sobre algo, no dice "no se". Porque "no se" es estadisticamente inusual en el tipo de texto con el que fue entrenado (articulos, libros, documentos academicos, responden, no se rinden). En cambio, genera el tipo de respuesta que estadisticamente seria plausible: una respuesta detallada, confiante, especifica.

Este no es un bug que OpenAI o Anthropic vayan a corregir completamente. Es una caracteristica de la arquitectura actual de estos modelos. Los modelos nuevos alucinar menos que los viejos, pero alucinan.

**Por que las alucinaciones son especialmente peligrosas para profesionales**

Para un estudiante que usa ChatGPT para hacer una tarea, una alucinacion puede resultar en una mala nota. Para un profesional, las consecuencias son potencialmente mucho mas serias:

Un abogado que presenta jurisprudencia inventada ante un tribunal puede enfrentar sanciones disciplinarias del Colegio de Abogados y comprometer el caso de su cliente.

Un medico que usa IA para verificar interacciones medicamentosas y el modelo alucina una interaccion que no existe (o peor, omite una que si existe) puede danar a un paciente.

Un contador que usa cifras estadisticas inventadas por IA en un informe de auditoria compromete su credencial de CPA y la confianza del cliente.

Un arquitecto que usa datos normativos generados por IA para un calculo estructural y esos datos son incorrectos pone en riesgo una obra.

El denominador comun: el profesional firma. El profesional asume la responsabilidad. La IA no.

**Los cinco tipos mas comunes de alucinaciones**

Tipo 1: Citas bibliograficas inventadas
El mas documentado. El modelo genera referencias con formato perfecto (autor, año, revista, DOI) donde todo es real excepto el contenido que describe. Las revistas existen, los autores son reales, los años son plausibles. Solo que ese estudio especifico no existe.

Como detectarlo: busca el DOI en scholar.google.com o en pubmed.ncbi.nlm.nih.gov. Si no aparece exactamente, la cita es sospechosa.

Tipo 2: Estadisticas sin fuente verificable
El modelo menciona porcentajes, cifras y rankings con precision aparente ("el 73% de las empresas ecuatorianas...") que no tienen fuente verificable.

Como detectarlo: pide siempre la fuente original. Busca esa fuente directamente. Si no puedes encontrarla, no uses la estadistica.

Tipo 3: Legislacion incorrecta o desactualizada
El modelo puede citar articulos de ley con numeros incorrectos, mezclar legislacion de distintos paises, o referenciar normas que fueron reformadas.

Como detectarlo: siempre verifica en la fuente oficial (Registro Oficial, Lexis para Ecuador). Nunca cites legislacion ecuatoriana que no hayas verificado directamente.

Tipo 4: Hechos historicos con detalles incorrectos
El modelo puede tener los hechos principales correctos pero los detalles (fechas, nombres de personas involucradas, cifras exactas) incorrectos.

Como detectarlo: los hechos historicos de bajo perfil (no los grandes eventos mundiales, sino los especificos del sector o del pais) son especialmente vulnerables a errores de detalle.

Tipo 5: Informacion de personas y empresas
El modelo puede confundir personas con nombres similares, mezclar informacion de diferentes personas o empresas, o directamente inventar datos biográficos o corporativos.

Como detectarlo: nunca uses datos biograficos o corporativos generados por IA sin verificarlos en fuentes primarias (sitio web oficial, LinkedIn verificado, registro de la Superintendencia de Companiias).

**Como verificar informacion generada por IA: tecnicas concretas**

Tecnica 1: La prueba de la fuente primaria
Cualquier dato factual (estadistica, cita legal, referencia bibliografica, dato historico) debe poder rastrearse a una fuente primaria. Si el modelo te da un dato, preguntale: "Dame la fuente exacta de este dato, con URL si es posible." Luego busca esa fuente directamente.

Si la fuente existe y dice lo que el modelo dijo, puedes usar el dato.
Si la fuente existe pero no dice exactamente eso, no uses el dato.
Si no puedes encontrar la fuente, trata el dato como no verificado y no lo uses en documentos profesionales.

Tecnica 2: Verificacion cruzada entre herramientas
Si un dato es importante, verificalo con al menos dos herramientas diferentes (ChatGPT y Claude, por ejemplo). Si ambas coinciden, es mas probable que sea correcto (aunque no garantizado). Si difieren, investiga en la fuente primaria.

Tecnica 3: Pedir que el modelo marque su incertidumbre
Como vimos en T-02, puedes pedir al modelo que marque las partes de su respuesta donde tiene menor certeza. El prompt: "Despues de tu respuesta, agrega una seccion 'Incertidumbre' donde listes los puntos que debo verificar de forma independiente." No siempre el modelo detecta su propia incertidumbre, pero en muchos casos si la señala.

Tecnica 4: Triangulacion rapida
Para afirmaciones factuales importantes, usa Google, Perplexity AI (que cita fuentes) o un buscador academico para verificar rapidamente. Esto toma 2-3 minutos y puede salvarte de un error serio.

Tecnica 5: La pregunta del experto escéptico
Antes de usar una respuesta de IA en un documento profesional, hazte esta pregunta: "Si un experto en este tema leyera esto, identificaria errores?" Si la respuesta es posiblemente si, revisa.

**Sesgo algoritmico: ejemplos reales**

El sesgo algoritmico es diferente de las alucinaciones. No es informacion falsa. Es un patron sistematico de resultados desiguales que afecta a ciertos grupos de personas de forma injusta, reflejando los sesgos presentes en los datos con que el modelo fue entrenado.

Caso 1: Sesgo en contratacion - Amazon, 2018

Amazon desarrollo internamente un sistema de IA para analizar CVs y puntuar candidatos automaticamente. El sistema fue entrenado con CVs de empleados contratados durante los 10 años anteriores. El problema: los empleados contratados habian sido mayoritariamente hombres.

El sistema aprendio a penalizar CVs que contenian palabras tipicamente asociadas con mujeres: menciones a haber participado en clubes de mujeres en tecnologia, graduadas de universidades femeninas, e incluso el verbo "ejecuto" conjugado de cierta manera. Amazon tuvo que desactivar el sistema cuando descubrio el patron.

Implicacion para Ecuador: si una empresa en Ecuador implementa un sistema similar entrenado con datos historicos de contratacion, podria replicar y amplificar patrones de discriminacion existentes de genero, etnia, region geografica o nivel socioeconomico, sin que nadie lo diseñara con esa intencion.

Caso 2: Sesgo en credito - Estados Unidos, 2019-2021

Una tarjeta de credito nueva (Apple Card, operada por Goldman Sachs) fue acusada por usuarios de asignar limites de credito drasticamente diferentes entre esposos, siendo el limite del hombre consistentemente mayor incluso cuando la mujer tenia mejor historial crediticio. Steve Wozniak, cofundador de Apple, publico que su limite era 10 veces el de su esposa.

La investigacion encontro que el modelo de scoring habia aprendido patrones de datos historicos donde las mujeres habian recibido menor credito (reflejo de decadas de discriminacion financiera de genero documentada), y estaba perpetuando ese patron.

Implicacion para Ecuador: los sistemas de scoring crediticio de instituciones financieras ecuatorianas que usan IA podrian tener sesgos similares si fueron entrenados con datos historicos que reflejan discriminaciones pasadas.

Caso 3: Sesgo en salud - Estados Unidos, 2019 (Obermeyer et al., Science)

Un estudio publicado en la revista Science analizo un algoritmo ampliamente usado en hospitales estadounidenses para identificar a pacientes que necesitan programas de manejo de enfermedades cronicas. El algoritmo usaba el costo medico historico como proxy para la necesidad de atencion medica.

El problema: los pacientes negros en Estados Unidos habian recibido historicamente menos atencion medica que pacientes blancos con igual grado de enfermedad, generalmente por barreras de acceso y discriminacion sistemica. Por lo tanto, gastaban menos en salud. El algoritmo interpretaba menor gasto como menor necesidad de atencion, y sistematicamente subenviaba a pacientes negros a programas de manejo intensivo.

En terminos concretos: para igual nivel de gravedad de enfermedad, el algoritmo marcaba a los pacientes blancos como de mayor necesidad que a los negros.

Implicacion para Ecuador: en un sistema de salud publica con inequidades documentadas de acceso por region, etnia y nivel socioeconomico, cualquier algoritmo entrenado con datos historicos de atencion medica podria replicar y amplificar esas inequidades.

Caso 4: Sesgos geograficos en IA generativa para Ecuador

Este es el mas inmediato y practico para los profesionales ecuatorianos. Los modelos de lenguaje grandes como ChatGPT o Claude fueron entrenados con mucho mas texto en ingles y sobre el contexto de Estados Unidos y Europa que sobre Ecuador o LatAm.

Consecuencias practicas que debes conocer:
- Cuando pides ejemplos de casos legales, el modelo tiende a dar ejemplos de jurisprudencia estadounidense o espanola, no ecuatoriana
- Cuando pides datos de mercado, las cifras que genera tienden a reflejar mercados desarrollados
- Cuando pides mejores practicas en salud publica, los protocolos que sugiere pueden no estar adaptados a la realidad del sistema de salud ecuatoriano
- Cuando pides informacion cultural o sociologica, los supuestos tacitos reflejan contextos anglosajones

Este sesgo no se elimina, se compensa: siempre especifica el contexto ecuatoriano en tus prompts y verifica que la respuesta sea aplicable a tu realidad.

---

### Ejercicio practico

**Ejercicio 4.1: Caza de alucinaciones**

Tiempo: 25 minutos

Paso 1. Elige un tema de tu campo profesional sobre el que tengas conocimiento solido (una ley que conoces bien, un proceso tecnico que dominas, un hecho historico de tu sector que has estudiado).

Paso 2. Pide a ChatGPT o Claude que te de informacion detallada sobre ese tema. Incluye en tu prompt: "Dame estadisticas, ejemplos y si es posible referencias a estudios o normativas especificas."

Paso 3. Lee la respuesta critica y detalladamente. Identifica:
- Afirmaciones que sabes que son correctas
- Afirmaciones que sabes que son incorrectas
- Afirmaciones que no puedes confirmar ni desmentir de memoria

Paso 4. Para las afirmaciones que no puedes confirmar, busca la fuente primaria. Registra cuantas resultaron correctas y cuantas fueron alucinaciones o imprecisiones.

Paso 5. Calcula tu "tasa de error" en esa respuesta y reflexiona: si hubieras usado esa respuesta sin verificar, cual seria el impacto profesional?

---

### Verificacion

1. Por que los modelos de lenguaje alucinan? Explica el mecanismo en dos o tres oraciones sin usar jerga tecnica.

2. Describe el Caso Amazon de sesgo en contratacion. Cual es la implicacion directa para un jefe de RRHH en Ecuador que considera implementar un sistema de IA para pre-filtrar CVs?

3. Cuales son las tres tecnicas de verificacion de informacion de IA que encontraste mas utiles y por que?

---

## Sesion 2: Framework CRITICO y responsabilidad profesional (60 min)

### Teoria

El conocimiento sobre alucinaciones y sesgo es util, pero no es suficiente si no tienes un proceso concreto que puedas aplicar rapidamente en tu trabajo diario. Esta sesion te da ese proceso: el Framework CRITICO, cinco preguntas que se convierten en habito.

**El Framework CRITICO: 5 preguntas antes de usar un resultado de IA**

Este framework esta disenado para ser aplicable en 2-5 minutos, no para ralentizar tu trabajo. La velocidad viene con la practica. Despues de usarlo 20 veces, se vuelve automatico.

Las cinco preguntas forman el acronimo CRITICO:

**C - Confirmable: puedo verificar este dato en una fuente independiente?**

Esta pregunta se aplica a cada afirmacion factual en la respuesta. No a cada palabra, sino a cada dato que podria influir en una decision profesional o aparecer firmado en un documento.

Si la respuesta es si y la verificacion confirma el dato: procede.
Si la respuesta es si pero no puedes encontrar la fuente: trata el dato como no verificado.
Si la respuesta es no (no hay forma de verificarlo): es criterio tuyo si el riesgo de usar el dato es aceptable o no.

**R - Reciente: la informacion es vigente para mi contexto?**

Fecha de corte de conocimiento, cambios normativos recientes, actualizaciones de mercado. Cualquier dato que cambia con frecuencia necesita verificacion de vigencia.

Para contextos regulatorios en Ecuador: legislacion tributaria (el SRI actualiza reglamentos frecuentemente), normativa laboral (especialmente LOGT y sus reformas), regulaciones del sector financiero, normativa de construccion y urbanismo.

**I - Independiente: el modelo tiene sesgo en esta respuesta?**

Preguntate: hay algun sesgo posible en como se formularon el prompt o en los datos de entrenamiento del modelo que podria inclinar la respuesta en una direccion?

Si tu prompt pedia argumentos para una posicion especifica, el modelo los dio. Pero eso no significa que no haya argumentos igualmente validos para la posicion contraria. La respuesta es parcial por diseño.

Si el tema involucra grupos de personas (genero, etnia, nivel socioeconomico, region geografica), considera si el modelo podria tener sesgo de entrenamiento sobre esos grupos.

**T - Trazable: puedo rastrear de donde viene esta informacion?**

Para documentos profesionales formales (contratos, informes, dictamenes, reportes de auditoria), toda afirmacion factual debe ser trazable a una fuente que puedas citar. Si la IA genera algo que no puedes trazar, no lo uses en esos documentos, o marcalo claramente como estimacion o criterio propio no respaldado por fuente verificada.

**I - Integra: la respuesta es coherente internamente y con lo que ya se?**

Lee la respuesta buscando contradicciones internas. Tambien verifica si algo contradice tu conocimiento previo experto sobre el tema. Cuando hay contradiccion entre el resultado de la IA y tu conocimiento profesional, investiga quien tiene razon antes de proceder. A veces el modelo tiene informacion mas actualizada que tu. A veces alucina. Solo la verificacion resuelve la duda.

**C - Contextual: la respuesta aplica a mi contexto especifico (Ecuador, mi sector, mi cliente)?**

La pregunta final es sobre relevancia. La respuesta puede ser factualmente correcta para otro pais o contexto y completamente inaplicable al tuyo.

Verifica: menciona Ecuador o LatAm? Considera la normativa local especifica? Toma en cuenta las particularidades culturales, economicas o institucionales de tu contexto?

Si no: pide una version adaptada al contexto. "Ajusta esta respuesta para el contexto ecuatoriano, considerando la normativa local y la realidad del mercado."

**Como aplicar el framework en la practica**

El framework no requiere que hagas una lista formal en cada uso. Despues de un periodo de practica consciente, se vuelve una verificacion mental rapida que tarda segundos en las partes que no generan alerta, y se profundiza solo donde hay duda.

Ejemplo rapido de aplicacion:

Situacion: Soy arquitecto y uso Claude para obtener los requisitos de resistencia sismica de una edificacion de cinco pisos en Quito segun la norma ecuatoriana.

C (Confirmable): Los datos normativos especificos deben verificarse en la NEC (Norma Ecuatoriana de la Construccion). No los uso sin verificacion.

R (Reciente): La NEC ha tenido actualizaciones. Verifico que los datos correspondan a la version vigente.

I (Independiente): El modelo puede tener sesgo hacia normas de otros paises mas documentados en internet. Confirmo que la referencia es especificamente a la NEC ecuatoriana.

T (Trazable): Los articulos y valores especificos deben poder referenciarse directamente a la NEC. Si no puedo ubicarlos, no los uso en calculos estructurales.

I (Integra): Comparo con lo que recuerdo de mi formacion y practice. Hay algo que suena diferente a lo que se?

C (Contextual): La norma sismica de Ecuador tiene particularidades para Quito (zona de alto riesgo sismico). Confirmo que la respuesta considera la zonificacion correcta.

Este proceso para este caso especifico toma 3-5 minutos. El costo de no hacerlo podria ser una obra con calculos estructurales basados en normas incorrectas.

**Criterio profesional: cuando confiar y cuando NO**

Existe una tentacion real de usar la IA como oraculo: le preguntas, responde, usas la respuesta. Esta tentacion aumenta cuando la respuesta es larga, detallada y suena experta. El volumen y la precision aparente pueden generar falsa confianza.

Situaciones donde la confianza puede ser mayor (con verificacion basica):
- Tareas de redaccion y estilo donde el criterio factual no es critico (borradores de comunicaciones, descripcion de procesos generales, generacion de ideas para brainstorming)
- Explicaciones de conceptos generales bien documentados en el idioma del modelo
- Traducciones y adaptaciones de tono
- Estructura y organizacion de documentos

Situaciones donde el criterio critico es obligatorio:
- Cualquier dato factual especifico que aparecera firmado en un documento profesional
- Legislacion, normas tecnicas, reglamentos (siempre verificar en fuente oficial)
- Cifras estadisticas que no vienen con fuente verificable
- Informacion medica con consecuencias clinicas
- Jurisprudencia o precedentes legales
- Datos biometricos o biográficos de personas especificas
- Cualquier informacion sobre Ecuador que el modelo deberia conocer pero que es especifica y reciente

**Responsabilidad profesional: tu firma, tu responsabilidad**

Esta es la realidad legal y etica que no cambia independientemente de que herramienta usaste para preparar un documento:

Cuando un contador firma una declaracion tributaria, asume responsabilidad por su contenido ante el SRI y ante el cliente. La declaracion puede haber sido preparada con ayuda de IA, con ayuda de un asistente, o manualmente. La firma es la firma.

Cuando un abogado presenta un escrito ante un tribunal, asume responsabilidad por las afirmaciones de hecho y de derecho que contiene. Aunque ChatGPT haya redactado el primer borrador.

Cuando un medico emite un informe clinico, asume responsabilidad profesional por el diagnostico y las recomendaciones. Aunque Claude haya analizado los datos de laboratorio.

Cuando un arquitecto firma un plano estructural, asume responsabilidad tecnica y legal por los calculos. Aunque Gemini haya sugerido la metodologia.

Ningun colegio profesional, ninguna corte de justicia, ningun regulador en Ecuador (ni en ningun pais del mundo a la fecha) acepta "la IA me lo dijo" como defensa ante un error profesional. La IA es una herramienta, como una calculadora o un procesador de texto. La responsabilidad es del profesional que la usa.

Esto no es un argumento para no usar IA. Es el argumento para usarla con criterio.

**El estandar profesional del uso de IA: lo que viene**

Los colegios profesionales de distintos sectores en el mundo estan comenzando a desarrollar guias eticas para el uso de IA. En Ecuador, algunos de estos procesos estan en curso o en planificacion:

El Colegio de Abogados del Ecuador ha emitido en 2025 sus primeras recomendaciones preliminares sobre transparencia en el uso de IA en escritos judiciales.

La Federacion Medica Ecuatoriana esta en proceso de desarrollar guias de uso de IA en practica clinica, especialmente para herramientas de diagnostico asistido.

El ICPEC (Instituto de Contadores) ha incluido el tema de IA en sus programas de educacion continua.

La tendencia global es hacia la obligacion de declarar el uso de IA en documentos profesionales cuando sea relevante, y hacia la responsabilidad aumentada del profesional que usa IA sin criterio suficiente.

Los profesionales que entienden como funciona la IA, sus limitaciones y su responsabilidad propia estan mejor posicionados para usar estas herramientas de forma que les beneficie, no que los exponga.

---

### Ejercicio practico

**Ejercicio 4.2: Aplicar el Framework CRITICO**

Tiempo: 25 minutos

Parte A: Seleccion de material (5 min)
Elige una de estas opciones:
- Una respuesta de IA que ya tengas guardada de ejercicios anteriores de este curso
- Una respuesta nueva: pide a ChatGPT o Claude un analisis o informe breve sobre algo relevante para tu profesion en Ecuador, con datos especificos

Parte B: Aplicacion del framework (15 min)
Para la respuesta elegida, aplica sistematicamente cada una de las cinco preguntas del Framework CRITICO. Registra tus respuestas por escrito:
- C (Confirmable): lista los datos que verificaste y el resultado
- R (Reciente): identifica si hay elementos que podrian estar desactualizados
- I (Independiente): hay sesgo posible en la formulacion o en el entrenamiento?
- T (Trazable): que elementos tienen fuente y cuales no?
- I (Integra): hay contradicciones internas o con tu conocimiento previo?
- C (Contextual): la respuesta aplica al contexto ecuatoriano especifico?

Parte C: Veredicto (5 min)
Basado en tu analisis, escribe:
- Que partes de la respuesta usarias directamente?
- Que partes requieren verificacion adicional antes de usarlas?
- Que partes no usarias y por que?
- Como habrias modificado el prompt para obtener una respuesta mas confiable desde el inicio?

---

### Verificacion

1. Explica el Framework CRITICO con tus propias palabras. Cual de las cinco preguntas consideras mas importante para tu profesion y por que?

2. Un jefe te presenta un informe de mercado de 15 paginas preparado "con ayuda de IA". El informe tiene estadisticas especificas, proyecciones y recomendaciones estrategicas. Que proceso de verificacion aplicarias antes de aprobar ese informe para uso interno?

3. Termina esta frase y desarrolla en dos parrafos: "La IA es una herramienta de apoyo profesional y no un sustituto del criterio profesional porque..."

---

## Recursos adicionales

**Para profundizar en alucinaciones:**
- "TruthfulQA: Measuring How Models Mimic Human Falsehoods" - Lin et al. (paper academico, buscar en arxiv.org)
- "Hallucination is Inevitable" - paper de 2024 (buscar en arxiv.org: "hallucination inevitable AI")
- Blog oficial de Anthropic sobre seguridad de IA: https://www.anthropic.com/research

**Para profundizar en sesgo algoritmico:**
- "Weapons of Math Destruction" - Cathy O'Neil (libro, disponible en espanol)
- "Algorithmic Justice League": https://www.ajl.org (recursos educativos gratuitos)
- Paper Obermeyer et al. sobre sesgo en salud: https://www.science.org/doi/10.1126/science.aax2342
- Documental "Coded Bias" (Netflix) - accesible y muy recomendado para no tecnicos

**Herramientas de verificacion:**
- Google Scholar para verificar citas academicas: https://scholar.google.com
- PubMed para verificar estudios medicos: https://pubmed.ncbi.nlm.nih.gov
- Lexis para verificar normativa ecuatoriana: https://www.lexis.com.ec
- Perplexity AI (responde con fuentes citadas): https://www.perplexity.ai
- Registro Oficial Ecuador: https://www.registroficial.gob.ec

**Guias eticas profesionales:**
- ABA (American Bar Association) - Formal Opinion 512 sobre IA en practica legal (referencia, aunque es estadounidense)
- American Medical Association - Directrices sobre IA en medicina (referencia internacional)
- ICAEW - Guia de IA para contadores (buscar "ICAEW artificial intelligence guidance")

**Para Ecuador:**
- Plan Nacional de Gobierno Digital 2025-2027 (seccion de IA responsable)
- Ministerio de Telecomunicaciones Ecuador: https://www.telecomunicaciones.gob.ec

---

## Cierre del bloque transversal

Has completado los cuatro modulos transversales de la formacion ITSEIA para profesionales. Estos modulos son tu base. Antes de avanzar al modulo especializado de tu profesion, asegurate de poder responder afirmativamente a estas preguntas:

Sobre fundamentos (T-01):
- Puedo explicar que es la IA en terminos que cualquier colega entienda?
- Conozco la diferencia entre IA generativa, predictiva y de clasificacion?
- Puedo separar los mitos principales de la realidad?

Sobre herramientas (T-02):
- Se cuando usar ChatGPT vs Claude vs Gemini?
- Puedo escribir un prompt efectivo usando al menos tres de las formulas aprendidas?
- Tengo un workflow definido para integrar IA en mi trabajo?

Sobre seguridad (T-03):
- Conozco los principios basicos de la LOPDP?
- Tengo claro que datos nunca debo subir a herramientas de IA comerciales?
- Se configurar las opciones de privacidad en las tres herramientas principales?

Sobre evaluacion critica (T-04):
- Se que son las alucinaciones y como detectarlas?
- Puedo aplicar el Framework CRITICO antes de usar un resultado de IA?
- Entiendo que mi firma implica mi responsabilidad, independientemente de que herramienta use?

Si hay preguntas donde tu respuesta es no o no del todo, regresa a esa sesion especifica antes de continuar. El modulo especializado de tu profesion asume que estas bases estan solidas.

El siguiente paso es el modulo especifico de tu profesion, donde aplicaras todo lo aprendido a los casos de uso concretos de tu campo en Ecuador.

---

*Modulo T-04 completado. Bloque transversal finalizado.*
*Siguiente: Modulo especializado segun tu profesion.*
