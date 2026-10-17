# Ejercicio Sesion 7: RAG — Retrieval Augmented Generation

**Materia:** Procesamiento de Lenguaje Natural
**Nivel:** Avanzado
**Herramienta IA:** Claude
**Duracion:** 60 min

## Objetivo

Construir un sistema RAG (Retrieval Augmented Generation) completo que permita a un LLM responder preguntas precisas sobre documentos especificos sin alucinar, usando vector stores (ChromaDB o FAISS), embeddings y LangChain. El sistema consultara documentos legales ecuatorianos.

## Contexto (Ecuador)

El Servicio de Rentas Internas (SRI) del Ecuador tiene miles de paginas de reglamentos tributarios. Los contribuyentes y contadores necesitan respuestas precisas sobre el Reglamento al LORTI, las resoluciones NAC y los instructivos de IVA, Renta e ICE. Un chatbot que alucina fechas o porcentajes tributarios es un riesgo legal. RAG soluciona esto: el modelo solo responde con informacion del documento, no inventa.

## Instrucciones

1. Abre Google Colab con GPU T4. Instala:
   ```python
   !pip install langchain langchain-google-genai chromadb sentence-transformers PyPDF2 tiktoken
   from langchain.document_loaders import PyPDFLoader, TextLoader
   from langchain.text_splitter import RecursiveCharacterTextSplitter
   from langchain.embeddings import HuggingFaceEmbeddings
   from langchain.vectorstores import Chroma
   from langchain.chains import RetrievalQA
   from langchain_google_genai import ChatGoogleGenerativeAI
   ```

2. Prepara los documentos tributarios. Opcion A: descarga PDFs reales del SRI (sri.gob.ec). Opcion B: crea texto representativo:
   ```python
   documentos_sri = [
       """REGLAMENTO PARA LA APLICACION DE LA LEY DE REGIMEN TRIBUTARIO INTERNO
       Art. 1.- Cuantia para llevar contabilidad.- Las sociedades estan obligadas
       a llevar contabilidad. Las personas naturales tambien lo estan si al inicio
       del ejercicio impositivo su capital propio es superior a USD 180,000 o
       sus ingresos brutos del ejercicio anterior fueron superiores a USD 300,000...""",

       """TARIFA DEL IMPUESTO AL VALOR AGREGADO (IVA)
       Art. 65 LORTI.- Tarifa. - La tarifa del impuesto al valor agregado es del 15%.
       Se aplica una tarifa del 0% a los bienes de la canasta basica familiar,
       medicamentos, libros, material educativo, transporte publico...""",

       # Agrega 8-10 articulos mas del LORTI, Reglamento LORTI, resoluciones NAC
   ]
   ```

3. Divide los documentos en chunks:
   ```python
   splitter = RecursiveCharacterTextSplitter(
       chunk_size=500,
       chunk_overlap=50,
       length_function=len,
       separators=["\n\n", "\n", "Art.", ".", " "]
   )
   chunks = splitter.create_documents(documentos_sri)
   print(f"Total chunks: {len(chunks)}")
   print(f"Ejemplo chunk: {chunks[0].page_content[:200]}")
   ```

4. Crea los embeddings y el vector store:
   ```python
   # Modelo de embeddings en espanol (gratis, sin API key)
   embeddings = HuggingFaceEmbeddings(
       model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
       model_kwargs={'device': 'cuda'}
   )

   # Crea y persiste el vector store
   vectordb = Chroma.from_documents(
       documents=chunks,
       embedding=embeddings,
       persist_directory="./sri_vectordb"
   )
   vectordb.persist()
   print(f"Documentos en vectordb: {vectordb._collection.count()}")
   ```

5. Construye el pipeline RAG:
   ```python
   llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)

   retriever = vectordb.as_retriever(
       search_type="similarity",
       search_kwargs={"k": 4}  # recupera los 4 chunks mas relevantes
   )

   qa_chain = RetrievalQA.from_chain_type(
       llm=llm,
       chain_type="stuff",
       retriever=retriever,
       return_source_documents=True,
       chain_type_kwargs={
           "prompt": ChatPromptTemplate.from_template(
               """Eres un experto en tributacion ecuatoriana. Responde SOLO con
               informacion del contexto proporcionado. Si no esta en el contexto,
               di "Esta informacion no esta en los documentos disponibles."

               Contexto: {context}

               Pregunta: {question}
               Respuesta (cita el articulo si aplica):"""
           )
       }
   )
   ```

6. Prueba el sistema con preguntas tributarias reales:
   ```python
   preguntas = [
       "Cual es la tarifa del IVA en Ecuador?",
       "Desde que monto debo llevar contabilidad como persona natural?",
       "Los medicamentos pagan IVA?",
       "Cual es la tasa del impuesto a la renta para sociedades?",
       "Que es el ICE y a que productos aplica?"  # Esta puede no estar en los docs
   ]

   for pregunta in preguntas:
       resultado = qa_chain({"query": pregunta})
       print(f"P: {pregunta}")
       print(f"R: {resultado['result']}")
       print(f"Fuente: {resultado['source_documents'][0].page_content[:100]}...\n")
   ```

7. Implementa evaluacion de hallucination: para cada respuesta, verifica manualmente si la informacion esta realmente en los chunks recuperados. Calcula el porcentaje de respuestas "ancladas" en el contexto.

## Usa IA para...

- Pedirle a Claude que explique la diferencia entre RAG y fine-tuning para conocimiento especifico de dominio: cuando usar cada uno (RAG para docs que cambian frecuentemente, fine-tuning para estilo/tono)
- Preguntar que es el "chunk size" optimo y como afecta la calidad del retrieval (muy pequeno = pierde contexto, muy grande = ruido)
- Si el retriever devuelve chunks irrelevantes, preguntar sobre las tecnicas de mejora: re-ranking con cross-encoders, hybrid search (BM25 + vectores), query expansion
- Pedir el codigo para evaluar el RAG con la metrica RAGAS (Retrieval Augmented Generation Assessment)

## Que aprendiste

Al terminar esta sesion debes poder responder:
- Por que RAG reduce las alucinaciones del LLM comparado con preguntar directamente sin contexto
- Que es la "distancia coseno" y como determina que chunks son relevantes para una pregunta
- Cual es el rol del "chunk overlap" en la calidad del retrieval
- Por que un LLM con temperatura=0 es preferible en aplicaciones de consulta legal o tributaria

## Reto Extra

Implementa un sistema de evaluacion automatica del RAG usando RAGAS:
```python
!pip install ragas
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_recall

# Crea un dataset de evaluacion con preguntas, respuestas esperadas y contextos
# Calcula las 3 metricas de RAGAS para tu pipeline
```
Luego implementa "Self-RAG": el sistema evalua por si mismo si el contexto recuperado es suficiente para responder. Si no lo es, reformula la pregunta y busca de nuevo (hasta 3 intentos). Muestra el trace de razonamiento usando `verbose=True` en LangChain.
