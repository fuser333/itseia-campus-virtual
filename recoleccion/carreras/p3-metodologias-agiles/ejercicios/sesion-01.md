# Ejercicio Sesion 1: Agile vs Waterfall — Cuando Usar Cada Uno

**Materia:** Metodologias Agiles
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Comparar los modelos de desarrollo Waterfall y Agile identificando sus fortalezas, debilidades y criterios de seleccion, aplicando el analisis a proyectos reales de tecnologia y datos en el contexto empresarial ecuatoriano.

## Contexto

Una startup de Quito quiere lanzar una plataforma de creditos digitales para microempresarios. Tienen 4 meses y $80,000 de capital. El gerente propone Waterfall porque "es lo que aprendieron en la universidad". Tu, como analista de datos del equipo, debes argumentar si Agile es mejor para este proyecto. Esta es exactamente la situacion que encontraras en empresas ecuatorianas: defender decisiones metodologicas con argumentos tecnicos solidos.

## Instrucciones

1. Abre un documento en Notion o Google Docs y titulatelo `S01_Agile_vs_Waterfall_[tu_nombre].md`.

2. Completa la siguiente tabla de comparacion (rellena las celdas vacias basandote en tu investigacion):

```
COMPARACION METODOLOGIAS DE DESARROLLO

| Dimension              | WATERFALL          | AGILE (Scrum/Kanban)    |
|------------------------|--------------------|-----------------------|
| Planificacion          | Completa al inicio | Iterativa (por sprint) |
| Requisitos             | ¿?                 | ¿?                     |
| Entrega de valor       | ¿?                 | ¿?                     |
| Documentacion          | Extensa y formal   | ¿?                     |
| Cambios durante proyecto| ¿?                | Bienvenidos y esperados|
| Equipos                | ¿?                 | ¿?                     |
| Riesgo                 | ¿?                 | ¿?                     |
| Visibilidad progreso   | ¿?                 | Daily standups, demos  |
| Cliente involucrado    | ¿?                 | ¿?                     |
| Cuando usarlo          | ¿?                 | ¿?                     |
```

3. Analiza 5 proyectos ecuatorianos reales y decide que metodologia usarias:

```
ANALISIS DE PROYECTOS ECUATORIANOS

Proyecto 1: Sistema de declaracion de impuestos en linea - SRI Ecuador
- Usuarios: 4 millones de contribuyentes
- Requisitos: Completamente definidos por ley tributaria
- Cambios: Minimos (solo por reformas fiscales anuales)
- Plazo: 18 meses con presupuesto de $2M
- Metodologia recomendada: ___________
- Justificacion: ___________

Proyecto 2: App de prestamos para microempresarios - Startup Quito
- Usuarios: 500 beta-testers iniciales
- Requisitos: Vagos, "algo como Kueski pero para Ecuador"
- Cambios: Se esperan muchos segun feedback del mercado
- Plazo: 4 meses, $80,000
- Metodologia recomendada: ___________
- Justificacion: ___________

Proyecto 3: Actualizacion de bases de datos del IESS
- Usuarios: Internos (funcionarios del IESS)
- Requisitos: Migracion de Oracle 11g a PostgreSQL, 100% definido
- Cambios: Ninguno permitido por estabilidad del sistema
- Plazo: 12 meses
- Metodologia recomendada: ___________
- Justificacion: ___________

Proyecto 4: Modelo de ML para detectar evasion fiscal - SRI Ecuador
- Usuarios: Analistas del SRI
- Requisitos: "Queremos detectar evasion pero no sabemos exactamente como"
- Cambios: El modelo se ira ajustando con cada iteracion de datos
- Plazo: 6 meses, equipo de 3 data scientists
- Metodologia recomendada: ___________
- Justificacion: ___________

Proyecto 5: Dashboard de monitoreo de agua potable - Empresa Municipal Quito (EPMAPS)
- Usuarios: 12 operadores de planta
- Requisitos: Parcialmente definidos, el cliente no sabe exactamente que quiere ver
- Cambios: Se esperan ajustes al ver los primeros prototipos
- Plazo: 3 meses, presupuesto $15,000
- Metodologia recomendada: ___________
- Justificacion: ___________
```

4. Dibuja el flujo de fases de cada metodologia (en ASCII art o diagrama de texto):

```
WATERFALL:
[Requisitos] → [Diseño] → [Desarrollo] → [Testing] → [Despliegue] → [Mantenimiento]
   4-6 sem      4-6 sem     12-16 sem      4-6 sem      2-4 sem

AGILE (Scrum):
Sprint 1 (2 sem) → Sprint 2 (2 sem) → Sprint 3 (2 sem) → Sprint N
[Backlog] → [Planning] → [Desarrollo+Testing diario] → [Review] → [Retro]
             Repite cada sprint →

¿Cuando el cliente ve valor?
Waterfall: Despues de _____ meses
Agile: Despues de _____ semanas
```

5. Para el Proyecto 4 (ML para SRI), diseña el ciclo de un sprint de 2 semanas:

```
SPRINT 1 - Modelo deteccion evasion SRI Ecuador
Duracion: 2 semanas (14 dias)

Semana 1:
- Dia 1-2: Exploracion y limpieza dataset SRI (facturas 2020-2024)
- Dia 3-4: Feature engineering (variables relevantes de evasion)
- Dia 5: Daily standup + revision avance con cliente

Semana 2:
- Dia 6-8: Entrenamiento modelo baseline (Random Forest)
- Dia 9-10: Evaluacion y ajuste hiperparametros
- Dia 11-12: Sprint Review: demo al equipo SRI
- Dia 13: Sprint Retrospectiva: que mejorar

Entregable al final del sprint:
___________

Criterio de "terminado" (Definition of Done):
___________
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "Una cooperativa de ahorro y credito de Ambato, Ecuador, quiere desarrollar una app movil para que sus 12,000 socios puedan solicitar creditos en linea. Tienen un equipo de 4 desarrolladores y 6 meses. Necesitan cumplir regulaciones de la SEPS (Superintendencia de Economia Popular y Solidaria). ¿Recomendarias Agile, Waterfall o un enfoque hibrido? Justifica con argumentos especificos para el contexto ecuatoriano."

Escribe un parrafo de 100 palabras resumiendo la respuesta y si estas de acuerdo o en desacuerdo con ChatGPT.

## Que aprendiste

- Waterfall es ideal cuando los requisitos son fijos, el dominio es conocido y los cambios son costosos (construccion, compliance regulatorio).
- Agile es superior cuando los requisitos evolucionan, el cliente no sabe exactamente que quiere, o el equipo necesita feedback rapido.
- En proyectos de ML y datos, Agile es casi siempre la mejor opcion: los datos revelan necesidades nuevas en cada iteracion.
- El contexto ecuatoriano importa: empresas publicas tienden a Waterfall por procesos de contratacion rigidos; startups privadas se benefician mas de Agile.
- Un sprint de 2 semanas genera valor entregable antes de que Waterfall haya terminado la fase de requisitos.

## Reto extra

Investiga el concepto de "SAFe (Scaled Agile Framework)" para empresas grandes. ¿Seria aplicable en el BCE Ecuador con 800 empleados y 15 equipos de desarrollo? Escribe una justificacion de 200 palabras. Incluye al menos 2 beneficios y 2 riesgos de implementar SAFe en una institucion publica ecuatoriana.
