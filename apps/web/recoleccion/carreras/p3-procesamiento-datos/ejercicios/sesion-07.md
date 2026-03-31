# Ejercicio Sesion 7: Datos Geoespaciales

**Materia:** Procesamiento de Datos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Procesar y visualizar datos geoespaciales de Ecuador: coordenadas GPS, calculos de distancias, clustering geografico, y mapas coropletcos con GeoPandas y Folium, aplicados a datos de cobertura de servicios, distribucion de empresas y analisis de accesibilidad por canton.

## Contexto

El INEC publica el Censo de Poblacion con coordenadas por canton. El SRI tiene ubicaciones de contribuyentes. Las empresas de logistica en Ecuador necesitan optimizar rutas entre Quito, Guayaquil, Cuenca y Manta. Los datos geoespaciales permiten responder preguntas como: ¿que cantones tienen baja cobertura de banda ancha? ¿donde hay oportunidades de expansion de sucursales bancarias?

## Instrucciones

1. Instala: `pip install geopandas folium shapely`.

2. Crea el archivo `sesion07_geodatos_ecuador.py`:

```python
# Datos Geoespaciales - ITSEIA Procesamiento de Datos
# GeoPandas, Folium, Shapely
# Dataset: cantones Ecuador, empresas, cobertura

import pandas as pd
import numpy as np
import math
from collections import defaultdict

print("=" * 65)
print("DATOS GEOESPACIALES — ECUADOR")
print("=" * 65)

np.random.seed(2026)

# ================================================
# COORDENADAS CIUDADES PRINCIPALES ECUADOR
# ================================================
print("\n--- CIUDADES PRINCIPALES ECUADOR ---")

ciudades_ec = pd.DataFrame({
    "ciudad":     ["Quito","Guayaquil","Cuenca","Santo Domingo","Machala",
                   "Manta","Ambato","Portoviejo","Loja","Riobamba",
                   "Ibarra","Esmeraldas","Latacunga","Orellana","Lago Agrio"],
    "provincia":  ["Pichincha","Guayas","Azuay","Santo Domingo","El Oro",
                   "Manabi","Tungurahua","Manabi","Loja","Chimborazo",
                   "Imbabura","Esmeraldas","Cotopaxi","Orellana","Sucumbios"],
    "lat":        [-0.2295, -2.1894, -2.8974, -0.2543, -3.2581,
                   -0.9677, -1.2490, -1.0546, -3.9931, -1.6635,
                   0.3517,   0.9592, -0.9316, -0.4550, 0.0897],
    "lon":        [-78.5243,-79.8891,-78.9942,-79.1719,-79.9553,
                   -80.7089,-78.6166,-80.4541,-79.2041,-78.6493,
                   -78.1220,-79.6534,-78.6154,-76.9822,-76.8780],
    "poblacion":  [2_781_641, 2_723_665, 636_996, 458_580, 278_179,
                   266_025, 387_309, 337_939, 214_855, 225_741,
                   221_149, 186_480, 182_278, 139_962, 125_600],
    "region":     ["Sierra","Costa","Sierra","Costa","Costa",
                   "Costa","Sierra","Costa","Sierra","Sierra",
                   "Sierra","Costa","Sierra","Amazonia","Amazonia"]
})

print(f"  {len(ciudades_ec)} ciudades cargadas")
print(ciudades_ec[["ciudad","region","poblacion","lat","lon"]].head(8).to_string(index=False))

# ================================================
# CALCULAR DISTANCIAS HAVERSINE
# ================================================
print("\n--- DISTANCIAS HAVERSINE ---")

def distancia_haversine(lat1, lon1, lat2, lon2):
    """
    Calcula distancia en km entre dos puntos GPS.
    Formula Haversine — considera la curvatura de la Tierra.
    """
    R = 6371  # radio Tierra km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat/2)**2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(dlon/2)**2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return round(R * c, 1)

# Distancias desde Quito
quito = ciudades_ec[ciudades_ec["ciudad"] == "Quito"].iloc[0]
ciudades_ec["dist_quito_km"] = ciudades_ec.apply(
    lambda r: distancia_haversine(quito["lat"], quito["lon"], r["lat"], r["lon"]),
    axis=1
)
print("  Distancias desde Quito:")
print(ciudades_ec[["ciudad","dist_quito_km"]].sort_values("dist_quito_km").to_string(index=False))

# Matriz de distancias entre ciudades principales
ciudades_main = ciudades_ec[ciudades_ec["ciudad"].isin(
    ["Quito","Guayaquil","Cuenca","Manta","Ambato"]
)].reset_index(drop=True)

print("\n  Matriz de distancias (km) entre 5 ciudades:")
nombres = ciudades_main["ciudad"].tolist()
header = f"{'':>12}" + "".join(f"{n[:8]:>10}" for n in nombres)
print(f"  {header}")
for _, row1 in ciudades_main.iterrows():
    fila = f"  {row1['ciudad']:>12}"
    for _, row2 in ciudades_main.iterrows():
        d = distancia_haversine(row1["lat"], row1["lon"], row2["lat"], row2["lon"])
        fila += f"{d:>10.0f}"
    print(fila)

# ================================================
# CLUSTERING GEOGRAFICO K-MEANS
# ================================================
print("\n--- CLUSTERING GEOGRAFICO ---")
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Clustering por coordenadas + poblacion
features = ciudades_ec[["lat","lon","poblacion"]].copy()
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
ciudades_ec["cluster"] = kmeans.fit_predict(features_scaled)

NOMBRES_CLUSTER = {0: "Norte-Sierra", 1: "Costa-Centro", 2: "Sur-Amazonia", 3: "Metropolis"}
ciudades_ec["zona"] = ciudades_ec["cluster"].map(
    lambda c: NOMBRES_CLUSTER.get(c, f"Zona-{c}")
)

print("  Clusters geograficos:")
for zona, grupo in ciudades_ec.groupby("zona"):
    ciudades_zona = ", ".join(grupo["ciudad"].tolist())
    print(f"  {zona:<18}: {ciudades_zona}")

# ================================================
# DATOS COBERTURA INTERNET POR CANTON
# ================================================
print("\n--- COBERTURA INTERNET POR CANTON ---")

# Simular datos de cobertura ARCOTEL Ecuador
cantones_cobertura = pd.DataFrame({
    "canton":          ["Quito","Guayaquil","Cuenca","Ambato","Loja",
                        "Riobamba","Ibarra","Manta","Esmeraldas","Orellana"],
    "lat":             [-0.2295,-2.1894,-2.8974,-1.249,-3.9931,
                        -1.6635, 0.3517,-0.9677, 0.9592,-0.4550],
    "lon":             [-78.5243,-79.8891,-78.9942,-78.6166,-79.2041,
                        -78.6493,-78.122,-80.7089,-79.6534,-76.9822],
    "hogares_total":   [850000, 780000, 195000, 112000, 62000,
                        65000, 64000, 77000, 53000, 40000],
    "hogares_internet":[680000, 585000, 136500, 72800, 34100,
                        32500, 35200, 42350, 21200, 10000],
    "tipo_conexion":   ["fibra","fibra","fibra","cable","cable",
                        "cable","cable","cable","adsl","satelite"],
})

cantones_cobertura["cobertura_pct"] = (
    cantones_cobertura["hogares_internet"] /
    cantones_cobertura["hogares_total"] * 100
).round(1)

cantones_cobertura["semaforo"] = cantones_cobertura["cobertura_pct"].apply(
    lambda x: "VERDE" if x >= 70 else ("AMARILLO" if x >= 50 else "ROJO")
)

print("  Cobertura de internet por canton:")
print(cantones_cobertura[["canton","hogares_total","cobertura_pct","tipo_conexion","semaforo"]].to_string(index=False))

# Brecha digital
print(f"\n  Brecha digital:")
baja_cobertura = cantones_cobertura[cantones_cobertura["semaforo"] == "ROJO"]
print(f"  Cantones con cobertura < 50%: {len(baja_cobertura)}")
for _, r in baja_cobertura.iterrows():
    hogares_sin = r["hogares_total"] - r["hogares_internet"]
    print(f"  {r['canton']:<12}: {r['cobertura_pct']}% | {hogares_sin:,} hogares sin internet")

# ================================================
# ANALISIS DE ACCESIBILIDAD: punto mas cercano
# ================================================
print("\n--- ACCESIBILIDAD: HOSPITAL MAS CERCANO ---")

hospitales = pd.DataFrame({
    "nombre":    ["Hospital Eugenio Espejo","Hospital IESS Quito","Hospital Luis Vernaza",
                  "Hospital Teodoro Maldonado","Hospital Jose Carrasco",
                  "Hospital Enrique Garces","Hospital Isidro Ayora"],
    "ciudad":    ["Quito","Quito","Guayaquil","Guayaquil","Cuenca","Quito","Loja"],
    "lat":       [-0.2034,-0.2210,-2.1754,-2.1982,-2.8918,-0.2697,-4.0049],
    "lon":       [-78.4886,-78.4962,-79.8854,-79.8900,-78.9875,-78.5557,-79.2115],
    "nivel":     [3,3,3,3,3,2,2],
    "camas":     [400, 600, 800, 700, 500, 250, 180]
})

# Para cada ciudad, encontrar el hospital mas cercano
print("  Hospital mas cercano por ciudad:")
for _, ciudad in ciudades_ec.head(8).iterrows():
    distancias = hospitales.apply(
        lambda h: distancia_haversine(ciudad["lat"], ciudad["lon"], h["lat"], h["lon"]),
        axis=1
    )
    idx_min = distancias.idxmin()
    hospital_cercano = hospitales.loc[idx_min]
    dist_min = distancias.min()
    print(f"  {ciudad['ciudad']:<15}: {hospital_cercano['nombre'][:35]:<35} "
          f"({dist_min:.1f} km)")

# ================================================
# GENERAR MAPA FOLIUM
# ================================================
print("\n--- GENERANDO MAPA INTERACTIVO ---")
try:
    import folium
    from folium.plugins import MarkerCluster

    mapa = folium.Map(location=[-1.8, -78.5], zoom_start=7,
                      tiles="CartoDB positron")

    # Ciudades coloreadas por region
    colores_region = {"Sierra": "blue", "Costa": "green",
                      "Amazonia": "orange", "Insular": "red"}

    for _, r in ciudades_ec.iterrows():
        folium.CircleMarker(
            location=[r["lat"], r["lon"]],
            radius=max(5, r["poblacion"] / 300000),
            color=colores_region.get(r["region"], "gray"),
            fill=True,
            popup=folium.Popup(
                f"<b>{r['ciudad']}</b><br>"
                f"Poblacion: {r['poblacion']:,}<br>"
                f"Region: {r['region']}<br>"
                f"Dist. Quito: {r['dist_quito_km']} km",
                max_width=200
            ),
            tooltip=r["ciudad"]
        ).add_to(mapa)

    # Hospitales con icono
    for _, h in hospitales.iterrows():
        folium.Marker(
            location=[h["lat"], h["lon"]],
            icon=folium.Icon(color="red", icon="plus", prefix="fa"),
            tooltip=h["nombre"]
        ).add_to(mapa)

    mapa.save("mapa_ecuador_ciudades.html")
    print("  Mapa guardado: mapa_ecuador_ciudades.html")
    print("  Abre el archivo en un navegador para ver el mapa interactivo.")

except ImportError:
    print("  (Folium no instalado — instala con: pip install folium)")
    print("  El resto del analisis funciona sin Folium.")

# ================================================
# ESTADISTICAS REGIONALES
# ================================================
print("\n--- ESTADISTICAS POR REGION ---")
resumen = ciudades_ec.groupby("region").agg(
    num_ciudades=("ciudad","count"),
    poblacion_total=("poblacion","sum"),
    ciudad_mayor=("ciudad","first"),
    dist_promedio_quito=("dist_quito_km","mean")
).round(1)
resumen["pct_poblacion"] = (resumen["poblacion_total"] /
                             resumen["poblacion_total"].sum() * 100).round(1)
print(resumen.to_string())

print("\n" + "=" * 65)
print("GEODATOS — CAPACIDADES ADQUIRIDAS:")
print("  Haversine:   distancia real entre coordenadas GPS")
print("  KMeans geo:  clustering de puntos geograficos")
print("  Accesibilidad: punto mas cercano (nearest neighbor)")
print("  Folium:      mapas interactivos desde Python")
print("  Coropletco:  visualizar datos sobre mapa de Ecuador")
print("=" * 65)
```

3. Descarga el shapefile de provincias de Ecuador del INEC (`https://www.ecuadorencifras.gob.ec/documentos/`) y crea un mapa coropletco con GeoPandas mostrando la poblacion por provincia.

4. Calcula el "indice de aislamiento" de cada ciudad: distancia promedio a los 3 hospitales mas cercanos.

## Usa IA para...

> Abre Claude y escribe:
> "Tengo datos de ubicacion de 15 ciudades de Ecuador con latitud, longitud y poblacion. Quiero resolver el problema de ubicacion de almacenes: ¿donde ubicaria 3 centros de distribucion para minimizar la distancia promedio ponderada por poblacion a todas las ciudades? ¿Como implemento esto en Python con scipy.optimize o una heuristica K-Medoids? Dame el codigo completo con los datos de Ecuador."

Despues de leer la respuesta:
- Implementa la solucion de ubicacion optima de centros de distribucion.
- Visualiza en el mapa Folium la ubicacion optima propuesta.

## Que aprendiste

- La formula Haversine calcula distancias reales entre coordenadas GPS considerando la curvatura de la Tierra.
- `KMeans` sobre coordenadas lat/lon agrupa ciudades por proximidad geografica — util para territorios de ventas.
- El problema del "punto mas cercano" (nearest neighbor) se resuelve calculando distancias a todos los puntos y tomando el minimo.
- Folium crea mapas interactivos HTML desde Python con `CircleMarker`, `Marker` y popups informativos.
- Los mapas coropletcos colorean regiones segun un valor numerico — ideales para mostrar desigualdades territoriales.
- Normalizar las coordenadas antes del clustering con `StandardScaler` evita que la escala de poblacion domine sobre lat/lon.

## Reto extra

Construye un sistema de analisis de cobertura bancaria por canton en Ecuador: usa datos del SB (Superintendencia de Bancos) sobre ubicacion de sucursales, calcula cuantos ecuatorianos viven a mas de 30km de un banco, identifica los 10 cantones con mayor brecha de acceso financiero, y genera un reporte HTML con mapa interactivo y recomendaciones de donde abrir nuevas agencias.
