# Ejercicio Sesion 3: Seaborn — Heatmaps, Pairplots y Distribuciones

**Materia:** Visualizacion de Datos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Usar Seaborn para explorar visualmente relaciones entre variables en datasets de Ecuador: identificar correlaciones con heatmaps, patrones multivariables con pairplots y distribuciones de datos reales con histogramas y violinplots.

## Contexto

El INEC publica la Encuesta Nacional de Empleo (ENEMDU) cada trimestre. Un analista de datos necesita explorar rapidamente si existe correlacion entre nivel educativo, ingreso mensual y region geografica. Seaborn esta disenado exactamente para este tipo de exploracion estadistica visual. En 10 lineas de codigo puedes ver relaciones que tomarian horas detectar en una tabla de Excel.

## Instrucciones

1. Abre Google Colab y crea `sesion03_seaborn_exploracion.ipynb`.

2. Instala y carga librerias con datos simulados basados en ENEMDU Ecuador 2024:

```python
# ITSEIA - Visualizacion de Datos - Sesion 3
# Seaborn: heatmaps, pairplots y distribuciones

import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

np.random.seed(42)
n = 300

# Dataset simulado basado en parametros reales ENEMDU 2024
# Fuente referencia: encuesta.inec.gob.ec
data = pd.DataFrame({
    'anios_educacion': np.random.choice([6, 9, 12, 15, 17], n,
                        p=[0.10, 0.20, 0.35, 0.25, 0.10]),
    'ingreso_mensual': np.random.lognormal(6.3, 0.6, n).clip(200, 3000),
    'edad': np.random.randint(18, 65, n),
    'horas_trabajo': np.random.normal(42, 8, n).clip(20, 60),
    'region': np.random.choice(['Sierra', 'Costa', 'Amazonia', 'Insular'], n,
                                p=[0.47, 0.43, 0.09, 0.01]),
    'sector': np.random.choice(['Publico', 'Privado', 'Independiente'], n,
                                p=[0.25, 0.45, 0.30]),
    'satisfaccion': np.random.randint(1, 6, n)  # escala 1-5
})

# Ajustar ingreso segun educacion (relacion real)
data.loc[data['anios_educacion'] >= 15, 'ingreso_mensual'] *= 1.8
data.loc[data['anios_educacion'] <= 6, 'ingreso_mensual'] *= 0.65
data['ingreso_mensual'] = data['ingreso_mensual'].clip(200, 3000)

print(data.head())
print(f"\nShape: {data.shape}")
print(data.describe().round(2))
```

3. Crea un HEATMAP de correlaciones:

```python
fig, ax = plt.subplots(figsize=(8, 6))

# Solo columnas numericas
numericas = data[['anios_educacion', 'ingreso_mensual', 'edad',
                   'horas_trabajo', 'satisfaccion']]
correlaciones = numericas.corr()

# Mascara triangulo superior (evita redundancia)
mask = np.triu(np.ones_like(correlaciones, dtype=bool))

sns.heatmap(correlaciones,
            mask=mask,
            annot=True,          # Mostrar valores numericos
            fmt='.2f',           # 2 decimales
            cmap='coolwarm',     # Rojo=positivo, Azul=negativo
            center=0,
            vmin=-1, vmax=1,
            square=True,
            linewidths=0.5,
            ax=ax,
            cbar_kws={'shrink': 0.8})

ax.set_title('Correlaciones — Dataset Laboral Ecuador 2024\n(Basado en ENEMDU)',
             fontsize=12, color='#1F2F58', loc='left')

plt.tight_layout()
plt.savefig('heatmap_correlaciones_ecuador.png', dpi=150, bbox_inches='tight')
plt.show()

# Analisis
corr_educ_ingreso = correlaciones.loc['anios_educacion', 'ingreso_mensual']
print(f"\nCorrelacion educacion-ingreso: {corr_educ_ingreso:.3f}")
print("Interpretacion:", "Positiva fuerte" if corr_educ_ingreso > 0.5 else
      "Positiva moderada" if corr_educ_ingreso > 0.3 else "Debil")
```

4. Crea un PAIRPLOT para explorar todas las relaciones a la vez:

```python
# Pairplot: matriz de graficos de dispersion + distribuciones diagonales
# Coloreado por region geografica

g = sns.pairplot(
    data[['anios_educacion', 'ingreso_mensual', 'horas_trabajo', 'region']],
    hue='region',
    palette={'Sierra': '#1F2F58', 'Costa': '#73B8E7',
             'Amazonia': '#FBBC0C', 'Insular': '#F0846D'},
    plot_kws={'alpha': 0.5, 's': 20},
    diag_kind='kde',    # Curva de densidad en diagonal
    corner=True         # Solo triangulo inferior
)
g.fig.suptitle('Pairplot Variables Laborales por Region — Ecuador 2024',
               y=1.02, fontsize=12, color='#1F2F58')

plt.savefig('pairplot_laboral_ecuador.png', dpi=150, bbox_inches='tight')
plt.show()
print("Observa: ¿en que region el ingreso tiene mayor dispersion?")
```

5. Crea VIOLINPLOTS y DISTRIBUCIONES comparativas:

```python
fig, axes = plt.subplots(1, 2, figsize=(14, 6))
fig.patch.set_facecolor('white')

# Violinplot: distribucion ingreso por region
sns.violinplot(
    data=data, x='region', y='ingreso_mensual',
    palette=['#1F2F58', '#73B8E7', '#FBBC0C', '#F0846D'],
    inner='quartile',   # Muestra cuartiles dentro del violin
    ax=axes[0]
)
axes[0].set_title('Distribucion Ingreso por Region\nEcuador 2024', fontsize=11, loc='left')
axes[0].set_xlabel('Region')
axes[0].set_ylabel('Ingreso Mensual (USD)')
axes[0].axhline(data['ingreso_mensual'].median(), color='#F0846D',
                linestyle='--', linewidth=1, alpha=0.7)
axes[0].text(3.5, data['ingreso_mensual'].median() + 20,
             f"Mediana: ${data['ingreso_mensual'].median():.0f}", fontsize=8, color='#F0846D')
for spine in ['top','right']: axes[0].spines[spine].set_visible(False)

# Histograma con KDE: distribucion ingreso por sector
for sector, color in zip(['Publico','Privado','Independiente'],
                          ['#1F2F58','#73B8E7','#FBBC0C']):
    subset = data[data['sector'] == sector]['ingreso_mensual']
    sns.kdeplot(subset, ax=axes[1], label=sector, color=color,
                linewidth=2, fill=True, alpha=0.2)

axes[1].set_title('Distribucion Ingreso por Sector\nEcuador 2024', fontsize=11, loc='left')
axes[1].set_xlabel('Ingreso Mensual (USD)')
axes[1].set_ylabel('Densidad')
axes[1].legend(title='Sector', fontsize=9)
for spine in ['top','right']: axes[1].spines[spine].set_visible(False)

plt.tight_layout()
plt.savefig('distribuciones_ingreso_ecuador.png', dpi=150, bbox_inches='tight')
plt.show()
```

6. Responde en una celda de texto: ¿Que variable tiene mayor correlacion con el ingreso mensual segun el heatmap? ¿Que region muestra mayor desigualdad segun el violinplot?

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un dataset laboral con variables: anios_educacion, ingreso_mensual, edad, horas_trabajo y region (Sierra, Costa, Amazonia). Con Seaborn, ¿como detecto si hay valores atipicos (outliers) en el ingreso que distorsionan el analisis? Dame el codigo y explica el metodo IQR."

Implementa el codigo para identificar y marcar outliers en el dataset de este ejercicio.

## Que aprendiste

- `heatmap` con `annot=True` muestra la fuerza y direccion de cada correlacion de un vistazo.
- La mascara triangular elimina redundancia en la matriz de correlaciones.
- `pairplot` es la herramienta mas rapida para exploracion multivariable al inicio de un proyecto.
- Los `violinplots` muestran la distribucion completa (no solo media/std) revelando si hay grupos o asimetria.
- `kdeplot` con `fill=True` compara distribuciones continuas superpuestas de forma clara.

## Reto extra

Descarga el dataset "Indice de Precios al Consumidor" del INEC (o usa datos mensuales de 12 ciudades ecuatorianas que puedes generar con `np.random.normal`). Crea un heatmap donde las filas son meses y las columnas son ciudades, mostrando la inflacion de cada ciudad en cada mes. Usa paleta de color `YlOrRd` (amarillo-rojo). Identifica cual ciudad tuvo la inflacion mas alta y en que mes.
