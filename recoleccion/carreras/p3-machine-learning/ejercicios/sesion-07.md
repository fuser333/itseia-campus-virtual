# Ejercicio Sesion 7: Feature Engineering y Seleccion de Variables

**Materia:** Machine Learning I
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 50 min

## Objetivo

Aplicar tecnicas de feature engineering (crear variables nuevas) y seleccion de variables (eliminar las irrelevantes) sobre datos de exportaciones de Ecuador para mejorar un modelo predictivo, midiendo el impacto de cada tecnica en la precision final.

## Contexto

ProEcuador (Instituto de Promocion de Exportaciones e Inversiones) reporta que Ecuador exporta mas de $25 mil millones anuales, con banano, camaron, petroleo, cacao y flores como principales productos. Predecir el valor de exportacion de un producto dado su historial, variaciones estacionales y precio internacional es un problema donde el feature engineering marca la diferencia: no es solo que datos tienes, sino que variables derivadas construyes a partir de ellos.

## Instrucciones

1. Abre Google Colab y crea `sesion07_feature_engineering_exports.ipynb`.

2. Genera el dataset de exportaciones y aplica ingenieria de variables:

```python
# Machine Learning I - Sesion 7: Feature Engineering
# ITSEIA - Periodo 3

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.feature_selection import (SelectKBest, f_regression,
                                        RFE, mutual_info_regression)
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline

np.random.seed(2024)
n = 500

# Dataset base: registros de exportacion ProEcuador
meses = np.arange(1, n + 1)
productos = np.random.choice(['Banano', 'Camaron', 'Cacao', 'Flores', 'Atun'], n)
precio_internacional = np.random.uniform(0.5, 15.0, n)  # USD/kg
volumen_toneladas = np.random.uniform(100, 5000, n)
temperatura_pais_destino = np.random.uniform(-5, 35, n)
tipo_cambio_usd = np.random.uniform(0.85, 1.15, n)  # respecto a referencia
mes_del_anio = (meses % 12) + 1
feriados_destino = np.random.randint(0, 5, n)
distancia_km = np.random.choice([8000, 9500, 10500, 7200, 6800], n)
calidad_score = np.random.uniform(60, 100, n)
ruido = np.random.normal(0, 50000, n)

# Variable objetivo: valor exportacion USD
valor_exportacion = (
    precio_internacional * volumen_toneladas * 1000 * tipo_cambio_usd
    - distancia_km * 2.5 * volumen_toneladas
    + calidad_score * volumen_toneladas * 8
    + ruido
).clip(50000, 10_000_000)

df = pd.DataFrame({
    'mes': meses,
    'producto': productos,
    'precio_internacional': precio_internacional.round(3),
    'volumen_toneladas': volumen_toneladas.round(1),
    'temperatura_destino': temperatura_pais_destino.round(1),
    'tipo_cambio': tipo_cambio_usd.round(4),
    'mes_del_anio': mes_del_anio,
    'feriados_destino': feriados_destino,
    'distancia_km': distancia_km,
    'calidad_score': calidad_score.round(1),
    'valor_exportacion': valor_exportacion.round(2)
})

print("Dataset ProEcuador - Exportaciones")
print(df.head())
print(f"\nValor promedio exportacion: ${df['valor_exportacion'].mean():,.0f}")
```

3. Aplica feature engineering:

```python
# PASO 1: Codificar variable categorica
le = LabelEncoder()
df['producto_cod'] = le.fit_transform(df['producto'])

# PASO 2: Crear features derivados (feature engineering manual)
# Revenue por tonelada (interaccion de variables)
df['revenue_por_tonelada'] = df['precio_internacional'] * 1000 * df['tipo_cambio']

# Costo logistico estimado por tonelada
df['costo_logistico'] = df['distancia_km'] * 2.5

# Margen estimado
df['margen_estimado'] = df['revenue_por_tonelada'] - df['costo_logistico']

# Variable estacional: trimestre
df['trimestre'] = ((df['mes_del_anio'] - 1) // 3) + 1

# Es temporada alta (Q4: banano, flores; Q2: camaron)
df['temporada_alta'] = ((df['mes_del_anio'].isin([10, 11, 12, 2, 3])).astype(int))

# Volumen al cuadrado (para capturar economia de escala)
df['volumen_sq'] = df['volumen_toneladas'] ** 2

# Log del volumen (reduce sesgo de distribucion)
df['log_volumen'] = np.log1p(df['volumen_toneladas'])

print("Features originales y nuevas creadas:")
print("\nOriginales:")
orig = ['precio_internacional', 'volumen_toneladas', 'calidad_score', 'distancia_km']
for f in orig:
    print(f"  {f}")

print("\nNuevas (Feature Engineering):")
nuevas = ['revenue_por_tonelada', 'costo_logistico', 'margen_estimado',
          'trimestre', 'temporada_alta', 'volumen_sq', 'log_volumen']
for f in nuevas:
    print(f"  {f}  <- DERIVADA")
```

4. Seleccion de variables y comparacion:

```python
# Features para el modelo
features_originales = ['precio_internacional', 'volumen_toneladas', 'calidad_score',
                       'distancia_km', 'tipo_cambio', 'temperatura_destino',
                       'feriados_destino', 'mes_del_anio', 'producto_cod']

features_con_engineering = features_originales + ['revenue_por_tonelada',
    'costo_logistico', 'margen_estimado', 'trimestre', 'temporada_alta', 'log_volumen']

y = np.log1p(df['valor_exportacion'])  # log para estabilizar la varianza

# Modelo base (sin feature engineering)
X_base = df[features_originales]
modelo_base = RandomForestRegressor(n_estimators=100, random_state=42)
scores_base = cross_val_score(modelo_base, X_base, y, cv=5, scoring='r2')

# Modelo con feature engineering
X_eng = df[features_con_engineering]
modelo_eng = RandomForestRegressor(n_estimators=100, random_state=42)
scores_eng = cross_val_score(modelo_eng, X_eng, y, cv=5, scoring='r2')

print("IMPACTO DEL FEATURE ENGINEERING:")
print(f"R² sin engineering: {scores_base.mean():.4f} (± {scores_base.std():.4f})")
print(f"R² con engineering: {scores_eng.mean():.4f} (± {scores_eng.std():.4f})")
print(f"Mejora: +{(scores_eng.mean() - scores_base.mean())*100:.2f} puntos")

# Importancia de todas las variables
modelo_eng.fit(X_eng, y)
importancias = pd.Series(modelo_eng.feature_importances_,
                          index=features_con_engineering).sort_values(ascending=True)

fig, ax = plt.subplots(figsize=(10, 7))
colores_barras = ['#F0846D' if f in nuevas else '#1F2F58' for f in importancias.index]
importancias.plot(kind='barh', ax=ax, color=colores_barras)
ax.set_title('Importancia de Variables — Azul=Original | Rojo=Feature Engineering\nExportaciones Ecuador | ITSEIA P3')
ax.set_xlabel('Importancia (Gini)')
ax.grid(axis='x', alpha=0.4)
plt.tight_layout()
plt.show()

# Seleccion automatica: SelectKBest
selector = SelectKBest(mutual_info_regression, k=6)
selector.fit(X_eng, y)
features_seleccionadas = np.array(features_con_engineering)[selector.get_support()]
print(f"\nTop 6 features segun mutual information:")
for f in features_seleccionadas:
    tag = " <- DERIVADA" if f in nuevas else ""
    print(f"  {f}{tag}")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "En machine learning, explica la diferencia entre feature engineering manual y feature selection automatica. Dame 5 ejemplos de features derivadas que se pueden crear a partir de fechas (timestamps) en un dataset de ventas. ¿Cuando conviene usar logaritmo como transformacion de una variable?"

Despues de leer la respuesta:
- Crea 2 features adicionales a partir de fechas que ChatGPT sugiera.
- Reentrenar el modelo y reporta si el R² mejora o empeora.

## Que aprendiste

- El **feature engineering** puede mejorar un modelo mas que cambiar el algoritmo: transformar variables es frecuentemente mas impactante que ajustar hiperparametros.
- Las **interacciones entre variables** (precio * volumen) capturan relaciones que el modelo no puede descubrir por si solo.
- `LabelEncoder` convierte texto a numeros, pero para modelos lineales se prefiere `OneHotEncoder` para evitar orden artificial.
- `SelectKBest` con `mutual_info_regression` selecciona las variables mas informativas de forma automatica.
- El **log de la variable objetivo** estabiliza la varianza cuando los valores tienen rango muy amplio (miles a millones).

## Reto extra

Implementa Recursive Feature Elimination (RFE) de scikit-learn con Random Forest como estimador para encontrar el numero optimo de features. Grafica la curva de R² vs numero de features. ¿Cuantas features son suficientes para alcanzar el 95% del R² maximo? ¿Que implica eso para la complejidad del modelo en produccion?
