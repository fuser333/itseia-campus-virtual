# T-01: Fundamentos de IA sin tecnicismos

**Tipo:** Leccion
**Duracion:** 45 minutos
**Semana:** 1
**Herramientas:** ChatGPT (version gratuita), Claude (version gratuita)

---

## Objetivo de Aprendizaje

Al finalizar este modulo, podras explicar con tus propias palabras que es la inteligencia artificial, como funciona a nivel conceptual y por que esta transformando la contabilidad y la auditoria a nivel global y en Ecuador. No necesitas saber matematicas ni programacion — solo el mapa mental correcto para usar estas herramientas con criterio profesional y sin caer en el hype ni en el miedo.

---

## 1. Por que esto te importa ahora

Hay una pregunta que muchos contadores prefieren no hacerse: "En 5 anos, cuanto de lo que hago hoy lo hara una maquina?"

La respuesta honesta es: una parte importante. Segun McKinsey (2025), el 60% de las tareas de contabilidad general son automatizables con tecnologia existente hoy. Eso no significa que tu trabajo desaparece — significa que cambia. Los contadores que prosperen en 2030 no seran los que saben mas de debitos y creditos, sino los que saben usar la IA para hacer mas trabajo de mayor valor en menos tiempo.

**Las firmas ya se movieron:**
- Deloitte usa IA para revisar el 100% de contratos en auditorias (antes revisaban muestra)
- PricewaterhouseCoopers implemento GL.ai para detectar anomalias en libros contables
- KPMG Ecuador ya usa herramientas de analisis de datos en auditorias de empresas medianas

Esto no es tendencia futura. Ya esta pasando en Quito, en Guayaquil, en Cuenca.

---

## 2. Que es la IA en terminos reales

Olvidate del robot humanoide y del apocalipsis de Terminator. La IA que te interesa a ti es mucho mas aburrida y mucho mas util.

### La definicion practica

La inteligencia artificial es software capaz de realizar tareas que antes requerían razonamiento humano: leer texto, entender contexto, generar respuestas, identificar patrones en datos, y producir documentos estructurados.

Punto. Eso es todo.

### Los tres tipos que necesitas conocer

**1. IA Generativa (Lo que usas con ChatGPT y Claude)**
Genera contenido nuevo a partir de instrucciones: texto, tablas, formulas, analisis, notas contables. Es el tipo de IA con el que interactuaras el 90% del tiempo en este curso. Funciona con modelos de lenguaje grande (LLM por sus siglas en ingles).

Ejemplo practico: Le pides "redacta la nota 8 sobre inventarios bajo NIC 2 con estos datos" y te entrega la nota lista para revisar.

**2. Machine Learning — Aprendizaje automatico (Lo que usa tu banco)**
Aprende patrones de datos historicos para hacer predicciones. Tu banco lo usa para detectar fraude en tu tarjeta. Herramientas como Vic.ai lo usan para detectar facturas duplicadas o montos inusuales en cuentas por pagar.

Ejemplo practico: Sistema que aprende que tus facturas de proveedores regularmente llegan entre $500 y $2,000 y levanta una alerta cuando aparece una de $18,000 de un proveedor nuevo.

**3. Automatizacion RPA (Lo que hace tu software contable)**
Robotic Process Automation: software que imita acciones humanas repetitivas (hacer clic, copiar, pegar, enviar email) sin entender realmente lo que hace. Tu sistema de facturacion electronica con el SRI tiene componentes de RPA.

Diferencia clave: RPA sigue reglas fijas. ML aprende de datos. IA generativa comprende instrucciones en lenguaje humano.

### Como funciona un modelo de lenguaje (sin matematicas)

Imagina que has leido todos los libros de contabilidad, todas las NIIF, todos los manuales tributarios del SRI, millones de estados financieros y reportes de auditoria. Despues de leer todo eso, cuando alguien te pregunta "como se contabiliza un leasing financiero bajo NIIF 16", sabes responder porque reconoces el patron de esa respuesta en todo lo que leiste.

Eso es un LLM. Fue entrenado con cantidades masivas de texto y aprendio los patrones del lenguaje y el conocimiento contenido en ese texto. Cuando le haces una pregunta, predice cual es la respuesta mas probable y util basandose en ese entrenamiento.

Implicacion importante para tu trabajo: el modelo NO accede a internet en tiempo real (a menos que tenga herramientas especificas). No conoce la ultima resolucion del SRI de la semana pasada. Para eso debes proporcionarle el documento tu mismo.

---

## 3. La IA y la contabilidad ecuatoriana: el estado actual

### Lo que la IA ya hace bien en finanzas

- Redactar notas a estados financieros bajo NIIF a partir de datos tabulados
- Analizar variaciones entre periodos y explicar las causas probables
- Revisar contratos y destacar clausulas de riesgo financiero
- Generar borradores de reportes gerenciales en formato ejecutivo
- Responder consultas tributarias generales (con la caveat de que debes verificar con normativa vigente)
- Detectar inconsistencias en registros cuando le das el dataset

### Lo que la IA NO puede hacer (todavia)

- Firmar una declaracion del SRI — la responsabilidad legal sigue siendo tuya
- Acceder directamente a tu sistema contable (Monica, Concar, SAP) sin integracion especifica
- Conocer la ultima reforma tributaria si no le das el documento
- Garantizar cifras exactas: puede cometer errores aritmeticos (especialmente en calculos complejos)
- Reemplazar el juicio profesional en estimaciones contables bajo incertidumbre

### El rol del contador cambia, no desaparece

El trabajo de valor en contabilidad siempre fue el juicio profesional: interpretar las normas, estimar provisiones razonables, evaluar el riesgo de una contingencia, decidir como presentar una situacion compleja. La IA automatiza lo mecánico. El criterio sigue siendo tuyo.

---

## 4. Casos reales en el contexto ecuatoriano

### Caso 1: Firma de auditoria en Guayaquil

Una firma regional con 15 auditores empezo a usar ChatGPT Plus para la redaccion de informes de auditoria de gestion. Resultado: el tiempo de redaccion bajo de 3 horas a 45 minutos por informe. Los auditores ahora dedican ese tiempo a revisar y agregar juicio profesional en lugar de escribir desde cero.

### Caso 2: Contador independiente en Quito

Contador independiente con 80 clientes usa Claude para responder consultas tributarias de sus clientes fuera de horario. Le da el texto de la consulta + fragmento relevante de la normativa del SRI, y Claude redacta la respuesta que el revisa y envia. Tiempo ahorrado: 2 horas diarias.

### Caso 3: Departamento contable de empresa importadora

Empresa de importacion usa Power Query + ChatGPT para cruzar datos de facturas de proveedores extranjeros con los tipos de cambio BCE y las liquidaciones de aduana. Proceso que tomaba un dia de trabajo ahora toma 2 horas.

---

## 5. Las limitaciones que debes conocer antes de confiar

Esta es la seccion mas importante del modulo. La IA es poderosa y te va a ahorrar horas, pero si la usas mal puede crearte problemas serios.

**Limitacion 1 — Alucinacion**
Los modelos de lenguaje a veces generan informacion falsa con total confianza. Pueden citar articulos de ley que no existen, inventar porcentajes, o dar cifras erroneas. En contabilidad, esto es critico. Regla: cualquier dato numerico o cita legal que genere la IA debe verificarse en la fuente original.

**Limitacion 2 — Corte de conocimiento**
Los modelos tienen una fecha de corte de entrenamiento. ChatGPT-4o fue entrenado hasta principios de 2024. No conoce resoluciones del SRI, reformas tributarias ni NIIFs emitidas despues de esa fecha. Para trabajo tributario actual, debes proporcionar la normativa vigente como documento adjunto.

**Limitacion 3 — Sin acceso a tus sistemas**
A menos que uses integraciones especificas (que veremos en modulos posteriores), la IA no puede acceder a tu software contable, al portal del SRI ni al BCE. Tu debes extraer los datos y proporcionarlos.

**Limitacion 4 — Privacidad de datos**
Por defecto, las conversaciones en ChatGPT pueden usarse para entrenamiento del modelo. Nunca subas RUC de clientes, estados financieros con nombres reales o informacion bancaria a plataformas publicas sin revisar la politica de privacidad. (Modulo T-03 cubre esto en detalle.)

---

## Resumen del Modulo

- La IA generativa (ChatGPT, Claude) es software que genera texto, analisis y documentos a partir de instrucciones en lenguaje natural
- El ML detecta patrones en datos — util para anomalias contables y prediccion
- La RPA automatiza tareas repetitivas — ya esta en tu software contable actual
- La IA NO reemplaza tu firma, tu juicio ni tu responsabilidad legal
- Los LLM aprenden de texto masivo y predicen respuestas — no piensan como humanos
- Limitaciones criticas: alucinacion, corte de conocimiento, privacidad de datos
- El contador del futuro usa IA como multiplicador de su capacidad profesional

---

## Ejercicio Rapido

**Actividad 1 — Primera conversacion profesional con IA (15 minutos)**

Abre claude.ai o chat.openai.com (cuenta gratuita suficiente). Copia y pega el siguiente prompt:

```
Soy contador y acabo de terminar un modulo de fundamentos de IA. Quiero que seas
mi asistente contable. Para empezar, explícame en 5 puntos como podrias ayudarme
en mi trabajo diario como contador en Ecuador, considerando que trabajo con NIIF,
el SRI y clientes empresas medianas. Sé especifico y practica. No menciones
herramientas que no sean accesibles hoy.
```

Lee la respuesta con ojo critico. Preguntate: ¿Es esto realista? ¿Hay algo que la IA dijo que suena incorrecto o exagerado? ¿Cuanto de esto ya sabes hacer manualmente?

**Actividad 2 — Mapa de oportunidades (10 minutos)**

En una hoja de papel o en un documento, escribe las 5 tareas mas repetitivas de tu trabajo de la semana pasada. Para cada una, evalua: ¿Podria la IA ayudar con esto? ¿Como? Este mapa sera tu guia personal durante el curso.
