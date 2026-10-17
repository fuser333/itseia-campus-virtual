# Ejercicio Sesion 8: Proyecto — Analisis Completo Dataset INEC Ecuador

**Materia:** Python para Ciencia de Datos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT + Claude
**Duracion estimada:** 50 min

## Objetivo

Realizar un analisis exploratorio completo (EDA) de datos del INEC Ecuador aplicando todo lo aprendido en el Periodo 3: limpieza, agrupacion, visualizacion con Matplotlib y Seaborn, correlaciones y comunicacion de hallazgos con un reporte narrativo estructurado.

## Contexto

La Encuesta de Condiciones de Vida (ECV) del INEC es el estudio mas completo sobre calidad de vida en Ecuador: cubre ingresos, vivienda, educacion, salud, acceso a servicios y empleo de mas de 28,000 hogares en las 24 provincias. El objetivo del analisis es identificar los factores que mas explican la desigualdad de ingresos entre provincias y grupos sociales. Este analisis podria ser presentado ante el Ministerio de Inclusion Economica y Social (MIES) o el SENPLADES.

## Instrucciones

1. Abre Google Colab y crea `sesion08_proyecto_ecv_inec.ipynb`.

2. Construye el dataset completo ECV:

```python
# Python para Ciencia de Datos - Sesion 8: PROYECTO INTEGRADOR
# Analisis Completo ECV - INEC Ecuador
# ITSEIA - Periodo 3

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
import seaborn as sns
from scipy import stats

np.random.seed(2024)
sns.set_theme(style='whitegrid', font_scale=1.0)

n = 1500  # hogares encuestados

# Variables del hogar y jefe de hogar (ECV INEC)
provincia = np.random.choice(
    ['Pichincha', 'Guayas', 'Azuay', 'Manabi', 'Loja', 'El Oro',
     'Tungurahua', 'Imbabura', 'Los Rios', 'Esmeraldas'],
    n, p=[0.18, 0.20, 0.08, 0.12, 0.06, 0.07, 0.07, 0.06, 0.09, 0.07]
)
region_map = {
    'Pichincha': 'Sierra', 'Guayas': 'Costa', 'Azuay': 'Sierra',
    'Manabi': 'Costa', 'Loja': 'Sierra', 'El Oro': 'Costa',
    'Tungurahua': 'Sierra', 'Imbabura': 'Sierra',
    'Los Rios': 'Costa', 'Esmeraldas': 'Costa'
}
region = [region_map[p] for p in provincia]

area = np.random.choice(['Urbano', 'Rural'], n, p=[0.66, 0.34])
genero_jefe = np.random.choice(['Hombre', 'Mujer'], n, p=[0.70, 0.30])
edad_jefe = np.random.randint(18, 80, n)
anios_educacion = np.random.choice(
    [0, 3, 6, 9, 12, 16, 18], n,
    p=[0.03, 0.08, 0.18, 0.20, 0.28, 0.18, 0.05]
)
miembros_hogar = np.random.choice([1, 2, 3, 4, 5, 6], n, p=[0.10, 0.20, 0.28, 0.24, 0.12, 0.06])
tipo_vivienda = np.random.choice(['Casa propia', 'Casa arrendada', 'Cuarto', 'Mediagua'],
                                  n, p=[0.52, 0.26, 0.12, 0.10])
acceso_agua = np.random.choice([0, 1], n,
                                p=np.where(np.array(area) == 'Urbano', [0.05, 0.95], [0.30, 0.70]))

# Ingreso mensual del hogar (USD)
ingreso_base = 200 + anios_educacion * 55
ingreso_area = np.where(np.array(area) == 'Urbano', 180, -90)
ingreso_region = np.where(np.array(region) == 'Sierra', 60, 0)
ingreso_genero = np.where(np.array(genero_jefe) == 'Hombre', 80, -60)
ingreso = (
    ingreso_base + ingreso_area + ingreso_region + ingreso_genero
    + np.random.normal(0, 180, n)
).clip(80, 4500).round(2)

# Gasto mensual hogar
gasto = (ingreso * np.random.uniform(0.65, 0.98, n)).round(2)

# Indicadores derivados
deficit_habitacional = (tipo_vivienda == 'Mediagua').astype(int)
hacinamiento = (miembros_hogar / 3 > 1.5).astype(int)  # simplificado

df = pd.DataFrame({
    'provincia': provincia, 'region': region, 'area': area,
    'genero_jefe': genero_jefe, 'edad_jefe': edad_jefe,
    'anios_educacion': anios_educacion, 'miembros_hogar': miembros_hogar,
    'tipo_vivienda': tipo_vivienda, 'acceso_agua': acceso_agua,
    'ingreso_mensual': ingreso, 'gasto_mensual': gasto,
    'deficit_habitacional': deficit_habitacional,
    'hacinamiento': hacinamiento
})
df['ahorro_mensual'] = df['ingreso_mensual'] - df['gasto_mensual']
df['ingreso_per_capita'] = (df['ingreso_mensual'] / df['miembros_hogar']).round(2)

print("PROYECTO ECV-INEC Ecuador 2024")
print(f"Dataset: {df.shape[0]} hogares, {df.shape[1]} variables")
print(f"\nIngreso promedio mensual hogar: ${df['ingreso_mensual'].mean():.2f}")
print(f"Ingreso mediano mensual hogar: ${df['ingreso_mensual'].median():.2f}")
print(f"Coeficiente Gini (estimado): {1 - 2 * (df['ingreso_mensual'].rank()/n).mean():.3f}")
```

3. EDA completo con visualizaciones:

```python
# DASHBOARD EDA - 6 paneles
fig = plt.figure(figsize=(18, 14))
gs = gridspec.GridSpec(3, 3, figure=fig, hspace=0.45, wspace=0.35)

# Panel 1: Distribucion ingreso (log scale)
ax1 = fig.add_subplot(gs[0, 0])
sns.histplot(df['ingreso_mensual'], bins=40, kde=True, color='#1F2F58', ax=ax1)
ax1.axvline(df['ingreso_mensual'].median(), color='#FBBC0C', ls='--', lw=1.8,
            label=f'Mediana ${df["ingreso_mensual"].median():.0f}')
ax1.set_title('Distribucion de Ingresos')
ax1.set_xlabel('Ingreso Mensual (USD)')
ax1.legend(fontsize=8)

# Panel 2: Ingreso por provincia (boxplot horizontal)
ax2 = fig.add_subplot(gs[0, 1:])
orden = df.groupby('provincia')['ingreso_mensual'].median().sort_values().index
sns.boxplot(data=df, y='provincia', x='ingreso_mensual', order=orden,
            palette='Blues_r', ax=ax2, orient='h')
ax2.set_title('Ingreso por Provincia (mediana ordenada)')
ax2.set_xlabel('Ingreso Mensual (USD)')

# Panel 3: Educacion vs Ingreso
ax3 = fig.add_subplot(gs[1, 0])
edu_grupos = df.groupby('anios_educacion')['ingreso_mensual'].median()
ax3.bar(edu_grupos.index, edu_grupos.values, color='#73B8E7', alpha=0.85)
ax3.set_title('Años Educacion vs Ingreso Mediano')
ax3.set_xlabel('Anos de educacion')
ax3.set_ylabel('Ingreso Mediano (USD)')

# Panel 4: Heatmap correlacion
ax4 = fig.add_subplot(gs[1, 1])
cols_corr = ['edad_jefe', 'anios_educacion', 'miembros_hogar',
             'ingreso_mensual', 'ahorro_mensual', 'ingreso_per_capita']
corr_matrix = df[cols_corr].corr()
sns.heatmap(corr_matrix, annot=True, fmt='.2f', cmap='RdYlBu',
            center=0, ax=ax4, cbar=False, linewidths=0.5, annot_kws={'size': 7})
ax4.set_title('Correlaciones')
ax4.tick_params(axis='x', rotation=45, labelsize=7)
ax4.tick_params(axis='y', rotation=0, labelsize=7)

# Panel 5: Brecha genero por region
ax5 = fig.add_subplot(gs[1, 2])
brecha = df.groupby(['region', 'genero_jefe'])['ingreso_mensual'].mean().unstack()
brecha.plot(kind='bar', ax=ax5, color=['#F0846D', '#1F2F58'], alpha=0.85)
ax5.set_title('Ingreso Promedio por Region y Genero')
ax5.set_xlabel('Region')
ax5.set_ylabel('Ingreso Promedio (USD)')
ax5.tick_params(axis='x', rotation=0)
ax5.legend(title='Genero', fontsize=8)

# Panel 6: Area urbana/rural vs servicios
ax6 = fig.add_subplot(gs[2, 0])
acceso_area = df.groupby('area')['acceso_agua'].mean() * 100
acceso_area.plot(kind='bar', ax=ax6, color=['#FBBC0C', '#1F2F58'], alpha=0.85)
ax6.set_title('Acceso a Agua Potable\npor Area')
ax6.set_ylabel('% Hogares con acceso')
ax6.set_ylim(0, 105)
ax6.tick_params(axis='x', rotation=0)

# Panel 7: Top 10 correlaciones con ingreso
ax7 = fig.add_subplot(gs[2, 1:])
correlaciones_ingreso = df[['anios_educacion', 'miembros_hogar', 'edad_jefe',
                              'acceso_agua', 'deficit_habitacional', 'hacinamiento']].corrwith(
    df['ingreso_mensual']
).sort_values()
colores_corr = ['#F0846D' if x < 0 else '#1F2F58' for x in correlaciones_ingreso]
correlaciones_ingreso.plot(kind='barh', ax=ax7, color=colores_corr, alpha=0.85)
ax7.axvline(0, color='black', linewidth=0.8)
ax7.set_title('Correlacion de Variables con Ingreso Mensual')
ax7.set_xlabel('Coeficiente de correlacion de Pearson')

plt.suptitle('PROYECTO INTEGRADOR: Analisis ECV-INEC Ecuador 2024\n'
             'Python para Ciencia de Datos | ITSEIA Periodo 3',
             fontsize=14, fontweight='bold', y=1.01)
plt.savefig('/tmp/ecv_inec_dashboard.png', dpi=150, bbox_inches='tight')
plt.show()
print("Dashboard guardado en /tmp/ecv_inec_dashboard.png")
```

4. Reporte narrativo de hallazgos:

```python
print("\n" + "="*65)
print("REPORTE DE HALLAZGOS - ECV INEC ECUADOR 2024")
print("="*65)

# 1. Desigualdad de ingresos
p25 = df['ingreso_mensual'].quantile(0.25)
p75 = df['ingreso_mensual'].quantile(0.75)
print(f"\n1. DESIGUALDAD:")
print(f"   P25 (25% mas pobre): ${p25:.2f}/mes")
print(f"   P75 (25% mas rico):  ${p75:.2f}/mes")
print(f"   Ratio P75/P25: {p75/p25:.1f}x — los hogares del cuartil superior")
print(f"   tienen {p75/p25:.1f} veces mas ingreso que los del cuartil inferior")

# 2. Retorno de la educacion
edu_retorno = df.groupby('anios_educacion')['ingreso_mensual'].mean()
retorno = (edu_retorno.iloc[-1] - edu_retorno.iloc[0]) / edu_retorno.iloc[0] * 100
print(f"\n2. RETORNO DE EDUCACION:")
print(f"   Ingreso sin educacion: ${edu_retorno.iloc[0]:.2f}")
print(f"   Ingreso con posgrado: ${edu_retorno.iloc[-1]:.2f}")
print(f"   Diferencia: +{retorno:.0f}%")

# 3. Brecha de genero
brecha_genero = df.groupby('genero_jefe')['ingreso_mensual'].mean()
gap = (brecha_genero['Hombre'] - brecha_genero['Mujer']) / brecha_genero['Hombre'] * 100
print(f"\n3. BRECHA DE GENERO:")
print(f"   Hogares liderados por hombres: ${brecha_genero['Hombre']:.2f}/mes")
print(f"   Hogares liderados por mujeres: ${brecha_genero['Mujer']:.2f}/mes")
print(f"   Brecha: {gap:.1f}% menos ingreso en hogares con jefa femenina")

# 4. Provincia con mayor y menor ingreso
prom_prov = df.groupby('provincia')['ingreso_mensual'].median().sort_values()
print(f"\n4. DISPARIDAD PROVINCIAL:")
print(f"   Provincia mas prospera: {prom_prov.index[-1]} (${prom_prov.iloc[-1]:.2f})")
print(f"   Provincia con menor ingreso: {prom_prov.index[0]} (${prom_prov.iloc[0]:.2f})")
print(f"   Brecha: {prom_prov.iloc[-1]/prom_prov.iloc[0]:.1f}x")
```

## Usa IA para...

> Primero, pide a ChatGPT:
> "Tengo un analisis de datos ECV-INEC Ecuador con estas variables: ingresos, educacion, region, genero. ¿Cuales son las 5 pruebas estadisticas mas importantes que deberia incluir en un EDA completo para presentar al gobierno? Dame el codigo en Python."

> Luego, pide a Claude:
> "Segun mis hallazgos (brecha de genero del 18%, retorno de educacion del 350%, ratio P75/P25 de 3.5x), ¿cuales deberian ser las 3 recomendaciones de politica publica prioritarias para reducir la desigualdad en Ecuador? Apoya cada recomendacion con evidencia internacional."

Documenta ambas respuestas en celdas de Markdown en tu notebook.

## Que aprendiste

- Un proyecto de Ciencia de Datos completo sigue el flujo: carga -> diagnostico -> limpieza -> EDA -> visualizacion -> hallazgos -> recomendaciones.
- `gridspec.GridSpec` permite crear dashboards con paneles de diferentes tamaños en una sola figura.
- `corrwith()` calcula la correlacion de todas las variables con una sola variable objetivo en una linea.
- Los hallazgos estadisticos deben traducirse a lenguaje de negocio/politica publica: "r = -0.31" se convierte en "hogares con hacinamiento tienen 31% menos ingreso correlado".
- El coeficiente de Gini y los ratios de cuartiles son metricas estándar internacionales para comunicar desigualdad.

## Reto extra

Descarga el dataset real de la ECV del INEC desde `ecuadorencifras.gob.ec/condiciones-de-vida-ecv/`. Replica el mismo analisis con datos reales. Identifica las 3 diferencias mas grandes entre tus resultados simulados y los datos reales. ¿Que variables reales no estaban en la simulacion y son importantes para entender la desigualdad en Ecuador?
