# Ejercicio Sesion 8: Proyecto — Sistema de Deteccion para Contexto Ecuatoriano

**Materia:** Vision Artificial
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 60 min

## Objetivo

Construir un sistema completo de vision artificial orientado a un problema real ecuatoriano, combinando todas las tecnicas del periodo: preprocesamiento, deteccion de objetos, clasificacion y despliegue. El proyecto elige uno de tres escenarios segun el interes del estudiante.

## Contexto (Ecuador)

Tres problemas reales que empresas ecuatorianas han contactado a ITSEIA para resolver:

**Opcion A:** Deteccion de defectos en rosas de exportacion (Ecuador es el tercer exportador mundial de flores). Las rosas con manchas, tallos torcidos o petalos danados deben separarse antes del empaque. Control de calidad manual cuesta $800,000/año en una finca grande de Cayambe.

**Opcion B:** Clasificacion de basura en centros de reciclaje. El Municipio de Quito tiene centros donde se separa plastico, carton, metal y organico. Un sistema de vision que clasifique los objetos en la cinta transportadora aumentaria la eficiencia un 40%.

**Opcion C:** Deteccion de uso de EPP (Equipos de Proteccion Personal) en obras de construccion. Las empresas constructoras ecuatorianas tienen obligacion de que todos los trabajadores usen casco y chaleco. Una camara que detecte automaticamente el incumplimiento reduce accidentes y multas del IESS.

## Instrucciones

### Seleccion de Proyecto (5 min)

Elige una opcion (A, B o C) y documenta en la primera celda del notebook:
- Opcion elegida y justificacion personal
- Dataset fuente (link o descripcion de como se obtienen las imagenes)
- Arquitectura propuesta (YOLO, CNN, Transfer Learning)
- Metrica de exito (accuracy, mAP, IoU objetivo)

### Parte 1: Dataset (15 min)

**Opcion A — Rosas:**
```python
# Dataset: iNaturalist o Kaggle "Plant Disease Detection"
# Como proxy, usa "Flowers Recognition" de Kaggle (5 clases)
# Renombra clases: sunflower -> rosa_sana, daisy -> rosa_defecto

!kaggle datasets download -d alxmamaev/flowers-recognition
# O descarga manualmente: https://www.kaggle.com/datasets/alxmamaev/flowers-recognition
```

**Opcion B — Basura:**
```python
# Dataset oficial: "Garbage Classification" de Kaggle
!kaggle datasets download -d asdasdasasdas/garbage-classification
# 2,527 imagenes, 6 clases: cardboard, glass, metal, paper, plastic, trash
```

**Opcion C — EPP:**
```python
# Dataset: "Safety Helmet Detection" de Roboflow Universe
# Acceso gratis: https://universe.roboflow.com/joseph-nelson/hard-hat-workers
# Clases: helmet, head (sin casco), person, vest
```

### Parte 2: Entrenamiento (25 min)

Implementa el entrenamiento con la arquitectura elegida:

**Arquitectura recomendada para A y B (clasificacion):**
```python
# Transfer Learning con EfficientNetB2
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.applications import EfficientNetB2

base = EfficientNetB2(include_top=False, weights='imagenet',
                      input_shape=(260, 260, 3))
base.trainable = False

model = tf.keras.Sequential([
    base,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.3),
    layers.Dense(NUM_CLASSES, activation='softmax')
])

# Callbacks completos
callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
    tf.keras.callbacks.ModelCheckpoint(f'mejor_modelo_opcion_{OPCION}.h5',
                                         save_best_only=True),
    tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=3)
]
```

**Arquitectura recomendada para C (deteccion de objetos):**
```python
from ultralytics import YOLO

model = YOLO('yolov8s.pt')  # Small para mejor precision que nano
results = model.train(
    data='epp_dataset.yaml',
    epochs=50,
    imgsz=640,
    batch=16,
    device=0,
    patience=10,      # Early stopping
    save_period=10,   # Guarda checkpoint cada 10 epocas
    plots=True        # Genera graficas de entrenamiento automaticamente
)
```

### Parte 3: Evaluacion y Despliegue (20 min)

Evaluacion rigurosa del modelo entrenado:

```python
# Para clasificacion (Opciones A y B)
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

y_true = test_gen.classes
y_pred = np.argmax(model.predict(test_gen), axis=1)

print("=== REPORTE DE CLASIFICACION ===")
print(classification_report(y_true, y_pred,
                              target_names=list(test_gen.class_indices.keys())))

# Confusion matrix
cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=test_gen.class_indices.keys(),
            yticklabels=test_gen.class_indices.keys())
plt.title(f'Confusion Matrix - Opcion {OPCION}')
plt.ylabel('Real')
plt.xlabel('Predicho')
plt.show()
```

Para deteccion (Opcion C), YOLO genera automaticamente:
- Curvas precision-recall por clase
- mAP50 y mAP50-95
- F1 curve
Reporta estas metricas del directorio `runs/detect/train/`.

Despliegue para demo:
```python
import gradio as gr

def predecir(imagen):
    # Preprocesa y predice
    # Retorna clase + confianza + imagen anotada si es deteccion
    pass

iface = gr.Interface(
    fn=predecir,
    inputs=gr.Image(type="pil", label="Sube imagen"),
    outputs=[
        gr.Label(num_top_classes=3, label="Clasificacion"),
        gr.Image(type="pil", label="Imagen procesada")
    ],
    title=f"Sistema CV Ecuador - Opcion {OPCION}",
    description="Desarrollado en ITSEIA - Periodo 4 - Vision Artificial"
)
iface.launch(share=True)
```

### Parte 4: Reporte Final (en Notebook)

Escribe un reporte Markdown con:
1. Problema y justificacion economica (cuanto ahorra el sistema)
2. Dataset: tamano, distribucion de clases, augmentation aplicada
3. Arquitectura: decision y justificacion
4. Resultados: tabla de metricas por clase
5. Analisis de errores: 5 ejemplos de predicciones incorrectas con hipotesis
6. Limitaciones y proximos pasos para produccion
7. Estimacion de ROI: costo del sistema vs beneficio anual en el contexto ecuatoriano

## Usa IA para...

- Pedirle a Claude que revise tu reporte y haga preguntas tipo "defensa de proyecto" para prepararte
- Pedirle a ChatGPT que genere el pitch de ventas del sistema para presentar al gerente de operaciones de la empresa cliente ecuatoriana
- Preguntar como escalar el sistema a produccion: que hardware, que arquitectura de nube, que costo mensual en AWS o Google Cloud
- Pedir que liste las regulaciones ecuatorianas relevantes para un sistema de camara en ambientes laborales (LOPDP - Ley de Proteccion de Datos Personales)

## Que aprendiste

Al terminar este proyecto integrador debes poder:
- Seleccionar la arquitectura correcta segun el tipo de problema (clasificacion vs deteccion vs segmentacion)
- Ejecutar el pipeline completo desde datos crudos hasta demo desplegada
- Interpretar metricas de evaluacion (accuracy, mAP, precision, recall, F1) en el contexto del negocio
- Comunicar resultados tecnicos con impacto economico cuantificado a audiencias no tecnicas

## Reto Extra

Lleva tu proyecto al siguiente nivel de produccion: exporta el modelo a formato ONNX y mide la latencia de inferencia. Luego crea una API REST minima con FastAPI que reciba una imagen (base64 encoded) y devuelva el resultado de la prediccion en JSON. Dockeriza la API y prueba que funciona correctamente. Documenta el tiempo total de inferencia (ms) y cuantas imagenes por segundo puede procesar. Este pipeline completo (modelo -> API -> Docker) es exactamente lo que se pide en MLOps (Periodo 4 Materia 4) y demuestra integracion entre materias.
