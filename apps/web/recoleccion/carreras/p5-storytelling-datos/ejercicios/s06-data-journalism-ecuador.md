# Ejercicio Sesion 6: Data Journalism — Contar Historias con Datos Publicos Ecuador

**Materia:** Storytelling con Datos
**Nivel:** Avanzado
**Herramienta IA:** Claude + Perplexity
**Duracion:** 55 min

## Objetivo

Aplicar tecnicas de data journalism para encontrar historias en datasets publicos ecuatorianos (INEC, BCE, SENPLADES, MSP), investigar y verificar datos como un periodista, y producir un articulo de datos con visualizaciones que seria publicable en medios ecuatorianos como GK, Plan V o El Universo.

## Contexto (Ecuador)

El data journalism es el puente entre el analisis de datos y el ciudadano. Medios como GK.city, Plan V y CARTO LATAM han demostrado que las historias basadas en datos publicos ecuatorianos generan el mayor engagement de sus audiencias. Un analista de datos que sabe escribir para el publico general tiene acceso a oportunidades que un analista puramente tecnico no tiene: consultoria con ONGs, medios de comunicacion, think tanks y organizaciones internacionales.

## Instrucciones

### Parte 1 — Las fuentes de datos publicos mas ricas de Ecuador (10 min)

Explora y documenta estas 8 fuentes. Para cada una, encuentra UNA historia potencial que no ha sido contada:

| Fuente | URL | Dataset mas interesante | Historia potencial |
|---|---|---|---|
| INEC | ecuadorencifras.gob.ec | Censo 2022 | [TU PROPUESTA] |
| BCE | bce.fin.ec | Credito por sector y provincia | [TU PROPUESTA] |
| AMT Quito | amt.gob.ec | Accidentes de transito por zona | [TU PROPUESTA] |
| MSP | salud.gob.ec | Enfermedades por canton | [TU PROPUESTA] |
| SENPLADES | planificacion.gob.ec | Presupuesto por ministerio | [TU PROPUESTA] |
| MINEDUC | educacion.gob.ec | Resultados pruebas SER bachiller | [TU PROPUESTA] |
| SERCOP | portal.compraspublicas.gob.ec | Contratacion publica por proveedor | [TU PROPUESTA] |
| CNE | cne.gob.ec | Resultados electorales por parroquia | [TU PROPUESTA] |

Selecciona la historia que te parezca MAS importante y MENOS contada.

### Parte 2 — Investigacion periodistica con datos (20 min)

Aplica el metodo periodistico de datos en 5 pasos:

**PASO 1 — Hipotesis periodistica:**
Antes de bajar un solo dato, formula tu hipotesis como un periodista:
"Creo que [X] esta pasando en Ecuador, y si los datos lo confirman, seria una historia importante porque [IMPACTO EN CIUDADANOS]."

**PASO 2 — Buscar los datos:**
Descarga el dataset relevante. Si no hay un dataset directo, usa scraping o solicita via acceso a la informacion publica (LOTAIP).

Usa Claude con este prompt:
```
PROMPT:
"Quiero investigar [TU HIPOTESIS PERIODISTICA] en Ecuador.
Dame:
1. Los 3 datasets publicos ecuatorianos mas relevantes para investigar esto,
   con URLs especificas de descarga
2. Variables especificas que debo buscar en esos datasets
3. Posibles datos complementarios de fuentes internacionales (OPS, CEPAL, BM)
4. Metodologia para verificar si la hipotesis es verdadera o falsa
5. Expertos ecuatorianos (nombres de instituciones, no personas especificas)
   que podrian comentar sobre este tema"
```

**PASO 3 — Limpiar y analizar:**
```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Carga tu dataset aqui
# df = pd.read_csv("tu_dataset.csv", encoding="utf-8")

# Analisis periodistico basico:
# 1. Quien tiene mas / menos?
# 2. Como ha cambiado en el tiempo?
# 3. Hay un patron geografico?
# 4. Hay correlacion con otras variables?
# 5. Hay outliers que cuentan una historia especifica?

def analisis_periodistico(df, variable_principal, variable_tiempo=None,
                           variable_geografica=None):
    """Template de analisis para data journalism."""
    print(f"ANALISIS PERIODISTICO: {variable_principal}")
    print("="*50)

    # Top 5 y Bottom 5
    if variable_geografica:
        resumen = df.groupby(variable_geografica)[variable_principal].mean()
        print(f"\nTOP 5 ({variable_geografica}):")
        print(resumen.nlargest(5).to_string())
        print(f"\nBOTTOM 5 ({variable_geografica}):")
        print(resumen.nsmallest(5).to_string())
        print(f"\nBRECHA max/min: {resumen.max()/resumen.min():.1f}x")

    # Cambio temporal
    if variable_tiempo:
        df_tiempo = df.groupby(variable_tiempo)[variable_principal].mean()
        cambio_total = (df_tiempo.iloc[-1] / df_tiempo.iloc[0] - 1) * 100
        print(f"\nCAMBIO TEMPORAL: {cambio_total:+.1f}%")
        print(f"Valor inicial: {df_tiempo.iloc[0]:.2f}")
        print(f"Valor final: {df_tiempo.iloc[-1]:.2f}")

    # Outliers (ciudades/casos anomalos)
    q75 = df[variable_principal].quantile(0.75)
    q25 = df[variable_principal].quantile(0.25)
    iqr = q75 - q25
    outliers = df[df[variable_principal] > q75 + 1.5 * iqr]
    if len(outliers) > 0 and variable_geografica:
        print(f"\nOUTLIERS (posibles historias especificas):")
        print(outliers[[variable_geografica, variable_principal]].to_string(index=False))
```

**PASO 4 — Verificar y contextualizar:**
Un dato que no puedes verificar con una segunda fuente no puedes publicar.
Para cada dato clave, encuentra una fuente secundaria que lo confirme (o contradiga).

**PASO 5 — La pieza periodistica:**
La estructura de un articulo de data journalism:

```
TITULO: (la conclusion, no el topico — maximo 10 palabras)

LEAD: (primer parrafo — responde quien, que, cuando, donde, cuanto)
"En Ecuador, [DATO IMPACTANTE] segun datos del [FUENTE]..."

PARRAFO 2: (el dato que sorprende o contradice la intuicion)
"Sin embargo..."

PARRAFO 3: (contexto — por que esta pasando)
"Segun expertos de [INSTITUCION]..."

PARRAFO 4: (el dato humano — como afecta a personas reales)
"Para [PERFIL DE PERSONA], esto significa..."

PARRAFO 5: (comparacion o benchmark)
"En Colombia, por ejemplo..."

PARRAFO 6: (que se puede hacer / que se esta haciendo)
"Iniciativas como [X] buscan..."

CIERRE: (implicacion del dato para el futuro)
"Si la tendencia continua..."

[VISUALIZACION PRINCIPAL]
Fuentes: [Lista de fuentes con URLs]
```

### Parte 3 — Escribir el articulo con Claude (20 min)

```
PROMPT PARA CLAUDE:
"Actua como redactor jefe de datos del medio periodistico GK.city Ecuador.

Tengo estos datos investigados:
DATASET: [FUENTE]
DATO PRINCIPAL: [EL HALLAZGO MAS IMPACTANTE]
DATO SECUNDARIO: [CONTEXTO]
DATO DE PERSONA: [IMPACTO EN CIUDADANO REAL]
COMPARACION: [VS OTRO PAIS O PERIODO]

Escribe un articulo de data journalism de 500 palabras siguiendo esta estructura:
- Titulo (conclusion en 10 palabras)
- Lead (100 palabras: quien/que/cuando/donde/cuanto)
- Cuerpo (300 palabras: dato impactante + causa + impacto humano + comparacion)
- Cierre (100 palabras: implicacion futura + CTA para el lector)

Tono: GK.city — riguroso, sin sensacionalismo, accesible para el ciudadano
ecuatoriano promedio. El articulo deberia ser publicable mañana.

Incluye 2 sugerencias de visualizaciones especificas que acompañarian el articulo."
```

### Parte 4 — Checklist de publicabilidad (5 min)

Antes de "publicar" (o entregar), verifica:

- [ ] El titulo es una conclusion, no un topico
- [ ] El lead responde quien/que/cuando/donde/cuanto en las primeras 2 oraciones
- [ ] Todos los datos tienen su fuente citada con URL
- [ ] Los datos clave tienen una fuente secundaria de verificacion
- [ ] No hay afirmaciones causales sin evidencia (ej: "X CAUSA Y" sin datos que lo prueben)
- [ ] Los numeros estan contextualizados (% absoluto + comparacion)
- [ ] La historia tiene un protagonista humano (no solo numeros)
- [ ] Hay una conclusion o implicacion para el lector

## Usa IA para...

- Usar Perplexity para encontrar si el dato que encontraste ya fue publicado por algun medio ecuatoriano (si ya fue publicado, la historia no es nueva).
- Pedirle a Claude que identifique posibles sesgos en tu investigacion — que datos no tienes y podrian cambiar la conclusion?
- Preguntarle como manejar datos que sugieren algo negativo sobre una entidad gubernamental — consideraciones legales en Ecuador.

## Que aprendiste

- Que los datos publicos ecuatorianos contienen cientos de historias no contadas esperando ser investigadas.
- Que data journalism combina rigor estadistico con narrativa periodistica — la precision de un cientifico con la claridad de un escritor.
- Que verificar cada dato con una segunda fuente no es opcional — es la diferencia entre periodismo y desinformacion.
- Que el lead mas fuerte es el que mas sorprende a la audiencia basandose en datos verificados.

## Reto extra

Envia tu articulo de data journalism al correo editorial de GK.city (gkecuador@gmail.com) o Plan V (planv@planv.com.ec) con el asunto "Articulo data journalism — [TU TITULO]". Incluye el articulo en el cuerpo del correo y las visualizaciones adjuntas. Independientemente de si lo publican, el ejercicio de formatearlo para publicacion externa mejora la calidad del trabajo en un 50%.
