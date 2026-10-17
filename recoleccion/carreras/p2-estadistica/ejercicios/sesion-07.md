# Ejercicio Sesion 7: Series de Tiempo — Analisis Basico

**Materia:** Estadistica Inferencial
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Analizar una serie de tiempo real de datos economicos de Ecuador, descomponerla en sus componentes (tendencia, estacionalidad, residuo), y aplicar modelos basicos de pronostico (media movil, suavizamiento exponencial) para entender la base del forecasting en IA.

## Contexto

El Banco Central del Ecuador (BCE) publica mensualmente el Indice de Confianza del Consumidor (ICC). Un valor por encima de 50 indica optimismo; por debajo de 50, pesimismo. Este indicador adelanta el comportamiento del consumo y es util para modelar la demanda futura de servicios educativos y tecnologicos.

**Dataset — ICC Ecuador, Enero 2022 a Diciembre 2023 (datos BCE, simplificados):**

```python
fechas = pd.date_range(start='2022-01', periods=24, freq='MS')
icc = [42.3, 41.8, 43.5, 44.2, 45.1, 46.8, 47.2, 46.5, 45.8, 44.9, 43.2, 44.1,
       45.3, 46.1, 47.5, 48.2, 49.1, 50.3, 51.2, 50.8, 49.5, 48.7, 47.9, 49.2]
```

## Instrucciones

**Parte 1 — Visualizacion y Estadisticas Basicas**

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import seasonal_decompose

fechas = pd.date_range(start='2022-01', periods=24, freq='MS')
icc = [42.3, 41.8, 43.5, 44.2, 45.1, 46.8, 47.2, 46.5, 45.8, 44.9, 43.2, 44.1,
       45.3, 46.1, 47.5, 48.2, 49.1, 50.3, 51.2, 50.8, 49.5, 48.7, 47.9, 49.2]

serie = pd.Series(icc, index=fechas, name='ICC_Ecuador')

print("Estadisticas de la serie:")
print(f"  Media: {serie.mean():.2f}")
print(f"  Desviacion estandar: {serie.std():.2f}")
print(f"  Minimo: {serie.min():.2f} en {serie.idxmin().strftime('%B %Y')}")
print(f"  Maximo: {serie.max():.2f} en {serie.idxmax().strftime('%B %Y')}")
print(f"  Valor inicial vs final: {serie.iloc[0]:.1f} -> {serie.iloc[-1]:.1f}")

plt.figure(figsize=(12, 4))
plt.plot(serie.index, serie.values, marker='o', linewidth=2, color='#1F2F58')
plt.axhline(y=50, color='#F0846D', linestyle='--', label='Linea de optimismo (50)')
plt.title('Indice de Confianza del Consumidor — Ecuador 2022-2023 (BCE)')
plt.ylabel('ICC')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('icc_ecuador.png', dpi=150)
plt.show()
```

**Parte 2 — Descomposicion de la Serie**

```python
# Descomposicion aditiva
descomposicion = seasonal_decompose(serie, model='additive', period=12)

fig, axes = plt.subplots(4, 1, figsize=(12, 10))
descomposicion.observed.plot(ax=axes[0], title='Original')
descomposicion.trend.plot(ax=axes[1], title='Tendencia')
descomposicion.seasonal.plot(ax=axes[2], title='Estacionalidad')
descomposicion.resid.plot(ax=axes[3], title='Residuo (ruido)')
plt.tight_layout()
plt.savefig('descomposicion_icc.png', dpi=150)
plt.show()
```

Responde mirando los graficos:
- ¿La tendencia es creciente, decreciente o estacionaria?
- ¿En que meses del ano la confianza tiende a ser mas alta? ¿Tiene sentido con el contexto economico de Ecuador?
- ¿Hay algun residuo anormalmente grande? ¿A que evento podria corresponder?

**Parte 3 — Modelos de Pronostico Basicos**

```python
# Metodo 1: Media Movil (suaviza el ruido)
serie_df = serie.to_frame()
serie_df['MA_3'] = serie.rolling(window=3).mean()  # Media movil 3 meses
serie_df['MA_6'] = serie.rolling(window=6).mean()  # Media movil 6 meses

# Metodo 2: Suavizamiento Exponencial Simple
from statsmodels.tsa.holtwinters import SimpleExpSmoothing

modelo_ses = SimpleExpSmoothing(serie).fit(smoothing_level=0.3, optimized=False)
prediccion_ses = modelo_ses.forecast(3)  # Pronostico 3 meses hacia adelante

print("Pronostico para los proximos 3 meses (Enero-Marzo 2024):")
print(prediccion_ses.round(2))

# Visualizacion comparativa
plt.figure(figsize=(12, 5))
plt.plot(serie.index, serie.values, label='ICC Real', linewidth=2, color='#1F2F58')
plt.plot(serie_df.index, serie_df['MA_3'], label='MA 3 meses', linestyle='--', color='#73B8E7')
plt.plot(prediccion_ses.index, prediccion_ses.values, 'o-',
         label='Pronostico SES', color='#FBBC0C', markersize=8)
plt.title('ICC Ecuador — Real vs Media Movil vs Pronostico')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('pronostico_icc.png', dpi=150)
plt.show()
```

**Parte 4 — Error de Pronostico**

Divide los datos: usa los primeros 20 meses para entrenar y los ultimos 4 para evaluar:
```python
train = serie.iloc[:20]
test = serie.iloc[20:]

modelo_eval = SimpleExpSmoothing(train).fit(smoothing_level=0.3)
pred_eval = modelo_eval.forecast(4)

mae = np.mean(np.abs(test.values - pred_eval.values))
mape = np.mean(np.abs((test.values - pred_eval.values) / test.values)) * 100

print(f"MAE: {mae:.3f} puntos ICC")
print(f"MAPE: {mape:.2f}%")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "Analice la serie temporal del Indice de Confianza del Consumidor de Ecuador 2022-2023. La tendencia es [creciente/decreciente], hay estacionalidad en los meses [X]. El modelo de suavizamiento exponencial tiene MAPE=[valor]%. Ayudame a: (1) interpretar la descomposicion en el contexto economico de Ecuador, (2) explicar la diferencia entre media movil y suavizamiento exponencial, (3) sugerir cuando usar ARIMA en vez de estos modelos simples."

## Que aprendiste

- Una **serie de tiempo** tiene 4 componentes: tendencia, estacionalidad, ciclo y ruido (residuo).
- La **descomposicion** separa estos componentes para analizarlos independientemente.
- La **media movil** suaviza el ruido pero reacciona lento a cambios.
- El **suavizamiento exponencial** da mas peso a los datos recientes — mas reactivo.
- **MAE y MAPE** miden el error de pronostico en unidades originales y en porcentaje.
- En ML: LSTM, Prophet y Transformers son extensiones modernas para series de tiempo complejas.

## Reto extra

Descarga del BCE (bce.fin.ec) la serie real del ICC Ecuador o del Indice de Precios al Consumidor (IPC) de los ultimos 5 años. Aplica la descomposicion y el suavizamiento exponencial. Luego investiga el modelo **Holt-Winters** (triple exponential smoothing) que captura tanto tendencia como estacionalidad. Implementalo con statsmodels y compara su MAPE contra el modelo simple. ¿Vale la pena la complejidad adicional?
