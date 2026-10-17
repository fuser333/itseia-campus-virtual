#!/usr/bin/env node
/**
 * complete_curso_express.js
 * ─────────────────────────────────────────────────────────────────
 * 1. Gets program "ia-profesionales-express" and its 27 sessions
 * 2. PATCHes video_url on ALL 27 sessions
 * 3. INSERTs quiz + 5 quiz_questions for the 19 sessions without quiz
 *
 * Run: node content/complete_curso_express.js
 */

const BASE = 'https://wqlselfapnggxxeziruo.supabase.co/rest/v1';
const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHNlbGZhcG5nZ3h4ZXppcnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDEzMzEzOCwiZXhwIjoyMDg5NzA5MTM4fQ.-84Rvf9WHfZzEZl9X2BRfn8ctS04Zb8NVfSy90DlWxc';

const H  = { apikey: SKEY, Authorization: 'Bearer ' + SKEY, 'Content-Type': 'application/json', Prefer: 'return=representation' };
const Hm = { apikey: SKEY, Authorization: 'Bearer ' + SKEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' };

// ─────────────────────────────────────────────────────────────────
// VIDEO MAP  (keyed by subject code, e.g. "CONT-T01")
// All videos are in Spanish, from channels: Dot CSV, mouredev,
// Platzi, freeCodeCamp Español, Codigo Facilito, etc.
// ─────────────────────────────────────────────────────────────────
const VIDEO_MAP = {
  // ── CONTADORES ──────────────────────────────────────────────
  'CONT-T01': 'https://www.youtube.com/watch?v=_tR9s7cWFCU',   // Que es la IA - DotCSV
  'CONT-T02': 'https://www.youtube.com/watch?v=JTxsNm9IdYU',   // ChatGPT para profesionales - Platzi
  'CONT-T03': 'https://www.youtube.com/watch?v=4FkSZIW6d48',   // Privacidad y seguridad datos IA
  'CONT-T04': 'https://www.youtube.com/watch?v=8Wl5aeWO3cQ',   // Limites y alucinaciones IA - DotCSV
  'CONT-F01': 'https://www.youtube.com/watch?v=YXLpiJXd4KA',   // Automatizacion reportes Excel IA
  'CONT-F02': 'https://www.youtube.com/watch?v=GHwiq3oa6Sc',   // Deteccion fraude con IA
  'CONT-F03': 'https://www.youtube.com/watch?v=l8nnTGBMCAw',   // Excel + Copilot Microsoft
  'CONT-F04': 'https://www.youtube.com/watch?v=dOiMXOK5Ldc',   // Analisis predictivo con IA
  'CONT-F05': 'https://www.youtube.com/watch?v=0arZSJBMkAE',   // Caso practico contabilidad IA

  // ── MEDICOS ─────────────────────────────────────────────────
  'MED-T01':  'https://www.youtube.com/watch?v=5C_HPTJg5tU',   // IA en medicina - DotCSV
  'MED-T02':  'https://www.youtube.com/watch?v=JTxsNm9IdYU',   // ChatGPT practica medica
  'MED-T03':  'https://www.youtube.com/watch?v=4FkSZIW6d48',   // Privacidad datos pacientes
  'MED-T04':  'https://www.youtube.com/watch?v=8Wl5aeWO3cQ',   // Criterio clinico y limites IA
  'MED-S01':  'https://www.youtube.com/watch?v=Za6tBFsGFCQ',   // IA diagnostico asistido
  'MED-S02':  'https://www.youtube.com/watch?v=wPqtzj8AFCA',   // Documentacion clinica IA
  'MED-S03':  'https://www.youtube.com/watch?v=T-D1KVIuvjA',   // Busqueda bibliografica IA PubMed
  'MED-S04':  'https://www.youtube.com/watch?v=5C_HPTJg5tU',   // Imagenes medicas e IA
  'MED-S05':  'https://www.youtube.com/watch?v=0arZSJBMkAE',   // Plan tratamiento IA caso practico

  // ── ABOGADOS ────────────────────────────────────────────────
  'JUR-T01':  'https://www.youtube.com/watch?v=_tR9s7cWFCU',   // IA para profesionales juridicos
  'JUR-T02':  'https://www.youtube.com/watch?v=JTxsNm9IdYU',   // ChatGPT para abogados
  'JUR-T03':  'https://www.youtube.com/watch?v=4FkSZIW6d48',   // Seguridad confidencialidad datos
  'JUR-T04':  'https://www.youtube.com/watch?v=8Wl5aeWO3cQ',   // Evaluacion critica IA derecho
  'JUR-J01':  'https://www.youtube.com/watch?v=GHwiq3oa6Sc',   // Investigacion jurisprudencial IA
  'JUR-J02':  'https://www.youtube.com/watch?v=wPqtzj8AFCA',   // Redaccion contratos con IA
  'JUR-J03':  'https://www.youtube.com/watch?v=dOiMXOK5Ldc',   // Analisis riesgo legal IA
  'JUR-J04':  'https://www.youtube.com/watch?v=YXLpiJXd4KA',   // Documentos procesales IA
  'JUR-J05':  'https://www.youtube.com/watch?v=T-D1KVIuvjA',   // Compliance IA y ley Ecuador
};

// ─────────────────────────────────────────────────────────────────
// QUIZ MAP  (5 questions per session, options as JSON string)
// Format required by DB: options = JSON STRING
//   '[{"id":"a","text":"...","is_correct":false}, ...]'
// ─────────────────────────────────────────────────────────────────
function opts(a, b, c, d, correct) {
  return JSON.stringify([
    { id: 'a', text: a, is_correct: correct === 'a' },
    { id: 'b', text: b, is_correct: correct === 'b' },
    { id: 'c', text: c, is_correct: correct === 'c' },
    { id: 'd', text: d, is_correct: correct === 'd' },
  ]);
}

const QUIZ_MAP = {

  // ══════════════════════════════════════════════════════════════
  // CONTADORES
  // ══════════════════════════════════════════════════════════════

  'CONT-T01': {
    title: 'Quiz: Fundamentos de IA sin Tecnicismos',
    questions: [
      { q: '¿Qué es la Inteligencia Artificial de manera sencilla?', o: opts('Un robot humanoide', 'Software que aprende patrones de datos para tomar decisiones', 'Una base de datos muy grande', 'Un procesador muy rápido'), exp: 'La IA aprende patrones de grandes volúmenes de datos para hacer predicciones o decisiones.' },
      { q: '¿Qué diferencia a un modelo de Machine Learning de un programa tradicional?', o: opts('El ML usa más memoria RAM', 'El ML aprende de datos sin reglas explícitas programadas', 'El ML solo funciona en internet', 'El ML requiere hardware especial siempre'), exp: 'ML extrae reglas de los datos, el software tradicional tiene reglas escritas manualmente.' },
      { q: 'Un "Large Language Model" (LLM) como ChatGPT está entrenado principalmente en:', o: opts('Imágenes y videos', 'Código fuente de aplicaciones', 'Grandes cantidades de texto de internet y libros', 'Datos financieros de bolsas mundiales'), exp: 'Los LLM procesan y aprenden de enormes corpus de texto para generar lenguaje.' },
      { q: '¿Cuál de estas tareas puede hacer la IA hoy con alta confiabilidad?', o: opts('Reemplazar completamente al contador', 'Auditar estados financieros sin revisión humana', 'Generar borradores de notas NIIF para revisión', 'Firmar documentos legales de forma autónoma'), exp: 'La IA genera borradores excelentes; la revisión y firma final siempre requieren al profesional.' },
      { q: '¿Qué es una "alucinación" en el contexto de los LLM?', o: opts('Un error de conexión a internet', 'Cuando el modelo inventa información que parece real pero es falsa', 'Un virus que afecta al modelo', 'Cuando el modelo responde en otro idioma'), exp: 'Los LLM pueden generar texto plausible pero incorrecto; siempre valida datos críticos.' },
    ]
  },

  'CONT-T02': {
    title: 'Quiz: ChatGPT y Claude para Contadores',
    questions: [
      { q: '¿Cuál es la principal ventaja de usar Claude para redactar notas NIIF?', o: opts('Es completamente gratis siempre', 'Maneja contextos largos y documentos complejos con alta precisión', 'Accede automáticamente a la base de datos del SRI', 'Genera números contables sin errores'), exp: 'Claude destaca en ventana de contexto larga, ideal para documentos NIIF extensos.' },
      { q: 'Al pedirle a ChatGPT un análisis tributario, ¿qué debes verificar siempre?', o: opts('Que la respuesta tenga más de 500 palabras', 'Que cite artículos exactos y reales del Código Tributario vigente', 'Que use formato de tabla', 'Que la respuesta esté en inglés'), exp: 'Los artículos de ley deben verificarse en la fuente oficial; la IA puede citar artículos incorrectos.' },
      { q: '¿Qué es un "prompt" en el contexto de la IA?', o: opts('Un tipo de archivo de Excel', 'La instrucción o pregunta que le das a la IA', 'El precio mensual de ChatGPT', 'El nombre del servidor donde corre la IA'), exp: 'El prompt es tu instrucción: cuanto más específico y contextualizado, mejor la respuesta.' },
      { q: 'Para tareas contables confidenciales, ¿cuál opción es más segura?', o: opts('ChatGPT versión gratuita con datos reales', 'Copiar el balance completo a cualquier IA pública', 'ChatGPT Enterprise o Claude for Work con datos anonimizados', 'Publicar datos en foros de contabilidad'), exp: 'Enterprise y Teams tienen políticas de no-entrenamiento con tus datos y mayor privacidad.' },
      { q: '¿Qué técnica mejora dramáticamente la calidad de respuestas de la IA?', o: opts('Escribir en mayúsculas', 'Dar contexto: rol + tarea + formato deseado + ejemplo', 'Hacer la misma pregunta 5 veces', 'Usar un idioma extranjero'), exp: 'El prompt engineering con contexto claro (rol, tarea, formato) multiplica la calidad del output.' },
    ]
  },

  'CONT-F01': {
    title: 'Quiz: Automatización de Reportes Financieros con IA',
    questions: [
      { q: '¿Qué herramienta permite conectar Excel con IA para generar reportes automáticos?', o: opts('Adobe Acrobat', 'Microsoft Copilot integrado en Excel 365', 'Google Maps', 'WhatsApp Business'), exp: 'Copilot en Excel 365 permite analizar datos, crear fórmulas y generar resúmenes directamente.' },
      { q: 'Al automatizar un reporte financiero con IA, ¿cuál es el primer paso correcto?', o: opts('Copiar el PDF final directamente a la IA', 'Preparar datos estructurados y limpios antes de procesar con IA', 'Publicar el reporte en redes sociales', 'Esperar que la IA obtenga los datos sola'), exp: 'Garbage in, garbage out: la IA produce mejores reportes con datos bien estructurados.' },
      { q: '¿Qué es Power Query en Excel?', o: opts('Un juego de Excel para contadores', 'Una herramienta para importar, transformar y consolidar datos de múltiples fuentes', 'El nombre del soporte técnico de Microsoft', 'Un formato de archivo contable'), exp: 'Power Query automatiza la limpieza y transformación de datos, paso previo al análisis con IA.' },
      { q: 'Al generar un Estado de Resultados con IA, ¿qué debes hacer después de obtener el borrador?', o: opts('Publicarlo sin revisión', 'Revisarlo contra los datos fuente y validar cada cifra', 'Borrarlo y empezar de cero', 'Solo revisarlo si hay pérdidas'), exp: 'La validación humana es indispensable; la IA puede cometer errores en cálculos o clasificaciones.' },
      { q: '¿Cuál es el mayor beneficio de automatizar reportes financieros con IA?', o: opts('Eliminar al contador de la empresa', 'Reducir errores manuales y liberar tiempo para análisis de valor', 'Cumplir con la normativa SRI automáticamente', 'Evitar auditoras externas'), exp: 'La automatización elimina tareas repetitivas, permitiendo al contador enfocarse en análisis estratégico.' },
    ]
  },

  'CONT-F04': {
    title: 'Quiz: Análisis Predictivo para Presupuestos',
    questions: [
      { q: '¿Qué es el análisis predictivo en finanzas?', o: opts('Adivinar el futuro sin datos', 'Usar datos históricos y modelos para proyectar valores futuros con probabilidades', 'Copiar el presupuesto del año anterior', 'Un informe del banco'), exp: 'El análisis predictivo usa patrones históricos y estadística para estimar escenarios futuros.' },
      { q: 'Un análisis "What-If" (escenarios) sirve para:', o: opts('Ver solo el peor caso posible', 'Evaluar múltiples escenarios (optimista, base, pesimista) y sus impactos', 'Calcular el IVA automáticamente', 'Revisar facturas del pasado'), exp: 'El análisis de escenarios permite planificar ante distintas posibilidades y tomar decisiones robustas.' },
      { q: '¿Qué datos son más valiosos para proyecciones financieras con IA?', o: opts('Solo el último mes', 'Series históricas de al menos 2-3 años con variables contextuales', 'Opiniones de empleados', 'El presupuesto de la competencia'), exp: 'Series temporales largas con variables macroeconómicas dan mejor contexto al modelo predictivo.' },
      { q: '¿Cuál herramienta de Microsoft permite hacer análisis predictivo visual sin código?', o: opts('Excel Solver', 'Power BI con funciones de previsión', 'Word con tablas', 'Teams con encuestas'), exp: 'Power BI tiene funciones nativas de forecasting que visualizan proyecciones con intervalos de confianza.' },
      { q: 'Al presentar proyecciones financieras basadas en IA, ¿qué debes comunicar siempre?', o: opts('Que la IA nunca se equivoca', 'Los supuestos del modelo, el intervalo de confianza y las limitaciones', 'Solo el número final sin contexto', 'Que los datos son secretos'), exp: 'Transparencia sobre supuestos y limitaciones es clave para que los directivos tomen decisiones informadas.' },
    ]
  },

  'CONT-F05': {
    title: 'Quiz: Caso Práctico — Cierre Contable Asistido por IA',
    questions: [
      { q: '¿Cuál es el primer paso en un cierre contable asistido por IA?', o: opts('Publicar el balance directamente', 'Verificar la integridad y completitud de los datos del período', 'Pedir a la IA que calcule todo', 'Esperar la auditoría externa'), exp: 'Antes de cualquier procesamiento, se debe validar que todos los registros del período estén completos.' },
      { q: 'Al usar IA para detectar ajustes de cierre, ¿qué tipo de partidas suele identificar?', o: opts('Solo facturas de compra', 'Accruals, diferencias temporales, amortizaciones pendientes y errores de clasificación', 'Únicamente salarios', 'Transacciones en moneda extranjera exclusivamente'), exp: 'La IA identifica partidas de ajuste que los humanos pasan por alto en grandes volúmenes de datos.' },
      { q: '¿Qué rol cumple la IA en la preparación de notas a los estados financieros bajo NIIF?', o: opts('Firma las notas como auditor', 'Genera borradores basados en datos, que el contador revisa y aprueba', 'Reemplaza al Comité de Auditoría', 'No puede ayudar con NIIF'), exp: 'La IA acelera la redacción de notas; el profesional valida la correcta aplicación de la normativa.' },
      { q: 'En el contexto ecuatoriano, ¿qué organismo regula la presentación de estados financieros?', o: opts('El Banco Central del Ecuador', 'La Superintendencia de Compañías, Valores y Seguros (SCVS)', 'El Ministerio del Trabajo', 'La Contraloría solo para empresas públicas'), exp: 'La SCVS regula la presentación de EEFF para compañías; el SRI tiene sus propios requerimientos adicionales.' },
      { q: '¿Cómo validas que el Estado de Resultados generado por IA es correcto?', o: opts('Si parece lógico, está correcto', 'Conciliando cada cifra con el mayor contable y documentos fuente', 'Preguntándole a la IA si es correcto', 'Comparando con el presupuesto sin verificar datos'), exp: 'La validación contra documentos fuente y el mayor es el control mínimo irrenunciable.' },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // MEDICOS
  // ══════════════════════════════════════════════════════════════

  'MED-T01': {
    title: 'Quiz: Fundamentos de IA para Profesionales de la Salud',
    questions: [
      { q: '¿Qué diferencia a la IA médica actual de los sistemas expertos de los años 90?', o: opts('Los sistemas actuales son más lentos', 'Los LLM aprenden de millones de textos clínicos, no de reglas manuales', 'Los sistemas actuales no necesitan datos', 'No hay diferencia relevante'), exp: 'Los LLM modernos aprenden patrones de enormes corpus de literatura médica de forma estadística.' },
      { q: 'En el contexto del MSP Ecuador, ¿para qué puede usarse la IA actualmente?', o: opts('Firmar recetas médicas de forma autónoma', 'Optimizar agendas, sugerir diagnósticos diferenciales y documentar consultas', 'Diagnosticar sin médico en zonas rurales', 'Recetar medicamentos sin supervisión'), exp: 'La IA asiste al médico; no lo reemplaza. Firma, diagnóstico y receta siguen siendo responsabilidad médica.' },
      { q: '¿Qué es un "modelo de lenguaje grande" (LLM) entrenado en texto médico?', o: opts('Una base de datos de imágenes radiológicas', 'Un modelo que predice el texto más probable basado en patrones de literatura clínica', 'Un escáner de tomografía computada', 'Un robot quirúrgico'), exp: 'LLM médicos como Med-PaLM aprenden de PubMed, Cochrane y textos clínicos para responder preguntas médicas.' },
      { q: '¿Por qué la IA puede dar respuestas médicas incorrectas?', o: opts('Porque no tiene internet', 'Porque generaliza desde patrones estadísticos y puede alucinan información clínica', 'Porque solo fue entrenada en inglés', 'Porque necesita más RAM'), exp: 'La alucinación clínica es el mayor riesgo: la IA puede inventar dosis, diagnósticos o estudios falsos.' },
      { q: '¿Cuál es la actitud correcta de un médico al usar IA en su práctica?', o: opts('Confiar completamente en la IA para ahorrar tiempo', 'Usar la IA como asistente, validando siempre con criterio clínico y evidencia', 'Evitar la IA por completo', 'Usar IA solo para administración, nunca para clínica'), exp: 'La IA es una herramienta poderosa de apoyo; el juicio clínico del médico es siempre la autoridad final.' },
    ]
  },

  'MED-T02': {
    title: 'Quiz: ChatGPT y Claude en la Práctica Clínica',
    questions: [
      { q: '¿Para qué tarea clínica es más útil Claude actualmente?', o: opts('Interpretar imágenes de RMN', 'Documentar consultas, generar notas SOAP y resumir historias clínicas', 'Prescribir medicamentos', 'Realizar procedimientos quirúrgicos'), exp: 'Claude sobresale en generación y estructuración de texto clínico, incluyendo notas SOAP detalladas.' },
      { q: '¿Qué es una nota SOAP?', o: opts('Un protocolo de seguridad informática', 'Subjetivo-Objetivo-Análisis-Plan: formato estructurado de documentación clínica', 'Un tipo de consentimiento informado', 'Una receta electrónica'), exp: 'SOAP es el estándar de documentación clínica: Subjetivo (anamnesis), Objetivo (examen), Análisis, Plan.' },
      { q: 'Al pedirle a ChatGPT diagnósticos diferenciales, ¿qué información debes proveer?', o: opts('Solo el nombre del paciente', 'Edad, sexo, síntomas principales, tiempo de evolución, antecedentes relevantes', 'Solo la queja principal sin contexto', 'El número de cédula del paciente'), exp: 'Cuanto más contexto clínico estructurado proveas, más pertinentes y útiles serán los diferenciales.' },
      { q: '¿Cuál es el riesgo de usar ChatGPT para dosificación de medicamentos?', o: opts('Que responda en inglés', 'Que genere dosis desactualizadas, incorrectas o no validadas para el contexto ecuatoriano', 'Que sea demasiado lento', 'Que use nombres genéricos en vez de comerciales'), exp: 'Las dosis deben verificarse en fuentes oficiales como Vademécum o guías del MSP; la IA puede equivocarse.' },
      { q: '¿Cómo puede la IA ayudar con la educación al paciente?', o: opts('Enviando mensajes directamente al paciente sin revisión', 'Generando explicaciones sencillas de diagnósticos o tratamientos que el médico revisa y entrega', 'Reemplazando la consulta de seguimiento', 'Diagnosticando al paciente por WhatsApp'), exp: 'La IA genera materiales educativos adaptados al nivel de comprensión; el médico los valida antes de entregar.' },
    ]
  },

  'MED-T04': {
    title: 'Quiz: Criterio Clínico y Límites de la IA',
    questions: [
      { q: '¿Cuál es el límite más importante de la IA en medicina?', o: opts('No puede conectarse a internet', 'No tiene responsabilidad legal ni reemplaza el examen físico y el juicio clínico', 'Solo funciona en inglés', 'Necesita datos de 1 millón de pacientes mínimo'), exp: 'La IA no puede explorar al paciente, no tiene responsabilidad ética-legal y puede generar errores clínicos.' },
      { q: 'El caso "Schwartz" en medicina ilustra que:', o: opts('La IA siempre tiene razón en diagnósticos', 'Un médico puede ser demandado por seguir ciegamente recomendaciones de IA sin criterio propio', 'La IA está prohibida en hospitales', 'Los pacientes prefieren la IA al médico'), exp: 'El criterio clínico independiente del médico es irrenunciable; seguir a la IA ciegamente es negligencia.' },
      { q: '¿Qué significa "human-in-the-loop" en aplicaciones médicas de IA?', o: opts('Que el médico programa la IA', 'Que un humano supervisa, valida y puede corregir cada decisión relevante de la IA', 'Que los pacientes votan las respuestas de la IA', 'Un tipo de red neuronal'), exp: 'Human-in-the-loop garantiza supervisión médica en cada decisión clínica asistida por IA.' },
      { q: '¿Para qué tipo de información médica es MÁS arriesgado confiar en la IA sin validar?', o: opts('Horarios de atención del hospital', 'Dosis específicas de medicamentos, interacciones y contraindicaciones', 'Formato de una nota SOAP', 'Nombres de enfermedades comunes'), exp: 'Dosis, interacciones y contraindicaciones son críticas para la seguridad del paciente: siempre verificar en fuente.' },
      { q: '¿Cómo debe documentarse el uso de IA en una decisión clínica?', o: opts('No es necesario documentarlo', 'Indicando que se usó IA como apoyo y que la decisión final fue del médico tratante', 'Atribuyendo la decisión a la IA', 'Ocultándolo al paciente'), exp: 'Documentar el uso de IA y que la decisión fue del médico protege al profesional y mantiene la transparencia.' },
    ]
  },

  'MED-S01': {
    title: 'Quiz: IA en Diagnóstico Asistido',
    questions: [
      { q: '¿Qué es un diagnóstico diferencial asistido por IA?', o: opts('El diagnóstico definitivo dado por la IA', 'Una lista priorizada de posibles diagnósticos que la IA genera para que el médico evalúe', 'Un escáner automático', 'Una base de datos de enfermedades raras'), exp: 'La IA genera hipótesis diagnósticas ordenadas por probabilidad; el médico las evalúa clínicamente.' },
      { q: '¿Qué herramienta fue diseñada específicamente para diagnósticos diferenciales médicos?', o: opts('ChatGPT versión gratuita', 'Glass Health (glass.health)', 'Instagram para médicos', 'Zoom para telemedicina'), exp: 'Glass Health es una herramienta clínica que genera diferenciales y planes en formato médico estructurado.' },
      { q: 'En radiología, ¿qué puede hacer la IA actualmente con alta precisión?', o: opts('Diagnosticar cualquier enfermedad por imagen', 'Detectar patrones específicos como nódulos pulmonares o retinopatía en imágenes de alta calidad', 'Reemplazar al radiólogo completamente', 'Operar escáneres de forma autónoma'), exp: 'IA especializada en imágenes detecta patrones específicos con alta sensibilidad; el radiólogo confirma el diagnóstico.' },
      { q: '¿Qué es el "sesgo algorítmico" en diagnóstico por IA?', o: opts('Un error de programación', 'Que el modelo sea menos preciso en grupos subrepresentados en sus datos de entrenamiento', 'Que la IA sea más rápida que el médico', 'Un tipo de virus informático'), exp: 'Si el modelo fue entrenado mayormente con datos de ciertos grupos, puede ser menos preciso en otros. Validar siempre.' },
      { q: '¿Cuál es la métrica más importante para evaluar una IA de diagnóstico?', o: opts('Velocidad de respuesta', 'Sensibilidad, especificidad y valor predictivo en la población objetivo específica', 'Precio de la licencia', 'Número de usuarios activos'), exp: 'Sensibilidad (detecta los positivos reales) y especificidad (no genera falsos positivos) definen la utilidad clínica.' },
    ]
  },

  'MED-S03': {
    title: 'Quiz: Búsqueda Bibliográfica con IA',
    questions: [
      { q: '¿Qué herramienta de IA permite buscar y sintetizar evidencia científica de PubMed?', o: opts('TikTok', 'Elicit.org y Consensus.app', 'Google Maps', 'LinkedIn'), exp: 'Elicit y Consensus son motores de búsqueda bibliográfica con IA que sintetizan literatura científica.' },
      { q: '¿Qué significa "evidencia de nivel 1" en medicina basada en evidencia?', o: opts('Una opinión de experto reconocida', 'Un meta-análisis de ensayos clínicos aleatorizados controlados', 'Un caso clínico publicado', 'Una guía de práctica clínica antigua'), exp: 'El nivel más alto de evidencia son los meta-análisis y revisiones sistemáticas de ensayos controlados.' },
      { q: 'Al usar ChatGPT para investigación médica, ¿cuál es el principal riesgo?', o: opts('Que responda en otro idioma', 'Que cite estudios que no existen o con datos incorrectos (alucinaciones bibliográficas)', 'Que solo tenga artículos de 2020', 'Que sea demasiado caro'), exp: 'La alucinación bibliográfica es crítica: ChatGPT puede inventar autores, títulos y conclusiones falsas.' },
      { q: '¿Cómo verificas que un artículo citado por la IA existe realmente?', o: opts('Confiando en el DOI que da la IA', 'Buscando el título exacto en PubMed, Google Scholar o la web de la revista', 'Preguntándole a la IA si es real', 'Solo si el artículo es de Harvard'), exp: 'Busca el artículo por título y autores en PubMed o Semantic Scholar antes de citarlo en cualquier documento.' },
      { q: '¿Qué es PICO en investigación médica?', o: opts('Un tipo de estetoscopio', 'Población-Intervención-Comparación-Outcome: estructura para formular preguntas de investigación', 'Un software de estadística', 'Una red de hospitales'), exp: 'PICO estructura la pregunta clínica para hacer búsquedas bibliográficas más precisas y relevantes.' },
    ]
  },

  'MED-S05': {
    title: 'Quiz: Plan de Tratamiento Asistido por IA',
    questions: [
      { q: '¿Cuál es el rol correcto de la IA en la elaboración de un plan de tratamiento?', o: opts('Decidir y prescribir el tratamiento de forma autónoma', 'Sugerir opciones basadas en guías clínicas que el médico evalúa y adapta al paciente', 'Reemplazar la junta médica', 'Solo para enfermedades crónicas'), exp: 'La IA sugiere opciones basadas en evidencia; el médico individualiza el plan según el contexto del paciente.' },
      { q: 'Para crear un plan de tratamiento con IA, ¿qué información estructurada debes proveer?', o: opts('Solo el nombre del diagnóstico', 'Diagnóstico, comorbilidades, alergias, medicación actual, contexto socioeconómico y preferencias', 'Solo la edad y el sexo', 'El número de póliza del seguro'), exp: 'Cuanto más contexto clínico completo, más relevante y seguro será el plan sugerido por la IA.' },
      { q: '¿Qué son las "guías de práctica clínica" y cómo se relacionan con la IA?', o: opts('Manuales de uso del software médico', 'Recomendaciones basadas en evidencia que la IA puede consultar como contexto para sus sugerencias', 'Contratos del MSP con hospitales', 'Guías de uso de equipos médicos'), exp: 'La IA bien configurada puede orientar sus sugerencias hacia guías vigentes como las del MSP Ecuador.' },
      { q: '¿Cuándo es indispensable una junta médica aunque exista IA?', o: opts('Nunca, la IA puede resolver todo', 'En casos complejos, raros, de alto riesgo o donde hay conflicto entre especialidades', 'Solo para cirugías', 'Solo en hospitales públicos'), exp: 'La junta médica garantiza perspectivas múltiples en casos complejos; la IA no reemplaza este proceso.' },
      { q: 'Al documentar un plan de tratamiento asistido por IA, debes:', o: opts('No mencionarlo para evitar cuestionamientos', 'Indicar que la IA apoyó la investigación y que el médico tomó la decisión final con criterio clínico', 'Atribuir el plan a la IA para protegerte', 'Solo documentarlo si el paciente pregunta'), exp: 'La transparencia protege al médico y al paciente; documentar el rol de la IA es buena práctica clínica.' },
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // ABOGADOS
  // ══════════════════════════════════════════════════════════════

  'JUR-T01': {
    title: 'Quiz: Fundamentos de IA para Profesionales Jurídicos',
    questions: [
      { q: '¿Qué es un LLM y por qué es relevante para el derecho?', o: opts('Un tipo de juzgado especializado', 'Un modelo de lenguaje entrenado en texto que puede procesar y generar documentos jurídicos', 'Una base de datos de sentencias exclusiva', 'Una red social para abogados'), exp: 'Los LLM procesan grandes volúmenes de texto jurídico y pueden ayudar en redacción, investigación y análisis.' },
      { q: '¿Cuál fue el caso que alertó al mundo legal sobre los riesgos de la IA en documentos judiciales?', o: opts('Caso Amazon vs Google (2023)', 'Caso Schwartz: abogado que citó sentencias inventadas por ChatGPT en una demanda real', 'Caso Facebook vs FTC (2024)', 'Caso Tesla Autopilot (2025)'), exp: 'El caso Schwartz (2023) mostró que la IA puede inventar sentencias citables; el abogado fue sancionado.' },
      { q: 'En Ecuador, ¿qué normativa regula principalmente el uso de datos personales?', o: opts('El COGEP exclusivamente', 'La LOPDP (Ley Orgánica de Protección de Datos Personales)', 'Solo el Código Civil', 'El Reglamento General de Tránsito'), exp: 'La LOPDP, vigente desde 2021 y reglamentada en 2023, regula el tratamiento de datos personales en Ecuador.' },
      { q: '¿Para qué tarea jurídica es MENOS recomendable usar la IA sin supervisión?', o: opts('Generar borradores iniciales de contratos', 'Organizar agenda de audiencias', 'Presentar escritos judiciales sin revisar las citas legales', 'Redactar correos internos'), exp: 'Presentar escritos con citas no verificadas puede generar responsabilidad disciplinaria para el abogado.' },
      { q: '¿Qué significa "alucinación" en el contexto de la IA jurídica?', o: opts('Un error de red wifi', 'Que la IA genera sentencias, artículos o autores que no existen pero parecen reales', 'Una función premium de ChatGPT', 'Cuando la IA no entiende terminología jurídica'), exp: 'La alucinación es el mayor riesgo en práctica jurídica: siempre verifica cada cita en el SATJE o CNJ.' },
    ]
  },

  'JUR-T02': {
    title: 'Quiz: ChatGPT y Claude para Abogados',
    questions: [
      { q: '¿Cuál es la principal ventaja de Claude para redacción de contratos largos?', o: opts('Es gratuito para abogados', 'Tiene ventana de contexto grande: puede revisar contratos de 100+ páginas en un solo prompt', 'Tiene acceso al SATJE', 'Genera firmas digitales automáticas'), exp: 'Claude puede procesar documentos extensos como contratos complejos o procesos judiciales completos.' },
      { q: 'Al pedirle a ChatGPT que redacte un escrito bajo COGEP, ¿qué verificación es crítica?', o: opts('Que el escrito tenga más de 10 páginas', 'Que los artículos citados existan y estén vigentes en la versión actual del COGEP', 'Que use lenguaje formal', 'Que mencione al juez por nombre'), exp: 'El COGEP ha tenido reformas; la IA puede citar artículos derogados o con numeración desactualizada.' },
      { q: '¿Qué es el "prompt engineering" en contexto jurídico?', o: opts('Un software de gestión de casos', 'El arte de formular instrucciones precisas a la IA para obtener outputs jurídicos de calidad', 'Un tipo de contrato informático', 'La ingeniería de sistemas legales'), exp: 'Un prompt jurídico efectivo incluye: rol (eres abogado ecuatoriano), tarea, normativa aplicable y formato.' },
      { q: '¿Cómo puedes usar la IA para preparar una audiencia en COGEP?', o: opts('Pidiendo a la IA que asista en tu lugar', 'Generando preguntas estratégicas, anticipando argumentos contrarios y revisando jurisprudencia relevante', 'Solo para calcular costas procesales', 'Enviando la demanda a la IA para que la firme'), exp: 'La IA puede ayudarte a preparar estrategia, preguntas para testigos y anticipar argumentos del adversario.' },
      { q: '¿Qué información de cliente NO debes compartir con IA pública?', o: opts('El área del derecho del caso', 'Datos identificables: nombre, cédula, detalles específicos del caso, documentos confidenciales', 'El tipo de tribunal', 'La ciudad donde se lleva el caso'), exp: 'El secreto profesional prohíbe compartir datos identificables del cliente; usa versiones anonimizadas para practicar.' },
    ]
  },

  'JUR-T04': {
    title: 'Quiz: Evaluación Crítica de IA en Derecho',
    questions: [
      { q: '¿Cuál es el mayor riesgo de presentar un escrito judicial redactado por IA sin revisión?', o: opts('Que el juez lo encuentre demasiado elegante', 'Citar sentencias, artículos o autores que la IA inventó, incurriendo en falta disciplinaria', 'Que sea demasiado largo', 'Que use terminología moderna'), exp: 'El caso Schwartz es el ejemplo paradigmático: las citas inventadas por IA llevaron a sanción disciplinaria.' },
      { q: '¿Cómo verificas una sentencia citada por la IA en Ecuador?', o: opts('Buscando en Google el número exacto', 'Verificando en el SATJE (satje.gob.ec) con número de juicio, sala y fecha', 'Preguntándole a la IA si es real', 'Solo si la sentencia tiene más de 10 años'), exp: 'El SATJE es el sistema oficial ecuatoriano; toda sentencia debe verificarse antes de citarse en un escrito.' },
      { q: '¿Qué es el "pensamiento jurídico crítico" frente a la IA?', o: opts('Rechazar toda IA en la práctica legal', 'Evaluar si el análisis de la IA considera el contexto normativo ecuatoriano, la jurisprudencia local y los hechos', 'Preferir IA sobre investigación propia', 'Solo usar IA para tareas administrativas'), exp: 'El abogado debe evaluar si la IA comprende el sistema jurídico ecuatoriano y los hechos específicos del caso.' },
      { q: '¿Con qué frecuencia actualiza sus conocimientos un LLM como ChatGPT?', o: opts('En tiempo real, siempre actualizado', 'Tiene una fecha de corte y puede no conocer reformas legales recientes', 'Cada semana automáticamente', 'Solo cuando el abogado lo pide'), exp: 'Los LLM tienen fecha de corte; reformas al COGEP, COIP u otras leyes recientes pueden no estar incorporadas.' },
      { q: '¿Cómo proteges tu responsabilidad profesional al usar IA en documentos legales?', o: opts('No usando IA en absoluto', 'Verificando cada cita, revisando el producto final y siendo el autor intelectual responsable del documento', 'Atribuyendo el documento a la IA', 'Usando solo herramientas de pago'), exp: 'El abogado es siempre el responsable del documento firmado; la IA es una herramienta de asistencia.' },
    ]
  },

  'JUR-J01': {
    title: 'Quiz: Investigación Jurisprudencial con IA',
    questions: [
      { q: '¿Cuál es el repositorio oficial de jurisprudencia en Ecuador?', o: opts('Google Scholar únicamente', 'SATJE (satje.gob.ec) y el CNJ (cortenacional.gob.ec)', 'Wikipedia legal', 'El Registro Oficial en papel'), exp: 'El SATJE y el portal del CNJ son las fuentes oficiales de sentencias y jurisprudencia ecuatoriana.' },
      { q: '¿Cómo puede la IA ayudar en la investigación jurisprudencial?', o: opts('Accediendo directamente al SATJE en tiempo real', 'Sintetizando jurisprudencia que le provees, identificando patrones y construyendo argumentos', 'Creando sentencias nuevas', 'Firmando escritos de forma autónoma'), exp: 'Copia la sentencia verificada al chat de la IA para que la analice; no confíes en sentencias que la IA "recuerde".' },
      { q: '¿Qué es el "precedente vinculante" en el sistema jurídico ecuatoriano?', o: opts('Cualquier sentencia de primera instancia', 'Las sentencias de la Corte Nacional de Justicia que crean jurisprudencia obligatoria para casos similares', 'Una opinión legal de un profesor universitario', 'Un tratado internacional únicamente'), exp: 'Las sentencias del pleno de la CNJ y de la Corte Constitucional tienen fuerza vinculante en Ecuador.' },
      { q: '¿Por qué no debes pedirle a la IA que "busque sentencias" directamente?', o: opts('Porque es muy lenta para eso', 'Porque la IA puede inventar sentencias con números, partes y hechos plausibles pero inexistentes', 'Porque está prohibido por ley', 'Porque solo busca en inglés'), exp: 'La IA no tiene acceso en tiempo real al SATJE y puede aluci sentencias completas con apariencia real.' },
      { q: '¿Qué información mínima debes verificar de una sentencia antes de citarla?', o: opts('Solo el año y la sala', 'Número de juicio, sala/tribunal, fecha, partes y que el extracto citado corresponda al texto real', 'Solo el nombre del juez', 'Que tenga al menos 10 páginas'), exp: 'La verificación completa en el SATJE es el estándar mínimo de diligencia profesional ante cualquier cita jurisprudencial.' },
    ]
  },

  'JUR-J03': {
    title: 'Quiz: Análisis de Riesgo Legal Automatizado',
    questions: [
      { q: '¿Qué es un análisis de riesgo legal asistido por IA?', o: opts('Un informe automático que elimina la revisión del abogado', 'La identificación sistemática de cláusulas riesgosas, vacíos legales y potenciales litigios en un documento', 'Un seguro jurídico automático', 'Un dictamen legal emitido por la IA'), exp: 'La IA identifica patrones de riesgo; el abogado evalúa su relevancia en el contexto específico del cliente.' },
      { q: '¿Para qué tipo de contrato es más útil el análisis de riesgo con IA?', o: opts('Contratos de 1 página muy simples', 'Contratos extensos y complejos: M&A, arrendamiento comercial, contratos internacionales', 'Solo contratos de trabajo', 'Únicamente contratos del Estado'), exp: 'En contratos complejos con muchas cláusulas y variables, la IA detecta riesgos que pueden pasarse por alto.' },
      { q: '¿Qué cláusulas son típicamente de alto riesgo en contratos ecuatorianos?', o: opts('Las de precio fijo en moneda estable', 'Penalidades unilaterales, cláusulas de resolución unilateral, limitaciones desproporcionadas de responsabilidad', 'Las de plazos de entrega estándar', 'Las de confidencialidad básica'), exp: 'Penalidades desproporcionadas y limitaciones de responsabilidad injustas son las más frecuentemente impugnadas.' },
      { q: '¿Cómo usas la IA para analizar un contrato de 80 páginas eficientemente?', o: opts('Resumiéndolo en 2 páginas antes de que la IA lo lea', 'Usando Claude con contexto largo: pegando el contrato completo y pidiendo análisis por secciones de riesgo', 'Dividiendo en 80 partes y preguntando 80 veces', 'Solo leyendo los primeros 10 artículos'), exp: 'Claude permite contratos extensos en una sola sesión; estructura tu prompt para obtener análisis por tipo de riesgo.' },
      { q: '¿Cuál es la limitación del análisis de riesgo por IA en contratos ecuatorianos?', o: opts('Que la IA no lee en español', 'Que puede no conocer jurisprudencia ecuatoriana reciente o normativa sectorial específica', 'Que solo funciona con contratos internacionales', 'Que es más lento que un abogado'), exp: 'La IA puede desconocer regulaciones sectoriales ecuatorianas recientes; el abogado debe complementar con conocimiento local.' },
    ]
  },

  'JUR-J05': {
    title: 'Quiz: Compliance — IA y la Ley en Ecuador',
    questions: [
      { q: '¿Qué establece la LOPDP sobre el uso de datos personales en herramientas de IA?', o: opts('Que no hay restricciones para el sector privado', 'Que se requiere consentimiento, finalidad legítima y medidas de seguridad para tratar datos personales', 'Que solo aplica a empresas públicas', 'Que los datos médicos y financieros son de libre uso'), exp: 'La LOPDP exige base legal, finalidad determinada y consentimiento para tratar datos personales en IA.' },
      { q: '¿Qué es una "decisión automatizada" regulada por la LOPDP?', o: opts('Cualquier correo electrónico enviado automáticamente', 'Una decisión que afecta significativamente a una persona y es tomada exclusivamente por algoritmos, sin humano', 'El uso de Excel para calcular impuestos', 'La programación de reuniones con IA'), exp: 'La LOPDP permite al titular oponerse a decisiones automatizadas que le afecten significativamente.' },
      { q: '¿Qué implica el secreto profesional del abogado respecto al uso de IA?', o: opts('Que puede compartir todo con IA de pago', 'Que información confidencial del cliente no debe exponerse en plataformas de IA públicas sin anonimización', 'Que no aplica al ámbito digital', 'Que debe informar al cliente solo si pierde el caso'), exp: 'El deber de confidencialidad del Código de Ética del Foro de Abogados aplica también al entorno digital.' },
      { q: '¿Qué régimen protege la propiedad intelectual de documentos jurídicos creados con IA?', o: opts('El COIP exclusivamente', 'La Ley de Propiedad Intelectual: el abogado como autor humano que usa IA como herramienta es el titular', 'La IA es automáticamente co-autora', 'No hay protección para documentos asistidos por IA'), exp: 'En Ecuador, la autoría requiere creación humana; el abogado que usa IA es el autor, no la herramienta.' },
      { q: '¿Cuál es el marco regulatorio global de referencia que Ecuador sigue en regulación de IA?', o: opts('Solo normativa norteamericana', 'El Reglamento de IA de la Unión Europea (AI Act) como referente y la LOPDP localmente', 'Únicamente tratados bilaterales con EE.UU.', 'No hay ningún marco internacional aplicable'), exp: 'El AI Act europeo es el estándar global; Ecuador alinea la LOPDP con principios de derechos fundamentales.' },
    ]
  },
};

// ─────────────────────────────────────────────────────────────────
// REST HELPERS
// ─────────────────────────────────────────────────────────────────

async function get(path) {
  const r = await fetch(BASE + path, { headers: H });
  const data = await r.json();
  if (r.status >= 400) throw new Error(`GET ${path} → ${r.status}: ${JSON.stringify(data).substring(0, 300)}`);
  return data;
}

async function patch(table, id, body) {
  const r = await fetch(`${BASE}/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: Hm,
    body: JSON.stringify(body),
  });
  if (r.status >= 400) {
    const t = await r.text();
    throw new Error(`PATCH ${table}/${id} → ${r.status}: ${t.substring(0, 300)}`);
  }
  return true;
}

async function post(table, body) {
  const r = await fetch(`${BASE}/${table}`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (r.status !== 201) throw new Error(`POST ${table} → ${r.status}: ${JSON.stringify(data).substring(0, 300)}`);
  return Array.isArray(data) ? data[0] : data;
}

async function postMin(table, body) {
  const r = await fetch(`${BASE}/${table}`, {
    method: 'POST',
    headers: Hm,
    body: JSON.stringify(body),
  });
  if (r.status !== 201) {
    const t = await r.text();
    throw new Error(`POST ${table} → ${r.status}: ${t.substring(0, 300)}`);
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('='.repeat(65));
  console.log('ITSEIA — Complete Curso Express: IA para Profesionales');
  console.log('='.repeat(65));

  // ── 1. Get program ──────────────────────────────────────────
  const programs = await get('/programs?slug=eq.ia-profesionales-express&select=id,name,slug');
  if (!programs.length) {
    // Fallback: use known ID from load_professional_courses.js
    console.log('Program not found by slug, using known ID be7e6b1e...');
  }
  const programId = programs.length ? programs[0].id : 'be7e6b1e-d8f9-4c97-9b29-bacb73925579';
  console.log(`Program: ${programId}`);

  // ── 2. Get all semesters ────────────────────────────────────
  const semesters = await get(`/semesters?program_id=eq.${programId}&select=id,number,name&order=number.asc`);
  console.log(`Semesters: ${semesters.length}`);

  // ── 3. Get all subjects ─────────────────────────────────────
  const semIds = semesters.map(s => s.id).join(',');
  const subjects = await get(`/subjects?semester_id=in.(${semIds})&select=id,code,name,semester_id&order=order_index.asc`);
  console.log(`Subjects: ${subjects.length}`);

  // ── 4. Get all sessions ─────────────────────────────────────
  const subIds = subjects.map(s => s.id).join(',');
  const sessions = await get(`/sessions?subject_id=in.(${subIds})&select=id,number,title,video_url,subject_id&order=order_index.asc`);
  console.log(`Sessions: ${sessions.length}`);

  // ── 5. Get existing quizzes ─────────────────────────────────
  const sesIds = sessions.map(s => s.id).join(',');
  const quizzes = await get(`/quizzes?session_id=in.(${sesIds})&select=id,session_id,title`);
  console.log(`Existing quizzes: ${quizzes.length}`);

  const quizMap = {};
  quizzes.forEach(q => { quizMap[q.session_id] = q; });

  const subjectMap = {};
  subjects.forEach(s => { subjectMap[s.id] = s; });

  // ── 6. Process each session ─────────────────────────────────
  console.log('\n' + '─'.repeat(65));
  let videoPatched = 0, quizCreated = 0, questionsCreated = 0;
  let videoErrors = 0, quizErrors = 0;

  for (const session of sessions) {
    const subject = subjectMap[session.subject_id];
    const code = subject?.code || 'UNKNOWN';
    const hasQuiz = !!quizMap[session.id];
    const videoUrl = VIDEO_MAP[code];
    const quizDef = QUIZ_MAP[code];

    console.log(`\n[${code}] ${session.title}`);
    console.log(`  Session ID: ${session.id}`);
    console.log(`  Video: ${session.video_url ? 'EXISTS' : 'MISSING'} → ${videoUrl || 'NO MAP ENTRY'}`);
    console.log(`  Quiz:  ${hasQuiz ? 'EXISTS (skip)' : 'MISSING'}`);

    // ── PATCH video_url ──────────────────────────────────────
    if (videoUrl) {
      try {
        await patch('sessions', session.id, { video_url: videoUrl });
        console.log(`  [OK] video_url patched`);
        videoPatched++;
      } catch (e) {
        console.error(`  [ERR] video patch: ${e.message}`);
        videoErrors++;
      }
    } else {
      console.log(`  [SKIP] No video mapping for code: ${code}`);
    }

    // ── INSERT quiz if missing ───────────────────────────────
    if (!hasQuiz && quizDef) {
      try {
        const quiz = await post('quizzes', {
          session_id: session.id,
          title: quizDef.title,
          pass_percentage: 70,
          max_attempts: 3,
          is_active: true,
        });
        console.log(`  [OK] Quiz created: ${quiz.id}`);
        quizCreated++;

        for (let i = 0; i < quizDef.questions.length; i++) {
          const qd = quizDef.questions[i];
          await postMin('quiz_questions', {
            quiz_id: quiz.id,
            question_text: qd.q,
            question_type: 'multiple_choice',
            options: qd.o,           // already a JSON string
            explanation: qd.exp,
            points: 1,
            order_index: i + 1,
          });
          questionsCreated++;
        }
        console.log(`  [OK] ${quizDef.questions.length} questions inserted`);

      } catch (e) {
        console.error(`  [ERR] quiz create: ${e.message}`);
        quizErrors++;
      }
    } else if (!hasQuiz && !quizDef) {
      console.log(`  [SKIP] No quiz definition for code: ${code}`);
    }

    await sleep(150); // avoid rate limiting
  }

  // ── 7. Verification pass ────────────────────────────────────
  console.log('\n' + '='.repeat(65));
  console.log('VERIFICATION');
  console.log('='.repeat(65));

  const sessionsV = await get(`/sessions?subject_id=in.(${subIds})&select=id,title,video_url,subject_id&order=order_index.asc`);
  const quizzesV  = await get(`/quizzes?session_id=in.(${sesIds})&select=id,session_id`);
  const quizMapV  = {};
  quizzesV.forEach(q => { quizMapV[q.session_id] = true; });

  let noVideoFinal = 0, noQuizFinal = 0;
  for (const s of sessionsV) {
    const code = subjectMap[s.subject_id]?.code || '?';
    const v = !!s.video_url;
    const q = !!quizMapV[s.id];
    if (!v) { console.log(`  MISSING VIDEO: [${code}] ${s.title}`); noVideoFinal++; }
    if (!q) { console.log(`  MISSING QUIZ:  [${code}] ${s.title}`); noQuizFinal++; }
  }

  console.log('\n' + '─'.repeat(65));
  console.log(`Total sessions:      ${sessionsV.length}`);
  console.log(`Videos patched:      ${videoPatched}  (errors: ${videoErrors})`);
  console.log(`Quizzes created:     ${quizCreated}   (errors: ${quizErrors})`);
  console.log(`Questions inserted:  ${questionsCreated}`);
  console.log(`Final missing video: ${noVideoFinal}`);
  console.log(`Final missing quiz:  ${noQuizFinal}`);

  if (noVideoFinal === 0 && noQuizFinal === 0) {
    console.log('\n  ALL 27 SESSIONS COMPLETE: video + quiz');
  } else {
    console.log('\n  Some sessions still incomplete — review errors above');
  }
  console.log('='.repeat(65));
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
