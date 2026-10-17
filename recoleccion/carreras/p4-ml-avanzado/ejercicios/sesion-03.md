# Ejercicio Sesion 3: Computer Vision

**Materia:** Machine Learning Avanzado
**Nivel:** Intermedio-Avanzado
**Herramienta IA:** Gemini
**Duracion estimada:** 45 min

## Objetivo

Aplicar Computer Vision con redes convolucionales (CNN) y transfer learning para clasificacion de imagenes, deteccion de objetos y OCR — en casos de uso reales del Ecuador: clasificacion de cultivos agricolas MAGAP, deteccion de infraestructura vial, y lectura automatica de facturas del SRI.

## Contexto

El MAGAP Ecuador necesita clasificar automaticamente 50,000 imagenes satelitales de cultivos para el Sistema de Informacion Nacional de Agricultura. El SRI procesa 3 millones de facturas fisicas anuales que requieren digitalizacion. Actualmente ambos procesos son manuales. Transfer learning con ResNet o EfficientNet permite construir clasificadores con precision > 90% usando solo 500-1000 imagenes etiquetadas propias — sin GPUs costosas ni datos masivos.

## Instrucciones

1. Instala: `pip install torch torchvision pillow`.

2. Crea el archivo `sesion03_computer_vision_ecuador.py`:

```python
# Computer Vision - ITSEIA
# Machine Learning Avanzado
# Vision: cultivos MAGAP + facturas SRI Ecuador

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image
import json
import re
import io
import warnings
warnings.filterwarnings("ignore")

torch.manual_seed(2026)
np.random.seed(2026)

print("=" * 65)
print("COMPUTER VISION — CULTIVOS MAGAP + FACTURAS SRI ECUADOR")
print("=" * 65)

# ================================================
# CONCEPTOS: REDES CONVOLUCIONALES
# ================================================
print("\n--- ARQUITECTURA CNN ---")

conceptos_cnn = {
    "Convolucion":       "Filtro 3x3 o 5x5 que detecta patrones locales (bordes, texturas, formas)",
    "Max Pooling":       "Reduce dimension a la mitad — invarianza a traslacion pequena",
    "Feature Maps":      "Cada filtro genera un mapa de activacion — 64 filtros = 64 mapas",
    "Flatten + FC":      "Aplana feature maps → capas densas para clasificacion final",
    "Transfer Learning": "Usar pesos pre-entrenados (ImageNet) — solo re-entrenar las ultimas capas",
    "Data Augmentation": "Rotar, flip, zoom, brillo — multiplicar dataset sin nuevas imagenes",
    "BatchNorm":         "Normaliza activaciones — acelera convergencia, estabiliza entrenamiento",
    "Dropout":           "Regularizacion — apaga neuronas random en train para evitar overfitting",
}

for k, v in conceptos_cnn.items():
    print(f"  {k:<20}: {v}")

# ================================================
# DATASET SIMULADO: IMAGENES DE CULTIVOS MAGAP
# ================================================
print("\n--- DATASET SIMULADO: CULTIVOS ECUADOR ---")

CLASES_CULTIVOS = ["banano","palma_africana","cacao","cafe","arroz",
                   "papa","maiz","brocoli"]
N_POR_CLASE = 80
N_TOTAL     = N_POR_CLASE * len(CLASES_CULTIVOS)

class DatasetCultivosSimulado(Dataset):
    """
    Simula un dataset de imagenes de cultivos MAGAP.
    En produccion: cargar JPG/PNG reales con ImageFolder.
    """

    CARACTERISTICAS = {
        "banano":        {"hue_mean": 60,  "saturacion": 0.8, "textura": 0.3},
        "palma_africana":{"hue_mean": 80,  "saturacion": 0.7, "textura": 0.6},
        "cacao":         {"hue_mean": 90,  "saturacion": 0.6, "textura": 0.5},
        "cafe":          {"hue_mean": 100, "saturacion": 0.5, "textura": 0.4},
        "arroz":         {"hue_mean": 40,  "saturacion": 0.4, "textura": 0.2},
        "papa":          {"hue_mean": 50,  "saturacion": 0.5, "textura": 0.3},
        "maiz":          {"hue_mean": 55,  "saturacion": 0.6, "textura": 0.4},
        "brocoli":       {"hue_mean": 110, "saturacion": 0.7, "textura": 0.5},
    }

    def __init__(self, n_por_clase=80, transform=None, split="train"):
        self.transform = transform
        self.imagenes  = []
        self.etiquetas = []

        np.random.seed(42 if split == "train" else 99)
        n = int(n_por_clase * (0.8 if split == "train" else 0.2))

        for idx, clase in enumerate(CLASES_CULTIVOS):
            caract = self.CARACTERISTICAS[clase]
            for _ in range(n):
                # Simular imagen como tensor de features en vez de pixels reales
                hue     = np.random.normal(caract["hue_mean"], 10)
                sat     = np.random.normal(caract["saturacion"], 0.1)
                tex     = np.random.normal(caract["textura"], 0.08)
                ruido   = np.random.normal(0, 0.05, 13)
                feature = np.array([hue/180, sat, tex] + ruido.tolist(), dtype=np.float32)
                self.imagenes.append(feature)
                self.etiquetas.append(idx)

    def __len__(self):
        return len(self.imagenes)

    def __getitem__(self, idx):
        x = torch.FloatTensor(self.imagenes[idx])
        y = self.etiquetas[idx]
        return x, y

train_ds = DatasetCultivosSimulado(N_POR_CLASE, split="train")
test_ds  = DatasetCultivosSimulado(N_POR_CLASE, split="test")

train_loader = DataLoader(train_ds, batch_size=32, shuffle=True)
test_loader  = DataLoader(test_ds,  batch_size=32, shuffle=False)

print(f"  Clases:        {len(CLASES_CULTIVOS)}: {', '.join(CLASES_CULTIVOS)}")
print(f"  Train:         {len(train_ds)} imagenes")
print(f"  Test:          {len(test_ds)} imagenes")
print(f"  Features sim:  16 (hue, saturacion, textura + ruido)")

# ================================================
# MODELO: CNN PARA CULTIVOS (TRANSFER LEARNING)
# ================================================
print("\n--- MODELO CNN CULTIVOS (Transfer Learning) ---")

class ClasificadorCultivos(nn.Module):
    """
    Simula transfer learning de EfficientNet.
    En produccion:
        base = models.efficientnet_b0(pretrained=True)
        for param in base.parameters(): param.requires_grad = False
        base.classifier[1] = nn.Linear(base.classifier[1].in_features, n_clases)
    """

    def __init__(self, n_features, n_clases):
        super().__init__()
        # Simula capas pre-entrenadas (congeladas) + cabeza de clasificacion
        self.backbone = nn.Sequential(
            nn.Linear(n_features, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(64, 32),
            nn.BatchNorm1d(32),
            nn.ReLU(),
        )
        # Cabeza de clasificacion (unica parte re-entrenada en transfer learning)
        self.clasificador = nn.Sequential(
            nn.Dropout(0.2),
            nn.Linear(32, n_clases),
        )

    def forward(self, x):
        feats = self.backbone(x)
        return self.clasificador(feats)

modelo_cultivos = ClasificadorCultivos(n_features=16, n_clases=len(CLASES_CULTIVOS))
n_params = sum(p.numel() for p in modelo_cultivos.parameters())
print(f"  Arquitectura: backbone(16→64→32) + clasificador(32→{len(CLASES_CULTIVOS)})")
print(f"  Parametros:   {n_params:,}")

criterio    = nn.CrossEntropyLoss()
optimizador = optim.Adam(modelo_cultivos.parameters(), lr=1e-3)

# Entrenamiento
EPOCHS = 30
for epoch in range(1, EPOCHS+1):
    modelo_cultivos.train()
    for X_batch, y_batch in train_loader:
        optimizador.zero_grad()
        pred = modelo_cultivos(X_batch)
        loss = criterio(pred, y_batch)
        loss.backward()
        optimizador.step()

    if epoch % 10 == 0:
        # Evaluar
        modelo_cultivos.eval()
        correcto = total = 0
        with torch.no_grad():
            for X_b, y_b in test_loader:
                pred = modelo_cultivos(X_b).argmax(dim=1)
                correcto += (pred == y_b).sum().item()
                total    += len(y_b)
        acc = correcto / total * 100
        print(f"  Epoch {epoch:>2}/{EPOCHS} | Test Acc: {acc:.1f}%")

# Evaluacion detallada
modelo_cultivos.eval()
todas_preds = []
todas_reales = []
with torch.no_grad():
    for X_b, y_b in test_loader:
        preds = modelo_cultivos(X_b).argmax(dim=1)
        todas_preds.extend(preds.tolist())
        todas_reales.extend(y_b.tolist())

from sklearn.metrics import classification_report, confusion_matrix
print(f"\n  Reporte por clase:")
print(classification_report(todas_reales, todas_preds,
                             target_names=CLASES_CULTIVOS, digits=2))

# ================================================
# TRANSFER LEARNING: ESTRATEGIAS
# ================================================
print("--- ESTRATEGIAS TRANSFER LEARNING ---")

estrategias = {
    "Feature Extraction": {
        "descripcion": "Congelar todo el backbone, entrenar solo la cabeza",
        "cuando":      "Dataset pequeno (<1,000 imgs) — rapido, pocos epochs",
        "riesgo":      "Si el dominio difiere mucho de ImageNet (ej: satelital)",
    },
    "Fine-tuning parcial": {
        "descripcion": "Descongelar ultimas 2-3 capas del backbone",
        "cuando":      "Dataset mediano (1,000-10,000 imgs) — mejor precision",
        "riesgo":      "Overfitting si el dataset es muy pequeno",
    },
    "Fine-tuning completo": {
        "descripcion": "Descongelar todo, LR muy bajo (1e-5) para el backbone",
        "cuando":      "Dataset grande (>10,000 imgs) — maxima precision",
        "riesgo":      "Caro en computo, puede olvidar features generales",
    },
}

for estrategia, info in estrategias.items():
    print(f"\n  [{estrategia}]")
    for k, v in info.items():
        print(f"    {k:<12}: {v}")

# ================================================
# OCR SIMULADO: FACTURAS SRI ECUADOR
# ================================================
print("\n--- OCR: LECTURA AUTOMATICA DE FACTURAS SRI ---")

class OCRFacturaSRI:
    """
    Simula Tesseract OCR o AWS Textract para facturas SRI Ecuador.
    En produccion: pytesseract.image_to_string(imagen) o boto3.textract
    """

    PATRON_RUC      = re.compile(r'\b\d{13}\b')
    PATRON_FACTURA  = re.compile(r'\d{3}-\d{3}-\d{9}')
    PATRON_MONTO    = re.compile(r'\$\s*[\d,]+\.\d{2}')
    PATRON_IVA      = re.compile(r'IVA\s*[\d]+%?\s*\$?\s*[\d,]+\.\d{2}')
    PATRON_FECHA    = re.compile(r'\d{2}/\d{2}/\d{4}')

    def extraer(self, texto_ocr):
        return {
            "ruc":       (self.PATRON_RUC.findall(texto_ocr)      or [None])[0],
            "factura":   (self.PATRON_FACTURA.findall(texto_ocr)  or [None])[0],
            "montos":    self.PATRON_MONTO.findall(texto_ocr),
            "iva":       (self.PATRON_IVA.findall(texto_ocr)      or [None])[0],
            "fecha":     (self.PATRON_FECHA.findall(texto_ocr)    or [None])[0],
        }

facturas_ejemplo = [
    """RUC: 1712345678001  FECHA: 15/03/2024
    FACTURA No: 001-001-000123456
    CORPORACION FAVORITA C.A.
    Subtotal: $1,250.00
    IVA 15%: $187.50
    TOTAL: $1,437.50""",

    """EMPRESA: DISTRIBUIDORA ANDINA S.A.
    RUC 0990123456001  23/11/2024
    Num Factura 002-015-000987654
    Total sin IVA $ 3,800.00
    IVA 15% $ 570.00
    Total a pagar $4,370.00""",
]

ocr = OCRFacturaSRI()
print(f"\n  Procesando {len(facturas_ejemplo)} facturas SRI:")
for i, factura in enumerate(facturas_ejemplo, 1):
    campos = ocr.extraer(factura)
    print(f"\n  Factura {i}:")
    for k, v in campos.items():
        print(f"    {k:<10}: {v}")

# ================================================
# DATA AUGMENTATION
# ================================================
print("\n--- DATA AUGMENTATION: PIPELINE ---")

augmentation_magap = {
    "RandomHorizontalFlip(0.5)": "Espejo horizontal — cultivos son simetricos",
    "RandomVerticalFlip(0.3)":   "Espejo vertical — imagenes satelitales",
    "RandomRotation(15)":        "Rotar hasta 15 grados — invarianza a orientacion",
    "ColorJitter(brightness=0.2)":"Variacion de brillo — distintas horas del dia",
    "RandomResizedCrop(224)":    "Zoom aleatorio — invarianza a escala",
    "Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])": "Media/std ImageNet",
}

print("  Pipeline de augmentacion para imagenes de cultivos:")
for transform, razon in augmentation_magap.items():
    print(f"  {transform:<50}: {razon}")

print(f"\n  Impacto: 1,000 imagenes originales → ~8,000 aumentadas")
print(f"  Mejora tipica accuracy: +5 a +15 puntos porcentuales")

print("\n" + "=" * 65)
print("COMPUTER VISION — CONCEPTOS CLAVE:")
print("  CNN:             filtros convolucionales detectan features jerarquicos")
print("  Transfer learning: backbone pre-entrenado + cabeza personalizada")
print("  Data augmentation: multiplica el dataset con transformaciones geometricas")
print("  Feature extraction: congelar backbone — rapido con dataset pequeno")
print("  Fine-tuning:     descongelar capas finales — mayor precision")
print("  OCR:             extrae texto de imagenes — regex post-procesamiento")
print("=" * 65)
```

3. Implementa la Grad-CAM (Gradient-weighted Class Activation Mapping) simulada: visualiza que regiones de la imagen activan mas la prediccion de cada cultivo.

4. Agrega la deteccion de enfermedades en cultivos: clasifica si una imagen de hoja de banano muestra "sana", "sigatoka_negra" o "moko".

## Usa IA para...

> Abre Gemini y escribe:
> "El MAGAP Ecuador quiere clasificar imagenes satelitales de 8 tipos de cultivos agricolas con un dataset de solo 500 imagenes etiquetadas por clase. Necesito: 1) comparar EfficientNet-B0 vs ResNet-50 vs MobileNetV3 en terminos de precision, velocidad de inferencia y tamano del modelo — para que el sistema corra en tablets de campo con Android, 2) estrategia de data augmentation especifica para imagenes satelitales (no fotos normales), 3) como manejar el class imbalance si 'banano' tiene 2,000 imagenes pero 'brocoli' solo 200. Dame el codigo PyTorch con la arquitectura que recomiendas y las metricas de evaluacion."

Despues de leer la respuesta:
- Implementa la arquitectura recomendada con el dataset simulado.
- Compara las metricas por clase con y sin class weighting.

## Que aprendiste

- Las CNN detectan features jerarquicos: bordes → texturas → partes → objetos.
- Transfer learning con ImageNet acelera el entrenamiento drasticamente — las primeras capas ya saben detectar bordes y texturas generales.
- Feature extraction (backbone congelado) es la estrategia correcta para datasets pequenos (<1,000 imagenes).
- Data augmentation puede multiplicar x8 un dataset pequeno con transformaciones geometricas y de color.
- OCR + regex permite extraer datos estructurados de documentos semi-estructurados como facturas del SRI.
- El class imbalance en vision requiere class weights o oversampling — las clases raras se aprenden mal sin esto.

## Reto extra

Construye el sistema de inspeccion automatica de infraestructura vial del MTOP Ecuador: CNN que clasifica imagenes de carreteras en "buena", "deterioro_leve", "bache", "deterioro_grave"; pipeline de ingesta de fotos desde drones DJI con GPS embedded (extrae coordenadas EXIF); mapa interactivo con Folium mostrando el estado de la red vial por canton; prioridad de reparacion por zona usando el producto estado × trafico diario; y reporte PDF automatico para la Subsecretaria de Infraestructura. Todo el sistema corriendo en Raspberry Pi 4 para trabajo de campo sin conexion.
