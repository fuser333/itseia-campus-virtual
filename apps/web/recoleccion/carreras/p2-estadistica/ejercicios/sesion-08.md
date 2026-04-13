# Ejercicio Sesion 8: Proyecto — Analisis Estadistico Completo con Datos Ecuador

**Materia:** Estadistica Inferencial
**Nivel:** Intermedio
**Herramienta IA:** Claude + ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Integrar todas las tecnicas estadisticas del periodo en un analisis completo de datos reales del Ecuador, desde la exploracion hasta las conclusiones, simulando el flujo de trabajo de un Data Analyst profesional.

## Contexto

El INEC Ecuador realiza anualmente la Encuesta Nacional de Actividades de Ciencia, Tecnologia e Innovacion (ACTI). Para este proyecto usamos un dataset sintetico pero fiel a la estructura INEC: 150 empresas ecuatorianas de distintos sectores y tamaños, con sus inversiones y resultados en tecnologia e IA para 2023.

**Variables del dataset:**
- `empresa_id`: identificador
- `sector`: Manufactura, Servicios, Comercio, TIC, Agroindustria
- `tamano`: Micro (<10 emp), Pequena (10-49), Mediana (50-199), Grande (200+)
- `inversion_tech_usd`: inversion anual en tecnologia (USD)
- `empleados_ti`: numero de empleados en TI
- `usa_ia`: si usa herramientas de IA (Si/No)
- `productividad_delta`: cambio % en productividad ultimo ano
- `exporta`: si exporta sus productos (Si/No)

## Instrucciones

**Parte 1 — Generacion y Exploracion del Dataset**

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from sklearn.linear_model import LinearRegression

np.random.seed(2024)
n = 150

sectores = np.random.choice(['Manufactura','Servicios','Comercio','TIC','Agroindustria'],
                             n, p=[0.25, 0.30, 0.20, 0.15, 0.10])
tamaños = np.random.choice(['Micro','Pequena','Mediana','Grande'],
                            n, p=[0.40, 0.30, 0.20, 0.10])

# Inversion correlacionada con tamano
inv_base = {'Micro': 2000, 'Pequena': 15000, 'Mediana': 80000, 'Grande': 400000}
inversion = np.array([np.random.normal(inv_base[t], inv_base[t]*0.3) for t in tamaños]).clip(500)

# Empleados TI
emp_base = {'Micro': 0.5, 'Pequena': 2, 'Mediana': 8, 'Grande': 35}
empleados_ti = np.array([max(0, int(np.random.normal(emp_base[t], emp_base[t]*0.5))) for t in tamaños])

# Uso de IA (mas probable en TIC y grandes)
prob_ia = np.where(sectores == 'TIC', 0.75,
          np.where(tamaños == 'Grande', 0.60,
          np.where(tamaños == 'Mediana', 0.35, 0.15)))
usa_ia = np.random.binomial(1, prob_ia).astype(bool)

# Productividad
prod = 2 + 0.00005*inversion + 1.5*usa_ia.astype(int) + np.random.normal(0, 2, n)

exporta = np.random.binomial(1, np.where(tamaños.isin(['Grande','Mediana']) if hasattr(tamaños,'isin')
                              else np.isin(tamaños, ['Grande','Mediana']), 0.5, 0.2))

df = pd.DataFrame({
    'sector': sectores,
    'tamano': tamaños,
    'inversion_tech_usd': inversion.round(0),
    'empleados_ti': empleados_ti,
    'usa_ia': usa_ia,
    'productividad_delta': prod.round(2),
    'exporta': exporta.astype(bool)
})

print("=== EXPLORACION INICIAL ===")
print(df.shape)
print(df.dtypes)
print("\n", df.describe().round(2))
```

**Parte 2 — Analisis Descriptivo por Grupo**

```python
print("\n=== INVERSION EN TECH POR TAMANO ===")
print(df.groupby('tamano')['inversion_tech_usd'].agg(['mean','median','std','count']).round(0))

print("\n=== ADOPCION DE IA POR SECTOR ===")
print(df.groupby('sector')['usa_ia'].mean().sort_values(ascending=False).apply(lambda x: f"{x:.1%}"))

print("\n=== PRODUCTIVIDAD: USA IA vs NO USA IA ===")
print(df.groupby('usa_ia')['productividad_delta'].agg(['mean','std','count']).round(3))
```

**Parte 3 — Prueba de Hipotesis: IA mejora la productividad?**

```python
ia_si = df[df['usa_ia']]['productividad_delta']
ia_no = df[~df['usa_ia']]['productividad_delta']

t_stat, p_value = stats.ttest_ind(ia_si, ia_no)
print(f"\n=== T-TEST: IA vs NO-IA ===")
print(f"Media con IA: {ia_si.mean():.3f}%")
print(f"Media sin IA: {ia_no.mean():.3f}%")
print(f"Diferencia: {ia_si.mean() - ia_no.mean():.3f} puntos porcentuales")
print(f"t = {t_stat:.4f}, p = {p_value:.6f}")
print("Conclusion:", "IA MEJORA significativamente la productividad" if p_value < 0.05
      else "No hay evidencia suficiente de mejora")
```

**Parte 4 — ANOVA: Productividad por Sector**

```python
grupos_sector = [df[df['sector']==s]['productividad_delta'] for s in df['sector'].unique()]
f_stat, p_anova = stats.f_oneway(*grupos_sector)
print(f"\n=== ANOVA: Productividad por Sector ===")
print(f"F = {f_stat:.4f}, p = {p_anova:.6f}")
```

**Parte 5 — Regresion: Predecir Productividad**

```python
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder

df_model = df.copy()
df_model['usa_ia_num'] = df_model['usa_ia'].astype(int)
df_model['exporta_num'] = df_model['exporta'].astype(int)

# Variables numericas
X = df_model[['inversion_tech_usd', 'empleados_ti', 'usa_ia_num', 'exporta_num']].copy()
X['log_inversion'] = np.log1p(X['inversion_tech_usd'])
y = df_model['productividad_delta']

from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score

modelo = LinearRegression()
scores = cross_val_score(modelo, X[['log_inversion','empleados_ti','usa_ia_num','exporta_num']], y, cv=5, scoring='r2')
print(f"\n=== REGRESION LINEAL (CV 5-fold) ===")
print(f"R2 promedio: {scores.mean():.3f}")
print(f"R2 std: {scores.std():.3f}")
```

**Parte 6 — Visualizacion Final del Reporte**

```python
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Analisis Estadistico: Adopcion Tecnologica y Productividad — Ecuador 2023 (ACTI-INEC)',
             fontsize=13, fontweight='bold')

# 1. Inversion por tamano
medias = df.groupby('tamano')['inversion_tech_usd'].median()
orden = ['Micro','Pequena','Mediana','Grande']
axes[0,0].bar(orden, [medias.get(t,0) for t in orden], color='#1F2F58')
axes[0,0].set_title('Inversion mediana en tech por tamano de empresa')
axes[0,0].set_ylabel('USD')

# 2. Adopcion IA por sector
adopcion = df.groupby('sector')['usa_ia'].mean().sort_values()
axes[0,1].barh(adopcion.index, adopcion.values*100, color='#FBBC0C')
axes[0,1].set_title('% Empresas que usan IA por sector')
axes[0,1].set_xlabel('%')

# 3. Productividad IA vs No-IA
axes[1,0].boxplot([ia_no, ia_si], labels=['Sin IA', 'Con IA'])
axes[1,0].set_title(f'Productividad delta (p={p_value:.4f})')
axes[1,0].set_ylabel('Cambio % productividad')

# 4. Scatter inversion vs productividad
colors = ['#FBBC0C' if v else '#1F2F58' for v in df['usa_ia']]
axes[1,1].scatter(np.log1p(df['inversion_tech_usd']), df['productividad_delta'],
                   c=colors, alpha=0.6)
axes[1,1].set_title('Log(Inversion) vs Productividad (amarillo=usa IA)')
axes[1,1].set_xlabel('Log(Inversion USD)')
axes[1,1].set_ylabel('Productividad delta %')

plt.tight_layout()
plt.savefig('reporte_estadistico_ecuador_tech_2023.png', dpi=150, bbox_inches='tight')
plt.show()
```

**Parte 7 — Conclusions del Analisis**

Redacta en tus propias palabras (5-7 oraciones):
1. ¿Hay diferencia significativa de productividad entre empresas que usan IA y las que no?
2. ¿Que sectores lideran la adopcion de IA en Ecuador?
3. ¿La inversion en tech predice bien la productividad?
4. ¿Que recomendacion le darias al MINTEL sobre politicas de apoyo a la digitalizacion?

## Usa IA para...

> Usa Claude para redactar el informe ejecutivo:
> "Realice un analisis estadistico completo de la adopcion tecnologica de 150 empresas ecuatorianas (dataset INEC-ACTI). Los resultados clave son: [pega tus resultados]. Ayudame a redactar: (1) un resumen ejecutivo de 3 parrafos para el MINTEL, (2) 3 limitaciones del analisis que debo mencionar, (3) 2 proximas preguntas que este analisis genera y que justificarian una investigacion mas profunda."

> Usa ChatGPT para una segunda opinion:
> "¿Hay algun analisis estadistico que me falte para que este reporte sea mas robusto y creible para un ministerio ecuatoriano?"

## Que aprendiste

- Un **analisis estadistico completo** combina: exploracion → hipotesis → inferencia → modelado → visualizacion → comunicacion.
- Los datos reales son **messy**: valores extremos, distribuciones sesgadas, variables correlacionadas.
- La **comunicacion del analisis** (informe ejecutivo) es tan importante como el analisis mismo.
- Usar **dos herramientas de IA en paralelo** (Claude y ChatGPT) ayuda a obtener perspectivas distintas y detectar puntos ciegos.
- El flujo que practicaste hoy es el flujo diario de un **Data Analyst** en cualquier empresa o entidad publica de Ecuador.

## Reto extra

Descarga el dataset real de la Encuesta ACTI del INEC Ecuador (ecuadorencifras.gob.ec/ciencia-tecnologia-e-innovacion). Replica el mismo analisis con datos reales. ¿Cambian las conclusiones respecto al dataset sintetico? ¿Que encuentras de sorprendente o contraintuitivo? Sube tu notebook a GitHub con un README en ingles (practica para la siguiente materia) y compartelo con tu fraternidad.
