# Ejercicio Sesion 2: Pandas — DataFrames, Lectura CSV y Excel

**Materia:** Python para Ciencia de Datos
**Nivel:** Intermedio
**Herramienta IA:** ChatGPT
**Duracion estimada:** 40 min

## Objetivo

Crear y manipular DataFrames de Pandas, leer archivos CSV y Excel con datos reales del INEC y del BCE Ecuador, explorar la estructura del dataset y extraer informacion basica con metodos fundamentales de Pandas.

## Contexto

El Banco Central del Ecuador (BCE) y el INEC publican sus datos en formatos CSV y Excel. El BCE publica estadisticas macroeconomicas mensuales (PIB, inflacion, balanza comercial) en archivos Excel descargables desde `estadisticas.bce.fin.ec`. El INEC publica encuestas de empleo, IPC y censos en CSV desde `ecuadorencifras.gob.ec`. Saber cargar, inspeccionar y navegar estos datasets es la primera habilidad de cualquier Analista de Datos ecuatoriano.

## Instrucciones

1. Abre Google Colab y crea `sesion02_pandas_bce_inec.ipynb`.

2. Crea DataFrames desde diferentes fuentes:

```python
# Python para Ciencia de Datos - Sesion 2: Pandas DataFrames
# ITSEIA - Periodo 3

import pandas as pd
import numpy as np
import io

print(f"Pandas version: {pd.__version__}")

# METODO 1: DataFrame desde diccionario (datos BCE Ecuador)
datos_bce = {
    'anio': [2019, 2020, 2021, 2022, 2023, 2024],
    'pib_millones_usd': [108108, 99290, 106168, 115059, 118845, 121200],
    'inflacion_anual_pct': [0.27, -0.93, 1.93, 3.47, 2.04, 1.55],
    'exportaciones_mmusd': [22329, 19710, 23798, 30078, 26908, 27500],
    'importaciones_mmusd': [21584, 17682, 22710, 28562, 26231, 27100],
    'desempleo_pct': [3.8, 6.5, 5.2, 4.1, 3.6, 3.9]
}

df_bce = pd.DataFrame(datos_bce)
print("DataFrame BCE Ecuador (datos macroeconomicos):")
print(df_bce)
print(f"\nTipos de datos:\n{df_bce.dtypes}")
```

3. Simula y lee un CSV del INEC:

```python
# METODO 2: Simular lectura de CSV (como si fuera del INEC)
csv_empleo = """provincia,trimestre,pea_miles,ocupados_miles,desempleo_pct,subempleo_pct
Pichincha,2024-Q1,1523.4,1462.1,4.02,16.5
Guayas,2024-Q1,1891.2,1798.6,4.88,19.2
Azuay,2024-Q1,362.5,347.8,4.06,14.3
Manabi,2024-Q1,598.7,565.3,5.58,22.1
El Oro,2024-Q1,281.4,265.9,5.51,20.8
Tungurahua,2024-Q1,248.6,238.4,4.10,15.7
Loja,2024-Q1,219.3,209.1,4.65,17.9
Imbabura,2024-Q1,192.8,184.7,4.20,16.2
Pichincha,2024-Q2,1531.2,1474.3,3.72,15.8
Guayas,2024-Q2,1898.4,1812.5,4.53,18.7
Azuay,2024-Q2,365.8,352.4,3.66,13.9
Manabi,2024-Q2,601.3,570.8,5.07,21.5
El Oro,2024-Q2,284.2,271.6,4.43,19.6
Tungurahua,2024-Q2,251.1,241.9,3.66,15.1
Loja,2024-Q2,221.7,212.8,4.01,17.2
Imbabura,2024-Q2,194.5,187.2,3.75,15.8"""

# Leer CSV desde string (equivalente a pd.read_csv('archivo.csv'))
df_empleo = pd.read_csv(io.StringIO(csv_empleo))
print("\nDataFrame INEC - Empleo por Provincia:")
print(df_empleo)
```

4. Explora el DataFrame con metodos esenciales:

```python
# INSPECCION BASICA - los primeros comandos de cualquier analisis
print("\n" + "="*60)
print("INSPECCION DEL DATASET EMPLEO ECUADOR")
print("="*60)

print(f"\n1. FORMA: {df_empleo.shape} -> {df_empleo.shape[0]} filas, {df_empleo.shape[1]} columnas")

print(f"\n2. PRIMERAS FILAS (head):")
print(df_empleo.head(3))

print(f"\n3. ULTIMAS FILAS (tail):")
print(df_empleo.tail(3))

print(f"\n4. TIPOS DE DATOS:")
print(df_empleo.dtypes)

print(f"\n5. ESTADISTICAS DESCRIPTIVAS:")
print(df_empleo.describe().round(2))

print(f"\n6. INFORMACION GENERAL:")
df_empleo.info()

print(f"\n7. VALORES NULOS POR COLUMNA:")
print(df_empleo.isnull().sum())

# Acceso a columnas
print(f"\n8. ACCESO A COLUMNAS:")
print(f"Provincias unicas: {df_empleo['provincia'].unique().tolist()}")
print(f"Trimestres: {df_empleo['trimestre'].unique().tolist()}")
print(f"Desempleo promedio Ecuador: {df_empleo['desempleo_pct'].mean():.2f}%")

# Acceso por iloc y loc
print(f"\n9. ACCESO POR POSICION (iloc[0]):")
print(df_empleo.iloc[0])

print(f"\n10. ACCESO POR ETIQUETA (loc - Pichincha Q1):")
filtro = (df_empleo['provincia'] == 'Pichincha') & (df_empleo['trimestre'] == '2024-Q1')
print(df_empleo.loc[filtro])
```

5. Simula lectura de Excel:

```python
# METODO 3: Lectura de Excel (simulado - en la practica usas pd.read_excel())
print("\n--- COMO LEER UN EXCEL DEL BCE ---")
print("""
# En tu computadora, con el archivo descargado del BCE:
df_excel = pd.read_excel(
    'BCE_Estadisticas_2024.xlsx',
    sheet_name='PIB',          # nombre de la hoja
    skiprows=3,                # saltar filas de encabezado del BCE
    usecols='A:F',             # solo columnas A a F
    na_values=['N/D', '-']     # valores que se convierten a NaN
)

# Para ver todas las hojas de un Excel:
xl = pd.ExcelFile('BCE_Estadisticas_2024.xlsx')
print(xl.sheet_names)
""")

# Guardar el dataframe a CSV
df_empleo.to_csv('/tmp/empleo_ecuador_2024.csv', index=False)
print("Archivo guardado en /tmp/empleo_ecuador_2024.csv")

# Verificar que se puede releer
df_verificacion = pd.read_csv('/tmp/empleo_ecuador_2024.csv')
print(f"Archivo releido correctamente: {df_verificacion.shape}")

# Agregar una columna calculada
df_empleo['inactivos_pct'] = 100 - df_empleo['desempleo_pct'] - df_empleo['subempleo_pct']
df_empleo['ocupacion_plena_miles'] = (df_empleo['ocupados_miles'] *
                                       (1 - df_empleo['subempleo_pct']/100)).round(1)
print("\nDataFrame con columnas adicionales:")
print(df_empleo[['provincia', 'trimestre', 'desempleo_pct', 'subempleo_pct', 'inactivos_pct']].head(5))
```

## Usa IA para...

> Abre ChatGPT y escribe:
> "En Pandas, ¿cuando uso .loc[] vs .iloc[]? Dame 3 ejemplos con un DataFrame de datos de exportaciones ecuatorianas mostrando la diferencia. Tambien explica la diferencia entre df['columna'] y df[['columna']] (un corchete vs dos corchetes)."

Despues de leer la respuesta:
- Prueba cada ejemplo de ChatGPT sobre el `df_empleo` del ejercicio.
- Anota en que casos preferiras `.loc[]` vs `.iloc[]` en un proyecto real.

## Que aprendiste

- `pd.DataFrame()` crea un DataFrame desde diccionarios, listas, arrays NumPy u otros DataFrames.
- `pd.read_csv()` y `pd.read_excel()` leen archivos con multiples parametros de control (skiprows, usecols, na_values).
- `.head()`, `.tail()`, `.info()`, `.describe()`, `.dtypes` son los primeros comandos al explorar cualquier dataset.
- `.iloc[]` accede por posicion numerica; `.loc[]` accede por etiqueta de fila/columna o condicion booleana.
- Crear columnas nuevas es tan simple como `df['nueva'] = expresion_vectorizada`.

## Reto extra

Visita `ecuadorencifras.gob.ec` y descarga cualquier dataset CSV del INEC (empleo, IPC, vivienda). Cargalo en Colab con `pd.read_csv()`, muestra su forma, tipos de datos, estadisticas descriptivas y los 5 valores nulos mas frecuentes por columna. Reporta tres hallazgos curiosos del dataset real.
