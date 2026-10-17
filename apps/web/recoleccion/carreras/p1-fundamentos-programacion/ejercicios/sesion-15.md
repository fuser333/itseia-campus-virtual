# Ejercicio Sesion 15: Dashboard de Datos Ecuador con Matplotlib

**Materia:** Fundamentos de Programacion
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Usar matplotlib para crear un dashboard de 6 graficos que visualicen datos reales del mercado laboral tech y estadisticas academicas de Ecuador, produciendo un archivo de imagen listo para presentar.

## Contexto

La visualizacion de datos es una competencia critica para cualquier Data Analyst. Un grafico bien hecho comunica en segundos lo que una tabla tarda minutos en revelar. Vamos a construir un dashboard profesional con los datos que analizamos en la sesion 14, usando la paleta de colores corporativa de ITSEIA.

## Instrucciones

1. Instala las librerias necesarias:
```
pip install matplotlib pandas numpy
```

2. Crea el archivo `sesion15_dashboard_ecuador.py`:

```python
# Dashboard de Datos Ecuador - Matplotlib
# 6 graficos en un solo archivo de imagen
# Paleta ITSEIA: Navy #1F2F58, Yellow #FBBC0C, LightBlue #73B8E7, Coral #F0846D

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import os

print("=" * 62)
print("GENERANDO DASHBOARD - MERCADO LABORAL TECH ECUADOR")
print("Herramienta: matplotlib")
print("=" * 62)

# ================================================
# PALETA ITSEIA
# ================================================
COLOR_NAVY    = "#1F2F58"
COLOR_YELLOW  = "#FBBC0C"
COLOR_BLUE    = "#73B8E7"
COLOR_CORAL   = "#F0846D"
COLOR_BEIGE   = "#F9F6E7"
COLOR_DARK    = "#0A1628"
COLORES = [COLOR_NAVY, COLOR_YELLOW, COLOR_BLUE, COLOR_CORAL,
           "#4CAF50", "#9C27B0", "#FF5722"]

# ================================================
# DATOS (mismo dataset sesion 14, resumido)
# ================================================
cargos = ["Data Analyst", "ML Engineer", "Data Engineer",
          "Data Scientist", "Python Dev", "BI Developer", "AI Developer"]
salarios_prom = [875, 1550, 1175, 1600, 875, 925, 1650]
ofertas_por_cargo = [6, 4, 3, 3, 2, 2, 2]

ciudades = ["Quito", "Guayaquil", "Cuenca", "Bogota (Remoto)"]
ofertas_ciudad = [13, 5, 1, 1]

modalidades = ["Hibrido", "Remoto", "Presencial"]
pct_modalidades = [35, 40, 25]

experiencia = [1, 1, 2, 2, 3, 3, 4, 1, 2, 3, 2, 1, 1, 3, 4, 1, 1, 3, 2, 2]
salarios = [875, 875, 1550, 950, 1175, 875, 1600, 825, 875, 1350,
            1550, 700, 875, 1250, 2000, 850, 775, 1175, 1500, 925]

habilidades = ["Python", "SQL", "Machine\nLearning", "Cloud", "Ingles",
               "Tableau/PBI", "Spark", "Docker"]
demanda_pct = [95, 82, 73, 68, 60, 45, 38, 35]

semestres = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"]
empleabilidad_ia = [0, 15, 45, 78, 92]
empleabilidad_datos = [0, 12, 38, 70, 88]
empleabilidad_bigdata = [0, 10, 32, 65, 85]

# ================================================
# CONFIGURACION FIGURA: 6 graficos en grilla 2x3
# ================================================
fig = plt.figure(figsize=(18, 12), facecolor=COLOR_DARK)
fig.suptitle(
    "MERCADO LABORAL TECH ECUADOR | Analisis ITSEIA | Marzo 2026",
    fontsize=16, fontweight="bold", color="white", y=0.98
)

# ================================================
# GRAFICO 1: Barras horizontales - Salario por cargo
# ================================================
ax1 = fig.add_subplot(2, 3, 1)
ax1.set_facecolor(COLOR_NAVY)
colores_barras = [COLOR_YELLOW if s == max(salarios_prom) else COLOR_BLUE for s in salarios_prom]
bars = ax1.barh(cargos, salarios_prom, color=colores_barras, edgecolor="white", linewidth=0.5)
ax1.set_title("Salario Promedio por Cargo (USD/mes)", color="white", fontsize=10, pad=8)
ax1.set_xlabel("USD/mes", color="white", fontsize=8)
ax1.tick_params(colors="white", labelsize=7)
ax1.spines[["top", "right", "bottom", "left"]].set_color("#3A4F7F")
for bar, sal in zip(bars, salarios_prom):
    ax1.text(bar.get_width() + 20, bar.get_y() + bar.get_height()/2,
             f"${sal:,}", va="center", color="white", fontsize=7)
ax1.set_xlim(0, max(salarios_prom) * 1.25)

# ================================================
# GRAFICO 2: Pastel - Modalidades de trabajo
# ================================================
ax2 = fig.add_subplot(2, 3, 2)
ax2.set_facecolor(COLOR_NAVY)
wedges, texts, autotexts = ax2.pie(
    pct_modalidades,
    labels=modalidades,
    autopct="%1.0f%%",
    colors=[COLOR_YELLOW, COLOR_BLUE, COLOR_CORAL],
    startangle=90,
    textprops={"color": "white", "fontsize": 8},
    wedgeprops={"edgecolor": COLOR_DARK, "linewidth": 2}
)
for autotext in autotexts:
    autotext.set_color(COLOR_DARK)
    autotext.set_fontweight("bold")
ax2.set_title("Modalidades de Trabajo Ofertadas", color="white", fontsize=10, pad=8)

# ================================================
# GRAFICO 3: Dispersion - Salario vs Experiencia
# ================================================
ax3 = fig.add_subplot(2, 3, 3)
ax3.set_facecolor(COLOR_NAVY)
ax3.scatter(experiencia, salarios, color=COLOR_YELLOW, alpha=0.8, s=80, edgecolors="white", linewidth=0.5)
# Linea de tendencia
z = np.polyfit(experiencia, salarios, 1)
p = np.poly1d(z)
x_line = np.linspace(min(experiencia), max(experiencia), 100)
ax3.plot(x_line, p(x_line), color=COLOR_CORAL, linewidth=2, linestyle="--", label="Tendencia")
ax3.axhline(y=550, color=COLOR_BLUE, linewidth=1, linestyle=":", alpha=0.7, label="SBU $550")
ax3.set_title("Salario vs Años de Experiencia", color="white", fontsize=10, pad=8)
ax3.set_xlabel("Años de experiencia", color="white", fontsize=8)
ax3.set_ylabel("Salario USD/mes", color="white", fontsize=8)
ax3.tick_params(colors="white", labelsize=7)
ax3.spines[["top", "right", "bottom", "left"]].set_color("#3A4F7F")
ax3.legend(fontsize=7, labelcolor="white", facecolor=COLOR_DARK, edgecolor="#3A4F7F")

# ================================================
# GRAFICO 4: Barras verticales - Ofertas por ciudad
# ================================================
ax4 = fig.add_subplot(2, 3, 4)
ax4.set_facecolor(COLOR_NAVY)
bars4 = ax4.bar(ciudades, ofertas_ciudad,
                color=[COLOR_YELLOW, COLOR_BLUE, COLOR_CORAL, COLOR_BEIGE],
                edgecolor="white", linewidth=0.5)
ax4.set_title("Distribucion de Ofertas por Ciudad", color="white", fontsize=10, pad=8)
ax4.set_ylabel("N de ofertas", color="white", fontsize=8)
ax4.tick_params(colors="white", labelsize=7)
ax4.spines[["top", "right", "bottom", "left"]].set_color("#3A4F7F")
for bar, val in zip(bars4, ofertas_ciudad):
    ax4.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.2,
             str(val), ha="center", color="white", fontsize=9, fontweight="bold")

# ================================================
# GRAFICO 5: Barras horizontales - Habilidades demandadas
# ================================================
ax5 = fig.add_subplot(2, 3, 5)
ax5.set_facecolor(COLOR_NAVY)
colores_h = [COLOR_YELLOW if d >= 70 else COLOR_BLUE for d in demanda_pct]
ax5.barh(habilidades, demanda_pct, color=colores_h, edgecolor="white", linewidth=0.5)
ax5.axvline(x=50, color=COLOR_CORAL, linewidth=1, linestyle="--", alpha=0.8)
ax5.set_title("Habilidades Mas Demandadas (%)", color="white", fontsize=10, pad=8)
ax5.set_xlabel("% de ofertas que la requieren", color="white", fontsize=8)
ax5.tick_params(colors="white", labelsize=7)
ax5.spines[["top", "right", "bottom", "left"]].set_color("#3A4F7F")
ax5.set_xlim(0, 110)
for i, (h, d) in enumerate(zip(habilidades, demanda_pct)):
    ax5.text(d + 2, i, f"{d}%", va="center", color="white", fontsize=7)

# ================================================
# GRAFICO 6: Lineas - Proyeccion empleabilidad ITSEIA
# ================================================
ax6 = fig.add_subplot(2, 3, 6)
ax6.set_facecolor(COLOR_NAVY)
ax6.plot(semestres, empleabilidad_ia, color=COLOR_YELLOW, linewidth=2.5, marker="o",
         markersize=6, label="Carrera IA")
ax6.plot(semestres, empleabilidad_datos, color=COLOR_BLUE, linewidth=2.5, marker="s",
         markersize=6, label="Ciencia de Datos")
ax6.plot(semestres, empleabilidad_bigdata, color=COLOR_CORAL, linewidth=2.5, marker="^",
         markersize=6, label="Big Data")
ax6.fill_between(semestres, empleabilidad_ia, alpha=0.1, color=COLOR_YELLOW)
ax6.set_title("Proyeccion Empleabilidad ITSEIA (%)", color="white", fontsize=10, pad=8)
ax6.set_ylabel("% Empleabilidad", color="white", fontsize=8)
ax6.tick_params(colors="white", labelsize=7)
ax6.spines[["top", "right", "bottom", "left"]].set_color("#3A4F7F")
ax6.legend(fontsize=7, labelcolor="white", facecolor=COLOR_DARK, edgecolor="#3A4F7F")
ax6.set_ylim(0, 100)
ax6.yaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f"{int(x)}%"))

# ================================================
# AJUSTAR Y GUARDAR
# ================================================
plt.tight_layout(rect=[0, 0, 1, 0.96])

os.makedirs("salidas", exist_ok=True)
ruta_salida = "salidas/dashboard_mercado_laboral_ecuador.png"
plt.savefig(ruta_salida, dpi=150, bbox_inches="tight", facecolor=COLOR_DARK)
print(f"\nDashboard guardado: {ruta_salida}")
print(f"Resolucion: 150 DPI | Formato: PNG")

plt.show()
print("\nDashboard generado exitosamente.")
print("=" * 62)
```

3. Ejecuta el programa. Se genera el archivo PNG en `salidas/`.

4. Abre el archivo PNG y analiza cada grafico. Verifica que los datos son coherentes entre graficos.

5. Modifica el grafico 1 para agregar una linea vertical roja en $550 (SBU) con la etiqueta "SBU" para mostrar visualmente cuantos cargos superan el minimo.

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "En matplotlib, tengo 6 subgraficos en una figura. Explica la diferencia entre fig.add_subplot(2,3,1) y plt.subplots(2,3). ¿Cuando conviene cada uno? Tambien explica como cambiar el fondo de un subplot individual vs el fondo de toda la figura."

Despues de leer la respuesta:
- ¿Podrias refactorizar tu codigo para usar `plt.subplots(2,3)`?
- Prueba el cambio en un bloque de prueba separado.

## Que aprendiste

- `fig.add_subplot(filas, columnas, posicion)` ubica graficos en una grilla.
- `ax.bar()`, `ax.barh()`, `ax.plot()`, `ax.scatter()`, `ax.pie()` son los tipos basicos de grafico.
- `ax.set_title()`, `ax.set_xlabel()`, `ax.tick_params()` controlan el aspecto.
- `ax.spines` son los bordes del grafico; puedes colorearlos o eliminarlos.
- `np.polyfit()` calcula los coeficientes de una linea de tendencia.
- `plt.savefig()` exporta a PNG, PDF o SVG con la resolucion especificada.
- La paleta de colores consistente hace los dashboards mas profesionales.

## Reto extra

Agrega un septimo grafico (fuera del dashboard, en una figura separada): un grafico de barras agrupadas que compare, para cada carrera ITSEIA, los salarios en Semestre 1, Semestre 3 y Semestre 5 (usa datos estimados basados en el mercado). Guarda esta figura como `salidas/proyeccion_salarial_itseia.png`.
