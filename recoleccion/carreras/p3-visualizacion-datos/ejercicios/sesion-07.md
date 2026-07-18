# Ejercicio Sesion 7: Storytelling Visual — De Datos a Historia

**Materia:** Visualizacion de Datos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Aplicar principios de narrative data visualization para transformar un conjunto de datos economicos del Ecuador en una historia visual con estructura (contexto, tension, resolucion) que sea comprensible para una audiencia no tecnica.

## Contexto

Un grafico perfecto tecnica y esteticamente puede fracasar si no cuenta una historia. Los mejores reportes del New York Times, Bloomberg y el INEC no muestran datos: cuentan historias con datos. En Ecuador, el tema del empleo juvenil es critico: mas del 40% de jovenes entre 18 y 24 años estan en subempleo o desempleo. Como analista, tienes los datos. Tu trabajo es convertirlos en una historia que mueva a la accion.

## Instrucciones

1. Abre Google Colab y crea `sesion07_storytelling_visual.ipynb`.

2. Prepara los datos y la estructura narrativa:

```python
# ITSEIA - Visualizacion de Datos - Sesion 7
# Storytelling visual con datos de empleo juvenil Ecuador

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.gridspec as gridspec
import numpy as np
import pandas as pd

# El problema que vamos a contar:
# "El empleo juvenil en Ecuador: una generacion sin oportunidades"
# Estructura narrativa: Contexto → Tension → Punto de quiebre → Camino de salida

# DATOS (basados en INEC ENEMDU 2019-2024, jovenes 18-24 años)
anios = [2019, 2020, 2021, 2022, 2023, 2024]

# Tasa de desempleo por grupo etario
desempleo_jovenes = [9.8, 15.2, 13.6, 10.4, 9.1, 8.7]  # 18-24 años
desempleo_adultos = [3.8,  6.2,  5.8,  4.2,  3.6, 3.4]  # 25-54 años

# Subempleo juvenil (trabajan menos horas o fuera de su campo)
subempleo_jovenes = [22.4, 29.8, 27.1, 20.6, 18.3, 17.9]

# Jovenes que estudian Y trabajan (%)
estudia_trabaja = [14.2, 11.8, 12.9, 15.1, 16.4, 17.2]

# Ingreso promedio mensual jovenes vs adultos (USD)
ingreso_jovenes = [280, 245, 265, 290, 310, 325]
ingreso_adultos = [520, 480, 495, 540, 565, 580]

# Distribucion actividad jovenes 2024
actividad_2024 = {
    'Empleados\nformales': 28.4,
    'Empleados\ninformales': 21.3,
    'Subempleo': 17.9,
    'Desempleo': 8.7,
    'Solo\nestudia': 16.8,
    'NEET\n(ni-ni)': 6.9
}
```

3. Construye la historia visual en una figura de 4 paneles con titulo narrativo:

```python
fig = plt.figure(figsize=(18, 14))
fig.patch.set_facecolor('#0A1628')  # Navy dark - dramatico
gs = gridspec.GridSpec(3, 3, figure=fig, hspace=0.55, wspace=0.40)

# Colores de la historia
color_drama = '#F0846D'    # coral para lo negativo/tension
color_esperanza = '#FBBC0C' # amarillo para el cambio
color_base = '#73B8E7'    # celeste para datos de referencia
color_texto = '#F9F6E7'   # beige claro para texto sobre fondo oscuro

# =============================================
# PANEL 0: TITULO Y CONTEXTO (fila 0, columna 0-2)
# =============================================
ax_titulo = fig.add_subplot(gs[0, :])
ax_titulo.set_facecolor('#0A1628')
ax_titulo.axis('off')

ax_titulo.text(0.5, 0.75, 'El empleo juvenil en Ecuador',
               transform=ax_titulo.transAxes, fontsize=26,
               color='white', ha='center', fontweight='bold',
               fontfamily='sans-serif')
ax_titulo.text(0.5, 0.45, 'Los jovenes de 18-24 años enfrentan una tasa de desempleo',
               transform=ax_titulo.transAxes, fontsize=14,
               color=color_texto, ha='center', alpha=0.9)
ax_titulo.text(0.5, 0.22,
               '2.5 veces mayor que la de adultos, con ingresos 44% menores',
               transform=ax_titulo.transAxes, fontsize=14,
               color=color_drama, ha='center', fontweight='bold')
ax_titulo.text(0.02, 0.05, 'Fuente: INEC ENEMDU 2019-2024 | Analisis: ITSEIA 2024',
               transform=ax_titulo.transAxes, fontsize=9,
               color='#888888', ha='left')

# =============================================
# PANEL 1: LA BRECHA (fila 1, columnas 0-1)
# =============================================
ax1 = fig.add_subplot(gs[1, :2])
ax1.set_facecolor('#0F1E3D')

ax1.plot(anios, desempleo_jovenes, color=color_drama, linewidth=3,
         marker='o', markersize=8, label='Jovenes (18-24)', zorder=5)
ax1.plot(anios, desempleo_adultos, color=color_base, linewidth=2.5,
         marker='s', markersize=6, linestyle='--', label='Adultos (25-54)', zorder=4)

# Relleno de la brecha = la historia
ax1.fill_between(anios, desempleo_jovenes, desempleo_adultos,
                 alpha=0.2, color=color_drama, label='_Brecha')

# Anotacion del pico (2020 - COVID)
ax1.annotate('Pico COVID\n+15.2%', xy=(2020, 15.2),
             xytext=(2020.4, 16.8),
             arrowprops=dict(arrowstyle='->', color=color_drama, lw=1.5),
             color=color_drama, fontsize=9, fontweight='bold')

# Anotacion de la brecha actual
ax1.annotate(f'Brecha 2024:\n{desempleo_jovenes[-1] - desempleo_adultos[-1]:.1f} pp',
             xy=(2024, (desempleo_jovenes[-1]+desempleo_adultos[-1])/2),
             xytext=(2022.8, 6.5),
             arrowprops=dict(arrowstyle='->', color='white', lw=1.2),
             color='white', fontsize=9)

ax1.set_facecolor('#0F1E3D')
ax1.tick_params(colors=color_texto)
ax1.spines['bottom'].set_color('#334466')
ax1.spines['left'].set_color('#334466')
for sp in ['top','right']: ax1.spines[sp].set_visible(False)
ax1.set_title('ACTO 1: La brecha — Desempleo juvenil vs adulto (%)',
              color=color_texto, fontsize=11, loc='left', pad=10)
ax1.legend(loc='upper right', labelcolor=color_texto,
           facecolor='#0F1E3D', edgecolor='#334466', fontsize=9)
ax1.yaxis.label.set_color(color_texto)
ax1.set_ylabel('Tasa desempleo (%)', color=color_texto)

# =============================================
# PANEL 2: COMPOSICION (fila 1, columna 2)
# =============================================
ax2 = fig.add_subplot(gs[1, 2])
ax2.set_facecolor('#0F1E3D')

categorias_actividad = list(actividad_2024.keys())
valores_actividad = list(actividad_2024.values())
colores_act = [color_base, '#2A5F8A', color_drama,
               '#CC3300', color_esperanza, '#888888']

wedges, texts, autotexts = ax2.pie(
    valores_actividad, labels=categorias_actividad,
    colors=colores_act, autopct='%1.1f%%',
    startangle=90, pctdistance=0.75,
    textprops={'color': color_texto, 'fontsize': 7.5}
)
for at in autotexts:
    at.set_fontsize(7.5)
    at.set_color('white')

ax2.set_title('ACTO 2: ¿Que hacen\nlos jovenes hoy? (2024)',
              color=color_texto, fontsize=10, loc='left')

# =============================================
# PANEL 3: LA RESOLUCION - EDUCACION COMO SALIDA (fila 2, columnas 0-2)
# =============================================
ax3 = fig.add_subplot(gs[2, :])
ax3.set_facecolor('#0F1E3D')

x = np.arange(len(anios))
width = 0.35

bars1 = ax3.bar(x - width/2, ingreso_jovenes, width, label='Ingreso jovenes (USD)',
                color=color_drama, alpha=0.85, zorder=3)
bars2 = ax3.bar(x + width/2, ingreso_adultos, width, label='Ingreso adultos (USD)',
                color=color_base, alpha=0.85, zorder=3)

# Etiquetas de valor
for bar in bars1:
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
             f'${bar.get_height():.0f}', ha='center', color=color_drama, fontsize=8)
for bar in bars2:
    ax3.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
             f'${bar.get_height():.0f}', ha='center', color=color_base, fontsize=8)

# ANOTACION: el punto de quiebre con educacion tecnica
ax3.annotate(
    'Con Tecnologia Superior en IA:\n$800-$1,200/mes en 2.5 años',
    xy=(5 + width/2, ingreso_adultos[-1]),
    xytext=(3.8, 750),
    arrowprops=dict(arrowstyle='->', color=color_esperanza, lw=2),
    color=color_esperanza, fontsize=10, fontweight='bold',
    bbox=dict(boxstyle='round,pad=0.3', facecolor='#1F2F58', edgecolor=color_esperanza, alpha=0.9)
)

ax3.set_facecolor('#0F1E3D')
ax3.set_xticks(x)
ax3.set_xticklabels(anios, color=color_texto)
ax3.tick_params(colors=color_texto)
for sp in ['top','right']: ax3.spines[sp].set_visible(False)
ax3.spines['bottom'].set_color('#334466')
ax3.spines['left'].set_color('#334466')
ax3.set_title('ACTO 3: La resolucion — La brecha de ingresos y el camino de salida',
              color=color_texto, fontsize=11, loc='left', pad=10)
ax3.legend(loc='upper left', labelcolor=color_texto,
           facecolor='#0F1E3D', edgecolor='#334466', fontsize=9)
ax3.set_ylabel('Ingreso promedio mensual (USD)', color=color_texto)

plt.savefig('storytelling_empleo_juvenil_ecuador.png', dpi=150,
            bbox_inches='tight', facecolor=fig.get_facecolor())
plt.show()
print("Historia visual guardada.")
```

4. En una celda de texto, escribe el guion narrativo de 5 oraciones que acompanaria esta visualizacion en una presentacion. Incluye: apertura con dato impactante, desarrollo del problema, punto de quiebre y llamado a la accion.

## Usa IA para...

> Abre Claude y escribe:
> "Soy analista de datos en Ecuador. Tengo esta historia: los jovenes tienen 2.5x mas desempleo que adultos, ganan 44% menos y solo el 28% tiene empleo formal. Mi audiencia es el Ministerio de Educacion. Ayudame a escribir un parrafo de apertura impactante (tipo TED talk) para presentar esta visualizacion. Maximo 60 palabras."

Usa ese parrafo como el primer slide de una presentacion hipotetica.

## Que aprendiste

- La estructura narrativa (contexto, tension, resolucion) funciona igual con datos que con una novela.
- El color tiene carga emocional: rojo/coral para problemas, amarillo para oportunidades, azul para datos neutros.
- Las anotaciones dirigidas guian la mirada del lector exactamente hacia donde quieres.
- `fill_between()` visualiza brechas mejor que dos lineas solas.
- Un fondo oscuro con datos dramaticos genera impacto emocional mayor que el blanco estandar.

## Reto extra

Adapta esta historia visual para una audiencia diferente: padres de familia de nivel socieconomico medio-bajo en Quito. Cambia el titulo, las anotaciones y el panel de resolucion (Acto 3) para que el mensaje sea "invertir en educacion tecnica de tu hijo es la mejor decision economica". El grafico debe motivar la inscripcion en ITSEIA.
