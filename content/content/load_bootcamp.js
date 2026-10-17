#!/usr/bin/env node
/**
 * Load Bootcamp IA Intensivo (3 meses, $497) into ITSEIA Academy
 * Creates: 1 program, 3 semesters, 12 subjects, 48 sessions with quizzes
 * Run: node content/load_bootcamp.js
 */

const BASE = "https://wqlselfapnggxxeziruo.supabase.co/rest/v1";
const SKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc";
const H = {"apikey":SKEY,"Authorization":"Bearer "+SKEY,"Content-Type":"application/json","Prefer":"return=representation"};
const Hm = {"apikey":SKEY,"Authorization":"Bearer "+SKEY,"Content-Type":"application/json","Prefer":"return=minimal"};

async function post(url, body) {
  const r = await fetch(url, {method:"POST",headers:H,body:JSON.stringify(body)});
  const data = await r.json();
  if (r.status !== 201) throw new Error("POST failed ("+r.status+"): "+JSON.stringify(data).substring(0,200));
  return Array.isArray(data) ? data[0] : data;
}

async function postMin(url, body) {
  const r = await fetch(url, {method:"POST",headers:Hm,body:JSON.stringify(body)});
  if (r.status !== 201) { const t = await r.text(); throw new Error("POST failed ("+r.status+"): "+t.substring(0,200)); }
}

// ============================================
// BOOTCAMP CONTENT DEFINITION
// ============================================

const MONTHS = [
  {
    number: 1, name: "Mes 1: Fundamentos IA y Python", level: "basic",
    subjects: [
      {
        code: "BOOT-PY1", name: "Python Intensivo", slug: "bootcamp-python-intensivo",
        description: "Domina Python desde cero en una semana intensiva",
        sessions: [
          { title: "Variables, tipos de datos y operadores",
            theory: "# Variables y Tipos de Datos en Python\n\nPython es un lenguaje de tipado dinamico. No necesitas declarar el tipo de variable.\n\n## Tipos basicos\n```python\nnombre = \"Maria\"    # str\nedad = 25           # int\naltura = 1.65       # float\nes_estudiante = True # bool\n```\n\n## Operadores\n- Aritmeticos: `+`, `-`, `*`, `/`, `//`, `%`, `**`\n- Comparacion: `==`, `!=`, `>`, `<`, `>=`, `<=`\n- Logicos: `and`, `or`, `not`\n\n## Conversiones\n```python\nint(\"42\")    # str a int\nstr(3.14)    # float a str\nfloat(\"2.5\") # str a float\n```\n\nPython infiere el tipo automaticamente. Usa `type(variable)` para verificar el tipo de cualquier variable.",
            quiz: [{q:"Cual es el tipo de dato de x = 3.14?",a:"int",b:"float",c:"str",correct:"b",exp:"3.14 tiene punto decimal, es float."},
                   {q:"Que operador es // en Python?",a:"Division normal",b:"Division entera",c:"Modulo",correct:"b",exp:"// hace division entera, descartando decimales."},
                   {q:"Que retorna type('hola')?",a:"<class 'int'>",b:"<class 'str'>",c:"<class 'list'>",correct:"b",exp:"Los textos entre comillas son tipo str."}]
          },
          { title: "Estructuras de control: if, for, while",
            theory: "# Estructuras de Control\n\nControlan el flujo de ejecucion del programa.\n\n## Condicionales\n```python\nedad = 18\nif edad >= 18:\n    print(\"Mayor de edad\")\nelif edad >= 13:\n    print(\"Adolescente\")\nelse:\n    print(\"Nino\")\n```\n\n## Bucle for\n```python\nfor i in range(5):\n    print(i)  # 0, 1, 2, 3, 4\n\nfor fruta in [\"manzana\", \"banana\"]:\n    print(fruta)\n```\n\n## Bucle while\n```python\ncontador = 0\nwhile contador < 5:\n    print(contador)\n    contador += 1\n```\n\n## break y continue\n- `break`: sale del bucle completamente\n- `continue`: salta a la siguiente iteracion\n\nLa indentacion en Python es obligatoria y define los bloques de codigo.",
            quiz: [{q:"Que hace break dentro de un bucle?",a:"Pausa el bucle",b:"Sale del bucle",c:"Reinicia el bucle",correct:"b",exp:"break termina el bucle inmediatamente."},
                   {q:"range(3) genera?",a:"[1,2,3]",b:"[0,1,2]",c:"[0,1,2,3]",correct:"b",exp:"range(3) genera 0, 1, 2."},
                   {q:"Es obligatoria la indentacion en Python?",a:"No, es opcional",b:"Si, define bloques",c:"Solo en funciones",correct:"b",exp:"Python usa indentacion para definir bloques."}]
          },
          { title: "Funciones y modulos",
            theory: "# Funciones y Modulos\n\n## Definir funciones\n```python\ndef calcular_imc(peso, altura):\n    \"\"\"Calcula el indice de masa corporal.\"\"\"\n    return peso / (altura ** 2)\n\nresultado = calcular_imc(70, 1.75)\n```\n\n## Parametros por defecto\n```python\ndef saludar(nombre, idioma=\"es\"):\n    if idioma == \"es\":\n        return f\"Hola, {nombre}\"\n    return f\"Hello, {nombre}\"\n```\n\n## Lambda\n```python\ndoble = lambda x: x * 2\nnumeros = [1, 2, 3]\nresultado = list(map(lambda x: x**2, numeros))\n```\n\n## Modulos\n```python\nimport math\nfrom datetime import datetime\nimport random as rd\n```\n\nLas funciones son bloques reutilizables. Usa docstrings para documentarlas. Los modulos organizan codigo en archivos separados.",
            quiz: [{q:"Cual es la palabra clave para definir una funcion?",a:"function",b:"def",c:"func",correct:"b",exp:"En Python se usa def para definir funciones."},
                   {q:"Que es una funcion lambda?",a:"Funcion con nombre",b:"Funcion anonima de una linea",c:"Funcion de clase",correct:"b",exp:"Lambda crea funciones anonimas de una expresion."},
                   {q:"Como importar solo datetime del modulo datetime?",a:"import datetime",b:"from datetime import datetime",c:"use datetime",correct:"b",exp:"from modulo import clase para importar especifico."}]
          },
          { title: "Listas, diccionarios y manejo de datos",
            theory: "# Estructuras de Datos en Python\n\n## Listas\n```python\nfrutas = [\"manzana\", \"banana\", \"naranja\"]\nfrutas.append(\"uva\")\nfrutas[0]  # \"manzana\"\nfrutas[1:3]  # [\"banana\", \"naranja\"]\n```\n\n## Diccionarios\n```python\nestudiante = {\n    \"nombre\": \"Carlos\",\n    \"edad\": 22,\n    \"carrera\": \"IA\"\n}\nestudiante[\"email\"] = \"carlos@mail.com\"\n```\n\n## List Comprehension\n```python\ncuadrados = [x**2 for x in range(10)]\npares = [x for x in range(20) if x % 2 == 0]\n```\n\n## Sets y Tuplas\n```python\nunicos = {1, 2, 3, 3}  # {1, 2, 3}\ncoordenadas = (10.5, -3.2)  # inmutable\n```\n\nListas son mutables y ordenadas. Diccionarios almacenan pares clave-valor. Sets eliminan duplicados. Tuplas son inmutables.",
            quiz: [{q:"Diferencia principal entre lista y tupla?",a:"Listas mas rapidas",b:"Tuplas son mutables",c:"Listas mutables, tuplas inmutables",correct:"c",exp:"Las listas se pueden modificar, las tuplas no."},
                   {q:"Como agregar un elemento al final de una lista?",a:"list.add()",b:"list.append()",c:"list.push()",correct:"b",exp:"append() agrega al final de la lista."},
                   {q:"Que hace un set con elementos duplicados?",a:"Error",b:"Los mantiene",c:"Los elimina automaticamente",correct:"c",exp:"Sets solo almacenan elementos unicos."}]
          }
        ]
      },
      {
        code: "BOOT-MAT1", name: "Matematicas para ML", slug: "bootcamp-matematicas-ml",
        description: "Algebra lineal y estadistica esencial para Machine Learning",
        sessions: [
          { title: "Vectores y matrices con NumPy",
            theory: "# Vectores y Matrices con NumPy\n\nNumPy es la base del computo cientifico en Python.\n\n## Vectores\n```python\nimport numpy as np\nv = np.array([1, 2, 3])\nprint(v.shape)  # (3,)\n```\n\n## Matrices\n```python\nA = np.array([[1, 2], [3, 4]])\nprint(A.shape)  # (2, 2)\n```\n\n## Operaciones\n```python\n# Suma de vectores\nv1 + v2\n# Producto punto\nnp.dot(v1, v2)\n# Multiplicacion de matrices\nA @ B  # o np.matmul(A, B)\n# Transpuesta\nA.T\n```\n\nLas matrices representan datos tabulares. Cada fila es una observacion, cada columna una caracteristica. ML opera fundamentalmente con estas estructuras.",
            quiz: [{q:"Que libreria es la base del computo cientifico en Python?",a:"Pandas",b:"NumPy",c:"SciPy",correct:"b",exp:"NumPy es la base, Pandas y SciPy se construyen sobre ella."},
                   {q:"Que operador hace multiplicacion de matrices en Python?",a:"*",b:"@",c:"x",correct:"b",exp:"@ es el operador de multiplicacion matricial."},
                   {q:"Que retorna A.T?",a:"Inversa",b:"Transpuesta",c:"Determinante",correct:"b",exp:".T retorna la transpuesta de la matriz."}]
          },
          { title: "Estadistica descriptiva esencial",
            theory: "# Estadistica Descriptiva\n\nResumir y entender datos antes de modelar.\n\n## Medidas de tendencia central\n- **Media:** promedio aritmetico\n- **Mediana:** valor central (robusta a outliers)\n- **Moda:** valor mas frecuente\n\n```python\nimport numpy as np\ndatos = [23, 45, 12, 67, 34, 89, 12]\nnp.mean(datos)    # 40.28\nnp.median(datos)  # 34.0\n```\n\n## Medidas de dispersion\n- **Varianza:** que tan dispersos estan los datos\n- **Desviacion estandar:** raiz de la varianza\n- **Rango:** max - min\n\n```python\nnp.std(datos)  # desviacion estandar\nnp.var(datos)  # varianza\n```\n\n## Cuartiles\n```python\nnp.percentile(datos, [25, 50, 75])\n```\n\nEntender la distribucion de tus datos es el primer paso antes de cualquier modelo de ML.",
            quiz: [{q:"Que medida es robusta a valores extremos?",a:"Media",b:"Mediana",c:"Varianza",correct:"b",exp:"La mediana no se afecta por outliers."},
                   {q:"La desviacion estandar es?",a:"El cuadrado de la varianza",b:"La raiz cuadrada de la varianza",c:"Igual a la media",correct:"b",exp:"std = sqrt(varianza)."},
                   {q:"Para que sirve np.percentile?",a:"Calcular media",b:"Dividir datos en porcentajes",c:"Graficar datos",correct:"b",exp:"Calcula percentiles, dividiendo datos en segmentos."}]
          },
          { title: "Probabilidad para Machine Learning",
            theory: "# Probabilidad para ML\n\nML se basa fundamentalmente en probabilidad.\n\n## Conceptos clave\n- **Probabilidad:** P(A) = casos favorables / casos totales\n- **Probabilidad condicional:** P(A|B) = P(A y B) / P(B)\n- **Teorema de Bayes:** P(A|B) = P(B|A) * P(A) / P(B)\n\n## Distribuciones\n```python\nimport numpy as np\n# Normal (Gaussiana)\nnp.random.normal(media, std, tamano)\n# Uniforme\nnp.random.uniform(min, max, tamano)\n```\n\n## Distribucion Normal\nLa campana de Gauss. La mayoria de fenomenos naturales la siguen.\n- 68% de datos a 1 std de la media\n- 95% a 2 std\n- 99.7% a 3 std\n\nBayes es la base de clasificadores, filtros de spam y sistemas de recomendacion. Entender probabilidad es entender como ML toma decisiones.",
            quiz: [{q:"Que establece el Teorema de Bayes?",a:"Media de datos",b:"Probabilidad condicional inversa",c:"Varianza total",correct:"b",exp:"Bayes calcula P(A|B) a partir de P(B|A)."},
                   {q:"Que porcentaje de datos cae dentro de 2 std de la media?",a:"68%",b:"95%",c:"99.7%",correct:"b",exp:"95% de datos estan a 2 desviaciones estandar."},
                   {q:"Que distribucion describe la mayoria de fenomenos naturales?",a:"Uniforme",b:"Normal",c:"Binomial",correct:"b",exp:"La distribucion normal o campana de Gauss."}]
          },
          { title: "Algebra lineal aplicada a datos",
            theory: "# Algebra Lineal Aplicada\n\nML es algebra lineal con datos reales.\n\n## Transformaciones lineales\n```python\nimport numpy as np\n# Escalar datos\nX_scaled = (X - X.mean()) / X.std()\n```\n\n## Eigenvalores y eigenvectores\n```python\neigenvalues, eigenvectors = np.linalg.eig(A)\n```\nSon la base de PCA (reduccion de dimensionalidad).\n\n## Normas\n```python\nnp.linalg.norm(v)      # norma L2 (distancia euclidiana)\nnp.linalg.norm(v, 1)   # norma L1 (Manhattan)\n```\n\n## Sistemas de ecuaciones\n```python\n# Ax = b\nx = np.linalg.solve(A, b)\n```\n\nRegresion lineal es resolver un sistema de ecuaciones. PCA usa eigenvectores. Las distancias entre puntos usan normas. Toda operacion de ML tiene algebra lineal detras.",
            quiz: [{q:"Que es PCA?",a:"Un modelo de clasificacion",b:"Reduccion de dimensionalidad",c:"Un tipo de red neuronal",correct:"b",exp:"PCA reduce dimensiones usando eigenvectores."},
                   {q:"Que hace np.linalg.norm(v)?",a:"Normaliza vector",b:"Calcula distancia euclidiana",c:"Invierte vector",correct:"b",exp:"norm() calcula la magnitud del vector (L2)."},
                   {q:"Escalar datos consiste en?",a:"Duplicar datos",b:"Restar media y dividir por std",c:"Ordenar datos",correct:"b",exp:"Estandarizacion: (X - media) / std."}]
          }
        ]
      },
      {
        code: "BOOT-IML1", name: "Intro Machine Learning", slug: "bootcamp-intro-ml",
        description: "Conceptos fundamentales de ML y primer modelo",
        sessions: [
          { title: "Que es Machine Learning y tipos de aprendizaje",
            theory: "# Que es Machine Learning\n\nML es la capacidad de las computadoras de aprender patrones a partir de datos sin ser programadas explicitamente.\n\n## Tipos de aprendizaje\n\n### Supervisado\nAprende de datos etiquetados (input → output conocido).\n- **Clasificacion:** predecir categorias (spam/no spam)\n- **Regresion:** predecir valores continuos (precio de casa)\n\n### No supervisado\nEncuentra patrones en datos sin etiquetas.\n- **Clustering:** agrupar clientes similares\n- **Reduccion dimensional:** simplificar datos complejos\n\n### Por refuerzo\nAprende por ensayo y error con recompensas.\n- Juegos, robots, sistemas de recomendacion\n\n## Pipeline basico\n1. Recopilar datos\n2. Limpiar y preparar\n3. Seleccionar modelo\n4. Entrenar\n5. Evaluar\n6. Desplegar\n\nEl 80% del trabajo es preparar datos. Solo el 20% es modelar.",
            quiz: [{q:"Que tipo de ML usa datos etiquetados?",a:"No supervisado",b:"Supervisado",c:"Por refuerzo",correct:"b",exp:"Supervisado aprende de pares input-output etiquetados."},
                   {q:"Predecir el precio de una casa es?",a:"Clasificacion",b:"Regresion",c:"Clustering",correct:"b",exp:"Regresion predice valores continuos."},
                   {q:"Que porcentaje del trabajo en ML es preparar datos?",a:"20%",b:"50%",c:"80%",correct:"c",exp:"El 80% del esfuerzo es limpieza y preparacion."}]
          },
          { title: "Preparacion de datos con Pandas",
            theory: "# Preparacion de Datos con Pandas\n\nPandas es la herramienta principal para manipular datos tabulares.\n\n## Cargar datos\n```python\nimport pandas as pd\ndf = pd.read_csv(\"datos.csv\")\ndf.head()       # primeras 5 filas\ndf.info()       # tipos y nulos\ndf.describe()   # estadisticas\n```\n\n## Limpieza\n```python\n# Valores nulos\ndf.isnull().sum()\ndf.dropna()              # eliminar filas con nulos\ndf.fillna(df.mean())     # reemplazar con media\n\n# Duplicados\ndf.drop_duplicates()\n\n# Tipos\ndf['fecha'] = pd.to_datetime(df['fecha'])\n```\n\n## Transformacion\n```python\n# Seleccionar columnas\ndf[['nombre', 'edad']]\n# Filtrar\ndf[df['edad'] > 25]\n# Crear columna\ndf['imc'] = df['peso'] / (df['altura'] ** 2)\n```\n\nDatos limpios = modelos precisos. Basura entra, basura sale (GIGO).",
            quiz: [{q:"Que hace df.describe()?",a:"Primeras filas",b:"Resumen estadistico",c:"Tipos de columnas",correct:"b",exp:"describe() muestra count, mean, std, min, quartiles, max."},
                   {q:"Como eliminar filas con valores nulos?",a:"df.remove_nulls()",b:"df.dropna()",c:"df.clean()",correct:"b",exp:"dropna() elimina filas con valores faltantes."},
                   {q:"Que significa GIGO en datos?",a:"Get In, Get Out",b:"Garbage In, Garbage Out",c:"Good In, Good Out",correct:"b",exp:"Datos malos producen resultados malos."}]
          },
          { title: "Tu primer modelo: Regresion Lineal",
            theory: "# Tu Primer Modelo: Regresion Lineal\n\nEl modelo mas simple y fundamental de ML.\n\n## Concepto\nEncuentra la linea recta que mejor se ajusta a los datos.\n`y = mx + b` (pendiente + intercepto)\n\n## Implementacion\n```python\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_squared_error, r2_score\n\n# Dividir datos\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\n\n# Entrenar\nmodelo = LinearRegression()\nmodelo.fit(X_train, y_train)\n\n# Predecir\ny_pred = modelo.predict(X_test)\n\n# Evaluar\nprint(f\"R2: {r2_score(y_test, y_pred):.3f}\")\nprint(f\"RMSE: {mean_squared_error(y_test, y_pred, squared=False):.3f}\")\n```\n\nR2 indica que proporcion de la varianza explica el modelo. RMSE mide el error promedio en las mismas unidades que los datos.",
            quiz: [{q:"Que metrica indica proporcion de varianza explicada?",a:"RMSE",b:"R2",c:"MAE",correct:"b",exp:"R2 va de 0 a 1, donde 1 es perfecto."},
                   {q:"Por que dividir datos en train/test?",a:"Por velocidad",b:"Para evaluar en datos no vistos",c:"Por tradicion",correct:"b",exp:"Test set evalua generalizacion del modelo."},
                   {q:"Que hace model.fit()?",a:"Predice",b:"Entrena el modelo",c:"Evalua",correct:"b",exp:"fit() ajusta los parametros del modelo con los datos."}]
          },
          { title: "Evaluacion de modelos y metricas",
            theory: "# Evaluacion de Modelos\n\nUn modelo sin evaluacion rigurosa no tiene valor.\n\n## Metricas de Regresion\n- **R2:** proporcion de varianza explicada (0-1)\n- **RMSE:** error cuadratico medio (menor es mejor)\n- **MAE:** error absoluto medio (mas robusto a outliers)\n\n## Metricas de Clasificacion\n- **Accuracy:** % de predicciones correctas\n- **Precision:** de los positivos predichos, cuantos son correctos\n- **Recall:** de los positivos reales, cuantos se detectaron\n- **F1-Score:** media armonica de precision y recall\n\n```python\nfrom sklearn.metrics import classification_report\nprint(classification_report(y_test, y_pred))\n```\n\n## Validacion Cruzada\n```python\nfrom sklearn.model_selection import cross_val_score\nscores = cross_val_score(modelo, X, y, cv=5)\nprint(f\"Media: {scores.mean():.3f}\")\n```\n\nNunca evalues con los mismos datos de entrenamiento. Validacion cruzada da estimacion mas robusta que un solo split.",
            quiz: [{q:"Que metrica es robusta a outliers en regresion?",a:"RMSE",b:"R2",c:"MAE",correct:"c",exp:"MAE usa valor absoluto, no penaliza outliers tanto."},
                   {q:"Que mide Recall?",a:"Positivos predichos correctos",b:"Positivos reales detectados",c:"Accuracy total",correct:"b",exp:"Recall = TP / (TP + FN), sensibilidad."},
                   {q:"Que hace cross_val_score con cv=5?",a:"5 modelos diferentes",b:"5 evaluaciones rotando datos",c:"5 epochs",correct:"b",exp:"Divide datos en 5, entrena 5 veces rotando."}]
          }
        ]
      },
      {
        code: "BOOT-DAT1", name: "Datos y Visualizacion", slug: "bootcamp-datos-visualizacion",
        description: "Analisis exploratorio y visualizacion profesional de datos",
        sessions: [
          { title: "EDA: Analisis Exploratorio de Datos",
            theory: "# Analisis Exploratorio de Datos (EDA)\n\nEDA es investigar datos antes de modelar. Es obligatorio en todo proyecto.\n\n## Paso 1: Estructura\n```python\ndf.shape        # filas, columnas\ndf.dtypes       # tipos de datos\ndf.info()       # resumen completo\n```\n\n## Paso 2: Estadisticas\n```python\ndf.describe()          # numericas\ndf.describe(include='object')  # categoricas\n```\n\n## Paso 3: Valores faltantes\n```python\ndf.isnull().sum()\ndf.isnull().sum() / len(df) * 100  # porcentaje\n```\n\n## Paso 4: Distribuciones\n```python\ndf['columna'].hist()\ndf['columna'].value_counts()\n```\n\n## Paso 5: Correlaciones\n```python\ndf.corr()\n```\n\nEDA revela patrones, anomalias y guia las decisiones de modelado. Saltarse el EDA es el error mas comun de principiantes.",
            quiz: [{q:"Que es lo primero que se hace en EDA?",a:"Modelar",b:"Entender la estructura",c:"Visualizar",correct:"b",exp:"Primero entender shape, dtypes, info()."},
                   {q:"Que revela df.isnull().sum()?",a:"Duplicados",b:"Valores faltantes por columna",c:"Estadisticas",correct:"b",exp:"Cuenta valores nulos en cada columna."},
                   {q:"Por que es importante hacer EDA?",a:"Es opcional",b:"Guia decisiones de modelado",c:"Solo para reportes",correct:"b",exp:"EDA revela patrones y problemas antes de modelar."}]
          },
          { title: "Matplotlib y Seaborn: graficos profesionales",
            theory: "# Visualizacion con Matplotlib y Seaborn\n\n## Matplotlib\n```python\nimport matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(10, 6))\nax.plot(x, y, color='blue', label='Ventas')\nax.set_title('Ventas Mensuales')\nax.set_xlabel('Mes')\nax.legend()\nplt.tight_layout()\nplt.show()\n```\n\n## Seaborn (alto nivel)\n```python\nimport seaborn as sns\n\n# Distribucion\nsns.histplot(df['edad'], kde=True)\n\n# Relacion\nsns.scatterplot(data=df, x='peso', y='altura', hue='genero')\n\n# Correlacion\nsns.heatmap(df.corr(), annot=True, cmap='coolwarm')\n\n# Categorias\nsns.boxplot(data=df, x='carrera', y='salario')\n```\n\nMatplotlib da control total. Seaborn hace graficos estadisticos atractivos con menos codigo. Usa ambos juntos para reportes profesionales.",
            quiz: [{q:"Que libreria es de mas alto nivel, Matplotlib o Seaborn?",a:"Matplotlib",b:"Seaborn",c:"Son iguales",correct:"b",exp:"Seaborn es de alto nivel, construido sobre Matplotlib."},
                   {q:"Que grafico es mejor para ver correlaciones?",a:"Barras",b:"Heatmap",c:"Histograma",correct:"b",exp:"Heatmap visualiza matriz de correlacion."},
                   {q:"Para que sirve plt.tight_layout()?",a:"Comprimir datos",b:"Ajustar espaciado",c:"Cerrar grafico",correct:"b",exp:"Ajusta margenes para evitar solapamientos."}]
          },
          { title: "Feature Engineering basico",
            theory: "# Feature Engineering\n\nCrear mejores variables para mejorar modelos.\n\n## Encoding categoricas\n```python\n# One-Hot Encoding\npd.get_dummies(df, columns=['ciudad'])\n\n# Label Encoding\nfrom sklearn.preprocessing import LabelEncoder\nle = LabelEncoder()\ndf['genero_num'] = le.fit_transform(df['genero'])\n```\n\n## Escalado\n```python\nfrom sklearn.preprocessing import StandardScaler, MinMaxScaler\n\n# Estandarizacion (media=0, std=1)\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\n\n# Normalizacion (0-1)\nscaler = MinMaxScaler()\nX_norm = scaler.fit_transform(X)\n```\n\n## Crear features\n```python\ndf['edad_grupo'] = pd.cut(df['edad'], bins=[0,18,35,60,100])\ndf['mes'] = df['fecha'].dt.month\ndf['dia_semana'] = df['fecha'].dt.dayofweek\n```\n\nBuenas features importan mas que modelos complejos. Un modelo simple con buenos features supera a uno complejo con features malos.",
            quiz: [{q:"Que hace One-Hot Encoding?",a:"Escala numericas",b:"Convierte categoricas en columnas binarias",c:"Elimina nulos",correct:"b",exp:"Crea una columna binaria por cada categoria."},
                   {q:"StandardScaler produce datos con?",a:"Min=0, Max=1",b:"Media=0, Std=1",c:"Suma=100",correct:"b",exp:"Estandariza a media 0 y desviacion estandar 1."},
                   {q:"Que es mas importante, features o modelo complejo?",a:"Modelo complejo",b:"Buenos features",c:"Mas datos siempre",correct:"b",exp:"Buenos features superan a modelos complejos."}]
          },
          { title: "Proyecto: EDA completo con dataset real",
            theory: "# Proyecto: EDA Completo\n\nAplica todo lo aprendido en un dataset real.\n\n## Dataset: Titanic (clasico ML)\n```python\nimport pandas as pd\nimport seaborn as sns\n\ndf = sns.load_dataset('titanic')\n```\n\n## Pipeline EDA\n1. **Explorar:** shape, info(), describe()\n2. **Limpiar:** nulos en age (imputar mediana), eliminar cabin\n3. **Visualizar:** supervivencia por clase, edad, genero\n4. **Correlacionar:** heatmap de variables numericas\n5. **Features:** crear age_group, is_alone, fare_category\n6. **Conclusiones:** escribir 5 insights descubiertos\n\n## Entregable\nJupyter Notebook con:\n- Minimo 8 graficos diferentes\n- Analisis de nulos con estrategia justificada\n- 3 features nuevos creados\n- 5 conclusiones escritas en markdown\n\nEste proyecto demuestra habilidades que las empresas buscan. Un buen EDA en tu portafolio vale mas que 10 certificados.",
            quiz: [{q:"Por que Titanic es un dataset clasico de ML?",a:"Es grande",b:"Tiene clasificacion binaria con features variados",c:"Es nuevo",correct:"b",exp:"Combina numericas, categoricas y clasificacion binaria."},
                   {q:"Mejor estrategia para nulos en age?",a:"Eliminar columna",b:"Imputar con mediana",c:"Poner cero",correct:"b",exp:"Mediana es robusta a outliers para imputar."},
                   {q:"Cuantos graficos minimo debe tener el EDA?",a:"3",b:"5",c:"8",correct:"c",exp:"Minimo 8 graficos para un EDA completo."}]
          }
        ]
      }
    ]
  },
  {
    number: 2, name: "Mes 2: Machine Learning Aplicado", level: "professional",
    subjects: [
      {
        code: "BOOT-SUP2", name: "ML Supervisado", slug: "bootcamp-ml-supervisado",
        description: "Algoritmos de clasificacion y regresion avanzados",
        sessions: [
          { title: "Regresion Logistica y arboles de decision",
            theory: "# Regresion Logistica y Arboles de Decision\n\n## Regresion Logistica\nPese al nombre, es para clasificacion binaria.\n```python\nfrom sklearn.linear_model import LogisticRegression\n\nmodelo = LogisticRegression()\nmodelo.fit(X_train, y_train)\nprobs = modelo.predict_proba(X_test)  # probabilidades\n```\nUsa funcion sigmoide para convertir output a probabilidad (0-1).\n\n## Arboles de Decision\n```python\nfrom sklearn.tree import DecisionTreeClassifier\nimport sklearn.tree as tree\n\ndt = DecisionTreeClassifier(max_depth=5)\ndt.fit(X_train, y_train)\ntree.plot_tree(dt, feature_names=cols, filled=True)\n```\n\nArboles son interpretables: puedes ver exactamente por que tomo cada decision. Ideales cuando necesitas explicar el modelo a no-tecnicos. Propensos a overfitting sin limitar profundidad.",
            quiz: [{q:"Regresion Logistica se usa para?",a:"Regresion",b:"Clasificacion binaria",c:"Clustering",correct:"b",exp:"Clasifica en dos categorias usando funcion sigmoide."},
                   {q:"Que parametro previene overfitting en arboles?",a:"n_estimators",b:"max_depth",c:"learning_rate",correct:"b",exp:"max_depth limita la profundidad del arbol."},
                   {q:"Ventaja de arboles de decision?",a:"Siempre precisos",b:"Interpretabilidad",c:"No necesitan datos",correct:"b",exp:"Puedes explicar cada decision del modelo."}]
          },
          { title: "Random Forest y Gradient Boosting",
            theory: "# Ensemble Methods: Random Forest y Gradient Boosting\n\nCombinar modelos debiles para crear uno fuerte.\n\n## Random Forest\n```python\nfrom sklearn.ensemble import RandomForestClassifier\n\nrf = RandomForestClassifier(n_estimators=100, random_state=42)\nrf.fit(X_train, y_train)\n\n# Importancia de features\nimportances = rf.feature_importances_\n```\nMultiples arboles votando. Reduce overfitting vs arbol unico.\n\n## Gradient Boosting\n```python\nfrom sklearn.ensemble import GradientBoostingClassifier\n\ngb = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1)\ngb.fit(X_train, y_train)\n```\nArboles secuenciales, cada uno corrigiendo errores del anterior.\n\n## XGBoost (estado del arte)\n```python\nimport xgboost as xgb\nmodelo = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss')\n```\n\nXGBoost y LightGBM ganan la mayoria de competencias de ML en datos tabulares. Son el estandar de la industria.",
            quiz: [{q:"Random Forest combina multiples?",a:"Redes neuronales",b:"Arboles de decision",c:"Regresiones",correct:"b",exp:"Es un ensemble de arboles que votan."},
                   {q:"Gradient Boosting entrena arboles?",a:"En paralelo",b:"Secuencialmente corrigiendo errores",c:"Aleatoriamente",correct:"b",exp:"Cada arbol corrige los errores del anterior."},
                   {q:"Que libreria domina competencias de ML tabular?",a:"Scikit-learn",b:"TensorFlow",c:"XGBoost",correct:"c",exp:"XGBoost y LightGBM ganan la mayoria de competencias."}]
          },
          { title: "SVM y KNN: modelos clasicos",
            theory: "# SVM y KNN\n\n## Support Vector Machines (SVM)\nBusca el hiperplano que mejor separa las clases con maximo margen.\n```python\nfrom sklearn.svm import SVC\n\nsvm = SVC(kernel='rbf', C=1.0)\nsvm.fit(X_train, y_train)\n```\n\n### Kernels\n- `linear`: datos linealmente separables\n- `rbf`: datos no lineales (por defecto)\n- `poly`: fronteras polinomiales\n\n## K-Nearest Neighbors (KNN)\nClasifica segun los K vecinos mas cercanos.\n```python\nfrom sklearn.neighbors import KNeighborsClassifier\n\nknn = KNeighborsClassifier(n_neighbors=5)\nknn.fit(X_train, y_train)\n```\n\nKNN es sensible a la escala de datos: siempre escalar antes. SVM funciona bien en alta dimension pero es lento con datasets grandes. Ambos son fundamentales para entender conceptos de ML.",
            quiz: [{q:"SVM busca el hiperplano con?",a:"Minimo error",b:"Maximo margen",c:"Minima distancia",correct:"b",exp:"Maximiza el margen entre clases."},
                   {q:"Por que escalar datos antes de KNN?",a:"Es opcional",b:"KNN usa distancias, la escala afecta",c:"Por velocidad",correct:"b",exp:"Distancias se distorsionan sin escalado."},
                   {q:"Que kernel de SVM funciona con datos no lineales?",a:"linear",b:"rbf",c:"identity",correct:"b",exp:"RBF (Radial Basis Function) maneja no linealidad."}]
          },
          { title: "Hyperparameter tuning y seleccion de modelo",
            theory: "# Hyperparameter Tuning\n\nOptimizar los parametros del modelo para mejor rendimiento.\n\n## Grid Search\n```python\nfrom sklearn.model_selection import GridSearchCV\n\nparams = {\n    'n_estimators': [50, 100, 200],\n    'max_depth': [3, 5, 10],\n    'learning_rate': [0.01, 0.1, 0.3]\n}\n\ngrid = GridSearchCV(modelo, params, cv=5, scoring='accuracy')\ngrid.fit(X_train, y_train)\nprint(grid.best_params_)\n```\n\n## Random Search (mas eficiente)\n```python\nfrom sklearn.model_selection import RandomizedSearchCV\nrandom_search = RandomizedSearchCV(modelo, params, n_iter=20, cv=5)\n```\n\n## Comparar modelos\n```python\nmodelos = [LogisticRegression(), RandomForestClassifier(), XGBClassifier()]\nfor m in modelos:\n    scores = cross_val_score(m, X, y, cv=5)\n    print(f\"{m.__class__.__name__}: {scores.mean():.3f}\")\n```\n\nRandom Search es 60x mas eficiente que Grid Search para encontrar buenos hyperparametros.",
            quiz: [{q:"Que hace GridSearchCV?",a:"Entrena un modelo",b:"Prueba todas las combinaciones de parametros",c:"Selecciona features",correct:"b",exp:"Prueba exhaustivamente todas las combinaciones."},
                   {q:"Por que RandomSearch es mas eficiente?",a:"Usa menos datos",b:"Muestrea aleatorio en vez de probar todo",c:"Es mas preciso",correct:"b",exp:"Explora mas del espacio con menos evaluaciones."},
                   {q:"Cuantos folds usa cv=5 en cross validation?",a:"3",b:"5",c:"10",correct:"b",exp:"Divide datos en 5 partes, entrena 5 veces."}]
          }
        ]
      },
      {
        code: "BOOT-UNS2", name: "ML No Supervisado", slug: "bootcamp-ml-no-supervisado",
        description: "Clustering, reduccion dimensional y deteccion de anomalias",
        sessions: [
          { title: "K-Means y clustering jerarquico",
            theory: "# Clustering: K-Means y Jerarquico\n\nAgrupar datos sin etiquetas previas.\n\n## K-Means\n```python\nfrom sklearn.cluster import KMeans\n\nkmeans = KMeans(n_clusters=3, random_state=42)\nkmeans.fit(X)\nlabels = kmeans.labels_\ncenters = kmeans.cluster_centers_\n```\n\n## Elegir K optimo\n```python\n# Metodo del codo\ninertias = []\nfor k in range(1, 11):\n    km = KMeans(n_clusters=k)\n    km.fit(X)\n    inertias.append(km.inertia_)\nplt.plot(range(1,11), inertias, 'bo-')\n```\n\n## Clustering Jerarquico\n```python\nfrom scipy.cluster.hierarchy import dendrogram, linkage\nZ = linkage(X, method='ward')\ndendrogram(Z)\n```\n\nK-Means es rapido pero asume clusters esfericos. Jerarquico no necesita definir K pero es lento con datasets grandes. Usa silhouette score para evaluar calidad.",
            quiz: [{q:"K-Means necesita definir K previamente?",a:"No",b:"Si",c:"Solo a veces",correct:"b",exp:"Debes especificar el numero de clusters."},
                   {q:"Que metodo ayuda a elegir K optimo?",a:"Cross validation",b:"Metodo del codo",c:"PCA",correct:"b",exp:"El codo muestra donde la inercia deja de bajar rapido."},
                   {q:"Ventaja del clustering jerarquico?",a:"Mas rapido",b:"No necesita definir K",c:"Mas preciso",correct:"b",exp:"El dendrograma permite elegir K visualmente despues."}]
          },
          { title: "PCA y reduccion de dimensionalidad",
            theory: "# PCA: Reduccion de Dimensionalidad\n\nSimplificar datos conservando la informacion importante.\n\n## Concepto\nPCA encuentra las direcciones de maxima varianza (componentes principales) y proyecta los datos a menos dimensiones.\n\n## Implementacion\n```python\nfrom sklearn.decomposition import PCA\n\n# Reducir a 2 dimensiones para visualizar\npca = PCA(n_components=2)\nX_pca = pca.fit_transform(X)\n\n# Varianza explicada\nprint(pca.explained_variance_ratio_)\n# Ejemplo: [0.72, 0.18] = 90% con 2 componentes\n```\n\n## Elegir componentes\n```python\npca = PCA(n_components=0.95)  # retener 95% varianza\nX_reduced = pca.fit_transform(X)\nprint(f\"Componentes: {pca.n_components_}\")\n```\n\n## Cuando usar PCA\n- Datos con muchas columnas (>50)\n- Visualizar datos de alta dimension\n- Reducir ruido\n- Acelerar entrenamiento\n\nPCA no es un modelo predictivo, es una herramienta de preprocesamiento.",
            quiz: [{q:"Que busca PCA en los datos?",a:"Clusters",b:"Direcciones de maxima varianza",c:"Outliers",correct:"b",exp:"PCA encuentra componentes con maxima varianza."},
                   {q:"PCA(n_components=0.95) retiene?",a:"95 componentes",b:"95% de la varianza",c:"95% de filas",correct:"b",exp:"Selecciona componentes para retener 95% de varianza."},
                   {q:"PCA es un modelo predictivo?",a:"Si",b:"No, es preprocesamiento",c:"Depende",correct:"b",exp:"PCA transforma datos, no predice."}]
          },
          { title: "Deteccion de anomalias",
            theory: "# Deteccion de Anomalias\n\nIdentificar datos atipicos que no siguen el patron normal.\n\n## Isolation Forest\n```python\nfrom sklearn.ensemble import IsolationForest\n\niso = IsolationForest(contamination=0.05, random_state=42)\npredictions = iso.fit_predict(X)\n# -1 = anomalia, 1 = normal\n```\n\n## DBSCAN\nClustering que detecta outliers automaticamente.\n```python\nfrom sklearn.cluster import DBSCAN\n\ndb = DBSCAN(eps=0.5, min_samples=5)\nlabels = db.fit_predict(X)\n# label = -1 es outlier\n```\n\n## Metodo estadistico (Z-Score)\n```python\nfrom scipy import stats\nz_scores = np.abs(stats.zscore(df[columnas_numericas]))\noutliers = (z_scores > 3).any(axis=1)\n```\n\n## Aplicaciones reales\n- Fraude financiero\n- Fallas en maquinaria\n- Ciberseguridad\n- Control de calidad\n\nEl umbral de contaminacion depende del dominio: fraude bancario es ~0.1%, defectos en manufactura ~2-5%.",
            quiz: [{q:"Que retorna Isolation Forest para anomalias?",a:"0",b:"-1",c:"True",correct:"b",exp:"-1 indica anomalia, 1 indica normal."},
                   {q:"Z-Score > 3 indica?",a:"Dato normal",b:"Posible anomalia",c:"Dato faltante",correct:"b",exp:"Mas de 3 desviaciones estandar es atipico."},
                   {q:"DBSCAN detecta outliers como?",a:"Clase 0",b:"Label -1",c:"Cluster mas grande",correct:"b",exp:"Puntos que no pertenecen a ningun cluster son -1."}]
          },
          { title: "Proyecto: Segmentacion de clientes",
            theory: "# Proyecto: Segmentacion de Clientes\n\nAplica clustering para segmentar clientes de e-commerce.\n\n## Dataset\nCustomer Personality Analysis (Kaggle) o datos sinteticos.\n\n## Pipeline\n```python\n# 1. Cargar y limpiar\ndf = pd.read_csv('customers.csv')\ndf.dropna(inplace=True)\n\n# 2. Feature engineering\ndf['total_spent'] = df['MntWines'] + df['MntFruits'] + df['MntMeat']\ndf['age'] = 2026 - df['Year_Birth']\n\n# 3. Escalar\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(features)\n\n# 4. PCA para visualizar\npca = PCA(n_components=2)\nX_pca = pca.fit_transform(X_scaled)\n\n# 5. K-Means\nkmeans = KMeans(n_clusters=4)\nlabels = kmeans.fit_predict(X_scaled)\n\n# 6. Analizar segmentos\ndf['segment'] = labels\ndf.groupby('segment').mean()\n```\n\n## Entregable\nNotebook con segmentos nombrados (VIP, Frecuente, Nuevo, Inactivo) y recomendaciones de marketing para cada uno.",
            quiz: [{q:"Por que escalar antes de clustering?",a:"Obligatorio por ley",b:"K-Means usa distancias, escala afecta",c:"Por estetica",correct:"b",exp:"Sin escalar, variables con rangos grandes dominan."},
                   {q:"Cuantos segmentos tipicos en e-commerce?",a:"2",b:"3-5",c:"10+",correct:"b",exp:"3-5 segmentos son manejables para marketing."},
                   {q:"Que hacer despues de clustering?",a:"Solo reportar numeros",b:"Nombrar segmentos y dar recomendaciones",c:"Eliminar outliers",correct:"b",exp:"Los segmentos deben tener nombre y accion de negocio."}]
          }
        ]
      },
      {
        code: "BOOT-DL2", name: "Deep Learning Intro", slug: "bootcamp-deep-learning-intro",
        description: "Redes neuronales desde cero con TensorFlow/Keras",
        sessions: [
          { title: "Perceptron y redes neuronales basicas",
            theory: "# Redes Neuronales: Fundamentos\n\n## Perceptron\nLa unidad basica: inputs * pesos + bias → funcion de activacion → output.\n\n## Red Neuronal\nCapas de perceptrones conectados.\n```\nInput Layer → Hidden Layer(s) → Output Layer\n```\n\n## Con Keras\n```python\nimport tensorflow as tf\nfrom tensorflow import keras\n\nmodel = keras.Sequential([\n    keras.layers.Dense(64, activation='relu', input_shape=(n_features,)),\n    keras.layers.Dense(32, activation='relu'),\n    keras.layers.Dense(1, activation='sigmoid')  # clasificacion binaria\n])\n\nmodel.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])\nmodel.summary()\n```\n\n## Funciones de activacion\n- **ReLU:** max(0, x) — estandar para capas ocultas\n- **Sigmoid:** 0-1 — output binario\n- **Softmax:** probabilidades multi-clase\n\nDeep Learning es ML con redes de muchas capas. Aprende representaciones jerarquicas automaticamente.",
            quiz: [{q:"Que funcion de activacion es estandar en capas ocultas?",a:"Sigmoid",b:"ReLU",c:"Softmax",correct:"b",exp:"ReLU es rapida y evita el problema del gradiente."},
                   {q:"Softmax se usa para?",a:"Binario",b:"Multi-clase",c:"Regresion",correct:"b",exp:"Softmax genera probabilidades para multiples clases."},
                   {q:"Que hace model.compile()?",a:"Entrena",b:"Configura optimizador y loss",c:"Predice",correct:"b",exp:"compile() configura como se entrenara el modelo."}]
          },
          { title: "Entrenamiento, backpropagation y optimizadores",
            theory: "# Entrenamiento de Redes Neuronales\n\n## Forward Pass\nDatos fluyen de input a output generando prediccion.\n\n## Loss Function\nMide que tan lejos esta la prediccion del valor real.\n- `binary_crossentropy`: clasificacion binaria\n- `categorical_crossentropy`: multi-clase\n- `mse`: regresion\n\n## Backpropagation\nCalcula gradientes del error hacia atras y ajusta pesos.\n\n## Entrenamiento\n```python\nhistory = model.fit(\n    X_train, y_train,\n    epochs=50,\n    batch_size=32,\n    validation_split=0.2,\n    callbacks=[keras.callbacks.EarlyStopping(patience=5)]\n)\n\n# Visualizar entrenamiento\nplt.plot(history.history['loss'], label='Train')\nplt.plot(history.history['val_loss'], label='Val')\nplt.legend()\n```\n\n## Optimizadores\n- **SGD:** basico, lento pero estable\n- **Adam:** adaptativo, el mas usado\n- **RMSprop:** bueno para RNNs\n\nEarlyStopping previene overfitting deteniendo cuando val_loss deja de mejorar.",
            quiz: [{q:"Backpropagation calcula?",a:"Predicciones",b:"Gradientes del error",c:"Accuracy",correct:"b",exp:"Calcula gradientes para ajustar pesos."},
                   {q:"Que optimizador es el mas usado?",a:"SGD",b:"Adam",c:"RMSprop",correct:"b",exp:"Adam combina momentum y tasa adaptativa."},
                   {q:"EarlyStopping previene?",a:"Underfitting",b:"Overfitting",c:"Data leakage",correct:"b",exp:"Detiene entrenamiento cuando val_loss no mejora."}]
          },
          { title: "CNNs para vision por computadora",
            theory: "# CNNs: Redes Convolucionales\n\nEspecializadas en imagenes y datos espaciales.\n\n## Arquitectura\n```python\nmodel = keras.Sequential([\n    keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),\n    keras.layers.MaxPooling2D((2,2)),\n    keras.layers.Conv2D(64, (3,3), activation='relu'),\n    keras.layers.MaxPooling2D((2,2)),\n    keras.layers.Flatten(),\n    keras.layers.Dense(64, activation='relu'),\n    keras.layers.Dense(10, activation='softmax')\n])\n```\n\n## Capas clave\n- **Conv2D:** detecta patrones locales (bordes, texturas)\n- **MaxPooling:** reduce tamano, retiene features importantes\n- **Flatten:** convierte 2D a 1D para capas densas\n\n## Transfer Learning\n```python\nbase = keras.applications.MobileNetV2(weights='imagenet', include_top=False)\nbase.trainable = False\n```\n\nTransfer Learning permite usar modelos pre-entrenados en millones de imagenes. Es la forma practica de usar CNNs sin GPU potente ni datasets enormes.",
            quiz: [{q:"Que detecta una capa Conv2D?",a:"Colores",b:"Patrones locales",c:"Tamano de imagen",correct:"b",exp:"Convoluciones detectan bordes, texturas y patrones."},
                   {q:"Transfer Learning permite?",a:"Entrenar desde cero",b:"Reusar modelos pre-entrenados",c:"Transferir datos",correct:"b",exp:"Reutiliza conocimiento aprendido en otros datasets."},
                   {q:"MaxPooling reduce?",a:"El numero de filtros",b:"Las dimensiones espaciales",c:"El learning rate",correct:"b",exp:"Reduce ancho y alto, reteniendo features importantes."}]
          },
          { title: "Proyecto: Clasificador de imagenes",
            theory: "# Proyecto: Clasificador de Imagenes\n\nConstruye un clasificador usando CNN y Transfer Learning.\n\n## Dataset: CIFAR-10 o Fashion MNIST\n```python\n(X_train, y_train), (X_test, y_test) = keras.datasets.fashion_mnist.load_data()\nX_train = X_train / 255.0  # normalizar pixeles a 0-1\nX_train = X_train.reshape(-1, 28, 28, 1)  # agregar canal\n```\n\n## Pipeline\n1. Cargar y normalizar datos\n2. Construir CNN con Conv2D + MaxPooling\n3. Compilar con Adam + categorical_crossentropy\n4. Entrenar con EarlyStopping\n5. Evaluar con confusion matrix\n6. Probar con imagenes nuevas\n\n## Evaluacion\n```python\nfrom sklearn.metrics import confusion_matrix, classification_report\ny_pred = model.predict(X_test).argmax(axis=1)\nprint(classification_report(y_test, y_pred))\nsns.heatmap(confusion_matrix(y_test, y_pred), annot=True)\n```\n\n## Entregable\nModelo con accuracy > 90% en Fashion MNIST. Notebook con graficos de entrenamiento, confusion matrix y predicciones visualizadas.",
            quiz: [{q:"Por que dividir pixeles por 255?",a:"Reducir tamano",b:"Normalizar a rango 0-1",c:"Convertir a gris",correct:"b",exp:"Pixeles van de 0-255, normalizar a 0-1 mejora entrenamiento."},
                   {q:"Que muestra una confusion matrix?",a:"Loss por epoch",b:"Predicciones correctas e incorrectas por clase",c:"Learning rate",correct:"b",exp:"Muestra donde el modelo acierta y se confunde."},
                   {q:"Accuracy objetivo para Fashion MNIST?",a:">70%",b:">80%",c:">90%",correct:"c",exp:"Con CNN bien configurada, >90% es alcanzable."}]
          }
        ]
      },
      {
        code: "BOOT-NLP2", name: "NLP Basico", slug: "bootcamp-nlp-basico",
        description: "Procesamiento de Lenguaje Natural con Python",
        sessions: [
          { title: "Fundamentos de NLP y preprocesamiento de texto",
            theory: "# NLP: Procesamiento de Lenguaje Natural\n\nEnsenar a computadoras a entender texto humano.\n\n## Preprocesamiento\n```python\nimport re\nimport nltk\nfrom nltk.corpus import stopwords\nfrom nltk.stem import SnowballStemmer\n\ndef limpiar_texto(texto):\n    texto = texto.lower()\n    texto = re.sub(r'[^a-zA-Z\\s]', '', texto)\n    tokens = texto.split()\n    stop = set(stopwords.words('spanish'))\n    tokens = [t for t in tokens if t not in stop]\n    stemmer = SnowballStemmer('spanish')\n    tokens = [stemmer.stem(t) for t in tokens]\n    return ' '.join(tokens)\n```\n\n## Pipeline NLP\n1. Tokenizacion (dividir en palabras)\n2. Lowercasing (minusculas)\n3. Remover stopwords (el, la, de, en...)\n4. Stemming/Lemmatization (reducir a raiz)\n5. Vectorizacion (texto a numeros)\n\nLas maquinas no entienden texto, solo numeros. Todo pipeline NLP convierte texto a representacion numerica.",
            quiz: [{q:"Que son stopwords?",a:"Palabras clave",b:"Palabras comunes sin significado (el, de, la)",c:"Errores de texto",correct:"b",exp:"Palabras muy frecuentes que no aportan significado."},
                   {q:"Stemming reduce palabras a?",a:"Sinonimos",b:"Su raiz",c:"Mayusculas",correct:"b",exp:"Stemming corta sufijos para obtener la raiz."},
                   {q:"Por que convertir texto a numeros?",a:"Por estetica",b:"Las maquinas solo procesan numeros",c:"Para ahorrar espacio",correct:"b",exp:"Los modelos de ML operan con vectores numericos."}]
          },
          { title: "Bag of Words y TF-IDF",
            theory: "# Vectorizacion de Texto\n\n## Bag of Words (BoW)\nCuenta frecuencia de cada palabra.\n```python\nfrom sklearn.feature_extraction.text import CountVectorizer\n\nvec = CountVectorizer(max_features=5000)\nX_bow = vec.fit_transform(textos)\n```\nLimitacion: no captura importancia relativa.\n\n## TF-IDF\nPondera palabras por importancia relativa en el documento vs corpus.\n```python\nfrom sklearn.feature_extraction.text import TfidfVectorizer\n\ntfidf = TfidfVectorizer(max_features=5000, ngram_range=(1,2))\nX_tfidf = tfidf.fit_transform(textos)\n```\n\n- **TF:** frecuencia en el documento\n- **IDF:** inversa de frecuencia en todos los documentos\n- Palabras unicas al documento tienen TF-IDF alto\n\n## ngrams\n```python\n# bigrams: \"machine learning\", \"deep learning\"\nngram_range=(1,2)  # unigrams + bigrams\n```\n\nTF-IDF es el estandar para representar texto en ML clasico. Los LLMs modernos usan embeddings, pero TF-IDF sigue siendo util y rapido.",
            quiz: [{q:"Que mide TF-IDF?",a:"Frecuencia absoluta",b:"Importancia relativa de palabras",c:"Longitud del texto",correct:"b",exp:"Pondera frecuencia local vs frecuencia global."},
                   {q:"Un bigram es?",a:"Una palabra",b:"Par de palabras consecutivas",c:"Dos documentos",correct:"b",exp:"ngram de 2 palabras, ej: 'machine learning'."},
                   {q:"TF-IDF alto significa que la palabra es?",a:"Comun en todos los documentos",b:"Unica e importante en ese documento",c:"Un stopword",correct:"b",exp:"Alta frecuencia local + baja frecuencia global = importante."}]
          },
          { title: "Clasificacion de texto y analisis de sentimiento",
            theory: "# Clasificacion de Texto\n\nAsignar categorias a documentos automaticamente.\n\n## Pipeline completo\n```python\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.naive_bayes import MultinomialNB\n\npipeline = Pipeline([\n    ('tfidf', TfidfVectorizer(max_features=10000)),\n    ('clf', MultinomialNB())\n])\n\npipeline.fit(X_train, y_train)\nprint(pipeline.score(X_test, y_test))\n```\n\n## Analisis de Sentimiento\n```python\n# Con transformers (modelos pre-entrenados)\nfrom transformers import pipeline\n\nsentiment = pipeline('sentiment-analysis', model='nlptown/bert-base-multilingual-uncased-sentiment')\nresult = sentiment('Este producto es excelente')\n```\n\n## Aplicaciones\n- Clasificar emails (spam/no spam)\n- Analizar resenas de productos\n- Categorizar tickets de soporte\n- Monitorear redes sociales\n\nNaive Bayes es sorprendentemente efectivo para texto. Para precision maxima, usa modelos transformer pre-entrenados.",
            quiz: [{q:"Naive Bayes funciona bien para?",a:"Imagenes",b:"Clasificacion de texto",c:"Series temporales",correct:"b",exp:"Naive Bayes es clasico y efectivo para texto."},
                   {q:"Que libreria tiene modelos pre-entrenados de NLP?",a:"Scikit-learn",b:"Transformers (HuggingFace)",c:"NumPy",correct:"b",exp:"HuggingFace Transformers tiene miles de modelos NLP."},
                   {q:"Pipeline de sklearn permite?",a:"Crear pipelines de datos",b:"Encadenar transformaciones y modelo",c:"Conectar APIs",correct:"b",exp:"Pipeline encadena preprocesamiento + modelo en un objeto."}]
          },
          { title: "Introduccion a LLMs y APIs de IA",
            theory: "# LLMs y APIs de IA\n\nLos Large Language Models han revolucionado NLP.\n\n## Que son LLMs\nModelos con miles de millones de parametros entrenados en texto masivo. Entienden contexto, generan texto, traducen, resumen y razonan.\n\n## APIs principales\n```python\n# OpenAI (GPT-4)\nimport openai\nresponse = openai.chat.completions.create(\n    model='gpt-4',\n    messages=[{'role':'user','content':'Explica ML en 3 oraciones'}]\n)\n\n# Google (Gemini)\nimport google.generativeai as genai\nmodel = genai.GenerativeModel('gemini-pro')\nresponse = model.generate_content('Explica ML')\n```\n\n## Prompt Engineering para LLMs\n- Ser especifico y dar contexto\n- Usar ejemplos (few-shot)\n- Pedir formato de output\n- Chain of thought: \"Piensa paso a paso\"\n\n## Costos aproximados (2026)\n- GPT-4o: $2.50 / 1M tokens input\n- Gemini Flash: $0.10 / 1M tokens\n- Claude Haiku: $0.25 / 1M tokens\n\nLos LLMs son herramientas, no reemplazos. Saber cuando y como usarlos es una habilidad clave.",
            quiz: [{q:"Que son los LLMs?",a:"Bases de datos",b:"Modelos masivos de lenguaje",c:"Lenguajes de programacion",correct:"b",exp:"Large Language Models, entrenados en texto masivo."},
                   {q:"Que es prompt engineering?",a:"Programar IA",b:"Disenar instrucciones efectivas para LLMs",c:"Entrenar modelos",correct:"b",exp:"El arte de comunicarse efectivamente con LLMs."},
                   {q:"Cual es el modelo mas economico listado?",a:"GPT-4o",b:"Gemini Flash",c:"Claude Haiku",correct:"b",exp:"Gemini Flash a $0.10/1M tokens es el mas barato."}]
          }
        ]
      }
    ]
  },
  {
    number: 3, name: "Mes 3: Proyecto Final y Portafolio", level: "integration",
    subjects: [
      {
        code: "BOOT-OPS3", name: "MLOps Basico", slug: "bootcamp-mlops-basico",
        description: "Despliegue de modelos ML en produccion",
        sessions: [
          { title: "Serializar modelos y crear APIs con FastAPI",
            theory: "# De Notebook a Produccion\n\nUn modelo en Jupyter no genera valor. Necesita estar en produccion.\n\n## Serializar modelos\n```python\nimport joblib\n\n# Guardar modelo entrenado\njoblib.dump(modelo, 'modelo_prediccion.pkl')\n\n# Cargar modelo\nmodelo = joblib.load('modelo_prediccion.pkl')\n```\n\n## API con FastAPI\n```python\nfrom fastapi import FastAPI\nimport joblib\nimport numpy as np\n\napp = FastAPI()\nmodelo = joblib.load('modelo.pkl')\n\n@app.post('/predict')\nasync def predict(data: dict):\n    features = np.array(data['features']).reshape(1, -1)\n    prediction = modelo.predict(features)\n    return {'prediction': prediction[0].tolist()}\n```\n\n## Ejecutar\n```bash\npip install fastapi uvicorn\nuvicorn main:app --reload\n```\n\nFastAPI genera documentacion automatica en /docs. Es el framework mas rapido de Python para APIs y el preferido para ML.",
            quiz: [{q:"Que hace joblib.dump()?",a:"Entrena modelo",b:"Guarda modelo a disco",c:"Carga datos",correct:"b",exp:"Serializa el modelo entrenado a un archivo .pkl."},
                   {q:"FastAPI genera documentacion en?",a:"/help",b:"/docs",c:"/api",correct:"b",exp:"FastAPI genera Swagger UI automaticamente en /docs."},
                   {q:"Por que servir un modelo como API?",a:"Es mas lento",b:"Cualquier app puede consumirlo",c:"Es obligatorio",correct:"b",exp:"Una API permite que cualquier sistema use el modelo."}]
          },
          { title: "Docker y contenedores para ML",
            theory: "# Docker para ML\n\nEmpaquetar modelo + dependencias en contenedor reproducible.\n\n## Dockerfile\n```dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n```\n\n## Comandos esenciales\n```bash\n# Construir imagen\ndocker build -t mi-modelo .\n\n# Ejecutar contenedor\ndocker run -p 8000:8000 mi-modelo\n\n# Ver contenedores\ndocker ps\n```\n\n## docker-compose.yml\n```yaml\nservices:\n  api:\n    build: .\n    ports:\n      - \"8000:8000\"\n    volumes:\n      - ./models:/app/models\n```\n\nDocker elimina el \"en mi maquina funciona\". Garantiza que tu modelo funcione igual en desarrollo, staging y produccion.",
            quiz: [{q:"Que resuelve Docker?",a:"Velocidad del modelo",b:"Reproducibilidad del entorno",c:"Precision del modelo",correct:"b",exp:"Empaqueta codigo + dependencias en contenedor identico."},
                   {q:"Que archivo define la imagen Docker?",a:"docker-compose.yml",b:"Dockerfile",c:"requirements.txt",correct:"b",exp:"Dockerfile tiene las instrucciones para construir la imagen."},
                   {q:"docker run -p 8000:8000 hace?",a:"Construye imagen",b:"Mapea puerto 8000 del contenedor al host",c:"Detiene contenedor",correct:"b",exp:"-p mapea puertos entre host y contenedor."}]
          },
          { title: "Git, GitHub y versionamiento de codigo ML",
            theory: "# Git y GitHub para ML\n\nControl de versiones es obligatorio en todo proyecto profesional.\n\n## Git basico\n```bash\ngit init\ngit add .\ngit commit -m \"feat: modelo v1 con accuracy 92%\"\ngit push origin main\n```\n\n## Branching\n```bash\ngit checkout -b feature/nuevo-modelo\n# ... trabajar ...\ngit commit -m \"feat: agregar XGBoost\"\ngit push origin feature/nuevo-modelo\n# Crear Pull Request en GitHub\n```\n\n## .gitignore para ML\n```\ndata/*.csv\nmodels/*.pkl\n.env\n__pycache__/\n*.ipynb_checkpoints\nvenv/\n```\n\n## Versionamiento de modelos\n```bash\n# DVC (Data Version Control)\npip install dvc\ndvc init\ndvc add models/modelo.pkl\ngit add models/modelo.pkl.dvc\n```\n\nNunca subas datos grandes ni modelos a Git directamente. Usa DVC o Git LFS. Commits descriptivos con prefijos: feat:, fix:, docs:, refactor:.",
            quiz: [{q:"Que NO debes subir a Git en ML?",a:"Codigo Python",b:"Datos grandes y modelos .pkl",c:"requirements.txt",correct:"b",exp:"Datos y modelos van en DVC o storage, no en Git."},
                   {q:"DVC se usa para?",a:"Desplegar modelos",b:"Versionar datos y modelos grandes",c:"Crear APIs",correct:"b",exp:"Data Version Control versiona datos como Git versiona codigo."},
                   {q:"Prefijo 'feat:' en commit indica?",a:"Bug fix",b:"Nueva funcionalidad",c:"Documentacion",correct:"b",exp:"feat: indica una nueva funcionalidad o feature."}]
          },
          { title: "CI/CD y monitoreo de modelos",
            theory: "# CI/CD y Monitoreo\n\nAutomatizar pruebas, despliegue y vigilar modelos en produccion.\n\n## GitHub Actions (CI/CD)\n```yaml\n# .github/workflows/ml-pipeline.yml\nname: ML Pipeline\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: pip install -r requirements.txt\n      - run: pytest tests/\n      - run: python train.py\n      - run: python evaluate.py\n```\n\n## Monitoreo en produccion\n- **Data drift:** distribucion de datos cambia\n- **Model drift:** performance degrada con el tiempo\n- **Latencia:** tiempo de respuesta de la API\n\n## Herramientas\n- MLflow: tracking de experimentos\n- Evidently AI: deteccion de drift\n- Prometheus + Grafana: metricas de API\n\n## Re-entrenamiento\nProgramar re-entrenamiento periodico cuando el drift supera umbral. Un modelo que no se actualiza se vuelve obsoleto.\n\nMLOps es la diferencia entre un proyecto de bootcamp y un producto real.",
            quiz: [{q:"Que es data drift?",a:"Datos se pierden",b:"Distribucion de datos cambia vs entrenamiento",c:"Datos se duplican",correct:"b",exp:"Datos nuevos difieren de los de entrenamiento."},
                   {q:"GitHub Actions automatiza?",a:"Hosting",b:"CI/CD pipelines",c:"Storage",correct:"b",exp:"Ejecuta tests, entrenamiento y deploy automaticamente."},
                   {q:"MLflow se usa para?",a:"Crear APIs",b:"Tracking de experimentos ML",c:"Version control",correct:"b",exp:"MLflow registra parametros, metricas y modelos."}]
          }
        ]
      },
      {
        code: "BOOT-CAP3", name: "Proyecto Capstone", slug: "bootcamp-proyecto-capstone",
        description: "Proyecto de Machine Learning end-to-end",
        sessions: [
          { title: "Definicion del problema y recopilacion de datos",
            theory: "# Capstone: Definicion del Problema\n\n## Elegir proyecto\nEl proyecto debe resolver un problema real. Ideas:\n- Predictor de precios de inmuebles en Ecuador\n- Clasificador de sentimiento en resenas\n- Sistema de recomendacion de productos\n- Detector de fraude en transacciones\n- Chatbot especializado con RAG\n\n## Framework de definicion\n1. **Problema:** Que quieres resolver?\n2. **Datos:** De donde vienen? Son accesibles?\n3. **Metrica:** Como mides exito?\n4. **Impacto:** Quien se beneficia?\n5. **Scope:** Que es alcanzable en 2 semanas?\n\n## Fuentes de datos\n- Kaggle (datasets publicos)\n- APIs publicas (Twitter, weather, finance)\n- Web scraping (con etica)\n- Datos propios o sinteticos\n\n## Entregable\nDocumento de 1 pagina con: problema, datos, metrica, plan de 2 semanas. Validar con mentor antes de empezar.\n\nEl proyecto Capstone es lo que muestras en entrevistas. Elije algo que te apasione.",
            quiz: [{q:"Que debe resolver un buen proyecto Capstone?",a:"Un ejercicio academico",b:"Un problema real",c:"Un tutorial",correct:"b",exp:"Problemas reales demuestran impacto a empleadores."},
                   {q:"Que es lo primero al definir el proyecto?",a:"Elegir modelo",b:"Definir el problema claramente",c:"Recopilar datos",correct:"b",exp:"Sin problema claro, no hay direccion."},
                   {q:"Cuanto tiempo hay para el Capstone?",a:"1 semana",b:"2 semanas",c:"1 mes",correct:"b",exp:"2 semanas para un proyecto end-to-end."}]
          },
          { title: "Desarrollo del modelo y experimentacion",
            theory: "# Capstone: Desarrollo del Modelo\n\n## Estructura del repositorio\n```\nmi-capstone/\n  data/\n    raw/\n    processed/\n  notebooks/\n    01_eda.ipynb\n    02_modeling.ipynb\n  src/\n    data.py\n    model.py\n    api.py\n  models/\n  tests/\n  requirements.txt\n  Dockerfile\n  README.md\n```\n\n## Experimentacion sistematica\n```python\nimport mlflow\n\nmlflow.set_experiment('capstone')\n\nwith mlflow.start_run(run_name='xgboost_v1'):\n    modelo = XGBClassifier(n_estimators=100)\n    modelo.fit(X_train, y_train)\n    score = accuracy_score(y_test, modelo.predict(X_test))\n    mlflow.log_param('n_estimators', 100)\n    mlflow.log_metric('accuracy', score)\n    mlflow.sklearn.log_model(modelo, 'model')\n```\n\n## Checklist\n- [ ] EDA completo con insights\n- [ ] Minimo 3 modelos comparados\n- [ ] Hyperparameter tuning del mejor\n- [ ] Metricas documentadas\n- [ ] Codigo limpio y modular",
            quiz: [{q:"Cuantos modelos minimo debes comparar?",a:"1",b:"3",c:"10",correct:"b",exp:"Comparar minimo 3 para justificar la eleccion."},
                   {q:"Donde van los datos crudos en el proyecto?",a:"src/",b:"data/raw/",c:"models/",correct:"b",exp:"data/raw/ para datos originales, data/processed/ para limpios."},
                   {q:"MLflow registra?",a:"Solo modelos",b:"Parametros, metricas y modelos",c:"Solo metricas",correct:"b",exp:"Tracking completo de cada experimento."}]
          },
          { title: "Despliegue y presentacion del proyecto",
            theory: "# Capstone: Despliegue y Presentacion\n\n## Despliegue en la nube\n```bash\n# Opcion 1: Railway (gratis)\nrailway login\nrailway init\nrailway up\n\n# Opcion 2: Render\n# Conectar repo GitHub → auto-deploy\n\n# Opcion 3: HuggingFace Spaces\n# Subir Gradio app para demo interactiva\n```\n\n## Gradio para demo\n```python\nimport gradio as gr\n\ndef predict(feature1, feature2):\n    prediction = modelo.predict([[feature1, feature2]])\n    return f\"Prediccion: {prediction[0]}\"\n\ndemo = gr.Interface(fn=predict, inputs=[\"number\", \"number\"], outputs=\"text\")\ndemo.launch()\n```\n\n## Presentacion (5 minutos)\n1. Problema y por que importa (30s)\n2. Datos y EDA (1 min)\n3. Modelado y resultados (2 min)\n4. Demo en vivo (1 min)\n5. Learnings y mejoras futuras (30s)\n\nLa demo en vivo es lo que impresiona. Un modelo desplegado vale 10x un notebook.",
            quiz: [{q:"Que herramienta crea demos interactivas rapido?",a:"Flask",b:"Gradio",c:"Django",correct:"b",exp:"Gradio crea interfaces de demo con pocas lineas."},
                   {q:"Cuanto debe durar la presentacion?",a:"2 minutos",b:"5 minutos",c:"15 minutos",correct:"b",exp:"5 minutos concisos con demo en vivo."},
                   {q:"Un modelo desplegado vale cuanto vs notebook?",a:"2x",b:"5x",c:"10x",correct:"c",exp:"Deployment demuestra habilidades de produccion real."}]
          },
          { title: "Code review, feedback y mejoras",
            theory: "# Code Review y Mejoras Finales\n\n## Checklist final del proyecto\n- [ ] README.md completo con instrucciones\n- [ ] requirements.txt con versiones fijas\n- [ ] Codigo documentado (docstrings)\n- [ ] Tests basicos (pytest)\n- [ ] .gitignore configurado\n- [ ] Demo funcional online\n- [ ] Presentacion preparada\n\n## Code Review entre pares\nCada estudiante revisa el proyecto de otro:\n1. Clonar el repo\n2. Seguir instrucciones del README\n3. Ejecutar el codigo\n4. Evaluar: claridad, estructura, metricas, documentacion\n5. Dar feedback constructivo (2 cosas buenas + 2 mejoras)\n\n## Mejoras post-review\n- Refactorizar codigo segun feedback\n- Agregar tests si faltan\n- Mejorar documentacion\n- Optimizar modelo si hay tiempo\n\n## Publicar\nSubir repo a GitHub publico con README profesional. Agregar link a LinkedIn.\n\nEl code review es practica profesional real. En la industria, nada se despliega sin revision.",
            quiz: [{q:"Que debe tener un README profesional?",a:"Solo titulo",b:"Instrucciones de instalacion y uso",c:"Solo screenshots",correct:"b",exp:"README debe permitir que alguien reproduzca tu proyecto."},
                   {q:"Cuantas cosas buenas dar en code review?",a:"0",b:"1",c:"2",correct:"c",exp:"2 cosas buenas + 2 mejoras = feedback constructivo."},
                   {q:"Donde publicar el proyecto final?",a:"Solo local",b:"GitHub publico + LinkedIn",c:"Solo email",correct:"b",exp:"GitHub publico para empleadores, LinkedIn para visibilidad."}]
          }
        ]
      },
      {
        code: "BOOT-POR3", name: "Portafolio Profesional", slug: "bootcamp-portafolio-profesional",
        description: "Construye tu portafolio de Data Science/ML",
        sessions: [
          { title: "GitHub como portafolio profesional",
            theory: "# GitHub como Portafolio\n\nTu GitHub es tu CV tecnico. Reclutadores lo revisan.\n\n## Perfil optimizado\n- Foto profesional\n- Bio clara: \"Data Scientist | ML Engineer | Python\"\n- README de perfil con stats y proyectos destacados\n- Pinned repos: tus 6 mejores proyectos\n\n## README de perfil\n```markdown\n# Hola, soy [Nombre]\nData Scientist graduado del Bootcamp IA de ITSEIA\n\n## Proyectos destacados\n- [Predictor de precios](link) - XGBoost, FastAPI, Docker\n- [NLP Sentiment](link) - BERT, HuggingFace, Gradio\n- [Segmentacion Clientes](link) - K-Means, PCA, Seaborn\n\n## Tech Stack\nPython | Pandas | Scikit-learn | TensorFlow | Docker | FastAPI\n```\n\n## Cada repo debe tener\n1. README con descripcion, screenshots, instrucciones\n2. Codigo limpio y documentado\n3. requirements.txt\n4. Demo link (si aplica)\n\nCalidad > cantidad. 3 proyectos excelentes > 10 mediocres.",
            quiz: [{q:"Cuantos repos pinned puedes tener en GitHub?",a:"3",b:"6",c:"10",correct:"b",exp:"GitHub permite fijar 6 repositorios en tu perfil."},
                   {q:"Que revisan los reclutadores en GitHub?",a:"Solo seguidores",b:"Proyectos, codigo y documentacion",c:"Solo estrellas",correct:"b",exp:"Calidad de codigo, README y consistencia de commits."},
                   {q:"Calidad o cantidad de proyectos?",a:"Cantidad",b:"Calidad",c:"No importa",correct:"b",exp:"3 proyectos excelentes impresionan mas que 10 mediocres."}]
          },
          { title: "LinkedIn y marca personal tech",
            theory: "# LinkedIn para Data Scientists\n\nLinkedIn es donde te encuentran los reclutadores.\n\n## Perfil optimizado\n- **Headline:** Data Scientist | ML Engineer (no \"buscando empleo\")\n- **About:** 3 parrafos: quien eres, que sabes, que buscas\n- **Experiencia:** incluir bootcamp como educacion\n- **Skills:** Python, Machine Learning, TensorFlow, SQL, Docker\n\n## Contenido que atrae reclutadores\n- Compartir proyectos con screenshots\n- Escribir posts sobre lo que aprendiste\n- Comentar en publicaciones de IA/ML\n- Publicar articulos tecnicos\n\n## Networking\n- Conectar con Data Scientists en Ecuador y LATAM\n- Seguir empresas de tecnologia\n- Unirse a grupos de ML/AI\n- Participar en webinars y comentar\n\n## Template de post\n\"Acabo de completar un proyecto de [tema]: [1 oracion de resultado]. El mayor aprendizaje fue [insight]. Link al repo: [GitHub]\"\n\nPublicar 1 post por semana durante 3 meses te posiciona como referente junior.",
            quiz: [{q:"Que NO poner en el headline de LinkedIn?",a:"Data Scientist",b:"Buscando empleo",c:"ML Engineer",correct:"b",exp:"Headline debe mostrar valor, no necesidad."},
                   {q:"Con que frecuencia publicar en LinkedIn?",a:"Diario",b:"1 vez por semana",c:"1 vez al mes",correct:"b",exp:"1 post semanal mantiene visibilidad sin saturar."},
                   {q:"Que tipo de contenido atrae reclutadores?",a:"Memes",b:"Proyectos con resultados",c:"Quejas del mercado",correct:"b",exp:"Proyectos reales con resultados demuestran competencia."}]
          },
          { title: "Kaggle y competencias de ML",
            theory: "# Kaggle: Competencias de ML\n\nKaggle es la plataforma de competencias de Data Science mas grande.\n\n## Empezar\n1. Crear cuenta en kaggle.com\n2. Completar competencias de aprendizaje (Titanic, House Prices)\n3. Subir notebooks publicos\n4. Participar en competencias activas\n\n## Estructura de competencia\n```python\n# 1. Cargar datos\ntrain = pd.read_csv('/kaggle/input/train.csv')\ntest = pd.read_csv('/kaggle/input/test.csv')\n\n# 2. EDA y Feature Engineering\n# 3. Modelar (XGBoost + LightGBM ensemble)\n# 4. Predecir\npredictions = modelo.predict(test_features)\n\n# 5. Submission\nsubmission = pd.DataFrame({'Id': test['Id'], 'Target': predictions})\nsubmission.to_csv('submission.csv', index=False)\n```\n\n## Rankings\n- Novice → Contributor → Expert → Master → Grandmaster\n- Expert con 2 medallas de bronce en competencias\n\nKaggle Expert en tu CV te pone por encima del 95% de candidatos junior. Las empresas lo reconocen.",
            quiz: [{q:"Cual es la primera competencia recomendada en Kaggle?",a:"House Prices",b:"Titanic",c:"Digit Recognizer",correct:"b",exp:"Titanic es la competencia introductoria clasica."},
                   {q:"Que ranking necesitas para ser Expert?",a:"Solo participar",b:"2 medallas de bronce",c:"1 medalla de oro",correct:"b",exp:"Expert requiere 2 medallas de bronce en competencias."},
                   {q:"Kaggle Expert te pone por encima del?",a:"50% de candidatos",b:"80% de candidatos",c:"95% de candidatos",correct:"c",exp:"Es una distincion reconocida por la industria."}]
          },
          { title: "Estrategia de busqueda de empleo en IA",
            theory: "# Busqueda de Empleo en IA/ML\n\nEstrategia sistematica para conseguir tu primer rol.\n\n## Roles target (junior)\n- Junior Data Scientist\n- ML Engineer Junior\n- Data Analyst con Python\n- AI/ML Intern\n\n## Donde buscar\n- LinkedIn Jobs (filtrar: remote, LATAM)\n- Wellfound (startups)\n- Remote OK / We Work Remotely\n- Empresas ecuatorianas: Kruger, Thoughtworks, Banco Pichincha\n\n## CV de 1 pagina\n- Nombre y contacto (GitHub, LinkedIn)\n- Resumen: 2 lineas\n- Skills tecnicos: Python, ML, SQL, Docker\n- Proyectos (3): nombre, tech stack, resultado\n- Educacion: Bootcamp IA ITSEIA\n- Certificaciones: Kaggle, Coursera, etc.\n\n## Preparacion entrevistas\n- SQL: JOINs, subqueries, window functions\n- Python: Pandas, NumPy, Scikit-learn\n- ML: bias-variance, overfitting, metricas\n- Comunicacion: explicar modelo a no-tecnicos\n\nAplicar a 5-10 posiciones por semana. El primer empleo en datos es el mas dificil. Despues, las oportunidades se multiplican.",
            quiz: [{q:"Cuantas posiciones aplicar por semana?",a:"1-2",b:"5-10",c:"20+",correct:"b",exp:"5-10 es ritmo sostenible con aplicaciones de calidad."},
                   {q:"Cuantas paginas debe tener el CV?",a:"1",b:"2",c:"3",correct:"a",exp:"1 pagina es el estandar para roles junior."},
                   {q:"Que incluir en la seccion de proyectos del CV?",a:"Solo nombre",b:"Nombre, tech stack y resultado",c:"Codigo completo",correct:"b",exp:"Resultado medible demuestra impacto."}]
          }
        ]
      },
      {
        code: "BOOT-LAB3", name: "Preparacion Laboral", slug: "bootcamp-preparacion-laboral",
        description: "Soft skills, entrevistas tecnicas y plan de carrera",
        sessions: [
          { title: "Entrevistas tecnicas de ML",
            theory: "# Entrevistas Tecnicas de ML\n\n## Preguntas clasicas\n1. Explica bias-variance tradeoff\n2. Diferencia entre L1 y L2 regularizacion\n3. Que es overfitting y como prevenirlo\n4. Cuando usar Random Forest vs XGBoost\n5. Explica precision vs recall\n\n## Coding challenges\n```python\n# Tipico: implementar train/test split manual\ndef train_test_split(X, y, test_size=0.2):\n    n = len(X)\n    indices = np.random.permutation(n)\n    split = int(n * (1 - test_size))\n    return X[indices[:split]], X[indices[split:]], \\\n           y[indices[:split]], y[indices[split:]]\n```\n\n## Take-home assignments\n- Dataset + problema + 48-72 horas\n- Entregar notebook limpio\n- Incluir EDA, modelado, evaluacion\n- README con instrucciones\n\n## Tips\n- Pensar en voz alta\n- Preguntar clarificaciones\n- Empezar simple, iterar\n- Explicar trade-offs de tus decisiones",
            quiz: [{q:"Que es bias-variance tradeoff?",a:"Elegir modelo rapido vs lento",b:"Balance entre modelo simple y complejo",c:"Datos de train vs test",correct:"b",exp:"Alto bias = underfitting, alta varianza = overfitting."},
                   {q:"Cuanto tiempo dan para take-home?",a:"2 horas",b:"48-72 horas",c:"1 semana",correct:"b",exp:"Tipicamente 2-3 dias para completar."},
                   {q:"Primer paso en un coding challenge?",a:"Codear rapido",b:"Preguntar clarificaciones",c:"Buscar en Google",correct:"b",exp:"Entender el problema antes de resolverlo."}]
          },
          { title: "SQL para Data Science",
            theory: "# SQL para Data Scientists\n\nSQL es obligatorio. No hay entrevista sin SQL.\n\n## Queries esenciales\n```sql\n-- Aggregaciones\nSELECT department, AVG(salary), COUNT(*)\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > 50000;\n\n-- JOINs\nSELECT o.id, c.name, o.total\nFROM orders o\nJOIN customers c ON o.customer_id = c.id;\n\n-- Subqueries\nSELECT name FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);\n\n-- Window Functions\nSELECT name, salary,\n  RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as rank\nFROM employees;\n```\n\n## Conceptos clave\n- **JOIN types:** INNER, LEFT, RIGHT, FULL\n- **GROUP BY + HAVING:** filtrar agregaciones\n- **Window Functions:** calculos sobre particiones\n- **CTEs:** WITH clause para queries legibles\n\nPractica en: LeetCode SQL, HackerRank SQL, Mode Analytics.",
            quiz: [{q:"Que hace HAVING vs WHERE?",a:"Son iguales",b:"HAVING filtra despues de GROUP BY",c:"WHERE es mas nuevo",correct:"b",exp:"WHERE filtra filas, HAVING filtra grupos."},
                   {q:"LEFT JOIN retorna?",a:"Solo coincidencias",b:"Todo de la izquierda + coincidencias",c:"Todo de ambas",correct:"b",exp:"Todas las filas de la tabla izquierda."},
                   {q:"Window Functions se usan con?",a:"GROUP BY",b:"OVER (PARTITION BY)",c:"WHERE",correct:"b",exp:"OVER define la ventana de calculo."}]
          },
          { title: "Comunicacion tecnica y storytelling con datos",
            theory: "# Comunicacion Tecnica\n\nSaber comunicar resultados es tan importante como obtenerlos.\n\n## Framework STAR para respuestas\n- **Situacion:** contexto del problema\n- **Tarea:** que te pidieron\n- **Accion:** que hiciste (tecnico)\n- **Resultado:** impacto medible\n\n## Presentar a no-tecnicos\n- NO: \"Use un XGBoost con 200 estimadores y learning rate 0.1\"\n- SI: \"El modelo predice con 92% de precision que clientes van a cancelar\"\n\n## Storytelling con datos\n1. Empieza con el problema de negocio\n2. Muestra datos clave (no todos)\n3. Presenta hallazgo principal\n4. Da recomendacion accionable\n5. Cierra con impacto esperado\n\n## Errores comunes\n- Mostrar demasiados graficos\n- Usar jerga tecnica con audiencia de negocio\n- No conectar analisis con decisiones\n- Slides con mucho texto\n\nEl Data Scientist que sabe comunicar tiene 3x mas impacto en la organizacion.",
            quiz: [{q:"Framework STAR es para?",a:"Codigo",b:"Estructurar respuestas profesionales",c:"Analisis de datos",correct:"b",exp:"Situacion, Tarea, Accion, Resultado."},
                   {q:"Como presentar a no-tecnicos?",a:"Con formulas",b:"Con impacto de negocio",c:"Con codigo",correct:"b",exp:"Traducir resultados tecnicos a impacto de negocio."},
                   {q:"Un DS que comunica bien tiene?",a:"2x impacto",b:"3x impacto",c:"Igual impacto",correct:"b",exp:"Comunicacion multiplica el valor del trabajo tecnico."}]
          },
          { title: "Plan de carrera y aprendizaje continuo",
            theory: "# Plan de Carrera en IA/ML\n\n## Trayectorias\n1. **Data Scientist:** analisis + modelado + comunicacion\n2. **ML Engineer:** produccion + infraestructura + escalabilidad\n3. **AI Engineer:** LLMs + aplicaciones + integracion\n4. **Data Engineer:** pipelines + warehousing + ETL\n\n## Roadmap 12 meses post-bootcamp\n- **Meses 1-3:** primer empleo o freelance, SQL avanzado\n- **Meses 4-6:** especializacion (DL, NLP, o MLOps)\n- **Meses 7-9:** contribuir a open source, Kaggle Expert\n- **Meses 10-12:** hablar en meetups, mentorear a juniors\n\n## Recursos de aprendizaje continuo\n- fast.ai (Deep Learning practico, gratis)\n- Papers With Code (estado del arte)\n- Arxiv Sanity (papers filtrados)\n- Full Stack Deep Learning (MLOps)\n- 3Blue1Brown (matematicas visuales)\n\n## Salarios Ecuador 2026 (referencia)\n- Junior: $800-1,500/mes\n- Mid: $1,500-3,000/mes\n- Senior: $3,000-6,000/mes\n- Remoto internacional: $3,000-8,000/mes\n\nEl campo de IA crece 40% anual. La demanda supera la oferta 10:1 en Ecuador.",
            quiz: [{q:"Diferencia entre Data Scientist y ML Engineer?",a:"Son iguales",b:"DS modela, MLE pone en produccion",c:"MLE no programa",correct:"b",exp:"DS enfocado en analisis, MLE en infraestructura y deploy."},
                   {q:"Recurso gratis para Deep Learning practico?",a:"Coursera",b:"fast.ai",c:"Udemy",correct:"b",exp:"fast.ai es el mejor recurso gratuito de DL practico."},
                   {q:"Relacion demanda/oferta de IA en Ecuador?",a:"1:1",b:"5:1",c:"10:1",correct:"c",exp:"10 plazas por cada profesional disponible."}]
          }
        ]
      }
    ]
  }
];

// ============================================
// MAIN EXECUTION
// ============================================

let stats = { programs: 0, semesters: 0, subjects: 0, sessions: 0, quizzes: 0, questions: 0, errors: 0 };

async function main() {
  console.log("=== BOOTCAMP IA INTENSIVO — Cargando a Supabase ===\n");

  // 1. Create program
  console.log("1. Creando programa...");
  let program;
  try {
    program = await post(BASE + "/programs", {
      name: "Bootcamp IA Intensivo",
      slug: "bootcamp-ia-intensivo",
      description: "Programa intensivo de 3 meses para dominar IA y Machine Learning desde cero hasta proyecto en produccion. Incluye Python, ML, Deep Learning, NLP, MLOps y portafolio profesional.",
      type: "bootcamp",
      price: 497,
      duration_months: 3,
      is_active: true,
      total_semesters: 3
    });
    stats.programs++;
    console.log("   Programa: " + program.id);
  } catch (e) {
    console.log("   ERROR programa: " + e.message);
    stats.errors++;
    process.exit(1);
  }

  // 2. For each month (semester)
  for (const month of MONTHS) {
    console.log("\n2. Semestre: " + month.name);
    let semester;
    try {
      semester = await post(BASE + "/semesters", {
        program_id: program.id,
        number: month.number,
        name: month.name,
        level: month.level,
        is_active: true
      });
      stats.semesters++;
      console.log("   Semester: " + semester.id);
    } catch (e) {
      console.log("   ERROR semester: " + e.message);
      stats.errors++;
      continue;
    }

    // 3. For each subject in month
    for (let si = 0; si < month.subjects.length; si++) {
      const subj = month.subjects[si];
      console.log("   Materia: " + subj.name);
      let subject;
      try {
        subject = await post(BASE + "/subjects", {
          semester_id: semester.id,
          code: subj.code,
          name: subj.name,
          slug: subj.slug,
          description: subj.description,
          credit_hours: 3,
          hours_docencia: 12,
          hours_practica: 16,
          hours_autonomo: 8,
          hours_total: 36,
          order_index: si + 1,
          is_active: true
        });
        stats.subjects++;
      } catch (e) {
        console.log("     ERROR subject: " + e.message);
        stats.errors++;
        continue;
      }

      // 4. For each session in subject
      for (let sei = 0; sei < subj.sessions.length; sei++) {
        const sess = subj.sessions[sei];
        try {
          const session = await post(BASE + "/sessions", {
            subject_id: subject.id,
            number: sei + 1,
            title: sess.title,
            theory_markdown: sess.theory,
            estimated_duration_minutes: 90,
            order_index: sei + 1,
            is_active: true
          });
          stats.sessions++;

          // 5. Create quiz
          if (sess.quiz && sess.quiz.length > 0) {
            const quiz = await post(BASE + "/quizzes", {
              session_id: session.id,
              title: "Quiz - " + sess.title,
              pass_percentage: 70,
              max_attempts: 3,
              is_active: true
            });
            stats.quizzes++;

            for (let qi = 0; qi < sess.quiz.length; qi++) {
              const q = sess.quiz[qi];
              await postMin(BASE + "/quiz_questions", {
                quiz_id: quiz.id,
                question_text: q.q,
                question_type: "multiple_choice",
                options: JSON.stringify([
                  {id:"a",text:q.a,is_correct:q.correct==="a"},
                  {id:"b",text:q.b,is_correct:q.correct==="b"},
                  {id:"c",text:q.c,is_correct:q.correct==="c"}
                ]),
                explanation: q.exp,
                points: 1,
                order_index: qi + 1
              });
              stats.questions++;
            }
          }
          console.log("     S" + (sei+1) + " " + sess.title.substring(0,40) + " OK | Q:" + (sess.quiz ? sess.quiz.length : 0));
        } catch (e) {
          console.log("     ERR S" + (sei+1) + ": " + e.message.substring(0,80));
          stats.errors++;
        }
      }
    }
  }

  console.log("\n=== BOOTCAMP COMPLETADO ===");
  console.log("Programas: " + stats.programs);
  console.log("Semestres: " + stats.semesters);
  console.log("Materias:  " + stats.subjects);
  console.log("Sesiones:  " + stats.sessions);
  console.log("Quizzes:   " + stats.quizzes);
  console.log("Preguntas: " + stats.questions);
  console.log("Errores:   " + stats.errors);
}

main().catch(e => console.error("FATAL:", e));
