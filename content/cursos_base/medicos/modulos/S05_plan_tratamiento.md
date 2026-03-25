# S-05: Plan de Tratamiento Asistido por IA

**Tipo:** Caso Practico
**Duracion:** 45 minutos
**Semana:** 4 — Modulo 9 de 9 (Caso Practico Final)
**Curso:** IA para Profesionales de la Salud — ITSEIA Academy

---

> **DISCLAIMER OBLIGATORIO:** Este caso es completamente ficticio y ha sido creado exclusivamente con fines educativos. Los datos del paciente, los resultados de laboratorio y cualquier detalle clinico son inventados. Este caso practico NO debe usarse como guia clinica real. Las decisiones de tratamiento en pacientes reales deben basarse en la evaluacion clinica directa, las guias vigentes del MSP/ADA/OPS y el criterio del profesional de salud responsable.

> **AVISO IMPORTANTE:** La IA no reemplaza el criterio clinico profesional. Este ejercicio te ensena a usar herramientas de IA como apoyo al razonamiento clinico. La responsabilidad de cualquier decision medica recae siempre en el profesional de salud.

---

## Introduccion al Caso Practico

Este es el modulo final del curso. Aqui integras todo lo aprendido: las herramientas, las tecnicas de prompting, la busqueda de evidencia y el criterio clinico.

El caso fue disenado para reflejar una situacion clinica frecuente en la consulta ecuatoriana: una paciente diabetica de mediana edad con mal control y senales de dano organico incipiente. Un caso que cualquier medico general, internista o endocrinologo en Ecuador enfrenta regularmente.

**Tiempo estimado:** 45 minutos
**Herramientas requeridas:** ChatGPT Plus o Claude + Elicit
**Entregable final:** Checklist de 5 items completados

---

## El Escenario Clinico

### Paciente: "Maria G."

*(Paciente ficticia creada para este caso practico educativo)*

**Datos demograficos (ficticios):**
- Iniciales: M.G.
- Edad: 52 anos
- Sexo: femenino
- Ocupacion: ama de casa, zona urbana de la Sierra ecuatoriana
- Nivel educativo: bachillerato
- Cobertura de salud: IESS (esposo afiliado activo)

### Motivo de Consulta

Maria acude a control mensual de su diabetes tipo 2. Refiere que en las ultimas 6 semanas ha notado:

- **Fatiga cronica** de inicio insidioso, que limita actividades del hogar
- **Poliuria:** levantarse 2-3 veces por noche a orinar, orina abundante durante el dia
- **Perdida de peso:** ha bajado 4-5 kg en 6 semanas sin cambio intencional de dieta
- Sin dolor de cabeza, sin vision borrosa nueva, sin dolor toracico
- Niega polifagia actualmente (al contrario, refiere algo de nauseas ocasionales)

### Historia Clinica Resumida

**Antecedente personal patologico principal:** Diabetes mellitus tipo 2, diagnosticada hace 8 anos en el IESS. Control irregular — asiste a consulta de control "cuando puede", aproximadamente cada 2-3 meses.

**Otros antecedentes personales:**
- Hipertension arterial diagnosticada hace 3 anos, controlada (refiere)
- Sobrepeso/obesidad: peso habitual 82 kg, talla 1.58m, IMC habitual 32.8
- Sin antecedentes quirurgicos
- Sin alergias medicamentosas conocidas
- No fuma, no consume alcohol de manera regular

**Antecedentes familiares:** Madre fallecida por "problemas del rinon" (probable nefropatia diabetica). Padre con HTA e IAM a los 68 anos.

**Revision por sistemas (resumida):**
- Cardiovascular: sin disnea de esfuerzo, sin edema de miembros inferiores
- Neurológico: parestesias en plantas de los pies que refiere "desde hace un par de anos" — no le habia mencionado antes
- Oftalmologico: no ha ido al oftalmologo en los ultimos 3 anos
- Renal: sin disuria, sin hematuria

### Medicacion Actual

| Medicamento | Dosis | Frecuencia | Tiempo de uso |
|-------------|-------|-----------|---------------|
| Metformina | 850 mg | c/12h | 8 anos |
| Losartan | 50 mg | 1 vez al dia (manana) | 3 anos |
| Atorvastatina | 20 mg | 1 vez al dia (noche) | 2 anos |

Refiere no haber tomado la metformina de manera regular en los ultimos 2 meses "porque a veces se le olvida con tanto trabajo."

### Signos Vitales en la Consulta

| Parametro | Valor |
|-----------|-------|
| Tension arterial | 142/88 mmHg |
| Frecuencia cardiaca | 88 lpm |
| Temperatura | 36.7 C |
| Frecuencia respiratoria | 18 rpm |
| Saturacion de oxigeno | 97% (altitud 2850 msnm) |
| Peso actual | 77 kg |
| Talla | 1.58 m |
| IMC actual | 30.9 |

### Laboratorios Recientes

*(Tomados hace 5 dias, enviados por el IESS)*

| Examen | Resultado | Valor de referencia |
|--------|-----------|---------------------|
| Glucosa en ayunas | 248 mg/dL | 70-99 mg/dL |
| HbA1c | 9.2% | < 5.7% (normal), objetivo DM < 7% |
| Creatinina serica | 1.4 mg/dL | 0.5-1.1 mg/dL (mujeres) |
| BUN | 22 mg/dL | 7-20 mg/dL |
| Sodio | 138 mEq/L | 136-145 mEq/L |
| Potasio | 4.2 mEq/L | 3.5-5.0 mEq/L |
| Colesterol total | 228 mg/dL | < 200 mg/dL deseable |
| LDL colesterol | 142 mg/dL | < 100 mg/dL en diabetico |
| HDL colesterol | 44 mg/dL | > 50 mg/dL en mujeres |
| Trigliceridos | 198 mg/dL | < 150 mg/dL |
| ALT (TGP) | 32 U/L | 7-45 U/L |
| AST (TGO) | 28 U/L | 10-40 U/L |
| TSH | No solicitada | --- |
| Microalbuminuria | No solicitada | --- |
| Hemograma | Hemoglobina 11.8 g/dL | 12-16 g/dL mujeres |

**Calculo de TFG estimada (CKD-EPI):**
Con creatinina 1.4, mujer, 52 anos: TFG estimada ~44 ml/min/1.73m2 — corresponde a ERC estadio 3a (si se confirma en 2 controles con 3 meses de diferencia).

---

## Las 6 Tareas del Caso Practico

Tienes 45 minutos. Trabaja en orden. No saltes pasos.

---

### Tarea 1: Revisar las Guias ADA 2025 con Elicit (8 minutos)

**Objetivo:** Identificar las recomendaciones actuales de la ADA para el manejo de DM tipo 2 con ERC incipiente.

**Instrucciones:**

1. Abre Elicit (elicit.com)
2. Busca con esta pregunta:

```
ADA 2025 standards of care diabetes type 2 chronic kidney disease
metformin use eGFR treatment goals HbA1c
```

3. Revisa los articulos que aparecen sobre las guias ADA o articulos relacionados
4. Complementa con esta segunda busqueda:

```
SGLT2 inhibitors cardiovascular protection type 2 diabetes chronic kidney disease
evidence outcomes
```

5. Responde las siguientes preguntas antes de continuar:

   a) Segun las guias ADA 2025 (o la edicion mas reciente disponible en Elicit), cual es el objetivo de HbA1c para una paciente como Maria (62 anos, ERC estadio 3)?

   b) Esta contraindicada la metformina con una TFG de 44 ml/min? Cual es el umbral actual segun ADA?

   c) Que clase de farmacos tiene evidencia de beneficio cardiovascular Y renoprotector en DM2 con ERC?

**Anota tus respuestas** — las necesitaras para la Tarea 3.

---

### Tarea 2: Diagnostico Diferencial con ChatGPT o Claude (8 minutos)

**Objetivo:** Identificar las causas mas probables de la descompensacion y los hallazgos del laboratorio.

**Instrucciones:**

Usa este prompt en ChatGPT o Claude (recuerda: datos anonimizados):

```
Actua como internista con experiencia en diabetologia.

CASO CLINICO (anonimizado):
Paciente femenino, 52 anos, DM2 de 8 anos de evolucion con control irregular.
Presenta en las ultimas 6 semanas: fatiga progresiva, poliuria, perdida de peso
4-5kg, nauseas ocasionales.
Medicacion actual: metformina 850mg c/12h (con adherencia irregular), losartan 50mg/dia,
atorvastatina 20mg/noche.
TA hoy: 142/88 mmHg (hipertensa conocida).

Laboratorios recientes:
- Glucosa ayunas: 248 mg/dL
- HbA1c: 9.2%
- Creatinina: 1.4 mg/dL (TFG estimada ~44 ml/min)
- LDL: 142 mg/dL (objetivo <100 en DM)
- Trigliceridos: 198 mg/dL
- Hemoglobina: 11.8 g/dL (anemia leve)
- Potasio: 4.2 (normal)
- TSH: no solicitada
- Microalbuminuria: no solicitada

Parestesias en plantas de pies referidas desde hace 2 anos.

PREGUNTAS:
1. Cuales son las causas mas probables de su descompensacion diabetica?
   (incluye factores modificables y no modificables)

2. Como interpretas la creatinina de 1.4 en esta paciente?
   Es ERC establecida o puede ser otra causa? Que examenes adicionales confirman?

3. La hemoglobina de 11.8: puede ser por ERC, por deficiencia nutricional u otra causa?
   Que examenes pides para aclarar la etiologia?

4. Que diagnosticos adicionales debes descartar que puedan estar contribuyendo
   a la fatiga y la perdida de peso? (hipotiroidismo, neoplasia, etc.)

Responde de forma estructurada y clinicamente practico. No inventes referencias.
```

**Documenta los puntos clave de la respuesta** en 5-7 lineas. Los usaras en la Tarea 3.

---

### Tarea 3: Plan de Tratamiento — Farmacologico y No Farmacologico (12 minutos)

**Objetivo:** Construir un plan de manejo integral y fundamentado en evidencia.

**Parte A — Ajuste farmacologico:**

Usa este prompt:

```
Actua como internista con experiencia en diabetologia y nefrologia.

CONTEXTO: Paciente femenino, 52 anos, DM2 descompensada (HbA1c 9.2%),
TFG estimada 44 ml/min (posible ERC estadio 3a), anemia leve (Hb 11.8g/dL),
dislipidemia no controlada (LDL 142, TG 198).
Medicacion actual: metformina 850mg c/12h (adherencia irregular), losartan 50mg, atorvastatina 20mg.
TA hoy: 142/88 (objetivo en DM con ERC: <130/80).

CONTEXTO ECUADOR: Estamos en Ecuador. Los medicamentos deben ser accesibles en el
Cuadro Nacional de Medicamentos Basicos del Ecuador o disponibles en farmacia privada
a costo razonable. El sistema de salud es IESS (cobertura seguro social).

SOLICITO:
1. Ajuste de metformina segun TFG actual y guias actuales
2. Que clase de farmaco agregar para mejor control glucemico con beneficio renoprotector?
   Es accesible en Ecuador o en el IESS? Costo aproximado?
3. Ajuste de losartan dada la TA actual y la ERC?
4. Ajuste de atorvastatina dada la dislipidemia no controlada?
5. Que hacer con la anemia leve — esperar mas examenes o iniciar algo?
6. Screening pendiente que es prioritario en esta visita?
   (fondo de ojo, microalbuminuria, ECG, etc.)

Sé practico y especifico. Menciona explicitamente si algo no lo tienes claro
o requiere confirmacion con guia especifica.
```

**Parte B — Cambios no farmacologicos:**

Completa con este segundo prompt en la misma conversacion:

```
Ahora genera las recomendaciones no farmacologicas para esta paciente:
- Dieta para diabetica con ERC estadio 3a (proteinas, sal, potasio — considerando K de 4.2)
- Actividad fisica adecuada para su condicion y contexto
- Modificacion de factores de riesgo cardiovascular
- Metas de peso
- Importancia de la adherencia al tratamiento (segun su historia de olvidos de metformina)

Adapta las recomendaciones a una paciente de 52 anos, ama de casa, Sierra ecuatoriana.
Lenguaje tecnico pero que yo pueda traducir facilmente para explicarle a ella.
```

---

### Tarea 4: Educacion al Paciente Generada con IA (8 minutos)

**Objetivo:** Crear material de educacion claro y adaptado culturalmente para Maria.

**Prompt:**

```
Genera una "hoja de educacion para el paciente" para una mujer de 52 anos,
ama de casa de la Sierra ecuatoriana, bachillerato completo, con diabetes tipo 2
que no ha estado controlada y que hoy descubrimos tiene posible dano en los rinones.

La hoja debe:
1. Explicar en terminos simples que tiene y por que es importante controlarla AHORA
2. Explicar que son los rinones y por que la diabetes los dano (analogia simple)
3. Las 3 cosas MAS IMPORTANTES que ella debe hacer a partir de hoy
4. Cuando venir de urgencia (signales de alarma)
5. La importancia de NO olvidar los medicamentos

Tono: amable, sin asustar, sin tecnicismos, con respeto.
Longitud: 300 palabras maximo.
Formato: paragrafos cortos, facil de leer.
Puede incluir 1-2 analogias locales (cocina, agricultura, etc.) si ayudan a la comprension.
```

Revisa el resultado. Ajusta manualmente si hay algo que no refleja el contexto ecuatoriano o que el lenguaje no es apropiado para tu paciente especifica.

---

### Tarea 5: Plan de Seguimiento y Alertas de Control (5 minutos)

**Objetivo:** Definir el plan de seguimiento estructurado para los proximos 6 meses.

**Prompt:**

```
Genera un plan de seguimiento estructurado para los proximos 6 meses para esta paciente
con DM2 descompensada (HbA1c 9.2%), posible ERC estadio 3a, dislipidemia no controlada
y HTA no en meta.

CONSIDERA:
- Frecuencia de visitas clinicas
- Examenes de control y en que momento pedirlos
- Especialidades de referencia necesarias (y en que orden)
- Metas de control a 3 meses y a 6 meses
- Criterios para referencia urgente a nefrologia

CONTEXTO: IESS Ecuador. Tiempos de espera para especialista pueden ser 2-4 meses.
Adapta el plan a esa realidad.

Formato: tabla o lista clara y practica para incluir en la nota clinica.
```

---

## Checklist de Entregables

Al completar las 5 tareas, verifica que tienes los siguientes 5 entregables:

- [ ] **Entregable 1:** Respuestas a las 3 preguntas sobre guias ADA (Tarea 1)
- [ ] **Entregable 2:** Diagnostico diferencial de la descompensacion + interpretacion de laboratorios (Tarea 2)
- [ ] **Entregable 3:** Plan farmacologico ajustado + recomendaciones no farmacologicas (Tarea 3)
- [ ] **Entregable 4:** Hoja de educacion para la paciente revisada y corregida por ti (Tarea 4)
- [ ] **Entregable 5:** Plan de seguimiento a 6 meses con metas especificas (Tarea 5)

---

## Criterios de Evaluacion

Este caso practico es evaluado por el instructor (en formato Completo) o autocorregido con la rubrica siguiente (formatos Express y Estandar):

| Criterio | Excelente (4 pts) | Satisfactorio (2-3 pts) | Insuficiente (0-1 pts) |
|----------|-------------------|------------------------|----------------------|
| Uso correcto de Elicit | Busqueda con 2+ consultas relevantes, respuestas fundadas en evidencia | 1 busqueda relevante | No uso Elicit o resultado sin evidencia |
| Calidad del diferencial | Identifica 3+ causas de descompensacion, interpreta correctamente la creatinina | Identifica 2 causas correctas | Solo 1 causa o ninguna |
| Plan farmacologico | Ajustes fundados en guias ADA + considera TFG + farmaco con evidencia renoprotectora | 2 de 3 criterios | Sin fundamento en guias |
| Educacion al paciente | Clara, culturalmente adecuada, sin tecnicismos, con señales de alarma | Clara pero con algunos tecnicismos | Tecnica, no adaptada al paciente |
| Plan de seguimiento | Frecuencia definida + examenes con fechas + metas especificas + criterios de referencia | 3 de 4 elementos | Menos de 2 elementos |

**Puntaje maximo:** 20 puntos
**Puntaje minimo para completar el caso:** 12 puntos (60%)

---

## Reflexion Final del Curso

Al completar este caso, has integrado:

- **T-01:** Entendiste el panorama de la IA en salud antes de aplicarla
- **T-02:** Usaste ChatGPT o Claude con prompts estructurados y efectivos
- **T-03:** Trabajaste con datos correctamente anonimizados (Maria G., sin cedula, sin direccion)
- **T-04:** Mantuviste tu criterio clinico — la IA propuso, tu evaluaste y decidiste
- **S-01:** Generaste diagnostico diferencial con apoyo de IA
- **S-02:** Produjiste documentacion clinica util (puedes generar la nota SOAP de esta consulta como ejercicio adicional)
- **S-03:** Buscaste evidencia en Elicit antes de tomar decisiones farmacologicas
- **S-05 (este modulo):** Integraste todo en un caso clinico real

Eso es exactamente lo que queremos que lleves a tu consulta.

---

## Nota Metodologica

La IA fue utilizada en este caso como:
- Apoyo para sintetizar evidencia (Elicit — verificable)
- Herramienta de razonamiento colaborativo (ChatGPT/Claude — con criterio critico)
- Generador de comunicacion adaptada al paciente

La IA NO fue:
- La fuente de decision clinica definitiva
- Reemplazo de la evaluacion directa del paciente
- Fuente de referencia bibliografica sin verificacion

Ese es el modelo que ITSEIA Academy propone para el medico ecuatoriano del 2026.

---

**Felicitaciones por completar el curso "IA para Profesionales de la Salud".**

*Procede a la plataforma para ver tu certificado de finalizacion.*

---

*Caso practico creado por ITSEIA Academy | Marzo 2026 | Revision medica pendiente*
*CASO FICTICIO CON FINES EDUCATIVOS EXCLUSIVAMENTE. No usar como guia clinica real.*
*La IA no reemplaza el criterio clinico profesional.*
