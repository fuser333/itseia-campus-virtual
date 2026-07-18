# Ejercicio Sesion 2: De Insight a Historia — Framework STAR

**Materia:** Storytelling con Datos
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 50 min

## Objetivo

Dominar el framework STAR (Situation, Tension, Action, Result) para convertir cualquier analisis de datos en una historia ejecutiva convincente, aplicarlo a datos publicos ecuatorianos reales, y producir narrativas de datos que provoquen decisiones en audiencias ejecutivas y no tecnicas.

## Contexto (Ecuador)

Los directivos ecuatorianos toman decisiones en reuniones de 45 minutos con 15 temas en la agenda. Tu analisis tiene 3 minutos para comunicar lo que importa. El framework STAR es la estructura mas usada en consultorias como McKinsey, Bain y Boston Consulting Group para comunicar hallazgos complejos en tiempo minimo con impacto maximo.

## Instrucciones

### Parte 1 — Anatomia del framework STAR (10 min)

**S — Situation (Situacion):** El contexto que el oyente necesita para entender por que importa.
- Maximo 2 oraciones
- Solo informacion que la audiencia NO conoce
- Establece el mundo antes del problema

**T — Tension (Tension):** El problema, la anomalia o la oportunidad descubierta.
- ES EL CORAZON DE LA HISTORIA
- Debe generar incomodidad, urgencia o curiosidad
- El dato que cambia como la audiencia ve la situacion

**A — Action (Accion):** Lo que se hizo (en el analisis) o lo que se deberia hacer (en la recomendacion).
- Si es un analisis retrospectivo: "realizamos..."
- Si es una recomendacion: "recomendamos..."
- Especifico, con responsable y plazo

**R — Result (Resultado):** El impacto medido o esperado.
- Numero concreto si es retrospectivo
- Proyeccion justificada si es recomendacion
- Conecta con lo que la audiencia valora (dinero, tiempo, riesgo)

### Parte 2 — Aplicar STAR a 3 datasets ecuatorianos reales (25 min)

**CASO 1 — INEC: Datos de empleo juvenil 2024**

Datos disponibles (busca el valor real en ecuadorencifras.gob.ec):
- Tasa de desempleo juvenil nacional
- Tasa de desempleo juvenil en sector tecnologia
- Ingresos promedio jovenes en sector tech vs otros sectores
- Numero de empresas tech que reportan dificultad para contratar

Audiencia objetivo: Ministro de Trabajo del Ecuador
Objetivo: Que cree o fortalezca un programa de formacion tech

Construye el STAR de 4 parrafos (un parrafo por letra):

```
SITUATION: Ecuador tiene [X] millones de jovenes entre 18-24 años...

TENSION: Sin embargo, mientras [DATO QUE GENERA URGENCIA]...

ACTION: Para abordar esto, [LO QUE SE ANALIZO O SE PROPONE]...

RESULT: Si se implementa [ACCION], se podria [IMPACTO CUANTIFICADO]...
```

**CASO 2 — BCE: Exportaciones no tradicionales 2024**

Datos disponibles (busca en bce.fin.ec):
- Valor exportaciones no petroleras
- Crecimiento de exportaciones de flores, banano, cacao
- Comparacion con paises competidores (Colombia, Peru)
- Participacion de pymes en exportaciones

Audiencia objetivo: Presidente de la Camara de Comercio de Quito
Objetivo: Que apoye un programa de digitalizacion para exportadores

Construye el STAR con datos reales del BCE.

**CASO 3 — Datos educativos: Insercion laboral de graduados**

Datos disponibles (SENESCYT, INEC):
- Tasa de insercion laboral por carrera
- Tiempo promedio para conseguir primer empleo
- Correlacion entre carrera estudiada y trabajo actual
- Ingresos promedio al año 1, 3 y 5 de graduado

Audiencia objetivo: Estudiante de bachillerato de 17 años en Quito
Objetivo: Que elija una carrera tecnica

Construye el STAR adaptado a una audiencia joven (tono diferente, datos diferentes de los mismos datos).

### Parte 3 — STAR con datos de tu proyecto integrador (10 min)

Convierte los resultados de tu proyecto de titulacion en un STAR para cada audiencia:

**STAR para el Director del MSP (si tu proyecto es de salud):**
```
SITUATION: El MSP gestion [X] citas medicas por año en [Y] centros de salud...
TENSION: El [Z%] de esas citas no se atienden, costando al sistema [$] anuales...
ACTION: Desarrollamos un modelo de ML que predice con [AUC]% de precision...
RESULT: Si se implementa, podria recuperar [$] anuales y liberar [N] citas para
        pacientes en lista de espera...
```

**STAR para un inversor (para convertirlo en startup):**
```
SITUATION: Las organizaciones de salud en Latinoamerica pierden...
TENSION: Ninguna solucion actual aprovecha los datos electronicos para...
ACTION: Nuestra herramienta, probada en datos reales del MSP Ecuador...
RESULT: Proyectamos reducir el ausentismo en [X%] con un ROI de [Y]x...
```

Escribe ambos STARs y analiza: que cambia entre uno y otro aunque usen los mismos datos?

### Parte 4 — Evaluacion cruzada (5 min)

Usa Claude como evaluador:

```
PROMPT:
"Evalua este STAR de historia de datos contra estos 5 criterios.
Para cada criterio, da una puntuacion 1-5 y una sugerencia especifica de mejora.

[PEGA TU STAR]

Criterios:
1. SITUATION: Es concisa? Da solo el contexto necesario? (Max 2 oraciones)
2. TENSION: Genera genuina urgencia o curiosidad? Usa un dato impactante?
3. ACTION: Es especifica, con responsable y plazo claro?
4. RESULT: Es cuantificable y relevante para la audiencia especifica?
5. COHERENCIA: Las 4 partes fluyen como una historia logica?

Ademas: Podria el oyente resumir esta historia en una sola oracion?
Si la respuesta es no, el STAR necesita mas trabajo."
```

## Usa IA para...

- Pedirle a ChatGPT que genere 3 versiones del mismo STAR para tres audiencias diferentes (tecnica, ejecutiva, ciudadana) usando los mismos datos.
- Preguntarle a Claude cuando el framework STAR NO funciona bien y que otras estructuras narrativas podrian ser mejores.
- Pedirle que convierta tu STAR en un tweet de 280 caracteres, un email de 3 parrafos, y una diapositiva de presentacion — y que diste cuentas de cuanto cambia al cambiar el formato.

## Que aprendiste

- Que STAR es la estructura mas eficiente para comunicar hallazgos de datos a audiencias con poco tiempo.
- Que el mismo dato genera STARs completamente diferentes segun la audiencia y el objetivo.
- Que la Tension es la parte mas dificil y mas importante del framework — sin tension, no hay historia.
- Que el Result debe siempre conectar con lo que la audiencia valora, no con lo que el analista valora.

## Reto extra

Asiste a una reunion de trabajo real (en tu empresa, en un evento de networking, o en la sesion de un sabado de ITSEIA) donde alguien presente datos o informacion. Documenta: (1) estructura narrativa que uso (o no uso), (2) que STAR habrias construido con esos mismos datos, (3) si hubiera sido mas convincente tu version. Escribe el analisis en 200 palabras.
