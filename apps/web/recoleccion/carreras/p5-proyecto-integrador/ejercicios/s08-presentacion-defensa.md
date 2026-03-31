# Ejercicio Sesion 8: Presentacion Final y Defensa

**Materia:** Proyecto Integrador (Titulacion)
**Nivel:** Avanzado
**Herramienta IA:** Claude + Gamma.app
**Duracion:** 60 min

## Objetivo

Preparar y ejecutar la presentacion de defensa del proyecto integrador con el maximo nivel de profesionalismo: construir un pitch academico de 15 minutos, anticipar y preparar respuestas a las preguntas mas dificiles del jurado, y desarrollar la confianza para defender decisions tecnicas bajo presion.

## Contexto (Ecuador)

La defensa oral es el momento donde tu trabajo de 5 semanas se resume en 15 minutos frente a un jurado que puede incluir profesores, profesionales del sector, y representantes de empresas. Es la unica parte del proceso donde no hay una segunda oportunidad. La diferencia entre un 9 y un 7 suele ser la presentacion, no el codigo. Este ejercicio prepara esa presentacion con el mismo rigor con que preparaste el modelo.

## Instrucciones

### Parte 1 — Estructura de la presentacion de defensa (10 min)

Una defensa academica de 15 minutos tiene esta distribucion optima:

| Segmento | Duracion | Contenido | Slides |
|---|---|---|---|
| Apertura y contexto | 2 min | Problema en Ecuador, por que importa | 2 |
| Objetivos e hipotesis | 1 min | Pregunta de investigacion y lo que esperabas probar | 1 |
| Metodologia | 3 min | Dataset + pipeline + modelos comparados (con visuals) | 3 |
| Resultados | 4 min | Graficos de evaluacion + tabla comparativa + SHAP | 3 |
| Impacto y conclusiones | 3 min | Impacto real en Ecuador + trabajo futuro | 2 |
| Cierre | 2 min | Contribucion original + agradecimientos | 1 |
| **TOTAL** | **15 min** | | **12 slides** |

**Reglas de la presentacion academica (distintas del pitch de startups):**
- El jurado espera precision tecnica — no simplifiques demasiado
- Cada afirmacion cuantitativa debe tener su fuente visible
- Los graficos deben ser legibles a 5 metros de distancia (letra >=24pt)
- El codigo no se muestra en la presentacion (va al documento y al repositorio)
- Anticipa las preguntas: si el jurado no te pregunta algo obvio, lo notaron pero prefirieron no embarazarte

### Parte 2 — Construir las 12 slides de defensa (25 min)

Usa Gamma.app con este prompt:

```
PROMPT PARA GAMMA:
"Crea una presentacion de defensa academica de 12 slides para mi proyecto
de titulacion en tecnologia IA.

SLIDE 1 — PORTADA:
Titulo: [TU TITULO EXACTO]
Datos: ITSEIA | Tecnologia Superior en IA | [TU NOMBRE] | [FECHA]

SLIDE 2 — EL PROBLEMA:
Titulo: Ausentismo en citas del MSP: un problema de $[MONTO] anuales
Visual: Infografia con numero grande (% ausentismo) + mapa de Ecuador
Texto clave: 12 millones de citas/año, 25% de ausentismo, $X perdidos

SLIDE 3 — OBJETIVO E HIPOTESIS:
Titulo: Si se puede predecir, se puede prevenir
Pregunta de investigacion (en caja destacada)
Hipotesis con el umbral de exito numerico

SLIDE 4 — METODOLOGIA: DATOS:
Titulo: Dataset: [FUENTE] — [N] registros, [PERIODO]
Visual: Tabla de variables principales con tipos
Resaltar: tasa de ausentismo en el dataset y como se trato el desbalanceo

SLIDE 5 — METODOLOGIA: PIPELINE:
Titulo: Pipeline reproducible de 4 etapas
Visual: Diagrama de flujo (EDA → Preprocesamiento → Modelado → Evaluacion)
Mencionar: validacion cruzada 5-fold para evitar sobreajuste

SLIDE 6 — RESULTADOS: COMPARACION DE MODELOS:
Titulo: XGBoost supera al baseline en [X] puntos de AUC
Visual: Grafico de barras de los 4 modelos con AUC ± std
Resaltar el modelo ganador

SLIDE 7 — RESULTADOS: CURVA ROC:
Titulo: AUC-ROC = [VALOR] en conjunto de prueba independiente
Visual: Curva ROC con area sombreada, comparada con random classifier
Nota: Evaluado en [N] registros no vistos durante entrenamiento

SLIDE 8 — RESULTADOS: SHAP:
Titulo: Las 5 variables mas predictivas del ausentismo
Visual: Grafico SHAP horizontal (las 5 features mas importantes)
Interpretacion breve de las 2 features principales

SLIDE 9 — EQUIDAD Y SESGO:
Titulo: El modelo es equitativo entre subgrupos demograficos
Visual: Tabla o barras de AUC por genero, edad y region
Mencionar: ninguna disparidad > 0.05 puntos detectada (o lo que encontraste)

SLIDE 10 — IMPACTO EN ECUADOR:
Titulo: Potencial de ahorro: $[MONTO] anuales si se implementa en el MSP
Visual: Infografia con 3 numeros: citas recuperadas / ahorro / pacientes beneficiados
Nota: Basado en datos reales del Ministerio de Salud Publica

SLIDE 11 — LIMITACIONES Y TRABAJO FUTURO:
Titulo: Limitaciones y proximos pasos
3 limitaciones honestas del estudio
3 lineas de trabajo futuro especificas

SLIDE 12 — CONCLUSIONES:
Titulo: Si se puede predecir el ausentismo con [NIVEL DE PRECISION]
3 conclusiones principales como bullets
Contribucion original al conocimiento
Agradecimientos breves

ESTILO: Academico-profesional, paleta azul marino y dorado (colores ITSEIA),
tipografia clara, abundante espacio en blanco, enfasis en los numeros clave."
```

### Parte 3 — Preparacion del Q&A con Claude (20 min)

El Q&A (preguntas del jurado) es donde se gana o pierde la defensa. Prepara respuestas para las 15 preguntas mas probables:

```
PROMPT PARA CLAUDE:
"Soy el investigador de este proyecto de titulacion:
[PEGA EL RESUMEN DE TU PROYECTO]

Actua como un jurado academico exigente conformado por:
- Un profesor de ML que conoce los algoritmos en detalle
- Un profesional del sector [MSP / MAG / etc.] que no conoce ML pero si el problema
- Un investigador metodologico que evalua el rigor del diseño experimental

Genera las 15 preguntas MAS DIFICILES que este jurado haria durante la defensa.
Para cada pregunta:
1. Escribe la pregunta exacta como la haria el jurado
2. Indica quien la haria (el profesor ML / el profesional / el metodologico)
3. Que aspecto debil del proyecto esta sondeando
4. Como deberia responder el investigador en maximo 60 segundos
   (no evasivamente, sino defendiendo la decision con evidencia)"
```

De las 15 preguntas, practica en voz alta las respuestas a las 5 que mas te incomoden.

**Preguntas casi garantizadas para cualquier defensa de ML:**

1. "Por que eligio ese algoritmo y no [el que no usaste]?"
   → Respuesta: comparaste empiricamente y este gano; ademas [VENTAJA ESPECIFICA]

2. "Su dataset es de [LUGAR/FECHA]. Como garantiza que el modelo funcione en otro hospital/año?"
   → Respuesta: es una limitacion reconocida; para generalizar se necesitaria [ESTRATEGIA]

3. "Su AUC es X, pero en produccion, con que precision clasifica cada cita individual?"
   → Respuesta: con umbral de [VALOR], precision [X%] y recall [Y%]; la eleccion del umbral depende del costo de cada tipo de error

4. "Que pasa si el modelo hace una prediccion incorrecta? Cual es el riesgo real para el paciente?"
   → Respuesta: el riesgo de [FALSO POSITIVO] es [CONSECUENCIA]; de [FALSO NEGATIVO] es [CONSECUENCIA]; el modelo es una herramienta de apoyo, no reemplaza la decision humana

5. "Si tuviera que rehacerlo, que cambiaria?"
   → Respuesta (preparada y honesta): [ALGO QUE REALMENTE CAMBIARIAS + QUE APRENDISTE]

### Parte 4 — Simulacro de defensa (5 min)

Ejecuta un simulacro completo:

1. Cronometra tu presentacion de 12 slides. Si pasas de 15 minutos, identifica cual slide sobrepasa el tiempo y recorta.

2. Graba en video (aunque sea con el telefono) tu defensa completa.

3. Usa Claude para transcribir y evaluar:
```
PROMPT:
"Actua como evaluador academico de una defensa de titulacion.
Aqui esta la transcripcion de la presentacion:
[PEGA LA TRANSCRIPCION]

Evalua con esta rubrica y asigna una nota 1-10 a cada criterio:
1. Claridad de la presentacion del problema (10%)
2. Rigor metodologico comunicado (20%)
3. Interpretacion correcta de los resultados (20%)
4. Honestidad sobre limitaciones (15%)
5. Impacto y relevancia para Ecuador (15%)
6. Calidad de las visualizaciones (10%)
7. Manejo del tiempo y fluidez (10%)

Nota global con justificacion y los 3 aspectos a mejorar antes de la defensa real."
```

## Usa IA para...

- Pedirle a Claude que genere 5 preguntas trampa que el jurado podria hacer sobre el dataset (ej: "como verifica que los datos no tienen data leakage?").
- Pedirle que redacte una respuesta modelo de 45 segundos para la pregunta "por que su modelo es mejor que simplemente llamar a todos los pacientes?".
- Preguntarle como manejar profesionalmente el momento donde no sabes la respuesta a una pregunta del jurado.

## Que aprendiste

- Que las 15 minutos de presentacion requieren 10+ horas de preparacion para ejecutarse con naturalidad.
- Que el Q&A no se improvisa — las respuestas a las preguntas dificiles se preparan y ensayan.
- Que admitir limitaciones honestamente genera mas credibilidad ante el jurado que tratar de ocultarlas.
- Que la confianza en la defensa viene de conocer tu trabajo en profundidad, no de memorizar respuestas.

## Reto extra

Realiza una "defensa simulada" completa con dos companeros de clase actuando como jurado. Cada uno debe hacer al menos 3 preguntas dificiles basadas en los aspectos debiles que identifico Claude. Graba la sesion. Revisa el video 24 horas despues y documenta 5 momentos especificos donde podrias haber respondido mejor. Esa lista de mejoras es el ultimo paso de preparacion antes de la defensa real.
