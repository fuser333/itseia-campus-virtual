# Ejercicio Sesion 2: Regresion Lineal con scikit-learn

**Materia:** Machine Learning I
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Entrenar un modelo de regresion lineal con scikit-learn para predecir el precio de arroz en Ecuador usando datos historicos del INEC, interpretando los coeficientes y evaluando el modelo con MSE y R².

## Contexto

El INEC publica mensualmente el Indice de Precios al Consumidor (IPC) con datos de precios de productos de la canasta basica en Ecuador. El arroz es el producto de mayor consumo en hogares ecuatorianos: una familia promedio gasta $18-$25 mensuales en arroz. Predecir su precio permite a instituciones como el Ministerio de Agricultura anticipar inflacion y planificar subsidios. Este es un problema clasico de regresion lineal.

## Instrucciones

1. Abre Google Colab y crea `sesion02_regresion_arroz.ipynb`.

2. Instala e importa las librerias necesarias:

```python
# Machine Learning I - Sesion 2: Regresion Lineal
# ITSEIA - Periodo 3

import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

print("Librerias importadas correctamente")
print(f"scikit-learn version: {__import__('sklearn').__version__}")
```

3. Crea el dataset simulado con datos reales del INEC (precios promedio mensuales en USD/kg):

```python
# Datos de precio de arroz en Ecuador 2020-2024 (INEC - IPC)
# Mes codificado como numero (1 = Enero 2020, 60 = Diciembre 2024)
np.random.seed(42)

meses = np.arange(1, 61)  # 60 meses (5 años)

# Precio base con tendencia real + variacion estacional + ruido
# Promedio historico: $0.85 - $1.20 por kg
precio_base = 0.82
tendencia = 0.005 * meses
estacionalidad = 0.04 * np.sin(2 * np.pi * meses / 12)
ruido = np.random.normal(0, 0.03, size=60)

precios = precio_base + tendencia + estacionalidad + ruido

# Mostrar los primeros datos
print("Muestra de datos (mes, precio USD/kg):")
for i in range(0, 12):
    print(f"  Mes {meses[i]:2d}: ${precios[i]:.3f}")
print(f"\nPrecio minimo: ${precios.min():.3f}")
print(f"Precio maximo: ${precios.max():.3f}")
print(f"Precio promedio: ${precios.mean():.3f}")
```

4. Divide los datos y entrena el modelo:

```python
# Preparar datos para scikit-learn (requiere array 2D como X)
X = meses.reshape(-1, 1)  # Variable independiente: mes
y = precios               # Variable dependiente: precio

# Dividir en train (80%) y test (20%)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"Datos de entrenamiento: {len(X_train)} meses")
print(f"Datos de prueba: {len(X_test)} meses")

# Crear y entrenar el modelo
modelo = LinearRegression()
modelo.fit(X_train, y_train)

# Coeficientes del modelo
print(f"\nEcuacion del modelo:")
print(f"  precio = {modelo.coef_[0]:.5f} * mes + {modelo.intercept_:.4f}")
print(f"\nInterpretacion: por cada mes adicional, el precio sube ${modelo.coef_[0]:.4f}")
```

5. Evalua el modelo y visualiza:

```python
# Predicciones en el set de prueba
y_pred = modelo.predict(X_test)

# Metricas de evaluacion
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print("METRICAS DE EVALUACION:")
print(f"  MSE  (Error Cuadratico Medio): {mse:.6f}")
print(f"  RMSE (Raiz del MSE):           ${rmse:.4f}")
print(f"  R²   (Coeficiente determinacion): {r2:.4f}")
print(f"\nInterpretacion R²: el modelo explica el {r2*100:.1f}% de la variacion del precio")

# Graficar
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Grafico 1: Datos reales vs linea de regresion
ax1.scatter(X_train, y_train, color='#1F2F58', alpha=0.6, label='Entrenamiento', s=30)
ax1.scatter(X_test, y_test, color='#F0846D', alpha=0.8, label='Prueba (real)', s=50)
ax1.plot(X, modelo.predict(X), color='#FBBC0C', linewidth=2.5, label='Modelo')
ax1.set_xlabel('Mes (1=Ene 2020, 60=Dic 2024)')
ax1.set_ylabel('Precio USD/kg')
ax1.set_title('Regresion Lineal: Precio de Arroz Ecuador')
ax1.legend()
ax1.grid(True, alpha=0.3)

# Grafico 2: Real vs Predicho (scatter de evaluacion)
ax2.scatter(y_test, y_pred, color='#73B8E7', alpha=0.7, s=60)
ax2.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()],
         'r--', linewidth=1.5, label='Prediccion perfecta')
ax2.set_xlabel('Precio Real (USD/kg)')
ax2.set_ylabel('Precio Predicho (USD/kg)')
ax2.set_title(f'Real vs Predicho  |  R² = {r2:.3f}')
ax2.legend()
ax2.grid(True, alpha=0.3)

plt.suptitle('Machine Learning I - ITSEIA P3', fontsize=10, color='gray')
plt.tight_layout()
plt.show()

# Prediccion futura
mes_futuro = np.array([[65]])  # Mayo 2025
precio_futuro = modelo.predict(mes_futuro)
print(f"\nPrediccion para Mayo 2025 (mes 65): ${precio_futuro[0]:.3f}/kg")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "En scikit-learn, entrenare un modelo de regresion lineal. Explica que significa R² = 0.85 vs R² = 0.30. ¿Cuando un modelo de regresion lineal es suficientemente bueno para produccion? Dame un criterio practico."

Despues de leer la respuesta:
- Pregunta: "Mi modelo tiene RMSE de $0.04. El precio promedio del arroz es $1.00. ¿Ese error es aceptable para predecir precios de canasta basica?"
- Agrega la conclusion como comentario en tu notebook.

## Que aprendiste

- `LinearRegression()` de scikit-learn entrena en 2 lineas: `.fit(X_train, y_train)`.
- `modelo.coef_` es la pendiente (cuanto cambia y por cada unidad de X) y `modelo.intercept_` es el intercepto.
- `train_test_split` divide los datos para evitar evaluar el modelo con los mismos datos con que se entrenó.
- **MSE/RMSE** miden el error en las mismas unidades de la variable objetivo (USD/kg en este caso).
- **R²** mide que proporcion de la variacion es explicada por el modelo; 1.0 es perfecto, 0 es equivalente a usar solo el promedio.

## Reto extra

Descarga el dataset real de IPC del INEC desde `inec.gob.ec/estadisticas/?option=com_contenido`. Filtra los datos de arroz y repite el ejercicio con datos reales. Compara tu R² con el del ejercicio simulado. ¿Que tan bien funciona el modelo lineal con datos reales?
