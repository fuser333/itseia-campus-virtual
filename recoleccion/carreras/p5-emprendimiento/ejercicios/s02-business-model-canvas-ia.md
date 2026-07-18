# Ejercicio Sesion 2: Business Model Canvas para Producto IA

**Materia:** Emprendimiento Tecnologico
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT + Claude
**Duracion:** 50 min

## Objetivo

Construir un Business Model Canvas completo y coherente para un producto de IA, identificar los bloques mas criticos para productos digitales vs fisicos, analizar los modelos de monetizacion disponibles para IA (SaaS, API, freemium, marketplace), y evaluar la viabilidad del modelo para el mercado ecuatoriano.

## Contexto (Ecuador)

El Business Model Canvas fue diseñado para negocios fisicos. Los productos de IA tienen caracteristicas que cambian radicalmente algunos bloques: el "costo marginal casi cero" de escalar, la dependencia de APIs de terceros como recurso clave, los datos como activo diferenciador, y la regulacion emergente de IA como amenaza. Aprender a adaptar el BMC para productos IA es una competencia que los inversores ecuatorianos y del exterior valoran.

## Instrucciones

### Parte 1 — BMC clasico vs BMC para IA (10 min)

Analiza como cambian los 9 bloques del BMC para productos IA:

| Bloque BMC | Negocio Tradicional | Producto IA — Diferencias clave |
|---|---|---|
| Segmentos de clientes | Demograficos y geograficos | Tambien por nivel de madurez digital y tolerancia al riesgo de IA |
| Propuesta de valor | Producto/servicio claro | Incluye "inteligencia" como valor — mas dificil de explicar |
| Canales | Vendedores, tiendas | Digital-first; demos interactivas son clave para la venta |
| Relaciones con clientes | Personal, autoservicio | Onboarding critico — la IA puede decepcionar si no se usa bien |
| Fuentes de ingresos | Venta, alquiler | SaaS mensual, por uso (tokens), freemium, licencia API |
| Recursos clave | Fisicos, humanos | **DATOS** + creditos de API + talent de ML + poder de computo |
| Actividades clave | Produccion, ventas | **Mantenimiento del modelo** + recoleccion de datos + monitoreo |
| Socios clave | Proveedores, distribuidores | **OpenAI / Anthropic / AWS** — riesgo de dependencia critico |
| Estructura de costos | COGS, OpEx | Costo de API por solicitud — escala con el uso |

Identifica los 3 bloques donde los productos IA difieren MAS de negocios tradicionales y explica en 2 oraciones cada uno por que son distintos.

### Parte 2 — Construir el BMC de un producto IA ecuatoriano (25 min)

Usa este caso: **"LexBot" — asistente IA para estudios juridicos en Ecuador**

Construye el BMC completo. Para cada bloque, usa Claude con el prompt siguiente:

```
PROMPT BASE PARA USAR CON CLAUDE:
"Estoy construyendo el BMC para LexBot, un asistente de IA para abogados
ecuatorianos que: (1) resume jurisprudencia de la Corte Constitucional en
segundos, (2) genera borradores de demandas con formato correcto para tribunales
ecuatorianos, (3) calcula tiempos procesales segun el COGEP.

Para el bloque [NOMBRE DEL BLOQUE] del Business Model Canvas, desarrolla
el contenido especifico considerando: el mercado legal ecuatoriano, los habitos
digitales de los abogados locales (mayoria 40+ años, conservadores con tecnologia),
y que hay 30,000 abogados registrados en el FBP en Ecuador.

Se especifico con numeros, nombres de canales reales en Ecuador, y posibles
objeciones del cliente."
```

Completa este canvas (puedes hacerlo en papel o en Miro/FigJam):

```
┌─────────────────────────────────────────────────────────────────────┐
│ SOCIOS CLAVE        │ ACTIVIDADES CLAVE  │ PROPUESTA DE VALOR       │
│                     │                    │                          │
│ - Anthropic/OpenAI  │ - Desarrollo APIs  │ El único asistente legal │
│ - ?                 │ - ?                │ entrenado en             │
│ - ?                 │ - ?                │ jurisprudencia EC        │
│                     ├────────────────────│                          │
│                     │ RECURSOS CLAVE     │                          │
│                     │                    │                          │
│                     │ - Corpus legal EC  │                          │
│                     │ - ?                │                          │
│                     │ - ?                │                          │
├─────────────────────┴────────────────────┼──────────────────────────┤
│ RELACIONES CON CLIENTES                  │ SEGMENTOS DE CLIENTES    │
│                                          │                          │
│ - ?                                      │ - Abogados independientes│
│ - ?                                      │ - Estudios juridicos     │
│                                          │ - ?                      │
├─────────────────────────────────────────────────────────────────────┤
│ CANALES                                                             │
│                                                                     │
│ - ?                                                                 │
├───────────────────────────────┬─────────────────────────────────────┤
│ ESTRUCTURA DE COSTOS          │ FUENTES DE INGRESOS                 │
│                               │                                     │
│ - API OpenAI/Anthropic: X%    │ - Plan basico: $?/mes               │
│ - Desarrollo: X%              │ - Plan pro: $?/mes                  │
│ - Marketing: X%               │ - Plan empresa: $?/mes              │
└───────────────────────────────┴─────────────────────────────────────┘
```

### Parte 3 — Modelos de monetizacion para IA (10 min)

Analiza estos 5 modelos de revenue para LexBot y elige el mas adecuado para el mercado ecuatoriano:

| Modelo | Descripcion | Ventaja | Desventaja | Adecuado para EC? |
|---|---|---|---|---|
| Freemium | Basico gratis, premium pago | Adquisicion facil | Baja conversion | ? |
| SaaS mensual | Subscripcion fija | Ingreso predecible | Requiere valor percibido consistente | ? |
| Por uso (pay-per-query) | Paga por consulta | Sin barrera entrada | Ingreso impredecible | ? |
| Licencia anual corporativa | Precio fijo para empresa | Deal size grande | Ciclo de venta largo | ? |
| Marketplace + comision | Conecta abogados con clientes | Efecto red | Complejo de escalar | ? |

Para Ecuador especificamente: Los abogados ecuatorianos prefieren pagar mensual o anual? Justifica tu respuesta con lo que sabes del comportamiento del consumidor local.

### Parte 4 — Analisis de riesgos del modelo (5 min)

Identifica los 3 riesgos ESPECIFICOS para un producto IA en Ecuador que no existirian para un producto SaaS no-IA:

Ejemplo: "Riesgo regulatorio: Ecuador podria regular el uso de IA en asesoramiento legal, invalidando el modelo de negocio si se requiere supervision humana certificada."

Escribe los 3 riesgos y una estrategia de mitigacion para cada uno.

## Usa IA para...

- Pedirle a ChatGPT que compare el BMC de LexBot con el de Harvey AI (el asistente legal de $300M de valuacion en EEUU) y que adaptaciones necesitarias para Ecuador.
- Pedirle a Claude que juegue el rol de un abogado ecuatoriano de 45 años y exprese sus objeciones reales a adoptar LexBot.
- Preguntarle sobre la estrategia de pricing de los SaaS B2B en Latinoamerica: precio en USD o en local? pago anual vs mensual?

## Que aprendiste

- Que los productos de IA tienen una dependencia critica en socios clave (proveedores de modelos) que es un riesgo existencial si cambian sus precios o condiciones.
- Que los datos son el recurso mas valioso y diferenciador de un producto IA — y en Ecuador son escasos.
- Como adaptar el modelo de monetizacion al comportamiento financiero del mercado ecuatoriano (preferencia por pagos mensuales, bajo uso de tarjetas de credito, alta importancia del precio).

## Reto extra

Construye el BMC completo para tu propia idea de startup IA en Ecuador en Miro o Mural (herramientas gratis). Luego usa Claude para hacerle un "stress test": pidele que actue como un inversor esceptico de Startups Buen Viaje y que haga las 10 preguntas mas dificiles sobre tu modelo de negocio. Responde cada pregunta y ajusta el canvas con los aprendizajes.
