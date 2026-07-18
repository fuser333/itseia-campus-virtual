# Ejercicio Sesion 1: Lean Startup — MVP y Validacion de Hipotesis

**Materia:** Emprendimiento Tecnologico
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT + Claude
**Duracion:** 55 min

## Objetivo

Aplicar la metodologia Lean Startup para identificar hipotesis criticas de un producto IA, disenar experimentos de validacion con recursos minimos, e interpretar resultados para decidir si pivotar o perseverar — todo en el contexto del ecosistema emprendedor ecuatoriano.

## Contexto (Ecuador)

En Ecuador, el 85% de las startups fracasan en los primeros 2 años. La causa numero 1 no es la falta de capital — es construir algo que nadie queria. Eric Ries desarrollo Lean Startup precisamente para evitar ese error: validar antes de construir. Para una startup de IA en Quito o Guayaquil, donde el capital semilla es escaso y los inversores son conservadores, validar barato es una habilidad de supervivencia.

## Instrucciones

### Parte 1 — El ciclo Build-Measure-Learn (10 min)

Toma esta idea de startup IA real del ecosistema ecuatoriano:

**IDA (Idea de Negocio):** "Una app que usa IA para ayudar a los agricultores del callejon interandino a predecir el precio de venta de sus cosechas 2 semanas antes de cosechar, para decidir si venden en mercado local o exportan."

Para esta idea, completa el mapa de hipotesis:

```
HIPOTESIS DE NEGOCIO (llena cada celda):

CATEGORIA          | HIPOTESIS                              | RIESGO (1-5)
---------------------|----------------------------------------|-------------
CLIENTE             | Los agricultores de la sierra tienen   |
                    | smartphone con internet                |
                    |                                        |
PROBLEMA            | No saber el precio futuro les hace     |
                    | perder dinero en ventas                |
                    |                                        |
SOLUCION            | Una prediccion 2 semanas antes es      |
                    | suficientemente precisa para decidir   |
                    |                                        |
CANAL               | WhatsApp es el mejor canal para        |
                    | llegar a este segmento                 |
                    |                                        |
MONETIZACION        | Los agricultores pagarian $5/mes        |
                    | por este servicio                      |
                    |                                        |
VENTAJA COMPETITIVA | Ninguna solucion existente da esto      |
                    | en Ecuador actualmente                 |
```

Identifica las 3 hipotesis con mayor riesgo (riesgo 5) y explica por que son las mas criticas de validar primero.

### Parte 2 — Disenar experimentos de validacion (20 min)

Para las 3 hipotesis de mayor riesgo, diseña un experimento que valide cada una con CERO desarrollo de software y maximo $100 de presupuesto:

**Formato de experimento:**
```
HIPOTESIS: [cual hipotesis validas]
EXPERIMENTO: [que vas a hacer exactamente]
METRICA DE EXITO: [numero especifico que confirma la hipotesis]
METRICA DE FRACASO: [numero especifico que la refuta]
TIEMPO: [cuantos dias]
COSTO: [dolares]
METODO: [entrevistas / landing page / prototipo papel / etc.]
```

**Restriccion:** Usa solo estas herramientas:
- Formulario Google Forms (gratis)
- Landing page con Carrd.co (gratis) o Notion (gratis)
- Grupo de WhatsApp
- 10 entrevistas presenciales en mercados locales
- Claude para generar el guion de entrevistas

Usa Claude para esto:

```
PROMPT PARA CLAUDE:
"Actua como experto en metodologia Lean Startup con experiencia en mercados
latinoamericanos. Tengo esta hipotesis: [copia tu hipotesis mas riesgosa].

Diseña un experimento de validacion que:
1. No requiera construir ninguna tecnologia
2. Cueste menos de $50
3. Pueda completarse en 7 dias en Ecuador
4. Genere datos cuantitativos (no solo cualitativos)
5. Tenga un criterio claro de exito/fracaso

Incluye: guion de entrevista, landing page copy, y criterio de pivot/persevere."
```

### Parte 3 — El MVP correcto (15 min)

Hay 5 tipos de MVP. Elige el adecuado para tu caso:

| Tipo de MVP | Descripcion | Cuando usarlo | Costo tipico |
|---|---|---|---|
| Concierge | Haces el servicio manualmente mientras parece automatico | Cuando la IA aun no existe | $0-100 |
| Wizard of Oz | El usuario cree que es IA, pero eres tu detras | Para validar la experiencia sin codigo | $0-50 |
| Landing page | Pagina que describe el producto y mide interes | Para validar demanda antes de construir | $0-30 |
| Prototipo papel | Mockup fisico del flujo de la app | Para validar UX sin desarrollo | $0-10 |
| Video explicativo | Dropbox lo hizo: video antes que producto | Para productos complejos de explicar | $50-200 |

Para la app de precios agricolas:
1. Cual MVP elegirias para la primera semana? Justifica.
2. Diseña el script del MVP Wizard of Oz: como simulas la prediccion de precios manualmente usando datos publicos del MAG (Ministerio de Agricultura)?
3. Cuantos agricultores necesitas probar para considerar el experimento estadisticamente valido?

### Parte 4 — Pivot o perseverar (10 min)

Analiza estos resultados reales de un experimento de 2 semanas:

```
EXPERIMENTO: Landing page para la app de precios agricolas
METRICAS OBTENIDAS:
- Visitas a la landing: 234
- Emails registrados: 12 (5.1% conversion)
- De esos 12: 8 son agricultores, 4 son intermediarios
- Entrevistas realizadas: 9
- Dispuestos a pagar $5/mes: 2 de 9 (22%)
- Precio que pagarian: 3 dijeron $2/mes, 4 dijeron nada, 2 dijeron $5

HIPOTESIS ORIGINAL:
"Los agricultores pagarian $5/mes por predicciones de precio"

CRITERIO DE EXITO ORIGINAL:
"Si el 40% de los entrevistados dice que pagaria $5/mes o mas"
```

Responde:
1. Segun los datos, deberias pivotar o perseverar? Justifica con los numeros.
2. Que tipo de pivot explorarias? (segmento, canal, precio, problema)
3. Los intermediarios (no los agricultores) mostraron interes. Es eso una señal? Que explorarias?
4. Diseña el siguiente experimento para la proxima semana con los aprendizajes de esta.

## Usa IA para...

- Pedirle a ChatGPT que genere el guion completo de 10 preguntas para entrevistar agricultores en mercados de Ambato o Latacunga.
- Preguntarle a Claude que metricas de vanidad vs metricas accionables deberia medir una startup de agro-IA en Ecuador.
- Pedirle que analice los resultados del experimento y sugiera 3 pivotes posibles con sus pros y contras.

## Que aprendiste

- Que una hipotesis no validada es solo una opinion cara.
- Que validar con $50 y 2 semanas es siempre mejor que construir con $50,000 y 6 meses.
- La diferencia entre un MVP y un prototipo: el MVP mide una hipotesis critica; el prototipo muestra como funciona.
- Que los datos cualitativos (entrevistas) y cuantitativos (metricas de landing) se complementan — ninguno es suficiente solo.

## Reto extra

Elige una idea de startup IA que resuelva un problema real que hayas observado en Ecuador (puede ser de cualquier sector). Construye la landing page completa en Carrd.co o Notion en menos de 2 horas usando Claude para el copy, lanzala en grupos relevantes de Facebook o WhatsApp, y reporta los resultados de 72 horas: visitas, registros, y 3 aprendizajes concretos.
