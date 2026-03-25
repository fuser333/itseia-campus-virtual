# J-03: Analisis de Riesgo Legal Automatizado

**Tipo:** Leccion + Quiz
**Duracion:** 30 minutos
**Semana:** 3 de 4
**Herramientas:** ChatGPT Plus, Claude
**Quiz:** Quiz J-03 (se activa despues de completar este modulo)

---

## Objetivo de Aprendizaje

Al finalizar este modulo, podras construir matrices de riesgo legal con apoyo de IA, identificar y clasificar riesgos en contratos comerciales y operaciones empresariales, y presentar analisis de riesgo profesionales a clientes usando IA como herramienta de soporte metodologico.

---

## Advertencia Profesional

El analisis de riesgo legal con IA es una herramienta de apoyo al criterio profesional, no un reemplazo de la opinion juridica fundamentada. La IA puede identificar riesgos generales pero no conoce el contexto especifico de la relacion entre las partes, los antecedentes del negocio, ni la realidad del mercado local. Tu experiencia como abogado en ejercicio es el factor diferenciador que hace valioso el analisis final.

---

## Seccion 1: Que es el analisis de riesgo legal y por que la IA lo transforma

El analisis de riesgo legal es el proceso de identificar, evaluar y priorizar los riesgos juridicos que enfrenta un cliente en una transaccion, operacion o situacion determinada. Tradicionalmente era una tarea de abogados senior con experiencia transaccional. La IA democratiza este proceso al proporcionar:

- Un primer barrido sistematico que identifica riesgos que podrian pasarse por alto
- Una estructura metodologica consistente independientemente del abogado que realice el analisis
- Velocidad: un analisis de riesgo de un contrato de 40 paginas que toma 4 horas puede tener un primer borrador en 20 minutos

La IA no da certezas juridicas. Da un mapa inicial que el abogado valida, enriquece y adapta al caso especifico.

### Tipos de riesgo legal que la IA puede identificar

**Riesgos contractuales:**
- Vacios en la definicion del objeto
- Desequilibrio en obligaciones y derechos
- Clausulas ambiguas que pueden interpretarse en contra del cliente
- Mecanismos de incumplimiento insuficientes
- Falta de clausulas esenciales para el tipo de contrato

**Riesgos regulatorios:**
- Actividades que requieren autorizacion o licencia previa
- Incumplimiento de normativa sectorial (sanitaria, ambiental, financiera)
- Exposicion tributaria no identificada
- Obligaciones laborales omitidas

**Riesgos procesales:**
- Prescripcion de acciones sin actos interruptivos
- Falta de documentacion para sustentar una demanda potencial
- Jurisdiccion o competencia desfavorable
- Dificultad probatoria

**Riesgos corporativos:**
- Conflictos entre socios no gestionados contractualmente
- Responsabilidad personal de representantes legales
- Exposicion ante terceros por actos de empleados o contratistas

---

## Seccion 2: Construccion de una matriz de riesgo legal con IA

La matriz de riesgo es la herramienta central del analisis de riesgo legal. Combina la probabilidad de que ocurra el riesgo con el impacto que tendria, generando una prioridad de atencion.

### Prompt para matriz de riesgo de un contrato

```
Actua como abogado especialista en riesgo contractual bajo el derecho ecuatoriano.

Analiza el siguiente [TIPO DE CONTRATO] desde la perspectiva de [MI CLIENTE: EL CONTRATANTE / EL PRESTADOR / ETC.]:

[PEGAR CONTRATO ANONIMIZADO O DESCRIPCION DE LA OPERACION]

Construye una MATRIZ DE RIESGO LEGAL con el siguiente formato:

| # | Riesgo Identificado | Clausula o Situacion | Probabilidad (Alta/Media/Baja) | Impacto (Alto/Medio/Bajo) | Prioridad | Recomendacion |
|---|---------------------|---------------------|-------------------------------|--------------------------|-----------|---------------|

INSTRUCCIONES:
- Probabilidad: que tan probable es que este riesgo se materialice
- Impacto: cuanto danaria a mi cliente si ocurre (economico + reputacional + legal)
- Prioridad = combinacion de probabilidad e impacto (Alta prioridad = alta probabilidad + alto impacto)
- Recomendacion: clausula a modificar, clausula a agregar, accion preventiva o documentacion adicional

Identifica minimo 8 riesgos y prioriza los 3 mas criticos para atencion inmediata.
Al final, da una CALIFICACION GLOBAL DE RIESGO del contrato (1-10) con justificacion.
```

### Ejemplo de output esperado (para contrato de construccion)

| # | Riesgo | Clausula | Probabilidad | Impacto | Prioridad | Recomendacion |
|---|--------|----------|-------------|---------|-----------|---------------|
| 1 | Constructor no finaliza en el plazo | Cl.5 sin penalidad diaria | Alta | Alto | CRITICA | Agregar clausula penal por dia de retraso (0.1% del contrato/dia) |
| 2 | Cambios de alcance no controlados | Cl.3 permite "modificaciones acordadas" sin forma escrita | Alta | Alto | CRITICA | Exigir orden de cambio escrita firmada antes de ejecutar |
| 3 | Deficiencia en entregables sin criterio objetivo | Cl.7 solo dice "a satisfaccion del comitente" | Media | Alto | ALTA | Definir especificaciones tecnicas y protocolo de aceptacion |

---

## Seccion 3: Analisis de riesgo para operaciones especificas en Ecuador

### Due diligence legal para adquisicion de empresa

La due diligence (debida diligencia) es el proceso de investigacion juridica antes de adquirir una empresa. Con IA puedes estructurar el proceso:

```
Voy a realizar una due diligence legal para la posible adquisicion de una empresa ecuatoriana [TIPO DE NEGOCIO].

Genera una LISTA COMPLETA de riesgos juridicos a investigar, organizada por categoria:

1. RIESGOS SOCIETARIOS: (estructura accionarial, poderes vigentes, actas de junta)
2. RIESGOS CONTRACTUALES: (contratos vigentes, obligaciones asumidas)
3. RIESGOS LABORALES: (obligaciones patronales pendientes, procesos visto bueno)
4. RIESGOS TRIBUTARIOS: (obligaciones SRI, declaraciones pendientes, proceso de determinacion)
5. RIESGOS PROCESALES: (demandas activas, arbitrajes, procedimientos administrativos)
6. RIESGOS REGULATORIOS: (permisos de operacion, licencias, habilitaciones)
7. RIESGOS DE PROPIEDAD INTELECTUAL: (marcas, patentes, software, contenido)
8. RIESGOS INMOBILIARIOS: (titulos de propiedad, hipotecas, reglamentos)

Para cada categoria: lista de documentos a solicitar y preguntas especificas a verificar.
```

### Analisis de riesgo en contratos laborales masivos

Para empresas con multiples contratos laborales o para analizar politicas de recursos humanos:

```
Una empresa tiene la siguiente practica de relacion laboral: [DESCRIPCION].
Analiza los riesgos juridicos bajo el Codigo de Trabajo ecuatoriano, la Ley de Seguridad Social y el COIP (si aplica):
1. Principales riesgos de demanda laboral
2. Exposicion ante el IESS
3. Riesgo de accion penal por incumplimiento de obligaciones patronales
4. Recomendaciones de mitigacion
```

### Analisis de riesgo en contratos de comercio electronico

Con el auge del comercio digital, muchos clientes necesitan analisis de sus politicas y contratos en linea:

```
El siguiente es el termino de servicio / contrato de usuario de una plataforma de comercio electronico ecuatoriana:
[TEXTO]
Analiza el riesgo de incumplimiento de:
- Ley Organica de Defensa del Consumidor (politica de devolucion, informacion precontractual)
- LOPDP (recoleccion y uso de datos de usuarios)
- Codigo de Comercio (firma electronica, contratos electronicos)
- Normativa de la ARCOTEL si aplica (servicios digitales)
```

---

## Seccion 4: Presentacion del analisis de riesgo al cliente

La IA tambien puede ayudarte a traducir el analisis juridico tecnico en un informe comprensible para el cliente:

```
Tengo el siguiente analisis tecnico de riesgo juridico:
[PEGAR TU ANALISIS O EL GENERADO POR IA]

Redacta un INFORME DE RIESGO JURIDICO para presentar al cliente, con:
1. RESUMEN EJECUTIVO: 3 parrafos en lenguaje simple (sin jerga juridica) describiendo la situacion y los riesgos criticos
2. LOS 3 RIESGOS MAS IMPORTANTES: explicados para que un gerente sin formacion juridica los entienda
3. RECOMENDACIONES: en formato de acciones concretas con un responsable y un plazo sugerido
4. CONCLUSION: recomendacion general sobre si proceder o no con la transaccion y bajo que condiciones

Tono: profesional pero accesible. El cliente es gerente general de empresa mediana, no abogado.
```

---

## Resumen del Modulo

- El analisis de riesgo legal con IA reduce en 70% el tiempo de generacion del primer borrador de la matriz
- La matriz combina probabilidad e impacto para priorizar riesgos segun urgencia de atencion
- La IA identifica riesgos generales; el abogado agrega conocimiento especifico del caso y del contexto local
- La due diligence, los contratos laborales masivos y el comercio electronico son areas de alta aplicabilidad en Ecuador
- La IA puede ayudar a traducir el analisis juridico tecnico en comunicacion comprensible para clientes

---

## Ejercicio Rapido (10 minutos)

Piensa en un cliente o caso hipotetico donde hayas identificado riesgos contractuales. Escribe 3 lineas describiendo el caso y la operacion (anonimizada). Usa el prompt de matriz de riesgo en Claude. Evalua: la IA identifico algun riesgo que tu no habias considerado inicialmente? Hay algun riesgo que identificaste tu y la IA no menciono?

---

**Siguiente modulo:** J-04 — Documentos Procesales con IA (Caso Practico)
**Quiz activo:** Quiz J-03 disponible en la plataforma
