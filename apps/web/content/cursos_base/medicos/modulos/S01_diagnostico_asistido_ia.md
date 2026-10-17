# S-01: IA en Diagnostico Asistido

**Tipo:** Leccion
**Duracion:** 60 minutos
**Semana:** 2 — Modulo 5 de 9
**Curso:** IA para Profesionales de la Salud — ITSEIA Academy

---

> **AVISO IMPORTANTE:** La IA no reemplaza el criterio clinico profesional. El diagnostico diferencial generado por IA es un apoyo al razonamiento clinico del profesional, no un diagnostico definitivo. La responsabilidad de la decision diagnostica recae siempre en el medico tratante.

---

## Objetivo de Aprendizaje

Al finalizar este modulo seras capaz de:

- Integrar herramientas de IA en el proceso de elaboracion de diagnostico diferencial
- Usar Glass Health para generar y evaluar diferenciales de manera estructurada
- Aplicar tecnicas de prompting especificas para diagnostico con ChatGPT y Claude
- Identificar los limites del diagnostico asistido por IA en el contexto ecuatoriano

---

## Seccion 1: El Proceso Diagnostico y el Lugar de la IA

### Como razona un medico al diagnosticar

El proceso diagnostico clasico involucra:

1. Anamnesis: historia del problema actual, antecedentes, revision por sistemas
2. Examen fisico: signos y hallazgos objetivos
3. Hipotesis diagnosticas: lista inicial basada en patron de presentacion
4. Pruebas seleccionadas: para confirmar o descartar hipotesis
5. Sintesis: diagnostico de trabajo + diferenciales activos
6. Decision terapeutica y plan de seguimiento

La IA puede aportar valor principalmente en el **paso 3** (hipotesis diagnosticas) y en parte del **paso 4** (sugerir pruebas clave para cada hipotesis). En los demas pasos, el rol del medico es insustituible.

### El valor de un buen diferencial

El diagnostico diferencial no es un ejercicio academico. Es la herramienta que evita el cierre prematuro del diagnostico — el sesgo de anclar en la primera hipotesis plausible y dejar de buscar.

La IA es especialmente util aqui porque:
- Puede considerar simultaneamente un mayor numero de condiciones que la memoria de trabajo humana
- No tiene el sesgo de disponibilidad del medico (no "recuerda" mas el ultimo caso visto)
- Puede integrar sistematicamente informacion de multiples sistemas

La IA es menos util porque:
- No evaluo al paciente
- No percibe su aspecto general, tono de voz, nivel de angustia
- No conoce el contexto epidemiologico local de ese paciente especifico
- Puede no conocer la prevalencia de ciertas condiciones en Ecuador

---

## Seccion 2: Glass Health — La Herramienta Disenada para Medicos

### Que es Glass Health

Glass Health (glass.health) es una herramienta de IA disenada especificamente para medicos. Genera diagnosticos diferenciales y planes de manejo a partir de notas clinicas ingresadas en texto libre. A diferencia de ChatGPT, esta entrenada especificamente en literatura medica y guias clinicas.

### Como usarla

**Acceso:** glass.health (freemium — funciones basicas gratuitas, funciones avanzadas de pago)

**Paso a paso:**

1. Crear cuenta gratuita en glass.health
2. En la pantalla principal, hay un campo de texto libre
3. Escribir la presentacion clinica del caso (anonimizada):

```
Ejemplo de ingreso:
"Female patient, 52 years old, presenting with 6 weeks of progressive fatigue,
polyuria, polydipsia, and 4kg weight loss. HbA1c 9.2%, creatinine 1.4 mg/dL.
Current medications: metformin 1g BID for 5 years. History of hypertension
controlled with losartan."
```

4. Hacer click en "Generate DDx" (diagnostico diferencial)
5. La herramienta genera: lista de diagnosticos ordenados por probabilidad + puntos clave de cada uno + examenes recomendados para confirmar

**Nota:** Glass Health funciona mejor en ingles. Si escribes en espanol, el resultado puede ser menos preciso. Recomendamos escribir el caso en ingles para usar esta herramienta.

### Lo que Glass Health hace bien

- Genera diferenciales ordenados y justificados
- Sugiere examenes especificos para cada hipotesis
- Incluye "red flags" cuando las identifica
- Es mas conservadora que ChatGPT en incluir condiciones raras sin justificacion

### Limitaciones de Glass Health en el contexto ecuatoriano

- Entrenada principalmente en poblacion norteamericana
- Puede sugerir examenes o tratamientos no disponibles en el sistema publico del Ecuador
- Las prevalencias asumidas corresponden a epidemiologia EEUU, no Ecuador
- Enfermedades endemicas ecuatorianas (dengue, malaria en zonas de riesgo, Chagas) pueden estar subrepresentadas

**Estrategia de compensacion:** Despues de obtener el diferencial de Glass Health, agrega manualmente al razonamiento las condiciones prevalentes en tu contexto local que la herramienta pudo haber omitido.

---

## Seccion 3: ChatGPT y Claude para Diagnostico Diferencial — Tecnica Avanzada

### El prompt de diagnostico diferencial completo

Esta es la estructura de prompt que genera mejores resultados para diagnostico:

```
Actua como internista con experiencia clinica en medicina de adultos.

PRESENTACION CLINICA:
- Paciente: [sexo], [rango de edad] años
- Motivo de consulta: [principal sintoma, tiempo de evolucion]
- Sintomas acompanantes: [lista]
- Signos vitales: [si relevantes]
- Examen fisico relevante: [hallazgos clave]
- Laboratorios disponibles: [si aplica]
- Antecedentes relevantes: [diagnosticos previos, medicacion]
- Contexto: [zona geografica si es relevante, exposicion especifica]

TAREA:
Genera un diagnostico diferencial estructurado con:
1. Lista de hasta 8 diagnosticos ordenados de mayor a menor probabilidad
2. Para cada uno: razonamiento breve (1-2 oraciones) y examen clave para confirmar
3. Identifica si hay alguna "bandera roja" que requiera manejo urgente
4. Indica explicitamente si alguna de tus sugerencias tiene baja confianza

IMPORTANTE: Si no tienes suficiente informacion para hacer una sugerencia confiable,
dilo explicitamente en lugar de inventar. No generes referencias bibliograficas
a menos que las tengas completamente seguras.
```

### Casos clinicos prevalentes en Ecuador — Ejemplos con prompt

**Caso 1: Fiebre aguda en zona costera**

```
Actua como infectologo con experiencia en enfermedades tropicales.

PRESENTACION: Paciente masculino, 28 años, residente en zona costera ecuatoriana
(provincia de Esmeraldas). Fiebre de 39.5C de 4 dias de evolucion, mialgia
intensa, cefalea frontal, sin tos. Examen: leve hepatomegalia palpable,
sin signos de irritacion meningea. Plaquetas: 89,000.

CONTEXTO LOCAL: Ecuador, agosto (epoca lluviosa en costa).

Genera diferencial priorizando condiciones prevalentes en la costa ecuatoriana.
Incluye dengue, malaria y otras arbovirosis como prioridad.
Sugiere examenes disponibles en hospital de primer nivel del MSP.
```

**Caso 2: Sintomas respiratorios en la Sierra**

```
Actua como neumolago con experiencia en medicina de altitud.

PRESENTACION: Paciente femenino, 35 años, residente en Quito (altitud 2850 msnm).
Tos productiva de 3 semanas, esputo amarillo-verdoso, febricula vespertina.
Perdida de peso 3kg en 6 semanas. Trabaja como educadora. Sin tratamiento previo.
PPD: pendiente. Rx torax: patron infiltrativo en lobulo superior derecho.

Genera diferencial con enfasis en tuberculosis pulmonar y condiciones similares,
considerando la alta prevalencia de TB en Ecuador (MSP ESNIT).
```

**Caso 3: Control de enfermedad cronica**

```
Actua como internista especializado en enfermedades metabolicas.

CONTROL CRONICO — Paciente femenino, 52 años, diabetica tipo 2 de 7 años
de evolucion. Consulta por fatiga progresiva 6 semanas, poliuria,
perdida de peso 4kg. Medicacion actual: metformina 1g c/12h.
Laboratorios hoy: HbA1c 9.2%, glucosa 245mg/dL, creatinina 1.4mg/dL,
potasio 4.2, sodio 138.

Lista de preguntas clave:
1. Cuales son las causas mas probables de la descompensacion de su diabetes?
2. Como interpreto la creatinina de 1.4 en esta paciente?
3. Que ajustes de medicacion debo considerar dado el perfil renal?
4. Que examenes adicionales son prioritarios?

Responde de forma concisa y orientada a la accion. Sin inventar referencias.
```

---

## Seccion 4: Documentando el Razonamiento Diagnostico con IA

### Por que documentar el uso de IA

En el contexto medico-legal ecuatoriano, la historia clinica es el documento principal de soporte ante cualquier cuestionamiento de la atencion. Si utilizas IA en tu proceso diagnostico, es buena practica:

1. **No atribuir el diagnostico a la IA:** La nota clinica debe reflejar tu razonamiento clinico, no el de la herramienta
2. **No citar la herramienta en el expediente como fuente:** "Segun ChatGPT, el diagnostico es..." es clinicamente inadecuado y medico-legalmente problemático
3. **Usar el resultado de la IA como insumo de tu razonamiento**, no como conclusion

### Formula de documentacion recomendada

En lugar de:
```
PLAN DIAGNOSTICO: ChatGPT sugiere considerar diabetes descompensada, hipotiroidismo
y anemia como causas de la fatiga. [INCORRECTO]
```

Usar:
```
PLAN DIAGNOSTICO: En base a la presentacion clinica (fatiga, poliuria, perdida de peso,
HbA1c 9.2% y creatinina 1.4), el cuadro es compatible con descompensacion diabetica
y riesgo de enfermedad renal cronica en estadio temprano como comorbilidad.
Diagnosticos diferenciales a descartar: hipotiroidismo (solicitar TSH),
anemia (CBC completo) y cardiopatia isquemica silente dada la edad y DM. [CORRECTO]
```

El razonamiento es tuyo. La IA fue una herramienta de apoyo que no aparece en la nota.

---

## Seccion 5: Enfermedades Prevalentes en Ecuador — Lo que la IA Puede Omitir

Este es el punto donde el medico ecuatoriano debe complementar a la IA con conocimiento local.

### Condiciones que suelen subrepresentarse en diferenciales de IA para Ecuador

**Enfermedades infecciosas y parasitarias:**
- Dengue (y sus variantes hemorragica, severa)
- Malaria (Plasmodium vivax principalmente en costa y Oriente)
- Enfermedad de Chagas (zonas endemicas del Ecuador)
- Leishmaniasis cutanea y visceral
- Bartonelosis (verruga peruana, zonas andinas)
- Fasciolosis hepatica (ganaderia, zonas andinas)
- Hidatidosis (en contacto con ganado ovino)

**Problemas de salud publica frecuentes:**
- Tuberculosis pulmonar (alta prevalencia, subdiagnosticada)
- Desnutricion cronica y sus consecuencias en adultos
- Intoxicacion por plaguicidas (zonas agricolas)
- Complicaciones de diabetes e HTA no controladas (alta prevalencia)

**Consideraciones de altitud:**
- Mal de altura (turistas, migrantes de costa a Sierra)
- Poliglobulia secundaria
- Cardiopatia hipertensiva por altitud

**Practica recomendada:** Al obtener un diferencial de cualquier herramienta de IA, preguntate: "Este diferencial refleja a mis pacientes en Ecuador o a los pacientes del norte de Texas?"

---

## Resumen del Modulo

| Herramienta | Mejor uso clinico | Limitacion clave |
|-------------|------------------|-----------------|
| Glass Health | Diferencial estructurado rapido | Poblacion EEUU, mejor en ingles |
| ChatGPT Plus | Diferencial con contexto complejo, iteracion | Riesgo alucinacion, verificar dosis |
| Claude | Analisis de historia clinica larga | Mas conservador, puede ser menos especifico |

**Regla de integracion:** IA genera el diferencial → medico evalua con contexto local y examen fisico → medico decide prioridades → medico documenta su razonamiento

---

## Ejercicio Rapido (15 minutos)

Selecciona uno de los tres casos siguientes y usa Glass Health O ChatGPT para generar el diagnostico diferencial:

**Caso A:** Mujer, 40 años, residente en Guayaquil, fiebre 5 dias, artralgia, exantema maculopapular.

**Caso B:** Hombre, 65 años, Sierra ecuatoriana, tos cronica 4 meses, sudoracion nocturna, IMC 19.

**Caso C:** Mujer, 28 años, Quito, palpitaciones episodicas, perdida de peso 6 kg en 3 meses, nerviosismo, intolerancia al calor.

Despues de obtener el diferencial:
1. Identifica si la herramienta incluyo alguna condicion prevalente en Ecuador
2. Agrega manualmente cualquier diagnostico que consideres debe estar y que la IA omitio
3. Define los 3 examenes que pediras primero y por que

---

*Siguiente modulo: S-02 — Documentacion clinica automatizada*

*Modulo creado por ITSEIA Academy | Marzo 2026 | Revision medica pendiente*
*La IA no reemplaza el criterio clinico profesional.*
