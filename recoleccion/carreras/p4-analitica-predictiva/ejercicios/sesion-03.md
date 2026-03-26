# Ejercicio Sesion 3: Series de Tiempo y Forecasting

**Materia:** Analitica Predictiva
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 50 min

## Objetivo

Aplicar modelos de series de tiempo para forecasting: descomposicion STL, modelos ARIMA, Prophet y suavizamiento exponencial (ETS/Holt-Winters), para predecir indicadores economicos de Ecuador como inflacion, exportaciones de banano y ventas de supermercados.

## Contexto

El BCE publica series historicas de 30+ anos de inflacion, exportaciones y tipo de cambio. Los supermercados ecuatorianos proyectan ventas para planificar inventarios. Las series de tiempo permiten capturar tendencias, estacionalidad y ciclos para generar predicciones con intervalos de confianza que el gerente puede interpretar.

## Instrucciones

1. Instala: `pip install statsmodels prophet`.

2. Crea el archivo `sesion03_series_tiempo_ecuador.py`:

```python
# Series de Tiempo y Forecasting - ITSEIA
# Analitica Predictiva
# Dataset: indicadores BCE + ventas retail Ecuador

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("SERIES DE TIEMPO Y FORECASTING — ECUADOR")
print("=" * 65)

# ================================================
# SERIE 1: EXPORTACIONES BANANO ECUADOR (mensual)
# ================================================
print("\n--- SERIE: EXPORTACIONES BANANO 2018-2024 ---")

fechas = pd.date_range("2018-01-01", "2024-12-31", freq="MS")
n = len(fechas)

# Tendencia + estacionalidad + ruido (realista para banano Ecuador)
tendencia = np.linspace(280, 340, n)  # millones de cajas/mes
estacionalidad = 20 * np.sin(2 * np.pi * (np.arange(n) % 12) / 12 - 1)
ciclo_covid = np.where((fechas.year == 2020) & (fechas.month.isin([4,5,6])), -25, 0)
ruido = np.random.normal(0, 8, n)

serie_banano = tendencia + estacionalidad + ciclo_covid + ruido
serie_banano = np.maximum(serie_banano, 200)

df_banano = pd.DataFrame({
    "fecha": fechas,
    "exportaciones_cajas_miles": serie_banano.round(1)
})
df_banano = df_banano.set_index("fecha")

print(f"  Periodo: {df_banano.index[0].date()} → {df_banano.index[-1].date()}")
print(f"  Observaciones: {len(df_banano)}")
print(f"  Media: {df_banano.iloc[:,0].mean():.1f}K cajas | Std: {df_banano.iloc[:,0].std():.1f}K")

# ================================================
# DESCOMPOSICION STL
# ================================================
print("\n--- DESCOMPOSICION STL ---")
from statsmodels.tsa.seasonal import seasonal_decompose

descomp = seasonal_decompose(
    df_banano["exportaciones_cajas_miles"],
    model="additive",
    period=12,
    extrapolate_trend="freq"
)

trend_max  = descomp.trend.max()
trend_min  = descomp.trend.min()
season_amp = descomp.seasonal.max() - descomp.seasonal.min()
residual_std = descomp.resid.std()

print(f"  Tendencia: {trend_min:.1f}K → {trend_max:.1f}K cajas (+{trend_max-trend_min:.1f}K en 7 anos)")
print(f"  Amplitud estacionalidad: ±{season_amp/2:.1f}K cajas")
print(f"  Ruido (std residuos): {residual_std:.1f}K")

mes_pico = descomp.seasonal[:12].idxmax().strftime("%B")
mes_bajo = descomp.seasonal[:12].idxmin().strftime("%B")
print(f"  Mes de mayor exportacion: {mes_pico}")
print(f"  Mes de menor exportacion: {mes_bajo}")

# ================================================
# MODELO ARIMA
# ================================================
print("\n--- MODELO ARIMA ---")
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller

# Test de estacionariedad
adf_stat, adf_p, *_ = adfuller(df_banano["exportaciones_cajas_miles"])
print(f"  Test ADF: estadistico={adf_stat:.4f}, p-valor={adf_p:.4f}")
print(f"  Serie {'ESTACIONARIA' if adf_p < 0.05 else 'NO ESTACIONARIA'} (p < 0.05?)")

# Diferenciar si no es estacionaria
serie_diff = df_banano["exportaciones_cajas_miles"].diff().dropna()
adf_diff, p_diff, *_ = adfuller(serie_diff)
print(f"  Test ADF (diff 1): p-valor={p_diff:.4f} → {'ESTACIONARIA' if p_diff < 0.05 else 'No'}")

# Dividir train/test (80/20)
split_idx = int(len(df_banano) * 0.8)
train = df_banano.iloc[:split_idx]
test  = df_banano.iloc[split_idx:]
print(f"\n  Train: {len(train)} obs | Test: {len(test)} obs")

# ARIMA(2,1,2) con estacionalidad
modelo_arima = ARIMA(
    train["exportaciones_cajas_miles"],
    order=(2, 1, 2),
    seasonal_order=(1, 1, 1, 12)
)
resultado_arima = modelo_arima.fit()

# Forecast
fc_arima = resultado_arima.forecast(steps=len(test))
mae_arima = np.mean(np.abs(test["exportaciones_cajas_miles"].values - fc_arima.values))
rmse_arima = np.sqrt(np.mean((test["exportaciones_cajas_miles"].values - fc_arima.values)**2))
mape_arima = np.mean(np.abs((test["exportaciones_cajas_miles"].values - fc_arima.values) /
                              test["exportaciones_cajas_miles"].values)) * 100

print(f"\n  ARIMA(2,1,2)(1,1,1,12) metricas:")
print(f"  MAE:  {mae_arima:.2f}K cajas")
print(f"  RMSE: {rmse_arima:.2f}K cajas")
print(f"  MAPE: {mape_arima:.2f}%")

# ================================================
# SUAVIZAMIENTO EXPONENCIAL HOLT-WINTERS
# ================================================
print("\n--- HOLT-WINTERS (ETS) ---")
from statsmodels.tsa.holtwinters import ExponentialSmoothing

hw_model = ExponentialSmoothing(
    train["exportaciones_cajas_miles"],
    trend="add", seasonal="add", seasonal_periods=12
)
hw_fit = hw_model.fit(optimized=True)
fc_hw = hw_fit.forecast(len(test))

mae_hw   = np.mean(np.abs(test["exportaciones_cajas_miles"].values - fc_hw.values))
mape_hw  = np.mean(np.abs((test["exportaciones_cajas_miles"].values - fc_hw.values) /
                            test["exportaciones_cajas_miles"].values)) * 100

print(f"  Holt-Winters metricas:")
print(f"  MAE:  {mae_hw:.2f}K cajas")
print(f"  MAPE: {mape_hw:.2f}%")
print(f"  Alpha (nivel): {hw_fit.params['smoothing_level']:.4f}")
print(f"  Beta (tendencia): {hw_fit.params['smoothing_trend']:.4f}")
print(f"  Gamma (estacionalidad): {hw_fit.params['smoothing_seasonal']:.4f}")

mejor = "ARIMA" if mape_arima < mape_hw else "Holt-Winters"
print(f"\n  Mejor modelo: {mejor} (menor MAPE)")

# ================================================
# FORECAST FUTURO 12 MESES
# ================================================
print("\n--- FORECAST 2025 (12 meses) ---")

# Reentrenar con todos los datos
hw_final = ExponentialSmoothing(
    df_banano["exportaciones_cajas_miles"],
    trend="add", seasonal="add", seasonal_periods=12
).fit(optimized=True)

fechas_forecast = pd.date_range("2025-01-01", periods=12, freq="MS")
forecast_2025 = hw_final.forecast(12)
df_forecast = pd.DataFrame({
    "fecha": fechas_forecast,
    "exportaciones_pred_K": forecast_2025.values.round(1)
})

print("  Proyeccion exportaciones banano 2025:")
print(df_forecast.to_string(index=False))
print(f"\n  Total proyectado 2025: {forecast_2025.sum():.0f}K cajas")
print(f"  vs Total 2024:         {df_banano.loc['2024','exportaciones_cajas_miles'].sum():.0f}K cajas")

# ================================================
# VISUALIZACION
# ================================================
fig = plt.figure(figsize=(16, 12))
gs = gridspec.GridSpec(3, 2, figure=fig, hspace=0.45, wspace=0.35)

# Serie completa
ax1 = fig.add_subplot(gs[0, :])
ax1.plot(df_banano.index, df_banano["exportaciones_cajas_miles"],
         color="#1F2F58", lw=1.5, label="Historico")
ax1.axvline(train.index[-1], color="gray", linestyle="--", label="Train/Test split")
ax1.plot(test.index, fc_arima.values, color="#FBBC0C", lw=2, label=f"ARIMA (MAPE={mape_arima:.1f}%)")
ax1.plot(test.index, fc_hw.values, color="#F0846D", lw=2, linestyle="--",
         label=f"Holt-Winters (MAPE={mape_hw:.1f}%)")
ax1.plot(fechas_forecast, forecast_2025.values, color="#73B8E7", lw=2.5, label="Forecast 2025")
ax1.set_title("Exportaciones Banano Ecuador — Historico + Forecast")
ax1.set_ylabel("Miles de cajas"); ax1.legend(fontsize=8)

# Descomposicion
ax2 = fig.add_subplot(gs[1, 0])
descomp.trend.plot(ax=ax2, color="#1F2F58")
ax2.set_title("Componente Tendencia")

ax3 = fig.add_subplot(gs[1, 1])
descomp.seasonal[:24].plot(ax=ax3, color="#73B8E7")
ax3.set_title("Componente Estacional (2 anos)")

# Residuos
ax4 = fig.add_subplot(gs[2, 0])
descomp.resid.plot(ax=ax4, color="#F0846D", alpha=0.7)
ax4.axhline(0, color="black", lw=0.5)
ax4.set_title("Residuos")

# Barras forecast 2025
ax5 = fig.add_subplot(gs[2, 1])
ax5.bar(range(12), forecast_2025.values, color="#1F2F58", alpha=0.8)
ax5.set_xticks(range(12))
ax5.set_xticklabels(["E","F","M","A","M","J","J","A","S","O","N","D"])
ax5.set_title("Forecast Mensual 2025 (Holt-Winters)")
ax5.set_ylabel("Miles de cajas")

plt.suptitle("Series de Tiempo — Exportaciones Banano Ecuador", y=1.01,
             fontsize=13, fontweight="bold")
plt.savefig("series_tiempo_ecuador.png", dpi=150, bbox_inches="tight")
plt.close()
print("\n  Grafico guardado: series_tiempo_ecuador.png")

print("\n" + "=" * 65)
print("SERIES DE TIEMPO — CONCEPTOS CLAVE:")
print("  Descomposicion: serie = tendencia + estacionalidad + residuo")
print("  ADF test:       p < 0.05 → serie estacionaria (requiere ARIMA)")
print("  ARIMA(p,d,q):   p=AR, d=diferenciacion, q=MA")
print("  Holt-Winters:   ETS con tendencia+estacionalidad aditiva/multiplicativa")
print("  MAPE:           error porcentual medio — independiente de la escala")
print("  Forecast IC:    intervalo de confianza 95% para la prediccion")
print("=" * 65)
```

3. Agrega una serie de ventas de supermercado con estacionalidad semanal (no mensual) y aplica Holt-Winters con `seasonal_periods=52`.

4. Implementa la seleccion automatica de ARIMA con `pmdarima.auto_arima` y compara con el ARIMA manual.

## Usa IA para...

> Abre Gemini y escribe:
> "Tengo una serie de tiempo de exportaciones de banano Ecuador con datos mensuales desde 2018. La descomposicion muestra tendencia creciente y estacionalidad anual. Quiero usar Prophet (Meta) para el forecast 2025. ¿Como incorporo: 1) el evento COVID (2020-Q2) como 'holiday' en Prophet, 2) regresores externos como precio internacional del banano, 3) intervalos de confianza al 80% y 95%? Dame el codigo completo."

Despues de leer la respuesta:
- Implementa Prophet con los regressores y el evento COVID.
- Compara el MAPE de Prophet vs ARIMA vs Holt-Winters.

## Que aprendiste

- Las series de tiempo tienen 4 componentes: tendencia, estacionalidad, ciclo y ruido.
- El test ADF (Dickey-Fuller aumentado) verifica estacionariedad — necesaria para ARIMA.
- `ARIMA(p,d,q)` modela tendencia (`d`), autocorrelacion (`p`) y media movil (`q`).
- Holt-Winters es simple, rapido e interpretable — excelente baseline para series con estacionalidad clara.
- MAPE (Mean Absolute Percentage Error) es la metrica mas usada en forecast: `|real - pred| / real`.
- Prophet maneja automaticamente feriados, tendencias no lineales y regressores externos.

## Reto extra

Construye un sistema de alerta temprana de seguridad alimentaria para Ecuador: monitorea las series de tiempo de precios de arroz, papa, tomate y aceite (datos MAGAP). Cuando el forecast del proximo mes supera el precio actual mas 2 desviaciones estandar historicas, genera una alerta en JSON con: producto, precio actual, precio pronosticado, nivel de alerta (amarillo/naranja/rojo), y recomendacion de politica (liberar reserva, importar, subsidio). Ejecuta automaticamente cada primer lunes del mes.
