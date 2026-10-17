# Ejercicio Sesion 5: Looker Studio Google

**Materia:** Inteligencia de Negocio y Reporting
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Crear un dashboard en Looker Studio (anteriormente Google Data Studio) conectando Google Sheets como fuente de datos, con graficos interactivos y campos calculados, para reportar metricas de redes sociales de una empresa ecuatoriana.

## Contexto

Looker Studio es la herramienta BI gratuita de Google, ideal para startups y PYMEs ecuatorianas que ya usan Google Workspace. Se conecta nativamente con Google Sheets, BigQuery y Google Analytics. Una agencia de marketing digital en Quito puede tener su dashboard de clientes en Looker Studio en 2 horas sin costo.

## Instrucciones

1. Instala: `pip install pandas gspread google-auth`.

2. Crea cuenta de servicio Google en https://console.cloud.google.com/.

3. Crea el archivo `sesion05_looker_studio_ecuador.py`:

```python
# Looker Studio - ITSEIA BI y Reporting
# Preparar datos para Google Sheets → Looker Studio
# Dataset: metricas redes sociales empresa Ecuador

import pandas as pd
import numpy as np
from datetime import datetime, timedelta, date

np.random.seed(2026)
print("=" * 65)
print("LOOKER STUDIO — REDES SOCIALES ECUADOR")
print("Agencia Marketing Digital")
print("=" * 65)

# ================================================
# GENERAR DATOS: metricas redes sociales
# ================================================
print("\n[1] Generando dataset de redes sociales...")

fechas = pd.date_range("2024-01-01", "2024-12-31")
plataformas = ["Instagram","Facebook","TikTok","LinkedIn","YouTube"]
campanas = ["organico","ads_pagado","colaboraciones","concursos","lanzamiento"]

metricas = []
for fecha in fechas:
    for plat in plataformas:
        # Seguidores base por plataforma (valores realistas Ecuador)
        base_seg = {"Instagram":18500,"Facebook":35000,"TikTok":8200,
                    "LinkedIn":4800,"YouTube":12300}[plat]
        # Crecimiento gradual
        dias = (fecha - date(2024, 1, 1)).days
        seguidores = int(base_seg * (1 + 0.002 * dias))

        # Engagement varia por dia y plataforma
        weekend = 1.3 if fecha.weekday() >= 4 else 1.0
        eng_rate = {"Instagram":0.038,"Facebook":0.022,"TikTok":0.065,
                    "LinkedIn":0.031,"YouTube":0.018}[plat]

        alcance = int(seguidores * np.random.uniform(0.15, 0.35) * weekend)
        impresiones = int(alcance * np.random.uniform(1.2, 2.5))
        me_gusta = int(alcance * eng_rate * np.random.uniform(0.7, 1.3))
        comentarios = int(me_gusta * np.random.uniform(0.05, 0.15))
        compartidos = int(me_gusta * np.random.uniform(0.02, 0.08))
        clicks_web = int(alcance * np.random.uniform(0.01, 0.04)) if plat != "TikTok" else 0

        inversion = 0
        campana = "organico"
        if np.random.random() < 0.15:  # 15% de dias tienen ads
            inversion = round(np.random.uniform(20, 200), 2)
            campana = np.random.choice(["ads_pagado","colaboraciones","lanzamiento"])
            alcance = int(alcance * 1.8)  # ads amplifica alcance

        metricas.append({
            "Fecha":        fecha.strftime("%Y-%m-%d"),
            "Anio":         fecha.year,
            "Mes":          fecha.month,
            "MesNombre":    fecha.strftime("%B"),
            "Semana":       fecha.isocalendar().week,
            "DiaSemana":    fecha.strftime("%A"),
            "EsFinDeSemana":int(fecha.weekday() >= 5),
            "Plataforma":   plat,
            "Campana":      campana,
            "Seguidores":   seguidores,
            "Alcance":      alcance,
            "Impresiones":  impresiones,
            "MeGusta":      me_gusta,
            "Comentarios":  comentarios,
            "Compartidos":  compartidos,
            "ClicksWeb":    clicks_web,
            "InversionUSD": inversion,
        })

df = pd.DataFrame(metricas)

# Campos calculados (se pueden crear en Looker Studio tambien)
df["TasaEngagement"] = ((df["MeGusta"] + df["Comentarios"] + df["Compartidos"]) /
                         df["Alcance"].replace(0, np.nan) * 100).round(3)
df["CPM"] = (df["InversionUSD"] / df["Impresiones"].replace(0, np.nan) * 1000).round(3)
df["CPC"] = (df["InversionUSD"] / df["ClicksWeb"].replace(0, np.nan)).round(3)
df["TasaEngagement"] = df["TasaEngagement"].fillna(0)
df["CPM"] = df["CPM"].fillna(0)
df["CPC"] = df["CPC"].fillna(0)

print(f"  Dataset: {len(df):,} filas x {len(df.columns)} columnas")
print(f"  Rango: {df['Fecha'].min()} al {df['Fecha'].max()}")

# ================================================
# RESUMEN POR PLATAFORMA
# ================================================
print("\n--- METRICAS ANUALES POR PLATAFORMA ---")
resumen = df.groupby("Plataforma").agg(
    alcance_total=("Alcance","sum"),
    engagement_promedio=("TasaEngagement","mean"),
    inversion_total=("InversionUSD","sum"),
    clicks_total=("ClicksWeb","sum"),
).round(2)
resumen["seguidores_fin"] = df.groupby("Plataforma")["Seguidores"].last()
print(resumen.sort_values("alcance_total", ascending=False).to_string())

# ================================================
# EXPORTAR A CSV PARA GOOGLE SHEETS
# ================================================
output_csv = "looker_studio_redes_sociales.csv"
df.to_csv(output_csv, index=False)
print(f"\n  Exportado: {output_csv}")

# ================================================
# EXPORTAR RESUMEN MENSUAL
# ================================================
mensual = df.groupby(["Anio","Mes","MesNombre","Plataforma"]).agg(
    alcance=("Alcance","sum"),
    engagement_avg=("TasaEngagement","mean"),
    me_gusta=("MeGusta","sum"),
    inversion=("InversionUSD","sum"),
    clicks=("ClicksWeb","sum"),
    seguidores_fin=("Seguidores","last")
).reset_index()
mensual.to_csv("looker_studio_mensual.csv", index=False)
print(f"  Exportado: looker_studio_mensual.csv")

# ================================================
# INSTRUCCIONES LOOKER STUDIO
# ================================================
print("\n--- INSTRUCCIONES LOOKER STUDIO ---")
instrucciones = """
1. SUBIR CSV A GOOGLE SHEETS:
   - Google Sheets → Archivo → Importar → looker_studio_redes_sociales.csv
   - Nombrar hoja: "Metricas_RRSS_2024"

2. CREAR INFORME EN LOOKER STUDIO:
   - Ir a: lookerstudio.google.com
   - Crear → Informe en blanco
   - Agregar datos → Google Sheets → seleccionar tu hoja

3. VISUALIZACIONES RECOMENDADAS:

   ENCABEZADO (Tarjetas KPI):
   - Alcance Total: SUM(Alcance)
   - Engagement Promedio: AVG(TasaEngagement)
   - Inversion Total: SUM(InversionUSD)
   - Seguidores Actuales: MAX(Seguidores) con filtro ultima fecha

   CUERPO:
   - Serie temporal: Alcance por mes (lineas por Plataforma)
   - Grafico barras: Comparacion engagement por Plataforma
   - Tabla: Metricas por Plataforma (todas las columnas)
   - Grafico circular: Distribucion inversion por Campana
   - Mapa de calor: TasaEngagement por DiaSemana y Plataforma

4. CAMPOS CALCULADOS EN LOOKER STUDIO:
   - ROI = (ClicksWeb * 2.5 - InversionUSD) / InversionUSD * 100
     (asumiendo valor por click = $2.50)
   - Crecimiento Seguidores = Seguidores - LAG(Seguidores)

5. FILTROS INTERACTIVOS:
   - Control de fecha: rango temporal
   - Lista: filtro por Plataforma
   - Lista: filtro por Campana

6. COMPARTIR:
   - Archivo → Compartir → Obtener enlace
   - Cualquier persona con el enlace puede ver (modo lectura)
"""
print(instrucciones)

# ================================================
# CAMPOS CALCULADOS AVANZADOS
# ================================================
print("--- CAMPOS CALCULADOS AVANZADOS ---")
campos = {
    "TasaConversion":      "(ClicksWeb / Alcance) * 100",
    "CostoPerEngagement":  "InversionUSD / (MeGusta + Comentarios + Compartidos)",
    "ViralCoefficient":    "Compartidos / Alcance * 100",
    "EngagementScore":     "(MeGusta * 1 + Comentarios * 3 + Compartidos * 5) / Alcance",
    "ROAS":                "ClicksWeb * 2.5 / InversionUSD",  # Return on Ad Spend
}
for campo, formula in campos.items():
    print(f"  {campo:<25}: {formula}")

print("\n" + "=" * 65)
print(f"  Archivos listos para Looker Studio: {output_csv}")
print(f"  Metricas generadas: {len(metricas):,} registros")
print("=" * 65)
```

4. Sube el CSV a Google Sheets.

5. Conecta Looker Studio con la hoja de Google Sheets.

6. Crea el informe con al menos 6 visualizaciones segun la especificacion.

## Usa IA para...

> Abre Claude y escribe:
> "Tengo un dataset de redes sociales en Looker Studio con metricas de Instagram, Facebook y TikTok en Ecuador. ¿Como creo un campo calculado que clasifique cada post como 'alto', 'medio' o 'bajo' engagement segun si TasaEngagement > 5%, entre 2-5%, o < 2%? Dame la formula exacta para Looker Studio."

Despues de leer la respuesta:
- Implementa la clasificacion de engagement en Looker Studio.
- Crea una tabla que muestre el conteo de posts por nivel de engagement y plataforma.

## Que aprendiste

- Looker Studio es gratuito y se integra nativamente con Google Sheets y BigQuery.
- Los campos calculados en Looker Studio usan sintaxis similar a SQL: CASE WHEN, SUM, AVG.
- `df.to_csv()` exporta el DataFrame listo para importar en Google Sheets.
- La serie temporal con breakdowns por categoria permite comparar plataformas facilmente.
- El engagement rate (interacciones / alcance) es la metrica mas importante de redes sociales.
- CPM (Costo por Mil Impresiones) y CPC (Costo por Click) miden la eficiencia de la inversion.

## Reto extra

Conecta Looker Studio directamente con la API de Meta (Facebook/Instagram) usando el conector nativo disponible en la galeria de Looker Studio. Crea un dashboard en tiempo real con datos reales de una pagina de empresa ecuatoriana. Compara los numeros reales con los simulados del ejercicio.
