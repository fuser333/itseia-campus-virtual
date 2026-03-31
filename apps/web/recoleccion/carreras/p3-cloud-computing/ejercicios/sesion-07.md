# Ejercicio Sesion 7: Deploy Basico — Streamlit Cloud y Vercel

**Materia:** Cloud Computing para IA
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 50 min

## Objetivo

Desplegar una aplicacion de Machine Learning completamente funcional en Streamlit Cloud (gratis) como demo interactivo para clientes y una API REST con FastAPI en Vercel, convirtiendo un modelo Python en un producto accesible desde cualquier navegador del mundo.

## Contexto

Un modelo de ML que solo vive en un notebook de Google Colab no tiene valor de negocio: nadie lo puede usar. El deploy es la etapa que convierte el trabajo del Data Scientist en un producto real. En Ecuador, empresas como ImagemIA desplegaron sus primeras demos en Streamlit antes de invertir en infraestructura AWS. Streamlit Cloud ofrece hosting gratuito ilimitado para apps publicas. Vercel permite desplegar APIs FastAPI gratis con SSL automatico. Juntos, estos dos servicios permiten a un estudiante de ITSEIA tener una app de IA en produccion sin gastar un sol.

## Instrucciones

1. Abre Google Colab y crea `sesion07_deploy.ipynb` para el codigo de referencia.

2. Prepara el modelo y la app Streamlit:

```python
# Cloud Computing para IA - Sesion 7: Deploy con Streamlit y Vercel
# ITSEIA - Periodo 3

# ============================================================
# PARTE A: APP STREAMLIT PARA MODELO DE DESERCION ESTUDIANTIL
# ============================================================

# Este codigo va en un ARCHIVO SEPARADO: app_desercion.py
# NO en el notebook - crea este archivo en tu computadora o repo de GitHub

codigo_streamlit = '''
# app_desercion.py
# Deploy: streamlit.io/cloud (gratis)
# Requiere: requirements.txt con streamlit, scikit-learn, pandas, joblib

import streamlit as st
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib

# Configuracion de la pagina
st.set_page_config(
    page_title="Prediccion Desercion Estudiantil - ITSEIA",
    page_icon="🎓",
    layout="centered"
)

# Titulo y descripcion
st.title("Prediccion de Riesgo de Desercion Estudiantil")
st.markdown("""
**Instituto Ecuatoriano de Inteligencia Artificial (ITSEIA)**

Esta herramienta usa Machine Learning para identificar estudiantes
con riesgo de desercion universitaria, basada en datos del SENESCYT Ecuador.

*Powered by Random Forest - Periodo 3 ITSEIA*
""")

st.divider()

# Seccion de inputs
st.header("Datos del Estudiante")

col1, col2 = st.columns(2)

with col1:
    promedio_sem1 = st.slider(
        "Promedio Semestre 1 (0-10)",
        min_value=0.0, max_value=10.0, value=7.0, step=0.1
    )
    materias_reprobadas = st.number_input(
        "Materias Reprobadas",
        min_value=0, max_value=6, value=0
    )
    asistencia = st.slider(
        "Asistencia (%)",
        min_value=30, max_value=100, value=80
    )

with col2:
    trabaja = st.checkbox("El estudiante trabaja?", value=False)
    horas_trabajo = 0
    if trabaja:
        horas_trabajo = st.slider(
            "Horas semanales trabajadas",
            min_value=10, max_value=50, value=20
        )
    beca = st.checkbox("Tiene beca?", value=False)
    vive_familia = st.checkbox("Vive con familia?", value=True)

nota_bachillerato = st.slider(
    "Nota de Bachillerato (1-10)",
    min_value=4.0, max_value=10.0, value=7.5, step=0.1
)

# Boton de prediccion
if st.button("CALCULAR RIESGO DE DESERCION", type="primary", use_container_width=True):

    # Preparar features
    features = {
        'promedio_sem1': promedio_sem1,
        'materias_reprobadas_sem1': materias_reprobadas,
        'asistencia_pct': asistencia,
        'trabaja': int(trabaja),
        'carga_laboral': horas_trabajo * int(trabaja),
        'beca': int(beca),
        'vive_con_familia': int(vive_familia),
        'nota_bachillerato': nota_bachillerato
    }

    # Modelo simulado (en produccion carga joblib.load("modelo_rf.pkl"))
    np.random.seed(int(promedio_sem1 * 10 + materias_reprobadas * 7))
    prob_desercion = max(0.05, min(0.95,
        0.8 - 0.06 * promedio_sem1
        + 0.12 * materias_reprobadas
        - 0.008 * asistencia
        + 0.15 * int(trabaja)
        - 0.15 * int(beca)
        - 0.08 * int(vive_familia)
        + np.random.normal(0, 0.03)
    ))

    # Mostrar resultado
    st.divider()
    st.subheader("Resultado de la Prediccion")

    if prob_desercion > 0.65:
        nivel = "ALTO RIESGO"
        color = "red"
        accion = "Asignacion inmediata de tutor academico y apoyo economico"
    elif prob_desercion > 0.35:
        nivel = "RIESGO MEDIO"
        color = "orange"
        accion = "Seguimiento mensual y sesion de orientacion vocacional"
    else:
        nivel = "BAJO RIESGO"
        color = "green"
        accion = "Monitoreo trimestral estandar"

    col_res1, col_res2 = st.columns(2)
    with col_res1:
        st.metric("Probabilidad de Desercion", f"{prob_desercion:.1%}")
    with col_res2:
        st.metric("Nivel de Riesgo", nivel)

    if color == "red":
        st.error(f"NIVEL: {nivel}")
    elif color == "orange":
        st.warning(f"NIVEL: {nivel}")
    else:
        st.success(f"NIVEL: {nivel}")

    st.info(f"Accion recomendada: {accion}")

    # Gauge visual con progress bar
    st.subheader("Indicador de Riesgo")
    st.progress(float(prob_desercion))

    # Factores de riesgo
    st.subheader("Factores Detectados")
    factores = []
    if promedio_sem1 < 6.5: factores.append("Promedio bajo (< 6.5)")
    if materias_reprobadas > 0: factores.append(f"{materias_reprobadas} materias reprobadas")
    if asistencia < 70: factores.append(f"Asistencia baja ({asistencia}%)")
    if trabaja and horas_trabajo > 30: factores.append(f"Carga laboral alta ({horas_trabajo}h/semana)")
    if not beca: factores.append("Sin beca (factor economico)")
    if not vive_familia: factores.append("Lejos de familia (factor social)")

    if factores:
        for f in factores:
            st.write(f"- {f}")
    else:
        st.write("No se detectaron factores de riesgo significativos.")

st.divider()
st.caption("ITSEIA - Instituto Ecuatoriano de Inteligencia Artificial | itseia.ai")
'''

print("Codigo app_desercion.py generado")
print("="*55)
print("PASOS PARA DEPLOYEN STREAMLIT CLOUD:")
print("="*55)
pasos_streamlit = [
    "1. Crea cuenta en github.com (si no tienes)",
    "2. Crea repositorio nuevo: itseia-desercion-app",
    "3. Sube 2 archivos:",
    "   - app_desercion.py (el codigo de arriba)",
    "   - requirements.txt con: streamlit pandas numpy scikit-learn joblib",
    "4. Ve a share.streamlit.io",
    "5. 'New app' -> conecta con GitHub -> selecciona el repo",
    "6. Main file path: app_desercion.py",
    "7. Click 'Deploy!' -> espera 2-3 minutos",
    "8. Tu URL sera: https://[tu-usuario]-itseia-desercion-app-[hash].streamlit.app"
]
for paso in pasos_streamlit:
    print(f"  {paso}")
```

3. API con FastAPI para Vercel:

```python
# ============================================================
# PARTE B: API FastAPI PARA VERCEL
# ============================================================

codigo_fastapi = '''
# api/index.py
# Deploy: vercel.com (gratis con SSL automatico)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import numpy as np

app = FastAPI(
    title="ITSEIA ML API",
    description="API de prediccion de desercion estudiantil - Ecuador",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

class DatosEstudiante(BaseModel):
    promedio_sem1: float
    materias_reprobadas: int
    asistencia_pct: float
    trabaja: bool
    horas_trabajo: Optional[int] = 0
    beca: bool
    vive_con_familia: bool
    nota_bachillerato: float

class ResultadoPrediccion(BaseModel):
    probabilidad_desercion: float
    nivel_riesgo: str
    accion_recomendada: str
    factores_riesgo: list

@app.get("/")
def root():
    return {
        "servicio": "ITSEIA ML API",
        "version": "1.0.0",
        "endpoints": ["/predict", "/health", "/docs"]
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "modelo": "RandomForest v1", "pais": "Ecuador"}

@app.post("/predict", response_model=ResultadoPrediccion)
def predecir(datos: DatosEstudiante):
    # Calculo del riesgo (aqui cargarias el modelo .pkl real)
    prob = max(0.05, min(0.95,
        0.8 - 0.06 * datos.promedio_sem1
        + 0.12 * datos.materias_reprobadas
        - 0.008 * datos.asistencia_pct
        + 0.15 * int(datos.trabaja)
        - 0.15 * int(datos.beca)
        - 0.08 * int(datos.vive_con_familia)
    ))

    nivel = "alto" if prob > 0.65 else "medio" if prob > 0.35 else "bajo"
    acciones = {
        "alto": "Tutoria urgente + apoyo economico ITSEIA",
        "medio": "Seguimiento mensual + orientacion",
        "bajo": "Monitoreo trimestral estandar"
    }

    factores = []
    if datos.promedio_sem1 < 6.5: factores.append("promedio_bajo")
    if datos.materias_reprobadas > 0: factores.append(f"{datos.materias_reprobadas}_reprobadas")
    if datos.asistencia_pct < 70: factores.append("asistencia_critica")
    if datos.trabaja and datos.horas_trabajo > 30: factores.append("carga_laboral_alta")

    return ResultadoPrediccion(
        probabilidad_desercion=round(prob, 4),
        nivel_riesgo=nivel,
        accion_recomendada=acciones[nivel],
        factores_riesgo=factores
    )
'''

print("Codigo api/index.py generado")
print("\nPASOS PARA DEPLOY EN VERCEL:")
pasos_vercel = [
    "1. Crea cuenta en vercel.com (gratis con GitHub)",
    "2. En tu repo de GitHub, crea carpeta 'api/'",
    "3. Sube: api/index.py (el codigo de arriba)",
    "4. Crea vercel.json en la raiz:",
    '   {"builds": [{"src": "api/index.py", "use": "@vercel/python"}],',
    '    "routes": [{"src": "/(.*)", "dest": "api/index.py"}]}',
    "5. En vercel.com: 'New Project' -> importa tu repo",
    "6. Deploy automatico al hacer git push",
    "7. URL final: https://itseia-ml-api.vercel.app",
    "8. Docs automaticas: https://itseia-ml-api.vercel.app/docs"
]
for paso in pasos_vercel:
    print(f"  {paso}")

# PRUEBA LOCAL (antes del deploy)
print("\nPRUEBA LOCAL DE LA API:")
print("""
# Instalar y correr localmente:
pip install fastapi uvicorn

# Correr:
uvicorn api.index:app --reload --port 8000

# Probar con curl:
curl -X POST "http://localhost:8000/predict" \\
  -H "Content-Type: application/json" \\
  -d '{"promedio_sem1": 5.5, "materias_reprobadas": 2, "asistencia_pct": 65,
       "trabaja": true, "horas_trabajo": 35, "beca": false,
       "vive_con_familia": false, "nota_bachillerato": 7.0}'
""")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo una app Streamlit de prediccion de desercion estudiantil lista para deploy en Streamlit Cloud. ¿Como agrego: 1) autenticacion con usuario y contrasena para que solo ITSEIA pueda acceder, 2) una seccion de graficos historicos de predicciones, 3) exportar el resultado como PDF? Dame el codigo para cada feature."

Despues de leer la respuesta:
- Implementa la autenticacion basica que ChatGPT sugiera.
- Prueba la app localmente con `streamlit run app_desercion.py` antes del deploy.

## Que aprendiste

- **Streamlit** convierte cualquier script Python en una app web interactiva en minutos: no necesitas saber HTML/CSS/JavaScript.
- `st.slider()`, `st.checkbox()`, `st.number_input()` son los componentes de input; `st.metric()`, `st.success()`, `st.error()` son para output.
- **FastAPI** + Pydantic genera documentacion automatica en `/docs` con interfaz interactiva para probar la API sin escribir codigo adicional.
- **Vercel** detecta automaticamente el framework (FastAPI, Next.js, etc) y configura el deploy; un `git push` dispara el deploy automaticamente.
- Streamlit Cloud es gratis para apps publicas y permite hasta 3 apps privadas en el plan gratuito.

## Reto extra

Agrega a tu app Streamlit un boton "Descargar Reporte PDF" que genere un PDF con el resultado de la prediccion, los factores de riesgo y la recomendacion. Usa la libreria `reportlab` o `fpdf2`. El PDF debe tener el logo de ITSEIA y el nombre del estudiante en el encabezado. Sube el codigo actualizado a GitHub y verifica que el deploy en Streamlit Cloud funciona correctamente.
