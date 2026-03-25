# Ejercicio Sesion 7: Growth Hacking para Startups Tech

**Materia:** Emprendimiento Tecnologico
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT + Claude
**Duracion:** 55 min

## Objetivo

Disenar e implementar experimentos de growth hacking especificos para startups de IA en Ecuador, dominar el framework AARRR (Pirate Metrics), identificar los canales de adquisicion con mejor CPL para el mercado ecuatoriano, y construir un playbook de crecimiento basado en datos y no en intuicion.

## Contexto (Ecuador)

El growth hacking no es hacer spam ni trucos sucios — es encontrar el canal de adquisicion mas eficiente para tu producto especifico en tu mercado especifico. En Ecuador, Meta Ads (Facebook + Instagram) sigue siendo el canal mas eficiente para consumer (CPL $3-8), mientras LinkedIn es el mejor para B2B de tique alto (CPL $20-50 pero conversion mas alta). TikTok crece rapido entre menores de 35. Saber esto antes de gastar un dolar en ads es la diferencia entre crecer y quemarse.

## Instrucciones

### Parte 1 — Framework AARRR aplicado a IA (15 min)

El funnel AARRR (Pirate Metrics) tiene 5 etapas. Para cada etapa, define la metrica clave y el experimento para mejorarla:

**Para una startup de IA B2B en Ecuador (usa tu propia startup o LexBot):**

| Etapa | Que mide | Metrica clave | Benchmark industria | Tu metrica actual | Experimento a probar |
|---|---|---|---|---|---|
| Acquisition | Cuantos te conocen | Visitas web/mes, CPL | CPL $15-30 B2B EC | ? | A/B test en landing |
| Activation | Primera experiencia de valor | % que completa onboarding | 40-60% | ? | Simplificar paso 1 |
| Retention | Vuelven a usar | DAU/WAU, churn mensual | Churn <5%/mes SaaS | ? | Email de reactivacion |
| Revenue | Cuanto pagan | MRR, ARPU, LTV | LTV:CAC > 3:1 | ? | Upsell a plan pro |
| Referral | Te recomiendan | NPS, % clientes que refieren | NPS > 50 | ? | Programa de referidos |

Para cada etapa, escribe el experimento especifico que probaras en las proximas 2 semanas y como mediras el resultado.

### Parte 2 — Los 5 canales de adquisicion mas efectivos para startups IA en Ecuador (20 min)

**CANAL 1 — Content Marketing + SEO:**
Para una startup de IA, el content marketing es el canal con mejor ROI a largo plazo. Los profesionales ecuatorianos buscan en Google antes de comprar software.

Usa ChatGPT para esto:
```
PROMPT:
"Genera una estrategia de content marketing para [NOMBRE STARTUP], una startup
de IA para [PROFESION TARGET] en Ecuador.

Dame:
1. 10 titulos de articulos de blog que tendrian alto volumen de busqueda en Ecuador
   (incluye la keyword principal y el volumen estimado)
2. La estructura de un articulo pilar de 2000 palabras para el topico mas importante
3. Una estrategia de SEO local: como rankear en 'asistente IA para abogados Ecuador'
4. Frecuencia de publicacion recomendada para un equipo de 2 personas
5. Como usar IA (Claude/ChatGPT) para producir contenido 5x mas rapido"
```

**CANAL 2 — LinkedIn para B2B:**
LinkedIn tiene 1.2M usuarios en Ecuador. Para startups B2B de tique alto es el mejor canal.

Experimento de LinkedIn que ejecutaras hoy:
1. Identifica los 20 decision-makers mas relevantes para tu startup (titulo: CEO, Gerente de TI, Director Juridico, etc.) en empresas ecuatorianas con 50-500 empleados.
2. Con Claude, escribe 3 mensajes de conexion diferentes (sin pitch de venta, solo valor):
```
PROMPT PARA CLAUDE:
"Escribe 3 mensajes de conexion para LinkedIn para [NOMBRE STARTUP].
El receptor es un [TITULO] en una empresa [SECTOR] con sede en [CIUDAD ECUADOR].
Reglas:
- Sin pitch de venta en el mensaje inicial
- Maximo 150 caracteres
- Mencionar un insight especifico del sector del receptor
- Terminar con pregunta abierta no amenazante
- Tono profesional pero humano"
```

**CANAL 3 — WhatsApp Business:**
En Ecuador, el 95% de profesionales usa WhatsApp. Para startups B2B de tique medio ($50-300/mes), WhatsApp tiene la tasa de respuesta mas alta de todos los canales.

Estrategia: Construye una lista de 100 prospectos de tu segmento, crea una secuencia de 5 mensajes espaciados en 7 dias cada uno. Con Claude, diseña la secuencia completa.

**CANAL 4 — Demos presenciales y webinars:**
Para productos tecnicos complejos, ver es creer. Una demo en vivo convierte 3-5x mejor que cualquier landing page. En Ecuador, los colegios de profesionales (FBP para abogados, CCPG para contadores) organizan eventos donde puedes hacer demos.

Diseña una demo de 15 minutos para tu producto que:
- Muestre el problema que resuelve (3 min)
- Demuestre la solucion en vivo (8 min)
- Tenga un CTA claro (2 min)
- Incluya Q&A (2 min)

**CANAL 5 — Partnerships con universidades y gremios:**
ITSEIA, UDLA, UCE, UTE: si tu herramienta tiene valor educativo, las universidades son amplificadores gratuitos. Los colegios de profesionales como el FBP (30,000 abogados) o el CCPG pueden distribuir tu producto a su base de miembros.

Identifica 3 partnerships estrategicos para tu startup y define que ofrecerian a cada uno y que obtendrías a cambio.

### Parte 3 — Funnel de conversion con numeros reales (15 min)

Construye el funnel completo con numeros reales para el proximo mes:

```python
# Modelo de funnel para startup IA B2B Ecuador

# SUPUESTOS DEL MES 1 (AJUSTA CON TUS DATOS)
presupuesto_marketing = 500  # USD disponibles para ads

# Meta Ads (Facebook + Instagram)
cpl_meta = 12  # Costo por lead en Meta para B2B profesionales Ecuador
leads_meta = presupuesto_marketing * 0.60 / cpl_meta

# LinkedIn
cpl_linkedin = 35  # Mayor pero mejor calidad
leads_linkedin = presupuesto_marketing * 0.30 / cpl_linkedin

# Outreach directo (0 costo)
leads_outreach = 30  # Mensajes directos WhatsApp + LinkedIn

# SEO/Content (ya publicado)
leads_seo = 5  # Primero mes es bajo

total_leads = leads_meta + leads_linkedin + leads_outreach + leads_seo

# Conversiones por etapa
pct_acepta_demo = 0.25  # 25% de leads acepta una demo
pct_prueba_gratis = 0.60  # 60% de los que ven demo empiezan trial
pct_convierte_pago = 0.30  # 30% de trials convierten a pago

demos = total_leads * pct_acepta_demo
trials = demos * pct_prueba_gratis
clientes_nuevos = trials * pct_convierte_pago

precio_mensual = 59
mrr_nuevo = clientes_nuevos * precio_mensual
cac = presupuesto_marketing / max(clientes_nuevos, 1)

print(f"FUNNEL DE CONVERSION — MES 1")
print(f"Presupuesto marketing: ${presupuesto_marketing}")
print(f"Total leads generados: {total_leads:.0f}")
print(f"  - Meta Ads: {leads_meta:.0f}")
print(f"  - LinkedIn: {leads_linkedin:.0f}")
print(f"  - Outreach: {leads_outreach:.0f}")
print(f"  - SEO: {leads_seo:.0f}")
print(f"Demos realizadas: {demos:.0f}")
print(f"Trials iniciados: {trials:.0f}")
print(f"Clientes nuevos: {clientes_nuevos:.1f}")
print(f"MRR nuevo: ${mrr_nuevo:.0f}")
print(f"CAC: ${cac:.0f}")
print(f"LTV (18 meses): ${precio_mensual * 18 * (1-0.04):.0f}")
print(f"LTV:CAC ratio: {precio_mensual * 18 / max(cac, 1):.1f}x")
```

Ejecuta el modelo con tus numeros y ajusta hasta que el LTV:CAC ratio sea mayor a 3x.

### Parte 4 — Experimento de growth que ejecutaras esta semana (5 min)

Diseña UN experimento concreto para ejecutar en los proximos 7 dias:

```
EXPERIMENTO: [nombre]
HIPOTESIS: Si [accion especifica] entonces [resultado medible] porque [razon]
CANAL: [cual]
ACCIONES CONCRETAS:
  Dia 1: ___
  Dia 3: ___
  Dia 7: ___
METRICA PRINCIPAL: [un numero]
CRITERIO EXITO: [numero especifico]
CRITERIO FRACASO: [numero especifico]
TIEMPO DE APRENDIZAJE: 7 dias
```

## Usa IA para...

- Pedirle a ChatGPT que genere el copy completo de una secuencia de 5 emails de onboarding para nuevos usuarios de tu startup.
- Preguntarle a Claude los mejores grupos de Facebook y comunidades en Ecuador donde tu segmento target esta mas activo.
- Pedirle que diseñe una campaña de referidos con incentivos adecuados al mercado ecuatoriano (descuento, tiempo gratis, cash?).

## Que aprendiste

- Que el growth hacking es cientifico: hipotesis, experimento, medicion, aprendizaje, iteracion.
- Que en Ecuador Meta Ads sigue siendo el canal mas eficiente para consumer, LinkedIn para B2B de tique alto.
- Como construir un modelo de funnel para proyectar cuantos clientes puedes adquirir con un presupuesto especifico.
- Que el ratio LTV:CAC debe ser mayor a 3x para que un canal de adquisicion sea sostenible.

## Reto extra

Ejecuta el experimento de growth que diseñaste en la Parte 4 durante una semana real. Documenta cada accion tomada, los resultados dia a dia, y un post-mortem de 200 palabras al final de la semana: que funciono, que no funciono, que haras diferente la proxima semana. Comparte los resultados con la clase.
