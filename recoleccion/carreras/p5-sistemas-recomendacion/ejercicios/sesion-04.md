# Ejercicio Sesion 4: Deep Learning para Recomendacion con Embeddings

**Materia:** Sistemas de Recomendacion
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 60 min

## Objetivo

Construir un sistema de recomendacion basado en redes neuronales usando embeddings para representar usuarios e items en un espacio vectorial denso, implementando el modelo Neural Collaborative Filtering (NCF) con TensorFlow/Keras aplicado a un caso de e-commerce ecuatoriano.

## Contexto

Los modelos de deep learning superan a SVD cuando hay datos implicitos (clics, tiempo en pantalla, scrolling) o cuando el patron de preferencias es no lineal. OLX Ecuador, DeUna y Picap generan millones de interacciones implicitas diariamente donde el usuario nunca da un rating explicito — solo actua. Los embeddings aprenden representaciones densas de usuarios e items que capturan relaciones complejas: que un usuario que compra cafe lojano de alta gama tambien tiende a comprar chocolate Pacari premium, aunque superficialmente no parezcan relacionados.

## Instrucciones

1. Abre Google Colab y crea `sesion04_ncf_embeddings.ipynb`. Asegurate de usar GPU: Runtime > Change runtime type > T4 GPU.

2. Instala dependencias y genera el dataset:

```python
# Sistemas de Recomendacion - Sesion 4: Deep Learning + Embeddings
# ITSEIA - Periodo 5
# Estudiante: [Tu nombre]

import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import matplotlib.pyplot as plt

print(f"TensorFlow version: {tf.__version__}")
print(f"GPU disponible: {tf.config.list_physical_devices('GPU')}")

# ========================================================
# PARTE 1: Que son los Embeddings
# ========================================================

print("\n" + "="*60)
print("EMBEDDINGS: La base del Deep Learning en Recomendacion")
print("="*60)
print("""
Un embedding convierte un ID discreto (usuario_id=4523)
en un vector denso de numeros reales:

  usuario_id=4523  ->  embedding  ->  [0.23, -0.51, 0.87, 0.12, ...]
  producto_id=891  ->  embedding  ->  [0.18, -0.49, 0.91, 0.09, ...]

Si los vectores son CERCANOS, hay alta compatibilidad.
Los embeddings se APRENDEN durante el entrenamiento.
Dimension tipica: 8 a 256 dependiendo del catalogo.
""")

# ========================================================
# PARTE 2: Dataset - DeUna.ec (superapp ecuatoriana)
# ========================================================

np.random.seed(2025)

n_usuarios = 1500
n_productos = 300
n_categorias = 15

# Simular dataset de interacciones implicitas DeUna
# (compras realizadas = interaccion positiva)
n_interacciones = 25000

usuario_ids = np.random.randint(0, n_usuarios, n_interacciones)
producto_ids = np.random.randint(0, n_productos, n_interacciones)

# Sesgo realista: algunos productos son mucho mas populares (ley de Pareto)
popularidad = np.random.zipf(1.5, n_productos)
popularidad = popularidad / popularidad.sum()
producto_ids = np.random.choice(n_productos, n_interacciones, p=popularidad)

# Crear etiquetas: 1 = compro, 0 = negativo muestreado
labels = np.ones(n_interacciones)

# Negative sampling: por cada positivo, agregar 4 negativos
n_neg = n_interacciones * 4
neg_usuarios = np.random.randint(0, n_usuarios, n_neg)
neg_productos = np.random.randint(0, n_productos, n_neg)
neg_labels = np.zeros(n_neg)

# Combinar positivos y negativos
all_users = np.concatenate([usuario_ids, neg_usuarios])
all_products = np.concatenate([producto_ids, neg_productos])
all_labels = np.concatenate([labels, neg_labels])

# Shuffle
idx = np.random.permutation(len(all_users))
all_users = all_users[idx]
all_products = all_products[idx]
all_labels = all_labels[idx]

print(f"Dataset DeUna.ec - Interacciones simuladas:")
print(f"  Usuarios unicos  : {n_usuarios:,}")
print(f"  Productos unicos : {n_productos:,}")
print(f"  Interacciones +  : {n_interacciones:,}")
print(f"  Interacciones -  : {n_neg:,} (negative sampling 1:4)")
print(f"  Total ejemplos   : {len(all_users):,}")

# Split train/val/test
split1 = int(len(all_users) * 0.7)
split2 = int(len(all_users) * 0.85)

X_train_u, X_train_p, y_train = all_users[:split1], all_products[:split1], all_labels[:split1]
X_val_u, X_val_p, y_val = all_users[split1:split2], all_products[split1:split2], all_labels[split1:split2]
X_test_u, X_test_p, y_test = all_users[split2:], all_products[split2:], all_labels[split2:]
```

3. Construye el modelo Neural Collaborative Filtering:

```python
# ========================================================
# PARTE 3: Modelo NCF con Embeddings
# ========================================================

EMBEDDING_DIM = 32  # Dimension del espacio latente

def construir_modelo_ncf(n_usuarios, n_productos, embedding_dim):
    """
    Neural Collaborative Filtering (NCF)
    Combina GMF (dot product) y MLP (red neuronal) para
    capturar patrones lineales y no lineales simultaneamente.
    """
    # Entradas
    input_usuario = keras.Input(shape=(1,), name='usuario_id')
    input_producto = keras.Input(shape=(1,), name='producto_id')

    # --- Rama GMF (Generalized Matrix Factorization) ---
    # Equivalente al dot product de SVD pero aprendido
    emb_user_gmf = layers.Embedding(n_usuarios, embedding_dim,
                                     name='emb_usuario_gmf')(input_usuario)
    emb_prod_gmf = layers.Embedding(n_productos, embedding_dim,
                                     name='emb_producto_gmf')(input_producto)
    gmf_flat_u = layers.Flatten()(emb_user_gmf)
    gmf_flat_p = layers.Flatten()(emb_prod_gmf)
    gmf_output = layers.Multiply()([gmf_flat_u, gmf_flat_p])

    # --- Rama MLP (Multi-Layer Perceptron) ---
    # Captura interacciones no lineales complejas
    emb_user_mlp = layers.Embedding(n_usuarios, embedding_dim,
                                     name='emb_usuario_mlp')(input_usuario)
    emb_prod_mlp = layers.Embedding(n_productos, embedding_dim,
                                     name='emb_producto_mlp')(input_producto)
    mlp_flat_u = layers.Flatten()(emb_user_mlp)
    mlp_flat_p = layers.Flatten()(emb_prod_mlp)

    # Concatenar y pasar por capas densas
    mlp_concat = layers.Concatenate()([mlp_flat_u, mlp_flat_p])
    mlp_x = layers.Dense(128, activation='relu')(mlp_concat)
    mlp_x = layers.Dropout(0.3)(mlp_x)
    mlp_x = layers.Dense(64, activation='relu')(mlp_x)
    mlp_x = layers.Dropout(0.2)(mlp_x)
    mlp_output = layers.Dense(32, activation='relu')(mlp_x)

    # --- Fusion GMF + MLP ---
    fusion = layers.Concatenate()([gmf_output, mlp_output])
    output = layers.Dense(1, activation='sigmoid', name='prediccion')(fusion)

    model = keras.Model(
        inputs=[input_usuario, input_producto],
        outputs=output,
        name='NCF_DeUna'
    )
    return model

modelo = construir_modelo_ncf(n_usuarios, n_productos, EMBEDDING_DIM)
modelo.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='binary_crossentropy',
    metrics=['accuracy', keras.metrics.AUC(name='auc')]
)

modelo.summary()
```

4. Entrena y evalua el modelo:

```python
# ========================================================
# PARTE 4: Entrenamiento y Evaluacion
# ========================================================

# Callbacks
early_stopping = keras.callbacks.EarlyStopping(
    monitor='val_auc', patience=5, restore_best_weights=True, mode='max'
)
reduce_lr = keras.callbacks.ReduceLROnPlateau(
    monitor='val_loss', factor=0.5, patience=3, min_lr=1e-6
)

# Entrenar
historia = modelo.fit(
    [X_train_u, X_train_p], y_train,
    validation_data=([X_val_u, X_val_p], y_val),
    epochs=30,
    batch_size=512,
    callbacks=[early_stopping, reduce_lr],
    verbose=1
)

# Evaluacion en test
loss_test, acc_test, auc_test = modelo.evaluate(
    [X_test_u, X_test_p], y_test, verbose=0
)
print(f"\nResultados en Test:")
print(f"  Loss    : {loss_test:.4f}")
print(f"  Accuracy: {acc_test:.4f} ({acc_test*100:.2f}%)")
print(f"  AUC-ROC : {auc_test:.4f}")

# Visualizar entrenamiento
fig, axes = plt.subplots(1, 2, figsize=(13, 5))

axes[0].plot(historia.history['loss'], label='Train Loss', color='#1F2F58')
axes[0].plot(historia.history['val_loss'], label='Val Loss', color='#FBBC0C')
axes[0].set_title('Loss durante entrenamiento')
axes[0].set_xlabel('Epoca')
axes[0].set_ylabel('Binary Crossentropy')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

axes[1].plot(historia.history['auc'], label='Train AUC', color='#1F2F58')
axes[1].plot(historia.history['val_auc'], label='Val AUC', color='#FBBC0C')
axes[1].set_title('AUC durante entrenamiento')
axes[1].set_xlabel('Epoca')
axes[1].set_ylabel('AUC-ROC')
axes[1].legend()
axes[1].grid(True, alpha=0.3)

plt.suptitle('NCF - DeUna.ec | ITSEIA P5', color='gray')
plt.tight_layout()
plt.show()
```

5. Genera recomendaciones y visualiza embeddings:

```python
# ========================================================
# PARTE 5: Recomendaciones y Visualizacion de Embeddings
# ========================================================

# Top-10 recomendaciones para un usuario
def recomendar_top_k(modelo, usuario_id, n_productos, k=10, productos_vistos=None):
    candidatos = [p for p in range(n_productos)
                  if productos_vistos is None or p not in productos_vistos]
    u_array = np.array([usuario_id] * len(candidatos))
    p_array = np.array(candidatos)
    scores = modelo.predict([u_array, p_array], batch_size=512, verbose=0).flatten()
    top_indices = np.argsort(scores)[::-1][:k]
    return [(candidatos[i], scores[i]) for i in top_indices]

# Recomendar para usuario 42
usuario_ejemplo = 42
productos_comprados = list(producto_ids[usuario_ids == usuario_ejemplo][:5])
recomendaciones = recomendar_top_k(modelo, usuario_ejemplo, n_productos, k=5,
                                    productos_vistos=productos_comprados)

print(f"Top-5 recomendaciones para Usuario {usuario_ejemplo}:")
print(f"Ya compro: productos {productos_comprados}")
print("-" * 40)
for prod_id, score in recomendaciones:
    print(f"  Producto_{prod_id:03d}: score = {score:.4f}")

# Extraer y visualizar embeddings (reduccion con PCA)
from sklearn.decomposition import PCA

emb_weights = modelo.get_layer('emb_producto_gmf').get_weights()[0]
pca = PCA(n_components=2)
emb_2d = pca.fit_transform(emb_weights[:50])  # primeros 50 productos

plt.figure(figsize=(10, 7))
plt.scatter(emb_2d[:, 0], emb_2d[:, 1], s=60, alpha=0.7, c='#FBBC0C')
for i in range(50):
    plt.annotate(f'P{i}', (emb_2d[i, 0], emb_2d[i, 1]), fontsize=7, alpha=0.8)
plt.title('Embeddings de Productos en 2D (PCA)\nProductos cercaños = perfiles similares de compradores')
plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.1%} varianza)')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.1%} varianza)')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Construi un modelo NCF con embeddings de dimension 32 para un e-commerce ecuatoriano. Tengo AUC-ROC de 0.78 en test. El modelo tiene 4 capas densas (128-64-32-1). Tengo 1500 usuarios y 300 productos. ¿Que tecnicas de regularizacion me recomiendas? ¿Como implementaria 'negative sampling' mas inteligente en lugar de aleatorio? ¿Que es el BPR loss y cuando lo usaria?"

Despues de leer la respuesta:
- Implementa una de las mejoras que sugiera Claude.
- Compara el AUC antes y despues del cambio.

## Que aprendiste

- Los **embeddings** convierten IDs discretos en vectores densos donde la proximidad geometrica indica compatibilidad.
- **NCF** combina GMF (interacciones lineales) y MLP (no lineales) para capturar patrones complejos que SVD no puede.
- El **negative sampling** es critico en datos implicitos: necesitas ejemplos negativos porque solo tienes positivos observados.
- La capa **Embedding** en Keras aprende representaciones optimas durante el backpropagation.
- Los embeddings entrenados son **transferibles**: pueden usarse como features en otros modelos o para calcular similitud entre productos.

## Reto extra

Implementa un modelo mas simple de "Two-Tower": una torre para usuarios y otra para productos, donde el score final es el producto punto de los dos embeddings de salida. Este es el modelo que usa YouTube en produccion. Compara su AUC con el NCF completo y discute el trade-off entre precision y velocidad de inferencia.
