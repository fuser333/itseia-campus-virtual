# Ejercicio Sesion 2: Matplotlib Avanzado — Subplots, Estilos y Anotaciones

**Materia:** Visualizacion de Datos
**Nivel:** Intermedio
**Herramienta IA:** Copilot
**Duracion estimada:** 45 min

## Objetivo

Dominar las capacidades avanzadas de Matplotlib: crear layouts de subplots complejos, aplicar estilos predefinidos y personalizados, y agregar anotaciones con flechas para destacar eventos clave en datos economicos del Ecuador.

## Contexto

Un analista de datos en el Ministerio de Economia de Ecuador necesita presentar un informe mensual con multiples indicadores en una sola pagina. No puede usar 4 graficos separados: todo debe caber en una figura profesional con estilo institucional. Matplotlib tiene un sistema de subplots poderoso que, bien usado, produce reportes a nivel de publicacion academica.

## Instrucciones

1. Abre Google Colab y crea `sesion02_matplotlib_avanzado.ipynb`.

2. Prepara los datos economicos de Ecuador:

```python
# ITSEIA - Visualizacion de Datos - Sesion 2
# Matplotlib avanzado: subplots, estilos y anotaciones

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

# Datos mensuales 2024 Ecuador (aproximados, fuente BCE/INEC)
meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
mes_num = np.arange(len(meses))

# Inflacion mensual 2024 (%)
inflacion = [0.11, 0.08, 0.15, 0.22, 0.18, 0.12, 0.09, 0.14, 0.20, 0.16, 0.10, 0.07]

# Precio petroleo WTI (USD/barril, impacta presupuesto Ecuador)
precio_petroleo = [72, 76, 81, 85, 79, 83, 78, 74, 71, 69, 73, 77]

# Exportaciones (millones USD, mensual 2024)
exportaciones = [1850, 1720, 2100, 1980, 2050, 2200, 2150, 2080, 1950, 2010, 1890, 2300]

# Remesas recibidas (millones USD, Banco Central Ecuador)
remesas = [390, 385, 410, 405, 420, 415, 400, 395, 408, 412, 398, 430]
```

3. Crea un dashboard con subplots de tamaños distintos usando `gridspec`:

```python
fig = plt.figure(figsize=(16, 10))
fig.patch.set_facecolor('#F9F6E7')  # beige institucional ITSEIA

# GridSpec permite subplots con tamaños diferentes
from matplotlib.gridspec import GridSpec
gs = GridSpec(2, 3, figure=fig, hspace=0.4, wspace=0.35)

ax1 = fig.add_subplot(gs[0, :2])   # fila 0, columnas 0-1 (ancho doble)
ax2 = fig.add_subplot(gs[0, 2])    # fila 0, columna 2
ax3 = fig.add_subplot(gs[1, 0])    # fila 1, columna 0
ax4 = fig.add_subplot(gs[1, 1:])   # fila 1, columnas 1-2

# --- AX1: Exportaciones con anotacion del mes pico ---
color_exp = '#1F2F58'
ax1.fill_between(mes_num, exportaciones, alpha=0.2, color=color_exp)
ax1.plot(mes_num, exportaciones, color=color_exp, linewidth=2.5, marker='o', markersize=5)
ax1.set_xticks(mes_num)
ax1.set_xticklabels(meses)
ax1.set_title('Exportaciones Ecuador 2024 (millones USD)', fontsize=12,
              color=color_exp, loc='left', fontweight='bold')

# ANOTACION con flecha para el mes pico
idx_max = exportaciones.index(max(exportaciones))
ax1.annotate(
    f'Pico: ${max(exportaciones):,}M\n(Dic 2024)',
    xy=(idx_max, max(exportaciones)),
    xytext=(idx_max - 2.5, max(exportaciones) - 200),
    arrowprops=dict(arrowstyle='->', color='#F0846D', lw=1.8),
    fontsize=9, color='#F0846D', fontweight='bold'
)
for spine in ['top','right']: ax1.spines[spine].set_visible(False)
ax1.set_ylabel('Millones USD')

# --- AX2: Inflacion como barras con colores condicionales ---
colores_inf = ['#F0846D' if v > 0.15 else '#73B8E7' for v in inflacion]
ax2.bar(mes_num, inflacion, color=colores_inf, width=0.6)
ax2.set_xticks(mes_num)
ax2.set_xticklabels(meses, fontsize=7)
ax2.set_title('Inflacion mensual\n2024 (%)', fontsize=10, color='#333333', loc='left')
ax2.axhline(0.15, color='#F0846D', linewidth=1, linestyle='--', alpha=0.7)
ax2.text(11.3, 0.155, 'Alerta', fontsize=7, color='#F0846D')
for spine in ['top','right']: ax2.spines[spine].set_visible(False)

# --- AX3: Precio petroleo con estilo seaborn-v0_8 ---
ax3.plot(mes_num, precio_petroleo, color='#FBBC0C', linewidth=2.5, marker='s', markersize=6)
ax3.fill_between(mes_num, precio_petroleo, min(precio_petroleo)-2,
                 alpha=0.15, color='#FBBC0C')
ax3.set_xticks(mes_num)
ax3.set_xticklabels(meses, fontsize=7)
ax3.set_title('Precio WTI\n(USD/barril)', fontsize=10, loc='left')
ax3.set_ylabel('USD')

# Anotacion del minimo (impacto fiscal)
idx_min = precio_petroleo.index(min(precio_petroleo))
ax3.annotate(
    f'Min: ${min(precio_petroleo)}',
    xy=(idx_min, min(precio_petroleo)),
    xytext=(idx_min + 1, min(precio_petroleo) - 5),
    arrowprops=dict(arrowstyle='->', color='#333333', lw=1.2),
    fontsize=8, color='#333333'
)
for spine in ['top','right']: ax3.spines[spine].set_visible(False)

# --- AX4: Remesas con linea dual y leyenda ---
ax4_twin = ax4.twinx()  # Segundo eje Y
l1, = ax4.plot(mes_num, remesas, color='#1F2F58', linewidth=2, marker='o',
               markersize=5, label='Remesas (M USD)')
l2, = ax4_twin.plot(mes_num, exportaciones, color='#73B8E7', linewidth=2,
                    linestyle='--', marker='^', markersize=5, label='Exportaciones (M USD)')
ax4.set_xticks(mes_num)
ax4.set_xticklabels(meses, fontsize=7)
ax4.set_title('Remesas vs Exportaciones 2024', fontsize=10, loc='left')
ax4.set_ylabel('Remesas (M USD)', color='#1F2F58')
ax4_twin.set_ylabel('Exportaciones (M USD)', color='#73B8E7')
ax4.legend(handles=[l1, l2], loc='lower right', fontsize=8)
for spine in ['top']: ax4.spines[spine].set_visible(False)

# Titulo general del dashboard
fig.suptitle('Dashboard Economico — Ecuador 2024\nFuente: BCE, INEC, Banco Central del Ecuador',
             fontsize=14, color='#1F2F58', fontweight='bold', y=1.01)

plt.savefig('dashboard_ecuador_2024.png', dpi=150, bbox_inches='tight',
            facecolor=fig.get_facecolor())
plt.show()
print("Dashboard guardado correctamente.")
```

4. Ahora experimenta con estilos predefinidos de Matplotlib:

```python
# Ver todos los estilos disponibles
print("Estilos disponibles:")
for estilo in plt.style.available:
    print(f"  - {estilo}")

# Compara 3 estilos con el mismo grafico
estilos_prueba = ['seaborn-v0_8-whitegrid', 'ggplot', 'dark_background']

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

for i, estilo in enumerate(estilos_prueba):
    with plt.style.context(estilo):
        axes[i].bar(meses[:6], exportaciones[:6])
        axes[i].set_title(f'Estilo: {estilo}', fontsize=9)
        axes[i].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.show()
print("Cual estilo preferirías para un informe gubernamental? ¿Por que?")
```

5. Escribe en una celda de texto: ¿Que ventaja tiene `gridspec` sobre `plt.subplots()` estandar? Nombre 2 casos de uso reales donde necesitarías subplots de tamaños distintos.

## Usa IA para...

> Abre GitHub Copilot (o copilot.microsoft.com) y escribe:
> "In Python Matplotlib, show me how to add a shaded region between two dates to highlight a recession period on a time series chart. Include custom annotation with a curved arrow."

Adapta el ejemplo para marcar en el grafico de exportaciones el periodo Marzo-Junio 2020 como "Crisis COVID" usando `axvspan`.

## Que aprendiste

- `GridSpec` permite composiciones de subplots con proporciones personalizadas, ideal para dashboards.
- `annotate()` con `arrowprops` guia la atencion del lector hacia el punto mas importante del grafico.
- `twinx()` crea un segundo eje Y para comparar variables con escalas distintas en el mismo panel.
- `fill_between()` agrega area bajo la curva para enfatizar magnitud.
- Los estilos predefinidos aceleran el formateo pero deben elegirse segun el contexto (informe vs presentacion vs publicacion).

## Reto extra

Crea un estilo Matplotlib personalizado para ITSEIA: define un diccionario `rcParams` con los colores institucionales (#1F2F58, #FBBC0C, #73B8E7), fuente Inter y sin bordes superiores/derechos. Aplica ese estilo a los 4 graficos del dashboard. Guarda el resultado como `dashboard_itseia_branded.png`.
