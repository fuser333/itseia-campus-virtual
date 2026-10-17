# Ejercicio Sesion 5: Metricas de Evaluacion — Precision@K, Recall@K, MAP y NDCG

**Materia:** Sistemas de Recomendacion
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 50 min

## Objetivo

Implementar y comparar las cuatro metricas estandar de evaluacion de sistemas de recomendacion — Precision@K, Recall@K, MAP y NDCG — comprendiendo como cada una captura un aspecto diferente de la calidad de las recomendaciones y aplicarlas para comparar dos modelos en un contexto ecuatoriano.

## Contexto

Un sistema de recomendacion en produccion no se evalua con accuracy comun: no te interesa si predice correctamente el rating de 4.2, te interesa si los 10 items que muestra al usuario son los que el usuario realmente hubiera querido ver. El IESS al recomendar especialidades medicas disponibles, o un portal de empleo ecuatoriano (Multitrabajos.com) al recomendar vacantes, necesita garantizar que los primeros resultados sean relevantes — porque el usuario rara vez mira mas alla de los 5 primeros. Para esto existen las metricas ranking-aware.

## Instrucciones

1. Abre Google Colab y crea `sesion05_metricas_recomendacion.ipynb`.

2. Implementa cada metrica manualmente para entender su formula:

```python
# Sistemas de Recomendacion - Sesion 5: Metricas de Evaluacion
# ITSEIA - Periodo 5
# Estudiante: [Tu nombre]

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# ========================================================
# PARTE 1: Definicion e Implementacion Manual
# ========================================================

def precision_at_k(recommended, relevant, k):
    """
    Precision@K: De los K items recomendados, cuantos son relevantes.
    Formula: |{recomendados_top_k} ∩ {relevantes}| / K
    Rango: 0 a 1. Penaliza recomendaciones irrelevantes.
    """
    recommended_k = recommended[:k]
    n_relevantes_en_top_k = len(set(recommended_k) & set(relevant))
    return n_relevantes_en_top_k / k

def recall_at_k(recommended, relevant, k):
    """
    Recall@K: De todos los items relevantes, cuantos aparecen en el top K.
    Formula: |{recomendados_top_k} ∩ {relevantes}| / |relevantes|
    Rango: 0 a 1. Penaliza no encontrar items relevantes.
    """
    if len(relevant) == 0:
        return 0.0
    recommended_k = recommended[:k]
    n_relevantes_en_top_k = len(set(recommended_k) & set(relevant))
    return n_relevantes_en_top_k / len(relevant)

def average_precision(recommended, relevant, k):
    """
    Average Precision (AP): Promedio de Precision@k para cada posicion relevante.
    Considera el ORDEN: encontrar relevantes mas arriba = mejor AP.
    """
    if len(relevant) == 0:
        return 0.0
    ap = 0.0
    n_relevantes_encontrados = 0
    for i, item in enumerate(recommended[:k]):
        if item in relevant:
            n_relevantes_encontrados += 1
            ap += n_relevantes_encontrados / (i + 1)
    return ap / min(len(relevant), k)

def ndcg_at_k(recommended, relevant, k):
    """
    Normalized Discounted Cumulative Gain (NDCG):
    Peso mayor a items relevantes en posiciones mas altas.
    Normalizado contra el ranking ideal (todos relevantes primero).
    Rango: 0 a 1. 1 = ranking perfecto.
    """
    def dcg(items, relevant, k):
        score = 0.0
        for i, item in enumerate(items[:k]):
            if item in relevant:
                score += 1 / np.log2(i + 2)  # log2(posicion + 1)
        return score

    dcg_val = dcg(recommended, relevant, k)
    ideal_order = [item for item in recommended if item in relevant][:k]
    ideal_order += [item for item in recommended if item not in relevant]
    idcg_val = dcg(ideal_order, relevant, k)

    if idcg_val == 0:
        return 0.0
    return dcg_val / idcg_val

# Demostrar con ejemplo simple
print("EJEMPLO BASE - Portal de Empleo Multitrabajos Ecuador")
print("=" * 60)
print("Usuario busca: vacantes de 'Ingeniero de Datos' en Quito")
print()

# Items relevantes (lo que el usuario realmente quiere)
relevantes = {1, 3, 5, 7, 9}  # IDs de vacantes relevantes

# Modelo A: orden de recomendacion (de mas a menos relevante segun modelo)
modelo_a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]  # Primeros 2 buenos, luego mezcla
modelo_b = [2, 4, 1, 6, 3, 8, 5, 10, 7, 9]  # Dispersa los relevantes

K = 5
print(f"Items relevantes: {relevantes}")
print(f"Modelo A recomienda: {modelo_a[:K]} (top-{K})")
print(f"Modelo B recomienda: {modelo_b[:K]} (top-{K})")
print()

for nombre, modelo in [("Modelo A", modelo_a), ("Modelo B", modelo_b)]:
    p = precision_at_k(modelo, relevantes, K)
    r = recall_at_k(modelo, relevantes, K)
    ap = average_precision(modelo, relevantes, K)
    nd = ndcg_at_k(modelo, relevantes, K)
    print(f"{nombre}:")
    print(f"  Precision@{K}: {p:.4f}  ({p*100:.1f}% de top-{K} son relevantes)")
    print(f"  Recall@{K}   : {r:.4f}  ({r*100:.1f}% de los relevantes encontrados)")
    print(f"  AP@{K}       : {ap:.4f}  (promedio considerando orden)")
    print(f"  NDCG@{K}     : {nd:.4f}  (calidad del ranking, 1=perfecto)")
    print()
```

3. Evalua a nivel de sistema (Mean Average Precision):

```python
# ========================================================
# PARTE 2: MAP y NDCG a nivel de sistema (todos los usuarios)
# ========================================================

def mean_average_precision(recomendaciones_dict, relevantes_dict, k):
    """
    MAP@K: Promedio de AP@K sobre todos los usuarios.
    Es la metrica mas usada para comparar sistemas.
    """
    aps = []
    for user_id in relevantes_dict:
        if user_id in recomendaciones_dict:
            ap = average_precision(recomendaciones_dict[user_id],
                                   relevantes_dict[user_id], k)
            aps.append(ap)
    return np.mean(aps) if aps else 0.0

def mean_ndcg(recomendaciones_dict, relevantes_dict, k):
    """NDCG promedio sobre todos los usuarios."""
    scores = []
    for user_id in relevantes_dict:
        if user_id in recomendaciones_dict:
            score = ndcg_at_k(recomendaciones_dict[user_id],
                               relevantes_dict[user_id], k)
            scores.append(score)
    return np.mean(scores) if scores else 0.0

# Simular 100 usuarios del portal de empleo ecuatoriano
np.random.seed(42)
n_usuarios = 100
n_vacantes = 200

# Relevantes reales: cada usuario tiene 5-15 vacantes que le interesan
relevantes_usuarios = {
    uid: set(np.random.choice(n_vacantes, np.random.randint(5, 16), replace=False))
    for uid in range(n_usuarios)
}

# Modelo A: bueno (muchos relevantes en top-10)
recs_modelo_a = {}
for uid, relevantes in relevantes_usuarios.items():
    rel_list = list(relevantes)
    non_rel = list(set(range(n_vacantes)) - relevantes)
    # 70% relevantes en top-10
    n_rel_top = int(0.7 * 10)
    top_k = (np.random.choice(rel_list, min(n_rel_top, len(rel_list)), replace=False).tolist() +
             np.random.choice(non_rel, 10 - min(n_rel_top, len(rel_list)), replace=False).tolist())
    np.random.shuffle(top_k)
    recs_modelo_a[uid] = top_k

# Modelo B: basico (40% relevantes en top-10)
recs_modelo_b = {}
for uid, relevantes in relevantes_usuarios.items():
    rel_list = list(relevantes)
    non_rel = list(set(range(n_vacantes)) - relevantes)
    n_rel_top = int(0.4 * 10)
    top_k = (np.random.choice(rel_list, min(n_rel_top, len(rel_list)), replace=False).tolist() +
             np.random.choice(non_rel, 10 - min(n_rel_top, len(rel_list)), replace=False).tolist())
    np.random.shuffle(top_k)
    recs_modelo_b[uid] = top_k

# Calcular metricas para K = 1, 3, 5, 10
Ks = [1, 3, 5, 10]
resultados = {'K': Ks}

for nombre, recs in [('Modelo_A_NCF', recs_modelo_a), ('Modelo_B_SVD', recs_modelo_b)]:
    maps = [mean_average_precision(recs, relevantes_usuarios, k) for k in Ks]
    ndcgs = [mean_ndcg(recs, relevantes_usuarios, k) for k in Ks]
    precisions = [np.mean([precision_at_k(recs[u], relevantes_usuarios[u], k)
                           for u in range(n_usuarios)]) for k in Ks]
    recalls = [np.mean([recall_at_k(recs[u], relevantes_usuarios[u], k)
                        for u in range(n_usuarios)]) for k in Ks]
    resultados[f'{nombre}_MAP'] = maps
    resultados[f'{nombre}_NDCG'] = ndcgs
    resultados[f'{nombre}_Precision'] = precisions
    resultados[f'{nombre}_Recall'] = recalls

df_resultados = pd.DataFrame(resultados).set_index('K')
print("COMPARACION DE MODELOS - Multitrabajos Ecuador")
print(df_resultados.round(4).to_string())
```

4. Visualiza y compara:

```python
# ========================================================
# PARTE 3: Visualizacion comparativa
# ========================================================

fig, axes = plt.subplots(2, 2, figsize=(13, 10))
colores = {'Modelo_A_NCF': '#1F2F58', 'Modelo_B_SVD': '#FBBC0C'}
metricas = ['MAP', 'NDCG', 'Precision', 'Recall']

for idx, metrica in enumerate(metricas):
    ax = axes[idx // 2][idx % 2]
    for nombre in ['Modelo_A_NCF', 'Modelo_B_SVD']:
        valores = df_resultados[f'{nombre}_{metrica}']
        ax.plot(Ks, valores, marker='o', label=nombre,
                color=colores[nombre], linewidth=2)
    ax.set_xlabel('K (longitud de lista recomendada)')
    ax.set_ylabel(metrica)
    ax.set_title(f'{metrica}@K - Portal Empleo Ecuador')
    ax.legend()
    ax.grid(True, alpha=0.3)
    ax.set_xticks(Ks)

plt.suptitle('Evaluacion Sistema Recomendacion | ITSEIA P5', color='gray', fontsize=12)
plt.tight_layout()
plt.show()

# Tabla resumen con interpretacion de negocio
print("\nINTERPRETACION DE NEGOCIO:")
print("=" * 60)
interpretaciones = {
    'Precision@5': "De cada 5 vacantes mostradas, cuantas son relevantes para el candidato",
    'Recall@10' : "Del total de vacantes que le gustarian al usuario, cuantas aparecen en top-10",
    'MAP@10'    : "Calidad promedio del ranking considerando orden en toda la lista",
    'NDCG@5'    : "Que tan cerca esta el ranking del orden perfecto en los primeros 5",
}
for metrica, descripcion in interpretaciones.items():
    print(f"  {metrica}: {descripcion}")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "Tengo dos sistemas de recomendacion para un portal de empleo ecuatoriano. El Sistema A tiene NDCG@5 = 0.72 pero Recall@10 = 0.41. El Sistema B tiene NDCG@5 = 0.58 pero Recall@10 = 0.69. ¿Cual sistema debo elegir para produccion? ¿Como influye el comportamiento del usuario (si hace scroll o no) en que metrica priorizar? ¿En que casos me importa mas Precision que Recall?"

Despues de leer la respuesta:
- Agrega a tu notebook una celda markdown con la decision razonada que tomarias para Multitrabajos.com.
- Incluye cual metrica usarias como metrica principal (north star metric) y por que.

## Que aprendiste

- **Precision@K** mide la "densidad de relevancia" en los K primeros items recomendados.
- **Recall@K** mide la "cobertura": cuantos items buenos logramos incluir en la lista.
- **MAP** es el estandar academico para comparar sistemas: promedia la precision en cada posicion relevante, considerando el orden.
- **NDCG** usa descuento logaritmico: encontrar un item relevante en posicion 1 vale mas que en posicion 10.
- En production, la eleccion de metrica depende del comportamiento del usuario: si ve los primeros 3 items (ej. app movil), optimiza NDCG@3; si hace scroll largo, Recall@20 importa mas.

## Reto extra

Implementa la metrica **Hit Rate@K** (al menos 1 item relevante en los K recomendados) que usan sistemas como Netflix para reportar resultados. Calcula el Hit Rate@5 para ambos modelos. Luego investiga que es el **Coverage** (que porcentaje del catalogo total aparece en recomendaciones) y por que es importante para evitar el problema de "filter bubble" en Ecuador donde pocos productos acaparan todas las recomendaciones.
