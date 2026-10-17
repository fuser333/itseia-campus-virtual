# Ejercicio Sesion 5: Presentaciones Ejecutivas con Datos

**Materia:** Storytelling con Datos
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT + Gamma.app
**Duracion:** 55 min

## Objetivo

Dominar la comunicacion de datos a audiencias ejecutivas de alto nivel, aplicar el principio de "piramide invertida" de McKinsey para estructurar cualquier presentacion de datos, construir slides de datos con densidad informativa optima, y defender analisis bajo presion de preguntas de directivos.

## Contexto (Ecuador)

Un analista de datos que llega a gerencia en Ecuador generalmente tiene 10 minutos en la agenda del comite ejecutivo. Esos 10 minutos deciden si su analisis tiene impacto o muere en una carpeta. La habilidad de comunicar datos a ejecutivos — personas que toman 50 decisiones al dia y tienen segundos para cada una — es la competencia profesional mas cotizada y menos ensenada en los programas de datos en Ecuador.

## Instrucciones

### Parte 1 — La piramide invertida de McKinsey (10 min)

McKinsey, Bain y BCG usan esta estructura para TODAS sus presentaciones:

```
ESTRUCTURA PIRAMIDE INVERTIDA:

NIVEL 1 — RECOMENDACION (lo mas importante, primero)
"Recomendamos implementar X porque genera un retorno de Y en Z meses"

NIVEL 2 — EVIDENCIA CLAVE (los 3 datos que prueban la recomendacion)
"Evidencia 1: [dato] — Evidencia 2: [dato] — Evidencia 3: [dato]"

NIVEL 3 — ANALISIS DE SOPORTE (si el ejecutivo quiere profundizar)
"Como calculamos ese retorno..." / "Que supuestos usamos..."

NIVEL 4 — DATOS RAW (disponible pero raramente leido)
"Los datasets completos estan en el anexo"
```

La mayoria de presentaciones hacen lo opuesto: 40 slides de analisis y la recomendacion en el slide 41. Para entonces, el ejecutivo ya dejo de escuchar.

Ejercicio: Toma un analisis que hayas hecho en cualquier materia del programa. Reescribe la estructura usando la piramide invertida en 4 niveles.

### Parte 2 — El slide ejecutivo de datos: anatomia (15 min)

Un slide ejecutivo bien diseñado tiene 5 elementos, no mas:

```
ANATOMIA DE UN SLIDE EJECUTIVO PERFECTO:

1. TITULO-CONCLUSION (en el tope, el mas grande)
   Mal: "Analisis de ventas Q1 2024"
   Bien: "Las ventas cayeron 18% en Q1 por ausentismo de equipo comercial"

2. DATO HERO (el numero mas importante, enorme)
   Un solo numero que resume el punto principal
   Contexto: "+/-X% vs trimestre anterior" o "vs benchmark industria"

3. VISUALIZACION SUPPORTING (una sola)
   El grafico mas simple que prueba el titulo-conclusion
   Maximo 5 series de datos; si tiene mas, agrupa

4. FOOTNOTES (pequeño, al fondo)
   Fuente de los datos + metodo de calculo + supuestos clave
   El ejecutivo que quiera verificar sabe donde buscar

5. NEXT STEP (opcional pero poderoso)
   "Accion recomendada: [ESPECIFICA] para [FECHA] por [RESPONSABLE]"
```

Ejercicio: Diseña en papel (o en Gamma) un slide ejecutivo para comunicar este dato:
"El MSP Ecuador registro 12.4 millones de citas medicas en 2024. El 24.7% (3.06 millones) no fueron atendidas. El costo estimado por cita perdida es $15 USD (personal + infraestructura). Nuestro modelo de ML predice correctamente el 78% de los ausentismos con 48 horas de anticipacion."

### Parte 3 — Construir una presentacion ejecutiva completa (25 min)

Construye una presentacion de 6 slides para presentar los resultados de tu proyecto integrador a un comite ejecutivo del MSP:

```
PROMPT PARA GAMMA:
"Crea una presentacion ejecutiva de 6 slides para un comite directivo
del Ministerio de Salud Publica de Ecuador.

REGLAS CRITICAS:
- CADA SLIDE tiene un titulo que es una CONCLUSION, no un topico
- MAXIMO 20 palabras de texto por slide (sin contar titulos y pie de graficos)
- UN numero hero grande por slide
- Los graficos son los del modulo de evaluacion del proyecto integrador
- El slide 1 tiene la recomendacion principal (no el problema)
- El slide 6 tiene los proximos pasos especificos con responsables y fechas

SLIDES:
1. RECOMENDACION: 'Implementar el sistema predictivo reduce el ausentismo
   en [X%] y ahorra $[Y] anuales al MSP'

2. EL PROBLEMA EN NUMEROS: '3 de cada 12 citas del MSP no se atienden —
   $[COSTO] perdidos en 2024'

3. NUESTRA SOLUCION: 'Un modelo de IA que predice el ausentismo con
   [AUC]% de precision 48h antes'

4. RESULTADOS DEL PILOTO: 'En datos reales del MSP, el modelo identifico
   [N] ausentismos evitables por mes'

5. ROI Y COSTOS DE IMPLEMENTACION: 'La inversion se recupera en [X] meses
   con ahorro anual de $[Y]'

6. PLAN DE ACCION: 'Piloto en 3 centros de salud en 60 dias — responsable:
   Direccion de Tecnologia MSP'

ESTILO: Sobrio, gubernamental pero moderno. Paleta azul marino y verde
ecuatoriano. Sin decoraciones innecesarias."
```

### Parte 4 — Manejo de preguntas dificiles de ejecutivos (5 min)

Los ejecutivos hacen preguntas diseñadas para probar si el analista conoce sus numeros o solo los copio:

**Las 5 preguntas trampa mas comunes y como responderlas:**

1. "Por que no lo hacemos nosotros en lugar de implementar un sistema externo?"
   Respuesta correcta: No es evasion — es dar el costo real de construirlo internamente (tiempo, talento, mantenimiento) vs implementar una solucion existente.

2. "Ese 78% de precision, como se compara con lo que hace nuestro equipo hoy?"
   Respuesta correcta: El baseline humano actual es [X%] — el modelo supera/iguala/se aproxima al humano. SIEMPRE calcula el baseline humano antes de la presentacion.

3. "Los datos son de 2023. Siguen siendo validos para 2025?"
   Respuesta correcta: El modelo fue entrenado con datos hasta [FECHA]. El drift de datos es un riesgo real; recomendamos reentrenamiento cada [PERIODO] con datos nuevos.

4. "Que pasa si el modelo falla?"
   Respuesta correcta: El sistema es de apoyo, no reemplaza la decision humana. Un fallo significa volver al proceso actual, sin costo adicional.

5. "Tienen datos de otros paises que muestren que esto funciona?"
   Respuesta correcta: [Cita los papers de tu revision de literatura con casos de exito en Latinoamerica].

Prepara respuestas de 45 segundos para las 5 preguntas aplicadas a tu proyecto especifico.

## Usa IA para...

- Pedirle a Claude que actue como Director de Tecnologia del MSP y haga las 5 preguntas mas dificiles sobre tu presentacion.
- Pedirle a ChatGPT que reescriba los titulos de tus 6 slides para que sean "conclusions" y no "topicos".
- Preguntarle a Claude como calcular el baseline humano para comparar tu modelo (la precision del proceso actual sin IA).

## Que aprendiste

- Que la piramide invertida — recomendacion primero, evidencia despues — es la estructura que respeta el tiempo del ejecutivo.
- Que un slide ejecutivo bien diseñado comunica en 5 segundos de lectura rapida.
- Que las preguntas dificiles de ejecutivos siempre son variaciones de "como sabes que esto es real?" y "que pasa si falla?" — se pueden preparar.
- Que el baseline humano es la comparacion mas importante para cualquier modelo de IA presentado a no tecnicos.

## Reto extra

Consigue una reunion real de 15 minutos con un gerente o director en cualquier empresa u organizacion ecuatoriana (puede ser el director de tu empresa, un familiar con cargo directivo, o un profesional de tu red). Presenta el analisis de tu proyecto integrador usando la estructura de 6 slides. Graba la sesion (con permiso). Documenta las preguntas que hizo y compara con las que predijiste. Que te sorprendio?
