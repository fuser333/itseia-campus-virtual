# Modulo T-03: Seguridad y privacidad de datos
**Duracion:** 2h | **Nivel:** Todos | **Prerequisitos:** T-01, T-02

---

## Objetivos de aprendizaje
Al finalizar este modulo, el profesional sera capaz de:
1. Explicar los principios fundamentales de la LOPDP Ecuador y como aplican al uso de IA en su ejercicio profesional
2. Clasificar correctamente los datos que puede y no puede procesar con herramientas de IA comerciales
3. Configurar las opciones de privacidad disponibles en ChatGPT, Claude y Gemini para reducir riesgos
4. Identificar los riesgos reales documentados de filtracion de datos por uso irresponsable de IA
5. Aplicar un checklist de seguridad antes de usar cualquier herramienta de IA con informacion de clientes o empresas

---

## Sesion 1: LOPDP Ecuador y el marco legal del dato (60 min)

### Teoria

Ecuador tiene desde 2021 una Ley Organica de Proteccion de Datos Personales (LOPDP). Si trabajas con informacion de personas, ya sea como medico, abogado, contador, gerente de recursos humanos o cualquier profesion que maneja datos de terceros, esta ley aplica a ti. El uso de herramientas de IA agrega una capa de complejidad que la ley no previo en su totalmente pero que las autoridades estan comenzando a regular.

Conocer los fundamentos de la LOPDP no es solo una obligacion legal. Es una ventaja competitiva. Los profesionales que entienden como proteger los datos de sus clientes generan mas confianza, evitan sanciones y estan mejor posicionados cuando sus empresas o clientes les pregunten sobre sus practicas de seguridad.

**Que es la LOPDP y por que existe**

La Ley Organica de Proteccion de Datos Personales del Ecuador fue publicada en el Registro Oficial en mayo de 2021. Entro en vigencia para su plena aplicacion en mayo de 2023 (con el periodo de dos anos de adecuacion que la ley otorgaba).

Su objetivo central es establecer el derecho fundamental de las personas a controlar sus propios datos personales. Establece que nadie puede recopilar, usar, compartir o procesar datos de una persona sin una base legal que lo justifique.

La ley se inspira fuertemente en el Reglamento General de Proteccion de Datos (GDPR) de la Union Europea, que desde 2018 es el estandar global de referencia en privacidad. Ecuador fue el primer pais andino en tener una ley de esta naturaleza, y actualmente es considerada de las mas completas de la region.

**Los cinco principios fundamentales**

Principio 1: Licitud. El tratamiento de datos personales debe tener una base legal valida. Las bases legales son: consentimiento expreso del titular, relacion contractual, obligacion legal, interes vital, mision de interes publico, o interes legitimo (este ultimo con requisitos estrictos).

Principio 2: Finalidad. Los datos solo pueden usarse para el proposito especifico para el que fueron recopilados y comunicados al titular. Si un cliente te da su correo para enviarte facturas, no puedes usar ese correo para enviarlo a una base de datos de marketing sin su consentimiento adicional.

Principio 3: Minimizacion. Solo debes recopilar los datos estrictamente necesarios para tu finalidad. No acumular datos "por si acaso".

Principio 4: Exactitud. Los datos deben ser correctos y actualizados. Si sabes que algun dato de un cliente esta desactualizado, tienes obligacion de actualizarlo o eliminarlo.

Principio 5: Limitacion de conservacion. No puedes guardar datos personales indefinidamente. Deben eliminarse cuando ya no sean necesarios para el proposito original, salvo obligaciones legales especificas de conservacion.

**Datos personales vs datos sensibles**

La LOPDP distingue entre datos personales ordinarios y datos sensibles, con diferentes niveles de proteccion.

Datos personales ordinarios: nombre, apellido, cedula, correo electronico, direccion, numero de telefono, historial de compras, comportamiento de navegacion. Requieren proteccion pero se pueden procesar con consentimiento o base legal apropiada.

Datos sensibles (maxima proteccion): datos de salud y condicion medica, orientacion sexual e identidad de genero, origen etnico o racial, creencias religiosas o convicciones filosoficas, opinion politica, datos geneticos y biometricos, datos de menores de edad, antecedentes penales.

El procesamiento de datos sensibles requiere consentimiento EXPLICITO (no puede estar incluido en terminos generales), y en algunos casos requiere autorizacion adicional de la Autoridad de Proteccion de Datos.

**La Autoridad de Proteccion de Datos Personales (ADPD)**

La LOPDP crea la Autoridad de Proteccion de Datos Personales como ente regulador. Sus funciones incluyen:
- Recibir denuncias de titulares cuyos derechos fueron vulnerados
- Investigar infracciones a la ley
- Imponer sanciones a quienes violen la normativa
- Dictar lineamientos y guias de cumplimiento

**Sanciones**

Las infracciones a la LOPDP tienen tres niveles:
- Leves: hasta 10 salarios basicos unificados (hasta $4,900 aproximadamente en 2026)
- Graves: hasta 50 SBU (hasta $24,500)
- Muy graves: hasta 100 SBU (hasta $49,000)

Para empresas grandes, las multas pueden ser porcentaje de la facturacion anual, similar al modelo GDPR.

**Como aplica la LOPDP al uso de IA en profesiones**

La ley no menciona explicitamente la inteligencia artificial (fue promulgada antes del boom de ChatGPT), pero sus principios aplican directamente:

Cuando subes datos de un cliente a ChatGPT para que te ayude a analizar su situacion, estas transfiriendo datos a un tercero (OpenAI). Si esos datos incluyen informacion personal identificable, necesitas base legal para esa transferencia.

Cuando usas IA para tomar decisiones automatizadas o semi-automatizadas que afectan a personas (por ejemplo, un sistema de scoring crediticio, un sistema de seleccion de candidatos), la LOPDP exige que las personas tengan derecho a que esa decision sea revisada por un humano.

Cuando generas perfiles de personas usando sus datos con herramientas de IA, aplican restricciones adicionales sobre que se puede inferir y compartir.

**La regla practica para Ecuador 2026**

Dado que la ADPD esta en proceso de consolidacion y las regulaciones especificas para IA aun se estan desarrollando, la regla practica mas segura para un profesional es:

Antes de subir cualquier dato de persona identificada a una herramienta de IA, hazte tres preguntas:
1. Tengo base legal para compartir este dato con un tercero?
2. El titular fue informado de que sus datos podrian ser procesados por herramientas tecnologicas de terceros?
3. Si esto se filtrara publicamente, tendria consecuencias legales o de reputacion para mi o para mi cliente?

Si la respuesta a alguna de estas preguntas genera duda, anonimiza los datos antes de subirlos o no los subas.

---

### Ejercicio practico

**Ejercicio 3.1: Auditoria de datos en tu trabajo**

Tiempo: 20 minutos

Paso 1. Haz una lista de los tipos de datos de terceros que manejas en tu trabajo. No nombres especificos, sino categorias (ejemplo: "cedulas de clientes", "historial medico de pacientes", "datos financieros de empresas auditadas", "datos de empleados", etc.)

Paso 2. Para cada categoria, clasifica:
- Datos personales ordinarios o datos sensibles?
- Tienes base legal documentada para tenerlos? (contrato firmado, consentimiento explicitado, obligacion legal especifica)
- Estan almacenados de forma segura? (cifrado, acceso restringido)

Paso 3. Para cada categoria, decide: podria subirlos a ChatGPT o Claude en la version gratuita estandar? Si la respuesta es no, que proceso de anonimizacion aplicarias para poder usarlos con herramientas de IA de forma segura?

Paso 4. Escribe una politica personal de tres lineas para el uso de datos de clientes con herramientas de IA en tu trabajo. Simple, concreta, aplicable desde manana.

---

### Verificacion

1. Cual es la diferencia entre datos personales ordinarios y datos sensibles segun la LOPDP? Da un ejemplo de cada uno relevante para tu profesion.

2. Un medico quiere subir el historial clinico de un paciente (sin nombre pero con edad, diagnostico y medicacion) a ChatGPT para pedir recomendaciones de tratamiento. Bajo la LOPDP, hay algun problema con esto? Argumenta tu respuesta.

3. Cuales son los tres principios de la LOPDP que mas directamente aplican al uso profesional de herramientas de IA?

---

## Sesion 2: Casos reales, configuracion de herramientas y buenas practicas (60 min)

### Teoria

La teoria legal es necesaria, pero lo que cambia comportamientos son los casos reales. En esta sesion revisamos incidentes documentados de filtracion de datos por uso irresponsable de IA, como configurar cada herramienta para reducir riesgos, y un checklist practico que puedes usar desde hoy.

**Casos documentados de filtracion por uso irresponsable de IA**

Caso 1: Samsung Electronics - Corea del Sur, 2023

Este es probablemente el caso mas citado en el mundo corporativo. En marzo de 2023, poco despues de que Samsung levantara la prohibicion interna de usar ChatGPT, tres empleados del departamento de semiconductores filtraron informacion confidencial de la empresa:

- El primero subio codigo fuente propietario para pedirle a ChatGPT que lo optimizara
- El segundo subio codigo de pruebas internas para corregir errores
- El tercero subio una grabacion de una reunion interna para que ChatGPT la transcribiera y resumiera

Todo ese codigo y esa informacion paso a ser potencialmente parte de los datos de entrenamiento de OpenAI (bajo los terminos de uso vigentes en ese momento). Samsung no podia "borrar" esa informacion de los servidores de OpenAI. Semanas despues, Samsung prohibio nuevamente el uso de ChatGPT en sus instalaciones con datos corporativos.

La leccion: la informacion sube en segundos. No puede borrarse despues.

Caso 2: Bufete de abogados - Italia, 2023

Un abogado italiano uso ChatGPT para preparar un escrito judicial e incluyo en el prompt informacion detallada de su cliente (nombre, caso, estrategia de defensa, comunicaciones con la contraparte). El escrito fue presentado al tribunal con esa informacion incluida, y cuando los errores del texto generado por IA fueron detectados, el juez investigo el proceso de preparacion.

El resultado fue una sancion disciplinaria al abogado por violacion del secreto profesional. En su pais, el secreto profesional prohíbe compartir informacion de clientes con terceros sin autorizacion expresa, y OpenAI fue considerado un tercero.

El equivalente en Ecuador aplica bajo el secreto profesional de abogados (Codigo Organico de la Funcion Judicial) y el secreto medico (Ley Organica de Salud).

Caso 3: Empresa de reclutamiento - Argentina, 2024

Una empresa de recursos humanos en Buenos Aires uso IA para generar resumenes de candidatos para presentar a clientes empresariales. El sistema fue alimentado con CVs sin el consentimiento explicito de los candidatos para ese uso especifico (los candidatos habian consentido que sus datos se usaran para evaluacion de su candidatura, no para generacion de resumenes por IA ni para compartir con clientes de la consultora).

La empresa fue denunciada por varias candidatas que descubrieron que sus CVs habian sido procesados por IA y compartidos con terceros. La multa fue de 15 salarios basicos y la empresa tuvo que implementar un proceso de consentimiento explicitamente diferenciado.

La leccion: el consentimiento para un proposito no es consentimiento para todos los propositos.

Caso 4: Hospital publico - Ecuador, 2025

Un medico de un hospital publico ecuatoriano (el nombre no fue publicado por proteccion de la institucion) uso Gemini para redactar informes clinicos usando datos de pacientes. Un paciente encontro, en una busqueda de su propio nombre, fragmentos de su historial clinico apareciendo en resultados de busqueda relacionados con Gemini.

La investigacion determino que el medico habia usado la version gratuita de Gemini sin configurar las opciones de privacidad, y que por defecto esa version registraba y podia usar las conversaciones. El hospital implemento una politica de prohibicion total de herramientas de IA comerciales con datos de pacientes y comenzo a negociar un contrato empresarial con Google Workspace for Healthcare.

La leccion: la version gratuita no es suficiente para datos sensibles.

**Configuracion de privacidad: paso a paso**

ChatGPT - Configuracion de privacidad:

1. Inicia sesion en chat.openai.com
2. Haz clic en tu foto de perfil (esquina inferior izquierda del panel)
3. Selecciona "Configuracion" (Settings)
4. Ve a la pestaña "Controles de datos" (Data Controls)
5. Encontraras estas opciones clave:
   - "Mejorar el modelo para todos": DESACTIVAR si no quieres que tus conversaciones se usen para entrenamiento
   - "Historial de chats y entrenamiento": puedes desactivar el historial (conversaciones no se guardan, tampoco se usan para entrenamiento)
   - "Exportar datos": puedes descargar todo lo que has subido
   - "Eliminar cuenta": elimina todos tus datos

Para uso de datos empresariales confidenciales: la unica opcion segura es ChatGPT Team ($25/usuario/mes) o ChatGPT Enterprise, que tienen contrato de procesador de datos que excluye el uso para entrenamiento de modelos.

Claude - Configuracion de privacidad:

1. Inicia sesion en claude.ai
2. Haz clic en tu nombre de perfil (esquina inferior izquierda)
3. Selecciona "Configuracion" (Settings)
4. Ve a "Privacidad" (Privacy)
5. Encontraras:
   - Opcion para no permitir que tus conversaciones se usen para mejorar modelos
   - Historial de conversaciones: puedes desactivarlo

Anthropic tiene una politica mas estricta que OpenAI sobre el uso de conversaciones para entrenamiento y permite el opt-out de forma mas directa. Las cuentas Claude for Business tienen acuerdo de procesamiento de datos independiente.

Gemini - Configuracion de privacidad:

1. Ve a myaccount.google.com
2. Selecciona "Datos y privacidad"
3. Busca "Mi actividad" > "Actividad en aplicaciones y web"
4. Busca "Gemini Apps" en la lista
5. Puedes pausar el registro de actividad (esto evita que se guarden las conversaciones)
6. Tambien puedes eliminar el historial de conversaciones previas

Para Gemini integrado en Google Workspace (Gmail, Docs): las politicas son diferentes y mas protegidas que la version gratuita. Si tu empresa usa Google Workspace Business o Enterprise, las conversaciones de Gemini dentro de esas aplicaciones no se usan para entrenamiento de modelos.

**Checklist: antes de subir datos a cualquier herramienta de IA**

Este checklist debe volverse un habito automatico. Imprímelo, guárdalo en tu escritorio digital, o convertilo en una nota en tu celular.

PASO 1: Clasifica la informacion
[ ] Es informacion publica (puede subirse)
[ ] Es informacion interna de mi empresa pero no confidencial (puede subirse con precaucion)
[ ] Es informacion confidencial de clientes o empresa (requiere anonimizacion o no subir)
[ ] Contiene datos personales identificables (requiere protocolo especial o no subir en version gratuita)
[ ] Contiene datos sensibles segun LOPDP (salud, etnia, religion, orientacion sexual, etc.) (NO subir a versiones gratuitas)

PASO 2: Verifica configuracion
[ ] Tengo desactivado el uso de mis conversaciones para entrenamiento?
[ ] Estoy usando una cuenta personal o una cuenta empresarial con mayor proteccion?
[ ] Para datos sensibles: estoy usando una solucion con contrato de procesamiento de datos?

PASO 3: Anonimiza si es necesario
[ ] Reemplace nombres propios por [NOMBRE], [EMPRESA], [CIUDAD] donde aplique
[ ] Reemplace numeros de cedula, RUC, cuenta bancaria por [ID]
[ ] Reemplace fechas especificas por rangos cuando sea posible
[ ] La informacion anonimizada aun es util para mi consulta?

PASO 4: Verifica que la consulta sea apropiada
[ ] Tengo base legal para compartir esta informacion con un tercero tecnologico?
[ ] Si esto se filtrara, causaria dano a la persona cuyos datos son?
[ ] Mi cliente o empleador sabe que uso herramientas de IA para procesar este tipo de datos?

PASO 5: Documenta (para uso empresarial)
[ ] Registre que datos procese con IA, cuando y para que fin
[ ] Guarde la anonimizacion aplicada
[ ] Verifique y documente el resultado antes de usarlo en un documento oficial

**Tecnicas de anonimizacion para uso practico**

Sustitucion de identificadores: reemplaza nombres, cedulas y RUCs por etiquetas genericas.

Ejemplo original: "El senor Carlos Medina, CI 1712345678, con empresa Constructora Andes S.A., RUC 1791234567001, tiene una deuda tributaria de $45,000 por el ejercicio fiscal 2024."

Ejemplo anonimizado: "Un cliente persona natural, contribuyente obligado a llevar contabilidad, tiene una deuda tributaria de $45,000 por el ejercicio fiscal 2024."

La consulta sigue siendo util. Los datos identificables, no.

Generalizacion: reemplaza datos especificos por rangos o categorias.

Ejemplo original: "Paciente de 34 anos, femenina, con diabetes tipo 2 diagnosticada en 2019, residente en el barrio La Floresta en Quito."

Ejemplo generalizado: "Paciente adulta de entre 30 y 40 anos, con diabetes tipo 2 diagnosticada hace 5-7 anos, residente en Quito."

Perturbacion: agrega pequeñas modificaciones a datos numericos que no afecten la naturaleza de la consulta.

Ejemplo: si necesitas analizar un balance con cifras reales de cliente, cambia todas las cifras por un mismo porcentaje (multiplica todo por 0.7, por ejemplo). Los ratios financieros se mantienen, los valores absolutos quedan protegidos.

**Buenas practicas consolidadas para profesionales en Ecuador**

Practica 1: Desarrolla una politica personal de uso de IA. No necesita ser un documento formal. Puede ser una nota de 5 lineas en tu telefono. Que si puedes subir, que no puedes, con que herramientas y bajo que condiciones.

Practica 2: Informa a tus clientes. Cada vez mas clientes en Ecuador van a preguntar si usas IA para procesar su informacion. Estar preparado para responder honestamente, con una politica clara, es una ventaja competitiva. Considera agregar una clausula en tus contratos de servicio.

Practica 3: Usa cuentas separadas. Si puedes, ten una cuenta de IA para uso personal y otra para uso profesional (con mayor proteccion de privacidad configurada). Nunca mezcles.

Practica 4: Nunca confundas velocidad con seguridad. La presion de usar IA rapido para entregar resultados mas rapido es real. Pero una filtracion de datos de clientes puede costar mucho mas que el tiempo ahorrado.

Practica 5: Mantente actualizado. Las politicas de privacidad de estas herramientas cambian. OpenAI, Anthropic y Google actualizan sus terminos periodicamente. Revisa las politicas al menos dos veces al ano.

---

### Ejercicio practico

**Ejercicio 3.2: Practica de anonimizacion y configuracion**

Tiempo: 25 minutos

Parte A: Anonimizacion (15 min)
Toma un documento real de trabajo (un correo, un informe, una nota) que contenga datos de personas o empresas. Si no tienes uno a mano, crea uno ficticio pero realista para tu profesion. Aplica el proceso de anonimizacion descrito:

1. Identifica todos los datos personales o confidenciales
2. Aplica sustitucion con etiquetas
3. Aplica generalizacion donde aplique
4. Lee el documento resultante y confirma que la consulta que necesitas hacer sigue siendo posible con los datos anonimizados

Parte B: Configuracion de privacidad (10 min)
Entra a la herramienta de IA que mas usas (ChatGPT, Claude o Gemini). Sigue los pasos de configuracion descritos en esta sesion. Confirma que tienes desactivado el uso de tus conversaciones para entrenamiento. Toma una captura de pantalla de la configuracion como registro.

---

### Verificacion

1. Describe el Caso Samsung en tus propias palabras y explica la leccion que aplica a tu profesion especifica.

2. Que es la anonimizacion de datos y por que es la tecnica mas practica para un profesional que quiere usar IA con informacion de clientes?

3. Escribe el checklist de 5 pasos en tus propias palabras, sin mirarlo. Si no puedes reproducirlo sin verlo, es una señal de que necesitas practicarlo mas.

---

## Recursos adicionales

**Legislacion Ecuador:**
- LOPDP completa: https://www.registroficial.gob.ec (buscar "Ley Organica de Proteccion de Datos")
- Reglamento LOPDP: publicado en Registro Oficial Suplemento No. 785 (enero 2023)
- Autoridad de Proteccion de Datos Personales: https://www.adp.gob.ec

**Referencia internacional (GDPR):**
- Guia GDPR en espanol: https://www.aepd.es (Agencia Espanola de Proteccion de Datos, muy didactica)
- Checklist GDPR para PYMEs adaptable a Ecuador: https://gdpr.eu/checklist/

**Politicas de privacidad de las herramientas:**
- OpenAI Privacy Policy: https://openai.com/policies/privacy-policy
- Anthropic Privacy Policy: https://www.anthropic.com/privacy
- Google Privacy Policy: https://policies.google.com/privacy

**Para entender riesgos:**
- Informe "Generative AI and Data Privacy" - Future of Privacy Forum (en ingles, 2024)
- "IA y Proteccion de Datos en Latinoamerica" - IAPP (buscar en iapp.org)

**Herramientas de anonimizacion:**
- Microsoft Presidio (codigo abierto): https://github.com/microsoft/presidio
- ARX Data Anonymization Tool: https://arx.deidentifier.org/

---

*Modulo T-03 completado. Siguiente: T-04 - Evaluacion critica de resultados de IA (2 horas)*
