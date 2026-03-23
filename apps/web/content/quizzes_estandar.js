#!/usr/bin/env node
/**
 * quizzes_estandar.js
 * ─────────────────────────────────────────────────────────────────
 * 1. GET program ia-aplicada-estandar → semesters → subjects → sessions
 * 2. Check which sessions already have quizzes
 * 3. INSERT quiz + 5 quiz_questions for each session WITHOUT quiz
 *
 * Run: node content/quizzes_estandar.js
 */

const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';

const H  = { apikey: SKEY, Authorization: 'Bearer ' + SKEY, 'Content-Type': 'application/json', Prefer: 'return=representation' };
const Hm = { apikey: SKEY, Authorization: 'Bearer ' + SKEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' };

async function get(path) {
  const r = await fetch(BASE + path, { headers: H });
  if (!r.ok) throw new Error(`GET ${path} => ${r.status}`);
  return r.json();
}

async function post(table, body) {
  const r = await fetch(BASE + '/' + table, { method: 'POST', headers: H, body: JSON.stringify(body) });
  const d = await r.json();
  if (r.status !== 201) throw new Error(`POST ${table} => ${r.status}: ${JSON.stringify(d).slice(0,200)}`);
  return Array.isArray(d) ? d[0] : d;
}

async function postMin(table, body) {
  const r = await fetch(BASE + '/' + table, { method: 'POST', headers: Hm, body: JSON.stringify(body) });
  if (r.status !== 201) { const t = await r.text(); throw new Error(`POST ${table} => ${r.status}: ${t.slice(0,200)}`); }
  return true;
}

// ─────────────────────────────────────────────────────────────────
// Helper: build options JSON string
// ─────────────────────────────────────────────────────────────────
function opts(a, b, c, d, correct) {
  return JSON.stringify([
    { id: 'a', text: a, is_correct: correct === 'a' },
    { id: 'b', text: b, is_correct: correct === 'b' },
    { id: 'c', text: c, is_correct: correct === 'c' },
    { id: 'd', text: d, is_correct: correct === 'd' },
  ]);
}

// ─────────────────────────────────────────────────────────────────
// QUIZ DATA — 40 sessions across 5 professions × 8 sessions
// Professions: Contadores, Abogados, Medicos, Gerentes, Arquitectos
// ─────────────────────────────────────────────────────────────────

// Map: session title keywords → quiz questions
// We'll match by title substring (case-insensitive)
const QUIZ_DATA = [

  // ══════════════════════════════════════════════════════════════
  // CONTADORES (8 sessions)
  // ══════════════════════════════════════════════════════════════

  {
    match: ['fundamentos', 'ia', 'contador'],
    title: 'Quiz: Fundamentos de IA para Contadores',
    questions: [
      { q: '¿Qué es la Inteligencia Artificial aplicada a la contabilidad?', o: opts('Un robot que reemplaza al contador','Software que aprende patrones de datos financieros para automatizar tareas','Una hoja de Excel avanzada','Un sistema de facturación electrónica'), exp: 'La IA aprende patrones de datos históricos para automatizar reportes, detectar anomalías y proyectar cifras.' },
      { q: '¿Qué diferencia a un modelo de Machine Learning de una fórmula de Excel?', o: opts('Excel usa más memoria','ML aprende de datos sin reglas explícitas programadas','ML solo funciona en internet','No hay diferencia real'), exp: 'ML extrae reglas de los datos automáticamente; Excel ejecuta reglas que el humano definió manualmente.' },
      { q: '¿Cuál de estas tareas puede automatizar la IA en un departamento contable?', o: opts('Firmar estados financieros','Generar borradores de notas NIIF para revisión del contador','Auditar sin supervisión humana','Presentar declaraciones al SRI autónomamente'), exp: 'La IA genera borradores; el contador valida, ajusta y firma. La responsabilidad profesional es intransferible.' },
      { q: '¿Qué es una "alucinación" en un modelo de lenguaje como ChatGPT?', o: opts('Un error de conexión a internet','Cuando el modelo inventa información que parece real pero es falsa','Un virus que afecta el modelo','Cuando el modelo responde en otro idioma'), exp: 'Los LLM pueden generar texto plausible pero incorrecto; siempre valida cifras y artículos de ley en la fuente oficial.' },
      { q: 'Para tareas contables con datos sensibles, ¿qué herramienta es más adecuada?', o: opts('ChatGPT versión gratuita con datos reales del cliente','ChatGPT Enterprise o Claude for Work con datos anonimizados','Publicar los datos en foros contables','Compartir el balance completo a cualquier IA pública'), exp: 'Las versiones Enterprise tienen políticas de no-entrenamiento con tus datos, mayor privacidad y cumplimiento.' },
    ]
  },
  {
    match: ['automatización', 'reportes', 'financieros'],
    title: 'Quiz: Automatización de Reportes Financieros',
    questions: [
      { q: '¿Cuál es el primer paso para automatizar un reporte financiero con IA?', o: opts('Copiar el PDF a la IA directamente','Preparar datos estructurados y limpios antes de procesar','Publicar el reporte en redes','Esperar que la IA obtenga los datos sola'), exp: 'Datos limpios y bien estructurados producen outputs de IA más precisos. Garbage in, garbage out.' },
      { q: '¿Qué herramienta de Microsoft permite generar reportes con IA en Excel?', o: opts('Adobe Acrobat','Microsoft Copilot integrado en Excel 365','Google Maps','WhatsApp Business'), exp: 'Copilot en Excel 365 analiza datos, crea fórmulas y genera resúmenes narrativos directamente en la hoja.' },
      { q: '¿Qué es Power Query en Excel?', o: opts('Un juego de Excel','Herramienta para importar, transformar y consolidar datos de múltiples fuentes','El nombre del soporte de Microsoft','Un formato de archivo contable'), exp: 'Power Query automatiza la limpieza y consolidación de datos, paso previo esencial al análisis con IA.' },
      { q: 'Después de obtener un Estado de Resultados generado por IA, ¿qué debes hacer?', o: opts('Publicarlo sin revisión','Revisarlo contra los datos fuente y validar cada cifra','Borrarlo y empezar de cero','Solo revisar si hay pérdidas'), exp: 'La validación humana es indispensable; la IA puede cometer errores en clasificaciones o cálculos.' },
      { q: '¿Cuál es el mayor beneficio de automatizar reportes con IA?', o: opts('Eliminar al contador','Reducir errores manuales y liberar tiempo para análisis estratégico','Cumplir con el SRI automáticamente','Evitar auditorías externas'), exp: 'La automatización elimina tareas repetitivas, permitiendo al contador enfocarse en análisis de valor.' },
    ]
  },
  {
    match: ['detección', 'anomalías', 'fraude'],
    title: 'Quiz: Detección de Anomalías y Fraude con IA',
    questions: [
      { q: '¿Qué tipo de patrones puede detectar la IA en libros contables?', o: opts('Solo errores de ortografía','Facturas duplicadas, proveedores fantasma y montos estadísticamente inusuales','Únicamente errores de IVA','Solo transacciones en moneda extranjera'), exp: 'Los modelos de detección de anomalías identifican patrones atípicos en grandes volúmenes de transacciones.' },
      { q: '¿Qué es el "triángulo del fraude" que la IA ayuda a detectar?', o: opts('Tres tipos de software contable','Presión, oportunidad y racionalización como factores que generan fraude','Tres departamentos en riesgo','Una fórmula de Excel avanzada'), exp: 'El triángulo del fraude (Cressey) identifica los tres factores que llevan a un individuo a cometer fraude.' },
      { q: 'Al usar IA para auditoría de anomalías, ¿cuál es el paso más importante?', o: opts('Confiar en todas las alertas sin investigar','Investigar manualmente cada alerta antes de concluir que hay fraude','Despedir al empleado señalado por la IA','Reportar al SRI sin verificar'), exp: 'Las alertas son puntos de partida para investigación; la IA genera falsos positivos que deben validarse.' },
      { q: '¿Qué tipo de dato es más útil para un modelo de detección de fraude contable?', o: opts('Solo las facturas del último mes','Series históricas de transacciones con variables como monto, proveedor, fecha y aprobador','Únicamente los balances anuales','Los salarios de los empleados'), exp: 'Los modelos aprenden patrones normales de transacciones históricas para detectar desvíos significativos.' },
      { q: 'En Ecuador, ¿qué organismo recibe reportes de actividades financieras sospechosas?', o: opts('El Ministerio de Educación','La UAFE (Unidad de Análisis Financiero y Económico)','El IESS','La Contraloría General solo para empresas'), exp: 'La UAFE es el organismo ecuatoriano responsable de prevención de lavado de activos e ilícitos financieros.' },
    ]
  },
  {
    match: ['excel', 'copilot', 'automatización'],
    title: 'Quiz: Excel + IA y Automatización',
    questions: [
      { q: '¿Qué hace Microsoft Copilot cuando está integrado en Excel?', o: opts('Solo corrige ortografía','Analiza datos, sugiere fórmulas y genera insights en lenguaje natural','Conecta con el SRI automáticamente','Diseña gráficos en 3D exclusivamente'), exp: 'Copilot entiende instrucciones en español y las traduce a acciones: fórmulas, tablas dinámicas, análisis.' },
      { q: '¿Qué es una macro de VBA y cómo la mejora la IA?', o: opts('Un tipo de virus de Excel','Código que automatiza tareas repetitivas; la IA puede generarlo desde descripción en texto','Un formato de archivo','Un plugin de pago'), exp: 'VBA automatiza Excel; la IA puede escribir macros complejas a partir de una descripción en lenguaje natural.' },
      { q: '¿Para qué sirven las tablas dinámicas en contabilidad?', o: opts('Para diseñar facturas','Para resumir, agrupar y analizar grandes volúmenes de datos contables interactivamente','Para enviar correos','Para conectar con el SRI'), exp: 'Las tablas dinámicas condensan miles de transacciones en resúmenes por categoría, período o centro de costo.' },
      { q: '¿Cuál es el riesgo de que la IA genere una fórmula de Excel compleja?', o: opts('Que sea demasiado lenta','Que la fórmula parezca correcta pero calcule mal en ciertos casos borde','Que use nombres en inglés','Que requiera internet'), exp: 'Siempre prueba las fórmulas con datos conocidos antes de usarlas en cierres o reportes oficiales.' },
      { q: 'Power BI complementa a Excel con IA porque:', o: opts('Es más barato que Excel','Permite visualizaciones interactivas con forecasting y análisis predictivo sin código','Solo funciona en Mac','Reemplaza completamente a Excel'), exp: 'Power BI + IA habilita dashboards con proyecciones, alertas y narrativas automáticas para la gerencia.' },
    ]
  },
  {
    match: ['análisis predictivo', 'presupuestos', 'proyecciones'],
    title: 'Quiz: Análisis Predictivo para Presupuestos',
    questions: [
      { q: '¿Qué es el análisis predictivo en finanzas?', o: opts('Adivinar sin datos','Usar datos históricos y modelos estadísticos para proyectar valores futuros','Copiar el presupuesto del año anterior','Un informe del banco'), exp: 'El análisis predictivo usa patrones históricos, variables contextuales y estadística para estimar escenarios.' },
      { q: 'Un análisis "What-If" (escenarios) sirve para:', o: opts('Ver solo el peor caso','Evaluar escenarios optimista, base y pesimista y sus impactos en el negocio','Calcular el IVA','Revisar facturas del pasado'), exp: 'Los escenarios permiten planificar decisiones robustas ante distintas posibilidades macroeconómicas.' },
      { q: '¿Qué datos son más valiosos para proyecciones financieras con IA?', o: opts('Solo el último mes','Series históricas de 2-3 años con variables contextuales macroeconómicas','Opiniones de empleados','El presupuesto de la competencia'), exp: 'Series temporales largas con variables externas (inflación, tipo de cambio) mejoran la precisión del modelo.' },
      { q: 'Al presentar proyecciones con IA, ¿qué debes comunicar siempre a la gerencia?', o: opts('Que la IA nunca se equivoca','Los supuestos del modelo, el intervalo de confianza y las limitaciones','Solo el número final','Que los datos son secretos'), exp: 'Transparencia sobre supuestos y limitaciones es clave para que la gerencia tome decisiones informadas.' },
      { q: '¿Cuál herramienta de Microsoft visualiza forecasting sin código?', o: opts('Word con tablas','Power BI con funciones de previsión integradas','Teams con encuestas','Outlook con calendario'), exp: 'Power BI tiene funciones nativas de forecasting que muestran proyecciones con intervalos de confianza visualmente.' },
    ]
  },
  {
    match: ['cierre contable', 'asistido'],
    title: 'Quiz: Cierre Contable Asistido por IA',
    questions: [
      { q: '¿Cuál es el primer paso en un cierre contable asistido por IA?', o: opts('Publicar el balance directamente','Verificar la integridad y completitud de los datos del período','Pedir a la IA que calcule todo','Esperar la auditoría'), exp: 'Antes de procesar con IA, validar que todos los registros del período estén completos y correctos.' },
      { q: '¿Qué partidas de ajuste puede identificar la IA en el cierre?', o: opts('Solo facturas de compra','Accruals, amortizaciones pendientes, diferencias temporales y errores de clasificación','Únicamente salarios','Solo IVA'), exp: 'La IA detecta partidas de ajuste que los humanos omiten al procesar grandes volúmenes de datos.' },
      { q: '¿Qué rol cumple la IA en la preparación de notas NIIF?', o: opts('Firma las notas como auditor','Genera borradores que el contador revisa y aprueba','Reemplaza al Comité de Auditoría','No puede ayudar con NIIF'), exp: 'La IA acelera la redacción; el contador valida la correcta aplicación de la normativa NIIF.' },
      { q: 'En Ecuador, ¿qué organismo regula la presentación de estados financieros de compañías?', o: opts('El Banco Central','La Superintendencia de Compañías, Valores y Seguros (SCVS)','El Ministerio del Trabajo','La Contraloría solo para empresas públicas'), exp: 'La SCVS regula los EEFF de compañías; el SRI tiene sus propios requerimientos adicionales de presentación.' },
      { q: '¿Cómo validas que el Estado de Resultados generado por IA es correcto?', o: opts('Si parece lógico, está correcto','Conciliando cada cifra con el mayor contable y documentos fuente','Preguntándole a la IA si es correcto','Comparando con el presupuesto sin verificar'), exp: 'La conciliación contra el mayor contable y documentos fuente es el control mínimo irrenunciable.' },
    ]
  },
  {
    match: ['seguridad', 'privacidad', 'datos financieros'],
    title: 'Quiz: Seguridad y Privacidad de Datos Financieros',
    questions: [
      { q: '¿Qué ley ecuatoriana regula la protección de datos personales, incluyendo datos financieros?', o: opts('Código de Comercio','Ley Orgánica de Protección de Datos Personales (LOPDP)','Reglamento del SRI','Código de Trabajo'), exp: 'La LOPDP regula el tratamiento de datos personales en Ecuador, incluyendo datos financieros de personas naturales.' },
      { q: '¿Cuál es la práctica más segura antes de ingresar datos a una IA pública?', o: opts('Ingresar los datos tal como están','Anonimizar o pseudonimizar los datos sensibles antes de procesarlos','Publicarlos en el chat de la empresa','Compartirlos con todos los colegas'), exp: 'La anonimización elimina identificadores personales, permitiendo usar IA sin violar la LOPDP.' },
      { q: '¿Qué riesgo implica usar ChatGPT gratuito con datos reales de clientes?', o: opts('Ninguno, es completamente seguro','Los datos pueden usarse para entrenar el modelo y quedar expuestos','Solo hay riesgo si el cliente es extranjero','El riesgo es solo técnico, no legal'), exp: 'OpenAI puede usar los datos de chats gratuitos para entrenamiento; esto viola confidencialidad profesional.' },
      { q: 'Una "brecha de seguridad" en datos financieros debe notificarse a:', o: opts('Solo al director financiero internamente','Al titular de los datos y a la Autoridad de Protección de Datos según la LOPDP','Solo al banco','Solo si hay daño económico comprobado'), exp: 'La LOPDP obliga a notificar brechas al titular y a la autoridad competente en plazos definidos.' },
      { q: '¿Cuál es el principio de "minimización de datos" aplicado a IA contable?', o: opts('Usar el mínimo de empleados posible','Proporcionar a la IA solo los datos estrictamente necesarios para la tarea específica','Minimizar el tamaño de los archivos Excel','Usar la versión más económica de la IA'), exp: 'Minimización implica no compartir más datos de los necesarios: reduce riesgo de exposición y cumple la LOPDP.' },
    ]
  },
  {
    match: ['evaluación crítica', 'resultados', 'ia', 'contador'],
    title: 'Quiz: Evaluación Crítica de Resultados de IA',
    questions: [
      { q: '¿Por qué un contador no puede confiar ciegamente en un análisis generado por IA?', o: opts('Porque la IA es demasiado lenta','La IA puede alucinar cifras, citar normas incorrectas o aplicar criterios inadecuados','Porque la IA no sabe sumar','Porque siempre responde en inglés'), exp: 'La alucinación y el conocimiento desactualizado de la IA hacen indispensable la validación profesional.' },
      { q: '¿Qué debes verificar cuando la IA cita un artículo del Código Tributario ecuatoriano?', o: opts('Solo el número del artículo','El texto exacto en la fuente oficial vigente (SRI / Registro Oficial)','Que tenga más de 100 palabras','Que esté escrito en formato de tabla'), exp: 'Los artículos de ley deben verificarse en la fuente oficial; la IA puede citar artículos derogados o incorrectos.' },
      { q: '¿Qué es el "prompt engineering" y por qué importa en contabilidad?', o: opts('Programar robots contables','Técnica de dar instrucciones claras y contextualizadas a la IA para obtener outputs más precisos','Un software de auditoria','El nombre del departamento de tecnología'), exp: 'Un prompt bien estructurado (rol + tarea + formato + ejemplo) reduce errores y mejora la calidad del output.' },
      { q: 'Si la IA genera un ratio financiero que parece inusual, ¿qué debes hacer?', o: opts('Publicarlo tal como está','Recalcularlo manualmente desde los datos fuente para verificar','Preguntarle a la IA si está correcto','Ignorarlo y usar el del año anterior'), exp: 'Los ratios deben verificarse contra datos fuente; la IA puede usar períodos incorrectos o clasificaciones erróneas.' },
      { q: '¿Cuál es la regla de oro para cualquier output de IA en un informe contable oficial?', o: opts('Si parece profesional, usarlo directamente','Nunca incluir información en un informe sin haberla verificado en la fuente primaria','Usar siempre el primer resultado de la IA','Pedir validación al proveedor de la IA'), exp: 'La responsabilidad profesional del contador exige que todo dato en informes oficiales esté verificado.' },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // ABOGADOS (8 sessions)
  // ══════════════════════════════════════════════════════════════

  {
    match: ['fundamentos', 'ia', 'abogado', 'jurídico'],
    title: 'Quiz: Fundamentos de IA para Abogados',
    questions: [
      { q: '¿Qué es un Large Language Model (LLM) aplicado al derecho?', o: opts('Un archivo legal grande','Modelo entrenado en textos jurídicos para generar y analizar documentos legales','Un tipo de tribunal digital','Una base de datos del SATJE'), exp: 'Los LLM jurídicos aprenden de contratos, sentencias y doctrina para asistir en redacción e investigación.' },
      { q: '¿Para qué tarea legal puede la IA ahorrar más tiempo hoy?', o: opts('Firmar escrituras notariales','Redactar borradores de contratos, escritos y opiniones legales para revisión del abogado','Sustituir al juez en audiencias','Realizar peritajes forenses'), exp: 'La redacción de borradores es donde la IA genera más valor; el abogado revisa, ajusta y firma.' },
      { q: '¿Qué es la "alucinación" de la IA en contexto jurídico?', o: opts('Un error de digitación','Cuando la IA inventa sentencias, artículos o jurisprudencia que no existen','Un tipo de ciberataque','Cuando la IA responde en otro idioma'), exp: 'El caso Mata vs. Avianca (2023) mostró abogados sancionados por citar sentencias inventadas por ChatGPT.' },
      { q: 'Antes de usar IA con información de un cliente, ¿qué principio ético aplica?', o: opts('Compartir todo para obtener mejor análisis','Secreto profesional: anonimizar datos o usar sistemas con confidencialidad garantizada','Informar al juez del uso de IA','Publicar el caso como ejemplo'), exp: 'El secreto profesional obliga al abogado a proteger la información del cliente incluso al usar herramientas tecnológicas.' },
      { q: '¿Cuál es la actitud correcta de un abogado ante outputs de IA?', o: opts('Confiar completamente para ahorrar tiempo','Verificar cada cita legal, sentencia y artículo en fuentes oficiales antes de usar','Nunca usar IA','Solo usar IA para administración'), exp: 'La responsabilidad profesional obliga a verificar todo dato legal antes de presentarlo en cualquier documento.' },
    ]
  },
  {
    match: ['investigación', 'jurisprudencial', 'ia'],
    title: 'Quiz: Investigación Jurisprudencial con IA',
    questions: [
      { q: '¿Dónde se puede verificar jurisprudencia ecuatoriana de forma oficial?', o: opts('Google únicamente','SATJE (Sistema de Administración de Justicia) y CNJ (Consejo de la Judicatura)','Wikipedia legal','El portal del Ministerio del Trabajo'), exp: 'El SATJE publica sentencias y autos del sistema judicial ecuatoriano; es la fuente oficial de jurisprudencia.' },
      { q: '¿Qué herramienta de IA es útil para sintetizar jurisprudencia de múltiples fallos?', o: opts('TikTok','Perplexity con búsqueda web o Claude con documentos subidos','Instagram','LinkedIn'), exp: 'Perplexity o Claude pueden resumir y analizar múltiples sentencias, identificando líneas jurisprudenciales.' },
      { q: 'Al buscar precedentes con IA, ¿cuál es el riesgo principal?', o: opts('Que tarde más que la búsqueda manual','Que la IA cite fallos no existentes o malinterprete el ratio decidendi','Que use lenguaje informal','Que sea muy costoso'), exp: 'La IA puede inventar referencias o malinterpretar el sentido vinculante de un fallo; verificar siempre en SATJE.' },
      { q: '¿Qué es el "ratio decidendi" de una sentencia?', o: opts('El nombre del juez','La razón jurídica determinante del fallo con fuerza de precedente','La fecha del proceso','El número de expediente'), exp: 'El ratio decidendi es la regla jurídica esencial del fallo, diferente de los obiter dicta (comentarios no vinculantes).' },
      { q: 'Para construir un argumento legal sólido con IA, ¿cuál es el proceso correcto?', o: opts('Copiar el primer resultado de la IA','Usar IA para identificar líneas jurisprudenciales, luego verificar cada fuente en SATJE y redactar','Pedir a la IA que redacte sin revisar','Usar solo doctrina extranjera'), exp: 'IA identifica → humano verifica en fuente oficial → abogado construye argumento. Sin saltarse la verificación.' },
    ]
  },
  {
    match: ['redacción', 'contratos', 'ia'],
    title: 'Quiz: Redacción y Revisión de Contratos con IA',
    questions: [
      { q: '¿Qué puede hacer la IA al revisar un contrato de arrendamiento comercial?', o: opts('Firmarlo electrónicamente','Identificar cláusulas riesgosas, ambigüedades y derechos faltantes para el cliente','Registrarlo notarialmente','Calcular impuestos automáticamente'), exp: 'La IA detecta cláusulas abusivas, vacíos contractuales y términos poco claros que el abogado debe evaluar.' },
      { q: '¿Qué cláusula es fundamental en contratos comerciales ecuatorianos bajo el COGEP?', o: opts('Cláusula de color del logo','Cláusula de jurisdicción y mediación/arbitraje para resolución de conflictos','Cláusula de redes sociales','Cláusula de horario de trabajo'), exp: 'Definir el método de resolución de conflictos (mediación, arbitraje o juzgado) previene costosos litigios futuros.' },
      { q: 'Al pedirle a la IA un contrato de compraventa, ¿qué debes especificar en el prompt?', o: opts('Solo decir "haz un contrato"','Tipo de bien, partes, precio, forma de pago, garantías, legislación aplicable y casos de incumplimiento','Solo el nombre de las partes','Solo el precio'), exp: 'Cuanto más contexto específico, más preciso y útil será el borrador generado por la IA.' },
      { q: '¿Cuál es el riesgo de usar directamente un contrato generado por IA sin revisión?', o: opts('Que tenga errores de formato','Puede contener cláusulas inaplicables en Ecuador, vacíos legales o términos que perjudiquen al cliente','Solo tiene errores ortográficos','Es completamente confiable sin revisión'), exp: 'La IA no conoce las particularidades del caso ni la jurisprudencia local actualizada; la revisión es indispensable.' },
      { q: '¿Qué herramienta de IA permite subir un contrato existente y hacer preguntas sobre él?', o: opts('Solo ChatGPT gratuito','Claude (sube PDFs), ChatGPT Plus con archivos, o Gemini Advanced','Solo Perplexity','Solo herramientas de pago corporativas'), exp: 'Claude y ChatGPT Plus permiten subir documentos y hacer análisis, revisión o resúmenes del contrato.' },
    ]
  },
  {
    match: ['análisis', 'riesgo legal', 'automatizado'],
    title: 'Quiz: Análisis de Riesgo Legal con IA',
    questions: [
      { q: '¿Qué es el análisis de riesgo legal en el contexto empresarial?', o: opts('Calcular el seguro de la empresa','Identificar exposiciones legales, probabilidades de litigio y mitigaciones en operaciones o contratos','Revisar el registro mercantil','Solo aplica a empresas grandes'), exp: 'El análisis de riesgo legal identifica vulnerabilidades antes de que se conviertan en litigios o sanciones.' },
      { q: 'Al usar IA para evaluar riesgo contractual, ¿qué variables debe analizar el modelo?', o: opts('Solo el precio del contrato','Cláusulas de incumplimiento, penalidades, jurisdicción, fuerza mayor y garantías','Solo las partes firmantes','Solo la duración del contrato'), exp: 'Las cláusulas de incumplimiento y penalidades son las que más frecuentemente generan litigios empresariales.' },
      { q: '¿Cuál es una limitación importante de la IA al evaluar riesgo legal en Ecuador?', o: opts('Que es demasiado cara','Puede no conocer jurisprudencia reciente o normas específicas de Ecuador actualizadas','Que solo trabaja en inglés','Que tarda más que un abogado'), exp: 'Los modelos tienen fecha de corte de conocimiento; cambios legislativos recientes pueden no estar incorporados.' },
      { q: 'El "due diligence" legal asistido por IA sirve para:', o: opts('Decorar contratos con colores','Revisar masivamente documentos para identificar riesgos en adquisiciones, fusiones o inversiones','Solo para empresas extranjeras','Registrar marcas automáticamente'), exp: 'La IA puede revisar cientos de contratos en horas para identificar riesgos, un proceso que manualmente tomaría semanas.' },
      { q: '¿Qué regulación ecuatoriana es clave en el análisis de riesgo para empresas con datos de clientes?', o: opts('Solo el Código Civil','La LOPDP (Ley Orgánica de Protección de Datos Personales)','El Código de Trabajo exclusivamente','El Código de Comercio de 1906'), exp: 'La LOPDP establece obligaciones sobre tratamiento de datos; el incumplimiento genera sanciones administrativas.' },
    ]
  },
  {
    match: ['documentos procesales', 'ia'],
    title: 'Quiz: Documentos Procesales con IA',
    questions: [
      { q: '¿Para qué tipo de escrito procesal es más útil la IA como asistente?', o: opts('Solo demandas de divorcio','Demandas, contestaciones, recursos y escritos de trámite bajo COGEP','Solo contratos laborales','Solo para procesos penales'), exp: 'La IA genera estructuras y borradores de escritos procesales que el abogado adapta al caso específico.' },
      { q: '¿Qué información clave debe incluir una demanda ordinaria bajo COGEP?', o: opts('Solo los nombres de las partes','Juez, partes, hechos, fundamentos de derecho, pretensión, cuantía, lugar y fecha','Solo la pretensión','Solo el número de cédula del demandado'), exp: 'El Art. 142 COGEP establece los requisitos formales de la demanda ordinaria que deben cumplirse.' },
      { q: 'Al usar IA para redactar un recurso de apelación, ¿qué debes proporcionar?', o: opts('Solo el nombre del caso','La sentencia impugnada, los fundamentos del error y los artículos infringidos','Solo la fecha de la sentencia','Solo el número del proceso'), exp: 'El recurso de apelación requiere señalar con precisión los errores in iudicando o in procedendo del fallo.' },
      { q: '¿Qué es el "principio de congruencia" que la IA debe respetar en escritos procesales?', o: opts('Que el escrito sea largo','Que las pretensiones del escrito correspondan exactamente a los hechos y fundamentos expresados','Que use lenguaje técnico siempre','Que tenga muchas citas doctrinales'), exp: 'El juez solo puede resolver sobre lo pedido; incongruencia entre hechos y pretensión genera nulidad.' },
      { q: '¿Cuál es el paso final antes de presentar un escrito generado con IA al juzgado?', o: opts('Presentarlo tal como la IA lo generó','Revisión completa por el abogado: verificar citas legales, hechos, plazos y datos del caso real','Solo corregir ortografía','Solo verificar el nombre del cliente'), exp: 'El abogado es responsable del contenido presentado; la revisión integral es un deber ético irrenunciable.' },
    ]
  },
  {
    match: ['compliance', 'ia', 'ley', 'ecuador'],
    title: 'Quiz: Compliance — IA y la Ley en Ecuador',
    questions: [
      { q: '¿Qué ley ecuatoriana regula el tratamiento de datos personales que aplica al uso de IA?', o: opts('Solo el Código Civil','LOPDP — Ley Orgánica de Protección de Datos Personales','El Código de Comercio','Solo normas internacionales'), exp: 'La LOPDP vigente establece principios, derechos y obligaciones en el tratamiento de datos en Ecuador.' },
      { q: '¿Qué implica el principio de "responsabilidad proactiva" de la LOPDP para quien usa IA?', o: opts('Solo actuar si hay una queja','Implementar medidas preventivas antes de que ocurra un incidente de datos','Solo aplica a empresas grandes','Solo aplica a datos de salud'), exp: 'El responsable del tratamiento debe demostrar activamente que cumple la normativa, sin esperar fiscalización.' },
      { q: '¿Puede una empresa en Ecuador usar datos personales de clientes para entrenar un modelo de IA?', o: opts('Sí, sin restricciones','Solo con base legal adecuada: consentimiento informado o interés legítimo justificado','No, nunca bajo ninguna circunstancia','Solo si la empresa es pequeña'), exp: 'La LOPDP exige base legal para todo tratamiento; entrenar IA con datos de clientes requiere consentimiento explícito.' },
      { q: '¿Qué es la "evaluación de impacto en protección de datos" (EIPD)?', o: opts('Un tipo de auditoría financiera','Análisis previo de riesgos al implementar tratamiento de datos que puede afectar derechos de personas','Un registro de usuarios','Una certificación de software'), exp: 'La EIPD es obligatoria cuando el tratamiento de datos genera alto riesgo para los derechos de los titulares.' },
      { q: 'Un abogado que usa IA para analizar documentos con datos de clientes debe:', o: opts('No informar al cliente','Informar al cliente, garantizar confidencialidad y usar herramientas con políticas de privacidad adecuadas','Publicar el análisis en internet','Compartir los datos con el proveedor de IA sin restricciones'), exp: 'El secreto profesional y la LOPDP obligan a informar, proteger y limitar el tratamiento de datos del cliente.' },
    ]
  },
  {
    match: ['seguridad', 'confidencialidad', 'datos', 'jurídico'],
    title: 'Quiz: Seguridad y Confidencialidad de Datos Jurídicos',
    questions: [
      { q: '¿Qué es el secreto profesional del abogado en Ecuador?', o: opts('Una opción voluntaria','Obligación legal y ética de no revelar información del cliente obtenida en el ejercicio profesional','Solo aplica en juicios penales','Solo para abogados corporativos'), exp: 'El secreto profesional está protegido en el COFJ y es un derecho-deber irrenunciable del abogado.' },
      { q: '¿Cuál es la práctica más segura al usar IA con documentos confidenciales del cliente?', o: opts('Subir el expediente completo a cualquier IA','Usar IA con acuerdo de confidencialidad o herramientas enterprise, anonimizando datos identificatorios','Compartir con todos los abogados del estudio','Publicar para obtener más perspectivas'), exp: 'Siempre proteger la identidad del cliente y usar plataformas con políticas de confidencialidad documentadas.' },
      { q: '¿Qué datos de un expediente jurídico son especialmente sensibles bajo la LOPDP?', o: opts('Solo el nombre del caso','Datos de salud, orientación sexual, condición migratoria, historial penal y datos financieros del cliente','Solo el número de expediente','Solo los testigos'), exp: 'La LOPDP categoriza estos datos como "sensibles" y exige protección reforzada en su tratamiento.' },
      { q: '¿Cuándo puede un abogado revelar información confidencial del cliente a terceros?', o: opts('Siempre que sea conveniente','Solo con consentimiento del cliente o por obligación legal expresa (ej: prevención de delitos graves)','Cuando el caso sea interesante académicamente','Cuando el cliente no pague honorarios'), exp: 'Las excepciones al secreto profesional están taxativamente previstas en la ley; no hay discrecionalidad.' },
      { q: 'Una herramienta de IA "enterprise" o "for business" ofrece mayor seguridad porque:', o: opts('Es más cara, por eso es mejor','No usa los datos del cliente para entrenar modelos y tiene controles de acceso auditables','Solo tiene más funciones','Es más rápida'), exp: 'Las versiones enterprise tienen DPA (acuerdos de procesamiento de datos) que protegen la confidencialidad.' },
    ]
  },
  {
    match: ['evaluación crítica', 'ia', 'derecho'],
    title: 'Quiz: Evaluación Crítica de IA en Derecho',
    questions: [
      { q: '¿Qué ocurrió en el caso "Mata vs. Avianca" (2023) que marcó un precedente para abogados?', o: opts('Un avión fue detenido por IA','Un abogado fue sancionado por presentar sentencias inventadas por ChatGPT sin verificar','La IA ganó un caso contra Avianca','Un juez fue reemplazado por IA'), exp: 'El juez sancionó al abogado por citar seis sentencias inexistentes generadas por ChatGPT como si fueran reales.' },
      { q: '¿Cuándo es más peligroso confiar en la IA sin verificar en contexto jurídico?', o: opts('Al redactar cartas simples','Al citar artículos de ley, sentencias o estadísticas en documentos presentados al juzgado','Al hacer resúmenes internos','Al hacer traducción de contratos en inglés'), exp: 'Las citas legales incorrectas pueden derivar en sanciones disciplinarias, nulidades y perjuicio al cliente.' },
      { q: '¿Qué técnica reduce las alucinaciones en outputs jurídicos de la IA?', o: opts('Hacer la pregunta más corta','Proveer el texto legal real en el prompt y pedir análisis sobre ese texto específico (RAG)','Hacer la misma pregunta 5 veces','Usar la IA en inglés siempre'), exp: 'Retrieval-Augmented Generation: dar a la IA los documentos reales reduce drásticamente las alucinaciones.' },
      { q: '¿Cómo verificas que un artículo del COGEP citado por la IA es correcto?', o: opts('Si suena lógico, está correcto','Buscar el texto oficial en Lexis, Registro Oficial o la web de la Asamblea Nacional','Preguntarle a la IA si está segura','Verificar en Google sin ir a la fuente oficial'), exp: 'Solo las fuentes oficiales (Lexis Ecuador, Registro Oficial) garantizan el texto legal vigente actualizado.' },
      { q: '¿Qué responsabilidad profesional tiene el abogado por errores en documentos generados con IA?', o: opts('Ninguna, es culpa de la IA','Total: el abogado es responsable de todo lo que firma y presenta, independientemente de la herramienta usada','Solo si el cliente se queja','Responsabilidad compartida con el proveedor de IA'), exp: 'El abogado es el profesional responsable; usar IA no exime de responsabilidad deontológica ni legal.' },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // MEDICOS (8 sessions)
  // ══════════════════════════════════════════════════════════════

  {
    match: ['fundamentos', 'ia', 'salud', 'médico'],
    title: 'Quiz: Fundamentos de IA para Médicos',
    questions: [
      { q: '¿Qué diferencia a los modelos de IA médica actuales de los sistemas expertos de los años 90?', o: opts('Los sistemas actuales son más lentos','Los LLM aprenden de millones de textos clínicos de forma estadística, sin reglas manuales','Los actuales no necesitan datos','No hay diferencia relevante'), exp: 'LLM modernos aprenden patrones de enormes corpus (PubMed, guías clínicas) sin reglas programadas manualmente.' },
      { q: '¿Para qué puede usarse la IA en el contexto del MSP Ecuador actualmente?', o: opts('Firmar recetas médicas de forma autónoma','Optimizar agendas, sugerir diferenciales y documentar consultas como asistente','Diagnosticar sin médico en zonas rurales','Recetar medicamentos sin supervisión'), exp: 'La IA asiste al médico en tareas administrativas y de apoyo; diagnóstico y receta siguen siendo responsabilidad médica.' },
      { q: '¿Por qué la IA puede dar respuestas médicas incorrectas?', o: opts('Porque no tiene internet','Generaliza estadísticamente y puede alucinar información clínica como dosis o diagnósticos','Porque solo fue entrenada en inglés','Porque necesita más RAM'), exp: 'La alucinación clínica es el mayor riesgo: la IA puede inventar dosis, diagnósticos o estudios inexistentes.' },
      { q: '¿Cuál es la actitud correcta de un médico al usar IA en práctica clínica?', o: opts('Confiar completamente en la IA','Usar IA como asistente validando siempre con criterio clínico y evidencia actualizada','Evitar la IA completamente','Solo usar IA para administración'), exp: 'La IA es una herramienta de apoyo poderosa; el juicio clínico del médico es siempre la autoridad final.' },
      { q: '¿Qué es "human-in-the-loop" en aplicaciones médicas de IA?', o: opts('Que el médico programa la IA','Un humano supervisa, valida y puede corregir cada decisión relevante de la IA','Los pacientes votan respuestas de la IA','Un tipo de red neuronal'), exp: 'Human-in-the-loop garantiza supervisión médica en cada decisión clínica asistida por IA, clave para seguridad.' },
    ]
  },
  {
    match: ['chatgpt', 'claude', 'clínica', 'práctica'],
    title: 'Quiz: ChatGPT y Claude en la Práctica Clínica',
    questions: [
      { q: '¿Qué es una nota SOAP y cómo la ayuda a generar la IA?', o: opts('Un protocolo de seguridad','Subjetivo-Objetivo-Análisis-Plan: la IA genera el borrador estructurado desde la descripción del médico','Un tipo de consentimiento','Una receta electrónica'), exp: 'SOAP es el estándar de documentación clínica; la IA puede estructurar el borrador ahorrando 5-10 min por consulta.' },
      { q: 'Al pedir diagnósticos diferenciales a ChatGPT, ¿qué información debes proveer?', o: opts('Solo el nombre del paciente','Edad, sexo, síntomas, tiempo de evolución, antecedentes y resultados de exámenes relevantes','Solo la queja principal','El número de cédula'), exp: 'Cuanto más contexto clínico estructurado proveas, más pertinentes serán los diferenciales generados.' },
      { q: '¿Cuál es el riesgo de usar ChatGPT para dosificación de medicamentos?', o: opts('Que responda en inglés','Puede generar dosis desactualizadas, incorrectas o no validadas para el contexto ecuatoriano','Que sea demasiado lento','Que use nombres genéricos'), exp: 'Las dosis deben verificarse en fuentes oficiales como Vademécum o guías del MSP; la IA puede equivocarse.' },
      { q: '¿Cómo puede la IA ayudar con educación al paciente?', o: opts('Enviando mensajes directamente al paciente','Generando explicaciones sencillas del diagnóstico que el médico revisa y entrega','Reemplazando la consulta de seguimiento','Diagnosticando al paciente por WhatsApp'), exp: 'La IA genera materiales educativos adaptados al nivel de comprensión; el médico los valida antes de entregar.' },
      { q: '¿Por qué Claude tiene ventaja sobre ChatGPT para documentar consultas largas?', o: opts('Es completamente gratis','Maneja ventanas de contexto más largas, ideal para historias clínicas extensas','Conecta con el IESS automáticamente','Genera imágenes médicas'), exp: 'Claude destaca por su ventana de contexto extendida y su precisión en documentos largos y estructurados.' },
    ]
  },
  {
    match: ['privacidad', 'datos', 'paciente'],
    title: 'Quiz: Privacidad de Datos del Paciente',
    questions: [
      { q: '¿Qué ley ecuatoriana protege los datos personales de los pacientes?', o: opts('Solo el Código de Salud','LOPDP — Ley Orgánica de Protección de Datos Personales','Solo normas del MSP','El Código Civil únicamente'), exp: 'La LOPDP regula el tratamiento de todos los datos personales, incluyendo los datos de salud como categoría sensible.' },
      { q: '¿Qué datos de salud son considerados "sensibles" bajo la LOPDP?', o: opts('Solo el nombre y edad','Estado de salud, historial médico, genética, orientación sexual y condición psicológica','Solo diagnósticos de enfermedades graves','Solo datos de menores de edad'), exp: 'Los datos de salud son "categoría especial" bajo la LOPDP y exigen protección reforzada en su tratamiento.' },
      { q: 'Antes de usar datos de pacientes con IA, ¿qué debes hacer?', o: opts('Subir el expediente completo directamente','Anonimizar o pseudonimizar los datos y usar herramientas con garantías de confidencialidad','Pedir permiso solo si el paciente pregunta','Solo si el paciente es famoso'), exp: 'La anonimización elimina el riesgo de identificación; la pseudonimización reduce el riesgo con datos reversibles.' },
      { q: '¿Qué información puede compartirse con IA sin riesgo de violar la confidencialidad?', o: opts('Todo el expediente clínico real','Datos completamente anonimizados sin posibilidad de re-identificación','Solo radiografías','Solo el diagnóstico sin el nombre'), exp: 'Solo datos donde la re-identificación es imposible pueden usarse libremente; cualquier identificador implica riesgo.' },
      { q: '¿Cuál es la obligación del médico ante una brecha de seguridad de datos de pacientes?', o: opts('Solo informar al director del hospital','Notificar al paciente afectado y a la Autoridad de Protección de Datos en plazos definidos por la LOPDP','Solo si hay daño económico','No hay obligación formal'), exp: 'La LOPDP establece plazos y procedimientos específicos de notificación ante brechas de seguridad de datos.' },
    ]
  },
  {
    match: ['diagnóstico asistido', 'ia'],
    title: 'Quiz: IA en Diagnóstico Asistido',
    questions: [
      { q: '¿Qué herramienta fue diseñada específicamente para diagnósticos diferenciales médicos?', o: opts('ChatGPT versión gratuita','Glass Health (glass.health)','Instagram para médicos','Zoom para telemedicina'), exp: 'Glass Health genera diferenciales y planes clínicos en formato médico estructurado basado en evidencia.' },
      { q: 'En radiología, ¿qué puede detectar la IA con alta precisión actualmente?', o: opts('Cualquier enfermedad por imagen','Patrones específicos como nódulos pulmonares o retinopatía diabética en imágenes de alta calidad','Reemplazar al radiólogo completamente','Operar escáneres de forma autónoma'), exp: 'IA especializada detecta patrones específicos con alta sensibilidad; el radiólogo confirma el diagnóstico final.' },
      { q: '¿Qué es el "sesgo algorítmico" en diagnóstico por IA?', o: opts('Un error de programación','El modelo es menos preciso en grupos subrepresentados en sus datos de entrenamiento','Que la IA es más rápida que el médico','Un tipo de virus'), exp: 'Si el modelo fue entrenado mayormente con datos de ciertos grupos étnicos, puede ser menos preciso en otros.' },
      { q: '¿Cuál es la métrica más importante para evaluar una IA de diagnóstico?', o: opts('Velocidad de respuesta','Sensibilidad, especificidad y valor predictivo en la población objetivo específica','Precio de la licencia','Número de usuarios'), exp: 'Sensibilidad (detecta positivos reales) y especificidad (evita falsos positivos) definen la utilidad clínica real.' },
      { q: '¿Qué significa que una IA de diagnóstico tenga "FDA clearance" o equivalente?', o: opts('Que es gratuita','Fue evaluada y aprobada por una autoridad regulatoria para uso clínico específico','Que fue hecha en EE.UU.','Que cualquier médico puede usarla sin entrenamiento'), exp: 'La aprobación regulatoria garantiza que la IA fue validada clínicamente para el uso específico aprobado.' },
    ]
  },
  {
    match: ['documentación clínica', 'automatizada'],
    title: 'Quiz: Documentación Clínica Automatizada',
    questions: [
      { q: '¿Cuánto tiempo promedio ahorra la IA en documentación clínica por consulta?', o: opts('Ninguno','5 a 15 minutos por consulta según estudios en EE.UU. y Europa','Solo 30 segundos','Más de una hora'), exp: 'Estudios muestran 5-15 minutos de ahorro por consulta, equivalente a 1-3 horas extra de atención diaria.' },
      { q: '¿Qué herramienta de IA está específicamente diseñada para transcripción médica automática?', o: opts('Siri','Suki AI y Nuance DAX para ambient documentation','Google Translate','WhatsApp'), exp: 'Suki AI y Nuance DAX capturan la conversación médico-paciente y generan la nota clínica automáticamente.' },
      { q: 'Al usar IA para generar una epicrisis, ¿qué información debes proveerle?', o: opts('Solo el diagnóstico final','Historia clínica relevante, evolución, estudios, tratamientos y condición al alta','Solo el nombre del médico tratante','Solo la fecha de ingreso'), exp: 'La epicrisis sintetiza toda la hospitalización; la IA necesita el contexto completo para generarla correctamente.' },
      { q: '¿Qué verificación es indispensable en notas clínicas generadas por IA?', o: opts('Solo la ortografía','Que los datos del paciente, fechas, diagnósticos y tratamientos coincidan exactamente con el expediente real','Solo el formato','Solo el nombre del médico'), exp: 'Errores en datos clínicos pueden derivar en decisiones incorrectas posteriores; verificar siempre con la historia real.' },
      { q: '¿Cómo beneficia la documentación automatizada a la continuidad del cuidado?', o: opts('Solo beneficia al médico que documenta','Notas más completas y estandarizadas facilitan que otros médicos entiendan el caso rápidamente','No beneficia la continuidad','Solo en hospitales privados'), exp: 'Notas completas y estructuradas reducen errores de comunicación entre turnos y especialidades.' },
    ]
  },
  {
    match: ['búsqueda bibliográfica', 'ia'],
    title: 'Quiz: Búsqueda Bibliográfica con IA',
    questions: [
      { q: '¿Qué herramienta de IA sintetiza evidencia científica de PubMed automáticamente?', o: opts('TikTok','Elicit.org y Consensus.app','Google Maps','LinkedIn'), exp: 'Elicit y Consensus son motores de búsqueda académica con IA que sintetizan literatura científica por preguntas.' },
      { q: '¿Cuál es el mayor riesgo al usar ChatGPT para investigación médica?', o: opts('Que responda en otro idioma','Que cite estudios inexistentes o con datos incorrectos (alucinaciones bibliográficas)','Que solo tenga artículos de 2020','Que sea caro'), exp: 'La alucinación bibliográfica es crítica: ChatGPT puede inventar autores, títulos y conclusiones falsas.' },
      { q: '¿Cómo verificas que un artículo citado por la IA existe realmente?', o: opts('Confiando en el DOI que da la IA','Buscando el título exacto en PubMed, Google Scholar o la web oficial de la revista','Preguntándole a la IA si es real','Solo si es de Harvard'), exp: 'Busca por título y autores en PubMed o Semantic Scholar antes de citar en cualquier documento clínico.' },
      { q: '¿Qué es PICO en investigación médica?', o: opts('Un tipo de estetoscopio','Población-Intervención-Comparación-Outcome: estructura para formular preguntas de investigación','Un software estadístico','Una red de hospitales'), exp: 'PICO estructura la pregunta clínica para hacer búsquedas bibliográficas más precisas y relevantes.' },
      { q: '¿Qué nivel de evidencia tienen los meta-análisis de ensayos clínicos aleatorizados?', o: opts('Nivel más bajo (opinión de expertos)','Nivel 1: el más alto en medicina basada en evidencia','Nivel 3: estudios observacionales','Nivel 4: reportes de casos'), exp: 'Los meta-análisis de ECAs representan el nivel más alto de evidencia en la jerarquía de MBE.' },
    ]
  },
  {
    match: ['imágenes médicas', 'ia'],
    title: 'Quiz: Análisis de Imágenes Médicas con IA',
    questions: [
      { q: '¿Qué tipo de red neuronal se usa principalmente en análisis de imágenes médicas?', o: opts('Red neuronal recurrente (RNN)','Red neuronal convolucional (CNN) especializada en reconocimiento de patrones visuales','Red Bayesiana lineal','Árbol de decisión simple'), exp: 'Las CNN aprenden características visuales jerárquicas, siendo ideales para detectar patrones en radiografías y TAC.' },
      { q: '¿Qué empresa ecuatoriana desarrolla IA para imágenes médicas mencionada en el programa ITSEIA?', o: opts('H3L','ImagemIA (imagemia.com)','Strata','ITSEIA directamente'), exp: 'ImagemIA es una empresa del ecosistema ITSEIA que desarrolla IA predictiva para imagenología médica en Ecuador.' },
      { q: 'La IA en radiología actualmente tiene mayor precisión en:', o: opts('Cualquier patología sin limitaciones','Detección de nódulos pulmonares, retinopatía diabética y fracturas en imágenes de alta calidad','Diagnóstico de enfermedades raras siempre','Imágenes de baja calidad'), exp: 'Las IA aprobadas clínicamente destacan en tareas específicas con datos de entrenamiento abundantes y de alta calidad.' },
      { q: '¿Cuál es el rol correcto del radiólogo al usar IA como segunda lectura?', o: opts('La IA toma la decisión, el radiólogo la aprueba mecánicamente','El radiólogo interpreta primero o valida el resultado de la IA con criterio especializado','No es necesario el radiólogo','El radiólogo solo firma el informe'), exp: 'La IA es un "segundo par de ojos" que reduce falsas negativas; el radiólogo sigue siendo el responsable clínico.' },
      { q: '¿Qué limita actualmente el uso masivo de IA de imagenología en Ecuador?', o: opts('Falta de equipos médicos','Acceso limitado a equipos de alta resolución, datos etiquetados y conectividad en zonas rurales','Solo se puede usar en hospitales privados','No hay limitaciones reales'), exp: 'La calidad del dato (imagen) y la infraestructura tecnológica son los principales cuellos de botella en Ecuador.' },
    ]
  },
  {
    match: ['plan de tratamiento', 'asistido', 'ia'],
    title: 'Quiz: Plan de Tratamiento Asistido por IA',
    questions: [
      { q: '¿Cuál es el rol correcto de la IA en la elaboración de un plan de tratamiento?', o: opts('Decidir y prescribir autónomamente','Sugerir opciones basadas en guías clínicas que el médico evalúa y adapta al paciente específico','Reemplazar la junta médica','Solo para enfermedades crónicas'), exp: 'La IA sugiere opciones basadas en evidencia; el médico individualiza según el contexto clínico del paciente.' },
      { q: '¿Qué información estructurada debes proveer para un plan de tratamiento con IA?', o: opts('Solo el diagnóstico','Diagnóstico, comorbilidades, alergias, medicación actual, contexto social y preferencias del paciente','Solo edad y sexo','El número de póliza del seguro'), exp: 'Cuanto más contexto clínico completo, más relevante y seguro será el plan sugerido por la IA.' },
      { q: '¿Cuándo es indispensable una junta médica aunque exista IA?', o: opts('Nunca, la IA resuelve todo','En casos complejos, raros, de alto riesgo o con conflicto entre especialidades','Solo para cirugías','Solo en hospitales públicos'), exp: 'La junta médica garantiza perspectivas múltiples; la IA no reemplaza el consenso de especialistas en casos difíciles.' },
      { q: 'Al documentar un plan de tratamiento asistido por IA, debes:', o: opts('No mencionarlo para evitar cuestionamientos','Indicar que la IA apoyó la investigación y que el médico tomó la decisión final con criterio clínico','Atribuir el plan a la IA','Solo documentarlo si el paciente pregunta'), exp: 'La transparencia protege al médico y al paciente; documentar el rol de la IA es buena práctica clínica.' },
      { q: '¿Cómo puede la IA apoyar el seguimiento de un paciente con enfermedad crónica?', o: opts('Reemplazando las consultas de seguimiento','Analizando tendencias en datos vitales, alertando desviaciones y sugiriendo ajustes al médico','Contactando al paciente directamente','Solo registrando datos sin análisis'), exp: 'La IA puede monitorear tendencias en datos del paciente y alertar al médico sobre cambios clínicamente relevantes.' },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // GERENTES (8 sessions)
  // ══════════════════════════════════════════════════════════════

  {
    match: ['ia', 'gestión', 'gerente', 'management'],
    title: 'Quiz: IA Aplicada a la Gestión Empresarial',
    questions: [
      { q: '¿Cuál es el principal valor de la IA para un gerente general?', o: opts('Reemplazar a todos los empleados','Automatizar análisis de datos, generar reportes ejecutivos y apoyar decisiones estratégicas','Solo para el área de TI','Solo para reducir costos de impresión'), exp: 'La IA libera al gerente de análisis rutinarios, permitiendo enfocarse en decisiones de mayor valor estratégico.' },
      { q: '¿Qué es un "dashboard inteligente" con IA?', o: opts('Una pantalla muy grande','Panel de métricas con análisis automático, alertas y narrativas generadas por IA sobre los datos','Solo gráficos de Excel','Un software de contabilidad'), exp: 'Los dashboards con IA no solo muestran datos; generan insights, detectan anomalías y sugieren acciones.' },
      { q: 'Al usar IA para análisis competitivo, ¿cuál es la fuente más confiable de datos?', o: opts('Rumores del mercado','Datos públicos verificables: informes anuales, registros mercantiles y noticias de fuentes primarias','Solo las redes sociales','Las opiniones de los empleados'), exp: 'La IA procesa mejor datos estructurados de fuentes primarias; los rumores generan análisis poco confiables.' },
      { q: '¿Qué es la "automatización de procesos robóticos" (RPA) y cómo se relaciona con la IA?', o: opts('Un robot físico en la oficina','Software que automatiza tareas repetitivas en computadoras; combinado con IA, también procesa lenguaje natural','Un sistema de cámaras','Solo para manufactura'), exp: 'RPA + IA (Intelligent Automation) puede automatizar procesos que incluyen documentos, correos y decisiones simples.' },
      { q: '¿Cuál es el mayor riesgo de implementar IA en una empresa sin estrategia clara?', o: opts('Que la IA sea cara','Implementación de herramientas sin integración, generando silos de datos y baja adopción','Que los empleados aprendan demasiado rápido','Que los clientes lo rechacen siempre'), exp: 'Sin estrategia, las empresas acumulan herramientas sin integración que no generan valor y generan resistencia.' },
    ]
  },
  {
    match: ['toma de decisiones', 'datos', 'gerente'],
    title: 'Quiz: Toma de Decisiones Basada en Datos con IA',
    questions: [
      { q: '¿Qué diferencia una decisión "data-driven" de una basada en intuición?', o: opts('No hay diferencia práctica','La decisión data-driven usa evidencia cuantitativa y análisis sistemático para reducir sesgo','Solo que es más lenta','Que la toman los departamentos de TI'), exp: 'Las decisiones basadas en datos tienen menor probabilidad de error sistemático y son más auditables y reproducibles.' },
      { q: '¿Qué es un KPI y cómo la IA mejora su seguimiento?', o: opts('Un tipo de reunión gerencial','Indicador clave de desempeño; la IA monitorea KPIs en tiempo real y alerta desviaciones automáticamente','Un formato de reporte','Un software específico'), exp: 'La IA permite seguimiento continuo de KPIs con alertas proactivas, eliminando revisiones manuales periódicas.' },
      { q: 'Al presentar análisis de IA al directorio, ¿qué debes explicar siempre?', o: opts('Los detalles técnicos del algoritmo','Los supuestos del modelo, los límites de los datos y la confianza en las conclusiones','Solo el número final','Solo las recomendaciones sin contexto'), exp: 'El directorio necesita entender las limitaciones para tomar decisiones informadas; la transparencia es clave.' },
      { q: '¿Qué es el "análisis de causa raíz" asistido por IA?', o: opts('Solo un informe de ventas','Técnica que usa IA para identificar la causa fundamental de un problema, no solo sus síntomas','Un tipo de auditoría externa','Solo para problemas técnicos'), exp: 'La IA puede correlacionar múltiples variables para identificar la causa real de una caída en ventas o calidad.' },
      { q: '¿Cuál herramienta permite a gerentes no técnicos hacer análisis de datos conversacional?', o: opts('Solo Excel avanzado','Microsoft Copilot en Power BI o ChatGPT con conexión a datos mediante plugins','Solo Python con pandas','Solo herramientas de $10,000+'), exp: 'Copilot en Power BI permite preguntar "¿por qué cayeron las ventas en marzo?" en lenguaje natural.' },
    ]
  },
  {
    match: ['automatización', 'procesos', 'gerente'],
    title: 'Quiz: Automatización de Procesos con IA',
    questions: [
      { q: '¿Cuál es el primer paso para automatizar un proceso empresarial con IA?', o: opts('Comprar la herramienta de IA más cara','Mapear el proceso actual, identificar tareas repetitivas y definir el output esperado','Pedir al área de TI que decida','Contratar un consultor externo siempre'), exp: 'Sin entender el proceso actual, cualquier automatización generará un proceso defectuoso a mayor velocidad.' },
      { q: '¿Qué tipo de tarea es más adecuada para automatizar con IA?', o: opts('Negociaciones estratégicas complejas','Tareas repetitivas, basadas en reglas claras y con alto volumen: clasificación, extracción, respuestas estándar','La toma de decisiones éticas','La gestión de relaciones clave'), exp: 'La IA es más eficiente en tareas con patrones claros y alto volumen; las tareas complejas requieren supervisión humana.' },
      { q: '¿Qué es un "flujo de trabajo" (workflow) automatizado con IA?', o: opts('Una reunión de planificación','Secuencia de tareas conectadas donde la IA ejecuta pasos automáticamente según condiciones predefinidas','Un tipo de contrato laboral','Un organigrama empresarial'), exp: 'Herramientas como Zapier, Make o n8n conectan aplicaciones y automatizan flujos completos con IA integrada.' },
      { q: '¿Cómo se mide el ROI de una automatización con IA?', o: opts('Solo por el costo del software','Horas ahorradas × costo hora + reducción de errores + mejora en velocidad - costo total implementación','Solo por satisfacción del empleado','Solo si hay reducción de personal'), exp: 'El ROI de automatización debe incluir valor de tiempo liberado, reducción de errores y mejora en tiempos de respuesta.' },
      { q: '¿Cuál es la resistencia más común de empleados ante automatización con IA?', o: opts('Que la IA sea difícil de usar','Temor a perder el empleo y falta de capacitación; el gerente debe gestionar el cambio activamente','Que la IA sea muy lenta','Que cueste demasiado'), exp: 'La gestión del cambio y la capacitación son críticas; empleados capacitados ven la IA como aliada, no amenaza.' },
    ]
  },
  {
    match: ['recursos humanos', 'ia', 'talento'],
    title: 'Quiz: IA en Gestión de Talento y RRHH',
    questions: [
      { q: '¿Para qué proceso de RRHH es más útil la IA actualmente?', o: opts('Negociar salarios autónomamente','Filtrado de CVs, análisis de brechas de competencias y detección de riesgo de rotación','Despedir empleados automáticamente','Gestionar nómina sin supervisión'), exp: 'La IA puede analizar cientos de CVs, detectar patrones de rotación y mapear brechas de skills eficientemente.' },
      { q: '¿Qué sesgo puede introducir la IA en procesos de selección de personal?', o: opts('Ninguno, la IA es objetiva','Sesgo histórico: si los datos de entrenamiento reflejan discriminación pasada, la IA la perpetúa','Solo sesgo de género','Solo en empresas grandes'), exp: 'Algoritmos de selección entrenados en datos históricos pueden discriminar por género, edad o etnia involuntariamente.' },
      { q: '¿Cómo puede la IA apoyar el desarrollo profesional de los empleados?', o: opts('Reemplazando los programas de capacitación','Identificando brechas de competencias y sugiriendo rutas de aprendizaje personalizadas por empleado','Solo enviando recordatorios de cursos','Solo para empleados nuevos'), exp: 'La IA puede cruzar competencias requeridas por el puesto con las actuales del empleado y generar planes de desarrollo.' },
      { q: '¿Qué es el "people analytics" con IA?', o: opts('Un software de nómina','Análisis de datos de empleados para tomar decisiones informadas sobre talento, cultura y desempeño','Solo estadísticas de ausentismo','Un tipo de evaluación 360'), exp: 'People analytics usa datos de empleados para identificar patrones: quién rota, qué factores predicen el desempeño alto.' },
      { q: 'Al implementar IA en RRHH, ¿qué consideración ética es prioritaria?', o: opts('Solo el costo del software','Transparencia con empleados sobre qué datos se usan, para qué y cómo protegen su privacidad','Que sea el sistema más avanzado','Solo cumplir la ley mínimamente'), exp: 'Los empleados tienen derecho a saber cómo se usan sus datos; la ética en people analytics genera confianza y adoption.' },
    ]
  },
  {
    match: ['estrategia', 'ia', 'empresa', 'innovación'],
    title: 'Quiz: Estrategia de IA para Empresas',
    questions: [
      { q: '¿Cuáles son los tres pilares de una estrategia de IA empresarial exitosa?', o: opts('Hardware, software y marketing','Datos de calidad, talento habilitado y procesos rediseñados para IA','Solo comprar herramientas de IA','Solo contratar un Chief AI Officer'), exp: 'Sin datos limpios, equipo capacitado y procesos rediseñados, las herramientas de IA no generan valor real.' },
      { q: '¿Qué es un "caso de uso" de IA y por qué empezar por los de alto impacto?', o: opts('Un manual técnico de IA','Aplicación específica de IA a un problema de negocio; empezar por alto impacto y factibilidad garantiza ROI rápido','Solo proyectos de investigación','Un tipo de contrato de software'), exp: 'Comenzar con casos de uso de alto impacto y baja complejidad genera victorias tempranas que generan momentum.' },
      { q: '¿Qué es el "build vs buy" en decisiones de IA empresarial?', o: opts('Solo aplica a manufactura','Decidir entre desarrollar IA propia (costoso, personalizado) o comprar soluciones (rápido, menos personalizado)','Solo para empresas de tecnología','Una decisión del área de marketing'), exp: 'Para la mayoría de empresas en Ecuador, "buy or integrate" es más práctico que construir IA desde cero.' },
      { q: '¿Cuál es el mayor error estratégico en adopción de IA empresarial?', o: opts('Empezar con proyectos pequeños','Comprar tecnología sin definir el problema de negocio que resuelve ni los KPIs de éxito','Capacitar a los empleados','Medir el ROI'), exp: 'La tecnología sin propósito genera proyectos costosos abandonados; siempre partir del problema de negocio.' },
      { q: 'En Ecuador 2026, ¿cuál sector tiene más oportunidad de diferenciación con IA?', o: opts('Solo las empresas de tecnología','Cualquier sector con procesos repetitivos y datos históricos: finanzas, salud, construcción, legal','Solo las multinacionales','Solo startups'), exp: 'La adopción de IA en Ecuador está en etapas tempranas; cualquier sector que la adopte primero obtiene ventaja competitiva.' },
    ]
  },
  {
    match: ['comunicación', 'ia', 'productividad', 'gerente'],
    title: 'Quiz: IA para Comunicación y Productividad Gerencial',
    questions: [
      { q: '¿Cómo puede la IA mejorar la preparación de reuniones gerenciales?', o: opts('No puede ayudar en reuniones','Generando agendas, resumiendo antecedentes y preparando preguntas clave previas a la reunión','Solo tomando notas durante la reunión','Solo para reuniones virtuales'), exp: 'La IA puede preparar briefings ejecutivos, resumir informes previos y generar agenda optimizada en minutos.' },
      { q: '¿Qué herramienta transcribe y resume reuniones automáticamente?', o: opts('Solo un secretario humano','Otter.ai, Fireflies o Microsoft Copilot en Teams con resumen de acuerdos y acciones','Solo grabaciones de video','Solo Zoom sin funciones extra'), exp: 'Herramientas como Otter.ai generan transcripción, resumen y lista de tareas pendientes de cada reunión.' },
      { q: 'Al usar IA para redactar comunicados ejecutivos, ¿qué debes siempre revisar?', o: opts('Solo la ortografía','El tono, los datos de respaldo, la precisión de las cifras y que el mensaje refleje la posición real de la empresa','Solo el formato','Solo el saludo inicial'), exp: 'Los comunicados ejecutivos impactan reputación y decisiones; la IA puede generar el borrador pero el gerente valida.' },
      { q: '¿Qué es el "email overload" y cómo lo aborda la IA?', o: opts('Un problema de hardware','Exceso de correos que consume tiempo; la IA prioriza, resume y sugiere respuestas automáticamente','Solo en empresas grandes','Un problema exclusivo del área de TI'), exp: 'Herramientas como Superhuman con IA o Copilot en Outlook reducen drásticamente el tiempo de gestión de correo.' },
      { q: '¿Cuál es el beneficio de usar IA para generar informes de gestión periódicos?', o: opts('Eliminar al gerente del proceso','Estandarizar el formato, reducir tiempo de preparación y permitir mayor frecuencia de reporting','Solo para empresas de más de 100 empleados','Solo si hay datos perfectos'), exp: 'Informes generados con IA en minutos permiten mayor frecuencia de revisión y más tiempo para el análisis estratégico.' },
    ]
  },
  {
    match: ['atención al cliente', 'ia', 'empresa'],
    title: 'Quiz: IA en Atención al Cliente',
    questions: [
      { q: '¿Qué es un chatbot con IA generativa y en qué se diferencia de un chatbot tradicional?', o: opts('No hay diferencia','El chatbot con IA generativa entiende lenguaje natural libre y genera respuestas contextuales, no solo opciones predefinidas','El tradicional usa IA avanzada','El de IA solo funciona en WhatsApp'), exp: 'Los chatbots generativos (basados en LLM) manejan preguntas abiertas, frustración y contexto conversacional.' },
      { q: '¿Cuál es el límite más importante de los chatbots con IA en atención al cliente?', o: opts('Que son muy caros','Situaciones emocionales complejas, quejas graves y decisiones que requieren empatía humana genuina','Que solo funcionan en inglés','Que son lentos'), exp: 'Los clientes en situaciones de crisis necesitan empátía humana; el chatbot debe escalar a un agente humano apropiadamente.' },
      { q: '¿Qué métrica mide mejor el éxito de IA en atención al cliente?', o: opts('Solo el costo ahorrado','Tasa de resolución en primer contacto, tiempo de respuesta, CSAT y tasa de escalación a humano','Solo el número de chats procesados','Solo el tiempo de respuesta'), exp: 'El CSAT (satisfacción del cliente) y la tasa de resolución miden si la IA realmente ayuda o frustra al cliente.' },
      { q: 'Al implementar un chatbot en una empresa ecuatoriana, ¿qué personalización es clave?', o: opts('Usar inglés formal','Adaptar el tono, modismos ecuatorianos y los procesos específicos de la empresa para mayor confianza','Solo cambiar el logo','Solo las horas de atención'), exp: 'Los clientes ecuatorianos responden mejor a un tono cercano y culturalmente relevante que a respuestas genéricas.' },
      { q: '¿Cómo puede la IA mejorar la retención de clientes en una empresa?', o: opts('Enviando más correos','Analizando patrones de comportamiento para detectar clientes en riesgo de churn y activar acciones preventivas','Solo dando descuentos automáticos','Solo para clientes nuevos'), exp: 'Los modelos de predicción de churn identifican señales tempranas de abandono, permitiendo intervención proactiva.' },
    ]
  },
  {
    match: ['finanzas', 'ia', 'gerente', 'empresa'],
    title: 'Quiz: IA para Análisis Financiero Gerencial',
    questions: [
      { q: '¿Cómo puede la IA mejorar el proceso de presupuestación empresarial?', o: opts('Reemplazando al CFO completamente','Analizando datos históricos, tendencias del mercado y variables macro para generar proyecciones más precisas','Solo calculando el IVA','Solo para empresas multinacionales'), exp: 'La IA combina datos internos con variables externas para generar modelos de presupuesto más robustos y dinámicos.' },
      { q: '¿Qué es el "forecasting financiero en tiempo real" con IA?', o: opts('Un reporte anual','Actualización continua de proyecciones financieras conforme llegan nuevos datos, sin esperar el cierre mensual','Solo para bancos','Un tipo de auditoría'), exp: 'El forecasting en tiempo real permite al gerente tomar decisiones con información actualizada, no con datos del mes anterior.' },
      { q: 'Al evaluar la salud financiera de una empresa con IA, ¿qué ratios son prioritarios?', o: opts('Solo las ventas brutas','Liquidez, endeudamiento, rentabilidad y capital de trabajo; la IA monitorea su evolución y alerta desviaciones','Solo el EBITDA','Solo los gastos de nómina'), exp: 'Los ratios financieros clave dan una visión integral de la salud de la empresa; la IA detecta tendencias preocupantes.' },
      { q: '¿Qué herramienta permite al gerente preguntar en lenguaje natural sobre los estados financieros?', o: opts('Solo Excel manual','Copilot en Power BI o Excel con conexión a datos financieros actualizados','Solo herramientas de $50,000+','Solo el área de finanzas puede acceder'), exp: 'Copilot permite preguntas como "¿en qué línea de negocio crecimos más en Q1?" sin conocer fórmulas.' },
      { q: '¿Cuál es el mayor riesgo de confiar completamente en proyecciones financieras de IA?', o: opts('Ninguno, son perfectamente confiables','La IA no conoce eventos extraordinarios futuros ni cambios regulatorios; requiere juicio gerencial complementario','Que sean demasiado optimistas siempre','Solo que sean costosas'), exp: 'Los modelos proyectan basándose en el pasado; el gerente debe incorporar contexto estratégico que la IA no tiene.' },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // ARQUITECTOS (8 sessions)
  // ══════════════════════════════════════════════════════════════

  {
    match: ['ia', 'arquitectura', 'diseño', 'arquitecto'],
    title: 'Quiz: IA Aplicada a la Arquitectura y Diseño',
    questions: [
      { q: '¿Cuál es el mayor impacto actual de la IA en el proceso de diseño arquitectónico?', o: opts('Reemplazar al arquitecto completamente','Acelerar la exploración de alternativas de diseño y generar variaciones en minutos desde un brief','Solo para renders fotorrealistas','Solo para cálculos estructurales'), exp: 'La IA permite explorar docenas de variantes de diseño en horas, un proceso que antes tomaba semanas.' },
      { q: '¿Qué herramienta de IA genera imágenes arquitectónicas desde descripciones de texto?', o: opts('Solo AutoCAD','Midjourney, DALL-E o Stable Diffusion con prompts de estilo arquitectónico','Solo SketchUp','Solo Revit con BIM'), exp: 'Las IA generativas de imagen producen visualizaciones conceptuales desde texto, acelerando la fase de ideación.' },
      { q: '¿Qué es el "diseño generativo" (Generative Design) en arquitectura?', o: opts('Diseñar a mano sin computadora','IA que genera múltiples soluciones de diseño optimizadas según parámetros definidos por el arquitecto','Solo renders 3D','Solo planos estructurales'), exp: 'Autodesk Forma y similares generan soluciones óptimas balanceando funcionalidad, costo, materiales y normativa.' },
      { q: '¿Cuál es el rol del arquitecto al usar diseño generativo con IA?', o: opts('Solo aprobar lo que genera la IA','Definir los parámetros, criterios de evaluación y seleccionar entre las alternativas generadas','No tiene rol activo','Solo hacer los planos finales a mano'), exp: 'El arquitecto define el problema (parámetros); la IA explora el espacio de soluciones; el arquitecto evalúa y decide.' },
      { q: '¿Qué limitación tiene la IA generativa de imágenes en fases avanzadas del proyecto?', o: opts('Ninguna, sirve para todo','Genera conceptos visuales pero no produce planos técnicos, memorias o documentación constructiva real','Solo funciona en blanco y negro','Solo para edificios residenciales'), exp: 'Las imágenes de IA son útiles para conceptos y presentaciones, pero no reemplazan los planos técnicos constructivos.' },
    ]
  },
  {
    match: ['bim', 'ia', 'revit', 'modelado'],
    title: 'Quiz: BIM + IA en Proyectos de Construcción',
    questions: [
      { q: '¿Qué es BIM (Building Information Modeling) y cómo lo potencia la IA?', o: opts('Un software de diseño 2D','Metodología de modelado digital con datos integrados; la IA analiza el modelo para detectar colisiones y optimizar','Un tipo de contrato de construcción','Solo para edificios grandes'), exp: 'BIM + IA permite coordinar todas las disciplinas, detectar interferencias y optimizar antes de construir.' },
      { q: '¿Qué puede detectar automáticamente la IA en un modelo BIM?', o: opts('Solo el color de las paredes','Interferencias entre instalaciones, incumplimientos de norma, errores de coordinación entre disciplinas','Solo problemas estructurales','Solo el costo del proyecto'), exp: 'La IA analiza el modelo 3D y detecta conflictos entre arquitectura, estructura, MEP sin revisión manual exhaustiva.' },
      { q: '¿Qué es la "estimación de costos automatizada" con IA en BIM?', o: opts('Un presupuesto a ojo','El modelo BIM genera automáticamente metrados y costos aproximados desde los elementos modelados','Solo para proyectos de más de $1M','Una funcionalidad solo de Revit avanzado'), exp: 'La integración IA+BIM puede generar estimados de costo desde el modelo, reduciendo errores de metrado manual.' },
      { q: '¿Cómo beneficia la IA al proceso de coordinación entre arquitecto e ingenieros?', o: opts('No beneficia la coordinación','Detectando interferencias en tiempo real y alertando a todos los involucrados antes de la construcción','Solo enviando correos automáticos','Solo para proyectos en BIM 5D'), exp: 'La coordinación temprana de interferencias evita costosas modificaciones durante la obra.' },
      { q: '¿Qué empresa o plataforma incorpora IA en su software BIM para análisis de edificios?', o: opts('Solo AutoCAD 2D','Autodesk Forma, Revit con Dynamo y plugins de IA para análisis de energía y optimización','Solo SketchUp gratuito','Solo software desarrollado en Ecuador'), exp: 'Autodesk Forma incorpora IA para análisis de soleamiento, viento, densidad y sustentabilidad desde etapas tempranas.' },
    ]
  },
  {
    match: ['renders', 'visualización', 'ia', 'arquitectura'],
    title: 'Quiz: Visualización e IA para Arquitectos',
    questions: [
      { q: '¿Cuánto tiempo puede ahorrar la IA en la producción de imágenes de concepto arquitectónico?', o: opts('No ahorra tiempo','De semanas a horas: la IA genera decenas de variantes de estilo y volumetría en una sesión de trabajo','Solo 10 minutos','Solo en renders finales'), exp: 'La IA generativa puede producir variantes conceptuales en minutos que antes requerían días de modelado y render.' },
      { q: '¿Qué herramienta de IA convierte bocetos a mano en renders fotorrealistas?', o: opts('Solo AutoCAD','Adobe Firefly, ControlNet (Stable Diffusion) o Vizcom para transformar sketches en renders','Solo Photoshop clásico','Solo con escáner 3D'), exp: 'Herramientas como Vizcom o ControlNet convierten bocetos en propuestas fotorrealistas manteniendo la geometría.' },
      { q: '¿Cuál es la limitación de los renders generados por IA para presentaciones a clientes?', o: opts('Ninguna, son perfectos','Pueden mostrar detalles imposibles de construir o no reflejar fielmente el diseño técnico aprobado','Solo que son en baja resolución','Solo funcionan en blanco y negro'), exp: 'El cliente puede encariñarse con elementos visuales de la IA que no corresponden al proyecto real; gestionar expectativas.' },
      { q: '¿Qué es Stable Diffusion y por qué lo usan arquitectos?', o: opts('Un tipo de hormigón','Modelo de IA open-source de generación de imágenes altamente personalizable para exploración de estilos','Un software de estructuras','Solo para diseño de interiores'), exp: 'Stable Diffusion permite controlar estilo, materiales y volumetría para exploración de alternativas arquitectónicas.' },
      { q: 'Para presentaciones de anteproyecto, ¿cómo integras renders de IA con la propuesta técnica?', o: opts('Usar solo renders de IA sin planos','Combinar imágenes de IA para comunicar el concepto emocional + planos técnicos que definen el proyecto real','Solo mostrar planos técnicos','Solo maquetas físicas'), exp: 'Los renders de IA comunican la visión; los planos técnicos definen el proyecto real. Ambos son necesarios.' },
    ]
  },
  {
    match: ['sostenibilidad', 'eficiencia energética', 'ia'],
    title: 'Quiz: IA para Arquitectura Sostenible',
    questions: [
      { q: '¿Qué puede simular la IA en etapas tempranas de diseño para mejorar la sostenibilidad?', o: opts('Solo el color de la fachada','Comportamiento solar, ventilación natural, consumo energético y confort térmico del edificio','Solo el costo de los materiales','Solo la apariencia del jardín'), exp: 'La IA permite simular el desempeño energético desde el esquema básico, orientando decisiones de diseño sostenible.' },
      { q: '¿Qué certificación de sostenibilidad es más reconocida internacionalmente para edificios?', o: opts('ISO 9001','LEED (Leadership in Energy and Environmental Design) y EDGE para mercados emergentes','Solo certificados ecuatorianos','Una certificación de la municipalidad'), exp: 'LEED es el estándar global más reconocido; EDGE fue desarrollado para mercados emergentes como Ecuador.' },
      { q: '¿Cómo ayuda la IA a optimizar la orientación de un edificio en Quito?', o: opts('No aplica en Ecuador','Analizando datos climáticos de Quito, el sol ecuatorial y vientos predominantes para maximizar luz natural y ventilación','Solo para edificios en climas fríos','Solo para edificios de más de 10 pisos'), exp: 'En Quito la incidencia solar es casi vertical todo el año; la IA optimiza aleros, ventanas y orientación para confort.' },
      { q: '¿Qué es el análisis de "ciclo de vida" (LCA) de un edificio con IA?', o: opts('El tiempo que dura la construcción','Evaluación de impacto ambiental de los materiales desde extracción hasta demolición para minimizar la huella de carbono','Solo el análisis estructural','Solo el mantenimiento del edificio'), exp: 'LCA con IA permite comparar materiales y sistemas constructivos por su impacto ambiental total, no solo por costo.' },
      { q: '¿Cuál herramienta de IA integrada en BIM analiza el desempeño energético?', o: opts('Solo hojas de cálculo','Autodesk Forma, IES VE o EnergyPlus con IA para optimización energética desde el modelo BIM','Solo herramientas de $100,000+','Solo para ingenieros mecánicos'), exp: 'Autodesk Forma incluye análisis solar, de viento y energético con IA directamente desde el modelo de diseño.' },
    ]
  },
  {
    match: ['gestión de proyectos', 'construcción', 'ia'],
    title: 'Quiz: Gestión de Proyectos de Construcción con IA',
    questions: [
      { q: '¿Cómo puede la IA mejorar la planificación de obra?', o: opts('Solo haciendo cronogramas en Excel','Analizando proyectos similares para detectar riesgos, optimizar secuencias de trabajo y predecir retrasos','Reemplazando al director de obra','Solo para obras de más de $1 millón'), exp: 'La IA aprende de proyectos anteriores para identificar cuellos de botella y optimizar la programación de actividades.' },
      { q: '¿Qué es el "control de obra con visión computacional"?', o: opts('Contratar más supervisores','Cámaras con IA que monitorean el avance, detectan riesgos de seguridad y comparan con los planos automáticamente','Solo para obras de gran altura','Una técnica de topografía'), exp: 'Sistemas como Smartvid o drones con IA monitorean la construcción en tiempo real y alertan sobre desviaciones.' },
      { q: 'Al gestionar subcontratistas con IA, ¿qué dato es más valioso para rastrear?', o: opts('Solo su número de RUC','Avance físico vs. programado, calidad de entregables, incidentes y desviaciones de costo por partida','Solo sus pagos pendientes','Solo el número de trabajadores'), exp: 'El cruce de avance físico, calidad y costo por partida permite detectar problemas antes de que generen retrasos críticos.' },
      { q: '¿Qué regulación ecuatoriana es clave en seguridad ocupacional en obras de construcción?', o: opts('Solo las normas INEN','Reglamento de Seguridad y Salud de los Trabajadores (IESS/MRL) y Normas INEN para construcción','Solo el Código Civil','Solo normativa de Quito'), exp: 'El IESS y el Ministerio de Trabajo regulan la seguridad en obras; la IA puede monitorear EPP y condiciones de riesgo.' },
      { q: '¿Cuál es el beneficio de usar IA para gestión documental de un proyecto constructivo?', o: opts('Ninguno, los documentos son simples','Centralización automática, trazabilidad de versiones, búsqueda semántica y alertas de documentos vencidos','Solo reduce papel impreso','Solo útil en fase de diseño'), exp: 'Un proyecto tiene miles de documentos; la IA garantiza que todos usen la versión correcta y nada se pierda.' },
    ]
  },
  {
    match: ['normativa', 'regulación', 'arquitectura', 'ecuador'],
    title: 'Quiz: Normativa y Regulación en Arquitectura con IA',
    questions: [
      { q: '¿Cuál es la normativa principal que regula las construcciones en Quito?', o: opts('Solo el Código Civil','La NOREC (Normas de Arquitectura y Urbanismo del MDMQ) y el Código Ecuatoriano de la Construcción','Solo normas ACI de EE.UU.','Solo normativas privadas'), exp: 'El MDMQ aplica la NOREC para todo proyecto en Quito; el CEC regula aspectos técnicos de la construcción.' },
      { q: '¿Cómo puede la IA ayudar en la revisión de cumplimiento normativo de un proyecto?', o: opts('Aprobando planos automáticamente','Verificando que el diseño cumple COS, CUS, retiros, alturas máximas y normativa de accesibilidad automáticamente','Reemplazando a los municipios','Solo revisando la normativa de 1990'), exp: 'Herramientas de revisión de código (code checking) verifican el cumplimiento normativo desde el modelo BIM.' },
      { q: '¿Qué es la "accesibilidad universal" y cómo verifica la IA su cumplimiento?', o: opts('Solo rampas en la entrada','Diseño que garantiza acceso a personas con discapacidad; la IA verifica dimensiones, pendientes y equipamiento según NEC','Solo aplica a edificios del gobierno','Solo para hospitales'), exp: 'La NEC-HS (Norma Ecuatoriana de Construcción de Habitabilidad y Salud) establece requisitos de accesibilidad universal.' },
      { q: '¿Qué es el "informe de regulación metropolitana" (IRM) y qué datos contiene?', o: opts('Un reporte financiero del MDMQ','Documento del municipio que define COS, CUS, altura máxima, retiros y uso de suelo para un predio específico','Solo el número catastral','Un contrato de construcción'), exp: 'El IRM es el documento base del proyecto; define todos los parámetros normativos aplicables al predio en Quito.' },
      { q: '¿Cuál es el riesgo de confiar en IA para interpretación de normativa municipal?', o: opts('Ninguno, la IA conoce toda la normativa','La normativa cambia frecuentemente; la IA puede citar versiones desactualizadas del MDMQ o del CEC','Solo hay riesgo en proyectos grandes','Solo si el arquitecto no revisa'), exp: 'Siempre verificar en la fuente oficial (MDMQ, CEC actualizado) antes de diseñar; la IA tiene fecha de corte de conocimiento.' },
    ]
  },
  {
    match: ['presupuesto', 'costos', 'construcción', 'ia'],
    title: 'Quiz: Estimación de Costos de Construcción con IA',
    questions: [
      { q: '¿Qué es el "metrado" en construcción y cómo lo automatiza la IA?', o: opts('El material de la obra','Medición de cantidades de obra (m², m³, kg) por partida; la IA extrae los datos directamente del modelo BIM','El salario del maestro','El número de trabajadores'), exp: 'Extraer metrados del modelo BIM con IA elimina el tedioso proceso manual y reduce errores de medición.' },
      { q: '¿Qué factores debe considerar la IA para presupuestar una obra en Ecuador?', o: opts('Solo el costo de materiales','Costos de materiales locales, mano de obra por zona, transporte, impuestos, contingencia y escalación de precios','Solo el costo por m²','Solo el presupuesto del cliente'), exp: 'Un presupuesto ecuatoriano debe considerar variaciones regionales de costo, impuestos (IVA) y posibles alzas de materiales.' },
      { q: '¿Cuál herramienta ecuatoriana es referencia para precios de construcción?', o: opts('Solo las cotizaciones de ferreterías','Las cámaras de construcción y el sistema de precios del INEC, complementados con cotizaciones actualizadas','Solo estimados del arquitecto','Solo normas internacionales'), exp: 'Los precios de referencia del sector (cámaras, INEC) se deben actualizar con cotizaciones locales para mayor precisión.' },
      { q: '¿Qué es el "análisis de valor" (Value Engineering) asistido por IA?', o: opts('Solo reducir el presupuesto','Proceso de optimizar la relación función/costo identificando alternativas que mantienen calidad a menor costo','Solo eliminar partidas','Solo cambiar el diseño'), exp: 'El Value Engineering con IA analiza alternativas de materiales y sistemas para lograr el mismo resultado a mejor costo.' },
      { q: '¿Por qué los presupuestos basados en IA deben validarse con proveedores locales?', o: opts('No necesitan validación','Los precios de materiales varían por región, proveedor y coyuntura económica; la IA usa datos históricos que pueden estar desactualizados','Solo en obras rurales','Solo si el presupuesto supera $500,000'), exp: 'Los precios de materiales en Ecuador fluctúan; la IA provee estimados base pero las cotizaciones reales son indispensables.' },
    ]
  },
  {
    match: ['cliente', 'comunicación', 'arquitecto', 'presentación'],
    title: 'Quiz: Comunicación con Clientes y Presentaciones con IA',
    questions: [
      { q: '¿Cómo puede la IA mejorar la presentación de un anteproyecto al cliente?', o: opts('No ayuda en presentaciones','Generando renders emocionales, recorridos virtuales y materiales de presentación personalizados por tipo de cliente','Solo imprimiendo planos en color','Solo haciendo maquetas'), exp: 'La IA permite generar en horas materiales de presentación que comunican el valor del proyecto más efectivamente.' },
      { q: '¿Qué herramienta de IA genera recorridos virtuales desde un modelo 3D de forma sencilla?', o: opts('Solo renders estáticos','Enscape, Lumion con IA o plataformas de realidad virtual como IrisVR para recorridos inmersivos','Solo YouTube','Solo maquetas físicas'), exp: 'Herramientas como Enscape o Lumion generan recorridos virtuales en tiempo real desde Revit o SketchUp.' },
      { q: 'Al presentar un proyecto a un cliente no técnico, ¿cuál es la herramienta más efectiva?', o: opts('Planos técnicos detallados','Renders fotorrealistas + maqueta 3D interactiva + infografías de proceso generadas con IA','Solo el presupuesto','Solo el cronograma de obra'), exp: 'Los clientes no técnicos entienden mejor las imágenes y recorridos; los documentos técnicos son para especialistas.' },
      { q: '¿Cómo puede la IA ayudar a anticipar objeciones del cliente sobre el diseño?', o: opts('No puede anticipar objeciones','Analizando patrones de feedback de proyectos similares y preparando respuestas a objeciones comunes','Solo escuchando al cliente','Solo con más reuniones'), exp: 'La experiencia de proyectos previos, sistematizada con IA, permite preparar la presentación para las objeciones más frecuentes.' },
      { q: '¿Cuál es el beneficio más importante de los recorridos virtuales con IA para el cliente?', o: opts('Que son baratos','El cliente experimenta el espacio antes de construirlo, reduciendo cambios costosos durante la obra','Solo que impresionan visualmente','Solo para proyectos de lujo'), exp: 'Los clientes que experimentan el espacio virtualmente piden menos cambios durante la obra, reduciendo costos y plazos.' },
    ]
  },
];

// ─────────────────────────────────────────────────────────────────
// Match quiz data to session by title
// ─────────────────────────────────────────────────────────────────
function findQuizForSession(sessionTitle) {
  const titleLower = sessionTitle.toLowerCase();

  for (const quiz of QUIZ_DATA) {
    // Check if ALL keywords in match array appear in the title
    const matchCount = quiz.match.filter(kw => titleLower.includes(kw.toLowerCase())).length;
    if (matchCount >= 2) return quiz;
  }

  // Fallback: partial match with highest score
  let best = null;
  let bestScore = 0;
  for (const quiz of QUIZ_DATA) {
    const score = quiz.match.filter(kw => titleLower.includes(kw.toLowerCase())).length;
    if (score > bestScore) { bestScore = score; best = quiz; }
  }
  return bestScore >= 1 ? best : null;
}

// ─────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('='.repeat(60));
  console.log('ITSEIA Academy — Quizzes Estandar (ia-aplicada-estandar)');
  console.log('='.repeat(60));

  // Step 1: Get program
  const programs = await get('/programs?slug=eq.ia-aplicada-estandar&select=id,name,slug');
  if (!programs || programs.length === 0) {
    console.log('\nProgram not found. Listing all programs:');
    const all = await get('/programs?select=id,name,slug');
    console.log(JSON.stringify(all, null, 2));
    return;
  }
  const program = programs[0];
  console.log(`\nProgram: ${program.title} (${program.id})`);

  // Step 2: Get semesters
  const semesters = await get(`/semesters?program_id=eq.${program.id}&select=id,number,name&order=number.asc`);
  console.log(`Semesters: ${semesters.length}`);

  // Step 3: Get subjects
  const semIds = semesters.map(s => s.id).join(',');
  const subjects = await get(`/subjects?semester_id=in.(${semIds})&select=id,code,name,semester_id&order=order_index.asc`);
  console.log(`Subjects: ${subjects.length}`);

  // Step 4: Get sessions
  const subIds = subjects.map(s => s.id).join(',');
  const sessions = await get(`/sessions?subject_id=in.(${subIds})&select=id,number,title,subject_id&order=order_index.asc`);
  console.log(`Sessions: ${sessions.length}`);

  if (sessions.length === 0) {
    console.log('\nNo sessions found! Check program slug and data.');
    return;
  }

  // Step 5: Get existing quizzes
  const sessionIds = sessions.map(s => s.id).join(',');
  const existingQuizzes = await get(`/quizzes?session_id=in.(${sessionIds})&select=id,session_id,title`);
  const quizBySession = {};
  existingQuizzes.forEach(q => { quizBySession[q.session_id] = q; });
  console.log(`Existing quizzes: ${existingQuizzes.length}`);

  // Build lookup maps
  const subjectMap = {};
  subjects.forEach(s => { subjectMap[s.id] = s; });
  const semesterMap = {};
  semesters.forEach(s => { semesterMap[s.id] = s; });

  // Step 6: Process each session
  console.log('\n' + '='.repeat(60));
  let created = 0, skipped = 0, errors = 0;

  for (const session of sessions) {
    const subject = subjectMap[session.subject_id];
    const semester = semesterMap[subject?.semester_id];
    const semNum = semester?.number || '?';
    const subjCode = subject?.code || '?';

    if (quizBySession[session.id]) {
      console.log(`[S${semNum}][${subjCode}] SKIP (already has quiz): ${session.title}`);
      skipped++;
      continue;
    }

    // Find matching quiz data
    const quizData = findQuizForSession(session.title);
    if (!quizData) {
      console.log(`[S${semNum}][${subjCode}] ERROR (no quiz data matched): ${session.title}`);
      errors++;
      continue;
    }

    console.log(`[S${semNum}][${subjCode}] Creating quiz: ${session.title}`);

    try {
      // Insert quiz
      const quiz = await post('quizzes', {
        session_id: session.id,
        title: `Quiz - ${session.title}`,
        pass_percentage: 70,
        max_attempts: 3,
        is_active: true
      });

      // Insert 5 questions
      for (let i = 0; i < quizData.questions.length; i++) {
        const qd = quizData.questions[i];
        await postMin('quiz_questions', {
          quiz_id: quiz.id,
          question_text: qd.q,
          question_type: 'multiple_choice',
          options: qd.o,
          explanation: qd.exp,
          points: 1,
          order_index: i + 1
        });
      }

      console.log(`  -> Quiz created (${quizData.questions.length} questions): ${quiz.id}`);
      created++;
    } catch (err) {
      console.log(`  -> ERROR: ${err.message}`);
      errors++;
    }

    await new Promise(r => setTimeout(r, 150));
  }

  // Step 7: Verify
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total sessions:   ${sessions.length}`);
  console.log(`Quizzes created:  ${created}`);
  console.log(`Already existed:  ${skipped}`);
  console.log(`Errors:           ${errors}`);

  // Final verification
  const finalSessionIds = sessions.map(s => s.id).join(',');
  const finalQuizzes = await get(`/quizzes?session_id=in.(${finalSessionIds})&select=id,session_id,title`);
  console.log(`\nFinal quiz count: ${finalQuizzes.length} / ${sessions.length} sessions`);

  if (finalQuizzes.length === sessions.length) {
    console.log('\nALL 40 SESSIONS HAVE QUIZZES!');
  } else {
    const withQuiz = new Set(finalQuizzes.map(q => q.session_id));
    const missing = sessions.filter(s => !withQuiz.has(s.id));
    console.log(`\nMissing quizzes (${missing.length}):`);
    missing.forEach(s => console.log(`  - ${s.title}`));
  }
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
