# Ejercicio Sesion 2: KPIs y Metricas de Negocio

**Materia:** Inteligencia de Negocio y Reporting
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 30 min

## Objetivo

Definir, calcular e interpretar los KPIs (Key Performance Indicators) mas importantes de negocios ecuatorianos: financieros, operativos y de cliente, usando Python y datos reales.

## Contexto

Un KPI sin contexto es un numero sin significado. La tasa de conversion del 2.3% de una tienda online es buena o mala? Depende del sector: en retail ecuatoriano el promedio es 1.8%, asi que 2.3% es excelente. Este ejercicio te ensena a calcular los KPIs correctos Y a interpretarlos en el contexto empresarial ecuatoriano.

## Instrucciones

1. Crea el archivo `sesion02_kpis_metricas_ecuador.py`:

```python
# KPIs y Metricas de Negocio - ITSEIA
# Financieros, operativos y de cliente
# Contexto: empresa ecommerce Ecuador

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

np.random.seed(2026)
print("=" * 65)
print("KPIs Y METRICAS — ECOMMERCE ECUADOR 2024")
print("=" * 65)

# ================================================
# DATOS: empresa ecommerce Ecuador simulada
# ================================================
n_pedidos = 1200
n_clientes = 400

fechas = pd.date_range("2024-01-01", "2024-12-31", periods=n_pedidos)
clientes_ids = [f"CLI-{i:04d}" for i in range(1, n_clientes + 1)]

df_pedidos = pd.DataFrame({
    "pedido_id":    [f"PED-{i:05d}" for i in range(n_pedidos)],
    "fecha":         fechas,
    "cliente_id":    np.random.choice(clientes_ids, n_pedidos),
    "monto_bruto":   np.random.lognormal(4.2, 0.8, n_pedidos).clip(5, 500).round(2),
    "descuento_pct": np.random.choice([0,0,0,5,10,15], n_pedidos),
    "costo_producto":np.random.lognormal(3.5, 0.7, n_pedidos).clip(3, 300).round(2),
    "costo_envio":   np.random.choice([0, 3.5, 5.0, 7.0], n_pedidos, p=[0.3, 0.3, 0.3, 0.1]),
    "estado":        np.random.choice(["entregado","cancelado","devuelto"],
                                      n_pedidos, p=[0.87, 0.08, 0.05]),
    "canal":         np.random.choice(["web","app_movil","redes_sociales"],
                                      n_pedidos, p=[0.50, 0.35, 0.15]),
    "provincia":     np.random.choice(["Pichincha","Guayas","Azuay","Manabi","Tungurahua"],
                                      n_pedidos, p=[0.35, 0.30, 0.12, 0.13, 0.10]),
})
df_pedidos["monto_neto"] = (df_pedidos["monto_bruto"] * (1 - df_pedidos["descuento_pct"]/100)).round(2)
df_pedidos["margen"] = (df_pedidos["monto_neto"] - df_pedidos["costo_producto"] - df_pedidos["costo_envio"]).round(2)
df_pedidos["mes"] = df_pedidos["fecha"].dt.to_period("M")
df_pedidos["anio"] = df_pedidos["fecha"].dt.year

# Visitas al sitio (para tasa de conversion)
df_visitas = pd.DataFrame({
    "mes": pd.period_range("2024-01", periods=12, freq="M"),
    "visitas": np.random.randint(8000, 18000, 12),
})

print(f"Dataset: {n_pedidos} pedidos, {n_clientes} clientes")

# ================================================
# KPIs FINANCIEROS
# ================================================
print("\n--- KPIs FINANCIEROS ---")
entregados = df_pedidos[df_pedidos["estado"] == "entregado"]

# Revenue y GMV
gmv = df_pedidos["monto_bruto"].sum()
revenue = entregados["monto_neto"].sum()
margen_total = entregados["margen"].sum()
margen_pct = margen_total / revenue * 100

# AOV: Average Order Value
aov = entregados["monto_neto"].mean()

# MoM y YoY (simulados con datos mensuales)
ventas_mes = entregados.groupby("mes")["monto_neto"].sum()
mom = ventas_mes.pct_change().mean() * 100

kpis_financieros = {
    "GMV (Gross Merchandise Value)": f"${gmv:,.2f}",
    "Revenue Neto":                   f"${revenue:,.2f}",
    "Margen Bruto":                   f"${margen_total:,.2f} ({margen_pct:.1f}%)",
    "AOV (Ticket Promedio)":          f"${aov:.2f}",
    "Crecimiento Mensual (MoM avg)":  f"{mom:.1f}%",
}
for kpi, valor in kpis_financieros.items():
    print(f"  {kpi:<40}: {valor}")

# ================================================
# KPIs OPERATIVOS
# ================================================
print("\n--- KPIs OPERATIVOS ---")

# Tasa de cancelacion
tasa_cancel = (df_pedidos["estado"] == "cancelado").mean() * 100
# Tasa de devolucion
tasa_devol = (df_pedidos["estado"] == "devuelto").mean() * 100
# Tasa de conversion
pedidos_por_mes = df_pedidos.groupby("mes").size()
conversion = pd.merge(pedidos_por_mes.rename("pedidos"),
                      df_visitas.set_index("mes")["visitas"],
                      left_index=True, right_index=True)
tasa_conversion = (conversion["pedidos"] / conversion["visitas"] * 100).mean()

kpis_operativos = {
    "Tasa de Cancelacion":           f"{tasa_cancel:.1f}% (benchmark sector: 8%)",
    "Tasa de Devolucion":            f"{tasa_devol:.1f}% (benchmark sector: 5%)",
    "Tasa de Conversion":            f"{tasa_conversion:.2f}% (benchmark Ecuador: 1.8%)",
    "Pedidos entregados":            f"{len(entregados)} / {n_pedidos} ({len(entregados)/n_pedidos*100:.1f}%)",
}
for kpi, valor in kpis_operativos.items():
    print(f"  {kpi:<40}: {valor}")

# ================================================
# KPIs DE CLIENTE
# ================================================
print("\n--- KPIs DE CLIENTE ---")

# CLV: Customer Lifetime Value
pedidos_x_cliente = entregados.groupby("cliente_id").agg(
    num_pedidos=("pedido_id","count"),
    revenue_total=("monto_neto","sum"),
    primer_pedido=("fecha","min"),
    ultimo_pedido=("fecha","max")
).reset_index()
pedidos_x_cliente["vida_dias"] = (
    pedidos_x_cliente["ultimo_pedido"] - pedidos_x_cliente["primer_pedido"]
).dt.days

clv_promedio = pedidos_x_cliente["revenue_total"].mean()
pedidos_prom_cliente = pedidos_x_cliente["num_pedidos"].mean()

# Retencion: clientes que compraron en al menos 2 meses distintos
clientes_recurrentes = entregados.groupby("cliente_id")["mes"].nunique()
tasa_retencion = (clientes_recurrentes >= 2).mean() * 100

# Clientes nuevos vs recurrentes por mes
primer_pedido = entregados.groupby("cliente_id")["mes"].min()
entregados_copia = entregados.copy()
entregados_copia["es_nuevo"] = entregados_copia.apply(
    lambda row: 1 if primer_pedido.get(row["cliente_id"]) == row["mes"] else 0, axis=1
)
mezcla = entregados_copia.groupby("mes")["es_nuevo"].mean() * 100

kpis_clientes = {
    "CLV Promedio (Lifetime Value)": f"${clv_promedio:.2f}",
    "Pedidos promedio por cliente":   f"{pedidos_prom_cliente:.1f}",
    "Tasa de Retencion":             f"{tasa_retencion:.1f}%",
    "Clientes unicos":               f"{pedidos_x_cliente['cliente_id'].nunique()}",
    "% Clientes nuevos (promedio)":  f"{mezcla.mean():.1f}%",
}
for kpi, valor in kpis_clientes.items():
    print(f"  {kpi:<40}: {valor}")

# ================================================
# SEMAFORO DE KPIs (RAG: Rojo-Amarillo-Verde)
# ================================================
print("\n--- SEMAFORO KPIs (RAG) ---")
semaforo = [
    ("Tasa de Conversion",  tasa_conversion, 1.8, 2.5,   "%"),
    ("Tasa Cancelacion",    tasa_cancel,     10,  8,     "% (menor=mejor)"),
    ("Tasa Devolucion",     tasa_devol,      7,   5,     "% (menor=mejor)"),
    ("Margen Bruto",        margen_pct,      25,  35,    "%"),
    ("CLV Promedio",        clv_promedio,    50,  100,   "USD"),
    ("Retencion",           tasa_retencion,  30,  50,    "%"),
]

for nombre, valor, umbral_amarillo, umbral_verde, unidad in semaforo:
    # Para metricas "mayor=mejor"
    if "menor=mejor" in unidad:
        if valor < umbral_verde:   color = "VERDE"
        elif valor < umbral_amarillo: color = "AMARILLO"
        else:                         color = "ROJO"
    else:
        if valor >= umbral_verde:  color = "VERDE"
        elif valor >= umbral_amarillo: color = "AMARILLO"
        else:                          color = "ROJO"

    icon = {"VERDE": "[OK]", "AMARILLO": "[>>]", "ROJO": "[!!]"}[color]
    print(f"  {icon} {nombre:<30}: {valor:.1f}{unidad.split('(')[0].strip()} [{color}]")

# ================================================
# VISUALIZACION DASHBOARD KPIs
# ================================================
fig, axes = plt.subplots(2, 2, figsize=(14, 9))
fig.suptitle("Dashboard KPIs — Ecommerce Ecuador 2024", fontsize=13, fontweight="bold")

# Ventas y margen mensual
ax = axes[0, 0]
ventas_m = entregados.groupby("mes")["monto_neto"].sum() / 1000
margen_m = entregados.groupby("mes")["margen"].sum() / 1000
meses_str = [str(m) for m in ventas_m.index]
ax.bar(meses_str, ventas_m.values, color="#1F2F58", label="Ventas", alpha=0.8)
ax.bar(meses_str, margen_m.values, color="#FBBC0C", label="Margen", alpha=0.9)
ax.set_title("Ventas y Margen Mensual (miles $)")
ax.tick_params(axis="x", rotation=45, labelsize=6)
ax.legend(fontsize=8)

# Tasa conversion por mes
ax = axes[0, 1]
ax.plot(meses_str, conversion["pedidos"] / conversion["visitas"] * 100,
        marker="s", color="#F0846D", linewidth=2)
ax.axhline(1.8, color="#FBBC0C", linestyle="--", label="Benchmark 1.8%")
ax.set_title("Tasa de Conversion (%)")
ax.tick_params(axis="x", rotation=45, labelsize=6)
ax.legend(fontsize=8)

# Distribucion CLV
ax = axes[1, 0]
ax.hist(pedidos_x_cliente["revenue_total"], bins=30,
        color="#73B8E7", edgecolor="white")
ax.axvline(clv_promedio, color="#F0846D", lw=2, label=f"Promedio ${clv_promedio:.0f}")
ax.set_title("Distribucion CLV por Cliente")
ax.set_xlabel("Revenue total USD")
ax.legend(fontsize=8)

# Mix canal ventas
ax = axes[1, 1]
canal_ventas = entregados.groupby("canal")["monto_neto"].sum()
ax.pie(canal_ventas.values, labels=canal_ventas.index,
       autopct="%1.1f%%", colors=["#1F2F58","#FBBC0C","#73B8E7"])
ax.set_title("Mix de Ventas por Canal")

plt.tight_layout()
plt.savefig("sesion02_kpis_dashboard.png", dpi=150, bbox_inches="tight")
plt.show()
print("\nDashboard KPIs guardado: sesion02_kpis_dashboard.png")
print("=" * 65)
```

2. Ejecuta el codigo. Analiza el semaforo RAG de KPIs.

3. Agrega un KPI nuevo: Net Promoter Score (NPS) simulado y agrega al semaforo.

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Tengo un ecommerce en Ecuador con CLV promedio de $85, tasa de retencion 38% y tasa de conversion 2.1%. ¿Que 3 KPIs deberia mejorar primero para maximizar el revenue? Dame estrategias especificas para el contexto Ecuador."

Despues de leer la respuesta:
- Identifica cual KPI del semaforo esta mas lejos del benchmark.
- Propone una accion concreta de negocio para mejorarlo y simula su impacto en el revenue.

## Que aprendiste

- Un KPI es un indicador medible alineado a un objetivo estrategico. No todo numero es un KPI.
- AOV, CLV, tasa de conversion y tasa de retencion son los 4 KPIs mas importantes de ecommerce.
- El semaforo RAG (Rojo-Amarillo-Verde) comunica el estado de cada KPI de forma inmediata.
- Benchmarks del sector permiten contextualizar si un KPI es bueno o malo.
- La tasa de retencion es el KPI con mayor impacto en rentabilidad a largo plazo.
- `df.groupby().agg()` permite calcular multiples KPIs de cliente en una sola operacion.

## Reto extra

Implementa un sistema de "alertas automaticas de KPIs": compara los KPIs del mes actual con el mes anterior y con el benchmark del sector. Si alguno cae mas del 10% o supera el limite rojo, genera automaticamente un mensaje de alerta con el problema y 2 hipotesis de causa. Simula 6 meses de datos y ejecuta el sistema de alertas para cada mes.
