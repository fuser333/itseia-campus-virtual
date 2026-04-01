# Ejercicio Sesion 8: Mini Proyecto — Resuelve un Problema Real de Ecuador con IA

**Materia:** Introduccion a la Inteligencia Artificial
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT + Claude + herramientas libres
**Duracion estimada:** 45 min

## Objetivo

Integrar todo lo aprendido en el Periodo 1 para identificar, analizar y proponer una solucion real basada en IA a un problema especifico de Ecuador, presentando un entregable profesional que puedas usar en tu portafolio.

## Contexto

Este es tu **primer proyecto de portafolio como tecnologo en IA**. No es un ejercicio academico: es una propuesta real que podrias llevar a una empresa, presentar a un inversor, o publicar en LinkedIn. Al terminar este primer periodo de ITSEIA, debes poder decir: "Identifique un problema real en Ecuador y propuse una solucion con IA". Eso te diferencia del 95% de candidatos de primer semestre.

## Instrucciones

### Paso 1 — Elige tu problema (10 min)

Selecciona UNO de estos problemas reales de Ecuador (o propone el tuyo con aprobacion del docente):

**Opcion A — Agricultura**
El MAGAP reporta que agricultores de papa en Carchi pierden entre 20-35% de su cosecha por plagas no detectadas a tiempo. El monitoreo manual es costoso e impreciso.

**Opcion B — Salud**
El IESS tiene listas de espera de hasta 90 dias para citas con especialistas en Quito y Guayaquil. Pacientes con casos urgentes esperan lo mismo que casos de baja complejidad por falta de triaje automatizado.

**Opcion C — Educacion**
La tasa de abandono escolar en Ecuador es del 6.8% (INEC 2024). La mayoria de deserciones no se detectan hasta que ya ocurrieron: no hay sistema de alerta temprana.

**Opcion D — Trafico**
Quito tiene 800,000 vehiculos y los semaforos funcionan con ciclos fijos desde los años 90. En horas pico, el tiempo promedio de viaje se duplica innecesariamente.

**Opcion E — Tu propio problema**
Identifica un problema real que vives tu, tu familia o tu comunidad. Debe ser cuantificable (tiene datos) y resoluble con IA.

### Paso 2 — Estructura del proyecto (15 min)

Completa este canvas de proyecto con toda la informacion que puedas investigar:

```
NOMBRE DEL PROYECTO: [Nombre creativo]
PROBLEMA:
  - Descripcion en 2 lineas
  - A quien afecta (cuantas personas en Ecuador)
  - Costo del problema en USD o tiempo perdido

DATOS DISPONIBLES:
  - Que datos existirian para entrenar el modelo
  - Donde conseguirlos (INEC, MAGAP, hospitales, sensores, etc.)
  - Formato de los datos (imagenes, texto, numeros, series de tiempo)

SOLUCION CON IA:
  - Tipo de IA que usarias (ML, DL, GenAI)
  - Que hace el sistema exactamente
  - Que predice, clasifica o genera

IMPACTO ESPERADO:
  - Mejora cuantificable (%, USD, tiempo)
  - Quien se beneficia directamente
  - Quien pagaria por esta solucion

HERRAMIENTAS TECNICAS:
  - Lenguaje de programacion: Python
  - Libreria principal: [scikit-learn / TensorFlow / OpenAI API]
  - Infraestructura: [Google Colab / AWS / local]
  - Costo estimado de implementacion inicial

RIESGOS Y LIMITACIONES:
  - 2 riesgos tecnicos
  - 2 riesgos de negocio
  - 1 consideracion etica
```

### Paso 3 — Prototipo conceptual (10 min)

Dibuja en papel o en Google Slides un **diagrama de flujo** del sistema:

```
[Fuente de datos] → [Procesamiento] → [Modelo IA] → [Resultado] → [Usuario final]
```

Para cada caja escribe el elemento especifico de tu proyecto. Ejemplo para Opcion A (agricultura):
```
[Foto de hoja por telefono] → [Preprocesamiento imagen] → [Modelo CNN clasificador] → [Alerta: plaga X detectada, accion recomendada] → [Agricultor en Carchi]
```

### Paso 4 — Entregable final (10 min)

Escribe un **resumen ejecutivo de 1 pagina** con esta estructura exacta:

**Titulo del proyecto**

**El problema** (2-3 oraciones con datos reales de Ecuador)

**Nuestra solucion** (2-3 oraciones explicando el sistema de IA sin jerga tecnica)

**Como funciona** (4-5 pasos del flujo del sistema, lenguaje simple)

**Impacto esperado** (3 metricas especificas: %, USD o tiempo)

**Proximos pasos** (3 acciones concretas para avanzar del concepto al prototipo)

**Tecnologias clave** (3-5 herramientas/frameworks con 1 linea de por que cada una)

## Usa IA para...

> Abre ChatGPT con este prompt:
> "Soy estudiante de primer semestre de Tecnologia en Inteligencia Artificial en ITSEIA, Ecuador. Estoy haciendo mi primer mini proyecto de portafolio. He elegido el problema de [DESCRIBE TU PROBLEMA ELEGIDO]. Ayudame a: 1) Validar si este problema es real y cuantificable en Ecuador (busca datos), 2) Identificar si alguien ya lo esta resolviendo con IA en Latinoamerica, 3) Sugerirme el tipo de modelo de ML/DL mas adecuado para este caso y por que, 4) Decirme que dataset publico podria usar para empezar a construir un prototipo."

Luego abre Claude y pidele:
> "Critica mi propuesta de proyecto [describe tu canvas del Paso 2]. Identifica: 1) Los 3 supuestos mas riesgosos que estoy haciendo, 2) Una consideracion etica que no estoy tomando en cuenta, 3) Por que alguien pagaria por esto y cuanto."

## Que aprendiste

- Un **proyecto de IA** no empieza con codigo: empieza con la comprension profunda del problema y los datos disponibles.
- El **canvas de proyecto** es mas valioso que 100 lineas de codigo sin direccion clara.
- La **IA sola no resuelve problemas**: necesita datos de calidad, un usuario claro y un modelo de negocio.
- Tu **portafolio** comienza en el primer semestre, no cuando te graduaas.
- Los mejores proyectos de IA en paises como Ecuador resuelven problemas **locales especificos** que startups de Silicon Valley ignoran.
- Un **resumen ejecutivo** bien escrito abre puertas: con este documento puedes tocar la puerta de empresas, aceleration, o fondos de innovacion.

## Reto extra (Proyecto de Cierre de Periodo)

Lleva este mini proyecto al siguiente nivel: presenta tu resumen ejecutivo de 1 pagina + el diagrama de flujo en **5 minutos** frente a la clase. Usa Google Slides con maximo 5 diapositivas. Al terminar la presentacion, el grupo hace preguntas durante 3 minutos. Esta dinamica simula exactamente como se presentan proyectos de IA en el mundo real: ante inversionistas, directivos y equipos tecnicos. El proyecto mejor evaluado por los companeros sera publicado en el LinkedIn de ITSEIA como caso de estudio.
