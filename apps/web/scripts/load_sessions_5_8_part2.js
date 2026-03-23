#!/usr/bin/env node
// Carga sesiones 5-8 de Introducción a la Ciencia de Datos (Carrera CD)
// Subject ID: 015311e7-c0d0-4065-abbf-83ab210da384

const BASE_URL = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMzMxMzgsImV4cCI6MjA4OTcwOTEzOH0.CO--ha0pMyJWCbAULMxbI0lwk_RLhrFtUYYTZRzkhdk';
const SUBJECT_ID = '015311e7-c0d0-4065-abbf-83ab210da384';

const headers = {
  'apikey': ANON_KEY,
  'Authorization': `Bearer \${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

async function post(endpoint, body, prefer = 'return=representation') {
  const res = await fetch(`\${BASE_URL}\${endpoint}`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': prefer },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`ERROR \${res.status} on \${endpoint}:`, text.slice(0, 200));
    return null;
  }
  try {
    const data = JSON.parse(text);
    return Array.isArray(data) ? data[0] : data;
  } catch {
    return null;
  }
}

const sessions = [
  {
    number: 5,
    title: 'Limpieza de datos con Pandas',
    video_url: 'https://www.youtube.com/watch?v=bDhvCp3_lYw',
    estimated_duration_minutes: 90,
    order_index: 5,
    theory_markdown: `# Limpieza de Datos con Pandas

La limpieza de datos (data cleaning) es la tarea que consume más tiempo en un proyecto de ciencia de datos: hasta el 80% del tiempo total. Pandas es la herramienta estándar para esta tarea en Python.

## ¿Por qué limpiar datos?

Los datos reales tienen problemas como:
- **Valores nulos** (NaN): registros incompletos
- **Duplicados**: mismo registro repetido
- **Tipos incorrectos**: fechas como texto, números como strings
- **Outliers**: valores extremos que distorsionan el análisis
- **Inconsistencias**: "Quito", "quito", "QUITO" son la misma ciudad

## Detectar problemas

\`\`\`python
import pandas as pd
import numpy as np

df = pd.read_csv("datos_estudiantes.csv")

# Resumen inicial
print(df.shape)          # (filas, columnas)
print(df.info())         # Tipos de datos y valores nulos
print(df.describe())     # Estadísticas de columnas numéricas
print(df.head())         # Primeras 5 filas
print(df.isnull().sum()) # Conteo de nulos por columna
print(df.duplicated().sum())  # Número de duplicados
\`\`\`

## Manejo de valores nulos

\`\`\`python
# Identificar nulos
df.isnull()              # DataFrame de True/False
df.isnull().sum()        # Suma de nulos por columna
df.isnull().mean() * 100 # Porcentaje de nulos

# Eliminar filas con nulos
df_limpio = df.dropna()              # Elimina filas con CUALQUIER nulo
df_limpio = df.dropna(subset=["nota"])  # Solo si "nota" es nulo
df_limpio = df.dropna(thresh=3)      # Elimina si tiene menos de 3 valores válidos

# Rellenar nulos
df["nota"].fillna(0, inplace=True)                  # Rellenar con 0
df["ciudad"].fillna("Desconocida", inplace=True)    # Rellenar con texto
df["salario"].fillna(df["salario"].mean(), inplace=True)  # Rellenar con promedio
df["nota"].fillna(df["nota"].median(), inplace=True)       # Con mediana (más robusto)
df["nota"].fillna(method="ffill", inplace=True)     # Forward fill
\`\`\`

## Eliminar duplicados

\`\`\`python
# Ver duplicados
print(df[df.duplicated()])

# Eliminar duplicados (mantener primera ocurrencia)
df = df.drop_duplicates()

# Duplicados basados en columnas específicas
df = df.drop_duplicates(subset=["email"], keep="first")
\`\`\`

## Corrección de tipos de datos

\`\`\`python
# Verificar tipos
print(df.dtypes)

# Convertir tipos
df["edad"] = df["edad"].astype(int)
df["precio"] = df["precio"].astype(float)
df["fecha"] = pd.to_datetime(df["fecha"])
df["activo"] = df["activo"].map({"si": True, "no": False})

# Limpiar strings numéricos
df["salario"] = df["salario"].str.replace("$", "").str.replace(",", "").astype(float)
\`\`\`

## Normalización de texto

\`\`\`python
# Estandarizar texto
df["ciudad"] = df["ciudad"].str.strip().str.lower().str.title()
df["nombre"] = df["nombre"].str.strip()

# Reemplazar valores inconsistentes
df["genero"] = df["genero"].replace({
    "M": "Masculino", "F": "Femenino",
    "m": "Masculino", "f": "Femenino"
})
\`\`\`

## Pipeline de limpieza

\`\`\`python
def limpiar_dataset(df):
    """Pipeline completo de limpieza"""
    df = df.copy()  # No modificar original
    df = df.drop_duplicates()
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
    for col in df.select_dtypes(include="object").columns:
        df[col] = df[col].str.strip()
    df["nota"].fillna(df["nota"].median(), inplace=True)
    print(f"Dataset limpio: {df.shape[0]} filas, {df.isnull().sum().sum()} nulos restantes")
    return df
\`\`\`

Un dataset limpio es la base de cualquier modelo de IA confiable. La calidad del modelo depende directamente de la calidad de los datos.`,
    ai_lab_context: `El estudiante está aprendiendo limpieza de datos con Pandas. Cubre detección de nulos (isnull, sum), estrategias de imputación (fillna con media, mediana, ffill), eliminación de duplicados (drop_duplicates), corrección de tipos de datos (astype, pd.to_datetime), normalización de strings y construcción de pipelines de limpieza. Ayúdale a decidir cuándo eliminar vs rellenar nulos, cómo detectar outliers básicos, y la importancia de no modificar el dataset original (usar copy()). Si tiene errores de tipo de datos, guíale en la conversión correcta.`,
    ai_lab_suggested_prompt: 'Tengo un DataFrame con una columna "edad" que tiene algunos valores NaN y otros que son strings como "25 años". ¿Cómo limpio esa columna para que quede como números enteros sin nulos?',
    quiz: {
      title: 'Quiz: Limpieza de datos con Pandas',
      questions: [
        {
          question_text: '¿Qué método de Pandas cuenta los valores nulos por columna?',
          options: JSON.stringify([
            { key: 'a', text: 'df.count_nulls()', is_correct: false },
            { key: 'b', text: 'df.isnull().sum()', is_correct: true },
            { key: 'c', text: 'df.null_count()', is_correct: false },
            { key: 'd', text: 'df.na_count()', is_correct: false },
          ]),
          explanation: 'isnull() crea un DataFrame de True/False donde True indica nulo. sum() suma los True (que Python trata como 1) por columna, dando el conteo de nulos. También puedes usar isna().sum() que es equivalente.',
          order_index: 1,
        },
        {
          question_text: '¿Cuándo es preferible rellenar nulos con la MEDIANA en lugar de la MEDIA?',
          options: JSON.stringify([
            { key: 'a', text: 'Nunca, la media siempre es mejor', is_correct: false },
            { key: 'b', text: 'Cuando los datos tienen outliers que distorsionan la media', is_correct: true },
            { key: 'c', text: 'Cuando la columna tiene datos de texto', is_correct: false },
            { key: 'd', text: 'Cuando hay más del 50% de nulos', is_correct: false },
          ]),
          explanation: 'La media es sensible a outliers. Por ejemplo, si los salarios son [1000, 1100, 1050, 50000], la media es ~13287 pero la mediana es 1075. Para imputar, la mediana es más representativa del dato "típico".',
          order_index: 2,
        },
        {
          question_text: '¿Por qué es importante hacer df.copy() al inicio de una función de limpieza?',
          options: JSON.stringify([
            { key: 'a', text: 'Para ahorrar memoria RAM', is_correct: false },
            { key: 'b', text: 'Para que la función sea más rápida', is_correct: false },
            { key: 'c', text: 'Para no modificar el DataFrame original y poder comparar antes/después', is_correct: true },
            { key: 'd', text: 'Es solo una convención sin impacto real', is_correct: false },
          ]),
          explanation: 'Pandas pasa DataFrames por referencia. Sin copy(), los cambios dentro de la función modifican el DataFrame original. Con copy() trabajas en una copia independiente, preservando los datos originales para auditoría.',
          order_index: 3,
        },
        {
          question_text: '¿Qué hace drop_duplicates(subset=["email"], keep="first")?',
          options: JSON.stringify([
            { key: 'a', text: 'Elimina todas las filas que tienen email duplicado', is_correct: false },
            { key: 'b', text: 'Mantiene la primera aparición de cada email único, elimina las repeticiones', is_correct: true },
            { key: 'c', text: 'Mantiene la última aparición de cada email', is_correct: false },
            { key: 'd', text: 'Elimina la columna email del DataFrame', is_correct: false },
          ]),
          explanation: 'subset=["email"] define la columna para detectar duplicados. keep="first" conserva la primera ocurrencia de cada email y elimina las siguientes. keep="last" haría lo contrario. keep=False eliminaría todas las filas duplicadas.',
          order_index: 4,
        },
        {
          question_text: '¿Qué método convierte una columna de strings con fechas al tipo datetime de Pandas?',
          options: JSON.stringify([
            { key: 'a', text: 'df["fecha"].astype("datetime")', is_correct: false },
            { key: 'b', text: 'pd.to_datetime(df["fecha"])', is_correct: true },
            { key: 'c', text: 'df["fecha"].to_date()', is_correct: false },
            { key: 'd', text: 'datetime.parse(df["fecha"])', is_correct: false },
          ]),
          explanation: 'pd.to_datetime() es la función estándar de Pandas para convertir strings a datetime. Reconoce automáticamente muchos formatos. Para formatos específicos usa format="%d/%m/%Y". Una vez convertido, puedes extraer .dt.year, .dt.month, etc.',
          order_index: 5,
        },
      ],
    },
    assignment: {
      title: 'Ejercicio: Limpieza de dataset real',
      instructions_markdown: `# Ejercicio: Limpieza de dataset de estudiantes

## Objetivo
Aplicar técnicas de limpieza de datos a un dataset con problemas reales.

## Dataset de trabajo

Crea el siguiente DataFrame con problemas intencionales:

\`\`\`python
import pandas as pd
import numpy as np

datos = {
    "nombre": ["Ana García", "  Juan López  ", "María Torres", "Juan López", "Pedro Silva", "Lucía Mora", "  ANA GARCIA  "],
    "edad": ["22", "25", None, "30", "abc", "28", "22"],
    "ciudad": ["Quito", "quito", "GUAYAQUIL", "Quito", "Cuenca", None, "Quito"],
    "nota": [85.0, 92.0, None, 78.0, 95.0, None, 85.0],
    "email": ["ana@test.com", "juan@test.com", "maria@test.com", "juan@test.com", "pedro@test.com", "lucia@test.com", "ana@test.com"],
    "fecha_registro": ["2024-01-15", "2024-01-20", "2024-02-01", "2024-01-20", "2024-02-10", "2024-02-15", "2024-01-15"],
}

df = pd.DataFrame(datos)
\`\`\`

## Tareas

### Tarea 1: Diagnóstico (20 pts)
Escribe una función \`diagnosticar_dataset(df)\` que imprima:
- Número de filas y columnas
- Nulos por columna (cantidad y porcentaje)
- Número de duplicados
- Tipos de datos de cada columna

### Tarea 2: Pipeline de limpieza (60 pts)
Implementa \`limpiar_dataset(df)\` que:
1. Elimine duplicados basados en "email" (mantener primera)
2. Limpie espacios y normalice texto en "nombre" y "ciudad"
3. Convierta "edad" a entero, reemplazando valores inválidos con la mediana
4. Rellene nulos de "nota" con la mediana
5. Rellene nulos de "ciudad" con "Desconocida"
6. Convierta "fecha_registro" a datetime
7. Retorne el DataFrame limpio

### Tarea 3: Verificación (20 pts)
Crea \`verificar_limpieza(df_original, df_limpio)\` que imprima un reporte comparativo:
\`\`\`
=== REPORTE DE LIMPIEZA ===
Filas originales:  7  -> Filas limpias: 5
Nulos originales: 4  -> Nulos restantes: 0
Duplicados eliminados: 2
Tipos corregidos: edad (object->int), fecha_registro (object->datetime)
\`\`\`

## Entrega
Archivo .py con el pipeline completo y capturas del output.`,
      allowed_file_types: JSON.stringify(['.py', '.ipynb', '.txt', '.png', '.jpg']),
    },
    resources: [
      { title: 'Pandas Documentation - Working with missing data', url: 'https://pandas.pydata.org/docs/user_guide/missing_data.html', type: 'documentation', description: 'Documentación oficial de Pandas sobre manejo de datos faltantes con todos los métodos', order_index: 1 },
      { title: 'Data Cleaning with Python and Pandas - Towards Data Science', url: 'https://towardsdatascience.com/data-cleaning-with-python-and-pandas-detecting-missing-values-3e9c6ebcf78b', type: 'article', description: 'Guía práctica de limpieza de datos con ejemplos reales en inglés', order_index: 2 },
      { title: 'Kaggle - Data Cleaning Course', url: 'https://www.kaggle.com/learn/data-cleaning', type: 'course', description: 'Curso gratuito de Kaggle sobre limpieza de datos con notebooks interactivos', order_index: 3 },
      { title: 'Pandas Cheat Sheet', url: 'https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf', type: 'documentation', description: 'Hoja de referencia rápida con los métodos más importantes de Pandas', order_index: 4 },
    ],
  },
  {
    number: 6,
    title: 'Estadística descriptiva básica',
    video_url: 'https://www.youtube.com/watch?v=SzZ6GpcfoQY',
    estimated_duration_minutes: 85,
    order_index: 6,
    theory_markdown: `# Estadística Descriptiva Básica

La estadística descriptiva resume y describe las características principales de un conjunto de datos. Es el primer análisis que realiza todo científico de datos antes de construir modelos.

## Medidas de tendencia central

Describen el "centro" de los datos.

\`\`\`python
import pandas as pd
import numpy as np

datos = pd.Series([72, 85, 90, 78, 92, 65, 88, 75, 92, 80])

# Media: promedio aritmético
print(f"Media: {datos.mean():.2f}")      # 81.70

# Mediana: valor central al ordenar
print(f"Mediana: {datos.median():.2f}")  # 81.50

# Moda: valor más frecuente
print(f"Moda: {datos.mode()[0]}")        # 92

# describe() en un solo comando
print(datos.describe())
\`\`\`

**¿Cuándo usar cada una?**
- **Media**: distribución simétrica sin outliers
- **Mediana**: datos con outliers o distribución asimétrica (salarios, precios)
- **Moda**: datos categóricos o discretos

## Medidas de dispersión

Describen qué tan "dispersos" o "concentrados" están los datos.

\`\`\`python
# Rango: diferencia entre máximo y mínimo
rango = datos.max() - datos.min()
print(f"Rango: {rango}")                 # 27

# Varianza: promedio de diferencias al cuadrado
print(f"Varianza: {datos.var():.2f}")    # 78.23

# Desviación estándar: raíz de la varianza (misma unidad que los datos)
print(f"Desviación estándar: {datos.std():.2f}")  # 8.85

# IQR: rango intercuartílico (Q3 - Q1)
Q1 = datos.quantile(0.25)
Q3 = datos.quantile(0.75)
IQR = Q3 - Q1
print(f"Q1: {Q1}, Q3: {Q3}, IQR: {IQR}")
\`\`\`

## Distribución y cuartiles

\`\`\`python
# Percentiles
print(datos.quantile([0.25, 0.50, 0.75, 0.90]))

# Detectar outliers con IQR
limite_inferior = Q1 - 1.5 * IQR
limite_superior = Q3 + 1.5 * IQR
outliers = datos[(datos < limite_inferior) | (datos > limite_superior)]
print(f"Outliers: {outliers.values}")
\`\`\`

## Estadísticas sobre DataFrames

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    "matematicas": [85, 92, 78, 95, 65, 88, 72],
    "programacion": [90, 88, 85, 92, 70, 95, 78],
    "ingles": [75, 80, 82, 88, 65, 79, 71],
})

# describe() para todas las columnas
print(df.describe())

# Correlación entre columnas
print(df.corr())

# Por grupos
df["nivel"] = ["alto", "alto", "medio", "alto", "bajo", "alto", "medio"]
print(df.groupby("nivel")["matematicas"].mean())
\`\`\`

## Interpretación de la distribución

\`\`\`python
# Asimetría (skewness): si los datos están inclinados
print(f"Asimetría: {datos.skew():.3f}")
# > 0: cola a la derecha (más valores bajos)
# < 0: cola a la izquierda (más valores altos)
# ≈ 0: distribución simétrica

# Curtosis: qué tan "puntiaguda" es la distribución
print(f"Curtosis: {datos.kurt():.3f}")
\`\`\`

## Tablas de frecuencia

\`\`\`python
# Para datos categóricos
ciudades = pd.Series(["Quito", "Guayaquil", "Quito", "Cuenca", "Quito", "Guayaquil"])
print(ciudades.value_counts())
print(ciudades.value_counts(normalize=True) * 100)  # Porcentajes
\`\`\`

La estadística descriptiva te permite entender tus datos antes de modelar: es el diagnóstico médico antes del tratamiento.`,
    ai_lab_context: `El estudiante está aprendiendo estadística descriptiva con Pandas y NumPy. Cubre medidas de tendencia central (media, mediana, moda), medidas de dispersión (varianza, desviación estándar, IQR), percentiles, detección básica de outliers con IQR, correlación entre variables, agrupación con groupby, y value_counts para datos categóricos. Ayúdale a interpretar qué significan estos números en contexto real, cuándo usar mediana vs media, y cómo la correlación no implica causalidad.`,
    ai_lab_suggested_prompt: 'Tengo las notas de 30 estudiantes y la media es 72 pero la mediana es 85. ¿Qué me dice esto sobre la distribución de las notas? ¿Hay outliers probablemente?',
    quiz: {
      title: 'Quiz: Estadística Descriptiva',
      questions: [
        {
          question_text: 'En los datos [10, 12, 15, 11, 13, 12, 200], ¿qué medida de tendencia central es más representativa del grupo?',
          options: JSON.stringify([
            { key: 'a', text: 'La media, porque usa todos los datos', is_correct: false },
            { key: 'b', text: 'La mediana, porque no se ve afectada por el outlier 200', is_correct: true },
            { key: 'c', text: 'La moda, porque 12 se repite', is_correct: false },
            { key: 'd', text: 'El máximo, porque es el valor más informativo', is_correct: false },
          ]),
          explanation: 'El valor 200 es un outlier que distorsiona la media (≈39). La mediana (12) representa mejor el "centro real" de los datos porque no se ve afectada por extremos. En salarios y precios siempre se prefiere la mediana.',
          order_index: 1,
        },
        {
          question_text: '¿Qué indica una desviación estándar alta en un dataset de notas de estudiantes?',
          options: JSON.stringify([
            { key: 'a', text: 'Las notas son generalmente altas', is_correct: false },
            { key: 'b', text: 'Las notas están muy dispersas, hay gran variabilidad entre estudiantes', is_correct: true },
            { key: 'c', text: 'La media es incorrecta', is_correct: false },
            { key: 'd', text: 'Hay muchos valores nulos en el dataset', is_correct: false },
          ]),
          explanation: 'La desviación estándar mide cuánto se alejan los datos de la media. Alta = datos muy dispersos (notas de 50 a 100). Baja = datos concentrados cerca de la media (notas de 78 a 82). No dice nada sobre el nivel de las notas.',
          order_index: 2,
        },
        {
          question_text: '¿Cuál es la fórmula correcta para detectar outliers usando el método IQR?',
          options: JSON.stringify([
            { key: 'a', text: 'Valores fuera de [media ± 2*std]', is_correct: false },
            { key: 'b', text: 'Valores fuera de [Q1 - 1.5*IQR, Q3 + 1.5*IQR]', is_correct: true },
            { key: 'c', text: 'Valores fuera de [Q1, Q3]', is_correct: false },
            { key: 'd', text: 'Valores mayores al percentil 95', is_correct: false },
          ]),
          explanation: 'El método de Tukey usa los límites Q1 - 1.5*IQR y Q3 + 1.5*IQR para detectar outliers leves (1.5) o extremos (3.0). Es más robusto que media±std porque usa la mediana implícitamente.',
          order_index: 3,
        },
        {
          question_text: '¿Qué hace df.groupby("ciudad")["salario"].mean()?',
          options: JSON.stringify([
            { key: 'a', text: 'Calcula la media de salario de todo el DataFrame', is_correct: false },
            { key: 'b', text: 'Agrupa por ciudad y calcula el salario promedio de cada ciudad', is_correct: true },
            { key: 'c', text: 'Ordena el DataFrame por ciudad y salario', is_correct: false },
            { key: 'd', text: 'Filtra solo las filas con salario igual a la media', is_correct: false },
          ]),
          explanation: 'groupby() divide el DataFrame en grupos según los valores de "ciudad". Luego .mean() calcula la media de "salario" DENTRO de cada grupo. El resultado es una Serie con las ciudades como índice y el salario promedio como valores.',
          order_index: 4,
        },
        {
          question_text: '¿Qué significa una correlación de -0.85 entre variables X e Y?',
          options: JSON.stringify([
            { key: 'a', text: 'X causa que Y disminuya', is_correct: false },
            { key: 'b', text: 'Hay correlación negativa fuerte: cuando X sube, Y tiende a bajar', is_correct: true },
            { key: 'c', text: 'No hay relación entre X e Y', is_correct: false },
            { key: 'd', text: 'Y es el 85% de X', is_correct: false },
          ]),
          explanation: 'Correlación va de -1 a +1. -0.85 indica correlación negativa fuerte (cercana a -1): cuando X aumenta, Y tiende a disminuir. +0.85 sería correlación positiva fuerte. 0 = sin correlación lineal. IMPORTANTE: correlación no implica causalidad.',
          order_index: 5,
        },
      ],
    },
    assignment: {
      title: 'Ejercicio: Análisis estadístico de datos reales',
      instructions_markdown: `# Ejercicio: Análisis estadístico descriptivo

## Objetivo
Aplicar estadística descriptiva para extraer insights de un dataset de ventas.

## Dataset

\`\`\`python
import pandas as pd
import numpy as np

np.random.seed(42)
n = 100

df = pd.DataFrame({
    "mes": np.random.choice(["Enero", "Febrero", "Marzo", "Abril"], n),
    "ciudad": np.random.choice(["Quito", "Guayaquil", "Cuenca"], n, p=[0.5, 0.35, 0.15]),
    "ventas": np.random.normal(15000, 4000, n).round(2),
    "unidades": np.random.randint(10, 150, n),
    "satisfaccion": np.random.randint(1, 6, n),  # escala 1-5
})
# Agregar algunos outliers reales
df.loc[5, "ventas"] = 65000
df.loc[23, "ventas"] = -500  # Error en datos
\`\`\`

## Tareas

### Tarea 1: Resumen general (25 pts)
Función \`resumen_estadistico(df)\` que muestre:
- describe() de columnas numéricas
- Asimetría y curtosis de "ventas"
- Correlación entre ventas y unidades

### Tarea 2: Detección de outliers (25 pts)
Función \`detectar_outliers(serie, nombre)\` que:
- Calcule IQR, límite inferior y superior
- Identifique los valores outliers
- Imprima cuántos hay y cuáles son

### Tarea 3: Análisis por grupo (30 pts)
Función \`analisis_por_ciudad(df)\` que muestre para cada ciudad:
- Media y mediana de ventas
- Desviación estándar
- Número de registros

### Tarea 4: Reporte ejecutivo (20 pts)
Función \`reporte_ejecutivo(df)\` que genere un resumen en texto narrativo:
\`\`\`
=== REPORTE EJECUTIVO ===
Total de registros analizados: 100
Ciudad con más ventas promedio: Quito ($16,234)
Mes con mejor desempeño: Marzo
Outliers detectados: 2 (requieren revisión)
Correlación ventas-unidades: 0.73 (correlación positiva fuerte)
Recomendación: [tu análisis]
\`\`\`

## Entrega
Archivo .py y capturas del output completo.`,
      allowed_file_types: JSON.stringify(['.py', '.ipynb', '.txt', '.png', '.jpg']),
    },
    resources: [
      { title: 'Statistics for Data Science - Khan Academy', url: 'https://es.khanacademy.org/math/statistics-probability', type: 'course', description: 'Curso de estadística en español con videos y ejercicios interactivos gratuitos', order_index: 1 },
      { title: 'Pandas Descriptive Statistics', url: 'https://pandas.pydata.org/docs/user_guide/basics.html#descriptive-statistics', type: 'documentation', description: 'Documentación oficial de Pandas sobre funciones estadísticas disponibles', order_index: 2 },
      { title: 'Estadística descriptiva con Python - Ciencia de Datos', url: 'https://www.youtube.com/watch?v=pXNOFEQjkGk', type: 'video', description: 'Video tutorial en español sobre estadística descriptiva aplicada con Python', order_index: 3 },
      { title: 'Think Stats - Allen Downey (gratis)', url: 'https://greenteapress.com/thinkstats2/thinkstats2.pdf', type: 'book', description: 'Libro gratuito de estadística aplicada a ciencia de datos con Python', order_index: 4 },
    ],
  },
  {
    number: 7,
    title: 'Visualización de datos con Matplotlib',
    video_url: 'https://www.youtube.com/watch?v=UO98lJQ3QGI',
    estimated_duration_minutes: 90,
    order_index: 7,
    theory_markdown: `# Visualización de Datos con Matplotlib

Una visualización bien hecha comunica en segundos lo que una tabla de números no logra en minutos. Matplotlib es la biblioteca base de visualización en Python.

## Configuración inicial

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Estilo profesional
plt.style.use('seaborn-v0_8')  # Estilo limpio
# plt.style.use('dark_background')  # Fondo oscuro

# Para Jupyter notebooks
%matplotlib inline
\`\`\`

## Gráfico de línea (Line Plot)

Ideal para series de tiempo y tendencias.

\`\`\`python
meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
ventas = [4500, 5200, 4800, 6100, 5800, 7200]

fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(meses, ventas, marker='o', color='#1F2F58', linewidth=2, markersize=8)
ax.set_title("Ventas Mensuales 2024", fontsize=16, fontweight='bold')
ax.set_xlabel("Mes")
ax.set_ylabel("Ventas ($)")
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig("ventas.png", dpi=150, bbox_inches='tight')
plt.show()
\`\`\`

## Gráfico de barras (Bar Chart)

Para comparar categorías.

\`\`\`python
ciudades = ["Quito", "Guayaquil", "Cuenca", "Ambato"]
clientes = [1250, 980, 420, 310]
colores = ['#1F2F58', '#FBBC0C', '#73B8E7', '#F0846D']

fig, ax = plt.subplots(figsize=(9, 5))
bars = ax.bar(ciudades, clientes, color=colores, edgecolor='white', linewidth=0.5)

# Agregar etiquetas encima de cada barra
for bar, val in zip(bars, clientes):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 20,
            str(val), ha='center', va='bottom', fontweight='bold')

ax.set_title("Clientes por Ciudad", fontsize=14, fontweight='bold')
ax.set_ylabel("Número de clientes")
plt.tight_layout()
plt.show()
\`\`\`

## Histograma

Para distribuciones de datos numéricos.

\`\`\`python
np.random.seed(42)
notas = np.random.normal(75, 12, 200)

fig, ax = plt.subplots(figsize=(9, 5))
ax.hist(notas, bins=20, color='#1F2F58', edgecolor='white', alpha=0.8)
ax.axvline(notas.mean(), color='#FBBC0C', linestyle='--', linewidth=2, label=f'Media: {notas.mean():.1f}')
ax.axvline(np.median(notas), color='#F0846D', linestyle='--', linewidth=2, label=f'Mediana: {np.median(notas):.1f}')
ax.set_title("Distribución de Notas", fontsize=14, fontweight='bold')
ax.set_xlabel("Nota")
ax.set_ylabel("Frecuencia")
ax.legend()
plt.tight_layout()
plt.show()
\`\`\`

## Scatter Plot (Diagrama de dispersión)

Para visualizar relaciones entre dos variables.

\`\`\`python
horas_estudio = np.random.uniform(1, 10, 50)
notas = 60 + 4 * horas_estudio + np.random.normal(0, 5, 50)

fig, ax = plt.subplots(figsize=(8, 6))
scatter = ax.scatter(horas_estudio, notas, c=notas, cmap='viridis', alpha=0.7, s=80)
plt.colorbar(scatter, ax=ax, label='Nota')
ax.set_title("Horas de Estudio vs Nota Final")
ax.set_xlabel("Horas de estudio por semana")
ax.set_ylabel("Nota final")
plt.tight_layout()
plt.show()
\`\`\`

## Múltiples subplots

\`\`\`python
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.suptitle("Dashboard de Rendimiento", fontsize=16, fontweight='bold')

axes[0,0].plot(meses, ventas, 'o-', color='#1F2F58')
axes[0,0].set_title("Tendencia de ventas")

axes[0,1].bar(ciudades, clientes, color='#FBBC0C')
axes[0,1].set_title("Clientes por ciudad")

axes[1,0].hist(notas, bins=15, color='#73B8E7')
axes[1,0].set_title("Distribución de notas")

axes[1,1].scatter(horas_estudio, notas, alpha=0.5, color='#F0846D')
axes[1,1].set_title("Estudio vs Nota")

plt.tight_layout()
plt.savefig("dashboard.png", dpi=150)
plt.show()
\`\`\`

## Seaborn: Matplotlib mejorado

\`\`\`python
import seaborn as sns

# Heatmap de correlación
df_num = df.select_dtypes(include=[np.number])
fig, ax = plt.subplots(figsize=(8, 6))
sns.heatmap(df_num.corr(), annot=True, cmap='coolwarm', center=0, ax=ax)
plt.title("Matriz de correlación")
plt.show()
\`\`\`

La visualización de datos es una habilidad de comunicación: el gráfico debe responder una pregunta específica.`,
    ai_lab_context: `El estudiante está aprendiendo visualización con Matplotlib (y Seaborn básico). Cubre gráficos de línea, barras, histogramas y scatter plots, uso de fig/ax pattern, personalización (títulos, etiquetas, colores, grid), múltiples subplots y guardar figuras. Ayúdale a elegir el tipo de gráfico correcto según el tipo de datos y pregunta, cómo interpretar histogramas y scatter plots, y buenas prácticas de visualización (claridad, títulos descriptivos, etiquetas de ejes).`,
    ai_lab_suggested_prompt: 'Tengo datos de ventas por mes y por producto. ¿Qué tipo de gráfico me recomendarías para comparar las ventas de 4 productos durante 6 meses? ¿Cómo lo haría en Matplotlib?',
    quiz: {
      title: 'Quiz: Visualización con Matplotlib',
      questions: [
        {
          question_text: '¿Qué tipo de gráfico es más apropiado para visualizar la distribución de edades de 500 estudiantes?',
          options: JSON.stringify([
            { key: 'a', text: 'Gráfico de línea', is_correct: false },
            { key: 'b', text: 'Gráfico de barras', is_correct: false },
            { key: 'c', text: 'Histograma', is_correct: true },
            { key: 'd', text: 'Scatter plot', is_correct: false },
          ]),
          explanation: 'El histograma agrupa valores numéricos continuos en rangos (bins) y muestra la frecuencia de cada rango. Es ideal para ver distribuciones. Las barras comparan categorías, líneas muestran tendencias, scatter compara dos variables.',
          order_index: 1,
        },
        {
          question_text: '¿Cuál es la ventaja de usar fig, ax = plt.subplots() en lugar de plt.plot() directamente?',
          options: JSON.stringify([
            { key: 'a', text: 'Es más rápido de ejecutar', is_correct: false },
            { key: 'b', text: 'Permite mayor control sobre múltiples subplots y personalización del gráfico', is_correct: true },
            { key: 'c', text: 'Produce gráficos con mayor resolución', is_correct: false },
            { key: 'd', text: 'No hay diferencia funcional', is_correct: false },
          ]),
          explanation: 'fig, ax = plt.subplots() da acceso explícito a la figura (fig) y los ejes (ax). Esto permite crear múltiples subplots, personalizar cada uno independientemente, guardar con fig.savefig(), y trabajar con código más limpio y reproducible.',
          order_index: 2,
        },
        {
          question_text: '¿Qué comunica un scatter plot con puntos muy agrupados alrededor de una línea diagonal?',
          options: JSON.stringify([
            { key: 'a', text: 'Los datos tienen muchos outliers', is_correct: false },
            { key: 'b', text: 'Hay una correlación fuerte entre las dos variables', is_correct: true },
            { key: 'c', text: 'La distribución es normal', is_correct: false },
            { key: 'd', text: 'Las dos variables son idénticas', is_correct: false },
          ]),
          explanation: 'Cuando los puntos en un scatter plot se alinean cerca de una línea (diagonal positiva o negativa), indica correlación fuerte entre X e Y. Puntos dispersos por todos lados = correlación débil o nula.',
          order_index: 3,
        },
        {
          question_text: '¿Qué parámetro de plt.savefig() controla la calidad/resolución de la imagen guardada?',
          options: JSON.stringify([
            { key: 'a', text: 'quality=', is_correct: false },
            { key: 'b', text: 'resolution=', is_correct: false },
            { key: 'c', text: 'dpi=', is_correct: true },
            { key: 'd', text: 'size=', is_correct: false },
          ]),
          explanation: 'dpi (dots per inch) controla la resolución. dpi=72 es pantalla estándar, dpi=150 es buena calidad web, dpi=300 es calidad para impresión. Mayor dpi = mayor resolución pero archivo más grande.',
          order_index: 4,
        },
        {
          question_text: '¿Cuándo es preferible usar un gráfico de línea en lugar de un gráfico de barras?',
          options: JSON.stringify([
            { key: 'a', text: 'Cuando se comparan categorías sin orden natural', is_correct: false },
            { key: 'b', text: 'Cuando se visualiza una tendencia continua en el tiempo (serie de tiempo)', is_correct: true },
            { key: 'c', text: 'Cuando hay muchas categorías (más de 20)', is_correct: false },
            { key: 'd', text: 'Cuando los valores son porcentajes', is_correct: false },
          ]),
          explanation: 'Las líneas implican continuidad y tendencia entre puntos, ideal para series de tiempo (precio por día, temperatura por hora). Las barras son mejores para comparar categorías discretas sin relación de continuidad entre ellas.',
          order_index: 5,
        },
      ],
    },
    assignment: {
      title: 'Ejercicio: Dashboard visual de datos educativos',
      instructions_markdown: `# Ejercicio: Dashboard de visualización de datos educativos

## Objetivo
Crear un dashboard con 4 gráficos que cuente una historia con datos.

## Dataset

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# Datos de 120 estudiantes
df = pd.DataFrame({
    "carrera": np.random.choice(["IA", "Ciencia de Datos", "Big Data"], 120, p=[0.4, 0.35, 0.25]),
    "semestre": np.random.choice([1, 2, 3, 4, 5], 120),
    "nota_final": np.clip(np.random.normal(76, 12, 120), 0, 100).round(1),
    "horas_estudio": np.random.randint(5, 35, 120),
    "asistencia": np.random.uniform(60, 100, 120).round(1),
})
\`\`\`

## Tareas

Crea una figura con 4 subplots en layout 2x2 con título "Dashboard ITSEIA - Análisis Académico 2024":

### Gráfico 1 (arriba-izquierda): Distribución de notas
- Histograma de nota_final con 15 bins
- Línea vertical para la media (color diferente)
- Título: "Distribución de Notas Finales"

### Gráfico 2 (arriba-derecha): Estudiantes por carrera
- Gráfico de barras con la cantidad de estudiantes por carrera
- Etiquetas de cantidad encima de cada barra
- Colores distintos por carrera

### Gráfico 3 (abajo-izquierda): Horas de estudio vs Nota
- Scatter plot de horas_estudio vs nota_final
- Color de los puntos según carrera (usa "hue" o colores manuales)
- Título: "Estudio vs Rendimiento"

### Gráfico 4 (abajo-derecha): Promedio de nota por semestre
- Gráfico de línea mostrando la nota promedio por semestre
- Markers en cada punto
- Título: "Progresión por Semestre"

## Requisitos técnicos
- plt.tight_layout() al final
- Guardar como "dashboard_itseia.png" con dpi=150
- Todos los subplots deben tener título, etiquetas de ejes

## Entrega
Archivo .py y la imagen dashboard_itseia.png generada.`,
      allowed_file_types: JSON.stringify(['.py', '.ipynb', '.png', '.jpg', '.pdf']),
    },
    resources: [
      { title: 'Matplotlib Documentation - Plot types', url: 'https://matplotlib.org/stable/plot_types/index.html', type: 'documentation', description: 'Galería oficial de todos los tipos de gráficos en Matplotlib con código de ejemplo', order_index: 1 },
      { title: 'Seaborn Tutorial', url: 'https://seaborn.pydata.org/tutorial.html', type: 'documentation', description: 'Tutorial oficial de Seaborn con ejemplos de visualizaciones estadísticas elegantes', order_index: 2 },
      { title: 'Python Graph Gallery', url: 'https://www.python-graph-gallery.com/', type: 'reference', description: 'Galería de 400+ tipos de gráficos en Python con código copiable', order_index: 3 },
      { title: 'Matplotlib Cheatsheet', url: 'https://matplotlib.org/cheatsheets/', type: 'reference', description: 'Cheatsheets oficiales de Matplotlib para referencia rápida durante el ejercicio', order_index: 4 },
    ],
  },
  {
    number: 8,
    title: 'Introducción al análisis exploratorio (EDA)',
    video_url: 'https://www.youtube.com/watch?v=xi0vhXFPegw',
    estimated_duration_minutes: 100,
    order_index: 8,
    theory_markdown: `# Análisis Exploratorio de Datos (EDA)

El EDA (Exploratory Data Analysis) es el proceso sistemático de investigar un dataset antes de construir modelos. Es la etapa donde el científico de datos "conoce" sus datos.

## ¿Por qué hacer EDA?

- Detectar errores y anomalías antes de modelar
- Entender la distribución y relaciones entre variables
- Formular hipótesis sobre el fenómeno
- Decidir qué variables incluir en los modelos
- Identificar el preprocesamiento necesario

## Estructura de un EDA completo

### Paso 1: Carga y visión general

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

df = pd.read_csv("dataset.csv")

print("=== VISIÓN GENERAL ===")
print(f"Dimensiones: {df.shape}")
print(f"\\nTipos de datos:\\n{df.dtypes}")
print(f"\\nPrimeras filas:\\n{df.head()}")
print(f"\\nResumen estadístico:\\n{df.describe()}")
\`\`\`

### Paso 2: Análisis de calidad de datos

\`\`\`python
print("=== CALIDAD DE DATOS ===")

# Valores nulos
nulos = df.isnull().sum()
pct_nulos = (nulos / len(df)) * 100
calidad = pd.DataFrame({"nulos": nulos, "porcentaje": pct_nulos})
print(calidad[calidad["nulos"] > 0])

# Duplicados
print(f"Duplicados: {df.duplicated().sum()}")

# Valores únicos por columna
for col in df.select_dtypes(include="object").columns:
    print(f"{col}: {df[col].nunique()} únicos -> {df[col].value_counts().head(3).to_dict()}")
\`\`\`

### Paso 3: Análisis univariado

Analizar cada variable por separado.

\`\`\`python
# Variables numéricas
for col in df.select_dtypes(include=np.number).columns:
    print(f"\\n--- {col} ---")
    print(f"  Media: {df[col].mean():.2f} | Mediana: {df[col].median():.2f}")
    print(f"  Std: {df[col].std():.2f} | Skew: {df[col].skew():.3f}")
    Q1 = df[col].quantile(0.25)
    Q3 = df[col].quantile(0.75)
    IQR = Q3 - Q1
    outliers = df[(df[col] < Q1-1.5*IQR) | (df[col] > Q3+1.5*IQR)]
    print(f"  Outliers: {len(outliers)}")

# Variables categóricas
for col in df.select_dtypes(include="object").columns:
    print(f"\\n--- {col} ---")
    print(df[col].value_counts(normalize=True).round(3) * 100)
\`\`\`

### Paso 4: Análisis bivariado

Relación entre pares de variables.

\`\`\`python
# Correlación entre numéricas
corr_matrix = df.select_dtypes(include=np.number).corr()

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Heatmap de correlación
sns.heatmap(corr_matrix, annot=True, cmap='RdYlBu_r', center=0,
            fmt='.2f', ax=axes[0])
axes[0].set_title("Correlaciones")

# Scatter matrix para ver relaciones
pd.plotting.scatter_matrix(df.select_dtypes(include=np.number),
                           alpha=0.6, figsize=(10, 8), diagonal='hist')
plt.show()

# Variable objetivo vs predictores
if "precio" in df.columns:
    for col in df.select_dtypes(include=np.number).columns:
        if col != "precio":
            corr = df[col].corr(df["precio"])
            print(f"Correlación {col} vs precio: {corr:.3f}")
\`\`\`

### Paso 5: Detección visual de outliers

\`\`\`python
# Box plots para detectar outliers visualmente
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
for i, col in enumerate(df.select_dtypes(include=np.number).columns[:3]):
    axes[i].boxplot(df[col].dropna())
    axes[i].set_title(f"Boxplot: {col}")
plt.tight_layout()
plt.show()
\`\`\`

### Paso 6: Conclusiones del EDA

\`\`\`python
def generar_conclusiones_eda(df):
    """Template de conclusiones para reportar al equipo"""
    numericas = df.select_dtypes(include=np.number).columns.tolist()
    categoricas = df.select_dtypes(include="object").columns.tolist()

    print("=== CONCLUSIONES DEL EDA ===")
    print(f"Dataset: {df.shape[0]} registros, {df.shape[1]} variables")
    print(f"Variables numéricas: {numericas}")
    print(f"Variables categóricas: {categoricas}")
    print(f"Nulos totales: {df.isnull().sum().sum()}")
    print(f"Variables con alta correlación (>0.7):")
    corr = df[numericas].corr()
    for i in range(len(numericas)):
        for j in range(i+1, len(numericas)):
            if abs(corr.iloc[i,j]) > 0.7:
                print(f"  {numericas[i]} ↔ {numericas[j]}: {corr.iloc[i,j]:.3f}")
\`\`\`

El EDA es el diálogo inicial con los datos. Un buen EDA puede ahorrarte semanas de trabajo en la etapa de modelado.`,
    ai_lab_context: `El estudiante está aprendiendo EDA (Análisis Exploratorio de Datos). Cubre las etapas: visión general (shape, dtypes, head, describe), calidad de datos (nulos, duplicados, únicos), análisis univariado (distribuciones, skewness, outliers), análisis bivariado (correlaciones, heatmaps, scatter matrix) y conclusiones del EDA. Ayúdale a estructurar su proceso de EDA, interpretar heatmaps de correlación, entender qué preguntas responder con el EDA y cómo presentar los hallazgos a un equipo. Si usa un dataset propio, guíale con preguntas de exploración.`,
    ai_lab_suggested_prompt: 'Tengo un dataset de precios de casas en Quito con columnas: precio, metros_cuadrados, habitaciones, barrio, año_construccion. ¿Cuáles son los primeros 5 pasos de EDA que haría y qué preguntas buscarías responder?',
    quiz: {
      title: 'Quiz: Análisis Exploratorio de Datos (EDA)',
      questions: [
        {
          question_text: '¿Cuál es el objetivo principal del EDA antes de construir un modelo de machine learning?',
          options: JSON.stringify([
            { key: 'a', text: 'Entrenar el modelo lo más rápido posible', is_correct: false },
            { key: 'b', text: 'Entender la estructura, calidad y relaciones en los datos para tomar mejores decisiones de modelado', is_correct: true },
            { key: 'c', text: 'Crear las visualizaciones finales para el cliente', is_correct: false },
            { key: 'd', text: 'Reducir el tamaño del dataset', is_correct: false },
          ]),
          explanation: 'El EDA es el proceso de "conocer los datos" antes de modelar. Permite detectar problemas (nulos, outliers), entender distribuciones, identificar relaciones y formular hipótesis. Un buen EDA define el éxito del modelo posterior.',
          order_index: 1,
        },
        {
          question_text: '¿Qué información proporciona df.describe() en Pandas?',
          options: JSON.stringify([
            { key: 'a', text: 'Solo el tipo de datos de cada columna', is_correct: false },
            { key: 'b', text: 'Estadísticas descriptivas (count, mean, std, min, percentiles, max) de columnas numéricas', is_correct: true },
            { key: 'c', text: 'Los primeros y últimos 5 registros del DataFrame', is_correct: false },
            { key: 'd', text: 'El número de valores únicos por columna', is_correct: false },
          ]),
          explanation: 'describe() resume automáticamente las variables numéricas con 8 estadísticas: count (no-nulos), mean, std, min, 25th percentile, mediana (50%), 75th percentile y max. Para variables categóricas con include="object" muestra count, unique, top y freq.',
          order_index: 2,
        },
        {
          question_text: '¿Qué revela un heatmap de correlación con valores cercanos a +1 entre dos variables?',
          options: JSON.stringify([
            { key: 'a', text: 'Una variable causa directamente a la otra', is_correct: false },
            { key: 'b', text: 'Las dos variables tienden a subir y bajar juntas (correlación positiva fuerte)', is_correct: true },
            { key: 'c', text: 'Las variables son independientes', is_correct: false },
            { key: 'd', text: 'Hay un error en los datos', is_correct: false },
          ]),
          explanation: 'Correlación cercana a +1 = cuando una sube, la otra también. Cercana a -1 = relación inversa. Cercana a 0 = sin relación lineal. NUNCA implica causalidad: altura y peso correlacionan, pero crecer no "causa" aumentar de peso.',
          order_index: 3,
        },
        {
          question_text: '¿Qué es el análisis univariado en el contexto del EDA?',
          options: JSON.stringify([
            { key: 'a', text: 'Analizar solo una fila del dataset', is_correct: false },
            { key: 'b', text: 'Examinar cada variable de forma individual: distribución, rango, outliers', is_correct: true },
            { key: 'c', text: 'Buscar relaciones entre dos variables específicas', is_correct: false },
            { key: 'd', text: 'Analizar únicamente la variable objetivo (target)', is_correct: false },
          ]),
          explanation: 'Univariado = una variable a la vez. Se examina distribución (histograma), estadísticas básicas (media, mediana, std), outliers (boxplot, IQR) y valores únicos. Es el paso 3 del EDA antes de analizar relaciones entre variables (bivariado).',
          order_index: 4,
        },
        {
          question_text: '¿Cuál es la diferencia entre df.shape y df.info() en Pandas?',
          options: JSON.stringify([
            { key: 'a', text: 'shape muestra filas y columnas; info() muestra tipos de datos, nulos y memoria usada', is_correct: true },
            { key: 'b', text: 'Son equivalentes, muestran lo mismo', is_correct: false },
            { key: 'c', text: 'shape es para NumPy; info() es solo para Pandas', is_correct: false },
            { key: 'd', text: 'info() solo funciona con columnas numéricas', is_correct: false },
          ]),
          explanation: 'shape retorna una tupla (n_filas, n_columnas). info() es más completo: muestra número de entradas, nombre y tipo de cada columna, conteo de valores no-nulos y uso de memoria. Son complementarios en el EDA inicial.',
          order_index: 5,
        },
      ],
    },
    assignment: {
      title: 'Ejercicio: EDA completo de dataset Titanic',
      instructions_markdown: `# Ejercicio: EDA Completo - Dataset Titanic

## Objetivo
Realizar un EDA profesional completo sobre el dataset Titanic, siguiendo las 6 etapas del proceso.

## Dataset

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Cargar dataset público
url = "https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv"
df = pd.read_csv(url)
print(df.head())
\`\`\`

## Entregable: Notebook o script con 6 secciones

### Sección 1: Visión General (15 pts)
- Dimensiones del dataset
- Tipos de variables (categóricas vs numéricas)
- Primeras y últimas 5 filas
- Resumen estadístico completo

### Sección 2: Calidad de Datos (15 pts)
- Tabla de nulos (cantidad y porcentaje por columna)
- Número de duplicados
- Propuesta de tratamiento para cada columna con nulos

### Sección 3: Análisis Univariado (20 pts)
- Distribución de "Age" (histograma)
- Distribución de "Fare" (histograma)
- Conteo de supervivientes "Survived" (barras)
- Distribución por clase "Pclass" (barras)

### Sección 4: Análisis Bivariado (20 pts)
- Tasa de supervivencia por género (groupby + barras)
- Tasa de supervivencia por clase (groupby + barras)
- Correlación entre variables numéricas (heatmap)
- Scatter plot: Age vs Fare coloreado por Survived

### Sección 5: Outliers (15 pts)
- Boxplot de "Fare" (detectar outliers)
- Boxplot de "Age" (detectar outliers)
- Cuántos outliers hay según IQR en cada variable

### Sección 6: Conclusiones (15 pts)
Redacta 5 hallazgos clave en forma de texto:
- ¿Qué variables tienen más nulos?
- ¿Qué variables correlacionan con "Survived"?
- ¿Hay outliers problemáticos?
- ¿Qué variables usarías en un modelo predictivo y cuáles descartarías?

## Entrega
Archivo .py o .ipynb con todas las secciones y sus visualizaciones.

## Evaluación
- Completitud de las 6 secciones: 50 pts
- Calidad de las visualizaciones: 25 pts
- Profundidad de las conclusiones: 25 pts`,
      allowed_file_types: JSON.stringify(['.py', '.ipynb', '.html', '.pdf', '.png']),
    },
    resources: [
      { title: 'Towards Data Science - EDA with Pandas', url: 'https://towardsdatascience.com/exploratory-data-analysis-8fc1cb20fd15', type: 'article', description: 'Guía práctica de EDA con código real y explicaciones detalladas en inglés', order_index: 1 },
      { title: 'Kaggle - EDA Tutorial (español disponible)', url: 'https://www.kaggle.com/learn/data-visualization', type: 'course', description: 'Curso gratuito de Kaggle sobre EDA y visualización con notebooks interactivos', order_index: 2 },
      { title: 'Pandas Profiling / YData Profiling', url: 'https://docs.profiling.ydata.ai/latest/', type: 'tool', description: 'Herramienta que genera un reporte EDA completo automáticamente con una línea de código', order_index: 3 },
      { title: 'Dataset Titanic en Kaggle', url: 'https://www.kaggle.com/c/titanic/data', type: 'dataset', description: 'Dataset oficial de Titanic para practicar EDA, el más usado en data science para aprendizaje', order_index: 4 },
    ],
  },
];

async function loadSession(sessionData) {
  console.log(`\nCargando sesión \${sessionData.number}: \${sessionData.title}`);
  const session = await post('/sessions', {
    subject_id: SUBJECT_ID,
    number: sessionData.number,
    title: sessionData.title,
    video_url: sessionData.video_url,
    theory_markdown: sessionData.theory_markdown,
    ai_lab_context: sessionData.ai_lab_context,
    ai_lab_suggested_prompt: sessionData.ai_lab_suggested_prompt,
    order_index: sessionData.order_index,
    estimated_duration_minutes: sessionData.estimated_duration_minutes,
    is_active: true,
  });
  if (!session) { console.error(`  FALLO sesión \${sessionData.number}`); return false; }
  console.log(`  Sesion creada: \${session.id}`);

  const quiz = await post('/quizzes', {
    session_id: session.id,
    title: sessionData.quiz.title,
    pass_percentage: 70,
    max_attempts: 3,
    is_active: true,
  });
  if (!quiz) { console.error(`  FALLO quiz`); return false; }
  console.log(`  Quiz creado: \${quiz.id}`);

  for (const q of sessionData.quiz.questions) {
    await post('/quiz_questions', {
      quiz_id: quiz.id,
      question_text: q.question_text,
      question_type: 'multiple_choice',
      options: q.options,
      explanation: q.explanation,
      points: 1,
      order_index: q.order_index,
    }, 'return=minimal');
  }
  console.log(`  \${sessionData.quiz.questions.length} preguntas`);

  await post('/assignments', {
    session_id: session.id,
    title: sessionData.assignment.title,
    instructions_markdown: sessionData.assignment.instructions_markdown,
    allowed_file_types: sessionData.assignment.allowed_file_types,
    max_grade: 100,
    is_active: true,
  }, 'return=minimal');
  console.log(`  Assignment creado`);

  for (const r of sessionData.resources) {
    await post('/session_resources', {
      session_id: session.id,
      title: r.title,
      url: r.url,
      type: r.type,
      description: r.description,
      order_index: r.order_index,
    }, 'return=minimal');
  }
  console.log(`  \${sessionData.resources.length} recursos`);
  return true;
}

async function main() {
  console.log('=== CARGANDO SESIONES 5-8: Introducción a la Ciencia de Datos (CD) ===');
  let exitosas = 0;
  for (const s of sessions) {
    const ok = await loadSession(s);
    if (ok) exitosas++;
  }
  console.log(`\n=== RESULTADO: \${exitosas}/\${sessions.length} sesiones cargadas ===`);
}

main().catch(console.error);
