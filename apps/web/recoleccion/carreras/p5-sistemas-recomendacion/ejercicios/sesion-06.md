# Ejercicio Sesion 6: Cold Start Problem y Soluciones

**Materia:** Sistemas de Recomendacion
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion estimada:** 45 min

## Objetivo

Identificar los tres tipos de cold start (nuevo usuario, nuevo item, nuevo sistema), implementar estrategias concretas para cada uno y construir un sistema de onboarding inteligente con preguntas adaptativas aplicado al lanzamiento de una plataforma ecuatoriana.

## Contexto

El cold start es el primer enemigo de cualquier sistema de recomendacion en produccion: el primer dia que lanza una startup ecuatoriana — como DeUna, Kushki o cualquier nuevo marketplace — no tiene ningun historial de interacciones. Tampoco cuando un nuevo usuario se registra, o cuando incorporas un producto nuevo al catalogo. Sin datos historicos, el filtrado colaborativo falla completamente. Resolver el cold start es la diferencia entre una primera experiencia que convierte y una que hace que el usuario abandone la app en los primeros 5 minutos.

## Instrucciones

1. Abre Google Colab y crea `sesion06_cold_start.ipynb`.

2. Mapea los tres tipos de cold start y sus estrategias:

```python
# Sistemas de Recomendacion - Sesion 6: Cold Start Problem
# ITSEIA - Periodo 5
# Estudiante: [Tu nombre]

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ========================================================
# PARTE 1: Mapa de Cold Start y Estrategias
# ========================================================

cold_start_map = {
    "Nuevo Usuario": {
        "descripcion": "Usuario recien registrado, cero interacciones",
        "problema": "No hay historial para calcular similitud ni perfil latente",
        "estrategias": [
            "1. Popularidad global: recomendar los mas vistos/comprados (fallback seguro)",
            "2. Onboarding quiz: preguntar preferencias explicitas al registrarse",
            "3. Datos demograficos: edad, genero, ubicacion -> perfil implicito",
            "4. Zero-shot con LLM: usar descripcion textual del usuario para recomendacion",
            "5. Exploración activa: bandit algorithms (UCB, Thompson Sampling)",
        ],
        "caso_ecuador": "Nuevo usuario en DeUna.ec: muestra las 10 tiendas mas populares en su barrio de Quito",
        "tiempo_resolucion": "5-10 interacciones suficientes para perfil basico"
    },
    "Nuevo Item": {
        "descripcion": "Producto/servicio recien agregado al catalogo, cero ratings",
        "problema": "No hay usuarios que lo hayan calificado, no aparece en colaborativo",
        "estrategias": [
            "1. Filtrado por contenido: usar metadata del item (descripcion, categoria, precio)",
            "2. Item embeddings: encodificar atributos con BERT o Word2Vec",
            "3. Knowledge-based: reglas explicitas (si es electronico + barato -> jovenes)",
            "4. Boosting temporal: forzar exposicion inicial para recolectar datos rapido",
            "5. Transferencia: usar embeddings de items similares como punto de partida",
        ],
        "caso_ecuador": "Nuevo producto artesanal en OLX Ecuador: recomendar usando descripcion y categoria",
        "tiempo_resolucion": "50-100 interacciones para entrar al colaborativo"
    },
    "Nuevo Sistema": {
        "descripcion": "La plataforma es nueva, no hay ningun dato historico",
        "problema": "Sin usuarios ni items con historial, el sistema no puede aprender",
        "estrategias": [
            "1. Datos curados: equipo editorial selecciona recomendaciones iniciales",
            "2. Importar datos externos: redes sociales, historial previo del usuario",
            "3. Simular interacciones: pilotos con usuarios internos antes del lanzamiento",
            "4. Reglas de negocio: 'si busca electronico, muestra los mas vendidos de esa categoria'",
            "5. Modelos pre-entrenados: fine-tuning de modelos open-source con datos del dominio",
        ],
        "caso_ecuador": "Lanzamiento de marketplace SRI para servicios gubernamentales Ecuador",
        "tiempo_resolucion": "Minimo 1,000 usuarios activos para que colaborativo funcione bien"
    }
}

print("MAPA COLD START - Sistemas de Recomendacion")
print("=" * 65)
for tipo, info in cold_start_map.items():
    print(f"\n{'='*20} {tipo.upper()} {'='*20}")
    print(f"Descripcion     : {info['descripcion']}")
    print(f"Problema central: {info['problema']}")
    print(f"\nEstrategias:")
    for e in info['estrategias']:
        print(f"  {e}")
    print(f"\nCaso Ecuador: {info['caso_ecuador']}")
    print(f"Resolucion  : {info['tiempo_resolucion']}")
```

3. Implementa la estrategia de popularidad como fallback:

```python
# ========================================================
# PARTE 2: Estrategia 1 — Popularidad Global (fallback seguro)
# ========================================================

np.random.seed(42)
n_productos = 50
n_usuarios_existentes = 500

# Simular catalogo de productos de tienda ecuatoriana (MiComisariato)
categorias = ['Frutas', 'Lacteos', 'Carnes', 'Bebidas', 'Limpieza', 'Snacks']
productos_catalogo = pd.DataFrame({
    'producto_id': range(n_productos),
    'nombre': [f'Producto_{i:03d}' for i in range(n_productos)],
    'categoria': np.random.choice(categorias, n_productos),
    'precio': np.random.uniform(0.5, 25.0, n_productos).round(2),
    'origen': np.random.choice(['Nacional', 'Importado'], n_productos, p=[0.7, 0.3])
})

# Simular interacciones de usuarios existentes (ley de Pareto: 20% productos = 80% compras)
popularidad = np.random.zipf(1.8, n_productos)
popularidad = popularidad.astype(float) / popularidad.sum()

interacciones = pd.DataFrame({
    'usuario_id': np.random.randint(0, n_usuarios_existentes, 5000),
    'producto_id': np.random.choice(n_productos, 5000, p=popularidad),
    'rating': np.random.choice([3, 4, 5], 5000, p=[0.2, 0.4, 0.4])
})

# Calcular scores de popularidad ponderados
popularidad_scores = (interacciones.groupby('producto_id')
                      .agg(n_compras=('usuario_id', 'count'),
                           rating_promedio=('rating', 'mean'))
                      .reset_index())
popularidad_scores['score_popularidad'] = (
    0.6 * popularidad_scores['n_compras'] / popularidad_scores['n_compras'].max() +
    0.4 * (popularidad_scores['rating_promedio'] - 1) / 4
)
popularidad_scores = popularidad_scores.sort_values('score_popularidad', ascending=False)
top_productos = popularidad_scores.merge(productos_catalogo, on='producto_id').head(10)

print("TOP-10 PRODUCTOS (estrategia fallback para nuevo usuario)")
print(top_productos[['producto_id', 'nombre', 'categoria', 'n_compras',
                      'rating_promedio', 'score_popularidad']].round(3).to_string())
```

4. Implementa onboarding quiz adaptativo:

```python
# ========================================================
# PARTE 3: Estrategia 2 — Onboarding Quiz Adaptativo
# ========================================================

# Definir preguntas del quiz de onboarding
quiz_preguntas = [
    {
        "pregunta": "¿Para cuantas personas compras normalmente?",
        "opciones": {"1": "Solo yo", "2": "Pareja (2 personas)", "3": "Familia pequena (3-4)", "4": "Familia grande (5+)"},
        "mapeo_categoria": {"1": ["Snacks", "Bebidas"], "2": ["Lacteos", "Frutas"],
                            "3": ["Carnes", "Frutas", "Lacteos"], "4": ["Carnes", "Limpieza"]}
    },
    {
        "pregunta": "¿Cuanto sueles gastar por visita al supermercado?",
        "opciones": {"1": "Menos de $20", "2": "$20-$50", "3": "$50-$100", "4": "Mas de $100"},
        "mapeo_precio": {"1": (0, 5), "2": (2, 15), "3": (5, 25), "4": (10, 100)}
    },
    {
        "pregunta": "¿Prefieres productos nacionales o importados?",
        "opciones": {"1": "Nacional (apoya al productor ecuatoriano)", "2": "Importado (marcas internacionales)",
                     "3": "Me es indiferente"},
        "mapeo_origen": {"1": "Nacional", "2": "Importado", "3": None}
    }
]

def recomendar_por_quiz(respuestas_usuario, productos_catalogo, top_popularidad, k=5):
    """
    Recomienda basandose en las respuestas del quiz + popularidad.
    Combina filtros de contenido (categoria, precio, origen) con popularidad.
    """
    filtros_aplicados = []
    prods_filtrados = productos_catalogo.copy()

    # Filtrar por categoria preferida
    if '0' in respuestas_usuario:
        resp = respuestas_usuario['0']
        categorias_pref = quiz_preguntas[0]['mapeo_categoria'].get(resp, [])
        if categorias_pref:
            prods_filtrados = prods_filtrados[prods_filtrados['categoria'].isin(categorias_pref)]
            filtros_aplicados.append(f"Categorias preferidas: {categorias_pref}")

    # Filtrar por rango de precio
    if '1' in respuestas_usuario:
        resp = respuestas_usuario['1']
        precio_min, precio_max = quiz_preguntas[1]['mapeo_precio'].get(resp, (0, 100))
        prods_filtrados = prods_filtrados[
            (prods_filtrados['precio'] >= precio_min) &
            (prods_filtrados['precio'] <= precio_max)
        ]
        filtros_aplicados.append(f"Rango precio: ${precio_min}-${precio_max}")

    # Filtrar por origen
    if '2' in respuestas_usuario:
        resp = respuestas_usuario['2']
        origen_pref = quiz_preguntas[2]['mapeo_origen'].get(resp)
        if origen_pref:
            prods_filtrados = prods_filtrados[prods_filtrados['origen'] == origen_pref]
            filtros_aplicados.append(f"Origen: {origen_pref}")

    # Si quedan productos, ordenar por popularidad; si no, usar top global
    if len(prods_filtrados) >= k:
        resultado = (prods_filtrados.merge(popularidad_scores, on='producto_id', how='left')
                     .sort_values('score_popularidad', ascending=False).head(k))
    else:
        print(f"  FALLBACK: solo {len(prods_filtrados)} productos con filtros, usando top global")
        resultado = top_productos.head(k)

    return resultado, filtros_aplicados

# Simular nuevo usuario con respuestas de quiz
respuestas_nuevo_usuario = {'0': '3', '1': '2', '2': '1'}  # Familia, $20-50, Nacional

print("\nONBOARDING - Nuevo usuario MiComisariato Ecuador")
print("Respuestas: Familia pequena | $20-50 | Productos nacionales")
print("-" * 55)
recomendaciones, filtros = recomendar_por_quiz(
    respuestas_nuevo_usuario, productos_catalogo, popularidad_scores, k=5
)
print(f"Filtros aplicados: {filtros}")
print("\nRecomendaciones para nuevo usuario:")
print(recomendaciones[['nombre', 'categoria', 'precio', 'origen']].to_string())
```

5. Implementa cold start para nuevo item con TF-IDF:

```python
# ========================================================
# PARTE 4: Estrategia para Nuevo Item (metadata-based)
# ========================================================

# Crear descripciones textuales de productos (como en un catalogo real)
np.random.seed(123)
descripciones = {
    'Panela_Organica': 'endulzante natural organico sin refinar proveniente de caña ecuatoriana',
    'Cafe_Lojano_Premium': 'cafe arabica de altura tostado medio sabor intenso producido en Loja Ecuador',
    'Chocolate_Pacari_70': 'chocolate negro 70 cacao fino aroma Arriba Nacional certificado organico',
    'Quinua_Chimborazo': 'quinua blanca cultivada en los Andes ecuatorianos alta proteina libre gluten',
    'Cacao_Arriba_Fino': 'cacao fino aroma Arriba Nacional premium exportacion granos fermentados secos',
    # Nuevo item sin historial:
    'Miel_Bosque_Nuevo': 'miel artesanal bosque nublado Mindo Ecuador produccion apicola organica natural',
}

# TF-IDF para representar items como vectores
vectorizer = TfidfVectorizer()
descripciones_list = list(descripciones.values())
nombres_list = list(descripciones.keys())
tfidf_matrix = vectorizer.fit_transform(descripciones_list)

# Encontrar items mas similares al nuevo item
nuevo_item_nombre = 'Miel_Bosque_Nuevo'
nuevo_item_idx = nombres_list.index(nuevo_item_nombre)
similitudes = cosine_similarity(tfidf_matrix[nuevo_item_idx], tfidf_matrix).flatten()

print(f"\nCOLD START NUEVO ITEM: '{nuevo_item_nombre}'")
print("Descripcion:", descripciones[nuevo_item_nombre])
print("\nItems similares (ordenados por similitud TF-IDF):")
for i in np.argsort(similitudes)[::-1]:
    if nombres_list[i] != nuevo_item_nombre:
        print(f"  {nombres_list[i]:<30}: similitud = {similitudes[i]:.4f}")

print("\nEstrategia: recomendar 'Miel_Bosque_Nuevo' a usuarios que compraron items similares")
print("Usuarios objetivo: compradores de Panela_Organica, Cacao_Arriba_Fino y Chocolate_Pacari_70")
```

## Usa IA para...

> Abre Claude (claude.ai) y escribe:
> "Estoy lanzando una app de delivery en Quito Ecuador similar a Rappi. En el primer mes tenemos 500 usuarios y 200 restaurantes pero casi sin historial de interacciones. Tengo acceso a: (1) datos demograficos del usuario al registrarse (edad, barrio), (2) descripcion del restaurante (cocina, precio promedio, ubicacion), (3) las primeras 3 interacciones del usuario. Disena una estrategia de cold start que incluya: que recomendar en dia 1, en semana 1, y en mes 1. Que algoritmo usarias en cada etapa?"

Despues de leer la respuesta:
- Diseña en una celda markdown el "mapa de madurez" de tu sistema: que recomiendas con 0 datos, 5, 20, 100 y 1000 interacciones.
- Define el umbral de transicion entre cada estrategia.

## Que aprendiste

- El **cold start de nuevo usuario** se resuelve con popularidad global, onboarding quiz y datos demograficos como perfil inicial.
- El **cold start de nuevo item** se resuelve con filtrado por contenido usando metadata (texto, categoria, precio) hasta acumular interacciones.
- El **cold start de nuevo sistema** requiere datos curados, pilotos internos o modelos pre-entrenados de dominio similar.
- El **onboarding quiz adaptativo** convierte preferencias declaradas del usuario en un perfil inicial sin necesidad de historial.
- Los **bandit algorithms** (UCB, Thompson Sampling) son la solucion elegante para explorar items nuevos eficientemente y resolver cold start de forma continua.

## Reto extra

Implementa un algoritmo **Epsilon-Greedy** simple para el cold start: con probabilidad epsilon (0.2) recomienda un item aleatorio del catalogo para explorar; con probabilidad (1-epsilon) recomienda segun el historial disponible. Simula 1,000 interacciones de un nuevo usuario y grafica como evoluciona la proporcion de items relevantes en sus recomendaciones a medida que el sistema aprende su perfil.
