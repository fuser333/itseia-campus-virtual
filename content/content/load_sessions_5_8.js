#!/usr/bin/env node
const BASE = "https://wqlselfapnggxxeziruo.supabase.co/rest/v1";
const SKEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc";
const H = {"apikey":SKEY,"Authorization":"Bearer "+SKEY,"Content-Type":"application/json","Prefer":"return=representation"};
const Hm = {"apikey":SKEY,"Authorization":"Bearer "+SKEY,"Content-Type":"application/json","Prefer":"return=minimal"};

const sessions = [
  {subjectId:"0df94819-8ccc-499b-ae88-7ed70713295d",number:5,title:"Funciones: definicion, parametros y return",video:"https://www.youtube.com/watch?v=9Os0o3wzS_I",
   theory:"# Funciones en Python\n\nLas funciones son bloques de codigo reutilizables.\n\n```python\ndef saludar(nombre):\n    return f\"Hola, {nombre}\"\n\nresultado = saludar(\"Maria\")\n```\n\n## Parametros\n- Posicionales, con nombre, por defecto\n- *args y **kwargs para argumentos variables\n\n## Return\nRetorna valores y termina la funcion.\n\n## Funciones lambda\n```python\ndoble = lambda x: x * 2\n```",
   quiz:[{q:"Cual es la palabra clave para definir una funcion?",a:"def",b:"function",c:"func",d:"define",correct:"a",exp:"En Python se usa def."},
   {q:"Que hace return?",a:"Imprime",b:"Termina programa",c:"Devuelve valor y termina funcion",d:"Declara variable",correct:"c",exp:"return devuelve un valor."},
   {q:"Que son *args?",a:"Obligatorios",b:"Con nombre",c:"Numero variable de argumentos posicionales",d:"Errores",correct:"c",exp:"*args recibe argumentos variables como tupla."},
   {q:"Scope de variable dentro de funcion?",a:"Global",b:"Local",c:"Universal",d:"Estatico",correct:"b",exp:"Variables en funcion son locales."},
   {q:"Que es lambda?",a:"No retorna nada",b:"Funcion anonima de una expresion",c:"Se ejecuta sola",d:"Funcion de error",correct:"b",exp:"Lambda es funcion anonima."}]},
  {subjectId:"0df94819-8ccc-499b-ae88-7ed70713295d",number:6,title:"Listas y tuplas",video:"https://www.youtube.com/watch?v=W8KRzm-HUcc",
   theory:"# Listas y Tuplas\n\n## Listas (mutables)\n```python\nfrutas = [\"manzana\", \"banana\"]\nfrutas.append(\"naranja\")\n```\n\n### Slicing\n```python\nnumeros[1:4]  # sublista\nnumeros[::2]  # cada 2\n```\n\n### List Comprehension\n```python\ncuadrados = [x**2 for x in range(10)]\n```\n\n## Tuplas (inmutables)\n```python\ncoordenadas = (10.5, -3.2)\n# No se pueden modificar\n```",
   quiz:[{q:"Diferencia entre lista y tupla?",a:"Listas mas rapidas",b:"Tuplas mutables",c:"Listas mutables, tuplas no",d:"Igual",correct:"c",exp:"Listas son mutables, tuplas inmutables."},
   {q:"Como agregar al final de lista?",a:"add()",b:"append()",c:"insert()",d:"push()",correct:"b",exp:"append() agrega al final."},
   {q:"numeros[1:4] con [10,20,30,40,50]?",a:"[10,20,30]",b:"[20,30,40]",c:"[20,30,40,50]",d:"[10,20,30,40]",correct:"b",exp:"Slicing [1:4] toma indices 1,2,3."},
   {q:"Que es list comprehension?",a:"Lista especial",b:"Forma concisa de crear listas",c:"Comprimir listas",d:"Lista de funciones",correct:"b",exp:"Forma concisa con expresion en corchetes."},
   {q:"Se puede modificar una tupla?",a:"Si",b:"Solo numeros",c:"No, son inmutables",d:"Con change()",correct:"c",exp:"Las tuplas son inmutables."}]},
  {subjectId:"0df94819-8ccc-499b-ae88-7ed70713295d",number:7,title:"Diccionarios y conjuntos",video:"https://www.youtube.com/watch?v=EeMpEzOoSkU",
   theory:"# Diccionarios y Conjuntos\n\n## Diccionarios (clave-valor)\n```python\nestudiante = {\"nombre\": \"Maria\", \"edad\": 22}\nestudiante[\"carrera\"] = \"IA\"\n```\n\n## Conjuntos (elementos unicos)\n```python\nnumeros = {1, 2, 3, 3}  # {1, 2, 3}\n```\n\n### Operaciones de conjuntos\n- Union: a | b\n- Interseccion: a & b\n- Diferencia: a - b",
   quiz:[{q:"Que usa pares clave-valor?",a:"Lista",b:"Tupla",c:"Diccionario",d:"Conjunto",correct:"c",exp:"Diccionarios usan pares clave-valor."},
   {q:"Duplicado en set?",a:"Error",b:"Se agrega",c:"Se ignora",d:"Se reemplaza",correct:"c",exp:"Sets solo tienen elementos unicos."},
   {q:"Acceder a valor en dict?",a:"d(clave)",b:"d[clave]",c:"d.get_value()",d:"d->clave",correct:"b",exp:"Se usa corchetes: d[clave]."},
   {q:"Interseccion de sets retorna?",a:"Todos",b:"Solo en A",c:"Elementos comunes",d:"Solo en B",correct:"c",exp:"Interseccion retorna elementos comunes."},
   {q:"Lista como clave de dict?",a:"Si",b:"No, claves inmutables",c:"Solo numeros",d:"Solo Python 3",correct:"b",exp:"Claves deben ser inmutables."}]},
  {subjectId:"0df94819-8ccc-499b-ae88-7ed70713295d",number:8,title:"Manejo de strings y formateo",video:"https://www.youtube.com/watch?v=k9TUPpGqYTo",
   theory:"# Strings en Python\n\n## Metodos\n```python\ntexto.strip()    # quitar espacios\ntexto.lower()    # minusculas\ntexto.split(\" \") # dividir\n```\n\n## f-strings\n```python\nnombre = \"Carlos\"\nprint(f\"Hola {nombre}\")\n```\n\n## Slicing\n```python\npalabra[::-1]  # reversa\n```",
   quiz:[{q:"Metodo que quita espacios?",a:"clean()",b:"strip()",c:"trim()",d:"remove()",correct:"b",exp:"strip() elimina espacios."},
   {q:"Forma recomendada de formatear?",a:"Concatenar +",b:"format()",c:"f-strings",d:"sprintf",correct:"c",exp:"f-strings son la forma moderna."},
   {q:"\"Python\"[::-1]?",a:"Python",b:"nohtyP",c:"Error",d:"P",correct:"b",exp:"[::-1] invierte el string."},
   {q:"Que hace split()?",a:"Une",b:"Divide en lista",c:"Elimina",d:"Mayusculas",correct:"b",exp:"split() divide string en lista."},
   {q:"Como unir lista en string?",a:"concat()",b:"merge()",c:"separador.join(lista)",d:"string+list",correct:"c",exp:"join() une elementos con separador."}]},
  {subjectId:"015311e7-c0d0-4065-abbf-83ab210da384",number:5,title:"Limpieza de datos con Pandas",video:"https://www.youtube.com/watch?v=ZOX18HfLHGQ",
   theory:"# Limpieza de Datos\n\n## Datos faltantes\n```python\ndf.isnull().sum()\ndf.dropna()\ndf.fillna(df.mean())\n```\n\n## Duplicados\n```python\ndf.drop_duplicates()\n```\n\n## Pipeline\n1. Explorar\n2. Identificar nulos\n3. Estrategia\n4. Corregir tipos\n5. Validar",
   quiz:[{q:"Porcentaje de limpieza en ciencia de datos?",a:"20%",b:"50%",c:"80%",d:"100%",correct:"c",exp:"80% del tiempo es limpieza."},
   {q:"fillna(df.mean()) hace?",a:"Elimina nulos",b:"Reemplaza con media",c:"Calcula media",d:"Nueva columna",correct:"b",exp:"Reemplaza nulos con la media."},
   {q:"Eliminar duplicados?",a:"remove_duplicates()",b:"drop_duplicates()",c:"delete_dupes()",d:"unique()",correct:"b",exp:"drop_duplicates() elimina duplicados."},
   {q:"Primer paso limpieza?",a:"Eliminar nulos",b:"Tipos",c:"Explorar datos",d:"Exportar",correct:"c",exp:"Primero explorar con info() y describe()."},
   {q:"Convertir a fecha?",a:"to_date()",b:"pd.to_datetime()",c:"convert_date()",d:"make_date()",correct:"b",exp:"pd.to_datetime() convierte a datetime."}]},
  {subjectId:"015311e7-c0d0-4065-abbf-83ab210da384",number:6,title:"Estadistica descriptiva basica",video:"https://www.youtube.com/watch?v=xxpc-HPKN28",
   theory:"# Estadistica Descriptiva\n\n## Tendencia central\nmean(), median(), mode()\n\n## Dispersion\nstd(), var(), min(), max()\n\n## Describe\ndf.describe() da resumen completo\n\n## Correlacion\ndf.corr() - valores cerca de 1 o -1 indican relacion fuerte",
   quiz:[{q:"Medida robusta a outliers?",a:"Media",b:"Mediana",c:"Moda",d:"Varianza",correct:"b",exp:"La mediana no se afecta por extremos."},
   {q:"Desviacion estandar mide?",a:"Valor central",b:"Dispersion respecto a media",c:"Valor frecuente",d:"Correlacion",correct:"b",exp:"Mide la dispersion de datos."},
   {q:"df.describe() retorna?",a:"Solo media",b:"Resumen estadistico completo",c:"Tipos",d:"Primeras filas",correct:"b",exp:"Retorna count, mean, std, min, cuartiles, max."},
   {q:"Correlacion -0.9 indica?",a:"No relacion",b:"Positiva fuerte",c:"Negativa fuerte",d:"Error",correct:"c",exp:"Cerca de -1 es correlacion negativa fuerte."},
   {q:"Desviacion estandar vs varianza?",a:"Iguales",b:"Std es raiz de varianza",c:"Varianza mas precisa",d:"Varianza para texto",correct:"b",exp:"Std es la raiz cuadrada de la varianza."}]},
  {subjectId:"015311e7-c0d0-4065-abbf-83ab210da384",number:7,title:"Visualizacion con Matplotlib",video:"https://www.youtube.com/watch?v=UO98lJQ3QGI",
   theory:"# Matplotlib\n\n```python\nimport matplotlib.pyplot as plt\nplt.plot(x, y)\nplt.title(\"Grafico\")\nplt.show()\n```\n\n## Tipos\nplot(), bar(), hist(), scatter(), pie()\n\n## Subplots\n```python\nfig, axes = plt.subplots(1, 2)\n```",
   quiz:[{q:"Mejor grafico para distribucion?",a:"Linea",b:"Barras",c:"Histograma",d:"Pastel",correct:"c",exp:"Histograma muestra distribucion."},
   {q:"Multiples graficos?",a:"multi()",b:"subplots()",c:"grid()",d:"many()",correct:"b",exp:"subplots() crea cuadricula de graficos."},
   {q:"Relacion entre 2 variables?",a:"Barras",b:"Pastel",c:"Scatter",d:"Histograma",correct:"c",exp:"Scatter muestra relacion entre variables."},
   {q:"tight_layout() hace?",a:"Comprime datos",b:"Ajusta espaciado subplots",c:"Cierra figura",d:"Cuadricula",correct:"b",exp:"Ajusta margenes entre subplots."},
   {q:"Tamano de figura?",a:"size",b:"dimensions",c:"figsize",d:"scale",correct:"c",exp:"figsize=(ancho,alto) controla tamano."}]},
  {subjectId:"015311e7-c0d0-4065-abbf-83ab210da384",number:8,title:"Analisis exploratorio (EDA)",video:"https://www.youtube.com/watch?v=xi0vhXFPegw",
   theory:"# EDA\n\nProceso de investigar datos antes de modelar.\n\n## Etapas\n1. Estructura: shape, dtypes\n2. Resumen: describe()\n3. Nulos: isnull().sum()\n4. Visualizacion\n5. Correlacion\n6. Conclusiones",
   quiz:[{q:"Que es EDA?",a:"Modelo ML",b:"Investigar datos antes de modelar",c:"Base de datos",d:"Lenguaje",correct:"b",exp:"Exploratory Data Analysis."},
   {q:"Primero en EDA?",a:"Correlacion",b:"Outliers",c:"Estructura y dimensiones",d:"Predicciones",correct:"c",exp:"Primero entender estructura con shape e info()."},
   {q:"Frecuencia de valores?",a:"describe()",b:"count()",c:"value_counts()",d:"frequency()",correct:"c",exp:"value_counts() cuenta ocurrencias."},
   {q:"Grafico para outliers?",a:"Barras",b:"Boxplot",c:"Linea",d:"Pastel",correct:"b",exp:"Boxplot muestra cuartiles y outliers."},
   {q:"Importancia del EDA?",a:"No importante",b:"Impresionar",c:"Entender patrones y guiar modelado",d:"Graficos bonitos",correct:"c",exp:"EDA guia decisiones de modelado."}]},
  {subjectId:"191281b2-a3bb-4fbd-9a1d-f92443d1be3b",number:5,title:"NoSQL y bases de datos distribuidas",video:"https://www.youtube.com/watch?v=xQnIN9bW0og",
   theory:"# NoSQL\n\n## Tipos\n- Documento (MongoDB)\n- Clave-Valor (Redis)\n- Columnar (Cassandra)\n- Grafo (Neo4j)\n\n## Teorema CAP\nSolo 2 de 3: Consistencia, Disponibilidad, Tolerancia a particiones.",
   quiz:[{q:"Ventaja NoSQL para Big Data?",a:"Barata",b:"Escalabilidad horizontal",c:"Mejor SQL",d:"Antigua",correct:"b",exp:"NoSQL escala horizontalmente."},
   {q:"Base NoSQL con JSON?",a:"Clave-Valor",b:"Columnar",c:"Documento",d:"Grafo",correct:"c",exp:"MongoDB usa documentos JSON."},
   {q:"Teorema CAP dice?",a:"Todo perfecto",b:"Solo 2 de 3 propiedades",c:"Protocolo red",d:"Solo SQL",correct:"b",exp:"Solo puedes garantizar 2 de 3."},
   {q:"Base para redes sociales?",a:"MongoDB",b:"Redis",c:"Neo4j (grafo)",d:"Cassandra",correct:"c",exp:"Grafos modelan relaciones."},
   {q:"Escalabilidad horizontal?",a:"Servidor potente",b:"Agregar mas servidores",c:"Reducir datos",d:"Comprimir BD",correct:"b",exp:"Agregar nodos al cluster."}]},
  {subjectId:"191281b2-a3bb-4fbd-9a1d-f92443d1be3b",number:6,title:"Hadoop: HDFS y MapReduce",video:"https://www.youtube.com/watch?v=aReuLtY0YMI",
   theory:"# Hadoop\n\n## HDFS\nDivide archivos en bloques de 128MB.\n- NameNode: coordina\n- DataNode: almacena (3x replicacion)\n\n## MapReduce\n1. Map: emite pares clave-valor\n2. Shuffle: agrupa por clave\n3. Reduce: agrega valores",
   quiz:[{q:"Tamano bloque HDFS?",a:"1MB",b:"64MB",c:"128MB",d:"1GB",correct:"c",exp:"128MB por defecto."},
   {q:"Quien sabe donde estan bloques?",a:"DataNode",b:"NameNode",c:"TaskTracker",d:"ResourceManager",correct:"b",exp:"NameNode mantiene metadata."},
   {q:"Fases MapReduce?",a:"1",b:"2",c:"3",d:"4",correct:"c",exp:"Map, Shuffle, Reduce."},
   {q:"Copias por bloque HDFS?",a:"1",b:"2",c:"3",d:"5",correct:"c",exp:"3 replicas por defecto."},
   {q:"Fase Map hace?",a:"Agrupa",b:"Suma",c:"Emite pares clave-valor",d:"Almacena",correct:"c",exp:"Map procesa y emite pares."}]},
  {subjectId:"191281b2-a3bb-4fbd-9a1d-f92443d1be3b",number:7,title:"Apache Spark fundamentals",video:"https://www.youtube.com/watch?v=_C8kWso4ne4",
   theory:"# Apache Spark\n\n100x mas rapido que MapReduce.\n\n## RDD\nColeccion distribuida e inmutable.\n\n## DataFrame\n```python\ndf = spark.read.csv(\"datos.csv\")\ndf.filter(df.edad > 25).show()\n```\n\n## Spark SQL\n```python\nspark.sql(\"SELECT * FROM tabla\").show()\n```",
   quiz:[{q:"Spark vs MapReduce?",a:"2x",b:"10x",c:"100x",d:"1000x",correct:"c",exp:"100x mas rapido en memoria."},
   {q:"Lazy evaluation?",a:"Lento",b:"No ejecuta hasta necesitar resultado",c:"Nocturno",d:"Carga lenta",correct:"b",exp:"Ejecuta solo con acciones."},
   {q:"Que es RDD?",a:"Base de datos",b:"Coleccion distribuida inmutable",c:"Lenguaje",d:"Servidor",correct:"b",exp:"Estructura fundamental de Spark."},
   {q:"API similar a Pandas en Spark?",a:"RDD",b:"DataFrame",c:"MapReduce",d:"HDFS",correct:"b",exp:"DataFrames son similares a Pandas."},
   {q:"SQL en Spark?",a:"No",b:"Si, Spark SQL",c:"Solo comercial",d:"Solo Java",correct:"b",exp:"Spark SQL ejecuta consultas SQL."}]},
  {subjectId:"191281b2-a3bb-4fbd-9a1d-f92443d1be3b",number:8,title:"Procesamiento en la nube",video:"https://www.youtube.com/watch?v=JtzmDOGaxSc",
   theory:"# Big Data en la Nube\n\n## Proveedores\n- AWS: S3, Redshift, EMR\n- GCP: BigQuery, Dataproc\n- Azure: Synapse, HDInsight\n\n## BigQuery\nData warehouse serverless con SQL.\n\n## Arquitectura Lambda\nBatch + streaming para sistemas completos.",
   quiz:[{q:"Ventaja de nube?",a:"Gratis",b:"Sin hardware, escala elastica",c:"Mas seguro",d:"Solo Python",correct:"b",exp:"Elimina hardware y escala segun demanda."},
   {q:"BigQuery de Google?",a:"Storage",b:"Dataproc",c:"Data warehouse serverless SQL",d:"Pub/Sub",correct:"c",exp:"BigQuery analiza petabytes con SQL."},
   {q:"Arquitectura Lambda?",a:"Solo batch",b:"Solo streaming",c:"Batch + streaming",d:"Servicio AWS",correct:"c",exp:"Combina procesamiento historico y tiempo real."},
   {q:"S3 equivalente en Google?",a:"BigQuery",b:"Cloud Storage",c:"Dataproc",d:"Pub/Sub",correct:"b",exp:"Cloud Storage es el equivalente de S3."},
   {q:"Modelo de pago nube?",a:"Licencia anual",b:"Pago por uso",c:"Gratis",d:"Pago unico",correct:"b",exp:"Pay-as-you-go: pagas lo que usas."}]}
];

async function post(url, body) {
  const r = await fetch(url, {method:"POST",headers:H,body:JSON.stringify(body)});
  return {status:r.status, data:await r.json()};
}

async function main() {
  console.log("=== Cargando sesiones 5-8 (12 sesiones) ===\n");
  for (const s of sessions) {
    const {status,data} = await post(BASE+"/sessions", {
      subject_id:s.subjectId, number:s.number, title:s.title, video_url:s.video,
      theory_markdown:s.theory, order_index:s.number, estimated_duration_minutes:45, is_active:true
    });
    if (status !== 201) { console.log("  ERR S"+s.number+": "+JSON.stringify(data).substring(0,80)); continue; }
    const sid = Array.isArray(data)?data[0].id:data.id;
    let info = "  S"+s.number+" "+s.title.substring(0,35)+" OK";

    if (s.quiz && s.quiz.length > 0) {
      const {status:qs,data:qd} = await post(BASE+"/quizzes", {
        session_id:sid, title:"Quiz - "+s.title, pass_percentage:70, max_attempts:3, is_active:true
      });
      if (qs === 201) {
        const qid = Array.isArray(qd)?qd[0].id:qd.id;
        for (let i=0;i<s.quiz.length;i++) {
          const q=s.quiz[i];
          await fetch(BASE+"/quiz_questions", {method:"POST",headers:Hm,body:JSON.stringify({
            quiz_id:qid, question_text:q.q, question_type:"multiple_choice",
            options:JSON.stringify([
              {id:"a",text:q.a,is_correct:q.correct==="a"},
              {id:"b",text:q.b,is_correct:q.correct==="b"},
              {id:"c",text:q.c,is_correct:q.correct==="c"},
              {id:"d",text:q.d,is_correct:q.correct==="d"}
            ]),
            explanation:q.exp, points:1, order_index:i+1
          })});
        }
        info += " | Q:"+s.quiz.length;
      }
    }
    console.log(info);
  }
  console.log("\n=== COMPLETADO ===");
}
main().catch(e => console.error(e));
