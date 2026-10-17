# Ejercicio Sesion 5: Financiamiento — Inversores, Grants y Bootstrapping en Ecuador

**Materia:** Emprendimiento Tecnologico
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 50 min

## Objetivo

Mapear el ecosistema de financiamiento disponible para startups de IA en Ecuador, evaluar las condiciones reales de cada fuente (montos, requisitos, dilution, plazos), calcular la financiacion necesaria para los primeros 18 meses de operacion, y construir una estrategia de levantamiento de capital apropiada para la etapa de la startup.

## Contexto (Ecuador)

El ecosistema de capital de riesgo en Ecuador es pequeño pero existe y esta creciendo. En 2023-2024 se realizaron mas de $15M en inversiones en startups ecuatorianas. El problema es que la mayoria de fundadores no saben como acceder a estos fondos, o postulan a las fuentes incorrectas para su etapa. Este ejercicio mapea el terreno real para que no pierdas tiempo en aplicaciones sin opcion de exito.

## Instrucciones

### Parte 1 — El mapa de financiamiento Ecuador (15 min)

Investiga y completa este mapa de fuentes de financiamiento:

**TIER 1 — Pre-semilla y semilla (hasta $100K):**

| Fuente | Tipo | Monto tipico | Requisito clave | Dilution | Tiempo de proceso |
|---|---|---|---|---|---|
| Startups Buen Viaje (MIPRO) | Grant gubernamental | $20K-$50K | MVP funcionando | 0% | 3-6 meses |
| Alianza para el Emprendimiento e Innovacion (AEI) | Aceleracion + capital | $25K-$75K | Equipo + traccion | 8-15% | 4 meses |
| SENESCYT — Convocatorias IA | Grant investigacion | $15K-$40K | Vinculacion con universidad | 0% | 6-12 meses |
| Angels Ecuador Network | Capital privado | $25K-$150K | Demo day + pitch | 10-20% | 2-4 meses |
| [Agrega 2 mas que investigues] | | | | | |

**TIER 2 — Semilla y Serie A (hasta $1M):**

| Fuente | Tipo | Monto tipico | Requisito | Dilution | Notas |
|---|---|---|---|---|---|
| ICTIO Ventures | VC Ecuador | $100K-$500K | $10K+ MRR | 15-25% | Enfoque fintech |
| Platzi Startups Fund | CV latinoamerica | $50K-$200K | Tech + ed-tech | 10-15% | Requiere aplicacion |
| Y Combinator (remoto) | Aceleradora global | $500K | Cualquier etapa | 7% | 3 meses intensivos |
| [Agrega 2 mas que investigues] | | | | | |

Para investigar: usa Perplexity o Google con terminos "startups financiamiento Ecuador 2024 2025" y "venture capital Ecuador IA".

### Parte 2 — Calcular cuanto necesitas y para que (20 min)

El error mas comun de fundadores ecuatorianos es pedir dinero sin saber exactamente cuanto necesitan y para que. Construye tu plan de 18 meses:

```python
from dataclasses import dataclass
from typing import List

@dataclass
class GastoMensual:
    categoria: str
    descripcion: str
    monto_usd: float
    mes_inicio: int  # Mes en que inicia este gasto
    mes_fin: int     # Mes en que termina (18 = permanente)

# COMPLETA ESTE PLAN CON TUS NUMEROS REALES
# Adapta segun tu startup especifica

plan_gastos = [
    # TECNOLOGIA
    GastoMensual("API OpenAI/Anthropic", "Creditos para desarrollo y clientes beta", 200, 1, 18),
    GastoMensual("AWS/GCP", "Hosting, BD, computing", 150, 1, 18),
    GastoMensual("Herramientas dev", "GitHub Pro, Vercel, monitoring", 80, 1, 18),

    # EQUIPO (AJUSTA SEGUN TU STARTUP)
    GastoMensual("Fundador 1 (CTO)", "Sueldo minimo primeros 6 meses", 800, 7, 18),  # Los primeros 6 meses sin sueldo
    GastoMensual("Fundador 2 (CEO)", "Sueldo minimo primeros 6 meses", 800, 7, 18),
    GastoMensual("Desarrollador jr", "Part-time freelance", 600, 4, 18),

    # MARKETING Y VENTAS
    GastoMensual("Meta/Google Ads", "Adquisicion clientes", 300, 3, 18),
    GastoMensual("Herramientas CRM/email", "HubSpot starter", 50, 1, 18),
    GastoMensual("Eventos y demos", "Demos presenciales, viajes Quito-Gye", 150, 2, 18),

    # LEGAL Y ADMINISTRATIVO
    GastoMensual("Constitucion empresa", "Costo unico", 500, 1, 1),
    GastoMensual("Contador", "Servicio mensual", 150, 1, 18),
    GastoMensual("Oficina virtual", "Coworking o direccion fiscal", 80, 1, 18),
]

# Calcular gastos por mes
print("PROYECCION DE GASTOS 18 MESES\n" + "="*50)
total_acumulado = 0
for mes in range(1, 19):
    gastos_mes = sum(
        g.monto_usd for g in plan_gastos
        if g.mes_inicio <= mes <= g.mes_fin
    )
    total_acumulado += gastos_mes
    print(f"Mes {mes:02d}: ${gastos_mes:,.0f} | Acumulado: ${total_acumulado:,.0f}")

print(f"\nTOTAL 18 MESES: ${total_acumulado:,.0f}")
print(f"COLCHON RECOMENDADO (20%): ${total_acumulado * 0.20:,.0f}")
print(f"LEVANTAMIENTO RECOMENDADO: ${total_acumulado * 1.20:,.0f}")

# Proyeccion de ingresos (COMPLETA CON TU MODELO)
ingresos = []
clientes_nuevos_por_mes = [2, 3, 4, 5, 6, 8, 10, 12, 12, 15, 15, 18, 18, 20, 22, 22, 25, 25]
precio_mensual = 59
churn_mensual = 0.04

clientes_activos = 0
print("\nPROYECCION DE INGRESOS:")
for mes, nuevos in enumerate(clientes_nuevos_por_mes, 1):
    clientes_activos = clientes_activos * (1 - churn_mensual) + nuevos
    mrr = clientes_activos * precio_mensual
    ingresos.append(mrr)
    print(f"Mes {mes:02d}: {clientes_activos:.0f} clientes | MRR: ${mrr:,.0f}")

arr_anio2 = ingresos[-1] * 12
print(f"\nARR proyectado mes 18: ${arr_anio2:,.0f}")
```

Ejecuta el codigo con tus numeros reales y calcula el "runway" (meses que puedes operar con el capital levantado).

### Parte 3 — Bootstrapping vs. Equity: cuando cada uno (10 min)

Evalua cada estrategia para tu startup:

**Bootstrapping (sin inversores externos):**
- Cuando tiene sentido: cuando puedes generar ingresos desde el mes 1-3
- Ventaja: no diluyes equity, control total
- Desventaja: creces mas lento, sin red de inversores
- Como lograrlo en Ecuador: servicios de consultoria IA mientras construyes el producto (muy viable!)

**Estrategia hibrida (recomendada para Ecuador):**
Mes 1-6: Bootstrapping con servicios de consultoria para generar caja
Mes 6-12: Aplicar a grant gubernamental (cero dilution)
Mes 12-18: Si hay traccion clara, buscar angel o pre-semilla

Responde: Para TU startup especifica, cual es la estrategia optima en los primeros 18 meses y por que?

### Parte 4 — Carta de inversion (5 min)

Escribe el parrafo de "Ask" (pedido al inversor) en un pitch deck:

Mal ejemplo: "Buscamos $150,000 para crecer"

Buen ejemplo: "Buscamos $120,000 en nota convertible SAFE a cap de $800K para financiar 14 meses de runway. El uso especifico: $45K desarrollo del producto (MVP v2), $35K adquisicion de clientes (objetivo: 50 clientes pagos al mes 12), $25K equipo (2 FTE desde mes 7), $15K legal y operaciones."

Escribe TU "Ask" siguiendo este formato para la fuente de financiamiento mas adecuada para tu etapa actual.

## Usa IA para...

- Pedirle a Claude que explique que es una nota SAFE y como difiere de un prestamo convertible en el contexto legal ecuatoriano.
- Preguntarle a ChatGPT los errores mas comunes de fundadores ecuatorianos al aplicar a Startups Buen Viaje.
- Pedirle que revise tu proyeccion de 18 meses y señale supuestos poco realistas basandose en benchmarks de startups SaaS en LATAM.

## Que aprendiste

- Que el ecosistema de financiamiento en Ecuador existe pero es pequeno — debes conocer cada fuente y su requisito exacto.
- Que los grants gubernamentales (cero dilution) deben agotarse antes de ceder equity.
- Como calcular con precision cuanto necesitas levantar (no "un millon" sino "$124,000 para 16 meses de runway").
- Que el bootstrapping con servicios de consultoria IA es una estrategia viada y subestimada en Ecuador.

## Reto extra

Completa la aplicacion real de UNO de los fondos de financiamiento del Tier 1. Descarga el formulario o visita la pagina de aplicacion. Con Claude, prepara las respuestas a las 5 preguntas mas importantes del formulario para tu startup. No tienes que enviar la aplicacion — pero tendras todo listo para hacerlo.
