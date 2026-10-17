// ─── C9: Finanzas e IA Predictiva — Datos de 20 temas ──────────────────────
// Curso C9 del programa MDT. 20 temas completos.
// Módulo 1: Análisis financiero con ChatGPT
// Módulo 2: Modelos predictivos para cash flow
// Módulo 3: Detección de fraude con ML
// Módulo 4: Reporting automatizado SRI

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

export interface TemaC9 {
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

export const C9_MODULOS = [
  { num: 1, nombre: "Análisis financiero con ChatGPT", horas: 15, temas: 5 },
  { num: 2, nombre: "Modelos predictivos para cash flow", horas: 15, temas: 5 },
  { num: 3, nombre: "Detección de fraude con ML", horas: 15, temas: 5 },
  { num: 4, nombre: "Reporting automatizado SRI", horas: 15, temas: 5 },
];

// ─── Helper para temas placeholder ──────────────────────────────────────────
const placeholder = (
  id: number,
  titulo: string,
  modulo: string,
  moduloNum: number,
): TemaC9 => ({
  id,
  titulo,
  modulo,
  moduloNum,
  videoEmbed: "",
  videoTitulo: titulo,
  teoria: "Contenido en desarrollo — disponible próximamente.",
  presentacionSlides: [],
  quiz: [],
  ejercicio: {
    objetivo: "Próximamente",
    herramientas: "",
    pasos: [],
    resultado: "",
  },
  recursos: [],
});

// ─── MÓDULO 1: Análisis financiero con ChatGPT ───────────────────────────────

const MOD1 = "Análisis financiero con ChatGPT";

const tema1: TemaC9 = {
  id: 1,
  titulo: "Introducción al análisis financiero asistido por IA",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Análisis financiero con IA — Introducción práctica",
  videoDuracion: "~40 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "Introducción al Análisis Financiero Asistido por IA\nC9. Finanzas e IA Predictiva — Tema 1\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Qué aprenderás hoy?",
      contenido:
        "Al finalizar esta sesión serás capaz de:\n• Definir qué es el análisis financiero y qué rol tiene la IA en él\n• Identificar las limitaciones del análisis manual tradicional\n• Configurar ChatGPT para tareas financieras básicas\n• Realizar tu primer análisis financiero con prompt engineering",
    },
    {
      titulo: "El problema del análisis financiero tradicional",
      contenido:
        "• Hojas de cálculo con miles de filas que tardan días en procesar\n• Errores humanos en fórmulas = decisiones equivocadas\n• Datos dispersos: SRI, banco, contabilidad, inventario\n• Reportes que llegan tarde y sin contexto\n• Analistas que copian y pegan en lugar de interpretar\n\nEcuador: 68% de PyMEs toman decisiones financieras sin datos actualizados (CAPIG 2024).",
    },
    {
      titulo: "¿Qué puede hacer ChatGPT en finanzas?",
      contenido:
        "Análisis de estados financieros en segundos\nCálculo automático de ratios (liquidez, solvencia, rentabilidad)\nInterpretación narrativa de variaciones\nSimulación de escenarios: ¿qué pasa si sube el IVA?\nDetección de anomalías en gastos\nGeneración de reportes ejecutivos\n\nLo que NO puede hacer: acceder a sistemas bancarios directamente, garantizar exactitud sin tus datos reales.",
    },
    {
      titulo: "Prompts financieros — estructura básica",
      contenido:
        "Fórmula: ROL + DATOS + TAREA + FORMATO\n\nEjemplo:\n\"Eres analista financiero senior. Tengo estos datos de balance general [pegar datos]. Calcula los 5 ratios de liquidez principales, interprétalos y señala 3 alertas clave. Responde en tabla + párrafo ejecutivo.\"\n\nRegla de oro: ChatGPT no adivina — dale todos los números.",
    },
    {
      titulo: "Ratios financieros clave para Ecuador",
      contenido:
        "Liquidez corriente: Activo corriente / Pasivo corriente (mínimo 1.5)\nPrueba ácida: (Activo corriente - Inventario) / Pasivo corriente\nEndeudamiento: Pasivo total / Activo total (máximo 0.6)\nROE: Utilidad neta / Patrimonio\nROA: Utilidad neta / Activo total\n\nReferencia: Superintendencia de Compañías del Ecuador define umbrales sectoriales.",
    },
    {
      titulo: "Caso Ecuador — PyME comercial Quito",
      contenido:
        "Empresa: Distribuidora de alimentos, Quito Norte\nProblema: gerente no sabía si podía pagar nómina en 30 días\nSolución: balance 2024 + estado de resultados → ChatGPT\nResultado: identificó que tenían $48,000 en cuentas por cobrar vencidas que bloqueaban liquidez\nAcción: cobranza prioritaria liberó $31,000 en 2 semanas\n\nTiempo de análisis manual: 3 días → Con IA: 45 minutos",
    },
    {
      titulo: "Herramientas complementarias",
      contenido:
        "ChatGPT Plus (GPT-4o): análisis de PDFs de estados financieros\nClaude.ai: razonamiento más profundo con documentos largos\nGoogle Sheets + Gemini: análisis directo en hoja de cálculo\nMicrosoft Copilot + Excel: integrado en Microsoft 365\nNotebook LM: analizar múltiples documentos financieros a la vez\n\nCostos: $20-$30/mes por herramienta, ROI en el primer análisis.",
    },
    {
      titulo: "Ética y limitaciones",
      contenido:
        "No compartas datos confidenciales sin política de privacidad del proveedor\nChatGPT puede alucinar ratios — siempre verifica con calculadora\nLa IA interpreta, tú decides — nunca delegues decisiones críticas\nEcuador: LOPDP protege datos financieros de personas naturales\n\nRegla práctica: usa datos anonimizados o de ejemplo para aprender, datos reales solo en entornos seguros.",
    },
    {
      titulo: "Resumen del Tema 1",
      contenido:
        "1. La IA transforma análisis financiero de días a minutos\n2. ChatGPT necesita datos estructurados para dar resultados confiables\n3. Fórmula de prompt: ROL + DATOS + TAREA + FORMATO\n4. Los ratios clave: liquidez, solvencia, rentabilidad\n5. Ecuador tiene umbrales sectoriales en Supercias para comparar\n\nPróximo: Análisis de estados financieros con ChatGPT — práctica real con balance general",
    },
  ],
  quiz: [
    {
      pregunta: "¿Cuál es la fórmula recomendada para construir un prompt financiero efectivo en ChatGPT?",
      opciones: [
        "Pregunta corta sin contexto",
        "ROL + DATOS + TAREA + FORMATO",
        "Solo los números, sin explicación",
        "Pedir que ChatGPT busque en internet",
      ],
      respuesta: 1,
      explicacion:
        "La fórmula ROL + DATOS + TAREA + FORMATO da contexto profesional al modelo, le entrega los datos necesarios, define qué debe hacer y en qué estructura debe responder.",
    },
    {
      pregunta: "¿Qué ratio mide la capacidad de una empresa de pagar deudas de corto plazo sin liquidar inventario?",
      opciones: [
        "ROE",
        "Liquidez corriente",
        "Prueba ácida",
        "Endeudamiento total",
      ],
      respuesta: 2,
      explicacion:
        "La prueba ácida excluye el inventario del activo corriente porque es el activo menos líquido. Fórmula: (Activo corriente - Inventario) / Pasivo corriente.",
    },
    {
      pregunta: "Según los datos del caso Ecuador, ¿qué problema detectó la IA en la distribuidora de Quito?",
      opciones: [
        "Exceso de gastos de nómina",
        "Deuda tributaria con el SRI",
        "Cuentas por cobrar vencidas que bloqueaban liquidez",
        "Inventario demasiado alto",
      ],
      respuesta: 2,
      explicacion:
        "La IA identificó $48,000 en cuentas por cobrar vencidas. La cobranza prioritaria liberó $31,000 en 2 semanas, resolviendo el problema de liquidez para nómina.",
    },
    {
      pregunta: "¿Qué ley ecuatoriana protege los datos financieros de personas naturales?",
      opciones: ["Ley de Comercio Electrónico", "LOPDP", "Código de Comercio", "Ley PYME"],
      respuesta: 1,
      explicacion:
        "La Ley Orgánica de Protección de Datos Personales (LOPDP) vigente en Ecuador regula el tratamiento de datos personales, incluidos datos financieros de personas naturales.",
    },
    {
      pregunta: "¿Cuál es el valor máximo recomendado de endeudamiento total según parámetros de la Superintendencia de Compañías?",
      opciones: ["0.3", "0.8", "0.6", "1.0"],
      respuesta: 2,
      explicacion:
        "Un endeudamiento total mayor a 0.6 indica que más del 60% de los activos están financiados con deuda, lo que genera riesgo financiero significativo según los umbrales de la Supercias Ecuador.",
    },
  ],
  ejercicio: {
    titulo: "Análisis financiero de una PyME ecuatoriana con ChatGPT",
    objetivo:
      "Realizar un análisis completo de ratios financieros de una empresa ecuatoriana ficticia usando ChatGPT como analista asistente",
    herramientas: "ChatGPT (gpt.com o chatgpt.com) + Google Sheets + Google Docs",
    datosEjemplo:
      "Empresa ficticia: ANDINO FOODS S.A. (distribuidora de alimentos, Quito)\nBalance General al 31/12/2024:\n• Caja y Bancos: $12,500\n• Cuentas por Cobrar: $38,000\n• Inventarios: $22,000\n• Activo Fijo: $85,000\n• Total Activo: $157,500\n• Cuentas por Pagar: $18,000\n• Deuda Bancaria Corto Plazo: $25,000\n• Deuda Bancaria Largo Plazo: $40,000\n• Patrimonio: $74,500\nEstado de Resultados 2024:\n• Ventas: $280,000\n• Costo de Ventas: $168,000\n• Utilidad Bruta: $112,000\n• Gastos Operativos: $78,000\n• Utilidad Neta: $34,000",
    pasos: [
      "Abrir ChatGPT y crear una nueva conversación titulada 'Análisis Financiero ANDINO FOODS'",
      "Enviar el prompt: 'Eres analista financiero senior en Ecuador. Te comparto el balance general y estado de resultados de ANDINO FOODS S.A. al 31/12/2024: [pegar los datos de ejemplo]. Calcula los siguientes ratios: liquidez corriente, prueba ácida, endeudamiento total, ROE, ROA y margen neto. Presenta los resultados en tabla con: ratio, fórmula, valor calculado, valor referencial Supercias, y semáforo (verde/amarillo/rojo).'",
      "Revisar los cálculos: verificar manualmente al menos 2 ratios con calculadora para validar que ChatGPT no cometió errores aritméticos",
      "Enviar segundo prompt: 'Basándote en el análisis anterior, redacta un párrafo ejecutivo de 150 palabras para el gerente general, identificando las 3 fortalezas y las 3 alertas financieras más importantes. Usa lenguaje de negocios, no técnico.'",
      "Enviar tercer prompt: 'Simula dos escenarios para ANDINO FOODS: Escenario A — las ventas caen 20% en 2025. Escenario B — logran cobrar el 70% de cuentas por cobrar en 30 días. ¿Cómo cambian la liquidez corriente y la prueba ácida en cada escenario?'",
      "Copiar todos los resultados a Google Sheets: tabla de ratios en una pestaña, análisis narrativo en otra, simulación de escenarios en una tercera",
      "Crear un Google Doc con el reporte ejecutivo final: portada, tabla de ratios, análisis narrativo, dos escenarios y recomendación de acción prioritaria",
      "Reflexión (200 palabras): ¿qué habría tardado hacer esto manualmente? ¿En qué momento tuviste que corregir a ChatGPT? ¿Cómo aplicarías este proceso en tu empresa o trabajo actual?",
    ],
    resultado:
      "Reporte financiero completo de ANDINO FOODS con tabla de 6 ratios calculados y semaforizados, análisis narrativo ejecutivo, simulación de 2 escenarios y recomendación de acción. Tiempo total: menos de 90 minutos.",
    criterios: [
      { criterio: "Correctitud de los 6 ratios (verificados manualmente)", puntos: 30 },
      { criterio: "Calidad del análisis narrativo (claridad, actionable insights)", puntos: 25 },
      { criterio: "Simulación de escenarios con interpretación correcta", puntos: 20 },
      { criterio: "Formato profesional del reporte final", puntos: 15 },
      { criterio: "Reflexión crítica sobre el proceso", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "Superintendencia de Compañías Ecuador — Indicadores financieros sectoriales",
      url: "https://www.supercias.gob.ec/portalscvs/",
      tipo: "documentacion",
      descripcion: "Base de datos oficial con ratios financieros por sector para comparar tu empresa con el promedio del mercado ecuatoriano.",
    },
    {
      titulo: "ChatGPT — OpenAI",
      url: "https://chatgpt.com",
      tipo: "herramienta",
      descripcion: "Plataforma principal para el análisis financiero asistido por IA. Versión gratuita disponible, Plus ($20/mes) permite analizar PDFs de estados financieros.",
    },
    {
      titulo: "Financial Modeling — CFI Institute",
      url: "https://corporatefinanceinstitute.com/resources/financial-modeling/",
      tipo: "lectura",
      descripcion: "Recursos gratuitos sobre modelos financieros y ratios con explicaciones detalladas y plantillas descargables.",
    },
    {
      titulo: "Análisis de Ratios Financieros — Investopedia en español",
      url: "https://www.investopedia.com/financial-ratios-4689817",
      tipo: "lectura",
      descripcion: "Guía completa sobre los principales ratios financieros con fórmulas, ejemplos y benchmarks sectoriales.",
    },
    {
      titulo: "NotebookLM — Google",
      url: "https://notebooklm.google.com",
      tipo: "herramienta",
      descripcion: "Herramienta gratuita de Google para analizar múltiples documentos financieros simultáneamente. Ideal para comparar estados financieros de varios años.",
    },
  ],
  teoria: `El análisis financiero es el proceso de evaluar los estados financieros de una empresa para entender su salud económica, identificar tendencias y tomar decisiones informadas. Tradicionalmente era un proceso lento y manual: un contador o analista financiero pasaba horas o días revisando balances generales, estados de resultados y flujos de caja, calculando ratios a mano y escribiendo informes que llegaban tarde al gerente.

La inteligencia artificial, específicamente los Grandes Modelos de Lenguaje (LLMs) como ChatGPT, Claude y Gemini, transforma radicalmente este proceso. En lugar de calcular ratios manualmente con fórmulas en Excel, puedes pegar el balance general directamente en el chat y obtener en segundos un análisis completo con interpretación narrativa, alertas y recomendaciones. Esto no reemplaza al contador — lo libera para hacer el trabajo de mayor valor: interpretar, asesorar y decidir.

En Ecuador, el contexto financiero tiene particularidades importantes. Las empresas reportan ante la Superintendencia de Compañías (SUPERCIAS) bajo normas NIIF (Normas Internacionales de Información Financiera). El SRI (Servicio de Rentas Internas) requiere declaraciones mensuales de IVA y anuales de impuesto a la renta. Las tasas de interés bancarias para créditos PyME oscilan entre 10% y 17.5% según el Banco Central del Ecuador. Todo esto crea un ecosistema de datos que, correctamente estructurado, puede ser analizado por IA en minutos.

Los ratios financieros fundamentales que todo profesional en Ecuador debe conocer son: la liquidez corriente (activo corriente dividido por pasivo corriente, que mide la capacidad de pagar deudas de corto plazo; el mínimo aceptable es 1.0, el óptimo es 1.5 o superior), la prueba ácida (igual que liquidez corriente pero excluyendo inventarios, más conservadora), el endeudamiento total (pasivo total dividido por activo total; por encima de 0.6 indica riesgo significativo), el ROE (return on equity, rentabilidad sobre el patrimonio), el ROA (rentabilidad sobre activos), y el margen neto (utilidad neta sobre ventas).

La SUPERCIAS Ecuador publica anualmente tablas de indicadores financieros por sector. Esto significa que puedes no solo calcular los ratios de tu empresa, sino compararlos con el promedio del sector — una información extremadamente valiosa que antes requería análisis costosos de consultoras. Con ChatGPT y los datos públicos de la SUPERCIAS, cualquier emprendedor ecuatoriano puede hacer en 45 minutos el análisis que una consultora cobraba $2,000 por hacer.

La metodología para usar IA en análisis financiero sigue cuatro pasos: primero, estructurar los datos en formato tabular claro (CSV, tabla o lista numerada); segundo, construir el prompt con la fórmula ROL + DATOS + TAREA + FORMATO; tercero, verificar los resultados calculando manualmente al menos 2-3 ratios para detectar alucinaciones; y cuarto, iterar con prompts de seguimiento para análisis más profundos, simulaciones de escenarios o generación del reporte ejecutivo.

Las herramientas más útiles en este ecosistema son ChatGPT Plus para análisis de documentos PDF, Claude.ai para análisis de documentos largos con mayor capacidad de contexto, Google Sheets con Gemini para análisis embebido en hojas de cálculo, y NotebookLM para comparar múltiples períodos financieros simultáneamente. El costo total de estas herramientas oscila entre $20 y $60 por mes, con ROI positivo desde el primer análisis.

Un aspecto crítico que no puede ignorarse es la ética y privacidad de datos. La LOPDP (Ley Orgánica de Protección de Datos Personales) del Ecuador regula el tratamiento de información financiera de personas naturales. Nunca debes pegar en ChatGPT datos con cédulas de identidad, números de cuenta bancaria, o información de clientes identificables sin consentimiento. La práctica recomendada es anonimizar los datos o usar datos de ejemplo para aprender la metodología, y solo trabajar con datos reales en entornos con políticas de privacidad claras del proveedor.

El impacto real de esta transformación es medible: en Ecuador, el 68% de las PyMEs toman decisiones financieras sin datos actualizados según datos de la CAPIG 2024. Los profesionales que dominan análisis financiero con IA tienen una ventaja competitiva enorme en el mercado ecuatoriano, donde la cultura financiera en empresas medianas aún es incipiente. Contadores, administradores de empresas, gerentes generales y emprendedores que integren estas herramientas en su trabajo diario se convierten en asesores financieros de alto valor en lugar de operadores de datos.`,
};

const tema2: TemaC9 = {
  id: 2,
  titulo: "Análisis de estados financieros con ChatGPT",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Cómo analizar un balance general con ChatGPT",
  videoDuracion: "~35 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "Análisis de Estados Financieros con ChatGPT\nC9. Finanzas e IA Predictiva — Tema 2\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "Los tres estados financieros clave",
      contenido:
        "Balance General: fotografía de la empresa en un momento — activos, pasivos y patrimonio\nEstado de Resultados: película del período — ingresos, costos, utilidades\nFlujo de Caja: el movimiento real del dinero — cuándo entra y cuándo sale\n\nLos tres juntos cuentan la historia completa de la empresa.",
    },
    {
      titulo: "Subir PDF a ChatGPT — paso a paso",
      contenido:
        "1. Tener ChatGPT Plus ($20/mes) o usar Claude.ai (tiene plan gratuito con archivos)\n2. Hacer clic en el clip o ícono de adjunto\n3. Subir el PDF del estado financiero (máx 25MB en ChatGPT)\n4. Prompt: 'Analiza este estado financiero y extrae los datos clave en tabla'\n5. Verificar que los números extraídos coincidan con el PDF original",
    },
    {
      titulo: "Análisis vertical y horizontal",
      contenido:
        "Análisis Vertical: ¿Qué % representa cada cuenta sobre el total?\nEjemplo: el costo de ventas es el 62% de las ventas\nPrompt: 'Haz análisis vertical del estado de resultados. Expresa cada línea como % de las ventas netas'\n\nAnálisis Horizontal: ¿Cómo cambió cada cuenta año a año?\nPrompt: 'Compara 2023 vs 2024. ¿Qué creció más de 20%? ¿Qué cayó? Identifica las 3 variaciones más significativas'",
    },
    {
      titulo: "Señales de alerta que la IA detecta rápido",
      contenido:
        "Rojo: utilidad positiva pero flujo de caja negativo = problema real de cobranza\nAmarillo: inventario creciendo más rápido que ventas = sobrestock\nVerde: margen bruto estable + margen neto creciendo = eficiencia operativa\nRojo: deuda financiera creciendo + utilidades cayendo = trampa de deuda\n\nPrompt: 'Identifica señales de alerta en este balance. Clasifica en rojo, amarillo y verde.'",
    },
    {
      titulo: "EBITDA — por qué importa en Ecuador",
      contenido:
        "EBITDA = Earnings Before Interest, Taxes, Depreciation and Amortization\n= Utilidad antes de intereses, impuestos, depreciación y amortización\n\n¿Por qué importa en Ecuador?\n• Bancos ecuatorianos lo piden para créditos empresariales\n• CFN (Corporación Financiera Nacional) lo usa para préstamos de fomento\n• Indica capacidad operativa real sin distorsiones contables\n\nPrompt: 'Calcula el EBITDA y explica qué significa para obtener crédito en el Banco Pichincha'",
    },
    {
      titulo: "Plantilla de prompt para análisis completo",
      contenido:
        "'Eres CFO virtual de una empresa ecuatoriana. Analiza estos estados financieros [datos]. Entrega:\n1. Tabla de 8 ratios clave con semáforo\n2. Análisis vertical del ER\n3. EBITDA y cobertura de deuda\n4. Top 3 fortalezas y top 3 riesgos\n5. Recomendación ejecutiva en 3 acciones concretas'\n\nSiempre pide acciones concretas, no solo diagnóstico.",
    },
    {
      titulo: "Herramientas para analizar documentos financieros",
      contenido:
        "ChatGPT Plus: sube PDF directamente, análisis en segundos\nClaude.ai: maneja documentos más largos, mejor para consolidados\nNotebookLM (Google): analiza múltiples años simultáneamente\nGoogle Gemini en Sheets: análisis dentro de la hoja de cálculo\n\nConsejo: si el PDF tiene imágenes (escaneado), primero convierte con Adobe Acrobat o Smallpdf.",
    },
    {
      titulo: "Caso práctico — Empresa de tecnología Guayaquil",
      contenido:
        "Empresa: StartupTech S.A., Guayaquil\n2023: ventas $180K, utilidad $8K, deuda $120K\n2024: ventas $320K, utilidad $2K, deuda $180K\n\nAnálisis IA: ventas crecieron 78% pero utilidad cayó 75%\nCausa identificada: gastos de nómina crecieron 140% (contratación agresiva)\nRecomendación: freeze de contrataciones Q1 2025 + revisión estructura de costos\n\nLección: crecimiento sin rentabilidad es una trampa.",
    },
    {
      titulo: "Resumen del Tema 2",
      contenido:
        "1. Los tres estados financieros cuentan la historia completa: balance, ER, flujo de caja\n2. ChatGPT puede analizar PDFs directamente con plan Plus\n3. Análisis vertical y horizontal revelan tendencias invisibles\n4. EBITDA es clave para créditos en el sistema financiero ecuatoriano\n5. La IA detecta señales de alerta en segundos — siempre verifica los números\n\nPróximo: Presupuestación inteligente con IA",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué estado financiero muestra los ingresos, costos y utilidades de un período?",
      opciones: ["Balance General", "Estado de Resultados", "Flujo de Caja", "Estado de Patrimonio"],
      respuesta: 1,
      explicacion:
        "El Estado de Resultados (también llamado Estado de Pérdidas y Ganancias) muestra la actividad de la empresa durante un período: ingresos, costos, gastos y la utilidad o pérdida resultante.",
    },
    {
      pregunta: "¿Qué significa EBITDA?",
      opciones: [
        "Earnings Before Income Tax and Depreciation Adjustments",
        "Earnings Before Interest, Taxes, Depreciation and Amortization",
        "Estimated Budget Including Taxes, Debt and Assets",
        "Expected Business Income Tax and Dividends Analysis",
      ],
      respuesta: 1,
      explicacion:
        "EBITDA es la utilidad antes de intereses, impuestos, depreciación y amortización. Mide la capacidad operativa real de la empresa sin distorsiones contables ni financieras.",
    },
    {
      pregunta: "Una empresa tiene ventas creciendo al 78% pero utilidad cayendo al 75%. ¿Qué señal es esta?",
      opciones: [
        "Señal verde — el crecimiento es positivo",
        "Señal amarilla — requiere monitoreo",
        "Señal roja — crecimiento sin rentabilidad es una trampa",
        "No hay información suficiente para evaluar",
      ],
      respuesta: 2,
      explicacion:
        "Crecimiento en ventas con caída en utilidades indica que los costos están creciendo más rápido que los ingresos. Es una señal de alerta seria que puede llevar a una crisis de flujo de caja.",
    },
    {
      pregunta: "¿Qué institución ecuatoriana usa el EBITDA para evaluar préstamos de fomento empresarial?",
      opciones: ["Banco Central del Ecuador", "CFN (Corporación Financiera Nacional)", "SRI", "SUPERCIAS"],
      respuesta: 1,
      explicacion:
        "La Corporación Financiera Nacional (CFN) de Ecuador usa el EBITDA como uno de los indicadores principales para evaluar la capacidad de pago en créditos empresariales de fomento productivo.",
    },
    {
      pregunta: "¿Cuál es la herramienta más recomendada para analizar múltiples años de estados financieros simultáneamente?",
      opciones: ["Excel tradicional", "NotebookLM de Google", "Canva", "Power BI sin IA"],
      respuesta: 1,
      explicacion:
        "NotebookLM de Google permite subir múltiples documentos (varios años de estados financieros) y analizarlos en conjunto, identificando tendencias temporales que serían difíciles de ver año por año.",
    },
  ],
  ejercicio: {
    titulo: "Análisis comparativo 2023-2024 con detección de señales de alerta",
    objetivo:
      "Analizar dos años de estados financieros de una empresa ecuatoriana ficticia para identificar tendencias, señales de alerta y recomendaciones ejecutivas usando ChatGPT",
    herramientas: "ChatGPT / Claude.ai + Google Docs + Google Sheets",
    datosEjemplo:
      "TECNOSERV S.A. — Empresa de servicios tecnológicos, Quito\n\n2023:\n• Ventas: $420,000\n• Costo de Ventas: $189,000\n• Gastos Operativos: $168,000\n• Utilidad Neta: $63,000\n• Activo Total: $380,000\n• Deuda Total: $152,000\n\n2024:\n• Ventas: $680,000\n• Costo de Ventas: $340,000\n• Gastos Operativos: $295,000\n• Utilidad Neta: $45,000\n• Activo Total: $520,000\n• Deuda Total: $280,000",
    pasos: [
      "Crear nueva conversación en ChatGPT titulada 'Análisis TECNOSERV 2023-2024'",
      "Enviar prompt de análisis horizontal: 'Eres analista financiero en Ecuador. Aquí tienes los estados financieros de TECNOSERV S.A. de 2023 y 2024: [pegar datos]. Realiza análisis horizontal: calcula la variación absoluta y porcentual de cada línea entre 2023 y 2024. Presenta en tabla con semáforo (verde si mejora, amarillo si varía entre -10% y -25%, rojo si cae más del 25% o genera alerta)'",
      "Enviar prompt de análisis de rentabilidad: 'Calcula los márgenes bruto, operativo y neto para 2023 y 2024. ¿En qué dirección van? ¿Qué está pasando con la rentabilidad mientras las ventas crecen?'",
      "Enviar prompt de señales de alerta: 'Identifica las 3 señales de alerta más importantes en estos dos años. Para cada una: nombre de la alerta, dato que la evidencia, posible causa y acción correctiva recomendada para una empresa ecuatoriana'",
      "Construir tabla comparativa en Google Sheets con los datos de ambos años y los ratios calculados por ChatGPT (verificar al menos 3 manualmente)",
      "Solicitar a ChatGPT el reporte ejecutivo final: 'Redacta un memo ejecutivo de 300 palabras para el Directorio de TECNOSERV S.A. con: situación financiera actual, 2 fortalezas, 3 riesgos críticos y 3 acciones inmediatas para Q1 2025'",
      "Copiar el memo a Google Docs con formato profesional: encabezado, fecha, destinatario, cuerpo y firma",
    ],
    resultado:
      "Análisis financiero comparativo 2023-2024 con tabla de variaciones, análisis de márgenes, identificación de 3 señales de alerta y memo ejecutivo de 300 palabras listo para presentar a directorio.",
    criterios: [
      { criterio: "Análisis horizontal completo con variaciones calculadas correctamente", puntos: 25 },
      { criterio: "Identificación correcta de señales de alerta con evidencia numérica", puntos: 30 },
      { criterio: "Calidad del memo ejecutivo (claridad, accionable, lenguaje apropiado)", puntos: 25 },
      { criterio: "Verificación manual de al menos 3 cálculos", puntos: 10 },
      { criterio: "Formato profesional del entregable final", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "SUPERCIAS — Estados financieros por sector Ecuador",
      url: "https://appscvs.supercias.gob.ec/rankCias/",
      tipo: "documentacion",
      descripcion: "Ranking de compañías ecuatorianas con estados financieros públicos. Ideal para benchmarking sectorial.",
    },
    {
      titulo: "CFN — Corporación Financiera Nacional Ecuador",
      url: "https://www.cfn.fin.ec/",
      tipo: "documentacion",
      descripcion: "Información sobre créditos de fomento productivo en Ecuador, requisitos financieros y tasas vigentes.",
    },
    {
      titulo: "Claude.ai — Anthropic",
      url: "https://claude.ai",
      tipo: "herramienta",
      descripcion: "Alternativa a ChatGPT con mayor capacidad de contexto para documentos largos. Plan gratuito permite subir archivos.",
    },
    {
      titulo: "Análisis financiero vertical y horizontal — Khan Academy",
      url: "https://es.khanacademy.org/economics-finance-domain/core-finance",
      tipo: "lectura",
      descripcion: "Cursos gratuitos en español sobre análisis financiero fundamental, contabilidad y finanzas corporativas.",
    },
  ],
  teoria: `El análisis de estados financieros es el corazón de la gestión financiera profesional. Los tres documentos fundamentales — el Balance General, el Estado de Resultados y el Flujo de Caja — son como las tres vistas arquitectónicas de un edificio: el balance es la planta (qué hay), el estado de resultados es el corte longitudinal (qué pasó durante el período), y el flujo de caja es el movimiento real de recursos (cuándo entran y salen los pesos y dólares reales).

El Balance General o Estado de Situación Financiera muestra la posición financiera de la empresa en un momento específico. Del lado izquierdo están los activos (lo que la empresa tiene o le deben): activos corrientes como caja, inventarios y cuentas por cobrar; y activos no corrientes como maquinaria, equipos y edificios. Del lado derecho están las fuentes de financiamiento: pasivos (deudas) y patrimonio (capital propio). La ecuación fundamental es siempre: Activos = Pasivos + Patrimonio.

El Estado de Resultados muestra el desempeño durante un período, generalmente un año o un trimestre. Comienza con las ventas brutas, resta las devoluciones para obtener ventas netas, resta el costo de ventas para obtener utilidad bruta, resta los gastos operativos para obtener utilidad operativa (EBIT), resta los intereses para obtener utilidad antes de impuestos, y finalmente resta el impuesto a la renta (22% en Ecuador para sociedades) para llegar a la utilidad neta.

Con ChatGPT, el análisis vertical del Estado de Resultados se hace en segundos: cada línea se expresa como porcentaje de las ventas netas. Si el costo de ventas representa el 62% de las ventas, ese es el margen bruto invertido. Si está aumentando año a año, hay un problema de eficiencia productiva o poder de negociación con proveedores. El análisis vertical revela la estructura de costos de la empresa.

El análisis horizontal compara períodos y calcula variaciones absolutas y porcentuales. Una empresa cuyas ventas crecen 78% pero cuya utilidad cae 75% está en una trampa de crecimiento: está invirtiendo más de lo que gana. Este patrón es especialmente común en startups ecuatorianas que reciben inversión y contratan agresivamente sin controlar costos.

Para las empresas ecuatorianas que buscan crédito, el EBITDA (Earnings Before Interest, Taxes, Depreciation and Amortization) es un indicador crítico. La CFN, BanEcuador, Banco Pichincha y Produbanco lo usan para calcular la cobertura de deuda: si el EBITDA anual es $200,000 y la deuda anual a pagar es $80,000, la cobertura es 2.5x — considerada saludable. Una cobertura por debajo de 1.2x es señal de alarma para los bancos.

Las señales de alerta que la IA detecta rápidamente son patrones invisibles para el ojo humano en tablas de números: utilidad positiva con flujo de caja negativo (indica que las ventas están siendo a crédito pero no se están cobrando), inventario creciendo más rápido que ventas (sobrestock que inmoviliza capital), deuda financiera creciendo mientras las utilidades caen (trampa de deuda), y gastos de personal creciendo desproporcionadamente (pérdida de productividad por persona). Cuando le das estos datos a ChatGPT con el prompt correcto, los identifica y cuantifica en segundos.

La práctica recomendada es siempre verificar al menos 2-3 cálculos manualmente. Los LLMs son muy buenos interpretando tendencias y generando narrativas, pero cometen errores aritméticos en cálculos complejos con muchos decimales. La regla es: usa la IA para el análisis e interpretación, verifica los números con calculadora antes de presentarlos a un directorio o al banco.`,
};

const tema3: TemaC9 = {
  id: 3,
  titulo: "Presupuestación inteligente asistida por IA",
  modulo: MOD1,
  moduloNum: 1,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Presupuestos empresariales con IA — Método práctico",
  videoDuracion: "~38 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "Presupuestación Inteligente Asistida por IA\nC9. Finanzas e IA Predictiva — Tema 3\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Por qué los presupuestos tradicionales fallan?",
      contenido:
        "Falla 1: Se hacen una vez al año y no se actualizan\nFalla 2: Basados en porcentaje del año anterior (+5%) sin análisis\nFalla 3: No contemplan estacionalidad del mercado ecuatoriano\nFalla 4: Desconectados del flujo de caja real\nFalla 5: Generados por finanzas sin input de ventas ni operaciones\n\nResultado: 73% de empresas ecuatorianas tienen variaciones presupuestales superiores al 20%.",
    },
    {
      titulo: "Presupuesto base cero con IA",
      contenido:
        "¿Qué es? Comenzar el presupuesto desde cero cada período, justificando cada gasto.\nVentaja: elimina gastos históricos innecesarios\nDesventaja: requiere más tiempo y datos\n\nCon IA: le das las actividades planificadas y ChatGPT estima costos referenciales para Ecuador, sugiere categorías que olvidas y detecta gastos que no tienen retorno claro.",
    },
    {
      titulo: "Estacionalidad del mercado ecuatoriano",
      contenido:
        "Enero-Febrero: bajo en ventas, alto en gastos (matriculas, ropa escolar)\nMayo (Día de la Madre): pico de consumo 35% sobre promedio\nAgosto-Septiembre: inicio escolar — alto en Ecuador Costa\nNoviembre-Diciembre: Black Friday + Navidad + Año Nuevo\nFeriados: Carnaval y Semana Santa = caída en ventas B2B\n\nPrompt clave: 'Ajusta este presupuesto mensual considerando la estacionalidad ecuatoriana para el sector [tu sector]'",
    },
    {
      titulo: "Rolling Forecast — el presupuesto que sí funciona",
      contenido:
        "En lugar de un presupuesto anual rígido: Rolling Forecast = siempre 12 meses adelante\nCada mes: actualizar el mes siguiente basándose en datos reales del mes anterior\nCon IA: 'Actualiza mi forecast para los próximos 3 meses con estos datos reales de ventas de enero: [datos]'\n\nEmpresas que usan rolling forecast tienen 40% menos variaciones presupuestales.",
    },
    {
      titulo: "Presupuesto de ventas — cómo proyectar con IA",
      contenido:
        "Método 1: Bottom-up (suma de vendedores/canales) — más preciso\nMétodo 2: Top-down (% de participación de mercado) — más estratégico\nMétodo 3: Histórico ajustado — más rápido\n\nPrompt para ChatGPT:\n'Tengo estos datos históricos de ventas por mes durante 2 años [datos]. Proyecta los próximos 6 meses usando los tres métodos y explica cuál recomiendas para una empresa de [sector] en Ecuador'",
    },
    {
      titulo: "Escenarios: optimista, base y pesimista",
      contenido:
        "Siempre presupuestar tres escenarios:\nOptimista: todo va bien, crecimiento del 15-20%\nBase: proyección más probable, +5-8%\nPesimista: recesión, caída del 15-20%\n\nPor qué tres: el Banco Central del Ecuador cambió la tasa en 3 ocasiones en 2024. El tipo de cambio, si exportas, puede moverse. La incertidumbre política en Ecuador es real.\n\nPrompt: 'Crea tres escenarios para mi presupuesto 2025 basándote en estos datos históricos y estas hipótesis: [hipótesis]'",
    },
    {
      titulo: "Integración con hojas de cálculo",
      contenido:
        "ChatGPT puede generar la estructura del presupuesto, no los datos:\n• Pide que genere la plantilla de presupuesto en formato tabla\n• Exporta la respuesta a Google Sheets con Ctrl+V\n• Usa fórmulas de Sheets para los cálculos dinámicos\n• Gemini en Sheets puede ayudar con análisis directo en la hoja\n\nFlujo recomendado: ChatGPT diseña → Sheets calcula → ChatGPT interpreta variaciones.",
    },
    {
      titulo: "Indicadores de control presupuestal",
      contenido:
        "% de ejecución = Real / Presupuestado × 100\nVariación = Real - Presupuestado\n% de variación = Variación / Presupuestado × 100\n\nAlertas automáticas:\n🔴 Variación > 20%: investigar causa raíz inmediatamente\n🟡 Variación 10-20%: revisar en reunión semanal\n🟢 Variación < 10%: control normal\n\nPrompt: 'Analiza estas variaciones presupuestales [datos] y clasifica por semáforo. Para las rojas, sugiere 3 posibles causas y acción correctiva'",
    },
    {
      titulo: "Resumen del Tema 3",
      contenido:
        "1. Los presupuestos tradicionales fallan porque son estáticos y no contemplan estacionalidad\n2. Presupuesto base cero + IA elimina gastos innecesarios\n3. Rolling Forecast = siempre 12 meses adelante, actualizado mensualmente\n4. Siempre 3 escenarios: optimista, base, pesimista\n5. ChatGPT diseña la estructura, Sheets calcula, ChatGPT interpreta\n\nPróximo: Interpretación de resultados financieros para no financieros",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué es el Rolling Forecast en presupuestación?",
      opciones: [
        "Un presupuesto que rueda entre departamentos para su aprobación",
        "Un forecast que siempre mantiene 12 meses hacia adelante, actualizado mensualmente",
        "Un modelo de presupuesto basado en el promedio de los últimos 3 años",
        "Una técnica de reducción de costos usando IA",
      ],
      respuesta: 1,
      explicacion:
        "El Rolling Forecast mantiene siempre un horizonte futuro constante (típicamente 12 meses) que se actualiza cada mes con datos reales, reemplazando el presupuesto anual rígido.",
    },
    {
      pregunta: "En Ecuador, ¿cuándo ocurre el mayor pico de consumo según la estacionalidad?",
      opciones: ["Enero-Febrero", "Mayo (Día de la Madre)", "Julio (vacaciones)", "Octubre"],
      respuesta: 1,
      explicacion:
        "Mayo, con el Día de la Madre, es históricamente el mes de mayor consumo en Ecuador, con incrementos de hasta 35% sobre el promedio mensual en sectores como retail, restaurantes y servicios.",
    },
    {
      pregunta: "¿Qué significa un porcentaje de variación presupuestal del 25%?",
      opciones: [
        "Señal verde — variación normal",
        "Señal amarilla — revisar en reunión semanal",
        "Señal roja — investigar causa raíz inmediatamente",
        "No tiene significado sin contexto adicional",
      ],
      respuesta: 2,
      explicacion:
        "Una variación superior al 20% es señal roja que requiere investigación inmediata de la causa raíz. Puede indicar error en el presupuesto original, cambio inesperado en el mercado, o problema de control interno.",
    },
    {
      pregunta: "¿Cuál es la principal ventaja del presupuesto base cero?",
      opciones: [
        "Es más rápido de elaborar",
        "Siempre resulta en menor gasto total",
        "Elimina gastos históricos innecesarios al justificar cada gasto desde cero",
        "Requiere menos datos para su elaboración",
      ],
      respuesta: 2,
      explicacion:
        "El presupuesto base cero obliga a justificar cada gasto en el período actual, independientemente de si existía el año anterior. Esto elimina gastos que se perpetúan por inercia sin generar valor.",
    },
    {
      pregunta: "¿Por qué se recomienda siempre presupuestar tres escenarios en el contexto ecuatoriano?",
      opciones: [
        "Por requisito del SRI",
        "La incertidumbre política, cambios de tasas y otros factores hacen necesario planificar para múltiples futuros",
        "Es un requisito de la SUPERCIAS",
        "Solo se aplica a empresas exportadoras",
      ],
      respuesta: 1,
      explicacion:
        "Ecuador enfrenta incertidumbre en tasas de interés (el Banco Central cambió tasas 3 veces en 2024), volatilidad política y riesgos de mercado que hacen imprescindible tener planes para escenarios optimista, base y pesimista.",
    },
  ],
  ejercicio: {
    titulo: "Construir un presupuesto de ventas trimestral con tres escenarios",
    objetivo:
      "Elaborar un presupuesto de ventas Q1 2025 con tres escenarios (optimista, base, pesimista) para una empresa ecuatoriana usando ChatGPT y Google Sheets",
    herramientas: "ChatGPT + Google Sheets + Google Docs",
    datosEjemplo:
      "ECOFLOR S.A. — Empresa florícola, Cayambe, Pichincha\nHistórico de ventas 2024 (miles USD):\n• Enero: $45K\n• Febrero: $52K (San Valentín)\n• Marzo: $38K\n• Octubre: $41K\n• Noviembre: $48K\n• Diciembre: $61K (Navidad)\nPromedio mensual 2024: $47K\nCrecimiento 2024 vs 2023: +8%\nPrincipal mercado: exportación a EE.UU. (65%) y Europa (35%)\nRiesgo identificado: volatilidad tipo de cambio EUR/USD",
    pasos: [
      "Crear Google Sheet 'Presupuesto Q1 2025 ECOFLOR'",
      "En ChatGPT, enviar: 'Eres CFO de ECOFLOR S.A., empresa florícola de Cayambe Ecuador. Aquí están los datos históricos de ventas 2024: [pegar datos]. Proyecta las ventas para Q1 2025 (enero, febrero, marzo) con tres escenarios: Optimista (+20% vs Q1 2024 por mejor clima y contratos nuevos), Base (+8% consistente con la tendencia), Pesimista (-15% por caída EUR/USD y restricciones fitosanitarias USA). Presenta en tabla mes a mes con totales trimestrales y supuestos de cada escenario'",
      "Copiar la tabla de escenarios al Google Sheet en tres pestañas separadas",
      "En la pestaña 'Análisis', crear tabla comparativa de los tres escenarios con fórmulas que calculen: diferencia entre optimista y pesimista, rango de incertidumbre, y punto de equilibrio de ventas mínimo para cubrir costos fijos (solicitar a ChatGPT el cálculo del punto de equilibrio con datos de estructura de costos: 60% variable, 40% fijo)",
      "Solicitar a ChatGPT: 'Para el escenario pesimista de ECOFLOR, lista 5 acciones de contingencia que la empresa puede tomar en Q1 2025 para mitigar el impacto. Considera el contexto ecuatoriano: acceso a crédito CFN, opciones de mercado interno, etc.'",
      "Crear gráfico de barras agrupadas en Sheets mostrando los tres escenarios por mes",
      "Elaborar en Google Docs un memo de 250 palabras para la junta directiva presentando el presupuesto Q1, los tres escenarios y la recomendación de activar el plan de contingencia si las ventas de enero están por debajo del escenario base",
    ],
    resultado:
      "Google Sheet con presupuesto Q1 2025 en tres escenarios para ECOFLOR, análisis comparativo, gráfico visual y memo ejecutivo para directorio con plan de contingencia para escenario pesimista.",
    criterios: [
      { criterio: "Tres escenarios correctamente construidos con supuestos explícitos", puntos: 30 },
      { criterio: "Cálculo del punto de equilibrio correcto", puntos: 20 },
      { criterio: "Plan de contingencia relevante para el contexto ecuatoriano", puntos: 20 },
      { criterio: "Calidad del memo ejecutivo y la recomendación accionable", puntos: 20 },
      { criterio: "Presentación visual (gráfico, formato del Sheet)", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "Banco Central del Ecuador — Tasas de interés y estadísticas",
      url: "https://www.bce.fin.ec/index.php/estadisticas-economicas",
      tipo: "documentacion",
      descripcion: "Datos oficiales del BCE Ecuador: tasas de interés, inflación, tipo de cambio y estadísticas macroeconómicas para fundamentar presupuestos.",
    },
    {
      titulo: "Plantillas de presupuesto — Google Sheets",
      url: "https://docs.google.com/spreadsheets/",
      tipo: "herramienta",
      descripcion: "Google Sheets con plantillas de presupuesto disponibles en la galería. Gratuito con cuenta Google.",
    },
    {
      titulo: "Rolling Forecast Best Practices — CFO.com",
      url: "https://www.cfo.com/forecasting/",
      tipo: "lectura",
      descripcion: "Guías y mejores prácticas de CFOs sobre implementación de rolling forecast en empresas medianas.",
    },
    {
      titulo: "INEC — Estadísticas económicas Ecuador",
      url: "https://www.ecuadorencifras.gob.ec/estadisticas/",
      tipo: "documentacion",
      descripcion: "Instituto Nacional de Estadística y Censos. Datos económicos oficiales de Ecuador para fundamentar proyecciones de mercado.",
    },
  ],
  teoria: `La presupuestación es el proceso de planificación financiera que traduce los objetivos estratégicos de una empresa en números concretos: cuánto vender, cuánto gastar, cuánto invertir y cuánto ganar en un período determinado. Es el mapa de ruta financiero de la empresa. Sin presupuesto, tomar decisiones financieras es como conducir en la noche sin faros.

El problema de los presupuestos tradicionales ecuatorianos es que se hacen una vez al año, en diciembre, con el modelo "año anterior más un porcentaje arbitrario", y luego se archivan. Las variaciones del 20%, 30% o 50% entre lo presupuestado y lo real son normales en empresas sin cultura financiera sólida. La consecuencia es que las decisiones de gasto o inversión se toman sin saber si el presupuesto lo soporta.

La inteligencia artificial transforma el proceso presupuestal de tres maneras fundamentales. Primero, la velocidad de construcción: lo que antes tomaba semanas de reuniones, consolidación de datos y revisiones, ahora puede estructurarse en pocas horas con ChatGPT armando la plantilla, sugiriendo categorías, estimando costos referenciales para el mercado ecuatoriano y detectando omisiones. Segundo, la calidad del análisis: la IA puede procesar datos históricos y generar proyecciones estadísticas más sofisticadas que el simple "más 5%". Tercero, la flexibilidad: generar escenarios múltiples en minutos en lugar de días.

El Rolling Forecast es la metodología presupuestal más efectiva para empresas que operan en contextos volátiles como Ecuador. En lugar de comprometerse a un presupuesto anual que queda obsoleto en marzo, el rolling forecast mantiene siempre un horizonte de 12 meses hacia adelante. Cada mes, se actualizan los datos reales y se re-proyectan los meses futuros. ChatGPT es perfecto para este proceso: le das los datos reales del mes que cerró y te actualiza el forecast de los próximos 3-6 meses en segundos.

La estacionalidad del mercado ecuatoriano es un factor crítico que los modelos de IA deben considerar. Febrero tiene el pico de San Valentín; mayo, el Día de la Madre (el mayor pico de consumo del año); agosto-septiembre, el inicio escolar en la Costa; noviembre, Black Friday; y diciembre, la triple combinación de Navidad, Año Nuevo y aguinaldos. Un presupuesto que no contempla estos patrones estará equivocado por diseño.

El presupuesto base cero (Zero-Based Budgeting) es particularmente útil cuando la empresa ha tenido varios años de alta inflación de costos o cuando se detecta "engorde" presupuestal: gastos que se perpetúan año a año sin generar valor. Con ChatGPT, el proceso se facilita enormemente: le das la lista de actividades y proyectos planificados para el período, y el modelo estima costos referenciales para Ecuador, sugiere categorías que podrías omitir y calcula el total. La empresa valida y ajusta, pero no parte de cero sin información.

Los tres escenarios son imprescindibles en el contexto ecuatoriano actual. La incertidumbre política, los cambios frecuentes en política tributaria (el IVA subió del 12% al 15% en 2024), la volatilidad del precio del petróleo que afecta al presupuesto del Estado y por ende a la inversión pública, y los riesgos climáticos para sectores agrícolas y florícolas hacen que planificar un solo escenario sea irresponsable. El escenario base es la proyección más probable; el optimista asume que las apuestas estratégicas se cumplen; el pesimista tiene un plan de contingencia claro con las acciones a tomar si las ventas caen.`,
};

const tema4: TemaC9 = placeholder(4, "Interpretación financiera para no financieros con IA", MOD1, 1);
const tema5: TemaC9 = placeholder(5, "Dashboards financieros automatizados con IA", MOD1, 1);

// ─── MÓDULO 2: Modelos predictivos para cash flow ────────────────────────────

const MOD2 = "Modelos predictivos para cash flow";

const tema6: TemaC9 = {
  id: 6,
  titulo: "Fundamentos de predicción de flujo de caja",
  modulo: MOD2,
  moduloNum: 2,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Predicción de flujo de caja con Machine Learning",
  videoDuracion: "~42 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "Fundamentos de Predicción de Flujo de Caja\nC9. Finanzas e IA Predictiva — Tema 6\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "¿Por qué el flujo de caja mata empresas rentables?",
      contenido:
        "Dato: 82% de los fracasos empresariales tienen como causa directa problemas de flujo de caja, no de rentabilidad\n\nEjemplo Ecuador: empresa constructora con contrato de $500K, gana $80K de utilidad, pero cobra en 90 días. Tiene que pagar salarios, materiales y proveedores hoy. Sin flujo de caja positivo = quiebra aunque sea rentable en papel.",
    },
    {
      titulo: "Flujo de caja directo vs indirecto",
      contenido:
        "Método Directo: registra entradas y salidas reales de efectivo\n+ Cobros de clientes: $X\n- Pagos a proveedores: $X\n- Pagos de nómina: $X\n= Flujo operativo neto\n\nMétodo Indirecto: parte de la utilidad neta y ajusta\n+ Utilidad neta\n+ Depreciaciones (no cash)\n+/- Cambios en capital de trabajo\n= Flujo operativo\n\nPara predicción con IA: el directo es más preciso.",
    },
    {
      titulo: "Datos necesarios para predicción con ML",
      contenido:
        "Datos históricos (mínimo 24 meses):\n• Cobros diarios/semanales (por cliente o canal)\n• Pagos a proveedores (fechas reales)\n• Nómina (fija, exacta y predecible)\n• Obligaciones tributarias (IVA mensual, renta anual, IESS)\n• Créditos bancarios (tabla de amortización exacta)\n\nCalidad del dato = calidad de la predicción. Garbage in → garbage out.",
    },
    {
      titulo: "Modelos de predicción de series temporales",
      contenido:
        "ARIMA: clásico, para series con tendencia y estacionalidad\nProphet (Meta/Facebook): diseñado para datos empresariales con estacionalidad múltiple\nLSTM: red neuronal, mejor para patrones complejos no lineales\nXGBoost con features de tiempo: muy popular en fintech\n\nPara empresas ecuatorianas medianas: Prophet es el mejor punto de partida — gratuito, Python/R, fácil de implementar.",
    },
    {
      titulo: "Prophet — predicción de flujo de caja paso a paso",
      contenido:
        "1. Instalar: pip install prophet\n2. Preparar datos: columna 'ds' (fecha) y 'y' (valor)\n3. Agregar estacionalidad: navidad, día de la madre, inicio escolar\n4. Entrenar el modelo: m.fit(df)\n5. Crear futuro: m.make_future_dataframe(periods=90)\n6. Predecir: forecast = m.predict(future)\n7. Visualizar con m.plot(forecast)\n\nCon datos de 2 años, predice 90 días con error típico del 12-18%.",
    },
    {
      titulo: "Cash Flow en riesgo (CFaR)",
      contenido:
        "Concepto análogo al VaR en trading financiero\nCFaR: ¿cuál es la peor caída de flujo de caja que puedo esperar con 95% de confianza?\n\nAplicación Ecuador: empresa que vende al sector público (gobierno)\n• Alta probabilidad de pago, pero retrasos de 60-90 días\n• CFaR cuantifica el riesgo de liquidez en esos 90 días\n• Permite saber cuánto efectivo reservar como colchón\n\nChatGPT puede explicar el concepto; Python calcula el número.",
    },
    {
      titulo: "Alertas tempranas de crisis de liquidez",
      contenido:
        "Sistema de semáforo para los próximos 30 días:\n🔴 Rojo: el modelo predice flujo negativo en los próximos 7 días — acción inmediata\n🟡 Amarillo: flujo positivo pero con tendencia a bajar — activar cobranza preventiva\n🟢 Verde: flujo sano, sin acciones urgentes\n\nHerramientas que ya tienen esto integrado: Fathom, Float, Pulse para PyMEs (algunas con 14 días trial gratuito).",
    },
    {
      titulo: "Caso Ecuador — empresa de servicios profesionales",
      contenido:
        "Empresa: Consultoría de RR.HH., Quito\nProblema: facturaban puntual pero cobros llegaban entre 45 y 120 días\nSolución: modelo Prophet entrenado con 36 meses de cobros históricos\nResultado: predicción de entradas de caja con 85% de precisión para 60 días\nBeneficio: dejaron de tomar crédito de tarjeta corporativa (ahorro $800/mes en intereses)",
    },
    {
      titulo: "Resumen del Tema 6",
      contenido:
        "1. El flujo de caja mata empresas rentables — es el indicador más crítico\n2. Para predicción: datos históricos mínimo 24 meses, limpios y consistentes\n3. Prophet (Meta) es el mejor modelo para empezar: gratuito y fácil\n4. CFaR cuantifica el riesgo de liquidez como un seguro contra crisis\n5. Las alertas tempranas permiten actuar antes de la crisis, no durante\n\nPróximo: Prophet en Python — implementación práctica",
    },
  ],
  quiz: [
    {
      pregunta: "¿Qué porcentaje de fracasos empresariales tienen como causa directa problemas de flujo de caja?",
      opciones: ["35%", "52%", "82%", "91%"],
      respuesta: 2,
      explicacion:
        "Estudios de gestión empresarial indican que el 82% de los fracasos de empresas tienen problemas de flujo de caja como causa directa, aunque muchas sean rentables en papel.",
    },
    {
      pregunta: "¿Qué modelo de predicción de series temporales fue diseñado específicamente para datos empresariales con estacionalidad?",
      opciones: ["ARIMA clásico", "Prophet de Meta/Facebook", "LSTM sin capas", "Regresión lineal simple"],
      respuesta: 1,
      explicacion:
        "Prophet fue desarrollado por el equipo de Meta (Facebook) específicamente para series temporales de negocios con estacionalidad múltiple (semanal, anual, eventos especiales).",
    },
    {
      pregunta: "¿Cuántos meses de datos históricos se recomienda como mínimo para entrenar un modelo predictivo de flujo de caja?",
      opciones: ["6 meses", "12 meses", "24 meses", "48 meses"],
      respuesta: 2,
      explicacion:
        "24 meses es el mínimo recomendado para capturar dos ciclos de estacionalidad anual completos, lo que permite al modelo aprender patrones recurrentes como Navidad, Día de la Madre, etc.",
    },
    {
      pregunta: "¿Qué significa CFaR en gestión financiera?",
      opciones: [
        "Cash Flow and Revenue",
        "Cash Flow at Risk — la peor caída esperada de flujo de caja con cierto nivel de confianza",
        "Corporate Financial and Accounting Report",
        "Cash Forecast Adjusted for Receivables",
      ],
      respuesta: 1,
      explicacion:
        "Cash Flow at Risk (CFaR) es el análogo del Value at Risk para el flujo de caja. Cuantifica la peor caída de liquidez esperada con un nivel de confianza determinado (típicamente 95%).",
    },
    {
      pregunta: "En el caso de la consultora de Quito, ¿cuál fue el beneficio medible de implementar predicción de flujo de caja?",
      opciones: [
        "Incrementaron ventas en 30%",
        "Dejaron de usar crédito de tarjeta corporativa, ahorrando $800/mes en intereses",
        "Redujeron su nómina en 20%",
        "Obtuvieron crédito CFN a tasa preferencial",
      ],
      respuesta: 1,
      explicacion:
        "Con la predicción de flujo de caja con 85% de precisión para 60 días, la consultora pudo planificar su liquidez y dejó de recurrir al crédito de tarjeta corporativa, ahorrando $800 mensuales en intereses.",
    },
  ],
  ejercicio: {
    titulo: "Implementar predicción de flujo de caja con Prophet en Google Colab",
    objetivo:
      "Construir un modelo predictivo de flujo de caja usando Prophet en Python con Google Colab y datos simulados de una empresa ecuatoriana",
    herramientas: "Google Colab (colab.research.google.com) + Python + Prophet + Pandas + Matplotlib",
    datosEjemplo:
      "Usar el dataset generado en el notebook: datos simulados de cobros mensuales de una empresa de servicios en Quito, 2022-2024, con estacionalidad de Día de la Madre (mayo), Navidad (diciembre) y caída en Carnaval (febrero).",
    pasos: [
      "Abrir Google Colab (colab.research.google.com) y crear notebook 'Prediccion_CashFlow_Ecuador'",
      "Instalar Prophet: ejecutar en celda: !pip install prophet",
      "Importar librerías: from prophet import Prophet; import pandas as pd; import matplotlib.pyplot as plt",
      "Crear dataset de ejemplo: generar 36 meses de datos de cobros con estacionalidad ecuatoriana (copiar el código que ChatGPT proporcione al pedir: 'Genera código Python para crear un DataFrame de pandas con 36 meses de cobros simulados para una empresa en Ecuador, con estacionalidad en mayo y diciembre, y bajada en carnaval')",
      "Preparar datos para Prophet: df = df.rename(columns={'fecha': 'ds', 'cobros': 'y'})",
      "Configurar y entrenar el modelo: m = Prophet(seasonality_mode='multiplicative'); m.add_seasonality(name='carnaval', period=365.25, fourier_order=3); m.fit(df)",
      "Crear dataframe futuro y predecir: future = m.make_future_dataframe(periods=90); forecast = m.predict(future)",
      "Visualizar: m.plot(forecast); m.plot_components(forecast) — identificar los componentes de tendencia y estacionalidad",
      "Exportar las predicciones a CSV: forecast[['ds','yhat','yhat_lower','yhat_upper']].to_csv('prediccion_cashflow.csv')",
      "Pegar los resultados (primeras 10 filas del forecast) en ChatGPT y pedir: 'Interpreta esta predicción de flujo de caja para una empresa ecuatoriana. ¿Qué meses tienen mayor riesgo de liquidez? ¿Qué acciones recomiendas?'",
    ],
    resultado:
      "Notebook en Google Colab con modelo Prophet funcionando, gráfico de predicción de 90 días, componentes de estacionalidad identificados y análisis narrativo generado por ChatGPT con recomendaciones para el contexto ecuatoriano.",
    criterios: [
      { criterio: "Código Python ejecuta sin errores en Google Colab", puntos: 30 },
      { criterio: "Gráfico de predicción con componentes de tendencia y estacionalidad visible", puntos: 25 },
      { criterio: "Identificación correcta de los meses de mayor riesgo de liquidez", puntos: 20 },
      { criterio: "Análisis narrativo de las predicciones con recomendaciones accionables", puntos: 15 },
      { criterio: "Exportación del forecast a CSV", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "Prophet — Documentación oficial de Meta",
      url: "https://facebook.github.io/prophet/",
      tipo: "documentacion",
      descripcion: "Documentación oficial de Prophet con tutoriales, guía de instalación y ejemplos para predicción de series temporales de negocios.",
    },
    {
      titulo: "Google Colab — Entorno Python gratuito en la nube",
      url: "https://colab.research.google.com",
      tipo: "herramienta",
      descripcion: "Jupyter notebooks gratuitos en la nube de Google. No requiere instalación local. Perfecto para aprender Prophet y análisis de datos.",
    },
    {
      titulo: "Flujo de caja y liquidez — Investopedia",
      url: "https://www.investopedia.com/terms/c/cashflow.asp",
      tipo: "lectura",
      descripcion: "Guía completa sobre flujo de caja, tipos de flujo (operativo, inversión, financiero) y cómo interpretar el estado de flujos.",
    },
    {
      titulo: "Float — Herramienta de forecasting de cash flow para PyMEs",
      url: "https://floatapp.com",
      tipo: "herramienta",
      descripcion: "Aplicación de predicción de flujo de caja para pequeñas y medianas empresas. Integra con Xero y QuickBooks. Trial gratuito disponible.",
    },
  ],
  teoria: `El flujo de caja es el oxígeno de las empresas. Una empresa puede ser rentable en papel — con utilidades sólidas y buenos márgenes — y quebrar porque no tiene efectivo disponible para pagar salarios, proveedores o deudas bancarias en sus fechas de vencimiento. Este es el escenario que los estudios indican afecta al 82% de los fracasos empresariales: no es la falta de rentabilidad, sino la falta de liquidez en el momento preciso.

En Ecuador, el problema del flujo de caja tiene características propias. Las empresas que venden al sector público (ministerios, GADs, hospitales públicos) enfrentan retrasos de pago de 60 a 180 días, aunque los contratos especifiquen pagos a 30 días. Las constructoras que trabajan en obras públicas financian semanas o meses de operación con su propio capital de trabajo antes de recibir planillas. Las empresas exportadoras tienen exposición a tipos de cambio y retrasos en transferencias internacionales. Las empresas medianas con clientes corporativos típicamente cobran entre 45 y 90 días.

La predicción de flujo de caja con machine learning busca responder una pregunta simple pero crítica: ¿cuánto efectivo voy a tener disponible en los próximos 30, 60 y 90 días? Los métodos estadísticos clásicos (proyección lineal, promedio móvil) capturan tendencias simples pero fallan ante patrones complejos con múltiple estacionalidad. Los modelos de ML modernos, especialmente Prophet de Meta, están diseñados exactamente para este tipo de datos empresariales.

Prophet es el modelo de predicción de series temporales más utilizado para aplicaciones de negocios por tres razones: maneja múltiple estacionalidad simultáneamente (semanal, mensual, anual), permite incorporar eventos especiales con impacto conocido (Navidad, Día de la Madre, cierre fiscal de junio en Ecuador), y es robusto ante datos faltantes. Su implementación en Python es relativamente accesible incluso para profesionales sin formación matemática profunda.

Los datos necesarios para construir un modelo predictivo de flujo de caja son: al menos 24 meses de datos históricos de cobros (entradas de efectivo) con fechas reales de recepción (no fechas de factura), datos de pagos a proveedores con fechas de vencimiento, estructura de nómina fija y variable, calendario de obligaciones tributarias (IVA el 28 de cada mes, impuesto a la renta en abril, contribuciones IESS el 15 de cada mes), y tabla de amortización de créditos bancarios. La calidad del dato es directamente proporcional a la calidad de la predicción.

El concepto de Cash Flow at Risk (CFaR) es el análogo del Value at Risk del mundo trading aplicado al flujo de caja operativo. Responde a la pregunta: con 95% de confianza, ¿cuál es el peor escenario de flujo de caja que puedo enfrentar en los próximos 30 días? Este número le dice a la empresa cuánto efectivo de reserva debe mantener. Para una empresa de servicios ecuatoriana con ingresos de $80,000 mensuales, el CFaR típico podría estar entre $15,000 y $25,000, lo que significa que ese debe ser el mínimo de caja disponible en todo momento.

Las alertas tempranas de crisis de liquidez son quizás el mayor valor práctico de estos modelos. En lugar de descubrir que no hay efectivo el día 28 cuando hay que pagar nómina, el sistema alerta 2-3 semanas antes que el flujo proyectado estará por debajo del umbral seguro. Esto da tiempo suficiente para activar cobranza preventiva, negociar extensión de pago con proveedores, activar línea de crédito bancaria con anticipación (que siempre es más barato que pedir un préstamo de emergencia), o postergar inversiones no urgentes.`,
};

const tema7: TemaC9 = placeholder(7, "Prophet en Python — implementación práctica", MOD2, 2);
const tema8: TemaC9 = placeholder(8, "Modelos de regresión para predicción financiera", MOD2, 2);
const tema9: TemaC9 = placeholder(9, "Integración de datos externos (BCE, SRI) en modelos predictivos", MOD2, 2);
const tema10: TemaC9 = placeholder(10, "Evaluación y mejora de modelos predictivos financieros", MOD2, 2);

// ─── MÓDULO 3: Detección de fraude con ML ───────────────────────────────────

const MOD3 = "Detección de fraude con ML";

const tema11: TemaC9 = {
  id: 11,
  titulo: "Fundamentos de detección de fraude financiero con IA",
  modulo: MOD3,
  moduloNum: 3,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "Detección de fraude bancario con Machine Learning — Español",
  videoDuracion: "~45 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "Fundamentos de Detección de Fraude Financiero con IA\nC9. Finanzas e IA Predictiva — Tema 11\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "El fraude financiero en Ecuador — cifras reales",
      contenido:
        "• Fraude bancario en Ecuador: más de $45 millones anuales estimados (ABPE 2023)\n• Fraude en comercio electrónico: crecimiento del 180% post-pandemia\n• Phishing y suplantación de identidad: principal vector en Ecuador\n• Fraude interno corporativo (empleados): 35% de los casos reportados\n• SRI detecta evasión fiscal por $1,200 millones anuales usando IA\n\nContexto: Ecuador adoptó sistema de facturación electrónica precisamente para facilitar detección de fraude fiscal con IA.",
    },
    {
      titulo: "Tipos de fraude que ML puede detectar",
      contenido:
        "Fraude en transacciones: tarjetas clonadas, compras inusuales\nFraude de identidad: apertura de cuentas con documentos falsos\nFraude interno: empleados que manipulan registros contables\nFraude en seguros: reclamaciones infladas o inventadas\nLavado de dinero: estructuración de transacciones para ocultar origen\nFraude fiscal: facturas falsas, precios de transferencia manipulados\n\nEcuador: el SRI usa ML para cruzar facturas y detectar contribuyentes con inconsistencias.",
    },
    {
      titulo: "El problema del desbalance de clases",
      contenido:
        "Challenge técnico central: en datasets de fraude, solo el 0.1-2% de transacciones son fraudulentas\n\nSi el modelo dice 'todo es legítimo': 99% de precisión, 0% útil\n\nSoluciones:\n• SMOTE: sobremuestreo sintético de la clase minoritaria (fraude)\n• Class weights: penalizar más los errores de la clase minoritaria\n• Umbral de clasificación: bajar el threshold de 50% a 20-30%\n• Métrica correcta: no accuracy → usar Recall, Precision, F1-Score, AUC-ROC",
    },
    {
      titulo: "Algoritmos más usados en detección de fraude",
      contenido:
        "Isolation Forest: detecta anomalías aislando puntos en el espacio de features — no supervisado\nRandom Forest: ensemble de árboles de decisión, muy robusto — supervisado\nXGBoost/LightGBM: gradient boosting, estado del arte en tabular data — supervisado\nAutoEncoders: red neuronal que aprende patrones normales y flagea lo que no encaja — semisupervisado\n\nBancos grandes (Pichincha, Produbanco): usan XGBoost + reglas de negocio híbridas.",
    },
    {
      titulo: "Features (variables) clave en modelos de fraude",
      contenido:
        "Comportamentales: horario inusual, monto atípico para el cliente, nueva ubicación geográfica\nRed: ip_address nueva, dispositivo no reconocido, velocidad imposible (2 transacciones en países distintos en 1 hora)\nHistóricas: frecuencia de transacciones últimos 7 días, monto promedio histórico, anomalía vs promedio\nContextuales: producto de alto riesgo (criptomonedas, giftcards), receptor de alto riesgo, país de destino\n\nRegla: cuantos más features de comportamiento, mejor el modelo.",
    },
    {
      titulo: "Métricas correctas para fraude",
      contenido:
        "Precision: de los que el modelo dice 'fraude', ¿cuántos son realmente fraude? (falsos positivos)\nRecall: de los fraudes reales, ¿cuántos detecta el modelo? (falsos negativos)\nF1-Score: media armónica de Precision y Recall\nAUC-ROC: qué tan bien separa fraude de legítimo en todos los umbrales\n\nPrioridad en fraude: maximizar Recall (no perder fraudes) aunque baje Precision (algunas alertas falsas son aceptables).",
    },
    {
      titulo: "Regulación y privacidad en Ecuador",
      contenido:
        "LOPDP: los datos de transacciones son datos personales protegidos\nBCE resoluciones: bancos deben reportar transacciones sospechosas (STR)\nUAF (Unidad de Análisis Financiero): recibe reportes de lavado de dinero\nJunta de Política y Regulación Financiera: normas para sistemas de control de fraude\n\nBuena práctica: los modelos de fraude deben ser auditables — el banco debe poder explicar por qué marcó una transacción como sospechosa.",
    },
    {
      titulo: "Falsos positivos — el costo real",
      contenido:
        "Un falso positivo = bloquear la tarjeta de un cliente legítimo\nImpacto: cliente molesto, llamada al call center, pérdida de confianza, posible churn\n\nBalance delicado:\n• Demasiados falsos positivos: experiencia del cliente destruida\n• Pocos falsos positivos: más fraude pasa desapercibido\n\nSolución: sistema de niveles\n1er nivel: alerta automática → verificación adicional (SMS/email)\n2do nivel: bloqueo temporal → call center\n3er nivel: bloqueo permanente → análisis manual",
    },
    {
      titulo: "Resumen del Tema 11",
      contenido:
        "1. Ecuador: +$45M/año en fraude bancario, creciendo con el comercio digital\n2. El desbalance de clases es el principal reto técnico\n3. Usar Recall y AUC-ROC, no Accuracy, para evaluar modelos de fraude\n4. XGBoost y Random Forest son el estado del arte para datos tabulares\n5. La regulación ecuatoriana (LOPDP, BCE, UAF) exige modelos auditables\n\nPróximo: Implementar un detector de anomalías con Isolation Forest en Python",
    },
  ],
  quiz: [
    {
      pregunta: "¿Por qué no se debe usar 'Accuracy' como métrica principal en modelos de detección de fraude?",
      opciones: [
        "Porque la Accuracy requiere más datos de entrenamiento",
        "Porque si el 99% de transacciones son legítimas, un modelo que dice 'todo es legítimo' tiene 99% de Accuracy pero es inútil",
        "Porque la Accuracy solo funciona con datos numéricos",
        "Porque es una métrica deprecada en Python sklearn",
      ],
      respuesta: 1,
      explicacion:
        "El desbalance extremo de clases hace que la Accuracy sea engañosa: un modelo trivial que predice siempre 'legítimo' tiene 99% de Accuracy pero detecta 0% de fraudes. Recall y AUC-ROC son las métricas correctas.",
    },
    {
      pregunta: "¿Qué técnica de ML detecta anomalías sin necesitar etiquetas de fraude previas?",
      opciones: [
        "Random Forest supervisado",
        "XGBoost con SMOTE",
        "Isolation Forest (no supervisado)",
        "Regresión logística binaria",
      ],
      respuesta: 2,
      explicacion:
        "Isolation Forest es un algoritmo no supervisado que detecta anomalías aislando puntos en el espacio de features sin necesitar datos etiquetados (sin necesitar saber qué transacciones previas fueron fraude).",
    },
    {
      pregunta: "En el contexto de fraude, ¿qué es preferible: maximizar Precision o maximizar Recall?",
      opciones: [
        "Maximizar Precision — para tener menos falsas alarmas",
        "Maximizar Recall — para no perder fraudes reales, aunque haya algunas alertas falsas",
        "Ambas son igualmente importantes siempre",
        "Ninguna — solo importa el F1-Score global",
      ],
      respuesta: 1,
      explicacion:
        "En detección de fraude, un falso negativo (fraude no detectado) es mucho más costoso que un falso positivo (alerta innecesaria). Por eso se prioriza el Recall aunque eso genere algunas alertas falsas adicionales.",
    },
    {
      pregunta: "¿Qué institución ecuatoriana recibe los Reportes de Transacciones Sospechosas (STR) de los bancos?",
      opciones: ["SRI", "SUPERCIAS", "UAF (Unidad de Análisis Financiero)", "Banco Central del Ecuador"],
      respuesta: 2,
      explicacion:
        "La Unidad de Análisis Financiero (UAF) del Ecuador es la institución encargada de recibir, analizar e investigar los reportes de transacciones sospechosas relacionadas con lavado de dinero y financiamiento del terrorismo.",
    },
    {
      pregunta: "¿Qué problema técnico se resuelve con SMOTE en modelos de detección de fraude?",
      opciones: [
        "La falta de poder computacional",
        "El desbalance de clases — genera ejemplos sintéticos de la clase minoritaria (fraude)",
        "La falta de normalización de variables numéricas",
        "La selección de hiperparámetros del modelo",
      ],
      respuesta: 1,
      explicacion:
        "SMOTE (Synthetic Minority Over-sampling TEchnique) crea ejemplos sintéticos de la clase minoritaria (transacciones fraudulentas) interpolando entre ejemplos existentes, balanceando el dataset para que el modelo aprenda mejor a detectar fraude.",
    },
  ],
  ejercicio: {
    titulo: "Detector de anomalías financieras con Isolation Forest",
    objetivo:
      "Construir un detector básico de transacciones anómalas usando Isolation Forest en Python con datos simulados de transacciones financieras ecuatorianas",
    herramientas: "Google Colab + Python + sklearn + pandas + matplotlib + seaborn",
    datosEjemplo:
      "Dataset simulado: 10,000 transacciones de tarjeta de crédito ecuatoriana\nFeatures: monto_transaccion, hora_del_dia, dia_semana, es_fin_de_semana, pais_transaccion (1=Ecuador, 0=exterior), tipo_comercio (1-10), frecuencia_7d, diferencia_monto_promedio\n1% de transacciones son fraude: montos extremos + hora inusual + país exterior + tipo comercio 9 (criptomonedas)",
    pasos: [
      "Abrir Google Colab y crear notebook 'Detector_Fraude_Ecuador'",
      "Pedir a ChatGPT: 'Genera código Python completo para: 1) crear dataset de 10000 transacciones con 8 features donde 1% son anomalías (fraude), 2) entrenar Isolation Forest con contamination=0.01, 3) visualizar los resultados con scatter plot mostrando anomalías en rojo, 4) calcular precision, recall y F1-score. Adapta los datos al contexto financiero ecuatoriano'",
      "Ejecutar el código en Google Colab, corregir errores si los hay con ayuda de ChatGPT",
      "Experimentar con el parámetro 'contamination': probar con 0.005, 0.01 y 0.02. Observar cómo cambia el número de alertas y las métricas",
      "Agregar visualización adicional: boxplot de montos de transacciones normales vs anómalas, histograma de hora del día para ambas clases",
      "Solicitar a ChatGPT: 'Explica en lenguaje de negocios (no técnico) los resultados del modelo: ¿qué patrones caracterizan las transacciones anómalas? ¿Qué reglas de negocio podría agregar para mejorar la precisión en el contexto ecuatoriano?'",
      "Implementar al menos 2 reglas de negocio adicionales sugeridas por ChatGPT (ejemplo: si hora < 2AM Y país=exterior → score de riesgo +50%)",
      "Documentar en el notebook: descripción del problema, solución técnica aplicada, resultados obtenidos y limitaciones del modelo",
    ],
    resultado:
      "Notebook en Google Colab con Isolation Forest funcionando sobre datos financieros ecuatorianos, visualizaciones de anomalías, comparación de umbrales de contamination, reglas de negocio adicionales implementadas y análisis narrativo en lenguaje de negocios.",
    criterios: [
      { criterio: "Código funcional sin errores con Isolation Forest entrenado", puntos: 25 },
      { criterio: "Visualizaciones claras de transacciones normales vs anómalas", puntos: 20 },
      { criterio: "Experimentación con al menos 3 valores de contamination documentada", puntos: 20 },
      { criterio: "Al menos 2 reglas de negocio adicionales implementadas", puntos: 20 },
      { criterio: "Análisis narrativo en lenguaje de negocios (no solo código)", puntos: 15 },
    ],
  },
  recursos: [
    {
      titulo: "Kaggle — Credit Card Fraud Detection Dataset",
      url: "https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud",
      tipo: "herramienta",
      descripcion: "Dataset real de 284,807 transacciones con 492 fraudes reales. El benchmark estándar para aprender detección de fraude con ML.",
    },
    {
      titulo: "UAF Ecuador — Unidad de Análisis Financiero",
      url: "https://www.uaf.gob.ec/",
      tipo: "documentacion",
      descripcion: "Institución oficial ecuatoriana contra lavado de dinero. Regulaciones, tipologías de lavado de dinero en Ecuador y guías de compliance.",
    },
    {
      titulo: "Sklearn — Isolation Forest",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.IsolationForest.html",
      tipo: "documentacion",
      descripcion: "Documentación oficial de scikit-learn para Isolation Forest con parámetros, ejemplos de código y referencias académicas.",
    },
    {
      titulo: "Fraud Detection con Python — Towards Data Science",
      url: "https://towardsdatascience.com/fraud-detection-using-machine-learning",
      tipo: "lectura",
      descripcion: "Artículos y tutoriales sobre implementación de sistemas de detección de fraude con Python, datasets y mejores prácticas del sector financiero.",
    },
  ],
  teoria: `La detección de fraude financiero con machine learning es una de las aplicaciones más maduras y con mayor retorno de inversión de la IA en el sector financiero. Los bancos ecuatorianos, las aseguradoras, las empresas de comercio electrónico y el propio SRI utilizan sistemas de ML para detectar comportamientos anómalos que podrían indicar actividades fraudulentas.

En Ecuador, el fraude financiero tiene dimensiones concretas y crecientes. Según datos de la Asociación de Bancos Privados del Ecuador (ABPE), el fraude bancario representa más de $45 millones anuales en pérdidas directas, cifra que ha crecido con la aceleración del comercio digital post-pandemia. El phishing y la suplantación de identidad son los vectores más comunes. El fraude en comercio electrónico creció un 180% entre 2020 y 2024. El SRI, por su parte, estima en más de $1,200 millones anuales las pérdidas por evasión fiscal, y utiliza sistemas de ML para cruzar facturas electrónicas y detectar inconsistencias.

El principal reto técnico en detección de fraude es el desbalance extremo de clases. En un dataset típico de transacciones bancarias, entre el 0.1% y el 2% de las transacciones son fraudulentas. Un modelo de ML que prediga ingenuamente "todo es legítimo" para todas las transacciones tendría una precisión (Accuracy) del 99% o más, pero detectaría cero fraudes. Esto hace que la Accuracy sea la métrica equivocada para este problema. Las métricas correctas son el Recall (de todos los fraudes reales, ¿cuántos detecta el modelo?), la Precision (de todas las alertas del modelo, ¿cuántas son fraudes reales?) y el AUC-ROC (qué tan bien separa el modelo las clases en todos los umbrales posibles).

En la práctica, el trade-off entre Recall y Precision define la estrategia del negocio. Un banco que prioriza maximizar el Recall (detectar todos los fraudes posibles) generará más falsos positivos: bloqueará tarjetas de clientes legítimos que hicieron compras inusuales pero legítimas. Un banco que prioriza la Precision tendrá menos alertas falsas pero dejará pasar más fraudes reales. La solución industrial estándar es un sistema de niveles: alertas automáticas para casos de riesgo medio (verificación por SMS), bloqueo temporal para casos de riesgo alto (requiere llamada), y bloqueo permanente para casos de muy alto riesgo.

Los algoritmos más utilizados en producción para detección de fraude en datos tabulares (transacciones) son XGBoost y LightGBM (gradient boosting), Random Forest, e Isolation Forest para detección no supervisada de anomalías. Isolation Forest tiene la ventaja de no requerir etiquetas de fraude previas: aprende los patrones normales del comportamiento del dataset y detecta como anómalas las observaciones que se "aíslan" más fácilmente en el espacio de features.

Las variables más predictivas en modelos de fraude son comportamentales: si la transacción ocurre a las 3 AM, si el monto es 10 veces el promedio histórico del cliente, si la transacción es en un país diferente al usual, si el dispositivo es nuevo, si hay dos transacciones en países diferentes con separación de minutos (velocidad imposible). Estas features de comportamiento, combinadas con features del cliente y del contexto, permiten a los modelos de ML detectar fraude con AUC-ROC superiores al 0.95 en datasets bien preparados.

La regulación en Ecuador es clara respecto a la obligatoriedad de sistemas de control de fraude. Las resoluciones del Banco Central del Ecuador establecen que las entidades financieras deben reportar transacciones sospechosas a la UAF (Unidad de Análisis Financiero). La LOPDP protege los datos personales incluidos en los sistemas de detección, y la Junta de Política y Regulación Financiera establece que los sistemas deben ser auditables: el banco debe poder explicar por qué marcó una transacción como sospechosa, lo que privilegia los modelos explicables (XGBoost con SHAP values) sobre los de "caja negra" (redes neuronales profundas).`,
};

const tema12: TemaC9 = placeholder(12, "Isolation Forest y Autoencoder para anomalías", MOD3, 3);
const tema13: TemaC9 = placeholder(13, "XGBoost para clasificación de fraude supervisada", MOD3, 3);
const tema14: TemaC9 = placeholder(14, "Fraude fiscal y el SRI digital en Ecuador", MOD3, 3);
const tema15: TemaC9 = placeholder(15, "Sistemas de alertas y compliance anti-fraude", MOD3, 3);

// ─── MÓDULO 4: Reporting automatizado SRI ───────────────────────────────────

const MOD4 = "Reporting automatizado SRI";

const tema16: TemaC9 = {
  id: 16,
  titulo: "El ecosistema tributario digital del SRI Ecuador",
  modulo: MOD4,
  moduloNum: 4,
  videoEmbed: "https://www.youtube.com/embed/PLACEHOLDER",
  videoTitulo: "SRI Ecuador digital — facturación electrónica y obligaciones",
  videoDuracion: "~40 min · Español",
  presentacionSlides: [
    {
      titulo: "Portada",
      contenido:
        "El Ecosistema Tributario Digital del SRI Ecuador\nC9. Finanzas e IA Predictiva — Tema 16\nInstituto Ecuatoriano de Inteligencia Artificial — itseia.ai",
    },
    {
      titulo: "El SRI digital en 2026 — transformación IA",
      contenido:
        "Facturación electrónica obligatoria desde 2019: todos los contribuyentes\nMotor de análisis: cruza $40 mil millones en facturas anuales con ML\nDetección automática: inconsistencias entre ingresos declarados y facturas recibidas\nBrecha tributaria: $1,200 millones anuales detectados por sistemas automatizados\nNotificaciones automáticas: el SRI envía alertas antes de glosas cuando detecta inconsistencias\n\nMejor cumplir bien que esperar la notificación.",
    },
    {
      titulo: "Obligaciones tributarias — calendario Ecuador",
      contenido:
        "Mensual (por noveno dígito RUC):\n• IVA (formulario 104): ventas y compras del mes\n• Retenciones en la fuente (formulario 103)\n\nAnual:\n• Impuesto a la Renta: personas naturales (abril), sociedades (abril)\n• Declaración patrimonial: patrimonio > $200,000\n\nSemestral:\n• IVA semestral para contribuyentes con ventas < $100K anuales",
    },
    {
      titulo: "Automatización de reportes tributarios con IA",
      contenido:
        "ChatGPT + datos de tu sistema contable:\n• Extraer totales de ventas y compras del mes\n• Clasificar por tipo de IVA (12%, 5%, 0%)\n• Calcular retenciones aplicables\n• Generar pre-declaración para revisión del contador\n\nLimitación importante: el archivo XML de declaración final debe generarlo el contador o el software autorizado (DIMM). IA asiste la preparación, no firma.",
    },
    {
      titulo: "Facturación electrónica — estructura XML",
      contenido:
        "El SRI Ecuador usa formato XML con firma electrónica (certificado digital)\nEstructura: cabecera (emisor, receptor, fecha) + detalles (productos/servicios) + totales + información adicional\n\nAutorización: el SRI valida y devuelve número de autorización en segundos\nClave de acceso: 49 dígitos que identifican unívocamente cada comprobante\n\nHerramientas compatibles: DIMM SRI (gratuito), sistemas contables como Sinnaps, Monica, Conta,  SolFact.",
    },
    {
      titulo: "Retenciones en la fuente — tablas automatizadas",
      contenido:
        "Retención en la Fuente del IR: se aplica al pagar a proveedores\n1%: servicios y bienes en general\n2%: servicios profesionales bajo relación de dependencia\n8%: servicios profesionales con factura propia\n10%: honorarios profesionales\n\nCon ChatGPT: 'Tengo estos pagos del mes: [lista de pagos con tipo de servicio y monto]. Calcula las retenciones en la fuente aplicables según la normativa SRI 2025 vigente'\n\nSiempre verificar con el Reglamento actualizado en sri.gob.ec.",
    },
    {
      titulo: "ATS — Anexo Transaccional Simplificado",
      contenido:
        "El ATS es el reporte mensual donde se declaran todas las compras y ventas\nFormato: archivo XML subido al portal del SRI\nContenido: cada factura de compra y venta del mes con: número de comprobante, RUC del proveedor/cliente, monto base, IVA, retenciones\n\nError común: no incluir facturas de servicios básicos y telecomunicaciones\nCon IA: automatizar la consolidación del ATS desde el sistema contable y detectar facturas faltantes antes de enviar.",
    },
    {
      titulo: "Automatización del proceso tributario",
      contenido:
        "Flujo sin IA: exportar → limpiar → calcular → revisar → declarar (1-2 días)\nFlujo con IA:\n1. Exportar datos del sistema contable (CSV)\n2. ChatGPT limpia y clasifica automáticamente\n3. Python calcula totales y retenciones\n4. Dashboard visual de la declaración para revisión rápida\n5. Contador revisa 30 min en lugar de 1 día entero\n\nROI: el contador puede atender 3x más clientes con el mismo tiempo.",
    },
    {
      titulo: "Herramientas disponibles para tributación en Ecuador",
      contenido:
        "DIMM Formularios (SRI — gratuito): software oficial para declaraciones\nMONICA: sistema contable + facturación electrónica, muy usado en Ecuador\nSolFact: facturación electrónica en la nube\nSinnaps / FISA: sistemas ERP con módulo tributario\nPython + pandas: para procesamiento de grandes volúmenes de datos\n\nIntegración con SRI API: el SRI tiene portal de consulta de autorizaciones. No hay API pública para automatización directa aún.",
    },
    {
      titulo: "Resumen del Tema 16",
      contenido:
        "1. El SRI Ecuador usa IA para cruzar $40B en facturas y detectar inconsistencias automáticamente\n2. El calendario tributario tiene fechas fijas según el 9no dígito del RUC\n3. IA asiste la preparación de declaraciones — el contador firma y valida\n4. El ATS es el reporte mensual de todas las transacciones — crítico completarlo correctamente\n5. Automatizar el proceso tributario libera al contador para trabajo de mayor valor\n\nPróximo: Automatización del ATS con Python y pandas",
    },
  ],
  quiz: [
    {
      pregunta: "¿Desde qué año la facturación electrónica es obligatoria para todos los contribuyentes en Ecuador?",
      opciones: ["2015", "2017", "2019", "2022"],
      respuesta: 2,
      explicacion:
        "La facturación electrónica se implementó gradualmente en Ecuador y desde 2019 es obligatoria para todos los contribuyentes activos, lo que permitió al SRI construir su base de datos de ML con información completa.",
    },
    {
      pregunta: "¿Qué porcentaje de retención en la fuente aplica para servicios profesionales con factura propia?",
      opciones: ["1%", "2%", "8%", "10%"],
      respuesta: 2,
      explicacion:
        "Según la normativa del SRI Ecuador, los servicios profesionales prestados por personas naturales con factura propia tienen una retención en la fuente del impuesto a la renta del 8%.",
    },
    {
      pregunta: "¿Qué es el ATS en el contexto tributario ecuatoriano?",
      opciones: [
        "Autorización de Transacciones del SRI",
        "Anexo Transaccional Simplificado — reporte mensual de todas las facturas de compra y venta",
        "Análisis Tributario Semestral",
        "Archivo de Tributación Simplificado",
      ],
      respuesta: 1,
      explicacion:
        "El Anexo Transaccional Simplificado (ATS) es el reporte mensual que deben presentar los contribuyentes especiales, con el detalle de todas las facturas de compra y venta del período.",
    },
    {
      pregunta: "¿Cuál es la limitación principal de usar ChatGPT para declaraciones tributarias en Ecuador?",
      opciones: [
        "ChatGPT no puede leer datos numéricos",
        "El archivo XML de declaración final debe generarse con software autorizado (DIMM) y ser firmado por el contador responsable",
        "ChatGPT no conoce la normativa ecuatoriana",
        "No existe limitación — ChatGPT puede hacer declaraciones completas",
      ],
      respuesta: 1,
      explicacion:
        "ChatGPT asiste en la preparación, clasificación y verificación de datos, pero la declaración formal debe generarse con el DIMM u otro software autorizado y ser presentada/firmada por el contador responsable. La IA no puede firmar documentos oficiales.",
    },
    {
      pregunta: "¿Cuántos dígitos tiene la clave de acceso de un comprobante de facturación electrónica ecuatoriana?",
      opciones: ["20 dígitos", "36 dígitos", "49 dígitos", "64 dígitos"],
      respuesta: 2,
      explicacion:
        "La clave de acceso de los comprobantes electrónicos del SRI Ecuador tiene 49 dígitos que identifican unívocamente cada comprobante: incluyen fecha, tipo de comprobante, RUC del emisor, número de serie y un dígito verificador.",
    },
  ],
  ejercicio: {
    titulo: "Simulador de cálculo de retenciones y preliquidación de IVA",
    objetivo:
      "Construir en Google Sheets con asistencia de ChatGPT un simulador de retenciones en la fuente y pre-liquidación del IVA para una empresa ecuatoriana, que automatice los cálculos tributarios mensuales",
    herramientas: "Google Sheets + ChatGPT + sri.gob.ec (consulta normativa)",
    datosEjemplo:
      "Empresa: ECOVENT S.A. (servicios de ventilación industrial), Cuenca\nRUC: 0190455618001, 9no dígito: 1, vence el 12 de cada mes\n\nVentas del mes:\n• Factura 001-001-0000234: $8,500 + IVA 15%\n• Factura 001-001-0000235: $1,200 sin IVA (servicio exportación)\n\nCompras del mes:\n• Factura de repuestos (proveedor RUC 0102030405001): $3,200 + IVA\n• Honorarios contador freelance (RUC 1712345678001): $450 + IVA\n• Arriendo oficina (persona natural): $800 sin IVA\n• Servicio CNT internet: $89.60 + IVA",
    pasos: [
      "Crear Google Sheet 'Simulador Tributario ECOVENT Julio 2025'",
      "En ChatGPT, pedir: 'Eres asesor tributario en Ecuador. Para la empresa ECOVENT S.A. con los siguientes datos de ventas y compras del mes: [pegar datos]. Calcula: 1) IVA en ventas, 2) IVA en compras (crédito tributario), 3) IVA a pagar o saldo a favor, 4) Retenciones en la fuente del IR que debe aplicar ECOVENT a sus proveedores según tipo de operación, 5) Total IVA retenido a proveedores. Presenta en tabla clara con la base legal de cada retención'",
      "Copiar la tabla de resultados al Google Sheet y construir la hoja con 4 secciones: VENTAS, COMPRAS, CÁLCULO IVA, RETENCIONES",
      "Agregar fórmulas de Google Sheets para que los totales se calculen automáticamente cuando se cambian los montos",
      "Verificar manualmente el cálculo de IVA: (IVA ventas - IVA compras) = IVA a pagar o crédito tributario",
      "Consultar en sri.gob.ec la tabla de retenciones vigente y verificar que los porcentajes de ChatGPT coincidan",
      "Crear segunda pestaña 'Calendario de Vencimientos' con las fechas de vencimiento para el RUC de ECOVENT (9no dígito 1) para todos los formularios del año",
      "Reflexión (150 palabras): ¿Qué errores evitaría este sistema? ¿Qué parte del proceso aún requiere obligatoriamente al contador?",
    ],
    resultado:
      "Simulador tributario funcional en Google Sheets para ECOVENT S.A. con cálculo automático de IVA, retenciones y calendario de vencimientos, verificado contra normativa SRI vigente.",
    criterios: [
      { criterio: "Cálculos de IVA correctos verificados contra normativa SRI", puntos: 30 },
      { criterio: "Tabla de retenciones completa con base legal", puntos: 25 },
      { criterio: "Fórmulas dinámicas en Google Sheets (no solo valores pegados)", puntos: 20 },
      { criterio: "Calendario de vencimientos correcto para el 9no dígito RUC", puntos: 15 },
      { criterio: "Reflexión sobre el rol del contador vs. la IA en el proceso", puntos: 10 },
    ],
  },
  recursos: [
    {
      titulo: "SRI Ecuador — Portal oficial",
      url: "https://www.sri.gob.ec/",
      tipo: "documentacion",
      descripcion: "Portal oficial del Servicio de Rentas Internas de Ecuador. Normativa, formularios, declaraciones en línea, consulta de autorizaciones de facturación electrónica.",
    },
    {
      titulo: "LORTI — Ley Orgánica de Régimen Tributario Interno",
      url: "https://www.sri.gob.ec/web/guest/que-es-el-sri",
      tipo: "documentacion",
      descripcion: "Ley tributaria principal de Ecuador. Regula el impuesto a la renta, el IVA, el ICE y las retenciones en la fuente.",
    },
    {
      titulo: "DIMM Formularios — Software gratuito SRI",
      url: "https://www.sri.gob.ec/dimm-formularios",
      tipo: "herramienta",
      descripcion: "Software oficial y gratuito del SRI para elaborar y presentar declaraciones tributarias. Compatible con Windows.",
    },
    {
      titulo: "Calendario tributario Ecuador 2025",
      url: "https://www.sri.gob.ec/calendario-tributario",
      tipo: "documentacion",
      descripcion: "Calendario oficial del SRI con las fechas de vencimiento de todas las obligaciones tributarias por tipo de contribuyente y noveno dígito del RUC.",
    },
  ],
  teoria: `El Servicio de Rentas Internas (SRI) del Ecuador ha experimentado una de las transformaciones digitales más profundas del sector público ecuatoriano en la última década. La implementación obligatoria de la facturación electrónica desde 2019, que generó una base de datos de más de $40 mil millones en transacciones anuales, creó las condiciones perfectas para aplicar machine learning a la administración tributaria. Hoy, el SRI cruza automáticamente las facturas emitidas por los proveedores con las facturas declaradas por sus clientes, detectando inconsistencias que antes requerían costosas auditorías manuales.

Para el profesional financiero ecuatoriano en 2026, entender el ecosistema tributario digital del SRI es tan importante como entender los estados financieros. Las obligaciones tributarias de las empresas incluyen: la declaración mensual del IVA (formulario 104, con vencimiento entre el 10 y el 28 del mes siguiente según el noveno dígito del RUC), la declaración de retenciones en la fuente (formulario 103, mismas fechas), el Anexo Transaccional Simplificado (ATS, mensual para contribuyentes especiales), y la declaración anual del impuesto a la renta (formulario 101 para sociedades, en abril).

Las retenciones en la fuente son un mecanismo de recaudación anticipada: cuando una empresa paga a un proveedor o profesional, debe retener un porcentaje del pago y entregarlo directamente al SRI. Las tasas varían según el tipo de operación: 1% para bienes en general, 2% para servicios normales, 8% para servicios profesionales con factura propia, 10% para honorarios profesionales en ciertas circunstancias. El comprobante de retención debe emitirse electrónicamente dentro de los 5 días hábiles siguientes al pago.

La inteligencia artificial puede aportar valor significativo en el proceso tributario de dos maneras. La primera es la asistencia en la preparación de declaraciones: ChatGPT puede recibir los datos de ventas y compras del mes, clasificarlos correctamente por tipo de IVA y tipo de operación, calcular retenciones aplicables y generar una pre-declaración para revisión del contador. Esto reduce el tiempo de preparación de 1-2 días a pocas horas. La segunda es la detección preventiva de errores: antes de presentar la declaración, la IA puede cruzar los datos para identificar facturas faltantes, retenciones incorrectamente calculadas, o inconsistencias que el SRI podría detectar y generar glosas.

Es fundamental entender las limitaciones: la IA asiste pero no firma. La responsabilidad tributaria recae siempre en el representante legal de la empresa y, en su caso, en el contador titulado. Los archivos XML de declaración deben generarse con el DIMM Formularios (software gratuito del SRI) u otros sistemas autorizados. El contador revisa, valida y presenta. La IA automatiza la preparación de datos, no la presentación oficial.

La automatización del proceso tributario tiene un ROI claramente medible para los contadores: con herramientas de IA pueden procesar la información mensual de un cliente en 30 minutos en lugar de un día entero, lo que les permite atender tres veces más clientes con el mismo tiempo. Para las empresas, significa reducción de errores, menor riesgo de sanciones por inconsistencias detectadas por el SRI, y liberación del tiempo del equipo financiero para análisis de mayor valor.

El futuro del cumplimiento tributario en Ecuador apunta hacia la declaración automática: el SRI ya tiene todos los datos de tus facturas. En algunos países como Chile y Brasil, la administración tributaria ya propone pre-declaraciones al contribuyente que solo necesita revisar y aprobar. Ecuador está en el camino correcto con su base de datos de facturación electrónica, y los profesionales que entiendan este ecosistema digital tendrán ventaja competitiva significativa en el mercado laboral ecuatoriano.`,
};

const tema17: TemaC9 = placeholder(17, "Automatización del ATS con Python y pandas", MOD4, 4);
const tema18: TemaC9 = placeholder(18, "Dashboard tributario en Power BI con datos SRI", MOD4, 4);
const tema19: TemaC9 = placeholder(19, "Gestión de glosas y controversias con análisis IA", MOD4, 4);
const tema20: TemaC9 = placeholder(20, "Auditoría interna asistida por IA — casos Ecuador", MOD4, 4);

export const C9_TEMAS: TemaC9[] = [
  tema1, tema2, tema3, tema4, tema5,
  tema6, tema7, tema8, tema9, tema10,
  tema11, tema12, tema13, tema14, tema15,
  tema16, tema17, tema18, tema19, tema20,
];
