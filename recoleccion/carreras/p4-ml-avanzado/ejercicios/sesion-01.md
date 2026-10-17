# Ejercicio Sesion 1: Deep Learning con PyTorch

**Materia:** Machine Learning Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Implementar redes neuronales profundas con PyTorch: tensores, autograd, capas personalizadas, entrenamiento con GPU-ready code, regularizacion y diagnostico de entrenamiento — aplicado a la prediccion de desercion universitaria en institutos tecnologicos del Ecuador.

## Contexto

La SENESCYT Ecuador reporta una tasa de desercion del 26% en institutos tecnologicos. Un modelo de deep learning puede predecir que estudiantes tienen riesgo de abandonar en los primeros 2 semestres — permitiendo intervencion temprana con tutoria y apoyo economico. PyTorch es el framework de investigacion y produccion mas usado en 2025: flexible, Pythonic, y con soporte nativo para GPU en AWS y Google Colab.

## Instrucciones

1. Instala: `pip install torch`.

2. Crea el archivo `sesion01_deep_learning_pytorch_ecuador.py`:

```python
# Deep Learning con PyTorch - ITSEIA
# Machine Learning Avanzado
# Prediccion desercion estudiantil — institutos Ecuador

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, TensorDataset
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
import warnings
warnings.filterwarnings("ignore")

torch.manual_seed(2026)
np.random.seed(2026)

print("=" * 65)
print("DEEP LEARNING PyTorch — DESERCION ESTUDIANTIL ECUADOR")
print("=" * 65)

# ================================================
# CONCEPTOS BASICOS: TENSORES Y AUTOGRAD
# ================================================
print("\n--- CONCEPTOS PYTORCH: TENSORES ---")

# Tensor basico
x = torch.tensor([[1.0, 2.0], [3.0, 4.0]])
y = torch.tensor([[5.0, 6.0], [7.0, 8.0]])

print(f"  Tensor x shape:  {x.shape} | dtype: {x.dtype}")
print(f"  Matmul x @ y:    {(x @ y).tolist()}")

# Autograd — calculo automatico de gradientes
w = torch.tensor(2.0, requires_grad=True)
b = torch.tensor(1.0, requires_grad=True)
loss = (w * 3.0 + b - 10.0) ** 2  # f(w,b) = (3w + b - 10)^2

loss.backward()
print(f"\n  Autograd demo:   loss = {loss.item():.2f}")
print(f"  dL/dw:           {w.grad.item():.2f}  (esperado: 2*(3w+b-10)*3)")
print(f"  dL/db:           {b.grad.item():.2f}  (esperado: 2*(3w+b-10)*1)")

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"\n  Dispositivo:     {device}")

# ================================================
# DATASET: ESTUDIANTES INSTITUTOS ECUADOR
# ================================================
print("\n--- DATASET: DESERCION ESTUDIANTIL ECUADOR ---")

N = 5_000
carreras = ["Tecnologia_IA","Ciencia_Datos","Big_Data","Sistemas","Electronica"]
provincias = ["Pichincha","Guayas","Azuay","Manabi","Tungurahua"]

df = pd.DataFrame({
    "edad":              np.random.normal(21, 3, N).clip(17, 45).round(0),
    "promedio_bachiller": np.random.normal(7.8, 1.2, N).clip(4, 10).round(1),
    "asistencia_s1_pct": np.random.uniform(40, 100, N).round(1),
    "promedio_s1":       np.random.normal(6.5, 1.8, N).clip(0, 10).round(2),
    "n_materias_reprobadas": np.random.choice([0,1,2,3,4], N, p=[0.50,0.25,0.15,0.07,0.03]),
    "trabaja":           np.random.binomial(1, 0.45, N),
    "distancia_km":      np.random.lognormal(2.5, 1.0, N).clip(1, 200).round(1),
    "recibe_beca":       np.random.binomial(1, 0.30, N),
    "n_hermanos":        np.random.choice([0,1,2,3,4], N, p=[0.15,0.30,0.30,0.15,0.10]),
    "primer_generacion": np.random.binomial(1, 0.55, N),  # primero en familia en estudiar
    "carrera":           np.random.choice(range(len(carreras)), N),
    "provincia":         np.random.choice(range(len(provincias)), N),
    "horas_estudio_sem": np.random.uniform(2, 30, N).round(1),
    "usa_tutoria":       np.random.binomial(1, 0.25, N),
})

# Etiqueta: desercion (1 = abandono)
prob_desercion = (
    0.30
    - 0.08 * (df["promedio_s1"] > 7).astype(float)
    + 0.12 * df["trabaja"]
    + 0.08 * (df["asistencia_s1_pct"] < 70).astype(float)
    + 0.10 * (df["n_materias_reprobadas"] > 1).astype(float)
    - 0.06 * df["recibe_beca"]
    + 0.04 * df["primer_generacion"]
    - 0.04 * df["usa_tutoria"]
    + np.random.normal(0, 0.05, N)
).clip(0.01, 0.99)

df["desercion"] = (np.random.random(N) < prob_desercion).astype(int)

print(f"  Dataset: {df.shape}")
print(f"  Tasa de desercion: {df['desercion'].mean()*100:.1f}%")

# Preprocesamiento
feature_cols = [c for c in df.columns if c != "desercion"]
X = df[feature_cols].values.astype(np.float32)
y = df["desercion"].values.astype(np.float32)

scaler = StandardScaler()
X = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                      stratify=y, random_state=42)

# Convertir a tensores
X_train_t = torch.FloatTensor(X_train)
y_train_t  = torch.FloatTensor(y_train).unsqueeze(1)
X_test_t   = torch.FloatTensor(X_test)
y_test_t   = torch.FloatTensor(y_test).unsqueeze(1)

train_ds     = TensorDataset(X_train_t, y_train_t)
train_loader = DataLoader(train_ds, batch_size=128, shuffle=True)

print(f"  Train: {X_train.shape} | Test: {X_test.shape}")

# ================================================
# RED NEURONAL PROFUNDA
# ================================================
print("\n--- ARQUITECTURA DE LA RED NEURONAL ---")

class RedDesercionEstudiantil(nn.Module):
    """Red profunda con BatchNorm, Dropout y activaciones modernas."""

    def __init__(self, n_features, hidden=[128, 64, 32], dropout=0.3):
        super().__init__()

        capas = []
        in_dim = n_features
        for h in hidden:
            capas += [
                nn.Linear(in_dim, h),
                nn.BatchNorm1d(h),
                nn.ReLU(),
                nn.Dropout(dropout),
            ]
            in_dim = h

        capas.append(nn.Linear(in_dim, 1))
        capas.append(nn.Sigmoid())

        self.red = nn.Sequential(*capas)

    def forward(self, x):
        return self.red(x)

modelo = RedDesercionEstudiantil(n_features=X_train.shape[1])

# Contar parametros
n_params = sum(p.numel() for p in modelo.parameters())
print(f"  Arquitectura:     Input({X_train.shape[1]}) → 128 → 64 → 32 → 1")
print(f"  Parametros:       {n_params:,}")
print(f"  BatchNorm + Dropout(0.3) en cada capa")
print(f"  Activacion final: Sigmoid (clasificacion binaria)")

# ================================================
# ENTRENAMIENTO
# ================================================
print("\n--- ENTRENAMIENTO ---")

criterio  = nn.BCELoss()
optimizador = optim.Adam(modelo.parameters(), lr=1e-3, weight_decay=1e-4)
scheduler = optim.lr_scheduler.StepLR(optimizador, step_size=20, gamma=0.5)

EPOCHS = 40
historial = {"train_loss": [], "train_acc": []}

for epoch in range(1, EPOCHS+1):
    modelo.train()
    total_loss = 0
    total_acc  = 0

    for X_batch, y_batch in train_loader:
        optimizador.zero_grad()
        pred = modelo(X_batch)
        loss = criterio(pred, y_batch)
        loss.backward()
        optimizador.step()

        total_loss += loss.item()
        total_acc  += ((pred > 0.5).float() == y_batch).float().mean().item()

    avg_loss = total_loss / len(train_loader)
    avg_acc  = total_acc  / len(train_loader)
    historial["train_loss"].append(avg_loss)
    historial["train_acc"].append(avg_acc)
    scheduler.step()

    if epoch % 10 == 0:
        print(f"  Epoch {epoch:>3}/{EPOCHS} | Loss: {avg_loss:.4f} | Acc: {avg_acc*100:.1f}%")

# ================================================
# EVALUACION
# ================================================
print("\n--- EVALUACION EN TEST ---")

modelo.eval()
with torch.no_grad():
    probs = modelo(X_test_t).numpy().flatten()
    preds = (probs > 0.5).astype(int)

auc = roc_auc_score(y_test, probs)
print(f"\n  AUC-ROC:   {auc:.4f}")
print(f"\n  Reporte de clasificacion:")
print(classification_report(y_test, preds,
                             target_names=["No abandona","Abandona"],
                             digits=3))

# ================================================
# UMBRAL OPTIMO PARA INTERVENCION
# ================================================
print("--- UMBRAL DE DECISION ---")

umbrales_eval = {}
for umbral in [0.3, 0.4, 0.5, 0.6]:
    p = (probs > umbral).astype(int)
    from sklearn.metrics import precision_score, recall_score, f1_score
    umbrales_eval[umbral] = {
        "precision": precision_score(y_test, p, zero_division=0),
        "recall":    recall_score(y_test, p, zero_division=0),
        "f1":        f1_score(y_test, p, zero_division=0),
        "alertas":   int(p.sum()),
    }

print(f"  {'Umbral':>8} {'Precision':>10} {'Recall':>8} {'F1':>8} {'Alertas':>10}")
for u, m in umbrales_eval.items():
    print(f"  {u:>8.1f} {m['precision']:>10.3f} {m['recall']:>8.3f} "
          f"{m['f1']:>8.3f} {m['alertas']:>10}")

print("\n  Recomendacion: umbral 0.3 maximiza recall (detectar mas deserciones)")
print("  Costo de falso negativo (no detectar) > costo de falso positivo (intervenir innecesariamente)")

print("\n" + "=" * 65)
print("DEEP LEARNING PyTorch — CONCEPTOS CLAVE:")
print("  Tensor:       array N-dimensional con autograd nativo")
print("  Autograd:     calculo automatico de gradientes — backward()")
print("  BatchNorm:    estabiliza el entrenamiento — normaliza activaciones")
print("  Dropout:      regularizacion — apaga neuronas aleatoriamente en train")
print("  Adam:         optimizador adaptativo — mejor que SGD para tabular")
print("  Scheduler:    reduce LR al meseta — evita oscilaciones al final")
print("=" * 65)
```

3. Implementa la atencion mecanismo simple (self-attention de 1 cabeza) sobre los features del estudiante para visualizar que variables atiende mas el modelo.

4. Agrega el callback de early stopping: detener el entrenamiento si el validation loss no mejora en 10 epochs consecutivas.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un modelo PyTorch de clasificacion binaria para prediccion de desercion estudiantil en Ecuador (5,000 estudiantes, 14 features). El modelo tiene AUC 0.78 pero quiero mejorar a 0.85+. Las opciones son: 1) agregar embedding layers para las columnas categoricas (carrera, provincia) en lugar de label encoding, 2) usar una arquitectura residual (skip connections) para features tabulares, 3) aplicar SMOTE para balancear la clase minoritaria (26% desercion). ¿Cual de las tres tiene mayor impacto? Dame el codigo PyTorch para la que recomiendas, con la justificacion estadistica."

Despues de leer la respuesta:
- Implementa los embeddings de entidades para carrera y provincia.
- Compara el AUC antes y despues de agregar embeddings.

## Que aprendiste

- PyTorch usa tensores con autograd — el grafo computacional se construye en el forward pass.
- BatchNorm normaliza las activaciones capa a capa — acelera convergencia y reduce sensibilidad al LR.
- Dropout es regularizacion estocastica — apaga neuronas en entrenamiento para evitar overfitting.
- Adam es el optimizador por defecto para datos tabulares — adapta la tasa de aprendizaje por parametro.
- El umbral de decision no es siempre 0.5 — en problemas de intervencion, se optimiza el recall.
- Los embeddings de entidades aprenden representaciones densas de categorias — mejor que one-hot para alta cardinalidad.

## Reto extra

Construye el sistema de alerta temprana de desercion para el ITSEIA: modelo PyTorch con embeddings de carrera y fraternidad (Luma/Neo), self-attention sobre el historial de asistencia semanal (secuencia temporal), threshold optimo que minimiza el costo total (tutoria=$50, desercion=$3000), dashboard Streamlit que muestra top 20 estudiantes en riesgo con factor explicativo principal, y API FastAPI que recibe el perfil del estudiante y retorna el score en tiempo real. Despliega en AWS Lambda con latencia < 200ms.
