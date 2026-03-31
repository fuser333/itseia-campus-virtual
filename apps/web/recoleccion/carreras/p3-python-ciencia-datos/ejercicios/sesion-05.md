# Ejercicio Sesion 5: Matplotlib — Graficos Basicos

**Materia:** Python para Ciencia de Datos
**Nivel:** Intermedio
**Herramienta IA:** Copilot
**Duracion estimada:** 40 min

## Objetivo

Crear graficos de linea, barras y scatter profesionales con Matplotlib para visualizar la evolucion economica y laboral del Ecuador, aplicando personalizacion de colores, titulos, etiquetas y estilos que cumplan estandares de presentacion ejecutiva.

## Contexto

El Banco Central del Ecuador publica su "Boletin Mensual" con indicadores macroeconomicos desde 1990 hasta hoy. Los analistas del BCE, el Ministerio de Finanzas y el INEC usan graficos de linea para mostrar tendencias del PIB, barras para comparar sectores y scatter para detectar correlaciones entre variables. Un buen grafico comunica en segundos lo que una tabla de 500 filas no puede. En el Ecuador, los reportes del BID, CAF y organismos de gobierno exigen visualizaciones estandarizadas.

## Instrucciones

1. Abre Google Colab y crea `sesion05_matplotlib_ecuador.ipynb`.

2. Configura el entorno y crea los datos:

```python
# Python para Ciencia de Datos - Sesion 5: Matplotlib Basico
# ITSEIA - Periodo 3

import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np
import pandas as pd

# Paleta ITSEIA para graficos profesionales
NAVY = '#1F2F58'
YELLOW = '#FBBC0C'
BLUE = '#73B8E7'
CORAL = '#F0846D'
BEIGE = '#F9F6E7'

# Configuracion global de estilo
plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.grid'] = True
plt.rcParams['grid.alpha'] = 0.35
plt.rcParams['font.size'] = 10

# Datos BCE Ecuador 2010-2024
anos = list(range(2010, 2025))
pib = [69235, 79277, 87925, 95130, 101726, 100177, 99938, 104296,
       107562, 108108, 99290, 106168, 115059, 118845, 121200]  # millones USD
inflacion = [3.56, 4.47, 5.11, 2.73, 3.59, 3.38, 1.12, -0.20,
             0.27, -0.93, 1.93, 3.47, 2.04, 1.55, 1.80]  # %
desempleo = [5.0, 4.2, 4.1, 4.7, 4.5, 5.5, 6.5, 4.4,
             3.8, 6.5, 5.2, 4.1, 3.6, 3.9, 4.1]  # %

# Exportaciones por producto 2024 (millones USD, estimado ProEcuador)
productos_export = ['Petroleo', 'Banano', 'Camaron', 'Cacao', 'Flores', 'Atun', 'Otros']
valores_export = [8200, 4100, 5800, 1200, 1000, 700, 6500]

print("Datos BCE Ecuador cargados correctamente")
print(f"PIB 2024: ${pib[-1]:,.0f} millones USD")
```

3. Grafico de linea — Evolucion PIB:

```python
fig, ax = plt.subplots(figsize=(12, 5))

# Linea principal
ax.plot(anos, pib, color=NAVY, linewidth=2.5, marker='o',
        markersize=6, markerfacecolor=YELLOW, markeredgecolor=NAVY,
        label='PIB Ecuador (millones USD)', zorder=3)

# Sombrear la caida de 2020 (COVID)
ax.axvspan(2019.5, 2020.5, alpha=0.12, color=CORAL, label='Impacto COVID-19')
ax.axvline(2020, color=CORAL, linestyle='--', linewidth=1, alpha=0.6)

# Anotar el punto minimo (COVID)
idx_min = pib.index(min(pib))
ax.annotate(f'${pib[idx_min]:,.0f}M\n(COVID-19)',
            xy=(anos[idx_min], pib[idx_min]),
            xytext=(anos[idx_min] - 2, pib[idx_min] + 5000),
            arrowprops=dict(arrowstyle='->', color=CORAL),
            fontsize=9, color=CORAL)

# Anotar el punto maximo
idx_max = pib.index(max(pib))
ax.annotate(f'${pib[idx_max]:,.0f}M\n(Record)',
            xy=(anos[idx_max], pib[idx_max]),
            xytext=(anos[idx_max] - 2, pib[idx_max] - 8000),
            arrowprops=dict(arrowstyle='->', color=NAVY),
            fontsize=9, color=NAVY)

ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, p: f'${x/1000:.0f}B'))
ax.set_xlabel('Año', fontsize=11)
ax.set_ylabel('PIB (miles de millones USD)', fontsize=11)
ax.set_title('Producto Interno Bruto del Ecuador 2010-2024\nFuente: Banco Central del Ecuador', fontsize=12)
ax.legend(loc='upper left')
ax.set_xticks(anos)
ax.tick_params(axis='x', rotation=45)
plt.tight_layout()
plt.show()
```

4. Grafico de barras — Exportaciones:

```python
fig, ax = plt.subplots(figsize=(10, 5))

colores_barras = [NAVY, YELLOW, BLUE, CORAL, NAVY, YELLOW, BLUE]
barras = ax.bar(productos_export, valores_export, color=colores_barras, alpha=0.87,
                edgecolor='white', linewidth=0.8)

# Etiquetas de valor encima de cada barra
for barra in barras:
    altura = barra.get_height()
    ax.text(barra.get_x() + barra.get_width()/2, altura + 80,
            f'${altura/1000:.1f}B', ha='center', va='bottom',
            fontsize=9, fontweight='bold', color='#333')

total = sum(valores_export)
ax.set_title(f'Exportaciones Ecuador por Producto 2024\nTotal: ${total/1000:.1f}B | Fuente: ProEcuador', fontsize=12)
ax.set_ylabel('Millones USD')
ax.set_xlabel('Producto de Exportacion')
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, p: f'${x/1000:.0f}B'))
ax.tick_params(axis='x', rotation=15)
plt.tight_layout()
plt.show()
```

5. Scatter — Correlacion inflacion vs desempleo:

```python
fig, axes = plt.subplots(1, 2, figsize=(13, 5))

# Scatter inflacion vs desempleo
colores_puntos = [NAVY if a < 2020 else CORAL for a in anos]
scatter = axes[0].scatter(inflacion, desempleo, c=colores_puntos, s=80, zorder=3, alpha=0.85)

# Etiquetas de años en puntos relevantes
for i, (inf, desemp, ano) in enumerate(zip(inflacion, desempleo, anos)):
    if ano in [2010, 2016, 2020, 2023, 2024]:
        axes[0].annotate(str(ano), (inf, desemp),
                         textcoords='offset points', xytext=(5, 4), fontsize=8)

# Linea de tendencia
z = np.polyfit(inflacion, desempleo, 1)
p = np.poly1d(z)
x_line = np.linspace(min(inflacion), max(inflacion), 100)
axes[0].plot(x_line, p(x_line), '--', color=YELLOW, linewidth=1.5, label='Tendencia')
corr = np.corrcoef(inflacion, desempleo)[0, 1]
axes[0].set_title(f'Inflacion vs Desempleo Ecuador 2010-2024\nCorrelacion: {corr:.3f}')
axes[0].set_xlabel('Inflacion Anual (%)')
axes[0].set_ylabel('Tasa de Desempleo (%)')
axes[0].legend()
from matplotlib.patches import Patch
legend_elements = [Patch(color=NAVY, label='Pre-2020'), Patch(color=CORAL, label='Post-COVID')]
axes[0].legend(handles=legend_elements, loc='upper right')

# Subgrafico de linea dual: inflacion + desempleo
ax2_twin = axes[1].twinx()
l1, = axes[1].plot(anos, inflacion, color=NAVY, linewidth=2, marker='s', markersize=5, label='Inflacion %')
l2, = ax2_twin.plot(anos, desempleo, color=CORAL, linewidth=2, marker='^', markersize=5, label='Desempleo %')
axes[1].set_xlabel('Año')
axes[1].set_ylabel('Inflacion (%)', color=NAVY)
ax2_twin.set_ylabel('Desempleo (%)', color=CORAL)
axes[1].set_title('Inflacion y Desempleo Ecuador 2010-2024\nFuente: BCE / INEC')
axes[1].tick_params(axis='x', rotation=45)
axes[1].legend(handles=[l1, l2], loc='upper left')
plt.suptitle('Indicadores Macroeconomicos Ecuador | ITSEIA P3', color='gray', fontsize=10)
plt.tight_layout()
plt.show()
```

## Usa IA para...

> Abre GitHub Copilot y escribe en el chat:
> "I'm using Matplotlib to visualize Ecuador economic data. Show me how to create a subplot with 3 panels: a pie chart of exports by product, a horizontal bar chart of unemployment by province, and a filled area chart of GDP growth. Include proper titles, colors, and labels."

Despues de recibir el codigo:
- Adapta el codigo al contexto ecuatoriano usando los datos del ejercicio.
- Cambia los colores a la paleta ITSEIA (#1F2F58, #FBBC0C, #73B8E7, #F0846D).

## Que aprendiste

- `fig, ax = plt.subplots(figsize=(w, h))` crea la figura y el eje en una linea; `fig, axes = plt.subplots(1, 2)` crea multiples paneles.
- `.plot()`, `.bar()` y `.scatter()` son los tres tipos fundamentales de graficos; todos comparten la misma API de personalización.
- `.annotate()` agrega anotaciones con flechas a puntos especificos del grafico.
- `ax.twinx()` crea un segundo eje Y para series con escalas distintas en el mismo grafico.
- `mticker.FuncFormatter` personaliza los formatos de los ejes (convertir millones a "B" de billones, por ejemplo).

## Reto extra

Descarga el boletin mensual del BCE desde `estadisticas.bce.fin.ec` (cualquier indicador en formato CSV). Crea un grafico de linea de los ultimos 5 años con: linea principal, anotaciones en el maximo y minimo, area sombreada para el periodo COVID (2020-2021) y titulo con la fuente oficial. Exporta el grafico como PNG de 300 DPI con `plt.savefig('bce_indicador.png', dpi=300, bbox_inches='tight')`.
