# Ejercicio Sesion 7: Redes Neuronales con Keras

**Materia:** Analitica Predictiva
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 50 min

## Objetivo

Construir redes neuronales densas (MLP) con Keras/TensorFlow para clasificacion y regresion: arquitectura, activaciones, regularizacion (Dropout, BatchNorm, L2), optimizadores (Adam, SGD), callbacks (EarlyStopping, ReduceLROnPlateau), y comparacion vs modelos clasicos en datos economicos ecuatorianos.

## Contexto

Las redes neuronales son la base del Deep Learning. En Ecuador, Banco Guayaquil y el Banco Central usan MLP para prediccion de series financieras. La red neuronal permite capturar patrones no lineales complejos que la regresion logistica o los arboles no pueden — al costo de mayor complejidad y menor interpretabilidad.

## Instrucciones

1. Instala: `pip install tensorflow keras`.

2. Crea el archivo `sesion07_redes_neuronales_ecuador.py`:

```python
# Redes Neuronales MLP - ITSEIA
# Analitica Predictiva
# Dataset: prediccion credito + demanda mercado Ecuador

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_auc_score, accuracy_score, mean_squared_error, r2_score
from sklearn.ensemble import GradientBoostingClassifier
import warnings
warnings.filterwarnings("ignore")

np.random.seed(2026)
print("=" * 65)
print("REDES NEURONALES MLP — DATOS FINANCIEROS ECUADOR")
print("=" * 65)

# Verificar TensorFlow
try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras import layers, regularizers, callbacks
    tf.random.set_seed(2026)
    print(f"  TensorFlow version: {tf.__version__}")
    USE_TF = True
except ImportError:
    print("  TensorFlow no instalado — instala con: pip install tensorflow")
    print("  Ejecutando con sklearn como fallback...")
    USE_TF = False

# ================================================
# DATASET: CREDITO CORPORATIVO BANCO GUAYAQUIL
# ================================================
print("\n--- DATASET: CREDITO CORPORATIVO ---")

n = 2500
df = pd.DataFrame({
    "ventas_anuales_log":     np.random.normal(13, 1.5, n),   # log(ventas)
    "ratio_deuda_activos":    np.random.uniform(0.1, 0.9, n),
    "ratio_liquidez":         np.random.uniform(0.5, 3.0, n),
    "roa":                    np.random.normal(0.05, 0.08, n), # retorno sobre activos
    "crecimiento_ventas":     np.random.normal(0.08, 0.15, n),
    "anos_empresa":           np.random.randint(1, 40, n),
    "sector_riesgo":          np.random.uniform(0, 1, n),      # score sector
    "historial_credito":      np.random.uniform(0, 1, n),
    "num_empleados_log":      np.random.normal(4, 1.2, n),
    "cobertura_interes":      np.random.uniform(0.5, 10, n),
    "diversificacion_ingresos": np.random.uniform(0, 1, n),
    "tiene_garantias":        np.random.binomial(1, 0.65, n),
    "monto_solicitado_log":   np.random.normal(11, 1.2, n),
})

# Target: default en 12 meses
log_odds = (
    -4.5
    + 2.0 * df["ratio_deuda_activos"]
    - 1.5 * df["roa"]
    - 1.2 * df["historial_credito"]
    - 0.3 * df["ratio_liquidez"]
    + 0.8 * df["sector_riesgo"]
    - 0.5 * df["tiene_garantias"]
    + np.random.normal(0, 0.7, n)
)
df["default"] = (1/(1+np.exp(-log_odds)) > 0.45).astype(int)
print(f"  Dataset: {n} empresas | Default rate: {df['default'].mean()*100:.1f}%")

X = df.drop(columns=["default"]).values
y = df["default"].values

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
X_train, X_val, y_train, y_val = train_test_split(
    X_train, y_train, test_size=0.15, random_state=42, stratify=y_train
)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_val_s   = scaler.transform(X_val)
X_test_s  = scaler.transform(X_test)

print(f"  Train: {len(X_train)} | Val: {len(X_val)} | Test: {len(X_test)}")

if USE_TF:
    # ================================================
    # RED NEURONAL 1: BASELINE MLP
    # ================================================
    print("\n--- MLP BASELINE ---")

    def crear_mlp_baseline(input_dim):
        model = keras.Sequential([
            layers.Input(shape=(input_dim,)),
            layers.Dense(64, activation="relu"),
            layers.Dense(32, activation="relu"),
            layers.Dense(16, activation="relu"),
            layers.Dense(1, activation="sigmoid")
        ])
        model.compile(
            optimizer="adam",
            loss="binary_crossentropy",
            metrics=["accuracy", keras.metrics.AUC(name="auc")]
        )
        return model

    mlp_base = crear_mlp_baseline(X_train_s.shape[1])
    mlp_base.summary()

    hist_base = mlp_base.fit(
        X_train_s, y_train,
        validation_data=(X_val_s, y_val),
        epochs=50, batch_size=64, verbose=0
    )

    y_prob_base = mlp_base.predict(X_test_s, verbose=0).flatten()
    auc_base = roc_auc_score(y_test, y_prob_base)
    acc_base = accuracy_score(y_test, (y_prob_base > 0.5).astype(int))
    print(f"  MLP Baseline — AUC: {auc_base:.4f} | Accuracy: {acc_base:.4f}")

    # ================================================
    # RED NEURONAL 2: MLP CON REGULARIZACION
    # ================================================
    print("\n--- MLP CON REGULARIZACION ---")

    def crear_mlp_regularizado(input_dim, dropout_rate=0.3):
        model = keras.Sequential([
            layers.Input(shape=(input_dim,)),
            layers.Dense(128, kernel_regularizer=regularizers.l2(0.001)),
            layers.BatchNormalization(),
            layers.Activation("relu"),
            layers.Dropout(dropout_rate),

            layers.Dense(64, kernel_regularizer=regularizers.l2(0.001)),
            layers.BatchNormalization(),
            layers.Activation("relu"),
            layers.Dropout(dropout_rate),

            layers.Dense(32),
            layers.Activation("relu"),
            layers.Dropout(dropout_rate / 2),

            layers.Dense(1, activation="sigmoid")
        ])
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss="binary_crossentropy",
            metrics=["accuracy", keras.metrics.AUC(name="auc")]
        )
        return model

    mlp_reg = crear_mlp_regularizado(X_train_s.shape[1])

    callbacks_list = [
        callbacks.EarlyStopping(monitor="val_auc", patience=15,
                                 restore_best_weights=True, mode="max"),
        callbacks.ReduceLROnPlateau(monitor="val_loss", patience=7,
                                     factor=0.5, min_lr=1e-6),
    ]

    hist_reg = mlp_reg.fit(
        X_train_s, y_train,
        validation_data=(X_val_s, y_val),
        epochs=150, batch_size=64, verbose=0,
        callbacks=callbacks_list
    )

    y_prob_reg = mlp_reg.predict(X_test_s, verbose=0).flatten()
    auc_reg = roc_auc_score(y_test, y_prob_reg)
    acc_reg = accuracy_score(y_test, (y_prob_reg > 0.5).astype(int))

    epocas_entrenadas = len(hist_reg.history["loss"])
    print(f"  MLP Regularizado — AUC: {auc_reg:.4f} | Accuracy: {acc_reg:.4f}")
    print(f"  Epocas entrenadas (EarlyStopping): {epocas_entrenadas}/150")
    print(f"  Mejora vs Baseline: {(auc_reg - auc_base)*100:+.2f}pp AUC")

    # ================================================
    # COMPARACION: MLP vs GBM
    # ================================================
    print("\n--- COMPARACION: MLP vs GRADIENT BOOSTING ---")

    gbm = GradientBoostingClassifier(n_estimators=100, random_state=42)
    gbm.fit(X_train_s, y_train)
    y_prob_gbm = gbm.predict_proba(X_test_s)[:, 1]
    auc_gbm = roc_auc_score(y_test, y_prob_gbm)

    print(f"  MLP Baseline:    AUC = {auc_base:.4f}")
    print(f"  MLP Regularizado: AUC = {auc_reg:.4f}")
    print(f"  Gradient Boosting: AUC = {auc_gbm:.4f}")
    ganador = max([("MLP Base", auc_base), ("MLP Reg", auc_reg), ("GBM", auc_gbm)],
                   key=lambda x: x[1])
    print(f"  Ganador: {ganador[0]} (AUC={ganador[1]:.4f})")

    # ================================================
    # VISUALIZACION
    # ================================================
    fig = plt.figure(figsize=(16, 10))
    gs = gridspec.GridSpec(2, 3, figure=fig, hspace=0.45, wspace=0.35)

    # Loss curves baseline
    ax1 = fig.add_subplot(gs[0, 0])
    ax1.plot(hist_base.history["loss"], color="#1F2F58", label="Train")
    ax1.plot(hist_base.history["val_loss"], color="#FBBC0C", label="Val")
    ax1.set_title("MLP Baseline — Loss")
    ax1.set_xlabel("Epoch"); ax1.set_ylabel("Binary CE Loss")
    ax1.legend()

    # AUC curves regularizado
    ax2 = fig.add_subplot(gs[0, 1])
    ax2.plot(hist_reg.history["auc"], color="#1F2F58", label="Train AUC")
    ax2.plot(hist_reg.history["val_auc"], color="#F0846D", label="Val AUC")
    ax2.axvline(epocas_entrenadas-1, color="gray", linestyle="--",
                label=f"EarlyStopping (ep={epocas_entrenadas})")
    ax2.set_title("MLP Regularizado — AUC Training")
    ax2.legend(fontsize=8)

    # Comparacion barras
    ax3 = fig.add_subplot(gs[0, 2])
    nombres = ["MLP Base", "MLP Reg", "GBM"]
    aucs = [auc_base, auc_reg, auc_gbm]
    bars = ax3.bar(nombres, aucs, color=["#1F2F58","#73B8E7","#FBBC0C"])
    for bar, val in zip(bars, aucs):
        ax3.text(bar.get_x() + bar.get_width()/2, val + 0.005,
                 f"{val:.4f}", ha="center", fontsize=9)
    ax3.set_ylim(0.7, 0.95)
    ax3.set_title("AUC Comparativo")

    # Distribucion scores
    ax4 = fig.add_subplot(gs[1, :2])
    ax4.hist(y_prob_reg[y_test == 0], bins=40, alpha=0.6, color="#73B8E7", label="No default")
    ax4.hist(y_prob_reg[y_test == 1], bins=40, alpha=0.6, color="#F0846D", label="Default")
    ax4.axvline(0.5, color="black", linestyle="--", label="Threshold 0.5")
    ax4.set_title("Distribucion de Probabilidades — MLP Regularizado")
    ax4.set_xlabel("P(default)"); ax4.legend()

    # Arquitectura texto
    ax5 = fig.add_subplot(gs[1, 2])
    ax5.axis("off")
    ax5.text(0.5, 0.95, "ARQUITECTURA MLP REGULARIZADO", ha="center",
             fontsize=10, fontweight="bold", transform=ax5.transAxes)
    capas_texto = [
        f"Input: {X_train_s.shape[1]} features",
        "Dense(128) → BatchNorm → ReLU → Dropout(0.3)",
        "Dense(64)  → BatchNorm → ReLU → Dropout(0.3)",
        "Dense(32)  → ReLU → Dropout(0.15)",
        "Dense(1)   → Sigmoid",
        "",
        f"Optimizer: Adam (lr=0.001)",
        f"Loss: Binary Crossentropy",
        f"Regularizacion: L2(0.001) + Dropout",
        f"Callbacks: EarlyStopping + ReduceLR",
    ]
    for i, txt in enumerate(capas_texto):
        ax5.text(0.05, 0.85 - i * 0.08, txt, fontsize=8, transform=ax5.transAxes)

    plt.suptitle("Redes Neuronales MLP — Credito Corporativo Ecuador",
                 fontsize=13, fontweight="bold", y=1.01)
    plt.savefig("redes_neuronales_ecuador.png", dpi=150, bbox_inches="tight")
    plt.close()
    print("\n  Grafico guardado: redes_neuronales_ecuador.png")

else:
    # Fallback sin TF
    print("\n  Sin TensorFlow — comparando GBM vs LogReg como demostración")
    from sklearn.linear_model import LogisticRegression
    gbm = GradientBoostingClassifier(n_estimators=100, random_state=42)
    lr  = LogisticRegression(max_iter=1000, random_state=42)
    gbm.fit(X_train_s, y_train)
    lr.fit(X_train_s, y_train)
    print(f"  GBM AUC: {roc_auc_score(y_test, gbm.predict_proba(X_test_s)[:,1]):.4f}")
    print(f"  LR AUC:  {roc_auc_score(y_test, lr.predict_proba(X_test_s)[:,1]):.4f}")

print("\n" + "=" * 65)
print("REDES NEURONALES — CONCEPTOS CLAVE:")
print("  Capas densas:  aprendizaje no lineal con activaciones (ReLU, Sigmoid)")
print("  BatchNorm:     normaliza activaciones → entrenamiento mas estable")
print("  Dropout:       apaga neuronas aleatoriamente → reduce overfitting")
print("  EarlyStopping: para cuando val_loss no mejora → ahorra tiempo")
print("  ReduceLROnPlateau: baja lr cuando el aprendizaje se estanca")
print("  Adam:          optimizador adaptativo — el mas usado en MLP")
print("=" * 65)
```

3. Agrega una red neuronal para regresion (prediccion de ventas mensuales) y evalua con MSE, MAE y R².

4. Experimenta con diferentes arquitecturas: 2 capas vs 4 capas, y analiza el efecto en overfitting.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Construi una red neuronal MLP para predecir default de empresas en Ecuador con AUC=0.86. El modelo tiene 128-64-32-1 neuronas con ReLU y Dropout. El CEO del banco me pregunta: ¿por que el modelo predice 'default' para esta empresa especifica? No puede usar SHAP en produccion por latencia. ¿Que alternativas mas rapidas de explicabilidad existen para redes neuronales? Dame el codigo de LIME (Local Interpretable Model-agnostic Explanations) para explicar una prediccion individual."

Despues de leer la respuesta:
- Implementa LIME para explicar las 3 predicciones de mayor riesgo en el test set.
- Compara la explicacion de LIME con los coeficientes de la regresion logistica para las mismas observaciones.

## Que aprendiste

- Una red neuronal MLP aprende representaciones jerarquicas de los datos a traves de capas de neuronas.
- BatchNormalization normaliza las activaciones de cada capa — acelera convergencia y estabiliza entrenamiento.
- Dropout(p) apaga p% de neuronas aleatoriamente en cada step — el regularizador mas efectivo en redes neuronales.
- EarlyStopping con `restore_best_weights=True` regresa al mejor modelo aunque el entrenamiento haya continuado.
- Adam con `learning_rate=0.001` es el punto de partida estandar para MLP — ajustar con ReduceLROnPlateau.
- MLP supera a GBM en datasets grandes (>10K) con features numericas densas; GBM es mejor con tabular y pocos datos.

## Reto extra

Construye una red neuronal LSTM para predecir la demanda semanal de productos en supermercados ecuatorianos: usa 3 anos de datos historicos de ventas, agrega variables externas (feriados, quincena de pago, inflacion), implementa la arquitectura LSTM(64)-LSTM(32)-Dense(1), compara con el Prophet del ejercicio anterior, y despliega el modelo como API REST con FastAPI + TFServing para inferencia en tiempo real.
