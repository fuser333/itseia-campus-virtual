# Ejercicio Sesion 2: Google Colab — Tu Laboratorio Gratuito

**Materia:** Cloud Computing para IA
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Dominar Google Colab como entorno de desarrollo cloud gratuito: montar Google Drive, instalar paquetes, usar GPU gratis, compartir notebooks y ejecutar scripts de larga duracion sin perder progreso, todo aplicado a un flujo de trabajo de Machine Learning con datos del Ecuador.

## Contexto

Google Colab es el laboratorio de IA mas democratizador de la historia: cualquier estudiante con una cuenta Gmail tiene acceso a GPUs NVIDIA T4 gratis por hasta 12 horas. La ESPOL, la UCE y la PUCE ya lo usan en sus cursos de IA. Para ITSEIA, Colab es la herramienta principal del Periodo 3 y 4: permite entrenar modelos sin necesidad de comprar hardware. Empresas ecuatorianas de la industria tecnologica como H3L e ImagemIA comenzaron sus prototipos de IA en Colab antes de migrar a AWS.

## Instrucciones

1. Abre `colab.research.google.com` e inicia sesion con tu Gmail.

2. Crea el notebook de configuracion avanzada:

```python
# Cloud Computing para IA - Sesion 2: Google Colab Avanzado
# ITSEIA - Periodo 3

import subprocess
import sys
import os
import platform

# VERIFICAR EL ENTORNO COLAB
print("="*55)
print("INFORMACION DEL ENTORNO GOOGLE COLAB")
print("="*55)

# Sistema operativo
print(f"Sistema: {platform.system()} {platform.release()}")
print(f"Python version: {sys.version}")
print(f"Directorio actual: {os.getcwd()}")

# Verificar si hay GPU disponible
try:
    import torch
    gpu_disponible = torch.cuda.is_available()
    if gpu_disponible:
        print(f"\nGPU: {torch.cuda.get_device_name(0)}")
        print(f"Memoria GPU: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    else:
        print("\nGPU: No disponible (usando CPU)")
except ImportError:
    print("\nPyTorch no instalado aun")

# Verificar RAM disponible
import psutil
ram = psutil.virtual_memory()
print(f"\nRAM total: {ram.total / 1e9:.1f} GB")
print(f"RAM disponible: {ram.available / 1e9:.1f} GB")

# Verificar disco
disco = psutil.disk_usage('/')
print(f"Disco total: {disco.total / 1e9:.0f} GB")
print(f"Disco libre: {disco.free / 1e9:.0f} GB")
```

3. Monta Google Drive y organiza archivos:

```python
# MONTAR GOOGLE DRIVE
from google.colab import drive
drive.mount('/content/drive')

# Crear estructura de carpetas para el curso ITSEIA
import os

base_path = '/content/drive/MyDrive/ITSEIA_P3'
carpetas = [
    f'{base_path}',
    f'{base_path}/datasets',
    f'{base_path}/modelos',
    f'{base_path}/notebooks',
    f'{base_path}/resultados'
]

for carpeta in carpetas:
    os.makedirs(carpeta, exist_ok=True)
    print(f"Carpeta creada: {carpeta}")

print("\nEstructura de carpetas ITSEIA P3 lista en Google Drive")

# Guardar un archivo de configuracion del proyecto
config = {
    'proyecto': 'ITSEIA Periodo 3 - Cloud Computing',
    'estudiante': '[TU NOMBRE]',
    'fecha_inicio': '2024-01-15',
    'herramientas': ['Google Colab', 'AWS Free Tier', 'Supabase', 'Streamlit'],
    'datasets': ['INEC ECV', 'BCE Macroeconomico', 'MSP Salud'],
    'modelos': ['Random Forest', 'Regresion Logistica', 'KNN']
}

import json
with open(f'{base_path}/config.json', 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print(f"\nArchivo config.json guardado en {base_path}")

# Verificar que se guardo
with open(f'{base_path}/config.json', 'r') as f:
    config_leido = json.load(f)
print(f"Config verificada: {config_leido['proyecto']}")
```

4. Instala paquetes y trabaja con datos:

```python
# INSTALACION DE PAQUETES EN COLAB
# Colab ya tiene: numpy, pandas, sklearn, matplotlib, seaborn
# Necesitamos instalar extras:

print("Instalando paquetes adicionales...")
!pip install -q yfinance plotly kaleido openpyxl

# Verificar instalaciones
import importlib
paquetes = ['numpy', 'pandas', 'sklearn', 'matplotlib', 'seaborn',
            'yfinance', 'plotly', 'openpyxl']

print("\nVerificacion de paquetes:")
for pkg in paquetes:
    try:
        mod = importlib.import_module(pkg.replace('-', '_'))
        version = getattr(mod, '__version__', 'instalado')
        print(f"  {pkg:15s}: {version}")
    except ImportError:
        print(f"  {pkg:15s}: ERROR - no instalado")
```

5. Flujo de trabajo completo de ML en Colab:

```python
# FLUJO COMPLETO: Cargar -> Procesar -> Entrenar -> Guardar
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import time

# Simular carga de datos desde Google Drive (en practica real usarias el path al CSV)
np.random.seed(42)
n = 500
df = pd.DataFrame({
    'edad': np.random.randint(18, 65, n),
    'ingreso': np.random.normal(600, 200, n).clip(200, 2000),
    'educacion_años': np.random.choice([6, 9, 12, 16], n),
    'empleo_formal': np.random.choice([0, 1], n, p=[0.45, 0.55])
})
df['tiene_cuenta_banco'] = (
    (df['ingreso'] > 500) & (df['educacion_años'] >= 12)
).astype(int)

# Guardar dataset a Drive
ruta_dataset = f'{base_path}/datasets/datos_bancarizacion.csv'
df.to_csv(ruta_dataset, index=False)
print(f"Dataset guardado: {ruta_dataset}")
print(f"Shape: {df.shape}")

# Entrenamiento
X = df.drop('tiene_cuenta_banco', axis=1)
y = df['tiene_cuenta_banco']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

inicio = time.time()
modelo = RandomForestClassifier(n_estimators=100, random_state=42)
modelo.fit(X_train, y_train)
tiempo_entrenamiento = time.time() - inicio

acc = accuracy_score(y_test, modelo.predict(X_test))
print(f"\nModelo entrenado en {tiempo_entrenamiento:.2f}s")
print(f"Accuracy: {acc:.4f}")

# Guardar modelo a Google Drive
ruta_modelo = f'{base_path}/modelos/rf_bancarizacion.joblib'
joblib.dump(modelo, ruta_modelo)
print(f"\nModelo guardado: {ruta_modelo}")

# Verificar que se puede cargar
modelo_cargado = joblib.load(ruta_modelo)
acc_verificacion = accuracy_score(y_test, modelo_cargado.predict(X_test))
print(f"Modelo recargado - Accuracy: {acc_verificacion:.4f} (debe ser identico)")

print("\n\nFLUJO COMPLETO EXITOSO:")
print("  Dataset -> Google Drive -> Entrenamiento -> Modelo guardado -> Verificado")
print("  El modelo persiste aunque Colab se reinicie")
```

6. Configuracion GPU y tips de productividad:

```python
# TIPS DE PRODUCTIVIDAD EN COLAB
print("CONFIGURACION OPTIMA PARA ML EN COLAB:")
print("-"*50)

tips = [
    ("Activar GPU", "Runtime -> Change runtime type -> GPU (T4 Gratuita)"),
    ("Evitar desconexion", "Ejecuta: from google.colab import output; output.eval_js('...')"),
    ("Guardar checkpoint", "Usar joblib.dump() o df.to_csv() a Drive periodicamente"),
    ("Montar Drive al inicio", "Siempre la primera celda: drive.mount('/content/drive')"),
    ("Compartir notebook", "Share -> Anyone with link -> Viewer"),
    ("Usar Magic Commands", "%time, %timeit, %%time para medir velocidad de celdas"),
    ("Historial versiones", "File -> Revision history -> restaurar version anterior"),
    ("Secretos seguros", "Tools -> Secrets -> no hardcodear API keys en el codigo")
]

for tip, descripcion in tips:
    print(f"\n{tip}:")
    print(f"  {descripcion}")

# Magic commands utiles
print("\n\nMAGIC COMMANDS UTILES:")
print("  %pwd           -> directorio actual")
print("  %ls            -> listar archivos")
print("  %time codigo   -> medir tiempo de una linea")
print("  %%time         -> medir tiempo de toda la celda")
print("  !comando       -> ejecutar comando del sistema (bash)")
print("  !pip install   -> instalar paquetes")
print("  !wget URL      -> descargar archivos")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo un notebook de Google Colab que entrena un modelo Random Forest con 1 millon de filas y 50 columnas. El entrenamiento tarda 45 minutos. ¿Cuales son las 5 estrategias para acelerar el entrenamiento en Colab? ¿Cuando conviene pagar Colab Pro vs usar el free tier?"

Despues de leer la respuesta:
- Implementa al menos 2 de las estrategias de optimizacion sugeridas en tu notebook.
- Mide el tiempo con `%%time` antes y despues de cada optimizacion.

## Que aprendiste

- Google Colab es un entorno PaaS: solo traes tu codigo Python, toda la infraestructura (servidor, GPU, librerias base) ya esta lista.
- Montar Google Drive con `drive.mount()` es critico: los archivos en `/content/` se pierden al reiniciar, los de Drive no.
- `joblib.dump/load` persiste modelos entrenados; sin esto, cada reinicio de Colab requiere reentrenar.
- Los Magic Commands (`%time`, `!bash_cmd`) son atajos de productividad exclusivos de notebooks.
- La GPU gratuita de Colab (NVIDIA T4) equivale a $0.35/hora en AWS, pero tiene limite de 12h de uso continuo.

## Reto extra

Crea un script en Colab que descargue automaticamente el ultimo dataset publico del INEC usando `!wget` o la libreria `requests`, lo guarde en Google Drive, lo procese con Pandas y entrene un modelo. El objetivo es que el notebook sea completamente reproducible: un nuevo estudiante debe poder ejecutar todas las celdas en orden y obtener el mismo resultado sin configuracion manual.
