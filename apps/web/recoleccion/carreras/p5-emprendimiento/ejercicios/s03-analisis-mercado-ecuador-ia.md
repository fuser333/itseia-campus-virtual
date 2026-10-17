# Ejercicio Sesion 3: Analisis de Mercado Ecuador con IA

**Materia:** Emprendimiento Tecnologico
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT + Claude + Perplexity
**Duracion:** 55 min

## Objetivo

Construir un analisis de mercado TAM-SAM-SOM riguroso y defendible para un producto de IA en Ecuador, usando fuentes de datos publicas oficiales (INEC, BCE, SENESCYT, SRI), metodologias bottom-up y top-down, e identificando los segmentos de mayor oportunidad con menor competencia.

## Contexto (Ecuador)

Cuando un inversor en Ecuador te pregunta "cual es el tamaño de tu mercado?", la respuesta "es enorme" destruye tu credibilidad. La respuesta correcta es: TAM $X millones (metodologia X), SAM $X millones (justificado por criterios A, B, C), SOM año 1 $X miles (basado en capacidad de ventas). Este ejercicio te enseña a construir ese numero de forma defensible con datos reales del INEC y el BCE.

## Instrucciones

### Parte 1 — Fuentes de datos publicas de Ecuador (10 min)

Familiarizate con estas 5 fuentes oficiales que todo emprendedor ecuatoriano debe conocer:

| Fuente | URL | Que datos tiene | Util para |
|---|---|---|---|
| INEC | ecuadorencifras.gob.ec | Poblacion, hogares, empresas por sector, empleo | TAM demografico |
| BCE | bce.fin.ec | PIB por sector, importaciones, exportaciones, credito | Tamaño de sectores economicos |
| SRI | sri.gob.ec | Numero de contribuyentes por actividad economica, ingresos declarados | Mercado de empresas por sector |
| SENESCYT | senescyt.gob.ec | Matriculas universitarias, titulados, oferta academica | Mercado educativo |
| SUPERCIAS | supercias.gob.ec | Empresas registradas, balances, sectores | Mercado B2B empresarial |

Para el producto LexBot (del ejercicio anterior), busca en estas fuentes:
1. Cuantos abogados activos hay en Ecuador? (INEC — Encuesta de Empleo)
2. Cuantos estudios juridicos estan registrados como empresas? (SUPERCIAS)
3. Cual es el ingreso promedio anual de un abogado en Ecuador? (INEC)

Si no encuentras el dato exacto, documenta el dato mas cercano que encontraste y como lo usaras como proxy.

### Parte 2 — Metodologia TAM-SAM-SOM (20 min)

**Metodologia Top-Down (de arriba hacia abajo):**

```python
# Calculo TAM top-down para LexBot

# Datos del mercado global de Legal Tech
mercado_global_legal_tech_usd = 27_600_000_000  # $27.6B (fuente: Grand View Research 2024)
participacion_latam = 0.04  # 4% del mercado global
participacion_ecuador_en_latam = 0.025  # Ecuador es ~2.5% de la economia de LATAM

TAM_top_down = mercado_global_legal_tech_usd * participacion_latam * participacion_ecuador_en_latam
print(f"TAM Top-Down: ${TAM_top_down:,.0f} ({TAM_top_down/1_000_000:.1f}M USD)")
```

**Metodologia Bottom-Up (de abajo hacia arriba — mas defensible):**

```python
# Calculo TAM bottom-up para LexBot — COMPLETA LOS DATOS REALES

# Paso 1: Universo de potenciales clientes
abogados_ecuador = 30_000        # Fuente: FBP (Federacion de Barras Provinciales)
estudios_juridicos = 3_200       # Fuente: SUPERCIAS (busca CIIU M6910)

# Paso 2: Segmentar por disposicion a pagar
pct_con_smartphone_y_banco = 0.72    # Aprox 72% penetracion digital en profesionales
pct_open_to_tech = 0.35              # 35% open a nuevas herramientas tech (estimado)

clientes_potenciales = (abogados_ecuador + estudios_juridicos) * pct_con_smartphone_y_banco * pct_open_to_tech
print(f"Clientes potenciales: {clientes_potenciales:,.0f}")

# Paso 3: ARPU (Average Revenue Per User)
precio_plan_pro = 59   # USD/mes plan individual pro
meses_retencion_promedio = 14  # LTV promedio en SaaS B2B

TAM_bottom_up = clientes_potenciales * precio_plan_pro * 12  # Mercado anual
print(f"\nTAM Bottom-Up (anual): ${TAM_bottom_up:,.0f} ({TAM_bottom_up/1_000_000:.1f}M USD)")

# SAM — Mercado Direccionable (con nuestro go-to-market actual)
pct_quito_guayaquil = 0.65  # 65% de abogados en estas 2 ciudades
SAM = TAM_bottom_up * pct_quito_guayaquil
print(f"SAM (Quito + Guayaquil): ${SAM:,.0f} ({SAM/1_000_000:.1f}M USD)")

# SOM Año 1 — Mercado Obtenible
capacidad_ventas_mes = 15  # Nuevos clientes por mes con 1 persona de ventas
precio_mensual = 59
churn_mensual = 0.05

clientes_acumulados_m12 = sum(
    capacidad_ventas_mes * (1 - churn_mensual) ** (12 - mes)
    for mes in range(12)
)

SOM_anio1 = clientes_acumulados_m12 * precio_mensual * 12
print(f"\nSOM Año 1: ${SOM_anio1:,.0f} ({SOM_anio1/1_000:.0f}K USD)")
print(f"Clientes al fin del año 1: {clientes_acumulados_m12:.0f}")

# Resumen ejecutivo
print(f"\n{'='*50}")
print(f"ANALISIS DE MERCADO LEXBOT — ECUADOR")
print(f"TAM: ${TAM_bottom_up/1_000_000:.1f}M USD / año")
print(f"SAM: ${SAM/1_000_000:.1f}M USD / año")
print(f"SOM Y1: ${SOM_anio1/1_000:.0f}K USD")
print(f"Penetracion SOM/SAM: {SOM_anio1/SAM*100:.1f}%")
```

Ejecuta el codigo y ajusta los parametros con datos reales que encontraste en la Parte 1.

### Parte 3 — Analisis de competencia con IA (15 min)

Usa Perplexity o ChatGPT para investigar la competencia:

```
PROMPT PARA PERPLEXITY:
"Investiga el mercado de asistentes IA para abogados en Ecuador y America Latina.
Quiero saber:
1. Que soluciones de legal tech existen actualmente en Ecuador (menciona nombres especificos)?
2. Cuales soluciones internacionales de legal AI podrian entrar al mercado ecuatoriano?
3. Como se comparan en precio con lo que un abogado ecuatoriano podria pagar?
4. Que limitaciones tienen estas soluciones para el mercado ecuatoriano especificamente (idioma, jurisprudencia local, etc.)?
Incluye fuentes verificables."
```

Con los resultados, completa esta matriz de competencia:

| Competidor | Precio/mes | Fortaleza | Debilidad | Riesgo para LexBot (1-5) |
|---|---|---|---|---|
| Harvey AI (EEUU) | $99+ | Reputacion global | No tiene jurisprudencia EC | 2 |
| [Competidor Local 1] | ? | ? | ? | ? |
| [Competidor Local 2] | ? | ? | ? | ? |
| ChatGPT (uso directo) | $20 | Precio bajo, conocido | Sin especializacion legal EC | 4 |

### Parte 4 — Insight estrategico (10 min)

Con toda la informacion recopilada, redacta un "Memorandum de Oportunidad de Mercado" de 200 palabras para potenciales inversores. Debe incluir:
- Tamaño del mercado con metodologia y fuentes
- 3 señales de que el momento es ahora (market timing)
- La ventaja competitiva especifica que ningun competidor internacional puede replicar
- La metrica que usaras para demostrar product-market fit en los primeros 90 dias

## Usa IA para...

- Pedirle a Claude que sea el "abogado del diablo" de tu analisis TAM y señale los 5 supuestos mas cuestionables.
- Pedirle a ChatGPT que genere 10 preguntas que un inversor de la Alianza para el Emprendimiento haria sobre tu analisis de mercado.
- Usar Perplexity para encontrar el informe mas reciente sobre adopcion de legal tech en Latinoamerica.

## Que aprendiste

- Que el TAM top-down impresiona pero el SAM bottom-up convence a los inversores.
- Donde encontrar datos primarios confiables y gratuitos del mercado ecuatoriano (INEC, BCE, SUPERCIAS).
- Que la competencia mas peligrosa suele ser la mas obvia: ChatGPT a $20/mes que el cliente ya conoce.
- Como calcular el SOM con supuestos de capacidad de ventas reales (no aspiracionales).

## Reto extra

Replica el analisis TAM-SAM-SOM para DOS sectores distintos de tu eleccion en Ecuador (ideas: agro-tech, fintech, health-tech, ed-tech, legal-tech). Compara los dos y argumenta cuál tiene mayor oportunidad para una startup de IA fundada hoy con $50,000 de capital inicial. Presenta tu conclusion en una tabla comparativa de 5 criterios.
