# Ejercicio Sesion 6: Etica en Datos — Consentimiento, Transparencia y Dignidad

**Materia:** Etica Digital y Responsabilidad Profesional
**Nivel:** Intermedio
**Herramienta IA:** Gemini
**Duracion:** 40 min

## Objetivo
Aplicar los principios eticos de consentimiento informado, transparencia algorítmica y dignidad de los datos en el diseno de sistemas que manejan datos personales de ciudadanos ecuatorianos, especialmente de poblaciones vulnerables.

## Contexto (Ecuador)
El INEC Ecuador recolecta datos de mas de 17 millones de ecuatorianos. El Ministerio de Salud tiene historiales medicos digitales de millones de personas. El SRI tiene datos financieros de toda la economia formal. Estos datos son usados para investigacion, politica publica y proyectos de IA. En muchos casos, los ciudadanos no saben que sus datos se usan, no entendieron lo que aceptaron en los "terminos y condiciones", o son grupos vulnerables (ninos, adultos mayores, comunidades indigenas) que no pueden dar consentimiento informado de manera efectiva.

## Instrucciones (paso a paso)

**Paso 1 — Analiza formularios de consentimiento reales (10 min)**
Encuentra en internet el formulario de consentimiento informado de UNO de estos servicios digitales ecuatorianos:
- Portal del Ministerio de Salud (Mi Salud Ecuador)
- App del Municipio de Quito
- Portal del IESS (Instituto Ecuatoriano de Seguridad Social)
- App de cualquier banco ecuatoriano

Evalua el formulario con estos criterios:
| Criterio | Puntaje 1-5 | Evidencia |
|----------|-------------|----------|
| Lenguaje comprensible para una persona sin educacion superior | ? | |
| Explica especificamente para que se usaran los datos | ? | |
| Menciona si los datos seran compartidos con terceros | ? | |
| Explica como revocar el consentimiento | ? | |
| Disponible en idiomas indigenas (kichwa, shuar) | ? | |

**Paso 2 — Disena un formulario de consentimiento etico (15 min)**
Imagina que eres el lider tecnico de un proyecto del Ministerio de Salud Ecuador para recolectar datos de salud de comunidades indigenas de la Amazonia para entrenar un modelo de IA de diagnostico de enfermedades tropicales.

Disena los elementos clave de un formulario de consentimiento VERDADERAMENTE informado que incluya:
1. Que datos se recolectan (especificos, no vagos)
2. Para que se usaran (incluyendo entrenamiento de IA)
3. Con quien se compartiran
4. Por cuanto tiempo se guardaran
5. Como pueden retirar su consentimiento
6. Que pasa con sus datos si retiran el consentimiento
7. Contacto para preguntas
8. Que NUNCA se hara con sus datos (lista negativa de usos prohibidos)

Nota: considera que muchas personas en comunidades amazonicas de Ecuador tienen acceso limitado a internet y pueden no leer el espanol formal. Que adaptaciones incluirias?

**Paso 3 — Revision critica con Gemini (15 min)**

```
Soy estudiante de etica en datos en Ecuador. Diseñe este formulario de consentimiento para un proyecto de IA con comunidades indigenas amazónicas:
[pega tu formulario]
Por favor:
1. Es verdaderamente comprensible para alguien sin educacion universitaria?
2. El formulario cumple con los requisitos de la LOPDP Ecuador?
3. Hay algun uso de datos que no mencione pero que podria ocurrir en un proyecto de IA?
4. Segun el principio de "dignidad de datos" (Data Dignity), los participantes son tratados como duenos de sus datos o como fuente de datos?
5. Que adaptacion cultural especifica necesita este formulario para comunidades kichwas o shuaras de Ecuador?
```

## Usa IA para...
Identificar brechas de consentimiento que no son obvias y obtener perspectiva sobre adaptaciones culturales para poblaciones vulnerables ecuatorianas.

## Que aprendiste
- El consentimiento informado real exige que el usuario entienda, no solo que haga click en "acepto"
- Los datos de poblaciones vulnerables (ninos, adultos mayores, comunidades indigenas) requieren protecciones adicionales
- "Dignidad de datos" significa que los datos de una persona son extension de esa persona, no un recurso a explotar

## Reto extra
Investiga el concepto de "Maori Data Sovereignty" de Nueva Zelanda, donde las comunidades indigenas negociaron derechos colectivos sobre datos que las involucran. Escribe 200 palabras sobre como este modelo podria aplicarse a las comunidades indigenas del Ecuador (Kichwa, Shuar, Achuar, Waorani) en el contexto de proyectos de IA del Estado ecuatoriano.
