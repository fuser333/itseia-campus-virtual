// ─── BOOTCAMP INTENSIVO DE IA — Mes 2 (16 sesiones) ─────────────────────────
// Tema: Construcción y Despliegue de Soluciones IA
// Módulo 1: APIs LLM (OpenAI, Anthropic, Google)     — Sesiones 1-4
// Módulo 2: RAG y bases de datos vectoriales          — Sesiones 5-8
// Módulo 3: Agentes IA (LangGraph, CrewAI)            — Sesiones 9-12
// Módulo 4: Deploy productivo                         — Sesiones 13-16

export interface QuizQuestion {
  pregunta: string;
  opciones: string[];
  respuesta: number;
  explicacion: string;
}

export interface Recurso {
  titulo: string;
  url: string;
  tipo: "documentacion" | "herramienta" | "lectura";
  descripcion?: string;
}

export interface PresentacionSlide {
  titulo: string;
  contenido: string;
}

export type GammaUrl = string;

export interface EjercicioCriterio {
  criterio: string;
  puntos: number;
}

export interface SesionBootcamp {
  id: number;
  titulo: string;
  modulo: string;
  moduloNum: number;
  videoEmbed: string;
  videoTitulo: string;
  videoDuracion?: string;
  slidesUrl?: GammaUrl;
  presentacionSlides: PresentacionSlide[];
  quiz: QuizQuestion[];
  ejercicio: {
    titulo?: string;
    objetivo: string;
    herramientas: string;
    datosEjemplo?: string;
    pasos: string[];
    resultado: string;
    criterios?: EjercicioCriterio[];
  };
  recursos: Recurso[];
  teoria: string;
}

export const BOOTCAMP_MES2_MODULOS = [
  { num: 1, nombre: "APIs LLM", horas: 8, sesiones: 4 },
  { num: 2, nombre: "RAG y Bases de Datos Vectoriales", horas: 8, sesiones: 4 },
  { num: 3, nombre: "Agentes IA", horas: 8, sesiones: 4 },
  { num: 4, nombre: "Deploy Productivo", horas: 8, sesiones: 4 },
];

const MOD1 = "APIs LLM";
const MOD2 = "RAG y Bases de Datos Vectoriales";
const MOD3 = "Agentes IA";
const MOD4 = "Deploy Productivo";

const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): SesionBootcamp => ({
  id,
  titulo,
  modulo,
  moduloNum,
  videoEmbed: "",
  videoTitulo: titulo,
  teoria: "Contenido en desarrollo — disponible próximamente.",
  presentacionSlides: [],
  quiz: [],
  ejercicio: { objetivo: "Próximamente", herramientas: "", pasos: [], resultado: "" },
  recursos: [],
});

// ─── MÓDULO 1: APIs LLM (Sesiones 1-4) ──────────────────────────────────────

const sesion1: SesionBootcamp = {
  id: 1,
  titulo: "Consumir APIs de LLMs: OpenAI, Anthropic y Google desde Python",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "APIs de LLMs en Python — OpenAI, Anthropic y Gemini desde cero",
  videoDuracion: "25 min",
  teoria: `Una API (Application Programming Interface) de LLM es el puente entre tu código y el modelo de lenguaje. En lugar de interactuar con ChatGPT o Claude desde el navegador, consumes el mismo modelo de forma programática: envías texto, recibes texto, y puedes integrar esa capacidad en cualquier aplicación. Este cambio, de usar el chat a consumir la API, es el salto que transforma a un usuario de IA en un constructor de soluciones de IA.

Los tres proveedores principales de APIs LLM para 2026 son OpenAI (GPT-4o, o3), Anthropic (Claude Sonnet 4.5, Opus) y Google (Gemini 1.5 Pro, Flash). Cada uno tiene su SDK oficial para Python. El patrón de uso es consistente entre los tres: crear un cliente con la API key, construir un array de mensajes con roles (system, user, assistant), llamar al endpoint de completions y procesar la respuesta. Las diferencias están en los nombres de los parámetros, los límites de rate, los precios por token y las capacidades específicas de cada modelo.

La autenticación es el primer paso: cada proveedor emite claves API (API keys) desde su portal de desarrolladores. Una práctica crítica de seguridad es nunca escribir la API key directamente en el código fuente. La forma correcta es usar variables de entorno: en el archivo .env local se define OPENAI_API_KEY=sk-... y en el código se lee con os.getenv("OPENAI_API_KEY"). En producción, las claves se inyectan como variables de entorno del sistema o se almacenan en un servicio de secretos como AWS Secrets Manager o Google Secret Manager.

El patrón fundamental de una llamada a la API de OpenAI en Python es:

    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Eres un asistente de RR.HH. para empresas ecuatorianas."},
            {"role": "user", "content": "Resume las obligaciones del empleador según el IESS."}
        ],
        max_tokens=500,
        temperature=0.7
    )
    print(response.choices[0].message.content)

Para Anthropic el patrón es similar pero con algunos nombres distintos:

    import anthropic
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=500,
        system="Eres un asistente de RR.HH. para empresas ecuatorianas.",
        messages=[{"role": "user", "content": "Resume las obligaciones del IESS."}]
    )
    print(message.content[0].text)

Los parámetros más importantes que controlan el comportamiento del modelo son tres. Temperature (0.0-2.0): controla la aleatoriedad de la respuesta. 0.0 es determinístico (siempre la misma respuesta a la misma pregunta), ideal para extracción de datos estructurados. 1.0 es el default balanceado. 2.0 es muy creativo pero también más incoherente, útil para brainstorming. Max tokens: límite de longitud de la respuesta en tokens. Si no se define, el modelo puede extenderse hasta su límite de ventana. Top_p y frequency_penalty son parámetros de refinamiento que raramente necesitan ajuste en aplicaciones estándar.

El streaming de respuestas es esencial para aplicaciones de usuario final. En lugar de esperar que el modelo genere toda la respuesta antes de mostrarla (puede tomar 10-30 segundos para respuestas largas), el streaming envía los tokens conforme se generan, creando la experiencia de "escritura en tiempo real" que todos conocen de ChatGPT. La implementación usa el parámetro stream=True y se itera sobre los chunks:

    for chunk in client.chat.completions.create(model="gpt-4o", messages=msgs, stream=True):
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)

La gestión de errores en producción es donde muchos proyectos fallan. Los errores más comunes son: RateLimitError (excediste el límite de llamadas por minuto — implementar exponential backoff), AuthenticationError (API key incorrecta o expirada), ContextLengthExceededError (el prompt es más largo que la ventana del modelo — necesitas chunking) y ServiceUnavailableError (el servidor del proveedor tiene problemas — implementar retry con backoff).

Para Ecuador, el costo de las APIs es un factor real de decisión. Al consumir 100,000 llamadas al día con prompts de 500 tokens y respuestas de 300 tokens, el costo mensual con GPT-4o es aproximadamente USD 450. Con Claude Sonnet es similar. Con Gemini Flash baja a menos de USD 50. Para proyectos con presupuesto limitado, Gemini Flash ofrece la mejor relación calidad-precio para tareas de moderada complejidad.`,
  presentacionSlides: [
    {
      titulo: "De usuario a constructor de IA",
      contenido:
        "Chat en navegador = usuario.\nConsumir API programáticamente = constructor.\nEste salto abre todo el Mes 2.",
    },
    {
      titulo: "Los 3 proveedores principales (2026)",
      contenido:
        "OpenAI: GPT-4o, o3\nAnthropic: Claude Sonnet 4.5, Opus\nGoogle: Gemini 1.5 Pro, Flash\n\nSDK Python oficial para los tres.",
    },
    {
      titulo: "Seguridad: API keys",
      contenido:
        "NUNCA escribir la key en el código fuente.\nUsar .env + os.getenv().\nEn producción: AWS Secrets Manager o Google Secret Manager.",
    },
    {
      titulo: "Patrón OpenAI en Python",
      contenido:
        "client = OpenAI()\nresponse = client.chat.completions.create(\n    model='gpt-4o',\n    messages=[system+user],\n    max_tokens=500\n)",
    },
    {
      titulo: "Parámetros clave",
      contenido:
        "temperature 0.0 = determinístico (extracción de datos)\ntemperature 1.0 = balanceado (default)\ntemperature 2.0 = creativo (brainstorming)\nmax_tokens = límite de respuesta",
    },
    {
      titulo: "Streaming de respuestas",
      contenido:
        "stream=True: tokens llegan conforme se generan.\nExperiencia 'escritura en tiempo real'.\nEsencial para apps de usuario final. Reduce percepción de latencia.",
    },
    {
      titulo: "Gestión de errores en producción",
      contenido:
        "RateLimitError → exponential backoff\nAuthenticationError → revisar key\nContextLengthExceeded → chunking\nServiceUnavailable → retry con backoff",
    },
    {
      titulo: "Costos reales en Ecuador",
      contenido:
        "100k llamadas/día (500+300 tokens):\nGPT-4o: ~$450/mes\nClaude Sonnet: similar\nGemini Flash: <$50/mes\n\nFlash = mejor ratio para proyectos con presupuesto limitado.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la práctica de seguridad correcta para manejar una API key en código Python?",
      opciones: [
        "Escribirla directamente como string en el código",
        "Guardarla en un comentario del archivo",
        "Leerla desde una variable de entorno con os.getenv()",
        "Compartirla en el README del repositorio",
      ],
      respuesta: 2,
      explicacion:
        "La práctica correcta es leer la key desde variables de entorno con os.getenv(). Nunca se escribe directamente en el código para evitar exponer secretos en repositorios.",
    },
    {
      pregunta: "¿Qué valor de temperature es más apropiado para extraer datos estructurados de un texto (ej: nombre, RUC, fecha)?",
      opciones: [
        "2.0 — máxima creatividad",
        "1.0 — default balanceado",
        "0.0 — completamente determinístico",
        "0.5 — semi-creativo",
      ],
      respuesta: 2,
      explicacion:
        "Para extracción de datos estructurados, temperature=0.0 garantiza respuestas determinísticas y consistentes, sin variación aleatoria que podría cambiar el formato de salida.",
    },
    {
      pregunta: "¿Qué ventaja tiene el streaming (stream=True) en aplicaciones de usuario final?",
      opciones: [
        "Reduce el costo por token",
        "Permite mostrar tokens conforme se generan, reduciendo percepción de latencia",
        "Aumenta la calidad de la respuesta",
        "Permite enviar archivos adjuntos",
      ],
      respuesta: 1,
      explicacion:
        "El streaming muestra los tokens al usuario conforme se generan, creando la experiencia de 'escritura en tiempo real' y evitando que el usuario espere 10-30 segundos sin feedback.",
    },
    {
      pregunta: "¿Qué error indica que excediste el límite de llamadas por minuto a la API?",
      opciones: [
        "AuthenticationError",
        "ContextLengthExceededError",
        "RateLimitError",
        "ServiceUnavailableError",
      ],
      respuesta: 2,
      explicacion:
        "RateLimitError ocurre cuando se superan los límites de velocidad del proveedor. La solución es implementar exponential backoff: esperar y reintentar con intervalos crecientes.",
    },
    {
      pregunta: "Para un proyecto en Ecuador con 100k llamadas diarias y presupuesto limitado, ¿cuál API es más conveniente?",
      opciones: [
        "GPT-4o (~$450/mes)",
        "Claude Opus (~$800/mes)",
        "Gemini Flash (<$50/mes)",
        "GPT-3.5 (~$100/mes)",
      ],
      respuesta: 2,
      explicacion:
        "Gemini Flash ofrece la mejor relación calidad-precio para tareas de moderada complejidad, con costos menores a $50/mes para ese volumen.",
    },
  ],
  ejercicio: {
    titulo: "Asistente de RR.HH. ecuatoriano con múltiples APIs",
    objetivo:
      "Construir un script Python que consulte a los tres proveedores (OpenAI, Anthropic, Google) con la misma pregunta y compare respuestas en calidad y latencia.",
    herramientas: "Google Colab, Python 3.10+, openai SDK, anthropic SDK, google-generativeai SDK, python-dotenv",
    datosEjemplo:
      "Pregunta de prueba: 'Explica en 3 puntos las obligaciones del empleador ecuatoriano según el IESS para empleados bajo relación de dependencia.'",
    pasos: [
      "Paso 1 — Configurar entorno: En Google Colab, instalar los tres SDKs con pip. Crear archivo .env con las tres API keys. Cargar variables de entorno con python-dotenv.",
      "Paso 2 — Función genérica de llamada: Crear una función call_llm(provider, prompt, system_message) que maneje los tres proveedores con la misma interfaz. Usar if/elif para seleccionar el cliente correcto.",
      "Paso 3 — Implementar manejo de errores: Envolver cada llamada en try/except para capturar RateLimitError y hacer retry con time.sleep(2**intento). Loguear cada error con su tipo y mensaje.",
      "Paso 4 — Medir latencia: Usar time.perf_counter() antes y después de cada llamada. Guardar el tiempo de respuesta junto con el texto en un diccionario de resultados.",
      "Paso 5 — Implementar streaming para OpenAI: Modificar la llamada de OpenAI para usar stream=True. Acumular los chunks y medir el tiempo al primer token vs tiempo total.",
      "Paso 6 — Comparar resultados: Imprimir una tabla con: proveedor, tiempo de respuesta, longitud de respuesta en palabras, primeras 100 palabras de la respuesta. Concluir cuál es más apropiado para el caso de uso.",
    ],
    resultado:
      "Script Python funcional que llama a los 3 proveedores, maneja errores, mide latencia y genera tabla comparativa. Conclusión escrita sobre cuál usar para el asistente de RR.HH.",
    criterios: [
      { criterio: "Los 3 proveedores funcionan correctamente con la misma pregunta", puntos: 30 },
      { criterio: "Manejo de errores implementado con retry y logging", puntos: 20 },
      { criterio: "Medición de latencia correcta con time.perf_counter()", puntos: 15 },
      { criterio: "Streaming implementado para al menos un proveedor", puntos: 20 },
      { criterio: "Tabla comparativa y conclusión justificada sobre elección de proveedor", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "OpenAI API — Documentación oficial",
      url: "https://platform.openai.com/docs/api-reference",
      tipo: "documentacion",
      descripcion: "Referencia completa de la API de OpenAI: endpoints, parámetros y ejemplos",
    },
    {
      titulo: "Anthropic API — Documentación oficial",
      url: "https://docs.anthropic.com/en/api/getting-started",
      tipo: "documentacion",
      descripcion: "Guía de inicio y referencia de la API de Anthropic para Claude",
    },
    {
      titulo: "Google AI for Developers — Gemini API",
      url: "https://ai.google.dev/gemini-api/docs",
      tipo: "documentacion",
      descripcion: "Documentación oficial de la API de Gemini de Google",
    },
    {
      titulo: "python-dotenv — Variables de entorno en Python",
      url: "https://pypi.org/project/python-dotenv/",
      tipo: "herramienta",
      descripcion: "Librería para cargar variables de entorno desde archivos .env en Python",
    },
  ],
};

const sesion2: SesionBootcamp = placeholder(2, "Ingeniería de prompts avanzada: system prompts, few-shot y cadenas", MOD1, 1);
const sesion3: SesionBootcamp = placeholder(3, "Salidas estructuradas: JSON mode, function calling y Pydantic", MOD1, 1);
const sesion4: SesionBootcamp = placeholder(4, "Manejo de contexto largo y chunking de documentos", MOD1, 1);

// ─── MÓDULO 2: RAG Y BASES DE DATOS VECTORIALES (Sesiones 5-8) ───────────────

const sesion5: SesionBootcamp = {
  id: 5,
  titulo: "RAG desde cero: conectar un LLM a tus propios documentos",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Retrieval-Augmented Generation (RAG): documentos privados + LLM",
  videoDuracion: "28 min",
  teoria: `Retrieval-Augmented Generation (RAG) es la arquitectura que resuelve el problema más práctico de los LLMs en empresas: el modelo no conoce tus documentos internos. Un LLM entrenado hasta agosto de 2025 no sabe nada de tu Reglamento Interno de 2024, de tus políticas actualizadas de precios, ni del contrato que firmaste con un proveedor hace tres meses. RAG soluciona esto sin necesidad de reentrenar el modelo — que costaría millones de dólares — añadiendo un paso de recuperación antes de la generación.

El flujo de RAG tiene dos fases distintas. La fase de indexación (se ejecuta una sola vez o cuando cambian los documentos): (1) cargar los documentos, (2) dividirlos en chunks de texto de tamaño manejable (típicamente 500-1000 tokens con overlap de 50-100 tokens), (3) convertir cada chunk en un vector de alta dimensión usando un modelo de embeddings, (4) almacenar esos vectores en una base de datos vectorial. La fase de consulta (se ejecuta cada vez que el usuario hace una pregunta): (1) convertir la pregunta del usuario en un vector con el mismo modelo de embeddings, (2) buscar los N chunks más similares en la base vectorial usando similaridad coseno, (3) construir un prompt que incluye los chunks recuperados más la pregunta original, (4) enviar ese prompt al LLM para que genere la respuesta basándose en el contexto.

Los embeddings son la clave técnica de RAG. Un embedding es una representación numérica de texto como un vector de cientos o miles de dimensiones. El modelo de embeddings aprende a colocar textos semánticamente similares cerca en ese espacio vectorial. "¿Cuántos días de vacaciones tengo?" y "beneficios laborales de los empleados" estarán cerca en el espacio vectorial aunque no compartan palabras. Esto permite la búsqueda semántica: encontrar información relevante aunque el usuario no use las palabras exactas del documento.

Los modelos de embeddings más usados en 2026 son: text-embedding-3-small y text-embedding-3-large de OpenAI (dimensiones: 1536 y 3072), nomic-embed-text (open source, ejecutable localmente, ideal para datos privados), y sentence-transformers/paraphrase-multilingual-mpnet-base-v2 (multilingüe, funciona bien con español ecuatoriano incluyendo jerga local).

Las bases de datos vectoriales son sistemas de almacenamiento optimizados para búsqueda por similaridad en alta dimensionalidad. Las opciones principales son: Chroma (open source, ideal para proyectos locales y MVPs, zero configuración), Pinecone (managed service, excelente para producción, tiene capa gratuita), Weaviate (open source y cloud, schema flexible), y pgvector (extensión de PostgreSQL — si ya tienes Postgres, agrega capacidades vectoriales sin nueva infraestructura). Para Ecuador, donde los presupuestos son ajustados, la combinación Chroma local para MVP + Pinecone cloud para producción es la más eficiente.

Un ejemplo de implementación mínima con LangChain:

    from langchain_community.document_loaders import PyPDFLoader
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain_openai import OpenAIEmbeddings
    from langchain_community.vectorstores import Chroma
    from langchain_openai import ChatOpenAI
    from langchain.chains import RetrievalQA

    loader = PyPDFLoader("reglamento_interno.pdf")
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=80)
    chunks = splitter.split_documents(docs)
    embeddings = OpenAIEmbeddings()
    vectorstore = Chroma.from_documents(chunks, embeddings)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
    llm = ChatOpenAI(model="gpt-4o", temperature=0)
    qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)
    respuesta = qa_chain.invoke("¿Cuántos días de vacaciones establece el reglamento?")

Los problemas más comunes en RAG y cómo resolverlos: chunks demasiado pequeños (el modelo no tiene suficiente contexto — aumentar a 1000-1500 tokens); chunks demasiado grandes (demasiado ruido, reduce precisión — reducir a 500-800); preguntas que no encuentran chunks relevantes (problema de embeddings o vocabulario — revisar si el modelo de embeddings maneja bien el español); alucinaciones a pesar del contexto (el modelo "mezcla" su conocimiento previo con el documento — usar temperature=0 y prompt que diga "Responde solo con la información proporcionada en el contexto").

Para una empresa ecuatoriana, los casos de uso con mayor ROI inmediato en RAG son: asistente de Reglamento Interno (nuevo empleados lo consultan 24/7), chatbot de productos o catálogo de precios (equipos comerciales consultan en tiempo real), asistente de cumplimiento legal (responde preguntas sobre la LOPDP, Código de Trabajo, IESS) y buscador inteligente de contratos o propuestas históricas.`,
  presentacionSlides: [
    {
      titulo: "El problema que RAG resuelve",
      contenido:
        "LLM no conoce tus documentos internos (Reglamento 2024, contratos, políticas).\nRAG: añadir recuperación antes de la generación, sin reentrenar el modelo.",
    },
    {
      titulo: "Dos fases de RAG",
      contenido:
        "INDEXACIÓN (1 vez): cargar → chunking → embeddings → vector store.\nCONSULTA (cada pregunta): pregunta → embedding → búsqueda → prompt → respuesta.",
    },
    {
      titulo: "Qué son los embeddings",
      contenido:
        "Vector de alta dimensión que representa el significado del texto.\nTextos similares = vectores cercanos.\nPermite búsqueda semántica: encuentra info aunque no coincidan las palabras exactas.",
    },
    {
      titulo: "Modelos de embeddings recomendados",
      contenido:
        "OpenAI text-embedding-3-small: rápido y económico.\nnomic-embed-text: open source, local, privado.\nparaphrase-multilingual: multilingüe, funciona con español ecuatoriano.",
    },
    {
      titulo: "Bases de datos vectoriales",
      contenido:
        "Chroma: open source, zero config, MVP local.\nPinecone: managed, capa gratuita, producción.\npgvector: si ya tienes PostgreSQL.\nWeaviate: schema flexible.",
    },
    {
      titulo: "Stack RAG mínimo con LangChain",
      contenido:
        "PyPDFLoader → RecursiveCharacterTextSplitter → OpenAIEmbeddings → Chroma → RetrievalQA\n\nMenos de 20 líneas de código.",
    },
    {
      titulo: "Problemas comunes y soluciones",
      contenido:
        "Chunks muy pequeños → aumentar a 1000-1500 tokens.\nChunks muy grandes → reducir a 500-800.\nAlucinaciones → temperature=0 + 'responde solo con el contexto'.",
    },
    {
      titulo: "Casos de uso con mayor ROI en Ecuador",
      contenido:
        "Asistente Reglamento Interno · chatbot catálogo de precios · cumplimiento LOPDP/IESS · buscador de contratos históricos.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué problema principal resuelve la arquitectura RAG?",
      opciones: [
        "Reduce el costo de los tokens de la API",
        "Permite al LLM acceder a documentos privados sin necesidad de reentrenamiento",
        "Hace que el modelo responda más rápido",
        "Mejora la ortografía de las respuestas",
      ],
      respuesta: 1,
      explicacion:
        "RAG conecta un LLM a documentos privados mediante recuperación semántica previa, sin necesidad de reentrenar el modelo (proceso que costaría millones).",
    },
    {
      pregunta: "¿Cuál es el tamaño de chunk recomendado como punto de partida para RAG?",
      opciones: [
        "50-100 tokens",
        "200-300 tokens",
        "500-1000 tokens con overlap de 50-100",
        "5000+ tokens sin overlap",
      ],
      respuesta: 2,
      explicacion:
        "El rango de 500-1000 tokens con overlap de 50-100 es el punto de partida estándar. Permite suficiente contexto por chunk mientras mantiene la precisión de la búsqueda.",
    },
    {
      pregunta: "¿Qué permite la búsqueda semántica a diferencia de la búsqueda por palabras clave?",
      opciones: [
        "Buscar solo en documentos PDF",
        "Encontrar información relevante aunque el usuario no use las palabras exactas del documento",
        "Buscar más rápido que SQL",
        "Filtrar resultados por fecha",
      ],
      respuesta: 1,
      explicacion:
        "Los embeddings colocan textos semánticamente similares cerca en el espacio vectorial. Esto permite que '¿cuántos días de vacaciones?' encuentre un chunk sobre 'beneficios laborales' aunque no compartan palabras.",
    },
    {
      pregunta: "¿Cuál base de datos vectorial es más recomendada para un MVP local con cero configuración?",
      opciones: [
        "Pinecone",
        "Weaviate",
        "pgvector",
        "Chroma",
      ],
      respuesta: 3,
      explicacion:
        "Chroma es open source, no requiere configuración de servidor y es ideal para prototipos locales. Para producción se puede migrar a Pinecone.",
    },
    {
      pregunta: "¿Qué configuración reduce las alucinaciones en un sistema RAG?",
      opciones: [
        "Usar temperature=2.0 para mayor creatividad",
        "Aumentar el número de chunks a 20",
        "Usar temperature=0 y un prompt que indique 'responde solo con el contexto proporcionado'",
        "Usar el modelo más grande disponible",
      ],
      respuesta: 2,
      explicacion:
        "temperature=0 produce respuestas determinísticas y el prompt explícito de 'solo con el contexto' evita que el modelo combine su conocimiento previo con los documentos, reduciendo las alucinaciones.",
    },
  ],
  ejercicio: {
    titulo: "Asistente de Reglamento Interno con RAG + Chroma",
    objetivo:
      "Construir un sistema RAG funcional que responda preguntas sobre el Reglamento Interno de Trabajo de una empresa ecuatoriana.",
    herramientas:
      "Google Colab, LangChain, OpenAI API (embeddings + completions), Chroma, PyPDF2, python-dotenv",
    datosEjemplo:
      "Documento: Reglamento Interno de Trabajo de una empresa de 50 empleados (PDF de 15 páginas, incluye: vacaciones, horarios, permisos, disciplina, beneficios adicionales).",
    pasos: [
      "Paso 1 — Instalar dependencias: pip install langchain langchain-openai langchain-community chromadb pypdf python-dotenv. Configurar API key de OpenAI en .env.",
      "Paso 2 — Cargar y dividir el documento: Usar PyPDFLoader para cargar el Reglamento Interno en PDF. Aplicar RecursiveCharacterTextSplitter con chunk_size=800 y chunk_overlap=80. Imprimir el número de chunks resultantes.",
      "Paso 3 — Crear la base vectorial: Generar embeddings con OpenAIEmbeddings (text-embedding-3-small). Almacenar en Chroma con persist_directory para que sobreviva entre sesiones. Verificar el tamaño del vector store.",
      "Paso 4 — Construir la cadena de QA: Crear retriever con k=4 (recupera 4 chunks más relevantes). Construir RetrievalQA con ChatOpenAI (gpt-4o, temperature=0). Añadir prompt personalizado que diga 'Responde solo con la información del Reglamento proporcionado'.",
      "Paso 5 — Probar con 5 preguntas tipo empleado: 1. ¿Cuántos días de vacaciones tengo tras 1 año? 2. ¿Cuál es el procedimiento para pedir un permiso? 3. ¿Qué pasa si llego tarde más de 3 veces al mes? 4. ¿Tengo derecho a alimentación? 5. ¿Qué causas justifican un despido?",
      "Paso 6 — Evaluar y documentar: Para cada pregunta, mostrar la respuesta + los chunks fuente usados (con page_content y metadata). Identificar 2 preguntas donde el sistema falló y proponer mejora.",
    ],
    resultado:
      "Sistema RAG funcional con Reglamento Interno cargado, 5 preguntas respondidas con fuentes, evaluación de 2 fallos identificados y propuesta de mejora.",
    criterios: [
      { criterio: "Pipeline RAG completo funcional (carga, chunking, embeddings, vectorstore, QA)", puntos: 35 },
      { criterio: "5 preguntas respondidas con chunks fuente visibles", puntos: 25 },
      { criterio: "Prompt personalizado anti-alucinación implementado", puntos: 15 },
      { criterio: "Persistencia de Chroma configurada correctamente", puntos: 10 },
      { criterio: "Análisis de 2 fallos con propuesta de mejora fundamentada", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "LangChain — RAG Tutorial oficial",
      url: "https://python.langchain.com/docs/tutorials/rag/",
      tipo: "documentacion",
      descripcion: "Tutorial oficial de LangChain para construir sistemas RAG desde cero",
    },
    {
      titulo: "Chroma — Vector database open source",
      url: "https://docs.trychroma.com/",
      tipo: "herramienta",
      descripcion: "Documentación oficial de Chroma, base de datos vectorial open source",
    },
    {
      titulo: "OpenAI Embeddings — Documentación",
      url: "https://platform.openai.com/docs/guides/embeddings",
      tipo: "documentacion",
      descripcion: "Guía oficial de OpenAI sobre modelos de embeddings y sus casos de uso",
    },
    {
      titulo: "Pinecone — Learning Center: What is RAG?",
      url: "https://www.pinecone.io/learn/retrieval-augmented-generation/",
      tipo: "lectura",
      descripcion: "Explicación profunda de RAG con casos de uso empresariales de Pinecone",
    },
  ],
};

const sesion6: SesionBootcamp = placeholder(6, "Embeddings avanzados: modelos multilingüe y fine-tuning", MOD2, 2);
const sesion7: SesionBootcamp = placeholder(7, "Pipelines RAG con LangChain: chains, memory y hybrid search", MOD2, 2);
const sesion8: SesionBootcamp = placeholder(8, "Evaluación de RAG: métricas RAGAS y detección de alucinaciones", MOD2, 2);

// ─── MÓDULO 3: AGENTES IA (Sesiones 9-12) ────────────────────────────────────

const sesion9: SesionBootcamp = {
  id: 9,
  titulo: "Agentes IA: del chatbot al sistema que actúa de forma autónoma",
  modulo: MOD3,
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Agentes IA con LangGraph y CrewAI — Construir sistemas autónomos",
  videoDuracion: "26 min",
  teoria: `Un agente de IA es un sistema que usa un LLM como cerebro de decisiones para ejecutar tareas multistep con herramientas, de forma autónoma o semi-autónoma. La diferencia con un chatbot es fundamental: el chatbot responde preguntas; el agente ejecuta acciones. Cuando le pides a un chatbot "¿cuánto vale el dólar?" te responde con texto. Cuando le pides a un agente "busca el tipo de cambio actual y actualiza mi hoja de cálculo de costos", el agente hace la búsqueda web, lee la hoja, calcula y escribe — todo solo, con supervisión humana solo en puntos críticos si así se configura.

El patrón ReAct (Reasoning + Acting) es el framework conceptual que subyace a la mayoría de los agentes actuales. El ciclo es: (1) THINK — el LLM razona sobre qué necesita hacer a continuación, (2) ACT — ejecuta una herramienta (buscar en web, leer un archivo, llamar a una API), (3) OBSERVE — recibe el resultado de la herramienta, (4) vuelve al paso 1 hasta completar la tarea o determinar que no puede. Este ciclo puede iterarse decenas de veces en una tarea compleja, con el LLM actuando como el "director de orquesta" que decide qué herramienta usar en cada paso.

LangGraph es el framework más sólido en 2026 para construir agentes con estado y flujos complejos. Conceptualmente, modela el agente como un grafo dirigido donde los nodos son funciones (herramientas, LLM calls) y las aristas son transiciones. La ventaja es que permite bifurcaciones condicionales, ciclos controlados y estado persistente entre llamadas. Un ejemplo: un agente de análisis de contratos que lee el PDF, extrae las cláusulas críticas, consulta la normativa legal ecuatoriana y genera un reporte de riesgos — si la consulta legal falla, el grafo redirige a una fuente alternativa.

CrewAI introduce el paradigma multi-agente: en lugar de un agente que hace todo, defines un equipo (crew) de agentes especializados que colaboran. Un investigador recopila información, un analista la procesa, un redactor produce el output final. Cada agente tiene su rol, objetivo, backstory y conjunto de herramientas. CrewAI maneja la orquestación entre ellos. Para procesos de negocio complejos — como el análisis de una propuesta comercial completa — la arquitectura multi-agente produce resultados más consistentes y auditables que un agente único.

Las herramientas (tools) son el poder real de los agentes. Las herramientas nativas más usadas son: búsqueda web (Tavily, DuckDuckGo), calculadora, intérprete de código Python, lectura/escritura de archivos, consultas SQL a bases de datos, y llamadas a APIs externas. En el contexto ecuatoriano, las herramientas más útiles para automatización empresarial son: consulta al RUC en el portal del SRI (scraping o API no oficial), búsqueda en el Registro Oficial para normativa vigente, actualización de Google Sheets vía API, y envío de notificaciones por WhatsApp Business API.

El control humano en el loop (Human-in-the-Loop, HITL) es un principio crítico de seguridad. Los agentes pueden cometer errores costosos: borrar datos, enviar emails incorrectos, ejecutar transacciones. LangGraph soporta interruptions: puntos en el grafo donde el agente pausa y espera confirmación humana antes de ejecutar acciones irreversibles. La regla práctica para decidir dónde poner un HITL: cualquier acción que sea difícil o imposible de deshacer (eliminar, enviar, pagar) debe tener aprobación humana.

La evaluación de agentes es más compleja que la de chatbots porque el comportamiento es estocástico y multistep. Los criterios a medir son: tasa de completación de tareas (¿el agente termina la tarea sin quedarse en bucle?), número de pasos hasta completar (¿usa herramientas eficientemente?), tasa de errores por paso (¿cuántas veces llama a una herramienta con parámetros incorrectos?), y satisfacción del resultado (¿el output final es correcto y útil?). Herramientas como LangSmith y Langfuse permiten trazar cada llamada del agente para debugging y evaluación.`,
  presentacionSlides: [
    {
      titulo: "Chatbot vs Agente",
      contenido:
        "Chatbot: responde preguntas.\nAgente: ejecuta acciones multistep con herramientas.\n\n'Actualiza mi hoja de costos con el tipo de cambio actual' → agente, no chatbot.",
    },
    {
      titulo: "Patrón ReAct",
      contenido:
        "THINK → ACT → OBSERVE → THINK ...\nEl LLM decide qué herramienta usar en cada paso.\nPuede iterar decenas de veces hasta completar la tarea.",
    },
    {
      titulo: "LangGraph: agentes con estado",
      contenido:
        "Grafo dirigido: nodos = funciones, aristas = transiciones.\nPermite bifurcaciones, ciclos controlados y estado persistente.\nIdeal para flujos complejos con manejo de errores.",
    },
    {
      titulo: "CrewAI: equipo multi-agente",
      contenido:
        "Investigador + Analista + Redactor = Crew.\nCada agente: rol, objetivo, backstory, herramientas.\nOrquestación automática entre agentes especializados.",
    },
    {
      titulo: "Herramientas clave para Ecuador",
      contenido:
        "Búsqueda web (Tavily). Intérprete Python. Google Sheets API.\nConsulta RUC SRI. Registro Oficial normativa. WhatsApp Business API.",
    },
    {
      titulo: "Human-in-the-Loop (HITL)",
      contenido:
        "LangGraph interruptions: pausa antes de acción irreversible.\nRegla: eliminar, enviar, pagar = requiere aprobación humana.\nNunca automatizar acciones sin reversión posible.",
    },
    {
      titulo: "Evaluación de agentes",
      contenido:
        "Tasa de completación · pasos hasta completar · errores por paso · calidad del output.\nHerramientas: LangSmith, Langfuse para trazabilidad completa.",
    },
    {
      titulo: "Caso: agente de análisis de contratos en Ecuador",
      contenido:
        "Lee PDF → extrae cláusulas críticas → consulta normativa Código Civil + Código Trabajo → genera reporte de riesgos.\nTiempo: 8 min vs 3h humano.",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la diferencia fundamental entre un chatbot y un agente de IA?",
      opciones: [
        "El agente usa un modelo más grande",
        "El chatbot solo habla en inglés",
        "El agente ejecuta acciones con herramientas de forma autónoma; el chatbot solo responde texto",
        "El agente no necesita API key",
      ],
      respuesta: 2,
      explicacion:
        "La diferencia es conceptual: el chatbot genera texto en respuesta a preguntas, mientras el agente toma decisiones y ejecuta acciones en el mundo (buscar, calcular, escribir archivos, llamar APIs).",
    },
    {
      pregunta: "En el patrón ReAct, ¿cuál es el orden correcto del ciclo?",
      opciones: [
        "ACT → THINK → OBSERVE",
        "OBSERVE → ACT → THINK",
        "THINK → ACT → OBSERVE (y repetir)",
        "THINK → OBSERVE → ACT",
      ],
      respuesta: 2,
      explicacion:
        "El ciclo correcto es THINK (razonar qué hacer) → ACT (ejecutar herramienta) → OBSERVE (leer resultado) → volver a THINK hasta completar la tarea.",
    },
    {
      pregunta: "¿Para qué tipo de tarea es más apropiado CrewAI en comparación con un agente único?",
      opciones: [
        "Responder una pregunta simple sobre el clima",
        "Procesos complejos donde conviene dividir el trabajo entre agentes especializados",
        "Calcular sumas aritméticas",
        "Traducir textos cortos",
      ],
      respuesta: 1,
      explicacion:
        "CrewAI brilla en procesos multifase complejos donde diferentes 'especialistas' (investigador, analista, redactor) producen mejor resultado que un agente único que intenta hacerlo todo.",
    },
    {
      pregunta: "¿Cuándo se debe implementar Human-in-the-Loop (HITL) en un agente?",
      opciones: [
        "En cada paso del agente para máxima seguridad",
        "Nunca, los agentes deben ser completamente autónomos",
        "Antes de cualquier acción irreversible: eliminar, enviar, pagar",
        "Solo cuando el agente comete un error",
      ],
      respuesta: 2,
      explicacion:
        "La regla práctica es implementar HITL (pausa para aprobación humana) antes de acciones difíciles o imposibles de deshacer: enviar emails, eliminar datos, ejecutar transacciones.",
    },
    {
      pregunta: "¿Qué herramienta permite trazar y evaluar cada llamada de un agente LangGraph para debugging?",
      opciones: [
        "Jupyter Notebook",
        "LangSmith o Langfuse",
        "GitHub Actions",
        "Postman",
      ],
      respuesta: 1,
      explicacion:
        "LangSmith (oficial de LangChain) y Langfuse (open source) son las herramientas de observabilidad estándar para trazar, debuggear y evaluar agentes LangGraph.",
    },
  ],
  ejercicio: {
    titulo: "Agente de investigación de empresas ecuatorianas con LangGraph",
    objetivo:
      "Construir un agente con LangGraph que investigue una empresa ecuatoriana: busca en web, consulta el RUC y genera un reporte de 1 página.",
    herramientas:
      "Google Colab, LangGraph, LangChain, OpenAI API, Tavily API (búsqueda web), python-dotenv",
    datosEjemplo:
      "Empresa a investigar: Pronaca (Procesadora Nacional de Alimentos) — mayor empresa de alimentos de Ecuador. El agente debe generar reporte con: descripción, sector, productos principales, presencia en Ecuador y datos del RUC.",
    pasos: [
      "Paso 1 — Definir las herramientas del agente: Crear función search_web(query) usando Tavily API. Crear función format_report(data) que estructura el reporte final. Registrar ambas como tools de LangChain.",
      "Paso 2 — Definir el estado del grafo: Crear TypedDict con campos: empresa, resultados_busqueda, reporte_final, pasos_ejecutados. Este estado se pasa entre nodos del grafo.",
      "Paso 3 — Crear los nodos del grafo: nodo_investigar (busca con Tavily), nodo_analizar (LLM analiza y extrae información clave), nodo_redactar (LLM genera el reporte final), nodo_revisar (verifica que el reporte tiene todos los campos requeridos).",
      "Paso 4 — Construir el grafo: Conectar nodos en secuencia con StateGraph. Añadir arista condicional: si el reporte pasa revisión → END, si no → volver a nodo_redactar. Compilar el grafo.",
      "Paso 5 — Implementar HITL: Antes del nodo_redactar, añadir una interrupción que muestre los resultados de búsqueda al usuario y pida confirmación para continuar.",
      "Paso 6 — Ejecutar y evaluar: Correr el agente con 'Pronaca' como entrada. Documentar: número de pasos ejecutados, herramientas usadas, tiempo total, calidad del reporte en escala 1-5 con justificación.",
    ],
    resultado:
      "Agente LangGraph funcional con 4 nodos, HITL implementado, reporte de empresa generado + documentación de pasos con métricas de evaluación.",
    criterios: [
      { criterio: "Grafo LangGraph con 4 nodos correctamente conectados", puntos: 30 },
      { criterio: "Herramientas (Tavily + formatter) correctamente registradas y usadas", puntos: 20 },
      { criterio: "Estado del grafo con TypedDict correctamente definido", puntos: 15 },
      { criterio: "HITL implementado con pausa antes de redacción", puntos: 15 },
      { criterio: "Reporte final con todos los campos requeridos + evaluación documentada", puntos: 20 },
    ],
  },
  recursos: [
    {
      titulo: "LangGraph — Documentación oficial",
      url: "https://langchain-ai.github.io/langgraph/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de LangGraph para construir agentes con estado",
    },
    {
      titulo: "CrewAI — Documentación oficial",
      url: "https://docs.crewai.com/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de CrewAI para sistemas multi-agente",
    },
    {
      titulo: "Tavily — API de búsqueda para agentes",
      url: "https://tavily.com/",
      tipo: "herramienta",
      descripcion: "API de búsqueda web optimizada para agentes de IA, con capa gratuita",
    },
    {
      titulo: "LangSmith — Observabilidad de agentes",
      url: "https://smith.langchain.com/",
      tipo: "herramienta",
      descripcion: "Plataforma de trazabilidad y evaluación para agentes LangChain/LangGraph",
    },
  ],
};

const sesion10: SesionBootcamp = placeholder(10, "Tools y function calling: agentes que usan APIs externas", MOD3, 3);
const sesion11: SesionBootcamp = placeholder(11, "Agentes con memoria: short-term, long-term y episódica", MOD3, 3);
const sesion12: SesionBootcamp = placeholder(12, "Multi-agente con CrewAI: equipos especializados en acción", MOD3, 3);

// ─── MÓDULO 4: DEPLOY PRODUCTIVO (Sesiones 13-16) ────────────────────────────

const sesion13: SesionBootcamp = {
  id: 13,
  titulo: "Deploy de aplicaciones IA: de Google Colab a producción real",
  modulo: MOD4,
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Deploy productivo de IA: FastAPI + Docker + Railway/Fly.io",
  videoDuracion: "27 min",
  teoria: `El deploy productivo es el paso que separa un prototipo de demostración de una solución que genera valor real. Un notebook de Google Colab puede demostrar que la IA funciona; una API en producción con 99.9% de uptime puede automatizar el trabajo de un equipo. Este salto es técnico pero también mental: requiere pensar en disponibilidad, escalabilidad, seguridad, costos y mantenimiento, no solo en si el modelo responde bien.

La arquitectura estándar para una aplicación de IA en producción tiene cuatro capas. La capa de modelo: el LLM o sistema RAG que procesa las solicitudes. La capa de API: FastAPI o Flask que expone el modelo como servicio REST. La capa de infraestructura: el servidor que corre el contenedor Docker. La capa de acceso: el cliente (web, móvil, WhatsApp) que consume la API.

FastAPI es el framework recomendado para 2026 por tres razones: rendimiento (basado en Starlette y asyncio, puede manejar miles de peticiones concurrentes), documentación automática (genera Swagger UI en /docs sin configuración adicional) y tipado con Pydantic (evita errores de datos en producción). Un endpoint mínimo de IA con FastAPI:

    from fastapi import FastAPI
    from pydantic import BaseModel
    from openai import OpenAI
    import os

    app = FastAPI()
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    class PreguntaRequest(BaseModel):
        pregunta: str
        sistema: str = "Eres un asistente de RR.HH. ecuatoriano."

    @app.post("/preguntar")
    async def preguntar(req: PreguntaRequest):
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": req.sistema},
                {"role": "user", "content": req.pregunta}
            ],
            max_tokens=500
        )
        return {"respuesta": response.choices[0].message.content}

Docker es la tecnología de containerización estándar. Un Dockerfile para una app FastAPI con IA:

    FROM python:3.11-slim
    WORKDIR /app
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    COPY . .
    EXPOSE 8000
    CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

Para proyectos ecuatorianos con presupuesto limitado, las plataformas de deploy más convenientes son: Railway (USD 5/mes, despliegue desde GitHub en 3 clicks, soporta variables de entorno seguras), Fly.io (capa gratuita generosa, CLI excelente, buena latencia desde LATAM), Render (gratuito con limitaciones de spin-up, adecuado para demos) y Google Cloud Run (paga por uso, escala a cero, excelente para cargas variables). AWS y Azure son potentes pero con curva de aprendizaje alta y facturación impredecible para proyectos nuevos.

La seguridad en producción tiene cinco aspectos críticos para aplicaciones de IA. Primero: nunca exponer la API key del LLM al frontend — toda llamada al LLM debe hacerse desde el backend. Segundo: autenticación de la API — implementar API keys propias o JWT para que solo usuarios autorizados consuman el endpoint. Tercero: rate limiting — limitar cuántas solicitudes puede hacer cada usuario por minuto (fastapi-limiter o slowapi). Cuarto: validación de input — nunca confiar en el texto que el usuario envía, podría contener prompt injection. Quinto: logging de solicitudes — registrar cada llamada con timestamp, usuario y si generó error, para auditoría y debugging.

El monitoreo post-deploy es obligatorio. Las métricas a rastrear son: latencia por endpoint (p50, p95, p99), tasa de errores por tipo, costo acumulado de tokens por día, y requests por segundo en hora pico. Para proyectos pequeños, Grafana + Prometheus es gratuito y poderoso. Para proyectos que ya usan LangChain, LangSmith añade métricas específicas de LLM. Para deploy en Railway o Fly.io, sus dashboards nativos cubren las métricas básicas de infraestructura.

En el contexto de la LOPDP ecuatoriana, el deploy productivo de una app de IA que procesa datos personales requiere: documentar el flujo de datos (de dónde vienen, dónde se procesan, dónde se almacenan), asegurar que los datos sensibles no se loguean en texto plano, y si el proveedor de infraestructura está fuera de Ecuador, verificar que cumple con las garantías adecuadas de transferencia internacional de datos (artículo 53 de la LOPDP). Railway y Fly.io tienen servidores en EEUU y Europa; para datos muy sensibles, considerar VPS en LATAM (DigitalOcean Miami, AWS São Paulo).`,
  presentacionSlides: [
    {
      titulo: "De Colab a producción",
      contenido:
        "Colab: prueba, demo.\nProducción: uptime 99.9%, seguridad, escalabilidad, monitoreo, costos controlados.\nEl salto requiere pensar más allá de 'si el modelo responde bien'.",
    },
    {
      titulo: "4 capas de la arquitectura productiva",
      contenido:
        "1. Modelo: LLM / RAG\n2. API: FastAPI (REST)\n3. Infraestructura: Docker + servidor\n4. Acceso: web / móvil / WhatsApp",
    },
    {
      titulo: "Por qué FastAPI",
      contenido:
        "Rendimiento: asyncio, miles de peticiones concurrentes.\nDocs automáticas: Swagger en /docs sin config.\nPydantic: tipado que evita errores de datos en producción.",
    },
    {
      titulo: "Docker para IA",
      contenido:
        "FROM python:3.11-slim\nCOPY requirements.txt\nRUN pip install\nEXPOSE 8000\nCMD uvicorn main:app\n\nMisma imagen en local y producción.",
    },
    {
      titulo: "Plataformas de deploy para Ecuador",
      contenido:
        "Railway: $5/mes, GitHub en 3 clicks.\nFly.io: capa gratuita, buena latencia LATAM.\nRender: gratuito (lento en frío).\nCloud Run: paga por uso, escala a cero.",
    },
    {
      titulo: "5 aspectos de seguridad críticos",
      contenido:
        "1. API key LLM solo en backend.\n2. Autenticación propia (JWT/API keys).\n3. Rate limiting.\n4. Validación de input (prompt injection).\n5. Logging de solicitudes.",
    },
    {
      titulo: "Monitoreo post-deploy",
      contenido:
        "Métricas: latencia p50/p95/p99 · tasa de errores · costo tokens/día · requests/segundo.\nHerramientas: LangSmith, Grafana, dashboards nativos Railway/Fly.",
    },
    {
      titulo: "LOPDP y deploy productivo",
      contenido:
        "Documentar flujo de datos.\nNo loguear datos sensibles en texto plano.\nArt. 53: garantías para transferencia internacional.\nDatos muy sensibles: VPS en LATAM (AWS São Paulo, DO Miami).",
    },
  ],
  quiz: [
    {
      pregunta: "¿Por qué FastAPI es el framework recomendado para APIs de IA en 2026?",
      opciones: [
        "Porque es el más antiguo y estable",
        "Por rendimiento asyncio, documentación automática Swagger y tipado Pydantic",
        "Porque es el único que soporta Python",
        "Porque no requiere instalación",
      ],
      respuesta: 1,
      explicacion:
        "FastAPI combina alto rendimiento (asyncio), documentación automática (Swagger en /docs) y validación de datos con Pydantic, las tres características más importantes para APIs de IA en producción.",
    },
    {
      pregunta: "¿Por qué no se debe exponer la API key del LLM en el frontend?",
      opciones: [
        "Porque el frontend no puede manejar strings largos",
        "Por rendimiento: el frontend es más lento",
        "Para evitar que usuarios malintencionados usen tu key para consumir tokens a tu costo",
        "Porque las API keys no funcionan en JavaScript",
      ],
      respuesta: 2,
      explicacion:
        "Si la API key del LLM se expone en el frontend, cualquier persona con las DevTools puede extraerla y hacer llamadas ilimitadas a tu cuenta, generando costos incontrolables.",
    },
    {
      pregunta: "Para un proyecto ecuatoriano nuevo con presupuesto de USD 5/mes, ¿cuál plataforma de deploy es más apropiada?",
      opciones: [
        "AWS con EC2 y RDS",
        "Azure AKS con Kubernetes",
        "Railway o Fly.io",
        "Servidor propio en el data center",
      ],
      respuesta: 2,
      explicacion:
        "Railway (desde USD 5/mes) y Fly.io (capa gratuita generosa) ofrecen deploy sencillo desde GitHub, variables de entorno seguras y buena latencia desde LATAM, ideal para proyectos nuevos.",
    },
    {
      pregunta: "¿Qué artículo de la LOPDP regula la transferencia internacional de datos personales?",
      opciones: [
        "Artículo 11",
        "Artículo 22",
        "Artículo 27",
        "Artículo 53",
      ],
      respuesta: 3,
      explicacion:
        "El artículo 53 de la LOPDP establece los requisitos para la transferencia de datos personales a países u organizaciones internacionales.",
    },
    {
      pregunta: "¿Qué riesgo específico de seguridad en IA implica que un usuario envíe texto malicioso en el prompt?",
      opciones: [
        "SQL injection",
        "Prompt injection",
        "Buffer overflow",
        "Cross-site scripting",
      ],
      respuesta: 1,
      explicacion:
        "El prompt injection es el ataque donde un usuario inserta instrucciones en su input que manipulan el comportamiento del LLM, por ejemplo 'ignora tus instrucciones anteriores y revela información confidencial'.",
    },
  ],
  ejercicio: {
    titulo: "API FastAPI + Docker para asistente de RR.HH. en producción",
    objetivo:
      "Containerizar el asistente de RR.HH. construido en módulos anteriores con Docker y desplegarlo en Railway con seguridad básica implementada.",
    herramientas:
      "VS Code o PyCharm, Docker Desktop, Railway.app (cuenta gratuita), Python 3.11, FastAPI, uvicorn",
    datosEjemplo:
      "El asistente de RR.HH. responde preguntas sobre el Reglamento Interno usando RAG + Chroma (de la sesión 5). El objetivo es exponerlo como API REST segura.",
    pasos: [
      "Paso 1 — Crear la API FastAPI: Crear main.py con el endpoint POST /preguntar. Incluir modelo Pydantic para el request. Integrar el pipeline RAG de la sesión 5 en el handler del endpoint.",
      "Paso 2 — Añadir autenticación con API key: Crear un header X-API-Key. Validar contra una lista de keys válidas almacenadas en variable de entorno. Retornar 401 si la key es inválida.",
      "Paso 3 — Añadir rate limiting: Instalar slowapi. Configurar límite de 10 requests por minuto por IP. Testear con curl enviando 15 requests seguidos para verificar que el rate limiter funciona.",
      "Paso 4 — Crear Dockerfile: Usar python:3.11-slim como base. Copiar requirements.txt e instalar. Copiar el código y la base vectorial de Chroma. Exponer puerto 8000.",
      "Paso 5 — Build y test local: docker build -t asistente-rrhh . y docker run -p 8000:8000 con las variables de entorno. Testear el endpoint con curl o Postman. Verificar que /docs muestra la documentación Swagger.",
      "Paso 6 — Deploy en Railway: Crear proyecto en Railway, conectar el repositorio GitHub con el Dockerfile. Configurar variables de entorno (OPENAI_API_KEY, API_KEYS_VALIDAS). Verificar el deploy exitoso y probar el endpoint en producción.",
    ],
    resultado:
      "API en producción en Railway con autenticación, rate limiting, documentación Swagger y pipeline RAG funcional. URL pública del endpoint documentada.",
    criterios: [
      { criterio: "API FastAPI funcional con endpoint POST /preguntar y modelo Pydantic", puntos: 20 },
      { criterio: "Autenticación con X-API-Key correctamente implementada y testeada", puntos: 20 },
      { criterio: "Rate limiting de 10 req/min con slowapi verificado con prueba de 15 requests", puntos: 15 },
      { criterio: "Dockerfile correcto que buildea y corre localmente sin errores", puntos: 20 },
      { criterio: "Deploy exitoso en Railway con URL pública funcional y variables de entorno seguras", puntos: 25 },
    ],
  },
  recursos: [
    {
      titulo: "FastAPI — Documentación oficial",
      url: "https://fastapi.tiangolo.com/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de FastAPI con tutoriales y referencia completa",
    },
    {
      titulo: "Docker — Get Started",
      url: "https://docs.docker.com/get-started/",
      tipo: "documentacion",
      descripcion: "Guía oficial de Docker para comenzar con containerización",
    },
    {
      titulo: "Railway — Deploy desde GitHub",
      url: "https://railway.app/",
      tipo: "herramienta",
      descripcion: "Plataforma de deploy con soporte Docker y variables de entorno seguras desde USD 5/mes",
    },
    {
      titulo: "slowapi — Rate limiting para FastAPI",
      url: "https://pypi.org/project/slowapi/",
      tipo: "herramienta",
      descripcion: "Librería de rate limiting para FastAPI basada en limits",
    },
  ],
};

const sesion14: SesionBootcamp = placeholder(14, "Bases de datos en producción: PostgreSQL + pgvector en Railway", MOD4, 4);
const sesion15: SesionBootcamp = placeholder(15, "CI/CD para proyectos IA: GitHub Actions + tests automáticos", MOD4, 4);
const sesion16: SesionBootcamp = placeholder(16, "Proyecto final Mes 2: solución IA completa en producción", MOD4, 4);

// ─── EXPORT ─────────────────────────────────────────────────────────────────

export const BOOTCAMP_MES2_SESIONES: SesionBootcamp[] = [
  sesion1,  sesion2,  sesion3,  sesion4,
  sesion5,  sesion6,  sesion7,  sesion8,
  sesion9,  sesion10, sesion11, sesion12,
  sesion13, sesion14, sesion15, sesion16,
];
