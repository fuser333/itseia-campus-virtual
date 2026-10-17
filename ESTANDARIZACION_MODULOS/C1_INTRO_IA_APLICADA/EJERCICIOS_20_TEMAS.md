# Ejercicios Prácticos — Introducción a IA Aplicada (20 Temas)

**Curso:** C1 — Introducción a IA Aplicada
**Total de ejercicios:** 20 (1 por tema)
**Instituto:** ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial

---

## Tema 1: Definición y evolución histórica de la IA

### Ejercicio: Línea de tiempo interactiva de la IA

**Objetivo:** Construir una línea de tiempo visual que conecte los hitos más importantes de la IA con su impacto en la sociedad actual.

**Herramientas necesarias (gratis):**
- Canva (canva.com) — diseño de la línea de tiempo
- Wikipedia + Stanford HAI (hai.stanford.edu) — fuentes de investigación
- Google Docs — documentación

**Datos de ejemplo:**
Investigar al menos 12 hitos clave:
- 1950: Test de Turing
- 1956: Conferencia de Dartmouth
- 1966: ELIZA (primer chatbot)
- 1974-1980: Primer invierno de la IA
- 1997: Deep Blue vs Kasparov
- 2011: IBM Watson gana Jeopardy
- 2012: AlexNet revoluciona visión por computadora
- 2016: AlphaGo derrota a Lee Sedol
- 2017: Arquitectura Transformer (Google)
- 2020: GPT-3 de OpenAI
- 2022: ChatGPT lanzamiento público
- 2023-2026: Era de IA generativa y regulación

**Pasos:**
1. Crear una cuenta gratuita en Canva y seleccionar plantilla de "Timeline" o "Línea de tiempo"
2. Investigar cada hito en fuentes confiables (Wikipedia, Stanford HAI, MIT Technology Review)
3. Para cada hito, documentar: año, nombre del evento, protagonistas, y una frase que explique su impacto
4. Diseñar la línea de tiempo en Canva con colores que distingan las eras (fundacional, inviernos, renacimiento, era actual)
5. Agregar imágenes representativas (fotos históricas o íconos)
6. Incluir una sección al final: "¿Qué viene después?" con tu predicción personal fundamentada
7. Exportar como PDF e imagen PNG
8. Escribir un párrafo reflexivo (200 palabras) en Google Docs respondiendo: "¿Cómo impacta esta evolución en Ecuador hoy?"

**Resultado esperado:**
Línea de tiempo visual con mínimo 12 hitos, diseño limpio y profesional, más un párrafo reflexivo que conecte la historia de la IA con el contexto ecuatoriano actual.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Completitud (mínimo 12 hitos con datos correctos) | 25 |
| Calidad de la investigación (fuentes confiables citadas) | 20 |
| Diseño visual (legibilidad, estética, uso de color) | 20 |
| Conexión con el contexto ecuatoriano | 20 |
| Predicción futura fundamentada | 15 |

---

## Tema 2: Tipos de IA: estrecha, general, superinteligente

### Ejercicio: Clasificación y análisis de sistemas de IA del mundo real

**Objetivo:** Clasificar 10 sistemas de IA reales según su tipo (estrecha, general, superinteligente) y argumentar cada clasificación.

**Herramientas necesarias (gratis):**
- Google Sheets — tabla de clasificación
- Navegador web — investigación
- Google Docs — análisis escrito

**Datos de ejemplo:**
Sistemas a clasificar:
1. Siri (Apple)
2. ChatGPT (OpenAI)
3. AlphaFold (DeepMind) — predicción de proteínas
4. Tesla Autopilot
5. DeepL Translator
6. DALL-E 3
7. Recomendaciones de Netflix
8. GitHub Copilot
9. Google Search
10. Alexa (Amazon)

**Pasos:**
1. Crear un Google Sheet con columnas: Sistema, Empresa, Qué hace, Tipo de IA, Justificación, Limitaciones
2. Investigar cada sistema: qué hace exactamente, qué puede y qué NO puede hacer
3. Clasificar cada uno como IA Estrecha, General o Superinteligente (spoiler: todos son estrechos actualmente)
4. Escribir una justificación de 2-3 líneas para cada clasificación
5. Identificar qué le faltaría a ChatGPT para ser considerado IA General
6. Investigar: ¿Alguna empresa ecuatoriana usa estos sistemas? Documentar al menos 2 ejemplos
7. Crear un cuadro comparativo: "IA Estrecha vs AGI" con mínimo 5 diferencias
8. Escribir una reflexión de 150 palabras: "¿Es posible la AGI en los próximos 10 años?"

**Resultado esperado:**
Tabla completa de clasificación con justificaciones sólidas, cuadro comparativo IA Estrecha vs AGI, y reflexión fundamentada sobre el futuro de la AGI.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Clasificación correcta de los 10 sistemas | 25 |
| Calidad de las justificaciones | 25 |
| Cuadro comparativo IA Estrecha vs AGI | 20 |
| Ejemplos de uso en Ecuador | 15 |
| Reflexión sobre AGI fundamentada | 15 |

---

## Tema 3: Machine Learning, Deep Learning e IA simbólica

### Ejercicio: Comparación práctica de enfoques de IA con un problema real

**Objetivo:** Resolver un mismo problema con tres enfoques distintos (reglas manuales, ML clásico y Deep Learning conceptual) y comparar resultados.

**Herramientas necesarias (gratis):**
- Google Colab (colab.research.google.com) — código Python
- Google Sheets — datos y reglas manuales

**Datos de ejemplo (Ecuador):**
Dataset ficticio de 100 clientes de un banco ecuatoriano:
- Edad, Ingresos mensuales ($), Años de empleo, Número de créditos previos, Monto solicitado ($), Resultado (Aprobado/Rechazado)

```
Edad,Ingresos,Anios_empleo,Creditos_previos,Monto_solicitado,Resultado
28,850,2,0,5000,Rechazado
45,2200,15,3,8000,Aprobado
33,1500,5,1,3000,Aprobado
22,400,0,0,10000,Rechazado
55,3000,20,5,15000,Aprobado
...
```

**Pasos:**
1. Generar el dataset completo usando ChatGPT o Claude: "Genera 100 filas de datos ficticios de clientes bancarios ecuatorianos con las columnas: Edad, Ingresos, Años_empleo, Créditos_previos, Monto_solicitado, Resultado (Aprobado/Rechazado). Haz que sea realista para Ecuador."
2. **Enfoque IA Simbólica (reglas):** En Google Sheets, crear reglas manuales tipo: SI Ingresos > 1000 Y Años_empleo > 2 ENTONCES Aprobado. Probar con los 100 datos. Anotar aciertos.
3. **Enfoque ML Clásico:** En Google Colab, usar scikit-learn con un árbol de decisión (DecisionTreeClassifier). Dividir datos 80/20. Medir accuracy.
4. **Enfoque Deep Learning (conceptual):** Investigar cómo una red neuronal abordaría el mismo problema. Describir la arquitectura (capas, neuronas) sin necesidad de implementar.
5. Comparar los tres enfoques en una tabla: Accuracy, Tiempo de desarrollo, Explicabilidad, Escalabilidad.
6. Responder: ¿Cuál enfoque usarías para el banco y por qué?

**Resultado esperado:**
Tabla comparativa de los 3 enfoques con métricas, código funcional en Colab para el enfoque ML, y conclusión fundamentada sobre cuál es el más apropiado.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Dataset generado correctamente | 10 |
| Reglas manuales implementadas con resultados | 20 |
| Código ML funcional en Colab | 30 |
| Descripción conceptual de Deep Learning | 15 |
| Tabla comparativa completa | 15 |
| Conclusión fundamentada | 10 |

---

## Tema 4: Aplicaciones reales de IA en Ecuador y LATAM

### Ejercicio: Mapeo de aplicaciones de IA en sectores productivos de Ecuador

**Objetivo:** Investigar y documentar aplicaciones reales de IA en al menos 5 sectores productivos de Ecuador con casos verificables.

**Herramientas necesarias (gratis):**
- Google Sheets — base de datos de casos
- Google Maps — ubicación de empresas
- Google Docs — informe final

**Datos de ejemplo:**
Sectores a investigar (PIB Ecuador según BCE):
1. Petróleo y minería
2. Agricultura y acuacultura (banano, camarón, flores)
3. Banca y finanzas
4. Salud
5. Comercio y retail
6. Telecomunicaciones
7. Educación
8. Gobierno y sector público

**Pasos:**
1. Crear un Google Sheet con columnas: Sector, Empresa/Institución, Aplicación de IA, Tecnología usada, Impacto reportado, Fuente/URL
2. Investigar al menos 2 casos por sector (mínimo 5 sectores = 10 casos)
3. Buscar en fuentes: Primicias.ec, El Comercio, El Universo, reportes del BCE, sitios web de las empresas
4. Verificar que cada caso sea real y documentable (incluir URL o referencia)
5. Identificar patrones: ¿Qué sectores están más avanzados en IA? ¿Cuáles están rezagados?
6. Comparar con 3 casos de LATAM (México, Colombia, Brasil) en los mismos sectores
7. Crear un mapa mental o diagrama que muestre: Sector → Aplicación → Impacto
8. Escribir un análisis de 300 palabras: "Oportunidades de IA para Ecuador 2026-2030"

**Resultado esperado:**
Base de datos con mínimo 10 casos reales verificados, comparación con LATAM, y análisis prospectivo de oportunidades para Ecuador.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Mínimo 10 casos reales con fuentes verificables | 30 |
| Cobertura de al menos 5 sectores | 15 |
| Comparación con LATAM (3 casos) | 15 |
| Mapa mental/diagrama de relaciones | 15 |
| Análisis prospectivo fundamentado | 25 |

---

## Tema 5: Ética, privacidad, sesgos y marco regulatorio

### Ejercicio: Auditoría ética de un sistema de IA ficticio

**Objetivo:** Realizar una auditoría ética completa de un sistema de IA ficticio para contratación laboral, aplicando la LOPDP de Ecuador.

**Herramientas necesarias (gratis):**
- Google Docs — informe de auditoría
- LOPDP texto completo (disponible en lexis.com.ec)
- AI Fairness 360 documentación (aif360.mybluemix.net) — referencia conceptual

**Datos de ejemplo:**
Caso ficticio: "TalentoIA Ecuador" es un sistema que:
- Analiza hojas de vida en PDF
- Evalúa compatibilidad con el puesto
- Filtra candidatos automáticamente
- Fue entrenado con 5,000 CVs de contrataciones exitosas de los últimos 5 años en Quito
- Rechaza automáticamente el 70% de los candidatos

Datos de sesgo detectados:
- 80% de los datos de entrenamiento son de hombres
- 90% de los contratados exitosos son de universidades privadas de Quito
- El sistema no fue probado con candidatos de la Costa o Amazonía

**Pasos:**
1. Leer los artículos 1-15 de la LOPDP de Ecuador
2. Identificar al menos 5 problemas éticos en el sistema "TalentoIA"
3. Para cada problema, citar el artículo de la LOPDP que se viola o el principio ético que se transgrede
4. Proponer una mitigación concreta para cada problema identificado
5. Evaluar el sesgo de género: si 80% de datos son masculinos, ¿qué pasa con candidatas mujeres?
6. Evaluar el sesgo geográfico: ¿es justo excluir a candidatos de la Costa/Amazonía?
7. Redactar un "Informe de Auditoría Ética" formal con: Resumen ejecutivo, Hallazgos, Riesgos legales, Recomendaciones
8. Proponer un "Código de Ética para IA en RRHH" con 10 principios aplicables a Ecuador

**Resultado esperado:**
Informe de auditoría ética completo con hallazgos, citas legales de la LOPDP, recomendaciones de mitigación y código de ética propuesto.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Identificación de al menos 5 problemas éticos | 20 |
| Citas correctas de la LOPDP | 20 |
| Mitigaciones concretas y viables | 20 |
| Informe de auditoría con estructura profesional | 20 |
| Código de ética con 10 principios | 20 |

---

## Tema 6: Introducción a modelos de lenguaje grandes (LLMs)

### Ejercicio: Comparación de respuestas de 3 LLMs al mismo prompt

**Objetivo:** Evaluar las diferencias de calidad, precisión y sesgo entre ChatGPT, Claude y Gemini al responder consultas idénticas sobre Ecuador.

**Herramientas necesarias (gratis):**
- ChatGPT (chat.openai.com) — versión gratuita
- Claude (claude.ai) — versión gratuita
- Gemini (gemini.google.com) — versión gratuita
- Google Sheets — matriz de evaluación

**Datos de ejemplo:**
5 prompts idénticos para los 3 modelos:
1. "¿Cuál es la tasa de desempleo actual en Ecuador según el INEC?"
2. "Explica las ventajas y desventajas de la dolarización en Ecuador"
3. "Escribe un correo profesional en español solicitando información sobre cursos de IA en Quito"
4. "¿Qué artículos de la LOPDP de Ecuador regulan el uso de datos personales en IA?"
5. "Genera código Python para analizar datos de exportaciones de banano del BCE"

**Pasos:**
1. Crear una cuenta gratuita en cada plataforma (si no la tienes)
2. Enviar el prompt exacto (copiado, sin variación) a cada LLM
3. Copiar las respuestas completas en un Google Doc
4. Crear una matriz de evaluación en Google Sheets con columnas: Prompt, ChatGPT (respuesta resumida), Claude (respuesta resumida), Gemini (respuesta resumida), Precisión factual, Calidad de redacción, Relevancia para Ecuador
5. Evaluar cada respuesta del 1 al 5 en: precisión factual, calidad de redacción, relevancia local y completitud
6. Verificar datos factuales con fuentes oficiales (INEC, BCE, lexis.com.ec)
7. Identificar alucinaciones: ¿algún modelo inventó datos? Documentar cuáles
8. Escribir conclusión: ¿Qué modelo recomendarías para trabajo profesional en Ecuador y por qué?

**Resultado esperado:**
Matriz comparativa de 3 LLMs con 5 prompts evaluados en 4 dimensiones, alucinaciones documentadas, y recomendación fundamentada.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Los 5 prompts probados en los 3 LLMs | 15 |
| Matriz de evaluación completa y rigurosa | 25 |
| Verificación factual con fuentes oficiales | 25 |
| Identificación de alucinaciones documentada | 20 |
| Conclusión y recomendación fundamentada | 15 |

---

## Tema 7: Uso profesional de ChatGPT

### Ejercicio: Flujo de trabajo profesional completo con ChatGPT

**Objetivo:** Completar un flujo de trabajo profesional real usando ChatGPT: análisis de datos, generación de informe y borrador de correo.

**Herramientas necesarias (gratis):**
- ChatGPT (chat.openai.com) — versión gratuita (o Plus si disponible)
- Google Sheets — datos fuente
- Google Docs — informe final

**Datos de ejemplo (Ecuador):**
Datos ficticios de ventas trimestrales de una pyme ecuatoriana de artesanías en Otavalo:

```
Trimestre,Ventas_USD,Clientes,Canal,Producto_top,Ciudad_destino
Q1-2025,12500,85,Online,Ponchos,Quito
Q2-2025,9800,62,Presencial,Bufandas,Guayaquil
Q3-2025,15200,110,Online,Tapices,Miami
Q4-2025,22000,145,Mixto,Ponchos,Nueva_York
Q1-2026,18500,120,Online,Tapices,Quito
```

**Pasos:**
1. Copiar los datos de ejemplo en una conversación de ChatGPT
2. Pedir a ChatGPT: "Analiza estas ventas trimestrales. Identifica tendencias, el canal más efectivo y el producto estrella."
3. Pedir: "Genera un informe ejecutivo de 1 página con estos datos, incluyendo 3 recomendaciones estratégicas para el próximo trimestre."
4. Pedir: "Crea 3 visualizaciones recomendadas (describe qué gráfico y qué datos incluiría cada uno)."
5. Pedir: "Redacta un correo profesional para enviar este informe al gerente de la empresa, en español ecuatoriano, tono formal pero cercano."
6. Evaluar críticamente cada respuesta de ChatGPT: ¿Es preciso? ¿Las recomendaciones son realistas para una pyme de Otavalo?
7. Corregir y mejorar manualmente lo que ChatGPT no hizo bien
8. Compilar el flujo completo en Google Docs: datos → análisis → informe → correo, marcando qué hizo la IA y qué mejoró el humano

**Resultado esperado:**
Documento que muestra el flujo completo de trabajo asistido por IA, con anotaciones de lo que la IA hizo bien, lo que falló y lo que el humano corrigió.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Análisis de datos obtenido correctamente | 15 |
| Informe ejecutivo completo y profesional | 20 |
| Visualizaciones recomendadas apropiadas | 15 |
| Correo profesional con tono adecuado | 15 |
| Evaluación crítica de las respuestas de ChatGPT | 20 |
| Mejoras manuales documentadas | 15 |

---

## Tema 8: Uso profesional de Claude y Gemini

### Ejercicio: Análisis de documento largo con Claude y automatización con Gemini

**Objetivo:** Usar Claude para analizar un documento extenso y Gemini para automatizar una tarea con Google Workspace.

**Herramientas necesarias (gratis):**
- Claude (claude.ai) — versión gratuita
- Gemini (gemini.google.com) — versión gratuita
- Google Docs — documento fuente
- Google Sheets — resultados

**Datos de ejemplo:**
Documento a analizar: la Ley Orgánica de Protección de Datos Personales de Ecuador (LOPDP) — disponible en lexis.com.ec (aproximadamente 30 páginas).

**Pasos:**
1. Descargar o copiar los primeros 15 artículos de la LOPDP
2. En Claude, pegar el texto y pedir: "Resume cada artículo en una frase. Luego identifica cuáles aplican directamente al uso de IA en empresas ecuatorianas."
3. Pedir a Claude: "Crea una checklist de cumplimiento de la LOPDP para una empresa que usa IA para analizar datos de clientes."
4. Evaluar la respuesta de Claude: ¿Resumió correctamente? ¿Identificó los artículos relevantes?
5. En Gemini, pedir: "Crea una plantilla de Google Sheets para hacer seguimiento del cumplimiento de protección de datos personales con las columnas: Artículo, Requisito, Estado (Cumple/No cumple/En proceso), Responsable, Fecha límite, Evidencia."
6. Pedir a Gemini: "Redacta un aviso de privacidad para el sitio web de una academia de IA en Quito, cumpliendo la LOPDP."
7. Comparar: ¿Cuál herramienta fue mejor para el análisis profundo? ¿Cuál para la integración con Google?
8. Documentar el flujo completo con capturas de pantalla

**Resultado esperado:**
Resumen de la LOPDP generado por Claude, checklist de cumplimiento, plantilla de seguimiento de Gemini, aviso de privacidad, y comparativa de ambas herramientas.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Resumen de artículos LOPDP correcto | 20 |
| Checklist de cumplimiento completa | 20 |
| Plantilla de Google Sheets funcional | 15 |
| Aviso de privacidad conforme a LOPDP | 20 |
| Comparativa fundamentada Claude vs Gemini | 25 |

---

## Tema 9: Técnicas de Prompt Engineering

### Ejercicio: Laboratorio de Prompt Engineering — De novato a experto

**Objetivo:** Aplicar 5 técnicas de prompt engineering al mismo problema y medir la mejora progresiva en la calidad de respuestas.

**Herramientas necesarias (gratis):**
- Claude o ChatGPT (versión gratuita)
- Google Sheets — registro de resultados
- Google Docs — documentación

**Datos de ejemplo:**
Problema base: "Necesito un plan de marketing digital para una academia de IA en Quito, Ecuador, con presupuesto de $500/mes."

**Pasos:**
1. **Prompt básico (zero-shot):** Enviar el problema tal cual y guardar la respuesta
2. **Role prompting:** Agregar "Actúa como un experto en marketing digital con 10 años de experiencia en educación online en LATAM." + el mismo problema
3. **Few-shot prompting:** Dar 2 ejemplos de planes de marketing exitosos antes de pedir el nuevo
4. **Chain-of-Thought:** Agregar "Piensa paso a paso: primero analiza el mercado ecuatoriano, luego define el público objetivo, después propón canales, y finalmente detalla el presupuesto por canal."
5. **Mega-prompt estructurado:** Combinar todas las técnicas: rol + contexto + ejemplos + formato + restricciones. Ejemplo: "Actúa como... Contexto: academia en Quito, 2 carreras de IA, público 18-30 años... Formato: tabla con canal, acción, presupuesto, KPI... Restricciones: solo canales con presencia en Ecuador, presupuesto máximo $500..."
6. Crear una matriz en Google Sheets: Técnica | Prompt usado | Calidad de respuesta (1-10) | Especificidad | Utilidad práctica
7. Para cada respuesta, marcar qué información es genérica vs. específica para Ecuador
8. Escribir un "Manual personal de Prompt Engineering" con las 5 técnicas y cuándo usar cada una

**Resultado esperado:**
5 prompts documentados con sus respuestas, matriz comparativa de calidad, y manual personal de prompt engineering.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| 5 técnicas correctamente aplicadas | 25 |
| Progresión visible en calidad de respuestas | 20 |
| Matriz comparativa completa | 20 |
| Identificación de contenido genérico vs. específico | 15 |
| Manual personal de prompt engineering | 20 |

---

## Tema 10: Automatización de redacción y comunicación con IA

### Ejercicio: Sistema de comunicación empresarial asistido por IA

**Objetivo:** Crear un kit completo de plantillas de comunicación empresarial generadas y optimizadas con IA.

**Herramientas necesarias (gratis):**
- Claude o ChatGPT — generación de contenido
- LanguageTool (languagetool.org) — corrección gramatical en español
- Google Docs — compilación final

**Datos de ejemplo (Ecuador):**
Empresa ficticia: "AgroTech Manabí" — startup de tecnología para agricultura de cacao en Manabí, Ecuador. 8 empleados. Vende sensores IoT + dashboard a productores de cacao.

**Pasos:**
1. Generar con IA un **correo de prospección B2B** para ofrecer los sensores a la Asociación Nacional de Exportadores de Cacao (ANECACAO)
2. Generar un **correo de seguimiento** (follow-up a los 3 días sin respuesta)
3. Generar una **propuesta breve** (1 página) para el servicio de sensores IoT
4. Generar un **comunicado de prensa** anunciando una alianza con una universidad (ESPAM)
5. Generar un **post de LinkedIn** profesional anunciando un caso de éxito
6. Para cada pieza, pasar por LanguageTool y corregir errores de español
7. Revisar manualmente: ¿el tono es apropiado para el contexto ecuatoriano? ¿Hay formalidades que agregar/quitar?
8. Compilar en un "Kit de Comunicación AgroTech Manabí" con las 5 piezas finales (post-IA + post-corrección humana)
9. Anotar para cada pieza: qué cambió entre la versión IA y la versión final humana
10. Calcular tiempo ahorrado estimado vs. escribir desde cero

**Resultado esperado:**
Kit de 5 piezas de comunicación profesional con versiones IA y versiones corregidas, anotaciones de cambios y estimación de tiempo ahorrado.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| 5 piezas de comunicación generadas | 20 |
| Corrección gramatical con LanguageTool | 15 |
| Revisión manual con adaptaciones culturales | 20 |
| Documentación de cambios IA vs. humano | 20 |
| Tono profesional apropiado para Ecuador | 15 |
| Estimación de tiempo ahorrado | 10 |

---

## Tema 11: Análisis de datos y generación de informes con IA

### Ejercicio: Análisis del mercado laboral ecuatoriano con datos del INEC

**Objetivo:** Analizar datos reales del empleo en Ecuador usando IA para generar un informe ejecutivo con visualizaciones.

**Herramientas necesarias (gratis):**
- Google Colab (colab.research.google.com) — análisis con Python
- ChatGPT Advanced Data Analysis o Claude — asistencia en análisis
- Datos del INEC (ecuadorencifras.gob.ec) — ENEMDU

**Datos de ejemplo:**
Datos del INEC — Encuesta Nacional de Empleo (ENEMDU):
- Descargar de ecuadorencifras.gob.ec/empleo o usar estos datos resumidos:

```
Provincia,Tasa_empleo_adecuado,Tasa_subempleo,Tasa_desempleo,Poblacion_PEA,Sector_mas_demandado
Pichincha,52.3,18.7,4.2,1250000,Servicios
Guayas,45.1,22.4,5.1,1800000,Comercio
Azuay,48.6,20.1,3.8,380000,Manufactura
Manabí,38.2,28.3,4.5,620000,Agricultura
Tungurahua,44.7,23.6,3.1,260000,Comercio
El_Oro,41.5,25.2,4.8,320000,Minería
Imbabura,40.3,26.8,4.1,210000,Turismo
Loja,39.1,27.5,5.3,240000,Agricultura
Esmeraldas,35.8,30.1,6.2,280000,Agricultura
Santo_Domingo,42.4,24.3,4.7,220000,Comercio
```

**Pasos:**
1. Crear un nuevo notebook en Google Colab
2. Cargar los datos (copiar como DataFrame de pandas o subir CSV)
3. Usar Python (pandas + matplotlib/seaborn) para: calcular estadísticas descriptivas, crear gráfico de barras de empleo adecuado por provincia, crear gráfico de dispersión desempleo vs. PEA
4. Pedir a Claude o ChatGPT que interprete los resultados: "Estos son datos de empleo del INEC. ¿Qué patrones observas? ¿Qué provincias necesitan más atención?"
5. Generar un ranking de provincias por calidad de empleo (empleo adecuado - subempleo)
6. Crear un informe ejecutivo de 1 página con: hallazgos principales, 3 gráficos, y recomendaciones
7. Validar las interpretaciones de la IA con datos reales del INEC
8. Exportar gráficos como imágenes e informe como PDF

**Resultado esperado:**
Notebook de Colab funcional con análisis de datos, 3 gráficos profesionales, informe ejecutivo de 1 página, y validación de interpretaciones de la IA.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Código Python funcional en Colab | 20 |
| Estadísticas descriptivas correctas | 15 |
| 3 visualizaciones claras y profesionales | 20 |
| Informe ejecutivo con estructura | 20 |
| Interpretaciones validadas con fuentes INEC | 15 |
| Recomendaciones fundamentadas | 10 |

---

## Tema 12: Automatización con Zapier, Make.com e IFTTT

### Ejercicio: Diseño de automatización multi-paso para una academia

**Objetivo:** Diseñar y documentar (y opcionalmente implementar) un flujo de automatización completo para gestión de leads de una academia de IA.

**Herramientas necesarias (gratis):**
- Make.com (make.com) — cuenta gratuita (1,000 operaciones/mes)
- Google Sheets — base de datos de leads
- Gmail — correos automáticos
- Google Docs — documentación del flujo

**Datos de ejemplo:**
Escenario: Una academia de IA en Quito recibe leads por:
- Formulario web (Google Forms)
- Facebook Ads (formulario de contacto)
- WhatsApp (mensaje directo)

Datos del lead: Nombre, Email, Teléfono, Carrera de interés (IA/Ciencia de Datos/Big Data), Fuente, Fecha.

**Pasos:**
1. Crear un Google Sheet llamado "CRM Leads Academia" con las columnas del lead
2. Crear un Google Form con los campos del lead
3. En Make.com, crear un escenario: "Nuevo formulario → Agregar a Google Sheet → Enviar correo de bienvenida"
4. Diseñar el correo de bienvenida personalizado (usar variables: nombre, carrera de interés)
5. Agregar un paso con filtro: si la carrera es "IA", enviar brochure A; si es "Ciencia de Datos", enviar brochure B
6. Documentar el flujo completo con capturas de pantalla de cada módulo
7. Probar el flujo con 3 leads ficticios y verificar que funcione
8. Diseñar (en papel/diagrama) dos automatizaciones adicionales que NO implementarás pero documentarás: (a) seguimiento automático a los 3 días, (b) alerta a vendedor si el lead abrió el correo
9. Calcular: ¿cuántas horas semanales ahorra esta automatización si recibes 50 leads/semana?

**Resultado esperado:**
Flujo de automatización funcional en Make.com, documentación con capturas, 2 flujos adicionales diseñados, y cálculo de ahorro de tiempo.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Flujo funcional en Make.com | 30 |
| Google Sheet + Form configurados | 10 |
| Correo de bienvenida personalizado | 15 |
| Documentación con capturas | 15 |
| 2 flujos adicionales diseñados | 20 |
| Cálculo de ahorro de tiempo | 10 |

---

## Tema 13: Generación de contenido visual con DALL-E, Midjourney, Canva AI

### Ejercicio: Campaña visual completa para redes sociales con IA

**Objetivo:** Crear una mini campaña visual (5 piezas) para redes sociales usando herramientas de IA generativa.

**Herramientas necesarias (gratis):**
- Canva (canva.com) — diseño con IA integrada
- DALL-E en ChatGPT o Bing Image Creator (bing.com/create) — generación de imágenes
- Google Docs — brief creativo

**Datos de ejemplo:**
Campaña ficticia: "Semana de la IA en Ecuador"
- Objetivo: promover una semana de eventos virtuales sobre IA
- Público: jóvenes 18-30, universitarios, profesionales junior
- Tono: moderno, tech, accesible, inspiracional
- Colores: azul navy (#1F2F58), amarillo (#FBBC0C), celeste (#73B8E7)
- Hashtag: #IAparaEcuador

**Pasos:**
1. Escribir un brief creativo (1 párrafo): objetivo, audiencia, tono, elementos visuales clave
2. Crear 3 prompts diferentes para generar imágenes en DALL-E/Bing Image Creator relacionadas con IA en Ecuador (incluir elementos ecuatorianos: paisajes, personas latinas, ciudades)
3. Generar las imágenes y seleccionar las mejores
4. En Canva, crear 5 piezas de la campaña: (a) Post de anuncio para Instagram (1080x1080), (b) Story de Instagram (1080x1920), (c) Portada de evento para Facebook (1200x628), (d) Banner para LinkedIn (1200x627), (e) Miniatura para YouTube (1280x720)
5. Usar las funciones de IA de Canva: Magic Write para textos, Magic Resize para adaptar formatos
6. Mantener consistencia visual: misma paleta, tipografía y estilo en las 5 piezas
7. Exportar todas las piezas en formatos correctos (PNG para redes, PDF para impresión)
8. Crear un mockup: simular cómo se verían las piezas publicadas (usar mockups de Canva)

**Resultado esperado:**
Brief creativo, 3 prompts documentados con imágenes generadas, 5 piezas de campaña diseñadas, archivos exportados y mockup de visualización.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Brief creativo completo | 10 |
| 3 prompts de generación documentados | 15 |
| 5 piezas diseñadas en formatos correctos | 25 |
| Consistencia visual (paleta, tipografía, estilo) | 20 |
| Uso de funciones IA de Canva | 15 |
| Mockup de visualización | 15 |

---

## Tema 14: Aplicaciones de IA por sector económico

### Ejercicio: Propuesta de IA para un sector económico de Ecuador

**Objetivo:** Desarrollar una propuesta de implementación de IA para un sector económico específico de Ecuador con análisis de viabilidad.

**Herramientas necesarias (gratis):**
- Google Docs — propuesta escrita
- Claude o ChatGPT — investigación asistida
- Google Sheets — análisis financiero básico
- Datos del BCE (bce.fin.ec) — indicadores económicos

**Datos de ejemplo:**
Sector asignado (elegir uno): Acuacultura de camarón en Ecuador.
Datos del sector (BCE/Cámara Nacional de Acuacultura):
- Ecuador es el #2 exportador mundial de camarón
- Exportaciones 2025: ~$7.6 mil millones USD
- Principales mercados: China, EE.UU., Europa
- Problemas: enfermedades (mancha blanca), control de calidad, logística de frío
- Número de productores: ~3,500
- Empleo directo: ~250,000 personas

**Pasos:**
1. Investigar el sector asignado con datos del BCE y fuentes sectoriales
2. Identificar 3 problemas concretos del sector donde la IA puede ayudar
3. Para cada problema, proponer una solución de IA: qué tecnología, qué datos necesita, qué resultado produce
4. Investigar si existe algún caso similar en otro país (benchmark internacional)
5. Crear un análisis de viabilidad básico: costo estimado (rango), tiempo de implementación, ROI esperado
6. Identificar barreras de implementación específicas de Ecuador (infraestructura, capacitación, regulación)
7. Redactar la propuesta (2-3 páginas): Resumen ejecutivo, Diagnóstico del sector, 3 soluciones de IA propuestas, Análisis de viabilidad, Roadmap de implementación (12 meses), Conclusión
8. Crear una presentación resumen de 5 slides (en Google Slides o Canva)

**Resultado esperado:**
Propuesta escrita de 2-3 páginas con 3 soluciones de IA para el sector, análisis de viabilidad, roadmap, y presentación de 5 slides.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Investigación del sector con datos reales | 15 |
| 3 problemas correctamente identificados | 15 |
| 3 soluciones de IA viables y bien descritas | 20 |
| Análisis de viabilidad con números | 15 |
| Barreras de implementación identificadas | 10 |
| Propuesta escrita con estructura profesional | 15 |
| Presentación de 5 slides | 10 |

---

## Tema 15: Herramientas de análisis de datos con IA

### Ejercicio: Pipeline de análisis de datos con múltiples herramientas

**Objetivo:** Construir un pipeline completo de análisis de datos usando herramientas de IA, desde datos crudos hasta dashboard.

**Herramientas necesarias (gratis):**
- Google Colab — Python (pandas, matplotlib)
- ChatGPT Advanced Data Analysis o Julius AI (julius.ai) — análisis conversacional
- Google Sheets — datos y visualizaciones
- Google Data Studio / Looker Studio (lookerstudio.google.com) — dashboard

**Datos de ejemplo (Ecuador):**
Datos ficticios del SRI — Recaudación tributaria por provincia:

```
Provincia,Impuesto_Renta,IVA,ICE,Aranceles,Total_2025,Variacion_vs_2024
Pichincha,2850000000,1920000000,180000000,95000000,5045000000,4.2
Guayas,2100000000,1650000000,210000000,320000000,4280000000,3.8
Azuay,420000000,380000000,35000000,12000000,847000000,5.1
Manabí,310000000,290000000,28000000,45000000,673000000,2.9
Tungurahua,280000000,250000000,22000000,8000000,560000000,6.3
El_Oro,250000000,230000000,25000000,85000000,590000000,3.5
Imbabura,180000000,160000000,15000000,5000000,360000000,4.8
Loja,170000000,150000000,12000000,4000000,336000000,3.2
Esmeraldas,120000000,110000000,10000000,35000000,275000000,1.8
Santo_Domingo,150000000,140000000,14000000,6000000,310000000,5.5
```

**Pasos:**
1. Cargar los datos en Google Colab como DataFrame de pandas
2. Calcular: contribución porcentual de cada provincia al total nacional, tipo de impuesto más importante por provincia, correlación entre tipos de impuesto
3. Crear 4 visualizaciones en Python: (a) Barras horizontales del total por provincia, (b) Pie chart de composición tributaria nacional, (c) Mapa de calor de correlaciones, (d) Barras agrupadas comparando tipos de impuesto
4. Subir los mismos datos a Julius AI o ChatGPT y pedir: "Analiza estos datos de recaudación tributaria. ¿Qué patrones observas?"
5. Comparar las interpretaciones de Python manual vs. IA conversacional
6. Crear un mini dashboard en Looker Studio con los datos de Google Sheets
7. Generar un informe ejecutivo (1 página) combinando los hallazgos de ambos métodos
8. Documentar: ventajas y desventajas de cada herramienta para este tipo de análisis

**Resultado esperado:**
Notebook de Colab con 4 visualizaciones, análisis de IA conversacional, mini dashboard en Looker Studio, informe ejecutivo, y comparativa de herramientas.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Código Python funcional con 4 gráficos | 25 |
| Análisis conversacional con IA | 15 |
| Dashboard en Looker Studio | 20 |
| Informe ejecutivo de 1 página | 20 |
| Comparativa de herramientas | 20 |

---

## Tema 16: Integración de herramientas IA en flujos de trabajo

### Ejercicio: Rediseño de un flujo de trabajo real con IA

**Objetivo:** Tomar un flujo de trabajo manual existente y rediseñarlo integrando herramientas de IA en los puntos de mayor impacto.

**Herramientas necesarias (gratis):**
- Draw.io (app.diagrams.net) — diagramas de flujo
- Google Docs — documentación
- Claude o ChatGPT — asistencia en diseño

**Datos de ejemplo:**
Flujo actual de una empresa de importación en Guayaquil (manual):
1. Recibir solicitud de cotización por email (10 min)
2. Buscar proveedores en China (2 horas)
3. Solicitar precios a 3 proveedores (30 min)
4. Esperar respuestas (2-5 días)
5. Calcular costos totales: producto + flete + arancel + IVA (1 hora)
6. Crear cotización para el cliente en Word (45 min)
7. Enviar cotización por email (10 min)
8. Seguimiento si no responde en 3 días (15 min)
9. Si acepta: generar orden de compra (30 min)
10. Hacer seguimiento de envío (continuo)

Tiempo total estimado: 6+ horas activas por cotización.

**Pasos:**
1. Dibujar el flujo actual en Draw.io (diagrama de flujo con tiempos)
2. Para cada paso, evaluar: ¿Puede la IA ayudar? ¿Cuánto tiempo ahorraría? ¿Qué herramienta específica?
3. Identificar los 3-5 pasos con mayor oportunidad de mejora con IA
4. Diseñar el flujo nuevo integrado con IA. Ejemplos: (a) ChatGPT analiza el email y extrae datos de la solicitud, (b) IA busca y compara proveedores, (c) Plantillas con IA generan cotización automática, (d) Make.com automatiza seguimiento
5. Dibujar el flujo rediseñado en Draw.io con IA integrada (usar colores: azul=humano, verde=IA, amarillo=mixto)
6. Calcular tiempo estimado del nuevo flujo
7. Crear una tabla comparativa: Paso | Tiempo antes | Tiempo después | Herramienta IA | Ahorro
8. Calcular ROI: si la empresa hace 20 cotizaciones/mes, ¿cuántas horas/mes ahorra?

**Resultado esperado:**
2 diagramas de flujo (antes y después), tabla comparativa de tiempos, cálculo de ROI, y propuesta de implementación.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Diagrama del flujo actual completo | 15 |
| Identificación de oportunidades de IA (3-5 pasos) | 20 |
| Diagrama del flujo rediseñado con IA | 20 |
| Tabla comparativa de tiempos | 15 |
| Cálculo de ROI | 15 |
| Viabilidad de la propuesta | 15 |

---

## Tema 17: Identificación y definición del problema a resolver

### Ejercicio: Metodología CRISP-DM aplicada — Fase 1: Comprensión del negocio

**Objetivo:** Aplicar la primera fase de CRISP-DM (Comprensión del Negocio) para definir un problema de IA real en una empresa ecuatoriana.

**Herramientas necesarias (gratis):**
- Google Docs — documentación
- Google Sheets — matriz de evaluación
- Claude o ChatGPT — asistencia en análisis

**Datos de ejemplo:**
Empresa ficticia: "Farmacias del Pueblo" — cadena de 12 farmacias en Cuenca y Azogues, Ecuador.
Datos del negocio:
- Ventas mensuales: $480,000 (total cadena)
- Productos: ~8,000 SKUs (medicamentos + productos de cuidado personal)
- Desperdicio por caducidad: 6.5% ($31,200/mes en pérdidas)
- Personal: 48 empleados (4 por farmacia)
- Sistema actual: Excel para inventario, cuaderno para pedidos
- Problema declarado por el gerente: "Perdemos mucho dinero en medicamentos que caducan"

**Pasos:**
1. **Comprender el negocio:** Listar lo que sabes de la empresa. Formular 10 preguntas que le harías al gerente para entender mejor el problema
2. **Evaluar la situación actual:** ¿Qué recursos tiene la empresa? ¿Qué datos recolecta? ¿Qué restricciones existen (presupuesto, tecnología, capacitación)?
3. **Definir objetivos del proyecto:** Transformar "perdemos dinero en caducidad" en 3 objetivos SMART medibles
4. **Evaluar si IA es la solución correcta:** Completar la checklist: ¿Hay datos disponibles? ¿El volumen justifica automatización? ¿El error es tolerable? ¿Existe alternativa más simple?
5. **Matriz de priorización:** Listar 5 posibles problemas de la empresa y priorizarlos por: Impacto económico, Viabilidad técnica, Disponibilidad de datos, Tiempo de implementación
6. **Definición formal del problema:** Escribir un documento de 1 página con: Problema, Contexto, Objetivos, Alcance, Criterios de éxito, Restricciones, Riesgos
7. **Validar con IA:** Pedir a Claude que revise tu definición de problema y sugiera mejoras

**Resultado esperado:**
Documento de definición de problema formal, 10 preguntas al negocio, 3 objetivos SMART, checklist de viabilidad, y matriz de priorización.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| 10 preguntas relevantes al negocio | 15 |
| 3 objetivos SMART bien definidos | 20 |
| Checklist de viabilidad completa | 15 |
| Matriz de priorización con 5 problemas | 20 |
| Documento de definición formal | 20 |
| Validación con IA documentada | 10 |

---

## Tema 18: Planificación del proyecto y selección de herramientas

### Ejercicio: Plan de proyecto de IA completo con Gantt y selección de stack

**Objetivo:** Crear un plan de proyecto completo para implementar una solución de IA, incluyendo cronograma, equipo, herramientas y presupuesto.

**Herramientas necesarias (gratis):**
- Google Sheets — cronograma Gantt y presupuesto
- Trello (trello.com) o Notion (notion.so) — tablero Kanban
- Google Docs — plan escrito
- Claude o ChatGPT — asistencia en planificación

**Datos de ejemplo:**
Proyecto: "Sistema de predicción de demanda para cadena de farmacias en Cuenca" (continuación del Tema 17).
Restricciones:
- Presupuesto: $3,000 (herramientas y capacitación, no incluye salarios)
- Equipo: 2 estudiantes de IA (ITSEIA), 1 analista de la farmacia
- Plazo: 12 semanas
- Datos disponibles: 2 años de ventas en Excel (96,000 registros)
- Infraestructura: Google Workspace, conexión a internet estable

**Pasos:**
1. **Dividir en fases CRISP-DM:** Comprensión del negocio (sem 1-2), Comprensión de datos (sem 3-4), Preparación de datos (sem 5-6), Modelado (sem 7-8), Evaluación (sem 9-10), Despliegue (sem 11-12)
2. **Crear diagrama Gantt** en Google Sheets: columnas = semanas 1-12, filas = tareas por fase, colores = fase/responsable
3. **Selección de herramientas:** Comparar 3 opciones para cada necesidad: (a) Análisis de datos: Python vs. Julius AI vs. Excel, (b) Modelo ML: scikit-learn vs. AutoML (Google) vs. no-code, (c) Dashboard: Streamlit vs. Looker Studio vs. Google Sheets
4. Crear **tabla de selección** con criterios: costo, curva de aprendizaje, escalabilidad, adecuación al problema
5. **Definir roles y responsabilidades** (matriz RACI)
6. **Presupuesto detallado:** Google Sheets con: herramienta, costo mensual, meses necesarios, total
7. Crear **tablero Kanban** en Trello con columnas: Backlog, En progreso, Revisión, Completado. Crear al menos 15 tareas
8. **Plan de riesgos:** Identificar 5 riesgos con probabilidad, impacto y plan de mitigación
9. Compilar todo en un "Plan de Proyecto" de 3-4 páginas

**Resultado esperado:**
Plan de proyecto completo con Gantt, selección de herramientas justificada, tablero Kanban, presupuesto, matriz RACI y plan de riesgos.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Diagrama Gantt con 12 semanas y tareas | 20 |
| Selección de herramientas con justificación | 15 |
| Matriz RACI | 10 |
| Presupuesto detallado dentro de $3,000 | 15 |
| Tablero Kanban con 15+ tareas | 15 |
| Plan de riesgos (5 riesgos) | 10 |
| Plan escrito completo y coherente | 15 |

---

## Tema 19: Desarrollo e implementación de la solución con IA

### Ejercicio: Construcción de un modelo de ML de principio a fin

**Objetivo:** Desarrollar un modelo de Machine Learning completo, desde la carga de datos hasta la evaluación, documentando cada decisión.

**Herramientas necesarias (gratis):**
- Google Colab (colab.research.google.com) — entorno Python
- Librerías: pandas, scikit-learn, matplotlib, seaborn
- Google Docs — documentación de decisiones

**Datos de ejemplo (Ecuador):**
Dataset: Predicción de aprobación de microcréditos en Ecuador (ficticio, basado en realidad).

```python
# Generar dataset en Colab
import pandas as pd
import numpy as np

np.random.seed(42)
n = 500

data = pd.DataFrame({
    'edad': np.random.randint(22, 65, n),
    'ingresos_mensuales': np.random.choice([400,600,800,1000,1200,1500,2000,2500,3000], n),
    'anios_empleo': np.random.randint(0, 25, n),
    'monto_solicitado': np.random.choice([500,1000,2000,3000,5000,8000,10000], n),
    'creditos_previos': np.random.randint(0, 8, n),
    'provincia': np.random.choice(['Pichincha','Guayas','Azuay','Manabí','Tungurahua'], n),
    'tipo_actividad': np.random.choice(['Comercio','Servicios','Agricultura','Manufactura'], n)
})
# Target basado en reglas realistas
data['aprobado'] = ((data['ingresos_mensuales'] > 800) &
                     (data['anios_empleo'] > 1) &
                     (data['monto_solicitado'] < data['ingresos_mensuales'] * 4)).astype(int)
# Agregar ruido
ruido = np.random.random(n) < 0.15
data.loc[ruido, 'aprobado'] = 1 - data.loc[ruido, 'aprobado']
```

**Pasos:**
1. **Exploración de datos (EDA):** Estadísticas descriptivas, distribuciones, correlaciones. Crear mínimo 3 gráficos
2. **Preparación:** Manejar variables categóricas (one-hot encoding para provincia y tipo_actividad), escalar variables numéricas
3. **División:** train/test split 80/20 con random_state fijo
4. **Línea base:** Modelo simple (regresión logística). Medir accuracy, precision, recall, F1
5. **Modelo mejorado:** Probar Random Forest y comparar métricas
6. **Evaluación:** Matriz de confusión, curva ROC, importancia de features
7. **Interpretación:** ¿Qué variables son más importantes para la aprobación? ¿Tiene sentido con la realidad ecuatoriana?
8. **Documentación:** Para cada paso, escribir en Google Docs: qué decidiste, por qué, qué resultado obtuviste
9. **Reflexión ética:** ¿El modelo podría discriminar por provincia? ¿Cómo lo mitigarías?

**Resultado esperado:**
Notebook de Colab funcional con EDA, 2 modelos entrenados y comparados, evaluación completa con métricas y gráficos, y documentación de decisiones.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| EDA completa con 3+ gráficos | 15 |
| Preparación de datos correcta | 10 |
| Modelo línea base funcional con métricas | 15 |
| Modelo mejorado con comparación | 15 |
| Evaluación (matriz confusión, ROC, features) | 15 |
| Documentación de decisiones | 15 |
| Reflexión ética sobre sesgos | 15 |

---

## Tema 20: Presentación y defensa del proyecto

### Ejercicio: Presentación profesional y simulacro de defensa

**Objetivo:** Preparar una presentación profesional del proyecto de ML (Tema 19) y practicar la defensa ante preguntas difíciles.

**Herramientas necesarias (gratis):**
- Google Slides o Canva — presentación
- Claude o ChatGPT — simulacro de preguntas
- Google Docs — guion y respuestas preparadas

**Datos de ejemplo:**
Usar los resultados del proyecto del Tema 19 (predicción de microcréditos) como contenido de la presentación.

**Pasos:**
1. **Estructura de la presentación (10-12 slides):**
   - Slide 1: Título, nombre, fecha, ITSEIA
   - Slide 2: El problema (por qué importa para Ecuador)
   - Slide 3: Objetivo del proyecto (SMART)
   - Slide 4: Datos utilizados (fuente, tamaño, variables)
   - Slide 5: Metodología (CRISP-DM simplificado)
   - Slide 6: Exploración de datos (gráficos clave)
   - Slide 7: Modelos probados (regresión logística vs Random Forest)
   - Slide 8: Resultados (métricas + matriz de confusión)
   - Slide 9: Variables más importantes (feature importance)
   - Slide 10: Limitaciones y trabajo futuro
   - Slide 11: Conclusiones (3 puntos clave)
   - Slide 12: Preguntas + contacto
2. **Diseñar la presentación** con estilo profesional: fondo limpio, gráficos legibles, poco texto por slide
3. **Escribir guion:** Para cada slide, escribir qué dirás (máximo 2 minutos por slide = 20-24 minutos total)
4. **Simulacro de preguntas difíciles:** Pedir a Claude: "Actúa como un panel evaluador de proyectos de IA. Hazme 10 preguntas difíciles sobre un modelo de predicción de microcréditos entrenado con datos ficticios de Ecuador."
5. **Preparar respuestas:** Para cada pregunta del simulacro, escribir una respuesta estructurada (máximo 1 minuto cada una)
6. **Preparar respuestas a debilidades conocidas:** ¿Qué pasa si preguntan sobre el dataset ficticio? ¿Sobre overfitting? ¿Sobre sesgo por provincia?
7. **Grabar un ensayo** (opcional): Usar la grabadora del teléfono para ensayar y medir tiempo
8. **Checklist final:** ¿Todos los gráficos son legibles? ¿Las métricas están correctas? ¿El flujo narrativo es coherente?

**Resultado esperado:**
Presentación de 10-12 slides profesional, guion escrito, 10 preguntas difíciles con respuestas preparadas, y checklist de calidad.

**Criterios de evaluación (/100 puntos):**
| Criterio | Puntos |
|----------|--------|
| Presentación de 10-12 slides con diseño profesional | 25 |
| Guion escrito con tiempos por slide | 15 |
| 10 preguntas difíciles identificadas | 15 |
| Respuestas preparadas para las 10 preguntas | 20 |
| Narrativa coherente (problema → solución → resultado) | 15 |
| Checklist de calidad completada | 10 |

---

## Resumen de herramientas utilizadas

| Herramienta | Temas donde se usa | Costo |
|-------------|-------------------|-------|
| Google Colab | 3, 11, 15, 19 | Gratis |
| ChatGPT | 6, 7, 9, 10, 11 | Gratis (limitado) |
| Claude | 6, 8, 9, 10, 17, 20 | Gratis (limitado) |
| Gemini | 6, 8 | Gratis |
| Google Sheets | 2, 4, 6, 9, 11, 12, 15, 18 | Gratis |
| Google Docs | 1, 4, 5, 7, 8, 10, 14, 16, 17, 19, 20 | Gratis |
| Canva | 1, 13, 20 | Gratis (limitado) |
| Make.com | 12 | Gratis (1,000 ops/mes) |
| Draw.io | 16 | Gratis |
| Looker Studio | 15 | Gratis |
| Trello/Notion | 18 | Gratis |
| LanguageTool | 10 | Gratis |
| DALL-E / Bing Create | 13 | Gratis (limitado) |

---

*Generado para ITSEIA — Instituto Ecuatoriano de Inteligencia Artificial*
*Curso: C1 — Introducción a IA Aplicada*
*Fecha: 2026-04-23*
