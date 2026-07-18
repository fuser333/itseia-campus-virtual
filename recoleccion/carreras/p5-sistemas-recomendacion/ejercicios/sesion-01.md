# Ejercicio Sesion 1: Filtrado Colaborativo vs Contenido vs Hibrido

**Materia:** Sistemas de Recomendacion
**Nivel:** Avanzado
**Herramienta IA:** ChatGPT
**Duracion estimada:** 45 min

## Objetivo

Comprender las tres arquitecturas fundamentales de sistemas de recomendacion, identificar sus diferencias estructurales y mapear cada enfoque a casos de uso reales del comercio electronico y servicios digitales ecuatorianos.

## Contexto

Ecuador tiene un ecosistema digital creciente donde los sistemas de recomendacion ya operan en silencio: OLX Ecuador usa filtrado basado en contenido para mostrar articulos similares, el Banco Pichincha aplica filtrado colaborativo para recomendar productos financieros segun el perfil de clientes con comportamiento parecido, y plataformas como Mercado Libre Ecuador combinan ambos enfoques en sistemas hibridos. Entender la arquitectura correcta para cada problema es la competencia central de un ingeniero de IA en este dominio.

## Instrucciones

1. Abre Google Colab en `colab.research.google.com` y crea un notebook llamado `sesion01_tipos_recomendacion.ipynb`.

2. Ejecuta la siguiente celda para construir el mapa conceptual con datos ecuatorianos:

```python
# Sistemas de Recomendacion - Sesion 1: Tipos
# ITSEIA - Periodo 5
# Estudiante: [Tu nombre]

import pandas as pd
import numpy as np

# Mapa de los tres enfoques
arquitecturas = {
    "Filtrado Colaborativo": {
        "principio": "Recomienda basandose en lo que hicieron usuarios similares",
        "subtipo_user": "User-based: 'Usuarios parecidos a ti compraron X'",
        "subtipo_item": "Item-based: 'Quienes compraron esto tambien compraron Y'",
        "ventajas": ["No necesita conocer el contenido del item", "Descubre recomendaciones inesperadas (serendipity)"],
        "desventajas": ["Cold start: falla con nuevos usuarios/items", "Escalabilidad con millones de usuarios"],
        "caso_ecuador": "Banco Pichincha: recomendar seguro de vida a clientes con perfil similar al que ya lo contrato",
        "algoritmos": ["SVD", "ALS", "Neural Collaborative Filtering"]
    },
    "Filtrado por Contenido": {
        "principio": "Recomienda items similares a los que el usuario ha interactuado antes",
        "subtipo_user": "Construye perfil del usuario a partir de sus historicos",
        "subtipo_item": "Representa cada item como vector de caracteristicas",
        "ventajas": ["No necesita datos de otros usuarios", "Explicable: 'te recomendamos esto porque te gusto X'"],
        "desventajas": ["Solo recomienda lo mismo (no hay sorpresa)", "Requiere metadata rica del item"],
        "caso_ecuador": "OLX Ecuador: al ver un iPhone 14, mostrar otros iPhones o celulares Apple similares",
        "algoritmos": ["TF-IDF + Coseno", "Word2Vec", "BERT embeddings"]
    },
    "Hibrido": {
        "principio": "Combina colaborativo y contenido para compensar debilidades de cada uno",
        "subtipo_user": "Weighted: pondera scores de ambos modelos",
        "subtipo_item": "Switching: elige modelo segun contexto (nuevo vs viejo usuario)",
        "ventajas": ["Mitiga cold start", "Mejor precision y diversidad"],
        "desventajas": ["Mayor complejidad de implementacion", "Necesita mas datos y computo"],
        "caso_ecuador": "Mercado Libre Ecuador: combina tu historial de busqueda + comportamiento de compradores similares",
        "algoritmos": ["Two-Tower Model", "Wide & Deep (Google)", "Factorization Machines"]
    }
}

# Imprimir mapa
print("=" * 70)
print("SISTEMAS DE RECOMENDACION - ITSEIA Periodo 5")
print("Mapa Conceptual: Tres Arquitecturas")
print("=" * 70)

for nombre, datos in arquitecturas.items():
    print(f"\n{'='*25} {nombre.upper()} {'='*25}")
    print(f"Principio  : {datos['principio']}")
    print(f"User-based : {datos['subtipo_user']}")
    print(f"Item-based : {datos['subtipo_item']}")
    print(f"\nVentajas:")
    for v in datos['ventajas']:
        print(f"  + {v}")
    print(f"Desventajas:")
    for d in datos['desventajas']:
        print(f"  - {d}")
    print(f"\nCaso Ecuador: {datos['caso_ecuador']}")
    print(f"Algoritmos : {', '.join(datos['algoritmos'])}")
```

3. Construye una tabla de interacciones usuario-item simulando una tienda en linea ecuatoriana:

```python
# Tabla de interacciones: usuarios de Ecuador y productos tipicos
usuarios = ['Carlos_Quito', 'Maria_Guayaquil', 'Pedro_Cuenca', 'Ana_Loja', 'Luis_Ambato']
productos = ['Panela_Organic', 'Cafe_Lojano', 'Cacao_Arriba', 'Quinua_Chimborazo', 'Tagua_Artesanal']

# Matriz de ratings (0 = no interactuado, 1-5 = calificacion)
ratings = np.array([
    [5, 4, 0, 3, 0],   # Carlos_Quito
    [4, 5, 3, 0, 1],   # Maria_Guayaquil
    [0, 3, 5, 4, 2],   # Pedro_Cuenca
    [3, 0, 4, 5, 3],   # Ana_Loja
    [0, 1, 3, 2, 5],   # Luis_Ambato
])

df_ratings = pd.DataFrame(ratings, index=usuarios, columns=productos)
print("\nMatriz de Interacciones - Tienda Productos Ecuador:")
print(df_ratings)
print("\nDensidad de la matriz:", f"{(ratings > 0).sum() / ratings.size:.1%}")
print("(El 0 indica que el usuario no ha interactuado con ese producto)")

# Identificar problema de sparsity
print("\nProblema CLAVE: matrices reales tienen 99%+ de ceros")
print("Amazon: ~0.01% densidad | Netflix (previo): ~1% densidad")
```

4. Clasifica cada escenario en el tipo correcto:

```python
escenarios = [
    ("Spotify Ecuador recomienda canciones basado en tu historial de escucha", "?"),
    ("LinkedIn Ecuador sugiere personas que conoces porque tus contactos las siguen", "?"),
    ("Netflix combina lo que viste + lo que ven perfiles con tus mismos generos", "?"),
    ("SuperMaxi.com sugiere productos similares al que estas mirando", "?"),
    ("BanEcuador recomienda credito agricola a productores con perfil igual al que ya lo tomo", "?"),
]

print("\nCLASIFICA CADA ESCENARIO:")
print("-" * 60)
for i, (caso, _) in enumerate(escenarios, 1):
    print(f"\n{i}. {caso}")
    print("   Tu respuesta: [Colaborativo / Contenido / Hibrido]")

print("\n\nRESPUESTAS CORRECTAS:")
respuestas = [
    "Contenido (basado en TU historial de audio)",
    "Colaborativo User-based (red de contactos = usuarios similares)",
    "Hibrido (historial propio + usuarios similares)",
    "Contenido (atributos del producto: categoria, precio, marca)",
    "Colaborativo User-based (perfil del cliente vs otros clientes)",
]
for i, (caso, resp) in enumerate(zip([e[0] for e in escenarios], respuestas), 1):
    print(f"  {i}. {resp}")
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy estudiante de Sistemas de Recomendacion en Ecuador. Tengo que disenar un sistema para una app de delivery tipo Rappi o Picap en Quito. Con 1,000 usuarios y 500 restaurantes. ¿Que arquitectura me recomiendas para el primer mes cuando casi no hay datos historicos? ¿Y como cambiaria la estrategia cuando llegue al millon de pedidos?"

Despues de leer la respuesta:
- Pide a ChatGPT que explique el concepto de "cold start problem" con el ejemplo especifico de Quito.
- Copia la explicacion como comentario en tu notebook bajo una celda nueva.

## Que aprendiste

- El **filtrado colaborativo** no necesita entender el contenido del item, solo el comportamiento de la multitud.
- El **filtrado por contenido** es personal y explicable, pero atrapado en una burbuja del historial del usuario.
- Los sistemas **hibridos** son el estandar de la industria (Netflix, Spotify, Amazon) porque compensan las debilidades de cada enfoque.
- La **densidad de la matriz** de interacciones es critica: matrices muy sparse (poco llenas) degradan el colaborativo.
- Ecuador tiene casos de uso directos en banca, retail, delivery y e-commerce para cada arquitectura.

## Reto extra

Diseña en papel (o en una celda markdown) un sistema de recomendacion para el Mercado Mayorista de Quito digitalmente: define que tipo de filtrado usarias, que datos recolectarias, y como manejarías el cold start para un nuevo comerciante que se registra. Escribe el diseño en 10 lineas de pseudocodigo o como diagrama de texto en tu notebook.
