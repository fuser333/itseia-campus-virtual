# Ejercicio Sesion 7: Documentacion Tecnica y Paper

**Materia:** Proyecto Integrador (Titulacion)
**Nivel:** Avanzado
**Herramienta IA:** Claude + ChatGPT
**Duracion:** 55 min

## Objetivo

Redactar la documentacion tecnica completa del proyecto integrador siguiendo estandares de publicacion cientifica (estructura IMRyD), aplicar normas APA 7ma edicion para citas y referencias, producir un paper legible tanto por expertos tecnicos como por tomadores de decisiones, y preparar el repositorio de codigo con documentacion reproducible.

## Contexto (Ecuador)

La documentacion es el producto final mas duradero de tu proyecto. El modelo que entrenas durara meses o años antes de requerir actualizacion. El documento de titulacion durara decadas en la biblioteca de ITSEIA y potencialmente en repositorios como LATINDEX o SciELO si decides publicarlo. Este ejercicio te enseña a escribir con el estandar de esas publicaciones.

## Instrucciones

### Parte 1 — Estructura IMRyD del documento de titulacion (10 min)

IMRyD es el estandar internacional para papers de investigacion cientifica:
- **I**ntroduccion
- **M**etodologia
- **R**esultados
- **y** (and en ingles)
- **D**iscusion

Para un proyecto de titulacion de tecnologia en Ecuador, la estructura es:

```
ESTRUCTURA DEL DOCUMENTO DE TITULACION ITSEIA

PORTADA
  - Titulo del trabajo
  - Autor(es)
  - Titulo al que opta: Tecnolo/a Superior en Inteligencia Artificial
  - Instituto: ITSEIA
  - Fecha

INDICE GENERAL
INDICE DE TABLAS
INDICE DE FIGURAS
GLOSARIO DE TERMINOS

RESUMEN (150-200 palabras)
  - Problema
  - Metodologia
  - Resultado principal (con numero)
  - Conclusion
  [Version en ingles: ABSTRACT]

CAPITULO 1: INTRODUCCION (1,500-2,000 palabras)
  1.1 Contexto y antecedentes
  1.2 Planteamiento del problema
  1.3 Justificacion e importancia
  1.4 Pregunta de investigacion
  1.5 Hipotesis
  1.6 Objetivos (general y especificos)
  1.7 Alcance y limitaciones

CAPITULO 2: MARCO TEORICO (2,000-3,000 palabras)
  2.1 Conceptos fundamentales
  2.2 Revision de literatura (los 10 papers)
  2.3 Tecnicas de ML aplicadas
  2.4 Herramientas y plataformas

CAPITULO 3: METODOLOGIA (2,000-2,500 palabras)
  3.1 Tipo de investigacion
  3.2 Descripcion del dataset
  3.3 Preprocesamiento de datos
  3.4 Modelos evaluados y justificacion
  3.5 Metricas de evaluacion
  3.6 Entorno de desarrollo

CAPITULO 4: RESULTADOS (1,500-2,000 palabras)
  4.1 Analisis exploratorio de datos
  4.2 Comparacion de modelos
  4.3 Modelo final: evaluacion completa
  4.4 Analisis de features importantes
  4.5 Analisis de equidad por subgrupos

CAPITULO 5: DISCUSION Y CONCLUSIONES (1,500-2,000 palabras)
  5.1 Interpretacion de resultados
  5.2 Comparacion con literatura previa
  5.3 Limitaciones del estudio
  5.4 Implicaciones practicas para Ecuador
  5.5 Trabajo futuro
  5.6 Conclusiones

REFERENCIAS (APA 7ma edicion)
ANEXOS
  A. Codigo fuente (fragmentos clave)
  B. Tablas adicionales
  C. Graficos complementarios
```

### Parte 2 — Redactar el Resumen con Claude (15 min)

El resumen es lo primero que lee el jurado y el 90% de quienes encuentren tu trabajo online. Un buen resumen es la inversion con mayor ROI del documento.

```
PROMPT PARA CLAUDE:
"Soy estudiante de tecnologia en IA en ITSEIA Ecuador.
Mi proyecto de titulacion tiene estos elementos:

TITULO: [TU TITULO]
PROBLEMA: [DESCRIPCION DEL PROBLEMA EN 2 ORACIONES]
DATASET: [FUENTE, TAMAÑO, PERIODO]
METODOLOGIA: Compare [ALGORITMOS] usando [METRICAS] con validacion cruzada [K]-fold
RESULTADO PRINCIPAL: El mejor modelo ([NOMBRE]) alcanzo AUC-ROC = [VALOR]
  en el conjunto de prueba, superando el baseline de [BASELINE] por [DIFERENCIA] puntos.
IMPACTO: Si se implementa, podria [IMPACTO CUANTIFICADO] para [USUARIO FINAL EN ECUADOR]

Redacta el RESUMEN del trabajo de titulacion con estas reglas:
- Exactamente 180 palabras (ni una mas, ni una menos)
- Estructura: Contexto (20%) / Problema (15%) / Metodologia (25%) / Resultados (25%) / Conclusiones (15%)
- Tono: cientifico pero accesible para un jurado que puede no ser experto en ML
- Incluir los numeros clave (AUC, tamaño de dataset, mejora porcentual)
- Terminar con una frase de impacto para Ecuador
- NO usar jerga tecnica sin explicacion

Luego redacta el ABSTRACT en ingles (misma estructura, 180 palabras)."
```

### Parte 3 — Redactar la Introduccion con estructura academica (20 min)

```
PROMPT PARA CLAUDE:
"Redacta la INTRODUCCION completa (1,800 palabras) para mi trabajo de titulacion.
La introduccion debe seguir la estructura de 'embudo invertido':
  1. Lo global (el problema a nivel mundial): 2 parrafos, ~200 palabras
  2. Lo regional (el problema en Latinoamerica): 2 parrafos, ~250 palabras
  3. Lo nacional (el problema en Ecuador con datos especificos): 3 parrafos, ~350 palabras
  4. El gap de investigacion identificado: 1 parrafo, ~150 palabras
  5. El objetivo del estudio: 1 parrafo, ~100 palabras
  6. Estructura del documento: 1 parrafo, ~100 palabras
  7. Contribution statement: 1 parrafo, ~100 palabras

Datos para usar:
[PEGA AQUI LA INFORMACION DE TU PROBLEMA, INCLUYENDO ESTADISTICAS REALES DEL INEC, MSP, ETC.]

Cita academicamente (APA 7) al menos 8 fuentes: mezcla de papers internacionales,
reportes de OPS/OMS si aplica, y datos oficiales ecuatorianos.
Para las citas de datos ecuatorianos, usa el formato:
  (Instituto Nacional de Estadistica y Censos [INEC], 2022)"
```

### Parte 4 — Repositorio reproducible en GitHub (10 min)

El codigo de tu proyecto debe ser reproducible por cualquier persona que descargue el repositorio:

**Estructura del repositorio:**
```
proyecto-titulacion-ITSEIA/
├── README.md                    # Descripcion completa con instrucciones
├── requirements.txt             # pip install -r requirements.txt
├── .gitignore                   # Excluye datos sensibles y modelos grandes
│
├── data/
│   ├── raw/                     # Datos originales (NO subir si son confidenciales)
│   │   └── README.md            # Descripcion de los datos y como obtenerlos
│   └── processed/               # Datos limpios (si no son confidenciales)
│
├── notebooks/
│   ├── 01_eda.ipynb             # Analisis exploratorio
│   ├── 02_preprocesamiento.ipynb
│   ├── 03_modelado.ipynb
│   └── 04_evaluacion.ipynb
│
├── src/
│   ├── data_pipeline.py         # Funciones de limpieza
│   ├── feature_engineering.py   # Features derivadas
│   ├── train.py                 # Script de entrenamiento
│   └── evaluate.py              # Script de evaluacion
│
├── models/
│   └── modelo_final.pkl         # Modelo serializado (si < 50MB)
│
├── results/
│   ├── figuras/                 # Todos los graficos generados
│   └── tablas/                  # Tablas de resultados en CSV
│
└── docs/
    └── documento_titulacion.pdf
```

**README.md minimo:**
```markdown
# [TITULO DEL PROYECTO]

## Autor
[Tu nombre] — Tecnologia Superior en IA — ITSEIA 2026

## Descripcion
[2 oraciones describiendo el proyecto]

## Resultado Principal
AUC-ROC: [VALOR] | Dataset: [N] registros | Algoritmo: [NOMBRE]

## Instalacion
```bash
git clone https://github.com/[tu-usuario]/[nombre-repo]
cd [nombre-repo]
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

## Reproduccion
```bash
# 1. Preparar datos
python src/data_pipeline.py

# 2. Entrenar modelo
python src/train.py

# 3. Evaluar resultados
python src/evaluate.py
```

## Estructura del Repositorio
[DESCRIBE LA ESTRUCTURA]

## Datos
[DESCRIBE EL DATASET Y COMO OBTENERLO]

## Licencia
MIT License
```

## Usa IA para...

- Pedirle a Claude que critique un parrafo de tu metodologia y lo reescriba con el nivel de precision de un journal IEEE.
- Preguntarle como citar correctamente en APA 7 un dataset publico del INEC que no tiene autor personal identificado.
- Pedirle que genere las referencias bibliograficas completas en formato APA 7 a partir de los DOIs de los papers de tu revision de literatura.

## Que aprendiste

- Que la estructura IMRyD no es burocracia — es la forma mas eficiente de comunicar investigacion cientifica.
- Que el resumen de 180 palabras es el documento mas dificil y mas importante de todo el trabajo.
- Como construir un repositorio reproducible que permite a cualquier persona replicar tus resultados exactos.
- Que la documentacion del codigo (docstrings, README) es tan importante como el codigo mismo.

## Reto extra

Envia tu resumen a la convocatoria de un congreso de informatica latinoamericano. En Ecuador existe CONISOFT; regionalmente existen IEEE LACNEM, CLEI, y JIISIC. Busca las convocatorias abiertas en 2026, descarga el template de formato de cada uno, y adapta tu paper a ese formato con Claude. Aunque no lo envies, el ejercicio de adaptacion mejorara drasticamente la calidad de tu escritura academica.
