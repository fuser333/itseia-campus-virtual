# Ejercicio Sesion 5: Dashboards con Streamlit

**Materia:** Visualizacion de Datos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 50 min

## Objetivo

Construir una aplicacion web de dashboard interactivo con Streamlit que permita filtrar y explorar indicadores economicos del Ecuador en tiempo real, desplegando graficos Plotly dentro de una interfaz profesional sin necesitar HTML ni JavaScript.

## Contexto

Hasta ahora has creado graficos en Colab que solo tu puedes ver. Streamlit convierte tu codigo Python en una aplicacion web en menos de 10 lineas adicionales. El INEC, el BCE y ministerios del Ecuador presentan reportes estaticos. Una startup de datos podria diferenciarse creando dashboards interactivos para instituciones publicas o empresas privadas. En este ejercicio construyes un dashboard funcional listo para presentar.

## Instrucciones

1. En tu computadora local (no Colab), crea una carpeta `dashboard_ecuador` y dentro el archivo `app.py`. Instala las dependencias:

```bash
pip install streamlit plotly pandas numpy
```

2. Escribe el archivo completo `app.py`:

```python
# ITSEIA - Visualizacion de Datos - Sesion 5
# Dashboard interactivo con Streamlit + Plotly
# Ejecutar con: streamlit run app.py

import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np

# ============================================================
# CONFIGURACION DE PAGINA
# ============================================================
st.set_page_config(
    page_title="Dashboard Ecuador - ITSEIA",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS personalizado con colores ITSEIA
st.markdown("""
<style>
    .main { background-color: #F9F6E7; }
    .stMetric { background-color: white; padding: 10px;
                border-radius: 8px; border-left: 4px solid #1F2F58; }
    h1 { color: #1F2F58 !important; }
    h2 { color: #1F2F58 !important; }
    .sidebar .sidebar-content { background-color: #1F2F58; }
</style>
""", unsafe_allow_html=True)

# ============================================================
# DATOS (simulados con base real Ecuador 2020-2024)
# ============================================================
@st.cache_data  # Cache para no recalcular en cada interaccion
def cargar_datos():
    np.random.seed(42)
    anios = list(range(2020, 2025))
    meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
    provincias = ['Guayas','Pichincha','Azuay','Manabi','El Oro',
                  'Tungurahua','Loja','Imbabura']
    sectores = ['Comercio','Manufactura','Servicios','Agricultura','Construccion']

    # Serie mensual multianio
    filas_serie = []
    for a in anios:
        for m_idx, mes in enumerate(meses):
            filas_serie.append({
                'Anio': a,
                'Mes': mes,
                'Mes_num': m_idx + 1,
                'Fecha': f"{a}-{m_idx+1:02d}",
                'PIB_trim': round(np.random.normal(17500, 800) * (1 + 0.015*(a-2020)), 0),
                'Inflacion': round(max(0, np.random.normal(0.15, 0.08)), 3),
                'Desempleo': round(max(1, np.random.normal(4.2, 1.1) - 0.1*(a-2020)), 1),
                'Remesas_MUSD': round(np.random.normal(400, 30), 1),
                'Exportaciones_MUSD': round(np.random.normal(2000, 200) * (1 + 0.03*(a-2020)), 0)
            })

    # Empleo por provincia y sector
    filas_empleo = []
    for prov in provincias:
        for sect in sectores:
            for a in anios:
                filas_empleo.append({
                    'Provincia': prov,
                    'Sector': sect,
                    'Anio': a,
                    'Empleados': int(np.random.randint(500, 15000))
                })

    return pd.DataFrame(filas_serie), pd.DataFrame(filas_empleo)

df_serie, df_empleo = cargar_datos()

# ============================================================
# SIDEBAR: FILTROS
# ============================================================
st.sidebar.image("https://via.placeholder.com/200x60/1F2F58/FBBC0C?text=ITSEIA",
                 use_column_width=True)
st.sidebar.markdown("## Filtros del Dashboard")

anio_sel = st.sidebar.multiselect(
    "Selecciona anos:",
    options=sorted(df_serie['Anio'].unique()),
    default=[2023, 2024]
)

indicador_sel = st.sidebar.selectbox(
    "Indicador principal:",
    options=['PIB_trim', 'Inflacion', 'Desempleo', 'Remesas_MUSD', 'Exportaciones_MUSD'],
    format_func=lambda x: {
        'PIB_trim': 'PIB Trimestral (M USD)',
        'Inflacion': 'Inflacion (%)',
        'Desempleo': 'Desempleo (%)',
        'Remesas_MUSD': 'Remesas (M USD)',
        'Exportaciones_MUSD': 'Exportaciones (M USD)'
    }[x]
)

provincias_sel = st.sidebar.multiselect(
    "Provincias (grafico empleo):",
    options=sorted(df_empleo['Provincia'].unique()),
    default=['Guayas', 'Pichincha', 'Azuay']
)

# ============================================================
# CONTENIDO PRINCIPAL
# ============================================================
st.title("Dashboard Economico — Ecuador 2020-2024")
st.caption("Fuente: BCE, INEC | Datos referenciales para analisis academico | ITSEIA")

# Filtrar datos
df_filtrado = df_serie[df_serie['Anio'].isin(anio_sel)] if anio_sel else df_serie

# --- METRICAS SUPERIORES ---
col1, col2, col3, col4 = st.columns(4)

ultimo = df_filtrado.iloc[-1] if len(df_filtrado) > 0 else df_serie.iloc[-1]
anterior = df_filtrado.iloc[-13] if len(df_filtrado) > 12 else df_filtrado.iloc[0]

with col1:
    st.metric("PIB Trimestral",
              f"${ultimo['PIB_trim']:,.0f}M",
              delta=f"{((ultimo['PIB_trim']/anterior['PIB_trim'])-1)*100:.1f}% vs año anterior")

with col2:
    st.metric("Inflacion mensual",
              f"{ultimo['Inflacion']:.2f}%",
              delta=f"{ultimo['Inflacion']-anterior['Inflacion']:.3f}pp")

with col3:
    st.metric("Desempleo",
              f"{ultimo['Desempleo']:.1f}%",
              delta=f"{ultimo['Desempleo']-anterior['Desempleo']:.1f}pp",
              delta_color="inverse")

with col4:
    st.metric("Remesas",
              f"${ultimo['Remesas_MUSD']:.0f}M",
              delta=f"{((ultimo['Remesas_MUSD']/anterior['Remesas_MUSD'])-1)*100:.1f}%")

st.markdown("---")

# --- GRAFICO PRINCIPAL: SERIE DE TIEMPO ---
col_izq, col_der = st.columns([2, 1])

with col_izq:
    st.subheader(f"Evolucion: {indicador_sel.replace('_', ' ')}")

    fig_serie = px.line(
        df_filtrado,
        x='Fecha', y=indicador_sel,
        color='Anio',
        color_discrete_sequence=['#1F2F58', '#73B8E7', '#FBBC0C', '#F0846D', '#2A3F6E'],
        markers=True,
        template='plotly_white'
    )
    fig_serie.update_layout(
        height=350,
        hovermode='x unified',
        legend_title='Anio',
        xaxis_title='Periodo',
        margin=dict(t=10, b=40)
    )
    st.plotly_chart(fig_serie, use_container_width=True)

with col_der:
    st.subheader("Distribucion por mes")

    df_box = df_filtrado.groupby('Mes')[indicador_sel].mean().reset_index()
    meses_orden = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
    df_box['Mes'] = pd.Categorical(df_box['Mes'], categories=meses_orden, ordered=True)
    df_box = df_box.sort_values('Mes')

    fig_box = px.bar(df_box, x='Mes', y=indicador_sel,
                     color=indicador_sel,
                     color_continuous_scale='Blues',
                     template='plotly_white')
    fig_box.update_layout(height=350, margin=dict(t=10, b=40), showlegend=False)
    st.plotly_chart(fig_box, use_container_width=True)

# --- EMPLEO POR PROVINCIA Y SECTOR ---
st.markdown("---")
st.subheader("Empleo por Provincia y Sector")

if provincias_sel:
    df_emp_fil = df_empleo[
        (df_empleo['Provincia'].isin(provincias_sel)) &
        (df_empleo['Anio'] == 2024)
    ]

    fig_emp = px.bar(
        df_emp_fil.groupby(['Provincia','Sector'])['Empleados'].sum().reset_index(),
        x='Provincia', y='Empleados',
        color='Sector',
        barmode='stack',
        color_discrete_sequence=['#1F2F58','#73B8E7','#FBBC0C','#F0846D','#2A3F6E'],
        template='plotly_white',
        labels={'Empleados': 'Empleados estimados'}
    )
    fig_emp.update_layout(height=350, hovermode='x')
    st.plotly_chart(fig_emp, use_container_width=True)
else:
    st.info("Selecciona al menos una provincia en el panel izquierdo.")

# --- TABLA RESUMEN ---
st.markdown("---")
st.subheader("Resumen anual")
resumen = df_filtrado.groupby('Anio').agg({
    'PIB_trim': 'mean',
    'Inflacion': 'mean',
    'Desempleo': 'mean',
    'Exportaciones_MUSD': 'sum'
}).round(2).reset_index()
resumen.columns = ['Anio','PIB Trim Prom','Inflacion Prom','Desempleo Prom','Export Total']
st.dataframe(resumen, use_container_width=True, hide_index=True)

st.caption("Dashboard construido con Streamlit + Plotly | ITSEIA — Visualizacion de Datos P3")
```

3. Ejecuta el dashboard:

```bash
streamlit run app.py
```

Se abrira automaticamente en `http://localhost:8501`. Navega por los filtros y verifica que todos los graficos responden.

4. Prueba el comportamiento interactivo:
   - Cambia el indicador en el sidebar y observa como se actualiza el grafico.
   - Deselecciona un ano y verifica el cambio en las metricas.
   - Agrega y quita provincias del filtro de empleo.

5. Responde en un archivo `notas.txt`: ¿Que hace `@st.cache_data`? ¿Por que es importante en un dashboard con datos que no cambian frecuentemente?

## Usa IA para...

> Abre Claude y describe:
> "Tengo un dashboard Streamlit con datos economicos de Ecuador. Quiero agregar un boton de descarga que exporte el dataframe filtrado como CSV. ¿Como lo hago con st.download_button()? Dame el codigo exacto."

Agrega ese boton de descarga al dashboard, justo debajo de la tabla resumen.

## Que aprendiste

- `st.set_page_config()` configura titulo, icono y layout antes de cualquier otro elemento.
- `@st.cache_data` memoriza el resultado de una funcion para no recalcular en cada interaccion del usuario.
- `st.columns()` organiza el layout en columnas, como un sistema de grid.
- `st.metric()` muestra KPIs con delta (variacion) en formato compacto y profesional.
- `st.plotly_chart(fig, use_container_width=True)` integra graficos Plotly responsivos en la app.

## Reto extra

Agrega una cuarta seccion al dashboard llamada "Mapa de calor mensual" que muestre un heatmap con los meses en columnas y los anos en filas, donde el color representa el valor del indicador seleccionado. Usa `px.imshow()`. El resultado debe responder al filtro de indicador del sidebar.
