# Ejercicio Sesion 1: BI — Que es y Herramientas

**Materia:** Inteligencia de Negocio y Reporting
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 25 min

## Objetivo

Entender el concepto de Business Intelligence, su diferencia con data analytics y data science, evaluar las principales herramientas del mercado, y construir un mini-dashboard en Python para una empresa ecuatoriana.

## Contexto

El 78% de las empresas medianas en Ecuador toman decisiones basadas en instinto o en reportes de Excel desactualizados. BI cambia eso: convierte datos historicos en dashboards interactivos que responden preguntas de negocio en segundos. Grupo El Rosado, Corporacion Favorita y Banco Pichincha tienen equipos de BI con decenas de analistas. Este ejercicio te introduce al mundo que ellos construyen.

## Instrucciones

1. Crea el archivo `sesion01_bi_intro_ecuador.py`:

```python
# Business Intelligence - ITSEIA
# Conceptos, herramientas y primer dashboard
# Contexto: empresa retail Ecuador

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec

np.random.seed(2026)
print("=" * 65)
print("BUSINESS INTELLIGENCE — FUNDAMENTOS")
print("Caso: Cadena Retail Ecuador")
print("=" * 65)

# ================================================
# CONCEPTOS CLAVE DE BI
# ================================================
print("\n--- BI: QUE ES Y QUE NO ES ---")
conceptos = {
    "Business Intelligence (BI)": [
        "Analisis de datos HISTORICOS para decisiones operativas",
        "Dashboards, KPIs, reportes periodicos",
        "Responde: ¿QUE PASO? ¿CUANTO VENDIMOS?",
        "Usuarios: gerentes, analistas, directivos",
        "Herramientas: Power BI, Tableau, Looker, Metabase"
    ],
    "Data Analytics": [
        "Analisis exploratorio y estadistico de datos",
        "Patrones, correlaciones, segmentaciones",
        "Responde: ¿POR QUE PASO?",
        "Usuarios: analistas de datos, data scientists",
        "Herramientas: Python, R, SQL"
    ],
    "Data Science / ML": [
        "Modelado predictivo y prescriptivo",
        "Algoritmos de machine learning",
        "Responde: ¿QUE VA A PASAR? ¿QUE DEBERIAMOS HACER?",
        "Usuarios: data scientists, ML engineers",
        "Herramientas: TensorFlow, scikit-learn, PyTorch"
    ]
}

for area, puntos in conceptos.items():
    print(f"\n  {area}:")
    for p in puntos:
        print(f"    • {p}")

# ================================================
# ECOSISTEMA DE HERRAMIENTAS BI 2026
# ================================================
print("\n--- HERRAMIENTAS BI 2026 ---")
herramientas = [
    ("Power BI (Microsoft)", "Gratuito/Pro $10/mes", "Alta","Alta","Corp + PYMES","Muy bueno"),
    ("Tableau",              "Desde $70/mes",        "Alta","Media","Empresas grandes","Excelente"),
    ("Looker (Google)",      "Desde $3,000/anio",    "Alta","Baja","Tech empresas","Muy bueno"),
    ("Metabase",             "Gratis (open source)", "Media","Alta","Startups","Bueno"),
    ("Superset (Apache)",    "Gratis (open source)", "Alta","Media","Empresas tech","Bueno"),
    ("Looker Studio (Google)","Gratis",              "Media","Muy alta","Cualquiera","Bueno"),
]
print(f"  {'Herramienta':<25} {'Precio':<22} {'Funcionalidad':<15} {'Facilidad':<10} {'Uso Ecuador'}")
print("  " + "-" * 95)
for h in herramientas:
    print(f"  {h[0]:<25} {h[1]:<22} {h[2]:<15} {h[3]:<10} {h[4]}")

# ================================================
# DATOS: cadena retail Ecuador 2024
# ================================================
meses = pd.date_range("2024-01", periods=12, freq="MS")
categorias = ["Abarrotes","Lacteos","Carnes","Limpieza","Personal","Bebidas"]
tiendas = ["Quito Norte","Quito Sur","Guayaquil","Cuenca","Ambato"]

ventas_data = []
for mes in meses:
    for cat in categorias:
        for tienda in tiendas:
            base = {"Abarrotes":45000,"Lacteos":22000,"Carnes":38000,
                    "Limpieza":18000,"Personal":25000,"Bebidas":30000}[cat]
            season = 1.2 if mes.month in [11,12] else (0.85 if mes.month in [2,3] else 1.0)
            ventas_data.append({
                "mes": mes,
                "mes_nombre": mes.strftime("%b"),
                "categoria": cat,
                "tienda": tienda,
                "ventas": round(base * season * np.random.uniform(0.85, 1.15)),
                "costo": round(base * season * np.random.uniform(0.55, 0.70)),
                "transacciones": np.random.randint(800, 1800)
            })

df = pd.DataFrame(ventas_data)
df["margen"] = df["ventas"] - df["costo"]
df["margen_pct"] = (df["margen"] / df["ventas"] * 100).round(1)

print(f"\nDataset: {len(df)} registros | Ventas totales: ${df['ventas'].sum():,.0f}")

# ================================================
# DASHBOARD BI: 6 visualizaciones
# ================================================
fig = plt.figure(figsize=(16, 12))
fig.suptitle("DASHBOARD BI — CADENA RETAIL ECUADOR 2024",
             fontsize=16, fontweight="bold", color="#1F2F58")
gs = gridspec.GridSpec(3, 2, figure=fig, hspace=0.45, wspace=0.35)

colores_cat = {"Abarrotes":"#1F2F58","Lacteos":"#73B8E7","Carnes":"#FBBC0C",
               "Limpieza":"#F0846D","Personal":"#2A3F6E","Bebidas":"#9BB8D4"}

# KPI Cards (texto en ejes apagados)
ax_kpi = fig.add_subplot(gs[0, :])
ax_kpi.axis("off")
kpis = [
    ("VENTAS TOTALES",  f"${df['ventas'].sum()/1e6:.2f}M",  "#1F2F58"),
    ("MARGEN TOTAL",    f"${df['margen'].sum()/1e6:.2f}M",  "#2A3F6E"),
    ("MARGEN %",        f"{(df['margen'].sum()/df['ventas'].sum()*100):.1f}%", "#73B8E7"),
    ("TRANSACCIONES",   f"{df['transacciones'].sum():,}",   "#FBBC0C"),
    ("CATEGORIAS",      f"{df['categoria'].nunique()}",     "#F0846D"),
    ("TIENDAS",         f"{df['tienda'].nunique()}",        "#9BB8D4"),
]
for i, (label, val, color) in enumerate(kpis):
    x = 0.08 + i * 0.155
    ax_kpi.add_patch(plt.Rectangle((x-0.07, 0.1), 0.14, 0.8,
                     transform=ax_kpi.transAxes, color=color, alpha=0.15, zorder=0))
    ax_kpi.text(x, 0.7, label, ha="center", va="center", fontsize=8,
               color="#666666", transform=ax_kpi.transAxes)
    ax_kpi.text(x, 0.3, val, ha="center", va="center", fontsize=14,
               fontweight="bold", color=color, transform=ax_kpi.transAxes)
ax_kpi.set_title("KPIs PRINCIPALES", fontsize=10, color="#666666", pad=5)

# Ventas mensuales
ax1 = fig.add_subplot(gs[1, 0])
ventas_mes = df.groupby("mes")["ventas"].sum()
ax1.plot(ventas_mes.index, ventas_mes.values / 1000, marker="o",
         color="#1F2F58", linewidth=2.5, markersize=5)
ax1.fill_between(ventas_mes.index, ventas_mes.values / 1000,
                  alpha=0.15, color="#1F2F58")
ax1.set_title("Ventas Mensuales (miles $)")
ax1.set_xlabel("Mes")
ax1.tick_params(axis="x", rotation=45, labelsize=7)

# Ventas por categoria
ax2 = fig.add_subplot(gs[1, 1])
ventas_cat = df.groupby("categoria")["ventas"].sum().sort_values(ascending=True)
colores_barh = [colores_cat[c] for c in ventas_cat.index]
ax2.barh(ventas_cat.index, ventas_cat.values / 1000, color=colores_barh)
ax2.set_title("Ventas por Categoria (miles $)")
ax2.set_xlabel("Miles USD")

# Margen por tienda
ax3 = fig.add_subplot(gs[2, 0])
margen_tienda = df.groupby("tienda")["margen_pct"].mean().sort_values(ascending=False)
bars = ax3.bar(margen_tienda.index, margen_tienda.values,
               color="#FBBC0C", edgecolor="white")
ax3.set_title("Margen Promedio por Tienda (%)")
ax3.set_ylabel("%")
ax3.tick_params(axis="x", rotation=20, labelsize=7)
for bar, val in zip(bars, margen_tienda.values):
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
             f"{val:.1f}%", ha="center", fontsize=8)

# Composicion ventas por categoria (pie)
ax4 = fig.add_subplot(gs[2, 1])
ventas_cat_pie = df.groupby("categoria")["ventas"].sum()
ax4.pie(ventas_cat_pie.values, labels=ventas_cat_pie.index,
        autopct="%1.1f%%", colors=list(colores_cat.values()),
        textprops={"fontsize": 8})
ax4.set_title("Composicion de Ventas")

plt.savefig("sesion01_dashboard_bi.png", dpi=150, bbox_inches="tight")
plt.show()
print("\nDashboard guardado: sesion01_dashboard_bi.png")
print("=" * 65)
```

2. Ejecuta el codigo. Analiza el dashboard de 6 visualizaciones.

3. Identifica 3 preguntas de negocio que el dashboard responde y 2 que NO puede responder (y que necesitarian ML).

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy analista de BI en una cadena de retail Ecuador. El dashboard muestra que Guayaquil tiene el margen mas alto pero las ventas mas bajas. ¿Que preguntas de negocio deberia investigar? ¿Que analisis adicionales necesito hacer?"

Despues de leer la respuesta:
- Agrega un panel adicional al dashboard que responda la pregunta mas relevante que ChatGPT sugiere.

## Que aprendiste

- BI responde "que paso" con datos historicos; Analytics responde "por que"; ML responde "que pasara".
- Un dashboard BI efectivo tiene KPIs destacados (numeros clave) + tendencias + comparaciones.
- `matplotlib.gridspec.GridSpec` permite crear layouts complejos de multiples graficos.
- Power BI y Looker Studio son las herramientas BI mas usadas en Ecuador por costo-beneficio.
- Los colores corporativos en el dashboard comunican la identidad de la empresa.
- El dashboard debe responder en 30 segundos las preguntas mas frecuentes del gerente.

## Reto extra

Transforma el dashboard estatico en uno interactivo usando Plotly Dash: crea filtros de mes, categoria y tienda que actualicen todos los graficos en tiempo real. Despliega el dashboard en https://render.com (gratis) para que sea accesible desde cualquier navegador.
