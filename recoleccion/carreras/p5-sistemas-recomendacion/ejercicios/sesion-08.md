# Ejercicio Sesion 8: Proyecto — Sistema de Recomendacion de Productos Ecuatorianos

**Materia:** Sistemas de Recomendacion
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 60 min

## Objetivo

Construir un sistema de recomendacion end-to-end completo para productos de exportacion ecuatorianos, integrando filtrado colaborativo, filtrado por contenido e hibrido con cold start, evaluando con Precision@K y NDCG, y entregando un prototipo funcional con API simulada lista para presentar.

## Contexto

Ecuador es el primer exportador mundial de banano, el segundo de cacao fino de aroma, y produce mas de 4,000 productos artesanales catalogados por ProEcuador. Sin embargo, los compradores internacionales (importadores, distribuidores) navegan portales desorganizados sin personalizacion. Un sistema de recomendacion para ProEcuador.gob.ec o para plataformas como Alibaba Ecuador podria incrementar el ticket promedio y el numero de pedidos de exportadores pequenos que hoy son invisibles. Este es el proyecto integrador de la materia: aplicas todo lo aprendido en 7 sesiones a un problema real y medible.

## Instrucciones

El proyecto tiene cinco componentes que debes completar en orden. Crea un notebook `proyecto_recomendacion_ecuador.ipynb`.

### Componente 1: Dataset y Exploracion

```python
# Proyecto: Sistema Recomendacion Productos Ecuatorianos
# ITSEIA - Periodo 5 - Sesion 8 (Proyecto Final)
# Estudiante: [Tu nombre]
# Fecha: [Fecha]

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from collections import defaultdict

np.random.seed(2025)

# ========================================================
# COMPONENTE 1: Dataset — Productos Ecuatorianos
# ========================================================

# Catalogo de productos ecuatorianos de exportacion
productos = pd.DataFrame({
    'producto_id': range(60),
    'nombre': [
        # Banano y platano
        'Banano_Cavendish_Premium', 'Banano_Organico_Certificado', 'Platano_Macho_Exportacion',
        # Cacao y chocolate
        'Cacao_Nacional_Fino_Aroma', 'Cacao_CCN51_Fermentado', 'Chocolate_70_Nacional',
        'Cacao_Polvo_Alcalinizado', 'Manteca_Cacao_Refinada',
        # Cafe
        'Cafe_Arabica_Loja_Altura', 'Cafe_Espresso_Galápagos', 'Cafe_Organico_Waorani',
        # Flores
        'Rosas_Premium_Ecuador', 'Gypsophila_Exportacion', 'Claveles_Mix_Exportacion',
        'Lirios_Blancos_Premium', 'Heliconia_Tropical',
        # Frutas tropicales
        'Mango_Tommy_Atkins', 'Papaya_Maradol_Fresca', 'Pitahaya_Amarilla_Organica',
        'Maracuya_Concentrado', 'Uvilla_Fresca_Certificada', 'Babaco_Deshidratado',
        # Mariscos
        'Camaron_Vannamei_Congelado', 'Tilapia_Filete_Fresco', 'Langostino_Entero_IQF',
        'Camaron_Organico_Mangrove',
        # Artesanias
        'Sombrero_Paja_Toquilla', 'Tagua_Talla_Elefante', 'Alpargatas_Cuero_Handmade',
        'Tejido_Otavalo_Tradicional', 'Ceramica_Chordeleg_Pintada',
        # Aceites y plantas
        'Aceite_Palma_Refinado', 'Aceite_Rosas_Esencial', 'Extracto_Cat_Claw_Organico',
        'Sangre_Drago_Certificada', 'Aceite_Aguacate_Cold_Press',
        # Granos andinos
        'Quinua_Blanca_Chimborazo', 'Amaranto_Organico_Imbabura', 'Chocho_Tostado_Snack',
        'Chia_Organica_Certificada',
        # Conservas y procesados
        'Atun_Agua_Conserva', 'Sardinas_Aceite_Conserva', 'Palmito_Rodajas_Conserva',
        'Alcachofa_Marinada_Frasco', 'Pulpa_Frutas_Congelada',
        # Madera y fibras
        'Balsa_Tablones_Secos', 'Bambu_Guadua_Laminado', 'Paja_Toquilla_Cruda',
        # Cosmeticos naturales
        'Mascarilla_Barro_Cuicocha', 'Shampoo_Quinua_Natural', 'Crema_Cacao_Hidratante',
        'Aceite_Coco_Artesanal',
        # Textiles tecnicos
        'Tela_Algodon_Organico', 'Lana_Alpaca_Hilada', 'Hilo_Vicuna_Premium',
        # Snacks y superfoods
        'Chips_Platano_Artesanal', 'Granola_Andina_SuperSeed', 'Barra_Cacao_Energetica',
        'Mix_Frutos_Amazonia', 'Polvo_Maca_Organica'
    ][:60],
    'categoria': np.random.choice(
        ['Frutas_Tropicales', 'Cacao_Chocolate', 'Cafe', 'Flores', 'Mariscos',
         'Artesanias', 'Granos_Andinos', 'Aceites_Plantas', 'Procesados', 'Superfoods'],
        60
    ),
    'precio_usd_kg': np.round(np.random.uniform(2, 85, 60), 2),
    'region': np.random.choice(['Costa', 'Sierra', 'Amazonia', 'Galapagos'], 60, p=[0.45, 0.35, 0.15, 0.05]),
    'certificacion': np.random.choice(['Organico', 'Convencional', 'Fairtrade', 'Rainforest'], 60),
    'descripcion': [
        f"Producto ecuatoriano de alta calidad. Origen {r}. Exportacion directa al mercado internacional."
        for r in np.random.choice(['Costa', 'Sierra', 'Amazonia'], 60)
    ]
})

# Compradores internacionales (importadores por pais)
compradores = pd.DataFrame({
    'comprador_id': range(150),
    'nombre': [f'Importador_{i:03d}' for i in range(150)],
    'pais': np.random.choice(['USA', 'Alemania', 'Japon', 'Francia', 'Colombia',
                               'Peru', 'China', 'Italia', 'Espana', 'Canada'], 150),
    'tipo': np.random.choice(['Distribuidor', 'Minorista', 'Mayorista', 'Procesador'], 150)
})

# Generar interacciones historicas
interacciones_base = []
for comp_id in range(150):
    n_pedidos = np.random.randint(3, 20)
    prods_preferidos = np.random.choice(60, n_pedidos, replace=False)
    for prod_id in prods_preferidos:
        rating = np.random.choice([3, 4, 5], p=[0.15, 0.40, 0.45])
        interacciones_base.append({
            'comprador_id': comp_id,
            'producto_id': prod_id,
            'rating': rating,
            'n_pedidos': np.random.randint(1, 10)
        })

df_inter = pd.DataFrame(interacciones_base)

print("PROYECTO: Sistema Recomendacion ProEcuador")
print("=" * 55)
print(f"Productos en catalogo : {len(productos)}")
print(f"Compradores registrados: {len(compradores)}")
print(f"Interacciones historicas: {len(df_inter)}")
print(f"Densidad matriz       : {len(df_inter)/(len(compradores)*len(productos)):.1%}")
print(f"\nDistribucion por categoria:")
print(productos['categoria'].value_counts().head(8).to_string())
print(f"\nDistribucion por region:")
print(productos['region'].value_counts().to_string())
```

### Componente 2: Sistema Colaborativo

```python
# ========================================================
# COMPONENTE 2: Filtrado Colaborativo (User-Based)
# ========================================================

def construir_matriz_ratings(df_inter, n_compradores, n_productos):
    matriz = np.zeros((n_compradores, n_productos))
    for _, row in df_inter.iterrows():
        matriz[int(row['comprador_id']), int(row['producto_id'])] = row['rating']
    return matriz

def similitud_coseno_matriz(matriz):
    from sklearn.metrics.pairwise import cosine_similarity
    return cosine_similarity(matriz)

def recomendar_colaborativo(comprador_id, matriz_ratings, similitud_matrix,
                              productos_df, k_vecinos=5, k_recs=10):
    similitudes = similitud_matrix[comprador_id]
    vecinos_idx = np.argsort(similitudes)[::-1][1:k_vecinos+1]

    ya_comprados = set(np.where(matriz_ratings[comprador_id] > 0)[0])

    scores = defaultdict(float)
    pesos_totales = defaultdict(float)

    for vecino in vecinos_idx:
        sim = similitudes[vecino]
        for prod_id in range(matriz_ratings.shape[1]):
            if prod_id not in ya_comprados and matriz_ratings[vecino, prod_id] > 0:
                scores[prod_id] += sim * matriz_ratings[vecino, prod_id]
                pesos_totales[prod_id] += sim

    predicciones = {}
    for prod_id, score_total in scores.items():
        if pesos_totales[prod_id] > 0:
            predicciones[prod_id] = score_total / pesos_totales[prod_id]

    top_k = sorted(predicciones.items(), key=lambda x: x[1], reverse=True)[:k_recs]
    return top_k

# Construir y evaluar
matriz = construir_matriz_ratings(df_inter, 150, 60)
sim_matrix = similitud_coseno_matriz(matriz)

comprador_ejemplo = 10
recs_colab = recomendar_colaborativo(comprador_ejemplo, matriz, sim_matrix, productos, k_recs=5)

print("FILTRADO COLABORATIVO - Comprador 10 (Importador_010)")
print(f"Pais: {compradores.loc[comprador_ejemplo, 'pais']}, Tipo: {compradores.loc[comprador_ejemplo, 'tipo']}")
print("\nTop-5 recomendaciones colaborativas:")
for prod_id, score in recs_colab:
    prod = productos.loc[prod_id]
    print(f"  {prod['nombre']:<35} | score={score:.3f} | cat={prod['categoria']}")
```

### Componente 3: Sistema por Contenido

```python
# ========================================================
# COMPONENTE 3: Filtrado por Contenido (TF-IDF)
# ========================================================

def construir_perfil_comprador(comprador_id, df_inter, productos_df):
    """Construye un perfil textual del comprador basado en sus compras."""
    prods_comprados = df_inter[df_inter['comprador_id'] == comprador_id]['producto_id']
    if len(prods_comprados) == 0:
        return ""
    descripciones = productos_df.loc[prods_comprados, 'descripcion'].tolist()
    categorias = productos_df.loc[prods_comprados, 'categoria'].tolist()
    return " ".join(descripciones + categorias)

# Vectorizar productos con TF-IDF
vectorizer = TfidfVectorizer(max_features=200)
textos_productos = (productos['nombre'] + " " + productos['categoria'] + " " + productos['descripcion'])
tfidf_productos = vectorizer.fit_transform(textos_productos)

def recomendar_contenido(comprador_id, df_inter, productos_df, tfidf_prod, k_recs=10):
    perfil = construir_perfil_comprador(comprador_id, df_inter, productos_df)
    if not perfil:
        return []
    perfil_vec = vectorizer.transform([perfil])
    similitudes = cosine_similarity(perfil_vec, tfidf_prod).flatten()
    ya_comprados = set(df_inter[df_inter['comprador_id'] == comprador_id]['producto_id'])
    scores = [(i, sim) for i, sim in enumerate(similitudes) if i not in ya_comprados]
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:k_recs]

recs_contenido = recomendar_contenido(comprador_ejemplo, df_inter, productos, tfidf_productos, k_recs=5)

print("\nFILTRADO POR CONTENIDO - Comprador 10")
print("Top-5 recomendaciones por contenido:")
for prod_id, score in recs_contenido:
    prod = productos.loc[prod_id]
    print(f"  {prod['nombre']:<35} | score={score:.4f} | cert={prod['certificacion']}")
```

### Componente 4: Sistema Hibrido y Evaluacion

```python
# ========================================================
# COMPONENTE 4: Hibrido + Evaluacion con Metricas
# ========================================================

def recomendar_hibrido(comprador_id, matriz_ratings, sim_matrix, df_inter,
                        productos_df, tfidf_prod, alpha=0.6, k_recs=10):
    """
    Combina colaborativo (alpha) y contenido (1-alpha).
    alpha=0.6 -> 60% colaborativo, 40% contenido.
    """
    recs_colab = dict(recomendar_colaborativo(
        comprador_id, matriz_ratings, sim_matrix, productos_df, k_recs=30))
    recs_cont = dict(recomendar_contenido(
        comprador_id, df_inter, productos_df, tfidf_prod, k_recs=30))

    # Normalizar scores a [0,1]
    def normalizar(d):
        if not d:
            return d
        max_v = max(d.values())
        min_v = min(d.values())
        rng = max_v - min_v if max_v != min_v else 1
        return {k: (v - min_v) / rng for k, v in d.items()}

    colab_norm = normalizar(recs_colab)
    cont_norm = normalizar(recs_cont)

    todos_ids = set(colab_norm.keys()) | set(cont_norm.keys())
    scores_hibridos = {}
    for prod_id in todos_ids:
        c = colab_norm.get(prod_id, 0)
        t = cont_norm.get(prod_id, 0)
        scores_hibridos[prod_id] = alpha * c + (1 - alpha) * t

    top = sorted(scores_hibridos.items(), key=lambda x: x[1], reverse=True)[:k_recs]
    return top

# Evaluar los tres sistemas con Precision@5 y Recall@5
def evaluar_sistema(modelo_fn, df_inter, n_test_usuarios=30, k=5):
    # Dividir datos en train/test por tiempo (simular con shuffle)
    train_inter = df_inter.sample(frac=0.8, random_state=42)
    test_inter = df_inter.drop(train_inter.index)

    presiciones = []
    recalls = []

    usuarios_con_test = test_inter['comprador_id'].unique()[:n_test_usuarios]
    for uid in usuarios_con_test:
        relevantes = set(test_inter[test_inter['comprador_id'] == uid]
                         [test_inter['rating'] >= 4]['producto_id'])
        if len(relevantes) == 0:
            continue
        recomendados = [r[0] for r in modelo_fn(uid)][:k]
        n_hits = len(set(recomendados) & relevantes)
        presiciones.append(n_hits / k)
        recalls.append(n_hits / len(relevantes))

    return np.mean(presiciones), np.mean(recalls)

# Evaluar los tres modelos
mat_train = construir_matriz_ratings(df_inter, 150, 60)
sim_train = similitud_coseno_matriz(mat_train)

fn_colab = lambda uid: recomendar_colaborativo(uid, mat_train, sim_train, productos, k_recs=10)
fn_cont = lambda uid: recomendar_contenido(uid, df_inter, productos, tfidf_productos, k_recs=10)
fn_hibrido = lambda uid: recomendar_hibrido(uid, mat_train, sim_train, df_inter, productos, tfidf_productos)

resultados_eval = {}
for nombre, fn in [('Colaborativo', fn_colab), ('Contenido', fn_cont), ('Hibrido', fn_hibrido)]:
    p, r = evaluar_sistema(fn, df_inter)
    resultados_eval[nombre] = {'Precision@5': p, 'Recall@5': r, 'F1@5': 2*p*r/(p+r) if (p+r) > 0 else 0}

df_eval = pd.DataFrame(resultados_eval).T
print("\nEVALUACION COMPARATIVA - ProEcuador")
print(df_eval.round(4).to_string())
```

### Componente 5: API Simulada y Presentacion

```python
# ========================================================
# COMPONENTE 5: API Simulada y Dashboard Final
# ========================================================

class SistemaRecomendacionProEcuador:
    """
    API de recomendacion simulada para ProEcuador.gob.ec
    En produccion: FastAPI + Redis + PostgreSQL
    """

    def __init__(self, productos, compradores, df_inter, tfidf_prod, vectorizer):
        self.productos = productos
        self.compradores = compradores
        self.df_inter = df_inter
        self.tfidf_prod = tfidf_prod
        self.matriz = construir_matriz_ratings(df_inter, len(compradores), len(productos))
        self.sim_matrix = similitud_coseno_matriz(self.matriz)
        self._cache = {}

    def recomendar(self, comprador_id, k=5, estrategia='hibrido'):
        """Endpoint principal de recomendacion."""
        cache_key = f"{comprador_id}_{k}_{estrategia}"
        if cache_key in self._cache:
            return {'source': 'cache', 'recomendaciones': self._cache[cache_key]}

        if self.matriz[comprador_id].sum() == 0:
            # Cold start: popularidad
            populares = (self.df_inter.groupby('producto_id')['rating']
                         .mean().sort_values(ascending=False).head(k))
            recs_raw = list(populares.index)
            estrategia = 'popularidad_cold_start'
        elif estrategia == 'hibrido':
            recs_raw = [r[0] for r in recomendar_hibrido(
                comprador_id, self.matriz, self.sim_matrix,
                self.df_inter, self.productos, self.tfidf_prod, k_recs=k)]
        elif estrategia == 'colaborativo':
            recs_raw = [r[0] for r in recomendar_colaborativo(
                comprador_id, self.matriz, self.sim_matrix, self.productos, k_recs=k)]
        else:
            recs_raw = [r[0] for r in recomendar_contenido(
                comprador_id, self.df_inter, self.productos, self.tfidf_prod, k_recs=k)]

        resultado = []
        for prod_id in recs_raw:
            prod = self.productos.loc[prod_id]
            resultado.append({
                'producto_id': prod_id,
                'nombre': prod['nombre'],
                'categoria': prod['categoria'],
                'precio_usd_kg': prod['precio_usd_kg'],
                'region': prod['region'],
                'certificacion': prod['certificacion']
            })

        self._cache[cache_key] = resultado
        return {'source': 'modelo', 'estrategia': estrategia, 'recomendaciones': resultado}

# Inicializar sistema
sistema = SistemaRecomendacionProEcuador(productos, compradores, df_inter,
                                          tfidf_productos, vectorizer)

# Demostrar con 3 tipos de compradores
casos_demo = [
    (5, "Importador alemán (historial amplio)"),
    (78, "Distribuidor japonés (historial amplio)"),
]

print("\nDEMO API - Sistema ProEcuador")
print("=" * 65)
for cid, descripcion in casos_demo:
    resp = sistema.recomendar(cid, k=5)
    print(f"\nComprador {cid}: {descripcion}")
    print(f"Estrategia usada: {resp.get('estrategia', resp['source'])}")
    for item in resp['recomendaciones']:
        print(f"  {item['nombre']:<35} | ${item['precio_usd_kg']}/kg | {item['certificacion']}")

# Visualizacion final: Distribucion de categorias recomendadas
fig, axes = plt.subplots(1, 2, figsize=(13, 5))

# Grafico 1: evaluacion de modelos
modelos = list(resultados_eval.keys())
metricas_vals = ['Precision@5', 'Recall@5', 'F1@5']
x = np.arange(len(modelos))
width = 0.25
colores_met = ['#1F2F58', '#FBBC0C', '#73B8E7']

for i, met in enumerate(metricas_vals):
    vals = [resultados_eval[m][met] for m in modelos]
    axes[0].bar(x + i*width, vals, width, label=met, color=colores_met[i])

axes[0].set_xticks(x + width)
axes[0].set_xticklabels(modelos)
axes[0].set_ylabel('Score')
axes[0].set_title('Comparacion de Modelos')
axes[0].legend()
axes[0].grid(True, alpha=0.3, axis='y')

# Grafico 2: distribucion de productos en el catalogo
cat_counts = productos['categoria'].value_counts()
colores_pastel = plt.cm.Set3(np.linspace(0, 1, len(cat_counts)))
axes[1].barh(cat_counts.index, cat_counts.values, color=colores_pastel)
axes[1].set_xlabel('Numero de productos')
axes[1].set_title('Catalogo ProEcuador por Categoria')
axes[1].grid(True, alpha=0.3, axis='x')

plt.suptitle('Sistema Recomendacion ProEcuador | ITSEIA P5 - Proyecto Final', color='gray')
plt.tight_layout()
plt.show()

print("\nRESUMEN EJECUTIVO DEL PROYECTO:")
print("=" * 55)
print(f"Mejor modelo    : {max(resultados_eval, key=lambda x: resultados_eval[x]['F1@5'])}")
print(f"F1@5 del mejor  : {max(r['F1@5'] for r in resultados_eval.values()):.4f}")
print(f"Productos en cat: {len(productos)}")
print(f"Compradores     : {len(compradores)}")
print(f"Items en cache  : {len(sistema._cache)}")
print("\nProximos pasos para produccion:")
print("  1. Reemplazar cache dict por Redis")
print("  2. Exponer API con FastAPI (GET /recomendar/{comprador_id})")
print("  3. Conectar a base de datos real de ProEcuador")
print("  4. Agregar reentrenamiento automatico semanal")
print("  5. Implementar A/B testing para comparar versiones del modelo")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "Complete un sistema de recomendacion para ProEcuador con Precision@5 de [tu resultado] y F1@5 de [tu resultado]. El modelo hibrido supero al colaborativo puro en [X]%. Tengo 60 productos, 150 compradores internacionales y datos escasos (densidad del catalogo: [tu porcentaje]%). ¿Que mejoras concretas implementaria si tuviera 6 meses mas? Prioriza las 3 mas impactantes para una plataforma de exportacion ecuatoriana. ¿Como haria para incluir datos implicitos como visitas a la pagina del producto y descargas de fichas tecnicas?"

Despues de leer la respuesta:
- Agrega al notebook una celda markdown con el roadmap de mejoras priorizado.
- Define las 3 metricas que monitorearias en produccion y por que.

## Que aprendiste

- Un sistema end-to-end integra **exploracion de datos**, **filtrado colaborativo**, **filtrado por contenido**, **logica hibrida** y **evaluacion cuantitativa** en un pipeline coherente.
- El **modelo hibrido** consistentemente supera a los enfoques individuales cuando hay datos suficientes.
- La **API simulada** con cache es el paso previo directo a un despliegue real con FastAPI + Redis.
- El **cold start** se resuelve automaticamente detectando compradores sin historial y aplicando el fallback de popularidad.
- En contexto ecuatoriano, atributos como **certificacion organica**, **region de origen** y **precio por kilogramo** son diferenciadores clave que el filtrado por contenido puede aprovechar para mercados internacionales exigentes.

## Reto extra

Incorpora un componente de **diversidad** al sistema hibrido: despues de calcular los top-20 candidatos, aplica el algoritmo Maximal Marginal Relevance (MMR) para que las 5 recomendaciones finales no sean todas de la misma categoria. Parametriza el balance relevancia-diversidad con lambda (0=maxima diversidad, 1=maxima relevancia) y evalua si la diversidad mejora o perjudica el F1@5 en tu dataset.
