# Ejercicio Sesion 2: Similitud Coseno y Distancia Euclidiana

**Materia:** Sistemas de Recomendacion
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 50 min

## Objetivo

Implementar desde cero las dos metricas de similitud mas utilizadas en recomendacion — similitud coseno y distancia euclidiana — entender geometricamente su diferencia y aplicarlas para encontrar usuarios similares en un dataset de productos ecuatorianos.

## Contexto

Toda recomendacion colaborativa necesita responder: "¿quien se parece a quien?" La similitud coseno mide el angulo entre dos vectores (ignora magnitud, enfocado en preferencias relativas), mientras que la distancia euclidiana mide la distancia geometrica directa (sensible a la escala). En el contexto ecuatoriano, esto equivale a preguntarse si dos compradores del Supermaxi tienen patrones de compra similares aunque uno gaste el doble que el otro. Saber elegir la metrica correcta impacta directamente la calidad del sistema.

## Instrucciones

1. Abre Google Colab y crea `sesion02_similitud_coseno_euclidiana.ipynb`.

2. Implementa ambas metricas manualmente (sin librerias) para entender la matematica:

```python
# Sistemas de Recomendacion - Sesion 2: Metricas de Similitud
# ITSEIA - Periodo 5
# Estudiante: [Tu nombre]

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler

# ========================================================
# PARTE 1: Implementacion manual desde cero
# ========================================================

def similitud_coseno_manual(vec_a, vec_b):
    """
    Similitud coseno: mide el angulo entre dos vectores.
    Rango: -1 (opuestos) a 1 (identicos). 0 = ortogonales.
    Formula: cos(theta) = (A . B) / (||A|| * ||B||)
    """
    producto_punto = np.dot(vec_a, vec_b)
    norma_a = np.linalg.norm(vec_a)
    norma_b = np.linalg.norm(vec_b)
    if norma_a == 0 or norma_b == 0:
        return 0.0
    return producto_punto / (norma_a * norma_b)

def distancia_euclidiana_manual(vec_a, vec_b):
    """
    Distancia euclidiana: distancia directa entre dos puntos.
    Rango: 0 (identicos) a infinito.
    Formula: sqrt(sum((a_i - b_i)^2))
    Para convertir a similitud: 1 / (1 + distancia)
    """
    diferencia = np.array(vec_a) - np.array(vec_b)
    distancia = np.sqrt(np.sum(diferencia ** 2))
    similitud = 1 / (1 + distancia)  # Normalizar a [0, 1]
    return distancia, similitud

# Ejemplo basico para verificar la logica
print("PRUEBA MATEMATICA")
print("=" * 50)

a = np.array([1, 2, 3])
b = np.array([2, 4, 6])  # b es el doble de a

cos_ab = similitud_coseno_manual(a, b)
dist_ab, sim_euc_ab = distancia_euclidiana_manual(a, b)

print(f"Vector A: {a}")
print(f"Vector B: {b}  (el doble de A)")
print(f"\nSimilitud Coseno: {cos_ab:.4f}")
print(f"  → {'MUY SIMILARES (mismo angulo, distinta magnitud)' if cos_ab > 0.99 else 'diferentes'}")
print(f"\nDistancia Euclidiana: {dist_ab:.4f}")
print(f"Similitud Euclidiana: {sim_euc_ab:.4f}")
print(f"  → {'son iguales' if sim_euc_ab > 0.99 else 'SON DIFERENTES (magnitud importa)'}")
print("\nConclucion: Coseno dice que son IGUALES, Euclidiana dice que son DIFERENTES.")
print("Coseno NO le importa la magnitud, solo la direccion del vector.")
```

3. Aplica las metricas a un dataset de compradores ecuatorianos:

```python
# ========================================================
# PARTE 2: Dataset de compradores en el Supermaxi Ecuador
# ========================================================

# Cada usuario tiene ratings (1-5) en categorias de productos
# 0 = no ha comprado en esa categoria
categorias = ['Frutas', 'Lacteos', 'Enlatados', 'Bebidas', 'Snacks', 'Carnes', 'Limpieza']

compradores = {
    'Rosa_Quito':      [5, 4, 2, 3, 1, 5, 3],
    'Jorge_Quito':     [4, 5, 1, 2, 2, 4, 4],
    'Carmen_Guayas':   [1, 2, 5, 4, 5, 1, 2],
    'Alberto_Guayas':  [2, 1, 4, 5, 5, 2, 1],
    'Pilar_Azuay':     [5, 5, 2, 3, 1, 4, 5],
    'Marco_Manabi':    [3, 3, 3, 3, 3, 3, 3],  # usuario "neutro"
}

df = pd.DataFrame(compradores, index=categorias).T
print("Ratings de compradores en Supermaxi Ecuador:")
print(df)

# Calcular todas las similitudes con Rosa_Quito
usuario_ref = 'Rosa_Quito'
vec_ref = df.loc[usuario_ref].values

print(f"\nComparando todos contra {usuario_ref}:")
print("-" * 60)
print(f"{'Usuario':<20} {'Sim. Coseno':>12} {'Sim. Euclidiana':>17} {'Recomendado?':>14}")
print("-" * 60)

for nombre in df.index:
    if nombre == usuario_ref:
        continue
    vec = df.loc[nombre].values
    cos = similitud_coseno_manual(vec_ref, vec)
    _, sim_euc = distancia_euclidiana_manual(vec_ref, vec)
    recomendado = "SI" if cos > 0.85 else "NO"
    print(f"{nombre:<20} {cos:>12.4f} {sim_euc:>17.4f} {recomendado:>14}")

print("\nUsuarios con similitud coseno > 0.85 son buenos candidatos para filtrado colaborativo")
```

4. Visualiza la diferencia geometrica entre ambas metricas:

```python
# ========================================================
# PARTE 3: Visualizacion geometrica
# ========================================================

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# Caso 2D para visualizar: frutas vs lacteos
frutas = df['Frutas'].values
lacteos = df['Lacteos'].values
nombres = df.index.tolist()

# Grafico 1: Espacio de embeddings (coseno)
ax1 = axes[0]
for i, nombre in enumerate(nombres):
    ax1.annotate(nombre.split('_')[0], (frutas[i], lacteos[i]),
                 fontsize=9, ha='center', va='bottom')
    ax1.scatter(frutas[i], lacteos[i], s=100)
    # Dibujar vector desde origen
    ax1.annotate('', xy=(frutas[i], lacteos[i]), xytext=(0, 0),
                 arrowprops=dict(arrowstyle='->', color='gray', alpha=0.5))

ax1.set_xlabel('Preferencia: Frutas')
ax1.set_ylabel('Preferencia: Lacteos')
ax1.set_title('Similitud COSENO\n(Angulo entre vectores desde el origen)')
ax1.grid(True, alpha=0.3)
ax1.set_xlim(-0.5, 6.5)
ax1.set_ylim(-0.5, 6.5)
ax1.set_aspect('equal')

# Grafico 2: Distancia euclidiana
ax2 = axes[1]
for i, nombre in enumerate(nombres):
    ax2.scatter(frutas[i], lacteos[i], s=100)
    ax2.annotate(nombre.split('_')[0], (frutas[i], lacteos[i]),
                 fontsize=9, ha='center', va='bottom')

# Mostrar distancia entre Rosa y Jorge (los mas similares)
i_rosa = nombres.index('Rosa_Quito')
i_jorge = nombres.index('Jorge_Quito')
ax2.plot([frutas[i_rosa], frutas[i_jorge]],
         [lacteos[i_rosa], lacteos[i_jorge]],
         'r--', linewidth=2, label='Distancia Rosa-Jorge')

ax2.set_xlabel('Preferencia: Frutas')
ax2.set_ylabel('Preferencia: Lacteos')
ax2.set_title('Distancia EUCLIDIANA\n(Distancia geometrica directa)')
ax2.grid(True, alpha=0.3)
ax2.set_xlim(-0.5, 6.5)
ax2.set_ylim(-0.5, 6.5)
ax2.legend()

plt.suptitle('Similitud Coseno vs Distancia Euclidiana | ITSEIA P5', color='gray')
plt.tight_layout()
plt.show()
```

5. Valida usando scikit-learn:

```python
# ========================================================
# PARTE 4: Validacion con scikit-learn
# ========================================================
from sklearn.metrics.pairwise import cosine_similarity, euclidean_distances

matriz = df.values
cos_matrix = cosine_similarity(matriz)
euc_matrix = 1 / (1 + euclidean_distances(matriz))

df_cos = pd.DataFrame(cos_matrix, index=df.index, columns=df.index)
print("Matriz de Similitud COSENO (sklearn):")
print(df_cos.round(3))

# Top-2 vecinos de Rosa segun cada metrica
idx_rosa = list(df.index).index('Rosa_Quito')
cos_scores = pd.Series(cos_matrix[idx_rosa], index=df.index).drop('Rosa_Quito').sort_values(ascending=False)
euc_scores = pd.Series(euc_matrix[idx_rosa], index=df.index).drop('Rosa_Quito').sort_values(ascending=False)

print("\nTop vecinos de Rosa_Quito por COSENO:", cos_scores.head(3).to_dict())
print("Top vecinos de Rosa_Quito por EUCLIDIANA:", euc_scores.head(3).to_dict())
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "En mi sistema de recomendacion para una tienda ecuatoriana, tengo usuarios que califican productos del 1 al 5, pero algunos usuarios son muy generosos (dan 4-5 a casi todo) y otros son criticos (dan 1-2 a casi todo). ¿Como afecta esto a la similitud coseno? ¿Que es el 'mean-centering' y como lo aplico antes de calcular similitudes?"

Despues de leer la respuesta:
- Implementa el mean-centering que sugiera ChatGPT en tu notebook.
- Recalcula la similitud con los datos normalizados y compara si cambia el ranking de vecinos.

## Que aprendiste

- La **similitud coseno** mide el angulo entre vectores: dos usuarios con mismas preferencias relativas tienen similitud 1 aunque uno califique con 5 y otro con 2.5.
- La **distancia euclidiana** mide la distancia geometrica directa: es sensible a la escala, por lo que usuarios con patrones similares pero escalas distintas parecen lejanos.
- En recomendacion se prefiere **coseno** para ratings subjetivos porque captura preferencias relativas, no magnitudes absolutas.
- La **sparsity** (muchos ceros) degrada ambas metricas: son mas confiables cuantos mas productos en comun hayan valorado dos usuarios.
- El **mean-centering** corrige el sesgo de usuarios generosos vs criticos antes de calcular similitudes.

## Reto extra

Descarga el dataset publico de MovieLens (ml-latest-small.zip en grouplens.org). Cargalo en Colab, calcula la similitud coseno entre los primeros 50 usuarios y encuentra los 3 vecinos mas cercanos de los usuarios 1, 5 y 10. Compara si el ranking cambia al aplicar mean-centering. Reporta tus hallazgos en una celda markdown.
