# Ejercicio Sesion 4: Clustering y Segmentacion

**Materia:** Analitica Predictiva
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Aplicar algoritmos de clustering no supervisado (K-Means, DBSCAN, clustering jerarquico) para segmentar clientes, zonas geograficas y tipos de empresas ecuatorianas, determinando el numero optimo de clusters con el metodo del codo, silhouette score y dendrogramas.

## Contexto

La Superintendencia de Companias de Ecuador tiene registradas mas de 80.000 empresas activas. El Ministerio de Produccion segmenta el tejido empresarial para politicas diferenciadas. K-Means permite agrupar empresas por similitud de variables financieras (ventas, empleados, activos) sin necesidad de etiquetas previas — descubrimiento de patrones en datos sin clasificar.

## Instrucciones

1. Crea el archivo `sesion04_clustering_ecuador.py`:

```python
# Clustering y Segmentacion - ITSEIA
# Analitica Predictiva
# Dataset: empresas Ecuador (Superintendencia de Companias)

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.metrics import silhouette_score, calinski_harabasz_score
from sklearn.decomposition import PCA
from scipy.cluster.hierarchy import dendrogram, linkage
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("CLUSTERING Y SEGMENTACION — EMPRESAS ECUADOR")
print("=" * 65)

# ================================================
# DATASET: EMPRESAS ECUADOR SUPERCIAS
# ================================================
print("\n--- DATASET EMPRESAS ECUADOR ---")

n = 600

# Simular 4 grupos naturales
def generar_cluster(n, ventas_media, empleados_media, activos_media,
                    edad_media, ventas_std=0.3, cluster_id=0):
    return pd.DataFrame({
        "ventas_anuales":    np.random.lognormal(np.log(ventas_media), ventas_std, n),
        "num_empleados":     np.maximum(1, np.random.normal(empleados_media, empleados_media*0.3, n).round(0)),
        "activos_totales":   np.random.lognormal(np.log(activos_media), 0.4, n),
        "edad_empresa":      np.maximum(1, np.random.normal(edad_media, edad_media*0.4, n).round(0)),
        "cluster_real":      cluster_id
    })

grupos = [
    generar_cluster(150, 80000, 3, 50000, 4, cluster_id=0),       # microempresa
    generar_cluster(200, 500000, 15, 350000, 8, cluster_id=1),     # pequena
    generar_cluster(150, 3000000, 60, 2000000, 15, cluster_id=2),  # mediana
    generar_cluster(100, 25000000, 300, 18000000, 22, cluster_id=3), # grande
]
df = pd.concat(grupos, ignore_index=True)

# Agregar variables categoricas
df["provincia"] = np.random.choice(
    ["Pichincha","Guayas","Azuay","Manabi","Tungurahua"],
    len(df), p=[0.35, 0.30, 0.12, 0.13, 0.10]
)
df["sector"] = np.random.choice(
    ["Comercio","Manufactura","Servicios","Construccion","Agricultura"],
    len(df), p=[0.35, 0.20, 0.28, 0.10, 0.07]
)
df["tiene_exportaciones"] = (df["ventas_anuales"] > 2000000).astype(int)

print(f"  Dataset: {len(df)} empresas")
print(f"  Ventas rango: ${df['ventas_anuales'].min():,.0f} — ${df['ventas_anuales'].max():,.0f}")
print(f"  Empleados rango: {df['num_empleados'].min():.0f} — {df['num_empleados'].max():.0f}")

# Features numericas para clustering
features = ["ventas_anuales","num_empleados","activos_totales","edad_empresa"]
X = df[features].copy()

# ================================================
# PREPROCESAMIENTO: ESCALAR
# ================================================
print("\n--- PREPROCESAMIENTO ---")

# RobustScaler: resistente a outliers (mejor que StandardScaler para empresas)
scaler = RobustScaler()
X_scaled = scaler.fit_transform(X)

print(f"  RobustScaler aplicado (resistente a outliers)")
print(f"  Shape: {X_scaled.shape}")

# ================================================
# METODO DEL CODO + SILHOUETTE
# ================================================
print("\n--- NUMERO OPTIMO DE CLUSTERS ---")

inertias  = []
silouettes = []
K_range   = range(2, 10)

for k in K_range:
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = km.fit_predict(X_scaled)
    inertias.append(km.inertia_)
    silouettes.append(silhouette_score(X_scaled, labels))

k_optimo_sil = K_range[np.argmax(silouettes)]
print(f"  K optimo (max silhouette): {k_optimo_sil} clusters")
print(f"  Silhouette scores: {[round(s,3) for s in silouettes]}")

# Metodo del codo: mayor caida en inercia
diffs = np.diff(inertias)
diffs2 = np.diff(diffs)
k_codo = K_range[np.argmax(diffs2) + 1]
print(f"  K optimo (metodo codo):    {k_codo} clusters")

# ================================================
# K-MEANS FINAL
# ================================================
print("\n--- K-MEANS SEGMENTACION EMPRESAS ---")

k_final = 4  # acorde con nuestra simulacion
kmeans = KMeans(n_clusters=k_final, random_state=42, n_init=20)
df["cluster_km"] = kmeans.fit_predict(X_scaled)

sil_final = silhouette_score(X_scaled, df["cluster_km"])
ch_score  = calinski_harabasz_score(X_scaled, df["cluster_km"])
print(f"  Silhouette score: {sil_final:.4f} (>0.5 = buena separacion)")
print(f"  Calinski-Harabasz: {ch_score:.1f} (mayor = mejor)")

# Perfil de cada cluster
print("\n  PERFIL CLUSTERS (mediana por grupo):")
perfil = df.groupby("cluster_km")[features].median().round(0)
perfil.index = [f"Cluster {i}" for i in perfil.index]
print(perfil.to_string())

# Nombrar clusters segun mediana de ventas
medianas_ventas = df.groupby("cluster_km")["ventas_anuales"].median()
orden = medianas_ventas.sort_values().index
nombres_cluster = {orden[0]: "Micro", orden[1]: "Pequena",
                   orden[2]: "Mediana", orden[3]: "Grande"}
df["tamano_empresa"] = df["cluster_km"].map(nombres_cluster)

print("\n  Conteo y ventas por tamano:")
for nombre in ["Micro","Pequena","Mediana","Grande"]:
    sub = df[df["tamano_empresa"]==nombre]
    print(f"  {nombre:<10}: {len(sub):>4} empresas | "
          f"ventas mediana ${sub['ventas_anuales'].median():>12,.0f} | "
          f"empleados median {sub['num_empleados'].median():.0f}")

# ================================================
# DBSCAN: DETECTAR OUTLIERS
# ================================================
print("\n--- DBSCAN: DETECCION DE OUTLIERS ---")

# PCA 2D para DBSCAN con datos reducidos
pca = PCA(n_components=2, random_state=42)
X_2d = pca.fit_transform(X_scaled)

dbscan = DBSCAN(eps=0.5, min_samples=10)
df["cluster_db"] = dbscan.fit_predict(X_2d)

n_clusters_db = len(set(df["cluster_db"])) - (1 if -1 in df["cluster_db"].values else 0)
n_outliers_db = (df["cluster_db"] == -1).sum()
print(f"  DBSCAN clusters encontrados: {n_clusters_db}")
print(f"  Outliers detectados:         {n_outliers_db} empresas ({n_outliers_db/len(df)*100:.1f}%)")

if n_outliers_db > 0:
    outliers = df[df["cluster_db"] == -1]
    print(f"  Outliers — ventas promedio: ${outliers['ventas_anuales'].mean():,.0f}")

# ================================================
# CLUSTERING JERARQUICO (muestra)
# ================================================
print("\n--- CLUSTERING JERARQUICO ---")

X_sample = X_scaled[:80]  # muestra para dendrograma legible
Z = linkage(X_sample, method="ward")
print(f"  Dendrograma calculado para muestra de 80 empresas")
print(f"  Metodo: Ward (minimiza varianza dentro de clusters)")

# ================================================
# VISUALIZACION
# ================================================
fig = plt.figure(figsize=(16, 12))
gs = gridspec.GridSpec(2, 3, figure=fig, hspace=0.45, wspace=0.40)

colores = ["#1F2F58","#FBBC0C","#F0846D","#73B8E7"]

# Scatter PCA 2D
ax1 = fig.add_subplot(gs[0, :2])
for i, (cluster_id, nombre) in enumerate(nombres_cluster.items()):
    mask = df["cluster_km"] == cluster_id
    ax1.scatter(X_2d[mask, 0], X_2d[mask, 1],
                c=colores[i], label=nombre, alpha=0.6, s=20)
ax1.set_title("K-Means Segmentacion (PCA 2D)")
ax1.set_xlabel(f"PC1 ({pca.explained_variance_ratio_[0]*100:.1f}%)")
ax1.set_ylabel(f"PC2 ({pca.explained_variance_ratio_[1]*100:.1f}%)")
ax1.legend()

# Codo + Silhouette
ax2 = fig.add_subplot(gs[0, 2])
ax2_twin = ax2.twinx()
ax2.plot(list(K_range), inertias, marker="o", color="#1F2F58", label="Inercia")
ax2_twin.plot(list(K_range), silouettes, marker="s", color="#FBBC0C", label="Silhouette")
ax2.set_xlabel("K clusters"); ax2.set_ylabel("Inercia")
ax2_twin.set_ylabel("Silhouette")
ax2.set_title("Metodo del Codo + Silhouette")

# Dendrograma
ax3 = fig.add_subplot(gs[1, :2])
dendrogram(Z, ax=ax3, leaf_font_size=6, color_threshold=0.7*max(Z[:,2]))
ax3.set_title("Dendrograma Clustering Jerarquico (n=80)")
ax3.set_ylabel("Distancia Ward")

# Distribucion ventas por cluster
ax4 = fig.add_subplot(gs[1, 2])
for i, (nombre, sub) in enumerate(df.groupby("tamano_empresa")):
    ax4.boxplot(sub["ventas_anuales"].clip(0, 5e6),
                positions=[i], widths=0.6,
                boxprops=dict(color=colores[i % 4]))
ax4.set_xticks(range(4))
ax4.set_xticklabels(["Grande","Mediana","Micro","Pequena"], fontsize=8)
ax4.set_title("Distribucion Ventas por Segmento")
ax4.set_ylabel("Ventas anuales $")

plt.suptitle("Clustering Empresas Ecuador — Supercias 2024",
             fontsize=13, fontweight="bold", y=1.01)
plt.savefig("clustering_empresas_ecuador.png", dpi=150, bbox_inches="tight")
plt.close()
print("\n  Grafico guardado: clustering_empresas_ecuador.png")

print("\n" + "=" * 65)
print("CLUSTERING — CONCEPTOS CLAVE:")
print("  K-Means:  asigna N centroides, itera hasta convergencia")
print("  Silhouette: mide cohesion intra-cluster vs separacion entre clusters")
print("  Metodo codo: punto de inflexion en curva de inercia")
print("  DBSCAN:   detecta clusters de forma arbitraria + outliers (label=-1)")
print("  Jerarquico: no requiere K predefinido, dendrograma para visualizar")
print("  RobustScaler: escalar con mediana/IQR, resistente a outliers")
print("=" * 65)
```

2. Agrega la variable `sector` como variable adicional al clustering (con one-hot encoding) y analiza si cambian los clusters.

3. Implementa el t-SNE para visualizar los clusters en 2D con mayor separacion visual que PCA.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Segmente empresas ecuatorianas en 4 clusters con K-Means. El silhouette score es 0.52. Necesito: 1) validar estadisticamente que los clusters son significativamente distintos entre si (ANOVA + Tukey HSD por variable), 2) crear un 'perfil verbal' de cada cluster para presentar al Ministerio de Produccion, 3) recomendar una politica diferenciada para cada segmento. Dame el codigo Python para los tests estadisticos y el texto del reporte."

Despues de leer la respuesta:
- Implementa el ANOVA + Tukey HSD para validar los 4 clusters.
- Escribe el reporte ejecutivo con el perfil de cada segmento.

## Que aprendiste

- K-Means minimiza la inercia (suma de distancias cuadradas a centroides) — sensible a outliers.
- El silhouette score mide la calidad del clustering: valores cercaños a 1 indican clusters bien separados.
- DBSCAN detecta clusters de forma arbitraria sin requerir K predefinido y marca outliers con label=-1.
- El clustering jerarquico (Ward) permite visualizar la estructura de agrupamiento en un dendrograma.
- `RobustScaler` es preferible a `StandardScaler` cuando hay outliers (usa mediana e IQR).
- PCA reduce dimensionalidad para visualizar clusters en 2D manteniendo la mayor varianza posible.

## Reto extra

Construye un sistema de monitoreo de salud financiera empresarial para la Superintendencia de Companias: aplica clustering trimestral, detecta empresas que cambian de cluster (ej: de Pequena a Micro = senal de deterioro), genera alertas para las 20 empresas con mayor deterioro, y construye un dashboard Streamlit interactivo con mapa de Ecuador coloreado por densidad de clusters por canton.
