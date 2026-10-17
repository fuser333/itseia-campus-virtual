# Ejercicio Sesion 4: Plotly — Graficos Interactivos

**Materia:** Visualizacion de Datos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Crear graficos interactivos con Plotly Express y Plotly Graph Objects que permitan al usuario explorar datos economicos del Ecuador mediante hover, zoom, filtros y animaciones temporales integradas.

## Contexto

Un grafico estatico en un informe PDF es suficiente para una presentacion. Pero en un dashboard web o un analisis exploratorio compartido online, la interactividad cambia todo: el usuario puede hacer zoom en un periodo, ver el valor exacto al pasar el cursor, filtrar por provincia y animar tendencias en el tiempo. Plotly convierte Python en una herramienta de visualizacion web sin necesitar JavaScript.

## Instrucciones

1. Abre Google Colab, crea `sesion04_plotly_interactivo.ipynb` e instala Plotly:

```python
# ITSEIA - Visualizacion de Datos - Sesion 4
# Plotly: graficos interactivos

# Plotly ya viene preinstalado en Colab
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

print("Plotly version:", px.__version__ if hasattr(px, '__version__') else "instalado")
```

2. Prepara datos de exportaciones por provincia Ecuador:

```python
np.random.seed(7)

# Dataset exportaciones por provincia y producto (2022-2024)
provincias = ['Guayas', 'Manabi', 'El Oro', 'Pichincha', 'Esmeraldas',
              'Los Rios', 'Santa Elena', 'Sucumbios']
productos = ['Camaron', 'Banano', 'Cacao', 'Flores', 'Petroleo', 'Atun']

filas = []
for anio in [2022, 2023, 2024]:
    for prov in provincias:
        for prod in productos:
            base = {
                'Guayas': {'Camaron': 1800, 'Atun': 420},
                'El Oro': {'Banano': 950},
                'Pichincha': {'Flores': 680},
                'Sucumbios': {'Petroleo': 1200},
            }.get(prov, {}).get(prod, 100)
            valor = base * (1 + np.random.uniform(-0.1, 0.2)) * (1 + 0.05 * (anio - 2022))
            filas.append({
                'Anio': str(anio),
                'Provincia': prov,
                'Producto': prod,
                'Exportacion_MUSD': round(valor, 1),
                'Empleos_generados': int(valor * np.random.uniform(0.8, 1.5))
            })

df = pd.DataFrame(filas)
print(df.head(10))
print(f"\nTotal filas: {len(df)}")
```

3. Grafico de barras interactivo con Plotly Express:

```python
# Agrupado por provincia y anio
df_prov = df.groupby(['Anio', 'Provincia'])['Exportacion_MUSD'].sum().reset_index()

fig1 = px.bar(
    df_prov,
    x='Provincia',
    y='Exportacion_MUSD',
    color='Anio',
    barmode='group',
    color_discrete_map={'2022': '#1F2F58', '2023': '#73B8E7', '2024': '#FBBC0C'},
    title='Exportaciones por Provincia Ecuador 2022-2024 (Millones USD)',
    labels={'Exportacion_MUSD': 'Exportaciones (M USD)', 'Provincia': 'Provincia'},
    text='Exportacion_MUSD',
    template='plotly_white'
)

fig1.update_traces(texttemplate='$%{text:.0f}M', textposition='outside')
fig1.update_layout(
    font_family='Arial',
    title_font_size=14,
    title_font_color='#1F2F58',
    legend_title='Anio',
    plot_bgcolor='white',
    hoverlabel=dict(bgcolor='#1F2F58', font_color='white')
)

fig1.show()
# En Colab se muestra inline. Tambien puedes guardar:
fig1.write_html('exportaciones_provincias.html')
print("Guardado como HTML interactivo.")
```

4. Grafico de dispersion animado en el tiempo:

```python
# Burbujas: provincia x exportaciones vs empleos, animado por anio
fig2 = px.scatter(
    df.groupby(['Anio','Provincia','Producto']).sum().reset_index(),
    x='Exportacion_MUSD',
    y='Empleos_generados',
    size='Exportacion_MUSD',
    color='Provincia',
    animation_frame='Anio',
    animation_group='Producto',
    hover_name='Producto',
    hover_data=['Provincia'],
    size_max=60,
    range_x=[0, 6000],
    range_y=[0, 9000],
    color_discrete_sequence=px.colors.qualitative.Safe,
    title='Exportaciones vs Empleos por Producto — Ecuador (animado)',
    labels={
        'Exportacion_MUSD': 'Exportaciones (M USD)',
        'Empleos_generados': 'Empleos estimados'
    },
    template='plotly_white'
)

fig2.update_layout(
    title_font_color='#1F2F58',
    hoverlabel=dict(bgcolor='#1F2F58', font_color='white')
)

fig2.show()
fig2.write_html('exportaciones_animado.html')
print("Presiona PLAY en el grafico para ver la animacion por anio.")
```

5. Grafico combinado con `make_subplots` (linea + barra en el mismo panel):

```python
# Tendencia exportaciones totales + participacion camaron
df_total = df.groupby('Anio')['Exportacion_MUSD'].sum().reset_index()
df_camaron = df[df['Producto']=='Camaron'].groupby('Anio')['Exportacion_MUSD'].sum().reset_index()
df_camaron['Participacion_pct'] = (df_camaron['Exportacion_MUSD'] / df_total['Exportacion_MUSD'] * 100).round(1)

fig3 = make_subplots(
    specs=[[{"secondary_y": True}]],
    subplot_titles=["Exportaciones totales vs participacion camaron — Ecuador"]
)

fig3.add_trace(
    go.Bar(x=df_total['Anio'], y=df_total['Exportacion_MUSD'],
           name='Total Exportaciones', marker_color='#1F2F58',
           text=df_total['Exportacion_MUSD'].round(0),
           textposition='outside'),
    secondary_y=False
)

fig3.add_trace(
    go.Scatter(x=df_camaron['Anio'], y=df_camaron['Participacion_pct'],
               name='% Camaron', mode='lines+markers',
               line=dict(color='#FBBC0C', width=3),
               marker=dict(size=10)),
    secondary_y=True
)

fig3.update_yaxes(title_text="Exportaciones (M USD)", secondary_y=False)
fig3.update_yaxes(title_text="Participacion Camaron (%)", secondary_y=True)
fig3.update_layout(
    template='plotly_white',
    hovermode='x unified',
    legend=dict(x=0, y=1.1, orientation='h')
)

fig3.show()
fig3.write_html('exportaciones_camaron_dual.html')
```

6. Observa los 3 graficos interactivos. En una celda de texto responde: ¿Que provincia lidera exportaciones en 2024? ¿Como cambia la participacion del camaron entre 2022 y 2024?

## Usa IA para...

> Abre Claude y escribe:
> "Con Plotly en Python, quiero crear un mapa coropleta de Ecuador mostrando el PIB por provincia. No tengo los datos del GeoJSON de Ecuador. ¿Donde los consigo y como los cargo con Plotly? Dame un ejemplo completo."

Investiga la respuesta y guarda el link al GeoJSON de provincias de Ecuador para el proyecto final.

## Que aprendiste

- `plotly.express` es la API de alto nivel: rapida para casos estandar con una linea de codigo.
- `plotly.graph_objects` da control total sobre cada elemento del grafico.
- `make_subplots` con `secondary_y=True` permite combinar barras y lineas con ejes distintos.
- `animation_frame` en Plotly Express crea animaciones temporales sin codigo adicional.
- `write_html()` exporta el grafico completo como archivo HTML embebible en cualquier pagina web.

## Reto extra

Crea un grafico Plotly de tipo `Sunburst` (anillos concentricos) que muestre la jerarquia: Ecuador > Provincia > Producto > valor de exportacion. Usa los datos del ejercicio. El resultado debe mostrar la composicion de exportaciones en tres niveles de detalle. Guarda como `sunburst_exportaciones.html`.
