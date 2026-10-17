# Ejercicio Sesion 7: Visualizaciones Interactivas para Web

**Materia:** Storytelling con Datos
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 60 min

## Objetivo

Construir visualizaciones interactivas de alta calidad para web usando Plotly en Python y Chart.js en JavaScript, implementar tecnicas de scrollytelling (narrativa que se revela con el scroll), y deployar visualizaciones de datos ecuatorianos accesibles desde cualquier browser sin instalar nada.

## Contexto (Ecuador)

Las visualizaciones estaticas en PDF son el pasado. Los analistas de datos mas cotizados en el mercado ecuatoriano son los que pueden producir experiencias de datos interactivas que el usuario puede explorar. CARTO, GK.city y organizaciones como CIESPAL buscan activamente profesionales con esta habilidad. Este ejercicio produce piezas de portafolio que demuestran ese nivel.

## Instrucciones

### Parte 1 — Visualizaciones con Plotly (25 min)

Plotly produce graficos interactivos que se pueden embeber en cualquier pagina web.

```python
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np

# DATOS: Empleo y salarios por sector en Ecuador (simulados — reemplaza con INEC)
np.random.seed(42)

sectores_data = {
    "sector": ["Tecnologia", "Finanzas", "Salud", "Educacion", "Construccion",
                "Comercio", "Agro", "Turismo", "Manufactura", "Servicios"],
    "empleados_miles": [42, 85, 120, 180, 95, 320, 380, 67, 140, 210],
    "salario_promedio": [1250, 980, 720, 540, 650, 420, 380, 450, 580, 490],
    "crecimiento_anual": [22, 8, 5, 3, 7, 4, 2, 12, 6, 5],
    "pct_profesional_universitario": [78, 65, 72, 85, 35, 28, 15, 42, 38, 55]
}
df = pd.DataFrame(sectores_data)

# VISUALIZACION 1: Bubble chart — 3 dimensiones en un grafico
fig1 = px.scatter(
    df,
    x="salario_promedio",
    y="crecimiento_anual",
    size="empleados_miles",
    color="pct_profesional_universitario",
    hover_name="sector",
    hover_data={
        "salario_promedio": ":$,.0f",
        "crecimiento_anual": ":.1f%",
        "empleados_miles": ":.0f K empleados",
        "pct_profesional_universitario": ":.0f% universitarios"
    },
    labels={
        "salario_promedio": "Salario promedio (USD/mes)",
        "crecimiento_anual": "Crecimiento de empleos (% anual)",
        "pct_profesional_universitario": "% con titulo universitario"
    },
    title="Mercado Laboral Ecuador 2024: Salario vs Crecimiento por Sector",
    color_continuous_scale=[[0, "#73B8E7"], [0.5, "#FBBC0C"], [1, "#1F2F58"]],
    size_max=60,
    template="plotly_white"
)

# Anotaciones narrativas en el grafico
fig1.add_annotation(
    x=1250, y=22, text="TECNOLOGIA<br>Mejor combinacion<br>salario+crecimiento",
    showarrow=True, arrowhead=2, arrowcolor="#1F2F58",
    font=dict(color="#1F2F58", size=10),
    bgcolor="white", bordercolor="#1F2F58", borderwidth=1
)

fig1.add_shape(type="rect",
    x0=800, y0=8, x1=1400, y1=30,
    fillcolor="rgba(251, 188, 12, 0.1)",
    line=dict(color="#FBBC0C", dash="dot", width=2),
)
fig1.add_annotation(x=1100, y=31, text="ZONA DE OPORTUNIDAD",
    font=dict(color="#FBBC0C", size=11), showarrow=False)

fig1.update_layout(
    height=500,
    font=dict(family="Inter, Arial", size=12),
    title=dict(font=dict(size=16, color="#1F2F58")),
    coloraxis_colorbar=dict(title="% Universitarios")
)

fig1.write_html("bubble_mercado_laboral_ecuador.html")
print("Grafico 1 guardado como HTML interactivo.")

# VISUALIZACION 2: Mapa de Ecuador con datos por provincia
# (Requiere datos de latitudes/longitudes por provincia)
provincias_mapa = {
    "provincia": ["Pichincha", "Guayas", "Manabi", "Azuay", "Loja",
                   "Imbabura", "Tungurahua", "Chimborazo", "El Oro", "Esmeraldas"],
    "lat": [-0.22, -2.19, -1.05, -2.9, -4.0, 0.35, -1.25, -1.65, -3.25, 0.95],
    "lon": [-78.5, -79.9, -80.7, -79.0, -79.2, -78.12, -78.6, -78.65, -79.96, -79.65],
    "tasa_desempleo": [15.2, 18.4, 21.7, 12.8, 16.4, 14.1, 13.8, 17.2, 19.3, 22.1],
    "empleos_tech": [18500, 14200, 2100, 5800, 1400, 2800, 3100, 1900, 1200, 800]
}
df_mapa = pd.DataFrame(provincias_mapa)

fig2 = go.Figure()

# Burbujas proporcionales al numero de empleos tech
fig2.add_trace(go.Scattermapbox(
    lat=df_mapa["lat"],
    lon=df_mapa["lon"],
    mode="markers+text",
    marker=go.scattermapbox.Marker(
        size=df_mapa["empleos_tech"] / 500,
        color=df_mapa["tasa_desempleo"],
        colorscale=[[0, "#2ecc71"], [0.5, "#FBBC0C"], [1, "#e74c3c"]],
        colorbar=dict(title="Tasa Desempleo %"),
        opacity=0.8,
        showscale=True
    ),
    text=df_mapa["provincia"],
    textposition="top center",
    hovertemplate=(
        "<b>%{text}</b><br>"
        "Desempleo: %{marker.color:.1f}%<br>"
        "Empleos tech: %{customdata:,}<br>"
        "<extra></extra>"
    ),
    customdata=df_mapa["empleos_tech"]
))

fig2.update_layout(
    mapbox=dict(
        style="carto-positron",
        center=dict(lat=-1.8, lon=-78.5),
        zoom=5.5
    ),
    title="Ecuador: Desempleo y Empleos Tech por Provincia 2024",
    height=500,
    margin=dict(l=0, r=0, t=40, b=0)
)

fig2.write_html("mapa_ecuador_laboral.html")
print("Mapa interactivo guardado.")

# VISUALIZACION 3: Timeline animado — crecimiento del ecosistema tech
años = list(range(2018, 2025))
empresas_tech = [280, 320, 380, 290, 450, 620, 780, 950]  # Caida en 2020 por COVID

fig3 = go.Figure()
fig3.add_trace(go.Scatter(
    x=años,
    y=empresas_tech,
    mode="lines+markers+text",
    text=[str(v) for v in empresas_tech],
    textposition="top center",
    line=dict(color="#1F2F58", width=3),
    marker=dict(size=10, color=["#73B8E7"]*2 + ["#F0846D"] + ["#73B8E7"]*4,
                 line=dict(color="white", width=2)),
    fill="tozeroy",
    fillcolor="rgba(31, 47, 88, 0.1)"
))

# Anotacion COVID
fig3.add_annotation(x=2020, y=290, text="COVID-19<br>-24% empresas",
    showarrow=True, arrowhead=2, arrowcolor="#F0846D",
    font=dict(color="#F0846D"), bgcolor="white")

# Anotacion ChatGPT
fig3.add_annotation(x=2023, y=780, text="Boom GenAI",
    showarrow=True, arrowhead=2, arrowcolor="#FBBC0C",
    font=dict(color="#FBBC0C"), bgcolor="white")

fig3.update_layout(
    title="Empresas Tech Registradas en Ecuador 2018-2024",
    xaxis_title="Año",
    yaxis_title="Numero de empresas",
    template="plotly_white",
    height=400
)

fig3.write_html("timeline_empresas_tech_ecuador.html")
print("Timeline guardado.")
```

### Parte 2 — Scrollytelling con JavaScript/HTML (25 min)

El scrollytelling es la tecnica donde la historia se revela mientras el usuario hace scroll. Es el formato mas efectivo para data journalism online.

```html
<!-- scrollytelling_ecuador.html -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>La Brecha Tech en Ecuador</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background: #fafafa; }

        /* Estructura scrollytelling */
        .scrolly-container {
            display: flex;
            max-width: 1100px;
            margin: 0 auto;
        }
        .scrolly-steps {
            width: 45%;
            padding: 0 40px;
        }
        .scrolly-sticky {
            width: 55%;
            position: sticky;
            top: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            padding: 20px;
        }
        .step {
            min-height: 80vh;
            display: flex;
            align-items: center;
            opacity: 0.3;
            transition: opacity 0.5s;
        }
        .step.active { opacity: 1; }
        .step-content {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border-left: 4px solid #FBBC0C;
        }
        .step-number {
            font-size: 3rem;
            font-weight: 800;
            color: #1F2F58;
            line-height: 1;
        }
        .step-context {
            font-size: 1rem;
            color: #666;
            margin-top: 10px;
        }
        .chart-container {
            width: 100%;
            background: white;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        h1 {
            font-size: 2.5rem;
            color: #1F2F58;
            text-align: center;
            padding: 60px 20px 20px;
            max-width: 700px;
            margin: 0 auto;
        }
        .lead {
            font-size: 1.2rem;
            text-align: center;
            color: #555;
            max-width: 600px;
            margin: 0 auto 60px;
            padding: 0 20px;
        }
    </style>
</head>
<body>
    <h1>1 de cada 6 jovenes ecuatorianos no encuentra trabajo. Pero hay 28,000 empleos tech sin llenar.</h1>
    <p class="lead">La brecha no es de empleo. Es de habilidades. Esta es la historia que los datos del INEC 2024 revelan.</p>

    <div class="scrolly-container">
        <!-- TEXTO QUE HACE SCROLL -->
        <div class="scrolly-steps">
            <div class="step active" data-step="1">
                <div class="step-content">
                    <div class="step-number">17%</div>
                    <p class="step-context">de jovenes entre 18-25 años en Ecuador no encuentran trabajo en 2024, segun la ENEMDU del INEC. En Manabi, esa cifra llega al 22%.</p>
                </div>
            </div>
            <div class="step" data-step="2">
                <div class="step-content">
                    <div class="step-number">28,000</div>
                    <p class="step-context">plazas de trabajo en el sector tecnologico reportadas como vacantes por empresas ecuatorianas en el mismo periodo. La mayoria en Quito y Guayaquil.</p>
                </div>
            </div>
            <div class="step" data-step="3">
                <div class="step-content">
                    <div class="step-number">$1,250</div>
                    <p class="step-context">es el salario promedio mensual de un profesional tech en Ecuador, 3.4 veces el salario promedio nacional de $368. La mayor brecha salarial por sector del pais.</p>
                </div>
            </div>
            <div class="step" data-step="4">
                <div class="step-content">
                    <div class="step-number">8 años</div>
                    <p class="step-context">es el tiempo estimado para cerrar la brecha tech si la formacion continua al ritmo actual. Si se acelera con programas intensivos como ITSEIA, podria reducirse a 3 años.</p>
                </div>
            </div>
        </div>

        <!-- GRAFICO FIJO -->
        <div class="scrolly-sticky">
            <div class="chart-container">
                <canvas id="miGrafico" height="350"></canvas>
            </div>
        </div>
    </div>

    <script>
    // Datos para el grafico que cambia segun el step
    const datosSteps = {
        1: {
            tipo: "bar",
            labels: ["Guayas", "Manabi", "Pichincha", "Azuay", "Promedio"],
            datos: [18.4, 21.7, 15.2, 12.8, 17.1],
            titulo: "Tasa desempleo juvenil por provincia (%)",
            color: "#F0846D"
        },
        2: {
            tipo: "bar",
            labels: ["Dev Backend", "Data Science", "Cloud", "ML/AI", "DevOps"],
            datos: [6200, 8500, 4800, 5100, 3400],
            titulo: "Vacantes tech por especialidad en Ecuador",
            color: "#1F2F58"
        },
        3: {
            tipo: "bar",
            labels: ["Tech", "Finanzas", "Salud", "Educacion", "Comercio"],
            datos: [1250, 980, 720, 540, 420],
            titulo: "Salario promedio mensual por sector (USD)",
            color: "#FBBC0C"
        },
        4: {
            tipo: "line",
            labels: ["2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"],
            datos: [42000, 52000, 64000, 75000, 88000, 98000, 110000, 120000, 128000],
            titulo: "Proyeccion de profesionales tech en Ecuador",
            color: "#73B8E7"
        }
    };

    let chartActual = null;

    function actualizarGrafico(step) {
        const d = datosSteps[step];
        if (!d) return;

        if (chartActual) chartActual.destroy();

        const ctx = document.getElementById("miGrafico").getContext("2d");
        chartActual = new Chart(ctx, {
            type: d.tipo,
            data: {
                labels: d.labels,
                datasets: [{
                    label: d.titulo,
                    data: d.datos,
                    backgroundColor: d.color + "99",
                    borderColor: d.color,
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: d.titulo,
                        font: { size: 13, family: "Inter, Arial" },
                        color: "#1F2F58"
                    }
                },
                scales: {
                    y: { grid: { color: "#f0f0f0" } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Inicializar con step 1
    actualizarGrafico(1);

    // Intersection Observer para detectar que step esta visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const step = parseInt(entry.target.dataset.step);
                document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
                entry.target.classList.add("active");
                actualizarGrafico(step);
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll(".step").forEach(step => observer.observe(step));
    </script>
</body>
</html>
```

Abre el archivo HTML en un browser y prueba que el grafico cambia mientras haces scroll.

### Parte 3 — Publicar en GitHub Pages (10 min)

1. Crea un repositorio en GitHub llamado `visualizaciones-ecuador`
2. Sube el archivo `scrollytelling_ecuador.html` renombrado como `index.html`
3. Ve a Settings → Pages → Source: Deploy from branch (main)
4. Tu visualizacion estara en: `https://[tu-usuario].github.io/visualizaciones-ecuador/`

## Usa IA para...

- Pedirle a Claude que mejore el HTML del scrollytelling con animaciones CSS en las transiciones de step.
- Preguntarle como agregar tooltips personalizados en los graficos Plotly con informacion adicional de cada punto.
- Pedirle que genere los datos reales del INEC para reemplazar los datos simulados del bubble chart.

## Que aprendiste

- Que Plotly produce graficos interactivos exportables como HTML que funcionan sin ninguna dependencia de servidor.
- Que el scrollytelling es la tecnica mas efectiva para contar historias de datos complejas en formato web.
- Como deployar visualizaciones en GitHub Pages de forma gratuita y compartirlas con una URL publica.
- Que la interactividad (hover, filtros, zoom) aumenta el engagement del usuario con los datos.

## Reto extra

Construye una version movil-first del scrollytelling que funcione perfectamente en un telefono de 375px de ancho. La mayoria del trafico web en Ecuador viene de dispositivos moviles. Implementa un menu de navegacion por dots (puntos de navegacion) para que el usuario pueda saltar entre steps sin hacer scroll extenso. Comparte la URL con 5 personas y registra como interactuaron con la pieza.
