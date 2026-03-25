# Ejercicio Sesion 8: Proyecto — Dashboard Interactivo con Datos INEC

**Materia:** Visualizacion de Datos
**Nivel:** Intermedio
**Herramienta IA:** Claude + Copilot
**Duracion estimada:** 50 min

## Objetivo

Integrar todas las herramientas del periodo (Matplotlib, Seaborn, Plotly, Streamlit, principios Tufte y storytelling) para construir un dashboard interactivo completo que analice datos reales del INEC Ecuador, listo para presentar como proyecto final de la materia.

## Contexto

Este es el ejercicio integrador del Periodo 3 en Visualizacion de Datos. Debes demostrar que puedes tomar datos reales de una fuente oficial del Ecuador, limpiarlos, explorarlos y comunicarlos a traves de un dashboard profesional que cualquier persona pueda entender y navegar. Es el tipo de entregable que solicitaria una empresa, un ministerio o una ONG contratando a un analista de datos.

## Instrucciones

1. Descarga el dataset. Ve a **datosabiertos.gob.ec** o **anda.inec.gob.ec** y descarga uno de estos datasets (elige el que prefieras):

   - **Opcion A:** "Directorio de Empresas y Establecimientos" (contiene provincia, sector, tamano, ingresos)
   - **Opcion B:** "Encuesta de Superficie y Produccion Agropecuaria" (contiene cultivos, superficie, provincia)
   - **Opcion C:** Usa el dataset generado en la sesion 6 (`ventas_ecuador_2022_2024.csv`) si no puedes descargar

2. Explora el dataset en Google Colab antes de construir el dashboard:

```python
# ITSEIA - Visualizacion de Datos - Sesion 8 (PROYECTO FINAL)
# Dashboard interactivo con datos INEC Ecuador

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# ============================================================
# PASO 1: CARGAR Y EXPLORAR
# ============================================================

# Opcion A: Cargar dataset INEC descargado
# df = pd.read_csv('tu_dataset_inec.csv', encoding='latin-1')

# Opcion C: Usar dataset de sesion 6
from google.colab import drive
# Si tienes el CSV en Drive:
# drive.mount('/content/drive')
# df = pd.read_csv('/content/drive/MyDrive/ventas_ecuador_2022_2024.csv')

# Para este ejercicio, regeneramos el dataset de sesion 6:
np.random.seed(2024)
# [Pegar aqui el codigo de generacion de datos de sesion 6]
# O cargarlo del archivo si ya lo tienes guardado.

# Exploracion inicial
print("=== EXPLORACION INICIAL ===")
print(f"Shape: {df.shape}")
print(f"\nColumnas: {list(df.columns)}")
print(f"\nTipos de datos:\n{df.dtypes}")
print(f"\nValores nulos:\n{df.isnull().sum()}")
print(f"\nEstadisticas:\n{df.describe().round(2)}")
```

3. Limpieza y preparacion:

```python
# ============================================================
# PASO 2: LIMPIEZA
# ============================================================

print("\n=== LIMPIEZA DE DATOS ===")

# Verificar duplicados
duplicados = df.duplicated().sum()
print(f"Duplicados: {duplicados}")
if duplicados > 0:
    df = df.drop_duplicates()
    print(f"Eliminados. Nuevo shape: {df.shape}")

# Convertir fecha si existe
if 'Fecha' in df.columns:
    df['Fecha'] = pd.to_datetime(df['Fecha'])
    df['Anio'] = df['Fecha'].dt.year
    df['Mes_num'] = df['Fecha'].dt.month
    print("Columna Fecha convertida a datetime.")

# Verificar outliers en columna numerica principal
col_num = 'Venta_Total'  # Ajusta segun tu dataset
Q1 = df[col_num].quantile(0.25)
Q3 = df[col_num].quantile(0.75)
IQR = Q3 - Q1
outliers = df[(df[col_num] < Q1 - 1.5*IQR) | (df[col_num] > Q3 + 1.5*IQR)]
print(f"Outliers en {col_num}: {len(outliers)} registros ({len(outliers)/len(df)*100:.1f}%)")

# Estadisticas post-limpieza
print(f"\nDataset listo: {df.shape[0]} filas, {df.shape[1]} columnas")
```

4. Analisis exploratorio con Seaborn:

```python
# ============================================================
# PASO 3: EDA VISUAL
# ============================================================

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Analisis Exploratorio — Dataset Ecuador\nFuente: INEC / Datos propios',
             fontsize=13, color='#1F2F58', fontweight='bold')

# Panel A: Distribucion de variable principal
sns.histplot(df[col_num], ax=axes[0,0], bins=30,
             color='#1F2F58', kde=True, alpha=0.7)
axes[0,0].set_title('Distribucion de valores', fontsize=10, loc='left')
for sp in ['top','right']: axes[0,0].spines[sp].set_visible(False)

# Panel B: Boxplot por categoria
cat_col = 'Categoria'  # Ajusta segun tu dataset
if cat_col in df.columns:
    sns.boxplot(data=df, x=cat_col, y=col_num, ax=axes[0,1],
                palette=['#1F2F58','#73B8E7','#FBBC0C','#F0846D','#2A3F6E'])
    axes[0,1].tick_params(axis='x', rotation=30)
    axes[0,1].set_title(f'{col_num} por {cat_col}', fontsize=10, loc='left')
    for sp in ['top','right']: axes[0,1].spines[sp].set_visible(False)

# Panel C: Heatmap de correlaciones
numericas = df.select_dtypes(include=[np.number])
if len(numericas.columns) > 2:
    corr = numericas.corr()
    mask = np.triu(np.ones_like(corr, dtype=bool))
    sns.heatmap(corr, mask=mask, annot=True, fmt='.2f', cmap='coolwarm',
                center=0, ax=axes[1,0], cbar_kws={'shrink':0.8})
    axes[1,0].set_title('Correlaciones', fontsize=10, loc='left')

# Panel D: Top 5 por categoria geografi ca
geo_col = 'Provincia'
if geo_col in df.columns:
    top5 = df.groupby(geo_col)[col_num].sum().nlargest(5).reset_index()
    axes[1,1].barh(top5[geo_col], top5[col_num], color='#73B8E7')
    axes[1,1].set_title(f'Top 5 {geo_col} por {col_num}', fontsize=10, loc='left')
    for val, prov in zip(top5[col_num], top5[geo_col]):
        axes[1,1].text(val * 0.02, top5[top5[geo_col]==prov].index[0] % 5,
                       f'${val:,.0f}', va='center', fontsize=8, color='#1F2F58')
    for sp in ['top','right']: axes[1,1].spines[sp].set_visible(False)

plt.tight_layout()
plt.savefig('eda_completo_ecuador.png', dpi=150, bbox_inches='tight')
plt.show()
print("EDA guardado.")
```

5. Construye el dashboard Plotly final:

```python
# ============================================================
# PASO 4: DASHBOARD PLOTLY PROFESIONAL
# ============================================================

fig_final = make_subplots(
    rows=2, cols=3,
    subplot_titles=[
        'Evolucion temporal',
        'Distribucion geografica',
        'Composicion por categoria',
        'Rendimiento por vendedor/agente',
        'Tendencia mensual (boxplot)',
        'KPIs: Top 10 records'
    ],
    specs=[
        [{'type':'scatter'}, {'type':'bar'}, {'type':'pie'}],
        [{'type':'bar'}, {'type':'box'}, {'type':'table'}]
    ],
    vertical_spacing=0.15,
    horizontal_spacing=0.08
)

# Paleta ITSEIA
colores_itseia = ['#1F2F58','#73B8E7','#FBBC0C','#F0846D','#2A3F6E','#F9F6E7']

# --- Panel 1,1: Serie temporal ---
if 'Fecha' in df.columns and 'Anio' in df.columns:
    df_tiempo = df.groupby('Fecha')[col_num].sum().reset_index()
    fig_final.add_trace(
        go.Scatter(x=df_tiempo['Fecha'], y=df_tiempo[col_num],
                   mode='lines', line=dict(color='#1F2F58', width=2),
                   name='Tendencia', fill='tozeroy', fillcolor='rgba(31,47,88,0.1)'),
        row=1, col=1
    )

# --- Panel 1,2: Por provincia ---
if 'Provincia' in df.columns:
    df_prov = df.groupby('Provincia')[col_num].sum().nlargest(6).reset_index()
    fig_final.add_trace(
        go.Bar(x=df_prov['Provincia'], y=df_prov[col_num],
               marker_color=colores_itseia[:len(df_prov)],
               name='Por Provincia', text=df_prov[col_num].round(0),
               textposition='outside'),
        row=1, col=2
    )

# --- Panel 1,3: Por categoria (pie) ---
if 'Categoria' in df.columns:
    df_cat = df.groupby('Categoria')[col_num].sum().reset_index()
    fig_final.add_trace(
        go.Pie(labels=df_cat['Categoria'], values=df_cat[col_num],
               marker_colors=colores_itseia[:len(df_cat)],
               hole=0.35, name='Categorias'),
        row=1, col=3
    )

# --- Panel 2,1: Por vendedor ---
if 'Vendedor' in df.columns:
    df_vend = df.groupby('Vendedor')[col_num].sum().reset_index().sort_values(col_num)
    fig_final.add_trace(
        go.Bar(x=df_vend[col_num], y=df_vend['Vendedor'],
               orientation='h', marker_color='#73B8E7',
               name='Por Vendedor'),
        row=2, col=1
    )

# --- Panel 2,2: Distribucion mensual ---
if 'Mes_num' in df.columns:
    meses_nombre = {1:'Ene',2:'Feb',3:'Mar',4:'Abr',5:'May',6:'Jun',
                    7:'Jul',8:'Ago',9:'Sep',10:'Oct',11:'Nov',12:'Dic'}
    df['Mes_Nombre2'] = df['Mes_num'].map(meses_nombre)
    for anio_val in sorted(df['Anio'].unique()):
        df_anio = df[df['Anio']==anio_val]
        fig_final.add_trace(
            go.Box(x=df_anio['Mes_Nombre2'], y=df_anio[col_num],
                   name=str(anio_val), marker_color=colores_itseia[list(sorted(df['Anio'].unique())).index(anio_val) % len(colores_itseia)]),
            row=2, col=2
        )

# --- Panel 2,3: Tabla Top 10 ---
top10 = df.nlargest(10, col_num)
cols_tabla = [c for c in ['Fecha','Provincia','Categoria','Vendedor', col_num] if c in df.columns]
fig_final.add_trace(
    go.Table(
        header=dict(values=cols_tabla, fill_color='#1F2F58',
                    font=dict(color='white', size=11), align='left'),
        cells=dict(values=[top10[c].astype(str) if c == 'Fecha'
                            else top10[c].round(2) if top10[c].dtype == float
                            else top10[c]
                            for c in cols_tabla],
                   fill_color=[['#F9F6E7','white']*10],
                   align='left', font=dict(size=10))
    ),
    row=2, col=3
)

fig_final.update_layout(
    title=dict(text='Dashboard Final — Analisis Datos Ecuador<br><sub>Proyecto Visualizacion de Datos P3 | ITSEIA 2024</sub>',
               font=dict(size=16, color='#1F2F58')),
    height=900,
    template='plotly_white',
    showlegend=False,
    paper_bgcolor='#F9F6E7',
    margin=dict(t=100, b=40)
)

fig_final.show()
fig_final.write_html('proyecto_final_visualizacion_ecuador.html')
print("PROYECTO FINAL guardado como HTML interactivo.")
print("Listo para presentar.")
```

6. Escribe en una celda de texto el **resumen ejecutivo** del dashboard (5-7 oraciones): que datos usaste, que historias encontraste, cuales son los 3 hallazgos mas importantes y una recomendacion de negocio basada en los datos.

## Usa IA para...

> Abre Claude con tu imagen del EDA guardado y escribe:
> "Soy estudiante de ITSEIA. Esta es la exploracion visual de un dataset ecuatoriano [adjunta imagen eda_completo_ecuador.png]. Identifica 3 hallazgos estadisticos importantes que deberia destacar en mi presentacion final. Para cada hallazgo, sugiere un tipo de grafico adicional que lo refuerze."

Implementa al menos uno de los graficos sugeridos por Claude.

## Que aprendiste

- Un proyecto de datos real tiene 4 fases: carga/limpieza, EDA, visualizacion avanzada, comunicacion.
- `make_subplots` con `specs` permite combinar tipos de grafico heterogeneos (scatter, bar, pie, table) en una sola figura.
- `go.Table` integra tablas de datos directamente en un grafico Plotly manteniendo el estilo visual.
- El resumen ejecutivo es tan importante como el codigo: quien toma decisiones no lee codigo.
- Exportar a HTML con `write_html()` crea un entregable listo para compartir sin instalar nada.

## Reto extra

Publica tu dashboard en la web usando **Streamlit Cloud** (share.streamlit.io, gratuito). Convierte el codigo Plotly del proyecto final en una app Streamlit con un sidebar que permita filtrar por anio, provincia y categoria. El link publico de tu dashboard es tu portfolio. Comparte el link en el grupo de WhatsApp con el mensaje: "Mi primer dashboard publico con datos Ecuador: [link]".
