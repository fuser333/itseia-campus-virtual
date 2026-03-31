# Ejercicio Sesion 4: Recoleccion y Limpieza de Datos

**Materia:** Proyecto Integrador (Titulacion)
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 55 min

## Objetivo

Aplicar un pipeline profesional de recoleccion, inspeccion y limpieza de datos usando Python y pandas, documentar cada decision de preprocesamiento con su justificacion, y entregar un dataset listo para modelado con un reporte de calidad de datos que cualquier auditor pueda verificar.

## Contexto (Ecuador)

Los datos de organizaciones ecuatorianas — hospitales del MSP, registros del MAG, bases del SRI — suelen tener problemas tipicos: fechas en formatos mixtos (dd/mm/aaaa y mm/dd/aaaa en el mismo archivo), tildes perdidas, valores como "N/A", "No aplica", "." y "" representando nulos de distintas formas, o codigos de provincia que cambiaron entre censos. Este ejercicio usa un dataset simulado con estos problemas reales para que practiques las soluciones.

## Instrucciones

### Parte 1 — Descarga e inspeccion inicial (10 min)

Primero, genera el dataset de practica con problemas reales ecuatorianos:

```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Semilla para reproducibilidad
random.seed(42)
np.random.seed(42)

# Dataset simulado: citas medicas del MSP Ecuador con problemas reales
n = 5000
provincias = ["Pichincha", "Guayas", "Manabi", "Azuay", "Loja",
               "Imbabura", "Tungurahua", "Chimborazo", "El Oro", "Esmeraldas"]

datos_crudos = {
    # PROBLEMA 1: Fechas en formatos mixtos
    "fecha_cita": [
        random.choice([
            datetime(2023, random.randint(1,12), random.randint(1,28)).strftime("%d/%m/%Y"),
            datetime(2023, random.randint(1,12), random.randint(1,28)).strftime("%Y-%m-%d"),
            datetime(2023, random.randint(1,12), random.randint(1,28)).strftime("%m-%d-%Y"),
        ]) for _ in range(n)
    ],
    # PROBLEMA 2: Valores nulos con multiples representaciones
    "edad": [
        random.choice([
            random.randint(15, 80),
            random.randint(15, 80),
            random.randint(15, 80),
            None, "N/A", "No registra", ".", ""
        ]) for _ in range(n)
    ],
    # PROBLEMA 3: Categoricas con variantes
    "genero": [
        random.choice([
            "M", "F", "Masculino", "Femenino", "masculino", "femenino",
            "MASCULINO", "FEMENINO", None, "No especificado", "NE"
        ]) for _ in range(n)
    ],
    # PROBLEMA 4: Provincia con errores ortograficos
    "provincia": [
        random.choice([
            random.choice(provincias),
            random.choice(provincias).upper(),
            "Pichincha", "Pichinca", "Guayas", "Guaias",
            "Manabí", "Manabi", None
        ]) for _ in range(n)
    ],
    # VARIABLE OBJETIVO (con desbalanceo real — 25% ausentismo)
    "asistio": [1 if random.random() > 0.25 else 0 for _ in range(n)],
    # Variables auxiliares
    "dias_anticipacion": [random.randint(-2, 90) for _ in range(n)],  # incluye negativos (error)
    "numero_citas_previas": [random.randint(0, 50) for _ in range(n)],
    "distancia_km": [round(random.gauss(15, 10), 1) for _ in range(n)],  # puede ser negativo
}

df = pd.DataFrame(datos_crudos)
df.to_csv("datos_citas_msp_crudos.csv", index=False)
print(f"Dataset generado: {df.shape}")
print(df.head())
```

**Inspeccion sistematica (siempre los mismos 8 pasos):**

```python
def inspeccionar_dataset(df: pd.DataFrame, nombre: str = "Dataset") -> dict:
    """Inspeccion estandarizada de cualquier dataset."""
    print(f"\n{'='*60}")
    print(f"INSPECCION: {nombre}")
    print(f"{'='*60}")

    # 1. Forma
    print(f"\n1. FORMA: {df.shape[0]:,} filas x {df.shape[1]} columnas")

    # 2. Tipos de datos
    print(f"\n2. TIPOS DE DATOS:")
    print(df.dtypes.to_string())

    # 3. Valores nulos
    nulos = df.isnull().sum()
    pct_nulos = (nulos / len(df) * 100).round(2)
    print(f"\n3. VALORES NULOS:")
    for col in df.columns:
        if nulos[col] > 0:
            print(f"   {col}: {nulos[col]} ({pct_nulos[col]}%)")

    # 4. Duplicados
    duplicados = df.duplicated().sum()
    print(f"\n4. FILAS DUPLICADAS: {duplicados} ({duplicados/len(df)*100:.1f}%)")

    # 5. Estadisticas descriptivas (solo numericas)
    print(f"\n5. ESTADISTICAS NUMERICAS:")
    print(df.describe().round(2).to_string())

    # 6. Valores unicos por categorica
    print(f"\n6. VALORES UNICOS (categoricas):")
    for col in df.select_dtypes(include=['object']).columns:
        unicos = df[col].nunique()
        print(f"   {col}: {unicos} valores unicos")
        if unicos < 20:
            print(f"      {df[col].value_counts().head(10).to_dict()}")

    return {
        "filas": df.shape[0],
        "columnas": df.shape[1],
        "pct_nulos_promedio": pct_nulos.mean(),
        "duplicados": duplicados
    }

reporte = inspeccionar_dataset(df, "Citas MSP Ecuador - Datos Crudos")
```

### Parte 2 — Limpieza sistematica (25 min)

```python
import re

def limpiar_dataset_msp(df: pd.DataFrame) -> pd.DataFrame:
    """
    Limpieza completa del dataset de citas MSP.
    Cada decision esta documentada con su justificacion.
    """
    df = df.copy()
    reporte_cambios = {}

    # -----------------------------------------------------------
    # PASO 1: ELIMINAR DUPLICADOS
    # Justificacion: Duplicados exactos representan error de ingreso
    # y sesgan el modelo hacia esas observaciones especificas
    # -----------------------------------------------------------
    antes = len(df)
    df = df.drop_duplicates()
    reporte_cambios["duplicados_eliminados"] = antes - len(df)

    # -----------------------------------------------------------
    # PASO 2: ESTANDARIZAR FECHAS
    # Justificacion: Necesitamos extraer features temporales
    # (dia_semana, mes, dias_al_fin_de_mes) para el modelo
    # -----------------------------------------------------------
    def parsear_fecha(fecha_str):
        if pd.isna(fecha_str):
            return pd.NaT
        formatos = ["%d/%m/%Y", "%Y-%m-%d", "%m-%d-%Y", "%d-%m-%Y"]
        for fmt in formatos:
            try:
                return datetime.strptime(str(fecha_str), fmt)
            except ValueError:
                continue
        return pd.NaT

    df["fecha_cita"] = df["fecha_cita"].apply(parsear_fecha)
    df["dia_semana"] = df["fecha_cita"].dt.dayofweek  # 0=lunes, 6=domingo
    df["mes"] = df["fecha_cita"].dt.month
    nulos_fecha = df["fecha_cita"].isna().sum()
    reporte_cambios["fechas_no_parseables"] = nulos_fecha

    # -----------------------------------------------------------
    # PASO 3: LIMPIAR EDAD
    # Justificacion: Reemplazamos representaciones no-estandar de nulo
    # con NaN de numpy para que pandas los detecte correctamente.
    # Luego imputamos con mediana (robusta a outliers) por provincia.
    # -----------------------------------------------------------
    representaciones_nulas = ["N/A", "No registra", ".", "", "nan", "None"]
    df["edad"] = df["edad"].replace(representaciones_nulas, np.nan)
    df["edad"] = pd.to_numeric(df["edad"], errors="coerce")

    # Edades imposibles (negativas o > 120) => NaN
    df.loc[(df["edad"] < 0) | (df["edad"] > 120), "edad"] = np.nan

    # Imputar con mediana por provincia
    df["edad"] = df.groupby("provincia")["edad"].transform(
        lambda x: x.fillna(x.median())
    )
    # Si provincia tambien tiene nulos, imputar con mediana global
    df["edad"] = df["edad"].fillna(df["edad"].median())

    # -----------------------------------------------------------
    # PASO 4: ESTANDARIZAR GENERO
    # Justificacion: Unificar a 2 categorias (M/F) para encoding eficiente.
    # "No especificado" y NaN => moda por provincia.
    # -----------------------------------------------------------
    def estandarizar_genero(valor):
        if pd.isna(valor):
            return np.nan
        valor = str(valor).strip().upper()
        if valor in ["M", "MASCULINO", "HOMBRE", "H"]:
            return "M"
        elif valor in ["F", "FEMENINO", "MUJER"]:
            return "F"
        else:
            return np.nan

    df["genero"] = df["genero"].apply(estandarizar_genero)
    df["genero"] = df["genero"].fillna(df["genero"].mode()[0])

    # -----------------------------------------------------------
    # PASO 5: ESTANDARIZAR PROVINCIAS
    # Justificacion: Eliminar variaciones ortograficas (tildes, mayusculas)
    # Usar distancia de Levenshtein para corregir errores tipograficos
    # -----------------------------------------------------------
    provincias_oficiales = [
        "Pichincha", "Guayas", "Manabi", "Azuay", "Loja",
        "Imbabura", "Tungurahua", "Chimborazo", "El Oro", "Esmeraldas"
    ]

    def normalizar_texto(texto):
        """Quita tildes y pone en minusculas para comparacion."""
        if pd.isna(texto):
            return ""
        reemplazos = {"á":"a", "é":"e", "í":"i", "ó":"o", "ú":"u",
                      "Á":"A", "É":"E", "Í":"I", "Ó":"O", "Ú":"U"}
        for orig, reempl in reemplazos.items():
            texto = texto.replace(orig, reempl)
        return texto.strip().lower()

    prov_norm = {normalizar_texto(p): p for p in provincias_oficiales}

    def mapear_provincia(valor):
        if pd.isna(valor):
            return np.nan
        norm = normalizar_texto(valor)
        if norm in prov_norm:
            return prov_norm[norm]
        # Busqueda aproximada (primeros 5 caracteres)
        for clave, oficial in prov_norm.items():
            if norm[:5] in clave or clave[:5] in norm:
                return oficial
        return np.nan

    df["provincia"] = df["provincia"].apply(mapear_provincia)
    df["provincia"] = df["provincia"].fillna("No especificada")

    # -----------------------------------------------------------
    # PASO 6: CORREGIR VALORES IMPOSIBLES
    # Justificacion: dias_anticipacion negativo = error de registro
    # (no se puede hacer cita en el pasado). Reemplazar con 0.
    # -----------------------------------------------------------
    df.loc[df["dias_anticipacion"] < 0, "dias_anticipacion"] = 0
    df.loc[df["distancia_km"] < 0, "distancia_km"] = df["distancia_km"].abs()

    # Reporte final
    print("REPORTE DE LIMPIEZA:")
    print(f"Filas originales: {antes:,}")
    print(f"Filas finales: {len(df):,}")
    print(f"Cambios realizados: {reporte_cambios}")
    print(f"\nCalidad final: {(1 - df.isnull().sum().sum() / (len(df) * len(df.columns))) * 100:.1f}%")

    return df

df_limpio = limpiar_dataset_msp(df)
df_limpio.to_csv("datos_citas_msp_limpio.csv", index=False)
print("\nDataset limpio guardado.")
```

### Parte 3 — Analisis exploratorio rapido (15 min)

```python
import matplotlib.pyplot as plt
import seaborn as sns

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
fig.suptitle("EDA — Dataset Citas MSP Ecuador", fontsize=16)

# 1. Distribucion de la variable objetivo
ax1 = axes[0, 0]
df_limpio["asistio"].value_counts().plot(kind="bar", ax=ax1, color=["#2ecc71", "#e74c3c"])
ax1.set_title(f"Balance de clases (asistio vs no)")
ax1.set_xlabel("")
ax1.set_xticklabels(["Si asistio", "No asistio"], rotation=0)

# 2. Ausentismo por provincia
ax2 = axes[0, 1]
ausentismo_prov = df_limpio.groupby("provincia")["asistio"].apply(
    lambda x: (1 - x.mean()) * 100
).sort_values(ascending=True)
ausentismo_prov.plot(kind="barh", ax=ax2, color="#3498db")
ax2.set_title("% Ausentismo por Provincia")

# 3. Ausentismo por dia de semana
ax3 = axes[0, 2]
dias = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
df_limpio.groupby("dia_semana")["asistio"].mean().plot(
    kind="bar", ax=ax3, color="#9b59b6"
)
ax3.set_title("Tasa de asistencia por dia")
ax3.set_xticklabels(dias[:len(df_limpio["dia_semana"].unique())], rotation=45)

# 4. Distribucion de edad
ax4 = axes[1, 0]
df_limpio["edad"].hist(bins=30, ax=ax4, color="#f39c12", edgecolor="white")
ax4.set_title("Distribucion de edad")

# 5. Dias anticipacion vs asistencia
ax5 = axes[1, 1]
df_limpio.boxplot(column="dias_anticipacion", by="asistio", ax=ax5)
ax5.set_title("Dias anticipacion por clase")
plt.sca(ax5)
plt.xticks([1, 2], ["No asistio", "Si asistio"])

# 6. Correlacion heatmap
ax6 = axes[1, 2]
numericas = df_limpio.select_dtypes(include=[np.number]).columns
corr = df_limpio[numericas].corr()
sns.heatmap(corr, ax=ax6, annot=True, fmt=".2f", cmap="coolwarm", center=0)
ax6.set_title("Correlacion entre variables")

plt.tight_layout()
plt.savefig("eda_msp.png", dpi=150, bbox_inches="tight")
print("EDA guardado en eda_msp.png")
```

### Parte 4 — Documento de calidad de datos (5 min)

Genera automaticamente el reporte de calidad:

```python
def generar_reporte_calidad(df_original, df_limpio, nombre_proyecto):
    """Genera reporte de calidad de datos en formato markdown."""
    reporte = f"""
# Reporte de Calidad de Datos
**Proyecto:** {nombre_proyecto}
**Fecha:** {datetime.now().strftime("%Y-%m-%d")}

## Resumen Ejecutivo
| Metrica | Original | Limpio | Mejora |
|---|---|---|---|
| Filas | {len(df_original):,} | {len(df_limpio):,} | {(len(df_limpio)/len(df_original)*100):.1f}% retencion |
| Columnas | {df_original.shape[1]} | {df_limpio.shape[1]} | +{df_limpio.shape[1]-df_original.shape[1]} nuevas features |
| % Nulos promedio | {df_original.isnull().sum().sum()/(df_original.shape[0]*df_original.shape[1])*100:.1f}% | {df_limpio.isnull().sum().sum()/(df_limpio.shape[0]*df_limpio.shape[1])*100:.1f}% | |

## Decisiones de Preprocesamiento Documentadas
[Lista cada decision con su justificacion]
"""
    with open(f"reporte_calidad_{nombre_proyecto}.md", "w", encoding="utf-8") as f:
        f.write(reporte)
    print(f"Reporte guardado.")

generar_reporte_calidad(df, df_limpio, "Prediccion_Ausentismo_MSP")
```

## Usa IA para...

- Pedirle a Claude que revise tu funcion de limpieza y señale casos edge que no consideraste (ej: que pasa con edades como 0 o 999?).
- Preguntarle como manejar variables con mas de 50% de nulos: imputar o descartar la variable?
- Pedirle que genere 5 features derivadas adicionales que podrian mejorar el poder predictivo del modelo para tu problema especifico.

## Que aprendiste

- Que el "data wrangling" consume el 60-80% del tiempo de un proyecto de ML — no es glamoroso pero es critico.
- Que cada decision de limpieza debe documentarse con su justificacion, no hacerse mecanicamente.
- Como usar `ColumnTransformer` de sklearn para crear pipelines de preprocesamiento reproducibles.
- Que el EDA inicial no es opcional — revela problemas que el pipeline automatico no detecta.

## Reto extra

Aplica el mismo pipeline de limpieza a un dataset REAL descargado del INEC, MSP o MAG. Documenta todos los problemas adicionales que encontraste que no estaban en el dataset simulado. Crea un "diccionario de datos" con una fila por variable, describiendo: nombre, tipo, descripcion, rango valido, y como se manejo cada problema de calidad.
