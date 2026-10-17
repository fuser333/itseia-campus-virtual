# Ejercicio Sesion 1: Que es Machine Learning

**Materia:** Machine Learning I
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 35 min

## Objetivo

Comprender los tres paradigmas del Machine Learning (supervisado, no supervisado y por refuerzo) y mapear cada uno a casos de uso reales del contexto ecuatoriano.

## Contexto

Ecuador tiene retos concretos donde el ML ya se aplica: el Banco Central del Ecuador usa modelos supervisados para detectar fraude financiero, el IESS aplica clustering no supervisado para segmentar afiliados por perfil de riesgo de salud, y empresas como Pichincha Bank experimenta con aprendizaje por refuerzo en sistemas de recomendacion de creditos. Conocer la diferencia entre estos paradigmas es el primer paso para elegir la herramienta correcta en cada problema.

## Instrucciones

1. Abre Google Colab en `colab.research.google.com` y crea un notebook nuevo llamado `sesion01_tipos_ml.ipynb`.

2. En la primera celda, escribe este codigo de clasificacion conceptual:

```python
# Machine Learning I - Sesion 1: Tipos de ML
# ITSEIA - Periodo 3
# Estudiante: [Tu nombre]

# Diccionario con los tres paradigmas y ejemplos Ecuador
tipos_ml = {
    "Supervisado": {
        "descripcion": "Aprende de datos etiquetados (entrada -> salida conocida)",
        "subtareas": ["Clasificacion", "Regresion"],
        "ejemplos_ecuador": [
            "Predecir si un credito del BanEcuador sera pagado (si/no)",
            "Estimar el precio de un departamento en Quito (valor numerico)",
            "Detectar fraude en transacciones del BCE"
        ],
        "algoritmos_comunes": ["Regresion Lineal", "Regresion Logistica", "Arboles de Decision", "SVM"]
    },
    "No Supervisado": {
        "descripcion": "Encuentra patrones en datos SIN etiquetas",
        "subtareas": ["Clustering", "Reduccion de dimensionalidad", "Deteccion de anomalias"],
        "ejemplos_ecuador": [
            "Agrupar ciudadanos del IESS por perfil de salud",
            "Segmentar clientes del Supermaxi por habitos de compra",
            "Identificar grupos de provincias con patrones similares de pobreza (INEC)"
        ],
        "algoritmos_comunes": ["K-Means", "DBSCAN", "PCA", "Autoencoders"]
    },
    "Por Refuerzo": {
        "descripcion": "Un agente aprende mediante prueba/error con recompensas y penalizaciones",
        "subtareas": ["Control", "Juegos", "Optimizacion"],
        "ejemplos_ecuador": [
            "Optimizar rutas de entrega para Servientrega Ecuador",
            "Sistema de recomendacion de productos en OLX Ecuador",
            "Control de semaforos inteligentes en Quito"
        ],
        "algoritmos_comunes": ["Q-Learning", "Deep Q-Network (DQN)", "Policy Gradient"]
    }
}

# Mostrar el mapa conceptual
print("=" * 65)
print("MAPA DE MACHINE LEARNING - ITSEIA Periodo 3")
print("=" * 65)

for tipo, info in tipos_ml.items():
    print(f"\n{'='*20} {tipo.upper()} {'='*20}")
    print(f"Definicion : {info['descripcion']}")
    print(f"Subtareas  : {', '.join(info['subtareas'])}")
    print(f"\nEjemplos Ecuador:")
    for i, ejemplo in enumerate(info['ejemplos_ecuador'], 1):
        print(f"  {i}. {ejemplo}")
    print(f"\nAlgoritmos : {', '.join(info['algoritmos_comunes'])}")
```

3. Ejecuta la celda (Shift+Enter) y lee la salida completa.

4. En una segunda celda, completa este ejercicio de clasificacion:

```python
# Ejercicio: clasifica cada problema en el tipo correcto de ML
problemas = [
    "Predecir la temperatura en Guayaquil los proximos 7 dias",
    "Agrupar los 221 cantones del Ecuador por nivel de desarrollo",
    "Entrenar un robot para jugar ajedrez",
    "Determinar si un correo es spam o no",
    "Encontrar patrones inusuales en las exportaciones de banano",
    "Estimar las ventas del Mercado Mayorista de Quito el proximo mes"
]

print("CLASIFICA CADA PROBLEMA:")
print("-" * 50)
for i, problema in enumerate(problemas, 1):
    print(f"{i}. {problema}")
    respuesta = input("   Tipo (S=Supervisado / N=No Supervisado / R=Refuerzo): ")
    print()

print("\nRespuestas correctas:")
correctas = ["Supervisado (Regresion)", "No Supervisado (Clustering)",
             "Por Refuerzo", "Supervisado (Clasificacion)",
             "No Supervisado (Deteccion anomalias)", "Supervisado (Regresion)"]
for i, (p, r) in enumerate(zip(problemas, correctas), 1):
    print(f"  {i}. {r}")
```

5. Compara tus respuestas con las correctas. Anota en un comentario cuales acertaste.

## Usa IA para...

> Abre ChatGPT y escribe:
> "Soy estudiante de Machine Learning en Ecuador. Explica con un ejemplo ecuatoriano la diferencia entre clasificacion y regresion dentro del aprendizaje supervisado. Luego dime: ¿cuando conviene usar aprendizaje no supervisado en lugar de supervisado?"

Despues de leer la respuesta:
- Pide a ChatGPT que te proponga un problema real de Ecuador que podria resolverse con cada tipo de ML.
- Agrega esos ejemplos como comentarios en tu notebook bajo cada tipo.

## Que aprendiste

- El aprendizaje **supervisado** requiere datos etiquetados y predice una salida conocida (clasificacion o regresion).
- El aprendizaje **no supervisado** descubre estructura oculta en datos sin etiquetas (clustering, reduccion de dimensionalidad).
- El aprendizaje **por refuerzo** entrena un agente con un sistema de recompensas, sin datos previos.
- La eleccion del paradigma depende de si tienes etiquetas disponibles y del tipo de problema a resolver.
- Ecuador tiene casos de uso reales en banca, salud publica, comercio y logistica para cada paradigma.

## Reto extra

Investiga en la pagina del INEC (inec.gob.ec) o del BCE (bce.fin.ec) un dataset publico descargable. Escribe en una nueva celda: nombre del dataset, que variable podrias predecir, y que tipo de ML usarias. Justifica tu eleccion en 3 oraciones.
