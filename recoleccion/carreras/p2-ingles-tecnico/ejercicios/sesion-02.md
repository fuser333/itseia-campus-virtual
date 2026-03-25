# Ejercicio Sesion 2: Leer Documentacion Tecnica en Ingles

**Materia:** Ingles Tecnico I
**Nivel:** Basico
**Herramienta IA:** Claude
**Duracion estimada:** 35 min

## Objetivo

Desarrollar la habilidad de leer y extraer informacion clave de documentacion tecnica oficial en ingles (scikit-learn, pandas, NumPy), usando Claude como asistente de comprension cuando el texto es dificil, SIN que Claude lea por ti.

## Contexto

Todo profesional de IA en Ecuador trabaja con documentacion en ingles todos los dias. La capacidad de leer un `docstring`, entender parametros de una funcion y seguir un tutorial oficial sin necesitar traduccion completa es la diferencia entre depender de terceros y ser autonomo. La estrategia: leer primero, subrayar lo que no entiendes, luego preguntar a Claude solo lo puntual.

## Instrucciones

**Parte 1 — Lee este fragmento real de documentacion de scikit-learn**

El siguiente texto es el docstring oficial de `sklearn.model_selection.train_test_split`:

---

```
sklearn.model_selection.train_test_split(*arrays, test_size=None, train_size=None,
    random_state=None, shuffle=True, stratify=None)

Split arrays or matrices into random train and test subsets.

Parameters
----------
*arrays : sequence of indexables with same length / shape[0]
    Allowed inputs are lists, numpy arrays, scipy-sparse matrices or pandas
    dataframes.

test_size : float or int, default=None
    If float, should be between 0.0 and 1.0 and represent the proportion of
    the dataset to include in the test split. If int, represents the absolute
    number of test samples. If None, the value is set to the complement of
    the train size. If train_size is also None, it will be set to 0.25.

random_state : int, RandomState instance or None, default=None
    Controls the shuffling applied to the data before applying the split.
    Pass an int for reproducible output across multiple function calls.

stratify : array-like, default=None
    If not None, data is split in a stratified fashion, using this as the
    class labels. Read more in the User Guide.

Returns
-------
splitting : list, length=2 * len(arrays)
    List containing train-test split of inputs.

Examples
--------
>>> X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)
```

---

**Preguntas de comprension (responde sin usar IA primero):**

1. ¿Que hace esta funcion? (1 oracion en espanol)
2. Si `test_size=0.2` y tengo 1000 filas, ¿cuantas iran al conjunto de prueba?
3. ¿Para que sirve el parametro `random_state`? ¿Por que usariamos `random_state=42`?
4. ¿Que significa `stratify`? ¿En que tipo de dataset lo usarias? (Pista: clases desbalanceadas)
5. ¿Que devuelve la funcion? ¿En que orden?

**Parte 2 — Lee el docstring de pandas.DataFrame.groupby**

```
DataFrame.groupby(by=None, axis=_NoDefault.no_default, level=None,
    as_index=True, sort=True, group_keys=True, observed=_NoDefault.no_default,
    dropna=True)

Group DataFrame using a mapper or by a Series of columns.

A groupby operation involves some combination of splitting the object,
applying a function, and combining the results. This can be used to group
large amounts of data and compute operations on these groups.

Parameters
----------
by : mapping, function, label, pd.Grouper or list of such
    Used to determine the groups for the groupby.
    If by is a function, it's called on each value of the object's index.
    If a dict or Series is passed, the Series or dict VALUES will be used
    to determine the groups.

sort : bool, default True
    Sort group keys. Get better performance by turning this off.
    Note this does not influence the order of observations within each group.
    Groupby preserves the order of rows within each group.

dropna : bool, default True
    If True, and if group keys contain NA values, NA values together
    with row/column will be dropped.

Returns
-------
DataFrameGroupBy
    Returns a groupby object that contains information about the groups.
```

**Preguntas:**

1. La documentacion dice "splitting the object, applying a function, and combining the results". Explica con tus palabras este concepto "split-apply-combine" en el contexto de datos de empresas ecuatorianas por sector.
2. ¿Que significa `sort=True` por defecto? ¿En que caso querrias `sort=False`?
3. ¿Que tipo de objeto devuelve `groupby`? ¿Puedes usar ese objeto directamente como un DataFrame?

**Parte 3 — Practica de Lectura Rapida (Skimming)**

Tecnica de lectura tecnica eficiente:
1. **Lee el titulo y la primera oracion** — entiende que hace la funcion
2. **Lee los parametros** — identifica cuales son obligatorios (sin default) vs opcionales (con default)
3. **Lee el ejemplo** — es la parte mas rapida de entender
4. **Busca los Returns** — saber que regresa es critico para usar la funcion correctamente

Aplica esta tecnica a la documentacion de `numpy.linalg.eig` en docs.scipy.org/doc/numpy (busca en Google: "numpy linalg eig documentation"). Responde:
- ¿Que hace?
- ¿Cuales son sus parametros?
- ¿Que devuelve?
- ¿Hay algun "warning" o nota importante?

## Usa IA para...

> REGLA: Primero responde las preguntas TU SOLO. Solo usa Claude para las dudas especificas que quedaron.

> Abre Claude y escribe:
> "Estoy aprendiendo a leer documentacion tecnica en ingles. Leí el docstring de sklearn.train_test_split. No entiendo bien el parametro 'stratify'. ¿Puedes darme un ejemplo concreto de cuando usarlo, con datos ecuatorianos reales, y explicar que le pasaria al modelo si NO lo uso en un dataset desbalanceado?"

Luego pregunta:
> "¿Cual es la diferencia entre leer documentacion 'oficial' (docs.scikit-learn.org) vs tutoriales de blogs? ¿Cuando usar cada una?"

## Que aprendiste

- La documentacion tecnica tiene una **estructura predecible**: descripcion → parametros → returns → ejemplos.
- Los **parametros con defaults** son opcionales; los **sin defaults** son obligatorios.
- La tecnica **skimming** (leer selectivamente) es mas efectiva que leer todo linea por linea.
- **Stratify** es un parametro critico cuando las clases estan desbalanceadas — sin el, el test set puede tener distribucion diferente al train set.
- Claude es util para **aclarar terminos especificos**, no para que lea todo por ti.

## Reto extra

Ve a docs.python.org/3/library/functions.html (documentacion oficial de Python) y lee el docstring de `enumerate()`. Sin usar Google Translate ni IA, responde: ¿que hace, como se usa, y cuando es preferible a un `for i in range(len(lista))`? Luego verifica tu comprension con Claude.
