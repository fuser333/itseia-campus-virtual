# Ejercicio Sesion 4: Prompt Engineering Basico

**Materia:** Introduccion a la Inteligencia Artificial
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Dominar las tecnicas fundamentales de Prompt Engineering para obtener respuestas de mucha mayor calidad de los modelos de IA, aplicadas a casos reales de trabajo y estudio en Ecuador.

## Contexto

El **Prompt Engineering** es la habilidad de comunicarle a una IA exactamente lo que necesitas. Un estudio de McKinsey 2024 encontro que los usuarios que dominan esta habilidad obtienen resultados **4 veces mas utiles** de la misma IA que usuarios sin entrenamiento. En Ecuador, esta habilidad ya diferencia a profesionales que usan IA superficialmente de quienes la usan como ventaja competitiva real.

La diferencia entre un prompt malo y uno bueno puede ser la diferencia entre un parrafo generico y un plan de negocio ejecutable.

## Instrucciones

### Parte A — Anatomia de un buen prompt

Un prompt efectivo tiene estos componentes:

```
[ROL] + [CONTEXTO] + [TAREA] + [FORMATO] + [RESTRICCIONES]
```

**Ejemplo de prompt MALO:**
```
Dame ideas de negocio en Ecuador
```

**Ejemplo de prompt BUENO:**
```
Actua como un consultor de negocios con 15 años de experiencia en Ecuador.
Tengo $5,000 de capital inicial y quiero iniciar un negocio digital en Quito
que pueda operar desde casa. Mi formacion es en administracion de empresas.
Dame exactamente 5 ideas de negocio ordenadas de mayor a menor potencial,
con: nombre del negocio, mercado objetivo, por que funciona en Ecuador hoy,
y cuanto tiempo tarda en recuperar la inversion. Usa vineteas y maximo
200 palabras por idea.
```

Identifica en el prompt BUENO: ¿donde esta el ROL? ¿el CONTEXTO? ¿la TAREA? ¿el FORMATO? ¿las RESTRICCIONES?

### Parte B — Los 6 patrones de prompts mas poderosos

Para cada patron, escribe tu propio prompt adaptado a tu contexto ecuatoriano:

**1. Patron ROL**
```
Actua como [especialista]. Tu tarea es [...]
```
Escribe un prompt usando este patron para: un asesor legal ecuatoriano que te explica como registrar una empresa en el SRI.

**2. Patron FEW-SHOT (ejemplos)**
```
Aqui hay 2 ejemplos del formato que quiero:
Ejemplo 1: [...]
Ejemplo 2: [...]
Ahora haz lo mismo para: [tu caso]
```
Escribe un prompt con 2 ejemplos para generar descripciones de productos para una tienda en Instagram Ecuador.

**3. Patron CADENA DE PENSAMIENTO**
```
Piensa paso a paso antes de responder: [pregunta]
```
Usa este patron para resolver: ¿Como calcular si un negocio de comida en Guayaquil es rentable con $2,000 de inversion?

**4. Patron CRITICO**
```
Dame tu respuesta. Luego actua como tu critico mas severo
y encuentra 3 fallas en lo que acabas de decir.
```
Usa este patron para evaluar un plan de marketing que hayas generado antes.

**5. Patron SIMPLIFICAR**
```
Explica [concepto tecnico] como si yo tuviera 12 años y viviera en Ecuador.
Usa una analogia con algo que conoceria un nino ecuatoriano.
```
Usa este patron para entender: ¿Que es una red neuronal?

**6. Patron ESTRUCTURA FORZADA**
```
Responde SOLO en este formato:
- Problema: [una oracion]
- Causa: [una oracion]
- Solucion: [maximo 3 pasos]
- Recursos: [links o herramientas]
```
Usa este patron para preguntar sobre como mejorar la atencion al cliente en una ferreteria quiteña.

### Parte C — Iteracion de prompts

Empieza con este prompt basico:
```
Ayudame a mejorar mi CV para trabajar en tecnologia en Ecuador.
```

Itera 3 veces mejorando el prompt con lo que aprendiste en la Parte B. Despues de cada iteracion, califica la respuesta del 1 al 10. Documenta:

| Iteracion | Prompt usado | Calificacion respuesta | Que mejoro |
|-----------|-------------|----------------------|------------|
| 1 | Prompt basico original | | |
| 2 | Mejorado con ROL + CONTEXTO | | |
| 3 | Mejorado con FORMATO + RESTRICCIONES | | |

## Usa IA para...

> Abre ChatGPT con este meta-prompt (un prompt sobre prompts):
> "Eres un experto en Prompt Engineering. Voy a darte un prompt mal escrito y quiero que: 1) Identifiques los problemas, 2) Lo reescribas con la estructura ROL+CONTEXTO+TAREA+FORMATO+RESTRICCIONES, 3) Expliques que cambiaste y por que. El prompt malo es: 'Necesito saber sobre marketing digital en Ecuador'."

Analiza la version mejorada que te da ChatGPT y compara con lo que harias tu.

## Que aprendiste

- El **Prompt Engineering** no es magia: es comunicacion clara y estructurada.
- El **patron ROL** cambia completamente el tono y expertise de la respuesta.
- **Few-shot prompting** (dar ejemplos) es la tecnica mas efectiva para formato consistente.
- La **iteracion** es clave: un buen prompt rara vez se logra en el primer intento.
- **Mas contexto = mejor respuesta**: la IA no adivina lo que necesitas, necesita que se lo digas.
- El Prompt Engineering es una habilidad que **tiene demanda laboral real** en 2024: hay roles pagados de $60K-$120K anuales en USA para esta especialidad.

## Reto extra

Disenate tu propio **"prompt maestro personal"** para el rol que quieres tener al graduarte de ITSEIA. Por ejemplo: "Actua como [tu cargo soñado] en [empresa que te interesa] en Ecuador. Cada vez que te haga una pregunta tecnica, responde como lo haria ese profesional, usando terminologia del sector, citando herramientas reales y considerando el contexto del mercado ecuatoriano." Prueba este prompt con 5 preguntas distintas y documenta los resultados.
