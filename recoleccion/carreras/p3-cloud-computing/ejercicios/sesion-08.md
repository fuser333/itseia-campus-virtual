# Ejercicio Sesion 8: Proyecto — App ML Desplegada en la Nube

**Materia:** Cloud Computing para IA
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT + Claude
**Duracion estimada:** 50 min

## Objetivo

Construir y desplegar una aplicacion completa de Machine Learning de extremo a extremo: modelo entrenado con datos de Ecuador, API REST con FastAPI, frontend interactivo con Streamlit, modelo guardado en Supabase, y todo desplegado en la nube con URL publica accesible desde cualquier navegador.

## Contexto

Este es el proyecto integrador de Cloud Computing para IA. Reune todo lo del Periodo 3: el modelo Random Forest de ML I, el analisis de datos de Python para Ciencia de Datos, y la infraestructura cloud de este modulo. El resultado es un producto real: una aplicacion web que cualquier coordinador academico de una universidad ecuatoriana puede usar para identificar estudiantes en riesgo de desercion. Este es exactamente el tipo de proyecto que presentarias en una entrevista de trabajo o que venderia ITSEIA como consultoria al Ministerio de Educacion.

## Instrucciones

1. Abre Google Colab y crea `sesion08_proyecto_cloud_ml.ipynb`.

2. ETAPA 1 — Entrenar y serializar el modelo:

```python
# Cloud Computing para IA - Sesion 8: PROYECTO INTEGRADOR
# App ML en la Nube - Ecuador
# ITSEIA - Periodo 3

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
import joblib
import json
import os

np.random.seed(2024)

# Dataset integrador (del proyecto ML I sesion 8)
n = 1000
df = pd.DataFrame({
    'promedio_sem1': np.random.normal(7.0, 1.8, n).clip(0, 10).round(2),
    'materias_reprobadas_sem1': np.random.choice([0, 1, 2, 3], n, p=[0.5, 0.25, 0.15, 0.1]),
    'asistencia_pct': np.random.uniform(50, 100, n).round(1),
    'trabaja': np.random.choice([0, 1], n, p=[0.55, 0.45]),
    'horas_trabajo': np.where(
        np.random.choice([0, 1], n, p=[0.55, 0.45]) == 1,
        np.random.randint(20, 48, n), 0
    ).astype(float),
    'beca': np.random.choice([0, 1], n, p=[0.7, 0.3]),
    'vive_con_familia': np.random.choice([0, 1], n, p=[0.35, 0.65]),
    'nota_bachillerato': np.random.normal(7.8, 1.2, n).clip(4, 10).round(2),
    'carrera_vocacional': np.random.randint(1, 5, n)
})

# Variable objetivo
prob_desercion = (
    0.8 - 0.06 * df['promedio_sem1']
    + 0.12 * df['materias_reprobadas_sem1']
    - 0.008 * df['asistencia_pct']
    + 0.15 * df['trabaja']
    - 0.15 * df['beca']
    - 0.08 * df['vive_con_familia']
    + np.random.normal(0, 0.08, n)
).clip(0.02, 0.98)

df['deserto'] = (np.random.rand(n) < prob_desercion).astype(int)

# Feature engineering
df['carga_laboral'] = df['horas_trabajo'] * df['trabaja']
df['indice_riesgo_acad'] = df['materias_reprobadas_sem1'] * 2 - df['promedio_sem1']

X = df.drop('deserto', axis=1)
y = df['deserto']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Pipeline completo
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
    ('modelo', RandomForestClassifier(
        n_estimators=150, max_depth=10,
        class_weight='balanced', random_state=42, n_jobs=-1
    ))
])

pipeline.fit(X_train, y_train)

# Metricas
y_pred = pipeline.predict(X_test)
y_prob = pipeline.predict_proba(X_test)[:, 1]
acc = accuracy_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_prob)

print("MODELO ENTRENADO Y LISTO PARA DEPLOY:")
print(f"  Accuracy: {acc:.4f}")
print(f"  AUC-ROC:  {auc:.4f}")
print(classification_report(y_test, y_pred, target_names=['No deserto', 'Deserto']))

# Guardar modelo
os.makedirs('/content/app_desercion', exist_ok=True)
joblib.dump(pipeline, '/content/app_desercion/modelo_rf_v1.pkl')
print("Modelo guardado: /content/app_desercion/modelo_rf_v1.pkl")

# Metadatos del modelo
metadata = {
    'modelo': 'RandomForestClassifier',
    'version': 'v1.0',
    'fecha_entrenamiento': '2024-03-25',
    'accuracy': round(acc, 4),
    'auc_roc': round(auc, 4),
    'n_train': len(X_train),
    'features': X.columns.tolist(),
    'umbral_decision': 0.5,
    'descripcion': 'Prediccion de desercion estudiantil - ITSEIA Ecuador',
    'autor': 'ITSEIA - Periodo 3'
}
with open('/content/app_desercion/metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)
print("Metadata guardada")
```

3. ETAPA 2 — Crear archivos del proyecto:

```python
# Generar todos los archivos del proyecto
print("GENERANDO ARCHIVOS DEL PROYECTO:")

# requirements.txt
requirements = """streamlit>=1.32.0
fastapi>=0.110.0
uvicorn>=0.29.0
scikit-learn>=1.4.0
pandas>=2.0.0
numpy>=1.26.0
joblib>=1.3.0
pydantic>=2.0.0
supabase>=2.0.0
plotly>=5.20.0
"""

# app.py - Streamlit principal
app_streamlit = '''
# app.py - ITSEIA Prediccion Desercion Estudiantil
# Deploy: streamlit.io/cloud (GRATIS)

import streamlit as st
import pandas as pd
import numpy as np
import joblib
import json
import plotly.graph_objects as go

st.set_page_config(
    page_title="ITSEIA - Riesgo de Desercion",
    page_icon="🎓",
    layout="wide"
)

# Cargar modelo (en cloud, el .pkl se sube al mismo repo)
@st.cache_resource
def cargar_modelo():
    try:
        return joblib.load("modelo_rf_v1.pkl")
    except:
        return None  # Modo demo si no hay modelo

@st.cache_data
def cargar_metadata():
    try:
        with open("metadata.json") as f:
            return json.load(f)
    except:
        return {"modelo": "Demo", "accuracy": 0.82, "auc_roc": 0.89}

modelo = cargar_modelo()
meta = cargar_metadata()

# SIDEBAR
with st.sidebar:
    st.image("https://itseia.ai/logo.png", width=120) if False else None
    st.title("ITSEIA")
    st.caption("Instituto Ecuatoriano de Inteligencia Artificial")
    st.divider()
    st.subheader("Info del Modelo")
    st.metric("Accuracy", f"{meta.get('accuracy', 0.82):.1%}")
    st.metric("AUC-ROC", f"{meta.get('auc_roc', 0.89):.3f}")
    st.caption(f"Version: {meta.get('version', 'v1.0')}")
    st.divider()
    st.caption("itseia.ai | +593 95 989 2034")

# MAIN
st.title("Sistema de Alerta Temprana de Desercion")
st.markdown("Identificacion de estudiantes en riesgo basada en Machine Learning - SENESCYT Ecuador")

tab1, tab2 = st.tabs(["Evaluar Estudiante", "Analisis por Cohorte"])

with tab1:
    st.subheader("Datos del Estudiante")
    col1, col2, col3 = st.columns(3)

    with col1:
        promedio = st.slider("Promedio Sem. 1", 0.0, 10.0, 7.0, 0.1)
        reprobadas = st.selectbox("Materias Reprobadas", [0, 1, 2, 3])
        asistencia = st.slider("Asistencia %", 40, 100, 80)

    with col2:
        trabaja = st.toggle("Trabaja actualmente?")
        horas = st.slider("Horas/semana trabajo", 0, 50, 0) if trabaja else 0
        beca = st.toggle("Tiene beca?")

    with col3:
        familia = st.toggle("Vive con familia?", value=True)
        nota_bach = st.slider("Nota Bachillerato", 4.0, 10.0, 7.5, 0.1)
        vocacional = st.selectbox("Afinidad con carrera", [1, 2, 3, 4], index=2,
                                   format_func=lambda x: ["Ninguna","Baja","Media","Alta"][x-1])

    if st.button("EVALUAR RIESGO", type="primary", use_container_width=True):
        datos = pd.DataFrame([{
            "promedio_sem1": promedio, "materias_reprobadas_sem1": reprobadas,
            "asistencia_pct": asistencia, "trabaja": int(trabaja),
            "horas_trabajo": float(horas), "beca": int(beca),
            "vive_con_familia": int(familia), "nota_bachillerato": nota_bach,
            "carrera_vocacional": vocacional,
            "carga_laboral": horas * int(trabaja),
            "indice_riesgo_acad": reprobadas * 2 - promedio
        }])

        if modelo:
            prob = modelo.predict_proba(datos)[0][1]
        else:
            prob = max(0.05, min(0.95, 0.8 - 0.06*promedio + 0.12*reprobadas
                                 - 0.008*asistencia + 0.15*int(trabaja) - 0.15*int(beca)))

        st.divider()
        c1, c2, c3 = st.columns([1, 2, 1])
        with c2:
            fig = go.Figure(go.Indicator(
                mode="gauge+number",
                value=prob * 100,
                domain={"x": [0, 1], "y": [0, 1]},
                title={"text": "Probabilidad de Desercion (%)"},
                gauge={
                    "axis": {"range": [0, 100]},
                    "bar": {"color": "#F0846D" if prob > 0.6 else "#FBBC0C" if prob > 0.35 else "#73B8E7"},
                    "steps": [
                        {"range": [0, 35], "color": "#E8F5E9"},
                        {"range": [35, 65], "color": "#FFF8E1"},
                        {"range": [65, 100], "color": "#FFEBEE"}
                    ],
                    "threshold": {"line": {"color": "#1F2F58", "width": 3}, "value": 60}
                }
            ))
            fig.update_layout(height=300)
            st.plotly_chart(fig, use_container_width=True)

        nivel = "ALTO RIESGO" if prob > 0.65 else "RIESGO MEDIO" if prob > 0.35 else "BAJO RIESGO"
        if prob > 0.65:
            st.error(f"{nivel} - Intervencion inmediata recomendada")
        elif prob > 0.35:
            st.warning(f"{nivel} - Seguimiento mensual recomendado")
        else:
            st.success(f"{nivel} - Monitoreo trimestral estandar")

with tab2:
    st.info("Carga un CSV con multiples estudiantes para analisis masivo")
    archivo = st.file_uploader("Subir archivo CSV", type="csv")
    if archivo:
        df_cohorte = pd.read_csv(archivo)
        st.write(f"Cohorte cargada: {len(df_cohorte)} estudiantes")
        st.dataframe(df_cohorte.head())
'''

# Guardar archivos
for nombre, contenido in [
    ('/content/app_desercion/requirements.txt', requirements),
    ('/content/app_desercion/app.py', app_streamlit)
]:
    with open(nombre, 'w') as f:
        f.write(contenido)
    print(f"Creado: {nombre}")

print("\nARCHIVOS DEL PROYECTO:")
import os
for f in os.listdir('/content/app_desercion'):
    size = os.path.getsize(f'/content/app_desercion/{f}')
    print(f"  {f}: {size/1024:.1f} KB")
```

4. ETAPA 3 — Guia de deploy y arquitectura final:

```python
print("\n" + "="*65)
print("ARQUITECTURA COMPLETA DEL PROYECTO")
print("="*65)

arquitectura = """
ITSEIA - Sistema de Alerta Temprana de Desercion
=================================================

[DATOS]
  INEC/SENESCYT -> Dataset CSV
  Limpieza con Pandas (Sesion 7 Python CdD)
  Almacenado en Google Drive / S3

[MODELO]
  Random Forest (scikit-learn)
  Entrenado en Google Colab
  Serializado con joblib -> modelo_rf_v1.pkl

[BACKEND]
  FastAPI (Python) -> /predict endpoint
  Deploy: Vercel (gratis, SSL automatico)
  URL: https://itseia-api.vercel.app

[BASE DE DATOS]
  Supabase (PostgreSQL Free Tier)
  Tabla: predicciones_ml (feedback loop)
  Tabla: estudiantes (datos maestros)

[FRONTEND]
  Streamlit (Python) -> app.py
  Deploy: Streamlit Cloud (gratis)
  URL: https://itseia-desercion.streamlit.app

[MONITOREO]
  Metricas guardadas en Supabase
  Dashboard en Streamlit Tab 2

COSTO TOTAL MENSUAL: $0 (free tiers de todo)
"""
print(arquitectura)

print("CHECKLIST FINAL ANTES DEL DEPLOY:")
checklist_deploy = [
    ("requirements.txt completo", "Incluye todas las dependencias con version"),
    ("modelo_rf_v1.pkl en el repo", "Subido con git lfs si > 50MB"),
    ("metadata.json con metricas", "Documenta el modelo para el equipo"),
    ("app.py probada localmente", "streamlit run app.py sin errores"),
    ("Secretos de Supabase configurados", "En Streamlit Cloud: App Settings -> Secrets"),
    ("URL de la API actualizada", "El frontend apunta a la API de Vercel correcta"),
    ("Test de carga con 10 usuarios", "La app no falla con uso concurrente"),
    ("README.md en el repo", "Instrucciones para otros colaboradores")
]
for item, detalle in checklist_deploy:
    print(f"  [ ] {item}")
    print(f"       {detalle}")
```

## Usa IA para...

> Primero, pide a ChatGPT:
> "Tengo una app Streamlit de ML para detectar desercion universitaria en Ecuador lista para produccion. ¿Que 5 pruebas de calidad debo hacer antes del deploy en Streamlit Cloud? Incluye pruebas de usabilidad, rendimiento, seguridad y manejo de errores."

> Luego, pide a Claude:
> "Mi app de prediccion de desercion sera usada por coordinadores academicos de ITSEIA Ecuador. ¿Como deberia comunicar la incertidumbre del modelo a usuarios no tecnicos? ¿Es etico usar una probabilidad de ML para tomar decisiones sobre estudiantes? ¿Que salvaguardas legales y eticas necesito?"

Documenta ambas respuestas en tu notebook como la seccion de "Consideraciones de produccion y etica".

## Que aprendiste

- Un proyecto de ML en produccion tiene tres capas: **modelo** (ciencia), **API** (ingenieria) y **frontend** (producto).
- El patron **Pipeline** de scikit-learn encapsula preprocesamiento + modelo en un solo objeto que se serializa completo con `joblib`.
- `@st.cache_resource` es critico en Streamlit para no recargar el modelo en cada interaccion del usuario.
- Un sistema de alerta temprana de desercion es un caso de uso real con impacto social medible: reducir la desercion un 5% en ITSEIA equivale a $120,000 de inversion educativa preservada.
- La **etica del ML** es parte del producto: comunicar incertidumbre, evitar sesgos y dar transparencia al usuario son requisitos de cualquier sistema de IA responsable.

## Reto extra

Agrega un **modo de analisis de cohorte** a tu app: el coordinador sube un CSV con 50 estudiantes, el modelo procesa todos en batch, y la app muestra: (1) distribucion de riesgo como histograma, (2) tabla ordenada por probabilidad de desercion, (3) boton para descargar los 10 de mayor riesgo como Excel con nombre, probabilidad y accion recomendada. Despliega la version actualizada y comparte el URL con un compañero para que pruebe la app.
