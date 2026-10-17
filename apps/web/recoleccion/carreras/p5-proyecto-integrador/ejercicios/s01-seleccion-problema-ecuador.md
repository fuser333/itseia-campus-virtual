# Ejercicio Sesion 1: Seleccion de Problema Real Ecuador

**Materia:** Proyecto Integrador (Titulacion)
**Nivel:** Avanzado
**Herramienta IA:** Claude + Perplexity
**Duracion:** 55 min

## Objetivo

Seleccionar y definir un problema real del Ecuador que sea resoluble con IA, aplicable en contexto ecuatoriano, con datos disponibles para investigar, y con impacto social o economico medible. Esta es la decision mas importante del proyecto integrador — un problema mal elegido condena el proyecto desde el inicio.

## Contexto (Ecuador)

Los mejores proyectos de titulacion en ITSEIA son aquellos que abordan problemas reales del Ecuador que ninguna tesis universitaria ha resuelto bien con IA. Ecuador tiene brechas concretas: el sistema de salud publica con listas de espera de meses, agricultores que pierden el 30% de sus cosechas por plagas no detectadas a tiempo, estudiantes de bachillerato en zonas rurales sin acceso a orientacion vocacional. Estos no son problemas academicos — son problemas que si los resuelves, puedes fundar una empresa.

## Instrucciones

### Parte 1 — Mapeo de problemas solucionables con IA (20 min)

Investiga y documenta 5 problemas potenciales en diferentes sectores. Para cada uno usa Perplexity con el prompt:

```
PROMPT PARA PERPLEXITY:
"Investiga el problema de [PROBLEMA] en Ecuador.
Dame:
1. Magnitud del problema (datos numericos de fuentes oficiales INEC, MSP, MAE, BCE)
2. Causa raiz principal
3. Soluciones actuales y por que son insuficientes
4. Como la IA podria aportar una solucion mejor
5. Datos disponibles publicamente para investigar esto
Incluye URLs de fuentes verificables."
```

**Sectores y problemas sugeridos para investigar:**

| Sector | Problema | Magnitud estimada |
|---|---|---|
| Salud | Prediccion de ausentismo en citas MSP | 30-40% de citas no atendidas |
| Agro | Deteccion temprana de plagas en banano | $200M+ perdidas anuales |
| Educacion | Desercion escolar en bachillerato rural | 15% de tasa de desercion |
| Transporte | Prediccion de accidentes en vias criticas | 2,000+ muertos/año en vias |
| Finanzas | Deteccion de fraude en transacciones moviles | $50M+ fraude digital/año |
| Medio ambiente | Prediccion de derrames en oleoducto SOTE | 3+ derrames mayores/año |
| Seguridad | Prediccion de zonas de robo en Quito/Guayaquil | 80K+ robos reportados/año |

Investiga al menos 3 de estos sectores y agrega 2 propios que hayas observado en tu vida.

### Parte 2 — Matriz de evaluacion de problemas (15 min)

Evalua cada problema en 5 criterios:

```python
import pandas as pd

criterios = {
    "disponibilidad_datos": {
        "descripcion": "Hay datasets publicos o conseguibles para entrenar el modelo?",
        "peso": 0.30
    },
    "impacto_medible": {
        "descripcion": "El impacto de la solucion puede medirse con numeros?",
        "peso": 0.25
    },
    "factibilidad_tecnica": {
        "descripcion": "Puedes construir una solucion en 5 semanas con los conocimientos actuales?",
        "peso": 0.20
    },
    "novedad": {
        "descripcion": "No existe ya una solucion IA funcional para este problema en Ecuador?",
        "peso": 0.15
    },
    "interes_personal": {
        "descripcion": "Te apasiona este problema? Podrias hablar de el por horas?",
        "peso": 0.10
    }
}

# COMPLETA CON TUS 5 PROBLEMAS Y PUNTUACIONES (1-5)
problemas = {
    "Prediccion ausentismo MSP": {
        "disponibilidad_datos": 4,
        "impacto_medible": 5,
        "factibilidad_tecnica": 3,
        "novedad": 4,
        "interes_personal": 3
    },
    "Deteccion plagas banano": {
        "disponibilidad_datos": 3,
        "impacto_medible": 5,
        "factibilidad_tecnica": 4,
        "novedad": 3,
        "interes_personal": 2
    },
    # Agrega tus 3 problemas adicionales aqui
}

# Calcular puntaje ponderado
resultados = {}
for problema, puntuaciones in problemas.items():
    puntaje = sum(
        puntuaciones[criterio] * datos["peso"]
        for criterio, datos in criterios.items()
    )
    resultados[problema] = round(puntaje, 2)

# Ordenar por puntaje
resultados_ordenados = sorted(resultados.items(), key=lambda x: x[1], reverse=True)

print("RANKING DE PROBLEMAS PARA PROYECTO INTEGRADOR:")
print("="*60)
for i, (problema, puntaje) in enumerate(resultados_ordenados, 1):
    print(f"{i}. {problema}: {puntaje}/5.0")

print(f"\nPROBLEMA SELECCIONADO: {resultados_ordenados[0][0]}")
```

### Parte 3 — Definicion formal del problema (15 min)

Para el problema con mayor puntaje, escribe la "Definicion de Problema" formal usando la estructura estandar de proyectos de investigacion:

**PLANTILLA DE DEFINICION DE PROBLEMA:**

```
TITULO TENTATIVO DEL PROYECTO:
[Maximo 15 palabras, incluye la metodologia IA y el contexto Ecuador]
Ejemplo: "Modelo predictivo de ausentismo en consultas del MSP usando
         Random Forest con datos del RDACAA 2019-2024"

DESCRIPCION DEL PROBLEMA:
[150-200 palabras que describen el problema sin mencionar la solucion todavia]
- Contexto: donde y para quien existe este problema
- Magnitud: cuantas personas/organizaciones afecta (con datos)
- Consecuencias: que pasa si el problema no se resuelve
- Intentos previos: que se ha hecho y por que no ha funcionado

PREGUNTA DE INVESTIGACION:
[Una sola pregunta que resume todo el proyecto]
Ejemplo: "¿Puede un modelo de machine learning predecir con precision >= 75%
         el ausentismo a citas medicas en el sistema de salud publica ecuatoriano
         usando variables demograficas y clinicas del RDACAA?"

HIPOTESIS PRINCIPAL:
[Una afirmacion falseable sobre el resultado esperado]
Ejemplo: "Un modelo de Random Forest entrenado con datos del RDACAA 2019-2024
         predecira el ausentismo con AUC-ROC >= 0.78 en el conjunto de prueba."

OBJETIVO GENERAL:
[Un objetivo que responde directamente a la pregunta de investigacion]

OBJETIVOS ESPECIFICOS (3-5):
[Pasos concretos y medibles para alcanzar el objetivo general]
1. Recolectar y preprocesar el dataset del [FUENTE]
2. Explorar y analizar las variables [LISTA] mediante analisis estadistico
3. Entrenar y comparar [ALGORITMOS] con validacion cruzada k-fold
4. Evaluar el modelo optimo con [METRICAS] en datos de prueba no vistos
5. Desarrollar un prototipo de interfaz para uso por [USUARIO FINAL]

JUSTIFICACION:
[100 palabras: por que este problema merece ser el proyecto de titulacion]
```

### Parte 4 — Validacion con experto (5 min)

Usa Claude como "experto del dominio" para validar tu eleccion:

```
PROMPT PARA CLAUDE:
"Soy estudiante de ultimo año de Tecnologia en IA en ITSEIA (Ecuador).
Mi problema de investigacion es: [PEGA TU DEFINICION COMPLETA]

Actua como director de tesis y dame feedback honesto sobre:
1. Es el problema lo suficientemente especifico o es demasiado amplio?
2. La hipotesis es falseable con los datos disponibles en Ecuador?
3. Que fuentes de datos ecuatorianas especificas deberia priorizar?
4. Cual es el riesgo tecnico mas grande de este proyecto?
5. En una escala 1-10, que tan apropiado es este problema para un proyecto
   de titulacion de 5 semanas? Justifica tu nota."
```

Documenta el feedback y ajusta tu definicion de problema en consecuencia.

## Usa IA para...

- Usar Perplexity para encontrar los 3 papers mas recientes (2022-2025) sobre el mismo problema en Latinoamerica.
- Pedirle a Claude que liste los datasets publicos disponibles en Ecuador relevantes para tu problema (INEC, MSP, MAG, AMT, etc.).
- Preguntarle si tu problema tiene sesgos eticos potenciales (discriminacion, privacidad, impacto en grupos vulnerables).

## Que aprendiste

- Que la seleccion del problema es la decision tecnica mas importante del proyecto — mas que el algoritmo elegido.
- Como aplicar una matriz de evaluacion para tomar decisiones objetivas entre alternativas.
- Que una pregunta de investigacion bien formulada hace que todo lo demas (metodologia, metricas, conclusiones) se derive naturalmente.
- Que el mejor proyecto de titulacion es el que resuelve un problema real ecuatoriano con datos reales ecuatorianos.

## Reto extra

Realiza una entrevista real de 20 minutos con un profesional del sector que elegiste (medico, agricultor, educador, etc.). Documenta sus respuestas a estas 5 preguntas: (1) Que tan grave es este problema en tu dia a dia? (2) Cuanto tiempo/dinero pierdes por este problema? (3) Que soluciones has probado? (4) Si existiera una herramienta IA que resolviera este problema, la usarias? (5) Que tan precisa deberia ser para ser util? Incorpora sus respuestas en la justificacion de tu proyecto.
