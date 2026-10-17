# Ejercicio Sesion 2: Estadisticas Descriptivas Rapidas

**Materia:** Analisis Exploratorio de Datos
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 30 min

## Objetivo

Calcular e interpretar estadisticas descriptivas completas (media, mediana, moda, varianza, desviacion estandar, percentiles, asimetria) sobre datos reales del mercado laboral ecuatoriano.

## Contexto

Las estadisticas descriptivas resumen en numeros lo que un dataset "dice". Antes de cualquier modelo de ML, un cientifico de datos debe conocer el centro, la dispersion y la forma de cada variable. En Ecuador, el INEC publica el salario promedio nacional — pero el promedio solo no cuenta toda la historia: la mediana y la desviacion estandar revelan la desigualdad real.

## Instrucciones

1. Crea el archivo `sesion02_estadisticas_descriptivas.py`.

2. Ejecuta el siguiente codigo:

```python
# Estadisticas Descriptivas - ITSEIA
# Dataset: Salarios y condiciones laborales Ecuador 2024
# Fuente: estructura ENEMDU INEC

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

print("=" * 65)
print("ESTADISTICAS DESCRIPTIVAS - MERCADO LABORAL ECUADOR")
print("=" * 65)

# Dataset: salarios por sector en Ecuador (USD/mes)
# Basado en datos INEC ENEMDU 2024
salarios = {
    "tecnologia": [1850, 2400, 3200, 1600, 2800, 1950, 4100, 2200, 1750, 3500],
    "educacion":  [950, 1100, 820, 1200, 880, 1050, 1300, 900, 1150, 980],
    "salud":      [2100, 1800, 2500, 3200, 1600, 2800, 1900, 2200, 2700, 1750],
    "comercio":   [580, 620, 450, 700, 530, 680, 420, 750, 610, 490],
    "agricultura":[420, 450, 380, 510, 430, 400, 480, 360, 440, 470],
}

# ================================================
# FUNCION: estadisticas completas de un array
# ================================================
def estadisticas_completas(nombre, datos):
    arr = np.array(datos)
    moda_result = stats.mode(arr, keepdims=True)
    print(f"\n--- {nombre.upper()} ---")
    print(f"  N (cantidad):          {len(arr)}")
    print(f"  Media:                 ${np.mean(arr):,.2f}")
    print(f"  Mediana:               ${np.median(arr):,.2f}")
    print(f"  Moda:                  ${moda_result.mode[0]:,.2f}")
    print(f"  Desv. estandar:        ${np.std(arr):,.2f}")
    print(f"  Varianza:              ${np.var(arr):,.2f}")
    print(f"  Minimo:                ${np.min(arr):,.2f}")
    print(f"  Maximo:                ${np.max(arr):,.2f}")
    print(f"  Rango:                 ${np.max(arr) - np.min(arr):,.2f}")
    print(f"  Percentil 25 (Q1):     ${np.percentile(arr, 25):,.2f}")
    print(f"  Percentil 75 (Q3):     ${np.percentile(arr, 75):,.2f}")
    print(f"  IQR (Q3-Q1):           ${np.percentile(arr, 75) - np.percentile(arr, 25):,.2f}")
    print(f"  Asimetria (skewness):  {stats.skew(arr):.4f}")
    print(f"  Curtosis:              {stats.kurtosis(arr):.4f}")
    brecha = (np.mean(arr) - np.median(arr)) / np.median(arr) * 100
    print(f"  Brecha media/mediana:  {brecha:+.1f}%  {'(desigualdad alta)' if abs(brecha) > 10 else '(distribucion simetrica)'}")
    return arr

print("\nANALISIS POR SECTOR:")
datos_todos = {}
for sector, valores in salarios.items():
    datos_todos[sector] = estadisticas_completas(sector, valores)

# ================================================
# COMPARACION ENTRE SECTORES
# ================================================
print("\n\n--- COMPARACION DE MEDIANAS POR SECTOR ---")
medianas = {s: np.median(v) for s, v in salarios.items()}
medianas_ord = sorted(medianas.items(), key=lambda x: x[1], reverse=True)

salario_basico = 460  # SBU Ecuador 2024
for sector, mediana in medianas_ord:
    multiplo = mediana / salario_basico
    barra = "#" * int(multiplo * 5)
    print(f"  {sector:<15}: ${mediana:,.0f}  ({multiplo:.1f}x SBU) {barra}")

# ================================================
# COEFICIENTE DE VARIACION: que sector es mas desigual
# ================================================
print("\n--- DESIGUALDAD INTERNA (Coeficiente de Variacion) ---")
for sector, valores in salarios.items():
    arr = np.array(valores)
    cv = (np.std(arr) / np.mean(arr)) * 100
    nivel = "ALTA" if cv > 30 else ("MEDIA" if cv > 15 else "BAJA")
    print(f"  {sector:<15}: CV = {cv:.1f}%  [{nivel}]")

# ================================================
# VISUALIZACION: boxplot comparativo
# ================================================
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.suptitle("Estadisticas Descriptivas - Salarios Ecuador 2024",
             fontsize=13, fontweight="bold")

# Boxplot
df_sal = pd.DataFrame(salarios)
df_sal.boxplot(ax=axes[0], patch_artist=True,
               boxprops=dict(facecolor="#73B8E7", color="#1F2F58"),
               medianprops=dict(color="#FBBC0C", linewidth=2.5))
axes[0].set_title("Distribucion de Salarios por Sector")
axes[0].set_xlabel("Sector")
axes[0].set_ylabel("Salario mensual (USD)")
axes[0].tick_params(axis="x", rotation=30)
axes[0].axhline(y=460, color="#F0846D", linestyle="--", label="SBU $460")
axes[0].legend()

# Medias vs medianas
sectores = list(medianas_ord[i][0] for i in range(len(medianas_ord)))
medias = [np.mean(salarios[s]) for s in sectores]
meds = [np.median(salarios[s]) for s in sectores]
x = range(len(sectores))
axes[1].bar([i - 0.2 for i in x], medias, width=0.35,
            label="Media", color="#1F2F58")
axes[1].bar([i + 0.2 for i in x], meds, width=0.35,
            label="Mediana", color="#FBBC0C")
axes[1].set_xticks(list(x))
axes[1].set_xticklabels(sectores, rotation=30)
axes[1].set_title("Media vs Mediana por Sector")
axes[1].set_ylabel("Salario (USD)")
axes[1].legend()

plt.tight_layout()
plt.savefig("sesion02_estadisticas_desc.png", dpi=150, bbox_inches="tight")
plt.show()

print("\nGrafico guardado: sesion02_estadisticas_desc.png")
print("=" * 65)
```

3. Ejecuta el codigo. Identifica el sector con mayor coeficiente de variacion.

4. Agrega una columna calculada al diccionario: `"mineria": [980, 1200, 850, 1400, 900, 1100, 1050, 1300, 920, 1150]` y repite el analisis.

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Tengo datos de salarios en Ecuador con media $1,200 y mediana $750. La asimetria es +1.8. Explica que significa esto economicamente. ¿Es mejor usar la media o la mediana para reportar el salario 'tipico'? ¿Por que?"

Despues de leer la respuesta:
- Identifica en tu dataset cual es la asimetria de cada sector.
- Determina si la media o la mediana es mas representativa para cada uno.

## Que aprendiste

- `np.mean()`, `np.median()`, `scipy.stats.mode()` calculan las medidas de centro.
- La desviacion estandar mide dispersion; la varianza es su cuadrado.
- El IQR (rango intercuartilico) es robusto frente a outliers.
- `stats.skew()` mide la asimetria: positivo = cola hacia la derecha (salarios altos raros).
- El coeficiente de variacion (CV = std/media) compara desigualdad entre grupos.
- Cuando hay outliers, la mediana representa mejor al "tipico".

## Reto extra

Descarga los datos reales de salarios del INEC Ecuador (ENEMDU). Calcula el CV por provincia y encuentra cual es la provincia con mayor desigualdad salarial interna. Crea un mapa de calor de Ecuador coloreado por CV usando matplotlib o plotly.
