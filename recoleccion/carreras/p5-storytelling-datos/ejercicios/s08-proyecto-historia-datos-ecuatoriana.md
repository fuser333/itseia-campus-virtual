# Ejercicio Sesion 8: Proyecto — Historia de Datos sobre un Problema Ecuatoriano

**Materia:** Storytelling con Datos
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT + Gamma.app
**Duracion:** 60 min

## Objetivo

Integrar todas las tecnicas del modulo para producir una historia de datos completa y publicable sobre un problema real ecuatoriano: investigacion de datos publicos, narrativa STAR, infografia, dashboard interactivo, articulo periodistico, y presentacion ejecutiva — todo sobre el mismo tema, para audiencias diferentes.

## Contexto (Ecuador)

Este es el proyecto final del modulo y del Periodo 5 de Storytelling con Datos. El producto que construiras hoy es una pieza de portafolio profesional: una historia de datos completa que demuestra que puedes tomar un problema real ecuatoriano, investigarlo con rigor, y comunicarlo a cualquier audiencia con herramientas avanzadas. Es el tipo de trabajo que consigue empleos en consultoras, ONGs internacionales y equipos de datos de empresas grandes.

## Instrucciones

### Parte 1 — Seleccion del tema y brief del proyecto (10 min)

Elige UN tema de estos 6 o propone uno propio:

**Tema A — Salud:**
"El costo oculto del diabetes en Ecuador: quien paga la factura?"
Datos: MSP (incidencia), IESS (costo de tratamientos), INEC (prevalencia por region y edad)

**Tema B — Educacion:**
"La loteria del codigo postal: como el barrio donde naces determina tu educacion en Ecuador"
Datos: MINEDUC (resultados SER por establecimiento), INEC (NSE por parroquia), SENESCYT (acceso a universidad)

**Tema C — Medio ambiente:**
"Ecuador pierde 250,000 hectareas de bosque al año — quienes se benefician y quienes pagan"
Datos: MAE/MAATE (deforestacion), SERCOP (contratos en zonas de amortiguamiento), INEC (pobreza en comunidades afectadas)

**Tema D — Economia:**
"La trampa del dolar: por que los ecuatorianos son los latinoamericanos que mas trabajan pero menos ahorran"
Datos: BCE (salarios reales), INEC (ahorro por quintil), comparacion regional CEPAL

**Tema E — Tecnologia:**
"El desierto digital: Ecuador en 2026, aun en desventaja digital vs sus vecinos"
Datos: ARCOTEL (penetracion internet), ITU (benchmarks internacionales), INEC (acceso por provincia)

**Tema F — Seguridad:**
"El mapa del miedo: como cambiaron los patrones de inseguridad en Ecuador 2019-2024"
Datos: DINASED (estadisticas delicticas), AMT (accidentes), INEC (percepcion de seguridad)

**Brief del proyecto (llenar en 5 minutos):**
```
TEMA ELEGIDO: _______________
TESIS CENTRAL (una oracion): _______________
AUDIENCIAS (3 distintas):
  1. [AUDIENCIA CIUDADANA]: Ejemplo: ciudadano ecuatoriano promedio
  2. [AUDIENCIA EJECUTIVA]: Ejemplo: ministro o director
  3. [AUDIENCIA PERIODISTICA]: Ejemplo: editor de GK.city
DATOS PRINCIPALES A USAR: _______________
HERRAMIENTA(S) DE VISUALIZACION: _______________
ENTREGABLES:
  - [ ] STAR narrativo (200 palabras)
  - [ ] Infografia para LinkedIn
  - [ ] Dashboard Streamlit (URL publica)
  - [ ] Articulo periodistico (500 palabras)
  - [ ] Presentacion ejecutiva (6 slides Gamma)
```

### Parte 2 — Investigacion y datos (15 min)

Descarga y analiza los datos para tu tema:

```python
import pandas as pd
import numpy as np

# TEMPLATE DE INVESTIGACION
# Reemplaza con los datos reales de tu tema

def investigar_tema(tema: str, hipotesis: str) -> dict:
    """
    Framework de investigacion para historia de datos ecuatoriana.
    Retorna un diccionario con todos los hallazgos.
    """
    hallazgos = {
        "tema": tema,
        "hipotesis": hipotesis,
        "dato_principal": None,    # El numero mas impactante
        "dato_contexto": None,     # Para dimensionar el dato principal
        "dato_tendencia": None,    # Como ha cambiado
        "dato_geografico": None,   # Donde es mas critico
        "dato_demografico": None,  # A quien afecta mas
        "comparacion_regional": None,  # vs Colombia, Peru, promedio Latam
        "gap_de_datos": None,      # Que no pudiste conseguir y por que importa
        "fuentes": []
    }

    # Tus hallazgos van aqui basados en la investigacion real
    # Usa Perplexity + los portales oficiales para encontrar los datos

    return hallazgos

# ANALISIS BASICO (adapta segun tus datos)
# df = pd.read_csv("tu_dataset.csv")
#
# Preguntas que tu analisis debe responder:
# 1. Cual es la magnitud del problema HOY? (con numero y fuente)
# 2. Como ha cambiado en los ultimos 5 años?
# 3. Donde es mas severo geograficamente?
# 4. A que grupo demografico afecta mas?
# 5. Que causas explican el patron que encontraste?
# 6. Cual seria el impacto de resolver el problema?
```

### Parte 3 — Producir los 5 entregables (30 min)

Trabaja de forma paralela: mientras Gamma genera la infografia, tu escribes el STAR. Usa Claude para los textos y Gamma para los visuales.

**ENTREGABLE 1 — STAR narrativo (5 min):**
```
PROMPT PARA CLAUDE:
"Con estos datos de mi investigacion: [PEGA HALLAZGOS]
Escribe un STAR narrativo de 200 palabras sobre [TU TEMA] para la audiencia
ciudadana ecuatoriana. El tono debe ser accesible sin ser simplista.
Recuerda: S=Situacion (contexto), T=Tension (el dato que sorprende),
A=Accion (que se esta haciendo o se deberia hacer), R=Resultado (impacto
potencial si se actua)."
```

**ENTREGABLE 2 — Infografia para LinkedIn (10 min):**
Usa Gamma con el prompt de la Sesion 4, adaptado para tu tema.
La infografia debe tener:
- Titulo-conclusion en 10 palabras
- El numero mas impactante como hero visual
- 3 datos de soporte como stat cards
- Una visualizacion central (grafico de barras o mapa)
- Fuentes en el pie

**ENTREGABLE 3 — Dashboard Streamlit (10 min):**
Usa la estructura de la Sesion 3 pero con tus datos reales:
- Hero metric con el dato principal
- Grafico de tendencia temporal
- Desglose geografico (por provincia o ciudad)
- Insight box con la conclusion
- Deploya en Streamlit Community Cloud (URL publica)

**ENTREGABLE 4 — Articulo periodistico (10 min):**
Usa el prompt de la Sesion 6 con Claude para generar el articulo de 500 palabras.
Verifica con el checklist de publicabilidad de esa sesion.

**ENTREGABLE 5 — Presentacion ejecutiva (5 min):**
6 slides en Gamma usando la estructura de la Sesion 5 (piramide invertida):
- Slide 1: Recomendacion principal
- Slides 2-4: Evidencia
- Slide 5: Impacto y costo de no actuar
- Slide 6: Proximos pasos con responsables

### Parte 4 — Autoevaluacion y portafolio (5 min)

Evalua tu proyecto completo con esta rubrica:

| Criterio | Peso | Puntuacion (1-5) | Evidencia |
|---|---|---|---|
| Rigor en la investigacion de datos (fuentes verificadas) | 20% | ? | |
| Calidad narrativa (STAR aplicado correctamente) | 20% | ? | |
| Impacto visual (infografia/dashboard profesionales) | 20% | ? | |
| Adaptacion a audiencias (3 formatos distintos y coherentes) | 20% | ? | |
| Relevancia y originalidad del tema para Ecuador | 20% | ? | |
| **TOTAL** | 100% | ? | |

**Agregar al portafolio:**

Crea o actualiza tu perfil de LinkedIn con:
1. Un post con la infografia + el STAR como copy del post
2. Una entrada en la seccion "Proyectos" con enlace al dashboard Streamlit
3. Un snippet del articulo periodistico como articulo en LinkedIn

Esto convierte el ejercicio academico en evidencia publica de tus capacidades.

## Usa IA para...

- Pedirle a Claude que genere 3 titulos alternativos para tu historia y que elija el mas impactante y por que.
- Preguntarle si tu historia tiene algun sesgo de confirmacion (cherry-picking de datos que solo apoyan tu tesis).
- Pedirle que actue como editor de GK.city y que critique tu articulo con la misma exigencia que un editor profesional.

## Que aprendiste

- Que el mismo conjunto de datos puede contar historias radicalmente diferentes segun el formato y la audiencia.
- Que la consistencia narrativa — la misma tesis central en todos los formatos — es lo que convierte un conjunto de visualizaciones en una historia de datos real.
- Que el portafolio publico (LinkedIn, GitHub, URL del dashboard) es mas valioso que el certificado de titulacion para conseguir empleo en el sector tech ecuatoriano.
- Que las habilidades de storytelling con datos son transversales a todos los roles: analista, fundador, investigador, consultor, periodista.

## Reto extra

Presenta tu historia de datos en un espacio publico real: (1) Postulala a DataGram Ecuador (si existe en 2026), (2) presentala en un meetup de datos en Quito o Guayaquil (Meetup.com tiene grupos activos), o (3) enviala como propuesta de charla a una conferencia de tecnologia ecuatoriana (Campus Party, Startup Weekend, hackathones del MIPRO). La retroalimentacion de una audiencia real no simulada es el ultimo y mas valioso ejercicio de todo el programa.
