# Ejercicio Sesion 3: Sesgo Algoritmico — Casos Reales que Cambiaron el Mundo

**Materia:** Etica Digital y Responsabilidad Profesional
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion:** 40 min

## Objetivo
Identificar, analizar y proponer soluciones a casos documentados de sesgo algoritmico, entendiendo sus causas tecnicas (datos de entrenamiento sesgados, variables proxys, retroalimentacion de sesgo) y su impacto humano real.

## Contexto (Ecuador)
El sesgo algoritmico no es un problema futuro ni hipotetico. Ya existen casos documentados en sistemas bancarios, de contratacion y de justicia que han discriminado a grupos vulnerables. En Ecuador, donde el 72% de la poblacion se identifica como mestiza, afrodescendiente o indigena, y donde la brecha de genero en empleo formal es del 13%, los algoritmos entrenados con datos historicos pueden perpetuar y amplificar estas desigualdades. Como ingeniero de IA ecuatoriano, tienes el poder de romper ese ciclo o de perpetuarlo.

## Instrucciones (paso a paso)

**Paso 1 — Analiza 3 casos reales documentados (15 min)**
Estos son casos reales con consecuencias documentadas:

**Caso Real 1 — COMPAS (Estados Unidos, 2016)**
El algoritmo COMPAS era usado por jueces en Estados Unidos para predecir la probabilidad de reincidencia criminal y fijar fianzas. Un estudio de ProPublica demostro que predecia reincidencia con el doble de probabilidad para personas negras que para personas blancas con el mismo perfil criminal real. El algoritmo fue desarrollado con datos historicos de arrestos (no de crimenes reales), que reflejaban el sesgo racial del sistema policial.

Pregunta: Si un algoritmo similar se usara en Ecuador para el sistema de justicia, que grupos poblacionales podrian ser perjudicados y por que?

**Caso Real 2 — Amazon Recruiting (2018)**
Amazon desarrollo un algoritmo de seleccion de hojas de vida que debia filtrar candidatos para posiciones tecnicas. Despues de 2 anos de desarrollo, lo cancelaron porque penalizaba automaticamente CVs que incluian la palabra "mujeres" (como "presidenta del club de mujeres en tecnologia") y favorecia palabras como "ejecutado" o "liderado" que aparecian mas en CVs de hombres. El algoritmo fue entrenado con los CVs de los empleados contratados en los ultimos 10 anos, una poblacion predominantemente masculina.

Pregunta: Si Kruger Corp Ecuador (empresa tech lider) usara un sistema similar, cuales grupos serian perjudicados en el contexto del mercado laboral ecuatoriano?

**Caso Real 3 — Oxfam Ecuador — Algoritmo de Transferencias (2021)**
En el contexto de las ayudas COVID, varios programas de transferencias condicionadas (incluyendo el Bono de Desarrollo Humano del Ecuador) usaron datos digitales para identificar beneficiarios. Un estudio de Oxfam encontro que personas en zonas rurales, adultos mayores sin smartphone y comunidades indigenas sin registro digital eran excluidos sistematicamente del acceso a las ayudas, no por decision humana sino porque el algoritmo de elegibilidad requeria datos que esos grupos no tenian.

Pregunta: Este es sesgo por omision (ausencia de datos). Como es diferente al sesgo activo de los casos 1 y 2?

**Paso 2 — Propuestas de mitigacion (15 min)**
Para CADA caso, escribe una propuesta concreta de como el equipo de ingenieria deberia haber detectado y mitigado el sesgo ANTES de poner el sistema en produccion. Usa estas tecnicas como guia:
- Auditoria de datos de entrenamiento (buscar subrepresentacion)
- Metricas de equidad (equalized odds, demographic parity)
- Grupos de prueba diversificados
- Revision humana obligatoria en decisiones de alto impacto
- Derecho a apelacion

**Paso 3 — Debate con Gemini (10 min)**

```
Soy estudiante de etica en IA en Ecuador. Analice estos 3 casos de sesgo algoritmico:
[pega tu analisis y propuestas]
Por favor:
1. Mis propuestas de mitigacion son tecnicamente viables?
2. Hay un cuarto tipo de sesgo que no cubri en mi analisis?
3. En Ecuador, que legislacion existente (LOPDP, Constitucion) podria invocar alguien afectado por uno de estos sistemas?
4. Como difiere el impacto del sesgo algoritmico en Ecuador vs. en paises con mayor penetracion digital?
```

## Usa IA para...
Verificar la viabilidad tecnica de las soluciones propuestas y conectar el analisis con el marco legal ecuatoriano vigente.

## Que aprendiste
- El sesgo no siempre es intencional: puede heredarse de datos historicos que reflejan desigualdades previas
- La ausencia de datos es tambien una forma de sesgo (caso Oxfam)
- Mitigar el sesgo no es un post-proceso: debe diseñarse desde el inicio del proyecto

## Reto extra
Busca el concepto de "Algorithmic Auditing" y el proyecto "AI Now Institute". Lee uno de sus reportes anuales. Identifica un hallazgo que sea relevante para el contexto latinoamericano o ecuatoriano. Escribe un parrafo de 150 palabras sobre lo que encontraste.
