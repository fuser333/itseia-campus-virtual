# Ejercicio Sesion 6: Seaborn — Graficos Estadisticos Avanzados

**Materia:** Python para Ciencia de Datos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Crear visualizaciones estadisticas avanzadas con Seaborn (distribuciones, boxplots, heatmaps de correlacion, pairplots) sobre datos de hogares ecuatorianos de la Encuesta Nacional de Empleo y Desempleo (ENEMDU) del INEC para comunicar patrones estadisticos complejos de forma efectiva.

## Contexto

La ENEMDU (Encuesta Nacional de Empleo, Desempleo y Subempleo) del INEC es la fuente mas completa sobre condiciones de vida en Ecuador: ingresos, horas trabajadas, nivel educativo, acceso a servicios. La encuesta se aplica trimestralmente a 30,000 hogares en todo el pais. Mientras Matplotlib permite construir graficos con control total, Seaborn esta disenado especificamente para estadistica: convierte analisis complejos en una sola linea de codigo.

## Instrucciones

1. Abre Google Colab y crea `sesion06_seaborn_enemdu.ipynb`.

2. Crea el dataset ENEMDU simulado:

```python
# Python para Ciencia de Datos - Sesion 6: Seaborn
# ITSEIA - Periodo 3

import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

print(f"Seaborn version: {sns.__version__}")

# Configuracion de estilo Seaborn
sns.set_theme(style='whitegrid', palette='muted', font_scale=1.05)

np.random.seed(2024)
n = 800  # encuestados

# Simular ENEMDU Ecuador 2024
area = np.random.choice(['Urbano', 'Rural'], n, p=[0.65, 0.35])
region = np.random.choice(['Sierra', 'Costa', 'Amazonia'], n, p=[0.45, 0.46, 0.09])
genero = np.random.choice(['Hombre', 'Mujer'], n)
nivel_educacion = np.random.choice(
    ['Ninguno', 'Primaria', 'Secundaria', 'Superior', 'Posgrado'],
    n, p=[0.04, 0.22, 0.38, 0.31, 0.05]
)
edad = np.random.randint(18, 65, n)

# Ingreso mensual USD (fuertemente influenciado por educacion y area)
base_ingreso = {
    'Ninguno': 250, 'Primaria': 350, 'Secundaria': 480,
    'Superior': 780, 'Posgrado': 1400
}
ingreso_base = np.array([base_ingreso[e] for e in nivel_educacion])
ingreso_area_bonus = np.where(np.array(area) == 'Urbano', 120, -80)
ingreso_genero_gap = np.where(np.array(genero) == 'Hombre', 80, -60)
ingreso = (
    ingreso_base + ingreso_area_bonus + ingreso_genero_gap
    + np.random.normal(0, 150, n)
).clip(100, 5000).round(2)

horas_semanales = np.random.normal(42, 9, n).clip(10, 80).round(1)
satisfaccion_laboral = np.random.choice([1, 2, 3, 4, 5], n, p=[0.08, 0.15, 0.27, 0.32, 0.18])
tiene_seguro_social = np.where(
    np.array([nivel_educacion[i] in ['Superior', 'Posgrado'] for i in range(n)]),
    np.random.choice([0, 1], n, p=[0.25, 0.75]),
    np.random.choice([0, 1], n, p=[0.60, 0.40])
)

df = pd.DataFrame({
    'area': area, 'region': region, 'genero': genero,
    'nivel_educacion': nivel_educacion, 'edad': edad,
    'ingreso_mensual': ingreso, 'horas_semanales': horas_semanales,
    'satisfaccion_laboral': satisfaccion_laboral,
    'seguro_social': tiene_seguro_social
})

print("Dataset ENEMDU Ecuador 2024 (simulado)")
print(f"Shape: {df.shape}")
print(f"Ingreso promedio: ${df['ingreso_mensual'].mean():.2f}")
print(df.dtypes)
```

3. Distribuciones y comparaciones:

```python
fig, axes = plt.subplots(2, 3, figsize=(16, 10))

# 1. Histograma con KDE: distribucion de ingresos
sns.histplot(data=df, x='ingreso_mensual', hue='area', kde=True,
             palette={'Urbano': '#1F2F58', 'Rural': '#FBBC0C'},
             bins=35, alpha=0.6, ax=axes[0, 0])
axes[0, 0].set_title('Distribucion de Ingresos por Area')
axes[0, 0].set_xlabel('Ingreso Mensual (USD)')
axes[0, 0].axvline(df['ingreso_mensual'].median(), color='#F0846D',
                   linestyle='--', linewidth=1.5, label=f'Mediana: ${df["ingreso_mensual"].median():.0f}')
axes[0, 0].legend()

# 2. Boxplot: ingreso por nivel educativo
orden_edu = ['Ninguno', 'Primaria', 'Secundaria', 'Superior', 'Posgrado']
sns.boxplot(data=df, x='nivel_educacion', y='ingreso_mensual',
            order=orden_edu,
            palette='muted', ax=axes[0, 1])
axes[0, 1].set_title('Ingreso por Nivel Educativo')
axes[0, 1].set_xlabel('Nivel de Educacion')
axes[0, 1].set_ylabel('Ingreso Mensual (USD)')
axes[0, 1].tick_params(axis='x', rotation=30)

# 3. Violinplot: comparacion por genero y region
sns.violinplot(data=df, x='region', y='ingreso_mensual', hue='genero',
               palette={'Hombre': '#1F2F58', 'Mujer': '#F0846D'},
               split=True, inner='quartile', ax=axes[0, 2])
axes[0, 2].set_title('Distribucion Ingreso por Region y Genero')
axes[0, 2].set_ylabel('Ingreso Mensual (USD)')

# 4. Barplot con intervalo de confianza
sns.barplot(data=df, x='nivel_educacion', y='horas_semanales',
            order=orden_edu, palette='muted',
            errorbar='ci', capsize=0.08, ax=axes[1, 0])
axes[1, 0].set_title('Horas Semanales por Nivel Educativo\n(barras = IC 95%)')
axes[1, 0].tick_params(axis='x', rotation=30)

# 5. Countplot: satisfaccion laboral por area
sns.countplot(data=df, x='satisfaccion_laboral', hue='area',
              palette={'Urbano': '#73B8E7', 'Rural': '#FBBC0C'},
              ax=axes[1, 1])
axes[1, 1].set_title('Satisfaccion Laboral por Area\n(1=Muy insatisfecho, 5=Muy satisfecho)')
axes[1, 1].set_xlabel('Nivel de Satisfaccion')

# 6. Scatterplot con regresion: edad vs ingreso por educacion
sns.scatterplot(data=df[df['nivel_educacion'].isin(['Secundaria', 'Superior'])],
                x='edad', y='ingreso_mensual', hue='nivel_educacion',
                palette={'Secundaria': '#1F2F58', 'Superior': '#FBBC0C'},
                alpha=0.4, s=25, ax=axes[1, 2])
axes[1, 2].set_title('Edad vs Ingreso\n(Secundaria vs Superior)')

plt.suptitle('ENEMDU Ecuador 2024 - Analisis Estadistico | ITSEIA P3',
             fontsize=13, fontweight='bold', y=1.01)
plt.tight_layout()
plt.show()
```

4. Heatmap de correlacion:

```python
# HEATMAP DE CORRELACION (la herramienta mas usada en EDA)
numericas = df[['edad', 'ingreso_mensual', 'horas_semanales',
                'satisfaccion_laboral', 'seguro_social']]
correlacion = numericas.corr()

fig, ax = plt.subplots(figsize=(8, 6))
mask = np.triu(np.ones_like(correlacion, dtype=bool))  # triangulo superior
sns.heatmap(correlacion, mask=mask, annot=True, fmt='.3f',
            cmap='RdYlBu', center=0, vmin=-1, vmax=1,
            linewidths=0.5, ax=ax,
            cbar_kws={'label': 'Correlacion de Pearson'})
ax.set_title('Matriz de Correlacion - Variables ENEMDU Ecuador\n'
             'ITSEIA P3 | Fuente: INEC simulado', fontsize=11)
plt.tight_layout()
plt.show()

# Hallazgos clave
print("HALLAZGOS DEL HEATMAP:")
for i in range(len(correlacion.columns)):
    for j in range(i):
        r = correlacion.iloc[i, j]
        if abs(r) > 0.15:
            v1 = correlacion.columns[i]
            v2 = correlacion.columns[j]
            direccion = "POSITIVA" if r > 0 else "NEGATIVA"
            print(f"  {v1} vs {v2}: r={r:.3f} ({direccion})")
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Tengo datos ENEMDU Ecuador con variables: ingreso_mensual, nivel_educacion, genero, region. Quiero crear un pairplot con Seaborn que muestre la relacion entre todas las variables numericas, coloreado por nivel educativo. Explica que informacion puedo extraer de cada panel del pairplot."

Despues de leer la respuesta:
- Implementa el `sns.pairplot()` que Claude sugiera con los datos del ejercicio.
- Identifica la correlacion mas fuerte y la mas debil visualmente.

## Que aprendiste

- Seaborn usa DataFrames directamente: `data=df, x='col1', y='col2', hue='col3'` es su sintaxis estandar.
- `histplot` + `kde=True` combina histograma y estimacion de densidad del kernel en un grafico.
- `boxplot` muestra mediana, cuartiles y outliers; `violinplot` ademas muestra la distribucion completa.
- El `heatmap` de correlacion con `mask=triangulo` evita la redundancia: solo muestra el triangulo inferior.
- El parametro `hue=` segmenta visualmente por una variable categorica en casi todos los graficos de Seaborn.

## Reto extra

Usando el dataset ENEMDU, crea un `FacetGrid` de Seaborn que muestre la distribucion de ingresos por region (Sierra, Costa, Amazonia) en 3 columnas separadas, con una linea vertical indicando la mediana de cada region. Luego calcula la brecha de genero en ingresos para cada region (ingreso hombres / ingreso mujeres - 1) e interpreta el resultado en terminos de politica publica ecuatoriana.
