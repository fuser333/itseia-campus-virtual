# Ejercicio Sesion 3: Regresion Logistica — Clasificacion Binaria

**Materia:** Machine Learning I
**Nivel:** Intermedio
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Entrenar un modelo de regresion logistica para predecir si un microcredito del BanEcuador sera pagado o caera en mora, interpretando probabilidades, la funcion sigmoide y la matriz de confusion.

## Contexto

El BanEcuador (antes BNF) es el principal banco publico de Ecuador con mas de 350,000 microcreditos activos al ano. La tasa de morosidad en microcreditos supera el 12%, segun la Superintendencia de Bancos del Ecuador. Un modelo de clasificacion binaria que prediga si un credito sera pagado (1) o entrara en mora (0) permite al banco asignar mejor los recursos y reducir perdidas. Este es uno de los casos de uso mas demandados en el sector financiero ecuatoriano.

## Instrucciones

1. Abre Google Colab y crea `sesion03_credito_banecuador.ipynb`.

2. Importa librerias y crea el dataset:

```python
# Machine Learning I - Sesion 3: Regresion Logistica
# ITSEIA - Periodo 3

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (accuracy_score, confusion_matrix,
                              classification_report, roc_curve, auc)
from sklearn.preprocessing import StandardScaler

np.random.seed(2024)

# Simular dataset de microcreditos BanEcuador
n = 800  # 800 creditos

# Variables del solicitante
edad = np.random.randint(22, 65, n)
ingresos_mensuales = np.random.normal(650, 200, n).clip(300, 2500)  # USD
monto_credito = np.random.choice([1000, 2000, 3000, 5000, 8000], n)
historial_credito = np.random.randint(0, 5, n)  # 0=ninguno, 4=excelente
numero_dependientes = np.random.randint(0, 6, n)

# Variable objetivo: 1=pagara, 0=mora
# Factores que reducen mora: buenos ingresos, buen historial, edad media
prob_pago = (
    0.3
    + 0.25 * (ingresos_mensuales / 2500)
    + 0.20 * (historial_credito / 4)
    - 0.10 * (monto_credito / 8000)
    - 0.05 * (numero_dependientes / 5)
    + 0.05 * np.random.randn(n)
).clip(0.05, 0.95)

pago = (np.random.rand(n) < prob_pago).astype(int)

df = pd.DataFrame({
    'edad': edad,
    'ingresos_mensuales': ingresos_mensuales.round(2),
    'monto_credito': monto_credito,
    'historial_credito': historial_credito,
    'numero_dependientes': numero_dependientes,
    'pago_correcto': pago
})

print("Dataset BanEcuador - Microcreditos")
print(f"Total registros: {len(df)}")
print(f"Pagaron (1): {df['pago_correcto'].sum()} ({df['pago_correcto'].mean()*100:.1f}%)")
print(f"En mora (0): {(df['pago_correcto']==0).sum()} ({(df['pago_correcto']==0).mean()*100:.1f}%)")
print("\nPrimeras filas:")
print(df.head())
```

3. Prepara los datos y entrena el modelo:

```python
# Variables predictoras y objetivo
X = df.drop('pago_correcto', axis=1)
y = df['pago_correcto']

# Dividir datos
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Escalar features (importante para regresion logistica)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Entrenar modelo
modelo = LogisticRegression(random_state=42, max_iter=1000)
modelo.fit(X_train_scaled, y_train)

print("Modelo entrenado exitosamente")
print("\nCoeficientes (influencia de cada variable):")
for feature, coef in zip(X.columns, modelo.coef_[0]):
    direccion = "aumenta" if coef > 0 else "reduce"
    print(f"  {feature:25s}: {coef:+.4f}  -> {direccion} probabilidad de pago")
```

4. Evalua con metricas y visualiza:

```python
# Predicciones
y_pred = modelo.predict(X_test_scaled)
y_prob = modelo.predict_proba(X_test_scaled)[:, 1]  # Probabilidad de pago

# Metricas
accuracy = accuracy_score(y_test, y_pred)
print(f"\nACCURACY: {accuracy:.4f} ({accuracy*100:.2f}%)")
print("\nREPORTE COMPLETO:")
print(classification_report(y_test, y_pred, target_names=['Mora', 'Pago correcto']))

# Ejemplo de prediccion individual
nuevo_cliente = pd.DataFrame({
    'edad': [35],
    'ingresos_mensuales': [800],
    'monto_credito': [3000],
    'historial_credito': [3],
    'numero_dependientes': [2]
})
nuevo_scaled = scaler.transform(nuevo_cliente)
prob = modelo.predict_proba(nuevo_scaled)[0][1]
decision = "APROBAR" if prob > 0.6 else "RECHAZAR"
print(f"\nNuevo cliente - Probabilidad de pago: {prob:.2%}")
print(f"Decision recomendada: {decision}")

# Visualizacion: Matriz de confusion + Curva ROC
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(13, 5))

# Matriz de confusion
cm = confusion_matrix(y_test, y_pred)
im = ax1.imshow(cm, interpolation='nearest', cmap='Blues')
ax1.set_title('Matriz de Confusion - Creditos BanEcuador')
ax1.set_xlabel('Predicho')
ax1.set_ylabel('Real')
ax1.set_xticks([0, 1])
ax1.set_yticks([0, 1])
ax1.set_xticklabels(['Mora', 'Pago'])
ax1.set_yticklabels(['Mora', 'Pago'])
for i in range(2):
    for j in range(2):
        ax1.text(j, i, str(cm[i][j]), ha='center', va='center',
                 fontsize=16, fontweight='bold',
                 color='white' if cm[i][j] > cm.max()/2 else 'black')
plt.colorbar(im, ax=ax1)

# Curva ROC
fpr, tpr, _ = roc_curve(y_test, y_prob)
roc_auc = auc(fpr, tpr)
ax2.plot(fpr, tpr, color='#FBBC0C', linewidth=2.5, label=f'ROC (AUC = {roc_auc:.3f})')
ax2.plot([0, 1], [0, 1], 'k--', linewidth=1)
ax2.set_xlabel('Tasa Falsos Positivos')
ax2.set_ylabel('Tasa Verdaderos Positivos')
ax2.set_title('Curva ROC - Modelo Credito')
ax2.legend(loc='lower right')
ax2.grid(True, alpha=0.3)

plt.suptitle('Regresion Logistica - BanEcuador | ITSEIA P3', color='gray')
plt.tight_layout()
plt.show()
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Estoy evaluando un modelo de clasificacion binaria para aprobar creditos bancarios en Ecuador. Mi accuracy es 78% y AUC-ROC es 0.84. En la matriz de confusion tengo: 20 falsos negativos (mora predicha como pago) y 8 falsos positivos (pago predicho como mora). ¿Cual error le cuesta mas dinero al banco? ¿Como ajusto el umbral de decision?"

Despues de leer la respuesta:
- Implementa el ajuste de umbral que Claude sugiera.
- Compara los resultados con umbral 0.5 vs el umbral recomendado.

## Que aprendiste

- La regresion logistica clasifica prediciendo la **probabilidad** de pertenecer a una clase mediante la funcion sigmoide.
- `predict_proba()` devuelve probabilidades; `predict()` aplica el umbral (0.5 por defecto).
- La **matriz de confusion** distingue entre falsos positivos y falsos negativos, cada uno con diferente costo de negocio.
- **StandardScaler** es critico antes de regresion logistica para que todas las variables tengan la misma escala.
- La **curva ROC y AUC** miden la capacidad del modelo de discriminar entre clases, independientemente del umbral.

## Reto extra

Agrega una variable nueva al dataset: `antiguedad_laboral` (años trabajando, entre 0 y 20). Reentrenar el modelo y verifica si el AUC mejora. Luego cambia el umbral de decision de 0.5 a 0.7 (mas conservador para aprobar creditos) y recalcula cuantos creditos adicionales se rechazan y cuantas moras se evitan.
