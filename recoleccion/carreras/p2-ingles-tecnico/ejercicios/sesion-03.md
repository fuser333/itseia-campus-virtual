# Ejercicio Sesion 3: Escribir README y Docstrings en Ingles

**Materia:** Ingles Tecnico I
**Nivel:** Basico
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Escribir un README.md profesional en ingles para un proyecto de Python y documentar funciones con docstrings en formato Google Style, habilidades esenciales para trabajar en equipos internacionales y publicar proyectos en GitHub.

## Contexto

Un egresado de ITSEIA aplica a un trabajo remoto en una empresa de Buenos Aires que usa IA para analizar datos del mercado latinoamericano. Le piden mostrar un proyecto en GitHub. Su codigo en Python funciona perfectamente — pero el README esta en espanol y las funciones no tienen docstrings. El reclutador cierra el perfil sin leerlo. La documentacion en ingles es parte del portafolio profesional.

## Instrucciones

**Parte 1 — Anatomia de un README Profesional**

Un README efectivo tiene estas secciones:

```
# Project Title
Brief description (1-2 sentences)

## About
Problem this solves and why it matters

## Features
- Feature 1
- Feature 2

## Installation
Step-by-step setup instructions

## Usage
Code example showing the main use case

## Dataset
Data source and brief description

## Results
Key findings or performance metrics

## Contributing
How to contribute (optional for personal projects)

## License
```

**Parte 2 — Escribe el README para este Proyecto**

El proyecto es el analisis de PCA sobre cantones de Ecuador que desarrollaste en Matematicas II, Sesion 8.

Escribe el README completo en ingles. Usa el template de arriba. Algunas frases utiles:

**Para About:**
- "This project analyzes..." / "This tool enables..."
- "The goal is to..." / "We address the problem of..."

**Para Installation:**
- "Clone the repository: `git clone ...`"
- "Install dependencies: `pip install -r requirements.txt`"
- "Run the main script: `python main.py`"

**Para Usage:**
```python
from pca_analysis import analyze_cantons

results = analyze_cantons(data_path="data/inec_cantones.csv", n_components=2)
results.plot()
```

**Para Results:**
- "The first two principal components explain X% of the total variance."
- "Cantons with similar socioeconomic development cluster together in the PCA space."

**Parte 3 — Docstrings en Python (Google Style)**

Documenta estas tres funciones con docstrings en ingles:

**Funcion 1 — Cargar datos:**
```python
def load_canton_data(filepath, encoding='utf-8'):
    """
    [Tu docstring aqui]
    """
    import pandas as pd
    return pd.read_csv(filepath, encoding=encoding)
```

Formato Google Style:
```python
def load_canton_data(filepath, encoding='utf-8'):
    """Load canton socioeconomic data from a CSV file.

    Args:
        filepath (str): Path to the CSV file containing canton data.
        encoding (str, optional): File encoding. Defaults to 'utf-8'.

    Returns:
        pd.DataFrame: DataFrame with canton indicators as columns
            and cantons as rows.

    Raises:
        FileNotFoundError: If the file does not exist at the given path.
        ValueError: If the CSV does not contain the expected columns.

    Example:
        >>> df = load_canton_data('data/inec_2023.csv')
        >>> print(df.shape)
        (221, 8)
    """
    import pandas as pd
    return pd.read_csv(filepath, encoding=encoding)
```

Ahora escribe el docstring para estas dos funciones siguiendo el mismo formato:

**Funcion 2:**
```python
def standardize_features(df, columns=None):
    # Estandariza las columnas numericas del dataframe (media=0, std=1)
    # df: DataFrame con los datos
    # columns: lista de columnas a estandarizar, o None para todas las numericas
    # retorna: DataFrame estandarizado + objeto scaler (para transformaciones futuras)
    pass
```

**Funcion 3:**
```python
def run_pca(X_std, n_components=2, canton_names=None):
    # Ejecuta PCA sobre los datos estandarizados
    # X_std: numpy array estandarizado
    # n_components: numero de componentes principales (default 2)
    # canton_names: lista de nombres de cantones para el grafico
    # retorna: coordenadas PCA + varianza explicada por componente + grafico matplotlib
    pass
```

**Parte 4 — Errores comunes de espanol-ingles en documentacion tecnica**

Corrige estas frases de espanol-ingles mezclado a ingles correcto:

1. "This function hace un calculo of the media of datos" → ?
2. "If the dataframe is vacio, the function retorna None" → ?
3. "We use un modelo of regresion for predecir el sueldo" → ?
4. "The resultado is a lista of numeros" → ?
5. "Este parametro controls el learning rate del modelo" → ?

## Usa IA para...

> Abre ChatGPT y escribe:
> "Aqui esta el README que escribi para mi proyecto de PCA sobre cantones de Ecuador: [pega tu README]. Por favor: (1) corrige errores de gramatica o expresion en ingles, (2) identifica 3 secciones que podria mejorar para que sea mas profesional, (3) no lo reescribas completo, solo indica que cambiar y por que."

Importante: ChatGPT debe CORREGIR tu escritura, no sustituirla. Si reescribe todo desde cero, pide que solo marque los errores.

## Que aprendiste

- Un README bien escrito en ingles es parte del portafolio profesional — es lo primero que ve un reclutador internacional.
- Los **docstrings en Google Style** son el estandar en la mayoria de proyectos de Python open source.
- La estructura Args / Returns / Raises / Example hace que el codigo sea auto-documentado.
- Usar IA para **correccion** (no sustitucion) de tu escritura acelera el aprendizaje mas que pedir que escriba por ti.
- GitHub es el CV de un ingeniero de IA — un repositorio sin README en ingles pierde visibilidad internacional.

## Reto extra

Crea un repositorio real en GitHub con el proyecto de PCA de Matematicas II. Incluye: README.md en ingles con todas las secciones, funciones documentadas con docstrings, requirements.txt, y un archivo .gitignore apropiado para Python. Agrega el link al repositorio en tu perfil de LinkedIn con el hashtag #ITSEIA. El primer repositorio publicado es un hito importante.
