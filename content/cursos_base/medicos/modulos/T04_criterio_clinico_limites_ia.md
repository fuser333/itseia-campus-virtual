# T-04: IA y Criterio Clinico — Cuando NO Confiar en la IA

**Tipo:** Leccion + Quiz
**Duracion:** 30 minutos
**Semana:** 1 — Modulo 4 de 9
**Curso:** IA para Profesionales de la Salud — ITSEIA Academy

---

> **AVISO IMPORTANTE:** La IA no reemplaza el criterio clinico profesional. Este modulo es el mas importante del curso. Antes de usar cualquier herramienta de IA en entornos clinicos, debes comprender sus limites con la misma profundidad con que comprendes sus capacidades.

---

## Objetivo de Aprendizaje

Al finalizar este modulo seras capaz de:

- Explicar como funcionan los LLMs y por que pueden generar errores clinicos
- Identificar los tipos de sesgo mas relevantes en IA medica
- Reconocer los escenarios clinicos de alto riesgo donde la IA falla con mayor frecuencia
- Aplicar un framework de decision para saber cuando usar y cuando no usar IA en tu practica

---

## Respuesta Modelo — Ejercicio T-03

Antes de comenzar, aqui la respuesta al ejercicio del modulo anterior:

**Caso original (con datos identificantes):**
```
Patricia Lema Salgado, cedula 1756234890, 52 años, docente del colegio
Simon Bolivar de Riobamba. Diagnostico: lupus eritematoso sistemico...
```

**Version correctamente anonimizada:**
```
Paciente femenino, 50-55 años, profesional activa en zona urbana de la Sierra.
Diagnostico: lupus eritematoso sistemico de 3 años de evolucion, brote leve actual.
Laboratorios recientes: ANA positivo 1:320, anti-dsDNA positivo, C3 bajo.
Medicacion: hidroxicloroquina 200mg c/12h, prednisona 5mg/dia.
Requiere documentacion para incapacidad temporal laboral.
```

Todos los datos clinicamente relevantes estan preservados. Ninguno de los identificantes (nombre, cedula, lugar de trabajo especifico) sobrevivio.

---

## Seccion 1: Como Funcionan los LLMs — La Base del Escepticismo Sano

Para saber cuando no confiar en la IA, primero hay que entender como funciona. De manera simplificada:

### El proceso de un LLM en respuesta a tu pregunta

1. Recibes el texto de tu pregunta
2. Lo convierte en tokens (unidades matematicas de texto)
3. Predice cual es el siguiente token mas probable, basandose en patrones aprendidos durante el entrenamiento
4. Genera la respuesta token por token, siendo cada uno el mas probable dada la secuencia anterior
5. El resultado suena coherente porque la prediccion de tokens funciona muy bien — pero coherencia no es lo mismo que veracidad

**El punto critico:** El LLM no "sabe" si algo es verdad o mentira. Genera el texto que estadisticamente parece mas correcto dada la pregunta. A veces eso coincide con la realidad. A veces no.

### Por que ocurren las alucinaciones

El termino "alucinacion" en IA se refiere a cuando el modelo genera informacion incorrecta o inexistente con plena confianza.

**Causas principales:**
- La pregunta activa un patron de respuesta que el modelo aprendio, aunque el patron no aplica exactamente al caso
- Los datos de entrenamiento tenian errores o informacion inconsistente
- El modelo no tiene mecanismo para distinguir lo que "sabe con seguridad" de lo que "cree probable"
- El modelo optimiza para sonar correcto y util, no para admitir incertidumbre

**Ejemplo real documentado:**
Un medico de urgencias en EEUU reporto haber recibido de ChatGPT una recomendacion de dosis de lidocaina endovenosa para arritmia ventricular que era el doble del maximo terapeutico. El texto era fluido, clinicamente convincente y peligroso.

---

## Seccion 2: Errores Documentados de IA en Medicina

Estos casos estan registrados en literatura medica o medios verificables:

### Caso 1: Dosis incorrectas de medicamentos

Multiples estudios han mostrado que LLMs como ChatGPT generan errores en dosis de medicamentos entre el 10% y el 25% de las consultas, dependiendo del medicamento y la especificidad de la pregunta. Los errores son especialmente frecuentes en:
- Dosis pediatricas (ajuste por peso)
- Medicamentos con margen terapeutico estrecho (digoxina, warfarina, litio, anticomiciales)
- Esquemas combinados de quimioterapia

### Caso 2: Referencias bibliograficas inexistentes

En un estudio publicado en JAMA Network Open (2023), investigadores encontraron que cuando se le pedia a ChatGPT referencias bibliograficas sobre temas medicos especificos, entre el 30% y el 60% de las citas generadas eran completamente falsas — nombres de autores reales con titulos de articulos inexistentes, o combinaciones aleatorias de todos los elementos.

**Implicacion directa:** NUNCA uses una cita que genero la IA sin verificarla en PubMed o en la revista directamente.

### Caso 3: Sesgos en diagnostico diferencial

Estudios han documentado que los LLMs reproducen sesgos presentes en la literatura medica:
- Menor probabilidad de incluir infarto agudo de miocardio en diagnostico diferencial de dolor toracico en mujeres jovenes (porque la literatura historicamente subrepresenta mujeres en estudios cardiovasculares)
- Mayor probabilidad de diagnosticos de ansiedad o conversion en mujeres con sintomas neurologicos
- Diferencias en sugerencias de tratamiento segun la raza declarada del paciente ficticio

---

## Seccion 3: Sesgos que Todo Medico Debe Conocer

### Sesgo de poblacion de entrenamiento

Los LLMs medicos fueron entrenados principalmente con:
- Literatura en ingles (norteamericana y europea)
- Estudios clinicos con predominio de poblacion blanca adulta
- Guias clinicas de sistemas de salud de paises de altos ingresos

**Implicacion para Ecuador:**
- Prevalencias de enfermedades endemicas (dengue, malaria, Chagas, leishmaniasis) pueden estar subrepresentadas
- Protocolos sugeridos pueden no estar adaptados al Cuadro Nacional de Medicamentos Basicos del Ecuador
- Factores de riesgo cardiovascular en poblacion mestiza andina pueden no estar bien calibrados

### Sesgo de genero en medicina

La medicina historicamente ha subrepresentado a las mujeres en investigacion clinica. Los LLMs reproducen este sesgo:
- Presentaciones atipicas del IAM en mujeres pueden no aparecer en diferenciales de primer nivel
- Dolor cronico en mujeres puede tener menor peso diagnostico en sugerencias de IA
- Enfermedades autoinmunes (mas frecuentes en mujeres) pueden estar subrepresentadas en ciertos contextos de entrenamiento

### Sesgo de disponibilidad

Los LLMs recuerdan mejor lo que aparece con mas frecuencia en su entrenamiento. Condiciones raras pero graves pueden no aparecer en los diferenciales generados, aunque el cuadro clinico sea compatible.

### Sesgo de confianza

La IA no calibra bien su propia incertidumbre. Tiende a responder con igual confianza cuando:
- La respuesta es bien conocida y verificada
- La respuesta es una estimacion probable
- La respuesta es directamente incorrecta

Esta ausencia de gradiente de confianza es uno de los mayores riesgos clinicos.

---

## Seccion 4: Escenarios de Alto Riesgo — Donde la IA Falla Mas

Estos son los contextos clinicos donde debes ser mas cauteloso con la IA:

### Alta urgencia y alta precision

**Urgencias y emergencias:** Una respuesta con 2 segundos de reflexion adicional puede cambiar un outcome. La IA puede generar respuestas plausibles pero incorrectas bajo presion de tiempo. En urgencias, tu entrenamiento y los protocolos institucionales son la autoridad. La IA no es herramienta de urgencias.

**Dosis de medicamentos de alto riesgo:** Anticoagulantes, antiarritmicos, sedantes, analgesicos potentes, quimioterapia. Verifica siempre en fuentes farmacologicas primarias.

### Patologias de alto estigma y alta complejidad

**Salud mental:** Los LLMs tienen limitaciones importantes en psiquiatria. Pueden minimizar riesgo suicida, sobrestimar riesgo en contextos de baja peligrosidad, o generar planes de tratamiento que no siguen guias clinicas validadas para la poblacion latinoamericana.

**Oncologia:** La seleccion de esquemas quimioterapicos, el estadiaje y las decisiones de tratamiento oncologico involucran multiples variables que los LLMs generales no pueden integrar adecuadamente.

**Neonatologia y pediatria:** Las dosis y protocolos pediatricos tienen especificidades (ajuste por peso, superfice corporal, edad gestacional) que los LLMs manejan con menor precision que en adultos.

### Casos atipicos y presentaciones inusuales

Los LLMs funcionan mejor con presentaciones tipicas — las que mas aparecen en la literatura. Cuando el cuadro clinico es atipico, el modelo tende a "forzar" el caso dentro de un patron mas comun que conoce bien. Esto puede desviar el diagnostico.

**Regla practica:** Si el cuadro clinico no encaja con lo que la IA sugiere, confia en tu evaluacion directa del paciente. La IA no lo ha visto. Tu si.

---

## Seccion 5: Framework de Decision — Cuando Usar y Cuando No Usar IA

Este es el protocolo de decision propuesto para integrar IA en clinica con seguridad:

### Nivel Verde — Uso libre con supervision

Tareas de bajo riesgo donde la IA es altamente util:

- Generacion de notas SOAP (siempre revisadas antes de firmar)
- Educacion al paciente (revisar antes de imprimir o enviar)
- Busqueda de informacion general sobre condiciones bien definidas
- Resumen de articulos cientificos (verificar citas siempre)
- Traduccion o simplificacion de lenguaje medico para pacientes
- Borradores de informes administrativos (referencia, certificados)

### Nivel Amarillo — Usar con verificacion obligatoria

Tareas de riesgo moderado donde la IA agrega valor pero requiere verificacion:

- Diagnostico diferencial (como segundo criterio, no como primer diagnostico)
- Revision de interacciones medicamentosas (verificar en fuente farmacologica antes de prescribir)
- Preguntas sobre dosis de medicamentos comunes
- Interpretacion de guias clinicas (contrastar con guia original)
- Preguntas sobre protocolos de tratamiento

### Nivel Rojo — No usar o usar solo como apoyo muy secundario

Tareas de alto riesgo donde el margen de error es intolerable:

- Decisiones de urgencias y emergencias
- Dosis de medicamentos de margen estrecho en tiempo real
- Evaluacion de riesgo suicida o de violencia
- Decisiones oncologicas de tratamiento
- Dosificacion pediatrica sin verificacion adicional
- Interpretacion de imagenes medicas sin radiologo (la IA te describe, no diagnostica)

---

## Resumen del Modulo

| Categoria | Lo clave |
|-----------|----------|
| Por que falla la IA | Predice texto plausible, no verifica verdad; sin calibracion de incertidumbre |
| Alucinaciones clinicas | Dosis incorrectas, referencias falsas, diferenciales sesgados |
| Sesgos principales | Poblacion EEUU/Europa; genero femenino; razas no blancas; enfermedades endemicas LAC |
| Alto riesgo | Urgencias, dosis de alto riesgo, psiquiatria, oncologia, neonatologia |
| Framework | Verde (libre+revision), Amarillo (verificacion obligatoria), Rojo (no usar o muy secundario) |

---

## Quiz — Modulos T-03 y T-04

Es el momento del quiz evaluativo que cubre Privacidad (T-03) y Criterio Clinico (T-04).

**8 preguntas | 6 multiple choice + 2 texto corto**
**Puntaje minimo:** 70% (6 de 8)
**Tiempo estimado:** 10-15 minutos
**Intentos:** 2

El quiz lo encontraras en la plataforma como "Quiz T-03/T-04: Privacidad y Criterio Clinico".

---

## Ejercicio Rapido (5 minutos)

Responde mentalmente estas preguntas antes de pasar al quiz formal:

1. Nombra 3 tipos de datos del paciente que NUNCA debes incluir en un prompt de IA publica.

2. Cual es la diferencia entre una "alucinacion" de IA y un error de criterio clinico?

3. En que escenario clinico concreto de tu practica diaria considerarias que el uso de IA es de "Nivel Rojo" (no recomendado)?

4. Si ChatGPT te da una dosis de gentamicina para un paciente adulto con insuficiencia renal, que haces antes de prescribir?

Si respondiste con fluidez las 4, estas listo para el quiz. Si alguna te genero duda, repasa la seccion correspondiente.

---

*Siguiente modulo: S-01 — IA en diagnostico asistido*

*Modulo creado por ITSEIA Academy | Marzo 2026 | Revision medica pendiente*
*La IA no reemplaza el criterio clinico profesional.*
