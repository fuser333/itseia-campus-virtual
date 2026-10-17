# Ejercicio Sesion 3: Matrix Factorization con SVD

**Materia:** Sistemas de Recomendacion
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 55 min

## Objetivo

Implementar matrix factorization usando Singular Value Decomposition (SVD) para predecir ratings no observados, comprender la descomposicion matricial como tecnica de reduccion latente y construir un sistema de recomendacion basado en factores ocultos aplicado a productos ecuatorianos.

## Contexto

La matrix factorization es la tecnica que popularizo Netflix al ganar el Netflix Prize en 2009 con una mejora del 10% sobre el algoritmo base. El principio es descomponer la matriz usuario-item en factores latentes que capturan preferencias implicitas. En Ecuador, un banco como Produbanco podria usar SVD para inferir que productos financieros ofrecer a clientes que nunca han interactuado con ellos, basandose en patrones de clientes similares. La clave es que SVD "rellena" los huecos de la matriz de interacciones, que en la practica tiene 99%+ de ceros.

## Instrucciones

1. Abre Google Colab y crea `sesion03_svd_matrix_factorization.ipynb`.

2. Instala la libreria surprise y construye el dataset:

```python
# Sistemas de Recomendacion - Sesion 3: Matrix Factorization SVD
# ITSEIA - Periodo 5
# Estudiante: [Tu nombre]

# Instalar libreria Surprise (si no esta disponible)
# !pip install scikit-surprise -q

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.sparse.linalg import svds
from sklearn.preprocessing import normalize

# ========================================================
# PARTE 1: Entender SVD matematicamente
# ========================================================

# SVD descompone una matriz M en tres matrices:
# M = U * sigma * V^T
# U: matriz de usuarios en espacio latente (m x k)
# sigma: valores singulares (importancia de cada factor latente)
# V^T: matriz de items en espacio latente (k x n)

print("CONCEPTOS SVD - Matrix Factorization")
print("=" * 55)
print("Dado: Matriz M de (usuarios x items)")
print("SVD : M = U * S * V^T")
print()
print("U      -> Cada usuario representado en k dimensiones latentes")
print("S      -> Importancia de cada dimension (valores singulares)")
print("V^T    -> Cada item representado en k dimensiones latentes")
print()
print("Para reconstruir: M_aprox = U[:,:k] * S[:k] * V[:k,:]")
print("Los ratings faltantes se PREDICEN con la reconstruccion")

# Ejemplo con matriz pequena
M = np.array([
    [5, 4, 0, 1, 0],
    [4, 5, 0, 2, 0],
    [0, 0, 5, 4, 3],
    [0, 0, 4, 5, 4],
    [3, 0, 0, 0, 5],
])
print(f"\nMatriz original M ({M.shape[0]} usuarios x {M.shape[1]} items):")
print(M)
print(f"\nCeros (no observados): {(M == 0).sum()} de {M.size} entradas ({(M==0).sum()/M.size:.0%})")
```

3. Implementa SVD y reconstruye ratings predichos:

```python
# ========================================================
# PARTE 2: SVD truncado y prediccion de ratings
# ========================================================

# Reemplazar ceros por la media del usuario (para mejor SVD)
M_float = M.astype(float)
medias_usuario = np.where(M_float > 0, M_float, np.nan)
medias = np.nanmean(medias_usuario, axis=1)
M_centrado = M_float.copy()
for i in range(M_float.shape[0]):
    M_centrado[i, M_float[i] == 0] = medias[i]

print("Matriz centrada (ceros reemplazados por media del usuario):")
print(M_centrado.round(2))

# SVD truncado con k=2 factores latentes
k = 2
U, sigma, Vt = svds(M_centrado, k=k)
sigma_diag = np.diag(sigma)

# Reconstruccion
M_pred = U.dot(sigma_diag).dot(Vt)

# Restaurar al rango 1-5
M_pred_clipped = np.clip(M_pred, 1, 5)

print(f"\nMatriz PREDICHA por SVD (k={k} factores latentes):")
df_pred = pd.DataFrame(M_pred_clipped.round(2),
                       index=[f'Usuario_{i+1}' for i in range(5)],
                       columns=[f'Item_{j+1}' for j in range(5)])
print(df_pred)

# Mostrar diferencia: donde estaban los ceros ahora hay predicciones
print("\nPREDICCIONES para los ceros originales:")
for i in range(M.shape[0]):
    for j in range(M.shape[1]):
        if M[i, j] == 0:
            print(f"  Usuario_{i+1} -> Item_{j+1}: Rating predicho = {M_pred_clipped[i,j]:.2f}")
```

4. Aplica SVD con la libreria Surprise a un caso ecuatoriano completo:

```python
# ========================================================
# PARTE 3: SVD con Surprise en dataset Produbanco
# ========================================================
try:
    from surprise import SVD, Dataset, Reader
    from surprise.model_selection import cross_validate, train_test_split
    from surprise import accuracy
    SURPRISE_OK = True
except ImportError:
    print("Instala con: !pip install scikit-surprise")
    SURPRISE_OK = False

if SURPRISE_OK:
    # Simular interacciones cliente-producto en Produbanco
    np.random.seed(42)
    n_clientes = 200
    n_productos = 10
    productos_banco = [
        'Cuenta_Ahorro', 'Tarjeta_Credito', 'Credito_Hipotecario',
        'Seguro_Vida', 'Fondo_Inversion', 'Credito_Auto',
        'Seguro_Medico', 'Credito_Educacion', 'Plan_Jubilacion', 'Cuenta_Corriente'
    ]

    # Generar ~30% de interacciones (sparsity realista)
    interacciones = []
    for cliente_id in range(1, n_clientes + 1):
        n_interacciones = np.random.randint(2, 6)
        prods_elegidos = np.random.choice(n_productos, n_interacciones, replace=False)
        for prod_id in prods_elegidos:
            rating = np.random.choice([1, 2, 3, 4, 5], p=[0.05, 0.10, 0.20, 0.35, 0.30])
            interacciones.append((cliente_id, prod_id + 1, rating))

    df_banco = pd.DataFrame(interacciones, columns=['cliente_id', 'producto_id', 'rating'])
    print(f"Dataset Produbanco simulado: {len(df_banco)} interacciones")
    print(f"Density: {len(df_banco) / (n_clientes * n_productos):.1%}")
    print(df_banco.head(10))

    # Entrenar SVD
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(df_banco, reader)
    trainset, testset = train_test_split(data, test_size=0.2, random_state=42)

    modelo_svd = SVD(n_factors=20, n_epochs=30, lr_all=0.005, reg_all=0.02, random_state=42)
    modelo_svd.fit(trainset)

    predictions = modelo_svd.test(testset)
    rmse = accuracy.rmse(predictions, verbose=False)
    mae = accuracy.mae(predictions, verbose=False)

    print(f"\nResultados SVD - Produbanco:")
    print(f"  RMSE: {rmse:.4f}  (error promedio en escala 1-5)")
    print(f"  MAE : {mae:.4f}")
    print(f"  Interpretacion: las predicciones se desvian ~{rmse:.2f} puntos del rating real")

    # Top-5 recomendaciones para el cliente 1
    cliente_test = 1
    productos_no_vistos = [p for p in range(1, n_productos + 1)
                           if p not in df_banco[df_banco['cliente_id'] == cliente_test]['producto_id'].values]

    recs = []
    for prod_id in productos_no_vistos:
        pred = modelo_svd.predict(cliente_test, prod_id)
        recs.append((productos_banco[prod_id - 1], pred.est))

    recs.sort(key=lambda x: x[1], reverse=True)
    print(f"\nTop-5 recomendaciones para Cliente {cliente_test}:")
    for producto, score in recs[:5]:
        print(f"  {producto:<25}: score predicho = {score:.3f}")
```

5. Visualiza los factores latentes:

```python
# ========================================================
# PARTE 4: Visualizar factores latentes
# ========================================================

# Usar la SVD manual de la Parte 2 para visualizar
fig, axes = plt.subplots(1, 2, figsize=(13, 5))

# Factor 1 vs Factor 2 para usuarios
ax1 = axes[0]
colors_usuarios = ['#1F2F58', '#FBBC0C', '#73B8E7', '#F0846D', '#2A3F6E']
for i in range(U.shape[0]):
    ax1.scatter(U[i, 0], U[i, 1], s=120, color=colors_usuarios[i])
    ax1.annotate(f'Usuario {i+1}', (U[i, 0], U[i, 1]), fontsize=9,
                 xytext=(5, 5), textcoords='offset points')
ax1.set_xlabel('Factor Latente 1')
ax1.set_ylabel('Factor Latente 2')
ax1.set_title('Usuarios en Espacio Latente (U)')
ax1.grid(True, alpha=0.3)
ax1.axhline(0, color='gray', linewidth=0.5)
ax1.axvline(0, color='gray', linewidth=0.5)

# Factor 1 vs Factor 2 para items
ax2 = axes[1]
for j in range(Vt.shape[1]):
    ax2.scatter(Vt[0, j], Vt[1, j], s=120, marker='s', color='#FBBC0C')
    ax2.annotate(f'Item {j+1}', (Vt[0, j], Vt[1, j]), fontsize=9,
                 xytext=(5, 5), textcoords='offset points')
ax2.set_xlabel('Factor Latente 1')
ax2.set_ylabel('Factor Latente 2')
ax2.set_title('Items en Espacio Latente (V^T)')
ax2.grid(True, alpha=0.3)
ax2.axhline(0, color='gray', linewidth=0.5)
ax2.axvline(0, color='gray', linewidth=0.5)

plt.suptitle('SVD: Representacion en espacio latente | ITSEIA P5', color='gray')
plt.tight_layout()
plt.show()

print("\nInterpretacion geometrica:")
print("Usuarios y Items cercaños en el espacio latente = alta compatibilidad")
print("Los factores latentes NO son interpretables directamente")
print("  (pueden ser 'factor de aventura', 'factor economico', etc.)")
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Implemente SVD con k=2 factores latentes para un sistema de recomendacion de productos bancarios en Ecuador. Mi RMSE es 0.82 en escala 1-5. ¿Es ese un buen resultado? ¿Como deberia elegir el numero optimo de factores k? ¿Que diferencia hay entre SVD, SVD++ y ALS para este caso de uso bancario?"

Despues de leer la respuesta:
- Prueba k=5, k=10, k=20 y k=50 en el modelo Surprise si tienes el dataset cargado.
- Grafica RMSE vs k y encuentra el "codo" de la curva.
- Agrega un comentario explicando que significa sobreajuste en este contexto.

## Que aprendiste

- **SVD** descompone la matriz usuario-item en tres matrices: usuarios en espacio latente, valores singulares, e items en espacio latente.
- Los **factores latentes** son dimensiones abstractas aprendidas automaticamente (genero musical, categoria de precio, etc.).
- **SVD truncado** (k << rango original) reduce ruido y complejidad, y es el que se usa en produccion.
- El hiperparametro **k** controla el trade-off bias-varianza: k pequeno = underfitting, k grande = overfitting.
- La libreria **Surprise** implementa SVD, SVD++ y ALS con validacion cruzada lista para produccion.

## Reto extra

Implementa la variante **SVD++** (SVDpp en Surprise) que incorpora ratings implicitos (items vistos aunque no calificados). Compara el RMSE con SVD clasico usando cross_validate. Investiga en la documentacion de Surprise que significa el parametro `biased=True` en SVD y cuando es util en el contexto de datos ecuatorianos donde hay sesgo hacia calificaciones altas.
