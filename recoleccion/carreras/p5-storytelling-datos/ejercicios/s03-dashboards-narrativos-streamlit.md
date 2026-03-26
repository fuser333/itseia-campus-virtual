# Ejercicio Sesion 3: Dashboards Narrativos con Streamlit

**Materia:** Storytelling con Datos
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 60 min

## Objetivo

Construir un dashboard narrativo interactivo con Streamlit que no solo visualiza datos sino que guia al usuario a traves de una historia coherente, implementar elementos de diseño que dirigen la atencion, y deployar el dashboard en Streamlit Community Cloud para compartirlo con cualquier persona via URL.

## Contexto (Ecuador)

Los dashboards narrativos son la forma mas efectiva de democratizar el analisis de datos en organizaciones ecuatorianas donde la mayoria de los tomadores de decision no saben Python. Un gerente de operaciones en una empresa en Cuenca puede acceder a un URL en su telefono y ver exactamente que necesita saber para tomar la decision de hoy. Este ejercicio construye esa capacidad.

## Instrucciones

### Parte 1 — Principios de diseño de dashboard narrativo (10 min)

Un dashboard narrativo NO es un dumping de graficos. Tiene estructura:

```
ESTRUCTURA OPTIMA:
1. TITULO + METRICA HERO (el numero mas importante)
2. CONTEXTO (1-2 frases que explican por que importa ese numero)
3. TENDENCIA (como ha cambiado en el tiempo)
4. DESGLOSE (por que dimension importa dividirlo)
5. CORRELACION O CAUSA (que explica los cambios)
6. CONCLUSION + ACCION RECOMENDADA
```

Cada seccion debe poder leerse de arriba abajo en orden, como un articulo de periodico.

### Parte 2 — Construir el dashboard con Streamlit (40 min)

```bash
pip install streamlit plotly pandas requests
```

```python
# dashboard_ecuador.py
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import numpy as np
from datetime import datetime, timedelta

# Configuracion de la pagina
st.set_page_config(
    page_title="Dashboard: Mercado Laboral Tech Ecuador",
    page_icon="🇪🇨",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Paleta de colores ITSEIA
COLORES = {
    "navy": "#1F2F58",
    "yellow": "#FBBC0C",
    "lightblue": "#73B8E7",
    "coral": "#F0846D",
}

# CSS personalizado para narrativa visual
st.markdown("""
<style>
    .metric-hero {
        background: linear-gradient(135deg, #1F2F58, #2A3F6E);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        margin-bottom: 20px;
    }
    .metric-hero h1 { color: #FBBC0C; font-size: 3rem; margin: 0; }
    .metric-hero p { color: #73B8E7; font-size: 1rem; margin: 5px 0 0 0; }
    .insight-box {
        background: #f8f9fa;
        border-left: 4px solid #FBBC0C;
        padding: 15px 20px;
        border-radius: 0 8px 8px 0;
        margin: 15px 0;
    }
    .story-header {
        font-size: 1.1rem;
        color: #1F2F58;
        font-weight: 600;
        margin-bottom: 5px;
    }
</style>
""", unsafe_allow_html=True)

# ============================================================
# DATOS SIMULADOS (REEMPLAZA CON DATOS REALES DEL INEC/BCE)
# ============================================================
@st.cache_data
def cargar_datos():
    np.random.seed(42)

    # Series temporal: empleo tech en Ecuador 2019-2024
    meses = pd.date_range("2019-01", "2024-12", freq="Q")
    empleos_tech = [
        45000 + i * 2500 + np.random.normal(0, 1000)
        for i in range(len(meses))
    ]
    empleos_tech_df = pd.DataFrame({
        "fecha": meses,
        "empleos": empleos_tech,
        "salario_promedio": [800 + i * 30 + np.random.normal(0, 50) for i in range(len(meses))]
    })

    # Por ciudad
    ciudades_df = pd.DataFrame({
        "ciudad": ["Quito", "Guayaquil", "Cuenca", "Ambato", "Loja"],
        "empleos_tech": [18500, 14200, 5800, 2100, 1400],
        "crecimiento_anual": [22, 18, 15, 31, 28],
        "salario_promedio": [1250, 1180, 980, 850, 780]
    })

    # Por sector
    sectores_df = pd.DataFrame({
        "sector": ["Fintech", "E-commerce", "Salud Digital", "AgriTech",
                    "EdTech", "LogisTech", "GovTech", "Otros"],
        "empresas": [145, 89, 67, 53, 48, 41, 29, 128],
        "empleos": [8500, 6200, 4800, 3100, 2900, 2400, 1800, 12300]
    })

    # Brechas de habilidades
    habilidades_df = pd.DataFrame({
        "habilidad": ["Machine Learning", "Data Engineering", "Cloud (AWS/GCP)",
                       "Python Avanzado", "NLP/GenAI", "MLOps", "Data Viz", "SQL"],
        "demanda_empresas": [89, 76, 85, 92, 71, 64, 58, 95],
        "oferta_profesionales": [34, 28, 45, 67, 19, 15, 52, 78]
    })
    habilidades_df["brecha"] = habilidades_df["demanda_empresas"] - habilidades_df["oferta_profesionales"]

    return empleos_tech_df, ciudades_df, sectores_df, habilidades_df

empleos_df, ciudades_df, sectores_df, habilidades_df = cargar_datos()

# ============================================================
# HEADER NARRATIVO
# ============================================================
st.markdown("""
<div class="metric-hero">
    <h1>42,000</h1>
    <p>Profesionales tech activos en Ecuador — 2024</p>
</div>
""", unsafe_allow_html=True)

st.markdown("""
<div class="insight-box">
    <div class="story-header">La historia en una oracion</div>
    Ecuador tiene 42,000 profesionales tech pero las empresas reportan 28,000 vacantes
    sin llenar — la brecha crece al 22% anual mientras la formacion crece al 8%.
</div>
""", unsafe_allow_html=True)

# ============================================================
# SECCION 1: TENDENCIA TEMPORAL
# ============================================================
st.subheader("1. Como hemos llegado hasta aqui")
st.caption("Crecimiento del empleo tecnologico en Ecuador 2019-2024")

fig_trend = go.Figure()
fig_trend.add_trace(go.Scatter(
    x=empleos_df["fecha"],
    y=empleos_df["empleos"],
    fill="tozeroy",
    fillcolor=f"rgba(31, 47, 88, 0.15)",
    line=dict(color=COLORES["navy"], width=3),
    name="Empleos tech"
))

# Anotacion del evento COVID
fig_trend.add_vline(x="2020-03-01", line_dash="dash", line_color=COLORES["coral"],
                     annotation_text="COVID-19")
fig_trend.add_vline(x="2023-01-01", line_dash="dash", line_color=COLORES["yellow"],
                     annotation_text="Boom GenAI")

fig_trend.update_layout(
    height=300,
    margin=dict(l=0, r=0, t=10, b=0),
    plot_bgcolor="white",
    xaxis=dict(showgrid=False),
    yaxis=dict(showgrid=True, gridcolor="#f0f0f0"),
    showlegend=False
)
st.plotly_chart(fig_trend, use_container_width=True)

# ============================================================
# SECCION 2: DESGLOSE GEOGRAFICO
# ============================================================
st.subheader("2. Donde esta la oportunidad")
col1, col2 = st.columns([1.5, 1])

with col1:
    fig_ciudades = px.bar(
        ciudades_df.sort_values("empleos_tech"),
        x="empleos_tech", y="ciudad",
        orientation="h",
        color="crecimiento_anual",
        color_continuous_scale=[[0, COLORES["lightblue"]], [1, COLORES["navy"]]],
        labels={"empleos_tech": "Empleos tech", "crecimiento_anual": "Crecimiento %"},
        title="Empleos por ciudad"
    )
    fig_ciudades.update_layout(height=280, margin=dict(l=0, r=0, t=40, b=0))
    st.plotly_chart(fig_ciudades, use_container_width=True)

with col2:
    st.markdown("""
    <div class="insight-box">
        <div class="story-header">Insight oculto</div>
        Ambato y Loja lideran en CRECIMIENTO (31% y 28% anual) aunque tienen
        menos empresas que Quito. Son los mercados de menor competencia para
        profesionales tech que buscan su primera oportunidad.
    </div>
    """, unsafe_allow_html=True)

# ============================================================
# SECCION 3: LA BRECHA DE HABILIDADES (TENSION)
# ============================================================
st.subheader("3. La brecha que lo explica todo")
st.markdown("""
*Cuánto demandan las empresas vs. cuántos profesionales lo saben hacer*
""")

# Ordenar por brecha
habilidades_sorted = habilidades_df.sort_values("brecha", ascending=False)

fig_brecha = go.Figure()
fig_brecha.add_trace(go.Bar(
    y=habilidades_sorted["habilidad"],
    x=habilidades_sorted["demanda_empresas"],
    name="Demanda empresas (%)",
    orientation="h",
    marker_color=COLORES["coral"],
    opacity=0.9
))
fig_brecha.add_trace(go.Bar(
    y=habilidades_sorted["habilidad"],
    x=habilidades_sorted["oferta_profesionales"],
    name="Profesionales disponibles (%)",
    orientation="h",
    marker_color=COLORES["lightblue"],
    opacity=0.9
))

fig_brecha.update_layout(
    barmode="overlay",
    height=350,
    margin=dict(l=0, r=0, t=10, b=0),
    plot_bgcolor="white",
    xaxis=dict(title="Porcentaje de empresas/profesionales", range=[0, 100]),
    legend=dict(orientation="h", yanchor="bottom", y=1.02)
)
st.plotly_chart(fig_brecha, use_container_width=True)

# ============================================================
# CONCLUSION Y ACCION
# ============================================================
st.divider()
st.subheader("La conclusion y lo que sigue")

col_a, col_b, col_c = st.columns(3)
with col_a:
    st.metric("Brecha en NLP/GenAI", "52 puntos", "+18 en 2024")
with col_b:
    st.metric("Brecha en ML", "55 puntos", "+12 en 2024")
with col_c:
    st.metric("Proyeccion de demanda 2026", "68,000 empleos", "+62% vs 2024")

st.markdown("""
<div class="insight-box">
    <div class="story-header">Llamado a la accion</div>
    Las 3 habilidades con mayor brecha y mayor crecimiento de demanda son:
    <strong>Machine Learning, NLP/GenAI e ingenieria de datos en nube</strong>.
    Un profesional que las domina tiene 8.7 ofertas de trabajo disponibles hoy en Ecuador.
</div>
""", unsafe_allow_html=True)

# Footer
st.caption("Fuentes: INEC ENEMDU 2024, LinkedIn Ecuador Talent Insights, BCE Sector TI")
```

### Parte 3 — Deploy en Streamlit Community Cloud (10 min)

1. Crea un repositorio en GitHub llamado `dashboard-ecuador-tech`
2. Sube el archivo `dashboard_ecuador.py` y un `requirements.txt`:
```
streamlit>=1.32.0
plotly>=5.18.0
pandas>=2.0.0
numpy>=1.24.0
```
3. Ve a share.streamlit.io, conecta tu cuenta de GitHub
4. Selecciona el repositorio y el archivo main
5. El dashboard estara disponible en una URL publica en 3 minutos

## Usa IA para...

- Pedirle a Claude que mejore el CSS del dashboard para que sea mas atractivo visualmente.
- Preguntarle como agregar un selector de provincia en la barra lateral para filtrar todos los graficos simultaneamente.
- Pedirle que genere el texto de los `st.markdown` insight-box con datos reales del INEC para cada seccion.

## Que aprendiste

- Que un dashboard narrativo guia al usuario a traves de una historia: contexto → tension → desglose → conclusion.
- Como usar CSS personalizado en Streamlit para crear elementos visuales que refuerzan la narrativa (colores de alerta, cajas de insight).
- Que el deploy en Streamlit Community Cloud es gratis y permite compartir dashboards con cualquier persona sin instalar nada.
- Que la estructura del dashboard (de arriba abajo) debe contar la historia en el orden correcto.

## Reto extra

Agrega al dashboard un componente de IA generativa: un boton "Generar analisis con IA" que llama a la API de Claude y genera un parrafo de analisis personalizado basado en los filtros seleccionados por el usuario. Por ejemplo, si el usuario filtra por "Guayaquil + ML", Claude genera un analisis especifico de la brecha de ML en Guayaquil con recomendaciones especificas. Muestra el resultado en una caja de texto formateada.
